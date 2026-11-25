import numpy as np, random
def train(E,R,T,steps=400,lr=0.05,g=1.0,seed=1,wd=0.0):
    rnd=random.Random(seed); E={k:np.array(v,float) for k,v in E.items()}; R={k:np.array(v,float) for k,v in R.items()}
    pos=set(T); names=list(E)
    for it in range(steps):
        L=0
        for (h,r,t) in T:
            for _ in range(20):
                if rnd.random()<.5: n=(h,r,rnd.choice([x for x in names if x!=t]))
                else: n=(rnd.choice([x for x in names if x!=h]),r,t)
                if n not in pos: break
            else: continue
            dp=E[h]+R[r]-E[t]; dn=E[n[0]]+R[r]-E[n[2]]
            a,b=np.linalg.norm(dp),np.linalg.norm(dn); l=g+a-b
            L+=max(0,l)
            if l>0:
                up=dp/(a or 1e-9); un=dn/(b or 1e-9)
                E[h]-=lr*up; R[r]-=lr*up; E[t]+=lr*up
                E[n[0]]+=lr*un; R[r]+=lr*un; E[n[2]]-=lr*un
        for k in R: R[k]*= (1-wd)
        for k in E: E[k]=np.clip(E[k],-1,7)
    return E,R,L/len(T)
for wd in [0,0.01]:
    print("wd",wd)
    print(train({"B":(1,1),"Be":(1,3),"P":(1,5),"M":(4,2),"A":(4,4),"C":(4,6)},{"f":(3,1)},[("B","f","M"),("Be","f","A"),("P","f","C")],wd=wd))
    print(train({"M":(1,3),"Bp":(4,4),"D":(4,2)},{"v":(3,0)},[("M","v","Bp"),("M","v","D")],wd=wd))
    print(train({"A":(1,1),"B":(4,3)},{"h":(3,2)},[("A","h","B"),("B","h","A")],wd=wd))
print("----")
for g in [1,2,3]:
  for r0 in [(1,0),(3,0),(0,-2)]:
    E,R,L=train({"M":(1,3),"Bp":(4,4),"D":(4,2)},{"v":r0},[("M","v","Bp"),("M","v","D")],g=g,steps=1000)
    print("1N g",g,r0,np.round(np.linalg.norm(E["Bp"]-E["D"]),3),np.round(R["v"],2),round(L,3))
  for r0 in [(3,2),(0,0.5),(-1,1)]:
    E,R,L=train({"A":(1,1),"B":(4,3)},{"h":r0},[("A","h","B"),("B","h","A")],g=g,steps=1000)
    print("sym g",g,r0,np.round(np.linalg.norm(E["A"]-E["B"]),3),np.round(R["h"],2),round(L,3))
print("==== r-decay")
for wd in [0.002,0.005,0.01]:
  for g in [1,2]:
    E,R,L=train({"M":(1,3),"Bp":(4,4),"D":(4,2)},{"v":(3,0)},[("M","v","Bp"),("M","v","D")],g=g,steps=1500,wd=wd)
    E2,R2,L2=train({"A":(1,1),"B":(4,3)},{"h":(3,2)},[("A","h","B"),("B","h","A")],g=g,steps=1500,wd=wd)
    E3,R3,L3=train({"B":(1,1),"Be":(1,3),"P":(1,5),"M":(4,2),"A":(4,4),"C":(4,6)},{"f":(3,1)},[("B","f","M"),("Be","f","A"),("P","f","C")],g=g,steps=1500,wd=wd)
    print(wd,g,"1N",round(np.linalg.norm(E["Bp"]-E["D"]),3),np.round(R["v"],2),round(L,3),"| sym",round(np.linalg.norm(E2["A"]-E2["B"]),3),np.round(R2["h"],2),round(L2,3),"| cap",np.round(R3["f"],2),round(L3,3))
