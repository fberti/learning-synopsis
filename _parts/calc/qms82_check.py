# Ellenőrzés: _parts/ms8/q2.js (ms8-85 … ms8-88, ms8-final) számai
from math import sqrt, ceil
from scipy import stats
import numpy as np

N = stats.norm
def p2z(z): return 2 * N.sf(abs(z))
def welch_df(v1, n1, v2, n2):
    a, b = v1 / n1, v2 / n2
    return (a + b) ** 2 / (a * a / (n1 - 1) + b * b / (n2 - 1))
def show(label, *vals): print(f"{label:<44}", *[round(v, 4) if isinstance(v, float) else v for v in vals])

print("=== 8.5 ===")
# Q1 s_p^2: n1=5, s1^2=10; n2=9, s2^2=4
show("Q1 sp2 helyes", (4 * 10 + 8 * 4) / 12)
show("Q1 egyszerű átlag", (10 + 4) / 2)
show("Q1 /(n1+n2)", (4 * 10 + 8 * 4) / 14)
show("Q1 n-nel súlyozva", (5 * 10 + 9 * 4) / 14)
# Q2 n=8+8, diff 6, s=4
sp = 4; se = sp * sqrt(2 / 8); t = 6 / se
show("Q2 SE, t, df", se, t, 14, "p", 2 * stats.t.sf(t, 14))
show("Q2 SE-k összege -> t", 6 / (2 * 4 / sqrt(8)))
show("Q2 egymintás SE -> t", 6 / (4 / sqrt(8)))
# Q3 Welch: s1=3,n1=9; s2=6,n2=12; diff 5
se = sqrt(9 / 9 + 36 / 12); show("Q3 SE, t", se, 5 / se, "df", welch_df(9, 9, 36, 12), "p", 2 * stats.t.sf(5 / se, welch_df(9, 9, 36, 12)))
s_sum = 3 / 3 + 6 / sqrt(12); show("Q3 SE-k összege, t", s_sum, 5 / s_sum)
s_ns = sqrt(3 / 9 + 6 / 12); show("Q3 négyzet nélkül, t", s_ns, 5 / s_ns)
s_nn = sqrt(9 + 36); show("Q3 n nélkül, t", s_nn, 5 / s_nn)
# Q4 df bounds n1=6, n2=15
show("Q4 határok", min(6, 15) - 1, 6 + 15 - 2)
# példa: s1=6 n1=6 s2=3 n2=15
show("Q4 egy lehetséges Welch-df (s 6 vs 3)", welch_df(36, 6, 9, 15))
# Q6 kontextus: n1=6, s1=15; n2=30, s2=4
sp2 = (5 * 225 + 29 * 16) / 34
show("Q5 közös SE / Welch SE", sqrt(sp2 * (1 / 6 + 1 / 30)), sqrt(225 / 6 + 16 / 30))
# Q8 3+3
a = [7, 9, 11]; b = [3, 5, 4]
r = stats.ttest_ind(a, b); show("Q8 t, p (közös)", r.statistic, r.pvalue)
import itertools
allv = a + b; obs = np.mean(a) - np.mean(b); cnt = 0; tot = 0
for c in itertools.combinations(range(6), 3):
    g1 = [allv[i] for i in c]; g2 = [allv[i] for i in range(6) if i not in c]
    tot += 1; cnt += abs(np.mean(g1) - np.mean(g2)) >= abs(obs) - 1e-9
show("Q8 permutációs kétoldali p", cnt / tot, "min", 2 / tot)
# szöveg-ellenőrzések 8.5
show("szöveg 8+8 t", stats.ttest_ind([72,75,78,80,81,83,85,90],[65,68,70,72,74,76,79,82]).statistic)
se = sqrt(1.6**2/100 + 1.43**2/50); dfw = welch_df(1.6**2,100,1.43**2,50)
show("ncbirths SE t df p", se, 0.4/se, dfw, 2*stats.t.sf(0.4/se, dfw))
show("ncbirths df49 p", 2*stats.t.sf(0.4/se, 49))
sp2 = (99*1.6**2 + 49*1.43**2)/148; show("ncbirths sp, SE", sqrt(sp2), sqrt(sp2)*sqrt(.03))
show("8.5 kiegészítés: 4,0 vs 1,79 p (df18)", 2*stats.t.sf(4/(5*sqrt(.2)), 18), stats.t.ppf(.975, 18))
show("5 vs 20 közös", sqrt((4*100+19*9)/23*(1/5+1/20)), 6/sqrt((4*100+19*9)/23*(1/5+1/20)), 2*stats.t.sf(6/sqrt((4*100+19*9)/23*.25), 23))
show("5 vs 20 Welch", sqrt(20+.45), welch_df(100,5,9,20), 2*stats.t.sf(6/sqrt(20.45), welch_df(100,5,9,20)))
show("t_14 .975", stats.t.ppf(.975, 14))

