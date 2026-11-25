from common import *
from itertools import combinations
DI={d:i for i,d in enumerate(DAYS)}
ev=[]
for a in sorted(ART,key=lambda a:(DI[a[2]],a[0])):
    for x,y in combinations(sorted(a[3],key=ACT.index),2): ev.append((DI[a[2]],x,y,a[0]))
print("events",len(ev)); 
for e in ev: print(e)
key=lambda x,y: tuple(sorted((x,y),key=ACT.index))
allp=[key(x,y) for x,y in combinations(ACT,2)]
# streaming EdgeBank, memory updated at end of day; test from Cs (3)
mem=set(key(x,y) for d,x,y,_ in ev if d<3)
hits=0; tot=0; per=[]
aucs_rand=[];aucs_hist=[]
P_all=[];N_rand=[];N_hist=[]
for d in range(3,7):
    today=set(key(x,y) for dd,x,y,_ in ev if dd==d)
    evs=[key(x,y) for dd,x,y,_ in ev if dd==d]
    for p in evs:
        tot+=1; hits+= p in mem
        P_all.append(1 if p in mem else 0)
    neg=[p for p in allp if p not in today]
    N_rand+= [1 if p in mem else 0 for p in neg]
    N_hist+= [1 if p in mem else 0 for p in neg if p in mem]
    per.append((DAYS[d],len(evs),sum(p in mem for p in evs),len(neg),sum(p in mem for p in neg)))
    mem|=today
print("EdgeBank hits",hits,"/",tot); print(per)
def auc(P,N): return np.mean([1 if p>n else .5 if p==n else 0 for p in P for n in N])
print("AUC all negatives (non-occurring that day)",auc(P_all,N_rand),len(N_rand))
print("AUC historical negatives",auc(P_all,N_hist),len(N_hist))
# memory: s <- s*exp(-dt/tau)+1 per event day; for Po with tau=2
import math
def memory(actor,tau=2.0,upto=6):
    s=0; last=None; out=[]
    for d in range(7):
        if last is not None: s*=math.exp(-(1)/tau)
        k=sum(1 for dd,x,y,_ in ev if dd==d and actor in (x,y))
        s+=k; out.append(round(s,3)); last=d
    return out
for a in ACT: print(a,memory(a))
# time encoding cos(w t) w=(1,0.25)
for t in [0,1,2,3]: print(t,[round(math.cos(w*t),3) for w in (1,0.25)])
# snapshot counts per day
for d in range(7): print(DAYS[d],sorted(set(key(x,y) for dd,x,y,_ in ev if dd==d)))
