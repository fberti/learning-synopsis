# pixelkeverés: MLP vs CNN (HAW 5 kísérletének mása a digits-en), 16×16 lap
CANVAS = 16
exec(open("_parts/calc/c11_common.py").read())
class MLP(nn.Module):
    def __init__(s, n=256, h=16): super().__init__(); s.f = nn.Sequential(nn.Flatten(), nn.Linear(n, h), nn.ReLU(), nn.Linear(h, 10))
    def forward(s, x): return s.f(x)
class CNN1(nn.Module):
    def __init__(s): super().__init__(); s.c1 = nn.Conv2d(1, 8, 3, padding=1); s.c2 = nn.Conv2d(8, 16, 3, padding=1); s.fc = nn.Linear(16, 10)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1))); x = nn.functional.max_pool2d(x, 2); x = torch.relu(s.c2(x)); return s.fc(x.amax(dim=(2, 3)))
perm = np.random.default_rng(42).permutation(256)
P = lambda a: a.reshape(len(a), -1)[:, perm].reshape(a.shape)
Ap, Vp = T(P(canvas(Xa))), T(P(canvas(Xv))); Tp = P(canvas(Xte))
for name, mk in [("MLP", MLP), ("CNN1", CNN1)]:
    for lab, (a, v, t) in {"orig": (A, V, canvas(Xte)), "perm": (Ap, Vp, Tp)}.items():
        r = []
        for seed in range(5):
            torch.manual_seed(seed); m = train(mk(), a, ytrT, v, yvT, seed=seed); r.append(acc(m, t, yte))
        print(name, lab, round(np.mean(r), 4), [round(x, 3) for x in r])
