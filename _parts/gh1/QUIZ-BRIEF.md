# Gráfelmélet és hálózattudomány 1. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`matematikai-statisztika/03-ket-valtozo-kapcsolata/quizzes.js` első ~200 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/gh1/01-s11.html` … `07-s17.html` (a megfelelő szakasz HTML-je); a futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`
(4 lap: Reggeli Hírlap, Esti Krónika, Nyitott Szó, Vidéki Napló; 12 cikk; 7 szereplő: Kormány, Vízügy, Polgármester, Lakók, Önkéntesek, Szakértő, Klímaváltozás).
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis gráfos példát írhatsz,
ha a szakasz módszerével kézzel megoldható (élek felsorolásával adj meg gráfot, pl. „élek: AB, AC, BC, CD”).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 1.1 */
    "gh1-11": {
      title: "Kvíz – 1.1 Pontok és vonalak",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh1-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $m = \sum d$ (elfelejtett felezés); $\binom n2$ helyett $n^2$ vagy $n(n-1)$; a hurok 1-nek számolva;
  $P_n$ élszáma $n$ ($n-1$ helyett); csillag csúcsszáma $n$ ($n+1$ helyett); a mátrix elemösszege mint $m$ (pedig $2m$); sűrűség $m/n^2$ vagy $m/n$;
  együttes említés = egyetértés/kapcsolat; hiányzó él = nincs kapcsolat a valóságban; „azonos fokszámsorozat ⇒ izomorf”; „másképp rajzolt ⇒ más gráf”;
  szomszédos ↔ elérhető összekeverése; páros fokszámösszeg ⇒ biztosan rajzolható; fokszám ↔ erősség összekeverése; komplementer élszáma $n-m$ stb.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx python -I …`), a szkriptet tedd a
  `_parts/gh1/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: gráf $G=(V,E)$, csúcs, él, $uv$, szomszédos, illeszkedik, $n$, $m$; élszabály
  („az él egy állítás”); fokszám $d(v)$, izolált csúcs, levél, fokszámsorozat, kézfogási lemma, átlagos fokszám $\bar d = 2m/n$; éllista,
  szomszédsági lista $N(v)$, szomszédsági mátrix $A$, sűrűség $\rho = m/\binom n2$, ritka/sűrű; $(V,E,\varphi)$, hurokél, párhuzamos (többszörös) él,
  egyszerű gráf, multigráf, súlyozott gráf, súly, erősség; $K_n$, $P_n$ ($n$ csúcs), $C_n$, csillag $K_{1,n}$, üres gráf, klikk; komplementer
  $\overline G$, izomorfia, invariáns. Szereplőgráf, cikkgráf, cikk–szereplő gráf, lapgráf.
- Árvízhét-tények, amikre építhetsz (Pythonnal ellenőrizve): teljes szereplőgráf $n=7$, $m=10$; fokszámok Ko 4, Po 4, Vi 3, Sz 3, Kl 2, La 2, Ön 2;
  erősségek Po 8, Ko 6, Vi 5, La 5, Ön 5, Sz 4, Kl 3; sűrűség $10/21 \approx 0{,}48$; átlagos fokszám $\approx 2{,}86$; a multigráfnak 18 éle van;
  komplementer 11 él (pl. Ko–La, Ko–Ön, Po–Sz); lapgráfok: RH $K_3$ (Ko,Vi,Po), EK háromszög+levél (Sz középpont, 3), NY $K_3$ (La,Ön,Po), VN $K_{1,3}$ (Po középpont);
  RH ≅ NY. A négy cikkes (2,5,8,10) szereplőgráf: 7 csúcs, 9 él, sorozat (4,4,2,2,2,2,2); cikkgráf 4 csúcs, 4 él; lapgráf (teljes hét, közös szereplő): 5 él, csak EK–NY hiányzik.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/gh1/qN.js`) és a `_parts/gh1/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
