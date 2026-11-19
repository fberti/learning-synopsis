from common import *
import math
from scipy import stats
A,att=krack(); adv,fr,rep=A["advice"],A["friendship"],A["reports"]
R=np.random.default_rng(11); n=21
for name,B in [("fr",fr),("rep",rep)]:
    a=offdiag(adv,True); r0=np.corrcoef(a,offdiag(B,True))[0,1]; rs=[]
    for _ in range(20000):
        P=R.permutation(n); rs.append(np.corrcoef(a,offdiag(B[np.ix_(P,P)],True))[0,1])
    rs=np.array(rs); k=np.sum(rs>=r0-1e-12); ka=np.sum(np.abs(rs)>=abs(r0)-1e-12)
    print(name,"r %.4f"%r0,"k",k,"p1 %.4f"%(k/len(rs)),"p2 %.4f"%(ka/len(rs)),"mean %.4f sd %.4f max %.4f min %.4f"%(rs.mean(),rs.std(),rs.max(),rs.min()), "naive", stats.pearsonr(a,offdiag(B,True))[1])
print("21!", math.factorial(21), "7!",math.factorial(7))
print("SE p=.02 n=5000", math.sqrt(.02*.98/5000), "n=1000",math.sqrt(.02*.98/1000))
# wrong permutation: rows only for VN-NY 7 nodes
V=(comat(paper("VN"))>0).astype(float); Y=(comat(paper("NY"))>0).astype(float)
r0=corr(V,Y); rs=[]
for p in itertools.permutations(range(7)):
    P=list(p); rs.append(corr(V,Y[P,:]))  # rows only, offdiag upper of non-symmetric
rs=np.array(rs); print("rows-only p", np.mean(rs>=r0-1e-12), "sd %.3f vs qap"%rs.std())
# Krack rows-only
a=offdiag(adv,True); r0=np.corrcoef(a,offdiag(fr,True))[0,1]; rs=[]
for _ in range(5000):
    P=R.permutation(n); rs.append(np.corrcoef(a,offdiag(fr[P,:],True))[0,1])
rs=np.array(rs); print("krack rows-only p %.4f sd %.4f"%(np.mean(rs>=r0),rs.std()))
# cell-wise shuffle (permute cells independently) - like naive
rs=[]
for _ in range(5000):
    rs.append(np.corrcoef(a,R.permutation(offdiag(fr,True)))[0,1])
rs=np.array(rs); print("cell shuffle p %.4f sd %.4f"%(np.mean(rs>=r0),rs.std()))
# halves exact detail
F,S=comat(FIRST)>0,comat(SECOND)>0
r0,rs=qap_exact(F.astype(float),S.astype(float)); print("halves values", np.unique(np.round(rs,4),return_counts=True), "p", np.mean(rs>=r0-1e-12))
