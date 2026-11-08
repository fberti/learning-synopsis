import itertools as it, statistics as st, math
from fractions import Fraction as F
pop=[2,4,6,8,10]
def ev(f, n, rep=True):
    S=list(it.product(pop,repeat=n)) if rep else list(it.combinations(pop,n))
    v=[F(f(s)) if not isinstance(f(s),float) else f(s) for s in S]
    E=sum(v)/len(v); V=sum((x-E)**2 for x in v)/len(v); return E,V,len(v)
n=3
for name,f in [("mean",lambda s:F(sum(s),3)),("median",lambda s:sorted(s)[1]),("midrange",lambda s:F(min(s)+max(s),2)),("X1",lambda s:s[0])]:
    E,V,N=ev(f,3); print(name,E,V,float(V))
# s2 and sigmahat2, n=2 wr
for n in [2,3]:
    S=list(it.product(pop,repeat=n))
    s2=[F(sum((x-F(sum(s),n))**2 for x in s),n-1) for s in S]; sh=[F(sum((x-F(sum(s),n))**2 for x in s),n) for s in S]
    E1=sum(s2)/len(S); E2=sum(sh)/len(S)
    V1=sum((x-E1)**2 for x in s2)/len(S); V2=sum((x-E2)**2 for x in sh)/len(S)
    print("n",n,"E s2",E1,"E sh",E2,"Var s2",V1,float(V1),"Var sh",V2,float(V2),"MSE s2",float(V1),"MSE sh",float(V2+(E2-8)**2))
    es=sum(math.sqrt(x) for x in s2)/len(S); print(" E(s)",es,"sigma",math.sqrt(8))
