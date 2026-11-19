import itertools as it, numpy as np
from scipy import stats as st
from math import sqrt
c={}
for s in it.combinations(range(1,7),3): c[sum(s)]=c.get(sum(s),0)+1
print(sorted(c.items()))
for x,y in [([12,15,18,20],[10,11,14,16]),([5,8,9],[1,2,4,6]),([3,6,7,9,12],[1,2,4,5,8]),([22,25,30],[10,12,14,18])]:
    r=st.rankdata(x+y); R=r[:len(x)].sum(); U=R-len(x)*(len(x)+1)/2
    print(x,y,"R",R,"U",U, st.mannwhitneyu(x,y,method="exact").pvalue)
c={}
for s in it.combinations(range(1,9),4): c[sum(s)]=c.get(sum(s),0)+1
print("4+4", sorted(c.items()), sum(v for k,v in c.items() if k>=24)/70)
n1,n2=20,25; E=n1*n2/2; sd=sqrt(n1*n2*(n1+n2+1)/12); print("20/25",E,sd,(320-E)/sd, 2*st.norm.sf((320-E)/sd))
print("KW", st.kruskal([7,9,11],[3,5,4],[6,8,10]), st.f_oneway([7,9,11],[3,5,4],[6,8,10]))
r=st.rankdata([7,9,11,3,5,4,6,8,10]); print(r, r[:3].sum(), r[3:6].sum(), r[6:].sum())
