# Kvíz ai13-132 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy --with networkx python -I q132_check.py
import itertools
from fractions import Fraction as F
import numpy as np
import networkx as nx

E = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]  # A–B, A–C, B–C, B–D, D–E
A = np.zeros((5, 5), int)
for u, v in E:
    A[u, v] = A[v, u] = 1
x = np.array([1, 0, 0, 0, 5])

# Q1: különböző szomszédsági mátrixok száma (120 számozásból)
mats = set()
for p in itertools.permutations(range(5)):
    P = np.eye(5, dtype=int)[list(p)]
    mats.add((P @ A @ P.T).tobytes())
print("Q1 különböző mátrixok:", len(mats), "számozások:", 120)
G = nx.from_numpy_array(A)
aut = sum(1 for _ in nx.algorithms.isomorphism.GraphMatcher(G, G).isomorphisms_iter())
print("   automorfizmusok:", aut, "120/aut =", 120 // aut, "| rossz 120/4 =", 120 // 4)

# Q3: MLP bemeneti neuronjai
print("Q3 28*28+28*7 =", 28 * 28 + 28 * 7, "| 28*28 =", 28 * 28, "| 28*28+28 =", 28 * 28 + 28, "| 28*28*7 =", 28 * 28 * 7)

# Q5: match – invariáns/ekvivariáns/egyik sem, ellenőrzés a fordított számozással
order = [4, 3, 1, 0, 2]  # E, D, B, A, C
P = np.eye(5, dtype=int)[order]
A2 = P @ A @ P.T
x2 = P @ x
print("Q5 élek:", A.sum() // 2, A2.sum() // 2)
print("   fokszámok:", A.sum(1), A2.sum(1), " P·deg =", P @ A.sum(1))
print("   1. csúcs fokszáma:", A.sum(1)[0], A2.sum(1)[0])
print("   háromszögek:", np.trace(A @ A @ A) // 6, np.trace(A2 @ A2 @ A2) // 6)
print("   bal felső 2x2 összeg:", A[:2, :2].sum(), A2[:2, :2].sum())

# Q6: A'x' a fordított számozásban
print("Q6 Ax =", A @ x, " A'x' =", A2 @ x2, " P(Ax) =", P @ (A @ x))
print("   rossz: Ax megfordítva =", (A @ x)[::-1], " x' =", x2)

# Q7: Bence klaszterezettsége
nb = [1 - 1 for _ in []]
def clust(v):
    N = [u for u in range(5) if A[v, u]]
    k = len(N)
    e = sum(A[a, b] for a, b in itertools.combinations(N, 2))
    return F(e, k * (k - 1) // 2) if k > 1 else F(0)
print("Q7 klaszterezettség:", [str(clust(v)) for v in range(5)], " networkx:", nx.clustering(G))
print("   rossz: 1/C(4,2) =", F(1, 6), " 1/(deg-1) =", F(1, 2))

# Q8: véletlen séta, Annából két lépés után Annánál
deg = A.sum(1)
T = A / deg[:, None]
print("Q8 (T^2)_AA =", (T @ T)[0, 0], "=", F(1, 2) * F(1, 3) + F(1, 2) * F(1, 2))
print("   rossz: csak B-n át", F(1, 2) * F(1, 3), " csak C-n át", F(1, 2) * F(1, 2), " 1/2")

# 13.2 kiinduló példa: összeg, átlag, maximum, első-utolsó
print("összeg", x.sum(), "átlag", x.mean(), "max", x.max(), "első-utolsó eredeti", x[0] - x[-1], "fordított", x2[0] - x2[-1])
