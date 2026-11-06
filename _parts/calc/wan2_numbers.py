from math import *
from fractions import Fraction
# growth-race: exact integer comparisons
def last_ge(f, g, N=5000):
    last = None
    for n in range(1, N+1):
        if f(n) >= g(n): last = n
    return last
print("n^10 vs 1.1^n last n with n^10>=1.1^n:", last_ge(lambda n: Fraction(n)**10, lambda n: Fraction(11,10)**n, 1000))
print("n^2 vs 2^n:", [(n, n*n, 2**n) for n in range(1,7)], "last ge:", last_ge(lambda n:n*n, lambda n:2**n, 200))
print("2^n vs n!:", last_ge(lambda n:2**n, factorial, 200))
print("n! vs n^n last ge:", last_ge(factorial, lambda n:n**n, 200))
print("ln vs sqrt last ge:", last_ge(lambda n:log(n), sqrt))
print("n vs n^2 last ge:", last_ge(lambda n:n, lambda n:n*n))
print("1.1^n vs 2^n:", last_ge(lambda n:Fraction(11,10)**n, lambda n:2**n))
print("n^10 vs 2^n:", last_ge(lambda n:n**10, lambda n:2**n))
print("ratio n^10/1.1^n at 20:", 20**10/1.1**20, "at 100:", 100**10/1.1**100, "at 1000:", 1000**10/1.1**1000)
print("ratio n^2/2^n at 20:", 400/2**20, " 2^n/n! at 20:", 2**20/factorial(20), " n!/n^n at 20:", factorial(20)/20**20)
# series-sum
S=lambda f,n: sum(f(k) for k in range(1,n+1))
print("geo 0.5,0.5,10:", S(lambda k:0.5*0.5**(k-1),10), 1-2**-10)
print("geo 0.9,0.1,10:", S(lambda k:0.9*0.1**(k-1),10))
print("harm 10:", S(lambda k:1/k,10), " 100:", S(lambda k:1/k,100), " ln100+g:", log(100)+0.5772156649)
s=0; n=0
while s<=10: n+=1; s+=1/n
print("harm >10 at n=", n, s)
print("1/n^2 10:", S(lambda k:1/k**2,10), "lim", pi**2/6)
print("alt 10:", S(lambda k:(-1)**(k+1)/k,10), "ln2", log(2))
print("1/n! 10:", S(lambda k:1/factorial(k),10), "e-1", e-1)
print("harm 10: ln10+g", log(10)+0.5772156649)
# annuity
def ann(V,p,n): q=1+p/100; return V*q**n*(q-1)/(q**n-1)
a=ann(1e6,10,3); print("a", a); D=1e6
for k in range(1,4):
    i=D*0.1; t=a-i; print(k, round(D), round(i), round(t), round(D-t)); D-=t
print("total int", 3*a-1e6)
m=ann(20e6,6/12,240); print("havi", m, 240*m, "kamat", 240*m-20e6)
print("evi", ann(20e6,6,20), 20*ann(20e6,6,20))
