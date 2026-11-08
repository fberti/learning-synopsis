from scipy import stats as s; import math, itertools as it
from math import comb
print("tea", [comb(4,k)*comb(4,4-k) for k in range(5)], 1/70, 17/70)
B=s.binom
print("coin P(X>=60)",B.sf(59,100,.5),"two",2*B.sf(59,100,.5),"P>=61",B.sf(60,100,.5),"P<=39+>=61",2*B.sf(60,100,.5),"P>=58", B.sf(57,100,.5))
print("z=2",2*s.norm.sf(2),"cc z=1.9",2*s.norm.sf(1.9), s.norm.sf(2))
# one-sided crit region alpha .05
for c in range(55,64): print(c, B.sf(c-1,100,.5))
# power, two sided region <=39 or >=61
for p in [.55,.6,.65,.7]: print("power",p, B.sf(60,100,p)+B.cdf(39,100,p))
# yoghurt
z=(196-200)/(4/math.sqrt(20)); print("z",z, s.norm.ppf(.985), s.norm.ppf(.97), 2*s.norm.cdf(z), "CI", 196-1.96*4/math.sqrt(20),196+1.96*4/math.sqrt(20), 196-2.17*4/math.sqrt(20))
# konzerv test mu0=400 t
t=(398-400)/(13.2665/math.sqrt(15)); print("konzerv t",t, 2*s.t.cdf(t,14))
print("multi", 1-.95**20, .05/20, 1-(1-.0025)**20, 20*.05)
# permutation small example
a=[7,9,11]; b=[3,5,4]  # new vs old
allv=a+b; obs=sum(a)/3-sum(b)/3; cnt=0; diffs=[]
for idx in it.combinations(range(6),3):
    g=[allv[i] for i in idx]; r=[allv[i] for i in range(6) if i not in idx]; d=sum(g)/3-sum(r)/3; diffs.append(d); cnt+= d>=obs-1e-9
print("perm obs",obs,cnt,cnt/20, sorted(round(d,2) for d in diffs))
# huge n
n=10**6; d=0.1/15*math.sqrt(n); print("IQ z", d, 2*s.norm.sf(d))
n=10**7; z=(0.501-0.5)/math.sqrt(.25/n); print("coin z",z,2*s.norm.sf(z))
# power for z test one-sided: mu0=100 sigma 15, effect 5, n=25 alpha .05
for n_ in [25,50,100]:
    zc=s.norm.ppf(.95); pw=s.norm.sf(zc-5/(15/math.sqrt(n_))); print("power z",n_,pw)
print("d",5/15)
# n for power .8: ((z_a+z_b)/d)^2
print(((s.norm.ppf(.95)+s.norm.ppf(.8))/(1/3))**2)
