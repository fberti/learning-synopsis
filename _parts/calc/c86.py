import numpy as np
nan=np.nan
U=['Anna','Bence','Csilla','Dávid']; B=['K1','K2','S1','S2']
R=np.array([[5,4,1,nan],[4,5,2,1],[1,2,5,4],[5,5,2,2]],float)
def cos(a,b): return a@b/np.linalg.norm(a)/np.linalg.norm(b)
a=R[0,:3]
for i in range(1,4):
    b=R[i,:3]
    ac=a-a.mean(); bc=b-np.nanmean(R[i]) 
    bc2=b-b.mean()
    print(U[i],'cos',round(cos(a,b),4),'centered(own full mean)',round(cos(ac,bc),4),'pearson corated',round(cos(ac,bc2),4), 'mean',np.nanmean(R[i]))
sims=np.array([cos(a,R[i,:3]) for i in range(1,4)])
r=R[1:,3]
print('weighted all',(sims*r).sum()/sims.sum())
top=np.argsort(-sims)[:2]; print('top2',[U[1+t] for t in top],(sims[top]*r[top]).sum()/sims[top].sum())
# mean-centred prediction with pearson on co-rated
mA=np.nanmean(R[0])
ps=[]; 
for i in range(1,4):
    b=R[i,:3]; ac=a-a.mean(); bc=b-b.mean(); ps.append(cos(ac,bc))
ps=np.array(ps); means=np.array([np.nanmean(R[i]) for i in range(1,4)])
print('pearson',ps, 'means',means)
pred=mA+(ps*(r-means)).sum()/np.abs(ps).sum(); print('centered pred all',pred)
pos=ps>0; print('centered pred pos only',mA+(ps[pos]*(r[pos]-means[pos])).sum()/ps[pos].sum())
