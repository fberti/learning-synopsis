from common import *
import math
def kap(G):
    k=np.array([d for _,d in G.degree()],float); k1=k.mean(); k2=(k**2).mean()
    return dict(n=G.number_of_nodes(), m=G.number_of_edges(), k1=round(k1,3), k2=round(k2,3), ratio=round(k2/k1,3), kappa=round(k2/k1-1,3), Tc=round(k1/(k2-k1),4), kmax=int(k.max()))
print("arv",kap(arv())); print("karate",kap(karate()))
Gp,_=polblogs(); print("polblogs",kap(Gp))
print("lesmis",kap(nx.les_miserables_graph()))
C6=nx.cycle_graph(6); print("C6",kap(C6))
H=nx.star_graph(5); H.add_edge(1,2); print("star+e",kap(H))
S4=nx.star_graph(4); print("K1,4",kap(S4))
# ER and BA same size as polblogs, averaged
rs=np.random.default_rng(1)
n,m=Gp.number_of_nodes(),Gp.number_of_edges()
print("ER polb",kap(nx.gnm_random_graph(n,m,seed=1)))
print("BA n1222 m=?", m/n, kap(nx.barabasi_albert_graph(n,round(m/n),seed=1)))
for N in [1000,10000,100000]:
    print("BA m=2 N",N,kap(nx.barabasi_albert_graph(N,2,seed=1)))
    print("ER k4 N",N,kap(nx.gnm_random_graph(N,2*N,seed=1)))
# transmissibility
T=lambda b,g: b/(b+g-b*g)
for b,g in [(0.5,0.5),(0.2,0.5),(0.3,1),(0.1,0.2),(0.3,0.3)]: print("T",b,g,round(T(b,g),4))
for b,k in [(0.3,1),(0.3,2),(0.3,3),(0.5,2),(0.5,3)]: print("P inf",b,k,round(1-(1-b)**k,4))
# final size mixed
from scipy.optimize import brentq
for R in [1.5,2,3]:
    r=brentq(lambda r:r-1+math.exp(-R*r),1e-9,1); print("final size R0",R,round(r,4))
