import numpy as np, itertools, math
np.set_printoptions(precision=4, suppress=True)
names="ABCDE"
E=[(0,1),(0,2),(1,2),(1,3),(3,4)]
A=np.zeros((5,5),int)
for u,v in E: A[u,v]=A[v,u]=1
print("A\n",A); print("deg",A.sum(1))
A2=A@A; print("A2\n",A2); A3=A2@A; print("A3 diag",np.diag(A3),"triangles",np.trace(A3)/6)
# permutations
mats=set()
for p in itertools.permutations(range(5)):
    P=np.eye(5,dtype=int)[list(p)]
    mats.add((P@A@P.T).tobytes())
print("distinct matrices",len(mats))
# clustering
for i in range(5):
    nb=np.nonzero(A[i])[0]; k=len(nb)
    t=sum(A[a,b] for a,b in itertools.combinations(nb,2))
    print(names[i],"clust", t/(k*(k-1)/2) if k>1 else None)
x=np.array([1,0,0,0,5.])
print("sum agg",A@x,"mean agg",(A@x)/A.sum(1),"max",[max(x[np.nonzero(A[i])[0]]) for i in range(5)])
# oversmoothing self-loop mean
Ah=A+np.eye(5); M=Ah/Ah.sum(1,keepdims=True)
h=x.copy()
for k in range(0,31):
    if k in (0,1,2,3,5,10,20,30): print("k",k,h.round(3),"std %.3f"%h.std())
    h=M@h
d=Ah.sum(1); print("stationary weighted mean", (d@x)/d.sum())
# GCN norm
Dm=np.diag(d**-0.5); P=Dm@Ah@Dm; print("P\n",P); print("P x",P@x, "std", (P@x).std())
h=x.copy()
for k in range(31):
    if k in (0,1,2,5,10,30): print("gcn k",k,h.round(3))
    h=P@h
# path 1-2-3
Ap=np.array([[1,1,0],[1,1,1],[0,1,1]],float); dp=Ap.sum(1); print("path P\n",np.diag(dp**-.5)@Ap@np.diag(dp**-.5), 1/math.sqrt(6))
# eigen of P
w,V=np.linalg.eigh(P); print("eig P",w); print("top eigvec",V[:,-1], np.sqrt(d)/np.linalg.norm(np.sqrt(d)))
