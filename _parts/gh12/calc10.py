from common import *
from itertools import combinations
DI={d:i for i,d in enumerate(DAYS)}
key=lambda x,y: tuple(sorted((x,y),key=ACT.index))
ev=[(DI[a[2]],key(x,y)) for a in ART for x,y in combinations(a[3],2)]
allp=[key(x,y) for x,y in combinations(ACT,2)]
s={a:0. for a in ACT}; seen=set(); P=[];Ne=[];Nh=[]
for d in range(7):
    for a in ACT: s[a]*=.5
    today=[p for dd,p in ev if dd==d]
    if d>=3:
        sc=lambda p:sprev[p[0]]*sprev[p[1]]
        for p in today: P.append(sc(p))
        for p in allp:
            if p in today: continue
            (Nh if p in seen else Ne).append(sc(p))
    for p in today: s[p[0]]+=1; s[p[1]]+=1
    seen|=set(today); sprev=dict(s)
    # note: sprev = memory at end of day d, used for day d+1
auc=lambda P,N: np.mean([1 if p>n else .5 if p==n else 0 for p in P for n in N])
print(auc(P,Ne),auc(P,Nh),auc(P,Ne+Nh),len(Ne),len(Nh))
