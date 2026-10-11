# ai13-1311 kvíz számainak ellenőrzése
# futtatás: python3 -I _parts/calc/q1311_check.py  (a synopsis gyökeréből)
import json, os, math
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
D = os.path.join(ROOT, "mesterseges-intelligencia", "13-graf-neuralis-halok")

def load(name, var):
    s = open(os.path.join(D, name)).read()
    return json.loads(s[s.index("=") + 1:].strip().rstrip(";"))

c = load("cora-data.js", "CORA13")
n = c["n"]; y = c["y"]; deg = [0] * n
for u, v in c["edges"]:
    deg[u] += 1; deg[v] += 1
print("Cora élek:", len(c["edges"]), "homofília: %.3f" % (sum(y[u] == y[v] for u, v in c["edges"]) / len(c["edges"])))
test = c["test"]
for lo, hi in [(1, 1), (2, 3), (4, 10**6)]:
    m = [i for i in test if lo <= deg[i] <= hi]
    g = sum(c["predGCN"][i] == y[i] for i in m) / len(m)
    p = sum(c["predMLP"][i] == y[i] for i in m) / len(m)
    print("fokszám %d–%d: %d teszt, GCN %.3f MLP %.3f" % (lo, hi, len(m), g, p))
print("export acc", c["acc"])

# Q1/Q8: Cora-táblázat különbségei
mlp, lp, gcn, sage, gat, maj = 58.6, 69.9, 82.2, 81.4, 82.6, 31.9
print("GCN-MLP %.1f, GCN-LP %.1f, GCN-maj %.1f, rel %.1f%%" % (gcn - mlp, gcn - lp, gcn - maj, (gcn - mlp) / mlp * 100))
print("GAT-GCN %.1f, GCN-SAGE %.1f; szórások 0,7 0,5 0,8" % (gat - gcn, gcn - sage))
# paraméterszámok
print("GCN", 1433*16+16+16*7+7, "MLP(64)", 1433*64+64+64*7+7,
      "SAGE", 2*1433*16+16+2*16*7+7, "GAT 8x8", 1433*64+2*64+64+64*7+2*7+7, "GAT/GCN %.2f" % (92373/23063))

# Q2 (hajtás): 188 molekula, 10 hajtás
print("hajtásméret", 188/10, "1/19 = %.2f pp, 1/18 = %.2f pp, 1/188 = %.2f pp, 1/10 = %.0f pp" % (100/19, 100/18, 100/188, 100/10))
# mindig mutagén
print("125/188 = %.1f%%" % (125/188*100))
# MUTAG táblázat
print("MLP esés %.1f pp; atomzsák-GIN %.1f pp; WL-GIN %.1f pp; GIN sum-mean %.1f pp" % (83.7-69.5, 86.0-81.9, 87.6-81.9, 81.9-80.7))
m = load("mutag-data.js", "MUTAG13")
print("MUTAG mols", len(m["mols"]), "mutagén", sum(mm["y"] for mm in m["mols"]), "atomszám", min(len(mm["atoms"]) for mm in m["mols"]), max(len(mm["atoms"]) for mm in m["mols"]),
      "átlag %.2f" % (sum(len(mm["atoms"]) for mm in m["mols"]) / 188))
