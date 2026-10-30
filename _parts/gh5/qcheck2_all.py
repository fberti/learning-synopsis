# q2.js (gh5-55..58, gh5-final) számainak ellenőrzése
import networkx as nx, numpy as np, re
from fractions import Fraction as Fr
from math import comb, sqrt
def pr_iter(edges, nodes, alpha, steps=None, start=None, dangling=True, tele=True):
    n=len(nodes); out={v:[b for a,b in edges if a==v] for v in nodes}
    p={v:(start if start is not None else 1/n) for v in nodes}
    for t in range(steps or 2000):
        q={v:((1-alpha)/n if tele else 0) for v in nodes}
        for j in nodes:
            if out[j]:
                for i in out[j]: q[i]+=alpha*p[j]/len(out[j])
            elif dangling:
                for i in nodes: q[i]+=alpha*p[j]/n
        p=q
    return p
def r(d,k=3): return {a:round(b,k) for a,b in d.items()}
print("=== gh5-55")
E1=[("A","B"),("B","C"),("C","A"),("C","B")]
print("Q1 alpha=1:", r(pr_iter(E1,"ABC",1.0)))
ind={v:sum(1 for a,b in E1 if b==v) for v in "ABC"}; print(" befok/4", {v:ind[v]/4 for v in ind})
outd={v:sum(1 for a,b in E1 if a==v) for v in "ABC"}; print(" kifok/4", {v:outd[v]/4 for v in outd})
print(" nx alpha .9999", r(nx.pagerank(nx.DiGraph(E1),alpha=0.99999,tol=1e-12,max_iter=10**6)))
p1=pr_iter(E1,"ABC",0.85,steps=1); print("Q2 one step:", r(p1,4))
print("  alpha/n swap B:", 0.85/3+0.15*0.5, " no tele:",0.85*0.5, " no kifok div B:",0.05+0.85*(2/3))
print("Q4 dead-end A->B->C, no handling, alpha1:")
for s in (1,2,3): p=pr_iter([("A","B"),("B","C")],"ABC",1.0,steps=s,dangling=False,tele=False); print("  ",s,r(p,4),"sum",round(sum(p.values()),4))
print("Q5 no in-links n=5: (1-a)/n", 0.15/5, " a/n", 0.85/5, " 1/n", 0.2)
G5=nx.DiGraph([("E","A"),("A","B"),("B","C"),("C","A"),("B","D"),("D","A")]); print("  example graph", r(nx.pagerank(G5),4))
D=nx.DiGraph([("EK","RH"),("NY","EK"),("VN","RH"),("VN","NY")]); prD=nx.pagerank(D,0.85); print("Q6 lapok", r(prD))
print("  VN:",0.15/4+0.85*prD["RH"]/4, " no alpha:",0.0375+prD["RH"]/4)
print("  alpha .5", r(nx.pagerank(D,0.5)))
AE=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(AE); Gu=nx.Graph(G.edges())
print("Q7 arviz PR", r(nx.pagerank(Gu)), "d/2m Po", 4/20, "s/2W Po", 8/(2*sum(w for *_,w in AE)), "deg c", 4/6, "1/7",1/7)
print("=== gh5-56")
def hits(edges, nodes, steps=1, iters=None):
    idx={v:i for i,v in enumerate(nodes)}; n=len(nodes); A=np.zeros((n,n))
    for a,b in edges: A[idx[a],idx[b]]=1
    h=np.ones(n)
    for t in range(steps):
        a=A.T@h; a=a/a.max(); h=A@a; h=h/h.max()
    return dict(zip(nodes,a.round(3))), dict(zip(nodes,h.round(3))), A
E2=[("P","Q"),("P","R"),("S","Q"),("S","R"),("R","Q")]
a,h,_=hits(E2,"PQRS",1); print("Q1 step1 a",a,"h",h)
idx={v:i for i,v in enumerate("PQRS")}; A=np.zeros((4,4))
for x,y in E2: A[idx[x],idx[y]]=1
a_raw=A.T@np.ones(4); print("  raw a",a_raw,"raw h",A@a_raw, "wrong h (in-neighbours)",A.T@a_raw)
HT=[("H1","T1"),("H1","T2"),("H1","T3"),("H2","T1"),("H2","T2"),("T3","T1")]; N=["H1","H2","T1","T2","T3"]
idx={v:i for i,v in enumerate(N)}; A=np.zeros((5,5))
for x,y in HT: A[idx[x],idx[y]]=1
C=A.T@A; print("Q4 (AtA)_T1T2",C[idx["T1"],idx["T2"]],"(AtA)_T1T1",C[idx["T1"],idx["T1"]],"(AAt)_T1T2",(A@A.T)[idx["T1"],idx["T2"]], "(AAt)_H1H2",(A@A.T)[idx["H1"],idx["H2"]])
a1,h1,_=hits(HT,N,1); print("  step1",a1,h1)
hh=np.array([1,5/6,0,0,0.5]); a2=A.T@hh; print("Q7 step2 raw a",dict(zip(N,a2.round(3))),"T2 norm",a2[idx["T2"]]/a2.max(), " H2+T3", 5/6+0.5)
print("  limit",hits(HT,N,200)[:2])
print("Q6 lapok HITS", hits([("EK","RH"),("NY","EK"),("VN","RH"),("VN","NY")],["RH","EK","NY","VN"],500)[:2])
print("=== gh5-57")
K=nx.Graph([("A","B"),("A","C"),("A","D"),("A","F"),("B","D"),("B","E"),("B","G"),("C","D"),("C","F"),("D","E"),("D","F"),("D","G"),("E","G"),("F","G"),("F","H"),("G","H"),("H","I"),("I","J")])
bt=nx.betweenness_centrality(K,normalized=False); print("kite btw",r(bt,2)); print(" H norm",bt["H"]/comb(9,2),"/C(10,2)",bt["H"]/comb(10,2),"doubled",2*bt["H"]/36,"/(n-1)",bt["H"]/9)
print(" closeness",r(nx.closeness_centrality(K),2)); print(" degree",dict(K.degree()))
ev=nx.eigenvector_centrality_numpy(K); m=max(ev.values()); print(" eig",{k:round(v/m,2) for k,v in ev.items()})
Kar=nx.Graph(nx.karate_club_graph().edges()); V=list(Kar)
meas={"deg":nx.degree_centrality(Kar),"clo":nx.closeness_centrality(Kar),"btw":nx.betweenness_centrality(Kar),"eig":nx.eigenvector_centrality_numpy(Kar),"pr":nx.pagerank(Kar)}
names=list(meas)
for i in range(5):
    for j in range(i+1,5): print(" corr",names[i],names[j],round(np.corrcoef([meas[names[i]][v] for v in V],[meas[names[j]][v] for v in V])[0,1],3))
