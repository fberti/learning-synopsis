# Ellenőrzi a q1.js (gh5-51 … gh5-54) összes számát, a helyes és a rossz opciókat is.
# Futtatás: uv run -q --with networkx --with numpy python -I qcheck1_quiz.py
import itertools
import networkx as nx
import numpy as np
from math import comb, sqrt


def G(edges):
    g = nx.Graph()
    for e in edges.split(","):
        a, b = e.strip().split("-")
        g.add_edge(a, b)
    return g


def show(t, v):
    print(f"{t}: {v}")


def btw_raw(g):  # irányítatlan, minden pár egyszer, normálás nélkül
    return nx.betweenness_centrality(g, normalized=False)


def btw_with_endpoints(g):
    return nx.betweenness_centrality(g, normalized=False, endpoints=True)


ARV = G("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön")
W = {("Ko", "Vi"): 2, ("Ko", "Po"): 2, ("Vi", "Po"): 2, ("Vi", "Sz"): 1, ("Sz", "Kl"): 2,
     ("Sz", "Ko"): 1, ("Kl", "Ko"): 1, ("La", "Ön"): 3, ("La", "Po"): 2, ("Po", "Ön"): 2}
for (a, b), w in W.items():
    ARV[a][b]["weight"] = w

print("===== gh5-51")
d = dict(ARV.degree()); s = dict(ARV.degree(weight="weight"))
show("fokszám", d); show("erősség", s)
show("Q1 Vi: 3/6, 3/7, 5/6", (3 / 6, 3 / 7, s["Vi"] / 6))
show("Q2 10/20, 4/5 | 10/21, 4/6", (10 / 20, 4 / 5, 10 / 21, 4 / 6))
# Q3: Vi erősség 5, fokszám 3, említő cikkek 4, megszólalás 1 (arvizhet-data.js)
mentions = {1: ["Ko", "Vi"], 2: ["Ko", "Vi", "Po"], 3: ["Ko", "Po"], 4: ["Vi", "Sz"], 5: ["Sz", "Kl", "Ko"],
            6: ["Sz", "Kl"], 7: ["La", "Ön"], 8: ["La", "Po", "Ön"], 9: ["La", "Ön"], 10: ["Po", "Vi"],
            11: ["Po", "La"], 12: ["Ön", "Po"]}
speakers = {1: ["Ko"], 2: ["Vi"], 3: ["Ko"], 4: ["Sz"], 5: ["Sz"], 6: ["Sz"], 7: ["La"], 8: ["La", "Po"],
            9: ["Ön"], 10: ["Po"], 11: ["La"], 12: ["Ön"]}
cnt_m = {a: sum(a in m for m in mentions.values()) for a in d}
cnt_s = {a: sum(a in m for m in speakers.values()) for a in d}
show("említő cikkek", cnt_m); show("megszólalás", cnt_s)
# súlyok újraszámolása a korpuszból
wc = {}
for m in mentions.values():
    for a, b in itertools.combinations(sorted(m), 2):
        wc[(a, b)] = wc.get((a, b), 0) + 1
assert all(wc[tuple(sorted(k))] == v for k, v in W.items()) and len(wc) == len(W)
show("Q3 Vi: erősség, fokszám, említés, megszólalás", (s["Vi"], d["Vi"], cnt_m["Vi"], cnt_s["Vi"]))
# Q4: A→B, A→C, B→C, D→C, C→A
D4 = nx.DiGraph([("A", "B"), ("A", "C"), ("B", "C"), ("D", "C"), ("C", "A")])
show("Q4 C befok, kifok", (D4.in_degree("C"), D4.out_degree("C")))
show("Q4 rossz: befok D→C nélkül", D4.in_degree("C") - 1)
# Q7: lapok
L = nx.DiGraph([("EK", "RH"), ("NY", "EK"), ("VN", "RH"), ("VN", "NY")])
show("Q7 befok", dict(L.in_degree())); show("Q7 kifok", dict(L.out_degree()))
show("Q7 befok+kifok", {v: L.in_degree(v) + L.out_degree(v) for v in L})

