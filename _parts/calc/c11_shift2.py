# változatok: hol van stride-os pooling a CNN-ben
import numpy as np, torch, torch.nn as nn, sys
exec(open("_parts/calc/c11_common.py").read())
class CNNv(nn.Module):
    def __init__(s, pools, c1=8, c2=16):
        super().__init__(); s.c1 = nn.Conv2d(1, c1, 3, padding=1); s.c2 = nn.Conv2d(c1, c2, 3, padding=1); s.pools = pools; s.fc = nn.Linear(c2, 10)
    def forward(s, x):
        x = torch.relu(s.c1(x.unsqueeze(1)))
        if s.pools >= 1: x = nn.functional.max_pool2d(x, 2)
        x = torch.relu(s.c2(x))
        if s.pools >= 2: x = nn.functional.max_pool2d(x, 2)
        return s.fc(x.amax(dim=(2, 3)))
for pools in [0, 1]:
    for aug in [False, True]:
        gs = []
        for seed in range(3):
            torch.manual_seed(seed); m = train(CNNv(pools), A, ytrT, V, yvT, seed=seed, aug=aug); gs.append(grid(m))
        g = np.mean(gs, 0); print("pools", pools, "aug", aug, "center", g[2,2].round(3), "all", g.mean().round(3), "min", g.min().round(3)); print((100*g).round(1))
