# Gráfelmélet 4. fejezet – widgetírási útmutató

Synopsis tananyag (statikus oldal, vanilla JS, nincs build-lépés, nincs külső könyvtár). A fejezet: **Gráfok és mátrixok: véletlen séta,
sajátvektorok, Laplace-mátrix** (4.1 $A\mathbf x$ mint szomszédösszegzés · 4.2 véletlen séta, $P = D^{-1}A$, $\pi_i = d_i/2m$ · 4.3 hatványiteráció,
sajátvektor · 4.4 Laplace-mátrix $L = D - A$, $\mathbf x^\top L\mathbf x = \sum_{ij \in E}(x_i - x_j)^2$, 0 sajátérték multiplicitása = komponensek száma ·
4.5 spektrális kettévágás, Fiedler-vektor · 4.6 alkalmazás az Árvízhétre).

Olvasd el:
- `assets/graph.js` – a közös `GraphKit` (GK): `View` (canvas: nodes `{label,x,y,color,badge,sub}` [0;1]-es koordinátákkal, edges `{a,b,w}`; opciók `aspect, radius, editable, showWeights, weightWidth, draggable, directed, onNodeClick(i), onEdgeClick(i), onChange, onDraw(ctx,view)`; élenként `color, width, dash, label, dir, alpha`; mezők `hl`, `hlE` (Set `GK.edgeKey(a,b)`), `dim`, `sel`; metódusok `setGraph, draw, layout(seed), animateTo, edgeList`), `GK.css`, `normalize`, `adjList`.
  A `View`-t visszafelé kompatibilisen bővítheted, de az 1–3. fejezet widgetjei (`grafelmelet-halozattudomany/0[123]-*/widgets.js`) nem romolhatnak el.
- `_parts/gh4/w0.js` – a fejezet közös segédfüggvényei: `h, btn, header, toggleGroup, math, fmt, actorName, preset(név, aspect)` (mintagráfok: `path4, barat, paw, star, twoTri, arviz` [súlyozott], `papers` [irányított, súlyozott], `karate` [`club` mező: 0/1]),
  `adjM(n, edges, {weighted, directed})`, `rowSums, matVec, vecMat, lapM, transM, eigSym(M)` (növekvő `vals`, `vecs[k]`), `fiedler(n, edges, weighted)` → `{lambda2, vec, vals}`, `divColor(x, max)` (kék–szürke–narancs), `mixColor`. **Ne módosítsd**; használd.
- Mintának: `_parts/gh3/w1.js`, `_parts/gh3/w2.js` (stílus, felépítés, szöveg).

Feladatod: a `_parts/gh4/w2.js` fájlban három widget, `W["név"] = root => {…}` alakban (a fájl a w0.js IIFE-jének közepére fűződik, saját IIFE nélkül; a saját segédfüggvényeidet tedd egy `{ … }` blokkba, hogy ne ütközzenek a w1.js neveivel):

1. **`random-surfer`** (4.2 végén / 4.6): egy „olvasó” (pötty) bolyong a gráfon; minden lépésben egyenletesen véletlen szomszédra lép (súlyozott módban a súlyokkal arányosan).
   Gráfválasztó: Árvízhét (alapértelmezett), barátsággráf, csillag, lapok hivatkozásai (irányított). Gombok: Lépés, Indít/Megállít (sebesség csúszka), +1000 lépés (azonnal), Nullázás; kapcsoló: „súlyozott séta” (Árvízhétnél).
   Alatta oszlopdiagram (canvas vagy HTML-sávok): csúcsonként a látogatási gyakoriság (%) és mellette vonalként / halvány sávként az elmélet: $d_i/2m$ (súlyozva $s_i/\sum s$). Kiírás: lépésszám, a legtöbbet látogatott csúcs, és az eltérés $\tfrac12\sum|f_i - \pi_i|$.
   A csúcs mérete vagy színe a látogatottság szerint. Irányított gráfnál (lapok): ha a séta zsákutcába (kifok 0, az RH) ér, **megáll**, és a kiírás: „Beragadt: az RH-ból nem vezet ki él. A PageRank ezt teleportálással oldja meg – 5. fejezet.” (Újraindításkor véletlen kezdőcsúcs.)
   Ellenőrző számok: Árvízhét $\pi$: Ko 20%, Po 20%, Vi 15%, Sz 15%, La 10%, Ön 10%, Kl 10%; súlyozva: Po 8/36, Ko 6/36, Vi, La, Ön 5/36, Sz 4/36, Kl 3/36. Barátsággráf: 25%, 25%, 37,5%, 12,5%.
   Csillagon a séta felváltva van a középen és a leveleken – a gyakoriság ettől még $d_i/2m$-hez tart (középen 50%), de lépésenként az eloszlás nem konvergál (a 4.2 buktató-doboza erről szól); erre egy mondat a kiírásban.
