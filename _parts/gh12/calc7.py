from common import *
names=["Ko","Vi","Po","Sz"]
pos=[("Ko","Vi"),("Sz","Vi"),("Po","Ko"),("Vi","Po")]; neg=[("Sz","Ko")]
def nb(E):
    N={n:[] for n in names}
    for a,b in E: N[a].append(b); N[b].append(a)
    return N
Np,Nn,Na=nb(pos),nb(neg),nb(pos+neg)
def run(X,w0=1,wp=1,wn=-1):
    x=dict(zip(names,X)); m=lambda L:sum(x[u] for u in L)/len(L) if L else 0
    return {n:(round(w0*x[n]+m(Na[n]),3), round(w0*x[n]+wp*m(Np[n])+wn*m(Nn[n]),3)) for n in names}
print(run([1,0,0,0])); print(run([0,0,0,1])); print(run([0,1,0,0])); print(run([1,0,0,0],wn=-2)); print(run([1,0,0,0],wn=1))
print(5*256,41*256,4*256+40*4+256, 7*1024, 41*4096, 8*4096+40*8+4096)
V1=np.eye(2);V2=np.array([[0,1],[1,0]]); print(1*V1+.5*V2, -1*V1)
