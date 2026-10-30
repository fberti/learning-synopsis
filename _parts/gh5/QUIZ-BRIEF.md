# Gráfelmélet és hálózattudomány 5. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh4/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/gh5/00-head.html` (jelölések), `01-s51.html` (5.1 fokszám, erősség, befok/kifok), `02-s52.html` (5.2 közelségi, harmonikus), `03-s53.html` (5.3 köztesség),
`04-s54.html` (5.4 sajátvektor-centralitás), `05-s55.html` (5.5 PageRank), `06-s56.html` (5.6 HITS), `07-s57.html` (5.7 melyiket mikor, sárkány, korreláció), `08-s58.html` (5.8 alkalmazás: Árvízhét, lapok, politikai blogok). A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis gráfos példát írhatsz,
ha a szakasz módszerével kézzel megoldható (élek felsorolásával adj meg gráfot, pl. „élek: AB, AC, BC, CD”; irányítottat „A→B” alakban).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 5.1 */
    "gh5-51": {
      title: "Kvíz – 5.1 Fokszám-centralitás",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh5-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: normálás $n$-nel ($n-1$ helyett) vagy elhagyva; fokszám az erősség helyett (és fordítva); befok ↔ kifok; befok + kifok összeadva;
  a távolságösszeg mint centralitás (reciprok nélkül), $n-1$ szorzó nélkül; nem összefüggő gráfon közelségi; harmonikusban $1/\infty$ nem 0;
  köztességben a végpont beszámolása; több legrövidebb útnál az egész pár (½ helyett 1); a párok kétszer számolása (irányítatlan gráf); normálás $\binom n2$-vel $\binom{n-1}{2}$ helyett;
  sajátvektor = fokszám; a legkisebb sajátérték; irányított láncon a sajátvektor nem 0; PageRank: $\alpha$ a teleportálás valószínűsége (fordítva), $(1-\alpha)/n$ helyett $\alpha/n$, a kifokkal való osztás elhagyása, zsákutca kezelés nélkül (elszivárgás), irányítatlan gráfon „egészen más, mint a fokszám”;
  HITS: hub ↔ tekintély felcserélése, a hub = kifok, a tekintély = befok (csak az 1. lépésben igaz!), $AA^\top$ ↔ $A^\top A$; „a centralitás = befolyás” (oksági tévedés); a legmagasabb értékű mindig ugyanaz minden centralitásnál.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx --with numpy --with scipy python -I …`; FIGYELEM: a networkx `karate_club_graph` élsúlyos – `nx.Graph(K.edges())`-szel vedd súlytalanul;
  a networkx sajátvektort / HITS-et más normálással adja, mint a szöveg: a szöveg max = 1-re normál), a szkriptet tedd a `_parts/gh5/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: fokszám-centralitás $C_{\text{fok}} = d(v)/(n-1)$, erősség $s(v)$, befok, kifok; távolság $\operatorname{dist}(u,v)$, távolságösszeg, közelségi $C_{\text{köz}} = (n-1)/\sum\operatorname{dist}$, harmonikus $C_{\text{harm}} = \sum 1/\operatorname{dist}$;
  köztesség $C_{\text{btw}} = \sum \sigma_{st}(v)/\sigma_{st}$, normálva $/\binom{n-1}{2}$, közvetítő (broker), strukturális lyuk; sajátvektor-centralitás $A\mathbf x = \lambda_1\mathbf x$, Perron–Frobenius, Katz; PageRank $p_i = \frac{1-\alpha}{n} + \alpha\sum_{j\to i} p_j/k^{\text{ki}}_j$, véletlen szörföző, teleportálás, zsákutca, $\alpha = 0{,}85$;
  HITS: tekintély $\mathbf a = A^\top\mathbf h$, hub $\mathbf h = A\mathbf a$, közös idézés, bibliográfiai csatolás; sárkány (Krackhardt). A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  Árvízhét szereplőgráf (élek Ko–Vi 2, Ko–Po 2, Vi–Po 2, Vi–Sz 1, Sz–Kl 2, Sz–Ko 1, Kl–Ko 1, La–Ön 3, La–Po 2, Po–Ön 2; a szám a súly):
  fokszám Ko 4, Po 4, Vi 3, Sz 3, La/Ön/Kl 2 (normálva /6: 0,67; 0,5; 0,33); erősség Po 8, Ko 6, Vi/La/Ön 5, Sz 4, Kl 3; említő cikkek Po 6, Ko/Vi/La/Ön 4, Sz 3, Kl 2; megszólalás La 3, Sz 3, Ko/Po/Ön 2, Vi 1, Kl 0;
  távolságösszeg Ko 8, Po 8, Vi 9, Sz 11, La/Ön/Kl 12; közelségi Ko/Po 0,75, Vi 0,67, Sz 0,55, többi 0,5; harmonikus Ko/Po 5, Vi 4,5, Sz 25/6 ≈ 4,17, többi 11/3 ≈ 3,67 (/6: 0,83; 0,75; 0,69; 0,61);
  köztesség Po 8, Ko 5, Vi 1,5, Sz 0,5, többi 0 (normálva /15: Po 0,53, Ko 0,33); +La–Vi éllel Po 4, Ko 4, Vi 3,33; Ko–Po nélkül Vi 9, Po 8, Ko 2, Sz 2; Kl–Ko nélkül Sz 5, Po 8, Ko 3, Vi 3;
  sajátvektor (max = 1) Ko 1, Po 0,87, Vi 0,86, Sz 0,79, Kl 0,58, La/Ön 0,42, $\lambda_1 \approx 3{,}09$; PageRank Po 0,196, Ko 0,190, Sz 0,147, Vi 0,145, La/Ön 0,110, Kl 0,103.
  Lapok szereplőgráfjai: RH háromszög Ko–Vi–Po; EK: Vi–Sz, Sz–Kl, Sz–Ko, Kl–Ko (Sz fokszám 3, köztesség 2); NY háromszög La–Po–Ön; VN csillag Po középen (Vi, La, Ön; köztesség 3).
  Lapok hivatkozási gráfja (súly nélkül): EK→RH, NY→EK, VN→RH, VN→NY; befok RH 2, EK 1, NY 1, VN 0; kifok VN 2, EK 1, NY 1, RH 0; súlyozva (EK→RH 2, NY→EK 1, VN→RH 1, VN→NY 2) RH súlyozott befoka 3;
  PageRank ($\alpha = 0{,}85$) RH 0,416, EK 0,278, NY 0,179, VN 0,126 (= 0,0375 + 0,85·0,416/4); $\alpha = 0{,}5$: RH 0,347, EK 0,274, NY 0,211, VN 0,168; HITS: tekintély RH 1, NY 0,62; hub VN 1, EK 0,62; „beérkező” sajátvektor mindenkire 0.
  Csillag (közép + 4 levél): fokszám-centr. közép 1; köztesség 6 (normálva 1); sajátvektor levél 0,5 ($\lambda = 2$). Közép + 5 levél: közelségi közép 1, levél 5/9 ≈ 0,56. Közép + 3 levél: levél sajátvektora $1/\sqrt3 \approx 0{,}58$.
  5 csúcsú út: fokszám-centr. 0,25; 0,5; 0,5; 0,5; 0,25; távolságösszeg 10, 7, 6, 7, 10; közelségi 0,4; 0,57; 0,67; harmonikus 25/12 ≈ 2,08; 2,83; 3; köztesség 0, 3, 4, 3, 0 (normálva /6: 0; 0,5; 0,67).
  $C_4$: közelségi 0,75; köztesség mindenkinek ½. $C_5$: köztesség 1. 7 csúcsú út közepe: 9, normálva 0,6. Csokornyakkendő (AB, AC, BC, CD, CE, DE): C köztessége 4, normálva 4/6 ≈ 0,67.
  Két háromszög + híd (12, 13, 23, 34, 45, 46, 56): köztesség 3-as és 4-es 6; közelségi 3-as 5/7 ≈ 0,71, 1-es 0,5; harmonikus 3-as 4.
  Két komponens (1–2–3 és 4–5): harmonikus 1,5; 2; 1,5; 1; 1; a közelségi képlet itt 0-t / értelmetlent ad.
  X–Y gráf (AB, AC, BC, XA, XB, CY, YL): fokszám A, B, C 3, X, Y 2, L 1; 2. iteráció A, B, C 8, X 6, Y 4, L 2; sajátvektor A = B = 1, C 0,90, X 0,75, Y 0,40, L 0,15. 3 csúcsú út: (0,71; 1; 0,71), $\lambda = \sqrt2$. $K_4$, $C_4$: mindenki 1.
  PageRank 3 csúcs (A→B, A→C, B→C, C→A, $\alpha = 1$): (0,4; 0,2; 0,4). „pr4” (A→B, A→C, B→C, C→A, D→C), $\alpha = 0{,}85$, $\frac14$-ből: $\mathbf p_1$ = (0,25; 0,144; 0,569; 0,0375); határ (0,373; 0,196; 0,394; 0,0375); $\alpha = 1$: (0,4; 0,2; 0,4; 0).
  Zsákutca-gráf (A→B, A→C, B→C, D→C, C zsákutca), kezelés és teleportálás nélkül: 1 lépés (0; 0,125; 0,625; 0), összeg 0,75; 2 lépés összeg 0,125; 3 lépés 0. $A\leftrightarrow B$: 0,5–0,5. $A\leftrightarrow B$ + C→A: C = 0,05, A ≈ 0,486, B ≈ 0,464.
  Irányított lánc A→B→C→D ($\alpha = 0{,}85$): 0,116; 0,215; 0,299; 0,370. Karateklub: fokszám–PageRank korreláció 0,998; edző (1) fokszám 16 (16/33 ≈ 0,48), elnök (34) 17 (0,52); köztesség (normált) 1-es 0,44, 34-es 0,30.
  HITS „összesítők és tudósítók” (H1→T1, H1→T2, H1→T3, H2→T1, H2→T2, T3→T1): 1. lépés a = (T1 3, T2 2, T3 1), h = (H1 6, H2 5, T3 3), normálva a (1; 0,67; 0,33), h (1; 0,83; 0,5); határ a T1 1, T2 0,80, T3 0,45; h H1 1, H2 0,80, T3 0,45. pr4-en 1. lépés: a (1/3, 1/3, 1, 0), h (1; 0,75; 0,25; 0,75).
  Sárkány (A–J; élek AB, AC, AD, AF, BD, BE, BG, CD, CF, DE, DF, DG, EG, FG, FH, GH, HI, IJ): fokszám D 6, F/G 5, A/B 4, C/E/H 3, I 2, J 1; közelségi F/G 0,64, D/H 0,60, A/B 0,53, C/E 0,5, I 0,43, J 0,31; köztesség H 14 (normálva 0,39), F/G 8,33, I 8, D 3,67, A/B 0,83; sajátvektor D 1, F/G 0,83, A/B 0,73, C/E 0,59, H 0,41.
  Karate korrelációk (Pearson): fokszám–közelségi 0,77; fokszám–köztesség 0,91; fokszám–sajátvektor 0,92; fokszám–PageRank 1,00; közelségi–köztesség 0,72.
  Politikai blogok: 1222 blog (586 liberális, 636 konzervatív), 19 021 link, 8,8% a táborok között; top 10 konzervatívak száma: befok 6, PageRank 6, tekintély 1, hub 0, kifok 4; PageRank–befok rangkorreláció 0,94, top 10-ből 9 közös; legnagyobb kifok blogsforbush.com 256.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/gh5/qN.js`) és a `_parts/gh5/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
