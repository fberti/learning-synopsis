# q2 (gh9-95, 96, 97, final) számellenőrzés: ./run.sh qcheck2_calc.py
from common import *
from math import comb, e, exp, floor
print("== 9.5")
H=arv()
s={v:ic_exact(H,[v],0.3) for v in H}; print("single p.3",{k:round(v,3) for k,v in s.items()})
pr={v:round(ic_exact(H,["Ko",v],0.3),3) for v in H if v!="Ko"}; print("Ko+ p.3",pr)
print("gains", {k:round(v-s["Ko"],3) for k,v in pr.items()})
best=max(itertools.combinations(H,2),key=lambda c:ic_exact(H,list(c),0.3)); print("opt",best,round(ic_exact(H,list(best),0.3),3), "ratio",round(pr["La"]/ic_exact(H,list(best),0.3),4))
G=nx.Graph(); G.add_edge("A","B")
for i in range(1,6): G.add_edge("A",str(i)); G.add_edge("B",str(i))
for x in "xyz": G.add_edge("C",x)
a=ic_exact(G,["A"],.2); b=ic_exact(G,["B"],.2); ab=ic_exact(G,["A","B"],.2)
print("p.2 A",round(a,3),"B",round(b,3),"AB",round(ab,3),"gain B",round(ab-a,3),"sum",round(a+b,3))
# új lefedési gráf
K=nx.Graph([("A",1),("A",2),("A",3),("A",4),("B",3),("B",4),("B",5),("C",6),("C",7)])
cov=lambda S:len(set(S)|{u for s in S for u in K[s]})
print("cov A",cov("A"),"B",cov("B"),"C",cov("C"),"gain B",cov("AB")-cov("A"),"gain C",cov("AC")-cov("A"),"AB+",cov("A")+cov("B"))
print("garancia 200:",(1-1/e)*200,"1/e*200",200/e)
print("C(1000,5)",comb(1000,5),"V",1000*999*998*997*996,"1000^5",1000**5)
print("== 9.6")
def degroot_pi(Gr): k=dict(Gr.degree()); t=sum(v+1 for v in k.values()); return {a:(v+1)/t for a,v in k.items()}
P4=nx.path_graph(["A","B","C","D"]); pi=degroot_pi(P4); print("P4 pi",pi,"B=10 ->",10*pi["B"],"k/sum k",10*2/6)
A=nx.to_numpy_array(P4); M=A+np.eye(4); W=M/M.sum(1,keepdims=True); x=np.array([0,10.,0,0])
for _ in range(300): x=W@x
print(" iter",x)
pa=degroot_pi(H); print("arv Ko",pa["Ko"],5/27,"k/sum",4/20)
paw=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")]); pp=degroot_pi(paw); print("paw pi",pp,"D=12 ->",12*pp["D"], "k/sumk",12*1/8)
A=nx.to_numpy_array(paw,nodelist=["A","B","C","D"]); M=A+np.eye(4); W=M/M.sum(1,keepdims=True); x=np.array([0,0,0,12.])
for _ in range(300): x=W@x
print(" iter",x)
def hk1(x,eps,self_=True):
    x=np.array(x,float); out=[]
    for i,xi in enumerate(x):
        S=[xj for j,xj in enumerate(x) if abs(xj-xi)<=eps+1e-12 and (self_ or j!=i)]
        out.append(np.mean(S) if S else xi)
    return np.round(out,4)
x0=[0,.2,.4,.7,1]; print("HK .25",hk1(x0,.25),"noself",hk1(x0,.25,False),"mean",np.mean(x0))
x=np.array(x0,float)
for _ in range(20): x=hk1(x,.25)
print(" HK .25 vége",x)
print("Deffuant .3/.5 mu .25:",.3+.25*.2,.5-.25*.2,"mu .5:",.4)
print("eps .08",1/(2*.08),floor(1/(2*.08)),"1/eps",1/.08,"1/4eps",1/.32)
print("== 9.7")
print("BA kappa 10.1 -> Tc",1/10.1,"no -1",1/11.1,"-1 twice",1/9.1)
N=1000
for nm,Gn in {"racs":nx.watts_strogatz_graph(N,4,0,seed=1),"WS":nx.watts_strogatz_graph(N,4,0.1,seed=1),"ER":nx.gnm_random_graph(N,2*N,seed=1),"BA":nx.barabasi_albert_graph(N,2,seed=1)}.items():
    k=np.array([d for _,d in Gn.degree()]); kp=(k**2).mean()/k.mean()-1; print(nm,"kappa",round(kp,3),"Tc",round(1/kp,4))
