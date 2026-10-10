# a 11.9 widget hálói: MLP 256–16–10, CNN-A (pooling nélkül), CNN-B (2×2 max-pooling), CNN-B + eltolásos bővítés
import json, sys
CANVAS = 16
exec(open("_parts/calc/c11_common.py").read())
class MLP(nn.Module):
    def __init__(s): super().__init__(); s.l1 = nn.Linear(256, 16); s.l2 = nn.Linear(16, 10)
    def forward(s, x): return s.l2(torch.relu(s.l1(x.flatten(1))))
class C(nn.Module):
    def __init__(s, pool): super().__init__(); s.c1 = nn.Conv2d(1, 8, 3, padding=1); s.c2 = nn.Conv2d(8, 32, 3, padding=1); s.pool = pool; s.fc = nn.Linear(32, 10)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1)))
        if s.pool: x = nn.functional.max_pool2d(x, 2)
        return s.fc(torch.relu(s.c2(x)).amax(dim=(2, 3)))
R = 4
def gridR(m): return np.array([[acc(m, canvas(Xte, dx, dy), yte) for dx in range(-R, R+1)] for dy in range(-R, R+1)])
seed = int(sys.argv[1]) if len(sys.argv) > 1 else 0
out = {}
for key, mk, aug in [("mlp", MLP, False), ("cnnA", lambda: C(False), False), ("cnnB", lambda: C(True), False), ("cnnBaug", lambda: C(True), True)]:
    torch.manual_seed(seed); m = train(mk(), A, ytrT, V, yvT, seed=seed, aug=aug)
    # kerekített súlyok
    sd = {k: np.round(v.numpy().astype(np.float64), 4) for k, v in m.state_dict().items()}
    with torch.no_grad():
        for k, v in m.state_dict().items(): v.copy_(torch.tensor(sd[k]))
    g = gridR(m)
    print(key, "center %.4f" % g[R, R], "dx±1 %.4f" % ((g[R, R-1] + g[R, R+1]) / 2), "diag1 %.4f" % g[R+1, R+1], "dx±2 %.4f" % ((g[R, R-2] + g[R, R+2]) / 2),
          "min±2 %.4f" % g[R-2:R+3, R-2:R+3].min(), "mean±4 %.4f" % g.mean(), "params", sum(v.size for v in sd.values()))
    print((100 * g).round(1))
    out[key] = {k: v.tolist() for k, v in sd.items()}; out[key]["grid"] = (g * 450).round().astype(int).tolist()
json.dump(out, open(f"_parts/ch11/nets_s{seed}.json", "w"), separators=(",", ":"))
