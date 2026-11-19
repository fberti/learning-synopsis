# Matematikai statisztika 9. fejezet – widget-útmutató (w1.js és w2.js)

Fejezet: „Khi-négyzet-próbák és nemparaméteres módszerek”, végleges mappa: `matematikai-statisztika/09-khi-negyzet-es-nemparameteres-probak/`
(a `_parts/ms9/build.sh` hozza létre – te csak a `_parts/ms9/` mappában dolgozz). A szöveg részei (`_parts/ms9/01-s91.html` … `08-s98.html`) most készülnek
párhuzamosan; ha elkészültek, olvasd el a widgeted körüli részt, és igazítsd hozzá a feliratokat. Stílusminta (jól sikerült, ugyanilyen kell):
`_parts/ms8/w2.js` és `_parts/ms7/w2.js` – a felépítést, a kijelzősort, a jelmagyarázatot onnan nyugodtan átveheted, de a segédeidet a saját
előtagoddal (`w1…` vagy `w2…`) a saját fájlodba másold.

A végleges `widgets.js`: `_parts/ms9/w0.js` (közös segédek, NE módosítsd) + `w1.js` + `w2.js` + `w9.js` (indítás). Két ember dolgozik párhuzamosan:
**az egyik csak a `w1.js`-t, a másik csak a `w2.js`-t írja** (lásd lent a feladatmegosztást). A fájlod csak `W["név"] = root => { … };` definíciókat és saját,
előtagos segédeket tartalmazhat (a két fájl ugyanabba az IIFE-be kerül, névütközés ne legyen!).
A `w0.js`-ben többek közt: `css, fmt, pct, groupDigits, h, btn, slider, header, makeCanvas, tallCanvas(parent, w => magasság)` (**mindig állítsd be
a `cv.draw`-t**), `rangeTicks, axes, vline, curve, stat, statRow, labelWrap, sliderRow, segmented, histo, numBox, keyRow, texNum, mean, sd, median, ranks, sorted, sum, mulberry32, normal, W`.
Eloszlások: `S = window.Stat` (`assets/stat.js`): `S.normal/t/chi2/f .pdf/.cdf/.inv`, `S.binom.pmf/cdf/sf`, `S.mulberry32, S.rnorm, S.rexp`.
(Hipergeometrikus eloszlás nincs benne – számold logaritmikus binomiális együtthatókkal a saját fájlodban.)

Követelmények (mint eddig): magyar, tegező, rövid felület; magyar számformátum (tizedesvessző, ezres tagolás szóközzel); színek csak CSS-változókból
(--accent, --setA, --setB, --setC, --ok, --bad, --muted, --text, --card, --border, --bg-soft, --accent-soft), színt a szövegben ne nevezz meg; világos és sötét
téma; 380 px-en is használható, érintéssel is; külső könyvtár nincs; rögzített kezdő mag + „Újra”; nagy ismétlésszám se fagyassza le a lapot (darabolt
számolás `requestAnimationFrame`/`setTimeout`-tal, ha kell). Szerkeszthető táblázatcellákhoz a `numBox` jó.
Teszt: `_parts/ms9/wtest1.html` ill. `wtest2.html` (minta: `_parts/ms8/wtest2.html`, `../../assets/stat.js` betöltésével; `wtestN-widgets.js` = `cat w0.js wN.js w9.js`).
Helyi szerver, leállítás PID-del (`pkill -f`-et NE használj). Playwright headless (`uv run -q --with playwright python -I …`); képernyőképek világos/sötét,
1280/380 px: `_parts/ms9/shots1/` (w1) ill. `_parts/ms9/shots2/` (w2) – nézd meg őket (Read), és javíts. Az elvárt számokat ellenőrizd böngészőben és
Pythonnal (`uv run -q --with scipy --with numpy python -I …`), szkriptek: `_parts/calc/wms9_1_*` ill. `_parts/calc/wms9_2_*`.
Csak a saját fájljaidban dolgozz; /tmp-t ne használj; ne commitolj. A végén röviden jelentsd: mi készült, mit ellenőriztél, korlátok.

