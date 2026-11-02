# Ellenőrzés: a 4.4–4.7 és a fejezetvég szövegének számai (szöveghiba-keresés)
from math import sqrt, prod
q0=[10,15,2,8]; p0=[600,400,2000,500]; q1=[10,23,1,12]; p1=[600,400,2600,600]
S=lambda q,p: sum(a*b for a,b in zip(q,p))
v00,v11,v01,v10=S(q0,p0),S(q1,p1),S(q0,p1),S(q1,p0)
print("sums",v00,v11,v01,v10)
Ip0=v01/v00; Ip1=v11/v10; Iq0=v10/v00; Iq1=v11/v01; Iv=v11/v00
print("Iv,Ip0,Ip1,Iq0,Iq1",Iv,Ip0,Ip1,Iq0,Iq1)
print("IpF,IqF",sqrt(Ip0*Ip1),sqrt(Iq0*Iq1), sqrt(Ip0*Ip1)*sqrt(Iq0*Iq1))
print("Ip0*Iq0",Ip0*Iq0)
print("iq",[b/a for a,b in zip(q0,q1)],"ip",[b/a for a,b in zip(p0,p1)])
print("iv",[b*d/(a*c) for a,b,c,d in zip(q0,q1,p0,p1)])
print("simple mean ip",sum(b/a for a,b in zip(p0,p1))/4)
v0=[a*b for a,b in zip(q0,p0)]; v1=[a*b for a,b in zip(q1,p1)]; ip=[b/a for a,b in zip(p0,p1)]
print("v0 shares",[x/v00 for x in v0],"v1 shares",[x/v11 for x in v1])
print("wrong: sum v1 ip / sum v1", sum(a*b for a,b in zip(v1,ip))/v11)
print("wrong: sum v0/ip harmonic", v00/sum(a/b for a,b in zip(v0,ip)))
# NGA 8.2
print("NGA8.2",36300/24100,26250/24100,36300/34000,34000/24100,36300/26250)
print("small shop", 2070/2000, 2350/2000, 2070/1800, 1800/2000, 2070/2350, sqrt(1.175*1.15), 1.175*2070/2350)
print("defl",1.10/0.97,0.95*1.15,1.12/1.05,0.97*1.04,1.12/1.08)
print("NGA8.3", (4000*1.2+6000*7/6+1600*1.25)/11600,(3500+4800+1600)/11600, 11800/13800)
print("hh", .3*1.1+.5*1.04+.2*1.02)
# 4.5
T=[[3100,3550,3865,4550,5800],[3780,4310,4710,5520,6960],[3170,3615,3950,4630,5840],[3300,3750,4110,4800,6000],[3460,3930,4309,5030,6280]]
d=[T[i][i] for i in range(5)]
print("val base93",[round(100*x/d[1],1) for x in d],"chain",[round(100*d[i]/d[i-1],1) for i in range(1,5)])
r=T[2]; print("price w94",[round(100*x/r[0],1) for x in r],[round(100*r[i]/r[i-1],1) for i in range(1,5)])
r=T[0]; print("price w92",[round(100*x/r[0],1) for x in r])
c=[T[i][3] for i in range(5)]; print("vol p95 base94",[round(100*x/c[2],1) for x in c],"chain",[round(100*c[i]/c[i-1],1) for i in range(1,5)])
print("ik93",4310/3100,4310/3780,3780/3100,(4310/3780)*(3780/3100))
infl=[1.145,1.176,1.037]; print("chain", prod(infl), 1.145*1.176, sum([14.5,17.6,3.7]))
print("5y",prod([1.033,1.051,1.145,1.176,1.037]), prod([1.033,1.051,1.145,1.176,1.037])**0.2)
print("avg3", prod(infl)**(1/3), (14.5+17.6+3.7)/3)
print("p1", 1.04*1.1*.98, 139.6/134.7, 100/134.7,114.5/134.7)
P=[1,1.145,1.145*1.176,prod(infl)]; w=[300,330,370,400]
print("real",[w[i]/w[0]/P[i] for i in range(4)], 400/P[3], 370/330, (370/330)/1.176, 1.12/1.09, 1.12/1.176, 330/1.145, 300*P[3], 1.06/1.04,1.06/1.08)
# 4.6
print("firm",(8*600+2*300)/10,(8*630+2*330)/10,(8*630+12*330)/20,(8*600+12*300)/20, 450/540,450/420,420/540)
B0=[85,113,152]; B1=[138,110,114]; v0=[538,612,695]; v1=[540,615,696]
V0=S(B0,v0)/sum(B0); V1=S(B1,v1)/sum(B1); VS=S(B1,v0)/sum(B1)
print("NGA9",S(B0,v0),S(B1,v1),S(B1,v0),V0,V1,VS,V1-V0,V1-VS,VS-V0,V1/V0,V1/VS,VS/V0,[b/a for a,b in zip(v0,v1)])
print("shares",[b/sum(B0) for b in B0],[b/sum(B1) for b in B1])
print("2shops",(2*2.4+8*1.4)/10,(4*2.5+6*1.5)/10,(4*2.4+6*1.4)/10)
print("school",.6*80+.4*50,.3*82+.7*52,.3*80+.7*50, 61/68,61/59,59/68, .95/1.02)
print("age",.3*1+.3*8+.4*50,.6*2+.3*10+.1*60,.3*2+.3*10+.4*60,.6*1+.3*8+.1*50,59/3,72/3,.2*.5+.5*5+.3*40,.4*.6+.5*6+.1*45,.2*.6+.5*6+.3*45)
# end
print("end", 1.06/1.08, 52/40, 1.3**(1/3), 1.02*1.05*.97*1.04, .4*1.08+.35*1.03+.25*.98)
A=[(100,50,80,60),(200,20,260,22)]
a00=sum(q*p for q,p,_,_ in A); a11=sum(q*p for _,_,q,p in A); a01=sum(q0*p1 for q0,_,_,p1 in A); a10=sum(q1*p0 for _,p0,q1,_ in A)
print("2prod",a00,a11,a01,a10,a11/a00,a01/a00,a11/a10,a10/a00,a11/a01,(a11/a10)*(a10/a00))
print(1.15/1.06,1.06*1.03,.3*200+.7*120,.5*210+.5*125,167.5/144,167.5/160,160/144,900/1.2096,sqrt(1.2096))
