import itertools as it, numpy as np
from scipy import stats as st
from math import comb, sqrt
b=lambda k,n: sum(comb(n,j) for j in range(k,n+1))/2**n
print("6: P>=5", b(5,6), "10: P>=8", b(8,10), "P>=9 of 10",b(9,10), "8 of 8", b(8,8), "7/8",b(7,8), "12: 10", b(10,12))
print("n100 62", (62-50)/5, 2*st.norm.sf(2.4))
# n=4 enumeration
r=[1,2,3,4]; c={}
for s in it.product([0,1],repeat=4):
    w=sum(r[i] for i in range(4) if s[i]); c[w]=c.get(w,0)+1
print(sorted(c.items()))
for n in (5,6,7,8,10):
    c={}
    for s in it.product([0,1],repeat=n):
        w=sum(i+1 for i in range(n) if s[i]); c[w]=c.get(w,0)+1
    cum=0; out=[]
    for w in sorted(c): cum+=c[w]; out.append((w,round(cum/2**n,4)))
    print(n, out[:6])
for d in ([3,5,-1,4,2,50],[3,5,-1,4,2,-50],[4,-2,6,8,-1,5,7,3]):
    print(d, st.wilcoxon(d), st.ttest_1samp(d,0).pvalue, st.rankdata(np.abs(d)))
n=20; E=n*(n+1)/4; sd=sqrt(n*(n+1)*(2*n+1)/24); print("n20", E, sd, (40-E)/sd, 2*st.norm.cdf((40-E)/sd))
# one-sample signed rank: lakbér pl medián 100 (eFt)? data
x=np.array([92,105,118,97,125,110,131,99,140,108]); d=x-100; print(d, st.rankdata(abs(d)), st.wilcoxon(d), (d>0).sum(), st.binomtest(int((d>0).sum()),10).pvalue, st.ttest_1samp(x,100))
