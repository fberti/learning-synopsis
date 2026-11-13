/* =========================================================
   Gráfelmélet és hálózattudomány 9. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 9.5 */
    "gh9-95": {
      title: "Kvíz – 9.5 Befolyásmaximalizálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Lefedés ($p = 1$, egy lépés: a kezdő és a közvetlen szomszédai kapják meg). Élek: $A1$, $A2$, $A3$, $A4$, $B3$, $B4$, $B5$, $C6$, $C7$. A mohó algoritmus első kezdője az $A$. Kit választ másodiknak?`,
          options: [
            R`A $C$-t: a határhaszna 3, a $B$-é csak 2.`,
            R`A $B$-t: egyedül 4 csúcsot fed le, a $C$ csak 3-at.`,
            R`A $B$-t: $\{A, B\}$ együtt $5 + 4 = 9$ csúcsot ér el.`,
            R`A $C$-t: a határhaszna 3, a $B$-é 0, mert a 3-as és a 4-es már le van fedve.`
          ],
          answer: 0,
          hint: R`Ne azt nézd, mennyit fed le a jelölt egyedül, hanem hogy hány <b>új</b> csúcsot ad az $\{A\}$ lefedéséhez. A kezdő maga is számít.`,
          explain: R`Az $\{A\}$ lefedése $\{A, 1, 2, 3, 4\}$, 5 csúcs. A $B$ lefedése $\{B, 3, 4, 5\}$, ebből új csak a $B$ és az 5: határhaszon 2. A $C$ lefedése $\{C, 6, 7\}$, mind új: határhaszon 3. A mohó a $C$-t választja, $\{A, C\}$ 8 csúcsot ér el. A „$B$ egyedül 4” a kezdők egyenkénti rangsorolása – az átfedést nem látja. A $5 + 4 = 9$ a lefedések összeadása: a 3-ast és a 4-est kétszer számolja. A „$B$ határhaszna 0” elfelejti, hogy a $B$ maga és az 5-ös még nincs lefedve.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két hub + kis csillag gráfban ($A$–$B$, az $A$ és a $B$ is az 1–5 csúcsokhoz kötve, a $C$ az $x$, $y$, $z$-hez), független kaszkáddal, $p = 0{,}2$: $\sigma(\{A\}) = \sigma(\{B\}) = 2{,}604$, $\sigma(\{A, B\}) = 3{,}80$. Mennyi a $B$ határhaszna az $\{A\}$ halmazhoz?`,
          options: [R`$\approx 1{,}20$`, R`$\approx 2{,}60$`, R`$\approx 3{,}80$`, R`$\approx 5{,}21$`],
          answer: 0,
          hint: R`A határhaszon különbség: mennyivel nő a várható terjedés, ha a $B$-t hozzáveszed az $\{A\}$-hoz?`,
          explain: R`$\sigma(\{A, B\}) - \sigma(\{A\}) = 3{,}80 - 2{,}604 \approx 1{,}20$. A $2{,}60$ a $B$ egyedül – ennyit csak az üres halmazhoz adna; az $A$ mellett a közönségük nagy része közös. A $3{,}80$ a pár teljes terjedése, nem a növekmény. Az $5{,}21 = 2{,}604 + 2{,}604$ a $\sigma$-k összeadása: az átfedést kétszer számolja. Hogy $1{,}20 \lt 2{,}60$, az éppen a csökkenő hozadék.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A független kaszkád $\sigma(S)$-je monoton és szubmoduláris (Kempe, Kleinberg és Tardos, 2003).`,
            R`Összetett fertőzésnél (küszöb 2) a mohó algoritmus $1 - 1/e$ garanciája nem érvényes.`,
            R`A lusta mohó (CELF) azt használja ki, hogy egy csúcs régi határhaszna felső korlát az újra.`,
            R`Szubmodularitás: egy nagyobb halmazhoz ugyanaz a csúcs legalább annyit tesz hozzá, mint egy kisebbhez.`,
            R`A mohó algoritmus a független kaszkádnál mindig az optimális kezdőhalmazt adja.`
          ],
          answer: [0, 1, 2],
          hint: R`A szubmodularitás csökkenő hozadékot jelent. Gondolj az Árvízhét $p = 0{,}3$-as példájára: a mohó ott elérte-e az optimumot?`,
          explain: R`Igaz: ez a Kempe–Kleinberg–Tardos-tétel; a rögzített élperkolációs kimenetelben a terjedés lefedés, és a lefedés szubmoduláris. Igaz: küszöb 2 mellett a második kezdő többet adhat, mint az első (nő a hozadék), így a garancia nem jár. Igaz: a szubmodularitás miatt a határhaszon csak csökkenhet, ezért a régi érték felső korlát. Hamis a szubmodularitás „megfordított” iránya: nagyobb halmazhoz legfeljebb annyit tesz hozzá. Hamis, hogy a mohó optimális: az Árvízhéten ($p = 0{,}3$) a mohó $\{\mathrm{Ko}, \mathrm{La}\}$ 4,327-et ad, az optimum $\{\mathrm{Po}, \mathrm{Sz}\}$ 4,363. A garancia csak $\approx 63\%$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hálózatban a legjobb 3 kezdő várhatóan 200 embert ér el. Legalább mennyit garantál a mohó algoritmus (várható értékben), ha $\sigma$ monoton és szubmoduláris?`,
          options: [R`$\approx 126$`, R`$200$`, R`$\approx 74$`, R`$100$`],
          answer: 0,
          hint: R`A garancia a $1 - 1/e$ szorzó. Mennyi $1/e$?`,
          explain: R`$(1 - 1/e) \cdot 200 \approx 0{,}632 \cdot 200 \approx 126$. A $200$ azt feltételezi, hogy a mohó optimális – nem az, csak közel jár hozzá. A $74 \approx 200/e$ a szorzó „másik fele”: ennyivel maradhat el legfeljebb, nem ennyit garantál. A $100$ egy kerek „fele” – a garancia ennél jobb. (A gyakorlatban a mohó általában sokkal jobb a garanciánál: az Árvízhéten 99%.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten ($p = 0{,}3$) a mohó algoritmus első kezdője a $\mathrm{Ko}$ ($\sigma = 2{,}898$). Kit választ másodiknak?`,
          options: [
            R`A $\mathrm{La}$-t (vagy az $\text{Ön}$-t): $\sigma(\{\mathrm{Ko}, \mathrm{La}\}) = 4{,}327$.`,
            R`A $\mathrm{Po}$-t: egyedül ő a második legjobb ($\approx 2{,}86$), és neki is 4 a fokszáma.`,
            R`A $\mathrm{Vi}$-t: a $\mathrm{Ko}$ szomszédja, így a kettő együtt gyorsan terjeszt.`,
            R`A $\mathrm{Sz}$-t: a $\mathrm{Po}$ és a $\mathrm{Sz}$ az optimális pár.`
          ],
          answer: 0,
          hint: R`A második kezdőnél a határhaszon számít. Melyik szereplő közönsége fedi át legkevésbé a $\mathrm{Ko}$-ét?`,
          explain: R`A $\sigma(\{\mathrm{Ko}, \cdot\})$ értékek: $\mathrm{La}$ és $\text{Ön}$ 4,327, $\mathrm{Po}$ 4,135, $\mathrm{Vi}$ 3,841, $\mathrm{Sz}$ 3,767, $\mathrm{Kl}$ 3,689. A $\mathrm{La}$ a gráf másik szélén áll, határhaszna $\approx 1{,}43$. A $\mathrm{Po}$ az egyenkénti rangsor szerinti második – de a $\mathrm{Ko}$ közönségét fedi át (határhaszon $\approx 1{,}24$). A $\mathrm{Vi}$ a $\mathrm{Ko}$ közvetlen szomszédja, a közönségük még jobban átfed ($\approx 0{,}94$). A $\{\mathrm{Po}, \mathrm{Sz}\}$ valóban az optimum (4,363), de a mohó nem ezt találja meg: az első lépésben a $\mathrm{Ko}$-t már rögzítette.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért reménytelen egy 1000 csúcsú hálózatban az összes 5 elemű kezdőhalmaz kipróbálása? Hány halmaz van?`,
          options: [R`$\approx 8{,}25 \cdot 10^{12}$`, R`$\approx 9{,}9 \cdot 10^{14}$`, R`$10^{15}$`, R`$5000$`],
          answer: 0,
          hint: R`Számít-e a kezdők sorrendje? Ismételhető-e egy kezdő?`,
          explain: R`A sorrend nem számít, ismétlés nincs: $\binom{1000}{5} \approx 8{,}25 \cdot 10^{12}$ – és mindegyikre sok szimuláció kellene. A $9{,}9 \cdot 10^{14} = 1000 \cdot 999 \cdots 996$ a sorrendet is számolja (variáció). Az $1000^5 = 10^{15}$ ismétlést is megenged. Az $5000 = 5 \cdot 1000$ a mohó algoritmus határhaszon-becsléseinek száma – ezért használható a mohó nagy gráfon.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy marketinges utólag kikeresi, kik indították a tavalyi legnagyobb kaszkádokat, és a következő kampányban csak őket fizeti meg kezdőnek. Mi a fő gond ezzel?`,
          options: [
            R`A nagy kaszkádokban sok a szerencse: a forrásaik előre csak gyengén jósolhatók, és sok „átlagos” kezdő gyakran költséghatékonyabb.`,
            R`Semmi: aki egyszer nagy kaszkádot indított, az a modell szerint is a legjobb kezdő.`,
            R`Az, hogy a mohó algoritmus garanciája miatt elég lenne egyetlen kezdő.`,
            R`Az, hogy a nagy kaszkádok forrásai mindig kis fokszámú csúcsok.`
          ],
          answer: 0,
          hint: R`Gondolj a 9.4 elágazó folyamatára: ugyanaz a tartalom egyszer elhal, máskor felrobban. Mit talált Bakshy és mtsai (2011) a Twitteren?`,
          explain: R`A befolyásos emberek utólagos azonosítása csalóka: egy nagy kaszkád részben szerencse (9.4). Bakshy és munkatársai (2011) szerint a nagy kaszkádok forrásai előre csak gyengén jósolhatók, és sok átlagos kezdő gyakran költséghatékonyabb néhány drága „influenszernél”. Ráadásul a modellbeli legjobb kezdő is modellfüggő ($p$, a platform algoritmusa). A mohó garanciája nem mond semmit a kezdők számáról, és a szöveg nem állítja, hogy a nagy kaszkádok forrásai kis fokszámúak lennének.`
        }
      ]
    },

    /* ------------------------------------------------ 9.6 */
    "gh9-96": {
      title: "Kvíz – 9.6 Véleménydinamika és visszhangkamrák",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`DeGroot-modell (mindenki önmagát és a szomszédait egyforma súllyal átlagolja) az $A$–$B$–$C$–$D$ úton. A $B$ véleménye 10, a többieké 0. Mi a konszenzus?`,
          options: [R`$3$`, R`$2{,}5$`, R`$3{,}33$`, R`$2$`],
          answer: 0,
          hint: R`$\pi_i \propto k_i + 1$. Mennyi a $k + 1$ az út csúcsain, és mennyi az összegük?`,
          explain: R`$k + 1$: 2, 3, 3, 2, összesen 10. $\pi_B = 3/10$, így $x^* = 0{,}3 \cdot 10 = 3$. A $2{,}5$ az egyszerű átlag – csak akkor jó, ha mindenkinek ugyanannyi a fokszáma. A $3{,}33 = 10 \cdot 2/6$ a $k_i/\sum k_j$ súllyal számol, a saját súly ($+1$) nélkül. A $2$ egy végpont súlya ($2/10$): ennyi lenne, ha az $A$ kezdene 10-zel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában (súly nélkül, DeGroot, $\pi_i \propto k_i + 1$) mekkora súllyal kerül a $\mathrm{Ko}$ véleménye a konszenzusba? (A fokszámok összege 20, a csúcsok száma 7.)`,
          options: [R`$5/27$`, R`$1/5$`, R`$1/7$`, R`$4/27$`],
          answer: 0,
          hint: R`A nevező $\sum_j (k_j + 1)$, a számláló $k_{\mathrm{Ko}} + 1$.`,
          explain: R`$\sum (k + 1) = 20 + 7 = 27$, a $\mathrm{Ko}$ fokszáma 4: $\pi_{\mathrm{Ko}} = 5/27 \approx 0{,}185$. Az $1/5 = 4/20$ elhagyja a saját súlyt (a hurkot). Az $1/7$ az egyszerű átlag súlya – a fokszám itt számít. A $4/27$ a nevezőben már $+1$-gyel számol, a számlálóban nem: a $\pi$-k összege így nem is lenne 1.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két szomszéd, véleményük 0 és 1. Mindenki csak a szomszédja véleményét veszi át, a sajátját nem súlyozza. Mi történik?`,
          options: [
            R`Oszcillálnak: 1 és 0, aztán 0 és 1, … – sosem jutnak konszenzusra.`,
            R`Egy lépésben konszenzus: mindketten 0,5.`,
            R`Lassan közelednek, és a 0,5-höz tartanak.`,
            R`Mindketten 1-re váltanak, mert a nagyobb vélemény győz.`
          ],
          answer: 0,
          hint: R`Írd fel az első két lépést. Mi lenne a különbség, ha mindenki önmagát is beszámítaná az átlagba?`,
          explain: R`Saját súly nélkül mindketten a másikét veszik fel: $(0, 1) \to (1, 0) \to (0, 1) \to \dots$ Páros gráfban ez az oszcilláció tipikus. A „0,5 egy lépésben” a saját súlyos változat: ott mindketten $(0 + 1)/2$-t vesznek fel. A lassú közeledés egyik változatban sem jön elő ennél a két embernél. A „nagyobb győz” nem átlagolás – a DeGroot-modellben nincs ilyen szabály.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hegselmann–Krause, $\varepsilon = 0{,}25$, mindenki mindenkit hall. Vélemények: 0; 0,2; 0,4; 0,7; 1. Mi lesz egy lépés után?`,
          options: [
            R`$0{,}1$; $0{,}2$; $0{,}3$; $0{,}7$; $1$`,
            R`$0{,}2$; $0{,}2$; $0{,}2$; $0{,}7$; $1$`,
            R`$0{,}1$; $0{,}2$; $0{,}3$; $0{,}85$; $0{,}85$`,
            R`mindenki $0{,}46$`
          ],
          answer: 0,
          hint: R`Mindenkire külön: kik vannak tőle legfeljebb 0,25-re (önmagát is beleértve)? A 0,7 és az 1 távolsága 0,3.`,
          explain: R`A 0 a 0-t és a 0,2-t hallja: 0,1. A 0,2 a 0-t, a 0,2-t és a 0,4-et: 0,2. A 0,4 a 0,2-t és a 0,4-et (a 0,7 már 0,3-ra van): 0,3. A 0,7 senkit sem hall magán kívül (0,4 és 1 is 0,3-ra van): marad 0,7. Az 1 is marad. A $(0{,}2; 0{,}2; 0{,}2; 0{,}7; 1)$ a <b>végállapot</b> (a második lépés után) – egy lépésben a vélemények nem „futnak tovább”. A $0{,}85$-ös változat a 0,7-et és az 1-et egymás hallótávolságába teszi, pedig $0{,}3 \gt 0{,}25$. A $0{,}46$ a kezdővélemények egyszerű átlaga: ez a korlátos bizalmat figyelmen kívül hagyja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Deffuant-modell, $\varepsilon = 0{,}3$, $\mu = 0{,}25$. A 0,3-as és a 0,5-ös véleményű ember találkozik. Mi lesz a véleményük?`,
          options: [R`$0{,}35$ és $0{,}45$`, R`$0{,}4$ és $0{,}4$`, R`nem változik`, R`$0{,}25$ és $0{,}55$`],
          answer: 0,
          hint: R`Előbb nézd meg, beszélgetnek-e egyáltalán ($|x_i - x_j| \lt \varepsilon$?), aztán: $x_i \leftarrow x_i + \mu(x_j - x_i)$.`,
          explain: R`A különbség $0{,}2 \lt 0{,}3$, tehát közelednek: $0{,}3 + 0{,}25 \cdot 0{,}2 = 0{,}35$ és $0{,}5 - 0{,}25 \cdot 0{,}2 = 0{,}45$. Közelednek, de nem érnek össze. A $0{,}4$ és $0{,}4$ a $\mu = 0{,}5$ esete. A „nem változik” akkor lenne igaz, ha a különbség legalább $\varepsilon$ lenne. A $0{,}25$ és $0{,}55$ előjelhiba: a modellben a közel állók közelednek, nem távolodnak.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyenletesen elszórt kezdővélemények, sok ágens, $\varepsilon = 0{,}08$. A tapasztalati szabály szerint kb. hány nagy véleménycsoport marad?`,
          options: [R`$6$`, R`$12$`, R`$3$`, R`$7$`],
          answer: 0,
          hint: R`Két szomszédos végső csoport legalább kb. $2\varepsilon$-ra van egymástól. Hány ilyen fér a $[0; 1]$ intervallumba?`,
          explain: R`$\lfloor 1/(2\varepsilon) \rfloor = \lfloor 1/0{,}16 \rfloor = \lfloor 6{,}25 \rfloor = 6$. A $12$ a $1/\varepsilon$ – elfelejti, hogy egy csoport kb. $\varepsilon$ távolságig vonz mindkét irányból. A $3 \approx 1/(4\varepsilon)$ kétszer annyi helyet ad egy csoportnak. A $7$ felfelé kerekít. És ne feledd: ez csak tapasztalati szabály – kevés ágensnél vagy hálózaton a véletlen és a szerkezet is beleszól.`
        },
        {
          type: "multi",
          q: R`Az együtt változó hálózat és vélemény modelljében (Deffuant-lépés + homofil újrahuzalozás $q$ eséllyel) melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`Nagy $q$ és kis $\varepsilon$ mellett a hálózat egyvéleményű komponensekre esik szét.`,
            R`$\varepsilon = 1$ mellett az összefüggő hálózat konszenzusra jut, a $q$ nem számít.`,
            R`A modell azt mutatja, hogy a mechanizmus képes visszhangkamrát létrehozni – azt nem, hogy a valóságban ez a fő ok.`,
            R`A polarizációhoz az kell, hogy az emberek véleménye eltávolodjon egymástól.`,
            R`A végső csoportok száma csak az $\varepsilon$-on múlik, a hálózat szerkezetén nem.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi történik egy élen, ha a két vége $\varepsilon$-on belül van, és mi, ha nem? Távolodik-e bárki a modellben?`,
          explain: R`Igaz: nagy $q$-nál a csoportok közti élek gyorsan átkötődnek, és minden komponensben egy vélemény uralkodik. Igaz: $\varepsilon = 1$-nél minden él közelítést hoz, újrahuzalozás nincs. Igaz: a modell egy lehetséges magyarázat; ugyanezt a szétválást ajánlóalgoritmus vagy földrajzi és nyelvi különbség is okozhatja. Hamis: a modellben senki sem távolodik – elég, ha a távoliakra nem hallgatunk, a közeliek pedig közelednek. Hamis: kevés ágensnél, egyenetlen kezdővéleményeknél vagy hálózaton a szerkezet és a véletlen is beleszól.`
        }
      ]
    },

    /* ------------------------------------------------ 9.7 */
    "gh9-97": {
      title: "Kvíz – 9.7 Alkalmazás: ugyanaz a hír, más hálózat",
      questions: [
        {
          type: "set",
          q: R`Négy hálózat, mindegyik 1000 csúcsú, átlagosan 4 kapcsolattal. Ugyanaz a hír, $p = 0{,}25$. Melyikben lesz a kezdések legalább 5%-ából 100-nál nagyobb kaszkád? (Jelöld meg mindet.)`,
          items: ["gyűrűrács", "kisvilág (WS)", "véletlen (ER)", "skálafüggetlen (BA)"],
          answer: ["véletlen (ER)", "skálafüggetlen (BA)"],
          hint: R`Hasonlítsd össze a $p$-t a $T_c = 1/\kappa$-val (rács 0,33, kisvilág 0,32, ER 0,25, BA 0,10) – és gondolj arra, hol érvényes ez a képlet.`,
          explain: R`A 9.7 táblázata szerint $p = 0{,}25$-nél: rács 0%, kisvilág 0%, ER 7%, BA 35%. A BA jóval a küszöb ($\approx 0{,}10$) fölött van a hubok miatt. Az ER éppen a küszöbén áll ($\kappa \approx 3{,}9$), és már 7%-ból lesz nagy kaszkád. A rácsban és a kisvilágban a $T_c$ is magasabb, ráadásul a sok háromszög „elpazarolja” a továbbadásokat – a 10% átkötés itt nem segít. „A kisvilág mindent gyorsít” csak az elérési időre igaz, nem a küszöbre.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy BA-hálózatban ($n = 1000$, $m = 2$) $\kappa \approx 10{,}1$. Legalább mekkora $p$ kell nagyjából ahhoz, hogy egy hír elterjedhessen?`,
          options: [R`$\approx 0{,}099$`, R`$0{,}25$`, R`$\approx 0{,}090$`, R`$\approx 0{,}110$`],
          answer: 0,
          hint: R`Hüvelykujjszabály: a hír akkor terjedhet el, ha $p \cdot \kappa \gt 1$. Mi szerepel a $\kappa$-ban, és mi nem?`,
          explain: R`$T_c = 1/\kappa = 1/10{,}1 \approx 0{,}099$. A $0{,}25 = 1/\langle k\rangle$ a Poisson-fokszámú (ER) hálózat küszöbe – heterogén hálózaton ez sokkal magasabb a valódinál. A $0{,}090 = 1/11{,}1$ a $\langle k^2\rangle/\langle k\rangle$-val számol, a „−1” nélkül (a beérkező élt nem lehet újra használni). A $0{,}110 = 1/9{,}1$ a „−1”-et kétszer vonja le: a $\kappa$-ban már benne van.`
        },
        {
          type: "single", shuffle: true,
          q: R`A politikai blogokon ($p = 0{,}03$) a kaszkádméret mediánja 1, az átlaga 124. Mit jelent ez?`,
          options: [
            R`A kezdések több mint fele egyetlen blognál megáll; néhány ritka, nagy kaszkád húzza fel az átlagot.`,
            R`Egy tipikus kezdésből kb. 124 blog kapja meg a hírt.`,
            R`Mivel a medián 1, a $p$ a küszöb alatt van, nagy kaszkád nincs.`,
            R`A kezdések fele 124 blognál nagyobb kaszkádot indít.`
          ],
          answer: 0,
          hint: R`Mit mond a medián, és mit az átlag egy nehéz farkú eloszlásnál?`,
          explain: R`A medián 1: a kezdések legalább fele (a táblázat szerint 60%) egyetlen blognál elhal. A kezdések 32%-ából viszont 50-nél nagyobb kaszkád lesz, ezek húzzák fel az átlagot. Nehéz farkú eloszlásnál az átlag nem tipikus. A $p = 0{,}03$ a küszöb ($\approx 0{,}012$) fölött van – a kicsi medián nem jelenti, hogy nincs nagy kaszkád. A „fele 124 fölött” a mediánt keveri az átlaggal.`
        },
        {
          type: "single", shuffle: true,
          q: R`A blogok linkjeinek csak kb. 9%-a köt össze liberális és konzervatív blogot. A nagy kaszkádokban (független kaszkád) mégis kb. fele-fele arányban vannak a két tábor blogjai. Miért?`,
          options: [
            R`Egyszerű fertőzésnél egyetlen tábor közti él is elég az átlépéshez, és egy nagy kaszkád sok élt próbál ki.`,
            R`Mert a hírek valójában összetett fertőzésként terjednek, és a hidak megerősítést adnak.`,
            R`Mert a polarizált szerkezet felgyorsítja a terjedést a másik táborban.`,
            R`Mert a 9% kevés: a nagy kaszkádok csak a tábor határáig jutnak.`
          ],
          answer: 0,
          hint: R`Hány forrás kell a független kaszkádban egy csúcs aktiválásához? Hány élt „próbál ki” egy több száz blogos kaszkád?`,
          explain: R`A független kaszkád egyszerű fertőzés: egyetlen forrás elég. A nagy kaszkádok sok élt próbálnak ki, így a 9%-nyi híd bőven elég az átlépéshez, és a hubok mindkét táborban sok élt adnak. A polarizált szerkezet az egyszerű terjedést nem állítja meg – egy összetett fertőzést (több forrás kell) viszont sokkal inkább megfogna. Ezért hibás az összetett fertőzéses magyarázat, és a „határig jut” állítás is ellentmond a táblázatnak.`
        },
        {
          type: "single", shuffle: true,
          q: R`Vosoughi és mtsai (2018) szerint a hamis hírek kaszkádjai mélyebbek és virálisabbak voltak. Juul és Ugander (2021) ugyanazt az adatot újraelemezte. Mit találtak?`,
          options: [
            R`Azonos méretű kaszkádokat párosítva a szerkezeti különbségek szinte eltűntek: a hamis hírek inkább csak fertőzőbbek.`,
            R`A hamis hírek kaszkádjai valójában kisebbek voltak, mint az igazaké.`,
            R`Méretpárosítás után is a hamis hírek fái voltak a mélyebbek: más a terjedés mechanizmusa.`,
            R`Az adat hibás volt, ezért az eredeti cikket visszavonták.`
          ],
          answer: 0,
          hint: R`A 9.4 szerint hogyan függ a mélység és a virálisság a kaszkád méretétől?`,
          explain: R`A mélység és a virálisság a mérettel együtt nő, ezért különböző méretű kaszkádok szerkezetét nem szabad közvetlenül összevetni. Juul és Ugander méret szerint párosított, és a mélység, szélesség, virálisság különbsége szinte eltűnt: a hamis hírek nagyobb $p$-vel terjednek, ezért nagyobbak, de a mechanizmus ugyanaz. Ami elfogadott: a hamis hírek az adatban átlagosan nagyobb kaszkádokat értek el – tehát nem kisebbek. Visszavonásról a szöveg nem szól.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért van zárójelben a gyűrűrács $T_c = 1/\kappa \approx 0{,}33$ értéke a 9.7 táblázatában?`,
          options: [
            R`Mert a képlet fa-szerű (kevés háromszögű) hálózatra szól; a rácsban a háromszögek miatt a valódi küszöb sokkal magasabb.`,
            R`Mert a rácsban a valódi küszöb alacsonyabb: a szomszédok átfedése gyorsítja a terjedést.`,
            R`Mert a rács minden csúcsának fokszáma 4, így $\kappa$ nem értelmezhető.`,
            R`Mert a rácsban a küszöböt az átlagos fokszámból kell számolni: $T_c = 1/4$.`
          ],
          answer: 0,
          hint: R`Milyen hálózatokra érvényes a Newman-féle küszöbtétel? Mit tesznek a háromszögek a továbbadásokkal?`,
          explain: R`A $T_c = 1/\kappa$ a konfigurációs modellre, nagy, fa-szerű véletlen gráfra szól. A rács tele van háromszögekkel: akit megfertőzök, annak a szomszédai jórészt az én szomszédaim is, így a továbbadások „elpazarlódnak”. Egy dimenzióban gyakorlatilag sosem lesz nagy kaszkád (a valódi küszöb közel 1). Az átfedés tehát lassít, nem gyorsít. A $\kappa$ reguláris gráfban is értelmes ($4 - 1 = 3$). A $1/\langle k\rangle$ csak Poisson-fokszámokra (ER) jó közelítés.`
        },
        {
          type: "multi",
          q: R`A fejezet kérdésére („a tartalmon múlik egy hír sikere, vagy a hálózaton?”) melyik állítás következik a 9.7 eredményeiből? (Több jó válasz is lehet.)`,
          options: [
            R`A tartalom a továbbadás esélyét ($p$) adja; a hálózat dönti el, hogy ez a küszöb alatt vagy fölött van.`,
            R`A küszöb fölött is a kezdések többsége kicsi kaszkádot ad: egy konkrét hír sikere korlátosan jósolható.`,
            R`A viselkedés típusa is számít: az egyszerű fertőzést a hidak gyorsítják, az összetettet a sűrű körök viszik.`,
            R`Ugyanaz a $p$ minden 1000 csúcsú, $\langle k\rangle = 4$ hálózatban ugyanakkora eséllyel ad nagy kaszkádot.`,
            R`Ha a modellben a hubok viszik a terjedést, akkor egy konkrét valódi kaszkádot is biztosan a hubok vittek.`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg újra a négy hálózat táblázatát és a „Mit nem tud a modell?” dobozt.`,
          explain: R`Igaz: ez a hüvelykujjszabály – a tartalom a $p$-t állítja, a hálózat a küszöböt. Igaz: a medián minden hálózatban 2–3, még a BA-ban is; a nagy kaszkád ritka esemény. Igaz: ez a 9.3 tanulsága, a fejezet válaszának része. Hamis: $p = 0{,}25$-nél a BA-ban 35%, a rácsban 0% – az átlagos fokszám nem dönt. Hamis: a modell oksági állítása csak a modellen belül érvényes.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh9-final": {
      title: "Fejezetzáró teszt – 9. Terjedés hálózatokon",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy fogékony csúcsnak 3 fertőző szomszédja van, $\beta = 0{,}2$. Mekkora eséllyel fertőződik meg a következő lépésben?`,
          options: [R`$0{,}488$`, R`$0{,}6$`, R`$0{,}512$`, R`$0{,}008$`],
          answer: 0,
          hint: R`„Legalább egy” helyett számolj az ellentettel: mekkora eséllyel nem adja át egyik sem?`,
          explain: R`$1 - (1 - 0{,}2)^3 = 1 - 0{,}512 = 0{,}488$. A $0{,}6 = 3 \cdot 0{,}2$ az esélyek összeadása – csak kis $\beta$-nál jó közelítés, és nagy $k$-nál 1 fölé is mehet. A $0{,}512 = 0{,}8^3$ éppen az ellentett esemény (egyik sem adja át): a kivonás maradt el. A $0{,}008 = 0{,}2^3$ annak esélye, hogy <b>mindhárom</b> átadja – elég egy is.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $BC$, $CD$, $DE$, $CF$. Biztos SI-terjedés (minden fertőző minden szomszédját megfertőzi). Melyik csúcsból indulva lesz leghamarabb mindenki fertőzött, és hány lépés alatt?`,
          options: [
            R`$C$-ből, 2 lépés alatt`,
            R`$C$-ből, 1 lépés alatt`,
            R`$B$-ből vagy $D$-ből, 2 lépés alatt`,
            R`$C$-ből, 3 lépés alatt`
          ],
          answer: 0,
          hint: R`A terjedés szélességi bejárás: mindenkit $\mathrm{ecc}(s)$ lépés alatt ér el. Melyik csúcs excentricitása a legkisebb?`,
          explain: R`A $C$-ből: 1. lépés $B$, $D$, $F$; 2. lépés $A$, $E$. $\mathrm{ecc}(C) = 2$, ez a legkisebb (a $B$-é és a $D$-é 3, az $A$-é és az $E$-é 4). Az „1 lépés” a fokszámot keveri az elérési idővel: a $C$-nek 3 szomszédja van, de az $A$ és az $E$ 2 lépésre van. A $B$-ből az $E$ 3 lépésre van ($B$–$C$–$D$–$E$). A „3 lépés” egy lépésben „továbbfuttatja” vagy késlelteti a fertőzést: aki a $t$-edik lépésben fertőződik, a $t + 1$-edikben ad tovább.`
        },
        {
          type: "single", shuffle: true,
          q: R`SIR az $A$–$B$–$C$ úton, az $A$ fertőző, $\beta = 0{,}4$, $\gamma = 0{,}5$. Mekkora eséllyel kapja el végül a $C$?`,
          options: [R`$\approx 0{,}327$`, R`$0{,}16$`, R`$\approx 0{,}571$`, R`$0{,}64$`],
          answer: 0,
          hint: R`Előbb az átvitel: $T = \beta/(\beta + \gamma - \beta\gamma)$. Hány élen kell átjutnia?`,
          explain: R`$T = 0{,}4/(0{,}4 + 0{,}5 - 0{,}2) = 0{,}4/0{,}7 \approx 0{,}571$. A $C$-hez két élen kell átjutni, mindkettőn a küldő saját fertőző időszakában: $T^2 \approx 0{,}327$. A $0{,}16 = \beta^2$ a $T = \beta$ hibája: $\gamma \lt 1$ mellett a fertőző több lépésen át próbálkozik. A $0{,}571$ csak a $B$ esélye. A $0{,}64 = (\beta/\gamma)^2$: a $\beta/\gamma$ nem valószínűség, hanem $R_0$-szerű hányados.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AE$, $BD$, $BF$, $CD$ (fokszámok 3, 3, 2, 2, 1, 1). Mennyi a $T_c = 1/\kappa$ küszöb? (Kis gráfon a képlet csak szemléltet.)`,
          options: [R`$0{,}75$`, R`$0{,}5$`, R`$\approx 0{,}43$`, R`$\approx 0{,}21$`],
          answer: 0,
          hint: R`$\langle k\rangle$, $\langle k^2\rangle$, aztán $\kappa = \langle k^2\rangle/\langle k\rangle - 1$.`,
          explain: R`$\langle k\rangle = 12/6 = 2$, $\langle k^2\rangle = (9 + 9 + 4 + 4 + 1 + 1)/6 = 28/6 \approx 4{,}67$. $\kappa = 4{,}67/2 - 1 \approx 1{,}33$, $T_c = 0{,}75$. A $0{,}5 = 1/\langle k\rangle$ a Poisson-fokszámok (ER) küszöbe, itt nem érvényes. A $0{,}43 = \langle k\rangle/\langle k^2\rangle$ a „−1”-et hagyja el: a beérkező élt nem lehet újra használni. A $0{,}21 = 1/\langle k^2\rangle$ az $\langle k\rangle$-val való osztást felejti el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $DE$. Ismerős-immunizálás: egy véletlen embert megkérdezünk, és egy véletlen ismerősét oltjuk be. Mekkora eséllyel oltjuk be az $A$-t?`,
          options: [R`$1/2$`, R`$1/5$`, R`$3/8$`, R`$3/5$`],
          answer: 0,
          hint: R`Vedd sorra, kit kérdezhetünk meg (mindenkit $1/5$ eséllyel), és ő milyen eséllyel nevezi meg az $A$-t.`,
          explain: R`A $B$ és a $C$ egyetlen ismerőse az $A$ (1–1), a $D$ két ismerőséből az egyik ($1/2$), az $E$ csak a $D$-t ismeri (0), az $A$ nem nevezheti meg magát (0). $\tfrac15(1 + 1 + \tfrac12) = 1/2$. Az $1/5$ a véletlen oltás – vagy a megkérdezett oltása, ami ugyanaz: a trükk az ismerős. A $3/8 = k_A/\sum k$ egy véletlen élvég esélye, de mi előbb csúcsot, aztán élt választunk. A $3/5$ elfelejti, hogy a $D$-nek két ismerőse van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Független kaszkád, $p = 0{,}5$. Élek: $AB$, $AC$, $BC$, $CD$. Az $A$ kezd. Mekkora eséllyel jut el a hír a $D$-hez?`,
          options: [R`$0{,}3125$`, R`$0{,}25$`, R`$0{,}375$`, R`$0{,}125$`],
          answer: 0,
          hint: R`A $D$-hez csak a $C$-n át lehet eljutni. A $C$ a háromszögben két úton kaphatja meg – de ugyanazt az esetet ne számold kétszer.`,
          explain: R`A $C$ esélye: közvetlenül $0{,}5$, vagy az $A$–$C$ él kudarca után a $B$-n át $0{,}5 \cdot 0{,}5 \cdot 0{,}5 = 0{,}125$: összesen $0{,}625$. Utána a $C$–$D$ él: $0{,}625 \cdot 0{,}5 = 0{,}3125$. A $0{,}25$ csak a közvetlen utat számolja. A $0{,}375$ a közvetett utat $p^2$-tel adja hozzá ($0{,}75 \cdot 0{,}5$) – a közvetlen él kudarca nélkül, így a „mindkettő sikeres” esetet kétszer számolja. A $0{,}125$ csak az $A$–$B$–$C$–$D$ utat nézi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 7 fős tömeg küszöbei (Granovetter, mindenki mindenkit lát): 0, 0, 2, 2, 3, 6, 6. Hányan állnak be végül?`,
          options: [R`$5$`, R`$7$`, R`$2$`, R`$4$`],
          answer: 0,
          hint: R`Lépésenként: hány ember küszöbe legfeljebb a jelenlegi létszám? Ha ez nem nő, megáll.`,
          explain: R`Kezdetben a két 0-s: 2 fő. A 2-esek beállnak: 4. A 3-as beáll: 5. A következő küszöb 6, de csak 5-en vannak: megáll 5-nél. A $7$ az átlagos küszöbből ($\approx 2{,}7$) jósol „alacsony a küszöb, mindenki beáll” – de a kimenetelt az eloszlás dönti el. A $2$ a hiányzó 1-es küszöb miatt megállna – csakhogy két 0-s van, így már 2-en vannak. A $4$ a 3-as küszöbűt hagyja ki.`
        },
        {
          type: "multi",
          q: "Egyszerű és összetett fertőzés – melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A véletlen, hosszú élek az egyszerű fertőzést gyorsítják, az összetettet lefojthatják.`,
            R`Ha ugyanaz az ismerős tízszer mutat meg egy hírt, az nem tíz független forrás – nem összetett fertőzés.`,
            R`Egy fában két szomszédos kezdőből $\theta = 2$ abszolút küszöbbel nem terjed tovább semmi.`,
            R`A kisvilág-átkötések minden terjedést gyorsítanak.`,
            R`Ha valaki több ismerőse után vett át egy szokást, az biztosan összetett fertőzés.`
          ],
          answer: [0, 1, 2],
          hint: R`Hány jelet visz át egy hosszú él? Van-e két szomszédos csúcsnak közös szomszédja egy fában? És mi más okozhatja, hogy hasonló emberek ugyanazt teszik?`,
          explain: R`Igaz: egy hosszú él csak egy jelet visz, a túloldalon nincs megerősítés (Centola és Macy, 2007). Igaz: az összetett fertőzés különböző szomszédokból jövő megerősítést jelent. Igaz: egy fában két szomszédos csúcsnak nincs közös szomszédja, senki sem kap két jelet. Hamis „a kisvilág mindenre gyorsít”: 5% átkötés a 100 csúcsú gyűrűrácson az összetett fertőzés elérését 100%-ról 25%-ra vágja. Hamis a „biztosan”: lehet homofília is – a hasonló emberek egymástól függetlenül teszik ugyanazt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kaszkádfa: a gyökér gyerekei $a$ és $b$, az $a$ gyereke $c$, a $c$ gyereke $d$. Mennyi a strukturális virálisság, $\nu$?`,
          options: [R`$2{,}0$`, R`$1{,}75$`, R`$3$`, R`$4{,}0$`],
          answer: 0,
          hint: R`Wiener-index élenként: $s(n - s)$, ahol $s$ az él egyik oldalán lévő csúcsok száma. Utána oszd a párok számával.`,
          explain: R`$n = 5$. Gyökér–$a$: $\{a, c, d\}$ | 2 csúcs, $3 \cdot 2 = 6$; gyökér–$b$: $1 \cdot 4 = 4$; $a$–$c$: $2 \cdot 3 = 6$; $c$–$d$: $1 \cdot 4 = 4$. Összesen 20, $\binom52 = 10$ pár: $\nu = 2{,}0$. Az $1{,}75$ csak a gyökértől mért távolságok átlaga ($(1 + 1 + 2 + 3)/4$) – a virálisság minden párt néz. A $3$ a mélység, ami nem ugyanaz. A $4{,}0 = 20/5$ a csúcsok számával oszt a párok helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Minden megosztónak 4 új követője van, mindegyik $q = 0{,}2$ eséllyel osztja tovább, egymástól függetlenül. Mennyi a kaszkád várható mérete, és mekkora eséllyel marad 1 méretű?`,
          options: [
            R`átlag $5$; $P(1) \approx 0{,}41$`,
            R`átlag $1{,}8$; $P(1) \approx 0{,}41$`,
            R`átlag $5$; $P(1) \approx 0{,}0016$`,
            R`átlag $5$; $P(1) \approx 0{,}59$`
          ],
          answer: 0,
          hint: R`$R = 4q$, a várható méret $1/(1 - R)$. A kaszkád akkor marad 1, ha egyik követő sem osztja meg.`,
          explain: R`$R = 4 \cdot 0{,}2 = 0{,}8$, $E[\text{méret}] = 1/(1 - 0{,}8) = 5$. $P(1) = 0{,}8^4 \approx 0{,}41$. Az $1{,}8 = 1 + R$ csak az első generációt számolja – a mértani sor többi tagja ($R^2$, $R^3$, …) kimarad. A $0{,}0016 = 0{,}2^4$ annak esélye, hogy <b>mind</b> a négy megosztja. A $0{,}59 = 1 - 0{,}8^4$ az ellentett: legalább egy megosztja. Figyeld meg: az átlag 5, mégis a kaszkádok 41%-a egyetlen megosztás – az átlag nem tipikus.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kampány két kezdőt választ. Várható terjedés: $\sigma(A) = 40$, $\sigma(B) = 38$, $\sigma(C) = 25$; $\sigma(A, B) = 50$, $\sigma(A, C) = 60$, $\sigma(B, C) = 62$. Mit választ a mohó algoritmus?`,
          options: [
            R`$\{A, C\}$-t (60) – nem optimális, a $\{B, C\}$ 62-t adna.`,
            R`$\{A, B\}$-t: a két legjobb egyedül.`,
            R`$\{B, C\}$-t (62): a mohó mindig megtalálja az optimumot.`,
            R`$\{A, C\}$-t, és ez az optimum: $40 + 25 = 65$.`
          ],
          answer: 0,
          hint: R`Első lépés: a legjobb egyedül. Második lépés: az ahhoz képest legnagyobb határhaszon. Utána nézd meg az összes párt.`,
          explain: R`Előbb az $A$ (40). Utána a $B$ határhaszna $50 - 40 = 10$, a $C$-é $60 - 40 = 20$: a $C$. A mohó $\{A, C\}$, 60. Az optimum viszont $\{B, C\}$, 62 – a mohó nem optimális, de $60 \ge (1 - 1/e) \cdot 62 \approx 39$, bőven a garancián belül. Az $\{A, B\}$ az egyenkénti rangsor hibája. A $40 + 25 = 65$ a $\sigma$-k összeadása: az átfedést kétszer számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`DeGroot-modell (önmaga + szomszédai egyforma súllyal). Élek: $AB$, $AC$, $BC$, $CD$. A $D$ véleménye 12, a többieké 0. Mi a konszenzus?`,
          options: [R`$2$`, R`$3$`, R`$1{,}5$`, R`$4$`],
          answer: 0,
          hint: R`$\pi_i \propto k_i + 1$. A fokszámok: $A$ 2, $B$ 2, $C$ 3, $D$ 1.`,
          explain: R`$k + 1$: 3, 3, 4, 2, összesen 12. $\pi_D = 2/12$, $x^* = 12 \cdot 2/12 = 2$. A $3 = 12/4$ az egyszerű átlag – a fokszámok nem egyenlők. Az $1{,}5 = 12 \cdot 1/8$ a $k_i/\sum k_j$ súly, a saját súly nélkül. A $4 = 12 \cdot 4/12$ a $C$ súlyával számol: annyi lenne, ha a $C$ indulna 12-vel.`
        },
        {
          type: "match",
          q: "Párosítsd a modellt a szabályával!",
          pairs: [
            ["DeGroot", "mindenki a saját és a szomszédai véleményének súlyozott átlagára vált"],
            ["Hegselmann–Krause", "mindenki egyszerre a hozzá epszilonon belüliek átlagára vált"],
            ["Deffuant", "egy véletlen pár közeledik, ha elég közel áll egymáshoz"],
            ["homofil újrahuzalozás", "a túl távoli véleményű szomszéd helyett hasonlóhoz köt át"],
            ["küszöbmodell", "akkor aktív, ha elég sok vagy elég nagy arányú szomszédja aktív"]
          ],
          hint: R`Melyik modellben számít a véleménykülönbség, és melyikben csak az aktív szomszédok száma? Melyik változtatja a hálózatot is?`,
          explain: R`DeGroot: $\mathbf x(t+1) = W\mathbf x(t)$, mindenkire hallgat, ezért konszenzus. Hegselmann–Krause: szinkron, mindenki az $\varepsilon$-on belüliek (önmagát is beleértve) átlagát veszi. Deffuant: páronként, $\mu$ lépésközzel, csak ha $|x_i - x_j| \lt \varepsilon$. Homofil újrahuzalozás: a visszhangkamra-modell második fele – a hálózat is változik. A küszöbmodell nem véleményátlagolás: egy aktív/inaktív állapot terjed $\theta$ küszöbbel (9.3).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy álhír a politikai blogokon $p = 0{,}02$-vel terjed ($\kappa \approx 80$, $T_c \approx 0{,}012$). Egy figyelmeztetés a $p$-t 25%-kal csökkenti. Mit vársz?`,
          options: [
            R`$p = 0{,}015$ – még a küszöb fölött: a nagy kaszkádok ritkábbak lesznek, de továbbra is előfordulhatnak.`,
            R`Pontosan 25%-kal kevesebb nagy kaszkád lesz.`,
            R`$p = 0{,}015 \lt 1/\langle k\rangle \approx 0{,}037$, tehát a küszöb alá kerül: nagy kaszkád nem lesz.`,
            R`Semmi sem változik: a küszöb fölött minden hír elterjed.`
          ],
          answer: 0,
          hint: R`Hol lesz az új $p$ a $T_c$-hez képest? És arányos-e a hatás a beavatkozással?`,
          explain: R`$0{,}02 \cdot 0{,}75 = 0{,}015 \gt 0{,}012$: a küszöb fölött marad. A 9.7 táblázata szerint $p = 0{,}0125$-nél 1%, $0{,}02$-nél 15% volt a nagy kaszkádok aránya – a $0{,}015$ valahol a kettő között lesz. A hatás nem arányos a beavatkozással (mint a „10% oltás = 10%-kal kisebb járvány” hibánál). Az $1/\langle k\rangle$ az ER-gráf küszöbe: a hubos blogháló küszöbét a $\kappa$ adja. A küszöb fölött sem terjed el minden hír: a kezdések nagy része így is kicsi marad.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
