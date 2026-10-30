import numpy as np
from fractions import Fraction as F
def M(n,edges):
    A=np.zeros((n,n))
    for i,j in edges: A[i,j]=A[j,i]=1
    return A
lap=lambda A: np.diag(A.sum(1))-A
def q(A,x): x=np.array(x,float); return x@lap(A)@x
print("== gh4-44")
G=M(4,[(0,1),(1,2),(1,3),(2,3)]); print("Q1 L row 2:",lap(G)[1], " A-D:",(G-np.diag(G.sum(1)))[1], " D+A:",(np.diag(G.sum(1))+G)[1])
P4=M(4,[(0,1),(1,2),(2,3)]); x=[2,0,1,1]; print("Q2 xLx",q(P4,x),"abs diffs",2+1+0,"signed",(2-0)+(0-1)+(1-1),"double",2*q(P4,x))
H=M(5,[(0,1),(1,2),(3,4)])
for v in [(1,1,1,1,1),(2,2,2,-1,-1),(1,1,1,0,0),(1,2,3,0,0),(0,0,0,1,-1)]: print("Q3",v,q(H,v))
print("Q4: 3 comps incl isolated ->",np.sum(np.abs(np.linalg.eigvalsh(lap(M(8,[(0,1),(1,2),(2,0),(2,3),(4,5),(5,6),(4,6)]))))<1e-9),"(example 8 csúcs, 7 él) ")
C6=M(6,[(i,(i+1)%6) for i in range(6)]); TB=M(6,[(0,1),(0,2),(1,2),(2,3),(3,4),(3,5),(4,5)])
print("Q6 C6",np.linalg.eigvalsh(lap(C6)).round(2),"TB",np.linalg.eigvalsh(lap(TB)).round(2))
print("== gh4-45")
P5=M(5,[(i,i+1) for i in range(4)]); print("Q1",q(P5,[1,1,-1,-1,-1]))
print("Q4 bound",30*0.4/4,30*0.4,30*0.4/2,0.4/4)
TT=M(6,[(0,1),(0,2),(1,2),(3,4),(3,5),(4,5)]); print("Q6",np.linalg.eigvalsh(lap(TT)).round(3))
print("== gh4-46")
print("Q1",F(3,20),F(3,10),1/7,5/36)
print("Q6 Vi after 2 from Kl", F(1,2)*F(1,4)+F(1,2)*F(1,3), F(1,8),F(1,6),F(1,4)+F(1,3))
print("== final")
g=M(4,[(0,1),(0,2),(0,3),(2,3)]); d=g.sum(1); x=np.array([2,4,1,3.])
print("F1 (Ax)_A",(g@x)[0],"avg",(g@x)[0]/d[0],"with self /4",((g@x)[0]+x[0])/4,"/n",(g@x)[0]/4)
P=g/d[:,None]; print("F2 P_AC",P[0,2],"P_CA",P[2,0])
print("F3 pi",d/d.sum())
p=np.zeros(4);p[0]=1
for t in range(200): p=p@P
print("   converge from A:",p.round(4))
S=M(4,[(0,1),(0,2),(0,3)]); Ps=S/S.sum(1)[:,None]; Pl=0.5*(np.eye(4)+Ps); print("F5 lazy",np.array([1,0,0,0])@Pl, "nonlazy",np.array([1,0,0,0])@Ps)
for name,B in [("K3",M(3,[(0,1),(1,2),(0,2)])),("C5",M(5,[(i,(i+1)%5) for i in range(5)])),("C4",M(4,[(i,(i+1)%4) for i in range(4)])),("star",S),("P3",M(3,[(0,1),(1,2)]))]:
    Pb=B/B.sum(1)[:,None]; p=np.zeros(len(B));p[0]=1; seq=[]
    for t in range(400): p=p@Pb; seq.append(p.copy())
    print("F4",name,"converged" if np.allclose(seq[-1],seq[-2],atol=1e-9) else "oscillates")
y=g@np.ones(4); print("F6",y,y/y.max(),(y/y.sum()).round(3),((g+np.eye(4))@np.ones(4))/4)
print("F7",2*12/8)
fr=M(4,[(0,1),(0,2),(1,2),(2,3)]); print("F9",q(fr,[2,0,1,1]),"abs",2+1+1+0)
print("F10 spectrum example check: 6 nodes, 3 comps e.g. P3 + edge + isolated",np.linalg.eigvalsh(lap(M(6,[(0,1),(1,2),(3,4)]))).round(2))
G6=M(6,[(0,1),(0,2),(1,2),(2,3),(3,4),(3,5),(4,5),(1,4)]); x=[1,1,1,-1,-1,-1]; print("F11",q(G6,x),"cut",sum(1 for i,j in [(0,1),(0,2),(1,2),(2,3),(3,4),(3,5),(4,5),(1,4)] if x[i]!=x[j]))
print("F12 bound",12*1/4)
ids=["Ko","Vi","Po","La","Ön","Sz","Kl"]
E=[("Ko","Vi"),("Ko","Po"),("Vi","Po"),("Vi","Sz"),("Sz","Kl"),("Sz","Ko"),("Kl","Ko"),("La","Ön"),("La","Po"),("Po","Ön")]
A=np.zeros((7,7))
for u,v in E: A[ids.index(u),ids.index(v)]=A[ids.index(v),ids.index(u)]=1
x=np.array([1 if i in("Po","La") else -1 for i in ids]); print("F14",x@lap(A)@x)
