import math
s=lambda z:1/(1+math.exp(-z)); relu=lambda z:max(0,z)
w=(-1,2,-1); b=-1
for x in [(0,1,0),(1,1,1),(0,1,1),(1,0,1),(0,0,0),(0.5,1,0.5),(0,0.5,0)]:
    z=sum(a*c for a,c in zip(w,x))+b; print(x,z)
for b in (1,2,0):
    z=0.5*1-1*2+b; print("b",b,"z",z,"relu",relu(z),"sig",round(s(z),4))
print("sig(0)",s(0),"sig(-3)",round(s(-3),4),"sig(3)",round(s(3),4),"sig(1)",round(s(1),4), "sig(-1)",round(s(-1),4),"sig(2)",round(s(2),4))
step=lambda z:1 if z>0 else 0
for name,w,b in [("AND",(1,1),-1.5),("OR",(1,1),-0.5),("NAND",(-1,-1),1.5)]:
    print(name,[step(w[0]*a+w[1]*c+b) for a in (0,1) for c in (0,1)])
print("NOT",[step(-1*a+0.5) for a in (0,1)])
