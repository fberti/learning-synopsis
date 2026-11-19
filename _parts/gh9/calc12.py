from common import *
from fractions import Fraction as F
def ks(deg):
    n=len(deg); k1=F(sum(deg),n); k2=F(sum(d*d for d in deg),n); return k1,k2,(k2/k1-1 if k1 else None)
H=nx.star_graph(5); H.add_edge(1,2)
print("star+e",ks([d for _,d in H.degree()]))
H2=H.copy(); H2.remove_node(5); print("minus leaf",ks([d for _,d in H2.degree()]), [d for _,d in H2.degree()])
H3=H.copy(); H3.remove_node(0); print("minus hub",ks([d for _,d in H3.degree()]))
p=sum(F(1,6)*F(1,H.degree(v)) for v in H if 0 in H[v]); print("P acquaint hub",p)
# second generation counting for C6 and star+e: expected new infections from a node infected via an edge = T*(k-1) averaged over edge ends
for G,name in [(nx.cycle_graph(6),"C6"),(H,"star+e")]:
    ends=[G.degree(v)-1 for e in G.edges() for v in e]; print(name,"mean excess",F(sum(ends),len(ends)))
# ER Poisson check
print("karate",ks([d for _,d in karate().degree()])[2]*1.0)
