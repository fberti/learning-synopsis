# Matstat 6. fejezet, w2-widgetek elvárt számai
import numpy as np
from scipy import stats as st
z = lambda L: st.norm.ppf(1 - (1 - L) / 2)
print("== ci-width")
for L in (.8, .9, .95, .99, .999):
    print(L, round(z(L) * 10 / 15**.5, 3), "t:", round(st.t.ppf(1 - (1 - L) / 2, 14) * 10 / 15**.5, 3))
print("n=60", round(z(.95) * 10 / 60**.5, 3), "t14", st.t.ppf(.975, 14))
def wald(k, n, L=.95):
    p = k / n; d = z(L) * np.sqrt(p * (1 - p) / n); return p - d, p + d
def wilson(k, n, L=.95):
    p = k / n; zz = z(L); c = (p + zz**2 / (2 * n)) / (1 + zz**2 / n); hw = zz * np.sqrt(p * (1 - p) / n + zz**2 / (4 * n * n)) / (1 + zz**2 / n)
    return c - hw, c + hw
print("== proportion-ci")
for k, n in ((0, 20), (7, 10), (176, 800), (310, 1000), (1, 30), (2, 20)):
    print(k, n, np.round(wald(k, n), 4), np.round(wilson(k, n), 4))
def cov(f, n, p, L=.95):
    ks = np.arange(n + 1); lo, hi = f(ks, n, L); m = (lo <= p + 1e-12) & (p - 1e-12 <= hi)
    return st.binom.pmf(ks, n, p)[m].sum()
for n, p in ((20, .1), (20, .3), (20, .5), (100, .05), (10, .5), (1000, .01)):
    print(n, p, round(cov(wald, n, p), 4), round(cov(wilson, n, p), 4))
print("== sigma-ci")
K = np.array([401, 392, 387, 400, 408, 390, 415, 383, 395, 406, 418, 420, 381, 395, 379.])
s2 = K.var(ddof=1); print("mean", K.mean(), "s", K.std(ddof=1))
for L in (.9, .95, .99):
    a = 1 - L; lo, hi = st.chi2.ppf(a / 2, 14), st.chi2.ppf(1 - a / 2, 14)
    print(L, round(lo, 3), round(hi, 3), "var", round(14 * s2 / hi, 2), round(14 * s2 / lo, 2), "sd", round(np.sqrt(14 * s2 / hi), 3), round(np.sqrt(14 * s2 / lo), 3))
rng = np.random.default_rng(1)
for name, gen, sig in (("norm", lambda m, n: rng.normal(0, 1, (m, n)), 1), ("exp", lambda m, n: rng.exponential(1, (m, n)), 1), ("unif", lambda m, n: rng.uniform(0, 1, (m, n)), 12**-.5)):
    for n in (10, 15, 30, 100):
        x = gen(200000, n); v = x.var(axis=1, ddof=1)
        lo = (n - 1) * v / st.chi2.ppf(.975, n - 1); hi = (n - 1) * v / st.chi2.ppf(.025, n - 1)
        print(name, n, round(((lo <= sig**2) & (sig**2 <= hi)).mean(), 4))
print("== n-planner")
zz = z(.95)
n0 = (zz * 10 / 2.5)**2; print(n0, n0 / (1 + n0 / 500))
for p, d in ((.5, .03), (.5, .02), (.5, .01), (.31, .03)):
    print(p, d, zz**2 * p * (1 - p) / d**2)
print("== boot-ci (numpy, R=200000, percentilis np.quantile + (n+1)p)")
I = np.array([12, 15, 17, 18, 20, 22, 23, 25, 28, 34, 45, 61.])
def q1(a, p):  # (n+1)p hely
    s = np.sort(a); n = len(s); pos = (n + 1) * p; k = int(np.floor(pos)); t = pos - k
    return s[0] if k < 1 else s[-1] if k >= n else s[k - 1] + t * (s[k] - s[k - 1])
for nm, X in (("K", K), ("I", I)):
    n = len(X); m, s = X.mean(), X.std(ddof=1); t = st.t.ppf(.975, n - 1)
    print(nm, "t-KI", round(m - t * s / n**.5, 3), round(m + t * s / n**.5, 3), "median", np.median(X))
    B = X[rng.integers(0, n, (200000, n))]
    for sn, f in (("mean", lambda b: b.mean(1)), ("median", lambda b: np.median(b, 1)), ("sd", lambda b: b.std(1, ddof=1))):
        v = f(B); print(" ", sn, "SE", round(v.std(ddof=1), 3), "perc", round(q1(v, .025), 3), round(q1(v, .975), 3))
