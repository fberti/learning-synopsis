import math as m
s=lambda t:5*t*t
print("avg 0-2",(s(2)-s(0))/2,"1-2",(s(2)-s(1))/1)
for h in [1,0.1,0.01,0.001,-0.1,-0.01]: print("h",h,(s(1+h)-s(1))/h)
for h in [1,0.1,0.01]: print("t=2",h,(s(2+h)-s(2))/h)
# 1/x at 2
f=lambda x:1/x; print("1/x at2", (f(2.001)-f(2))/0.001)
print("sqrt4.1",m.sqrt(4.1),2+0.1/4, m.sqrt(4.1)-2.025)
print("e^0.02",m.exp(0.02),"sin0.1",m.sin(0.1))
print("x^2 at 3 dx .1: dy", 3.1**2-9)
print("circle dA",2*m.pi*10*0.1, m.pi*(10.1**2-100))
print("thermo dV/dT at 20",0.015*16, 0.1/0.24, m.sqrt(256+0.1/0.0075)-16)
C=lambda q:200+5*q+0.01*q*q
print("C'(100)",5+0.02*100,"C101-C100",C(101)-C(100),"avg",C(100)/100)
print("profit q", (20-5)/0.04)
print("B'(0)",1000*m.log(1.05), "B'(10)",1000*1.05**10*m.log(1.05))
print("braking v(2)",20-8,"stop",5, 20*5-2*25)
print("circle tan", -3/4, "explicit",-3/m.sqrt(16))
print("2026 mod4",2026%4)
x=2.0; print("x^x' at 2",x**x*(m.log(x)+1))
