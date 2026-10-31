# el0-final – a kvíz összes számának ellenőrzése
import statistics as st
def acc(read, res, pct, n=5):
    d = read*pct/100 + n*res
    return round(d, 6), round(read-d, 4), round(read+d, 4), round(d/read*100, 3)
C = dict(fekete=0, barna=1, piros=2, narancs=3, sarga=4, zold=5, kek=6, lila=7, szurke=8, feher=9)
def v4(a, b, m): return (10*C[a]+C[b]) * 10**C[m]
def v5(a, b, c, m): return (100*C[a]+10*C[b]+C[c]) * 10**C[m]

print("Q1 két LED egy lábon:", 2*13.6, "> 20 ?", 2*13.6 > 20, "< 40 ?", 2*13.6 < 40)

print("Q5 2,500 V helyes:", acc(2.5, 0.001, 0.8))
print("   csak %-tag:", 2.5*0.008)
print("   % a méréshatárra (5,999):", 5.999*0.008 + 0.005)
print("   rossz felbontás 0,01:", 2.5*0.008 + 5*0.01)

print("Q6 4,790 V helyes:", acc(4.79, 0.001, 0.8), "alsó > 4,75?", 4.79 - acc(4.79,0.001,0.8)[0] > 4.75)
d = 4.79*0.008; print("   csak %-tag:", d, 4.79-d, 4.79+d, "alsó > 4,75?", 4.79-d > 4.75)
print("   rossz felbontás 0,01:", acc(4.79, 0.01, 0.8))
print("   kijelzett - 4,75 =", round(4.79-4.75, 4))

print("Q7 sárga-lila-narancs:", v4('sarga','lila','narancs'), " szorzó mint 3. jegy: 473",
      " piros szorzó (eggyel kevesebb):", v4('sarga','lila','piros'), " sárga szorzó:", v4('sarga','lila','sarga'))

R = v5('narancs','narancs','fekete','barna'); print("Q8 névleges:", R)
print("   ±1% sáv:", R*0.99, R*1.01, "3360 benne?", R*0.99 <= 3360 <= R*1.01)
print("   ±5% sáv:", R*0.95, R*1.05, "3360 benne?", R*0.95 <= 3360 <= R*1.05)
print("   ±1% a mértre:", 3360*0.99, 3360*1.01)
r4 = v4('narancs','narancs','fekete'); print("   4 sávosként (narancs-narancs-fekete):", r4, r4*0.99, r4*1.01)

print("Q9 barna-piros-fekete-barna-barna:", v5('barna','piros','fekete','barna'),
      " fordítva barna-barna-fekete-piros-barna:", v5('barna','barna','fekete','piros'),
      " 4 sávosként:", v4('barna','piros','fekete'), " szorzó nélkül:", 120)
E12 = [10,12,15,18,22,27,33,39,47,56,68,82]
def ise12(x):
    while x >= 100: x /= 10
    while x < 10: x *= 10
    return round(x, 6) in E12
for x in (1200, 11000, 12, 120): print("   E12?", x, ise12(x))

on, off = 200, 600; T = (on+off)/1000
print("Q10 T", T, "f", 1/T, "kitöltés", on/(on+off), " t_be/t_ki", on/off, " f=T:", T, " csak t_be:", 1/(on/1000))

print("Q11 3.3V max 50 mA; két LED", 2*13.6)

print("Q14 eltérés:", (7.2-9)/9*100, " mérttel osztva:", (7.2-9)/7.2*100, " fordított előjel:", (9-7.2)/9*100, " különbség V:", 7.2-9)

print("Q16 5,071 V:", acc(5.071, 0.001, 0.8), " eltérés %:", (5.071-5)/5*100)
print("   rossz felbontás 0,01:", acc(5.071, 0.01, 0.8))
print("   0,8% + 5% =", 0.8+5, "(digit %-nak véve)")
print("   csak %-tag:", 5.071*0.008, 5.071-5.071*0.008)
print("   kijelzett - 5 =", round(5.071-5, 4))

print("--- szöveg ellenőrzése")
dd = [998.2, 1003.5, 995.7, 1001.1, 999.4, 1006.0, 997.3, 1002.2, 994.8, 1000.9]
print("L0.2 átlag", st.mean(dd), "szórás", st.stdev(dd), st.stdev(dd)/st.mean(dd)*100, "%")
print("07 naplósor 4,87 V:", acc(4.87, 0.001, 0.8), (4.87-5)/5*100)
print("07 12,9 mA:", acc(12.9, 0.1, 2.0), " 13,6 mA:", acc(13.6, 0.1, 2.0))
print("0.8 4,962:", acc(4.962, 0.001, 0.8), (4.962-5)/5*100, " alsó határ eltérése:", (4.917-5)/5*100)
print("0.3 9,87 kΩ (10 Ω):", acc(9870, 10, 1.0), " 10k ±1%:", 9900, 10100, " ±5%:", 9500, 10500)
print("0.4 gyak. arany-piros-barna-fekete-barna fordítva:", v5('barna','fekete','barna','piros'))
print("vegyes 0,993 kΩ:", acc(993, 1, 1.0), " 5,41 kΩ:", acc(5410, 1, 1.0), " 3,24 V:", acc(3.24, 0.001, 0.8), " 331,6:", acc(331.6, 0.1, 1.0), " 14,1:", acc(14.1, 0.1, 2.0))
print("226 Ω:", acc(226, 0.1, 1.0), " 500/70 =", 500/70, " 5,012:", acc(5.012,0.001,0.8), " 1,000:", acc(1.0,0.001,0.8))
