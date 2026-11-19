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
            R`$df = 3$ ($rc - 1$), $7{,}79 \lt 7{,}81$ → nem vetjük el.`,
            R`$df = 2$ ($r + c - 2$), $7{,}79 \ge 5{,}99$ → elvetjük.`,
            R`$df = 1$, de a χ²-próba p-értékét duplázni kell, ezért csak 1%-on döntünk.`
          ],
          answer: 0,
          hint: R`A homogenitásvizsgálat szabadságfoka $(r-1)(c-1)$. Miért nem $rc - 1$, mint az illeszkedésnél?`,
          explain: R`2×2-es táblán $df = (2-1)(2-1) = 1$, a kritikus érték 3,84 → elvetjük ($p \approx 0{,}005$). Ugyanez a két arány $z$-próbája: $z \approx 2{,}79$, $z^2 \approx 7{,}79$. Az $rc - 1 = 3$ az illeszkedésvizsgálat szabálya lenne – de itt a közös eloszlást is a mintából becsültük, ezért levonjuk a $c - 1$ becsült valószínűséget (<a class="xref" href="#s92-a">9.2-a</a>). Az $r + c - 2$ hibás képlet (itt véletlenül ugyanazt a döntést adja, de rossz szabadságfokkal). Duplázni nem kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`4 iskola tanulóit sorolod 3 kategóriába (gyenge, közepes, jó), iskolánként külön mintával. Hány szabadságfokú a homogenitásvizsgálat?`,
          options: ["6", "11", "5", "12"],
          answer: 0,
          hint: R`Minden mintában hány gyakoriság szabad, és hány közös valószínűséget becsültél?`,
          explain: R`$(4-1)(3-1) = 6$. Iskolánként $3 - 1 = 2$ szabad gyakoriság ($4 \cdot 2 = 8$), ebből a közös eloszlás 2 becsült valószínűségét levonjuk: $8 - 2 = 6$. A 11 a $rc - 1$ (illeszkedésvizsgálat szabálya), az 5 a $r + c - 2$ (összeadás szorzás helyett), a 12 egyszerűen a cellák száma.`
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
          explain: R`Várt: $50 \cdot 0{,}50 = 25$; $17{,}5$; $7{,}5$ mindkét sorban. Egy sor hozzájárulása $25/25 + 6{,}25/17{,}5 + 6{,}25/7{,}5 \approx 1 + 0{,}357 + 0{,}833 = 2{,}19$; két egyforma méretű sornál a két sor ugyanannyit ad: $\chi^2 \approx 4{,}38$, $df = (2-1)(3-1) = 2$, $p \approx 0{,}11$. A 8,76 a <b>százalékokkal</b> (60, 30, 10 és 40, 40, 20) számolt érték: mintha 100–100 főt kérdeztél volna – hamisan szignifikáns. A 2,19 csak az egyik sort adja össze. A $df = 5$ a $rc - 1$ hiba (itt a döntést nem változtatja, de a szabadságfok rossz).`
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
