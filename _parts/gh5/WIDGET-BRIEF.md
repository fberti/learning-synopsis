# Gráfelmélet 5. fejezet – widgetírási útmutató

Synopsis tananyag (statikus oldal, vanilla JS, nincs build-lépés, nincs külső könyvtár). A fejezet: **Centralitás: ki a fontos a hálózatban?**
(5.1 fokszám-centralitás $d/(n-1)$, erősség, befok/kifok · 5.2 közelségi $(n-1)/\sum d$, harmonikus $\sum 1/d$ · 5.3 köztesség $\sum \sigma_{st}(v)/\sigma_{st}$ ·
5.4 sajátvektor-centralitás · 5.5 PageRank $p_i = (1-\alpha)/n + \alpha\sum_{j\to i} p_j/k^{\text{ki}}_j$, zsákutca súlya egyenletesen szétosztva · 5.6 HITS $\mathbf a = A^\top\mathbf h$, $\mathbf h = A\mathbf a$ ·
5.7 melyik mikor (Krackhardt-sárkány) · 5.8 alkalmazás: Árvízhét, politikai blogok).

Olvasd el:
- `assets/graph.js` – a közös `GraphKit` (GK): `View` (canvas: nodes `{label,x,y,color,ink,badge,sub}` [0;1]-es koordinátákkal, edges `{a,b,w}`; opciók `aspect, radius, editable, showWeights, weightWidth, draggable, directed, onNodeClick(i), onEdgeClick(i), onChange, onDraw(ctx,view), maxNodes`; élenként `color, width, dash, label, dir, alpha`; mezők `hl`, `hlE` (Set `GK.edgeKey(a,b)`), `dim`, `sel`; metódusok `setGraph, draw, layout(seed), animateTo, edgeList`), `GK.css`, `normalize`.
  Szerkeszthető módban: üres helyre kattintás → új csúcs; csúcs, majd másik csúcs → él be/ki (irányított `View`-nál a → b a kattintás sorrendjében); élre kattintás → törlés.
  A `View`-t visszafelé kompatibilisen bővítheted, de az 1–4. fejezet widgetjei (`grafelmelet-halozattudomany/0[1-4]-*/widgets.js`) nem romolhatnak el.
- `_parts/gh5/w0.js` – a fejezet közös segédfüggvényei. **Ne módosítsd**, használd:
  `h, btn, header, toggleGroup, math, fmt, actorName, ACTOR_POS, preset(név, aspect)` – mintagráfok: `path4, path5, c4, barat, paw, star, bowtie, twoTri, kite` (Krackhardt-sárkány, A–J), `arviz` (súlyozott; `w` = közös cikkek), `karate` (`club` mező),
  irányítottak (`directed: true`, él a → b): `papers` (súlyozott), `papersU` (súly nélkül), `pr4` (A→B, A→C, B→C, C→A, D→C), `hits5` (H1→T1, H1→T2, H1→T3, H2→T1, H2→T2, T3→T1);
  `adjM, rowSums, matVec, eigSym, mixColor, divColor`; centralitások (mind csúcsonkénti tömböt ad): `degreeC(n, E, {directed, mode:"in"|"out", weighted})`, `closenessC(n, E)`, `harmonicC(n, E, norm)`, `farness(n, E)`,
  `betweennessC(n, E, {directed, norm})` (irányítatlanul a párokat egyszer számolja), `shortestPaths(n, E, s, t)`, `eigenC(n, E)` → `{vec (max = 1), lambda}`, `pagerankC(n, E, {directed, alpha, weighted, steps})` (steps megadásával `{p, hist}`),
  `hitsC(n, E, {steps})` → `{a, h, hist: [{a, h}, …]}` (max = 1-re normálva), `ranks(vals)` → `{order, rank}` (holtverseny azonos helyezés), `texLab(label)` (KaTeX-címke).
- Mintának: `_parts/gh4/w1.js`, `_parts/gh4/w2.js` (stílus, felépítés, szöveg, `div.controls`, `div.readout`, táblázatok `div.tw`-ben).

Feladatod: a `_parts/gh5/w2.js` fájlban három widget, `W["név"] = root => {…}` alakban (a fájl a w0.js IIFE-jének közepére fűződik, saját IIFE nélkül; a saját segédfüggvényeidet tedd egy `{ … }` blokkba, hogy ne ütközzenek a w1.js neveivel):

