# wcheckA_py.py – a w1 ellenőrző számai Pythonban (networkx)
import networkx as nx, numpy as np, random, math
from scipy.optimize import brentq
def stats(G):
    k = np.array([d for _, d in G.degree()], float); k1 = k.mean(); k2 = (k**2).mean(); kap = k2/k1 - 1
    return k1, k2, kap, 1/kap, int(k.max())
for seed in [1, 2, 3]:
    G = nx.barabasi_albert_graph(10000, 2, seed=seed); rnd = random.Random(seed); n = 10000; k = 1000
    deg = dict(G.degree()); out = [f"BA1e4 s{seed}: kappa {stats(G)[2]:.2f} Tc {stats(G)[3]:.3f}"]
    sets = {"rand": rnd.sample(range(n), k), "hub": sorted(G, key=lambda v: -deg[v])[:k]}
    acq = set()
    while len(acq) < k:
        v = rnd.randrange(n); nb = list(G[v])
        if nb: acq.add(rnd.choice(nb))
    sets["acq"] = list(acq)
    for name, S in sets.items():
        H = G.copy(); H.remove_nodes_from(S); s = stats(H)
        out.append(f"{name}: immK {np.mean([deg[v] for v in S]):.1f} Tc {s[3]:.3f}")
    print(" | ".join(out))
for n in [1000, 100000]:
    print("BA n", n, "Tc %.3f" % stats(nx.barabasi_albert_graph(n, 2, seed=1))[3], "ER Tc %.3f" % stats(nx.gnm_random_graph(n, 2*n, seed=1))[3])
# keverő populáció, R0 = 2: folytonos végső méret és a diszkrét lépés
print("final size eq z = 1 - exp(-2z):", round(brentq(lambda z: z - 1 + math.exp(-2*z), 0.1, 1), 3))
s, i, r = 1 - 1/200, 1/200, 0
for t in range(400):
    new = s * (1 - (1 - 0.5*i)**4); rec = i; s -= new; i += new - rec; r += rec
    if i*200 < 1e-3: break
print("discrete mean field n=200, beta .5 gamma 1, <k>=4: final R", round(r, 3))
# Árvízhét SI beta = 1 a Kl-ből (szélességi bejárás)
AE = "Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Ko-Sz,Ko-Kl,La-Ön,Po-La,Po-Ön"
A = nx.Graph([e.split("-") for e in AE.split(",")]); d = nx.single_source_shortest_path_length(A, "Kl")
print("SI Kl:", [sum(1 for v in d.values() if v <= t) for t in range(4)])
# DeGroot
def dg(edges, nodes, x0):
    G = nx.Graph(edges); G.add_nodes_from(nodes); k = np.array([G.degree(v) + 1 for v in nodes]); return float((k / k.sum()) @ np.array(x0))
print("DeGroot path (7,0,0):", round(dg([("A","B"),("B","C")], "ABC", [7,0,0]), 3),
      "star centre 10:", round(dg([("K",c) for c in "1234"], "K1234", [10,0,0,0,0]), 3),
      "leaf 10:", round(dg([("K",c) for c in "1234"], "K1234", [0,10,0,0,0]), 3))
# HK kis példa
def hk(x, eps):
    x = np.array(x, float); return np.array([x[np.abs(x - xi) <= eps + 1e-12].mean() for xi in x])
for eps in [0.15, 0.25, 0.45]:
    x = [0, .2, .4, .8, 1]; steps = 0
    for _ in range(100):
        y = hk(x, eps)
        if np.max(np.abs(y - x)) < 1e-9: break
        x = y; steps += 1
    print("HK5 eps", eps, "steps", steps, np.round(x, 4))
# HK / Deffuant N = 100
rs = np.random.default_rng(7)
def clusters(x, gap=0.02):
    s = np.sort(x); c = [[s[0]]]
    for a, b in zip(s, s[1:]):
        if b - a > gap: c.append([])
        c[-1].append(b)
    return [len(z) for z in c]
for eps in [0.05, 0.1, 0.15, 0.2, 0.3]:
    res = []
    for r in range(20):
        x = rs.random(100)
        for _ in range(100):
            y = hk(x, eps)
            if np.max(np.abs(y - x)) < 1e-9: break
            x = y
        res.append(len(clusters(x)))
    print("HK eps", eps, "clusters over 20 runs:", sorted(res))
for eps in [0.1, 0.15, 0.25, 0.3]:
    res = []
    for r in range(20):
        x = rs.random(100)
        for _ in range(200 * 100):
            i, j = rs.integers(100, size=2)
            if i != j and abs(x[i] - x[j]) < eps: d = x[j] - x[i]; x[i] += .5 * d; x[j] -= .5 * d
        res.append(sum(1 for c in clusters(x) if c >= 5))
    print("Deffuant eps", eps, "big clusters (>=5) over 20 runs:", sorted(res), "floor(1/2eps) =", math.floor(1 / (2 * eps)))