print("=== 8.6 ===")
show("Q1 chi2 helyes (n=11,s=5,s0=4)", 10 * 25 / 16)
show("Q1 szórással", 10 * 5 / 4); show("Q1 n-nel", 11 * 25 / 16); show("Q1 fordítva", 10 * 16 / 25)
show("Q1 p jobboldali", stats.chi2.sf(10 * 25 / 16, 10), "krit", stats.chi2.ppf(.95, 10))
c = 20 * 25 / 64; show("Q2 chi2 (n=21,s=5,s0=8)", c, "q05", stats.chi2.ppf(.05, 20), "q95", stats.chi2.ppf(.95, 20), "p bal", stats.chi2.cdf(c, 20))
show("Q2 s/s0", 5 / 8)
show("Q4 F (s 10/n16 vs 5/n9)", 100 / 25, "szórásarány", 10 / 5, "fordítva", 25 / 100)
show("Q5 F=4 df(12,10) p kétoldali", 2 * stats.f.sf(4, 12, 10), "krit", stats.f.ppf(.975, 12, 10), stats.f.ppf(.95, 12, 10))
show("Q4 krit F_{15,8;.975}", stats.f.ppf(.975, 15, 8))
show("szöveg: F=2,25 p", 2*stats.f.sf(2.25,12,10), "F2,2 .975", stats.f.ppf(.975,2,2), "F=9 p", 2*stats.f.sf(9,2,2))
show("szöveg: joghurt chi2, p", 19*25/16, stats.chi2.sf(19*25/16,19), stats.chi2.ppf(.95,19))
show("szöveg: karb. chi2", 24*49/100, stats.chi2.ppf(.05,24), stats.chi2.cdf(11.76,24))
show("szöveg: 22,5 p jobb", stats.chi2.sf(22.5,10), stats.chi2.ppf([.025,.95,.975],10))
show("szöveg: F 25/9 p, krit", 2*stats.f.sf(25/9,15,20), stats.f.ppf(.975,15,20), "F_12,10 .95", stats.f.ppf(.95,12,10))

print("=== 8.7 ===")
se = sqrt(.2 * .8 / 400); show("Q1 SE, z", se, .05 / se, "p kétold", p2z(.05 / se))
show("Q1 p̂-vel", .05 / sqrt(.25 * .75 / 400)); show("Q1 sqrt(p0(1-p0))", .05 / .4); show("Q1 1-p0 nélkül", .05 / sqrt(.2 / 400))
for n, p0 in [(50, .1), (200, .04), (400, .15), (100, .5), (1000, .995)]:
    show(f"Q2 n={n} p0={p0}", n * p0, n * (1 - p0))
show("Q3 pontos P(X>=3)", stats.binom.sf(2, 70, .02), "z p0", (3/70 - .02) / sqrt(.02 * .98 / 70),
     "z p̂ n-1", (3/70 - .02) / sqrt(3/70 * (1 - 3/70) / 69), "z p̂ n", (3/70 - .02) / sqrt(3/70 * (1 - 3/70) / 70))
