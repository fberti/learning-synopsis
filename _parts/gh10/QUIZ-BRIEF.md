# Gráfelmélet és hálózattudomány 10. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh9/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag (a `_parts/gh10/` mappában): `00-head.html` (motiváció, jelölések), `01-s101.html` (10.1 élátfedés: Jaccard, súlyozott Jaccard),
`02-s102.html` (10.2 mátrixkorreláció, φ-együttható, a csúcshalmaz mint döntés; miért hamis a naiv p-érték: diád-függőség, sor- és oszlopautokorreláció, szimuláció),
`03-s103.html` (10.3 QAP: 4 csúcson 24 permutáció, 7 csúcson 5040; véletlen permutációk, $(k+1)/(M+1)$, standard hiba; Krackhardt menedzserei; hibás permutációk),
`04-s104.html` (10.4 MRQAP: regresszió a cellákon, bináris magyarázó = két arány különbsége, attribútummátrix; Y-permutáció, DSP; Krackhardt-eredmények),
`05-s105.html` (10.5 gerinc: globális küszöb, diszparitásszűrő $\alpha_{ij} = (1 - w_{ij}/s_i)^{k_i-1}$, páros vetület gerince a 7. fejezet nullmodelljével, többszörös tesztelés),
`06-s106.html` (10.6 egy hiányzó él az Árvízhéten (köztesség), véletlen hiány a karateklubban, nem véletlen hiány, platform-hozzáférés; érzékenységi rács Les Mis-en),
`07-s107.html` (10.7 ERGM: élparaméter = ER, logit; háromszögtag, változási statisztika, 4 csúcs 64 gráf, illesztés, degeneráció, GWESP; TERGM, SAOM; melyik modell mikor),
`08-s108.html` (10.8 alkalmazás: a fejezet kérdésének válasza; Krackhardt összefoglaló; ellenőrző lista; konszenzus és vita),
`10-end.html` (összefoglalás, döntési táblázat, kártyák, vegyes feladatok).
A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`. Lapok szereplőgráfjai (súly = közös cikkek): RH {Ko–Vi 2, Ko–Po 2, Vi–Po 1}; EK {Ko–Sz 1, Ko–Kl 1, Vi–Sz 1, Sz–Kl 2}; NY {Po–La 1, Po–Ön 1, La–Ön 3}; VN {Vi–Po 1, Po–La 1, Po–Ön 1}.
Hét eleje (H–Sze, cikkek 1, 2, 4, 7, 10, 11): Ko–Vi 2, Ko–Po 1, Vi–Po 2, Vi–Sz 1, Po–La 1, La–Ön 1 (6 él, súly 8). Hét vége (Cs–V, 3, 5, 6, 8, 9, 12): Ko–Po 1, Ko–Sz 1, Ko–Kl 1, Po–La 1, Po–Ön 2, La–Ön 2, Sz–Kl 2 (7 él, súly 10).
A teljes szereplőgráf (súlyozott): Ko–Vi 2, Ko–Po 2, Vi–Po 2, Vi–Sz 1, Sz–Kl 2, Ko–Sz 1, Ko–Kl 1, La–Ön 3, Po–La 2, Po–Ön 2.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis példát írhatsz, ha a szakasz módszerével kézzel megoldható (gráfot élek felsorolásával adj meg, pl. „élek: AB, AC, BC, CD”).

Két kvízíró dolgozik párhuzamosan:
- **q1** (`_parts/gh10/q1.js`): `gh10-101`, `gh10-102`, `gh10-103`, `gh10-104`.
- **q2** (`_parts/gh10/q2.js`): `gh10-105`, `gh10-106`, `gh10-107`, `gh10-108`, `gh10-final`.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be; a q1 utolsó eleme után is legyen vessző):
```js
    /* ------------------------------------------------ 10.1 */
    "gh10-101": {
      title: "Kvíz – 10.1 Élátfedés",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh10-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Kereszthivatkozás a `q` / `hint` / `explain` szövegben csak linkkel: `<a class="xref" href="#s103">10.3</a>` (ugyanazon az oldalon) vagy `<a class="xref" href="../07-halozatmodellek/#s76-a">7.6</a>`; válaszopcióba ne tegyél linket. Link nélküli „lásd 10.3” ne legyen.
- Rossz válaszok kézzel, tipikus hibákból: az összeggel osztani az unió helyett ($2/6$ a $2/4$ helyett); a különböző csúcshalmaz; a $J$-t szignifikanciának olvasni; súlyozott/bináris keverése; a főátló vagy a szimmetrikus pár beszámolása; a cellákat függetlennek venni; „a nagy $N$ megment”; a sorokat és oszlopokat külön permutálni / cellánként keverni; az identitást kihagyni ($p = 0$); egy- és kétoldali keverése; „4 csúcson is lehet erős bizonyíték”; $p = k/M$ vs. $(k+1)/(M+1)$; az MRQAP-ban a naiv p-t használni; a $b$-t permutálni a $t$ helyett; Y-permutáció ↔ DSP összekeverése; a kis $R^2$-ből „nincs hatás”; okság keresztmetszeti adatból; globális küszöb = „a fontos élek”; nagy súly = fontos; a diszparitásszűrő képletében $k$ a $k-1$ helyett, vagy $w/s$ a $1 - w/s$ helyett; az 1 fokú csúcs; kis fokszámnál szűrni; többszörös tesztelés elfelejtése; a fokszám érzékenyebb, mint a köztesség (fordítva igaz); az átlagos $\rho$-ból egyéni állítás; nem véletlen hiány = zaj; a legszebb cellát jelenteni; a $\theta$-t valószínűségnek olvasni; „mindig van becslés”; a pozitív $\theta_\Delta$ okságot bizonyít; QAP ↔ ERGM ↔ SAOM feladatkörének keverése.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`_parts/gh10/run.sh szkript.py`: uv + networkx, numpy, scipy, rdata, pandas; segédmodul `_parts/gh10/common.py`: `ART`, `comat`, `paper`, `FIRST`, `SECOND`, `offdiag`, `corr`, `qap_exact`, `krack()`; a szöveg számait adó szkriptek: `_parts/gh10/calc*.py`),
  a szkriptet tedd a `_parts/gh10/` mappába `qcheckN_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: élátfedés, Jaccard-index $J$, súlyozott Jaccard $J_w$, mátrixkorreláció, cella, diád, $\varphi$-együttható, naiv próba, sor- és oszlopautokorreláció, QAP, permutáció $\pi$, $r^*$, nulleloszlás, identitás, egyoldali / kétoldali, MRQAP, Y-permutáció, kettős szemi-parciális eljárás (DSP), maradék, attribútummátrix, LRQAP, gerinc, globális küszöb $t$, diszparitásszűrő $\alpha_{ij}$, erősség $s_i$, páros vetület gerince (SDSM), Bonferroni, hiányzó adat, véletlen / nem véletlen hiány, Spearman $\rho$, érzékenységvizsgálat, rács, ERGM, $\theta_{\text{él}}$, $\theta_\Delta$, változási statisztika, logit, degeneráció, GWESP, TERGM, SAOM.
  A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  Jaccard: VN–NY 2/4 = 0,5; RH–VN 1/5 = 0,2; a többi lappár 0; hét eleje–vége 3/10 = 0,3. Súlyozott: VN–NY 2/6 = 1/3; hét eleje–vége 3/15 = 0,2; arányokra normálva VN–NY 0,25; VN kétszeres súlyokkal vs. VN: 0,5 (bináris 1). $(5,1,0)$ vs. $(5,0,1)$: bináris 1/3, súlyozott 5/7.
  Mátrixkorreláció: VN–NY 4 szereplő (6 cella): bináris $r = 1/3$, súlyozott $-0{,}156$; 7 szereplő (21 cella): $\varphi = 33/54 = 0{,}611$ ($a=2,b=1,c=1,d=17$); 4 csúcs + 1 izolált: 11/21 = 0,524; hét eleje–vége bináris 0,224 ($a=3,b=3,c=4,d=11$), súlyozott 0,019; 3–3 él közös nélkül 7 csúcson: $-9/54 = -0{,}167$. Naiv: VN–NY 7 csúcs $t = 3{,}37$, $p = 0{,}003$; hét eleje–vége naiv 0,33.
  Szimuláció ($n = 20$, független hálózatok csúcshatással): naiv hamis riasztás 4,5% / 24% / 46% / 48% ($\rho$ = 0 / 0,5 / 1 / 2), QAP 4,5–6%. Egy csúcs 10 csúcsú irányítatlan hálóban 9 cellában a 45-ből; 21 fős irányítottban 40 a 420-ból.
  QAP: 4 csúcs 18/24 = 0,75 ($r^*$ = 1/3 (18) vagy $-1$ (6)); kétoldali 1; 7 csúcs 432/5040 = 3/35 = 0,0857 (értékek 0,611 (432), 0,222 (1296), $-0{,}167$ (3312)); P(0 közös) = 23/35; hét eleje–vége 1440/5040 = 0,286 (súlyozott 0,53). Legkisebb p 4 csúcson 1/24 ≈ 0,042. $21! \approx 5{,}1 \cdot 10^{19}$.
  Krackhardt (21 fő, 420 cella): tanácskérés 190 él (0,45), barátság 102 (0,24), jelent 20 (0,05). tanács–barát $r = 0{,}155$, QAP egyoldali $p \approx 0{,}018$ (20 000 perm.; kétoldali 0,033), naiv 0,0015; $r^*$ átlag 0, szórás 0,072, max 0,27; naiv szórás $1/\sqrt{420} = 0{,}049$; tanács–jelent $r = 0{,}224$, $p \lt 0{,}001$ (max $r^*$ 0,20). Cellakeverés: szórás 0,049, p 0,0004. SE: $p = 0{,}02$, $M$ = 1000 → 0,0044, 5000 → 0,002.
  MRQAP: barátoktól 60/102 = 0,588, nem barátoktól 130/318 = 0,409 → $b_1 = 0{,}179$, $b_0 = 0{,}409$; főnöktől 19/20 = 0,95, többi 171/400 = 0,4275 → 0,5225; 20 főnöki cellából 12 barát (60%); nem főnöki cellákon 49/90 = 0,544 vs. 122/310 = 0,394 (0,15). Barátság + jelent: 0,397 / 0,136 / 0,472, $R^2$ 0,063 (egyedül: barátság 0,024, jelent 0,050); barátság naiv 0,016, Y-perm. 0,11, DSP 0,10; jelent minden p $\lt 0{,}001$; barátság egyedül: naiv 0,0015, Y-perm. 0,032, DSP 0,034. + tenure receiver: 0,254 / 0,140 / 0,415 / 0,012, $R^2$ 0,100. + azonos részleg: $-0{,}062$, DSP 0,36. Barátság–jelent korreláció 0,19. Jóslat nem barát főnöki párra 0,869; mindhárom 1,005.
  Gerinc: Árvízhét $w \ge 2$: 7 él, két komponens {Ko, Vi, Po, La, Ön} | {Sz, Kl}; $w \ge 3$: csak La–Ön. Les Mis: 77 csúcs, 254 él, súlyösszeg 820, 97 él 1-es, legnagyobb Valjean–Cosette 31; $t$ = 1/2/3/5/10 → élek 254/157/107/51/13, csúcsok 77/58/44/26/13, komponensek 1/1/3/2/3. Diszparitás: 10,1,1,1 → 0,0123 és 0,787; 8,1,1 → 0,04; 5 egyforma → 0,41; La–Ön 0,4; Árvízhét legkisebb α: Sz–Kl 0,25, Ko–Vi = Ko–Po 0,296 (α = 0,05-nél 0 él); 0,9^99 ≈ 3·10⁻⁵; 6,2,1,1 → 2-es 0,512, 6-os 0,064; 12,2,2,2,2 → 0,0256. Les Mis α 0,05/0,1/0,2/0,3 → 9/21/47/85 él, 10/21/30/46 szereplő vs. ugyanannyi él globálisan 9/18/26/37; Marius–Enjolras (7) kiesik α = 0,2-nél. Páros gerinc (7.6): Ko–Vi p 0,20, Sz–Kl 0,016, La–Ön 0,018, Po–La 0,50; Bonferroni 21 párra 0,0024; 50 szereplő 1225 pár, 4·10⁻⁵.
  Hiány: Árvízhét köztesség Po 8, Ko 5, Vi 1,5, Sz 0,5. Ko–Po hiánya: Ko 2, Vi 9, Po 8, Sz 2 (Vi az első); Vi–Po: Ko 9,5; Vi–Sz: Ko = Po = 8; La–Ön: Po 9; Sz–Kl: Ko 6,5, Sz 0; Po–La: Ön 5; Ko–Kl: Ko 3, Vi 3, Sz 5, Po 8. Karate élhiány 5/10/20/30/50%: fokszám ρ 0,97/0,95/0,90/0,85/0,74, köztesség 0,96/0,93/0,86/0,80/0,70, első helyezett (köztesség) 100/99/90/83/46%; csúcshiány 10/20/30%: 0,96/0,90/0,87 és 0,95/0,89/0,84; fokszám-első (34-es 17 él, 1-es 16) 5% hiánynál kb. 60%. Platform: X ingyenes kutatói API vége 2023, CrowdTangle leállítva 2024 augusztus, DSA 40. cikk.
  Érzékenység (Les Mis, NMI az alapeset $t=1,\gamma=1$-hez): $t=1$: 0,86/1/0,93/0,85 ($\gamma$ 0,5/1/1,5/2); $t=2$: 0,63/0,80/0,76/0,74; $t=3$: 0,60/0,63/0,63/0,63; $t=5$: 0,58/0,60/0,59/0,59. Alapeset 20 seed: 6 közösség, NMI 0,93–1. 3 döntés × 4 érték = 64 cella.
  ERGM: 4 csúcs 64 gráf; csoportok (él, háromszög: db): (0,0) 1, (1,0) 6, (2,0) 15, (3,0) 16, (3,1) 4, (4,0) 3, (4,1) 12, (5,2) 6, (6,4) 1. Élparaméter: $\theta = \ln(p/(1-p))$; 4/6 → ln 2 = 0,693, várható háromszög 1,185; $\theta = -1$ → 0,269; 10 csúcs 9 él → $-1{,}386$; $\theta = -2$ → 0,119, 20 csúcson 22,6 él; 5 csúcs 1024 gráf. $\theta = (0,0)$: E[él] 3, E[Δ] 0,5. Változási statisztika $(-1;\ 0{,}5)$: $c$ = 0/1/2 → 0,269/0,378/0,5; $(-2, 1)$, $c = 3$ → 0,731. Illesztés: háromszög + lógó él $(1{,}275;\ -0{,}647)$; háromszög + magányos $(-0{,}865;\ 1{,}469)$; 3 élű út: nem létezik. 6 csúcs: $(-1, 0)$ E[él] 4,03; $(-1;\ 0{,}5)$ 4,78; $(-1, 1)$ 10,59, P(15 él) 0,193; $(-1{,}5;\ 1{,}2)$ kétpúpú. Háromszög + magányos alakú gráfok $\theta=0$-nál: 4/64.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set` answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz (a `_parts/gh9/qcheck1_katex.js` mintájára).
- Munkát csak a saját fájlodban (`_parts/gh10/qN.js`) és a `_parts/gh10/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj. `pkill -f`-et ne használj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
