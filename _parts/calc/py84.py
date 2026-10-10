import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score
import umap                                             # pip install umap-learn

X, y = load_digits(return_X_y=True)                     # 1797 kép, 64 pixel
rng = np.random.RandomState(0)                          # számjegyenként 80 kép
idx = np.sort(np.concatenate([rng.choice(np.where(y == c)[0], 80, replace=False) for c in range(10)]))
X, y = X[idx], y[idx]

terkep = {"PCA": PCA(2).fit_transform(X),
          "t-SNE 30": TSNE(2, perplexity=30, init="pca", random_state=0).fit_transform(X),
          "UMAP": umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=0).fit_transform(X)}
for nev, E in terkep.items():                           # mennyire „jó szomszédok” a térképen?
    print(nev, cross_val_score(KNeighborsClassifier(5), E, y, cv=5).mean().round(3))
