# q2.js (gh6-64, gh6-65, gh6-66, gh6-final) számainak ellenőrzése
# uv run -q --with networkx --with numpy --with scipy python -I qcheck2_calc.py
import itertools as it
from math import comb
import random
import networkx as nx
import numpy as np


def H(t):
    print("\n=== " + t)


# ---------------------------------------------------------------- előjeles segédek
def sgraph(spec):
    """'AB+ BC-' -> dict frozenset -> +-1"""
    S = {}
    for tok in spec.split():
        a, b, s = tok[0], tok[1], tok[2]
        S[frozenset((a, b))] = 1 if s == "+" else -1
    return S


def nodes_of(S):
    return sorted({v for e in S for v in e})


def triangles(S):
    V = nodes_of(S)
    out = []
    for a, b, c in it.combinations(V, 3):
        es = [frozenset((a, b)), frozenset((b, c)), frozenset((a, c))]
        if all(e in S for e in es):
            p = S[es[0]] * S[es[1]] * S[es[2]]
            out.append(("".join((a, b, c)), [S[e] for e in es], p))
    return out


def violations(S, part):
    """part: dict node -> 0/1; hány él sérti a kéttáboros beosztást"""
    bad = []
    for e, s in S.items():
        a, b = tuple(e)
        same = part[a] == part[b]
        if (s == 1 and not same) or (s == -1 and same):
            bad.append("".join(sorted(e)))
    return bad


def frustration(S):
    V = nodes_of(S)
    best = None
    for bits in it.product((0, 1), repeat=len(V) - 1):
        part = dict(zip(V, (0,) + bits))
        b = violations(S, part)
        if best is None or len(b) < len(best[0]):
            best = (b, part)
    return len(best[0]), best


def balanced(S):
    return frustration(S)[0] == 0


def camps(S):
    k, (b, part) = frustration(S)
    if k:
        return None
    V = nodes_of(S)
    return sorted(["".join(v for v in V if part[v] == g) for g in (0, 1)], key=len, reverse=True)


def weakly_balanced(S):
    """nincs pontosan egy negatív élű kör <=> a pozitív komponenseken belül nincs negatív él"""
    G = nx.Graph()
    G.add_nodes_from(nodes_of(S))
    G.add_edges_from(tuple(e) for e, s in S.items() if s == 1)
    comp = {v: i for i, c in enumerate(nx.connected_components(G)) for v in c}
    ok = all(comp[tuple(e)[0]] != comp[tuple(e)[1]] for e, s in S.items() if s == -1)
    groups = sorted("".join(sorted(c)) for c in nx.connected_components(G))
    return ok, groups


def single_flips_that_balance(S):
    res = []
    for e in S:
        T = dict(S)
        T[e] = -T[e]
        if balanced(T):
            res.append("".join(sorted(e)))
    return res


# ================================================================ gh6-64
H("64/Q1: Ell-Ko -, Ko-Szak +, mi legyen Ell-Szak")
for s in (+1, -1):
    print("  Ell-Szak", s, "-> szorzat", (-1) * (+1) * s)

H("64/Q2: K4 AB+, CD-, a többi -")
S = sgraph("AB+ CD- AC- AD- BC- BD-")
for t in triangles(S):
    print("  ", t)
print("  feszült háromszög:", sum(1 for t in triangles(S) if t[2] < 0))
print("  frusztráció:", frustration(S)[0], frustration(S)[1][0])
print("  gyengén kiegyensúlyozott:", weakly_balanced(S))
S0 = sgraph("AB+ CD+ AC- AD- BC- BD-")
print("  (CD+ változat) kiegyensúlyozott:", balanced(S0), camps(S0))
# rossz válasz: ha a --- -t stabilnak veszi
print("  --- stabilnak véve feszült háromszög:", sum(1 for t in triangles(S) if t[1].count(-1) == 1))

