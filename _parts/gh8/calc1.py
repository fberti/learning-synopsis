import networkx as nx, itertools
from networkx.algorithms.community import modularity, girvan_newman, louvain_communities, greedy_modularity_communities, label_propagation_communities
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
nodes=["Ko","Vi","Po","La","Ön","Sz","Kl"]
def partitions(s):
    if not s: yield []; return
    f=s[0]
    for p in partitions(s[1:]):
        for i in range(len(p)): yield p[:i]+[[f]+p[i]]+p[i+1:]
        yield [[f]]+p
for w in [None,"weight"]:
    res=[]
    for p in partitions(nodes):
        res.append((modularity(G,[set(c) for c in p],weight=w),p))
    res.sort(key=lambda x:-x[0])
    print("weight",w)
    for q,p in res[:8]: print(round(q,4),p)
    for p in [[["Ko","Vi"],["La","Ön","Po"],["Sz","Kl"]],[["Ko","Vi","Po"],["La","Ön"],["Sz","Kl"]],[["Ko","Vi","Sz","Kl"],["Po","La","Ön"]],[nodes],[[x] for x in nodes]]:
        print("  ",round(modularity(G,[set(c) for c in p],weight=w),4),p)
print(nx.edge_betweenness_centrality(G,normalized=False,weight=None))
H=nx.Graph(); H.add_edges_from([(a,b) for a,b,_ in E])
gn=girvan_newman(H)
for i,c in enumerate(gn):
    print("GN",i,[sorted(x) for x in c], round(modularity(H,c),4))
