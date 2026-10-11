# Kvíz ai13-137 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy --with networkx python -I q137_check.py
import numpy as np, networkx as nx
from collections import Counter

def wl(G, rounds=10):
    col = {v: 0 for v in G}
    hist = []
    for _ in range(rounds):
        sig = {v: (col[v], tuple(sorted(col[u] for u in G[v]))) for v in G}
        pal = {s: i for i, s in enumerate(sorted(set(sig.values())))}
        new = {v: pal[sig[v]] for v in G}
        hist.append(sig)
        if len(set(new.values())) == len(set(col.values())):
            col = new; break
        col = new
    return col

def wl_same(G1, G2, rounds=10):
    # közös színezés a diszjunkt unión
    U = nx.disjoint_union(G1, G2)
    col = {v: 0 for v in U}
    for _ in range(rounds):
        sig = {v: (col[v], tuple(sorted(col[u] for u in U[v]))) for v in U}
        pal = {s: i for i, s in enumerate(sorted(set(sig.values())))}
        col = {v: pal[sig[v]] for v in U}
    n1 = G1.number_of_nodes()
    h1 = Counter(col[v] for v in range(n1)); h2 = Counter(col[v] for v in range(n1, U.number_of_nodes()))
    return h1 == h2

# Q1: futó példa
G = nx.Graph([(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)])
c = wl(G); cls = {}
for v, k in c.items(): cls.setdefault(k, []).append("ABCDE"[v])
print("Q1 osztályok", sorted(cls.values()))

# Q2: melyik párt NEM választja szét az 1-WL
hexa = nx.cycle_graph(6); tri2 = nx.disjoint_union(nx.cycle_graph(3), nx.cycle_graph(3))
c8 = nx.cycle_graph(8); sq2 = nx.disjoint_union(nx.cycle_graph(4), nx.cycle_graph(4))
dek = nx.Graph([(i, (i + 1) % 6) for i in range(6)] + [(0, 6), (6, 7), (7, 8), (8, 9), (9, 1)])  # két 6-gyűrű közös éllel (0-1)
bic = nx.disjoint_union(nx.cycle_graph(5), nx.cycle_graph(5)); bic.add_edge(0, 5)
for nm, g in (("dekalin", dek), ("biciklopentil", bic)):
    print(nm, g.number_of_nodes(), "csúcs", g.number_of_edges(), "él, fokszámok", Counter(dict(g.degree()).values()), "körök", sorted(len(x) for x in nx.minimum_cycle_basis(g)))
pairs = {"hatszög–két háromszög": (hexa, tri2), "C8–két négyzet": (c8, sq2), "dekalin–biciklopentil": (dek, bic),
         "P4–csillag": (nx.path_graph(4), nx.star_graph(3)), "négyzet–P4": (nx.cycle_graph(4), nx.path_graph(4))}
for k, (a, b) in pairs.items(): print("Q2", k, "WL azonos:", wl_same(a, b), "izomorf:", nx.is_isomorphic(a, b))

# szöveg: túlsimítás a futó példán
A = nx.to_numpy_array(G); Ah = A + np.eye(5); P = Ah / Ah.sum(1, keepdims=True)
x = np.array([1, 0, 0, 0, 5.])
for L in (0, 1, 2, 5, 10, 20, 30):
    print("réteg", L, "szórás", round(np.linalg.matrix_power(P, L).dot(x).std(), 3))
print("határ", np.linalg.matrix_power(P, 200).dot(x)[0], 13 / 15)
ev = sorted(abs(np.linalg.eigvals(P)), reverse=True); print("|sajátértékek|", np.round(ev, 3), "szorzó", (0.109 / 1.939) ** 0.1)
h = x.copy()
for _ in range(2000): h = 0.9 * P @ h + 0.1 * x
print("APPNP", np.round(h, 3), "szórás", round(h.std(), 3))

# Q4: 3 csúcsú út, x=(0;0;7)
Gp = nx.path_graph(3); Ap = nx.to_numpy_array(Gp) + np.eye(3); Pp = Ap / Ap.sum(1, keepdims=True)
xp = np.array([0, 0, 7.])
print("Q4 határ", np.round(np.linalg.matrix_power(Pp, 500) @ xp, 4), "| rossz: sima átlag", 7 / 3,
      "önhurok nélküli fokszám", 1 * 7 / 4)
# szöveg: gyakorló 3 csúcsú út x=(3;0;0)
print("gyak", Pp @ np.array([3, 0, 0.]), 6 / 7)

# Q6: fa, 2 gyerek, 6 réteg
print("Q6 levelek", 2 ** 6, "| rossz 2*6", 12, "6^2", 36, "összes csúcs", sum(2 ** k for k in range(7)))
# Q7: élhomofília, A,C,D=0; B,E=1
lab = {0: 0, 2: 0, 3: 0, 1: 1, 4: 1}
same = sum(lab[u] == lab[v] for u, v in G.edges())
print("Q7 homofília", same / G.number_of_edges(), "| rossz: 1-h", 1 - same / 5, "0-s csúcsok aránya", 3 / 5, "1-es csúcsok aránya", 2 / 5)
# szöveg: lánc 0,1,0,1,0,1
ch = nx.path_graph(6); y = np.array([0, 1, 0, 1, 0, 1.]); Ac = nx.to_numpy_array(ch)
print("lánc szomszédátlag", Ac @ y / Ac.sum(1), "önhurkos", np.round((Ac + np.eye(6)) @ y / (Ac + np.eye(6)).sum(1), 3))
print("SAGE", y - Ac @ y / Ac.sum(1))
print("karate", 67 / 78, "gyak homofília", 4 / 5, "4^3", 4 ** 3, 1 + 4 + 16 + 64)
