import itertools, networkx as nx, numpy as np
from fractions import Fraction as F
from math import comb
arts={1:('RH','H',['Ko','Vi']),2:('RH','Sze',['Ko','Vi','Po']),3:('RH','P',['Ko','Po']),4:('EK','H',['Vi','Sz']),5:('EK','Cs',['Sz','Kl','Ko']),6:('EK','Szo',['Sz','Kl']),
 7:('NY','K',['La','Ön']),8:('NY','Cs',['La','Po','Ön']),9:('NY','V',['La','Ön']),10:('VN','K',['Po','Vi']),11:('VN','Sze',['Po','La']),12:('VN','Szo',['Ön','Po'])}
order=['H','K','Sze','Cs','P','Szo','V']; T={d:i for i,d in enumerate(order)}
tedges=[]
for a,(p,d,m) in arts.items():
    for u,v in itertools.combinations(m,2): tedges.append((u,v,T[d],a))
print("== 3.5")
for d in order: print(d,[(u,v) for u,v,t,a in tedges if t==T[d]])
agg=nx.Graph(); agg.add_edges_from((u,v) for u,v,_,_ in tedges); print("agg edges",agg.number_of_edges())
print("Cs snapshot edges",sum(1 for e in tedges if e[2]==T['Cs']))
def reach(src,t0=0):
    # earliest arrival + min steps via BFS over (node,time) states
    best={src:(t0,0)}; frontier=[(src,t0,0)]; res={}
    import heapq
    # compute minimal hops with non-decreasing times: state (node,last_t)
    states={(src,t0):0}; q=[(0,src,t0)]
    while q:
        h,u,t=heapq.heappop(q)
        for a,b,tt,_ in tedges:
            for x,y in ((a,b),(b,a)):
                if x==u and tt>=t and (y,tt) not in states:
                    states[(y,tt)]=h+1; heapq.heappush(q,(h+1,y,tt))
    out={}
    for (n,t),h in states.items():
        if n!=src: out[n]=min(out.get(n,99),h)
    return out
print("Kl reach",reach('Kl')); print("Vi reach",reach('Vi')); print("agg dist Kl-La",nx.shortest_path_length(agg,'Kl','La'))
print("La from K reach",reach('La',T['K']))
def valid(path):  # list of (u,v,day)
    ok=all(any({u,v}=={a,b} and t==T[d] for a,b,t,_ in tedges) for u,v,d in path)
    mono=all(T[path[i][2]]<=T[path[i+1][2]] for i in range(len(path)-1))
    return ok,mono
for p in [[('Ko','Po','Sze'),('Po','Ön','Cs'),('Ön','La','V')],[('Kl','Ko','Cs'),('Ko','Vi','Sze')],[('La','Po','Cs'),('Po','Ko','Sze')],[('Sz','Kl','Szo'),('Kl','Ko','Cs')]]:
    print(p,valid(p))
# small temporal example
small=[('A','B',2),('B','C',3),('C','D',4),('B','D',1)]
G=nx.Graph(); G.add_edges_from((u,v) for u,v,_ in small); print("small agg A-D",nx.shortest_path_length(G,'A','D'))
for path in nx.all_simple_paths(G,'A','D'):
    ts=[next(t for u,v,t in small if {u,v}=={path[i],path[i+1]}) for i in range(len(path)-1)]
    print(path,ts,all(ts[i]<=ts[i+1] for i in range(len(ts)-1)))
print("== 3.6")
cm={}
for p in ['RH','EK','NY','VN']:
    cm[p]=set(x for a,(pp,d,m) in arts.items() if pp==p for x in m)
L1={frozenset(x) for x in [('EK','RH'),('NY','EK'),('VN','RH'),('VN','NY')]}
ev={'E1':[1,4],'E2':[7,10],'E3':[2,11],'E4':[8],'E5':[5,6],'E6':[3,9,12]}
L2=set(); 
for e,al in ev.items():
    ps={arts[a][0] for a in al}
    for x in itertools.combinations(sorted(ps),2): L2.add(frozenset(x))
L3={}
for x,y in itertools.combinations(['RH','EK','NY','VN'],2):
    c=len(cm[x]&cm[y])
    if c: L3[frozenset((x,y))]=c
for x,y in itertools.combinations(['RH','EK','NY','VN'],2):
    f=frozenset((x,y)); print(x,y,"layers:",[n for n,L in (('hiv',L1),('esem',L2),('szer',L3)) if f in L], "szer",L3.get(f,0))
