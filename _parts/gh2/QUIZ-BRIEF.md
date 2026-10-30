# Gráfelmélet és hálózattudomány 2. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`matematikai-statisztika/03-ket-valtozo-kapcsolata/quizzes.js` első ~200 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/gh2/01-s21.html` … `08-s28.html` (a megfelelő szakasz HTML-je); a futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`
(4 lap: Reggeli Hírlap, Esti Krónika, Nyitott Szó, Vidéki Napló; 12 cikk; 7 szereplő: Kormány, Vízügy, Polgármester, Lakók, Önkéntesek, Szakértő, Klímaváltozás).
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis gráfos példát írhatsz,
ha a szakasz módszerével kézzel megoldható (élek felsorolásával adj meg gráfot, pl. „élek: AB, AC, BC, CD”).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 2.1 */
    "gh2-21": {
      title: "Kvíz – 2.1 Séta, vonal, út, kör",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh2-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: út hossza csúcsokban (élek helyett); vonal ↔ út összekeverése (élismétlés vs. csúcsismétlés); séta = út;
  izolált csúcs kihagyása a komponensekből; „$n-1$ él ⇒ összefüggő/fa”; elvágó csúcs = legnagyobb fokszámú; elvágó csúcs ↔ híd; BFS-ben felülírt távolság, verem a sor helyett;
  átmérő ↔ átlagos úthossz ↔ sugár; nem összefüggő gráf átmérője véges számként; Dijkstra: első frissítéskor véglegesít, negatív él; erősség súlyként hosszként használva ($1/w$ helyett $w$);
  a legkevesebb élű út = legrövidebb súlyozott; Kruskal: kört záró él bevétele, a feszítőfa egyértelműnek hívése, feszítőfa = legrövidebb utak; erdő élszáma $n-c$ helyett $n-1$;
  Euler: a páratlan fokú csúcsok számának rossz feltétele (pl. „legfeljebb 2” összefüggés nélkül, „minden fok páros” nyitott vonalhoz), csúcsismétlés tiltása; Euler ↔ Hamilton felcserélése;
  Dirac-feltételből „ha nem teljesül, nincs Hamilton-kör”; $(A^k)_{ij}$ mint utak száma; $A^2$ mint elemenkénti négyzet; háromszögek száma $\operatorname{tr}(A^3)/6$ helyett $/3$ vagy $/2$.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx python -I …`), a szkriptet tedd a
  `_parts/gh2/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: séta, hossz (élek száma), zárt séta, vonal, út, kör, körmentes; összeköthető, összefüggő, komponens,
  óriáskomponens, elvágó csúcs, híd (elvágó él); távolság $\operatorname{dist}(u,v)$ (NEM $d(u,v)$ – az a fokszám!), szélességi bejárás (BFS), sor, réteg, excentricitás
  $\varepsilon(v)$, átmérő, sugár, központ, átlagos úthossz $\bar\ell$; súlyozott úthossz, Dijkstra-algoritmus, ideiglenes / végleges címke; erősség → hossz $\ell = 1/w$;
  fa, erdő, levél, feszítőfa, ciklomatikus szám $m-n+c$, Kruskal-algoritmus, minimális / maximális feszítőfa, gyökeres fa, gyökér, szülő, gyerek, mélység, BFS-fa, terjedési fa;
  Euler-vonal (nyitott / zárt), Hamilton-út, Hamilton-kör, Dirac-tétel, NP-teljes; $(A^k)_{ij}$ séták száma, közös szomszédok, $\operatorname{tr}(A^3)/6$ háromszög.
- Rögzített tények (Pythonnal ellenőrizve): Árvízhét (7 szereplő, 10 él: Ko–Vi 2, Ko–Po 2, Vi–Po 2, Vi–Sz 1, Sz–Kl 2, Sz–Ko 1, Kl–Ko 1, La–Ön 3, La–Po 2, Po–Ön 2 – a szám a súly):
  átmérő 3, sugár 2, központ {Ko, Vi, Po}, excentricitás Ko/Vi/Po 2, a többi 3; átlagos úthossz 36/21 ≈ 1,71; BFS Kl-ből: 0: Kl · 1: Sz, Ko · 2: Vi, Po · 3: La, Ön;
  elvágó csúcs: Po (nélküle {Ko,Vi,Sz,Kl} és {La,Ön}); híd nincs; Ko nélkül átmérő 4, átlagos úthossz 2,07; ciklomatikus szám 4; maximális feszítőfa súlya 12 (több is van);
  páratlan fokú: Vi, Sz → nyitott Euler-vonal Vi-ből Sz-be; Hamilton-út van (Ön, La, Po, Vi, Ko, Kl, Sz), Hamilton-kör nincs; háromszögek: 4; $(A^2)_{Ko,La}=1$, $(A^2)_{Ko,Vi}=2$, $(A^2)_{Sz,La}=0$.
  2.1 gráfja (AB, AC, BC, BD, CD, DE, EF): A→F 4 út; körök ABC, BCD, ABDC; átmérő 4, központ D. Barátsággráf (AB, AC, BC, CD): $A^2$ = [[2,1,1,1],[1,2,1,1],[1,1,3,0],[1,1,0,1]], $(A^3)_{AC}=4$.
  Települések (Sze–Hmv 25, Sze–Mak 33, Hmv–Mak 30, Sze–Kis 30, Kis–Csg 36, Hmv–Csg 37): Dijkstra Sze-ből Hmv 25, Kis 30, Mak 33, Csg 62 (Hmv-n át); minimális feszítőfa 121 km.
  Königsberg: fokok Sz 5, É 3, D 3, K 3 → nincs Euler-vonal; egy É–Sz híd nélkül nyitott vonal D és K között.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/gh2/qN.js`) és a `_parts/gh2/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
