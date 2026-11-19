import networkx as nx, numpy as np, json
from networkx.algorithms.community import modularity
from sklearn.metrics import normalized_mutual_info_score as nmi, adjusted_rand_score as ari
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read(); d=json.loads(s[s.index("{"):s.rindex("}")+1]); club=d["club"]
G=nx.Graph(); G.add_nodes_from(range(34)); G.add_edges_from(map(tuple,d["edges"]))
k=np.array([G.degree(i) for i in range(34)]); A=nx.to_numpy_array(G,nodelist=range(34)); B=A-np.outer(k,k)/156; w,v=np.linalg.eigh(B); u=v[:,-1]
l=[int(x>0) for x in u]; print("modmat NMI",round(nmi(club,l),3),"ARI",round(ari(club,l),3), "Q",round(modularity(G,[{i for i in range(34) if l[i]==c} for c in (0,1)]),4))
L=np.diag(k)-A; w,v=np.linalg.eigh(L); f=[int(x>0) for x in v[:,1]]; print("fiedler NMI",round(nmi(club,f),3),"ARI",round(ari(club,f),3),"Q",round(modularity(G,[{i for i in range(34) if f[i]==c} for c in (0,1)]),4))
# frames gamma range weighted
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
H=nx.Graph(); H.add_weighted_edges_from(E); nodes=list(H)
def parts(s):
    if not s: yield []; return
    f=s[0]
    for p in parts(s[1:]):
        for i in range(len(p)): yield p[:i]+[[f]+p[i]]+p[i+1:]
        yield [[f]]+p
P=list(parts(nodes)); fr={frozenset(["Ko","Vi"]),frozenset(["Po","La","Ön"]),frozenset(["Sz","Kl"])}
prev=None
for g in np.arange(1.30,2.20,0.01):
    best=max(P,key=lambda p:modularity(H,[set(c) for c in p],weight="weight",resolution=g))
    isfr=set(map(frozenset,best))==fr
    if isfr!=prev: print(round(g,2),"frames" if isfr else sorted(map(sorted,best))); prev=isfr
