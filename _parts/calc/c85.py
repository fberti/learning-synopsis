import numpy as np, math
from functools import lru_cache
P={'A':(2,25),'B':(3,30),'C':(2,28),'D':(12,5),'E':(15,4),'F':(11,6),'G':(3,27),'H':(14,5),'I':(7,14),'J':(8,16),'K':(6,15),'L':(14,28)}
N=list(P); X=np.array(list(P.values()),float)
D=np.sqrt(((X[:,None]-X[None])**2).sum(-1)); np.fill_diagonal(D,np.inf)
nn=D.min(1); print({N[i]:(round(nn[i],2),N[D[i].argmin()]) for i in range(12)})
print('z of L', (X[-1]-X.mean(0))/X.std(0), 'std ddof1', (X[-1]-X.mean(0))/X.std(0,ddof=1))
# isolation expected depth 1D exact
pts=(1,2,3,4,5,20)
@lru_cache(None)
def Eh(S,x):
    if len(S)==1: return 0.0
    lo,hi=S[0],S[-1]; tot=0
    for a,b in zip(S,S[1:]):
        side=tuple(v for v in S if (v<=a)==(x<=a))
        tot+=(b-a)/(hi-lo)*Eh(side,x)
    return 1+tot
for x in pts: print(x, round(Eh(pts,x),3))
def H(i): return math.log(i)+0.5772156649
def c(n): return 2*H(n-1)-2*(n-1)/n if n>2 else (1 if n==2 else 0)
print('c(6)',c(6),'c(256)',c(256))
for x in pts: print(x,'score',round(2**(-Eh(pts,x)/c(6)),3))
print('isolate 20 first cut', 15/19)
# reconstruction anomaly
u=np.array([1,1])/np.sqrt(2)
for p in [(2,2),(-1,1),(2,-2),(3,3.5)]:
    p=np.array(p,float); z=p@u; r=p-z*u; print(p, z, (r**2).sum())
print('prec', 6/20, 6/10)
