# q2 kvíz (11.4–11.6, fejezetzáró) számainak ellenőrzése: ./run.sh qcheck2_calc.py
from common import *
from lp import *
import math
def r(x,d=3): return round(float(x),d)
print("== 11.4 ==")
P4=nx.path_graph([1,2,3,4]); Z,w=spectral(P4,2,[1,2,3,4]); print("út4 mu",[r(x) for x in w])
s=1 if Z[1][0]>0 else -1; t=1 if Z[1][1]>0 else -1
Z={k:np.array([s*v[0],t*v[1]]) for k,v in Z.items()}; print("út4 Z",{k:[r(x) for x in v] for k,v in Z.items()})
d=lambda a,b: r(np.linalg.norm(Z[a]-Z[b]))
print("1-2",d(1,2),"1-3",d(1,3),"1-4",d(1,4),"2-4",d(2,4),"2-3",d(2,3))
print("energia 2D",r(sum(np.sum((Z[a]-Z[b])**2) for a,b in P4.edges())),"mu2+mu3",r(w[1]+w[2]),"mu3+mu4",r(w[2]+w[3]),"trace",r(sum(w)))
G=nx.Graph(); G.add_nodes_from(ACT); M=comat(ART)
for i in range(7):
    for j in range(i+1,7):
        if M[i,j]: G.add_edge(ACT[i],ACT[j])
Zs,ws=spectral(G,2,ACT); sg=np.sign(Zs["Ko"]); Zs={k:v*sg for k,v in Zs.items()}
print("teljes hét mu",[r(x) for x in ws]); print({k:[r(x) for x in v] for k,v in Zs.items()})
cand=[(a,b) for a,b in itertools.combinations(ACT,2) if not G.has_edge(a,b)]
dd=sorted((r(np.linalg.norm(Zs[a]-Zs[b])),a+"-"+b) for a,b in cand); print("jelölt távolságok",dd)
print("La-Ön",r(np.linalg.norm(Zs["La"]-Zs["Ön"])),"Ko-Vi",r(np.linalg.norm(Zs["Ko"]-Zs["Vi"])))
print("fokszám",dict(G.degree()))
for a,b in [("Vi","Kl"),("Po","Sz")]: print(a,b,heur(G,a,b))
# két komponens A-B, B-C, D-E
H=nx.Graph([("A","B"),("B","C"),("D","E")]); print("A-B,B-C,D-E mu",[r(x) for x in np.linalg.eigvalsh(nx.laplacian_matrix(H).toarray())])
S=nx.star_graph(4); print("csillag4 mu",[r(x) for x in np.linalg.eigvalsh(nx.laplacian_matrix(S).toarray())])
S3=nx.star_graph(3); print("csillag3 mu",[r(x) for x in np.linalg.eigvalsh(nx.laplacian_matrix(S3).toarray())])
# csillag4: 2D távolság két levél között nem egyértelmű – két véletlen bázis
L=nx.laplacian_matrix(S,nodelist=range(5)).toarray().astype(float); wv,V=np.linalg.eigh(L); B=V[:,1:4]
rs=np.random.RandomState(1)
for k in range(3):
    Q,_=np.linalg.qr(rs.randn(3,3)); Z2=(B@Q)[:,:2]
    print(" csillag4 2D lev1-lev2 %.3f lev1-lev3 %.3f lev3-lev4 %.3f"%(np.linalg.norm(Z2[1]-Z2[2]),np.linalg.norm(Z2[1]-Z2[3]),np.linalg.norm(Z2[3]-Z2[4])))
Z3=B; print(" csillag4 3D levéltávolságok",[r(np.linalg.norm(Z3[i]-Z3[j])) for i,j in itertools.combinations(range(1,5),2)])
print("== 11.5 ==")
wk=list("ABDEDBC")
def pairs(wk,w):
    return [(wk[i],wk[j]) for i in range(len(wk)) for j in range(max(0,i-w),min(len(wk),i+w+1)) if j!=i]
