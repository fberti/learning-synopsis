import numpy as np, torch, torch.nn as nn, json, sys, time
from sklearn.decomposition import PCA
from c14_common import get_data
torch.set_num_threads(2)
Xtr,Xte,ytr,yte=get_data()
xtr=torch.tensor(Xtr/16,dtype=torch.float32); xte=torch.tensor(Xte/16,dtype=torch.float32)
what=sys.argv[1]
def mlp(*s,last=None):
    L=[]
    for a,b in zip(s[:-1],s[1:]): L+=[nn.Linear(a,b),nn.ReLU()]
    L=L[:-1]
    if last: L.append(last)
    return nn.Sequential(*L)
def batches(n,bs,g):
    idx=torch.randperm(n,generator=g)
    for i in range(0,n,bs): yield idx[i:i+bs]
out={}
if what=="ae":
    for k in (1,2,4,8,16,32):
        torch.manual_seed(0); g=torch.Generator().manual_seed(0)
        enc=mlp(64,128,k); dec=mlp(k,128,64,last=nn.Sigmoid())
        opt=torch.optim.Adam(list(enc.parameters())+list(dec.parameters()),1e-3)
        for ep in range(300):
            for bi in batches(len(xtr),64,g):
                xb=xtr[bi]; loss=((dec(enc(xb))-xb)**2).mean()
                opt.zero_grad(); loss.backward(); opt.step()
        with torch.no_grad():
            mse_tr=((dec(enc(xtr))-xtr)**2).mean().item(); mse_te=((dec(enc(xte))-xte)**2).mean().item()
        pca=PCA(k).fit(Xtr/16); rec=pca.inverse_transform(pca.transform(Xte/16)); mse_p=((rec-Xte/16)**2).mean()
        print("k=%d AE mse train %.4f test %.4f | PCA test %.4f"%(k,mse_tr,mse_te,mse_p),flush=True)
        torch.save({"enc":enc.state_dict(),"dec":dec.state_dict()},"c14_ae%d.pt"%k)
if what=="vae":
    torch.manual_seed(0); g=torch.Generator().manual_seed(0)
    K=int(sys.argv[2]) if len(sys.argv)>2 else 2
    enc=mlp(64,128,128,2*K); dec=mlp(K,128,128,64,last=nn.Sigmoid())
    opt=torch.optim.Adam(list(enc.parameters())+list(dec.parameters()),1e-3)
    bce=nn.BCELoss(reduction="none")
    for ep in range(400):
        tot=0
        for bi in batches(len(xtr),64,g):
            xb=xtr[bi]; h=enc(xb); mu,lv=h[:,:K],h[:,K:]
            z=mu+torch.exp(.5*lv)*torch.randn_like(mu)
            rec=bce(dec(z),xb).sum(1); kl=.5*(mu**2+lv.exp()-1-lv).sum(1)
            loss=(rec+kl).mean(); opt.zero_grad(); loss.backward(); opt.step(); tot+=loss.item()*len(bi)
        if ep%100==99: print(ep,tot/len(xtr),flush=True)
    with torch.no_grad():
        h=enc(xte); mu,lv=h[:,:K],h[:,K:]
        rec=bce(dec(mu),xte).sum(1).mean().item(); kl=(.5*(mu**2+lv.exp()-1-lv).sum(1)).mean().item()
        print("test rec %.2f kl %.2f  (nats)"%(rec,kl))
        print("test mse(mu)",((dec(mu)-xte)**2).mean().item())
    torch.save({"enc":enc.state_dict(),"dec":dec.state_dict()},"c14_vae%d.pt"%K)
if what=="gan":
    torch.manual_seed(0); g=torch.Generator().manual_seed(0)
    Z=16
    G=mlp(Z,128,128,64,last=nn.Tanh())
    D=nn.Sequential(nn.Linear(64,128),nn.LeakyReLU(.2),nn.Linear(128,128),nn.LeakyReLU(.2),nn.Linear(128,1))
    oG=torch.optim.Adam(G.parameters(),2e-4,betas=(.5,.999)); oD=torch.optim.Adam(D.parameters(),2e-4,betas=(.5,.999))
    bce=nn.BCEWithLogitsLoss(); x2=xtr*2-1
    zfix=torch.randn(16,Z,generator=g); snaps={}
    for ep in range(1,601):
        for bi in batches(len(x2),64,g):
            xb=x2[bi]; z=torch.randn(len(bi),Z)
            fake=G(z)
            lD=bce(D(xb),torch.ones(len(bi),1))+bce(D(fake.detach()),torch.zeros(len(bi),1))
            oD.zero_grad(); lD.backward(); oD.step()
            lG=bce(D(fake),torch.ones(len(bi),1)); oG.zero_grad(); lG.backward(); oG.step()
        if ep in (1,5,20,50,100,200,400,600):
            with torch.no_grad(): snaps[ep]=((G(zfix)+1)/2*16).numpy().round(1).tolist()
            print(ep,lD.item(),lG.item(),flush=True)
    torch.save(G.state_dict(),"c14_gan_G.pt")
    with torch.no_grad(): S=((G(torch.randn(500,Z,generator=g))+1)/2*16).numpy()
    np.save("c14_gan_samples.npy",S); json.dump(snaps,open("c14_gan_snaps.json","w"))
if what=="ddpm":
    torch.manual_seed(0); g=torch.Generator().manual_seed(0)
    T=200; beta=torch.linspace(1e-4,0.05,T); alpha=1-beta; ab=torch.cumprod(alpha,0)
    print("abar end",ab[-1].item())
    x2=xtr*2-1
    class Net(nn.Module):
        def __init__(s):
            super().__init__(); s.f=mlp(64+32,256,256,256,64)
        def forward(s,x,t):
            fr=torch.arange(16)/16; ang=t[:,None].float()/T*torch.exp(fr*np.log(1000))[None]*np.pi
            return s.f(torch.cat([x,torch.sin(ang),torch.cos(ang)],1))
    net=Net(); opt=torch.optim.Adam(net.parameters(),1e-3)
    sched=torch.optim.lr_scheduler.CosineAnnealingLR(opt,40000)
    t0=time.time()
    for it in range(40000):
        bi=torch.randint(0,len(x2),(128,),generator=g); x0=x2[bi]; t=torch.randint(0,T,(128,),generator=g)
        e=torch.randn_like(x0); a=ab[t][:,None]
        xt=a.sqrt()*x0+(1-a).sqrt()*e
        loss=((net(xt,t)-e)**2).mean(); opt.zero_grad(); loss.backward(); opt.step(); sched.step()
        if it%5000==0: print(it,loss.item(),time.time()-t0,flush=True)
    torch.save(net.state_dict(),"c14_ddpm.pt")
    @torch.no_grad()
    def sample(n,gen):
        x=torch.randn(n,64,generator=gen)
        for t in reversed(range(T)):
            tt=torch.full((n,),t); eh=net(x,tt)
            x=(x-beta[t]/(1-ab[t]).sqrt()*eh)/alpha[t].sqrt()
            if t>0: x=x+beta[t].sqrt()*torch.randn(n,64,generator=gen)
        return x
    S=((sample(500,torch.Generator().manual_seed(5)).clamp(-1,1)+1)/2*16).numpy()
    np.save("c14_ddpm_samples.npy",S)
