# MUTAG: WL-jellemzők + LR alapvonal, és GIN-hangolás (belső validációval választott konfiguráció)
import sys, os, numpy as np, torch, torch.nn.functional as F
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from c13_data import mutag
from c13_exp import GraphNet, batch_graphs
from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
torch.set_num_threads(4)
gs = mutag(); y = np.array([g["y"] for g in gs])

def wl_features(gs, iters):
    dic = {}; feats = []
    cols = []
    for g in gs:
        nb = [[] for _ in range(g["n"])]
        for u, v in g["edges"]: nb[u].append(v); nb[v].append(u)
        c = [("a", a) for a in g["atoms"]]
        allc = list(c)
        for it in range(iters):
            c = [(c[i], tuple(sorted(c[j] for j in nb[i]))) for i in range(g["n"])]
            allc += c
        cols.append(allc)
    for allc in cols:
        for x in allc: dic.setdefault(x, len(dic))
    X = np.zeros((len(gs), len(dic)))
    for k, allc in enumerate(cols):
        for x in allc: X[k, dic[x]] += 1
    return X

for it in (0, 1, 2, 3):
    X = wl_features(gs, it); accs = []
    for r in range(3):
        for tri, tei in StratifiedKFold(10, shuffle=True, random_state=r).split(X, y):
            m = LogisticRegression(max_iter=5000, C=1.0).fit(X[tri], y[tri]); accs.append((m.predict(X[tei]) == y[tei]).mean())
    print("WL iter %d: %d jellemző, LR %.3f ± %.3f" % (it, X.shape[1], np.mean(accs), np.std(accs)), flush=True)

def run(cfg, rs):
    kind, agg, ro, dh, L, ep, lr, wd = cfg
    accs = []
    for r in rs:
        for fold, (tri, tei) in enumerate(StratifiedKFold(10, shuffle=True, random_state=r).split(y, y)):
            torch.manual_seed(fold + 10 * r)
            net = GraphNet(kind, agg, ro, dh=dh, L=L)
            opt = torch.optim.Adam(net.parameters(), lr=lr, weight_decay=wd)
            Xb, Ab, gb, G = batch_graphs([gs[i] for i in tri]); yt = torch.tensor(y[tri])
            Xt, At, gt, Gt = batch_graphs([gs[i] for i in tei])
            for e in range(ep):
                net.train(); opt.zero_grad(); F.cross_entropy(net(Xb, Ab, gb, G), yt).backward(); opt.step()
            net.eval()
            with torch.no_grad(): accs.append((net(Xt, At, gt, Gt).argmax(1).numpy() == y[tei]).mean())
    return np.mean(accs), np.std(accs)

cfgs = [("gin","sum","sum",32,3,150,0.01,0), ("gin","sum","sum",32,3,300,0.005,5e-4), ("gin","sum","sum",64,4,300,0.005,5e-4),
        ("gin","sum","sum",16,2,300,0.01,5e-4), ("gin","sum","mean",32,3,300,0.005,5e-4), ("gcn","sum","mean",32,3,300,0.005,5e-4),
        ("gcn","sum","sum",32,3,300,0.005,5e-4)]
for c in cfgs:
    m, s = run(c, [10, 11])  # hangolási ismétlések (a beszámolóban a 0–2. ismétlés szerepel)
    print(c, "hangoló %.3f ± %.3f" % (m, s), flush=True)
