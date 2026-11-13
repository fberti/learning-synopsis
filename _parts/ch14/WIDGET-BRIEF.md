# 14. fejezet (Generatív modellek) – közös widget-útmutató (minden widget-ágensnek)

Fejezetmappa: `mesterseges-intelligencia/14-generativ-modellek/` (a synopsis gyökeréből). Adatfájl már van: `gen-data.js` →
`window.GEN14` (generálta `_parts/calc/c14_export.py`; olvasd el a szkriptet, ha a mezők jelentése kell). Mezők:
- `ar`: `{W: [64 sor; az i-edik sor i hosszú: a 0..i−1 pixelek súlyai], b: [64], test: [20 db 0/1 kép, 64 elem], testLabel, nll: {uniform: 64, indep: 36.33, ar: 25.88}}`
  – logisztikus autoregresszív modell fekete-fehér 8×8-as számjegyekre, soronkénti (raszter) sorrend: p(x_i = 1 | x_<i) = σ(Σ_{j<i} W[i][j]·x_j + b[i]).
- `ae`: `{orig: [10 tesztkép, 0–16 egész], label: [0..9], ks: [1,2,4,8,16,32], ae: {k: [10 rekonstrukció]}, pca: {k: [...]}, mseAE: {k: szám}, msePCA: {k: szám}}`
  (a mse a 450 tesztképen mért pixelenkénti átlagos négyzetes hiba 0–1 skálán).
- `latent`: `{label: [500], ae: {dec: [rétegek], z: [500×2], test: [10×2]}, vae: {dec, z: [500×2] (μ), sigma: [500×2], test: [10×2]}, testOrig: [10 kép]}`
  – a `dec` rétegek `{W: [ki][be], b: [ki]}`, rejtett rétegen ReLU, kimeneten szigmoid → ×16 = 0–16 skála. Használd a w0 `mlpForward(dec, z)`-jét.
- `ganEpochs`: `{"1": [16 kép], "5", "20", "50", "100", "200", "400", "600"}` – egy MLP-GAN ugyanazon 16 zajvektorból rajzolt képei az adott epoch után.
- `ddpm`: `{t: [999,900,…,0] (13 db), x: [13][8][64] (a zajos x_t, −3…3 közé vágva; a kép skálája −1 = fehér, +1 = tinta), x0: [13][8][64] (a háló tippje a tiszta képre, 0–16), final: [8 kép 0–16], abar: [13]}`
  – egy 1000 lépéses DDPM (lineáris β 1e−4 → 0,02) mintavételének pillanatképei 8 mintára.
- `compare`: 7 elem: `{name, binary, fid, conf, sure, hist[10], nnMed, copies, prec, rec, samples[40 kép], nn[40 kép: a legközelebbi tanítókép], nnDist[40]}`
  – nevek: „valódi (teszt)”, „másoló”, „Gauss”, „autoregresszív” (binary: true – fekete-fehér képek, a mérőszámok fekete-fehér referenciához mérve), „VAE”, „GAN”, „diffúzió”.

A végleges `widgets.js` így áll össze: `_parts/ch14/w0.js` (közös segédek, NE módosítsd) + `w1.js` + `w2.js` + `w3.js` + `w9.js` (indítás).
A te fájlod (`_parts/ch14/wN.js`) csak `W["név"] = root => { … };` definíciókat és saját, `wN`-előtagú segédeket tartalmazhat
(pl. `const w2Hist = …`), hogy ne ütközzön a többiekével. A w0.js-ben elérhető: `css, fmt (Calc.fmt, magyar tizedesvessző), pct, h, btn,
slider, checkbox, math, small, setDis, header, twoCanvas, evXY, polyline, dot, ring, label, arrow, toggleGroup, rgba, hexRGB, flatAspect,
clamp, par, eqView, softmax, argmax, dotp, norm, cosine, mix(colVar, t), ink(t), rng(seed), gauss(rnd), sigm, drawDigit(ctx, x, y, size, v, opts),
mlpForward(layers, x, out), DIGIT_COLORS, W`. Olvasd el a `_parts/ch14/w0.js`-t, és nézz meg 1–2 widgetet a
`mesterseges-intelligencia/13-graf-neuralis-halok/widgets.js`-ből stílusmintának (header(), .controls, .readout, .stat-row, Calc.canvas(parent, aspect, maxW),
Calc.plot(cv, view, layers)). Az `assets/calc.js` elején le van írva a Calc API.

