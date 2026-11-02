import networkx as nx, numpy as np, json
from scipy.stats import spearmanr, pearsonr
# triadic closure over the week
days=["H","K","Sze","Cs","P","Szo","V"]
arts={1:("H",["Ko","Vi"]),2:("Sze",["Ko","Vi","Po"]),3:("P",["Ko","Po"]),4:("H",["Vi","Sz"]),5:("Cs",["Sz","Kl","Ko"]),6:("Szo",["Sz","Kl"]),
 7:("K",["La","Ön"]),8:("Cs",["La","Po","Ön"]),9:("V",["La","Ön"]),10:("K",["Po","Vi"]),11:("Sze",["Po","La"]),12:("Szo",["Ön","Po"])}
G=nx.Graph()
for d in days:
    new=[]
    for a,(dd,m) in sorted(arts.items()):
        if dd!=d: continue
        for i in range(len(m)):
            for j in range(i+1,len(m)):
                u,v=m[i],m[j]
                if not G.has_edge(u,v) and (u,v) not in [x[:2] for x in new] and (v,u) not in [x[:2] for x in new]:
                    cn=sorted(set(G[u]) & set(G[v])) if u in G and v in G else []
                    new.append((u,v,a,cn))
    for u,v,a,cn in new: G.add_edge(u,v)
    print(d,[(f"{u}-{v}",a,cn) for u,v,a,cn in new])
# karate weighted
K=nx.karate_club_graph()
def ov(G,u,v):
    Nu=set(G[u])-{v}; Nv=set(G[v])-{u}; un=Nu|Nv; return len(Nu&Nv)/len(un) if un else 0
w=[K[u][v]["weight"] for u,v in K.edges()]; o=[ov(K,u,v) for u,v in K.edges()]
print("karate weights", sorted(set(w)), np.bincount(w))
print("spearman w-overlap",spearmanr(w,o), "pearson",pearsonr(w,o))
lb=[(u,v) for u,v in K.edges() if ov(K,u,v)==0]; print("local bridges",lb,[K[u][v]["weight"] for u,v in lb])
club=[0 if K.nodes[i]["club"]=="Mr. Hi" else 1 for i in K]
print("cross-club edges weights",[K[u][v]["weight"] for u,v in K.edges() if club[u]!=club[v]], "mean cross",np.mean([K[u][v]["weight"] for u,v in K.edges() if club[u]!=club[v]]),"mean within",np.mean([K[u][v]["weight"] for u,v in K.edges() if club[u]==club[v]]))
print("mean overlap cross",np.mean([ov(K,u,v) for u,v in K.edges() if club[u]!=club[v]]),"within",np.mean([ov(K,u,v) for u,v in K.edges() if club[u]==club[v]]))
# removal experiments
def giant_curve(order):
    H=K.copy(); out=[]
    E=list(order)
    for k in range(len(E)+1):
        if k>0: H.remove_edge(*E[k-1])
        out.append(max(len(c) for c in nx.connected_components(H)))
    return out
import random
Es=list(K.edges())
rng=random.Random(0)
for name,key in [("weak first",lambda e:K[e[0]][e[1]]["weight"]),("strong first",lambda e:-K[e[0]][e[1]]["weight"]),("low overlap first",lambda e:ov(K,*e)),("high overlap first",lambda e:-ov(K,*e))]:
    ords=[]
    for t in range(200):
        L=Es[:]; rng.shuffle(L); L.sort(key=key); ords.append(giant_curve(L))
    a=np.mean(ords,0); print(name,[round(a[i],1) for i in range(0,79,8)])
