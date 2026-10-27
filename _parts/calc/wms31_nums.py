import numpy as np
from scipy.stats import spearmanr, rankdata
def pc(x,y): x=np.array(x,float);y=np.array(y,float); return ((x-x.mean())*(y-y.mean())).mean()
def r(x,y): return np.corrcoef(x,y)[0,1]
x=[1,2,3,4,5];y=[52,56,62,62,68]
print("xbar",np.mean(x),"ybar",np.mean(y),"C",pc(x,y),"sx",np.std(x),"sy",np.std(y),"r",r(x,y),"rho",spearmanr(x,y)[0])
print("min C",pc([v*60 for v in x],y))
dx=np.array(x)-3;dy=np.array(y)-60;p=dx*dy;print("p",sum(p>0),"q",sum(p<0))
# with outlier
x2=x+[9];y2=y+[35];print("outlier: r",r(x2,y2),"rho",spearmanr(x2,y2)[0],"C",pc(x2,y2))
X=[10,8,13,9,11,14,6,4,12,7,5]
Y=[[8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68],[9.14,8.14,8.74,8.77,9.26,8.10,6.13,3.10,9.13,7.26,4.74],[7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73]]
X4=[8,8,8,8,8,8,8,19,8,8,8];Y4=[6.58,5.76,7.71,8.84,8.47,7.04,5.25,12.50,5.56,7.91,6.89]
for xs,ys in [(X,Y[0]),(X,Y[1]),(X,Y[2]),(X4,Y4)]:
    b=pc(xs,ys)/np.var(xs);a=np.mean(ys)-b*np.mean(xs)
    print(np.mean(xs),round(np.mean(ys),3),round(np.std(xs),3),round(np.std(ys),3),round(r(xs,ys),4),round(a,3),round(b,4),round(spearmanr(xs,ys)[0],4))
xs=np.arange(1,11)
for name,f in [("lin",xs*1.0),("cub",xs**3.0),("exp",2.0**xs),("sqrt",np.sqrt(xs)),("par",(xs-5.5)**2),("step",(xs>5)*1.0)]:
    print(name, round(r(xs,f),4), round(spearmanr(xs,f)[0],4))
    ff=f.copy(); rg=f.max()-f.min(); ff[-1]=f.min()-2*rg; print("  outlier", round(r(xs,ff),4), round(spearmanr(xs,ff)[0],4))
