import networkx as nx
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
G=nx.Graph(E); G.remove_edge("Kl","Ko"); print(nx.betweenness_centrality(G,normalized=False))
print(nx.pagerank(nx.DiGraph([("A","B"),("B","C"),("C","D")])))
B=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); print(nx.betweenness_centrality(B,normalized=False), nx.closeness_centrality(B))
print(nx.betweenness_centrality(nx.path_graph(7))[3])
