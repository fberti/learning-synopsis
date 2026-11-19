from common import *
from fractions import Fraction as F
K=nx.complete_bipartite_graph(4,4); R=nx.circulant_graph(8,[1,2]); C=nx.circulant_graph(8,[1,3])
print(nx.is_isomorphic(K,C), R.number_of_edges(), C.number_of_edges(), nx.transitivity(R), nx.transitivity(C))
def thresh(G,seeds,theta):
    A=set(seeds); h=[len(A)]
    while True:
        new={v for v in G if v not in A and sum(1 for u in G[v] if u in A)>=theta}
        if not new: return h
        A|=new; h.append(len(A))
print("ring",thresh(R,[0,1],2),"K44-circ",thresh(C,[0,1],2), "simple ring",thresh(R,[0],1),"simple circ",thresh(C,[0],1))
# exact IC triangle with fractions
p=F(1,2); print("tri reach", p+(1-p)*p*p, 1+2*(p+(1-p)*p*p))
# star leaf: leaf->center p, center-> other 3 leaves p each: 1+p+3p^2
print("star leaf",1+p+3*p*p,"center",1+4*p)
# threshold fraction on Arvizhet theta=0.5 seeds
G=arv()
def tf(seeds,th):
    A=set(seeds)
    while True:
        new={v for v in G if v not in A and sum(1 for u in G[v] if u in A)/G.degree(v)>=th}
        if not new: return A
        A|=new
for s in [["La","Ön"],["Sz","Kl"],["Ko","Vi"],["Po"],["Ko"],["Ko","Po"]]:
    print(s,sorted(tf(s,0.5)))
