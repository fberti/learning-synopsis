# B író ellenőrzés: backbone (pontosan m él, stabil rendezés az adatsorrendben), ERGM-eloszlások
from common import *
L=loadjs("grafelmelet-halozattudomany/08-kozossegek/lesmis-data.js","LESMIS")
E=[tuple(e) for e in L["edges"]]; n=L["n"]
k=[0]*n; s=[0]*n
for a,b,w in E: k[a]+=1;k[b]+=1;s[a]+=w;s[b]+=w
al=lambda x,w:(1-w/s[x])**(k[x]-1) if k[x]>1 else 1.0
A=[min(al(a,w),al(b,w)) for a,b,w in E]
def stats(es):
    G=nx.Graph(); G.add_edges_from((a,b) for a,b,_ in es); return len(es),G.number_of_nodes(),nx.number_connected_components(G),sum(w for *_,w in es)/820
for x in [0.05,0.1,0.2,0.3]:
    keep=[E[i] for i in range(len(E)) if A[i]<x]; m=len(keep)
    top=sorted(E,key=lambda e:-e[2])[:m]
    nd=set(v for a,b,_ in keep for v in (a,b)); nt=set(v for a,b,_ in top for v in (a,b))
    drop=[e for e in E if A[E.index(e)]>=x]; mx=max(drop,key=lambda e:e[2])
    print("alpha",x,"disp",stats(keep),"top-m",stats(top),"only disp",len(nd-nt),"only top",len(nt-nd),"max dropped",L["names"][mx[0]],L["names"][mx[1]],mx[2])
