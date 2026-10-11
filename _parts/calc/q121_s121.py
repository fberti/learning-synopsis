# 12.1 kvíz (ai12-121) – számok ellenőrzése
import math, re
from collections import Counter
s = "a zene nem volt jó, de a vége nem volt rossz!"
tok = re.findall(r"\w+|[^\w\s]", s.lower())
c = Counter(tok)
print("Q1 tokens", len(tok), "distinct", len(c), "once", sum(1 for v in c.values() if v == 1))
w = [t for t in tok if re.match(r"\w", t)]
print("Q1 no punct", len(w), len(set(w)))
# Q3 bigrams of D2
d2 = "a film nem volt jó".split()
print("Q3", [" ".join(d2[i:i+2]) for i in range(len(d2)-1)])
# Q5 cos D2-D4 (szózsák)
voc = "a film jó volt nem zene unalmas remek".split()
D = {"D1": "a film jó volt", "D2": "a film nem volt jó", "D3": "a zene unalmas volt", "D4": "a film remek"}
vec = {k: [v.split().count(t) for t in voc] for k, v in D.items()}
dot = lambda a, b: sum(x*y for x, y in zip(a, b))
nrm = lambda a: math.sqrt(dot(a, a))
d = dot(vec["D2"], vec["D4"]); n2, n4 = nrm(vec["D2"]), nrm(vec["D4"])
print("Q5 cos", d/(n2*n4), "dot/5", d/5, "no sqrt", d/(n2**2*n4**2), "D1D2", dot(vec["D1"], vec["D2"])/(nrm(vec["D1"])*n2))
# Q6 'nem nem jó': tf=2 for nem, df=1, N=4
print("Q6", 2*math.log(4), math.log(4), 2*math.log10(4), 2*4)
# Q7 idf N=10
for df in (10, 5, 1): print("Q7 df", df, math.log(10/df))
print("Q7 sklearn df=10", math.log(11/11)+1)
# explain: TF-IDF cos D1-D2
df = {t: sum(1 for v in D.values() if t in v.split()) for t in voc}
idf = {t: math.log(4/df[t]) for t in voc}
tf = {k: [vec[k][i]*idf[t] for i, t in enumerate(voc)] for k in D}
print("tfidf cos D1D2", dot(tf["D1"], tf["D2"])/(nrm(tf["D1"])*nrm(tf["D2"])))
print("idf", {t: round(v, 3) for t, v in idf.items()})
