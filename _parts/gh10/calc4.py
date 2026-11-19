from common import *
from scipy import stats
R=np.random.default_rng(3)
# naive vs QAP type I error with node effects
def sim(n=20, rho=1.0, reps=400, perms=200):
    nr=0; nq=0
    for _ in range(reps):
        u=R.normal(size=n); v=R.normal(size=n)
        X=rho*(u[:,None]+u[None,:])+R.normal(size=(n,n)); X=(X+X.T)/2
        Y=rho*(v[:,None]+v[None,:])+R.normal(size=(n,n)); Y=(Y+Y.T)/2
        a,b=offdiag(X),offdiag(Y); r,p=stats.pearsonr(a,b); nr+=p<0.05
        c=0
        for _ in range(perms):
            P=R.permutation(n); c+=abs(np.corrcoef(a,offdiag(Y[np.ix_(P,P)]))[0,1])>=abs(r)-1e-12
        nq+=(c+1)/(perms+1)<0.05
    return nr/reps, nq/reps
for rho in [0,0.5,1,2]: print("rho",rho, sim(rho=rho))
