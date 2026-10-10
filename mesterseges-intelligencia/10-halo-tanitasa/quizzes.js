/* =========================================================
   Mesterséges intelligencia 10. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 10.1 */
    "ai10-101": {
      title: "Kvíz – 10.1 Veszteségfüggvények",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy háló a helyes osztályra $\hat p = 0{,}25$ valószínűséget mond. Mennyi a keresztentrópia-veszteség (természetes logaritmussal)?`,
          options: ["1,386", "0,602", "0,75", "2"],
          answer: 0,
          hint: R`A veszteség $-\ln\hat p_{\text{helyes}}$. Melyik logaritmus a szokás?`,
          explain: R`$-\ln 0{,}25 \approx 1{,}386$. A 0,602 a 10-es alapú, a 2 a 2-es alapú logaritmus (bitekben), a 0,75 pedig az $1 - \hat p$ – az nem veszteségfüggvény.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szigmoid kimenet, $z = -4$ ($\hat p \approx 0{,}018$), a címke $y = 1$, keresztentrópia. Mennyi $\partial L/\partial z$?`,
          options: ["−0,982", "−0,0173", "4,018", "0,982"],
          answer: 0,
          hint: R`Szigmoid + keresztentrópia esetén a gradiens a $z$ szerint nagyon egyszerű: „jóslat mínusz valóság”.`,
          explain: R`$\partial L/\partial z = \hat p - y = 0{,}018 - 1 = -0{,}982$. A $-0{,}0173$ a négyzetes hibáé (ott még $\times\hat p(1 - \hat p)$), a 4,018 maga a veszteség, nem a gradiense, a $+0{,}982$ előjelhiba ($y - \hat p$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy tízosztályos osztályozó a tanítás előtt minden osztályra kb. 10%-ot mond. Mekkora kiinduló veszteséget vársz?",
          options: ["2,303", "0,1", "1", "3,322"],
          answer: 0,
          hint: "Minden képen ugyanaz a helyes válasz valószínűsége: 0,1. Mi a negatív természetes logaritmusa?",
          explain: R`$-\ln 0{,}1 = \ln 10 \approx 2{,}303$. Az 1 a 10-es alapú, a 3,322 a 2-es alapú logaritmus, a 0,1 maga a valószínűség. Ez a jó első ellenőrzés egy új tanításnál (10.8).`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a kimeneti réteggel és a veszteséggel!",
          pairs: [
            ["holnapi hőmérséklet", "identitás + négyzetes hiba"],
            ["spam-e a levél", "1 szigmoid + bináris keresztentrópia"],
            ["melyik a 10 számjegy közül", "softmax + keresztentrópia"],
            ["mely címkék illenek egy fotóra (több is lehet)", "K szigmoid + K bináris keresztentrópia"]
          ],
          hint: "Szám vagy valószínűség? Ha valószínűség: kizárják-e egymást az osztályok?",
          explain: "Regresszió: identitás + négyzetes hiba. Két osztály: egy szigmoid. Kizáró osztályok: softmax. Több címke egyszerre: címkénként külön szigmoid. Mindegyik párosnál a kimeneti δ = ŷ − y."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "A keresztentrópia a modell szerinti negatív log-likelihood.",
            "A pontosság jó veszteségfüggvény, hiszen azt akarjuk javítani.",
            R`A softmax + keresztentrópia gradiense a logitok szerint $\hat{\mathbf p} - \mathbf y$.`,
            "A validációs veszteség nőhet úgy is, hogy a pontosság nem változik.",
            "A PyTorch CrossEntropyLoss elé a hálóba még egy softmax réteg kell."
          ],
          answer: [0, 2, 3],
          hint: "Gondolj arra, mit kap a gradiens módszer egy lépcsőfüggvénytől, és hogy mit vár a CrossEntropyLoss.",
          explain: R`A keresztentrópia a helyes válaszok valószínűségének negatív logaritmusa – a negatív log-likelihood; a softmaxszal együtt a gradiense $\hat{\mathbf p} - \mathbf y$. A veszteség nőhet, ha a háló ugyanazokat a képeket egyre magabiztosabban rontja el.
            A pontosság lépcsőszerű, a gradiense majdnem mindenhol 0. A CrossEntropyLoss logitokat vár, és maga számolja a softmaxot – egy második softmax elrontja a tanítást.`
        }
      ]
    },

    /* ------------------------------------------------ 10.2 */
    "ai10-102": {
      title: "Kvíz – 10.2 Gradiens módszer mini-kötegekkel",
      questions: [
        {
          type: "single", shuffle: true,
          q: "1047 tanítókép, 32-es kötegek. Hány frissítés egy epoch?",
          options: ["33", "32", "1047", "32,7"],
          answer: 0,
          hint: "Az utolsó, nem teli köteg is egy lépés.",
          explain: R`$\lceil 1047/32\rceil = 33$: 32 teli köteg és egy 23 képes. A 32 elfelejti a maradékot, az 1047 a mintánkénti (B = 1) lépés, a 32,7 lefelé sem kerekít – a lépések száma egész.`
        },
        {
          type: "single", shuffle: true,
          q: R`A mintánkénti gradiensek szórása $\sigma = 12$. Mekkora kb. egy 16-os köteg átlagos gradiensének szórása?`,
          options: ["3", "0,75", "12", "48"],
          answer: 0,
          hint: R`Független minták átlagának szórása: $\sigma/\sqrt B$.`,
          explain: R`$12/\sqrt{16} = 3$. A 0,75 a $\sigma/B$ (gyök nélkül), a 12 a kötegezés hatásának figyelmen kívül hagyása, a 48 a $\sigma\sqrt B$ – fordított irány.`
        },
        {
          type: "single", shuffle: true,
          q: R`$B = 64$-gyel $\eta = 0{,}05$ jól működik. Milyen $\eta$-val kezdenél $B = 256$-nál a lineáris skálázás szerint?`,
          options: ["0,2", "0,05", "0,1", "0,0125"],
          answer: 0,
          hint: "Hányszorosára nőtt a köteg? A szabály szerint a tanulási ráta ugyanennyiszeresére nő.",
          explain: R`A köteg négyszeres, így $\eta = 4 \cdot 0{,}05 = 0{,}2$ (bemelegítéssel). A 0,05 változatlan hagyás – kevés lépés jut ugyanarra a számításra; a 0,1 a gyökös skálázás; a 0,0125 fordított irány.`
        },
        {
          type: "multi",
          q: "Melyik igaz a kötegméretre?",
          options: [
            "A köteg gradiense átlagosan pontos (torzítatlan) becslése a teljes gradiensnek.",
            "Négyszeres köteg kb. feleakkora zajt ad.",
            "A teljes köteg (B = n) mindig a legjobb, hiszen a pontos gradienst adja.",
            "Ugyanannyi epoch alatt a nagyobb köteg kevesebbet lép.",
            "Gradiensgyűjtésnél (a veszteséget a részkötegek számával osztva) a tanulási rátát is meg kell szorozni."
          ],
          answer: [0, 1, 3],
          hint: R`Zaj $\approx\sigma/\sqrt B$; egy epoch $\lceil n/B\rceil$ lépés. A gyűjtés pontosan mivel egyenértékű?`,
          explain: "A köteg gradiense torzítatlan, a zaja 1/√B-vel csökken, és egy epoch n/B lépés – a nagy köteg ugyanannyi epoch alatt kevesebbet lép (a számjegyhálón a teljes köteg 20 epoch alatt csak 20-at). A gradiensgyűjtés maga a nagy köteg, a tanulási ráta nem változik."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a helyes sorrend egy köteg feldolgozásakor (PyTorch-stílusban)?",
          options: [
            "gradiensek nullázása → előre menet → veszteség → visszafelé menet → frissítés",
            "előre menet → frissítés → veszteség → visszafelé menet → nullázás",
            "visszafelé menet → előre menet → veszteség → frissítés → nullázás",
            "előre menet → veszteség → frissítés → visszafelé menet → nullázás"
          ],
          answer: 0,
          hint: "A frissítéshez gradiens kell, a gradienshez veszteség, a veszteséghez jóslat.",
          explain: "A jóslat (előre) → a veszteség → a gradiens (vissza) → a lépés (frissítés). A nullázás azért kell a backward() előtt, mert az hozzáadja az új gradienseket a régiekhez."
        }
      ]
    },

    /* ------------------------------------------------ 10.3 */
    "ai10-103": {
      title: "Kvíz – 10.3 Visszaterjesztés kézzel",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Lineáris neuron, $\hat y = wx + b$, $L = \tfrac12(\hat y - y)^2$. $x = 3$, a jóslat $\hat y = 3$, a címke $y = 5$. Mennyi $\partial L/\partial w$?`,
          options: ["−6", "−2", "6", "9"],
          answer: 0,
          hint: R`Előbb a $\delta = \hat y - y$, aztán „bemenet × $\delta$”.`,
          explain: R`$\delta = 3 - 5 = -2$, $\partial L/\partial w = \delta x = -6$. A $-2$ a bemenet kifelejtése (az a torzítás gradiense), a $+6$ előjelhiba ($y - \hat y$), a 9 a $\hat y\cdot x$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ReLU-s rejtett neuron ($z \gt 0$) két kimeneti neuronra hat 2 és $-1$ súllyal; azok $\delta$-ja 0,3 és 0,4. Mennyi a rejtett neuron $\delta$-ja?`,
          options: ["0,2", "1,0", "0,7", "−0,2"],
          answer: 0,
          hint: R`A kimenő súlyokkal súlyozott „következő” $\delta$-k összege, szorozva a ReLU deriváltjával.`,
          explain: R`$2 \cdot 0{,}3 + (-1)\cdot 0{,}4 = 0{,}2$, és a ReLU deriváltja ($z \gt 0$) 1. Az 1,0 az előjelek elhagyása, a 0,7 a súlyok kihagyása, a $-0{,}2$ előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanaz, de a rejtett neuron szigmoidos, a kimenete $h = 0{,}8$. Mennyi a $\delta$-ja?`,
          options: ["0,032", "0,2", "0,16", "0,04"],
          answer: 0,
          hint: R`Szigmoidnál $\varphi'(z) = h(1 - h)$.`,
          explain: R`$0{,}2 \cdot 0{,}8 \cdot 0{,}2 = 0{,}032$. A 0,2 a $\varphi'$ kifelejtése, a 0,16 maga a $\varphi'$ (a súlyozott összeg nélkül), a 0,04 a $0{,}2\cdot(1 - h)$ – fél derivált.`
        },
        {
          type: "single", shuffle: true,
          q: "A számjegyhálónak 1210 paramétere van. Hány előre menet kell a teljes gradienshez szimmetrikus numerikus deriválással?",
          options: ["2420", "1210", "1211", "3"],
          answer: 0,
          hint: R`Paraméterenként $L(w + \varepsilon)$ és $L(w - \varepsilon)$ kell.`,
          explain: "Paraméterenként 2, összesen 2420. Az 1211 az egyoldalú különbség (egy közös alap-menettel), az 1210 egy menet paraméterenként; a 3 előre menetnyi munka a visszaterjesztés ára."
        },
        {
          type: "multi",
          q: "Melyik igaz a visszaterjesztésre?",
          options: [
            R`Visszafelé a súlymátrix transzponáltja szoroz: $W^\top\boldsymbol\delta$.`,
            "Egy ReLU-s neuron, amelynek z-je negatív, ebből a mintából nem kap gradienst a bejövő súlyaira.",
            "A visszaterjesztés maga dönti el, mekkorát lépnek a súlyok.",
            "Az előre menet köztes értékeit a visszafelé menetig meg kell őrizni.",
            "A költsége a paraméterek számának négyzetével nő."
          ],
          answer: [0, 1, 3],
          hint: "Különítsd el: mit számol a visszaterjesztés, és mit csinál az optimalizáló?",
          explain: R`Visszafelé $W^\top$ szoroz; a halott ReLU deriváltja 0, így a $\delta$-ja és a bejövő súlyainak gradiense is 0; a $\varphi'(\mathbf z)$ és a $\mathbf h$ kell a visszafelé menethez, ezért tárolni kell őket.
            A lépés méretét az optimalizáló (és $\eta$) dönti el. A költség a paraméterszámmal arányos, kb. 3 előre menet.`
        }
      ]
    },

    /* ------------------------------------------------ 10.4 */
    "ai10-104": {
      title: "Kvíz – 10.4 Számítási gráf és automatikus differenciálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$f = (x + y)\cdot z$, $x = 2$, $y = -1$, $z = 4$. Mennyi $\partial f/\partial x$?`,
          options: ["4", "1", "2", "−4"],
          answer: 0,
          hint: "A szorzás felcserél, az összeadás továbbad.",
          explain: R`$\partial f/\partial q = z = 4$, az összeadás ezt továbbadja $x$-nek: 4. Az 1 a $q = x + y$ értéke (az a $\partial f/\partial z$), a 2 maga az $x$, a $-4$ előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f = x\cdot y + x$, $x = 3$, $y = 2$. Mennyi $\partial f/\partial x$?`,
          options: ["3", "2", "1", "9"],
          answer: 0,
          hint: R`Az $x$ két úton hat $f$-re. Mi történik a gradiensekkel az elágazásnál?`,
          explain: R`A szorzáson át $y = 2$, közvetlenül 1 – az elágazásnál összeadódnak: 3. A 2 és az 1 csak az egyik utat számolja, a 9 maga az $f$ értéke.`
        },
        {
          type: "match",
          q: "Párosítsd a csúcsot a visszafelé viselkedésével!",
          pairs: [
            ["összeadás", "változatlanul továbbadja a gradienst"],
            ["szorzás", "a másik bemenet értékével szorozza"],
            ["maximum", "csak a nagyobb bemenetnek adja tovább"],
            ["elágazás (egy érték több helyre megy)", "a beérkező gradiensek összeadódnak"]
          ],
          hint: "Gondold végig a lokális deriváltakat: ∂(a+b)/∂a, ∂(ab)/∂a, ∂max(a, b)/∂a.",
          explain: "Az összeadás lokális deriváltja 1 (továbbad), a szorzásé a másik tényező (felcserél), a maximumé 1 a nagyobbra, 0 a kisebbre (irányít); elágazásnál a többváltozós láncszabály szerint a hozzájárulások összeadódnak."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy veszteség, $10^6$ paraméter. Melyik automatikus differenciálási mód kell, és hány visszafelé menet?`,
          options: ["fordított mód, 1 visszafelé menet", "előre mód, 1 menet", R`fordított mód, $10^6$ visszafelé menet`, "előre mód, 2 menet"],
          answer: 0,
          hint: "Az előre mód bemenetenként, a fordított mód kimenetenként kér egy menetet.",
          explain: R`Egy kimenet (a veszteség) van: a fordított mód egy visszafelé menettel adja mind a $10^6$ deriváltat. Az előre mód $10^6$ menetet kérne (paraméterenként egyet).`
        },
        {
          type: "single", shuffle: true,
          q: R`$f = \max(x, y)\cdot z$, $x = 1$, $y = 5$, $z = 3$. Mennyi $\partial f/\partial x$?`,
          options: ["0", "3", "5", "15"],
          answer: 0,
          hint: "Melyik bemenet a nagyobb? A maximum csak annak adja tovább a gradienst.",
          explain: R`$\max(1, 5) = 5$, a maximum az $y$-hoz irányít, így $\partial f/\partial x = 0$ (és $\partial f/\partial y = z = 3$). A 3 az $y$ gradiense, az 5 a $\partial f/\partial z$, a 15 az $f$.`
        }
      ]
    },

    /* ------------------------------------------------ 10.5 */
    "ai10-105": {
      title: "Kvíz – 10.5 Optimalizálók",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Momentum, $\beta = 0{,}9$, $\eta = 0{,}01$. A gradiens tartósan 1. Mekkora lépés felé tart a frissítés?`,
          options: ["0,1", "0,009", "0,019", "0,01"],
          answer: 0,
          hint: R`A sebesség állandó gradiensnél $1/(1 - \beta)$-hoz tart.`,
          explain: R`$v \to 1/(1 - 0{,}9) = 10$, a lépés $\eta v = 0{,}1$. A 0,019 csak a második lépés ($0{,}01\cdot 1{,}9$), a 0,009 az $\eta\beta$, a 0,01 a momentum nélküli lépés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Adam, az első lépés ($t = 1$), $g = 50$, $\eta = 0{,}001$, a szokásos $\beta_1 = 0{,}9$, $\beta_2 = 0{,}999$. Mekkora a lépés?`,
          options: ["0,001", "0,05", "0,00316", "0,005"],
          answer: 0,
          hint: R`Korrekcióval $\hat m = g$ és $\hat v = g^2$ az első lépésben.`,
          explain: R`$\hat m/\sqrt{\hat v} = 50/50 = 1$, a lépés $\eta = 0{,}001$ – a gradiens nagyságától függetlenül. A 0,05 a sima SGD ($\eta g$), a 0,00316 a korrekció nélküli Adam ($3{,}16\eta$), a 0,005 a korrekció nélküli $\eta m$, skálázás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Koszinuszos ütemezés, $\eta_{\max} = 0{,}1$, $\eta_{\min} = 0$. Mennyi $\eta$ a tanítás felénél ($t = T/2$)?`,
          options: ["0,05", "0,1", "0", "0,0854"],
          answer: 0,
          hint: R`$\eta_t = \eta_{\min} + \tfrac12(\eta_{\max} - \eta_{\min})(1 + \cos(\pi t/T))$, és $\cos(\pi/2) = 0$.`,
          explain: R`$\tfrac12 \cdot 0{,}1 \cdot (1 + 0) = 0{,}05$. A 0,0854 a negyednél ($t = T/4$) érvényes, a 0,1 a kezdet, a 0 a vég.`
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "A momentum váltakozó irányú gradienseknél csillapít.",
            "Az Adam paraméterenként a gradiens tipikus nagyságával skáláz.",
            "Az Adam lépésszámlálója (t) 0-ról indul.",
            "Momentum bekapcsolásakor a tanulási rátát gyakran csökkenteni kell.",
            "Az Adam minden feladaton jobb, mint a momentumos SGD."
          ],
          answer: [0, 1, 3],
          hint: "Gondolj a tényleges lépésközre momentummal, és arra, mi lenne a korrekcióban 0-val.",
          explain: R`A momentum a váltakozó gradienseket kioltja, a tartósakat felerősíti – akár $1/(1 - \beta)$-szorosra, ezért kell kisebb $\eta$. Az Adam $\hat m/\sqrt{\hat v}$-vel lép. A $t$ 1-ről indul ($t = 0$-nál $1 - \beta^0 = 0$-val osztanánk). Nincs mindenhol legjobb optimalizáló – képfelismerésben a gondosan ütemezett SGD + momentum gyakran ugyanolyan jó.`
        },
        {
          type: "match",
          q: "Párosítsd az ütemezést a leírásával!",
          pairs: [
            ["lépcsős csökkentés", "néhány epochonként a tizedére"],
            ["koszinuszos csökkentés", "lassan indul lefelé, középen gyorsan csökken, a végén kisimul"],
            ["bemelegítés", "az első lépésekben 0-ról fokozatosan nő"],
            ["platón csökkentés", "ha a validációs veszteség nem javul, csökkenti"]
          ],
          hint: "Melyik figyel a validációs veszteségre, és melyik az elején működik?",
          explain: "A lépcsős előre rögzített pontokon ugrik, a koszinusz egy félperiódusnyi koszinuszgörbét követ, a bemelegítés a tanítás elején emel, a platón csökkentés a validációs görbe megtorpanására reagál."
        }
      ]
    },

    /* ------------------------------------------------ 10.6 */
    "ai10-106": {
      title: "Kvíz – 10.6 Inicializálás, eltűnő és robbanó gradiens",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A számjegyhálót (64–16–10, ReLU) csupa nulla súllyal indítjuk. Mi lesz a validációs veszteség 20 epoch után?",
          options: ["2,303 (ln 10) – nem tanul", "kb. 0,2 – ugyanúgy tanul", "12,9 – felrobban", "0 – bemagolja"],
          answer: 0,
          hint: R`Mennyi a rejtett kimenet, ha minden súly 0? És mennyi a kimeneti súlyok gradiense, $\delta\cdot h$?`,
          explain: R`Csupa nullával minden rejtett kimenet 0, a súlyok gradiense 0, csak a kimeneti torzítás tanul – a háló minden képre ugyanazt mondja, a veszteség $\ln 10 \approx 2{,}303$ marad. A 12,9 a túl nagy (szórás 1) kezdés kiinduló vesztesége.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ReLU-s réteg 128 bemenetű. Mekkora a súlyok szórása He-kezdéssel ($\mathrm{Var}(w) = 2/n_{\text{be}}$)?`,
          options: ["0,125", "0,088", "0,0156", "1,414"],
          answer: 0,
          hint: "A szórás a variancia gyöke.",
          explain: R`$\sqrt{2/128} = \sqrt{1/64} = 0{,}125$. A 0,088 a Xavier-kezdés ($\sqrt{1/128}$), a 0,0156 a variancia gyök nélkül, az 1,414 a $\sqrt2$ – a $n_{\text{be}}$-vel való osztás kimaradt.`
        },
        {
          type: "single", shuffle: true,
          q: "A jel rétegenként a felére csökken. Mennyi marad belőle 10 réteg után?",
          options: ["≈ 0,001", "0,05", "5", "≈ 0,000001"],
          answer: 0,
          hint: "A szorzók rétegenként összeszorzódnak.",
          explain: R`$0{,}5^{10} = 1/1024 \approx 0{,}001$. A 0,05 és az 5 összeadás vagy szorzás a hatványozás helyett, a $\approx 10^{-6}$ a $0{,}25^{10}$ (a szigmoid deriváltjának felső korlátjával).`
        },
        {
          type: "single", shuffle: true,
          q: R`Kötegnormalizálás: egy neuron $z$-je egy 4 képes kötegen $(2;\ 4;\ 6;\ 8)$. Mennyi a normalizált érték a 8-ra ($\varepsilon$ nélkül)?`,
          options: ["1,342", "3", "0,6", "1,162"],
          answer: 0,
          hint: R`Átlag, variancia (a $4$-gyel osztva), aztán $(z - \mu)/\sigma$.`,
          explain: R`$\mu = 5$, $\sigma^2 = (9 + 1 + 1 + 9)/4 = 5$, $(8 - 5)/\sqrt5 \approx 1{,}342$. A 3 az osztás kimaradása, a 0,6 a varianciával (nem a szórással) osztás, az 1,162 a korrigált ($n - 1$-es) szórással számol.`
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "Ha egy réteg két neuronjának minden súlya egyforma, a gradienseik is egyformák.",
            "A rétegnormalizálás nem függ a kötegtől.",
            "A kötegnormalizálás kiértékeléskor is az aktuális köteg átlagát használja.",
            "A gradiensvágás megtartja a gradiens irányát, csak a hosszát korlátozza.",
            "ReLU-s hálóhoz a Xavier-kezdés a jobb, a He-kezdés tanh-hoz való."
          ],
          answer: [0, 1, 3],
          hint: "Melyik normalizálás mely tengely mentén számol statisztikát? Mit csinál a ReLU a jel felével?",
          explain: R`Szimmetrikus kezdésnél a neuronok klónok maradnak. A rétegnormalizálás mintánként számol, a kötegtől független. A kötegnormalizálás kiértékeléskor a tanítás alatt gyűjtött mozgó átlagokat használja. A vágás $\mathbf g\cdot c/\lVert\mathbf g\rVert$-sel skáláz – az irány marad.
            Fordítva: a He-kezdés ($2/n$) való ReLU-hoz, mert a ReLU a jel felét lenullázza; a Xavier tanh-hoz, szigmoidhoz.`
        }
      ]
    },

    /* ------------------------------------------------ 10.7 */
    "ai10-107": {
      title: "Kvíz – 10.7 Regularizáció",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Fordított dropout, $p = 0{,}5$. A rejtett kimenet $(4;\ 6;\ 2)$, a maszk $(1;\ 0;\ 1)$. Mi a tanítási kimenet?`,
          options: ["(8; 0; 4)", "(4; 0; 2)", "(2; 0; 1)", "(8; 12; 4)"],
          answer: 0,
          hint: R`A kiesett neuron 0, a megmaradtak $1/(1 - p)$-szeresre nőnek.`,
          explain: R`$1/(1 - 0{,}5) = 2$: $(8;\ 0;\ 4)$. A $(4;\ 0;\ 2)$ felszorzás nélkül eltolja a jel várható értékét, a $(2;\ 0;\ 1)$ a kiértékeléskori $(1 - p)$-szorzást keveri ide, a $(8;\ 12;\ 4)$ kihagyja a maszkot.`
        },
        {
          type: "single", shuffle: true,
          q: "Validációs veszteség epochonként: 0,9; 0,7; 0,6; 0,62; 0,58; 0,61; 0,63; 0,66. Korai leállítás, türelem 2. Mi történik?",
          options: [
            "A 7. epoch után megáll, és az 5. epoch súlyait tölti vissza.",
            "A 4. epoch után megáll, és a 3. epoch súlyait tölti vissza.",
            "A 7. epoch után megáll, és a 7. epoch súlyait tartja meg.",
            "A 8. epoch után megáll, és a 3. epoch súlyait tölti vissza."
          ],
          answer: 0,
          hint: "A számláló minden javulásnál újraindul. Hány romló epoch kell a megálláshoz?",
          explain: "A 3. epoch (0,6) után a 4. rosszabb, de az 5. jobb (0,58) – új legjobb. A 6. és a 7. rosszabb: két epoch javulás nélkül → a 7. után megáll, és az 5. súlyait tölti vissza. A 4. utáni megállás az 1-es türelem lenne; visszatöltés nélkül a romlott 7. epoch hálója maradna."
        },
        {
          type: "single", shuffle: true,
          q: R`SGD L2-büntetéssel: $w = 2$, a veszteség gradiense $g = 0$, $\eta = 0{,}1$, $\lambda = 0{,}5$. Mennyi az új $w$?`,
          options: ["1,9", "2", "1", "1,95"],
          answer: 0,
          hint: R`$w \leftarrow (1 - \eta\lambda)w - \eta g$.`,
          explain: R`$(1 - 0{,}05)\cdot 2 = 1{,}9$. A 2 a büntetés kihagyása, az 1 a $w - \lambda w$ ($\eta$ nélkül), az 1,95 a $\lambda/2$ használata a gradiensben.`
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "Adamnál az L2-büntetés nem azonos a súlycsökkentéssel – erre való az AdamW.",
            "A dropoutot kiértékeléskor ki kell kapcsolni.",
            "Az adatbővítést a validációs és a tesztadatra is alkalmazni kell.",
            "A korai leállítás a legjobb validációs eredménynél áll meg.",
            "A több adat az alulillesztést is megszünteti."
          ],
          answer: [0, 1, 3],
          hint: "Melyik eszköz változtat a mérésen, és melyik csak a tanításon?",
          explain: "Az Adam a λw tagot is skálázza, így a büntetés ereje elvész – az AdamW külön csökkenti a súlyokat. A dropout és a bővítés csak a tanítást érinti; a validációs és a tesztadat érintetlen marad. A korai leállítás a validációs minimumnál áll meg. A több adat a túlillesztésen segít; az alulillesztéshez nagyobb modell vagy jobb jellemzők kellenek."
        },
        {
          type: "set",
          q: "Melyik átalakítás őrzi meg egy kézzel írt számjegy címkéjét (jó adatbővítés a digits-hez)?",
          items: ["1 pixeles eltolás", "kis (±10°-os) forgatás", "180°-os forgatás", "vízszintes tükrözés", "enyhe zaj a pixeleken", "enyhe nagyítás"],
          answer: ["1 pixeles eltolás", "kis (±10°-os) forgatás", "enyhe zaj a pixeleken", "enyhe nagyítás"],
          hint: "Melyik után ismerné fel egy ember is ugyanannak a számjegynek?",
          explain: "Az eltolás, a kis forgatás, a zaj és az enyhe nagyítás nem változtat a számjegyen. A 180°-os forgatás a 6-ost 9-essé teszi, a tükrözés a 2-est, 3-ast, 7-est felismerhetetlenné – ezek a címkét is elrontják."
        }
      ]
    },

    /* ------------------------------------------------ 10.8 */
    "ai10-108": {
      title: "Kvíz – 10.8 A tanítás gyakorlata",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy 1000 osztályos képosztályozó tanítása előtt mekkora kiinduló veszteséget vársz?",
          options: ["6,908", "3", "9,966", "0,001"],
          answer: 0,
          hint: "Egyenletes tippnél a helyes osztály valószínűsége 1/1000.",
          explain: R`$\ln 1000 \approx 6{,}908$. A 3 a 10-es, a 9,966 a 2-es alapú logaritmus, a 0,001 maga a valószínűség.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 2 milliárd paraméteres modellt Adammal, 32 bites számokkal tanítasz. Kb. mennyi memória kell a modellállapothoz (súly, gradiens, optimalizáló), köztes értékek nélkül?",
          options: ["32 GB", "8 GB", "24 GB", "16 GB"],
          answer: 0,
          hint: "Súly + gradiens + az Adam két mozgó átlaga, mindegyik 4 bájt.",
          explain: R`$2\cdot 10^9 \cdot 16$ bájt = 32 GB. A 8 GB csak a súlyok, a 24 GB kihagyja a gradienst (ez egy rendszerkönyv hibája is), a 16 GB csak súly + gradiens.`
        },
        {
          type: "single", shuffle: true,
          q: "8 GPU, mindegyik 16 képet dolgoz fel, és a gradienseiket átlagolják. Mekkora a tényleges kötegméret?",
          options: ["128", "16", "8", "2"],
          answer: 0,
          hint: "Az átlagolt gradiens melyik köteg gradiensével egyezik meg?",
          explain: "Az átlagolt gradiens pontosan egy 8 · 16 = 128-as köteg gradiense (adatpárhuzamosítás). A tanulási rátát ehhez kell igazítani."
        },
        {
          type: "set",
          q: "Melyik a véletlen forrása egy dropoutos neurális háló tanításában?",
          items: ["a kezdő súlyok", "a kötegek sorrendje", "a dropout-maszkok", "a tanulási ráta értéke", "egyes GPU-műveletek összeadási sorrendje", "a rétegek száma"],
          answer: ["a kezdő súlyok", "a kötegek sorrendje", "a dropout-maszkok", "egyes GPU-műveletek összeadási sorrendje"],
          hint: "Mi az, ami két futás között a mag változtatásával (vagy a hardver miatt) változhat?",
          explain: "A kezdés, a keverés, a dropout és egyes nem determinisztikus GPU-műveletek futásonként változhatnak. A tanulási ráta és a rétegszám rögzített hiperparaméter."
        },
        {
          type: "single", shuffle: true,
          q: "Egy-egy futásból: A modell 97,3%, B modell 96,8%. Ugyanennek a modellnek a futásai között a szórás 0,7 százalékpont. Mit mondhatsz?",
          options: ["Ebből nem dönthető el – több futás kell mindkettőből.", "Az A jobb.", "A B jobb, mert stabilabb.", "Egyformák, mert ugyanaz a kód."],
          answer: 0,
          hint: "Mekkora a különbség a futások közti ingadozáshoz képest?",
          explain: "A 0,5 pontos különbség kisebb, mint egyetlen modell futásainak szórása. Több maggal kell futtatni, és az átlagokat (a standard hibájukkal) összevetni."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai10-final": {
      title: "Fejezetzáró teszt – A háló tanítása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A helyes osztály valószínűsége 0,5. Mennyi a keresztentrópia-veszteség?`,
          options: ["0,693", "0,301", "1", "0,5"],
          answer: 0,
          hint: R`$-\ln\hat p$.`,
          explain: R`$-\ln 0{,}5 = \ln 2 \approx 0{,}693$. A 0,301 a 10-es, az 1 a 2-es alapú logaritmus, a 0,5 maga a valószínűség.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 10.3 hálójában ($\mathbf x = (1;\ 2)$, a rejtett $\boldsymbol\delta_1 = (-0{,}5;\ 0{,}5)$) mennyi $W_1$ bal felső súlyának gradiense (első neuron, első bemenet)?`,
          options: ["−0,5", "−1", "0,5", "−0,25"],
          answer: 0,
          hint: R`„Bemenet × $\delta$”: melyik neuron $\delta$-ja, és melyik bemenet?`,
          explain: R`Az első neuron $\delta$-ja $-0{,}5$, az első bemenet 1: $-0{,}5$. A $-1$ a második bemenettel (2) számol – az a jobb felső elem; a $0{,}5$ a második neuroné; a $-0{,}25$ felcseréli a szorzást osztásra.`
        },
        {
          type: "single", shuffle: true,
          q: "60 000 tanítókép, 100-as kötegek. Hány lépés egy epoch?",
          options: ["600", "60 000", "100", "6000"],
          answer: 0,
          hint: R`Egy epoch $\lceil n/B\rceil$ lépés.`,
          explain: "60 000 / 100 = 600. A 60 000 a mintánkénti SGD, a 100 a kötegméret, a 6000 tízszeres elszámolás."
        },
        {
          type: "single", shuffle: true,
          q: R`Momentum $\beta = 0{,}99$-cel. Hányszorosára nőhet a lépés tartósan egyirányú gradiensnél?`,
          options: ["100", "10", "1,99", "0,99"],
          answer: 0,
          hint: R`$1/(1 - \beta)$.`,
          explain: R`$1/(1 - 0{,}99) = 100$. A 10 a $\beta = 0{,}9$-hez tartozik, az 1,99 csak a második lépés, a 0,99 maga a $\beta$.`
        },
        {
          type: "multi",
          q: "A tanító veszteség folyamatosan csökken, a validációs a 20. epoch óta nő. Mi segíthet?",
          options: ["korai leállítás", "súlycsökkentés (L2 / AdamW)", "dropout", "a tanulási ráta tízszerezése", "jóval nagyobb háló, regularizáció nélkül", "adatbővítés"],
          answer: [0, 1, 2, 5],
          hint: "Ez túlillesztés. Melyik eszköz javítja az általánosítást?",
          explain: "Túlillesztés ellen: korai leállítás, súlycsökkentés, dropout, adatbővítés (és több adat). A tízszeres tanulási ráta szétzilálhatja a tanítást, a még nagyobb, regularizálatlan háló pedig még jobban magol."
        },
        {
          type: "single", shuffle: true,
          q: R`Fordított dropout $p = 0{,}2$-vel. Mennyivel szorozzuk tanításkor a megmaradt neuronok kimenetét?`,
          options: ["1,25", "0,8", "1,2", "5"],
          answer: 0,
          hint: R`$1/(1 - p)$.`,
          explain: R`$1/0{,}8 = 1{,}25$, így a várható érték változatlan. A 0,8 a megtartás valószínűsége (az eredeti cikkben kiértékeléskor ezzel szoroztak), az 1,2 az $1 + p$, az 5 az $1/p$.`
        },
        {
          type: "match",
          q: "Párosítsd a tünetet az ellenszerével!",
          pairs: [
            ["cikcakk egy hosszúkás völgyben", "momentum"],
            ["a jel rétegről rétegre elhal egy mély ReLU-hálóban", "He-kezdés, normalizálás"],
            ["a gradiens néha felrobban (NaN)", "gradiensvágás, kisebb tanulási ráta"],
            ["a validációs veszteség nő, a tanító csökken", "dropout, súlycsökkentés, korai leállítás"]
          ],
          hint: "Minden tünet egy-egy szakasz fő problémája volt: optimalizálás, kezdés, stabilitás, általánosítás.",
          explain: "Cikcakk: a momentum a váltakozó irányt kioltja. Elhaló jel: jól skálázott kezdés (He), normalizálás. Robbanás: vágás és kisebb lépés. Túlillesztés: regularizáció."
        },
        {
          type: "single", shuffle: true,
          q: R`Számítási gráf: $f = (a\cdot b) + c$, $a = 2$, $b = -3$, $c = 1$. Mennyi $\partial f/\partial a$?`,
          options: ["−3", "2", "1", "−5"],
          answer: 0,
          hint: "Az összeadás továbbad, a szorzás felcserél.",
          explain: R`Az összeadás 1-et ad a szorzásnak, az a másik bemenet értékével szoroz: $\partial f/\partial a = b = -3$. A 2 maga az $a$ (az $\partial f/\partial b$), az 1 a $\partial f/\partial c$, a $-5$ az $f$ értéke.`
        },
        {
          type: "single", shuffle: true,
          q: "Valaki Adammal tanít, és a loss-hoz adott L2-büntetés erősségét (λ) százszorosára növeli, de a súlyok alig lesznek kisebbek. Mi a magyarázat?",
          options: [
            "Az Adam a büntetés gradiensét is a gradiens tipikus nagyságával skálázza – súlycsökkentéshez AdamW kell.",
            "A λ túl kicsi volt, még tovább kell növelni.",
            "Az L2-büntetés csak a torzításokra hat.",
            "Az Adam nem számol gradienst a büntetőtagra."
          ],
          answer: 0,
          hint: R`Mit csinál az Adam a $g + \lambda w$ összeggel, mielőtt lépne?`,
          explain: R`Az Adam $\hat m/\sqrt{\hat v}$-vel lép, így a $\lambda w$ tag nagysága nagyrészt kiesik a skálázásban. Az AdamW a súlycsökkentést ettől függetlenül végzi: $w \leftarrow (1 - \eta\lambda)w$.`
        },
        {
          type: "single", shuffle: true,
          q: "Saját visszaterjesztésed egy súlyra −0,50-et ad, a numerikus gradiensellenőrzés +0,50-et. Mi a legvalószínűbb hiba?",
          options: [
            R`Előjelhiba (pl. $y - \hat y$ a $\hat y - y$ helyett).`,
            R`Kimaradt egy $\varphi'$ szorzó.`,
            R`Túl kicsi az $\varepsilon$.`,
            "Túl nagy a tanulási ráta."
          ],
          answer: 0,
          hint: "A nagyság stimmel, csak az irány nem.",
          explain: R`Azonos nagyság, ellentétes előjel: valahol megfordult az előjel. Egy kimaradt $\varphi'$ a nagyságot változtatná meg, az $\varepsilon$ csak kis eltérést okoz, a tanulási ráta pedig a gradiens kiszámolását nem befolyásolja.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
