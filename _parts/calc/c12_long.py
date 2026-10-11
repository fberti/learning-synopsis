# hosszú távú függés: "nem igaz, hogy ..." a mondat elején, a döntő melléknév F töltelékszó után
import sys, random, math, numpy as np, torch, torch.nn as nn
torch.set_num_threads(4)
POS = ["jó", "izgalmas", "szép", "eredeti", "remek"]; NEG = ["rossz", "unalmas", "gyenge", "zavaros", "fárasztó"]
FILL = ["tegnap", "este", "moziban", "barátaimmal", "hosszú", "várakozás", "után", "végre", "megint", "kétszer"]
V = ["<pad>", "nem", "igaz", ",", "hogy", "a", "film", "amit", "láttunk", "volt"] + POS + NEG + FILL
ix = {w: i for i, w in enumerate(V)}
def sent(rng, F):
    flip = rng.random() < 0.5; pos = rng.random() < 0.5
    t = (["nem"] if flip else []) + ["igaz", ",", "hogy", "a", "film", ",", "amit"] + [rng.choice(FILL) for _ in range(F)] + ["láttunk", ",", rng.choice(POS if pos else NEG), "volt"]
    return t, int(pos != flip)
L = 4 + 7 + 20 + 4
def enc(D):
    X = np.zeros((len(D), L), dtype=np.int64); M = np.zeros((len(D), L), dtype=bool)
    for i, (t, _) in enumerate(D): X[i, :len(t)] = [ix[w] for w in t]; M[i, :len(t)] = True
    return torch.tensor(X), torch.tensor(M), torch.tensor([y for _, y in D], dtype=torch.float32)
sys.path.insert(0, sys.argv[1])
exec(open(sys.argv[1] + "/c12_models.py").read().split("def train")[0].split("class Avg")[1].join(["class Avg", ""]) if False else "")
class RNN(nn.Module):
    def __init__(s, cell, d=8, h=16):
        super().__init__(); s.E = nn.Embedding(len(V), d); s.cell = cell; s.h = h
        s.r = nn.RNN(d, h, batch_first=True) if cell == "rnn" else nn.LSTM(d, h, batch_first=True); s.o = nn.Linear(h, 1)
    def forward(s, X, M):
        n = M.sum(1); out, _ = s.r(s.E(X)); last = out[torch.arange(X.shape[0]), n - 1]; return s.o(last).squeeze(-1)
class TF(nn.Module):
    def __init__(s, d=16, heads=2, ff=32):
        super().__init__(); s.E = nn.Embedding(len(V), d); s.P = nn.Embedding(L, d); s.d, s.hh = d, heads
        s.q = nn.Linear(d, d); s.k = nn.Linear(d, d); s.v = nn.Linear(d, d); s.oa = nn.Linear(d, d)
        s.ln1 = nn.LayerNorm(d); s.ff = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d)); s.ln2 = nn.LayerNorm(d); s.o = nn.Linear(d, 1)
    def forward(s, X, M):
        B, T = X.shape; x = s.E(X) + s.P(torch.arange(T))[None]; dh = s.d // s.hh
        sp = lambda z: z.view(B, T, s.hh, dh).transpose(1, 2)
        sc = sp(s.q(x)) @ sp(s.k(x)).transpose(-1, -2) / math.sqrt(dh)
        A = sc.masked_fill(~M[:, None, None, :], -1e9).softmax(-1)
        a = (A @ sp(s.v(x))).transpose(1, 2).reshape(B, T, s.d)
        x = s.ln1(x + s.oa(a)); x = s.ln2(x + s.ff(x))
        return s.o((x * M[..., None]).sum(1) / M.sum(1, keepdim=True)).squeeze(-1)
def train(m, tr, va, seed, epochs=40):
    torch.manual_seed(seed); opt = torch.optim.Adam(m.parameters(), lr=0.005); g = torch.Generator().manual_seed(seed); best, st = -1, None
    for ep in range(epochs):
        m.train(); p = torch.randperm(len(tr[2]), generator=g)
        for i in range(0, len(p), 64):
            b = p[i:i+64]; loss = nn.functional.binary_cross_entropy_with_logits(m(tr[0][b], tr[1][b]), tr[2][b]); opt.zero_grad(); loss.backward(); opt.step()
        m.eval()
        with torch.no_grad(): a = ((m(va[0], va[1]) > 0).float() == va[2]).float().mean().item()
        if a > best: best, st = a, {k: v.clone() for k, v in m.state_dict().items()}
    m.load_state_dict(st); return m
Fs = [0, 2, 5, 10, 15, 20]
res = {}
for seed in range(10):
    rng = random.Random(seed)
    tr = enc([sent(rng, rng.randint(0, 20)) for _ in range(4000)]); va = enc([sent(rng, rng.randint(0, 20)) for _ in range(500)])
    te = {F: enc([sent(rng, F) for _ in range(500)]) for F in Fs}
    for name, mk in [("rnn", lambda: RNN("rnn")), ("lstm", lambda: RNN("lstm")), ("tf", lambda: TF())]:
        torch.manual_seed(seed); m = train(mk(), tr, va, seed)
        with torch.no_grad():
            for F in Fs: res.setdefault(name, {}).setdefault(F, []).append(((m(te[F][0], te[F][1]) > 0).float() == te[F][2]).float().mean().item())
    print(seed, {n: {F: round(100 * r[F][-1], 1) for F in Fs} for n, r in res.items()}, flush=True)
print({n: {F: f"{100*np.mean(r[F]):.1f}" for F in Fs} for n, r in res.items()})
