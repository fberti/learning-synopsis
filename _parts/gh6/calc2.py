import networkx as nx, json, re, itertools as it, numpy as np, random
def load(path,var):
    s=open(path,encoding="utf-8").read(); s=s[s.index(var+" = ")+len(var)+3:]; s=s[:s.rindex("}")+1]; return json.loads(s)
K=load("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","window.KARATE13")
KG=nx.Graph(); KG.add_edges_from(map(tuple,K["edges"]))
for i,c in enumerate(K["club"]): KG.nodes[i]["club"]=c
print("karate n m",KG.number_of_nodes(),KG.number_of_edges(),"avgC",round(nx.average_clustering(KG),3),"trans",round(nx.transitivity(KG),3),
 "tri",sum(nx.triangles(KG).values())//3,"degassort",round(nx.degree_assortativity_coefficient(KG),3),"club r",round(nx.attribute_assortativity_coefficient(KG,"club"),3))
cr=sum(1 for u,v in KG.edges() if K["club"][u]!=K["club"][v]); print("karate cross edges",cr)
print("karate C of 0, 33:",round(nx.clustering(KG,0),3),round(nx.clustering(KG,33),3),KG.degree(0),KG.degree(33))
P=load("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js","window.POLBLOGS")
print(P.keys())
e=P["edges"]; D=nx.DiGraph(); D.add_nodes_from(range(P["n"])); D.add_edges_from((e[i],e[i+1]) for i in range(0,len(e),2))
for i,l in enumerate(P["lean"]): D.nodes[i]["lean"]=l
U=nx.Graph(D)
print("polblogs dir m",D.number_of_edges(),"undirected m",U.number_of_edges())
print("lean r dir",round(nx.attribute_assortativity_coefficient(D,"lean"),3),"undir",round(nx.attribute_assortativity_coefficient(U,"lean"),3))
cross=sum(1 for u,v in U.edges() if P["lean"][u]!=P["lean"][v]); print("undir cross",cross,cross/U.number_of_edges())
crossd=sum(1 for u,v in D.edges() if P["lean"][u]!=P["lean"][v]); print("dir cross",crossd,crossd/D.number_of_edges())
print("deg assort undir",round(nx.degree_assortativity_coefficient(U),3))
print("avgC",round(nx.average_clustering(U),3),"trans",round(nx.transitivity(U),3),"tri",sum(nx.triangles(U).values())//3)
mm=nx.attribute_mixing_matrix(U,"lean"); print(mm)
a=mm.sum(1); print("a",a, "sum a2",(a**2).sum(), "eii",np.trace(mm))
# reciprocity
print("reciprocity",round(nx.reciprocity(D),3))
