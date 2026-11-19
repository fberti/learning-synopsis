from common import *
d=loadjs("mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","KARATE13")
K=nx.Graph(); K.add_nodes_from(range(34)); K.add_edges_from(map(tuple,d["edges"]))
deg=dict(K.degree()); print(sorted(deg.items(),key=lambda x:-x[1])[:3])
R=np.random.default_rng(9); E=list(K.edges())
for f in [0.05,0.1,0.2]:
    same=0
    for _ in range(1000):
        keep=[E[i] for i in R.permutation(len(E))[:round(len(E)*(1-f))]]; H=nx.Graph(); H.add_nodes_from(range(34)); H.add_edges_from(keep)
        dd=dict(H.degree()); m=max(dd.values()); tops=[v for v in dd if dd[v]==m]; same+= (tops==[33])
    print(f, same/1000)
