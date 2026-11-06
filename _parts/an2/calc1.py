from math import *
from fractions import Fraction as F
print("motivacio 100%:")
for n in [1,2,4,12,52,365,8760,525600,31536000]:
    print(n, round(1e6*(1+1/n)**n, 2))
print("e*1e6", e*1e6)
print("5%:")
for n in [1,4,12,365]: print(n, round(1e6*(1+0.05/n)**n,2))
print("cont", 1e6*exp(0.05))
# 2.3 kuszob (2n+1)/(n+3) -> 2, |a-2| = 5/(n+3)
for eps in [0.1,0.01,0.001]:
    n=1
    while not all(abs((2*m+1)/(m+3)-2)<eps for m in range(n,n+2000)): n+=1
    print("kuszob eps",eps,"first n",n)
# radium 1/2^n < 0.001
n=0
while 0.5**n>=0.001: n+=1
print("radium < 1 g:", n, "16000*",n)
# rekurziv sqrt(2+a)
a=0
for i in range(8): print(i, a); a=sqrt(2+a)
# szamtani 
print(sum(range(1,101)))
