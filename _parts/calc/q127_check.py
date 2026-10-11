# 12.7 kvíz – számellenőrzés
import math
L, n = 3, 100
print("P1 RNN", n + L - 1, "teljes rétegenként", L*n, "Transformer", L)
d = 512
print("P2 helyes n>6d", 6*d, "2-es szorzó nélkül 12d", 12*d, "csak FFN 8nd^2 -> 4d", 4*d, "naiv", d)
for k in (2, 4, 10, 100):
    print("P6 N x", k, round(k ** -0.076, 4))
print("P6 lineáris tévhit", 1 - 0.076, "felezés duplázásonként", round(0.5 ** math.log2(100), 4))
N = 10e9; D = 20*N
print("P7 helyes", 6*N*D, "6 nélkül", N*D, "D=N", 6*N*N, "20 kétszer", 6*N*20*D)
# szöveg ellenőrzés
print("12nd2 vs 2n2d @512", 12*512*768**2, 2*512**2*768, 6*768, 6*1024)
print("GPT-3 C", 6*175e9*300e9, 300/175, "Chinchilla C", 6*70e9*1.4e12, 6*70e9*1.4e12/(6*175e9*300e9))
print("8B*12T", 6*8e9*12e12, 70/8, "Llama3", 15e12/8e9, "7B*20", 7e9*20)
print("BERT-TFIDF", 93-89.7)
wpd = 300*60*8
for wpt, lab in ((1.0, "1 szó/token"), (1/1.3, "1,3 token/szó (12.1)"), (0.75, "0,75 szó/token")):
    print("évek", lab, round(300e9*wpt/wpd/365, 0))
