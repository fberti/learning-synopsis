# Gráfelmélet és hálózattudomány 4. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh3/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/gh4/00-head.html` (jelölések), `01-s41.html` (4.1 mátrix–vektor szorzás), `02-s42.html` (4.2 véletlen séta), `03-s43.html` (4.3 sajátvektor, hatványiteráció, Perron–Frobenius),
`04-s44.html` (4.4 Laplace-mátrix), `05-s45.html` (4.5 spektrális kettévágás), `06-s46.html` (4.6 alkalmazás az Árvízhétre). A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis gráfos példát írhatsz,
ha a szakasz módszerével kézzel megoldható (élek felsorolásával adj meg gráfot, pl. „élek: AB, AC, BC, CD”).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 4.1 */
    "gh4-41": {
      title: "Kvíz – 4.1 Mátrix–vektor szorzás",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh4-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $(A\mathbf x)_i$-be a saját értéket is beszámolni; átlag $\frac1n$-nel a fokszám helyett; $A\mathbf 1$ = $n$ vagy $m$ a fokszámok helyett; sor ↔ oszlop ($P$ sorösszege ↔ oszlopösszege, $\mathbf p^\top P$ ↔ $P\mathbf x$);
  $P_{ij} = 1/n$ vagy $1/d_j$ ($1/d_i$ helyett); stacionárius eloszlás $d_i/m$ ($2m$ helyett) vagy egyenletes; „mindig konvergál” (páros gráf!); irányított gráfon is $d_i/2m$; súlyozott sétán fokszám az erősség helyett;
  sajátvektor = bármely vektor, amelyet $A$ nem változtat; a sajátvektor egyértelmű (a számszorosa nem az); a hatványiteráció a legkisebb sajátértéket adja; az előjel jelent valamit; páros gráfon is konvergál; sajátvektor = fokszám;
  $L = A - D$; $\mathbf x^\top L\mathbf x$ a négyzet nélkül / élenként kétszer; a 0 sajátértékek száma = csúcsok / élek száma; $\mu_2$ = legnagyobb sajátérték; normalizált és nem normalizált keverése; az $A$-ból olvasható le a komponensszám;
  vágás $= \mathbf x^\top L\mathbf x$ (a 4-es szorzó nélkül) vagy $/2$; a legkisebb vágás a jó (kiegyensúlyozás nélkül); a Fiedler-vektor a legnagyobb sajátértékhez tartozik; a Fiedler-vágás mindig optimális / mindig kiegyensúlyozott; nem összefüggő gráfon $\mu_2 > 0$.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx --with numpy python -I …`; FIGYELEM: a networkx `karate_club_graph` élsúlyos – `to_numpy_array(..., weight=None)` kell; scipy nincs, a Laplace-mátrixot kézzel képezd: `np.diag(A.sum(1)) - A`),
  a szkriptet tedd a `_parts/gh4/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: szomszédsági mátrix $A$, fokszámmátrix $D$, fokszám $d_i$, $\mathbf 1$, szomszédösszeg $A\mathbf x$, szomszédátlag $D^{-1}A\mathbf x$; véletlen séta, átmenetmátrix $P = D^{-1}A$,
  sztochasztikus mátrix, $\mathbf p_{t+1}^\top = \mathbf p_t^\top P$, stacionárius eloszlás $\boldsymbol\pi$, $\pi_i = d_i/2m$ (súlyozva $s_i/\sum s$), lusta séta, beragadás (irányított); sajátvektor, sajátérték $A\mathbf v = \lambda\mathbf v$, $\lambda_1$, spektrum, hatványiteráció, normálás,
  Perron–Frobenius, $2m/n \le \lambda_1 \le d_{\max}$; Laplace-mátrix $L = D - A$, $\mathbf x^\top L\mathbf x = \sum (x_i - x_j)^2$, sajátértékei $0 = \mu_1 \le \mu_2 \le \dots$ (NEM λ!), algebrai összefüggőség $\mu_2$, kombinatorikus / véletlen sétás / szimmetrikusan normalizált Laplace;
  vágás, kiegyensúlyozott kettévágás, $\mathbf x \perp \mathbf 1$, lazítás, Fiedler-vektor, alsó korlát vágás $\ge n\mu_2/4$. A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  4 csúcsú út 1–2–3–4, $\mathbf x = (5, 1, 2, 4)$: $A\mathbf x = (1, 7, 5, 2)$, $D^{-1}A\mathbf x = (1;\ 3{,}5;\ 2{,}5;\ 2)$, $\mathbf x^\top L\mathbf x = 21$; $(1,2,3,4)$ → 3; $(1,-1,1,-1)$ → 12.
  Barátsággráf (élek AB, AC, BC, CD; fokszám 2, 2, 3, 1): $P$ sorai A $(0, \frac12, \frac12, 0)$, B $(\frac12, 0, \frac12, 0)$, C $(\frac13, \frac13, 0, \frac13)$, D $(0, 0, 1, 0)$; D-ből indulva $\mathbf p_1 = (0,0,1,0)$, $\mathbf p_2 = (\frac13,\frac13,0,\frac13)$, $\mathbf p_3 = (\frac16,\frac16,\frac23,0)$;
  A-ból $\mathbf p_1 = (0,\frac12,\frac12,0)$, $\mathbf p_2 = (\frac5{12},\frac16,\frac14,\frac16)$; $\boldsymbol\pi = (\frac14,\frac14,\frac38,\frac18)$; $L$-spektrum $0, 1, 3, 4$; Fiedler $(-0{,}41; -0{,}41; 0; 0{,}82)$; legjobb 2–2 vágás $\{A,B\}|\{C,D\}$, 2 él.
  Csillag (A közép, B, C, D levelek): $\boldsymbol\pi = (\frac12, \frac16, \frac16, \frac16)$; középről a séta oszcillál; $A$-sajátértékek $\pm\sqrt3$, 0, 0; $(\sqrt3,1,1,1)$ sajátvektor; $L$-spektrum $0, 1, 1, 4$; lusta séta középről 1 lépés után már $\boldsymbol\pi$.
  Csillag + él (A–B, A–C, A–D, B–C): hatványiteráció $\mathbf 1$-ből, max-normálva: $(1;0{,}67;0{,}67;0{,}33)$, $(1;1;1;0{,}6)$, $(1;0{,}77;0{,}77;0{,}38)$, …, határ $(1; 0{,}85; 0{,}85; 0{,}46)$, $\lambda_1 \approx 2{,}17$; második legnagyobb abszolút értékű sajátérték $-1{,}48$.
  $K_3$: $A\mathbf 1 = 2\cdot\mathbf 1$, $L$-spektrum 0, 3, 3. $C_4$: $\mathbf 1$ ($\lambda = 2$), $(1,-1,1,-1)$ ($\lambda = -2$). 3 csúcsú út: $L$-spektrum 0, 1, 3; $(1,1,1)$ → 0, $(1,2,3)$ → 2, $(1,3,1)$ → 8; $L(1,2,3) = (-1,0,1)$, $L(1,3,1) = (-2,4,-2)$.
  Két háromszög + híd (1-2, 1-3, 2-3, 3-4, 4-5, 4-6, 5-6): $L$-spektrum $0;\ 0{,}44;\ 3;\ 3;\ 3;\ 4{,}56$; híd nélkül $0;0;3;3;3;3$; Fiedler $(0{,}46; 0{,}46; 0{,}26; -0{,}26; -0{,}46; -0{,}46)$; vágás 1; alsó korlát $6 \cdot 0{,}44/4 \approx 0{,}66$.
  Árvízhét szereplőgráf (10 él; fokszám Ko 4, Po 4, Vi 3, Sz 3, La 2, Ön 2, Kl 2; $2m = 20$): $\boldsymbol\pi$ Ko 0,2, Po 0,2, Vi 0,15, Sz 0,15, La/Ön/Kl 0,1; súlyozott (erősség Po 8, Ko 6, Vi 5, La 5, Ön 5, Sz 4, Kl 3, összeg 36) Po 22,2%, Ko 16,7%, Vi/La/Ön 13,9%, Sz 11,1%, Kl 8,3%;
  Kl-ből 1 lépés: Ko ½, Sz ½; 2 lépés: Vi $\frac7{24}$, Kl $\frac7{24}$, Ko $\frac16$, Po $\frac18$, Sz $\frac18$. Hétfői vektor (Ko, Vi, Sz = 1): $(A\mathbf x)_{\mathrm{La}} = 0$, $(A\mathbf x)_{\mathrm{Po}} = 2$.
  Domináns sajátvektor (max = 1): Ko 1, Po 0,87, Vi 0,86, Sz 0,79, Kl 0,58, La 0,42, Ön 0,42; $\lambda_1 \approx 3{,}09$; $2m/n \approx 2{,}86$, $d_{\max} = 4$.
  $L$-spektrum $0;\ 0{,}64;\ 2{,}29;\ 3;\ 3{,}84;\ 4{,}71;\ 5{,}51$; Ko–Po és Vi–Po törlésével $0;0;2;3;3;4;4$. Fiedler: Kl −0,45, Sz −0,37, Ko −0,24, Vi −0,18, Po 0,19, La 0,52, Ön 0,52 → $\{\mathrm{Ko},\mathrm{Vi},\mathrm{Sz},\mathrm{Kl}\} | \{\mathrm{Po},\mathrm{La},\text{Ön}\}$, vágott élek Ko–Po, Vi–Po (2), $\mathbf x^\top L\mathbf x = 8$.
  Karateklub (súlyozatlan): $\mu_2 \approx 0{,}47$; előjel szerinti vágás 15–19, 10 él, 32/34 jó oldalon (kivétel a 3. és 9. tag); medián szerinti vágás 17–17, 34/34, 11 él (= valódi szakadás).
  Lapok hivatkozási gráfja: RH kifoka 0 → a séta beragad; VN-ből legfeljebb 3 lépés (VN→RH vagy VN→NY→EK→RH).
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/gh4/qN.js`) és a `_parts/gh4/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
