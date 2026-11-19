from common import *
from scipy import stats
G=nx.Graph()
for u,v,w in [("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Ko","Sz",1),("Ko","Kl",1),("La","Ön",3),("Po","La",2),("Po","Ön",2)]: G.add_edge(u,v)
b0=nx.betweenness_centrality(G,normalized=False); print("btw", b0)
for e in list(G.edges()):
    H=G.copy(); H.remove_edge(*e)
    if not nx.is_connected(H): print(e,"disconnects"); 
    b=nx.betweenness_centrality(H,normalized=False); top=max(b,key=b.get)
    print(e, {k:round(v,2) for k,v in b.items()}, "top",top, "rho %.3f"%stats.spearmanr([b0[k] for k in ACT],[b[k] for k in ACT])[0])
K=nx.Graph(); d=loadjs("mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","KARATE13"); K.add_nodes_from(range(34)); K.add_edges_from(map(tuple,d["edges"]))
R=np.random.default_rng(5)
def cents(H):
    return np.array([H.degree(v) for v in range(34)]), np.array([nx.betweenness_centrality(H)[v] for v in range(34)])
d0,b0=cents(K); top0=set(np.argsort(-b0)[:5]); print("top5 btw", sorted(top0), "top5 deg", sorted(np.argsort(-d0)[:5]))
E=list(K.edges())
for f in [0.05,0.1,0.2,0.3,0.5]:
    rd=[];rb=[];tb=[];t1=[]
    for _ in range(300):
        keep=[E[i] for i in R.permutation(len(E))[:round(len(E)*(1-f))]]
        H=nx.Graph(); H.add_nodes_from(range(34)); H.add_edges_from(keep)
        dd,bb=cents(H); rd.append(stats.spearmanr(d0,dd)[0]); rb.append(stats.spearmanr(b0,bb)[0])
        tb.append(len(top0&set(np.argsort(-bb)[:5]))/5); t1.append(np.argmax(bb)==np.argmax(b0))
    print("edges f=%.2f rho_deg %.3f rho_btw %.3f top5btw %.2f top1same %.2f"%(f,np.mean(rd),np.mean(rb),np.mean(tb),np.mean(t1)))
# node removal
for f in [0.1,0.2,0.3]:
    rd=[];rb=[]
    for _ in range(300):
        keepn=sorted(R.permutation(34)[:round(34*(1-f))]); H=K.subgraph(keepn)
        dd=np.array([H.degree(v) for v in keepn]); bc=nx.betweenness_centrality(H); bb=np.array([bc[v] for v in keepn])
        rd.append(stats.spearmanr(d0[keepn],dd)[0]); rb.append(stats.spearmanr(b0[keepn],bb)[0])
    print("nodes f=%.2f rho_deg %.3f rho_btw %.3f"%(f,np.nanmean(rd),np.nanmean(rb)))