Követelmények:
- Magyar felület, tegező, rövid. Számok magyar formátumban: `fmt(x, d)` (tizedesvessző). A widget címe (header) rövid főnévi kifejezés.
- Színek csak CSS-változókból: --accent, --setA (kék), --setB (narancs), --setC (zöld), --bad, --muted, --text, --card, --border, --bg-soft,
  --accent-soft (a számjegy-osztályokhoz a w0 `DIGIT_COLORS`-a használható). Világos és sötét téma is legyen olvasható
  (`document.documentElement.setAttribute('data-theme','dark')`). A színeket ne hívd „piros/kék”-nek a szövegben – a színekre a szerepükkel hivatkozz
  („valódi”, „generált”), vagy legyen jelmagyarázat.
- Reszponzív: 380 px széles mobilnézetben is használható, vízszintes görgetés nélkül (széles táblázat: `<div class="tw" style="overflow-x:auto">`).
  Érintéssel is működjön a kattintás/húzás (pointer események).
- Animáció: `requestAnimationFrame`, és álljon le, ha a widget nem látszik (IntersectionObserver), vagy a „Szünet” gombra.
- Ne használj külső könyvtárat. KaTeX a widgetben: a `math(root)` hívás a w9-ben megtörténik betöltéskor; ha később írsz be $…$-t, hívd meg `math(elem)`-et.
- Determinisztikus véletlen: a w0 `rng(seed)`-je; ugyanaz a gomb ugyanazzal a maggal mindig ugyanazt adja (legyen „Új mag” gomb, ha értelmes).
- Teszt: készíts saját tesztoldalt `_parts/ch14/wtestN.html` (a `_parts/ch13/wtest1.html` mintájára: style.css, KaTeX, common.js, calc.js,
  `../../mesterseges-intelligencia/14-generativ-modellek/gen-data.js`, és `wtestN-widgets.js` = `cat w0.js wN.js w9.js`).
  Indíts helyi szervert a synopsis gyökérben (`python3 -m http.server <szabad port, pl. 88N1>`), és ellenőrizd headless Playwrighttal
  (`uv run --with playwright python -I script.py`; ha kell: `uv run --with playwright python -m playwright install chromium`): nincs konzolhiba,
  a widgetek kirajzolnak, az interakciók működnek (kattints, húzz, válts). Képernyőképek világos és sötét témában, 1280 és 380 px szélességben:
  `_parts/ch14/shotsN/`. Nézd is meg a képeket (Read tool), és javíts, ha valami csúnya, kilóg vagy olvashatatlan.
- Munkát csak a `_parts/ch14/` mappában végezz (a saját tesztszkriptjeid a `_parts/calc/`-ban, `w14N_` előtaggal). /tmp-t ne használj.
  A szervert a végén állítsd le (a saját PID-jével; `pkill -f` mintával ne, mert a saját shelledet is megölheti).
- A végén röviden jelentsd: mely widgetek készültek, mit ellenőriztél, milyen számokat mutat a widget alapbeállításban (ezeket a szövegbe átveszem), ismert korlátok.

