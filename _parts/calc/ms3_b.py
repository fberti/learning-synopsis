import numpy as np
def cov(x,y): x=np.array(x,float);y=np.array(y,float); return ((x-x.mean())*(y-y.mean())).mean()
def r(x,y): x=np.array(x,float);y=np.array(y,float); return cov(x,y)/x.std()/y.std()
def chi(t):
    t=np.array(t,float); N=t.sum(); E=np.outer(t.sum(1),t.sum(0))/N; c=((t-E)**2/E).sum()
    V=np.sqrt(c/(N*min(t.shape[0]-1,t.shape[1]-1))); return E,c,V
T=[-1,1,6,12,17,20,22,22,17,11,5,0]
F=[2,3,10,22,36,41,48,45,33,20,9,3]
D=[0,0,1,2,4,6,7,6,5,2,1,0]
print("rFD",r(F,D),"rTF",r(T,F),"rTD",r(T,D))
rFD,rTF,rTD=r(F,D),r(T,F),r(T,D)
print("partial",(rFD-rTF*rTD)/np.sqrt((1-rTF**2)*(1-rTD**2)))
T=np.array(T);F=np.array(F);D=np.array(D)
w=T>=17; print("warm r",r(F[w],D[w]), F[w],D[w]); c=T<=6; print("cold r", r(F[c],D[c]),F[c],D[c])
t3=[[40,45,15],[30,50,20],[10,40,50]]
print("3x3",chi(t3), np.array(t3).sum())
