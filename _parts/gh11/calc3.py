from common import *
from lp import *
lab=lambda G: nx.relabel_nodes(G,{i:a for i,a in enumerate(ACT)})
G1=lab(nx.from_numpy_array(comat(FIRST))); G2=lab(nx.from_numpy_array(comat(SECOND))); Gf=lab(nx.from_numpy_array(comat(ART)))
for n in ACT: G1.add_node(n)
cand=[(u,v) for u,v in itertools.combinations(ACT,2) if not G1.has_edge(u,v)]
y={c:G2.has_edge(*c) for c in cand}
for M in ["CN","J","AA","RA","PA"]:
    sc={c:heur(G1,*c)[M] for c in cand}
    P=[sc[c] for c in cand if y[c]]; N=[sc[c] for c in cand if not y[c]]
    # leaky: score in full graph (test edges included)
    scl={c:heur(Gf,*c)[M] for c in cand}
    Pl=[scl[c] for c in cand if y[c]]; Nl=[scl[c] for c in cand if not y[c]]
    rank=sorted(cand,key=lambda c:-sc[c])
    print(M,"AUC",round(auc(P,N),4),"leaky",round(auc(Pl,Nl),4), "pos",P,"top",[(c,round(sc[c],3),y[c]) for c in rank[:6]])
# random baseline precision = 4/15
print("base rate",4/15)
