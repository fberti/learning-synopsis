# Elektronika 1. fejezet – kvízírási útmutató

Synopsis tananyag (statikus magyar tanulóoldal). Témakör: *Elektromosságtan és digitális elektronika*, 1. fejezet: **Az elektromos töltés és az elektromos mező**.
Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh1/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag (a forrásod – csak ezt kérdezd): `_parts/el1/00-head.html` (bevezető), `01-s11.html` (1.1 normálalak és prefixumok; atom, ion; elemi töltés, coulomb, kvantáltság; töltésmegmaradás),
`02-s12.html` (1.2 két töltésfajta, triboelektromos sor; megosztás és polarizáció), `03-s13.html` (1.3 arányosságok; Coulomb-törvény; elektromos vs. gravitációs erő; szuperpozíció egy egyenesen),
`04-s14.html` (1.4 térerősség $E = F/q$; pontszerű töltés mezője; erővonalak, szuperpozíció), `05-s15.html` (1.5 szabad elektronok, vezető/szigetelő/félvezető; vezető a mezőben, Faraday-kalitka; ionok),
`06-s16.html` (1.6 ESD; villám; földelés; NCV), `07-s17.html` (1.7 lebegő bemenet, laborok L1.1 és L1.2, válasz a fejezet kérdésére), `10-end.html` (összefoglalás, döntési táblázat).
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz,
ha a szakasz módszerével kézzel megoldható (kis számok, egy új gondolat).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 1.1 */
    "el1-11": {
      title: "Kvíz – 1.1 Az atom és a töltés",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben; mértékegység álló betűvel
`\,\text{nC}`, `\mu\text{C}`, `\text{N/C}`; normálalak `1{,}6 \cdot 10^{-19}`.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`el1-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve, a rossz válaszok eredetét is megmondva).
- Rossz válaszok kézzel, tipikus hibákból: szorzás osztás helyett ($N = Q \cdot e$), elfelejtett/elrontott előjel (hiány ↔ többlet), m ↔ µ ↔ M összekeverése,
  cm nem váltva m-re, a négyzetre emelés előtt nem váltva (($10\,\text{cm})^2 = 0{,}1\,\text{m}^2$), $r$ a négyzet helyett ($1/r$: „kétszer messzebb → fele”),
  $k = 9 \cdot 10^{-9}$, töltések összege a szorzat helyett, „a nagyobb töltésre nagyobb erő hat”, egyforma gömbök elosztásánál előjel nélküli összeadás,
  „a pozitív töltés vándorol / protont kap”, „a vonzás bizonyítja, hogy mindkettő töltött”, megosztás ↔ polarizáció, térerősség ↔ erő (N ↔ N/C),
  negatív töltésnél a mező irányába ható erő, a próbatöltés behelyettesítése a mező képletébe a forrás helyett, szuperpozíciónál irány nélküli összeadás,
  „a félvezető félig vezet”, „a szigetelő tökéletes”, „az NCV az egyenfeszültséget is jelzi”, „ha az NCV hallgat, nincs feszültség”, „a lebegő bemenet 0”, „GND = földelés”.
  Számválaszoknál 4 opció, egységes formátumban (pl. mind normálalak, mind prefixummal).
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I`), a szkriptet tedd a `_parts/el1/` mappába `qcheckN_` előtaggal.
  A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata: töltés $Q$, próbatöltés $q$, elemi töltés $e$, elektronszám $N$, távolság $r$, erő $F$, térerősség $E$,
  Coulomb-állandó $k$; „megosztás” (influencia), „polarizáció”, „dipólus”, „triboelektromos sor”, „szuperpozíció”, „homogén mező”, „Faraday-kalitka”, „földelés”,
  „ESD”, „NCV”, „lebegő bemenet”, „átütés”.
