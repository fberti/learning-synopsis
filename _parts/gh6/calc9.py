import networkx as nx
G=nx.Graph([("A","B"),("A","C"),("A","D"),("B","C"),("C","D")])
print(nx.clustering(G), nx.average_clustering(G), nx.transitivity(G), sorted(nx.common_neighbors(G,"B","D")))
H=nx.Graph()
i=0
def add(k,g1,g2):
    global i
    for _ in range(k):
        H.add_edge(f"n{i}",f"m{i}"); H.nodes[f"n{i}"]["g"]=g1; H.nodes[f"m{i}"]["g"]=g2; i+=1
add(10,"P","P"); add(6,"K","K"); add(4,"P","K")
print("r",nx.attribute_assortativity_coefficient(H,"g"))
