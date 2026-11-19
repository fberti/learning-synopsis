from scipy import stats as st
from math import comb
for t in ([[3,1],[1,3]],[[5,0],[1,4]],[[6,2],[1,7]],[[4,1],[1,4]],[[2,3],[3,2]],[[8,2],[3,7]],[[9,1],[4,6]]):
    print(t, round(st.fisher_exact(t).pvalue,4), round(st.fisher_exact(t,alternative="greater").pvalue,4), st.chi2_contingency(t,correction=False)[3].min().round(2))
print("5,0/1,4 dist margins r1=5 c1=6 N=10:", [comb(6,k)*comb(4,5-k) for k in range(1,6)], comb(10,5))
print("4,1/1,4:", [comb(5,k)*comb(5,5-k) for k in range(0,6)], comb(10,5))
