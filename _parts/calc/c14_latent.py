import numpy as np, torch, torch.nn as nn, json
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
st=torch.load("c14_ae2.pt"); aenc=mlp(64,128,2); adec=mlp(2,128,64,last=nn.Sigmoid()); aenc.load_state_dict(st["enc"]); adec.load_state_dict(st["dec"])
st=torch.load("c14_vae2.pt"); venc=mlp(64,128,128,4); vdec=mlp(2,128,128,64,last=nn.Sigmoid()); venc.load_state_dict(st["enc"]); vdec.load_state_dict(st["dec"])
xtr=torch.tensor(Xtr/16,dtype=torch.float32)
with torch.no_grad():
    za=aenc(xtr).numpy(); h=venc(xtr).numpy(); zv=h[:,:2]; sv=np.exp(.5*h[:,2:])
print("AE codes min",za.min(0),"max",za.max(0),"mean",za.mean(0),"std",za.std(0))
print("VAE mu mean",zv.mean(0),"std",zv.std(0),"sigma mean",sv.mean(0))
g=torch.Generator().manual_seed(11); rng=np.random.default_rng(11)
lo,hi=za.min(0),za.max(0)
zu=rng.uniform(lo,hi,(1000,2)).astype(np.float32)
with torch.no_grad():
    da=adec(torch.tensor(zu)).numpy()*16
    zn=torch.randn(1000,2,generator=g); dv=vdec(zn).numpy()*16
    # AE decoded at N(0,1)-scaled-to-code-std
    da2=adec(torch.tensor((rng.standard_normal((1000,2))*za.std(0)+za.mean(0)).astype(np.float32))).numpy()*16
def conf(X): return clf.predict_proba(X).max(1)
for nm,X in [("AE uniform box",da),("AE gauss-fit",da2),("VAE prior",dv),("test",Xte)]:
    c=conf(X); print("%-15s conf mean %.3f  frac>0.9 %.3f"%(nm,c.mean(),(c>.9).mean()))
# distance of random box points to nearest code (holes)
d=np.sqrt(((zu[:,None]-za[None])**2).sum(-1)).min(1); print("AE box pts nn dist to code median",np.median(d),"code nn-nn median", np.median(np.sort(np.sqrt(((za[:,None]-za[None])**2).sum(-1)),1)[:,1]))
# interpolation example: pick a 1 and a 7? pick first test 3 and 8
