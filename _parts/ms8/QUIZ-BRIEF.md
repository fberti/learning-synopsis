# Matematikai statisztika 8. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/ms7/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms8/01-s81.html` … `09-s89.html` és `10-end.html`. A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel
(fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz módszerével kézzel megoldható (kerek számok!).
Kvantilist / $\Phi$-értéket / p-értéket csak olyat használj, amit a kérdésben megadsz, vagy ami a szövegben szerepel
(1,645; 1,96; 2,576; $t_{4;\,0{,}975} = 2{,}776$; $t_{15;\,0{,}975} = 2{,}131$; $F_{12,10;\,0{,}975} = 3{,}62$; $\chi^2_{19;\,0{,}95} = 30{,}14$ stb.). Kerüld a határeseteket (a döntés ne múljon kerekítésen).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 8.1 */
    "ms8-81": {
      title: "Kvíz – 8.1 Egymintás u-próba",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms8-final`) 12–14 (minden szakaszból 8.1–8.9 legalább egy, vegyesen; legyen benne „melyik próba kell?” típusú is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $\sigma$ a $\sigma/\sqrt n$ helyett; standard hibák összeadása a szórásnégyzeteké helyett; szórások kivonása;
  egy- és kétoldali kvantilis keverése (1,645 ↔ 1,96); egyoldali p duplázása / kétoldalinál a duplázás elfelejtése; $z$-kvantilis $t$ helyett kis mintán;
  rossz szabadságfok ($n$ vs. $n-1$; $n_1 + n_2 - 2$ Welch-nél; $\min(n_1,n_2)-1$); $s$ számolása $n$-nel osztva; páros adat független mintásként és fordítva;
  közös szórásos t nagyon eltérő szórásoknál és csoportméreteknél; F-próba szórásokkal (nem négyzetekkel), kisebb a számlálóban, szabadságfokok sorrendje;
  F-próba nem normális adatra („nagy minta megoldja”); egy arány SE-je $\hat p$-vel vagy $n-1$-gyel (NGA-hiba); $np_0 \lt 10$ mellett normális közelítés;
  két arány próbája összevont arány nélkül; belenézés; csoportonkénti vs. teljes $n$; feleakkora hatás → kétszer (négyszer helyett) akkora minta;
  „nem vetjük el” = „bizonyítottuk $H_0$-t” / „egyformán pontosak”; utólagos erő a megfigyelt hatással; „egyik szignifikáns, a másik nem → különböznek”.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with scipy --with numpy python -I …`), a szkriptet tedd a `_parts/calc/` mappába
  `qms8N_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet jelölései: $\mu$, $\mu_0$, $\sigma$, $\bar x$, $s$, $n$, $s_p^2$ (közös szórásnégyzet), $\bar d$, $s_d$, $\hat p$, $p_0$, összevont $\hat p$;
  $z$ (u-próba statisztikája), $t$, $df$, $t_{df;\,0{,}975}$, $\chi^2_{n-1}$, $F_{d_1,d_2;\,0{,}975}$; $\Phi$; $d = \Delta/\sigma$ (Cohen); erő $1-\beta$;
  „$H_0$-t elvetjük” / „nem vetjük el” (NE „elfogadjuk”); u-próba = angol z-test.
- A futó példák számai (használhatod):
  * 8.1 cukorzacskók: $\sigma = 10$, $\mu_0 = 500$. 4 zacskó (488, 497, 499, 500): $\bar x = 496$, SE 5, $z = -0{,}8$, kétoldali p 0,42. 25 zacskó, $\bar x = 496$: SE 2, $z = -2$,
    kétoldali p 0,046, baloldali 0,023; 1%-on (2,576) nem vetjük el. Elfogadási tartomány (5%, kétoldali) $[496{,}08;\ 503{,}92]$; baloldali krit. 496,71; 4 zacskónál $[490{,}2;\ 509{,}8]$;
    95%-os KI $[492{,}08;\ 499{,}92]$. $n = 100$ → $[498{,}04;\ 501{,}96]$. 2 g hiány kimutatásához $n \ge 97$.
  * 8.2: két kocka $D^2(X-Y) = 35/6$; 3, 4 → 5; 5, 12 → 13. A gép $\sigma = 10$, $n = 25$, $\bar x = 496$; B gép $\sigma = 8$, $n = 16$, $\bar x = 501$: SE $\sqrt 8 \approx 2{,}83$, $z = -1{,}77$,
    kétoldali p 0,077 (nem), baloldali 0,039. 100–100 zacskóval SE 1,28, $z = -3{,}90$. Hibás „SE-k összege” $2 + 2 = 4$. 3 g különbséghez gépenként 86 zacskó.
  * 8.3: új gép 492, 497, 493, 499, 494: $\bar x = 495$, $s^2 = 8{,}5$, $s \approx 2{,}92$, SE 1,30, $t = -3{,}83$, $df = 4$, $t_{4;\,0{,}975} = 2{,}776$, p 0,019 (z-vel hibásan 0,0001).
    t vs u: $n = 16$, $\bar x = 497$, 6: $z = -2$ (p 0,046, elvetjük) vs. $t = -2$, $t_{15;\,0{,}975} = 2{,}131$ (p 0,064, nem). t-táblázat: df 2 → 4,303; 4 → 2,776; 9 → 2,262; 15 → 2,131; 29 → 2,045; 99 → 1,984.
    NGA joghurt: $t = -3{,}58$, $df = 19$, $t_{19;\,0{,}985} \approx 2{,}35$, p 0,002. Konzerv $t = -0{,}58$, p 0,57. QQ: 5 adatnál $z$ = −1,28, −0,52, 0, 0,52, 1,28; OI-szabály $n \lt 30$ / $\ge 30$.
  * 8.4: 6 dolgozó, különbségek 3, 5, −1, 4, 2, 5: $\bar d = 3$, $s_d^2 = 5{,}2$, $s_d \approx 2{,}28$, SE 0,931, $t = 3{,}22$, $df = 5$, $t_{5;\,0{,}975} = 2{,}571$, p 0,023 (egyoldali 0,012; $t_{5;\,0{,}95} = 2{,}015$);
    függetlenként SE 7,05, $t = 0{,}43$, p 0,68; $r \approx 0{,}985$. OI tankönyvárak: $n = 68$, $\bar d = 3{,}58$, $s_d = 13{,}42$, SE 1,63, $t = 2{,}20$, p 0,031.
  * 8.5: 7, 9, 11 vs 3, 5, 4: $s_p^2 = 2{,}5$, SE 1,29, $t = 3{,}87$, $df = 4$, p 0,018 (permutáció 0,10). 8+8: $t = 2{,}55$, $df = 14$, p 0,023, $s_p^2 \approx 32{,}25$, SE 2,84.
    Welch: $s_1 = 2$, $s_2 = 6$, $n = 10$–10, különbség 5: SE 2, $t = 2{,}5$, $df \approx 10{,}98$, p 0,030. ncbirths: 7,18 (1,60; 100) vs 6,78 (1,43; 50): SE 0,258, $t = 1{,}55$, $df \approx 108{,}5$, p 0,12
    (OI $df = 49$ → 0,13). 5 vs 20 fő ($s$ 10 vs 3, különbség 6): közös SE 2,49, $t = 2{,}41$, p 0,024; Welch SE 4,52, $t = 1{,}33$, $df \approx 4{,}2$, p 0,25; szimuláció: közös 28% téves riasztás, Welch 5%.
  * 8.6: joghurt $\chi^2 = 29{,}69$ vs $\chi^2_{19;\,0{,}95} = 30{,}14$, p 0,056 (nem). Karbantartás: $n = 25$, $s = 7$, $\sigma_0 = 10$: $\chi^2 = 11{,}76 \le 13{,}85$ → elvetjük.
    F: 3+3 zacskó $F = 9$, $F_{2,2;\,0{,}975} = 39$, p 0,2; két gép $s$ 6 ($n = 13$) és 4 ($n = 11$): $F = 2{,}25$, $df = (12, 10)$, krit. 3,62, p 0,21. F-próba téves riasztása igaz $H_0$ mellett
    (n = 10/25/100): normális 5%; $t_5$ 13/17/22%; exponenciális 23/28/31%; egyenletes 1,0/0,4/0,3%. Levene-próba.
  * 8.7: dohányzók 42/400 vs 0,15: SE 0,0179, $z = -2{,}52$, p 0,006 (pontos binomiális 0,0054). NGA selejt: 3/70 vs 2%: könyv $z = 0{,}942$ ($\hat p$ és $n-1$ – hibás), helyesen $z = 1{,}37$,
    de $np_0 = 1{,}4 \lt 10$, pontos $P(X \ge 3) = 0{,}165$. A/B: 20/200 vs 34/200, összevont 0,135, SE 0,0342, $z = 2{,}05$, p 0,04; KI 0,3–13,7 százalékpont; $z^2 = \chi^2 \approx 4{,}19$.
    30/100 vs 45/100: összevont 0,375, $z = 2{,}19$, p 0,029. Belenézés: 20 belenézés → kb. 25% téves riasztás (egyszeri próba 5%).
  * 8.8: vérnyomás $\sigma = 12$, $\Delta = 3$, $n = 100$/csoport: SE 1,70, krit. 3,33, erő 0,42; 200/csoport → 0,71; szükséges $n$ 251/csoport. $(1{,}96 + 0{,}842)^2 \approx 7{,}85$.
    $d = 0{,}5$: 80% → 63 (t-vel 64), 90% → 85; $n = 40$ → erő 0,61. Lehr: $16/d^2$. ncbirths erő 0,4 fontra ≈ 0,34; 80%-hoz ≈ 221/csoport. Arányok 10% → 15%: 686/változat; 20% → 25%: 1094.
    Páros: $\sigma_d = 4$, $\Delta = 3$ → 14 pár. 30+30 fővel kimutatható $d \approx 0{,}72$.
  * 8.9: kávéautomata $t = -2{,}11$, p 0,064; hírlevél 520 vs 610 / 5000: $z = 2{,}84$, p 0,0045.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/ms8/qN.js`) és a `_parts/calc/qms8N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `ms8-81` (8.1), `ms8-82` (8.2), `ms8-83` (8.3), `ms8-84` (8.4).
- `q2.js`: `ms8-85` (8.5), `ms8-86` (8.6), `ms8-87` (8.7), `ms8-88` (8.8), `ms8-final` (az egész fejezet, a 8.9 alkalmazással együtt).
