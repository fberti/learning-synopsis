import itertools
p0=[600,400,2000,500]; q0=[10,15,2,8]
v0=sum(a*b for a,b in zip(p0,q0))
res=[]
for p1 in itertools.product([600,630,660,690,720,750],[400,420,440,460,480],[2400,2500,2600,3000],[500,525,550,600]):
  A=sum(a*b for a,b in zip(p1,q0))
  if A!=22000: continue
  ip=[a/b for a,b in zip(p1,p0)]
  if abs(sum(ip)/4-1.1)<0.004: continue
  # kávé drágul a legjobban
  if ip[2] < max(ip): continue
  for q1 in itertools.product(range(9,12),range(15,25),[1],range(8,16)):
    v1=sum(a*b for a,b in zip(p1,q1)); B=sum(a*b for a,b in zip(p0,q1))
    if v1==25000 and B!=23000 and v1/B<1.1 and B%100==0:
      res.append((p1,[round(x,3) for x in ip],q1,B,round(v1/B,4),round(B/v0,4),round(v1/A,4),round(sum(ip)/4,4)))
for r in res: print(r)
