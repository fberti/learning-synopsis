# q2.js (gh12-125, -126, -127, -final) számainak ellenőrzése: ./run.sh qcheck2_calc.py
from common import *
from itertools import combinations
import math
DI={d:i for i,d in enumerate(DAYS)}
key=lambda x,y: tuple(sorted((x,y),key=ACT.index))
ev=[(DI[a[2]],key(x,y),a[0]) for a in ART for x,y in combinations(a[3],2)]
print("események", len(ev), "említések", sum(len(a[3]) for a in ART), "párok", math.comb(7,2))
def mem(v, lam=.5, order="decay_first"):
    s=0; out=[]
    for d in range(7):
        n=sum(1 for dd,p,_ in ev if dd==d and v in p)
        s = lam*s+n if order=="decay_first" else lam*(s+n)
        out.append(round(s,4))
    return out
for v in ACT: print("mem",v,mem(v), "λ=1:",mem(v,1), "add-then-halve:",mem(v,.5,"x"))
w=np.array([1,.25])
for dt in [0,1,2,3]: print("phi",dt,np.round(np.cos(w*dt),3),"sin",np.round(np.sin(w*dt),3))
f=.75; print("EB 75%: könnyű",f+(1-f)/2,"tört",f/2,"döntetlen=0:",f,0,"döntetlen=1:",1,f,"csere:",f/2+(1-f))
# szerda esti memóriák, új párok szorzata
S={v:mem(v)[2] for v in ACT}; seen={p for dd,p,_ in ev if dd<=2}
allp=[key(x,y) for x,y in combinations(ACT,2)]
new=sorted([(S[a]*S[b],a,b) for a,b in allp if (a,b) not in seen],reverse=True)
print("új párok szorzat:",new[:4]); print("látott:",sorted([(S[a]*S[b],a,b) for a,b in seen],reverse=True)[:3])
print("Ko+Kl összeg", S["Ko"]+S["Kl"])
# EdgeBank, napi bővülő memória, vágás d0 után
def edgebank(cut, grow=True):
    mem_=set(p for dd,p,_ in ev if dd<=cut); hits=[]; tot=0
    for d in range(cut+1,7):
        today=[p for dd,p,_ in ev if dd==d]
        hits+= [p in mem_ for p in today]; tot+=len(today)
        if grow: mem_|=set(today)
    return sum(hits),tot
for c in [1,2,3,4]: print("EdgeBank vágás",DAYS[c],edgebank(c),"nem bővülő:",edgebank(c,False))
h,t=edgebank(1); r=h/t; print("kedd: könnyű AUC",r+(1-r)/2,"tört",r/2)
# véletlen szint
print("véletlen 6/3/3:",(15+3+3)/66,"visszatevéssel",(36+9+9)/144, "4/3/5:",19/66)
# keretek, szavazás
FR={1:"V",2:"V",3:"V",4:"H",5:"H",6:"H",7:"L",8:"L",9:"L",10:"V",11:"L",12:"L"}
PAP={a[0]:a[1] for a in ART}; MEN={a[0]:set(a[3]) for a in ART}
EVT={1:1,4:1,7:2,10:2,2:3,11:3,8:4,5:5,6:5,3:6,9:6,12:6}
def vote_new(actors,paper=None):
    sc={"V":0,"H":0,"L":0}
    for c in range(1,13):
        sc[FR[c]]+=len(actors&MEN[c]) + (1 if paper and PAP[c]==paper else 0)*3/3
    return sc
for A,p in [({"Vi","Ön"},None),({"Vi","Ön"},"RH"),({"Vi"},None),({"Vi","Ön"},"NY"),({"Ko","Kl"},None),({"Ko","Kl"},"EK"),({"Po","Ön"},None),({"Sz","Kl"},None),({"La"},None)]:
    print("új cikk",A,p,vote_new(A,p))
