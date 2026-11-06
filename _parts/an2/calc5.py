from math import *
for q in [2,0.5,-0.5,-2,1,-1]: print(q,[round(q**n,4) for n in [1,2,3,4,5,10]])
for n in [1,2,3,4,5,10,100,1000]: print(n, round(2**(1/n),4), round(n**(1/n),4))
for n in [10,20,50]: print(n, round(log(n),2), round(sqrt(n),2), n**2, 2**n, factorial(n), f"{float(n**n):.3e}", f"{float(factorial(n)):.3e}", f"{2.0**n:.3e}")
print(100**10/1.1**100)
cross=[n for n in range(2,2000) if n**10>=1.1**n][-1]; print("n^10 vs 1.1^n last n where n^10>=1.1^n", cross)
for n in [1,2,3,5,10,100,1000,10**6]: print(n, (1+1/n)**n)
N=10**7
for e_ in [lambda n:(1+2/n)**n, lambda n:(1-1/n)**n, lambda n:((n+1)/n)**(3*n), lambda n:((n+1)/(n-1))**n, lambda n:(1+1/n**2)**n, lambda n:(1+1/(2*n))**n,
           lambda n:((n-1)/(n+1))**n, lambda n:(1+1/n)**(n+1), lambda n:((2**n+3**(n+1))/(3**n+1)) if n<500 else 3]:
    print(e_(N))
print(exp(2),exp(-1),exp(3),exp(-2),sqrt(e))
n=400; print((2**n+3**(n+1))/(3**n+1), (3**(n+1)-2**(n-1))/(3**n+3))
