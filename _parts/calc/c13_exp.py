# 13. fejezet – kísérletek: karateklub, Cora, MUTAG
# futtatás: uv run -q --index https://download.pytorch.org/whl/cpu --with torch --with numpy --with scipy --with networkx --with scikit-learn python -I c13_exp.py [karate|cora|depth|labels|mutag]
import sys, json, time
import numpy as np
import torch, torch.nn as nn, torch.nn.functional as F
sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from c13_data import karate, cora, mutag

torch.set_num_threads(4)


def dense_adj(n, edges):
    A = torch.zeros(n, n)
    for u, v in edges:
        A[u, v] = A[v, u] = 1
    return A


def gcn_norm(A):
    Ah = A + torch.eye(A.shape[0])
    d = Ah.sum(1)
    Di = d.pow(-0.5)
    return Di[:, None] * Ah * Di[None, :]


def sparse(M):
    return M.to_sparse()


# ---------------------------------------------------------------- modellek
class GCN(nn.Module):
    def __init__(s, din, dh, dout, L=2, drop=0.5, res=False):
        super().__init__()
        dims = [din] + [dh] * (L - 1) + [dout]
        s.lins = nn.ModuleList(nn.Linear(dims[i], dims[i + 1]) for i in range(L))
        s.drop, s.res = drop, res

    def forward(s, X, P, return_h=False):
        h = X
        hs = []
        for i, lin in enumerate(s.lins):
            h_in = h
            h = F.dropout(h, s.drop, s.training)
            h = P @ lin(h)
            if i < len(s.lins) - 1:
                h = F.relu(h)
                if s.res and i > 0:
                    h = h + h_in
                hs.append(h)
        return (h, hs) if return_h else h


class MLP(nn.Module):
    def __init__(s, din, dh, dout, drop=0.5):
        super().__init__()
        s.l1, s.l2, s.drop = nn.Linear(din, dh), nn.Linear(dh, dout), drop

    def forward(s, X, P=None):
        h = F.relu(s.l1(F.dropout(X, s.drop, s.training)))
        return s.l2(F.dropout(h, s.drop, s.training))


class SAGE(nn.Module):
    def __init__(s, din, dh, dout, drop=0.5):
        super().__init__()
        s.s1, s.n1 = nn.Linear(din, dh), nn.Linear(din, dh, bias=False)
        s.s2, s.n2 = nn.Linear(dh, dout), nn.Linear(dh, dout, bias=False)
        s.drop = drop

    def forward(s, X, Pm):  # Pm: átlagoló (D^-1 A, önhurok nélkül)
        h = F.dropout(X, s.drop, s.training)
        h = F.relu(s.s1(h) + s.n1(Pm @ h))
        h = F.dropout(h, s.drop, s.training)
        return s.s2(h) + s.n2(Pm @ h)


class GATLayer(nn.Module):
    """Ritka (éllistás) GAT-réteg; ei = (forrás, cél) élindexek, önhurokkal."""
    def __init__(s, din, dout, heads, concat=True, drop=0.6):
        super().__init__()
        s.W = nn.Linear(din, dout * heads, bias=False)
        s.a_src = nn.Parameter(torch.empty(heads, dout))
        s.a_dst = nn.Parameter(torch.empty(heads, dout))
        nn.init.xavier_uniform_(s.a_src); nn.init.xavier_uniform_(s.a_dst)
        s.bias = nn.Parameter(torch.zeros(dout * heads if concat else dout))
        s.h, s.d, s.concat, s.drop = heads, dout, concat, drop

    def forward(s, X, ei):
        src, dst = ei
        n = X.shape[0]
        Wh = s.W(X).view(n, s.h, s.d)
        es = (Wh * s.a_src).sum(-1); ed = (Wh * s.a_dst).sum(-1)
        e = F.leaky_relu(es[src] + ed[dst], 0.2)
        emax = torch.full((n, s.h), -1e30).scatter_reduce(0, dst[:, None].expand(-1, s.h), e, "amax")
        w = torch.exp(e - emax[dst])
        den = torch.zeros(n, s.h).index_add_(0, dst, w)
        a = F.dropout(w / den[dst], s.drop, s.training)
        out = torch.zeros(n, s.h, s.d).index_add_(0, dst, a[:, :, None] * Wh[src])
        out = out.reshape(n, -1) if s.concat else out.mean(1)
        return out + s.bias


