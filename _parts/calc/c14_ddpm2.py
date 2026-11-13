import numpy as np, torch, torch.nn as nn, time, copy, sys
from c14_common import get_data
torch.set_num_threads(8)
Xtr,Xte,ytr,yte=get_data()
x2=torch.tensor(Xtr/16*2-1,dtype=torch.float32)
torch.manual_seed(0); g=torch.Generator().manual_seed(0)
T=1000; beta=torch.linspace(1e-4,0.02,T); alpha=1-beta; ab=torch.cumprod(alpha,0)
def mlp(*s):
    L=[]
    for a,b in zip(s[:-1],s[1:]): L+=[nn.Linear(a,b),nn.SiLU()]
    return nn.Sequential(*L[:-1])
class Net(nn.Module):
    def __init__(s):
        super().__init__(); s.f=mlp(64+64,512,512,512,64)
    def forward(s,x,t):
        fr=torch.exp(torch.arange(32)/32*-np.log(1000.)); ang=t[:,None].float()*fr[None]
        return s.f(torch.cat([x,torch.sin(ang),torch.cos(ang)],1))
net=Net(); ema=copy.deepcopy(net); opt=torch.optim.Adam(net.parameters(),5e-4)
ITER=int(sys.argv[1]) if len(sys.argv)>1 else 60000
sched=torch.optim.lr_scheduler.CosineAnnealingLR(opt,ITER)
t0=time.time()
for it in range(ITER):
    bi=torch.randint(0,len(x2),(256,),generator=g); x0=x2[bi]; t=torch.randint(0,T,(256,),generator=g)
    e=torch.randn_like(x0); a=ab[t][:,None]
    loss=((net(a.sqrt()*x0+(1-a).sqrt()*e,t)-e)**2).mean(); opt.zero_grad(); loss.backward(); opt.step(); sched.step()
    with torch.no_grad():
        for p,q in zip(ema.parameters(),net.parameters()): p.mul_(.999).add_(q,alpha=.001)
    if it%10000==0: print(it,loss.item(),time.time()-t0,flush=True)
torch.save(ema.state_dict(),"c14_ddpm2.pt")
@torch.no_grad()
def sample(n,gen,steps=None):
    x=torch.randn(n,64,generator=gen)
    for t in reversed(range(T)):
        tt=torch.full((n,),t); eh=ema(x,tt)
        x0=((x-(1-ab[t]).sqrt()*eh)/ab[t].sqrt()).clamp(-1,1)
        if t>0:
            mean=(ab[t-1].sqrt()*beta[t]/(1-ab[t]))*x0+(alpha[t].sqrt()*(1-ab[t-1])/(1-ab[t]))*x
            var=beta[t]*(1-ab[t-1])/(1-ab[t])
            x=mean+var.sqrt()*torch.randn(n,64,generator=gen)
        else: x=x0
    return x
S=((sample(500,torch.Generator().manual_seed(5))+1)/2*16).numpy()
np.save("c14_ddpm_samples.npy",S); print("done",time.time()-t0)
