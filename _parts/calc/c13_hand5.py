import numpy as np
E=[(0,1),(0,2),(1,2),(1,3),(3,4)]
A=np.zeros((5,5))
for u,v in E: A[u,v]=A[v,u]=1
M=A/A.sum(1,keepdims=True)
for k in (1,2,3,4):
    print("RW return k",k, np.diag(np.linalg.matrix_power(M,k)).round(3))
L=np.diag(A.sum(1))-A; w,V=np.linalg.eigh(L); print("fiedler",V[:,1].round(3), w[1].round(3))
def ring(n):
    B=np.zeros((n,n))
    for i in range(n): B[i,(i+1)%n]=B[(i+1)%n,i]=1
    return B
H=ring(6); T=np.zeros((6,6)); T[:3,:3]=ring(3); T[3:,3:]=ring(3)
for nm,B in (("hex",H),("2tri",T)):
    Mb=B/B.sum(1,keepdims=True); print(nm,[np.diag(np.linalg.matrix_power(Mb,k))[0].round(3) for k in (2,3,4)])
    Lb=np.diag(B.sum(1))-B; print(" eig",np.linalg.eigvalsh(Lb).round(3))
print("cora pairs", 2708**2, "edges+self", 10556+2708)
