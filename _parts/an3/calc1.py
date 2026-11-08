from math import *
f=lambda x:(x*x-1)/(x-1)
for x in [0.9,0.99,0.999,1.1,1.01,1.001]: print('hole',x,f(x))
for x in [1,0.5,0.1,0.01]: print('sinx/x',x,sin(x)/x)
for x in [1,0.1,0.01,0.001]: print('sin(pi/x)',x,sin(pi/x))
for x in [2/3,0.4,2/7]: print('sin(pi/x) other',x,sin(pi/x))
# PT2 84
g=lambda x:(x*x-5*x+6)/(x**3-2*x*x-x+2); print('pt84',g(2.000001),-1/3)
print('55b',(2.000001**2-6*2.000001+8)/(2.000001**2+3*2.000001-10),-2/7)
print('55c', (1e-6**2-1e-6)/(1e-18+1e-12+1e-6))
x=4.000001; print('sqrt', (sqrt(x)-2)/(x-4))
x=1e8; print('sqrtx2+x -x',sqrt(x*x+x)-x, sqrt(x+5)-sqrt(x+1))
x=-1e6; print('sqrt(x2+1)/x at -inf',sqrt(x*x+1)/x)
x=1e-5; print('sin3x/x',sin(3*x)/x,'1-cos/x2',(1-cos(x))/x**2,'tan/x',tan(x)/x)
x=1e7; print('(x+2)/x)^(x+100)',((x+2)/x)**(x+100),e**2, '(1+5/3x)^(2x+4)',(1+5/(3*x))**(2*x+4),e**(10/3))
x=1e-7; print('(e^2x-1)/x',(exp(2*x)-1)/x, 'ln(1+3x)/x',log(1+3*x)/x)
# thermo
V=lambda T:1000+0.0075*(T-4)**2
print('V20',V(20),'V0',V(0),'V4',V(4))
r1=sqrt(256+0.1/0.0075)-16; r2=16-sqrt(256-0.1/0.0075); print('delta20',r1,r2,min(r1,r2))
print('ice 1000/0.9167',1000/0.9167, 'water0 1000/0.99984',1000/0.99984,'20C',1000/0.99820)
# bisection x^3-x-1
h=lambda x:x**3-x-1
a,b=1,2;rows=[]
for i in range(12):
    m=(a+b)/2; rows.append((i+1,a,b,m,h(m)))
    if h(a)*h(m)<=0: b=m
    else: a=m
for r in rows: print(r)
from math import cos
a,b=0,pi/2
for i in range(40):
    m=(a+b)/2
    if (cos(a)-a)*(cos(m)-m)<=0: b=m
    else: a=m
print('dottie',a)
# IRR: 1e6 = a*(q^3-1)/(q^3(q-1)), a=402115
F=lambda p:(lambda q:402115*(q**3-1)/(q**3*(q-1)))(1+p/100)-1e6
print('F5',F(5),'F15',F(15),'F10',F(10))
a,b=5,15
for i in range(30):
    m=(a+b)/2
    if F(a)*F(m)<=0:b=m
    else:a=m
print('irr',a)
# eps-delta x^2 at 3
for eps in [1,0.1,0.01]: print('x2 at3 eps',eps,'exact delta',sqrt(9+eps)-3, 'min(1,eps/7)',min(1,eps/7))
print('3x-1 at 2: delta=eps/3')
# xy/(x2+y2) along y=mx
for m in [0,1,2,-1]: print('m',m,m/(1+m*m))
