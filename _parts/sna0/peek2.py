import sys, glob, os, rdata, numpy as np, pandas as pd
d = sys.argv[1]
for p in sorted(glob.glob(os.path.join(d, "*.rda"))):
    if os.path.basename(p).startswith(("ASNR_", "MAT_")): continue
    conv = rdata.read_rda(p)
    for name, obj in conv.items():
        if not isinstance(obj, dict):
            print(f"{name}: NOT A LIST -> {type(obj).__name__} {getattr(obj,'shape',None)}"); continue
        keys = list(obj.keys())
        nets = [k for k in keys if k not in ("ProjectInfo","Attributes","NetworkInfo")]
        att = obj.get("Attributes")
        ainfo = None if att is None else (att.shape if hasattr(att,'shape') else {k: getattr(v,'shape',None) for k,v in att.items()})
        ni = obj.get("NetworkInfo")
        print(f"{name}: keys={keys}")
        print("   attrs:", ainfo, "| NI cols:", (None if ni is None else list(ni.columns)))
        for k in nets:
            v = obj[k]
            a = np.asarray(v, dtype=float)
            print(f"   {k}: shape={a.shape} vals={sorted(set(np.unique(a[~np.isnan(a)]).tolist()))[:8]} nan={int(np.isnan(a).sum())} sym={a.shape[0]==a.shape[1] and np.allclose(np.nan_to_num(a),np.nan_to_num(a.T))}")
