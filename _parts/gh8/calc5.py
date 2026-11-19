import networkx as nx, numpy as np, math, random, itertools, json
from networkx.algorithms.community import modularity, louvain_communities, asyn_lpa_communities, k_clique_communities
from sklearn.metrics import normalized_mutual_info_score as nmi, adjusted_rand_score as ari
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)])
print("EB two tri",nx.edge_betweenness_centrality(T,normalized=False))
print("singletons Q",modularity(T,[{i} for i in T]))
m=7
def dq(kin,tot,ki): return kin/m - tot*ki/(2*m*m)
print("node1 ->{2}",dq(1,2,2),"->{3}",dq(1,3,2))
print("node3 ->{1,2}",dq(2,4,3),"->{4}",dq(1,3,3))
# Bell numbers
B=[1]
for n in range(40):
    row=[B[-1]] if n==0 else None
def bell(n):
    a=[[1]]
    for i in range(1,n+1):
        r=[a[-1][-1]]
        for x in a[-1]: r.append(r[-1]+x)
        a.append(r)
    return a[n][0]
print("Bell",[bell(i) for i in range(1,8)], "Bell34 %.3g"%bell(34))
# LPA on two triangles
from collections import Counter
c=Counter(len(list(asyn_lpa_communities(T,seed=s))) for s in range(1000)); print("LPA two tri",c)
# modularity matrix two triangles
A=nx.to_numpy_array(T,nodelist=[1,2,3,4,5,6]); k=A.sum(1); Bm=A-np.outer(k,k)/(2*m)
s=np.array([1,1,1,-1,-1,-1]); print("sBs/4m",s@Bm@s/(4*m))
w,v=np.linalg.eigh(Bm); print("B lead",np.round(w[-1],4),np.round(v[:,-1],3))
L=np.diag(k)-A; w,v=np.linalg.eigh(L); print("Fiedler",np.round(w[1],4),np.round(v[:,1],3))
# star, K33
S=nx.star_graph(4); print("star sides Q",modularity(S,[{0},{1,2,3,4}]))
K=nx.complete_bipartite_graph(3,3); print("K33 sides Q",modularity(K,[{0,1,2},{3,4,5}]))
# SBM ML two triangles
print("p_in",6/6,"p_out",1/9)
# detectability
c=6; d=2*math.sqrt(c); cin=c+d/2; cout=c-d/2; print("detect cin",cin,"cout",cout,"eps",cout/cin)
# NMI hand
a=[0,0,0,1,1,1]; b=[0,0,1,1,1,1]
Ha=math.log(2); Hb=-(2/6*math.log(2/6)+4/6*math.log(4/6))
from sklearn.metrics import mutual_info_score; I=mutual_info_score(a,b); print("Ha",Ha,"Hb",Hb,"I",I,"NMI",I/((Ha+Hb)/2))
print("rand singletons",sum(((a[i]==a[j])==(i==j)) for i,j in itertools.combinations(range(6),2)))
# Arvizhet: CPM and gamma scan
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
print("triangles",[c for c in nx.enumerate_all_cliques(G) if len(c)==3])
print("CPM k=3",[sorted(c) for c in k_clique_communities(G,3)])
nodes=["Ko","Vi","Po","La","Ön","Sz","Kl"]
def partitions(s):
    if not s: yield []; return
    f=s[0]
    for p in partitions(s[1:]):
        for i in range(len(p)): yield p[:i]+[[f]+p[i]]+p[i+1:]
        yield [[f]]+p
P=list(partitions(nodes))
for w in [None,"weight"]:
    for g in [0.5,0.8,1,1.2,1.4,1.5,1.6,1.8,2,2.5]:
        best=max(P,key=lambda p:modularity(G,[set(c) for c in p],weight=w,resolution=g))
        print(w,g,round(modularity(G,[set(c) for c in best],weight=w,resolution=g),4),sorted(map(sorted,best)))
