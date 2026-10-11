# Kvíz ai13-133 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy --with networkx python -I q133_check.py
import numpy as np
import networkx as nx

E = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
A = np.zeros((5, 5))
for u, v in E:
    A[u, v] = A[v, u] = 1
deg = A.sum(1)
x = np.array([1., 0, 0, 0, 5])

# szakasz szövege: összeg/átlag/max gyűjtés, frissítés
s = A @ x
mean = s / deg
mx = np.array([max(x[A[v] > 0]) for v in range(5)])
mn = np.array([min(x[A[v] > 0]) for v in range(5)])
print("összeg", s, "átlag", mean.round(3), "max", mx, "min", mn, "(A+I)x", (A + np.eye(5)) @ x)
print("h' átlag:", np.maximum(0, .5 * x + mean).round(3), " h' összeg:", np.maximum(0, .5 * x + s))

# Q1: x=(2,4,0,6,0), átlag, h' = ReLU(0,5h + m - 2), Bence
x2 = np.array([2., 4, 0, 6, 0])
m2 = A @ x2 / deg
h = np.maximum(0, .5 * x2 + m2 - 2)
print("Q1 m =", m2.round(3), " h' =", h.round(3))
mB_sum = (A @ x2)[1]
print("   rossz: összeggel", .5 * x2[1] + mB_sum - 2, " -2 nélkül", round(.5 * x2[1] + m2[1], 3),
      " saját tag nélkül", round(m2[1] - 2, 3), " (ReLU után", max(0, m2[1] - 2), ")")

# Q3: hány réteg, amíg Emese értéke Annához ér
G = nx.from_numpy_array(A)
print("Q3 d(A,E) =", nx.shortest_path_length(G, 0, 4))
H = x.copy()
for k in range(1, 5):
    H = A @ H  # összeg-gyűjtés
    print("   ", k, "réteg után Anna (csak E-től eredő rész):", end=" ")
    e = np.zeros(5); e[4] = 1
    print((np.linalg.matrix_power(A, k) @ e)[0])

# Q4: Anna számítási fája két rétegnél
def tree_size(v, L):
    if L == 0:
        return 1
    return 1 + sum(tree_size(u, L - 1) for u in range(5) if A[v, u])
print("Q4 Anna fa 2 réteg:", tree_size(0, 2), " Bence fa 2 réteg:", tree_size(1, 2),
      " Anna recepciós mező 2:", len(nx.single_source_shortest_path_length(G, 0, cutoff=2)))

# Q5: paraméterszám
d, dp = 64, 32
print("Q5", 2 * d * dp + dp, "| bias nélkül", 2 * d * dp, "| egy W", d * dp + dp, "| bias d", 2 * d * dp + d)

# Q6: sportos példa, D^-1 A H, Bence sora
Hs = np.array([[1., 0], [0, 1], [0, 1], [0, 1], [1, 0]])
AH = A @ Hs
print("Q6 AH =", AH.tolist(), " D^-1AH Bence:", (AH[1] / deg[1]).round(3), " /4:", AH[1] / 4)
W = np.array([1, -.5])
print("   AHW =", AH @ W, " ReLU:", np.maximum(0, AH @ W))

# Q7: költség (Cora-szerű) – a szöveg 1000x64 -> 16, 5000 él példája
n, d, dp, m = 1000, 64, 16, 5000
c1 = n * d * dp + 2 * m * dp
c2 = 2 * m * d + n * d * dp
print("Q7 A(HW):", c1, " (AH)W:", c2)
n, d, dp, m = 2708, 1433, 16, 5278
print("   Cora A(HW):", n * d * dp + 2 * m * dp, " (AH)W:", 2 * m * d + n * d * dp)

# Q8 multi: átlag {1} vs {1,1}
print("Q8 átlag {1}:", np.mean([1]), " {1,1}:", np.mean([1, 1]), " összeg:", 1, 2)

# karate: recepciós mező, számítási fa (szöveg ellenőrzése)
K = nx.karate_club_graph()
for v in (0, 33):
    sizes = [len(nx.single_source_shortest_path_length(K, v, cutoff=k)) for k in (1, 2, 3)]
    print("karate", v + 1, "fokszám", K.degree(v), "recepciós mező 1-3:", sizes)
print("átmérő", nx.diameter(K), "átl. távolság", round(nx.average_shortest_path_length(K), 3))
AK = nx.to_numpy_array(K, weight=None)
cnt = np.ones(34)
tot = [1]
for L in range(1, 5):
    # fa-méret L rétegnél: 1 + sum_v a gyökér szomszédain a (L-1)-es fák
    pass
def ksize(L):
    t = np.ones(34)
    for _ in range(L):
        t = 1 + AK @ t
    return t
print("elnök fa 0-4:", [int(ksize(L)[33]) for L in range(5)])
