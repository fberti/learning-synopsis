import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.ensemble import IsolationForest
P={'A':(2,25),'B':(3,30),'C':(2,28),'D':(12,5),'E':(15,4),'F':(11,6),'G':(3,27),'H':(14,5),'I':(7,14),'J':(8,16),'K':(6,15),'L':(14,28)}
N=list(P); X=np.array(list(P.values()),float)
X11=X[:11]; Z11=(X11-X11.mean(0))/X11.std(0)
print('11 mean',X11.mean(0),'std',X11.std(0))
for k in range(1,6):
    km=KMeans(k,n_init=100,random_state=0).fit(Z11)
    s=silhouette_score(Z11,km.labels_) if k>1 else float('nan')
    print(k, round(km.inertia_,3), round(s,3), ''.join(map(str,km.labels_)))
km=KMeans(3,n_init=100,random_state=0).fit(X11); print('raw k3 cents',km.cluster_centers_, km.labels_)
# anomaly scores on all 12, standardized with all 12
Z=(X-X.mean(0))/X.std(0)
D=np.sqrt(((Z[:,None]-Z[None])**2).sum(-1))
for k in [1,2,3]:
    kd=np.sort(D,1)[:,k]
    print('kNN dist k=',k,{N[i]:round(kd[i],2) for i in np.argsort(-kd)[:4]})
# raw-scale kNN (ezer Ft)
Dr=np.sqrt(((X[:,None]-X[None])**2).sum(-1))
kd=np.sort(Dr,1)[:,2]; print('raw k=2',{N[i]:round(kd[i],2) for i in np.argsort(-kd)})
# centroid distance with k=3 fit on 11 (raw)
C=km.cluster_centers_
dc=np.sqrt(((X[:,None]-C[None])**2).sum(-1)).min(1); print('cent dist raw',{N[i]:round(dc[i],2) for i in np.argsort(-dc)[:5]})
iso=IsolationForest(n_estimators=500,random_state=0).fit(X)
sc=-iso.score_samples(X); print('iforest',{N[i]:round(sc[i],3) for i in np.argsort(-sc)})
# Ft scale clustering
Xf=X11.copy(); Xf[:,1]*=1000
km=KMeans(3,n_init=50,random_state=0).fit(Xf); print('Ft labels',km.labels_, km.cluster_centers_)
