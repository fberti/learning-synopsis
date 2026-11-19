import networkx as nx, numpy as np
from networkx.algorithms.community import modularity, louvain_communities
G=nx.les_miserables_graph()
print(G.number_of_nodes(),G.number_of_edges(), sum(d for *_,d in G.edges(data="weight")))
deg=sorted(G.degree(),key=lambda x:-x[1])[:6]; print(deg)
from collections import Counter
for w in [None,"weight"]:
    res=[]
    for s in range(50):
        c=louvain_communities(G,weight=w,seed=s); res.append((round(modularity(G,c,weight=w),4),len(c)))
    print(w,Counter(res).most_common(6))
c=max((louvain_communities(G,weight="weight",seed=s) for s in range(50)),key=lambda c:modularity(G,c,weight="weight"))
for x in sorted(c,key=len,reverse=True): print(len(x),sorted(x)[:12])
bt=nx.betweenness_centrality(G); print(sorted(bt.items(),key=lambda x:-x[1])[:4])
