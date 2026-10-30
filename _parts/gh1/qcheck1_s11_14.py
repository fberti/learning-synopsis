import itertools, networkx as nx
from math import comb
from fractions import Fraction as F
print("== 1.1")
G=nx.Graph(); G.add_nodes_from(range(1,7)); G.add_edges_from([(1,2),(2,3),(3,1),(4,5)])
print("Q1 n,m",G.number_of_nodes(),G.number_of_edges(),"n w/o isolated",len([v for v in G if G.degree(v)>0]),"2m",2*G.number_of_edges())
F1=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); print("Q3 A-D adj",F1.has_edge("A","D"),"path",nx.shortest_path(F1,"A","D"))
print("Q4 4 actors pairs",comb(4,2),"n(n-1)",12,"n^2",16,"n-1",3)
print("Q5 n=7",comb(7,2),7*6,49)
T=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")])
for name,e in [("xy yz zw wy",[("x","y"),("y","z"),("z","w"),("w","y")]),("C4",[("x","y"),("y","z"),("z","w"),("w","x")]),("path",[("x","y"),("y","z"),("z","w")]),("star",[("x","y"),("x","z"),("x","w")])]:
    print("Q7",name,nx.is_isomorphic(T,nx.Graph(e)))
print("== 1.2")
arts={1:["Ko","Vi"],4:["Vi","Sz"],6:["Sz","Kl"],7:["La","Ön"]}
CG=nx.Graph(); CG.add_nodes_from(arts)
for a,b in itertools.combinations(arts,2):
    if set(arts[a])&set(arts[b]): CG.add_edge(a,b)
SG=nx.Graph()
for s in arts.values(): SG.add_edges_from(itertools.combinations(s,2))
print("Q1 cikkgraf",CG.number_of_nodes(),CG.number_of_edges(),sorted(CG.edges()),"szereplograf",SG.number_of_nodes(),SG.number_of_edges())
A4={2:["Ko","Vi","Po"],5:["Sz","Kl","Ko"],8:["La","Po","Ön"],10:["Po","Vi"]}
for k in (1,2):
    print("Q5 >=",k,[(a,b) for a,b in itertools.combinations(A4,2) if len(set(A4[a])&set(A4[b]))>=k])
full={"RH":["Ko","Vi","Po"],"EK":["Vi","Sz","Kl","Ko"],"NY":["La","Ön","Po"],"VN":["Po","Vi","La","Ön"]}
print("Q7 lap non-edges",[(a,b) for a,b in itertools.combinations(full,2) if not set(full[a])&set(full[b])])
# Ko-La cooccurrence in all 12 articles
ALL=[["Ko","Vi"],["Ko","Vi","Po"],["Ko","Po"],["Vi","Sz"],["Sz","Kl","Ko"],["Sz","Kl"],["La","Ön"],["La","Po","Ön"],["La","Ön"],["Po","Vi"],["Po","La"],["Ön","Po"]]
print("Q4 Ko-La together:",any("Ko" in a and "La" in a for a in ALL),"Po-Ko articles",sum("Ko" in a and "Po" in a for a in ALL))
print("== 1.3")
G=nx.Graph(); G.add_nodes_from("abcdef"); G.add_edges_from(["ab","bc","bd","cd","de"])
print("Q1 degs",dict(G.degree()),sorted((d for _,d in G.degree()),reverse=True))
s=[5,4,3,3,2,1]; print("Q2",sum(s),sum(s)//2,nx.is_graphical(s),comb(6,2))
for s in [(2,2,2),(3,2,2,1),(3,3,1,1),(2,2,1,1,1),(4,3,2,1)]: print("Q3",s,sum(s),nx.is_graphical(list(s)))
print("Q4 avg deg n=8 m=12",2*12/8,12/8,24,12/comb(8,2))
for x in range(0,6): s=[4,3,3,2,x]; print("Q5 x=",x,sum(s),nx.is_graphical(s))
print("Q6 7*3",7*3,"21/2",21/2)
print("== 1.4")
import numpy as np
M=np.array([[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]])
H=nx.from_numpy_array(M); print("Q1 edges",[(u+1,v+1) for u,v in H.edges()],"sum",M.sum())
print("Q2 n=6 m=8 ones",16,"cells",36,"binom",comb(6,2))
L={"a":"bc","b":"acd","c":"ab","d":"b","e":""}
LG=nx.Graph(); LG.add_nodes_from(L)
for u,vs in L.items(): LG.add_edges_from((u,v) for v in vs)
print("Q3 sum",sum(map(len,L.values())),"m",LG.number_of_edges(),"binom5",comb(5,2), all(u in L[v] for u in L for v in L[u]))
print("Q4 dens",F(9,comb(6,2)),9/15,9/36,9/6,9/30)
print("Q5",4/9,4/999,(4/9)/(4/999),"m",10*4//2,1000*4//2)
print("== szovegellenorzes")
print("1.3 (4,3,3,2,2) m",14//2,"; 10*3/2",15,"; 12 el",(24-12)/4, nx.is_graphical([4,4,4,3,3,3,3]))
print("1.4 (4,3,2,2,2,1)",sum([4,3,2,2,2,1]),nx.is_graphical([4,3,2,2,2,1]))
# leirt konstrukcio: a(4)-b,c,d,e ; b(3)+f, +c  -> d,e hianyos
X=nx.Graph([("a","b"),("a","c"),("a","d"),("a","e"),("b","f"),("b","c")]); print("  leirt konstrukcio fokszamai",dict(X.degree()))
print("1.4 1000:",comb(1000,2),5000/comb(1000,2),"; 100 csucs",200/comb(100,2),4/99,"; 40/60",60/comb(40,2),"; 20/0.2",0.2*19,20*3.8/2,38/190)
