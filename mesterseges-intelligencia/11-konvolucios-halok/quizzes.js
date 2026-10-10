/* =========================================================
   Mesterséges intelligencia 11. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 11.1 */
    "ai11-111": {
      title: "Kvíz – 11.1 A kép mint számtábla",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány számból áll egy $32 \times 32$-es színes (RGB) kép?`,
          options: ["3072", "1024", "96", "32 768"],
          answer: 0,
          hint: "Szorozd össze a magasságot, a szélességet és a csatornák számát.",
          explain: R`$32 \cdot 32 \cdot 3 = 3072$. Az 1024 a csatornákat felejti el, a 96 a $32 \cdot 3$, a 32 768 pedig $32^3$ – mintha a harmadik méret is 32 lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $64 \times 64$-es színes képre 100 neuronos teljesen összekötött réteget teszel. Hány paramétere van a rétegnek a torzításokkal együtt?`,
          options: ["1 228 900", "1 228 800", "409 700", "12 388"],
          answer: 0,
          hint: "Minden neuron minden bemeneti számhoz kapcsolódik; plusz neuronként egy torzítás.",
          explain: R`$64 \cdot 64 \cdot 3 = 12\,288$ bemenet, $\times 100 = 1\,228\,800$ súly, $+100$ torzítás $= 1\,228\,900$. Az 1 228 800 a torzításokat hagyja ki, a 409 700 a csatornákat, a 12 388 összead szorzás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy MLP-t olyan képeken tanítasz és tesztelsz, amelyeknek a pixeleit egy rögzített, véletlen sorrendbe kevertük. Mi történik a pontosságával?",
          options: [
            "Lényegében ugyanannyi marad, mint az eredeti képeken.",
            "Véletlen szintre (10%) esik, hiszen a képek olvashatatlanok.",
            "Jelentősen javul, mert a keverés adatbővítés.",
            "Csak akkor marad ugyanannyi, ha a tesztképeket nem keverjük."
          ],
          answer: 0,
          hint: "Tudja-e az MLP, melyik bemenete melyik pixel szomszédja?",
          explain: "Az MLP-nek a bemenetek sorrendje közömbös: a keverés csak átszámozza őket (a 16 × 16-os lapon 97,2% mindkét esetben). Embernek olvashatatlan, a hálónak ugyanaz a feladat. Ha a tesztképeket nem keverjük, az viszont más képet adna – a keverésnek mindenhol azonosnak kell lennie."
        },
        {
          type: "single", shuffle: true,
          q: "Miért esik az MLP pontossága 96,9%-ról 44,7%-ra, ha a tesztképet egy pixellel eltoljuk?",
          options: [
            "Mert minden súlya egy rögzített pixelhez tartozik, és az eltolt tinta olyan pixelekre esik, amelyeken tanításkor nem látott ilyet.",
            "Mert az eltolás miatt a kép egy része lelóg a lapról.",
            "Mert az eltolás megváltoztatja a pixelek fényességét.",
            "Mert az MLP túl kevés rejtett neuront használ; 100 neuronnal nem lenne esés."
          ],
          answer: 0,
          hint: "Mi köt egy MLP-súlyt a képhez?",
          explain: "A 16 × 16-os lapon a számjegy egy pixel eltolás után is teljesen a lapon van, a fényességek sem változnak. A baj az, hogy az MLP minden helyen külön tanul: az új helyen lévő tintára más súlyok felelnek. Több neuron ezen nem segít, csak eltolt tanítóképek (és azokból is sok kell)."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`PyTorch-ban egy kötegnyi színes kép alakja $B \times C \times H \times W$.`,
            "A háló belső rétegeinek „csatornái” már nem színek, hanem jellemzők.",
            "Az MLP feltételezi, hogy a pixelek függetlenek egymástól.",
            "Egy képfelismerőtől elvárjuk, hogy ugyanazt a mintát a kép bármely pontján felismerje.",
            "Ha a képet kétszer akkorára nagyítjuk, az MLP első rétegének súlyszáma is kétszeresére nő."
          ],
          answer: [0, 1, 3],
          hint: "Gondold végig: mitől függ az első réteg súlyszáma? És mit nem tud előre az MLP – vagy mit nem tud egyáltalán?",
          explain: R`A PyTorch $B \times C \times H \times W$ sorrendet használ; a belső csatornák szűrők kimenetei; az eltolástűrés alapkövetelmény. Az MLP nem tételez fel függetlenséget – bármilyen összefüggést megtanulhat, csak a pixelek sorrendjét nem ismeri. Kétszeres oldalhossz négyszeres pixelszámot és súlyszámot ad.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány különböző helyre eshet egy $3 \times 3$-as minta egy $16 \times 16$-os lapon, ha teljesen a lapon belül kell lennie?`,
          options: ["196", "256", "169", "48"],
          answer: 0,
          hint: R`Egy irányban hány kiinduló helye lehet a minta bal szélének? $n - k + 1$.`,
          explain: R`$(16 - 3 + 1)^2 = 14^2 = 196$. A 256 a pixelek száma (a minta lelógna), a 169 = $13^2$ eggyel kevesebbet számol, a 48 = $16 \cdot 3$ nem területet számol. Az MLP-nek mind a 196 helyen külön kellene megtanulnia a mintát.`
        }
      ]
    },

    /* ------------------------------------------------ 11.2 */
    "ai11-112": {
      title: "Kvíz – 11.2 A konvolúció",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 11.2 „T” képén ($5 \times 5$; felső sor csupa 1, középső oszlop csupa 1, a többi 0) a függőleges élkereső szűrő minden sora $(-1, 0, 1)$. Mennyi a kimenet 2. sorának 1. eleme (vagyis az ablak a kép 2–4. sora, 1–3. oszlopa)?`,
          options: ["3", "2", "−3", "0"],
          answer: 0,
          hint: "Az ablak minden sorában: jobb szélső mínusz bal szélső.",
          explain: R`Az ablak sorai $(0,0,1)$ háromszor: soronként $-0 + 1 = 1$, összesen $3$. A 2 a legfelső kimeneti sor értéke (ott a T teteje „belezavar”), a $-3$ a szár jobb széléé (3. oszlop), a 0 a középső oszlopé.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a kimenet: $32 \times 32$-es kép, $5 \times 5$-ös szűrő, kitöltés $p = 2$, lépésköz $s = 1$?`,
          options: [R`$32 \times 32$`, R`$28 \times 28$`, R`$30 \times 30$`, R`$16 \times 16$`],
          answer: 0,
          hint: R`$\lfloor (n + 2p - k)/s \rfloor + 1$.`,
          explain: R`$(32 + 4 - 5) + 1 = 32$ – a $p = (k-1)/2$ kitöltés megtartja a méretet. A 28 a kitöltést hagyja ki, a 30 csak egy oldalra számol kitöltést, a 16 a lépésközt veszi 2-nek.`
        },
        {
          type: "single", shuffle: true,
          q: R`$8 \times 8$-as kép, $3 \times 3$-as szűrő, $p = 0$, $s = 2$. Mekkora a kimenet?`,
          options: [R`$3 \times 3$`, R`$3{,}5 \times 3{,}5$`, R`$4 \times 4$`, R`$6 \times 6$`],
          answer: 0,
          hint: "A képlet után kerekíteni kell – de melyik irányba?",
          explain: R`$\lfloor (8 - 3)/2 \rfloor + 1 = \lfloor 2{,}5 \rfloor + 1 = 3$. Fél mező nincs; felfelé kerekítve (4) a szűrő lelógna, a 6 a lépésközt felejti el.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit számolnak a mélytanulási könyvtárak (PyTorch, TensorFlow) „konvolúció” néven?",
          options: [
            "Keresztkorrelációt: a szűrőt tükrözés nélkül csúsztatják.",
            "Matematikai konvolúciót: a szűrőt előbb 180°-kal elforgatják.",
            "A kép Fourier-transzformáltjának és a szűrőnek a szorzatát.",
            "A szűrő és az ablak elemenkénti szorzatainak átlagát, torzítás nélkül."
          ],
          answer: 0,
          hint: "Kell-e tükrözni a szűrőt, ha úgyis a háló tanulja meg a számait?",
          explain: "Tükrözés nélkül számolnak – ez matematikailag keresztkorreláció. Tanult szűrőnél mindegy (a háló a tükörképet tanulná meg). A szorzatokat összeadják, nem átlagolják, és a torzítás is hozzáadódik."
        },
        {
          type: "match",
          q: "Párosítsd a 3 × 3-as szűrőt a hatásával!",
          pairs: [
            ["minden sora (−1, 0, 1)", "függőleges éleket keres"],
            ["felső sora (1, 1, 1), alsó sora (−1, −1, −1)", "vízszintes éleket keres"],
            ["minden eleme 1/9", "elmossa a képet"],
            ["közepe 5, négy szomszédja −1, sarkai 0", "élesíti a képet"]
          ],
          hint: "Mit csinál a szűrő egy egyenletes foltban, és mit egy éles váltásnál?",
          explain: "A „jobb mínusz bal” szűrő a vízszintes irányú változásra (függőleges élre) érzékeny, a „fent mínusz lent” a vízszintes élre. Az 1/9-es az ablak átlaga (elmosás). Az 5/−1-es a középső pixelt kiemeli a szomszédokhoz képest (élesítés; összege 1, így egyenletes foltban nem változtat)."
        },
        {
          type: "single", shuffle: true,
          q: R`A „csíkkereső” szűrő minden sora $(-1, 1, -1)$. Mekkora a kimenete egy teljesen tintás (csupa 1) $3 \times 3$-as ablakon?`,
          options: ["−3", "3", "0", "−9"],
          answer: 0,
          hint: "Add össze a szűrő összes elemét.",
          explain: R`Csupa 1-en a kimenet a szűrőelemek összege: $3 \cdot (-1 + 1 - 1) = -3$. A 3 a tökéletes csík (csak a középső oszlop tintás), a 0 az üres ablak, a $-9$ mintha minden elem $-1$ lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora kitöltés tartja meg a méretet egy $7 \times 7$-es szűrőnél, $s = 1$ mellett?`,
          options: ["3", "7", "6", "1"],
          answer: 0,
          hint: R`$n + 2p - k + 1 = n$.`,
          explain: R`$2p = k - 1 = 6$, így $p = 3$ oldalanként. A 6 a két oldal együtt, a 7 a szűrő mérete, az 1 a $3 \times 3$-as szűrőhöz kellene.`
        }
      ]
    },

    /* ------------------------------------------------ 11.3 */
    "ai11-113": {
      title: "Kvíz – 11.3 A konvolúciós háló felépítése",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy konvolúciós réteg bemenete 64 csatornás, 128 darab $3 \times 3$-as szűrője van. Hány paramétere van?`,
          options: ["73 856", "73 728", "1 280", "8 320"],
          answer: 0,
          hint: R`$C_{\text{ki}} \cdot (k \cdot k \cdot C_{\text{be}} + 1)$.`,
          explain: R`$128 \cdot (3 \cdot 3 \cdot 64 + 1) = 128 \cdot 577 = 73\,856$. A 73 728 a torzításokat hagyja ki, az 1 280 elfelejti, hogy a szűrő mind a 64 csatornán átér, a 8 320 egy $1 \times 1$-es konvolúcióé lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $32 \times 32 \times 3$-as bemenetre 10 darab $5 \times 5$-ös szűrő megy, kitöltés nélkül. Mi a kimenet alakja?`,
          options: [R`$28 \times 28 \times 10$`, R`$28 \times 28 \times 3$`, R`$28 \times 28 \times 30$`, R`$32 \times 32 \times 10$`],
          answer: 0,
          hint: "A kimenet csatornáinak száma = a szűrők száma. A térbeli méret: n − k + 1.",
          explain: R`$32 - 5 + 1 = 28$, és 10 szűrő → 10 csatorna. Minden szűrő mind a 3 bemeneti csatornán átér és összead, ezért nem lesz 30 (vagy 3) csatorna; kitöltés nélkül a méret sem marad 32.`
        },
        {
          type: "single", shuffle: true,
          q: R`$2 \times 2$-es max-pooling (lépésköz 2) a $\begin{pmatrix}2&0&1&4\\3&1&0&2\\0&0&5&1\\6&2&3&3\end{pmatrix}$ térképen. Mennyi a kimenet jobb alsó eleme?`,
          options: ["5", "3", "6", "12"],
          answer: 0,
          hint: "A jobb alsó ablak a 3–4. sor és a 3–4. oszlop.",
          explain: R`Az ablak $\{5, 1, 3, 3\}$, a maximuma 5. A 3 az átlagoló pooling eredménye ($12/4$), a 12 az összeg, a 6 a bal alsó ablak maximuma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a recepciós mező a következő sor végén: konv. $3 \times 3$ → max-pooling $2 \times 2$ (lépésköz 2) → konv. $3 \times 3$?`,
          options: ["8", "7", "5", "6"],
          answer: 0,
          hint: R`$r \leftarrow r + (k - 1)\,j$, és a pooling után $j = 2$.`,
          explain: R`$r$: $1 \to 3$ (konv.) $\to 4$ (pooling, $j$ = 2) $\to 4 + 2 \cdot 2 = 8$. A 7 három $3 \times 3$-as réteg (lépésköz nélkül), az 5 a pooling nélküli két réteg; a 6 a második konvolúciónál $j = 1$-gyel számol.`
        },
        {
          type: "match",
          q: "Párosítsd a műveletet az eltoláshoz való viszonyával!",
          pairs: [
            ["konvolúció (lépésköz 1)", "ekvivariáns: a térkép a mintával együtt mozog"],
            ["globális maximum", "invariáns: nem függ a minta helyétől"],
            ["lapítás + teljesen összekötött réteg", "helyfüggő: minden helynek saját súlya van"],
            ["2 × 2-es max-pooling, lépésköz 2", "csak páros eltolásokra pontos (átlapolás)"]
          ],
          hint: "Mi történik a kimenettel, ha a bemenetet egy pixellel eltolod?",
          explain: "A konvolúció ugyanazzal a szűrővel dolgozik minden helyen, ezért a térkép eltolódik (ekvivariancia). A globális maximum nem nézi a helyet (invariancia). A lapítás után az MLP-szerű réteg megint helyhez köti a súlyokat. A 2-es lépésközű pooling kétpixelenként „mintavételez”: páros eltolás után ugyanazok a pixelek kerülnek egy ablakba, páratlan után nem (CNN-B: 98,4% vs. 79,8%)."
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "A konvolúciós réteg paraméterszáma nem függ a kép méretétől.",
            "Két konvolúciós réteg között ReLU nélkül a kettő együtt egyetlen konvolúció lenne.",
            "A pooling-réteg súlyait is a gradiens módszer tanulja.",
            "A konvolúciós háló a végén lapítással és teljesen összekötött réteggel is pontosan eltolás-invariáns.",
            "A globális pooling a háló végén sokkal kevesebb paramétert igényel, mint a lapítás."
          ],
          answer: [0, 1, 4],
          hint: "Mi függ a képmérettől, mi lineáris, és hol kerül vissza a helyfüggés?",
          explain: "A szűrők mérete nem függ a képtől; két lineáris konvolúció egymás után egy (nagyobb) konvolúció; a globális pooling csatornánként egy számot ad, így a fej kicsi. A poolingnak nincs paramétere. A lapítás + teljesen összekötött réteg pozíciónként tanul – a háló így nem invariáns."
        }
      ]
    },

    /* ------------------------------------------------ 11.4 */
    "ai11-114": {
      title: "Kvíz – 11.4 Híres architektúrák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy kép helyes osztálya a „sziámi macska”. A háló öt tippje sorrendben: perzsa macska, sziámi macska, tigris, hiúz, puma. Hogyan számít ez a top-1 és a top-5 hibánál?",
          options: [
            "Top-1 szerint hiba, top-5 szerint találat.",
            "Mindkettő szerint találat.",
            "Mindkettő szerint hiba.",
            "Top-1 szerint találat, top-5 szerint hiba."
          ],
          answer: 0,
          hint: "A top-1 csak az első tippet nézi, a top-5 az első ötöt.",
          explain: "Az első tipp (perzsa) rossz – top-1 hiba. A helyes osztály a második tipp, tehát benne van az első ötben – top-5 találat. Az ImageNet-verseny híres számai (AlexNet 15,3%, ResNet 3,57%) top-5 hibák."
        },
        {
          type: "single", shuffle: true,
          q: R`Hány súlya (torzítás nélkül) van két egymás utáni $3 \times 3$-as rétegnek, ha mindkettő 128 csatornáról 128 csatornára képez?`,
          options: ["294 912", "409 600", "147 456", "2 304"],
          answer: 0,
          hint: R`Egy réteg: $k^2 \cdot C_{\text{be}} \cdot C_{\text{ki}}$. Kettő: a duplája.`,
          explain: R`$2 \cdot 9 \cdot 128^2 = 18 \cdot 16\,384 = 294\,912$. A 409 600 egy $5 \times 5$-ös rétegé ($25 \cdot 128^2$) – ugyanakkora recepciós mezővel, 39%-kal több súllyal. A 147 456 csak egy réteg, a 2 304 elfelejti a négyzetet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy maradékblokkban $x = 3$ és $F(x) = -0{,}5$. Mennyi a blokk kimenete?`,
          options: ["2,5", "−0,5", "3", "−1,5"],
          answer: 0,
          hint: R`$y = x + F(x)$.`,
          explain: R`$y = 3 + (-0{,}5) = 2{,}5$. A $-0{,}5$ a rövidzár nélküli blokk kimenete volna, a 3 azt feltételezi, hogy $F$ semmit sem tesz hozzá, a $-1{,}5$ szoroz összeadás helyett.`
        },
        {
          type: "multi",
          q: "Melyik igaz a ResNetre és a degradációra?",
          options: [
            "A degradáció azt jelenti, hogy a mélyebb sima háló tanító hibája is nagyobb.",
            "A degradáció a túlillesztés egy fajtája, ezért dropouttal kezelhető.",
            R`A maradékblokk könnyen megtanulhatja az identitást: elég, ha $F = 0$.`,
            "A rövidzáron a gradiens csillapítás nélkül jut vissza a korábbi rétegekhez.",
            "A ResNet-50-nek több paramétere van, mint a VGG-16-nak, mert háromszor annyi rétege van."
          ],
          answer: [0, 2, 3],
          hint: "Túlillesztésnél melyik hiba kicsi? És hol van a VGG-16 paramétereinek többsége?",
          explain: R`A degradációnál a tanító hiba is nő – ez optimalizálási, nem túlillesztési gond. $\mathbf y = \mathbf x + F(\mathbf x)$: $F = 0$ az identitás, és $\partial\mathbf y/\partial\mathbf x = I + \partial F/\partial\mathbf x$. A ResNet-50 25,6 millió, a VGG-16 138 millió paraméter: a VGG paramétereinek 89%-a a teljesen összekötött rétegekben van.`
        },
        {
          type: "single", shuffle: true,
          q: R`A LeNet-5 C5 rétege 120 darab $5 \times 5$-ös szűrő egy 16 csatornás bemeneten. Hány paramétere van?`,
          options: ["48 120", "48 000", "3 120", "1 936"],
          answer: 0,
          hint: R`$C_{\text{ki}} \cdot (k^2 C_{\text{be}} + 1)$.`,
          explain: R`$120 \cdot (25 \cdot 16 + 1) = 120 \cdot 401 = 48\,120$. A 48 000 a torzításokat hagyja ki, a 3 120 = $120 \cdot 26$ egy csatornával számol, az 1 936 = $16 \cdot 121$ felcseréli a bemeneti és kimeneti oldalt.`
        },
        {
          type: "single", shuffle: true,
          q: R`A VGG-16 utolsó poolingja $7 \times 7 \times 512$-es tömböt ad, ezt lapítja, és egy 4096 neuronos rétegbe vezeti. Hány paramétere van ennek a rétegnek?`,
          options: ["102 764 544", "102 760 448", "2 101 248", "25 088"],
          answer: 0,
          hint: R`Bemenetek: $7 \cdot 7 \cdot 512$. Súlyok + torzítások.`,
          explain: R`$25\,088 \cdot 4096 + 4096 = 102\,764\,544$ – a háló paramétereinek kb. 74%-a. A 102 760 448 a torzítások nélkül, a 2 101 248 globális pooling után (512 bemenet) lenne, a 25 088 csak a bemenetek száma.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi volt az AlexNet (2012) legfontosabb eredménye?",
          options: [
            "Az ImageNet-versenyen 15,3%-os top-5 hibát ért el a második helyezett 26,2%-ával szemben, és ezzel elindította a mélytanulás térnyerését.",
            "Ez volt az első konvolúciós háló, amelyet visszaterjesztéssel tanítottak.",
            "Ez vezette be a maradékkapcsolatot, amellyel 152 réteget lehetett tanítani.",
            "Kizárólag 3 × 3-as szűrőkből állt, és ezzel megmutatta, hogy a mélység fontosabb a szűrőméretnél."
          ],
          answer: 0,
          hint: "Melyik év, melyik verseny? A többi állítás más hálókra igaz.",
          explain: "Az AlexNet a 2012-es ImageNet-versenyt nagy fölénnyel nyerte (ReLU, dropout, adatbővítés, GPU). Az első visszaterjesztéssel tanított CNN LeCun 1989-es hálója, a maradékkapcsolat a ResNeté (2015), a csak 3 × 3-as szűrők a VGG-é (2014)."
        }
      ]
    },

    /* ------------------------------------------------ 11.5 */
    "ai11-115": {
      title: "Kvíz – 11.5 Transzfertanulás és finomhangolás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy ResNet-18 törzse 512 számot ad. Befagyasztod, és 10 osztályos új fejet teszel rá. Hány paraméter tanul?",
          options: ["5 130", "5 120", "522", "kb. 11,7 millió"],
          answer: 0,
          hint: "Csak az új, teljesen összekötött fej tanul: súlyok + torzítások.",
          explain: R`$512 \cdot 10 + 10 = 5130$. Az 5120 a torzításokat hagyja ki, az 522 összead szorzás helyett, a 11,7 millió az egész ResNet-18 – de a törzs be van fagyasztva.`
        },
        {
          type: "single", shuffle: true,
          q: "300 fotód van öt kutyafajtáról. Melyik a legjobb kiindulás?",
          options: [
            "ImageNeten előtanított háló befagyasztott törzse, új 5 kimenetes fej (jellemzőkinyerés).",
            "Egy mély CNN nulláról, sok epochon át.",
            "Egy ViT nulláról, erős adatbővítéssel.",
            "Előtanított háló, az egészet nagy tanulási rátával továbbtanítva."
          ],
          answer: 0,
          hint: "Kevés adat, és a feladat hasonlít az előtanításéhoz (az ImageNetben sok a kutya).",
          explain: "Kevés adatnál, hasonló feladatnál a jellemzőkinyerés a biztos kezdés; utána jöhet óvatos finomhangolás kis tanulási rátával. 300 képből nulláról egy mély háló (főleg ViT) bemagolna; a nagy tanulási ráta pedig elrontaná az előtanított jellemzőket."
        },
        {
          type: "single", shuffle: true,
          q: "A PDL kísérletében egy járműveken előtanított háló macska–kutya feladaton melyik beállítással lett a legjobb (1000 tanítókép)?",
          options: [
            "Az alsó két konvolúciós réteg befagyasztva, a többi tanul (70,1%).",
            "Minden réteg befagyasztva, csak a fej tanul (57,0%).",
            "Minden réteg tanul (62,7%).",
            "Nulláról tanítva (61–64%)."
          ],
          answer: 0,
          hint: "Melyik rétegek tudása általános, és melyiké járműspecifikus?",
          explain: "Az alsó rétegek élei, textúrái macskán és autón is hasznosak – ezeket érdemes megtartani. A felső rétegek járműrészleteket keresnek; ezeknek alkalmazkodniuk kell. Minden réteget tanítani 1000 képen kockázatos (nagy szórás), mindent befagyasztani pedig túl merev."
        },
        {
          type: "multi",
          q: "Melyik igaz a finomhangolásra?",
          options: [
            "Kisebb tanulási rátával szokás, mint a nulláról tanítást.",
            "Előbb gyakran csak az új fejet tanítjuk, aztán felolvasztjuk a felső rétegeket.",
            "Az előtanított háló bemeneti előkészítését (méret, normalizálás) meg kell tartani.",
            "Finomhangolásnál már nincs szükség validációs halmazra.",
            "A transzfertanulás orvosi képeken mindig sokkal jobb a nulláról tanításnál."
          ],
          answer: [0, 1, 2],
          hint: "Mi rontja el az előtanított jellemzőket? És mi a helyzet a túlillesztéssel?",
          explain: "Kis tanulási ráta és fokozatos felolvasztás védi az előtanított jellemzőket; az előkészítésnek egyeznie kell az előtanításéval. Kevés adatnál a finomhangolás is túlilleszthet – validáció és korai leállítás kell. Orvosi képeken a nulláról tanított kis háló néha ugyanolyan jó (Raghu és társai, 2019) – mindig érdemes összevetni."
        },
        {
          type: "single", shuffle: true,
          q: "Honnan jön a „címke” egy kontrasztív önfelügyelt előtanításnál?",
          options: [
            "Magukból a képekből: ugyanannak a képnek két bővített változata legyen közel, különböző képeké távol.",
            "Emberi címkézőktől, akik minden képhez osztályt rendelnek.",
            "Egy másik, már betanított osztályozó jóslataiból.",
            "A képek fájlnevéből és mappájából."
          ],
          answer: 0,
          hint: "Az önfelügyelt tanulás lényege, hogy nem kell emberi címke.",
          explain: "A kontrasztív tanulás a „ugyanaz a kép-e?” feladatot oldja meg – a választ a bővítés adja, emberi munka nélkül. Egy másik modell jóslataiból tanulni desztilláció; a fájlnév vagy mappa gyenge, emberi eredetű címke."
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a stratégiával!",
          pairs: [
            ["kevés kép, a feladat hasonlít az ImageNethez", "jellemzőkinyerés: befagyasztott törzs, új fej"],
            ["sok kép, a feladat hasonlít az ImageNethez", "az egész háló finomhangolása kis tanulási rátával"],
            ["kevés kép, a feladat nagyon eltér (pl. röntgen)", "az alsó rétegek fagyasztva, a felsők óvatosan finomhangolva"],
            ["rengeteg címkézetlen kép, kevés címkézett", "önfelügyelt előtanítás, aztán finomhangolás"]
          ],
          hint: "Két kérdés: mennyi a (címkézett) adat, és mennyire hasonlít a feladat az előtanításéhoz?",
          explain: "Kevés adat + hasonló feladat: elég a fej. Sok adat: az egész háló hangolható. Eltérő feladatnál a felső (specifikus) rétegeknek alkalmazkodniuk kell, az alsók (élek, textúrák) maradhatnak. Ha sok a címkézetlen adat, abból önfelügyelten lehet előtanítani."
        }
      ]
    },

    /* ------------------------------------------------ 11.6 */
    "ai11-116": {
      title: "Kvíz – 11.6 Feladattípusok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Valódi téglalap $(0;0)$–$(4;4)$, jóslat $(1;0)$–$(5;4)$. Mennyi az IoU?`,
          options: ["0,6", "0,75", "0,375", "0,25"],
          answer: 0,
          hint: "Metszet osztva az egyesítéssel; az egyesítésnél a metszetet csak egyszer számold.",
          explain: R`Metszet $3 \cdot 4 = 12$, unió $16 + 16 - 12 = 20$: $\mathrm{IoU} = 0{,}6$. A 0,75 a Dice ($24/32$), a 0,375 a metszetet nem vonja le az unióból ($12/32$), a 0,25 egy $2 \times 2$-es metszettel számol.`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a kimenetével!",
          pairs: [
            ["osztályozás", "egy valószínűség-eloszlás az osztályokra"],
            ["objektumdetektálás", "téglalap + osztály + pontszám minden objektumra"],
            ["szemantikus szegmentálás", "minden pixelre egy osztály"],
            ["példányszegmentálás", "minden objektumra külön maszk"]
          ],
          hint: "Mi van a képen? Hol? Mely pixeleken? Melyik pixel melyik példányé?",
          explain: "Az osztályozás az egész képhez rendel címkét, a detektálás objektumonként téglalapot, a szemantikus szegmentálás pixelenként osztályt (a két ember egy folt), a példányszegmentálás objektumonként külön maszkot."
        },
        {
          type: "single", shuffle: true,
          q: "Egy 20 egység széles képen a téglalap vízszintesen x = 3-tól 9-ig tart. Hol lesz a kép vízszintes tükrözése után?",
          options: ["11-től 17-ig", "3-tól 9-ig", "9-től 3-ig", "17-től 11-ig, előjelet váltva"],
          answer: 0,
          hint: "Tükrözésnél x helyébe W − x kerül, és a két szél szerepet cserél.",
          explain: R`$20 - 9 = 11$ és $20 - 3 = 17$. Ha csak a képet tükrözzük, a téglalapot nem (3–9), a háló rossz helyen tanulja a tárgyat. A szélek felcserélődnek, de a téglalap bal széle marad a kisebb szám.`
        },
        {
          type: "set",
          q: "Melyik adatbővítés címketartó egy kézzel írt számjegyeket felismerő hálónál?",
          items: ["kis eltolás", "kis forgatás (±10°)", "a vonalak enyhe vastagítása", "vízszintes tükrözés", "180°-os forgatás", "függőleges tükrözés"],
          answer: ["kis eltolás", "kis forgatás (±10°)", "a vonalak enyhe vastagítása"],
          hint: "Melyik átalakítás után marad a 2-es 2-es, a 6-os 6-os?",
          explain: "Az eltolás, a kis forgatás és a vastagítás a kézírás természetes változatai. A tükrözött 2-es nem számjegy, a 180°-kal elforgatott 6-os 9-es lesz, a függőlegesen tükrözött 7-es sem 7-es."
        },
        {
          type: "single", shuffle: true,
          q: "A detektor ugyanarra az autóra két téglalapot ad (0,9 és 0,8 pontszámmal), az IoU-juk 0,6. Mit csinál a nem-maximum elfojtás (NMS) 0,5-ös küszöbbel?",
          options: [
            "Megtartja a 0,9-eset, a 0,8-ast eldobja.",
            "Mindkettőt megtartja, mert két különböző pontszámuk van.",
            "Mindkettőt eldobja, mert átfedik egymást.",
            "A kettő átlagát adja vissza egyetlen téglalapként."
          ],
          answer: 0,
          hint: "A legerősebb jóslat marad; ami vele túlságosan átfed, az valószínűleg ugyanaz a tárgy.",
          explain: "Az NMS a legnagyobb pontszámú téglalapot tartja meg, és eldobja azokat, amelyeknek az IoU-ja vele a küszöb fölött van (0,6 > 0,5). Az átlagolás egy másik (ritkább) eljárás, nem az NMS."
        },
        {
          type: "single", shuffle: true,
          q: "Egy szegmentáló háló 98%-os pixelpontosságot ér el, de a képek 98%-a háttér. Mit mondhatsz?",
          options: [
            "Semmit, amíg nem nézzük meg az objektumosztály IoU-ját vagy Dice-értékét.",
            "Kiváló, hiszen a pixelek 98%-át jól osztályozza.",
            "Biztosan rossz, mert a pontosság nem lehet ennyi.",
            "Túlillesztett, mert a pontosság túl magas."
          ],
          answer: 0,
          hint: "Mennyi a „mindenhol háttér” válasz pontossága?",
          explain: "A „mindenhol háttér” válasz is 98%-os – a szám nem mondja meg, megtalálja-e a háló az objektumot. A ritka osztályra számolt IoU vagy Dice ezt méri (ugyanaz a csapda, mint a 6.1 pontossága)."
        }
      ]
    },

    /* ------------------------------------------------ 11.7 */
    "ai11-117": {
      title: "Kvíz – 11.7 Vision Transformer",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány tokent kap a Transformer egy $224 \times 224$-es képből $16 \times 16$-os foltokkal, a [CLS] tokennel együtt?`,
          options: ["197", "196", "15", "257"],
          answer: 0,
          hint: R`$(224/16)^2$ folt, plusz egy.`,
          explain: R`$14 \cdot 14 = 196$ folt, $+1$ [CLS] $= 197$. A 196 a [CLS]-t felejti el, a 15 csak egy irányban számol, a 257 a $P = 14$-es foltozásé.`
        },
        {
          type: "single", shuffle: true,
          q: "A foltméretet felére csökkented (16 → 8), a kép marad. Hányszorosára nő kb. az önfigyelem figyelmi párjainak száma?",
          options: ["16-szorosára", "4-szeresére", "2-szeresére", "nem változik"],
          answer: 0,
          hint: R`Hányszor több folt lesz? És a párok száma a tokenszám négyzetével nő.`,
          explain: R`Fele akkora folt → egy irányban kétszer, összesen négyszer annyi folt; a párok száma ennek a négyzetével nő: kb. 16-szoros ($785^2 = 616\,225$ vs. $197^2 = 38\,809$). A 4-szeres a tokenszám növekedése, nem a pároké.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért gyengébb a ViT a hasonló méretű ResNetnél, ha csak az ImageNeten (1,3 millió kép) tanítják?",
          options: [
            "Mert gyengébb az induktív torzítása: a lokalitást és az eltolástűrést adatból kell megtanulnia.",
            "Mert a figyelem nem tud kis részletekre figyelni.",
            "Mert a ViT-nek kevesebb paramétere van, mint a ResNetnek.",
            "Mert a ViT nem használ visszaterjesztést."
          ],
          answer: 0,
          hint: "Mit kap a CNN „ingyen” a felépítéséből, amit a ViT nem?",
          explain: "A CNN szűrői eleve helyiek és mindenhol ugyanazok; a ViT-nek ezt tanulnia kell – ehhez több adat (vagy erős bővítés, desztilláció) kell. A figyelem megtanulhat helyi lenni, a ViT-B nem kisebb a ResNet-50-nél, és ugyanúgy visszaterjesztéssel tanul."
        },
        {
          type: "multi",
          q: "Melyik igaz a Vision Transformerre?",
          options: [
            R`A foltbeágyazás felírható egy $P \times P$-s, $P$ lépésközű konvolúcióként.`,
            "Pozícióbeágyazás nélkül a háló nem tudná, melyik folt hol volt a képen.",
            "Az önfigyelem a tokenek sorrendjére érzékeny, ezért nincs szükség pozícióra.",
            "Nagyon sok előtanító képpel jobb lehet a CNN-eknél.",
            "Kis adathalmazon nulláról tanítva általában jobb a CNN-nél."
          ],
          answer: [0, 1, 3],
          hint: "Gondold végig: mit „lát” a figyelem, ha összekeverjük a tokeneket?",
          explain: "A „minden foltra ugyanaz a lineáris réteg” pontosan egy nem átfedő konvolúció. A figyelem a sorrendre érzéketlen, ezért kell pozíció. Sok adattal (pl. 300 millió kép) a ViT jobb; kevés adaton nulláról a CNN szokott nyerni."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik sorrend helyes a képi induktív torzítás erőssége szerint (erősebbtől a gyengébbig)?",
          options: ["CNN, ViT, MLP", "ViT, CNN, MLP", "MLP, CNN, ViT", "CNN, MLP, ViT"],
          answer: 0,
          hint: "Melyik épít be lokalitást és súlymegosztást? Melyik tud legalább foltokról? Melyiknek közömbös még a pixelek sorrendje is?",
          explain: "A CNN a lokalitást és az eltolás-ekvivarianciát is beépíti; a ViT csak a foltozást (a foltokon belüli szerkezetet); az MLP semmit – még a pixelek sorrendje is közömbös neki."
        }
      ]
    },

    /* ------------------------------------------------ 11.8 */
    "ai11-118": {
      title: "Kvíz – 11.8 A gépi látás társadalmi oldala",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy arckereső összevetésenként $10^{-5}$ eséllyel ad hamis egyezést. Hány hamis találatot vársz egyetlen kereséskor egy 2 milliós adatbázisban?`,
          options: ["20", "2", "200", "0,00002"],
          answer: 0,
          hint: R`1:N keresés: $N \cdot q$.`,
          explain: R`$2\,000\,000 \cdot 10^{-5} = 20$. A 2 és a 200 egy nagyságrenddel elcsúszik, a 0,00002 egyetlen összevetés esélye – az 1:1 helyzeté.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy stadionban 50 000 néző közül 10 körözött. A rendszer a körözöttek 90%-át megtalálja, a többi néző 0,1%-ánál téved. Kb. mekkora eséllyel valódi egy riasztás?",
          options: ["kb. 15%", "kb. 90%", "kb. 99,9%", "kb. 50%"],
          answer: 0,
          hint: "Számold meg külön a valódi és a hamis riasztásokat.",
          explain: R`Valódi: $10 \cdot 0{,}9 = 9$; hamis: $49\,990 \cdot 0{,}001 \approx 50$. Egy riasztás $9/59 \approx 15\%$ eséllyel valódi. A 90% a felidézés, a 99,9% a negatívak helyes aránya – egyik sem azt mondja meg, mennyire bízhatunk egy riasztásban.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit vizsgált a Gender Shades tanulmány (Buolamwini – Gebru, 2018)?",
          options: [
            "Kereskedelmi rendszerek nemosztályozási hibáját bőrszín és nem szerinti csoportokban.",
            "Arcfelismerő rendszerek személyazonosítási pontosságát rendőrségi adatbázisokban.",
            "Hogy a CNN-ek a háttér alapján döntenek-e.",
            "Ellenséges támadásokat arcképek ellen."
          ],
          answer: 0,
          hint: "A mért feladat egy osztályozás volt, nem keresés.",
          explain: "Három rendszer nemosztályozását mérték kiegyensúlyozott tesztkészleten: a hibaarány világos bőrű férfiaknál legfeljebb 0,8%, sötét bőrű nőknél akár 34,7% volt. Nem személyazonosítás (ezt a NIST 2019-es jelentése vizsgálta), nem rövidítés és nem támadás."
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "A rövidítés az, amikor a háló egy, a tanítóadaton véletlenül a címkével együtt járó mellékjelet tanul meg.",
            "Egy ellenséges példa zaját a veszteség bemenet szerinti gradiense alapján számolják.",
            "Ha a tesztpontosság magas, a háló biztosan a „jó okból” dönt.",
            "Egy átlagos hibaarány elfedheti, hogy egy kis csoportnál sokszoros a hiba.",
            "Az ellenséges példák csak digitálisan működnek, a fizikai világban nem."
          ],
          answer: [0, 1, 3],
          hint: "Honnan jön a tesztkészlet? És mit mutatott a STOP-tábla-kísérlet?",
          explain: "A rövidítés (hó a farkasoknál, jelölő a röntgenen) a teszten is működik, ha a teszt ugyanonnan jön – ezért a magas pontosság nem bizonyít. Az ellenséges zaj a bemenet szerinti gradiensből jön. Kis csoport nagy hibája az átlagban alig látszik. Fizikai támadás is van: néhány matrica egy STOP-táblán."
        },
        {
          type: "single", shuffle: true,
          q: "Mit tilt 2025 februárjától az EU mesterségesintelligencia-rendelete (AI Act) a gépi látás területén?",
          options: [
            "Többek között az arcképek célzatlan lementését arcadatbázis építéséhez és az érzelemfelismerést munkahelyen, oktatásban.",
            "Minden arcfelismerést, a telefonok arcfeloldását is.",
            "A konvolúciós hálók használatát nyilvános helyeken.",
            "Semmit; a rendelet csak ajánlásokat tartalmaz."
          ],
          answer: 0,
          hint: "A rendelet kockázat szerint szabályoz: néhány gyakorlatot tilt, sokat szigorú feltételekhez köt.",
          explain: "A tiltott gyakorlatok között van a célzatlan arckép-lementés, az érzelemfelismerés munkahelyen és oktatásban, a biometrikus kategorizálás érzékeny tulajdonságokra és – szűk kivételekkel – a valós idejű távoli biometrikus azonosítás bűnüldözési célra nyilvános helyen. Az 1:1 telefonfeloldás nem tilos; a technológia (CNN) maga sem."
        },
        {
          type: "single", shuffle: true,
          q: "Egy tüdőgyulladás-felismerő CNN a saját kórháza röntgenképein kiváló, egy másik kórházéin sokkal gyengébb. Mi a legvalószínűbb ok a fejezet alapján?",
          options: [
            "Rövidítés és eloszlás-eltolódás: a háló kórházra jellemző jeleket (jelölők, géptípus) is megtanult.",
            "A másik kórház betegei egészségesebbek, ezért nehezebb a feladat.",
            "Túl kevés volt a rétegek száma.",
            "A konvolúció nem működik szürkeárnyalatos képeken."
          ],
          answer: 0,
          hint: "Zech és társai (2018) vizsgálata.",
          explain: "A háló a felvétel módjából és a kórházjelölőkből is „tanult”, amelyek a saját kórházban együtt jártak a betegséggel. Más kórházban ezek mások – a teljesítmény esik. Több kórházból gyűjtött tanító- és csoportosan vágott tesztadat segít."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai11-final": {
      title: "Fejezetzáró teszt – 11. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy konvolúciós réteg 16 csatornás bemenetre 32 darab $5 \times 5$-ös szűrőt használ. Hány paramétere van?`,
          options: ["12 832", "12 800", "832", "12 816"],
          answer: 0,
          hint: R`$C_{\text{ki}}(k^2 C_{\text{be}} + 1)$.`,
          explain: R`$32 \cdot (25 \cdot 16 + 1) = 32 \cdot 401 = 12\,832$. A 12 800 a torzítások nélkül, a 832 = $32 \cdot 26$ egy bemeneti csatornával, a 12 816 = $16 \cdot (25 \cdot 32 + 1)$ felcserélt be- és kimenettel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a kimenet: $100 \times 100$-as bemenet, $4 \times 4$-es ablak, lépésköz 3, kitöltés nincs?`,
          options: [R`$33 \times 33$`, R`$32 \times 32$`, R`$34 \times 34$`, R`$97 \times 97$`],
          answer: 0,
          hint: R`$\lfloor (n + 2p - k)/s \rfloor + 1$.`,
          explain: R`$(100 - 4)/3 + 1 = 32 + 1 = 33$. A 32 elfelejti a $+1$-et, a 34 eggyel túlszámol (mintha a szűrő a szélen túl is léphetne), a 97 a lépésközt hagyja ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a recepciós mező: három $3 \times 3$-as konvolúció, utána $2 \times 2$-es pooling (lépésköz 2), utána még egy $3 \times 3$-as konvolúció?`,
          options: ["12", "9", "11", "8"],
          answer: 0,
          hint: R`$r \leftarrow r + (k - 1)\,j$, $j \leftarrow j \cdot s$; a pooling is egy ablak ($k = 2$).`,
          explain: R`$r$: $3 \to 5 \to 7$; a pooling: $7 + 1 \cdot 1 = 8$, $j = 2$; az utolsó konvolúció: $8 + 2 \cdot 2 = 12$. A 9 négy lépésköz nélküli $3 \times 3$-as réteg, a 11 a pooling saját $+1$-ét hagyja ki, a 8 az utolsó konvolúció előtt áll meg.`
        },
        {
          type: "single", shuffle: true,
          q: "A CNN-A (két konvolúció + globális maximum) minden 1–2 pixeles eltolásnál ugyanannyi képet ismer fel (98,9%). Mi az oka?",
          options: [
            "A konvolúció ekvivariáns, a globális maximum invariáns: a 32 jellemző nem függ a minta helyétől.",
            "Eltolt képekkel is tanították.",
            "Kevesebb paramétere van, mint az MLP-nek, ezért nem illeszt túl.",
            "A max-pooling minden eltolást kiegyenlít."
          ],
          answer: 0,
          hint: "Mi történik a térképekkel és a maximumukkal, ha a számjegy elmozdul?",
          explain: "A térképek a számjeggyel együtt mozognak, a maximumuk ugyanaz marad – a fej ugyanazt a 32 számot kapja. A CNN-A csak középre tett képeket látott, és nincs benne max-pooling (a pooling épp rontaná a páratlan eltolásokat). A kevesebb paraméter nem magyarázza az eltolástűrést."
        },
        {
          type: "single", shuffle: true,
          q: "A CNN-B (az első konvolúció után 2 × 2-es max-pooling) 2 pixeles eltolásnál 98,4%-os, 1 pixelesnél 79,8%-os. Mi segít a legegyszerűbben?",
          options: [
            "Eltolt tanítóképekkel tanítani (adatbővítés).",
            "A pooling-ablak növelése 4 × 4-re.",
            "Több teljesen összekötött réteg a háló végére.",
            "A tanulási ráta csökkentése."
          ],
          answer: 0,
          hint: "A felépítés nem garantálja a páratlan eltolások tűrését – honnan tanulhatná meg mégis?",
          explain: "Eltolásos bővítéssel ugyanez a háló 98,2%-ot ér el 1 pixelnél. Nagyobb pooling-ablak más eltolásokra hozna átlapolást, a teljesen összekötött rétegek még helyfüggőbbé tennék, a tanulási ráta nem érinti a problémát."
        },
        {
          type: "multi",
          q: "Melyik igaz a nevezetes architektúrákra?",
          options: [
            "A LeNet-5-ben konvolúció és összevonás váltakozik, kb. 60 000 paraméterrel.",
            "A VGG két 3 × 3-as rétege ugyanakkora recepciós mezőt ad, mint egy 5 × 5-ös, kevesebb súllyal.",
            "Az AlexNet paramétereinek többsége a konvolúciós rétegekben van.",
            "A ResNet maradékblokkja a bemenethez adja a rétegek kimenetét.",
            "A VGG nyerte a 2014-es ImageNet-verseny osztályozási feladatát."
          ],
          answer: [0, 1, 3],
          hint: "Hol vannak az AlexNet és a VGG paraméterei? Ki nyert 2014-ben?",
          explain: R`A LeNet-5 váltakozó konvolúció–összevonás, kb. 60 000 paraméter; a két $3 \times 3$ $18C^2$ súly $25C^2$ helyett; a ResNet $\mathbf y = \mathbf x + F(\mathbf x)$. Az AlexNet paramétereinek 94%-a a teljesen összekötött rétegekben van; 2014-ben a GoogLeNet nyert osztályozásban, a VGG második lett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két téglalap: $(0;0)$–$(2;2)$ és $(1;1)$–$(3;3)$. Mennyi az IoU?`,
          options: ["1/7 ≈ 0,143", "1/4 = 0,25", "1/8 = 0,125", "1/2 = 0,5"],
          answer: 0,
          hint: "Metszet: egy 1 × 1-es négyzet. Unió: a két terület összege mínusz a metszet.",
          explain: R`Metszet 1, unió $4 + 4 - 1 = 7$: $1/7$. Az $1/4$ a metszet és az egyik téglalap aránya, az $1/8$ a metszetet nem vonja le, az $1/2$ csak az egyik irányú átfedést nézi.`
        },
        {
          type: "single", shuffle: true,
          q: "500 címkézett röntgenképed és egy ImageNeten előtanított ResNeted van. Mi a jó első lépés?",
          options: [
            "Befagyasztott törzs + új fej, ugyanazzal az előkészítéssel, mint az előtanításnál; aztán óvatos finomhangolás kis tanulási rátával.",
            "Egy ViT nulláról, mert a röntgen nagyon más, mint az ImageNet.",
            "Az egész háló finomhangolása nagy tanulási rátával, hogy gyorsan alkalmazkodjon.",
            "A képek tükrözése és 180°-os forgatása, hogy több adat legyen, aztán nulláról tanítás."
          ],
          answer: 0,
          hint: "Kevés adat; a nagy tanulási ráta elrontja az előtanítást; a bővítésnek címketartónak kell lennie.",
          explain: "Kevés adatnál az előtanított törzs a biztos kezdés, aztán óvatos finomhangolás (és mindig egy nulláról tanított összevetés). A ViT 500 képből nem tanul meg képi szerkezetet, a nagy tanulási ráta szétzilálja a jellemzőket, a röntgen tükrözése anatómiailag más képet ad."
        },
        {
          type: "single", shuffle: true,
          q: "100 000 ember között 20 körözöttet keresel. A rendszer a körözöttek 95%-át megtalálja, a többieknél 0,01% a hamis riasztás. Kb. mekkora eséllyel valódi egy riasztás?",
          options: ["kb. 66%", "kb. 95%", "kb. 99,99%", "kb. 20%"],
          answer: 0,
          hint: "Valódi riasztások: 20 · 0,95. Hamis riasztások: a nem körözöttek 0,01%-a.",
          explain: R`Valódi: 19; hamis: $99\,980 \cdot 0{,}0001 \approx 10$. Egy riasztás $19/29 \approx 66\%$ eséllyel valódi. A 95% a felidézés, a 99,99% a negatívak helyes aránya – a bázisarány miatt egyik sem a riasztás megbízhatósága.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a fejezet példájával!",
          pairs: [
            ["súlymegosztás", "egy 3 × 3-as szűrő a kép minden helyén ugyanazzal a 9 súllyal"],
            ["átlapolás", "a CNN-B 1 pixeles eltolásnál 79,8%-os"],
            ["degradáció", "az 56 rétegű sima háló tanító hibája nagyobb a 20 rétegűénél"],
            ["rövidítés", "a farkasfelismerő a havat nézi"]
          ],
          hint: "Melyik a felépítés, melyik a mérés, melyik a tanítás, melyik az adat jelensége?",
          explain: "A súlymegosztás a konvolúció lényege; az átlapolás a lépésközös pooling mellékhatása; a degradáció a mély sima hálók optimalizálási gondja (ResNet); a rövidítés az adatban véletlenül együtt járó mellékjel megtanulása."
        },
        {
          type: "single", shuffle: true,
          q: R`Hány tokent kap egy ViT egy $384 \times 384$-es képből $16 \times 16$-os foltokkal ([CLS] nélkül)?`,
          options: ["576", "196", "24", "1152"],
          answer: 0,
          hint: R`$(384/16)^2$.`,
          explain: R`$24^2 = 576$. A 196 a $224$-es képé, a 24 csak egy irány, az 1152 = $2 \cdot 576$ duplán számol.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik állítás a legpontosabb a konvolúciós hálók és az eltolás kapcsolatáról?",
          options: [
            "A konvolúció eltolás-ekvivariáns; a háló csak globális pooling mellett és lépésköz nélkül lesz (a szélektől eltekintve) invariáns – egyébként bővítés kell.",
            "Minden konvolúciós háló pontosan eltolás-invariáns, mert a szűrők mindenhol ugyanazok.",
            "A max-pooling teszi eltolás-invariánssá a hálót, a konvolúció nem számít.",
            "A konvolúciós hálók egyáltalán nem tűrik az eltolást, csak az adatbővítés miatt működnek."
          ],
          answer: 0,
          hint: "Ekvivariancia vs. invariancia; mit tesz a lépésköz és a lapítás?",
          explain: "A súlymegosztás ekvivarianciát ad; invarianciát a globális pooling hoz. A lépésközös pooling átlapolást okoz, a lapítás + teljesen összekötött réteg helyfüggővé tesz – ilyenkor a bővítés pótolja a hiányt. A CNN-A és a CNN-B mérése mindezt számokkal mutatta."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
