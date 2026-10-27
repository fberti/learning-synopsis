import numpy as np
from itertools import combinations
def pr(*a): print(*a)
def cov(x,y): x=np.array(x,float);y=np.array(y,float); return ((x-x.mean())*(y-y.mean())).mean()
def r(x,y): x=np.array(x,float);y=np.array(y,float); return cov(x,y)/x.std()/y.std()
def chi(t):
    t=np.array(t,float); N=t.sum(); E=np.outer(t.sum(1),t.sum(0))/N; c=((t-E)**2/E).sum()
    V=np.sqrt(c/(N*min(t.shape[0]-1,t.shape[1]-1))); return E,c,V
def Q(t): (a,b),(c,d)=t; return (a*d-b*c)/(a*d+b*c)
pr("== 10 people", chi([[2,2],[1,5]]), Q([[2,2],[1,5]]))
pr("== 200 smoke", chi([[30,70],[20,80]]), Q([[30,70],[20,80]]))
pr("== double", chi([[60,140],[40,160]]))
pr("== NGA", chi([[18,2],[5,25]]), Q([[18,2],[5,25]]))
# students
x=[1,2,3,4,5]; y=[52,56,62,62,68]
pr("== students cov",cov(x,y),"sx",np.std(x),"sy",np.std(y),"r",r(x,y))
pr("cov in minutes", cov(np.array(x)*60,y), r(np.array(x)*60,y))
# NGA firms
X=[1.3,1.5,1.4,1.8,1.9,2.2,2.5,2.4,2.8,3.2]; Y=[18,19,21,23,25,27,30,34,39,44]
pr("== firms mean",np.mean(X),np.mean(Y),"cov",cov(X,Y),"sx",np.std(X),"sy",np.std(Y),"r",r(X,Y),"r2",r(X,Y)**2)
dx=np.array(X)-2.1; dy=np.array(Y)-28; s=np.sign(dx*dy); pr("signs",s, "Kr",(sum(s>0)-sum(s<0))/len(s))
from scipy.stats import spearmanr, kendalltau, rankdata
pr("spearman",spearmanr(X,Y)[0],"D2",((rankdata(X)-rankdata(Y))**2).sum(),"kendall",kendalltau(X,Y)[0])
# NGA mixed
g={'a':[25,30,28,32,29],'b':[23,24,28,25,25,22,29,24,27],'c':[21,26,20,23,23,22]}
al=sum(g.values(),[]); N=len(al); m=np.mean(al)
sK=sum(len(v)*(np.mean(v)-m)**2 for v in g.values())/N; sB=sum(len(v)*np.var(v) for v in g.values())/N
pr("== mixed means",{k:np.mean(v) for k,v in g.items()},m,"sK",sK,np.sqrt(sK),"sB",sB,np.sqrt(sB),"s2",np.var(al),"H2",sK/np.var(al),"H",np.sqrt(sK/np.var(al)), {k:np.var(v) for k,v in g.items()})
# parabola
pr("parab", r([-2,-1,0,1,2],[4,1,0,1,4]))
xx=np.arange(1,7); pr("2^x pearson",r(xx,2.0**xx),"spear",spearmanr(xx,2.0**xx)[0])
# anscombe
ax=[10,8,13,9,11,14,6,4,12,7,5]
y1=[8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68]
y2=[9.14,8.14,8.74,8.77,9.26,8.10,6.13,3.10,9.13,7.26,4.74]
y3=[7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73]
x4=[8,8,8,8,8,8,8,19,8,8,8]; y4=[6.58,5.76,7.71,8.84,8.47,7.04,5.25,12.50,5.56,7.91,6.89]
for xs,ys in [(ax,y1),(ax,y2),(ax,y3),(x4,y4)]:
    b=cov(xs,ys)/np.var(xs); pr("ansc",np.mean(xs),np.mean(ys),np.var(ys,ddof=1),r(xs,ys),b,np.mean(ys)-b*np.mean(xs), spearmanr(xs,ys)[0])
