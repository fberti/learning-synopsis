/* =========================================================
   2. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 2.1 */
    "p2-21": {
      title: "Kvíz – 2.1 Feltételes valószínűség",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Két szabályos kockával dobunk. Tudjuk, hogy a dobott számok összege 8. Mi a valószínűsége, hogy valamelyik kockán 3-as van?",
          options: [R`$\tfrac{2}{5} \approx 0{,}4$`, R`$\tfrac{1}{3} \approx 0{,}333$`, R`$\tfrac{11}{36} \approx 0{,}306$`, R`$\tfrac{1}{18} \approx 0{,}056$`],
          answer: 0,
          hint: R`Szűkítsd az eseményteret az összeg 8-at adó rendezett párokra, és ezek között számolj!`,
          explain: R`$B$ = „összeg 8” $= \{(2,6),(3,5),(4,4),(5,3),(6,2)\}$, 5 elem. Ebből 3-ast tartalmaz: $(3,5)$ és $(5,3)$. $P(A \mid B) = \tfrac25$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$P(A) = 0{,}5$, $P(B) = 0{,}4$ és $P(AB) = 0{,}1$. Mennyi $P(A \mid B)$?`,
          options: [R`$0{,}25$`, R`$0{,}2$`, R`$0{,}1$`, R`$0{,}04$`],
          answer: 0,
          hint: R`Írd fel a feltételes valószínűség definícióját: melyik valószínűség kerül a nevezőbe?`,
          explain: R`$P(A \mid B) = \dfrac{P(AB)}{P(B)} = \dfrac{0{,}1}{0{,}4} = 0{,}25$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 200 fős cégnél 120 nő és 80 férfi dolgozik. A nők közül 30-an, a férfiak közül 20-an dohányoznak. Egy véletlenül kiválasztott dolgozóról kiderül, hogy dohányzik. Mi a valószínűsége, hogy nő?",
          options: [R`$0{,}6$`, R`$0{,}25$`, R`$0{,}15$`, R`$0{,}4$`],
          answer: 0,
          hint: R`Mi az új eseménytér: az összes dolgozó, a nők vagy a dohányosok?`,
          explain: R`Az új eseménytér az 50 dohányos; ebből 30 nő: $P(\text{nő} \mid \text{dohányzik}) = \tfrac{30}{50} = 0{,}6$. (Figyelem: $P(\text{dohányzik} \mid \text{nő}) = \tfrac{30}{120} = 0{,}25$ – egészen más szám!)`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak minden $A$ eseményre és minden $P(B) > 0$ eseményre?`,
          options: [
            R`$P(A \mid B) = P(B \mid A)$`,
            R`$P(\Omega \mid B) = 1$`,
            R`$P(\overline{A} \mid B) = 1 - P(A \mid B)$`,
            R`$P(A \mid B) \ge P(A)$`,
            R`$P(A \mid B) \ge P(AB)$`
          ],
          answer: [1, 2, 4],
          hint: R`Gondold végig: $P(\,\cdot \mid B)$ maga is valószínűség – mely tulajdonságok öröklődnek, és melyik állításra van ellenpélda?`,
          explain: R`Rögzített $B$ mellett $P(\,\cdot \mid B)$ maga is valószínűség (teljesíti az axiómákat), ezért igaz a 2. és a 3. Az 5.: $P(A\mid B) = P(AB)/P(B) \ge P(AB)$, mert $P(B) \le 1$. Az 1. és a 4. általában hamis.`
        },
        {
          q: "Egy családban két gyerek van, és tudjuk, hogy legalább az egyikük fiú. Mi a valószínűsége, hogy mindkettő fiú? (A fiú és a lány születését tekintsük egyformán valószínűnek.)",
          options: [R`$\tfrac12$`, R`$\tfrac13$`, R`$\tfrac14$`, R`$\tfrac23$`],
          answer: 1,
          hint: R`Írd fel a négy egyformán valószínű esetet (rendezve: idősebb, fiatalabb), és húzd ki, amit a feltétel kizár!`,
          explain: R`$\Omega = \{FF, FL, LF, LL\}$. A feltétel kizárja az $LL$-t, marad 3 egyformán valószínű eset, ebből 1 kedvező: $\tfrac13$. (A „$\tfrac12$” akkor lenne jó, ha azt tudnánk, hogy az <em>idősebb</em> gyerek fiú.)`
        }
      ]
    },

    /* ------------------------------------------------ 2.2 */
    "p2-211": {
      title: "Kvíz – 2.2 Szorzási szabály",
      questions: [
        {
          type: "single", shuffle: true,
          q: "10 alkatrész közül 3 hibás. Visszatevés nélkül egymás után kettőt kiveszünk. Mi a valószínűsége, hogy mindkettő hibás?",
          options: [R`$\tfrac{1}{15} \approx 0{,}067$`, R`$\tfrac{9}{100} \approx 0{,}09$`, R`$\tfrac{3}{50} \approx 0{,}06$`, R`$\tfrac{2}{15} \approx 0{,}133$`],
          answer: 0,
          hint: R`Szorzási szabály: az első húzás után változik a doboz tartalma – mennyi alkatrész és hány hibás marad?`,
          explain: R`$\tfrac{3}{10}\cdot\tfrac{2}{9} = \tfrac{6}{90} = \tfrac{1}{15} \approx 0{,}067$.`
        },
        {
          type: "single", shuffle: true,
          q: "A 32 lapos magyar kártyából egymás után (visszatevés nélkül) húzunk két lapot. Mi a valószínűsége, hogy mindkettő ász? (4 ász van.)",
          options: [R`$\tfrac{3}{248} \approx 0{,}0121$`, R`$\tfrac{1}{64} \approx 0{,}0156$`, R`$\tfrac{3}{256} \approx 0{,}0117$`, R`$\tfrac{3}{124} \approx 0{,}0242$`],
          answer: 0,
          hint: R`Szorozd össze a lépésenkénti valószínűségeket, ügyelve arra, hogy a második húzásnál már eggyel kevesebb lap (és ász) van.`,
          explain: R`$\tfrac{4}{32}\cdot\tfrac{3}{31} = \tfrac{12}{992} = \tfrac{3}{248} \approx 0{,}0121$.`
        },
        {
          q: R`Melyik az általános szorzási szabály három eseményre?`,
          options: [
            R`$P(ABC) = P(A)\,P(B)\,P(C)$`,
            R`$P(ABC) = P(A)\,P(B \mid A)\,P(C \mid AB)$`,
            R`$P(ABC) = P(A \mid B)\,P(B \mid C)\,P(C \mid A)$`,
            R`$P(ABC) = P(A) + P(B) + P(C) - 1$`
          ],
          answer: 1,
          hint: R`Melyik képletben van minden tényező az összes korábbi eseményre feltételezve?`,
          explain: "Az első csak teljesen független eseményekre igaz; az általános szabályban minden tényező az összes korábbi eseményre van feltételezve."
        },
        {
          type: "single", shuffle: true,
          q: "Feldobunk egy érmét és egy szabályos kockát. Mi a valószínűsége, hogy az érmén írás, a kockán 5-ös lesz?",
          options: [R`$\tfrac{1}{12} \approx 0{,}083$`, R`$\tfrac{2}{3} \approx 0{,}667$`, R`$\tfrac{7}{12} \approx 0{,}583$`, R`$\tfrac{1}{6} \approx 0{,}167$`],
          answer: 0,
          hint: R`Az „és” szorzást jelent – befolyásolja-e az érme eredménye a kockát?`,
          explain: R`A két lépés nem hat egymásra, így $P(\text{írás és 5-ös}) = \tfrac12\cdot\tfrac16 = \tfrac{1}{12}$. A $\tfrac23$ az összeadás hibája ($\tfrac12 + \tfrac16$), a $\tfrac{7}{12}$ a „írás <em>vagy</em> 5-ös” valószínűsége, az $\tfrac16$ pedig elfelejti az érmét.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy urnában 3 piros és 2 fehér golyó van. Kétszer húzunk visszatevéssel. Mi a valószínűsége, hogy mindkét golyó piros?",
          options: [R`$\tfrac{9}{25} = 0{,}36$`, R`$\tfrac{3}{10} = 0{,}3$`, R`$\tfrac{3}{5} = 0{,}6$`, R`$\tfrac{12}{25} = 0{,}48$`],
          answer: 0,
          hint: R`Visszatevéssel a második húzás előtt ugyanaz az urna tartalma, mint az elsőnél – a lépésenkénti valószínűségeket szorozd!`,
          explain: R`Visszatevésnél mindkét húzásnál $\tfrac35$ a piros esélye: $\tfrac35\cdot\tfrac35 = \tfrac{9}{25} = 0{,}36$. A $0{,}3 = \tfrac35\cdot\tfrac24$ a visszatevés nélküli eset, a $0{,}6$ csak egy húzás, a $0{,}48 = 2\cdot\tfrac35\cdot\tfrac25$ az „egy piros, egy fehér” valószínűsége.`
        }
      ]
    },

    /* ------------------------------------------------ 2.3 */
    "p2-22": {
      title: "Kvíz – 2.3 Fadiagram és teljes valószínűség",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Feldobunk egy érmét: fej esetén az I. urnából (3 piros, 2 fehér), írás esetén a II. urnából (1 piros, 4 fehér) húzunk egy golyót. Mi a valószínűsége, hogy piros golyót húzunk?",
          options: [R`$0{,}4$`, R`$0{,}8$`, R`$0{,}3$`, R`$0{,}03$`],
          answer: 0,
          hint: R`Rajzolj fadiagramot: az ágak mentén szorozz, a pirosba vezető utakat add össze – a két urnát ne öntsd össze!`,
          explain: R`Két út vezet a piroshoz: $\tfrac12\cdot\tfrac35 + \tfrac12\cdot\tfrac15 = \tfrac{3}{10} + \tfrac{1}{10} = 0{,}4$.`
        },
        {
          q: "Hogyan kapjuk meg egy fadiagramon egy esemény valószínűségét, ha több út is hozzá vezet?",
          options: [
            "Az utak mentén összeadjuk, az utakat összeszorozzuk.",
            "Az utak mentén összeszorozzuk a valószínűségeket, majd az utakhoz tartozó szorzatokat összeadjuk.",
            "Csak a leghosszabb utat vesszük figyelembe.",
            "Az összes ág valószínűségét összeadjuk."
          ],
          answer: 1,
          hint: R`Mit jelent egy út (egymás utáni lépések együtt), és hogyan viszonyulnak egymáshoz a különböző utak?`,
          explain: "Egy út = egymás utáni események együttes bekövetkezése → szorzási tétel. Különböző utak = egymást kizáró esetek → összeadás."
        },
        {
          type: "single", shuffle: true,
          q: "Egy termék 60%-át az A gép 2%-os, 40%-át a B gép 5%-os selejtaránnyal gyártja. Mi a valószínűsége, hogy egy véletlenül kiválasztott termék selejtes?",
          options: [R`$0{,}032$`, R`$0{,}07$`, R`$0{,}035$`, R`$0{,}038$`],
          answer: 0,
          hint: R`Teljes valószínűség tétele: a gépek alkotják a teljes eseményrendszert, a selejtarányokat a gépek részesedésével kell súlyozni.`,
          explain: R`$P(S) = 0{,}6\cdot0{,}02 + 0{,}4\cdot0{,}05 = 0{,}012 + 0{,}020 = 0{,}032$.`
        },
        {
          type: "single", shuffle: true,
          q: "A hallgatók 70%-a felkészülten megy vizsgázni. A felkészültek 90%-a, a felkészületlenek 30%-a megy át. Mekkora a valószínűsége, hogy egy véletlenül kiválasztott hallgató átmegy?",
          options: [R`$0{,}72$`, R`$0{,}63$`, R`$0{,}6$`, R`$0{,}48$`],
          answer: 0,
          hint: R`Bontsd két esetre (felkészült / felkészületlen), és súlyozd a feltételes átmenési arányokat az esetek valószínűségével!`,
          explain: R`$0{,}7\cdot0{,}9 + 0{,}3\cdot0{,}3 = 0{,}63 + 0{,}09 = 0{,}72$.`
        },
        {
          type: "multi",
          q: "Kockadobásnál melyek alkotnak teljes eseményrendszert?",
          options: [
            R`$\{1,2\},\ \{3,4\},\ \{5,6\}$`,
            "páros, páratlan",
            "prím, nem prím",
            R`$\{1,2,3\},\ \{3,4,5,6\}$`,
            R`$\{1\},\ \{2\},\ \{3\}$`
          ],
          answer: [0, 1, 2],
          hint: R`Két dolgot ellenőrizz minden felosztásnál: páronként diszjunktak-e, és lefedik-e az összes dobást?`,
          explain: "Teljes eseményrendszer: páronként kizáró események, amelyek összege a biztos esemény. A 4. esetben a 3 mindkettőben benne van; az 5. nem fedi le a 4, 5, 6 dobást."
        },
        {
          q: R`Egy teljes eseményrendszer két eleme $A_1$ és $A_2$. Tudjuk, hogy $P(B \mid A_1) = 0{,}2$ és $P(B \mid A_2) = 0{,}6$. Mit mondhatunk $P(B)$-ről?`,
          options: [
            "Pontosan 0,4.",
            "0,2 és 0,6 közé esik – a feltételes valószínűségek súlyozott átlaga.",
            "Lehet akár 0,7 is.",
            "Pontosan 0,8 (a kettő összege)."
          ],
          answer: 1,
          hint: R`Írd fel a teljes valószínűség tételét két tagra – a súlyok összege mennyi?`,
          explain: R`$P(B) = P(A_1)\cdot0{,}2 + P(A_2)\cdot0{,}6$, ahol a súlyok összege 1 – ez egy súlyozott átlag. Pontosan 0,4 csak akkor, ha $P(A_1) = P(A_2) = \tfrac12$.`
        }
      ]
    },

    /* ------------------------------------------------ 2.4 */
    "p2-221": {
      title: "Kvíz – 2.4 Bayes tétele",
      questions: [
        {
          type: "single", shuffle: true,
          q: "(Az előző kvíz gépei:) a termékek 60%-át az A gép 2%-os, 40%-át a B gép 5%-os selejttel gyártja. Egy kiválasztott termék selejtes. Mi a valószínűsége, hogy a B gépen készült?",
          options: [R`$0{,}625$`, R`$0{,}375$`, R`$0{,}4$`, R`$0{,}05$`],
          answer: 0,
          hint: R`Bayes-tétel: a B gépen át vezető selejtes utat oszd el az összes selejtes út valószínűségével.`,
          explain: R`$P(B \mid S) = \dfrac{0{,}4\cdot0{,}05}{0{,}032} = \dfrac{0{,}02}{0{,}032} = 0{,}625$. A B gép csak a termékek 40%-át adja, de a selejtnek már 62,5%-át!`
        },
        {
          type: "single", shuffle: true,
          q: "Egy betegség a lakosság 2%-át érinti. A teszt szenzitivitása 90% (beteget 90% eséllyel jelez pozitívnak), specificitása 95% (egészségeseknél 5% az álpozitív). Valakinek pozitív a tesztje. Mekkora eséllyel beteg?",
          options: [R`$\approx 0{,}269$`, R`$0{,}9$`, R`$\approx 0{,}067$`, R`$0{,}018$`],
          answer: 0,
          hint: R`A „beteg és pozitív” utat oszd el az összes pozitív teszt valószínűségével – az álpozitív egészségeseket ne felejtsd ki!`,
          explain: R`$\dfrac{0{,}02\cdot0{,}9}{0{,}02\cdot0{,}9 + 0{,}98\cdot0{,}05} = \dfrac{0{,}018}{0{,}067} \approx 0{,}269$. Csak kb. 27% – mert az egészségesek sokkal többen vannak.`
        },
        {
          type: "single", shuffle: true,
          q: "Feldobunk egy érmét: fej esetén az 1. dobozból (2 piros, 1 kék), írás esetén a 2. dobozból (1 piros, 3 kék) húzunk. Piros golyót húztunk. Mi a valószínűsége, hogy az 1. dobozból?",
          options: [R`$\tfrac{8}{11} \approx 0{,}727$`, R`$\tfrac{2}{3} \approx 0{,}667$`, R`$\tfrac{11}{24} \approx 0{,}458$`, R`$\tfrac{3}{11} \approx 0{,}273$`],
          answer: 0,
          hint: R`Bayes-tétel: az 1. dobozon át vezető piros út valószínűségét oszd el az összes piros út valószínűségével.`,
          explain: R`$\dfrac{\tfrac12\cdot\tfrac23}{\tfrac12\cdot\tfrac23 + \tfrac12\cdot\tfrac14} = \dfrac{1/3}{1/3 + 1/8} = \dfrac{8}{11} \approx 0{,}727$.`
        },
        {
          q: R`A Bayes-tételben $P(A_i)$-t és $P(A_i \mid B)$-t hogyan nevezzük?`,
          options: [
            R`$P(A_i)$: a posteriori, $P(A_i \mid B)$: a priori`,
            R`$P(A_i)$: a priori (előzetes), $P(A_i \mid B)$: a posteriori (utólagos)`,
            "Mindkettő likelihood.",
            "Mindkettő teljes valószínűség."
          ],
          answer: 1,
          hint: R`A latin elnevezés árulkodó: melyik valószínűség ismert a megfigyelés előtt, és melyik utána?`,
          explain: R`A priori = a megfigyelés <em>előtti</em> valószínűség; a posteriori = a $B$ megfigyelése <em>utáni</em>, frissített valószínűség. $P(B \mid A_i)$ a likelihood.`
        }
      ]
    },

    /* ------------------------------------------------ 2.5 */
    "p2-23": {
      title: "Kvíz – 2.5 Függetlenség",
      questions: [
        {
          q: R`$A$ és $B$ egymást kizáró események, $P(A) = 0{,}3$, $P(B) = 0{,}5$. Függetlenek-e?`,
          options: ["Igen, mert nincs közös elemük.", R`Nem, mert $P(AB) = 0 \ne 0{,}15 = P(A)P(B)$.`, "Nem dönthető el."],
          answer: 1,
          hint: R`Ellenőrizd a definíciót: $P(AB) = P(A)P(B)$? Mennyi $P(AB)$ kizáró eseményeknél?`,
          explain: "Pozitív valószínűségű kizáró események soha nem függetlenek: ha az egyik bekövetkezik, a másik biztosan nem – ez erős függés!"
        },
        {
          type: "single", shuffle: true,
          q: "Két számítógép egymástól függetlenül működik; egy műszak alatt az egyik 0,3, a másik 0,2 valószínűséggel hibásodik meg. Mi a valószínűsége, hogy legalább az egyik meghibásodik?",
          options: [R`$0{,}44$`, R`$0{,}5$`, R`$0{,}38$`, R`$0{,}06$`],
          answer: 0,
          hint: R`A „legalább az egyik” helyett számold az ellentett eseményt (egyik sem hibásodik meg), és használd a függetlenséget!`,
          explain: R`Egyik sem hibásodik meg: $0{,}7\cdot0{,}8 = 0{,}56$, ennek ellentettje $1 - 0{,}56 = 0{,}44$.`
        },
        {
          type: "multi",
          q: "Egy kockadobásnál melyik eseménypár független?",
          options: [
            R`páros és $\{1, 2\}$`,
            R`páros és $\{1, 2, 3\}$`,
            "páros és páratlan",
            R`páros és $\Omega$`,
            R`$\{1,2,3,4\}$ és páros`
          ],
          answer: [0, 3, 4],
          hint: R`Minden párra számold ki $P(AB)$-t és $P(A)P(B)$-t, és hasonlítsd össze őket!`,
          explain: R`Ellenőrizd $P(AB) = P(A)P(B)$-t: 1. $\tfrac16 = \tfrac12\cdot\tfrac13$ ✓; 2. $\tfrac16 \ne \tfrac14$; 3. $0 \ne \tfrac14$; 4. $\tfrac12 = \tfrac12\cdot1$ ✓; 5. $\tfrac13 = \tfrac23\cdot\tfrac12$ ✓.`
        },
        {
          q: "Egy szabályos érmével ötször egymás után fejet dobtunk. Mi a valószínűsége, hogy a hatodik dobás is fej lesz?",
          options: [R`$\tfrac12$`, R`$\tfrac1{64}$`, R`$\tfrac1{32}$`, R`kisebb, mint $\tfrac12$, mert „jár már” az írás`],
          answer: 0,
          hint: R`Befolyásolják-e a korábbi dobások a következőt? Ne keverd a „hat fej egymás után” előre számolt esélyével!`,
          explain: R`Az egymás utáni dobások függetlenek: $\tfrac12$. A „jár már az írás” gondolat a <em>szerencsejátékos tévedése</em>. ($\tfrac1{64}$ a hat fej <em>előre</em> számított esélye.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány egyenlőségnek kell teljesülnie ahhoz, hogy három esemény ($A$, $B$, $C$) teljesen független legyen?`,
          options: [R`$4$`, R`$3$`, R`$1$`, R`$7$`],
          answer: 0,
          hint: R`Számold össze a legalább kételemű részhalmazait az $\{A, B, C\}$ halmaznak – mindegyikre kell egy szorzatfeltétel.`,
          explain: R`Három páronkénti ($AB$, $AC$, $BC$) és egy hármas ($ABC$): $2^3 - 3 - 1 = 4$.`
        }
      ]
    },

    /* ------------------------------------------------ 2.6 */
    "p2-26": {
      title: "Kvíz – 2.6 Alkalmazások",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Három, egymástól függetlenül 0,9 valószínűséggel működő elemet sorba kapcsolunk. Mi a valószínűsége, hogy a rendszer működik?",
          options: [R`$0{,}729$`, R`$0{,}999$`, R`$0{,}271$`, R`$0{,}81$`],
          answer: 0,
          hint: R`Mikor működik egy soros rendszer: ha legalább egy, vagy ha minden eleme működik?`,
          explain: R`Soros rendszer csak akkor működik, ha minden eleme működik: $0{,}9^3 = 0{,}729$.`
        },
        {
          type: "single", shuffle: true,
          q: "Két, egymástól függetlenül működő elemet párhuzamosan kapcsolunk; az egyik 0,9, a másik 0,7 valószínűséggel működik. Mi a valószínűsége, hogy a rendszer működik?",
          options: [R`$0{,}97$`, R`$0{,}63$`, R`$0{,}03$`, R`$0{,}8$`],
          answer: 0,
          hint: R`Párhuzamos rendszer akkor áll le, ha minden eleme hibás – érdemes az ellentett eseményből kiindulni.`,
          explain: R`Leállás: mindkettő hibás, $0{,}1\cdot0{,}3 = 0{,}03$; működés: $1 - 0{,}03 = 0{,}97$. A $0{,}63 = 0{,}9\cdot0{,}7$ a <em>soros</em> kapcsolás, a $0{,}03$ a leállás esélye (elfelejtett komplementer), a $0{,}8$ pedig csak átlag.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 500 000 lakosú városban egy bűncselekményt egyetlen lakos követett el. A DNS-minta egy ártatlan emberével 1 : 10 000 eséllyel egyezik (a bűnösével biztosan). Ha valakit csak azért gyanúsítanak, mert a mintája egyezik, kb. mekkora a valószínűsége, hogy ártatlan?",
          options: [R`$\approx 0{,}98$`, R`$0{,}0001$`, R`$0{,}9999$`, R`$0{,}5$`],
          answer: 0,
          hint: R`Ne keverd össze $P(\text{egyezés} \mid \text{ártatlan})$-t és $P(\text{ártatlan} \mid \text{egyezés})$-t – becsüld meg, hány ártatlan lakos mintája egyezne!`,
          explain: R`Kb. $499\,999 / 10\,000 \approx 50$ ártatlan lakosnak egyezne a mintája, és 1 bűnösnek, így $P(\text{ártatlan} \mid \text{egyezés}) \approx \tfrac{50}{51} \approx 0{,}98$. A $0{,}0001$ a fordított feltételes valószínűség, $P(\text{egyezés} \mid \text{ártatlan})$ – a kettő összekeverése az <em>ügyész tévedése</em>.`
        },
        {
          q: "Egy kórházban az enyhe és a súlyos esetek között is jobb a gyógyulási arány, mint egy másikban – összesítve mégis rosszabb. Hogyan lehetséges ez (Simpson-paradoxon)?",
          options: [
            "Sehogy: ha mindkét csoportban jobb, összesítve is jobbnak kell lennie, tehát számolási hiba történt.",
            "Az összesített arány a csoportarányok súlyozott átlaga, és az első kórházba sokkal nagyobb arányban kerülnek súlyos (rosszabb kilátású) betegek – a súlyok eltérnek.",
            "Az összesítéskor a két csoport százalékait össze kell adni, és az összeg lehet kisebb.",
            "A teljes valószínűség tétele csak független csoportokra érvényes, ezért itt nem alkalmazható."
          ],
          answer: 1,
          hint: R`Írd fel az összesített gyógyulási arányt a teljes valószínűség tételével: mik a súlyok, és azonosak-e a két kórházban?`,
          explain: R`$P(\text{gyógyul}) = P(\text{enyhe})\,P(\text{gy} \mid \text{enyhe}) + P(\text{súlyos})\,P(\text{gy} \mid \text{súlyos})$ – súlyozott átlag. Ha az egyik kórházban a súlyos esetek (alacsony gyógyulási arány) súlya sokkal nagyobb, az átlaga lejjebb kerülhet, bár csoportonként jobb. Nincs számolási hiba, és a százalékokat nem összeadni, hanem súlyozni kell.`
        },
        {
          q: "A Monty Hall-játékban az első választás után a műsorvezető kinyit egy kecskés ajtót. Mekkora eséllyel nyer az, aki vált?",
          options: [R`$\tfrac13$`, R`$\tfrac12$`, R`$\tfrac23$`, R`$1$`],
          answer: 2,
          hint: R`Mikor nyer a váltó játékos? Vizsgáld az első választás szerint: autót vagy kecskét választott elsőre.`,
          explain: R`Váltással pontosan akkor nyerünk, ha elsőre kecskét választottunk – ennek esélye $\tfrac23$.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p2-final": {
      title: "Fejezetzáró teszt – 2. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Két kockával dobunk. Tudjuk, hogy az összeg legalább 10. Mi a valószínűsége, hogy dupla (a két szám egyenlő)?",
          options: [R`$\tfrac{1}{3} \approx 0{,}333$`, R`$\tfrac{1}{6} \approx 0{,}167$`, R`$\tfrac{1}{18} \approx 0{,}056$`, R`$\tfrac{1}{2} \approx 0{,}5$`],
          answer: 0,
          hint: R`Sorold fel a 10, 11 és 12 összeget adó rendezett párokat – ez az új eseménytér.`,
          explain: R`Összeg $\ge 10$: $(4,6),(5,5),(6,4),(5,6),(6,5),(6,6)$ – 6 eset, ebből dupla 2: $\tfrac26 = \tfrac13$.`
        },
        {
          type: "match",
          q: "Párosítsd a képleteket a nevükkel!",
          hint: R`Figyeld, mi áll a képletben: szorzat vagy összeg, és van-e benne feltétel (és ha igen, melyik irányú)?`,
          pairs: [
            [R`$P(AB) = P(A)\,P(B \mid A)$`, "szorzási tétel"],
            [R`$P(B) = \sum_i P(A_i)\,P(B \mid A_i)$`, "teljes valószínűség tétele"],
            [R`$P(A_k \mid B) = \dfrac{P(A_k)P(B \mid A_k)}{\sum_i P(A_i)P(B \mid A_i)}$`, "Bayes-tétel"],
            [R`$P(AB) = P(A)\,P(B)$`, "függetlenség"],
            [R`$P(A \mid B) = \dfrac{P(AB)}{P(B)}$`, "feltételes valószínűség definíciója"]
          ]
        },
        {
          type: "single", shuffle: true,
          q: "Egy cipőkereskedő az X, Y, Z gyártól 25, 35, ill. 40%-ban vásárol; a gyárak cipőinek 5, 4, ill. 2%-a hibás. Egy kiválasztott cipő hibás. Mi a valószínűsége, hogy az X gyárban készült?",
          options: [R`$\approx 0{,}362$`, R`$0{,}25$`, R`$\approx 0{,}406$`, R`$0{,}05$`],
          answer: 0,
          hint: R`Előbb a teljes valószínűség tételével számold ki a hibás cipő valószínűségét, aztán alkalmazd a Bayes-tételt.`,
          explain: R`$P(\text{hibás}) = 0{,}25\cdot0{,}05 + 0{,}35\cdot0{,}04 + 0{,}40\cdot0{,}02 = 0{,}0345$; $P(X \mid \text{hibás}) = \tfrac{0{,}0125}{0{,}0345} \approx 0{,}362$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$A$ és $B$ független, $P(A) = 0{,}4$, $P(B) = 0{,}5$. Mennyi $P(A + B)$?`,
          options: [R`$0{,}7$`, R`$0{,}9$`, R`$0{,}2$`, R`$0{,}3$`],
          answer: 0,
          hint: R`Összeg valószínűsége: ne felejtsd el levonni a közös részt, amelyet a függetlenség miatt szorzással kapsz.`,
          explain: R`$P(A+B) = 0{,}4 + 0{,}5 - 0{,}4\cdot0{,}5 = 0{,}7$. (Vagy: $1 - 0{,}6\cdot0{,}5 = 0{,}7$.)`
        },
        {
          type: "single", shuffle: true,
          q: "A 32 lapos magyar kártyából három lapot húzunk egymás után, visszatevés nélkül. Mi a valószínűsége, hogy mindhárom piros? (8 piros lap van.)",
          options: [R`$\tfrac{7}{620} \approx 0{,}0113$`, R`$\tfrac{1}{64} \approx 0{,}0156$`, R`$\tfrac{21}{2048} \approx 0{,}0103$`, R`$\tfrac{21}{310} \approx 0{,}0677$`],
          answer: 0,
          hint: R`Szorzási szabály három lépésre: minden húzás után csökken a lapok és a piros lapok száma is.`,
          explain: R`$\tfrac{8}{32}\cdot\tfrac{7}{31}\cdot\tfrac{6}{30} = \tfrac{336}{29\,760} \approx 0{,}0113$.`
        },
        {
          type: "single", shuffle: true,
          q: "Két, egymástól függetlenül 0,8 valószínűséggel működő elemet párhuzamosan kapcsolunk. Mi a valószínűsége, hogy a rendszer működik?",
          options: [R`$0{,}96$`, R`$0{,}64$`, R`$0{,}32$`, R`$0{,}04$`],
          answer: 0,
          hint: R`Párhuzamos rendszer: mikor áll le? Számold az ellentett eseményt!`,
          explain: R`Csak akkor áll le, ha mindkettő hibás: $1 - 0{,}2^2 = 0{,}96$.`
        },
        {
          q: R`Ha $P(A \mid B) = P(A)$ (és $P(A), P(B) > 0$), akkor…`,
          options: [
            R`$A$ és $B$ kizárják egymást.`,
            R`$P(B \mid A) = P(B)$ is teljesül, azaz $A$ és $B$ függetlenek.`,
            R`$P(B) = 1$.`,
            R`$A \subseteq B$.`
          ],
          answer: 1,
          hint: R`Írd át a feltételt a definícióval $P(AB)$-re, és nézd meg, mit kapsz $P(B \mid A)$-ra.`,
          explain: R`$P(A\mid B) = P(A) \iff P(AB) = P(A)P(B) \iff P(B \mid A) = P(B)$ – a függetlenség szimmetrikus.`
        },
        {
          q: "Egy bírósági ügyben a szakértő: „Ha a vádlott ártatlan, csak 1 : 10 000 az esélye, hogy a minta egyezik.” Mit jelent ez?",
          options: [
            "Azt, hogy a vádlott 99,99% valószínűséggel bűnös.",
            R`Azt, hogy $P(\text{egyezés} \mid \text{ártatlan}) = 0{,}0001$ – ebből $P(\text{ártatlan} \mid \text{egyezés})$ csak az a priori adatokkal együtt számolható.`,
            "Azt, hogy 10 000 emberből pontosan egy bűnös.",
            "Semmit, mert a valószínűség nem alkalmazható bíróságon."
          ],
          answer: 1,
          hint: R`Figyeld meg, melyik esemény áll a feltételben – szabad-e megfordítani a feltételes valószínűséget?`,
          explain: R`Ez az <em>ügyész tévedése</em>: $P(E \mid \text{ártatlan})$ és $P(\text{ártatlan} \mid E)$ összekeverése. Egymillió lehetséges elkövetőből kb. 100-nak egyezne a mintája – egy egyezés önmagában messze nem bizonyíték.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
