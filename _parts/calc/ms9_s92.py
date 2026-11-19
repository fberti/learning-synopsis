import numpy as np
from scipy import stats as st
def ct(t):
    r=st.chi2_contingency(np.array(t),correction=False); return round(r[0],3), r[2], round(r[1],4), np.round(r[3],2).tolist(), np.round((np.array(t)-r[3])**2/r[3],3).tolist()
for t in ([[20,180],[34,166]],[[60,30,10],[45,40,15]],[[120,60,20],[90,80,30]],
          [[30,70],[45,55]], [[12,8],[6,14]], [[40,35,25],[30,40,30],[20,45,35]], [[25,15,10],[15,20,15]],
          [[50,50],[30,70],[20,80]]):
    print(t, ct(t))
# z for 30/100 vs 45/100
p=75/200; z=(0.45-0.30)/np.sqrt(p*(1-p)*(2/100)); print("z",z,z*z)
