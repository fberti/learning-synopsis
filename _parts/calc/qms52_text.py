# Checks of numbers in the chapter text 5.5-5.8 + 10-end
from scipy import stats as S
import math, itertools, statistics as st
n=S.norm
print("P(Z^2<1)",2*n.cdf(1)-1, "P(Z^2<3.84)",S.chi2.cdf(3.84,1))
print("P(chi9>13.5)",S.chi2.sf(13.5,9), "q9 .025/.975",S.chi2.ppf([.025,.975],9), "->",4/9*S.chi2.ppf(.025,9),4/9*S.chi2.ppf(.975,9))
print("chi9 .95",S.chi2.ppf(.95,9), 4*S.chi2.ppf(.95,9)/9, "D(s2)",math.sqrt(32/9), "D chi9", math.sqrt(18))
print("t975",[round(S.t.ppf(.975,k),3) for k in (1,4,9,29,100)], n.ppf(.975))
print("P|t4|>2",2*S.t.sf(2,4),"P|Z|>2",2*n.sf(2), "ratio", S.t.sf(2,4)/n.sf(2))
t=2/(6/math.sqrt(10)); print("t",t,"P|t9|>t",2*S.t.sf(t,9))
print("2.045/1.96",1.96/2.045, "2.776/1.96", 2.776/1.96)
print("F",S.f.ppf(.95,5,10),S.f.ppf(.95,10,5),S.f.ppf(.05,5,10),1/S.f.ppf(.95,10,5), "F10,5 .05",S.f.ppf(.05,10,5),1/3.326)
print("P(F5,10>4)",S.f.sf(4,5,10), "t9^2",S.t.ppf(.975,9)**2, S.f.ppf(.95,1,9), 2.262**2)
# bootstrap 2,4,9
x=[2,4,9]; ms=[sum(c)/3 for c in itertools.product(x,repeat=3)]
print("boot mean SE",st.pstdev(ms), st.stdev(x)/math.sqrt(3), st.stdev(x), st.stdev(x)/math.sqrt(3)*math.sqrt(2/3), 26/9)
from collections import Counter
print(sorted(Counter(round(m,2) for m in ms).items()))
print(Counter(sorted(c)[1] for c in itertools.product(x,repeat=3)))
d=[12,15,17,18,20,22,23,25,28,34,45,61]
print("ing", st.mean(d), st.median(d), st.stdev(d), st.stdev(d)/math.sqrt(12))
import random; random.seed(1)
bm=[];bd=[]
for _ in range(20000):
    r=random.choices(d,k=12); bm.append(st.mean(r)); bd.append(st.median(r))
bm.sort(); print("boot SE mean",st.pstdev(bm),"median",st.pstdev(bd),"pct",bm[500],bm[19500])
# regression
print("z_X",1/math.sqrt(.5), 1+0.5*1/math.sqrt(.5)*math.sqrt(.5))
print("r",100/125, .8*20, .8*1.5)
# 5.8
print("SE",math.sqrt(.24/1000), 1.96*math.sqrt(.24/1000), math.sqrt(2)*math.sqrt(.24/1000), 1.96*math.sqrt(2)*math.sqrt(.24/1000))
print("fpc",math.sqrt((8e6-1000)/(8e6-1)), math.sqrt((260e6-1000)/(260e6-1)))
print("n",(1.96/.03)**2*.25,(1.96/.02)**2*.25)
print("one pkg",n.cdf(-0.5),"25",n.cdf(-2.5),"chi",24*196/100,S.chi2.sf(47.04,24))
print("1500",1.96*math.sqrt(.21/1500), math.sqrt(.21/1500), "4 pkg",n.cdf(-1), "fpc 20000", math.sqrt(19600/19999))
print("n>=",(1.96*10/2)**2)
# 10-end
print("sp", 6/3, n.sf(1.5), 1.96*math.sqrt(.25*.75/600))
print("dice", math.sqrt(35/12)/math.sqrt(300), (3.4-3.5)/(math.sqrt(35/12)/math.sqrt(300)), n.cdf((3.4-3.5)/(math.sqrt(35/12)/math.sqrt(300))))
print("fpc1200", 5/math.sqrt(300), math.sqrt(900/1199), 5/math.sqrt(300)*math.sqrt(900/1199))
y=[10,12,14,16]; print("t4", st.mean(y), st.stdev(y), st.stdev(y)/2, 3/(st.stdev(y)/2), S.t.ppf(.975,3))
