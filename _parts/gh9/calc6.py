from common import *
np.set_printoptions(precision=4,suppress=True)
# DeGroot path A-B-C, average self+neighbors equally
A=np.array([[0,1,0],[1,0,1],[0,1,0]],float); M=A+np.eye(3); W=M/M.sum(1,keepdims=True)
x=np.array([7.,0,0])
for t in range(4): print("t",t,x); x=W@x
for t in range(60): x=W@x
print("limit",x, "pi", (M.sum(1))/M.sum())
x=np.array([0.,0,7]); 
for t in range(80): x=W@x
print("C=7 limit",x)
# star with 4 leaves: hub opinion 10, leaves 0
S=nx.star_graph(4); A=nx.to_numpy_array(S); M=A+np.eye(5); W=M/M.sum(1,keepdims=True)
x=np.array([10.,0,0,0,0])
for t in range(200): x=W@x
print("star hub10",x, (M.sum(1))/M.sum())
x=np.array([0.,10,0,0,0])
for t in range(200): x=W@x
print("star leaf10",x)
# DeGroot no self weight on bipartite path -> oscillation
A2=np.array([[0,1],[1,0]],float); x=np.array([0.,1])
print("2-agent no self",[ (A2@x).tolist(), (A2@A2@x).tolist()])
# Arvizhet DeGroot weights pi ~ k+1
G=arv(); k=dict(G.degree()); tot=sum(v+1 for v in k.values()); print("arv pi",{a:round((v+1)/tot,4) for a,v in k.items()}, tot)
# HK
def hk(x,eps,steps=50):
    x=np.array(x,float); hist=[x.copy()]
    for t in range(steps):
        nx_=np.array([x[np.abs(x-xi)<=eps+1e-12].mean() for xi in x])
        if np.allclose(nx_,x): break
        x=nx_; hist.append(x.copy())
    return hist
for e in [0.15,0.25,0.45]:
    h=hk([0,0.2,0.4,0.8,1],e)
    print("HK eps",e,"steps",len(h)-1)
    for r in h[:4]: print("   ",r)
    print("   final",h[-1])
# Deffuant clusters vs eps, uniform 200 agents
rng=np.random.default_rng(3)
def deff(n,eps,mu=0.5,it=200000):
    x=rng.random(n)
    for _ in range(it):
        i,j=rng.integers(n,size=2)
        if i!=j and abs(x[i]-x[j])<eps:
            d=x[j]-x[i]; x[i]+=mu*d; x[j]-=mu*d
    xs=np.sort(x); cl=1+np.sum(np.diff(xs)>0.02); big=0
    # count clusters with >=5% agents
    groups=np.split(xs,np.where(np.diff(xs)>0.02)[0]+1)
    return cl,sum(1 for g in groups if len(g)>=0.05*n)
for e in [0.1,0.15,0.2,0.25,0.3,0.4,0.5]:
    r=[deff(200,e) for _ in range(5)]
    print("Deffuant eps",e,r)
# HK uniform 100 agents
for e in [0.05,0.1,0.15,0.2,0.25,0.3]:
    res=[]
    for s in range(10):
        x=np.random.default_rng(s).random(100); h=hk(x,e,500); f=np.sort(h[-1]); groups=np.split(f,np.where(np.diff(f)>1e-3)[0]+1)
        res.append(sum(1 for g in groups if len(g)>=3))
    print("HK uniform eps",e,res)
