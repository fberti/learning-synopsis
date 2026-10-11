# 12. fejezet – közös widget-útmutató (minden widget-ágensnek)

Hely: `mesterseges-intelligencia/12-beagyazasok-figyelem/` (fejezetmappa). Adatfájlok már megvannak:
- `glove-data.js` → `window.GLOVE12` = { words[182] (angol), hu[182] (magyar fordítás), vec[182][50], xy[182][2] (PCA, 13% + 10% variancia),
  global: { "king-man+woman": {excl:[[szó,cos]…5], incl:[…5]}, … }, nn: {...}, src }
- `real-attention.js` → `window.REAL12` = { levelSent[6], levelCos[13 réteg][6][6], hubert: {mondat: {tokens, att[12 réteg][12 fej][n][n]}},
  mt: {mondat: {src[], tgt[], translation, avg[6 réteg][tgt][src], heads: {"2": [8 fej][tgt][src], "3": …}}}, src: {hubert, mt} }
- `review-models.js` → `window.REVIEW12` (lásd a review-lab specifikációját).

A végleges `widgets.js` így áll össze: `_parts/ch12/w0.js` (közös segédek, NE módosítsd) + `w1.js` + `w2.js` + `w3.js` + `w9.js` (indítás).
A te fájlod (`_parts/ch12/wN.js`) csak `W["név"] = root => { … };` definíciókat és saját, `wN`-előtagú segédeket tartalmazhat
(pl. `const w2Heat = …`), hogy ne ütközzön a többiekével. A w0.js-ben elérhető: `css, fmt (Calc.fmt, magyar tizedesvessző), pct, h, btn,
slider, checkbox, math, small, setDis, header, twoCanvas, evXY, polyline, dot, ring, label, arrow, toggleGroup, rgba, hexRGB, flatAspect,
clamp, par, eqView, C1, C0, decisionMap, lineFrom, sub, softmax, argmax, dotp, norm, cosine, mix(colVar, t), ink(t), W`. Olvasd el a
`_parts/ch12/w0.js`-t, és nézz meg 1–2 widgetet a `mesterseges-intelligencia/11-konvolucios-halok/widgets.js`-ből stílusmintának
(header(), .controls, .readout, .stat-row, Calc.canvas(parent, aspect, maxW), Calc.plot(cv, view, layers)). Az `assets/calc.js` elején
le van írva a Calc API.

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)` (tizedesvessző, ezres szóköz). Mínusz jel: fmt adja.
- Színek csak CSS-változókból: --accent, --setA (kék), --setB (narancs), --setC (zöld), --bad, --muted, --text, --card, --border, --bg-soft,
  --accent-soft. Világos és sötét téma is legyen olvasható (`document.documentElement.setAttribute('data-theme','dark')`).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`).
- Ahol előre kiszámolt valódi modelladatot mutatsz, egy kis megjegyzés mondja meg a forrást (REAL12.src / GLOVE12.src).
- Ne használj külső könyvtárat. KaTeX a widgetben: a `math(root)` hívás a w9-ben megtörténik betöltéskor; ha később írsz be
  $…$-t, hívd meg `math(elem)`-et.
- Teszt: készíts saját tesztoldalt `_parts/ch12/wtestN.html` (a `_parts/ch10/wtest.html` mintájára: style.css, KaTeX, common.js, calc.js,
  a három adatfájl a fejezetmappából, és `wtestN-widgets.js` = `cat w0.js wN.js w9.js`). Indíts helyi szervert a synopsis gyökérben
  (`python3 -m http.server <szabad port>`), és ellenőrizd headless Playwrighttal (`uv run --with playwright python -I script.py`;
  szükség esetén `uv run --with playwright python -m playwright install chromium`): nincs konzolhiba, a widgetek kirajzolnak,
  az interakciók működnek (kattints, húzz, válts). Képernyőképek világos és sötét témában, 1280 és 380 px szélességben:
  `_parts/ch12/shotsN/`. Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Minden számot, amit a widget a tananyag szövegével egyezően mutat (alább megadva), ellenőrizz a böngészőben/node-dal.
- Munkát csak a `_parts/ch12/` mappában végezz (és a saját tesztszkriptjeid a `_parts/calc/`-ban, `w12N_` előtaggal). /tmp-t ne használj.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok.

Szakaszhorgonyok a fejezetben (ha linkelsz): 12.1 #s121 (a: tokenek, b: szózsák, c: TF-IDF), 12.2 #s122 (a: one-hot, b: sűrű vektorok
és koszinusz, c: disztribúciós hipotézis, word2vec), 12.3 #s123 (a: sorrend, b: RNN, c: hosszú távú függés, LSTM), 12.4 #s124
(a: szűk keresztmetszet, b: puha keresés, c: figyelem a fordításban), 12.5 #s125 (a: Q, K, V kézzel, b: mátrixalak és √d, c: több fej,
pozíciókódolás), 12.6 #s126 (a: a blokk, b: maszkolt figyelem, c: BERT vs GPT), 12.7 #s127, 12.8 #s128 (alkalmazás). Alhorgonyok:
#s121-a, #s121-b, … #s128-c.
