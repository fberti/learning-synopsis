# exact DP: bipartite null, pair overlaps
import itertools
from collections import defaultdict
from math import comb
rows=[2,3,2,2,3,2,2,3,2,2,2,2]
cols=(4,4,6,4,4,3,2)  # Ko Vi Po La Ön Sz Kl
def dist(pair):
  a,b=pair
  st={((0,)*7,0):1}
  for r in rows:
    nst=defaultdict(int)
    subs=list(itertools.combinations(range(7),r))
    for (cs,ov),c in st.items():
      for s in subs:
        ncs=list(cs); ok=True
        for x in s:
          ncs[x]+=1
          if ncs[x]>cols[x]: ok=False;break
        if not ok: continue
        nov=ov+(a in s and b in s)
        nst[(tuple(ncs),nov)]+=c
    st=nst
  tot=defaultdict(int)
  for (cs,ov),c in st.items():
    if cs==cols: tot[ov]+=c
  T=sum(tot.values())
  return T,{k:v/T for k,v in sorted(tot.items())}
names=["Ko","Vi","Po","La","Ön","Sz","Kl"]
obs={(3,4):3,(0,1):2,(5,6):2,(2,3):2,(0,2):2,(1,2):2,(0,5):1,(1,5):1,(0,6):1,(2,4):2}
for p,o in obs.items():
  T,d=dist(p)
  E=sum(k*v for k,v in d.items()); pv=sum(v for k,v in d.items() if k>=o)
  print(names[p[0]],names[p[1]],"obs",o,"E",round(E,3),"P>=",round(pv,4),{k:round(v,4) for k,v in d.items()},"T",T)
