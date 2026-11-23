# karateklub: 10% tesztél, 100 felosztás (n2v: 30) – a 11.6 táblázata
from common import *
from lp import *
from calc5 import split, evaluate
K=nx.Graph(nx.karate_club_graph().edges()); R=random.Random(2026)
meth=["CN","J","AA","RA","PA","spec2","spec8","ppmi"]; acc={m:[] for m in meth+["n2v"]}; leak={m:[] for m in meth+["n2v"]}
for r in range(100):
    H,test=split(K,0.1,R); ms=meth+(["n2v"] if r<30 else [])
    a=evaluate(K,H,test,R,ms); b=evaluate(K,H,test,R,ms,leakG=K)
    for m in ms: acc[m].append(a[m]); leak[m].append(b[m])
for m in acc: print(m,len(acc[m]),"clean %.3f ± %.3f"%(np.mean(acc[m]),np.std(acc[m])),"leaky %.3f"%np.mean(leak[m]))
