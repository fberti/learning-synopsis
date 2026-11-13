# q1.js (ai14-141..145) – minden szám ellenőrzése
from math import log, log2, log10, exp, e
from itertools import product
data = {'1100':3,'0011':2,'1010':2,'0101':2,'1001':1}
N = 10
imgs = [''.join(b) for b in product('01', repeat=4)]
emp = {x: data.get(x,0)/N for x in imgs}
pi = [sum(int(x[i])*c for x,c in data.items())/N for i in range(4)]
def ind(x): 
    r=1
    for i,ch in enumerate(x): r*= pi[i] if ch=='1' else 1-pi[i]
    return r
print("== 14.1"); print("p_i", pi)
print("p(0011|vizsz)", 2/5)
print("u=0.5 -> intervals", [(x, sum(emp[y] for y in ['1100','0011','1010','0101','1001'][:k])) for k,x in enumerate(['1100','0011','1010','0101','1001'])])
print("ind p(0110)", ind('0110'), "ind p(1111)", ind('1111'), "unif", 1/16)
print("Laplace 1001", 2/26, "2/11", 2/11, "2/16", 2/16)
print("surprise 1001: log2", -log2(.1), "lg", -log10(.1), "ln", -log(.1), "1/p", 1/.1)
nll = lambda p: -sum(c*log2(p(x)) for x,c in data.items())/N
print("NLL emp", nll(lambda x: emp[x]), "ind", nll(ind), "lap", nll(lambda x:(data.get(x,0)+1)/26))
print("== 14.2")
def cond(prefix, val):
    m=[(x,c) for x,c in data.items() if x.startswith(prefix)]
    tot=sum(c for _,c in m); return sum(c for x,c in m if x[len(prefix)]==val)/tot
def chain(x):
    r=1
    for i in range(4): r*=cond(x[:i], x[i])
    return r
print("chain 1010", chain('1010'), "first3", cond('','1')*cond('1','0'))
# Markov
def mk(i, prev, val):
    m=[(x,c) for x,c in data.items() if i==0 or x[i-1]==prev]
    tot=sum(c for _,c in m); return sum(c for x,c in m if x[i]==val)/tot
def markov(x):
    r=mk(0,None,x[0])
    for i in range(1,4): r*=mk(i,x[i-1],x[i])
    return r
print("markov 0010", markov('0010'), "w/o last", markov('0010')/mk(3,'1','0'), "ind 0010", ind('0010'))
print("markov NLL", nll(markov), "n drawable", sum(markov(x)>0 for x in imgs))
print("params 3x3", sum(range(1,10)), "no bias", sum(range(9)), "full", 2**9-1)
s=lambda z:1/(1+exp(-z))
print("sig(2/2)", s(1), "sig(4)", s(4), "sig(2)", s(2), "sig(.5)", s(.5))
print("completion 10 -> atlo", cond('10','0')*cond('100','1'), "bal", cond('10','1'))
print("bit/pixel", 25.9/64, 36.3/64, 64/25.9, "diff", 36.3-25.9, 2**10.4)
print("== 14.3")
def enc(x): return (.5*(x[0]+x[1]-x[2]-x[3]), .5*(x[0]-x[1]+x[2]-x[3]))
def dec(z): 
    a=(.5,.5,-.5,-.5); b=(.5,-.5,.5,-.5); return tuple(round(.5+z[0]*a[i]+z[1]*b[i],4) for i in range(4))
print("code 0111", enc((0,1,1,1)))
r=dec(enc((0,1,1,0))); print("0110 recon", r, "err", sum((p-q)**2 for p,q in zip(r,(0,1,1,0))))
print("compress", 64*64/32, 64*64*3/32)
noisy=(0.9,0.1,1.2,-0.2); z=enc(noisy); r=dec(z); print("noisy bal", z, r,
  "err before", sum((p-q)**2 for p,q in zip(noisy,(1,0,1,0))), "after", sum((p-q)**2 for p,q in zip(r,(1,0,1,0))))
print("sign flip z2", dec((z[0],-z[1])))
zt=tuple(.75*a+.25*b for a,b in zip((0,1),(0,-1))); print("interp t=.25", zt, dec(zt), "reverse", dec((0,-.5)))
print("== 14.4")
print("z", .5+.2*-1.5, .5+.2-1.5, .5+.04*-1.5, .5+.2*1.5)
KL=lambda m,sg: .5*(m*m+sg*sg-1-log(sg*sg))
print("KL(0,.5)", KL(0,.5), "noHalf", 2*KL(0,.5), "ln sigma", .5*(.25-1-log(.5)), "no log", .5*(.25-1))
print("sigma from lnvar=-4", exp(-2), exp(-4), exp(2))
print("blur", tuple(round(.6*a+.4*b,3) for a,b in zip((1,1,0,0),(0,1,0,1))))
print("KL match", KL(0,1), KL(2,1), KL(0,.1), KL(0,2))
print("== 14.5")
print("D*", .1/.5, .1/.4, .4/.5)
print("LD", -log(.9)-log(.6), -log(.9)-log(.4), -log2(.9)-log2(.6), -log(.9))
print("LG", -log(.2), log(.8), -log(.8), -log2(.2))
print("ratio", .95/.05, 1/.05)
print("D*(0011) if pG=.5/.5", .2/.7, .2/.5, .5/.7, "D*(1100)", .3/.8)
print("eq", 2*log(2), log(2), 2*1)
print("D*=.75 -> pdata/pG", .75/.25, 1/.75)
