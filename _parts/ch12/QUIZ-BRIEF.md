# 12. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében: „Kvízek” rész), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`mesterseges-intelligencia/11-konvolucios-halok/quizzes.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ch12/01-s121.html` … `08-s128.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (számok, fogalmak, buktatók, példák) – ne vigyél be új tényt.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 12.1 */
    "ai12-121": {
      title: "Kvíz – 12.1 Szövegből számok",
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
- Rossz válaszok kézzel, tipikus hibákból (elfelejtett tag, ln helyett lg, osztás softmax után, sorrend/irány megfordítása, Q/K/V
  szerepcsere, paraméterszámban kihagyott torzítás, átlag vs. összeg stb.). Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I -c …` vagy `uv run -q --with numpy python -I`),
  a szkriptet tedd a `_parts/calc/` mappába `q12N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, magyar terminológia (a fejezet szóhasználata: token, szótár, szózsák, szópár, TF-IDF, beágyazás,
  koszinusz-hasonlóság, rejtett állapot, időbeli visszaterjesztés, eltűnő gradiens, LSTM, kódoló, dekódoló, kontextusvektor,
  figyelem, lekérdezés/kulcs/érték, önfigyelem, keresztfigyelem, többfejű figyelem, pozíciókódolás, kauzális maszk,
  rétegnormalizálás, maradékkapcsolat, előrecsatolt háló (FFN), előtanítás, finomhangolás, skálázási törvény).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single` answer index érvényes, a `set` answer az items
  között van, nincs `numeric`.
- Munkát csak a `_parts/ch12/` és `_parts/calc/` mappában végezz. Ne commitolj.
