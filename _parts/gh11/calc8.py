# node2vec (SGNS) + logisztikus regresszió Hadamard-jellemzőkkel, karateklub, 20 felosztás
from common import *
from lp import *
from calc5 import split
K=nx.Graph(nx.karate_club_graph().edges()); R=random.Random(11)
def lr_fit(X,y,l2=1.0,it=2000,lr=0.1):
    w=np.zeros(X.shape[1]); b=0.0
    for _ in range(it):
        p=1/(1+np.exp(-(X@w+b))); g=p-y
        w-=lr*(X.T@g/len(y)+l2*w/len(y)); b-=lr*g.mean()
    return w,b
res={"cos":[],"lr":[]}
for r in range(20):
    H,test=split(K,0.1,R); nodes=list(H.nodes())
    ws=walks(H,num=10,length=20,seed=R.randint(0,10**6)); Z=sgns(ws,nodes,dim=16,window=5,epochs=1,seed=r)
    non=[(u,v) for u,v in itertools.combinations(K.nodes(),2) if not K.has_edge(u,v)]
    trpos=list(H.edges()); trneg=R.sample([(u,v) for u,v in itertools.combinations(nodes,2) if not H.has_edge(u,v)],len(trpos))
    X=np.array([Z[u]*Z[v] for u,v in trpos+trneg]); y=np.array([1]*len(trpos)+[0]*len(trneg))
    w,b=lr_fit(X,y)
    f=lambda u,v: float(Z[u]*Z[v]@w+b); c=lambda u,v: float(Z[u]@Z[v]/np.linalg.norm(Z[u])/np.linalg.norm(Z[v]))
    res["lr"].append(auc([f(*e) for e in test],[f(*e) for e in non])); res["cos"].append(auc([c(*e) for e in test],[c(*e) for e in non]))
print({k:(round(np.mean(v),3),round(np.std(v),3)) for k,v in res.items()})
