import numpy as np
from scipy import stats as st
def ct(t,c=False):
    t=np.array(t); r=st.chi2_contingency(t,correction=c); E=r[3]; N=t.sum(); V=np.sqrt(r[0]/(N*(min(t.shape)-1)))
    return dict(chi=round(r[0],3), df=r[2], p=round(r[1],4), V=round(V,3), E=np.round(E,2).tolist(), res=np.round((t-E)/np.sqrt(E),2).tolist())
for t in ([[10,30],[20,40]],[[40,45,15],[30,50,20],[10,40,50]],[[6,24],[18,32]],[[18,2],[5,25]],[[2,2],[1,5]],[[30,70],[20,80]],[[300,700],[200,800]]):
    print(t, ct(t))
print("yates dohany", ct([[30,70],[20,80]],True)['chi'], ct([[30,70],[20,80]],True)['p'])
print("yates 6/24", ct([[6,24],[18,32]],True))
