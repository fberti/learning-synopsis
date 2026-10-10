import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, adjusted_rand_score
import pandas as pd
n=np.nan
R=np.array([[5,4,1,n,n,3],[4,5,2,1,3,n],[1,2,5,4,n,4],[5,5,2,2,4,n],[n,1,4,5,2,5]],float)
U=['Anna','Bence','Csilla','Dávid','Emese']
def sim(a,b,mode):
    m=~np.isnan(a)&~np.isnan(b)
    if m.sum()<2: return None
    x,y=a[m],b[m]
    if mode=='p': x=x-x.mean(); y=y-y.mean()
    d=np.linalg.norm(x)*np.linalg.norm(y)
    return None if d==0 else x@y/d
for mode in ['c','p']:
    s=[sim(R[0],R[v],mode) for v in range(1,5)]; print(mode,[None if t is None else round(t,3) for t in s])
    for i in [3,4]:
        num=den=0
        for v in range(1,5):
            if s[v-1] is None or np.isnan(R[v,i]): continue
            if mode=='c': num+=s[v-1]*R[v,i]; den+=abs(s[v-1])
            else: num+=s[v-1]*(R[v,i]-np.nanmean(R[v])); den+=abs(s[v-1])
        pred = num/den if mode=='c' else np.nanmean(R[0])+num/den
        print('  item',i,round(pred,3))
w=load_wine(); X=StandardScaler().fit_transform(w.data); y=w.target
print(np.bincount(y))
for k in range(2,7):
    km=KMeans(k,n_init=20,random_state=0).fit(X); print(k, round(km.inertia_,1), round(silhouette_score(X,km.labels_),3), round(adjusted_rand_score(y,km.labels_),3))
km=KMeans(3,n_init=20,random_state=0).fit(X); print(pd.crosstab(y,km.labels_))
ag=AgglomerativeClustering(3,linkage='ward').fit(X); print('ward ARI',adjusted_rand_score(y,ag.labels_)); print(pd.crosstab(y,ag.labels_))
Z2=PCA(2).fit_transform(X); km2=KMeans(3,n_init=20,random_state=0).fit(Z2); print('pca2 kmeans ARI',adjusted_rand_score(y,km2.labels_), silhouette_score(X,km2.labels_))
kmr=KMeans(3,n_init=20,random_state=0).fit(w.data); print('raw kmeans ARI',adjusted_rand_score(y,kmr.labels_)); print(pd.crosstab(y,kmr.labels_))
for e in [1.8,2.0,2.2,2.5]:
    db=DBSCAN(eps=e,min_samples=5).fit(X); print('db',e,set(db.labels_), (db.labels_==-1).sum())
