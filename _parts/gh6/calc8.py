import networkx as nx, itertools as it
G = nx.Graph([("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")])
for u,v in it.combinations(G,2):
    if not G.has_edge(u,v): print(u,v,sorted(nx.common_neighbors(G,u,v)))
print(nx.degree_assortativity_coefficient(nx.union(nx.complete_graph(5),nx.relabel_nodes(nx.complete_graph(2),{0:"a",1:"b"}))))
C4=nx.cycle_graph(4); print([ (u,v,len(list(nx.common_neighbors(C4,u,v)))) for u,v in C4.edges()], list(nx.bridges(C4)))
# STC example: 5 nodes A..E: A-B S, A-C S, B-C W, A-D W, C-E S, D-E S?, check violation
S={("A","B"):"S",("A","C"):"S",("B","C"):"W",("C","D"):"S",("D","E"):"W",("C","E"):"S"}
H=nx.Graph(); [H.add_edge(a,b,t=t) for (a,b),t in S.items()]
for v in H:
    st=[u for u in H[v] if H[v][u]["t"]=="S"]
    for x,y in it.combinations(st,2):
        if not H.has_edge(x,y): print("violation at",v,x,y)
