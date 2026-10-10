/* =========================================================
   Mesterséges intelligencia 9. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 9.1 */
    "ai9-91": {
      title: "Kvíz – 9.1 A mesterséges neuron",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy neuron bemenete $\mathbf x = (2;\ -1)$, súlyai $\mathbf w = (1;\ 3)$, torzítása $b = 0{,}5$. Mennyi a súlyozott összeg, $z$?`,
          options: ["−0,5", "5,5", "−1", "0,5"],
          answer: 0,
          hint: "Szorozd össze a bemeneteket a súlyukkal, add össze, és ne felejtsd el a torzítást!",
          explain: R`$z = 1\cdot 2 + 3\cdot(-1) + 0{,}5 = -0{,}5$. Az 5,5 a $-1$ előjelének elhagyásából jön, a $-1$ a torzítás kifelejtéséből, a 0,5 előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ReLU aktivációjú neuron súlyozott összege $z = -0{,}5$. Mi a kimenete?`,
          options: ["0", "−0,5", "0,3775", "0,5"],
          answer: 0,
          hint: R`$\mathrm{ReLU}(z) = \max(0, z)$.`,
          explain: R`$\max(0;\ -0{,}5) = 0$. A $-0{,}5$ a vágás nélküli érték, a 0,3775 a szigmoid kimenete ($\sigma(-0{,}5)$), a 0,5 az abszolút érték – a ReLU nem tükröz, hanem levág.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy lépcsős neuron súlyai $w_1 = w_2 = 1$. Mekkora legyen a torzítás, hogy a neuron az ÉS kaput valósítsa meg (0/1 bemenetekre)?`,
          options: ["−1,5", "−0,5", "1,5", "0"],
          answer: 0,
          hint: "A neuron akkor tüzel, ha x₁ + x₂ nagyobb a küszöbnél (−b). Mekkora küszöb kell, hogy csak az (1, 1) lépje át?",
          explain: R`$b = -1{,}5$: csak az (1, 1)-nél lesz $z = 0{,}5 \gt 0$. A $-0{,}5$ a VAGY kapu (egy bemenet is elég), az $1{,}5$ ezekkel a súlyokkal mindig tüzel (a NAND-hoz a súlyokat is negálni kellene), a 0-val a VAGY-hoz hasonlóan már egy bemenet is elég.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz egy (két bemenetű) mesterséges neuronra?",
          options: [
            R`A $\mathbf w$ súlyvektor merőleges a $z = 0$ határegyenesre.`,
            "A torzítás elforgatja a határegyenest.",
            "Ha az összes súlyt és a torzítást 10-zel szorozzuk, a lépcsős neuron döntései nem változnak.",
            "A mesterséges neuron ugyanúgy működik, mint egy idegsejt.",
            "Egy szigmoid aktivációjú neuron ugyanazt számolja, mint a logisztikus regresszió."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj a határegyenes egyenletére: mit változtat rajta a b, és mit a w-k közös szorzója?",
          explain: R`A határ a $\mathbf w^\top\mathbf x + b = 0$ egyenes, $\mathbf w$ a normálvektora; a $b$ eltolja, nem forgatja. Közös pozitív szorzóval az előjelek – és így a lépcsős döntések – nem változnak. A szigmoid neuron $\sigma(\mathbf w^\top\mathbf x + b)$ – ez a logisztikus regresszió. Az idegsejttel csak laza a hasonlóság.`
        },
        {
          type: "match",
          q: "Párosítsd a logikai kaput a lépcsős neuron súlyaival és torzításával!",
          pairs: [
            ["ÉS", "w = (1; 1), b = −1,5"],
            ["VAGY", "w = (1; 1), b = −0,5"],
            ["NEM-ÉS (NAND)", "w = (−1; −1), b = 1,5"],
            ["NEM x₁", "w = (−1; 0), b = 0,5"]
          ],
          hint: "Számold ki mindegyiknél a z-t a négy (illetve két) bemenetre, és nézd meg, mikor pozitív.",
          explain: "ÉS: csak (1, 1)-re z > 0. VAGY: elég egy 1-es. NAND: az ÉS tagadása – negált súlyok és torzítás. NEM x₁: x₁ = 0-ra z = 0,5 → 1, x₁ = 1-re z = −0,5 → 0."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy lépcsős neuron három 0/1 bemenetének súlya egyaránt 1, a torzítása $-1{,}5$. Mikor tüzel?`,
          options: ["ha legalább két bemenet 1", "ha mindhárom bemenet 1", "ha legalább egy bemenet 1", "ha pontosan két bemenet 1"],
          answer: 0,
          hint: R`A neuron akkor ad 1-et, ha $x_1 + x_2 + x_3 \gt 1{,}5$.`,
          explain: R`Az összeg 2 vagy 3 esetén nagyobb 1,5-nél: legalább két bemenet – többségi szavazás. „Pontosan kettő” nem jó, mert a 3 is átlépi a küszöböt; „mindhárom” a $b = -2{,}5$-é, „legalább egy” a $b = -0{,}5$-é.`
        }
      ]
    },

    /* ------------------------------------------------ 9.2 */
    "ai9-92": {
      title: "Kvíz – 9.2 A perceptron",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Perceptron: $\mathbf w = (1;\ 0)$, $b = -1$, $\eta = 1$. A minta $\mathbf x = (0;\ 1)$, $y = 1$. Mik a súlyok a lépés után?`,
          options: ["w = (1; 1), b = 0", "w = (1; −1), b = −2", "w = (1; 0), b = −1", "w = (0; 1), b = 0"],
          answer: 0,
          hint: R`Először a jóslat: $\hat y = 1$, ha $z \gt 0$. Ha hibás, $\mathbf w \leftarrow \mathbf w + \eta(y - \hat y)\mathbf x$.`,
          explain: R`$z = -1$ → $\hat y = 0$, hiba, $y - \hat y = 1$: $\mathbf w = (1;\ 0) + (0;\ 1) = (1;\ 1)$, $b = -1 + 1 = 0$. A $(1;\ -1)$, $-2$ az előjel felcserélése, a változatlan súly azt jelentené, hogy a jóslat jó volt, a $(0;\ 1)$ a régi súlyok lecserélése a bemenetre.`
        },
        {
          type: "single", shuffle: true,
          q: R`Perceptron: $\mathbf w = (1;\ 1)$, $b = 0$, $\eta = 1$. A minta $\mathbf x = (1;\ 1)$, $y = 1$. Mi történik?`,
          options: ["semmi: a jóslat jó, a súlyok nem változnak", "w = (2; 2), b = 1", "w = (0; 0), b = −1", "csak a torzítás nő 1-gyel"],
          answer: 0,
          hint: "A perceptron csak akkor módosít, ha téved.",
          explain: R`$z = 2 \gt 0$ → $\hat y = 1 = y$, tehát $y - \hat y = 0$, nincs frissítés. A $(2;\ 2)$, 1 akkor jönne ki, ha minden mintánál hozzáadnánk a bemenetet – a perceptron nem ezt csinálja.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a perceptron tanulására?",
          options: [
            "Lineárisan szétválasztható adaton véges sok javítás után hibátlan egyenest talál.",
            "Mindig a legnagyobb margójú elválasztó egyenest találja meg.",
            "Az eredmény függhet a minták sorrendjétől.",
            "A XOR-on is megáll, csak lassabban.",
            "Csupa nulla kezdősúlynál a tanulási ráta nem változtat a jóslatokon."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj a konvergenciatételre, az ÉS kétféle sorrendű tanítására és a XOR-ciklusra.",
          explain: "A tétel szétválasztható adatra véges megállást garantál, de bármelyik hibátlan egyenesnél megállhat (a max. margót az SVM keresi). Az ÉS-t kétféle sorrendben két különböző egyenes adja. A XOR-on soha nem áll meg. Nullás kezdésnél minden súly η-val arányos, így a jóslatok nem függnek tőle."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy szétválasztható adatkészletre $R = 3$ és $\gamma = 0{,}5$. Legfeljebb hány javítást tesz a perceptron a konvergenciatétel szerint?`,
          options: ["36", "6", "18", "12"],
          answer: 0,
          hint: R`A korlát $(R/\gamma)^2$.`,
          explain: R`$(3/0{,}5)^2 = 6^2 = 36$. A 6 a négyzetre emelés nélküli hányados, a 18 az $R^2/\gamma$, a 12 a $2R/\gamma$.`
        },
        {
          type: "single", shuffle: true,
          q: "A 16 kétbemenetű logikai függvény közül melyeket NEM tudja megtanulni egyetlen perceptron?",
          options: ["a XOR-t és a tagadását (XNOR)", "az ÉS-t és a VAGY-ot", "csak a XOR-t", "a NAND-ot és a NOR-t"],
          answer: 0,
          hint: "Melyik függvényeknél vannak az azonos kimenetű pontok átlósan szemben?",
          explain: "A XOR (0, 1, 1, 0) és az XNOR (1, 0, 0, 1) nem választható szét egy egyenessel; a többi 14 igen (pl. ÉS, VAGY, NAND, NOR). A „csak a XOR” kifelejti a tagadását: az ugyanannyira szétválaszthatatlan."
        },
        {
          type: "single", shuffle: true,
          q: "Mit mutatott ki Minsky és Papert 1969-es Perceptrons című könyve?",
          options: [
            "hogy az egyrétegű perceptron bizonyos egyszerű feladatokat (pl. XOR, paritás) nem tud megoldani",
            "hogy a többrétegű hálók elvben sem taníthatók",
            "hogy a lineáris aktiváció okozza a perceptron korlátait",
            "hogy a visszaterjesztéssel a rejtett rétegek is taníthatók"
          ],
          answer: 0,
          hint: "A könyv a rejtett réteg nélküli, lépcsős perceptron matematikai korlátairól szólt.",
          explain: "Az egyrétegű perceptron korlátait bizonyították. A többrétegű hálókról nem állították, hogy elvben taníthatatlanok – csak módszer nem volt rá. A perceptron nemlineáris lépcsőt használt (a „lineáris aktiváció” PDL tévedése). A visszaterjesztést 1986-ban Rumelhart, Hinton és Williams népszerűsítette."
        }
      ]
    },

    /* ------------------------------------------------ 9.3 */
    "ai9-93": {
      title: "Kvíz – 9.3 Rétegek: a többrétegű perceptron",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A XOR-hálóban $h_1$ = VAGY($x_1, x_2$), $h_2$ = ÉS($x_1, x_2$). Hová kerül a $(0;\ 1)$ bemenet a rejtett térben, a $(h_1, h_2)$ síkon?`,
          options: ["(1; 0)", "(0; 1)", "(1; 1)", "(0; 0)"],
          answer: 0,
          hint: "Számold ki külön a VAGY-ot és az ÉS-t a (0, 1) bemenetre.",
          explain: R`VAGY(0, 1) = 1, ÉS(0, 1) = 0, tehát $(1;\ 0)$ – ugyanoda, ahová az $(1;\ 0)$ bemenet is kerül. A $(0;\ 1)$ a bemenet maga (nem a rejtett kép), az $(1;\ 1)$ az $(1, 1)$ bemenet képe.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy réteg 64 bemenetet kap, és 16 neuronja van. Milyen alakú a $W$ súlymátrix a $\mathbf h = \varphi(W\mathbf x + \mathbf b)$ jelöléssel?`,
          options: ["16 × 64", "64 × 16", "16 × 16", "64 × 64"],
          answer: 0,
          hint: R`A $W\mathbf x$ szorzatban $\mathbf x$ 64 elemű oszlopvektor, az eredmény 16 elemű.`,
          explain: R`$(16 \times 64)\cdot(64 \times 1) = 16 \times 1$: soronként egy neuron 64 súlya. A $64 \times 16$ a scikit-learn tárolási alakja (a transzponált) – a $W\mathbf x$ jelöléssel nem szorozható.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két réteg aktiváció nélkül: $W_1 = \begin{pmatrix} 1 & 0 \\ 0 & 2 \end{pmatrix}$, $\mathbf b_1 = (1;\ 1)$, majd $y = h_1 + h_2$. Mit számol a háló?`,
          options: ["y = x₁ + 2x₂ + 2", "y = x₁ + 2x₂", "y = x₁ + 2x₂ + 1", "y = 2x₁ + x₂ + 2"],
          answer: 0,
          hint: "Helyettesítsd be a rejtett réteget a kimenetbe – a torzításokat is.",
          explain: R`$h_1 = x_1 + 1$, $h_2 = 2x_2 + 1$, $y = x_1 + 2x_2 + 2$ – egyetlen lineáris függvény. A torzítás nélküli változat kifelejti a $\mathbf b_1$-et, a „+ 1” csak az egyik torzítást számolja, a $2x_1 + x_2$ felcseréli a súlyokat.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a többrétegű perceptronra?",
          options: [
            "A bemeneti rétegnek nincs paramétere.",
            "Nemlineáris aktiváció nélkül a sok réteg is egyetlen lineáris függvény.",
            "A rejtett neuronok helyes kimenetét az adat megadja.",
            "Egy 2–2–1-es, lépcsős neuronokból álló háló meg tudja oldani a XOR-t.",
            "A XOR-hoz összesen két neuron (rejtett és kimeneti együtt) elég."
          ],
          answer: [0, 1, 3],
          hint: "Mi a „rejtett” szó jelentése? És hány neuron volt a XOR-hálóban összesen?",
          explain: "A bemeneti réteg csak továbbadja a számokat. Lineáris rétegek szorzata lineáris. A rejtett neuronokra nincs címke – innen a nevük. A XOR-háló 2 rejtett + 1 kimeneti = 3 neuron; „két perceptron” (MLD) nem elég."
        },
        {
          type: "single", shuffle: true,
          q: R`$W = \begin{pmatrix} 1 & -1 \\ 2 & 1 \end{pmatrix}$, $\mathbf b = (0;\ -8)$, $\mathbf x = (3;\ 1)$. Mennyi $\mathrm{ReLU}(W\mathbf x + \mathbf b)$?`,
          options: ["(2; 0)", "(2; −1)", "(2; 7)", "(5; 0)"],
          answer: 0,
          hint: "Soronként: a sor és x skaláris szorzata, plusz a torzítás, majd a ReLU.",
          explain: R`1. sor: $3 - 1 + 0 = 2$; 2. sor: $6 + 1 - 8 = -1$ → ReLU: $(2;\ 0)$. A $(2;\ -1)$ a ReLU kihagyása, a $(2;\ 7)$ a torzítás kifelejtése, az $(5;\ 0)$ a $W^\top\mathbf x$ (oszlopok szerint szorozva).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy köteg $X$ mátrixa $32 \times 784$-es (soronként egy kép), a réteg $W$-je $128 \times 784$-es. Milyen alakú a $XW^\top$?`,
          options: ["32 × 128", "128 × 32", "784 × 784", "nem szorozható össze"],
          answer: 0,
          hint: "Írd fel a két tényező alakját, és nézd meg a belső méreteket.",
          explain: R`$(32 \times 784)(784 \times 128) = 32 \times 128$: minden képhez 128 rejtett érték. $128 \times 32$ a $WX^\top$ alakja lenne; a $XW^\top$ szorzat érvényes.`
        }
      ]
    },

    /* ------------------------------------------------ 9.4 */
    "ai9-94": {
      title: "Kvíz – 9.4 Aktivációs függvények",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi a szigmoid deriváltja a 0-ban, $\sigma'(0)$?`,
          options: ["0,25", "0,5", "1", "0"],
          answer: 0,
          hint: R`$\sigma' = \sigma(1 - \sigma)$, és $\sigma(0) = 0{,}5$.`,
          explain: R`$0{,}5 \cdot 0{,}5 = 0{,}25$ – ez a szigmoid legnagyobb meredeksége. A 0,5 maga a $\sigma(0)$, az 1 a tanh deriváltja a 0-ban, a 0 a lépcsőé.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy tíz rétegű láncban minden rétegben egy szigmoid neuron van, a súlyok 1-esek. Legfeljebb mekkora a deriváltak szorzata (a kimenet érzékenysége a bemenetre)?",
          options: ["kb. 10⁻⁶ (0,25¹⁰)", "2,5 (10 · 0,25)", "0,25", "kb. 0,056 (0,75¹⁰)"],
          answer: 0,
          hint: "A láncszabály szerint a rétegenkénti deriváltak összeszorzódnak; a szigmoid deriváltja legfeljebb 0,25.",
          explain: R`$0{,}25^{10} \approx 9{,}5\cdot 10^{-7}$ – az eltűnő gradiens. A 2,5 összeadja a tényezőket szorzás helyett, a 0,25 egyetlen rétegé, a 0,75 nem a szigmoid deriváltjának korlátja.`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a kimeneti réteggel!",
          pairs: [
            ["egy lakás ára", "1 neuron, aktiváció nélkül"],
            ["spam-e a levél", "1 szigmoid neuron"],
            ["melyik számjegy (0–9)", "10 neuron softmaxszal"],
            ["mely címkék illenek egy fotóra", "annyi szigmoid neuron, ahány címke"]
          ],
          hint: "Tetszőleges szám, egy valószínűség, egy eloszlás kizáró osztályokon – vagy több, egymástól független igen/nem?",
          explain: "Regresszió: identitás. Két osztály: egy szigmoid. Kizáró osztályok: softmax (összeg 1). Több címke: független szigmoidok – a valószínűségek összege 1-nél több is lehet."
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a softmax harmadik eleme a $\mathbf z = (0;\ 0;\ \ln 2)$ vektorra?`,
          options: ["0,5", "0,333", "0,25", "0,693"],
          answer: 0,
          hint: R`$e^0 = 1$ és $e^{\ln 2} = 2$.`,
          explain: R`$e^{z} = (1;\ 1;\ 2)$, összeg 4: $2/4 = 0{,}5$. A 0,333 az egyenletes eloszlás, a 0,25 az első két elem egyike, a 0,693 maga a $\ln 2$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a ReLU-ra?",
          options: [
            "Pozitív bemenetre a deriváltja 1.",
            "Egy neuron, amelynek z-je minden tanító mintán negatív, nem tanul.",
            "Teljesen megoldja az eltűnő gradiens problémáját.",
            "A kiszámításához exponenciális függvény kell.",
            "Az értékkészlete a [0; ∞) intervallum."
          ],
          answer: [0, 1, 4],
          hint: R`$\mathrm{ReLU}(z) = \max(0, z)$ – mi a deriváltja a két oldalon?`,
          explain: "Pozitív oldalon a derivált 1, negatívon 0 – ezért a mindig negatív („halott”) neuron nem kap frissítést. Csak enyhíti az eltűnő gradienst (a súlyok szorzata továbbra is elhalhat vagy robbanhat). Egy összehasonlítás, nincs exponenciális. Értékei 0-tól felfelé."
        },
        {
          type: "single", shuffle: true,
          q: R`Két osztály, a kimeneti logitok $\mathbf z = (1;\ 4)$. Mekkora a softmax szerint a második osztály valószínűsége?`,
          options: ["≈ 0,953", "0,8", "≈ 0,982", "0,75"],
          answer: 0,
          hint: "Két osztálynál a softmax a különbség szigmoidja.",
          explain: R`$\sigma(4 - 1) = \sigma(3) \approx 0{,}953$. A 0,8 a $4/(1 + 4)$ arányos normálás, a 0,982 a $\sigma(4)$ (a különbség helyett a nyers érték), a 0,75 a $3/4$.`
        }
      ]
    },

    /* ------------------------------------------------ 9.5 */
    "ai9-95": {
      title: "Kvíz – 9.5 Univerzális közelítés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $g(x) = \mathrm{ReLU}(x) + 2\,\mathrm{ReLU}(x - 1)$ értéke az $x = 1{,}5$ pontban?`,
          options: ["2,5", "2,25", "3,5", "1,5"],
          answer: 0,
          hint: "Számold ki a két zsanért külön: melyik kapcsolt már be?",
          explain: R`$1{,}5 + 2\cdot 0{,}5 = 2{,}5$. A 2,25 az $x^2$ valódi értéke (a törött vonal 0,25-tel felette van), a 3,5 a $\mathrm{ReLU}(x - 1)$-et 1-nek veszi, az 1,5 kifelejti a második zsanért.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $x^2$ függvényt a $[0;\ 2]$-n $n$ egyenlő darabból álló ReLU-törött vonallal közelítjük; a legnagyobb hiba $1/n^2$. Mennyi a hiba 5 neuronnal?`,
          options: ["0,04", "0,2", "0,0016", "0,01"],
          answer: 0,
          hint: "Helyettesíts be n = 5-öt.",
          explain: R`$1/25 = 0{,}04$. A 0,2 az $1/n$ (négyzet nélkül), a 0,0016 az $1/n^4$, a 0,01 a 10 neuronos hiba.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az univerzális közelítés tételére?",
          options: [
            "Folytonos függvényekről szól, korlátos és zárt tartományon.",
            "Létezési tétel: nem mondja meg, hogyan találjuk meg a súlyokat.",
            "Megmondja, hány rejtett neuron kell egy adott pontossághoz.",
            "Lineáris aktivációval is igaz.",
            "Garantálja, hogy a tanított háló új adaton is pontos."
          ],
          answer: [0, 1],
          hint: "A tétel azt állítja, hogy létezik jó közelítő háló. Mit nem állít?",
          explain: "Csak a létezést állítja, folytonos függvényre, korlátos zárt halmazon, nem polinom aktivációval. A neuronszámról, a tanításról és az általánosításról nem mond semmit; lineáris aktivációval a háló lineáris marad."
        },
        {
          type: "set",
          q: "Melyik aktivációval univerzális közelítő az egy rejtett rétegű háló (elég sok neuronnal)?",
          items: ["szigmoid", "tanh", "ReLU", "lineáris (identitás)", "négyzetre emelés (z²)", "szivárgó ReLU"],
          answer: ["szigmoid", "tanh", "ReLU", "szivárgó ReLU"],
          hint: "Leshno és társai szerint a folytonos aktivációk közül pontosan a polinomok a kivételek.",
          explain: "A szigmoid, a tanh, a ReLU és a szivárgó ReLU nem polinom – ezekkel univerzális. Az identitás és a z² polinom: egy rejtett rétegben a kimenet legfeljebb elsőfokú, illetve másodfokú polinom marad."
        },
        {
          type: "single", shuffle: true,
          q: R`A $T(x) = 2\,\mathrm{ReLU}(x) - 4\,\mathrm{ReLU}(x - 0{,}5)$ „hajtogatást” hat rétegen át ismételjük. Hány lineáris darab lesz a $[0;\ 1]$-en, és legalább hány neuron kellene ugyanehhez egyetlen rejtett rétegben?`,
          options: ["64 darab; legalább 63 neuron", "12 darab; 12 neuron", "36 darab; 35 neuron", "64 darab; egy rétegben is elég 12 neuron"],
          answer: 0,
          hint: "Minden réteg megduplázza a darabokat; egy rétegben minden neuron legfeljebb egy töréspontot ad.",
          explain: R`$2^6 = 64$ darab $2\cdot 6 = 12$ neuronból; egy rétegben 63 töréspont, tehát legalább 63 neuron kell. A 12 a neuronok száma (nem a darabok), a 36 a $6^2$; 12 neuron egy rétegben legfeljebb 13 darabot ad.`
        },
        {
          type: "single", shuffle: true,
          q: "A relu-sum szemléltetésben a „lépcső” célfüggvény legnagyobb hibája sosem csökken 0,5 alá, akárhány neuront használsz. Miért?",
          options: [
            "Mert folytonos darabok összege folytonos, az ugrást nem tudja követni – a tétel csak folytonos függvényre szól.",
            "Mert a ReLU nem univerzális aktiváció.",
            "Mert túl kevés a tanító adat.",
            "Mert a lépcső deriváltja mindenhol nulla."
          ],
          answer: 0,
          hint: "Nézd meg a tétel feltételeit: milyen függvényekre ígér tetszőleges pontosságot?",
          explain: "A ReLU-háló kimenete folytonos; az ugrás közvetlen közelében mindig marad legalább 0,5 eltérés az egyik oldalon. A ReLU univerzális (folytonos célra). Itt nincs tanítás, tehát az adat mennyisége nem számít; a lépcső deriváltja a tanításnál számít, nem a közelíthetőségnél."
        }
      ]
    },

    /* ------------------------------------------------ 9.6 */
    "ai9-96": {
      title: "Kvíz – 9.6 Előre irányuló számítás és paraméterszám",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány paramétere van egy 784–128–10-es teljesen összekötött hálónak?",
          options: ["101 770", "101 632", "922", "1 003 520"],
          answer: 0,
          hint: "Rétegenként (n_be + 1) · n_ki – a torzításokat is számold!",
          explain: R`$784\cdot 128 + 128 + 128\cdot 10 + 10 = 101\,770$. A 101 632 csak a súlyok, a 922 a neuronok száma, az 1 003 520 a rétegméretek szorzata.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány paramétere van a 64–16–10-es számjegyfelismerőnek?",
          options: ["1210", "1184", "90", "10 240"],
          answer: 0,
          hint: "64 · 16 + 16 a rejtett, 16 · 10 + 10 a kimeneti rétegben.",
          explain: "1040 + 170 = 1210. Az 1184 a torzítások nélküli súlyszám (ennyi szorzás-összeadás kell képenként), a 90 a neuronok száma, a 10 240 a 64 · 16 · 10 szorzat."
        },
        {
          type: "single", shuffle: true,
          q: R`$W_1 = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$, $\mathbf b_1 = \mathbf 0$, ReLU; a kimenet $y = h_1 + h_2 - 1$ (aktiváció nélkül). Mennyi $y$ az $\mathbf x = (2;\ 1)$ bemenetre?`,
          options: ["3", "2", "4", "1"],
          answer: 0,
          hint: "Előbb a rejtett réteg: két skaláris szorzat, ReLU; utána a kimenet.",
          explain: R`$\mathbf z_1 = (3;\ 1)$, $\mathbf h = (3;\ 1)$, $y = 3 + 1 - 1 = 3$. A 2 kihagyja a második neuront, a 4 a kimeneti torzítást, az 1 csak a második neuront veszi.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz egy teljesen összekötött háló paramétereire?",
          options: [
            "A bemeneti rétegnek nincs paramétere.",
            "Egy n_be → n_ki réteg paraméterszáma (n_be + 1) · n_ki.",
            "A torzítások általában a paraméterek 1–5%-át teszik ki.",
            "32 bites számokkal paraméterenként 4 bájt kell.",
            "A paraméterek száma megegyezik a neuronok számával."
          ],
          answer: [0, 1, 3],
          hint: "Számold ki a torzítások arányát a 784–128–10-es hálóban!",
          explain: "A torzítások aránya ott 138/101 770 ≈ 0,14% – az MLSYS „1–5%”-a túloz. A neuronok száma (922) messze kisebb, mint a paramétereké. 32 bit = 4 bájt."
        },
        {
          type: "single", shuffle: true,
          q: "Egy 1 millió paraméteres háló 32 bites számokkal kb. mennyi memóriát foglal?",
          options: ["4 MB", "1 MB", "32 MB", "2 MB"],
          answer: 0,
          hint: "32 bit = 4 bájt.",
          explain: "10⁶ · 4 bájt = 4 MB. Az 1 MB 1 bájtos (8 bites) tárolás, a 32 MB a bitek bájtnak olvasása, a 2 MB a 16 bites tárolás."
        },
        {
          type: "single", shuffle: true,
          q: "Mennyivel több paramétere van egy 784–100–100–10-es hálónak, mint egy 784–100–10-esnek?",
          options: ["10 100", "10 000", "100", "89 610"],
          answer: 0,
          hint: "A különbség egy 100 → 100-as réteg.",
          explain: "100 · 100 + 100 = 10 100 (79 510 → 89 610). A 10 000 kifelejti a torzításokat, a 100 csak a torzításokat számolja, a 89 610 a nagyobb háló teljes paraméterszáma."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai9-final": {
      title: "Fejezetzáró teszt – 9. Neurális hálózatok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy lépcsős neuron ($\hat y = 1$, ha $z \gt 0$): $\mathbf x = (1;\ -2;\ 0{,}5)$, $\mathbf w = (2;\ 1;\ -2)$, $b = 1$. Mi a kimenete?`,
          options: ["0", "1", "−1", "0,5"],
          answer: 0,
          hint: "Számold ki z-t, és figyelj a megállapodásra: mit ad a lépcső a z = 0-ra?",
          explain: R`$z = 2 - 2 - 1 + 1 = 0$, és a lépcső nálunk csak $z \gt 0$-ra ad 1-et, tehát 0. (A $z \ge 0$ megállapodással 1 lenne – ezért mindig nézd meg a definíciót.) A 0,5 a $\sigma(0)$, a $-1$ nem lehet lépcsőkimenet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Perceptron: $\mathbf w = (0;\ 1)$, $b = 0$, $\eta = 0{,}5$. Minta: $\mathbf x = (1;\ 1)$, $y = 0$. Mik az új súlyok?`,
          options: ["w = (−0,5; 0,5), b = −0,5", "w = (−1; 0), b = −1", "w = (0,5; 1,5), b = 0,5", "w = (0; 1), b = 0"],
          answer: 0,
          hint: "Jóslat, hiba előjele, aztán a frissítés η-val.",
          explain: R`$z = 1$ → $\hat y = 1$, de 0 kellett: $y - \hat y = -1$; $\mathbf w = (0;\ 1) - 0{,}5\cdot(1;\ 1) = (-0{,}5;\ 0{,}5)$, $b = -0{,}5$. A $(-1;\ 0)$ az $\eta = 1$-es lépés, a $(0{,}5;\ 1{,}5)$ előjelhiba, a változatlan súly helyes jóslatot feltételez.`
        },
        {
          type: "set",
          q: "Melyik függvényt tudja hibátlanul megtanulni egyetlen perceptron (rejtett réteg nélkül)?",
          items: ["ÉS", "VAGY", "XOR", "NEM-ÉS (NAND)", "háromváltozós paritás", "„x₁ > 3” (folytonos x₁, x₂ bemenet)"],
          answer: ["ÉS", "VAGY", "NEM-ÉS (NAND)", "„x₁ > 3” (folytonos x₁, x₂ bemenet)"],
          hint: "Egy perceptron egy egyenest (hipersíkot) húz. Melyiknél választja el egy egyenes az osztályokat?",
          explain: "Az ÉS, a VAGY, a NAND és az „x₁ > 3” lineárisan szétválasztható. A XOR nem, és a háromváltozós paritás sem (az x₃ = 0 részen éppen XOR) – ezekhez rejtett réteg kell."
        },
        {
          type: "single", shuffle: true,
          q: "Egy csapat 20 rejtett réteget épít, de minden aktivációt lineárisra (identitásra) állít. Mit tud ez a háló?",
          options: [
            "Pontosan annyit, mint egyetlen lineáris réteg.",
            "Annyit, mint egy 20-adfokú polinom.",
            "Bármely folytonos függvényt közelít, ha elég széles.",
            "Többet, mint egy rejtett rétegű ReLU-háló."
          ],
          answer: 0,
          hint: "Szorozd össze a rétegek mátrixait!",
          explain: R`Lineáris rétegek egymásutánja $W\mathbf x + \mathbf b$ – egyetlen réteg. Polinom nem keletkezik (MLD tévedése), és a lineáris aktiváció polinom, ezért az univerzális közelítés sem érvényes.`
        },
        {
          type: "match",
          q: "Párosítsd az aktivációs függvényt a tulajdonságával!",
          pairs: [
            ["szigmoid", "értékei 0 és 1 között, legnagyobb deriváltja 0,25"],
            ["tanh", "értékei −1 és 1 között, nulla középpontú"],
            ["ReLU", "max(0, z), pozitív oldalon nem telítődik"],
            ["lépcső", "a deriváltja mindenhol 0, gradiens módszerrel nem tanítható"]
          ],
          hint: "Gondolj az értékkészletekre és a deriváltakra.",
          explain: "A szigmoid (0; 1)-be képez, σ′ ≤ 0,25. A tanh = 2σ(2z) − 1, (−1; 1), szimmetrikus. A ReLU deriváltja pozitív z-re 1. A lépcső deriváltja 0 (a 0-ban nem létezik) – ezért kellett a sima aktiváció."
        },
        {
          type: "single", shuffle: true,
          q: "Két osztály kimeneti logitja 2,1 és 1,0. Hányszor nagyobb a softmax szerint az első osztály valószínűsége a másodikénál?",
          options: ["≈ 3,0", "2,1", "1,1", "≈ 1,5"],
          answer: 0,
          hint: R`$p_1/p_2 = e^{z_1}/e^{z_2}$.`,
          explain: R`$e^{2{,}1 - 1{,}0} = e^{1{,}1} \approx 3{,}0$. A 2,1 a logitok hányadosa, az 1,1 a különbségük (exponenciális nélkül); a „kb. 1,5” DLV-hez hasonló becslési hiba.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány paramétere van egy 2–8–8–1-es hálónak?",
          options: ["105", "88", "19", "128"],
          answer: 0,
          hint: "(2 + 1) · 8 + (8 + 1) · 8 + (8 + 1) · 1",
          explain: "24 + 72 + 9 = 105. A 88 csak a súlyok, a 19 a neuronok száma, a 128 a 2 · 8 · 8 · 1 szorzat."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ReLU-háló négy rétege mindegyikében ugyanaz a két neuron „hajtogat”: $T(x) = 2\,\mathrm{ReLU}(x) - 4\,\mathrm{ReLU}(x - 0{,}5)$. Hány lineáris darabból áll a kimenet a $[0;\ 1]$-en?`,
          options: ["16", "8", "4", "9"],
          answer: 0,
          hint: "Minden réteg megduplázza a darabokat; egy réteg 2 darabot ad.",
          explain: R`$2^4 = 16$. A 8 a neuronok száma ($2 \cdot 4$), a 4 a rétegeké, a 9 egy rétegű, 8 neuronos háló legnagyobb darabszáma lenne.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "Egy rejtett rétegű háló elég sok neuronnal bármely folytonos függvényt tetszőleges pontossággal közelít egy korlátos zárt halmazon.",
            "Ha egy háló univerzális közelítő, akkor a tanítás biztosan megtalálja a legjobb súlyokat.",
            "A mélység egyes függvényeket sokkal kevesebb neuronból rak össze, mint a szélesség.",
            "Táblázatos, kevés mintás adaton a mély háló mindig jobb, mint egy véletlen erdő.",
            "A rejtett réteg új jellemzőket számol, amelyeken a kimeneti réteg lineárisan dönt."
          ],
          answer: [0, 2, 4],
          hint: "Különböztesd meg a létezést, a megtalálást és az általánosítást.",
          explain: "Az univerzális közelítés létezési tétel – a tanításról nem szól. A mélység szorozza a darabokat. Táblázatos adaton gyakran a fák nyernek (HAW 4 példájában is). A rejtett réteg tanult jellemzőket ad – ezért egy MLP kimeneti rétege egy lineáris modell."
        },
        {
          type: "single", shuffle: true,
          q: "A 64–16–10-es számjegyháló egy kép feldolgozásakor kb. hány szorzás-összeadást végez?",
          options: ["1184", "1210", "90", "10 240"],
          answer: 0,
          hint: "Minden súly egyszer dolgozik képenként; a torzításokat csak hozzáadjuk.",
          explain: "64 · 16 + 16 · 10 = 1184 szorzás-összeadás (a súlyok száma). Az 1210 a torzításokkal együtt a paraméterszám, a 90 a neuronok száma, a 10 240 a rétegméretek szorzata."
        },
        {
          type: "single", shuffle: true,
          q: "Egy hálónak egy fényképhez öt címkéből („tenger”, „kutya”, „naplemente”, „hegy”, „ember”) kell megmondania, melyek illenek rá – egyszerre több is lehet. Milyen kimeneti réteg kell?",
          options: ["5 neuron, mindegyiken külön szigmoid", "5 neuron softmaxszal", "1 szigmoid neuron", "1 neuron aktiváció nélkül"],
          answer: 0,
          hint: "Kizárják-e egymást a címkék?",
          explain: "Több címke egyszerre: öt független igen/nem kérdés, öt szigmoid – a valószínűségek összege 1-nél több is lehet. A softmax kizáró osztályokra való (összegük 1), egy szigmoid csak egyetlen igen/nem kérdésre, aktiváció nélküli kimenet regresszióra."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
