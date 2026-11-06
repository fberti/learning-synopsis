"""A Python- és az R-export összevetése cellánként.

Használat:  uv run python scripts/compare_exports.py data/asnr_r data/asnr
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd

RENAME = {"Attributes.csv": "attributes.csv", "NetworkInfo.csv": "networkinfo.csv"}
r_root, py_root = Path(sys.argv[1]), Path(sys.argv[2])
n = bad = 0
for r_dir in sorted(p for p in r_root.iterdir() if p.is_dir()):
    for f in sorted(r_dir.glob("*.csv")):
        if f.name in RENAME:            # a metaadatot itt nem vetjük össze
            continue
        g = py_root / r_dir.name / f.name
        a, b = pd.read_csv(f, index_col=0), pd.read_csv(g, index_col=0)
        same = (a.shape == b.shape
                and list(map(str, a.index)) == list(map(str, b.index))
                and list(a.columns) == list(b.columns)
                and np.allclose(a.to_numpy(float), b.to_numpy(float), equal_nan=True))
        n += 1
        if not same:
            bad += 1
            print("ELTÉR:", g)
print(f"{n} mátrix összevetve, {bad} eltérés.")
