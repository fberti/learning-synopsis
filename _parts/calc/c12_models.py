import sys, json, math, numpy as np, torch, torch.nn as nn
sys.path.insert(0, sys.argv[1]); from c12_data import make, VOCAB
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
torch.set_num_threads(4)
idx = {w: i for i, w in enumerate(VOCAB)}
L = 15
def enc(data):
    X = np.zeros((len(data), L), dtype=np.int64); M = np.zeros((len(data), L), dtype=bool)
    for i, (t, _, _) in enumerate(data):
        X[i, :len(t)] = [idx[w] for w in t]; M[i, :len(t)] = True
    return torch.tensor(X), torch.tensor(M), torch.tensor([y for _, y, _ in data], dtype=torch.float32)

class Avg(nn.Module):
    def __init__(s, d=8, h=16):
        super().__init__(); s.E = nn.Embedding(len(VOCAB), d); s.f = nn.Sequential(nn.Linear(d, h), nn.ReLU(), nn.Linear(h, 1))
    def forward(s, X, M):
        e = s.E(X) * M[..., None]; return s.f(e.sum(1) / M.sum(1, keepdim=True)).squeeze(-1)
class RNN(nn.Module):
    def __init__(s, d=8, h=16):
        super().__init__(); s.E = nn.Embedding(len(VOCAB), d); s.U = nn.Linear(d, h); s.W = nn.Linear(h, h, bias=False); s.o = nn.Linear(h, 1)
    def forward(s, X, M):
        e = s.E(X); hh = torch.zeros(X.shape[0], s.W.in_features)
        for t in range(X.shape[1]):
            nh = torch.tanh(s.U(e[:, t]) + s.W(hh)); hh = torch.where(M[:, t, None], nh, hh)
        return s.o(hh).squeeze(-1)
class TF(nn.Module):
    def __init__(s, d=16, heads=2, ff=32, pos=True):
        super().__init__(); s.E = nn.Embedding(len(VOCAB), d); s.P = nn.Embedding(L, d) if pos else None
        s.d, s.h = d, heads; s.q = nn.Linear(d, d); s.k = nn.Linear(d, d); s.v = nn.Linear(d, d); s.oa = nn.Linear(d, d)
        s.ln1 = nn.LayerNorm(d); s.ff = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d)); s.ln2 = nn.LayerNorm(d); s.o = nn.Linear(d, 1)
    def forward(s, X, M, ret=False):
        B, T = X.shape; x = s.E(X)
        if s.P is not None: x = x + s.P(torch.arange(T))[None]
        dh = s.d // s.h
        sp = lambda z: z.view(B, T, s.h, dh).transpose(1, 2)
        Q, K, V = sp(s.q(x)), sp(s.k(x)), sp(s.v(x))
        sc = Q @ K.transpose(-1, -2) / math.sqrt(dh)
        sc = sc.masked_fill(~M[:, None, None, :], -1e9); A = sc.softmax(-1)
        a = (A @ V).transpose(1, 2).reshape(B, T, s.d)
        x = s.ln1(x + s.oa(a)); x = s.ln2(x + s.ff(x))
        pooled = (x * M[..., None]).sum(1) / M.sum(1, keepdim=True)
        out = s.o(pooled).squeeze(-1)
        return (out, A) if ret else out

def train(model, tr, va, seed, epochs=60, lr=0.01):
    torch.manual_seed(seed); Xt, Mt, yt = tr; Xv, Mv, yv = va
    opt = torch.optim.Adam(model.parameters(), lr=lr); best, state = -1, None
    g = torch.Generator().manual_seed(seed)
    for ep in range(epochs):
        model.train(); perm = torch.randperm(len(yt), generator=g)
        for i in range(0, len(yt), 64):
            b = perm[i:i + 64]; loss = nn.functional.binary_cross_entropy_with_logits(model(Xt[b], Mt[b]), yt[b])
            opt.zero_grad(); loss.backward(); opt.step()
        model.eval()
        with torch.no_grad(): acc = ((model(Xv, Mv) > 0).float() == yv).float().mean().item()
        if acc > best: best, state = acc, {k: v.clone() for k, v in model.state_dict().items()}
    model.load_state_dict(state); return model

def evaluate(pred, data):
    y = np.array([d[1] for d in data]); k = np.array([d[2] for d in data]); pred = np.asarray(pred)
    r = {"all": (pred == y).mean()}
    for kk in ["one", "es", "de"]: r[kk] = (pred[k == kk] == y[k == kk]).mean()
    return r

res = {}
seeds = [0, 1, 2, 3, 4]
for seed in seeds:
    tr, va, te = make(seed)
    txt = lambda D: [" ".join(t) for t, _, _ in D]
    for name, ng in [("bow1", (1, 1)), ("bow2", (1, 2))]:
        cv = CountVectorizer(token_pattern=r"[^ ]+", ngram_range=ng); Xtr = cv.fit_transform(txt(tr))
        lr = LogisticRegression(max_iter=2000, C=10).fit(Xtr, [d[1] for d in tr])
        res.setdefault(name, []).append(evaluate(lr.predict(cv.transform(txt(te))), te))
    E = list(map(enc, (tr, va, te)))
    for name, mk in [("avg", lambda: Avg()), ("rnn", lambda: RNN()), ("tf_nopos", lambda: TF(pos=False)), ("tf", lambda: TF())]:
        torch.manual_seed(100 + seed); m = train(mk(), E[0], E[1], seed)
        with torch.no_grad(): p = (m(E[2][0], E[2][1]) > 0).int().numpy()
        res.setdefault(name, []).append(evaluate(p, te))
        if seed == 0: torch.save(m.state_dict(), f"{sys.argv[1]}/../ch12/m_{name}.pt")
for name, rs in res.items():
    print(name, {k: f"{100*np.mean([r[k] for r in rs]):.1f} [{100*min(r[k] for r in rs):.1f}-{100*max(r[k] for r in rs):.1f}]" for k in rs[0]})
