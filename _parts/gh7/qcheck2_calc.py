# q2.js (gh7-74, gh7-75, gh7-76, gh7-final) – minden szám ellenőrzése
# uv run -q --with networkx --with numpy --with scipy python -I qcheck2_calc.py
import itertools, random, math
from math import comb, prod, sqrt, log, exp
from collections import Counter
import numpy as np, networkx as nx
from scipy.stats import norm

def dfact(n): return prod(range(n, 0, -2)) if n > 0 else 1

def matchings(stubs):
    if not stubs: yield []; return
    a = stubs[0]
    for i in range(1, len(stubs)):
        rest = stubs[1:i] + stubs[i+1:]
        for m in matchings(rest): yield [(a, stubs[i])] + m

def config_enum(deg):
    stubs = [(v, j) for v, k in enumerate(deg) for j in range(k)]
    res = Counter()
    for M in matchings(stubs):
        edges = [tuple(sorted((x[0], y[0]))) for x, y in M]
        loops = sum(u == v for u, v in edges)
        multi = len(edges) - len(set(edges))
        res["simple" if loops == 0 and multi == 0 else ("loop" if loops else "multi")] += 1
        res["total"] += 1
    return res

print("=== 7.4 ===")
for d in [(2, 1, 1), (1, 1, 1, 1), (2, 2), (3, 1, 1, 1), (2, 2, 2), (3, 3), (2, 1, 1, 1, 1)]:
    print(d, "(2m-1)!! =", dfact(sum(d) - 1), dict(config_enum(list(d))))
