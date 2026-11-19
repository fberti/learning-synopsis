# szövegbeli számok pontosabb ellenőrzése (8.5, 8.7)
import numpy as np, networkx as nx, json, re
from pathlib import Path
from networkx.algorithms import community as nxc
T = nx.Graph([(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)])
A = nx.to_numpy_array(T, nodelist=range(1,7)); k = A.sum(1); B = A - np.outer(k,k)/14
ev, V = np.linalg.eigh(B); print("eigvec", np.round(V[:,-1]*np.sign(V[0,-1]), 4))
kd = json.loads(re.search(r"window\.KARATE13 = (\{.*?\});", (Path(__file__).resolve().parent/"../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js").read_text()).group(1))
K = nx.Graph(); K.add_edges_from((a+1,b+1) for a,b in kd["edges"])
Ak = nx.to_numpy_array(K, nodelist=range(1,35)); kk = Ak.sum(1); Bk = Ak - np.outer(kk,kk)/156
v = np.linalg.eigh(Bk)[1][:,-1]; p = [{i+1 for i in range(34) if v[i]>0}, {i+1 for i in range(34) if v[i]<=0}]
print("modmatrix Q", nxc.modularity(K, p))
print("z deg-pres from rounded", (0.420-0.298)/0.015)
