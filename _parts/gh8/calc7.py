import networkx as nx, json
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
G=nx.Graph(E); step=0
while G.number_of_edges():
    eb=nx.edge_betweenness_centrality(G,normalized=False)
    mx=max(eb.values()); top=[e for e,v in eb.items() if abs(v-mx)<1e-9]
    print(step,{f"{a}-{b}":round(v,2) for (a,b),v in eb.items()}, "remove",top)
    G.remove_edge(*top[0]); step+=1
    print("   comps",[sorted(c) for c in nx.connected_components(G)])
    if step>4: break
# path P4 & star practice
P=nx.path_graph(4); print("P4",nx.edge_betweenness_centrality(P,normalized=False))
S=nx.star_graph(3); print("star",nx.edge_betweenness_centrality(S,normalized=False))
B=nx.Graph([(1,2),(2,3),(3,1),(3,4),(4,5),(5,6),(6,4),(1,7)]); print("tri tail", nx.edge_betweenness_centrality(B,normalized=False))
# bowtie
BT=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D"),("C","E"),("D","E")]); print("bowtie",nx.edge_betweenness_centrality(BT,normalized=False))
# total EB = sum of distances
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)]); print(sum(nx.edge_betweenness_centrality(T,normalized=False).values()), sum(d for s,dd in nx.shortest_path_length(T) for t,d in dd.items())/2)
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read(); d=json.loads(s[s.index("{"):s.rindex("}")+1])
K=nx.Graph(); K.add_edges_from(map(tuple,d["edges"])); rem=[]
while nx.number_connected_components(K)==1:
    eb=nx.edge_betweenness_centrality(K,normalized=False); e=max(eb,key=eb.get); rem.append((e[0]+1,e[1]+1,round(eb[e],1))); K.remove_edge(*e)
print("karate removals until split",len(rem),rem)
