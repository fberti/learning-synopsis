import networkx as nx, itertools as it, numpy as np, random, json
from math import comb
def g(s): G=nx.Graph(); G.add_edges_from(tuple(x.split("-")) for x in s.split(",")); return G
A=g("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön")
def load(path,var):
    s=open(path,encoding="utf-8").read(); s=s[s.index(var+" = ")+len(var)+3:]; s=s[:s.rindex("}")+1]; return json.loads(s)
K=load("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","window.KARATE13")
KG=nx.Graph(); KG.add_edges_from(map(tuple,K["edges"]))
def gnm_exp(n,m):
    N=comb(n,2); return comb(n,3)*m*(m-1)*(m-2)/(N*(N-1)*(N-2))
def tri(G): return sum(nx.triangles(G).values())//3
for name,G in [("arviz",A),("karate",KG)]:
    n,m=G.number_of_nodes(),G.number_of_edges()
    rng=random.Random(1)
    gn=[tri(nx.gnm_random_graph(n,m,seed=rng.randrange(10**9))) for _ in range(4000)]
    cf=[]
    for s in range(2000):
        H=G.copy(); nx.double_edge_swap(H,nswap=10*m,max_tries=10**6,seed=rng.randrange(10**9)); cf.append(tri(H))
    print(name,"obs",tri(G),"Gnm exact",round(gnm_exp(n,m),3),"Gnm sim",round(np.mean(gn),3),round(np.std(gn),3),
          "z",round((tri(G)-np.mean(gn))/np.std(gn),2),"| degpres",round(np.mean(cf),3),round(np.std(cf),3),"z",round((tri(G)-np.mean(cf))/np.std(cf),2),
          "P(>=obs) gnm",np.mean(np.array(gn)>=tri(G)),"deg",np.mean(np.array(cf)>=tri(G)))
    print("  wedges open",sum(d*(d-1)//2 for _,d in G.degree())-3*tri(G))
# signed Árvízhét
rel=[("Ko","Vi",1),("Sz","Vi",1),("Po","Ko",1),("Vi","Po",1),("Sz","Ko",-1),("La","Ön",1),("Po","La",1),("Po","Ön",1)]
S=nx.Graph()
for a,b,s in rel: S.add_edge(a,b,s=s)
for c in [c for c in nx.enumerate_all_cliques(S) if len(c)==3]:
    p=np.prod([S[c[i]][c[j]]["s"] for i,j in [(0,1),(1,2),(0,2)]]); print("tri",c,p)
# balance check: BFS 2-coloring
def balanced(S):
    col={}
    for s0 in S:
        if s0 in col: continue
        col[s0]=0; q=[s0]
        while q:
            u=q.pop()
            for v in S[u]:
                want=col[u]^(S[u][v]["s"]<0)
                if v not in col: col[v]=want; q.append(v)
                elif col[v]!=want: return False,None
    return True,col
print("arviz balanced?",balanced(S)[0])
# frustration: min flips
E=list(S.edges()); best=None
for k in range(0,4):
    for fl in it.combinations(E,k):
        T=S.copy()
        for u,v in fl: T[u][v]["s"]*=-1
        b,col=balanced(T)
        if b: print("flip",fl,col); best=k
    if best is not None: print("frustration",best); break