Jelölések: nullhipotézis $H_0$, ellenhipotézis $H_1$; próbastatisztika; szignifikanciaszint $\alpha$; kritikus érték; p-érték; tényleges (megfigyelt)
gyakoriság $f$ (illeszkedésnél $f_i$), várt (elméleti) gyakoriság $f^*$ (illeszkedésnél $np_i$), $\chi^2 = \sum (f - f^*)^2/f^*$; szabadságfok ($df$);
standardizált eltérés (Pearson-reziduum) $(f - f^*)/\sqrt{f^*}$; Cramér-féle $V$; „$H_0$-t elvetjük” / „nem vetjük el” (NE „elfogadjuk”). Rangpróbák:
rang, rangösszeg, előjelpróba, Wilcoxon-féle előjeles rangpróba ($W_+$, $W_-$), Mann–Whitney-féle $U$-próba ($U$), kötés (azonos értékek → átlagrang);
Kolmogorov–Szmirnov-próba, empirikus eloszlásfüggvény $F_n$, legnagyobb eltérés $D$.

---------------------------------------------------------------------------------------------------------------------------

# w1.js (első munkatárs): `chi-square-dice`, `independence-table`, `fisher-exact`

## `chi-square-dice` (9.1-b, #s91-b) – „Lebukik-e a cinkelt kocka?”
- Kocka, amelynél a 6-os valószínűsége $q$ (csúszka 1/6 … 0,40, kezdő **1/6 ≈ 0,167** = szabályos; gombok „szabályos”, „cinkelt: 0,25”), a többi öt lap egyenként $(1-q)/5$.
- Gombok: „+1 dobás”, „+10”, „+60”, „Újra” (rögzített mag). Ábra: hat oszlop – megfigyelt gyakoriságok $f_i$, mellettük/rajtuk vízszintes vonal a várt $n/6$-nál;
  az oszlopok alatt (vagy tooltipben) a cellánkénti hozzájárulás $(f_i - n/6)^2/(n/6)$.
- Kijelzők: dobások száma $n$, $\chi^2$, $df = 5$, p-érték (`1 - S.chi2.cdf(x, 5)`), kritikus érték 11,07 (5%), döntés („elvetjük” / „nem vetjük el”).
  Ha $n/6 \lt 5$ (azaz $n \lt 30$), figyelmeztetés: „A várt gyakoriság 5 alatt van – a χ²-közelítés még nem megbízható.”
- Második rész: „Szimuláld 2000-szer” – adott $q$ és $n$ (segmented 60, 120, 300, 600) mellett a kísérletek hány %-ában vetjük el $H_0$-t 5%-on (ez szabályos kockánál a téves riasztás, cinkeltnél a próbaerő).
  Elvárt (Python, 20 000 ismétlés): $q = 1/6$, $n = 60$: ≈ 4,8%; $q = 0{,}25$: $n = 60$ → 22%, 120 → 42%, 300 → 83%, 600 → 99%; $q = 0{,}30$: 60 → 50%, 120 → 82%, 300 → 99,7%.
- Mondat: „Kis cinkelést csak sok dobással lehet lebuktatni – a χ²-próba ereje is a mintanagyságon múlik.”

## `independence-table` (9.3-c, #s93-c) – „Függetlenségvizsgálat: hol tér el a tábla?”
- Szerkeszthető kontingencia-tábla (2×2, 2×3, 3×3; sor- és oszlopszám segmented-del vagy előbeállítással), cellánként `numBox` (egész ≥ 0), peremösszegek kiírva.
- Előbeállítások (segmented): „dohányzás × nem” [[30,70],[20,80]] (sorok: férfi, nő; oszlopok: dohányzik, nem) – **kezdő**; „ugyanez kétszer” [[60,140],[40,160]];
  „lakóhely × párt” [[90,60,50],[100,90,60],[40,70,40]] (sorok: Budapest, város, község; oszlopok: A párt, B párt, C párt); „50 cég” [[18,2],[5,25]]
  (sorok: textilipar, élelmiszeripar; oszlopok: volt bírság, nem volt); „kis klinikai minta” [[7,1],[2,6]] (sorok: új kezelés, placebo; oszlopok: gyógyult, nem).
