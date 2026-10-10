import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
d = load_digits(); X = d.data.astype(int); y = d.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
Xa, Xv, ya, yv = train_test_split(Xtr, ytr, test_size=300, random_state=0, stratify=ytr)
enc = lambda A: "".join(chr(97+v) for v in A.ravel())
parts = {"train": (Xa, ya), "val": (Xv, yv), "test": (Xte, yte)}
js = ["/* 10. fejezet – a scikit-learn digits adatkészlet (1797 kézzel írt számjegy, 8×8 pixel, 0–16-os értékek).",
      "   Felosztás: a 9. fejezet 1347/450-es tanító/teszt vágása, a tanítóból 300 kép validációnak (stratify, random_state=0).",
      "   Kódolás: pixelenként egy betű, 'a' = 0 … 'q' = 16, soronként 64 pixel; címkék: számjegysor. Generálta: _parts/calc/c109_data.py */",
      "window.DIGITS10 = {"]
for k, (A, t) in parts.items():
    js.append(f'  {k}: {{ n: {len(t)}, X: "{enc(A)}", y: "{"".join(map(str, t))}" }},')
js.append("};")
open("mesterseges-intelligencia/10-halo-tanitasa/digits-data.js", "w").write("\n".join(js) + "\n")
print({k: len(v[1]) for k, v in parts.items()}, np.bincount(yv))
