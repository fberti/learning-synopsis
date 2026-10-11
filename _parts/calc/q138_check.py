# Kvíz ai13-138 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy --with networkx python -I q138_check.py
import numpy as np, networkx as nx
lap = lambda g: np.diag(nx.to_numpy_array(g).sum(1)) - nx.to_numpy_array(g)
from fractions import Fraction as F

# szöveg: Cora
n, m = 2708, 5278
print("Cora GCN-párok", 2 * m + n, "teljes", n * n, "arány", n * n / (2 * m + n))
print("gyak 512^2", 512 ** 2, "10^8/110000", 1e8 / 110000)
# Q2: 1000 csúcs, 4000 él
n, m = 1000, 4000
print("Q2 helyes", n * n / (2 * m + n), "| rossz: önhurok nélkül", n * n / (2 * m), "egy irány, önhurok nélkül", n * n / m, "egy irány + önhurok", n * n / (m + n))

def ret(G, k):
    A = nx.to_numpy_array(G); M = A / A.sum(1, keepdims=True)
    return np.diag(np.linalg.matrix_power(M, k))
G = nx.Graph([(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)])
print("futó 3 lépés", ret(G, 3), "2 lépés", np.round(ret(G, 2), 3))
L = lap(G); w, V = np.linalg.eigh(L)
print("Laplace sajátértékek", np.round(w, 3), "Fiedler", np.round(V[:, 1], 3))
print("hatszög 3 lépés", ret(nx.cycle_graph(6), 3), "két háromszög", ret(nx.disjoint_union(nx.cycle_graph(3), nx.cycle_graph(3)), 3))
for nm, g in (("hatszög", nx.cycle_graph(6)), ("két háromszög", nx.disjoint_union(nx.cycle_graph(3), nx.cycle_graph(3)))):
    print(nm, "L-spektrum", np.round(np.linalg.eigvalsh(lap(g)), 6))
# Q4: K4, 3 lépéses visszatérés
r = ret(nx.complete_graph(4), 3)
print("Q4 K4", r, "= 2/9?", F(2, 9), float(F(2, 9)), "| rossz: háromszög", 0.25, "egy séta 1/27", 1 / 27, "két séta 2/27", 2 / 27)
# Q5: 5 csúcsú gráf: 3 csúcsú út + 2 izolált csúcs
g = nx.path_graph(3); g.add_nodes_from([3, 4])
ev = np.linalg.eigvalsh(lap(g))
print("Q5 spektrum", np.round(ev, 6), "nullák", int(np.sum(np.abs(ev) < 1e-9)), "komponensek", nx.number_connected_components(g))
print("gyak út 2 lépés", ret(nx.path_graph(3), 2), "négyzet 3 lépés", ret(nx.cycle_graph(4), 3), "háromszög 3 lépés", ret(nx.cycle_graph(3), 3))
