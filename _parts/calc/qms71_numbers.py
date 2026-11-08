# ms7 q1.js (7.1–7.4 kvízek) számainak ellenőrzése
from math import comb, sqrt
from scipy.stats import binom, norm
B=binom
print("== 7.1")
print("6 csésze mind:", 1/comb(6,3), "1/8", 1/8, "1/6", 1/6, "variáció 1/120", 1/(6*5*4))
h=[comb(4,k)*comb(4,4-k) for k in range(5)]; print("8 csésze esetek", h, sum(h))
print("P(>=3)=17/70", 17/70, "P(=3)", 16/70, "P(4)", 1/70, "1-P(>=3)", 53/70)
print("10 dobás P(>=8)", 56/1024, B.sf(7,10,.5), "P(=8)", 45/1024, "P(>=9)", 11/1024, "1-", 1-56/1024)
print("20 dobás P(>=15)", B.sf(14,20,.5), "100 P(>=60)", B.sf(59,100,.5), "P(X=50)", B.pmf(50,100,.5))
print("szöveg: kocka P(>=18|60,1/6)", B.sf(17,60,1/6), 1/B.sf(17,60,1/6))
print("szöveg: 1/0,028, 1/0,0018", 1/B.sf(59,100,.5), 1/B.sf(64,100,.5))
print("== 7.2")
for k in range(57,63): print(k, round(B.sf(k-1,100,.5),4))
print("tényleges alfa X<=39|X>=61", B.cdf(39,100,.5)+B.sf(60,100,.5))
print("X<=40|X>=60", B.cdf(40,100,.5)+B.sf(59,100,.5), "X<=41|X>=59", B.cdf(41,100,.5)+B.sf(58,100,.5))
print("kvantilisek 3%: két", norm.ppf(.985), "egy", norm.ppf(.97), "1,96", norm.ppf(.975), "2,576", norm.ppf(.995))
se=4/sqrt(20); print("joghurt z", (196-200)/se, "199:", (199-200)/se, "√n nélkül", (199-200)/4, "σ/n", (199-200)/(4/20))
print("z=1,8 kétoldali krit 1,96, jobboldali 1,645")
print("10 dobás 7 fej P(>=7)", B.sf(6,10,.5), "1-p", 1-B.sf(6,10,.5))
print("ha p=0,7: P(6..8 fej)", B.cdf(8,10,.7)-B.cdf(5,10,.7))
# Wilson 7/10
z=1.96; n=10; ph=.7
c=(ph+z*z/(2*n))/(1+z*z/n); hw=z*sqrt(ph*(1-ph)/n+z*z/(4*n*n))/(1+z*z/n); print("Wilson", c-hw, c+hw)
print("== 7.3")
print("60 fej kétoldali", B.sf(59,100,.5)+B.cdf(40,100,.5), "egyoldali", B.sf(59,100,.5), "normális z=2", 2*norm.sf(2), "korr z=1,9", 2*norm.sf(1.9))
print("z=2,5: egy", norm.sf(2.5), "két", 2*norm.sf(2.5), "Phi", norm.cdf(2.5), "4x", 4*norm.sf(2.5))
print("10 dobás 9 fej kétoldali", 22/1024)
print("Phi(-4,47)", norm.cdf(-4.47), 1/norm.cdf(-4.47))
for prior,pw in [(100,.8),(500,.8),(10,.8),(200,.8)]:
    tp=prior*pw; fp=(1000-prior)*.05; print("prior",prior,"TP",tp,"FP",fp,"téves",fp/(tp+fp),"FP/TP",fp/tp,"FP/1000",fp/1000)
print("két vizsgálat", 1-.95**2, 2*.05, .05**2)
print("1-1/70", 1-1/70)
# p-tánc: d=0,5, n=32 / csoport, kétoldali t-próba ereje + p percentilisek (szimuláció)
import numpy as np
from scipy.stats import ttest_ind, nct, t as tdist
df=62; ncp=0.5*sqrt(32/2); tc=tdist.ppf(.975,df)
print("p-tánc erő", nct.sf(tc,df,ncp)+nct.cdf(-tc,df,ncp))
rng=np.random.default_rng(1); a=rng.normal(.5,1,(100000,32)); b=rng.normal(0,1,(100000,32))
p=ttest_ind(a,b,axis=1).pvalue; print("p percentilisek", np.percentile(p,[10,50,90]), (p<=.05).mean())
print("== 7.4")
for pt in [.5,.55,.6,.65,.7]:
    pw=B.cdf(39,100,pt)+B.sf(60,100,pt); print("erő", pt, round(pw,4), "béta", round(1-pw,4))
f=lambda shift,se,zc=1.645: norm.sf(zc-shift/se)
print("IQ n=25", f(5,3), "n=100", f(5,1.5), "béta n=100", 1-f(5,1.5), "SE=15/100", f(5,.15), "1%", f(5,3,2.326), "110", f(10,3))
print("d 54-50/8", 4/8, "8/4", 8/4)
for zc,zb,d in [(1.645,.842,.5),(1.645,0,.5),(1.96,.842,.5),(1.645,.842,1/3),(1.645,1.282,1/3)]:
    print("n", zc,zb,d, ((zc+zb)/d)**2)
print("hiba: gyök nélkül", (1.645+.842)/.5, "d=0,5 n=15 erő", norm.sf(1.645-.5*sqrt(15)), "n=25", norm.sf(1.645-.5*5))
print("z_0,8", norm.ppf(.8), "z_0,9", norm.ppf(.9))
print("magyarázat: 20-ból >=13", B.sf(12,20,.5), "IQ béta 5%/1%", 1-f(5,3), 1-f(5,3,2.326))
