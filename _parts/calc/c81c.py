import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_samples, silhouette_score
def lloyd1d(x,c,verbose=True):
    x=np.array(x,float); c=np.array(c,float)
    for t in range(10):
        lab=np.abs(x[:,None]-c[None]).argmin(1); s1=((x-c[lab])**2).sum()
        c2=np.array([x[lab==k].mean() if (lab==k).any() else c[k] for k in range(len(c))]); s2=((x-c2[lab])**2).sum()
        if verbose: print(' it',t+1,'lab',lab,'SSE assign',round(s1,3),'cents',np.round(c2,3),'SSE upd',round(s2,3))
        if np.allclose(c2,c): break
        c=c2
    return c
print('ex1'); lloyd1d([1,2,6,9,10],[1,2])
print('pr1'); lloyd1d([1,3,8,10],[1,3])
print('pr', np.var([2,4,9])*3)
print('1,2,3,10', np.var([1,2,3])*3, np.var([3,10])*2+0.5)
# new customer
c1=np.array([12+2/3,5]); c2=np.array([2+2/3,27+1/3]); q=np.array([13,6])
print('newcust', ((q-c1)**2).sum(), ((q-c2)**2).sum())
# silhouette 1D
x=np.array([1,2,3,7,8.]).reshape(-1,1); lab=np.array([0,0,0,1,1])
print('sil2', silhouette_samples(x,lab), silhouette_score(x,lab))
lab3=np.array([0,0,1,2,2]); print('sil3', silhouette_samples(x,lab3), silhouette_score(x,lab3))
lab3b=np.array([0,1,1,2,2]); print('sil3b', silhouette_samples(x,lab3b), silhouette_score(x,lab3b))
# outlier steals cluster
x=np.array([1,2,3,4,10,11,12,40.]).reshape(-1,1)
for k in [2,3]:
    km=KMeans(k,n_init=50,random_state=0).fit(x); print('outlier k',k,km.labels_,km.cluster_centers_.ravel(),km.inertia_)
x2=x[:-1]; km=KMeans(2,n_init=50,random_state=0).fit(x2); print('no outlier',km.labels_,km.cluster_centers_.ravel(),km.inertia_)
# medoid: {1,2,3,4,10,11,12,40} k=2 medoids
import itertools
pts=x.ravel()
best=min(((sum(min(abs(p-pts[i]),abs(p-pts[j])) for p in pts),pts[i],pts[j]) for i,j in itertools.combinations(range(len(pts)),2)))
print('k-medoids L1 best',best)
best=min(((sum(min((p-pts[i])**2,(p-pts[j])**2) for p in pts),pts[i],pts[j]) for i,j in itertools.combinations(range(len(pts)),2)))
print('k-medoids L2 best',best)
# kmeans++ practice: points 0,1,5 ; first center 0 
d2=np.array([0,1,25.]); print(d2/d2.sum())
print('restarts p=.2', np.log(0.05)/np.log(0.8))
# scale example P(2,15) Q(14,15) R(2,17)
P=np.array([2,15.]);Q=np.array([14,15.]);R=np.array([2,17.])
print(np.linalg.norm(P-Q),np.linalg.norm(P-R)); P2=P*[1,1000];Q2=Q*[1,1000];R2=R*[1,1000]; print(np.linalg.norm(P2-Q2),np.linalg.norm(P2-R2))
