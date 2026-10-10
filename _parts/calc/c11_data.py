# cnn-nets.js: a 11. fejezet hálói (seed 0) + a 450 tesztkép
import json, numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
d = load_digits(); X = d.data.astype(int); y = d.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
N = json.load(open("_parts/ch11/nets_s0.json"))
def r4(a): return np.round(np.asarray(a, dtype=float), 4).tolist()
out = {"test": {"n": len(yte), "X": "".join(chr(97 + v) for v in Xte.ravel()), "y": "".join(map(str, yte))}, "nets": {}}
m = N["mlp"]
out["nets"]["mlp"] = {"kind": "mlp", "W1": r4(m["l1.weight"]), "b1": r4(m["l1.bias"]), "W2": r4(m["l2.weight"]), "b2": r4(m["l2.bias"]), "grid": m["grid"]}
for k, pool in [("cnnA", False), ("cnnB", True), ("cnnBaug", True)]:
    c = N[k]
    out["nets"][k] = {"kind": "cnn", "pool": pool,
        "k1": r4(np.array(c["c1.weight"]).reshape(8, 9)), "b1": r4(c["c1.bias"]),
        "k2": r4(np.array(c["c2.weight"]).reshape(32, 8, 9)), "b2": r4(c["c2.bias"]),
        "W": r4(c["fc.weight"]), "b": r4(c["fc.bias"]), "grid": c["grid"]}
js = ["/* 11. fejezet – előre tanított hálók a 16×16-os lapra tett 8×8-as számjegyekhez (PyTorch, Adam 0,01, 60 epoch, korai leállítás; generálta: _parts/calc/c11_export.py, c11_data.py).",
      "   mlp: 256–16–10 (ReLU). cnnA: conv 3×3 (8) – ReLU – conv 3×3 (32) – ReLU – globális max – FC 10 (padding 1).",
      "   cnnB: ugyanez, az első konvolúció után 2×2-es max-poolinggal; cnnBaug: cnnB, véletlen ±2 pixeles eltolással tanítva.",
      "   k1: 8×9 (szűrő × 3×3, soronként), k2: 32×8×9, W: 10×32. grid: helyes válaszok száma a 450 tesztképből eltolásonként, grid[dy+4][dx+4] (dx > 0 jobbra, dy > 0 lefelé).",
      "   test: a 9. fejezet 450 tesztképe (8×8, pixelenként egy betű: 'a' = 0 … 'q' = 16) és a címkék. */",
      "window.CNN11 = " + json.dumps(out, separators=(",", ":")) + ";"]
open("mesterseges-intelligencia/11-konvolucios-halok/cnn-nets.js", "w").write("\n".join(js) + "\n")
print("ok", len("\n".join(js)))
