# Ellenőrzés: an3-31 … an3-34 kvízek (q1.js) számai + a 3.1–3.4 szöveg néhány száma
from math import *
from fractions import Fraction as F
def near(f, a, h=1e-6): return f(a-h), f(a+h)
def big(f, X=1e7): return f(X), f(-X)
ok = lambda c, m: print(("OK  " if c else "HIBA"), m)

print("--- 3.1")
f = lambda x: (x*x-16)/(x-4); l, r = near(f, 4); ok(abs(l-8)<1e-4 and abs(r-8)<1e-4, f"(x^2-16)/(x-4)->8: {l},{r}")
f = lambda x: (x*x+2*x)/(x+2); l, r = near(f, -2); ok(abs(l+2)<1e-4 and abs(r+2)<1e-4, f"(x^2+2x)/(x+2)-> -2: {l},{r}")
f = lambda x: (x**3-1)/(x-1); ok(abs(f(1+1e-6)-3)<1e-4, "(x^3-1)/(x-1)->3")
ok(abs(sin(radians(0.001))/0.001 - pi/180) < 1e-9, f"DEG: sin(0,001°)/0,001 = {sin(radians(0.001))/0.001:.5f} = pi/180={pi/180:.5f}")
ok(abs(sin(0.001)/0.001-1)<1e-6, "RAD: sin(0,001)/0,001 ~ 1")
for x in [0.1, 0.01, -0.01, -0.1]: print("  (2^x-1)/x", x, round((2**x-1)/x, 4))
print("  ln2 =", round(log(2), 4), " (e^x-1)/x(0,01) =", round((exp(0.01)-1)/0.01, 4))
for n in range(1, 5):
    ok(abs(sin(pi/(1/n)))<1e-9 and abs(sin(pi/(2/(4*n+1)))-1)<1e-9, f"sin(pi/x): x=1/{n}->0, x=2/{4*n+1}->1")
for x in [2/3, 2/5, 2/7]: print("  sin(pi/x)", round(x,4), round(sin(pi/x), 6))
for x in [0.1, 0.01, -0.01]: print("  (sqrt(x+9)-3)/x", x, round((sqrt(x+9)-3)/x, 5))
print("  sin x/x:", [round(sin(x)/x, 5) for x in [1, .5, .1, .01]])
print("  sin0,2/0,2 =", round(sin(.2)/.2, 5), " 1-0,04/6 =", round(1-.04/6, 5))
print("  (1-cos x)/x^2:", round((1-cos(.1))/.01, 5), round((1-cos(.01))/1e-4, 6))
print("  g(x)=x^2 (x!=1), g(1)=7: lim =", round((1+1e-7)**2, 5))

print("--- 3.2")
# ugrás: x^2 (x<2), x+3 (x>=2)
ok(abs((2-1e-9)**2-4)<1e-6 and abs((2+1e-9)+3-5)<1e-6, "bal 4, jobb 5")
# c-paraméter: cx+1 (x<1), x^2+4 (x>1): c+1 = 5
for c in [4, 5, 3, 6]: print("  c =", c, " bal:", c*1+1, " jobb:", 1+4, " egyenlő:", c+1 == 5)
# floor a -1-ben
ok(floor(-1-1e-9) == -2 and floor(-1+1e-9) == -1, "floor: bal -2, jobb -1 a -1-ben")
# cos(pi/x)
for n in range(1, 5):
    ok(abs(cos(pi*2*n)-1)<1e-9 and abs(cos(pi*(2*n+1))+1)<1e-9 and abs(cos(pi*4*n)-1)<1e-9,
       f"cos(pi/x): x=1/{2*n}->1, x=1/{2*n+1}->-1, x=1/{4*n}->1")