print("layer sizes",len(L1),len(L2),len(L3),"sum",len(L1)+len(L2)+len(L3),"union",len(L1|L2|set(L3)))
nm=sum(len(m) for _,_,m in arts.values()); print("mentions",nm, "sizes",[len(m) for _,_,m in arts.values()])
print("nodes",4+12+7+6)
print("hyperedge sizes",sorted(len(m) for _,_,m in arts.values()),"pair occurrences",sum(comb(len(m),2) for _,_,m in arts.values()),"distinct",agg.number_of_edges())
print("4-elemű hiperél",comb(4,2))
print("== 3.7")
tr=[("Kormány","vezényel","Védekezők"),("Polgármester","köszönetet mond","Kormány"),("Vízügy","kijelenti, hogy tart","Gát"),("Kormány","segélyt küld","Polgármester"),("Szakértő","idézi","Vízügy"),("Vízügy","figyelmeztetett","Gát"),("Szakértő","bírálja","Kormány"),("Klímaváltozás","gyakoribbá teszi","Árvíz"),("Önkéntesek","gyűjtést indít","Lakók"),("Polgármester","bejárja","Gát"),("Polgármester","fórumot tart","Lakók"),("Polgármester","köszönti","Önkéntesek")]
K=nx.MultiDiGraph(); K.add_edges_from((s,o) for s,p,o in tr)
print("entities",K.number_of_nodes(),"triples",len(tr),"subj+obj occurrences",2*len(tr))
print("in",dict(K.in_degree())); print("out",dict(K.out_degree()))
print("Po in+out",K.in_degree('Polgármester')+K.out_degree('Polgármester'))
print("== 3.3 signed")
rel=[('Ko','Vi',1),('Sz','Vi',1),('Po','Ko',1),('Vi','Po',1),('Sz','Ko',-1),('La','Ön',1),('Po','La',1),('Po','Ön',1)]
S=nx.Graph(); [S.add_edge(a,b,s=s) for a,b,s in rel]
tri=[c for c in itertools.combinations(S.nodes,3) if all(S.has_edge(x,y) for x,y in itertools.combinations(c,2))]
for c in tri: print(c,[S[x][y]['s'] for x,y in itertools.combinations(c,2)],np.prod([S[x][y]['s'] for x,y in itertools.combinations(c,2)]))
print("neg",sum(1 for *_,s in rel if s<0))
print("== final")
# lap hivatkozási mátrix
cit=[(3,2),(4,1),(5,2),(5,4),(6,5),(8,7),(9,5),(9,8),(10,1),(11,7),(11,10),(12,8)]
laps=['RH','EK','NY','VN']; M=np.zeros((4,4),int)
for a,b in cit:
    i,j=laps.index(arts[a][0]),laps.index(arts[b][0])
    if i!=j: M[i,j]+=1
print(M,"col",M.sum(0),"row",M.sum(1),"total",M.sum())
n=5; print("max edges n=5",n*(n-1),comb(n,2),n*n,(n-1)**2)
D=nx.DiGraph([('A','B'),('B','C'),('C','A'),('C','D'),('D','E'),('E','D')]); print("SCC",list(nx.strongly_connected_components(D)))
arts_s=[['A','B','C'],['A','B'],['A','B','C','D']]
print("Newman A-B",sum(F(1,len(a)-1) for a in arts_s),"1/k",sum(F(1,len(a)) for a in arts_s),"1/binom",sum(F(1,comb(len(a),2)) for a in arts_s),"raw",len(arts_s))
raw={};new={}
for _,_,m in arts.values():
    for x in m: new[x]=new.get(x,0)+1
    for u,v in itertools.combinations(m,2):
        raw[u]=raw.get(u,0)+1; raw[v]=raw.get(v,0)+1
print("raw",raw,"newman",new)
B=np.array([[int(any(arts[a][0]==l for a in ev[e])) for e in ev] for l in laps]); E=list(ev)
Ni,Nj=set(np.nonzero(B[0])[0]),set(np.nonzero(B[2])[0])
print("RH-NY jaccard",F(len(Ni&Nj),len(Ni|Nj)),"common/min",F(len(Ni&Nj),min(len(Ni),len(Nj))),"common/6",F(len(Ni&Nj),6))
BtB=B.T@B; print("BtB E2E6",BtB[1,5],"BBt",B@B.T)
H=nx.Graph([('A','B'),('B','C'),('C','D'),('D','E'),('E','F'),('F','A'),('A','D')]); print("bip",nx.is_bipartite(H),nx.bipartite.color(H))