class GAT(nn.Module):
    def __init__(s, din, dout, heads=8, dh=8):
        super().__init__()
        s.g1 = GATLayer(din, dh, heads)
        s.g2 = GATLayer(dh * heads, dout, 1, concat=False)

    def forward(s, X, mask):
        h = F.elu(s.g1(F.dropout(X, 0.6, s.training), mask))
        return s.g2(F.dropout(h, 0.6, s.training), mask)


def train_node(model, X, P, Y, tr, va, te, lr=0.01, wd=5e-4, epochs=400, patience=100):
    opt = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=wd)
    best, best_state, bad = -1, None, 0
    for ep in range(epochs):
        model.train(); opt.zero_grad()
        out = model(X, P)
        F.cross_entropy(out[tr], Y[tr]).backward(); opt.step()
        model.eval()
        with torch.no_grad():
            out = model(X, P); pred = out.argmax(1)
            v = (pred[va] == Y[va]).float().mean().item()
            vl = F.cross_entropy(out[va], Y[va]).item()
        score = v - 1e-3 * vl
        if score > best:
            best, bad = score, 0
            best_state = {k: t.clone() for k, t in model.state_dict().items()}
        else:
            bad += 1
            if bad > patience: break
    model.load_state_dict(best_state); model.eval()
    with torch.no_grad():
        pred = model(X, P).argmax(1)
    return (pred[te] == Y[te]).float().mean().item(), (pred[tr] == Y[tr]).float().mean().item()


# ---------------------------------------------------------------- karate
def run_karate():
    n, E, club = karate()
    A = dense_adj(n, E)
    P = gcn_norm(A)
    X = torch.eye(n)
    Y = torch.tensor(club)
    tr = torch.tensor([0, 33])
    rest = torch.tensor([i for i in range(n) if i not in (0, 33)])
    deg = A.sum(1)
    print("karate: n", n, "élek", len(E), "fokszám 0:", deg[0].item(), "33:", deg[33].item(), "max", deg.max().item())
    # alapvonal: legrövidebb út
    import networkx as nx
    G = nx.Graph(); G.add_edges_from(E)
    d0 = nx.single_source_shortest_path_length(G, 0); d33 = nx.single_source_shortest_path_length(G, 33)
    pred = [0 if d0[i] < d33[i] else (1 if d33[i] < d0[i] else -1) for i in range(n)]
    ok = sum(pred[i] == club[i] for i in rest.tolist()); tie = sum(pred[i] == -1 for i in rest.tolist())
    print("legrövidebb út: helyes", ok, "/32, döntetlen", tie)
    # címketerjesztés
    Fm = torch.zeros(n, 2); Fm[0, 0] = 1; Fm[33, 1] = 1
    Pm = A / A.sum(1, keepdim=True)
    Z = Fm.clone()
    for _ in range(100):
        Z = Pm @ Z; Z[0] = Fm[0]; Z[33] = Fm[33]
    lp = Z.argmax(1)
    print("címketerjesztés:", (lp[rest] == Y[rest]).sum().item(), "/32 hibás:", [i for i in rest.tolist() if lp[i] != Y[i]])
    accs, wrong = [], {}
    for seed in range(20):
        torch.manual_seed(seed)
        m = GCN(n, 16, 2, L=2, drop=0.0)
        opt = torch.optim.Adam(m.parameters(), lr=0.01, weight_decay=5e-4)
        for ep in range(200):
            opt.zero_grad(); out = m(X, P); F.cross_entropy(out[tr], Y[tr]).backward(); opt.step()
        p = m(X, P).argmax(1)
        accs.append((p[rest] == Y[rest]).float().mean().item())
        for i in rest.tolist():
            if p[i] != Y[i]: wrong[i] = wrong.get(i, 0) + 1
    print("GCN 2 címke, 20 futás: átlag %.3f min %.3f max %.3f" % (np.mean(accs), min(accs), max(accs)), "hibák:", wrong)
    # MLP ugyanazzal (identitás jellemző): nincs információ
    accs = []
    for seed in range(20):
        torch.manual_seed(seed)
        m = MLP(n, 16, 2, drop=0.0)
        opt = torch.optim.Adam(m.parameters(), lr=0.01, weight_decay=5e-4)
        for ep in range(200):
            opt.zero_grad(); out = m(X); F.cross_entropy(out[tr], Y[tr]).backward(); opt.step()
        p = m(X).argmax(1)
        accs.append((p[rest] == Y[rest]).float().mean().item())
    print("MLP 2 címke: átlag %.3f min %.3f max %.3f" % (np.mean(accs), min(accs), max(accs)), flush=True)
    print("club Mr.Hi:", [i for i in range(n) if club[i] == 0])


