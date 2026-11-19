# B ellenőrzés: Granovetter (normális kvantilisek), Borel, kaszkádfa-mérőszámok, seed-picker pontos értékek
import math, itertools
from scipy.stats import norm
import networkx as nx
def gran(th):
    act=0; h=[0]
    while True:
        nw=sum(1 for t in th if t<=act)
        if nw==act: break
        act=nw; h.append(act)
    return h
print("0..99", gran(list(range(100)))[-1], len(gran(list(range(100))))-1)
print("1->2", gran([0,2]+list(range(2,100)))[-1])
# normális: kvantilisek, kerekítés lefelé? round? clip 0
for mode in ("round","floor"):
    res=[]
    for sd in range(0,31):
        th=[mean for mean in [25]]
        th=[max(0,min(99,(round if mode=="round" else math.floor)(25+sd*norm.ppf((i+.5)/100)))) for i in range(100)]
        g=gran(th); res.append((sd,g[-1],len(g)-1))
    print(mode, res)
# Borel
def borel(R,s): return math.exp(-R*s+(s-1)*math.log(R*s)-math.lgamma(s+1))
for R in (.5,.9,1):
    p1=borel(R,1); cum=sum(borel(R,s) for s in range(1,100))
    print("Borel R",R,"P1",round(p1,4),"P>=100",round(1-cum,4), "mean", 1/(1-R) if R<1 else "inf")
# fák
def sv(par):
    G=nx.Graph([(v,p) for v,p in enumerate(par) if p>=0]); return nx.average_shortest_path_length(G)
print("star5",sv([-1,0,0,0,0]),"path5",sv([-1,0,1,2,3]),"mixed",sv([-1,0,0,1,1]),"star10",sv([-1]+[0]*9),"path10",sv([-1]+list(range(9))))
# IC exact
def icexact(nodes,edges,S,p):
    m=len(edges); tot=0
    for mask in range(1<<m):
        G=nx.Graph(); G.add_nodes_from(nodes)
        pr=1
        for i,e in enumerate(edges):
            if mask>>i&1: pr*=p; G.add_edge(*e)
            else: pr*=1-p
        reach=set()
        for s in S: reach|=nx.node_connected_component(G,s)
        tot+=pr*len(reach)
    return tot
AL=["Ko","Vi","Po","La","Ön","Sz","Kl"]
AE=[tuple(x.split("-")) for x in "Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Ko-Sz,Ko-Kl,La-Ön,Po-La,Po-Ön".split(",")]
for p in (.3,.5):
    single={a:round(icexact(AL,AE,[a],p),3) for a in AL}
    pairs={c:icexact(AL,AE,list(c),p) for c in itertools.combinations(AL,2)}
    best=max(pairs,key=pairs.get)
    print("arviz p",p,single,"opt",best,round(pairs[best],3),"KoPo",round(pairs[("Ko","Po")],3),"KoLa",round(pairs[("Ko","La")],3), "LaSz", round(pairs[("La","Sz")],3))
HN=["A","B","1","2","3","4","5","C","x","y","z"]
HE=[("A",str(i)) for i in range(1,6)]+[("B",str(i)) for i in range(1,6)]+[("A","B"),("C","x"),("C","y"),("C","z")]
for p in (.2,.5):
    print("hubs p",p,"A",round(icexact(HN,HE,["A"],p),4),"AB",round(icexact(HN,HE,["A","B"],p),4),"AC",round(icexact(HN,HE,["A","C"],p),4))
    pairs={c:icexact(HN,HE,list(c),p) for c in itertools.combinations(HN,2)}
    best=max(pairs,key=pairs.get); print("   opt",best,round(pairs[best],4))
