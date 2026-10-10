CANVAS = globals().get("CANVAS", 12)
import numpy as np, torch, torch.nn as nn
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
torch.set_num_threads(4)
d = load_digits(); X = d.data/16.0; y = d.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
Xa, Xv, ya, yv = train_test_split(Xtr, ytr, test_size=300, random_state=0, stratify=ytr)
def canvas(A, dx=0, dy=0, S=CANVAS):
    A = A.reshape(-1, 8, 8); out = np.zeros((len(A), S, S)); o = (S-8)//2
    out[:, o+dy:o+dy+8, o+dx:o+dx+8] = A; return out
T = lambda a: torch.tensor(np.asarray(a), dtype=torch.float32)
def train(m, Xs, ys, Xval, yval, epochs=60, lr=0.01, aug=False, seed=0):
    g = torch.Generator().manual_seed(seed); opt = torch.optim.Adam(m.parameters(), lr=lr); L = nn.CrossEntropyLoss()
    best, bs = 1e9, None
    for ep in range(epochs):
        m.train()
        for idx in torch.randperm(len(Xs), generator=g).split(32):
            xb = Xs[idx]
            if aug:
                sh = torch.randint(-2, 3, (2,), generator=g); xb = torch.roll(xb, (int(sh[0]), int(sh[1])), (-2, -1))
            opt.zero_grad(); l = L(m(xb), ys[idx]); l.backward(); opt.step()
        m.eval()
        with torch.no_grad(): v = L(m(Xval), yval).item()
        if v < best: best, bs = v, {k: t.clone() for k, t in m.state_dict().items()}
    m.load_state_dict(bs); return m
def acc(m, A, t):
    with torch.no_grad(): return (m(T(A)).argmax(1).numpy() == t).mean()
def grid(m): return np.array([[acc(m, canvas(Xte, dx, dy), yte) for dx in range(-2, 3)] for dy in range(-2, 3)])
ytrT, yvT = torch.tensor(ya), torch.tensor(yv)
A, V = T(canvas(Xa)), T(canvas(Xv))
