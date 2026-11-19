# Gráfelmélet és hálózattudomány 9. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh8/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag (a `_parts/gh9/` mappában): `00-head.html` (motiváció, jelölések), `01-s91.html` (9.1 SI/SIS/SIR: biztos SI = BFS, excentricitás; $1-(1-\beta)^k$; gyógyulás, átvitel $T = \beta/(\beta+\gamma-\beta\gamma)$; keverő populáció, $R_0 = T\langle k\rangle$, végső méret),
`02-s92.html` (9.2 járványküszöb: többletfokszám $\kappa$, $R_0 = T\kappa$, $T_c = 1/\kappa$; ER vs. BA; Pastor-Satorras–Vespignani; SIS-kiegészítés; immunizálás: véletlen, célzott, ismerős),
`03-s93.html` (9.3 független kaszkád = élperkoláció = SIR $\gamma = 1$; Granovetter-tömeg, küszöbmodell (abszolút / arány); egyszerű vs. összetett fertőzés, gyűrűrács vs. $K_{4,4}$, átkötési táblázat, Centola 2010),
`04-s94.html` (9.4 kaszkádfa: méret, mélység, szélesség, strukturális virálisság $\nu$, Wiener-index; csillag $2(n-1)/n$, út $(n+1)/3$; Árvízhét hírláncai két szülőszabállyal; elágazó folyamat $1/(1-R)$, Borel-eloszlás, Goel és mtsai),
`05-s95.html` (9.5 befolyásmaximalizálás: $\sigma(S)$, határhaszon, szubmodularitás, mohó algoritmus, $1 - 1/e$, Árvízhét-számok, CELF, k-mag, Bakshy),
`06-s96.html` (9.6 DeGroot, $\pi_i \propto k_i + 1$; korlátos bizalom: HK, Deffuant, $\lfloor 1/(2\varepsilon)\rfloor$; visszhangkamra: homofil újrahuzalozás; konszenzus és vita),
`07-s97.html` (9.7 alkalmazás: ugyanaz a $p$ négy hálózaton; politikai blogok; Vosoughi 2018 vs. Juul–Ugander 2021; a válasz),
`10-end.html` (összefoglalás, döntési táblázat, kártyák, vegyes feladatok).
A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`. Az Árvízhét szereplőgráfja (súly nélkül, 7 csúcs, 10 él): Ko–Vi, Ko–Po, Vi–Po, Vi–Sz, Sz–Kl, Ko–Sz, Ko–Kl, La–Ön, Po–La, Po–Ön (fokszámok Ko 4, Po 4, Vi 3, Sz 3, Kl 2, La 2, Ön 2).
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis példát írhatsz,
ha a szakasz módszerével kézzel megoldható (gráfot élek felsorolásával adj meg, pl. „élek: AB, AC, BC, CD”).

Két kvízíró dolgozik párhuzamosan:
- **q1** (`_parts/gh9/q1.js`): `gh9-91`, `gh9-92`, `gh9-93`, `gh9-94`.
- **q2** (`_parts/gh9/q2.js`): `gh9-95`, `gh9-96`, `gh9-97`, `gh9-final`.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be; a q1 utolsó eleme után is legyen vessző):
```js
    /* ------------------------------------------------ 9.1 */
    "gh9-91": {
      title: "Kvíz – 9.1 SI, SIS és SIR",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh9-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $k\beta$ az $1-(1-\beta)^k$ helyett; $(1-\beta)^k$ (az ellentett elfelejtve); a fertőzés egy lépésben „továbbfut”; $T = \beta$ akkor is, ha $\gamma \lt 1$; $T = \beta/\gamma$; SIS-ben végső méret;
  $R_0 = T\langle k\rangle$ heterogén hálózaton; $\kappa = \langle k^2\rangle/\langle k\rangle$ (a −1 nélkül); $T_c = 1/\langle k\rangle$ nem-Poisson hálózaton; „skálafüggetlenben minden járvány elterjed”; „10% oltás = 10%-kal kisebb járvány”; az ismerős-oltásnál a megkérdezettet oltani;
  IC-ben ismételt próbálkozás (= SI); a háromszögben csak a közvetlen utat számolni, vagy a közvetett utat $p^2$-tel (a közvetlen kudarca nélkül); az átlagos küszöbből jósolni; abszolút ↔ arány-küszöb; „a kisvilág mindent gyorsít”; ismételt kitettség = összetett fertőzés; összetett fertőzés vs. homofília;
  mélység = virálisság; csak a gyökértől mért távolságok átlaga; az időrend = átvétel; átlag = tipikus kaszkádméret; „$R \lt 1$ → nincs nagy kaszkád”; „nagy = virális”;
  a kezdők egyenkénti rangsorolása; $\sigma$-k összeadása; „a mohó optimális”; a szubmodularitás iránya; összetett fertőzésnél szétszórt kezdők;
  DeGroot-konszenzus = egyszerű átlag; saját súly nélkül oszcilláció; HK-ban a saját vélemény kihagyása; „a csoportok száma csak az $\varepsilon$-on múlik”; a modell = bizonyíték a valóságra; Vosoughi vs. Juul–Ugander (méretpárosítás).
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx --with numpy --with scipy python -I …`; a karateklub élei: `mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` (KARATE13); networkx-ben `nx.karate_club_graph()` élsúlyos – súly nélkül számolj),
  a szkriptet tedd a `_parts/gh9/` mappába `qcheckN_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is. Segítség: `_parts/gh9/common.py` (`arv()`, `karate()`, `polblogs()`, `ic_exact(G, seeds, p)` – saját modulként `-I` nélkül futtasd: `_parts/gh9/run.sh szkript.py`), és a `_parts/gh9/calc*.py` szkriptek, amelyekből a szöveg számai jöttek.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: fogékony / fertőző / gyógyult (S, I, R), $\beta$ (fertőzés esélye lépésenként), $\gamma$ (gyógyulás esélye), átvitel $T$, keverő populáció (átlagtér), alapszaporodási szám $R_0$, végső méret $r_\infty$;
  többletfokszám $\kappa$, $T_c$, barátság-paradoxon, hub, véletlen / célzott / ismerős-immunizálás; független kaszkád, $p$, élperkoláció, küszöbmodell, $\theta$, abszolút / arány-küszöb, egyszerű / összetett fertőzés, átkötés $q$;
  kaszkádfa, méret, mélység, szélesség, strukturális virálisság $\nu$, Wiener-index, műsorszórás, lánc, elágazó folyamat, $R$, Borel-eloszlás, kritikus pont; várható terjedés $\sigma(S)$, határhaszon, szubmoduláris, mohó algoritmus;
  DeGroot, $W$, $\pi_i$, konszenzus, korlátos bizalom, $\varepsilon$, Hegselmann–Krause (HK), Deffuant, $\mu$, homofil újrahuzalozás, visszhangkamra.
  A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  Árvízhét biztos SI: Kl-ből 1, 3, 5, 7; Po-ból 1, 5, 7; excentricitás Ko, Vi, Po 2, a többi 3. $\beta = 0{,}3$: $k = 1, 2, 3$ → 0,3; 0,51; 0,657. $\beta = 0{,}5$: $k = 2$ → 0,75; 3 → 0,875. $A$–$B$–$C$, SI $\beta = 0{,}5$: $C$ a 2. lépés végére 0,25, a 3.-ra 0,5.
  $T$: (0,5; 0,5) → 2/3; (0,2; 0,5) → 1/3; (0,3; 1) → 0,3; (0,3; 0,3) → 0,588; (0,1; 0,2) → 0,357; (0,1; 0,1) → 0,526. Út $A$–$B$–$C$, $\beta = \gamma = 0{,}5$: $(2/3)^2 = 4/9$. 4 csúcsú út, $T = 0{,}5$: végpont 0,125, átlag 1,875.
  Keverő: $R_0$ 1,5 / 2 / 3 → $r_\infty$ 0,583 / 0,797 / 0,941; $\langle k\rangle = 4$, $T = 0{,}5$ → $R_0 = 2$. Gyűrűrács 1000, $T = 0{,}5$: átlagosan 1,5%, max 63.
  $\kappa$, $T_c$: $C_6$ 1 / 1; csillag + él (fokszámok 5, 2, 2, 1, 1, 1) 2 / 0,5; 4 levelű csillag 1,5 / 0,667; 4-reguláris 3 / 1/3; Árvízhét 2,1 / 0,476; karateklub 6,77 / 0,148; Les Misérables 11,06 / 0,090; blogok 80,3 / 0,0125; ER $\langle k\rangle = 4$: 0,25; BA $m = 2$: $n$ = 1000 / 10 000 / 100 000 → $\kappa$ 10,1 / 13,7 / 17,1, $T_c$ 0,099 / 0,073 / 0,059 (legnagyobb fokszám 87 / 264 / 889; ER: 11 / 14 / 16).
  Immunizálás, csillag + él: levél oltása → $\kappa$ 1,6, $T_c$ 0,625; hub oltása → nincs járvány; az 1-es oltása → $\kappa$ 1,5; ismerős-oltás hubot talál: 2/3 (véletlen 1/6); 4 levelű csillag: 4/5. BA $n = 10\,000$, 10%: véletlen $T_c$ 0,076 (átl. fokszám 3,7), ismerős 0,23 (9,6), célzott 0,66 (14,6).
  IC: háromszög $p = 0{,}5$: $B$ 0,625, átlag 2,25; $p = 0{,}2$: 0,232. 4 levelű csillag $p = 0{,}5$: közép 3, levél 2,25; $p = 0{,}3$ közép: senkihez 0,24. 4 hosszú kör, szemközti: 0,4375. Árvízhét $p = 0{,}5$ egy kezdő: Ko 4,64, Po 4,59, Vi 4,48, Sz 4,33, Kl 3,91, La = Ön 3,71.
  Granovetter: 0…99 → 100; az 1-es helyett 2-es → 1; átlagok 49,5 és 49,51. 0, 1, 1, 3, 4, 5 → 6; 0, 1, 3, 3, 4, 5 → 2; 0, 1, 2, 2, 5 → 4. Árvízhét $\theta = 0{,}5$: La + Ön → {La, Ön, Po}; Ko egyedül → mindenki; Sz + Kl → mindenki.
  Gyűrűrács 8, $k = 4$, $\theta = 2$, kezdők 0, 1 → 2, 4, 6, 8; kezdők 0, 4 → 4, 8 (2 kör); $K_{4,4}$ (± 1, ± 3) → megáll 2-nél; egyszerű (küszöb 1) mindkettőben 1, 5, 8. Klaszterezettség 0,5 vs. 0. Átkötés ($n = 100$): $q$ 0 / 0,05 / 0,1 / 0,2 / 0,5 / 1 → egyszerű 25 / 11,2 / 8,5 / 6,9 / 5,6 / 5,3 lépés; összetett 100 / 25 / 12 / 6 / 3 / 2%.
  Kaszkádfák: csillag 5 → $\nu$ 1,6; út 5 → 2,0; vegyes (gyökér–1, 2; 1–3, 4) → 1,8; csillag 10 → 1,8; út 10 → 3,67; 100 → 1,98 és 33,7; 4 csúcs: csillag 1,5, út 1,67; NY-fa (2.5) méret 8, mélység 3, szélesség 3, Wiener 68, $\nu$ 2,43; bináris 7 csúcs (gyökér 2 gyerek, mindkettőnek 2) 48/21 ≈ 2,29; csillag 4 levél + unoka 1,87 vs. 5 levél 1,67; gyökér 3 gyerek, egyiknek 1: 1,8.
  Hírláncok: „legkorábbi” → {1, 4, 10, 5, 6, 9} (mélység 3, $\nu$ 2,13), {7, 8, 11, 12}, {2, 3}; „legutóbbi” → {1, 4, 10, 11}, {2, 3, 5, 6}, {7, 8, 9, 12}.
  Elágazó: 2 követő, $q = 0{,}25$: $R = 0{,}5$, P(1) 0,5625, P(2) 0,211, átlag 2; $q = 0{,}4$: $R = 0{,}8$, P(1) 0,36, átlag 5; 3 követő, 0,2: $R = 0{,}6$, átlag 2,5, P(1) 0,512. Borel $R$ = 0,5 / 0,9 / 1: P(1) 0,607 / 0,407 / 0,368; P(2) 0,184 / 0,149 / 0,135; P(≥10) 0,014 / 0,186 / 0,258; P(≥100) ≈0 / 0,017 / 0,080.
  Befolyás: Árvízhét $p = 0{,}3$ egyedül Ko 2,898, Po 2,859, Vi 2,696, Sz 2,578, Kl 2,247, La = Ön 2,137; Ko + második: Vi 3,841, Po 4,135, La = Ön 4,327, Sz 3,767, Kl 3,689; optimum Po + Sz 4,363. $p = 0{,}5$: mohó Ko + La 5,804, optimum La + Sz 5,840, Ko + Po 5,516. Két hub + kis csillag (A–B, A és B – 1…5, C – x, y, z): lefedés A 7, AB 7, AC 11; $p = 0{,}2$: A 2,604, AB 3,8, AC 4,204; $p = 0{,}5$: AB 5,75, AC 7,934, A1 5,815. $\binom{1000}{5} \approx 8{,}25 \cdot 10^{12}$.
  DeGroot: út (7, 0, 0) → 3,5 / 2,333 / 0 → … → 2; közép kezd 7-tel → 3; csillag 4 levél, közép 10 → 3,85, levél 10 → 1,54; Árvízhét $\pi$: Ko, Po 5/27, Vi, Sz 4/27, Kl, La, Ön 3/27; 3 levelű csillag közép 6 → 2,4.
  HK (0; 0,2; 0,4; 0,8; 1): $\varepsilon$ 0,15 → nem változik; 0,25 → (0,1; 0,2; 0,3; 0,9; 0,9) → (0,2; 0,2; 0,2; 0,9; 0,9); 0,45 → 4 lépés, 0,464; 0,4 → konszenzus 0,459. (0; 0,1; 0,5; 0,6; 1), 0,2 → 0,05; 0,05; 0,55; 0,55; 1. Deffuant $\mu = 0{,}5$: 0,4 és 0,6 → 0,5; $\mu = 0{,}25$ → 0,45 és 0,55. Csoportok kb. $\lfloor 1/(2\varepsilon)\rfloor$.
  Négy hálózat (1000 csúcs, ⟨k⟩ = 4, $p = 0{,}25$, nagy (>100) kaszkád): rács 0%, kisvilág 0%, ER 7%, BA 35%; $p = 0{,}35$: 0 / 1 / 47 / 55%. Blogok: $p$ 0,01 → 0% (>50), 0,02 → 15%, 0,03 → 32%; medián 1; a blogok linkjeinek kb. 9%-a köt össze két tábort; nagy kaszkádokban kb. fele-fele.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz (a `_parts/gh8/qcheck1_katex.js` mintájára).
- Munkát csak a saját fájlodban (`_parts/gh9/qN.js`) és a `_parts/gh9/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj. `pkill -f`-et ne használj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
