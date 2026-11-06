import json, numpy as np, pandas as pd
from pathlib import Path
from sna_utils import load_project, check_matrix, ASNR
rows = []
for d in sorted(ASNR.iterdir()):
    if d.name.startswith(("ASNR_Fig", "MAT_")): continue
    p = load_project(d.name)
    ni = p.network_info
    for k, M in p.networks.items():
        r = check_matrix(M)
        dirc = vals = mode = None
        if ni is not None:
            col = "Name" if "Name" in ni.columns else "NetworkName"
            m = ni[ni[col] == k]
            if len(m): dirc = m["Directed"].iloc[0]; vals = m["Values"].iloc[0]; mode = m.get("Mode", m.get("ModeSender")).iloc[0]
        rows.append((d.name, k, M.shape, dirc, vals, mode, r.get("szimmetrikus"), r["értékek"][:6], r["hiányzó (NaN)"], None if p.attributes is None else p.attributes.shape))
for r in rows: print(r)
for n in ["Mainas_Terro", "Borgatti_Scientists960", "Borgatti_Scientists504"]:
    p = load_project(n); M = next(iter(p.networks.values()))
    print(n, M.shape, p.attributes.shape, "átfedés:", len(set(M.index.astype(str)) & set(p.attributes.index.astype(str))))
