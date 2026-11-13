import json,numpy as np,networkx as nx,math
s=open("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js",encoding="utf-8").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1]); E=d["edges"]; n=d["n"]
G=nx.Graph(); G.add_nodes_from(range(n))
for i in range(0,len(E),2):
  if E[i]!=E[i+1]: G.add_edge(E[i],E[i+1])
m=G.number_of_edges()
tr=[];ac=[]
for s_ in range(5):
  H=G.copy(); nx.double_edge_swap(H,nswap=10*m,max_tries=10**8,seed=s_)
  tr.append(nx.transitivity(H)); ac.append(nx.average_clustering(H))
print("polblogs config: trans",np.mean(tr),np.std(tr),"avgC",np.mean(ac))
tr=[];ac=[]
for s_ in range(5):
  H=nx.gnm_random_graph(n,m,seed=s_); tr.append(nx.transitivity(H)); ac.append(nx.average_clustering(H))
  if s_==0: print("ER L",nx.average_shortest_path_length(H) if nx.is_connected(H) else "disc")
print("polblogs ER: trans",np.mean(tr),"avgC",np.mean(ac))
k=np.array([d for _,d in G.degree()]); k1=k.mean(); k2=(k**2).mean()
print("config formula C",(k2-k1)**2/(n*k1**3))
# ring n=12 k=4 + shortcut
R=nx.watts_strogatz_graph(12,4,0); print("ring12 L",nx.average_shortest_path_length(R),"C",nx.average_clustering(R))
R.add_edge(0,6); print("+0-6 L",nx.average_shortest_path_length(R),"C",nx.average_clustering(R))
R=nx.watts_strogatz_graph(12,4,0); R.remove_edge(0,1); R.add_edge(0,6); print("rewire 0-1->0-6 L",nx.average_shortest_path_length(R),"C",nx.average_clustering(R))
# ring 8 distances
R=nx.watts_strogatz_graph(8,4,0); print("ring8 L",nx.average_shortest_path_length(R))
# BA
rng=np.random.default_rng(3)
mx=[];g=[]
for s_ in range(20):
  B=nx.barabasi_albert_graph(1000,2,seed=s_); dg=np.array([d for _,d in B.degree()]); mx.append(dg.max())
  if s_==0:
    import powerlaw
    f=powerlaw.Fit(dg,discrete=True,verbose=False); print("BA fit alpha",f.power_law.alpha,"xmin",f.power_law.xmin)
    print("BA C",nx.average_clustering(B),"L",nx.average_shortest_path_length(B),"pk2,3,4",[(dg==q).mean() for q in (2,3,4)])
print("BA max deg mean",np.mean(mx),"range",min(mx),max(mx))
mx=[]
for s_ in range(20):
  B=nx.gnm_random_graph(1000,1997,seed=s_); mx.append(max(d for _,d in B.degree()))
print("ER same max", np.mean(mx))
print("BA pk formula m=2",[2*2*3/(q*(q+1)*(q+2)) for q in (2,3,4,10,20)])
