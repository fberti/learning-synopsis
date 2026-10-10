import numpy as np
relu=lambda z:np.maximum(0,z); sig=lambda z:1/(1+np.exp(-z))
W1=np.array([[1,-1],[0.5,0.5],[-1,1]]); b1=np.array([0.5,-1,0]); W2=np.array([[1,2,-1],[-1,0,1]]); b2=np.array([0,0.5])
x=np.array([1,2]); z1=W1@x+b1; h=relu(z1); z2=W2@h+b2; p=np.exp(z2)/np.exp(z2).sum(); print(z1,h,z2,p.round(4))
x=np.array([2,0]); z1=W1@x+b1; h=relu(z1); z2=W2@h+b2; p=np.exp(z2)/np.exp(z2).sum(); print("x=(2,0)",z1,h,z2,p.round(4))
Wh=np.array([[0.4716,0.0399,-0.3902],[1.5013,-0.0690,0.2728]]); bh=np.array([0.0532,1.3808]); v=np.array([0.3031,-1.6134]); c=2.2277
for x in ([-0.7359,0.9795,-0.1333],[0.0967,-1.2138,-1.0500]):
    z=Wh@np.array(x)+bh; h=relu(z); o=v@h+c; print("wine",z.round(4),h.round(4),round(o,4),round(sig(o),4))
cp=lambda s:sum(s[i]*s[i+1]+s[i+1] for i in range(len(s)-1))
for s in ([2,2,1],[784,128,10],[64,16,10],[2,8,8,1],[784,100,10],[784,100,100,10],[4,5,2],[4,3],[784,1000,1000,10],[784,1000,10],[784,700,350,10],[2,3,2],[2,5,1],[3,2,1],[3,8,1]):
    print(s,cp(s))
print(784*128+128*10, 784+128+10, 784*128*10, cp([784,128,10])*4, 1796010*4)
# small practice 2-2-1
W=np.array([[1,1],[1,-1]]); b=np.array([0,0]); v=np.array([1,1]); c=-1
for x in ([1,2],[2,1]): h=relu(W@np.array(x)+b); print("221",x,h,v@h+c)
