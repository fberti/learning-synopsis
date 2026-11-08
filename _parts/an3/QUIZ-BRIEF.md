# Analízis 3. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`analizis/02-szamsorozatok-es-sorok/quizzes.js` első ~250 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/an3/00-head.html`, `01-s31.html` … `07-s37.html` és `10-end.html`. A kvíz CSAK olyat kérdezzen, ami a szakasz
szövegében szerepel (fogalmak, képletek, buktatók, módszerek) – ne vigyél be új tényt vagy új módszert. Új, kis számpéldát írhatsz,
ha a szakasz módszerével kézzel megoldható (kis, kerek számok!).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 3.1 */
    "an3-31": {
      title: "Kvíz – 3.1 A határérték szemléletesen",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`an3-final`) 12–14 (minden szakaszból 3.1–3.7 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg, pl. „0”, „3/5”, „+végtelen”, „nem létezik”, „ugrás”), `set` (items + answer: az
  elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból, pl.: $\tfrac00 = 1$ vagy $0$; határérték = helyettesítési érték; „nincs értelmezve ⇒ nincs határérték”;
  egy jó sorozat = bizonyíték; $x_n = a$ megengedése; rossz ág az egyoldali határértéknél; két egyoldali létezik ⇒ létezik a határérték;
  $\tfrac10 = +\infty$ előjelvizsgálat nélkül; lyuk ↔ aszimptota összekeverése (egyszerűsítés elmarad); csak $+\infty$ irány vizsgálata;
  „az aszimptotát nem metszi a görbe”; főegyütthatók helyett konstans tagok; előjelhiba $-\infty$-ben páratlan fokkülönbségnél;
  tagonkénti „egyszerűsítés”; gyöktényező előjelhiba; $\sqrt{x^2} = x$ ($-\infty$-ben); $\tfrac{\sin 3x}{x} \to 1$; $\tfrac{\sin x}{x} \to 1$ a végtelenben;
  fok/radián; $1^\infty = 1$; $e^{r}$ helyett $e^{rs}$ hiánya (kitevő-arány elfelejtése); $\tfrac{a^x - 1}{x} \to a$ vagy 1 ($\ln a$ helyett);
  folytonosság 3 feltételéből egy kihagyása; „folytonos = sima”; szakadástípusok felcserélése; „$\tfrac1x$ folytonos az $\mathbb R$-en”;
  ugrás folytonossá tehetőnek hitt; paraméteres feladatnál $f(a)$ elfelejtése; Bolzano folytonosság nélkül / azonos előjelre („nincs gyök”);
  felezésnél rossz fél megtartása; lépésszám elcsúszása ($2^9 = 512 \lt 1000$); Darboux „csak a köztes értékeket”; Weierstrass nyílt intervallumon;
  $\delta$ rögzítése $\varepsilon$ előtt; a legnagyobb $\delta$ helyett a nagyobbik oldal választása; kamatláb „egyszerű osztással” (11% tévhit).
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I` elég), a szkriptet tedd a `_parts/calc/` mappába
  `qan3N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: határérték $\lim\limits_{x\to a} f(x) = A$, helyettesítési érték $f(a)$, lyuk,
  átviteli elv (Heine), torlódási pont, bal/jobb oldali határérték $\lim\limits_{x\to a-}$, $\lim\limits_{x\to a+}$, $\varepsilon$–$\delta$, ablak, sáv;
  végtelen határérték, függőleges / vízszintes / ferde aszimptota; racionális (tört)függvény, főegyüttható, fokszám, polinomosztás;
  behelyettesítési szabály, kritikus alakok ($\tfrac00$, $\tfrac\infty\infty$, $\infty - \infty$, $0\cdot\infty$, $1^\infty$), „nem nulla per nulla”,
  szorzattá alakítás, gyöktényező, bővítés a konjugálttal, rendőrelv, nevezetes határértékek ($\tfrac{\sin x}{x} \to 1$, $(1 + \alpha/x)^x \to e^\alpha$,
  $(1 + x)^{1/x} \to e$, $\tfrac{e^x - 1}{x} \to 1$, $\tfrac{\ln(1 + x)}{x} \to 1$); folytonos (pontban, balról/jobbról, intervallumon), szakadás:
  megszüntethető, ugrás (elsőfajú), végtelen, oszcilláló (másodfajú), folytonossá tétel, csereszabály; Bolzano-tétel, intervallumfelezés,
  Darboux-tétel (köztesérték), Weierstrass-tétel; $\operatorname{sgn} x$, $\lfloor x\rfloor$, $\lceil t\rceil$, Dirichlet-függvény.
- A fejezet fix számai (használhatod): $\tfrac{x^2 - 1}{x - 1} \to 2$ (1-ben); $\tfrac{\sin x}{x}$: 0,84147 / 0,95885 / 0,99833 / 0,99998 ($x = 1; 0{,}5; 0{,}1; 0{,}01$);
  $\tfrac{2^x - 1}{x} \to \ln 2 \approx 0{,}6931$; $\tfrac{\sqrt{x + 9} - 3}{x} \to \tfrac16$; $\sin\tfrac{\pi}{x}$: $x = 1/n$-re 0, $x = \tfrac{2}{4n+1}$-re 1;
  $3x - 1$ a 2-ben: $\delta = \varepsilon/3$; $x^2$ a 3-ban: $\delta = \min(1; \varepsilon/7)$, $\varepsilon = 0{,}1$: 0,0143 (legnagyobb jó 0,0166);
  PT2 84: $\tfrac{x^2 - 5x + 6}{x^3 - 2x^2 - x + 2} \to -\tfrac13$; MAT1 55/b $\to -\tfrac27$; $\sqrt{x^2 + 5x} - x \to \tfrac52$;
  $\tfrac{x}{\sqrt{x^2 + 1}}$: $+\infty$-ben 1, $-\infty$-ben $-1$; $\left(\tfrac{x + 2}{x}\right)^{x + 100} \to e^2$; $\left(\tfrac{3x + 1}{3x + 3}\right)^{5x + 3} \to e^{-10/3}$;
  $\tfrac{x^2 - 3x + 2}{x^2 - 1}$: lyuk az 1-ben ($-\tfrac12$), függőleges $x = -1$ ($-1-$: $+\infty$, $-1+$: $-\infty$), vízszintes $y = 1$;
  $\tfrac{2x^2 + 3x}{x + 1}$: ferde $y = 2x + 1$; $x^3 - x - 1$ az $[1; 2]$-n: felezés 1,5 (+) → 1,25 (−) → 1,375 (+) → 1,3125 (−), gyök 1,324718, 0,001-hez 10 lépés;
  $\cos x = x$: 0,739085, 11 lépés a $[0; \pi/2]$-ből; víz modell $V(T) = 1000 + 0{,}0075(T - 4)^2$ ($T \ge 0$), jég 1091: $V(20) = 1001{,}92$,
  $\delta(20) \approx 0{,}41$ °C ($\varepsilon = 0{,}1$), $\delta(4) \approx 3{,}65$ °C, ugrás 0 °C-on 90,88 cm³; hitel 1 000 000 Ft, 370 000 Ft/év, 3 év → $p \approx 5{,}41\%$
  (nem 11%); parkolás $400\lceil t\rceil$; $\tfrac{xy}{x^2 + y^2}$ az $y = mx$ mentén $\tfrac{m}{1 + m^2}$.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz: renderelj minden $…$ részt a KaTeX node-csomaggal
  (`_parts/calc/` alatt már lehet `node_modules/katex` az előző fejezetből – nézd meg; ha nincs, `npm i katex` egy saját almappába), `throwOnError: true`-val.
- Munkát csak a saját fájlodban (`_parts/an3/qN.js`) és a `_parts/calc/qan3N_*` fájlokban végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `an3-31` (3.1), `an3-32` (3.2), `an3-33` (3.3), `an3-34` (3.4).
- `q2.js`: `an3-35` (3.5), `an3-36` (3.6), `an3-37` (3.7), `an3-final` (az egész fejezet).
