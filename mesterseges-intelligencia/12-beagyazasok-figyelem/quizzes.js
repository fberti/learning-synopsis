/* =========================================================
   Mesterséges intelligencia 12. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 12.1 */
    "ai12-121": {
      title: "Kvíz – 12.1 Szövegből számok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Tokenizáld kisbetűsítve, az írásjeleket külön tokenként: „A zene nem volt jó, de a vége nem volt rossz!” Hány token lesz, és ebből hány különböző?",
          options: ["13 token, 10 különböző", "13 token, 13 különböző", "11 token, 8 különböző", "13 token, 7 különböző"],
          answer: 0,
          hint: "Az írásjel is token. A különbözőknél minden szót csak egyszer számolj, akárhányszor fordul elő.",
          explain: R`a · zene · nem · volt · jó · , · de · a · vége · nem · volt · rossz · ! – ez 13 token. Az „a”, a „nem” és a „volt” kétszer szerepel, így $13 - 3 = 10$ különböző. A 13/13 az ismétlődéseket is külön számolja, a 11/8 kihagyja a vesszőt és a felkiáltójelet, a 7 csak az egyszer előforduló tokeneket számolja.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a tokenekre és a szótárra?",
          options: [
            "A sorszám csak címke: a 4-es token nem „kétszer annyi”, mint a 2-es.",
            "A kisbetűsítés nem dob el információt, csak kisebb lesz tőle a szótár.",
            "Egy kb. 32 000 tokenes részszó-szótárral milliónyi magyar szóalak leírható.",
            "A szótárat a tanító- és a tesztadat együtteséből érdemes építeni, hogy minden szót ismerjen.",
            "Ha a modell kisbetűsített szövegen tanult, használatkor is kisbetűsíteni kell."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj a buktatókra: mit „hisz el” a háló a nyers sorszámról, mi vész el kisbetűsítéskor, és mit nem szabad a tesztadatból kölcsönvenni?",
          explain: "A sorszám csak név – ezért nem adjuk mennyiségként a hálónak. A részszó-tokenizáló a gyakori töveket és toldalékokat külön darabként tárolja, ezekből bármelyik szóalak összerakható (háza|##imb|##an). Tanításkor és használatkor ugyanaz a tokenizáló kell. A kisbetűsítés viszont információt dob el (Alma cég vagy gyümölcs, mondat eleje), a szótárat pedig csak a tanítóadatból szabad építeni – különben a teszt szavai „beszivárognak”."
        },
        {
          type: "set",
          q: "Jelöld ki D2 = „a film nem volt jó” összes szópárját (bigramját)!",
          items: ["a film", "film nem", "nem volt", "volt jó", "jó volt", "nem jó", "a jó"],
          answer: ["a film", "film nem", "nem volt", "volt jó"],
          hint: "Szópár = két közvetlenül egymás után álló token, az eredeti sorrendben. Hány ilyen van egy 5 tokenes szövegben?",
          explain: R`Egy $m$ tokenes szövegben $m - 1 = 4$ szópár van: „a film”, „film nem”, „nem volt”, „volt jó”. A „jó volt” fordított sorrend (ez az állító kritikák szópárja – éppen ezért árulkodó a „volt jó”). A „nem jó” és az „a jó” nem szomszédos tokenekből áll: a szópár csak a közvetlen szomszédságot látja.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem tud egy szózsákra épülő lineáris modell egyszerre helyesen dönteni a „jó”, „nem jó”, „rossz”, „nem rossz” mondatokon?",
          options: [
            R`Mert a feltételekből $w_{\text{nem}} \lt 0$ és $w_{\text{nem}} > 0$ is következne – ez a XOR-probléma.`,
            "Mert a „nem” rajta van a tiltólistán, így a modell nem is látja.",
            "Mert négy mondat túl kevés tanítóadat a súlyok megtanulásához.",
            "Mert hiányzik a torzítás; egy torzítástaggal már megoldható lenne."
          ],
          answer: 0,
          hint: R`Írd fel a pontszámokat súlyok összegeként ($w_{\text{jó}}$, $w_{\text{jó}} + w_{\text{nem}}$, …), és nézd meg, milyen előjelű kellene legyen $w_{\text{nem}}$.`,
          explain: R`Kellene $w_{\text{jó}} > 0$ és $w_{\text{jó}} + w_{\text{nem}} \lt 0$, ebből $w_{\text{nem}} \lt 0$; és $w_{\text{rossz}} \lt 0$, $w_{\text{rossz}} + w_{\text{nem}} > 0$, ebből $w_{\text{nem}} > 0$. Ellentmondás: a „nem” megfordítja a másik szó hatását, ezt összeadással nem lehet leírni. A torzítás nem segít (mind a négy mondatban ugyanannyi), és több adat sem – a korlát a modell alakjában van. Ezért ért el a szózsák csak 51,2%-ot, a szópárokkal 93,5%-ot.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 12.1 négy kritikájának szózsákjával (szótár: a, film, jó, volt, nem, zene, unalmas, remek) mennyi D2 = „a film nem volt jó” és D4 = „a film remek” koszinusz-hasonlósága?`,
          options: ["0,516", "0,4", "0,133", "0,894"],
          answer: 0,
          hint: "Skaláris szorzat (a közös szavak száma) osztva a két vektor hosszának szorzatával. A hossz a négyzetösszeg gyöke.",
          explain: R`Közös szó: „a”, „film” → skaláris szorzat 2. A hosszak $\sqrt 5$ és $\sqrt 3$, így $\cos = \dfrac{2}{\sqrt{15}} \approx 0{,}516$. A 0,4 csak a hosszabb dokumentum tokenszámával (5) oszt, a 0,133 elfelejti a gyököt ($2/15$), a 0,894 pedig D1 és D2 hasonlósága.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy új dokumentum: „nem nem jó”. A négy kritika alapján $N = 4$, a „nem” df-je 1. Mennyi a „nem” TF-IDF-je ebben a dokumentumban ($\text{idf} = \ln(N/\text{df})$)?`,
          options: ["2,773", "1,386", "1,204", "8"],
          answer: 0,
          hint: "A tf azt számolja, hányszor szerepel a szó ebben a dokumentumban; az idf természetes alapú logaritmus.",
          explain: R`$\text{tf} = 2$, $\text{idf} = \ln 4 \approx 1{,}386$, a szorzat $\approx 2{,}773$. Az 1,386 elfelejti a tf-et, az 1,204 tízes alapú logaritmust használ ($2 \cdot \lg 4$), a 8 pedig kihagyja a logaritmust ($2 \cdot 4$).`
        },
        {
          type: "match",
          q: R`$N = 10$ dokumentum. Párosítsd a szót az idf-jével!`,
          pairs: [
            [R`10 dokumentumban szerepel, $\ln(N/\text{df})$`, "0"],
            [R`5 dokumentumban szerepel, $\ln(N/\text{df})$`, "0,693"],
            [R`1 dokumentumban szerepel, $\ln(N/\text{df})$`, "2,303"],
            [R`10 dokumentumban szerepel, scikit-learn: $\ln\frac{1+N}{1+\text{df}} + 1$`, "1"]
          ],
          hint: "Az ln 1, ln 2 és ln 10 értékét érdemes fejből tudni. A scikit-learn-féle képletben figyelj a +1-re a végén.",
          explain: R`$\ln(10/10) = \ln 1 = 0$; $\ln 2 \approx 0{,}693$; $\ln 10 \approx 2{,}303$. A scikit-learn változatában $\ln(11/11) + 1 = 1$: ott a mindenhol előforduló szó sem tűnik el. A változatok számai különböznek, a gondolat ugyanaz – ezért mindig írd le, melyiket használod.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a TF-IDF-re?",
          options: [
            "Az idf-et a tesztadatból újra ki kell számolni, hogy friss legyen.",
            "A TF-IDF is eldobja a sorrendet: a „jó volt, de unalmas” és az „unalmas volt, de jó” vektora azonos.",
            "Ha ln helyett tízes alapú logaritmust használsz, megváltoznak a koszinusz-hasonlóságok.",
            "Egy elgépelés (pl. „fimm”) nagyon ritka, ezért nagy súlyt kap.",
            "D1 és D2 koszinusza a szózsák 0,894-éről TF-IDF-fel kb. 0,502-re csökken."
          ],
          answer: [1, 3, 4],
          hint: "A TF-IDF csak átsúlyozza a szózsákot. Mit csinál a logaritmus alapjának cseréje a vektorokkal – és mit a koszinusz a nyújtással?",
          explain: "A TF-IDF is zsák, csak súlyozott. A ritka szó nagy súlyt kap, akkor is, ha elgépelés – ezért szokás az 1–2 dokumentumban előforduló tokeneket kidobni. D1 és D2 hasonlósága 0,894-ről 0,502-re esik, mert a közös, semmitmondó „a” és „volt” kevésbé, a megkülönböztető „nem” jobban számít. Az alapcsere minden idf-et ugyanazzal a számmal szorozza (lg x = ln x / ln 10), a koszinusz ezt nem érzi. Az idf-et a tanítóadatból számoljuk, és a tesztnél ugyanazt használjuk."
        }
      ]
    },

    /* ------------------------------------------------ 12.2 */
    "ai12-122": {
      title: "Kvíz – 12.2 Beágyazások",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$E = \begin{pmatrix}2 & 1\\ 0 & 3\\ -1 & 4\end{pmatrix}$. Mi lesz $(0, 1, 0)\,E$?`,
          options: [R`$(0;\ 3)$`, R`$(2;\ 1)$`, R`$(1;\ 8)$`, R`$(1;\ 3;\ 4)$`],
          answer: 0,
          hint: "A one-hot vektor minden sort 0-val szoroz, kivéve egyet. Melyiket?",
          explain: R`Az 1-es a második helyen áll, így a szorzat $E$ második sora: $(0;\ 3)$. A $(2;\ 1)$ az első sor, az $(1;\ 8)$ az összes sor összege (mintha csupa 1 lenne a vektor), az $(1;\ 3;\ 4)$ pedig a második <b>oszlop</b>. A one-hot szorzás tehát egy sor kikeresése – ezt teszi az <code>Embedding</code> réteg, szorzás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy beágyazási mátrixnak, ha a szótár $V = 30\,000$ token, és a vektorok $d = 256$ hosszúak?`,
          options: ["7 680 000", "30 256", "7 680 256", "900 000 000"],
          answer: 0,
          hint: "A mátrixnak minden tokenhez egy sora van, minden sorban d szám.",
          explain: R`$V \cdot d = 30\,000 \cdot 256 = 7\,680\,000$. A 30 256 összead szorzás helyett. A 7 680 256 torzítást is számol – a beágyazás csak sorkikeresés, nincs torzítása. A 900 000 000 = $V^2$ egy $V \times V$-s mátrix lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $(3;\ 4)$ és a $(4;\ 3)$ vektor koszinusz-hasonlósága?`,
          options: ["0,96", "24", "0,038", "1"],
          answer: 0,
          hint: "Skaláris szorzat osztva a két hossz szorzatával. Mindkét vektor hossza 5.",
          explain: R`$\dfrac{3 \cdot 4 + 4 \cdot 3}{5 \cdot 5} = \dfrac{24}{25} = 0{,}96$. A 24 a nyers skaláris szorzat (nincs normálva), a 0,038 a hossznégyzetekkel oszt ($24/625$), az 1 pedig azt hiszi, hogy az egyforma hossz egyforma irányt jelent – pedig a koszinusz éppen az irányt méri.`
        },
        {
          type: "single", shuffle: true,
          q: R`A GloVe-vektorokkal kiszámolod a <em>king − man + woman</em> vektort. Melyik szó van hozzá a legközelebb, ha a bemeneti szavakat <b>nem</b> zárod ki a válaszok közül?`,
          options: ["king", "queen", "woman", "man"],
          answer: 0,
          hint: "A híres analógiánál van egy apró „csalás”. Mi lehet az, amit ki szoktak zárni?",
          explain: "A <em>king</em> a legközelebbi (0,886); a <em>queen</em> (0,861) csak akkor nyer, ha a bemeneti szavakat kizárjuk. És sokszor így sem jön ki a várt szó (<em>lemon − yellow + green</em> → <em>ginger</em>). Ne a látványos, kiválasztott példákból ítéld meg a beágyazásokat."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a tanult beágyazásokra?",
          options: [
            "A tengelyeknek nincs nevük; csak az irányoknak és a távolságoknak van jelentése.",
            "A beágyazási mátrix paraméterszáma V + d.",
            "A „jó” és a „rossz” vektora közel kerülhet egymáshoz, mert hasonló környezetben fordulnak elő.",
            "A GloVe „bank” vektora a pénzügyi és a folyóparti jelentés egyenlő keveréke.",
            "A beágyazás a tanítószöveg torzításait is átveszi (pl. doctor − man + woman → nurse)."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj arra, miből tanul a beágyazás: csak abból, hogy melyik szó milyen környezetben áll – és milyen gyakran.",
          explain: "A tanult beágyazásban nincs „királyi” oszlop, csak irányok. Az ellentétek („a film ___ volt”) környezete hasonló, ezért a vektoruk is közel kerül (good–bad: 0,796). A szövegek torzításai is beépülnek. A paraméterszám V · d, nem V + d. A „bank” nem egyenlő keverék: a gyakoribb (pénzügyi) jelentés elnyomja a ritkábbat (bank–river csak 0,414, bank–money 0,636)."
        },
        {
          type: "single", shuffle: true,
          q: R`A hatmondatos együttes-előfordulási példához (macska, kutya, autó, busz sorok; tejet, vizet, iszik, egeret, labdát, kerget, benzint, fogyaszt oszlopok) hozzáadjuk: „a busz labdát kerget”. Mennyi ezután a macska és a busz sorának koszinusza?`,
          options: ["0,25", "0", "0,5", "1"],
          answer: 0,
          hint: "Írd fel az új busz-sort, és keresd meg a macskával közös oszlopokat. Mindkét sorban négy darab 1-es van.",
          explain: R`busz: labdát, kerget, benzint, fogyaszt → négy 1-es; macska: tejet, iszik, egeret, kerget. Közös csak a „kerget”: skaláris szorzat 1, a hosszak $2$ és $2$, így $\cos = 1/4 = 0{,}25$. A 0 a hozzáadás előtti érték, a 0,5 a kutya–busz koszinusza (ott a „labdát” is közös), az 1 a nyers skaláris szorzat. Egyetlen furcsa mondat is közelebb húzza a szavakat – a módszer csak a statisztikát látja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány skip-gram tanítópár (középső szó → szomszéd) keletkezik az „a kutya vizet iszik este” mondatból $\pm 2$-es ablakkal?`,
          options: ["14", "20", "8", "7"],
          answer: 0,
          hint: "Nem minden szónak van 4 szomszédja: a mondat szélén kevesebb fér az ablakba. Szavanként számold!",
          explain: R`A szomszédok száma szavanként: $2 + 3 + 4 + 3 + 2 = 14$. A 20 ($5 \cdot 4$) a széleket nem veszi figyelembe, a 8 a $\pm 1$-es ablak, a 7 a párokat irány nélkül számolja – pedig (kutya → vizet) és (vizet → kutya) két külön tanítópélda.`
        },
        {
          type: "match",
          q: "Párosítsd a módszert a leírásával!",
          pairs: [
            ["word2vec, skip-gram", "a szóból jósolja a környezetében álló szavakat"],
            ["word2vec, CBOW", "a környezetből jósolja a középső szót"],
            ["GloVe", "az együttes-előfordulási mátrixot bontja két kisebb mátrix szorzatára"],
            ["fastText", "a betű-n-gramok vektorainak összege, ismeretlen szóhoz is ad vektort"]
          ],
          hint: "A skip-gram és a CBOW egymás „fordítottja”. Melyik módszer foglalkozik a szavak belsejével, a betűkkel?",
          explain: "Mindegyik a disztribúciós hipotézisre épül: a hasonló környezetű szavak jelentése hasonló, és a címkét maga a szöveg adja (önfelügyelt tanulás). A skip-gram a középső szóból jósol, a CBOW a környezetből. A GloVe ugyanazt a gondolatot mátrixfaktorizációval valósítja meg (mint a 8.6 ízlés-vektorai). A fastText a betű-n-gramok miatt ragozott és ismeretlen alakhoz is tud vektort adni."
        }
      ]
    },

    /* ------------------------------------------------ 12.3 */
    "ai12-123": {
      title: "Kvíz – 12.3 Szekvenciák: rekurrens hálók",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az átlagolt beágyazás + MLP egy tagmondatos kritikákon 100%-ot ért el, a „de”-s kritikákon csak 51,2%-ot. Miért?",
          options: [
            "Mert a „jó volt, de unalmas” és az „unalmas volt, de jó” szavai ugyanazok, így az átlaguk is – a sorrend elvész.",
            "Mert az MLP lineáris, ezért a XOR-jellegű feladatot nem tudja megtanulni.",
            "Mert a „de”-s mondatok hosszabbak, és a nullákkal kitöltés elrontja az átlagot.",
            "Mert 8 dimenzió kevés ahhoz, hogy a „de” jelentését tárolja."
          ],
          answer: 0,
          hint: "Mi marad meg az átlagban a mondatból, és mi nem?",
          explain: "Az átlag a tartalmat megőrzi, a sorrendet nem: két ellentétes „de”-s kritika átlaga azonos, így a modell a párok egyik felét biztosan eltéveszti (51,2% ≈ pénzfeldobás). A tagadást viszont megtanulta – az MLP nemlineáris, a XOR nem gond neki. Az átlagolásnál nincs kitöltés, és a dimenzió sem számít: azonos bemenetből azonos kimenet lesz."
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a szekvenciás feladattípusával!",
          pairs: [
            ["Egy e-mailről eldönteni, hogy kéretlen-e", "sok → egy"],
            ["Egy mondat minden szavához megadni a szófaját", "sok → sok, elemenként"],
            ["Magyar mondatot angolra fordítani", "sorozatból sorozat"],
            ["Szöveget írni szóról szóra", "a következő elem jóslása"]
          ],
          hint: "Hány kimenet van, és ugyanannyi-e, mint a bemeneti tokenek száma?",
          explain: "A spamszűrés egy egész sorozatból egy címkét ad. A szófaj tokenenként egy címke. A fordítás más hosszú kimenetet ad (a 12.4 témája). A szöveggenerálás mindig a következő tokent jósolja (12.6)."
        },
        {
          type: "single", shuffle: true,
          q: R`Az egyszámos „memória”: $h_0 = 0$, $h_{\text{új}} = \tanh(0{,}5 \cdot h_{\text{régi}} + x)$, ahol jó $= +1$, unalmas $= -1$. Mennyi $h_2$ az „unalmas jó” kétszavas szövegre?`,
          options: ["0,5506", "0,2340", "0,6192", "−0,5506"],
          answer: 0,
          hint: R`Előbb $h_1 = \tanh(-1)$, aztán ennek a felét add hozzá a második szó értékéhez, és arra is alkalmazd a $\tanh$-ot.`,
          explain: R`$h_1 = \tanh(-1) = -0{,}7616$; $h_2 = \tanh(-0{,}3808 + 1) = \tanh(0{,}6192) = 0{,}5506$ – pozitív, a legutóbbi szó dönt. A 0,2340 elhagyja a 0,5-ös szorzót, a 0,6192 a második lépésben elfelejti a $\tanh$-ot, a $-0{,}5506$ a fordított sorrend („jó unalmas”) eredménye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy sima RNN-cellának, ha a beágyazás $d = 32$, a rejtett állapot $h = 64$ hosszú?`,
          options: ["6208", "6144", "2112", "62 080"],
          answer: 0,
          hint: R`Három tag: a bemenetből ($U$), az előző állapotból ($W$), és a torzítás.`,
          explain: R`$d \cdot h + h \cdot h + h = 2048 + 4096 + 64 = 6208$. A 6144 a torzítást hagyja ki, a 2112 a visszacsatoló $W$ mátrixot ($h \times h$) felejti el, a 62 080 egy 10 tokenes mondatra tízszer számolja – pedig a súlyok minden lépésben közösek, a paraméterszám nem függ a hossztól.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a sima RNN-re?",
          options: [
            R`Minden lépésben ugyanazt a $W$, $U$, $\mathbf b$ súlyt használja.`,
            "A lépések párhuzamosan számolhatók a GPU-n, mert a súlyok közösek.",
            "A tanítás memóriaigénye a sorozat hosszával nő.",
            "Az időbeli visszaterjesztésben minden időlépésnek saját súlymátrixa van.",
            "Ha a „nem” egy szóval arrébb kerül, a háló ugyanazokkal a súlyokkal dolgozza fel."
          ],
          answer: [0, 2, 4],
          hint: R`Mi kell $\mathbf h_t$ kiszámolásához? És mit kell megőrizni a visszaterjesztéshez?`,
          explain: R`A súlymegosztás időben történik, ezért a „nem” bármelyik helyen ugyanazt jelenti. A kiterített háló minden „rétege” ugyanazokat a súlyokat használja; a gradiensek lépésenként összeadódnak. Párhuzamosítani viszont nem lehet: $\mathbf h_t$-hez kell $\mathbf h_{t-1}$. A visszaterjesztéshez minden közbülső $\mathbf h_t$-t meg kell őrizni, így a memória a hosszal nő.`
        },
        {
          type: "single", shuffle: true,
          q: "Az időbeli visszaterjesztésben a gradiens lépésenként 1,2-vel szorzódik. Hányszorosára nő 10 lépés alatt?",
          options: ["kb. 6,19-szeresére", "12-szeresére", "3-szorosára", "kb. 0,107-szeresére"],
          answer: 0,
          hint: "A tényezők összeszorzódnak, nem összeadódnak.",
          explain: R`$1{,}2^{10} \approx 6{,}19$ – robbanó gradiens. A 12 ($1{,}2 \cdot 10$) és a 3 ($1 + 0{,}2 \cdot 10$) lineáris növekedést feltételez, a 0,107 pedig a csökkenő eset ($0{,}8^{10}$). Egy kis eltérés 1-től sok lépés után óriási különbség; robbanás ellen gradiensvágás, eltűnés ellen LSTM kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy LSTM-cellának, ha $d = 32$ és $h = 64$?`,
          options: ["24 832", "6208", "18 624", "24 576"],
          answer: 0,
          hint: R`Az LSTM négy, a sima RNN-cellával azonos alakú réteget tartalmaz: három kaput és a jelölt $\mathbf g$-t.`,
          explain: R`$4 \cdot (d h + h^2 + h) = 4 \cdot 6208 = 24\,832$. A 6208 a sima RNN, a 18 624 a háromszoros (a GRU mérete, $\tfrac34$ annyi), a 24 576 a torzításokat hagyja ki.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az LSTM-re?",
          options: [
            R`A cellaállapot mentén $\partial \mathbf c_t / \partial \mathbf c_{t-1} = \mathbf f_t$, így $\mathbf f_t \approx 1$ mellett a gradiens sok lépésen át megmarad.`,
            "Az LSTM-et nem kell kiteríteni időben, ezért elkerüli az időbeli visszaterjesztést.",
            "Az LSTM a robbanó gradienst is megoldja, gradiensvágás nem kell hozzá.",
            R`Ha $\mathbf f_t = 1$ és $\mathbf i_t = 0$, a cellaállapot változatlanul megy tovább.`,
            "A tagadás-kísérletben 20 töltelékszónál is 99,9%-ot ért el, míg a sima RNN a 10 tanításból csak kettőben tanulta meg a feladatot."
          ],
          answer: [0, 3, 4],
          hint: R`Nézd meg a $\mathbf c_t = \mathbf f_t \odot \mathbf c_{t-1} + \mathbf i_t \odot \mathbf g_t$ képletet. Mit enyhít az összeadásos frissítés, és mit nem?`,
          explain: R`A cellaállapot „egyenes út”: nincs rajta $\tanh$ és $W$-szorzás, csak a felejtőkapu – mint a maradékkapcsolatnál. $\mathbf f = 1$, $\mathbf i = 0$ mellett $\mathbf c_t = \mathbf c_{t-1}$. A kísérletben az LSTM minden távolságon 99,9–100%-ot hozott. Az LSTM-et viszont ugyanúgy időbeli visszaterjesztéssel tanítjuk (a <em>Deep Learning – A Visual Approach</em> itt pontatlan), és csak az eltűnést enyhíti – a robbanásra gradiensvágás kell.`
        }
      ]
    },

    /* ------------------------------------------------ 12.4 */
    "ai12-124": {
      title: "Kvíz – 12.4 A figyelemmechanizmus",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Mit lát a forrásmondatból a dekódoló egy figyelem nélküli kódoló–dekódolóban?",
          options: [
            "Csak a kódoló utolsó rejtett állapotát, a kontextusvektort.",
            "A kódoló összes rejtett állapotát, forrásszavanként egyet.",
            "A forrásmondat tokenjeinek beágyazásait.",
            "A kódoló első rejtett állapotát, mert a mondat eleje a legfontosabb."
          ],
          answer: 0,
          hint: "Hol ér véget a kódoló munkája, és mit ad át?",
          explain: "A kódoló végigolvassa a mondatot, és csak az utolsó állapotát adja át: egy rögzített hosszú vektort, bármilyen hosszú a mondat. Ez a szűk keresztmetszet. Az összes állapotot csak a figyelmes változat adja át."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a (figyelem nélküli) kódoló–dekódolóra?",
          options: [
            "Tanításkor a dekódoló a helyes előző szót kapja, nem a saját tippjét (tanári vezetés).",
            "A kontextusvektor hossza a forrásmondat hosszával együtt nő.",
            "A szűk keresztmetszet a tárolás gondja – az LSTM ezen nem segít.",
            "Elég nagy állapotvektorral a szűk keresztmetszet végleg megszűnik.",
            "Bahdanau és társai mérésében figyelemmel 17,8 helyett 26,8 BLEU-pontot ért el ugyanaz a háló."
          ],
          answer: [0, 2, 4],
          hint: "Különböztesd meg a „hosszú távú függés” két gondját: a tanításét és a tárolásét.",
          explain: "A tanári vezetés miatt egy rossz tipp nem rontja el a mondat többi részének tanítását. A kontextusvektor rögzített hosszú – „mindig jöhet hosszabb mondat”, ezért a nagyobb állapot csak kitolja a határt. Az LSTM a tanítás gondján (eltűnő gradiens) segít, a tárolásén nem. A figyelem 17,8-ról 26,8 BLEU-ra javított, főleg a hosszú mondatokon."
        },
        {
          type: "single", shuffle: true,
          q: R`Kulcs–érték párok: $\mathbf k_1 = (2;\ 0) \to 10$, $\mathbf k_2 = (0;\ 2) \to 20$, $\mathbf k_3 = (1;\ 1) \to 30$. Mennyi a figyelem kimenete (skaláris szorzat + softmax), ha $\mathbf q = (0;\ 2)$?`,
          options: ["21,01", "23,33", "140", "7,00"],
          answer: 0,
          hint: "Pontszámok skaláris szorzattal, súlyok softmax-szal (e-ad, majd normálás), végül az értékek súlyozott átlaga.",
          explain: R`Pontszámok: $0;\ 4;\ 2$. Softmax: $\dfrac{(1;\ 54{,}60;\ 7{,}389)}{62{,}99} = (0{,}016;\ 0{,}867;\ 0{,}117)$. Kimenet: $0{,}16 + 17{,}34 + 3{,}52 \approx 21{,}01$. A 23,33 a pontszámokat softmax nélkül normálja ($0, 4, 2$ osztva 6-tal), a 140 egyáltalán nem normál ($4 \cdot 20 + 2 \cdot 30$), a 7,00 a softmax után még 3-mal is oszt – pedig a súlyok összege már 1.`
        },
        {
          type: "match",
          q: "A festékboltos hasonlatban: párosítsd a figyelem fogalmát a megfelelőjével!",
          pairs: [
            ["lekérdezés", "a kérésed: „világossárga, egy kis sötét naranccsal”"],
            ["kulcs", "a dobozok címkéje"],
            ["érték", "a dobozban lévő festék"],
            ["figyelmi súly", "mennyi festék kerül a vödrödbe az adott dobozból"]
          ],
          hint: "A lekérdezés kérdez, a kulcs címke, az érték tartalom.",
          explain: "Az eladó a kérésedet (lekérdezés) a címkékkel (kulcsok) veti össze, és annál több festéket (érték) önt egy dobozból, minél jobban illik a címke – ez a súly. Az „Egy kis kékség” 10%-a mutatja a buktatót: a súly a címkéből jön, akármi van a dobozban."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a softmax-os figyelmi súlyokra?",
          options: [
            "Mind pozitívak, és lekérdezésenként az összegük 1.",
            "Ha minden pontszámhoz 5-öt adsz, a súlyok élesebbek lesznek.",
            "Ha minden pontszámot megszorzol 5-tel, a súlyok élesebbek lesznek.",
            "Egy kulcsra (oszlopra) eső súlyok összege is mindig 1.",
            "Egyik súly sem lesz pontosan 0, minden érték „szivárog” egy kicsit a válaszba."
          ],
          answer: [0, 2, 4],
          hint: "A softmax a pontszámok különbségeire érzékeny. Mi történik a különbségekkel eltoláskor, és mi nyújtáskor?",
          explain: "A softmax eltolásra érzéketlen (+5 után ugyanazok a súlyok), nyújtásra viszont nőnek a különbségek, és a keresés „keményebb” lesz. A súlyok soronként (lekérdezésenként) adnak 1-et; egy kulcsra több lekérdezés is figyelhet erősen, vagy egy sem. Az e-ad sosem 0, ezért pontosan 0 súly sincs."
        },
        {
          type: "set",
          q: "A három érték 10, 20 és 30. Mely számok jöhetnek ki a figyelem kimeneteként, ha a pontszámok tetszőleges valós számok lehetnek?",
          items: ["10", "10,5", "20", "29,9", "35", "60"],
          answer: ["10,5", "20", "29,9"],
          hint: "A kimenet az értékek súlyozott átlaga pozitív, 1 összegű súlyokkal. Lehet-e egy súly pontosan 0?",
          explain: R`A kimenet mindig a legkisebb és a legnagyobb érték <b>közé</b> esik, így a 35 és a 60 (az összeg) kizárt. Pontosan 10 vagy 30 sem lehet, mert a softmax sosem ad 0 súlyt – csak tetszőlegesen megközelítheti. A 20 egyenlő pontszámoknál jön ki, a 10,5 például a $(0;\ -100;\ -3{,}66)$, a 29,9 a $(0;\ -100;\ 5{,}29)$ pontszámokkal.`
        },
        {
          type: "single", shuffle: true,
          q: "A keresztfigyelemben (figyelmes kódoló–dekódoló) honnan jön a lekérdezés, és honnan a kulcs és az érték?",
          options: [
            "Lekérdezés: a dekódolóból (a célmondat felől); kulcs és érték: a kódolóból (a forrásmondat felől).",
            "Lekérdezés: a kódolóból; kulcs és érték: a dekódolóból.",
            "Lekérdezés és kulcs: a kódolóból; érték: a dekódolóból.",
            "Mindhárom a dekódolóból, a már leírt célszavakból."
          ],
          answer: 0,
          hint: "Ki „kérdez” minden lépésben: az, aki éppen ír, vagy az, akit olvasnak?",
          explain: R`A dekódoló aktuális állapota kérdez („mit írok most?”), a kódoló forrásszavankénti állapotai a kulcsok és az értékek: $\mathbf c_i = \sum_j a_{ij}\,\mathbf h_j$. A fordított irány gyakori elírás (a <em>Deep Learning – A Visual Approach</em> egy helyen így írja). Ha mindhárom a dekódolóból jön, az önfigyelem, nem keresztfigyelem.`
        },
        {
          type: "single", shuffle: true,
          q: "A forrásmondat 7 token, a fordítás 9 token. Hány figyelmi súlyt számol a dekódoló a teljes fordítás alatt (egy fejben, egy rétegben)?",
          options: ["63", "16", "49", "81"],
          answer: 0,
          hint: "Minden célszónál minden forrástokenre jut egy súly.",
          explain: R`Az illesztési mátrix $9 \times 7$-es: lépésenként 7 súly (egy softmax-sor), 9 lépésen át $9 \cdot 7 = 63$. A 16 összead, a 49 és a 81 csak az egyik mondat hosszát veszi (négyzetre emelve) – az az önfigyelem mérete lenne.`
        }
      ]
    },

    /* ------------------------------------------------ 12.5 */
    "ai12-125": {
      title: "Kvíz – 12.5 Önfigyelem",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az A mondat: fa $= (2;\ 0)$, levél $= (1;\ 1)$, hullik $= (1;\ 0)$; $W_Q = W_K = W_V$ = egységmátrix, $d = 2$. Mennyi a „hullik” súlysora (a fára, a levélre, a hullikra)?`,
          options: [R`$(0{,}503;\ 0{,}248;\ 0{,}248)$`, R`$(0{,}576;\ 0{,}212;\ 0{,}212)$`, R`$(0{,}407;\ 0{,}150;\ 0{,}150)$`, R`$(0{,}164;\ 0{,}198;\ 0{,}248)$`],
          answer: 0,
          hint: R`Pontszám skaláris szorzattal, osztás $\sqrt 2$-vel, aztán softmax – a „hullik” a lekérdező, tehát az ő sorát keresed.`,
          explain: R`Pontszámok: hullik·fa $= 2$, hullik·levél $= 1$, hullik·hullik $= 1$; $\sqrt 2$-vel osztva $1{,}414;\ 0{,}707;\ 0{,}707$; softmax: $(0{,}503;\ 0{,}248;\ 0{,}248)$. A $(0{,}576;\ 0{,}212;\ 0{,}212)$ kihagyja a skálázást, a $(0{,}407;\ 0{,}150;\ 0{,}150)$ a softmax <em>után</em> oszt (ezért az összege már nem 1). A $(0{,}164;\ 0{,}198;\ 0{,}248)$ a súlymátrix „hullik” <b>oszlopa</b>: azt mutatja, ki mennyire figyel a hullikra – ennek az összege sem 1.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az önfigyelemre?",
          options: [
            "A súlymátrix minden sorának összege 1.",
            "A kimenet ugyanannyi vektor, ahány token a bemenet.",
            R`A keverési súlyokat minden mondatra újra kiszámoljuk; csak $W_Q$, $W_K$, $W_V$ rögzített.`,
            "Minden token önmagára kapja a legnagyobb súlyt – ez szabály.",
            "A súlymátrix minden oszlopának összege is 1."
          ],
          answer: [0, 1, 2],
          hint: "Melyik irányban hat a softmax? És mitől függ, hogy ki kire figyel?",
          explain: R`A softmax soronként (lekérdezésenként) hat, így a sorok összege 1; az oszlopoké bármi lehet – egy fontos szóra többen is figyelhetnek. Az önfigyelem nem összegzi a mondatot: minden token kap egy új, kontextusfüggő vektort. A súlyok bemenetfüggők, ellentétben egy teljesen összekötött réteg rögzített súlyaival. Az, hogy a szó önmagára figyel a legjobban, csak $W_Q = W_K$ mellett gyakori; tanult, különböző mátrixokkal egy fej akár szinte csak a szomszédra figyelhet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legyen $W_V$ az egységmátrix, $W_Q$ és $W_K$ viszont csupa nulla. Mit csinál ekkor az önfigyelem?`,
          options: [
            "Minden token új vektora a mondat összes vektorának átlaga lesz.",
            "Minden token a saját vektorát kapja vissza változatlanul.",
            "Minden kimenet nullvektor lesz.",
            "Minden token csak az első tokenre figyel."
          ],
          answer: 0,
          hint: R`Mennyi lesz minden pontszám? És mit ad a softmax, ha minden bemenete egyenlő?`,
          explain: R`Minden lekérdezés és kulcs nullvektor, így minden pontszám 0, a softmax pedig egyenlő súlyokat ad: $1/n$. A kimenet az értékek (itt a bemeneti vektorok) sima átlaga – ez a 12.3 átlagoló modellje. A nullvektor kimenet akkor jönne, ha $W_V$ lenne nulla; a „saját vektor” akkor, ha mindenki csak magára figyelne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két token: $\mathbf x_1 = (2;\ 0)$, $\mathbf x_2 = (0;\ 2)$; minden $W$ az egységmátrix, $d = 2$. Mi az első token új vektora?`,
          options: [R`$(1{,}888;\ 0{,}112)$`, R`$(1{,}964;\ 0{,}036)$`, R`$(1{,}389;\ 0{,}025)$`, R`$(1{,}762;\ 0{,}238)$`],
          answer: 0,
          hint: R`Pontszámok: $\mathbf x_1 \cdot \mathbf x_1$ és $\mathbf x_1 \cdot \mathbf x_2$. Mivel kell osztani, és mikor?`,
          explain: R`Pontszámok $4$ és $0$; $\sqrt 2$-vel osztva $2{,}828$ és $0$; softmax: $(0{,}944;\ 0{,}056)$; új vektor $0{,}944\cdot(2;0) + 0{,}056\cdot(0;2) = (1{,}888;\ 0{,}112)$. Skálázás nélkül $(1{,}964;\ 0{,}036)$ – keményebb súlyok. A $(1{,}389;\ 0{,}025)$ a softmax után oszt, így a súlyok összege már nem 1, és a vektor „összezsugorodik”. A $(1{,}762;\ 0{,}238)$ $d$-vel oszt $\sqrt d$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért osztjuk a pontszámokat $\sqrt{d_k}$-val a softmax előtt?`,
          options: [
            R`Mert a véletlen skaláris szorzatok szórása $\sqrt{d_k}$-val nő, és nagy pontszámokra a softmax szinte kemény kereséssé válik – a gradiens pedig szinte nulla lesz.`,
            "Hogy a súlyok összege 1 legyen.",
            "Hogy a kimeneti vektorok hossza 1 legyen.",
            "Mert a softmax csak 0 és 1 közötti bemenetet fogad el."
          ],
          answer: 0,
          hint: R`Mi történik a $\operatorname{softmax}(8;\ 16;\ 24)$-gyel a $\operatorname{softmax}(1;\ 2;\ 3)$-hoz képest?`,
          explain: R`$d_k$ darab, 1 szórású szorzat összegének szórása $\sqrt{d_k}$ ($d_k = 64$-nél kb. 8). A $\operatorname{softmax}(8;\ 16;\ 24) \approx (0{,}0000;\ 0{,}0003;\ 0{,}9997)$ – egy nyertes, a többi eldobva, és a háló alig tanul. Az 1-es összeget a softmax magától biztosítja; a kimenet hosszát a skálázás nem állítja be; a softmax bármilyen valós bemenetet elfogad.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy szöveg 1000 tokenről 3000 tokenre nő. Hányszor annyi figyelmi pontszámot kell kiszámolni (fejenként, rétegenként)?",
          options: ["9-szer annyit", "3-szor annyit", "6-szor annyit", "27-szer annyit"],
          answer: 0,
          hint: "Hány pontszám van egy n tokenes szövegben?",
          explain: R`A $QK^\top$ pontszámmátrix $n \times n$-es, így a pontszámok száma $n^2$: $3^2 = 9$-szeres. A 3-szoros a tokenenkénti rétegekre (pl. FFN) igaz, a 6-szoros $2 \cdot 3$ (összeadás négyzetre emelés helyett), a 27-szeres köbös növekedést feltételez. A FlashAttention a memóriát teszi lineárissá, a műveletek száma marad $n^2$-es.`
        },
        {
          type: "single", shuffle: true,
          q: R`$d = 1024$, $h = 16$ fej. Mekkora egy fej $d_k$-ja, és hány súlya van a többfejű figyelemrétegnek ($W_Q, W_K, W_V, W_O$, torzítás nélkül)?`,
          options: [R`$d_k = 64$; $4\,194\,304$`, R`$d_k = 64$; $67\,108\,864$`, R`$d_k = 64$; $3\,145\,728$`, R`$d_k = 16$; $4\,194\,304$`],
          answer: 0,
          hint: R`A fejek a $d$ dimenziót osztják fel egymás között. Ne felejtsd el a kimeneti $W_O$ mátrixot!`,
          explain: R`$d_k = d/h = 1024/16 = 64$, a súlyok száma $4d^2 = 4 \cdot 1024^2 = 4\,194\,304$ – ugyanannyi, mint egy teljes szélességű fejnél. A $67\,108\,864$ minden fejnek teljes $4d^2$-et ad ($\times 16$), a $3\,145\,728$ kihagyja $W_O$-t ($3d^2$), a $d_k = 16$ a fejek számát keveri össze a fej méretével.`
        },
        {
          type: "match",
          q: "Párosítsd a pozíciókezelést a leírásával!",
          pairs: [
            ["szinuszos pozíciókódolás", "rögzített sin/cos képlet, az eredeti Transformerben"],
            ["tanult pozícióvektorok", "táblázat, mint a szóbeágyazás (BERT, GPT-2); nem nyújtható hosszabb szövegre"],
            ["RoPE (forgatásos)", "rétegenként a lekérdezést és a kulcsot forgatja; a pontszám a távolságtól függ"],
            ["pozíció nélküli önfigyelem", "összekevert szavakra ugyanazt a mondatvektort adja, mint egy zsák"]
          ],
          hint: "Melyik adódik a bemenethez, melyik hat közvetlenül a pontszámra – és melyik nem tud a sorrendről semmit?",
          explain: R`A szinuszos kód képletből jön, nem tanuljuk. A tanult táblázat $n_{\max} \times d$-s, az 513. pozícióra egy 512-es táblázat nem tud mit mondani. A RoPE nem a bemenethez adódik: a $\mathbf q$-t és a $\mathbf k$-t forgatja, az értéket nem, így a pontszám a relatív távolságot „látja”. Pozíció nélkül a kísérlet Transformere a „de”-s mondatokon 49,5%-ot ért el – mint az átlagoló modell.`
        }
      ]
    },

    /* ------------------------------------------------ 12.6 */
    "ai12-126": {
      title: "Kvíz – 12.6 A Transformer",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy Transformer-blokknak $d = 256$ és $d_{\text{ff}} = 4d$ mellett (figyelem, FFN, két rétegnormalizálás, torzításokkal)?`,
          options: ["789 760", "786 432", "263 168", "525 568"],
          answer: 0,
          hint: R`Figyelem $4d^2 + 4d$, FFN $8d^2 + 5d$, két LN $4d$.`,
          explain: R`$12d^2 + 13d = 12 \cdot 65\,536 + 13 \cdot 256 = 786\,432 + 3328 = 789\,760$. A $786\,432$ csak a $12d^2$ (a torzítások és az LN paraméterei kimaradtak), a $263\,168$ csak a figyelem ($4d^2 + 4d$), az $525\,568$ csak az FFN ($8d^2 + 5d$) – ez a nagyobb rész.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normáld rétegnormalizálással ($\gamma = 1$, $\beta = 0$) a $(2;\ 2;\ 2;\ 6)$ tokenvektort!`,
          options: [R`$(-0{,}577;\ -0{,}577;\ -0{,}577;\ 1{,}732)$`, R`$(-0{,}5;\ -0{,}5;\ -0{,}5;\ 1{,}5)$`, R`$(-0{,}333;\ -0{,}333;\ -0{,}333;\ 1)$`, R`$(-1;\ -1;\ -1;\ 3)$`],
          answer: 0,
          hint: "Átlag, eltérések, szórásnégyzet (osztás a darabszámmal), aztán osztás a szórással.",
          explain: R`Átlag 3, eltérések $(-1;\ -1;\ -1;\ 3)$, szórásnégyzet $(1 + 1 + 1 + 9)/4 = 3$, szórás $\sqrt 3 \approx 1{,}732$. Eredmény: $(-0{,}577;\ -0{,}577;\ -0{,}577;\ 1{,}732)$. A $(-0{,}5;\ \ldots;\ 1{,}5)$ $n - 1$-gyel osztott a szórásnégyzetnél, a $(-0{,}333;\ \ldots;\ 1)$ a szórásnégyzettel osztott szórás helyett, a $(-1;\ \ldots;\ 3)$ csak középre tolt.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Transformer-blokkra?",
          options: [
            "Az előrecsatolt háló (FFN) tokenenként külön fut, minden tokenen ugyanazokkal a súlyokkal.",
            "Egy blokk paramétereinek nagyobb része az FFN-ben van, nem a figyelemben.",
            R`Utó-normalizálás: $\operatorname{LN}(\mathbf x + F(\mathbf x))$; elő-normalizálás: $\mathbf x + F(\operatorname{LN}(\mathbf x))$.`,
            "A rétegnormalizálás egy jellemzőt normál a köteg mintái között.",
            "Az FFN-en keresztül a tokenek információt cserélnek egymással."
          ],
          answer: [0, 1, 2],
          hint: "Hol „beszélgetnek” a tokenek, és hol „gondolkodik” mindegyik külön?",
          explain: R`Az FFN tokenenként fut ($8d^2$ súly), a figyelem $4d^2$ – az FFN a nagyobb. A két normalizálási sorrend nem egyenértékű; a GPT-2 óta az elő-normalizált a gyakoribb. A köteg mintái között a <b>kötegnormalizálás</b> normál; a rétegnormalizálás egy token $d$ jellemzőjét egymás között. A tokenek közti információcsere csak a figyelemben történik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány $-\infty$ elem van egy 8 tokenes kauzális maszkban?`,
          options: ["28", "36", "56", "64"],
          answer: 0,
          hint: "Melyik elemek kapnak −∞-t: a főátló fölöttiek, alattiak, vagy a főátló is?",
          explain: R`A főátló <b>fölötti</b> elemek ($j > i$): $7 + 6 + \ldots + 1 = 28$. A 36 a főátlót is maszkolja ($8 \cdot 9/2$) – akkor az első token semmire nem figyelhetne. Az 56 mindkét háromszöget, a 64 minden elemet számolja. A maszk többi 36 eleme 0.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 4 tokenes szöveg 2. tokenjének pontszámsora (skálázás után, maszk előtt): $(1;\ 3;\ 2;\ 0)$. Mi a súlysor kauzális maszkkal?`,
          options: [R`$(0{,}119;\ 0{,}881;\ 0;\ 0)$`, R`$(0{,}087;\ 0{,}644;\ 0{,}237;\ 0{,}032)$`, R`$(0;\ 0{,}705;\ 0{,}259;\ 0{,}035)$`, R`$(0{,}087;\ 0{,}644;\ 0;\ 0)$`],
          answer: 0,
          hint: R`A 3. és 4. token jövőbeli: $-\infty$-t kapnak a softmax <em>előtt</em>.`,
          explain: R`Maszk után a sor $(1;\ 3;\ -\infty;\ -\infty)$, softmax: $\operatorname{softmax}(1;\ 3) = (0{,}119;\ 0{,}881)$, a jövő súlya pontosan 0. A $(0{,}087;\ 0{,}644;\ 0{,}237;\ 0{,}032)$ maszk nélküli; a $(0;\ 0{,}705;\ \ldots)$ a rossz háromszöget maszkolja (a múltat tiltja); a $(0{,}087;\ 0{,}644;\ 0;\ 0)$ a softmax <em>után</em> nulláz – a súlyok összege így csak 0,731.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi igaz egy maszkolt (dekódoló) Transformer tanítására és szöveggenerálására?",
          options: [
            "Tanításkor egyetlen menetben minden hely jóslását kiszámolja; generáláskor tokenenként halad.",
            "Tanításkor is tokenenként halad, mert a maszk miatt a jövőt nem látja.",
            "Generáláskor kikapcsoljuk a maszkot, hiszen úgysincs jövő.",
            "Generáláskor a maszk miatt az egész választ egyszerre írja meg."
          ],
          answer: 0,
          hint: "Tanításkor a teljes szöveg ismert. Generáláskor létezik-e már a következő token?",
          explain: "Tanításkor a szöveg megvan: a maszk gondoskodik róla, hogy egy menetben minden hely csak a múltat lássa – mind tanítójel, párhuzamosan. Generáláskor a következő token még nem létezik: jósol egyet, hozzáfűzi, újra jósol (autoregresszió). A maszk a modell része, generáláskor is: a már leírt tokenek vektorai nem változhatnak meg a később jövőktől."
        },
        {
          type: "match",
          q: "Párosítsd a modellt a jellemzőjével!",
          pairs: [
            ["BERT", "kétirányú figyelem, a tokenek 15%-át kell kitalálnia"],
            ["GPT", "kauzális maszk, a következő tokent jósolja"],
            ["az eredeti Transformer, T5", "kódoló és dekódoló, keresztfigyelemmel"],
            ["RoBERTa", "megmutatta, hogy a következő mondat jóslása (NSP) elhagyható"]
          ],
          hint: "Melyik család generál szöveget, melyik tölt ki lyukat, és melyik köti össze a kettőt?",
          explain: "A BERT csak kódoló: kétirányú, a maszkolt tokeneket találja ki – osztályozásra, keresésre jó, generálásra nem. A GPT csak dekódoló: kauzális maszk, következő token – ez a mai nagy nyelvi modellek alapja. Az eredeti Transformer (és a T5, BART) kódoló–dekódoló, fordításra, összefoglalásra. A RoBERTa (2019) a BERT receptjét javította, NSP nélkül."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 300 tokenes szövegben a BERT hány tokent cserél <code>[MASK]</code>-ra (átlagosan)?`,
          options: ["36", "45", "240", "9"],
          answer: 0,
          hint: "Először kiválasztja a tokenek egy részét; ezeknek csak egy része kap [MASK]-ot.",
          explain: R`$0{,}15 \cdot 300 = 45$ tokent választ ki; ezek 80%-a, $0{,}8 \cdot 45 = 36$ kap <code>[MASK]</code>-ot, 10% (4,5) véletlen tokent, 10% változatlan marad. A 45 az összes kiválasztott, a 240 a 80%-ot a teljes szövegre veszi, a 9 a kiválasztottak nem maszkolt 20%-a.`
        }
      ]
    },

    /* ------------------------------------------------ 12.7 */
    "ai12-127": {
      title: "Kvíz – 12.7 Miért nyert a Transformer?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány egymásra váró lépés kell egy 3 rétegű RNN-nek és egy 3 rétegű Transformernek egy 100 tokenes szöveg feldolgozásához (tanításkor)?",
          options: ["RNN: 102, Transformer: 3", "RNN: 300, Transformer: 3", "RNN: 100, Transformer: 1", "RNN: 102, Transformer: 300"],
          answer: 0,
          hint: R`Az RNN következő rétegének $t$-edik lépése az előző réteg $t$-edik lépésére vár – nem az egész rétegre. A Transformer rétegében minden token egyszerre számolható.`,
          explain: R`RNN: rétegenként 100 lépés, de a rétegek „egymásra csúsznak”: a legrövidebb út $100 + 2 = 102$ lépés. Transformer: rétegenként egy lépés (minden token egyszerre), összesen 3. A 300 nem veszi észre, hogy a rétegek átfedhetnek; a „100 és 1” egyetlen réteget számol; a Transformernél a tokenenkénti 300 lépés pont az, amit a párhuzamosság megspórol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy blokkban a vetítések és az FFN kb. $12\,n d^2$, a figyelem pontszámai és keverése kb. $2\,n^2 d$ szorzás. $d = 512$-nél kb. hány token fölött viszi a figyelem a nagyobb részt?`,
          options: ["3072", "6144", "2048", "512"],
          answer: 0,
          hint: R`Írd fel: $2n^2 d > 12 n d^2$, és oszd el mindkét oldalt $2nd$-vel.`,
          explain: R`$2n^2 d > 12 n d^2 \iff n > 6d = 3072$. A 6144 elhagyja a $2$-es szorzót ($n^2 d > 12nd^2$), a 2048 csak az FFN $8nd^2$-ét veszi (a vetítéseket kihagyja), az 512 naivan $n > d$-t ír. A szokásos néhány száz tokenes szövegeknél tehát a munka nagyja nem a figyelemben, hanem a tokenenkénti szorzásokban van.`
        },
        {
          type: "set",
          q: R`Melyik nő a szöveg hosszával ($n$) egy önfigyelem-rétegben (tanításkor, FlashAttention nélkül)?`,
          items: ["a műveletek száma", "a pontszámmátrix memóriaigénye", "az egymásra váró lépések száma", "két token közti út hossza", "a réteg paramétereinek száma"],
          answer: ["a műveletek száma", "a pontszámmátrix memóriaigénye"],
          hint: "Mi függ n-től a táblázatban (műveletek, egymás utáni lépések, út)? És függnek-e a súlymátrixok n-től?",
          explain: R`A műveletek száma $\sim n^2 d$, a pontszámmátrix $n \times n$-es – mindkettő négyzetesen nő. Az egymás utáni lépések száma 1, két token között az út 1 lépés, akármilyen hosszú a szöveg – ez a Transformer előnye. A paraméterek ($W_Q, W_K, W_V, W_O$) nem függnek $n$-től. Vigyázz: „a hossz mindegy” csak a lépések számára igaz.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["előtanítás", "önfelügyelt feladat óriási címkézetlen szövegen"],
            ["jellemzőkinyerés", "a modell súlyai fixek, csak a ráépített kis osztályozót tanítjuk"],
            ["finomhangolás", "az egész modellt továbbtanítjuk a feladat adatain, kis tanulási rátával"],
            ["promptolás", "a feladatot szövegként, néhány példával adjuk meg, súlymódosítás nélkül"]
          ],
          hint: "Melyiknél változnak a modell súlyai, és melyiknél egyáltalán nem?",
          explain: "Előtanításkor a címke magából a szövegből jön (következő vagy maszkolt token). Utána három út: jellemzőkinyerésnél csak a ráépített réteg tanul, finomhangolásnál az egész modell, promptolásnál egyik sem – a feladat a bemeneti szövegben van."
        },
        {
          type: "single", shuffle: true,
          q: "Egy cégnek 2000 címkézett ügyfélpanasza van, ezeket kell osztályozni. Mivel érdemes kezdeni?",
          options: [
            "TF-IDF + logisztikus regresszióval mint alapvonallal; csak akkor továbblépni, ha a mért különbség megéri.",
            "Rögtön finomhangolt BERT-tel, mert az IMDB-n 93%-ot ért el a TF-IDF 89,7%-ával szemben.",
            "Egy GPT-szerű modell előtanításával a 2000 panaszon.",
            "Kétirányú LSTM-mel, mert az mindig jobb a TF-IDF-nél."
          ],
          answer: 0,
          hint: "Mit mond a hüvelykujjszabály: mit mérj meg először?",
          explain: R`„Ne azért válassz BERT-et, mert menő.” Az olcsó alapvonal percek alatt kész, és ehhez mérheted a többit. A 93% vs. 89,7% (kb. 3,3 százalékpont) ráadásul eltérő protokollal mért (egy 90/10-es felosztás vs. 5-szörös keresztvalidáció). Előtanításhoz 2000 panasz nevetségesen kevés – arra óriási szöveg kell. A kétirányú LSTM az IMDB-n 89,5%-kal a TF-IDF (89,7%) szintjén volt, nem fölötte.`
        },
        {
          type: "single", shuffle: true,
          q: R`$L \propto N^{-0{,}076}$ mellett hányszorosára változik a veszteség, ha a modell 100-szor nagyobb (adat és számítás bőven van)?`,
          options: ["0,705", "0,839", "0,924", "0,010"],
          answer: 0,
          hint: R`Számold ki $100^{-0{,}076}$-ot – vagy $\left(10^{-0{,}076}\right)^2$-et.`,
          explain: R`$100^{-0{,}076} = (10^{-0{,}076})^2 \approx 0{,}839^2 \approx 0{,}705$ – kb. 30%-kal kisebb veszteség, kétszeres nagyságrendnyi méretnövelésért. A 0,839 a tízszeres modell. A 0,924 $1 - 0{,}076$: mintha a kitevő egy „lineáris” csökkenés lenne. A 0,010 a „duplázás felezi a veszteséget” tévhit ($0{,}5^{\log_2 100}$) – a mért törvény szerint a duplázás kb. 5%.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 10 milliárd paraméteres modellt a Chinchilla-szabály szerint tanítunk. Kb. mennyi a tanítás számításigénye a $C \approx 6ND$ szabállyal?`,
          options: [R`$1{,}2 \cdot 10^{22}$`, R`$2 \cdot 10^{21}$`, R`$6 \cdot 10^{20}$`, R`$2{,}4 \cdot 10^{23}$`],
          answer: 0,
          hint: "Előbb a tokenek száma: hány token jut egy paraméterre?",
          explain: R`$D = 20N = 2 \cdot 10^{11}$ token; $C \approx 6 \cdot 10^{10} \cdot 2 \cdot 10^{11} = 1{,}2 \cdot 10^{22}$ művelet. A $2 \cdot 10^{21}$ elhagyja a 6-os szorzót, a $6 \cdot 10^{20}$ $D = N$-nel számol (elfelejti a 20-at), a $2{,}4 \cdot 10^{23}$ kétszer szoroz 20-szal.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a skálázásra és a Transformer korlátaira?",
          options: [
            "A skálázási törvény tapasztalati illesztés egy adott tartományban, nem természeti törvény.",
            "A Transformer kevés dolgot feltételez az adatról (gyenge induktív torzítás), ezért sok adat kell neki.",
            "A Llama 3 8B szándékosan sokkal több tokenen tanult, mint a Chinchilla-optimum: drágább tanítás, olcsóbb használat.",
            "Kétszer nagyobb modell nagyjából a felére csökkenti a veszteséget.",
            "A FlashAttention a figyelem műveletszámát is lineárissá teszi."
          ],
          answer: [0, 1, 2],
          hint: R`Számold ki $2^{-0{,}076}$-ot. És mit takarít meg a FlashAttention: időt vagy memóriát?`,
          explain: R`A skálázási törvény egy tartományban illesztett tapasztalati szabály; nem mondja meg, mikor jelenik meg egy képesség. A Transformernek nincs beépített lokalitása (mint a konvolúciónak), ezt az adatból kell megtanulnia. A Llama 3 8B kb. 1900 tokent látott paraméterenként (a Chinchilla 20-at ajánl). A duplázás $2^{-0{,}076} \approx 0{,}949$-szeresre csökkenti a veszteséget – kb. 5%, nem felezés. A FlashAttention a memóriát teszi lineárissá, a műveletek száma $n^2$-es marad.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai12-final": {
      title: "Fejezetzáró teszt – 12. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 12.1 négy kritikájában D1 = „a film jó volt”, D3 = „a zene unalmas volt”, $\text{idf}(t) = \ln(4/\text{df}(t))$ (df: a: 4, film: 3, jó: 2, volt: 3, zene, unalmas: 1). Mennyi D1 és D3 koszinusz-hasonlósága TF-IDF-vektorokkal?`,
          options: ["0,052", "0,500", "0,318", "0,780"],
          answer: 0,
          hint: "Csak a közös szavak adnak tagot a skaláris szorzatba. Mennyi az „a” súlya?",
          explain: R`Közös szavak: „a” (idf $= \ln 1 = 0$) és „volt” ($0{,}288$). Skaláris szorzat $0{,}288^2 \approx 0{,}083$; a hosszak $\approx 0{,}804$ és $\approx 1{,}982$; $\cos \approx 0{,}052$. A 0,5 a sima szózsák koszinusza (a semmitmondó „a” és „volt” sokat számít), a 0,318 a scikit-learn-féle $\ln\frac{1+N}{1+\text{df}} + 1$ idf-fel jön ki, a 0,780 idf helyett df-fel szoroz (a gyakori szót jutalmazza). Tízes alapú logaritmussal ugyanúgy 0,052 lenne – a koszinusz a nyújtásra érzéketlen.`
        },
        {
          type: "set",
          q: R`Egy „…, de …” kritikában felcseréled a két tagmondatot (pl. „a film jó volt , de a vége unalmas volt” → „a vége unalmas volt , de a film jó volt”). Melyik modell kimenete marad <b>hajszálpontosan</b> ugyanaz?`,
          items: ["szózsák + logisztikus regresszió", "TF-IDF + logisztikus regresszió", "átlagolt beágyazás + MLP", "Transformer pozíció nélkül", "RNN", "LSTM", "Transformer tanult pozícióvektorokkal"],
          answer: ["szózsák + logisztikus regresszió", "TF-IDF + logisztikus regresszió", "átlagolt beágyazás + MLP", "Transformer pozíció nélkül"],
          hint: "Melyik modell látja a tokenek sorrendjét – rekurzióval vagy pozícióvektorral?",
          explain: R`A szózsák és a TF-IDF csak számol, az átlag csak összead – a sorrend mindháromnál elvész. A pozíció nélküli önfigyelem összekevert bemenetre összekevert kimenetet ad, amit a végén átlagolunk: ugyanaz (ezért 49,5% a „de”-s mondatokon). Az RNN és az LSTM szóról szóra olvas, a pozícióvektoros Transformer tudja, hol áll a token – ezek ítélete megfordul.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 12.2 hatmondatos együttes-előfordulási táblájában (darabszámok; oszlopok: tejet, vizet, iszik, egeret, labdát, kerget, benzint, fogyaszt) a macska sora $(1, 0, 1, 1, 0, 1, 0, 0)$, a kutyáé $(0, 1, 1, 0, 1, 1, 0, 0)$. Hozzáveszünk egy hetedik mondatot: „a kutya tejet iszik”. Mennyi most a macska–kutya koszinusz?`,
          options: ["0,707", "0,671", "0,500", "0,750"],
          answer: 0,
          hint: "A kutya sorában két szám változik – az egyik 2 lesz. A hossz is megváltozik!",
          explain: R`Kutya: $(1, 1, 2, 0, 1, 1, 0, 0)$. Skaláris szorzat $1 + 2 + 1 = 4$, hosszak $2$ és $\sqrt 8 \approx 2{,}828$: $\cos \approx 0{,}707$. A 0,671 az „iszik”-et 1-nek hagyja (0/1 táblázat), a 0,5 a régi érték, a 0,75 a régi hosszakkal osztja a régi szorzatot plusz egyet. A tanulság: egy közös környezet „közelebb húzza” a két szót.`
        },
        {
          type: "single", shuffle: true,
          q: "Az 50 dimenziós GloVe-vektorokkal a king − man + woman vektorhoz melyik szó van a legközelebb?",
          options: [
            "A king (0,886); a queen (0,861) csak akkor nyer, ha a bemeneti szavakat kizárjuk.",
            "A queen (0,861) – a vektoraritmetika mindig kiadja az analógiát.",
            "A woman, mert a hozzáadott vektor a legnagyobb.",
            "Egyik sem: a koszinusz itt értelmetlen, euklideszi távolság kell."
          ],
          answer: 0,
          hint: "Az összeg-különbség vektor nagyrészt még mindig a kiinduló szó vektora…",
          explain: R`A híres analógia „csalással” működik: a legközelebbi szó maga a king; a queen csak a bemeneti szavak kizárása után nyer, és sokszor így sem jön ki (lemon − yellow + green → ginger). Az analógiát éppen koszinusszal keressük, mert a vektorhossz nagyrészt a gyakoriságtól függ. Ne a kiválasztott látványos példákból ítéld meg a beágyazásokat.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 12.3 játék-RNN-je: $h_{\text{új}} = \tanh(0{,}5\,h + x)$, $h_0 = 0$; unalmas $= -1$, jó $= +1$, de $= 0$. Mennyi $h_3$ az „unalmas jó de” sorozat után?`,
          options: ["0,269", "0,250", "−0,551", "0,000"],
          answer: 0,
          hint: "Lépésről lépésre: minden lépésben a régi állapot felét adod a szó értékéhez, aztán tanh.",
          explain: R`$h_1 = \tanh(-1) = -0{,}7616$; $h_2 = \tanh(-0{,}3808 + 1) = 0{,}5506$; $h_3 = \tanh(0{,}2753) = 0{,}269$ – pozitív: a legutóbbi erős szó (jó) dönt. A 0,250 a $\tanh$-ot hagyja ki, a $-0{,}551$ fordított sorrendben olvas („de jó unalmas”), a 0 az átlagoló modell eredménye – az a sorrendet nem látja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy LSTM-cellának, ha a bemenet $d = 16$, a rejtett állapot $h = 32$?`,
          options: ["6272", "1568", "4704", "6144"],
          answer: 0,
          hint: R`Négy réteg (három kapu és a jelölt $\mathbf g$), mindegyik $\mathbf x_t$-ből és $\mathbf h_{t-1}$-ből számol, torzítással.`,
          explain: R`$4\,(dh + h^2 + h) = 4\,(512 + 1024 + 32) = 4 \cdot 1568 = 6272$. Az 1568 egy sima RNN-cella (egy réteg), a 4704 háromszorosa – a GRU-é lenne ($\tfrac34$ annyi) –, a 6144 a torzításokat hagyja ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Puha keresés (12.4): kulcsok $\mathbf k_1 = (2;\ 0) \to 10$, $\mathbf k_2 = (0;\ 2) \to 20$, $\mathbf k_3 = (1;\ 1) \to 30$; a lekérdezés $\mathbf q = (2;\ 0)$, skálázás nélkül. Mennyi a válasz?`,
          options: ["12,50", "10,00", "20,00", "16,67"],
          answer: 0,
          hint: "Pontszám skaláris szorzattal, súly softmax-szal, válasz az értékek súlyozott átlaga.",
          explain: R`Pontszámok $4;\ 0;\ 2$, súlyok $(0{,}867;\ 0{,}016;\ 0{,}117)$, válasz $8{,}67 + 0{,}32 + 3{,}51 \approx 12{,}50$. A 10 a kemény keresés (csak a legjobb kulcs), a 20 a sima átlag (mintha minden pontszám egyenlő lenne), a 16,67 a pontszámokat a softmax helyett az összegükkel normálja ($4/6$, $0$, $2/6$).`
        },
        {
          type: "match",
          q: "Honnan jön a lekérdezés, a kulcs és az érték? Párosítsd!",
          pairs: [
            ["önfigyelem a kódolóban", "mindhárom ugyanabból a mondatból, minden token minden tokenre figyel"],
            ["maszkolt önfigyelem a dekódolóban", "ugyanabból a mondatból, de csak a korábbi tokenekre"],
            ["keresztfigyelem", "lekérdezés a célmondatból, kulcs és érték a forrásmondatból"],
            ["Bahdanau-figyelem (2015)", "a dekódoló RNN állapota kérdez, a kódoló RNN állapotai a kulcsok és értékek"]
          ],
          hint: "Az „ön-” azt jelenti: ugyanabból a sorozatból. Ki kérdez fordításkor?",
          explain: "Az önfigyelemben Q, K és V ugyanabból a mondatból jön; a dekódolóban ehhez kauzális maszk jár. A keresztfigyelemben a lekérdezés a készülő célmondatból, a kulcs és az érték a forrásból – fordítva a modell a célnyelvi szöveget „keresné” a forrásban. A Bahdanau-figyelem ugyanez a keresztfigyelem, csak RNN-ek állapotaival."
        },
        {
          type: "single", shuffle: true,
          q: R`Az eredeti Transformerben $d = 512$, $h = 8$ fej. Mivel osztjuk egy fej pontszámait a softmax előtt?`,
          options: [R`$\sqrt{64} = 8$-cal`, R`$\sqrt{512} \approx 22{,}6$-del`, R`$64$-gyel`, R`$\sqrt 8 \approx 2{,}83$-mal`],
          answer: 0,
          hint: R`Egy fej kulcsvektora milyen hosszú? A képletben $\sqrt{d_k}$ áll.`,
          explain: R`Egy fej $d_k = d/h = 64$ hosszú kulcsokkal dolgozik, a skaláris szorzatok szórása $\sqrt{64} = 8$. A $\sqrt{512}$ a teljes $d$-vel oszt (egy fej szorzatai ennél kisebbek – túlságosan „ellaposodna” a softmax), a 64 a gyökvonást felejti el, a $\sqrt 8$ a fejek számával keveri össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az A mondat (fa $= (2;\ 0)$, levél $= (1;\ 1)$, hullik $= (1;\ 0)$, $W$ = egységmátrix, $d = 2$) kauzális maszkkal. Mi lesz a „levél” új vektora?`,
          options: [R`$(1{,}5;\ 0{,}5)$`, R`$(1{,}401;\ 0{,}401)$`, R`$(1;\ 0{,}670)$`, R`$(1{,}203;\ 0{,}401)$`],
          answer: 0,
          hint: "A levél a 2. token: kikre figyelhet? A megmaradt súlyok összege legyen 1.",
          explain: R`A levél csak a fára és magára figyelhet; mindkét pontszám 2, így a súlyok $0{,}5$–$0{,}5$: $0{,}5\cdot(2;0) + 0{,}5\cdot(1;1) = (1{,}5;\ 0{,}5)$. Az $(1{,}401;\ 0{,}401)$ a maszk nélküli (12.5) eredmény, az $(1;\ 0{,}670)$ a rossz háromszöget maszkolja (magára és a hullikra figyel), az $(1{,}203;\ 0{,}401)$ a softmax után nulláz, és nem normál újra.`
        },
        {
          type: "single", shuffle: true,
          q: R`A GPT-2 legnagyobb változatában 48 blokk van, $d = 1600$. Kb. hány paraméter van a blokkokban ($12d^2 + 13d$ blokkonként)?`,
          options: ["kb. 1,48 milliárd", "kb. 0,49 milliárd", "kb. 0,98 milliárd", "kb. 30,7 millió"],
          answer: 0,
          hint: "Egy blokk paraméterszáma, aztán szorozd a blokkok számával.",
          explain: R`$12 \cdot 1600^2 + 13 \cdot 1600 = 30\,740\,800$ blokkonként, $\times 48 \approx 1{,}48$ milliárd – a beágyazásokkal ez a „1,5 milliárd paraméteres GPT-2”. A 0,49 milliárd csak a figyelmet számolja ($4d^2 + 4d$), a 0,98 milliárd csak az FFN-t ($8d^2 + 5d$), a 30,7 millió egyetlen blokk.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a BERT-re és a GPT-re?",
          options: [
            "A BERT nem jósolhatja a következő tokent úgy, mint a GPT, mert kétirányú figyelmével a következő tokent is látja.",
            "Egy véleményelemző (osztályozó) Transformernek nem kell kauzális maszk.",
            "Egy 512 tokenes szövegből a GPT több mint hatszor annyi tanítójelet kap, mint a BERT.",
            "Az első dekódoló-modell a GPT-2 volt.",
            "A BERT következőmondat-feladata (NSP) a két mondat sorrendjét kérdezi."
          ],
          answer: [0, 1, 2],
          hint: "Ki mit lát a figyelemben? És hány helyen tanul a BERT egy szövegből?",
          explain: R`A BERT kétirányú: a „következő” token ott van a bemenetében, kinézhetné. Osztályozásnál a teljes mondat ismert, minden token figyelhet a későbbiekre is (a „de” utánira éppen kell). A BERT kb. $0{,}15 \cdot 512 \approx 77$ helyen tanul, a GPT 511 helyen – kb. 6,6-szor annyi. Az első dekódoló a GPT (2018) volt, még a BERT előtt. Az NSP azt kérdezi, hogy a B mondat valóban az A után jött-e, vagy egy véletlen mondat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Számítási keretünk $C = 1{,}2 \cdot 10^{23}$ művelet. A $C \approx 6ND$ szabály és a Chinchilla-szabály (20 token paraméterenként) szerint kb. mekkora modellt érdemes tanítani?`,
          options: ["kb. 31,6 milliárd paraméter", "kb. 141 milliárd paraméter", "kb. 77,5 milliárd paraméter", "kb. 632 milliárd paraméter"],
          answer: 0,
          hint: R`Írd be $D = 20N$-et: $C = 6 \cdot N \cdot 20N = 120\,N^2$.`,
          explain: R`$N = \sqrt{C/120} = \sqrt{10^{21}} \approx 3{,}16 \cdot 10^{10}$, vagyis kb. 31,6 milliárd paraméter, kb. 632 milliárd tokenen. A 141 milliárd a 20-at hagyja ki ($C = 6N^2$), a 77,5 milliárd a 6-ot ($C = 20N^2$), a 632 milliárd megfordítja az arányt (20 paraméter jut egy tokenre) – érdekes módon pont a helyes tokenszám.`
        },
        {
          type: "single", shuffle: true,
          q: "A huBERT „levél”-vektoraiban a 0. rétegben az azonos és az eltérő jelentésű párok koszinusza is 0,97; a 4. rétegben 0,952 vs. 0,832. Mi a helyes értelmezés?",
          options: [
            "A 0. réteg statikus beágyazás (+ pozíció), nem tudja, melyik levélről van szó; az önfigyelem rétegei a szomszédos szavakból választják szét a jelentéseket.",
            "A 4. rétegben a két jelentés teljesen különböző, hiszen 0,832 messze van 1-től.",
            "A modell előtanításkor megkapta a „levél” két jelentését címkeként.",
            "A 0. rétegben már szétválik a két jelentés, csak kerekítés miatt látszik egyformának."
          ],
          answer: 0,
          hint: "Mit lát a 0. réteg a mondatból? És az abszolút számot nézd, vagy a két átlag különbségét?",
          explain: "A 0. rétegben a token vektora a szótárból jön – mint a GloVe „bank”-jánál, egy szóhoz egy vektor. A figyelemrétegek után a vektor a környezettől (fáról, postán, bélyeg) függ. A BERT-szerű modellek vektorai egy szűk „kúpban” vannak, ezért szinte minden koszinusz 0,8 fölötti: a beszédes a két átlag különbsége, nem a 0,832 önmagában. Címkét senki nem adott – önfelügyelt előtanítás."
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
