/* =========================================================
   Mesterséges intelligencia 5. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 5.1 */
    "ai5-51": {
      title: "Kvíz – 5.1 Az osztályozási feladat",
      questions: [
        {
          type: "match",
          q: "Párosítsd a kérdést a feladat típusával!",
          pairs: [
            ["Hány fok lesz holnap délben?", "regresszió"],
            ["Lesz-e holnap fagy?", "bináris osztályozás"],
            ["Melyik számjegy van a képen?", "többosztályos osztályozás"],
            ["Milyen címkék illenek egy fotóra (tenger, kutya, naplemente…)?", "többcímkés osztályozás"]
          ],
          hint: "Szám vagy kategória a címke? Ha kategória: hány lehetséges érték van, és egy mintának lehet-e több címkéje?",
          explain: "A hőmérséklet szám (regresszió); a fagy igen/nem (bináris); a számjegy 10 osztály egyike (többosztályos); a fotóhoz egyszerre több címke is tartozhat (többcímkés)."
        },
        {
          type: "single", shuffle: true,
          q: "Egy adatkészletben 300 levél van, ebből 75 spam. Mennyi az alapvonal (mindig a többségi osztály) pontossága?",
          options: ["75%", "25%", "50%", "100%"],
          answer: 0,
          hint: "Melyik a többségi osztály, és mekkora az aránya?",
          explain: "A többség a 225 nem spam: $225/300 = 75\\%$. A 25% a spamek aránya (a kisebbségi osztály), az 50% a „pénzfeldobás”, ami itt nem az alapvonal."
        },
        {
          type: "single", shuffle: true,
          q: "A „spam, ha felkiáltójel ≥ 3” szabály a tíz levélen (spam: 2, 5, 3, 6; nem spam: 0, 0, 0, 1, 4, 1 felkiáltójel) hány levelet talál el?",
          options: ["8", "9", "7", "10"],
          answer: 0,
          hint: "Nézd meg külön a spameket (mind ≥ 3?) és a nem spameket (mind < 3?).",
          explain: "A spamek közül a 2 felkiáltójeles S1 kimarad, a nem spamek közül a 4 felkiáltójeles H5 spamnek számít: 2 hiba, 8 helyes. A 9 a ≥ 2-es küszöb eredménye."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a lineáris döntési határra?",
          options: [
            R`Síkban egy egyenes: $w_1x_1 + w_2x_2 + b = 0$.`,
            "A határ egyik oldalán az egyik, a másikon a másik osztályt mondja a modell.",
            "Ha a tanító adaton 100%-os, akkor egyértelműen ez a legjobb határ.",
            "Több dimenzióban sík vagy hipersík.",
            "Lineáris határral bármilyen két osztály hibátlanul elválasztható."
          ],
          answer: [0, 1, 3],
          hint: "Gondolj a „ferde” és a „lépcsős” szabályra, amelyek mindketten 100%-osak voltak – és a XOR-ra.",
          explain: "Sok különböző határ lehet 100%-os ugyanazon a kevés ponton, és más-más döntést adhat új pontra. Nem minden adat választható el egyenessel (lásd a XOR-t az 5.6-ban)."
        },
        {
          type: "single", shuffle: true,
          q: R`A „spam, ha $2\cdot\text{linkek} + \text{felkiáltójelek} \ge 9$” szabály mit mond a (3 link; 3 felkiáltójel) levélre?`,
          options: [
            R`spam, mert $2\cdot3 + 3 = 9 \ge 9$`,
            R`nem spam, mert $3 + 3 = 6 \lt 9$`,
            R`nem spam, mert $2\cdot3 + 3 = 9$ nem nagyobb 9-nél`,
            "nem lehet eldönteni, mert a pont a határon van"
          ],
          answer: 0,
          hint: "Helyettesíts be pontosan a szabályba, és figyeld a ≥ jelet!",
          explain: R`$2\cdot3 + 3 = 9$, és a szabály $\ge 9$-et kér, tehát spam. A második válasz elfelejti a 2-es súlyt, a harmadik a ≥-t szigorú >-nak olvassa. A határon lévő pontról is dönt a szabály – a ≥ megmondja, melyik oldalra tartozik.`
        }
      ]
    },

    /* ------------------------------------------------ 5.2 */
    "ai5-52": {
      title: "Kvíz – 5.2 Legközelebbi szomszédok és centroid",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A ★ = (3; 3) levél szomszédai távolság szerint: H5 (nem spam), S2 (spam), S1 (spam), H6 (nem spam), S3 (spam), … Mit mond a kNN k = 1, 3 és 5 esetén?",
          options: [
            "nem spam, spam, spam",
            "spam, spam, spam",
            "nem spam, nem spam, spam",
            "nem spam, spam, nem spam"
          ],
          answer: 0,
          hint: "Számold meg a szavazatokat az első 1, 3 és 5 szomszéd között.",
          explain: "k = 1: csak a H5 → nem spam. k = 3: H5, S2, S1 → 2 : 1 spam. k = 5: + H6, S3 → 3 : 2 spam."
        },
        {
          type: "multi",
          q: "Melyik igaz a kNN-re?",
          options: [
            "A kis k túlillesztéshez vezet (zajos, szaggatott határ).",
            "k = n esetén mindig a többségi osztályt mondja.",
            "A k-t a tanító adaton mért pontosság alapján érdemes választani.",
            "Két osztálynál páratlan k-t választunk, hogy ne legyen döntetlen.",
            "A kis k a torzítást (bias) növeli."
          ],
          answer: [0, 1, 3],
          hint: "Mi lenne a legjobb k a tanító adaton? És melyik hibafajtát növeli az, ha egyetlen szomszéd dönt?",
          explain: "A tanító adaton az 1-NN mindig 100%-os, ezért ott a k-t nem lehet választani – validáció kell. A kis k a varianciát növeli (egy pont véletlene dönt), a nagy k a torzítást; egy népszerű könyv (MLAB) ezt fordítva írja."
        },
        {
          type: "single", shuffle: true,
          q: "Mi a spamek centroidja, ha a spam levelek (linkek; felkiáltójelek): (5; 2), (3; 5), (6; 3), (2; 6)?",
          options: ["(4; 4)", "(16; 16)", "(4,5; 4)", "(3,5; 4,5)"],
          answer: 0,
          hint: "Koordinátánként átlagolj: összeg osztva a pontok számával.",
          explain: R`$\left(\frac{5 + 3 + 6 + 2}{4};\ \frac{2 + 5 + 3 + 6}{4}\right) = (4;\ 4)$. A (16; 16) a koordináták összege osztás nélkül; a másik kettő elszámolás.`
        },
        {
          type: "single", shuffle: true,
          q: "A két centroid (4; 4) és (1; 1). Mi a legközelebbi centroid módszer döntési határa?",
          options: [
            R`$x_1 + x_2 = 5$`,
            R`$x_1 + x_2 = 2{,}5$`,
            R`$x_1 = x_2$`,
            R`$x_1 + x_2 = 8$`
          ],
          answer: 0,
          hint: "A határ a két centroidot összekötő szakasz felező merőlegese. Hol van a szakasz felezőpontja?",
          explain: R`A felezőpont (2,5; 2,5), a szakasz iránya (3; 3), ezért a merőleges egyenes $x_1 + x_2 = 5$. Az $x_1 = x_2$ maga az összekötő egyenes, nem a merőleges; a 2,5 csak a felezőpont egyik koordinátája.`
        },
        {
          type: "single", shuffle: true,
          q: "Lakások: alapterület (40–120 m²) és szobaszám (1–4). Mit csinál a kNN skálázás nélkül?",
          options: [
            "Szinte csak az alapterület alapján keresi a szomszédokat.",
            "Szinte csak a szobaszám alapján keresi a szomszédokat.",
            "A két jellemzőt egyformán veszi figyelembe.",
            "Hibát jelez, mert a jellemzők mértékegysége különböző."
          ],
          answer: 0,
          hint: "A távolság a különbségeket adja össze (négyzetesen). Melyik jellemző különbségei nagyobb számok?",
          explain: "Az alapterület-különbségek tízes nagyságrendűek, a szobaszám-különbségek legfeljebb 3-ak – a távolságot az alapterület uralja. A kNN semmilyen hibát nem jelez, csendben rossz szomszédokat talál; ezért kell skálázni."
        }
      ]
    },

    /* ------------------------------------------------ 5.3 */
    "ai5-53": {
      title: "Kvíz – 5.3 Logisztikus regresszió",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\sigma(-2)$, ha $\sigma(2) \approx 0{,}881$?`,
          options: ["0,119", "−0,881", "0,881", "0,5"],
          answer: 0,
          hint: R`Használd a $\sigma(-z) = 1 - \sigma(z)$ szimmetriát.`,
          explain: R`$1 - 0{,}881 = 0{,}119$. A szigmoid sosem negatív (−0,881 lehetetlen), és nem páros függvény ($\sigma(-2) \ne \sigma(2)$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A $\hat p = \sigma(x - 2{,}7)$ modell szerint mennyi a 3 felkiáltójeles levél spam-valószínűsége? ($e^{-0{,}3} \approx 0{,}741$)`,
          options: ["0,574", "0,3", "0,426", "0,741"],
          answer: 0,
          hint: R`Előbb a logit: $z = x - 2{,}7$. Aztán $1/(1 + e^{-z})$.`,
          explain: R`$z = 0{,}3$, $\hat p = 1/(1 + 0{,}741) \approx 0{,}574$. A 0,3 a logit (nem valószínűség); a 0,426 a nem spam valószínűsége; a 0,741 az $e^{-z}$ részeredmény.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy logisztikus modellben a „linkek” súlya $w = 0{,}7$ ($e^{0{,}7} \approx 2{,}01$). Mit jelent ez?`,
          options: [
            "Minden további link kb. a kétszeresére növeli a spam esélyét.",
            "Minden további link 0,7-del növeli a spam valószínűségét.",
            "Minden további link kb. a kétszeresére növeli a spam valószínűségét.",
            "Minden további link 70%-kal növeli a spam valószínűségét."
          ],
          answer: 0,
          hint: "A súly a log-esélyhez adódik. Mit csinál ez az eséllyel – és mit a valószínűséggel?",
          explain: R`A log-esély 0,7-del nő, az esély $e^{0{,}7} \approx 2{,}01$-szeresére. A valószínűség változása attól függ, honnan indulunk (0,9-ről nem lehet „kétszeresére” nőni). Az esélyszorzót gyakran tévesen a valószínűség szorzójaként írják le – egy népszerű könyv (MLD) is.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $\hat p = \sigma(x - 2{,}7)$ modellnél 0,9-es küszöbbel hány felkiáltójeltől lesz spam a levél? ($\ln 9 \approx 2{,}197$)`,
          options: ["5-től", "3-tól", "2-től", "9-től"],
          answer: 0,
          hint: R`A küszöböt fordítsd log-esélyre: $z \ge \ln\frac{t}{1 - t}$.`,
          explain: R`$x - 2{,}7 \ge \ln 9 \approx 2{,}197$, azaz $x \ge 4{,}9$ → 5 felkiáltójeltől. A 3-tól a 0,5-ös küszöb; a 2-től lejjebb vinné a küszöböt; a 9 a $\ln$ nélkül behelyettesített esély.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy spamre ($y = 1$) a modell $\hat p = 0{,}1$-et mond. Mennyi a keresztentrópia-veszteség? ($\ln 0{,}1 \approx -2{,}303$, $\ln 0{,}9 \approx -0{,}105$)`,
          options: ["2,303", "0,105", "0,81", "0,9"],
          answer: 0,
          hint: "A helyes osztálynak adott valószínűség negatív logaritmusa.",
          explain: R`A helyes osztály a spam, neki 0,1 jutott: $-\ln 0{,}1 \approx 2{,}303$. A 0,105 a $-\ln 0{,}9$ (fordított osztállyal számolt); a 0,81 a négyzetes hiba $(1 - 0{,}1)^2$; a 0,9 sima különbség.`
        },
        {
          type: "multi",
          q: "Melyik igaz a logisztikus regresszió tanítására?",
          options: [
            R`A gradiens $\frac1n\sum(\hat p_i - y_i)\,x_{ij}$ alakú.`,
            "A keresztentrópia-veszteség a súlyokban konvex.",
            "Tökéletesen szétválasztható adaton regularizáció nélkül a súlyok a végtelenbe nőnének.",
            "Négyzetes hibával (MSE) jobb, mert az a regresszió vesztesége.",
            "Zárt képlettel, egy lépésben kiszámolható, mint a lineáris regresszió."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a gradiens alakjára, a veszteség „völgyére” és a szétválasztható postafiókra.",
          explain: "A gradiens „jóslat − címke” szorozva a jellemzővel, a keresztentrópia konvex. Szétválasztható adaton nincs véges minimum, ezért kell regularizáció. Szigmoid + MSE nem konvex, és nincs zárt képlet – iteratív optimalizálás kell."
        }
      ]
    },

    /* ------------------------------------------------ 5.4 */
    "ai5-54": {
      title: "Kvíz – 5.4 Többosztályos eset: softmax",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány bináris osztályozó kell 5 osztályhoz egy-az-egy ellen (OvO) stratégiával?",
          options: ["10", "5", "20", "25"],
          answer: 0,
          hint: R`Minden osztálypárhoz egy: $\binom{K}{2}$.`,
          explain: R`$\binom52 = \frac{5\cdot4}{2} = 10$. Az 5 az OvR; a 20 a sorrendet is számolja ($5\cdot4$); a 25 az $5^2$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a softmax kimenete a $\mathbf z = (0;\ \ln 2;\ \ln 3)$ logitokra?`,
          options: [
            R`$(1/6;\ 1/3;\ 1/2)$`,
            R`$(0;\ 0{,}39;\ 0{,}61)$`,
            R`$(1/3;\ 1/3;\ 1/3)$`,
            R`$(0;\ 0{,}693;\ 1{,}099)$`
          ],
          answer: 0,
          hint: R`$e^0 = 1$, $e^{\ln 2} = 2$, $e^{\ln 3} = 3$. Aztán normálj!`,
          explain: R`Az exponenciálisok $(1;\ 2;\ 3)$, összegük 6: $(1/6;\ 2/6;\ 3/6)$. A második válasz a logitokat normálja exponenciálás nélkül; az utolsó maguk a logitok.`
        },
        {
          type: "multi",
          q: "Melyik igaz a softmaxra?",
          options: [
            "A kimenetek pozitívak, és összegük 1.",
            "Ha minden logithoz 10-et adunk, a kimenet nem változik.",
            "Két osztálynál a logitok különbségének szigmoidját adja.",
            "Ha minden logitot kétszerezünk, a kimenet nem változik.",
            "A legnagyobb logitú osztály kapja a teljes, 1-es valószínűséget."
          ],
          answer: [0, 1, 2],
          hint: "Az eltolás és a nyújtás nem ugyanaz. Mi történik a különbségekkel?",
          explain: "Eltolásnál a különbségek nem változnak, ezért a kimenet sem. Kétszerezésnél a különbségek is kétszereződnek – a kimenet élesebb lesz. A „lágy maximum” mindenkinek ad valamennyit, nem csak a győztesnek."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 3 osztályos jóslat $(0{,}659;\ 0{,}242;\ 0{,}099)$, a helyes osztály a 2. Mennyi a kategoriális keresztentrópia? ($\ln 0{,}242 \approx -1{,}419$)`,
          options: ["1,419", "0,417", "0,758", "2,317"],
          answer: 0,
          hint: "Csak a helyes osztály valószínűsége számít.",
          explain: R`$-\ln 0{,}242 \approx 1{,}419$. A 0,417 a $-\ln 0{,}659$ (ha az 1. lenne a helyes), a 2,317 a 3. osztályé, a 0,758 az $1 - 0{,}242$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 10 osztályos modell vesztesége tanítás után is kb. 2,30. Mit jelent ez valószínűleg?",
          options: [
            "A modell semmit nem tanult: mindenre kb. egyenletes eloszlást mond.",
            "A modell 23%-os pontosságú.",
            "A modell tökéletes, a veszteség alsó korlátja ennyi.",
            "A modell túlillesztett."
          ],
          answer: 0,
          hint: R`Mennyi a veszteség, ha a modell minden osztálynak $1/10$-et ad?`,
          explain: R`Az egyenletes jóslat vesztesége $\ln 10 \approx 2{,}303$. Ha a tanítás után is ennyi, a modell nem tanult. A veszteség nem pontosság, és alsó korlátja 0 (tökéletes, magabiztos jóslat).`
        }
      ]
    },

    /* ------------------------------------------------ 5.5 */
    "ai5-55": {
      title: "Kvíz – 5.5 Naiv Bayes",
      questions: [
        {
          type: "single", shuffle: true,
          q: "1000 levélből 400 spam. Az „akció” szó 200 spamben és 60 jó levélben szerepel. Mennyi P(spam | akció)?",
          options: ["≈ 0,77", "0,5", "0,2", "0,4"],
          answer: 0,
          hint: "Az „akció”-s levelek közül hány a spam?",
          explain: R`Megszámolva: $200/(200 + 60) \approx 0{,}769$. A 0,5 a $P(\text{akció} \mid \text{spam}) = 200/400$ – a feltétel megfordítva; a 0,2 a $200/1000$; a 0,4 az a priori spamarány.`
        },
        {
          type: "single", shuffle: true,
          q: R`$P(\text{spam}) = 0{,}4$. $P(\text{ingyen} \mid \text{spam}) = 3/4$, $P(\text{ingyen} \mid \text{jó}) = 1/6$; $P(\text{kattints} \mid \text{spam}) = 3/4$, $P(\text{kattints} \mid \text{jó}) = 1/6$. A naiv Bayes szerint mennyi $P(\text{spam} \mid \text{ingyen, kattints})$?`,
          options: ["≈ 0,93", "0,75", "≈ 0,56", "0,225"],
          answer: 0,
          hint: "Szorozd össze osztályonként az a priori valószínűséget és a két szó gyakoriságát, aztán normálj!",
          explain: R`Spam: $0{,}4\cdot\frac34\cdot\frac34 = 0{,}225$; jó: $0{,}6\cdot\frac16\cdot\frac16 \approx 0{,}0167$; $\frac{0{,}225}{0{,}2417} \approx 0{,}931$. A 0,75 csak egy szót vesz figyelembe; a 0,225 a normálatlan számláló.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy szó 4 spamből 0-ban fordul elő. Mennyi a Laplace-simított $P(\text{szó} \mid \text{spam})$ ($\alpha = 1$; a szó vagy szerepel, vagy nem)?`,
          options: ["1/6", "0", "1/4", "1/5"],
          answer: 0,
          hint: R`$(n_{\text{szó},c} + \alpha)/(n_c + 2\alpha)$ – miért $2\alpha$ a nevezőben?`,
          explain: R`$(0 + 1)/(4 + 2) = 1/6$. A 0 a simítás nélküli érték; az 1/4 elfelejti a nevezőt növelni; az 1/5 csak 1-et ad a nevezőhöz, pedig két kimenet van (szerepel / nem szerepel).`
        },
        {
          type: "multi",
          q: "Melyik igaz a naiv Bayesre?",
          options: [
            "Feltételezi, hogy egy osztályon belül a jellemzők függetlenek.",
            "A tanítás lényegében számlálás.",
            "Szóindikátorokkal a log-esélye a szavak pontszámainak összege – lineáris modell.",
            "A valószínűségei mindig jól kalibráltak.",
            "Azért „naiv”, mert az a priori valószínűség nem az adatból jön."
          ],
          answer: [0, 1, 2],
          hint: "Mit feltételez a „naiv” szó? És mit okoz, ha ugyanaz a bizonyíték kétszer szerepel?",
          explain: "A függetlenségi feltevés miatt az összefüggő szavakat külön bizonyítéknak veszi – a valószínűségek túl magabiztosak, nem kalibráltak. A „naiv” a feltételes függetlenségre utal; az a priori tag is az adatból (az osztályarányból) jön."
        },
        {
          type: "single", shuffle: true,
          q: R`A priori tag: $-0{,}405$; szópontszámok: „nyertél” $+1{,}674$, „kattints” $+0{,}981$, „holnap” $-1{,}322$. Mennyi a „nyertél, kattints, holnap” levél log-esélye?`,
          options: ["0,928", "2,250", "3,572", "−0,053"],
          answer: 0,
          hint: "Add össze az a priori tagot és a levélben szereplő szavak pontszámait – a negatívat is!",
          explain: R`$-0{,}405 + 1{,}674 + 0{,}981 - 1{,}322 = 0{,}928$, így $\sigma(0{,}928) \approx 0{,}717$. A 2,250 kihagyja a „holnap”-ot; a 3,572 a „holnap” pontszámát pozitívnak veszi; a −0,053 kihagyja a „kattints”-ot.`
        }
      ]
    },

    /* ------------------------------------------------ 5.6 */
    "ai5-56": {
      title: "Kvíz – 5.6 Lineáris és nemlineáris döntési határ",
      questions: [
        {
          type: "multi",
          q: "Melyik logikai függvény választható szét lineárisan (egy egyenessel) a négy (0/1; 0/1) bemeneten?",
          options: ["ÉS", "VAGY", "XOR (kizáró vagy)", "NEM-ÉS (NAND)", "XNOR (egyenlőség)"],
          answer: [0, 1, 3],
          hint: "Rajzold fel a négy pontot! Melyiknél vannak az 1-esek egy átlón?",
          explain: "Az ÉS ($x_1 + x_2 \\ge 1{,}5$), a VAGY ($\\ge 0{,}5$) és a NAND ($\\le 1{,}5$) egy egyenessel elválasztható. A XOR és a tagadása (XNOR) nem: az azonos osztályú pontok átlósan állnak."
        },
        {
          type: "match",
          q: "Párosítsd a módszert a döntési határa alakjával!",
          pairs: [
            ["legközelebbi centroid (2 osztály)", "a centroidok felező merőlegese"],
            ["logisztikus regresszió (nyers jellemzők)", "a w·x + b = 0 hipersík (egyenes)"],
            ["kNN", "tetszőleges, törött vonalakból álló"],
            [R`logisztikus regresszió $x_1^2 + x_2^2$ jellemzővel`, "kör (az eredeti síkon)"]
          ],
          hint: "Melyik számol átlagot, melyik szavaztat, és mit csinál egy új jellemző a határral?",
          explain: "A centroid és a nyers logisztikus regresszió lineáris; a kNN határa a szomszédoktól függ, bármilyen alakú lehet; az $r^2$ jellemzővel a határ az új térben sík, az eredeti síkon kör."
        },
        {
          type: "single", shuffle: true,
          q: R`$\pm1$ kódolású XOR: $(-1,-1)$ és $(1,1)$ „nem ég”, $(1,-1)$ és $(-1,1)$ „ég”. Melyik új jellemző választja el egyetlen küszöbbel?`,
          options: [R`$x_1x_2$`, R`$x_1 + x_2$`, R`$x_1^2 + x_2^2$`, R`$x_1 - x_2$`],
          answer: 0,
          hint: "Számold ki mind a négy pontra!",
          explain: R`$x_1x_2$: „nem ég” → +1, „ég” → −1 – szétválik. Az $x_1 + x_2$ az „ég” pontokra 0, 0, a többire −2, 2 (egy küszöb kevés); az $x_1^2 + x_2^2$ mindenhol 2; az $x_1 - x_2$ az „ég” pontokra 2 és −2.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány legfeljebb másodfokú tag ($x_j$, $x_j^2$, $x_jx_k$) képezhető 10 jellemzőből?`,
          options: ["65", "20", "55", "100"],
          answer: 0,
          hint: R`10 elsőfokú, 10 négyzetes és $\binom{10}{2}$ vegyes tag.`,
          explain: R`$10 + 10 + 45 = 65$ (képlettel $\frac{d(d + 3)}{2}$). A 20 kihagyja a vegyes tagokat; az 55 az elsőfokúakat; a 100 a $10^2$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy logisztikus regresszió a validáción 71%-os, egy 5-NN 93%-os. Mit érdemes először kipróbálni?",
          options: [
            "Kölcsönhatás- vagy polinomiális jellemzőket a logisztikus regresszióhoz (regularizálva), vagy egy nemlineáris modellt.",
            "Nagyobb tanulási rátát a logisztikus regresszióhoz.",
            "A kNN k-ját 1-re csökkenteni, hogy még jobb legyen.",
            "Elhagyni a validációt, és a tanító adaton összehasonlítani."
          ],
          answer: 0,
          hint: "Mit árul el a nagy különbség a határ alakjáról?",
          explain: "A kNN fölénye arra utal, hogy a határ nemlineáris – a lineáris modellnek új jellemzők kellenek. A tanulási ráta nem változtat a határ alakján; az 1-NN valószínűleg túlillesztene; a tanító adaton való összehasonlítás félrevezet."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai5-final": {
      title: "Fejezetzáró teszt – 5. Osztályozás",
      questions: [
        {
          type: "match",
          q: "Párosítsd a módszert az alapötletével!",
          pairs: [
            ["kNN", "a hasonló esetek szavaznak"],
            ["legközelebbi centroid", "osztályonként egy tipikus (átlagos) pont"],
            ["logisztikus regresszió", "optimalizált lineáris határ, valószínűséggel"],
            ["naiv Bayes", "a bizonyítékok (szavak) összeszámolása a Bayes-tétellel"]
          ],
          hint: "Melyik jegyez meg mindent, melyik csak átlagot, melyik optimalizál, melyik számlál?",
          explain: "A kNN a tanító mintákat tárolja és szavaztat; a centroid osztályonként egy átlagot; a logisztikus regresszió keresztentrópiával optimalizálja a súlyokat; a naiv Bayes gyakoriságokból számol."
        },
        {
          type: "single", shuffle: true,
          q: "Egy kNN-modell a tanító adaton 100%-os, a validáción 74%-os. Melyik k-val tanították valószínűleg?",
          options: ["k = 1", "k = n (az összes minta)", "k = 15", "Nem lehet megmondani, a k nem befolyásolja a tanítóhibát."],
          answer: 0,
          hint: "Mikor garantált a 100% a tanító adaton?",
          explain: "Az 1-NN-nél minden tanító pont saját maga szomszédja, ezért 100%-os – és ez a túlillesztés jele, ha a validáció sokkal rosszabb. A k = n a többségi osztályt mondaná; nagyobb k-nál a tanítóhiba általában nem nulla."
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi az esély, ha $p = 0{,}8$, és mennyi a log-esély? ($\ln 4 \approx 1{,}386$)`,
          options: ["esély 4, log-esély ≈ 1,386", "esély 0,8, log-esély ≈ −0,223", "esély 0,25, log-esély ≈ −1,386", "esély 1,25, log-esély ≈ 0,223"],
          answer: 0,
          hint: R`Esély = $p/(1 - p)$.`,
          explain: R`$0{,}8/0{,}2 = 4$, $\ln 4 \approx 1{,}386$. A 0,25 a fordított esély (a „nem” esélye); a 0,8 maga a valószínűség; az 1,25 az $1/0{,}8$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy modell: $z = 0{,}5\,x_1 + x_2 - 3$. Mit mond az $\mathbf x = (2;\ 1)$ pontra 0,5-ös küszöbbel?`,
          options: [
            R`negatív osztály, mert $z = -1 \lt 0$`,
            R`pozitív osztály, mert $z = -1$ és $\sigma(-1) \gt 0$`,
            R`pozitív osztály, mert $z = 1 \gt 0$`,
            "nem dönthető el a küszöb ismerete nélkül"
          ],
          answer: 0,
          hint: R`0,5-ös küszöb ⇔ $z \ge 0$.`,
          explain: R`$z = 1 + 1 - 3 = -1$, $\sigma(-1) \approx 0{,}27 \lt 0{,}5$ → negatív. A szigmoid mindig pozitív, ezért a „$\gt 0$” nem döntési szabály; a harmadik válasz a $-3$-at elfelejti.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy rákszűrő modellnél az elmulasztott daganat sokkal drágább, mint egy felesleges kontroll. Merre mozdítod a 0,5-ös küszöböt?",
          options: ["lefelé (pl. 0,1-re)", "felfelé (pl. 0,9-re)", "maradjon 0,5", "a küszöb nem befolyásolja a hibák fajtáját"],
          answer: 0,
          hint: "Melyik hibát akarod ritkábbá tenni: az elmulasztott pozitívat vagy a téves riasztást?",
          explain: "Alacsonyabb küszöbbel több beteget jelölünk pozitívnak: kevesebb elmulasztott daganat, több felesleges kontroll. A magas küszöb a spamszűrőnél jó, ahol a téves riasztás a drága."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy nem spamre ($y = 0$) a modell $\hat p = 0{,}8$-at mond. Mennyi a veszteség? ($\ln 0{,}2 \approx -1{,}609$, $\ln 0{,}8 \approx -0{,}223$)`,
          options: ["1,609", "0,223", "0,64", "0,8"],
          answer: 0,
          hint: R`$y = 0$ esetén a helyes osztály valószínűsége $1 - \hat p$.`,
          explain: R`$-\ln(1 - 0{,}8) = -\ln 0{,}2 \approx 1{,}609$. A 0,223 a $-\ln 0{,}8$ – mintha spam lenne; a 0,64 a négyzetes hiba; a 0,8 maga a jóslat.`
        },
        {
          type: "multi",
          q: "Melyik igaz a softmaxra és a többosztályos logisztikus regresszióra?",
          options: [
            "Osztályonként egy lineáris pontszám (logit), ezekből softmax.",
            "Két osztálynál ugyanaz, mint a bináris logisztikus regresszió.",
            R`A veszteség $-\ln\hat p_{\text{helyes}}$, a gradiens a logitokra $\hat{\mathbf p} - \mathbf y$.`,
            "Az OvR pontszámai mindig 1-re összegződnek, ezért a softmax felesleges.",
            "A softmax előtt a logitokat 0 és 1 közé kell vágni."
          ],
          answer: [0, 1, 2],
          hint: "Melyik állítás keveri össze a logitot a valószínűséggel?",
          explain: "Az OvR pontszámai függetlenek, nem adnak össze 1-et – ezért kell a softmax. A logitok bármilyen valós számok lehetnek; épp a softmax csinál belőlük valószínűséget."
        },
        {
          type: "single", shuffle: true,
          q: "100 levél, 40 spam. A „pénz” szó 10 spamben és 0 jó levélben fordul elő. Mennyi a Laplace-simított P(pénz | jó)?",
          options: ["1/62", "0", "1/60", "11/42"],
          answer: 0,
          hint: R`A jó levelek száma 60. Simítás: $(n + 1)/(n_c + 2)$.`,
          explain: R`$(0 + 1)/(60 + 2) = 1/62$. A 0 a simítás nélküli érték; az 1/60 nem növeli a nevezőt; a 11/42 a spamekre vonatkozó simított érték ($P(\text{pénz} \mid \text{spam})$).`
        },
        {
          type: "multi",
          q: "Melyik módszer tudja a XOR-t (a négy pontot) hibátlanul osztályozni?",
          options: [
            "1-NN",
            R`logisztikus regresszió $(x_1, x_2, x_1x_2)$ jellemzőkkel`,
            "logisztikus regresszió a nyers $(x_1, x_2)$ jellemzőkkel",
            "legközelebbi centroid",
            "naiv Bayes 0/1 jellemzőkkel"
          ],
          answer: [0, 1],
          hint: "Melyik módszer határa egyenes, és melyiknél van új jellemző vagy helyi döntés?",
          explain: "A nyers logisztikus regresszió, a centroid (a két centroid ráadásul egybeesik) és a 0/1-es naiv Bayes is lineáris határt húz – a XOR-ra ez nem elég. Az 1-NN helyi döntést hoz, az $x_1x_2$ jellemzővel pedig a XOR lineárisan szétválaszthatóvá válik."
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a legjobb választással!",
          pairs: [
            ["300 rövid vásárlói vélemény, pozitív/negatív", "naiv Bayes szózsákkal"],
            ["a bank tudni akarja, melyik jellemző mennyit számít", "logisztikus regresszió (esélyszorzók)"],
            ["10 ms alatt kell dönteni, 100 000 tanító mintával", "legközelebbi centroid"],
            ["a lineáris modell gyenge, a kNN sokkal jobb", "kölcsönhatás-jellemzők vagy nemlineáris modell"]
          ],
          hint: "Kevés szöveges adat, értelmezhetőség, gyors jóslás, nemlineáris határ.",
          explain: "A naiv Bayes kevés szöveges adatból is jól tanul; a logisztikus regresszió súlyai esélyszorzóként értelmezhetők; a centroid jóslása osztályonként egy távolság; a kNN fölénye nemlineáris határra utal."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
