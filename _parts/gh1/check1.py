import itertools, networkx as nx
from math import comb
exec(open("arviz.py").read().split("def cooc")[0])
def cooc(arts, multi=False):
    G=nx.MultiGraph() if multi else nx.Graph()
    for c in arts:
        G.add_nodes_from(c[3])
        for a,b in itertools.combinations(c[3],2):
            if multi: G.add_edge(a,b)
            else: G.add_edge(a,b,weight=G[a][b]["weight"]+1 if G.has_edge(a,b) else 1)
    return G
G=cooc(C); M=cooc(C,True)
print("multi m",M.number_of_edges(),"deg sum",sum(d for _,d in M.degree()), dict(M.degree()))
comp=nx.complement(G); print("complement m",comp.number_of_edges(),sorted(map(sorted,comp.edges())))
print("avg deg",2*10/7)
# 1.1 story graph: triangle + pendant
T=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); print(nx.to_numpy_array(T,nodelist="ABCD") if False else "", dict(T.degree()), nx.density(T))
# graphical checks
print("3311 graphical", nx.is_graphical([3,3,1,1]), "12233",nx.is_graphical([1,2,2,3,3]), "3333333", nx.is_graphical([3]*7), "333333",nx.is_graphical([3]*6))
print("44332 22", nx.is_graphical([4,4,3,3,2,2,2]))
# sparse example
print(comb(1000,2), 1000*10/2, 5000/comb(1000,2))
# Konigsberg
K=nx.MultiGraph([("A","B"),("A","B"),("A","C"),("A","C"),("A","D"),("B","D"),("C","D")]); print("Konig",dict(K.degree()), K.number_of_edges())
# C6 vs 2 triangles
print(nx.is_isomorphic(nx.cycle_graph(6), nx.disjoint_union(nx.complete_graph(3),nx.complete_graph(3))))
# lap graphs iso
lg={l:cooc([c for c in C if c[1]==l]) for l in ["RH","EK","NY","VN"]}
print("RH~NY",nx.is_isomorphic(lg["RH"],lg["NY"]),"VN star",nx.is_isomorphic(lg["VN"],nx.star_graph(3)))
for n in [4,5,6,7,10,20]: print(n, comb(n,2))
