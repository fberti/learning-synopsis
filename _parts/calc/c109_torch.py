import torch, torch.nn as nn
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

torch.manual_seed(1)
d = load_digits()
X, y = torch.tensor(d.data / 16.0, dtype=torch.float32), torch.tensor(d.target)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
Xtr, Xva, ytr, yva = train_test_split(Xtr, ytr, test_size=300, random_state=0, stratify=ytr)

net = nn.Sequential(nn.Linear(64, 16), nn.ReLU(), nn.Linear(16, 10))   # a logitokat adja
lossfn = nn.CrossEntropyLoss()                                         # softmax + keresztentrópia
opt = torch.optim.Adam(net.parameters(), lr=0.01)

best, best_state = float("inf"), None
for epoch in range(30):
    net.train()
    for idx in torch.randperm(len(Xtr)).split(32):                     # keverés, 32-es kötegek
        opt.zero_grad()
        loss = lossfn(net(Xtr[idx]), ytr[idx])
        loss.backward()
        opt.step()
    net.eval()
    with torch.no_grad():
        val = lossfn(net(Xva), yva).item()
    if val < best:                                                     # korai leállítás: a legjobb mentése
        best, best_state = val, {k: v.clone() for k, v in net.state_dict().items()}
net.load_state_dict(best_state)
with torch.no_grad():
    print(round(best, 3), (net(Xte).argmax(1) == yte).float().mean().item())
