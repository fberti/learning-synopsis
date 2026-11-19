    /* ------------------------------------------------ 9.1 */
    "gh9-91": {
      title: "Kvíz – 9.1 SI, SIS és SIR",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában (súly nélkül) biztos SI-fertőzést indítasz a Szakértőből ($\mathrm{Sz}$). Hány fertőzött van a $t = 0, 1, 2, 3$ lépés végén?`,
          options: [R`$1, 4, 5, 7$`, R`$1, 3, 5, 7$`, R`$1, 4, 7, 7$`, R`$1, 7, 7, 7$`],
          answer: 0,
          hint: R`Biztos SI = szélességi bejárás. A $t$-edik lépésben pontosan a $t$ távolságú csúcsok fertőződnek meg. Kik a $\mathrm{Sz}$ szomszédai?`,
          explain: R`A $\mathrm{Sz}$ szomszédai $\mathrm{Vi}$, $\mathrm{Kl}$, $\mathrm{Ko}$ (1. lépés: 4 fertőzött). A $\mathrm{Po}$ 2 távolságra van (5), a $\mathrm{La}$ és az $\text{Ön}$ 3-ra (7). A $\mathrm{Sz}$ excentricitása 3. Az $1, 3, 5, 7$ a $\mathrm{Kl}$-ből vagy a $\mathrm{La}$-ból induló sor, nem ez. Az $1, 4, 7, 7$ egy lépésben „továbbfuttatja” a fertőzést a $\mathrm{Po}$-tól a $\mathrm{La}$-ra és az $\text{Ön}$-re – pedig aki a $t$-edik lépésben fertőződött, csak a $t + 1$-edikben ad tovább. Az $1, 7, 7, 7$ ugyanez a hiba, végig.`
        },
        {
          type: "multi",
          q: R`Az Árvízhéten melyik szereplőből indulva fertőz meg a biztos SI a legkevesebb lépés alatt mindenkit? (Több jó válasz is lehet.)`,
          options: [R`$\mathrm{Ko}$`, R`$\mathrm{Vi}$`, R`$\mathrm{Po}$`, R`$\mathrm{Sz}$`, R`$\mathrm{La}$`],
          answer: [0, 1, 2],
          hint: R`Nem a fokszám számít, hanem a forrás excentricitása: milyen messze van tőle a legtávolabbi csúcs?`,
          explain: R`Az excentricitás $\mathrm{Ko}$, $\mathrm{Vi}$, $\mathrm{Po}$: 2, a többieké 3. Így ez a három 2 lépés alatt mindenkit elér – ők a gráf centruma. A tipikus hiba a fokszám és az elérési idő összekeverése: a $\mathrm{Vi}$-nek csak 3 a fokszáma (mint a $\mathrm{Sz}$-nek), mégis 2 lépés alatt végez. A $\mathrm{Sz}$-ből a $\mathrm{La}$ és az $\text{Ön}$ 3 lépésre van, a $\mathrm{La}$-ból a $\mathrm{Sz}$ és a $\mathrm{Kl}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy fogékony csúcsnak 3 fertőző szomszédja van, $\beta = 0{,}2$, és a szomszédok egymástól függetlenül próbálkoznak. Mekkora eséllyel fertőződik meg a következő lépésben?`,
          options: [R`$0{,}488$`, R`$0{,}6$`, R`$0{,}512$`, R`$0{,}008$`],
          answer: 0,
          hint: R`„Legalább egy átadja” – számolj az ellentett eseménnyel!`,
          explain: R`Akkor nem fertőződik meg, ha egyik sem adja át: $0{,}8^3 = 0{,}512$. A keresett esély ennek ellentettje: $1 - 0{,}512 = 0{,}488$. A $0{,}6 = 3 \cdot 0{,}2$ összeadja az esélyeket – ez csak kis $\beta$-nál jó közelítés, és sok szomszédnál 1 fölé is mehet. A $0{,}512$ maga az „egyik sem” esélye, az ellentett elfelejtve. A $0{,}008 = 0{,}2^3$ annak az esélye, hogy mindhárom átadja – de egy is elég.`
        },
        {
          type: "single", shuffle: true,
          q: R`SIR-modell, $\beta = 0{,}4$, $\gamma = 0{,}5$ (egy lépésben előbb a fertőzés, aztán a gyógyulás). Mennyi az átvitel, $T$?`,
          options: [R`$\approx 0{,}571$`, R`$0{,}4$`, R`$0{,}8$`, R`$\approx 0{,}444$`],
          answer: 0,
          hint: R`Egy lépésben: átadja, vagy nem adja át és meggyógyul, vagy semmi sem történik. Az első kettő közül melyik jön előbb?`,
          explain: R`$T = \beta/(\beta + \gamma - \beta\gamma) = 0{,}4/(0{,}4 + 0{,}5 - 0{,}2) = 0{,}4/0{,}7 \approx 0{,}571$. A $0{,}4 = \beta$ csak $\gamma = 1$-nél lenne jó: itt a fertőző átlagosan $1/\gamma = 2$ lépésig próbálkozik, ezért $T \ge \beta$. A $0{,}8 = \beta/\gamma$ a folytonos idejű modellek hányadosa, nem valószínűség (lehetne 1 fölött is). A $0{,}444 = \beta/(\beta + \gamma)$ elfelejti, hogy a gyógyulás csak akkor „nyer”, ha az átadás nem sikerült: $(1 - \beta)\gamma = 0{,}3$, nem $0{,}5$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Út: $A$–$B$–$C$, az $A$ fertőző, SIR, $\beta = \gamma = 0{,}5$. Mekkora eséllyel kapja el végül a $C$?`,
          options: [R`$4/9$`, R`$2/3$`, R`$1/3$`, R`$1/4$`],
          answer: 0,
          hint: R`Két élen kell átjutnia, mindkettőn a teljes fertőző időszak alatt. Mennyi egy élen az átvitel?`,
          explain: R`Egy élen $T = 0{,}5/(0{,}5 + 0{,}5 - 0{,}25) = 2/3$. Előbb a $B$-nek kell elkapnia ($2/3$), aztán a $B$ saját fertőző időszakában a $C$-nek ($2/3$): $(2/3)^2 = 4/9 \approx 0{,}444$. A $2/3$ csak az első élet számolja. Az $1/3 = 2/3 \cdot 0{,}5$ a második élen $T = \beta$-val számol – de a $B$ is több lépésig próbálkozhat. Az $1/4 = 0{,}5^2$ mindkét élen csak egy próbát enged.`
        },
        {
          type: "single", shuffle: true,
          q: R`Keverő populáció: mindenkinek 3 kapcsolata van, $\beta = \gamma = 0{,}5$. Mennyi az $R_0$, és nagyjából a népesség mekkora része fertőződik meg végül? (Segítség: $R_0 = 1{,}5 \to r_\infty \approx 0{,}583$; $2 \to 0{,}797$; $3 \to 0{,}941$.)`,
          options: [
            R`$R_0 = 2$, kb. 80%`,
            R`$R_0 = 1{,}5$, kb. 58%`,
            R`$R_0 = 3$, kb. 94%`,
            R`$R_0 \approx 0{,}67$, a fertőzés elhal`
          ],
          answer: 0,
          hint: R`Két lépés: előbb az átvitel $T$ (a gyógyulással együtt!), aztán $R_0 = T\langle k\rangle$.`,
          explain: R`$T = 0{,}5/(0{,}5 + 0{,}5 - 0{,}25) = 2/3$, $R_0 = 2/3 \cdot 3 = 2$, és az $r_\infty = 1 - e^{-2 r_\infty}$ pozitív megoldása $\approx 0{,}797$. Az $R_0 = 1{,}5$ a $T = \beta$ hiba ($\gamma \lt 1$, tehát többször próbálkozhat). Az $R_0 = 3$ a $T = \beta/\gamma = 1$ hibából jön. A $0{,}67$ magát a $T$-t veszi $R_0$-nak – elfelejti, hogy mindenkinek 3 kapcsolata van.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`SI-ben egy összefüggő gráfban végül mindenki fertőző lesz; a $\beta$ csak azt dönti el, mikor.`,
            R`Ha $\gamma = 1$ (pontosan egy lépésig fertőző), akkor $T = \beta$.`,
            R`Az 1000 csúcsú gyűrűrácsban azért terjed kevésbé, mint a keverő modellben, mert a szomszédok átfednek, és a „bejövő” él már elhasznált.`,
            R`SIS-ben a végső méretet az $r_\infty = 1 - e^{-R_0 r_\infty}$ egyenlet adja.`,
            R`Egy szimulációs futás megmutatja a járvány várható méretét.`
          ],
          answer: [0, 1, 2],
          hint: R`Melyik modellben van immunitás? És mit mutat egyetlen véletlen futás?`,
          explain: R`Igaz az SI-állítás: senki sem gyógyul meg, így a komponens előbb-utóbb teljesen megfertőződik. Igaz a $\gamma = 1$ eset: $\beta/(\beta + 1 - \beta) = \beta$. Igaz a gyűrűrács: ugyanazzal a $T = 0{,}5$-tel átlagosan csak a csúcsok 1,5%-át éri el a keverő modell kb. 80%-a helyett, mert akit megfertőzök, annak a szomszédai jórészt az enyéim is. Hamis az SIS-állítás: ott nincs immunitás, nincs végső méret – a fertőzés kihal vagy tartósan fennmarad (endémiás állapot). Hamis az utolsó is: egy futás egy minta; ugyanazokkal a paraméterekkel egyszer kihal, máskor nagy lesz. Állítást sok futás eloszlásáról teszünk.`
        }
      ]
    },

    /* ------------------------------------------------ 9.2 */
    "gh9-92": {
      title: "Kvíz – 9.2 Járványküszöb",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$ (egy háromszög, és az $A$-hoz egy lógó $D$). Mennyi a többletfokszám, $\kappa$, és a küszöb, $T_c = 1/\kappa$? (Kis gráfon a képlet csak szemléltet.)`,
          options: [
            R`$\kappa = 1{,}25$, $T_c = 0{,}8$`,
            R`$\kappa = 2{,}25$, $T_c \approx 0{,}444$`,
            R`$\kappa = 2$, $T_c = 0{,}5$`,
            R`$\kappa = 2{,}5$, $T_c = 0{,}4$`
          ],
          answer: 0,
          hint: R`Fokszámok: $3, 2, 2, 1$. Számold ki $\langle k\rangle$-t és $\langle k^2\rangle$-et, és ne feledd az él végén álló csúcs „bejövő” élét!`,
          explain: R`$\langle k\rangle = 8/4 = 2$, $\langle k^2\rangle = (9 + 4 + 4 + 1)/4 = 4{,}5$, $\kappa = 4{,}5/2 - 1 = 1{,}25$, $T_c = 0{,}8$. A $2{,}25$ elhagyja a „−1”-et – de az élt, amelyen a fertőzés érkezett, nem lehet újra használni. A $\kappa = 2 = \langle k\rangle$ Poisson-fokszámokat feltételez ($T_c = 1/\langle k\rangle$), ez csak ER-gráfban jó. A $2{,}5 = \langle k^2\rangle - \langle k\rangle$ elfelejt $\langle k\rangle$-vel osztani.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában (fokszámok 4, 4, 3, 3, 2, 2, 2) $\langle k\rangle = 20/7$, $\langle k^2\rangle = 62/7$. Mennyi a $\kappa$ és a $T_c$?`,
          options: [
            R`$\kappa = 2{,}1$, $T_c \approx 0{,}48$`,
            R`$\kappa = 3{,}1$, $T_c \approx 0{,}32$`,
            R`$\kappa \approx 2{,}86$, $T_c = 0{,}35$`,
            R`$\kappa = 2{,}1$, $T_c \approx 0{,}35$`
          ],
          answer: 0,
          hint: R`A $7$-es nevezők kiesnek: $\langle k^2\rangle/\langle k\rangle = 62/20$.`,
          explain: R`$\kappa = 62/20 - 1 = 2{,}1$, $T_c = 1/2{,}1 \approx 0{,}476$. A $3{,}1$ a „−1” nélküli hányados. A $2{,}86 = \langle k\rangle$ és $T_c = 7/20 = 0{,}35$ a keverő populáció küszöbe – heterogén hálózatban ez nem érvényes. Az utolsó opció jól számolja a $\kappa$-t, de a küszöböt mégis $1/\langle k\rangle$-ből veszi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hálózatban $\langle k\rangle = 5$, a fokszám szórása $\sigma = 4$. Mennyi a járványküszöb, $T_c$? (Emlékeztető: $\langle k^2\rangle = \langle k\rangle^2 + \sigma^2$.)`,
          options: [R`$\approx 0{,}139$`, R`$\approx 0{,}122$`, R`$0{,}2$`, R`$\approx 0{,}455$`],
          answer: 0,
          hint: R`Előbb $\langle k^2\rangle$, aztán $\kappa = \langle k^2\rangle/\langle k\rangle - 1$, végül $T_c = 1/\kappa$.`,
          explain: R`$\langle k^2\rangle = 25 + 16 = 41$, $\langle k^2\rangle/\langle k\rangle = 8{,}2$, $\kappa = 7{,}2$, $T_c = 1/7{,}2 \approx 0{,}139$. A $0{,}122 = 5/41$ a „−1”-et hagyja el. A $0{,}2 = 1/\langle k\rangle$ a szórást figyelmen kívül hagyja – pedig a heterogén hálózat küszöbét a $\langle k^2\rangle$ dönti el. A $0{,}455$ a $\langle k\rangle^2$ tagot felejti ki ($\langle k^2\rangle = 16$ lenne, $\kappa = 2{,}2$).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Azonos $\langle k\rangle = 4$ mellett a BA-gráf küszöbe a mérettel csökken, mert a legnagyobb hub egyre nagyobb.`,
            R`Az ER-gráf küszöbe a mérettől függetlenül $1/\langle k\rangle$ körül marad.`,
            R`Kis, háromszögekkel teli gráfon a valódi küszöb általában magasabb, mint amit az $1/\kappa$ ad.`,
            R`Skálafüggetlen hálózatban minden járvány elterjed, mert nincs küszöb.`,
            R`Heterogén hálózaton is $R_0 = T\langle k\rangle$, csak a $\langle k\rangle$ nagyobb.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi nő a mérettel egy nehéz farkú eloszlásnál? És mit jelent a „nincs küszöb”: biztos kitörést vagy a kitörés lehetőségét?`,
          explain: R`Igaz a BA-állítás: $n = 1000 \to 100\,000$ mellett a legnagyobb fokszám 87-ről 889-re, a $\kappa$ 10,1-ről 17,1-re nő, a $T_c$ 0,099-ről 0,059-re csökken. Igaz az ER: a Poisson-farok gyorsan lecseng, $T_c \approx 0{,}25$ marad. Igaz a klaszterezett gráf: a háromszögek „elpazarolják” a fertőzéseket, a tétel fa-szerű véletlen gráfokra szól. Hamis a „minden járvány elterjed”: van esély a kitörésre, de egy adott kezdés az első lépésekben is kihalhat, és kis $T$-nél a kitörés kicsi. Hamis az utolsó: hálózaton $R_0 = T\kappa$, mert a fertőzés éllel érkezik, és az él végén álló csúcs fokszáma a barátság-paradoxon miatt nagyobb az átlagnál.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $H$–$A$, $H$–$B$, $H$–$C$, $H$–$D$, $A$–$B$. Ismerős-immunizálással egy oltást adsz be. Mekkora eséllyel kerül az oltás a $H$ hubra?`,
          options: [R`$3/5$`, R`$1/5$`, R`$2/5$`, R`$4/5$`],
          answer: 0,
          hint: R`Vedd sorra, kit kérdezhetsz meg (mindenkit $1/5$ eséllyel), és ő mekkora eséllyel nevezi meg a $H$-t a saját ismerősei közül.`,
          explain: R`A $C$ és a $D$ egyetlen ismerőse a $H$ (1–1). Az $A$-nak és a $B$-nek két ismerőse van, a $H$-t $1/2$ eséllyel nevezik meg. A $H$ magát nem nevezheti meg (0). Összesen $\tfrac15(1 + 1 + \tfrac12 + \tfrac12 + 0) = 3/5$. Az $1/5$ a véletlen immunizálás – vagy az, ha a megkérdezettet oltanád be az ismerőse helyett. A $2/5 = 4/10$ a $H$ élvégeinek aránya: ez egy véletlen él véletlen vége lenne, nem egy véletlen ember véletlen ismerőse. A $4/5$ azt feltételezi, hogy a hubon kívül mindenki biztosan a hubot nevezi meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy BA-gráfban ($n = 10\,000$, $m = 2$) a küszöb $T_c \approx 0{,}073$. A csúcsok 10%-át véletlenszerűen oltjuk be. Mi lesz kb. a küszöb?`,
          options: [R`$\approx 0{,}076$`, R`$\approx 0{,}081$`, R`$\approx 0{,}23$`, R`$\approx 0{,}66$`],
          answer: 0,
          hint: R`A véletlen oltás milyen fokszámú csúcsokat talál el többnyire? És kik döntik el a $\langle k^2\rangle$-et?`,
          explain: R`A véletlenül beoltottak átlagos fokszáma csak 3,7: a hubokat ritkán találja el, ezért a $\kappa$ alig változik (13,7 → 13,1), a küszöb kb. 0,076 lesz. A $0{,}081 = 0{,}073/0{,}9$ az „10% oltás = 10%-kal jobb” arányossági tévhit. A $0{,}23$ az ismerős-oltás (beoltottak átlagos fokszáma 9,6), a $0{,}66$ a célzott oltás (14,6) eredménye – ugyanannyi oltással.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért találja el az ismerős-immunizálás gyakrabban a hubokat, mint a véletlen oltás – a hálózat ismerete nélkül is?`,
          options: [
            R`Mert a megnevezett ismerős egy él vége, és az él végére a csúcsok a fokszámukkal arányos eséllyel kerülnek.`,
            R`Mert a megkérdezett a legtöbb kapcsolatú ismerősét nevezi meg.`,
            R`Mert a véletlenül megkérdezett ember maga is többnyire hub.`,
            R`Mert a hubokat oltjuk be elsőként, és a maradék oltásokat véletlenszerűen osztjuk ki.`
          ],
          answer: 0,
          hint: R`Gondolj a barátság-paradoxonra (7.3): átlagosan kinek van több barátja, neked vagy a barátaidnak?`,
          explain: R`Egy $k$ fokú csúcsot $k$ ember nevezhet meg ismerősként, ezért a megnevezés a fokszámmal arányos eséllyel éri – ez a barátság-paradoxon. A megkérdezett nem válogat: egy <i>véletlen</i> ismerőst mond, a módszer ettől működik helyi információval. A megkérdezett egy véletlen ember, aki többnyire kis fokú – ezért őt oltani nem jobb a véletlen oltásnál. A hubok előre kiválasztása a célzott immunizálás, ehhez ismerni kellene a hálózatot.`
        }
      ]
    },

    /* ------------------------------------------------ 9.3 */
    "gh9-93": {
      title: "Kvíz – 9.3 Független kaszkád és küszöbmodellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy háromszögben ($A$, $B$, $C$) az $A$ kezd, független kaszkád, minden élen $p = 0{,}4$. Mekkora eséllyel kapja meg a $B$ a hírt?`,
          options: [R`$0{,}496$`, R`$0{,}4$`, R`$0{,}56$`, R`$0{,}64$`],
          answer: 0,
          hint: R`Két út van: közvetlenül, vagy a $C$-n át. A második csak akkor számít új esetnek, ha a közvetlen próba kudarcot vallott.`,
          explain: R`Közvetlenül $0{,}4$. Ha ez nem sikerül ($0{,}6$), a $C$-n át: $0{,}4 \cdot 0{,}4$. Összesen $0{,}4 + 0{,}6 \cdot 0{,}16 = 0{,}496$. A $0{,}4$ csak a közvetlen utat számolja. Az $0{,}56 = 0{,}4 + 0{,}16$ a közvetett utat a közvetlen kudarca nélkül adja hozzá – így kétszer számolja azt az esetet, amikor mindkettő sikerül. A $0{,}64 = 1 - 0{,}6^2$ két független, egyenként $0{,}4$ esélyű útnak veszi őket – de a közvetett úthoz két élnek kell nyitva lennie.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 4 levelű csillag egyik levele kezd, független kaszkád, $p = 0{,}4$. Mennyi a várható terjedés (a kezdővel együtt)?`,
          options: [R`$1{,}88$`, R`$2{,}6$`, R`$1{,}4$`, R`$5$`],
          answer: 0,
          hint: R`A közepet közvetlenül éri el; a többi 3 levelet csak a középen át, két nyitott élen.`,
          explain: R`$1 + 0{,}4 + 3 \cdot 0{,}4^2 = 1 + 0{,}4 + 0{,}48 = 1{,}88$. A $2{,}6 = 1 + 4 \cdot 0{,}4$ a középről induló kaszkád értéke – a levélről indulva a többi levélhez két él kell. Az $1{,}4$ megáll a középnél. Az $5$ ismételt próbálkozást enged (amíg aktív, újra és újra próbál): az az SI-modell, ahol végül mindenki aktív. Az IC-ben minden él csak egyszer próbálkozik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy tömeg 6 tagjának (abszolút) küszöbei: $0, 1, 2, 4, 4, 5$. Hányan állnak be végül?`,
          options: [R`$3$`, R`$6$`, R`$1$`, R`$2$`],
          answer: 0,
          hint: R`Lépésenként: hány aktív van már, és van-e olyan inaktív, akinek a küszöbe legfeljebb ennyi?`,
          explain: R`A 0-s kezd (1 aktív), ez elég az 1-esnek (2), ez a 2-esnek (3). A következő küszöb 4, de csak 3-an vannak: megáll 3-nál. A $6$ „végigdőlő dominót” lát, mert az átlagos küszöb ($\approx 2{,}67$) kicsi – de az átlagból nem lehet jósolni, a láncban hiányzik a 3-as láncszem. Az $1$ már a 0-s után megállna. A $2$ elfelejti, hogy a 2-es küszöbű ember 2 aktívat lát (a 0-st és az 1-est), ez neki elég.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten mindenkinek $\theta = 0{,}5$ arány-küszöbe van (akkor aktív, ha a szomszédai legalább fele aktív). Egyedül a $\mathrm{Po}$ kezd. Kik lesznek végül aktívak?`,
          options: [
            R`$\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$`,
            R`csak a $\mathrm{Po}$`,
            R`mindenki`,
            R`$\{\mathrm{Po}, \mathrm{Ko}, \mathrm{Vi}, \mathrm{La}, \text{Ön}\}$`
          ],
          answer: 0,
          hint: R`Nézd végig a $\mathrm{Po}$ szomszédait: mindegyiknek hány szomszédja van, és ebből hány aktív?`,
          explain: R`A $\mathrm{La}$ szomszédai $\mathrm{Po}$, $\text{Ön}$: $1/2 \ge 0{,}5$ → aktív, az $\text{Ön}$ ugyanígy. A $\mathrm{Ko}$-nál ezután is csak $1/4$, a $\mathrm{Vi}$-nél $1/3$ – megáll. A „csak a $\mathrm{Po}$” szigorú egyenlőtlenséggel számol (a küszöb „legalább” fele). A „mindenki” egyszerű fertőzésként (1 aktív szomszéd elég) kezeli. Az utolsó opció a $\mathrm{Po}$ közvetlen szomszédait mind aktívnak veszi – de a $\mathrm{Ko}$-nak 4, a $\mathrm{Vi}$-nek 3 szomszédja van, nekik egy aktív kevés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 8 fokú csúcsnak 3 aktív szomszédja van. Aktív lesz-e $\theta = 0{,}5$ arány-küszöbbel, illetve $\theta = 3$ abszolút küszöbbel?`,
          options: [
            R`arány-küszöbbel nem, abszolút küszöbbel igen`,
            R`mindkettővel igen`,
            R`egyikkel sem`,
            R`arány-küszöbbel igen, abszolút küszöbbel nem`
          ],
          answer: 0,
          hint: R`Az arány-küszöbnél az aktív szomszédok számát el kell osztani a fokszámmal.`,
          explain: R`Arány: $3/8 = 0{,}375 \lt 0{,}5$ → nem. Abszolút: $3 \ge 3$ → igen. A két küszöbfajta összekeverése tipikus hiba: ugyanaz a 3 aktív szomszéd egy 4 fokú csúcsnak 75%, egy 8 fokúnak csak 37,5%. Arány-küszöbnél a nagy fokú csúcsot nehezebb aktiválni – a hubok itt nem gyorsítanak, hanem fékeznek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két 8 csúcsú, 4-reguláris gráf: a gyűrűrács (mindenki a $\pm 1$ és $\pm 2$ szomszédjával) és az átkötött (mindenki a $\pm 1$ és $\pm 3$ szomszédjával, ez a $K_{4,4}$). Küszöb: 2 aktív szomszéd, a szomszédos 0 és 1 kezd. Hány aktív lesz végül?`,
          options: [
            R`gyűrűrács: 8; átkötött: 2`,
            R`mindkettőben 8 (azonos a fokszám)`,
            R`mindkettőben 2`,
            R`gyűrűrács: 2; átkötött: 8 (rövidebbek az utak)`
          ],
          answer: 0,
          hint: R`Van-e a 0-nak és az 1-nek közös szomszédja? Ez a háromszögeken múlik.`,
          explain: R`A gyűrűrácsban a 2-es és a 7-es a 0-nak és az 1-nek is szomszédja → aktív; körönként 2, 4, 6, 8: mindenki. Az átkötött gráfban a 0 szomszédai 1, 7, 3, 5, az 1-é 0, 2, 4, 6 – nincs közös szomszéd, senki sem kap két jelet: megáll 2-nél. A különbség a háromszögeken múlik (klaszterezettség 0,5 vs. 0), nem a fokszámon. Egyszerű fertőzésnél (küszöb 1) mindkettőben 2 lépés alatt mindenki aktív – a rövid utak ott segítenek, az összetett fertőzésnél nem.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az egyszerű és az összetett fertőzésre? (Több jó válasz is lehet.)",
          options: [
            R`Egyszerű fertőzésnél a véletlen, hosszú élek gyorsítják a terjedést.`,
            R`Összetett fertőzésnél ugyanezek a hosszú élek lassíthatják vagy meg is állíthatják a terjedést.`,
            R`Ha valaki több ismerőse után veszi át a viselkedést, az lehet összetett fertőzés, de lehet homofília is.`,
            R`A kisvilág-hálózat minden terjedést gyorsít.`,
            R`Ha ugyanaz az ismerős tízszer mutatja meg ugyanazt, az összetett fertőzés.`
          ],
          answer: [0, 1, 2],
          hint: R`Egy hosszú él hány jelet visz át? És mitől „összetett” a fertőzés: a kitettség számától vagy a független források számától?`,
          explain: R`Igaz: egyszerű fertőzésnél a hosszú élek rövidítik az utakat – $n = 100$-nál már $q = 0{,}05$ átkötés 25-ről 11,2 lépésre csökkenti a teljes lefedés idejét. Igaz: összetett fertőzésnél ugyanez az elért arányt 100%-ról 25%-ra vágja, mert a hosszú él csak egy jelet visz át, és a túloldalon nincs második. Igaz a homofília: a hasonló emberek egymástól függetlenül is tehetik ugyanazt, a megfigyelt adat ritkán választja szét a kettőt. Hamis, hogy a kisvilág mindent gyorsít: csak az egyszerű fertőzést. Hamis az ismételt kitettség is: az összetett fertőzés <i>különböző</i> szomszédokból jövő megerősítést jelent.`
        }
      ]
    },

    /* ------------------------------------------------ 9.4 */
    "gh9-94": {
      title: "Kvíz – 9.4 Kaszkádok mérése",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy kaszkádfában a gyökérnek 3 gyereke van, és mindegyik gyereknek pontosan 1 gyereke. Mennyi a fa mérete, mélysége és szélessége?`,
          options: [
            R`méret 7, mélység 2, szélesség 3`,
            R`méret 6, mélység 2, szélesség 3`,
            R`méret 7, mélység 3, szélesség 3`,
            R`méret 7, mélység 2, szélesség 6`
          ],
          answer: 0,
          hint: R`A méretbe a forrás is beleszámít. A mélység távolság (élek száma), a szélesség egy szint mérete.`,
          explain: R`Méret $1 + 3 + 3 = 7$ (a forrással). Mélység 2: a legtávolabbi csúcs (egy unoka) 2 élre van a gyökértől. Szintek: 1, 3, 3 – a szélesség 3. A $6$ kihagyja a forrást. A mélység 3 a szinteket számolja élek helyett. A szélesség 6 az összes nem-gyökér csúcsot egy „szélességnek” veszi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kaszkádfa élei: gyökér–1, gyökér–2, gyökér–3, 1–4, 4–5 (6 csúcs). Mennyi a strukturális virálissága, $\nu$?`,
          options: [R`$\approx 2{,}13$`, R`$3$`, R`$1{,}6$`, R`$\approx 1{,}07$`],
          answer: 0,
          hint: R`Wiener-index: minden él annyi pár útjában van, ahány csúcs az egyik oldalán, szorozva a másik oldaliakkal. Utána oszd el a párok számával, $\binom62$-vel.`,
          explain: R`Élenként $s(n - s)$: gyökér–1: $3 \cdot 3 = 9$; gyökér–2 és gyökér–3: $1 \cdot 5 = 5$–$5$; 1–4: $2 \cdot 4 = 8$; 4–5: $1 \cdot 5 = 5$. Összesen $32$, $\binom62 = 15$, $\nu = 32/15 \approx 2{,}13$. A $3$ a mélység – de a virálisság az egész fát nézi, nem a leghosszabb ágat. Az $1{,}6 = 8/5$ csak a gyökértől mért távolságokat átlagolja. Az $1{,}07 = 32/30$ rendezett párokkal ($n(n-1)$) oszt, pedig az összeg rendezetlen párokra szól.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a strukturális virálisság egy 20 csúcsú csillagban (tiszta műsorszórás), illetve egy 20 csúcsú úton (tiszta lánc), ha a gyökér a csillag közepe, illetve az út egyik vége?`,
          options: [R`$1{,}9$ és $7$`, R`$1$ és $19$`, R`$1$ és $10$`, R`$1{,}9$ és $\approx 6{,}33$`],
          answer: 0,
          hint: R`Csillag: $2(n-1)/n$, út: $(n+1)/3$. A gyökér helye a virálisságot nem befolyásolja – miért?`,
          explain: R`Csillag: $2 \cdot 19/20 = 1{,}9$, út: $21/3 = 7$. A virálisság minden csúcspár távolságát átlagolja, ezért nem függ attól, hol a gyökér. Az $1$ és $19$ a két fa mélysége – a mélység nem azonos a virálissággal. Az $1$ és $10$ csak a gyökértől mért távolságokat átlagolja. A $6{,}33 = 19/3$ az út képletében $n + 1$ helyett $n - 1$-gyel számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Elágazó folyamat: minden megosztónak 3 új követője van, és mindegyik $q = 0{,}2$ eséllyel osztja tovább (egymástól függetlenül). Mennyi az $R$, és mekkora a kaszkád várható mérete (a forrással)?`,
          options: [
            R`$R = 0{,}6$, várható méret $2{,}5$`,
            R`$R = 0{,}6$, várható méret $1{,}6$`,
            R`$R = 0{,}6$, várható méret $1{,}5$`,
            R`$R = 0{,}2$, várható méret $1{,}25$`
          ],
          answer: 0,
          hint: R`$R$ = követők száma × továbbosztási esély. A várható méret az $1 + R + R^2 + \dots$ mértani sor.`,
          explain: R`$R = 3 \cdot 0{,}2 = 0{,}6$, a várható méret $1/(1 - 0{,}6) = 2{,}5$. Az $1{,}6 = 1 + R$ csak az első generációig számol. Az $1{,}5 = R/(1 - R)$ a forrást hagyja ki a sorból. Az $R = 0{,}2$ a $q$-t veszi $R$-nek, és elfelejti, hogy egy megosztónak 3 követője van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Minden megosztónak 2 követője van, mindegyik $q = 0{,}3$ eséllyel osztja tovább. Mekkora eséllyel marad a kaszkád 1 méretű (csak a forrás)?`,
          options: [R`$0{,}49$`, R`$0{,}7$`, R`$0{,}4$`, R`$0{,}09$`],
          answer: 0,
          hint: R`Mi kell ahhoz, hogy a forrás után senki se jöjjön?`,
          explain: R`Egyik követő sem osztja meg: $0{,}7^2 = 0{,}49$. A $0{,}7$ csak egy követőt néz. A $0{,}4 = 1 - R$ ($R = 0{,}6$) nem valószínűség-számítás, csak a két szám különbsége. A $0{,}09 = 0{,}3^2$ annak az esélye, hogy mindkettő megosztja – az ellenkező eset.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a kaszkádok méretére? (Több jó válasz is lehet.)",
          options: [
            R`$R = 0{,}9$-nél a kaszkádoknak kb. 41%-a egyetlen megosztás marad, mégis kb. 1,7%-uk eléri a 100-at.`,
            R`Nehéz farkú méreteloszlásnál az átlagot néhány óriás húzza; a medián gyakran 1.`,
            R`A kritikus pontban ($R = 1$) a legtöbb kaszkád kicsi, de a várható méret végtelen.`,
            R`Ha $R \lt 1$, nagy kaszkád nem fordulhat elő.`,
            R`Ha egy kaszkád nagy lett, biztosan virálisan, emberről emberre terjedt.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig a Borel-eloszlás táblázatát. Mit árul el a méret a terjedés módjáról?`,
          explain: R`Igaz: a Borel-eloszlásból $R = 0{,}9$-re $P(\text{méret} = 1) \approx 0{,}407$ és $P(\text{méret} \ge 100) \approx 0{,}017$. Igaz a medián: nehéz farkú eloszlásnál az átlag nem „tipikus”. Igaz a kritikus pont: $P(1) \approx 0{,}368$, a farok $s^{-3/2}$-es hatványfüggvény, az átlag végtelen. Hamis, hogy $R \lt 1$-nél nincs nagy kaszkád: kis $R$ kis átlagot jelent, nem biztosan kis méretet. Hamis a „nagy = virális”: egy nagy követőszámú fiók egyetlen műsorszórása is hatalmas lehet – Goel és mtsai szerint a népszerűséget legtöbbször éppen a legnagyobb egyedi műsorszórás magyarázza.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét hírláncában az 5-ös, a 9-es és a 11-es cikknek két szülőjelöltje van. Milyen kaszkádfákat kapsz a „legutóbbi forrás” szabállyal?`,
          options: [
            R`három 4 csúcsú fát: $\{1, 4, 10, 11\}$, $\{2, 3, 5, 6\}$, $\{7, 8, 9, 12\}$`,
            R`egy 6, egy 4 és egy 2 csúcsú fát: $\{1, 4, 10, 5, 6, 9\}$, $\{7, 8, 11, 12\}$, $\{2, 3\}$`,
            R`egyetlen 12 csúcsú fát, mert a hivatkozási gráf összefüggő`,
            R`ugyanazokat, mint a „legkorábbi forrás” szabállyal – a hivatkozások ugyanazok`
          ],
          answer: 0,
          hint: R`Az 5-ös a 2-esre (szerda) és a 4-esre (hétfő) hivatkozik, a 9-es az 5-ösre és a 8-asra (csütörtök), a 11-es a 7-esre és a 10-esre (kedd). Azonos napnál a „legutóbbi” a nagyobb sorszámút választja.`,
          explain: R`„Legutóbbi”: 5 → 2, 9 → 8, 11 → 10, így három 4 csúcsú fa jön ki. A 6–4–2-es felbontás a „legkorábbi” szabályé (5 → 4, 9 → 5, 11 → 7). Ugyanaz az adat tehát egyszer egy nagy, mély kaszkádot mutat, máskor három egyformát: a kaszkádfa modellválasztás eredménye, és a mérőszámok a szabálytól függenek. A hivatkozási gráf irányított, körmentes gráf, nem fa – fát csak a szülőválasztás után kapunk. És az időrend önmagában nem bizonyít átvételt.`
        }
      ]
    },