print("===== gh5-52")
T = G("A-B,B-C,C-D,C-E")
ds = {v: sum(nx.shortest_path_length(T, v).values()) for v in T}
show("Q1 T távolságösszeg", ds)
show("Q1 C: 4/5, 5, 1/5, 5/5", (4 / ds["C"], ds["C"], 1 / ds["C"], 5 / ds["C"]))
ds = {v: sum(nx.shortest_path_length(ARV, v).values()) for v in ARV}
show("Q2 Árvízhét távolságösszeg", ds)
show("Q2 Sz: 6/11, 11, 7/11, 1/11", (6 / ds["Sz"], ds["Sz"], 7 / ds["Sz"], 1 / ds["Sz"]))
H2 = G("1-2,2-3,3-4,5-6")
harm = nx.harmonic_centrality(H2)
show("Q3 harmonikus", harm)
dist2 = nx.shortest_path_length(H2, "2")
show("Q3 2-es: harm, távolságösszeg (elérhetők), komponensen belüli közelség",
     (harm["2"], sum(dist2.values()), (len(dist2) - 1) / sum(dist2.values())))
show("Q3 közelségi képlet a teljes gráfon (végtelen összeg) -> 0", 0)
dv = nx.shortest_path_length(ARV, "Vi")
show("Q5 Vi harmonikus, távolságösszeg, szomszédok, közelségi",
     (nx.harmonic_centrality(ARV)["Vi"], sum(dv.values()), ARV.degree("Vi"), 6 / sum(dv.values())))
P5 = G("1-2,2-3,3-4,4-5")
d2 = nx.shortest_path_length(P5, "2")
show("Q6 út 2-es: fok, összeg, közelségi, harm, harm/4",
     (P5.degree("2") / 4, sum(d2.values()), 4 / sum(d2.values()), nx.harmonic_centrality(P5)["2"],
      nx.harmonic_centrality(P5)["2"] / 4))
C4 = G("1-2,2-3,3-4,4-1"); P4 = G("1-2,2-3,3-4")
sc4 = sum(nx.shortest_path_length(C4, "1").values()); sp4 = sum(nx.shortest_path_length(P4, "2").values())
sp4e = sum(nx.shortest_path_length(P4, "1").values())
show("Q7 C4: összeg, 3/ö, 4/ö, 1/ö", (sc4, 3 / sc4, 4 / sc4, 1 / sc4))
show("Q7 P4 belső: összeg, 3/ö, 4/ö, 1/ö", (sp4, 3 / sp4, 4 / sp4, 1 / sp4))
show("Q7 P4 végpont: 3/ö", 3 / sp4e)

print("===== gh5-53")
P6 = G("1-2,2-3,3-4,4-5,5-6")
b = btw_raw(P6); be = btw_with_endpoints(P6)
show("Q1 P6 3-as: nyers, végponttal, kétszer, párok a 3-assal",
     (b["3"], be["3"], 2 * b["3"], 5))
show("Q2 3-as normálva: /C(5,2), /C(6,2), /(n-1), /((n-1)(n-2))",
     (b["3"] / comb(5, 2), b["3"] / comb(6, 2), b["3"] / 5, b["3"] / 20))
assert abs(nx.betweenness_centrality(P6)["3"] - b["3"] / comb(5, 2)) < 1e-12
R3 = G("A-B,A-C,B-D,C-D,D-E")
b = btw_raw(R3); be = btw_with_endpoints(R3)
show("Q3 rombusz+farok köztesség", b)
# „egész pár” hiba: minden pár, amelynek BÁRMELY legrövidebb útja átmegy v-n, 1-et ad
def whole_pair(g, v):
    c = 0
    for s_, t_ in itertools.combinations([u for u in g if u != v], 2):
        if any(v in p[1:-1] for p in nx.all_shortest_paths(g, s_, t_)):
            c += 1
    return c
