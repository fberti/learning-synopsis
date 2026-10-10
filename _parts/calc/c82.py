import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.cluster import DBSCAN
x=np.array([1,2,4,8,9.]).reshape(-1,1)
for m in ['single','complete','average','ward','centroid']:
    print(m, linkage(x,m))
A=np.array([1,2,4.]);B=np.array([8,9.])
D=np.abs(A[:,None]-B[None]); print('single',D.min(),'complete',D.max(),'avg',D.mean())
nA,nB=3,2; print('ward dSSE', nA*nB/(nA+nB)*(A.mean()-B.mean())**2, 'sqrt(2dSSE)',np.sqrt(2*nA*nB/(nA+nB)*(A.mean()-B.mean())**2))
# chain: 0,1,2,3,4,5 then 
x=np.array([0,1,2,3,4,5,6,7,8.]).reshape(-1,1)
# DBSCAN example
x=np.array([1,2,3,4,10,11,12,20.]).reshape(-1,1)
db=DBSCAN(eps=1.5,min_samples=3).fit(x); print('db',db.labels_, db.core_sample_indices_)
for e,m in [(1.5,2),(1.0,3),(2,4),(10,3)]:
    db=DBSCAN(eps=e,min_samples=m).fit(x); print(e,m,db.labels_, x.ravel()[db.core_sample_indices_])
# neighbor counts
for p in x.ravel(): print(p, int((np.abs(x.ravel()-p)<=1.5).sum()))
