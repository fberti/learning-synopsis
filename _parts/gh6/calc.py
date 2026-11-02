import networkx as nx, json, re, itertools as it
from fractions import Fraction as F
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
print("triangles",nx.triangles(G))
print("clust",{k:round(v,3) for k,v in nx.clustering(G).items()})
print("avg",nx.average_clustering(G),"trans",nx.transitivity(G))
tri=[c for c in nx.enumerate_all_cliques(G) if len(c)==3]; print(tri)
# connected triples
print("triples",sum(d*(d-1)//2 for _,d in G.degree()))
# overlap
def ov(G,u,v):
    Nu=set(G[u])-{v}; Nv=set(G[v])-{u}
    un=Nu|Nv
    return len(Nu&Nv), len(un), (len(Nu&Nv)/len(un) if un else 0)
for u,v,w in E: print(u,v,w,ov(G,u,v))
# types
typ={"Ko":"I","Vi":"I","Po":"I","La":"C","Ön":"C","Sz":"T","Kl":"T"}
nx.set_node_attributes(G,typ,"t")
print("attr assort", nx.attribute_assortativity_coefficient(G,"t"))
mm=nx.attribute_mixing_matrix(G,"t",mapping={"I":0,"C":1,"T":2}); print(mm, mm.sum())
typ2={"Ko":"D","Vi":"D","Po":"D","Sz":"D","Kl":"D","La":"E","Ön":"E"}
nx.set_node_attributes(G,typ2,"t2"); print("2grp",nx.attribute_assortativity_coefficient(G,"t2"))
print("deg assort", nx.degree_assortativity_coefficient(G))
# karate
K=json.loads(re.search(r"=\s*(\{.*\})",open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read(),re.S).group(1)) if False else None
