import itertools, networkx as nx
A = {"Ko":"Kormány","Vi":"Vízügy","Po":"Polgármester","La":"Lakók","On":"Önkéntesek","Sz":"Szakértő","Kl":"Klímaváltozás"}
C = [ # id, lap, nap, említett, megszólal, keret
 (1,"RH","H",["Ko","Vi"],["Ko"],"vedekezes"),
 (2,"RH","Sze",["Ko","Vi","Po"],["Vi"],"vedekezes"),
 (3,"RH","P",["Ko","Po"],["Ko"],"vedekezes"),
 (4,"EK","H",["Vi","Sz"],["Sz"],"hiany"),
 (5,"EK","Cs",["Sz","Kl","Ko"],["Sz"],"hiany"),
 (6,"EK","Szo",["Sz","Kl"],["Sz"],"hiany"),
 (7,"NY","K",["La","On"],["La"],"veszteseg"),
 (8,"NY","Cs",["La","Po","On"],["La","Po"],"veszteseg"),
 (9,"NY","V",["La","On"],["On"],"veszteseg"),
 (10,"VN","K",["Po","Vi"],["Po"],"vedekezes"),
 (11,"VN","Sze",["Po","La"],["La"],"veszteseg"),
 (12,"VN","Szo",["On","Po"],["On"],"veszteseg"),
]
def cooc(arts):
    G=nx.Graph()
    for c in arts:
        G.add_nodes_from(c[3])
        for a,b in itertools.combinations(c[3],2):
            w=G[a][b]["weight"]+1 if G.has_edge(a,b) else 1
            G.add_edge(a,b,weight=w)
    return G
G=cooc(C); print("full n,m",G.number_of_nodes(),G.number_of_edges(),"density",nx.density(G))
print(sorted(G.degree(), key=lambda x:-x[1])); print(sum(d for _,d in G.degree()))
print({tuple(sorted(e)):d["weight"] for *e,d in G.edges(data=True)})
print("strength",dict(G.degree(weight="weight")))
for lap in ["RH","EK","NY","VN"]:
    g=cooc([c for c in C if c[1]==lap]); print(lap,g.number_of_nodes(),g.number_of_edges(),dict(g.degree()),{tuple(sorted(e)):d["weight"] for *e,d in g.edges(data=True)}, "dens",round(nx.density(g),3))
sub=[c for c in C if c[0] in (2,5,8,10)]; g=cooc(sub); print("4cikk",g.number_of_edges(),sorted(map(sorted,g.edges())), dict(g.degree()))
# article graph
AG=nx.Graph(); AG.add_nodes_from(c[0] for c in C)
for x,y in itertools.combinations(C,2):
    s=set(x[3])&set(y[3])
    if s: AG.add_edge(x[0],y[0],weight=len(s))
print("article graph m",AG.number_of_edges(),"dens",round(nx.density(AG),3),dict(AG.degree()))
sAG=AG.subgraph([2,5,8,10]); print("4 article edges",sorted(sAG.edges(data="weight")))
LG=nx.Graph(); laps={}
for c in C: laps.setdefault(c[1],set()).update(c[3])
print(laps)
for a,b in itertools.combinations(laps,2):
    s=laps[a]&laps[b]
    if s: LG.add_edge(a,b,weight=len(s))
print("lap graph",sorted(LG.edges(data="weight")))
print("cikkenkénti élek összesen",sum(len(c[3])*(len(c[3])-1)//2 for c in C))
print("Kl–La path", nx.shortest_path(G,"Kl","La"))