# star among (3,1,1,1): simple ones
print("19!! =", dfact(19), " 20!! (rossz) =", prod(range(20, 0, -2)), " 20! =", math.factorial(20))
print("Ko-Po 16/19 =", 16/19, " 16/20 =", 16/20, " 16/10 =", 16/10, " 4+4/20 =", 8/20)
print("Ko-Kl 8/19 =", 8/19, " La-On 4/19 =", 4/19)
print("4,3,m=20: /40", 12/40, " /39", 12/39, " /20 (k_ik_j/m)", 12/20, " (4+3)/40", 7/40)
print("hubs 351*306/33428 =", 351*306/33428, " /16714 =", 351*306/16714, " (351+306)/33428 =", 657/33428)
print("ER pár blogok 2m/(n(n-1)) =", 33428/(1222*1221))
print("loops Árvízhét 21/19 =", 21/19, " sum C(k,2) =", sum(comb(k, 2) for k in (4, 4, 3, 3, 2, 2, 2)))
print("z (4-2.40)/0.84 =", (4-2.40)/0.84, " normal tail", 1-norm.cdf((4-2.40)/0.84))
print("p 500/4: 5/501 =", 5/501, " 4/500 =", 4/500, " 1/501 =", 1/501, " (1+496)/501 =", 497/501)
print("z 18,12,1.5:", (18-12)/1.5, " var:", 6/1.5**2, " ratio:", 18/12)
print("1000, 0: 1/1001 =", 1/1001)
print("10/20 edge, 100 él: 200/200 =", 200/200)
# Kis élcsere-példa: élek AB, CD (4 csúcs, minden fok 1) – hány gráf a nullmodellben
# 2 egyszerű gráf (AB,CD), (AC,BD), (AD,BC) = 3
# Élcsere a két háromszögön
T = nx.Graph([(1,2),(2,3),(3,1),(4,5),(5,6),(6,4)])
H = nx.Graph([(1,2),(2,3),(3,4),(4,5),(5,6),(6,1)])
print("két háromszög:", sum(nx.triangles(T).values())//3, nx.number_connected_components(T),
      " hatszög:", sum(nx.triangles(H).values())//3, nx.number_connected_components(H))
# élcsere-kérdés: élek 1-2, 2-3, 3-4, 4-5 (5 csúcsú út); csere 1-2 & 4-5 -> 1-5, 4-2 vagy 1-4, 5-2
P = [(1,2),(2,3),(3,4),(4,5)]
for new in ([(1,5),(4,2)], [(1,4),(5,2)]):
    E = [(2,3),(3,4)] + new
    g = nx.Graph(E)
    print("csere", new, "egyszerű?", len(set(tuple(sorted(e)) for e in E)) == 4,
          "fokok", sorted(dict(g.degree()).items()), "kör?", nx.cycle_basis(g))

# Árvízhét háromszög-nullmodellek
AE = [("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
G = nx.Graph(AE)
print("Árvízhét fokok", dict(G.degree()), " háromszög", sum(nx.triangles(G).values())//3)
rng = random.Random(7)
tri = []
for _ in range(20000):
    R = nx.gnm_random_graph(7, 10, seed=rng.randrange(10**9)); tri.append(sum(nx.triangles(R).values())//3)
tri = np.array(tri); print("G(7,10): %.2f ± %.2f, z %.2f, P(>=4) %.3f" % (tri.mean(), tri.std(), (4-tri.mean())/tri.std(), (tri>=4).mean()))
tri = []
for _ in range(5000):
    H = G.copy(); nx.double_edge_swap(H, nswap=100, max_tries=10**5, seed=rng.randrange(10**9))
    tri.append(sum(nx.triangles(H).values())//3)
tri = np.array(tri); print("fokszámtartó: %.2f ± %.2f, z %.2f, P(>=4) %.3f, max %d" % (tri.mean(), tri.std(), (4-tri.mean())/tri.std(), (tri>=4).mean(), tri.max()))

print("=== 7.5 ===")
cikkek = [{"Ko","Vi"}, {"Ko","Vi","Po"}, {"Ko","Po"}, {"Vi","Sz"}, {"Sz","Kl","Ko"}, {"Sz","Kl"},
          {"La","Ön"}, {"La","Po","Ön"}, {"La","Ön"}, {"Po","Vi"}, {"Po","La"}, {"Ön","Po"}]
cnt = Counter(x for c in cikkek for x in c); print("cikkszám", dict(cnt), " említés", sum(cnt.values()))
pairs = Counter(frozenset(p) for c in cikkek for p in itertools.combinations(sorted(c), 2))
print("különböző párok", len(pairs), " súlyok", {"-".join(sorted(k)): v for k, v in pairs.items()})
hyp = [comb(4, j)*comb(8, 4-j) for j in range(5)]; print("hipergeom La-Ön", hyp, sum(hyp), [round(h/495, 3) for h in hyp])
print("P(>=3) =", (32+1)/495, " P(=3) =", 32/495, " P(>=2) =", (168+33)/495)
print("várható 4*4/12 =", 16/12, " a+b =", 8, " ab =", 16, " 4*4/27 =", 16/27)
print("Sz-Kl várható 3*2/12 =", 6/12, " P(2) = 3/66 =", 3/66, " 1/66 =", 1/66, " (3/12)^2 =", (3/12)**2, " 2/12 =", 2/12)
print("Po-La várható 6*4/12 =", 24/12)
print("RH: C(4,3)/C(12,3) =", 4/220, " (4/12)^3 =", (4/12)**3, " 1/220 =", 1/220, " 4/12 =", 4/12)
print("NySz: C(5,3)/C(12,3) =", 10/220, " (5/12)^3 =", (5/12)**3, " 1/220 =", 1/220, " 5/12 =", 5/12)
print("10 cikk, 3-3, mind közös: 1/C(10,3) =", 1/120)
# curveball szimuláció a páros nullmodellre
def curveball(S0, steps=200, rnd=random):
    S = [set(s) for s in S0]
    for _ in range(steps):
        a, b = rnd.sample(range(len(S)), 2)
        ab, ba = list(S[a]-S[b]), list(S[b]-S[a]); pool = ab+ba; rnd.shuffle(pool)
        k = S[a] & S[b]; S[a], S[b] = k | set(pool[:len(ab)]), k | set(pool[len(ab):])
    return S
rnd = random.Random(3); laon=[]; kovi=[]; szkl=[]; pola=[]; ndist=[]; ntri=[]
for _ in range(20000):
    S = curveball(cikkek, rnd=rnd)
    laon.append(sum({"La","Ön"} <= c for c in S)); kovi.append(sum({"Ko","Vi"} <= c for c in S))
    szkl.append(sum({"Sz","Kl"} <= c for c in S)); pola.append(sum({"Po","La"} <= c for c in S))
    g = nx.Graph([p for c in S for p in itertools.combinations(sorted(c), 2)])
    ndist.append(g.number_of_edges()); ntri.append(sum(nx.triangles(g).values())//3)
for name, a, obs in [("La-Ön", laon, 3), ("Ko-Vi", kovi, 2), ("Sz-Kl", szkl, 2), ("Po-La", pola, 2)]:
    a = np.array(a); print("páros null %s: várható %.3f szórás %.3f P(>=obs) %.4f z %.2f dist %s" % (
        name, a.mean(), a.std(), (a >= obs).mean(), (obs-a.mean())/a.std(), np.bincount(a)/len(a)))
ntri = np.array(ntri); print("páros null: különböző párok %.2f, háromszög %.2f ± %.2f, z %.2f, P(<=4) %.3f, P(>=4) %.3f" % (
    np.mean(ndist), ntri.mean(), ntri.std(), (4-ntri.mean())/ntri.std(), (ntri<=4).mean(), (ntri>=4).mean()))
# pontos eloszlásból (a szöveg számai)
dist = [0.306, 0.492, 0.185, 0.0175, 0.0003]
mu = sum(j*p for j, p in enumerate(dist)); sd = sqrt(sum(j*j*p for j, p in enumerate(dist)) - mu*mu)
print("szöveg eloszlás: várható %.3f szórás %.3f P(>=3) %.4f z(3) %.2f z(2) %.2f P(>=2) %.3f" % (
    mu, sd, dist[3]+dist[4], (3-mu)/sd, (2-mu)/sd, sum(dist[2:])))
# sakktábla-csere példa: 2. cikk {Ko,Vi,Po} és 9. cikk {La,Ön}: Po <-> La
print("=== 7.6 ===")
print("21 pár:", comb(7, 2), " 21*0.05 =", 21*0.05, " Bonf 0.05/21 =", 0.05/21, " 0.05/7 =", 0.05/7, " 0.05/42 =", 0.05/42, " 0.05/10 =", 0.05/10)
print("sigma blogok:", (0.32/0.022)/(2.74/2.51), " C-hányados", 0.32/0.022, " L-hányados", 2.74/2.51, " szorzat", (0.32/0.022)*(2.74/2.51))
print("sigma karate:", (0.57/0.13)/(2.41/2.40), (0.5706/0.132)/(2.408/2.396))
print("magyarázott arány 0.149/0.226 =", 0.149/0.226, " 0.022/0.226 =", 0.022/0.226, " 0.19/0.32 =", 0.19/0.32, " 1-0.659 =", 1-0.149/0.226)
print("blog z (0.226-0.149)/0.0003 =", (0.226-0.149)/0.0003, " különbség", 0.23-0.15, " hányados", 0.226/0.149)
print("max fok arány karate 17/9 =", 17/9, " blog 351/47 =", 351/47)
# karate triangles G(n,m) vs config z
K = nx.Graph(nx.karate_club_graph().edges()); print("karate", K.number_of_nodes(), K.number_of_edges(), sum(nx.triangles(K).values())//3,
    "trans %.3f avgC %.3f L %.3f" % (nx.transitivity(K), nx.average_clustering(K), nx.average_shortest_path_length(K)))
tg=[]; tc=[]
for _ in range(2000):
    tg.append(sum(nx.triangles(nx.gnm_random_graph(34, 78, seed=rng.randrange(10**9))).values())//3)
for _ in range(500):
    H = K.copy(); nx.double_edge_swap(H, nswap=780, max_tries=10**6, seed=rng.randrange(10**9)); tc.append(sum(nx.triangles(H).values())//3)
tg=np.array(tg); tc=np.array(tc)
print("karate háromszög G(n,m) %.1f±%.1f z %.1f; fokszámtartó %.1f±%.1f z %.1f" % (tg.mean(), tg.std(), (45-tg.mean())/tg.std(), tc.mean(), tc.std(), (45-tc.mean())/tc.std()))
print("120 cikk La-Ön (40,40): hipergeom várható", 40*40/120)

print("=== final: 7.1–7.3 ===")
print("G(10,0.2): C(10,2)p =", comb(10, 2)*0.2, " n^2 p =", 100*0.2, " n(n-1)p =", 90*0.2, " pn =", 0.2*10, " <k> =", 0.2*9)
print("G(12;0.25): pairs", comb(12, 2), " E(m) =", comb(12,2)*0.25, " <k> =", 11*0.25, " n^2p", 144*0.25, " n(n-1)p", 132*0.25)
print("n=1000: óriás p=1/n", 1/1000, " összefüggés ln n =", log(1000), " p=ln n/n =", log(1000)/1000)
print("n=10^4: ln n =", log(1e4), " ln n / n", log(1e4)/1e4)
print("ell 10^4,20 =", log(1e4)/log(20), " ln n =", log(1e4), " n/2k =", 1e4/40, " ln n/<k> =", log(1e4)/20)
for k in (2, 4, 6, 8, 10):
    print("gyűrű C(k=%d) = %.4f" % (k, 3*(k-2)/(4*(k-1))))
Rg = nx.watts_strogatz_graph(8, 4, 0); print("gyűrű 8,4: C", nx.average_clustering(Rg), "L", nx.average_shortest_path_length(Rg))
print("duplázás 2^g:", {g: 2**g for g in (2, 2.5, 3)}, " 10^2.5 =", 10**2.5)
print("CCDF -1.6 -> gamma 2.6")
print("BA (3,3,2,1,1): 3/10 =", 3/10, " 1/5 =", 1/5, " 3/5 =", 3/5, " 3/20 =", 3/20)
print("BA k_i m=3,t=900,t_i=9:", 3*sqrt(900/9), " m t/t_i =", 3*900/9, " sqrt =", sqrt(900/9), " t/t_i =", 900/9)
print("BA p_k m=2:", [2*2*3/(k*(k+1)*(k+2)) for k in (2, 3, 4)])
d = [3, 2, 2, 1]; k1 = np.mean(d); k2 = np.mean(np.square(d))
print("barátság (3,2,2,1): <k>", k1, " <k2>", k2, " <k2>/<k>", k2/k1, " <k>+Var", k1 + (k2-k1**2), " Var", k2-k1**2)
print("S(<k>=2): ", end="")
S = 0.5
for _ in range(200): S = 1-exp(-2*S)
print(S)
ml = [2, 2, 3, 4, 8]; print("ML 2,2,3,4,8:", 1 + 5/sum(log(k/1.5) for k in ml))

print("=== kiegészítő ===")
print("5 és 4, m=25: /50", 20/50, " /49", 20/49, " /m", 20/25, " (5+4)/50", 9/50)
print("Vi-Sz (3,3): 9/19 =", 9/19, " 9/10 =", 9/10, " 6/20 =", 6/20)
print("ln1000/ln10 =", log(1000)/log(10), " ln 1000 =", log(1000), " n/k =", 1000/10)
Rg = nx.watts_strogatz_graph(1000, 10, 0); print("gyűrű 1000,10 L =", nx.average_shortest_path_length(Rg), " n/2k =", 1000/20)
print("2000-ből 0: 1/2001 =", 1/2001, " 1/2000 =", 1/2000)
print("hamis pozitív 42*0.05 =", 42*0.05)
print("karate config C_Δ: z (0.26-0.22)/0.025 =", (0.26-0.22)/0.025)
print("La-Ön/La-Ön ratio 1/(4/19) =", 19/4)
