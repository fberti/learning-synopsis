import random, math, statistics as st
def r(x,y):
    mx,my=st.fmean(x),st.fmean(y); c=sum((a-mx)*(b-my) for a,b in zip(x,y))
    return c/math.sqrt(sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))
def pois(l):
    L=math.exp(-l);k=0;p=1
    while True:
        k+=1;p*=random.random()
        if p<=L: return k-1
for seed in range(3):
    random.seed(seed)
    T=[11-11*math.cos(2*math.pi*w/52)+random.gauss(0,3) for w in range(520)]
    F=[max(0,5+2*t+random.gauss(0,5)) for t in T]
    D=[pois(0.3*max(0,t-10)) for t in T]
    out=[round(r(F,D),3),round(r(T,F),3),round(r(T,D),3)]
    for c in (12,16,20,24):
        idx=[i for i in range(520) if abs(T[i]-c)<=1.5]
        out.append((c,len(idx),round(r([F[i] for i in idx],[D[i] for i in idx]),3)))
    print(out)
# spurious
def walk(n,trend):
    s=0;o=[]
    for _ in range(n):
        e=random.gauss(0,1); s=s+e if trend else e; o.append(s)
    return o
random.seed(1)
for n in (20,50,200):
    for tr in (True,False):
        k=sum(abs(r(walk(n,tr),walk(n,tr)))>0.5 for _ in range(1000)); print(n,tr,k/10)