Gb,_=polblogs(); k=np.array([d for _,d in Gb.degree()]); kp=(k**2).mean()/k.mean()-1; print("blogs kappa",kp,"Tc",1/kp,"ER",1/k.mean())
print("p .02*.75",.02*.75,"p .02*.6",.02*.6)
print("blogs p.03 big mean approx", (124-0.68*1.5)/0.32)
print("== final")
print("F1 beta .2 k3:",1-.8**3,"kb",.6,"(1-b)^k",.8**3,"b^k",.2**3)
T=lambda b,g:b/(b+g-b*g); t=T(.4,.5); print("F2 T",t,"T^2",t*t,"b^2",.16,"(b/g)^2",(.4/.5)**2)
F3=nx.Graph([("A","B"),("B","C"),("C","D"),("D","E"),("C","F")]); print("F3 ecc",nx.eccentricity(F3), "deg",dict(F3.degree()))
F4=nx.Graph([("A","B"),("A","C"),("A","D"),("D","E")])
acq=sum(sum(1 for u in F4[v] if u=="A")/F4.degree(v) for v in F4)/5; print("F4 acq",acq,"rand",1/5,"edge-end",3/8,"wrong D",3/5)
F14=nx.Graph([("A","B"),("A","C"),("A","E"),("B","D"),("B","F"),("C","D")]); k=np.array([d for _,d in F14.degree()]); print("F14 deg",dict(F14.degree()))
k1=k.mean(); k2=(k**2).mean(); kp=k2/k1-1; print(" <k>",k1,"<k2>",k2,"kappa",kp,"Tc",1/kp,"1/<k>",1/k1,"no-1",k1/k2,"1/<k2>",1/k2)
F5=nx.Graph([("A","B"),("A","C"),("B","C"),("C","D")])
def reach(Gr,s,t,p):
    E=list(Gr.edges()); tot=0
    for mask in range(1<<len(E)):
        Hh=nx.Graph(); Hh.add_nodes_from(Gr); pr=1
        for i,ed in enumerate(E):
            if mask>>i&1: pr*=p; Hh.add_edge(*ed)
            else: pr*=1-p
        if nx.has_path(Hh,s,t): tot+=pr
    return tot
print("F5 P(D)",reach(F5,"A","D",.5),"P(C)",reach(F5,"A","C",.5),"wrong .25",.25,"wrong .375",(.5+.25)*.5,"p^3",.125)
def gran(th):
    a=0
    while True:
        n=sum(1 for t in th if t<=a)
        if n==a: return a
        a=n
th=[0,0,2,2,3,6,6]; print("F6",gran(th),"mean",np.mean(th))
Tr=nx.Graph([("r","a"),("r","b"),("a","c"),("c","d")]); W_=nx.wiener_index(Tr); print("F8 wiener",W_,"nu",W_/10,"root avg",np.mean([v for kk,v in nx.shortest_path_length(Tr,"r").items() if kk!="r"]),"depth",max(nx.shortest_path_length(Tr,"r").values()),"W/n",W_/5)
R=4*.2; print("F9 R",R,"mean",1/(1-R),"1+R",1+R,"P1",.8**4,"q^4",.2**4,"1-.8^4",1-.8**4)
# Borel check / branching sim P1 from Binomial(4,.2): exact .8^4
print("F10 garancia",(1-1/e)*62)
print("F12 n/a")
print("Po pontosan", ic_exact(arv(),["Po"],0.3), "Ko", ic_exact(arv(),["Ko"],0.3))
x=[0,.2,.4,.8,1]
for e_ in [.25,.45]:
    y=np.array(x,float); st=[]
    for _ in range(10): y=hk1(y,e_); st.append(y.tolist())
    print("HK",e_,st[:5])
