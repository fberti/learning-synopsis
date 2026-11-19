import networkx as nx, math, itertools
from networkx.algorithms.community import modularity, louvain_communities
from collections import Counter
# három klikk
G=nx.Graph()
for L in "ABC":
    G.add_edges_from(itertools.combinations([L+str(i) for i in range(1,5)],2))
G.add_edges_from([("A4","B1"),("B4","C1")])
parts=[{L+str(i) for i in range(1,5)} for L in "ABC"]
print("three cliques n,m",G.number_of_nodes(),G.number_of_edges(),"Q",modularity(G,parts), "= 0.9-534/1600 =",0.9-534/1600)
print("louvain nx", Counter(round(modularity(G,louvain_communities(G,seed=s)),4) for s in range(50)))
# két háromszög
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)]); print("twoTri",modularity(T,[{1,2,3},{4,5,6}]),5/14)
# Árvízhét súly nélkül
A=nx.Graph([("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Ko","Sz"),("Ko","Kl"),("La","Ön"),("Po","La"),("Po","Ön")])
print("arviz best", modularity(A,[{"Ko","Vi","Sz","Kl"},{"Po","La","Ön"}]), "Vi alone", modularity(A,[{"Ko","Sz","Kl"},{"Vi"},{"Po","La","Ön"}]))
c=Counter()
for s in range(200):
    p=louvain_communities(A,seed=s); c[(round(modularity(A,p),4),tuple(sorted(tuple(sorted(x)) for x in p)))]+=1
print("arviz nx louvain 200 seeds",c)
# küszöb
k=6; n=100
cin=k+math.sqrt(k); cout=k-math.sqrt(k)
print("threshold cin,cout",cin,cout,"eps*",cout/cin, (6-math.sqrt(6))/(6+math.sqrt(6)))
# SBM várható
print("sbm exp within",2*45*0.5,"between",100*0.05)