## A fejezet futó példája (2 × 2-es világ)
A képek 2 × 2 pixelesek, a pixelek sorrendje: bal fent, jobb fent, bal lent, jobb lent; egy kép egy négyjegyű kód (pl. `1100` = a felső sor fekete).
Tíz gyerekrajz: `1100` ×3 (felső csík), `0011` ×2 (alsó csík), `1010` ×2 (bal csík), `0101` ×2 (jobb csík), `1001` ×1 (átló). Tehát
p(1100) = 0,3; p(0011) = p(1010) = p(0101) = 0,2; p(1001) = 0,1; a többi 11 kép 0.
- független pixelek: p1 = 0,6, p2 = 0,5, p3 = 0,4, p4 = 0,5 (fekete valószínűsége) → NLL a 10 rajzon 3,94 bit; mind a 16 kép rajzolható.
- Markov (minden pixel csak az előzőtől függ, soronkénti sorrendben): p(x1=1) = 0,6; p(x2=1|x1) = 0,5; p(x3=1|x2=1) = 0, p(x3=1|x2=0) = 0,8; p(x4=1|x3) = 0,5
  → NLL 3,33 bit, 12 kép rajzolható (pl. p(1011) = 0,12, p(1100) = 0,15, p(1101) = 0,15).
- táblázat (empirikus): NLL 2,25 bit (= az entrópia), 5 kép rajzolható.
- Laplace-simított táblázat (minden darabszám + 1, nevező 26): NLL a 10 rajzon 3,05 bit; p(0110) = 1/26.
- egyenletes: 4 bit.

## Szakaszhorgonyok
14.1 #s141 (a: diszkriminatív vs. generatív, b: eloszlás számlálással és mintavétel, c: NLL bitekben) · 14.2 #s142 (a: láncszabály, b: egyszerűsített
feltételek, c: mintavétel, hőmérséklet, kiegészítés) · 14.3 #s143 (a: szűk keresztmetszet, b: mély és zajszűrő AE, c: látens tér) · 14.4 #s144
(a: reparaméterezés, b: rekonstrukció + KL, c: mintavétel és homály) · 14.5 #s145 (a: hamisító és detektív, b: a tanítás, c: instabilitás,
módusösszeomlás) · 14.6 #s146 (a: zajosítás, b: a zajtalanító, c: mintavétel visszafelé) · 14.7 #s147 (a: feltétel, b: osztályozómentes
irányítás, c: látens diffúzió) · 14.8 #s148 (a: mérőszámok, b: memorizálás, c: deepfake) · 14.9 #s149 (a: minták és mérés, b: másol-e, c: válaszok).

---

## A widgetek (ágensenként)

### 1. ágens → `w1.js`
1. **`sample-machine`** (14.1-b, 14.2-b) – „Rajzológép a 2 × 2-es világban”. Modellválasztó: táblázat / független pixelek / Markov / Laplace-simított.
   Oszlopdiagram mind a 16 kép valószínűségéről (az oszlop alatt a kis 2 × 2-es ikon, a 10 rajzban szereplők kiemelve); táblázat-modellnél a
   [0; 1) szakasz felosztása (halmozott valószínűség) egy csíkon. Gombok: „1 minta” (mutatja a húzott u-t, a szakaszt / pixelenkénti pénzfeldobást
   és a kapott képet), „100 minta”, „1000 minta” (a tapasztalt gyakoriság a valószínűség mellett, más színnel), „Törlés”, „Új mag”. Kiírás: a modell NLL-je
   a 10 rajzon (bit), a paraméterszám (15 / 4 / 7 / 15), hány képet rajzolhat a 16-ból, és a mintákban hány „új” (a 10 rajzban nem szereplő) kép volt.
2. **`pixel-ar`** (14.2-c) – „Pixelenként rajzoló gép”. Nagy 8 × 8-as rács. „Rajzolj!” gomb: animálva, pixelenként húz a `GEN14.ar` modellből;
   az épp számolt pixel kiemelve, mellette a p(fekete) értéke; a következő pixelek még üresek. Hőmérséklet-csúszka T ∈ [0,25; 2] (p = σ(z/T)), sebesség.
   „Kiegészítés” mód: válassz tesztképet (`GEN14.ar.test`, címkével), csúszkával add meg, hány sor maradjon meg felülről (0–8), a többit a modell rajzolja;
   egyszerre 6 kiegészítés egymás mellett (különböző magokkal) + az eredeti. A felhasználó a megtartott részben kattintással át is billentheti a pixeleket.
   Kiírás: a megrajzolt kép meglepetése a modellben (bit, a láncszabály szerint) és a tinta aránya. A tesztkép valódi folytatását is mutasd összevetésnek.
