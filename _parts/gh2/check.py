import itertools, networkx as nx, numpy as np
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
order=["Ko","Vi","Po","La","Ön","Sz","Kl"]
D=dict(nx.all_pairs_shortest_path_length(G))
print("dist matrix"); [print(u,[D[u][v] for v in order]) for u in order]
ecc=nx.eccentricity(G); print("ecc",ecc,"diam",nx.diameter(G),"radius",nx.radius(G),"center",nx.center(G))
print("avg path",nx.average_shortest_path_length(G))
print("BFS layers from Kl",[list(l) for l in nx.bfs_layers(G,["Kl"])])
print("cut vertices",list(nx.articulation_points(G)),"bridges",list(nx.bridges(G)))
H=G.copy(); H.remove_node("Po"); print("without Po comps",[sorted(c) for c in nx.connected_components(H)])
for u,v,d in G.edges(data=True): d["dist"]=1/d["weight"]
for s,t in [("Kl","La"),("Sz","Ön"),("Kl","Ön")]:
    print(s,t,nx.dijkstra_path(G,s,t,weight="dist"),nx.dijkstra_path_length(G,s,t,weight="dist"), "hops",nx.shortest_path(G,s,t))
T=nx.maximum_spanning_tree(G); print("max ST",sorted(T.edges(data="weight")),sum(w for *_,w in T.edges(data="weight")))
print("cyclomatic",G.number_of_edges()-G.number_of_nodes()+1)
print("ham path exists?", any(all(G.has_edge(p[i],p[i+1]) for i in range(6)) for p in itertools.permutations(order)))
print("ham cycle?", any(all(G.has_edge(p[i],p[(i+1)%7]) for i in range(7)) for p in itertools.permutations(order)))
A=nx.to_numpy_array(G,nodelist=order,weight=None).astype(int); A2=A@A; print("A2"); print(A2); print("tri",int(np.trace(A@A@A)/6), nx.triangles(G))
print("odd deg",[v for v,d in G.degree() if d%2])
# 2.1 example
F=nx.Graph([("A","B"),("A","C"),("B","C"),("B","D"),("C","D"),("D","E"),("E","F")])
print("A-F paths",list(nx.all_simple_paths(F,"A","F")))
print("cycles",nx.cycle_basis(F), [c for c in nx.simple_cycles(F.to_directed()) if len(c)>2][:0])
print("simple cycles undirected", list(nx.simple_cycles(F)))
AF=nx.to_numpy_array(F,nodelist="ABCDEF").astype(int); print("walks len3 A->D",np.linalg.matrix_power(AF,3)[0,3], "len2 A->D", (AF@AF)[0,3])
# friends graph
Fr=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); M=nx.to_numpy_array(Fr,nodelist="ABCD").astype(int)
print("friends A2",M@M,"A3",M@M@M)
