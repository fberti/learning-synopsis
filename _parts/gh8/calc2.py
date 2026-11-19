import networkx as nx, json, re, numpy as np, random
from networkx.algorithms.community import modularity, girvan_newman, louvain_communities, greedy_modularity_communities, label_propagation_communities, asyn_lpa_communities
from sklearn.metrics import normalized_mutual_info_score as nmi, adjusted_rand_score as ari
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1])
G=nx.Graph(); G.add_nodes_from(range(34)); G.add_edges_from(map(tuple,d["edges"]))
club=d["club"]
def lab(parts):
    l=[0]*34
    for i,c in enumerate(parts):
        for v in c: l[v]=i
    return l
real=[set(i for i in range(34) if club[i]==c) for c in (0,1)]
print("real Q",round(modularity(G,real),4), "sizes",[len(c) for c in real])
# two triangles bridge
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)])
print("2tri Q",modularity(T,[{1,2,3},{4,5,6}]), modularity(T,[{1,2,3,4,5,6}]), modularity(T,[{1,2},{3,4},{5,6}]), modularity(T,[{1,2,3,4},{5,6}]))
# GN
gn=girvan_newman(G); best=None
for i,c in enumerate(gn):
    q=modularity(G,c)
    if i<6: print("GN",i+2,round(q,4),[len(x) for x in c])
    if best is None or q>best[0]: best=(q,len(c),c)
    if i>12: break
print("GN best",round(best[0],4),best[1])
gn2=next(girvan_newman(G)); print("GN2", [sorted(x) for x in gn2], "NMI",round(nmi(club,lab(gn2)),3),"ARI",round(ari(club,lab(gn2)),3))
eb=nx.edge_betweenness_centrality(G,normalized=False); top=sorted(eb.items(),key=lambda x:-x[1])[:5]; print("top EB",top)
# Louvain over seeds
qs=[];ks=[]
for sd in range(100):
    c=louvain_communities(G,seed=sd); qs.append(modularity(G,c)); ks.append(len(c))
print("Louvain Q range",round(min(qs),4),round(max(qs),4),"k",sorted(set(ks)), "mean",round(np.mean(qs),4))
c=louvain_communities(G,seed=1); print("Louvain s1",[sorted(x) for x in c], round(modularity(G,c),4), "NMI vs club",round(nmi(club,lab(c)),3), "ARI",round(ari(club,lab(c)),3))
for g in [0.5,1,2]:
    c=louvain_communities(G,seed=1,resolution=g); print("res",g,len(c),[len(x) for x in c], round(modularity(G,c,resolution=g),4))
c=greedy_modularity_communities(G); print("CNM",[len(x) for x in c],round(modularity(G,c),4))
# LPA
ks=[];
for sd in range(100):
    c=list(asyn_lpa_communities(G,seed=sd)); ks.append(len(c))
from collections import Counter; print("LPA k counts",Counter(ks))
# spectral fiedler
L=nx.laplacian_matrix(G).toarray().astype(float); w,v=np.linalg.eigh(L); f=v[:,1]
sp=[set(i for i in range(34) if f[i]<0),set(i for i in range(34) if f[i]>=0)]
print("Fiedler sign",[len(x) for x in sp],round(modularity(G,sp),4),"mismatch",sum(1 for i in range(34) if (f[i]<0)!=(club[i]==club[0])) , sum(1 for i in range(34) if (f[i]<0)==(club[i]==club[0])))
# modularity matrix leading eigvec
k=np.array([d for _,d in sorted(G.degree())]); A=nx.to_numpy_array(G,nodelist=range(34)); m=G.number_of_edges()
B=A-np.outer(k,k)/(2*m); w,v=np.linalg.eigh(B); u=v[:,-1]
sp2=[set(i for i in range(34) if u[i]<0),set(i for i in range(34) if u[i]>=0)]
print("Newman leading eig",[len(x) for x in sp2],round(modularity(G,sp2),4), "agree", max(sum((u[i]<0)==(club[i]==0) for i in range(34)),sum((u[i]<0)!=(club[i]==0) for i in range(34))))
