# B író ellenőrzés: ERGM teljes felsorolással (élszám-eloszlás, várható értékek, MLE, izomorfiaosztályok)
from common import *
from scipy.optimize import fsolve
def enum(n):
    P=list(itertools.combinations(range(n),2)); T=list(itertools.combinations(range(n),3)); out=[]
    for g in range(1<<len(P)):
        S={P[q] for q in range(len(P)) if g>>q&1}; e=len(S)
        t=sum(1 for a,b,c in T if (a,b) in S and (a,c) in S and (b,c) in S)
        deg=[0]*n
        for a,b in S: deg[a]+=1;deg[b]+=1
        out.append((e,t,sum(d*(d-1)//2 for d in deg)))
    return np.array(out),P
def dist(St,th):
    z=St[:,:len(th)]@np.array(th); p=np.exp(z-z.max()); return p/p.sum()
S4,P4=enum(4); S6,_=enum(6); S5,_=enum(5)
for th in [(0,0),(-1,2),(np.log(2),0)]:
    p=dist(S4,th); pe=np.bincount(S4[:,0],weights=p)
    print("n4",th,"E[e] %.3f E[t] %.3f"%(p@S4[:,0],p@S4[:,1]),np.round(pe,3),"Pfull %.3f Pempty %.3f"%(p[-1],p[0]))
for th in [(-1,0),(-1,0.5),(-1,1),(-1.5,1.2)]:
    p=dist(S6,th); pe=np.bincount(S6[:,0],weights=p)
    print("n6",th,"E[e] %.2f"%(p@S6[:,0]),np.round(pe,3))
def fit(obs):
    f=lambda th:(dist(S4,th)@S4[:,:2])-np.array(obs)
    return fsolve(f,[0,0])
print("fit paw",fit((4,1)),"fit tri+iso",fit((3,1)))
# izomorfiaosztályok 4 csúcson
canon={}
perms=list(itertools.permutations(range(4)))
for g in range(64):
    S=[P4[q] for q in range(6) if g>>q&1]
    c=min(sum(1<<P4.index(tuple(sorted((p[a],p[b])))) for a,b in S) for p in perms)
    canon.setdefault(c,[]).append(g)
print("classes",len(canon),sorted(len(v) for v in canon.values()))
p=dist(S4,(-1,2)); cl=sorted(((sum(p[g] for g in v),S4[v[0]][0],S4[v[0]][1],len(v)) for v in canon.values()),reverse=True)[:4]
print("top4 (-1,2)",[(round(a,3),e,t,sz) for a,e,t,sz in cl])
p=dist(S4,(-1,0)); cl=sorted(((sum(p[g] for g in v),S4[v[0]][0],S4[v[0]][1],len(v)) for v in canon.values()),reverse=True)[:4]
print("top4 (-1,0)",[(round(a,3),e,t,sz) for a,e,t,sz in cl])
