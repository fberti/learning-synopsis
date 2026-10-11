import sys, torch, numpy as np
calc = sys.argv[1]
exec(open(calc + "/c12_models.py").read().split("res = {}")[0].replace("sys.path.insert(0, sys.argv[1]); ", "sys.path.insert(0, calc); "))
m = TF(); m.load_state_dict(torch.load(f"{calc}/../ch12/m_tf.pt")); m.eval()
for s in ["a film jó volt , de a vége unalmas volt", "a film unalmas volt , de a vége jó volt", "a zene nem volt túl rossz", "a zene rossz volt , és a vége unalmas volt"]:
    X, M, _ = enc([(s.split(), 0, "x")]); t = s.split()
    with torch.no_grad(): o, A = m(X, M, ret=True)
    A = A[0, :, :len(t), :len(t)].numpy()
    print(s, round(float(torch.sigmoid(o)[0]), 3))
    for h in range(2):
        col = A[h].sum(0); print("  head", h + 1, "legtöbb figyelmet kapja:", [(t[j], round(float(col[j]), 2)) for j in np.argsort(-col)[:3]])
