import numpy as np
from scipy import stats as st
N=st.norm
se=np.sqrt(.1*.9/200+.17*.83/200); print("KI unpooled",se,.07-1.959964*se,.07+1.959964*se, "pooled",.07-1.96*.0342,.07+1.96*.0342)
print("600",(0.35-.4)/.02, 2*N.cdf(-2.5), np.sqrt(.35*.65/600), -0.05/np.sqrt(.35*.65/600))
print("crit phat",0.15-1.645*np.sqrt(.15*.85/400), 400*(0.15-1.645*np.sqrt(.15*.85/400)))
se=np.sqrt(.25*.75*.02); print("30v20",se,.1/se,2*N.sf(.1/se))
pp=(200+230)/4000; se=np.sqrt(pp*(1-pp)*.001); print("2000",pp,se,.015/se,2*N.sf(.015/se))
print("chi2=z2",2.0484**2, st.chi2_contingency([[20,180],[34,166]],correction=False)[:2])
print("chi2 tests", st.chi2.ppf(.05,24), 24*49/100, st.chi2.cdf(11.76,24), st.chi2.ppf([.025,.975],10))
print("t table",[round(st.t.ppf(.975,d),3) for d in (2,4,9,15,29,99)], st.t.ppf(.975,5), st.t.ppf(.95,5), st.t.ppf(.975,35), st.t.ppf(.975,9), st.t.ppf(.975,3))
print("joghurt t p",2*st.t.sf(3.5777,19))
print("konz t", -2/(13.27/np.sqrt(15)), 2*st.t.sf(0.5837,14))
print("246 vs 579", st.ttest_ind([2,4,6],[5,7,9]))
print("10 stores t", 120/(300/np.sqrt(10)), 2*st.t.sf(120/(300/np.sqrt(10)),9))
print("ncb sp",np.sqrt((99*1.6**2+49*1.43**2)/148))
print("Phi(-1.15)",N.cdf(-1.15), N.ppf(.125))
