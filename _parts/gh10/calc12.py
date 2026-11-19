from common import *
A,att=krack(); adv,fr,rep=[offdiag(A[k],True) for k in ["advice","friendship","reports"]]
import pandas as pd
df=pd.DataFrame({"adv":adv,"fr":fr,"rep":rep})
print(df.groupby("fr").adv.agg(["count","sum","mean"]))
print(df.groupby("rep").adv.agg(["count","sum","mean"]))
print(df.groupby(["fr","rep"]).adv.agg(["count","sum","mean"]))
print(pd.crosstab(df.fr,df.rep))
print("corr fr rep", np.corrcoef(fr,rep)[0,1])
ten=att["TENURE"].values.astype(float); n=21
TR=np.tile(ten,(n,1)); np.fill_diagonal(TR,0); tr=offdiag(TR,True)
X=np.column_stack([np.ones(420),fr,rep,tr]); b,*_=np.linalg.lstsq(X,adv,rcond=None); res=adv-X@b; print("model2",b, 1-res@res/((adv-adv.mean())@(adv-adv.mean())))
# reciprocal: does i report to j and j is friend? 
