# an4 q1.js (an4-41 … an4-44) – számellenőrzés: python3 -I qan41_check.py
from math import sin, cos, exp, log, sqrt, pi, e
from fractions import Fraction as F

ok = bad = 0
def chk(name, got, want, tol=1e-6):
    global ok, bad
    if abs(got - want) <= tol: ok += 1
    else: bad += 1; print("HIBA", name, got, want)

def d(f, x, h=1e-6): return (f(x + h) - f(x - h)) / (2 * h)
def dl(f, x, h=1e-7): return (f(x) - f(x - h)) / h   # bal oldali
def dr(f, x, h=1e-7): return (f(x + h) - f(x)) / h   # jobb oldali

s = lambda t: 5 * t * t
# ---------------- 4.1
# Q1: kő [1; 3]
chk("41-1 átlag", (s(3) - s(1)) / 2, 20)
chk("41-1 Δs", s(3) - s(1), 40); chk("41-1 v(3)", d(s, 3), 30, 1e-4); chk("41-1 s(3)/2", s(3) / 2, 22.5)
# Q2: tartály 900 -> 300 l, 10 perc
chk("41-2", (300 - 900) / 10, -60); chk("41-2 Δ", 300 - 900, -600); chk("41-2 900/10", 900 / 10, 90)
# Q3: x^2 szelő 2 és 5 között
f = lambda x: x * x
chk("41-3", (f(5) - f(2)) / 3, 7); chk("41-3 Δy", f(5) - f(2), 21); chk("41-3 f'(5)", d(f, 5), 10, 1e-4)
# Q4: x^2 a [-3; 1]-en
chk("41-4", (f(1) - f(-3)) / (1 - (-3)), -2); chk("41-4 fordított", (f(1) - f(-3)) / (-3 - 1), 2)
chk("41-4 nevező 1-3", (f(1) - f(-3)) / (1 - 3), 4)
chk("41-4 Δf", f(1) - f(-3), -8)
# Q5: x^2 a 4-ben
for h in (1e-1, 1e-3):
    chk("41-5 dq=8+h", (f(4 + h) - 16) / h, 8 + h, 1e-9)
chk("41-5 h=0,001", (f(4.001) - 16) / 0.001, 8.001, 1e-9)
chk("41-5 rossz (a+h)^2=a^2+h^2 -> h", ((16 + 0.001**2) - 16) / 0.001, 0.001, 1e-9)
# Q8 párosítás
chk("41-8 [0;2]", (s(2) - s(0)) / 2, 10); chk("41-8 [1;2]", s(2) - s(1), 15)
chk("41-8 v(2)", d(s, 2), 20, 1e-4); chk("41-8 s(2)", s(2), 20); chk("41-8 v(3)", d(s, 3), 30, 1e-4)

# ---------------- 4.2
g = lambda x: x * x + x
for h in (1e-2, 1e-4): chk("42-1 dq", (g(2 + h) - g(2)) / h, 5 + h, 1e-9)
chk("42-1 f(2)", g(2), 6)
chk("42-1 rossz a^2+h^2", ((4 + 0.01**2) + (2 + 0.01) - 6) / 0.01, 1 + 0.01, 1e-9)
# Q2 x^2 érintője a 2-ben: y = 4x - 4
T = lambda x: f(2) + d(f, 2) * (x - 2)
chk("42-2 T(0)", T(0), -4, 1e-4); chk("42-2 T(1)", T(1), 0, 1e-4)
# rossz: 4(x-2) = 4x-8 ; 4 + 4x ; 4 - 4(x-2) = -4x+12
chk("42-2 előjel", 4 - 4 * (0 - 2), 12)
# Q3 x^2 - 6x
k = lambda x: x * x - 6 * x
chk("42-3 f'(3)", d(k, 3), 0, 1e-6); chk("42-3 f(3)", k(3), -9); chk("42-3 f(-3)", k(-3), 27); chk("42-3 f(6)", k(6), 0)
# Q4 |x-3|
a = lambda x: abs(x - 3)
chk("42-4 bal", dl(a, 3), -1, 1e-6); chk("42-4 jobb", dr(a, 3), 1, 1e-6)
# Q5 x^2 (x<=1), 3x-2 (x>1)
p = lambda x: x * x if x <= 1 else 3 * x - 2
chk("42-5 folyt", 3 * 1 - 2, p(1)); chk("42-5 bal", dl(p, 1), 2, 1e-5); chk("42-5 jobb", dr(p, 1), 3, 1e-5)
chk("42-5 átlag", (2 + 3) / 2, 2.5)
# Q6 x^2 (x<=1), 2x+3 (x>1)
q = lambda x: x * x if x <= 1 else 2 * x + 3
chk("42-6 ugrás", 2 * 1 + 3, 5); chk("42-6 f(1)", q(1), 1)
print("42-6 jobb oldali dq h=1e-3:", (q(1.001) - q(1)) / 0.001, "(→ +∞)")
# Q8 párosítás
chk("42-8 x|x|", dr(lambda x: x * abs(x), 0), 0, 1e-6); chk("42-8 x|x| bal", dl(lambda x: x * abs(x), 0), 0, 1e-6)
chk("42-8 x^2+3x", d(lambda x: x * x + 3 * x, 0), 3, 1e-6)
cb = lambda x: x ** (1 / 3) if x >= 0 else -((-x) ** (1 / 3))
print("42-8 köbgyök dq h=1e-6:", cb(1e-6) / 1e-6, cb(-1e-6) / -1e-6, "(→ +∞)")

