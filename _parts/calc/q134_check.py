# Kvíz ai13-134 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy --with networkx python -I q134_check.py
import numpy as np
import networkx as nx

E = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
A = np.zeros((5, 5))
for u, v in E:
    A[u, v] = A[v, u] = 1
I = np.eye(5)
x = np.array([1., 0, 0, 0, 5])
Ah = A + I
dh = Ah.sum(1)
P = Ah / np.sqrt(np.outer(dh, dh))

# Q1: (A+I)x és rossz válaszok
print("Q1 (A+I)x =", Ah @ x, " Ax =", A @ x, " D^-1 Â x =", (Ah @ x / dh).round(3), " Âx + x =", Ah @ x + x)

# szöveg: ismételt összegzés
print("Â x, Â²x, Â³x:", Ah @ x, Ah @ Ah @ x, Ah @ Ah @ Ah @ x, " összeg:", (Ah @ Ah @ Ah @ x).sum())

# Q2: GCN-élsúly 3 és 8 fokszámnál
print("Q2 1/sqrt(4*9) =", round(1 / np.sqrt(4 * 9), 3), " önhurok nélkül 1/sqrt(24) =", round(1 / np.sqrt(24), 3),
      " gyök nélkül 1/36 =", round(1 / 36, 3), " csak fogadó 1/4 =", 1 / 4)

# Q3: Px Dávid sora
Px = P @ x
print("Q3 Px =", Px.round(3), " sima önhurkos átlag Dávid:", round((Ah @ x / dh)[3], 3),
      " önhurok nélküli átlag Dávid:", (A @ x / A.sum(1))[3],
      " önhurok nélkül, szimmetrikus: 5/sqrt(2*1) =", round(5 / np.sqrt(2), 3))

# Q4: csillag 100 levéllel
S = nx.star_graph(100)
AS = nx.to_numpy_array(S) + np.eye(101)
ds = AS.sum(1)
PS = AS / np.sqrt(np.outer(ds, ds))
one = np.ones(101)
print("Q4 összeg: közép", (AS @ one)[0], "levél", (AS @ one)[1], " átlag:", (AS @ one / ds)[0],
      " GCN: közép", round((PS @ one)[0], 3), "levél", round((PS @ one)[1], 3), " élsúly", round(PS[0, 1], 4))

# Q5: karate GCN paraméterek 34 -> 16 -> 2
print("Q5", 34 * 16 + 16 + 16 * 2 + 2, "| bias nélkül", 34 * 16 + 16 * 2, "| csak 1. réteg", 34 * 16 + 16,
      "| bemeneti bias", 34 * 16 + 34 + 16 * 2 + 2)
print("   Cora:", 1433 * 16 + 16 + 16 * 7 + 7)

# Q6 / Q7: P sorösszegei, sajátértékek, Laplace
print("Q7 P sorösszegek:", P.sum(1).round(3), " Bence:", round(3 / np.sqrt(12) + 1 / 4, 3))
print("   P sajátértékek:", np.linalg.eigvalsh(P).round(3))
L = np.diag(A.sum(1)) - A
print("   L sajátértékek:", np.linalg.eigvalsh(L).round(3))

# Q8: x^T L x
q = x @ L @ x
print("Q8 x^T L x =", q, " csak D–E él:", 25, " rendezett párok (kétszer):", 2 * q, " x^T x =", x @ x)
y = Ah @ x / dh
print("   önhurkos átlag után:", round(y @ L @ y, 3))

# karate: 2 ugrásos környezetek
K = nx.karate_club_graph()
c2 = set(nx.single_source_shortest_path_length(K, 0, cutoff=2))
p2 = set(nx.single_source_shortest_path_length(K, 33, cutoff=2))
print("karate 2 ugrás: edző", len(c2), "elnök", len(p2), "unió", len(c2 | p2))
print("elnök saját súlya 1/18 =", round(1 / 18, 4))
