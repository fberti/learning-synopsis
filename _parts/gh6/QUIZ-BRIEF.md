# Gráfelmélet és hálózattudomány 6. fejezet – kvízírási útmutató

Olvasd el: a `CLAUDE.md`-t (a synopsis gyökerében, főleg a „Kvízek” részt), az `assets/quiz.js` fejlécét (kérdéstípusok), és mintának
`_parts/gh5/q1.js` első ~150 sorát (formátum, hangnem, magyarázatok stílusa).
A tananyag: `_parts/gh6/00-head.html` (jelölések), `01-s61.html` (6.1 háromszögek, $C_i$, $\bar C$ vs. $C_\Delta$), `02-s62.html` (6.2 homofília, kategóriás asszortativitás $r$, fokszám-asszortativitás $r_k$),
`03-s63.html` (6.3 triadikus zárás, helyi híd, átfedés $O_{ij}$, erős triadikus zárás, Granovetter, Onnela), `04-s64.html` (6.4 előjeles háromszögek, Cartwright–Harary, körök, kéttáboros bontás, frusztrációs index, gyenge egyensúly),
`05-s65.html` (6.5 nullmodell, z-érték, motívum, irányított triádok, előrecsatolt hurok), `06-s66.html` (6.6 alkalmazás: a hét napról napra, gyári háromszögek, klaszterezettség + köztesség, a feszült háromszög olvasata, homofília valós hálózatokban),
`10-end.html` (összefoglalás, döntési táblázat). A futó példa adatai: `grafelmelet-halozattudomany/arvizhet-data.js`.
A kvíz CSAK olyat kérdezzen, ami a szakasz szövegében szerepel (fogalmak, képletek, buktatók, példák) – ne vigyél be új tényt. Új, kis gráfos példát írhatsz,
ha a szakasz módszerével kézzel megoldható (élek felsorolásával adj meg gráfot, pl. „élek: AB, AC, BC, CD”; előjeleset „AB+, BC−” alakban; irányítottat „A→B” alakban).

Formátum: a fájlod egy JS-objektumtöredék, pontosan így (a végén összefűzöm a quizzes.js-be):
```js
    /* ------------------------------------------------ 6.1 */
    "gh6-61": {
      title: "Kvíz – 6.1 Háromszögek és klaszterezettség",
      questions: [
        { type: "single", shuffle: true, q: R`…`, options: [...], answer: 0, hint: "…", explain: R`…` },
        …
      ]
    },
```
(`R` = String.raw, már definiálva van; KaTeX: `$…$`, tizedesvessző `0{,}5`, ezres tagolás `\,`; `<` helyett `\lt` a KaTeX-ben.)

Szabályok (kötelező):
- Szakaszonként 6–7 kérdés; a fejezetzáróban (`gh6-final`) 12–14 (minden szakaszból legalább egy, vegyesen, kicsit nehezebbek is).
- Típusok: `single` (shuffle: true), `multi` (answer: indexek tömbje), `match` (pairs: [[bal, jobb], …] – a JOBB oldal legördülőben
  jelenik meg, ott NE legyen KaTeX/$…$, csak sima szöveg), `set` (items + answer: az elemek ÉRTÉKEI, nem indexek). `numeric` TILOS.