- Minden cellában: tényleges $f$, alatta kisebben a várt $f^*$ (2 tizedes), és a cella háttere a **standardizált eltérés** $(f - f^*)/\sqrt{f^*}$ szerint színezve
  (pozitív → egyik szín, negatív → másik, a telítettség az abszolút értékkel nő, |érték| ≥ 2 erősen kiemelve). Jelmagyarázat: „felülreprezentált / alulreprezentált”.
  Kapcsoló: a cellában a standardizált eltérés vagy a χ²-hozzájárulás $(f - f^*)^2/f^*$ jelenjen meg.
- Kijelzők: $N$, $\chi^2$, $df = (b-1)(c-1)$, p-érték, Cramér-féle $V = \sqrt{\chi^2 / (N\min(b-1, c-1))}$, döntés 5%-on. Ha bármelyik $f^* \lt 5$: figyelmeztetés
  („Van 5-nél kisebb várt gyakoriság – 2×2-es táblánál használd Fisher egzakt próbáját (9.4).”).
- Elvárt: dohányzás × nem $\chi^2 = 2{,}67$, $df = 1$, $p = 0{,}10$, $V = 0{,}115$ (várt 25, 75, 25, 75); kétszer: $5{,}33$, $p = 0{,}021$, $V$ ugyanaz;
  lakóhely × párt $\chi^2 = 14{,}64$, $df = 4$, $p = 0{,}0055$, $V = 0{,}110$; várt Budapest 76,67 | 73,33 | 50; város 95,83 | 91,67 | 62,5; község 57,5 | 55 | 37,5;
  standardizált eltérések: Budapest +1,52 | −1,56 | 0; város +0,43 | −0,17 | −0,32; község **−2,31 | +2,02** | +0,41;
  50 cég $\chi^2 = 25{,}98$, $p \lt 0{,}0001$, $V = 0{,}72$ (várt 9,2 | 10,8 | 13,8 | 16,2); klinikai $\chi^2 = 6{,}35$, $p = 0{,}012$ + figyelmeztetés (várt 4,5 | 3,5 | 4,5 | 3,5).
  (Folytonossági korrekció nélkül számolj – ezt a szöveg külön tárgyalja.)

## `fisher-exact` (9.4-b, #s94-b) – „Fisher egzakt próbája: minden tábla a rögzített peremekkel”
- 2×2-es tábla $a, b / c, d$ (`numBox`, 0–30), peremek kiírva. Rögzített peremek mellett a bal felső cella $X$ lehetséges értékei $\max(0, r_1 + c_1 - N) … \min(r_1, c_1)$;
  $P(X = k) = \binom{c_1}{k}\binom{N - c_1}{r_1 - k} / \binom{N}{r_1}$ (hipergeometrikus).
- Ábra: oszlopdiagram $P(X = k)$-ról minden lehetséges $k$-ra; a megfigyelt $k$ kiemelve; a kétoldali p-értékbe számító oszlopok (amelyekre
  $P(X = k) \le P(X = k_{\text{megf}})\cdot(1 + 10^{-7})$) más színnel. Minden $k$ alá kis felirat a hozzá tartozó tábla bal felső cellájáról (vagy tooltip a teljes táblával).
- Kijelzők: egyoldali p (a megfigyelt irányban: $P(X \ge k)$, ha $k$ a várt fölött van, különben $P(X \le k)$), kétoldali p (a fenti szabály szerint – ez a scipy/R módszere),
  és összevetésül a χ²-próba p-értéke (korrekció nélkül és Yates-korrekcióval), valamint a legkisebb várt gyakoriság, figyelmeztetéssel, ha 5 alatt van.
- Előbeállítások: „teás hölgy (8 csésze)” [[4,0],[0,4]] (sorok: valóban tej előbb / tea előbb; oszlopok: hölgy szerint tej / tea) – egyoldali 1/70 = 0,014, kétoldali 0,029;
  „6 csésze” [[3,0],[0,3]] – egyoldali 0,05, kétoldali 0,10, eloszlás 1, 9, 9, 1 (/20); **„kis klinikai minta” [[7,1],[2,6]] – kezdő**: eloszlás $k = 1…8$: 9, 252, 1764, 4410, 4410, 1764, 252, 9 (/12 870),
  egyoldali $P(X \ge 7) = 0{,}020$, kétoldali 0,041; χ² korrekció nélkül 6,35 ($p = 0{,}012$), Yates 4,06 ($p = 0{,}044$); legkisebb várt 3,5.
