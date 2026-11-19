from common import *
G=nx.Graph(); G.add_edge("A","B")
for i in range(1,6): G.add_edge("A",str(i)); G.add_edge("B",str(i))
for x in "xyz": G.add_edge("C",x)
print("deg",dict(G.degree()))
def cov(S): return len(set(S)|{u for s in S for u in G[s]})
print("cov A",cov("A"),"AB",cov("AB"),"AC",cov("AC"),"C",cov("C"), "gain B after A", cov("AB")-cov("A"), "gain C after A",cov("AC")-cov("A"))
for p in [0.2,0.5]:
    single={s:round(ic_exact(G,[s],p),3) for s in ["A","B","C","1","x"]}
    print("p",p,"single",single)
    print("  AB",round(ic_exact(G,["A","B"],p),3),"AC",round(ic_exact(G,["A","C"],p),3),"A1",round(ic_exact(G,["A","1"],p),3))
H=arv()
for p in [0.3,0.5]:
    single={s:ic_exact(H,[s],p) for s in H}
    best=max(single,key=single.get)
    pairs={(a,b):ic_exact(H,[a,b],p) for a,b in itertools.combinations(H,2)}
    top=sorted(pairs.items(),key=lambda x:-x[1])[:6]
    g2={s:pairs.get((best,s),pairs.get((s,best))) for s in H if s!=best}
    print("p",p,"best1",best,round(single[best],3),"greedy2",max(g2,key=g2.get),{k:round(v,3) for k,v in g2.items()})
    print("  top pairs",[(k,round(v,3)) for k,v in top])
    print("  Ko+Po",round(pairs[("Ko","Po")],3))
