# Ellenőrzi a 3.1–3.4 tananyag számait (szöveghiba-keresés)
import numpy as np
from math import pi, sqrt
print("3.1 kerület", [round(2*pi*r,2) for r in (1,2,3,4)])

def chi2(t):
    t=np.array(t,float); N=t.sum(); E=np.outer(t.sum(1),t.sum(0))/N
    return ((t-E)**2/E).sum(), E
def V(t):
    c,_=chi2(t); t=np.array(t); return sqrt(c/(t.sum()*(min(t.shape)-1)))
def Q(t):
    (a,b),(c,d)=t; return (a*d-b*c)/(a*d+b*c)
for name,t in [("10fo",[[2,2],[1,5]]),("dohany",[[30,70],[20,80]]),("ceg",[[18,2],[5,25]]),
               ("dupla",[[60,140],[40,160]]),("10|30",[[10,30],[20,40]]),("indep",[[12,18],[20,30]]),
               ("20|0",[[20,0],[10,20]]),("3x3",[[40,45,15],[30,50,20],[10,40,50]])]:
    c,E=chi2(t); print(name,"chi2=%.4f"%c,"V=%.4f"%V(t), "Q=%.4f"%Q(t) if len(t)==2 and len(t[0])==2 else "", "E=",np.round(E,3).tolist())
print("3x3 dev", np.round(np.array([[40,45,15],[30,50,20],[10,40,50]])-chi2([[40,45,15],[30,50,20],[10,40,50]])[1],2).tolist())
print("10fo sum 1/E", 1/1.2+1/2.8+1/1.8+1/4.2, 0.64*(1/1.2+1/2.8+1/1.8+1/4.2))
print("cells ceg", [(f-e)**2/e for f,e in [(18,9.2),(2,10.8),(5,13.8),(25,16.2)]])
print("V 3x4", sqrt(12/300), "V ceg", sqrt(25.98/50))

# 3.3
def decomp(groups):
    allv=np.concatenate([np.array(g,float) for g in groups]); n=len(allv); m=allv.mean()
    B=sum(len(g)*np.var(g) for g in groups)/n; K=sum(len(g)*(np.mean(g)-m)**2 for g in groups)/n
    return m,B,K,np.var(allv),K/np.var(allv),sqrt(K/np.var(allv))
for g in [[[3,4,5],[5,6,7]],[[4,5,6],[9,10,11]],[[1,5,9],[6,10,14]],[[2,4,6],[8,10,12]],[[3,7],[2,8],[4,6]],
          [[25,30,28,32,29],[23,24,28,25,25,22,29,24,27],[21,26,20,23,23,22]]]:
    print("decomp",g if len(g)<3 or len(g[0])<4 else "NGA", ["%.4f"%x for x in decomp(g)])
print("NGA groupvars",[np.var(g) for g in [[25,30,28,32,29],[23,24,28,25,25,22,29,24,27],[21,26,20,23,23,22]]],
      [np.mean(g) for g in [[25,30,28,32,29],[23,24,28,25,25,22,29,24,27],[21,26,20,23,23,22]]])
print("NGA sds", sqrt(10.01), sqrt(4.593), sqrt(5.417), sqrt(4.593)+sqrt(5.417))
# 3 groups 10,20,10
n=np.array([10,20,10]); mu=np.array([100,120,140]); v=np.array([64,100,81])
m=(n*mu).sum()/n.sum(); K=(n*(mu-m)**2).sum()/n.sum(); B=(n*v).sum()/n.sum(); print("3grp",m,K,B,K+B,K/(K+B),sqrt(K/(K+B)))
n=np.array([4,8,8]); mu=np.array([250,350,500]); sd=np.array([40,60,100])
m=(n*mu).sum()/n.sum(); K=(n*(mu-m)**2).sum()/n.sum(); B=(n*sd**2).sum()/n.sum(); print("vegz",m,K,B,K+B,K/(K+B),sqrt(K/(K+B)))
print("H 0.75",sqrt(0.75),"H 0.6",sqrt(0.6), "50/20", 1-20/50, sqrt(1-20/50))

# 3.4
x=np.array([1,2,3,4,5.]); y=np.array([52,56,62,62,68.])
print("diak C", ((x-x.mean())*(y-y.mean())).mean(), (x*y).mean()-x.mean()*y.mean(), (x*y).tolist(), ((x-x.mean())*(y-y.mean())).sum()/4)
X=np.array([1.3,1.5,1.4,1.8,1.9,2.2,2.5,2.4,2.8,3.2]); Y=np.array([18,19,21,23,25,27,30,34,39,44.])
d=(X-X.mean())*(Y-Y.mean()); print("ceg", X.mean(),Y.mean(), d.sum(), d.mean(), np.sign(d).tolist())
def Kr(x,y):
    s=np.sign((np.array(x,float)-np.mean(x))*(np.array(y,float)-np.mean(y))); p=(s>0).sum(); q=(s<0).sum(); return p,q,(p-q)/(p+q)
print("Kr", Kr([1,2,3,4],[8,6,7,3]), Kr([2,4,6,8,10],[3,7,5,9,6]), Kr([1,2,3,4],[1,2.6,2.4,4]), np.corrcoef([1,2,3,4],[1,2.6,2.4,4])[0,1])
y2=y.copy(); y2[2]=59; print("C javit", y2.mean(), Kr(x,y2))
print("C 1,2,3", np.mean((np.array([1,2,3])-2)*(np.array([2,4,9])-5)), np.mean([2,8,27]))
