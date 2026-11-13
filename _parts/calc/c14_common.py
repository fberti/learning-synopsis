import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
def get_data():
    d = load_digits()
    X = d.data.astype(np.float64); y = d.target
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=450, random_state=0, stratify=y)
    return Xtr, Xte, ytr, yte
