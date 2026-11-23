(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 11.4 */
    "gh11-114": {
      title: "Kvíz – 11.4 Spektrális beágyazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 100 csúcsú, összefüggő gráfra 5 dimenziós Laplace-sajátleképezést számolsz. Az $L$ mely sajátvektorai lesznek a $Z$ oszlopai?`,
          options: [
            R`a 2.–6. ($\mu_2, \dots, \mu_6$-hoz tartozók)`,
            R`az 1.–5. ($\mu_1, \dots, \mu_5$-höz tartozók)`,
            R`a 96.–100. (a legnagyobb sajátértékűek)`,
            R`a 2.–5. ($\mu_2, \dots, \mu_5$-höz tartozók)`
          ],
          answer: 0,
          hint: R`Melyik sajátvektor tartozik a $\mu_1 = 0$-hoz, és mit ad az a csúcsoknak? A Laplace-nál a kicsi vagy a nagy sajátértékek a „simák”?`,
          explain: R`A $d$ dimenziós beágyazás oszlopai a 2., 3., …, $(d+1)$-edik sajátvektor, itt a 2.–6. Az 1.–5. a konstans első sajátvektort is felhasználja: az minden csúcsnak ugyanazt a koordinátát adja, semmit sem különböztet meg. A 96.–100. a szomszédsági mátrix szokását viszi át a Laplace-ra – ott a legnagyobb sajátértékek a leginkább ugráló jelek, épp a szomszédokat teszik távol. A 2.–5. csak 4 oszlop: az indexet elcsúsztatja (a $\mu_1$ kimarad, de a $d$ attól még 5). Lásd a <a class="xref" href="#s114-a">11.4 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 1–2–3–4 út Laplace-mátrixának sajátértékei $0;\ 0{,}586;\ 2;\ 3{,}414$. Mennyi a 2D spektrális beágyazás energiája, $\sum_{E}\lVert \mathbf z_i - \mathbf z_j\rVert^2$?`,
          options: [R`$2{,}586$`, R`$0{,}586$`, R`$5{,}414$`, R`$6{,}000$`],
          answer: 0,
          hint: R`Az összeg koordinátánként szétesik: minden oszlop a saját sajátértékét adja hozzá. Melyik két oszlop van a 2D beágyazásban?`,
          explain: R`$\operatorname{tr}(Z^\top L Z) = \mu_2 + \mu_3 = 0{,}586 + 2 = 2{,}586$ – ez a lehető legkisebb energia a feltételek mellett. A $0{,}586$ csak az 1D beágyazás ($\mathbf u_2$) energiája. Az $5{,}414 = \mu_3 + \mu_4$ a két legnagyobb sajátértékhez tartozó vektorokat venné – az a legugrálóbb elrendezés. A $6$ az összes sajátérték összege (az $L$ nyoma, a fokszámok összege), ez a konstans vektort is beszámolja, és nem 2D.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 1–2–3–4 út 2D beágyazása: $1 \to (0{,}653;\ 0{,}5)$, $2 \to (0{,}271;\ -0{,}5)$, $3 \to (-0{,}271;\ -0{,}5)$, $4 \to (-0{,}653;\ 0{,}5)$. A pontszám $s(u, v) = -\lVert \mathbf z_u - \mathbf z_v\rVert$. Melyik jelölt kerül a rangsor élére?`,
          options: [
            R`az 1–4 pár ($\approx 1{,}31$)`,
            R`az 1–3 és a 2–4 pár holtversenyben ($\approx 1{,}36$)`,
            R`a 2–3 pár ($\approx 0{,}54$)`,
            R`az 1–2 pár ($\approx 1{,}07$)`
          ],
          answer: 0,
          hint: R`Először írd fel a jelölteket: melyik pár nem él? Aztán számold ki a távolságukat mindkét koordinátán.`,
          explain: R`A jelöltek a nem élek: 1–3, 1–4, 2–4. Az 1–4: $\sqrt{1{,}306^2 + 0^2} \approx 1{,}31$; az 1–3 és a 2–4: $\sqrt{0{,}924^2 + 1^2} \approx 1{,}36$. A legközelebbi tehát az 1–4 – a 3. sajátvektor „visszahajtotta” a két véget, pedig a CN szerint épp az 1–3 és a 2–4 az esélyes (1 közös szomszéd), az 1–4-nek nincs közös szomszédja. A 2–3 és az 1–2 él, nem jelölt – a meglévő éleket nem rangsoroljuk. Lásd a <a class="xref" href="#s114-a-ut">kiinduló példát</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét 2D spektrális beágyazásában melyik jelölt pár van a legközelebb egymáshoz?`,
          options: [
            R`$\mathrm{Po}\text{–}\mathrm{Sz}$, $\approx 0{,}574$`,
            R`$\mathrm{Vi}\text{–}\mathrm{Kl}$, $\approx 1{,}338$`,
            R`$\mathrm{Ko}\text{–}\mathrm{La}$, $\approx 0{,}821$`,
            R`$\mathrm{La}\text{–}\text{Ön}$, $0$`
          ],
          answer: 0,
          hint: R`A La és az Ön tényleg egy pontba esik – de jelölt-e a pár? És a Vi–Kl a CN szerint esélyes, de a 2D képen hol van?`,
          explain: R`A 11 jelölt közül a $\mathrm{Po}\text{–}\mathrm{Sz}$ a legközelebbi ($0{,}574$), utána holtversenyben a $\mathrm{Ko}\text{–}\mathrm{La}$ és a $\mathrm{Ko}\text{–}\text{Ön}$ ($0{,}821$). A $\mathrm{La}\text{–}\text{Ön}$ távolsága valóban 0, de köztük él van – nem jelölt. A $\mathrm{Vi}\text{–}\mathrm{Kl}$ a CN és a Jaccard szerint az egyik legesélyesebb pár (2 közös szomszéd, $J = 2/3$), a 2D képen viszont a legtávolabbi ($1{,}338$): a 3. sajátvektor a Kl-t külön irányba húzza. Lásd a <a class="xref" href="#s114-b-arviz">11.4 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét spektrális beágyazásában a La és az Ön koordinátái pontosan egyeznek. Miért?`,
          options: [
            R`Mert szerkezetileg ekvivalensek: felcserélve őket a gráf nem változik.`,
            R`Mert ugyanannyi a fokszámuk (2–2).`,
            R`Mert él köti össze őket, és a beágyazás a szomszédokat egy pontba húzza.`,
            R`Numerikus hiba: két csúcs a pontos megoldásban sosem esik egybe.`
          ],
          answer: 0,
          hint: R`Nézd meg a szomszédságukat: $N(\mathrm{La})$ és $N(\text{Ön})$. Van-e más csúcspár, amelynek ugyanannyi a fokszáma vagy él köti össze, mégsem esik egybe?`,
          explain: R`$N(\mathrm{La}) = \{\mathrm{Po}, \text{Ön}\}$, $N(\text{Ön}) = \{\mathrm{Po}, \mathrm{La}\}$: egymáson kívül mindkettő csak a Po-val szomszédos. A cseréjük a gráfot nem változtatja meg, ezért minden (egyszeres sajátértékű) sajátvektorban egyenlő az értékük. Az azonos fokszám kevés: a Kl fokszáma is 2, mégis máshol áll. Az él sem elég: a Ko és a Vi is szomszéd, a távolságuk mégis kb. 0,49. Az egybeesés nem hiba – a gráf egyszerűen nem tudja megkülönböztetni őket.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: A–B, B–C, D–E. Mit mondhatsz a Laplace-mátrix spektrumáról és a 2D spektrális beágyazásról?`,
          options: [
            R`A 0 kétszeres sajátérték; a „második sajátvektor” nem egyértelmű, a két komponens egymáshoz viszonyított helyzete önkényes.`,
            R`A 0 egyszeres sajátérték; a 2. sajátvektor szétválasztja a két komponenst, ez a beágyazás legjobb része.`,
            R`Nincs 0 sajátérték, mert minden csúcsnak van éle.`,
            R`A 0 kétszeres sajátérték, de a sajátvektorokat a Python mindig ugyanúgy választja, így a beágyazás egyértelmű.`
          ],
          answer: 0,
          hint: R`Hány komponense van a gráfnak, és ez mit mond a 0 sajátérték multiplicitásáról?`,
          explain: R`Két komponens → két 0 sajátérték (a sajátértékek $0, 0, 1, 2, 3$). A két 0-hoz tartozó síkból bármely irány „második sajátvektor” lehet, így a komponensek egymáshoz viszonyított helye a bázisválasztás véletlene – komponensenként értelmes a beágyazás, köztük nem. A „0 egyszeres” csak összefüggő gráfra igaz. A „nincs 0 sajátérték” hibás: a konstans vektor (és komponensenként a konstans) mindig 0-hoz tartozik. Az utolsó opció a hét eleji tanítógráf csapdája: ott egy futás 0,70-es AUC-t adott, de egy másik, ugyanolyan jó bázis mást adna. Lásd a <a class="xref" href="#s114-c">11.4 3. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a spektrális beágyazásra? (Több jó válasz is lehet.)",
          options: [
            R`A 3 levelű csillag sajátértékei $0, 1, 1, 4$, ezért a 2D kép tetszőlegesen elforgatható; a távolságok ettől nem változnak.`,
            R`A beágyazás transzduktív: egy új szereplőnek csak a teljes felbontás újraszámolásával lesz koordinátája.`,
            R`Ha $\mathbf u$ sajátvektor, $-\mathbf u$ is: a kép tükrözhető, a távolságok ugyanazok.`,
            R`Egy hét eleji és egy hét végi beágyazás koordinátái közvetlenül összevethetők, mert ugyanazokról a szereplőkről szólnak.`,
            R`Az $x$ tengely a teljes héten a kormányzati és a helyi szereplőket választja el, tehát a második sajátvektor mindig egy értelmezhető ellentétet mér.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi határozza meg egyértelműen a beágyazást: a tengelyek, vagy csak a pontok egymáshoz viszonyított helyzete?`,
          explain: R`Igaz az első: kétszeres sajátértéknél csak a kifeszített sík egyértelmű, a tengelyek nem. Igaz a második: a koordináták a teljes $L$ sajátvektorai, egy új sor és oszlop mindent megváltoztathat. Igaz a harmadik: az előjel önkényes. Hamis a negyedik: két futás tengelyei között előjel, sorrend és forgatás is eltérhet – csak illesztés után vagy a távolságokon keresztül vethetők össze. Hamis az ötödik: a tengelyek csak a gráf szerkezetéből jönnek; itt véletlenül egybeesnek egy értelmezhető ellentéttel, máskor nem.`
        },
        {
          type: "match",
          q: "Párosítsd a Laplace-sajátleképezés elemét a szerepével!",
          pairs: [
            [R`a $\mu_1 = 0$ sajátvektora`, "konstans, semmit nem különböztet meg"],
            [R`a Fiedler-vektor ($\mu_2$)`, "a legsimább nem konstans jel, az első koordináta"],
            [R`a legnagyobb sajátértékű vektorok`, "a leginkább ugráló jelek, szomszédokat széthúznak"],
            [R`az $\mathbf 1$-re merőlegesség`, "megakadályozza, hogy minden csúcs egy pontba essen"],
            [R`az oszlopok egymásra merőlegessége`, "nélküle minden oszlop a Fiedler-vektor lenne"]
          ],
          hint: R`Gondold végig a célfüggvényt: mit csinálna a minimum a feltételek nélkül?`,
          explain: R`A cél $\min \operatorname{tr}(Z^\top L Z)$. A konstans vektor 0 energiájú, de minden csúcsot egy pontba tesz – ezért kell az $\mathbf 1$-re merőlegesség, és ezért indul a beágyazás a 2. sajátvektortól. Az első oszlop legjobb választása a Fiedler-vektor; ha az oszlopoknak nem kellene merőlegesnek lenniük, mindegyik az lenne, és $d$ dimenzió helyett egyet kapnánk. A legnagyobb sajátértékűek a legnagyobb $\mathbf x^\top L \mathbf x$-et adják: a szomszédok között ugrálnak – a Laplace-nál a kicsik kellenek, nem a nagyok (a szomszédsági mátrixnál fordítva).`
        }
      ]
    },

    /* ------------------------------------------------ 11.5 */
    "gh11-115": {
      title: "Kvíz – 11.5 Véletlen sétás beágyazások",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány (középső, környező) tanítópárt ad egy 6 hosszú séta $\pm 2$-es ablakkal?`,
          options: [R`$18$`, R`$9$`, R`$24$`, R`$10$`],
          answer: 0,
          hint: R`Hány $j = 1$, illetve $j = 2$ távolságú szópár van egy 6 szavas mondatban? És hányszor számít egy pár?`,
          explain: R`$2\sum_{j=1}^{2}(6 - j) = 2(5 + 4) = 18$. A 9 csak az egyik irányt számolja – a skip-gram minden szópárt mindkét irányban felhasznál (mindkét csúcs egyszer középső). A $24 = 2 \cdot 2 \cdot 6$ azt feltételezi, hogy minden szónak két oldalról teljes ablaka van, pedig a séta két végén az ablak csonka. A $10 = 2 \cdot 5$ a $\pm 1$-es ablak párszáma.`
        },
        {
          type: "set",
          q: R`Az öt barát gráfja: A–B, A–C, B–C, B–D, D–E. Az „A B D E D B C” sétából $\pm 2$-es ablakkal gyűjtünk párokat. Melyik <b>nem él</b> pár kerül egy ablakba?`,
          items: ["A–D", "B–E", "C–D", "A–E", "C–E", "A–C"],
          answer: ["A–D", "B–E", "C–D"],
          hint: R`Írd fel a séta helyeit (1–7), és nézd meg az 1 és 2 hely távolságú párokat. Az A–C él-e?`,
          explain: R`A $\pm 2$-es párok: A–B, A–D, B–D, B–E, D–E, D–D, C–D, B–C. Nem él közülük az A–D, a B–E és a C–D – mind 2 lépésre van a gráfban. Az A–E és a C–E 3 lépésre van, ehhez $\pm 3$-as ablak kellene (és a sétában sem kerülnek 2-n belülre). Az A–C él, és ebben a sétában egy ablakba sem kerül (az A az 1., a C a 7. helyen áll). Éppen az ablak hozza közel a nem szomszédos, de közeli párokat – ebből lesz kapcsolat-előrejelzés. Lásd a <a class="xref" href="#s115-a-seta">11.5 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az „A B D E D B C” séta $\pm 1$-es tábláján $|C| = 12$, a csúcsonkénti párszám A 1, B 4, C 1, D 4, E 2, a D–E pár kétszer fordul elő. Mennyi a $\mathrm{PMI}(\mathrm D, \mathrm E)$?`,
          options: [R`$\approx 1{,}099$`, R`$3{,}000$`, R`$2{,}000$`, R`$\approx -1{,}386$`],
          answer: 0,
          hint: R`$\mathrm{PMI}(u, v) = \ln\dfrac{C_{uv}\,|C|}{C_u\,C_v}$. Ne felejtsd el a $|C|$-t és a logaritmust.`,
          explain: R`$\ln\dfrac{2 \cdot 12}{4 \cdot 2} = \ln 3 \approx 1{,}099$ – ugyanannyi, mint az A–B-é. A 3 a hányados logaritmus nélkül: a megfigyelt és a várható gyakoriság aránya, nem a PMI. A 2 a nyers gyakoriság $C_{\mathrm{DE}}$ – ebben a hubok mindenkivel nagy értéket kapnak, ezt vonja le a PMI. A $-1{,}386 = \ln(2/8)$ a $|C|$-vel való szorzást hagyja ki, így nem valószínűségek hányadosát számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a táblában a B–D pár kétszer annyiszor fordul elő, mint az A–B, mégis $\mathrm{PMI}(\mathrm B, \mathrm D) \approx 0{,}405 \lt \mathrm{PMI}(\mathrm A, \mathrm B) \approx 1{,}099$. Mi az oka?`,
          options: [
            R`A B és a D „mindenhol ott van” a sétában; az A csak a B mellett fordul elő, ez erősebb jel.`,
            R`A B–D nem él, ezért a PMI büntetést ad rá.`,
            R`A PMI a ritkább párokat mindig előrébb teszi, függetlenül a csúcsok gyakoriságától.`,
            R`Elszámolás: a gyakoribb párnak nagyobb PMI jár.`
          ],
          answer: 0,
          hint: R`Mennyi lenne a két pár várható gyakorisága, ha a párok függetlenül állnának össze?`,
          explain: R`Függetlenség mellett az A–B várható gyakorisága $12 \cdot \tfrac1{12} \cdot \tfrac4{12} = \tfrac13$ (megfigyelt 1, háromszoros), a B–D-é $\tfrac43$ (megfigyelt 2, csak másfélszeres). A gyakori csúcsok sok párban szerepelnek, ezért egy-egy párjuk kevesebbet árul el – ugyanaz az ötlet, mint az Adamic–Adar-ban. A „nem él” magyarázat sem áll: a B–D az öt barát gráfjában él. A PMI nem a ritkaságot jutalmazza, hanem a várthoz mért többletet. A számolás helyes: ez a PMI lényege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy párra $\mathrm{PMI}(u, v) = \ln 10$, és pozitív páronként $b = 5$ negatívat veszünk. Levy és Goldberg szerint nagyjából mekkora skaláris szorzatot, $\mathbf z_u \cdot \mathbf z'_v$-t tanul a skip-gram?`,
          options: [R`$\approx 0{,}693$`, R`$\approx 2{,}303$`, R`$\approx 3{,}912$`, R`$2{,}000$`],
          answer: 0,
          hint: R`Az optimum az eltolt PMI: mit kell levonni, és logaritmus alatt vagy fölött?`,
          explain: R`$\mathbf z_u \cdot \mathbf z'_v \approx \mathrm{PMI} - \ln b = \ln 10 - \ln 5 = \ln 2 \approx 0{,}693$. A $2{,}303 = \ln 10$ a negatívak eltolását felejti el. A $3{,}912 = \ln 50$ hozzáadja a $\ln b$-t levonás helyett. A $2 = 10/5$ logaritmus nélkül oszt. Lásd a <a class="xref" href="#s115-b">11.5 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az öt barát gráfján (A–B, A–C, B–C, B–D, D–E) a node2vec-séta A → B lépett. Mennyi a D-re lépés valószínűsége, ha $p = 1$, $q = 0{,}5$?`,
          options: [R`$0{,}5$`, R`$0{,}25$`, R`$\approx 0{,}333$`, R`$0{,}2$`],
          answer: 0,
          hint: R`A B szomszédai: A, C, D. Melyik a visszalépés, melyik van az A-tól 1, melyik 2 lépésre? Melyik súly $1/p$, melyik $1/q$?`,
          explain: R`Súlyok: A (vissza) $1/p = 1$, C (az A szomszédja) $1$, D (az A-tól 2 lépés) $1/q = 2$. Összeg 4, a D-re $2/4 = 0{,}5$. A $0{,}25$ a $p$ és a $q$ felcserélése ($p = 0{,}5$, $q = 1$: A 2, C 1, D 1). Az $1/3$ a DeepWalk ($p = q = 1$). A $0{,}2$ a $q$-t magát használja súlynak $1/q$ helyett (D: $0{,}5$, összeg $2{,}5$) – ez épp a $q = 2$ esete, a fordítottja.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét gráfján a séta $\mathrm{Ko} \to \mathrm{Po}$ lépett. A Po szomszédai: Ko, Vi, La, Ön. Mekkora eséllyel lép a séta a helyi szereplők egyikéhez (La vagy Ön), ha $p = 1$, $q = 2$?`,
          options: [R`$1/3$`, R`$2/3$`, R`$1/2$`, R`$1/6$`],
          answer: 0,
          hint: R`A La és az Ön a Ko-tól hány lépésre van? A Vi szomszédja-e a Ko-nak?`,
          explain: R`Ko: vissza, $1/p = 1$. Vi: a Ko szomszédja, $1$. La, Ön: a Ko-tól 2 lépés, $1/q = 0{,}5$–$0{,}5$. Összeg 3: a La vagy az Ön együtt $1/3$. Nagy $q$-val a séta a Ko környékén marad (BFS-szerű). A $2/3$ a $q = 0{,}5$ esete (ott a séta a helyi szereplők felé fordul). Az $1/2$ a DeepWalk (4 szomszéd, egyenletesen). Az $1/6$ csak a La – a kérdés a kettőt együtt kérdezi. Lásd a <a class="xref" href="#s115-c-lepes">11.5 3. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a node2vec beállítását a séta viselkedésével!",
          pairs: [
            [R`$p = q = 1$`, "egyenletes séta, mint a DeepWalk"],
            [R`kis $q$ ($q \lt 1$)`, "DFS-szerű, messzire jutó séta"],
            [R`nagy $q$ ($q \gt 1$)`, "BFS-szerű, a szűk környezetben marad"],
            [R`kis $p$ ($p \lt 1$)`, "gyakran visszalép az előző csúcsra"],
            [R`nagy $p$ és kis $q$`, "a leggyorsabban jut messzire"]
          ],
          hint: R`A $p$ a visszalépés, a $q$ a távolodás súlyát osztja. Kis osztó → nagy súly.`,
          explain: R`A visszalépés súlya $1/p$, a távolodásé $1/q$. Kis $q$ → nagy távolodási súly → DFS-szerű séta (fordítva könnyű összekeverni: a kis $q$ nem BFS!). Nagy $q$ → a séta az előző csúcs környékén marad: BFS-szerű. Kis $p$ → nagy visszalépési súly. Ha a $p$ nagy (ritkán lép vissza) és a $q$ kicsi (szívesen távolodik), a séta a leggyorsabban jut messzire. $p = q = 1$-nél minden súly 1: ez a DeepWalk.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a DeepWalkra és a node2vecre? (Több jó válasz is lehet.)",
          options: [
            R`A DeepWalk lényegében a $P, P^2, \dots, P^w$ átmenetmátrixok egy logaritmusát faktorizálja (NetMF).`,
            R`Gondos összevetések szerint a jól hangolt CN, AA, RA sok gráfon versenyképes a tanult beágyazásokkal.`,
            R`A node2vec egy új szereplőnek újratanítás nélkül nem ad vektort, és a cikkek szövegét sem használja.`,
            R`BFS-szerű sétával a távoli, hasonló szerepű csúcsok (pl. két híd) megbízhatóan közel kerülnek – ezt a későbbi munkák megerősítették.`,
            R`A nyers $C_{uv}$ beágyazása jobb a PMI-nél, mert több információt őriz meg.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a „Konszenzus és vita” dobozra, és arra, mit tanul a beágyazás a hubokról, ha a gyakoriságot nem vonod le.`,
          explain: R`Igaz az első: Qiu és társai (2018) szerint a DeepWalk egy jól választott hasonlósági mátrix alacsony rangú közelítése. Igaz a második: Mara–Lijffijt–De Bie (2020) és a karateklub táblázata (RA 0,74, node2vec 0,75) is ezt mutatja. Igaz a harmadik: csúcsonként egy szabad vektor van (transzduktív); ezt oldják meg a GNN-ek. Hamis a negyedik: ez a vitatott állítás – a struc2vec-es munka megmutatta, hogy a séta a gráfban halad, így a távoli csúcsok ritkán kerülnek egy ablakba. Hamis az ötödik: a nyers gyakoriságban a hubok mindenkivel nagy értéket kapnak, a beágyazás a fokszámot tanulná meg.`
        }
      ]
    },

    /* ------------------------------------------------ 11.6 */
    "gh11-116": {
      title: "Kvíz – 11.6 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A hét eleji tanítógráf 4 pozitívjából kettőt (Ko–Kl, Sz–Kl) egyik gráfos módszer sem találhat meg. Miért?`,
          options: [
            R`Mert a Kl a tanítógráfban elszigetelt: minden pontszáma 0, és minden beágyazásban önkényes helyen áll.`,
            R`Mert a Kl-nek túl nagy a fokszáma, és a hub minden pontszámot torzít.`,
            R`Mert a két pár 2-nél messzebb van, ezt csak a Katz-index látja.`,
            R`Mert a véletlen rejtés kivette őket a tanítógráfból.`
          ],
          answer: 0,
          hint: R`Hány éle van a Kl-nek hétfőtől szerdáig?`,
          explain: R`A Kl szerdáig egyetlen cikkben sem szerepelt, a fokszáma 0. A szomszédsági heurisztikák 0-t adnak (nincs közös szomszéd), a PA is 0-t, a beágyazás pedig vagy nem ad koordinátát, vagy önkényeset. A „hub” fordítva igaz: a Kl a legkevésbé aktív. A Katz-index sem segít: elszigetelt csúcshoz semmilyen hosszú út nem vezet. Itt időbeli felosztás van, nem véletlen rejtés – a Kl-es élek egy új eseményből (E5) jönnek, amelyet a gráf múltja nem tartalmaz. Lásd a <a class="xref" href="#s116-a-valasz">11.6 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ha a két Kl-es pozitívat és az összes Kl-es párt kivesszük a kiértékelésből, 9 jelölt marad: 2 pozitív (Ko–Sz, Po–Ön, mindkettő CN = 1) és 7 negatív (három 1-es, négy 0-s CN-nel). Mennyi a CN AUC-ja?`,
          options: [R`$11/14 \approx 0{,}786$`, R`$8/14 \approx 0{,}571$`, R`$14/14 = 1$`, R`$27/44 \approx 0{,}614$`],
          answer: 0,
          hint: R`$2 \cdot 7 = 14$ összevetés. Egy 1-es pozitív hány 0-s negatívat győz le, és hány 1-essel áll holtversenyben?`,
          explain: R`Pozitívonként 4 nyert (a 0-sak ellen) és 3 holtverseny ($3 \cdot \tfrac12$): $5{,}5$; kettő $11$, $11/14 \approx 0{,}786$. A $0{,}571$ a holtversenyt 0-nak, az 1 a holtversenyt 1-nek számolja. A $0{,}614$ az eredeti, Kl-lel együtt mért AUC. Az elszigetelt csúcsot kihagyva a módszer sokkal jobbnak látszik – ezért mindig közöld, mit hagytál ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hét eleji kiértékelésben 4 pozitív és 11 negatív van. Legfeljebb mennyit mozdíthat az AUC-n egyetlen pozitív helyének megváltozása?`,
          options: [R`$0{,}25$`, R`$\approx 0{,}023$`, R`$\approx 0{,}091$`, R`$0{,}5$`],
          answer: 0,
          hint: R`Hány összevetésben szerepel egy pozitív, és hány összevetés van összesen?`,
          explain: R`Egy pozitív 11 összevetésben szerepel a 44-ből; ha a rangsor végéről az élére kerül, mind a 11 vesztésből nyerés lesz: $11/44 = 0{,}25$. Az $1/44 \approx 0{,}023$ egyetlen összevetést számol. Az $1/11 \approx 0{,}091$ a pozitív saját 11 összevetésén belüli egyetlen változás – nem a 44-hez mért teljes elmozdulás. A $0{,}5$ a pozitívak felét (kettőt) mozgatná. Ezért a 0,61 és a 0,66 közötti különbség itt semmit sem bizonyít.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklub táblázatában (10% tesztél, 100 felosztás) melyik módszer nyeri a legtöbbet a szivárgással?`,
          options: [
            R`spektrális 8D: $0{,}537 \to 0{,}859$ ($+0{,}322$)`,
            R`spektrális 2D: $0{,}598 \to 0{,}820$ ($+0{,}222$)`,
            R`DeepWalk (PPMI, 8D): $0{,}705 \to 0{,}888$ ($+0{,}183$)`,
            R`pref. kapcsolódás: $0{,}711 \to 0{,}852$ ($+0{,}141$)`
          ],
          answer: 0,
          hint: R`Nem a legnagyobb szivárgó AUC a kérdés, hanem a legnagyobb különbség.`,
          explain: R`A spektrális 8D nyer a legtöbbet: $+0{,}322$ – a tiszta méréssel a leggyengébb, szivárgással a második legjobb lenne. A PPMI-nek a legnagyobb a szivárgó AUC-ja ($0{,}888$), de a növekedése csak $0{,}183$ – ez a tipikus félreolvasás. A spektrális 2D ($+0{,}222$) és a PA ($+0{,}141$) is sokat nyer, a CN-alapúak alig (CN $+0{,}007$), a Jaccard pedig veszít. Lásd a <a class="xref" href="#s116-b-karate">11.6 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon a node2vec AUC-ja $0{,}748 \pm 0{,}071$, az RA-é $0{,}738 \pm 0{,}111$. Mit mondhatsz?`,
          options: [
            R`A különbség (0,01) jóval kisebb a szórásnál; egy becsületes összevetés ugyanazokon a felosztásokon a páros különbséget nézné.`,
            R`A node2vec szignifikánsan jobb, mert az átlaga nagyobb.`,
            R`Az RA jobb, mert a szórása nagyobb, így néha sokkal jobb eredményt ad.`,
            R`Egyetlen, jól megválasztott felosztáson eldönthető, melyik a jobb.`
          ],
          answer: 0,
          hint: R`Mekkora a különbség a szóráshoz képest? És mit mutat a szórás egy-egy felosztásról?`,
          explain: R`$0{,}748 - 0{,}738 = 0{,}01$, a szórás $0{,}07$–$0{,}11$: egy-egy felosztáson bármelyik lehet az első. Az átlag nagyobb volta egymagában nem szignifikancia. A nagyobb szórás nem előny, hanem bizonytalanság. Egyetlen felosztásból módszert választani a tipikus hiba – sok felosztás átlaga és szórása (vagy a páros különbség) kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért <b>csökken</b> a Jaccard AUC-ja a karateklubon a szivárgással ($0{,}610 \to 0{,}565$)?`,
          options: [
            R`A tesztél végpontjainak szomszédságába bekerül a másik végpont: az unió nő, a közös szomszédok száma nem.`,
            R`Mert a szivárgás minden módszert egyformán ront.`,
            R`Mert a Jaccard a fokszámszorzatot nézi, és az a szivárgással csökken.`,
            R`Véletlen ingadozás: a szivárgás a Jaccardra nem hat.`
          ],
          answer: 0,
          hint: R`Ha a $u$–$v$ tesztél a pontozó gráfban van, mi kerül az $N(u)$-ba? A számlálót vagy a nevezőt növeli ez?`,
          explain: R`A szivárgó gráfban $v \in N(u)$ és $u \in N(v)$, ezek az unióba kerülnek, de egyik sem közös szomszéd. A pozitívak Jaccard-pontszáma így csökkenhet. A szivárgás nem egyformán hat: a PA-t és a beágyazásokat erősen emeli, a CN-t alig, a Jaccardot rontja – ezért nem lehet „utólag levonni”. A Jaccard a közös szomszédok arányát nézi, nem a fokszámszorzatot (az a PA).`
        },
        {
          type: "multi",
          q: "Melyik lépés tartozik egy becsületes kapcsolat-előrejelzés ellenőrző listájához? (Több jó válasz is lehet.)",
          options: [
            R`Minden fokszámot, sétát és beágyazást a felosztás után, csak a tanítógráfon számolsz.`,
            R`Időbélyeges adatnál időbeli vágást használsz, nem véletlen rejtést.`,
            R`A hiperparamétereket (pl. a dimenziót) validációs éleken hangolod.`,
            R`Ha a szivárgó és a tiszta AUC eltér, a nagyobbat közlöd, mert az mutatja a módszer lehetőségeit.`,
            R`A beágyazás dimenzióját addig növeled, amíg a teszt AUC nő.`
          ],
          answer: [0, 1, 2],
          hint: R`Melyik opció használja a teszt információját a módszer kialakítására vagy a jelentésre?`,
          explain: R`Az első három a lista része: pontozó gráf = tanítógráf, időbeli adatnál időbeli felosztás, hangolás validációs éleken. A szivárgó számot közölni hiba: szebb, de mást rangsorol (a spektrális 8D a leggyengébből a második legjobb lenne). A dimenziót a teszten hangolni szintén szivárgás – és a „több dimenzió jobb” sem igaz: a spektrálisnál a 8D rosszabb a 2D-nél. Lásd a <a class="xref" href="#s116-c-lista">11.6 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy statikus gráfból véletlenül elrejtett élekkel mérsz. Mit mond ez a mérés?`,
          options: [
            R`Azt, mennyire rekonstruálja a módszer a meg nem figyelt kapcsolatokat – időbeli kérdésre („mi jön a jövő héten?”) nem ad választ.`,
            R`Azt, hogy a módszer a jövőbeli éleket milyen jól jósolja, mert a rejtett él is „még nem látott” él.`,
            R`Azt, hogy a Kormány és a Szakértő milyen eséllyel fog ténylegesen találkozni.`,
            R`Semmit: véletlen rejtéssel mért AUC sosem értelmes.`
          ],
          answer: 0,
          hint: R`A „hiányzó él” és a „jövőbeli él” ugyanaz a feladat?`,
          explain: R`A véletlen rejtés a hiányzó élek feladatát méri: mennyire tudja a módszer kitölteni a gráf meg nem figyelt részét (pl. egy lap ki nem írt együttemlítéseit). A jövőbeli élekhez időbeli felosztás kell – a jövő a múlttól eltérhet (új téma, új szereplő). Az együttemlítés jóslása pedig a tudósítás mintázatáról szól, nem az eseményekről. A véletlen rejtés statikus gráfon (pl. a karateklubon) helyes eljárás, csak más kérdésre felel.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh11-final": {
      title: "Fejezetzáró teszt – 11. Csúcsbeágyazások és kapcsolat-előrejelzés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy hírkorpuszban 1000 szereplő van, mindegyiknek átlagosan 10 partnere (irányítatlan gráf). Hány jelölt pár van?`,
          options: [R`$494\,500$`, R`$499\,500$`, R`$989\,000$`, R`$999\,000$`],
          answer: 0,
          hint: R`Hány él van, ha minden élt két végpont „lát”? Aztán: a jelöltek a nem élek, és irányítatlanul a sorrend nem számít.`,
          explain: R`Élek: $1000 \cdot 10/2 = 5000$. Párok: $\binom{1000}{2} = 499\,500$, jelöltek: $499\,500 - 5000 = 494\,500$. A $499\,500$ a meglévő éleket is jelöltnek veszi. A $989\,000 = 1000 \cdot 999 - 10\,000$ rendezett párokkal számol, a $999\,000 = n(n-1)$ ráadásul az éleket sem vonja le. Lásd a <a class="xref" href="#s111-a">11.1 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hét eleji tanítógráf (H–Sze) után a hét végén ezek az élek jelennek meg: Ko–Po, Po–La, La–Ön, Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön. Hány pozitív pár van?`,
          options: [R`$4$`, R`$7$`, R`$3$`, R`$15$`],
          answer: 0,
          hint: R`Pozitív az a <i>jelölt</i>, amely később él lesz. Melyik hét végi él volt már a tanítógráfban is?`,
          explain: R`A Ko–Po, a Po–La és a La–Ön már a tanítógráfban is él – nem jelölt, így nem lehet pozitív (visszatérő él). Marad 4: Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön. A 7 a visszatérő éleket is pozitívnak veszi. A 3 éppen a visszatérő élek száma. A 15 a jelöltek száma, nem a pozitívaké. Lásd a <a class="xref" href="#s111-b">11.1 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: A–B, A–C, B–D, C–D, C–E, C–F. Mennyi az A–D pár Adamic–Adar-pontszáma?`,
          options: [R`$\approx 2{,}164$`, R`$0{,}750$`, R`$\approx 2{,}885$`, R`$\approx 1{,}443$`],
          answer: 0,
          hint: R`Kik a közös szomszédok, és mekkora az ő fokszámuk? Az AA a közös szomszéd fokszámának logaritmusával oszt.`,
          explain: R`Közös szomszéd: B ($k = 2$) és C ($k = 4$). $\mathrm{AA} = 1/\ln 2 + 1/\ln 4 \approx 1{,}443 + 0{,}721 = 2{,}164$. A $0{,}75 = 1/2 + 1/4$ az RA (logaritmus nélkül). A $2{,}885 = 2/\ln 2$ a pár saját fokszámát ($k_A = k_D = 2$) használja a közös szomszédoké helyett. Az $1{,}443$ csak a B-t veszi figyelembe. Lásd a <a class="xref" href="#s112-c">11.2 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes héten a $\mathrm{Po}\text{–}\mathrm{Sz}$ és a $\mathrm{Vi}\text{–}\mathrm{Kl}$ párnak is 2 közös szomszédja van; a PA-juk 12, illetve 6. Melyik állítás igaz?`,
          options: [
            R`A PA az aktivitás miatt teszi előre a Po–Sz-t; a Jaccard épp fordítva rangsorol ($0{,}4$ vs. $2/3$).`,
            R`A Po–Sz kétszer olyan hasonló, mint a Vi–Kl, mert a PA-ja kétszeres.`,
            R`A Jaccard is a Po–Sz-t teszi előre, mert több szomszédja van.`,
            R`Az Adamic–Adar különbséget tesz köztük, mert a Po fokszáma 4.`
          ],
          answer: 0,
          hint: R`Mit mér a PA, és mi a Jaccard nevezője? Az AA kinek a fokszámát használja?`,
          explain: R`A PA a fokszámszorzat: aktivitást mér, nem hasonlóságot (a közös szomszédokat nem is nézi). A Jaccard a nagy uniót bünteti: Po–Sz $2/5 = 0{,}4$, Vi–Kl $2/3$ – a kis csúcsokat hozza előre. Az AA a közös szomszédok fokszámát használja, nem a párét: a Po–Sz közös szomszédai (Ko 4, Vi 3) és a Vi–Kl közös szomszédai (Ko 4, Sz 3) ugyanolyan fokúak, ezért mindkettő AA-ja $1{,}632$ (és RA-ja $0{,}583$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy módszer pontszámai: pozitívak $3, 1, 1$; negatívak $1, 0$. Mennyi az AUC?`,
          options: [R`$\approx 0{,}833$`, R`$1{,}000$`, R`$\approx 0{,}667$`, R`$\approx 0{,}167$`],
          answer: 0,
          hint: R`$3 \cdot 2 = 6$ összevetés. Mennyit ér egy holtverseny?`,
          explain: R`A 3-as pozitív mindkét negatívat legyőzi (2). Egy 1-es pozitív: az 1-essel holtverseny ($\tfrac12$), a 0-st legyőzi (1) – $1{,}5$, kettő $3$. Összesen $5/6 \approx 0{,}833$. Az 1 a holtversenyt nyerésnek, a $0{,}667$ vesztésnek számolja. A $0{,}167 = 1 - 0{,}833$ a fordított pontszám AUC-ja. Lásd a <a class="xref" href="#s113-b">11.3 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`1000 pozitív és $99\,000$ negatív pár van. Egy küszöbnél a módszer a pozitívak 90%-át és a negatívak 2%-át teszi a küszöb fölé. Mekkora a precizitás?`,
          options: [R`$\approx 0{,}31$`, R`$\approx 0{,}90$`, R`$\approx 0{,}98$`, R`$\approx 0{,}69$`],
          answer: 0,
          hint: R`Számold ki darabra a TP-t és az FP-t. A 2% kicsi arány – de miből?`,
          explain: R`TP $= 900$, FP $= 0{,}02 \cdot 99\,000 = 1980$. Precizitás $= 900/2880 \approx 0{,}31$: a jóslatok több mint kétharmada téves. A $0{,}90$ a TPR (recall), nem a precizitás. A $0{,}98$ a pontosság (helyesen osztályozott párok aránya) – a rengeteg negatív miatt ez is félrevezető. A $0{,}69$ a téves jóslatok aránya. A ROC-görbe jó pontja tehát gyenge felső polcot adhat; az AUC nem függ a negatívak számától, a precizitás igen. Lásd a <a class="xref" href="#s113-c">11.3 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik a helyes sorrend egy node2vec-es kapcsolat-előrejelzés kiértékelésénél?`,
          options: [
            R`felosztás → séták és beágyazás a tanítógráfon → pontozás és mérés a tesztéleken`,
            R`séták és beágyazás a teljes gráfon → felosztás → pontozás`,
            R`beágyazás a teljes gráfon → pontozás → a tesztélek kivétele a rangsorból`,
            R`felosztás → beágyazás a teljes gráfon (több adat) → pontozás a tesztéleken`
          ],
          answer: 0,
          hint: R`Mi a pontozó gráf, és benne lehetnek-e a tesztélek?`,
          explain: R`A pontozó gráf a tanítógráf: minden, ami a gráfból számol (fokszám, séta, beágyazás), a felosztás után jön. Ha előbb beágyazol, aztán osztasz fel, a séták a tesztéleken is átmentek – a módszer a választ olvassa ki. A „több adat” érv ugyanez a szivárgás. A tesztélek utólagos kivétele a rangsorból nem segít: a beágyazás már látta őket. A karateklubon a szivárgó PPMI-beágyazás így $0{,}705$ helyett $0{,}888$-at ad. Lásd a <a class="xref" href="#s113-d">11.3 4. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 4 levelű csillag (középen K, levelek 1, 2, 3, 4; élek K–1, K–2, K–3, K–4) Laplace-sajátértékei $0, 1, 1, 1, 5$. Mit mondhatsz a 2D spektrális beágyazásról?`,
          options: [
            R`Nem egyértelmű: a háromszoros $\mu = 1$ sajátterének bármely két iránya jó, és két levél távolsága is a választástól függ – csak mind a hármat bevéve egyértelmű.`,
            R`Egyértelmű, csak forgatható; a levelek közötti távolságok mindig ugyanazok.`,
            R`A $\mu = 5$-höz tartozó vektor is kell, mert a K-t csak az választja el a levelektől.`,
            R`Egyértelmű: a 2. és a 3. sajátvektort a numerikus módszer mindig ugyanúgy adja.`
          ],
          answer: 0,
          hint: R`Ha a többszörös sajátérték sajátteréből csak egy részt veszel, a forgatás ugyanabban a síkban marad-e?`,
          explain: R`A $\mu = 1$ háromszoros: a sajáttere háromdimenziós. A 2D beágyazás ebből egy síkot választ, és a különböző síkok más-más távolságot adnak (Pythonnal: két levél távolsága választástól függően kb. 0,7 és 1,4 között). Ha mind a hármat beveszed, a négy levél egymástól egyformán $\approx 1{,}414$-re kerül, ez már egyértelmű. Az „egyértelmű, csak forgatható” a kétszeres sajátértékre (pl. a 3 levelű csillagra) igaz, ha az egész sajátteret beveszed. A $\mu = 5$ a legnagyobb, a legugrálóbb irány – nem kell. A numerikus módszer választása önkényes, nem tudás. Lásd a <a class="xref" href="#s114-c">11.4 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes héten a $\mathrm{Vi}\text{–}\mathrm{Kl}$ párnak 2 közös szomszédja van ($J = 2/3$), mégis a 2D spektrális beágyazásban ez a legtávolabbi jelölt ($1{,}338$). Mi a helyes következtetés?`,
          options: [
            R`A 2D beágyazás tömörít, nem minden párt tud jól elhelyezni; a pontszámot több dimenzióban kell számolni, a 2D csak szemléltetés.`,
            R`A CN és a Jaccard téved: a Vi–Kl valójában valószínűtlen pár.`,
            R`Számolási hiba: két közös szomszédú pár nem lehet távol.`,
            R`A Kl a $y$ tengelyen lent áll, mert a Kl „negatív” szereplő.`
          ],
          answer: 0,
          hint: R`Hány számmal írja le a 2D beágyazás a 7 csúcsot? És jelentenek-e valamit a tengelyek?`,
          explain: R`7 csúcsot 2 számmal leírni veszteséges: a Kl-t a 3. sajátvektor külön irányba húzza, ezért a Vi-től messze kerül. Ez a beágyazás korlátja, nem a heurisztikáké – két módszer ugyanarra a párra más-más jelet lát. A számolás helyes (Pythonnal ellenőrizve). A tengelyeknek és az előjelnek nincs önálló jelentése: a $-\mathbf u$ is sajátvektor. Lásd a <a class="xref" href="#s114-b">11.4 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány skip-gram tanítópárt ad egy 8 hosszú séta $\pm 3$-as ablakkal?`,
          options: [R`$36$`, R`$18$`, R`$48$`, R`$42$`],
          answer: 0,
          hint: R`$2\sum_{j=1}^{w}(\ell - j)$: hány $j$ távolságú szópár van egy $\ell$ hosszú mondatban?`,
          explain: R`$2(7 + 6 + 5) = 36$. A 18 csak az egyik irányt számolja. A $48 = 2 \cdot 3 \cdot 8$ minden szónak teljes ablakot ad, pedig a séta két végén csonka. A $42 = 2(8 + 7 + 6)$ eggyel elcsúsztatja az összeget: $j$ távolságú párból $\ell - j$ van, nem $\ell - j + 1$. Lásd a <a class="xref" href="#s115-a">11.5 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét gráfján a node2vec-séta $\mathrm{Vi} \to \mathrm{Ko}$ lépett. A Ko szomszédai: Vi, Po, Sz, Kl; a Vi szomszédai: Ko, Po, Sz. Mennyi a Kl-re lépés valószínűsége, ha $p = 2$, $q = 0{,}5$?`,
          options: [R`$\approx 0{,}444$`, R`$\approx 0{,}111$`, R`$0{,}250$`, R`$\approx 0{,}167$`],
          answer: 0,
          hint: R`Melyik szomszéd a visszalépés, melyik szomszédja a Vi-nek is, és melyik van a Vi-től 2 lépésre?`,
          explain: R`Vi: vissza, $1/p = 0{,}5$. Po és Sz: a Vi szomszédai, $1$–$1$. Kl: a Vi-től 2 lépés, $1/q = 2$. Összeg $4{,}5$: a Kl-re $2/4{,}5 \approx 0{,}444$. A $0{,}111$ a $p$ és a $q$ felcserélése ($p = 0{,}5$, $q = 2$). A $0{,}25$ a DeepWalk (4 szomszéd egyenletesen). A $0{,}167$ a paramétereket magukat használja súlynak ($p$, $q$ az $1/p$, $1/q$ helyett). Lásd a <a class="xref" href="#s115-c">11.5 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon, ha a pontozó gráf a teljes gráf (szivárgás), melyik módszer lenne a <b>második</b> legjobb?`,
          options: [
            R`a spektrális 8D ($0{,}859$)`,
            R`a pref. kapcsolódás ($0{,}852$)`,
            R`a node2vec ($0{,}851$)`,
            R`a DeepWalk (PPMI, 8D) ($0{,}888$)`
          ],
          answer: 0,
          hint: R`Rendezd a szivárgó oszlopot csökkenő sorrendbe. Vigyázz: a legnagyobb érték az első helyezetté.`,
          explain: R`Szivárgó sorrend: PPMI $0{,}888$, spektrális 8D $0{,}859$, PA $0{,}852$, node2vec $0{,}851$ … A második tehát a spektrális 8D – amely tisztán mérve $0{,}537$-tel a leggyengébb. A PPMI az első, nem a második. A PA ($0{,}852$) és a node2vec ($0{,}851$) hajszállal mögötte van; a node2vec tisztán mérve az első ($0{,}748$). A tanulság: a szivárgó számok nemcsak szebbek, hanem mást is rangsorolnak. Lásd a <a class="xref" href="#s116-b">11.6 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hírportál azt kérdezi: „egy ma először említett politikus kivel fog együtt szerepelni?” Mit ajánlasz?`,
          options: [
            R`Csúcsjellemzőket (párt, tisztség, a cikk szövege) és egy induktív modellt, amely jellemzőkből számol vektort (pl. GNN).`,
            R`node2vec-et, mert a séták a politikust is elérik.`,
            R`Adamic–Adart, mert a ritka közös szomszéd többet ér.`,
            R`Spektrális beágyazást a teljes gráf újraszámolásával – így az új csúcsnak is lesz koordinátája.`
          ],
          answer: 0,
          hint: R`Hány éle van a politikusnak a gráfban? Mit tud a gráf egy éltelen csúcsról?`,
          explain: R`Egy éltelen csúcsról a gráf semmit sem tud: a heurisztikák 0-t adnak, a DeepWalk és a node2vec transzduktív (nincs vektora, és a séták sem érik el), a spektrális beágyazás újraszámolva is csak önkényes helyet ad egy elszigetelt csúcsnak – ahogy a Kl-nek a hét elején. Az újhoz külső információ kell: csúcsjellemzők és induktív modell. Lásd a <a class="xref" href="#s116-a">11.6 1. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az AUC nem függ a negatívak számától, csak az eloszlásuktól – a precizitás viszont igen.`,
            R`Nehéz (2 távolságú) negatívakkal a karateklubon a CN AUC-ja 0,68-ról 0,47-re esik.`,
            R`A node2vec-ben a kis $q$ BFS-szerű, szűk környezetet bejáró sétát ad.`,
            R`A spektrális beágyazásnál a több dimenzió mindig jobb kapcsolat-előrejelzést ad.`,
            R`A szivárgás a CN-t erősen felfelé torzítja, a beágyazásokat alig.`
          ],
          answer: [0, 1],
          hint: R`Gondold végig a 11.3 negatív mintavételét, a node2vec két paraméterét és a karateklub táblázatát.`,
          explain: R`Igaz az első: az AUC párösszevetés, a negatívak számának növelése az arányt nem változtatja (ha az eloszlás ugyanaz). Igaz a második: a CN tudása nagyrészt a közeli és a távoli párok szétválasztása; közeli negatívak között alig dönt. Hamis a harmadik: fordítva – kis $q$ → távolodás → DFS-szerű; a BFS-szerű sétához nagy $q$ kell. Hamis a negyedik: a karateklubon a spektrális 8D ($0{,}537$) rosszabb a 2D-nél ($0{,}598$). Hamis az ötödik: épp fordítva – a CN alig változik ($0{,}691 \to 0{,}698$), a beágyazások és a PA nagyot ugranak. Lásd a <a class="xref" href="#s113-c-nehez">nehéz negatívakat</a> és a <a class="xref" href="#s116-b-karate">karateklub táblázatát</a>.`
        }
      ]
    },

}; })();
