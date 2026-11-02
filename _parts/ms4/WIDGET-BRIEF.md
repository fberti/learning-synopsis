# Matematikai statisztika 4. fejezet – widget-útmutató (w2.js)

Fejezet: „Viszonyszámok, indexek, standardizálás”, végleges mappa: `matematikai-statisztika/04-viszonyszamok-indexek/`
(a build.sh hozza létre – te csak a `_parts/ms4/` mappában dolgozz). A szöveg részei: `_parts/ms4/01-s41.html` … `07-s47.html`
(olvasd el a widgeted körüli szakaszt, hogy a jelölések és a hangnem egyezzen).

A végleges `widgets.js` így áll össze: `_parts/ms4/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/ms4/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
Olvasd el a `w0.js`-t: elérhető többek közt `css, fmt(x, d)` (tizedesvessző), `pct(x, d)` (1,1 → "110,0%"), `groupDigits, h, btn, slider,
header(root, cím, alcím-html), makeCanvas(parent, aspect, maxW)` (HiDPI; `cv.draw` téma- és méretváltáskor újrahívódik), `rangeTicks,
axes(ctx, box, {...})` → `{tx, ty}`, `vline, stat(címke, érték), statRow(el, [[címke, érték], …])` (KaTeX-et is renderel), `labelWrap,
numBox(érték, {min,max,step,width}, onChange), sum, sumProd, mean, W`. Stílusmintának nézd meg a
`matematikai-statisztika/03-ket-valtozo-kapcsolata/widgets.js` widgetjeit és az `assets/style.css` widget-osztályait
(`.widget, .w-title, .w-sub, .controls, .stat-row, .stat, .readout, .btn, .btn.on`).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)`, `pct(x, d)`, ezres tagolás `groupDigits`.
- Színek csak CSS-változókból: --accent, --setA (kék), --setB (narancs), --setC (zöld), --ok, --bad, --muted, --text, --card,
  --border, --bg-soft, --accent-soft. A színeket a szövegben ne nevezd „piros/kék”-nek – mondd „az első / a második sáv” vagy jelmagyarázat.
  Világos és sötét téma is legyen olvasható (`data-theme="dark"` a `<html>`-en).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`; hosszú
  szöveg ne lógjon ki). Érintéssel is működjön minden.
- Ne használj külső könyvtárat. KaTeX: a widget szövegében $…$ használható (az indítás rendereli); ha később írsz be $…$-t,
  hívd meg `window.Synopsis && Synopsis.renderMath(elem)`-et (vagy használd a `statRow`-t).
- Valódi adatnál egy kis megjegyzés mondja meg a forrást.
- Teszt: készíts tesztoldalt `_parts/ms4/wtest2.html` (minta: `_parts/ms3/wtest2.html`; style.css, KaTeX, common.js és
  `wtest2-widgets.js` = `cat w0.js w2.js w9.js`). Indíts helyi szervert a synopsis gyökérben (`python3 -m http.server <szabad port>`,
  a végén állítsd le a PID-jével – `pkill -f`-et NE használj mintával, mert a saját shelledet is megölheti), és ellenőrizd headless
  Playwrighttal (`uv run --with playwright python -I script.py`; ha kell: `uv run --with playwright python -m playwright install chromium`):
  nincs konzolhiba, a widgetek kirajzolnak, az interakciók működnek. Képernyőképek világos és sötét témában, 1280 és 380 px
  szélességben: `_parts/ms4/shots2/`. Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Az alább megadott „elvárt számokat” ellenőrizd a böngészőben (a widgetnek pontosan ezeket kell mutatnia), és Pythonnal is.
- Munkát csak a `_parts/ms4/` mappában végezz (saját tesztszkriptek: `_parts/calc/`, `wms4_` előtaggal). /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok, és ha a szövegben hibát láttál.

Jelölések (a tananyagból): viszonyszám $V = A/B$; százalékpont; részviszonyszám $v_i = A_i/B_i$, összetett viszonyszám $V = \sum A_i/\sum B_i$;
árindex Laspeyres $I_p^{0}$, Paasche $I_p^{1}$; nominális / reál; standardizálás: $V_0, V_1, V_S$, $K_T = K_R + K_{\text{Ö}}$
(az Ö-t KaTeX-ben `\text{Ö}`-vel írd!), $I_F = I_R \cdot I_{\text{Ö}}$.

---------------------------------------------------------------------------------------------------------------------------

## `pct-lab` (4.1-c, #s41-c) – „Százalék-labor: hányados, százalék, százalékpont”
Két mód (gombpár: „Két mennyiség” / „Két arány”).
- **Két mennyiség:** csúszkák $A$ (1–200, lépés 1, kezdő 125) és $B$ (1–200, kezdő 100). Mutasd: $A/B$ (3 tizedes), „A a B-nek …%-a”,
  „A … %-kal több/kevesebb B-nél” (előjeltől függő szó), „B … %-kal kevesebb/több A-nál”, különbség $A - B$. Kis ábra: két vízszintes sáv
  (A és B hossza arányos), és mindkét irányú „%-os” nyíl/felirat, hogy látsszon az aszimmetria (+25% vs −20%).
  Gomb: „+x%, majd −x%” mini-demo: csúszka x (0–90%), mutatja $100 \to 100(1+x) \to 100(1+x)(1-x)$, és hogy a vége $100(1 - x^2)$ < 100.
  Elvárt kezdéskor: $A/B = 1{,}250$; „125,0%-a”; „25,0%-kal több”; „B 20,0%-kal kevesebb A-nál”; különbség 25. x = 20% → 100 → 120 → 96.
- **Két arány:** csúszkák régi arány $a$ (0,1–99%, lépés 0,1, kezdő 52,6) és új arány $b$ (kezdő 78,9). Mutasd: változás „… százalékpont”,
  relatív változás „… %-kal” (hányados − 1), és egy 0–100%-os skálán a két arányt. Előre beállítható példák (gombok): „Fagylaltgép
  52,6% → 78,9%” (elvárt: +26,3 százalékpont, +50,0%), „Kamat 2% → 3%” (+1,0 százalékpont, +50,0%), „Munkanélküliség 4% → 5%”
  (+1,0 százalékpont, +25,0%), „Kockázat 0,4% → 0,3%” (−0,1 százalékpont, −25,0%).
  Egy rövid, dinamikus mondat: „Helyesen: »… százalékponttal nőtt«, relatíve »…%-kal«.”

## `weighted-ratio` (4.2-c, #s42-c) – „Összetett viszonyszám: a részek súlyozott átlaga”
- Két bolt (A, B; opcionálisan harmadik C egy „+ bolt” gombbal). Boltonként csúszka: dolgozók $B_i$ (1–20 fő) és egy főre jutó forgalom
  $v_i$ (0,5–5 millió Ft/fő, lépés 0,1). Kezdő: A: 4 fő, 2,5; B: 6 fő, 1,5 (a tananyag kiinduló példája).
- Ábra: vízszintes „számegyenes” 0–5 között, a $v_i$ pontok körrel jelölve, a kör **területe** arányos $B_i$-vel; az összetett $V$ egy
  függőleges vonal (--accent), mellette az egyszerű átlag szaggatott vonallal (--muted). Látsszon, hogy $V$ a nagyobb súlyú bolt felé húz.
- Kijelzők: $V = \sum A_i / \sum B_i$, számtani alakban $\sum B_i v_i / \sum B_i$ és harmonikus alakban $\sum A_i / \sum (A_i/v_i)$
  (mindhárom ugyanaz – ezt egy kis „✔ ugyanaz” mutassa), egyszerű átlag, és $\min v_i \le V \le \max v_i$.
- Elvárt kezdéskor: $V = 1{,}90$ millió Ft/fő, egyszerű átlag 2,00, $\sum A = 19$, $\sum B = 10$.
- Gomb: „Előző év (2 + 8 fő; 2,4 és 1,4)” → $V = 1{,}60$; ez a 4.2-c utolsó gyakorló feladata és a 4.6 előfutára. Egy kis szöveg:
  „Mindkét bolt +0,1-et javult, a cég +0,3-at – a különbség az összetételből jön (lásd 4.6).” (Ezt a mondatot csak akkor mutasd, ha
  a felhasználó a két preset között vált – vagy egyszerűen mindig a preset-gombok alatt.)

## `real-wage` (4.5-c, #s45-c) – „Nominális és reálbér”
- Adatok: KSH éves fogyasztóiár-index (előző év = 100%): 2020: 103,3; 2021: 105,1; 2022: 114,5; 2023: 117,6; 2024: 103,7
  (forrásmegjegyzés: „KSH, éves átlagos fogyasztóiár-index”). Kezdő év 2019 (= 100) – így 2019…2024 hat pont.
- Panni (kitalált) nettó bére: 2021: 300, 2022: 330, 2023: 370, 2024: 400 ezer Ft; 2019-re és 2020-ra adj 270 és 285-öt.
  Minden év bére állítható egy kis szám-mezővel (`numBox`) vagy csúszkával (100–800 ezer Ft).
- Bázisév választó (gombsor 2019 … 2024; kezdő **2021**). Ábra: két vonal az indexekkel (bázis = 100): nominális bérindex (--setA) és
  árszínvonal (--setB), plusz a reálbérindex (--setC, vastagabb); 100-nál vízszintes segédvonal. Jelmagyarázat.
- Táblázat évenként: bér, nominális index (bázis = 100), árszínvonal (láncolva, bázis = 100), reálbérindex, reálbér a bázisév árain (ezer Ft),
  és a reálbér láncindexe (előző év = 100).
- Elvárt (bázis 2021): árszínvonal 2022: 114,5; 2023: 134,7; 2024: 139,6. Nominális: 110,0; 123,3; 133,3. Reál: 96,1; 91,6; 95,5.
  Reálbér 2021-es áron: 288,2; 274,8; 286,5 ezer Ft. Reál láncindex: 2022 96,1; 2023 95,3; 2024 104,3.
  Bázis 2019-cel az árszínvonal 2024-ben 151,6.
- Gomb: „Mennyi bér kellett volna?” – kiírja, mennyi bér tartotta volna meg a bázisév reálbérét minden évben (bázisbér × árszínvonal);
  2021-es bázisnál 2024-re 418,9 ezer Ft.

## `age-std` (4.6-d, #s46-d) – „Korstandardizálás: Öregfalu és Ifjúváros”
- Három korcsoport (0–39, 40–64, 65+). Két település; mindegyiknél a korcsoportok aránya (három csúszka, amelyek összege 100% – pl. a
  harmadikat a másik kettő határozza meg, vagy normalizálás) és a korcsoportonkénti halálozás ‰-ben (csúszka 0–100, lépés 0,5).
  Kezdő (a tananyag kitalált adatai): Öregfalu arányok 30/30/40%, halálozás 1 / 8 / 50‰; Ifjúváros 60/30/10%, 2 / 10 / 60‰.
- Standard választó (gombsor): „Öregfalu szerkezete”, „Ifjúváros szerkezete”, „egyenlő (⅓–⅓–⅓)”, „a kettő átlaga”.
- Ábra: csoportosított oszlopdiagram a korcsoportonkénti halálozásról (két szín, jelmagyarázattal), alatta két kis halmozott sáv a korszerkezetről.
  Kijelzők: nyers arányszám mindkettőre, standardizált arányszám mindkettőre (a választott standarddal), és egy mondat:
  „Nyersen … a rosszabb, standardizálva … ” (ha megfordul a sorrend, emeld ki).
  Opcionálisan az NGA-felbontás (0 = Öregfalu, 1 = Ifjúváros): $V_S = \sum B_1 v_0$, $K_T$, $K_R$, $K_{\text{Ö}}$.
- Elvárt kezdéskor: nyers Öregfalu 22,7‰, Ifjúváros 10,2‰. Standard = Öregfalu szerkezete: 22,7 vs 27,6‰; = Ifjúváros szerkezete: 8,0 vs 10,2‰;
  egyenlő: 19,7 vs 24,0‰; a kettő átlaga (45/30/25%): Öregfalu 15,35‰, Ifjúváros 18,9‰.
  Felbontás: $V_S = 8{,}0$; $K_T = -12{,}5$; $K_R = +2{,}2$; $K_{\text{Ö}} = -14{,}7$.
