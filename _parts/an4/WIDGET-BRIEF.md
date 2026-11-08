# Analízis 4. fejezet – widget-útmutató (w2.js)

Fejezet: „A derivált”, végleges mappa: `analizis/04-derivalt/` (a `build.sh` hozza létre – te csak a `_parts/an4/` mappában dolgozz).
A szöveg részei: `_parts/an4/00-head.html`, `01-s41.html` … `08-s48.html` (most készülnek; ha a widgeted körüli szakasz már megvan,
olvasd el, hogy a jelölések és a hangnem egyezzen).

A végleges `widgets.js` így áll össze: `_parts/an4/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/an4/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
Olvasd el a `w0.js`-t: elérhető `C` (= `window.Calc`, lásd `assets/calc.js`: `C.parse(src, vars)` → `{f}`, `C.canvas(parent, aspect, maxW)`
(HiDPI; `cv.draw` téma- és méretváltáskor újrahívódik – mindig állítsd be), `C.plot(cv, view, layers)` → `{tx, ty, ix, iy}` – rétegek: görbe `f`
(`domain`, `dash`, `width`), `points` (`open: true` = üres karika), `vline`, `hline`, `seg`, `text`, `param`), `fmt(x, d)` (tizedesvessző, ezres tagolás),
`css, tex, texNum, h, btn, header(root, cím, alcím-html), slider(címke, min, max, step, kezdő, onInput, [formázó]), segmented([[címke, érték], …], kezdő, onChange),
legend, PAL, col, fillRects(cv, T, rects), fillBand(cv, T, y0, y1, szín), compile(src, vars) (alapértelmezett vars = ["n"] – itt `["x"]`-et vagy `["t"]`-t adj!),
statRow(el, [[címke, érték-HTML], …]), yRange, W`.
Stílusmintának nézd meg az `analizis/03-hatarertek-es-folytonossag/widgets.js` widgetjeit és az `assets/style.css` widget-osztályait
(`.widget, .w-title, .w-sub, .controls, .stat-row, .stat .l/.v, .readout, .btn, .btn.on, .chip`).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)`.
- Színek csak CSS-változókból: --accent, --setA, --setB, --setC, --ok, --bad, --muted, --text, --card, --border, --bg-soft, --accent-soft.
  A színeket a szövegben ne nevezd „piros/kék”-nek – jelmagyarázatot használj. Világos és sötét téma is legyen olvasható
  (`data-theme="dark"` a `<html>`-en; a `C.canvas` újrarajzol témaváltáskor).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`; hosszú szöveg,
  `<code>` ne lógjon ki – kell `overflow-wrap:anywhere`). Érintéssel is működjön minden (pointer events).
- Ne használj külső könyvtárat. KaTeX: a widget szövegében $…$ használható (az indítás rendereli); ha később írsz be $…$-t, hívd meg
  `window.Synopsis && Synopsis.renderMath(elem)`-et (vagy használd a `statRow`-t / `tex()`-et). KaTeX-ben `<` helyett `\lt`.
- Teszt: tesztoldal `_parts/an4/wtest2.html` (minta: `_parts/an3/wtest2.html`; `wtest2-widgets.js` = `cat w0.js w2.js w9.js`). Helyi szerver a
  synopsis gyökérben (`python3 -m http.server <szabad port>`, a végén állítsd le a PID-jével – `pkill -f`-et NE használj), és headless Playwright
  (`uv run --with playwright python -I script.py`): nincs konzolhiba, a widgetek kirajzolnak, az interakciók működnek.
  Képernyőképek világos és sötét témában (localStorage `synopsis:theme` = light/dark), 1280 és 380 px szélességben: `_parts/an4/shots2/`.
  Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Az „elvárt számokat” ellenőrizd a böngészőben is (a widgetnek pontosan ezeket kell mutatnia) és Pythonnal (`python3 -I`, szkript a
  `_parts/calc/` mappába `wan4_` előtaggal).
- Munkát csak a `_parts/an4/` mappában (és `_parts/calc/wan4_*`) végezz. /tmp-t ne használj. Ne commitolj. Az `assets/` fájlokat ne módosítsd.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok, és ha a szövegben hibát láttál.

Jelölések (a szöveggel egyezően): derivált $f'(x)$, $\dfrac{dy}{dx}$; második derivált $f''(x)$, $\dfrac{d^2y}{dx^2}$; $n$-edik $f^{(n)}$;
tangens $\operatorname{tg} x$, kotangens $\operatorname{ctg} x$ (a beviteli mezőben `tan`/`tg` is jó); természetes logaritmus $\ln x$;
differenciahányados $\dfrac{f(x) - f(a)}{x - a}$; érintő $y = f(a) + f'(a)(x - a)$. Út–idő: $s(t)$ [m], sebesség $v(t) = s'(t)$ [m/s],
gyorsulás $a(t) = v'(t) = s''(t)$ [m/s²]. Szabályok neve: összeg, konstansszoros, szorzat (Leibniz-szabály), hányados, láncszabály
(külső függvény deriváltja a belső helyen × belső függvény deriváltja), logaritmikus deriválás ($a^b = e^{b\ln a}$).

---------------------------------------------------------------------------------------------------------------------------

## `derivative-sketcher` (4.3, #s43-a) – „Rajzold meg a deriváltat!”
- Két egymás alatti panel, közös x-tengely-tartománnyal. Felül $f$ grafikonja (--accent). Alul üres koordináta-rendszer, ahová a tanuló
  **egérrel / ujjal szabadkézzel** rajzolja $f'$ grafikonját (--setB). A rajz x-szerint mintavételezett tömb legyen (pl. 200 rekesz;
  újrarajzoláskor felülírja az adott rekeszeket, így javítani is lehet); „Törlés” gomb.
- „Ellenőrzés” gomb: megmutatja a valódi $f'$-t (--ok, szaggatott), és pontszámot ad: a megrajzolt rekeszekben az átlagos abszolút eltérés
  az alsó panel y-tartományához viszonyítva → 0–100 pont (pl. `100·max(0, 1 − 4·átlag/yspan)`), valamint a lefedettséget („a tartomány 85%-át rajzoltad meg”).
  Ha a lefedettség < 60%, kérje, hogy rajzoljon többet. Visszajelzés: ≥ 80 pont „Remek!”, 50–80 „Jó irány…”, alatta tipp.
- „Segítség” kapcsoló: ha be van kapcsolva, a felső panelen a kurzor (vagy érintés) helyén az érintő szakaszt rajzolja és kiírja a meredekségét,
  és az alsó panelen ugyanott egy kis pontot tesz a $(x; f'(x))$ helyre – így a tanuló látja a kapcsolatot („a felső meredeksége = az alsó magassága”).
- Előbeállítások (gombok): $x^2$ ($[-3; 3]$, $f' = 2x$); $x^3 - 3x$ ($[-2{,}5; 2{,}5]$, $f' = 3x^2 - 3$, nulla $\pm1$-ben); $\sin x$ ($[-2\pi; 2\pi]$, $f' = \cos x$);
  $e^x$ ($[-3; 2]$, $f' = e^x$ – „ugyanaz!”); $|x|$ ($[-3; 3]$, $f'$: $-1$ és $1$, a 0-ban nincs – a valódi deriváltat két külön ágban rajzold, a 0-ban üres karikákkal);
  $\dfrac{1}{1 + x^2}$ ($[-4; 4]$, $f' = -\dfrac{2x}{(1 + x^2)^2}$). Az $f'$-t numerikusan is számolhatod (központi differencia), de a képlet is legyen kiírva KaTeX-ben az ellenőrzés után.
- Az alsó panel y-tartománya presetenként rögzített (a valódi $f'$ tartománya + 15% ráhagyás), hogy ne áruljon el semmit, de elférjen a jó válasz.
- Alatta egy mondat: „Ahol $f$ nő, ott $f' \gt 0$; ahol csökken, $f' \lt 0$; ahol vízszintes az érintő (csúcs, völgy), ott $f' = 0$.”
- Elvárt: $x^3 - 3x$-nél $f'(0) = -3$, $f'(\pm1) = 0$, $f'(2) = 9$. Tesztben szimulálj egy „tökéletes” rajzot (pointer események a valódi $f'$ mentén) → ≥ 95 pont,
  és egy konstans 0 rajzot → alacsony pont.

## `chain-rule-gears` (4.4, #s44-d) – „Láncszabály: fogaskerekek”
- Metafora: három fogaskerék egy sorban: $x$ → $u = g(x)$ → $y = f(u)$. Ha $x$ egységnyi sebességgel forog, az $u$-kerék $g'(x)$-szer, az $y$-kerék
  $f'(u)\cdot g'(x)$-szer olyan gyorsan forog (az áttételek **szorzódnak**). Canvasra rajzolt három kerék (fogakkal, egy jelölő küllővel), mindegyik alatt a
  pillanatnyi „sebessége”. Ha valamelyik derivált negatív, a kerék ellenkező irányba forog (ezt írd is ki: „visszafelé”). Ha 0, áll.
- Vezérlők: előbeállítások (gombok):
  1. $u = 3x$, $y = 2u$ (áttétel 3 és 2 → $\dfrac{dy}{dx} = 6$, mindenhol);
  2. $u = x^2$, $y = \sin u$ ($\dfrac{dy}{dx} = \cos(x^2)\cdot 2x$);
  3. $u = 2x + 1$, $y = u^3$ ($3(2x + 1)^2\cdot 2$);
  4. $u = x^2 + 9$, $y = \sqrt u$ ($\dfrac{x}{\sqrt{x^2 + 9}}$);
  5. saját: két képletmező ($g$ az $x$-ben, $f$ az `u` változóban – `compile(src, ["u"])`).
  $x$ csúszka (pl. $[-3; 3]$, lépés 0,01), „▶ Lejátszás / ⏸” gomb (x lassan nő, a kerekek a pillanatnyi sebességgel forognak – a szög a valódi
  $u(x)$ és $y(x)$ értékből számolható: kerék-szög $= k\cdot$érték, így automatikusan helyes a sebesség).
- Kijelző (`statRow`): $x$, $u = g(x)$, $y = f(u)$, $\dfrac{du}{dx} = g'(x)$, $\dfrac{dy}{du} = f'(u)$, a szorzat, és mellette a kompozíció numerikus deriváltja
  (központi differencia, $h = 10^{-5}$) „ellenőrzés” címkével – a kettő egyezik. A deriváltakat numerikusan számold mindkét függvényre.
- Egy sor KaTeX-ben: $\dfrac{dy}{dx} = \dfrac{dy}{du}\cdot\dfrac{du}{dx}$ – „mintha a $du$ egyszerűsödne”.
- Elvárt számok: (2) $x = 1$: $u = 1$, $f'(u) = \cos 1 \approx 0{,}540$, $g' = 2$, szorzat $\approx 1{,}081$. (3) $x = 0$: $u = 1$, $f' = 3$, $g' = 2$ → 6.
  (4) $x = 4$: $u = 25$, $y = 5$, $f'(u) = 0{,}1$, $g' = 8$, $\dfrac{dy}{dx} = 0{,}8$. (1) mindenhol 6.

## `derivative-machine` (4.5, #s45-a) – „Deriválógép lépésenként”
- A tanuló beír egy kifejezést $x$-ben (szövegmező, „Deriváld!” gomb + Enter), a gép **szimbolikusan** deriválja, és **lépésenként** megmutatja, melyik
  szabályt alkalmazta. A `Calc.parse` closure-t ad, nem fát, ezért írj **saját kis parsert** (w2-előtagú segédként) ugyanazzal a nyelvtannal:
  `+ - * / ^`, zárójel, implicit szorzás (`2x`, `3(x+1)`, `x sin(x)`), unáris mínusz, függvények: `sin cos tan|tg cot|ctg exp ln sqrt` (+ `log2`, `lg` ha egyszerű),
  állandók `pi`, `e`; `sin^2(x)` = $(\sin x)^2$; tizedesvessző is (`0,5`). `e^x` → exp.
- Deriválási szabályok (mindegyikhez egy lépés-sor a listában, KaTeX-ben, a szabály nevével): konstans → 0; $x$ → 1; összeg/különbség (tagonként);
  konstansszoros; szorzat (Leibniz) $(uv)' = u'v + uv'$; hányados $\left(\dfrac uv\right)' = \dfrac{u'v - uv'}{v^2}$; hatvány konstans kitevővel $(u^n)' = n u^{n-1}\cdot u'$;
  exponenciális konstans alappal $(a^u)' = a^u \ln a\cdot u'$ (e-re $e^u u'$); $u^v$, ha mindkettő függ $x$-től → logaritmikus deriválás $u^v\left(v'\ln u + v\dfrac{u'}{u}\right)$;
  elemi függvények + láncszabály: $\sin u \to \cos u\cdot u'$, $\cos u \to -\sin u\cdot u'$, $\operatorname{tg} u \to \dfrac{u'}{\cos^2 u}$, $\operatorname{ctg} u \to -\dfrac{u'}{\sin^2 u}$,
  $e^u$, $\ln u \to \dfrac{u'}{u}$, $\sqrt u \to \dfrac{u'}{2\sqrt u}$. Ha a belső függvény maga $x$, a láncszabályt ne írja ki külön (a `·1` eltűnik).
- Egyszerűsítés (legalább): számok összevonása, $0\cdot u = 0$, $1\cdot u = u$, $u + 0 = u$, $u^1 = u$, $u^0 = 1$, $--u = u$, konstans tényezők előre, $x\cdot x$ nem kell.
  Ne erőltesd a teljes algebrai egyszerűsítést – a cél az, hogy a szabály szerinti alak olvasható legyen. Kiírás: KaTeX (`tex`), szép szorzásjel ($\cdot$), törtek `\dfrac`-kal,
  zárójelek csak ahol kell, $\sin^2 x$ helyett $(\sin x)^2$ is jó, a `tg`-t $\operatorname{tg}$-ként.
- Lépések: legfelül a teljes eredmény, alatta egy lenyitható „Lépések” lista (legfeljebb ~15 sor; mélyebb fát ne bontson ki végtelenül: „… (ugyanígy)”).
  Minden lépés: „**Láncszabály:** $(\sin(x^2))' = \cos(x^2)\cdot(x^2)'$” stílusban.
- **Numerikus ellenőrzés**: 3 véletlen (vagy rögzített: $0{,}7$; $1{,}3$; $2{,}1$) ponton hasonlítsd össze a szimbolikus derivált értékét a központi differenciával;
  ha mind egyezik (relatív hiba < 1e-5): „✔ numerikusan ellenőrizve”, egyébként figyelmeztetés. Ahol a függvény nincs értelmezve, ott más pontot válassz.
- Előbeállítás-gombok (MAT1 feladatok): `cos(x^3) - 2`, `sin(x)^3 + x - 1`, `e^(x*sin(x))`, `ln(3x^2 + 2x - 6)`, `(4 - 3x)(5 + 6x)`, `x/(x^2 + 1)`, `sqrt(x^2 + 9)`, `x^x`, `tg(sin(5x))`.
- Hibás bemenetre barátságos hibaüzenet (pl. „hiányzik: )”).
- Elvárt eredmények (ekvivalens alak elfogadható, numerikusan ellenőrizd): $(4 - 3x)(5 + 6x)$ → $-3(5 + 6x) + 6(4 - 3x)$ ($= 9 - 36x$); $\cos(x^3) - 2$ → $-\sin(x^3)\cdot 3x^2$;
  $x^x$ → $x^x(\ln x + 1)$, $x = 2$-ben $6{,}7726$; $\sqrt{x^2 + 9}$ → $\dfrac{2x}{2\sqrt{x^2 + 9}}$ (vagy $\dfrac{x}{\sqrt{x^2 + 9}}$), $x = 4$-ben $0{,}8$; $\dfrac{x}{x^2 + 1}$ → $\dfrac{(x^2 + 1) - x\cdot 2x}{(x^2 + 1)^2}$.

## `motion-graphs` (4.6, #s46-a) – „Út, sebesség, gyorsulás”
- Felül egy „pálya”: vízszintes sáv, rajta egy kis jármű/golyó a pillanatnyi $s(t)$ helyen, sebességvektor-nyíllal (hossza $\propto v$, iránya az előjel szerint),
  mellette $t$, $s$, $v$, $a$ értéke. Alatta **három egymás alatti panel** közös $t$-tengellyel: $s(t)$ (--accent), $v(t) = s'(t)$ (--setB), $a(t) = s''(t)$ (--setC),
  közös függőleges kurzorral a pillanatnyi $t$-nél. Az $s$-panelen az érintő a kurzornál (meredeksége = $v$), a $v$-panelen is (meredeksége = $a$).
- Vezérlők: $t$ csúszka, „▶ Lejátszás / ⏸” (valós idejű vagy gyorsított), előbeállítások:
  1. szabadesés $s = 5t^2$, $t \in [0; 3]$ ($v = 10t$, $a = 10$);
  2. fékező autó $s = 20t - 2t^2$, $t \in [0; 5]$ ($v = 20 - 4t$, $a = -4$; $t = 5$-nél megáll, $s = 50$ m);
  3. rezgés $s = 2\sin t$, $t \in [0; 2\pi]$ ($v = 2\cos t$, $a = -2\sin t$ – „a gyorsulás mindig a középpont felé mutat”);
  4. oda-vissza $s = t^3 - 6t^2 + 9t$, $t \in [0; 4]$ ($v = 3t^2 - 12t + 9$, megáll $t = 1$-nél és $t = 3$-nál, irányt vált);
  5. saját képlet `t` változóval (`compile(src, ["t"])`) + $t_{\max}$ mező. Deriváltak numerikusan (központi differencia; $s''$-höz $h \approx 10^{-3}$).
- Kiemelés: amikor $v = 0$ (előjelváltás), írd ki „megáll / irányt vált”; amikor $v$ és $a$ azonos előjelű: „gyorsul”, ellentétes: „lassul”.
- Elvárt számok: (1) $t = 1$: $s = 5$, $v = 10$, $a = 10$; $t = 2$: $v = 20$ m/s $= 72$ km/h. (2) $t = 2$: $s = 32$, $v = 12$, $a = -4$, „lassul”.
  (4) $t = 2$: $s = 2$, $v = -3$, $a = 0$; $t = 1$-nél $v = 0$.
