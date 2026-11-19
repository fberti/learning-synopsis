import numpy as np, itertools as it
from scipy import stats as st
from math import comb, sqrt
t=np.array([[90,60,50],[100,90,60],[40,70,40]])
r=st.chi2_contingency(t); print("lakohely", round(r[0],3), r[2], r[1]); E=r[3]; print(np.round(E,2)); print("contrib",np.round((t-E)**2/E,2)); print("resid",np.round((t-E)/np.sqrt(E),2))
print("V", sqrt(r[0]/(t.sum()*2)))
# Fisher
def fisher_tab(a,b,c,d):
    return st.fisher_exact([[a,b],[c,d]]), st.fisher_exact([[a,b],[c,d]],alternative="greater")
print("tea 4004", fisher_tab(4,0,0,4))
print("klin 7/8 vs 2/8", fisher_tab(7,1,2,6), st.chi2_contingency([[7,1],[2,6]],correction=False)[:3], st.chi2_contingency([[7,1],[2,6]])[:2])
# hypergeom distribution: 16 betegek, 9 gyógyult, 8 kezelt
for k in range(1,9): print(k, comb(9,k)*comb(7,8-k), round(comb(9,k)*comb(7,8-k)/comb(16,8),4))
print(comb(16,8))
# 6 csésze 3/3
for k in range(4): print("6cs",k, comb(3,k)*comb(3,3-k))
# sign test 6 workers
d=np.array([3,5,-1,4,2,5]); print("sign", st.binomtest(5,6,.5).pvalue, 7/64*2)
print("wilcoxon", st.wilcoxon(d, method="exact") if hasattr(st,'wilcoxon') else None)
rk=st.rankdata(abs(d)); print("ranks",rk)
cnt={}
for s in it.product([0,1],repeat=6):
    wm=sum(rk[i] for i in range(6) if s[i]); cnt[wm]=cnt.get(wm,0)+1
print(sorted(cnt.items())); print("P(W-<=1)", sum(v for k,v in cnt.items() if k<=1)/64)
# no ties version: 5 workers? enumerate n=4 for teaching
print("t on d", st.ttest_1samp(d,0))
d2=d.copy(); d2[1]=50; print("outlier t", st.ttest_1samp(d2,0), "wilcox same ranks", st.rankdata(abs(d2)))
d3=np.array([3,5,-1,4,2,-50]); print("neg outlier t", st.ttest_1samp(d3,0), st.rankdata(abs(d3)))
