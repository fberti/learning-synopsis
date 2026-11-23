from common import *
import math
G=lambda arts: nx.from_numpy_array(comat(arts)) 
def lab(G): return nx.relabel_nodes(G,{i:a for i,a in enumerate(ACT)})
Gf=lab(G(ART)); G1=lab(G(FIRST)); G2=lab(G(SECOND))
print("full", sorted(Gf.edges(data='weight')))
print("first", sorted(G1.edges(data='weight')))
print("second", sorted(G2.edges(data='weight')))
cand=[(u,v) for u,v in itertools.combinations(ACT,2) if not G1.has_edge(u,v)]
pos={(u,v) for u,v in cand if G2.has_edge(u,v)}
print(len(cand),"cand; pos",pos)
deg=dict(G1.degree())
print("deg first",deg)
rows=[]
for u,v in cand:
    cn=set(G1[u])&set(G1[v]); un=set(G1[u])|set(G1[v])
    j=len(cn)/len(un) if un else 0
    aa=sum(1/math.log(deg[w]) for w in cn)
    ra=sum(1/deg[w] for w in cn)
    pa=deg[u]*deg[v]
    rows.append((u,v,len(cn),round(j,3),round(aa,3),round(ra,3),pa,(u,v) in pos, sorted(cn)))
for r in sorted(rows,key=lambda r:-r[2]): print(r)
def auc(sc):
    P=[s for s,y in sc if y]; N=[s for s,y in sc if not y]
    return sum((p>n)+0.5*(p==n) for p in P for n in N)/(len(P)*len(N))
for k,name in [(2,"CN"),(3,"J"),(4,"AA"),(5,"RA"),(6,"PA")]:
    print(name, auc([(r[k],r[7]) for r in rows]))
