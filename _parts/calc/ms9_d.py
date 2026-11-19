import numpy as np
from scipy import stats as st
A=[72,75,78,80,81,83,85,90]; B=[65,68,70,72,74,76,79,82]
print("welch 8+8", st.ttest_ind(A,B,equal_var=False))
f=[1,1]; 
while len(f)<1000: f.append(f[-1]+f[-2])
c=np.bincount([int(str(x)[0]) for x in f],minlength=10)[1:]; print("fib1000",c)
rng=np.random.default_rng(1)
for q in (0.25,0.3):
    p=np.array([(1-q)/5]*5+[q])
    for n in (60,120,300,600):
        X=rng.multinomial(n,p,size=20000); chi=((X-n/6)**2/(n/6)).sum(1); print("power q",q,"n",n, (chi>=11.0705).mean().round(3))
X=rng.multinomial(60,[1/6]*6,size=40000); chi=((X-10)**2/10).sum(1); print("H0 n60 rej", (chi>=11.0705).mean())
