import numpy as np, torch, torch.nn as nn, json
from scipy import linalg
from sklearn.neural_network import MLPClassifier
from c14_common import get_data
torch.set_num_threads(4)
Xtr,Xte,ytr,yte=get_data()
clf=MLPClassifier((64,),max_iter=2000,random_state=0,alpha=1e-3).fit(Xtr,ytr)
print("clf test acc",clf.score(Xte,yte))
def feats(X):
    return np.maximum(0,X@clf.coefs_[0]+clf.intercepts_[0])
def fid(A,B):
    fa,fb=feats(A),feats(B); m1,m2=fa.mean(0),fb.mean(0); C1,C2=np.cov(fa,rowvar=False),np.cov(fb,rowvar=False)
    cs=linalg.sqrtm(C1@C2).real
    return ((m1-m2)**2).sum()+np.trace(C1+C2-2*cs)
def nn_dist(S,R):
    d=((S[:,None,:]-R[None,:,:])**2).sum(-1); return np.sqrt(d.min(1)), d.argmin(1)
def mlp(*s,last=None):
    L=[]
    for a,b in zip(s[:-1],s[1:]): L+=[nn.Linear(a,b),nn.ReLU()]
    L=L[:-1]
    if last: L.append(last)
    return nn.Sequential(*L)
rng=np.random.default_rng(7)
S={}
S["valódi (teszt)"]=Xte
S["másoló"]=Xtr[rng.choice(len(Xtr),450,replace=False)]
mu=Xtr.mean(0); C=np.cov(Xtr,rowvar=False)
S["Gauss"]=np.clip(rng.multivariate_normal(mu,C,450),0,16)
S["AR (pixelenként)"]=np.load("c14_ar_samples.npy")[:450]*16.0
for K in (2,8):
    try:
        st=torch.load("c14_vae%d.pt"%K); dec=mlp(K,128,128,64,last=nn.Sigmoid()); dec.load_state_dict(st["dec"])
        with torch.no_grad(): S["VAE-%d"%K]=dec(torch.randn(450,K,generator=torch.Generator().manual_seed(3))).numpy()*16
    except Exception as e: print("vae",K,e)
S["GAN"]=np.load("c14_gan_samples.npy")[:450]
try: S["diffúzió"]=np.load("c14_ddpm_samples.npy")[:450]
except Exception as e: print(e)
dte,_=nn_dist(Xte,Xtr)
res={}
for k,X in S.items():
    pr=clf.predict_proba(X); cls=pr.argmax(1); conf=pr.max(1)
    hist=np.bincount(cls,minlength=10)
    d,_=nn_dist(X,Xtr)
    # compare binarized for AR
    ref=Xte if not k.startswith("AR") else (Xte>=8)*16.0
    f=fid(X,ref)
    res[k]=dict(fid=round(float(f),2),conf=round(float(conf.mean()),3),hist=hist.tolist(),nn=round(float(np.median(d)),2),copies=int((d<1e-6).sum()))
    print("%-16s FID %7.2f conf %.3f nn-med %.2f copies %d hist %s"%(k,f,conf.mean(),np.median(d),(d<1e-6).sum(),hist.tolist()))
print("test->train nn median",np.median(dte))
fb=fid((Xte>=8)*16.0,Xte); print("binarized test vs test FID",fb)
json.dump(res,open("c14_eval.json","w"),ensure_ascii=False,indent=0)
