import sys
CANVAS = 16
exec(open("_parts/calc/c11_common.py").read())
R = 4
def gridR(m): return np.array([[acc(m, canvas(Xte, dx, dy), yte) for dx in range(-R, R+1)] for dy in range(-R, R+1)])
class MLP(nn.Module):
    def __init__(s, n=CANVAS*CANVAS, h=16): super().__init__(); s.f = nn.Sequential(nn.Flatten(), nn.Linear(n, h), nn.ReLU(), nn.Linear(h, 10))
    def forward(s, x): return s.f(x)
class CNNv(nn.Module):
    def __init__(s, pools, c1=8, c2=16):
        super().__init__(); s.c1 = nn.Conv2d(1, c1, 3, padding=1); s.c2 = nn.Conv2d(c1, c2, 3, padding=1); s.pools = pools; s.fc = nn.Linear(c2, 10)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1)))
        if s.pools >= 1: x = nn.functional.max_pool2d(x, 2)
        x = torch.relu(s.c2(x))
        return s.fc(x.amax(dim=(2, 3)))
def ring(g, r): return np.mean([g[dy+R, dx+R] for dy in range(-R,R+1) for dx in range(-R,R+1) if max(abs(dx),abs(dy))==r])
for name, mk in [("MLP", lambda: MLP()), ("CNN0", lambda: CNNv(0)), ("CNN1", lambda: CNNv(1))]:
    for aug in [False, True]:
        gs = []
        for seed in range(5):
            torch.manual_seed(seed); m = train(mk(), A, ytrT, V, yvT, seed=seed, aug=aug); gs.append(gridR(m))
        g = np.mean(gs, 0)
        print(name, "aug" if aug else "   ", "center %.3f" % g[R,R], "rings", [round(ring(g, r), 3) for r in range(1, R+1)],
              "dx1 %.3f dx2 %.3f" % ((g[R,R-1]+g[R,R+1])/2, (g[R,R-2]+g[R,R+2])/2), "seeds center", [round(x[R,R],3) for x in gs])
        print((100*g[R-2:R+3, R-2:R+3]).round(1))
print("params", sum(p.numel() for p in MLP().parameters()), sum(p.numel() for p in CNNv(0).parameters()))
