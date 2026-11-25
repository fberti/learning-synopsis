import itertools
from common import ART, ACT, DAYS
ev=[]
for a in sorted(ART,key=lambda a:(DAYS.index(a[2]),a[0])):
    for x,y in itertools.combinations(a[3],2): ev.append((frozenset((x,y)),DAYS.index(a[2]),a[0]))
print("events",len(ev))
pairs=[frozenset(p) for p in itertools.combinations(ACT,2)]
def auc(P,N):
    s=sum(1 if p>q else .5 if p==q else 0 for p in P for q in N); return s/len(P)/len(N)
for lam in [0.5,0,0.25,0.75,1]:
    s={v:0.0 for v in ACT}; seen=set(); hist=[]
    res={k:{"eb":[[],[]],"mem":[[],[]]} for k in ["easy","hist","all"]}
    for d in range(7):
        today=[e for e in ev if e[1]==d]; tp=set(e[0] for e in today)
        if d>=3:
            for e in today:
                for k in res:
                    res[k]["eb"][0].append(1 if e[0] in seen else 0)
                    u,v=tuple(e[0]); res[k]["mem"][0].append(s[u]*s[v])
            for p in pairs:
                if p in tp: continue
                cat="hist" if p in seen else "easy"
                u,v=tuple(p); sc=(1 if p in seen else 0, s[u]*s[v])
                for k in (cat,"all"):
                    res[k]["eb"][1].append(sc[0]); res[k]["mem"][1].append(sc[1])
        cnt={v:0 for v in ACT}
        for e in today:
            for v in e[0]: cnt[v]+=1
        for v in ACT: s[v]=lam*s[v]+cnt[v]
        seen|=tp; hist.append(dict(s))
    if lam==0.5: print("Po",[h["Po"] for h in hist],"Kl",[h["Kl"] for h in hist])
    print("lam",lam,{k:(len(res[k]["eb"][1]),round(auc(*res[k]["eb"]),4),round(auc(*res[k]["mem"]),4)) for k in res})
