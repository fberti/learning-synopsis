import numpy as np
A = np.array([[-0.7, 0.35], [-0.55, -0.45], [-0.05, 0.15]]); mu = np.vstack([A, -A]); hs = np.array([0.2, 0.2, 0.22] * 2); h2 = hs**2
rs = np.random.default_rng(0)
for c, cl in ((0, [0,1,2]), (1, [3,4,5])):
    kk = rs.choice(cl, 2_000_000); X = mu[kk] + hs[kk][:, None] * rs.standard_normal((len(kk), 2))
    L = np.stack([-((X - mu[k])**2).sum(1)/(2*h2[k]) - np.log(h2[k]) for k in range(6)], 1)
    print(c, "share argmax==central(all6):", (L.argmax(1) == cl[2]).mean())
