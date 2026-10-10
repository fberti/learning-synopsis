import numpy as np
from sklearn.datasets import load_wine, load_digits, load_iris
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
X=np.array([(-2,-2),(-1,1),(1,-1),(2,2)],float)
C=X.T@X/4; print(C, np.linalg.eigh(C)); print(np.linalg.svd(X,compute_uv=False))
for th in [0,30,45,60,90,135]:
    t=np.radians(th); u=np.array([np.cos(t),np.sin(t)]); print(th, u@C@u)
d=load_digits().data; p=PCA().fit(d); cs=np.cumsum(p.explained_variance_ratio_)
for q in [.5,.8,.9,.95,.99]: print(q, np.searchsorted(cs,q)+1)
print('digits 2:',cs[1], p.explained_variance_ratio_[:3])
w=load_wine(); Xw=w.data
p=PCA().fit(Xw); print('wine raw',np.round(p.explained_variance_ratio_[:3],4), np.round(p.components_[0],3))
print(w.feature_names)
print('stds',np.round(Xw.std(0),2))
ps=PCA().fit(StandardScaler().fit_transform(Xw)); print('wine std',np.round(ps.explained_variance_ratio_[:5],4), np.round(np.cumsum(ps.explained_variance_ratio_)[:6],4))
print('pc1 loadings std', dict(zip(w.feature_names,np.round(ps.components_[0],2))))
print('pc2 loadings std', dict(zip(w.feature_names,np.round(ps.components_[1],2))))
i=load_iris().data; print('iris raw',PCA().fit(i).explained_variance_ratio_, 'std',PCA().fit(StandardScaler().fit_transform(i)).explained_variance_ratio_)
# circle: points on circle
t=np.linspace(0,2*np.pi,12,endpoint=False); Xc=np.c_[np.cos(t),np.sin(t)]; print('circle',PCA().fit(Xc).explained_variance_ratio_)
