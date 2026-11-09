import numpy as np
from scipy import stats as st
rng=np.random.default_rng(1)
R=40000
def sim_welch(n1,s1,n2,s2):
    x=rng.normal(0,s1,(R,n1)); y=rng.normal(0,s2,(R,n2))
    p=st.ttest_ind(x,y,axis=1).pvalue; w=st.ttest_ind(x,y,axis=1,equal_var=False).pvalue
    return (p<.05).mean(),(w<.05).mean()
for c in [(5,10,20,3),(20,10,5,3),(10,1,10,1),(10,3,10,1),(5,1,20,1)]:
    print("welch",c,sim_welch(*c))
def sim_f(n1,n2,dist):
    if dist=="normal": x=rng.normal(size=(R,n1)); y=rng.normal(size=(R,n2))
    elif dist=="t5": x=rng.standard_t(5,(R,n1)); y=rng.standard_t(5,(R,n2))
    elif dist=="exp": x=rng.exponential(size=(R,n1)); y=rng.exponential(size=(R,n2))
    elif dist=="unif": x=rng.uniform(size=(R,n1)); y=rng.uniform(size=(R,n2))
    F=x.var(axis=1,ddof=1)/y.var(axis=1,ddof=1)
    p=2*np.minimum(st.f.cdf(F,n1-1,n2-1),st.f.sf(F,n1-1,n2-1))
    return (p<.05).mean()
for d in ["normal","t5","exp","unif"]:
    print("F",d,[sim_f(n,n,d) for n in (10,25,100)])
# peeking
def peek(p=0.1,step=100,maxn=2000,R=20000):
    hits=0; hits_end=0
    for r in range(R):
        a=rng.random(maxn)<p; b=rng.random(maxn)<p
        ca=np.cumsum(a)[step-1::step]; cb=np.cumsum(b)[step-1::step]; n=np.arange(step,maxn+1,step)
        pp=(ca+cb)/(2*n); se=np.sqrt(pp*(1-pp)*2/n); 
        with np.errstate(divide='ignore',invalid='ignore'): z=(cb-ca)/n/se
        z=np.nan_to_num(z)
        sig=np.abs(z)>1.959964
        hits+=sig.any(); hits_end+=sig[-1]
    return hits/R,hits_end/R
print("peek",peek())
