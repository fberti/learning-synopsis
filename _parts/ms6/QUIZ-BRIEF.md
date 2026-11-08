# Matematikai statisztika 6. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/ms5/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms6/01-s61.html` … `08-s68.html` és `10-end.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz
módszerével kézzel (vagy a szakaszban szereplő kvantilisekkel) megoldható (kerek számok!). Kvantilist / $\Phi$-értéket csak olyat használj,
amit a kérdésben megadsz, vagy ami a szövegben szerepel (1,645; 1,96; 2,576; 2,17 (97%); $t_{14;0,975} = 2{,}145$, $t_{9;0,975} = 2{,}262$, $t_{3;0,975} = 3{,}182$, $t_{15;0,975} = 2{,}131$, $t_{24;0,975} = 2{,}064$; $\chi^2_{14}$: 5,629 és 26,119; $\chi^2_9$: 2,700 és 19,023; $\chi^2_{19}$: 8,907 és 32,852 stb.).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 6.1 */
    "ms6-61": {
      title: "Kvíz – 6.1 Pontbecslés és jó tulajdonságai",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms6-final`) 12–14 (minden szakaszból 6.1–6.8 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: torzítatlan = pontos; $s$ torzítatlannak vétele; $n$ ↔ $n-1$ nevező; $E(\hat\sigma^2_n) = \sigma^2$;
  MSE = $b + D^2$ (négyzet nélkül) vagy csak $D^2$ torzított becslésnél; állandó becslés „legjobb”, mert 0 a szórása; $x_1$ konzisztensnek vétele;
  likelihood = a paraméter valószínűsége; momentum-becslés, ami kisebb a maximumnál; ML mindig torzítatlan; $z$ ↔ $t$ (kis minta, $\sigma$ ismeretlen);
  $z_{0{,}95} = 1{,}645$ használata 95%-os kétoldali KI-hez; $\sqrt n$ elhagyása ($s$ vagy $\sigma$ a SE helyett); szabadságfok $n$; KI értelmezése:
  „95% valószínűséggel $\mu$ a sávban”, „az adatok 95%-a a sávban”, „új átlag 95%-ban a sávban”; szélesebb KI = pontosabb; 99% szűkebb;
  Wald 0/n-nél; százalék ↔ százalékpont; hibahatár ↔ teljes szélesség; $\chi^2$-kvantilisek felcserélése; szimmetrikus $s \pm \Delta$ a szórásra;
  szórás-KI nem normális sokaságra; mintanagyság lefelé kerekítve, négyzet nélkül, $p = 0{,}5$ helyett más $p$; „nagyobb sokasághoz arányosan nagyobb minta”;
  bootstrap visszatevés nélkül / kis mintán megbízhatónak vétele / torzítást javít; átfedő KI-k → „nincs különbség” stb.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with scipy python -I …`), a szkriptet tedd a `_parts/calc/` mappába
  `qms6N_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: sokaság / minta, paraméter / statisztika, $\mu$, $\sigma$, $p$, $N$ ↔ $\bar x$, $s$, $\hat p$, $n$;
  valószínűségi változóként $X_1, \dots, X_n$ (független, azonos eloszlású), $\bar X$; $E(\cdot)$, $D(\cdot)$, $D^2(\cdot)$; mintavételi eloszlás, adatok eloszlása;
  visszatevéses / visszatevés nélküli; torzítatlan; standard hiba $\mathrm{SE} = \sigma/\sqrt n$, becsült $s/\sqrt n$; $\sqrt n$-törvény; véges sokasági korrekció
  $\sqrt{(N-n)/(N-1)}$, kiválasztási arány; centrális határeloszlás-tétel (CHT); $N(m, \sigma)$ – a második paraméter a SZÓRÁS; $\Phi$;
  hibahatár $1{,}96\,\mathrm{SE}$, százalékpont; feltétel $np \ge 10$, $n(1-p) \ge 10$; $\chi^2_k$, $t_k$ (Student), $F_{d_1,d_2}$, szabadságfok,
  kvantilis $t_{k;\,0{,}975}$; bootstrap-minta, bootstrap-eloszlás, bootstrap SE, percentilis-intervallum; regresszió a középhez, $z_Y \approx r z_X$,
  tehetség + szerencse, kontrollcsoport.
- A futó példák számai (használhatod):
  * Sportolók (2, 4, 6, 8, 10; $\mu = 6$, $\sigma^2 = 8$), 3 elemű visszatevéses minták: $\bar x$, medián, $x_1$, $(\min+\max)/2$ mind torzítatlan, szórásnégyzetük
    2,67 / 5,31 / 8 / 2,34. 2 elemű mintáknál $E(s^2) = 8$, $E(\hat\sigma^2_n) = 4$; 3 eleműnél 8 és 5,33; $E(s) \approx 2{,}26$ ($n = 2$), $\sigma \approx 2{,}83$.
    $n = 3$: MSE$(s^2) = 36{,}3$, MSE$(\hat\sigma^2_n) \approx 23{,}2$.
  * Momentumok: buszvárás 2, 5, 3, 6 → $\hat\lambda = 0{,}25$; egyenletes $[0;\theta]$ 3, 7, 2, 8 → 10; 1, 2, 9 → 8 (lehetetlen; ML: 9). Poisson 2, 0, 3, 1 → 1,5.
  * ML: 10 dobás 7 fej → $L(0{,}5) = 0{,}00098$, $L(0{,}7) = 0{,}00222$ (max), $\hat p = 0{,}7$; normális ML: $\bar x$ és $\hat\sigma^2_n$ (torzított).
    Legkisebb négyzetek 3, 5, 10: $c = 6$, minimum 26; abszolút eltérésekre a medián (5).
  * Konzervek (NGA): 15 adat, $\bar x = 398$, $\sum(x-\bar x)^2 = 2464$, $s = 13{,}27$; $\sigma = 10$ ismert: 95% → $398 \pm 5{,}06$ = [392,94; 403,06]; 90% → ±4,25;
    99% → ±6,65; $t$: $t_{14} = 2{,}145$, ±7,35 → [390,65; 405,35]; σ-KI: $\chi^2_{14}$ 5,629 / 26,119 → $\sigma^2$ [94,3; 437,8], $\sigma$ [9,71; 20,92]; 90%: [10,20; 19,36].
    Mintanagyság Δ = 2,5: 61,47 → 62; N = 500: 55; $s = 13{,}27$-tel 109. Egy új átlag kb. 83%-ban esik a KI-be.
  * Arány: Zöld Út 310/1000 → [28,1%; 33,9%], ±2,87 százalékpont; 90%: ±2,4. Rádió (NGA) 176/800, 97% ($z = 2{,}17$) → [18,8%; 25,2%].
    Wald 0/20 → [0; 0], Wilson [0; 0,161], 3-as szabály 3/n; 7/10: Wald [0,416; 0,984], Wilson [0,397; 0,892], plusz négy [0,392; 0,894];
    lefedettség n = 20, p = 0,1: Wald 87,6%, Wilson 95,7%. 27%-os párt különbsége: hibahatár ±4,7 százalékpont.
  * Szórás-KI lefedettsége ($n = 15$, szimuláció): normális 95,0%, exponenciális 74,3%, egyenletes 99,5%.
  * Mintanagyság arányra (95%, $p = 0{,}5$): ±5 → 385, ±3 → 1068, ±2 → 2401, ±1 → 9604; $p = 0{,}1$, ±2 → 865; 99%, ±3 → 1844; 5000 fős város ±3 → 880.
  * Bootstrap: konzervek átlag percentilis-KI ≈ [391,6; 404,6]; medián 395, ≈ [387; 408]; szórás ≈ [9,0; 15,9] (túl szűk a $\chi^2$-hez képest);
    ingázás átlag $t$-KI [17,7; 35,6], bootstrap ≈ [19,9; 35,0].
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/ms6/qN.js`) és a `_parts/calc/qms6N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `ms6-61` (6.1), `ms6-62` (6.2), `ms6-63` (6.3), `ms6-64` (6.4).
- `q2.js`: `ms6-65` (6.5), `ms6-66` (6.6), `ms6-67` (6.7), `ms6-final` (az egész fejezet, a 6.8 alkalmazással együtt).
