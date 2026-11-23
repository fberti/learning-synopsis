from common import *
from lp import *
lab=lambda G: nx.relabel_nodes(G,{i:a for i,a in enumerate(ACT)})
Gf=lab(nx.from_numpy_array(comat(ART)))
print("deg full",dict(Gf.degree()))
non=[(u,v) for u,v in itertools.combinations(ACT,2) if not Gf.has_edge(u,v)]
for u,v in non: print(u,v,{k:round(x,3) for k,x in heur(Gf,u,v).items()}, sorted(set(Gf[u])&set(Gf[v])))
print("A2"); A=nx.to_numpy_array(Gf,nodelist=ACT,weight=None); print((A@A).astype(int))
