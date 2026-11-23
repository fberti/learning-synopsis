# A író: a leakage-demo karateklub-átlagainak ellenőrzése (heurisztikák + spektrális 2D), 20 és 200 felosztás
from calc5 import *
for runs, seed in [(20, 1), (20, 2), (200, 3)]:
    R = random.Random(seed); meth = ["CN","J","AA","RA","PA","spec2"]; acc = {m: [] for m in meth}; leak = {m: [] for m in meth}
    for r in range(runs):
        H, test = split(K, 0.1, R); a = evaluate(K, H, test, R, meth); b = evaluate(K, H, test, R, meth, leakG=K)
        for m in meth: acc[m].append(a[m]); leak[m].append(b[m])
    print(runs, "splits:", " | ".join("%s %.3f→%.3f" % (m, np.mean(acc[m]), np.mean(leak[m])) for m in meth))
