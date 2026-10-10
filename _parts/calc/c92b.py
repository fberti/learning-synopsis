import numpy as np, itertools
X=np.array([[0,0,1],[0,1,1],[1,0,1],[1,1,1]],float); y=np.array([-1,-1,-1,1])
w=np.array([1,1,-1.5]); n=np.linalg.norm(w); g=min(y*(X@w))/n; R=np.sqrt(3); print(n,g,(R/g)**2)
cnt=0
for lab in itertools.product((0,1),repeat=4):
  ok=False
  for w1,w2,b in itertools.product(np.arange(-3,3.01,0.5),np.arange(-3,3.01,0.5),np.arange(-3.25,3.3,0.5)):
    if all(((w1*a+w2*c+b)>0)==bool(l) for (a,c),l in zip([(0,0),(0,1),(1,0),(1,1)],lab)): ok=True;break
  cnt+=ok
  if not ok: print('nonsep',lab)
print('separable',cnt)
