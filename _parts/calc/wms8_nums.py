# Matstat 8. fejezet, w2-widgetek elvárt számai (Python-ellenőrzés)
import numpy as np
from scipy import stats
rng = np.random.default_rng(8)
R = 40000
print("== welch-sim ==")
for n1, s1, n2, s2 in [(10, 1, 10, 1), (10, 3, 10, 1), (5, 10, 20, 3), (20, 10, 5, 3)]:
    x = rng.normal(0, s1, (R, n1)); y = rng.normal(0, s2, (R, n2))
    pp = stats.ttest_ind(x, y, axis=1, equal_var=True).pvalue
    pw = stats.ttest_ind(x, y, axis=1, equal_var=False).pvalue
    print((n1, s1, n2, s2), f"közös {100*(pp<0.05).mean():.1f}%  Welch {100*(pw<0.05).mean():.1f}%")
print("== f-test-sim ==")
def draw(kind, shape):
    if kind == "norm": return rng.normal(size=shape)
    if kind == "t5": return rng.standard_t(5, size=shape)
    if kind == "exp": return rng.exponential(size=shape)
    return rng.uniform(size=shape)
for kind in ("norm", "t5", "exp", "unif"):
    out = []
    for n in (10, 25, 100):
        x = draw(kind, (R, n)); y = draw(kind, (R, n))
        F = x.var(axis=1, ddof=1) / y.var(axis=1, ddof=1)
        c = stats.f.cdf(F, n - 1, n - 1); p = 2 * np.minimum(c, 1 - c)
        out.append(f"{100*(p<0.05).mean():.1f}%")
    print(kind, " / ".join(out))
for n in (10, 25, 100):
    print("F krit", n, stats.f.ppf([0.025, 0.975], n - 1, n - 1))
print("== ab-test ==")
R2 = 20000
kA = rng.binomial(100, 0.10, (R2, 20)).cumsum(1); kB = rng.binomial(100, 0.10, (R2, 20)).cumsum(1)
n = 100 * np.arange(1, 21)
ph = (kA + kB) / (2 * n); se = np.sqrt(ph * (1 - ph) * 2 / n)
with np.errstate(divide="ignore", invalid="ignore"):
    z = np.where(se > 0, (kB - kA) / n / se, 0)
p = 2 * stats.norm.sf(np.abs(z))
print(f"bármikor {100*(p<0.05).any(1).mean():.1f}%  csak a végén {100*(p[:, -1]<0.05).mean():.1f}%")
print("== power-planner ==")
z = stats.norm.ppf
def nm(D, s, a, pw): return 2 * s**2 * (z(1 - a/2) + z(pw))**2 / D**2
for args in [(3, 12, .05, .8), (0.5, 1, .05, .8), (0.5, 1, .05, .9)]:
    v = nm(*args); print(args, f"{v:.3f} -> {int(np.ceil(v))}")
print("kerekített z-kkel (1,96; 0,84):", 2*144*(1.96+0.84)**2/9)
SE = 12*np.sqrt(2/100); print("erő n=100:", stats.norm.cdf(3/SE - z(.975)), "+ másik farok:", stats.norm.cdf(3/SE - z(.975)) + stats.norm.cdf(-3/SE - z(.975)))
p1, p2 = .10, .15; pb = (p1+p2)/2
v = (z(.975)*np.sqrt(2*pb*(1-pb)) + z(.8)*np.sqrt(p1*(1-p1)+p2*(1-p2)))**2/(p1-p2)**2
print("arányok:", v, int(np.ceil(v)))
