# q2 kvízek (gh10-105 … gh10-108, gh10-final) számainak ellenőrzése: ./run.sh qcheck2_calc.py
from common import *
from math import comb, exp, log, sqrt, factorial
from scipy.optimize import minimize
sg = lambda x: exp(x) / (1 + exp(x))
def pr(*a): print(*[round(x, 4) if isinstance(x, float) else x for x in a])

# ---------- Árvízhét szereplőgráf
W = {("Ko","Vi"):2,("Ko","Po"):2,("Vi","Po"):2,("Vi","Sz"):1,("Sz","Kl"):2,("Ko","Sz"):1,("Ko","Kl"):1,("La","Ön"):3,("Po","La"):2,("Po","Ön"):2}
G = nx.Graph(); G.add_nodes_from(ACT)
for (u, v), w in W.items(): G.add_edge(u, v, weight=w)
M = comat(ART); assert all(M[ACT.index(u), ACT.index(v)] == w for (u, v), w in W.items()) and M.sum() / 2 == sum(W.values())
print("== 10.5 globális küszöb")
for t in [2, 3]:
    H = nx.Graph(); H.add_nodes_from(ACT); H.add_edges_from(e for e, w in W.items() if w >= t)
    pr("w>=", t, H.number_of_edges(), "él", [sorted(c) for c in nx.connected_components(H) if len(c) > 1])
H = nx.Graph(); H.add_nodes_from(ACT); H.add_edges_from(e for e, w in W.items() if w > 2); pr("w>2:", list(H.edges()))
print("== 10.5 diszparitás")
alpha = lambda w, ws: (1 - w / sum(ws)) ** (len(ws) - 1)
pr("10,1,1,1: helyes", alpha(10, [10,1,1,1]), "k kitevő", (3/13)**4, "w/s", (10/13)**3, "kitevő 1", 3/13)
pr("7,2,1: helyes", alpha(7, [7,2,1]), "k kitevő", 0.3**3, "w/s", 0.7**2, "kitevő 1", 0.3)
pr("1 fokú:", alpha(4, [4]))
pr("u 6,3,1:", alpha(6, [6,3,1]), " v 6,1,1,1,1:", alpha(6, [6,1,1,1,1]))
a_min = {}
for (u, v), w in W.items():
    su = [d["weight"] for _, _, d in G.edges(u, data=True)]; sv = [d["weight"] for _, _, d in G.edges(v, data=True)]
    a_min[(u, v)] = min(alpha(w, su), alpha(w, sv))
pr("Árvízhét legkisebb α-k:", sorted(a_min.items(), key=lambda x: x[1])[:4])
print("== Bonferroni")
pr("21 pár:", 0.05/21, " 50 szereplő:", comb(50, 2), 0.05/comb(50, 2), "/50:", 0.05/50, "rendezett:", 0.05/(50*49), "/21", 0.05/21)
print("== Les Mis: ugyanannyi él")
L = nx.les_miserables_graph(); pr("Les Mis", L.number_of_nodes(), L.number_of_edges())
def disp(Gr, a):
    keep = []
    for u, v, d in Gr.edges(data=True):
        su = [x["weight"] for _, _, x in Gr.edges(u, data=True)]; sv = [x["weight"] for _, _, x in Gr.edges(v, data=True)]
        if min(alpha(d["weight"], su), alpha(d["weight"], sv)) < a: keep.append((u, v))
    return keep
for a in [0.05, 0.1, 0.2, 0.3]:
    k = disp(L, a); topk = sorted(L.edges(data=True), key=lambda e: -e[2]["weight"])[:len(k)]
    pr("α", a, len(k), "él", len({x for e in k for x in e}), "szereplő; globális:", len({x for e in topk for x in e[:2]}))
pr("Marius–Enjolras súly", L["Marius"]["Enjolras"]["weight"], "α=0,2-nél benne?", ("Marius","Enjolras") in disp(L, 0.2) or ("Enjolras","Marius") in disp(L, 0.2))

print("== 10.6 köztesség")
def btw(Gr): return {k: round(v, 2) for k, v in nx.betweenness_centrality(Gr, normalized=False).items() if v}
pr("alap", btw(G))
for e in [("Ko","Po"), ("Vi","Po"), ("Vi","Sz"), ("La","Ön"), ("Ko","Kl"), ("Sz","Kl")]:
    H = G.copy(); H.remove_edge(*e); pr("-", e, btw(H), "Ko fok", H.degree("Ko"))
