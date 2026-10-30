import networkx as nx, numpy as np
def r(d,k=3): return {n:round(v,k) for n,v in d.items()}
# HITS example
E=[("H1","T1"),("H1","T2"),("H1","T3"),("H2","T1"),("H2","T2"),("T3","T1")]
N=["H1","H2","T1","T2","T3"]; idx={v:i for i,v in enumerate(N)}
A=np.zeros((5,5))
for a,b in E: A[idx[a],idx[b]]=1
h=np.ones(5)
for k in range(1,4):
  a=A.T@h; h2=A@a
  print(k,"auth raw",a,"hub raw",h2,"auth max1",np.round(a/a.max(),3),"hub max1",np.round(h2/h2.max(),3))
  a=a/a.max(); h=h2/h2.max()
G=nx.DiGraph(E); hh,aa=nx.hits(G,max_iter=1000); print("hits hub",r({k:v/max(hh.values()) for k,v in hh.items()}),"auth",r({k:v/max(aa.values()) for k,v in aa.items()}))
print("indeg",dict(G.in_degree()),"PR",r(nx.pagerank(G)))
# eigen example: same degree, different neighbours
for edges in [ [("A","B"),("A","C"),("B","C"),("X","A"),("X","B"),("C","Y"),("Y","L")],
               [("A","B"),("A","C"),("A","D"),("B","C"),("B","D"),("C","D"),("D","X"),("X","Y"),("Y","Z")] ]:
  G=nx.Graph(edges); ev=nx.eigenvector_centrality_numpy(G); m=max(ev.values())
  print(dict(G.degree()), r({k:v/m for k,v in ev.items()},2), "lam", round(max(np.linalg.eigvalsh(nx.to_numpy_array(G))),3))
# karate
Kk=nx.karate_club_graph(); Kg=nx.Graph(); Kg.add_edges_from(Kk.edges())
cs={"deg":nx.degree_centrality(Kg),"clo":nx.closeness_centrality(Kg),"btw":nx.betweenness_centrality(Kg),"eig":nx.eigenvector_centrality_numpy(Kg),"pr":nx.pagerank(Kg)}
from itertools import combinations
def spear(x,y):
  rx=np.argsort(np.argsort(x)); ry=np.argsort(np.argsort(y)); return np.corrcoef(rx,ry)[0,1]
V=list(Kg.nodes())
for a,b in combinations(cs,2):
  x=[cs[a][v] for v in V]; y=[cs[b][v] for v in V]; print(a,b,"pearson",round(np.corrcoef(x,y)[0,1],2))
for k,d in cs.items(): print(k,"top5",[ (v+1, round(d[v],3)) for v in sorted(d,key=lambda v:-d[v])[:5]])
