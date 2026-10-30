import networkx as nx, numpy as np
def r(d,k=3): return {n:round(v,k) for n,v in d.items()}
K=nx.krackhardt_kite_graph(); K=nx.relabel_nodes(K,{i:"ABCDEFGHIJ"[i] for i in range(10)})
print("kite edges",sorted(tuple(sorted(e)) for e in K.edges()))
print("deg",dict(K.degree())); print("clo",r(nx.closeness_centrality(K))); print("farness",{v:sum(nx.single_source_shortest_path_length(K,v).values()) for v in K})
print("btw raw",r(nx.betweenness_centrality(K,normalized=False))); ev=nx.eigenvector_centrality_numpy(K); m=max(ev.values()); print("eig",r({k:v/m for k,v in ev.items()},2))
print("PR",r(nx.pagerank(K)))
# bowtie
B=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D"),("C","E"),("D","E")]); print("bowtie btw",nx.betweenness_centrality(B,normalized=False), nx.betweenness_centrality(B))
P=nx.path_graph([1,2,3,4,5]); print("path5 clo",r(nx.closeness_centrality(P)), "btw",nx.betweenness_centrality(P,normalized=False),"harm",r(nx.harmonic_centrality(P)))
C4=nx.cycle_graph([1,2,3,4]); print("C4 btw",nx.betweenness_centrality(C4,normalized=False))
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)]); print("twoTri btw",nx.betweenness_centrality(T,normalized=False),"clo",r(nx.closeness_centrality(T)))
star=nx.star_graph(4); print("star5 btw",nx.betweenness_centrality(star,normalized=False),nx.betweenness_centrality(star))
# harmonic on disconnected: path 1-2-3 plus edge 4-5
H=nx.Graph([(1,2),(2,3),(4,5)]); print("disc clo nx",r(nx.closeness_centrality(H)),"harm",r(nx.harmonic_centrality(H)))
# PR simple
G=nx.DiGraph([("A","B"),("A","C"),("B","C"),("C","A")]); print("PR alpha1",r(nx.pagerank(G,alpha=1.0,tol=1e-12,max_iter=1000)))
G2=nx.DiGraph([("A","B"),("A","C"),("B","C"),("C","A"),("D","C")]); print("PR2 alpha1",r(nx.pagerank(G2,alpha=0.9999999,tol=1e-14,max_iter=10000)), "a.85",r(nx.pagerank(G2,alpha=.85)))
# manual iterations
def pr_iter(nodes,edges,alpha,it,start=None):
  n=len(nodes); idx={v:i for i,v in enumerate(nodes)}; out={v:[b for a,b in edges if a==v] for v in nodes}
  p=np.full(n,1/n) if start is None else np.array(start,float)
  hist=[p.copy()]
  for _ in range(it):
    q=np.full(n,(1-alpha)/n)
    for v in nodes:
      if out[v]:
        for w in out[v]: q[idx[w]]+=alpha*p[idx[v]]/len(out[v])
      else: q+=alpha*p[idx[v]]/n
    p=q; hist.append(p.copy())
  return hist
for a in (1.0,0.85):
  print("iter G2 alpha",a); [print(np.round(h,4)) for h in pr_iter("ABCD",[("A","B"),("A","C"),("B","C"),("C","A"),("D","C")],a,4)]
print("iter G alpha1"); [print(np.round(h,4)) for h in pr_iter("ABC",[("A","B"),("A","C"),("B","C"),("C","A")],1.0,6)]
# dangling example: A->B, A->C, B->C, C has no out? 
print("dangling noalpha (leak)");
def leak(nodes,edges,it):
  idx={v:i for i,v in enumerate(nodes)}; p=np.full(len(nodes),1/len(nodes)); out={v:[b for a,b in edges if a==v] for v in nodes}
  for k in range(it):
    q=np.zeros(len(nodes))
    for v in nodes:
      for w in out[v]: q[idx[w]]+=p[idx[v]]/len(out[v])
    p=q; print(k+1,np.round(p,4),round(p.sum(),4))
leak("ABCD",[("A","B"),("A","C"),("B","C"),("D","C")],3)
# spider trap / papers
pp=nx.DiGraph([("EK","RH"),("NY","EK"),("VN","RH"),("VN","NY")])
for a in (0.85,0.5): print("papers PR",a,r(nx.pagerank(pp,a)))
print("papers iter"); [print(np.round(h,4)) for h in pr_iter(["RH","EK","NY","VN"],list(pp.edges()),0.85,3)]
