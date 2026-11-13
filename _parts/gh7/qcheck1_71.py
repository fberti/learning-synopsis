# gh7-71 kvíz számainak ellenőrzése
import math, itertools, networkx as nx
from scipy.optimize import brentq
C = math.comb
# 1. G(12; 0,25)
n, p = 12, 0.25
print("Q1 pairs", C(n,2), "E(m)", p*C(n,2), "<k>", p*(n-1), "2m/n", 2*p*C(n,2)/n)
print("Q1 dist n^2", p*n*n, 2*p*n*n/n, " n(n-1)", p*n*(n-1), 2*p*n*(n-1)/n)
# 2. G(4,3) összefüggő
E = list(itertools.combinations(range(4),2)); con=tri=star=path=0
for es in itertools.combinations(E,3):
    G=nx.Graph(); G.add_nodes_from(range(4)); G.add_edges_from(es)
    degs=sorted(d for _,d in G.degree())
    if nx.is_connected(G):
        con+=1
        if degs==[1,1,1,3]: star+=1
        else: path+=1
    else: tri+=1
print("Q2 graphs", C(6,3), "conn", con, con/20, "tri", tri, tri/20, "star", star, "path", path, path/20)
# 3. izolált, 2000 csúcs, <k>=2
S = lambda k: brentq(lambda s: s-1+math.exp(-k*s), 1e-9, 1) if k>1 else 0.0
print("Q3 izolált", 2000*math.exp(-2), "nem óriás", 2000*(1-S(2)), "óriás", 2000*S(2))
# 4. küszöbök n=10000
n=10000
print("Q4 óriás p", 1/(n-1), "ln n", math.log(n), "p_conn", math.log(n)/(n-1), "log10 változat", math.log10(n)/(n-1))
# 5. S értékek
for k in [0.5,1.5,2,3,4]: print("Q5 S", k, round(S(k),3), "izolált", round(math.exp(-k),3))
# 6. n=10^6, <k>=100
n, k = 10**6, 100
print("Q6 l", math.log(n)/math.log(k), "C", k/(n-1), "1/k", 1/k, "ln n", math.log(n), "fordított", math.log(k)/math.log(n))
# 7. multi: <k>=3 izolált
print("Q7 e^-3", math.exp(-3))
# szöveg: G(10;0,2) p0, p1, Poisson
print("txt p0", 0.8**9, math.exp(-1.8), "p1", 9*0.2*0.8**8, 1.8*math.exp(-1.8))
s=1.0; it=[]
for _ in range(6): s=1-math.exp(-2*s); it.append(round(s,3))
print("txt S(2) iter", it)
print("txt E(triangles) G(10,0.2)", C(10,3)*0.2**3, "G(5,2)", C(10,2), "közös", 5*C(4,2))
print("txt 17 szórás", (17-156/34)/math.sqrt(156/34), math.sqrt(33*(156/34/33)*(1-156/34/33)))
