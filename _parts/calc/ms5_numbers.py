import itertools, math, statistics as st
from fractions import Fraction as F
from scipy import stats
import numpy as np
pop=[2,4,6,8,10]; mu=st.mean(pop); s2=st.pvariance(pop); print("mu",mu,"sigma2",s2,"sigma",math.sqrt(s2))
def dist(vals):
    from collections import Counter
    c=Counter(vals); n=len(vals); return sorted((k,F(v,n)) for k,v in c.items())
wo=[F(a+b,2) for a,b in itertools.combinations(pop,2)]; print("wo n2", dist(wo), "E",sum(wo)/len(wo),"Var",sum((x-6)**2 for x in wo)/len(wo))
wr=[F(a+b,2) for a,b in itertools.product(pop,repeat=2)]; print("wr n2", dist(wr), "Var",sum((x-6)**2 for x in wr)/len(wr))
print("P(|xbar-6|<=1) wo", sum(1 for x in wo if abs(x-6)<=1)/10, "wr", F(sum(1 for x in wr if abs(x-6)<=1),25))
mx=[max(a,b) for a,b in itertools.combinations(pop,2)]; print("max wo",dist(mx),"E",F(sum(mx),10))
mxr=[max(a,b) for a,b in itertools.product(pop,repeat=2)]; print("max wr",dist(mxr),"E",F(sum(mxr),25))
s2r=[F((a-b)**2,2) for a,b in itertools.product(pop,repeat=2)]; print("s2 wr E",sum(s2r)/25, dist(s2r))
s2o=[F((a-b)**2,2) for a,b in itertools.combinations(pop,2)]; print("s2 wo E",sum(s2o)/10)
rg=[abs(a-b) for a,b in itertools.product(pop,repeat=2)]; print("range wr", dist(rg), F(sum(rg),25))
# n=3 wo
w3=[F(sum(c),3) for c in itertools.combinations(pop,3)]; print("wo n3",dist(w3),"Var",sum((x-6)**2 for x in w3)/10, "fpc", F(8,3)*F(2,4))
w3r=[F(sum(c),3) for c in itertools.product(pop,repeat=3)]; print("wr n3 Var",sum((x-6)**2 for x in w3r)/125)
# 5.2
print("IQ SE", 15/5, 15/10); 
print("FPC N500 n100 s10", 10/10*math.sqrt(400/499))
x=[3,5,7,9]; print("s",st.stdev(x),"SE",st.stdev(x)/2)
# dice
sd=math.sqrt(35/12); print("dice sd",sd)
for n in [1,2,5,30]: print(" n",n,"SE",sd/math.sqrt(n))
# exact P(mean>=4) n=30
p=np.array([1.0]); d=np.ones(6)/6
for _ in range(30): p=np.convolve(p,d)
# index k -> sum = k+30
print("exact P(sum>=120)",p[120-30:].sum(), "CLT nocc", 1-stats.norm.cdf(0.5/(sd/math.sqrt(30))), "cc", 1-stats.norm.cdf((119.5-105)/(sd*math.sqrt(30))))
# dice two: distribution of mean n=2
p2=np.convolve(d,d); print("n2", [round(v*36) for v in p2])
# fill
print("fill one",stats.norm.cdf(-0.5),"mean25",stats.norm.cdf(-2.5))
print("fill n=4", stats.norm.cdf(-5/(10/2)), "n=100", stats.norm.cdf(-5))
# exponential
n=30; print("exp P(xbar>120) CLT", 1-stats.norm.cdf(20/(100/math.sqrt(30))), "exact", stats.gamma.sf(120, a=30, scale=100/30))
for n in [1,5,30,100]: print(" exp skew", n, 2/math.sqrt(n), "P(xbar>120) exact",stats.gamma.sf(120,a=n,scale=100/n),"clt",1-stats.norm.cdf(20/(100/math.sqrt(n))))
# p-hat
for k in range(4): print("phat",k, math.comb(3,k)*0.4**k*0.6**(3-k))
se=math.sqrt(.24/1000); print("poll SE",se, "2SE",2*se,"1.96SE",1.96*se, "P(>=.43)",1-stats.norm.cdf(.03/se), "P(<=.37)",stats.norm.cdf(-.03/se))
print("n for SE 1pp p=.5", .25/0.01**2, "n for 1.96SE<=3pp", (1.96/0.03)**2*.25)
print("p=.5 n=1000 SE",math.sqrt(.25/1000), "p=.1",math.sqrt(.09/1000))
print("exact binom P(phat>=.43) n1000 p.4", stats.binom.sf(429,1000,.4))
print("n=400 SE p=.4", math.sqrt(.24/400))
# chi2
print("P(Z^2<1)",stats.chi2.cdf(1,1),"P(Z^2<3.84)",stats.chi2.cdf(3.8415,1))
print("chi2_9 P(>13.5)",stats.chi2.sf(13.5,9),"q95",stats.chi2.ppf(.95,9),"q05",stats.chi2.ppf(.05,9),"q025",stats.chi2.ppf(.025,9),"q975",stats.chi2.ppf(.975,9))
for df in [1,4,9,29,100]: print(" t975",df,stats.t.ppf(.975,df))
print("z975",stats.norm.ppf(.975))
for df in [4,9,29]: print(" P(|T|>2)",df,2*stats.t.sf(2,df))
print("P(|Z|>2)",2*stats.norm.sf(2))
print("F 5,10 q95",stats.f.ppf(.95,5,10),"F 10,5 q95",stats.f.ppf(.95,10,5))
# bootstrap
smp=[2,4,9]; bs=[F(sum(c),3) for c in itertools.product(smp,repeat=3)]; m=sum(bs)/27
v=sum((b-m)**2 for b in bs)/27; print("boot mean dist",dist(bs),"E",m,"Var",v,float(v),"SE",math.sqrt(v))
print("s",st.stdev(smp),"s/sqrt3",st.stdev(smp)/math.sqrt(3),"pvar",st.pvariance(smp))
bm=[st.median(c) for c in itertools.product(smp,repeat=3)]; print("boot median dist",dist(bm), "E",F(sum(bm),27), "SD", st.pstdev(bm))
# regression to the mean enumeration
rows=[]
for S,L1,L2 in itertools.product([0,1],repeat=3): rows.append((S+L1,S+L2))
for xv in [0,1,2]:
    ys=[y for x,y in rows if x==xv]; print("X",xv,"E(Y|X)",F(sum(ys),len(ys)),len(ys))
print("r", np.corrcoef([r[0] for r in rows],[r[1] for r in rows])[0,1])