H("64/Q3: 5-kör AB+, BC-, CD-, DE+, EA+")
S = sgraph("AB+ BC- CD- DE+ EA+")
print("  kiegyensúlyozott:", balanced(S), camps(S))
print("  {A,B}/{C,D,E} hibái:", violations(S, {"A": 0, "B": 0, "C": 1, "D": 1, "E": 1}))
print("  háromszög:", triangles(S))

H("64/Q4: AB+, BC+, CA+, CD+, DE+, EA-")
S = sgraph("AB+ BC+ CA+ CD+ DE+ EA-")
print("  háromszögek:", triangles(S))
print("  kiegyensúlyozott:", balanced(S), " frusztráció:", frustration(S)[0])
print("  {A,B,C,D}/{E} hibái:", violations(S, {"A": 0, "B": 0, "C": 0, "D": 0, "E": 1}))
G = nx.Graph([tuple(e) for e in S])
for cyc in nx.simple_cycles(G):
    es = [frozenset((cyc[i], cyc[(i + 1) % len(cyc)])) for i in range(len(cyc))]
    print("  kör", "-".join(cyc), "mínuszok:", sum(1 for e in es if S[e] < 0))
print("  egy-fordításos javítások:", single_flips_that_balance(S))

H("64/Q5 multi: fa, ---")
S = sgraph("AB- BC+ BD- DE-")
print("  fa kiegyensúlyozott:", balanced(S))
S = sgraph("AB- BC- AC-")
print("  --- kiegyensúlyozott:", balanced(S), " gyengén:", weakly_balanced(S))

H("64/Q7 + 66: Árvízhét előjeles gráf")
# Ko=K, Vi=V, Po=P, Sz=S, La=L, Ön=O
A = sgraph("KV+ SV+ PK+ VP+ SK- LO+ PL+ PO+")
print("  háromszögek:", triangles(A))
tri = triangles(A)
print("  kiegyensúlyozott arány:", sum(1 for t in tri if t[2] > 0), "/", len(tri))
print("  frusztráció:", frustration(A)[0])
print("  egyetlen fordítással javítható:", single_flips_that_balance(A))
for e in ("SK", "SV"):
    T = dict(A); T[frozenset(e)] *= -1
    print("   ", e, "fordítva táborok:", camps(T))
T = dict(A); T[frozenset("KV")] = -1
print("  KV- után feszült háromszögek:", [t[0] for t in triangles(T) if t[2] < 0], " frusztráció:", frustration(T)[0])
print("  KV- után {K,P,L,O}/{V,S} hibái:", violations(T, {"K": 0, "P": 0, "L": 0, "O": 0, "V": 1, "S": 1}))
print("  SV- után {S,V}/többi hibái:", violations(dict(A, **{}) | {frozenset("SV"): -1}, {"S": 1, "V": 1, "K": 0, "P": 0, "L": 0, "O": 0}))
print("  SK+ után {S,K}/többi hibái:", violations(A | {frozenset("SK"): 1}, {"S": 1, "K": 1, "V": 0, "P": 0, "L": 0, "O": 0}))

# ================================================================ gh6-65
H("65/Q1: z = (52-40)/5")
print("  z =", (52 - 40) / 5, " nem osztva:", 52 - 40, " hányados:", 52 / 40, " 52/5:", 52 / 5)

H("65/Q2: G(5,6) várható háromszögszám")
p = (6 * 5 * 4) / (10 * 9 * 8)
print("  p =", p, " várható =", comb(5, 3) * p, " (0,6)^3*10 =", 10 * 0.6 ** 3, " p =", p, " 60*p =", 60 * p)
# szimuláció
rng = random.Random(1)
pairs = list(it.combinations(range(5), 2))
cnt = []
for _ in range(200000):
    E = rng.sample(pairs, 6)
    G = nx.Graph(E); G.add_nodes_from(range(5))
    cnt.append(sum(nx.triangles(G).values()) / 3)
print("  szimuláció átlag:", np.mean(cnt))

