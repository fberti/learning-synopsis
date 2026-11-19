# gh8-81..84 kvízek + a 8.1–8.4 szöveg számainak ellenőrzése
# uv run -q --with networkx --with numpy python -I qcheck1_calc.py
import networkx as nx, itertools as it
from sympy import bell
from math import comb
def Q(G, parts, gamma=1, weight=None):
    m = G.size(weight=weight); deg = dict(G.degree(weight=weight)); s = 0
    for c in parts:
        c = set(c); L = sum(d.get(weight, 1) if weight else 1 for u, v, d in G.edges(data=True) if u in c and v in c)
        s += L/m - gamma*(sum(deg[i] for i in c)/(2*m))**2
    return s
def LKd(G, c):
    c = set(c); L = sum(1 for u, v in G.edges() if u in c and v in c)
    K = sum(1 for u, v in G.edges() if (u in c) != (v in c)); return L, K, sum(G.degree(i) for i in c)
eb = lambda G: {tuple(sorted(e)): round(b, 3) for e, b in nx.edge_betweenness_centrality(G, normalized=False).items()}
T = nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)])
A = nx.Graph(); A.add_weighted_edges_from([("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Ko","Sz",1),("Ko","Kl",1),("La","Ön",3),("Po","La",2),("Po","Ön",2)])
print("== 8.1 szöveg"); print(LKd(A, ["Ko","Vi","Sz","Kl"]), LKd(A, ["Po","La","Ön"]), LKd(A, ["Ko","Vi"]), LKd(A, ["Ko","Vi","Po"]))
print("karate: belső", 67/78, "véletlen", (81/156)**2+(75/156)**2, "többlet", 67/78-(81/156)**2-(75/156)**2, "r", (67/78-(81/156)**2-(75/156)**2)/(1-(81/156)**2-(75/156)**2))
K = nx.karate_club_graph(); club = {i: K.nodes[i]["club"] for i in K}
g1 = [i for i in K if club[i] == "Mr. Hi"]; g2 = [i for i in K if club[i] != "Mr. Hi"]
print("karate", K.number_of_nodes(), K.number_of_edges(), len(g1), len(g2), LKd(K, g1), LKd(K, g2), round(Q(K, [g1, g2]), 4))
print("== gh8-81 kvíz")
G1 = nx.Graph([("A","B"),("A","C"),("A","D"),("B","C"),("C","D"),("D","E")])
print("Q1 {A,B,C}:", LKd(G1, "ABC"), "2L =", 2*LKd(G1,"ABC")[0], "L+K =", sum(LKd(G1,"ABC")[:2]), "külső szomszédok:", len(set(n for i in "ABC" for n in G1[i]) - set("ABC")))
print("Q2 15 él, K 4,2,6: vágott", (4+2+6)/2, "belső", 15-(4+2+6)/2, "rossz:", 15-12, 12)
print("Q3 L5 d14 m20:", 5/20-(14/40)**2, "d/m:", 5/20-(14/20)**2, "négyzet nélkül:", 5/20-14/40)
print("Q5 Bell(4):", int(bell(4)), "2^4 =", 16, "4! =", 24, "2^3 =", 8, "Bell 1..7:", [int(bell(n)) for n in range(1, 8)], "Bell(34) = %.2e" % int(bell(34)))
# kézi felsorolás 4 elemre
def parts(s):
    if not s: yield []; return
    f, r = s[0], s[1:]
    for p in parts(r):
        for i in range(len(p)): yield p[:i] + [[f] + p[i]] + p[i+1:]
        yield [[f]] + p
print("  4 elem felbontásai:", len(list(parts([1,2,3,4]))))
print("Q6 karate: többlet", 67/78-(81/156)**2-(75/156)**2, "belső", 67/78, "négyzet nélkül", 67/78-(81+75)/156)
print("Q4 {Kl} többlet", 0-(2/20)**2, "egy csoport", 1-1)
print("== 8.2 szöveg")
print("két háromszög:", eb(T), sum(eb(T).values()), sum(d for s, row in nx.shortest_path_length(T) for t, d in row.items() if s < t))
T7 = T.copy(); T7.add_edge(1, 7); print("két háromszög + 7:", eb(T7))
print("Árvízhét:", eb(A)); A2 = A.copy(); A2.remove_edge("Ko","Po"); print(" Ko–Po után:", eb(A2))
# GN az Árvízhéten: komponensszámok és Q szintenként
H = nx.Graph(A.edges()); seq = []; best = {}
while H.number_of_edges():
    b = nx.edge_betweenness_centrality(H, normalized=False); e = max(b, key=b.get); H.remove_edge(*e)
    comps = list(nx.connected_components(H)); seq.append(len(comps)); best[len(comps)] = round(Q(nx.Graph(A.edges()), comps), 4)
