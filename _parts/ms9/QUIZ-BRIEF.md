# Matematikai statisztika 9. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” és „Hivatkozz, ne ismételj” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/ms8/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms9/01-s91.html` … `08-s98.html` és `10-end.html`. A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel
(fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz módszerével kézzel megoldható (kerek számok!).
Kvantilist / p-értéket csak olyat használj, amit a kérdésben megadsz, vagy ami a szövegben szerepel (χ²-kritikus értékek 5%-on: df 1 → 3,84; 2 → 5,99; 3 → 7,81;
4 → 9,49; 5 → 11,07; 6 → 12,59; 8 → 15,51; 1%-on: 6,63; 9,21; 11,34; 13,28; 15,09; 16,81; 20,09; $z$: 1,645; 1,96; 2,576). Kerüld a határeseteket (a döntés ne múljon kerekítésen).
Ha a kvíz szövegében (q / hint / explain) korábbi szakaszra vagy fejezetre utalsz, az link legyen: `<a class="xref" href="#s93-c">9.3-c</a>`, illetve
`<a class="xref" href="../08-parameteres-probak/#s87-b">8.7-b</a>` (válaszopcióba ne tegyél linket).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 9.1 */
    "ms9-91": {
      title: "Kvíz – 9.1 Illeszkedésvizsgálat",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms9-final`) 12–14 (minden szakaszból 9.1–9.8 legalább egy, vegyesen; legyen benne „melyik próba kell?” típusú is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $df = k$ a $k-1$ helyett; becsült paraméter levonásának elfelejtése; homogenitásnál/függetlenségnél $df = bc - 1$ vagy $b + c - 2$;
  százalékokkal számolt χ²; egyenletes elosztás mint várt gyakoriság; a tényleges gyakoriság a nevezőben; 5-ös szabály a tényleges gyakoriságokra; p-érték duplázása χ²-nél;
  „nem vetjük el” = „bizonyítottan független / Poisson”; p-érték mint hatásnagyság (V helyett); $\chi^2 \ne z^2$ hit; Fisher-p csak a megfigyelt tábla valószínűsége;
  kétoldali Fisher-p duplázással aszimmetrikus esetben; χ²-próba kis várt gyakoriságnál; előjelpróbánál a nullák megtartása; Wilcoxonnál az előjeles értékek (nem abszolút értékek) rangsorolása;
  kötésnél egész rang; páros adatra Mann–Whitney / független adatra Wilcoxon előjeles; csoportonkénti rangsorolás; $R$ és $U$ összekeverése; „Mann–Whitney = mediánok próbája”;
  KS-nél becsült paraméterrel a normál táblázat (Lilliefors elfelejtése); KS-t diszkrét/osztályozott adatra; „a rangpróba mindig gyengébb”. Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with scipy --with numpy python -I …`), a szkriptet tedd a `_parts/calc/` mappába
  `qms9N_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet jelölései: tényleges gyakoriság $f_i$ / $f_{ij}$, várt $np_i$ / $f^*_{ij}$, peremek $f_{i\cdot}$, $f_{\cdot j}$, $N$; $\chi^2$, $df$, $k$ kategória, $m$ becsült paraméter;
  $(b-1)(c-1)$; standardizált eltérés $r_{ij}$; Cramér-féle $V$; hipergeometrikus; $W_+$, $W_-$; $R_1$, $U_1$, $U_1/(n_1n_2)$; $H$ (Kruskal–Wallis); $F_n$, $D$;
  „$H_0$-t elvetjük” / „nem vetjük el” (NE „elfogadjuk”).
- A fejezet futó példái és számai: olvasd ki a szakaszok HTML-jéből (minden szám ellenőrzött). Főbbek: érme 60/100 → $\chi^2 = 4 = z^2$; kocka 60 dobás 8, 9, 12, 11, 6, 14 → 4,2, $df = 5$, $p = 0{,}52$;
  esküdtek 5,89, $df = 3$, $p = 0{,}12$; Bortkiewicz $\hat\lambda = 0{,}61$, összevonva 3 kategória, $\chi^2 = 0{,}063$, $df = 1$, $p = 0{,}80$; A/B 20/200 vs 34/200 → 4,20 = $z^2$;
  két gép 60/30/10 vs 45/40/15 → 4,57, $df = 2$, $p = 0{,}10$ (dupla: 9,14, $p = 0{,}010$); három üzem 50/30/20 → 21,0; dohányzás × nem 2,67, $p = 0{,}10$ (dupla 5,33, $p = 0{,}021$; 2000 fő: 26,7), $V = 0{,}115$, Yates 2,16;
  lakóhely × párt 14,64, $df = 4$, $p = 0{,}0055$, $V = 0{,}11$, reziduumok község −2,31 / +2,02; 50 cég 25,98, $V = 0{,}72$; 6 csésze 1, 9, 9, 1 → 0,05 / 0,10; 8 csésze 1/70, 2/70;
  16 beteg 7|1, 2|6: egyoldali 0,020, kétoldali 0,041, χ² 6,35 ($p = 0{,}012$), Yates 4,06 ($p = 0{,}044$); a további szakaszok számait (9.5–9.8) a HTML-ből vedd.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. A KaTeX-et is ellenőrizd (pl. node + katex csomag `uv`/`npx`-szel, vagy böngészőben), hogy nincs-e renderelési hiba.
- Munkát csak a saját fájlodban (`_parts/ms9/qN.js`) és a `_parts/calc/qms9N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `ms9-91` (9.1), `ms9-92` (9.2), `ms9-93` (9.3), `ms9-94` (9.4).
- `q2.js`: `ms9-95` (9.5), `ms9-96` (9.6), `ms9-97` (9.7), `ms9-final` (az egész fejezet, a 9.8 alkalmazással együtt).
