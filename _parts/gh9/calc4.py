from common import *
import math
def tm(T,root=0):
    d=nx.single_source_shortest_path_length(T,root); depth=max(d.values())
    br=max(sum(1 for v in d.values() if v==l) for l in range(1,depth+1)) if depth else 0
    n=T.number_of_nodes(); W=nx.wiener_index(T); sv=W/(n*(n-1)/2) if n>1 else 0
    return dict(n=n,depth=depth,breadth=br,sv=round(sv,4),W=W)
print("star5",tm(nx.star_graph(4))); print("path5",tm(nx.path_graph(5)))
T=nx.Graph([(0,1),(0,2),(1,3),(1,4)]); print("mixed5",tm(T))
T=nx.Graph([(0,1),(1,2),(2,3),(2,4)]); print("Y5 root0",tm(T))
for n in [10,100]: print("star",n,tm(nx.star_graph(n-1))["sv"], "path",n,tm(nx.path_graph(n))["sv"], (n+1)/3, 2*(n-1)/n)
# star10 vs path ... two trees same size different virality
T=nx.Graph([(0,i) for i in range(1,4)]+[(1,4),(1,5),(4,6)]); print("t7",tm(T))
# Arvizhet citations as cascade: parent = earliest cited (by day, tiebreak lower id)
days=["H","K","Sze","Cs","P","Szo","V"]
art={1:"H",2:"Sze",3:"P",4:"H",5:"Cs",6:"Szo",7:"K",8:"Cs",9:"V",10:"K",11:"Sze",12:"Szo"}
cit=[[3,2],[4,1],[5,2],[5,4],[6,5],[8,7],[9,5],[9,8],[10,1],[11,7],[11,10],[12,8]]
par={}
for a,b in cit: par.setdefault(a,[]).append(b)
print("parents",par)
for rule in ["earliest","latest"]:
    E=[]
    for a,bs in par.items():
        bs=sorted(bs,key=lambda b:(days.index(art[b]),b))
        E.append((a, bs[0] if rule=="earliest" else bs[-1]))
    F=nx.Graph(E); print(rule,E)
    for c in nx.connected_components(F):
        roots=[x for x in c if x not in par]; Tc=F.subgraph(c)
        print("  comp",sorted(c),"roots",roots, tm(Tc,roots[0]) if len(roots)==1 else "")
# branching process: Poisson(R) offspring, total progeny Borel
def borel(R,n): return math.exp(-R*n+(n-1)*math.log(R*n)-math.lgamma(n+1))
for R in [0.5,0.9,1.0]:
    ps=[borel(R,n) for n in range(1,5000)]
    print("R",R,"P1",round(ps[0],4),"P2",round(ps[1],4),"P(>=10)",round(1-sum(ps[:9]),4),"P(>=100)",round(1-sum(ps[:99]),4),"mean",(1/(1-R) if R<1 else "inf"))
# simple branching: each shares with prob: k=3 friends, prob q each -> R=3q
