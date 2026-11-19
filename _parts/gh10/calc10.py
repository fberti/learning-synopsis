from common import *
from networkx.algorithms.community import louvain_communities
from sklearn.metrics import normalized_mutual_info_score as nmi
L=nx.les_miserables_graph(); names=list(L.nodes())
def part(t,g,seed=1,weighted=True):
    H=nx.Graph(); H.add_nodes_from(names); H.add_weighted_edges_from((u,v,w) for u,v,w in L.edges(data="weight") if w>=t)
    cs=louvain_communities(H,weight="weight" if weighted else None,resolution=g,seed=seed)
    lab={v:i for i,c in enumerate(cs) for v in c}; return [lab[v] for v in names], sum(1 for c in cs if len(c)>1)
base,_=part(1,1)
for t in [1,2,3,5]:
    row=[]
    for g in [0.5,1,1.5,2]:
        lab,k=part(t,g); row.append("%d/%.2f"%(k,nmi(base,lab)))
    print("t",t,row)
# seed variability at t=1 g=1
ks=[];ns=[]
for s in range(20):
    lab,k=part(1,1,seed=s); ks.append(k); ns.append(nmi(base,lab))
print("seeds k",sorted(set(ks)),"nmi min %.2f mean %.2f"%(min(ns),np.mean(ns)))