2. **`laplacian-smooth`** (4.4): gráfválasztó: 3 csúcsú út (1–2–3; add hozzá saját presetként), 4 csúcsú út, két háromszög + híd, Árvízhét. Csúcsonként egy csúszka ($-3 \ldots 3$, 0,1-es lépés, a csúcs címkéjével); a csúcs színe `divColor(x)`, a csúcs mellett az érték.
   Az élek vastagsága / színe a $(x_i - x_j)^2$ tag nagysága szerint; élre kattintva kiírja a tagot. Élő kiírás: $\mathbf x^\top L\mathbf x = \sum (x_i - x_j)^2$ tagonként felsorolva (kis gráfnál), és $\mathbf x^\top L \mathbf x / \mathbf x^\top\mathbf x$ (Rayleigh-hányados).
   Gombok: „konstans” (mind 1 → 0), „ugráló” (váltakozó ±1), „véletlen”, „Fiedler-vektor” (a `fiedler()` eredménye, √n-nel skálázva, hogy a csúszkák tartományába essen), „legsimább nem konstans” = ugyanez. Ellenőrző számok: 3 csúcsú út: (1,2,3) → 2; (1,3,1) → 8; (1,1,1) → 0.
   Második panel: „Spektrum” – a Laplace-mátrix sajátértékei pöttyökként egy számegyenesen (0-tól), a nullák száma kiemelve: „0 sajátérték: k db = k komponens”. Kapcsoló: „híd törlése” (két háromszög + híd esetén a 3–4 él ki/be) → a spektrum 0; 0,438; 3; 3; 3; 4,562 → 0; 0; 3; 3; 3; 3.
   (Szerkeszthető mód nem kell, de ha könnyű, a „szerkesztés” kapcsolóval élt lehessen be-/kikapcsolni két csúcsra kattintva, és a spektrum frissüljön.)
3. **`spectral-cut`** (4.5): szerkeszthető gráf (`editable: true`; alapértelmezés két háromszög + híd; presetek: Árvízhét (súlyozatlanul), karateklub, „üres”). Minden változáskor: Fiedler-vektor (`fiedler`), a csúcsok színe az előjel szerint (`--setA` / `--setB`, a nagyság szerint telítve: `divColor`), a csúcs alatt az érték (2 tizedes),
   a vágott élek (különböző oldalon lévő végpontok) piros szaggatottak, kiírás: $\lambda_2$, a két oldal mérete, a vágott élek száma, és ha a gráf nem összefüggő ($\lambda_2 \approx 0$): „A gráf nem összefüggő – a Fiedler-vektor a komponenseket választja szét (λ₂ = 0).”
   Kapcsoló: „vágás az előjelnél / a mediánnál” (medián: kiegyensúlyozott méretű két fél). Karateklubnál kapcsoló: „valódi szakadás” – a `club` szerinti kettéválás keretszínnel, és kiírás: hány tag kerül a valódi oldalára (az előjeles vágásnál 34-ből 33; a kivétel a **9.** tag, 1-től számozva, Fiedler-értéke ~0,01, nagyon közel a nullához).
   Ellenőrző számok: két háromszög + híd: $\lambda_2 \approx 0{,}438$, Fiedler (előjel szerint normalizálva, első pozitív) 0,46; 0,46; 0,26; −0,26; −0,46; −0,46, vágott él 1. Árvízhét: $\lambda_2 \approx 0{,}643$; oldalak {Po, La, Ön} és {Ko, Vi, Sz, Kl}; vágott élek: Ko–Po, Vi–Po (2).
   A Fiedler-vektor előjele önkényes: legyen egy „előjelcsere” gomb, ami csak a színeket cseréli (és a kiírás: „ugyanaz a vágás”).

A karateklub adatai (`window.KARATE13`) a `../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js`-ből jönnek (a fejezet betölti).

Követelmények: magyar, tegező, rövid feliratok; a W-függvény elején `header(root, cím, alcím)`; vezérlők `div.controls`-ban, kiírás `div.readout`-ban (lásd gh3); témaváltáskor helyes színek (CSS-változók; a `divColor` minden rajzoláskor újraszámolandó);
mobilon is használható (pointer események; ne csak hover; 390 px szélességen se lógjon ki). KaTeX-et a `math(el)` renderel. Számok tizedesvesszővel (`fmt`). Ne használj külső könyvtárat, ne írj /tmp-be, ne commitolj. Animációt (`requestAnimationFrame`/`setInterval`) állítsd le, ha a widget nem látszik vagy megállították.

Ellenőrzés: teszteléshez írj saját `_parts/gh4/wtest2.html`-t, amely betölti `../../assets/style.css`, `../../assets/common.js`, `../../assets/graph.js`, `../../grafelmelet-halozattudomany/arvizhet-data.js`, `../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` és egy `cat w0.js w2.js w9.js`-ből készült `wtest2-widgets.js`-t, a három widget div-jével.
Playwright: `uv run -q --with playwright python -I …` (http.server egy szabad porton a synopsis gyökerében; utána állítsd le `fuser -k <port>/tcp`-vel, NE `pkill -f`-fel).
Kattintsd végig: nincs konzolhiba; a fenti ellenőrző számok egyeznek (a random-surfer +1000 lépés többszöri nyomása után a gyakoriságok közel vannak $\pi$-hez). Készíts képernyőképet `_parts/gh4/shots/w2-*.png` néven (világos és sötét téma, 390 px szélesség is), és nézd meg őket.
A végén röviden jelentsd: mit csináltál, mit bővítettél a graph.js-ben (ha bármit), és mit ellenőriztél.
