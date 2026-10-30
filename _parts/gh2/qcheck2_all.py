import itertools, math, networkx as nx, numpy as np

def say(*a): print(*a)

# ---------- Árvízhét
E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Sz","Ko",1),("Kl","Ko",1),("La","Ön",3),("La","Po",2),("Po","Ön",2)]
G=nx.Graph(); G.add_weighted_edges_from(E)
order=["Ko","Vi","Po","La","Ön","Sz","Kl"]
say("deg",dict(G.degree()))

# 2.8 removal table
for rem in order:
    H=G.copy(); H.remove_node(rem)
    c=nx.number_connected_components(H)
    if c==1: say("without",rem,"c",c,"diam",nx.diameter(H),"avg",round(nx.average_shortest_path_length(H),4))
    else: say("without",rem,"c",c)
# 2.8 papers table
arts={1:("RH",["Ko","Vi"]),2:("RH",["Ko","Vi","Po"]),3:("RH",["Ko","Po"]),4:("EK",["Vi","Sz"]),5:("EK",["Sz","Kl","Ko"]),6:("EK",["Sz","Kl"]),
      7:("NY",["La","Ön"]),8:("NY",["La","Po","Ön"]),9:("NY",["La","Ön"]),10:("VN",["Po","Vi"]),11:("VN",["Po","La"]),12:("VN",["Ön","Po"])}
def pg(ps):
    H=nx.Graph(); H.add_nodes_from(order)
    for p,m in arts.values():
        if p in ps: H.add_edges_from(itertools.combinations(m,2))
    return H
for k in (1,2,3):
    for ps in itertools.combinations(["RH","EK","NY","VN"],k):
        H=pg(ps); comps=sorted(nx.connected_components(H),key=len,reverse=True)
        big=H.subgraph(comps[0])
        say("papers",ps,"comps",len(comps),"largest",len(comps[0]),"diam largest",nx.diameter(big))
H=pg(("EK","VN")); say("EK+VN edges",sorted(H.edges()))
# RH+NY disconnected -> diameter inf
say("RH+NY connected?",nx.is_connected(pg(("RH","NY"))))

# dist 3 pairs
D=dict(nx.all_pairs_shortest_path_length(G))
say("dist3 pairs",[(u,v) for u,v in itertools.combinations(order,2) if D[u][v]==3])
say("dist Kl-Vi",D["Kl"]["Vi"],"Ko-La",D["Ko"]["La"],"Sz-Po",D["Sz"]["Po"])
H=G.copy(); H.remove_node("Ko"); say("noKo Kl-La",nx.shortest_path_length(H,"Kl","La"))

# ---------- 2.5
say("forest 20 nodes 3 trees edges",20-3)
# tree: 3 vertices deg 4, rest leaves
for l in range(0,30):
    n=3+l; m=n-1
    if 3*4+l==2*m: say("leaves (3 x deg4)",l)
# Kruskal example
K=nx.Graph(); K.add_weighted_edges_from([("a","b",1),("b","c",3),("a","c",2),("c","d",2),("b","d",5),("d","e",4),("c","e",6)])
T=nx.minimum_spanning_tree(K); say("MST",sorted(T.edges(data="weight")),T.size(weight="weight"))
say("4 smallest edges sum",sum(sorted(w for *_,w in K.edges(data="weight"))[:4]))
Tm=nx.maximum_spanning_tree(K); say("maxST",Tm.size(weight="weight"))
say("all edges sum",K.size(weight="weight"))
# Árvízhét remove edges
say("edges to remove",G.number_of_edges()-G.number_of_nodes()+1)
# settlements
S=nx.Graph(); S.add_weighted_edges_from([("Sze","Hmv",25),("Sze","Mak",33),("Hmv","Mak",30),("Sze","Kis",30),("Kis","Csg",36),("Hmv","Csg",37)])
ST=nx.minimum_spanning_tree(S); say("settle MST",ST.size(weight="weight"),"Sze-Csg in tree",nx.shortest_path_length(ST,"Sze","Csg",weight="weight"),"in G",nx.shortest_path_length(S,"Sze","Csg",weight="weight"))
# rooted tree root 4 children each 3
say("rooted 4x3",4+4*3)

# ---------- 2.6
Q=nx.MultiGraph([("A","B"),("B","C"),("C","D"),("D","A"),("A","C")]); say("Q deg",dict(Q.degree()),"euler path?",nx.has_eulerian_path(Q),"circuit?",nx.is_eulerian(Q))
for name,g in [("K5",nx.complete_graph(5)),("K4",nx.complete_graph(4)),("C6",nx.cycle_graph(6)),("P5",nx.path_graph(5)),("2tri",nx.disjoint_union(nx.cycle_graph(3),nx.cycle_graph(3)))]:
    say(name,"eulerian circuit",nx.is_eulerian(g))
say("Arvizhet euler path",nx.has_eulerian_path(G),"circuit",nx.is_eulerian(G))
# 8 vertices min degree 4 -> Dirac ok; check example graph e.g. K_{4,4}
def ham_cycle(g):
    nodes=list(g.nodes()); f=nodes[0]
    for p in itertools.permutations(nodes[1:]):
        c=[f,*p]
        if all(g.has_edge(c[i],c[(i+1)%len(c)]) for i in range(len(c))): return True
    return False
