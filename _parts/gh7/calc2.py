import networkx as nx, numpy as np, math
# ring lattice
for n,k in [(8,4),(10,4),(12,4),(20,4),(1000,10)]:
  G=nx.watts_strogatz_graph(n,k,0)
  print("ring",n,k,"C",nx.average_clustering(G),"formula",3*(k-2)/(4*(k-1)),"L",nx.average_shortest_path_length(G),"n/2k",n/(2*k))
# WS curve n=1000,k=10
n,k=1000,10
G0=nx.watts_strogatz_graph(n,k,0); C0=nx.average_clustering(G0); L0=nx.average_shortest_path_length(G0)
R=np.random.default_rng(2)
for p in [0.0001,0.001,0.003,0.01,0.03,0.1,0.3,1]:
  cs=[];ls=[]
  for r in range(6):
    G=nx.connected_watts_strogatz_graph(n,k,p,seed=int(R.integers(1e9)))
    cs.append(nx.average_clustering(G)); ls.append(nx.average_shortest_path_length(G))
  print("p",p,"C/C0",round(np.mean(cs)/C0,3),"L/L0",round(np.mean(ls)/L0,3),"C",round(np.mean(cs),3),"L",round(np.mean(ls),2))
print("ER n=1000 k=10: C ~",10/999,"L~",math.log(1000)/math.log(10))
