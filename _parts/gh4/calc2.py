import numpy as np, networkx as nx
np.set_printoptions(precision=4, suppress=True)
def lap(g,nl=None):
    A=nx.to_numpy_array(g,nodelist=nl); return np.diag(A.sum(1))-A
ids=["Ko","Vi","Po","La","Ön","Sz","Kl"]
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
G=nx.Graph(E); A=nx.to_numpy_array(G,nodelist=ids)
w,V=np.linalg.eigh(A); v=np.abs(V[:,-1]); print("eigvec Ko=1",dict(zip(ids,(v/v[0]).round(3))),"sum-norm",dict(zip(ids,(v/v.sum()).round(3))),"lam",w[-1])
G2=G.copy(); G2.remove_edges_from([("Ko","Po"),("Vi","Po")]); print("arviz cut L eig",np.linalg.eigvalsh(lap(G2,ids)).round(4))
K=nx.karate_club_graph(); real=[K.nodes[i]["club"]=="Mr. Hi" for i in range(34)]
print("karate real cut",sum(1 for u,v in K.edges if real[u]!=real[v]), sum(real))
# barat L
B=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); LB=lap(B,list("ABCD")); print(LB)
for x in ([1,1,0,0],[1,1,1,0],[0,0,0,1],[1,-1,0,0]): x=np.array(x); print(x,x@LB@x)
print("barat L eig",np.linalg.eigvalsh(LB).round(4)); wb,Vb=np.linalg.eigh(LB); print("barat fiedler",Vb[:,1].round(3))
# two triangles exact
print((5-17**.5)/2)
# P4 Laplace for x
L4=lap(nx.path_graph(4)); 
for x in ([5,1,2,4],[1,2,3,4],[1,-1,1,-1]): x=np.array(x); print("P4",x,x@L4@x)
# Arviz x^TLx for split indicator and Rayleigh
L=lap(G,ids); s=np.array([-1,-1,1,1,1,-1,-1.]); print("split xLx",s@L@s)
f=np.linalg.eigh(L)[1][:,1]; print("fiedler sum",f.sum())
# A x Monday
x=np.array([1,1,0,0,0,1,0.]); print("Ax monday",dict(zip(ids,A@x)))
# A e_Ko
e=np.zeros(7); e[0]=1; print("A eKo",A@e)
# weighted stationary
Wm=np.zeros((7,7))
for a,b,ww in [("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]:
    i,j=ids.index(a),ids.index(b); Wm[i,j]=Wm[j,i]=ww
s=Wm.sum(1); print("strength",s, (s/s.sum()).round(4))
Pw=Wm/s[:,None]; pi=s/s.sum(); print("check",np.allclose(pi@Pw,pi))
# Lazy walk on star from center
S=nx.to_numpy_array(nx.star_graph(3)); PS=S/S.sum(1)[:,None]; p=np.array([1,0,0,0.])
for t in range(1,5): p=p@PS; print("star walk",t,p)
PL=(np.eye(4)+PS)/2; p=np.array([1,0,0,0.])
for t in range(1,9): p=p@PL; print("lazy",t,p.round(4))
# directed papers walk
pid=["RH","EK","NY","VN"]; Wd=np.zeros((4,4))
for a,b,ww in [("EK","RH",2),("NY","EK",1),("VN","RH",1),("VN","NY",2)]: Wd[pid.index(a),pid.index(b)]=ww
print("papers out",Wd.sum(1))
p=np.array([0,0,0,1.])
Pd=np.array([r/r.sum() if r.sum() else r for r in Wd])
for t in range(1,5): p=p@Pd; print("papers walk",t,p.round(4))
