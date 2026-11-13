"""Független ellenőrzés a w3.js diffusion-2d / cfg-2d számolásához (numpy).
A tanítóadatot és a kiinduló zajt a widget dumpjából olvassa (w143_pw.py), a mintavételt újra megírja."""
import json, os, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))

def cos_sched(T, s=0.008):
    t = np.arange(T + 1)
    f = np.cos(((t / T) + s) / (1 + s) * np.pi / 2) ** 2
    return f / f[0]

def times(T, n):
    return [int(round(T * (n - k) / n)) for k in range(n + 1)]

def x0_exact(X, ab, mu, h2, logpi):
    """E[x0 | xt] Gauss-keverékre; X: (N,2), mu: (K,2), h2: (K,)"""
    sa = np.sqrt(ab); v = ab * h2 + 1 - ab                     # (K,)
    D = X[:, None, :] - sa * mu[None, :, :]                    # (N,K,2)
    L = logpi[None, :] - (D ** 2).sum(-1) / (2 * v[None, :]) - np.log(v)[None, :]
    L -= L.max(1, keepdims=True); W = np.exp(L); W /= W.sum(1, keepdims=True)
    M = mu[None] + (h2 * sa / v)[None, :, None] * D           # (N,K,2)
    return (W[..., None] * M).sum(1)

def sample(start, abar, ts, x0fn, eta=0, rng=None):
    X = start.copy()
    for k in range(len(ts) - 1):
        ab, ab1 = abar[ts[k]], abar[ts[k + 1]]
        x0 = x0fn(X, ab)
        eps = (X - np.sqrt(ab) * x0) / np.sqrt(1 - ab)
        s2 = (1 - ab1) / (1 - ab) * (1 - ab / ab1) if eta else 0.0
        X = np.sqrt(ab1) * x0 + np.sqrt(max(0.0, 1 - ab1 - s2)) * eps
        if eta: X = X + np.sqrt(s2) * rng.standard_normal(X.shape)
    return X

def nn_stats(S, data):
    d = np.sqrt(((S[:, None, :] - data[None]) ** 2).sum(-1)).min(1)
    return (d < 0.01).mean(), np.median(d)

# --- 1) ütemezés ---
ab = cos_sched(50)
print("abar_0..3:", ab[:4], " abar_T:", ab[50], " abar_25:", ab[25])

# --- 2) a pontos zajtalanító h → 0, t kicsi: a legközelebbi tanítópontra visz ---
d = json.load(open(os.path.join(HERE, "w143_dump_h0.json")))
data = np.array(d["data"]); start = np.array(d["start"]); K = len(data)
lp = np.zeros(K)
x = data[5] + np.array([0.003, -0.002])
for a in (0.9, 0.999, 0.99999):
    print("h=0, abar=%g: |x0hat - mu5| =" % a, np.linalg.norm(x0_exact((np.sqrt(a) * x)[None], a, data, np.zeros(K), lp)[0] - data[5]))
for hh in (0.05, 0.01, 0.001, 0):
    print("abar=0.99999, h=%g: |x0hat-mu5| =" % hh, np.linalg.norm(x0_exact((np.sqrt(0.99999) * x)[None], 0.99999, data, np.full(K, hh * hh), lp)[0] - data[5]))
# h → ∞ nélkül: abar = 0-nál x0hat = az adat átlaga
print("abar≈0: x0hat - mean =", x0_exact(start[:2], ab[50], data, np.full(K, 0.0025), lp) - data.mean(0))

# --- 3) DDIM-konzisztencia: egy lépés t → t ugyanazt adja; a lépés megfordítható (ODE), a widget dumpjával egyezik ---
for hv in ("0", "0.05"):
    d = json.load(open(os.path.join(HERE, f"w143_dump_h{hv}.json")))
    h = float(hv); data = np.array(d["data"]); start = np.array(d["start"])
    f = lambda X, a: x0_exact(X, a, data, np.full(K, h * h), lp)
    S = sample(start, ab, times(50, 50), f)
    print(f"h={hv}: max |python - widget| =", np.abs(S - np.array(d["final"])).max(), " stats py:", nn_stats(S, data), " widget:", d["stats"])
d = json.load(open(os.path.join(HERE, "w143_dump_h0_n1000.json")))
S = sample(np.array(d["start"]), cos_sched(50 * 20), times(1000, 1000), lambda X, a: x0_exact(X, a, data, np.zeros(K), lp))
print("h=0, 1000 lépés: max |python - widget| =", np.abs(S - np.array(d["final"])).max(), " stats py:", nn_stats(S, data), " widget:", d["stats"])
# egy lépés t → t' → (ugyanazzal a x0, eps) helyreállítja-e x_t-t: x_t = sqrt(ab) x0 + sqrt(1-ab) eps
X = start[:5]; a, a1 = ab[30], ab[29]; x0 = f(X, a); eps = (X - np.sqrt(a) * x0) / np.sqrt(1 - a)
print("x_t rekonstrukció hibája:", np.abs(np.sqrt(a) * x0 + np.sqrt(1 - a) * eps - X).max())

