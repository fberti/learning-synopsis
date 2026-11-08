# Analízis 3 – w2.js widgetek elvárt számainak ellenőrzése (python3 -I)
from fractions import Fraction as F
import math

def ok(c, m):
    print(("OK  " if c else "FAIL") + " " + m)
    if not c: raise SystemExit(1)

# ---------------- asymptote-explorer (pontos racionális számolás) ----------------
def ev(p, x):
    r = 0
    for c in p: r = r * x + c
    return r
def div1(p, r):
    out = [p[0]]
    for c in p[1:]: out.append(c + out[-1] * r)
    return out[:-1], out[-1]
def divmod_(p, d):
    p = list(p); q = []
    while len(p) >= len(d):
        k = p[0] / d[0]; q.append(k)
        for i in range(len(d)): p[i] -= k * d[i]
        p.pop(0)
    return q, p
def rat_roots(q):
    # egész / kis nevezős gyökök (a mintapéldákhoz elég)
    cands = {F(k, d) for k in range(-40, 41) for d in range(1, 7)}
    return sorted(r for r in cands if ev(q, r) == 0)
def analyse(p, q):
    p = [F(c) for c in p]; q = [F(c) for c in q]
    holes, vert = [], []
    for r in rat_roots(q):
        mq = 0
        while ev(q, r) == 0: q, _ = div1(q, r); mq += 1
        k = 0
        while k < mq and ev(p, r) == 0: p, _ = div1(p, r); k += 1
        for _ in range(mq - k): q = q + [0]; q = [a - r * b for a, b in zip(q, [0] + q[:-1])]  # (x-r)-rel visszaszoroz
        if k == mq: holes.append((r, ev(p, r) / ev(q, r)))
        else:
            h = F(1, 10**6)
            s = lambda x: "+inf" if ev(p, x) / ev(q, x) > 0 else "-inf"
            vert.append((r, s(r - h), s(r + h)))
    dp, dq = len(p) - 1, len(q) - 1
    if dp < dq: beh = ("y", 0)
    elif dp == dq: beh = ("y", p[0] / q[0])
    elif dp == dq + 1: beh = ("ferde", tuple(divmod_(p, q)[0]))
    else: beh = ("inf",)
    return holes, vert, beh

h, v, b = analyse([1, -3, 2], [1, 0, -1])
print("(6)", h, v, b)
ok(h == [(1, F(-1, 2))] and v == [(-1, "+inf", "-inf")] and b == ("y", 1), "(6) lyuk 1 (−0,5), függ. −1 (−1−: +∞, −1+: −∞), y = 1")
h, v, b = analyse([1, 1], [1, -1]); ok(v == [(1, "-inf", "+inf")] and b == ("y", 1), "(2) x→1−: −∞, x→1+: +∞, y = 1")
h, v, b = analyse([1, 0, -1], [1, -1]); ok(h == [(1, 2)] and not v, "(1) lyuk az 1-ben, érték 2")
h, v, b = analyse([2, 0, -1], [1, 0, -4]); ok(b == ("y", 2) and [r for r, *_ in v] == [-2, 2], "(3) y = 2, x = ±2")
h, v, b = analyse([1, 0], [1, 0, 1]); ok(b == ("y", 0) and not v, "(4) y = 0")
h, v, b = analyse([1, 0, 1], [1, 0]); ok(b == ("ferde", (1, 0)) and [r for r, *_ in v] == [0], "(5) ferde y = x, x = 0")
h, v, b = analyse([1, 0, 0, 0], [1, 0, -1]); ok(b == ("ferde", (1, 0)) and [r for r, *_ in v] == [-1, 1], "(7) ferde y = x, x = ±1")
print("   (7) egyoldaliak:", v)

# ---------------- bisection ----------------
def bis(f, a, b, n):
    rows = []
    for k in range(1, n + 1):
        m = (a + b) / 2; fm = f(m)
        rows.append((k, a, b, m, fm))
        if f(a) * fm < 0: b = m
        else: a = m
    return rows, a, b
