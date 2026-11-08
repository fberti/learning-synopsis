# Analízis 4 – a 4.5–4.8 szakasz szövegének számai (ellenőrzés a kvízíráshoz)
from math import *
print("x^x diffq 2", (2.001**2.001-4)/0.001, 4*(log(2)+1), 4*log(2))
print("sqrt table", [(h, sqrt(4+h), 2+h/4, 2+h/4-sqrt(4+h)) for h in (1,0.1,0.01)])
print("f''(4)/2 sqrt", -0.25*4**-1.5/2, 1/64)
print("sin .1", sin(.1), "e^.02", exp(.02), "1.01^10", 1.01**10, "1.02^50", 1.02**50, 50*49)
print("sqrt99", sqrt(99), "ln1.05", log(1.05), "cbrt 8.3", 8.3**(1/3), 2+0.3/12, "1/1.02", 1/1.02, "cos.1", cos(.1))
print("sq 3.1", 3.1**2-9, "cube", 2.1**3-8, 3*4*.1)
print("circle", 2*pi*10*.1, pi*(10.1**2-100), 100*pi)
print("cube V", 3*25*.02, 1.5/125, "sphere", 4*pi*9*.01)
V=lambda T: 1000+0.0075*(T-4)**2
for T0 in (20,10):
    d=sqrt((V(T0)+0.1-1000)/0.0075)+4-T0
    print("water",T0, 0.015*(T0-4), 0.1/(0.015*(T0-4)), d)
print("V' 30,4,0", 0.015*26, 0, 0.015*-4)
C=lambda q:200+5*q+0.01*q*q; R=lambda q:20*q-0.01*q*q
print("C", C(100), C(101)-C(100), C(100)/100, 5+0.02*200, C(200)-C(199), "P375", R(375)-C(375))
print("B", 1000*log(1.05), 1000*1.05**10*log(1.05), log(1.05))
print("E", 20*-2/60, 30*-2/40)
print("brake", 20*2.5-2*2.5**2, 20*5-2*25, [t for t in (3,7) if 20*t-2*t*t==42], 20-12)
print("s(t)=t^3-6t^2+9t v(2)", 3*4-24+9, 6*2-12)
print("2026 mod 4", 2026%4, "100 mod 4", 100%4, 2**10, factorial(5))
