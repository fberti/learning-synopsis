import sys, os, time, torch
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from c13_exp import *
X, Y, A, tr, va, te = cora_tensors(); P = sparse(gcn_norm(A))
for L in (2, 8):
    t=time.time(); torch.manual_seed(0); m=GCN(X.shape[1],64,7,L=L); a,_=train_node(m,X,P,Y,tr,va,te,lr=0.005); print(L, a, time.time()-t, flush=True)
