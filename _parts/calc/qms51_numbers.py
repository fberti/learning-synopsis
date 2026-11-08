# ms5-51..54 kvízek számainak ellenőrzése (+ a szöveg néhány száma)
from itertools import combinations, product
from fractions import Fraction as F
from math import sqrt, comb
from scipy import stats
Phi = stats.norm.cdf
pop = [2, 4, 6, 8, 10]
print("== 5.1")
print("C(6,2), 6^2, 6*5, 6*2:", comb(6, 2), 36, 30, 12)
vn = [F(a + b, 2) for a, b in combinations(pop, 2)]
vv = [F(a + b, 2) for a, b in product(pop, pop)]
print("P(xbar=7) v.n.:", vn.count(7) / F(10), " v.:", vv.count(7) / F(25))
print("P(Xbar=4) v.:", vv.count(4) / F(25), float(vv.count(4) / F(25)), " v.n.:", vn.count(4) / F(10))
# szöveg: max/min/s2/terjedelem
mx = [max(a, b) for a, b in combinations(pop, 2)]; print("E(max) v.n.", F(sum(mx), 10))
mn = [min(a, b) for a, b in combinations(pop, 2)]; print("E(min) v.n.", F(sum(mn), 10))
s2 = [F((a - b) ** 2, 2) for a, b in product(pop, pop)]; print("E(s2) v.", sum(s2) / 25)
s2n = [F((a - b) ** 2, 2) for a, b in combinations(pop, 2)]; print("E(s2) v.n.", sum(s2n) / 10)
print("E(range) v.", F(sum(abs(a - b) for a, b in product(pop, pop)), 25))
print("E(max) v.", F(sum(max(a, b) for a, b in product(pop, pop)), 25))
p3 = [1, 3, 5]
m1 = F(sum(max(a, b) for a, b in combinations(p3, 2)), 3)
m2 = F(sum(max(a, b) for a, b in product(p3, p3)), 9)
print("pop 1,3,5: E(max) v.n.", m1, float(m1), " v.", m2, float(m2))
d2 = [F(a + b, 2) for a, b in product(range(1, 7), repeat=2)]
print("2 kocka P(avg=2):", d2.count(2), "/36")
print("== 5.2")
print("sigma=12,n=16: SE, s/n, s^2/n:", 12 / 4, 12 / 16, 144 / 16)
print("SE 4 n100 -> n200:", 4 / sqrt(2), 4 * sqrt(2))
print("IQ n=25 SE3 -> SE1:", 25 * 9, 25 * 3, (15 / 1) ** 2, 15 / 1)
f = sqrt(300 / 399); print("N400 n100 s20: f", f, "SE", 2 * f, "fordítva", 2 / f, "gyök nélkül", 2 * 300 / 399)
print("varos n:", 1000 * 100000 / (100000 - 1 + 1000))
d = [1, 3, 5, 7, 9]; import statistics as st
print("1..9: s", st.stdev(d), "SE", st.stdev(d) / sqrt(5), "pstdev/sqrt n", st.pstdev(d) / sqrt(5), "s/n", st.stdev(d) / 5)
print("cikk: s", 0.8 * 15, "SE*n", 0.8 * 225, "SE^2 n", 0.8 ** 2 * 225, "SE/sqrt n", 0.8 / 15)
# szöveg
print("text: N200 n50:", 8 / sqrt(50), sqrt(150 / 199), 8 / sqrt(50) * sqrt(150 / 199))
print("text: 2000/400:", sqrt(1600 / 1999), 2.5 * sqrt(1600 / 1999), 1 - sqrt(1600 / 1999))
print("text: 500/100:", sqrt(400 / 499), " 8M:", sqrt((8e6 - 1000) / (8e6 - 1)), " 1%:", sqrt(9900 / 9999))
print("== 5.3")
print("4 doboz:", Phi(-1), Phi(-0.5), Phi(-2), Phi(1))
print("mu80 s10 n25 >82:", 1 - Phi(1), Phi(1), 1 - Phi(0.2), Phi(0.2))
print("n kell:", (1.96 * 10 / 2) ** 2, 1.96 * 10 / 2, (10 / 2) ** 2)
print("64 elem s8: sum", 8 * 8, "mean", 8 / 8, "s*n", 8 * 64, "s/n", 8 / 64)
# szöveg
print("text 100 kocka:", 2 * Phi(0.2 / (sqrt(35 / 12) / 10)) - 1)
import numpy as np
pmf = np.array([1.0]); one = np.ones(6) / 6
for _ in range(30): pmf = np.convolve(pmf, one)
print("text 30 kocka exact P(S>=120):", pmf[120 - 30:].sum(), " normal:", 1 - Phi(0.5 / (sqrt(35 / 12) / sqrt(30))), " cc:", 1 - Phi((119.5 - 105) / (sqrt(35 / 12) * sqrt(30))))
for n in (5, 30, 100):
    print("text izzó n", n, stats.gamma.sf(120, a=n, scale=100 / n), 1 - Phi(20 / (100 / sqrt(n))), 2 / sqrt(n))
print("text exp m2 n50 >2,5:", stats.gamma.sf(2.5, a=50, scale=2 / 50), 1 - Phi(0.5 / (2 / sqrt(50))))
print("text izzó n50 >110:", stats.gamma.sf(110, a=50, scale=2), 1 - Phi(10 / (100 / sqrt(50))))
print("text 3 kocka:", np.round(np.convolve(np.convolve(np.ones(6), np.ones(6)), np.ones(6))))
print("== 5.4")
print("p.2 n400:", sqrt(.16 / 400), sqrt(.2 / 400), .16 / 20, .16 / 400)
print("n400 p.5 hh:", 1.96 * sqrt(.25 / 400), sqrt(.25 / 400), 2 * 1.96 * sqrt(.25 / 400), 1.96 * .25 / 400)
print("±2 n:", (1.96 / .02) ** 2 * .25, .25 / .02 ** 2, (1.96 / .01) ** 2 * .25, (1.96 / .01) ** 2 * .25 / 2)
for n, p in [(1000, .4), (200, .03), (1000, .001), (100, .9), (50, .02)]:
    print("feltétel", n, p, n * p, n * (1 - p))
print("alcsoport 250:", 1.96 * sqrt(.25 / 250), 1.96 * sqrt(.25 / 1000), sqrt(.25 / 250), 4 * 1.96 * sqrt(.25 / 1000))
print("n2 p.3 P(1/2):", 2 * .3 * .7, .3 * .7, .3 ** 2, .7 ** 2)
print("SE<=2pp:", .25 / .02 ** 2, .5 / .02, .5 / .02 ** 2)
# szöveg
print("text:", 1 - Phi(.03 / sqrt(.24 / 1000)), stats.binom.sf(429, 1000, .4), .98 ** 50, Phi(-.05 / sqrt(.24 / 400)),
      2 * Phi(.02 / sqrt(.24 / 1000)) - 1, 1.96 * sqrt(.2496 / 600), 1.96 * sqrt(.12 * .88 / 1000) / .12, 1.96 * sqrt(.25 / 200))
