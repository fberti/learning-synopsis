from math import *
def ann(V,p,n): q=1+p/100; return V*q**n*(q-1)/(q**n-1)
a=ann(1e6,10,3); print("a",a)
D=1e6
for k in range(1,4):
    i=D*0.10; t=a-i; D=D-t; print(k, round(i,2), round(t,2), round(D,2))
print("total", 3*a, 3*a-1e6)
# 20M 20 ev 6% eves
a2=ann(20e6,6,20); print("20M 6% 20y", a2, 20*a2)
# havi: 20M, 6%/12, 240
q=1+0.06/12; m=20e6*q**240*(q-1)/(q**240-1); print("havi", m, 240*m)
# gyujtojaradek KM 8 ev 100000, 7%
q=1.07; print("S8", 100000*q*(q**8-1)/(q-1))
# 10 ev 20000/ev? havi 20 000 for 10 years at 4%/12? 
print("KM 10000 5% 6ev", 10000*1.05**6)
print("dupla 5%", log(2)/log(1.05), "6%", log(2)/log(1.06), "8%", log(2)/log(1.08))
# jelenertek KM
print(140000+70000/1.07**2+70000/1.07**4)
# orokjaradek
print(100000/0.05)
