import math, statistics as st, itertools as it
from fractions import Fraction as F
pop=[2,4,6,8,10]
for n in range(1,6):
    wr=[F(sum(c),n) for c in it.product(pop,repeat=n)]; wo=[F(sum(c),n) for c in it.combinations(pop,n)]
    vr=sum((x-6)**2 for x in wr)/len(wr); vo=sum((x-6)**2 for x in wo)/len(wo)
    print(n, vr, float(vr), math.sqrt(vr), vo, float(vo), math.sqrt(vo), "fpc", F(8,n)*F(5-n,4))
print(12/6, 50/8, math.sqrt(50/8), 10*math.sqrt(35/12))
print("sqrt2", 1/math.sqrt(2))
print("fpc N500", 10/10*math.sqrt(400/499), "N200", 8/math.sqrt(50)*math.sqrt(150/199), "N2000", 50/20*math.sqrt(1600/1999))
print("N5 n3", math.sqrt(8)/math.sqrt(3)*math.sqrt(2/4))
print("HU", math.sqrt((8e6-1000)/(8e6-1)), "US", math.sqrt((260e6-1000)/(260e6-1)), "1%", math.sqrt(0.99*1e4/(1e4-1)))
for x in ([3,5,7,9],[4,6,8],[4,8],[6,6]): print(x, st.stdev(x), st.stdev(x)/math.sqrt(len(x)))
print((12/1.5)**2)
