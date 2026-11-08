# ms7 7.5-7.9 szöveg számainak ellenőrzése (q2 kvízíráshoz)
from itertools import combinations
from collections import Counter
from math import comb, sqrt
from scipy import stats
import numpy as np
N=stats.norm
# 7.6 hat diák
d=[7,9,11,3,5,4]; c=Counter()
for g in combinations(range(6),3):
    a=[d[i] for i in g]; b=[d[i] for i in range(6) if i not in g]
    c[round(np.mean(a)-np.mean(b),2)]+=1
print("perm6", sorted(c.items()), sum(c.values()))
# 8+8
A=[72,75,78,80,81,83,85,90]; B=[65,68,70,72,74,76,79,82]; al=A+B; obs=np.mean(A)-np.mean(B)
cnt=0; tot=0; S=sum(al)
for g in combinations(range(16),8):
    sa=sum(al[i] for i in g); diff=sa/8-(S-sa)/8; tot+=1
    if diff>=obs-1e-9: cnt+=1
print("perm16",obs,cnt,tot,cnt/tot,2*cnt/tot)
print("t one-sided", stats.ttest_ind(A,B,alternative='greater').pvalue)
# konzerv
se=13.27/sqrt(15); t=(398-400)/se; print("konzerv t",t,2*stats.t.sf(abs(t),14), 398-stats.t.ppf(.975,14)*se, 398+stats.t.ppf(.975,14)*se)
# joghurt
se=4/sqrt(20); print("jog se",se, 196-1.96*se,196+1.96*se,196-2.576*se,196+2.576*se, (196-200)/se)
print("z 0.97,0.985", N.ppf(.97), N.ppf(.985))
# 7.7
print(1-.95**20, 1-.9975**20, 1-.95**5, 1-.95**10, 1-.95**12, .05/12, 1-.99**10)
# 7.8
z=0.1/(15/1000); print("iq",z,2*N.sf(z), 0.1/15)
z=0.001/sqrt(.25/1e7); print("coin",z,2*N.sf(z))
# A/B
p1,p2=.10,.17; pp=54/400; se=sqrt(pp*(1-pp)*(2/200)); z=.07/se; print("AB",se,z,2*N.sf(z))
se2=sqrt(p1*(1-p1)/200+p2*(1-p2)/200); print("AB KI",.07-1.96*se2,.07+1.96*se2)
print("fisher AB", stats.fisher_exact([[34,166],[20,180]]).pvalue)
# vegyes perm 2,3,10 vs 6,7,8
d=[2,3,10,6,7,8]; print("vegyes", sum(1 for g in combinations(d,3) if sum(g)>=21), [g for g in combinations(d,3) if sum(g)>=21])
print("power d.3 n64", N.sf(1.645-0.3*8))
print("tea12", 1/924, 37/924, comb(6,5)*comb(6,1))
# Wilson 7/10
z=1.96;n=10;ph=.7; cen=(ph+z*z/(2*n))/(1+z*z/n); h=z*sqrt(ph*(1-ph)/n+z*z/(4*n*n))/(1+z*z/n); print("wilson",cen-h,cen+h)
print("cc", 2*N.sf(1.9), 2*N.sf(2))
print("fisher AB one-sided", stats.fisher_exact([[34,166],[20,180]],alternative='greater').pvalue)
print("C(60,30)", comb(60,30))
