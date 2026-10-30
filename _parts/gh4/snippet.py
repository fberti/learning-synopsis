import numpy as np
ids = ["Ko", "Vi", "Po", "La", "Ön", "Sz", "Kl"]
elek = [("Ko","Vi"), ("Ko","Po"), ("Vi","Po"), ("Vi","Sz"), ("Sz","Kl"),
        ("Sz","Ko"), ("Kl","Ko"), ("La","Ön"), ("La","Po"), ("Po","Ön")]
A = np.zeros((7, 7))
for u, v in elek:
    i, j = ids.index(u), ids.index(v); A[i, j] = A[j, i] = 1
d = A.sum(axis=1)
print("pi:", d / d.sum())                     # stacionárius eloszlás: d_i / 2m
lam, V = np.linalg.eigh(A)                    # növekvő sajátértékek
v = np.abs(V[:, -1]); print("sajátvektor:", (v / v.max()).round(2), "lambda1:", lam[-1].round(2))
L = np.diag(d) - A
mu, U = np.linalg.eigh(L)
print("mu2:", mu[1].round(3), "Fiedler:", U[:, 1].round(2))
print("egyik oldal:", [ids[i] for i in range(7) if U[i, 1] > 0])
