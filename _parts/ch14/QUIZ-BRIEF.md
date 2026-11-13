# 14. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében: „Kvízek” rész), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`mesterseges-intelligencia/11-konvolucios-halok/quizzes.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ch14/01-s141.html` … `09-s149.html` (és az összefoglaló/szómagyarázó: `10-end.html`) (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (számok, fogalmak, buktatók, példák) – ne vigyél be új tényt.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 14.1 */
    "ai14-141": {
      title: "Kvíz – 14.1 Mit jelent generálni?",
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
  a szkriptet tedd a `_parts/calc/` mappába `q14N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, magyar terminológia (a fejezet szóhasználata: generatív / diszkriminatív modell, eloszlás, mintavétel, empirikus
  eloszlás, memorizálás, negatív log-likelihood (NLL), bit, meglepetés, Laplace-simítás, láncszabály, autoregresszív modell, Markov-feltevés,
  hőmérséklet, kiegészítés, autoenkóder, kódoló, dekódoló, szűk keresztmetszet, látens kód / látens tér, rekonstrukciós hiba, zajszűrő
  autoenkóder, interpoláció, VAE, reparaméterezés, prior, KL-tag, ELBO, generátor (hamisító), diszkriminátor (detektív), optimális detektív
  D*, nem telítődő veszteség, minimax, módusösszeomlás, zajosítás (előre irányú folyamat), zajütemezés, ᾱ_t, zajtalanító, x̂_0, DDPM,
  DDIM, ideális zajtalanító, flow matching, feltétel, osztályozómentes irányítás (s), látens diffúzió, DiT, FID, pontosság, felidézés,
  legközelebbi tanítókép, kinyerés, duplikátum, model collapse, deepfake, vízjel, eredetigazolás (C2PA)).
  A futó példa: 2 × 2-es képek, pixelsorrend bal fent, jobb fent, bal lent, jobb lent; tíz rajz: 1100 ×3, 0011 ×2, 1010 ×2, 0101 ×2,
  1001 ×1. A 14.9 alkalmazás számai a `09-s149.html` táblázataiban vannak.
- A 📅 dobozok (modellnevek, jogi ügyek, dátumok) közül legfeljebb egy-két kérdés legyen, és csak arról, ami a szövegben szerepel.
- A szövegben {{…}} alakú helyőrzők is lehetnek (még nem végleges számok) – ezekre NE építs kérdést.
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single` answer index érvényes, a `set` answer az items
  között van, nincs `numeric`.
- Munkát csak a `_parts/ch14/` és `_parts/calc/` mappában végezz. Ne commitolj.
