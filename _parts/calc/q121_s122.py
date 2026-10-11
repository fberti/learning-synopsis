# 12.2 kvíz (ai12-122) – számok ellenőrzése
import numpy as np
E = np.array([[2, 1], [0, 3], [-1, 4]])
print("Q1 row", np.array([0, 1, 0]) @ E, "first row", E[0], "col", E[:, 1], "sum", E.sum(0))
V, d = 30000, 256
print("Q2", V*d, V+d, V*d+d, V*V)
u, v = np.array([3, 4]), np.array([4, 3])
print("Q3 cos", u@v/np.linalg.norm(u)/np.linalg.norm(v), "dot", u@v, "dot/sumnorm", u@v/(np.linalg.norm(u)+np.linalg.norm(v)))
# Q6 együttes előfordulás + "a busz labdát kerget"
cols = "tejet vizet iszik egeret labdát kerget benzint fogyaszt".split()
S = ["macska tejet iszik", "kutya vizet iszik", "macska egeret kerget", "kutya labdát kerget",
     "autó benzint fogyaszt", "busz benzint fogyaszt"]
def rows(sents):
    R = {}
    for s in sents:
        w = s.split()
        R.setdefault(w[0], np.zeros(len(cols)))
        for x in w[1:]: R[w[0]][cols.index(x)] += 1
    return R
cos = lambda a, b: a@b/np.linalg.norm(a)/np.linalg.norm(b)
R0 = rows(S); R1 = rows(S + ["busz labdát kerget"])
print("Q6 before macska-busz", cos(R0["macska"], R0["busz"]), "after", cos(R1["macska"], R1["busz"]),
      "dot", R1["macska"]@R1["busz"], "kutya-busz after", cos(R1["kutya"], R1["busz"]), "macska-kutya", cos(R0["macska"], R0["kutya"]))
# Q7 skip-gram párok
def pairs(n, k): return sum(min(n-1, i+k) - max(0, i-k) for i in range(n))
print("Q7 5 szó ±2:", pairs(5, 2), "±1:", pairs(5, 1), "4 szó ±2:", pairs(4, 2), "4 szó ±1:", pairs(4, 1))
print("Q3 extra no-sqrt", 24/(25*25))
