import numpy as np
def cov(x,y): x=np.array(x,float);y=np.array(y,float); return ((x-x.mean())*(y-y.mean())).mean()
def r(x,y): x=np.array(x,float);y=np.array(y,float); return cov(x,y)/x.std()/y.std()
def kr(x,y):
    x=np.array(x,float);y=np.array(y,float); s=np.sign((x-x.mean())*(y-y.mean())); p=(s>0).sum(); q=(s<0).sum(); return p,q,(p-q)/(p+q)
x=[1,2,3,4,5]; y=[52,56,62,62,68]
print(kr(x,y), cov(x,y), np.mean(np.array(x)*np.array(y)), cov(x,y)*5/4)
x=[2,4,6,8,10]; y=[3,7,5,9,6]; print("p1",np.mean(x),np.mean(y),kr(x,y),cov(x,y),r(x,y))
x=[1,2,3]; y=[2,4,9]; print("c1",cov(x,y), np.mean(np.array(x)*np.array(y))-2*5, r(x,y))
# Kr magnitude example
a=[1,2,3,4]; b1=[1,2,3,4]; b2=[2.4,2.6,2.4,2.6]
print("mag",kr(a,b1),r(a,b1),kr(a,b2),r(a,b2))
