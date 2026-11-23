from common import *
from lp import *
from calc5 import split
K=nx.Graph(nx.karate_club_graph().edges())
R=random.Random(3); res={"rand":[], "d2":[], "PArand":[], "PAd2":[]}
for r in range(200):
    H,test=split(K,0.1,R)
    non=[(u,v) for u,v in itertools.combinations(K.nodes(),2) if not K.has_edge(u,v)]
    d2=[(u,v) for u,v in non if nx.shortest_path_length(H,u,v)==2]
    for M,key in (("CN",""),("PA","PA")):
        f=lambda u,v: heur(H,u,v)[M]
        res[key+"rand"].append(auc([f(*e) for e in test],[f(*e) for e in R.sample(non,len(test))]))
        res[key+"d2"].append(auc([f(*e) for e in test],[f(*e) for e in R.sample(d2,min(len(test),len(d2)))]))
print({k:round(np.mean(v),3) for k,v in res.items()})
non=[(u,v) for u,v in itertools.combinations(K.nodes(),2) if not K.has_edge(u,v)]
print("karate nonedges",len(non), "dist2 share", sum(nx.shortest_path_length(K,u,v)==2 for u,v in non))
# Arvizhet time split: spectral (train graph), PPMI walks
lab=lambda G: nx.relabel_nodes(G,{i:a for i,a in enumerate(ACT)})
G1=nx.Graph(lab(nx.from_numpy_array(comat(FIRST))).edges()); G1.add_nodes_from(ACT); G2=lab(nx.from_numpy_array(comat(SECOND)))
cand=[(u,v) for u,v in itertools.combinations(ACT,2) if not G1.has_edge(u,v)]; y=[G2.has_edge(*c) for c in cand]
Z,w=spectral(G1,2,ACT); print("G1 eig",np.round(w,3),{k:np.round(v,3) for k,v in Z.items()})
sc=[-np.linalg.norm(Z[u]-Z[v]) for u,v in cand]; print("spec2 AUC",auc([s for s,t in zip(sc,y) if t],[s for s,t in zip(sc,y) if not t]))
aucs=[]
for seed in range(20):
    ws=walks(G1,num=20,length=10,seed=seed); E_=ppmi_embed(cooc(ws,ACT,2),dim=2); Zp={n:E_[i] for i,n in enumerate(ACT)}
    sc=[float(Zp[u]@Zp[v]) for u,v in cand]; aucs.append(auc([s for s,t in zip(sc,y) if t],[s for s,t in zip(sc,y) if not t]))
print("ppmi AUC mean",np.mean(aucs))
# PMI on window1 walk counts
wk=list("ABDEDBC"); C=cooc([wk],list("ABCDE"),1); print(C)
S=C.sum(); r=C.sum(1)
for a,b in [("B","D"),("A","B"),("D","E")]:
    i,j="ABCDE".index(a),"ABCDE".index(b); print(a,b,C[i,j], "PMI ln(%d*%d/(%d*%d))="%(C[i,j],S,r[i],r[j]), round(math.log(C[i,j]*S/(r[i]*r[j])),3))
