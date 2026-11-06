# Ellenőrzés: _parts/an2/q1.js (an2-21 … an2-24) minden szám-válasza és rossz válasza
from fractions import Fraction as F
from math import sqrt, sin, cos, isclose

ok = lambda c, msg: print(("OK  " if c else "HIBA") + " " + msg)

print("== an2-21")
# Q1 a_n = n^2+3 -> a_{n+1} = n^2+2n+4; rossz: a_n+1 = n^2+4; (n+1)^2=n^2+n+1 -> n^2+n+4; +3 elhagyva: n^2+2n+1
for n in range(1, 6):
    a = lambda k: k * k + 3
    assert a(n + 1) == n * n + 2 * n + 4
    assert a(n) + 1 == n * n + 4 != a(n + 1)
ok(True, "Q1 a_{n+1} = n^2+2n+4; a_n+1 = n^2+4 különbözik")
# Q2 a_n = (-1)^(n+1)/n^2, a_4
a = lambda n: F((-1) ** (n + 1), n * n)
ok(a(4) == F(-1, 16), f"Q2 a_4 = {a(4)}; rossz: +1/16, -1/8 (2n), a_5 = {a(5)}")
# Q3 a1=2, a_{n+1}=3a_n-1
s = [2]
for _ in range(4): s.append(3 * s[-1] - 1)
t = [2]
for _ in range(3): t.append(3 * (t[-1] - 1))
ok(s[3] == 41, f"Q3 tagok {s}: a_4={s[3]}, a_3={s[2]}, a_5={s[4]}; 3(a_n-1) hibával a_4={t[3]}")
# Q4 a1=4, d=3, a15
ok(4 + 14 * 3 == 46, f"Q4 a_15=46; nd: {4+15*3}; a1 nélkül: {14*3}; 13 lépés: {4+13*3}")
# Q5 3+7+...+43
terms = list(range(3, 44, 4))
ok(sum(terms) == 253 and len(terms) == 11, f"Q5 n={len(terms)}, S={sum(terms)}; 10 tag: {10*46//2}; /2 nélkül: {11*46}; 12 tag: {12*46//2}")
# Q6 a2=6, a5=48
q = round((48 / 6) ** (1 / 3)); a1 = F(6, q)
ok(q == 2 and a1 == 3, f"Q6 q={q}, a1={a1}; számtani: d={(48-6)//3}, a1={6-(48-6)//3}; q^3 gyök nélkül: q=8, a1={F(6,8)}; rossz irány: a1={6*q}")
# Q7 2+6+18+... 6 tag
S6 = 2 * (3 ** 6 - 1) // (3 - 1)
ok(S6 == 728 == sum(2 * 3 ** k for k in range(6)), f"Q7 S6={S6}; 7 tag: {2*(3**7-1)//2}; utolsó tag: {2*3**5}; (q-1) nélkül: {2*(3**6-1)}")
# Q8 match: mindegyik a1=5
for n in range(1, 8):
    assert 3 * (n + 1) + 2 == (3 * n + 2) + 3
    assert 5 * 3 ** n == 3 * (5 * 3 ** (n - 1))
    assert 6 - (n + 1) == (6 - n) - 1
    assert 2 ** (n + 1) + 3 == 2 * (2 ** n + 3) - 3
ok([3 * 1 + 2, 5 * 3 ** 0, 6 - 1, 2 ** 1 + 3] == [5] * 4, "Q8 match: mind a1=5, rekurziók egyeznek")

print("== an2-22")
# Q1 a_n = n/(n+1): a_{n+1}-a_n = 1/((n+1)(n+2))
for n in range(1, 8):
    d = F(n + 1, n + 2) - F(n, n + 1)
    assert d == F(1, (n + 1) * (n + 2))
    assert F(1, n + 1) == 1 - F(n, n + 1)          # a_{n+1}=1 hibával
    assert F(1 - 2 * n, (n + 1) * (n + 2)) != d   # (n+1)^2 = n^2+1 hibával
ok(True, "Q1 különbség = 1/((n+1)(n+2)); rossz: -..., (1-2n)/..., 1/(n+1)")
# Q2 a_n = n^2-8n
a = [n * n - 8 * n for n in range(1, 10)]
dif = [2 * n - 7 for n in range(1, 9)]
ok(all(a[i] < a[i + 1] for i in range(3, 8)) and a[2] > a[3], f"Q2 tagok {a}; különbség {dif}; a 4. tagtól szig. nő")
# Q3 2^n/n!
from math import factorial
a = [F(2 ** n, factorial(n)) for n in range(1, 7)]
ok(a[0] == a[1] and all(a[i] > a[i + 1] for i in range(1, 5)), f"Q3 tagok {[str(x) for x in a]}; hányados 2/(n+1)")
# Q4 -2^n
a = [-(2 ** n) for n in range(1, 6)]
ok(all(a[i] > a[i + 1] for i in range(4)) and all(a[i + 1] / a[i] == 2 for i in range(4)), f"Q4 {a}: csökken, hányados 2")
# Q5 (2n+3)/(n+1) = 2 + 1/(n+1)
a = [F(2 * n + 3, n + 1) for n in range(1, 8)]
ok(a[0] == F(5, 2) and all(x == 2 + F(1, n + 1) for n, x in zip(range(1, 8), a)) and all(a[i] > a[i + 1] for i in range(6)),
   f"Q5 a1={a[0]}, csökken, inf=2 (nem vétetik fel); a_0={F(3,1)}")
