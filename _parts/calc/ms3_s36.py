import numpy as np
from scipy.stats import spearmanr, kendalltau, rankdata, pearsonr
def rho_formula(x,y):
    d=rankdata(x)-rankdata(y); n=len(x); return 1-6*(d**2).sum()/(n**3-n), (d**2).sum()
def kend(x,y):
    n=len(x);C=D=T=0
    for i in range(n):
        for j in range(i+1,n):
            s=np.sign(x[i]-x[j])*np.sign(y[i]-y[j]); C+=s>0; D+=s<0; T+=s==0
    return C,D,T,(C-D)/(n*(n-1)/2)
print("judges",rho_formula([1,2,3,4],[1,3,2,4]),kend([1,2,3,4],[1,3,2,4]))
X=[1.3,1.5,1.4,1.8,1.9,2.2,2.5,2.4,2.8,3.2]; Y=[18,19,21,23,25,27,30,34,39,44]; print("firms",kend(X,Y))
print("p1",rho_formula([1,2,3,4,5],[2,1,4,3,5]),kend([1,2,3,4,5],[2,1,4,3,5]))
print("p2",rho_formula([1,2,3,4,5],[5,4,3,2,1]))
print("p3",1-6*10/(216-6))
m=[62,75,48,90,81]; f=[58,70,55,85,88]; print("p4 ranks",rankdata(m),rankdata(f),rho_formula(m,f),spearmanr(m,f)[0],pearsonr(m,f)[0],kend(m,f))
X=[7,8,8,6,9,5]; Y=[6,9,7,7,8,4]; print("ties",rankdata(X),rankdata(Y),spearmanr(X,Y)[0],rho_formula(X,Y))
x=np.arange(1,7); print("2^x",pearsonr(x,2.0**x)[0],spearmanr(x,2.0**x)[0], kend(list(x),list(2.0**x)))
a=[1,2,3,4,5,12];b=[3,1,4,2,3,12]; print("outl",pearsonr(a,b)[0],spearmanr(a,b)[0],spearmanr(a[:5],b[:5])[0])
a=[1,2,3,4,5,6,7,8,9];b=[2,3,5,5,7,8,9,11,0]; print("outl2",pearsonr(a,b)[0],spearmanr(a,b)[0])
print("max n=4",1-6*20/60)
