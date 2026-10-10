CANVAS = 16
exec(open("_parts/calc/c11_common.py").read())
class C(nn.Module):
    def __init__(s, c1, c2, pool=True, c3=0):
        super().__init__(); s.c1 = nn.Conv2d(1, c1, 3, padding=1); s.c2 = nn.Conv2d(c1, c2, 3, padding=1); s.pool = pool
        s.c3 = nn.Conv2d(c2, c3, 3, padding=1) if c3 else None; s.fc = nn.Linear(c3 or c2, 10)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1)))
        if s.pool: x = nn.functional.max_pool2d(x, 2)
        x = torch.relu(s.c2(x))
        if s.c3 is not None: x = torch.relu(s.c3(nn.functional.max_pool2d(x, 2)))
        return s.fc(x.amax(dim=(2, 3)))
for cfg in [(8, 16, True), (8, 32, True), (16, 32, True), (8, 16, False), (8, 32, False), (8,16,True,32)]:
    for aug in [False, True]:
        r = []
        for seed in range(5):
            torch.manual_seed(seed); m = train(C(*cfg), A, ytrT, V, yvT, seed=seed, aug=aug)
            r.append([acc(m, canvas(Xte), yte), (acc(m, canvas(Xte, 1, 0), yte) + acc(m, canvas(Xte, -1, 0), yte)) / 2, acc(m, canvas(Xte, 1, 1), yte)])
        r = np.array(r); print(cfg, "aug" if aug else "   ", "params", sum(p.numel() for p in C(*cfg).parameters()), "center/dx1/diag1", r.mean(0).round(3), "center per seed", r[:, 0].round(3))
