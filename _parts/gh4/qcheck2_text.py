import numpy as np, networkx as nx, itertools as it
from fractions import Fraction as F
def lap(A): return np.diag(A.sum(1))-A
def adj(nodes, edges, w=None):
    A=np.zeros((len(nodes),)*2)
    for k,(u,v) in enumerate(edges):
        i,j=nodes.index(u),nodes.index(v); A[i,j]=A[j,i]=(w[k] if w else 1)
    return A
ids=["Ko","Vi","Po","La","Ön","Sz","Kl"]
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
W=[2,2,2,1,2,1,1,3,2,2]
A=adj(ids,E); Aw=adj(ids,E,W)
d=A.sum(1); s=Aw.sum(1)
print("deg",dict(zip(ids,d)),"strength",dict(zip(ids,s)),s.sum())
print("pi",dict(zip(ids,(d/d.sum()).round(3))),"piw",dict(zip(ids,(100*s/s.sum()).round(1))))
P=A/d[:,None]
p=np.zeros(7);p[ids.index("Kl")]=1
for t in range(1,31):
    p=p@P
    if t in(1,2,9,10,29,30): print(t,np.abs(p-d/20).max().round(4))
mu,U=np.linalg.eigh(lap(A)); print("Lspec",mu.round(2)); f=U[:,1]*np.sign(U[ids.index('Po'),1]); print("fiedler",dict(zip(ids,f.round(2))))
lam,V=np.linalg.eigh(A); v=np.abs(V[:,-1]); print("ev",dict(zip(ids,(v/v.max()).round(2))),lam[-1].round(3), 20/7)
print("Aspec",lam.round(3))
# best cuts of every size
best={}
for r in range(1,4):
    for S in it.combinations(range(7),r):
        c=sum(1 for u,v in E if (ids.index(u) in S)!=(ids.index(v) in S))
        best.setdefault(r,[]).append((c,[ids[i] for i in S]))
for r in best: m=min(best[r]); print(r,m[0],[x[1] for x in best[r] if x[0]==m[0]])
x=np.array([1 if i in("Po","La","Ön") else -1 for i in ids]); print("xLx",x@lap(A)@x, "lower bound n mu2/4 (n=7)",7*mu[1]/4)
# removed
E2=[e for e in E if e not in[("Ko","Po"),("Vi","Po")]]; print("Lspec del",np.linalg.eigvalsh(lap(adj(ids,E2))).round(3))
# weighted Laplacian (in case)
print("Lw spec",np.linalg.eigvalsh(lap(Aw)).round(2))
# hetfo
x=np.array([1 if i in("Ko","Vi","Sz") else 0 for i in ids]); print("Ax hetfo",dict(zip(ids,A@x)))
# small graphs
for name,n,e in [("P3",3,[(0,1),(1,2)]),("K3",3,[(0,1),(1,2),(0,2)]),("star",4,[(0,1),(0,2),(0,3)]),("friend",4,[(0,1),(0,2),(1,2),(2,3)]),("P4",4,[(0,1),(1,2),(2,3)]),
 ("tri+bridge",6,[(0,1),(0,2),(1,2),(2,3),(3,4),(3,5),(4,5)]),("tri nobridge",6,[(0,1),(0,2),(1,2),(3,4),(3,5),(4,5)]),("C4",4,[(0,1),(1,2),(2,3),(3,0)]),("C5",5,[(i,(i+1)%5) for i in range(5)]),("starplus",4,[(0,1),(0,2),(0,3),(1,2)]),("K4",4,list(it.combinations(range(4),2))),("P5",5,[(i,i+1) for i in range(4)]), ("C6",6,[(i,(i+1)%6) for i in range(6)])]:
    B=np.zeros((n,n))
    for i,j in e: B[i,j]=B[j,i]=1
    m,Uu=np.linalg.eigh(lap(B)); print(name,"L",m.round(3),"fied",Uu[:,1].round(2),"A",np.linalg.eigvalsh(B).round(3))
# karate
G=nx.karate_club_graph(); K=nx.to_numpy_array(G,weight=None); m,Uk=np.linalg.eigh(lap(K)); print("karate mu2",m[1].round(3), K.sum()/2)
f=Uk[:,1]; club=np.array([G.nodes[i]['club']=='Mr. Hi' for i in G])
side=f>0
if (side==club).sum()<17: side=~side
print("sign split",side.sum(),(~side).sum(),"correct",(side==club).sum(),"wrong",[i+1 for i in range(34) if side[i]!=club[i]], "cut",sum(1 for u,v in G.edges if side[u]!=side[v]))
print("vals 3,9",f[2].round(3),f[8].round(3),f.min().round(2),f.max().round(2))
med=np.median(f); side=f>med
if (side==club).sum()<17: side=~side
print("median",side.sum(),(side==club).sum(),sum(1 for u,v in G.edges if side[u]!=side[v]), "true cut",sum(1 for u,v in G.edges if club[u]!=club[v]))
print("binom40,20",__import__('math').comb(40,20))
