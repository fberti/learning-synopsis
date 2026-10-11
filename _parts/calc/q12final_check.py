# 12. fejezetzáró kvíz – számellenőrzés
import numpy as np, math
def sm(x):
    x = np.asarray(x, float); e = np.exp(x - x.max()); return e / e.sum()
def cos(u, v): u, v = np.asarray(u, float), np.asarray(v, float); return u @ v / np.linalg.norm(u) / np.linalg.norm(v)
# F1 TF-IDF D1–D3; szótár: a, film, jó, volt, nem, zene, unalmas, remek
df = np.array([4, 3, 2, 3, 1, 1, 1, 1]); N = 4
D1 = np.array([1, 1, 1, 1, 0, 0, 0, 0]); D3 = np.array([1, 0, 0, 1, 0, 1, 1, 0])
idf = np.log(N / df); idf_sk = np.log((1 + N) / (1 + df)) + 1
print("F1 tfidf", round(cos(D1*idf, D3*idf), 3), "szózsák", cos(D1, D3), "sklearn idf", round(cos(D1*idf_sk, D3*idf_sk), 3),
      "df-fel", round(cos(D1*df, D3*df), 3), "lg", round(cos(D1*idf/np.log(10), D3*idf/np.log(10)), 3))
# F2 csere: szópárok azonossága állító tagmondatoknál (megjegyzés a jelentéshez)
def bigr(t): return sorted(zip(t, t[1:]))
a = "a film jó volt , de a vége unalmas volt".split(); b = "a vége unalmas volt , de a film jó volt".split()
print("F2 szópár-multihalmaz azonos (állító+állító):", bigr(a) == bigr(b))
a = "a film nem volt jó , de a vége unalmas volt".split(); b = "a vége unalmas volt , de a film nem volt jó".split()
print("F2 szópár-multihalmaz azonos (tagadó+állító):", bigr(a) == bigr(b))
print("F2 bigram 'de' felső becslés, ha 1/4 párnál tipp:", 0.75 + 0.25*0.5)
# F3 együttes előfordulás + "a kutya tejet iszik"; oszlopok: tejet vizet iszik egeret labdát kerget benzint fogyaszt
macska = [1, 0, 1, 1, 0, 1, 0, 0]; kutya = [1, 1, 2, 0, 1, 1, 0, 0]; kutya_bin = [1, 1, 1, 0, 1, 1, 0, 0]
print("F3", round(cos(macska, kutya), 3), "bináris", round(cos(macska, kutya_bin), 3),
      "régi", cos(macska, [0, 1, 1, 0, 1, 1, 0, 0]), "norma nélkül változatlan", 3/4)
# F5 RNN játék: h = tanh(0,5 h + x); unalmas=-1, jó=+1, de=0
def run(xs, f=math.tanh):
    h = 0.0
    for x in xs: h = f(0.5*h + x)
    return h
print("F5 unalmas jó de", round(run([-1, 1, 0]), 4), "tanh nélkül", run([-1, 1, 0], lambda z: z),
      "fordított sorrend", round(run([0, 1, -1]), 4), "átlag", (-1 + 1 + 0)/3)
# F6 LSTM
d, h = 16, 32
print("F6 LSTM", 4*(d*h + h*h + h), "RNN", d*h + h*h + h, "GRU 3x", 3*(d*h + h*h + h), "torzítás nélkül", 4*(d*h + h*h))
# F7 puha keresés q=(2;0)
K = np.array([[2, 0], [0, 2], [1, 1]], float); V = np.array([10, 20, 30], float); q = np.array([2, 0], float)
s = K @ q; w = sm(s)
print("F7 pontszám", s, "súly", w.round(3), "válasz", round(w @ V, 2), "kemény", V[s.argmax()], "átlag", V.mean(),
      "pontszám-arány", round((s/s.sum()) @ V, 2))
# 12.4 szöveg
print("12.4 példa", round(sm([2, 0, 1]) @ V, 2), sm([6, 0, 3]).round(3), round(sm([6, 0, 3]) @ V, 2))
# F9
print("F9", math.sqrt(64), math.sqrt(512), 64, math.sqrt(8))
# F10 levél sor maszkkal (A mondat)
X = np.array([[2, 0], [1, 1], [1, 0]], float); sc = X[1] @ X.T / math.sqrt(2)
print("F10 helyes", sm(sc[:2]) @ X[:2], "maszk nélkül", (sm(sc) @ X).round(3),
      "rossz háromszög", (sm(sc[1:]) @ X[1:]).round(3), "újranormálás nélkül", (sm(sc)[:2] @ X[:2]).round(3))
# F11 GPT-2 blokkok
d = 1600
for lab, p in (("12d2+13d", 12*d*d + 13*d), ("attn", 4*d*d + 4*d), ("ffn", 8*d*d + 5*d)):
    print("F11", lab, p, "x48", 48*p)
# F12 BERT vs GPT jelek 512
print("F12", 511/(0.15*512))
# F13 Chinchilla: C = 6 N D, D = 20 N
C = 1.2e23
print("F13 helyes", math.sqrt(C/120), "20 nélkül", math.sqrt(C/6), "6 nélkül", math.sqrt(C/20), "D=N/20", math.sqrt(C*20/6),
      "D", 20*math.sqrt(C/120))
print("F1 hosszak", round(np.linalg.norm(D1*idf), 3), round(np.linalg.norm(D3*idf), 3), "szorzat", round((D1*idf) @ (D3*idf), 3))
print("F7 pontos", w @ V, "F14 különbség", 0.952 - 0.832)
