import torch, torch.nn as nn, numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

def lap(X, dx=0, dy=0):                        # 8×8 számjegy a 16×16-os lapra, (4+dx; 4+dy)-ra
    L = np.zeros((len(X), 1, 16, 16), dtype=np.float32)
    L[:, 0, 4+dy:12+dy, 4+dx:12+dx] = X.reshape(-1, 8, 8) / 16
    return torch.tensor(L)

d = load_digits()
Xtr, Xte, ytr, yte = train_test_split(d.data, d.target, test_size=0.25, random_state=0, stratify=d.target)
torch.manual_seed(3)
net = nn.Sequential(nn.Conv2d(1, 8, 3, padding=1), nn.ReLU(),
                    nn.Conv2d(8, 32, 3, padding=1), nn.ReLU(),
                    nn.AdaptiveMaxPool2d(1), nn.Flatten(),   # globális max: 32 szám
                    nn.Linear(32, 10))
opt, lossfn = torch.optim.Adam(net.parameters(), lr=0.01), nn.CrossEntropyLoss()
X, y = lap(Xtr), torch.tensor(ytr)
for epoch in range(40):
    for idx in torch.randperm(len(X)).split(32):
        opt.zero_grad(); lossfn(net(X[idx]), y[idx]).backward(); opt.step()
with torch.no_grad():
    for dx in (0, 1, 2):
        print(dx, (net(lap(Xte, dx)).argmax(1).numpy() == yte).mean())   # ugyanannyi minden eltolásnál
