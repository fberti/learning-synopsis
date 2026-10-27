import numpy as np
def chi(t):
    t=np.array(t,float); N=t.sum(); E=np.outer(t.sum(1),t.sum(0))/N; c=((t-E)**2/E).sum()
    V=np.sqrt(c/(N*min(t.shape[0]-1,t.shape[1]-1))); return E.round(3).tolist(),round(c,4),round(V,4)
def Q(t): (a,b),(c,d)=t; return (a*d-b*c)/(a*d+b*c)
for t in ([[6,24],[18,32]],[[10,30],[20,40]],[[12,18],[20,30]],[[30,90],[32,48]],[[20,0],[10,20]],[[2,2],[1,5]]):
    print(t,chi(t),"Q",round(Q(t),4), "rowpct",[round(r[0]/sum(r),4) for r in t])
t3=np.array([[40,45,15],[30,50,20],[10,40,50]]); E=chi(t3)[0]; print(E); print((t3-np.array(E)).round(2))
print("rowpct3",(t3/t3.sum(1,keepdims=True)).round(3), (t3.sum(0)/300).round(3))
print("shortcut",200*(30*80-70*20)**2/(100*100*50*150))
print("V 12/150 3x4",np.sqrt(12/(150*2)))
# 3.3
def split(groups):
    al=sum(groups,[]); N=len(al); m=np.mean(al)
    K=sum(len(g)*(np.mean(g)-m)**2 for g in groups)/N; B=sum(len(g)*np.var(g) for g in groups)/N
    return dict(m=m,T=np.var(al),B=B,K=K,H2=K/np.var(al),H=np.sqrt(K/np.var(al)))
print(split([[3,4,5],[5,6,7]]))
print(split([[2,4,6],[8,10,12]]))
print("q2",0.6,np.sqrt(0.6))
n=np.array([10,20,10]);mu=np.array([100,120,140]);v=np.array([64,100,81]);M=(n*mu).sum()/n.sum()
K=(n*(mu-M)**2).sum()/n.sum();B=(n*v).sum()/n.sum();print("q4",M,K,B,K+B,K/(K+B),np.sqrt(K/(K+B)))
n=np.array([4,8,8]);mu=np.array([250,350,500]);s=np.array([40,60,100]);M=(n*mu).sum()/n.sum()
K=(n*(mu-M)**2).sum()/n.sum();B=(n*s**2).sum()/n.sum();print("q5",M,K,B,K+B,K/(K+B),np.sqrt(K/(K+B)))
# contrast pair same means different spread
print(split([[4,5,6],[9,10,11]]), split([[1,5,9],[6,10,14]]))
