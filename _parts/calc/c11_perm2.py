CANVAS = 16
exec(open("_parts/calc/c11_common.py").read())
class C(nn.Module):
    def __init__(s): super().__init__(); s.c1 = nn.Conv2d(1, 8, 3, padding=1); s.c2 = nn.Conv2d(8, 32, 3, padding=1); s.fc = nn.Linear(32, 10)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1))); x = nn.functional.max_pool2d(x, 2); return s.fc(torch.relu(s.c2(x)).amax(dim=(2, 3)))
class MLP(nn.Module):
    def __init__(s): super().__init__(); s.l1 = nn.Linear(256, 16); s.l2 = nn.Linear(16, 10)
    def forward(s, x): return s.l2(torch.relu(s.l1(x.flatten(1))))
perm = np.random.default_rng(42).permutation(256)
P = lambda a: a.reshape(len(a), -1)[:, perm].reshape(a.shape)
Ap, Vp, Tp = T(P(canvas(Xa))), T(P(canvas(Xv))), P(canvas(Xte))
for name, mk in [("MLP", MLP), ("CNN-B", C)]:
    for lab, (a, v, t) in {"orig": (A, V, canvas(Xte)), "perm": (Ap, Vp, Tp)}.items():
        r = []
        for seed in range(5):
            torch.manual_seed(seed); m = train(mk(), a, ytrT, v, yvT, seed=seed); r.append(acc(m, t, yte))
        print(name, lab, round(np.mean(r), 4), [round(x, 3) for x in r])
