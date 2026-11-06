# sna-kurzus – a Hálózatelemzés kurzus futó projektje

Kiinduló állapot a 0. lecke végén (lásd a Synopsis oldalon: Hálózatelemzés › 0. Munkakörnyezet és adatok).

```bash
uv sync                                    # környezet a uv.lock alapján
# a könyv adatcsomagja (xUCINET 0.0.2.0020) kézzel letöltve: data/raw/
uv run python scripts/asnr_export.py data/raw/xUCINET_0.0.2.0020.tar.gz
uv run pytest                              # a könyv számai mint tesztek
uv run marimo edit leckek/00_munkakornyezet.py
```

Mappák: `sna_utils/` (saját segédmodul), `scripts/` (export, összevetés), `tests/`, `leckek/` (marimo-jegyzetfüzetek),
`data/` (nem kerül gitbe).
