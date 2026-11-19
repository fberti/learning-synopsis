# q2.js (gh8-85 … gh8-88, gh8-final) számainak ellenőrzése
# uv run -q --with networkx --with numpy --with scipy --with scikit-learn python -I qcheck2_calc.py
import json, math, re, itertools
from math import comb, log, sqrt
from pathlib import Path
import numpy as np, networkx as nx
from networkx.algorithms import community as nxc
from sklearn.metrics import adjusted_rand_score as ARI, normalized_mutual_info_score as NMI, rand_score

HERE = Path(__file__).resolve().parent
r3 = lambda x: round(x, 3)

def Q(G, parts, w=None, gamma=1):
    return nxc.modularity(G, parts, weight=w, resolution=gamma)

def labels(parts, nodes):
    d = {v: i for i, p in enumerate(parts) for v in p}
    return [d[v] for v in nodes]

print("=== 8.5 ===")
T = nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)])
nodes = sorted(T); A = nx.to_numpy_array(T, nodelist=nodes); k = A.sum(1); m = k.sum()/2
B = A - np.outer(k, k)/(2*m)
print("B12 B34 B15 B14 B33", *(r3(B[i-1, j-1]) for i, j in [(1,2),(3,4),(1,5),(1,4),(3,3)]))
ev, V = np.linalg.eigh(B); print("B eig max", r3(ev[-1]), "vec", np.round(V[:, -1]*np.sign(V[0, -1]), 2))
s = np.array([1,1,1,-1,-1,-1]); sBs = s@B@s
print("sBs", r3(sBs), "1/4m", r3(sBs/(4*m)), "1/2m", r3(sBs/(2*m)), "1/m", r3(sBs/m), "1/8m", r3(sBs/(8*m)))
# címketerjesztés: 4-es csúcs hármas holtversenye b, e, f -> b esélye
print("LPA 4-es b esély", r3(1/3))
# súlyozott szavazás: a(2) vs b(1)+b(1)+b(1)
print("weighted votes a=2, b=3")
# négyzet
Sq = nx.cycle_graph(4); As = nx.to_numpy_array(Sq); ks = As.sum(1); Bs = As - np.outer(ks, ks)/(2*4)
print("square B eig", np.round(np.linalg.eigvalsh(Bs), 3))
K4 = nx.complete_graph(4); A4 = nx.to_numpy_array(K4); k4 = A4.sum(1); B4 = A4 - np.outer(k4, k4)/12
print("K4 B eig", np.round(np.linalg.eigvalsh(B4), 3))