- Minden kérdésnek legyen `hint` (ötlet, nem árulja el a választ) és részletes `explain` (a tipikus hibára is kitérve).
- Rossz válaszok kézzel, tipikus hibákból: $C_i$-ben osztás $k_i$-vel, $k_i^2$-tel vagy $k_i(k_i-1)$-gyel ($\binom{k_i}2$ helyett); a csúcs saját éleinek beszámolása; a háromszögek számánál a 3-mal (vagy $\operatorname{tr}(A^3)$-nál a 6-tal) való osztás elhagyása;
  $\bar C$ és $C_\Delta$ felcserélése; a 3-as szorzó elhagyása a tranzitivitásban; $k \lt 2$ csúcs $C = 1$-nek véve; a magas $C_i$ mint „fontosság”;
  homofíliánál a nyers belső arány az $r$ helyett; csúcsarány az élvégarány helyett; $r = 0$ mint „nincs él a csoportokon belül”; homofília → befolyás (oksági tévedés); fokszám-asszortativitásnál csúcsonkénti korreláció, egy irányban felírt párok, egyenlő fokszámnál „0” vagy „1”;
  triadikus zárás pillanatfelvételből „látva”; híd ↔ helyi híd; átfedés nevezőjében a végpontok; az erős triadikus zárás tételének feltételei elhagyva („minden helyi híd gyenge” két erős kötés nélkül is); „a gyenge kötés fontosabb” (általánosítás);
  előjeles háromszögnél „sok mínusz = rossz” (paritás helyett darabszám); hiányzó él = negatív él; csak háromszögek ellenőrzése nem teljes gráfon; három páronként ellenséges tábor erős egyensúlyban; gyenge ↔ erős egyensúly;
  frusztrációs index ↔ a feszült háromszögek száma (nem mindig ugyanaz!); motívum nyers darabszámból; $G(n,m)$ ↔ fokszámtartó nullmodell; FFL ↔ 3-kör; időrendi átvételi gráfban kör.
  Számválaszoknál 4 opció, egységes formátumban.
- Minden numerikus választ ÉS rossz választ ellenőrizz Pythonnal (`uv run -q --with networkx --with numpy --with scipy python -I …`; a karateklub élei: `mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js` (KARATE13), súlyai `grafelmelet-halozattudomany/06-helyi-szerkezet/karate-weights.js`; networkx-ben `nx.karate_club_graph()` élsúlyos – a klaszterezettséghez súly nélkül számolj),
  a szkriptet tedd a `_parts/gh6/` mappába `qcheckN_` előtaggal. A magyarázatban szereplő számokat is.
- Kerüld a „mindegyik igaz” / „egyik sem” opciót. A `multi`-ban 2–3 helyes legyen 5 opcióból.
- Tegező, rövid mondatok, a fejezet szóhasználata és jelölései: fokszám $k_i$, szomszédhalmaz $N(i)$, háromszögek $T_i$, helyi klaszterezettség $C_i = T_i/\binom{k_i}2$, átlagos $\bar C$, globális $C_\Delta$ (tranzitivitás), összefüggő hármas (ék), nyitott / zárt hármas;
  homofília, heterofília, csoporton belüli arány $\sum e_{gg}$, véletlen szint $\sum a_g^2$ ($a_g$ = élvégarány), kategóriás asszortativitás $r$, fokszám-asszortativitás $r_k$, asszortatív / diszasszortatív;
  triadikus zárás, erős triadikus zárás, helyi híd, fesztáv, szomszédsági átfedés $O_{ij}$, gyenge / erős kötés; előjel $\sigma(ij) = \pm 1$, kiegyensúlyozott / kiegyensúlyozatlan (feszült), tábor, frusztrációs index, gyenge egyensúly (Davis);
  nullmodell, $G(n, m)$, fokszámtartó átkötés, z-érték, motívum, triádcenzus, előrecsatolt hurok (FFL), irányított 3-kör. A szereplőrövidítéseket képletben `\mathrm{Ko}` alakban írd, az Önkénteseket `\text{Ön}`-nel (KaTeX!).
