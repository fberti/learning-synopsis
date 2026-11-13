import numpy as np, torch, torch.nn as nn
from sklearn.neural_network import MLPClassifier
from c14_common import get_data
Xtr,Xte,ytr,yte=get_data()
clf=MLPClassifier((64,),max_iter=2000,random_state=0,alpha=1e-3).fit(Xtr,ytr)
def mlp(*s,last=None):
    L=[]
    for a,b in zip(s[:-1],s[1:]): L+=[nn.Linear(a,b),nn.ReLU()]
    L=L[:-1]
    if last: L.append(last)
    return nn.Sequential(*L)
xtr=torch.tensor(Xtr/16,dtype=torch.float32); rng=np.random.default_rng(2)
def stats(X):
    p=clf.predict_proba(X); c=p.max(1); 
    d=np.sqrt(((X[:,None]-Xtr[None])**2).sum(-1)).min(1)
    return "conf %.3f >0.9 %.2f  nn-med %.1f"%(c.mean(),(c>.9).mean(),np.median(d))
print("test",stats(Xte))
for k in (2,8,16):
    st=torch.load("c14_ae%d.pt"%k); e=mlp(64,128,k); d=mlp(k,128,64,last=nn.Sigmoid()); e.load_state_dict(st["enc"]); d.load_state_dict(st["dec"])
    with torch.no_grad():
        z=e(xtr).numpy()
        zr=rng.standard_normal((450,k))*z.std(0)+z.mean(0)
        X=d(torch.tensor(zr,dtype=torch.float32)).numpy()*16
        zs=rng.standard_normal((450,k))  # naive N(0,I)
        X2=d(torch.tensor(zs,dtype=torch.float32)).numpy()*16
    print("AE",k,"fitgauss",stats(X),"| N(0,I)",stats(X2), "| code std range",z.std(0).min().round(2),z.std(0).max().round(2))
for k in (2,8):
    st=torch.load("c14_vae%d.pt"%k); d=mlp(k,128,128,64,last=nn.Sigmoid()); d.load_state_dict(st["dec"])
    with torch.no_grad(): X=d(torch.randn(450,k)).numpy()*16
    print("VAE",k,stats(X))
