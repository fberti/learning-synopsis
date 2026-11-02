import itertools
p0=[600,400,2000,500]; q0=[10,15,2,8]; p1=[600,440,2500,550]
v0=sum(a*b for a,b in zip(p0,q0)); A=sum(a*b for a,b in zip(p1,q0))
print(v0,A,A/v0)
for q1 in itertools.product(range(6,16),range(8,26),range(1,3),range(4,16)):
  v1=sum(a*b for a,b in zip(p1,q1)); B=sum(a*b for a,b in zip(p0,q1))
  if v1==25000:
    print(q1,v1,B,"Iq0=%.4f P=%.4f Iq1=%.4f F=%.4f"%(B/v0,v1/B,v1/A,((A/v0)*(v1/B))**.5))
