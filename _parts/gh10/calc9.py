from common import *
from scipy.optimize import fsolve, minimize
from collections import Counter
def enum(n):
    pairs=list(itertools.combinations(range(n),2)); out=[]
    tris=list(itertools.combinations(range(n),3))
    for mask in range(1<<len(pairs)):
        E={pairs[i] for i in range(len(pairs)) if mask>>i&1}
        t=sum(1 for a,b,c in tris if (a,b) in E and (a,c) in E and (b,c) in E)
        k=[0]*n
        for a,b in E: k[a]+=1;k[b]+=1
        s2=sum(x*(x-1)//2 for x in k)  # 2-stars
        out.append((len(E),t,s2))
    return np.array(out)
S4=enum(4); print("4 nodes graphs",len(S4)); c=Counter(map(tuple,S4[:,:2])); print(sorted(c.items()))
def probs(S,th): z=S[:,:len(th)]@np.array(th); z-=z.max(); w=np.exp(z); return w/w.sum()
def moments(S,th): p=probs(S,th); return p@S[:,:len(th)]
for th in [(0,0),(-1,0),(np.log(2),0),(-1,1),(-1,2),(-2,3)]:
    p=probs(S4,th); m=moments(S4,th if len(th)==2 else th)
    print(th,"E[edges] %.3f E[tri] %.3f P(empty) %.4f P(full) %.4f"%(m[0],m[1],p[S4[:,0]==0].sum(),p[S4[:,0]==6].sum()), "edge-count dist", np.round([p[S4[:,0]==k].sum() for k in range(7)],3))
# MLE for observed paw: edges 4, tri 1
obs=np.array([4,1])
f=lambda th: moments(S4,th)-obs
th=fsolve(f,[0,0]); print("MLE paw edge+tri", th, moments(S4,th))
print("edge-only MLE", np.log(4/2))
# other observed: 3 edges path vs triangle+isolated: both 3 edges
for o in [(3,1),(3,0),(5,2)]:
    try: th=fsolve(lambda t: moments(S4,t)-np.array(o),[0,0],full_output=True); print(o, th[0], th[2], moments(S4,th[0]))
    except Exception as e: print(o,e)
# change statistic check: logit P(edge ij=1|rest)= th_e + th_t*cn
print("change stat ex: th=(-1,0.5), cn=0,1,2 ->", [1/(1+np.exp(-(-1+0.5*c))) for c in [0,1,2]])
S6=enum(6); print("6 nodes", len(S6))
for th in [(-1,0),(-1,0.5),(-1,1),(-1.5,1.2)]:
    p=probs(S6,th); print("n6",th, "E edges %.2f E tri %.2f"%tuple(p@S6[:,:2]), "edgecount dist", np.round([p[S6[:,0]==k].sum() for k in range(16)],3))
# karate density & transitivity for ERGM narrative
