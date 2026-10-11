import numpy as np, math
E=[(0,1),(0,2),(1,2),(1,3),(3,4)]
A=np.zeros((5,5))
for u,v in E: A[u,v]=A[v,u]=1
x=np.array([1,0,0,0,5.])
Ah=A+np.eye(5); M=Ah/Ah.sum(1,keepdims=True)
for a in (0.1,0.2,0.5):
    h=x.copy()
    for k in range(200): h=(1-a)*M@h+a*x
    print("appnp",a,h.round(3),"std %.3f"%h.std())
# MP step a: h'=ReLU(0.5h+agg)
mean=(A@x)/A.sum(1); s=A@x; mx=np.array([max(x[np.nonzero(A[i])[0]]) for i in range(5)])
for nm,m in (("mean",mean),("sum",s),("max",mx)): print(nm, np.maximum(0,0.5*x+m).round(3))
# GAT for B (idx1) neighbors A,B(self),C,D
lr=lambda z: z if z>0 else 0.2*z
hB=0
for a1,a2 in ((0.5,1),):
    e=[lr(a1*hB+a2*x[j]) for j in (0,1,2,3)]
    w=np.exp(e)/np.exp(e).sum(); print("GAT e",e,"w",w.round(3),"out",(w*x[[0,1,2,3]]).sum().round(3))
sig=lambda z:1/(1+math.exp(-z))
U={"U1":(1,0),"U2":(0,1),"U3":(1,1)}; T={"T1":(1,-0.5),"T2":(0.5,1)}
for u,uv in U.items():
    print(u,[ (t, np.dot(uv,tv), round(sig(np.dot(uv,tv)),3)) for t,tv in T.items()])
