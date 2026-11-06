"""sna_utils – a kurzus saját segédmodulja.

Az xUCINET-függvények Python-megfelelői kerülnek ide, leckéről leckére.
0. lecke: adatprojekt betöltése, mátrix-ellenőrzés, átalakítás networkx-gráffá.
"""
from dataclasses import dataclass
from pathlib import Path
import json
import warnings

import networkx as nx
import numpy as np
import pandas as pd

ASNR = Path(__file__).resolve().parent.parent / "data" / "asnr"
SPECIAL = {"attributes.csv", "networkinfo.csv"}


@dataclass
class DataProject:
    """Az xUCINET adatprojektjének Python-párja: hálók + attribútumok + metaadat."""
    name: str
    networks: dict          # hálónév -> pandas DataFrame (mátrix, címkékkel)
    attributes: object      # pandas DataFrame vagy None
    network_info: object    # pandas DataFrame vagy None
    info: dict              # leírás, kódolás, hivatkozások

    def __repr__(self):
        nets = ", ".join(f"{k} {v.shape[0]}×{v.shape[1]}" for k, v in self.networks.items())
        att = "nincs" if self.attributes is None else f"{self.attributes.shape[1]} oszlop"
        return f"<DataProject {self.name}: {nets}; attribútumok: {att}>"


def load_project(name, root=ASNR):
    """Egy exportált ASNR-adatkészlet betöltése (lásd scripts/asnr_export.py)."""
    folder = Path(root) / name
    if not folder.is_dir():
        raise FileNotFoundError(f"Nincs ilyen adatkészlet: {folder}")
    nets = {p.stem: pd.read_csv(p, index_col=0)
            for p in sorted(folder.glob("*.csv")) if p.name not in SPECIAL}

    def opt(fname):
        p = folder / fname
        return pd.read_csv(p, index_col=0) if p.exists() else None

    info_path = folder / "info.json"
    info = json.loads(info_path.read_text(encoding="utf-8")) if info_path.exists() else {}
    return DataProject(name, nets, opt("attributes.csv"), opt("networkinfo.csv"), info)


def check_matrix(df):
    """Gyors épségellenőrzés betöltés után – mindig nézd meg, mielőtt számolsz!"""
    A = df.to_numpy(dtype=float)
    report = {
        "méret": A.shape,
        "értékek": sorted(np.unique(A[~np.isnan(A)]).tolist()),
        "hiányzó (NaN)": int(np.isnan(A).sum()),
    }
    if A.shape[0] == A.shape[1]:
        report["azonos címkék"] = list(df.index) == list(df.columns)
        report["szimmetrikus"] = bool(np.array_equal(A, A.T, equal_nan=True))
        report["átló összege"] = float(np.nansum(np.diag(A)))
    return report


def to_networkx(df, directed=None):
    """Szomszédsági mátrix (DataFrame) -> networkx-gráf.

    A nem nulla cellák lesznek az élek, a cella értéke a 'weight'.
    Az izolált csúcsok is bekerülnek (a csúcsokat külön adjuk hozzá!).
    """
    A = df.to_numpy(dtype=float)
    if A.shape[0] != A.shape[1]:
        raise ValueError(f"A mátrix {A.shape[0]}×{A.shape[1]}-es: kétmódú adat, "
                         "ehhez kétrészes gráf vagy vetítés kell (13. lecke).")
    if np.isnan(A).any():
        raise ValueError("A mátrixban hiányzó érték van – előbb döntsd el, mit kezdesz vele.")
    symmetric = np.array_equal(A, A.T)
    if directed is None:
        directed = not symmetric
    if not directed and not symmetric:
        warnings.warn("A mátrix nem szimmetrikus, de irányítatlan gráfot kértél: "
                      "páronként a nagyobb értéket veszem (max-szimmetrizálás).")
        A = np.maximum(A, A.T)
    G = nx.DiGraph() if directed else nx.Graph()
    G.add_nodes_from(df.index)
    for i, j in zip(*np.nonzero(A)):
        if directed or i < j:
            G.add_edge(df.index[i], df.columns[j], weight=A[i, j])
    return G
