# Analízis 2. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`analizis/01-fuggvenyek-es-modellek/quizzes.js` első ~250 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/an2/00-head.html`, `01-s21.html` … `07-s27.html` és `10-end.html`. A kvíz CSAK olyat kérdezzen, ami a szakasz
szövegében szerepel (fogalmak, képletek, buktatók, módszerek) – ne vigyél be új tényt vagy új módszert. Új, kis számpéldát írhatsz,
ha a szakasz módszerével kézzel megoldható (kis, kerek számok!).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 2.1 */
    "an2-21": {
      title: "Kvíz – 2.1 Mi az a sorozat?",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`an2-final`) 12–14 (minden szakaszból 2.1–2.7 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg, pl. „0”, „3/5”, „+végtelen”, „nincs határértéke”), `set` (items + answer: az
  elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból, pl.: $(n-1)d$ helyett $nd$; $q^{n-1}$ helyett $q^n$; különbség ↔ hányados (számtani ↔ mértani);
  $a_{n+1}$ helyett $a_n + 1$; hányadosmódszer negatív tagokra; „korlátos ⇒ konvergens”; „$\to\infty$ = konvergens”; sup = max összekeverése;
  abszolút érték elhagyása a küszöbindexnél; $n \gt$ vs $n \ge$ (eggyel elcsúszott küszöb); közös nevező hiba; $\tfrac\infty\infty = 1$;
  $\infty - \infty = 0$; $1^\infty = 1$; rossz főegyüttható / előjel; $\sqrt{a+b} = \sqrt a + \sqrt b$; rendőrök különböző határral;
  fixpont-egyenlet konvergencia nélkül, rossz gyök választása; $(-q)^n$ előjel; $\sqrt[n]{2^n} \to 1$ tévhit; rangsor felcserélése;
  $(1 + x/n)^n$ helyett $e$ vagy $1$; $\tfrac{a}{1-q}$ rossz első taggal vagy $|q| \ge 1$-re; „$a_n \to 0$ ⇒ konvergens sor”;
  egyszerű kamat kamatos helyett; kerekítés a duplázódásnál (9,006 → 9 rossz); névleges összegek összeadása jelenérték helyett;
  év eleji/végi befizetés összekeverése; havi/éves kamat keverése; annuitás = hitel/n + kamat tévhit.
  Számválaszoknál 4 opció, egységes formátumban (pl. mind tört, vagy mind „… Ft” ezres tagolással).
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I` elég), a szkriptet tedd a `_parts/calc/` mappába
  `qan2N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: sorozat $(a_n)$, $a_n$ az $n$-edik tag, index, explicit / rekurzív megadás,
  számtani sorozat ($d$ differencia), mértani sorozat ($q$ kvóciens), $S_n$ részletösszeg; (szigorúan) monoton növő / csökkenő, különbség- és
  hányadosmódszer; alsó / felső korlát, korlátos, infimum, szuprémum, minimum, maximum; konvergens, határérték $\lim a_n = A$, $a_n \to A$,
  $\varepsilon$-sáv, küszöbindex $N$ („minden $n \gt N$ esetén $|a_n - A| \lt \varepsilon$”), divergens, $\pm\infty$ (tágabb értelemben vett
  határérték), „nincs határértéke”, részsorozat; műveleti szabályok, kritikus alakok; polinom per polinom (fokok, főegyüttható); konjugálttal
  bővítés; rendőrelv; mozgólépcső-tétel (monoton + korlátos ⇒ konvergens), fixpont-egyenlet; $q^n$, $\sqrt[n]a$, $\sqrt[n]n$, növekedési rangsor
  $\ln n \ll n^k \ll a^n \ll n! \ll n^n$, $e = \lim(1 + 1/n)^n$, $(1 + x/n)^n \to e^x$; végtelen sor, részletösszeg, teleszkópösszeg,
  mértani sor $\tfrac{a}{1-q}$, szükséges feltétel, harmonikus sor (Oresme), összehasonlító (majoráns/minoráns) és hányadoskritérium;
  kamattényező $q = 1 + p/100$, kamatos kamat $k_n = k_0q^n$, effektív kamatláb, folytonos kamatozás $k_0e^{pn/100}$, jelenérték $k_n/q^n$,
  gyűjtőjáradék (év eleji befizetés) $S_n = aq\tfrac{q^n-1}{q-1}$, törlesztőjáradék/annuitás $V = a\tfrac{q^n-1}{q^n(q-1)}$, örökjáradék $\tfrac{a}{q-1}$.
- A fejezet fix számai (használhatod): rádium felezési idő 1600 év, 1 kg → 10 felezés (16 000 év) után először < 1 g;
  $\tfrac{2n+1}{n+3} \to 2$, $\varepsilon = 0{,}01$: $|a_n - 2| = \tfrac5{n+3}$, $N = 497$; $a_{n+1} = \sqrt{2 + a_n}$, $a_1 = 0$ → 2;
  $n^{10}$ vs $1{,}1^n$: 686-tól nyer az exponenciális; harmonikus sor: 12 367 tag kell, hogy $S_n \gt 10$;
  Bernoulli-bank: 1 millió, évi 100%: évi 2 000 000, félévi 2 250 000, havi 2 613 035, napi 2 714 567, folytonos ≈ 2 718 282 Ft;
  5%: évi 1 050 000, havi 1 051 162, napi 1 051 267, folytonos 1 051 271 Ft; 10 000 Ft 5% 6 év → 13 401 Ft; duplázódás 5%-kal 14,2 → 15. év;
  árajánlat: 220 000 vs 140 000 + 70 000/1,07² + 70 000/1,07⁴ ≈ 254 543 Ft; gyűjtőjáradék 100 000 Ft/év, 7%, 8 év → 1 097 799 Ft;
  hitel 1 000 000 Ft, 10%, 3 év → $a \approx 402\,115$ Ft, összes kamat ≈ 206 344 Ft; örökjáradék 100 000 Ft/év, 5% → 2 000 000 Ft.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz: renderelj minden $…$ részt a KaTeX node-csomaggal
  (`npx -y katex` vagy `npm i katex` a `_parts/calc/` alatt egy saját mappába), `throwOnError: true`-val.
- Munkát csak a saját fájlodban (`_parts/an2/qN.js`) és a `_parts/calc/qan2N_*` fájlokban végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `an2-21` (2.1), `an2-22` (2.2), `an2-23` (2.3), `an2-24` (2.4).
- `q2.js`: `an2-25` (2.5), `an2-26` (2.6), `an2-27` (2.7), `an2-final` (az egész fejezet).
