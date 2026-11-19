# q1 kvíz (gh10-101..104) számellenőrzés
from common import *
from fractions import Fraction as F
import math
from scipy import stats
def J(a,b): a,b=set(a),set(b); return F(len(a&b),len(a|b))
def Jw(a,b): a,b=np.array(a,float),np.array(b,float); return np.minimum(a,b).sum()/np.maximum(a,b).sum()
print("== 101")
EA=["AB","AC","AD","BC"]; EB=["AB","AC","CD"]
print("Q1 J",J(EA,EB),"sum",F(2,7),float(F(2,7)),"overlap",F(2,3),"2/|EA|",F(2,4))
V={"Po-Vi":1,"Po-La":1,"Po-On":1}; Y={"Po-La":1,"Po-On":1,"La-On":3}
keys=sorted(set(V)|set(Y)); v=[V.get(k,0) for k in keys]; y=[Y.get(k,0) for k in keys]
print("Q2 VN-NY Jw",Jw(v,y),"bin",J(V,Y),"sum-den",2/(3+5),"NY-den",2/5)
A=[3,1,0,2];B=[1,2,2,2]
print("Q3 Jw",Jw(A,B),4/9,"bin",J([i for i in range(4) if A[i]],[i for i in range(4) if B[i]]),
      "sum",4/(sum(A)+sum(B)),"common only",Jw([3,1,2],[1,2,2]))
print("Q4 Jw tot 9,6 min3:",3/(9+6-3),"sum",3/15,"smaller",3/6,"larger",3/9)
print("Q5 doubled Jw",Jw([2,2,2],[1,1,1]),"sum err",3/(6+3))
print("binary vs weighted (5,1,0)/(5,0,1)",Jw([5,1,0],[5,0,1]),J([0,1],[0,2]))
print("A subset B 5/20",5/20)
print("== 102")
print("Q1 12 dir",12*11,"undir",66,"with diag",144,"undir+diag",12*13//2)
def phi(a,b,c,d): return (a*d-b*c)/math.sqrt((a+b)*(c+d)*(a+c)*(b+d))
# 6 nodes 15 cells A 4 edges B 3 edges, 2 common
x=[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]; yy=[1,1,0,0,1,0,0,0,0,0,0,0,0,0,0]
print("Q2 phi",phi(2,2,1,10),np.corrcoef(x,yy)[0,1],"J",2/5,"no -bc",20/math.sqrt(4*11*3*12),"a/min",2/3)
print("Q3 4+1 isolated", phi(2,1,1,6), F(11,21), "one extra cell", phi(2,1,1,3), "7 nodes", phi(2,1,1,17))
print("Q5 21 directed: row+col",20+20,"of",21*20,"undir",20,"of",210,"with diag 441")
print("== 103")
V4=(comat(paper("VN"),["Po","Vi","La","Ön"])>0).astype(float); Y4=(comat(paper("NY"),["Po","Vi","La","Ön"])>0).astype(float)
r0,rs=qap_exact(V4,Y4); print("Q1 r0",r0,"p",np.mean(rs>=r0-1e-12),"two-sided",np.mean(abs(rs)>=abs(r0)-1e-12),"1/24",1/24,"6/24",6/24)
V=(comat(paper("VN"))>0).astype(float); Yf=(comat(paper("NY"))>0).astype(float)
r0,rs=qap_exact(V,Yf); print("Q2 r0",r0,"p",np.mean(rs>=r0-1e-12),3/35,"3/7",3/7,"4/20",4/20,"naive",stats.pearsonr(offdiag(V),offdiag(Yf))[1])
print("Q2 two-sided",np.mean(abs(rs)>=abs(r0)-1e-12))
# Q3: same pi on both -> r unchanged
P=[2,0,1,3,4,6,5]; print("Q3 both permuted same pi r",corr(V[np.ix_(P,P)],Yf[np.ix_(P,P)]))
print("Q4 k=0 M=20000",1/20001,"M=1999",1/2000)
print("Q5 SE p=.04 M=2000",math.sqrt(.04*.96/2000),"1/sqrtM",1/math.sqrt(2000),"no sqrt",.04*.96/2000,"sqrt p(1-p)",math.sqrt(.04*.96))
print("== 104")
print("Q1 b0",18/40-0+0, 24/160,"b1",18/40-24/160,"ratio",(18/40)/(24/160))
b0,bf,br=0.397,0.136,0.472
print("Q2 friend nonboss",b0+bf,"both",b0+bf+br,"nonfriend boss",b0+br)
A_,att=krack(); adv,fr,rep=[offdiag(A_[k],True) for k in ["advice","friendship","reports"]]
X=np.column_stack([np.ones(420),fr,rep]); b,*_=np.linalg.lstsq(X,adv,rcond=None); print("Q2 exact b",b,"pred friend nonboss",b[0]+b[1])
m=(fr==1)&(rep==0); print("actual friend nonboss rate",adv[m].mean(),m.sum())
print("fr single",adv[fr==1].mean(),adv[fr==0].mean())
print("boss cells friends",fr[rep==1].sum(),"of",int(rep.sum()),"density fr",fr.mean())
res=adv-X@b; print("R2",1-res@res/((adv-adv.mean())@(adv-adv.mean())))
print("explain extras: C(3,2)/C(6,2)",math.comb(3,2)/math.comb(6,2),"(0.05-0.04)/SE",(0.05-0.04)/math.sqrt(.04*.96/2000),
      "0.018/0.0015",0.018/0.0015,"nonboss diff",49/90-122/310,"phi 7 no common",-9/54,"corr fr rep",np.corrcoef(fr,rep)[0,1])
