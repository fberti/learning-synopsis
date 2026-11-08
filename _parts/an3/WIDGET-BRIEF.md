# Analízis 3. fejezet – widget-útmutató (w2.js)

Fejezet: „Függvények határértéke és folytonossága”, végleges mappa: `analizis/03-hatarertek-es-folytonossag/` (a `build.sh` hozza létre –
te csak a `_parts/an3/` mappában dolgozz). A szöveg részei: `_parts/an3/00-head.html`, `01-s31.html` … `07-s37.html` (most készülnek;
ha a widgeted körüli szakasz már megvan, olvasd el, hogy a jelölések és a hangnem egyezzen).

A végleges `widgets.js` így áll össze: `_parts/an3/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/an3/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
Olvasd el a `w0.js`-t: elérhető `C` (= `window.Calc`, lásd `assets/calc.js`: `C.parse(src, vars)`, `C.canvas(parent, aspect, maxW)`
(HiDPI; `cv.draw` téma- és méretváltáskor újrahívódik), `C.plot(cv, view, layers)` → `{tx, ty, ix, iy}` – rétegek: görbe `f` (`domain`, `dash`),
`points` (`open: true` = üres karika), `vline`, `hline`, `seg`, `text`), `fmt(x, d)` (tizedesvessző, ezres tagolás), `css, tex, texNum, h, btn,
header(root, cím, alcím-html), slider(címke, min, max, step, kezdő, onInput, [formázó]), segmented([[címke, érték], …], kezdő, onChange), legend,
PAL, col, fillRects(cv, T, rects), fillBand(cv, T, y0, y1, szín), compile(src, vars), statRow(el, [[címke, érték-HTML], …]), yRange, W`.
Stílusmintának nézd meg az `analizis/02-szamsorozatok-es-sorok/widgets.js` widgetjeit és az `assets/style.css` widget-osztályait
(`.widget, .w-title, .w-sub, .controls, .stat-row, .stat .l/.v, .readout, .btn, .btn.on, .chip`).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)`.
- Színek csak CSS-változókból: --accent, --setA, --setB, --setC, --ok, --bad, --muted, --text, --card, --border, --bg-soft, --accent-soft.
  A színeket a szövegben ne nevezd „piros/kék”-nek – jelmagyarázatot használj. Világos és sötét téma is legyen olvasható
  (`data-theme="dark"` a `<html>`-en; a `C.canvas` újrarajzol témaváltáskor).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`; hosszú szöveg,
  `<code>` ne lógjon ki – kell `overflow-wrap:anywhere`). Érintéssel is működjön minden.
- Ne használj külső könyvtárat. KaTeX: a widget szövegében $…$ használható (az indítás rendereli); ha később írsz be $…$-t, hívd meg
  `window.Synopsis && Synopsis.renderMath(elem)`-et (vagy használd a `statRow`-t). KaTeX-ben `<` helyett `\lt`.
- Teszt: tesztoldal `_parts/an3/wtest2.html` (minta: `_parts/an2/wtest2.html`; `wtest2-widgets.js` = `cat w0.js w2.js w9.js`). Helyi szerver a
  synopsis gyökérben (`python3 -m http.server <szabad port>`, a végén állítsd le a PID-jével – `pkill -f`-et NE használj), és headless Playwright
  (`uv run --with playwright python -I script.py`): nincs konzolhiba, a widgetek kirajzolnak, az interakciók működnek.
  Képernyőképek világos és sötét témában (localStorage `synopsis:theme` = light/dark), 1280 és 380 px szélességben: `_parts/an3/shots2/`.
  Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Az „elvárt számokat” ellenőrizd a böngészőben is (a widgetnek pontosan ezeket kell mutatnia) és Pythonnal (`python3 -I`, szkript a
  `_parts/calc/` mappába `wan3_` előtaggal).
- Munkát csak a `_parts/an3/` mappában (és `_parts/calc/wan3_*`) végezz. /tmp-t ne használj. Ne commitolj. Az `assets/` fájlokat ne módosítsd.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok, és ha a szövegben hibát láttál.

Jelölések: határérték $\lim\limits_{x\to a} f(x) = A$; egyoldali $\lim\limits_{x\to a-}$ (bal), $\lim\limits_{x\to a+}$ (jobb); intervallum $[a; b]$, $]a; b[$;
függőleges aszimptota $x = a$, vízszintes $y = c$, ferde $y = mx + b$. Szakadástípusok (a szöveg szóhasználata):
**megszüntethető szakadás** („lyuk”: a határérték létezik és véges, de $f(a)$ nincs értelmezve vagy más), **ugrás** (a két egyoldali határérték
véges, de különböző), **végtelen szakadás** (legalább az egyik egyoldali határérték $\pm\infty$), **oszcilláló** (pl. $\sin\frac1x$ a 0-ban: nincs
egyoldali határérték sem). Az első kettő az „elsőfajú”, a többi „másodfajú” szakadás.

---------------------------------------------------------------------------------------------------------------------------

## `asymptote-explorer` (3.3, #s33-d) – „Racionális törtfüggvény: aszimptoták és lyukak”
- Bemenet: számláló és nevező **gyöktényezős vagy együtthatós** alakban. Legyen egyszerű: két szövegmező a számláló és a nevező polinomjának
  együtthatóival, csökkenő fokszám szerint, vesszővel/szóközzel elválasztva (pl. `1, 0, -1` = $x^2 - 1$), legfeljebb 4. fokig.
  Mellette előbeállítás-gombok:
  1. $\dfrac{x^2 - 1}{x - 1}$ (csak lyuk az 1-ben, a határérték 2);
  2. $\dfrac{x + 1}{x - 1}$ (függőleges $x = 1$, vízszintes $y = 1$);
  3. $\dfrac{2x^2 - 1}{x^2 - 4}$ (függőleges $x = \pm2$, vízszintes $y = 2$);
  4. $\dfrac{x}{x^2 + 1}$ (vízszintes $y = 0$, nincs függőleges);
  5. $\dfrac{x^2 + 1}{x}$ (függőleges $x = 0$, ferde $y = x$);
  6. $\dfrac{x^2 - 3x + 2}{x^2 - 1}$ = $\frac{(x - 1)(x - 2)}{(x - 1)(x + 1)}$ (lyuk az 1-ben, értéke $-\tfrac12$; függőleges $x = -1$; vízszintes $y = 1$);
  7. $\dfrac{x^3}{x^2 - 1}$ (függőleges $x = \pm1$, ferde $y = x$).
- Számolás: a nevező valós gyökei (fokszám ≤ 4: numerikusan, pl. sajátérték nélkül – Durand–Kerner vagy előjelváltás + felezés + polinomosztás;
  többszörös gyököt is kezelj, pl. tolerancia 1e-7). Minden nevező-gyökre $r$: nézd meg, gyöke-e a számlálónak is (|p(r)| < 1e-9 · skála);
  ha igen, egyszerűsíts (osztás $(x - r)$-rel mindkettőt, ismételve) – ha az egyszerűsítés után a nevező már nem 0 az $r$-ben: **lyuk**, az értéke
  az egyszerűsített tört $r$-ben; ha továbbra is 0: **függőleges aszimptota**. A végtelenbeli viselkedést a fokok döntik el:
  $\deg p \lt \deg q$ → $y = 0$; egyenlő → $y = \tfrac{\text{főegyütthatók}}{\ldots}$; $\deg p = \deg q + 1$ → ferde aszimptota (polinomosztás hányadosa);
  $\deg p \ge \deg q + 2$ → nincs (vízszintes/ferde) aszimptota, $\pm\infty$-be tart (írd ki az előjelét $x \to +\infty$ és $x \to -\infty$ esetén).
- Ábra: a görbe (--accent); függőleges aszimptoták szaggatott függőleges vonallal (--bad), vízszintes/ferde szaggatottan (--ok);
  lyuk üres karikával (`open: true`). Az egyoldali határértékeket minden függőleges aszimptotánál írd ki: pl. „$x \to 1-$: $-\infty$, $x \to 1+$: $+\infty$”
  (az előjelet numerikusan, $r \pm 10^{-6}$-ban számold). Nézet: csúszka vagy +/− gomb a nagyításhoz (x tartomány ±4 … ±40), y automatikusan
  ésszerű tartományban (ne nyúljon az aszimptotáknál az égig: vágd pl. a középső értékek 5–95%-os kvantilisének többszörösére).
- Kijelző (`statRow`): képlet KaTeX-ben (`tex`), lyukak, függőleges aszimptoták (egyoldali határértékekkel), viselkedés $\pm\infty$-ben.
  Egy mondat: „Lyuk ott van, ahol a számláló és a nevező is 0, és az egyszerűsítés eltünteti a zérushelyet; függőleges aszimptota ott, ahol
  egyszerűsítés után is 0 a nevező.”
- Elvárt számok: (6) lyuk $x = 1$, érték $-0{,}5$; függőleges $x = -1$, $x \to -1-$: $+\infty$, $x \to -1+$: $-\infty$; vízszintes $y = 1$.
  (2) $x \to 1-$: $-\infty$, $x \to 1+$: $+\infty$. (5) ferde $y = x$. (7) ferde $y = x$, függőleges $x = -1$ és $x = 1$. (3) vízszintes $y = 2$.
  Hibás bemenetre (nem szám, csupa 0 nevező) barátságos hibaüzenet.

## `continuity-types` (3.5, #s35-b) – „Szakadásvadász: sorold be!”
- Játék: egy függvény grafikonja egy kitüntetett $a$ pont körül (függőleges halvány vonal a-nál), és négy+1 gomb: **folytonos**, **megszüntethető
  szakadás**, **ugrás**, **végtelen szakadás**, **oszcilláló**. A tanuló kattint; visszajelzés (--ok / --bad) és rövid indoklás az egyoldali határértékekkel és
  $f(a)$-val (pl. „$\lim_{x\to 0-} = -1$, $\lim_{x\to 0+} = 1$: a két oldal különböző → ugrás.”). „Következő” gomb; pontszám „3/5”.
- Feladatbank (legalább 10, véletlen sorrendben, ismétlés nélkül egy körön belül), a pont értékét teli karikával, a „hiányzó” pontot üres karikával jelöld:
  1. $\operatorname{sgn} x$, $a = 0$ → ugrás ($-1$, $1$, $f(0) = 0$);
  2. $\dfrac{x^2 - 1}{x - 1}$, $a = 1$ → megszüntethető (határérték 2, $f(1)$ nincs értelmezve);
  3. $g(x) = x + 1$ ha $x \ne 1$, $g(1) = 3$ → megszüntethető (határérték 2, de $g(1) = 3$);
  4. $\dfrac1x$, $a = 0$ (a $0$-ban $f(0) := 0$ értékkel, mint a MAT1 43. feladatában) → végtelen;
  5. $\dfrac{1}{x^2}$, $a = 0$ → végtelen;
  6. $\sin\dfrac1x$, $a = 0$ → oszcilláló (rajzold sűrű mintavétellel, legalább 4000 ponttal a $[-0{,}5; 0{,}5]$-en);
  7. $|x|$, $a = 0$ → folytonos;
  8. $\lfloor x\rfloor$ (egészrész), $a = 2$ → ugrás (1, 2, $f(2) = 2$; jobbról folytonos);
  9. $\dfrac{\sin x}{x}$, $a = 0$ → megszüntethető (határérték 1);
  10. $x^2$ ha $x \lt 1$, $2x - 1$ ha $x \ge 1$, $a = 1$ → folytonos (mindkét oldal 1, $f(1) = 1$);
  11. $x + 1$ ha $x \lt 1$, $x^2$ ha $x \ge 1$, $a = 1$ → ugrás (2 és 1);
  12. $e^{1/x}$, $a = 0$ → végtelen (bal 0, jobb $+\infty$ – a magyarázatban említsd, hogy a bal oldal véges, a jobb végtelen);
  13. $x\sin\dfrac1x$, $a = 0$ ($f(0)$ nincs értelmezve) → megszüntethető (határérték 0 – rendőrelv).
  Lépcsős függvénynél a szakaszok végét rajzold külön (ne kösd össze függőleges vonallal: két külön `f` réteg `domain`-nel).
- Alul egy kis táblázat (statikus, `.tw`): típus | egyoldali határértékek | $f(a)$ | megszüntethető-e (azaz folytonossá tehető-e $f(a)$ átírásával?).

## `bisection` (3.6, #s36-b) – „Intervallumfelezés lépésről lépésre”
- Függvény: előbeállítások $x^3 - x - 1$ az $[1; 2]$-n (alap), $\cos x - x$ a $[0; \tfrac{\pi}{2}]$-n, $x^2 - 2$ az $[1; 2]$-n, $e^x - 3x$ a $[0; 1]$-en,
  és saját képlet (szövegmező $x$-szel, `compile`) + $a$, $b$ mezők. Ha $f(a)\cdot f(b) \gt 0$: üzenet: „Bolzano tétele itt nem garantál zérushelyet:
  $f(a)$ és $f(b)$ azonos előjelű.” Ha valamelyik végpont épp gyök, azt írd ki.
- Gombok: „Következő lépés”, „10 lépés”, „Újra”. Ábra: a görbe, az aktuális $[a_k; b_k]$ intervallum kiemelt sávként (`fillRects`, --accent-soft vagy --accent
  alacsony alfával), a felezőpont pontként, $f(a_k)$, $f(b_k)$ előjele a végpontoknál („−”, „+”). Opcionálisan „ráközelítés” kapcsoló, amely a nézetet
  az aktuális intervallumra szűkíti.
- Táblázat (görgethető, max ~15 sor): $k$ | $a_k$ | $b_k$ | $m_k$ | $f(m_k)$ előjele / értéke | új intervallum hossza. Kijelző: a gyök becslése
  ($m_k$), hibakorlát $\tfrac{b_k - a_k}{2}$, és hány lépés kell egy megadott pontossághoz: $\lceil\log_2\tfrac{b - a}{\text{pontosság}}\rceil$
  (pontosság legördülőből: 0,1 / 0,01 / 0,001 / 0,000 001).
- Elvárt számok ($x^3 - x - 1$, $[1; 2]$): $f(1) = -1$, $f(2) = 5$; $m_1 = 1{,}5$, $f(1{,}5) = 0{,}875 \gt 0$ → $[1; 1{,}5]$; $m_2 = 1{,}25$, $f = -0{,}296875$ →
  $[1{,}25; 1{,}5]$; $m_3 = 1{,}375$ ($f = 0{,}2246$) → $[1{,}25; 1{,}375]$; $m_4 = 1{,}3125$ ($f = -0{,}0515$); a 10. lépés után az intervallum
  $[1{,}32422; 1{,}32520]$ (hossza $\tfrac1{1024}$). A pontos gyök $1{,}324718$. Pontosság 0,001 → 10 lépés ($2^{-10} \lt 0{,}001$).
  $\cos x - x$: gyök $0{,}739085$. Ellenőrizd Pythonnal.

## `thermo-volume` (3.7, #s37-a) – „Hőmérő és térfogat: mennyire pontosan kell mérni?”
- Ez a fejezet nagy kérdésére válaszol: 1 kg víz térfogata a hőmérséklet függvényében, egyszerűsített modell:
  $V(T) = 1091\ \text{cm}^3$, ha $T \lt 0$ (jég), és $V(T) = 1000 + 0{,}0075\,(T - 4)^2\ \text{cm}^3$, ha $T \ge 0$ (víz). (A valódi értékek: jég 0 °C-on
  ≈ 1090,9 cm³, víz 0 °C-on ≈ 1000,16, 4 °C-on 1000,00, 20 °C-on 1001,80 – a modell ezeket kb. 0,1 cm³-re közelíti; ezt egy kis „ⓘ” megjegyzésben írd ki.)
  A $[-5; 25]$ °C tartományon rajzold; a 0-nál üres/teli karikával az ugrást (a $T = 0$ értéket a víz ágához számoljuk: $V(0) = 1000{,}12$).
  A y-tengely legyen „törve” vagy két nézet: (1) teljes nézet 995–1095 cm³ (látszik az ugrás), (2) „nagyító”: a kiválasztott $T_0$ környéke.
- Vezérlők: valódi hőmérséklet $T_0$ csúszka (−5 … 25, lépés 0,1, kezdő 20); hőmérő pontossága $\delta$ csúszka (0,01 … 2 °C, kezdő 0,5);
  megengedett térfogathiba $\varepsilon$ legördülő (0,01 / 0,1 / 1 / 10 cm³, kezdő 0,1).
- Ábra: a $[T_0 - \delta; T_0 + \delta]$ függőleges sáv (--setB, halvány) és az ebből adódó $V$-tartomány vízszintes sáv (--accent, halvány),
  valamint a $V(T_0) \pm \varepsilon$ célsáv (--ok szaggatott határ). Ha a $V$-tartomány belefér a célsávba: „✔ Elég pontos a hőmérő.” (--ok), különben „✘” (--bad).
- Kijelzők: $V(T_0)$, a legrosszabb térfogathiba $\max |V(T) - V(T_0)|$ a sávon, és a **legnagyobb jó $\delta$** az adott $\varepsilon$-hoz (képlettel:
  víz ágon $T_0 \gt 0$: $\delta^* = \min\bigl(\sqrt{(T_0 - 4)^2 + \varepsilon/0{,}0075} - |T_0 - 4|,\ \ldots\bigr)$ – egyszerűbb numerikusan: felezéssel
  a legnagyobb $\delta$, amelyre a hiba $\lt \varepsilon$, de vedd figyelembe, hogy a sáv nem nyúlhat 0 alá, mert ott ugrás van: $\delta^* \le T_0$ ha $T_0 \gt 0$;
  jég ágon $T_0 \lt 0$: $\delta^* = |T_0|$ (a jég térfogata állandó, csak a 0-t nem érheti el). $T_0 = 0$-nál: ha $\varepsilon \lt 90{,}88$, akkor
  „nincs ilyen $\delta$ – a 0 °C-nál a függvény nem folytonos: bármilyen pontos hőmérő mellett lehet, hogy jég, lehet, hogy víz”.
- Elvárt számok: $T_0 = 20$, $\varepsilon = 0{,}1$: $V(20) = 1001{,}92$, $\delta^* = 0{,}4114$ °C (a pontos érték $\sqrt{256 + 0{,}1/0{,}0075} - 16 = 0{,}41138$);
  $\delta = 0{,}5$-nél a legnagyobb hiba $0{,}0075\cdot(16{,}5^2 - 256) = 0{,}121875 \gt 0{,}1$ → ✘; $\delta = 0{,}4$ → $0{,}0972 \lt 0{,}1$ ✔.
  $T_0 = 4$, $\varepsilon = 0{,}1$: $\delta^* = \sqrt{0{,}1/0{,}0075} = 3{,}6515$. $T_0 = 0{,}5$, $\varepsilon = 0{,}1$: a víz ágon a korlát $\sqrt{(3{,}5)^2 + 13{,}33} - 3{,}5$
  helyett a bal oldali irány számít ($V$ a 4-ig csökken!) – számold numerikusan, és a 0-ig érő korlátot is (0,5). Ellenőrizd Pythonnal mindegyiket.
