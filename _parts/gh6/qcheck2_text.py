# a 6.4–6.6 szöveg néhány előjeles / irányított példájának ellenőrzése (a kvízhez nem kell, csak a szöveghibák kereséséhez)
# uv run -q --with networkx --with numpy --with scipy python -I qcheck2_text.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import contextlib, io
with contextlib.redirect_stdout(io.StringIO()):
    from qcheck2_calc import sgraph, balanced, camps, frustration, triangles, weakly_balanced
for name, spec in [
    ("6.4 bejárás példa", "AB+ BC- CD+ DA- AE+ EC-"),
    ("6.4 gyak. négyszög +-+-", "AB+ BC- CD+ DA-"),
    ("6.4 gyak. négyszög +++-", "AB+ BC+ CD+ DA-"),
    ("6.4 5-kör egy mínusszal", "AB+ BC+ CD+ DE+ EA-"),
    ("6.4 E mindenki ellen", "AB+ AC+ AD+ BC+ BD+ CD+ AE- BE- CE- DE-"),
    ("6.4 A barátai B,C, ell. D, BD+ (CD-, BC+)", "AB+ AC+ AD- BD+ BC+ CD-"),
    ("vegyes 10", "AB+ BC+ CD- DA- AC-"),
    ("vegyes 10 javítva", "AB+ BC+ CD- DA- AC+"),
]:
    S = sgraph(spec)
    print(name, "| kiegy.:", balanced(S), "| táborok:", camps(S), "| frusztráció:", frustration(S)[0], "| gyenge:", weakly_balanced(S)[0])

# 6.5 tipp: a 12 cikk hivatkozási gráfjában nincs zárt hármas
import networkx as nx
cit = [[3, 2], [4, 1], [5, 2], [5, 4], [6, 5], [8, 7], [9, 5], [9, 8], [10, 1], [11, 7], [11, 10], [12, 8]]
print("hivatkozási gráf háromszögei:", sum(nx.triangles(nx.Graph([tuple(c) for c in cit])).values()) // 3)
