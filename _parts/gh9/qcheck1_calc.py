from common import *
from fractions import Fraction as F
import math
from scipy.optimize import brentq
print("== 9.1")
G=arv()
d=nx.single_source_shortest_path_length(G,"Sz"); print("SI Sz",[sum(1 for v in d.values() if v<=t) for t in range(4)], "ecc",nx.eccentricity(G))
b,k=0.2,3; print("1-(1-b)^k",1-(1-b)**k,"kb",k*b,"(1-b)^k",(1-b)**k,"b^k",b**k)
T=lambda b,g:b/(b+g-b*g)
print("T(.4,.5)",T(.4,.5),"b/g",.4/.5,"b/(b+g)",.4/.9)
print("ABC 4/9",T(.5,.5)**2, "T*b",T(.5,.5)*.5, "b^2",.25)
def fs(R): return brentq(lambda r:r-1+math.exp(-R*r),1e-9,1) if R>1 else 0
t=T(.5,.5); print("T",t,"R0",3*t,fs(3*t),"T=b",1.5,fs(1.5),"b/g",3,fs(3),"R0=T",t)
# check 1-e^{-R r} for wrong r
print("ring lattice: same <k>",4)
print("== 9.2")
def ks(deg):
    n=len(deg); k1=F(sum(deg),n); k2=F(sum(x*x for x in deg),n); return k1,k2,k2/k1-1,1/(k2/k1-1)
H=nx.Graph([("A","B"),("A","C"),("A","D"),("B","C")])
k1,k2,kap,Tc=ks([d for _,d in H.degree()]); print("tri+pend",k1,k2,kap,Tc,"noMinus",k2/k1,1/(k2/k1),"Poisson",1/k1,"k2-k1",k2-k1,1/(k2-k1))
print("arv",ks([d for _,d in G.degree()]), float(ks([d for _,d in G.degree()])[3]), "noMinus Tc", float(1/F(62,20)), "1/<k>",7/20)
# acquaintance
A=nx.Graph([("H","A"),("H","B"),("H","C"),("H","D"),("A","B")])
p=sum(F(1,5)*F(1,A.degree(v)) for v in A if "H" in A[v]); print("acq hub",p,"edge end",F(A.degree("H"),2*A.number_of_edges()))
# sigma
m,s=5,4; k2=m*m+s*s; print("sigma4", k2/m-1, 1/(k2/m-1), "noMinus",m/k2,"sigma not sq",1/((m*m+s)/m-1),"no <k>^2",1/(s*s/m-1))
print("BA 10% /0.9",0.073/0.9)
print("== 9.3")
p=.4; print("tri .4",p+(1-p)*p*p, p+p*p, 1-(1-p)**2)
S=nx.star_graph(4); print("star leaf .4",ic_exact(S,[1],.4),"center",ic_exact(S,[0],.4))
K3=nx.complete_graph(3)
# P(B) exact in triangle p=.4
E=list(K3.edges()); tot=0
for mask in range(8):
    pr=1; Hh=nx.Graph(); Hh.add_nodes_from(K3)
    for i,e in enumerate(E):
        if mask>>i&1: pr*=p; Hh.add_edge(*e)
        else: pr*=1-p
    if 1 in nx.node_connected_component(Hh,0): tot+=pr
print("tri exact PB",tot)
def gran(th):
    a=0
    while True:
        n=sum(1 for t in th if t<=a)
        if n==a: return a
        a=n
th=[0,1,2,4,4,5]; print("gran",gran(th),"mean",sum(th)/len(th))
def tf(seeds,th,strict=False):
    A=set(seeds)
    while True:
        new={v for v in G if v not in A and ((sum(1 for u in G[v] if u in A)/G.degree(v)>th) if strict else (sum(1 for u in G[v] if u in A)/G.degree(v)>=th))}
        if not new: return A
        A|=new
print("Po .5",sorted(tf(["Po"],.5)),"strict",sorted(tf(["Po"],.5,True)))
print("8-deg 3 active", 3/8>=.5, 3>=3)
R=nx.circulant_graph(8,[1,2]); C=nx.circulant_graph(8,[1,3])
def thresh(G,seeds,theta):
    A=set(seeds)
    while True:
        new={v for v in G if v not in A and sum(1 for u in G[v] if u in A)>=theta}
        if not new: return len(A)
        A|=new
print("ring",thresh(R,[0,1],2),"circ",thresh(C,[0,1],2))
print("== 9.4")
def nu(edges):
    T=nx.Graph(edges); n=T.number_of_nodes(); W=nx.wiener_index(T); return n,W,W/math.comb(n,2)
Tr=[("r",1),("r",2),("r",3),(1,4),(4,5)]
n,W,v=nu(Tr); Tg=nx.Graph(Tr); dr=nx.single_source_shortest_path_length(Tg,"r")
print("tree6",n,W,v,"depth",max(dr.values()),"root avg incl",sum(dr.values())/n,"excl",sum(dr.values())/(n-1),"ordered",W/(n*(n-1)))
from collections import Counter
print("levels",Counter(dr.values()))
T7=[("r",1),("r",2),("r",3),(1,4),(2,5),(3,6)]; d7=nx.single_source_shortest_path_length(nx.Graph(T7),"r"); print("T7",len(d7),max(d7.values()),Counter(d7.values()))
for n in [20]:
    print("star",nu([(0,i) for i in range(1,n)])[2],2*(n-1)/n,"path",nu([(i,i+1) for i in range(n-1)])[2],(n+1)/3,(n-1)/3, "path root avg", sum(range(1,n))/(n-1))
R_=3*.2; print("3 foll .2 R",R_,"mean",1/(1-R_),"1+R",1+R_,"R/(1-R)",R_/(1-R_),"q as R",1/(1-.2),"P1",.8**3)
q=.3; print("2 foll .3 P1",(1-q)**2,"1-R",1-2*q,"q^2",q*q)
def borel(R,s): return math.exp(-R*s)*(R*s)**(s-1)/math.factorial(s)
print("borel .9 >=100", 1-sum(borel(.9,s) for s in range(1,100)), "P1",borel(.9,1))
