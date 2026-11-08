# 6.1-6.4 szövegének számellenőrzése
import itertools, math, statistics as st
from scipy import stats
import numpy as np
pop=[2,4,6,8,10]
for n in (2,3):
    S=list(itertools.product(pop,repeat=n))
    s2=[st.variance(x) for x in S]; sn=[st.pvariance(x) for x in S]
    print(n,"E s2",np.mean(s2),"E sn",np.mean(sn),"Var s2",np.var(s2),"Var sn",np.var(sn),"MSE sn",np.var(sn)+(np.mean(sn)-8)**2, "E s",np.mean(np.sqrt(s2)))
S=list(itertools.product(pop,repeat=3))
for name,f in [("mean",np.mean),("med",np.median),("x1",lambda x:x[0]),("mid",lambda x:(min(x)+max(x))/2)]:
    v=[f(x) for x in S]; print(name,np.mean(v),np.var(v))
for p in (.5,.6,.7,.8,.9): print(p,p**7*(1-p)**3)
print([sum((x-c)**2 for x in (3,5,10)) for c in (4,5,6,7)])
print("L .6 .5",.6**3*.4**2,.5**5)
x=[401,392,387,400,408,390,415,383,395,406,418,420,381,395,379]
m=np.mean(x); ss=sum((a-m)**2 for a in x); s=math.sqrt(ss/14); se=10/math.sqrt(15)
print(sum(x),m,ss,s,se,1.96*se,1.645*se,2.576*se, 1.96*10/math.sqrt(60),1.96*20/math.sqrt(15))
print("t",2.145*s/math.sqrt(15), m-2.145*s/math.sqrt(15), stats.t.ppf(.975,14), 1.761*s/math.sqrt(15),2.977*s/math.sqrt(15))
# új átlag a KI-ben: Xnew - Xbar ~ N(0, sqrt2 SE), |.|<1.96SE
print("uj atlag", 2*stats.norm.cdf(1.96/math.sqrt(2))-1)
print(1.96*6/6, 2.576*2, 1.96*2, 2.262*4/math.sqrt(10), np.std([10,12,14,16],ddof=1), 3.182*np.std([10,12,14,16],ddof=1)/2, 1.984*1.5, 4*5/2.064, 2.576/1.96)
def wald(k,n,z=1.96):
    p=k/n; d=z*math.sqrt(p*(1-p)/n); return p-d,p+d,d
def wilson(k,n,z=1.96):
    p=k/n; c=(p+z*z/(2*n))/(1+z*z/n); h=z/(1+z*z/n)*math.sqrt(p*(1-p)/n+z*z/(4*n*n)); return c-h,c+h
print("zold",wald(310,1000),wald(310,1000,1.645),wilson(310,1000))
print("radio",wald(176,800,2.17),stats.norm.ppf(.985))
p=.22;print("NGA n-1",2.17*math.sqrt(p*(1-p)/799)-2.17*math.sqrt(p*(1-p)/800))
print(wald(7,10),wilson(7,10),wald(9,14),wilson(0,20),wald(1,20),wilson(1,20))
print(wald(100,400),wald(500,1000),wald(1000,2500,2.576))
def cov(n,p,f):
    return sum(stats.binom.pmf(k,n,p) for k in range(n+1) if f(k,n)[0]<=p<=f(k,n)[1])
print("cov",cov(20,.1,wald),cov(20,.1,wilson))
