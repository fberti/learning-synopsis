from math import *
def firstN(f,A,eps,start=1,span=100000):
    # smallest N such that all n>N satisfy |f(n)-A|<eps (checked up to span past)
    bad=[n for n in range(start,start+span) if not abs(f(n)-A)<eps]
    return max(bad) if bad else start-1
for n in [1,10,100,1000]: print(n, 1/n, (2*n+1)/(n+3), (-1)**n, n*n)
print("radium N", firstN(lambda n:0.5**n,0,0.01,0))
print("1/n .1", firstN(lambda n:1/n,0,0.1), firstN(lambda n:1/n,0,0.001))
print("p1",firstN(lambda n:1/n,0,0.05), firstN(lambda n:1/n**2,0,1e-4), firstN(lambda n:(-1)**n/n,0,0.01), firstN(lambda n:1+1/sqrt(n),1,0.1), firstN(lambda n:3/(n+2),0,0.001))
print("c", firstN(lambda n:(2*n+1)/(n+3),2,0.01), firstN(lambda n:(3*n-1)/(n+1),3,0.1))
print("cp", firstN(lambda n:(n+2)/n,1,0.01), firstN(lambda n:(4*n+3)/(2*n+1),2,0.001), firstN(lambda n:(1-2*n)/(n+1),-2,0.01), firstN(lambda n:(2*n+1)/(n+3),2,1e-4,span=200000), firstN(lambda n:(n*n+3)/(2*n*n),0.5,0.001))
print("inf", [n for n in range(1,2000) if not 3*n-5>1000][-1], [n for n in range(1,20000) if not sqrt(n)>100][-1], [n for n in range(1,2000) if not n*n>1e6][-1])
