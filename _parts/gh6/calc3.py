import networkx as nx, itertools as it, numpy as np, random
from fractions import Fraction as F
def g(s): G=nx.Graph(); G.add_edges_from(tuple(x.split("-")) for x in s.split(",")); return G
for name,s in [("bowtie","A-B,A-C,B-C,C-D,C-E,D-E"),("paw","A-B,A-C,A-D,B-C"),("house","1-2,2-3,3-4,4-1,1-5,2-5"),("K4","1-2,1-3,1-4,2-3,2-4,3-4"),
  ("twoTri","1-2,1-3,2-3,3-4,4-5,4-6,5-6"),("kite","A-B,A-C,A-D,A-F,B-D,B-E,B-G,C-D,C-F,D-E,D-F,D-G,E-G,F-G,F-H,G-H,H-I,I-J"),("barat","A-B,A-C,B-C,C-D")]:
    G=g(s); print(name,{k:str(F(v).limit_denominator(100)) for k,v in nx.clustering(G).items()},"avg",str(F(nx.average_clustering(G)).limit_denominator(1000)),round(nx.average_clustering(G),3),
      "trans",str(F(nx.transitivity(G)).limit_denominator(1000)),round(nx.transitivity(G),3),"tri",sum(nx.triangles(G).values())//3,
      "triples",sum(d*(d-1)//2 for _,d in G.degree()))
    try: print("   degassort",round(nx.degree_assortativity_coefficient(G),4))
    except Exception as e: print("   degassort err",e)
for name,s in [("P4","1-2,2-3,3-4"),("star4","A-B,A-C,A-D,A-E"),("P5","1-2,2-3,3-4,4-5"),("C5","1-2,2-3,3-4,4-5,5-1")]:
    G=g(s)
    import warnings; warnings.filterwarnings("ignore")
    print(name,"degassort",nx.degree_assortativity_coefficient(G))
# homophily colorings of twoTri
G=g("1-2,1-3,2-3,3-4,4-5,4-6,5-6")
def r(G,grp):
    m=G.number_of_edges(); e={}; 
    for u,v in G.edges():
        a,b=grp[u],grp[v]; e[(a,b)]=e.get((a,b),0)+F(1,2*m); e[(b,a)]=e.get((b,a),0)+F(1,2*m)
    cats=set(grp.values()); A={c:sum(e.get((c,d),0) for d in cats) for c in cats}
    s=sum(A[c]**2 for c in cats); t=sum(e.get((c,c),0) for c in cats)
    return t,s,(t-s)/(1-s)
res={}
for P in it.combinations("123456",3):
    grp={x:("P" if x in P else "K") for x in "123456"}; res.setdefault(r(G,grp)[2],[]).append(P)
for k in sorted(res): print(k,float(k),res[k][:3])
for k in range(1,6):
  for P in it.combinations("123456",k):
    grp={x:("P" if x in P else "K") for x in "123456"}; t,s,rr=r(G,grp)
    if rr==0: print("zero",P)
# search 6-node graphs with 7 edges: two triangles+bridge variant colorings exact 0 with 3/3
import random
cands=["1-2,1-3,2-3,4-5,4-6,5-6,3-4,1-4","1-2,2-3,3-1,4-5,5-6,6-4,1-4,2-5","1-2,1-3,2-3,3-4,4-5,4-6,5-6,2-5"]
for cs in cands:
    H=g(cs)
    for P in it.combinations("123456",3):
        grp={x:("P" if x in P else "K") for x in "123456"}; t,s,rr=r(H,grp)
        if P[0]=="1": print(cs,P,rr)
# prism
Pr=g("1-2,2-3,3-1,4-5,5-6,6-4,1-4,2-5,3-6")
print("prism 123",r(Pr,{x:("P" if x in "123" else "K") for x in "123456"}))
# arviz 2 groups
A=g("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön")
print("arviz civil",r(A,{x:("C" if x in ("La","Ön") else "N") for x in A}))
# 9:1 example: 10 nodes? build: big group 9 nodes complete-ish? use random illustrative: e_ii fraction 0.82 with a=0.9
for frac,aa in [(0.82,0.9),(0.9,0.9),(0.5,0.5)]:
    s=aa**2+(1-aa)**2; print("hyp",frac,aa,(frac-s)/(1-s))
