"""ms9 9.5-9.8: a szoveg szamainak ellenorzese."""
import numpy as np, itertools
from scipy import stats
from scipy.stats import binom, norm, chi2, rankdata, mannwhitneyu, wilcoxon, ttest_rel, ttest_ind, kstest, ks_2samp, kruskal, fisher_exact, chi2_contingency
from math import comb, sqrt, log10
def wexact(d):
    d=[x for x in d if x!=0]; r=rankdata(np.abs(d)); n=len(d)
    wm=sum(r[i] for i in range(n) if d[i]<0)
    cnt=sum(1 for s in itertools.product([0,1],repeat=n) if sum(r[i] for i in range(n) if s[i])<=wm+1e-9)
    return wm, sum(r)-wm, cnt/2**n
print("=== 9.5")
print("elojel 5/6", binom.sf(4,6,.5), 2*binom.sf(4,6,.5), "t", ttest_rel([3,5,-1,4,2,5],[0]*6).pvalue)
print("8/10", binom.sf(7,10,.5), "62/100 z", (62-50)/5, 2*norm.cdf(-2.4))
print("7/8", binom.sf(6,8,.5), "8/8", .5**8, 2*.5**8, "10/11", binom.sf(9,11,.5), "400", 2*norm.cdf(-2), "n5", 2/32)
print("4 kul", wexact([2,5,-1,3]))
print("hat", wexact([3,5,-1,4,2,5]))
print("gyak", wexact([4,-2,6,8,-1,5,7,3]), wilcoxon([4,-2,6,8,-1,5,7,3]).pvalue, 2*binom.sf(5,8,.5), binom.sf(5,8,.5))
n=20; E=n*(n+1)/4; D=sqrt(n*(n+1)*(2*n+1)/24); print("n20", E, D**2, D, (40-E)/D, 2*norm.cdf((40-E)/D))
x=[3,50,-1,4,2,5]; print("+50", np.mean(x), np.std(x,ddof=1), ttest_rel(x,[0]*6), wexact(x))
x=[3,5,-1,4,2,-50]; print("-50", np.mean(x), ttest_rel(x,[0]*6).pvalue, wexact(x), 2*wexact(x)[2])
print("-4.5", wexact([3,5,-4.5,4,2,5]))
print("=== 9.6")
def U(a,b):
    r=rankdata(list(a)+list(b)); R=r[:len(a)].sum(); return R, R-len(a)*(len(a)+1)/2
print("hat diak", U([7,9,11],[3,5,4]), mannwhitneyu([7,9,11],[3,5,4],method='exact'))
print("3+4", U([22,25,30],[10,12,14,18]), 2/35)
print("par", U([5,8,9],[1,2,4,6]))
print("4+4", U([12,15,18,20],[10,11,14,16]))
c=sum(1 for s in itertools.combinations(range(1,9),4) if sum(s)>=24); print("R>=24", c, c/70)
n1,n2=20,25; E=n1*n2/2; D=sqrt(n1*n2*(n1+n2+1)/12); z=(320-E)/D; print("20,25", E, D*D, D, z, 2*norm.sf(z))
A=[72,75,78,80,81,83,85,90]; B=[65,68,70,72,74,76,79,82]
print("8+8", U(A,B), sqrt(64*17/12), (52.5-32)/sqrt(64*17/12), 2*norm.sf((52.5-32)/sqrt(64*17/12)), mannwhitneyu(A,B), mannwhitneyu(A,B,use_continuity=False))
print(" t", ttest_ind(A,B).pvalue, "theta", 52.5/64)
r=rankdata(A+B); al=r[:8]; 
cnt=0; tot=0
for s in itertools.combinations(range(16),8):
    tot+=1; cnt+= abs(r[list(s)].sum()-68) >= abs(al.sum()-68)-1e-9