- Rögzített tények (Pythonnal ellenőrizve):
  Árvízhét szereplőgráf (élek Ko–Vi 2, Ko–Po 2, Vi–Po 2, Vi–Sz 1, Sz–Kl 2, Sz–Ko 1, Kl–Ko 1, La–Ön 3, La–Po 2, Po–Ön 2; a szám a súly = közös cikkek): fokszám Ko 4, Po 4, Vi 3, Sz 3, La/Ön/Kl 2;
  háromszögek: Ko–Vi–Po, Ko–Vi–Sz, Ko–Sz–Kl, Po–La–Ön (4; $\operatorname{tr}(A^3) = 24$); $T$: Ko 3, Vi/Po/Sz 2, Kl/La/Ön 1; $C$: Ko 0,5; Vi 2/3; Po 1/3; Sz 2/3; Kl, La, Ön 1; $\bar C = 31/42 \approx 0{,}74$; összefüggő hármasok 21, nyitott 9; $C_\Delta = 12/21 = 4/7 \approx 0{,}57$;
  a Kormány társai közti 6 párból 3 él (Vi–Po, Vi–Sz, Sz–Kl), a Polgármesteréi közt 2 (Ko–Vi, La–Ön); nyitott hármas középen: Po 4, Ko 3, Vi 1, Sz 1, többi 0; köztesség (5.3) Po 8, Ko 5, Vi 1,5, Sz 0,5, többi 0.
  Hiányzó párok közös társai: Vi–Kl 2 (Ko, Sz), Po–Sz 2 (Ko, Vi); Ko–La, Ko–Ön, Vi–La, Vi–Ön, Po–Kl 1; Sz–La, Sz–Ön, Kl–La, Kl–Ön 0.
  Átfedések: Ko–Vi 0,67; Ko–Po 0,20; Vi–Po 0,25; Vi–Sz 0,33; Sz–Kl 0,5; Ko–Sz 0,67; Ko–Kl 0,33; La–Ön 1; Po–La 0,33; Po–Ön 0,33; helyi híd nincs.
  Civil (La, Ön) / többi: belső arány 0,8, élvégarány 0,2 / 0,8, véletlen szint 0,68, $r = 0{,}375$; fokszám-asszortativitás $r_k \approx -0{,}16$.
  A hét: H Ko–Vi, Vi–Sz; K La–Ön, Po–Vi; Sze Ko–Po (zárás a Vi-n át), Po–La (6 él, 1 háromszög, $\bar C$ 0,24, $C_\Delta$ 0,375); Cs Sz–Kl, Sz–Ko (zárás a Vi-n át), Kl–Ko, Po–Ön (zárás a La-n át) (10 él, 4 háromszög); P–V nincs új él.
  Gyári háromszögek: Ko–Vi–Po (2. cikk), Ko–Sz–Kl (5.), Po–La–Ön (8.); összerakott: Ko–Vi–Sz (1./2., 4., 5. cikk); csak az összerakottal $C_\Delta = 3/21 \approx 0{,}14$.
  Előjeles gráf (Ko–Vi +, Sz–Vi +, Po–Ko +, Vi–Po +, Sz–Ko −, La–Ön +, Po–La +, Po–Ön +; Kl-nek nincs előjeles éle): háromszögek Ko–Vi–Po +++, Po–La–Ön +++, Ko–Vi–Sz ++− (feszült); kiegyensúlyozott arány 2/3; frusztrációs index 1;
  javítások: Sz–Ko → + (egy tábor), Sz–Vi → − (táborok {Sz} és a többiek); a Ko–Vi → − egymagában nem elég (Ko–Vi–Po feszült lenne).
  Kis gráfok: csillag (közép + 4 levél): $C$ közép 0, $r_k = -1$; $K_4$: $C = 1$, $r_k$ nem értelmezhető; barátsággráf (AB, AC, BC, CD): $C_A = C_B = 1$, $C_C = 1/3$, $C_D = 0$, $\bar C = 7/12 \approx 0{,}58$, $C_\Delta = 0{,}6$, CD helyi híd és híd, $O_{AC} = 1/2$;
  csokornyakkendő (AB, AC, BC, CD, CE, DE): $C_C = 1/3$, többi 1, $\bar C = 13/15 \approx 0{,}87$, $C_\Delta = 0{,}6$ (10 hármas, 6 zárt); két háromszög + híd (12, 13, 23, 34, 45, 46, 56): $C_3 = C_4 = 1/3$, $\bar C = 7/9 \approx 0{,}78$, $C_\Delta = 0{,}6$, $O_{34} = 0$, $O_{12} = 1$, $O_{13} = 1/2$, csoportok {1,2,3}/{4,5,6}: $r = 5/7 \approx 0{,}71$;
  „létra” (12, 23, 13, 45, 56, 46, 14, 25): {1,2,3}/{4,5,6} belső 6/8, $r = 0{,}5$; {1,3,4}/{2,5,6} belső 4/8, $r = 0$; 4 csúcsú út $r_k = -0{,}5$; 5 csúcsú út $r_k = -1/3$; $K_5$ + $K_2$: $r_k = +1$; sárkány $r_k \approx 0{,}15$; gyémánt (AB, AC, AD, BC, CD): $C_A = C_C = 2/3$, $C_B = C_D = 1$, $\bar C = 5/6$, $C_\Delta = 0{,}75$.
  Homofília: 90/10-es élvégarány, 82% belső → $r = 0$; 70/30, 58% belső → $r = 0$; három egyforma csoport, 50% belső → $r = 0{,}25$; két egyforma csoport: $r = 2 \cdot \text{belső} - 1$.
  Karateklub: 34 tag, 78 él, 45 háromszög, 528 összefüggő hármas (393 nyitott), $\bar C = 0{,}57$, $C_\Delta \approx 0{,}26$, $C_1 \approx 0{,}15$, $C_{34} \approx 0{,}11$, a két tábor közt 11 él, $r = 0{,}72$, $r_k = -0{,}48$; súlyok 1–7, a táborok közti élek átlagsúlya 2,27, a belsőké 3,07; átlagos átfedés 0,074 vs. 0,194; súly–átfedés Spearman 0,45; helyi híd 11.
  Politikai blogok (irányítatlanul): 1222 blog, 16 714 él, 9,4% a táborok közt (belső 90,6%), élvégarány 0,48 / 0,52, véletlen szint ≈ 0,50, $r = 0{,}81$, $\bar C = 0{,}32$, $C_\Delta = 0{,}23$, $r_k = -0{,}22$.
  Nullmodell: Árvízhét 4 háromszög; $G(7, 10)$ várható 3,16 (pontosan $35 \cdot \frac{10 \cdot 9 \cdot 8}{21 \cdot 20 \cdot 19}$), szórás ≈ 1,16, z ≈ 0,7; fokszámtartó átlag ≈ 2,4, szórás ≈ 0,8, z ≈ 2,0, kb. 8%-ban legalább 4; karate $G(n,m)$ 15,6 (szórás 3,8, z ≈ 7,7), fokszámtartó ≈ 39,3 (szórás ≈ 4,7, z ≈ 1,2).
  Irányított: lapok átvételei (EK→RH, NY→EK, VN→RH, VN→NY): 0 FFL, 0 3-kör (két lánc, egy közös cél, egy közös forrás); + NY→RH: 2 FFL; 16 triádtípus.
  Előjeles mintagráfok: $K_4$ AB+, CD+, a többi −: kiegyensúlyozott, táborok {A,B}, {C,D}; ugyanez CD−-vel: ACD, BCD $---$, nem kiegyensúlyozott, frusztráció 1, gyengén kiegyensúlyozott (3 tábor); öt szereplő AB+, BC−, CD+, DA−, AE+, EC−: táborok {A,B,E}, {C,D}; 5-kör egy negatívval: nem kiegyensúlyozott, frusztráció 1, nincs háromszöge.
  Teljes kiegyensúlyozott gráf 3 + 2 táborral: 6 negatív, 4 pozitív él; 4 + 2: 8 negatív, 7 pozitív.
- A szöveg hibái: ha a tananyagban hibát, ellentmondást vagy elszámolást találsz, NE javítsd a HTML-t, hanem jelentsd a végén (fájl, hely, mi a hiba).
- Ellenőrzés: `node --check` a töredékre egy `(function(){const R=String.raw; const Q={ … }; })();` burokkal, és egy kis node-
  szkripttel nézd meg, hogy minden kérdésnek van hint-je és explain-je, a `single`/`multi` answer indexei érvényesek, a `set`
  answer-elemei szerepelnek az items között, és nincs `numeric`.
- Munkát csak a saját fájlodban (`_parts/gh6/qN.js`) és a `_parts/gh6/qcheckN_*` szkriptekben végezz. /tmp-t ne használj. Ne commitolj.
- A végén röviden jelentsd: hány kérdés készült szakaszonként, mit ellenőriztél, és a talált szöveghibákat.