# Q6 korlátosság
ok(True, "Q6 (-1)^n/n: |.|<=1; (-1)^n: |.|<=1; 3-1/(n+1) in [2,5;3[; 2n+1, n^2-6n felülről nem korlátos")
# Q8 match
ok(F(3*2-1) - F(3*1-1) == 3, "Q8 3n-1: d=3 szig. nő; 1/n szig. csökken; 5 konstans; (-1)^n/n nem monoton")

print("== an2-23")
# Q2 (4n+1)/(2n+3) -> 2, eps=0,01: |.| = 5/(2n+3)
for n in range(1, 2000):
    assert abs(F(4 * n + 1, 2 * n + 3) - 2) == F(5, 2 * n + 3)
good = [n for n in range(1, 2000) if F(5, 2 * n + 3) < F(1, 100)]
ok(good[0] == 249, f"Q2 első jó tag n={good[0]} -> legkisebb N=248; 5/(2n)<0,01 -> n>250; 2n+3>500")
# Q3 1/3^n < 0,01
good = [n for n in range(1, 50) if F(1, 3 ** n) < F(1, 100)]
ok(good[0] == 5, f"Q3 első jó n={good[0]} -> N=4 (3^4={3**4}, 3^5={3**5}); 1/(3n): 3n>100 -> N=33")
# Q4 (n-4)/(n+1) -> 1, |.|=5/(n+1)
for n in range(1, 2000):
    assert F(n - 4, n + 1) - 1 == F(-5, n + 1)
good = [n for n in range(1, 2000) if F(5, n + 1) < F(1, 100)]
ok(good[0] == 500, f"Q4 első jó n={good[0]} -> N=499")
# Q5 konvergensek
ok(isclose(3 + (-1) ** 1001 / 1001, 3, abs_tol=1e-2), "Q5 (-1)^n/n -> 0, 3+(-1)^n/n -> 3; (-1)^n+1/n divergens")
# Q8 (-1)^n n/(n+1)
ok(isclose(1000 / 1001, 1, abs_tol=1e-2) and isclose(-1001 / 1002, -1, abs_tol=1e-2), "Q8 páros -> 1, páratlan -> -1, |a_n|<1")

print("== an2-24")
lim = lambda f: f(10 ** 7)
# Q1
v = lim(lambda n: (4 * n * n - 3 * n + 1) / (2 * n * n + 5))
ok(isclose(v, 2, rel_tol=1e-5), f"Q1 -> {v:.6f}; rossz: 1, 1/5, 1/2")
# Q2
v = lim(lambda n: (3 * n ** 3 - n) / (2 - 4 * n * n))
ok(v < -1e6, f"Q2 -> {v:.3e} (-végtelen); főegyütthatók: 3/(-4) = {3/-4}")
# Q4 sqrt(n^2+4n)-n -> 2 (stabil alak)
v = lim(lambda n: 4 * n / (sqrt(n * n + 4 * n) + n))
ok(isclose(v, 2, rel_tol=1e-5), f"Q4 -> {v:.6f}; rossz: 0, 4 (nevező n), +végtelen (sqrt(4n))")
# Q5 sqrt(9n^2+1)/(3n-2) -> 1
v = lim(lambda n: sqrt(9 * n * n + 1) / (3 * n - 2))
ok(isclose(v, 1, rel_tol=1e-5), f"Q5 -> {v:.6f}; rossz: 3 (gyök nélkül 9/3), 1/3 (sqrt(9n^2)=n), +végtelen")
# Q6 (5n+sin n)/(n+2) -> 5
v = lim(lambda n: (5 * n + sin(n)) / (n + 2))
lo = lim(lambda n: (5 * n - 1) / (n + 2)); hi = lim(lambda n: (5 * n + 1) / (n + 2))
ok(isclose(v, 5, rel_tol=1e-5) and isclose(lo, 5, rel_tol=1e-5) and isclose(hi, 5, rel_tol=1e-5), f"Q6 -> {v:.6f}, rendőrök {lo:.6f}, {hi:.6f}")
# Q7 a1=1, a_{n+1}=sqrt(12+a_n)
a = [1.0]
for _ in range(40): a.append(sqrt(12 + a[-1]))
ok(isclose(a[-1], 4) and all(a[i] < a[i + 1] < 4 for i in range(8)), f"Q7 tagok {[round(x,3) for x in a[:5]]} -> {a[-1]:.6f}; A^2-A-12=0: gyökök 4, -3; sqrt(12)={sqrt(12):.3f}")
# Q8 a1=2, a_{n+1}=3a_n-2
a = [2]
for _ in range(5): a.append(3 * a[-1] - 2)
ok(a[:4] == [2, 4, 10, 28], f"Q8 tagok {a} -> +végtelen; fixpont A=3A-2 -> A=1")
