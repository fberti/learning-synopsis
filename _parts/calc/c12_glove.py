import sys
from gensim.models import KeyedVectors
import numpy as np
kv = KeyedVectors.load(sys.argv[1])
print(len(kv.index_to_key), kv.vector_size)
def an(a,b,c,n=5, excl=True):
    v = kv[b]-kv[a]+kv[c]
    sims = kv.cosine_similarities(v, kv.vectors)
    idx = np.argsort(-sims)
    out=[]
    for i in idx:
        w=kv.index_to_key[i]
        if excl and w in (a,b,c): continue
        out.append((w, round(float(sims[i]),3)))
        if len(out)>=n: break
    return out
for a,b,c in [("man","king","woman"),("france","paris","italy"),("france","paris","hungary"),("big","bigger","small"),("walk","walked","swim"),("man","doctor","woman"),("man","programmer","woman")]:
    print(a,b,c, an(a,b,c), an(a,b,c,3,False))
for w in ["king","cat","bank","budapest","apple"]:
    print(w, kv.most_similar(w, topn=8))
for p in [("cat","dog"),("cat","car"),("king","queen"),("good","bad"),("bank","river"),("bank","money")]:
    print(p, round(float(kv.similarity(*p)),3))
