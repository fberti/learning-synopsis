# graph-data.js: karateklub (élek, klub, elrendezés) a widgetekhez
import json, sys, os
import numpy as np, networkx as nx
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from c13_data import karate
n, E, club = karate()
G = nx.Graph(); G.add_nodes_from(range(n)); G.add_edges_from(E)
pos = nx.kamada_kawai_layout(G)
P = np.array([pos[i] for i in range(n)])
P = (P - P.min(0)) / (P.max(0) - P.min(0))
# Mr. Hi (0) balra
if P[0, 0] > P[33, 0]: P[:, 0] = 1 - P[:, 0]
data = dict(n=n, edges=[list(e) for e in E], club=club.tolist(), xy=np.round(P, 3).tolist(),
            src="W. W. Zachary (1977): An information flow model for conflict and fission in small groups; élek: NetworkX karate_club_graph")
out = "../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js"
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w").write("window.KARATE13 = " + json.dumps(data, separators=(",", ":")) + ";\n")
print("ok", len(E), P[0], P[33])