say("C6 ham",ham_cycle(nx.cycle_graph(6)),"Arvizhet ham",ham_cycle(G))
# bowtie
B=nx.Graph([("A","B"),("B","C"),("C","A"),("C","D"),("D","E"),("E","C")])
say("bowtie deg",dict(B.degree()),"eulerian",nx.is_eulerian(B),"ham",ham_cycle(B),"cut",list(nx.articulation_points(B)))
AB=nx.to_numpy_array(B,nodelist="ABCDE").astype(int); A3=np.linalg.matrix_power(AB,3)
say("bowtie A3 diag",np.diag(A3),"tr/6",np.trace(A3)/6,"(A2)_AD",(AB@AB)[0,3])

# ---------- 2.7
K4m=nx.Graph([("A","B"),("A","C"),("A","D"),("B","C"),("B","D")])
M=nx.to_numpy_array(K4m,nodelist="ABCD").astype(int); say("K4-CD (A2)_CD",(M@M)[2,3])
A=nx.to_numpy_array(G,nodelist=order,weight=None).astype(int); A2=A@A
say("(A2)_PoPo",A2[2,2],"(A2)_KoLa",A2[0,3],"(A2)_KoVi",A2[0,1],"(A2)_SzLa",A2[5,3],"tr A3",np.trace(A@A@A))
Fr=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); F=nx.to_numpy_array(Fr,nodelist="ABCD").astype(int)
say("friends A3_AC",np.linalg.matrix_power(F,3)[0,2],"dist A,C",1,"paths len3 A->C",[p for p in nx.all_simple_paths(Fr,"A","C") if len(p)==4])
say("A elementwise square == A", (F*F==F).all())

# ---------- final
F21=nx.Graph([("A","B"),("A","C"),("B","C"),("B","D"),("C","D"),("D","E"),("E","F")])
say("2.1 cycles",list(nx.simple_cycles(F21)),"cycle basis size",len(nx.cycle_basis(F21)))
say("2.1 ecc",nx.eccentricity(F21),"radius",nx.radius(F21),"center",nx.center(F21))
C=nx.Graph(); C.add_nodes_from(range(1,9)); C.add_edges_from([(1,2),(2,3),(3,1),(4,5),(6,7)]); say("comps",nx.number_connected_components(C))
st=nx.star_graph(4); say("K14 avg",nx.average_shortest_path_length(st),"sum",sum(d for u,dd in nx.all_pairs_shortest_path_length(st) for v,d in dd.items())/2)
W=nx.Graph(); W.add_weighted_edges_from([("s","a",4),("s","b",1),("b","a",2),("a","t",1),("b","t",5)])
say("dij s-t",nx.dijkstra_path(W,"s","t"),nx.dijkstra_path_length(W,"s","t"),"fewest edges",nx.shortest_path(W,"s","t"))
for p in nx.all_simple_paths(W,"s","t"): say("  path",p,nx.path_weight(W,p,"weight"))
# strength
say("A-C direct 1/1 =",1/1,"via B 1/3+1/3=",2/3)
# cyclomatic n=9 m=12 c=2
say("cyclomatic",12-9+2)
# 4-cycle weights 1 + diagonal 2
Cy=nx.Graph(); Cy.add_weighted_edges_from([("a","b",1),("b","c",1),("c","d",1),("d","a",1),("a","c",2)])
cnt=0
for es in itertools.combinations(Cy.edges(data="weight"),3):
    T=nx.Graph(); T.add_nodes_from(Cy); T.add_weighted_edges_from(es)
    if nx.is_tree(T) and T.size(weight="weight")==3: cnt+=1
say("4-cycle MST count",cnt,"weight",nx.minimum_spanning_tree(Cy).size(weight="weight"))

# ---------- kiegészítő ellenőrzések
say("K13 avg",nx.average_shortest_path_length(nx.star_graph(3)))
say("friends (A2)_AC",(F@F)[0,2])
alt=nx.Graph(); alt.add_weighted_edges_from([("a","b",1),("b","c",3),("c","d",2),("d","e",4)]); say("alt tree",nx.is_tree(alt),alt.size(weight="weight"))
Qs=nx.Graph([("A","B"),("B","C"),("C","D"),("D","A"),("A","C")]); p="ABCDAC"; say("Q euler path valid",sorted(tuple(sorted(e)) for e in zip(p,p[1:]))==sorted(tuple(sorted(e)) for e in Qs.edges()))
ep=["Vi","Ko","Po","La","Ön","Po","Vi","Sz","Ko","Kl","Sz"]; say("Árvízhét Euler path Po count",ep.count("Po"),"Ko count",ep.count("Ko"))
k4i=nx.complete_graph(4); k4i.add_nodes_from([4,5,6]); say("K4+3 iso n,m,tree",k4i.number_of_nodes(),k4i.number_of_edges(),nx.is_tree(k4i))
say("BFS tree from Kl",dict(nx.bfs_predecessors(G,"Kl")))