# ---------------------------------------------------------------- cora
def cora_tensors():
    X, Y, E, tr, va, te = cora()
    X = torch.tensor(X); X = X / X.sum(1, keepdim=True).clamp(min=1)
    Y = torch.tensor(Y)
    n = X.shape[0]
    A = dense_adj(n, E)
    return X, Y, A, torch.tensor(tr), torch.tensor(va), torch.tensor(te)


def run_cora(seeds=10):
    X, Y, A, tr, va, te = cora_tensors()
    n = X.shape[0]
    print("cora: csúcs", n, "él", int(A.sum().item() // 2), "jellemző", X.shape[1], "osztály", int(Y.max()) + 1)
    deg = A.sum(1)
    print("fokszám: átlag %.2f medián %d max %d, izolált %d" % (deg.mean(), deg.median(), deg.max(), (deg == 0).sum()))
    # homofília: azonos címkéjű élek aránya
    iu = torch.triu_indices(n, n, 1)
    src, dst = A.nonzero(as_tuple=True)
    print("élhomofília: %.3f" % (Y[src] == Y[dst]).float().mean().item())
    P = sparse(gcn_norm(A))
    Pm = sparse(A / A.sum(1, keepdim=True).clamp(min=1))
    ei = (A + torch.eye(n)).nonzero().T
    mask = (ei[1], ei[0])
    # címketerjesztés (csak gráf)
    Z = torch.zeros(n, 7); Z[tr, Y[tr]] = 1; Z0 = Z.clone()
    Pr = A / A.sum(1, keepdim=True).clamp(min=1)
    for _ in range(50):
        Z = 0.9 * (Pr @ Z) + 0.1 * Z0
    print("címketerjesztés teszt: %.3f" % (Z.argmax(1)[te] == Y[te]).float().mean().item(), flush=True)
    res = {}
    for name in ["MLP", "GCN", "SAGE", "GAT"]:
        accs = []
        for s in range(seeds):
            torch.manual_seed(s)
            if name == "MLP": m, PP = MLP(X.shape[1], 64, 7), None
            elif name == "GCN": m, PP = GCN(X.shape[1], 16, 7), P
            elif name == "SAGE": m, PP = SAGE(X.shape[1], 16, 7), Pm
            else: m, PP = GAT(X.shape[1], 7), mask
            lr = 0.005 if name == "GAT" else 0.01
            a, _ = train_node(m, X, PP, Y, tr, va, te, lr=lr)
            accs.append(a)
        res[name] = accs
        print("%-5s teszt: %.3f ± %.3f (min %.3f, max %.3f)" % (name, np.mean(accs), np.std(accs), min(accs), max(accs)), flush=True)
    return res


def run_depth(seeds=3):
    X, Y, A, tr, va, te = cora_tensors()
    n = X.shape[0]
    P = sparse(gcn_norm(A))
    out = {}
    for res in [False, True]:
        for L in [2, 4, 8, 16, 32, 64]:
            accs, spreads = [], []
            for s in range(seeds):
                torch.manual_seed(s)
                m = GCN(X.shape[1], 64, 7, L=L, drop=0.5, res=res)
                a, _ = train_node(m, X, P, Y, tr, va, te, lr=0.005, epochs=400, patience=100)
                accs.append(a)
                with torch.no_grad():
                    _, hs = m(X, P, return_h=True)
                    h = hs[-1] if hs else X
                    hn = F.normalize(h, dim=1)
                    # átlagos páronkénti koszinusz-távolság (1 − cos), 500 véletlen csúcson
                    idx = torch.randperm(n)[:500]
                    C = hn[idx] @ hn[idx].T
                    spreads.append((1 - C).mean().item())
            out[(res, L)] = (np.mean(accs), np.mean(spreads))
            print("res=%d L=%2d teszt %.3f  1−cos átlag %.3f" % (res, L, np.mean(accs), np.mean(spreads)), flush=True)
    return out


def run_labels(seeds=10, ks=(1, 2, 5, 10, 20)):
    X, Y, A, tr0, va, te = cora_tensors()
    n = X.shape[0]
    P = sparse(gcn_norm(A))
    rng = np.random.default_rng(0)
    pool = np.setdiff1d(np.arange(n), np.concatenate([va.numpy(), te.numpy()]))
    for k in ks:
        r = {"MLP": [], "GCN": []}
        for s in range(seeds):
            rs = np.random.default_rng(100 + s)
            tr = np.concatenate([rs.choice(pool[Y[pool].numpy() == c], k, replace=False) for c in range(7)])
            tr = torch.tensor(tr)
            for name in r:
                torch.manual_seed(s)
                m, PP = (MLP(X.shape[1], 64, 7), None) if name == "MLP" else (GCN(X.shape[1], 16, 7), P)
                a, _ = train_node(m, X, PP, Y, tr, va, te)
                r[name].append(a)
        print("címke/osztály %2d: MLP %.3f  GCN %.3f" % (k, np.mean(r["MLP"]), np.mean(r["GCN"])), flush=True)


# ---------------------------------------------------------------- MUTAG
def batch_graphs(gs, perm=None, rng=None):
    Xs, rows, cols, gid = [], [], [], []
    off = 0
    for k, g in enumerate(gs):
        n = g["n"]
        p = rng.permutation(n) if perm else np.arange(n)
        X = np.zeros((n, 7), np.float32)
        for i, a in enumerate(g["atoms"]):
            X[p[i], a] = 1
        Xs.append(X)
        for u, v in g["edges"]:
            rows += [off + p[u], off + p[v]]; cols += [off + p[v], off + p[u]]
        gid += [k] * n
        off += n
    X = torch.tensor(np.concatenate(Xs))
    A = torch.sparse_coo_tensor(torch.tensor([rows, cols]), torch.ones(len(rows)), (off, off)).coalesce()
    return X, A, torch.tensor(gid), len(gs)


class GraphNet(nn.Module):
    def __init__(s, kind="gin", agg="sum", readout="sum", dh=32, L=3):
        super().__init__()
        s.kind, s.agg, s.readout, s.L = kind, agg, readout, L
        dims = [7] + [dh] * L
        if kind == "gin":
            s.mlps = nn.ModuleList(nn.Sequential(nn.Linear(dims[i], dh), nn.ReLU(), nn.Linear(dh, dh)) for i in range(L))
            s.eps = nn.Parameter(torch.zeros(L))
        else:
            s.mlps = nn.ModuleList(nn.Linear(dims[i], dh) for i in range(L))
        s.out = nn.Sequential(nn.Linear(dh * L, dh), nn.ReLU(), nn.Dropout(0.5), nn.Linear(dh, 2))

    def forward(s, X, A, gid, G):
        n = X.shape[0]
        deg = torch.sparse.sum(A, 1).to_dense()
        h, pooled = X, []
        for i in range(s.L):
            if s.kind == "gin":
                m = torch.sparse.mm(A, h)
                if s.agg == "mean": m = m / deg.clamp(min=1)[:, None]
                if s.agg == "max":
                    # max-aggregálás (sűrű, kis gráfokra)
                    Ad = A.to_dense()
                    m = (Ad[:, :, None] * h[None] + (Ad[:, :, None] - 1) * 1e9).max(1).values
                    m = torch.where(deg[:, None] > 0, m, torch.zeros_like(m))
                h = F.relu(s.mlps[i]((1 + s.eps[i]) * h + m))
            else:  # gcn
                dh = (deg + 1).pow(-0.5)
                hw = s.mlps[i](h)
                h = F.relu(dh[:, None] * (torch.sparse.mm(A, dh[:, None] * hw) + dh[:, None] * hw))
            seg = torch.zeros(G, h.shape[1]).index_add_(0, gid, h)
            if s.readout == "mean":
                seg = seg / torch.bincount(gid, minlength=G).float()[:, None]
            pooled.append(seg)
        return s.out(torch.cat(pooled, 1))


class AdjMLP(nn.Module):  # a lapított (párnázott) szomszédsági mátrix + atomtípusok MLP-n
    def __init__(s, N=28, dh=64):
        super().__init__()
        s.N = N
        s.net = nn.Sequential(nn.Linear(N * N + N * 7, dh), nn.ReLU(), nn.Dropout(0.5), nn.Linear(dh, 2))

    @staticmethod
    def featurize(gs, N=28, perm=False, rng=None):
        out = np.zeros((len(gs), N * N + N * 7), np.float32)
        for k, g in enumerate(gs):
            n = g["n"]; p = rng.permutation(n) if perm else np.arange(n)
            A = np.zeros((N, N), np.float32); Xa = np.zeros((N, 7), np.float32)
            for u, v in g["edges"]:
                A[p[u], p[v]] = A[p[v], p[u]] = 1
            for i, a in enumerate(g["atoms"]):
                Xa[p[i], a] = 1
            out[k] = np.concatenate([A.ravel(), Xa.ravel()])
        return torch.tensor(out)

    def forward(s, Z):
        return s.net(Z)


def run_mutag(reps=3):
    from sklearn.model_selection import StratifiedKFold
    from sklearn.linear_model import LogisticRegression
    gs = mutag()
    y = np.array([g["y"] for g in gs])
    print("MUTAG: %d gráf, mutagén %d (%.1f%%)" % (len(gs), y.sum(), 100 * y.mean()))
    nn_ = [g["n"] for g in gs]; print("atomok: átlag %.2f, min %d, max %d" % (np.mean(nn_), min(nn_), max(nn_)))
    # atomzsák
    bag = np.array([np.bincount(g["atoms"], minlength=7) for g in gs], float)
    print("atomtípus-gyakoriság:", bag.sum(0).astype(int))
    rng = np.random.default_rng(0)
    results = {}
    configs = [("atomzsák+LR", None), ("MLP mátrixon", None), ("MLP mátrixon, átszámozva", None),
               ("GCN+átlag", ("gcn", "sum", "mean")), ("GIN+átlag", ("gin", "sum", "mean")),
               ("GIN+összeg", ("gin", "sum", "sum")), ("GIN-mean-agg+összeg", ("gin", "mean", "sum"))]
    for name, _ in configs: results[name] = []
    perm_diffs = []
    for r in range(reps):
        skf = StratifiedKFold(10, shuffle=True, random_state=r)
        for fold, (tri, tei) in enumerate(skf.split(bag, y)):
            lr = LogisticRegression(max_iter=2000, C=1.0).fit(bag[tri], y[tri])
            results["atomzsák+LR"].append((lr.predict(bag[tei]) == y[tei]).mean())
            # MLP a mátrixon
            torch.manual_seed(fold + 10 * r)
            Ztr = AdjMLP.featurize([gs[i] for i in tri]); Zte = AdjMLP.featurize([gs[i] for i in tei])
            Zte_p = AdjMLP.featurize([gs[i] for i in tei], perm=True, rng=rng)
            m = AdjMLP(); opt = torch.optim.Adam(m.parameters(), lr=0.005, weight_decay=1e-4)
            yt = torch.tensor(y[tri])
            for ep in range(200):
                m.train(); opt.zero_grad(); F.cross_entropy(m(Ztr), yt).backward(); opt.step()
            m.eval()
            with torch.no_grad():
                results["MLP mátrixon"].append((m(Zte).argmax(1).numpy() == y[tei]).mean())
                results["MLP mátrixon, átszámozva"].append((m(Zte_p).argmax(1).numpy() == y[tei]).mean())
            for name, cfg in configs[3:]:
                torch.manual_seed(fold + 10 * r)
                net = GraphNet(cfg[0], cfg[1], cfg[2])
                opt = torch.optim.Adam(net.parameters(), lr=0.01)
                Xb, Ab, gb, G = batch_graphs([gs[i] for i in tri])
                Xt, At, gt, Gt = batch_graphs([gs[i] for i in tei])
                for ep in range(150):
                    net.train(); opt.zero_grad(); F.cross_entropy(net(Xb, Ab, gb, G), yt).backward(); opt.step()
                net.eval()
                with torch.no_grad():
                    lo = net(Xt, At, gt, Gt)
                    results[name].append((lo.argmax(1).numpy() == y[tei]).mean())
                    if name == "GIN+összeg":
                        Xp, Ap, gp, _ = batch_graphs([gs[i] for i in tei], perm=True, rng=rng)
                        perm_diffs.append((net(Xp, Ap, gp, Gt) - lo).abs().max().item())
        print("ismétlés", r, "kész", flush=True)
    for k, v in results.items():
        print("%-28s %.3f ± %.3f" % (k, np.mean(v), np.std(v)))
    print("GIN átszámozás: max eltérés a kimenetben %.2e" % max(perm_diffs))


if __name__ == "__main__":
    what = sys.argv[1:] or ["karate"]
    for w in what:
        t = time.time()
        globals()["run_" + w]()
        print("--- %s %.0f s" % (w, time.time() - t), flush=True)