f = lambda x: x**3 - x - 1
ok(f(1) == -1 and f(2) == 5, "f(1) = −1, f(2) = 5")
rows, a10, b10 = bis(f, 1.0, 2.0, 10)
for r in rows[:4]: print("   k=%d m=%.6f f(m)=%.6f" % (r[0], r[3], r[4]))
ok(rows[0][3] == 1.5 and rows[0][4] == 0.875, "m1 = 1,5, f = 0,875")
ok(rows[1][3] == 1.25 and rows[1][4] == -0.296875, "m2 = 1,25, f = −0,296875")
ok(rows[2][3] == 1.375 and round(rows[2][4], 4) == 0.2246, "m3 = 1,375, f ≈ 0,2246")
ok(rows[3][3] == 1.3125 and round(rows[3][4], 4) == -0.0515, "m4 = 1,3125, f ≈ −0,0515")
print("   10 lépés után: [%.5f; %.5f], hossz %s" % (a10, b10, b10 - a10))
ok("%.5f" % a10 == "1.32422" and "%.5f" % b10 == "1.32520" and b10 - a10 == 1 / 1024, "[1,32422; 1,32520], hossz 1/1024")
r = 1.0
for _ in range(60): r = r - f(r) / (3 * r * r - 1)
print("   gyök:", r); ok("%.6f" % r == "1.324718", "gyök 1,324718")
g = lambda x: math.cos(x) - x
r = 0.5
for _ in range(60): r = r - g(r) / (-math.sin(r) - 1)
print("   cos x − x gyöke:", r); ok("%.6f" % r == "0.739085", "cos gyök 0,739085")
for eps, n in [(0.1, 4), (0.01, 7), (0.001, 10), (1e-6, 20)]:
    N = math.ceil(math.log2(1 / eps)); ok(N == n, f"pontosság {eps}: {N} lépés ([1; 2])")
print("   [0; π/2], 0,001:", math.ceil(math.log2((math.pi / 2) / 0.001)))
print("   x²−2 gyöke √2 =", math.sqrt(2), "; e^x − 3x gyöke [0;1]-ben:", end=" ")
h_ = lambda x: math.exp(x) - 3 * x; a, b = 0.0, 1.0
for _ in range(60):
    m = (a + b) / 2
    if h_(a) * h_(m) <= 0: b = m
    else: a = m
print(a)

# ---------------- thermo-volume ----------------
def V(T): return 1091.0 if T < 0 else 1000 + 0.0075 * (T - 4) ** 2
def worst(T0, d):
    lo, hi = T0 - d, T0 + d; V0 = V(T0); vals = []
    if lo < 0: vals.append(1091.0)
    if hi >= 0:
        a = max(0.0, lo); vals += [V(a), V(hi)]
        if a <= 4 <= hi: vals.append(1000.0)
    return max(abs(x - V0) for x in vals)
def dstar(T0, eps):
    if abs(T0) < 1e-12: return None
    if T0 < 0: return -T0
    def werr(d):
        lo, hi = T0 - d, T0 + d; V0 = V(T0)
        g = lambda T: 1000 + 0.0075 * (T - 4) ** 2
        vals = [g(lo), g(hi)] + ([1000.0] if lo <= 4 <= hi else [])
        return max(abs(x - V0) for x in vals)
    a, b = 0.0, 40.0
    for _ in range(200):
        m = (a + b) / 2
        if werr(m) < eps: a = m
        else: b = m
    return min(a, T0)
print("   V(20) =", V(20)); ok(abs(V(20) - 1001.92) < 1e-9, "V(20) = 1001,92")
ok(abs(V(0) - 1000.12) < 1e-9, "V(0) = 1000,12")
d = dstar(20, 0.1); print("   δ*(20; 0,1) =", d, " képlet:", math.sqrt(256 + 0.1 / 0.0075) - 16)
ok(round(d, 4) == 0.4114 and abs(d - (math.sqrt(256 + 0.1 / 0.0075) - 16)) < 1e-9, "δ* = 0,4114")
w = worst(20, 0.5); print("   hiba δ=0,5:", w); ok(abs(w - 0.121875) < 1e-9 and w > 0.1, "δ = 0,5 → 0,121875 ✘")
w = worst(20, 0.4); print("   hiba δ=0,4:", w); ok(round(w, 4) == 0.0972 and w < 0.1, "δ = 0,4 → 0,0972 ✔")
d = dstar(4, 0.1); print("   δ*(4) =", d); ok(round(d, 4) == 3.6515, "δ*(4; 0,1) = 3,6515")
werr_left = math.sqrt(3.5**2 + 0.1 / 0.0075) - 3.5
d = dstar(0.5, 0.1); print("   δ*(0,5): víz ág korlátja", werr_left, "→ δ* =", d)
ok(abs(d - 0.5) < 1e-12 and werr_left > 0.5, "δ*(0,5; 0,1) = 0,5 (a 0 °C-os ugrás korlátoz)")
ok(abs(V(-1e-9) - V(0) - 90.88) < 1e-9, "ugrás 0 °C-nál: 90,88 cm³")
ok(dstar(-2, 0.1) == 2, "jég ág: δ* = |T0|")
for T0, e in [(10, 0.1), (25, 1), (1, 0.01), (2, 10)]: print(f"   δ*({T0}; {e}) = {dstar(T0, e):.4f}")
print("MINDEN RENDBEN")
