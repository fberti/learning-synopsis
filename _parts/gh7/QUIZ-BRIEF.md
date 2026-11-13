# Gráfelmélet és hálózattudomány 7. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh6/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag (a `_parts/gh7/` mappában): `00-head.html` (motiváció, jelölések), `01-s71.html` (7.1 Erdős–Rényi: $G(n,p)$, $G(n,m)$, várható élszám, binomiális → Poisson fokszám, óriáskomponens, $S = 1 - e^{-\langle k\rangle S}$, összefüggés $\ln n$-nél, $\ell \approx \ln n/\ln\langle k\rangle$, $C \approx p$),
`02-s72.html` (7.2 kisvilág: hat lépés, Karinthy, Milgram, kisvilág-definíció és $\sigma$, gyűrűrács $C = 3(k-2)/(4(k-1))$, $L \approx n/2k$, Watts–Strogatz), `03-s73.html` (7.3 nehéz farok, hatványfüggvény, skálafüggetlenség, BA-modell, $p_k$, $k_i \approx m\sqrt{t/t_i}$, Price/Máté-effektus, illesztés: hisztogram vs. CCDF vs. ML, Broido–Clauset-vita, barátság-paradoxon),
`04-s74.html` (7.4 konfigurációs modell, félélek, $(2m-1)!!$, hurok/többszörös él, $k_ik_j/(2m-1)$, élcsere, z-érték, empirikus p), `05-s75.html` (7.5 a nullmodellek létrája, mit tart fixen, hipergeometrikus és páros cikk–szereplő nullmodell, sakktábla-/curveball-csere, laptulajdonság-permutáció, rétegzett permutáció),
`06-s76.html` (7.6 alkalmazás: a három szereplőpár, többszörös tesztelés, a 4 háromszög olvasata, karateklub és blogok ER-hez és fokszámtartóhoz mérve, statisztikai vs. gyakorlati jelentőség), `10-end.html` (összefoglalás, döntési táblázat, szómagyarázó).
A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis példát írhatsz,
ha a szakasz módszerével kézzel megoldható (gráfot élek felsorolásával adj meg, pl. „élek: AB, AC, BC, CD”; fokszámsorozatot „(3, 2, 2, 1)” alakban).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 7.1 */
    "gh7-71": {
      title: "Kvíz – 7.1 Erdős–Rényi-gráf",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh7-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $\binom n2$ helyett $n^2$ vagy $n(n-1)$; $p$ és $\langle k\rangle$ összekeverése; $\langle k\rangle = pn$ vs. $p(n-1)$ (nagy $n$-nél mindegy – ne erre építs rossz választ kis $n$-nél sem, ha nem egyértelmű); Poisson használata kis gráfon;
  az óriáskomponens küszöbe ($\langle k\rangle = 1$) ↔ az összefüggés küszöbe ($\ln n$); $p = 1/n$ ↔ $p = \ln n/n$; „ER-ben vannak hubok”; $C_{\text{ER}} = \langle k\rangle$ vagy $1/\langle k\rangle$;
  kisvilág = csak rövid utak; $L \approx n/2k$ helyett $\ln n$ a rácsra; WS-ben $C$ és $L$ ugyanolyan gyorsan esik; a $p = 1$-es WS mint rács;
  CCDF-meredekség = $-\gamma$ (helyesen $-(\gamma - 1)$); a nyers hisztogram egyenese mint jó becslés; „log–log egyenes ⇒ hatványfüggvény”; a skálafüggetlenség mint „minden csúcs egyforma”; BA $\gamma = 2$ vagy $2{,}5$; BA egyik összetevő elhagyása (csak növekedés / csak preferencia) ⇒ hubok; preferenciális esély $1/n$ vagy $k_i/n$;
  barátság-paradoxonnál $\langle k\rangle$ vagy $\langle k^2\rangle$ a $\langle k^2\rangle/\langle k\rangle$ helyett; konfigurációs modellnél $k_i k_j/m$ ($2m$ helyett) vagy $k_i + k_j$; a várható élszám mint valószínűség (≤ 1); hurok/többszörös él „nem fordulhat elő”; páratlan fokszámösszeg;
  élcsere „megtartja a háromszögeket / komponenseket”; egyetlen véletlen gráf mint nullmodell; $z$ → normális p kis gráfon; $\hat p = \#/N$ (a +1-ek nélkül); $\hat p = 0$ közlése;
  $G(n,m)$ ↔ fokszámtartó ↔ páros nullmodell felcserélése; vetületen élcsere együttemlítési gráfnál; hipergeometrikus várható érték $a + b$ vagy $ab$; többszörös tesztelés figyelmen kívül hagyása; nagy hálózaton óriási $z$ = nagy hatás.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx --with numpy --with scipy python -I …`; a karateklub élei: `mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` (KARATE13); networkx-ben `nx.karate_club_graph()` élsúlyos – súly nélkül számolj),
  a szkriptet tedd a `_parts/gh7/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: $n$, $m$, fokszám $k_i$, $\langle k\rangle$, $\langle k^2\rangle$, $p_k$ (fokszámeloszlás); $G(n,p)$, $G(n,m)$, Erdős–Rényi- (ER-) gráf, óriáskomponens, $S$, fázisátalakulás, kritikus pont; átlagos legrövidebb út $L$ (vagy $\ell$), klaszterezettség $C$ ($\bar C$, $C_\Delta$);
  kisvilág, gyűrűrács, átkötés, Watts–Strogatz, $\sigma$; nehéz farok, hatványfüggvény $p_k \propto k^{-\gamma}$, skálafüggetlen, hub, CCDF $P(K \ge k)$, maximum likelihood (ML) becslés, $k_{\min}$, lognormális; Barabási–Albert (BA), növekedés, preferenciális kapcsolódás $\Pi_i = k_i/\sum_j k_j$; barátság-paradoxon;
  konfigurációs modell, félél, hurok, többszörös él, élcsere (fokszámtartó újrahuzalozás), nullmodell, $\bar x_0$, $s_0$, z-érték, empirikus p-érték $\hat p$; hipergeometrikus nullmodell, páros (cikk–szereplő) nullmodell, sakktábla-csere, curveball, laptulajdonság-permutáció, rétegzett permutáció; Bonferroni.
  A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  ER: $G(10;0{,}2)$: 45 pár, $\mathbb E(m) = 9$, $\langle k\rangle = 1{,}8$; $p_0 = 0{,}8^9 \approx 0{,}134$ (Poisson $e^{-1{,}8} \approx 0{,}165$), $p_1 \approx 0{,}302$ (Poisson 0,298); $G(3;0{,}3)$: 0,343 / 0,441 / 0,189 / 0,027; $G(4,3)$: 20 gráf, 4 háromszög, 4 csillag, 12 út, $P(\text{összefüggő}) = 0{,}8$; $G(5,2)$: 45 gráf, 30 közös végpontú, 15 diszjunkt.
  $n = 4$, $p = 1/2$: fokszám $B(3; 1/2)$: 1/8, 3/8, 3/8, 1/8. 1000 csúcs, $\langle k\rangle = 4$: kb. 18 izolált. $S$: $\langle k\rangle$ = 1,5 → 0,583; 2 → 0,797; 3 → 0,940; 4 → 0,980; $\langle k\rangle \le 1$ → 0. Izolált arány $e^{-\langle k\rangle}$: 0,223 / 0,135 / 0,050 / 0,018. $n = 1000$: óriás-küszöb $p \approx 0{,}001$, összefüggés $\langle k\rangle \approx 6{,}9$, $p \approx 0{,}0069$.
  $\ell$: $10^6$, $\langle k\rangle = 10$ → 6; $8 \cdot 10^9$, 1000 → 3,3; $10^4$, 20 → 3,1. ER $n = 1000$, $\langle k\rangle = 10$: $C \approx 0{,}01$. Karateklub (34, 78): $L = 2{,}41$, $\bar C = 0{,}57$, $C_\Delta = 0{,}26$, max fokszám 17, $\langle k\rangle = 4{,}59$; $G(34,78)$: $L \approx 2{,}40$, $\bar C \approx 0{,}13$, $C_\Delta \approx 0{,}13$, max fokszám ≈ 9 (90%: 8–11, 17 soha); fokszámtartó: $\bar C \approx 0{,}36$, $C_\Delta \approx 0{,}22 \pm 0{,}025$, $L \approx 2{,}25$.
  Kisvilág: Milgram/Travers 1969: 296 lánc, 64 célba (≈ 22%), átlag 5,2 közvetítő; Karinthy *Láncszemek* 1929; Facebook 2011: 4,74 (Backstrom és mtsai 2012); karateklub $\sigma \approx 4{,}3$ (a szövegben kerekítve 4,4 is), blogok $\sigma \approx 13$.
  Gyűrűrács: 8 csúcs, $k = 4$: $C = 0{,}5$, $L = 10/7 \approx 1{,}43$; 12 csúcs, $k = 4$: $L = 21/11 \approx 1{,}91$; a 0–1 → 0–6 átkötés után $L \approx 1{,}85$, $C \approx 0{,}41$; $k = 2$: $C = 0$; $k = 6$: 0,6; $k = 10$: 0,667; $k \to \infty$: 3/4; $n = 1000$, $k = 10$: $L = 50{,}45$; 6 csúcsú kör $L = 1{,}8$.
  WS ($n = 1000$, $k = 10$; 5000 él): $p$ = 0,001: $C/C_0$ 0,997, $L/L_0$ 0,54 · 0,01: 0,97, 0,18 ($L \approx 9{,}1$) · 0,1: 0,73, 0,088 · 0,3: 0,35, 0,071 · 1: 0,014, 0,065.
  Hatványfüggvény: duplázás $2^{\gamma}$ ($\gamma$ = 3 → 8; 2,5 → 5,66; 2 → 4); $\gamma = 2$, $c = 6/\pi^2 \approx 0{,}61$: $p_{10} \approx 0{,}0061$; $10^{2{,}5} \approx 316$. $\gamma \le 3$: $\langle k^2\rangle$ végtelen; $\gamma \le 2$: az átlag is.
  Blogok (irányítatlanul): 1222 csúcs, 16 714 él, $\langle k\rangle = 27{,}4$, medián 13, max 351, 60 blog ≥ 100; ER max ≈ 47; $\langle k^2\rangle/\langle k\rangle = 81{,}3$; nyers hisztogram-meredekség −1,07; CCDF (összes) −1,23 → $\gamma \approx 2{,}23$; ML: $k_{\min}$ 20 → 2,07; 29 → 2,36 (380 blog); 50 → 2,85; 100 → 3,79; lognormális / levágott hatvány jobb ($p \lt 0{,}001$).
  $\bar C = 0{,}32$ (ER 0,022, fokszámtartó 0,19), $C_\Delta = 0{,}23$ (ER 0,022, fokszámtartó 0,149, szórás ≈ 0,0003), $L = 2{,}74$ (ER 2,51, fokszámtartó 2,59). Két legnagyobb hub: 351 és 306, $2m = 33\,428$, $k_ik_j/2m \approx 3{,}2$.
  BA: háromszög → 1/3; fokszámok 3, 2, 2, 1 → 3/8, 2/8, 2/8, 1/8; $p_k = 2m(m+1)/(k(k+1)(k+2))$, $m = 2$: 0,5 / 0,2 / 0,1; $m = 1$: 0,67 / 0,17 / 0,067; $\langle k\rangle = 2m$; $m = 2$, $t = 10\,000$: $t_i = 100$ → 20, $t_i = 1$ → 200; $m = 1$, $t = 1000$, $t_i = 10$ → 10; $n = 1000$, $m = 2$: max fokszám átl. ≈ 84–90, ER ≈ 12, $C \approx 0{,}03$.
  ML kézzel: 2, 2, 3, 4, 8, $k_{\min} = 2$ → 2,27; 4, 4, 9, $k_{\min} = 4$ → 3,48.
  Barátság-paradoxon: csillag 4 levéllel 1,6 vs. 2,5; 3 levéllel 1,5 vs. 2; 10 levéllel 1,82 vs. 5,5; Árvízhét 20/7 ≈ 2,86 vs. 62/20 = 3,1; karateklub 4,59 vs. 7,77; 4 csúcsú út 1,5 vs. 1,67; $\langle k\rangle = 10$, szórás 10 → 20.
  Konfigurációs: (2, 1, 1) → 3 párosítás, 2 út + 1 hurok; (1, 1, 1, 1) → 3, mind egyszerű; (2, 2) → soha egyszerű; (3, 1, 1, 1) → 15 párosítás, 6 csillag; Árvízhét fokszámai (4, 4, 3, 3, 2, 2, 2), $2m = 20$: $19!! = 654\,729\,075$; csak kb. 6% egyszerű, átlag 1,1 hurok ($21/19$);
  várható élszám: Ko–Po $16/19 \approx 0{,}84$, Ko–Kl $8/19 \approx 0{,}42$, La–Ön $4/19 \approx 0{,}21$; 4 és 3, $m = 20$: 0,3 (pontosan $12/39$).
  Élcsere: két háromszög ↔ hatszög (minden fok 2); csillag és $K_4$: nincs érvényes csere. Árvízhét háromszögek: $G(7,10)$ 3,15 ± 1,17 ($z \approx 0{,}7$, 36% ≥ 4); fokszámtartó 2,40 ± 0,84 ($z \approx 1{,}9$, 8% ≥ 4; legfeljebb 4); páros 8,34 ± 2,71 ($z \approx -1{,}6$, 6% ≤ 4, 98% ≥ 4), a páros nullmodellben átlag 13,2 különböző pár (megfigyelt 10).
  z/p: 5, 2,1, 1,0 → 2,9; 10 sorsolás (2, 1, 3, 2, 4, 2, 1, 2, 3, 1): átlag 2,1, szórás 0,94, $z \approx 3{,}1$; 1000-ből 12 → $13/1001 \approx 0{,}013$; 500-ból 4 → 0,010; $z = 1{,}9$ normálisan $p \approx 0{,}03$, valójában 0,08.
  Szereplők cikkszáma: Ko 4, Vi 4, Po 6, La 4, Ön 4, Sz 3, Kl 2; 12 cikk, 27 említés; 9 kétszereplős, 3 háromszereplős cikk.
  Hipergeometrikus La–Ön (4, 4 a 12-ből): 70 / 224 / 168 / 32 / 1 a 495-ből; várható 1,33; $P(\ge 3) = 33/495 \approx 0{,}067$. Ko–Vi $P(\ge 2) \approx 0{,}41$; Sz–Kl várható 0,5, $P(2) = 3/66 \approx 0{,}045$; Po–La várható 2.
  Páros nullmodell (pontos): La–Ön és Ko–Vi: 0,306 / 0,492 / 0,185 / 0,0175 / 0,0003, várható 0,92, szórás 0,74; La–Ön $P(\ge 3) \approx 0{,}018$, $z \approx 2{,}8$; Ko–Vi $P(\ge 2) \approx 0{,}20$, $z \approx 1{,}5$; Sz–Kl várható 0,31, $P(\ge 2) \approx 0{,}016$, $z \approx 3{,}4$; Po–La várható 1,51, $P(\ge 2) \approx 0{,}50$.
  21 pár, Bonferroni $0{,}05/21 \approx 0{,}0024$ – egyik sem; 10 élre 0,005. Reggeli Hírlap 3 cikkéből 3 említi a Kormányt: $4/220 \approx 0{,}018$; Nyitott Szó 3 cikke mind veszteség-keretes (5 ilyen cikk): $10/220 \approx 0{,}045$.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`. KaTeX-hibákat is nézz (pl. a `katex` npm-csomaggal `node`-ban, vagy a `_parts/gh6/qcheck1_katex.js` mintájára).
- Munkát csak a saját fájlodban (`_parts/gh7/qN.js`) és a `_parts/gh7/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
