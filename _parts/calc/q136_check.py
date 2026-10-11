# Kvíz ai13-136 – numerikus válaszok és rossz válaszok ellenőrzése
# futtatás: uv run -q --with numpy python -I q136_check.py
import numpy as np
from math import exp, log, log10

C, O = np.array([1, 0]), np.array([0, 1])
def mp_sum(atoms, edges):
    n = len(atoms); H = np.array(atoms)
    A = np.zeros((n, n), int)
    for u, v in edges: A[u, v] = A[v, u] = 1
    nb = A @ H
    return H, nb, H + nb

# szöveg: metanol / glioxál kiolvasás
for name, at in (("metanol", [C, O]), ("glioxál", [O, C, C, O])):
    H = np.array(at); print(name, "sum", H.sum(0), "mean", H.mean(0), "max", H.max(0))
# szöveg: etanol, dimetil-éter egy réteg után
print("etanol", mp_sum([C, C, O], [(0, 1), (1, 2)])[2].sum(0))
print("dimetil-éter", mp_sum([C, O, C], [(0, 1), (1, 2)])[2].sum(0))
# Q2: glioxál O–C–C–O egy réteg után, összeg-kiolvasás
H, nb, Hn = mp_sum([O, C, C, O], [(0, 1), (1, 2), (2, 3)])
print("Q2 helyes összeg", Hn.sum(0), "| rossz: kezdeti", H.sum(0), "önhurok nélkül", nb.sum(0), "átlag", Hn.mean(0))

sig = lambda s: 1 / (1 + exp(-s))
# szöveg táblázat
U = {"U1": (1, 0), "U2": (0, 1), "U3": (1, 1)}; T = {"T1": (1, -0.5), "T2": (0.5, 1)}
for u, zu in U.items():
    for t, zt in T.items():
        s = np.dot(zu, zt); print(u, t, s, round(sig(s), 3))
print("szöveg veszteségek", -log(sig(1)), -log(1 - sig(-0.5)), sig(2), -log(1 - sig(2)))
print("gyakorló 480000/20000 =", (1000 * 500 - 20000) / 20000)
# Q4: z_u=(1;2), z_v=(0,5;-0,5)
s = np.dot((1, 2), (0.5, -0.5))
print("Q4 s", s, "helyes", round(sig(s), 3), "| rossz: σ(+0,5)", round(sig(0.5), 3), "nyers", s, "σ(1,5)", round(sig(1.5), 3))
# Q5: negatív pár, p=σ(1)
p = sig(1)
print("Q5 helyes", round(-log(1 - p), 3), "| rossz: pozitívként", round(-log(p), 3), "lg", round(-log10(1 - p), 3), "1-p", round(1 - p, 3))
# Q1 rossz válasz: glioxál összege / atomfajták száma (2) a 4 atom helyett
print("Q1 rossz átlag", np.array([2, 2]) / 2, "helyes átlag", np.array([2, 2]) / 4)