- Rögzített tények és konvenciók (Pythonnal ellenőrizve – ezekkel számolj):
  $e = 1{,}602 \cdot 10^{-19}\,\text{C}$; $1\,\text{C} \approx 6{,}24 \cdot 10^{18}$ elektron; számpéldákban $k = 9 \cdot 10^9\,\text{N m}^2/\text{C}^2$ (a pontos 8,99 csak a gravitációs összevetésben);
  $G = 6{,}67 \cdot 10^{-11}$, $m_e = 9{,}11 \cdot 10^{-31}\,\text{kg}$, $m_p = 1{,}67 \cdot 10^{-27}\,\text{kg}$, proton ≈ 1836 elektrontömeg.
  Triboelektromos sor (+ → −): üveg · emberi haj · nejlon · gyapjú · selyem · papír · pamut · borostyán · gumi (lufi) · poliészter · PVC · teflon; a feljebb álló ad elektront → pozitív lesz.
  Franklin: a selyemmel dörzsölt üveg pozitív. Levegő átütése ≈ $3 \cdot 10^6\,\text{N/C}$ (≈ 3 kV/mm). Réz: kb. $8{,}5 \cdot 10^{22}$ szabad elektron/cm³ (≈ $1{,}4 \cdot 10^4\,\text{C}$); tiszta Si ≈ $10^{10}$/cm³.
  ESD (HBM, 100 pF): 0,02 µC ↔ 200 V; 0,2 µC ↔ 2 kV (74HC595 tűrési határa, szikra ≈ 0,7 mm); 0,3 µC ↔ 3 kV (épp érezhető, ≈ 1 mm); 1 µC ↔ 10 kV (≈ 3 mm); 1,5 µC ↔ 15 kV (≈ 5 mm); 3 kV-os kisülés energiája ≈ 0,45 mJ.
  Villám 5–20 C, csúcsáram tízezer amper nagyságrend; 15 C ≈ $9{,}4 \cdot 10^{19}$ elektron. Föld sugara 6370 km; 10 cm-es, 10 nC-os gömb földelve ≈ 1000 elektronnyi töltés marad (1,6·10⁻¹⁶ C).
  NCV: csak változó mezőt érzékel (50 Hz), megosztással; elemet/USB-t nem jelez; a hallgatása nem bizonyítja a feszültségmentességet.
  Arduino: `analogRead` 0…1023, bemeneti ellenállás ≈ 100 MΩ; a sketch 20 ms-ig (egy 50 Hz-es periódus) átlagol, ~180 mérés; A0-ra kötött drót = elektroszkóp.
  Kidolgozott példák számai: +1 nC → $6{,}24 \cdot 10^9$ hiányzó elektron; $10^{12}$ többletelektron → −160 nC; +6 és −2 nC összeérintve → +2/+2; A(+8) érinti B-t, B érinti C-t → 4, 2, 2;
  két 1 µC 10 cm → 0,9 N, 20 cm → 0,225 N; 2 nC és −3 nC 3 cm → $6 \cdot 10^{-5}$ N vonzás; H-atom $F_e/F_g \approx 2{,}3 \cdot 10^{39}$; két elektron ≈ $4{,}2 \cdot 10^{42}$; két 1 C 1 m → $9 \cdot 10^9$ N;
  +1 µC (x=0) és −1 µC (x=20 cm), +1 nC próbatöltés x=10 cm → $1{,}8 \cdot 10^{-3}$ N jobbra, x=30 cm → $8 \cdot 10^{-4}$ N balra;
  1 nC mezője 10 cm → 900 N/C, 20 cm → 225, 3 cm → 10 000; elektron 1000 N/C-ben $1{,}6 \cdot 10^{-16}$ N, $a \approx 1{,}76 \cdot 10^{14}\,\text{m/s}^2$; dipólus (±1 nC, 20 cm) közepén 1800 N/C a negatív felé; két +1 nC közepén 0.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba, mi a helyes).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. A `match` jobb oldalán ne legyen `$`.
- Munkát csak a saját fájlodban (`_parts/el1/qN.js`) és a `_parts/el1/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült kvízenként, mit ellenőriztél, és a talált szöveghibákat.
