import itertools, math, networkx as nx
comb=math.comb
print("== 1.5")
M=nx.MultiGraph(); M.add_edges_from([("p","q"),("p","q"),("q","r"),("r","r")])
print("pqr deg",dict(M.degree()),"sum",sum(d for _,d in M.degree()),"m",M.number_of_edges())
K=nx.MultiGraph(); K.add_edges_from([("É","Sz"),("É","Sz"),("D","Sz"),("D","Sz"),("K","Sz"),("É","K"),("D","K")])
print("Königsberg m",K.number_of_edges(),"pairs",nx.Graph(K).number_of_edges(),"deg",dict(K.degree()),"simple deg",dict(nx.Graph(K).degree()))
arts=[("La","Ön"),("La","Ön","Po"),("La","Po")]
W=nx.Graph()
for a in arts:
  for u,v in itertools.combinations(a,2):
    W.add_edge(u,v,weight=W[u][v]["weight"]+1 if W.has_edge(u,v) else 1)
print("La deg",W.degree("La"),"strength",W.degree("La",weight="weight"),"articles",sum("La" in a for a in arts))
g=nx.Graph(); [g.add_edge("La","Ön") for _ in range(3)]; print("nx Graph 3x add",g.number_of_edges())
print("== 1.6")
for n in [5,6,8]: print(n,"K",comb(n,2),"P",n-1,"C",n,"star nodes",n+1)
print("K8",comb(8,2),8*7,64)
print("n10 m6 compl",comb(10,2)-6,10-6,100-6,90-6)
print("compl deg n8 d3",8-1-3)
c4=nx.cycle_graph(["A","B","C","D"]); print("C4 compl",sorted(nx.complement(c4).edges()))
G1=nx.Graph([("a","b"),("b","c"),("c","d"),("d","e"),("e","a"),("a","c")])
G2=nx.Graph([(1,2),(2,3),(3,4),(4,5),(5,1),(2,4)])
print("iso",nx.is_isomorphic(G1,G2))
f={"a":2,"b":3,"c":4,"d":5,"e":1}; print("map ok",all(G2.has_edge(f[u],f[v]) for u,v in G1.edges()))
print("== 1.7 / full")
ART=[(1,"RH",["Ko","Vi"]),(2,"RH",["Ko","Vi","Po"]),(3,"RH",["Ko","Po"]),(4,"EK",["Vi","Sz"]),(5,"EK",["Sz","Kl","Ko"]),(6,"EK",["Sz","Kl"]),
 (7,"NY",["La","Ön"]),(8,"NY",["La","Po","Ön"]),(9,"NY",["La","Ön"]),(10,"VN",["Po","Vi"]),(11,"VN",["Po","La"]),(12,"VN",["Ön","Po"])]
def cooc(arts):
  G=nx.Graph()
  for c in arts:
    G.add_nodes_from(c[2])
    for a,b in itertools.combinations(c[2],2):
      G.add_edge(a,b,weight=G[a][b]["weight"]+1 if G.has_edge(a,b) else 1)
  return G
G=cooc(ART); n,m=G.number_of_nodes(),G.number_of_edges()
print("n m",n,m,"dens",round(nx.density(G),3),"avg",round(2*m/n,3))
print("deg",dict(G.degree()),"str",dict(G.degree(weight="weight")))
print("articles per actor",{a:sum(a in c[2] for c in ART) for a in G})
print("multi m",sum(comb(len(c[2]),2) for c in ART))
Gc=nx.complement(G); print("compl m",Gc.number_of_edges(),sorted(map(sorted,Gc.edges())), "wrong",n-m,49-m,42-m)
for p in [("Po","Sz"),("Ko","Kl"),("Vi","Sz"),("Po","Vi"),("Ko","La")]: print(p,"in G",G.has_edge(*p))
for lap in ["RH","EK","NY","VN"]:
  g=cooc([c for c in ART if c[1]==lap]); nn,mm=g.number_of_nodes(),g.number_of_edges()
  print(lap,nn,mm,round(nx.density(g),3),"m/n",mm/nn,"m/n2",mm/nn**2,dict(g.degree()))
print("RH~NY",nx.is_isomorphic(cooc(ART[0:3]),cooc(ART[6:9])))
print("5-actor article",comb(5,2),"vs five 2-actor",5)
print("== final")
print("E ab,ba,bc,ac ->",len({frozenset(e) for e in ["ab","ba","bc","ac"]}))
laps={}
for c in ART: laps.setdefault(c[1],set()).update(c[2])
L1=[(a,b) for a,b in itertools.combinations(laps,2) if len(laps[a]&laps[b])>=1]
L2=[(a,b) for a,b in itertools.combinations(laps,2) if len(laps[a]&laps[b])>=2]
L3=[(a,b) for a,b in itertools.combinations(laps,2) if len(laps[a]&laps[b])>=3]
print("lapgraf >=1",len(L1),"missing",[p for p in itertools.combinations(laps,2) if p not in L1],">=2",L2,">=3",L3)
four=[c for c in ART if c[0] in (2,5,8,10)]
AG=nx.Graph(); AG.add_nodes_from(c[0] for c in four)
for x,y in itertools.combinations(four,2):
  if set(x[2])&set(y[2]): AG.add_edge(x[0],y[0])
print("cikkgraf",sorted(AG.edges()),"deg5",AG.degree(5))
g4=cooc(four); print("4cikk m",g4.number_of_edges(),"missing vs full",[e for e in G.edges() if not g4.has_edge(*e)])
for s in [(3,3,2,2,2),(3,3,1,1),(4,4,4,1,1),(5,3,2,2,2)]: print(s,sum(s),nx.is_graphical(list(s)))
print("15 edges all deg3 n",2*15/3, "wrong",15/3,15*3)
print("6 nodes sum18 m9 dens",9/comb(6,2),"m/n2",9/36,"sum/n2",18/36,"sum/C",18/15)
M2=nx.MultiGraph([("a","b"),("a","b"),("b","b"),("b","c")]); print("final multi deg",dict(M2.degree()),"m",M2.number_of_edges())
print("Ön deg",G.degree("Ön"),"str",G.degree("Ön",weight="weight"))
st=nx.star_graph(3); print("K13 compl edges",sorted(nx.complement(st).edges()), "deg",dict(nx.complement(st).degree()))
print("star 9 nodes edges",8,"C(9,2)",comb(9,2))
