# 12.6 kvíz – számellenőrzés
import numpy as np
def sm(x):
    x = np.asarray(x, float); e = np.exp(x - x.max()); return e / e.sum()
d = 256
print("A1 12d2+13d", 12*d*d + 13*d, "12d2", 12*d*d, "attn", 4*d*d + 4*d, "ffn", 8*d*d + 5*d)
x = np.array([2, 2, 2, 6], float); m = x.mean(); c = x - m
print("A2 helyes", (c / np.sqrt((c**2).mean())).round(3), "n-1", (c / c.std(ddof=1)).round(3),
      "var-ral", (c / (c**2).mean()).round(3), "csak közép", c)
print("A2 példa (1,2,3,6)", ((np.array([1,2,3,6])-3)/np.sqrt(3.5)).round(3))
n = 8
print("B1 -inf", n*(n-1)//2, "főátlóval", n*(n+1)//2, "minden", n*n, "két háromszög", n*(n-1))
s = np.array([1, 3, 2, 0], float)  # 2. token sora (1-től), 3-4 jövőbeli
print("B2 helyes", sm(s[:2]).round(3), "maszk nélkül", sm(s).round(3),
      "rossz háromszög", sm(s[1:]).round(3), "softmax után maszk", sm(s)[:2].round(3))
N = 300
print("C2 kiválasztott", 0.15*N, "MASK", 0.8*0.15*N, "80% az egészből", 0.8*N, "nem MASK", 0.2*0.15*N)
# szöveg ellenőrzés
print(28*16, 15*16, 4*(16*16+16), 16*32+32+32*16+16, 448+240+1088+32+1072+32+17)
print("BERT blokk", 12*768**2+13*768, 12*(12*768**2+13*768))
print("512 blokk", 12*512**2+13*512, "768 attn/ffn", 4*768**2+4*768, 8*768**2+5*768)
print("GPT3", 12*12288**2, 96*12*12288**2)
print("BERT 512", 0.15*512, 0.8*0.15*512, 0.1*0.15*512, 511/(0.15*512))
print("levél maszk", sm(np.array([2,2])/np.sqrt(2)) @ np.array([[2,0],[1,1]]))
print("softmax(2,1)", sm([2,1]).round(3))
