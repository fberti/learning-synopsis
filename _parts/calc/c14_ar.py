import numpy as np, json
from sklearn.linear_model import LogisticRegression
from c14_common import get_data
Xtr,Xte,ytr,yte=get_data()
Btr=(Xtr>=8).astype(int); Bte=(Xte>=8).astype(int)
print("train",len(Btr),"test",len(Bte))
# independent
p=(Btr.sum(0)+1)/(len(Btr)+2)
def nll_ind(B): return -(B*np.log2(p)+(1-B)*np.log2(1-p)).sum(1).mean()
print("indep NLL train %.2f test %.2f bits"%(nll_ind(Btr),nll_ind(Bte)))
# AR logistic raster
W=np.zeros((64,64)); b=np.zeros(64)
for i in range(64):
    yv=Btr[:,i]
    if i==0 or yv.min()==yv.max():
        q=(yv.sum()+1)/(len(yv)+2); b[i]=np.log(q/(1-q)); continue
    m=LogisticRegression(C=0.5,max_iter=2000).fit(Btr[:,:i],yv)
    W[i,:i]=m.coef_[0]; b[i]=m.intercept_[0]
def nll_ar(B):
    z=B@W.T+b  # W lower-tri strictly
    pr=1/(1+np.exp(-z)); pr=np.clip(pr,1e-6,1-1e-6)
    return -(B*np.log2(pr)+(1-B)*np.log2(1-pr)).sum(1).mean()
print("AR NLL train %.2f test %.2f bits"%(nll_ar(Btr),nll_ar(Bte)))
print("nonzero params", (W!=0).sum()+64, "full possible", 64*63//2+64)
rng=np.random.default_rng(1)
def sample(n,T=1.0,prefix=None):
    S=np.zeros((n,64),int)
    for i in range(64):
        if prefix is not None and i<len(prefix): S[:,i]=prefix[i]; continue
        z=(S@W[i]+b[i])/T; pr=1/(1+np.exp(-z)); S[:,i]=(rng.random(n)<pr)
    return S
S=sample(500)
np.save("c14_ar_samples.npy",S)
for T in (0.5,1.0,1.5):
    s=sample(500,T); print("T",T,"mean ink",s.mean().round(3))
print("data mean ink",Btr.mean().round(3))
json.dump({"W":np.round(W,3).tolist(),"b":np.round(b,3).tolist()},open("c14_ar_model.json","w"))
# show a few samples
for s in S[:4]:
    print("\n".join("".join("#" if v else "." for v in s[r*8:r*8+8]) for r in range(8))); print()
