import numpy as np
from c14_common import get_data
Xtr,Xte,ytr,yte=get_data()
B=lambda X:(X>=8)*16.0
d=np.sqrt(((B(Xte)[:,None]-B(Xtr)[None])**2).sum(-1)).min(1); print("bin test->bin train nn med",np.median(d), "copies",(d<1e-6).sum())
S=np.load("c14_ar_samples.npy")[:450]*16.
d2=np.sqrt(((S[:,None]-B(Xtr)[None])**2).sum(-1)).min(1); print("AR nn med",np.median(d2),"copies",(d2<1e-6).sum())
def p(*s): return sum(a*b+b for a,b in zip(s[:-1],s[1:]))
print("vae8 enc",p(64,128,128,16),"dec",p(8,128,128,64),"gan G",p(16,128,128,64),"D",p(64,128,128,1),"ddpm",p(128,512,512,512,64),"ae2",p(64,128,2)+p(2,128,64))
