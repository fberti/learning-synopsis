import json,re,numpy as np,networkx as nx,math
s=open("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js",encoding="utf-8").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1])
E=d["edges"]; n=d["n"]
G=nx.Graph(); G.add_nodes_from(range(n))
for i in range(0,len(E),2): G.add_edge(E[i],E[i+1])
G.remove_edges_from(nx.selfloop_edges(G))
deg=np.array([k for _,k in G.degree()])
print("polblogs undirected n",n,"m",G.number_of_edges(),"mean k",deg.mean(),"max",deg.max(),"median",np.median(deg),"<k2>/<k>",(deg**2).mean()/deg.mean())
print("C avg",nx.average_clustering(G),"trans",nx.transitivity(G),"L",nx.average_shortest_path_length(G))
print("top degs",sorted(deg)[-10:])
# ER same n,m: expected max deg (poisson), P(k>=100)
from scipy import stats
lam=deg.mean(); print("ER P(k>=100)",stats.poisson.sf(99,lam),"n*",n*stats.poisson.sf(99,lam), "ER max ~", [k for k in range(200) if n*stats.poisson.sf(k-1,lam)<0.5][0])
print("frac deg<=10", (deg<=10).mean(), " deg>=100",(deg>=100).sum())
import powerlaw
f=powerlaw.Fit(deg,discrete=True,verbose=False)
print("powerlaw alpha",f.power_law.alpha,"xmin",f.power_law.xmin,"ntail",(deg>=f.power_law.xmin).sum())
for alt in ["lognormal","exponential","truncated_power_law"]:
  R,p=f.distribution_compare("power_law",alt); print("pl vs",alt,R,p)
f1=powerlaw.Fit(deg,discrete=True,xmin=1,verbose=False); print("alpha xmin=1",f1.power_law.alpha)
# naive LS on log-log histogram
ks,cnt=np.unique(deg,return_counts=True); pk=cnt/n
sl=np.polyfit(np.log10(ks),np.log10(pk),1); print("naive hist slope",sl)
# CCDF slope
cc=np.array([(deg>=k).mean() for k in ks]); sl2=np.polyfit(np.log10(ks),np.log10(cc),1); print("ccdf slope",sl2,"-> gamma",1-sl2[0])
# karate & arviz friendship paradox
K=nx.Graph(nx.karate_club_graph().edges()); dk=np.array([k for _,k in K.degree()])
print("karate <k>",dk.mean(),"<k2>/<k>",(dk**2).mean()/dk.mean())
