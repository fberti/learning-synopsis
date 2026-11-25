from common import *
# 12.1 öt barát
A=np.zeros((5,5)); 
for a,b in [(0,1),(0,2),(1,2),(1,3),(3,4)]: A[a,b]=A[b,a]=1
x=np.array([1,0,0,0,5.]); deg=A.sum(1)
m=A@x/deg; print("mean agg",m.round(3), "h'",np.maximum(0,.5*x+m).round(3))
Ah=A+np.eye(5); dh=Ah.sum(1); P=Ah/np.sqrt(np.outer(dh,dh)); print("GCN Px",(P@x).round(3))
# 12.1 b motiváció: Ko-t ketten említik: Po támogat, Sz bírál
# 12.2 R-GCN 4 szereplő: Ko Vi Po Sz; relations from ARVIZHET (Ko,Vi,Po,Sz)
names=["Ko","Vi","Po","Sz"]
rel=[("Ko","Vi",1),("Sz","Vi",1),("Po","Ko",1),("Vi","Po",1),("Sz","Ko",-1)]
ment={a:sum(a in r[3] for r in ART) for a in names}; spk={}
print("mentions",ment)
