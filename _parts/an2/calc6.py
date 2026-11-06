from fractions import Fraction as F
from math import *
print(sum(F(1,3**k) for k in range(1,4)), sum(F(1,k*(k+1)) for k in range(1,6)))
print(sum(F(1,k)-F(1,k+2) for k in range(1,2000)).__float__())
print(F(9,10)/(1-F(1,10)), F(3,10)/(1-F(1,10)), F(12,100)/(1-F(1,100)), F(7,10)/(1-F(1,10)), F(1,10)+F(6,100)/(1-F(1,10)))
print(2+2*1.5/(1-0.75))
print(F(1)/(1-F(1,3)), F(4)/(1+F(1,2)))
H=lambda n:sum(F(1,k) for k in range(1,n+1))
print(H(16).__float__(), H(4)/2, float(H(4)/2))
print(sum(k/2**k for k in range(1,200)), sum(2**k/factorial(k) for k in range(1,100)), exp(2)-1, pi**2/6)
print(sum(1/(k*k+k) for k in range(1,100000)))
