# Matematikai statisztika 3. fejezet – widget-útmutató (minden widget-ágensnek)

Fejezet: „Két változó kapcsolata: asszociáció és korreláció”, mappa: `matematikai-statisztika/03-ket-valtozo-kapcsolata/`
(még nem létezik – te csak a `_parts/ms3/` mappában dolgozz).

A végleges `widgets.js` így áll össze: `_parts/ms3/w0.js` (közös segédek, NE módosítsd) + `w1.js` + `w2.js` + `w9.js` (indítás).
A te fájlod (`_parts/ms3/wN.js`) csak `W["név"] = root => { … };` definíciókat és saját, `wN`-előtagú segédeket tartalmazhat
(pl. `const w2Heat = …`), hogy ne ütközzön a másik ágensével. Olvasd el a `w0.js`-t: elérhető többek közt `css, fmt(x, d)`
(tizedesvessző), `groupDigits, h, btn, slider, header(root, cím, alcím-html), makeCanvas(parent, aspect, maxW)` (HiDPI,
`cv.draw` téma- és méretváltáskor újrahívódik), `rangeTicks, axes(ctx, box, {...})` → `{tx, ty}`, `vline, mulberry32, normal,
poisson, mean, sd (n−1), psd (n), median, quant, stat(címke, érték), labelWrap, pcov (n-es nevező), pearson, ranks (átlagrang),
spearman, W`. Stílusmintának nézd meg a `matematikai-statisztika/02-egy-valtozo-leirasa/widgets.js` widgetjeit (`mean-median-drag`
– húzás pointer eseményekkel; `variance-decomp`; `sd-guess` – játék), és az `assets/style.css` widget-osztályait
(`.widget, .w-title, .w-sub, .controls, .stat-row, .stat, .readout, .btn`).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)`. Jelölések a tananyagból: átlag $\bar x$, $\bar y$;
  szórás $\sigma_x$, $\sigma_y$ (n-es nevező); kovariancia $C$ (n-es nevező); Pearson-féle korrelációs együttható $r$;
  Spearman-féle rangkorreláció $\rho$; előjel-korreláció $K_r = (p-q)/(p+q)$; Cramér-féle $V$; Yule-féle $Q$; $\chi^2$.
- Színek csak CSS-változókból: --accent, --setA (kék), --setB (narancs), --setC (zöld), --ok, --bad, --muted, --text, --card,
  --border, --bg-soft, --accent-soft. Világos és sötét téma is legyen olvasható (`data-theme="dark"` a `<html>`-en).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`).
  Érintéssel is működjön a húzás (`pointer` események, `touchAction = "none"` a vásznon).
- Ne használj külső könyvtárat. KaTeX: a widget szövegében $…$ használható (az indítás rendereli); ha később írsz be
  $…$-t, hívd meg `window.Synopsis && Synopsis.renderMath(elem)`-et (lásd `variance-decomp`).
- Valódi adatnál egy kis megjegyzés mondja meg a forrást.
- Teszt: készíts tesztoldalt `_parts/ms3/wtestN.html` (minta: `_parts/ch10/wtest.html`, de csak style.css, KaTeX, common.js
  és `wtestN-widgets.js` = `cat w0.js wN.js w9.js`). Indíts helyi szervert a synopsis gyökérben (`python3 -m http.server <szabad
  port>`, a végén állítsd le – `pkill -f`-et NE használj mintával, mert a saját shelledet is megölheti; jegyezd meg a PID-et),
  és ellenőrizd headless Playwrighttal (`uv run --with playwright python -I script.py`; ha kell:
  `uv run --with playwright python -m playwright install chromium`): nincs konzolhiba, a widgetek kirajzolnak, az interakciók
  működnek (kattints, húzz, válts). Képernyőképek világos és sötét témában, 1280 és 380 px szélességben: `_parts/ms3/shotsN/`.
  Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Az alább megadott „elvárt számokat” ellenőrizd a böngészőben (a widgetnek pontosan ezeket kell mutatnia).
- Munkát csak a `_parts/ms3/` mappában végezz (saját tesztszkriptek: `_parts/calc/`, `wms3N_` előtaggal). /tmp-t ne használj.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok.

Szakaszhorgonyok (ha linkelsz): 3.1 #s31 · 3.2 #s32 (kontingencia-tábla, várt gyakoriság, χ², Cramér V / Yule Q) · 3.3 #s33
(vegyes kapcsolat, szóráshányados) · 3.4 #s34 (pontdiagram, előjel-korreláció, kovariancia) · 3.5 #s35 (Pearson r; erősség
ránézésre; csak lineáris – Anscombe, kiugró pont) · 3.6 #s36 (Spearman, Kendall) · 3.7 #s37 (zavaró változó; fordított okság,
véletlen egybeesés, trendek; Simpson-paradoxon; ökológiai tévkövetkeztetés) · 3.8 #s38 alkalmazás.

