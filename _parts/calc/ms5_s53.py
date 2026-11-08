import numpy as np, math
from scipy import stats
d=np.ones(6)/6; p3=np.convolve(np.convolve(d,d),d); print([round(x*216) for x in p3])
print("q1",1-stats.norm.cdf(1.5),"q2",2*stats.norm.cdf(1)-1)
se=math.sqrt(35/12)/10; print("q3 se",se, 2*stats.norm.cdf(0.2/se)-1)
print("q4", 1.96*3, 100-5.88, 100+5.88)
print("q5", (1.96*5)**2)
print("exp q2", 2/math.sqrt(50), 1-stats.norm.cdf(0.5/(2/math.sqrt(50))), "exact", stats.gamma.sf(2.5,a=50,scale=2/50))
print("bulb", 1-stats.norm.cdf(10/(100/math.sqrt(50))), stats.gamma.sf(110,a=50,scale=2))
print("dice30 z", 0.5/(math.sqrt(35/12)/math.sqrt(30)))
# exact P(xbar>=4) n30 already 0.0607
for n in [5,30,100]: print(n, stats.gamma.sf(120,a=n,scale=100/n), 1-stats.norm.cdf(20/(100/math.sqrt(n))), 2/math.sqrt(n))
