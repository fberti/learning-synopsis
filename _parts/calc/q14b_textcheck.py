# 14.6-14.9 (+ 14.1-14.5 egyes számai) szövegbeli számainak ellenőrzése
import math
import numpy as np
from math import sqrt, tanh, log, log2, exp

# 14.6 futó példa
b=[0.1,0.2,0.3,0.4,0.5]; ab=[1]
for x in b: ab.append(ab[-1]*(1-x))
print("abar", [round(a,4) for a in ab])
print("x_t eps=-1", [round(sqrt(a)-sqrt(1-a),3) for a in ab])
# DDPM lin ütemezés
B=np.linspace(1e-4,0.02,1000); A=np.cumprod(1-B)
for t in (100,250,500,1000): print("DDPM abar",t,A[t-1])
# ideális kétpontos zajtalanító
f=lambda a,x: tanh(sqrt(a)*x/(1-a))
print("2pt", f(.36,.5), f(.81,.5), f(.36,-1), f(.1,-.3))
# 3 lépéses minta
x=0.4; seq=[0.1,0.5,0.9,1.0]
for a,an in zip(seq,seq[1:]):
    x0=f(a,x); e=(x-sqrt(a)*x0)/sqrt(1-a); xn=sqrt(an)*x0+sqrt(1-an)*e
    print("step",a,round(x,3),round(x0,3),round(e,3),round(xn,3)); x=xn
x=-0.3
for a,an in zip(seq,seq[1:]):
    x0=f(a,x); e=(x-sqrt(a)*x0)/sqrt(1-a); x=sqrt(an)*x0+sqrt(1-an)*e
print("from -0.3 ->", x)
print("x3 fehér", sqrt(ab[3])*-1+sqrt(1-ab[3])*0.5)
print("x0hat", (0.006+sqrt(1-ab[3]))/sqrt(ab[3]), "eps=-0.8:", (0.006+0.8*sqrt(1-ab[3]))/sqrt(ab[3]))
print("DDIM", sqrt(.9)*.8+sqrt(.1)*.2)
# 14.7
cfg=lambda u,c,s: u+s*(c-u)
print("cfg", [cfg(.2,.6,s) for s in (0,1,3,7.5)], cfg(-.5,.1,4), cfg(.1,-.1,5))
print("cfg vec", [cfg(.1,.3,s) for s in (2,5)], [cfg(-.2,.4,s) for s in (2,5)])
print("lat", 512*512*3, 64*64*4, 512*512*3/(64*64*4), 1024**2*3/(128*128*16), 768**2*3/(96*96*4))
# 14.8
fr=lambda m1,s1,m2,s2:(m1-m2)**2+(s1-s2)**2
print("frechet", fr(5,2,5,1), fr(5,2,6,2), fr(5,2,5.5,1.5), fr(0,1,1,.5))
print("carlini", 109/175e6, 175e6/109)
from statistics import NormalDist
for N,g in ((200,130),(50,30),(200,115),(400,230)):
    sd=sqrt(N*.25); z=(g-N/2)/sd; print("wm",N,g,sd,z,1-NormalDist().cdf(z))
print("30/450", 30/450, "28/450",28/450, "60/450",60/450)
# 14.9
print("param ratio", 624000/26000, 624000/27000, 624000/2080)
print("HKD->USD (7.8)", 200e6/7.8)
# 14.1 NLL-ek
cnt={'1100':3,'0011':2,'1010':2,'0101':2,'1001':1}
p=[.6,.5,.4,.5]
def ind(s): return np.prod([pi if c=='1' else 1-pi for c,pi in zip(s,p)])
print("NLL table", -sum(n*log2(n/10) for n in cnt.values())/10)
print("NLL ind", -sum(n*log2(ind(s)) for s,n in cnt.items())/10)
print("NLL lap", -sum(n*log2((n+1)/26) for n in cnt.values())/10)
def mk(s):
    x=[int(c) for c in s]
    q=0.6 if x[0] else 0.4
    q*=0.5
    q*= (0 if x[2] else 1) if x[1] else (0.8 if x[2] else 0.2)
    q*=0.5
    return q
print("NLL markov", -sum(n*log2(mk(s)) for s,n in cnt.items())/10, sum(1 for i in range(16) if mk(format(i,'04b'))>0))
print("2^10.4", 2**10.4, 36.3/64, 25.9/64)
kl=lambda m,s: .5*(m*m+s*s-1-log(s*s))
print("KL", kl(1,.5),kl(2,.5),kl(0,.1),kl(.5,.5),kl(0,2),kl(.5,1)+kl(-1,.5))
print("D*", .1/.5, -log(.2), .3/1.3, .2/1.2)
print("LD", -log(.8)-log(.7), -log(.6)-log(.4), 2*log(2))
