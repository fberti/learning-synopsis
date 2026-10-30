# Gráfelmélet 3. fejezet – widgetírási útmutató

Synopsis tananyag (statikus oldal, vanilla JS, nincs build-lépés, nincs külső könyvtár). Olvasd el:
- `assets/graph.js` – a közös `GraphKit` (GK): `View` (canvas-nézet: nodes `{label,x,y,color,badge,sub}` [0;1]-es koordinátákkal, edges `{a,b,w}`;
  opciók `aspect, radius, editable, showWeights, weightWidth, draggable, directed (nyílhegy), onNodeClick(i), onEdgeClick(i), onChange, onDraw(ctx,view)`; élenként `color, width, dash, label, dir`; mezők `hl` (Set csúcsindex), `hlE` (Set `GK.edgeKey(a,b)`),
  `dim`, `sel`; metódusok `setGraph, draw, layout(seed), animateTo, edgeList`), `parseEdges`, `degrees`, `adjMatrix`, `adjList`, `circleLayout`, `forceLayout`, `normalize`.
  A `View`-t visszafelé kompatibilisen BŐVÍTHETED (pl. élenkénti `color`/`dash`, nem egész súlyfelirat formázása), de az 1. fejezet widgetjei (`grafelmelet-halozattudomany/01-mi-a-halozat/widgets.js és 02-setak-utak-fak/widgets.js`) nem romolhatnak el.
- `_parts/gh3/w0.js` – a fejezet közös segédfüggvényei (h, btn, header, toggleGroup, math, fmt, ACTOR_POS/actorPositions, cooc, arvizGraph, componentsOf, bfsDist, COMP_COLORS). Ne módosítsd; használd.
- mintának `_parts/gh1/w.js` és `_parts/gh2/w1.js`, `_parts/gh2/w2.js` (stílus, felépítés, szöveg).
- a tananyag: `_parts/gh3/0*.html` (a widgetek helye: `<div class="widget" data-widget="név">`).

Az Árvízhét adatai (`window.ARVIZHET`, lásd `grafelmelet-halozattudomany/arvizhet-data.js`) a 3. fejezettől `events`, `citations`, `relations` (előjeles), `triples` mezőket is tartalmaznak.

Feladatod: a `_parts/gh3/w2.js` fájlban négy widget, `W["név"] = root => {…}` alakban (a fájl a w0.js IIFE-jének közepére fűződik, saját IIFE nélkül; a saját segédfüggvényeidet tedd egy `{ … }` blokkba, hogy ne ütközzenek a w1.js neveivel):
1. `signed-view` (3.3): az Árvízhét előjeles gráfja (`relations`; a 7 szereplő az `actorPositions` szerinti helyen, a Kl izolált); pozitív él zöld (`--ok`), negatív piros szaggatott (`--bad`); élre kattintva a forráscikk címe és a `text` mező;
   háromszögek listája (3 db: Ko–Vi–Po +++, Ko–Vi–Sz ++−, Po–La–Ön +++), kattintásra kiemelve, a szorzat előjelével („kiegyensúlyozott / kiegyensúlyozatlan – részletek a 6. fejezetben”);
   kapcsoló: az élek előjelének átkapcsolása kattintással („mi lenne, ha…”), a háromszögek állapota élőben; „Visszaállítás”. Csúcsonként a +/− fok kiírva.
2. `multilayer-view` (3.6): a 4 lap három rétegben (hivatkozás – irányított, súlyozott, a `citations`-ből lapszintre összevonva, saját lapon belülieket kihagyva; közös esemény – a lap–esemény páros gráf vetülete;
   közös szereplő – a cikkek `mentions`-éből); három kis canvas egymás mellett (mobilon egymás alatt) + egy negyedik: az összevont gráf, ahol az él vastagsága = hány rétegben van meg, a színe kevert/több vonal;
   rétegkapcsolók (checkbox) az összevonáshoz; lappárra (élre) kattintva táblázat: melyik rétegben milyen súllyal. A szöveg számai: lásd 06-s36.html.
3. `kg-explorer` (3.7): a 12 hármas (`triples`) tudásgráfként (irányított, címkés élek, `label` = állítmány; entitások erőirányított vagy kézzel megadott elrendezésben, a szereplők színesek, a többi entitás (Gát, Árvíz, Védekezők) más színnel);
   bal oldalt / alatta a hármasok táblázata (alany | állítmány | tárgy | cikk); egy sorra kattintva az él kiemelve; csúcsra kattintva a be- és kimenő hármasok listája;
   egyszerű „lekérdező”: két legördülő (alany: bármely / entitás; állítmány: bármely / állítmány) → a találatok. Megjegyzés a nyílt világról, ha nincs találat.
4. `graph-type-chooser` (3.8): kártyajáték – 8 kutatási kérdés (a 08-s38.html döntési táblázata alapján, plusz néhány saját, a fejezet anyagán belül); mindegyikhez 4–5 gombos választás (súlyozott vetület, páros gráf, irányított, előjeles, időbeli,
   többrétegű, tudásgráf, hipergráf); a válasz után rövid indoklás (helyes / miért nem jó a választott), pontszám, „Újra” gomb. Nincs canvas, csak HTML.

Követelmények: magyar, tegező, rövid feliratok; a W-függvény elején `header(root, cím, alcím)`; vezérlők `div.controls`-ban, kiírás `div.readout`-ban / `div.stat-row`-ban (lásd gh1); témaváltáskor helyes színek (CSS-változók `GK.css("--accent")` stb.);
mobilon is használható (pointer események; ne csak hover). KaTeX-et a `math(el)` renderel. Számokat tizedesvesszővel (`fmt`). Ne használj `numeric`/külső könyvtárat, ne írj /tmp-be, ne commitolj.

Ellenőrzés: a fejezetet `_parts/gh3/build.sh` állítja össze (ha még nincs, a te dolgod nem; a w0+w1+w2+w9 összefűzésből készül a widgets.js). Teszteléshez írj saját `_parts/gh3/wtest2.html`-t, amely betölti
`../../assets/style.css`, `../../assets/graph.js`, `../../grafelmelet-halozattudomany/arvizhet-data.js` és egy `cat w0.js w2.js w9.js`-ből készült `wtest2-widgets.js`-t, a négy widget div-jével.
Playwright: `uv run -q --with playwright python -I …` (http.server egy szabad porton a synopsis gyökerében; utána állítsd le `fuser -k <port>/tcp`-vel, NE `pkill -f`-fel).
Kattintsd végig: nincs konzolhiba; a háromszögek és előjelek, a rétegek élei és a hármasok egyeznek a szöveggel (`06-s36.html`, `02-s32.html`). Készíts képernyőképet `_parts/gh3/shots/w2-*.png` néven (világos és sötét téma, 390 px szélesség is), és nézd meg őket.
A végén röviden jelentsd: mit csináltál, mit bővítettél a graph.js-ben, és mit ellenőriztél.
