# 13. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében: „Kvízek” rész), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`mesterseges-intelligencia/11-konvolucios-halok/quizzes.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ch13/01-s131.html` … `11-s1311.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (számok, fogalmak, buktatók, példák) – ne vigyél be új tényt.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 13.1 */
    "ai13-131": {
      title: "Kvíz – 13.1 Gráfok mint adat",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból (elfelejtett tag, ln helyett lg, sorrend/irány megfordítása, önhurok elfelejtése, fokszám önhurok nélkül,
  szerepcsere, paraméterszámban kihagyott torzítás, átlag vs. összeg stb.). Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I -c …` vagy `uv run -q --with numpy python -I`),
  a szkriptet tedd a `_parts/calc/` mappába `q13N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, magyar terminológia (a fejezet szóhasználata: gráf, csúcs, él, szomszéd, fokszám, szomszédsági mátrix,
  szomszédsági lista, éllista, séta, csúcs-/él-/gráfszintű feladat, transzduktív, induktív, permutáció, átszámozás, invariáns,
  ekvivariáns, üzenetküldés, gyűjtés (aggregálás), frissítés, recepciós mező, számítási fa, önhurok, GCN, normalizálás, Laplace-mátrix,
  félig felügyelt tanulás, címketerjesztés, GraphSAGE, mintavétel, GAT, figyelmi súly, GIN, multihalmaz, kiolvasás, kapcsolat-előrejelzés,
  negatív mintavétel, üzenetküldő élek, vázfelosztás, Weisfeiler–Leman-teszt (1-WL; „Leman”, nem „Lehman”!), túlsimítás, túlnyomás,
  homofília, heterofília, virtuális csúcs, újrahuzalozás, gráf-Transformer, pozíciókódolás, véletlenséta-kódolás, E(3)-invariancia,
  ekvivariancia, EGNN, geometriai mélytanulás, GraphRAG). A futó példa: Anna, Bence, Csilla, Dávid, Emese (A–E), élek A–B, A–C, B–C,
  B–D, D–E, x = (1; 0; 0; 0; 5).
- A szövegben {{…}} alakú helyőrzők is lehetnek (még nem végleges számok) – ezekre NE építs kérdést.
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single` answer index érvényes, a `set` answer az items
  között van, nincs `numeric`.
- Munkát csak a `_parts/ch13/` és `_parts/calc/` mappában végezz. Ne commitolj.
