# Gráfelmélet és hálózattudomány 8. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh7/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag (a `_parts/gh8/` mappában): `00-head.html` (motiváció, jelölések), `01-s81.html` (8.1 mi a közösség: felbontás, $L_c$, $K_c$, $d_c = 2L_c + K_c$, a legkisebb vágás gondja, véletlen szint $(d_c/2m)^2$, Bell-számok, karateklub),
`02-s82.html` (8.2 Girvan–Newman: élköztesség, ismételt törlés újraszámolással, dendrogram, hol vágjunk), `03-s83.html` (8.3 modularitás: képlet két alakban, tulajdonságok, Árvízhét-felbontások, súlyozott modularitás, felbontási határ),
`04-s84.html` (8.4 Louvain: $\Delta Q$, 1. fázis, 2. fázis/összevonás, $\gamma$, Leiden), `05-s85.html` (8.5 címketerjesztés, modularitásmátrix, Fiedler, spektrális klaszterezés),
`06-s86.html` (8.6 SBM: várható élszámok, mag–periféria, kétrészes, likelihood, túlillesztés, fokszám-korrigált SBM, kimutathatósági határ), `07-s87.html` (8.7 NMI, ARI, Rand-index, együttes besorolási mátrix, konszenzus, véletlen gráf modularitása, nullmodell),
`08-s88.html` (8.8 alkalmazás: karateklub-táblázat, Les Misérables, Árvízhét közösség vs. keret, klikkperkoláció, hírkutatás).
A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`. Az Árvízhét szereplőgráfja (súly = közös cikkek): Ko–Vi 2, Ko–Po 2, Vi–Po 2, Vi–Sz 1, Sz–Kl 2, Ko–Sz 1, Ko–Kl 1, La–Ön 3, Po–La 2, Po–Ön 2.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis példát írhatsz,
ha a szakasz módszerével kézzel megoldható (gráfot élek felsorolásával adj meg, pl. „élek: AB, AC, BC, CD”; felbontást „{A, B} · {C, D}” alakban).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 8.1 */
    "gh8-81": {
      title: "Kvíz – 8.1 Mi a közösség?",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh8-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $d_c/m$ a $d_c/2m$ helyett; a négyzet elhagyása; a vágott él kétszeri számolása ($\sum K_c$ vs. vágott élek); $d_c = 2L_c$ (a $K_c$ nélkül);
  „kevés vágott él = jó felbontás”; csúcsköztesség az élköztesség helyett; a köztesség újraszámolásának elhagyása; párok kétszeri számolása; a Girvan–Newman megállási pontja mint „mindig 2 csoport”;
  $Q$ tartománya ($Q \le 1$, $Q \ge -1/2$, egy közösség: 0, mindenki külön: negatív); „a modularitás-maximum a valódi közösség”; a felbontási határ iránya (a kis közösségek összeolvadnak, nem szétesnek); nagyobb $\gamma$ → több / kisebb közösség (és nem fordítva);
  súlyozott belső súly súlyozatlan fokszámmal; a saját közösségből ki nem vett csúcs a $\Delta Q$-ban; „a Louvain a maximumot adja”; a Louvain szétszakadt közösségei vs. Leiden; címketerjesztés egyetlen futása; szinkron frissítés;
  Laplace második legkisebb ↔ modularitásmátrix legnagyobb sajátértéke; SBM-ben $n_r^2$ vagy $n_r(n_r-1)$ pár belül; „az SBM blokkjai mindig sűrű csomók”; a „mindenki külön” mint legjobb likelihood (túlillesztés); sima vs. fokszám-korrigált SBM;
  „pontosság” címkékkel NMI/ARI helyett; Rand-index korrekció nélkül; NMI túlértékelése sok kis csoportnál; egyetlen futás; $Q$ nullmodell nélkül; a null $Q$-ját más algoritmussal keresni; közösség = keret.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx --with numpy --with scipy --with scikit-learn python -I …`; a karateklub élei: `mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` (KARATE13, `club` mező); networkx-ben `nx.karate_club_graph()` élsúlyos – súly nélkül számolj),
  a szkriptet tedd a `_parts/gh8/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: felbontás (partíció), közösség, $L_c$ (belső élek), $K_c$ (kifelé futó élek), $d_c$ (fokszámösszeg), $m$, $k_i$; élköztesség $b(e)$, dendrogram; modularitás $Q$, véletlen szint, $Q^w$ (súlyozott: $W$, $W_c$, $s_c$), felbontási határ;
  Louvain, $\Delta Q = k_{i,C}/m - \Sigma_C k_i/2m^2$, szuperpont, hurok, $\gamma$ (felbontási paraméter), $Q_\gamma$, Leiden, finomítás; címketerjesztés; modularitásmátrix $B$, Fiedler-vektor, spektrális klaszterezés;
  SBM, blokk, blokkmátrix $p_{rs}$, asszortatív, mag–periféria, kétrészes (diszasszortatív), log-likelihood, túlillesztés, fokszám-korrigált SBM, kimutathatósági határ; NMI, ARI, Rand-index, együttes besorolási mátrix $C_{ij}$, konszenzus-klaszterezés; klikkperkoláció, átfedő közösség.
  A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  Két háromszög + híd (élek 12, 13, 23, 34, 45, 46, 56; $m = 7$, fokszámok 2, 2, 3, 3, 2, 2): {1,2,3}·{4,5,6}: $L$ 3, 3, $K$ 1, 1, $d$ 7, 7, $Q = 5/14 \approx 0{,}357$; {1,2}·{3,4,5,6}: $L$ 1, 4, $K$ 2, 2, $d$ 4, 10, $Q \approx 0{,}122$; {1,2,3,4}·{5,6}: $Q \approx 0{,}122$; {1,2}·{3,4}·{5,6}: $Q \approx 0{,}082$; egy csoport 0; mindenki külön $-34/196 \approx -0{,}173$.
  Élköztesség: híd 9, 1–3 és 2–3, 4–5, 4–6: 4, 1–2 és 5–6: 1; összeg 27 = a távolságok összege. 4 csúcsú út: 3, 4, 3. Csillag 3 levéllel: 3. Csokornyakkendő: AB 1, AC 3. Két háromszög + lógó 7-es csúcs (1–7): híd 12, 1–7: 6. Két $K_{10}$ két híddal: 50–50, egy törlés után 100.
  Árvízhét (súly nélkül, $m = 10$; fokszámok Ko 4, Vi 3, Po 4, La 2, Ön 2, Sz 3, Kl 2): élköztességek Ko–Po 7,5, Po–La és Po–Ön 5, Ko–Kl és Vi–Po 4,5, Vi–Sz 3, Ko–Sz 2,5, Ko–Vi és Sz–Kl 1,5, La–Ön 1; Ko–Po törlése után Vi–Po 12. Girvan–Newman: a 2. törlés után két komponens.
  877 felbontás (Bell-számok 1, 2, 5, 15, 52, 203, 877; 34 csúcsra $\approx 2{,}1 \cdot 10^{28}$). Legkisebb vágás 2 él, öt ilyen: {Kl}, {La}, {Ön}, {La, Ön}, {Po, La, Ön}.
  $Q$: {Ko,Vi,Sz,Kl}·{Po,La,Ön} 0,28 (1.; mindkét csoport többlete 0,14: 0,5 − 0,36 és 0,3 − 0,16); {Ko,Sz,Kl}·{Vi}·{Po,La,Ön} 0,215 (2.); {Ko,Sz,Kl}·{Vi,Po,La,Ön} 0,195 (3.); keretek {Ko,Vi}·{Po,La,Ön}·{Sz,Kl} 0,155 (7.; tagok −0,0225, 0,14, 0,0375); {Ko,Vi,Po}·{La,Ön}·{Sz,Kl} 0,095; {Ko,Vi,Sz,Kl,Po}·{La,Ön} 0,12; mindenki külön −0,155. {Kl} többlete −0,01; {Ko,Vi} többlete −0,0225; {Ko,Vi,Po}: $L$ 3, $K$ 5, $d$ 11.
  Súlyozva ($W = 18$; erősségek Ko 6, Vi 5, Po 8, La 5, Ön 5, Sz 4, Kl 3): két csoport 0,278 (1.), keretek 0,230 (2.), {Ko,Vi,Po}·{La,Ön}·{Sz,Kl} 0,218. Súlyozva $1{,}40 \le \gamma \le 1{,}80$-nál a keretfelbontás a legjobb; súly nélkül $\gamma \gtrsim 1{,}48$-tól a Vi leválik. Klikkperkoláció ($k = 3$): {Ko,Vi,Po,Sz,Kl} és {Po,La,Ön}, a Po mindkettőben.
  Felbontási határ: 10 háromszög gyűrűben ($m = 40$, $d = 8$): külön 0,650, párok 0,675; 8 háromszögnél holtverseny 0,625; 6-nál külön 0,583 > párok 0,542; feltétel $n_c \gt l(l-1) + 2$; $K_5$-gyűrű: 22, 24 klikknél 0,867 vs. 0,871. Összevonás feltétele $\ell_{12} \gt d_1 d_2/2m$ ($\gamma$-val $\gamma\, d_1 d_2/2m$). A gyűrűn $\gamma \gt 1{,}25$ felett a háromszögek külön.
  Louvain kézzel (két háromszög, sorrend 1..6): 1 → {2} (0,102 vs. 0,082); 3 → {1,2} (0,163 vs. 0,051); 4 → {5} (a {1,2,3}-hoz −0,071); 5 → {6} (0,102 vs. 0,082); 2. kör: 4 → {5,6} (0,163). Összevont: $\Delta Q = 1/7 - 49/98 = -0{,}357$. Vi ($k = 3$): {Ko,Sz,Kl}-hez ($\Sigma 9$, 2 él) 0,065, {Po,La,Ön}-hez ($\Sigma 8$, 1 él) −0,02.
  Karateklub (34 csúcs, 78 él; táborok 17–17, 11 él köztük, fokszámösszegek 81 és 75; valódi $Q = 0{,}358$): GN első törlés 1–32 (71,4), 11 törlés az első kettéesésig, 15 + 19, rossz oldalon 3 és 9, NMI 0,73, ARI 0,77, $Q = 0{,}360$; GN legjobb $Q$ 0,401 (5 csoport). Louvain $\gamma = 1$: 4 csoport, $Q$ 0,420 (100 futás 0,385–0,420), NMI 0,59, ARI 0,47; $\gamma = 0{,}5$: 2 (rossz: 9, 10; NMI 0,68, ARI 0,77); $\gamma = 2$: 7. Egy futás szintjei: 9 közösség ($Q = 0{,}311$) → 4 ($0{,}419$).
  Fiedler: 32/34 (3, 9); modularitásmátrix: 33/34 (9), $Q = 0{,}372$, NMI 0,84, ARI 0,88. Címketerjesztés két háromszögön 1000 futásból 959 két, 41 egy közösség; karateklubon 1–6 közösség.
  $B_{12} \approx 0{,}714$, $B_{34} \approx 0{,}357$, $B_{15} \approx -0{,}286$; a négyzet $B$-jének legnagyobb sajátértéke 0. Csillag és $K_{3,3}$ két oldala: $Q = -0{,}5$.
  SBM: 2 × 10, 0,5 / 0,05: 22,5 + 22,5 belül, 5 között, $\langle k\rangle = 5$; 3 × 8, 0,6 / 0,1: 16,8 és 6,4; 2 × 5, 0,8 / 0,1: 18,5 él, $\langle k\rangle = 3{,}7$. Log-likelihood (két háromszög): egy blokk −10,36; {1,2}·{3,4,5,6} −8,32; {1,2,3}·{4,5,6} −3,14; mindenki külön 0. Blokkpár 4 él / 20 pár: −10,01. Kimutathatóság $\langle k\rangle = 6$: $c_{\text{be}} \approx 8{,}45$, $c_{\text{ki}} \approx 3{,}55$, arány 0,42.
  NMI/ARI: A = {1,2,3}·{4,5,6}, B = {1,2}·{3,4,5,6}: Rand 10/15, ARI 0,32 (4, 2,8, 6,5), NMI 0,48 ($H$ 0,693 és 0,637, $I$ 0,318); átszámozás: 1 és 1; mindenki külön: NMI 0,56, ARI 0, Rand 9/15; egy csoport: 0 és 0.
  Véletlen gráf: $G(34, 78)$ Louvain-$Q$ $0{,}354 \pm 0{,}019$ (max 0,402); fokszámtartó null $0{,}298 \pm 0{,}015$; karateklub 0,420 → $z \approx 3{,}5$ és $7{,}9$. Les Misérables: 77 szereplő, 254 él, összsúly 820; súlyozott Louvain 6 közösség, $Q = 0{,}567$; Valjean fokszáma 36, köztessége 0,57. Stabilitás (widget, 20 futás): Louvain mindig 4, átlagos páronkénti NMI 0,90.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz (a `_parts/gh7/qcheck1_katex.js` mintájára).
- Munkát csak a saját fájlodban (`_parts/gh8/qN.js`) és a `_parts/gh8/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj. `pkill -f`-et ne használj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
