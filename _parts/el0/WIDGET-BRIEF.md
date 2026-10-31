# Elektronika 0. fejezet – widgetírási útmutató

Synopsis tananyag (statikus magyar tanulóoldal, vanilla JS, nincs build-lépés, nincs külső könyvtár). Témakör: *Elektromosságtan és digitális elektronika*,
0. fejezet: **Laborkalauz: breadboard, multiméter, Arduino**.

Olvasd el:
- a fejezet szövegét: `_parts/el0/03-s03.html` (0.3 multiméter) és `04-s04.html` (0.4 színkód) – a widgetjeidnek ezekhez kell illeszkedniük (fogalmak, számok, szóhasználat);
- `_parts/el0/w0.js` – a közös segédfüggvények. **Ne módosítsd**, használd: `W` (ide regisztrálsz), `fmt(x, d)` (tizedesvessző), `sci`, `si(x, unit, d)` (prefixum),
  `h(tag, attrs, ...kids)`, `btn`, `header(root, cím, alcím)`, `toggleGroup(parent, items, cur, onpick)`, `slider(...)`, `math(el)`, `colors()` (téma-színek; minden rajzoláskor hívd újra),
  `makeCanvas(parent, height, maxW)`, `pointer(cv, ev)`, `arrow(...)`;
- mintának `_parts/el1/w2.js` (ugyanennek a témakörnek az 1. fejezetéhez írt widgetek: felépítés, stílus, `div.controls`, `div.readout`, `.stat-row`/`.stat`).

Feladatod: a `_parts/el0/w2.js` fájlban két widget, `W["név"] = root => {…}` alakban (a fájl a w0.js IIFE-jének közepére fűződik – w0 + w1 + **w2** + w9 –, saját IIFE nélkül;
a saját segédfüggvényeidet tedd egy `{ … }` blokkba, hogy ne ütközzenek a w1.js neveivel):

1. **`multimeter-sim`** (0.3 a) – virtuális okos multiméter, a kit műszeréhez hasonló (nincs forgókapcsoló!). Rajzold (canvas vagy SVG/HTML) a műszert: kijelző (4 jegy, 6000 digit,
   mértékegység, `DC`/`AC`, `-`, `OL`, `HOLD`, elem jel nem kell), alatta gombok: **bekapcsoló**, **HOLD/NCV** (rövid kattintás HOLD; egy külön „NCV” kapcsoló is elég, ha egyszerűbb),
   **SEL** (dióda → kapacitás → hőmérséklet → vissza automatikusra), és három **aljzat**: `10A`, `COM`, `V/Ω`. A **piros zsinór** a `V/Ω` vagy a `10A` aljzatba tehető (kattintással váltható), a fekete mindig a COM-ban.
   Mérendő tárgyak (gombsor vagy legördülő): „9 V-os elem” (9,43 V), „ugyanez fordított zsinórokkal” (−9,43), „Arduino 5V láb” (4,962 V), „Arduino 3.3V láb” (3,301 V), „220 Ω-os ellenállás” (218,7 Ω),
   „10 kΩ-os ellenállás” (9,87 kΩ), „breadboard: egy csík két lyuka” (0,3 Ω + csipogás), „breadboard: az árok két oldala” (OL), „semmi (a levegőben)” (OL, ellenállás módban),
   „LED + 220 Ω kör, megbontva (sorosan)” (árammérés: 13,6 mA, csak 10A-ben; V/Ω-ban: a kör szakadt, 0-hoz közeli/nem értelmes kijelzés – írj figyelmeztetést),
   „bekapcsolt áramkörben lévő ellenállás” (ellenállásmérés áram alatt: figyelmeztetés), „hálózati konnektor közelében (érintés nélkül)” (csak NCV módban: sípolás + vonalak; amúgy semmi).
   Viselkedés (okos mód): V/Ω aljzattal, ha a tárgyon feszültség van (> 0,8 V DC), feszültséget mutat a helyes felbontással (5,999 / 59,99 / 599,9 V határok); ha nincs, ellenállást (599,9 Ω / 5,999 kΩ / 59,99 kΩ … 60 MΩ;
   felette `OL`); 1 Ω alatt csipogás (szakadásvizsgálat, a hangot írásban jelezd: „🔊 csip!”, vagy rövid WebAudio-sípolás, ha a felhasználó engedélyezi egy kapcsolóval – alapból néma).
   **Hibás beállítások** (piros figyelmeztetés a kiírásban, és a műszeren villogó jelzés): piros zsinór a 10A-ben és feszültségforrásra (elem, 5V láb) kötve → „RÖVIDZÁR a műszeren át! Az elem / USB-port túlterhelődik, a biztosíték kiolvadhat.”;
   árammérés V/Ω aljzattal → „Áramot csak a 10A aljzattal, sorosan mérj!”; ellenállásmérés áram alatt → „Ellenállást csak áramtalanított körben mérj!”.
   HOLD: befagyasztja a kijelzést (és ezt kiírja). Alatta egy rövid magyarázó sor az aktuális helyzetről (pl. „Feszültségmérés párhuzamosan: 9,43 V, bizonytalanság ±0,125 V” – a bizonytalanságot ±(a% + 5 digit)
   szerint számold: DCV 0,8%, Ω 1,0%, A 2,0%).
   Ellenőrző számok: 9,43 V → ±0,125 V; 4,962 V → ±0,045 V; 3,301 V → ±0,031 V; 218,7 Ω → ±2,7 Ω; 9,87 kΩ → ±0,149 kΩ (felbontás 10 Ω); 13,6 mA → ±0,77 mA.
