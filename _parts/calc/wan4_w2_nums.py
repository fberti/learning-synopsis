# Az an4 w2.js widgetjeinek „elvárt számai” – uv run --with sympy python -I wan4_w2_nums.py
import math
import sympy as sp
x, t, u = sp.symbols("x t u")
ok = True
def chk(name, got, exp, tol=1e-9):
    global ok
    g = float(got); good = abs(g - exp) <= tol * max(1, abs(exp))
    ok &= good
    print(f"{'OK ' if good else 'HIBA'} {name}: {g:.6f} (várt {exp})")

print("--- derivative-sketcher: f = x^3 - 3x")
d = sp.diff(x**3 - 3*x, x)
for a, e in ((0, -3), (1, 0), (-1, 0), (2, 9), (1.6, 4.68)):
    chk(f"f'({a})", d.subs(x, a), e)
# pontszám konstans 0 rajznál (200 rekesz, középpontok), alsó tartomány: [lo − 15%, hi + 15%]
N = 200; a, b = -2.5, 2.5
xs = [a + (i + .5) * (b - a) / N for i in range(N)]
dv = [3*q*q - 3 for q in xs]
fine = [3*(a + (b-a)*k/400)**2 - 3 for k in range(401)]
lo, hi = min(fine), max(fine); sp_ = hi - lo; span = (hi + .15*sp_) - (lo - .15*sp_)
mean = sum(abs(v) for v in dv) / N
print(f"    konstans 0 rajz: átlag eltérés {mean:.4f}, span {span:.4f}, pont {round(100*max(0, 1-4*mean/span))} (böngésző: 20)")
chk("span", span, 24.375)

print("--- chain-rule-gears")
cases = [(3*x, 2*u, -2.37, 6), (x**2, sp.sin(u), 1, None), (2*x + 1, u**3, 0, 6), (x**2 + 9, sp.sqrt(u), 4, 0.8)]
for g, f, x0, exp in cases:
    u0 = g.subs(x, x0); gp = sp.diff(g, x).subs(x, x0); fp = sp.diff(f, u).subs(u, u0)
    comp = sp.diff(f.subs(u, g), x).subs(x, x0)
    print(f"    g={g}, f={f}, x={x0}: u={float(u0):.4f}, y={float(f.subs(u, u0)):.4f}, g'={float(gp):.4f}, f'(u)={float(fp):.4f}, szorzat={float(gp*fp):.4f}")
    chk("  szorzat = kompozíció deriváltja", gp * fp, float(comp))
    if exp is not None: chk("  dy/dx", comp, exp)
chk("(2) f'(u) = cos 1", sp.cos(1), 0.5403023058681398)
chk("(2) szorzat", 2*sp.cos(1), 1.0806046117362795)

print("--- derivative-machine")
E = {
 "cos(x^3) - 2": (sp.cos(x**3) - 2, -3*sp.sin(x**3)*x**2),
 "sin(x)^3 + x - 1": (sp.sin(x)**3 + x - 1, 3*sp.sin(x)**2*sp.cos(x) + 1),
 "e^(x sin x)": (sp.exp(x*sp.sin(x)), sp.exp(x*sp.sin(x))*(sp.sin(x) + x*sp.cos(x))),
 "ln(3x^2+2x-6)": (sp.log(3*x**2 + 2*x - 6), (6*x + 2)/(3*x**2 + 2*x - 6)),
 "(4-3x)(5+6x)": ((4 - 3*x)*(5 + 6*x), -3*(5 + 6*x) + 6*(4 - 3*x)),
 "x/(x^2+1)": (x/(x**2 + 1), (x**2 - 2*x*x + 1)/(x**2 + 1)**2),
 "sqrt(x^2+9)": (sp.sqrt(x**2 + 9), x/sp.sqrt(x**2 + 9)),
 "x^x": (x**x, x**x*(sp.log(x) + 1)),
 "tg(sin 5x)": (sp.tan(sp.sin(5*x)), 5*sp.cos(5*x)/sp.cos(sp.sin(5*x))**2),
}
for k, (f, shown) in E.items():
    diff = sp.simplify(sp.diff(f, x) - shown)
    good = diff == 0 or all(abs(float((sp.diff(f, x) - shown).subs(x, p))) < 1e-12 for p in (1.3, 1.7, 2.1))
    ok &= good
    print(f"{'OK ' if good else 'HIBA'} {k}: a widget alakja = sympy derivált")
chk("(4-3x)(5+6x) → 9 − 36x, x=2", (-3*(5 + 6*x) + 6*(4 - 3*x)).subs(x, 2), 9 - 72)
chk("x^x, x=2", sp.diff(x**x, x).subs(x, 2), 6.772588722239781)
chk("sqrt(x^2+9)', x=4", sp.diff(sp.sqrt(x**2 + 9), x).subs(x, 4), 0.8)
# a böngészőben kiírt numerikus ellenőrző sor egy példája
chk("e^(x sin x)', x=0.7", sp.diff(sp.exp(x*sp.sin(x)), x).subs(x, 0.7), 1.8517551115857722)

print("--- motion-graphs")
for s, pts in ((5*t**2, [(1, 5, 10, 10), (2, 20, 20, 10)]), (20*t - 2*t**2, [(2, 32, 12, -4), (5, 50, 0, -4)]),
               (t**3 - 6*t**2 + 9*t, [(2, 2, -3, 0), (1, 4, 0, -6), (3, 0, 0, 6)])):
    v = sp.diff(s, t); a = sp.diff(v, t)
    for t0, s0, v0, a0 in pts:
        chk(f"{s} t={t0}: s", s.subs(t, t0), s0); chk("   v", v.subs(t, t0), v0); chk("   a", a.subs(t, t0), a0)
chk("20 m/s km/h-ban", 20*3.6, 72)
print("lassul (2), t=2: v·a =", 12*-4, "< 0 → lassul")
print("MIND RENDBEN" if ok else "VAN HIBA")
