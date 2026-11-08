# Numeric answers and distractors for q2.js (ms5-55, ms5-56, ms5-57, ms5-final)
from scipy import stats as S
import math, itertools, statistics as st
from collections import Counter
from fractions import Fraction as Fr
n=S.norm
print("== ms5-55")
# Q2: sigma^2=4, n=10, P(s^2>6)
print("chi transform", 9*6/4, "sigma inst sigma^2", 9*6/2, "n", 10*6/4, "P", S.chi2.sf(13.5,9))
# Q3: n=16, xbar 103, s 8, mu 100
print("t", 3/(8/4), "SD", 3/8, "n not sqrt", 3/(8/16), "df", 15)
# Q5 quantiles
print("t4",S.t.ppf(.975,4),"t5",S.t.ppf(.975,5),"z95",n.ppf(.95),"z975",n.ppf(.975))
# Q7 F
print("F10,5 .05", S.f.ppf(.05,10,5), 1/3.326, 1/4.735, S.f.ppf(.95,5,10), S.f.ppf(.95,10,5))
# Q8 E/D chi
print("chi_k E/D2 k=9",S.chi2.mean(9),S.chi2.var(9))
print("== ms5-56")
for k in (3,):
    print("ordered",k**k,"multisets",math.comb(2*k-1,k),"perm",math.factorial(k))
x=[1,3,5]; ms=[sum(c)/3 for c in itertools.product(x,repeat=3)]
print("1,3,5 boot SE",st.pstdev(ms),"var",st.pvariance(ms),"s/sqrt3",st.stdev(x)/math.sqrt(3),"sigmahat",st.pstdev(x), "s",st.stdev(x))
med=Counter(sorted(c)[1] for c in itertools.product([2,4,9],repeat=3)); print("median",med, Fr(13,27), Fr(9,27))
R=2000; print("pct idx", .025*R, .975*R, .05*R, .95*R)
print("== ms5-57")
print("z_Y", .6*2, 2/.6, 2*(1-.6))
for zx,mean,sd,r in [(-2,176,7,.5)]:
    print("son", mean+sd*r*zx, "noreg",162, "z/r", mean+sd*zx/r, "r^2", mean+sd*r*r*zx)
print("r", 36/(36+64), 6/(6+8), 6/8, 36/64)
# coin model enumeration
rows=[(t,l1,l2) for t in (0,1) for l1 in (0,1) for l2 in (0,1)]
for xv in (0,1,2):
    ys=[t+l2 for t,l1,l2 in rows if t+l1==xv]; print("X",xv,"E(Y)",sum(ys)/len(ys))
print("== ms5-final")
xb=[3,4,5,6,5,6,7,7,8,9]; print("vn P(5<=xbar<=7)", sum(5<=v<=7 for v in xb)/10)
s=[2,4,6,8,10]; wr=[(a+b)/2 for a in s for b in s]; print("v P", sum(5<=v<=7 for v in wr)/25, "3/7", 3/7)
print("sqrt n", 100*9, 100*3, 100*math.sqrt(3), 100*27)
se=12/10; f=math.sqrt(300/399); print("fpc", se*f, se, se/f, se*300/399, se*0.75, f)
print("CLT", n.sf(2), n.sf(0.2), n.cdf(0.2), n.sf(20), 2*n.sf(2), "Phi(2)",n.cdf(2))
print("prop", 1.96*math.sqrt(.25/400), math.sqrt(.25/400), 1.96*.25/400, 2*1.96*math.sqrt(.25/400))
print("np", 200*.03, 200*.97)
print("chi q", 9*16.919/9, 9*16.919/10, 3*16.919/9, 16.919/9, S.chi2.ppf(.95,9))
t=4/(5/math.sqrt(10)); print("t", t, 4/5, 4/(5/10), 4/(5*math.sqrt(10)), S.t.ppf(.975,9))
print("reg", .7*30, 30/.7, 30*(1-.7))
se1=math.sqrt(.25/1000); print("two surveys", se1, math.sqrt(2)*se1, 1.96*math.sqrt(2)*se1, 1.96*se1, 2*1.96*se1)
