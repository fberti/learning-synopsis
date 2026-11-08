# Analízis 4 – q2.js (an4-45 … an4-48, an4-final): a kvízek számainak ellenőrzése
import sympy as sp
from math import log, sqrt, exp, pi, e
x, y, t, q, p = sp.symbols('x y t q p', real=True)
D = sp.diff
def chk(name, val, *wrong):
    print(f"{name}: helyes = {val}; rossz = {wrong}")
    assert all(abs(float(w) - float(val)) > 1e-9 for w in wrong), name
    assert len(set(round(float(w), 6) for w in wrong)) == len(wrong), name + " (azonos rossz válaszok)"

print("=== an4-45")
print(sp.simplify(D(sp.cos(x)**3, x) - (-3*sp.cos(x)**2*sp.sin(x))) == 0)
chk("ln(x^2+1)' az 1-ben", D(sp.log(x**2+1), x).subs(x, 1), 0.5, 2, log(2))
chk("((x^2+1)^3)' az 1-ben", D((x**2+1)**3, x).subs(x, 1), 12, 6, 8)   # 12: belső elmarad, 6: (x^6+1)', 8: f(1)
print("ln(x^2 e^x)' =", sp.simplify(D(sp.log(x**2*sp.exp(x)), x)))
xx = x**x
chk("(x^x)' a 2-ben", D(xx, x).subs(x, 2).evalf(), 4, 4*log(2), 4*log(2)+1)
print("  értékek:", float(D(xx, x).subs(x, 2)), 4*log(2), 4*log(2)+1)
# x^2 + y^3 = 9 az (1;2)-ben
yp = sp.solve(D(x**2 + sp.Function('Y')(x)**3, x), D(sp.Function('Y')(x), x))[0]
v = yp.subs(sp.Function('Y')(x), 2).subs(x, 1)
chk("x^2+y^3=9, (1;2)", v, sp.Rational(1, 6), -6, -sp.Rational(1, 2))
print("  pont rajta:", 1 + 8 == 9, " explicit:", D((9 - x**2)**sp.Rational(1, 3), x).subs(x, 1))
print("ln(x/(x+1))' =", sp.simplify(D(sp.log(x/(x+1)), x) - (1/x - 1/(x+1))) == 0)

print("=== an4-46")
f = x**4 - 2*x**3
chk("f''(2)", D(f, x, 2).subs(x, 2), D(f, x).subs(x, 2)**2, D(f, x).subs(x, 2), f.subs(x, 2))
s = 30*t - 3*t**2
print("v =", D(s, t), " a =", D(s, t, 2), " megáll:", sp.solve(D(s, t), t), " s(5) =", s.subs(t, 5), " s=0:", sp.solve(s, t))
print("cos^(2027): 2027 mod 4 =", 2027 % 4, D(sp.cos(x), x, 3))
chk("(e^3x)^(4) együttható", 81, 12, 64, 3)
print("(1/x)^(4) =", D(1/x, x, 4))
s2 = t**3 - 3*t**2
print("v(1,5) =", D(s2, t).subs(t, 1.5), " a(1,5) =", D(s2, t, 2).subs(t, 1.5))
print("3. deriváltak:", [D(g, x, 3) for g in (x**3, sp.exp(2*x), sp.sin(x), sp.log(x), x**2)])
print("(x^3)'' =", D(x**3, x, 2), " ((x^3)')^2 =", D(x**3, x)**2)

print("=== an4-47")
chk("sqrt(16,4)", 4 + 0.4/8, 4.1, 4.4, 4.2); print("  pontos:", sqrt(16.4))
chk("e^-0,05", 0.95, 1.05, 0.05, -0.05); print("  pontos:", exp(-0.05))
chk("dy: x^2, x=5, dx=0,2", 2*5*0.2, 5.2**2 - 25, 0.2**2, 10); print("  Δy:", 5.2**2 - 25)
print("kocka 2% → 3*2 =", 6, "%; köbre: (1,02^3-1) =", 1.02**3 - 1)
chk("kör r=4, dr=0,1: dA", 2*pi*4*0.1, pi*4*0.1, pi*0.01, 0.8); print("  pontos ΔA:", pi*(4.1**2 - 16))
Vp = 0.015*(14 - 4)
chk("víz 14 °C ΔT", 0.1/Vp, 1.5, 0.15, 0.015)
V = lambda T: 1000 + 0.0075*(T - 4)**2
print("  V'(14) =", Vp, " pontos ΔT:", sqrt((V(14) + 0.1 - 1000)/0.0075) + 4 - 14)

