# F-próba téves riasztása igaz H0 mellett (8.6-c táblázat) + közös vs Welch (5 vs 20) szimuláció
import numpy as np
from scipy import stats
rng = np.random.default_rng(7); R = 20000
gens = {"normális": lambda s: rng.standard_normal(s), "t5": lambda s: rng.standard_t(5, s),
        "exp": lambda s: rng.exponential(1, s), "egyenletes": lambda s: rng.uniform(0, 1, s)}
for name, g in gens.items():
    row = []
    for n in (10, 25, 100):
        a, b = g((R, n)), g((R, n))
        F = a.var(1, ddof=1) / b.var(1, ddof=1)
        p = 2 * np.minimum(stats.f.sf(F, n-1, n-1), stats.f.cdf(F, n-1, n-1))
        row.append(round((p < .05).mean(), 3))
    print(name, row)
a = rng.normal(0, 10, (R, 5)); b = rng.normal(0, 3, (R, 20))
print("közös", (stats.ttest_ind(a, b, axis=1).pvalue < .05).mean(),
      "Welch", (stats.ttest_ind(a, b, axis=1, equal_var=False).pvalue < .05).mean())
