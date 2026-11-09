# Matematikai statisztika 8. fejezet – widget-útmutató (w2.js)

Fejezet: „Paraméteres próbák: u-, t- és F-próba”, végleges mappa: `matematikai-statisztika/08-parameteres-probak/` (a `_parts/ms8/build.sh` hozza
létre – te csak a `_parts/ms8/` mappában dolgozz). A szöveg részei: `_parts/ms8/01-s81.html` … `09-s89.html` – ezeket párhuzamosan írom; ha elkészültek,
olvasd el a widgeted körüli részt. Stílusminta (jól sikerült, ugyanilyen kell): `_parts/ms7/w2.js` és `_parts/ms6/w2.js` – a felépítést, a kijelzősort,
a jelmagyarázatot onnan nyugodtan átveheted, de a segédeidet `w2`-előtaggal a saját fájlodba másold.

A végleges `widgets.js`: `_parts/ms8/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/ms8/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
A `w0.js`-ben többek közt: `css, fmt, pct, groupDigits, h, btn, slider, header, makeCanvas, tallCanvas(parent, w => magasság)` (**mindig állítsd be
a `cv.draw`-t**), `rangeTicks, axes, vline, curve, stat, statRow, labelWrap, sliderRow, segmented, histo, numBox, keyRow, texNum, mean, sd, median, W`.
Eloszlások: `S = window.Stat` (`assets/stat.js`): `S.normal/t/chi2/f .pdf/.cdf/.inv`, `S.binom.pmf/cdf/sf`, `S.mulberry32, S.rnorm, S.rexp`.

Követelmények (mint eddig): magyar, tegező, rövid felület; magyar számformátum; színek csak CSS-változókból (--accent, --setA, --setB, --setC, --ok, --bad,
--muted, --text, --card, --border, --bg-soft, --accent-soft), színt a szövegben ne nevezz meg; világos és sötét téma; 380 px-en is használható, érintéssel is;
külső könyvtár nincs; rögzített kezdő mag + „Újra”; nagy ismétlésszám se fagyassza le a lapot (darabolt számolás `requestAnimationFrame`/`setTimeout`-tal, ha kell).
Teszt: `_parts/ms8/wtest2.html` (minta: `_parts/ms7/wtest2.html`, `../../assets/stat.js` betöltésével; `wtest2-widgets.js` = `cat w0.js w2.js w9.js`).
Helyi szerver, leállítás PID-del (`pkill -f`-et NE használj). Playwright headless (`uv run -q --with playwright python -I …`); képernyőképek világos/sötét,
1280/380 px: `_parts/ms8/shots2/` – nézd meg őket (Read), és javíts. Az elvárt számokat ellenőrizd böngészőben és Pythonnal
(`uv run -q --with scipy --with numpy python -I …`), szkriptek: `_parts/calc/wms8_*`.
Csak a `_parts/ms8/` mappában (és `_parts/calc/wms8_*`) dolgozz; /tmp-t ne használj; ne commitolj. A végén röviden jelentsd: mi készült, mit ellenőriztél, korlátok.

Jelölések: nullhipotézis $H_0$, ellenhipotézis $H_1$; próbastatisztika; szignifikanciaszint $\alpha$; kritikus érték; p-érték; elsőfajú hiba ($\alpha$),
másodfajú hiba ($\beta$), próbaerő $1-\beta$; „$H_0$-t elvetjük” / „nem vetjük el” (NE „elfogadjuk”). u-próba (= angol z-test), t-próba, Welch-próba,
F-próba; közös (súlyozott) szórásnégyzet $s_p^2$; szabadságfok (df). Tizedesvessző, ezres tagolás szóközzel.

---------------------------------------------------------------------------------------------------------------------------

## `welch-sim` (8.5-c, #s85-c) – „Közös szórás vagy Welch? – szimuláció igaz $H_0$ mellett”
- Két normális csoport, **azonos várható érték** ($H_0$ igaz). Beállítás: $n_1$, $\sigma_1$, $n_2$, $\sigma_2$ (segmented előbeállítások + csúszkák):
  előbeállítások: „egyforma” (10, 1, 10, 1), „eltérő szórás, egyforma n” (10, 3, 10, 1), „kis csoport nagy szórással” (5, 10, 20, 3),
  „nagy csoport nagy szórással” (20, 10, 5, 3). Kezdő: „kis csoport nagy szórással”.
- Minden ismétlésben mindkét próba: közös szórásnégyzetes t ($df = n_1+n_2-2$) és Welch ($df$ Welch–Satterthwaite), kétoldali, $\alpha = 5\%$.
- Gombok: „1 kísérlet”, „+1000”, „+10 000”, „Újra”. Ábra: két oszlop (vagy két vízszintes sáv) a téves elvetések arányával, vízszintes vonal 5%-nál;
  esetleg az utolsó kísérlet két p-értéke. Kijelzők: kísérletek száma, téves elvetés aránya (közös szórással / Welch), az utolsó kísérlet $t$, $df$, $p$ mindkettővel.
- Elvárt (Python, 40 000 ismétlés): (5, 10, 20, 3): közös 28%, Welch 5,1%; (20, 10, 5, 3): közös 0,2% (túl óvatos → kis erő), Welch 4,8%;
  (10, 1, 10, 1): 5,0% / 4,9%; (10, 3, 10, 1): 5,9% / 5,1%. Mondat: „Ha a kisebb csoport szórása nagyobb, a közös szórásos próba sokszor riaszt tévesen; Welch szinte mindig tartja az 5%-ot.”

## `f-test-sim` (8.6-c, #s86-c) – „Az F-próba érzékeny a normalitásra”
- Két csoport ugyanabból az eloszlásból (azonos szórás → $H_0$ igaz), $n$ csoportonként (segmented 10, 25, 100; kezdő 25). Eloszlás (segmented): normális,
  csúcsos ($t_5$, standardizálás nem kell, mindkét csoport ugyanaz), ferde (exponenciális), egyenletes. Kétoldali F-próba, $\alpha = 5\%$:
  $p = 2\min(F_{cdf}, 1 - F_{cdf})$.
- Kicsi ábra az eloszlás alakjáról (sűrűségfüggvény), nagyobb ábra: a szimulált F-értékek hisztogramja (log-skálán vagy levágva) az elméleti $F_{n-1,n-1}$ sűrűséggel,
  a két kritikus érték függőleges vonallal. Gombok: „+1000”, „+10 000”, „Újra”. Kijelző: téves elvetések aránya (névleges 5%).
- Elvárt (40 000 ismétlés), $n = 10 / 25 / 100$: normális 5,1 / 4,9 / 5,1%; $t_5$ 12,9 / 16,9 / 21,7%; exponenciális 23 / 28 / 31%; egyenletes 1,0 / 0,4 / 0,3%.
  Mondat: „Nagyobb mintával nem javul, sőt romlik: a hiba nem a minta kicsiségéből, hanem a nem normális alakból jön.” (Az átlagok t-próbájánál fordítva: a CHT segít.)

## `ab-test` (8.7-c, #s87-c) – „A/B-teszt élőben – és a belenézés csapdája”
- Két oldalváltozat, valódi vásárlási arány $p_A$, $p_B$ (csúszkák 1–30%, kezdő **mindkettő 10%**, azaz $H_0$ igaz; gomb „B valóban jobb: 15%”).
  Látogatók érkeznek (gomb „+100 látogató változatonként”, „Futtasd 2000-ig” animálva, „Újra”).
- Élő kijelzők: $n$, vásárlók, $\hat p_A$, $\hat p_B$, különbség, két arány $z$-próbája közös aránnyal ($\hat p = (k_A+k_B)/(n_A+n_B)$, $\mathrm{SE} = \sqrt{\hat p(1-\hat p)(1/n_A + 1/n_B)}$), kétoldali p.
- Ábra: a p-érték útja $n$ függvényében (log-tengely, vonal 0,05-nél). Ha útközben 0,05 alá megy, jelöld: „Itt leállt volna egy türelmetlen elemző”.
- Második rész: „Szimuláld 1000-szer” – ha mindkét arány egyenlő (10%), és 100-asával 2000-ig minden lépésben belenézünk (20 belenézés), a kísérletek hány %-ában lesz
  valamikor p &lt; 0,05, és hány %-ában a végén (egyetlen, előre tervezett próba). Elvárt (Python, 20 000 ismétlés): bármikor ≈ 25%, csak a végén ≈ 4,8%.
- Mondat: „Ha addig nézed, amíg szignifikáns nem lesz, egyszer szinte biztosan az lesz – akkor is, ha nincs különbség.”

## `power-planner` (8.8, #s88-b) – „Erő- és mintanagyság-tervező két csoporthoz”
- Két mód (segmented): **átlagok** (Δ = minimális érdekes különbség, σ, $\alpha$, kívánt erő) és **arányok** ($p_1$, $p_2$, $\alpha$, kívánt erő). Kétoldali próba.
- Átlagok: csoportonkénti $n = 2\sigma^2 (z_{1-\alpha/2} + z_{1-\beta})^2 / \Delta^2$ (felfelé kerekítve); erő adott $n$-nél $\Phi(\Delta/\mathrm{SE} - z_{1-\alpha/2})$, $\mathrm{SE} = \sigma\sqrt{2/n}$
  (a másik farkat elhanyagolhatod, vagy add hozzá – írd ki, melyiket). Kezdő: Δ = 3, σ = 12 (vérnyomás, OpenIntro), $\alpha$ = 5%, erő 80% → **251 fő/csoport**; $n = 100$-nál erő ≈ 42%.
  $d = \Delta/\sigma$ kiírva (0,25). Ellenőrzés: $d = 0{,}5$, 80% → 63; 90% → 85.
- Arányok: $n = \big(z_{1-\alpha/2}\sqrt{2\bar p(1-\bar p)} + z_{1-\beta}\sqrt{p_1(1-p_1) + p_2(1-p_2)}\big)^2 / (p_1-p_2)^2$, $\bar p = (p_1+p_2)/2$. Kezdő 10% vs 15%, 80% → **686/csoport**.
- Ábra: erőgörbe – az erő a csoportonkénti $n$ függvényében (0 … 2× a szükséges n), vízszintes vonal a kívánt erőnél, függőleges a szükséges $n$-nél; egy húzható/csúszkás
  „tervezett n” pont kiírja az erőt. Kijelzők: szükséges n/csoport, összes n, $d$, erő a tervezett $n$-nél.
