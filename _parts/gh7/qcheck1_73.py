# gh7-73 kvíz számainak ellenőrzése
import math, networkx as nx
# 1. gamma=3, p30/p10
print("Q1", 3**3, "gamma-1", 3**2, "duplázás", 2**3)
# 2. preferenciális esély, fokszámok 4,3,2,1
d=[4,3,2,1]; print("Q2", 4/sum(d), "1/n", 1/len(d), "k/n", 4/len(d), "1/sum", 1/sum(d))
# 3. k_i(t), m=3, t=10000, t_i=400
m,t,ti=3,10000,400
print("Q3", m*math.sqrt(t/ti), "lineáris", m*t/ti, "m nélkül", math.sqrt(t/ti), "fordított", m*math.sqrt(ti/t))
# 4. ML kézzel: 3,3,5,10, kmin=3
ks=[3,3,5,10]; km=3
s=sum(math.log(k/(km-0.5)) for k in ks); print("Q4 sum", s, "gamma", 1+len(ks)/s, "+1 nélkül", len(ks)/s)
s2=sum(math.log(k/km) for k in ks); print("Q4 1/2 nélkül", s2, 1+len(ks)/s2)
s3=sum(math.log10(k/(km-0.5)) for k in ks); print("Q4 log10", 1+len(ks)/s3)
# 6. barátság-paradoxon: élek AB, AC, AD, BC, DE
G=nx.Graph([("A","B"),("A","C"),("A","D"),("B","C"),("D","E")])
k=[d for _,d in G.degree()]; n=len(k)
k1=sum(k)/n; k2=sum(x*x for x in k)/n; var=k2-k1**2
print("Q6 fok", dict(G.degree()), "<k>", k1, "<k2>", k2, "arány", k2/k1, "<k>+Var", k1+var)
# élvégekből közvetlenül
ends=[G.degree(v) for e in G.edges() for v in e]; print("Q6 élvég-átlag", sum(ends)/len(ends))
# 7. multi: BA m=2 <k>=2m; p_k
pk=lambda k,m: 2*m*(m+1)/(k*(k+1)*(k+2))
print("txt BA m=2", pk(2,2), pk(3,2), pk(4,2), "m=1", pk(1,1), pk(2,1), pk(3,1))
print("txt k_i", 2*math.sqrt(10000/100), 2*math.sqrt(10000), math.sqrt(1000/10), math.sqrt(4000/10))
# szöveg: duplázás, gamma=2, ML példák, barátság
c=6/math.pi**2; print("txt c", c, c/100, c/1e4, 1e6*c/1e4, "2^2.5", 2**2.5, "10^2.5", 10**2.5)
for ks,km in [([2,2,3,4,8],2),([4,4,9],4)]:
    s=sum(math.log(k/(km-0.5)) for k in ks); print("txt ML", ks, round(s,3), round(1+len(ks)/s,3))
print("txt csillag", 1.6, (16+4)/8, "10 levél", 110/20, 20/11, "Árvízhét", 20/7, 62/20, "út", 10/6, "szórás", 10+100/10)
from scipy.stats import poisson
print("txt Poisson", poisson.pmf(20,10)/poisson.pmf(10,10), poisson.pmf(40,10)/poisson.pmf(20,10), poisson.sf(24,10), "ER >=100 db", 1222*poisson.sf(99,27.4))
print("txt BA kontrol: első lépés esélyek", [2/6]*3, [3/8,2/8,2/8,1/8])
