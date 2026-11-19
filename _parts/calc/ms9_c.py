import numpy as np, itertools as it
from scipy import stats as st
from math import comb, sqrt, log10
A=[72,75,78,80,81,83,85,90]; B=[65,68,70,72,74,76,79,82]
print("MW 3+3", st.mannwhitneyu([7,9,11],[3,5,4],method="exact"))
print("MW 8+8", st.mannwhitneyu(A,B,method="exact"), st.mannwhitneyu(A,B,method="asymptotic"), st.mannwhitneyu(A,B,method="asymptotic",use_continuity=False))
r=st.rankdata(A+B); print("ranks",r, "RA",r[:8].sum())
# exact perm distribution with ties
vals=np.array(A+B); rk=st.rankdata(vals); obs=rk[:8].sum(); cnt=0; tot=0
for c in it.combinations(range(16),8):
    s=rk[list(c)].sum(); tot+=1; cnt+= s>=obs
print("exact one-sided with ties", cnt/tot, 2*cnt/tot, tot)
print("t 8+8", st.ttest_ind(A,B))
A2=A[:-1]+[150]; print("outlier A 90->150: t", st.ttest_ind(A2,B), "welch", st.ttest_ind(A2,B,equal_var=False), "MW", st.mannwhitneyu(A2,B,method="asymptotic"))
B2=B[:-1]+[20]; print("outlier B 82->20: t", st.ttest_ind(A,B2), "MW", st.mannwhitneyu(A,B2,method="asymptotic"))
# normal approx formulas
n1=n2=8; EU=n1*n2/2; VU=n1*n2*(n1+n2+1)/12; U=st.mannwhitneyu(A,B).statistic; print("U",U,"EU",EU,"sd",sqrt(VU),"z",(U-EU)/sqrt(VU), 2*st.norm.sf((U-EU)/sqrt(VU)))
print("U/(n1n2)", U/64)
# KW
print("KW", st.kruskal([7,9,11],[3,5,4],[6,8,10]))
# KS cukor
x=np.array([488,497,499,500]); print("KS cukor", st.kstest(x, lambda v: st.norm.cdf(v,500,10)))
F=st.norm.cdf((np.sort(x)-500)/10); n=4; print(np.round(F,3), [(i+1)/n-F[i] for i in range(n)], [F[i]-i/n for i in range(n)])
u=np.array([0.08,0.21,0.43,0.52,0.95]); print("KS unif", st.kstest(u,"uniform"))
print("D crit n=4,5,10,20: ", [round(st.kstwo.ppf(.95,n),3) for n in (4,5,10,20,25,50)], [round(1.358/sqrt(n),3) for n in (4,5,10,20,25,50)])
print("KS 2 sample", st.ks_2samp(A,B))
# Benford
P=np.array([log10(1+1/d) for d in range(1,10)]); print("benford", np.round(P*100,1))
fd=[int(str(2**k)[0]) for k in range(1,101)]; c=np.bincount(fd,minlength=10)[1:]; print("2^1..100", c, st.chisquare(c, 100*P))
fd=[int(str(2**k)[0]) for k in range(1,1001)]; c=np.bincount(fd,minlength=10)[1:]; print("2^1..1000", c)
fake=np.array([30,28,24,22,22,20,19,18,17]); print(fake.sum(), np.round(200*P,1), st.chisquare(fake,200*P), np.round((fake-200*P)**2/(200*P),2))