# karateklub
kd = json.loads(re.search(r"window\.KARATE13 = (\{.*?\});", (HERE/"../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read_text()).group(1))
K = nx.Graph(); K.add_nodes_from(range(1, 35)); K.add_edges_from((a+1, b+1) for a, b in kd["edges"])
club = kd["club"]; true = [{i+1 for i in range(34) if club[i] == c} for c in (0, 1)]
print("karate n m", K.number_of_nodes(), K.number_of_edges(), "Q true", r3(Q(K, true)))
Ak = nx.to_numpy_array(K, nodelist=range(1, 35)); kk = Ak.sum(1); mk = kk.sum()/2
Bk = Ak - np.outer(kk, kk)/(2*mk); ev, V = np.linalg.eigh(Bk); v = V[:, -1]
pm = [{i+1 for i in range(34) if v[i] > 0}, {i+1 for i in range(34) if v[i] <= 0}]
L = nx.laplacian_matrix(K, nodelist=range(1, 35)).toarray().astype(float); el, VL = np.linalg.eigh(L); f = VL[:, 1]
pf = [{i+1 for i in range(34) if f[i] > 0}, {i+1 for i in range(34) if f[i] <= 0}]
def wrong(p):
    lab = labels(p, range(1, 35)); best = None
    for flip in (0, 1):
        w = [i+1 for i in range(34) if (lab[i] ^ flip) != club[i]]
        best = w if best is None or len(w) < len(best) else best
    return best
yt = club
for name, p in [("modmatrix", pm), ("fiedler", pf)]:
    yp = labels(p, range(1, 35))
    print(name, "wrong", wrong(p), "Q", r3(Q(K, p)), "NMI", r3(NMI(yt, yp)), "ARI", r3(ARI(yt, yp)))
# GN első kettéesés
comp = next(nxc.girvan_newman(K)); yp = labels(comp, range(1, 35))
print("GN first split sizes", sorted(len(c) for c in comp), "wrong", wrong(comp), "Q", r3(Q(K, comp)), "NMI", r3(NMI(yt, yp)), "ARI", r3(ARI(yt, yp)))
print("GN == Fiedler?", set(map(frozenset, comp)) == set(map(frozenset, pf)))
# Louvain gamma = 0.5, 50 futás legjobbja
best = max((nxc.louvain_communities(K, resolution=0.5, seed=s) for s in range(50)), key=lambda p: Q(K, p, gamma=0.5))
yp = labels(best, range(1, 35))
print("Louvain g=0.5", len(best), "wrong", wrong(best) if len(best) == 2 else "-", "Q", r3(Q(K, best)), "NMI", r3(NMI(yt, yp)), "ARI", r3(ARI(yt, yp)))
# 9-es és 10-es fokszáma, élei
print("k9, k10", K.degree(9), K.degree(10), "N(10)", sorted(K[10]))

print("=== 8.6 ===")
# 3 x 6, 0,5 / 0,1
inb, betw = 0.5*comb(6, 2), 0.1*36
print("3x6: in", inb, "between pair", r3(betw), "total", r3(3*inb+3*betw),
      "n^2", r3(3*0.5*36+3*betw), "n(n-1)", r3(3*0.5*30+3*betw), "between/2", r3(3*inb+3*betw/2))
# K_{2,3}, csillag 3 levéllel: két oldal
for name, G, p in [("K23", nx.complete_bipartite_graph(2, 3), [{0, 1}, {2, 3, 4}]), ("star3", nx.star_graph(3), [{0}, {1, 2, 3}])]:
    m_ = G.number_of_edges(); d = [sum(G.degree(v) for v in c) for c in p]
    print(name, "Q", r3(Q(G, p)), "one group term", r3(-(d[0]/(2*m_))**2), "d/m", r3(-sum((x/m_)**2 for x in d)))
# log-likelihood blokkpár 3 él / 12 pár
e, N = 3, 12; p = e/N
print("loglik 3/12", r3(e*log(p) + (N-e)*log(1-p)), "edges only", r3(e*log(p)), "swapped", r3(e*log(1-p) + (N-e)*log(p)),
      "log10", r3(e*math.log10(p) + (N-e)*math.log10(1-p)))
# log-likelihood a két háromszög beosztásaira
def loglik(G, parts):
    tot = 0
    idx = {v: i for i, c in enumerate(parts) for v in c}
    for r in range(len(parts)):
        for s_ in range(r, len(parts)):
            if r == s_: Nrs = comb(len(parts[r]), 2)
            else: Nrs = len(parts[r])*len(parts[s_])
            if Nrs == 0: continue
            ers = sum(1 for a, b in G.edges() if {idx[a], idx[b]} == {r, s_} or (r == s_ and idx[a] == idx[b] == r))
            ph = ers/Nrs
            tot += (ers*log(ph) if ers else 0) + ((Nrs-ers)*log(1-ph) if Nrs-ers else 0)
    return tot
for p in ([set(range(1, 7))], [{1, 2}, {3, 4, 5, 6}], [{1, 2, 3}, {4, 5, 6}], [{i} for i in range(1, 7)]):
    print("loglik", p, r3(loglik(T, p)))
# kimutathatóság <k> = 4
kk_ = 4
for nm, diff, kav in [("ok", 2*sqrt(4), 4), ("sqrt only", sqrt(4), 4), ("no sqrt", 2*4, 4), ("<k>=sum", 2*sqrt(8), 4)]:
    s_ = 2*kav; cb, ck = (s_+diff)/2, (s_-diff)/2
    print("detect", nm, r3(cb), r3(ck), "ratio", r3(ck/cb))
print("detect <k>=6", r3((12+2*sqrt(6))/2), r3((12-2*sqrt(6))/2), r3((12-2*sqrt(6))/(12+2*sqrt(6))))

print("=== 8.7 ===")
nodes6 = range(1, 7)
Apart = [{1, 2, 3}, {4, 5, 6}]
def comp_(P1, P2, nodes=nodes6):
    a, b = labels(P1, nodes), labels(P2, nodes)
    return r3(rand_score(a, b)), r3(ARI(a, b)), r3(NMI(a, b))
Bp = [{1, 2, 3}, {4}, {5, 6}]
print("A vs {123}{4}{56}: Rand ARI NMI", comp_(Apart, Bp), "13/15", r3(13/15))
print("  ARI pieces: obs 4, exp", r3(6*4/15), "max", (6+4)/2, "ARI", r3((4-1.6)/(5-1.6)),
      "no-den-corr", r3((4-1.6)/5), "no corr", r3(4/5))
print("A vs {12}{3456}", comp_(Apart, [{1, 2}, {3, 4, 5, 6}]))
print("A vs singletons", comp_(Apart, [{i} for i in nodes6]), "A vs one", comp_(Apart, [set(nodes6)]))
print("A vs relabel", comp_(Apart, [{4, 5, 6}, {1, 2, 3}]))
# pontosság címkével: 0,0,0,1,1,1 vs 1,1,1,0,0,0
print("accuracy", np.mean(np.array([0,0,0,1,1,1]) == np.array([1,1,1,0,0,0])))
# együttes besorolás, 4 futás
runs = [[{1, 2}, {3, 4}], [{1, 2, 3}, {4}], [{1, 2}, {3, 4}], [{1, 2, 3, 4}]]
C = lambda i, j: sum(any(i in c and j in c for c in r) for r in runs)/len(runs)
print("C13", C(1, 3), "C34", C(3, 4), "C12", C(1, 2), "C14", C(1, 4))
print("z deg-pres", r3((0.420-0.298)/0.015), "z G(n,m)", r3((0.420-0.354)/0.019), "vs0", r3(0.420/0.015), "diff", r3(0.420-0.298))
# A = {12}{34}{56}, B = {123}{456} (final)
Af = [{1, 2}, {3, 4}, {5, 6}]
print("final ARI: {12}{34}{56} vs A", comp_(Af, Apart))
obs, sa, sb = 2, 3, 6; exp = sa*sb/15; mx = (sa+sb)/2
print("  pieces exp", r3(exp), "max", mx, "ARI", r3((obs-exp)/(mx-exp)), "no-den-corr", r3((obs-exp)/mx),
      "max=min", r3((obs-exp)/(min(sa, sb)-exp)))
print("final z", r3((0.48-0.42)/0.03), r3(0.48/0.03), r3(0.48/0.42))

print("=== 8.8 ===")
AV = nx.Graph()
for a, b, w in [("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Ko","Sz",1),("Ko","Kl",1),("La","Ön",3),("Po","La",2),("Po","Ön",2)]:
    AV.add_edge(a, b, weight=w)
two = [{"Ko","Vi","Sz","Kl"}, {"Po","La","Ön"}]; fr = [{"Ko","Vi"}, {"Po","La","Ön"}, {"Sz","Kl"}]
for g in (1, 1.4, 1.5, 1.6, 1.8):
    print("gamma", g, "weighted two", r3(Q(AV, two, "weight", g)), "frames", r3(Q(AV, fr, "weight", g)))
print("crossover", r3((14/18-11/18)/(0.5-494/1296)))
# kimerítő keresés: súlyozva melyik a legjobb γ-ként
def partitions(seq):
    if not seq: yield []; return
    first, rest = seq[0], seq[1:]
    for p in partitions(rest):
        for i in range(len(p)):
            yield p[:i] + [p[i] | {first}] + p[i+1:]
        yield p + [{first}]
allp = list(partitions(list(AV))); print("n partitions", len(allp))
for w, gs in [("weight", (1, 1.39, 1.41, 1.79, 1.81)), (None, (1, 1.47, 1.49))]:
    for g in gs:
        b = max(allp, key=lambda p: Q(AV, p, w, g))
        print(w, g, sorted(map(sorted, b)), r3(Q(AV, b, w, g)))
ranked = sorted(allp, key=lambda p: -Q(AV, p))
for p in ([two, [{"Ko","Sz","Kl"},{"Vi"},{"Po","La","Ön"}], fr, [{"Ko","Vi","Po"},{"La","Ön"},{"Sz","Kl"}], [{v} for v in AV]]):
    qq = Q(AV, p); rank = 1 + sum(1 for x in allp if Q(AV, x) > qq + 1e-12)
    print("unweighted", sorted(map(sorted, p)), r3(qq), "rank", rank)
print("clique perc k=3", [sorted(c) for c in nxc.k_clique_communities(AV, 3)])
print("triangles", sorted(sorted(c) for c in nx.enumerate_all_cliques(AV) if len(c) == 3))
# Fiedler az Árvízhéten (súly nélkül)
nl = list(AV); LA = nx.laplacian_matrix(AV, nodelist=nl, weight=None).toarray().astype(float)
fv = np.linalg.eigh(LA)[1][:, 1]; print("Arvizhet Fiedler", sorted(v for v, x in zip(nl, fv) if x > 0), sorted(v for v, x in zip(nl, fv) if x <= 0))
LAw = nx.laplacian_matrix(AV, nodelist=nl, weight="weight").toarray().astype(float)
fv = np.linalg.eigh(LAw)[1][:, 1]; print("Arvizhet Fiedler w", sorted(v for v, x in zip(nl, fv) if x > 0))
# Les Mis Valjean
LM = nx.les_miserables_graph()
print("LesMis", LM.number_of_nodes(), LM.number_of_edges(), LM.size(weight="weight"), "Valjean k", LM.degree("Valjean"),
      "btw", r3(nx.betweenness_centrality(LM)["Valjean"]))

print("=== final ===")
print("L from d=14 K=4", (14-4)/2, "wrong", 14-4, 14/2, (14+4)/2)
print("excess L=6 d=12 m=15", r3(6/15-(12/30)**2), "d/m", r3(6/15-(12/15)**2), "nosq", r3(6/15-12/30), "2L", r3(12/15-(12/30)**2))
G2 = nx.complete_graph(5); G2 = nx.disjoint_union(G2, nx.complete_graph(5)); G2.add_edges_from([(0, 5), (1, 6)])
eb = nx.edge_betweenness_centrality(G2, normalized=False)
print("2xK5 bridges", r3(eb[(0, 5)]), r3(eb[(1, 6)]), "max intra", r3(max(v for e, v in eb.items() if e not in [(0, 5), (1, 6)])))
G3 = G2.copy(); G3.remove_edge(0, 5); eb3 = nx.edge_betweenness_centrality(G3, normalized=False); print("after", r3(eb3[(1, 6)]))
print("K4 {12}{34}", r3(Q(nx.complete_graph(4), [{0, 1}, {2, 3}])), "nosq", r3(2*(1/6-0.5)), "nonull", r3(2/6), "d/m", r3(2*(1/6-1)))
print("dQ", r3(2/10-8*3/200), "self in", r3(2/10-11*3/200), "d/m", r3(2/10-8*3/100), "no ki", r3(2/10-8/200))
print("SBM 4+6", 0.5*(comb(4, 2)+comb(6, 2))+0.2*24, "n^2", 0.5*(16+36)+4.8, "n(n-1)", 0.5*(12+30)+4.8, "betw/2", 0.5*21+2.4)
print("ring 10 triangles", r3(10*(3/40-0.01)), r3(5*(7/40-0.04)))
print("gamma*whole Q (wrong)", r3(1.5*Q(AV, two, "weight")), r3(1.5*Q(AV, fr, "weight")))
print("0.420/0.019", r3(0.420/0.019), "square {13}{24}", r3(Q(nx.cycle_graph(4), [{0, 2}, {1, 3}])), "{12}{34}", r3(Q(nx.cycle_graph(4), [{0, 1}, {2, 3}])))
print("detect ratio", r3(2/6))
