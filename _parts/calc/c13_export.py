# 13. fejezet – adatfájlok a 13.11 widgetjeihez: cora-data.js (CORA13), mutag-data.js (MUTAG13)
# futtatás: ./t13.sh c13_export.py [cora|mutag]
import sys, os, json
import numpy as np, torch, torch.nn.functional as F
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from c13_data import mutag, ATOMS
from c13_exp import GCN, MLP, train_node, cora_tensors, sparse, gcn_norm, GraphNet, batch_graphs, AdjMLP

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "mesterseges-intelligencia", "13-graf-neuralis-halok")
torch.set_num_threads(4)
CLASSES = ["Elmélet", "Megerősítéses tanulás", "Genetikus algoritmusok", "Neurális hálók",
           "Valószínűségi módszerek", "Esetalapú következtetés", "Szabálytanulás"]


def r(a, d=2):
    return np.round(np.asarray(a, float), d).tolist()


def export_cora():
    from sklearn.manifold import TSNE
    from sklearn.decomposition import PCA
    X, Y, A, tr, va, te = cora_tensors()
    n = X.shape[0]
    P = sparse(gcn_norm(A))
    torch.manual_seed(0)
    mlp = MLP(X.shape[1], 64, 7); acc_m, _ = train_node(mlp, X, None, Y, tr, va, te)
    torch.manual_seed(0)
    gcn = GCN(X.shape[1], 16, 7); acc_g, _ = train_node(gcn, X, P, Y, tr, va, te)
    with torch.no_grad():
        pm = mlp(X).argmax(1).numpy(); pg = gcn(X, P).argmax(1).numpy()
        _, hs = gcn(X, P, return_h=True); H = hs[0].numpy()
    print("cora export: MLP %.3f GCN %.3f" % (acc_m, acc_g))
    Xr = PCA(50, random_state=0).fit_transform(X.numpy())
    t_raw = TSNE(2, random_state=0, init="pca", perplexity=30).fit_transform(Xr)
    t_gcn = TSNE(2, random_state=0, init="pca", perplexity=30).fit_transform(H)
    norm = lambda T: (T - T.min(0)) / (T.max(0) - T.min(0))
    src, dst = torch.triu(A).nonzero(as_tuple=True)
    tem = np.zeros(n, int); tem[te.numpy()] = 1
    trm = np.zeros(n, int); trm[tr.numpy()] = 1
    data = dict(n=n, classes=CLASSES, y=Y.numpy().tolist(), train=np.nonzero(trm)[0].tolist(), test=np.nonzero(tem)[0].tolist(),
                predMLP=pm.tolist(), predGCN=pg.tolist(), xyRaw=r(norm(t_raw), 3), xyGCN=r(norm(t_gcn), 3),
                edges=np.stack([src.numpy(), dst.numpy()], 1).tolist(),
                acc=dict(MLP=round(acc_m, 4), GCN=round(acc_g, 4)),
                src="Cora (A. McCallum és társai, 2000; Planetoid-felosztás: Z. Yang és társai, 2016); saját PyTorch-tanítás, t-SNE (scikit-learn)")
    # pontosság csúcsfokszám szerint (teszt)
    deg = A.sum(1).numpy()
    for lo, hi in [(1, 1), (2, 3), (4, 1000)]:
        m = tem.astype(bool) & (deg >= lo) & (deg <= hi)
        print("fokszám %d–%d: %d teszt, MLP %.3f GCN %.3f" % (lo, hi, m.sum(), (pm[m] == Y.numpy()[m]).mean(), (pg[m] == Y.numpy()[m]).mean()))
    open(os.path.join(OUT, "cora-data.js"), "w").write("window.CORA13 = " + json.dumps(data, separators=(",", ":")) + ";\n")


def layout(g):
    import networkx as nx
    G = nx.Graph(); G.add_nodes_from(range(g["n"])); G.add_edges_from(g["edges"])
    pos = nx.kamada_kawai_layout(G)
    P = np.array([pos[i] for i in range(g["n"])])
    P -= P.mean(0)
    # a hosszabb kiterjedés vízszintes legyen
    u, s, vt = np.linalg.svd(P, full_matrices=False)
    P = P @ vt.T
    return P / np.abs(P).max()


def train_gin(gs_tr, ys, seed, dh=32, L=3, ep=150, lr=0.01):
    torch.manual_seed(seed)
    net = GraphNet("gin", "sum", "sum", dh=dh, L=L)
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    Xb, Ab, gb, G = batch_graphs(gs_tr); yt = torch.tensor(ys)
    for e in range(ep):
        net.train(); opt.zero_grad(); F.cross_entropy(net(Xb, Ab, gb, G), yt).backward(); opt.step()
    net.eval()
    return net


def prob(net, gs, perm=False, rng=None):
    Xt, At, gt, Gt = batch_graphs(gs, perm=perm, rng=rng)
    with torch.no_grad():
        return torch.softmax(net(Xt, At, gt, Gt), 1)[:, 1].numpy()


