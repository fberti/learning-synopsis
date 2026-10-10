import numpy as np
np.set_printoptions(precision=4, suppress=True)
s=lambda z:1/(1+np.exp(-z))
print("== 10.1 CE for p(3)")
for p in [0.74,0.4,0.05,0.178,0.9,0.99,0.5,0.1]: print(p, round(-np.log(p),4))
print("ln10",np.log(10),"ln2",np.log(2))
print("== sigmoid MSE vs CE grads wrt z, y=1")
for z in [-4,-2,0,2]:
    p=s(z); print(z, round(p,4), "MSE half", round((p-1)*p*(1-p),5), "CE", round(p-1,4), "ratio", round((p-1)/((p-1)*p*(1-p)),2), "loss mse", round(0.5*(p-1)**2,4), "ce", round(-np.log(p),4))
print("== softmax z=(2,1,0)")
z=np.array([2,1,0.]); p=np.exp(z)/np.exp(z).sum(); print(p, p-np.array([1,0,0]), -np.log(p[0]))
z=np.array([1,2,0.]); p=np.exp(z)/np.exp(z).sum(); print("z=(1,2,0)",p, -np.log(p[0]))
print("== 10.3a single neuron x=2 w=0.5 b=-1 y=1")
x,w,b,y=2,0.5,-1,1; z=w*x+b; p=s(z); print(z,p,-np.log(p)); d=p-y; print("dw",d*x,"db",d)
for eta in [0.5,0.25,1]:
    w2=w-eta*d*x; b2=b-eta*d; z2=w2*x+b2; print("eta",eta,w2,b2,z2,s(z2),-np.log(s(z2)))
print("== 10.3b 2-2-1 ReLU/sigmoid")
x=np.array([1,2.]); W1=np.array([[0.5,0.25],[-1,1]]); b1=np.array([0,0.5]); W2=np.array([1,-1.]); b2=0.5; y=1
def fwd(W1,b1,W2,b2):
    z1=W1@x+b1; h=np.maximum(0,z1); z2=W2@h+b2; p=s(z2); return z1,h,z2,p,-np.log(p)
z1,h,z2,p,L=fwd(W1,b1,W2,b2); print("z1",z1,"h",h,"z2",z2,"p",p,"L",L)
d2=p-y; gW2=d2*h; gb2=d2; dh=W2*d2; d1=dh*(z1>0); gW1=np.outer(d1,x); gb1=d1
print("d2",d2,"gW2",gW2,"gb2",gb2,"dh",dh,"d1",d1,"gW1",gW1,"gb1",gb1)
for eta in [0.1,0.5]:
    n=(W1-eta*gW1,b1-eta*gb1,W2-eta*gW2,b2-eta*gb2); print("eta",eta,[np.round(a,4) for a in n]); print("  new",fwd(*n))
# numeric check of dL/dW1[0,1]
eps=1e-4
for (i,j) in [(0,1),(1,0)]:
    Wp=W1.copy(); Wp[i,j]+=eps; Wm=W1.copy(); Wm[i,j]-=eps
    print("numgrad",i,j,(fwd(Wp,b1,W2,b2)[4]-fwd(Wm,b1,W2,b2)[4])/(2*eps), gW1[i,j])
# with eps=0.01 check value
eps=0.01; Wp=W1.copy(); Wp[0,0]+=eps; Wm=W1.copy(); Wm[0,0]-=eps
Lp,Lm=fwd(Wp,b1,W2,b2)[4],fwd(Wm,b1,W2,b2)[4]; print("eps .01 W11:",Lp,Lm,(Lp-Lm)/(2*eps))
# 10 steps of training loss
P=(W1,b1,W2,b2)
for k in range(5):
    W1_,b1_,W2_,b2_=P; z1,h,z2,p,L=fwd(*P); d2=p-1; d1=W2_*d2*(z1>0)
    print("step",k,"L",round(L,4)); P=(W1_-0.1*np.outer(d1,x),b1_-0.1*d1,W2_-0.1*d2*h,b2_-0.1*d2)