show("Q3 D: helyes, egész pár, kétszer, végponttal", (b["D"], whole_pair(R3, "D"), 2 * b["D"], be["D"]))
b = btw_raw(ARV); be = btw_with_endpoints(ARV)
show("Q4 Árvízhét köztesség", b)
show("Q4 Vi: helyes, egész pár, végponttal, +Kl–Vi fele", (b["Vi"], whole_pair(ARV, "Vi"), be["Vi"], b["Vi"] + 0.5))
show("Q4 normált Po, Ko (/15)", (b["Po"] / 15, b["Ko"] / 15))
A2 = ARV.copy(); A2.add_edge("La", "Vi")
show("Q5 +La–Vi", btw_raw(A2))
A3 = ARV.copy(); A3.remove_edge("Ko", "Po")
show("Q5 rossz: Ko–Po nélkül", btw_raw(A3))
show("Q5 Po elvágó csúcs +La–Vi után?", "Po" in set(nx.articulation_points(A2)))
TT = G("1-2,1-3,2-3,3-X,X-4,4-5,4-6,5-6")
b = btw_raw(TT)
show("Q7 X köztesség, fokszám", (b["X"], TT.degree("X")))
show("Q7 X: /C(6,2), /C(7,2), 2x/C(6,2), /(n-1)", (b["X"] / 15, b["X"] / 21, 2 * b["X"] / 15, b["X"] / 6))
show("Q7 3-as, 4-es köztesség", (b["3"], b["4"]))

print("===== gh5-54")
S = G("A-B,A-C,A-D,D-E")
order = ["A", "B", "C", "D", "E"]
A = nx.to_numpy_array(S, nodelist=order)
one = np.ones(5)
x1 = A @ one; x2 = A @ x1
show("Q1 A1", x1); show("Q1 A^2 1", x2)
show("Q1 (A+I) A1", (A + np.eye(5)) @ x1)
show("Q1 szomszédátlag D^-1 A d", (A @ x1) / x1)
for k, (lab, n_) in enumerate([("csillag 5 levél", 5)]):
    st = nx.star_graph(n_)
    w, V = np.linalg.eigh(nx.to_numpy_array(st, nodelist=range(n_ + 1)))
    v = np.abs(V[:, -1]); v /= v.max()
    show(f"Q2 {lab}: λ1, levél, 1/√5", (w[-1], v[1], 1 / sqrt(5)))
P4 = nx.path_graph(4)
w, V = np.linalg.eigh(nx.to_numpy_array(P4))
v = np.abs(V[:, -1]); v /= v.max()
show("Q3 P4: λ1, vektor", (w[-1], v, (1 + sqrt(5)) / 2, (sqrt(5) - 1) / 2))


def eig_max1(g):
    nodes = list(g)
    w, V = np.linalg.eigh(nx.to_numpy_array(g, nodelist=nodes))
    v = np.abs(V[:, -1]); v /= v.max()
    return w[-1], {n: round(x, 3) for n, x in zip(nodes, v)}


show("Q6 Árvízhét sajátvektor (súly nélkül)", eig_max1(nx.Graph(ARV.edges())))
show("Q6 közelségi", {k: round(v, 3) for k, v in nx.closeness_centrality(ARV).items()})
XY = G("A-B,A-C,B-C,X-A,X-B,C-Y,Y-L")
show("X–Y sajátvektor", eig_max1(XY))
CE = G("A-B,A-C,A-D,B-C")
show("csillag+él sajátvektor (szöveg: 1; 0,85; 0,85; 0,46)", eig_max1(CE))
show("K4, C4", (eig_max1(nx.complete_graph(4)), eig_max1(nx.cycle_graph(4))))
show("csillag 3 levél", eig_max1(nx.star_graph(3)))
# Q5: irányított lánc, beérkező sajátvektor
Ach = nx.to_numpy_array(nx.DiGraph([("A", "B"), ("B", "C"), ("C", "D")]), nodelist="ABCD")
show("Q5 A^T sajátértékei (nilpotens?)", (np.linalg.eigvals(Ach.T), np.allclose(np.linalg.matrix_power(Ach.T, 4), 0)))
show("Q5 rossz: befok", Ach.sum(axis=0))
Lp = nx.to_numpy_array(L, nodelist=["RH", "EK", "NY", "VN"])
show("lapok A^T^4 = 0?", np.allclose(np.linalg.matrix_power(Lp.T, 4), 0))

print("===== szövegellenőrzés: Fiedler-vágás (5.3 utalás a 4.6-ra)")
for lab, g in [("súlyozott", ARV), ("súly nélkül", nx.Graph(ARV.edges()))]:
    f = nx.fiedler_vector(g, weight="weight", seed=1)
    side = {v for v, x in zip(g, f) if x > 0}
    cut = [(a, b) for a, b in g.edges() if (a in side) != (b in side)]
    show(lab, (sorted(side), cut))
