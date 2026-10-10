import numpy as np, json, warnings
warnings.filterwarnings('ignore')
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE, trustworthiness
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score
import umap
d=load_digits(); X,y=d.data,d.target
rng=np.random.RandomState(0)
idx=np.sort(np.concatenate([rng.choice(np.where(y==c)[0],80,replace=False) for c in range(10)]))
Xs,ys=X[idx],y[idx]
print(len(idx))
emb={}
p=PCA(2).fit(Xs); emb['pca']=p.transform(Xs); print('pca evr',p.explained_variance_ratio_)
for perp in [5,30,100]:
    emb[f'tsne{perp}']=TSNE(2,perplexity=perp,random_state=0,init='pca').fit_transform(Xs)
emb['tsne30b']=TSNE(2,perplexity=30,random_state=1,init='random').fit_transform(Xs)
emb['umap']=umap.UMAP(n_neighbors=15,min_dist=0.1,random_state=0).fit_transform(Xs)
out={'y':ys.tolist(),'px':[''.join('%x'%min(15,int(v)) for v in row) for row in Xs]}
stats={}
for k,E in emb.items():
    E=(E-E.min(0)); E=E/E.max(); 
    out[k]=[[round(float(a),3),round(float(b),3)] for a,b in E]
    acc=cross_val_score(KNeighborsClassifier(5),E,ys,cv=5).mean()
    tw=trustworthiness(Xs,E,n_neighbors=10)
    stats[k]=(round(acc,3),round(tw,3)); print(k,stats[k])
acc64=cross_val_score(KNeighborsClassifier(5),Xs,ys,cv=5).mean(); print('64d knn',acc64)
open('../digits-data.js','w').write('/* 800 kézzel írt számjegy (scikit-learn digits, 8×8 pixel) 2D-beágyazásai – előre kiszámolva (lásd a fejezet 🐍 kódját) */\nwindow.DIGITS = '+json.dumps(out,separators=(',',':'))+';\n')