# eps-delta lineáris: |4x-3-1| = 4|x-1| < 0,2 -> delta 0,05
eps = 0.2; ok(abs(eps/4-0.05)<1e-12, f"delta = eps/4 = {eps/4}; rossz: 4eps={4*eps}, eps={eps}, eps/2={eps/2}")
x = 1+0.06; print("  x=1,06 (delta=0,1-ből):", round(abs(4*x-4), 3), "> 0,2")
# x^2 a 2-ben, eps=0,5
r = sqrt(4.5)-2; l = 2-sqrt(3.5)
print(f"  x^2 a 2-ben, eps=0,5: jobb {r:.4f}, bal {l:.4f}, legnagyobb jó delta {min(r,l):.4f}, eps/4={0.5/4}")
ok(abs((2+0.125)**2-4) > 0.5, f"delta=0,125 nem jó: (2,125)^2-4 = {(2.125)**2-4:.4f} > 0,5")
ok(abs((2+0.1292)**2-4) > 0.5, f"delta=0,1292 nem jó: (2,1292)^2-4 = {(2.1292)**2-4:.4f}")
ok(abs((2+0.1213)**2-4) < 0.5, f"delta=0,1213 jó: (2,1213)^2-4 = {(2.1213)**2-4:.4f}")
# szöveg: x^2 a 3-ban
print(f"  szöveg: 0,1/7={0.1/7:.4f}, sqrt(9,1)-3={sqrt(9.1)-3:.4f}, 3-sqrt(8,9)={3-sqrt(8.9):.4f}")
print(f"  szöveg gyak.: sqrt(0,79)={sqrt(.79):.4f}, 1-sqrt(.79)={1-sqrt(.79):.4f}")
print("  szöveg: 0,1/3 =", round(0.1/3, 4), "; (3+1/n)^2:", [round((3+1/n)**2, 2) for n in (1,2,3,10)], "; (3-1/n)^2:", [round((3-1/n)**2, 2) for n in (1,2,3,10)])

print("--- 3.3")
f = lambda x: 2*x/(x-1); print("  2x/(x-1): 1-:", f(1-1e-7), " 1+:", f(1+1e-7))
f = lambda x: (x*x-4)/(x*x-3*x+2); g = lambda x: (x+2)/(x-1)
print("  (x^2-4)/(x^2-3x+2) a 2-ben:", near(f, 2), " 1-ben:", f(1-1e-7), f(1+1e-7))
ok(all(abs(f(x)-g(x))<1e-9 for x in [-3, 0, .5, 3, 7]), "egyszerűsített alak (x+2)/(x-1)")
f = lambda x: (6*x**3+x)/(2*x*x-1); print("  (6x^3+x)/(2x^2-1): -inf:", f(-1e6), "+inf:", f(1e6))
f = lambda x: (4*x*x-3*x+7)/(2*x*x+5); print("  (4x^2-3x+7)/(2x^2+5):", big(f), " konst. arány", 7/5)
f = lambda x: (x*x+3*x+1)/(x+1)
for m, b in [(1, 2), (1, 3), (1, 0), (1, 4)]: print(f"  ferde y={m}x+{b}: f-(mx+b) a 1e6-ban:", round(f(1e6)-(m*1e6+b), 6))
ok(all(abs((x+1)*(x+2)-1 - (x*x+3*x+1))<1e-9 for x in [0, 1, 2.5, -3]), "x^2+3x+1 = (x+1)(x+2) - 1")
f = lambda x: (x*x-3*x+2)/(x*x-1)
print("  (x^2-3x+2)/(x^2-1): 1-ben", near(f, 1), " -1-:", f(-1-1e-7), " -1+:", f(-1+1e-7), " inf:", big(f))
f = lambda x: (x*x+x)/x; print("  (x^2+x)/x a 0-ban:", near(f, 0))
print("  2+sin x/x: metszés x = k*pi, pl.", 2+sin(1000*pi)/(1000*pi))
print("  szöveg (2x+1)/(x-3):", [round((2*x+1)/(x-3), 4) for x in (10, 100, 1000, -1000)])
f = lambda x: (2*x*x-1)/(x*x-4); print("  szöveg (2x^2-1)/(x^2-4): -2-:", f(-2-1e-7), " -2+:", f(-2+1e-7), " 2-:", f(2-1e-7), " 2+:", f(2+1e-7))
print("  szöveg x^2+x+1=(x-1)(x+2)+3:", all((x-1)*(x+2)+3 == x*x+x+1 for x in range(-5, 6)))
f = lambda x: (x*x-3*x+2)/(x*x-1); print("  -1-ben a számláló:", 1+3+2)

