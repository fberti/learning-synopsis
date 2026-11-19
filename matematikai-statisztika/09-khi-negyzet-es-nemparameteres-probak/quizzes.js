/* =========================================================
   Matematikai statisztika 9. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 9.1 */
    "ms9-91": {
      title: "Kvíz – 9.1 Illeszkedésvizsgálat",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy pörgettyűnek négy egyforma szektora van. 80 pörgetésből a gyakoriságok: 26, 14, 18, 22. Mennyi a $\chi^2$ (szabályos pörgettyű a $H_0$)?`,
          options: [R`$\chi^2 = 4$`, R`$\chi^2 \approx 4{,}36$`, R`$\chi^2 = 5$`, R`$\chi^2 = 80$`],
          answer: 0,
          hint: R`Mennyi a várt gyakoriság $H_0$ mellett egy szektorban? És mi áll a képlet nevezőjében?`,
          explain: R`Várt: $80/4 = 20$ minden szektorra. Az eltérések $6, -6, -2, 2$, így $\chi^2 = (36 + 36 + 4 + 4)/20 = 80/20 = 4$. A $4{,}36$ akkor jön ki, ha a <em>tényleges</em> gyakoriságokkal osztasz ($36/26 + 36/14 + 4/18 + 4/22$) – a nevezőben a várt gyakoriság áll. Az 5 a százalékokkal (32,5%, 17,5%, …) számolt érték: a $\chi^2$ a mintanagysággal arányos, ezért darabszámokkal kell számolni. A 80 a négyzetes eltérések összege osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy teljesen megadott $H_0$-val végzett illeszkedésvizsgálatban 4 kategória van, és $\chi^2 = 8{,}5$ jött ki. Ismert: $P(\chi^2_3 \ge 8{,}5) \approx 0{,}037$. Mi a helyes döntés 5%-on?`,
          options: [
            R`$df = 3$, $8{,}5 \ge 7{,}81$ → elvetjük $H_0$-t ($p \approx 0{,}037$).`,
            R`$df = 4$, $8{,}5 \lt 9{,}49$ → nem vetjük el $H_0$-t.`,
            R`Nem vetjük el, mert a p-értéket duplázni kell: $2 \cdot 0{,}037 \approx 0{,}074$.`,
            R`$df = 3$, de csak akkor vetjük el, ha $\chi^2$ legalább a szabadságfok háromszorosa.`
          ],
          answer: 0,
          hint: R`Hány gyakoriság „szabad”, ha az összegük kötött? És melyik farok adja a χ²-próba p-értékét?`,
          explain: R`A négy gyakoriság összege $n$, így csak három szabad: $df = k - 1 = 3$, a kritikus érték 7,81, és $8{,}5 \ge 7{,}81$ → elvetjük. A $df = k = 4$ a leggyakoribb hiba – itt épp megfordítaná a döntést. A p-érték a <b>felső</b> farok, mert minden eltérés (bármelyik irányba) növeli a $\chi^2$-et; duplázni nem kell és nem szabad. A „háromszoros” szabály kitalált: a döntést a kritikus érték vagy a p-érték adja.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gyártó szerint a cukorkák 50%-a piros, 30%-a sárga, 20%-a zöld. 200 cukorkából 90 piros, 70 sárga, 40 zöld. Mennyi a $\chi^2$?`,
          options: [R`$\chi^2 \approx 2{,}67$`, R`$\chi^2 = 19{,}0$`, R`$\chi^2 \approx 2{,}54$`, R`$\chi^2 \approx 1{,}33$`],
          answer: 0,
          hint: R`A várt gyakoriságokat a gyártó arányai adják, nem az egyenletes elosztás: $np_i$ = ?`,
          explain: R`Várt: $200 \cdot 0{,}5 = 100$, $60$, $40$. $\chi^2 = 100/100 + 100/60 + 0/40 = 1 + 1{,}67 \approx 2{,}67$ ($df = 2$, nem vetjük el). A 19,0 az egyenletes elosztással ($66{,}7$ mindenhol) jön ki – csak akkor jó, ha $H_0$ egyforma valószínűségeket mond (az esküdtes példa tanulsága, <a class="xref" href="#s91-a">9.1-a</a>). A 2,54 a tényleges gyakoriságokkal oszt. Az 1,33 a százalékokkal (45, 35, 20 vs. 50, 30, 20) számolt érték – a 200-as minta helyett mintha csak 100 elem lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Poisson-eloszlást illesztesz egy darabszámra: a kategóriák 0, 1, 2, 3, 4, 5, „6 vagy több” (7 kategória), a $\lambda$-t a mintaátlagból becsülöd. Az utolsó három kategória várt gyakorisága 5 alatt van, ezért ezeket összevonod. Hány szabadságfokkal számolsz?`,
          options: ["3", "4", "5", "6"],
          answer: 0,
          hint: R`Két dolgot kell figyelembe venni: hány kategória marad az összevonás <em>után</em>, és hány paramétert becsültél a mintából.`,
          explain: R`Az összevonás után $k = 5$ kategória marad (0, 1, 2, 3, „4 vagy több”), egy paramétert becsültél ($m = 1$): $df = k - 1 - m = 5 - 1 - 1 = 3$ (<a class="xref" href="#s91-c">9.1-c</a>). A 4 elfelejti a becsült $\lambda$-t (a próba így túl engedékeny lesz). Az 5 az összevonás <em>előtti</em> $k = 7$-tel számol: $7 - 1 - 1$. A 6 mindkét hibát elköveti: $7 - 1$.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak az illeszkedésvizsgálat χ²-próbájára? (Több jó válasz is lehet.)`,
          options: [
            "Az 5-ös szabály a várt gyakoriságokra vonatkozik: mindegyik legyen legalább 5.",
            "A p-érték a χ²-eloszlás felső farka; nem kell duplázni.",
            R`Két kategóriánál a $\chi^2$ pontosan az arány $z$-próbájának négyzete.`,
            "Ha valamelyik kategória tényleges gyakorisága 5 alatt van, a próba nem végezhető el.",
            R`Ha $H_0$-t nem vetjük el, bizonyítottuk, hogy az adat a feltételezett eloszlást követi.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj az érmére (60 fej 100-ból), és arra, hogy mit mond a próba, ha nem talál eltérést.",
          explain: R`Az 5-ös szabály a <b>várt</b> gyakoriságokra szól – egy cellában lehet 0 is, ha ott 8-at vártunk; ezért hamis a „tényleges gyakoriság” változat. A p-érték a felső farok, mert minden eltérés növeli a $\chi^2$-et. Két kategóriánál $\chi^2 = z^2$ (az érménél $4 = 2^2$, és $3{,}84 = 1{,}96^2$). A „nem vetjük el” csak annyit jelent, hogy az adat összeegyeztethető a modellel – kis mintán sok más modellel is az lenne.`
        },
        {
          type: "match",
          q: R`Párosítsd a helyzeteket a χ²-próba szabadságfokával! (Ahol nincs külön jelezve, nincs összevonás.)`,
          pairs: [
            ["Szabályos-e a kocka? (6 lap)", "5"],
            ["Szabályos-e az érme?", "1"],
            [R`Poisson-illesztés, összevonás után 5 kategória, $\lambda$ a mintából`, "3"],
            [R`Normalitásvizsgálat 10 osztállyal, $\mu$ és $\sigma$ a mintából`, "7"],
            [R`Normalitásvizsgálat 10 osztállyal, $\mu$ és $\sigma$ előre adott`, "9"]
          ],
          hint: R`Mindegyikre: $df = k - 1 - m$. Mennyi az $m$, ha a paramétert nem a mintából veszed?`,
          explain: R`Kocka: $6 - 1 = 5$; érme: $2 - 1 = 1$; Poisson: $5 - 1 - 1 = 3$; normális becsült $\mu$-vel és $\sigma$-val: $10 - 1 - 2 = 7$; ugyanez előre adott paraméterekkel (tiszta illeszkedésvizsgálat): $10 - 1 = 9$. A tipikus hiba, hogy a becsült paramétereket nem vonod le – ekkor a $\chi^2$-et túl nagy szabadságfokú eloszlással veted össze, és túl ritkán vetsz el.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 60 dobásos kocka (8, 9, 12, 11, 6, 14; $\chi^2 = 4{,}2$) minden gyakoriságát megháromszorozzuk ($n = 180$). Mennyi a $\chi^2$, és mi a döntés 5%-on?`,
          options: [
            R`$\chi^2 = 12{,}6$; $12{,}6 \ge 11{,}07$ → elvetjük.`,
            R`$\chi^2 = 4{,}2$, mert az arányok nem változtak → nem vetjük el.`,
            R`$\chi^2 = 37{,}8$ → elvetjük.`,
            R`$\chi^2 = 1{,}4$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Ha minden gyakoriság háromszoros, hányszoros lesz a várt gyakoriság, az eltérés és az eltérés négyzete?`,
          explain: R`A várt gyakoriság 30, az eltérések háromszorosak, négyzetük kilencszeres, a nevező háromszoros: minden hozzájárulás háromszoros, $\chi^2 = 3 \cdot 4{,}2 = 12{,}6$. $df = 5$, $12{,}6 \ge 11{,}07$ → elvetjük ($p \approx 0{,}027$). A $\chi^2$ tehát a mintanagysággal arányos – ugyanazok az arányok nagy mintán már meglepőek; ezért hibás a „4,2” válasz. A 37,8 elfelejti, hogy a nevező (a várt gyakoriság) is nő. Az 1,4 fordítva osztott.`
        },
        {
          type: "single", shuffle: true,
          q: R`Bortkiewicz lovainál a Poisson-illesztés $p \approx 0{,}80$-at adott. Mi a helyes megfogalmazás?`,
          options: [
            "Az adatok összeegyeztethetők a Poisson-modellel; a modellt nem vetjük el.",
            "Bebizonyítottuk, hogy a halálesetek száma Poisson-eloszlású.",
            "80% a valószínűsége annak, hogy az adat Poisson-eloszlású.",
            "Az illeszkedés rossz, mert jó illeszkedéshez kicsi p-érték kell."
          ],
          answer: 0,
          hint: R`Mit mér a p-érték: $H_0$ valószínűségét, vagy azt, mennyire meglepő az adat, ha $H_0$ igaz?`,
          explain: R`A nagy p-érték azt jelenti, hogy ha a modell igaz, ekkora (vagy nagyobb) $\chi^2$ gyakran előfordulna – az adat nem mond ellent a modellnek. Ez nem bizonyítás: más modellek is összeegyeztethetők lehetnek az adattal (<a class="xref" href="#s91-c">9.1-c</a>, buktatók). A p-érték nem $H_0$ valószínűsége. Illeszkedésvizsgálatnál a <em>kicsi</em> p jelzi a rossz illeszkedést (elvetjük a modellt), nem a jót.`
        }
      ]
    },

    /* ------------------------------------------------ 9.2 */
    "ms9-92": {
      title: "Kvíz – 9.2 Homogenitásvizsgálat",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A/B-teszt: az A változatnál 100 látogatóból 10, a B-nél 100-ból 25 vásárolt. Mennyi a várt gyakoriság az „A, vásárolt” cellában, ha $H_0$ (a két változat egyforma) igaz?`,
          options: ["17,5", "10", "50", "35"],
          answer: 0,
          hint: R`$H_0$ mellett a közös vásárlási arányt az összevont mintából becsüljük. Mennyi ez, és hány látogató van az A sorban?`,
          explain: R`Az összevont arány $35/200 = 0{,}175$, így $f^*_{11} = 100 \cdot 0{,}175 = 17{,}5$ (általában $n_i \cdot f_{\cdot j}/N$). A 10 a <em>tényleges</em> gyakoriság. Az 50 a sor egyenletes elosztása a két oszlop között – csak akkor lenne jó, ha 50%-os vásárlási arányt várnánk. A 35 az oszlopösszeg, a sor arányával ($100/200$) még szorozni kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanitt (10/100 vs. 25/100) $\chi^2 \approx 7{,}79$. Melyik a helyes szabadságfok és döntés 5%-on?`,
          options: [
            R`$df = 1$, $7{,}79 \ge 3{,}84$ → elvetjük, a két változat eltér.`,
            R`$df = 3$ ($bc - 1$), $7{,}79 \lt 7{,}81$ → nem vetjük el.`,
            R`$df = 2$ ($b + c - 2$), $7{,}79 \ge 5{,}99$ → elvetjük.`,
            R`$df = 1$, de a χ²-próba p-értékét duplázni kell, ezért csak 1%-on döntünk.`
          ],
          answer: 0,
          hint: R`A homogenitásvizsgálat szabadságfoka $(b-1)(c-1)$. Miért nem $bc - 1$, mint az illeszkedésnél?`,
          explain: R`2×2-es táblán $df = (2-1)(2-1) = 1$, a kritikus érték 3,84 → elvetjük ($p \approx 0{,}005$). Ugyanez a két arány $z$-próbája: $z \approx 2{,}79$, $z^2 \approx 7{,}79$. Az $bc - 1 = 3$ az illeszkedésvizsgálat szabálya lenne – de itt a közös eloszlást is a mintából becsültük, ezért levonjuk a $c - 1$ becsült valószínűséget (<a class="xref" href="#s92-a">9.2-a</a>). Az $b + c - 2$ hibás képlet (itt véletlenül ugyanazt a döntést adja, de rossz szabadságfokkal). Duplázni nem kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`4 iskola tanulóit sorolod 3 kategóriába (gyenge, közepes, jó), iskolánként külön mintával. Hány szabadságfokú a homogenitásvizsgálat?`,
          options: ["6", "11", "5", "12"],
          answer: 0,
          hint: R`Minden mintában hány gyakoriság szabad, és hány közös valószínűséget becsültél?`,
          explain: R`$(4-1)(3-1) = 6$. Iskolánként $3 - 1 = 2$ szabad gyakoriság ($4 \cdot 2 = 8$), ebből a közös eloszlás 2 becsült valószínűségét levonjuk: $8 - 2 = 6$. A 11 a $bc - 1$ (illeszkedésvizsgálat szabálya), az 5 a $b + c - 2$ (összeadás szorzás helyett), a 12 egyszerűen a cellák száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két 50 fős csoport válaszai három lehetőségre: 30, 15, 5 és 20, 20, 10. Mennyi a $\chi^2$, és mi a döntés 5%-on?`,
          options: [
            R`$\chi^2 \approx 4{,}38$, $df = 2$, $4{,}38 \lt 5{,}99$ → nem vetjük el.`,
            R`$\chi^2 \approx 8{,}76$, $df = 2$ → elvetjük.`,
            R`$\chi^2 \approx 2{,}19$, $df = 2$ → nem vetjük el.`,
            R`$\chi^2 \approx 4{,}38$, $df = 5$, $4{,}38 \lt 11{,}07$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Az oszlopösszegek 50, 35, 15, $N = 100$. Mennyi a várt gyakoriság egy 50-es sorban? Hány sor hozzájárulását kell összeadni?`,
          explain: R`Várt: $50 \cdot 0{,}50 = 25$; $17{,}5$; $7{,}5$ mindkét sorban. Egy sor hozzájárulása $25/25 + 6{,}25/17{,}5 + 6{,}25/7{,}5 \approx 1 + 0{,}357 + 0{,}833 = 2{,}19$; két egyforma méretű sornál a két sor ugyanannyit ad: $\chi^2 \approx 4{,}38$, $df = (2-1)(3-1) = 2$, $p \approx 0{,}11$. A 8,76 a <b>százalékokkal</b> (60, 30, 10 és 40, 40, 20) számolt érték: mintha 100–100 főt kérdeztél volna – hamisan szignifikáns. A 2,19 csak az egyik sort adja össze. A $df = 5$ a $bc - 1$ hiba (itt a döntést nem változtatja, de a szabadságfok rossz).`
        },
        {
          type: "single", shuffle: true,
          q: R`Három üzem elégedettségi arányait hasonlítod össze χ²-próbával, és $H_0$-t elvetetted. Mit mond ez az eredmény?`,
          options: [
            "Valahol eltérés van; hogy melyik üzemnél, azt a cellánkénti hozzájárulások (standardizált eltérések) mutatják.",
            "Mindhárom üzem elégedettségi aránya különbözik egymástól.",
            "Az első üzem eltér a másik kettőtől, mert a táblában ő áll elöl.",
            "A legnagyobb és a legkisebb arányú üzem különbsége szignifikáns, a többi pár nem."
          ],
          answer: 0,
          hint: R`A χ²-próba egyetlen kérdésre válaszol: azonos-e mindhárom eloszlás. Mi a $H_0$ tagadása?`,
          explain: R`$H_0$: mindhárom üzemben ugyanaz az arány. Ennek tagadása: <em>legalább egy</em> eltér – nem az, hogy mind különbözik. Hogy hol van az eltérés, azt a hozzájárulások mutatják (a szakasz három üzemes példájában: az 1. „túl elégedett”, a 3. „túl elégedetlen”, a 2. pont az átlag; részletesen <a class="xref" href="#s93-c">9.3-c</a>). Páronkénti állítást a próba nem tesz; páronkénti próbák sora pedig többszörös tesztelés lenne.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak a homogenitásvizsgálatra? (Több jó válasz is lehet.)`,
          options: [
            R`Két minta és két kategória esetén a χ²-próba ugyanaz, mint a két arány kétoldali $z$-próbája ($\chi^2 = z^2$).`,
            R`Ha előre az a kérdés, hogy B <em>jobb-e</em>, a $z$-próba egyoldali változata kell, nem a χ²-próba.`,
            "Ha ugyanazt a 100 embert kérdezed meg előtte és utána, az páros adat – a χ²-homogenitásvizsgálat nem jó rá.",
            "Ha a mintákat százalékra váltod, a χ² értéke nem változik, csak könnyebb számolni.",
            R`Három csoportnál a három páronkénti $z$-próba pontosabb, mint egyetlen χ²-próba.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a χ² és a mintanagyság kapcsolatára, a χ²-próba „irányára”, és arra, mit feltételez a próba a mintákról.",
          explain: R`Két mintánál $\chi^2 = z^2$ – az A/B-tesztnél $4{,}20 \approx 2{,}05^2$. A χ²-próba mindig kétoldali (bármilyen eltérés növeli), ezért irányos kérdéshez a $z$-próba egyoldali változata kell. Az előtte–utána adat nem független minta. Százalékra váltva a χ² a mintamérettől függetlenné válik – hamis lesz. Három páronkénti próba többszörös tesztelés; a χ²-próba egyetlen próbával dönt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két mintánál (két kategória) az egyik minta 50, a másik 200 elemű. Melyik sor hozzájárulása nagyobb a $\chi^2$-hez?`,
          options: [
            "Az 50 eleműé – a két sorban az eltérések ugyanakkorák, de ott kisebbek a várt gyakoriságok.",
            "A 200 eleműé, mert ott nagyobbak a gyakoriságok, így az eltérés négyzete is nagyobb.",
            "A két sor mindig ugyanannyit ad, mert az eltérések ellentettek.",
            "Attól függ, melyik sort írjuk előre a táblában."
          ],
          answer: 0,
          hint: R`Két sornál egy oszlopon belül $f_{1j} - f^*_{1j} = -(f_{2j} - f^*_{2j})$, mert az oszlopösszeg kötött. Mi különbözik akkor a két sor tagjaiban?`,
          explain: R`Az eltérések abszolút értéke soronként azonos, a nevezőben viszont $f^*_{ij} = n_i \cdot f_{\cdot j}/N$ áll – a kisebb mintánál kisebb, így a hozzájárulás nagyobb. Például 10 | 40 és 60 | 140 esetén a sorok hozzájárulása kb. 1,59 és 0,40. Egyforma hozzájárulás csak egyforma mintaméretnél van (a két gépes példában). A sorok sorrendje a $\chi^2$-et nem befolyásolja.`
        }
      ]
    },

    /* ------------------------------------------------ 9.3 */
    "ms9-93": {
      title: "Kvíz – 9.3 Függetlenségvizsgálat",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 120 fős mintából készült kontingencia-táblában egy cella sorösszege 40, oszlopösszege 30. Mennyi a cella várt gyakorisága a függetlenség esetén?`,
          options: ["10", "20", "13,33", "1200"],
          answer: 0,
          hint: R`$f^*_{ij} = f_{i\cdot}\,f_{\cdot j}/N$ – a két peremvalószínűség szorzata, $N$-nel szorozva.`,
          explain: R`$f^* = 40 \cdot 30/120 = 10$. A 20 az $N$ egyenletes elosztása a 6 cella között – a várt gyakoriság nem egyenletes, a peremektől függ. A 13,33 a sorösszeget osztja szét egyenletesen 3 oszlopra, figyelmen kívül hagyva az oszlopösszeget. Az 1200 a szorzat $N$-nel való osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 3×4-es kontingencia-táblán végzel függetlenségvizsgálatot. Hány szabadságfokú a próba?`,
          options: ["6", "11", "5", "12"],
          answer: 0,
          hint: R`$bc$ cella, összegük $N$. Hány peremvalószínűséget becsültél a mintából?`,
          explain: R`$df = (b-1)(c-1) = 2 \cdot 3 = 6$. Levezetve: $bc - 1 = 11$ szabad cella, ebből $(b-1) + (c-1) = 5$ becsült peremvalószínűség: $11 - 5 = 6$. A 11 a becsült peremek levonását felejti el; az 5 a $b + c - 2$ – épp a levonandó rész; a 12 a cellák száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 300 fős minta 3×4-es tábláján $\chi^2 = 12$. Mennyi a Cramér-féle $V$?`,
          options: [R`$V \approx 0{,}14$`, R`$V = 0{,}2$`, R`$V = 0{,}02$`, R`$V \approx 0{,}115$`],
          answer: 0,
          hint: R`$V = \sqrt{\chi^2/(N \min\{b-1, c-1\})}$. Mennyi itt a minimum?`,
          explain: R`$\min\{2, 3\} = 2$, így $V = \sqrt{12/(300 \cdot 2)} = \sqrt{0{,}02} \approx 0{,}14$ – gyenge kapcsolat. A 0,2 a $\min$ szorzót hagyja ki ($\sqrt{12/300}$), a 0,02 a gyökvonást, a 0,115 a $\max\{b-1, c-1\} = 3$-mal oszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cellában a tényleges gyakoriság 45, a várt 25. Mennyi a standardizált eltérés ($r_{ij}$)?`,
          options: [R`$r = 4$`, R`$r = 0{,}8$`, R`$r = 16$`, R`$r \approx 2{,}98$`],
          answer: 0,
          hint: R`$r_{ij} = (f_{ij} - f^*_{ij})/\sqrt{f^*_{ij}}$ – gyök a nevezőben, és melyik gyakoriság gyöke?`,
          explain: R`$r = (45 - 25)/\sqrt{25} = 20/5 = 4$ – erősen felülreprezentált cella ($|r| \gt 2$). A 0,8 gyökvonás nélkül oszt ($20/25$). A 16 a cella hozzájárulása ($r^2$), nem az eltérés. A 2,98 a tényleges gyakoriság gyökével oszt ($20/\sqrt{45}$) – a nevezőben a várt gyakoriság áll.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két 2×2-es tábla: A) $N = 100$, $\chi^2 = 6$, $p \approx 0{,}014$; B) $N = 10\,000$, $\chi^2 = 60$, $p \lt 0{,}001$. Melyikben erősebb a kapcsolat?`,
          options: [
            R`Az A-ban: $V \approx 0{,}24$, szemben a B $V \approx 0{,}08$-ával.`,
            "A B-ben, mert sokkal kisebb a p-értéke.",
            "Egyformán erős, mert mindkettő szignifikáns 5%-on.",
            R`A B-ben, mert tízszer akkora a $\chi^2$.`
          ],
          answer: 0,
          hint: R`A p-érték és a $\chi^2$ a mintanagysággal együtt nő. Mi az a mérőszám, amely a mintanagyságtól nem függ?`,
          explain: R`2×2-es táblán $V = \sqrt{\chi^2/N}$: A) $\sqrt{6/100} \approx 0{,}24$, B) $\sqrt{60/10\,000} \approx 0{,}08$. A B tábla kapcsolata <em>gyengébb</em>, csak a hatalmas minta miatt nagyon biztos. A p-érték a bizonyíték erősségét méri, nem a kapcsolatét (a dohányzás-tábla: ugyanaz a $V = 0{,}115$ 200 főn $p = 0{,}10$, 2000 főn $p \lt 0{,}001$). A $\chi^2$ is a mintanagysággal arányos, ezért önmagában nem hatásnagyság.`
        },
        {
          type: "multi",
          q: R`A 200 fős dohányzás × nem táblán $\chi^2 = 2{,}67$, $p \approx 0{,}10$. Mely állítások igazak? (Több jó válasz is lehet.)`,
          options: [
            "5%-on nem vetjük el a függetlenséget, de nem is bizonyítottuk.",
            R`Ugyanezekkel a sorszázalékokkal kétszer akkora mintán a $\chi^2$ is kétszeres ($5{,}33$) lenne.`,
            R`Yates-korrekcióval a $\chi^2$ kisebb lesz ($2{,}16$), a p-érték nagyobb.`,
            "A nem és a dohányzás a sokaságban bizonyítottan független.",
            "Ha a nagyobb mintán elvetjük a függetlenséget, az azt jelenti, hogy a nem okozza a dohányzást."
          ],
          answer: [0, 1, 2],
          hint: R`Mit jelent a „nem vetjük el”? Hogyan függ a $\chi^2$ a mintanagyságtól? Mit csinál a Yates-korrekció az $|f - f^*|$-gal?`,
          explain: R`$p = 0{,}10 \gt 0{,}05$: a függetlenség nem cáfolt, de nem is bizonyított – a kétszeres mintán $\chi^2 = 5{,}33$, $p \approx 0{,}021$ már kimutatja a kapcsolatot. A Yates-korrekció minden $|f - f^*|$-ból 0,5-öt levon, így $2{,}16$-ot kapsz ($p = 0{,}14$) – ezért adhat más p-értéket egy program, mint a kézi számolás. A függetlenség elvetése kapcsolatot jelent, nem okot (zavaró változók: <a class="xref" href="../03-ket-valtozo-kapcsolata/#s37-a">3.7-a</a>).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató 500 véletlenszerűen kiválasztott felnőttnél feljegyzi a végzettséget (3 szint) és a kedvenc hírforrást (4 típus). Melyik próbát végzi, és mi a $H_0$?`,
          options: [
            R`Függetlenségvizsgálat; $H_0$: a végzettség és a hírforrás független.`,
            R`Homogenitásvizsgálat; $H_0$: a három végzettségi csoport mintanagysága egyforma.`,
            R`Illeszkedésvizsgálat; $H_0$: a 12 cella egyforma valószínűségű.`,
            R`Függetlenségvizsgálat; $H_0$: a végzettség és a hírforrás összefügg.`
          ],
          answer: 0,
          hint: "Hány mintát vett, és rögzítette-e előre a csoportok méretét? Mit állít mindig a nullhipotézis?",
          explain: R`Egyetlen véletlen minta, két kategoriális változó, minden perem véletlen → függetlenségvizsgálat, $H_0$: függetlenség ($df = 2 \cdot 3 = 6$). Homogenitásvizsgálat akkor lenne, ha a végzettségi csoportokból <em>külön</em>, előre rögzített méretű mintát venne – és ott is az eloszlások azonosságát teszteli, nem a mintaméreteket. A „12 egyforma cella” egyenletes elosztás, amit semmi nem indokol. A $H_0$ mindig az „egyenlőség/függetlenség”, a kapcsolat az $H_1$. (A számolás egyébként mindkét próbánál ugyanaz.)`
        }
      ]
    },

    /* ------------------------------------------------ 9.4 */
    "ms9-94": {
      title: "Kvíz – 9.4 Fisher egzakt próbája",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hat csésze, 3–3; a hölgy a 3 „tej előbb” csészéből 2-t talál el. Az $X$ (találatok) eloszlása: 1, 9, 9, 1 a 20-ból ($X = 0, 1, 2, 3$). Mennyi az egyoldali p-érték?`,
          options: ["0,50", "0,45", "0,05", "1,00"],
          answer: 0,
          hint: R`A p-érték a megfigyelt <em>és minden szélsőségesebb</em> tábla valószínűsége a megfigyelt irányban.`,
          explain: R`$P(X \ge 2) = (9 + 1)/20 = 0{,}50$ – a véletlen tippelés felében legalább ennyi találat jön ki, semmi meggyőző. A 0,45 csak a megfigyelt tábla valószínűsége ($9/20$) – a szélsőségesebb $X = 3$ kimaradt. A 0,05 a tökéletes találat ($X = 3$) valószínűsége, nem ezé az eseté. Az 1,00 az egyoldali érték duplázása – értelmetlen, és a kétoldali p sem így számolandó.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tábla: 3 | 0 és 1 | 6 (sorösszegek 3, 7; oszlopösszegek 4, 6; $N = 10$). $H_0$ mellett $X = a$ eloszlása: $X = 0, 1, 2, 3$ esetén 20, 60, 36, 4 a 120-ból. Mennyi a <b>kétoldali</b> Fisher-p, és mi a döntés 5%-on?`,
          options: [
            R`$p \approx 0{,}033$ → elvetjük $H_0$-t.`,
            R`$p \approx 0{,}067$ (az egyoldali duplája) → nem vetjük el.`,
            R`$p = 0{,}20$ (a két szélső tábla, $X = 0$ és $X = 3$) → nem vetjük el.`,
            R`$p \approx 0{,}011$ (χ²-próba, $\chi^2 \approx 6{,}43$) → elvetjük.`
          ],
          answer: 0,
          hint: R`Kétoldali Fisher-p: azoknak a $k$-knak az összvalószínűsége, amelyekre $P(X = k) \le P(X = a)$. Melyik $k$-k ilyenek, ha $P(X = 3) = 4/120$?`,
          explain: R`A megfigyelt tábla valószínűsége $4/120$. Ennél nem nagyobb valószínűségű csak az $X = 3$ maga (az $X = 0$ valószínűsége $20/120$, nagyobb). Kétoldali $p = 4/120 \approx 0{,}033$ → elvetjük. Az eloszlás <b>aszimmetrikus</b> (a peremek nem egyformák), ezért a duplázás (0,067) itt rossz – épp a döntést fordítaná meg. A „két szélső tábla” összeadása (0,20) a valószínűségek helyett a helyzetet nézi. A χ²-próba itt nem alkalmazható: a várt gyakoriságok 1,2; 1,8; 2,8; 4,2 – mind 5 alatt, és a p-értéke túl optimista.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tábla: 25 | 5 és 5 | 5 ($N = 40$). A χ²-próba $p \approx 0{,}035$-öt, Fisher kétoldali próbája $p \approx 0{,}085$-öt ad. Melyiket használod, és mi a döntés 5%-on?`,
          options: [
            R`Fishert, mert a legkisebb várt gyakoriság $10 \cdot 10/40 = 2{,}5$; nem vetjük el $H_0$-t.`,
            R`A χ²-próbát, mert minden tényleges gyakoriság legalább 5; elvetjük $H_0$-t.`,
            R`A χ²-próbát, mert $N = 40$ már elég nagy minta; elvetjük $H_0$-t.`,
            R`A kettő átlagát ($p \approx 0{,}06$); nem vetjük el $H_0$-t.`
          ],
          answer: 0,
          hint: R`Az 5-ös szabály melyik gyakoriságokra vonatkozik? Számold ki a peremekből a legkisebb várt gyakoriságot!`,
          explain: R`Sorösszegek 30, 10; oszlopösszegek 30, 10. A „2. sor, 2. oszlop” cella várt gyakorisága $10 \cdot 10/40 = 2{,}5 \lt 5$ → Fisher, $p \approx 0{,}085$ → nem vetjük el. Az 5-ös szabály a <em>várt</em> gyakoriságokra szól, nem a tényleges gyakoriságokra – ez a második opció hibája. Az elemszám önmagában nem elég, a várt gyakoriságok számítanak. Két p-érték átlaga nem p-érték. Ez az eset jól mutatja, hogy kis táblán a χ²-közelítés túl optimista: hamisan „talál” hatást.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak Fisher egzakt próbájára? (Több jó válasz is lehet.)`,
          options: [
            R`A peremeket rögzítjük; $H_0$ mellett az $X = a$ cella hipergeometrikus eloszlású.`,
            R`A kétoldali p-érték azoknak a tábláknak az összvalószínűsége, amelyek legfeljebb olyan valószínűek, mint a megfigyelt.`,
            R`Kis mintán „óvatos”: a tényleges elsőfajú hiba általában kisebb $\alpha$-nál.`,
            "A p-érték a megfigyelt tábla valószínűsége.",
            "A kétoldali p-érték mindig az egyoldali kétszerese."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a 8 csészés kísérletre 3 találattal, és egy aszimmetrikus peremű táblára.",
          explain: R`Rögzített peremek mellett az egyetlen szabad cella hipergeometrikus (<a class="xref" href="#s94-a">9.4-a</a>). A kétoldali p a „legfeljebb ugyanilyen valószínű” táblák összege; duplázással csak szimmetrikus eloszlásnál (egyforma peremek) jön ki ugyanaz. A lehetséges táblák kis száma miatt a p-érték „ugrál”, a tényleges elsőfajú hiba kisebb $\alpha$-nál. A p-érték a megfigyelt <em>és minden szélsőségesebb</em> tábla valószínűsége: 3 találatnál $17/70$, nem $16/70$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Teás kísérlet $2k$ csészével ($k$–$k$), és a hölgy mindet eltalálja. Legalább hány csésze kell, hogy az egyoldali p-érték 1% alá essen?`,
          options: ["10", "8", "6", "12"],
          answer: 0,
          hint: R`A tökéletes találat valószínűsége $1/\binom{2k}{k}$. Számold ki $k = 3, 4, 5$-re!`,
          explain: R`$1/\binom63 = 1/20 = 0{,}05$; $1/\binom84 = 1/70 \approx 0{,}014$; $1/\binom{10}5 = 1/252 \approx 0{,}004$. Tehát 10 csésze kell. A 8 a tipikus hiba: Fisher kísérlete 5%-on szignifikáns, de 1%-on nem ($0{,}014 \gt 0{,}01$). 6 csészével a legkisebb elérhető p épp 0,05. A 12 is elég ($1/924$), de nem a legkevesebb.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 2×2-es tábla sorösszegei 5 és 11, oszlopösszegei 12 és 4 ($N = 16$). Milyen értékeket vehet fel a bal felső cella ($X$) rögzített peremek mellett?`,
          options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "1, 2, 3, 4"],
          answer: 0,
          hint: R`$X$ legfeljebb a saját sorösszege és oszlopösszege. Alulról: mennyi kerülhet legfeljebb az első sor második oszlopába?`,
          explain: R`Felülről: $X \le \min(5, 12) = 5$. Alulról: az első sor másik cellája $5 - X$ legfeljebb a második oszlop összege, 4, ezért $X \ge 1$. Tehát $X = 1, \dots, 5$. A 0 azért nem lehet, mert akkor az első sor mind az 5 eleme a 4 elemű második oszlopba kerülne. (A 16 betegnél is így adódott, hogy $X \ge 9 - 8 = 1$.) Az „1–4” a felső korlátot számolja el (a második oszlop 4-es összegét veszi az első oszlop 12-je helyett), a „0–4” ráadásul az alsót is.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 16 betegnél (7 | 1 és 2 | 6) Fisher kétoldali $p \approx 0{,}041$, a korrekció nélküli χ²-próba $p \approx 0{,}012$. Mit mutat ez?`,
          options: [
            "Kis táblán a χ²-közelítés túl optimista: kisebb p-t ad a pontosnál, túl gyakran „talál” hatást.",
            "A χ²-próba itt jobb, mert nagyobb az ereje, ezért kisebb a p-értéke.",
            "A két próba mást tesztel: a χ² függetlenséget, Fisher homogenitást.",
            "A Fisher-p hibás, mert a kétoldali értéket duplázással számoltuk."
          ],
          answer: 0,
          hint: "Melyik p-érték pontos, és melyik közelítés? Teljesül-e itt a χ²-próba feltétele?",
          explain: R`Minden várt gyakoriság 4,5 vagy 3,5 – 5 alatt, a χ²-közelítés nem megbízható. Fisher p-értéke pontos (felsorolás), a χ²-é kisebb nála: túl optimista. A „nagyobb erő” itt látszat – a próba nem tartja a névleges $\alpha$-t. Mindkét próba ugyanazt a $H_0$-t teszteli, és Fisher a peremekre feltételesen számol, így nem függ attól, rögzítettük-e a sorösszegeket. A duplázás itt jogos: a peremek egyformák (8, 8), az eloszlás szimmetrikus. A Yates-korrekció ($p \approx 0{,}044$) közelebb húzza a χ²-et a pontos értékhez.`
        }
      ]
    },

    /* ------------------------------------------------ 9.5 */
    "ms9-95": {
      title: "Kvíz – 9.5 Előjelpróba és Wilcoxon-féle előjeles rangpróba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`10 páros mérés különbségei közül 8 pozitív, 1 negatív, 1 pontosan nulla. Mennyi az előjelpróba egyoldali p-értéke ($H_1$: a különbségek mediánja pozitív)?`,
          options: [R`$\approx 0{,}020$`, R`$\approx 0{,}055$`, R`$\approx 0{,}018$`, R`$\approx 0{,}039$`],
          answer: 0,
          hint: R`Mit kezdesz a nulla különbséggel? Utána: $X \sim B(n;\ 0{,}5)$, és a p-érték a megfigyelt és a még szélsőségesebb esetek valószínűsége.`,
          explain: R`A nullát elhagyod: $n = 9$, $X = 8$. $P(X \ge 8) = (9 + 1)/512 \approx 0{,}020$. A $0{,}055 = (45 + 10 + 1)/1024$ úgy jön ki, ha a nullát megtartod ($n = 10$) – a nulla nem dönt egyik irányba sem, nem szabad sem pluszként, sem mínuszként számolni. A $0{,}018 = 9/512$ csak a megfigyelt eset, $P(X = 8)$; a szélsőségesebb $X = 9$ kimaradt. A $0{,}039$ a kétoldali p, a kérdés viszont egyoldali.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hat pár különbségei: $7,\ -4,\ 2,\ 9,\ -1,\ 5$. Mennyi a Wilcoxon-féle előjeles rangpróba $W_-$ statisztikája?`,
          options: [R`$W_- = 4$`, R`$W_- = 3$`, R`$W_- = 5$`, R`$W_- = 2$`],
          answer: 0,
          hint: R`Melyik számokat rangsorolod: a különbségeket vagy valami mást? És mi kerül az összegbe: rang, érték vagy darabszám?`,
          explain: R`Az <b>abszolút értékeket</b> rangsorolod: $1 \to 1$, $2 \to 2$, $4 \to 3$, $5 \to 4$, $7 \to 5$, $9 \to 6$. A negatívak ($-1$, $-4$) rangjai 1 és 3: $W_- = 4$ (és $W_+ = 21 - 4 = 17$). A $3$ akkor jön ki, ha az előjeles különbségeket rangsorolod – így a negatívak mindig a legkisebb rangokat kapják ($-4 \to 1$, $-1 \to 2$). Az $5 = 1 + 4$ az értékek összege, nem a rangoké. A $2$ a negatív különbségek <em>száma</em> – az előjelpróba statisztikája.`
        },
        {
          type: "single", shuffle: true,
          q: R`Különbségek: $3,\ -3,\ 5,\ 1,\ 6$. Mennyi $W_-$?`,
          options: [R`$W_- = 2{,}5$`, R`$W_- = 2$`, R`$W_- = 3$`, R`$W_- = 1$`],
          answer: 0,
          hint: R`Két abszolút érték egyforma. Hányadik helyért „versengenek”, és milyen rangot kapnak?`,
          explain: R`Az abszolút értékek: $1, 3, 3, 5, 6$. A két 3-as a 2. és 3. helyen áll – <b>kötés</b>, mindkettő átlagrangot kap: $(2 + 3)/2 = 2{,}5$. A $-3$ rangja tehát 2,5, $W_- = 2{,}5$ ($W_+ = 1 + 2{,}5 + 4 + 5 = 12{,}5$, összesen $15 = 5 \cdot 6/2$ ✔). A 2 és a 3 a kötés egész ranggal való „szétosztása” – ilyenkor attól függne az eredmény, melyik 3-ast írtad előre. Az 1 a negatív különbségek száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n = 24$ nem nulla különbség, $W_+ = 80$. Mennyi a normális közelítés $z$-értéke? (Segítség: $24 \cdot 25 \cdot 49 / 24 = 1225$.)`,
          options: [R`$z = -2$`, R`$z \approx -0{,}06$`, R`$z \approx -6{,}29$`, R`$z \approx -1{,}41$`],
          answer: 0,
          hint: R`Kell $E(W_+) = n(n+1)/4$ és $D(W_+) = \sqrt{n(n+1)(2n+1)/24}$. Vigyázz: a nevezőbe szórás kell, nem szórásnégyzet.`,
          explain: R`$E(W_+) = 24 \cdot 25/4 = 150$, $D^2 = 1225$, $D = 35$; $z = (80 - 150)/35 = -2$ (kétoldali $p \approx 0{,}046$). A $-0{,}06 = -70/1225$ a szórásnégyzettel oszt. A $-6{,}29$ a várható értéknek a teljes rangösszeget, $n(n+1)/2 = 300$-at veszi – pedig $H_0$ mellett annak csak a <em>fele</em> várható $W_+$-ra. A $-1{,}41$ a 24 helyett 12-vel osztott szórásnégyzetből jön ($D \approx 49{,}5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Különbségek: $4,\ 6,\ -2,\ 3,\ 8,\ 7$; ekkor $W_- = 1$. Elírás miatt a $-2$ helyére $-20$ kerül. Mennyi lesz $W_-$?`,
          options: [R`$W_- = 6$`, R`$W_- = 1$`, R`$W_- = 20$`, R`$W_- = 15$`],
          answer: 0,
          hint: R`A rangpróba nem a nagyságot látja, hanem a sorrendet. Hányadik lesz a $|-20|$ az abszolút értékek sorában?`,
          explain: R`A $|-20| = 20$ lesz a legnagyobb abszolút érték: rangja 6, így $W_- = 6$ (ennél nagyobb nem is lehetne egyetlen negatív értékkel). A rangpróba tehát nem érzéketlen a kiugró értékre – csak „korlátosan” érzékeny: a $-20$ pontosan annyit számít, mintha $-9$ lenne (<a class="xref" href="#s95-c">9.5-c</a>). Az 1 akkor maradna, ha a $-2$ a legkisebb abszolút érték maradna. A 20 az érték, nem a rang. A 15 az új $W_+$ ($21 - 6$).`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak? (Több jó válasz is lehet.)`,
          options: [
            R`Az előjelpróba $H_0$-ja: $P(d \gt 0) = P(d \lt 0) = \tfrac12$, azaz a különbségek mediánja 0.`,
            R`A Wilcoxon-féle előjeles rangpróba feltételezi, hogy a különbségek eloszlása (a $H_0$-beli középpont körül) szimmetrikus.`,
            "A Wilcoxon-féle előjeles rangpróba a különbségek átlagáról dönt.",
            "Normális különbségekre a Wilcoxon-próba sokkal gyengébb a páros t-próbánál, ezért ott értelmetlen használni.",
            "Ha a páros t-próba nem szignifikáns, érdemes rangpróbával is megnézni – az eredmények közül a jobbat közöljük."
          ],
          answer: [0, 1],
          hint: R`Gondold végig, miről szól a rangpróba (átlag vagy középpont?), mennyit veszít normális adaton (ARE), és mikor kell kiválasztani a próbát.`,
          explain: R`Az előjelpróba csak az irányt nézi, $H_0$-ja a medián (pontosabban $P(d \gt 0) = \tfrac12$). A Wilcoxon-próba a szimmetriát is feltételezi – nagyon ferde különbségekre az előjelpróba a biztonságos. <b>Nem</b> az átlagról szól: szimmetrikus eloszlásnál a mediánról. Normális adaton is alig gyengébb: aszimptotikus relatív hatásossága $3/\pi \approx 0{,}955$, kb. 5%-kal több adat kell. Az utolsó p-hacking: a próbát előre, az adat típusa alapján kell választani (<a class="xref" href="../07-hipotezisvizsgalat/#s77-b">7.7-b</a>).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kísérletet 5 párral terveznek, és kétoldali 5%-os Wilcoxon-féle előjeles rangpróbával értékelnek. Mi igaz?`,
          options: [
            R`Soha nem lehet szignifikáns: a legkisebb elérhető kétoldali p $2/32 = 0{,}0625$.`,
            R`Szignifikáns, ha mind az 5 különbség pozitív, mert akkor $p = 1/32 \approx 0{,}031$.`,
            R`Szignifikáns, ha $W_- \le 1$, mert ennek az esélye kicsi.`,
            "Öt párnál a normális közelítés is pontos, ezért a táblázatra nincs is szükség."
          ],
          answer: 0,
          hint: R`Hány egyformán valószínű előjelezés van 5 rangra? Hányban a legszélsőségesebb az eredmény, és mi történik kétoldali próbánál?`,
          explain: R`$2^5 = 32$ előjelezés; a legszélsőségesebb ($W_- = 0$) egyetlenegy, kétoldalinál a másik irány ($W_+ = 0$) is számít: $p_{\min} = 2/32 = 0{,}0625 \gt 0{,}05$. Legalább 6 pár kell (ott a minimum $2/64 \approx 0{,}031$). Az $1/32$ az <em>egyoldali</em> p – kétoldali próbánál duplázni kell. $W_- \le 1$ két előjelezésben fordul elő: egyoldali $2/32$, kétoldali $4/32 = 0{,}125$. Kis $n$-nél pontos eloszlás kell, nem normális közelítés.`
        },
        {
          type: "single", shuffle: true,
          q: R`30 vásárló kóstol két kávét, és mindegyikük csak annyit mond, melyiket szereti jobban. Melyik próba illik ehhez az adathoz?`,
          options: [
            "Előjelpróba",
            "Wilcoxon-féle előjeles rangpróba",
            "Páros t-próba",
            "Mann–Whitney-féle U-próba"
          ],
          answer: 0,
          hint: R`Mit tudsz egy-egy vásárlóról: a különbség nagyságát vagy csak az irányát? És párosak vagy függetlenek a megfigyelések?`,
          explain: R`Minden vásárló egy „párt” ad (mindkét kávét kóstolta), de csak az <b>irányt</b> ismered – ez az előjelpróba esete: $X$ = az új kávét választók száma, $H_0$ mellett $B(30;\ 0{,}5)$. A Wilcoxon-próbához a különbségek <em>nagysága</em> is kellene (rangsorolni), a páros t-próbához számértékek. A Mann–Whitney két <em>független</em> minta próbája – itt ugyanazok az emberek kóstolták mindkettőt.`
        }
      ]
    },

    /* ------------------------------------------------ 9.6 */
    "ms9-96": {
      title: "Kvíz – 9.6 Mann–Whitney-féle U-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A csoport: $4,\ 9,\ 12$; B csoport: $2,\ 6,\ 7,\ 10$. Mennyi $U_A$?`,
          options: [R`$U_A = 8$`, R`$U_A = 14$`, R`$U_A = 4$`, R`$U_A = 0$`],
          answer: 0,
          hint: R`Rangsorold a hét értéket <em>együtt</em>, add össze az A rangjait, és vond le a rangösszeg minimumát, $n_1(n_1+1)/2$-t. Ellenőrizheted párokkal is.`,
          explain: R`Közös rangsor: 2 (B) 1, 4 (A) 2, 6 (B) 3, 7 (B) 4, 9 (A) 5, 10 (B) 6, 12 (A) 7. $R_A = 2 + 5 + 7 = 14$, $U_A = 14 - 3 \cdot 4/2 = 8$. Párokkal: a 4 egy B-nél nagyobb, a 9 háromnál, a 12 mind a négynél: $1 + 3 + 4 = 8$ ✔. A 14 a rangösszeg – a minimum levonása maradt ki. A 4 az $U_B = 3 \cdot 4 - 8$. A 0 akkor jön ki, ha csoportonként külön rangsorolsz (az A rangjai 1, 2, 3 lennének) – a rangsor mindig közös.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két csoport: $n_1 = 10$, $n_2 = 20$, $U_1 = 150$. Mit jelent az $U_1/(n_1 n_2)$ értéke?`,
          options: [
            "Egy véletlen első csoportbeli érték 75% eséllyel nagyobb egy véletlen második csoportbelinél.",
            "Az első csoport mediánja 0,75-tel nagyobb a másodikénál.",
            "A próba p-értéke 0,75, tehát nincs különbség.",
            "Az első csoport értékeinek 75%-a nagyobb a második csoport minden eleménél."
          ],
          answer: 0,
          hint: R`$U_1$ azoknak a párosításoknak a száma, amelyekben az első csoportbeli érték a nagyobb. Hány párosítás van összesen?`,
          explain: R`$U_1/(n_1 n_2) = 150/200 = 0{,}75$ – a „valószínűségi fölény”, $P(X \gt Y)$ becslése (döntetlen ½-et ér). $H_0$ mellett 0,5. Ez hatásnagyság, nem p-érték, és nem is a mediánok különbsége (annak mértékegysége lenne). Nem azt mondja, hogy az első csoport 75%-a <em>minden</em> második csoportbelit megelőz, hanem hogy a 200 párosításból 150-ben az első csoportbeli a nagyobb.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n_1 = 15$, $n_2 = 20$, az első minta rangösszege $R_1 = 330$. Mennyi a normális közelítés $z$-értéke? (Segítség: $15 \cdot 20 \cdot 36/12 = 900$.)`,
          options: [R`$z = 2$`, R`$z = 6$`, R`$z \approx 0{,}07$`, R`$z = -3$`],
          answer: 0,
          hint: R`Előbb a rangösszegből $U_1$ kell. Utána $E(U_1) = n_1 n_2/2$ és $D(U_1) = \sqrt{n_1 n_2 (n_1 + n_2 + 1)/12}$.`,
          explain: R`$U_1 = 330 - 15 \cdot 16/2 = 210$; $E(U_1) = 150$, $D(U_1) = \sqrt{900} = 30$; $z = (210 - 150)/30 = 2$ (kétoldali $p \approx 0{,}046$). A 6 a rangösszeget hasonlítja $U$ várható értékéhez ($(330 - 150)/30$) – $R$ és $U$ összekeverése. A $0{,}07 = 60/900$ szórásnégyzettel oszt. A $-3$ várható értéknek $n_1 n_2 = 300$-at vesz, pedig az $U_1$ maximuma ez, nem a várható értéke.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Mann–Whitney-próba kétoldali $p = 0{,}003$-at adott. Mi a legpontosabb megfogalmazás?`,
          options: [
            "Az egyik csoport értékei hajlamosak nagyobbak lenni: P(X > Y) eltér ½-től.",
            "A két csoport mediánja biztosan különbözik, bármilyen is a két eloszlás alakja.",
            "A két csoport átlaga különbözik.",
            "A két csoport szórása különbözik."
          ],
          answer: 0,
          hint: R`Mire érzékeny valójában a próba? Mi kellene ahhoz, hogy mediánokról beszélhess?`,
          explain: R`A $H_0$ az azonos eloszlás, és a próba arra érzékeny, hogy $P(X \gt Y)$ eltér-e ½-től (<a class="xref" href="#s96-b">9.6-b</a>). Mediánokról csak akkor szól, ha a két eloszlás alakja (szórása) azonos, és csak eltolódásban különböznek – eltérő szórású, azonos mediánú eloszlásoknál is lehet szignifikáns. Átlagokról ferde adatnál végképp nem: arra a Welch-próba vagy bootstrap való. A szórások eltérésére a kétmintás KS érzékenyebb.`
        },
        {
          type: "match",
          q: R`Párosítsd a helyzetet a megfelelő rangpróbával!`,
          pairs: [
            [R`Ugyanaz a 15 beteg fájdalompontszáma (0–10) kezelés előtt és után`, "Wilcoxon-féle előjeles rangpróba"],
            [R`Két ügyfélszolgálat elégedettségi pontszámai (1–5), 40–40 válasz`, "Mann–Whitney-féle U-próba"],
            [R`Négy gyógyszer hatása 6–6 betegen, erősen ferde mérések`, "Kruskal–Wallis-próba"],
            [R`20 pár: csak az ismert, hogy az új vagy a régi termék a jobb`, "előjelpróba"]
          ],
          hint: R`Két kérdés: hány csoport van, és ugyanazokat mérted-e többször (páros adat)? Ha páros, ismered-e a különbség nagyságát?`,
          explain: R`Előtte–utána = páros adat, a különbségek rangsorolhatók → Wilcoxon-féle előjeles rangpróba (<a class="xref" href="#s95-b">9.5-b</a>). Két független csoport, ordinális skála → Mann–Whitney (kötéskorrekcióval). Három vagy több független csoport → Kruskal–Wallis, $df = 4 - 1 = 3$. Páros adat, de csak az irány ismert → előjelpróba. A tipikus hiba a páros és a független esetek összekeverése: páros adatra Mann–Whitney, független csoportokra előjeles rangpróba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kruskal–Wallis-próba: A: $10, 11, 12$; B: $1, 2, 3$; C: $4, 5, 6$ ($N = 9$). Mennyi $H$, és hány szabadságfokú χ²-eloszláshoz mérjük?`,
          options: [R`$H = 7{,}2$; $df = 2$`, R`$H = 37{,}2$; $df = 2$`, R`$H = 7{,}2$; $df = 3$`, R`$H = 7{,}2$; $df = 8$`],
          answer: 0,
          hint: R`Rangösszegek a közös rangsorból; $H = \frac{12}{N(N+1)}\sum R_i^2/n_i - 3(N+1)$. A szabadságfok a csoportok számából jön.`,
          explain: R`Rangösszegek: A $7 + 8 + 9 = 24$, B $6$, C $15$. $H = \frac{12}{90} \cdot \frac{576 + 36 + 225}{3} - 30 = 37{,}2 - 30 = 7{,}2$, $df = k - 1 = 2$ ($p \approx 0{,}027$; ilyen kis csoportoknál a χ²-közelítés csak tájékoztató). A 37,2-ből a $-3(N+1)$ maradt le. $df = 3$ a csoportok száma ($k$ a $k - 1$ helyett), $df = 8 = N - 1$ az elemszámból jönne – egyik sem jó.`
        },
        {
          type: "single", shuffle: true,
          q: R`A: $5, 8, 9$; B: $1, 2, 4, 6$; ekkor $U_A = 11$. Ha a B csoport 6-osa helyett 60 áll, mennyi lesz $U_A$?`,
          options: [R`$U_A = 9$`, R`$U_A = 11$`, R`$U_A = 12$`, R`$U_A = 3$`],
          answer: 0,
          hint: R`Számold párokkal: hány B-nél nagyobb egy-egy A-érték? Változik a sorrend?`,
          explain: R`A 60 a legnagyobb lesz, így most egyik A-érték sem nagyobb nála. Mindhárom A-érték pontosan három B-nél (1, 2, 4) nagyobb: $U_A = 3 + 3 + 3 = 9$. (Rangokkal: A rangjai 4, 5, 6, $R_A = 15$, $U_A = 15 - 6 = 9$.) A 11 a változatlannak hitt érték: a rangpróba érzékeli, hogy egy B-s a sorrendben az A-k fölé került – de csak annyival, amennyit a sorrendben lépett, nem 54 ponttal. A 12 = $n_1 n_2$ a maximum, a 3 = $U_B$.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak a Mann–Whitney-próbára? (Több jó válasz is lehet.)`,
          options: [
            R`3 + 3 adatnál kétoldali 5%-on soha nem lehet szignifikáns.`,
            R`$H_0$ mellett $U_1/(n_1 n_2)$ várható értéke ½.`,
            R`Normális adaton kb. 5%-kal több adat kell ugyanakkora erőhöz, mint a t-próbánál.`,
            R`Az $R_1$ rangösszeg közvetlenül összevethető az $U$ kritikus értékeivel.`,
            "A rangokat csoportonként külön, 1-től kezdve osztjuk ki."
          ],
          answer: [0, 1, 2],
          hint: R`Hány felosztás van 3 + 3 adatnál, és mekkora a legszélsőségesebb esélye? Mit kell levonni a rangösszegből?`,
          explain: R`3 + 3 adatnál $\binom63 = 20$ felosztás van, a legkisebb kétoldali p $2/20 = 0{,}10$. $H_0$ mellett $E(U_1) = n_1 n_2/2$, így $U_1/(n_1n_2)$ várhatóan ½. Az aszimptotikus relatív hatásosság normális adaton $3/\pi \approx 0{,}955$. Hamis: az $R_1$-ből előbb le kell vonni a minimumát, $n_1(n_1+1)/2$-t. Hamis: a rangsor a két minta <em>együttes</em> sorrendje – csoportonként rangsorolva mindkét csoport 1-től indulna, és a próba semmit nem látna.`
        }
      ]
    },

    /* ------------------------------------------------ 9.7 */
    "ms9-97": {
      title: "Kvíz – 9.7 Kolmogorov–Szmirnov-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Három szám: $0{,}2;\ 0{,}5;\ 0{,}9$. $H_0$: egyenletes eloszlás $[0, 1]$-en, $F(x) = x$. Mennyi a KS-statisztika, $D$?`,
          options: [R`$D \approx 0{,}23$`, R`$D \approx 0{,}17$`, R`$D = 0{,}10$`, R`$D = 0{,}20$`],
          answer: 0,
          hint: R`Minden adatpontnál két értéket vet fel a lépcső: $\frac{i-1}{n}$-t (ugrás előtt) és $\frac in$-t (ugrás után). Mindkettőt vesd össze $F(x_{(i)})$-vel.`,
          explain: R`Ugrás után: $\tfrac13 - 0{,}2 \approx 0{,}13$; $\tfrac23 - 0{,}5 \approx 0{,}17$; $1 - 0{,}9 = 0{,}10$. Ugrás előtt: $0{,}2 - 0 = 0{,}2$; $0{,}5 - \tfrac13 \approx 0{,}17$; $0{,}9 - \tfrac23 \approx 0{,}23$. A legnagyobb: $D \approx 0{,}23$, a 0,9-nél, <em>az ugrás előtt</em>. A 0,17 csak az ugrás utáni eltéréseket nézi – a szakasz első buktatója. A 0,10 csak az utolsó pont ugrás utáni eltérése, a 0,20 az első pont ugrás előtti eltérése.`
        },
        {
          type: "single", shuffle: true,
          q: R`20 mérést egy előre (nem a mintából) megadott folytonos eloszláshoz hasonlítasz: $D = 0{,}25$. Az 5%-os kritikus érték $D_{20;\,0{,}95} = 0{,}294$. Mi a helyes következtetés?`,
          options: [
            R`$0{,}25 \lt 0{,}294$, ezért $H_0$-t nem vetjük el; az adat összeegyeztethető az eloszlással.`,
            R`Elvetjük $H_0$-t, mert $0{,}25 \gt 1{,}36/20 = 0{,}068$.`,
            R`Nem vetjük el, tehát bebizonyítottuk, hogy a minta ebből az eloszlásból származik.`,
            R`Elvetjük $H_0$-t, mert $D \gt 0{,}05$.`
          ],
          answer: 0,
          hint: R`Mihez kell $D$-t hasonlítani? A közelítő képletben $n$ vagy $\sqrt n$ áll? És mit jelent a „nem vetjük el”?`,
          explain: R`A tábla szerint $0{,}25 \lt 0{,}294$ → nem vetjük el ($p \approx 0{,}14$). A $1{,}36/20$ a $\sqrt{20}$ helyett 20-szal oszt (helyesen $1{,}36/\sqrt{20} \approx 0{,}30$ – ez nagy $n$-re szóló közelítés, de itt is közel van a táblázat 0,294-éhez). A „nem vetjük el” nem bizonyítás: 20 adatból sok más eloszlás is összeegyeztethető lenne. $D$-t nem az $\alpha$-val, hanem a kritikus értékkel kell összevetni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy elemző 30 adatra normális eloszlást illeszt ($\mu$ helyett $\bar x$, $\sigma$ helyett $s$), majd a szokásos KS-táblázattal $p = 0{,}5$-et kap, és kijelenti: „az adat normális”. Mi a fő hiba?`,
          options: [
            "Becsült paraméterek mellett a szokásos KS-táblázat túl engedékeny (a p-érték felfelé torzít); Lilliefors-próba vagy Shapiro–Wilk kellene.",
            "Semmi hiba: a KS-próba eloszlása semmilyen esetben nem függ az F-től.",
            "A KS-táblázatban a szabadságfokot kellett volna 2-vel csökkenteni, mint a χ²-próbánál.",
            "Becsült paraméterek mellett a KS-próba túl gyakran vet el, ezért a p = 0,5 még megbízhatóbb."
          ],
          answer: 0,
          hint: R`Mi történik a normális görbével, ha a paramétereit a mintához igazítod? Nagyobb vagy kisebb lesz a $D$?`,
          explain: R`A becsült paraméterekkel a görbe „rá van hangolva” a mintára, $D$ szisztematikusan kisebb, a szokásos táblával a próba szinte soha nem vet el. A helyes kritikus értékek kisebbek – ez a Lilliefors-próba (<a class="xref" href="#s97-b">9.7-b</a>). A KS-eloszlás csak <em>teljesen megadott</em> $F$-nél független $F$-től. A KS-nek nincs szabadságfoka – a gondolat ugyanaz, mint a χ²-nél a $df = k - 1 - m$, de a javítás itt külön táblázat. És fordítva: ilyenkor <em>ritkábban</em> vet el, nem gyakrabban. Ráadásul a „nem vetjük el” amúgy sem jelenti, hogy az adat normális.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kockát 120-szor feldobunk. Melyik próbával döntenéd el, hogy szabályos-e?`,
          options: [
            R`χ²-illeszkedésvizsgálat ($df = 5$)`,
            "Egymintás Kolmogorov–Szmirnov-próba a szokásos táblázattal",
            "Mann–Whitney-féle U-próba",
            "Wilcoxon-féle előjeles rangpróba"
          ],
          answer: 0,
          hint: R`Folytonos vagy diszkrét az adat? Melyik próba táblázata érvényes csak folytonos eloszlásra?`,
          explain: R`A dobás eredménye diszkrét (hat kategória), a várt gyakoriság 20 ≥ 5 → χ²-illeszkedésvizsgálat, $df = 6 - 1 = 5$ (<a class="xref" href="#s91-b">9.1-b</a>). A KS táblázata folytonos eloszlásra érvényes; diszkrét adatnál a sok egyforma érték miatt konzervatív (ritkábban vet el, mint kellene). A Mann–Whitney két minta, a Wilcoxon páros különbségek próbája – egyik sem illeszkedésvizsgálat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Körülbelül mekkora az egymintás KS-próba 5%-os kritikus értéke $n = 225$-nél?`,
          options: [R`$\approx 0{,}091$`, R`$\approx 0{,}006$`, R`$\approx 0{,}131$`, R`$\approx 0{,}045$`],
          answer: 0,
          hint: R`Nagy $n$-re $D_{n;\,0{,}95} \approx 1{,}36/\sqrt n$. Mennyi $\sqrt{225}$?`,
          explain: R`$1{,}36/\sqrt{225} = 1{,}36/15 \approx 0{,}091$. A $0{,}006 = 1{,}36/225$ a gyök nélkül oszt. A $0{,}131 = 1{,}96/15$ a normális eloszlás kvantilisét használja 1,36 helyett. A $0{,}045 = 1{,}36/30$ $\sqrt n$ helyett $2\sqrt n$-nel oszt. A kritikus érték $1/\sqrt n$-nel csökken, mint a standard hiba (<a class="xref" href="../05-mintaveteli-eloszlasok/#s52-c">5.2-c</a>).`
        },
        {
          type: "single", shuffle: true,
          q: R`Kétmintás KS: A: $1, 2, 3, 7$; B: $4, 5, 6, 8$. Mennyi $D$, a két empirikus eloszlásfüggvény legnagyobb eltérése?`,
          options: [R`$D = 0{,}75$`, R`$D = 0{,}5$`, R`$D = 1$`, R`$D = 0{,}25$`],
          answer: 0,
          hint: R`Menj végig a számegyenesen: hol áll az A lépcsője már magasan, miközben a B-é még alig emelkedett?`,
          explain: R`A 3 és a 4 között az A-nak már $3/4$-e, a B-nek még $0$ része van alatta: $D = 0{,}75$. Máshol kisebb az eltérés (pl. a 6 és 7 között $3/4 - 3/4 = 0$, a 7 és 8 között $1 - 3/4 = 0{,}25$). Az 1 akkor lenne, ha minden A kisebb lenne minden B-nél – de a 7 nagyobb három B-nél. A 0,5 és a 0,25 egy-egy kisebb eltérés, nem a maximum.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gép töltési tömegeinek átlaga és mediánja is ugyanaz, de az egyik szórása háromszoros. Melyik próba veszi ezt észre jobban?`,
          options: [
            "A kétmintás Kolmogorov–Szmirnov-próba",
            "A Mann–Whitney-féle U-próba",
            "A Wilcoxon-féle előjeles rangpróba",
            "Mindegyik rangpróba egyformán, mert mind eloszlásmentes."
          ],
          answer: 0,
          hint: R`Ha az egyik eloszlás csak „szétterül”, de nem tolódik el, mennyi lesz $P(X \gt Y)$? És mit lát ilyenkor a két eloszlásfüggvény?`,
          explain: R`A kétmintás KS <b>bármilyen</b> eltérésre érzékeny: a szórtabb eloszlás eloszlásfüggvénye lassabban emelkedik, a széleken eltér a másiktól. A Mann–Whitney főleg az eltolódást látja: itt $P(X \gt Y) \approx \tfrac12$, alig reagál. A Wilcoxon-féle előjeles rangpróba páros adatra való, itt két független minta van. Az „eloszlásmentes” csak annyit jelent, hogy nem kell normalitás – arra, hogy milyen eltérést vesznek észre, a próbák nagyon különböznek.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak az egymintás KS-próbára? (Több jó válasz is lehet.)`,
          options: [
            R`$H_0$ mellett $D$ eloszlása bármely teljesen megadott, folytonos $F$-nél ugyanaz.`,
            R`$D$ kiszámításához elég az adatpontoknál, az ugrás előtti és utáni lépcsőértéket nézni.`,
            "A próbához az adatokat előbb osztályokba kell sorolni.",
            "A KS-próba a hisztogramot hasonlítja a sűrűségfüggvényhez.",
            "Kis mintán (pl. 4–5 adat) is jól kimutatja az eltérést az eloszlástól."
          ],
          answer: [0, 1],
          hint: R`Mi az előnye a KS-nek a χ²-illeszkedésvizsgálattal szemben? Mit hasonlít: sűrűséget vagy eloszlásfüggvényt? Mekkora a kritikus érték $n = 4$-nél?`,
          explain: R`$D$ eloszlása $H_0$ mellett nem függ $F$-től (ha $F$ folytonos és teljesen megadott) – ezért elég egyetlen táblázat. Két adatpont között a lépcső vízszintes, $F$ nő, így a maximum az ugrások két oldalán van. Hamis: a KS épp osztályok nélkül dolgozik. Hamis: az <em>eloszlásfüggvényeket</em> hasonlítja, nem a hisztogramot a sűrűséggel. Hamis: $n = 4$-nél a kritikus érték 0,624 – a négy zacskónál $D = 0{,}50$ sem volt szignifikáns, ilyen kevés adatból a próba szinte semmit nem mutat ki.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms9-final": {
      title: "Fejezetzáró teszt – 9. Khi-négyzet-próbák és nemparaméteres módszerek",
      questions: [
        {
          type: "match",
          q: R`Melyik próba kell? Párosítsd a helyzetet a próbával!`,
          pairs: [
            [R`Egy szerencsekerék 4 mezője egyformán valószínű-e? 200 pörgetés eredménye.`, "χ²-illeszkedésvizsgálat"],
            [R`600 fős véletlen minta: összefügg-e a végzettség és a hírforrás (3×4-es tábla, minden várt ≥ 5)?`, "χ²-függetlenségvizsgálat"],
            [R`2×2-es tábla 14 beteggel, a legkisebb várt gyakoriság 2,5`, "Fisher egzakt próbája"],
            [R`12 dolgozó teljesítménye betanítás előtt és után, egy kiugró különbséggel`, "Wilcoxon-féle előjeles rangpróba"],
            [R`Két független csoport osztályzatai (1–5)`, "Mann–Whitney-féle U-próba"],
            [R`Megfelel-e 40 alkatrész élettartama a gyártó által megadott exponenciális eloszlásnak?`, "Kolmogorov–Szmirnov-próba"]
          ],
          hint: R`Előbb: kategória (darabszám) vagy mérés? Kategóriánál: egy minta vagy két változó, és mekkorák a várt gyakoriságok? Mérésnél: páros, független, vagy egy teljes eloszlás a kérdés?`,
          explain: R`Kerék: egy minta, elméleti eloszlás → illeszkedésvizsgálat, $df = 3$. Egy minta, két kategoriális változó → függetlenségvizsgálat, $df = (3-1)(4-1) = 6$. 2×2, várt 5 alatt → Fisher (<a class="xref" href="#s94-b">9.4-b</a>). Előtte–utána, kiugró → előjeles rangpróba. Független csoportok, ordinális skála → Mann–Whitney. Folytonos adat, <em>teljesen megadott</em> eloszlás → KS (ha a paramétert a mintából becsülnéd, Lilliefors). A döntési táblázat: <a class="xref" href="#s98-d">9.8-d</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pörgettyű három színe elvileg egyformán valószínű. 90 pörgetésből: 40, 30, 20. Mi a χ²-próba eredménye 5%-on?`,
          options: [
            R`$\chi^2 \approx 6{,}67$, $df = 2$, $6{,}67 \ge 5{,}99$ → elvetjük $H_0$-t.`,
            R`$\chi^2 \approx 6{,}67$, $df = 3$, $6{,}67 \lt 7{,}81$ → nem vetjük el.`,
            R`$\chi^2 = 7{,}5$, $df = 2$ → elvetjük $H_0$-t.`,
            R`$\chi^2 \approx 6{,}67$, de a kétoldali $p \approx 0{,}07$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Várt gyakoriság: $np_i$. Mi kerül a nevezőbe? A szabadságfok a kategóriák számából jön – és van-e itt „másik farok”?`,
          explain: R`Várt 30–30–30: $\chi^2 = (100 + 0 + 100)/30 \approx 6{,}67$, $df = 3 - 1 = 2$, $6{,}67 \ge 5{,}99$ → elvetjük ($p \approx 0{,}036$). A $df = 3$ a $k - 1$ helyett $k$ – a gyakoriságok összege kötött. A 7,5 a tényleges gyakoriságokkal oszt ($100/40 + 100/20$) – a nevezőben a <em>várt</em> gyakoriság áll. A χ²-próba p-értéke a felső farok, nem kell duplázni (<a class="xref" href="#s91-b">9.1-b</a>).`
        },
        {
          type: "single", shuffle: true,
          q: R`Poisson-eloszlást illesztesz 7 kategóriára, a $\lambda$-t a mintából becsülöd. Az utolsó három kategóriát (kis várt gyakoriság miatt) egybe kell vonni. Hány szabadságfokkal számolsz?`,
          options: [R`$df = 3$`, R`$df = 5$`, R`$df = 4$`, R`$df = 6$`],
          answer: 0,
          hint: R`Előbb számold ki, hány kategória marad az összevonás után, aztán vond le a kötöttségeket.`,
          explain: R`Az összevonás után $7 - 2 = 5$ kategória marad; egy becsült paraméter: $df = 5 - 1 - 1 = 3$ (<a class="xref" href="#s91-c">9.1-c</a>). Az 5 az összevonás előtti $k$-val számol ($7 - 1 - 1$). A 4 elfelejti a becsült paramétert – a próba túl engedékeny lenne. A 6 mindkét hibát elköveti.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három gyár termékeit négy minőségi osztályba sorolják, gyáranként 100 darabot. Hány szabadságfoka van a homogenitásvizsgálatnak?`,
          options: [R`$df = 6$`, R`$df = 11$`, R`$df = 5$`, R`$df = 12$`],
          answer: 0,
          hint: R`Itt a közös eloszlást a mintából becsüljük. Melyik képlet adja a szabadságfokot egy $b \times c$-s táblán?`,
          explain: R`$df = (b-1)(c-1) = 2 \cdot 3 = 6$ (<a class="xref" href="#s92-b">9.2-b</a>). A 11 $= bc - 1$ – az illeszkedésvizsgálat szabálya, de itt a közös eloszlás 3 valószínűségét is a mintából becsültük. Az 5 $= b + c - 2$ az összeadott (nem szorzott) „szabad” sorok és oszlopok. A 12 $= bc$ még a kötött összeget sem vonja le.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 3×4-es kontingencia-táblában ($N = 300$) $\chi^2 = 12$. Mennyi a Cramér-féle $V$?`,
          options: [R`$V \approx 0{,}14$`, R`$V = 0{,}20$`, R`$V \approx 0{,}12$`, R`$V = 0{,}04$`],
          answer: 0,
          hint: R`$V = \sqrt{\chi^2/(N \min\{b-1,\ c-1\})}$. Melyik a kisebb: $b - 1$ vagy $c - 1$?`,
          explain: R`$\min\{2, 3\} = 2$: $V = \sqrt{12/(300 \cdot 2)} = \sqrt{0{,}02} \approx 0{,}14$ – gyenge kapcsolat. A 0,20 $= \sqrt{12/300}$ – a $\min\{b-1, c-1\}$ szorzó maradt ki (ez csak 2×2-es táblán 1). A 0,12 a maximummal ($c - 1 = 3$) szoroz. A 0,04 $= 12/300$ a gyökvonás nélküli érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 2000 fős felmérésben a χ²-függetlenségvizsgálat $p \lt 0{,}001$-et ad, a Cramér-féle $V = 0{,}08$. Mi a helyes összegzés?`,
          options: [
            "A kapcsolat a sokaságban is kimutatható, de nagyon gyenge.",
            "A p-érték nagyon kicsi, tehát a két változó között erős a kapcsolat.",
            "A V kicsi, ezért a próba eredménye nem szignifikáns.",
            "A két változó között ok-okozati kapcsolat van."
          ],
          answer: 0,
          hint: R`Mit mér a p-érték, és mit a $V$? Hogyan függ a p-érték a mintanagyságtól?`,
          explain: R`A p-érték a <b>bizonyíték</b> erősségét méri, és nagy mintán kis eltérésre is kicsi lesz; a kapcsolat erősségét a $V$ adja (<a class="xref" href="#s93-c">9.3-c</a>). Ugyanaz a $V = 0{,}115$ 200 fős mintán $p = 0{,}10$, 2000 fősön $p \lt 0{,}001$ volt. A „kis $V$ → nem szignifikáns” fordítva keveri a kettőt. A függetlenség elvetése kapcsolatot jelent, nem okot.`
        },
        {
          type: "single", shuffle: true,
          q: R`10 betegből 3 kapott új kezelést, mindhárman meggyógyultak; a 7 kontrollbetegből 1 gyógyult (tábla: $3 \mid 0$ és $1 \mid 6$). Rögzített peremek mellett a bal felső cella $X = 0, 1, 2, 3$ értékeinek esetszáma a 120-ból: 20, 60, 36, 4. Mennyi a kétoldali Fisher-féle p-érték?`,
          options: [R`$\approx 0{,}033$`, R`$\approx 0{,}067$`, R`$0{,}20$`, R`$\approx 0{,}33$`],
          answer: 0,
          hint: R`A kétoldali p-érték azoknak a tábláknak az összvalószínűsége, amelyek <em>legfeljebb annyira valószínűek</em>, mint a megfigyelt. Szimmetrikus ez az eloszlás?`,
          explain: R`A megfigyelt tábla ($X = 3$) valószínűsége $4/120$. Nála nem valószínűbb tábla csak ő maga (a $X = 0$ esélye $20/120$, sokkal nagyobb): kétoldali $p = 4/120 \approx 0{,}033$ → 5%-on elvetjük a függetlenséget. A $0{,}067$ az egyoldali p duplázása – az eloszlás itt <b>aszimmetrikus</b> (a peremek nem egyformák), a duplázás hibás (<a class="xref" href="#s94-a">9.4-a</a>). A $0{,}20 = (4 + 20)/120$ a „másik végét” mechanikusan hozzáadja. A $0{,}33 = (36 + 4)/120$ a $P(X \ge 2)$. (A χ²-próba itt nem használható: a legkisebb várt gyakoriság 1,2.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Hét pár különbségei: $10,\ -7,\ 15,\ 4,\ -2,\ 12,\ 5$. Mennyi a Wilcoxon-féle előjeles rangpróba $W_-$ statisztikája?`,
          options: [R`$W_- = 5$`, R`$W_- = 3$`, R`$W_- = 9$`, R`$W_- = 2$`],
          answer: 0,
          hint: R`Abszolút érték → rang → csak utána az előjel. Rangokat adsz össze, nem értékeket.`,
          explain: R`Abszolút értékek sorrendben: 2, 4, 5, 7, 10, 12, 15 → rangok 1–7. A negatívak: $|-2| \to 1$, $|-7| \to 4$: $W_- = 5$ ($W_+ = 28 - 5 = 23$). A 3 az előjeles különbségek rangsorolásából jön ($-7 \to 1$, $-2 \to 2$). A 9 $= 7 + 2$ az értékek összege. A 2 a negatív különbségek száma – az előjelpróba statisztikája.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mann–Whitney-próba: $n_1 = 4$, $n_2 = 5$, az első minta rangösszege a közös rangsorban $R_1 = 28$. Mennyi $U_1$?`,
          options: [R`$U_1 = 18$`, R`$U_1 = 28$`, R`$U_1 = 2$`, R`$U_1 = 8$`],
          answer: 0,
          hint: R`$U_1 = R_1 - n_1(n_1+1)/2$. Mennyi a legkisebb lehetséges rangösszeg 4 elemre?`,
          explain: R`$U_1 = 28 - 4 \cdot 5/2 = 28 - 10 = 18$ (a maximum $n_1 n_2 = 20$, tehát az első csoport értékei erősen „fölül” vannak; $U_1/(n_1 n_2) = 0{,}9$). A 28 maga a rangösszeg – $R$ és $U$ összekeverése. A 2 az $U_2 = 20 - 18$. A 8 $= 28 - 4 \cdot 5$: a minimum képletéből kimaradt a 2-vel osztás.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak a fejezet rangpróbáira? (Több jó válasz is lehet.)`,
          options: [
            "A Mann–Whitney-próbánál a két minta értékeit együtt rangsoroljuk.",
            "A Wilcoxon-féle előjeles rangpróbánál a különbségek abszolút értékét rangsoroljuk, a nullákat elhagyva.",
            "Ugyanazok az emberek előtte–utána: erre a Mann–Whitney-próba a helyes.",
            "A szignifikáns Mann–Whitney-próba mindig azt jelenti, hogy a két medián különbözik.",
            "A rangpróbák normális adaton mindig sokkal gyengébbek a t-próbánál."
          ],
          answer: [0, 1],
          hint: R`Gondold végig: páros vagy független adat, mit rangsorolunk, miről szól valójában a Mann–Whitney, és mennyi a $3/\pi$.`,
          explain: R`Az első kettő a két próba helyes menete (<a class="xref" href="#s95-b">9.5-b</a>, <a class="xref" href="#s96-a">9.6-a</a>). Páros adatra az előjeles rangpróba kell, nem a Mann–Whitney. A Mann–Whitney $P(X \gt Y) \ne \tfrac12$-re érzékeny; mediánokról csak azonos alakú, eltolt eloszlásoknál szól. Normális adaton a hatásosság $3/\pi \approx 0{,}955$ – alig gyengébb, vastag farkú adaton pedig erősebb is lehet.`
        },
        {
          type: "single", shuffle: true,
          q: R`50 mérés normalitását vizsgálod: $\bar x$-et és $s$-t a mintából számolod, majd a szokásos KS-táblázattal $D = 0{,}12 \lt 0{,}188$. Mi a helyes megjegyzés?`,
          options: [
            "Becsült paraméterek mellett a szokásos táblázat túl engedékeny; a Lilliefors-próba kisebb kritikus értékével kellene dönteni (vagy Shapiro–Wilk, QQ-ábra).",
            "Minden rendben: a KS-próba bármilyen eloszlásnál ugyanazt a táblázatot használja, a paraméterek eredete mindegy.",
            "A KS-próbát itt el kellene hagyni, mert csak diszkrét adatra való.",
            R`A $D \lt 0{,}188$ bizonyítja, hogy a mérések normális eloszlásúak.`
          ],
          answer: 0,
          hint: R`Teljesen megadott-e az $F$, ha $\mu$-t és $\sigma$-t a mintából becsülöd? Merre torzít ez?`,
          explain: R`A KS táblázata teljesen megadott $F$-re érvényes. Becsült $\mu$-vel és $\sigma$-val a görbe a mintához igazodik, $D$ kisebb lesz, a szokásos táblával a próba szinte soha nem vet el – a Lilliefors-próba kritikus értékei kisebbek (<a class="xref" href="#s97-b">9.7-b</a>). Ez ugyanaz a gondolat, mint a χ²-nél a becsült paraméterek levonása. A KS épp folytonos adatra való (diszkrét adatra nem a szokásos táblával). A „nem vetjük el” sosem bizonyítás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy könyvvizsgáló 500 számla első számjegyét veti össze a Benford-törvénnyel ($P(1) = \log_{10} 2 \approx 0{,}301$). Mennyi az 1-es várt gyakorisága, és hány szabadságfokkal számol?`,
          options: [
            R`$\approx 150{,}5$; $df = 8$`,
            R`$\approx 55{,}6$; $df = 8$`,
            R`$\approx 150{,}5$; $df = 9$`,
            R`$\approx 150{,}5$; $df = 7$`
          ],
          answer: 0,
          hint: R`A várt gyakoriság $n \cdot p_i$, ahol $p_i$ a $H_0$ (a Benford-törvény) szerinti valószínűség. Hány kategória van, és becsültél-e paramétert?`,
          explain: R`Várt: $500 \cdot 0{,}301 \approx 150{,}5$. Kilenc kategória (1–9), a valószínűségeket a törvény adja, nincs becsült paraméter: $df = 9 - 1 = 8$ (<a class="xref" href="#s98-b">9.8-b</a>). Az 55,6 $= 500/9$ az egyenletes elosztás – pedig $H_0$ itt nem egyforma valószínűségeket mond. A $df = 9$ a $k$ a $k - 1$ helyett. A $df = 7$ egy nem létező becsült paramétert von le.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy diák 40 független kísérlet χ²-értékét összeadja: $\chi^2 = 12$, $df = 40$. Ekkor $P(\chi^2_{40} \le 12) \approx 0{,}000\,005$. Mit mondasz neki?`,
          options: [
            "A várt érték 40 körül lenne; ilyen jó egyezés véletlenül szinte sosem jön ki – érdemes megnézni, hogyan születtek az adatok.",
            "Kitűnő illeszkedés, a kis χ² az elmélet bizonyítéka.",
            "A p-érték nagyon kicsi, ezért elvetjük az elméletet, mert az adat túl messze van tőle.",
            "Mivel a próba kétoldali, a p-érték 0,000 01, és ez szignifikáns eltérést jelent."
          ],
          answer: 0,
          hint: R`Mennyi a $\chi^2_{40}$-eloszlás várható értéke? Melyik farkat nézted itt, és mikor érdekes az?`,
          explain: R`$E(\chi^2_{40}) = 40$; a 12 gyanúsan kicsi – ez Mendel és Fisher esete (<a class="xref" href="#s98-c">9.8-c</a>): a valódi adatokban <em>kell</em> lennie véletlen ingadozásnak. A bal farok csak ilyenkor, az adatok hitelességének kérdésénél érdekes. Rendes vizsgálatban a szokásos (felső farok) p-érték $\approx 1$ – a $H_0$-t nem vetjük el, tehát a „túl messze van” értelmezés hibás. A χ²-próba nem kétoldali, a p-t nem duplázzuk.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
