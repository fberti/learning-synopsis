# Kvíz gh6-63 – számok ellenőrzése (6.3 triadikus zárás, helyi híd, átfedés, erős triadikus zárás)
import json, itertools as it
import networkx as nx
from fractions import Fraction as F

def g(s):
    G = nx.Graph(); G.add_edges_from(tuple(x.split("-")) for x in s.split(",")); return G

def common(G, u, v): return set(G[u]) & set(G[v])

def overlap(G, u, v, keep_ends=False):
    c = common(G, u, v); un = set(G[u]) | set(G[v])
    if not keep_ends: un -= {u, v}
    return F(len(c), len(un)) if un else None

def local_bridges(G): return sorted(tuple(sorted(e)) for e in G.edges() if not common(G, *e))

# Q1: AB, AC, AD, BE, CE, DE, DF – a hiányzó párok közös szomszédai
G1 = g("A-B,A-C,A-D,B-E,C-E,D-E,D-F")
cand = {tuple(sorted(p)): len(common(G1, *p)) for p in it.combinations(G1, 2) if not G1.has_edge(*p)}
print("Q1", sorted(cand.items(), key=lambda kv: -kv[1]))
assert cand[("A", "E")] == 3 and cand[("B", "C")] == 2 and cand[("C", "D")] == 2 and cand[("A", "F")] == 1
assert max(cand.values()) == 3 and list(cand.values()).count(3) == 1
print("   deg", dict(G1.degree()))

# Q2: Árvízhét hiányzó párok közös társai
AV = g("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön")
miss = {tuple(sorted(p)): sorted(common(AV, *p)) for p in it.combinations(AV, 2) if not AV.has_edge(*p)}
for p, c in sorted(miss.items(), key=lambda kv: -len(kv[1])): print("Q2", p, len(c), c)
one = sorted(p for p, c in miss.items() if len(c) == 1)
print("   exactly one common:", one)
assert set(one) == {tuple(sorted(x)) for x in [("Ko", "La"), ("Ko", "Ön"), ("Vi", "La"), ("Vi", "Ön"), ("Po", "Kl")]}
assert len(miss[("Kl", "Vi")]) == 2 and len(miss[("Po", "Sz")]) == 2 and len(miss[("Kl", "Ön")]) == 0 and len(miss[("La", "Sz")]) == 0
assert len(miss) == 11

# Q3: Vi–Sz átfedése és a tipikus hibák
o = overlap(AV, "Vi", "Sz"); o_ends = overlap(AV, "Vi", "Sz", keep_ends=True)
c = len(common(AV, "Vi", "Sz"))
print("Q3 O(Vi,Sz)", o, "with ends", o_ends, "common / |N(Vi)\\Sz|", F(c, AV.degree("Vi") - 1),
      "common / (k_i-1 + k_j-1)", F(c, AV.degree("Vi") - 1 + AV.degree("Sz") - 1))
assert o == F(1, 3) and o_ends == F(1, 5) and F(c, 2) == F(1, 2) and F(c, 4) == F(1, 4)
allO = {tuple(sorted(e)): round(float(overlap(AV, *e)), 2) for e in AV.edges()}
print("   all overlaps", allO, "local bridges", local_bridges(AV))

# Q4: C5 + 56 él
G4 = g("1-2,2-3,3-4,4-5,5-1,5-6")
print("Q4 local bridges", local_bridges(G4), "bridges", sorted(tuple(sorted(e)) for e in nx.bridges(G4)))
assert len(local_bridges(G4)) == 6 and sorted(tuple(sorted(e)) for e in nx.bridges(G4)) == [("5", "6")]

# Q5: erős triadikus zárás – AB S, AC S, BC W, CD S, DE S, CE W, EF W
E5 = {("A", "B"): "S", ("A", "C"): "S", ("B", "C"): "W", ("C", "D"): "S", ("D", "E"): "S", ("C", "E"): "W", ("E", "F"): "W"}
G5 = nx.Graph()
for (u, v), t in E5.items(): G5.add_edge(u, v, t=t)
viol = {}
for v in sorted(G5):
    strong = sorted(u for u in G5[v] if G5[v][u]["t"] == "S")
    bad = [(a, b) for a, b in it.combinations(strong, 2) if not G5.has_edge(a, b)]
    viol[v] = bad
    print("Q5", v, "strong", strong, "missing among strong", bad)
assert [v for v, b in viol.items() if b] == ["C"] and viol["C"] == [("A", "D")]
print("   local bridges", local_bridges(G5))

# Q7: karate súlyok – táborok közti / belüli átlagsúly, átfedések
s = open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js", encoding="utf-8").read()
s = s[s.index("window.KARATE13 = ") + len("window.KARATE13 = "):]; s = s[:s.rindex("}") + 1]
K = json.loads(s)
KG = nx.Graph(); KG.add_edges_from(map(tuple, K["edges"]))
club = K["club"]
W = nx.karate_club_graph()
cross = [(u, v) for u, v in KG.edges() if club[u] != club[v]]
inner = [(u, v) for u, v in KG.edges() if club[u] == club[v]]
wc = sum(W[u][v]["weight"] for u, v in cross) / len(cross); wi = sum(W[u][v]["weight"] for u, v in inner) / len(inner)
oc = sum(float(overlap(KG, u, v)) for u, v in cross) / len(cross); oi = sum(float(overlap(KG, u, v)) for u, v in inner) / len(inner)
print("Q7 karate cross", len(cross), "avg w cross", round(wc, 2), "inner", round(wi, 2), "overlap cross", round(oc, 3), "inner", round(oi, 3),
      "local bridges", len(local_bridges(KG)))
assert len(cross) == 11 and round(wc, 2) == 2.27 and round(wi, 2) == 3.07
assert KG.number_of_edges() == W.number_of_edges() == 78 and all(W.has_edge(u, v) for u, v in KG.edges())
print("OK")
