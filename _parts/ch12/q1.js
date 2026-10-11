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
