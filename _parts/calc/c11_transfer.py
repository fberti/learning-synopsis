# transzfer: CNN előtanítva a 0–4 számjegyeken, kevés mintával a 5–9-re
CANVAS = 16
exec(open("_parts/calc/c11_common.py").read())
class Body(nn.Module):
    def __init__(s): super().__init__(); s.c1 = nn.Conv2d(1, 8, 3, padding=1); s.c2 = nn.Conv2d(8, 16, 3, padding=1)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1))); x = nn.functional.max_pool2d(x, 2); x = torch.relu(s.c2(x)); return x.amax(dim=(2, 3))
class Net(nn.Module):
    def __init__(s, body=None): super().__init__(); s.body = body or Body(); s.fc = nn.Linear(16, 5)
    def forward(s, x): return s.fc(s.body(x))
def fit(m, Xs, ys, epochs, lr, params=None):
    opt = torch.optim.Adam(params if params is not None else m.parameters(), lr=lr); L = nn.CrossEntropyLoss()
    for ep in range(epochs):
        for idx in torch.randperm(len(Xs)).split(32):
            opt.zero_grad(); L(m(Xs[idx]), ys[idx]).backward(); opt.step()
    return m
Atr = canvas(Xa); lo = ya < 5; hi = ~lo
teH = yte >= 5; XteH = T(canvas(Xte[teH])); yteH = yte[teH] - 5
def accH(m):
    with torch.no_grad(): return (m(XteH).argmax(1).numpy() == yteH).mean()
torch.manual_seed(0)
pre = fit(Net(), T(Atr[lo]), torch.tensor(ya[lo]), 40, 0.01)
with torch.no_grad(): print("pretrain acc on 0-4 test", (pre(T(canvas(Xte[~teH]))).argmax(1).numpy() == yte[~teH]).mean(), "n0-4", lo.sum())
import copy
res = {}
rng = np.random.default_rng(0)
for n in [1, 3, 5, 10, 20, 100]:
    for rep in range(10):
        idx = np.concatenate([rng.choice(np.where(ya == k)[0], n, replace=False) for k in range(5, 10)])
        Xs, ys = T(Atr[idx]), torch.tensor(ya[idx] - 5)
        ep = max(30, 3000 // len(idx))
        torch.manual_seed(rep); a = accH(fit(Net(), Xs, ys, ep, 0.01))
        torch.manual_seed(rep); m = Net(copy.deepcopy(pre.body)); b = accH(fit(m, Xs, ys, ep, 0.01, params=m.fc.parameters()))
        torch.manual_seed(rep); m = Net(copy.deepcopy(pre.body)); c = accH(fit(m, Xs, ys, ep, 0.001))
        for k, v in zip(["scratch", "frozen", "finetune"], [a, b, c]): res.setdefault((n, k), []).append(v)
    print(n, {k: f"{100*np.mean(res[(n,k)]):.1f}±{100*np.std(res[(n,k)]):.1f}" for k in ["scratch", "frozen", "finetune"]})
print("n test 5-9", teH.sum())
