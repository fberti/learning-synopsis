import numpy as np, itertools, math
np.set_printoptions(precision=4, suppress=True)
print("== 10.2 batch noise: per-sample grads")
g=np.array([-6,-2,2,10.]); print("mean",g.mean(),"pop std",g.std())
for B in [1,2,3,4]:
    ms=[np.mean(c) for c in itertools.combinations(g,B)]
    print(B, sorted(ms), "std of batch means", round(np.std(ms),4), "range", min(ms), max(ms))
print("1347/32",1347/32, math.ceil(1347/32), 1347-42*32)
for B,s in [(16,8),(64,8),(256,8)]: print(B, s/np.sqrt(B))
print("== 10.4 graph")
x,y,z=1,2,-3; q=x+y; f=q*z; print(q,f,"df/dz",q,"df/dq",z)
x,y=3,2; f=x*y+x; print("x*y+x",f,"dfdx",y+1,"dfdy",x)
print("== 10.5 momentum const grad 1, beta .9")
v=0; out=[]
for t in range(1,6): v=0.9*v+1; out.append(round(v,4))
print(out, "limit",1/(1-0.9))
v=0; out=[]
for t in range(1,7): v=0.9*v+(1 if t%2 else -1); out.append(round(v,4))
print("alt",out, "1/(1+b)",1/1.9)
# valley GD vs momentum
def run(f_grad, p0, eta, beta, n):
    p=np.array(p0,float); v=np.zeros(2); path=[p.copy()]
    for _ in range(n):
        g=f_grad(p); v=beta*v+g; p=p-eta*v; path.append(p.copy())
    return path
for a in [10,20,25,50]:
  L=lambda p:0.5*(p[0]**2+a*p[1]**2); G=lambda p:np.array([p[0],a*p[1]])
  for eta,beta in [(1.8/a,0),(1/a,0),(1.8/a,0.5),(1/a,0.5),(1/a,0.8)]:
    path=run(G,(10,1),eta,beta,30)
    Ls=[L(p) for p in path]
    print(a,"eta",round(eta,4),"beta",beta,"L0..3",[round(v,3) for v in Ls[:4]],"L10",round(Ls[10],4),"L30",round(Ls[30],6))
print("== ch2 valley x^2+3y^2 from (2,1) eta .3")
G=lambda p:np.array([2*p[0],6*p[1]]); L=lambda p:p[0]**2+3*p[1]**2
for beta in [0,0.5]:
    path=run(G,(2,1),0.1,beta,6); print(beta,[ (round(p[0],3),round(p[1],3)) for p in path],[round(L(p),4) for p in path])
print("== 10.5b Adam first step")
for g in [10,0.1,-3]:
    m=0.1*g; v=0.001*g*g; mh=m/0.1; vh=v/0.001
    print(g,"no corr step/eta",m/np.sqrt(v),"corr",mh/np.sqrt(vh))
print("rmsprop  s after 1 step rho .9", "step/eta", 1/np.sqrt(0.1))
print("== 10.5c schedules")
for t in [0,25,50,75,100]: print("cos",t, round(0.0+0.5*0.1*(1+np.cos(np.pi*t/100)),4))
print("step decay 0.1 at 30,60:", [0.1*(0.1**(e//30)) for e in [0,29,30,59,60,89]])
print("warmup 1000 steps to 3e-4 at step 250:", 3e-4*250/1000)
