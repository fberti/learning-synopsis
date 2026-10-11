import numpy as np
E=[(0,1),(0,2),(1,2),(1,3),(3,4)]
A=np.zeros((5,5))
for u,v in E: A[u,v]=A[v,u]=1
x=np.array([1,0,0,0,5.])
Ah=A+np.eye(5); d=Ah.sum(1)
print("Ah x",Ah@x, "Ah^2 x",Ah@Ah@x,"Ah^3 x",np.linalg.matrix_power(Ah,3)@x)
print("A^3 x", np.linalg.matrix_power(A,3)@x)
L=np.diag(A.sum(1))-A
en=lambda h: sum((h[u]-h[v])**2 for u,v in E)
M=Ah/d[:,None]; P=np.diag(d**-.5)@Ah@np.diag(d**-.5)
print("energy x",en(x),"mean step",en(M@x).round(3),"P step",en(P@x).round(3), "xLx",x@L@x)
print("rowsum P",P.sum(1).round(3))
w,V=np.linalg.eigh(L); print("L eig",w.round(3)); print("L eigvecs (cols)\n",V.round(3))
# star graph 1 center + 100 leaves, all x=1
n=101; S=np.zeros((n,n)); S[0,1:]=S[1:,0]=1
xs=np.ones(n); print("star sum",(S@xs)[:2],"mean",((S@xs)/S.sum(1))[:2])
Sh=S+np.eye(n); ds=Sh.sum(1); Ps=np.diag(ds**-.5)@Sh@np.diag(ds**-.5)
print("star P entries center-leaf",Ps[0,1],"leaf self",Ps[1,1],"center self",Ps[0,0], "Ps xs", (Ps@xs)[:2])
# row-normalized star
Ms=Sh/ds[:,None]; print("row center-leaf", Ms[0,1], "leaf-center", Ms[1,0])
