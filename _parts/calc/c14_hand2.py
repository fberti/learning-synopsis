import math
# AE linear on 2x2
imgs={"1100":(1,1,0,0),"0011":(0,0,1,1),"1010":(1,0,1,0),"0101":(0,1,0,1),"1001":(1,0,0,1),"0110":(0,1,1,0),"1111":(1,1,1,1),"1000":(1,0,0,0)}
def enc(x): return ((x[0]+x[1]-x[2]-x[3])/2,(x[0]-x[1]+x[2]-x[3])/2)
def dec(z): return tuple(round(.5+z[0]*u+z[1]*v,3) for u,v in zip((.5,.5,-.5,-.5),(.5,-.5,.5,-.5)))
for k,x in imgs.items():
    z=enc(x); r=dec(z); print(k,"z",z,"rec",r,"err",round(sum((a-b)**2 for a,b in zip(x,r)),3))
for z in [(.5,.5),(1,1),(0,0),(-1,0),(.5,0)]: print("dec",z,dec(z))
# VAE KL
def kl(mu,s): return .5*(mu**2+s**2-1-math.log(s**2))
for mu,s in [(1,.5),(0,1),(2,.5),(0,.1),(1,1),(0,.5),(3,.1)]: print("KL",mu,s,round(kl(mu,s),4))
print("reparam z=1+0.5*0.4",1+.5*.4, "z for eps -1.2", 1+.5*-1.2)
# diffusion forward
beta=[.1,.2,.3,.4,.5]; ab=[];a=1
for b in beta: a*=1-b; ab.append(a)
print("abar",[round(x,4) for x in ab],[round(math.sqrt(x),3) for x in ab],[round(math.sqrt(1-x),3) for x in ab])
x0=2; eps=0.5
for t,a in enumerate(ab,1): print("t",t,"x_t=%.3f"%(math.sqrt(a)*x0+math.sqrt(1-a)*eps))
# denoise example: x_t, predicted eps -> x0hat
a=ab[2]; xt=math.sqrt(a)*x0+math.sqrt(1-a)*eps; print("t3 xt",xt,"x0hat with eps=0.5",(xt-math.sqrt(1-a)*.5)/math.sqrt(a))
# two point ideal denoiser
for (aa,s,xt) in [(0.6,0.8,0.5),(0.9,0.436,0.5),(0.3,0.954,0.5),(0.6,0.8,-1)]:
    print("ideal",aa,s,xt, "E=",round(math.tanh(aa*xt/s**2),3),"P(+1)=",round(1/(1+math.exp(-2*aa*xt/s**2)),3))
# CFG
eu,ec=0.2,0.6
for sc in (0,1,3,7.5): print("cfg s",sc,eu+sc*(ec-eu))
# GAN optimal D on 2x2
pd={"1100":.3,"0011":.2,"1010":.2,"0101":.2,"1001":.1}
pg={"1100":.5,"0011":.1,"1010":.1,"0101":.1,"0110":.2}
for k in sorted(set(pd)|set(pg)):
    a=pd.get(k,0);b=pg.get(k,0); print("D*",k,a,b, round(a/(a+b),3) if a+b else None)
# mode collapse G only 1100
print("collapse D*(1100)",.3/1.3, "others 1")
# GAN losses: D outputs
sig=lambda z:1/(1+math.exp(-z))
for D in (0.9,0.5,0.1,0.01): print("D(fake)",D,"-log(1-D)=minimax G gains",round(math.log(1-D),3),"nonsat -log D",round(-math.log(D),3), "grad minimax wrt logit",round(-D,3)," nonsat",round(-(1-D),3))
print("ln2",math.log(2), "-2ln2", -2*math.log(2))
print("D loss real .8 fake .3:", -math.log(.8)-math.log(1-.3))
print("latent diffusion 512*512*3",512*512*3,"64*64*4",64*64*4, 512*512*3/(64*64*4))
print("2^64",2**64, "%.3e"%2**64, "2^(8*8*8*3)? 256^(64*64*3) digits", 64*64*3*math.log10(256))
