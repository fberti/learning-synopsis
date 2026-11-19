# Matstat 9. fejezet, w2-widgetek elvárt számai (rank-test, ecdf-ks, benford)
import numpy as np, itertools, math
from scipy import stats
from math import comb
A0 = [72, 75, 78, 80, 81, 83, 85, 90]; B = [65, 68, 70, 72, 74, 76, 79, 82]

def perm_exact(A, B):
    """pontos permutációs p (kötésekkel, átlagranggal), kétoldali: |U - nm/2| >= megfigyelt"""
    allv = A + B; r = stats.rankdata(allv); nA = len(A)
    RA = r[:nA].sum(); mu = nA * (len(allv) + 1) / 2
    cnt = tot = 0
    for idx in itertools.combinations(range(len(allv)), nA):
        s = r[list(idx)].sum(); tot += 1
        if abs(s - mu) >= abs(RA - mu) - 1e-9: cnt += 1
    return cnt / tot

print("=== rank-test ===")
for mx in (90, 150, 200, 100, 120):
    A = A0[:-1] + [mx]
    tp = stats.ttest_ind(A, B); tw = stats.ttest_ind(A, B, equal_var=False)
    mw = stats.mannwhitneyu(A, B, alternative="two-sided", method="asymptotic")
    r = stats.rankdata(A + B); RA = r[:8].sum(); U = RA - 36
    va, vb = np.var(A, ddof=1) / 8, np.var(B, ddof=1) / 8
    dfw = (va + vb) ** 2 / (va ** 2 / 7 + vb ** 2 / 7)
    print(f"maxA={mx}: meanA={np.mean(A):.4f} meanB={np.mean(B):.4f} sA={np.std(A,ddof=1):.4f} sB={np.std(B,ddof=1):.4f}"
          f" t={tp.statistic:.4f} p={tp.pvalue:.5f} | Welch t={tw.statistic:.4f} df={dfw:.3f} p={tw.pvalue:.5f}"
          f" | RA={RA} U={U} U/64={U/64:.4f} MWp={mw.pvalue:.5f}")
print("perm exact (ties):", perm_exact(A0, B))
print("scipy exact:", stats.mannwhitneyu(A0, B, alternative="two-sided", method="exact").pvalue)
# kötés nélküli eset (72 -> 73 az A-ban): pontos p
A1 = [73] + A0[1:]
print("no-tie A (73): asympt", stats.mannwhitneyu(A1, B, method="asymptotic").pvalue, "exact", stats.mannwhitneyu(A1, B, method="exact").pvalue, "perm", perm_exact(A1, B))
# z statistic as widget (tie-corrected, continuity)
r = stats.rankdata(A0 + B); RA = r[:8].sum(); U = RA - 36; N = 16
_, tc = np.unique(A0 + B, return_counts=True)
var = 64 / 12 * ((N + 1) - (tc ** 3 - tc).sum() / (N * (N - 1)))
z = (abs(U - 32) - 0.5) / math.sqrt(var); print("z", z, "p", 2 * stats.norm.sf(z))

print("=== ecdf-ks ===")
x = [488, 497, 499, 500]
r = stats.kstest(x, stats.norm(500, 10).cdf); print("4 zacskó:", r.statistic, "exact p", r.pvalue, stats.kstest(x, stats.norm(500, 10).cdf, method="asymp").pvalue)
def Q(lam): return 2 * sum((-1) ** (k - 1) * math.exp(-2 * k * k * lam * lam) for k in range(1, 101))
def qapprox(D, n): sn = math.sqrt(n); return min(1, max(0, Q((sn + 0.12 + 0.11 / sn) * D)))
print("Q approx 4 zacskó:", qapprox(0.5, 4))
for n in (4, 5, 10, 20, 25, 50, 100):
    print("crit n=", n, stats.kstwo.isf(0.05, n), 1.358 / math.sqrt(n))
r2 = stats.ks_2samp(A0, B); print("2-sample:", r2.statistic, r2.pvalue, "asymp", stats.ks_2samp(A0, B, method="asymp").pvalue)
# kétmintás kritikus érték n=m=8
for k in range(3, 9):
    d = k / 8
    # P(D >= d) a nullhipotézis alatt (pontos, kötés nélkül)
    from scipy.stats._stats_py import _compute_prob_outside_square
    print(" d=", d, "P(D>=d)=", _compute_prob_outside_square(8, k))

print("=== benford ===")
P = np.log10(1 + 1 / np.arange(1, 10))
def chi(c):
    c = np.array(c, float); n = c.sum(); e = n * P; x = ((c - e) ** 2 / e).sum()
    return n, x, stats.chi2.sf(x, 8), e, (c - e) ** 2 / e
fd = lambda v: int(str(v)[0])
pow2 = np.bincount([fd(2 ** k) for k in range(1, 1001)], minlength=10)[1:]
fib = [1, 1]
while len(fib) < 1000: fib.append(fib[-1] + fib[-2])
fibc = np.bincount([fd(v) for v in fib], minlength=10)[1:]
for name, c in (("kitalált", [30, 28, 24, 22, 22, 20, 19, 18, 17]), ("2^k", pow2), ("fib", fibc)):
    n, x, p, e, contr = chi(c)
    print(name, list(c), "n", n, "chi2 %.4f p %.3g" % (x, p), "e", np.round(e, 2), "contr", np.round(contr, 2))
print("crit", stats.chi2.isf(0.05, 8))
