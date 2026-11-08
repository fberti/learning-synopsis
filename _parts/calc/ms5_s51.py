import itertools as it
from fractions import Fraction as F
pop=[2,4,6,8,10]
mn=[min(a,b) for a,b in it.combinations(pop,2)]; print("min wo",sorted(mn),F(sum(mn),10))
q4=[F(sum(c),4) for c in it.combinations(pop,4)]; print("n4",q4)
print("sport 1,3,5 n2 wo",[F(a+b,2) for a,b in it.combinations([1,3,5],2)])
wr=[F(a+b,2) for a,b in it.product(pop,repeat=2)]
print("P>=8 wr",F(sum(1 for x in wr if x>=8),25),"P=6",F(sum(1 for x in wr if x==6),25))
d=[F(a+b,2) for a,b in it.product(range(1,7),repeat=2)]; print("dice 3.5",F(sum(1 for x in d if x==F(7,2)),36))
rg=[abs(a-b) for a,b in it.product(pop,repeat=2)]; print("Erange wr",F(sum(rg),25))
mxr=[max(a,b) for a,b in it.product(pop,repeat=2)]; print("Emax wr",F(sum(mxr),25))
s2o=[F((a-b)**2,2) for a,b in it.combinations(pop,2)]; print("s2 wo dist",sorted(s2o),"E",sum(s2o)/10)
# (max+min)/2 midrange wo n2 = mean for n=2. 
# P(xbar>=8) wo
wo=[F(a+b,2) for a,b in it.combinations(pop,2)]; print("P>=8 wo",F(sum(1 for x in wo if x>=8),10),"P<5",F(sum(1 for x in wo if x<5),10))
