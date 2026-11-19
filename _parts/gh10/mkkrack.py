from common import *
A,att=krack()
rows=lambda M:["".join(str(int(x)) for x in r) for r in M]
d={"n":21,"advice":rows(A["advice"]),"friendship":rows(A["friendship"]),"reports":rows(A["reports"]),
 "age":[int(x) for x in att["AGE"]],"tenure":[float(x) for x in att["TENURE"]],"level":[int(x) for x in att["LEVEL"]],"dept":[int(x) for x in att["DEPT"]]}
s="""/* =========================================================
   Krackhardt (1987) „high-tech menedzserei”: 21 vezető egy szilíciumvölgyi cégnél.
   Három irányított hálózat (a[i][j] = 1: i → j): advice = i tanácsot kér j-től, friendship = i barátjának tartja j-t,
   reports = i j-nek jelent (j az i főnöke). Attribútumok: életkor, a cégnél töltött évek, szint (1 = elnök, 2 = alelnök, 3 = vezető), részleg (0 = az elnök).
   Forrás: D. Krackhardt (1987) Cognitive social structures, Social Networks 9, 109–134; a NetData R-csomag (kracknets) átvétele.
   (Generálta: _parts/gh10/mkkrack.py)
   ========================================================= */
window.KRACK = """+json.dumps(d,ensure_ascii=False)+";\n"
open(BASE+"grafelmelet-halozattudomany/10-halozatok-osszehasonlitasa/krack-data.js","w",encoding="utf-8").write(s)
print(len(s))