def export_mutag():
    from sklearn.model_selection import StratifiedKFold
    from sklearn.linear_model import LogisticRegression
    gs = mutag(); y = np.array([g["y"] for g in gs]); N = len(gs)
    bag = np.array([np.bincount(g["atoms"], minlength=7) for g in gs], float)
    p_gin = np.zeros(N); p_lr = np.zeros(N); p_mlp = np.zeros(N); p_mlp_perm = np.zeros((N, 5)); p_gin_perm = np.zeros((N, 5))
    perms = {}
    rng = np.random.default_rng(7)
    # 5 rögzített átszámozás molekulánként (a widget ugyanezeket mutatja)
    for k, g in enumerate(gs):
        perms[k] = [rng.permutation(g["n"]).tolist() for _ in range(5)]
    skf = StratifiedKFold(10, shuffle=True, random_state=0)
    for fold, (tri, tei) in enumerate(skf.split(bag, y)):
        lr_ = LogisticRegression(max_iter=2000).fit(bag[tri], y[tri]); p_lr[tei] = lr_.predict_proba(bag[tei])[:, 1]
        net = train_gin([gs[i] for i in tri], y[tri], fold)
        p_gin[tei] = prob(net, [gs[i] for i in tei])
        torch.manual_seed(fold)
        m = AdjMLP(); opt = torch.optim.Adam(m.parameters(), lr=0.005, weight_decay=1e-4)
        Ztr = AdjMLP.featurize([gs[i] for i in tri]); yt = torch.tensor(y[tri])
        for e in range(200):
            m.train(); opt.zero_grad(); F.cross_entropy(m(Ztr), yt).backward(); opt.step()
        m.eval()
        with torch.no_grad():
            p_mlp[tei] = torch.softmax(m(AdjMLP.featurize([gs[i] for i in tei])), 1)[:, 1].numpy()
            for j in range(5):
                permuted = []
                for i in tei:
                    g = gs[i]; p = perms[i][j]
                    permuted.append(dict(n=g["n"], edges=[(p[u], p[v]) for u, v in g["edges"]],
                                         atoms=[g["atoms"][p.index(t)] for t in range(g["n"])], y=g["y"]))
                p_mlp_perm[tei, j] = torch.softmax(m(AdjMLP.featurize(permuted)), 1)[:, 1].numpy()
                p_gin_perm[tei, j] = prob(net, permuted)
    acc = lambda p: float(((p > 0.5) == y).mean())
    print("OOF: GIN %.3f LR %.3f MLP %.3f MLP-perm %.3f GIN-perm max diff %.2e" % (
        acc(p_gin), acc(p_lr), acc(p_mlp), np.mean([acc(p_mlp_perm[:, j]) for j in range(5)]), np.abs(p_gin_perm - p_gin[:, None]).max()))
    # élő modell: GIN az összes molekulán (szerkesztéshez a böngészőben), kisebb
    net = train_gin(gs, y, 0, dh=16, L=3, ep=200)
    full_acc = acc(prob(net, gs))
    print("élő GIN (tanítóhalmazon) %.3f" % full_acc)
    W = {k: r(v.detach().numpy(), 4) for k, v in net.state_dict().items()}
    mols = []
    for k, g in enumerate(gs):
        P = layout(g)
        mols.append(dict(atoms=g["atoms"], edges=[list(e) for e in g["edges"]], bonds=g["bonds"], xy=r(P, 3), y=int(g["y"]),
                         gin=round(float(p_gin[k]), 3), lr=round(float(p_lr[k]), 3), mlp=round(float(p_mlp[k]), 3),
                         mlpPerm=r(p_mlp_perm[k], 3), perms=perms[k]))
    data = dict(atomNames=ATOMS, bondNames=["aromás", "egyszeres", "kettős", "hármas"], mols=mols, weights=W,
                arch=dict(kind="GIN", layers=3, hidden=16, readout="összeg minden réteg után, összefűzve", eps="tanult", out="Linear(48,16)-ReLU-Linear(16,2)"),
                acc=dict(gin=round(acc(p_gin), 4), lr=round(acc(p_lr), 4), mlp=round(acc(p_mlp), 4),
                         mlpPerm=round(float(np.mean([acc(p_mlp_perm[:, j]) for j in range(5)])), 4), liveTrain=round(full_acc, 4)),
                src="MUTAG (A. K. Debnath és társai, J. Med. Chem. 1991; TUDataset / Hugging Face graphs-datasets); saját PyTorch-tanítás, 10-szeres keresztvalidáció (1 ismétlés)")
    open(os.path.join(OUT, "mutag-data.js"), "w").write("window.MUTAG13 = " + json.dumps(data, separators=(",", ":"), ensure_ascii=False) + ";\n")
    print("kulcsok:", list(W.keys()))


if __name__ == "__main__":
    for w in sys.argv[1:] or ["cora", "mutag"]:
        globals()["export_" + w]()