---------------------------------------------------------------------------------------------------------------------------

## w1.js – `scatter-drag`, `guess-r`, `anscombe`, `rank-vs-pearson`

### `scatter-drag` (3.4/3.5) – „Húzd a pontokat: kovariancia és korreláció élőben”
- Kezdő adatok (a tananyag futó példája, 5 diák): tanulási idő $x$ (óra) és dolgozatpont $y$:
  (1; 52), (2; 56), (3; 62), (4; 62), (5; 68). Tengelyek: x 0–10 óra, y 30–100 pont.
- Pontok húzhatók; üres helyre kattintva új pont (max. 25); gombok: „− utolsó pont”, „＋ kiugró pont (9; 35)”, „↺ alaphelyzet”.
- Szaggatott vonal $x = \bar x$ és $y = \bar y$ – a sík négy negyedre oszlik. Minden ponthoz téglalap a $(\bar x; \bar y)$
  ponttól a pontig, áttetszően kitöltve: pozitív szorzat $(x_i-\bar x)(y_i-\bar y) > 0$ → --setA, negatív → --setB.
  Jelölőnégyzet: „téglalapok mutatása” (alapból be).
- Kapcsoló: „x mértékegysége: óra / perc” – percben minden $x$ 60-szoros (a tengely felirata is), a kovariancia 60-szorosára nő,
  $r$ nem változik. (A pontok a vásznon ugyanott maradnak, csak a skála felirata és a számok változnak.)
- Kijelzők (stat-row): $n$, $\bar x$, $\bar y$, $C$ (n-es nevező), $\sigma_x$, $\sigma_y$, $r$ (3 tizedes), Spearman $\rho$ (3 tizedes),
  $K_r$ (előjel-korreláció; a tengelyen fekvő, 0 szorzatú pontot ne számold se p-be, se q-ba).
- Elvárt számok kezdéskor: $\bar x = 3$, $\bar y = 60$, $C = 7{,}6$, $\sigma_x = 1{,}414$, $\sigma_y = 5{,}514$, $r = 0{,}975$,
  $\rho = 0{,}975$ (rangok kötéssel: y-ban két 62 → 3,5), $K_r = 1$ (a (3; 62) pont dx = 0 → kimarad, p = 4, q = 0).
  Percben: $C = 456$, $r = 0{,}975$.

### `guess-r` (3.5) – „Találd ki a korrelációt!”
- Véletlen pontfelhő (n = 50), cél-$r$ egyenletesen [−1; 1]-ből (néha kifejezetten 0 közeli és ±0,9 fölötti is jöjjön).
  Generálás: $x \sim N(0,1)$, $y = \rho x + \sqrt{1-\rho^2}\,\varepsilon$; a felfedéskor a **minta tényleges** $r$-jét mutasd.
  Tengelyfeliratok nélkül, csak keret (a lényeg az alak).
- Csúszka −1 … 1 (lépés 0,05) a tipphez, „Tippelek” gomb → felfedés: valódi $r$, eltérés, pont (pl. 100 − 100·|eltérés|, min. 0).
  5 körös sorozat, a végén átlagos eltérés és rövid értékelés („0,1 alatt: mesteri”, …). „Új kör” / „Új sorozat”.
- A felfedés után opcionálisan rajzold be a pontokra illesztett egyenest (legkisebb négyzetek; ezt nem kell magyarázni).

### `anscombe` (3.5) – Anscombe-kvartett
- Adatok (Anscombe, 1973): x (I–III) = 10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5
  y1 = 8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68
  y2 = 9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74
  y3 = 7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73
  x4 = 8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8;  y4 = 6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89
- Nézetek: „egyenként” (I / II / III / IV gombok) és „mind a négy” (2×2 rács, mobilon 1 oszlop). Közös tengely: x 2–20, y 2–14.
  Mindegyiken a pontok és az illesztett egyenes $y = 3 + 0{,}5x$ (a saját adatából számolva).
- Táblázat a négy adatsor statisztikáival egymás mellett: $\bar x$, $\bar y$, $\sigma_x$, $\sigma_y$, $r$, egyenes, Spearman $\rho$.
  Elvárt (2–3 tizedesre): $\bar x = 9$, $\bar y = 7{,}50$, $\sigma_x = 3{,}162$, $\sigma_y \approx 1{,}94$, $r = 0{,}816$ (mind a négy),
  egyenes $y \approx 3{,}00 + 0{,}500x$; $\rho$: I 0,818 · II 0,691 · III 0,991 · IV 0,500.
