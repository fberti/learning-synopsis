/* =========================================================
   Mesterséges intelligencia 2. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 2.1 */
    "ai2-21": {
      title: "Kvíz – 2.1 Vektorok, mátrixok, tenzorok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy kérdőívet 100 ember töltött ki, mindegyik 8 kérdésre válaszolt. Mi a szokásos adatmátrix alakja?",
          options: [R`$100\times8$`, R`$8\times100$`, R`$800\times1$`, R`$100\times100$`],
          answer: 0,
          hint: "Mi a sor, és mi az oszlop az adatmátrixban?",
          explain: R`Sor = minta (ember), oszlop = jellemző (kérdés): $100\times8$. A $8\times100$ ennek a transzponáltja; a 800 az elemszám, nem az alak.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány számból áll egy $64\times64$-es színes (RGB) kép?`,
          options: ["12 288", "4 096", "192", "131"],
          answer: 0,
          hint: "Az elemszám az alakban szereplő számok szorzata. Hány szám tartozik egy képponthoz?",
          explain: R`$64\cdot64\cdot3 = 12\,288$. A 4096 a csatornák elfelejtése (szürkeárnyalatos kép lenne), a 192 = $64\cdot3$ és a 131 = $64 + 64 + 3$ szorzás helyett mást számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $X = \begin{pmatrix} 60 & 2 & 3 \\ 45 & 1 & 1 \\ 90 & 3 & 5 \end{pmatrix}$ mátrixban mennyi $x_{23}$?`,
          options: ["1", "3", "45", "5"],
          answer: 0,
          hint: "Az első index a sor, a második az oszlop.",
          explain: R`$x_{23}$: 2. sor, 3. oszlop → 1. A 3 az $x_{32}$ (sor és oszlop felcserélve), a 45 az $x_{21}$, az 5 az $x_{33}$.`
        },
        {
          type: "match",
          q: "Párosítsd a példákat a tenzor rendjével!",
          pairs: [
            ["egy lakás ára", "skalár (0)"],
            ["egy lakás jellemzői", "vektor (1)"],
            ["egy szürkeárnyalatos kép", "mátrix (2)"],
            ["egy színes kép", "3-tenzor"],
            ["32 színes kép egy kötegben", "4-tenzor"]
          ],
          hint: "Hány index kell egy elem megcímzéséhez?",
          explain: "Ár: egy szám. Jellemzők: egy index. Szürke kép: sor és oszlop. Színes kép: sor, oszlop, csatorna. Köteg: plusz a kép sorszáma."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "Az adatmátrixban minden sor egy minta.",
            "A színes kép 3 rendű tenzor (magasság × szélesség × csatorna).",
            "A PyTorch a (köteg, C, H, W), a TensorFlow jellemzően a (köteg, H, W, C) tengelysorrendet használja.",
            "A vektor elemeinek sorrendje mintánként tetszőleges lehet.",
            "Egy színt (piros, zöld, kék) érdemes egyetlen 1, 2, 3 sorszámmal kódolni."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a buktatókra: mi történik, ha a sorrend vagy a kódolás hamis információt visz a modellbe?",
          explain: "Az első három igaz. A jellemzők sorrendjének minden mintánál azonosnak kell lennie, különben a modell mást „lát”. A sorszámos színkódolás hamis sorrendet sugall – erre a one-hot kódolás a megoldás (4. fejezet)."
        }
      ]
    },

    /* ------------------------------------------------ 2.2 */
    "ai2-22": {
      title: "Kvíz – 2.2 Műveletek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $(2, 0, -1)\cdot(3, 5, 4)$?`,
          options: ["2", "(6; 0; −4)", "10", "13"],
          answer: 0,
          hint: "Párosával szorozz, aztán add össze! Az eredmény szám vagy vektor?",
          explain: R`$6 + 0 - 4 = 2$. A $(6; 0; -4)$ az elemenkénti szorzat (nem összegeztük); a 10 előjelhiba ($6 + 4$); a 13 az összes elem összege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\begin{pmatrix} 1 & 2 \\ 0 & -1 \\ 3 & 1 \end{pmatrix}\begin{pmatrix} 2 \\ 1 \end{pmatrix}$?`,
          options: [R`$(4;\ -1;\ 7)$`, R`$(8;\ 2)$`, R`$(4;\ -1)$`, "nem értelmezett"],
          answer: 0,
          hint: "Az eredmény minden eleme egy sor és a vektor skaláris szorzata. Hány sora van a mátrixnak?",
          explain: R`$(3\times2)\cdot(2) \to (3)$: $(2 + 2,\ 0 - 1,\ 6 + 1) = (4, -1, 7)$. A $(8; 2)$ oszloponként szoroz (rossz irány), a $(4; -1)$ lehagyott egy sort.`
        },
        {
          type: "single", shuffle: true,
          q: R`$A$ alakja $4\times3$, $B$ alakja $3\times5$. Mi $AB$ alakja?`,
          options: [R`$4\times5$`, R`$3\times3$`, R`$4\times3$`, "nem értelmezett"],
          answer: 0,
          hint: "Méretszabály: a belső méretek egyeznek, a külsők maradnak.",
          explain: R`$(4\times3)(3\times5) \to 4\times5$. (A $BA$ viszont nem értelmezett, mert $5 \ne 4$.)`
        },
        {
          type: "single", shuffle: true,
          q: "Egy réteg 784 bemenetet 128 kimenetre képez (súlymátrix + eltolásvektor). Hány paramétere van?",
          options: ["100 480", "100 352", "912", "101 136"],
          answer: 0,
          hint: "Milyen alakú a súlymátrix, és hány elemű az eltolásvektor?",
          explain: R`$W$: $128\times784 = 100\,352$, plusz 128 eltolás: $100\,480$. A 100 352 az eltolás nélküli szám; a 912 = $784 + 128$ összeadás szorzás helyett; a 101 136 = $784\cdot129$, mintha bemenetenként lenne eltolás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy neuron: $\mathbf w = (0{,}2;\ -0{,}5;\ 1)$, $b = 0{,}1$, $\mathbf x = (1;\ 2;\ 0{,}5)$. Mennyi $z = \mathbf w\cdot\mathbf x + b$?`,
          options: ["−0,2", "−0,3", "1,8", "0,1"],
          answer: 0,
          hint: "Skaláris szorzat, aztán az eltolás. Figyelj az előjelekre!",
          explain: R`$0{,}2 - 1 + 0{,}5 + 0{,}1 = -0{,}2$. A $-0{,}3$-ból kimaradt az eltolás; az $1{,}8$ elvesztette a negatív súly előjelét; a $0{,}1$ csak az eltolás.`
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            R`Általában $AB \ne BA$.`,
            R`$(m\times n)(n\times k) \to (m\times k)$.`,
            "Broadcastingnál a vektort a mátrix minden sorához hozzáadjuk.",
            R`$AB$ a megfelelő elemek szorzata.`,
            "A skaláris szorzat eredménye vektor."
          ],
          answer: [0, 1, 2],
          hint: "Melyik művelet ad számot, melyik vektort? És mi a különbség a mátrixszorzás és az elemenkénti szorzat között?",
          explain: R`Az első három igaz. Az elemenkénti szorzat a Hadamard-szorzat ($A\odot B$), nem a mátrixszorzás; a skaláris szorzat egyetlen szám.`
        }
      ]
    },

    /* ------------------------------------------------ 2.3 */
    "ai2-23": {
      title: "Kvíz – 2.3 Hossz, távolság, hasonlóság",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi az euklideszi és a Manhattan-távolság $(1, 2)$ és $(4, 6)$ között?`,
          options: ["5, illetve 7", "7, illetve 5", "25, illetve 7", "5, illetve 5"],
          answer: 0,
          hint: R`Előbb a különbségvektor, aztán a két norma: $\sqrt{\sum d_i^2}$ és $\sum|d_i|$.`,
          explain: R`Különbség $(3, 4)$: $\sqrt{9 + 16} = 5$ és $3 + 4 = 7$. A 25 a gyökvonás elfelejtése; a „7, illetve 5” felcseréli a kettőt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $(2, 1, 2)$ és $(1, 2, 2)$ koszinusz-hasonlósága?`,
          options: [R`$8/9 \approx 0{,}889$`, "8", R`$8/6 \approx 1{,}333$`, R`$1/3 \approx 0{,}333$`],
          answer: 0,
          hint: "Skaláris szorzat osztva a két hossz szorzatával. Mindkét vektor hossza 3.",
          explain: R`$\dfrac{2 + 2 + 4}{3\cdot3} = 8/9$. A 8 csak a skaláris szorzat; a $8/6$ a hosszak összegével osztott – és 1-nél nagyobb, ami koszinusz nem lehet.`
        },
        {
          type: "single", shuffle: true,
          q: "Új pont: (0, 0). Két régi: A = (3, 0) és B = (2, 2). Melyik a legközelebbi szomszéd?",
          options: [
            "Euklideszi távolsággal B, Manhattan-távolsággal A.",
            "Euklideszi távolsággal A, Manhattan-távolsággal B.",
            "Mindkét mértékkel A.",
            "Mindkét mértékkel B."
          ],
          answer: 0,
          hint: R`Számold ki: $\sqrt{9}$ és $\sqrt{8}$, illetve $3$ és $4$.`,
          explain: R`Euklideszi: A 3, B $\sqrt8 \approx 2{,}83$ → B. Manhattan: A 3, B 4 → A. A „legközelebbi” a mértéktől függ.`
        },
        {
          type: "single", shuffle: true,
          q: "Szövegeket hasonlítasz össze szószámokkal; a hosszuk nagyon különböző. Mit használj?",
          options: ["koszinusz-hasonlóságot", "euklideszi távolságot", "Manhattan-távolságot", "a szövegek hosszának különbségét"],
          answer: 0,
          hint: "Az számít, miről szól a szöveg, vagy az, hogy milyen hosszú?",
          explain: "A koszinusz-hasonlóság csak az irányt (a szavak arányát) nézi, a hosszt nem. A távolságok egy rövid és egy hosszú, de azonos témájú szöveget messzinek mondanának."
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "Ha a koszinusz-hasonlóság 0, a vektorok merőlegesek.",
            "A koszinusz-hasonlóság nem változik, ha az egyik vektort megháromszorozzuk.",
            R`Minden vektorra $\lVert\mathbf v\rVert_1 \ge \lVert\mathbf v\rVert_2$.`,
            "A koszinusz-hasonlóság távolság: a nagyobb érték a távolabbi pontot jelenti.",
            "A nullvektor koszinusz-hasonlósága bármivel 0."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a definícióra: mi van a nevezőben? És mit mér a nagyobb érték?",
          explain: R`Az első három igaz (az L1 sosem kisebb az L2-nél: pl. $(3, 4)$-re 7 ≥ 5). A koszinusz-hasonlóságnál a nagyobb a <em>hasonlóbb</em>; a nullvektorra pedig nincs értelmezve (0-val osztanánk).`
        },
        {
          type: "single", shuffle: true,
          q: "Miért kell skálázni a jellemzőket egy távolságalapú módszer (pl. kNN) előtt?",
          options: [
            "Mert különben a nagy mértékegységű jellemző (pl. m²) uralja a távolságot.",
            "Mert a távolság csak 0 és 1 közötti számokra értelmezett.",
            "Mert a skálázás a koszinusz-hasonlóságot is megváltoztatja.",
            "Mert skálázás nélkül a távolság negatív is lehet."
          ],
          answer: 0,
          hint: "Lakások: (60 m², 2 szoba) és (45 m², 1 szoba). Melyik eltérés számít többet a távolságban?",
          explain: R`A különbség $(15, 1)$, a távolság ≈ 15,03 – a szobaszám szinte el sem látszik. A távolság bármilyen számra értelmezett és sosem negatív.`
        }
      ]
    },

    /* ------------------------------------------------ 2.4 */
    "ai2-24": {
      title: "Kvíz – 2.4 Sajátvektorok, PCA ★★★",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mik a $\begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$ mátrix sajátvektorai és sajátértékei?`,
          options: [
            R`$(1, 1)$: $\lambda = 3$; $(1, -1)$: $\lambda = 1$`,
            R`$(1, 1)$: $\lambda = 1$; $(1, -1)$: $\lambda = 3$`,
            R`$(1, 0)$ és $(0, 1)$, mindkettő $\lambda = 2$`,
            R`$(2, 1)$: $\lambda = 3$; $(1, 2)$: $\lambda = 1$`
          ],
          answer: 0,
          hint: R`Próbáld ki szorzással: $A\mathbf v$ a $\mathbf v$ többszöröse?`,
          explain: R`$A(1, 1) = (3, 3) = 3(1, 1)$ és $A(1, -1) = (1, -1)$. A tengelyek nem sajátvektorok, mert $A(1, 0) = (2, 1)$ elfordult; a $(2, 1)$, $(1, 2)$ csak a mátrix oszlopai.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit jelent egy $2\times2$-es mátrix első oszlopa?`,
          options: [R`az $(1, 0)$ vektor képét`, R`a $(0, 1)$ vektor képét`, "az első sajátvektort", "a determinánst"],
          answer: 0,
          hint: R`Számold ki $A(1, 0)$-t: melyik elemek maradnak meg?`,
          explain: R`$A(1, 0)$-ban minden sorból csak az első elem marad: ez az első oszlop. A második oszlop a $(0, 1)$ képe.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kétdimenziós adat kovarianciamátrixának sajátértékei 6 és 2. Mekkora részt magyaráz az első főkomponens?",
          options: ["75%", "25%", "33%", "300%"],
          answer: 0,
          hint: "A sajátérték az adott irányba eső variancia. Mennyi az összes?",
          explain: R`$6/(6 + 2) = 75\%$. A 25% a második komponensé; a 33% = $2/6$ és a 300% = $6/2$ az egymáshoz viszonyít, nem az összeghez.`
        },
        {
          type: "single", shuffle: true,
          q: "A sajátértékek csökkenő sorrendben: 50, 30, 15, 3, 2 (a többi 0). Hány főkomponens kell a variancia legalább 95%-ához?",
          options: ["3", "2", "5", "95"],
          answer: 0,
          hint: "Halmozd az arányokat, amíg el nem éred a 95%-ot!",
          explain: "Összeg 100. Halmozva: 50%, 80%, 95% → 3 komponens. Kettővel csak 80%; öt az összes nem nulla; a 95 a százalékot keveri a darabszámmal."
        },
        {
          type: "multi",
          q: "Melyik igaz a PCA-ra?",
          options: [
            "Előtte a jellemzőket középre kell tolni.",
            "Az első főkomponens a legnagyobb sajátértékhez tartozó sajátvektor.",
            "Skálázás nélkül a nagy mértékegységű jellemző uralhatja az eredményt.",
            "Címkézett adat kell hozzá.",
            "A sajátvektor előjele egyértelmű, ezért minden program ugyanazt adja."
          ],
          answer: [0, 1, 2],
          hint: "Felügyelt vagy felügyelet nélküli módszer a PCA? És mi történik egy sajátvektorral, ha (−1)-gyel szorzod?",
          explain: "Az első három igaz. A PCA felügyelet nélküli (nem kell címke); a sajátvektor csak irány, a −v is sajátvektor, ezért a programok előjele eltérhet."
        }
      ]
    },

    /* ------------------------------------------------ 2.5 */
    "ai2-25": {
      title: "Kvíz – 2.5 Valószínűség, Bayes, softmax",
      questions: [
        {
          type: "single", shuffle: true,
          q: "100 levélből 30 spam; 18 spamben és 7 rendes levélben szerepel az „ingyen” szó. Mennyi P(spam | ingyen)?",
          options: ["0,72", "0,6", "0,18", "0,25"],
          answer: 0,
          hint: "A feltétel: az „ingyen” szót tartalmazó levelek. Hány ilyen van összesen?",
          explain: R`25 „ingyen”-es levélből 18 spam: $18/25 = 0{,}72$. A 0,6 = $18/30$ a fordított feltétel, P(ingyen | spam); a 0,18 az együttes valószínűség; a 0,25 = P(ingyen).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy betegség 1%-os gyakoriságú. A teszt a betegek 95%-ánál pozitív, az egészségesek 5%-ánál is. Mekkora a betegség valószínűsége pozitív teszt esetén?",
          options: ["≈ 0,16", "0,95", "0,0095", "0,05"],
          answer: 0,
          hint: "Bayes-tétel: a pozitív teszt két úton jöhet létre. Mennyi a téves riasztások aránya a 99% egészségesnél?",
          explain: R`$\dfrac{0{,}95\cdot0{,}01}{0{,}95\cdot0{,}01 + 0{,}05\cdot0{,}99} = \dfrac{0{,}0095}{0{,}059} \approx 0{,}16$. A 0,95 a feltétel megfordítása; a 0,0095 csak a számláló (együttes valószínűség).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\operatorname{softmax}(2, 1, 0)$ első eleme?`,
          options: ["≈ 0,665", "≈ 0,667", "≈ 0,731", "≈ 0,500"],
          answer: 0,
          hint: R`Előbb exponenciálj ($e^2$, $e^1$, $e^0$), aztán normálj!`,
          explain: R`$e^2/(e^2 + e + 1) \approx 7{,}389/11{,}107 \approx 0{,}665$. A 0,667 = $2/3$ az egyszerű osztás az összeggel (nem softmax); a 0,731 a kétosztályos $\operatorname{softmax}(1, 0)$.`
        },
        {
          type: "multi",
          q: "Melyik igaz a softmaxra?",
          options: [
            "A kimenetek összege 1.",
            "Ha minden pontszámhoz ugyanannyit adunk, a kimenet nem változik.",
            "Megőrzi a sorrendet: a legnagyobb pontszám kapja a legnagyobb valószínűséget.",
            "A negatív pontszámú osztály valószínűsége 0.",
            "Magasabb hőmérséklet élesebb (magabiztosabb) eloszlást ad."
          ],
          answer: [0, 1, 2],
          hint: R`Az $e^z$ mindig pozitív. És mit csinál a $z/T$ osztás, ha $T$ nagy?`,
          explain: R`Az első három igaz. $e^{z}$ negatív $z$-re is pozitív, így a valószínűség sem 0. Nagy $T$-nél a pontszámok közelednek egymáshoz, az eloszlás <em>laposabb</em> lesz.`
        },
        {
          type: "match",
          q: "Párosítsd a helyzeteket az eloszlásokkal!",
          pairs: [
            ["spam-e egy levél", "Bernoulli-eloszlás"],
            ["melyik szó jön következőnek", "kategoriális eloszlás"],
            ["egy felnőtt testmagassága", "normális eloszlás"]
          ],
          hint: "Hány kimenet van, és diszkrét vagy folytonos?",
          explain: "Két kimenet: Bernoulli. Sok (de véges számú) kategória: kategoriális. Folytonos, harang alakú: normális."
        },
        {
          type: "single", shuffle: true,
          q: "Egy játék: 0,5 valószínűséggel 0 pont, 0,3-mal 10 pont, 0,2-vel 50 pont. Mennyi a várható érték?",
          options: ["13", "20", "60", "17"],
          answer: 0,
          hint: "Szorozd minden kimenetet a valószínűségével, és add össze!",
          explain: R`$0 + 3 + 10 = 13$. A 20 a három érték egyszerű átlaga (a valószínűségeket figyelmen kívül hagyja); a 60 az értékek összege; a 17 = $0{,}2\cdot10 + 0{,}3\cdot50$ felcseréli a 10 és az 50 pont valószínűségét.`
        }
      ]
    },

    /* ------------------------------------------------ 2.6 */
    "ai2-26": {
      title: "Kvíz – 2.6 Információelmélet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi egy $1/8$ valószínűségű esemény információtartalma?`,
          options: ["3 bit", "8 bit", "0,125 bit", "0,375 bit"],
          answer: 0,
          hint: R`$I(p) = \log_2(1/p)$. Hány igen/nem kérdés kell 8 egyforma lehetőséghez?`,
          explain: R`$\log_2 8 = 3$ bit. A 8 a lehetőségek száma; a 0,125 maga a valószínűség; a 0,375 = $\tfrac18\cdot3$ az entrópia egy tagja, nem a meglepetés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $(0{,}5;\ 0{,}25;\ 0{,}25)$ eloszlás entrópiája?`,
          options: ["1,5 bit", "1 bit", "2 bit", "≈ 1,585 bit"],
          answer: 0,
          hint: R`$H = \sum p\log_2(1/p)$; a meglepetések: 1, 2 és 2 bit.`,
          explain: R`$0{,}5\cdot1 + 0{,}25\cdot2 + 0{,}25\cdot2 = 1{,}5$ bit. Az 1,585 = $\log_2 3$ az egyenletes eloszlásé – ez a maximum, és ez az eloszlás nem egyenletes.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy osztályozó a helyes osztálynak 0,9 valószínűséget ad. Mennyi a keresztentrópia-veszteség (natban)?",
          options: ["≈ 0,105", "0,1", "≈ 0,152", "0,9"],
          answer: 0,
          hint: "A veszteség a helyes válasz valószínűségének negatív logaritmusa – milyen alapú logaritmus a nat?",
          explain: R`$-\ln 0{,}9 \approx 0{,}105$ nat. A 0,1 = $1 - 0{,}9$ nem logaritmus; a 0,152 ugyanez bitben ($-\log_2 0{,}9$) – helyes érték, rossz egység.`
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            R`$H(p, q) \ge H(p)$ minden $q$-ra.`,
            R`One-hot címkénél a keresztentrópia $-\log q_{\text{helyes}}$.`,
            "Az entrópia egyenletes eloszlásnál maximális.",
            R`A KL-divergencia szimmetrikus: $D(p\|q) = D(q\|p)$.`,
            "A KL-divergencia lehet negatív."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj az érmés példára: 0,531 bit az egyik irányban, 0,737 a másikban.",
          explain: R`Az első három igaz. A KL-divergencia nem szimmetrikus (0,531 vs. 0,737 bit), és mindig $\ge 0$, mert $H(p, q) \ge H(p)$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy nyelvi modell átlagos keresztentrópiája tokenenként 3 bit. Mennyi a perplexitása?",
          options: ["8", "3", "9", "6"],
          answer: 0,
          hint: R`Bitben mért entrópiánál $\mathrm{PP} = 2^H$.`,
          explain: R`$2^3 = 8$: mintha 8 egyformán valószínű token közül választana. A 9 = $3^2$, a 6 = $2\cdot3$ – rossz művelet.`
        },
        {
          type: "single", shuffle: true,
          q: R`$-\ln 0{,}5 \approx 0{,}693$ nat. Hány bit ez?`,
          options: ["1 bit", "0,693 bit", "0,5 bit", "2 bit"],
          answer: 0,
          hint: R`$1 \text{ nat} \approx 1{,}443$ bit. Vagy: mennyi $-\log_2 0{,}5$?`,
          explain: R`$0{,}693\cdot1{,}443 \approx 1$ bit $= -\log_2 0{,}5$. A mennyiség ugyanaz, csak más egységben – ezért nem szabad keverni a kettőt.`
        }
      ]
    },

    /* ------------------------------------------------ 2.7 */
    "ai2-27": {
      title: "Kvíz – 2.7 Derivált, gradiens, láncszabály",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$L(w) = (w - 3)^2$. Mennyi $L'(1)$?`,
          options: ["−4", "4", "−2", "−6"],
          answer: 0,
          hint: R`$L'(w) = 2(w - 3)$. Figyelj az előjelre!`,
          explain: R`$2(1 - 3) = -4$: negatív, tehát $w$ növelésével csökken a veszteség. A $-2$ a 2-es szorzó elhagyása; a $-6$ az $L'(0)$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x, y) = x^2 + 3y^2$. Mennyi $\nabla f$ az $(1, 1)$ pontban?`,
          options: [R`$(2;\ 6)$`, R`$(2;\ 3)$`, R`$(1;\ 1)$`, "8"],
          answer: 0,
          hint: "Deriválj külön x, aztán külön y szerint, a másikat állandónak tekintve.",
          explain: R`$\nabla f = (2x, 6y) = (2, 6)$. A $(2; 3)$ elfelejti, hogy $3y^2$ deriváltja $6y$; a 8 a két elem összege – a gradiens vektor, nem szám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $(w^2 + 1)^3$ deriváltja a $w = 1$ pontban?`,
          options: ["24", "12", "8", "6"],
          answer: 0,
          hint: "Láncszabály: a külső derivált a belső értéknél, szorozva a belső deriválttal.",
          explain: R`$3(w^2 + 1)^2\cdot2w = 3\cdot4\cdot2 = 24$. A 12 a belső derivált ($2w$) elfelejtése; a 8 a függvényérték, nem a derivált.`
        },
        {
          type: "single", shuffle: true,
          q: "Merre csökken a leggyorsabban egy függvény egy adott pontban?",
          options: [
            "a negatív gradiens irányába",
            "a gradiens irányába",
            "a gradiensre merőlegesen",
            "mindig az origó felé"
          ],
          hint: "A gradiens a legmeredekebb emelkedés iránya.",
          answer: 0,
          explain: "A gradiens felfelé mutat, ezért a csökkenés iránya −∇f. A gradiensre merőlegesen (a szintvonal mentén) a függvény nem változik."
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "Parciális deriválásnál a többi változót állandónak tekintjük.",
            "A gradiens hossza a meredekség a legmeredekebb irányban.",
            "A láncszabály szerint a helyi deriváltak összeszorzódnak.",
            "A gradiens csak minimumban lehet nulla.",
            "A derivált azt is megmondja, hol van a legmélyebb minimum."
          ],
          answer: [0, 1, 2],
          hint: "Mi a helyzet maximumban és nyeregpontban? És mit lát a derivált – csak a közvetlen környezetet, vagy az egész függvényt?",
          explain: "Az első három igaz. A gradiens maximumban és nyeregpontban is nulla; a derivált pedig helyi információ, a távoli völgyekről nem tud."
        },
        {
          type: "single", shuffle: true,
          q: R`Modell: $\hat y = w x$, veszteség: $L = (\hat y - y)^2$. Adat: $x = 2$, $y = 4$, és $w = 1$. Mennyi $dL/dw$?`,
          options: ["−8", "−4", "8", "−2"],
          answer: 0,
          hint: R`$\dfrac{dL}{dw} = \dfrac{dL}{d\hat y}\cdot\dfrac{d\hat y}{dw}$, ahol $\dfrac{d\hat y}{dw} = x$.`,
          explain: R`$\hat y = 2$, $dL/d\hat y = 2(2 - 4) = -4$, és ezt szorozzuk $x = 2$-vel: $-8$. A $-4$ a belső derivált ($x$) elfelejtése; a 8 előjelhiba.`
        }
      ]
    },

    /* ------------------------------------------------ 2.8 */
    "ai2-28": {
      title: "Kvíz – 2.8 A gradiens módszer",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$L(w) = (w - 3)^2$, $w_0 = 0$, $\eta = 0{,}1$. Mennyi $w_1$?`,
          options: ["0,6", "−0,6", "6", "0,3"],
          answer: 0,
          hint: R`$w_1 = w_0 - \eta\,L'(w_0)$, és $L'(0) = -6$.`,
          explain: R`$0 - 0{,}1\cdot(-6) = 0{,}6$. A $-0{,}6$ a mínusz helyett plusszal lép (gradiens emelkedés); a 6 az $\eta = 1$ lépése; a 0,3 a 2-es szorzót hagyja el a deriváltból.`
        },
        {
          type: "match",
          q: R`$L = (w - 3)^2$, $w_0 = 0$. Párosítsd a tanulási rátát a viselkedéssel!`,
          pairs: [
            ["η = 0,01", "nagyon lassan közelít"],
            ["η = 0,5", "egy lépésben célba ér"],
            ["η = 0,75", "oszcillálva közelít"],
            ["η = 1", "örökké pattog 0 és 6 között"],
            ["η = 1,1", "szétszáll"]
          ],
          hint: R`Minden lépésben a 3-tól mért távolság $(1 - 2\eta)$-szorosára változik.`,
          explain: R`A szorzók: 0,98 (lassú); 0 (azonnal); −0,5 (előjelet vált, de csökken); −1 (pattog); −1,2 (nő, szétszáll).`
        },
        {
          type: "single", shuffle: true,
          q: R`$L(x, y) = x^2 + 10y^2$. Mekkora lehet legfeljebb a tanulási ráta, hogy a módszer ne szálljon szét?`,
          options: [R`$\eta \lt 0{,}1$`, R`$\eta \lt 1$`, R`$\eta \lt 0{,}05$`, R`$\eta \lt 10$`],
          answer: 0,
          hint: R`Az $y$ irányban a szorzó $1 - 20\eta$. Mikor kisebb 1-nél az abszolút értéke?`,
          explain: R`$|1 - 20\eta| \lt 1 \iff 0 \lt \eta \lt 0{,}1$. Az $\eta \lt 1$ az $x$ irány határa – de a meredekebb irány a szigorúbb. A 0,05 az egylépéses optimum az $y$ irányban, nem a határ.`
        },
        {
          type: "single", shuffle: true,
          q: "A veszteség tanítás közben: 2,3 → 2,1 → 2,6 → 4,8 → 19 → NaN. Mit tegyél először?",
          options: [
            "Csökkentsd a tanulási rátát.",
            "Növeld a tanulási rátát.",
            "Tanítsd tovább, majd lecseng.",
            "Cseréld a mínusz előjelet pluszra a frissítésben."
          ],
          answer: 0,
          hint: "Mi okozza, hogy a lépések egyre messzebb visznek a minimumtól?",
          explain: "A növekvő, majd NaN-ba futó veszteség a szétszállás jele: túl nagy a tanulási ráta. A plusz előjel gradiens emelkedés lenne – azzal biztosan nőne a veszteség."
        },
        {
          type: "multi",
          q: "Melyik igaz a (sima) gradiens módszerre?",
          options: [
            "Megállhat helyi minimumban vagy nyeregpontban is.",
            "A frissítésben mínusz előjel kell, mert a gradiens felfelé mutat.",
            "Minden paraméter ugyanazzal a tanulási rátával lép.",
            "Mindig a globális minimumot találja meg.",
            "Nagyobb tanulási ráta mindig gyorsabb tanulást jelent."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a „két völgy” függvényre és az η = 1,1-es kísérletre!",
          explain: "Az első három igaz. A „két völgy” függvénynél jobbról indulva a sekélyebb völgybe érünk; túl nagy rátánál pedig a módszer szétszáll, nem gyorsul."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai2-final": {
      title: "Fejezetzáró teszt – A gépi tanulás matematikai eszköztára",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány számból áll egy 32 darab $28\times28$-as szürkeárnyalatos képből álló köteg?`,
          options: ["25 088", "784", "896", "75 264"],
          answer: 0,
          hint: "Az alak: köteg × magasság × szélesség. Szorozni kell.",
          explain: R`$32\cdot28\cdot28 = 25\,088$. A 784 egyetlen kép; a 896 = $32\cdot28$ kihagy egy tengelyt; a 75 264 háromszoroz, mintha színes lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy köteg $X$ alakja $32\times784$, a súlymátrix $W$ alakja $128\times784$. Milyen alakú $XW^\top$?`,
          options: [R`$32\times128$`, R`$128\times32$`, R`$784\times784$`, "nem értelmezett"],
          answer: 0,
          hint: R`$W^\top$ alakja $784\times128$. Méretszabály!`,
          explain: R`$(32\times784)(784\times128) \to 32\times128$: minden mintára 128 kimenet. $W^\top$ nélkül ($XW$) valóban nem lenne értelmezett.`
        },
        {
          type: "single", shuffle: true,
          q: "Két dokumentum szószámai: (1, 2) és (10, 20). Mit mond a koszinusz-hasonlóság és az euklideszi távolság?",
          options: [
            "A koszinusz 1 (teljesen hasonló), a távolság nagy (≈ 20).",
            "A koszinusz 0, a távolság nagy.",
            "A koszinusz 1, a távolság 0.",
            "Mindkettő szerint nagyon különbözők."
          ],
          answer: 0,
          hint: "Egy irányba mutatnak a vektorok? És egybeesnek?",
          explain: R`A $(10, 20)$ a $(1, 2)$ tízszerese: a szögük 0, a koszinusz 1. A különbség $(9, 18)$, hossza ≈ 20,1. Ezért jó a koszinusz szövegekhez.`
        },
        {
          type: "single", shuffle: true,
          q: "Spamszűrő: P(spam) = 0,2; a „nyeremény” szó a spamek 50%-ában, a többi levél 5%-ában szerepel. Mennyi P(spam | nyeremény)?",
          options: ["≈ 0,714", "0,5", "0,1", "≈ 0,909"],
          answer: 0,
          hint: "Bayes-tétel – ne felejtsd el az a priori valószínűségeket!",
          explain: R`$\dfrac{0{,}5\cdot0{,}2}{0{,}5\cdot0{,}2 + 0{,}05\cdot0{,}8} = \dfrac{0{,}1}{0{,}14} \approx 0{,}714$. A 0,5 a fordított feltétel; a 0,1 csak a számláló; a 0,909 = $0{,}5/(0{,}5 + 0{,}05)$ figyelmen kívül hagyja, hogy a spam csak 20%.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\operatorname{softmax}(\ln 3,\ 0)$ első eleme?`,
          options: ["0,75", "1", "0,5", "≈ 0,731"],
          answer: 0,
          hint: R`$e^{\ln 3} = 3$ és $e^0 = 1$.`,
          explain: R`$3/(3 + 1) = 0{,}75$. Az 1 az egyszerű normálás ($\ln3/(\ln3 + 0)$); a 0,731 a $\operatorname{softmax}(1, 0)$.`
        },
        {
          type: "single", shuffle: true,
          q: "Három mintán a helyes osztály valószínűsége 0,9, 0,5 és 0,2. Mennyi az átlagos keresztentrópia-veszteség (nat)?",
          options: ["≈ 0,802", "≈ 0,533", "≈ 0,467", "≈ 2,408"],
          answer: 0,
          hint: R`Mintánként $-\ln q$, aztán átlag.`,
          explain: R`$(0{,}105 + 0{,}693 + 1{,}609)/3 \approx 0{,}802$. A 0,533 a valószínűségek átlaga, a 0,467 az $1 -$ átlag – egyik sem logaritmus; a 2,408 az összeg, átlagolás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`$L(x, y) = x^2 + 3y^2$, indulás $(2, 1)$, $\eta = 0{,}1$. Hová visz egy gradienslépés?`,
          options: [R`$(1{,}6;\ 0{,}4)$`, R`$(2{,}4;\ 1{,}6)$`, R`$(1{,}6;\ 0{,}7)$`, R`$(0{,}4;\ 0{,}6)$`],
          answer: 0,
          hint: R`$\nabla L = (2x, 6y) = (4, 6)$; az új pont $(2, 1) - 0{,}1\,\nabla L$.`,
          explain: R`$(2 - 0{,}4;\ 1 - 0{,}6) = (1{,}6;\ 0{,}4)$. A $(2{,}4;\ 1{,}6)$ felfelé lép (plusz előjel); a $(1{,}6;\ 0{,}7)$-nél $3y^2$ deriváltja hibásan $3y$; a $(0{,}4;\ 0{,}6)$ maga a lépés ($\eta\nabla L$), nem az új pont.`
        },
        {
          type: "match",
          q: "Párosítsd az eszközt a felhasználásával!",
          pairs: [
            ["softmax", "pontszámokból valószínűségi eloszlás"],
            ["keresztentrópia", "az osztályozó vesztesége"],
            ["koszinusz-hasonlóság", "jelentés szerinti (szemantikus) keresés"],
            ["láncszabály", "visszaterjesztés a neurális hálóban"],
            ["PCA", "dimenziócsökkentés"]
          ],
          hint: "Melyik ad eloszlást, melyik méri a hibát, melyik a hasonlóságot, melyik deriválja az összetett függvényt?",
          explain: "A softmax eloszlást ad, a keresztentrópia méri a hibát, a koszinusz a hasonlóságot (RAG), a láncszabály deriválja a hosszú lánccá fűzött rétegeket, a PCA a fő irányokat keresi."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik eloszlásnak a legnagyobb az entrópiája?",
          options: [
            "(0,25; 0,25; 0,25; 0,25)",
            "(0,5; 0,25; 0,125; 0,125)",
            "(0,7; 0,1; 0,1; 0,1)",
            "(1; 0; 0; 0)"
          ],
          answer: 0,
          hint: "Mikor a legbizonytalanabb a kimenet?",
          explain: R`Az egyenletesé: $\log_2 4 = 2$ bit. A második 1,75 bit, a harmadik kevesebb, a biztos eloszlásé 0.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy tanítatlan, 10 osztályos osztályozó minden osztálynak 0,1-et ad. Mennyi a vesztesége, és mire jó ez a szám?",
          options: [
            "≈ 2,303 nat – ez a találgatás szintje, a tanításnak ez alá kell vinnie.",
            "0,1 – ez a hibaarány.",
            "0 – még nem tanult, ezért nincs vesztesége.",
            "≈ 0,9 – a hibás osztályok összvalószínűsége."
          ],
          answer: 0,
          hint: R`Keresztentrópia: $-\ln q_{\text{helyes}}$.`,
          explain: R`$-\ln 0{,}1 = \ln 10 \approx 2{,}303$ nat (perplexitás: 10). Ha a tanítás elején ennél sokkal nagyobb a veszteség, valami hibás; tanulás közben ez alá kell csökkennie.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
