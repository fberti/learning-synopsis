from common import *
L=nx.les_miserables_graph()
def disp(G):
    a={}
    for u,v,d in G.edges(data=True):
        w=d["weight"]; out=[]
        for x in (u,v):
            k=G.degree(x); s=G.degree(x,weight="weight"); out.append((1-w/s)**(k-1) if k>1 else 1.0)
        a[(u,v)]=min(out)
    return a
a=disp(L); order=sorted(a,key=a.get)
byw=sorted(L.edges(data="weight"),key=lambda e:-e[2])
for al in [0.05,0.1,0.2,0.3]:
    keep=[e for e in order if a[e]<al]; m=len(keep); H=L.edge_subgraph(keep)
    H2=L.edge_subgraph([(u,v) for u,v,w in byw[:m]])
    only=set(H)-set(H2); only2=set(H2)-set(H)
    print(al,m,"disp nodes",H.number_of_nodes(),"comps",nx.number_connected_components(H),"| top-m nodes",H2.number_of_nodes(),"comps",nx.number_connected_components(H2), "\n  only disp:",sorted(only),"\n  only glob:",sorted(only2))
# smallest weight edge kept by disparity at 0.2 and largest weight dropped
keep=[e for e in order if a[e]<0.2]
print("min w kept", min(L.edges[e]["weight"] for e in keep), [ (e,L.edges[e]["weight"],round(a[e],3)) for e in keep if L.edges[e]["weight"]<=2])
drop=[e for e in L.edges() if a.get(e, a.get((e[1],e[0]))) >=0.2]
print("max w dropped", sorted([(L.edges[e]["weight"],e) for e in drop])[-5:])
print("Valjean deg", L.degree("Valjean"), L.degree("Valjean",weight="weight"))