print("--- 3.4")
f = lambda x: (x*x-x-6)/(x*x-9); print("  (x^2-x-6)/(x^2-9) a 3-ban:", near(f, 3), " 5/6 =", 5/6, " konst. arány 6/9 =", 6/9)
f = lambda x: (sqrt(x+4)-2)/x; print("  (sqrt(x+4)-2)/x:", near(f, 0))
f = lambda x: sqrt(x*x+6*x)-x; print("  sqrt(x^2+6x)-x:", f(1e8), f(1e4))
f = lambda x: x/sqrt(x*x+4); print("  x/sqrt(x^2+4): -inf", f(-1e8), " +inf", f(1e8))
f = lambda x: sin(4*x)/(2*x); print("  sin4x/(2x):", near(f, 0, 1e-5))
f = lambda x: (1+3/x)**(2*x); print("  (1+3/x)^(2x):", f(1e7), " e^6 =", exp(6), " e^3 =", exp(3), " e^1,5 =", exp(1.5))
f = lambda x: (3**x-1)/x; print("  (3^x-1)/x:", near(f, 0, 1e-7), " ln3 =", log(3))
# match
print("  match: (x^2-4)/(x-2)->", ((2+1e-7)**2-4)/1e-7, "; (sqrt(x+1)-1)/x ->", (sqrt(1+1e-7)-1)/1e-7,
      "; x^2 cos(1/x) ->", (1e-4)**2*cos(1e4), "; sin5x/x ->", sin(5e-6)/1e-6, "; (1+2/x)^x ->", (1+2/1e7)**1e7, exp(2))
# szöveg
print("  szöveg: PT2", ((2+1e-7)**2-5*(2+1e-7)+6)/((2+1e-7)**3-2*(2+1e-7)**2-(2+1e-7)+2), "; MAT1 55/b", ((2+1e-7)**2-6*(2+1e-7)+8)/((2+1e-7)**2+3*(2+1e-7)-10), -2/7)
print("  szöveg: e^2", round(exp(2), 3), " e^-2", round(exp(-2), 4), " e^1,5", round(exp(1.5), 3), " e^-1", round(exp(-1), 4), " e^-10/3", round(exp(-10/3), 4))
x = 1e7; print("  szöveg: ((3x+1)/(3x+3))^(5x+3) =", ((3*x+1)/(3*x+3))**(5*x+3))
print("  szöveg: x^3-3x+2 = (x-1)^2(x+2):", all(x**3-3*x+2 == (x-1)**2*(x+2) for x in range(-5, 6)))
x = -1e6; print("  szöveg 57/c:", (16*x**8+2*x)**0.25/(3*x*x-2))
print("  szöveg: x/sqrt(x^2+1) -inf:", -1e8/sqrt(1e16+1))

print("--- magyarázatok számai")
print("  sin(0,001)/0,001 =", f"{sin(0.001)/0.001:.8f}", " sin(0,001°) =", f"{sin(radians(0.001)):.8f}")
print("  g(0,99), g(1,01) =", round(.99**2, 4), round(1.01**2, 4))
print("  e^6 =", round(exp(6), 1), " ln3 =", round(log(3), 4), " e^2 =", round(exp(2), 3))
print("  floor(-1,01), floor(-0,99) =", floor(-1.01), floor(-0.99))
print("  sqrt(3,5), sqrt(4,5) =", round(sqrt(3.5), 4), round(sqrt(4.5), 4))
print("  (x^2+3x+1)/(x+1) - (x+3) a 1e6-ban:", round((1e12+3e6+1)/(1e6+1) - (1e6+3), 4))
print("  f(0) = 7/5 =", (7)/5, "; (x+2)/(x-1) az 1-ben számláló:", 3, "; lyuk 2-ben:", (2+2)/(2-1))
