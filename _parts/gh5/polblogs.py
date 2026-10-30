import networkx as nx, numpy as np, json, re
txt=open("dl/polblogs.gml",encoding="utf-8").read()
nodes={}; 
for m in re.finditer(r'node \[\s*id (\d+)\s*label "([^"]*)"\s*value (\d)',txt): nodes[int(m[1])]=(m[2],int(m[3]))
edges=[(int(a),int(b)) for a,b in re.findall(r'edge \[\s*source (\d+)\s*target (\d+)',txt)]
G=nx.DiGraph(); G.add_nodes_from(nodes); G.add_edges_from((a,b) for a,b in edges if a!=b)
print("raw",G.number_of_nodes(),G.number_of_edges(),"multi raw",len(edges))
cc=max(nx.weakly_connected_components(G),key=len); G=G.subgraph(cc).copy()
print("giant",G.number_of_nodes(),G.number_of_edges())
lean={v:nodes[v][1] for v in G}
print("left",sum(1 for v in G if lean[v]==0),"right",sum(1 for v in G if lean[v]==1))
cross=sum(1 for a,b in G.edges() if lean[a]!=lean[b]); print("cross edges",cross, round(cross/G.number_of_edges(),3))
pr=nx.pagerank(G,0.85); h,a=nx.hits(G,max_iter=1000); ind=dict(G.in_degree()); outd=dict(G.out_degree())
def top(d,k=10): return [(nodes[v][0],lean[v],round(d[v],4)) for v in sorted(d,key=lambda v:-d[v])[:k]]
for nm,d in [("indeg",ind),("outdeg",outd),("pr",pr),("auth",a),("hub",h)]:
  t=top(d); print(nm,"right in top10:",sum(x[1] for x in t)); [print("   ",x) for x in t]
V=list(G)
def sp(x,y):
  rx=np.argsort(np.argsort(x)); ry=np.argsort(np.argsort(y)); return round(np.corrcoef(rx,ry)[0,1],2)
print("spearman pr-indeg",sp([pr[v] for v in V],[ind[v] for v in V]),"auth-indeg",sp([a[v] for v in V],[ind[v] for v in V]),"hub-out",sp([h[v] for v in V],[outd[v] for v in V]))
# top-10 overlap
def T(d,k=10): return set(sorted(d,key=lambda v:-d[v])[:k])
print("overlap pr/indeg",len(T(pr)&T(ind)),"auth/indeg",len(T(a)&T(ind)),"hub/auth",len(T(h)&T(a)))
# auth/hub sums by side
print("auth share right", round(sum(a[v] for v in V if lean[v]==1)/sum(a.values()),3), "hub share right", round(sum(h[v] for v in V if lean[v]==1)/sum(h.values()),3), "pr share right", round(sum(pr[v] for v in V if lean[v]==1),3))
# layout
U=G.to_undirected()
pos=nx.spring_layout(U,seed=7,iterations=200)
idx={v:i for i,v in enumerate(V)}
xy=np.array([pos[v] for v in V]); xy=(xy-xy.min(0))/(xy.max(0)-xy.min(0))
data={"n":len(V),"names":[nodes[v][0] for v in V],"lean":[lean[v] for v in V],
 "xy":[round(float(c),3) for p in xy for c in p],
 "edges":[x for e in G.edges() for x in (idx[e[0]],idx[e[1]])],
 "pr":[round(pr[v],6) for v in V],"auth":[round(a[v],6) for v in V],"hub":[round(h[v],6) for v in V],"indeg":[ind[v] for v in V],"outdeg":[outd[v] for v in V]}
s="/* Politikai blogok (Adamic–Glance, 2005), óriáskomponens – előre számolva: _parts/gh5/polblogs.py\n   lean: 0 = liberális, 1 = konzervatív; xy: erőirányított elrendezés; edges: [forrás, cél, …] lapítva */\nwindow.POLBLOGS = "+json.dumps(data,separators=(",",":"),ensure_ascii=False)+";\n"
open("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js","w").write(s); print("bytes",len(s))
