import networkx as nx, numpy as np
from fractions import Fraction as Fr
# pr4 hand iteration exact fractions alpha=17/20
a=Fr(17,20); n=4
out={"A":["B","C"],"B":["C"],"C":["A"],"D":["C"]}
p={k:Fr(1,4) for k in "ABCD"}
for t in range(3):
  q={k:(1-a)/n for k in "ABCD"}
  for j,l in out.items():
    for i in l: q[i]+=a*p[j]/len(l)
  p=q; print(t+1,{k:(str(v),round(float(v),4)) for k,v in p.items()})
# A<->B, C->A
print(nx.pagerank(nx.DiGraph([("A","B"),("B","A"),("C","A")]),0.85))
# papersU details: dangling RH share
D=nx.DiGraph([("EK","RH"),("NY","EK"),("VN","RH"),("VN","NY")]); pr=nx.pagerank(D,0.85); print(pr)
print("VN check", 0.15/4+0.85*pr["RH"]/4)
# 2-cycle with dangling: A->B, B->A, B->C; C dangling
print(nx.pagerank(nx.DiGraph([("A","B"),("B","A"),("B","C")]),0.85))
# alpha=0 → uniform; alpha .5 for pr4
G=nx.DiGraph([("A","B"),("A","C"),("B","C"),("C","A"),("D","C")]); print("pr4 a.5",nx.pagerank(G,0.5))
# spider trap: A->B, B->C, C->B  alpha 1 and .85
T=nx.DiGraph([("A","B"),("B","C"),("C","B")]); print("trap .85",nx.pagerank(T,.85)); 
# undirected arviz PR vs degree share
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
print(nx.pagerank(nx.Graph(E)))
