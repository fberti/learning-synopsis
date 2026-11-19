from common import *
def edges(M,nodes=ACT):
    n=len(M); return {(nodes[i],nodes[j]):M[i,j] for i in range(n) for j in range(i+1,n) if M[i,j]>0}
P={p:comat(paper(p)) for p in ["RH","EK","NY","VN"]}
for p,M in P.items(): print(p, edges(M))
def jac(A,B):
    a=set(edges(A)); b=set(edges(B)); return len(a&b),len(a|b), len(a&b)/len(a|b) if a|b else 0
def wjac(A,B):
    a,b=offdiag(A),offdiag(B); return np.minimum(a,b).sum(), np.maximum(a,b).sum()
for x,y in itertools.combinations(P,2): print(x,y,jac(P[x],P[y]), wjac(P[x],P[y]), "r=%.4f"%corr(P[x],P[y]))
F,S=comat(FIRST),comat(SECOND); print("first",edges(F)); print("second",edges(S))
print("halves jac",jac(F,S),"wjac",wjac(F,S),"r=%.4f"%corr(F,S), "r_bin=%.4f"%corr(F>0,S>0))
# 4-node VN vs NY
N4=["Po","Vi","La","Ön"]
V4=comat(paper("VN"),N4); Y4=comat(paper("NY"),N4); print(V4); print(Y4)
for lab,(A,B) in {"bin":(V4>0,Y4>0),"wt":(V4,Y4)}.items():
    r0,rs=qap_exact(A.astype(float),B.astype(float)); print(lab,"r0=%.4f"%r0, "p>=",np.mean(rs>=r0-1e-12), sorted(set(np.round(rs,4))), [int(np.sum(np.isclose(rs,v))) for v in sorted(set(np.round(rs,4)))])
for lab,(A,B) in {"bin":(F>0,S>0),"wt":(F,S)}.items():
    r0,rs=qap_exact(A.astype(float),B.astype(float)); print("halves",lab,"r0=%.4f"%r0,"p>=%.4f"%np.mean(rs>=r0-1e-12), "mean %.4f sd %.4f"%(rs.mean(),rs.std()))
# naive t-test
from scipy import stats
for lab,(A,B) in {"halves bin":(F>0,S>0),"halves wt":(F,S),"VN-NY bin":(V4>0,Y4>0)}.items():
    a,b=offdiag(A.astype(float)),offdiag(B.astype(float)); r,p=stats.pearsonr(a,b); print(lab,"naive r %.4f p %.4f n %d"%(r,p,len(a)))
