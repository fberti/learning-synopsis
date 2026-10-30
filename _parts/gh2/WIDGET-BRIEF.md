# Gráfelmélet 2. fejezet – widgetírási útmutató

Synopsis tananyag (statikus oldal, vanilla JS, nincs build-lépés, nincs külső könyvtár). Olvasd el:
- `assets/graph.js` – a közös `GraphKit` (GK): `View` (canvas-nézet: nodes `{label,x,y,color,badge,sub}` [0;1]-es koordinátákkal, edges `{a,b,w}`;
  opciók `aspect, radius, editable, showWeights, weightWidth, draggable, onNodeClick(i), onChange, onDraw(ctx,view)`; mezők `hl` (Set csúcsindex), `hlE` (Set `GK.edgeKey(a,b)`),
  `dim`, `sel`; metódusok `setGraph, draw, layout(seed), animateTo, edgeList`), `parseEdges`, `degrees`, `adjMatrix`, `adjList`, `circleLayout`, `forceLayout`, `normalize`.
  A `View`-t visszafelé kompatibilisen BŐVÍTHETED (pl. élenkénti `color`/`dash`, nem egész súlyfelirat formázása), de az 1. fejezet widgetjei (`grafelmelet-halozattudomany/01-mi-a-halozat/widgets.js`) nem romolhatnak el.
- `_parts/gh2/w0.js` – a fejezet közös segédfüggvényei (h, btn, header, toggleGroup, math, fmt, ACTOR_POS/actorPositions, cooc, arvizGraph, componentsOf, bfsDist, COMP_COLORS). Ne módosítsd; használd.
- mintának `_parts/gh1/w.js` (az 1. fejezet widgetjei: stílus, felépítés, szöveg).
- a tananyag: `_parts/gh2/0*.html` (a widgetek helye: `<div class="widget" data-widget="név">`).

Feladatod: a `_parts/gh2/w2.js` fájlban négy widget, `W["név"] = root => {…}` alakban (a fájl a w0.js IIFE-jének közepére fűződik, saját IIFE nélkül!):
1. `dijkstra-step` (2.4): két adatkészlet váltógombbal: (a) települések: Sze–Hmv 25, Sze–Mak 33, Hmv–Mak 30, Sze–Kis 30, Kis–Csg 36, Hmv–Csg 37 (pozíciók a 04-s24.html ábrája szerint);
   (b) Árvízhét `arvizGraph`, a súly erősség, kapcsoló: „hossz = súly” vs. „hossz = 1/súly”. Kezdőcsúcs kattintással. „Lépés” / „Végig” / „Újra” gombok. Csúcsokon a címke (ideiglenes / végleges, ∞), a véglegesek kiemelve,
   a legrövidebb utak fája (szülő-élek) kiemelve; alatta táblázat a lépésekről, mint a szövegben. Célcsúcs választható → az út kiírva.
2. `spanning-tree` (2.5): Kruskal lépésenként; adatkészlet: települések (minimális) és Árvízhét (maximális, súly = erősség); a rendezett éllista oldalt, minden él állapota (bevéve ✓ / kört zárna ✗ / még vár),
   a kört záró élnél a kör kiemelése; összsúly; az Árvízhétnél gomb: „másik sorrend az egyenlő súlyoknál” (véletlen döntetlen-feloldás) → más fa, ugyanaz az összsúly.
3. `euler-trail` (2.6): gráfok: Königsberg (multigráf! a párhuzamos éleket a View ívben rajzolja; él-kattintáshoz számold a görbét vagy adj a hidaknak kattintható címkét/gombot), „ház” (A–B, B–C, C–D, D–A, A–C, B–D, C–E, D–E),
   Árvízhét. A páratlan fokú csúcsok kiemelve, a hüvelykujjszabály szerinti ítélet kiírva. A felhasználó élről élre „rajzol”: kattint egy kezdőcsúcsra, majd szomszédos élekre/csúcsokra; a bejárt élek színesek,
   a nem folytatható lépés tiltott; „Visszavonás”, „Újra”, „Mutass egy megoldást” (Hierholzer-algoritmus, animálva). Königsbergnél: „egy híd lebontása” kapcsoló.
4. `walk-counter` (2.7): gráf: barátsággráf (A–B, A–C, B–C, C–D) vagy Árvízhét; $k$ = 1…4 csúszka; a $A^k$ mátrix táblázatban (`table.adj`), cellára kattintva a két csúcs kiemelve és (ha ≤ 40) a séták felsorolva;
   főátló/3!-ra utaló megjegyzés $k=3$-nál (háromszögek = tr/6). A legkisebb $k$ jelzése, ahol a cella először pozitív (= távolság).

Követelmények: magyar, tegező, rövid feliratok; a W-függvény elején `header(root, cím, alcím)`; vezérlők `div.controls`-ban, kiírás `div.readout`-ban / `div.stat-row`-ban (lásd gh1); témaváltáskor helyes színek (CSS-változók `GK.css("--accent")` stb.);
mobilon is használható (pointer események; ne csak hover). KaTeX-et a `math(el)` renderel. Számokat tizedesvesszővel (`fmt`). Ne használj `numeric`/külső könyvtárat, ne írj /tmp-be, ne commitolj.

Ellenőrzés: a fejezetet `_parts/gh2/build.sh` állítja össze (ha még nincs, a te dolgod nem; a w0+w1+w2+w9 összefűzésből készül a widgets.js). Teszteléshez írj saját `_parts/gh2/wtest2.html`-t, amely betölti
`../../assets/style.css`, `../../assets/graph.js`, `../../grafelmelet-halozattudomany/arvizhet-data.js` és egy `cat w0.js w2.js w9.js`-ből készült `wtest2-widgets.js`-t, a négy widget div-jével.
Playwright: `uv run -q --with playwright python -I …` (http.server egy szabad porton a synopsis gyökerében; utána állítsd le `fuser -k <port>/tcp`-vel, NE `pkill -f`-fel).
Kattintsd végig: nincs konzolhiba, a Dijkstra eredménye Sze-ből Csg = 62, a Kruskal 121, illetve 12, az Euler-megoldás 7/8/10 élt jár be (Königsberg híd nélkül 6), $(A^3)_{AC} = 4$. Készíts képernyőképet `_parts/gh2/shots/w2-*.png` néven, és nézd meg őket.
A végén röviden jelentsd: mit csináltál, mit bővítettél a graph.js-ben, és mit ellenőriztél.
