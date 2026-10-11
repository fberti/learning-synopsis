# 12.4 kvíz (ai12-124) – számok ellenőrzése
import numpy as np
K = np.array([[2, 0], [0, 2], [1, 1]]); Vv = np.array([10, 20, 30])
def att(q):
    s = K @ np.array(q, float); a = np.exp(s) / np.exp(s).sum()
    return s, a, a @ Vv
s, a, out = att([0, 2])
print("Q3 scores", s, "weights", a.round(4), "out", round(out, 2))
print("Q3 raw-normalized", (s / s.sum()) @ Vv, "unnormalized sum", s @ Vv, "softmax then /3", out / 3)
print("check text example", att([1, 0])[2], att([3, 0])[2], att([0, 1])[2])
# Q6: tetszőleges pontszámokkal a kimenet a (10, 30) nyílt intervallumban
def out_scores(sc):
    sc = np.array(sc, float); a = np.exp(sc - sc.max()); a /= a.sum(); return a @ Vv
print("Q6 10,5 ~", out_scores([0, -10, -4.0]), " 29,9 ~", out_scores([-10, -1.6, 2.0]), " 20 =", out_scores([0, 0, 0]))
print("Q6 extreme", out_scores([50, 0, 0]), out_scores([0, 0, 50]))
print("Q8", 7*9, 7+9, 7*7, 9*9)
import math
for target in (10.5, 29.9):
    a3 = (target - 10) / 20; x = math.log(a3 / (1 - a3))
    print("Q6 target", target, "scores (0, -100, %.3f) ->" % x, out_scores([0, -100, x]))