show("Q3 könyv kerekített", (0.043-0.02)/sqrt(0.043*0.957/69))
# Q4/Q5 30/100 vs 90/200
pp = 120 / 300; show("Q4 összevont, átlag, 120/200, különbség", pp, (.3 + .45) / 2, 120 / 200, .15)
se = sqrt(pp * (1 - pp) * (1 / 100 + 1 / 200)); show("Q5 SE, z, p", se, .15 / se, p2z(.15 / se))
seu = sqrt(.3 * .7 / 100 + .45 * .55 / 200); show("Q5 külön SE, z", seu, .15 / seu)
ses = sqrt(.3 * .7 / 100) + sqrt(.45 * .55 / 200); show("Q5 SE-k összege, z", ses, .15 / ses)
set_ = sqrt(pp * (1 - pp) / 300); show("Q5 teljes n egyszer, z", set_, .15 / set_)
show("Q5 0,375-tel", .15 / sqrt(.375*.625*.015))
show("Q6 független 20 próba", 1 - .95 ** 20, "Bonferroni", .05 / 20)
show("Q7 z^2 (2,05)", 2.05 ** 2)
pa, pb = .1, .17; pp = .135; se = sqrt(pp*(1-pp)*.01); show("szöveg A/B SE z z^2 p", se, .07/se, (.07/se)**2, p2z(.07/se))
show("szöveg dohány z, p, pontos", (.105-.15)/sqrt(.15*.85/400), N.cdf((.105-.15)/sqrt(.15*.85/400)), stats.binom.cdf(42,400,.15))
show("szöveg 30/45 z p", .15/sqrt(.375*.625*.02), p2z(.15/sqrt(.375*.625*.02)))
show("szöveg 2000/2000 z", .015/sqrt(.1075*.8925*.001), p2z(.015/sqrt(.1075*.8925*.001)))
show("szöveg 210/600", -.05/.02, p2z(2.5), -.05/sqrt(.35*.65/600))
show("szöveg dohány krit p̂ és db", .15-1.645*sqrt(.15*.85/400), 400*(.15-1.645*sqrt(.15*.85/400)))
# belenézés szimuláció (gyors)
rng = np.random.default_rng(1); R = 20000; hits = 0
for _ in range(1):
    a = rng.binomial(1, .1, size=(R, 2000)).cumsum(1)[:, 99::100]
    b = rng.binomial(1, .1, size=(R, 2000)).cumsum(1)[:, 99::100]
    n = np.arange(100, 2001, 100)
    p = (a + b) / (2 * n); se = np.sqrt(p * (1 - p) * 2 / n)
    with np.errstate(divide='ignore', invalid='ignore'):
        z = np.where(se > 0, (a / n - b / n) / se, 0)
    hits = (np.abs(z) >= 1.96).any(1).mean(); last = (np.abs(z[:, -1]) >= 1.96).mean()
show("belenézés szim. bármikor / csak végén", hits, last)