- Mondat: „Fisher próbája nem közelít: a rögzített peremek mellett az összes lehetséges táblát számba veszi – ezért kis mintán is pontos.”

---------------------------------------------------------------------------------------------------------------------------

# w2.js (második munkatárs): `rank-test`, `ecdf-ks`, `benford`

## `rank-test` (9.6-c, #s96-c) – „Rangpróba vagy t-próba? – egy kiugró érték hatása”
- Két csoport pontjai egy közös számegyenesen (két sorban, A és B, más színnel), minden pont fölött a **rangja** a 16 adat között (kötésnél átlagrang).
  Kezdő adatok (a 7.6 permutációs példájából): A = 72, 75, 78, 80, 81, 83, 85, 90; B = 65, 68, 70, 72, 74, 76, 79, 82.
- Csúszka: „A legnagyobb A-érték” 90 … 200 (lépés 1). Opcionálisan: a pontok húzhatók (egérrel és érintéssel), de a csúszka kötelező.
- Kijelzők két oszlopban: **t-próba** (közös szórásos, kétoldali; mellette Welch is): $\bar x_A$, $\bar x_B$, $t$, $p$; **Mann–Whitney**: $R_A$ (A rangösszege), $U_A = R_A - n_A(n_A+1)/2$,
  $U/(n_A n_B)$ („valószínűségi fölény”: annak becslése, hogy egy véletlen A-érték nagyobb egy véletlen B-nél), p-érték normális közelítéssel
  (kötéskorrekcióval a varianciában és folytonossági korrekcióval – a scipy `mannwhitneyu(method="asymptotic")` alapértelmezése), és ha nincs kötés és $n_A, n_B \le 10$, pontos p is (felsorolással vagy dinamikus programozással).
- Elvárt: kezdetben $t = 2{,}55$, $df = 14$, $p = 0{,}023$ (Welch ugyanígy, $df \approx 14{,}0$); $R_A = 88{,}5$, $U_A = 52{,}5$, $U/64 = 0{,}82$, MW $p = 0{,}036$ (közelítés; a pontos, kötéses permutációs érték 0,030, a scipy „exact” 0,038).
  A legnagyobb A-érték 150: $t = 1{,}60$, $p = 0{,}13$ (Welch $p = 0{,}149$) – a **MW változatlan** ($U = 52{,}5$, $p = 0{,}036$), mert a rangok nem változnak.
- Egy kis ábra vagy sáv mutassa a két p-értéket a csúszka függvényében (opcionális), vagy legalább egy mondat a kijelző alatt: „A kiugró érték felfújja a szórást, a t-próba elveszíti
  a különbséget; a rangpróba csak azt látja, hogy ez az érték a legnagyobb – ami eddig is igaz volt.”

## `ecdf-ks` (9.7-a/b, #s97-b) – „Empirikus eloszlásfüggvény és a Kolmogorov–Szmirnov-távolság”
- Lépcsős empirikus eloszlásfüggvény $F_n$ és egy elméleti eloszlásfüggvény $F$ egy ábrán; a legnagyobb függőleges eltérés $D = \sup |F_n(x) - F(x)|$ helye vastag szakasszal kiemelve
  (az ugrás melyik oldalán – vegyél figyelembe mindkét oldalt: $i/n - F(x_{(i)})$ és $F(x_{(i)}) - (i-1)/n$).
- Mód (segmented): **egymintás** (adat vs. $N(\mu, \sigma)$, a $\mu$, $\sigma$ megadható `numBox`-szal) és **kétmintás** (két lépcsős függvény, $D$ köztük).
- Egymintás adatforrások (segmented): „4 zacskó” (488, 497, 499, 500 vs $N(500, 10)$) – **kezdő**; „véletlen minta” – $n$ (10, 25, 100) elemű minta normális / exponenciális / egyenletes
  eloszlásból (azonos várható értékkel és szórással, mint az elméleti normális – így látszik, mikor buktatja le a próba), „Új minta” gomb, rögzített mag.