H("65/Q3: Árvízhét nullmodellek")
AG = nx.Graph([("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")])
print("  háromszögek:", sum(nx.triangles(AG).values()) // 3)
ex = 35 * (10 * 9 * 8) / (21 * 20 * 19)
print("  G(7,10) várható:", ex, " p:", (10 * 9 * 8) / (21 * 20 * 19))
rng = random.Random(2)
pairs = list(it.combinations(range(7), 2))
cnt = []
for _ in range(40000):
    G = nx.Graph(rng.sample(pairs, 10))
    cnt.append(sum(nx.triangles(G).values()) / 3)
cnt = np.array(cnt)
print("  G(7,10) szim átlag, szórás:", cnt.mean(), cnt.std(), " z:", (4 - cnt.mean()) / cnt.std())


def degseq_sim(G0, N, seed, swaps_per=10):
    rng = random.Random(seed)
    G = G0.copy()
    m = G.number_of_edges()
    out = []
    for _ in range(N):
        nx.double_edge_swap(G, nswap=swaps_per * m // 2 + 1, max_tries=10 ** 6, seed=rng.randrange(10 ** 9))
        out.append(sum(nx.triangles(G).values()) / 3)
    return np.array(out)


d = degseq_sim(AG, 4000, 3)
print("  fokszámtartó átlag, szórás:", d.mean(), d.std(), " z (2,4/0,8):", (4 - 2.4) / 0.8, " P(>=4):", (d >= 4).mean())

H("65/Q4: karate")
K = nx.Graph(nx.karate_club_graph().edges())
t = sum(nx.triangles(K).values()) // 3
n, m = K.number_of_nodes(), K.number_of_edges()
M = comb(n, 2)
exK = comb(n, 3) * (m * (m - 1) * (m - 2)) / (M * (M - 1) * (M - 2))
print("  háromszög:", t, " G(n,m) várható:", exK, " z (15,6;3,8):", (45 - 15.6) / 3.8, " fokszámtartó z (39,3;4,7):", (45 - 39.3) / 4.7)
dk = degseq_sim(K, 1500, 4)
print("  karate fokszámtartó átlag, szórás:", dk.mean(), dk.std(), " P(>=45):", (dk >= 45).mean())


def ffl_cycles(edges):
    D = nx.DiGraph(edges)
    ffl = cyc = 0
    for tri in it.combinations(D.nodes(), 3):
        for x, y, z in it.permutations(tri):
            if D.has_edge(x, y) and D.has_edge(y, z) and D.has_edge(x, z):
                ffl += 1
        # irányított 3-kör (minden kör 3-szor jelenik meg a permutációk közt)
        c = sum(1 for x, y, z in it.permutations(tri) if D.has_edge(x, y) and D.has_edge(y, z) and D.has_edge(z, x))
        cyc += c // 3
    und = nx.Graph(D.to_undirected())
    return ffl, cyc, sum(nx.triangles(und).values()) // 3


H("65/Q5: A->B, B->C, A->C, C->D, B->D")
print("  (FFL, 3-kör, irányítatlan háromszög):", ffl_cycles([("A","B"),("B","C"),("A","C"),("C","D"),("B","D")]))
H("65 szöveg 4. gyakorló: A->B, B->C, C->A, A->C")
print("  ", ffl_cycles([("A","B"),("B","C"),("C","A"),("A","C")]))

# ================================================================ gh6-66
H("66/Q2-3: gyári háromszögek")
print("  csak összerakott: C_D =", 3 / 21, " 3 nélkül:", 1 / 21, " összerakott arány:", 1 / 4, " eredeti:", 12 / 21)
print("  4 szereplős cikk: C(4,3) =", comb(4, 3), " C(4,2) =", comb(4, 2), " 4*3*2 =", 24)

H("66/Q4: szerda este")
W = nx.Graph([("Ko","Vi"),("Vi","Sz"),("La","Ön"),("Po","Vi"),("Ko","Po"),("Po","La")]); W.add_node("Kl")
tr = sum(nx.triangles(W).values()) // 3
wed = sum(comb(k, 2) for _, k in W.degree())
print("  élszám", W.number_of_edges(), " háromszög", tr, " C̄", nx.average_clustering(W), " C_D", nx.transitivity(W), " hármas", wed, " 3 nélkül:", tr / wed, " 3/7:", 3 / 7)

H("66/Q5: nyitott hármasok, köztesség")
for v in AG:
    k = AG.degree(v)
    print("  ", v, "k", k, "T", nx.triangles(AG)[v], "nyitott", comb(k, 2) - nx.triangles(AG)[v], "C", round(nx.clustering(AG)[v], 3))
print("  köztesség:", nx.betweenness_centrality(AG, normalized=False))
po = sorted(AG["Po"])
print("  Po nyitott párjai:", [(a, b) for a, b in it.combinations(po, 2) if not AG.has_edge(a, b)])

H("66/Q7: blogok, Árvízhét, karate")
s = 0.48 ** 2 + 0.52 ** 2
print("  blog véletlen szint", s, " r =", (0.906 - s) / (1 - s))
civ = {v: ("c" if v in ("La", "Ön") else "e") for v in AG}
nx.set_node_attributes(AG, civ, "t")
print("  Árvízhét r =", nx.attribute_assortativity_coefficient(AG, "t"), " r_k =", nx.degree_assortativity_coefficient(AG))
print("  Árvízhét C̄ =", nx.average_clustering(AG), " C_D =", nx.transitivity(AG))
club = nx.karate_club_graph()
nx.set_node_attributes(K, {v: club.nodes[v]["club"] for v in K}, "club")
cross = sum(1 for a, b in K.edges() if K.nodes[a]["club"] != K.nodes[b]["club"])
print("  karate: táborok közt", cross, " belső arány", (78 - cross) / 78, " r =", nx.attribute_assortativity_coefficient(K, "club"),
      " r_k =", nx.degree_assortativity_coefficient(K), " C̄ =", nx.average_clustering(K), " C_D =", nx.transitivity(K))

# ================================================================ gh6-final
H("F1, F5: élek AB, AC, AD, BC, BD, DE")
F = nx.Graph([("A","B"),("A","C"),("A","D"),("B","C"),("B","D"),("D","E")])
print("  C_i:", nx.clustering(F))
print("  C̄ =", nx.average_clustering(F), " C_D =", nx.transitivity(F))
cl = nx.clustering(F)
print("  C̄ a k<2 csúcs nélkül:", np.mean([cl[v] for v in F if F.degree(v) >= 2]))
wed = sum(comb(k, 2) for _, k in F.degree()); tr = sum(nx.triangles(F).values()) // 3
print("  hármas", wed, " háromszög", tr, " 3 nélkül:", tr / wed)


def overlap(G, i, j, endpoints=False):
    Ni, Nj = set(G[i]), set(G[j])
    num = len(Ni & Nj)
    den = Ni | Nj if endpoints else (Ni | Nj) - {i, j}
    return num, len(den)


for e in (("A","B"), ("A","D"), ("D","E"), ("A","C")):
    print("  O", e, overlap(F, *e), " végpontokkal:", overlap(F, *e, endpoints=True))
print("  hidak:", list(nx.bridges(F)))
# O_AD rossz válaszok: 1/2 (közös / |N(A)-D|), 1/4 (egyik végpont a nevezőben)
print("  |N(A)-D| =", len(set(F["A"]) - {"D"}), " N(A)uN(D) - {A} :", len((set(F["A"]) | set(F["D"])) - {"A"}))

H("F2: (A^3)_ii = 6, k = 4")
T = 6 / 2
print("  T =", T, " C =", T / comb(4, 2), " 6/6 =", 6 / comb(4, 2), " 3/12 =", 3 / 12, " 6/16 =", 6 / 16)
Ad = nx.to_numpy_array(AG, nodelist=list(AG))
A3 = np.linalg.matrix_power(Ad, 3)
print("  Árvízhét (A^3)_ii:", dict(zip(AG, np.diag(A3))), " tr:", np.trace(A3))

H("F3: 12 piros-piros, 4 kék-kék, 4 piros-kék")
pr, kk, pk = 12, 4, 4
m = pr + kk + pk
ap, ak = (2 * pr + pk) / (2 * m), (2 * kk + pk) / (2 * m)
inner = (pr + kk) / m
rs = ap ** 2 + ak ** 2
print("  a =", ap, ak, " belső", inner, " véletlen", rs, " r =", (inner - rs) / (1 - rs), " 2*belső-1 =", 2 * inner - 1, " számláló:", inner - rs)
# networkx-szel is
G = nx.Graph(); c = 0
def add(n, col):
    global c
    for _ in range(n):
        u, v = c, c + 1; c += 2
        G.add_edge(u, v); G.nodes[u]["c"] = col[0]; G.nodes[v]["c"] = col[1]
add(pr, "pp"); add(kk, "kk"); add(pk, "pk")
print("  networkx r =", nx.attribute_assortativity_coefficient(G, "c"))

H("F4: r_k kis gráfok")
print("  csillag(4):", nx.degree_assortativity_coefficient(nx.star_graph(4)))
KK = nx.disjoint_union(nx.complete_graph(5), nx.complete_graph(2))
print("  K5+K2:", nx.degree_assortativity_coefficient(KK))
print("  P4:", nx.degree_assortativity_coefficient(nx.path_graph(4)), " P5:", nx.degree_assortativity_coefficient(nx.path_graph(5)))
import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    print("  C5:", nx.degree_assortativity_coefficient(nx.cycle_graph(5)))

H("F7: hiányzó párok közös társai (Árvízhét)")
for a, b in it.combinations(sorted(AG), 2):
    if not AG.has_edge(a, b):
        print("  ", a, b, len(set(AG[a]) & set(AG[b])))

H("F8: teljes kiegyensúlyozott 4 + 3 tábor")
print("  negatív", 4 * 3, " pozitív", comb(4, 2) + comb(3, 2), " összes", comb(7, 2), " sorrendes pozitív", 4 * 3 + 3 * 2, " 6/15:", 4 * 3 // 2, comb(7, 2) - 6)
S = {}
X, Y = "ABCD", "EFG"
for a, b in it.combinations(X + Y, 2):
    S[frozenset((a, b))] = 1 if ((a in X) == (b in X)) else -1
print("  ellenőrzés: kiegyensúlyozott", balanced(S), " neg", sum(1 for s in S.values() if s < 0), " poz", sum(1 for s in S.values() if s > 0))

H("F9: 6-kör AB+, BC-, CD+, DE-, EF+, FA-")
S = sgraph("AB+ BC- CD+ DE- EF+ FA-")
print("  kiegyensúlyozott:", balanced(S), " frusztráció:", frustration(S)[0], " gyengén:", weakly_balanced(S))
print("  {A,B}/{C,D,E,F} hibái:", violations(S, {"A": 0, "B": 0, "C": 1, "D": 1, "E": 1, "F": 1}))

H("F10: z két nullmodellben (30; 12, 3; 26, 4)")
print("  z1 =", (30 - 12) / 3, " z2 =", (30 - 26) / 4, " osztás nélkül:", 30 - 12, 30 - 26)

H("F11: lapok + egy új él")
base = [("EK","RH"),("NY","EK"),("VN","RH"),("VN","NY")]
print("  alap:", ffl_cycles(base))
for e in (("RH","NY"), ("NY","RH"), ("VN","EK"), ("RH","EK"), ("EK","VN"), ("RH","VN")):
    D = nx.DiGraph(base + [e])
    print("  +", e, "(FFL, 3-kör, háromszög):", ffl_cycles(base + [e]), " körök:", list(nx.simple_cycles(D)))

H("F13: Árvízhét vegyes")
print("  O(Ko,Po) =", overlap(AG, "Ko", "Po"), " helyi híd:", [e for e in AG.edges() if overlap(AG, *e)[0] == 0])
