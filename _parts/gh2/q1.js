    /* ------------------------------------------------ 2.1 */
    "gh2-21": {
      title: "Kvíz – 2.1 Séta, vonal, út, kör",
      questions: [
        {
          type: "match",
          q: R`A 2.1 gráfjában (élek: $AB, AC, BC, BD, CD, DE, EF$) milyen fajta a lépéssorozat? Párosítsd!`,
          pairs: [
            [R`$A, C, D, E, F$`, "út"],
            [R`$C, A, B, D, C, B$`, "vonal, de nem út"],
            [R`$A, B, A, C$`, "séta, de nem vonal"],
            [R`$B, C, D, B$`, "kör"],
            [R`$A, D, E$`, "nem is séta"]
          ],
          hint: "Sorban nézd meg: minden lépés él-e? Ismétlődik-e él? Ismétlődik-e csúcs? Visszatér-e a kezdőpontba?",
          explain: R`Az $A, D, E$ nem séta, mert nincs $AD$ él. Az $A, C, D, E, F$ egyetlen csúcsot sem ismétel: út. A $C, A, B, D, C, B$ élei ($CA, AB, BD, DC, CB$) mind különbözők, de a $C$ és a $B$ kétszer szerepel: vonal, de nem út. Az $A, B, A, C$ kétszer megy át az $AB$ élen: csak séta. A $B, C, D, B$ zárt, 3 hosszú, és csak a kezdő- és végpont azonos: kör. Tipikus hiba a vonalat útnak hinni („nincs ismétlődő él, tehát út”) – az úthoz a csúcs sem ismétlődhet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi az $A, B, C, D, B, C, D, E, F$ séta hossza?`,
          options: ["8", "9", "6", "4"],
          answer: 0,
          hint: "A hossz a megtett lépések száma. Az ismétlődő lépés is lépés.",
          explain: R`A sétában 9 csúcs áll, köztük 8 lépés (él), tehát a hossza 8. A 9 a csúcsokat számolja (a hossz élben mérendő). A 6 a <em>különböző</em> élek (vagy csúcsok) száma – de a $BC$ és a $CD$ élen kétszer megyünk át, és mindkétszer számít. A 4 a legrövidebb $A$–$F$ út hossza, nem ennek a sétának a hossza.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Minden út vonal.",
            "Ha két csúcs között van séta, akkor út is van köztük.",
            R`Egy $n$ csúcsú gráfban egy út hossza legfeljebb $n - 1$.`,
            "Minden vonal út, hiszen egyik sem ismétel élt.",
            R`Egy $n$ csúcsú gráfban egy séta hossza legfeljebb $n - 1$.`
          ],
          answer: [0, 1, 2],
          hint: "Gondold végig, mit tilt a vonal és mit az út. A sétára van-e bármi korlát?",
          explain: R`Az út nem ismétel csúcsot, így élt sem: minden út vonal (és minden vonal séta). Fordítva nem: a vonal csak az élismétlést tiltja, a csúcs ismétlődhet (pl. $A, B, C, D, B$). Ha egy séta egy csúcsot kétszer érint, a köztes kitérőt kivágva rövidebb séta marad – ezt ismételve utat kapunk. Egy út legfeljebb $n$ csúcsot és így $n - 1$ élt tartalmaz. A séta hossza viszont nincs korlátozva: oda-vissza lépkedhetünk.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $K_4$ teljes gráfban (csúcsok: $A, B, C, D$, mind a 6 él megvan) hány különböző út vezet $A$-ból $D$-be?`,
          options: ["5", "4", "3", "végtelen sok"],
          answer: 0,
          hint: "Csoportosítsd az utakat hossz szerint: 1, 2 és 3 hosszúak. Ne feledd a közvetlen élt!",
          explain: R`Hossz szerint: 1 hosszú: $A, D$; 2 hosszú: $A, B, D$ és $A, C, D$; 3 hosszú: $A, B, C, D$ és $A, C, B, D$. Összesen 5. A 4 a közvetlen él kihagyása, a 3 csak a legfeljebb 2 hosszúakat számolja. Végtelen sok <em>séta</em> van (oda-vissza lépkedhetünk), de út nem ismételhet csúcsot, így véges sok van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy négyzetnek behúztuk az egyik átlóját: élek $AB, BC, CD, DA, AC$. Hány köre van a gráfnak?`,
          options: ["3", "2", "6", "1"],
          answer: 0,
          hint: "Az átló két háromszögre bontja a négyzetet – de a négyzet kerülete is kör marad.",
          explain: R`A körök: $A, B, C, A$; $A, C, D, A$ (a két háromszög) és $A, B, C, D, A$ (a külső négyszög). A 2 a négyszöget felejti ki, az 1 csak a négyszöget látja. A 6 ugyanazt a kört mindkét irányban külön számolja – de ugyanazt a kört más kezdőponttal vagy fordított irányban nem számoljuk újra.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kör-e az $A, B, A$ zárt séta (ahol $AB$ él)?`,
          options: [
            "Nem: a kör legalább 3 hosszú, ez pedig ugyanazon az élen megy oda-vissza.",
            "Igen: zárt, és csak a kezdő- és a végpont azonos.",
            "Igen, egy 2 hosszú kör.",
            "Nem, mert zárt séta sosem lehet kör."
          ],
          answer: 0,
          hint: "Nézd meg a kör definíciójában a hosszra vonatkozó feltételt – és hogy miért van ott.",
          explain: R`A kör legalább 3 hosszú zárt séta, amelyben a kezdő- és végpontot leszámítva nem ismétlődik csúcs. Az $A, B, A$ a csúcsfeltételt teljesítené, de csak 2 hosszú: ugyanazon az $AB$ élen menne oda-vissza, ezt nem tekintjük körnek. Ezért kell a „legalább 3”. Az utolsó opció is rossz: a kör éppen egy speciális zárt séta (pl. $A, B, C, A$).`
        },
        {
          type: "match",
          q: "Melyik angol szakszó melyik magyar fogalomnak felel meg? Párosítsd!",
          pairs: [
            ["walk", "séta"],
            ["trail", "vonal"],
            ["path (simple path)", "út"],
            ["cycle", "kör"],
            ["shortest path", "legrövidebb út"]
          ],
          hint: "A legszigorúbb fogalom (nincs ismétlődő csúcs) a path, a leglazább a walk.",
          explain: R`walk = séta, trail = vonal (egyes magyar könyvekben élsorozat), path = út, cycle = kör. Vigyázz: az angol szakirodalom egy része a path szót lazán sétára is használja. A shortest path viszont mindig út, mert a legrövidebb séta sosem ismétel csúcsot.`
        }
      ]
    },

    /* ------------------------------------------------ 2.2 */
    "gh2-22": {
      title: "Kvíz – 2.2 Összefüggőség és komponensek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$V = \{1, \dots, 8\}$, $E = \{12, 23, 13, 34, 56\}$. Hány komponense van a gráfnak?`,
          options: ["4", "2", "3", "5"],
          answer: 0,
          hint: "Keresd meg az egymással összeköthető csúcsok csoportjait. Van-e olyan csúcs, amelyre egyetlen él sem illeszkedik?",
          explain: R`A komponensek: $\{1, 2, 3, 4\}$, $\{5, 6\}$, $\{7\}$, $\{8\}$ – négy. A 2 az izolált csúcsokat hagyja ki, pedig mindegyik külön komponens. A 3 az $n - m = 8 - 5$: ez csak alsó korlát ($c \ge n - m$), és itt nem éles, mert az $13$ él két már összekötött csúcsot köt össze. Az 5 azt hiszi, hogy minden él egy-egy külön darabot ad.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 9 csúcsú gráfnak 8 éle van. Mit mondhatsz az összefüggőségéről?",
          options: [
            "Lehet összefüggő, de nem biztos, hogy az.",
            R`Biztosan összefüggő, mert megvan a szükséges $n - 1$ él.`,
            "Biztosan nem összefüggő, mert kevés az éle.",
            "Biztosan összefüggő és körmentes."
          ],
          answer: 0,
          hint: R`Az $n - 1$ él szükséges az összefüggéshez. Elég is? Próbálj 8 élt egy kisebb csúcshalmazba zsúfolni.`,
          explain: R`Az összefüggéshez legalább $n - 1 = 8$ él kell – ez megvan, tehát lehet összefüggő (pl. egy 9 csúcsú út). De nem biztos: a 8 él elfér 5 csúcson is (a $K_5$ 10 élének 8-a), és akkor a maradék 4 csúcs izolált. Az „$n - 1$ él ⇒ összefüggő” tipikus hiba: a feltétel szükséges, de nem elégséges.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 7 szereplős Árvízhét-gráfban csak az Esti Krónika cikkeit vesszük (élek: $\mathrm{Sz}$–$\mathrm{Vi}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$). Hány komponens van?`,
          options: ["4", "1", "2", "3"],
          answer: 0,
          hint: "Mind a 7 szereplő csúcs marad, akkor is, ha az Esti Krónikában nem szerepel.",
          explain: R`Egy négycsúcsú komponens: $\{\mathrm{Sz}, \mathrm{Vi}, \mathrm{Kl}, \mathrm{Ko}\}$. A Polgármester, a Lakók és az Önkéntesek ebben a lapban nem szerepelnek, így három izolált csúcs – mindegyik külön komponens. Összesen 4. Az 1 az izolált csúcsokat felejti el.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Egy él pontosan akkor híd, ha nincs rajta egyetlen körön sem.",
            R`A $P_5$ útban mind a 4 él híd.`,
            "A legnagyobb fokszámú csúcs mindig elvágó csúcs.",
            "Ha egy gráfban van elvágó csúcs, akkor híd is van benne.",
            R`A $C_5$ körben minden él híd.`
          ],
          answer: [0, 1],
          hint: "Ha egy él egy körön van, el lehet-e jutni nélküle is az egyik végpontjából a másikba?",
          explain: R`Ha az $uv$ él egy körön van, nélküle a kör másik ívén is eljutunk $u$-ból $v$-be, tehát nem híd; ha nincs körön, ez az egyetlen kapcsolat. A $P_5$-ben nincs kör, így minden éle híd; a $C_5$-ben minden él a körön van, így egyik sem. Az elvágás a szerkezeten múlik, nem a fokszámon: az Árvízhéten a Kormány fokszáma is 4, mégsem elvágó. Elvágó csúcs ≠ híd: az Árvízhéten a Polgármester elvágó, de híd nincs.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB, AC, AD, AE, AG$, $BC, CD, DE, EG, GB$ (egy „kerék”: $A$ a középpont) és még $BF$. Melyik csúcs elvágó?`,
          options: [R`csak a $B$`, R`csak az $A$`, R`csak az $F$`, R`az $A$ és a $B$`],
          answer: 0,
          hint: "Vegyél ki egy-egy csúcsot (az éleivel együtt): szétesik-e a maradék? A fokszám itt félrevezethet.",
          explain: R`Az $F$-hez csak a $BF$ él vezet, így a $B$ elhagyásával az $F$ izolált lesz: a $B$ elvágó. Az $A$-nak a legnagyobb a fokszáma (5), de nélküle a $B, C, D, E, G$ kör és az $F$ együtt marad – nem elvágó. Az $F$ levél: elhagyása után a többi összefüggő marad. A $BF$ él viszont híd – ne keverd össze a hidat a végpontjával.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét gráfjában a Kormány és a Polgármester fokszáma is 4. Melyik elvágó csúcs?",
          options: [
            "Csak a Polgármester",
            "Mindkettő, mert ők a legnagyobb fokszámúak",
            "Csak a Kormány",
            "Egyik sem, mert a gráfban nincs híd"
          ],
          answer: 0,
          hint: "Képzeld el a gráfot a Kormány nélkül, aztán a Polgármester nélkül. Kit köt össze kivel?",
          explain: R`A Polgármester nélkül a gráf két darabra esik: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ és $\{\mathrm{La}, \text{Ön}\}$ – a Lakókat és az Önkénteseket csak ő köti a többiekhez. A Kormány nélkül a többiek összefüggők maradnak (pl. $\mathrm{Kl}, \mathrm{Sz}, \mathrm{Vi}, \mathrm{Po}, \mathrm{La}$). A fokszám nem dönti el, ki elvágó. Az, hogy nincs híd, nem zárja ki az elvágó csúcsot: a két fogalom különbözik.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 7 csúcsú gráf két komponensből áll. Legfeljebb hány éle lehet?",
          options: ["15", "9", "11", "21"],
          answer: 0,
          hint: "Minden komponens legfeljebb teljes gráf lehet. Hogyan oszd szét a 7 csúcsot két részre, hogy a legtöbb él jöjjön ki?",
          explain: R`Ha az egyik komponens egy izolált csúcs, a másik egy $K_6$: $\binom62 = 15$ él. Kiegyensúlyozottabb felosztás kevesebbet ad: $K_5 + K_2$ esetén $10 + 1 = 11$, $K_4 + K_3$ esetén $6 + 3 = 9$. A 21 a $K_7$ élszáma – az viszont összefüggő.`
        }
      ]
    },

    /* ------------------------------------------------ 2.3 */
    "gh2-23": {
      title: "Kvíz – 2.3 Távolság és szélességi bejárás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB, AC, BD, CE, DE, EF$. Szélességi bejárást (BFS) végzünk az $A$-ból. Melyek a rétegek?`,
          options: [
            R`0: $A$ · 1: $B, C$ · 2: $D, E$ · 3: $F$`,
            R`0: $A$ · 1: $B, C$ · 2: $D$ · 3: $E$ · 4: $F$`,
            R`0: $A$ · 1: $B$ · 2: $D$ · 3: $E$ · 4: $C, F$`,
            R`0: $A$ · 1: $B, C$ · 2: $D, E, F$`
          ],
          answer: 0,
          hint: "Egy réteg a még nem látott szomszédok összessége. Mikor éred el először az E-t?",
          explain: R`Az 1. réteg az $A$ szomszédai: $B, C$. A 2. réteg az ő még nem látott szomszédaik: $D$ (a $B$-ből) és $E$ (a $C$-ből). A 3. rétegben az $F$. A második opció az $E$-t a $D$-n át éri el, pedig a $C$-n át már a 2. hullámban megvan. A harmadik a verem használata (mélységi bejárás): $A, B, D, E$, majd onnan $C$ és $F$ – ez bejárja a gráfot, de nem a távolságokat adja. Az utolsó az $F$-et túl korán veszi be: az $F$ csak az $E$-n át érhető el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az előző gráfban (élek: $AB, AC, BD, CE, DE, EF$) mennyi $\operatorname{dist}(A, F)$?`,
          options: ["3", "4", "5", "2"],
          answer: 0,
          hint: "A távolság a legrövidebb út hossza, élekben mérve.",
          explain: R`Két út van: $A, C, E, F$ (3 él) és $A, B, D, E, F$ (4 él). A távolság a rövidebb: 3. A 4 a hosszabb út hossza (vagy a legrövidebb út csúcsainak száma), az 5 a hosszabb út csúcsainak száma. A 2 az $E$ távolsága – az $F$ még egy lépéssel arrébb van.`
        },
        {
          type: "single", shuffle: true,
          q: "A BFS közben egy csúcsot, amelynek már van távolsága, újra elérünk egy másik szomszédja felől. Mit teszünk?",
          options: [
            "Semmit: az első érték a jó, a későbbi elérés csak legalább ilyen hosszú úton jöhet.",
            "Felülírjuk az új értékkel, mert az a frissebb.",
            "A két érték közül a nagyobbat tartjuk meg.",
            "Újra betesszük a sor végére, hogy a szomszédait is újra feldolgozzuk."
          ],
          answer: 0,
          hint: "A sor miatt milyen sorrendben dolgozzuk fel a csúcsokat?",
          explain: R`A sor miatt a csúcsokat a távolságuk sorrendjében dolgozzuk fel: előbb az összes 1 lépésre levőt, aztán a 2 lépésre levőket. Egy csúcs akkor kap távolságot, amikor először elérjük – ez a legkorábbi hullám, tehát a legrövidebb út. A felülírás (tipikus hiba) csak hosszabb értéket hozhatna. Újra sorba tenni sem kell: a csúcsot egyszer dolgozzuk fel.`
        },
        {
          type: "match",
          q: "Az Árvízhét gráfja (7 szereplő, 10 él). Párosítsd a mérőszámot az értékével!",
          pairs: [
            ["átmérő", "3"],
            ["sugár", "2"],
            ["központ", "Ko, Vi, Po"],
            ["átlagos úthossz", "kb. 1,71"],
            [R`$\operatorname{dist}(\mathrm{Kl}, \mathrm{La})$`, "3 (pl. Kl, Ko, Po, La)"]
          ],
          hint: "Az átmérő a legnagyobb, a sugár a legkisebb excentricitás; az átlagos úthossz a 21 csúcspár távolságának átlaga (összegük 36).",
          explain: R`Excentricitások: $\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}$: 2; $\mathrm{La}, \text{Ön}, \mathrm{Sz}, \mathrm{Kl}$: 3. Az átmérő a legnagyobb (3), a sugár a legkisebb (2), a központ a 2-es excentricitású csúcsok halmaza. Az átlagos úthossz $36/21 \approx 1{,}71$ – ne keverd össze az átmérővel (legrosszabb eset) vagy a sugárral. A Klímaváltozásból indított BFS rétegei: $\mathrm{Kl}$ · $\mathrm{Sz}, \mathrm{Ko}$ · $\mathrm{Vi}, \mathrm{Po}$ · $\mathrm{La}, \text{Ön}$, így $\operatorname{dist}(\mathrm{Kl}, \mathrm{La}) = 3$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB, BC, CD, CE$. Melyik csúcsok alkotják a gráf központját?`,
          options: [R`$\{B, C\}$`, R`$\{C\}$`, R`$\{A, D, E\}$`, R`$\{B\}$`],
          answer: 0,
          hint: "Számold ki minden csúcs excentricitását (a tőle legtávolabbi csúcs távolságát), és válaszd a legkisebbeket.",
          explain: R`Excentricitások: $\varepsilon(A) = 3$, $\varepsilon(B) = 2$, $\varepsilon(C) = 2$, $\varepsilon(D) = \varepsilon(E) = 3$. A sugár 2, a központ a 2-es excentricitásúak: $\{B, C\}$. A $\{C\}$ a legnagyobb fokszámú csúcs – de a központ távolságon, nem fokszámon múlik ($B$ is mindenkit elér 2 lépésben). Az $\{A, D, E\}$ a legnagyobb excentricitásúak (ők határozzák meg a 3-as átmérőt).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $K_{1,4}$ csillag (egy középpont, 4 levél) átlagos úthossza?`,
          options: [R`$1{,}6$`, R`$2$`, R`$1$`, R`$1{,}5$`],
          answer: 0,
          hint: R`Hány csúcspár van, és ezek közül hány szomszédos? A többi pár távolsága mennyi?`,
          explain: R`5 csúcs, $\binom52 = 10$ pár. A 4 középpont–levél pár távolsága 1, a $\binom42 = 6$ levél–levél páré 2. Összeg $4 + 12 = 16$, átlag $16/10 = 1{,}6$. A 2 az átmérő (a legrosszabb eset), az 1 a középpont excentricitása (a sugár). Az $1{,}5$ a $K_{1,3}$ átlagos úthossza – a levelek számától függ az érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: $AB, BC, DE$ (5 csúcs). Mennyi az átmérője?`,
          options: [R`$\infty$, mert a gráf nem összefüggő`, "2", "1", "3"],
          answer: 0,
          hint: R`Mennyi $\operatorname{dist}(A, D)$?`,
          explain: R`Az $A$ és a $D$ nem összeköthető, így $\operatorname{dist}(A, D) = \infty$, és az átmérő (a legnagyobb távolság) is végtelen. A 2 a nagyobbik komponens ($A, B, C$) átmérője – a programok gyakran csendben ezt adják, ezért mindig írd oda, melyik komponensre vonatkozik a szám. Az 1 a $\{D, E\}$ komponensé, a 3 két komponens átmérőjének összege, aminek nincs értelme.`
        }
      ]
    },

    /* ------------------------------------------------ 2.4 */
    "gh2-24": {
      title: "Kvíz – 2.4 Súlyozott legrövidebb út",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$A$-ból $D$-be a közvetlen él 10 km, a $B$-n és $C$-n át vezető kerülő $3 + 3 + 3$ km. Mennyi a súlyozott távolság, és hány lépésből áll a hozzá tartozó út?`,
          options: ["9 km, 3 lépés", "10 km, 1 lépés", "9 km, 1 lépés", "10 km, 3 lépés"],
          answer: 0,
          hint: "A súlyozott távolság az élhosszak összegének minimuma – nem a lépések száma.",
          explain: R`A kerülő $3 + 3 + 3 = 9$ km, ez kevesebb a közvetlen 10 km-nél: a súlyozott távolság 9 km, 3 lépésből. A „10 km, 1 lépés” a legkevesebb élű út – ezt adná a BFS, de súlyozott gráfban a legkevesebb élű út nem feltétlenül a legrövidebb. A másik két opció a két út adatait keveri össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Dijkstra-algoritmus Szegedről a települések gráfján (Sze–Hmv 25, Sze–Mak 33, Hmv–Mak 30, Sze–Kis 30, Kis–Csg 36, Hmv–Csg 37 km). Milyen sorrendben válnak véglegessé a csúcsok?`,
          options: [
            "Sze, Hmv, Kis, Mak, Csg",
            "Sze, Hmv, Csg, Kis, Mak",
            "Sze, Hmv, Mak, Kis, Csg",
            "Sze, Kis, Hmv, Mak, Csg"
          ],
          answer: 0,
          hint: "Minden lépésben a legkisebb ideiglenes címkéjű csúcs válik véglegessé. Írd fel a címkéket lépésenként!",
          explain: R`Kezdetben Sze 0. Utána a címkék: Hmv 25, Mak 33, Kis 30 → Hmv (25) végleges, Csg 62 lesz. Majd Kis (30), Mak (33), végül Csg (62). A második opció a Csongrádot abban a lépésben véglegesíti, amikor először kap címkét – tipikus hiba: a címke csak akkor végleges, ha ő a legkisebb. A harmadik nem a címkék sorrendjét követi (Kis 30 < Mak 33). A negyedik a Kisteleket a Hmv elé teszi, pedig $25 \lt 30$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek (hosszal): $sa = 4$, $sb = 1$, $ba = 2$, $at = 1$, $bt = 5$. Mennyi az $s$ és $t$ súlyozott távolsága?`,
          options: ["4", "5", "6", "3"],
          answer: 0,
          hint: "Ne csak a két lépéses utakat nézd: egy hosszabb lépéssorozat is lehet rövidebb.",
          explain: R`Az $s, b, a, t$ út hossza $1 + 2 + 1 = 4$ – ez a legrövidebb. A két 2 lépéses út hosszabb: $s, a, t$: $4 + 1 = 5$, $s, b, t$: $1 + 5 = 6$. A legkevesebb élű út nem a legrövidebb súlyozott út. A 3 a legrövidebb út éleinek száma, nem a hossza.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Dijkstra-algoritmusra? (Több jó válasz is lehet.)",
          options: [
            "Minden lépésben a legkisebb ideiglenes címkéjű csúcs címkéje válik véglegessé.",
            "Ha minden él hossza 1, a BFS hullámait járja be.",
            "Egy csúcs címkéje az első frissítéskor véglegessé válik.",
            "Negatív élhosszak mellett is helyes eredményt ad.",
            "A talált út mindig a legkevesebb élből álló út is."
          ],
          answer: [0, 1],
          hint: "Miért nem vezethet rövidebb út a legkisebb címkéjű csúcshoz egy másik, még nem végleges csúcson át? Mit használ ki ez az érvelés?",
          explain: R`A legkisebb ideiglenes címkéjű csúcshoz nem vezethet rövidebb út egy még nem végleges csúcson át, mert annak címkéje már legalább ekkora, és az élhosszak nemnegatívak – ezért véglegesíthető. Ez az érvelés negatív élnél összeomlik (ott Bellman–Ford kell). Az első frissítés nem véglegesít: Csongrád 62-es címkéje a 2. lépésben született, de csak az 5.-ben vált véglegessé. Egységnyi éleknél a Dijkstra a BFS-sé egyszerűsödik. Az A–D példában viszont a 9 km-es legrövidebb út 3 élből áll, a közvetlen 1 élű út hosszabb.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Kistelek–Csongrád út lezárul (az él kiesik). Mennyi lesz Kistelek és Csongrád távolsága? (Élek: Sze–Hmv 25, Sze–Mak 33, Hmv–Mak 30, Sze–Kis 30, Kis–Csg 36, Hmv–Csg 37 km.)`,
          options: ["92 km", "66 km", "62 km", "130 km"],
          answer: 0,
          hint: "Kistelekről a lezárás után csak egy irányba lehet elindulni. Onnan melyik a legrövidebb folytatás Csongrádig?",
          explain: R`Kistelekről csak Szegedre lehet menni (30 km), Szegedről Csongrádig a legrövidebb út Hódmezővásárhelyen át 62 km: összesen $30 + 25 + 37 = 92$ km. A Makón át vezető kerülő $30 + 33 + 30 + 37 = 130$ km. A 62 a Szeged–Csongrád távolság (a Kistelek–Szeged szakasz kimaradt), a 66 a Szeged–Kistelek–Csongrád út – ez a lezárt élt használná.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három szereplő: $A$ és $B$ 4 cikkben, $B$ és $C$ 4 cikkben, $A$ és $C$ 1 cikkben szerepel együtt. A súly erősség. Melyik a legrövidebb $A$–$C$ út $\ell = 1/w$ hosszakkal, és mennyi a hossza?`,
          options: [
            R`$A, B, C$ – hossza $0{,}5$`,
            R`$A, C$ – hossza $1$`,
            R`$A, B, C$ – hossza $8$`,
            R`$A, B, C$ – hossza $0{,}125$`
          ],
          answer: 0,
          hint: R`Előbb minden élt alakíts hosszá ($1/w$), aztán add össze az út éleinek hosszát.`,
          explain: R`Hosszak: $A$–$B$ és $B$–$C$: $1/4 = 0{,}25$, $A$–$C$: $1/1 = 1$. A kerülő $0{,}25 + 0{,}25 = 0{,}5$, a közvetlen él 1: a kerülő a „rövidebb”, vagyis az erősebb láncolat. Az „$A, C$ – 1” azt adja, amit átalakítás nélkül kapnánk (ott a közvetlen él 1, a kerülő 8, és a gyenge kapcsolat nyerne). A 8 a súlyok összege, nem hossz. A $0{,}125 = 1/(4 + 4)$ az összeg reciproka – de az élenként átalakított hosszakat kell összeadni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten mennyi a Szakértő és az Önkéntesek távolsága $\ell = 1/w$ hosszakkal? (Súlyok: $\mathrm{Sz}$–$\mathrm{Ko}$ 1, $\mathrm{Sz}$–$\mathrm{Vi}$ 1, $\mathrm{Sz}$–$\mathrm{Kl}$ 2, $\mathrm{Kl}$–$\mathrm{Ko}$ 1, $\mathrm{Ko}$–$\mathrm{Vi}$ 2, $\mathrm{Ko}$–$\mathrm{Po}$ 2, $\mathrm{Vi}$–$\mathrm{Po}$ 2, $\mathrm{Po}$–$\text{Ön}$ 2, $\mathrm{Po}$–$\mathrm{La}$ 2, $\mathrm{La}$–$\text{Ön}$ 3.)`,
          options: [R`$2$`, R`$3$`, R`$5$`, R`$2{,}5$`],
          answer: 0,
          hint: R`Az Önkéntesekhez a Polgármesteren át vezet az út. Számold ki a hosszakat ($1/w$) a $\mathrm{Sz}$-ből $\mathrm{Po}$-ig vezető néhány útra, és add hozzá a $\mathrm{Po}$–$\text{Ön}$ szakaszt.`,
          explain: R`A $\mathrm{Sz}, \mathrm{Ko}, \mathrm{Po}, \text{Ön}$ (és ugyanígy a $\mathrm{Sz}, \mathrm{Vi}, \mathrm{Po}, \text{Ön}$) út hossza $1 + 0{,}5 + 0{,}5 = 2$, ennél rövidebb nincs. A $\mathrm{Sz}, \mathrm{Kl}, \mathrm{Ko}, \mathrm{Po}, \text{Ön}$ hossza $0{,}5 + 1 + 0{,}5 + 0{,}5 = 2{,}5$: az erős $\mathrm{Sz}$–$\mathrm{Kl}$ él ellenére hosszabb. A 3 a lépésszám ($\operatorname{dist}(\mathrm{Sz}, \text{Ön})$), az 5 a súlyok összege átalakítás nélkül ($1 + 2 + 2$) – ez az a hiba, amikor a programok a súlyt hosszként kezelik.`
        }
      ]
    },
