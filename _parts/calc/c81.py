import numpy as np, itertools, math
# step a: 4 customers 1D: A 2, B 3, F 11, E 15
x = {'A':2,'B':3,'F':11,'E':15}
names=list(x)
def sse(g): 
    v=[x[n] for n in g]; m=sum(v)/len(v); return sum((t-m)**2 for t in v)
seen=set()
for r in range(1,4):
    for g in itertools.combinations(names,r):
        h=tuple(n for n in names if n not in g)
        key=frozenset([g,h])
        if key in seen: continue
        seen.add(key)
        print(g,h, sse(g), sse(h), sse(g)+sse(h))
# Stirling S(n,2)
for n in [4,10,20,100]: print(n, 2**(n-1)-1)
def S(n,k): return sum((-1)**j*math.comb(k,j)*(k-j)**n for j in range(k+1))//math.factorial(k)
print(S(10,3),S(10,4),S(19,4),S(100,3), f"{S(100,3):.3e}")
# 2D SSE of group A,B,C,G
P={'A':(2,25),'B':(3,30),'C':(2,28),'D':(12,5),'E':(15,4),'F':(11,6),'G':(3,27),'H':(14,5)}
def sse2(g):
    a=np.array([P[n] for n in g],float); m=a.mean(0); return ((a-m)**2).sum(), m
print(sse2('ABCG'), sse2('DEFH'))
print(sse2('ABG'), sse2('DEF'))
