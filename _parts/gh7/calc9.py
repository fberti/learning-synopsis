import numpy as np, networkx as nx, json
from math import comb
K=nx.Graph(nx.karate_club_graph().edges()); m=K.number_of_edges()
R=np.random.default_rng(4); a=[];t=[];L=[]
for s in range(300):
  H=K.copy(); nx.double_edge_swap(H,nswap=10*m,max_tries=10**6,seed=int(R.integers(1e9)))
  a.append(nx.average_clustering(H)); t.append(nx.transitivity(H))
  if nx.is_connected(H): L.append(nx.average_shortest_path_length(H))
print("karate config avgC",np.mean(a),"trans",np.mean(t),np.std(t),"L",np.mean(L))
s=open("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js",encoding="utf-8").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1]); E=d["edges"]; n=d["n"]
G=nx.Graph(); G.add_nodes_from(range(n))
for i in range(0,len(E),2):
  if E[i]!=E[i+1]: G.add_edge(E[i],E[i+1])
H=G.copy(); nx.double_edge_swap(H,nswap=10*G.number_of_edges(),max_tries=10**8,seed=1)
Hc=H.subgraph(max(nx.connected_components(H),key=len))
print("polblogs config L",nx.average_shortest_path_length(Hc), len(Hc))
print("RH-Ko p", comb(4,3)/comb(12,3))
print("sigma polblogs", (0.320/0.0223)/(2.738/2.508), "karate",(0.5706/0.132)/(2.408/2.396))
