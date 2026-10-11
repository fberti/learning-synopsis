import numpy as np
X = np.array([[2, 0], [1, 1], [1, 0]], dtype=float)   # fa, levél, hullik
W_Q = W_K = W_V = np.eye(2)                            # egyelőre egységmátrixok
Q, K, V = X @ W_Q, X @ W_K, X @ W_V
S = Q @ K.T / np.sqrt(K.shape[1])                      # pontszámok, ÷√d
A = np.exp(S - S.max(axis=1, keepdims=True))
A = A / A.sum(axis=1, keepdims=True)                   # soronkénti softmax
Z = A @ V
print(A.round(3))
print(Z.round(3))
