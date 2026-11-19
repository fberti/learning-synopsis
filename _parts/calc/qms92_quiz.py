"""ms9 q2.js (9.5-9.7, fejezetzaro): a kvizvalaszok es rossz valaszok ellenorzese."""
import numpy as np, itertools
from scipy.stats import binom, norm, chi2, rankdata, kstwo, kstest, ks_2samp, kruskal, fisher_exact, hypergeom, mannwhitneyu, chi2_contingency
from math import comb, sqrt, log10
def wm(d):
    d=[x for x in d if x!=0]; r=rankdata(np.abs(d)); return sum(r[i] for i in range(len(d)) if d[i]<0), sum(r[i] for i in range(len(d)) if d[i]>0), r
def wm_signed(d):
    r=rankdata(d); return sum(r[i] for i in range(len(d)) if d[i]<0)
def U(a,b):
    r=rankdata(list(a)+list(b)); R=r[:len(a)].sum(); return R, R-len(a)*(len(a)+1)/2
print("=== ms9-95")
print("Q1 elojel 8+,1-,1 nulla: n=9", binom.sf(7,9,.5), "nullaval n=10", binom.sf(7,10,.5), "csak P(X=8)", binom.pmf(8,9,.5), "dupla", 2*binom.sf(7,9,.5))
d=[7,-4,2,9,-1,5]; print("Q2", wm(d), "elojeles rangsor", wm_signed(d), "ertekek", 5, "darab", 2)
d=[3,-3,5,1,6]; print("Q3 kotes", wm(d))
n=24; E=n*(n+1)/4; D=sqrt(n*(n+1)*(2*n+1)/24); print("Q4", E, D, (80-E)/D, "D^2-tel", (80-E)/D**2, "E=n(n+1)/2", (80-n*(n+1)/2)/D, "/12", (80-E)/sqrt(n*(n+1)*(2*n+1)/12), "p", 2*norm.cdf((80-E)/D))
print("Q6 n=5 min p", 2/32, "egyoldali", 1/32)
d=[4,6,-2,3,8,7]; print("Q7 eredeti", wm(d)); d2=[4,6,-20,3,8,7]; print("   -20", wm(d2)); print("   80", wm([4,6,-2,3,80,7]))
print("=== ms9-96")
print("Q1", U([4,9,12],[2,6,7,10]), "U_B", 12-U([4,9,12],[2,6,7,10])[1], "pairs", sum((a>b)+.5*(a==b) for a in [4,9,12] for b in [2,6,7,10]))
print("Q2 theta", 150/(10*20))
n1,n2=15,20; E=n1*n2/2; D=sqrt(n1*n2*(n1+n2+1)/12); U1=330-n1*(n1+1)/2; print("Q3", U1, E, D, (U1-E)/D, "R-rel", (330-E)/D, "D^2", (U1-E)/D**2, "E=n1n2", (U1-n1*n2)/D, "p", 2*norm.sf((U1-E)/D))
A,B,C=[10,11,12],[1,2,3],[4,5,6]; print("Q6 KW", kruskal(A,B,C), 12/90*(24**2+6**2+15**2)/3, "df3 krit", chi2.ppf(.95,3), "p df2", chi2.sf(7.2,2))
print("Q7 eredeti", U([5,8,9],[1,2,4,6]), "6->60", U([5,8,9],[1,2,4,60]), "U_B", 12-U([5,8,9],[1,2,4,60])[1])
print("Q8 3+3 min ketoldali", 2/comb(6,3), "ARE", 3/np.pi)
print("=== ms9-97")
x=np.array([.2,.5,.9]); i=np.arange(1,4); print("Q1", i/3-x, x-(i-1)/3, kstest(x,'uniform').statistic)
print("Q2 n=20 D=.25", kstwo.ppf(.95,20), kstwo.sf(.25,20), 1.36/20, 1.36/sqrt(20))
print("Q5 n=225", 1.36/15, 1.36/225, 1.96/15, 1.36/30, kstwo.ppf(.95,225))
print("Q6", ks_2samp([1,2,3,7],[4,5,6,8]))
print("=== ms9-final")
print("F2 pornyo", sum((np.array([40,30,20])-30)**2/30), chi2.sf(20/3,2), "tenyl nevezo", 100/40+100/20, "df3 krit", chi2.ppf(.95,3), "dupla p", 2*chi2.sf(20/3,2), "szazalek", sum((np.array([40,30,20])/90*100-100/3)**2/(100/3)))
print("F4 V", sqrt(12/(300*2)), sqrt(12/300), sqrt(12/(300*3)), 12/300, chi2.sf(12,6))
# Fisher aszimmetrikus: sorok 6,4; oszlopok 5,5; tabla 5|1, 0|4
t=[[5,1],[0,4]]; M,nA,N=10,5,6  # hypergeom(M=10, n=c1=5, N=r1=6)
h=hypergeom(10,5,6); ks=range(1,6); print("F6 eloszlas", {k:round(h.pmf(k)*comb(10,6)) for k in ks}, comb(10,6))
print("  egyoldali", h.sf(4), "ketoldali", fisher_exact(t).pvalue, "dupla", 2*h.sf(4), "csak megfigyelt", h.pmf(5))
print("  vart", chi2_contingency(t,correction=False)[3])
d=[10,-7,15,4,-2,12,5]; print("F9", wm(d), "elojeles", wm_signed(d), "ertek", 9)
print("F10 U", 28-10, "U2", 20-18, "28-20", 28-20, "Rmax", 6+7+8+9)
P1=log10(2); print("F13", 500*P1, 500/9)
print("F14", chi2.cdf(12,40), chi2.sf(12,40))
h=hypergeom(10,4,3); print("F6b sorok 3,7 oszlopok 4,6 tabla 3|0,1|6:", {k:round(h.pmf(k)*120) for k in range(4)},
  "ketoldali", fisher_exact([[3,0],[1,6]]).pvalue, "dupla", 2*h.pmf(3), "+X=0", h.pmf(3)+h.pmf(0), "P(X>=2)", h.sf(1),
  "vart", chi2_contingency([[3,0],[1,6]],correction=False)[3].min())
