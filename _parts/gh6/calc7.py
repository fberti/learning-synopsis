import networkx as nx
D=nx.DiGraph([("EK","RH"),("NY","EK"),("VN","RH"),("VN","NY")])
print({k:v for k,v in nx.triadic_census(D).items() if v})
D2=D.copy(); D2.add_edge("NY","RH"); print({k:v for k,v in nx.triadic_census(D2).items() if v})
C=nx.DiGraph([(3,2),(4,1),(5,2),(5,4),(6,5),(8,7),(9,5),(9,8),(10,1),(11,7),(11,10),(12,8)])
print("art cit", {k:v for k,v in nx.triadic_census(C).items() if v})
# snippet checks
G = nx.Graph([("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")])
print(nx.triangles(G)); print(nx.clustering(G)["Po"]); print(nx.average_clustering(G), nx.transitivity(G))
nx.set_node_attributes(G, {v: ("civil" if v in ("La","Ön") else "egyéb") for v in G}, "tipus")
print(nx.attribute_assortativity_coefficient(G, "tipus"), nx.degree_assortativity_coefficient(G))
from math import comb
print(comb(7,3)*10*9*8/(21*20*19), comb(7,3)*(10/21)**3)
