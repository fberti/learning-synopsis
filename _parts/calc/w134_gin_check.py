# 13.11-b: a w4.js élő GIN-je vs. PyTorch GraphNet (ugyanazokkal a JSON-súlyokkal). Futtatás: ./t13.sh w134_gin_check.py
import json, os, sys
import numpy as np, torch
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from c13_exp import GraphNet, batch_graphs
txt = open(os.path.join(D, "..", "..", "mesterseges-intelligencia", "13-graf-neuralis-halok", "mutag-data.js"), encoding="utf8").read()
M = json.loads(txt[txt.index("{"): txt.rindex("}") + 1])
net = GraphNet("gin", "sum", "sum", dh=16, L=3)
net.load_state_dict({k: torch.tensor(v, dtype=torch.float32) for k, v in M["weights"].items()})
net.eval()
cases = json.load(open(os.path.join(D, "w134_gin_js.json")))
gs = [dict(n=len(c["atoms"]), atoms=c["atoms"], edges=c["edges"]) for c in cases]
X, A, gid, G = batch_graphs(gs)
with torch.no_grad():
    p = torch.softmax(net(X, A, gid, G), 1)[:, 1].numpy().astype(float)
pj = np.array([c["p"] for c in cases])
d = np.abs(p - pj)
print("esetek: %d (188 eredeti + %d szerkesztett); max |JS - PyTorch| = %.2e (eredeti: %.2e, szerkesztett: %.2e)" % (len(cases), len(cases) - 188, d.max(), d[:188].max(), d[188:].max()))
y = np.array([m["y"] for m in M["mols"]])
print("PyTorch pontosság a 188-on: %.4f" % ((p[:188] > 0.5) == y).mean())
for k in range(5): print(cases[k]["name"], "JS %.6f  torch %.6f" % (pj[k], p[k]))
