# q2.js (ms3-35, ms3-36, ms3-37, ms3-final) – helyes és rossz válaszok ellenőrzése
import numpy as np
from scipy import stats
from itertools import combinations
def r(x,y): return np.corrcoef(x,y)[0,1]
def rho(x,y): return stats.spearmanr(x,y).statistic
def PQ(x,y):
    P=Q=0
    for i,j in combinations(range(len(x)),2):
        s=np.sign(x[i]-x[j])*np.sign(y[i]-y[j])
        P+=s>0; Q+=s<0
    return P,Q
print("== ms3-35")
print("Q1", -12/np.sqrt(16*25), 12/np.sqrt(16*25), -12/(16*25), -12/16)
print("Q3 r=-0.6", 0.36, 1-0.36)
x=[-2,-1,0,1,2]; y=[4-v*v for v in x]; print("Q5", y, r(x,y))
X=[1,2,3,4,5]; Y=[5,3,4,2,1]; print("Q6 alap r", r(X,Y))
X2=X+[15]; Y2=Y+[15]; print("Q6 +(15;15) r", r(X2,Y2))
xd=np.array([1,2,3,4,5]); yd=np.array([52,56,62,62,68])
sx_s=np.std(xd,ddof=1); sy_s=np.std(yd,ddof=1)
print("Q8 kevert", 9.5/(np.std(xd)*np.std(yd)), 7.6/(sx_s*sy_s), sx_s, sy_s, r(xd,yd), r(xd,yd)**2)
print("== ms3-36")
n=5; S=6; print("Q1", 1-6*S/(n**3-n), 1-6*S/(n**2-1), 1-6*S/n**3, 1-S/(n**3-n))
v=[3,5,5,8,8,8,10]; print("Q2", stats.rankdata(v))
x=[10,30,20,50,40]; y=[3,5,9,8,7]; rx=stats.rankdata(x); ry=stats.rankdata(y); D=rx-ry
print("Q3", rx, ry, D, (D**2).sum(), rho(x,y), "rev", 1-6*((rx-(6-ry))**2).sum()/120, "n^3", 1-6*(D**2).sum()/125, "pearson raw", r(x,y))
x=[1,2,3,4,5]; y=[3,1,2,5,4]; P,Q=PQ(x,y); print("Q4", P,Q,(P-Q)/10, P/10, (P-Q)/5, (P-Q)/20, stats.kendalltau(x,y).statistic)
print("Q5 n=6 tau=0.6: P-Q",0.6*15, "Q",(15-9)/2,"P",(15+9)/2," 30 páros Q", (30-18)/2)
x=[1,2,3,4,5]; y=[1,4,9,16,100]; print("Q8", rho(x,y), r(x,y))
print("== ms3-37")
print("Q2 A", .25*90+.75*50, "B", .75*85+.25*40, "súlyozatlan", (90+50)/2, (85+40)/2, "csere", .75*90+.25*50, .25*85+.75*40)
print("Q7 férfi", .75*70+.25*30, "nő küszöb p", (75-60)/40, "p=0.25 nő", .75*75+.25*35)
print("== ms3-final")
print("V 3x4", np.sqrt(18/(200*2)), np.sqrt(18/200), np.sqrt(18/600), 18/400)
t=np.array([[30,10],[20,40]]); a,b,c,d=t.ravel()
chi=stats.chi2_contingency(t,correction=False).statistic
print("Q", (a*d-b*c)/(a*d+b*c), "chi2", chi, "V", np.sqrt(chi/100), "(ad-bc)/ad", (a*d-b*c)/(a*d), "neg", (b*c-a*d)/(a*d+b*c))
print("oszlop%", 30/50, "sor%", 30/40, 30/100, 50/100)
g1=[1,3]; g2=[5,7]; al=g1+g2; m=np.mean(al)
K=(2*(np.mean(g1)-m)**2+2*(np.mean(g2)-m)**2)/4; B=(2*np.var(g1)+2*np.var(g2))/4
print("H", K, B, np.var(al), K/np.var(al), np.sqrt(K/np.var(al)), B/np.var(al), B/K)
x=np.array([1,2,3,4,5]); y=np.array([3,1,5,2,9]); pr=(x-x.mean())*(y-y.mean()); print("Kr", y.mean(), pr, )
p=(pr>0).sum(); q=(pr<0).sum(); print(" Kr", (p-q)/(p+q), (p-q)/5, (p+1-q)/5, p/(p+q))
print("C", 3*100*1000, 3*100)
print("r2", (12/(4*5))**2, 12/(4*5), 1-(12/20)**2, 12/(16*25))
x=[1,2,3,4,5,6]; y=[2,1,3,4,6,5]; P,Q=PQ(x,y); D=np.array(x)-np.array(y)
print("rho tau", (D**2).sum(), 1-6*(D**2).sum()/210, rho(x,y), P,Q,(P-Q)/15, P/15, (P-Q)/30, stats.kendalltau(x,y).statistic)
print("tanár A", .2*90+.8*60, "B", .8*85+.2*55)
print("Anscombe r2", 0.816**2)
print("fagyi r2", 0.94**2)
print("== ms3-final (javított változat)")
t=np.array([[35,15],[15,35]]); res=stats.chi2_contingency(t,correction=False)
a,b,c,d=t.ravel(); chi=res.statistic
print("chi2", chi, res.expected_freq.ravel(), "V", np.sqrt(chi/100), "V gyök nélkül", chi/100, "egy cella", 100/25, np.sqrt(4/100), "eltérések összege", (t-res.expected_freq).sum())
print("Q", (a*d-b*c)/(a*d+b*c), "(ad-bc)/ad", (a*d-b*c)/(a*d))
print("H2 szórás 50, belső var 900:", 1-900/2500, np.sqrt(1-900/2500), 1-30/50, 900/2500)
print("Kr=-0.4, 10 pont: q", (10+4)/2, "p", (10-4)/2)
x=[1,2,3,4,5,6]; y=[2,1,4,3,6,30]; y2=[2,1,4,3,6,300]
print("robust r", r(x,y), r(x,y2), "rho", rho(x,y), rho(x,y2))
