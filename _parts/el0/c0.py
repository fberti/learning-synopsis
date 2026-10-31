# 0. fejezet – számellenőrzés
import statistics as st
def acc(read, res, pct, dig):
    d = read*pct/100 + dig*res
    return round(d, 6), round(read-d, 6), round(read+d, 6), round(d/read*100, 3)
print("5,012 V (0,001):", acc(5.012, 0.001, 0.8, 5))
print("9,43 V (0,01):", acc(9.43, 0.01, 0.8, 5))
print("0,050 V:", acc(0.050, 0.001, 0.8, 5))
print("3,301 V:", acc(3.301, 0.001, 0.8, 5))
print("4,962 V:", acc(4.962, 0.001, 0.8, 5), "elteres 5-tol %", (4.962-5)/5*100)
print("13,6 mA (0,1):", acc(13.6, 0.1, 2.0, 5))
print("218,7 ohm (0,1):", acc(218.7, 0.1, 1.0, 5))
print("0,98 kΩ? 987,4 ohm (0,1)->range 5999? :", acc(987.4, 0.1, 1.0, 5))
print("9,87 kΩ (0,01k):", acc(9.87, 0.01, 1.0, 5))
print("230,1 V ACV (0,1):", acc(230.1, 0.1, 1.0, 5))
# színkód
C = "fekete barna piros narancs sárga zöld kék lila szürke fehér".split()
def val4(a,b,m): return (10*a+b)*10**m
def val5(a,b,c,m): return (100*a+10*b+c)*10**m
print("220 4s:", C[2],C[2],C[1], val4(2,2,1), " 5s:", val5(2,2,0,0))
print("1k:", val4(1,0,2), val5(1,0,0,1), " 10k:", val4(1,0,3), val5(1,0,0,2))
print("sárga-lila-piros:", val4(4,7,2), " narancs-narancs-barna:", val4(3,3,1), " barna-szürke-sárga:", val4(1,8,4))
print("zöld-kék-fekete-barna-barna 5s:", val5(5,6,0,1), " barna-zöld-arany(×0,1)? 4s barna-zöld-arany:", 15*0.1)
print("tűrés 220±5%:", 220*0.95, 220*1.05, " 1k±1%:", 990, 1010, " 4,7k±10%:", 4700*0.9, 4700*1.1)
# 10 db 1 kΩ (kitalált mért adat)
d = [998.2, 1003.5, 995.7, 1001.1, 999.4, 1006.0, 997.3, 1002.2, 994.8, 1000.9]
print("átlag", st.mean(d), "szórás (n-1)", st.stdev(d), "min max", min(d), max(d), "mind 1%-on belül", all(990<=x<=1010 for x in d))
# blink
for on,off in ((1000,1000),(250,250),(100,900),(500,1500)):
    T=(on+off)/1000; print("blink", on, off, "T", T, "f", 1/T, "kitöltés", on/(on+off))
# eltérés %
for p,m in ((5,4.87),(3.3,3.28),(9,9.43),(5,5.07),(1000,1006)): print("elteres", p, m, round((m-p)/p*100,2))
# 9 V elem kapacitás
print("500 mAh / 25 mA =", 500/25, "h")
print("--- vegyes")
print("14,1 mA:", acc(14.1, 0.1, 2.0, 5))
print("330 ±1%:", 330*0.99, 330*1.01, " 331,6 ohm:", acc(331.6, 0.1, 1.0, 5))
print("blink 50/150:", 0.2, 1/0.2, 50/200)
print("3,24 V:", acc(3.24, 0.001, 0.8, 5), (3.24-3.3)/3.3*100)
print("5,6k ±5%:", 5600*0.95, 5600*1.05, " 5410 ohm res 1:", acc(5410, 1, 1.0, 5))
print("4,962 also hatar %:", (4.917-5)/5*100)
print("12,9 mA:", acc(12.9,0.1,2,5), (12.9-13.6)/13.6*100, (5.07-5)/5.07*100)
print("226 ohm:", acc(226,0.1,1,5))
