import networkx as nx
days=["H","K","Sze","Cs","P","Szo","V"]
arts={1:("H",["Ko","Vi"]),2:("Sze",["Ko","Vi","Po"]),3:("P",["Ko","Po"]),4:("H",["Vi","Sz"]),5:("Cs",["Sz","Kl","Ko"]),6:("Szo",["Sz","Kl"]),
 7:("K",["La","Ön"]),8:("Cs",["La","Po","Ön"]),9:("V",["La","Ön"]),10:("K",["Po","Vi"]),11:("Sze",["Po","La"]),12:("Szo",["Ön","Po"])}
G=nx.Graph(); G.add_nodes_from(["Ko","Vi","Po","La","Ön","Sz","Kl"])
for d in days:
    for a,(dd,m) in arts.items():
        if dd==d:
            for i in range(len(m)):
                for j in range(i+1,len(m)):
                    if G.has_edge(m[i],m[j]): G[m[i]][m[j]]["weight"]+=1
                    else: G.add_edge(m[i],m[j],weight=1)
    H=G.subgraph([v for v in G if G.degree(v)>0])
    print(d,"m",G.number_of_edges(),"tri",sum(nx.triangles(G).values())//3,"avgC(7)",round(nx.average_clustering(G),3),"avgC(active)",round(nx.average_clustering(H),3) if len(H) else None,"trans",round(nx.transitivity(G),3))
