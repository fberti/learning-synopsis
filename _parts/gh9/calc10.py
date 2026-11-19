from common import *
rng=np.random.default_rng(2)
N=1000
nets={"racs":nx.watts_strogatz_graph(N,4,0,seed=1),"kisvilag":nx.watts_strogatz_graph(N,4,0.1,seed=1),"ER":nx.gnm_random_graph(N,2*N,seed=1),"BA":nx.barabasi_albert_graph(N,2,seed=1)}
for name,G in nets.items():
    k=np.array([d for _,d in G.degree()]); kap=(k**2).mean()/k.mean()-1
    E=np.array(list(G.edges()))
    line=[]
    for p in [0.15,0.25,0.35]:
        sz=[]
        for r in range(25):
            keep=rng.random(len(E))<p; H=nx.Graph(); H.add_nodes_from(G); H.add_edges_from(map(tuple,E[keep]))
            cc={v:len(c) for c in nx.connected_components(H) for v in c}
            sz+= [cc[int(s)] for s in rng.choice(N,40)]
        sz=np.array(sz); line.append(f"p={p}: P(>100) {(sz>100).mean():.2f} mean {sz.mean():.0f} median {np.median(sz):.0f}")
    print(name, "kappa",round(kap,2),"Tc",round(1/kap,3),"|"," | ".join(line))
