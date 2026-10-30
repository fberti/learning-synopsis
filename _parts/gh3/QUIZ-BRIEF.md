# Gráfelmélet és hálózattudomány 3. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`matematikai-statisztika/03-ket-valtozo-kapcsolata/quizzes.js` első ~200 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/gh3/01-s31.html`, `02-s32.html` (3.2 és 3.3), `04-s34.html`, `05-s35.html`, `06-s36.html` (3.6 és 3.7), `08-s38.html` (a megfelelő szakasz HTML-je); a futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`
(4 lap: Reggeli Hírlap, Esti Krónika, Nyitott Szó, Vidéki Napló; 12 cikk; 7 szereplő: Kormány, Vízügy, Polgármester, Lakók, Önkéntesek, Szakértő, Klímaváltozás).
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis gráfos példát írhatsz,
ha a szakasz módszerével kézzel megoldható (élek felsorolásával adj meg gráfot, pl. „élek: AB, AC, BC, CD”).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 3.1 */
    "gh3-31": {
      title: "Kvíz – 3.1 Irányított gráfok",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh3-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: befok ↔ kifok felcserélése; a mátrix sor ↔ oszlop (sorösszeg = befok); irányított gráf maximális élszáma $\binom n2$ ($n(n-1)$ helyett);
  „gyengén összefüggő ⇒ mindenki elér mindenkit”; DAG-ban kör; nyers darabszám összevetése különböző méretű forrásoknál; Newman-súly $1/k$ ($1/(k-1)$ helyett), vagy $\binom k2$ súly;
  nyers ↔ Newman-erősség; a negatív él = hiányzó él; $++-$ kiegyensúlyozottnak hívése; páros gráf vetülete $B^\top B$ ↔ $BB^\top$ felcserélése; a vetületből visszaállítható a páros gráf;
  Jaccard = közös/min vagy közös/összes esemény; az egy lap által lefedett esemény megjelenik a lapvetületben; „van páratlan kör, mégis páros”; időben érvényes út csökkenő időbélyeggel;
  „az összevont gráf minden útja létezett időben”; „az időbeli elérhetőség szimmetrikus”; rétegek összevonása veszteség nélkül; hipergráf = klikk-kibontás; tudásgráf irányítatlan / egyszerű gráf;
  hiányzó hármas = hamis állítás (zárt világ). Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx python -I …`), a szkriptet tedd a
  `_parts/gh3/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: irányított gráf, $u \to v$, kifok $d^+(v)$, befok $d^-(v)$, forrás/nyelő (befok/kifok 0), irányított út, erősen/gyengén összefüggő,
  erős komponens, DAG; súly, erősség $s(v)$, normalizálás (forrás mérete; Newman-súly $\frac{1}{k-1}$); előjeles gráf, $\sigma(uv) = \pm 1$, kiegyensúlyozott/kiegyensúlyozatlan háromszög
  (csak előzetesen, részletek a 6. fejezetben); páros gráf, kétmódusú hálózat, illeszkedési mátrix $B$, vetület $BB^\top$, $B^\top B$, Jaccard, Newman-súlyozás, Kőnig tétele (páros ⇔ nincs páratlan kör);
  időbeli gráf, $(u,v,t)$, pillanatfelvétel, eseményfolyam, összevont gráf, időben érvényes út ($t_1 \le t_2 \le \dots$), ablakméret; többrétegű gráf, réteg, heterogén gráf, séma, metaútvonal,
  hipergráf, hiperél, klikk-kibontás; tudásgráf, hármas (alany, állítmány, tárgy), nyílt világ. A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve, `grafelmelet-halozattudomany/arvizhet-data.js` events/citations/relations/triples):
  Hivatkozások (cikk→cikk): 3→2, 4→1, 5→2, 5→4, 6→5, 8→7, 9→5, 9→8, 10→1, 11→7, 11→10, 12→8 (12 db, DAG, leghosszabb lánc 9→5→4→1). Lapszinten (súly): EK→RH 2, NY→EK 1, VN→RH 1, VN→NY 2;
  befok RH 3, NY 2, EK 1, VN 0; kifok VN 3, EK 2, NY 1, RH 0; erős komponensek mind egycsúcsúak, gyengén összefüggő; RH→VN éllel egyetlen erős komponens.
  Kis irányított példa A→B, B→C, C→A, C→D: kifok 1,1,2,0, befok 1,1,1,1; erős komponensek {A,B,C}, {D}.
  Erősség (nyers): Po 8, Ko 6, Vi 5, La 5, Ön 5, Sz 4, Kl 3; Newman-súly: La–Ön 2,5, Kl–Sz 1,5, Ko–Vi 1,5, Ko–Po 1,5, Vi–Po 1,5, La–Po 1,5, Po–Ön 1,5, Vi–Sz 1, Ko–Kl 0,5, Ko–Sz 0,5; Newman-erősség = a szereplőt említő cikkek száma: Po 6, Ko 4, Vi 4, La 4, Ön 4, Sz 3, Kl 2.
  Előjeles: 7 pozitív (Ko–Vi, Sz–Vi, Po–Ko, Vi–Po, La–Ön, Po–La, Po–Ön), 1 negatív (Sz–Ko); a Ko–Vi–Sz háromszög $++-$ (kiegyensúlyozatlan), Ko–Vi–Po és Po–La–Ön $+++$.
  Események: E1 {RH, EK}, E2 {NY, VN}, E3 {RH, VN}, E4 {NY}, E5 {EK} (2 cikk), E6 {RH, NY, VN}. $B$ sorösszegek RH 3, EK 2, NY 3, VN 3; $BB^\top$ nem átlós: RH–EK 1, RH–NY 1, RH–VN 2, NY–VN 2, EK–NY 0, EK–VN 0.
  Jaccard: RH–EK 0,25, RH–NY 0,2, RH–VN 0,5, NY–VN 0,5. Newman (lapvetület): RH–EK 1, RH–NY 0,5, RH–VN 1,5, NY–VN 1,5. $B^\top B$: pl. E2–E6 = 2, E1–E3 = 1, E3–E6 = 2.
  Időbeli élek napokra: H Ko–Vi, Vi–Sz; K La–Ön, Po–Vi; Sze Ko–Vi, Ko–Po, Vi–Po, Po–La; Cs Sz–Kl, Sz–Ko, Kl–Ko, La–Po, La–Ön, Po–Ön; P Ko–Po; Szo Sz–Kl, Ön–Po; V La–Ön.
  Kl-ből időben elérhető: Sz, Ko (Cs), Po (P), Ön (Szo), La (V) – a Vi NEM; Kl→La időben 4 lépés (összevontan 3).
  Rétegek (lappárok): hivatkozás EK–RH, NY–EK, VN–RH, VN–NY; közös esemény RH–EK, RH–NY, RH–VN, NY–VN; közös szereplő RH–EK 2, RH–NY 1, RH–VN 2, EK–VN 1, NY–VN 3. Rétegek száma: RH–VN, RH–EK, NY–VN 3; RH–NY 2; EK–NY 1 (csak hivatkozás); EK–VN 1 (csak szereplő); összevonva $K_4$.
  Heterogén: 29 csúcs (4 lap, 12 cikk, 7 szereplő, 6 esemény), élek: közli 12, említi 27, szól róla 12, hivatkozik 12, viszony 8. Hipergráf: 12 hiperél (9 kételemű, 3 háromelemű).
  Tudásgráf: 12 hármas, 10 entitás; a Gát befoka 3; a Polgármester kimenő élei 4.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/gh3/qN.js`) és a `_parts/gh3/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
