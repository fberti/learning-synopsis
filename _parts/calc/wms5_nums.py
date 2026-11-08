import itertools, numpy as np
from scipy import stats as st
r=lambda x,d=3: round(float(x),d)
print("galton sd", r(np.sqrt(10)/2), r(np.sqrt(20)/2))
for p,n in [(.4,1000),(.4,400),(.4,2500),(.5,1000),(.4,50),(.02,50)]:
    se=np.sqrt(p*(1-p)/n); print("poll",p,n,"SE pp",r(100*se,2),"2SE",r(200*se,2),"np",n*p,"n(1-p)",n*(1-p))
for df in [4,9,29,1,60]: print("t",df,r(2*st.t.sf(2,df)),r(st.t.ppf(.975,df)))
print("z",r(2*st.norm.sf(2),4),r(st.norm.ppf(.975)))
print("dist", r(st.norm.ppf(.975)), r(st.norm.cdf(-2.5),4), r(st.t.ppf(.975,9)), r(st.chi2.ppf(.95,9)), r(st.chi2.ppf(.05,9)),
      r(st.chi2.ppf(.025,9)), r(st.chi2.ppf(.975,9)), r(st.chi2.sf(13.5,9),4), r(st.f.ppf(.95,5,10)), r(st.norm.cdf(495,500,2),4),
      r(st.f.ppf(.95,1,1)), r(st.chi2.ppf(.5,1)))
c=st.chi2.cdf(13.5,9); print("chi two-sided 13.5: other", r(st.chi2.ppf(1-c,9)), "central", r(1-2*(1-c),4), "tails", r(2*(1-c),4))
x=np.array([12,15,17,18,20,22,23,25,28,34,45,61.]); n=len(x); s=x.std(ddof=1)
print("boot12 mean",r(x.mean(),2),"median",np.median(x),"s",r(s,2),"s/sqrt n",r(s/np.sqrt(n),2),"bootSE theory",r(np.sqrt((n-1)/n)*s/np.sqrt(n),3))
rng=np.random.default_rng(1); B=rng.choice(x,(200000,n)); print(" sim bootSE mean",r(B.mean(1).std(),3),"median",r(np.median(B,1).std(),2),"sd",r(B.std(1,ddof=1).std(),2))
y=np.array([2,4,9.]); R=np.array(list(itertools.product(y,repeat=3)))
print("small mean SE",r(R.mean(1).std(),3),"s/sqrt3",r(y.std(ddof=1)/np.sqrt(3),3))
med=np.median(R,1); print("small median dist",{v:int((med==v).sum()) for v in np.unique(med)},"SE",r(med.std(),3))
for sT,sL in [(10,10),(10,0),(0,10),(10,20)]: print("rho",sT,sL, sT**2/(sT**2+sL**2))