1. **`centrality-explorer`** (5.7, a fejezet fő widgetje): szerkeszthető gráf (`editable: true`, `maxNodes` 14 körül). Presetek: sárkány (alapértelmezett), Árvízhét (súlyozatlanul), csokornyakkendő, 5 csúcsú út, karateklub (itt ne legyen szerkeszthető, vagy legyen, de lassulás nélkül), üres.
   Centralitásválasztó (toggleGroup): fokszám ($d/(n-1)$), közelségi, harmonikus ($\sum 1/d$ osztva $n-1$-gyel), köztesség (normalizált), sajátvektor (max = 1), PageRank ($\alpha = 0{,}85$).
   A csúcs színe a választott érték szerint (`mixColor("--card", "--accent", t)`, sötét kitöltésnél fehér `ink`), a csúcs mellett `badge`-ként az érték (2 tizedes, `fmt`). Mellette / alatta rangsortáblázat (csúcs, érték, helyezés), a győztes(ek) kiemelve.
   „Verseny” mód: két centralitás kiválasztása, a táblázatban egymás mellett a két érték és a két helyezés, a helyezéskülönbség jelölve (pl. ▲3 / ▼2), alatta a Spearman-féle rangkorreláció ($1 - 6\sum d^2/(n(n^2-1))$ holtverseny nélkül; holtversenynél a rangok Pearson-korrelációja átlagolt rangokkal – a kettő nem holtversenyes esetben egyezik).
   Mindig látható összefoglaló sor: „Győztesek – fokszám: D · közelség: F, G · köztesség: H · sajátvektor: D” (az aktuális gráfra számolva).
   Nem összefüggő gráfnál a közelséginél kiírás: „A gráf nem összefüggő: a közelségi centralitás itt nem értelmes (0) – válaszd a harmonikust!”, a sajátvektornál: „Nem összefüggő gráfon a sajátvektor csak a legerősebb komponensben ad nem nulla értéket.”
   Ellenőrző számok (sárkány, A–J): fokszám 4,4,3,6,3,5,5,3,2,1 (D: 6/9 = 0,67); közelségi 0,53; 0,53; 0,5; 0,6; 0,5; 0,64; 0,64; 0,6; 0,43; 0,31; köztesség nyersen 0,83; 0,83; 0; 3,67; 0; 8,33; 8,33; 14; 8; 0 (normalizálva /36: H = 0,39); sajátvektor D = 1, F = G = 0,83, A = B = 0,73; PageRank D 0,147, F = G 0,129.
   Árvízhét: fokszám Ko, Po 0,67; közelségi Ko, Po 0,75; köztesség nyersen Po 8, Ko 5, Vi 1,5, Sz 0,5 (normalizálva /15: Po 0,53); sajátvektor Ko 1, Po 0,87, Vi 0,86.
2. **`pagerank-surfer`** (5.5): gráfválasztó: PageRank-minta (`pr4`, alapértelmezett), lapok hivatkozásai (`papersU`), összesítők és tudósítók (`hits5`), Árvízhét (irányítatlan – itt minden él két irányú).
   Csúszka: $\alpha$ 0…1, 0,05-ös lépés (alapból 0,85). Kapcsoló (csak `pr4`-nél): „C → A él törlése” – ekkor C zsákutca lesz. Kapcsoló: „zsákutca: egyenletes szétosztás / nincs kezelve (elszivárog)” – az utóbbihoz saját iterációt írj (a zsákutca súlya egyszerűen elvész).
   Két panel:
   (a) **„Lépésről lépésre”**: táblázat a $\mathbf p_t$ vektorról (t = 0-tól, $1/n$-ből indulva), gombok Lépés / +10 lépés / Nullázás; kiírás: az összeg (1, vagy szivárgáskor kevesebb), és a csúcsok mellett badge-ként $p_i$ (3 tizedes). Egy csúcsra kattintva kiírja a képletet számokkal: $p_C = (1-\alpha)/n + \alpha(p_A/2 + p_B/1 + p_D/1)$ = ….
   (b) **„Szörföző”**: egy pötty (olvasó) lépked: $\alpha$ eséllyel véletlen kimenő élen tovább, $1-\alpha$ eséllyel teleportál egy egyenletesen véletlen csúcsra (a teleportálást szaggatott ív vagy villanás jelzi); zsákutcából mindig teleportál. Gombok: Indít/Megállít (sebesség), +1000 lépés, Nullázás. Alatta oszlopdiagram: a látogatási gyakoriság és mellette (halványan) a PageRank-érték csúcsonként; kiírás: lépésszám, eltérés $\tfrac12\sum|f_i - p_i|$.
   Ellenőrző számok: `pr4`, $\alpha = 0{,}85$: határ A 0,373; B 0,196; C 0,394; D 0,038 (= 0,15/4); 1 lépés után (0,25; 0,144; 0,569; 0,038), 2 lépés után (0,521; 0,144; 0,298; 0,038). $\alpha = 1$: (0,4; 0,2; 0,4; 0). C → A törölve, $\alpha = 1$, szivárgással: $t = 1$: (0; 0,125; 0,625; 0), összeg 0,75; $t = 2$: (0; 0; 0,125; 0); $t = 3$: csupa 0.
   `papersU`: RH 0,416; EK 0,278; NY 0,179; VN 0,126 ($\alpha = 0{,}85$); $\alpha = 0{,}5$: RH 0,347; EK 0,274; NY 0,211; VN 0,168. `hits5`: T1 0,359; T2 0,219; T3 0,165; H1 = H2 0,128. Árvízhét: Po 0,196; Ko 0,190 (közel a $d_i/2m$-hez: 0,2; 0,2).
   Kiírás $\alpha = 1$ és összefüggő, de nem erősen összefüggő gráfnál (pl. `pr4`): „D-be nem vezet él: teleportálás nélkül a súlya 0 lesz.” Rövid, egymondatos magyarázatok.
