"""Az ASNR (xUCINET 0.0.2) összes adatkészletének exportja CSV-be – R nélkül.

Használat (a projekt gyökeréből):
    uv run python scripts/asnr_export.py data/raw/xUCINET_0.0.2.0020.tar.gz

Eredmény: data/asnr/<Projekt>/ mappánként
    <Háló>.csv        szomszédsági (vagy kétmódú) mátrix, első oszlop = sorcímkék
    attributes.csv    csúcsattribútumok (ha vannak)
    networkinfo.csv   a hálók metaadatai (irányított? értékek? módok?)
    info.json         leírás, kódolás, hivatkozások (ProjectInfo)
"""
import json
import sys
import tarfile
from pathlib import Path

import numpy as np
import pandas as pd
import rdata

OUT = Path("data/asnr")


def to_frame(x):
    """R-mátrix (xarray.DataArray) vagy data.frame -> pandas DataFrame, címkékkel."""
    if isinstance(x, pd.DataFrame):
        return x
    labels = [x.coords[d].values if d in x.coords else np.arange(n) + 1
              for d, n in zip(x.dims, x.shape)]
    return pd.DataFrame(np.asarray(x), index=[str(v) for v in labels[0]],
                        columns=[str(v) for v in labels[1]])


def plain(x):
    """ProjectInfo -> JSON-ba írható szerkezet."""
    if x is None:
        return None
    if isinstance(x, dict):
        return {str(k): plain(v) for k, v in x.items()}
    if isinstance(x, pd.DataFrame):
        return x.astype(str).to_dict(orient="records")
    return [str(v) for v in np.atleast_1d(x)]


def export(name, obj):
    folder = OUT / name
    folder.mkdir(parents=True, exist_ok=True)
    if not isinstance(obj, dict):                 # ábraadat vagy sima táblázat
        to_frame(obj).to_csv(folder / f"{name}.csv")
        return
    for part, x in obj.items():
        part = str(part)
        if part == "ProjectInfo":
            text = json.dumps(plain(x), ensure_ascii=False, indent=2)
            (folder / "info.json").write_text(text, encoding="utf-8")
        elif x is None:
            continue
        elif part == "Attributes":
            to_frame(x).to_csv(folder / "attributes.csv")
        elif part == "NetworkInfo":
            to_frame(x).to_csv(folder / "networkinfo.csv")
        else:
            to_frame(x).to_csv(folder / f"{part}.csv")


def main(tarball):
    n = 0
    with tarfile.open(tarball) as tf:             # a csomagot ki sem kell csomagolni
        for m in tf.getmembers():
            if m.isfile() and "/data/" in m.name and m.name.endswith(".rda"):
                parsed = rdata.parser.parse_data(tf.extractfile(m).read())
                for name, obj in rdata.conversion.convert(parsed).items():
                    export(str(name), obj)
                    n += 1
    print(f"Kész: {n} adatkészlet -> {OUT}/")


if __name__ == "__main__":
    main(sys.argv[1])
