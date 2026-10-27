# Ellenőrzés: a 3.5–3.8 (és néhány 3.1–3.4) tananyagbeli szám
import numpy as np
from scipy import stats
def r(x,y): return np.corrcoef(x,y)[0,1]
def rho(x,y): return stats.spearmanr(x,y).statistic
def tau(x,y): return stats.kendalltau(x,y).statistic
x5=[1,2,3,4,5]; y5=[52,56,62,62,68]
print("5 diák r", r(x5,y5), "sx",np.std(x5),"sy",np.std(y5), "C", np.mean((np.array(x5)-3)*(np.array(y5)-60)))
zx=(np.array(x5)-3)/np.std(x5); zy=(np.array(y5)-60)/np.std(y5); print("z", zx.round(3), zy.round(3), (zx*zy).round(3))
xc=np.array([1.3,1.5,1.4,1.8,1.9,2.2,2.5,2.4,2.8,3.2]); yc=np.array([18,19,21,23,25,27,30,34,39,44])
dx=xc-xc.mean(); dy=yc-yc.mean()
print("10 cég", xc.mean(), yc.mean(), (dx*dy).sum(), (dx**2).sum(), (dy**2).sum(), np.std(xc), np.std(yc), r(xc,yc), r(xc,yc)**2)
print(" rho", rho(xc,yc), "tau", tau(xc,yc), "ranks", stats.rankdata(xc), stats.rankdata(yc))
print(" 4.82/(0.598*8.258)", 4.82/(0.598*8.258), 48.2/np.sqrt(3.58*682))
print("parabola", r([-2,-1,0,1,2],[4,1,0,1,4]))
a=[(1,3),(2,1),(3,4),(4,2),(5,3)]
X=[p[0] for p in a]; Y=[p[1] for p in a]
print("pont teremt", r(X,Y), r(X+[12],Y+[12]), "rho", rho(X+[12],Y+[12]), rho(X,Y))
b=[(1,2),(2,3),(3,5),(4,5),(5,7),(6,8),(7,9),(8,11)]
X=[p[0] for p in b]; Y=[p[1] for p in b]
print("pont rombol", r(X,Y), r(X+[9],Y+[0]), "rho", rho(X+[9],Y+[0]))
print("prakt 3.5", 3/(2*4), r([1,2,3],[2,4,9]), 7/np.sqrt(52))
print("-0.85^2", .85**2)
# 3.6
print("süti rho", rho([1,2,3,4],[1,3,2,4]), 1-12/60, "tau", tau([1,2,3,4],[1,3,2,4]))
print("10 cég rho képlet", 1-24/990, "tau", 41/45)
xw=[7,8,8,6,9,5]; yw=[6,9,7,7,8,4]
rx=stats.rankdata(xw); ry=stats.rankdata(yw); print("bor", rx, ry, r(rx,ry), ((rx-ry)**2).sum(), 1-6*((rx-ry)**2).sum()/210)
xs=np.arange(1,7); print("2^x r", r(xs,2.0**xs), "rho", rho(xs,2.0**xs), "tau", tau(xs,2.0**xs))
print("x^3 r", r([1,2,3,4],[1,8,27,64]))
print("matek-fiz", rho([62,75,48,90,81],[58,70,55,85,88]), tau([62,75,48,90,81],[58,70,55,85,88]))
print("prakt rho", rho([1,2,3,4,5],[2,1,4,3,5]), tau([1,2,3,4,5],[2,1,4,3,5]), 1-60/210)
print("U rho", rho([-2,-1,0,1,2],[4,1,0,1,4]))
# 3.7 fagyi
T=np.array([-1,1,6,12,17,21,23,22,18,11,5,0]); F=np.array([3,2,9,20,38,44,47,41,35,18,8,4]); D=np.array([0,1,0,2,5,7,5,7,6,3,1,0])
print("fagyi rFD", r(F,D), "rTF", r(T,F), "rTD", r(T,D))
s=[4,5,6,7,8]; w=[0,1,2,10,11]
print(" nyár", r(F[s],D[s]), "tél", r(F[w],D[w]), F[s].mean(), D[s].mean())
print(" 3.8", F.mean(), D.mean(), np.mean((F-F.mean())*(D-D.mean())), np.std(F), np.std(D), r(F,D)**2, "rho", rho(F,D), "tau", tau(F,D))
# Berkeley
M=[(512,825),(353,560),(120,325),(138,417),(53,191),(22,373)]; W=[(89,108),(17,25),(202,593),(131,375),(94,393),(24,341)]
print("Berk", sum(a for a,b in M), sum(b for a,b in M), sum(a for a,b in M)/sum(b for a,b in M), sum(a for a,b in W), sum(b for a,b in W), sum(a for a,b in W)/sum(b for a,b in W))
print(" szak arányok", [round(a/b*100,1) for a,b in M], [round(a/b*100,1) for a,b in W])
print(" AB", (108+25)/1835, (825+560)/2691)
print("simpson", .8*60+.2*20, .2*65+.8*25, .2*95+.8*70, .8*90+.2*60, (65-52)/40)
# 3.4 Kr példa
print("Kr r", r([1,2,3,4],[1,2.6,2.4,4]))
# 3.7-b: két független bolyongás (50 lépés) – hány %-ban |r| > 0,5? és független zajnál?
rng=np.random.default_rng(1)
def frac(walk, n=50, N=20000):
    a=rng.normal(size=(N,n)); b=rng.normal(size=(N,n))
    if walk: a=a.cumsum(1); b=b.cumsum(1)
    a=a-a.mean(1,keepdims=True); b=b-b.mean(1,keepdims=True)
    rr=(a*b).sum(1)/np.sqrt((a*a).sum(1)*(b*b).sum(1)); return (abs(rr)>0.5).mean()
print("bolyongás |r|>0,5:", frac(True), " zaj:", frac(False))
# 10-end.html vegyes gyakorló feladatok
def chi(t): return stats.chi2_contingency(np.array(t),correction=False).statistic
c=chi([[45,15],[30,30]]); print("V1", c, np.sqrt(c/120), (45*30-15*30)/(45*30+15*30))
g=[[12,14,16],[15,17,19,21],[20,22,24]]; al=sum(g,[]); m=np.mean(al)
K=sum(len(x)*(np.mean(x)-m)**2 for x in g)/len(al); B=sum(len(x)*np.var(x) for x in g)/len(al)
print("V2", B, K, np.var(al), K/np.var(al), np.sqrt(K/np.var(al)))
print("V3", -24/np.sqrt(16*64), 0.75**2)
x=[1,2,3,4,5,6]; y=[2,1,3,6,4,5]; print("V4", rho(x,y), tau(x,y))
print("V9", .2*2+.8*6, .8*3+.2*8)
c=chi([[30,50,20],[10,30,60]]); print("V10", c, np.sqrt(c/200))
# 3.3 NGA 7.9
g=[[25,30,28,32,29],[23,24,28,25,25,22,29,24,27],[21,26,20,23,23,22]]; al=sum(g,[]); m=np.mean(al)
K=sum(len(x)*(np.mean(x)-m)**2 for x in g)/len(al); B=sum(len(x)*np.var(x) for x in g)/len(al)
print("NGA7.9", [np.mean(x) for x in g], m, K, B, np.var(al), K/np.var(al), np.sqrt(K/np.var(al)), [np.var(x) for x in g])
