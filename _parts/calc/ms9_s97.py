import numpy as np
from scipy import stats as st
from math import sqrt
from scipy.stats import kstwo
print("2samp crit 8,8:", [ (d, st.ks_2samp(np.arange(8), np.arange(8)+0.5).pvalue) for d in [0]][:0])
# exact two-sample null probability of D>=d for n=m=8 via scipy's distribution
from scipy.stats._stats_py import _compute_prob_outside_square
for h in (5,6,7): print("P(D>=%d/8)"%h, _compute_prob_outside_square(8,h))
print("large n crit 2samp 50,50:", 1.358*sqrt(100/2500))
for n,D in [(100,.15),(25,.2),(10,.35),(20,.31),(50,.15)]: print(n,D,"crit",round(kstwo.ppf(.95,n),3),"p",round(kstwo.sf(D,n),4))
u=[0.08,0.21,0.43,0.52,0.95]; print(st.kstest(u,"uniform"))
# lilliefors example via simulation: crit for n=20 when params estimated
rng=np.random.default_rng(0); Ds=[]
for _ in range(20000):
    x=rng.normal(size=20); z=(x-x.mean())/x.std(ddof=1); Ds.append(st.kstest(z,"norm").statistic)
print("lilliefors crit n20 ~", np.quantile(Ds,.95), "vs KS", kstwo.ppf(.95,20), "rejection rate using KS crit", np.mean(np.array(Ds)>=kstwo.ppf(.95,20)))