p1=pairs(wk,1); p2=pairs(wk,2); print("±1",len(p1),"±2",len(p2))
from collections import Counter
c2=Counter(frozenset(p) for p in p2); print("±2 rendezetlen",{"".join(sorted(k)) if len(k)==2 else "DD":v for k,v in c2.items()})
F=nx.Graph([("A","B"),("A","C"),("B","C"),("B","D"),("D","E")])
print("±2 nem él párok",sorted({"".join(sorted(k)) for k in c2 if len(k)==2 and not F.has_edge(*k)}))
npairs=lambda l,w: 2*sum(l-j for j in range(1,w+1))
print("párszám 6,±2",npairs(6,2),"egy irány",npairs(6,2)//2,"2wl",2*2*6,"±1",npairs(6,1))
print("párszám 8,±3",npairs(8,3),"egy irány",npairs(8,3)//2,"2wl",2*3*8,"elcsúszás",2*sum(8-j+1 for j in range(1,4)))
print("ellenőrzés len(pairs)",len(pairs(list("ABCDEF"),2)),len(pairs(list("ABCDEFGH"),3)))
Cu=Counter(a for a,b in p1); Cuv=Counter(p1); S1=len(p1); print("Cu",dict(Cu))
pmi=lambda a,b: math.log(Cuv[(a,b)]*S1/(Cu[a]*Cu[b]))
print("PMI DE",r(pmi("D","E")),"AB",r(pmi("A","B")),"BD",r(pmi("B","D")),"arány DE",Cuv[("D","E")]*S1/(Cu["D"]*Cu["E"]),"log(C/(CuCv))",r(math.log(2/8)))
print("SGNS PMI ln10, b=5:",r(math.log(10)-math.log(5)),"ln10",r(math.log(10)),"ln50",r(math.log(50)))
def n2v(G,t,v,p,q):
    nb=list(G[v]); ws=[1/p if x==t else (1 if G.has_edge(x,t) else 1/q) for x in nb]; S=sum(ws)
    return {x:r(wt/S) for x,wt in zip(nb,ws)}
print("A->B p1 q.5",n2v(F,"A","B",1,.5),"swap",n2v(F,"A","B",.5,1),"q mint súly",n2v(F,"A","B",1,2))
print("Ko->Po p1 q2",n2v(G,"Ko","Po",1,2),"q.5",n2v(G,"Ko","Po",1,.5),"DW",n2v(G,"Ko","Po",1,1))
print("Vi->Ko p2 q.5",n2v(G,"Vi","Ko",2,.5),"swap",n2v(G,"Vi","Ko",.5,2),"DW",n2v(G,"Vi","Ko",1,1),"q súlyként",n2v(G,"Vi","Ko",2,2))
print("Sz->Ko p1 q.25",n2v(G,"Sz","Ko",1,.25))
print("== 11.6 ==")
T=nx.Graph(); T.add_nodes_from(ACT)
for a in FIRST:
    for x,y in itertools.combinations(a[3],2): T.add_edge(x,y)
cT=[(a,b) for a,b in itertools.combinations(ACT,2) if not T.has_edge(a,b)]
pos=[(a,b) for a,b in cT if any(a in x[3] and b in x[3] for x in SECOND)]; print("jelölt",len(cT),"pozitív",pos)
for m in ["CN","J","AA","RA","PA"]:
    sc={e:heur(T,*e)[m] for e in cT}; print(m,r(auc([sc[e] for e in pos],[sc[e] for e in cT if e not in pos])),
        "nyert",auc([sc[e] for e in pos],[sc[e] for e in cT if e not in pos])*44)
nk=[e for e in cT if "Kl" not in e]; pk=[e for e in nk if e in pos]; ng=[e for e in nk if e not in pos]
sc={e:heur(T,*e)["CN"] for e in nk}
print("Kl nélkül",len(nk),len(pk),len(ng),"CN AUC",r(auc([sc[e] for e in pk],[sc[e] for e in ng])),
      "holtv=0",r(sum(sc[p]>sc[n] for p in pk for n in ng)/14),"holtv=1",r(sum(sc[p]>=sc[n] for p in pk for n in ng)/14))
print("egy pozitív helye: 11/44 =",r(11/44),"1/44",r(1/44),"1/11",r(1/11))
cl={"CN":(.691,.698),"J":(.610,.565),"AA":(.728,.738),"RA":(.738,.754),"PA":(.711,.852),"spec2":(.598,.820),"spec8":(.537,.859),"ppmi":(.705,.888),"n2v":(.748,.851)}
print("szivárgási nyereség",{k:r(b-a) for k,(a,b) in cl.items()}); print("szivárgó sorrend",sorted(cl,key=lambda k:-cl[k][1]))
print("== final ==")
print("1000×10: él",1000*10//2,"pár",math.comb(1000,2),"jelölt",math.comb(1000,2)-5000,"rendezett",1000*999-10000,"n(n-1)",1000*999)
SEC=nx.Graph(); [SEC.add_edge(x,y) for a in SECOND for x,y in itertools.combinations(a[3],2)]
print("hét vége élei",sorted("-".join(e) for e in SEC.edges()),"ebből jelölt",sum(1 for e in SEC.edges() if not T.has_edge(*e)))
X=nx.Graph([("A","B"),("A","C"),("B","D"),("C","D"),("C","E"),("C","F")]); print("A-D",heur(X,"A","D"),"saját fokszám AA",r(2/math.log(2)))
print("Jaccard Vi-Kl összeggel",r(2/5))
print("AUC 3,1,1 | 1,0",r(auc([3,1,1],[1,0])),"holtv1",r(sum(p>=n for p in [3,1,1] for n in [1,0])/6),"holtv0",r(sum(p>n for p in [3,1,1] for n in [1,0])/6))
TP=.9*1000; FP=.02*99000; print("precizitás",r(TP/(TP+FP)),"pontosság",r((TP+99000-FP)/100000),"1-prec",r(1-TP/(TP+FP)))
