import numpy as np, networkx as nx
deg={"Ko":4,"Po":4,"Vi":3,"Sz":3,"Kl":2,"La":2,"Ön":2}
ks=list(deg.values()); R=np.random.default_rng(1)
S=200000; simple=0; loops=0; multi=0; LaOn=0
stubs=[i for i,k in enumerate(ks) for _ in range(k)]
for s in range(S):
  p=R.permutation(stubs).reshape(-1,2)
  l=(p[:,0]==p[:,1]).sum(); loops+=l
  pairs=[tuple(sorted(x)) for x in p if x[0]!=x[1]]
  mu=len(pairs)-len(set(pairs)); multi+= mu>0
  simple+= (l==0 and mu==0)
  LaOn+=sum(1 for x in pairs if x==(5,6))
print("P simple",simple/S,"mean loops",loops/S,"P(multi)",multi/S,"E La-On",LaOn/S, 4/19)
import math; print("19!!",math.prod(range(1,20,2)), "sumC2",sum(k*(k-1)//2 for k in ks), 21/19)
G=nx.Graph([("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")])
t=[]
for s in range(20000):
  H=G.copy(); nx.double_edge_swap(H,nswap=100,max_tries=10000,seed=int(R.integers(1e9))); t.append(sum(nx.triangles(H).values())//3)
t=np.array(t); print("config tri",t.mean(),t.std(),"P>=4",(t>=4).mean(),"dist",np.bincount(t)/len(t))
t2=[]
for s in range(20000):
  H=nx.gnm_random_graph(7,10,seed=int(R.integers(1e9))); t2.append(sum(nx.triangles(H).values())//3)
t2=np.array(t2); print("gnm tri",t2.mean(),t2.std(),"P>=4",(t2>=4).mean())
print(351*306/33427, 12/39)
