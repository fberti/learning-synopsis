#!/bin/bash
# A Hálózatelemzés 0. fejezetének összefűzése a részekből.
set -e
cd "$(dirname "$0")"
OUT=../../halozatelemzes/00-munkakornyezet/index.html
python3 - "$OUT" <<'PY'
import sys
parts = ["00-head", "01-s01", "02-s02", "03-s03", "04-s04", "05-s05", "06-s06", "07-s07", "08-end"]
html = "".join(open(f"html/{p}.html", encoding="utf-8").read() for p in parts)
rows = open("table_rows.html", encoding="utf-8").read().rstrip("\n")
assert "<!--TABLE-->" in html
html = html.replace("<!--TABLE-->", rows)
open(sys.argv[1], "w", encoding="utf-8").write(html)
print("ok", len(html.splitlines()), "sor")
PY
