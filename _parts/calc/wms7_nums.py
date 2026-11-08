# Matstat 7. fejezet, w2-widgetek elvárt számai
import numpy as np
from itertools import combinations
from scipy import stats
B = stats.binom
print("== binom-test")
for n in (10, 20, 50, 100):
    for a in (0.10, 0.05, 0.01):
        lo = max([c for c in range(-1, n + 1) if B.cdf(c, n, .5) <= a / 2])
        hi = n - lo
        rr = max([c for c in range(-1, n + 1) if B.sf(c - 1, n, .5) <= a] + [n + 1], key=lambda c: -c)  # smallest c with P(X>=c)<=a
        rr = min(c for c in range(0, n + 2) if B.sf(c - 1, n, .5) <= a)
        ll = max(c for c in range(-1, n + 1) if B.cdf(c, n, .5) <= a)
        print(n, a, "two", lo, hi, round(B.cdf(lo, n, .5) + B.sf(hi - 1, n, .5), 5), "right>=", rr, round(B.sf(rr - 1, n, .5), 5), "left<=", ll, round(B.cdf(ll, n, .5), 5))
for k in (60, 61, 50, 40):
    r = B.sf(k - 1, 100, .5); l = B.cdf(k, 100, .5)
    two = min(1, 2 * min(r, l))
    print("k", k, "two", round(two, 5), "right", round(r, 5), "left", round(l, 5))
print("== p-dance")
for n in (16, 32, 64, 128):
    for d in (0, .2, .5, .8):
        dfree = 2 * n - 2; tc = stats.t.ppf(.975, dfree); nc = d * np.sqrt(n / 2)
        exact = stats.nct.sf(tc, dfree, nc) + stats.nct.cdf(-tc, dfree, nc) if d else .05
        appr = stats.norm.sf(1.96 - nc) + stats.norm.cdf(-1.96 - nc)
        print(n, d, "approx", round(appr, 4), "exact", round(exact, 4))
rng = np.random.default_rng(1)
n, d, R = 32, .5, 200000
x = rng.standard_normal((R, n)); y = rng.standard_normal((R, n)) + d
p = stats.ttest_ind(y, x, axis=1).pvalue
print("sim n=32 d=0.5 power", (p < .05).mean(), "pct10/50/90", np.percentile(p, [10, 50, 90]))
print("== permutation")
def perm(A, Bv):
    allv = A + Bv; n = len(A); N = len(allv); obs = np.mean(A) - np.mean(Bv)
    ds = []
    for c in combinations(range(N), n):
        s = set(c); a = [allv[i] for i in c]; b = [allv[i] for i in range(N) if i not in s]
        ds.append(np.mean(a) - np.mean(b))
    ds = np.round(np.array(ds), 9)
    one = (ds >= obs - 1e-9).sum(); two = (np.abs(ds) >= abs(obs) - 1e-9).sum()
    t = stats.ttest_ind(A, Bv)
    print("obs", obs, "N", len(ds), "one", one, one / len(ds), "two", two, two / len(ds), "t one", t.pvalue / 2, "t two", t.pvalue, "t", t.statistic)
    print("  distinct values", len(set(ds)), "range", ds.min(), ds.max())
perm([7, 9, 11], [3, 5, 4])
perm([72, 75, 78, 80, 81, 83, 85, 90], [65, 68, 70, 72, 74, 76, 79, 82])
print("== p-hacking")
print("theory", 1 - .95 ** 20, 1 - .9975 ** 20, "mean hits", 20 * .05, 20 * .0025)
