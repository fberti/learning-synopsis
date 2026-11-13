import math, itertools
data = ['1100']*3+['0011']*2+['1010']*2+['0101']*2+['1001']
imgs = [''.join(b) for b in itertools.product('01',repeat=4)]
cnt = {x:data.count(x) for x in imgs}
table = {x:cnt[x]/10 for x in imgs}
p = [sum(int(d[i]) for d in data)/10 for i in range(4)]
indep = {x: math.prod(p[i] if x[i]=='1' else 1-p[i] for i in range(4)) for x in imgs}
def cond(i, prev):
    # p(x_i=1 | x_{i-1}=prev)
    s=[d for d in data if d[i-1]==prev]; return sum(int(d[i]) for d in s)/len(s)
def mk(x):
    pr = p[0] if x[0]=='1' else 1-p[0]
    for i in range(1,4):
        q=cond(i,x[i-1]); pr*= q if x[i]=='1' else 1-q
    return pr
markov={x:mk(x) for x in imgs}
lap={x:(cnt[x]+1)/26 for x in imgs}
print('p',p, [ (i,v,cond(i,v)) for i in range(1,4) for v in '01'])
for name,m in [('table',table),('indep',indep),('markov',markov),('laplace',lap)]:
    nll=-sum(math.log2(m[d]) for d in data)/10
    print(name, round(nll,3), sum(1 for x in imgs if m[x]>0), round(sum(m.values()),6), {x:round(m[x],4) for x in imgs})
def kl(mu,s): return 0.5*(mu*mu+s*s-1-math.log(s*s))
for mu,s in [(0,1),(1,.5),(2,.5),(0,.1),(0,2),(.5,.5)]: print(mu,s,round(kl(mu,s),3), round(mu*mu/2,3), round(.5*(s*s-1-math.log(s*s)),3))
from math import erf,sqrt
def ovl(s):
    # overlap of N(1,s) and N(-1,s): 2*Phi(-1/s)
    return 2*0.5*(1+erf(-1/s/sqrt(2)))
for s in [0.05,0.1,0.2,0.3,0.5,0.7,1,1.5,2,3]: print('ovl',s,round(ovl(s),4))
