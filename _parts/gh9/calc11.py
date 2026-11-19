from common import *
rng=np.random.default_rng(1)
G=nx.watts_strogatz_graph(1000,4,0,seed=1); E=np.array(list(G.edges()))
sz=[]
for r in range(40):
    keep=rng.random(len(E))<0.5; H=nx.Graph(); H.add_nodes_from(G); H.add_edges_from(map(tuple,E[keep]))
    cc={v:len(c) for c in nx.connected_components(H) for v in c}; sz+=[cc[int(s)] for s in rng.choice(1000,25)]
print("ring T=.5 mean",np.mean(sz)/1000, "max",max(sz))
