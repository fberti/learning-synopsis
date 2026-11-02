# Kvíz gh6-62 – számok ellenőrzése (6.2 homofília, asszortativitás)
import warnings
import networkx as nx, numpy as np
from fractions import Fraction as F
warnings.filterwarnings("ignore")

def g(s):
    G = nx.Graph(); G.add_edges_from(tuple(x.split("-")) for x in s.split(",")); return G

def mix(G, grp):
    """belső arány, élvégarányok, véletlen szint, r – pontos törtekkel"""
    m = G.number_of_edges()
    inside = F(sum(1 for u, v in G.edges() if grp[u] == grp[v]), m)
    cats = sorted(set(grp.values()))
    a = {c: F(sum(G.degree(v) for v in G if grp[v] == c), 2 * m) for c in cats}
    rnd = sum(x * x for x in a.values())
    r = (inside - rnd) / (1 - rnd)
    return inside, a, rnd, r

AV = g("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Sz-Ko,Kl-Ko,La-Ön,La-Po,Po-Ön")

# Q1: {Sz, Kl} vs többi
grp = {v: ("SzKl" if v in ("Sz", "Kl") else "más") for v in AV}
inside, a, rnd, r = mix(AV, grp)
print("Q1 inside", inside, "a", a, "random", rnd, float(rnd), "r", r, float(r))
nx.set_node_attributes(AV, grp, "g")
print("   networkx r", nx.attribute_assortativity_coefficient(AV, "g"))
# csúcsarány: 2/7, 5/7
p = [F(2, 7), F(5, 7)]; rnd_v = sum(x * x for x in p); r_v = (inside - rnd_v) / (1 - rnd_v)
print("   node-share random", rnd_v, float(rnd_v), "r", float(r_v), " 2*inside-1", float(2 * inside - 1))
assert inside == F(7, 10) and rnd == F(5, 8) and r == F(1, 5) and r_v == F(53, 200) and 2 * inside - 1 == F(2, 5)

# Q2: 80/20, 68% belső
a1, a2, e = F(8, 10), F(2, 10), F(68, 100)
rnd = a1**2 + a2**2; r = (e - rnd) / (1 - rnd)
print("Q2 random", float(rnd), "r", r, " 2e-1", float(2 * e - 1), " only a1^2:", float((e - a1**2) / (1 - a1**2)))
assert r == 0 and 2 * e - 1 == F(36, 100) and round(float((e - a1**2) / (1 - a1**2)), 2) == 0.11

# Q3: két egyforma csoport, 30% belső
e = F(3, 10); r = (e - F(1, 2)) / F(1, 2)
print("Q3 r", float(r), " 2e-1", float(2 * e - 1), " no denominator", float(e - F(1, 2)), " sign flipped", float(1 - 2 * e))
assert r == F(-2, 5) and e - F(1, 2) == F(-1, 5)
# példagráf: C_6 kör, két egyforma csoport {1,2,3} / {4,5,6}? – 6 él, belül 4 → nem 30%; csak képletellenőrzés.

# Q4 (match): r_k
def rk(s):
    try: return nx.degree_assortativity_coefficient(g(s))
    except Exception as ex: return ex
cases = {
    "csillag 5 levéllel": "K-1,K-2,K-3,K-4,K-5",
    "K4 + különálló él": "1-2,1-3,1-4,2-3,2-4,3-4,5-6",
    "C6": "1-2,2-3,3-4,4-5,5-6,6-1",
    "4 csúcsú út": "1-2,2-3,3-4",
    "5 csúcsú út": "1-2,2-3,3-4,4-5",
}
for k, s in cases.items(): print("Q4", k, rk(s))
assert abs(rk(cases["csillag 5 levéllel"]) + 1) < 1e-9 and abs(rk(cases["K4 + különálló él"]) - 1) < 1e-9
assert abs(rk(cases["4 csúcsú út"]) + 0.5) < 1e-9 and abs(rk(cases["5 csúcsú út"]) + 1 / 3) < 1e-9
r6 = rk(cases["C6"]); print("   C6 ->", r6, "(nan / hiba = nem értelmezhető)")

# Q5: barátsággráf AB, AC, BC, CD – r_k
B = g("A-B,A-C,B-C,C-D")
rB = nx.degree_assortativity_coefficient(B)
deg = dict(B.degree())
pairs = [(deg[u], deg[v]) for u, v in [("A", "B"), ("A", "C"), ("B", "C"), ("C", "D")]]
both = pairs + [(y, x) for x, y in pairs]
x, y = np.array(both).T
print("Q5 pairs both", both, "r_k", rB, "manual", np.corrcoef(x, y)[0, 1])
one = np.array(pairs).T
print("   one direction (AB, AC, BC, CD order)", np.corrcoef(one[0], one[1])[0, 1])
# kézi tört
mx = F(int(x.sum()), len(x)); num = sum((F(int(a)) - mx) * (F(int(b)) - mx) for a, b in both); den = sum((F(int(a)) - mx) ** 2 for a in x)
print("   exact", num / den, float(num / den), "mean", mx, "num", num, "den", den)
# csúcsonkénti tévedés: fokszám vs. szomszédok átlagos fokszáma, n = 4 pont
knn = nx.average_neighbor_degree(B)
vs = list(B); print("   per-node corr(k, knn)", np.corrcoef([deg[v] for v in vs], [knn[v] for v in vs])[0, 1], knn)
assert num / den == F(-5, 7) and num == F(-5, 2) and den == F(7, 2) and round(np.corrcoef(one[0], one[1])[0, 1], 2) == -0.87

# Q7: 4 csúcsú út egy irányban felírva
for order in [[(1, 2), (2, 2), (2, 1)], [(2, 1), (2, 2), (2, 1)], [(1, 2), (2, 2), (1, 2)]]:
    a_ = np.array(order, float).T
    with np.errstate(all="ignore"):
        print("Q7", order, np.corrcoef(a_[0], a_[1])[0, 1])
print("OK")