3. **`ae-bottleneck`** (14.3-b) – „Szűk keresztmetszet”. Válassz tesztszámjegyet (0–9, kis ikonokkal). Két sor: mély autoenkóder és PCA rekonstrukciói
   k = 1, 2, 4, 8, 16, 32 kóddal (`GEN14.ae`), alattuk az adott kép hibája (pixelenkénti átlagos négyzetes hiba 0–1 skálán, 3 tizedes) és egy kis táblázat a 450
   tesztkép átlagos hibájáról (`mseAE`, `msePCA`). Egy k-csúszka kiemeli az oszlopot, és nagyban mutatja az eredetit és a két rekonstrukciót.
4. **`kl-explorer`** (14.4-b) – „Mennyibe kerül a felhő?”. Csúszkák: μ ∈ [−3; 3], σ ∈ [0,05; 3]. Rajz: a standard normális sűrűség (prior, szaggatott)
   és N(μ, σ²) sűrűsége (kitöltve); kiírás: KL = ½(μ² + σ² − 1 − ln σ²) = (μ²/2) + ½(σ² − 1 − ln σ²) – a két tag külön is, színnel jelölve
   („hely” és „szélesség”). Előre beállítható példák gombbal: (0; 1) → 0; (1; 0,5) → 0,82; (2; 0,5) → 2,32; (0; 0,1) → 1,81; (0; 2) → 0,81.
   Kiegészítésül egy második rajz: a 2 × 2-es világ 1D-s VAE-je (a felső csík felhője μ = 1, σ, az alsóé μ = −1, ugyanaz a σ): a két normális görbe és alatta,
   hogy a z tengely egyes pontjaiból mit rajzol a dekódoló d(z) = 0,5 + z·(0,5; 0,5; −0,5; −0,5), 0–1-re vágva (kis 2 × 2-es ikonok a tengely mentén:
   z = −2, −1, −0,5, 0, 0,5, 1, 2). A σ-csúszka mindkét felhőre hat; kiírás: a két felhő átfedése (a közös terület, numerikusan).

### 2. ágens → `w2.js`
5. **`latent-map`** (14.3-c, 14.4-c) – „A látens tér térképe”. Kapcsoló: autoenkóder / VAE. Bal: a 500 tanítókép kódja pontként (`GEN14.latent.*.z`), a címke színével
   (`DIGIT_COLORS`, jelmagyarázat 0–9), VAE-nél a standard normális 1σ és 2σ köre szaggatottan; a nézet mindkét módban magától illeszkedik a pontokra,
   és AE-módban is rajzold be (halványan) az origó körüli egységkört, hogy látsszon: az AE kódjai nem ott vannak. Egy húzható célkereszt: a jobb oldalon a
   dekódolt kép nagyban (`mlpForward(dec, z) × 16`). Gomb: „Véletlen kód 𝒩(0, I)-ből” (a célkereszt odaugrik, és egy 4 × 4-es rács mutat 16 ilyen dekódolást).
   Interpoláció: két tesztszámjegy választása (0–9, `testOrig` + `test` kódok), 7 lépéses sor a kódok között dekódolva, alatta összehasonlításul
   a két kép pixelátlagos keverése (ugyanannyi lépésben) – felirat: „keverés a kódban” / „keverés a pixelekben”.
