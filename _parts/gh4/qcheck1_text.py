# Checks the numbers in the 4.1-4.3 text (01-s41, 02-s42, 03-s43)
import numpy as np
from fractions import Fraction as F
def adj(nodes, edges, w=None):
    idx={v:i for i,v in enumerate(nodes)}; A=np.zeros((len(nodes),)*2)
    for k,e in enumerate(edges):
        a,b=e.split('-'); A[idx[a],idx[b]]=A[idx[b],idx[a]]=(w[k] if w else 1)
    return A
def fadj(nodes, edges):
    idx={v:i for i,v in enumerate(nodes)}; n=len(nodes)
    A=[[F(0)]*n for _ in range(n)]
    for e in edges:
        a,b=e.split('-'); A[idx[a]][idx[b]]=A[idx[b]][idx[a]]=F(1)
    return A
def step(p,A):
    n=len(A); d=[sum(r) for r in A]
    return [sum(p[i]*A[i][j]/d[i] for i in range(n)) for j in range(n)]
# path
P4=adj('1234',['1-2','2-3','3-4']); x=np.array([5,1,2,4.])
print('path Ax',P4@x, 'avg',(P4@x)/P4.sum(1))
print('path A e1', P4@np.array([1,0,0,0.]))
# friendship
fr='ABCD'; fe=['A-B','A-C','B-C','C-D']; Af=adj(fr,fe)
x=np.array([1,2,3,4.]); print('fr Ax',Af@x,'avg',(Af@x)/Af.sum(1),'sum',(Af@x).sum(), Af.sum(1)@x)
FA=fadj(fr,fe)
p=[F(0),F(0),F(0),F(1)]
for t in range(3): p=step(p,FA); print('D p',t+1,p)
p=[F(1),0,0,0]
for t in range(2): p=step(p,FA); print('A p',t+1,p)
pi=[F(2,8),F(2,8),F(3,8),F(1,8)]; print('pi stat', step(pi,FA)==pi)
# star
S=fadj('ABCD',['A-B','A-C','A-D'])
p=[F(1),0,0,0]
for t in range(3): p=step(p,S); print('star p',t+1,p)
p=[0,F(1),0,0]
for t in range(2): p=step(p,S); print('star from B',t+1,p)
# arvizhet
an=['Ko','Vi','Po','La','Ön','Sz','Kl']
ae='Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön'.split(',')
aw=[2,2,2,1,2,1,1,3,2,2]
Aa=adj(an,ae); Aw=adj(an,ae,aw)
print('deg',dict(zip(an,Aa.sum(1))),'str',dict(zip(an,Aw.sum(1))))
xm=np.array([1 if v in('Ko','Vi','Sz') else 0 for v in an]); print('hetfo Ax',dict(zip(an,Aa@xm)))
xk=np.array([1 if v=='Ko' else 0 for v in an]); print('Ko Ax',dict(zip(an,Aa@xk)))
FAa=fadj(an,ae); p=[F(0)]*7; p[6]=F(1)
for t in range(2): p=step(p,FAa); print('Kl p',t+1,dict(zip(an,p)))
print('pi',dict(zip(an,Aa.sum(1)/Aa.sum())),'piw',dict(zip(an,np.round(Aw.sum(1)/Aw.sum()*100,1))))
w,V=np.linalg.eigh(Aa); v=V[:,-1]; v=v/v.max(); print('lam1',w[-1],dict(zip(an,v.round(3))),'2m/n',Aa.sum()/7)
print('La row weighted', Aw[3]/Aw[3].sum())
# 4.3
SE=adj('ABCD',['A-B','A-C','A-D','B-C']); x=np.ones(4)
for k in range(8):
    y=SE@x; print('pow',k+1,y.round(3),(y/y.max()).round(3)); x=y/y.max()
w,V=np.linalg.eigh(SE); print('SE eig',w.round(4)); v=V[:,-1]; print((v/v.max()).round(4))
print('ratio',1.48/2.17, abs(w[0])/w[-1])
St=adj('ABCD',['A-B','A-C','A-D']); print('star eig',np.linalg.eigvalsh(St), St@np.array([3**.5,1,1,1]))
x=np.ones(4)
for k in range(3): x=St@x; print('star pow',x)
C4=adj('1234',['1-2','2-3','3-4','4-1']); print('C4',C4@np.ones(4),C4@np.array([1,-1,1,-1]))
w,V=np.linalg.eigh(P4); v=V[:,-1]; print('P4',w[-1],(v/v.max()).round(3))
print('D check', 2.17*0.46, 2.1701*0.4608)
K3=adj('123',['1-2','2-3','1-3']); print('K3',K3@np.ones(3))
w,V=np.linalg.eigh(Aa); v=np.abs(V[:,-1]); print('arviz dom', dict(zip(an,(v/v.max()).round(3))), 'sorted eig', w.round(3))