for k in names: print(" top",k,sorted(V,key=lambda v:-meas[k][v])[:2], round(meas[k][0],3), round(meas[k][33],3))
print("=== gh5-58")
print(" arviz btw",nx.betweenness_centrality(Gu,normalized=False)); print(" strength",dict(G.degree(weight="weight")))
evA=nx.eigenvector_centrality_numpy(Gu); m=max(evA.values()); print(" eig",{k:round(v/m,2) for k,v in evA.items()})
print(" clo",r(nx.closeness_centrality(Gu),3)," harm",r(nx.harmonic_centrality(Gu),3))
EK=nx.Graph([("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko")]); b=nx.betweenness_centrality(EK,normalized=False); print(" EK btw",b, "Sz endpoint-incl", b["Sz"]+3)
VN=nx.Graph([("Po","Vi"),("Po","La"),("Po","Ön")]); print(" VN btw",nx.betweenness_centrality(VN,normalized=False),nx.betweenness_centrality(VN)["Po"])
txt=open("dl/polblogs.gml",encoding="utf-8").read()
nodes={int(m[1]):(m[2],int(m[3])) for m in re.finditer(r'node \[\s*id (\d+)\s*label "([^"]*)"\s*value (\d)',txt)}
edges=[(int(a),int(b)) for a,b in re.findall(r'edge \[\s*source (\d+)\s*target (\d+)',txt)]
P=nx.DiGraph(); P.add_nodes_from(nodes); P.add_edges_from((a,b) for a,b in edges if a!=b)
P=P.subgraph(max(nx.weakly_connected_components(P),key=len)).copy()
lean={v:nodes[v][1] for v in P}; print(" polblogs",P.number_of_nodes(),P.number_of_edges(),sum(1-lean[v] for v in P),sum(lean[v] for v in P))
cross=sum(1 for x,y in P.edges() if lean[x]!=lean[y]); print(" cross",cross,cross/P.number_of_edges())
od=dict(P.out_degree()); top=max(od,key=od.get); print(" max outdeg",nodes[top],od[top])
idg=dict(P.in_degree()); top=max(idg,key=idg.get); print(" max indeg",nodes[top],idg[top])
hP,aP=nx.hits(P,max_iter=1000); print(" hub rank of max-outdeg blog", sorted(P,key=lambda v:-hP[v]).index(max(od,key=od.get))+1)
print("=== final")
print("Q1", 8/20, 4/5, 8/21, 4/6)
F3=nx.Graph([("A","B"),("B","C"),("C","D"),("C","E")]); print("Q3 D dist sum",sum(nx.shortest_path_length(F3,"D").values()), nx.closeness_centrality(F3)["D"])
F4=nx.Graph([(1,2),(2,3),(3,4),(5,6)]); print("Q4 harm", nx.harmonic_centrality(F4)[1], 11/6, 11/30)
F5=nx.Graph([("A","B"),("A","C"),("B","D"),("C","D"),("D","E")]); print("Q5 btw",nx.betweenness_centrality(F5,normalized=False))
print("Q6", 9/15, 9/21, 9/6, 9/30, nx.betweenness_centrality(nx.path_graph(7),normalized=False)[3])
S=nx.star_graph(9); e=nx.eigenvector_centrality_numpy(S); print("Q7 leaf", e[1]/e[0], 1/3, "lambda", max(np.linalg.eigvalsh(nx.to_numpy_array(S))))
ch=nx.DiGraph([("A","B"),("B","C"),("C","D")]); print("Q8 chain PR", r(nx.pagerank(ch),3))
At=np.zeros((4,4)); At[0,1]=At[1,2]=At[2,3]=1; print("  chain eigvals A^T", np.linalg.eigvals(At.T))
Ef=[("A","C"),("B","C"),("B","D")]; print("Q10", hits(Ef,"ABCD",500)[:2], (sqrt(5)-1)/2)
print("Q12 VN norm", 3/comb(3,2), 3/comb(4,2))
print("Q2", "B befok w", 3+1, "kifok w", 2, "be+ki w", 6, "be+ki unw", 3)
print("5.4 practice star+edge limit");g=nx.Graph([("A","B"),("A","C"),("A","D"),("B","C")]); e=nx.eigenvector_centrality_numpy(g); m=max(e.values()); print({k:round(v/m,2) for k,v in e.items()})
print("alpha clicks: mean link-follows before teleport", 0.85/0.15, "mean steps", 1/0.15)
print("kite dist from I", dict(nx.shortest_path_length(K,"I")))
