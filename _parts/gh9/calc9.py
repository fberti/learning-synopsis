from common import *
G,d=polblogs(); lean=d["lean"]; n=G.number_of_nodes()
rng=np.random.default_rng(5)
def thresh(seeds,theta):
    A=set(seeds)
    while True:
        new={v for v in G if v not in A and sum(1 for u in G[v] if u in A)/G.degree(v)>=theta}
        if not new: return A
        A|=new
for theta in [0.1,0.15,0.2,0.25,0.3]:
    out=[]
    for side in [0,1]:
        nodes=[v for v in G if lean[v]==side]
        for s in rng.choice(nodes,30):
            # seed: top 20 nodes of that side? use seed + its neighbours on same side
            S={int(s)}|{u for u in G[int(s)] if lean[u]==side}
            A=thresh(S,theta); out.append((side,len(S),len(A),sum(1 for v in A if lean[v]==side),sum(1 for v in A if lean[v]!=side)))
    o=np.array(out)
    print("theta",theta,"seedsize",o[:,1].mean().round(1),"final",o[:,2].mean().round(1),"own",o[:,3].mean().round(1),"other",o[:,4].mean().round(1), "own side size",(n-sum(lean)),sum(lean))
