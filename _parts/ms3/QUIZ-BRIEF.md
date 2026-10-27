# Matematikai statisztika 3. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`matematikai-statisztika/02-egy-valtozo-leirasa/quizzes.js` első ~200 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms3/01-s31.html` … `08-s38.html` és `10-end.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz
módszerével kézzel megoldható.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 3.1 */
    "ms3-31": {
      title: "Kvíz – 3.1 A kapcsolatok fajtái",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms3-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $H$ és $H^2$ összekeverése; $\min\{b-1,c-1\}$ elfelejtése; $\chi^2$ mint szorosság;
  sor- és oszlopszázalék felcserélése; kovariancia nagysága mint erősség; $r$ mint százalék vagy meredekség; $r^2$ helyett $r$;
  $n^3-n$ helyett $n^3$ vagy $n^2-1$; kötésnél egymás utáni rangok; párok számának elszámolása; korreláció → okság; Simpson-nál
  az összesített arány elhivése; ökológiai tévkövetkeztetés; előjel-korrelációnál a 0 szorzatú pont beszámítása stb.
  Számválaszoknál 4 opció, egységes formátumban (pl. mind 3 tizedes, tizedesvesszővel).
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with numpy --with scipy python -I …`),
  a szkriptet tedd a `_parts/calc/` mappába `qms3N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: függetlenség / sztochasztikus / függvényszerű kapcsolat; asszociáció,
  vegyes kapcsolat, korreláció, rangkorreláció; kontingencia-tábla, peremgyakoriság, sorszázalék, várt (elméleti) gyakoriság $f^*_{ij}$,
  felül-/alulreprezentáció, $\chi^2$, Cramér-féle $V$, Yule-féle $Q$; belső/külső variancia $\sigma_B^2$, $\sigma_K^2$, $H^2$, $H$;
  pontdiagram, előjel-korreláció $K_r$, kovariancia $C$ ($n$-es nevező), Pearson-féle $r$, determinációs együttható $r^2$;
  Spearman-féle $\rho$, Kendall-féle $\tau$, egyetértő/ellentétes pár; zavaró változó, rétegzés, fordított okság, látszólagos korreláció,
  Simpson-paradoxon, ökológiai tévkövetkeztetés.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/ms3/qN.js`) és a `_parts/calc/qms3N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
