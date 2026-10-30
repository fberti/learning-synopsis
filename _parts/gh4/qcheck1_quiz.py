# Checks every number (correct + distractor) in q1.js (gh4-41..43)
import numpy as np
from fractions import Fraction as F
def adj(nodes, edges, w=None):
    idx={v:i for i,v in enumerate(nodes)}; A=np.zeros((len(nodes),)*2)
    for k,e in enumerate(edges):
        a,b=e.split('-'); A[idx[a],idx[b]]=A[idx[b],idx[a]]=(w[k] if w else 1)
    return A
def fA(A): return [[F(int(v)) for v in r] for r in A]
def step(p,A):
    n=len(A); d=[sum(r) for r in A]
    return [sum(p[i]*A[i][j]/d[i] for i in range(n)) for j in range(n)]
print('=== gh4-41')
G=adj('ABCD',['A-B','B-C','B-D','C-D']); x=np.array([2,1,3,5.]); I=np.eye(4)
print('Q1 Ax',G@x,'(A+I)x',(G+I)@x,'avg',(G@x)/G.sum(1),'nonnbr',(1-G-I)@x)
print('Q2 avg B',(G@x)[1]/3,'own avg',((G+I)@x)[1]/4,'1/n',(G@x)[1]/4)
H=adj('ABCD',['A-B','B-C','C-D','D-A','A-C']); print('Q3 A1',H.sum(1),'n',4,'m',H.sum()/2,'(A+I)1',(H+I).sum(1),'sum',H.sum())
an=['Ko','Vi','Po','La','Ön','Sz','Kl']
ae='Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön'.split(',')
Aa=adj(an,ae); xt=np.array([1 if v in('La','Ön','Po','Vi') else 0 for v in an])
r=dict(zip(an,Aa@xt)); ro=dict(zip(an,(Aa+np.eye(7))@xt)); dg=dict(zip(an,Aa.sum(1)))
print('Q5 Ax',r,'own',ro,'avg Po,Ko',r['Po']/4,r['Ko']/4,'deg',dg)
Dg=np.zeros((3,3)); Dg[0,1]=Dg[0,2]=Dg[1,2]=Dg[2,0]=1; x=np.array([1,2,3.])
print('Q7 Ax',Dg@x,'xTA',x@Dg,'own',(Dg+np.eye(3))@x, x@(Dg+np.eye(3)))
print('=== gh4-42')
S=adj('ABCD',['A-B','A-C','A-D','B-C']); P=S/S.sum(1)[:,None]
print('Q1 P row A',P[0],'col A',P[:,0])
FS=fA(S); p=[F(0),F(1),F(0),F(0)]; p1=step(p,FS); p2=step(p1,FS); print('Q2 p1',p1,'p2',p2,sum(p2))
print('Q2 Px wrong',P@np.array([float(v) for v in p1]))
d=S.sum(1); print('Q3 pi',[F(int(v),int(d.sum())) for v in d],'d/m',[F(int(v),int(d.sum()//2)) for v in d],'inv',[F(1,int(v))/sum(F(1,int(u)) for u in d) for v in d])
print('Q3 stationary check', np.allclose((d/d.sum())@P, d/d.sum()))
Aw=adj(an,ae,[2,2,2,1,2,1,1,3,2,2]); s=Aw.sum(1); print('Q5 s',dict(zip(an,s)),'sum',s.sum(),'Po',s[2]/s.sum(),'Po/20',s[2]/20,'Po/72',s[2]/72,'deg pi',Aa.sum(1)/20)
FAa=fA(Aa); p=[F(0)]*7; p[3]=F(1); p1=step(p,FAa); p2=step(p1,FAa); print('Q7 La 2 steps',dict(zip(an,p2)),'sum P',F(1,2)+F(1,4))
print('=== gh4-43')
P3=adj('123',['1-2','2-3']); r2=2**.5
for v in [(1,r2,1),(1,1,1),(1,2,1),(2,1,2)]: print('Q1',v,P3@np.array(v))
print('Q1 eig',np.linalg.eigvalsh(P3))
v=np.array([0,1,-1,0.]); print('Q2 Av',S@v)
Fr=adj('ABCD',['A-B','A-C','B-C','C-D']); x=np.ones(4)
for k in range(2): y=Fr@x; x=y/y.max(); print('Q3 step',k+1,y,x.round(3))
x=np.ones(4); I4=np.eye(4)
for k in range(2): y=(Fr+I4)@x; x=y/y.max(); print('Q3 A+I step',k+1,x.round(3))
print('Q3 pi',Fr.sum(1)/Fr.sum())
w,V=np.linalg.eigh(Fr); u=np.abs(V[:,-1]); print('Q3 limit',(u/u.max()).round(3),'lam1',w[-1].round(3),'eig',w.round(3))
print('Q5 2m/n',24/8,'m/n',12/8)
