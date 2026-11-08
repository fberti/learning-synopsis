# Analízis 4. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`analizis/03-hatarertek-es-folytonossag/quizzes.js` első ~250 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/an4/00-head.html`, `01-s41.html` … `08-s48.html` (és később `10-end.html`). A kvíz CSAK olyat kérdezzen, ami a szakasz
szövegében szerepel (fogalmak, képletek, buktatók, módszerek) – ne vigyél be új tényt vagy új módszert. Új, kis számpéldát írhatsz,
ha a szakasz módszerével kézzel megoldható (kis, kerek számok!).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 4.1 */
    "an4-41": {
      title: "Kvíz – 4.1 Átlagos és pillanatnyi változás",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`an4-final`) 12–14 (minden szakaszból 4.1–4.8 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg, pl. „2x”, „cos x”, „1/x”, „nem deriválható”), `set` (items + answer: az
  elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból, pl.: változás ↔ változási sebesség (nem osztott $\Delta x$-szel); kivonási sorrend csak az egyik helyen megfordítva;
  behelyettesítés $h = 0$-val egyszerűsítés előtt ($\tfrac00$); „kis $h$ = pontos érték” (10,005 a 10 helyett); $f'(a)$ ↔ $f(a)$ összekeverése; $(a + h)^2 = a^2 + h^2$;
  érintő egyenleténél $f(a)$ vagy $(x - a)$ elhagyása / előjelhiba; „az érintőnek egy közös pontja van”; folytonos ⇒ deriválható; nem deriválható ⇒ nem folytonos;
  csak a darabok deriváltjának összevetése a folytonosság nélkül; végtelen derivált = deriválható; negatív kitevő „növelése” ($-3x^{-2}$); nevező deriválása;
  $(\cos x)' = \sin x$; fok/radián; $(a^x)' = x a^{x - 1}$; $(e^x)' = xe^{x - 1}$; $(\ln x)' = \tfrac{1}{x\ln x}$ stb.; $(fg)' = f'g'$; hányadosnál felcserélt számláló / $g$ négyzet hiánya / $\tfrac{f'}{g'}$;
  láncszabálynál a belső derivált elmarad vagy a külső deriváltja nem a belső helyen; $\sin^2 x$ ↔ $\sin(x^2)$; inverz függvénynél rossz pontban vett derivált;
  $(x^x)' = x\cdot x^{x - 1}$ vagy $x^x\ln x$; implicitnél $(y^2)' = 2y$; $f'' = (f')^2$; szinusz-ciklus elcsúszása; faktoriális elmaradása;
  $dy = \Delta y$; relatív hiba hatványnál nem $n$-szeres; határköltség ↔ átlagköltség; mértékegység.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I` elég), a szkriptet tedd a `_parts/calc/` mappába
  `qan4N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: átlagos / pillanatnyi változási sebesség, differenciahányados, szelő, érintő,
  derivált (differenciálhányados) $f'(a)$, deriváltfüggvény, $\dfrac{dy}{dx}$, deriválható (differenciálható), bal / jobb oldali derivált $f'_-(a)$, $f'_+(a)$,
  törés, függőleges érintő; összeg-, konstansszoros-, szorzat- (Leibniz-), hányados-, láncszabály, inverz függvény deriváltja; logaritmikus és implicit deriválás;
  második / $n$-edik derivált $f''$, $f^{(n)}$, $\dfrac{d^2y}{dx^2}$; út $s(t)$, sebesség $v(t)$, gyorsulás $a(t)$; lineáris közelítés $f(a + h) \approx f(a) + f'(a)h$,
  differenciál $dy = f'(x)\,dx$, relatív hiba; határköltség $C'(q)$, határbevétel $R'(q)$, átlagköltség, rugalmasság (csak említés szintjén, kitekintés).
  Tangens: $\operatorname{tg} x$, kotangens $\operatorname{ctg} x$, $\operatorname{arctg}$.
- A fejezet fix számai (használhatod): kő $s = 5t^2$: átlag $[0; 2]$ 10 m/s, $[1; 2]$ 15 m/s, $[2; 3]$ 25 m/s; $[1; 1 + h]$: $10 + 5h$ (15; 10,5; 10,05; 10,005; $h = -0{,}1$: 9,5);
  $v(1) = 10$, $v(2) = 20$ m/s = 72 km/h, $v(3) = 30$; $a = 10$ m/s²; $x^2$ szelő $a$ és $b$ között $a + b$; $(x^2)'$ a 3-ban 6; $\tfrac1x$: $f'(2) = -\tfrac14$, érintő $y = 1 - \tfrac x4$;
  $x^2$ érintője az 1-ben $y = 2x - 1$; $x^3$ érintője az 1-ben $y = 3x - 2$ (újra metsz a $-2$-ben); $x^2 - 4x$ vízszintes érintő $x = 2$;
  $|x|$: $f'_- = -1$, $f'_+ = 1$; $\sqrt[3]x$ a 0-ban: $+\infty$ (nem deriválható); $x|x|$ a 0-ban deriválható, 0; MAT1 63 (0 / $x$): nem, MAT1 64 (0 / $x^2$): igen;
  $2^x$ a 0-ban $\ln 2 \approx 0{,}6931$; $(5^x)'$ az 1-ben $5\ln 5 \approx 8{,}047$, $(x^5)'$ az 1-ben 5; $\bigl((4 - 3x)(5 + 6x)\bigr)' = 9 - 36x$; $\left(\tfrac{x}{x^2 + 1}\right)' = \tfrac{1 - x^2}{(x^2 + 1)^2}$ (a 2-ben $-0{,}12$);
  $(\operatorname{tg} x)' = \tfrac{1}{\cos^2 x}$; $(\sin x^2)'$ az 1-ben $2\cos 1 \approx 1{,}081$; $\left(\sqrt{x^2 + 9}\right)'$ a 4-ben 0,8; $(\sqrt x)'$ a 9-ben $\tfrac16$ (az $x^2$ meredeksége a 3-ban 6);
  $(\operatorname{arctg} x)'$ az 1-ben $\tfrac12$; $(x^x)' = x^x(\ln x + 1)$, a 2-ben $6{,}7726$ (rossz: 4 és $2{,}7726$); kör $x^2 + y^2 = 25$ a $(3; 4)$-ben $y' = -\tfrac34$; $xy = 6$ a $(2; 3)$-ban $-\tfrac32$;
  $x^2 + xy + y^2 = 7$ az $(1; 2)$-ben $-\tfrac45$; fékező autó $s = 20t - 2t^2$: $v = 20 - 4t$, $a = -4$, megáll $t = 5$, 50 m; $v = 10$ m/s $t = 2{,}5$-nél, 37,5 m;
  $\sin^{(2026)} x = -\sin x$; $(e^{2x})^{(10)} = 1024e^{2x}$; $\left(\tfrac1x\right)''' = -\tfrac{6}{x^4}$; $\sqrt{4{,}1} \approx 2{,}025$ (pontos 2,024 846); $\sin 0{,}1 \approx 0{,}1$; $e^{0{,}02} \approx 1{,}02$;
  $1{,}01^{10} \approx 1{,}1$ (1,104 62); $1{,}02^{50}$: közelítés 2, valódi 2,69; $x^2$ a 3-ban $dx = 0{,}1$: $\Delta y = 0{,}61$, $dy = 0{,}6$; kör $r = 10 \pm 0{,}1$: $dA \approx 6{,}28$ cm², 2%;
  víz $V'(T) = 0{,}015(T - 4)$, $V'(20) = 0{,}24$, $\Delta T \approx 0{,}417$ (pontos 0,411); $C(q) = 200 + 5q + 0{,}01q^2$: $C'(100) = 7$, $C(101) - C(100) = 7{,}01$, átlag 8;
  $R = 20q - 0{,}01q^2$: $R' = C'$ $q = 375$-nél, profit 2612,5; $B = 1000\cdot 1{,}05^t$: $B'(0) \approx 48{,}8$, relatív ütem 4,88%; rugalmasság $q = 100 - 2p$, $p = 20$: $-0{,}67$.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz: renderelj minden $…$ részt a KaTeX node-csomaggal
  (`_parts/calc/` alatt lehet már `node_modules/katex` az előző fejezetekből – nézd meg, pl. `find _parts -maxdepth 3 -name katex -type d`; ha nincs, `npm i katex` egy saját almappába), `throwOnError: true`-val.
- Munkát csak a saját fájlodban (`_parts/an4/qN.js`) és a `_parts/calc/qan4N_*` fájlokban végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `an4-41` (4.1), `an4-42` (4.2), `an4-43` (4.3), `an4-44` (4.4).
- `q2.js`: `an4-45` (4.5), `an4-46` (4.6), `an4-47` (4.7), `an4-48` (4.8), `an4-final` (az egész fejezet).
