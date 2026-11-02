from math import sqrt, prod
P=print
P("== 4.5 NGA 8.6")
T=[[3100,3550,3865,4550,5800],[3780,4310,4710,5520,6960],[3170,3615,3950,4630,5840],[3300,3750,4110,4800,6000],[3460,3930,4309,5030,6280]]  # sor: mennyiség éve, oszlop: ár éve
d=[T[i][i] for i in range(5)]
P("diag",d,"bázis93",[round(x/d[1]*100,1) for x in d],"lánc",[round(d[i]/d[i-1]*100,1) for i in range(1,5)])
r=T[2]; P("ár (q1994) bázis92",[round(x/r[0]*100,1) for x in r],"lánc",[round(r[i]/r[i-1]*100,1) for i in range(1,5)])
c=[T[i][3] for i in range(5)]; P("vol (p1995) bázis94",[round(x/c[2]*100,1) for x in c],"lánc",[round(c[i]/c[i-1]*100,1) for i in range(1,5)])
P("ellenőrzés ár*vol=érték 93/92: Paasche-ár",T[1][1]/T[1][0]," Lasp-vol",T[1][0]/T[0][0], T[1][1]/T[1][0]*T[1][0]/T[0][0], d[1]/d[0])
P("== KSH CPI")
cpi={2019:103.4,2020:103.3,2021:105.1,2022:114.5,2023:117.6,2024:103.7}
b=100; s=[]
for y in [2022,2023,2024]:
  b*=cpi[y]/100; s.append(round(b,2))
P("bázis 2021=100:",s)
b=100;s=[]
for y in [2020,2021,2022,2023,2024]:
  b*=cpi[y]/100; s.append(round(b,2))
P("bázis 2019=100:",s)
P("hibás összeadás 14.5+17.6+3.7 =",14.5+17.6+3.7)
P("átl ütem 3 év", (1.145*1.176*1.037)**(1/3))
P("Panni bér 300e->400e: nominal",400/300," real",400/300/(1.145*1.176*1.037))
w=[300,330,370,400]  # 2021..2024
cp=[1,1.145,1.145*1.176,1.145*1.176*1.037]
P("nom lánc",[round(w[i]/w[i-1]*100,1) for i in range(1,4)]," real lánc",[round(w[i]/w[i-1]/(cpi[2021+i]/100)*100,1) for i in range(1,4)])
P("reál bázis",[round(w[i]/w[0]/cp[i]*100,1) for i in range(4)], "reálérték 2021-es áron", [round(w[i]/cp[i],1) for i in range(4)])
P("== 4.6 egyszerű")
B0=[8,2]; v0=[600,300]; B1=[8,12]; v1=[630,330]
W=lambda B,v: sum(a*b for a,b in zip(B,v))/sum(B)
V0,V1,VS=W(B0,v0),W(B1,v1),W(B1,v0)
P("V0",V0,"V1",V1,"VS",VS,"KT",V1-V0,"KR",V1-VS,"KÖ",VS-V0,"IF",V1/V0,"IR",V1/VS,"IÖ",VS/V0,"IR*IÖ",V1/VS*VS/V0)
P("alt súly VS'",W(B0,v1))
P("  ha összetétel nem változik (8,2)->(8,2):",W([8,2],v1), W([8,2],v1)-V0)
P("== NGA 9.1")
B0=[85,113,152]; B1=[138,110,114]; v0=[538,612,695]; v1=[540,615,696]
V0,V1,VS=W(B0,v0),W(B1,v1),W(B1,v0)
P("sum",sum(a*b for a,b in zip(B0,v0)),sum(a*b for a,b in zip(B1,v1)),sum(a*b for a,b in zip(B1,v0)))
P("V0",V0,"V1",V1,"VS",VS,"KT",V1-V0,"KR",V1-VS,"KÖ",VS-V0,"IF",V1/V0,"IR",V1/VS,"IÖ",VS/V0)
P("arányok",[round(x/350*100,1) for x in B0],[round(x/362*100,1) for x in B1])
P("KR mint k átlaga", sum(b*(a-c) for b,a,c in zip(B1,v1,v0))/362, " IR harmonikus", sum(b*a for b,a in zip(B1,v1))/sum(b*a/(a/c) for b,a,c in zip(B1,v1,v0)))
P("== korstandardizálás")
rO=[1,8,50]; rI=[2,10,60]; sO=[0.3,0.3,0.4]; sI=[0.6,0.3,0.1]
cO=sum(a*b for a,b in zip(rO,sO)); cI=sum(a*b for a,b in zip(rI,sI))
P("nyers Ö",cO,"I",cI)
P("std Ö-szerkezet: Ö",cO,"I",sum(a*b for a,b in zip(rI,sO)))
P("std I-szerkezet: Ö",sum(a*b for a,b in zip(rO,sI)),"I",cI)
eq=[1/3]*3; P("std egyenlő: Ö",sum(a*b for a,b in zip(rO,eq)),"I",sum(a*b for a,b in zip(rI,eq)))
VS=sum(a*b for a,b in zip(sI,rO)); P("NGA-felbontás 0=Ö,1=I: VS",VS,"KT",cI-cO,"KR",cI-VS,"KÖ",VS-cO,"IF",cI/cO,"IR",cI/VS,"IÖ",VS/cO)