print("=== an4-48")
C = 100 + 4*q + sp.Rational(2, 100)*q**2
chk("C'(50)", D(C, q).subs(q, 50), C.subs(q, 50)/50, C.subs(q, 51) - C.subs(q, 50), C.subs(q, 50))
print("  C(50) =", C.subs(q, 50), " C(51)-C(50) =", float(C.subs(q, 51) - C.subs(q, 50)))
R = 16*q - sp.Rational(1, 100)*q**2
qs = sp.solve(D(R, q) - D(C, q), q)[0]
chk("R'=C'", qs, sp.solve(D(R, q), q)[0], sp.solve(16 - sp.Rational(1, 100)*q - D(C, q), q)[0],
    sp.solve(D(R, q) - (4 + sp.Rational(2, 100)*q), q)[0])
print("  profit q=200:", (R - C).subs(q, 200), " R'(200) =", D(R, q).subs(q, 200), " C'(200) =", D(C, q).subs(q, 200))
chk("B'(0), B=2000*1,1^t", 2000*log(1.1), 200, 0, 2200)
chk("relatív ütem", log(1.1), 0.1, 1.1, log(1.1)/100)
E = lambda pp: pp*(-3)/(120 - 3*pp)
chk("rugalmasság p=10", E(10), -3, -3/90, -30)
print("  q(10) =", 120 - 30)
chk("kő 80 m", 10*4, 20, 10, 144); print("  t =", sqrt(80/5), " km/h:", 40*3.6)

print("=== an4-final")
S = 5*t**2
chk("átlag [3;5]", (S.subs(t, 5) - S.subs(t, 3))/2, 80, -40, 30)
g = x**2 + 3*x
print("diffq:", sp.simplify((g.subs(x, 1 + y) - g.subs(x, 1))/y), " → ", D(g, x).subs(x, 1))
chk("x^2+3x a 1-ben", 5, 4, 2, 3)
hp = sp.symbols('h', positive=True)
print("darabos: bal", sp.limit(((1 + hp*-1)**2 - 1)/(-hp), hp, 0), " jobb", sp.limit((2*(1 + hp) - 1 - 1)/hp, hp, 0), " folytonos:", 2*1 - 1 == 1)
print("x^3 érintő a 2-ben: y =", sp.expand(8 + 12*(x - 2)), "rosszak:", sp.expand(12*(x - 2)), sp.expand(12*x + 8), sp.expand(8 - 12*(x - 2)))
chk("(3^x)' a 2-ben", 9*log(3), 6, 9, 9/log(3)); print("  ", 9*log(3), 9/log(3))
hq = D(x**2/(x + 1), x).subs(x, 1)
chk("(x^2/(x+1))' az 1-ben", hq, -sp.Rational(3, 4), sp.Rational(3, 2), 2)
fi = x**3 + x
print("f(1) =", fi.subs(x, 1), " f'(1) =", D(fi, x).subs(x, 1), " f'(2) =", D(fi, x).subs(x, 2))
chk("(f^-1)'(2)", sp.Rational(1, 4), sp.Rational(1, 13), 4, 13)
print("(sin^2 3x)' =", sp.simplify(D(sp.sin(3*x)**2, x) - 6*sp.sin(3*x)*sp.cos(3*x)) == 0, " sin(9x^2)' =", D(sp.sin(9*x**2), x))
xl = x**sp.log(x)
chk("(x^ln x)' az e-ben", sp.simplify(D(xl, x).subs(x, sp.E)), 1, e, 2/e)
yy = 2/sp.sqrt(x)
chk("x y^2 = 4, (1;2)", D(yy, x).subs(x, 1), 0, -2, -4); print("  pont:", 1*4 == 4)
fe = x*sp.exp(2*x)
chk("(x e^2x)'' a 0-ban", D(fe, x, 2).subs(x, 0), D(fe, x).subs(x, 0)**2, 0, 3); print("  f'' =", sp.factor(D(fe, x, 2)))
print("kocka a=10, da=0,1: dV =", 3*100*0.1, " rel:", 3*0.1/10, " pontos ΔV:", 10.1**3 - 1000)
C0 = 200 + 5*q + sp.Rational(1, 100)*q**2
print("C'(200) =", D(C0, q).subs(q, 200), " átlag:", C0.subs(q, 200)/200, " C(200) =", C0.subs(q, 200),
      " átlag 201-nél:", float(C0.subs(q, 201)/201))
print("OK")
