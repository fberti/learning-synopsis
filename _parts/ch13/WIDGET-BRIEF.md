# 13. fejezet (Gráf neurális hálók) – közös widget-útmutató (minden widget-ágensnek)

Fejezetmappa: `mesterseges-intelligencia/13-graf-neuralis-halok/` (a synopsis gyökeréből). Adatfájl már van:
- `graph-data.js` → `window.KARATE13 = { n: 34, edges: [[u,v]…78 db, 0-tól számozva], club: [0/1 ×34] (0 = Mr. Hi, az edző csoportja; 1 = Officer, az elnök csoportja), xy: [[x,y]…] (0–1 közé normált Kamada–Kawai-elrendezés), src }`.
  A felületen a csúcsokat **1-től** számozd (Zachary számozása): 0 → „1” (az edző, Mr. Hi), 33 → „34” (az elnök, John A.).
- Később (4. ágens): `cora-data.js` (`CORA13`), `mutag-data.js` (`MUTAG13`) – leírás a saját specifikációban.

A végleges `widgets.js` így áll össze: `_parts/ch13/w0.js` (közös segédek, NE módosítsd) + `w1.js` + `w2.js` + `w3.js` + `w4.js` + `w9.js` (indítás).
A te fájlod (`_parts/ch13/wN.js`) csak `W["név"] = root => { … };` definíciókat és saját, `wN`-előtagú segédeket tartalmazhat
(pl. `const w2Draw = …`), hogy ne ütközzön a többiekével. A w0.js-ben elérhető: `css, fmt (Calc.fmt, magyar tizedesvessző), pct, h, btn,
slider, checkbox, math, small, setDis, header, twoCanvas, evXY, polyline, dot, ring, label, arrow, toggleGroup, rgba, hexRGB, flatAspect,
clamp, par, eqView, C1, C0, decisionMap, lineFrom, sub, softmax, argmax, dotp, norm, cosine, mix(colVar, t), ink(t), W`. Olvasd el a
`_parts/ch13/w0.js`-t, és nézz meg 1–2 widgetet a `mesterseges-intelligencia/12-beagyazasok-figyelem/widgets.js`-ből stílusmintának
(header(), .controls, .readout, .stat-row, Calc.canvas(parent, aspect, maxW), Calc.plot(cv, view, layers)). Az `assets/calc.js` elején
le van írva a Calc API. Gráfrajzoláshoz nincs közös segéd: írj egy sajátot (`wN`-előtaggal) a canvasra (élek vonallal, csúcsok
körrel, felirattal); a koordinátákat a canvas méretéhez skálázd, és figyelj a nagy DPI-re (a Calc.canvas ezt intézi).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)` (tizedesvessző). Mínusz jel: fmt adja.
- Színek csak CSS-változókból: --accent, --setA (kék), --setB (narancs), --setC (zöld), --bad, --muted, --text, --card, --border, --bg-soft,
  --accent-soft. Világos és sötét téma is legyen olvasható (`document.documentElement.setAttribute('data-theme','dark')`).
  Csúcsérték → szín: `mix("--accent", t)` vagy kétszínű skála; a csúcs feliratának színe `ink(t)`.
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`). Érintéssel is
  működjön a kattintás (pointer események).
- Ne használj külső könyvtárat. KaTeX a widgetben: a `math(root)` hívás a w9-ben megtörténik betöltéskor; ha később írsz be
  $…$-t, hívd meg `math(elem)`-et.
- Determinisztikus véletlen: saját, magolt RNG (pl. mulberry32), hogy ugyanaz a gomb mindig ugyanazt adja.
- Teszt: készíts saját tesztoldalt `_parts/ch13/wtestN.html` (a `_parts/ch12/wtest1.html` mintájára: style.css, KaTeX, common.js, calc.js,
  a fejezetmappa adatfájljai (`../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` stb.), és `wtestN-widgets.js` = `cat w0.js wN.js w9.js`).
  Indíts helyi szervert a synopsis gyökérben (`python3 -m http.server <szabad port, pl. 87N1>`), és ellenőrizd headless Playwrighttal
  (`uv run --with playwright python -I script.py`; ha kell: `uv run --with playwright python -m playwright install chromium`): nincs konzolhiba,
  a widgetek kirajzolnak, az interakciók működnek (kattints, húzz, válts). Képernyőképek világos és sötét témában, 1280 és 380 px szélességben:
  `_parts/ch13/shotsN/`. Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Minden számot, amit a widget a tananyag szövegével egyezően mutat (alább megadva), ellenőrizz a böngészőben/node-dal.
- Munkát csak a `_parts/ch13/` mappában végezz (a saját tesztszkriptjeid a `_parts/calc/`-ban, `w13N_` előtaggal). /tmp-t ne használj.
  A szervert a végén állítsd le.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok.

## A fejezet futó példája (minden widgetben ugyanígy)
Öt barát: **A**nna, **B**ence, **C**silla, **D**ávid, **E**mese (a csúcsok jele A–E). Élek: A–B, A–C, B–C, B–D, D–E.
Fokszámok: A 2, B 3, C 2, D 2, E 1. Kezdeti (skalár) jellemző: $x = (1;\ 0;\ 0;\ 0;\ 5)$ (A = 1, E = 5, a többi 0).
Ajánlott elrendezés: A bal fent, C bal lent, B középen (a háromszög A–B–C), D jobbra B mellett, E jobbra D mellett (lánc B–D–E).

## Szakaszhorgonyok (ha linkelsz)
13.1 #s131 (a: csúcsok és élek, b: ábrázolás, c: feladattípusok) · 13.2 #s132 (a: a számozás csapdája, b: invariancia és ekvivariancia,
c: régi megoldások) · 13.3 #s133 (a: egy lépés kézzel, b: k réteg = k ugrás, c: mátrixalak) · 13.4 #s134 (a: önhurok, b: normalizálás,
c: félig felügyelt tanulás) · 13.5 #s135 (a: GraphSAGE, b: GAT, c: GIN) · 13.6 #s136 (a: kiolvasás, b: kapcsolat-előrejelzés,
c: tanítás és szivárgás) · 13.7 #s137 (a: WL-teszt, b: túlsimítás, c: túlnyomás, heterofília) · 13.8 #s138 · 13.9 #s139 · 13.10 #s1310 ·
13.11 #s1311 (a: Cora, b: MUTAG, c: válaszok).
