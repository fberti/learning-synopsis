import math
e=1.602176634e-19; C=100e-12
for Q in [0.02,0.2,0.3,1,1.5]:
    q=Q*1e-6; U=q/C
    print(Q,"uC: U",U,"spark mm",U/3000,"E mJ",0.5*q*U*1e3,"N %.3g"%(q/e))
# step model
SH={"gumi":(1,1),"bor":(0.6,0.15),"mezit":(0.4,0.003)}
FL={"szonyeg":(1,1),"fa":(0.4,0.6),"csempe":(0.25,0.4)}
QS0=1.5484; T20=300; KH=60/math.log(300)
def tau(H,s,f): return T20*math.exp(-(H-20)/KH)*SH[s][1]*FL[f][1]
def sat(H,s,f):
    g=0.08*SH[s][0]*FL[f][0]; Qs=QS0*SH[s][0]*FL[f][0]; r=math.exp(-0.5/tau(H,s,f))
    return g*r/(1-r*(1-g/Qs))
for s in SH:
    for f in FL:
        print(s,f,[round(sat(H,s,f),3) for H in (20,35,50,65,80)])
# 10 steps from 0 at 20% gumi szonyeg
Q=0;g=0.08;Qs=QS0;r=math.exp(-0.5/300)
for i in range(1,61):
    Q=(Q+g*(1-Q/Qs))*r
    if i in (1,4,10,20,40,60): print(i,round(Q,4))
# human electrons ratio text 1.6 Példa 2
n=0.5e-6/e; print("0.5uC N",n,"ratio",n/2.3e28,"1/ratio",2.3e28/n)
print("coin cm", 0.45e-3/(0.005*9.81)*100)
