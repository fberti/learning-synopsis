import re, os, sys
base = os.path.abspath("../../grafelmelet-halozattudomany/07-halozatmodellek")
s = open(os.path.join(base, "index.html"), encoding="utf-8").read()
bad = []
for href in re.findall(r'href="([^"#][^"]*?)(?:#([^"]*))?"', s):
    pass
for m in re.finditer(r'href="([^"]+)"', s):
    h = m.group(1)
    if h.startswith(("http", "#", "mailto")): continue
    path, _, anc = h.partition("#")
    p = os.path.normpath(os.path.join(base, path))
    if os.path.isdir(p): p = os.path.join(p, "index.html")
    if not os.path.exists(p): bad.append((h, "missing file")); continue
    if anc:
        t = open(p, encoding="utf-8").read()
        if f'id="{anc}"' not in t: bad.append((h, "missing anchor"))
print("bad links:", bad)
