import numpy as np, math
print(2+1-math.sqrt(5), 2*math.sin(math.radians(15)), 2*math.sin(math.radians(45)), np.mean([.5,.5,.2]))
Sz=np.array([1,2.]);Ko=np.array([2,1.])
for r in [(1,-1),(2,0.5)]:
    r=np.array(r); print(r,(Sz*r*Ko).sum(),(Ko*r*Sz).sum())
# TransE symmetric: h+r=t and t+r=h -> r=0
# 1-N: Mo(1,3)+r = Bp(4,4) and Db(4,2): best r=(3,0) ->dist 1 each
Mo=np.array([1,3.]);Bp=np.array([4,4.]);Db=np.array([4,2.])
r=((Bp-Mo)+(Db-Mo))/2; print(r, np.linalg.norm(Mo+r-Bp), np.linalg.norm(Mo+r-Db))
# Budapest query ranking with r=(3,1)
E={"Budapest":(1,1),"Bécs":(1,3),"Prága":(1,5),"Magyarország":(4,2),"Ausztria":(4,4),"Csehország":(4,6)}
q=np.array(E["Bécs"])+np.array([3,1.])
print(sorted((round(float(np.linalg.norm(q-np.array(v))),3),k) for k,v in E.items()))
