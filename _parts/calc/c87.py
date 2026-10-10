import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
P={'A':(2,25),'B':(3,30),'C':(2,28),'D':(12,5),'E':(15,4),'F':(11,6),'G':(3,27),'H':(14,5),'I':(7,14),'J':(8,16),'K':(6,15),'L':(14,28)}
N=list(P); X=np.array(list(P.values()),float)
print('mean',X.mean(0),'std(pop)',X.std(0))
Z=(X-X.mean(0))/X.std(0)
for name,D in [('raw',X),('std',Z)]:
    print(name)
    for k in range(1,7):
        km=KMeans(k,n_init=100,random_state=0).fit(D)
        s=silhouette_score(D,km.labels_) if k>1 else float('nan')
        print(' ',k, round(km.inertia_,3), round(s,3), ''.join(str(l) for l in km.labels_))
# IQR per feature, (n+1)p positions like ch4
def q(v,p):
    v=sorted(v); n=len(v); pos=(n+1)*p; i=int(pos); f=pos-i
    return v[i-1]+f*(v[i]-v[i-1])
for j,nm in enumerate(['vas','kosar']):
    v=X[:,j]; q1,q3=q(v,.25),q(v,.75); iqr=q3-q1
    print(nm,sorted(v),q1,q3,iqr,q1-1.5*iqr,q3+1.5*iqr)