6. **`gan-1d`** (14.5-b/c) – „Hamisító és detektív egy egyenesen”. Élőben tanuló 1D GAN, saját kis JS-sel (nincs ml.js): G: z ~ N(0,1) → MLP 1 → 16 → 16 → 1
   (LeakyReLU 0,2 vagy tanh; a kimenet lineáris), D: 1 → 16 → 16 → 1 (szigmoid). Kézzel írt visszaterjesztés (D gradiense a bemenetére is kell a G tanításához),
   Adam (β1 = 0,5), batch 64. Valódi adat választható: „egy csúcs” N(2; 0,5²), „két csúcs” ½N(−2; 0,4²) + ½N(2; 0,4²), „három csúcs”.
   Kapcsoló: generátorveszteség „nem telítődő” (−ln D(G(z))) / „minimax” (ln(1 − D(G(z)))). Csúszkák: tanulási ráta, D lépései G lépésenként (1–5).
   Rajz: a valódi és a generált minták hisztogramja (két szín, jelmagyarázat), rajta a D(x) görbe (0–1, jobb tengely, 0,5-ös vonal szaggatva);
   alatta kis grafikon a két veszteségről az idő függvényében. Gombok: Indítás/Szünet, 1 lépés, Újrakezdés, Új mag. Kiírás: lépésszám, a generált minták
   átlaga és szórása, kétcsúcsú adatnál „a generált minták hány %-a van a bal / jobb csúcs közelében” (módusösszeomlás jele, ha az egyik ≈ 0%).
   Hangold úgy (alapértelmezett lr, seed), hogy egycsúcsú adaton megbízhatóan konvergáljon, kétcsúcsún pedig legyen olyan beállítás/mag, ahol a
   módusösszeomlás látható, és olyan is, ahol mindkét csúcsot megtalálja. Ezeket jelentsd. Minimax-veszteséggel az elején, ha D erős, a G alig tanul – ez is látsszon.
7. **`gan-epochs`** (14.5-c) – „Egy GAN tanulása a számjegyeken”. Csúszka az epochokon (`GEN14.ganEpochs` kulcsai), 4 × 4-es rács a 16 képről.
   Kiírás: „ugyanaz a 16 zajvektor, … epoch után”. Kicsi, egyszerű widget.
8. **`gen-compare`** (14.9-a/b) – „Hét forrás, egy füzet”. A `GEN14.compare` 7 forrása közül egy kiválasztva: 40 minta 5 × 8-as rácsban;
   kattints egy mintára → mellette a legközelebbi tanítókép és a távolság (`nnDist`), ha a távolság 0: „pontos másolat!”. Táblázat mind a 7 forrásról
   (sorok): FID (kisebb a jobb), „biztosan felismert” (`sure`, %), pontosság (`prec`), felidézés (`rec`), legközelebbi tanítókép medián távolsága (`nnMed`),
   másolatok száma (`copies`), és egy mini oszlopdiagram az osztályok eloszlásáról (`hist`, 10 oszlop). Az „autoregresszív” sor jelölve: „fekete-fehér képek –
   a mérőszámok fekete-fehér referenciához mérve, a többivel csak óvatosan vethető össze”. A kiválasztott sor kiemelve.
   Egy „Melyik az igazi?” játék-mód: 4 rács egymás mellett (valódi teszt + 3 véletlen modell, keverve), tippeld meg, melyik a valódi – katt után megmutatja.

