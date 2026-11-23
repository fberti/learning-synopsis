# kapcsolat-előrejelzési segédfüggvények (11. fejezet)
import numpy as np, networkx as nx, math, itertools, random
def heur(G, u, v):
    Nu, Nv = set(G[u]), set(G[v]); cn = Nu & Nv; un = Nu | Nv
    d = dict(G.degree())
    return dict(CN=len(cn), J=(len(cn)/len(un) if un else 0.0),
                AA=sum(1/math.log(d[w]) for w in cn if d[w] > 1), RA=sum(1/d[w] for w in cn), PA=d[u]*d[v])
def auc(pos, neg):
    return sum((p > n) + 0.5*(p == n) for p in pos for n in neg)/(len(pos)*len(neg))
def spectral(G, dim=2, nodes=None):
    nodes = nodes or list(G.nodes()); L = nx.laplacian_matrix(G, nodelist=nodes).toarray().astype(float)
    w, V = np.linalg.eigh(L); Z = V[:, 1:1+dim]
    return {n: Z[i] for i, n in enumerate(nodes)}, w
def walks(G, num=10, length=10, p=1, q=1, seed=0):
    R = random.Random(seed); nodes = list(G.nodes()); out = []
    for _ in range(num):
        order = nodes[:]; R.shuffle(order)
        for s in order:
            if G.degree(s) == 0: out.append([s]); continue
            w = [s]
            while len(w) < length:
                cur = w[-1]; nb = list(G[cur])
                if len(w) == 1: w.append(R.choice(nb)); continue
                prev = w[-2]; ws = [(1/p if x == prev else (1 if G.has_edge(x, prev) else 1/q)) for x in nb]
                w.append(R.choices(nb, ws)[0])
            out.append(w)
    return out
def cooc(ws, nodes, window=2):
    idx = {n: i for i, n in enumerate(nodes)}; C = np.zeros((len(nodes),)*2)
    for w in ws:
        for i, a in enumerate(w):
            for j in range(max(0, i-window), min(len(w), i+window+1)):
                if j != i: C[idx[a], idx[w[j]]] += 1
    return C
def ppmi_embed(C, dim=2, k=1):
    S = C.sum(); r = C.sum(1, keepdims=True); c = C.sum(0, keepdims=True)
    with np.errstate(divide='ignore', invalid='ignore'):
        P = np.log(C*S/(r@c)) - math.log(k)
    P[~np.isfinite(P)] = 0; P = np.maximum(P, 0)
    U, s, Vt = np.linalg.svd(P); return U[:, :dim]*np.sqrt(s[:dim])
def sgns(ws, nodes, dim=16, window=5, neg=5, epochs=5, lr=0.025, seed=0):
    rs = np.random.RandomState(seed); idx = {n: i for i, n in enumerate(nodes)}; n = len(nodes)
    Win = (rs.rand(n, dim)-0.5)/dim; Wout = np.zeros((n, dim))
    cnt = np.zeros(n)
    for w in ws:
        for a in w: cnt[idx[a]] += 1
    pn = cnt**0.75; pn /= pn.sum()
    pairs = [(idx[a], idx[w[j]]) for w in ws for i, a in enumerate(w) for j in range(max(0, i-window), min(len(w), i+window+1)) if j != i]
    pairs = np.array(pairs); T = epochs*len(pairs); t = 0
    sig = lambda x: 1/(1+np.exp(-x))
    for ep in range(epochs):
        rs.shuffle(pairs)
        for c, o in pairs:
            a = lr*max(1e-4, 1-t/T); t += 1
            tg = np.concatenate([[o], rs.choice(n, neg, p=pn)]); lab = np.zeros(neg+1); lab[0] = 1
            v = Win[c]; u = Wout[tg]; g = (lab - sig(u@v))*a
            Win[c] += g@u; Wout[tg] += np.outer(g, v)
    return {nd: Win[idx[nd]] for nd in nodes}
