# Elektronika 0. fejezet – kvízírási útmutató

Synopsis tananyag (statikus magyar tanulóoldal). Témakör: *Elektromosságtan és digitális elektronika*, 0. fejezet: **Laborkalauz: breadboard, multiméter, Arduino**.
Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/el1/q1.js` első ~120 sorát (formátum, hangnem, magyarázatok stílusa – ez ugyanennek a témakörnek az 1. fejezete).
A tananyag (a forrásod – csak ezt kérdezd): `_parts/el0/00-head.html`, `01-s01.html` (0.1 biztonság, tíz aranyszabály), `02-s02.html` (0.2 breadboard, lábak, jumperek, L0.1),
`03-s03.html` (0.3 multiméter: aljzatok, bekötés, OL, 6000 digit, pontosság ±(a% + n)), `04-s04.html` (0.4 színkód 4/5 sáv, olvasási irány, tűrés, E12, L0.2),
`05-s05.html` (0.5 Arduino MEGA: panel, határértékek, Linux-telepítés, Blink, periódus/frekvencia/kitöltés, soros monitor), `06-s06.html` (0.6 tápforrások, tápmodul, közös GND),
`07-s07.html` (0.7 mérési napló, eltérés %, hibakeresés), `08-s08.html` (0.8 alkalmazás: mennyi az 5 V), `10-end.html` (összefoglalás, döntési táblázat).

Feladat: **egyetlen kvíz**, `el0-final` („Fejezetzáró teszt – 0. fejezet”), **16 kérdés**, minden szakaszból (0.1–0.8) legalább egy, a 0.3 (multiméter, pontosság) és a 0.4 (színkód) kettő-három.
Néhány legyen kétlépéses (pl. színkód → tűrési sáv → mért érték benne van-e; leolvasás → bizonytalanság → döntés).

Formátum: a fájlod (`_parts/el0/q1.js`) egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ fejezetzáró */
    "el0-final": {
      title: "Fejezetzáró teszt – 0. fejezet",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben; mértékegység álló betűvel `\,\Omega`, `\text{mA}`.
A kijelzett értékeket `<code>4.962</code>` alakban írd, ahogy a szöveg.)

Szabályok (kötelező):
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje; shuffle: true), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben jelenik meg, ott NE legyen KaTeX/$…$,
  csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS. Legyen legalább 1 `match` és 1–2 `multi`.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve, a rossz válaszok eredetét is megmondva).
- Rossz válaszok kézzel, tipikus hibákból: a szorzó sávot harmadik számjegynek olvasni (piros-piros-barna = „221”), 5 sávost 4 sávosként olvasni, fordított olvasási irány,
  a tűrést a mért értékre és nem a névlegesre számolni, a % a méréshatárra és nem a leolvasott értékre, a digitet 1-nek venni a felbontás helyett, rossz felbontás a méréshatáron,
  csak a % tag (digit nélkül), eltérésnél a mért értékkel osztani, OL = 0, árammérés párhuzamosan / 10A ↔ V/Ω felcserélése, Vin = 5 V, e és f sor összekötöttnek hinni, a tápsínt keresztben összekötöttnek hinni,
  $f = T$ vagy $f$ csak a bekapcsolt időből, kitöltés = $t_\text{be}/t_\text{ki}$, baud-hiba helyett hardverhibát gyanítani, közös GND hiánya.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I`), a szkriptet tedd a `_parts/el0/` mappába `qcheck1_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata: ötös csík, tápsín, árok, szakadásvizsgálat, aljzat (COM, V/Ω, 10A), párhuzamos/soros bekötés, OL, felbontás, méréshatár, „6000 digit”,
  ±(a% + n digit), névleges érték, tűrés, tűrési sáv, E12 sor, szorzó, sketch, `setup()`, `loop()`, periódusidő $T$, frekvencia $f$, kitöltési tényező, baud, soros monitor/plotter,
  `dialout` csoport, tápmodul, jumper, közös GND, mérési napló, eltérés.
- Rögzített tények (a szövegből; ezekkel számolj):
  Multiméter (MM): DCV ±(0,8% + 5), ACV ±(1,0% + 5), ellenállás ±(1,0% + 5), áram ±(2,0% + 5) felbontás 0,1 mA, 5 mA – 10 A, csak a 10A aljzat; 6000 digit;
  méréshatárok: 5,999 V (0,001), 59,99 V (0,01), 599,9 V (0,1); 599,9 Ω (0,1), 5,999 kΩ (1 Ω), 59,99 kΩ (10 Ω); ellenállás 60 MΩ-ig; okos mód: DCV 0,8 V, ACV 0,5 V fölött ismeri fel;
  APO 10 perc; 2 db AAA; a dióda/kapacitás/hőmérséklet módot gombbal kell választani; a HOLD és az NCV egy gombon.
  Ellenőrzött példák: 5,012 V → ±0,045 V (4,967–5,057); 9,43 V → ±0,125 V (9,30–9,56); 0,987 kΩ → ±14,9 Ω (972–1002); 3,301 V → ±0,031; 218,7 Ω → ±2,7 Ω; 13,6 mA → ±0,77 mA (12,8–14,4);
  9,87 kΩ → ±149 Ω; 4,962 V → ±0,045 (4,917–5,007), eltérés −0,76%; 1,000 V → ±0,013 (1,3%).
  Színkód: fekete 0 … fehér 9 (2–7 szivárvány), arany ×0,1 / ±5%, ezüst ×0,01 / ±10%, barna ±1%, piros ±2%; 220 Ω 4 sáv: piros-piros-barna-arany, 5 sáv: piros-piros-fekete-fekete-barna;
  10 kΩ 5 sáv: barna-fekete-fekete-piros-barna (fordítva olvasva 120 Ω, az is szabványos!); sárga-lila-piros = 4,7 kΩ; E12: 10 12 15 18 22 27 33 39 47 56 68 82; arány ≈ 1,21.
  Arduino MEGA: lábáram ajánlott ≤ 20 mA, abszolút 40 mA, összesen ≈ 200 mA; 3.3V ≤ 50 mA; USB-biztosíték 500 mA; Vin = külső táp (pl. 9 V); beépített LED 13; 0–1 soros; A0–A15 (0–1023);
  PWM 2–13, 44–46; `/dev/ttyACM0`, `sudo usermod -aG dialout $USER` + ki/bejelentkezés; alaplap „Arduino Mega or Mega 2560”; Blink 1000/1000 ms → T = 2 s, f = 0,5 Hz;
  250/250 → 2 Hz; 100/900 → 1 Hz, 10%; soros 115200 baud.
  Tápok: USB 4,75–5,25 V (szabvány); MB102 tápmodul 5 / 3,3 V sínenként jumperrel, bemenet 6,5–12 V vagy USB; 9 V elem ≈ 500 mAh, 500/25 = 20 h; két táp esetén közös GND.
  Breadboard: 830 pont = 630 (63 oszlop × 10) + 200 (4 tápsín); a–e és f–j csíkok; árok; tápsín néha középen megszakítva.
  LED anód = hosszabb láb; elektrolit: csík = −.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba, mi a helyes).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-szkripttel nézd meg, hogy minden kérdésnek van hint-je és
  explain-je, a `single`/`multi` answer indexei érvényesek, a `set` answer-elemei szerepelnek az items között, nincs `numeric`, és a `match` jobb oldalán nincs `$`.
- Munkát csak a saját fájlodban (`_parts/el0/q1.js`) és a `_parts/el0/qcheck1_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült, mit ellenőriztél, és a talált szöveghibákat.