2. **`color-code`** (0.4 a) – színkód-dekóder és -kódoló, gyakorlással. Egy rajzolt ellenállás (bézs vagy kék test, 4 vagy 5 sáv), mellette sávonként színválasztó (kattintható színpaletta
   vagy legördülő; a sáv helyétől függően csak az érvényes színek: számjegy 0–9, szorzó fekete…lila + arany, ezüst; tűrés barna, piros, zöld, kék, lila, arany, ezüst). Kapcsoló: 4 sáv / 5 sáv.
   Kiírás: érték prefixummal (pl. „4,7 kΩ ±5%”), tűrési sáv („4465 Ω – 4935 Ω”), és hogy **E12-érték-e** (a szöveg E12 sora; 5%-nál E24 is elfogadható – írd ki, ha E24, de nem E12).
   **Kódoló:** írj be egy értéket (pl. „220”, „4k7”, „4,7k”, „10k”, „1M”) → megjelennek a sávok (4 és 5 sávos változat is).
   **Gyakorlás mód:** gomb „Új feladat” – véletlen E12/E24-érték, véletlen 4 vagy 5 sávos kód; a tanuló 4 lehetőség közül választ (a rossz válaszok tipikus hibákból: a szorzó harmadik jegyként,
   eggyel elcsúszott szorzó, fordított irány, 5 sávost 4 sávosként olvasva) – visszajelzés és pontszámláló. „Fordítsd meg” gomb: a sávokat fordított sorrendben mutatja (a 10 kΩ ↔ 120 Ω csapda szemléltetésére).
   A színeket valósághűen (de jól megkülönböztethetően) rajzold; minden sáv alatt/fölött a szín neve kis betűvel (barna ↔ piros ↔ narancs összetéveszthető – ez a szövegben buktató).
   Ellenőrző értékek: piros-piros-barna-arany = 220 Ω ±5% (209–231 Ω); piros-piros-fekete-fekete-barna = 220 Ω ±1%; barna-fekete-fekete-piros-barna = 10 kΩ ±1%, fordítva barna-piros-fekete-fekete-barna = 120 Ω;
   sárga-lila-piros-arany = 4,7 kΩ; barna-zöld-arany-arany = 1,5 Ω; zöld-kék-fekete-barna-barna = 5,6 kΩ; barna-szürke-sárga-ezüst = 180 kΩ ±10%.

Követelmények: magyar, tegező, rövid feliratok; a W-függvény elején `header(root, cím, alcím)`; vezérlők `div.controls`-ban, kiírás `div.readout`-ban; témaváltáskor helyes színek;
mobilon is használható (pointer események; ne csak hover; 390 px szélességen se lógjon ki semmi – a dokumentum ne legyen szélesebb a nézetnél). Számok tizedesvesszővel.
Ne használj külső könyvtárat, ne írj /tmp-be, ne commitolj, más fájlt ne módosíts.

Ellenőrzés: teszteléshez írj saját `_parts/el0/wtest2.html`-t (mintának `_parts/el1/wtest2.html`), amely betölti a `../../assets/style.css`-t, `../../assets/common.js`-t, a KaTeX-et a CDN-ről,
és egy `cat w0.js w2.js w9.js`-ből készült `wtest2-widgets.js`-t, a két widget div-jével. Playwright: `uv run -q --with playwright python -I …` (http.server egy szabad porton a synopsis gyökerében;
utána állítsd le `fuser -k <port>/tcp`-vel, NE `pkill -f`-fel). Kattintsd végig: nincs konzolhiba; az ellenőrző számok egyeznek; a hibás beállítások figyelmeztetnek.
Készíts képernyőképet `_parts/el0/shots/w2-*.png` néven (világos és sötét téma, 390 px szélesség is), és nézd meg őket.
A végén röviden jelentsd: mit csináltál és mit ellenőriztél; ha a fejezet szövegében hibát vagy a widgettel ellentmondó állítást találtál, jelezd (a HTML-t ne javítsd).
