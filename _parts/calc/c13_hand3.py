import numpy as np, networkx as nx, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from c13_data import karate
n,E,club=karate(); G=nx.Graph(E)
print("karate diameter",nx.diameter(G),"avg spl %.2f"%nx.average_shortest_path_length(G))
ecc=nx.eccentricity(G); print("ecc 1:",ecc[0],"34:",ecc[33], "min ecc",min(ecc.values()))
for k in range(1,6):
    print(k, "1 receptive", len(nx.single_source_shortest_path_length(G,0,cutoff=k)), "34:",len(nx.single_source_shortest_path_length(G,33,cutoff=k)))
E5=[(0,1),(0,2),(1,2),(1,3),(3,4)]
A=np.zeros((5,5))
for u,v in E5: A[u,v]=A[v,u]=1
H=np.array([[1,0],[0,1],[0,1],[0,1],[1,0.]])
AH=A@H; print("AH",AH)
W=np.array([[1.],[-0.5]]); print("AHW",(AH@W).ravel(), "relu", np.maximum(0,AH@W).ravel())
# computation tree sizes for A with k layers
def tree(v,k):
    if k==0: return 1
    return 1+sum(tree(u,k-1) for u in np.nonzero(A[v])[0])
print("tree A", [tree(0,k) for k in range(4)], "tree B", [tree(1,k) for k in range(4)])
# karate tree size for node 34 (deg 17)
Ak=nx.to_numpy_array(G, nodelist=range(34))
def leaves(v,k):
    x=np.zeros(34); x[v]=1
    tot=1
    cur=x
    for i in range(k):
        cur=Ak@cur; tot+=cur.sum()
    return tot
print("karate tree 34:", [leaves(33,k) for k in range(5)], "node1:",[leaves(0,k) for k in range(5)])
