# an3 q2.js (an3-35, an3-36, an3-37, an3-final) – minden szám ellenőrzése
import math, sympy as sp
x, y, t, a, b, k, c = sp.symbols('x y t a b k c', real=True)
L = lambda e, p, d='+-': sp.limit(e, x, p, d)
print("== 3.5")
# Q1: x^2+1 (x<1), 3x-1 (x>=1)
print("Q1", L(x**2+1, 1, '-'), L(3*x-1, 1, '+'), (3*x-1).subs(x,1))
print("Q1 u:", L(x+1,1,'-'), L(x**2,1,'+'))
# Q2 floor a 2-ben
print("Q2 floor:", math.floor(2-1e-9), math.floor(2), math.floor(2+1e-9))
# Q4 szakadástípusok a 3-ban
print("Q4 a", L((x-3)/(x**2-9),3), "b", L((x+3)/(x**2-9),3,'-'), L((x+3)/(x**2-9),3,'+'),
      "c", L(sp.Abs(x-3)/(x-3),3,'-'), L(sp.Abs(x-3)/(x-3),3,'+'))
# Q5 (x^2-5x+6)/(x-2) a 2-ben; hibás (x+3)-mal: 5
print("Q5", L((x**2-5*x+6)/(x-2),2), sp.factor(x**2-5*x+6), "hibás gyöktényező (x+3)->", 2+3)
# Q6 x+a (x<2), f(2)=5, bx-1 (x>2)
print("Q6", sp.solve(sp.Eq(2+a,5),a), sp.solve(sp.Eq(2*b-1,5),b), "csak ágak: a =", sp.solve(sp.Eq(2+a,2*b-1),a))
# Q7 (x-1)/(x^2-4x+3)
print("Q7", sp.factor(x**2-4*x+3), sp.solve(x**2-4*x+3), L((x-1)/(x**2-4*x+3),1), L((x-1)/(x**2-4*x+3),3,'+'))
print("== 3.6")
f = x**3-2*x-5
print("Q1", [f.subs(x,v) for v in range(0,5)])
g = x**2-3
for m in [1.5,1.75]: print("Q3 f(%s)=%s" % (m, g.subs(x,m)))
print("Q3 gyök", math.sqrt(3))
# Q4 [0;2], h=0,01
n = next(n for n in range(1,50) if 2/2**n < 0.01); print("Q4 lépés", n, 2**7, 2**8, 2**9, "log2(200)=", math.log2(200))
# Q5 x^2 a [-1;3]
print("Q5", (x**2).subs(x,-1), (x**2).subs(x,3))
# Q6 sqrt(x+1) a [0;8]
print("Q6", math.sqrt(1), math.sqrt(9))
# Q7 x^2-4x a [0;5]
h = x**2-4*x
print("Q7", sp.expand((x-2)**2-4), h.subs(x,0), h.subs(x,2), h.subs(x,5))
print("== 3.7")
V = lambda T: 1000 + 0.0075*(T-4)**2
print("V(20)", V(20), "V(0)", V(0), "ugrás", 1091-V(0))
r = 4+math.sqrt(256+0.1/0.0075); l = 4+math.sqrt(256-0.1/0.0075)
print("Q1 jobb", r, r-20, "bal", l, 20-l, "13,33:", 0.1/0.0075, "delta4:", math.sqrt(0.1/0.0075))
print("Q3 eps=0,03 a 4-ben:", math.sqrt(0.03/0.0075), 0.03/0.0075)
def F(p):
    q = 1+p/100; return 370000*(q**3-1)/(q**3*(q-1)) - 1000000
for p in [1,9,5,7,6,5.5,5.25,5.375]: print("F(%s)=%.0f" % (p, F(p)))
lo, hi = 1, 9
for _ in range(60):
    m=(lo+hi)/2
    if F(m) > 0: lo = m
    else: hi = m
