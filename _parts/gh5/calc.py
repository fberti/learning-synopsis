import networkx as nx, numpy as np
from fractions import Fraction as F
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
ids=["Ko","Vi","Po","La","Ön","Sz","Kl"]
def show(name,d,k=3): print(name, {i:round(d[i],k) for i in ids})
show("deg",dict(G.degree()))
show("degc",nx.degree_centrality(G))
show("str",dict(G.degree(weight="weight")))
show("farness",{v:sum(nx.single_source_shortest_path_length(G,v).values()) for v in G})
show("clo",nx.closeness_centrality(G))
show("harm",nx.harmonic_centrality(G))
show("btw raw",nx.betweenness_centrality(G,normalized=False))
show("btw norm",nx.betweenness_centrality(G))
ev=nx.eigenvector_centrality_numpy(G); mx=max(ev.values()); show("eig max1",{k:v/mx for k,v in ev.items()})
show("PR .85",nx.pagerank(G,0.85,weight=None))
show("PR w",nx.pagerank(G,0.85))
# paper graphs
import json
arts=[(1,"RH",["Ko","Vi"]),(2,"RH",["Ko","Vi","Po"]),(3,"RH",["Ko","Po"]),(4,"EK",["Vi","Sz"]),(5,"EK",["Sz","Kl","Ko"]),(6,"EK",["Sz","Kl"]),(7,"NY",["La","Ön"]),(8,"NY",["La","Po","Ön"]),(9,"NY",["La","Ön"]),(10,"VN",["Po","Vi"]),(11,"VN",["Po","La"]),(12,"VN",["Ön","Po"])]
cit=[[3,2],[4,1],[5,2],[5,4],[6,5],[8,7],[9,5],[9,8],[10,1],[11,7],[11,10],[12,8]]
pap={a:p for a,p,_ in arts}
for p in ["RH","EK","NY","VN"]:
  H=nx.Graph()
  for a,pp,m in arts:
    if pp==p:
      for i in range(len(m)):
        for j in range(i+1,len(m)): H.add_edge(m[i],m[j])
  print(p, sorted(H.edges()), dict(H.degree()), {k:round(v,2) for k,v in nx.betweenness_centrality(H,normalized=False).items()})
D=nx.DiGraph()
for x,y in cit:
  a,b=pap[x],pap[y]
  if a!=b: D.add_edge(a,b,weight=D[a][b]["weight"]+1 if D.has_edge(a,b) else 1)
print("papers", D.edges(data=True))
print("in",dict(D.in_degree()),"out",dict(D.out_degree()))
print("PR papers", {k:round(v,3) for k,v in nx.pagerank(D,0.85,weight=None).items()})
print("PR papers w", {k:round(v,3) for k,v in nx.pagerank(D,0.85).items()})
# article citation graph
C=nx.DiGraph(); C.add_nodes_from(range(1,13)); C.add_edges_from(cit)
print("art in",dict(C.in_degree()))
print("art PR", {k:round(v,3) for k,v in sorted(nx.pagerank(C,0.85).items(), key=lambda t:-t[1])})
h,a=nx.hits(C); print("art hub",{k:round(v,3) for k,v in h.items()}); print("art auth",{k:round(v,3) for k,v in a.items()})
# speakers
from collections import Counter
sp=Counter(); 
spk={1:["Ko"],2:["Vi"],3:["Ko"],4:["Sz"],5:["Sz"],6:["Sz"],7:["La"],8:["La","Po"],9:["Ön"],10:["Po"],11:["La"],12:["Ön"]}
for v in spk.values(): sp.update(v)
print("speaks",sp)
men=Counter()
for _,_,m in arts: men.update(m)
print("mentions",men)
