from common import *
from scipy import stats
A,att=krack(); adv,fr,rep=A["advice"],A["friendship"],A["reports"]
dept=att["DEPT"].values.astype(int); same=(dept[:,None]==dept[None,:]).astype(float); np.fill_diagonal(same,0)
n=21; R=np.random.default_rng(7)
def vec(M): return offdiag(M,True)
def ols(y,Xs):
    X=np.column_stack([np.ones(len(y))]+Xs); b,*_=np.linalg.lstsq(X,y,rcond=None)
    res=y-X@b; s2=res@res/(len(y)-X.shape[1]); cov=s2*np.linalg.inv(X.T@X); t=b/np.sqrt(np.diag(cov))
    r2=1-res@res/((y-y.mean())@(y-y.mean())); return b,t,r2
def perm(M,P): return M[np.ix_(P,P)]
def mrqap(Y,Xs,runs=2000):
    y=vec(Y); xs=[vec(X) for X in Xs]; b,t,r2=ols(y,xs)
    out={"b":b,"t":t,"r2":r2,"naive_p":2*stats.t.sf(np.abs(t),len(y)-len(xs)-1)}
    # Y-permutation
    cy=np.zeros(len(xs)+1)
    for _ in range(runs):
        P=R.permutation(n); _,tp,_=ols(vec(perm(Y,P)),xs); cy+=np.abs(tp)>=np.abs(t)-1e-12
    out["yperm_p"]=cy/runs
    # DSP: for each k regress X_k on others, permute residual matrix
    pd=[]
    for k in range(len(xs)):
        others=[xs[j] for j in range(len(xs)) if j!=k]
        Xo=np.column_stack([np.ones(len(y))]+others); bb,*_=np.linalg.lstsq(Xo,xs[k],rcond=None); e=xs[k]-Xo@bb
        E=np.zeros((n,n)); idx=[(i,j) for i in range(n) for j in range(n) if i!=j]
        for v,(i,j) in zip(e,idx): E[i,j]=v
        c=0
        for _ in range(runs):
            P=R.permutation(n); ep=vec(perm(E,P)); xs2=list(xs); xs2[k]=ep  # replace X_k by permuted residual, keep others
            _,tp,_=ols(y,[ep]+others); c+=abs(tp[1])>=abs(t[k+1])-1e-12
        pd.append(c/runs)
    out["dsp_p"]=pd; return out
np.set_printoptions(precision=4,suppress=True)
for name,Xs in {"fr":[fr],"rep":[rep],"fr+rep":[fr,rep],"fr+rep+same":[fr,rep,same]}.items():
    o=mrqap(adv,Xs); print(name,{k:np.round(v,4) for k,v in o.items()})
# simple QAP correlation significance for single regressors already
