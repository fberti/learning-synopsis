# Kvíz gh6-61 – számok ellenőrzése (6.1 háromszögek, klaszterezettség)
import json, warnings
import networkx as nx, numpy as np
from fractions import Fraction as F
from math import comb
warnings.filterwarnings("ignore")

def g(s):
    G = nx.Graph(); G.add_edges_from(tuple(x.split("-")) for x in s.split(",")); return G

def fr(x, d=1000): return str(F(x).limit_denominator(d))

def summary(name, G):
    T = nx.triangles(G); C = nx.clustering(G)
    wedges = sum(comb(d, 2) for _, d in G.degree())
    tri = sum(T.values()) // 3
    print(name, "deg", dict(G.degree()), "T", T, "C", {k: fr(v) for k, v in C.items()})
    print("   tri", tri, "wedges", wedges, "avgC", fr(nx.average_clustering(G)), round(nx.average_clustering(G), 4),
          "trans", fr(nx.transitivity(G)), round(nx.transitivity(G), 4))
    return T, C, wedges, tri

# Q1: AB, AC, AD, AE, BC, CD, DE – C_A
G = g("A-B,A-C,A-D,A-E,B-C,C-D,D-E")
T, C, _, _ = summary("Q1", G)
k = G.degree("A"); t = T["A"]
print("Q1 C_A", t / comb(k, 2), " /k", t / k, " /k^2", round(t / k**2, 4), " /k(k-1)", t / (k * (k - 1)))
assert C["A"] == 0.5 and t / k == 0.75 and round(t / k**2, 2) == 0.19 and t / (k * (k - 1)) == 0.25
# saját élek beszámolva: (3 + 4)/6 > 1
print("   own edges counted", (t + k) / comb(k, 2))

# Q2: tr(A^3) = 36 – példagráf: K4 + gyémánt, diszjunkt
G2 = nx.disjoint_union(nx.complete_graph(4), g("A-B,A-C,A-D,B-C,C-D"))
A = nx.to_numpy_array(G2); tr = int(np.trace(A @ A @ A))
print("Q2 tr(A^3)", tr, "triangles", sum(nx.triangles(G2).values()) // 3, " 36/6", 36 / 6, "36/3", 36 / 3, "36/2", 36 / 2)
assert tr == 36 and sum(nx.triangles(G2).values()) // 3 == 6

# Q3: Árvízhét Ko vs Po
AV = g("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön")
T, C, w, tri = summary("Árvízhét", AV)
assert T["Ko"] == 3 and T["Po"] == 2 and AV.degree("Ko") == AV.degree("Po") == 4
assert abs(C["Ko"] - 0.5) < 1e-12 and abs(C["Po"] - 1 / 3) < 1e-12
bc = nx.betweenness_centrality(AV, normalized=False)
print("   betweenness (raw)", bc)
assert bc["Po"] == 8 and bc["Ko"] == 5
assert F(nx.average_clustering(AV)).limit_denominator(100) == F(31, 42) and F(nx.transitivity(AV)).limit_denominator(100) == F(4, 7)

# Q4: gyémánt AB, AC, AD, BC, CD
GD = g("A-B,A-C,A-D,B-C,C-D")
T, C, w, tri = summary("Q4 gyémánt", GD)
assert F(C["A"]).limit_denominator(10) == F(2, 3) and C["B"] == 1 and F(C["C"]).limit_denominator(10) == F(2, 3) and C["D"] == 1
assert F(nx.average_clustering(GD)).limit_denominator(100) == F(5, 6) and nx.transitivity(GD) == 0.75 and w == 8 and tri == 2
print("   T sum", sum(T.values()), "5/6 =", round(5 / 6, 3))

# Q5: AB, AC, BC, CD, CE
G5 = g("A-B,A-C,B-C,C-D,C-E")
T, C, w, tri = summary("Q5", G5)
avg = nx.average_clustering(G5); trans = nx.transitivity(G5)
avg_k1_is_1 = (sum(C.values()) + sum(1 for v in G5 if G5.degree(v) < 2)) / G5.number_of_nodes()
print("   avg", fr(avg), round(avg, 3), "trans", trans, "no-3", tri / w, "k<2 as 1 avg", fr(avg_k1_is_1), round(avg_k1_is_1, 3))
assert F(avg).limit_denominator(100) == F(13, 30) and trans == 0.375 and tri / w == 0.125
assert F(avg_k1_is_1).limit_denominator(100) == F(5, 6)

# Q6: karateklub (súly nélkül)
s = open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js", encoding="utf-8").read()
s = s[s.index("window.KARATE13 = ") + len("window.KARATE13 = "):]; s = s[:s.rindex("}") + 1]
K = json.loads(s)
KG = nx.Graph(); KG.add_edges_from(map(tuple, K["edges"]))
T, C, w, tri = None, None, sum(comb(d, 2) for _, d in KG.degree()), sum(nx.triangles(KG).values()) // 3
print("Q6 karate n m", KG.number_of_nodes(), KG.number_of_edges(), "tri", tri, "wedges", w, "open", w - 3 * tri)
print("   avgC", round(nx.average_clustering(KG), 4), "trans", round(nx.transitivity(KG), 4),
      "135/528", round(135 / 528, 4), "45/528", round(45 / 528, 4), "135/1056", round(135 / 1056, 4))
print("   C_1", round(nx.clustering(KG, 0), 3), "deg", KG.degree(0), "C_34", round(nx.clustering(KG, 33), 3), "deg", KG.degree(33))
assert tri == 45 and w == 528 and round(nx.transitivity(KG), 2) == 0.26 and round(nx.average_clustering(KG), 2) == 0.57
assert round(45 / 528, 3) == 0.085 and round(135 / 1056, 2) == 0.13

# Q7 (multi): 3 fokú csúcs lehetséges C értékei
print("Q7 k=3 possible C:", [fr(t / 3) for t in range(4)], "k=2:", [t / 1 for t in range(2)])
# súlyozott átlag: C_Δ = sum C_i * binom(k_i,2) / sum binom(k_i,2) az Árvízhéten
C = nx.clustering(AV)
wa = sum(C[v] * comb(AV.degree(v), 2) for v in AV) / sum(comb(AV.degree(v), 2) for v in AV)
print("   weighted avg Árvízhét", wa, "trans", nx.transitivity(AV))
assert abs(wa - nx.transitivity(AV)) < 1e-12
print("OK")
