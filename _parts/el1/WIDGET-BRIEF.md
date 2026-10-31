# Elektronika 1. fejezet – widgetírási útmutató

Synopsis tananyag (statikus magyar tanulóoldal, vanilla JS, nincs build-lépés, nincs külső könyvtár). Témakör: *Elektromosságtan és digitális elektronika*,
1. fejezet: **Az elektromos töltés és az elektromos mező** (1.1 atom, töltés, coulomb · 1.2 dörzselektromosság, triboelektromos sor, megosztás, polarizáció ·
1.3 Coulomb-törvény · 1.4 mező · 1.5 vezetők, szigetelők · 1.6 ESD, villám, földelés, NCV · 1.7 lebegő bemenet, az Arduino mint elektroszkóp).

Olvasd el:
- a fejezet szövegét: `_parts/el1/02-s12.html` (1.2), `06-s16.html` (1.6), `07-s17.html` (1.7) – a widgetjeidnek ezekhez kell illeszkedniük (fogalmak, számok, szóhasználat);
- `_parts/el1/w0.js` – a fejezet közös segédfüggvényei. **Ne módosítsd**, használd: `W` (ide regisztrálsz), `E_CH` (elemi töltés), `K`, `fmt(x, d)` (tizedesvessző),
  `sci(x, d)` (normálalak „1,6·10⁻¹⁹”), `si(x, unit, d)` (prefixum: „230 nC”), `h(tag, attrs, ...kids)`, `btn`, `header(root, cím, alcím)`, `toggleGroup(parent, items, cur, onpick)`,
  `slider(parent, label, min, max, val, step, show, onchange)`, `math(el)` (KaTeX újrarenderelés), `colors()` (téma-színek, `pos` piros = pozitív, `neg` kék = negatív – minden rajzoláskor hívd újra),
  `makeCanvas(parent, height, maxW)` (HiDPI vászon; `cv.ctx`, `cv.W`, `cv.H`, `cv.refit()`), `pointer(cv, ev)`, `arrow(ctx, x1, y1, x2, y2, color, width, head)`, `chargeDot(ctx, x, y, r, q, C, label)`;
- mintának `_parts/gh4/w2.js` vagy `_parts/gh5/w2.js` (felépítés: `header`, vezérlők `div.controls`-ban, kiírás `div.readout`-ban, `.stat-row`/`.stat` kártyák; stílus: `assets/style.css`).

Feladatod: a `_parts/el1/w2.js` fájlban három widget, `W["név"] = root => {…}` alakban (a fájl a w0.js IIFE-jének közepére fűződik – w0 + w1 + **w2** + w9 –,
saját IIFE nélkül; a saját segédfüggvényeidet tedd egy `{ … }` blokkba, hogy ne ütközzenek a w1.js neveivel):

1. **`rub-series`** (1.2 a, triboelektromos sor): A sor (+ → −): üveg · emberi haj · nejlon · gyapjú · selyem · papír · pamut · borostyán · gumi (lufi) · poliészter · PVC · teflon.
   Két legördülő (vagy kattintható lista): „A anyag” és „B anyag” (alapból emberi haj és gumi (lufi)). Gomb: „Dörzsöld össze!” – animáció: a két test egymáshoz csúszik párszor,
   közben kis kék elektronpöttyök vándorolnak a sorban feljebb álló anyagból a lejjebb állóba (5–12 db, a sorbeli távolsággal arányosan több). Utána a testeken
   $+$ / $-$ jelek, kiírás: „A haj elektronokat adott át a lufinak: a lufi negatív, a haj pozitív.” Azonos anyagnál: „Azonos anyagok között alig történik töltésátvitel.”
   Alatta a teljes sor vízszintes skálaként, a két kiválasztott anyag kiemelve, nyíllal az elektronok irányáról.
   Második rész: „Közelítsd őket!” – két megdörzsölt test (pl. a két kiválasztott, vagy egy harmadik, ugyanazzal a partnerrel dörzsölt példány) közelítése csúszkával: vonzás / taszítás
   kiírás és erőnyilak (azonos előjel → taszít, ellentétes → vonz). Elég egyszerűen: válassz „lufi ↔ lufi”, „lufi ↔ haj”, „üveg ↔ lufi”, „üveg ↔ üveg” párokat gombbal (ezek a szöveg kiinduló esetének sorai), mindkettőt a szöveg szerinti partnerrel dörzsölve
   (lufi: hajjal; üveg: selyemmel). A megjegyzés: „A sor tájékoztató jellegű: páratartalom, tisztaság, dörzsölés módja is számít.”
