import numpy as np, itertools, math
from math import comb
arts={1:["Ko","Vi"],2:["Ko","Vi","Po"],3:["Ko","Po"],4:["Vi","Sz"],5:["Sz","Kl","Ko"],6:["Sz","Kl"],7:["La","Ön"],8:["La","Po","Ön"],9:["La","Ön"],10:["Po","Vi"],11:["Po","La"],12:["Ön","Po"]}
A=["Ko","Vi","Po","La","Ön","Sz","Kl"]
M=np.zeros((12,7),int)
for i,(a,l) in enumerate(arts.items()):
  for x in l: M[i,A.index(x)]=1
print("rows",M.sum(1),"cols",dict(zip(A,M.sum(0))))
def stats_(M):
  W=M.T@M; np.fill_diagonal(W,0)
  adj=(W>0).astype(int)
  tri=np.trace(adj@adj@adj)//6
  m=adj.sum()//2
  return W,tri,m
W,tri,m=stats_(M); print("obs tri",tri,"m",m); print(W)
# hypergeometric per pair
N=12
def hyp(a,b,x):  # P(overlap>=x)
  return sum(comb(a,j)*comb(N-a,b-j) for j in range(x,min(a,b)+1))/comb(N,b)
for p,q in [("La","Ön"),("Ko","Vi"),("Po","La"),("Po","Ön"),("Sz","Kl"),("Ko","Po"),("Vi","Po")]:
  a,b=M[:,A.index(p)].sum(),M[:,A.index(q)].sum()
  print(p,q,"obs",W[A.index(p),A.index(q)],"E",a*b/N,"P>=obs",round(hyp(a,b,W[A.index(p),A.index(q)]),4))
# curveball sampler
R=np.random.default_rng(7)
def curveball(rows,steps):
  rows=[set(r) for r in rows]
  for _ in range(steps):
    i,j=R.choice(len(rows),2,replace=False)
    a,b=rows[i],rows[j]
    ab=list(a-b); ba=list(b-a)
    if not ab and not ba: continue
    pool=ab+ba; R.shuffle(pool)
    na=len(ab)
    inter=a&b
    rows[i]=inter|set(pool[:na]); rows[j]=inter|set(pool[na:])
  return rows
rows=[set(np.nonzero(M[i])[0]) for i in range(12)]
S=200000
cur=rows
res={"tri":[],"m":[],"LaOn":[],"KoVi":[],"PoLa":[],"maxw":[],"SzKl":[]}
cur=curveball(cur,2000)
for s in range(S):
  cur=curveball(cur,20)
  MM=np.zeros((12,7),int)
  for i,r in enumerate(cur):
    for x in r: MM[i,x]=1
  W2,t2,m2=stats_(MM)
  res["tri"].append(t2);res["m"].append(m2)
  res["LaOn"].append(W2[3,4]);res["KoVi"].append(W2[0,1]);res["PoLa"].append(W2[2,3]);res["SzKl"].append(W2[5,6])
  res["maxw"].append(W2.max())
for k,v in res.items():
  v=np.array(v); print(k,"mean",round(v.mean(),3),"sd",round(v.std(),3),"dist",np.bincount(v)/len(v))
obs={"tri":4,"m":10,"LaOn":3,"KoVi":2,"PoLa":2,"SzKl":2,"maxw":3}
for k,o in obs.items():
  v=np.array(res[k]); print(k,"P>=",o,round((v>=o).mean(),4),"z",round((o-v.mean())/v.std(),2),"P<=",round((v<=o).mean(),4))
