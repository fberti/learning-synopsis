import numpy as np, json
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
d = load_digits(); X = d.data/16.0; y = d.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
print(len(Xtr), len(Xte))
lr = LogisticRegression(max_iter=5000, C=1.0).fit(Xtr, ytr)
print("softmax reg test", lr.score(Xte, yte), "train", lr.score(Xtr, ytr))
for H in [4, 8, 16, 32, 64]:
    accs=[]
    for s in range(3):
        m = MLPClassifier(hidden_layer_sizes=(H,), activation="relu", solver="adam", alpha=1e-3, max_iter=3000, random_state=s).fit(Xtr, ytr)
        accs.append(m.score(Xte, yte))
    print(H, np.round(accs,4))