### 3. ágens → `w3.js`
9. **`diffusion-2d`** (14.6-a/c, 14.8-b) – „Diffúzió a síkon”. Tanítóadat: 2D pontfelhő (60 pont) – választható alakzat: „spirál”, „két félhold”, „mosoly”;
   saját determinisztikus generálással a [−1; 1]² négyzetben. Zajütemezés: T = 50 lépés, koszinuszos: ᾱ_t = cos²(((t/T) + 0,008)/1,008 · π/2) / (ugyanez t = 0-ra),
   ᾱ_T ≈ 0. Két fül:
   (a) **Előre (zajosítás):** csúszka t ∈ [0; T]: minden tanítópont x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε (rögzített ε pontonként); kiírás: ᾱ_t, √ᾱ_t, √(1−ᾱ_t);
   a standard normális 1σ-köre szaggatva. Egy kijelölt pont útja vonallal.
   (b) **Visszafelé (mintavétel):** 300 pont N(0, I)-ből, lépésenként visszafelé (animálva), a **pontos (ideális) zajtalanítóval**: az adatot Gauss-keveréknek
   tekintjük (minden tanítópont egy h szórású kis Gauss), és a háló helyett a zárt képletet használjuk:
   w_i ∝ exp(−‖x_t − √ᾱ μ_i‖² / (2(ᾱh² + 1 − ᾱ))), m_i = μ_i + (h²√ᾱ / (ᾱh² + 1 − ᾱ))·(x_t − √ᾱ μ_i), x̂_0 = Σ w_i m_i,
   ε̂ = (x_t − √ᾱ x̂_0)/√(1 − ᾱ). Lépés (DDIM, determinisztikus): x_{t−1} = √ᾱ_{t−1}·x̂_0 + √(1 − ᾱ_{t−1})·ε̂. Kapcsoló: „DDPM” (sztochasztikus) is:
   σ_t² = (1−ᾱ_{t−1})/(1−ᾱ_t)·(1 − ᾱ_t/ᾱ_{t−1}), x_{t−1} = √ᾱ_{t−1} x̂_0 + √(1−ᾱ_{t−1}−σ_t²)·ε̂ + σ_t z. (Lépésszám-csúszka: 5 / 10 / 25 / 50 –
   kevesebb lépésnél egyenletesen ritkított t-k.) Csúszka: h („simítás”) ∈ [0; 0,2], alapértéke 0,05. A végén a minták a tanítópontokkal együtt;
   kiírás: a minták hány %-a esik 0,01-nél közelebb egy tanítóponthoz („másolat”), a legközelebbi tanítóponttól mért medián távolság.
   h = 0-nál (a véges halmaz pontos zajtalanítója) a minták szinte mind tanítópontok – ez a fejezet „tökéletes tanuló csal” rejtvénye; jelentsd a számokat
   h = 0; 0,02; 0,05; 0,1 mellett (50 lépés, DDIM, alap mag). Egy kiválasztott minta útja is látsszon (vonal), és a x̂_0 tippek (halvány pontok) kapcsolóval.
10. **`diffusion-digits`** (14.6-c) – „Egy diffúziós modell munka közben”. `GEN14.ddpm`: 8 sor (minták) × 13 oszlop (t = 999 … 0); kapcsoló: „x_t (amit a háló kap)” /
   „x̂_0 (a háló tippje a tiszta képre)”. x_t megjelenítése: (x+1)/2·16, 0–16-ra vágva. Fölötte csúszka egy tesztszámjegy zajosításához
   (`GEN14.latent.testOrig` vagy `GEN14.ae.orig` közül választható; ugyanaz a lineáris ütemezés T = 1000, β 1e−4 → 0,02, rögzített ε), kiírás: ᾱ_t, a jel/zaj arány.
11. **`cfg-2d`** (14.7-b) – „Irányítás erőssége”. Két (vagy három) osztály a síkon, mindegyik néhány Gauss keveréke, részben átfedve (pl. „A” a bal, „B” a jobb
   oldalon, középen átfedés). Ugyanaz a pontos zajtalanító-képlet, mint a 9-nél, de osztályonként: ε̂_c (csak a c osztály komponensei) és ε̂_u (mind).
   Irányított becslés: ε̃ = ε̂_u + s·(ε̂_c − ε̂_u). Csúszka s ∈ [0; 8] (jelölt értékek 0, 1, 3, 7,5), osztályválasztó, 300 minta DDIM-mel (25 lépés).
   Kiírás: a minták hány %-a esik a választott osztály „biztos” területére (ahol p(c | x) > 0,9 a tiszta adatra), és a minták szórása (sokféleség).
   s = 0: feltétel nélküli; s = 1: a feltételes eloszlás; s > 1: a minták a másik osztálytól távolodnak, a sokféleség csökken; nagy s-nél „túllő”. Jelentsd a számokat
   s = 0, 1, 3, 7,5 mellett.
