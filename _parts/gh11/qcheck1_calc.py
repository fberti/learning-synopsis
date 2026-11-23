# q1.js (gh11-111..113) számainak ellenőrzése: ./run.sh qcheck1_calc.py
from common import *
from lp import *
from math import comb, log
lab=lambda G: nx.relabel_nodes(G,{i:a for i,a in enumerate(ACT)})
Gf=lab(nx.from_numpy_array(comat(ART))); G1=lab(nx.from_numpy_array(comat(FIRST))); G2=lab(nx.from_numpy_array(comat(SECOND)))
r=lambda x: round(x,3)
print("== 11.1")
print("8 csucs 10 el:", comb(8,2)-10, 8*7-10, comb(8,2), 64-10)
print("karate:", comb(34,2)-78, comb(34,2), 34*33-78, comb(34,2)-2*78)
cand=[(u,v) for u,v in itertools.combinations(ACT,2) if not G1.has_edge(u,v)]
pos=[(u,v) for u,v in cand if G2.has_edge(u,v)]
print("het eleje jelolt", len(cand), "poz", pos, "het vege elek", G2.number_of_edges())
print("teljes het jeloltjei", comb(7,2)-Gf.number_of_edges())
TUE=[a for a in ART if DAYS.index(a[2])<=1]; Gt=lab(nx.from_numpy_array(comat(TUE)))
ct=[(u,v) for u,v in itertools.combinations(ACT,2) if not Gt.has_edge(u,v)]
LATER=[a for a in ART if DAYS.index(a[2])>=2]; Gl=lab(nx.from_numpy_array(comat(LATER)))
pt=[(u,v) for u,v in ct if Gl.has_edge(u,v)]
print("kedd este: el", sorted(Gt.edges()), "jelolt", len(ct), "poz", len(pt), pt, "veletlen", r(len(pt)/len(ct)))
print("kedd este, csak a het-eleji 4 poz:", r(4/17))
# átlagfok 6: n(n-1)/2-3n >= 100*3n
f=lambda cond: next(n for n in range(2,10000) if cond(n))
print("atlagfok 6:", f(lambda n: n*(n-1)/2-3*n>=300*n), f(lambda n: n*(n-1)/2>=300*n), f(lambda n: n*(n-1)-3*n>=300*n), f(lambda n: n*(n-1)/2-6*n>=600*n))
print("== 11.2")
print("Po-Kl teljes:", {k:r(x) for k,x in heur(Gf,"Po","Kl").items()}, "osszeg:", r(1/(4+2)), "kisebb:", 1/2, "k_Po:", 1/4)
A=nx.to_numpy_array(Gf,nodelist=ACT,weight=None); A2=(A@A).astype(int); print("A2 Vi sor", A2[1], "Vi szomszedai", sorted(Gf["Vi"]))
H=nx.Graph([("A","C"),("A","D"),("B","C"),("B","D"),("C","E"),("C","F")])
h=heur(H,"A","B"); print("kis graf A-B:", {k:r(x) for k,x in h.items()}, dict(H.degree()))
print("  AA rossz: lg10", r(1/math.log10(4)+1/math.log10(2)), "par foka", r(2/log(2)), "log nelkul", r(1/4+1/2))
print("  RA rossz: par foka", 1/2+1/2, "1/(4+2)", r(1/6))
print("hub vs szuk: X CN1 k=3: AA", r(1/log(3)), "RA", r(1/3), "| Y CN3 k=12: AA", r(3/log(12)), "RA", r(3/12))
deg1=dict(G1.degree()); pa=sorted(((deg1[u]*deg1[v],u,v) for u,v in cand), reverse=True); print("PA tanito:", pa[:5], "Vi-Po", deg1["Vi"]*deg1["Po"])
print("CN=0 teljes:", [(u,v) for u,v in itertools.combinations(ACT,2) if not Gf.has_edge(u,v) and heur(Gf,u,v)["CN"]==0],
      "tav", {(u,v):nx.shortest_path_length(Gf,u,v) for u,v in [("La","Sz"),("La","Kl"),("Ön","Sz"),("Ön","Kl")]})
for u,v in [("Ko","La"),("Vi","Kl"),("Po","Kl")]: print("  CN",u,v,heur(Gf,u,v)["CN"])
print("30/20 vs 3/3: J", r(3/(30+20-3)), r(2/(3+3-2)), "PA", 600, 9)
print("tanito Kl PA:", [deg1["Kl"]*deg1[x] for x in ACT if x!="Kl"])
print("== 11.3")
sc={m:{(u,v):heur(G1,u,v)[m] for u,v in cand} for m in ["CN","J","AA","RA","PA"]}
for m in sc: print(m, "AUC", r(auc([sc[m][p] for p in pos],[sc[m][q] for q in cand if q not in pos])))
def prec(m,k):
    s=sc[m]; vals=sorted(set(s.values()),reverse=True); tp=0; taken=0
    for v in vals:
        grp=[c for c in cand if s[c]==v]; pg=sum(c in pos for c in grp)
        t=min(len(grp),k-taken); tp+=t*pg/len(grp); taken+=t
        if taken==k: break
    return tp/k, tp/len(pos)
for m,k in [("AA",3),("AA",5),("J",4),("J",3),("J",1),("CN",5),("CN",2)]: print(" P/R@",k,m,[r(x) for x in prec(m,k)])
print("  AA@3 kedvezo", r(2/3), "kedvezotlen", r(1/3))
P=[.8,.5,.2]; N=[.6,.5,.1]; a=auc(P,N); print("kezi AUC", r(a), a*9, "holtv=1", r(6/9), "holtv=0", r(5/9), "1-AUC", r(1-a))
cp=[sc["CN"][p] for p in pos]; cq=[sc["CN"][q] for q in cand if q not in pos]
w=sum(p>q for p in cp for q in cq); t=sum(p==q for p in cp for q in cq); print("CN gyozelem", w, "holtv", t, r((w+t/2)/44), r(w/44), r((w+t)/44))
print("PA fordított", r(1-auc([sc["PA"][p] for p in pos],[sc["PA"][q] for q in cand if q not in pos])))
TP=.6*10000; FP=.02*990000; print("precizitas", TP, FP, r(TP/(TP+FP)), r(TP/FP), r(FP/(TP+FP)))
scL={m:{(u,v):heur(Gf,u,v)[m] for u,v in cand} for m in ["CN","J","AA","RA","PA"]}
for m in scL: print(m, "szivargo AUC", r(auc([scL[m][p] for p in pos],[scL[m][q] for q in cand if q not in pos])))
print("karate szivargas novekmeny: CN", r(.698-.691), "J", r(.565-.610), "PA", r(.852-.711), "spektr2D", r(.820-.598), "RA", r(.754-.738))
print("== szöveghibák")
from collections import Counter
print("teljes het CN eloszlas:", Counter(heur(Gf,u,v)["CN"] for u,v in itertools.combinations(ACT,2) if not Gf.has_edge(u,v)))
print("Vi-Kl AA pontosan:", 1/log(4)+1/log(3))
print("szerdatol elek:", sorted(Gl.edges()), len(Gl.edges()))
