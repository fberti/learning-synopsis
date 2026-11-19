import networkx as nx, numpy as np, random
from networkx.algorithms.community import modularity, louvain_communities
from sklearn.metrics import normalized_mutual_info_score as nmi, adjusted_rand_score as ari
def ring(nc,l):
    G=nx.Graph()
    for c in range(nc):
        G.add_edges_from((c*l+i,c*l+j) for i in range(l) for j in range(i+1,l))
        G.add_edge(c*l+l-1, ((c+1)%nc)*l)
    return G
for nc,l in [(10,3),(8,3),(6,3),(30,5),(20,5),(24,5)]:
    G=ring(nc,l); m=G.number_of_edges()
    sing=[set(range(c*l,c*l+l)) for c in range(nc)]
    pairs=[set(range(c*l,c*l+2*l)) for c in range(0,nc,2)] if nc%2==0 else None
    print(nc,l,"m",m,"Q single",round(modularity(G,sing),4),"Q pairs",round(modularity(G,pairs),4) if pairs else None,"louvain k",len(louvain_communities(G,seed=0)))
# G(34,78) max modularity via louvain best of seeds
R=random.Random(1); qs=[]
for t in range(200):
    G=nx.gnm_random_graph(34,78,seed=t)
    best=max(modularity(G,louvain_communities(G,seed=s)) for s in range(5))
    qs.append(best)
print("G(34,78) Louvain Q mean",round(np.mean(qs),3),"sd",round(np.std(qs),3),"min",round(min(qs),3),"max",round(max(qs),3), "frac>=0.38", np.mean(np.array(qs)>=0.38), ">=0.4198",np.mean(np.array(qs)>=0.4198))
# degree-preserving null for karate
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read()
import json; d=json.loads(s[s.index("{"):s.rindex("}")+1])
K=nx.Graph(); K.add_edges_from(map(tuple,d["edges"]))
qs=[]
for t in range(200):
    H=K.copy(); nx.double_edge_swap(H,nswap=780,max_tries=100000,seed=t)
    qs.append(max(modularity(H,louvain_communities(H,seed=s)) for s in range(5)))
print("karate deg-pres null Q mean",round(np.mean(qs),3),"sd",round(np.std(qs),3),"max",round(max(qs),3), "z",round((0.4198-np.mean(qs))/np.std(qs),2))
# NMI/ARI 6 nodes
a=[0,0,0,1,1,1]; b=[0,0,1,1,1,1]
print("one slip NMI",round(nmi(a,b),4),"ARI",round(ari(a,b),4))
c=[1,1,1,0,0,0]; print("relabel NMI",nmi(a,c),"ARI",ari(a,c))
e=[0,0,1,1,2,2]; print("3 groups NMI",round(nmi(a,e),4),"ARI",round(ari(a,e),4))
f=[0,1,2,3,4,5]; print("singletons NMI",round(nmi(a,f),4),"ARI",round(ari(a,f),4))
g=[0,0,0,0,0,0]; print("one NMI",round(nmi(a,g),4),"ARI",round(ari(a,g),4))
# pair counting for one slip: Rand index
import itertools
def rand(a,b):
    agree=sum(((a[i]==a[j])==(b[i]==b[j])) for i,j in itertools.combinations(range(len(a)),2)); return agree, len(list(itertools.combinations(range(len(a)),2)))
print("rand",rand(a,b))
