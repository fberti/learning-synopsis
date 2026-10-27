import numpy as np
from scipy.stats import spearmanr, rankdata
def chi(t):
    t=np.array(t,float); N=t.sum(); E=np.outer(t.sum(1),t.sum(0))/N; c=((t-E)**2/E).sum()
    V=np.sqrt(c/(N*min(t.shape[0]-1,t.shape[1]-1))); return E,c,V
print(chi([[45,15],[30,30]]), (45*30-15*30)/(45*30+15*30))
g=[[12,14,16],[15,17,19,21],[20,22,24]]
al=sum(g,[]);m=np.mean(al);K=sum(len(x)*(np.mean(x)-m)**2 for x in g)/len(al);B=sum(len(x)*np.var(x) for x in g)/len(al)
print("H",m,[np.mean(x) for x in g],K,B,K+B,np.var(al),K/np.var(al),np.sqrt(K/np.var(al)))
print(-24/np.sqrt(16*64))
a=[1,2,3,4,5,6]; b=[2,1,3,6,4,5]; d=rankdata(a)-rankdata(b); print("sp",(d**2).sum(),1-6*(d**2).sum()/(216-6))
n=6;C=D=0
for i in range(n):
    for j in range(i+1,n):
        s=np.sign(a[i]-a[j])*np.sign(b[i]-b[j]);C+=s>0;D+=s<0
print("tau",C,D,(C-D)/15)
print(chi([[30,50,20],[10,30,60]]))