pr("karate 20%: első hely változik", 1 - 0.90, " 1-ρ", 1 - 0.86)
pr("rács:", 4**3, 3*4, 3**4, 4**2)

print("== 10.7 ERGM")
pr("8 csúcs 7 él: p", 7/28, "θ", log(0.25/0.75), "ln p", log(0.25), "fordítva", log(0.75/0.25))
pr("(-1,5; 0,5) c=3:", sg(-1.5 + 1.5), "c=0", sg(-1.5), "c=1", sg(-1), "θ_él nélkül", sg(1.5))
graphs = []
pairs = list(itertools.combinations(range(4), 2))
for m in range(64):
    E = [pairs[i] for i in range(6) if m >> i & 1]
    t = sum(1 for tri in itertools.combinations(range(4), 3) if all(p in E for p in itertools.combinations(tri, 2)))
    graphs.append((len(E), t, E))
from collections import Counter
pr("csoportok", sorted(Counter((e, t) for e, t, _ in graphs).items()))
pr("3 él, 0 háromszög:", sum(1 for e, t, _ in graphs if e == 3 and t == 0), "összes 3 élű", comb(6, 3))
pr("θ=0: E[él]", np.mean([e for e, _, _ in graphs]), "E[Δ]", np.mean([t for _, t, _ in graphs]), "egy háromszög esélye", 0.5**3)
def fit(e0, t0):
    S = np.array([(e, t) for e, t, _ in graphs], float)
    nll = lambda th: -(th @ [e0, t0]) + np.log(np.exp(S @ th).sum())
    r = minimize(nll, [0, 0], method="BFGS", options={"maxiter": 2000, "gtol": 1e-10})
    return r.x, r.fun
for name, (e0, t0) in {"háromszög+lógó": (4, 1), "háromszög+magányos": (3, 1), "3 élű út": (3, 0), "4-kör": (4, 0), "K4-1 él": (5, 2), "teljes": (6, 4)}.items():
    x, f = fit(e0, t0); pr(name, np.round(x, 3), "nll", f)
pr("független modell, p=2/3: E[Δ]", 4 * (2/3)**3)
pr("final (-1; 0,7) c=2:", sg(-1 + 1.4), "c=0", sg(-1), "c=1", sg(-0.3), "logit", -1 + 1.4)

print("== final 10.1–10.4")
A = {"AB": 3, "AC": 1}; B = {"AB": 1, "AC": 1, "BC": 2}; K = set(A) | set(B)
mn = sum(min(A.get(k, 0), B.get(k, 0)) for k in K); mx = sum(max(A.get(k, 0), B.get(k, 0)) for k in K)
pr("súlyozott J", mn / mx, "bináris", len(set(A) & set(B)) / len(K), "min/összeg", mn / (sum(A.values()) + sum(B.values())), "csak közös", mn / sum(max(A[k], B[k]) for k in set(A) & set(B)))
nodes = "ABCDE"; ix = {c: i for i, c in enumerate(nodes)}
def mat(es):
    X = np.zeros((5, 5))
    for e in es: X[ix[e[0]], ix[e[1]]] = X[ix[e[1]], ix[e[0]]] = 1
    return X
X, Y = mat(["AB", "AC", "BC"]), mat(["AB", "AC", "DE"]); x, y = offdiag(X), offdiag(Y)
a = int(((x == 1) & (y == 1)).sum()); b = int(((x == 1) & (y == 0)).sum()); c = int(((x == 0) & (y == 1)).sum()); d = int(((x == 0) & (y == 0)).sum())
pr("φ", corr(X, Y), (a, b, c, d), "J", a / (a + b + c), "egyezés", (a + d) / 10, "a/(a+b)", a / (a + b))
r0, rs = qap_exact(X, Y); pr("φ QAP p", np.mean(rs >= r0 - 1e-12))
pr("QAP 5 csúcs: 3/120", 3/120, "2/120", 2/120, "(k+1)/(M+1)", 4/121, "2x", 6/120)
p = 20/1000; pr("véletlen perm: p", p, "k/M", 19/999, "SE", sqrt(p*(1-p)/999), "SE M=99", sqrt(p*(1-p)/99))
pr("bináris magyarázó: b1", 18/30 - 14/70, "b0", 14/70, "arány", (18/30)/(14/70), "fordított", 18/32)
pr("final 8: v felől w/s hiba", 0.6**4, " Les Mis/karate: 5% él", 78*0.05, " Bonferroni hamis", 0.05*1225)
