import numpy as np
from scipy import stats as st
N=st.norm; z=N.ppf(.975); zb=N.ppf(.8)
print("200 power",N.cdf(3/1.2-z), "d.5 n40",N.cdf(.5*np.sqrt(20)-z), "n100 delta6", N.cdf(6/(12*np.sqrt(.02))-z))
print("ncb power",np.sqrt(1.5**2/100+1.5**2/50), N.cdf(.4/np.sqrt(1.5**2/100+1.5**2/50)-z), N.cdf(.4/.26-z))
print("7.85",(z+zb)**2, "d for n30",(z+zb)*np.sqrt(2/30), "lehr",2*(z+zb)**2)
print("sqrt", np.sqrt(2*.125*.875), np.sqrt(.09+.1275))
for p1,p2 in [(.1,.15),(.2,.25),(.1,.12)]:
    pb=(p1+p2)/2; n=(z*np.sqrt(2*pb*(1-pb))+zb*np.sqrt(p1*(1-p1)+p2*(1-p2)))**2/(p2-p1)**2; print(p1,p2,n)
print(686/0.9, 686/.9)
