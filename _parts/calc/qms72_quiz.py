# ms7 q2.js (7.5-7.8 + fejezetzáró) kvízszámainak és rossz válaszainak ellenőrzése
from itertools import combinations
from math import comb, sqrt, ceil
from scipy import stats
import numpy as np
N=stats.norm; B=stats.binom
print("== 7.5")
se=4/sqrt(20); lo,hi=196-2.576*se,196+2.576*se; print("99% KI",lo,hi,[m for m in [193,194,196,198,199,200] if lo<m<hi])
se=13.27/sqrt(15)
for m in [388,392,400,405]: t=(398-m)/se; print(" konzerv mu0",m,"t",round(t,3),"p",round(2*stats.t.sf(abs(t),14),4))
print("== 7.6")
d=[7,9,11,3,5,4]
def diffs(d):
    out=[]
    for g in combinations(range(6),3):
        a=[d[i] for i in g]; b=[d[i] for i in range(6) if i not in g]; out.append(np.mean(a)-np.mean(b))
    return out
D=diffs(d); obs=(11+9+5)/3-(7+3+4)/3; print("új 11,9,5 obs",obs, sum(x>=obs-1e-9 for x in D)/20)
print("6 diák kétoldali", sum(abs(x)>=5-1e-9 for x in D)/20)
print("5+5", comb(10,5), 10*9*8*7*6, 2**10, 1/comb(8,4), 1/16, 1/256)
print("230/10000",230/10000)
print("== 7.7")
print("8 próba", 1-.95**8, 8*.05, .95**8, "60 próba várható",60*.05, 1-.95**60)
print("20 Bonf", 1-.9975**20, .9975**20, 1-.95**20, .05/20)
print("10 Bonf", .05/10)
print("== 7.8")
print("d iq", .1/15, "SE", 15/1000)
z=.3/(15/200); print("z 40000", z, .3/(15/40000), .3/15, 2*N.sf(z))
s=sqrt(.25/1e7); print("coin z", .001/s, .001/(.25/sqrt(1e7)), .001/(.25/1e7), .001/sqrt(.25/1e6))
print("== final")
print("tea10 ≥4", (comb(5,4)*comb(5,1)+1)/252, 25/252, 1/252, 5/252)
se=4/sqrt(16); z=(198-200)/se; print("jog16 z",z, N.ppf(.03), N.ppf(.015))
print("20 dobás", B.sf(13,20,.5), B.sf(14,20,.5), B.sf(15,20,.5), B.pmf(15,20,.5), 2*B.sf(14,20,.5), 1-2*B.sf(14,20,.5))
print("1000 kutatás 20%", 160, 40, 40/200, 40/160, 40/1000)
for za,zb,name in [(1.645,.842,"ok"),(1.96,.842,"a/2"),(1.645,0,"no beta")]:
    v=((za+zb)/.5)**2; print(" n",name,v,ceil(v))
print(" no square",(1.645+.842)/.5)
print(" power at n=25", N.sf(1.645-.5*5))
d=[1,2,6,4,5,9]; obs=(4+5+9)/3-(1+2+6)/3; S=sum(d)
cnt=sum(1 for g in combinations(d,3) if sum(g)>=18); print("perm 1,2,6 vs 4,5,9 obs",obs,cnt,cnt/20,[g for g in combinations(d,3) if sum(g)>=18])
cnt2=sum(1 for g in combinations(d,3) if abs(sum(g)/3-(S-sum(g))/3)>=obs-1e-9); print(" kétoldali",cnt2/20)
print("12 Bonf", .05/12, .05*12)
print("tea12", 37/924, 36/924, 1/924)
print("1-0.95^20",1-.95**20)
print("== final A/B vizsgálat (kétcsoportos z)")
for n,dd in [(40,6),(200000,.3)]:
    se=15*sqrt(2/n); z=dd/se; print(n,dd,"z",z,"p",2*N.sf(z),"d",dd/15)
print("1-0.95^12",1-.95**12)
