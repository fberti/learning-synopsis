import numpy as np
from scipy import stats as st
N=st.norm
print("1",4/2.5,2*N.sf(1.6))
d=np.array([1,3,2,5,4]); print("2",d.mean(),d.var(ddof=1),st.ttest_1samp(d,0))
v1,v2=16/25,36/25; se=np.sqrt(v1+v2); df=(v1+v2)**2/(v1**2/24+v2**2/24); print("3",se,4/se,df,2*st.t.sf(4/se,df), st.t.ppf(.975,df))
print("4",2.5,st.f.ppf(.975,15,20),2*st.f.sf(2.5,15,20))
z=(0.54-0.5)/np.sqrt(.25/1000); print("5",z,2*N.sf(z))
print("7",2*64*(1.959964+N.ppf(.8))**2/16)
c=15*144/100; print("8",c,st.chi2.ppf([.025,.975],15),2*min(st.chi2.sf(c,15),st.chi2.cdf(c,15)))
