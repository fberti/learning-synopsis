from common import *
# Disparity filter
def disparity(G):
    a={}
    for u,v,d in G.edges(data=True):
        w=d["weight"]; out=[]
        for x in (u,v):
            k=G.degree(x); s=G.degree(x,weight="weight")
            out.append((1-w/s)**(k-1) if k>1 else 1.0)
        a[(u,v)]=out
    return a
print("hand", (3/13)**3, (12/13)**3)
G=nx.Graph()
M=comat(ART)
for i in range(7):
    for j in range(i+1,7):
        if M[i,j]: G.add_edge(ACT[i],ACT[j],weight=M[i,j])
for e,v in disparity(G).items(): print(e, G.edges[e]["weight"], ["%.3f"%x for x in v], "min %.3f"%min(v))
L=nx.les_miserables_graph()
print(L.number_of_nodes(), L.number_of_edges(), sum(d["weight"] for *_,d in L.edges(data=True)))
a=disparity(L)
for al in [0.05,0.1,0.2,0.3]:
    keep=[e for e,v in a.items() if min(v)<al]; H=L.edge_subgraph(keep)
    W=sorted((d["weight"] for *_,d in L.edges(data=True)),reverse=True)
    thr=W[len(keep)-1]; Gk=[(u,v) for u,v,d in L.edges(data=True) if d["weight"]>=thr]; H2=L.edge_subgraph(Gk)
    print("alpha",al,"edges",len(keep),"nodes",H.number_of_nodes(),"comps",nx.number_connected_components(H), "wshare %.3f"%(sum(L.edges[e]["weight"] for e in keep)/820),
          "| global thr>=%d edges %d nodes %d comps %d"%(thr,len(Gk),H2.number_of_nodes(),nx.number_connected_components(H2)))
for t in [1,2,3,5,10]:
    Gk=[(u,v) for u,v,d in L.edges(data=True) if d["weight"]>=t]; H2=L.edge_subgraph(Gk); print("thr",t,len(Gk),H2.number_of_nodes(),nx.number_connected_components(H2))
# weight distribution
from collections import Counter; print(sorted(Counter(d["weight"] for *_,d in L.edges(data=True)).items()))
