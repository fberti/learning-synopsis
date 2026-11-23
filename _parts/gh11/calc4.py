from common import *
from lp import *
# P4 and two triangles spectral
P4=nx.path_graph([1,2,3,4]); Z,w=spectral(P4,2); print("P4 eig",np.round(w,4),{k:np.round(v,3) for k,v in Z.items()})
T=nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)]); Z,w=spectral(T,2); print("twoTri",np.round(w,4),{k:np.round(v,3) for k,v in Z.items()})
F=nx.Graph([("A","B"),("A","C"),("B","C"),("B","D"),("D","E")]); Z,w=spectral(F,2,list("ABCDE")); print("friends",np.round(w,4),{k:np.round(v,3) for k,v in Z.items()})
lab=lambda G: nx.relabel_nodes(G,{i:a for i,a in enumerate(ACT)})
Gf=lab(nx.from_numpy_array(comat(ART)))
Gu=nx.Graph(Gf.edges())
Z,w=spectral(Gu,2,ACT); print("arviz full",np.round(w,4),{k:np.round(v,3) for k,v in Z.items()})
non=[(u,v) for u,v in itertools.combinations(ACT,2) if not Gu.has_edge(u,v)]
print("dist nonedges",sorted([(round(float(np.linalg.norm(Z[u]-Z[v])),3),u,v) for u,v in non]))
# walk example
wk=list("ABDEDBC")
for W_ in (1,2):
    pr=[(wk[i],wk[j]) for i in range(len(wk)) for j in range(max(0,i-W_),min(len(wk),i+W_+1)) if j!=i]
    print("window",W_,len(pr),pr)
    from collections import Counter
    c=Counter(tuple(sorted(p)) for p in pr); print(sorted(c.items()))
# node2vec transition from A->B
for p,q in [(1,1),(4,0.5),(1,2),(0.25,4)]:
    ws={"A":1/p,"C":1,"D":1/q}; s=sum(ws.values()); print("p,q",p,q,{k:round(v/s,4) for k,v in ws.items()})
