from fractions import Fraction as F
print(100*1.1**29, 100+10*29)
print([F(n-1,n+1) for n in range(1,6)], [F(2**n,n) for n in range(1,6)])
print(2**64-1, float(2**64-1))
b=100000
for i in range(3): b=1.02*b+10000; print(b)
print(sum(range(20,39,2)), 12*3675, (300+435)*10/2, 300+9*15)
print(3*2**7, 3*(2**8-1), 81*F(1,3)**5, (3**8-1)//2, 2*(-3)**3, 2+-6+18-54)
print(0.5**10*1000)
a=[1]
for i in range(4): a.append(F(1,1+a[-1]))
print(a)
