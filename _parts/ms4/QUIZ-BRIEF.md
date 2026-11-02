# Matematikai statisztika 4. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`matematikai-statisztika/03-ket-valtozo-kapcsolata/quizzes.js` első ~250 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/ms4/01-s41.html` … `07-s47.html` és `10-end.html` (a megfelelő szakasz HTML-je). A kvíz CSAK olyat kérdezzen, ami a
szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis számpéldát írhatsz, ha a szakasz
módszerével kézzel megoldható (kerek számok!).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 4.1 */
    "ms4-41": {
      title: "Kvíz – 4.1 Statisztikai sorok és a viszonyítás",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben;
az Ö betű KaTeX-ben `\text{Ö}`, pl. `$K_{\text{Ö}}$`, `$I_{\text{Ö}}$`.)

Szabályok (kötelező):
- Szakaszonként 6–8 kérdés, a fejezetzáróban (`ms4-final`) 12–14 (minden szakaszból 4.1–4.7 legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: „százaléka” ↔ „százalékkal”; százalék ↔ százalékpont; visszafelé ugyanaz a százalék (+25% ↔ −20%);
  +x% majd −x% = 0; láncviszonyszámok összeadása szorzás helyett; bázisváltás kivonással; rossz gyökkitevő (n helyett n−1); átlagos ütem
  számtani átlaggal; részviszonyszámok egyszerű átlaga; rossz súly (számtani ↔ harmonikus); megoszlás összehasonlító sorból; állapotidősor
  összeadása; Laspeyres ↔ Paasche súly felcserélése; azonos súlyozású ár- és volumenindex szorzata ($I_p^0 I_q^0$); kivonás osztás helyett
  (125% − 110%); egyedi árindexek egyszerű átlaga; deflálás kivonással; infláció-százalékok összeadása; „csökkent az infláció = csökkentek az árak”;
  nominális ↔ reál; standardizálásnál $V_S$ rossz súlyokkal ($\sum B_0 v_1$); részhatás = teljes különbség; indexek összeadása szorzás helyett;
  nyers arányszám ↔ standardizált stb.
  Számválaszoknál 4 opció, egységes formátumban (pl. mind „…%” egy tizedessel, tizedesvesszővel).
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`python3 -I` elég), a szkriptet tedd a `_parts/calc/` mappába
  `qms4N_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: leíró / minőségi / területi / idő- (állapot-, tartam-) / mennyiségi sor,
  csoportosító / összehasonlító sor; viszonyszám $V = A/B$ (tárgy / alap), együttható, százalék, ezrelék, százalékpont; megoszlási $V_m$,
  koordinációs $V_k$, intenzitási $V_i$ (egyenes / fordított, nyers / tisztított), arányszám; rész- és összetett viszonyszám;
  dinamikus viszonyszám, tárgyidőszak, bázisidőszak, bázisviszonyszám $b_t$, láncviszonyszám $l_t$, bázisváltás, átlagos változási ütem;
  egyedi index $i_p, i_q, i_v$; értékindex $I_v$, értékkülönbség $K_v$; Laspeyres $I_p^{0}$, Paasche $I_p^{1}$, Fisher $I_p^{F}$,
  volumenindex $I_q^{0}$, $I_q^{1}$, árhatás-különbség $K_p^0, K_p^1$, volumenhatás-különbség $K_q^0, K_q^1$, indexkör, deflálás,
  helyettesítés, átlagforma (számtani $v_0$-val, harmonikus $v_1$-gyel); indexsor (bázis / lánc, állandó / változó súlyú), láncolt index,
  nominális / reál, reálbérindex; főátlag, részátlag, standard főátlag $V_S$, teljes különbség $K_T$, részhatás-különbség $K_R$,
  összetételhatás-különbség $K_{\text{Ö}}$, főátlag-index $I_F$, részátlag-index $I_R$, összetételhatás-index $I_{\text{Ö}}$,
  közvetlen standardizálás, standardizált arányszám.
- A futó példa számai (használhatod): Panni kosara – kenyér 10 db × 600 → 10 × 600; tej 15 l × 400 → 23 × 400; kávé 2 cs × 2000 → 1 × 2600;
  alma 8 kg × 500 → 12 × 600. $\sum q_0p_0 = 20\,000$, $\sum q_1p_1 = 25\,000$, $\sum q_0p_1 = 22\,000$, $\sum q_1p_0 = 23\,200$;
  $I_v = 125\%$, $I_p^0 = 110\%$, $I_p^1 \approx 107{,}8\%$, $I_p^F \approx 108{,}9\%$, $I_q^0 = 116\%$, $I_q^1 \approx 113{,}6\%$;
  $K_p^0 = 2000$, $K_p^1 = 1800$, $K_q^0 = 3200$, $K_q^1 = 3000$. A kávézó forgalma 2021–2025: 40, 50, 45, 54, 54 millió Ft.
  KSH-infláció: 2022: 14,5%, 2023: 17,6%, 2024: 3,7% → 2021 = 100 bázison 139,6. Bővülő cég: 8 × 600 + 2 × 300 → 8 × 630 + 12 × 330;
  $V_0 = 540$, $V_S = 420$, $V_1 = 450$. Öregfalu / Ifjúváros: nyers 22,7‰ / 10,2‰.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/ms4/qN.js`) és a `_parts/calc/qms4N_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.

Feladatmegosztás:
- `q1.js`: `ms4-41` (4.1), `ms4-42` (4.2), `ms4-43` (4.3).
- `q2.js`: `ms4-44` (4.4), `ms4-45` (4.5), `ms4-46` (4.6), `ms4-final` (az egész fejezet, a 4.7 alkalmazással együtt).
