# a 11.4 táblázat és az út-távolságok több tizedesre: ./run.sh qcheck2_digits.py
from common import *
from lp import *
G=nx.Graph(); G.add_nodes_from(ACT); M=comat(ART)
for i in range(7):
    for j in range(i+1,7):
        if M[i,j]: G.add_edge(ACT[i],ACT[j])
Z,w=spectral(G,2,ACT); sg=np.sign(Z["Ko"]); print({k:np.round(v*sg,5) for k,v in Z.items()})
P4=nx.path_graph([1,2,3,4]); Z,w=spectral(P4,2,[1,2,3,4]); print(Z, np.linalg.norm(Z[1]-Z[2]), np.linalg.norm(Z[1]-Z[4]))
