import math, itertools
from fractions import Fraction as F
data = {"1100":3,"0011":2,"1010":2,"0101":2,"1001":1}
N=sum(data.values())
allimg=["".join(p) for p in itertools.product("01",repeat=4)]
p={k:F(data.get(k,0),N) for k in allimg}
H=-sum(float(v)*math.log2(float(v)) for v in p.values() if v)
print("entropy bits",H)
cum=0
for k in data: print(k,float(p[k]),"cum",float(cum),float(cum+p[k])); cum+=p[k]
# chain rule full
def cnt(cond):
    return sum(c for k,c in data.items() if cond(k))
print("p(x1=1)",cnt(lambda k:k[0]=="1")/N)
for a in "01":
    n=cnt(lambda k:k[0]==a); print("p(x2=1|x1=%s)"%a, cnt(lambda k:k[0]==a and k[1]=="1"),"/",n)
# Markov
pm={}
P1=F(cnt(lambda k:k[0]=="1"),N)
def cond(i,a):
    n=cnt(lambda k:k[i-1]==a); m=cnt(lambda k:k[i-1]==a and k[i]=="1"); return F(m,n)
for i in (1,2,3):
    for a in "01": print("Markov p(x%d=1|x%d=%s)="%(i+1,i,a),cond(i,a),float(cond(i,a)))
for k in allimg:
    pr=P1 if k[0]=="1" else 1-P1
    for i in (1,2,3):
        c=cond(i,k[i-1]); pr*= c if k[i]=="1" else 1-c
    pm[k]=pr
print("Markov probs:",{k:float(v) for k,v in pm.items() if v})
print("sum",float(sum(pm.values())))
nll=lambda q: -sum(c*math.log2(float(q[k])) for k,c in data.items())/N
print("NLL table",nll(p),"markov",nll(pm),"uniform",4)
# independent pixels
pi=[F(cnt(lambda k,i=i:k[i]=="1"),N) for i in range(4)]
pind={k:math.prod(float(pi[i]) if k[i]=="1" else 1-float(pi[i]) for i in range(4)) for k in allimg}
print("indep pi",[float(x) for x in pi],"NLL",nll(pind))
print("indep p(1100)",pind["1100"],"p(0110)",pind["0110"], "p(1111)", pind["1111"])
# Laplace smoothing +1
pl={k:F(data.get(k,0)+1,N+16) for k in allimg}
print("laplace 1100",float(pl["1100"]),"0110",float(pl["0110"]), "NLL train", nll(pl))
print("table params 2^4-1=15; 8x8: ",2**64-1, "%.3g"%(2**64-1))
print("Markov p(1011)",float(pm["1011"]),"p(1100)",float(pm["1100"]), "p(0110)", float(pm["0110"]))
