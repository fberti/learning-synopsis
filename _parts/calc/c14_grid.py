import numpy as np, torch, torch.nn as nn
from PIL import Image
from c14_common import get_data
Xtr,Xte,ytr,yte=get_data()
def mlp(*s,last=None):
    L=[]
    for a,b in zip(s[:-1],s[1:]): L+=[nn.Linear(a,b),nn.ReLU()]
    L=L[:-1]
    if last: L.append(last)
    return nn.Sequential(*L)
S={"test":Xte,"ar":np.load("c14_ar_samples.npy")*16.,"gan":np.load("c14_gan_samples.npy"),"ddpm":np.load("c14_ddpm_samples.npy")}
for K in (2,8):
    st=torch.load("c14_vae%d.pt"%K); dec=mlp(K,128,128,64,last=nn.Sigmoid()); dec.load_state_dict(st["dec"])
    with torch.no_grad(): S["vae%d"%K]=dec(torch.randn(450,K,generator=torch.Generator().manual_seed(3))).numpy()*16
rows=[]
for k,X in S.items():
    imgs=[X[i].reshape(8,8) for i in range(24)]
    row=np.concatenate([np.pad(im,1,constant_values=8) for im in imgs],1); rows.append(row)
G=np.concatenate(rows,0); G=(255-G/16*255).clip(0,255).astype(np.uint8)
Image.fromarray(G).resize((G.shape[1]*6,G.shape[0]*6),Image.NEAREST).save("../ch14/grid_models.png")
print(list(S))
