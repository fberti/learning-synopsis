# Matematikai statisztika 5. fejezet – widget-útmutató (w2.js)

Fejezet: „Mintavételi eloszlások és a centrális határeloszlás-tétel”, végleges mappa: `matematikai-statisztika/05-mintaveteli-eloszlasok/`
(a build.sh hozza létre – te csak a `_parts/ms5/` mappában dolgozz). A szöveg részei: `_parts/ms5/01-s51.html` … `08-s58.html`
– ezeket párhuzamosan írom, lehet, hogy még nincsenek kész; a jelöléseket lásd lent. Ha elkészültek, olvasd el a widgeted körüli részt.

A végleges `widgets.js` így áll össze: `_parts/ms5/w0.js` (közös segédek, NE módosítsd) + `w1.js` (az enyém) + `w2.js` (a tiéd) + `w9.js` (indítás).
A te fájlod (`_parts/ms5/w2.js`) csak `W["név"] = root => { … };` definíciókat és saját, `w2`-előtagú segédeket tartalmazhat.
Olvasd el a `w0.js`-t: elérhető többek közt `css, fmt(x, d)` (tizedesvessző), `pct(x, d)` (0,4 → "40,0%"), `groupDigits, h, btn, slider,
header(root, cím, alcím-html), makeCanvas(parent, aspect, maxW)` (HiDPI; `cv.draw` téma- és méretváltáskor újrahívódik), `rangeTicks,
axes(ctx, box, {...})` → `{tx, ty}`, `vline, curve(ctx, tx, ty, fn, x0, x1, szín, vastagság, dash), stat(címke, érték), statRow(el, [[címke, érték], …])`
(KaTeX-et is renderel), `labelWrap, sliderRow(címke, min, max, step, érték, show, onInput), segmented([[érték, felirat]…], kezdő, onChange),
histo(adatok, lo, hi, k), numBox, sum, mean, sd, median, mulberry32, W`.
**Eloszlásfüggvények:** a lapon be lesz töltve az `assets/stat.js` (`window.Stat`, a w0-ban `S`):
`S.normal.pdf/cdf/inv(x, m, s)`, `S.t.pdf/cdf/inv(x, df)`, `S.chi2.pdf/cdf/inv(x, k)`, `S.f.pdf/cdf/inv(x, d1, d2)`, `S.binom.pmf/cdf(k, n, p)`,
`S.mulberry32(seed)`, `S.rnorm(rnd)`, `S.rexp(rnd, átlag)`, `S.rchi2(rnd, k)`, `S.mean/variance/sd/median`. Ezeket használd, ne írj sajátot.
Stílusmintának nézd meg a `matematikai-statisztika/04-viszonyszamok-indexek/widgets.js` widgetjeit és az `assets/style.css` widget-osztályait
(`.widget, .w-title, .w-sub, .controls, .stat-row, .stat, .readout, .btn, .btn.on`).

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)`, `pct(x, d)`, ezres tagolás `groupDigits`.
- Színek csak CSS-változókból: --accent, --setA (kék), --setB (narancs), --setC (zöld), --ok, --bad, --muted, --text, --card,
  --border, --bg-soft, --accent-soft. A színeket a szövegben ne nevezd „piros/kék”-nek – jelmagyarázatot használj.
  Világos és sötét téma is legyen olvasható (`data-theme="dark"` a `<html>`-en).
- Reszponzív: 380 px széles mobilnézetben is használható (széles táblázat: `<div class="tw" style="overflow-x:auto">`; hosszú
  szöveg ne lógjon ki). Érintéssel is működjön minden.
- Ne használj külső könyvtárat. KaTeX: a widget szövegében $…$ használható (az indítás rendereli); ha később írsz be $…$-t,
  hívd meg `window.Synopsis && Synopsis.renderMath(elem)`-et (vagy használd a `statRow`-t).
- Szimulációnál legyen rögzített kezdő mag (`S.mulberry32(…)`), hogy betöltéskor mindig ugyanaz látsszon, és legyen „Új minta / Újra” gomb.
  Nagy ismétlésszámnál (10 000) ne fagyjon le a lap: egy menetben számold, vagy `requestAnimationFrame`-mel darabold.
- Teszt: készíts tesztoldalt `_parts/ms5/wtest2.html` (minta: `_parts/ms4/wtest2.html`, de **töltsd be a `../../assets/stat.js`-t is** a
  widgets előtt; `wtest2-widgets.js` = `cat w0.js w2.js w9.js`). Indíts helyi szervert a synopsis gyökérben (`python3 -m http.server <szabad port>`,
  a végén állítsd le a PID-jével – `pkill -f`-et NE használj mintával, mert a saját shelledet is megölheti), és ellenőrizd headless
  Playwrighttal (`uv run --with playwright python -I script.py`): nincs konzolhiba, a widgetek kirajzolnak, az interakciók működnek.
  Képernyőképek világos és sötét témában, 1280 és 380 px szélességben: `_parts/ms5/shots2/`. Nézd is meg a képeket (Read tool), és javíts,
  ha valami csúnya, kilóg vagy olvashatatlan.
- Az alább megadott „elvárt számokat” ellenőrizd a böngészőben (a widgetnek pontosan ezeket kell mutatnia), és Pythonnal is
  (`uv run -q --with scipy --with numpy python -I …`).
- Munkát csak a `_parts/ms5/` mappában végezz (saját tesztszkriptek: `_parts/calc/`, `wms5_` előtaggal). /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, ismert korlátok, és ha a szövegben hibát láttál.

Jelölések (a tananyagból): sokaság: $\mu$, $\sigma$, $p$, $N$; minta: $\bar x$, $s$ (n−1-es, korrigált), $\hat p$, $n$; valószínűségi változóként
$X_1,\dots,X_n$, $\bar X$; várható érték $E(\cdot)$, szórás $D(\cdot)$; standard hiba $\mathrm{SE}$; normális eloszlás $N(m, \sigma)$ – a második
paraméter a **szórás**; standard normális eloszlásfüggvény $\Phi$; $\chi^2_k$, $t_k$ (Student), $F_{d_1, d_2}$; szabadságfok: „szf” vagy df.
Kvantilis: $t_{k;\,0{,}975}$ alakban.

---------------------------------------------------------------------------------------------------------------------------

## `galton-board` (5.3-a, #s53-a) – „Galton-deszka: sok kis véletlen lökés összege”
- Canvas: háromszög alakú szögsor (sorok száma csúszkával 1–20, kezdő 10), a golyók minden szögnél ½–½ eséllyel balra/jobbra mennek, alul tárolókba
  esnek (k jobbra lépés → k-adik tároló). Animáció: „1 golyó”, „100 golyó”, „1000 golyó” (gyorsan, pár golyó egyszerre esik), „Ürít”.
  Sebességet nem kell állítani; legyen egy „azonnal” kapcsoló/gomb, ami animáció nélkül tölti fel a tárolókat.
- A tárolók fölé rajzold opcionálisan (jelölőnégyzet, kezdetben bekapcsolva) a binomiális várt gyakoriságot és a $N(n/2, \sqrt{n}/2)$ normálgörbét
  (a golyók számára skálázva).
- Kijelzők: golyók száma, átlagos tároló (mintabeli), elméleti $n/2$, mintabeli szórás vs. elméleti $\sqrt{n}/2$.
- Elvárt: 10 sornál elméleti átlag 5, szórás 1,581; 20 sornál 10 és 2,236. Egy mondat alul: „Minden golyó helye 10 db független ±½ lépés összege – ezért harang.”

## `poll-sim` (5.4-c, #s54-c) – „Száz közvélemény-kutatás”
- Sokasági arány $p$ csúszka (0,01–0,99, lépés 0,01, kezdő 0,40), mintanagyság $n$ (gombok 50, 100, 400, 1000, 2500; kezdő 1000).
- „1 felmérés”, „100 felmérés” gomb (ugyanazzal a $p$, $n$-nel: binomiális húzás, $\hat p = k/n$; a húzáshoz összegezhetsz $n$ db egyenletes
  véletlent, vagy gyorsabban `S.binom` inverzével).
- Ábra 1 (felül): a felmérések $\hat p$ értékei pontokként egymás alatt (legfeljebb az utolsó 100), mindegyik körül vízszintes szakasz $\hat p \pm 2\,\mathrm{SE}$
  (SE itt a **mintából** becsült $\sqrt{\hat p(1-\hat p)/n}$), és egy függőleges vonal a valódi $p$-nél. Azok a szakaszok, amelyek NEM fedik le $p$-t,
  más színnel (--bad), a többi --setA. Kijelző: „lefedi $p$-t: 96 / 100”.
- Ábra 2 (alul, kicsi): az eddigi összes $\hat p$ hisztogramja, rárajzolva $N\big(p, \sqrt{p(1-p)/n}\big)$.
- Kijelzők: elméleti $\mathrm{SE} = \sqrt{p(1-p)/n}$ százalékpontban (pl. „1,55 százalékpont”), $\pm 2\,\mathrm{SE}$ sáv, a szimulált $\hat p$-k szórása,
  és a feltétel ellenőrzése: $np \ge 10$ és $n(1-p) \ge 10$ (✔ / ✘ „a normális közelítés gyenge”).
- Elvárt: p = 0,40, n = 1000 → SE = 1,55 százalékpont, 2 SE = 3,10 százalékpont; n = 400 → 2,45; n = 2500 → 0,98; p = 0,5, n = 1000 → 1,58.
  p = 0,02, n = 50 → np = 1 → ✘.
- Egy mondat: „A sáv egy mintából készül, mégis kb. 95%-uk eltalálja a valódi arányt – ez lesz a 6. fejezet konfidencia-intervalluma.”

## `t-vs-normal` (5.5-b, #s55-b) – „A t-eloszlás és a normális eloszlás”
- Csúszka: szabadságfok df 1–60 (kezdő 4), plusz gomb „∞”. Ábra: standard normális sűrűség (--muted, szaggatott) és $t_{df}$ sűrűség (--accent), x ∈ [−5; 5].
- A két farok ($|x| > 2$) árnyékolva a t-görbe alatt; kijelzők: $P(|T| > 2)$ a t-re és $P(|Z| > 2)$ a normálisra; $t_{df;\,0{,}975}$ vs. $z_{0{,}975} = 1{,}96$.
- Elvárt: df = 4: $P(|T|>2) = 0{,}116$, $t_{4;0,975} = 2{,}776$; df = 9: 0,077 és 2,262; df = 29: 0,055 és 2,045; df = 1: $t_{1;0,975} = 12{,}706$;
  normális: $P(|Z|>2) = 0{,}046$ (0,0455), 1,960.
- Kis szimulációs gomb (opcionális, de jó): „Gosset kísérlete”: 2000-szer vesz $n = df + 1$ elemű mintát $N(0,1)$-ből, kiszámolja
  $T = \bar x / (s/\sqrt n)$-t és $Z = \bar x/(1/\sqrt n)$-t; hisztogram a $T$-kről a t-görbével. Kijelző: hány %-a esett $|T| > 2$-be.

## `dist-calc` (5.5 végén, #s55-c után) – „Eloszlás-kalkulátor (tábla helyett)”
Ezt a widgetet a későbbi fejezetek is használják majd – legyen tiszta és általános.
- Eloszlás választó (segmented): „Normális”, „Student t”, „Khi-négyzet”, „F”. Paraméterek: normálisnál $m$ és $\sigma$ (numBox, kezdő 0 és 1);
  t: df (numBox 1–1000, kezdő 9); χ²: k (1–200, kezdő 9); F: $d_1$, $d_2$ (kezdő 5, 10).
- Mód (segmented): „Terület → határ (kvantilis)” és „Határ → terület”. Irány (segmented): „bal farok $P(X \lt x)$”, „jobb farok $P(X \gt x)$”,
  „két oldal (szimmetrikus)” – a két oldal csak normálisnál és t-nél aktív (χ² és F esetén rejtsd el, vagy egyenlő farok-valószínűségeket
  mutass: alsó $q_{\alpha/2}$, felső $q_{1-\alpha/2}$ – ez utóbbi a jobb, mert a 6. fejezet χ²-intervallumához kell).
- Bevitel: valószínűség (numBox 0–1, lépés 0,001, kezdő 0,975 bal farok) vagy határ x.
- Ábra: sűrűségfüggvény, a kért terület árnyékolva (--accent-soft vagy --accent áttetszően), a határ(ok) függőleges vonallal és felirattal.
- Kimenet: nagy betűs eredmény, pl. „$t_{9;\,0{,}975} = 2{,}262$” ill. „$P(T \lt 2{,}262) = 0{,}975$”, 3–4 tizedes.
- Elvárt: normális 0,975 → 1,960; P(Z < −2,5) = 0,0062; t df 9, 0,975 → 2,262; χ² k 9: 0,95 → 16,919; 0,05 → 3,325; két oldal 0,95 → 2,700 és 19,023;
  P(χ²₉ > 13,5) = 0,141; F(5, 10), 0,95 → 3,326; normális m = 500, σ = 2, P(X < 495) = 0,0062.

## `bootstrap` (5.6-b, #s56-b) – „Bootstrap: újramintavétel a saját mintából”
- Az eredeti minta pöttyökként egy számegyenesen (alapértelmezés 12 érték, egy ferde, kitalált „ingázási idő, perc” minta:
  `[12, 15, 17, 18, 20, 22, 23, 25, 28, 34, 45, 61]`; gombbal választható a kis minta `[2, 4, 9]` is (5.6-a), és „Új minta” gomb, ami 12 értéket
  húz egy exponenciális-szerű sokaságból (pl. 10 + exp(átlag 15), egészre kerekítve).
- Statisztika választó: átlag / medián / szórás (s).
- „1 bootstrap-minta” gomb: animálva (vagy legalább kiemelve) mutatja a visszatevéses húzást: n húzás, a kihúzott pöttyök kiemelése, ismétlődők
  számmal; kiírja az újraminta elemeit és a statisztika értékét. „100” és „1000” gomb: azonnal hozzáad. „Ürít”.
- Ábra: a bootstrap-statisztikák hisztogramja; függőleges vonal az eredeti minta statisztikájánál; a 2,5% és 97,5% percentilis szaggatott vonallal.
- Kijelzők: eredeti statisztika, bootstrap-ismétlések száma $R$, **bootstrap SE** (a bootstrap-statisztikák szórása), átlagnál a képlet szerinti
  $s/\sqrt n$ is összehasonlításként; percentilis-intervallum.
- Elvárt: a 12 elemű mintára átlag 26,67, medián 22,5, s = 14,05, $s/\sqrt{12} \approx 4{,}06$; a bootstrap SE az átlagra nagy R-nél
  ≈ $\sqrt{(n-1)/n}\, s/\sqrt n \approx 3{,}88$. A `[2, 4, 9]` mintánál az összes 27 újraminta pontos felsorolásával: átlagra bootstrap SE = 1,700
  ($s/\sqrt 3 = 2{,}082$), mediánra a bootstrap-eloszlás 2: 7/27, 4: 13/27, 9: 7/27. A kis mintánál legyen egy „Mind a 27 felsorolása” gomb, ami a pontos
  eloszlást mutatja (szimuláció helyett).
- Egy mondat: „Nem kell új mintát venni: a minta maga játssza a sokaság szerepét.”

## `regression-mean` (5.7-b, #s57-b) – „Regresszió a középhez: tehetség + szerencse”
- 200 kitalált „játékos”: tehetség $T \sim N(50, \sigma_T)$, két forduló pontszáma $X_1 = T + L_1$, $X_2 = T + L_2$, ahol $L_i \sim N(0, \sigma_L)$ független.
  Csúszkák: $\sigma_T$ (0–20, kezdő 10) és $\sigma_L$ (0–20, kezdő 10). „Új szezon” gomb (új mag).
- Ábra: pontdiagram $X_1$ (vízszintes) – $X_2$ (függőleges), az $y = x$ átló szaggatottan; a felső 10% (első forduló szerint) kiemelve (--setB), az alsó 10% is
  (--setA). Mellette/alatta: a két csoport átlaga az 1. és a 2. fordulóban (kis „lejtő” diagram vagy nyilak: 1. forduló → 2. forduló).
- Kijelzők: korreláció $r$ (mintabeli és elméleti $\sigma_T^2/(\sigma_T^2+\sigma_L^2)$), a felső 10% átlaga az 1. fordulóban → 2. fordulóban,
  az alsó 10% ugyanígy, és az előrejelzés $50 + r\,(\bar x_{1} - 50)$.
- Elvárt (elméleti): $\sigma_T = \sigma_L = 10$ → $r = 0{,}5$; $\sigma_L = 0$ → $r = 1$ (nincs regresszió); $\sigma_T = 0$ → $r = 0$ (teljes visszaesés az átlagra).
  Egy mondat: „Minél nagyobb a szerencse szerepe, annál erősebb a visszahúzás – senki sem »romlott el«, csak a szerencse nem ismétlődik.”
