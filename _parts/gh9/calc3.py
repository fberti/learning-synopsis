from common import *
import math
# IC on small graphs
P4=nx.path_graph(4); print("path4 from 0 p.5",ic_exact(P4,[0],0.5))
K3=nx.complete_graph(3); print("triangle from 0 p.5",ic_exact(K3,[0],0.5))
# P(node2 reached in triangle) = p + (1-p)*p*p
p=.5; print("tri reach",p+(1-p)*p*p)
S=nx.star_graph(4); print("star center p.5",ic_exact(S,[0],0.5),"leaf",ic_exact(S,[1],0.5))
# Granovetter
def gran(th):
    act=0
    while True:
        new=sum(1 for t in th if t<=act)
        if new==act: return act
        act=new
print("gran 0..99",gran(list(range(100))),"replace 1->2",gran([0,2]+list(range(2,100))))
print("gran 0,1,1,3,...",gran([0,1,1]+list(range(3,100))))
# threshold model on ring lattice
def thresh(G,seeds,theta,frac=False):
    A=set(seeds)
    while True:
        new={v for v in G if v not in A and (sum(1 for u in G[v] if u in A)/(G.degree(v) if frac else 1))>=theta}
        if not new: return A
        A|=new
def ring(n,k): return nx.watts_strogatz_graph(n,k,0)
R8=ring(8,4); print("ring8 k4 seeds 0,1 theta2:",len(thresh(R8,[0,1],2)))
# rounds
def rounds(G,seeds,theta):
    A=set(seeds); r=0; hist=[len(A)]
    while True:
        new={v for v in G if v not in A and sum(1 for u in G[v] if u in A)>=theta}
        if not new: return hist
        A|=new; hist.append(len(A))
print("ring8 rounds",rounds(R8,[0,1],2), "ring20",rounds(ring(20,4),[0,1],2))
print("ring8 simple theta1 rounds",rounds(R8,[0],1),"ring20",rounds(ring(20,4),[0],1))
rs=np.random.default_rng(0)
for q in [0,0.05,0.1,0.2,0.5,1]:
    fr=[];sp=[]
    for s in range(300):
        G=nx.watts_strogatz_graph(100,4,q,seed=int(s)) if q<1 else nx.random_regular_graph(4,100,seed=int(s))
        fr.append(len(thresh(G,[0,1],2))/100)
        h=rounds(G,[0],1); sp.append(len(h)-1)
    print("rewire",q,"complex frac mean",round(np.mean(fr),3),"P(full)",round(np.mean(np.array(fr)==1),3),"simple steps",round(np.mean(sp),2))