2. **`esd-spark`** (1.6 a): „Sétálj a szőnyegen!” Vezérlők: lépésszám (gomb: „Lépj egyet” / „10 lépés” / „Kisülés”), cipő: gumitalp / bőrtalp / mezítláb, padló: műszálas szőnyeg / fa / csempe,
   páratartalom csúszka (20–80%). Egyszerű modell (kitalált, de nagyságrendileg reális, a szövegben jelöld „egyszerűsített modell”): lépésenként töltés jön (pl. gumitalp + műszálas szőnyeg: +0,08 µC/lépés),
   és közben exponenciálisan szivárog (időállandó a páratartalomtól függ: 20% → hosszú, 80% → rövid; mezítláb → nagyon gyors kisülés, bőrtalp → közepes).
   Telítés: a töltés kb. 1,5 µC-nál ne menjen tovább (20%-os páratartalomnál, gumitalp, műszálas szőnyeg; ott a „testfeszültség” 15 kV).
   Kiírás (élőben): töltés $Q$ (µC), többletelektronok száma $N = Q/e$, „testfeszültség” $U = Q/C$ ($C = 100\,\text{pF}$; a szövegben: „a feszültséget a 2. fejezetben definiáljuk”),
   várható szikrahossz $U / (3\,\text{kV/mm})$, kisülési energia $\tfrac12 QU$ (mJ). Egy „hőmérő”-szerű sávon a küszöbök: 200 V (érzékeny alkatrész), 2 kV (74HC595 HBM-határ), 3 kV („épp érzed”), 10 kV (látható szikra).
   „Kisülés” gombra: a kilincs felé nyúló kéz és szikra rajza (vagy villanás), majd a kiírás: „Érezted? Igen/Nem · Egy 74HC595 túlélte volna? Biztosan / határeset / valószínűleg nem.” és a töltés nullára áll.
   Ellenőrző számok (a szöveg táblázata): 0,2 µC → 2 kV, 0,67 mm, 0,2 mJ; 0,3 µC → 3 kV, 1 mm, 0,45 mJ; 1 µC → 10 kV, 3,3 mm, 5 mJ, $6{,}2 \cdot 10^{12}$ elektron; 1,5 µC → 15 kV, 5 mm, 11,25 mJ.
3. **`floating-input`** (1.7 a, a fejezet alkalmazás-widgetje): szimulált Arduino-soros plotter. Bal oldalt (vagy felül) egy kis jelenet: Arduino-panel, az A0-ból felálló drót („antenna”),
   egy fésű, amelyet egérrel/ujjal húzva közelíthetsz (vagy csúszkával: távolság 3–40 cm), és egy kéz (kapcsoló: „kéz közelít”).
   Vezérlők: fésű töltése (− / + / semleges – a negatív az alapértelmezés), „lámpavezeték az antenna mellett” kapcsoló, „lehúzó ellenállás (10 kΩ a GND-re)” kapcsoló (előzetes a 15. fejezethez), „Megállít/Indít”.
   Jobb oldalt (alatta) egy görgő grafikon (kb. 5 s ablak, 0…1023 tengely), két görbe: **nyers** (halványabb) és **átlag** (20 ms-os átlag, vastagabb), jelmagyarázattal, mint a Serial Plotter.
   Modell (egyszerűsített, ezt írd is ki halványan): alapszint ~ 400–600 körüli, lassan vándorló érték (véletlen séta); nyers = alap + 50 Hz-es szinusz (amplitúdó ~ 30–80, kéz közelében ×3–5, lámpavezetéknél ×5)
   + kis zaj; a fésű hatása: eltolás $\Delta = -\,c \cdot q / (r^2 + r_0^2)$ jellegű, ami lassan (időállandó ~ 5–10 s) visszakúszik nullára, ha a fésű áll (szivárgás) – így távolításkor az
   ellenkező irányba „túllő” (ahogy a szöveg vegyes gyakorló 10. feladata és az L1.1 „Mi történt?” leírja); 0 és 1023 között vágva (ütközés). Az átlag a nyers 20 ms-os mozgóátlaga
   (szimulálj pl. 1 kHz-es belső mintavétellel, és a plotterre kb. 50 pont/s menjen ki, mint a valódi sketch). Lehúzó ellenállásnál a jel 0 körül áll, alig zajos („a bemenet már nem lebeg”).
   Kiírás: aktuális nyers és átlag, és egy rövid, helyzethez illő mondat („A fésű közeledik: megosztás – az átlag elmozdul.”, „A fésű áll: a hatás lassan elszivárog.”, „Kéz közelít: erősebb 50 Hz-es zümmögés.”).
   Animációt állítsd le, ha a widget nem látszik (IntersectionObserver) vagy megállították.

Követelmények: magyar, tegező, rövid feliratok; a W-függvény elején `header(root, cím, alcím)`; vezérlők `div.controls`-ban, kiírás `div.readout`-ban; témaváltáskor helyes színek (CSS-változók / `colors()` minden rajzoláskor);
mobilon is használható (pointer események; ne csak hover; 390 px szélességen se lógjon ki – széles táblázat `div.tw` (overflow-x:auto) elembe). KaTeX-et a `math(el)` renderel (a kiírásban a `$…$`-t a frissítés után renderelni kell),
de egyszerűbb a kiírásban sima szöveget és `sci`/`si`-t használni. Számok tizedesvesszővel. Pozitív töltés piros (`C.pos`), negatív kék (`C.neg`) – a w1.js widgetjei is így színeznek.
Ne használj külső könyvtárat, ne írj /tmp-be, ne commitolj, más fájlt ne módosíts.

Ellenőrzés: teszteléshez írj saját `_parts/el1/wtest2.html`-t, amely betölti `../../assets/style.css`, `../../assets/common.js`, a KaTeX-et a CDN-ről (ahogy `_parts/el1/00-head.html`),
és egy `cat w0.js w2.js w9.js`-ből készült `wtest2-widgets.js`-t, a három widget div-jével (`<div class="widget" data-widget="rub-series"></div>` stb.).
Playwright: `uv run -q --with playwright python -I …` (http.server egy szabad porton a synopsis gyökerében; utána állítsd le `fuser -k <port>/tcp`-vel, NE `pkill -f`-fel). A `_parts/gh4/wtest2.py` jó minta.
Kattintsd végig: nincs konzolhiba; az ellenőrző számok egyeznek. Készíts képernyőképet `_parts/el1/shots/w2-*.png` néven (világos és sötét téma, 390 px szélesség is), és nézd meg őket.
A végén röviden jelentsd: mit csináltál és mit ellenőriztél; ha a fejezet szövegében hibát vagy a widgettel ellentmondó állítást találtál, jelezd (a HTML-t ne javítsd).