print("Q4 p =", lo, "11%:", 3*370000/1e6-1, "11/3:", 11/3)
# 10% kamatnál a részlet (2.7): 
q=1.1; print("10% részlet:", 1e6*q**3*(q-1)/(q**3-1))
P = lambda t: 400*math.ceil(t)
print("Q6", P(0.3), P(2), P(2+1e-9), P(3+1e-9), P(2-1e-9))
m = sp.symbols('m')
print("Q7", sp.simplify((x*m*x)/(x**2+m**2*x**2)).subs(m,2), sp.Rational(2,5))
print("== final")
print("F1", [round(math.sin(math.pi/v),12) for v in [1,0.1,0.01,0.001]], [math.sin(math.pi*(4*n+1)/2) for n in range(1,4)])
print("F2 4x-3 a 1-ben: |4x-4|<0,02 -> delta", 0.02/4, "eps*4", 0.02*4, "eps/2", 0.02/2)
print("F3 floor", math.floor(2-1e-9)+math.floor(2+1e-9))
e4 = (x**2-4)/(x**2-3*x+2)
print("F4", sp.factor(x**2-4), sp.factor(x**2-3*x+2), sp.cancel(e4), L(e4,2), L(e4,sp.oo), L(e4,1,'+'), L(e4,1,'-'), "konstans:", sp.Rational(-4,2))
e5 = (2*x**4-x)/(3*x**3+1)
print("F5", L(e5,-sp.oo), L(e5,sp.oo))
e6 = (x**2+3*x+1)/(x+1)
print("F6", sp.div(x**2+3*x+1, x+1), sp.limit(e6-(x+2),x,sp.oo))
e8 = 3*x/sp.sqrt(x**2+4)
print("F8", L(e8,-sp.oo), L(e8,sp.oo))
e9 = ((x+3)/(x+1))**(2*x)
print("F9", L(e9,sp.oo), sp.exp(4).evalf(), "kitevő-arány nélkül e^2 =", sp.exp(2).evalf(), "e^6=", sp.exp(6).evalf())
print("F10", L(sp.sin(5*x)/x,0), L(sp.sin(x)/x,sp.oo), L((sp.exp(2*x)-1)/x,0), L(sp.log(1+x)/x,0), L((3**x-1)/x,0), math.log(3))
print("F11", L(sp.sin(x)/sp.Abs(x),0,'-'), L(sp.sin(x)/sp.Abs(x),0,'+'))
print("F12", sp.solve(sp.Eq(L(sp.sin(k*x)/(2*x),0), 3), k), L(sp.sin(6*x)/(2*x),0))
n = next(n for n in range(1,50) if 2/2**n < 0.001); print("F13 [1;3] h=0,001:", n, 2**10, 2**11, 2**12, 2/0.001)
print("F14 cos(0)-0 =", math.cos(0), "cos(pi/2)-pi/2 =", math.cos(math.pi/2)-math.pi/2)
# szöveg-ellenőrzések
print("== szöveg")
print("x=2cosx:", sp.nsolve(x-2*sp.cos(x),1), [round(v-2*math.cos(v),4) for v in [1,1.5,1.25,2]])
print("e^x=3x:", sp.nsolve(sp.exp(x)-3*x,0.6), math.e-3)
print("x^3+x-1:", sp.nsolve(x**3+x-1,0.7), " x^5-3x+1:", sp.nsolve(x**5-3*x+1,0.3), 0.5**5-1.5+1)
print("x^3-x-1:", sp.nsolve(x**3-x-1,1.3), [round(v**3-v-1,4) for v in [1.5,1.25,1.375,1.3125]])
print("cos x = x:", sp.nsolve(sp.cos(x)-x,0.7), (math.pi/2)/0.001)
print("V(20.5)-V(20):", V(20.5)-V(20), "V(10)", V(10), math.sqrt(36+0.1/0.0075)-6, 6-math.sqrt(36-0.1/0.0075))
print("sqrt2 felezés:", [m*m-2 for m in [1.5,1.25,1.375,1.4375]])
print("x^3-3x+1:", [v**3-3*v+1 for v in [-2,-1,0,1,2]])
print("== pótlás")
print("3.5 Q6 a=1,b=2:", 2+1, 2*2-1)
print("3.7 Q3 0,0075 nélkül:", math.sqrt(0.03))
print("3.6 Q3 f(1), f(2):", 1-3, 4-3)
print("final F4 lyuk értéke:", (2+2)/(2-1), "számláló az 1-ben:", 1+2)
print("final F12 2k=3 ->", 3/2)
print("final F14: 20 °C-on 0,41 4 °C-on is jó? V(4.41)-V(4) =", V(4.41)-V(4))
