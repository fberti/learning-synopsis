# Matematikai statisztika 6. fejezet – widget-útmutató (w2.js)

Fejezet: „Becslés: pontbecslés és konfidencia-intervallum”, végleges mappa: `matematikai-statisztika/06-becsles/` (a `_parts/ms6/build.sh`
hozza létre – te csak a `_parts/ms6/` mappában dolgozz). A szöveg részei: `_parts/ms6/01-s61.html` … `08-s68.html` – ezeket párhuzamosan
írom; ha elkészültek, olvasd el a widgeted körüli részt. Mintának nézd meg az előző fejezet kész widgetjeit: `_parts/ms5/w2.js`
(ugyanilyen stílusú, jól sikerült munka – a felépítést, a kijelzősort, a jelmagyarázatot onnan nyugodtan átveheted, de a segédeidet
`w2`-előtaggal a saját fájlodba másold).

A végleges `widgets.js`: `_parts/ms6/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/ms6/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
A `w0.js`-ben többek közt: `css, fmt(x, d), pct, groupDigits, h, btn, slider, header, makeCanvas, tallCanvas(parent, w => magasság)`
(**mindig állítsd be a `cv.draw`-t**, különben átméretezéskor üres marad a vászon), `rangeTicks, axes, vline, curve, stat, statRow, labelWrap,
sliderRow, segmented, histo, numBox, keyRow([[szöveg, színváltozó, "line"|"dash"|"box"]]), texNum(x, d), mean, sd, median, W`,
a `CI` objektum (`CI.meanZ(xbar, sigma, n, szint)`, `CI.meanT(xbar, s, n, szint)`, `CI.wald(k, n, szint)`, `CI.wilson(k, n, szint)`,
`CI.varChi(s2, n, szint)` → `[alsó, felső, félszélesség vagy kvantilisek…]`), adatok: `KONZERV` (15 töltősúly, g), `INGAZAS` (12 ingázási idő, perc).
Eloszlások: `S = window.Stat` (`assets/stat.js`): `S.normal/t/chi2/f .pdf/.cdf/.inv`, `S.binom.pmf/cdf`, `S.mulberry32, S.rnorm, S.rexp`.

Követelmények (mint eddig):
- Magyar felület, tegező, rövid. Számok magyar formátumban (`fmt`, `pct`, `groupDigits`).
- Színek csak CSS-változókból (--accent, --setA, --setB, --setC, --ok, --bad, --muted, --text, --card, --border, --bg-soft, --accent-soft);
  színt a szövegben ne nevezz meg („piros”), jelmagyarázatot használj. Világos és sötét téma.
- Reszponzív (380 px is), érintéssel is működjön. Külső könyvtár nincs. KaTeX $…$ a szövegben; később beírt szövegnél `Synopsis.renderMath(el)` vagy `statRow`.
- Szimulációnál rögzített kezdő mag, „Újra” gomb; 10 000-es ismétlés se fagyassza le a lapot.
- Teszt: `_parts/ms6/wtest2.html` (minta: `_parts/ms5/wtest2.html`, a `../../assets/stat.js` betöltésével; `wtest2-widgets.js` = `cat w0.js w2.js w9.js`).
  Helyi szerver a synopsis gyökérben, leállítás PID-del (`pkill -f`-et NE használj). Playwright headless (`uv run --with playwright python -I …`):
  nincs konzolhiba, kirajzol, működnek az interakciók; képernyőképek világos/sötét, 1280/380 px: `_parts/ms6/shots2/` – nézd is meg őket (Read), és javíts.
- Az „elvárt számokat” ellenőrizd a böngészőben és Pythonnal (`uv run -q --with scipy --with numpy python -I …`), szkriptek: `_parts/calc/wms6_*`.
- Csak a `_parts/ms6/` mappában dolgozz; /tmp-t ne használj; ne commitolj. A végén röviden jelentsd: mi készült, mit ellenőriztél, korlátok.

Jelölések: $\mu$, $\sigma$, $p$ (sokaság); $\bar x$, $s$, $\hat p$, $n$ (minta); megbízhatósági szint $1-\alpha$ (pl. 95%); hibahatár $\Delta$;
$z_{1-\alpha/2}$, $t_{n-1;\,1-\alpha/2}$, $\chi^2_{n-1;\,\alpha/2}$; konfidencia-intervallum (KI); Wald-, Wilson-intervallum; percentilis-intervallum.

---------------------------------------------------------------------------------------------------------------------------

## `ci-width` (6.3-d, #s63-d) – „Mitől széles egy intervallum?”
- Csúszkák: $\sigma$ (1–40, kezdő 10), $n$ (2–400, kezdő 15; lehet logaritmikus csúszka), megbízhatósági szint (segmented: 80, 90, 95, 99, 99,9%; kezdő 95%).
  Kapcsoló: „$\sigma$ ismert ($z$)” / „$\sigma$ ismeretlen ($t$, $s = \sigma$-val számolva)”.
- Élő képlet KaTeX-ben: $\Delta = z_{0{,}975}\cdot\dfrac{\sigma}{\sqrt n} = 1{,}960 \cdot \dfrac{10}{\sqrt{15}} = 5{,}06$ (t-módban $t_{14;\,0{,}975} = 2{,}145$).
- Ábra: a 398-as pontbecslés körüli intervallum vízszintes sávként egy 370–430 g-os skálán; halványan mellette a 90/95/99%-os sávok
  (egymás alatt), hogy látsszon: nagyobb szint → szélesebb.
- Kis „mi lenne, ha” sor: „kétszeres $n$ → $\Delta$ × 0,707”, „négyszeres $n$ → fele”.
- Elvárt: σ = 10, n = 15: 90% → 4,25; 95% → 5,06; 99% → 6,65; t-módban 95% → 5,54. σ = 10, n = 60, 95% → 2,53.

## `proportion-ci` (6.4-b, #s64-b) – „Wald vagy Wilson? – mikor hazudik a 95%”
- Két rész. **(a) Kalkulátor:** $k$ (numBox 0–n) és $n$ (numBox 1–5000), szint (90/95/99%). Kimenet: $\hat p$, Wald- és Wilson-intervallum,
  egy 0–1 skálán egymás alatt két sávként. Gombok mintapéldákhoz: „0 / 20”, „7 / 10”, „176 / 800 (rádió)”, „310 / 1000 (közvélemény-kutatás)”.
  Elvárt (95%): 0/20 → Wald [0; 0] (írd ki: „nulla szélességű – értelmetlen”), Wilson [0; 0,161]; 7/10 → Wald [0,416; 0,984], Wilson [0,397; 0,892];
  176/800 → Wald [0,191; 0,249], Wilson [0,193; 0,250]; 310/1000 → Wald [0,281; 0,339], Wilson [0,282; 0,339]. A Wald alsó határa nem lehet 0 alatti – ha a képlet
  negatívat ad, írd ki az eredetit is és jelezd („a 0 alá lógó rész értelmetlen”).
- **(b) Lefedettség:** $n$ (segmented 10, 20, 50, 100, 1000; kezdő 20). Ábra: a **pontos** lefedettség (binomiális összegzéssel, NEM szimulációval)
  $p \in [0{,}01; 0{,}99]$ függvényében (200 pont), Wald (--setB) és Wilson (--setA) görbe, vízszintes vonal 95%-nál. A $p$ fölé húzva/érintve kiírja a két értéket.
  Elvárt (95%, n = 20): p = 0,1: Wald 0,876, Wilson 0,957; p = 0,3: 0,947 / 0,975; p = 0,5: 0,959 / 0,959. n = 100, p = 0,05: Wald 0,877, Wilson 0,966.
  Egy mondat: „A Wald kis $n$-nél és szélső $p$-nél jóval 95% alatt fed le; a Wilson közel tartja a névleges szintet.”

## `sigma-ci` (6.5, #s65) – „Szórás-intervallum és a normalitás”
- **(a) Számolás:** a `KONZERV` adatokra (n = 15, s = 13,27): a $\chi^2_{14}$ sűrűségfüggvénye a két 2,5%-os farokkal árnyékolva (5,629 és 26,119), és alatta a
  kapott intervallum $\sigma$-ra: [9,71; 20,92] egy 0–30 g-os skálán, a pontbecslés (13,27) jelölve – látsszon az **aszimmetria** (a pontbecslés nincs középen).
  Szint választható (90/95/99%). Elvárt 95%: $\sigma^2 \in [94{,}3;\ 437{,}8]$, $\sigma \in [9{,}71;\ 20{,}92]$.
- **(b) Lefedettség-szimuláció:** sokaság (segmented: „normális”, „ferde (exponenciális)”, „egyenletes”), $n$ (10, 15, 30, 100), „100 minta” gomb:
  100 intervallum egymás alatt (mint a `poll-sim`), a $\sigma$-t nem lefedők --bad színnel; kijelző: lefedési arány az eddigi összes mintán.
  Elvárt (nagy ismétlésszámnál, n = 15): normális ≈ 95%, exponenciális ≈ 74%, egyenletes ≈ 99,5%. Mondat: „A khi-négyzet-intervallum csak normális sokaságnál
  tartja a 95%-ot – nagy $n$ sem segít rajta.”

## `n-planner` (6.6, #s66) – „Mintanagyság-tervező”
- Mód (segmented): „átlag” / „arány”. Átlag: $\sigma$ (numBox), kívánt hibahatár $\Delta$ (numBox), szint (90/95/99%), opcionális sokaságméret $N$ (üres = végtelen).
  Arány: becsült $p$ (numBox 0–1, kezdő 0,5; gomb „nem tudom → 0,5”), $\Delta$ százalékpontban, szint, $N$.
- Képlet élőben: $n_0 = \left(\dfrac{z\sigma}{\Delta}\right)^2$ ill. $n_0 = \dfrac{z^2 p(1-p)}{\Delta^2}$; véges $N$-nél $n = \dfrac{n_0}{1 + n_0/N}$ (= NGA $\frac{N(z\sigma)^2}{N\Delta^2 + (z\sigma)^2}$);
  eredmény **felfelé kerekítve**, nagy betűvel.
- Kis ábra: $n$ a $\Delta$ függvényében (log-log vagy egyszerű), az aktuális pont kiemelve – látsszon, hogy a fele hibához négyszeres minta kell.
- Elvárt: átlag σ = 10, Δ = 2,5, 95% → 61,47 → **62**; N = 500 mellett 54,74 → **55**. Arány p = 0,5, Δ = 3 → 1067,1 → **1068**; Δ = 2 → **2401**; Δ = 1 → **9604**;
  p = 0,31, Δ = 3 → 913,02 → **914**.

## `boot-ci` (6.7, #s67) – „Bootstrap-konfidenciaintervallum”
- Adat (segmented): „konzervek (15)”, „ingázás (12)”. Statisztika: átlag / medián / szórás. $R$: 1000 / 10 000 (gombok „+1000”, „Újra”).
- Ábra: a bootstrap-statisztikák hisztogramja, a 2,5% és 97,5% percentilis függőleges vonallal és a köztük lévő sáv árnyékolva; az eredeti statisztika jelölve.
  Átlagnál összehasonlításként a $t$-intervallum sávja alatta (más színnel, jelmagyarázattal).
- Kijelzők: eredeti statisztika, bootstrap SE, percentilis-KI, (átlagnál) $t$-KI.
- Elvárt: konzervek, átlag: $t$-KI [390,65; 405,35]; bootstrap-percentilis ≈ [391,6; 404,6] (szimulációs zajjal). Medián 395, percentilis-KI ≈ [387; 408].
  Szórás: percentilis-KI ≈ [9,0; 15,9] (vesd össze a χ²-intervallummal: [9,71; 20,92] – a bootstrap kis mintán szűkebb, ezt egy mondat jelezze).
  Ingázás, átlag: $t$-KI [17,74; 35,60]; percentilis ≈ [19,9; 35,0] – aszimmetrikus, jobbra hosszabb.
