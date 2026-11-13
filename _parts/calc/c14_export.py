import numpy as np, torch, torch.nn as nn, json
from scipy import linalg
from sklearn.decomposition import PCA
from sklearn.neural_network import MLPClassifier
from c14_common import get_data
torch.set_num_threads(4)
Xtr,Xte,ytr,yte=get_data()
OUT={}
r3=lambda a: np.round(np.asarray(a,dtype=float),3).tolist()
ri=lambda a: np.clip(np.round(np.asarray(a)),0,16).astype(int).tolist()
def mlp(*s,last=None,act=nn.ReLU):
    L=[]
    for a,b in zip(s[:-1],s[1:]): L+=[nn.Linear(a,b),act()]
    L=L[:-1]
    if last: L.append(last)
    return nn.Sequential(*L)
def lin_export(seq):
    return [{"W":r3(m.weight.detach().numpy()),"b":r3(m.bias.detach().numpy())} for m in seq if isinstance(m,nn.Linear)]
# ---- AR
ar=json.load(open("c14_ar_model.json"))
W=np.array(ar["W"]); OUT["ar"]={"W":[r3(W[i,:i]) for i in range(64)],"b":r3(ar["b"]),
  "test":[(Xte[i]>=8).astype(int).tolist() for i in range(20)],"testLabel":yte[:20].tolist(),
  "nll":{"uniform":64,"indep":36.33,"ar":25.88}}
# ---- AE / PCA recon for 10 test digits (one per class)
idx=[int(np.where(yte==c)[0][0]) for c in range(10)]
xte=torch.tensor(Xte/16,dtype=torch.float32)
rec={"orig":ri(Xte[idx]),"label":list(range(10)),"ks":[1,2,4,8,16,32],"ae":{},"pca":{},"mseAE":{},"msePCA":{}}
for k in rec["ks"]:
    st=torch.load("c14_ae%d.pt"%k); e=mlp(64,128,k); d=mlp(k,128,64,last=nn.Sigmoid()); e.load_state_dict(st["enc"]); d.load_state_dict(st["dec"])
    with torch.no_grad():
        R=d(e(xte)).numpy(); rec["ae"][k]=ri(R[idx]*16); rec["mseAE"][k]=round(float(((R-Xte/16)**2).mean()),4)
    p=PCA(k).fit(Xtr/16); RP=p.inverse_transform(p.transform(Xte/16)); rec["pca"][k]=ri(RP[idx]*16); rec["msePCA"][k]=round(float(((RP-Xte/16)**2).mean()),4)
OUT["ae"]=rec
# ---- latent maps: AE-2 and VAE-2
xtr=torch.tensor(Xtr/16,dtype=torch.float32)
st=torch.load("c14_ae2.pt"); ae_e=mlp(64,128,2); ae_d=mlp(2,128,64,last=nn.Sigmoid()); ae_e.load_state_dict(st["enc"]); ae_d.load_state_dict(st["dec"])
st=torch.load("c14_vae2.pt"); v_e=mlp(64,128,128,4); v_d=mlp(2,128,128,64,last=nn.Sigmoid()); v_e.load_state_dict(st["enc"]); v_d.load_state_dict(st["dec"])
sel=np.random.default_rng(0).choice(len(Xtr),500,replace=False)
with torch.no_grad():
    za=ae_e(xtr[sel]).numpy(); hv=v_e(xtr[sel]).numpy()
    zat=ae_e(xte[idx]).numpy(); hvt=v_e(xte[idx]).numpy()
OUT["latent"]={"label":ytr[sel].tolist(),
  "ae":{"dec":lin_export(ae_d),"z":r3(za),"test":r3(zat)},
  "vae":{"dec":lin_export(v_d),"z":r3(hv[:,:2]),"sigma":r3(np.exp(.5*hv[:,2:])),"test":r3(hvt[:,:2])},
  "testOrig":ri(Xte[idx])}
# ---- GAN epochs
OUT["ganEpochs"]={k:ri(v) for k,v in json.load(open("c14_gan_snaps.json")).items()}
# ---- DDPM trajectory
T=1000; beta=torch.linspace(1e-4,0.02,T); alpha=1-beta; ab=torch.cumprod(alpha,0)
class Net(nn.Module):
    def __init__(s):
        super().__init__(); s.f=mlp(64+64,512,512,512,64,act=nn.SiLU)
    def forward(s,x,t):
        fr=torch.exp(torch.arange(32)/32*-np.log(1000.)); ang=t[:,None].float()*fr[None]
        return s.f(torch.cat([x,torch.sin(ang),torch.cos(ang)],1))
