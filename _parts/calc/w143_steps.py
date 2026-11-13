import json, os, numpy as np, importlib.util, sys
sys.argv=['x']
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "w143_check.py")).read().split("# --- 1)")[0]
exec(src)
d = json.load(open(os.path.join(HERE, "w143_dump_h0.json")))
data = np.array(d["data"]); start = np.array(d["start"]); K = len(data); lp = np.zeros(K)
for T in (50, 200, 1000):
    ab = cos_sched(T)
    for n in (50, 100, 200, 500, 1000):
        if n > T: continue
        for h in (0, 0.02):
            f = lambda X, a: x0_exact(X, a, data, np.full(K, h*h), lp)
            S = sample(start, ab, times(T, n), f)
            S2 = sample(start, ab, times(T, n), f, eta=1, rng=np.random.default_rng(1))
            print(T, n, h, "DDIM", [round(float(v),4) for v in nn_stats(S, data)], "DDPM", [round(float(v),4) for v in nn_stats(S2, data)])
