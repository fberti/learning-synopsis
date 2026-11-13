import json,numpy as np,networkx as nx
s=open("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js",encoding="utf-8").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1]); E=d["edges"]; n=d["n"]
G=nx.Graph(); G.add_nodes_from(range(n))
for i in range(0,len(E),2):
  if E[i]!=E[i+1]: G.add_edge(E[i],E[i+1])
deg=np.array([k for _,k in G.degree()])
def mle(deg,kmin):
  t=deg[deg>=kmin]; return 1+len(t)/np.log(t/(kmin-0.5)).sum(), len(t)
for kmin in [1,5,10,20,29,50,100]: print("polblogs kmin",kmin,mle(deg,kmin))
K=np.array([k for _,k in nx.Graph(nx.karate_club_graph().edges()).degree()])
for kmin in [1,3,5]: print("karate",kmin,mle(K,kmin))
B=np.array([k for _,k in nx.barabasi_albert_graph(1000,2,seed=0).degree()])
for kmin in [2,3,5,10]: print("BA",kmin,mle(B,kmin))
# ccdf slope polblogs on k>=29
ks=np.unique(deg); cc=np.array([(deg>=k).mean() for k in ks]); sel=ks>=29
print("ccdf slope k>=29",np.polyfit(np.log10(ks[sel]),np.log10(cc[sel]),1))
print("ER 1000, <k>=0.5,1,1.5,2,3 sim largest comp frac:")
rng=np.random.default_rng(0)
for c in [0.5,1,1.5,2,3,4]:
  fr=[]
  for t in range(30):
    H=nx.fast_gnp_random_graph(1000,c/999,seed=int(rng.integers(1e9))); fr.append(len(max(nx.connected_components(H),key=len))/1000)
  print(c,round(np.mean(fr),3),"isolated theory",round(np.exp(-c),3))