- Rövid szöveges „mit látsz?” sor az aktuális adatsorhoz: I lineáris + zaj; II tökéletes görbe (parabola), nem egyenes;
  III egyenes + egy kiugró pont; IV egyetlen pont teremti a kapcsolatot.

### `rank-vs-pearson` (3.6) – „Monoton, de nem egyenes”
- Pontok: $x = 1, 2, …, 10$, $y = f(x)$; legördülő: lineáris ($y = x$), köbös ($x^3$), exponenciális ($2^x$), gyök ($\sqrt x$),
  parabola ($(x-5{,}5)^2$, nem monoton), lépcső (0 ha x ≤ 5, különben 1).
- Csúszka: zaj szórása (0 … a y-terjedelem 30%-a), rögzített maggal, „új zaj” gomb.
- Jelölőnégyzet: „kiugró pont” – az utolsó pont y-ját a terjedelem alá viszi (pl. min − 2·terjedelem).
- Két vászon egymás mellett (mobilon egymás alatt): bal: eredeti pontok; jobb: rangok (rang(x), rang(y)) – ennek a Pearson-r-je
  maga a Spearman-ρ. Kijelzők: Pearson $r$, Spearman $\rho$ (3 tizedes).
- Elvárt zaj nélkül: lineáris r = ρ = 1; exponenciális x = 1..10: r ≈ 0,77 (számold ki), ρ = 1; parabola r = 0, ρ = 0.

---------------------------------------------------------------------------------------------------------------------------

## w2.js – `contingency-assoc`, `simpson-slider`, `spurious`, `confounder`

### `contingency-assoc` (3.2) – „Kontingencia-tábla: megfigyelt kontra várt”
- Szerkeszthető gyakorisági tábla (`<input type=number min=0>` cellák), méret: 2×2 / 2×3 / 3×3 (sorok és oszlopok neve is
  szerkeszthető lehet, de nem kötelező). Előbeállítások (legördülő):
  1. „Dohányzás × nem (200 fő)”: sorok Férfi, Nő; oszlopok dohányzik, nem dohányzik; [[30, 70], [20, 80]].
  2. „Iparág × bírság (NGA, 50 cég)”: sorok Textilipar, Élelmiszeripar; oszlopok fizetett, nem fizetett; [[18, 2], [5, 25]].
  3. „Végzettség × olvasás (300 fő)”: sorok alapfokú, középfokú, felsőfokú; oszlopok soha, néha, rendszeresen;
     [[40, 45, 15], [30, 50, 20], [10, 40, 50]].
  4. „Független tábla”: [[20, 30], [40, 60]] (sorok A, B; oszlopok igen, nem).
- Megjelenítés: (a) megfigyelt tábla peremgyakoriságokkal; (b) várt gyakoriságok $f^*_{ij} = f_{i\cdot} f_{\cdot j}/N$ (1 tizedes);
  (c) a megfigyelt cellák háttérszíne a $(f - f^*)/\sqrt{f^*}$ előjeles eltérés szerint: felülreprezentált → --setA árnyalat ▲,
  alulreprezentált → --setB árnyalat ▼ (intenzitás arányos, korláttal); (d) sorszázalékok (feltételes eloszlások) egymás alatti
  100%-os sávdiagramként + egy „összesen” sáv – ha a sávok egyformák, függetlenség.
- Kijelzők: $N$, $\chi^2$ (2 tizedes), Cramér-féle $V = \sqrt{\chi^2 / (N\cdot\min(b-1, c-1))}$ (3 tizedes), 2×2 esetén Yule-féle
  $Q = (ad - bc)/(ad + bc)$ (3 tizedes). Szöveges szorosság: V < 0,4 gyenge, 0,4–0,6 közepes, > 0,6 szoros (0 → független).
- Gomb: „minden cella × 2” – a $\chi^2$ duplázódik, $V$ és $Q$ nem változik (tanulság a szövegben).
- Elvárt: 1. $\chi^2 = 2{,}67$, $V = 0{,}115$, $Q = 0{,}263$; 2. $\chi^2 = 25{,}98$, $V = 0{,}721$, $Q = 0{,}957$, várt 9,2 / 10,8 / 13,8 / 16,2;
  3. $\chi^2 = 43{,}91$, $V = 0{,}271$; 4. $\chi^2 = 0$, $V = 0$, $Q = 0$. Üres sor/oszlop (perem 0) esetén ne legyen NaN-kiírás: „–”.

