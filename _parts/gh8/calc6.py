import networkx as nx, numpy as np, json
from networkx.algorithms.community import modularity, louvain_communities, girvan_newman, asyn_lpa_communities
from sklearn.metrics import normalized_mutual_info_score as nmi, adjusted_rand_score as ari
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1]); club=d["club"]
G=nx.Graph(); G.add_nodes_from(range(34)); G.add_edges_from(map(tuple,d["edges"]))
print("cut",sum(club[a]!=club[b] for a,b in G.edges()),"m",G.number_of_edges())
def lab(c):
    l=[0]*34
    for i,x in enumerate(c):
        for v in x: l[v]=i
    return l
for g in [0.5,1]:
    best=max((louvain_communities(G,seed=s,resolution=g) for s in range(50)),key=lambda c:modularity(G,c,resolution=g))
    print("gamma",g,[sorted(v+1 for v in x) for x in best], "Q1",round(modularity(G,best),4),"NMI",round(nmi(club,lab(best)),3),"ARI",round(ari(club,lab(best)),3))
# which nodes misclassified in gamma .5
gn2=next(girvan_newman(G)); l=lab(gn2); print("GN2 misfits",[i+1 for i in range(34) if (l[i]==l[0])!=(club[i]==club[0])])
L=nx.laplacian_matrix(G,nodelist=range(34)).toarray().astype(float); w,v=np.linalg.eigh(L); f=v[:,1]*np.sign(v[0,1])
print("Fiedler misfits",[i+1 for i in range(34) if (f[i]>0)!=(club[i]==club[0])])
k=np.array([G.degree(i) for i in range(34)]); A=nx.to_numpy_array(G,nodelist=range(34)); B=A-np.outer(k,k)/156; w,v=np.linalg.eigh(B); u=v[:,-1]*np.sign(v[0,-1])
print("modmat misfits",[i+1 for i in range(34) if (u[i]>0)!=(club[i]==club[0])])
lp=[]
for s in range(100):
    c=list(asyn_lpa_communities(G,seed=s)); lp.append((len(c),nmi(club,lab(c))))
print("LPA mean NMI",round(np.mean([x[1] for x in lp]),3))
# Les Mis
M=nx.les_miserables_graph()
best=max((louvain_communities(M,weight="weight",seed=s) for s in range(100)),key=lambda c:modularity(M,c,weight="weight"))
print("lesmis best",round(modularity(M,best,weight="weight"),4))
for x in sorted(best,key=len,reverse=True): print(len(x),sorted(x))
