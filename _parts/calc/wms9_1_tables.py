# 9. fejezet w1: independence-table és fisher-exact elvárt értékei (scipy)
import numpy as np
from scipy import stats
from math import comb
PRE = {"smoke": [[30,70],[20,80]], "smoke2": [[60,140],[40,160]],
       "party": [[90,60,50],[100,90,60],[40,70,40]], "firms": [[18,2],[5,25]], "clinic": [[7,1],[2,6]]}
for k, M in PRE.items():
    M = np.array(M, float)
    chi, p, df, E = stats.chi2_contingency(M, correction=False)
    N = M.sum(); V = np.sqrt(chi / (N * (min(M.shape) - 1)))
    r = (M - E) / np.sqrt(E)
    print(f"{k}: chi2={chi:.4f} df={df} p={p:.6g} V={V:.4f} minE={E.min():.3f}")
    print("  E=", np.round(E, 2).tolist()); print("  r=", np.round(r, 2).tolist())
    print("  contrib=", np.round((M-E)**2/E, 2).tolist())
for name, M in {"tea8": [[4,0],[0,4]], "tea6": [[3,0],[0,3]], "clinic": [[7,1],[2,6]]}.items():
    (a,b),(c,d) = M; r1=a+b; c1=a+c; N=a+b+c+d
    ks = range(max(0, r1+c1-N), min(r1,c1)+1)
    w = [comb(c1,k)*comb(N-c1,r1-k) for k in ks]; tot = comb(N, r1)
    _, p2 = stats.fisher_exact(M); _, pg = stats.fisher_exact(M, alternative="greater")
    c0 = stats.chi2_contingency(M, correction=False); cy = stats.chi2_contingency(M, correction=True)
    print(f"{name}: ks={list(ks)} w={w} tot={tot} one(greater)={pg:.5f} two={p2:.5f} chi={c0[0]:.4f} p={c0[1]:.5f} yates={cy[0]:.4f} p={cy[1]:.5f} minE={c0[3].min():.3f}")
# szerkesztett tábla a böngészős tesztből
M = [[12,3],[5,9]]
print("edit", stats.fisher_exact(M, alternative="greater")[1], stats.fisher_exact(M)[1],
      stats.chi2_contingency(M, correction=False)[1], stats.chi2_contingency(M)[1], stats.chi2_contingency(M)[3].min())
