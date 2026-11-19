from common import *
from scipy import stats
V=comat(paper("VN"))>0; Y=comat(paper("NY"))>0
r0,rs=qap_exact(V.astype(float),Y.astype(float)); print("VN-NY 7 nodes bin r %.4f p %.4f"%(r0,np.mean(rs>=r0-1e-12)), np.unique(np.round(rs,4),return_counts=True))
a,b=offdiag(V.astype(float)),offdiag(Y.astype(float)); print("naive",stats.pearsonr(a,b))
A,att=krack(); print(att)
for k,M in A.items(): print(k, int(M.sum()), "density %.4f"%(M.sum()/420))
adv,fr,rep=A["advice"],A["friendship"],A["reports"]
R=np.random.default_rng(1)
def qap_mc(X,Yv,runs=5000,directed=True):
    r0=corr(X,Yv,directed); n=len(X); c=0; rs=[]
    for _ in range(runs):
        P=R.permutation(n); r=corr(X,Yv[np.ix_(P,P)],directed); rs.append(r)
    rs=np.array(rs); return r0, np.mean(rs>=r0-1e-12), rs.mean(), rs.std(), rs.max()
print("adv~fr", qap_mc(adv,fr)); print("adv~rep",qap_mc(adv,rep)); print("fr~rep",qap_mc(fr,rep))
print("naive adv fr", stats.pearsonr(offdiag(adv,True),offdiag(fr,True)))
dept=att["DEPT"].values; same=(dept[:,None]==dept[None,:]).astype(float); np.fill_diagonal(same,0)
print("adv~samedept",qap_mc(adv,same)); print("fr~samedept",qap_mc(fr,same))
lev=att["LEVEL"].values; print("dept",dept, "level",lev)
# symmetric reciprocated? 
print("advice reciprocity", (adv*adv.T).sum()/adv.sum(), "fr recip", (fr*fr.T).sum()/fr.sum())
# karate faction
d=loadjs("mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","KARATE13"); print(d.keys())
