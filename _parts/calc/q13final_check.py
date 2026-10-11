# ai13-final kvíz számainak ellenőrzése: uv run -q --with numpy python -I _parts/calc/q13final_check.py
import numpy as np, math

# 1. K4: tr(A^3) és a háromszögek
A = np.ones((4, 4)) - np.eye(4)
t = np.trace(np.linalg.matrix_power(A, 3))
print("K4 tr(A^3) =", t, "háromszög =", t / 6, "rossz: /3 ->", t / 3, " ×3 =", 4 * 3, " ×2 =", 4 * 2)
print("K4 (A^3)_vv =", np.diag(np.linalg.matrix_power(A, 3)))

# 5. GCN élsúly: küldő fokszáma 15, fogadóé 3 (önhurok nélkül)
du, dv = 15, 3
print("GCN súly %.3f, önhurok nélkül %.3f, csak fogadó (átlag) %.3f, gyök nélkül %.4f" % (
    1 / math.sqrt((du + 1) * (dv + 1)), 1 / math.sqrt(du * dv), 1 / (dv + 1), 1 / ((du + 1) * (dv + 1))))

# 9. csillag: középpont + 3 levél, x = (4; 0; 0; 0), ismételt önhurkos átlag
S = np.zeros((4, 4)); S[0, 1:] = 1; S[1:, 0] = 1
Ah = S + np.eye(4); M = Ah / Ah.sum(1, keepdims=True)
x = np.array([4., 0, 0, 0])
h = x.copy()
for k in range(1, 61):
    h = M @ h
    if k in (1, 2, 3, 60): print("csillag", k, "lépés:", np.round(h, 4))
dh = Ah.sum(1)
print("fokszámmal súlyozott átlag:", (dh @ x) / dh.sum(), "sima átlag:", x.mean())

# 4. recepciós mező: 6 ugrás, 3 réteg -> kell 6 réteg; egy virtuális csúccsal 2 lépés
print("virtuális csúcs: bármely pár távolsága <= 2")

# 13. hipotetikus kis adat: 150 molekula, 10 hajtás -> 15 / hajtás, 1 molekula = 6,7 pp
print("150/10 =", 150 / 10, "1 molekula = %.1f pp" % (100 / 15), "különbség 84-82 = 2 pp vs szórás 8-9")

# 2./3./6./8./10./11./12./14.: fogalmi kérdések, számolás nélkül.
# 8. WL: út vs csillag (4 csúcs) fokszám-hisztogram; hatszög vs 2 háromszög; 8-kör vs 2 négyzet
def wl(adj, rounds=6):
    n = len(adj); c = [0] * n
    for _ in range(rounds):
        sig = [(c[v], tuple(sorted(c[u] for u in adj[v]))) for v in range(n)]
        c = sig
    return sorted(map(str, c))
def cyc(n, off=0): return {off + i: [off + (i - 1) % n, off + (i + 1) % n] for i in range(n)}
def merge(*ds):
    out = {}
    for d in ds: out.update(d)
    return [out[i] for i in range(len(out))]
path4 = [[1], [0, 2], [1, 3], [2]]; star4 = [[1, 2, 3], [0], [0], [0]]
print("út vs csillag külön:", wl(path4) != wl(star4))
print("hatszög vs 2 háromszög külön:", wl(merge(cyc(6))) != wl(merge(cyc(3), cyc(3, 3))))
print("8-kör vs 2 négyzet külön:", wl(merge(cyc(8))) != wl(merge(cyc(4), cyc(4, 4))))
# dekalin: két hattagú gyűrű közös éllel; biciklopentil: két öttagú gyűrű egy kötéssel
dek = {i: [] for i in range(10)}
def add(g, a, b): g[a].append(b); g[b].append(a)
for a, b in [(0,1),(1,2),(2,3),(3,4),(4,5),(5,0),(0,6),(6,7),(7,8),(8,9),(9,5)]: add(dek, a, b)
bic = {i: [] for i in range(10)}
for a, b in [(0,1),(1,2),(2,3),(3,4),(4,0),(5,6),(6,7),(7,8),(8,9),(9,5),(0,5)]: add(bic, a, b)
print("dekalin vs biciklopentil külön:", wl([dek[i] for i in range(10)]) != wl([bic[i] for i in range(10)]),
      "élek", sum(map(len, dek.values())) // 2, sum(map(len, bic.values())) // 2)
