# Kvíz ai13-135 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy python -I q135_check.py
import itertools
import numpy as np

E = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4)]
A = np.zeros((5, 5))
for u, v in E:
    A[u, v] = A[v, u] = 1
I = np.eye(5)
x = np.array([1., 0, 0, 0, 5])
deg = A.sum(1)
Ah = A + I
dh = Ah.sum(1)
P = Ah / np.sqrt(np.outer(dh, dh))

# Q1: GraphSAGE h' = x_v + 0,5 * átlag, Dávid
m = A @ x / deg
h = x + .5 * m
print("Q1 h' =", h.round(3), " Dávid:", h[3])
print("   rossz: 0,5 nélkül", x[3] + m[3], " összeggel", x[3] + .5 * (A @ x)[3], " önhurkos átlag", round((Ah @ x / dh)[3], 3),
      " GCN", round((P @ x)[3], 3), " GCN Emese", (P @ x)[4])
mx = np.array([max(x[A[v] > 0]) for v in range(5)])
print("   max-gyűjtéssel:", x + .5 * mx)

# Q2: mintavétel 25, 10
print("Q2", 1 + 25 + 25 * 10, "| cél nélkül", 25 + 250, "| összeadva", 1 + 25 + 10, "| csak 2. szint", 250)

# Q3: GraphSAGE-réteg 64 -> 32 összefűzéssel
print("Q3", 128 * 32 + 32, "| bias nélkül", 128 * 32, "| összefűzés nélkül", 64 * 32 + 32, "| bias 64", 128 * 32 + 64)

# Q4: softmax (2;0;0;0)
s = np.exp([2, 0, 0, 0]); s /= s.sum()
print("Q4", s.round(3), " rossz: e^2/(e^2+1) =", round(np.exp(2) / (np.exp(2) + 1), 3), " egyenletes 0,25")

# GAT kiinduló példa (Bence) és Csilla, Dávid
def gat(v):
    nbrs = [u for u in range(5) if Ah[v, u]]
    e = np.array([.5 * x[v] + x[u] for u in nbrs])
    e = np.where(e > 0, e, .2 * e)
    a = np.exp(e) / np.exp(e).sum()
    return dict(zip(("ABCDE"[i] for i in nbrs), a.round(3)))
for v in range(5):
    print("GAT", "ABCDE"[v], gat(v))

# Q5: GAT paraméterek d=16, d'=8
one = 16 * 8 + 2 * 8
print("Q5 egy fej", one, " 8 fej", 8 * one, "| a nélkül", 8 * 16 * 8, "| a közös", 8 * 16 * 8 + 16)

# Q8: {1,3} vs {2,2}; {C} vs {C,C}
for a, b in (([1, 3], [2, 2]), ([3], [3, 3, 3])):
    print("Q8", a, b, "összeg", sum(a), sum(b), "átlag", np.mean(a), np.mean(b), "max", max(a), max(b))
C, O = np.array([1, 0]), np.array([0, 1])
for S in ([C], [C, C], [C, O], [C, C, O, O]):
    S = np.array(S)
    print("   ", S.sum(0), S.mean(0), S.max(0))

# gyakorló: 4 szomszéd (0,0,0,8), 2-es minta
means = [np.mean(p) for p in itertools.combinations([0, 0, 0, 8], 2)]
print("minta átlagok:", means, "várható", np.mean(means), "P(0) =", means.count(0) / len(means))
# GAT gyakorló számok
w = np.exp([1, 1, 0]); w /= w.sum()
print("(1;1;0) súlyok", w.round(3), "kimenet", round(w @ [2, 4, 10], 3))
print("e^2/(e^2+3) =", round(np.exp(2) / (np.exp(2) + 3), 3), " 1/(e^2+3) =", round(1 / (np.exp(2) + 3), 3))