# Ön cikkei
print("Ön:",[c for c in MEN if "Ön" in MEN[c]],"Vi:",[c for c in MEN if "Vi" in MEN[c]])
def loo(beta, binary=False, self_=False):
    tot=0; det={}
    for c in range(1,13):
        sc={"V":0,"H":0,"L":0}
        for d in range(1,13):
            if d==c and not self_: continue
            m=[PAP[c]==PAP[d], (min(1,len(MEN[c]&MEN[d])) if binary else len(MEN[c]&MEN[d])), EVT[c]==EVT[d]]
            sc[FR[d]]+=sum(b*x for b,x in zip(beta,m))
        mx=max(sc.values()); win=[f for f in sc if sc[f]==mx]
        g=(1/len(win) if FR[c] in win else 0); tot+=g; det[c]=(g,sc)
    return tot,det
for b in [(1,0,0),(0,1,0),(0,0,1),(1,1,0),(1,1,1),(1,1,.5)]:
    t,d=loo(b); print("LOO",b,t,"nem 1:",{c:(g,s) for c,(g,s) in d.items() if g!=1})
print("bináris szereplő",loo((0,1,0),True)[0],"önmagával lap",loo((1,0,0),self_=True)[0],"önmagával szereplő",loo((0,1,0),self_=True)[0])
print("többség",5/12)
print("4608/12",4608/12,"2304/12",2304/12,4608/3)
# ---- fejezetzáró
E=[("A","B"),("A","C"),("B","C"),("B","D"),("D","E")]; G=nx.Graph(E); N="ABCDE"
A=nx.to_numpy_array(G,nodelist=list(N)); Ah=A+np.eye(5); dh=Ah.sum(1); P=Ah/np.sqrt(np.outer(dh,dh))
x=np.array([0,0,0,0,1.]); print("P e_E",np.round(P@x,3),"önhurok nélkül D:",1/math.sqrt(2*1),"átlag D:",.5,"1/3")
# relációs: A–B(+), B–C(−), A–C(−), x=(1;0;2)
x={"A":1,"B":0,"C":2}; pos={"A":["B"],"B":["A"],"C":[]}; neg={"A":["C"],"B":["C"],"C":["A","B"]}
avg=lambda L:sum(x[u] for u in L)/len(L) if L else 0
for v in "ABC":
    rel=x[v]+avg(pos[v])-avg(neg[v]); hom=x[v]+avg(pos[v]+neg[v]); full=x[v]+(sum(x[u] for u in pos[v])-sum(x[u] for u in neg[v]))/len(pos[v]+neg[v])
    print("rel",v,rel,"hom",hom,"teljes norm",full,"ReLU",max(0,rel))
d=32; R=11; B=4
print("bázis",B*d*d+R*B+d*d,"szimm. dupla",B*d*d+12*B+d*d,"RB nélkül",B*d*d+d*d,"W0 nélkül",B*d*d+R*B,"nélküle",(R+1)*d*d)
LCK=np.array([[9,0,0,3],[0,9,0,0],[0,0,9,6],[3,0,6,5]]); print("NY–VN",LCK[2,3])
w=np.array([math.log(2),0,-math.log(2)]); print("softmax",np.round(np.exp(w)/np.exp(w).sum(),3), "w/sum|w|", w/abs(w).sum())
h=np.array([0,0.]); r=np.array([1,1.]); t=np.array([1,2.]); tn=np.array([3,2.]); g=1.5
dp=np.linalg.norm(h+r-t); dn=np.linalg.norm(h+r-tn); print("TransE",dp,dn,max(0,g+dp-dn),"csere",g+dn-dp,"γ+d+",g+dp)
raw=[1,4,6]; filt=[1,3,4]; print("MRR szűrt",np.mean([1/k for k in filt]),"nyers",np.mean([1/k for k in raw]),"1/átlag",1/np.mean(filt),"Hits@3",np.mean([k<=3 for k in filt]))