print(" perm rang", cnt/tot)
print("kotes", U([5,7,7,10],[3,7,8]), "E,D 10", 50, sqrt(175))
A2=A[:-1]+[150]; print("150", np.mean(A2), np.std(A2,ddof=1), ttest_ind(A2,B), ttest_ind(A2,B,equal_var=False).pvalue, U(A2,B), mannwhitneyu(A2,B).pvalue)
B2=B[:-1]+[20]; print("20", ttest_ind(A,B2), U(A,B2), mannwhitneyu(A,B2).pvalue, rankdata(A+B)[15], )
print("KW", kruskal([7,9,11],[3,5,4],[6,8,10]), 12/90*(441+36+324)/3-30, chi2.sf(5.6,2))
print("65->0", U(A,[0]+B[1:])[1], "72->60", U([60]+A[1:],B))
print("=== 9.7")
x=np.array([.08,.21,.43,.52,.95]); n=5; i=np.arange(1,6); print("5 szam", i/n-x, x-(i-1)/n, kstest(x,'uniform'))
z=norm.cdf((np.array([488,497,499,500])-500)/10); i=np.arange(1,5); print("zacsko", z, i/4-z, z-(i-1)/4, kstest([488,497,499,500],norm(500,10).cdf))
print("3 szam", kstest([.1,.2,.3],'uniform'))
from scipy.stats import kstwo
for n in [4,5,10,20,25,50]: print(" krit", n, kstwo.ppf(.95,n))
print("100 D=.15", kstwo.sf(.15,100), "25,.2", kstwo.sf(.2,25), "20,.31", kstwo.sf(.31,20), "50,.21", kstwo.sf(.21,50), "400", 1.36/20)
print("2 minta", ks_2samp(A,B), ks_2samp(A,B,method='exact'))
from scipy.stats import ks_2samp as k2
# P(D>=0.625) 8+8
print(" D>=.625:", k2([0,1,2,3,4,5,6,7],[0.5+i for i in range(8)]).pvalue)
print("50,50", 1.36*sqrt(100/2500))
print("=== 9.8")
P=np.array([log10(1+1/d) for d in range(1,10)]); print("benford %", np.round(100*P,1))
f=np.array([30,28,24,22,22,20,19,18,17]); e=200*P; print("szamlak", f.sum(), np.round(e,1), ((f-e)**2/e).round(2), ((f-e)**2/e).sum(), chi2.sf(((f-e)**2/e).sum(),8))
f=np.array([301,176,125,97,79,69,56,52,45]); print("2^k", f.sum(), ((f-1000*P)**2/(1000*P)).sum())
from collections import Counter
c=Counter(int(str(2**k)[0]) for k in range(1,1001)); print(" valodi", [c[d] for d in range(1,10)])
print("Mendel", ((5474-5493)**2/5493+(1850-1831)**2/1831), 7324*.75, chi2.sf(0.263,1), chi2.cdf(41.6,84))
print("webshop", chi2_contingency([[40,960],[52,948],[61,939]])[:2])
print("benford 300", 300*P[0], "mellekhatas", fisher_exact([[3,9],[0,12]]), "20 kis", chi2.cdf(4,20))
print("veg: reklam", sum((np.array([25,18,20,15,22])-20)**2/20), chi2.sf(2.9,4))
t=chi2_contingency([[18,42],[30,30]],correction=False); print("sport", t[0], t[1], sqrt(t[0]/120))
print("kave", binom.sf(8,10,.5), "6/0 fisher", fisher_exact([[5,1],[0,6]]), fisher_exact([[5,1],[0,6]],alternative='greater'))
print("ks50", kstwo.sf(.21,50))
print("szazalek", chi2_contingency([[30,70],[20,80]],correction=False)[0], chi2_contingency([[60,140],[40,160]],correction=False)[:2])
print("--- 9.7 kiegeszito")
import itertools
from collections import Counter
cnt=Counter()
for s in itertools.combinations(range(16),8):
    lab=np.zeros(16); lab[list(s)]=1
    ca=np.cumsum(lab)/8; cb=np.cumsum(1-lab)/8
    cnt[round(np.max(np.abs(ca-cb))*8)]+=1
tot=sum(cnt.values())
for k in sorted(cnt): print(" D=",k/8, "P(D>=)", sum(v for kk,v in cnt.items() if kk>=k)/tot)
rng=np.random.default_rng(1); rej=0; M=200000
X=rng.standard_normal((M,20)); m=X.mean(1,keepdims=True); s=X.std(1,ddof=1,keepdims=True)
Z=np.sort(norm.cdf((X-m)/s),axis=1); i=np.arange(1,21)
D=np.maximum((i/20-Z).max(1),(Z-(i-1)/20).max(1))
print("Lilliefors n=20: tenyleges alfa 0.294-gyel", (D>=0.294).mean(), "helyes krit", np.quantile(D,.95))
