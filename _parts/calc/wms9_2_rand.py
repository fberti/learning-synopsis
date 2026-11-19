# a böngészős véletlen minták (mulberry32) újragenerálása és ellenőrzése: ecdf-ks, benford
import math
from scipy import stats
import numpy as np
def mulberry32(a):
    a &= 0xFFFFFFFF
    def imul(x, y): return (x * y) & 0xFFFFFFFF
    def f():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        r = imul(a ^ (a >> 15), 1 | a)
        r = ((r + imul(r ^ (r >> 7), 61 | r)) & 0xFFFFFFFF) ^ r
        return ((r ^ (r >> 14)) & 0xFFFFFFFF) / 4294967296
    return f
def rnorm(r):
    u = 0
    while not u: u = r()
    return math.sqrt(-2 * math.log(u)) * math.cos(2 * math.pi * r())
def rexp(r, m):
    u = 0
    while not u: u = r()
    return -m * math.log(u)
for dist, off in (("norm", 0), ("exp", 1), ("unif", 2)):
    for n in (10, 25, 100):
        r = mulberry32(97 * 1000 + n + off)
        x = [500 + 10 * rnorm(r) if dist == "norm" else 490 + rexp(r, 10) if dist == "exp" else 500 + 10 * math.sqrt(3) * (2 * r() - 1) for _ in range(n)]
        k = stats.kstest(x, stats.norm(500, 10).cdf)
        print(dist, n, "D=%.4f exact p=%.4f" % (k.statistic, k.pvalue), "| mu=505: D=%.4f" % stats.kstest(x, stats.norm(505, 10).cdf).statistic if dist == "unif" and n == 100 else "")
P = np.log10(1 + 1 / np.arange(1, 10))
def lead(v): return int(("%.10e" % abs(v))[0])
r = mulberry32(98); c = np.bincount([lead(math.exp(10 + 1.5 * rnorm(r))) for _ in range(500)], minlength=10)[1:]
print("bills", list(c), stats.chisquare(c, 500 * P))
r = mulberry32(98 + 5000); c = np.bincount([lead(1 + math.floor(9999 * r())) for _ in range(500)], minlength=10)[1:]
print("unif", list(c), stats.chisquare(c, 500 * P))
c = np.array([8, 2, 0, 0, 1, 3, 1, 2, 3]); print("own", stats.chisquare(c, c.sum() * P))
