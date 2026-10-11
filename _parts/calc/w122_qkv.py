import math
def sm(z):
    m=max(z); e=[math.exp(v-m) if v!=-math.inf else 0 for v in z]; s=sum(e); return [v/s for v in e]
def att(X,scale=True,causal=False):
    n=len(X); O=[];Ws=[]
    for i in range(n):
        sc=[sum(a*b for a,b in zip(X[i],X[j]))/(math.sqrt(2) if scale else 1) for j in range(n)]
        if causal: sc=[s if j<=i else -math.inf for j,s in enumerate(sc)]
        w=sm(sc); Ws.append(w); O.append([sum(w[j]*X[j][k] for j in range(n)) for k in range(2)])
    return Ws,O
A=[[2,0],[1,1],[1,0]]; B=[[0,2],[1,1],[0,1]]
for args in [dict(),dict(scale=False),dict(causal=True)]:
    W,O=att(A,**args); print(args,[[round(x,3) for x in r] for r in W],[[round(x,3) for x in r] for r in O])
_,OA=att(A);_,OB=att(B)
a,b=OA[1],OB[1]; print('cos',sum(x*y for x,y in zip(a,b))/math.hypot(*a)/math.hypot(*b), OB)
# PE
d=4
for p in range(4):
    print([round(f(p/10000**(2*(k//2)/d)),4) for k,f in zip(range(d),[math.sin,math.cos]*2)])
