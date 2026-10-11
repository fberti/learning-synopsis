# Kvíz ai13-131 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy --with networkx python -I q131_check.py
import numpy as np
import networkx as nx
from math import comb

names = "ABCDE"
E = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
A = np.zeros((5, 5), int)
for u, v in E:
    A[u, v] = A[v, u] = 1
deg = A.sum(1)
print("fokszámok", deg, "összeg", deg.sum(), "=2|E|", 2 * len(E))

# Q1: fokszámok 4,3,3,2,2 -> |E|
d = [4, 3, 3, 2, 2]
print("Q1 |E| =", sum(d) // 2, "| rossz: összeg", sum(d), "csúcsszám", len(d), "kétszeres", 2 * sum(d))
assert nx.is_graphical(d)

# Q2: (A^2)_BB és A^2 sorai
A2 = A @ A
print("Q2 A^2:\n", A2)
print("   (A^2)_BB =", A2[1, 1], "deg^2 =", deg[1] ** 2, "kétszeres =", 2 * A2[1, 1])
# kétlépéses UTAK (nem séták) B-ből B-be: 0
# Q3: Cora
n, m = 2708, 5278
print("Q3 n^2 =", n * n, " 2|E| =", 2 * m, " arány % =", 100 * 2 * m / (n * n), " |E|/n^2 % =", 100 * m / (n * n))
# Q4: A^3 főátló összege 18 -> háromszögek
A3 = A @ A @ A
print("Q4 futó: A^3 diag", np.diag(A3), "tr/6 =", np.trace(A3) / 6)
print("   18/6 =", 18 / 6, " 18/3 =", 18 / 3, " 18/2 =", 18 / 2)
# Q8: melyik fokszámlista lehet gráfé (egyszerű gráf)
for L in ([3, 2, 2, 2], [3, 3, 2, 2], [2, 2, 2, 2], [1, 1, 1, 1]):
    print("Q8", L, "összeg", sum(L), "grafikus:", nx.is_graphical(L))
# Q extra: 5 csúcs max élszám, sűrűség
print("max él 5 csúcson:", comb(5, 2), "sűrűség:", 5 / comb(5, 2))