print("=== 8.8 ===")
z975, z80, z95, z90 = N.ppf(.975), N.ppf(.8), N.ppf(.95), N.ppf(.9)
se = 10 * sqrt(2 / 50); show("Q1 SE, erő", se, N.cdf(4 / se - z975), "(+másik farok)", N.cdf(4/se - z975) + N.cdf(-4/se - z975))
show("Q1 σ/√n", N.cdf(4 / (10 / sqrt(50)) - z975)); show("Q1 1,645", N.cdf(4 / se - z95)); show("Q1 β", 1 - N.cdf(4 / se - z975))
n = 2 * ((z975 + z80) / .4) ** 2; show("Q2 n, kerek", n, ceil(n))
show("Q2 2-es nélkül", ((z975 + z80) / .4) ** 2, ceil(((z975 + z80) / .4) ** 2)); show("Q2 egyoldali", 2 * ((z95 + z80) / .4) ** 2, ceil(2 * ((z95 + z80) / .4) ** 2))
show("Q2 7,85-tel", 2 * 7.85 / .16, "összesen", 2 * ceil(n))
show("Q3 60 -> felére", 60 * 4, 60 * 2, 60 * sqrt(2), 30)
show("Q4 Lehr d=0,25", 16 / .0625, 16 / .25, 8 / .0625, 2 * 16 / .0625)
show("Q6 arányok", )
def npp(p1, p2, a=.05, pw=.8):
    pb = (p1 + p2) / 2; za, zb = N.ppf(1 - a / 2), N.ppf(pw)
    return (za * sqrt(2 * pb * (1 - pb)) + zb * sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / (p1 - p2) ** 2
for p1, p2 in [(.1, .15), (.2, .25), (.1, .12)]:
    show(f"   {p1}->{p2}", npp(p1, p2), ceil(npp(p1, p2)))
show("   arány 10->12 / 10->15", npp(.1, .12) / npp(.1, .15))
show("Q7 lemorzsolódás 200/0,8", 200 / .8, 200 * 1.2, 200 * .8)
n = ((z975 + z80) * 5 / 2) ** 2; show("Q8 páros n", n, ceil(n), "egyoldali", ((z95 + z80) * 2.5) ** 2, "független 2σ²", 2 * 25 * (z975 + z80) ** 2 / 4, "négyzet nélkül", (z975 + z80) * 2.5)
show("szöveg vérnyomás", 12*sqrt(.02), z975*12*sqrt(.02), 1-N.cdf((z975*12*sqrt(.02)-3)/(12*sqrt(.02))), N.cdf(3/1.2-z975))
show("szöveg n vérny", 2*144*(z975+z80)**2/9, "7,85^", (z975+z80)**2)
show("szöveg d=.5 n40, 80%, 90%", N.cdf(.5*sqrt(20)-z975), 2*((z975+z80)/.5)**2, 2*((z975+z90)/.5)**2)
show("szöveg ncbirths erő, n", N.cdf(.4/.258-z975), 2*2.25*(z975+z80)**2/.16, "30+30 d", (z975+z80)*sqrt(2/30), "12+12 d", (z975+z80)*sqrt(2/12))
# t-alapú n d=0,5
from scipy.optimize import brentq
def tpow(n, d):
    df = 2*n-2; nc = d*sqrt(n/2); c = stats.t.ppf(.975, df)
    return stats.nct.sf(c, df, nc) + stats.nct.cdf(-c, df, nc)
show("szöveg t-alapú n d=0,5", next(n for n in range(2, 200) if tpow(n, .5) >= .8))
show("Q2 t-alapú n d=0,4", next(n for n in range(2, 300) if tpow(n, .4) >= .8))

print("=== final ===")
show("F1 z, p", -4 / 2, p2z(2), "σ-val", -4 / 12, "σ/n", -4 / (12 / 36))
show("F2 SE, összeg, kivonás(var), kivonás(sd)", sqrt(1 + 4), 1 + 2, sqrt(4 - 1), 2 - 1, "z", 5 / sqrt(5), p2z(5/sqrt(5)))
show("F3 t, p, krit 8, 9", -4 / 2, 2 * stats.t.sf(2, 8), stats.t.ppf(.975, 8), stats.t.ppf(.975, 9), "s-sel", -4 / 6, "z p", p2z(2))
d = np.array([4, 6, 2, 5, 3]); r = stats.ttest_1samp(d, 0)
show("F4 d̄, s², t, p", d.mean(), d.var(ddof=1), r.statistic, r.pvalue, "n-nel", d.mean() / (d.std() / sqrt(5)), "SE helyett s", d.mean() / d.std(ddof=1))
show("F4 krit 4, 5", stats.t.ppf(.975, 4), stats.t.ppf(.975, 5))
show("F6 F, sd-arány, fordítva, krit, p", 81 / 36, 9 / 6, 36 / 81, stats.f.ppf(.975, 15, 20), 2 * stats.f.sf(81 / 36, 15, 20))
se = sqrt(.25 / 900); z = .04 / se; show("F7 SE z p p/2 1-p/2", se, z, p2z(z), N.sf(z), 1 - N.sf(z), "σ", .04 / .5, p2z(.08))
show("F8 Lehr d=0,3", 16 / .09, ceil(16 / .09), 16 / .3, 2 * 16 / .09, 8 / .09, "pontos", 2 * (z975 + z80) ** 2 / .09)
show("F9 KI ncbirths", .4 - stats.t.ppf(.975, 108.5) * .258, .4 + stats.t.ppf(.975, 108.5) * .258, stats.t.ppf(.975, 108.5))
show("F12 kávé", -.1 / (.15 / sqrt(10)), 2 * stats.t.sf(.1 / (.15 / sqrt(10)), 9))
c = 24 * 196 / 100; show("F13 chi2, p kétold, krit", c, 2 * stats.chi2.sf(c, 24), stats.chi2.ppf([.025, .975], 24), "s-sel", 24 * 14 / 10, "n-nel", 25 * 1.96, "fordítva", 24 * 100 / 196)
show("hírlevél", .018/sqrt(.113*.887*.0004), p2z(.018/sqrt(.113*.887*.0004)))
show("8.4 páros szöveg", stats.ttest_1samp([3,5,-1,4,2,5],0))
show("mixed welch 25-25", 4/sqrt(.64+1.44), welch_df(16,25,36,25), 2*stats.t.sf(4/sqrt(2.08), welch_df(16,25,36,25)))
show("mixed F 2,5 p", 2*stats.f.sf(2.5,15,20)); show("mixed chi2 21,6 p", 2*stats.chi2.sf(21.6,15), stats.chi2.ppf([.025,.975],15))
show("mixed páros 1..5", stats.ttest_1samp([1,3,2,5,4],0)); show("mixed IQ p", p2z(1.6)); show("mixed 540/1000", .04/sqrt(.25/1000), p2z(.04/sqrt(.25/1000)))
show("8.9 KI 8+8", 7.25 - stats.t.ppf(.975,14)*2.84, 7.25 + stats.t.ppf(.975,14)*2.84, "páros KI", 3-stats.t.ppf(.975,5)*sqrt(5.2/6), 3+stats.t.ppf(.975,5)*sqrt(5.2/6))