3. **`hits-steps`** (5.6): irányított gráf (`directed: true`), alapértelmezés `hits5`; presetek: `hits5`, `papersU`, `pr4`; szerkeszthető mód kapcsolóval (csúcs → csúcs kattintás: él a → b).
   Gombok: Lépés, Konvergenciáig, Nullázás. Kezdés: $\mathbf h = \mathbf 1$. Egy lépés: $\mathbf a = A^\top\mathbf h$ (minden csúcs összeadja a rá mutatók hub-értékét), normálás (max = 1), majd $\mathbf h = A\mathbf a$ (minden csúcs összeadja azok tekintélyét, akikre mutat), normálás.
   A táblázatban csúcsonként: befok, kifok, $a$, $h$ (3 tizedes) és az első lépésnél a normálás előtti nyers összegek is (pl. $a_{T1} = h_{H1} + h_{H2} + h_{T3} = 3$). Kapcsoló: színezés „tekintély” (`--setB`) vagy „hub” (`--setA`) szerint, badge-ben az érték.
   Egy csúcsra kattintva kiemeli a bejövő éleit (tekintély módban) vagy a kimenő éleit (hub módban), és kiírja az összeget.
   Ellenőrző számok (`hits5`): 1. lépés nyersen a: T1 3, T2 2, T3 1 (H1, H2: 0) → normálva 1; 0,667; 0,333; h nyersen H1 = 1 + 0,667 + 0,333 = 2, H2 1,667, T3 1 → normálva H1 1, H2 0,833, T3 0,5.
   (Figyelem: a `hitsC` minden lépésben az *előzőleg normált* a-val számolja h-t – a fenti h-számok ezt követik; a szöveg a nyers egész számokkal is szemléltet: a = (3, 2, 1), h = A·a = (6, 5, 3) → arányaiban ugyanaz: 1; 0,833; 0,5.)
   Határérték: a: T1 1, T2 0,802, T3 0,445; h: H1 1, H2 0,802, T3 0,445. `papersU`: a RH 1, NY 0,618; h VN 1, EK 0,618.
   Kiírás a végén: „A legjobb hubok a sok jó tekintélyre mutató oldalak (összesítők), a legjobb tekintélyek a sok jó hub által hivatkozottak (eredeti tudósítók).”

Követelmények: magyar, tegező, rövid feliratok; a W-függvény elején `header(root, cím, alcím)`; vezérlők `div.controls`-ban, kiírás `div.readout`-ban; témaváltáskor helyes színek (CSS-változók; a `mixColor` minden rajzoláskor újraszámolandó);
mobilon is használható (pointer események; ne csak hover; 390 px szélességen se lógjon ki – a széles táblázatot tedd `div.tw` (overflow-x:auto) elembe). KaTeX-et a `math(el)` renderel (a kiírásban a `$…$`-t a frissítés után renderelni kell). Számok tizedesvesszővel (`fmt`).
Ne használj külső könyvtárat, ne írj /tmp-be, ne commitolj. Animációt (`requestAnimationFrame`/`setInterval`) állítsd le, ha a widget nem látszik (IntersectionObserver) vagy megállították.

Ellenőrzés: teszteléshez írj saját `_parts/gh5/wtest2.html`-t, amely betölti `../../assets/style.css`, `../../assets/common.js`, `../../assets/graph.js`, `../../grafelmelet-halozattudomany/arvizhet-data.js`, `../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` és egy `cat w0.js w2.js w9.js`-ből készült `wtest2-widgets.js`-t, a három widget div-jével (plusz a KaTeX a CDN-ről, ahogy a `_parts/gh4/wtest2.html`).
Playwright: `uv run -q --with playwright python -I …` (http.server egy szabad porton a synopsis gyökerében; utána állítsd le `fuser -k <port>/tcp`-vel, NE `pkill -f`-fel). A `_parts/gh4/wtest2.py` jó minta.
Kattintsd végig: nincs konzolhiba; a fenti ellenőrző számok egyeznek. Készíts képernyőképet `_parts/gh5/shots/w2-*.png` néven (világos és sötét téma, 390 px szélesség is), és nézd meg őket.
A végén röviden jelentsd: mit csináltál, mit bővítettél a graph.js-ben (ha bármit), és mit ellenőriztél.