print(" GN komponensszám:", seq, "Q szintenként:", best)
KK = nx.Graph(); KK.add_edges_from(it.combinations(range(10), 2)); KK.add_edges_from(it.combinations(range(10, 20), 2)); KK.add_edges_from([(0, 10), (1, 11)])
bk = eb(KK); print("két K10:", bk[(0,10)], bk[(1,11)], "max belső:", max(v for e, v in bk.items() if e not in [(0,10),(1,11)])); KK.remove_edge(0,10); print(" törlés után:", eb(KK)[(1,11)])
print("== gh8-82 kvíz")
P5 = nx.path_graph([1,2,3,4,5]); print("P5 él:", eb(P5), "csúcs:", nx.betweenness_centrality(P5, normalized=False))
BT = nx.Graph([("A","B"),("A","C"),("B","C"),("C","D"),("C","E"),("D","E")]); print("csokor:", eb(BT), sum(eb(BT).values()), "párok", comb(5,2))
# GN a két háromszögön: komponensszámok
H = T.copy(); seq = []
while H.number_of_edges():
    b = nx.edge_betweenness_centrality(H, normalized=False); e = max(b, key=b.get); H.remove_edge(*e); seq.append(nx.number_connected_components(H))
print("két háromszög GN:", seq, "elágazások:", sum(1 for a, b in zip([1]+seq, seq) if b > a))
print("== 8.3 szöveg")
for p in [[{1,2,3},{4,5,6}], [{1,2},{3,4,5,6}], [{1,2,3,4},{5,6}], [{1,2},{3,4},{5,6}], [set(range(1,7))], [{i} for i in range(1,7)]]: print(" ", p, round(Q(T, p), 4))
print(" -34/196 =", -34/196)
Au = nx.Graph(A.edges()); V = list(Au)
allQ = sorted(((round(Q(Au, p), 4), p) for p in parts(V)), key=lambda x: -x[0]); print(" Árvízhét felbontások:", len(allQ))
def rank(p):
    q = round(Q(Au, p), 4); return q, 1 + sum(1 for x in allQ if x[0] > q + 1e-9)
for p in [[["Ko","Vi","Sz","Kl"],["Po","La","Ön"]], [["Ko","Sz","Kl"],["Vi"],["Po","La","Ön"]], [["Ko","Sz","Kl"],["Vi","Po","La","Ön"]], [["Ko","Vi"],["Po","La","Ön"],["Sz","Kl"]], [["Ko","Vi","Po"],["La","Ön"],["Sz","Kl"]], [["Ko","Vi","Sz","Kl","Po"],["La","Ön"]], [[v] for v in V]]:
    print("  ", p, rank(p), "súlyozva", round(Q(A, p, weight="weight"), 4))
Aw = A; print(" W", Aw.size(weight="weight"), dict(Aw.degree(weight="weight")))
print(" {Sz,Kl} súlyozva", 2/18-(7/36)**2, "súlyozatlan fokkal", 2/18-(5/36)**2, "súly nélkül", 1/10-(5/20)**2, "s/W", 2/18-(7/18)**2)
print(" {Ko,Vi} súlyozva", 2/18-(11/36)**2)
def ring(nc, l):
    G = nx.Graph(); 
    for c in range(nc):
        G.add_edges_from(it.combinations([(c, j) for j in range(l)], 2)); G.add_edge((c, l-1), ((c+1) % nc, 0))
    return G, [[(c, j) for j in range(l)] for c in range(nc)], [[(c, j) for j in range(l)] + [(c+1, j) for j in range(l)] for c in range(0, nc, 2)]
for nc, l in [(10,3),(8,3),(6,3),(12,3),(24,5),(22,5)]:
    G, sep, pr = ring(nc, l); print(f"  gyűrű {nc}×K{l}: m={G.size()} külön {Q(G, sep):.4f} párok {Q(G, pr):.4f}")
