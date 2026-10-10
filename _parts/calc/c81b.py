import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, silhouette_samples
P={'A':(2,25),'B':(3,30),'C':(2,28),'D':(12,5),'E':(15,4),'F':(11,6),'G':(3,27),'H':(14,5)}
def lloyd(names, cents, it=5):
    X=np.array([P[n] for n in names],float); C=np.array(cents,float)
    for t in range(it):
        d=((X[:,None,:]-C[None])**2).sum(-1)
        lab=d.argmin(1)
        sse_assign=d[np.arange(len(X)),lab].sum()
        print('iter',t+1,'dist2:',{n:list(np.round(d[i],2)) for i,n in enumerate(names)})
        print('  assign',{n:int(lab[i]) for i,n in enumerate(names)},'SSE after assign',round(sse_assign,2))
        C=np.array([X[lab==k].mean(0) for k in range(len(C))])
        sse_upd=((X-C[lab])**2).sum()
        print('  new cents',np.round(C,3),'SSE after update',round(sse_upd,3))
names=list('ABDEFG')
print('initial SSE with cents A,B:')
lloyd(names,[P['A'],P['B']],3)
# 1D stuck example
x=np.array([0,2,10,12,20,22.])
def run1d(c):
    c=np.array(c,float)
    for t in range(10):
        lab=np.abs(x[:,None]-c[None]).argmin(1); c=np.array([x[lab==k].mean() for k in range(len(c))])
    return c, ((x-c[lab])**2).sum(), lab
print(run1d([0,2,16])); print(run1d([0,10,20]))
# kmeans++ probabilities with first center 0
d2=(x-0)**2; print(d2, d2.sum(), d2/d2.sum(), (d2[4]+d2[5])/d2.sum(), (d2[2]+d2[3])/d2.sum())
print('restarts', 1-0.7**10, 1-0.7**5)
# elbow on 8 customers
X=np.array(list(P.values()),float)
for k in range(1,7):
    km=KMeans(k,n_init=50,random_state=0).fit(X)
    s=silhouette_score(X,km.labels_) if k>1 else None
    print(k, round(km.inertia_,2), s, km.labels_)
