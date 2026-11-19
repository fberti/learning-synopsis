from common import *
rng=np.random.default_rng(7)
def kap(G):
    k=np.array([d for _,d in G.degree()],float); return k.mean(), (k**2).mean()/k.mean()-1
def outbreak(G,T,runs=200):
    # bond percolation: mean size of component of random seed /n, and P(large)
    n=G.number_of_nodes(); sizes=[]
    E=list(G.edges())
    for r in range(runs//20):
        keep=rng.random(len(E))<T; H=nx.Graph(); H.add_nodes_from(G); H.add_edges_from(e for e,kk in zip(E,keep) if kk)
        comp={}; 
        for c in nx.connected_components(H):
            for v in c: comp[v]=len(c)
        nodes=list(G)
        for s in rng.choice(len(nodes),20): sizes.append(comp[nodes[s]]/n)
    sizes=np.array(sizes); return round(sizes.mean(),3), round((sizes>0.05).mean(),3)
N=10000
G=nx.barabasi_albert_graph(N,2,seed=1)
f=0.1; q=int(f*N)
def rem(G,S): H=G.copy(); H.remove_nodes_from(S); return H
rnd=rng.choice(N,q,replace=False)
top=[v for v,_ in sorted(G.degree(),key=lambda x:-x[1])[:q]]
acq=set()
while len(acq)<q:
    v=int(rng.integers(N)); acq.add(int(rng.choice(list(G[v]))))
for name,S in [("none",[]),("random",rnd),("target",top),("acq",list(acq))]:
    H=rem(G,S); k1,ka=kap(H)
    print(name,"kappa",round(ka,2),"Tc",round(1/ka,3),"outbreak T=0.2",outbreak(H,0.2), "mean deg of chosen", round(np.mean([G.degree(v) for v in S]),2) if len(S) else "")
