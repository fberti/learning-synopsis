# Matematikai statisztika 7. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/ms6/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms7/01-s71.html` … `09-s79.html` és `10-end.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz
módszerével kézzel (vagy a szakaszban szereplő kvantilisekkel) megoldható (kerek számok!). Kvantilist / $\Phi$-értéket csak olyat használj, amit a kérdésben megadsz, vagy ami a szövegben szerepel (1,645; 1,88; 1,96; 2,17; 2,326; 2,576; $\Phi(2) \approx 0{,}977$ stb.).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 7.1 */
    "ms7-71": {
      title: "Kvíz – 7.1 A gondolatmenet",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms7-final`) 12–14 (minden szakaszból 7.1–7.9 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: p = $P(H_0 \mid \text{adat})$ („annak valószínűsége, hogy a hatás csak véletlen”); $1-p$ = a hatás valószínűsége;
  „nem vetjük el” = „bizonyítottuk $H_0$-t”; „elfogadjuk”; hipotézis a mintáról ($\bar x$) a sokaság helyett; fordított $H_0$/$H_1$; egy- és kétoldali felcserélése, kétoldali p
  duplázásának elfelejtése vagy egyoldalinál duplázás; $\alpha$ és $\alpha/2$ kvantilis összekeverése (1,645 ↔ 1,96; NGA 3%: 1,88 ↔ 2,17); oldal választása utólag;
  „pontosan 60 fej” valószínűsége a „legalább 60” helyett; első- és másodfajú hiba felcserélése; erő = $\alpha$ vagy $\beta$; erő csökken $n$-nel; $\alpha$ és $\beta$ egyszerre csökkenthető
  azonos $n$-nél; kis p = nagy hatás; szignifikáns = fontos; p = 0,049 vs 0,051 lényegesen más; KI-n belül van, mégis elvetjük; 99%-os KI-ből 95%-os próbára következtetés;
  permutáció visszatevéssel (bootstrap-pal keverés); $1-0{,}95^{m}$ helyett $m\cdot0{,}05$ vagy $0{,}05^m$; Bonferroni $\alpha\cdot m$; p-hacking nem felismerése; stb.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with scipy python -I …`), a szkriptet tedd a `_parts/calc/` mappába
  `qms7N_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: sokaság / minta, paraméter / statisztika, $\mu$, $\sigma$, $p$, $N$ ↔ $\bar x$, $s$, $\hat p$, $n$;
  valószínűségi változóként $X_1, \dots, X_n$ (független, azonos eloszlású), $\bar X$; $E(\cdot)$, $D(\cdot)$, $D^2(\cdot)$; mintavételi eloszlás, adatok eloszlása;
  visszatevéses / visszatevés nélküli; torzítatlan; standard hiba $\mathrm{SE} = \sigma/\sqrt n$, becsült $s/\sqrt n$; $\sqrt n$-törvény; véges sokasági korrekció
  $\sqrt{(N-n)/(N-1)}$, kiválasztási arány; centrális határeloszlás-tétel (CHT); $N(m, \sigma)$ – a második paraméter a SZÓRÁS; $\Phi$;
  hibahatár $1{,}96\,\mathrm{SE}$, százalékpont; feltétel $np \ge 10$, $n(1-p) \ge 10$; $\chi^2_k$, $t_k$ (Student), $F_{d_1,d_2}$, szabadságfok,
  kvantilis $t_{k;\,0{,}975}$; bootstrap-minta, bootstrap-eloszlás, bootstrap SE, percentilis-intervallum; regresszió a középhez, $z_Y \approx r z_X$,
  tehetség + szerencse, kontrollcsoport.
- A futó példák számai (használhatod):
  * Tea: 4 csésze (2+2): $1/6$; 8 csésze (4+4): 70 választás, eltalált T-csészék 0–4: 1, 16, 36, 16, 1 eset; $P(4) = 1/70 \approx 0{,}014$, $P(\ge 3) = 17/70 \approx 0{,}243$;
    6 csésze $1/20$; 10 csésze $1/252$; 12 csésze $1/924$, $P(\ge 5) = 37/924 \approx 0{,}040$. Fisher egzakt próbája = permutációs próba.
  * Érme, 100 dobás, $H_0$: $p = 0{,}5$: $P(X \ge 55) = 0{,}184$, $P(X \ge 58) = 0{,}067$, $P(X \ge 59) = 0{,}044$, $P(X \ge 60) = 0{,}028$, $P(X \ge 61) = 0{,}018$, $P(X \ge 65) = 0{,}0018$.
    Kétoldali 5%: kritikus tartomány $X \le 39$ vagy $X \ge 61$, tényleges $\alpha = 3{,}5\%$; jobboldali: $X \ge 59$ (4,4%). 60 fej: egyoldali p = 0,028, kétoldali 0,057; normális közelítés $z = 2$ → 0,046.
    Erő (kétoldali próba): valódi $p$ = 0,55 → 0,135; 0,6 → 0,462; 0,65 → 0,828; 0,7 → 0,979. 10 dobás: $P(X \ge 7) = 0{,}172$, $P(X \ge 8) = 0{,}055$, $P(X \ge 9) = 0{,}011$; 20 dobás $P(X \ge 15) = 0{,}021$.
  * Joghurt (NGA): $\mu_0 = 200$, $\sigma = 4$, $n = 20$, $\bar x = 196$, $\alpha = 3\%$: $z = -4{,}47$; kétoldali krit. $\pm 2{,}17$, egyoldali $\pm 1{,}88$; bal- és kétoldali: elvetjük, jobboldali: nem.
    95%-os KI [194,25; 197,75]; 99%: [193,70; 198,30]. $\bar x = 199$ → $z = -1{,}12$.
  * Konzervek: $t = -0{,}58$, $p = 0{,}57$, KI [390,65; 405,35] tartalmazza a 400-at.
  * p-érték: 1000 kutatás, 10% valódi hatás, erő 80%, $\alpha$ 5% → 80 + 45 szignifikáns, 36% téves; 50% valódi → 5,9%; 1% valódi → 86%. p-tánc: $d = 0{,}5$, $n = 32$/csoport → erő ≈ 50%,
    p-értékek 10/50/90% percentilise ≈ 0,0014 / 0,05 / 0,46. $H_0$ mellett a p egyenletes.
  * Erő: IQ $\mu_0 = 100$, $\sigma = 15$, valódi 105, egyoldali 5%: $n = 25$ → 0,51; 100 → 0,95; 1%-on ($n = 25$) 0,25; valódi 110 → 0,95; $d = 1/3$; 80%-hoz $n = 56$, 90%-hoz 78.
    $d = 0{,}5$, $n = 15$ → 0,61; $n = 25$ → 0,80. Cohen: 0,2 / 0,5 / 0,8.
  * Permutáció: 7, 9, 11 vs 3, 5, 4: különbség 5, 20 felosztás, egyoldali p = 0,05, kétoldali 0,10. 8+8 diák: különbség 7,25, 12 870 felosztás, 173 ≥ → p = 0,013 (kétoldali 0,027); $t$-próba 0,011.
  * Többszörös: $1 - 0{,}95^{20} = 0{,}64$; várható téves találat 1; Bonferroni 0,0025 → 4,9%; 5 próba 0,226, 10 próba 0,401, 12 próba 0,46; genetika $5\cdot10^{-8}$. Open Science Collaboration 2015: 97% → 36%.
  * Gyakorlati: IQ 0,1 pont, $n = 10^6$ → $z = 6{,}7$; érme 50,1%, $n = 10^7$ → $z = 6{,}3$.
  * A/B-teszt: 20/200 vs 34/200 → $z = 2{,}05$, $p = 0{,}04$, különbség 7 százalékpont, KI [0,3; 13,7].
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/ms7/qN.js`) és a `_parts/calc/qms7N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `ms7-71` (7.1), `ms7-72` (7.2), `ms7-73` (7.3), `ms7-74` (7.4).
- `q2.js`: `ms7-75` (7.5), `ms7-76` (7.6), `ms7-77` (7.7), `ms7-78` (7.8), `ms7-final` (az egész fejezet, a 7.9 alkalmazással együtt). A 7.5 rövid szakasz: ott 5–6 kérdés is elég.
