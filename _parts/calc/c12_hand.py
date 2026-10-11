import numpy as np, math
np.set_printoptions(precision=4, suppress=True)
def cos(a,b): a,b=np.array(a,float),np.array(b,float); return a@b/np.linalg.norm(a)/np.linalg.norm(b)
sm=lambda z: np.exp(z-np.max(z))/np.exp(z-np.max(z)).sum()
print("== 12.1 tokens"); s="a film nem volt jó , de a vége remek volt !".split(); print(len(s), len(set(s)))
print("== 12.1 BoW")
D=["a film jó volt","a film nem volt jó","a zene unalmas volt","a film remek"]
V=[]; [V.append(w) for d in D for w in d.split() if w not in V]; print(V)
C=np.array([[d.split().count(w) for w in V] for d in D]); print(C)
for i in range(4):
  print([round(cos(C[i],C[j]),3) for j in range(4)])
print("== 12.1 TF-IDF, ln(N/df)")
N=len(D); df=(C>0).sum(0); idf=np.log(N/df); print(dict(zip(V,np.round(idf,3))))
T=C*idf; print(np.round(T,3))
for i in range(4): print([round(cos(T[i],T[j]),3) if np.linalg.norm(T[j])>0 else None for j in range(4)])
idf_sk=np.log((1+N)/(1+df))+1; print("sklearn idf", dict(zip(V,np.round(idf_sk,3))))
print("log10 idf", dict(zip(V,np.round(np.log10(N/df),3))))
print("== 12.2 one-hot / dense")
print(cos([1,.9,0],[1,.8,0]), cos([1,.9,0],[1,.1,0]), cos([1,.9,0],[0,0,1]))
kir,kirno,ferfi,no=map(np.array,([1,1,0],[1,0,1],[0,1,0],[0,0,1])); print(kir-ferfi+no)
print("== 12.2 co-occurrence")
ctx=["tejet","vizet","iszik","egeret","labdát","kerget","benzint","fogyaszt"]
S=["a macska tejet iszik","a kutya vizet iszik","a macska egeret kerget","a kutya labdát kerget","az autó benzint fogyaszt","a busz benzint fogyaszt"]
def vec(w): return np.array([sum(1 for s in S if w in s.split() and c in s.split()) for c in ctx])
for w in ["macska","kutya","autó","busz"]: print(w, vec(w))
print(cos(vec("macska"),vec("kutya")), cos(vec("autó"),vec("busz")), cos(vec("macska"),vec("autó")))
def pairs(n,w): return sum(min(i,w)+min(n-1-i,w) for i in range(n))
print("skipgram pairs", pairs(4,1), pairs(4,2), pairs(10,2))
print("emb params", 50000*300, 400000*50, 28*8)
print("== 12.3 RNN")
def rnn(xs,w=.5,u=1.,h=0.):
  out=[]
  for x in xs: h=math.tanh(w*h+u*x); out.append(round(h,4))
  return out
print(rnn([1,0,0]), rnn([0,0,1]), rnn([1,0,-1]), rnn([-1,0,1]))
print("params 8->16", 16*8+16*16+16, "100->128", 100*128+128*128, 100*128+128*128+128)
print("van", .5**10, .4**8, 1.6**8, .9**20, 1.1**20, .99**50, .9**50, .5**20)
print("== 12.4 soft lookup")
K=np.array([[2,0],[0,2],[1,1]]); v=np.array([10,20,30])
for q in ([1,0],[3,0],[.5,.5],[0,0]):
  a=sm(K@np.array(q,float)); print(q, np.round(K@np.array(q),3), np.round(a,3), round(a@v,2))
print("== 12.5 self-attn levél")
A=np.array([[2,0],[1,1],[1,0]],float); B=np.array([[0,2],[1,1],[0,1]],float)
for X,nm in ((A,"fa levél hullik"),(B,"posta levél érkezik")):
  S_=X@X.T; print(nm); print(S_); Sc=S_/math.sqrt(2); print(np.round(Sc,3)); W=np.apply_along_axis(sm,1,Sc); print(np.round(W,3)); O=W@X; print(np.round(O,3))
  if nm.startswith("fa"): oa=O[1]
  else: ob=O[1]
print("cos levél A/B", round(cos(oa,ob),3), "without scaling:")
for X in (A,B):
  W=np.apply_along_axis(sm,1,X@X.T); print(np.round(W,3)); print(np.round(W@X,3))
print("== 12.5 sqrt d")
rng=np.random.default_rng(0)
for d in (2,16,64,512):
  q=rng.standard_normal((20000,d)); k=rng.standard_normal((20000,d)); dots=(q*k).sum(1); print(d, round(dots.var(),2), round(dots.std(),2), round((dots/math.sqrt(d)).std(),3))
print(np.round(sm(np.array([1,2,3.])),3), np.round(sm(8*np.array([1,2,3.])),4), np.round(sm(np.array([2,1,0.])),3), np.round(sm(np.array([16,8,0.])),5))
print("n^2", [n*n for n in (5,1000,4096,128000)])
print("mha params 512", 4*512*512, 4*512*512+4*512)
print("== 12.5 PE")
def pe(pos,d): return [math.sin(pos/10000**(2*(i//2)/d)) if i%2==0 else math.cos(pos/10000**(2*(i//2)/d)) for i in range(d)]
for p in range(4): print(p, np.round(pe(p,4),4))
print("== 12.6 params")
blk=lambda d: 12*d*d+13*d
print(blk(16), blk(512), blk(768), blk(1024), blk(12288))
bert=30522*768+512*768+2*768+2*768+12*blk(768)+768*768+768; print("bert-base", bert)
bertL=30522*1024+512*1024+2*1024+2*1024+24*blk(1024)+1024*1024+1024; print("bert-large", bertL)
gpt2=50257*768+1024*768+12*blk(768)+2*768; print("gpt2 small", gpt2)
gpt2xl=50257*1600+1024*1600+48*blk(1600)+2*1600; print("gpt2 xl", gpt2xl)
gpt3=96*blk(12288)+50257*12288+2048*12288; print("gpt3", gpt3)
base=6*blk(512)+6*(16*512*512+ 5*512+ 4*512+ 2048+512 + 2*512)  # rough
print("ours tf", 28*16+15*16+4*(256+16)+32+(16*32+32+32*16+16)+32+17)
x=np.array([1,2,3,6.]); print("LN", x.mean(), x.var(), np.round((x-x.mean())/x.std(),3))
print("== 12.6 mask", [[1/(i+1) if j<=i else 0 for j in range(4)] for i in range(4)])
print("bert mask 512", .15*512, .15*512*.8, .15*512*.1)
print("== 12.7", 2**-0.076, 6*175e9*300e9, 6*70e9*1.4e12, 300/175, 1.4e12/70e9, 15e12/8e9)
print("crossover n vs d: attn n^2 d vs proj 4 n d^2 + ffn 8 n d^2", 512**2*768, 12*512*768**2)