print(" 10000 él 50,60:", 50*60/20000, " 5000 él 40,50:", 40*50/10000, "sqrt(2m)", (10000)**.5)
print(" K4–K4 + híd:", end=" "); G = nx.Graph(); G.add_edges_from(it.combinations(range(4), 2)); G.add_edges_from(it.combinations(range(4, 8), 2)); G.add_edge(3, 4)
print(G.size(), round(Q(G, [range(4), range(4, 8)]), 4), "d/m:", 2*(6/13-(13/13)**2), "négyzet nélkül:", 2*(6/13-13/26), "2L/m:", 2*(12/13-(13/26)**2))
print(" négyzet {1,2}{3,4}:", Q(nx.cycle_graph([1,2,3,4]), [{1,2},{3,4}]), "{1,3}{2,4}:", Q(nx.cycle_graph([1,2,3,4]), [{1,3},{2,4}]))
print(" Po átrakva: no sq", (0.7-0.8)+(0.1-0.2), "2L", (1.4-0.64)+(0.2-0.04))
print("== 8.4")
dq = lambda kic, S, k, m, g=1: kic/m - g*S*k/(2*m*m)
print(" két háromszög tábla:", [round(x, 3) for x in [dq(1,2,2,7), dq(1,3,2,7), dq(2,4,3,7), dq(1,3,3,7), dq(1,7,3,7), dq(1,2,3,7), dq(1,3,2,7), dq(1,2,2,7), dq(2,4,3,7), dq(2,5,2,7), dq(1,9,3,7)*0+dq(1,3,3,7)]])
print(" szuperpont:", dq(1,7,7,7), "hurok nélkül:", dq(1,1,1,7), "csak nyereség", 1/7)
print(" Vi:", dq(2,9,3,10), dq(1,8,3,10))
print(" kvíz1 m15 k3 kiC2 S12:", dq(2,12,3,15), "2m helyett m:", 2/15-12*3/15**2, "saját fokkal:", dq(2,15,3,15), "csak első", 2/15)
print(" kvíz2 C S20:", dq(2,20,3,15), "D kiD1 S3:", dq(1,3,3,15))
print(" kvíz5 γ: 3 > γ·", 12*15/80, "→ γ <", 3/(12*15/80), " m-mel:", 3/(12*15/40))
print(" gyakorló:", dq(3,10,4,20), dq(2,4,4,20), "A-B", 3/10-10*6/200, "B-C", 1/10-6*4/200, "γ 8,10,m30:", 2/(80/60))
print(" gyűrű γ:", 0.125/0.1, " két háromszög γ=2:", Q(T, [{1,2,3},{4,5,6}], 2), Q(T, [set(range(1,7))], 2), " gyűrű szuperpont:", 1/40-64/3200)
from networkx.algorithms.community import louvain_communities
for g in [0.5, 1, 2]:
    cs = louvain_communities(K, resolution=g, seed=1); print(" karate Louvain γ", g, len(cs), round(Q(K, cs), 3))
print(" γ=0: egy csoport", Q(T, [set(range(1,7))], 0), "két háromszög", Q(T, [{1,2,3},{4,5,6}], 0))
print(" nx", nx.__version__, "leiden_communities" in dir(nx.community))
print("== kiegészítő ellenőrzések")
H = nx.Graph(A.edges()); H.remove_edges_from([("Ko","Po"),("Vi","Po")]); print(" GN 3. lépés előtt:", eb(H)); H.remove_edge("Ko","Vi"); print(" Ko–Vi után:", eb(H))
for p in [[["Ko","Kl"],["Sz"],["Vi"],["Po","La","Ön"]], [["Ko","Sz"],["Kl"],["Vi"],["Po","La","Ön"]], [["Ko","Sz","Kl"],["Vi"],["Po"],["La","Ön"]]]: print("  4 csoport", p, round(Q(Au, p), 4))
res = [louvain_communities(K, seed=s) for s in range(100)]; qs = [Q(K, c) for c in res]
print(" karate Louvain 100 futás: Q", round(min(qs), 3), round(max(qs), 3), "csoportszám", sorted(set(len(c) for c in res)))
H = nx.Graph(K.edges()); n = 0; first = None
while nx.number_connected_components(H) == 1:
    b = nx.edge_betweenness_centrality(H, normalized=False); e = max(b, key=b.get); first = first or (e, round(b[e], 1)); H.remove_edge(*e); n += 1
cs = list(nx.connected_components(H)); print(" karate GN: első", first, "törlés", n, [len(c) for c in cs])
