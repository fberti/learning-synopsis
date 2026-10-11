import sys, json, math, numpy as np, torch
sys.argv = [sys.argv[0], sys.argv[1], sys.argv[2]]
calc, outp = sys.argv[1], sys.argv[2]
src = open(calc + "/c12_models.py").read().split("res = {}")[0]
exec(src.replace("sys.path.insert(0, sys.argv[1]); ", "sys.path.insert(0, calc); "))
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
tr, va, te = make(0)
txt = lambda D: [" ".join(t) for t, _, _ in D]
R = lambda a, d=4: np.round(np.asarray(a, dtype=float), d).tolist()
out = {"vocab": VOCAB, "maxLen": L}
for name, ng in [("bow1", (1, 1)), ("bow2", (1, 2))]:
    cv = CountVectorizer(token_pattern=r"[^ ]+", ngram_range=ng); Xtr = cv.fit_transform(txt(tr))
    lr = LogisticRegression(max_iter=2000, C=10).fit(Xtr, [d[1] for d in tr])
    feats = cv.get_feature_names_out().tolist()
    out[name] = {"feats": feats, "w": R(lr.coef_[0]), "b": round(float(lr.intercept_[0]), 4)}
    p = lr.predict(cv.transform(txt(te))); out[name]["acc"] = evaluate(p, te)
E = list(map(enc, (tr, va, te)))
mods = {"avg": Avg(), "rnn": RNN(), "tf_nopos": TF(pos=False), "tf": TF()}
for k, m in mods.items():
    m.load_state_dict(torch.load(f"{calc}/../ch12/m_{k}.pt")); m.eval()
    out[k] = {n: R(v.detach().numpy(), 5) for n, v in m.state_dict().items()}
    with torch.no_grad(): p = (m(E[2][0], E[2][1]) > 0).int().numpy()
    out[k]["acc"] = evaluate(p, te)
    out[k]["nparams"] = sum(v.numel() for v in m.parameters())
    print(k, out[k]["nparams"], {a: round(float(b), 4) for a, b in out[k]["acc"].items()})
for k in ("bow1", "bow2"): out[k]["acc"] = {a: round(float(b), 4) for a, b in out[k]["acc"].items()}; out[k]["nparams"] = len(out[k]["w"]) + 1; print(k, out[k]["nparams"], out[k]["acc"])
for k in mods: out[k]["acc"] = {a: round(float(b), 4) for a, b in out[k]["acc"].items()}
# referencia: néhány mondat logitja minden modellre (a JS-ellenőrzéshez)
refs = ["a film jó volt , de a vége unalmas volt", "a film unalmas volt , de a vége jó volt", "a zene nem volt túl rossz", "a zene nem volt jó",
        "a látvány nagyon szép volt , és a rendezés eredeti volt", "a történet nem volt igazán izgalmas , de a vége remek volt"]
ref = {"sent": refs}
for k, m in mods.items():
    X, M, _ = enc([(s.split(), 0, "x") for s in refs])
    with torch.no_grad():
        if k.startswith("tf"):
            o, A = m(X, M, ret=True); ref[k] = R(o.numpy()); ref[k + "_att0"] = R(A[0, :, :len(refs[0].split()), :len(refs[0].split())].numpy(), 4)
        else: ref[k] = R(m(X, M).numpy())
for k in ("bow1", "bow2"):
    cv = CountVectorizer(token_pattern=r"[^ ]+", ngram_range=(1, 1) if k == "bow1" else (1, 2)); cv.fit(txt(tr))
    w = dict(zip(out[k]["feats"], out[k]["w"])); ref[k] = [round(sum(w.get(f, 0) * c for f, c in zip(cv.get_feature_names_out(), cv.transform([s]).toarray()[0])) + out[k]["b"], 4) for s in refs]
out["ref"] = ref
print(json.dumps(ref)[:1500])
open(outp, "w").write("/* 12. fejezet – a filmkritika-kísérlet modelljei (seed 0), generálta: _parts/calc/c12_export_models.py */\nwindow.REVIEW12 = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
