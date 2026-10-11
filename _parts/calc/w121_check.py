import math, json, re
docs=["a film jó volt","a film nem volt jó","a zene unalmas volt","a film remek"]
tok=lambda s: re.sub(r'([,.!?])',r' \1 ',s.lower()).split()
T=[tok(d) for d in docs]; V=[]
for t in T:
    for w in t:
        if w not in V: V.append(w)
cnt=[[t.count(w) for w in V] for t in T]
cos=lambda a,b: sum(x*y for x,y in zip(a,b))/math.sqrt(sum(x*x for x in a)*sum(y*y for y in b))
print(V); print("cnt cos12 %.3f cos13 %.3f"%(cos(cnt[0],cnt[1]),cos(cnt[0],cnt[2])))
N=len(docs); df=[sum(1 for t in T if w in t) for w in V]
idf=[math.log(N/d) for d in df]; print({w:round(i,3) for w,i in zip(V,idf)})
tf=[[c*i for c,i in zip(r,idf)] for r in cnt]; print("tfidf cos12 %.3f"%cos(tf[0],tf[1]))
sk=[math.log((1+N)/(1+d))+1 for d in df]; print({w:round(i,3) for w,i in zip(V,sk)})
# same words
d2=["a film jó volt , de a vége unalmas volt","a film unalmas volt , de a vége jó volt"]
T2=[tok(d) for d in d2]
def feats(T,bi):
    out=[]
    for t in T:
        f=list(t)
        if bi: f+= [t[i]+"·"+t[i+1] for i in range(len(t)-1)]
        out.append(f)
    V=[]
    for f in out:
        for w in f:
            if w not in V: V.append(w)
    return [[f.count(w) for w in V] for f in out]
for bi in (0,1):
    c=feats(T2,bi); print("same words bi=%d cos=%.4f"%(bi,cos(c[0],c[1])))
# RNN
def rnn(xs,w=.5,u=1):
    h=0; H=[]
    for x in xs: h=math.tanh(w*h+u*x); H.append(h)
    return H
print([round(v,4) for v in rnn([1,0,-1])],[round(v,4) for v in rnn([-1,0,1])],[round(v,4) for v in rnn([1,0,0])])
H=rnn([1]+[0]*10); g=1
for s in range(1,11): g*=0.5*(1-H[s]**2)
print("grad 10 steps after jo:",g, 0.5**10)
# soft lookup
K=[(2,0),(0,2),(1,1)]; Vv=[10,20,30]
def sm(z):
    m=max(z); e=[math.exp(v-m) for v in z]; s=sum(e); return [v/s for v in e]
for q,b in [((1,0),1),((3,0),1),((1,0),3),((0,0),1)]:
    s=[b*(q[0]*k[0]+q[1]*k[1]) for k in K]; a=sm(s); print(q,b,[round(x,3) for x in a], round(sum(x*v for x,v in zip(a,Vv)),2))