# --- 4) h-pásztázás: 50 lépés DDIM, valamint finomabb idő (T = 1000) ---
print("\nh-pásztázás (spirál, DDIM, alap mag):")
for h in (0, 0.02, 0.05, 0.1):
    f = lambda X, a: x0_exact(X, a, data, np.full(K, h * h), lp)
    S50 = sample(start, ab, times(50, 50), f)
    ab1k = cos_sched(1000); S1k = sample(start, ab1k, times(1000, 1000), f)
    print(f" h={h}: T=50 copy%={nn_stats(S50, data)[0]*100:.1f} med={nn_stats(S50, data)[1]:.4f} | T=1000 copy%={nn_stats(S1k, data)[0]*100:.1f} med={nn_stats(S1k, data)[1]:.4f}")

# --- 5) CFG ---
A = np.array([[-0.7, 0.35], [-0.55, -0.45], [-0.05, 0.15]]); mu = np.vstack([A, -A])
hs = np.array([0.2, 0.2, 0.22] * 2); h2 = hs ** 2; lpi = np.log(np.full(6, 1 / 6))
cls = [np.array([0, 1, 2]), np.array([3, 4, 5])]
st = np.array(json.load(open(os.path.join(HERE, "w143_dump_cfg.json")))["start"])
def post(S, c):
    P = np.exp(-((S[:, None] - mu[None]) ** 2).sum(-1) / (2 * h2)) / h2
    return P[:, cls[c]].sum(1) / P.sum(1)
print("\nCFG (300 minta, DDIM 25 lépés):")
for c in (0, 1):
    m = mu[cls[c]].mean(0); ref = np.sqrt((((mu[cls[c]] - m) ** 2).sum(1) + 2 * h2[cls[c]]).mean())
    for s in (0, 1, 3, 7.5):
        def f(X, a):
            u = x0_exact(X, a, mu, h2, lpi); q = x0_exact(X, a, mu[cls[c]], h2[cls[c]], lpi[cls[c]])
            return u + s * (q - u)
        S = sample(st, ab, times(50, 25), f)
        sure = (post(S, c) > 0.9).mean(); spread = np.sqrt(((S - S.mean(0)) ** 2).sum(1).mean())
        out = (np.sqrt(((S[:, None] - mu[cls[c]][None]) ** 2).sum(-1)) > 3 * hs[cls[c]]).all(1).mean()
        P = np.stack([-((S - mu[k]) ** 2).sum(1) / (2 * h2[k]) - np.log(h2[k]) for k in range(6)], 1); mid = (P.argmax(1) == cls[c][2]).mean()
        print(f" c={'AB'[c]} s={s}: középső felhő={mid*100:.1f}% biztos={sure*100:.1f}% szórás={spread:.4f} (adat {ref:.4f}) kilóg={out*100:.1f}% átlag={S.mean(0).round(4)}")
    # s = 1 mellett nagy mintán: a minták eloszlása ≈ p(x|c)? (átlag és szórás)
    rs = np.random.default_rng(0); kk = rs.choice(cls[c], 200000); X = mu[kk] + hs[kk][:, None] * rs.standard_normal((200000, 2))
    print(f"  a valódi p(x|{'AB'[c]}) tömegéből p(c|x)>0,9: {(post(X, c) > 0.9).mean()*100:.1f}%")
    big = rs.standard_normal((20000, 2))
    def f1(X, a): return x0_exact(X, a, mu[cls[c]], h2[cls[c]], lpi[cls[c]])
    S = sample(big, ab, times(50, 25), f1); S2 = sample(big, ab, times(50, 50), f1)
    print(f"  s=1, 20000 minta: átlag {S.mean(0).round(4)} (adat {m.round(4)}), szórás 25 lépés {np.sqrt(((S-S.mean(0))**2).sum(1).mean()):.4f}, 50 lépés {np.sqrt(((S2-S2.mean(0))**2).sum(1).mean()):.4f}, adat {ref:.4f}")

# --- 6) diffusion-digits: a lineáris ütemezés egyezik-e a GEN14.ddpm.abar-ral ---
s = open(os.path.join(HERE, "..", "..", "mesterseges-intelligencia", "14-generativ-modellek", "gen-data.js")).read()
dd = json.loads(s[s.index("{"):s.rindex("}") + 1])["ddpm"]
beta = 1e-4 + (0.02 - 1e-4) * np.arange(1000) / 999; abl = np.cumprod(1 - beta)
print("\nlineáris ᾱ_t a pillanatképeknél:", [float(f"{abl[t]:.5g}") for t in dd["t"]])
print("GEN14.ddpm.abar:                 ", dd["abar"])
for t in (300, 500, 700): print(f" t={t}: abar={abl[t]:.4f} snr={abl[t]/(1-abl[t]):.3f}")
