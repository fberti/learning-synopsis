# 12. fejezet – mesterséges filmkritikák (futó kísérlet)
import random
SUBJ = ["film", "zene", "történet", "vége", "látvány", "rendezés"]
POS = ["jó", "izgalmas", "szép", "eredeti", "remek"]
NEG = ["rossz", "unalmas", "gyenge", "zavaros", "fárasztó"]
INT_P = ["nagyon", "elég", "igazán"]       # állító alakban: a film nagyon jó volt
INT_N = ["túl", "igazán", "eléggé"]        # tagadó alakban: a film nem volt túl jó

def clause(rng, pol=None, avoid=None):
    """egy tagmondat: (tokenek, polaritás +1/-1)"""
    s = rng.choice([x for x in SUBJ if x != avoid])
    neg = rng.random() < 0.5
    adj_pos = rng.random() < 0.5
    adj = rng.choice(POS if adj_pos else NEG)
    p = (1 if adj_pos else -1) * (-1 if neg else 1)
    if pol is not None and p != pol:
        return clause(rng, pol, avoid)
    if neg:
        t = ["a", s, "nem", "volt"] + ([rng.choice(INT_N)] if rng.random() < 0.5 else []) + [adj]
    else:
        t = ["a", s] + ([rng.choice(INT_P)] if rng.random() < 0.5 else []) + [adj, "volt"]
    return t, p

def review(rng, kind=None):
    k = kind or rng.choices(["one", "de", "es"], [0.4, 0.3, 0.3])[0]
    if k == "one":
        t, p = clause(rng); return t, p, k
    t1, p1 = clause(rng)
    if k == "de":
        t2, p2 = clause(rng, -p1, t1[1]); return t1 + [",", "de"] + t2, p2, k
    t2, p2 = clause(rng, p1, t1[1]); return t1 + [",", "és"] + t2, p2, k

def make(seed=0, ntr=3000, nva=500, nte=1500):
    rng = random.Random(seed)
    seen, out = set(), []
    while len(out) < ntr + nva + nte:
        t, p, k = review(rng)
        key = " ".join(t)
        if key in seen: continue
        seen.add(key); out.append((t, (p + 1) // 2, k))
    return out[:ntr], out[ntr:ntr + nva], out[ntr + nva:]

VOCAB = ["<pad>", "a", ",", "de", "és", "nem", "volt"] + SUBJ + POS + NEG + sorted(set(INT_P + INT_N))
if __name__ == "__main__":
    tr, va, te = make()
    import collections
    print(len(VOCAB), VOCAB)
    print(collections.Counter(k for _, _, k in tr), collections.Counter(y for _, y, _ in tr))
    print(max(len(t) for t, _, _ in tr + va + te))
    for t, y, k in tr[:12]: print(y, k, " ".join(t))