# ---------------- 4.3
x0 = 1.7
chk("43-1 (x^-4)'", d(lambda x: x ** -4, x0), -4 / x0 ** 5, 1e-6)
chk("43-2 (√x)'(4)", d(sqrt, 4), 0.25, 1e-8)
chk("43-2 rossz ½·x^½", 0.5 * sqrt(4), 1); chk("43-2 rossz 1/(2x)", 1 / (2 * 4), 0.125); chk("43-2 2√x", 2 * sqrt(4), 4)
chk("43-3 (cos)'(π/6)", d(cos, pi / 6), -0.5, 1e-8)
chk("43-3 cos π/6", cos(pi / 6), sqrt(3) / 2, 1e-12)
chk("43-4 (3^x)'(2)", d(lambda x: 3 ** x, 2), 9 * log(3), 1e-6)
print("43-4 9 ln 3 =", round(9 * log(3), 3), " ln 3 =", round(log(3), 3), " x·3^(x-1) =", 2 * 3 ** 1)
chk("43-5 (log10)'", d(lambda x: log(x, 10), x0), 1 / (x0 * log(10)), 1e-6)
# Q6 e^x érintője az 1-ben: y = e x
Te = lambda x: e + d(exp, 1) * (x - 1)
chk("43-6 T(0)", Te(0), 0, 1e-6); chk("43-6 T(2)", Te(2), 2 * e, 1e-6)
# rossz: e(x-1) ; 1-es meredekség: e + (x-1) = x + e - 1 ; előjel: e + e(x+1) = ex + 2e
# Q7 párosítás (log_5 x)'
chk("43-7 (log5)'", d(lambda x: log(x, 5), x0), 1 / (x0 * log(5)), 1e-6)
chk("43-7 (5^x)'", d(lambda x: 5 ** x, x0), 5 ** x0 * log(5), 1e-5)
# Q8 multi: fok
deg = lambda x: sin(x * pi / 180)
chk("43-8 fok", d(deg, 30), pi / 180 * cos(pi / 6), 1e-8)

# ---------------- 4.4
x0 = 0.8
chk("44-1 (x^2 e^x)'", d(lambda x: x * x * exp(x), x0), (x0 * x0 + 2 * x0) * exp(x0), 1e-6)
chk("44-2 (x/(x+2))'", d(lambda x: x / (x + 2), x0), 2 / (x0 + 2) ** 2, 1e-8)
chk("44-3 ((x^2+1)^3)'(1)", d(lambda x: (x * x + 1) ** 3, 1), 24, 1e-5)
print("44-3 rossz: belső nélkül", 3 * (1 + 1) ** 2, " külső nem a belső helyen", 3 * 1 ** 2 * 2, " f(1)", (1 + 1) ** 3)
chk("44-4 (sin^2)'", d(lambda x: sin(x) ** 2, x0), 2 * sin(x0) * cos(x0), 1e-8)
chk("44-5 (ln(x^2+3))'(1)", d(lambda x: log(x * x + 3), 1), 0.5, 1e-8)
print("44-5 rossz: belső nélkül", 1 / 4, " 1/x·2x", 2, " ln 4", round(log(4), 3))
ff = lambda x: x ** 3 + 2 * x
chk("44-6 f(1)", ff(1), 3); chk("44-6 f'(1)", d(ff, 1), 5, 1e-6); chk("44-6 f'(3)", d(ff, 3), 29, 1e-5)
# inverz numerikusan: (f^-1)'(3)
def inv(y, lo=-10, hi=10):
    for _ in range(200):
        m = (lo + hi) / 2
        if ff(m) < y: lo = m
        else: hi = m
    return (lo + hi) / 2
chk("44-6 (f^-1)'(3)", d(inv, 3, 1e-5), 0.2, 1e-6)
x0 = 0.6
chk("44-8 tg", d(lambda x: sin(x) / cos(x), x0), 1 / cos(x0) ** 2, 1e-7)
chk("44-8 arctg", d(lambda x: __import__('math').atan(x), x0), 1 / (1 + x0 * x0), 1e-8)
chk("44-8 (5x-2)^4", d(lambda x: (5 * x - 2) ** 4, x0), 20 * (5 * x0 - 2) ** 3, 1e-5)
chk("44-8 ctg", d(lambda x: cos(x) / sin(x), x0), -1 / sin(x0) ** 2, 1e-6)

print(ok, "rendben,", bad, "hiba")
