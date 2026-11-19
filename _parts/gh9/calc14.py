from common import *
T=nx.Graph([("NY","a"),("NY","b"),("NY","c"),("a","d"),("a","e"),("d","f"),("c","g")])
n=8; W=nx.wiener_index(T); print("NY tree W",W,"sv",W/(n*(n-1)/2))
# sizes subtree method
# branching q: 2 followers each reshare prob q
for q in [0.25,0.4,0.5]:
    R=2*q; print("q",q,"R",R,"P1",(1-q)**2,"mean",1/(1-R) if R<1 else "inf")
# P(size=2) for binomial(2,q): root has exactly 1 child and that child has 0: 2q(1-q)*(1-q)^2
q=.25; print("P2",2*q*(1-q)*(1-q)**2, "P3", None)
# exact distribution size via generating recursion
from functools import lru_cache
import math
def dist(q,N=12):
    # total progeny distribution for Bin(2,q) offspring via Lagrange: P(S=n)=1/n * P(sum of n offspring = n-1)
    return [ (1/nn)*math.comb(2*nn,nn-1)*q**(nn-1)*(1-q)**(2*nn-(nn-1)) for nn in range(1,N)]
d=dist(.25); print([round(x,4) for x in d[:5]], sum(d))
print("2 star star: path vs star wiener", nx.wiener_index(nx.star_graph(9))/45, nx.wiener_index(nx.path_graph(10))/45)
