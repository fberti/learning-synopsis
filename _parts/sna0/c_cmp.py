import sys, pathlib, numpy as np, pandas as pd
R = pathlib.Path(sys.argv[1]); P = pathlib.Path(sys.argv[2])
bad = 0; n = 0
for rd in sorted(R.iterdir()):
    pd_ = P / rd.name
    for f in rd.glob("*.csv"):
        name = {"Attributes.csv": "attributes.csv", "NetworkInfo.csv": "networkinfo.csv"}.get(f.name, f.name)
        g = pd_ / name
        if not g.exists(): print("hiányzik:", g); bad += 1; continue
        a = pd.read_csv(f, index_col=0); b = pd.read_csv(g, index_col=0); n += 1
        if a.shape != b.shape: print("alak", f, a.shape, b.shape); bad += 1; continue
        if name in ("attributes.csv", "networkinfo.csv"):
            ok = (a.astype(str).values == b.astype(str).values).all() or np.allclose(a.select_dtypes('number'), b.select_dtypes('number'), equal_nan=True)
        else:
            ok = np.allclose(a.to_numpy(float), b.to_numpy(float), equal_nan=True) and list(map(str,a.index)) == list(map(str,b.index)) and list(a.columns) == list(b.columns)
        if not ok: print("eltér:", f); bad += 1
print("összevetve:", n, "fájl; eltérés:", bad)
