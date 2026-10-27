import numpy as np
def cov(x,y): x=np.array(x,float);y=np.array(y,float); return ((x-x.mean())*(y-y.mean())).mean()
def r(x,y): x=np.array(x,float);y=np.array(y,float); return cov(x,y)/x.std()/y.std()
x=np.array([1,2,3,4,5.]);y=np.array([52,56,62,62,68.])
zx=(x-x.mean())/x.std(); zy=(y-y.mean())/y.std(); print("z",zx.round(3),zy.round(3),(zx*zy).round(3),(zx*zy).mean())
print("r2 students",r(x,y)**2)
print("C=3",3/(2*4))
a=[1,2,3];b=[2,4,9];print("p2",np.std(a),np.std(b),r(a,b))
print("lin",r(x,100-5*x))
b0=[(1,3),(2,1),(3,4),(4,2),(5,3)]; X=[p[0] for p in b0]; Y=[p[1] for p in b0]; print("out0",r(X,Y), "with",r(X+[12],Y+[12]))
X2=[1,2,3,4,5,6,7,8]; Y2=[2,3,5,5,7,8,9,11]; print("line",r(X2,Y2),"with out",r(X2+[9],Y2+[0]))
# z-sum identity check
print(((zx-zy)**2).sum(), 2*5-2*5*r(x,y))
