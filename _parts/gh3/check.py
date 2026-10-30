import itertools, networkx as nx, numpy as np
arts={1:('RH','H',['Ko','Vi']),2:('RH','Sze',['Ko','Vi','Po']),3:('RH','P',['Ko','Po']),4:('EK','H',['Vi','Sz']),5:('EK','Cs',['Sz','Kl','Ko']),6:('EK','Szo',['Sz','Kl']),
 7:('NY','K',['La','Ön']),8:('NY','Cs',['La','Po','Ön']),9:('NY','V',['La','Ön']),10:('VN','K',['Po','Vi']),11:('VN','Sze',['Po','La']),12:('VN','Szo',['Ön','Po'])}
ev={'E1':[1,4],'E2':[7,10],'E3':[2,11],'E4':[8],'E5':[5,6],'E6':[3,9,12]}
laps=['RH','EK','NY','VN']; E=list(ev)
B=np.array([[int(any(arts[a][0]==l for a in ev[e])) for e in E] for l in laps]); print(B)
print("BBt\n",B@B.T); print("BtB\n",B.T@B)
# Jaccard & Newman for lap projection
for i,j in itertools.combinations(range(4),2):
    Ni=set(np.nonzero(B[i])[0]); Nj=set(np.nonzero(B[j])[0]); inter=Ni&Nj
    jac=len(inter)/len(Ni|Nj); new=sum(1/(B[:,e].sum()-1) for e in inter)
    print(laps[i],laps[j],len(inter),round(jac,3),round(new,3))
print("event sizes",B.sum(0))
# multiplicity weighted lap-event (articles count)
W=np.array([[sum(1 for a in ev[e] if arts[a][0]==l) for e in E] for l in laps]);print("W\n",W)
# citations
cit=[(4,1),(5,2),(5,4),(8,7),(9,5),(9,8),(10,1),(11,10),(11,7),(12,8),(3,2),(6,5)]
D=nx.DiGraph(); D.add_nodes_from(arts); D.add_edges_from(cit)
print("art in",dict(D.in_degree()),"out",dict(D.out_degree()))
P=nx.DiGraph(); P.add_nodes_from(laps)
for a,b in cit:
    la,lb=arts[a][0],arts[b][0]
    if la!=lb: P.add_edge(la,lb,weight=P[la][lb]['weight']+1 if P.has_edge(la,lb) else 1)
print("paper edges",list(P.edges(data='weight')),"in",dict(P.in_degree(weight='weight')),"out",dict(P.out_degree(weight='weight')))
print("SCC",list(nx.strongly_connected_components(P)),"weak",nx.number_weakly_connected_components(P))
P2=P.copy(); P2.add_edge('RH','VN'); print("SCC after RH->VN",list(nx.strongly_connected_components(P2)))
print("art DAG?",nx.is_directed_acyclic_graph(D), "longest chain", nx.dag_longest_path(D))
# temporal
order=['H','K','Sze','Cs','P','Szo','V']
tedges=[]
for a,(l,d,m) in arts.items():
    for u,v in itertools.combinations(m,2): tedges.append((u,v,order.index(d)))
def reach(src):
    best={src:-1}
    changed=True
    while changed:
        changed=False
        for u,v,t in tedges:
            for x,y in ((u,v),(v,u)):
                if x in best and best[x]<=t and (y not in best or best[y]>t):
                    best[y]=t; changed=True
    return {k:(order[v] if v>=0 else 'start') for k,v in best.items()}
for s in ['Kl','La','Vi','Sz','Ko']: print("reach",s,reach(s))
# snapshots per day edges count
for d in order: print(d,[ (u,v) for u,v,t in tedges if order[t]==d])
