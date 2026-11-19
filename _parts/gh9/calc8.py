from common import *
G,d=polblogs(); lean=d["lean"]; n=G.number_of_nodes()
rng=np.random.default_rng(11)
E=np.array(list(G.edges()))
def runs(p,R=400):
    res=[]
    for r in range(R//20):
        keep=rng.random(len(E))<p; H=nx.Graph(); H.add_nodes_from(G); H.add_edges_from(map(tuple,E[keep]))
        cc={}
        for c in nx.connected_components(H):
            for v in c: cc[v]=c
        for s in rng.choice(n,20):
            c=cc[int(s)]; L=[lean[v] for v in c]
            res.append((len(c), lean[int(s)], sum(1 for v in c if lean[v]!=lean[int(s)])))
    return res
for p in [0.005,0.01,0.0125,0.02,0.03,0.05]:
    r=runs(p); sz=np.array([x[0] for x in r])
    big=sz>50
    other=np.array([x[2]/x[0] for x in r])
    print(f"p {p}: mean size {sz.mean():.1f}, median {np.median(sz):.0f}, P(size1) {(sz==1).mean():.2f}, P(>50) {big.mean():.2f}, mean size of big {sz[big].mean() if big.any() else 0:.0f}, other-side share among big {other[big].mean() if big.any() else 0:.2f}")
print("lean share", np.mean(lean))
# within/between edges
cross=sum(1 for a,b in G.edges() if lean[a]!=lean[b]); print("cross edges",cross,G.number_of_edges(),cross/G.number_of_edges())
