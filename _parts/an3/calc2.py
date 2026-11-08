from math import *
for x in [0.1,0.01,-0.01,-0.1]: print('2^x',x,(2**x-1)/x)
for x in [0.01,-0.01,0.1]: print('sqrt9',x,(sqrt(x+9)-3)/x)
for x in [1.1,1.01,0.99]: print('x3-1',x,(x**3-1)/(x-1))
for x in [2.1,2.01,1.99,1.9]: print('x2-4',x,(x*x-4)/(x-2))
print(log(2))
for x in [1,0.5,0.1,0.01,-0.1]: print('sinx/x deg?', x, sin(x)/x, sin(radians(x))/x)
