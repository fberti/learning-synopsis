import numpy as np, networkx as nx, json
def lap(g,nodelist=None):
    A=nx.to_numpy_array(g,nodelist=nodelist); return np.diag(A.sum(1))-A
np.set_printoptions(precision=4, suppress=True)
def show(t,*a): print("##",t,*a)
ids=["Ko","Vi","Po","La","Ön","Sz","Kl"]
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
G=nx.Graph(); G.add_nodes_from(ids); G.add_edges_from(E)
A=nx.to_numpy_array(G,nodelist=ids); d=A.sum(1); m=len(E)
show("arviz deg",dict(zip(ids,d)),"m",m,"pi",dict(zip(ids,d/(2*m))))
P=A/d[:,None]
p=np.zeros(7); p[ids.index("Kl")]=1
for t in range(1,31):
    p=p@P
    if t in (1,2,3,5,10,20,30): show("arviz walk from Kl t",t,p)
w,V=np.linalg.eigh(A); show("arviz A eig",w); v=V[:,-1]; v=v/v.max(); show("arviz eigvec (max=1)",dict(zip(ids,v.round(3))))
x=np.ones(7)
for t in range(1,8):
    x=A@x; show("arviz power",t,x, (x/x.max()).round(3))
L=np.diag(d)-A; w,V=np.linalg.eigh(L); show("arviz L eig",w); show("fiedler",dict(zip(ids,V[:,1].round(3))))
# P4
A4=nx.to_numpy_array(nx.path_graph(4)); x=np.array([5,1,2,4.]); show("P4 Ax",A4@x,"avg",(A4@x)/A4.sum(1))
# barátsággráf
bid=["A","B","C","D"]; B=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); AB=nx.to_numpy_array(B,nodelist=bid); dB=AB.sum(1)
PB=AB/dB[:,None]; show("PB",PB); p=np.array([0,0,0,1.])
for t in range(1,13): p=p@PB; show("B walk t",t,p)
show("B pi",dB/dB.sum())
p=np.array([1,0,0,0.])
for t in range(1,4): p=p@PB; show("B walk from A t",t,p)
# paw: star+edge
pid=["A","B","C","D"]; Pw=nx.Graph([("A","B"),("A","C"),("A","D"),("B","C")]); AP=nx.to_numpy_array(Pw,nodelist=pid)
x=np.ones(4)
for t in range(1,9):
    y=AP@x; x=y/y.max(); show("paw power",t,y,x.round(4))
w,V=np.linalg.eigh(AP); show("paw eig",w,V[:,-1]/V[:,-1].max())
# star K1,3 oscillation
S=nx.to_numpy_array(nx.star_graph(3)); x=np.array([1,0,0,0.])
for t in range(1,5): x=S@x; show("star power from center",t,x)
w,V=np.linalg.eigh(S); show("star eig",w)
# P3 laplacian
L3=lap(nx.path_graph(3)); show("L3",L3)
for x in ([1,1,1],[1,2,3],[1,3,1],[3,2,1],[0,1,0]): x=np.array(x); show("xLx",x,x@L3@x)
show("L3 eig",np.linalg.eigvalsh(L3))
# two triangles+bridge
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)]); LT=lap(T,nodelist=range(1,7))
w,V=np.linalg.eigh(LT); show("TT L eig",w); f=V[:,1]; f=f*np.sign(f[0]); show("TT fiedler",f)
x=np.array([1,1,1,-1,-1,-1]); show("TT cut xLx",x@LT@x)
# disconnected: two triangles no bridge
T2=nx.Graph([(1,2),(1,3),(2,3),(4,5),(4,6),(5,6)]); show("T2 L eig",np.linalg.eigvalsh(lap(T2,nodelist=range(1,7))))
# P4 L eig, K3, C4
for nm,g in [("P4",nx.path_graph(4)),("K3",nx.complete_graph(3)),("C4",nx.cycle_graph(4)),("K4",nx.complete_graph(4)),("star3",nx.star_graph(3))]:
    show(nm,"L eig",np.linalg.eigvalsh(lap(g)),"A eig",np.linalg.eigvalsh(nx.to_numpy_array(g)))
# karate
K=nx.karate_club_graph(); LK=lap(K,nodelist=range(34))
w,V=np.linalg.eigh(LK); f=V[:,1]; f=f*np.sign(f[0]); show("karate l2",w[:3])
club=[K.nodes[i]["club"] for i in range(34)]
side=(f>0); agree=sum((side[i])==(club[i]=="Mr. Hi") for i in range(34)); show("karate fiedler agree",agree,"cut",sum(1 for u,v in K.edges if side[u]!=side[v]),"sizes",side.sum())
show("karate wrong",[i for i in range(34) if side[i]!=(club[i]=="Mr. Hi")], f[[2,8]])
show("karate deg sum",2*K.number_of_edges())
