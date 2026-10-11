# 12.5 kvíz – számellenőrzés
import numpy as np
def sm(x):
    x = np.asarray(x, float); e = np.exp(x - x.max()); return e / e.sum()
I = np.eye(2)
X = np.array([[2, 0], [1, 1], [1, 0]], float)  # fa, levél, hullik
S = X @ X.T
print("Q1 hullik sor (helyes):", sm(S[2] / np.sqrt(2)).round(3))
print("Q1 skálázás nélkül:", sm(S[2]).round(3))
print("Q1 osztás softmax után:", (sm(S[2]) / np.sqrt(2)).round(3))
A = np.array([sm(r / np.sqrt(2)) for r in S])
print("Q1 oszlop (hullik-ra ki figyel):", A[:, 2].round(3))
print("teljes A:\n", A.round(3), "\nZ:\n", (A @ X).round(3))
# Q2 két token (2;0), (0;2)
X2 = np.array([[2, 0], [0, 2]], float); s = X2[0] @ X2.T
for name, w in [("helyes", sm(s / np.sqrt(2))), ("skála nélkül", sm(s)),
                ("softmax után oszt", sm(s) / np.sqrt(2)), ("d-vel oszt", sm(s / 2))]:
    print("Q2", name, w.round(3), (w @ X2).round(3))
# Q6 pontszámok aránya
print("Q6", (3000 / 1000) ** 2)
# Q8 fejek
d, h = 1024, 16
print("Q8 dk", d // h, "4d^2", 4 * d * d, "h*4d^2", h * 4 * d * d, "3d^2", 3 * d * d)
# levél B mondat ellenőrzés, cos 0,529
za = np.array([1.401, 0.401]); zb = za[::-1]
print("cos", round(za @ zb / (za @ za), 3))
# szinuszos kód d=4
for i in range(4):
    print("p", i, [round(f(i / 10000 ** (2 * k / 4)), 4) for k in range(2) for f in (np.sin, np.cos)])
