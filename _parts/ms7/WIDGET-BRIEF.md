# Matematikai statisztika 7. fejezet – widget-útmutató (w2.js)

Fejezet: „A hipotézisvizsgálat logikája”, végleges mappa: `matematikai-statisztika/07-hipotezisvizsgalat/` (a `_parts/ms7/build.sh` hozza létre –
te csak a `_parts/ms7/` mappában dolgozz). A szöveg részei: `_parts/ms7/01-s71.html` … `09-s79.html` – ezeket párhuzamosan írom; ha elkészültek,
olvasd el a widgeted körüli részt. Stílusminta (jól sikerült, ugyanilyen kell): `_parts/ms6/w2.js` és `_parts/ms5/w2.js` – a felépítést, a kijelzősort,
a jelmagyarázatot onnan nyugodtan átveheted, de a segédeidet `w2`-előtaggal a saját fájlodba másold.

A végleges `widgets.js`: `_parts/ms7/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/ms7/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
A `w0.js`-ben többek közt: `css, fmt, pct, groupDigits, h, btn, slider, header, makeCanvas, tallCanvas(parent, w => magasság)` (**mindig állítsd be
a `cv.draw`-t**), `rangeTicks, axes, vline, curve, stat, statRow, labelWrap, sliderRow, segmented, histo, numBox, keyRow, texNum, mean, sd, median, W`.
Eloszlások: `S = window.Stat` (`assets/stat.js`): `S.normal/t/chi2/f .pdf/.cdf/.inv`, `S.binom.pmf/cdf`, `S.mulberry32, S.rnorm, S.rexp`.

Követelmények (mint eddig): magyar, tegező, rövid felület; magyar számformátum; színek csak CSS-változókból (--accent, --setA, --setB, --setC, --ok, --bad,
--muted, --text, --card, --border, --bg-soft, --accent-soft), színt a szövegben ne nevezz meg; világos és sötét téma; 380 px-en is használható, érintéssel is;
külső könyvtár nincs; rögzített kezdő mag + „Újra”; nagy ismétlésszám se fagyassza le a lapot.
Teszt: `_parts/ms7/wtest2.html` (minta: `_parts/ms6/wtest2.html`, `../../assets/stat.js` betöltésével; `wtest2-widgets.js` = `cat w0.js w2.js w9.js`).
Helyi szerver, leállítás PID-del (`pkill -f`-et NE használj). Playwright headless; képernyőképek világos/sötét, 1280/380 px: `_parts/ms7/shots2/` – nézd meg
őket (Read), és javíts. Az elvárt számokat ellenőrizd böngészőben és Pythonnal (`uv run -q --with scipy --with numpy python -I …`), szkriptek: `_parts/calc/wms7_*`.
Csak a `_parts/ms7/` mappában dolgozz; /tmp-t ne használj; ne commitolj. A végén röviden jelentsd: mi készült, mit ellenőriztél, korlátok.

Jelölések: nullhipotézis $H_0$, ellenhipotézis $H_1$; próbastatisztika; szignifikanciaszint $\alpha$; kritikus tartomány, elfogadási tartomány; p-érték;
elsőfajú hiba ($\alpha$), másodfajú hiba ($\beta$), próbaerő $1-\beta$; egyoldali / kétoldali próba; „$H_0$-t elvetjük” / „nem vetjük el” (NE „elfogadjuk”).

---------------------------------------------------------------------------------------------------------------------------

## `binom-test` (7.2-a, #s72-a) – „Cinkelt-e az érme? – kritikus tartomány”
- $H_0$: $p = 0{,}5$, $n$ dobás (segmented 10, 20, 50, 100; kezdő 100). $\alpha$ (segmented 10%, 5%, 1%; kezdő 5%). Próba típusa (segmented): kétoldali / jobboldali
  ($H_1: p \gt 0{,}5$) / baloldali.
- Ábra: a $\mathrm{Bin}(n; 0{,}5)$ oszlopdiagramja. A kritikus tartomány oszlopai más színnel (--bad); a kritikus tartományt úgy válaszd, hogy a valószínűsége
  **legfeljebb** $\alpha$ legyen (kétoldalinál szimmetrikusan, mindkét farokban legfeljebb $\alpha/2$). Kiírja: „kritikus tartomány: $X \le 39$ vagy $X \ge 61$”,
  és a **tényleges** elsőfajú hibavalószínűséget (diszkrét eloszlásnál kisebb a névlegesnél).
- Csúszka: megfigyelt fejek száma $k$ (kezdő 60). Jelöld az ábrán; kijelző: p-érték (az adott oldalúság szerint; kétoldalinál a két farok összege, szimmetrikusan:
  $2\cdot P(X \ge k)$ ha $k \gt n/2$), döntés („$H_0$-t 5%-on elvetjük” / „nem vetjük el”).
- Gomb: „Dobj 100-at egy szabályos érmével” (véletlen $k$).
- Elvárt ($n = 100$, $\alpha = 5\%$): kétoldali kritikus tartomány $X \le 39$ vagy $X \ge 61$, tényleges $\alpha = 3{,}52\%$; jobboldali: $X \ge 59$, tényleges 4,43%.
  $k = 60$: kétoldali p = 0,0569 (nem vetjük el), jobboldali p = 0,0284 (elvetjük). $k = 61$: kétoldali p = 0,0352.

## `p-dance` (7.3-c, #s73-c) – „A táncoló p-érték”
- Kísérlet: két csoport, csoportonként $n$ fő (segmented 16, 32, 64, 128; kezdő 32), a valódi hatás $d$ (Cohen-féle, segmented 0; 0,2; 0,5; 0,8; kezdő 0,5).
  Mindkét csoport normális, szórás 1; a kezelt átlaga $d$. Minden „ismétlés” kétmintás $t$-próbát számol (egyenlő szórás, df = $2n - 2$), kétoldali p-érték (`S.t.cdf`).
- Gombok: „1 ismétlés”, „+25”, „Ürít”. Ábra: az utolsó 25 ismétlés p-értéke pontként egy **logaritmikus** p-tengelyen (0,0001 … 1), egymás alatt (vagy idővonalként),
  függőleges vonal 0,05-nél; a 0,05 alattiak --ok/--setC, a többi --muted. Jelmagyarázat.
- Kijelzők: eddigi ismétlések száma, hány % lett p &lt; 0,05 (szimulált erő), az elméleti erő (közelítés: normálissal $1 - \Phi(1{,}96 - d\sqrt{n/2}) + \Phi(-1{,}96 - d\sqrt{n/2})$
  – vagy pontosabban nemcentrális t helyett elég a normális közelítés, írd ki, hogy közelítés), a p-értékek 10–50–90%-os percentilise.
- Elvárt ($n = 32$, $d = 0{,}5$): erő ≈ 50% (normális közelítés 51,6%, pontos 50,4%); a p-értékek mediánja ≈ 0,05, 10%-os percentilise ≈ 0,0014, 90%-os ≈ 0,46.
  $d = 0$: kb. 5% p &lt; 0,05. Mondat: „Ugyanaz a kísérlet, ugyanaz a valódi hatás – a p-érték mégis 0,001 és 0,5 között ugrál.”

## `permutation-test` (7.6-b, #s76-b) – „Permutációs próba: keverjük össze a címkéket!”
- Két adatkészlet (segmented): **kicsi:** új módszer 7, 9, 11 – régi módszer 3, 5, 4 (pontszámok); **nagyobb:** A = 72, 75, 78, 80, 81, 83, 85, 90;
  B = 65, 68, 70, 72, 74, 76, 79, 82. Statisztika: az átlagok különbsége (A − B).
- Felül: a pöttyök két sorban (két szín), alattuk a megfigyelt különbség. „1 keverés” gomb: animálva (vagy kiemeléssel) véletlenül újraosztja a címkéket
  (ugyanannyi A és B), kiírja az új különbséget, és hozzáadja a hisztogramhoz. „+1000 keverés”, „Ürít”. A kicsinél „Mind a 20 felsorolása” gomb (pontos eloszlás);
  a nagyobbnál „Pontos (12 870 felosztás)” gomb – ezt egy menetben ki lehet számolni.
- Ábra: a keverésekből kapott különbségek hisztogramja, a megfigyelt különbség függőleges vonallal, a nála nagyobb-egyenlő oszlopok kiemelve.
- Kijelzők: megfigyelt különbség, keverések száma, egyoldali p (≥ megfigyelt), kétoldali p (|különbség| ≥ |megfigyelt|).
- Elvárt: kicsi: megfigyelt 5,00; pontos eloszlásban 1/20 felosztás ≥ 5 → egyoldali p = 0,05, kétoldali 0,10. Nagyobb: megfigyelt 7,25; pontos egyoldali p = 173/12 870 = 0,0134,
  kétoldali 0,0269 (összevetésül a kétmintás $t$-próba: egyoldali 0,0115, kétoldali 0,0230 – ezt is írd ki kis betűvel).

## `p-hacking` (7.7-a, #s77-a) – „20 kísérlet, egyik sem hat – mégis találat”
- 20 „zselécukor-szín” (vagy egyszerűen 20 kísérlet: szín nevek: piros helyett a szöveg ne nevezzen színt – legyen „1. változat … 20. változat”, vagy ízek:
  citrom, eper, menta, …). Mindegyik kísérletben NINCS valódi hatás: két csoport, csoportonként 30 fő, $N(0,1)$, kétmintás t-próba (vagy z), p-érték.
- „Új kutatás” gomb: 20 új p-érték. Ábra: 20 oszlop / pont a p-értékekkel (logaritmikus tengely), vonal $\alpha = 0{,}05$-nél; „Bonferroni” kapcsoló: a vonal $0{,}05/20 = 0{,}0025$-re
  ugrik. A küszöb alattiak kiemelve, felirattal: „TALÁLAT! – a … íz hat (p = 0,03)”.
- Kijelzők: hány „találat” ebben a kutatásban; „+100 kutatás” után: a kutatások hány %-ában volt legalább 1 találat (elméleti: $1 - 0{,}95^{20} = 64{,}2\%$; Bonferronival
  $1 - 0{,}9975^{20} \approx 4{,}9\%$).
- Elvárt: elméleti 64,2% és 4,9%; találatok átlagos száma 1,0 (Bonferronival 0,05). Mondat: „Ha elég sok mindent kipróbálsz, a véletlen is »felfedez« valamit.”
