import json, networkx as nx
from networkx.algorithms.community import modularity, louvain_communities, girvan_newman
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read()
d=json.loads(s[s.index("{"):s.rindex("}")+1])
G=nx.Graph(); G.add_nodes_from(range(34)); G.add_edges_from(map(tuple,d["edges"]))
xy=d["xy"]; xs=[p[0] for p in xy]; ys=[p[1] for p in xy]
cols=["--setA","--setB","--setC","#a855f7","#ef4444","#14b8a6"]
def cstr(lab): return " ".join(f"{i+1}:{cols[c]}" for i,c in enumerate(lab))
def lab(parts):
    l=[0]*34
    # order parts by smallest member so that node 1's group gets color 0
    for i,c in enumerate(sorted(parts,key=min)):
        for v in c: l[v]=i
    return l
best=max((louvain_communities(G,seed=s) for s in range(50)),key=lambda c:modularity(G,c))
out={"KARATE_E":",".join(f"{a+1}-{b+1}" for a,b in d["edges"]),
 "KARATE_P":" ".join(f"{i+1}:{(p[0]-min(xs))/(max(xs)-min(xs))*1.6:.3f},{(p[1]-min(ys))/(max(ys)-min(ys)):.3f}" for i,p in enumerate(xy)),
 "KARATE_CLUB":cstr(d["club"]),
 "KARATE_GN2":cstr(lab(next(girvan_newman(G)))),
 "KARATE_LOUV":cstr(lab(best))}
json.dump(out,open("karate_attrs.json","w"),ensure_ascii=False)
print({k:len(v) for k,v in out.items()})
