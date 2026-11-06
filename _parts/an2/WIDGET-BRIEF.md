# Analízis 2. fejezet – widget-útmutató (w2.js)

Fejezet: „Számsorozatok és sorok”, végleges mappa: `analizis/02-szamsorozatok-es-sorok/` (a `build.sh` hozza létre – te csak a
`_parts/an2/` mappában dolgozz). A szöveg részei: `_parts/an2/00-head.html`, `01-s21.html` … `07-s27.html` (a 06 és 07 most készül;
olvasd el a widgeted körüli szakaszt, ha már megvan, hogy a jelölések és a hangnem egyezzen).

A végleges `widgets.js` így áll össze: `_parts/an2/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/an2/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
Olvasd el a `w0.js`-t: elérhető `C` (= `window.Calc`, lásd `assets/calc.js`: `C.parse(src, vars)`, `C.canvas(parent, aspect, maxW)`
(HiDPI; `cv.draw` téma- és méretváltáskor újrahívódik), `C.plot(cv, view, layers)` → `{tx, ty, ix, iy}` – rétegek: görbe `f`, `points`, `vline`,
`hline`, `seg`, `text`), `fmt(x, d)` (tizedesvessző, ezres tagolás szóközzel), `css, tex, texNum, h, btn, header(root, cím, alcím-html),
slider(címke, min, max, step, kezdő, onInput, [formázó]), segmented([[címke, érték], …], kezdő, onChange), legend, PAL, col,
fillRects(cv, T, rects), fillBand(cv, T, y0, y1, szín), compile(src, vars), statRow(el, [[címke, érték-HTML], …]), yRange, W`.
Stílusmintának nézd meg az `analizis/01-fuggvenyek-es-modellek/widgets.js` widgetjeit (különösen `growth-race`), és az `assets/style.css`
widget-osztályait (`.widget, .w-title, .w-sub, .controls, .stat-row, .stat .l/.v, .readout, .btn, .btn.on, .chip`).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)` (tizedesvessző, ezres tagolás).
- Színek csak CSS-változókból: --accent, --setA, --setB, --setC, --ok, --bad, --muted, --text, --card, --border, --bg-soft, --accent-soft.
  A színeket a szövegben ne nevezd „piros/kék”-nek – használj jelmagyarázatot. Világos és sötét téma is legyen olvasható
  (`data-theme="dark"` a `<html>`-en; a `C.canvas` újrarajzol témaváltáskor).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`; hosszú szöveg
  ne lógjon ki). Érintéssel is működjön minden.
- Ne használj külső könyvtárat. KaTeX: a widget szövegében $…$ használható (az indítás rendereli); ha később írsz be $…$-t, hívd meg
  `window.Synopsis && Synopsis.renderMath(elem)`-et (vagy használd a `statRow`-t).
- Teszt: készíts tesztoldalt `_parts/an2/wtest2.html` (minta: `_parts/ms3/wtest2.html`; style.css, KaTeX, common.js, `../../assets/calc.js`
  (defer, a widgetek ELŐTT) és `wtest2-widgets.js` = `cat w0.js w2.js w9.js`). Indíts helyi szervert a synopsis gyökérben
  (`python3 -m http.server <szabad port>`, a végén állítsd le a PID-jével – `pkill -f`-et NE használj mintával, mert a saját shelledet is
  megölheti), és ellenőrizd headless Playwrighttal (`uv run --with playwright python -I script.py`; ha kell:
  `uv run --with playwright python -m playwright install chromium`): nincs konzolhiba, a widgetek kirajzolnak, az interakciók működnek.
  Képernyőképek világos és sötét témában (localStorage `synopsis:theme` = light/dark), 1280 és 380 px szélességben: `_parts/an2/shots2/`.
  Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Az alább megadott „elvárt számokat” ellenőrizd a böngészőben (a widgetnek pontosan ezeket kell mutatnia), és Pythonnal is
  (`python3 -I`, szkript a `_parts/calc/` mappába `wan2_` előtaggal).
- Munkát csak a `_parts/an2/` mappában végezz (saját tesztszkriptek: `_parts/calc/wan2_*`). /tmp-t ne használj. Ne commitolj.
  Az `assets/` fájlokat ne módosítsd (ha valami hiányzik, írd meg a jelentésben, és oldd meg a saját fájlodban).
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok, és ha a szövegben hibát láttál.

Jelölések (a tananyagból): sorozat $a_n$, $n = 1, 2, \ldots$; határérték $a_n \to A$; részletösszeg $S_n = a_1 + \cdots + a_n$;
mértani sor $\sum a\,q^{n-1} = \tfrac{a}{1 - q}$ ($|q| \lt 1$); harmonikus sor $\sum \tfrac1n$; kamattényező $q = 1 + \tfrac{p}{100}$;
annuitás (évi törlesztőrészlet) $a$; hitel $V$; futamidő $n$ év.

---------------------------------------------------------------------------------------------------------------------------

## `growth-race` (2.5-c, #s25-c) – „Növekedési verseny”
- Versenyzők (kapcsolható chipek/jelölőnégyzetek, mindegyik saját színnel a PAL-ból vagy más CSS-változóból):
  $\ln n$, $\sqrt n$, $n$, $n^2$, $n^{10}$, $1{,}1^n$, $2^n$, $n!$, $n^n$. Kezdetben bekapcsolva: $n^2$, $2^n$, $n!$.
- Csúszka: a vizsgált tartomány vége $N_{\max}$ (5–60, kezdő 20; ha $n^{10}$ vagy $1{,}1^n$ be van kapcsolva, engedd 800-ig – pl. egy második
  „hosszú táv” gomb, amely 1000-re állítja, és logaritmikus skálára vált).
- Kapcsoló: lineáris / **logaritmikus** y-skála (log₁₀). Log-skálán a tengelyfelirat legyen $10^k$ alakú (pl. „10^20”), és a görbék $\log_{10}$
  értékét rajzold (nagy számokhoz `n!`-t és `n^n`-t logaritmussal számold: $\log_{10} n! = \sum \log_{10} k$, $\log_{10} n^n = n\log_{10} n$, hogy ne
  legyen túlcsordulás). Kezdetben log-skála.
- A sorozatok pontokként (vagy pont + vékony összekötő vonal) $n = 1 \ldots N_{\max}$-ra; a pontok kis méretűek, ha sok van.
- Kijelző: két választott versenyző (két legördülő, kezdő: $n^{10}$ és $1{,}1^n$) **hányadosa** a jelenlegi $N_{\max}$-nál, és az **előzés helye**:
  „Az $1{,}1^n$ az $n = 686$-tól mindig nagyobb, mint az $n^{10}$.” Az előzést számold log-térben (utolsó $n \le 5000$, ahol a lassabb még ≥),
  és ha a sorrend nem fordul meg 5000-ig, írd ki. Egy mondat: „A rangsor: $\ln n \ll n^k \ll a^n \ll n! \ll n^n$ – hosszú távon mindig a feljebb álló nyer.”
- Elvárt számok (Pythonnal ellenőrizve): $n^{10}$ vs $1{,}1^n$: az utolsó $n$, ahol $n^{10} \ge 1{,}1^n$, a **685** (tehát 686-tól előz);
  $n^2$ vs $2^n$: $n = 2$-nél egyenlők (4 = 4), $n = 3$-nál $9 \gt 8$, $n = 4$-nél $16 = 16$, és **5-től** mindig $2^n \gt n^2$;
  $2^n$ vs $n!$: $n = 4$-től $n! \gt 2^n$ ($24 \gt 16$; $n = 3$: $6 \lt 8$); $n!$ vs $n^n$: $n \ge 2$-re $n! \lt n^n$.
  $\sqrt n$ vs $\ln n$: $\sqrt n \gt \ln n$ minden $n \ge 1$-re. A kijelzőben az előzésnél azt add meg, ahonnan *mindig* (szigorúan) nagyobb.

## `series-sum` (2.6, #s26-b … #s26-d) – „Részletösszegek: összeadni végtelen sok számot”
- Választható sor (gombsor, `segmented`):
  1. mértani: $\sum_{n\ge1} a\,q^{n-1}$ csúszkákkal $a$ (0,1–2, kezdő 1/2 = 0,5) és $q$ (−1,2…1,2, lépés 0,05, kezdő 0,5) – Zénón: $\tfrac12 + \tfrac14 + \cdots = 1$;
  2. harmonikus: $\sum \tfrac1n$;
  3. $\sum \tfrac1{n^2}$ (határ $\tfrac{\pi^2}6 \approx 1{,}6449$);
  4. váltakozó harmonikus: $\sum \tfrac{(-1)^{n+1}}{n}$ (határ $\ln 2 \approx 0{,}6931$);
  5. $\sum \tfrac1{n!}$ (határ $e - 1 \approx 1{,}7183$).
- Csúszka: tagok száma $n$ (1–200, kezdő 10). Ábra: a tagok oszlopokként (vékony, --setB), a részletösszegek $S_1, \ldots, S_n$ pontokként/lépcsőként
  (--accent), és ha a sor konvergens, a határérték szaggatott vízszintes vonal (--ok) felirattal.
- Kijelzők (`statRow`): $a_n$ (az utolsó tag), $S_n$ (6 tizedes), a határérték (ha van; mértaninál $\tfrac{a}{1-q}$, ha $|q|\lt1$, egyébként „divergens”),
  és $|S_n - S|$. A harmonikusnál: „$S_n \approx \ln n + 0{,}5772$” – mutasd a $\ln n + \gamma$ értéket is, és egy mondatot: „A tagok 0-hoz tartanak,
  az összeg mégis végtelen – csak nagyon lassan: $S_n \gt 10$-hez kb. 12 367 tag kell.”
- Mértaninál $|q| \ge 1$ esetén írja ki: „$|q| \ge 1$: a tagok nem tartanak 0-hoz, a sor divergens.” (A $q = -1$-nél a részletösszegek $a, 0, a, 0, \ldots$)
- Gomb (csak mértaninál): „Zénón” – $a = 0{,}5$, $q = 0{,}5$; „$0{,}999\ldots$” – $a = 0{,}9$, $q = 0{,}1$ (határ 1).
- Elvárt számok: mértani $a = 0{,}5$, $q = 0{,}5$, $n = 10$: $S_{10} = 0{,}999023$ (= $1 - 2^{-10}$), határ 1. Harmonikus $n = 10$: $S_{10} = 2{,}928968$,
  $n = 100$: $5{,}187378$; $\ln 100 + \gamma = 5{,}182386$. A legkisebb $n$, amelyre $S_n \gt 10$: **12 367**. $\sum 1/n^2$, $n = 10$: $1{,}549768$.
  Váltakozó harmonikus $n = 10$: $0{,}645635$. $\sum 1/n!$, $n = 10$: $1{,}718282$. Ellenőrizd Pythonnal.

## `annuity-calc` (2.7-e, #s27-e) – „Hiteltörlesztés: annuitás és törlesztési táblázat”
- Csúszkák/mezők: hitel $V$ (100 ezer – 50 millió Ft; kezdő 1 000 000), éves kamatláb $p$ (0,5–20%, lépés 0,1, kezdő 10), futamidő $n$ év (1–30, kezdő 3).
  Gombsor: „évi részlet” / „havi részlet” (havinál a havi kamat $p/12$%, a részletek száma $12n$ – így a lakáshitelek is számolhatók).
- Képlet (évi): $q = 1 + \tfrac{p}{100}$, $a = V\,\dfrac{q^n (q - 1)}{q^n - 1}$ (havinál $q = 1 + \tfrac{p}{1200}$, $n \to 12n$). $p = 0$ esetén $a = V/n$.
- Kijelzők: törlesztőrészlet $a$, összes befizetés $n\cdot a$, összes kamat $n\cdot a - V$.
- Ábra: oszlopdiagram periódusonként, minden részlet két részre bontva: **kamatrész** (a fennálló tartozás × kamat, --setB) és **tőkerész** ($a$ − kamatrész, --accent);
  egymásra rakva (a magasság mindig $a$). Fölötte vagy egy második kis grafikonon a fennálló tartozás (vonal, --muted). Havinál sok oszlop van: rajzold vékonyan.
  Jelmagyarázat.
- Törlesztési táblázat (görgethető `.tw`-ben, legfeljebb 30 sor látszik; havinál évenként összesítve vagy az első 24 sor + „…”):
  időszak | fennálló tartozás az elején | kamat | tőketörlesztés | tartozás a végén.
- Egy mondat: „Az elején a részlet nagy része kamat, a végén szinte csak tőke – mert a kamat mindig a még fennálló tartozás után jár.”
- Elvárt számok (évi, 1 000 000 Ft, 10%, 3 év): $a = 402\,115$ Ft (402 114,80); táblázat: 1. év kamat 100 000, tőke 302 115, maradék 697 885;
  2. év kamat 69 789, tőke 332 326, maradék 365 559; 3. év kamat 36 556, tőke 365 559, maradék 0; összes kamat 206 344 Ft.
  Lakáshitel (havi, 20 000 000 Ft, 6%, 20 év): havi részlet 143 286 Ft, összes befizetés kb. 34,39 millió Ft (34 388 691). Évi részlettel ugyanez: 1 743 691 Ft/év.
