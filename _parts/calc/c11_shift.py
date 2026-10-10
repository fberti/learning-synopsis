# 11. fejezet: eltolás-kísérlet – MLP vs CNN egy 12×12-es vásznon (digits)
import numpy as np, torch, torch.nn as nn, sys
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
torch.set_num_threads(4)
d = load_digits(); X = d.data/16.0; y = d.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
Xa, Xv, ya, yv = train_test_split(Xtr, ytr, test_size=300, random_state=0, stratify=ytr)
def canvas(A, dx=0, dy=0, S=12):
    A = A.reshape(-1, 8, 8); out = np.zeros((len(A), S, S)); o = (S-8)//2
    out[:, o+dy:o+dy+8, o+dx:o+dx+8] = A; return out
T = lambda a: torch.tensor(a, dtype=torch.float32)
class MLP(nn.Module):
    def __init__(s, n=144, h=16): super().__init__(); s.f = nn.Sequential(nn.Flatten(), nn.Linear(n, h), nn.ReLU(), nn.Linear(h, 10))
    def forward(s, x): return s.f(x)
class CNN(nn.Module):
    def __init__(s, gpool=True, c1=8, c2=16):
        super().__init__()
        s.c1 = nn.Conv2d(1, c1, 3, padding=1); s.c2 = nn.Conv2d(c1, c2, 3, padding=1); s.gpool = gpool
        s.fc = nn.Linear(c2 if gpool else c2*9, 10)
    def feats(s, x):
        x = x.unsqueeze(1); a1 = torch.relu(s.c1(x)); p1 = nn.functional.max_pool2d(a1, 2)
        a2 = torch.relu(s.c2(p1)); p2 = nn.functional.max_pool2d(a2, 2); return a1, p1, a2, p2
    def forward(s, x):
        p2 = s.feats(x)[3]
        z = p2.amax(dim=(2, 3)) if s.gpool else p2.flatten(1)
        return s.fc(z)
def train(m, Xs, ys, Xval, yval, epochs=60, lr=0.01, aug=False, seed=0):
    g = torch.Generator().manual_seed(seed); opt = torch.optim.Adam(m.parameters(), lr=lr); L = nn.CrossEntropyLoss()
    best, bs = 1e9, None
    for ep in range(epochs):
        m.train()
        for idx in torch.randperm(len(Xs), generator=g).split(32):
            xb = Xs[idx]
            if aug:  # véletlen eltolás −2..2
                sh = torch.randint(-2, 3, (2,), generator=g); xb = torch.roll(xb, (int(sh[0]), int(sh[1])), (1, 2))
            opt.zero_grad(); l = L(m(xb), ys[idx]); l.backward(); opt.step()
        m.eval()
        with torch.no_grad(): v = L(m(Xval), yval).item()
        if v < best: best, bs = v, {k: t.clone() for k, t in m.state_dict().items()}
    m.load_state_dict(bs); return m
def acc(m, A, t):
    with torch.no_grad(): return (m(T(A)).argmax(1).numpy() == t).mean()
ytrT, yvT = torch.tensor(ya), torch.tensor(yv)
shifts = [(dx, dy) for dy in range(-2, 3) for dx in range(-2, 3)]
def report(name, m):
    grid = np.array([[acc(m, canvas(Xte, dx, dy), yte) for dx in range(-2, 3)] for dy in range(-2, 3)])
    by = {r: grid[[abs(dx)+abs(dy)==r for dy in range(-2,3) for dx in range(-2,3)].__class__ and True] if False else None for r in []}
    d1 = np.mean([grid[dy+2, dx+2] for dx in range(-2,3) for dy in range(-2,3) if max(abs(dx),abs(dy))==1])
    d2 = np.mean([grid[dy+2, dx+2] for dx in range(-2,3) for dy in range(-2,3) if max(abs(dx),abs(dy))==2])
    x1 = (grid[2,1]+grid[2,3])/2; x2=(grid[2,0]+grid[2,4])/2
    print(f"{name:14s} center {grid[2,2]:.3f}  dx±1 {x1:.3f} dx±2 {x2:.3f}  ring1 {d1:.3f} ring2 {d2:.3f}  all25 {grid.mean():.3f}")
    return grid
res = {}
for seed in range(int(sys.argv[1]) if len(sys.argv) > 1 else 3):
    torch.manual_seed(seed)
    A, V = T(canvas(Xa)), T(canvas(Xv))
    res.setdefault("mlp", []).append(report(f"MLP s{seed}", train(MLP(), A, ytrT, V, yvT, seed=seed)))
    torch.manual_seed(seed); res.setdefault("cnn_g", []).append(report(f"CNN gmax s{seed}", train(CNN(True), A, ytrT, V, yvT, seed=seed)))
    torch.manual_seed(seed); res.setdefault("cnn_f", []).append(report(f"CNN flat s{seed}", train(CNN(False), A, ytrT, V, yvT, seed=seed)))
    torch.manual_seed(seed); res.setdefault("mlp_aug", []).append(report(f"MLP aug s{seed}", train(MLP(), A, ytrT, V, yvT, aug=True, seed=seed)))
    torch.manual_seed(seed); res.setdefault("cnn_aug", []).append(report(f"CNN aug s{seed}", train(CNN(True), A, ytrT, V, yvT, aug=True, seed=seed)))
for k, v in res.items():
    g = np.mean(v, 0); print(k, "mean grid\n", (100*g).round(1))
print("params MLP", sum(p.numel() for p in MLP().parameters()), "CNN g", sum(p.numel() for p in CNN(True).parameters()), "CNN f", sum(p.numel() for p in CNN(False).parameters()))
