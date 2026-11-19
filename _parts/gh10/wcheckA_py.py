from common import *
from scipy import stats
import itertools
R=np.random.default_rng(5)
B=lambda M:(M>0).astype(float)
P4={p:comat(paper(p)) for p in ["RH","EK","NY","VN"]}
print("Jaccard 4x4")
for a in P4:
    row=[]
    for b in P4:
        x,y=offdiag(P4[a]),offdiag(P4[b]); both=((x>0)&(y>0)).sum(); any_=((x>0)|(y>0)).sum()
        row.append(f"{both}/{any_}={both/any_:.3f} Jw={np.minimum(x,y).sum()/np.maximum(x,y).sum():.3f}")
    print(a,row)
F,S=comat(FIRST),comat(SECOND); ALL=comat(ART)
x,y=offdiag(F),offdiag(S); print("halves",((x>0)&(y>0)).sum(),((x>0)|(y>0)).sum(),np.minimum(x,y).sum()/np.maximum(x,y).sum())
for nm,src in [("all vs VN",P4["VN"]),("all vs RH",P4["RH"])]:
    x,y=offdiag(ALL),offdiag(src); print(nm,((x>0)&(y>0)).sum(),((x>0)|(y>0)).sum(),np.minimum(x,y).sum()/np.maximum(x,y).sum())
def qrow(A,Bm,directed,perms=None):
    n=len(A); a=offdiag(A,directed); out=[]
    it=itertools.permutations(range(n)) if perms is None else (R.permutation(n) for _ in range(perms))
    for p in it:
        p=list(p); out.append(np.corrcoef(a,offdiag(Bm[p,:],directed))[0,1] if offdiag(Bm[p,:],directed).std()>0 else 0)
    return np.array(out)
ids4=["Po","Vi","La","Ön"]
V4,N4=B(comat(paper("VN"),ids4)),B(comat(paper("NY"),ids4))
r,rs=qap_exact(V4,N4); print("(a) r",r,"p",(rs>=r-1e-12).mean(),"vals",np.unique(rs.round(4),return_counts=True))
rr=qrow(V4,N4,False); print("(a) rows-only mean/sd",np.nanmean(rr),np.nanstd(rr),"p",(rr>=r-1e-12).mean())
V7,N7=B(P4["VN"]),B(P4["NY"])
r,rs=qap_exact(V7,N7); print("(b) r",r,"p",(rs>=r-1e-12).mean(),"pabs",(abs(rs)>=abs(r)-1e-12).mean(),"naive",stats.pearsonr(offdiag(V7),offdiag(N7))[1],np.unique(rs.round(4),return_counts=True), "sd",rs.std())
rr=qrow(V7,N7,False); print("(b) rows-only sd",np.nanstd(rr),"p",(rr>=r-1e-12).mean())
for nm,(A_,B_) in {"c bin":(B(F),B(S)),"c w":(F,S)}.items():
    r,rs=qap_exact(A_,B_); print(nm,"r",r,"p",(rs>=r-1e-12).mean(),"pabs",(abs(rs)>=abs(r)-1e-12).mean(),"naive",stats.pearsonr(offdiag(A_),offdiag(B_))[1],"sd",rs.std())
    rr=qrow(A_,B_,False); print(nm,"rows-only sd",np.nanstd(rr),"p",(rr>=r-1e-12).mean())
K,att=krack()
for nm,X in [("d fr",K["friendship"]),("e rep",K["reports"])]:
    a,b=offdiag(K["advice"],True),offdiag(X,True); r=np.corrcoef(a,b)[0,1]
    rs=np.array([np.corrcoef(a,offdiag(X[np.ix_(P,P)],True))[0,1] for P in (R.permutation(21) for _ in range(5000))])
    rr=qrow(K["advice"],X,True,5000)
    print(nm,"r",r,"naive",stats.pearsonr(a,b)[1],"p1",(rs>=r-1e-12).mean(),"p2",(abs(rs)>=abs(r)-1e-12).mean(),"mean",rs.mean(),"sd",rs.std(),"| rows sd",rr.std(),"p",(rr>=r-1e-12).mean())
