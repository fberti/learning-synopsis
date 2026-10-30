import itertools, networkx as nx
from fractions import Fraction as Fr
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
print("== 2.1")
F=nx.Graph([("A","B"),("A","C"),("B","C"),("B","D"),("C","D"),("D","E"),("E","F")])
def kind(H,s):
    ed=list(zip(s,s[1:]))
    if not all(H.has_edge(*e) for e in ed): return "nem séta"
    fe=[frozenset(e) for e in ed]
    closed=s[0]==s[-1]
    if closed and len(s)-1>=3 and len(set(s[:-1]))==len(s)-1: return "kör"
    if len(set(s))==len(s): return "út"
    if len(set(fe))==len(fe): return "vonal, nem út"
    return "séta, nem vonal"
for s in ["ACDEF","CABDCB","ABAC","BCDB","ADE"]: print(s,kind(F,list(s)))
s="ABCDBCDEF"; print("len",len(s)-1,"verts",len(s),"distinct v",len(set(s)),"distinct e",len({frozenset(e) for e in zip(s,s[1:])}),"dist A-F",nx.shortest_path_length(F,"A","F"))
K4=nx.complete_graph("ABCD"); print("K4 paths A-D",len(list(nx.all_simple_paths(K4,"A","D"))), "len<=2",len([p for p in nx.all_simple_paths(K4,"A","D") if len(p)<=3]))
Q=nx.Graph([("A","B"),("B","C"),("C","D"),("D","A"),("A","C")]); print("square+diag cycles",list(nx.simple_cycles(Q)))
print("== 2.2")
H=nx.Graph(); H.add_nodes_from(range(1,9)); H.add_edges_from([(1,2),(2,3),(1,3),(3,4),(5,6)])
print("comps",nx.number_connected_components(H),"nonisolated",sum(1 for c in nx.connected_components(H) if len(c)>1),"n-m",8-5)
EK=nx.Graph(); EK.add_nodes_from(G); EK.add_edges_from([("Sz","Vi"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko")]); print("EK only comps",[sorted(c) for c in nx.connected_components(EK)])
W=nx.Graph([("A",x) for x in "BCDEG"]+[("B","C"),("C","D"),("D","E"),("E","G"),("G","B"),("B","F")])
print("wheel deg",dict(W.degree()),"cut",list(nx.articulation_points(W)),"bridges",list(nx.bridges(W)))
print("cut Arviz",list(nx.articulation_points(G)),"deg",dict(G.degree()),"bridges",list(nx.bridges(G)))
print("max edges 7 v 2 comps", {(a,7-a):a*(a-1)//2+(7-a)*(6-a)//2 for a in range(1,4)}, "K7",21)
# 9 vertices 8 edges: connected example (path) and disconnected example (K4+... )
D=nx.Graph(); D.add_nodes_from(range(9)); D.add_edges_from(list(itertools.combinations(range(5),2))[:8]); print("9v8e disconnected example comps",nx.number_connected_components(D), D.number_of_edges())
print("== 2.3")
T=nx.Graph([("A","B"),("A","C"),("B","D"),("C","E"),("D","E"),("E","F")])
print("layers",[sorted(l) for l in nx.bfs_layers(T,["A"])],"dist A-F",nx.shortest_path_length(T,"A","F"),"paths",list(nx.all_simple_paths(T,"A","F")))
Tr=nx.Graph([("A","B"),("B","C"),("C","D"),("C","E")]); print("tree ecc",nx.eccentricity(Tr),"center",nx.center(Tr),"diam",nx.diameter(Tr),"rad",nx.radius(Tr),"deg",dict(Tr.degree()))
S=nx.star_graph(4); print("K14 avg",nx.average_shortest_path_length(S),"diam",nx.diameter(S))
print("Arviz diam",nx.diameter(G),"rad",nx.radius(G),"center",nx.center(G),"avg",nx.average_shortest_path_length(G), Fr(sum(d for u,dd in nx.all_pairs_shortest_path_length(G) for v,d in dd.items())//2,21))
U=nx.Graph([("A","B"),("B","C"),("D","E")]); print("P3+K2 connected?",nx.is_connected(U),"comp diams",[nx.diameter(U.subgraph(c)) for c in nx.connected_components(U)])
# BFS with stack (DFS) from A in T: distances along DFS tree
print("dfs tree from A",list(nx.dfs_edges(T,"A")))
print("== 2.4")
C=nx.Graph(); C.add_weighted_edges_from([("Sze","Hmv",25),("Sze","Mak",33),("Hmv","Mak",30),("Sze","Kis",30),("Kis","Csg",36),("Hmv","Csg",37)])
print("Dijkstra Sze",nx.single_source_dijkstra_path_length(C,"Sze"))
C2=C.copy(); C2.remove_edge("Kis","Csg"); print("Kis-Csg closed: dist Kis-Csg",nx.dijkstra_path_length(C2,"Kis","Csg"),nx.dijkstra_path(C2,"Kis","Csg"),"alt via Mak",30+33+30+37)
X=nx.Graph(); X.add_weighted_edges_from([("s","a",4),("s","b",1),("b","a",2),("a","t",1),("b","t",5)])
print("small",nx.dijkstra_path(X,"s","t"),nx.dijkstra_path_length(X,"s","t"),"hop-shortest paths",[ (p,nx.path_weight(X,p,"weight")) for p in nx.all_simple_paths(X,"s","t")])
Y=nx.Graph(); Y.add_weighted_edges_from([("A","B",4),("B","C",4),("A","C",1)])
for u,v,d in Y.edges(data=True): d["l"]=Fr(1,d["weight"])
print("strength ABC",nx.dijkstra_path(Y,"A","C",weight="l"),nx.dijkstra_path_length(Y,"A","C",weight="l"),"raw",nx.dijkstra_path(Y,"A","C"),"1/(4+4)",Fr(1,8))
for u,v,d in G.edges(data=True): d["l"]=Fr(1,d["weight"])
print("Sz-Ön 1/w",nx.dijkstra_path_length(G,"Sz","Ön",weight="l"),[ (p,nx.path_weight(G,p,"l")) for p in nx.all_simple_paths(G,"Sz","Ön") if len(p)<=5])
print("Sz-Ön raw",nx.dijkstra_path_length(G,"Sz","Ön",weight="weight"),"hops",nx.shortest_path_length(G,"Sz","Ön"))
print("Kl-La 1/w",nx.dijkstra_path_length(G,"Kl","La",weight="l"),sorted(set(nx.path_weight(G,p,"l") for p in nx.all_simple_paths(G,"Kl","La"))))
AD=nx.Graph(); AD.add_weighted_edges_from([("A","B",3),("B","C",3),("C","D",3),("A","D",10)]); print("A-D",nx.dijkstra_path_length(AD,"A","D"),nx.shortest_path_length(AD,"A","D"))
H2=G.copy(); H2.remove_node("Ko"); print("without Ko connected",nx.is_connected(H2))
K5=nx.Graph(); K5.add_nodes_from(range(9)); K5.add_edges_from(list(itertools.combinations(range(5),2))[:8]); print("K5-2 + 4 iso:",K5.number_of_nodes(),K5.number_of_edges(),nx.is_connected(K5))
