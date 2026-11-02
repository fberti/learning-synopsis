import itertools
# 4 termék: kenyér(db), tej(l), kávé(csomag), alma(kg); havi
p0=[600,400,2000,500]
best=[]
pr_opts=[[600,660,720,750],[400,440,480,500],[2000,2400,2500,3000],[500,500,550,600]]
q0_opts=[[6,8,10],[8,10,12,15],[2,3],[4,5,6,8]]
for q0 in itertools.product(*q0_opts):
  v0=sum(a*b for a,b in zip(p0,q0))
  if v0!=20000 and v0!=16000 and v0!=24000: continue
  for p1 in itertools.product(*pr_opts):
    L=sum(a*b for a,b in zip(p1,q0))/v0
    if abs(L-1.10)>1e-9: continue
    for q1 in itertools.product(*[[x for x in range(1,25)]]*4):
      pass
    best.append((q0,p1,v0))
print(len(best))
for b in best[:40]: print(b)
