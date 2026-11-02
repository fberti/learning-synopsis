# Ellenőrzés: ms4-44, ms4-45, ms4-46, ms4-final kvízek számai (helyes és rossz válaszok, magyarázatok)
from math import sqrt, prod
f1=lambda x: f"{x:.1f}".replace('.',',')
f2=lambda x: f"{x:.2f}".replace('.',',')
def pct(x): return f1(100*x)
print("=== ms4-44")
# Q1: ár +10%, mennyiség -20%
iv=1.1*0.8; print("Q1 iv",iv, "csökk",pct(1-iv), "add",-20+10, "div",pct(1-0.8/1.1), "szazaleka",pct(iv))
# Q3: pékség X: 5 db 200 -> 2 db 300; Y: 30 db 100 -> 40 db 100
q0=[5,30];p0=[200,100];q1=[2,40];p1=[300,100]
S=lambda q,p: sum(a*b for a,b in zip(q,p))
a00,a11,a01,a10=S(q0,p0),S(q1,p1),S(q0,p1),S(q1,p0)
print("Q3 sums",a00,a11,a01,a10)
print(" L",pct(a01/a00)," P",pct(a11/a10)," Iv",pct(a11/a00)," Iq0",pct(a10/a00)," Iq1",pct(a11/a01))
print(" simple mean ip",pct((1.5+1)/2), " Kp0",a01-a00," Kp1",a11-a10," Kq0",a10-a00," Kq1",a11-a01," Kv",a11-a00)
print(" wrong cross", pct(a01/a10))
# Q4: Iv 125, Ip0 110
print("Q4", pct(1.25/1.1), pct(1.25*1.1), "kivonas 115,0")
# Q5: forgalom +8%, ár +20%
print("Q5", pct(1.08/1.2), pct(1-1.08/1.2), pct(1.2/1.08-1), pct(1.08*1.2-1), 8-20)
# Q7: háztartás 50/30/20, +6 +10 -5
w=[.5,.3,.2]; ip=[1.06,1.10,.95]
L=sum(a*b for a,b in zip(w,ip)); H=1/sum(a/b for a,b in zip(w,ip)); sm=sum(ip)/3
print("Q7 L",pct(L),"harm(rossz)",pct(H),"simple",pct(sm),"sum%",6+10-5, "sum of pct", 6+10+(-5))
# contributions
print(" contrib", [round(100*a*(b-1),2) for a,b in zip(w,ip)])
# Q8: Panni Paasche harmonikus
v1=[6000,9200,2600,7200]; ipp=[1,1,1.3,1.2]
print("Q8 P",pct(25000/sum(a/b for a,b in zip(v1,ipp))), "denom",sum(a/b for a,b in zip(v1,ipp)),"arith v1",pct(sum(a*b for a,b in zip(v1,ipp))/25000),"simple",pct(sum(ipp)/4),"L 110,0","Fisher",pct(sqrt(1.1*25000/23200)))
print(" arith v1 numerator", sum(a*b for a,b in zip(v1,ipp)))
print("=== ms4-45")
T=[[3100,3550,3865,4550,5800],[3780,4310,4710,5520,6960],[3170,3615,3950,4630,5840],[3300,3750,4110,4800,6000],[3460,3930,4309,5030,6280]]
print("Q1 w94",pct(5840/3170),"chain96",pct(5840/4630),"w92",pct(5800/3100),"diag",pct(6280/3100))
c=[1.1,0.9,1.2]; print("Q2",pct(prod(c)),"sum",100+10-10+20,"arith^3",pct(((sum(c))/3)**3),"mean",pct(sum(c)/3))
infl=[1.145,1.176,1.037]; P=prod(infl)
print("Q3",pct(P-1),"sum",14.5+17.6+3.7,"szazaleka",pct(P))
print("Q4 geo",pct(P**(1/3)-1),"arith",f1((14.5+17.6+3.7)/3),"39.6/3",f1(100*(P-1)/3),"sqrt",pct(P**0.5-1))
print("Q5",pct(1-1.1/1.145),"kivonas",14.5-10,"inverz",pct(1.145/1.1-1),"szorzas",pct(1.1*1.145-1))
print("Q6",17.6-3.7, pct(1-3.7/17.6))
print("Q8",pct(1.08/1.05-1),"kiv",8-5,"szor",pct(1.08*1.05-1))
print("=== ms4-46")
B0=[6,4];v0=[500,300];B1=[4,16];v1=[520,310]
V0=S(B0,v0)/sum(B0);V1=S(B1,v1)/sum(B1);VS=S(B1,v0)/sum(B1);VSw=S(B0,v1)/sum(B0)
print("Q1 V0,V1,VS",V0,V1,VS,"wrong VS",VSw,"simple v0",sum(v0)/2)
print(" shares",[b/sum(B0) for b in B0],[b/sum(B1) for b in B1])
print("Q2 KT",V1-V0,"KR",V1-VS,"KO",VS-V0,"wrong",V1-VSw,VSw-V0,"simple",(20+10)/2,(V1-V0)-15)
print(" KR as weighted mean", sum(b*(y-x) for b,x,y in zip(B1,v0,v1))/sum(B1))
print("Q3",pct(450/540),pct(450/420),pct(420/540),"add",pct(450/540-450/420+1))
print("Q4",pct(.9/.8),"add",90-80+100,"mult",pct(.9*.8),"inv",pct(.8/.9))
print("Q6 A nyers",.5*2+.5*40,"B nyers",.8*3+.2*45,"B std A",.5*3+.5*45,"A std B",.8*2+.2*40)
print(" Q6 extra: A std (egyenlő)",(2+40)/2,(3+45)/2)
print("Q8 headline +10%")
print("=== ms4-final")
print("F1",pct(1-1/1.25),pct(1/0.75-1),pct(1/1.25))
print("F2",5/4,4/5)
print("F4 harm",f1(5000/(3000/500+2000/250)),"simple",f1(375),"arith spend-w",f1((3000*500+2000*250)/5000),"simple harm",f1(2/(1/500+1/250)),"kg",3000/500,2000/250)
print("F6",pct(1.35**0.25-1),"35/4",35/4,"5th root",pct(1.35**0.2-1), "chain mean",(25-10+20+0)/4)
print("F7",pct(135/150),135-150+100,pct(135/125),pct(150/135))
g=dict(V0=.5*80+.5*50,V1=.25*85+.75*52,VS=.25*80+.75*50,VSw=.5*85+.5*52)
print("F8",g, "KT",g['V1']-g['V0'],"KR",g['V1']-g['VS'],"KO",g['VS']-g['V0'],"wrongKO",g['VSw']-g['V0'])
print("F9",pct(1.2/1.04),"kiv",120-104+100,"mult",pct(1.2*1.04),"inv",pct(1.04/1.2))
print("F10",pct(100000/(60000/1.2+40000/1.0)),"denom",60000/1.2+40000,"arith",pct(.6*1.2+.4*1),"simple",pct((1.2+1)/2),"inv",pct((60000/1.2+40000)/100000))
print("F11",pct(1-1.2/1.25),"kiv",25-20,"inv",pct(1.25/1.2-1),"mult",pct(1.2*1.25-1))
print("F12",f1(1000/(1.1*1.2)),"sum",f1(1000/1.3),"kiv",f1(1000*(1-.3)),"mult dec",f1(1000*.9*.8),"pricelevel",1.1*1.2, "loss", f1(1000-1000/1.32))
print("F13 27.6-22.7",27.6-22.7)
print("F14",pct(1.25/1.1-1),pct(1.25*1.1-1),pct(25000/22000), pct(23200/20000))
print("=== magyarázatok kiegészítő számai")
print("4*1.01",4*1.01,"1.25*0.75",1.25*0.75,"1.0875^4",1.0875**4,"1.1*0.9",1.1*0.9)
print("KR weighted", (4*20+16*10)/20, "tech share", 4/10, 16/20, "1-IO", 1-420/540, "IR*IO", (450/420)*(420/540))
print("iskola V_S",.25*80+.75*50,"KR",60.25-57.5, "loss", 1000-1000/1.32, "kg", 3000/500+2000/250)
print("Panni harm denom",6000+9200+2600/1.3+7200/1.2, "1/3 std",(1+8+50)/3,(2+10+60)/3)
print("3.7/17.6",3.7/17.6, "1.145/1.1",1.145/1.1, "1.25/1.2",1.25/1.2)
