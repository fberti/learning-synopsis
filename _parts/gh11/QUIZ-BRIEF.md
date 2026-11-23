# Gráfelmélet és hálózattudomány 11. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh10/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag (a `_parts/gh11/` mappában): `00-head.html` (motiváció, jelölések), `01-s111.html` (11.1 a feladat: jelöltek, időbeli felosztás, pozitív/negatív, véletlen rejtés),
`02-s112.html` (11.2 heurisztikák: CN $=(A^2)_{uv}$, Jaccard, PA, Adamic–Adar, RA, Katz kitekintés),
`03-s113.html` (11.3 kiértékelés: precision@k, recall@k, holtverseny várható értékkel; AUC mint párösszevetés, ROC; negatív mintavétel, nehéz negatívak; szivárgás),
`04-s114.html` (11.4 spektrális beágyazás: Laplace-sajátleképezés, $\operatorname{tr}(Z^\top L Z)$, távolság mint pontszám, szerkezeti ekvivalencia, többszörös sajátérték, szétesett gráf, transzduktív),
`05-s115.html` (11.5 DeepWalk: séták, skip-gram párok, PMI, Levy–Goldberg / NetMF; node2vec $p$, $q$; konszenzus és vita),
`06-s116.html` (11.6 alkalmazás: a fejezet kérdésének válasza, karateklub-táblázat, logisztikus regresszió, ellenőrző lista, módszertani józanság),
`10-end.html` (összefoglalás, döntési táblázat, kártyák, vegyes feladatok).
Az összefűzött oldal: `grafelmelet-halozattudomany/11-csucsbeagyazasok/index.html` (a `_parts/gh11/build.sh` készíti). A szakaszok és lépések horgonyai: `#s111`, `#s111-a`, `#s111-b`, `#s112-a`…`#s112-c`, `#s113-a`…`#s113-d`, `#s114-a`…`#s114-c`, `#s115-a`…`#s115-c`, `#s116-a`…`#s116-c`.
A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis példát írhatsz, ha a szakasz módszerével kézzel megoldható (gráfot élek felsorolásával adj meg, pl. „élek: AB, AC, BC, CD”).