net=Net(); net.load_state_dict(torch.load("c14_ddpm2.pt"))
snapT=[999,900,800,700,600,500,400,300,200,100,50,20,0]
gen=torch.Generator().manual_seed(21); n=8
x=torch.randn(n,64,generator=gen); traj={"t":snapT,"x":[],"x0":[]}
with torch.no_grad():
    for t in reversed(range(T)):
        eh=net(x,torch.full((n,),t)); x0=((x-(1-ab[t]).sqrt()*eh)/ab[t].sqrt()).clamp(-1,1)
        if t in snapT:
            traj["x"].append(r3(x.clamp(-3,3).numpy())); traj["x0"].append(ri((x0.numpy()+1)/2*16))
        if t>0:
            mean=(ab[t-1].sqrt()*beta[t]/(1-ab[t]))*x0+(alpha[t].sqrt()*(1-ab[t-1])/(1-ab[t]))*x
            x=mean+(beta[t]*(1-ab[t-1])/(1-ab[t])).sqrt()*torch.randn(n,64,generator=gen)
        else: x=x0
traj["final"]=ri((x.numpy()+1)/2*16)
traj["abar"]=[round(float(ab[t]),5) for t in snapT]
OUT["ddpm"]=traj
# ---- comparison
clf=MLPClassifier((64,),max_iter=2000,random_state=0,alpha=1e-3).fit(Xtr,ytr)
feats=lambda X: np.maximum(0,X@clf.coefs_[0]+clf.intercepts_[0])
def fid(A,B):
    fa,fb=feats(A),feats(B); m1,m2=fa.mean(0),fb.mean(0); C1,C2=np.cov(fa,rowvar=False),np.cov(fb,rowvar=False)
    return float(((m1-m2)**2).sum()+np.trace(C1+C2-2*linalg.sqrtm(C1@C2).real))
def prc(A,B,k=3):
    fa,fb=feats(A),feats(B)
    def radii(F):
        d=np.sqrt(((F[:,None]-F[None])**2).sum(-1)); return np.sort(d,1)[:,k]
    ra,rb=radii(fa),radii(fb)
    dab=np.sqrt(((fa[:,None]-fb[None])**2).sum(-1))
    prec=(dab<=rb[None]).any(1).mean()   # gen in real manifold
    rec=(dab<=ra[:,None]).any(0).mean()  # real in gen manifold
    return float(prec),float(rec)
rng=np.random.default_rng(7)
mu=Xtr.mean(0); C=np.cov(Xtr,rowvar=False)
def vae8():
    st=torch.load("c14_vae8.pt"); d=mlp(8,128,128,64,last=nn.Sigmoid()); d.load_state_dict(st["dec"])
    with torch.no_grad(): return d(torch.randn(450,8,generator=torch.Generator().manual_seed(3))).numpy()*16
Btr=(Xtr>=8)*16.0; Bte=(Xte>=8)*16.0
models=[("valódi (teszt)",Xte,False),("másoló",Xtr[rng.choice(len(Xtr),450,replace=False)],False),
  ("Gauss",np.clip(rng.multivariate_normal(mu,C,450),0,16),False),("autoregresszív",np.load("c14_ar_samples.npy")[:450]*16.0,True),
  ("VAE",vae8(),False),("GAN",np.load("c14_gan_samples.npy")[:450],False),("diffúzió",np.load("c14_ddpm_samples.npy")[:450],False)]
cmp=[]
for name,X,binz in models:
    ref_te=Bte if binz else Xte; ref_tr=Btr if binz else Xtr
    p=clf.predict_proba(X); d=np.sqrt(((X[:,None]-ref_tr[None])**2).sum(-1)); nn_i=d.argmin(1); nn_d=d.min(1)
    pr,rc=prc(X,ref_te)
    m=dict(name=name,binary=binz,fid=round(fid(X,ref_te),1),conf=round(float(p.max(1).mean()),3),sure=round(float((p.max(1)>.9).mean()),3),
           hist=np.bincount(p.argmax(1),minlength=10).tolist(),nnMed=round(float(np.median(nn_d)),1),copies=int((nn_d<1e-6).sum()),
           prec=round(pr,3),rec=round(rc,3),
           samples=ri(X[:40]),nn=ri(ref_tr[nn_i[:40]]),nnDist=np.round(nn_d[:40],1).tolist())
    cmp.append(m); print(name,{k:v for k,v in m.items() if k not in("samples","nn","nnDist")})
dte=np.sqrt(((Xte[:,None]-Xtr[None])**2).sum(-1)).min(1); print("test->train nn med",np.median(dte))
OUT["compare"]=cmp
js="/* 14. fejezet – előre kiszámolt adatok (generálta: _parts/calc/c14_export.py; sklearn digits 8×8, 1347 tanító / 450 teszt kép) */\nwindow.GEN14 = "+json.dumps(OUT,ensure_ascii=False,separators=(",",":"))+";\n"
open("../../mesterseges-intelligencia/14-generativ-modellek/gen-data.js","w").write(js); print("bytes",len(js))
