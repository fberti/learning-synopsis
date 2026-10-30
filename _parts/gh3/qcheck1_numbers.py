import networkx as nx
from fractions import Fraction as F
from itertools import combinations
from math import comb
print("== 3.1")
G=nx.DiGraph([("P","Q"),("P","R"),("Q","R"),("R","S"),("S","Q")])
print("R out/in", G.out_degree("R"), G.in_degree("R"))
print("maxedges n=6", 6*5, comb(6,2), 36, 25)
H=nx.DiGraph([(1,2),(2,3),(3,1),(3,4),(4,5),(5,4)])
print("SCC", list(nx.strongly_connected_components(H)))
cit=[(3,2),(4,1),(5,2),(5,4),(6,5),(8,7),(9,5),(9,8),(10,1),(11,7),(11,10),(12,8)]
C=nx.DiGraph(cit)
print("DAG", nx.is_directed_acyclic_graph(C), "art8 in/out", C.in_degree(8), C.out_degree(8))
print("undirected cycle in citations:", nx.cycle_basis(C.to_undirected()))
L=nx.DiGraph(); L.add_weighted_edges_from([("EK","RH",2),("NY","EK",1),("VN","RH",1),("VN","NY",2)])
print("weak", nx.is_weakly_connected(L), "strong", nx.is_strongly_connected(L), "VN reach", nx.descendants(L,"VN"), "RH reach", nx.descendants(L,"RH"))
L2=L.copy(); L2.add_edge("RH","VN"); print("with RH->VN strong", nx.is_strongly_connected(L2))
print("RH row/col: out", L.out_degree("RH"), "in", L.in_degree("RH"))
print("== 3.2")
W=nx.Graph(); W.add_weighted_edges_from([("A","B",3),("A","C",1),("B","C",2),("C","D",4)])
print("s(C)", W.degree("C",weight="weight"), "deg", W.degree("C"), "total", W.size(weight="weight"))
arts={1:["Ko","Vi"],2:["Ko","Vi","Po"],3:["Ko","Po"],4:["Vi","Sz"],5:["Sz","Kl","Ko"],6:["Sz","Kl"],7:["La","Ön"],8:["La","Po","Ön"],9:["La","Ön"],10:["Po","Vi"],11:["Po","La"],12:["Ön","Po"]}
def strengths(wf):
    s={}
    for a in arts.values():
        k=len(a)
        for u,v in combinations(a,2):
            s[u]=s.get(u,0)+wf(k); s[v]=s.get(v,0)+wf(k)
    return s
print("Vi raw", strengths(lambda k:1)["Vi"], "Newman", strengths(lambda k:F(1,k-1))["Vi"], "1/k", float(strengths(lambda k:F(1,k))["Vi"]))
R=nx.Graph()
for a in arts.values():
    for u,v in combinations(a,2): R.add_edge(u,v)
print("Vi deg", R.degree("Vi"))
print("4-actor pair", F(1,3), F(1,4), F(1,6), comb(4,2))
print("A 8/40", 8/40, "B 4/12", 4/12)
small=[["A","B"],["A","B","C"],["A","B","C","D"]]
for name,wf in [("newman",lambda k:F(1,k-1)),("raw",lambda k:1),("1/k",lambda k:F(1,k)),("1/binom",lambda k:F(1,comb(k,2)))]:
    print(name, float(sum(wf(len(a)) for a in small)))
print("== 3.3")
rel=[("Ko","Vi",1),("Sz","Vi",1),("Po","Ko",1),("Vi","Po",1),("Sz","Ko",-1),("La","Ön",1),("Po","La",1),("Po","Ön",1)]
print("pos", sum(s>0 for *_,s in rel), "neg", sum(s<0 for *_,s in rel), "coment edges", R.number_of_edges())
S=nx.Graph(); [S.add_edge(a,b,s=s) for a,b,s in rel]
print("Sz signed", sum(d["s"] for *_,d in S.edges("Sz",data=True)), "deg", S.degree("Sz"))
for t in ["+++","++-","+--","---"]:
    p=1
    for c in t: p*= 1 if c=="+" else -1
    print(t, "balanced" if p>0 else "unbalanced")
print("== 3.4")
for name,E in [("C4",["AB","BC","CD","DA"]),("K3",["AB","BC","CA"]),("C5",["AB","BC","CD","DE","EA"]),("tree",["AB","AC","AD","DE"]),("C4+chord",["AB","BC","CD","DA","AC"])]:
    print(name, nx.is_bipartite(nx.Graph([tuple(e) for e in E])))
N={"RH":{1,3,6},"EK":{1,5},"NY":{2,4,6},"VN":{2,3,6}}
k={e:sum(e in s for s in N.values()) for e in range(1,7)}
print("colsums", k)
for a,b in combinations(N,2):
    i=N[a]&N[b]; u=N[a]|N[b]
    if i: print(a,b,"cnt",len(i),"J",len(i)/len(u),"min",len(i)/min(len(N[a]),len(N[b])),"all6",len(i)/6,"newman",sum(F(1,k[e]-1) for e in i),"1/k",float(sum(F(1,k[e]) for e in i)))
ev={e:{p for p in N if e in N[p]} for e in range(1,7)}
print("E3-E6", len(ev[3]&ev[6]), "union", len(ev[3]|ev[6]), "sum", len(ev[3])+len(ev[6]))
