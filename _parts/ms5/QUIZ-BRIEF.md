# Matematikai statisztika 5. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/ms4/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms5/01-s51.html` … `08-s58.html` és `10-end.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz
módszerével kézzel (vagy a szakaszban szereplő kvantilisekkel) megoldható (kerek számok!). Kvantilist / $\Phi$-értéket csak olyat használj,
amit a kérdésben megadsz, vagy ami a szövegben szerepel (1,96; 2,262; 2,776; 2,045; 16,919; 2,700; 19,023; 3,326; $\Phi(1) \approx 0{,}841$,
$\Phi(1{,}5) \approx 0{,}933$, $\Phi(2) \approx 0{,}977$, $\Phi(2{,}5) \approx 0{,}994$ stb.).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 5.1 */
    "ms5-51": {
      title: "Kvíz – 5.1 A statisztika mint valószínűségi változó",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt`, `>` helyett `\gt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms5-final`) 12–14 (minden szakaszból 5.1–5.8 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: SD ↔ SE (σ-val osztás σ/√n helyett); n-nel osztás √n helyett ($\sigma/n$); √n elfelejtése;
  „kétszeres minta → fele hiba”; véges sokasági korrekció fordítva vagy elhagyva, ahol kell; „nagyobb sokasághoz arányosan nagyobb minta”;
  visszatevéses ↔ visszatevés nélküli mintaszámok ($5^2$ ↔ $\binom52$, sorrendezett ↔ nem); $\bar X$ ↔ $\bar x$; adatok eloszlása ↔ mintavételi eloszlás;
  „a CHT az adatokat teszi normálissá”; „$n \ge 30$ mindig elég”; az arány SE-jéből a gyök elhagyása ($p(1-p)/n$); százalék ↔ százalékpont;
  $p(1-p)$ helyett $p$; feltétel csak $n$-re; hibahatár = SE (1,96 elhagyása) vagy 2·1,96; torzítás és véletlen hiba összekeverése;
  $\chi^2$ szabadságfoka $n$ (nem $n-1$); $\chi^2$ szimmetrikusnak vétele; $t$ helyett $z$-kvantilis; $F$ szabadságfokainak felcserélése;
  bootstrap visszatevés nélkül / más mintanagysággal; bootstrap „javítja” a torzítást; regressziót beavatkozás hatásának tulajdonítani;
  $z_Y = z_X$ (regresszió elfelejtése) vagy $z_Y = z_X / r$ stb.
  Számválaszoknál 4 opció, egységes formátumban (pl. mind három tizedes, tizedesvesszővel).
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with scipy python -I …`), a szkriptet tedd a `_parts/calc/` mappába
  `qms5N_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: sokaság / minta, paraméter / statisztika, $\mu$, $\sigma$, $p$, $N$ ↔ $\bar x$, $s$, $\hat p$, $n$;
  valószínűségi változóként $X_1, \dots, X_n$ (független, azonos eloszlású), $\bar X$; $E(\cdot)$, $D(\cdot)$, $D^2(\cdot)$; mintavételi eloszlás, adatok eloszlása;
  visszatevéses / visszatevés nélküli; torzítatlan; standard hiba $\mathrm{SE} = \sigma/\sqrt n$, becsült $s/\sqrt n$; $\sqrt n$-törvény; véges sokasági korrekció
  $\sqrt{(N-n)/(N-1)}$, kiválasztási arány; centrális határeloszlás-tétel (CHT); $N(m, \sigma)$ – a második paraméter a SZÓRÁS; $\Phi$;
  hibahatár $1{,}96\,\mathrm{SE}$, százalékpont; feltétel $np \ge 10$, $n(1-p) \ge 10$; $\chi^2_k$, $t_k$ (Student), $F_{d_1,d_2}$, szabadságfok,
  kvantilis $t_{k;\,0{,}975}$; bootstrap-minta, bootstrap-eloszlás, bootstrap SE, percentilis-intervallum; regresszió a középhez, $z_Y \approx r z_X$,
  tehetség + szerencse, kontrollcsoport.
- A futó példák számai (használhatod):
  * Sportolók: Anna 2, Bence 4, Csilla 6, Dani 8, Emese 10 óra; $\mu = 6$, $\sigma^2 = 8$. 2 fős, visszatevés nélkül: 10 minta, $\bar x$: 3, 4, 5, 6, 5, 6, 7, 7, 8, 9
    (eloszlás 3: 0,1; 4: 0,1; 5: 0,2; 6: 0,2; 7: 0,2; 8: 0,1; 9: 0,1), $D^2(\bar X) = 3$. Visszatevéssel 25 minta, gyakoriság 1, 2, 3, 4, 5, 4, 3, 2, 1 (2…10), $D^2 = 4$,
    $P(|\bar X - 6| \le 1) = 13/25$ (visszatevés nélkül 0,6). 4 fős minták: 7; 6,5; 6; 5,5; 5. Maximum (2 fős, v. n.): 4: 0,1; 6: 0,2; 8: 0,3; 10: 0,4, $E = 8$.
    $s^2$ (2 fős, visszatevéssel): 0: 5, 2: 8, 8: 6, 18: 4, 32: 2 (a 25-ből), $E = 8$. Visszatevés nélkül $D^2(\bar X)$ $n = 1..5$: 8; 3; 1,33; 0,5; 0.
  * IQ: $\sigma = 15$, $n = 25$ → SE 3; $n = 100$ → 1,5. Kocka: $\sigma^2 = 35/12$, $\sigma \approx 1{,}708$; $n = 30$ → SE 0,312; $P(\bar X \ge 4) \approx 0{,}054$ (pontos 0,061).
  * $\sigma = 10$: $n$ = 25, 100, 400, 2500 → SE 2, 1, 0,5, 0,2. Iskola $N = 500$, $n = 100$, $\sigma = 10$ → 0,895. Ország 8 millió, $n = 1000$ → szorzó 0,99994.
  * Töltőgép $N(500, 10)$: egy doboz $P(X \lt 495) \approx 0{,}309$; 25 doboz átlaga $P \approx 0{,}0062$; 4 doboz $\Phi(-1) \approx 0{,}16$.
    Ellenőr: $\bar x = 495$, $s = 14$, $n = 25$: $\chi^2 = 47{,}04$, $P(\chi^2_{24} \ge 47{,}04) \approx 0{,}003$.
  * Izzók (exponenciális, átlag 100 óra, $\sigma = 100$), $P(\bar X \gt 120)$: $n = 5$: pontos 0,285 / CHT 0,327; $n = 30$: 0,138 / 0,137; $n = 100$: 0,028 / 0,023.
  * Arány: $n = 3$, $p = 0{,}4$: $\hat p$ 0: 0,216; 1/3: 0,432; 2/3: 0,288; 1: 0,064, $D^2 = 0{,}08$. Közvélemény-kutatás $n = 1000$, $p = 0{,}4$: SE 1,55 százalékpont,
    hibahatár ± 3,0; $P(\hat p \ge 0{,}43) \approx 0{,}026$ (pontos 0,029); két felmérés különbsége SE 2,19, ± 4,3; mintanagyság ± 3 → 1068, ± 2 → 2401, ± 1 → 9604.
    $n = 50$, $p = 0{,}02$: $np = 1$ ✘, $P(\hat p = 0) \approx 0{,}36$. Alcsoport 200 fő, 50% → ± 6,9.
  * $\chi^2$: $P(Z^2 \lt 1) \approx 0{,}683$; $\chi^2_k$: $E = k$, $D^2 = 2k$; töltőgép $\sigma^2 = 4$, $n = 10$: $P(s^2 \gt 6) = P(\chi^2_9 \gt 13{,}5) \approx 0{,}141$;
    95%-os sáv $1{,}20 \lt s^2 \lt 8{,}45$ ($\chi^2_{9}$: 2,700 és 19,023); $\chi^2_{9;0,95} = 16{,}919$.
  * $t_{k;\,0{,}975}$: 1: 12,706; 4: 2,776; 9: 2,262; 29: 2,045; 100: 1,984; ∞: 1,960. $P(|t_4| \gt 2) \approx 0{,}116$, $P(|Z| \gt 2) \approx 0{,}046$.
    $\bar x = 52$, $s = 6$, $n = 10$, $\mu = 50$ → $t \approx 1{,}05$.
  * $F_{5,10;\,0{,}95} = 3{,}326$; $F_{10,5;\,0{,}95} = 4{,}735$; $F_{5,10;\,0{,}05} \approx 0{,}211$; $t_9^2$: $2{,}262^2 = 5{,}117 = F_{1,9;\,0{,}95}$.
  * Bootstrap: minta 2, 4, 9; 27 újraminta; átlagok bootstrap SE 1,70 ($s/\sqrt3 \approx 2{,}08$; $1{,}70 = 2{,}08\sqrt{2/3}$); medián: 2: 7/27, 4: 13/27, 9: 7/27.
    Ingázás (12 adat): átlag 26,7, medián 22,5, $s \approx 14{,}05$, átlag bootstrap SE ≈ 3,9 (képlet 4,06), medián bootstrap SE ≈ 3,4.
  * Regresszió: pénzérmés modell $X = T + L_1$, $Y = T + L_2$: $X = 2$ → $Y$ átlaga 1,5; $X = 0$ → 0,5; $r = 0{,}5$. $r = \sigma_T^2/(\sigma_T^2 + \sigma_L^2)$.
    Apa 190 cm, átlag 176, szórás 7, $r = 0{,}5$ → fiú 183 cm. Kahneman repülésoktatói.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/ms5/qN.js`) és a `_parts/calc/qms5N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `ms5-51` (5.1), `ms5-52` (5.2), `ms5-53` (5.3), `ms5-54` (5.4).
- `q2.js`: `ms5-55` (5.5), `ms5-56` (5.6), `ms5-57` (5.7), `ms5-final` (az egész fejezet, az 5.8 alkalmazással együtt).