- Kijelzők: $n$, $D$, a kritikus érték 5%-on (pontos: Kolmogorov-eloszlásból; elég táblázat: $n$ = 4 → 0,624; 5 → 0,563; 10 → 0,409; 20 → 0,294; 25 → 0,264; 50 → 0,188; egyéb $n$-re $1{,}358/\sqrt n$),
  p-érték (aszimptotikus Kolmogorov-képlet $Q(\lambda) = 2\sum_{k\ge1}(-1)^{k-1}e^{-2k^2\lambda^2}$, $\lambda = (\sqrt n + 0{,}12 + 0{,}11/\sqrt n)\,D$ – írd ki, hogy közelítés), döntés.
- Elvárt: 4 zacskó $D = 0{,}50$ (az 500-nál: $F_n = 1$, $F = 0{,}5$), kritikus 0,624, nem vetjük el (pontos $p = 0{,}19$; a közelítés ettől eltérhet, az rendben van).
  Kétmintás: a 8+8 adat (A, B a `rank-test`-ből): $D = 0{,}5$, pontos $p = 0{,}28$ (kétmintás kritikus érték $n = m = 8$-nál 5%-on: 0,625 – ehhez írj megjegyzést: „a KS a helyeltolódásra kevésbé érzékeny, mint a Mann–Whitney”).
- Figyelmeztető sor: „Ha $\mu$-t és $\sigma$-t a mintából becsülöd, a kritikus értékek kisebbek (Lilliefors-próba) – ez a widget ismert paraméterekkel számol.”

## `benford` (9.8-b, #s98-b) – „Benford-törvény: melyik számjeggyel kezdődnek a számok?”
- Benford: $P(d) = \log_{10}(1 + 1/d)$: 30,1 | 17,6 | 12,5 | 9,7 | 7,9 | 6,7 | 5,8 | 5,1 | 4,6%.
- Adatkészletek (segmented): „2 hatványai” ($2^1 … 2^{1000}$, első számjegyek: 301, 176, 125, 97, 79, 69, 56, 52, 45 – számold BigInt-tel vagy logaritmussal: $\{k \log_{10} 2\}$ törtrésze);
  „Fibonacci-számok” (az első 1000: 301, 177, 125, 96, 80, 67, 56, 53, 45); „számlaösszegek” (szimulált: lognormális, $\ln X \sim N(10, 1{,}5)$, $n$ = 500, rögzített mag, „Új minta”);
  „egyenletes véletlen 1–9999” (szimulált, $n$ = 500 – itt NEM teljesül); „kitalált számlák” (rögzített gyakoriságok, $n = 200$: 30, 28, 24, 22, 22, 20, 19, 18, 17 – **kezdő**);
  „saját adatok” (textarea: számok szóközzel/sortöréssel elválasztva; a 0-t és a nem számokat hagyd ki; tizedes tört is lehet – az első nem nulla számjegy számít).
- Ábra: kilenc oszlop a megfigyelt relatív gyakorisággal, rajta pontok/vonal a Benford-értékekkel. Kijelzők: $n$, $\chi^2$ ($df = 8$), p-érték, döntés 5%-on (kritikus 15,51),
  és ha van 5-nél kisebb várt gyakoriság, figyelmeztetés.
- Elvárt: kitalált számlák $\chi^2 = 40{,}04$, $p \approx 3 \cdot 10^{-6}$ (várt 60,2 | 35,2 | 25,0 | 19,4 | 15,8 | 13,4 | 11,6 | 10,2 | 9,2; a legnagyobb hozzájárulás az 1-es: 15,15);
  2 hatványai ($n$ = 1000): nagyon kicsi $\chi^2$ (nagy p). Mondat: „Ahol a számok sok nagyságrendet fognak át és szorzódó hatások alakítják őket, ott a kis kezdő számjegyek gyakoribbak.
  A kitalált számok gyakran túl egyenletesek.”