### `simpson-slider` (3.7) – „Simpson-paradoxon: felvételi két szakra”
- 1000 férfi és 1000 női jelentkező, két szak. Felvételi arányok rögzítve: könnyű szak: férfi 60%, nő 65%; nehéz szak:
  férfi 20%, nő 25% (a nők **mindkét** szakon jobban teljesítenek).
- Csúszkák: a nők hány %-a jelentkezik a nehéz szakra (alap 80%), a férfiak hány %-a (alap 20%).
- Ábra: csoportosított oszlopdiagram – könnyű szak, nehéz szak, összesen; mindegyikben férfi (--setA) és nő (--setB) felvételi arány,
  oszlopok alatt/felett a létszám (pl. „120/200”). Kijelző: összesített arányok, és ha a férfiaké nagyobb, kiemelt üzenet:
  „Simpson-paradoxon: szakonként a nők jobbak, összesítve a férfiak!” Elvárt alapállásban: férfi 52%, nő 33%.
- Második fül / kapcsoló: „Berkeley, 1973 (valódi adatok)” – a hat legnagyobb szak (A–F) jelentkezői és felvettjei
  (Bickel–Hammel–O'Connell, 1975; R `UCBAdmissions`): férfi felvett/jelentkező: A 512/825, B 353/560, C 120/325, D 138/417,
  E 53/191, F 22/373; nő: A 89/108, B 17/25, C 202/593, D 131/375, E 94/393, F 24/341. Összesen férfi 1198/2691 = 44,5%,
  nő 557/1835 = 30,4%. Ábra: szakonként a két arány + a nők jelentkezési aránya szakonként (honnan jön a paradoxon: a nők a
  nehéz szakokra – C–F – jelentkeztek többen). Forrásmegjegyzés.

### `spurious` (3.7) – „Két független véletlen bolyongás”
- Két **független** sorozat, hossza $n$ (csúszka 20–200, alap 50). Típus kapcsoló: „véletlen bolyongás (trendelő)”:
  $x_t = x_{t-1} + \varepsilon_t$ / „független zaj”: $x_t = \varepsilon_t$.
- Ábra: a két idősor közös időtengelyen (mindkettő standardizálva, két színnel), és mellette/alatta a pontdiagramjuk.
  Kijelző: $r$ (2 tizedes). Gomb: „Új pár”.
- Gomb: „1000 pár szimulálása” → hisztogram az $r$-ekről (−1…1, 40 osztály) mindkét típusra (két szín, egymásra vagy két panel),
  és kijelző: az esetek hány %-ában $|r| > 0{,}5$ (bolyongásnál kb. 25–35%, zajnál ≈ 0%; ezt mérd meg és jelentsd nekem).
- Tanulság-sor: „A két sorozatnak semmi köze egymáshoz – mégis gyakran »erősen korrelál«, mert mindkettő trendel.”

### `confounder` (3.7) – „Fagyi és fulladás: a hőmérséklet a háttérben”
- Szimulált adat, rögzített maggal: 10 év heti adatai (520 pont). Heti középhőmérséklet $T$ (°C): évszakos szinusz
  (télen ≈ 0, nyáron ≈ 22) + $N(0, 3)$ zaj. Fagylalteladás $F$ (ezer gombóc) $= \max(0,\ 5 + 2T + N(0, 5))$.
  Vízi balesetek / fulladások száma $D \sim$ Poisson$(0{,}3 \cdot \max(0, T - 10))$. $F$ és $D$ adott $T$ mellett **független**.
- Fő ábra: pontdiagram $F$ (x) – $D$ (y) (D egész, kis függőleges véletlen eltolással, hogy ne fedjék egymást), a pontok színe a
  hőmérséklet szerint (hideg → --setA, meleg → --setB, köztes keverék). Mellette két kis ábra: $T$–$F$ és $T$–$D$.
- Csúszka: „hőmérséklet-sáv” közepe (0–26 °C), szélessége 3 °C (vagy második csúszka 2–8 °C); a sávon kívüli pontok halványak.
  Kijelzők: $r(F, D)$ az összes ponton (kb. 0,7–0,8 – jelentsd az értéket), $r(T, F)$, $r(T, D)$, és $r(F, D)$ csak a sávban
  (≈ 0 körül ingadozik) + a sáv pontjainak száma. Jelölőnégyzet: „csak a sáv”.
- Tanulság-sor: „Azonos hőmérséklet mellett a fagyi nem jelzi előre a fulladást – a kapcsolatot a közös ok (a meleg) okozza.”
