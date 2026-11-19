# 9.1-b chi-square-dice: elvetési arány (5%) 20 000 ismétléssel + a böngésző mulberry32-sorozatának pontos újrajátszása
import numpy as np
from scipy import stats
crit = stats.chi2.ppf(0.95, 5); print("crit", round(crit, 4))
rng = np.random.default_rng(1)
for q in (1/6, 0.25, 0.30):
    p = np.r_[np.full(5, (1-q)/5), q]
    out = []
    for n in (60, 120, 300, 600):
        f = rng.multinomial(n, p, size=20000); E = n/6
        out.append(f"{n}: {100*np.mean(((f-E)**2/E).sum(1) > crit):.1f}%")
    print(f"q={q:.3f}", ", ".join(out))
# mulberry32 – a widget generátora; seed 1091+n, 2000 kísérlet
def mulberry32(a):
    a &= 0xFFFFFFFF
    def imul(x, y): return (x * y) & 0xFFFFFFFF
    def nxt():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return nxt
def face(u, q): return 5 if u >= 1 - q else min(4, int(u * 5 / (1 - q)))
import sys
for q in (1/6, 0.25):
    res = []
    for n in (60, 120):
        r = mulberry32(1091 + n); k = 0
        for _ in range(2000):
            c = [0]*6
            for _ in range(n): c[face(r(), q)] += 1
            E = n/6; k += sum((x-E)**2/E for x in c) > crit
        res.append(f"{n}: {k}/2000")
    print(f"mulberry q={q:.3f}", res)
# kezdő állapot: seed 91, 60 dobás, q = 1/6
r = mulberry32(91); c = [0]*6
for _ in range(60): c[face(r(), 1/6)] += 1
chi = sum((x-10)**2/10 for x in c); print("start counts", c, "chi2", round(chi, 4), "p", round(stats.chi2.sf(chi, 5), 4))
