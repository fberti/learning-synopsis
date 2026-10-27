# Az ms3-31…ms3-34 kvízek számainak (helyes és rossz válaszok, magyarázatok) ellenőrzése
import numpy as np
from math import sqrt
def chi2(t):
    t=np.array(t,float); N=t.sum(); E=np.outer(t.sum(1),t.sum(0))/N
    return ((t-E)**2/E).sum(), E
print("== ms3-32")
# Q1 sor/oszlop
print("Q1 oszlop%", 10/40*100, "sor%", 10/50*100, "cella%", 10/120*100, "kolis%", 50/120*100)
# Q2/Q3
t=[[18,22],[12,48]]; c,E=chi2(t); f=np.array(t,float)
print("Q2 E", E.tolist(), "rossz oszlop 40*70/100", 40*70/100)
print("Q3 chi2", c, "osztas f-fel", ((f-E)**2/f).sum(), "osztas N", ((f-E)**2).sum()/100, "abs", (abs(f-E)/E).sum(), "sum diff", (f-E).sum())
# Q4
print("Q4 V", sqrt(32/400), sqrt(32/200), sqrt(32/600), 32/400)
# Q5
print("Q5 N", 6/0.04, "V3", sqrt(18/450))
# Q6
t=[[15,5],[10,20]]; c,E=chi2(t); print("Q6 Q", (15*20-5*10)/(15*20+5*10), "V", sqrt(c/50), "chi2", c, "OR", 15*20/(5*10), E.tolist())
# Q8
t=[[20,40],[25,15]]; c,E=chi2(t); print("Q8 E", E.tolist(), np.sign(np.array(t)-E).tolist())
print("== ms3-33")
print("Q1", 1-20/80, 20/80, sqrt(0.75), sqrt(0.25))
g=[[2,4],[6,8]]; a=np.concatenate(g); K=sum(len(x)*(np.mean(x)-a.mean())**2 for x in g)/4; B=sum(len(x)*np.var(x) for x in g)/4
print("Q2 K B tot", K, B, np.var(a), "H", sqrt(K/np.var(a)), "H2", K/np.var(a), sqrt(B/np.var(a)), B/np.var(a))
m=(10*50+30*70)/40; print("Q3 m",m, "K", (10*(50-m)**2+30*(70-m)**2)/40, "unw mean", (10*(50-60)**2+30*(70-60)**2)/40,
      "unw K", ((50-m)**2+(70-m)**2)/2, "div groups", (10*(50-m)**2+30*(70-m)**2)/2)
print("Q5", 0.7**2, sqrt(0.7))
print("Q6", 25/29, 25/125, sqrt(25/29), sqrt(25/125))
n=np.array([5,5,10]); mu=np.array([10,14,18.]); v=np.array([4,9,6.])
m=(n*mu).sum()/n.sum(); K=(n*(mu-m)**2).sum()/20; B=(n*v).sum()/20
print("Q8 m K B tot", m, K, B, K+B, "H2", K/(K+B), "H", sqrt(K/(K+B)), "B/tot", B/(K+B))
mu_u=mu.mean(); Ku=(n*(mu-mu_u)**2).sum()/20; print("  unweighted mean", mu_u, Ku, Ku/(Ku+B), "unw B", v.mean(), K/(K+v.mean()))
print("== ms3-34")
def Kr(x,y):
    x=np.array(x,float); y=np.array(y,float); s=np.sign((x-x.mean())*(y-y.mean())); p=(s>0).sum(); q=(s<0).sum(); z=(s==0).sum(); return x.mean(),y.mean(),s.tolist(),p,q,z,(p-q)/(p+q)
r=Kr([1,2,3,4,5],[2,5,9,4,10]); print("Q1", r, "with zero in denom", (r[3]-r[4])/5, "zero as +", (r[3]+1-r[4])/5, "p/(p+q)", r[3]/(r[3]+r[4]))
x=np.array([1,2,3.]); y=np.array([4,3,8.]); d=(x-x.mean())*(y-y.mean())
print("Q2", x.mean(), y.mean(), d.tolist(), d.mean(), d.sum()/2, d.sum(), (x*y).mean(), (x*y).tolist())
print("Q3", 0.8*100*1000, 0.8*100, 0.8*1000)
print("Q7", 30-5*7, 30-(5+7), 4*(30-35))
