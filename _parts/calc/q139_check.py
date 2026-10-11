# Kvíz ai13-139 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy python -I q139_check.py
import numpy as np
from math import comb, sin, radians

print("víz H–H", 2 * 0.96 * sin(radians(104.5 / 2)))
# Q1: (1;1;1) és (3;4;7)
a, b = np.array([1, 1, 1.]), np.array([3, 4, 7.])
d = np.linalg.norm(b - a)
th = 0.7; R = np.array([[np.cos(th), -np.sin(th), 0], [np.sin(th), np.cos(th), 0], [0, 0, 1]]); t = np.array([5, 0, 0.])
print("Q1 d", d, "forgatva+eltolva", np.linalg.norm((R @ b + t) - (R @ a + t)), "| rossz: négyzet", d ** 2, "Manhattan", np.abs(b - a).sum())
# Q2: sugárgráf, határ 5 Å
dist = {"A–B": 3.2, "A–C": 5.4, "B–C": 4.9, "C–D": 2.0, "B–D": 6.3}
print("Q2 élek", [k for k, v in dist.items() if v < 5])
# Q4: rugó, (0;0) és (0;1,4), c(d) = -0,25 (d-1)
def step(x1, x2, c):
    return x1 + (x1 - x2) * c, x2 + (x2 - x1) * c
x1, x2 = np.array([0, 0.]), np.array([0, 1.4]); d = np.linalg.norm(x2 - x1); c = -0.25 * (d - 1)
print("Q4 d", d, "c", c, "helyes", step(x1, x2, c))
print("   rossz: fordított különbségvektor", x1 + (x2 - x1) * c, x2 + (x1 - x2) * c)
u = (x2 - x1) / d
print("   rossz: egységvektorral", x1 - u * c, x2 + u * c)
c2 = -0.25 * d
print("   rossz: c=-0,25 d", step(x1, x2, c2))
# forgatási ekvivariancia ellenőrzés
R2 = np.array([[0, -1], [1, 0.]])
y1, y2 = step(R2 @ x1, R2 @ x2, c); print("   ekvivariancia", np.allclose(y1, R2 @ step(x1, x2, c)[0]), np.allclose(y2, R2 @ step(x1, x2, c)[1]))
# szöveg: rugós példák
print("szöveg", step(np.array([0, 0.]), np.array([2, 0.]), -0.25), step(np.array([0, 0.]), np.array([0, 2.]), -0.25), step(np.array([1, 1.]), np.array([3, 1.]), -0.25))
print("gyak d=3", step(np.array([0, 0.]), np.array([3, 0.]), -0.5), "C(20,2)", comb(20, 2), "20*8/2", 20 * 8 // 2)
# Q6: abszolút koordináta a frissítésben – eltolás és forgatás
rng = np.random.default_rng(0); X = rng.normal(size=(4, 3)); phi = rng.normal(size=(4, 4))
def upd_abs(X): return X + phi @ X
def upd_diff(X): return X + np.array([sum((X[i] - X[j]) * phi[i, j] for j in range(4) if j != i) for i in range(4)])
tt = np.array([1, 2, 3.]); Q, _ = np.linalg.qr(rng.normal(size=(3, 3)))
print("Q6 abs: eltolás-ekv", np.allclose(upd_abs(X + tt), upd_abs(X) + tt), "forgatás-ekv", np.allclose(upd_abs(X @ Q.T), upd_abs(X) @ Q.T))
print("   diff: eltolás-ekv", np.allclose(upd_diff(X + tt), upd_diff(X) + tt), "forgatás-ekv", np.allclose(upd_diff(X @ Q.T), upd_diff(X) @ Q.T))
