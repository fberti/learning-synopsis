import numpy as np, itertools as it
from scipy import stats as st
from math import comb
def gof(o,e,ddof=0):
    o=np.array(o,float); e=np.array(e,float); x=((o-e)**2/e).sum(); df=len(o)-1-ddof
    return round(x,4), df, round(st.chi2.sf(x,df),4)
print("coin 60/100", gof([60,40],[50,50]))
print("die60", gof([8,9,12,11,6,14],[10]*6))
print("OB die1400", gof([228,240,224,237,235,236],[1400/6]*6))
print("juror", gof([205,26,25,19],[198,19.25,33,24.75]))
for df in (1,2,3,4,5,6,8,9,10): print("crit",df, round(st.chi2.ppf(.95,df),3), round(st.chi2.ppf(.99,df),3))
# horse kicks
k=np.array([0,1,2,3,4]); f=np.array([109,65,22,3,1]); n=f.sum(); lam=(k*f).sum()/n
p=st.poisson.pmf(k,lam); p[-1]=1-p[:-1].sum(); E=n*p
print("horse lam",lam, np.round(E,2))
o2=[109,65,22+3+1]; e2=[E[0],E[1],E[2:].sum()]; print("horse merged 2+",np.round(e2,2), gof(o2,e2,1))
o3=[109,65,22,4]; e3=[E[0],E[1],E[2],E[3:].sum()]; print("horse merged 3+",np.round(e3,2), gof(o3,e3,1), "wrong df", gof(o3,e3,0))
# Mendel
print("mendel", gof([5474,1850],[7324*.75,7324*.25]), "left", st.chi2.cdf(gof([5474,1850],[7324*.75,7324*.25])[0],1))
print("fisher aggregate p left", st.chi2.cdf(41.6,84))
# homogeneity
def ct(t,corr=False):
    r=st.chi2_contingency(np.array(t),correction=corr); return round(r[0],4), r[2], round(r[1],4), np.round(r[3],2)
print("AB 20/200 34/200", ct([[20,180],[34,166]]))
print("gep", ct([[60,30,10],[45,40,15]]))
print("dohanyzas", ct([[30,70],[20,80]]), "yates", ct([[30,70],[20,80]],True)[0:3])
print("dupla", ct([[60,140],[40,160]]))
print("ceg", ct([[18,2],[5,25]]))
