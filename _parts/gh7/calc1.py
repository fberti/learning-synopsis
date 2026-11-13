import networkx as nx, numpy as np, math
from scipy import stats
from math import comb
# 7.1 ER
print("G(10,.2): m", .2*comb(10,2), "k", .2*9)
print("n=4 p=.5 degree B(3,.5)", [stats.binom.pmf(k,3,.5) for k in range(4)])
print("n=3 graphs: P(m=k) p=.5:", [comb(3,k)*.5**3 for k in range(4)], "p=.3", [comb(3,k)*.3**k*.7**(3-k) for k in range(4)])
# Poisson approx n=1000, k=4
for kk in [2,4,10]:
  print("poisson k",kk,[round(stats.poisson.pmf(k,kk),4) for k in range(0,12)])
print("binom vs poisson n=100,p=.04 k=4:",stats.binom.pmf(4,99,.04),stats.poisson.pmf(4,3.96))
# giant component S=1-exp(-cS)
from scipy.optimize import brentq
for c in [0.5,1,1.5,2,3,4,5]:
  S = 0 if c<=1 else brentq(lambda S: S-1+math.exp(-c*S),1e-9,1)
  print("c",c,"S",round(S,4))
print("ln1000",math.log(1000), "p conn", math.log(1000)/999)
# l approx
print("l n=1e6 k=10:",math.log(1e6)/math.log(10), " 8e9,k=1000:",math.log(8e9)/math.log(1000))
# karate
K=nx.karate_club_graph(); K=nx.Graph(K.edges())
n,m=K.number_of_nodes(),K.number_of_edges()
print("karate",n,m,"avgk",2*m/n,"C",nx.average_clustering(K),"T",nx.transitivity(K),"L",nx.average_shortest_path_length(K),"diam",nx.diameter(K),"maxdeg",max(d for _,d in K.degree()))
p=2*m/(n*(n-1)); print("p",p)
R=np.random.default_rng(1); Cs=[];Ls=[];md=[];Ts=[]
for s in range(2000):
  G=nx.gnm_random_graph(n,m,seed=int(R.integers(1e9)))
  Cs.append(nx.average_clustering(G)); Ts.append(nx.transitivity(G)); md.append(max(d for _,d in G.degree()))
  if nx.is_connected(G): Ls.append(nx.average_shortest_path_length(G))
  else:
    Gc=G.subgraph(max(nx.connected_components(G),key=len)); Ls.append(nx.average_shortest_path_length(Gc))
print("ER karate: C",np.mean(Cs),"T",np.mean(Ts),"L(giant)",np.mean(Ls),"maxdeg",np.mean(md),np.percentile(md,[5,95]), "P(maxdeg>=17)",np.mean(np.array(md)>=17))
