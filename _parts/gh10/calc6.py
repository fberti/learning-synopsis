from common import *
from networkx.algorithms.community import louvain_communities
from sklearn.metrics import normalized_mutual_info_score as nmi
def disparity_alpha(G):
    a={}
    for u,v,d in G.edges(data=True):
        w=d["weight"]; out=[]
        for x in (u,v):
            k=G.degree(x); s=G.degree(x,weight="weight"); out.append((1-w/s)**(k-1) if k>1 else 1.0)
        a[(u,v)]=min(out)
    return a
def make(seed, n=40, K=4, sig=1.0, c=0.08, boost=6):
    R=np.random.default_rng(seed); s=np.exp(R.normal(0,sig,n)); g=np.repeat(range(K),n//K)
    G=nx.Graph(); G.add_nodes_from(range(n))
    for i in range(n):
        for j in range(i+1,n):
            lam=c*s[i]*s[j]*(boost if g[i]==g[j] else 1); w=R.poisson(lam)
            if w>0: G.add_edge(i,j,weight=int(w))
    return G,g,s
def evalH(H,g,n):
    nodes=sorted(H.nodes()); 
    if not nodes: return 0,0,0
    comms=louvain_communities(H,weight=None,seed=1); lab={v:i for i,c in enumerate(comms) for v in c}
    # NMI over all n nodes: isolated nodes get own label
    L=[lab.get(v, 1000+v) for v in range(n)]
    return len(nodes), nx.number_connected_components(H), nmi(g,L)
for seed in [1,2,3]:
    G,g,s=make(seed); n=G.number_of_nodes()
    a=disparity_alpha(G)
    print("seed",seed,"edges",G.number_of_edges(),"density %.2f"%(2*G.number_of_edges()/n/(n-1)))
    for al in [0.05,0.1,0.2]:
        keep=[e for e,v in a.items() if v<al]; H=G.edge_subgraph(keep).copy()
        W=sorted((d["weight"] for *_,d in G.edges(data=True)),reverse=True); thr=W[len(keep)-1]
        H2=G.edge_subgraph([(u,v) for u,v,d in G.edges(data=True) if d["weight"]>=thr]).copy()
        print(" alpha",al,"keep",len(keep),"disp nodes/comps/nmi",evalH(H,g,n),"| thr",thr,len(H2.edges()),"glob",evalH(H2,g,n))
    print(" full nmi", evalH(nx.Graph(G.edges()),g,n), "weighted louvain", nmi(g,[ {v:i for i,c in enumerate(louvain_communities(G,weight='weight',seed=1)) for v in c}[v] for v in range(n)]))
