# B ellenőrzés: egyszerű vs. összetett fertőzés WS(n=100,k=4,q)-n, 300 minta
import random, statistics as st
def ws(n,k,p,R):
    E=[[i,(i+j)%n] for i in range(n) for j in range(1,k//2+1)]
    key=lambda a,b:(min(a,b),max(a,b)); has={key(*e) for e in E}
    for e in E:
        if R.random()>=p: continue
        for t in range(50):
            c=R.randrange(n)
            if c==e[0] or key(e[0],c) in has: continue
            has.discard(key(*e)); e[1]=c; has.add(key(e[0],c)); break
    return E
def thr(n,E,seeds,th):
    L=[[] for _ in range(n)]
    for a,b in E: L[a].append(b); L[b].append(a)
    act=set(seeds); rounds=0; hist=[len(act)]
    while True:
        nw=[v for v in range(n) if v not in act and L[v] and sum(u in act for u in L[v])>=th]
        if not nw: break
        act|=set(nw); rounds+=1; hist.append(len(act))
    return act,rounds,hist
print("ring8", thr(8,ws(8,4,0,random.Random(1)),[0,1],2)[2])
R=random.Random(7); n=100
for q in [0,.01,.02,.05,.1,.2,.5,1]:
    steps=[];frac=[];full=0
    for s in range(300):
        E=ws(n,4,q,R); s0=R.randrange(n)
        a,r,_=thr(n,E,[s0],1)
        if len(a)==n: steps.append(r); full+=1
        a2,_,_=thr(n,E,[s0,(s0+1)%n],2)
        frac.append(len(a2)/n)
    print(q,"complex %.3f"%st.mean(frac),"simple steps %.2f"%st.mean(steps),"connected",full)
