import numpy as np
from scipy import stats as st
def g(o,e,dd=0):
    o=np.array(o,float);e=np.array(e,float);x=((o-e)**2/e).sum();df=len(o)-1-dd;return round(x,3),df,round(st.chi2.sf(x,df),4)
print(g([30,20],[25,25]))
print(g([18,22,20,25,15,20],[20]*6))
print(g([54,26],[60,20]))
print("die60 contrib", [(f-10)**2/10 for f in [8,9,12,11,6,14]])
print("pct mistake: die60 as pct", g(np.array([8,9,12,11,6,14])/60*100,[100/6]*6))
print("die600 same props", g(np.array([8,9,12,11,6,14])*10,[100]*6))
print("juror contrib", [round((o-e)**2/e,3) for o,e in zip([205,26,25,19],[198,19.25,33,24.75])])
for x,df in [(4.2,5),(4,1),(9,3),(3,2),(12,4),(7.5,4),(15,5),(2.5,3)]: print("p",x,df,round(st.chi2.sf(x,df),4))
# blood types: A 40 0 B 10 AB 5 ... hungarian: A 44%, 0 31%, B 17%, AB 8%; sample 200: 80, 70, 30, 20
print("blood", g([80,70,30,20],[88,62,34,16]))
# horse contributions
E=[108.67,66.29,25.04]; print([round((o-e)**2/e,4) for o,e in zip([109,65,26],E)])
# poisson practice: calls per minute 100 minutes: 0:30,1:38,2:20,3+:12 
k=np.array([0,1,2,3,4]); f=np.array([30,38,20,9,3]); lam=(k*f).sum()/f.sum(); p=st.poisson.pmf([0,1,2],lam); p=np.append(p,1-p.sum()); print("calls lam",lam, np.round(100*p,2), g([30,38,20,12],100*p,1))
