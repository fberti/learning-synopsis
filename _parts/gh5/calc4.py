import networkx as nx, numpy as np
def r(d,k=3): return {n:round(v,k) for n,v in d.items()}
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
G=nx.Graph(E); G2=G.copy(); G2.add_edge("La","Vi"); print("btw +La-Vi",nx.betweenness_centrality(G2,normalized=False))
G3=G.copy(); G3.remove_edge("Ko","Po"); print("btw -Ko-Po",nx.betweenness_centrality(G3,normalized=False))
print("harm norm",r({k:v/6 for k,v in nx.harmonic_centrality(G).items()}))
D=nx.DiGraph([("A","B"),("B","A"),("C","A")]); print("PR ABC",r(nx.pagerank(D,0.85),4))
Kk=nx.karate_club_graph(); Kg=nx.Graph(Kk.edges())
V=list(Kg); d=[Kg.degree(v) for v in V]; pr=nx.pagerank(Kg); print("karate corr deg-pr",np.corrcoef(d,[pr[v] for v in V])[0,1])
print("karate deg 1,34",Kg.degree(0),Kg.degree(33), "btw norm top", r(nx.betweenness_centrality(Kg))[0], r(nx.betweenness_centrality(Kg))[33])
# C5 btw, star K1,4 eig, path3 eig
print("C5",nx.betweenness_centrality(nx.cycle_graph(5),normalized=False))
for g in [nx.star_graph(4),nx.star_graph(3),nx.path_graph(3),nx.complete_graph(4)]:
  ev=nx.eigenvector_centrality_numpy(g); m=max(ev.values()); print(r({k:v/m for k,v in ev.items()}))
# X/Y graph step-by-step
X=nx.Graph([("A","B"),("A","C"),("B","C"),("X","A"),("X","B"),("C","Y"),("Y","L")]); N=list(X); A=nx.to_numpy_array(X,nodelist=N); x=np.ones(len(N))
for k in range(3): x=A@x; print(N, x)
ev=nx.eigenvector_centrality_numpy(X); m=max(ev.values()); print(r({k:v/m for k,v in ev.items()}))
# star directed: leaves -> center, center->leaves
S=nx.DiGraph([("K","L1"),("K","L2"),("K","L3"),("L1","K"),("L2","K"),("L3","K")]); print("star PR",r(nx.pagerank(S),4))
# chain directed A->B->C
Ch=nx.DiGraph([("A","B"),("B","C")]); print("chain PR",r(nx.pagerank(Ch),4))
# path5 harmonic normalized
print("p5 harm", r(nx.harmonic_centrality(nx.path_graph(5))))
# kite: btw norm
K=nx.krackhardt_kite_graph(); print("kite btw norm",r(nx.betweenness_centrality(K)))
# twoTri closeness etc and star6
print("star6 clo",r(nx.closeness_centrality(nx.star_graph(5))))
