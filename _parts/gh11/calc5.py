from common import *
from lp import *
import sys
K=nx.karate_club_graph(); K=nx.Graph(K.edges())
print(K.number_of_nodes(),K.number_of_edges())
def split(G,frac,R):
    E=list(G.edges()); R.shuffle(E); test=[]; H=G.copy()
    for e in E:
        if len(test)>=round(frac*G.number_of_edges()): break
        H.remove_edge(*e)
        if H.degree(e[0])==0 or H.degree(e[1])==0 or not nx.is_connected(H): H.add_edge(*e); continue
        test.append(e)
    return H,test
def evaluate(G,H,test,R,methods,leakG=None):
    S=leakG or H
    non=[(u,v) for u,v in itertools.combinations(G.nodes(),2) if not G.has_edge(u,v)]
    res={}
    for m in methods:
        if m in ("CN","J","AA","RA","PA"):
            f=lambda u,v: heur(S,u,v)[m]
        elif m.startswith("spec"):
            d=int(m[4:]); Z,_=spectral(S,d); f=lambda u,v: -np.linalg.norm(Z[u]-Z[v])
        elif m.startswith("n2v"):
            ws=walks(S,num=10,length=20,p=1,q=1,seed=R.randint(0,10**6)); Z=sgns(ws,list(S.nodes()),dim=16,window=5,epochs=1,seed=1)
            f=lambda u,v: float(Z[u]@Z[v]/np.linalg.norm(Z[u])/np.linalg.norm(Z[v]))
        elif m.startswith("ppmi"):
            ws=walks(S,num=10,length=20,seed=R.randint(0,10**6)); nodes=list(S.nodes()); E_=ppmi_embed(cooc(ws,nodes,5),dim=8); Z={n:E_[i] for i,n in enumerate(nodes)}
            f=lambda u,v: float(Z[u]@Z[v])
        res[m]=auc([f(*e) for e in test],[f(*e) for e in non])
    return res
if __name__=="__main__":
    R=random.Random(7); meth=["CN","J","AA","RA","PA","spec2","spec8","ppmi","n2v"]
    runs=int(sys.argv[1]) if len(sys.argv)>1 else 10
    acc={m:[] for m in meth}; leak={m:[] for m in meth}
    for r in range(runs):
        H,test=split(K,0.1,R)
        a=evaluate(K,H,test,R,meth); b=evaluate(K,H,test,R,meth,leakG=K)
        for m in meth: acc[m].append(a[m]); leak[m].append(b[m])
    for m in meth: print(m, "clean %.3f ± %.3f"%(np.mean(acc[m]),np.std(acc[m])), "leaky %.3f"%np.mean(leak[m]))