Két kvízíró dolgozik párhuzamosan:
- **q1** (`_parts/gh11/q1.js`): `gh11-111`, `gh11-112`, `gh11-113`.
- **q2** (`_parts/gh11/q2.js`): `gh11-114`, `gh11-115`, `gh11-116`, `gh11-final`.

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be; a q1 utolsó eleme után is legyen vessző):
```js
    /* ------------------------------------------------ 11.1 */
    "gh11-111": {
      title: "Kvíz – 11.1 A feladat",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 7–8 kérdés (a 11.3 és a 11.5 lehet 8–9, mert több lépésük van); a fejezetzáróban (`gh11-final`) 12–14 (minden szakaszból legalább kettő, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Kereszthivatkozás a `q` / `hint` / `explain` szövegben csak linkkel: `<a class="xref" href="#s113-b">11.3</a>` (ugyanazon az oldalon) vagy `<a class="xref" href="../02-setak-utak-fak/#s27-a">2.7</a>`; válaszopcióba ne tegyél linket. Link nélküli „lásd 11.3” ne legyen. Csak létező horgonyra linkelj (ellenőrizd a célfájlban).
- Rossz válaszok kézzel, tipikus hibákból: rendezett párokat számolni ($n(n-1)$ a $\binom n2$ helyett irányítatlanul); a meglévő éleket is jelöltnek venni; a visszatérő élt pozitívnak venni; a jelölteket a teljes gráfból venni; véletlen felosztás időbeli adaton; a Jaccardban az összeggel osztani az unió helyett; a pár saját fokszámát használni a közös szomszédé helyett (AA/RA); log helyett nem logot; PA-t hasonlóságnak olvasni; a holtversenyt 1-nek vagy 0-nak számolni ½ helyett; az AUC-t pontosságnak olvasni; a precision@k-t a véletlen szint nélkül; „az AUC függ a negatívak számától”; könnyű negatívakkal mérni; a pontozó gráfba a tesztéleket beletenni; „a CN-t erősen torzítja a szivárgás” (alig); előbb beágyazni, aztán felosztani; az első (konstans) sajátvektort használni; a legnagyobb sajátértékűeket venni a Laplace-nál; a tengelyeknek jelentést adni; egybeeső csúcsokat hibának hinni; a $p$ és $q$ felcserélése; kis $q$ = BFS (fordítva igaz); a nyers gyakoriságot PMI helyett; „a node2vec új csúcsra is működik”; egyetlen felosztásból módszert választani; a szivárgó oszlopot közölni; „a több dimenzió mindig jobb”.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`_parts/gh11/run.sh szkript.py`: uv + networkx, numpy, scipy; segédmodulok `_parts/gh11/common.py` (`ART`, `comat`, `FIRST`, `SECOND`, `ACT`) és `_parts/gh11/lp.py` (`heur`, `auc`, `spectral`, `walks`, `cooc`, `ppmi_embed`); a szöveg számait adó szkriptek: `_parts/gh11/calc*.py`),
  a szkriptet tedd a `_parts/gh11/` mappába `qcheckN_` előtaggal (N = 1 vagy 2). A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: kapcsolat-előrejelzés, jelölt, pontszám $s(u, v)$, rangsor, tanítógráf, pozitív ($E^+$, $P$), negatív ($E^-$, $N$), időbeli felosztás, véletlen rejtés, közös szomszédok (CN), Jaccard-pontszám, preferenciális kapcsolódás (PA), Adamic–Adar (AA), erőforrás-allokáció (RA), Katz-index, precision@k, recall@k, holtverseny, ROC-görbe, AUC, negatív mintavétel, nehéz negatívak, szivárgás, pontozó gráf, csúcsbeágyazás $\mathbf z_u$, dimenzió $d$, Laplace-sajátleképezés (spektrális beágyazás), $\mu_2$, Fiedler-vektor, szerkezetileg ekvivalens, transzduktív, DeepWalk, séta, ablak $w$, skip-gram, (középső, környező) pár, együttelőfordulás $C_{uv}$, PMI, PPMI, SGNS, node2vec, $p$ (visszalépés), $q$ (távolodás), BFS-szerű / DFS-szerű.
  A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  Árvízhét teljes szereplőgráf (10 él): Ko–Vi, Ko–Po, Vi–Po, Vi–Sz, Sz–Kl, Ko–Sz, Ko–Kl, La–Ön, Po–La, Po–Ön; fokszámok Ko 4, Vi 3, Po 4, La 2, Ön 2, Sz 3, Kl 2. 11 jelölt: Ko–La, Ko–Ön, Vi–La, Vi–Ön, Vi–Kl, Po–Sz, Po–Kl, La–Sz, La–Kl, Ön–Sz, Ön–Kl.
  Teljes héten: Vi–Kl CN 2 (Ko, Sz), J 2/3, AA 1,632, RA 0,583, PA 6; Po–Sz CN 2 (Ko, Vi), J 0,4, AA 1,632, RA 0,583, PA 12; CN = 1: Ko–La, Ko–Ön, Vi–La, Vi–Ön, Po–Kl (AA 0,721, RA 0,25; J: Ko–La 0,2, Ko–Ön 0,2, Vi–La 0,25, Vi–Ön 0,25, Po–Kl 0,2; PA 8, 8, 6, 6, 8); CN = 0: La–Sz, La–Kl, Ön–Sz, Ön–Kl (távolság 3). $A^2$ Ko sora (Ko, Vi, Po, La, Ön, Sz, Kl): 4, 2, 1, 1, 1, 2, 1; Vi sora 2, 3, 1, 1, 1, 1, 2.
  Hét eleje (H–Sze, cikkek 1, 2, 4, 7, 10, 11) tanítógráf: Ko–Vi, Ko–Po, Vi–Po, Vi–Sz, La–Ön, Po–La; fokszámok Ko 2, Vi 3, Po 3, La 2, Ön 1, Sz 1, Kl 0. 15 jelölt, 4 pozitív: Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön. Véletlen szint 4/15 ≈ 0,267. Hét vége élei: Ko–Po, Po–La, La–Ön (nem jelölt) + a 4 pozitív. Eltűnő élek: Ko–Vi, Vi–Po, Vi–Sz. Kedd esti vágás: 4 él (Ko–Vi, Vi–Sz, La–Ön, Po–Vi), 17 jelölt.
  Tanítógráfon: CN = 1: Ko–La (Po), Ko–Sz (Vi), Vi–La (Po), Po–Ön (La), Po–Sz (Vi), a többi 0. J: Ko–Sz 0,5; Ko–La, Po–Ön, Po–Sz 1/3; Vi–La 0,25; többi 0. AA: Po–Ön 1,443 (La, $k=2$), a másik négy 0,910; RA: Po–Ön 0,5, a többi 1/3. PA: Vi–La 6, Ko–La 4, Vi–Ön 3, Po–Ön 3, Po–Sz 3, Ko–Sz 2, Ko–Ön 2, La–Sz 2, Ön–Sz 1, a Kl-esek 0.
  AUC (44 összevetés): CN 27/44 = 0,614, J 29/44 = 0,659, AA = RA 28,5/44 = 0,648, PA 18/44 = 0,409. Szivárgással (pontozás a teljes heti gráfon): CN 0,670, J 0,648 (csökken!), AA = RA 0,807, PA 0,727; Ko–Kl PA 0 → 8, Sz–Kl 0 → 6. Kl nélkül (9 jelölt, 2 pozitív, 7 negatív) a CN AUC 11/14 = 0,786.
  precision@k: Jaccard P@1 = 1, R@1 = 0,25, P@3 ≈ 0,556 (1,667 találat), P@4 = 0,5, R@4 = 0,5; AA P@5 = 0,4, R@5 = 0,5; CN P@5 = 0,4, P@2 = 0,4. Kézi AUC: pozitívak 0,9; 0,6; 0,3, negatívak 0,7; 0,3; 0,1 → 6,5/9 = 0,722 (holtversenyt 1-nek: 0,778, 0-nak: 0,667). Fordított pontszám: 1 − AUC (PA: 0,591).
  Karateklub: 34 tag, 78 él, 561 pár, 483 jelölt (13,9% él). 1000 szereplő × 10 partner: 5000 él, 499 500 pár, 494 500 jelölt. Véletlen precision@8 = 8/491 ≈ 0,016. Kiegyensúlyozatlansági példa: 5000 pozitív, 494 500 negatív, TPR 0,8, FPR 0,05 → precizitás 0,139. Nehéz negatívak (2 távolságú): CN AUC 0,68 (véletlen negatívak, 8–8) → 0,47.
  Karateklub, 10% tesztél, 100 felosztás (n2v 30): CN 0,691 ± 0,095 (szivárgó 0,698), J 0,610 (0,565), AA 0,728 (0,738), RA 0,738 (0,754), PA 0,711 (0,852), spektrális 2D 0,598 (0,820), 8D 0,537 (0,859), PPMI 8D 0,705 (0,888), node2vec SGNS 16D koszinusz 0,748 ± 0,071 (0,851); LR a Hadamard-szorzaton 0,763 (20 felosztás, koszinusz ugyanott 0,747).
  Spektrális: 4 csúcsú út $\mu$ = 0; 0,586; 2; 3,414; $\mathbf u_2 = (0{,}653;\ 0{,}271;\ -0{,}271;\ -0{,}653)$, $\mathbf u_3 = (0{,}5;\ -0{,}5;\ -0{,}5;\ 0{,}5)$; energia 2D-ben 2,586, 1D-ben 0,586; 1–2 távolság 1,070, 1–4 1,306. 3 csúcsú út: 0, 1, 3; $\mathbf u_2 = (0{,}707;\ 0;\ -0{,}707)$. Csillag (3 levél): 0, 1, 1, 4. 4-kör: 0, 2, 2, 4. Árvízhét teljes hét 2D (Ko előjele pozitív): Ko (0,239; 0,131), Vi (0,178; 0,616), Po (−0,186; 0,230), La = Ön (−0,521; −0,178), Sz (0,366; 0,073), Kl (0,446; −0,695); $\mu_2 = 0{,}643$; jelöltek távolsága: Po–Sz 0,574 (legközelebbi), Ko–La = Ko–Ön 0,821, La–Sz = Ön–Sz 0,922, Vi–La = Vi–Ön 1,057, La–Kl = Ön–Kl 1,097, Po–Kl 1,120, Vi–Kl 1,338 (legtávolabbi). Az $x$ előjele: {Ko, Vi, Sz, Kl} | {Po, La, Ön} = a legnagyobb modularitású felbontás. Öt barát: A és C egybeesik. Hét eleji tanítógráf: 0 kétszeres, AUC 0,70 véletlen bázisválasztásból.
  Séták: öt barát (A–B, A–C, B–C, B–D, D–E), „A B D E D B C”: ±1 → 12 pár (A–B 2, B–C 2, B–D 4, D–E 4), ±2 → 22 pár (új: A–D 2, B–E 4, C–D 2, D–D 2). Párszám $2\sum_{j=1}^{w}(\ell - j)$: 5 hosszú ±1 8, ±2 14; 10 hosszú ±3 48. Karate 340 séta, 6800 szó, 57 800 pár. PMI (±1 tábla, $|C| = 12$, csúcsonként A 1, B 4, C 1, D 4, E 2): A–B 1,099, B–D 0,405, D–E 1,099, B–C 1,099. node2vec A → B: $p = q = 1$ 1/3 mind; $p = 4$, $q = 0{,}5$: A 0,077, C 0,308, D 0,615; $p = 1$, $q = 2$: 0,4 / 0,4 / 0,2; $p = 0{,}25$, $q = 4$: 0,762 / 0,190 / 0,048. Ko → Po, $p = 1$, $q = 0{,}5$: Ko 1/6, Vi 1/6, La 1/3, Ön 1/3. Sz → Ko, $p = 1$, $q = 0{,}25$: Po 4/7 ≈ 0,571.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set` answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz (a `_parts/gh10/qcheck1_katex.js` mintájára).
- Munkát csak a saját fájlodban (`_parts/gh11/qN.js`) és a `_parts/gh11/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj. `pkill -f`-et ne használj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
