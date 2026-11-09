(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 8.5 */
    "ms8-85": {
      title: "Kvíz – 8.5 Kétmintás t-próba és Welch-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két független csoport: $n_1 = 5$, $s_1^2 = 10$; $n_2 = 9$, $s_2^2 = 4$. Mennyi a közös szórásnégyzet, $s_p^2$?`,
          options: [R`$s_p^2 = 6$`, R`$s_p^2 = 7$`, R`$s_p^2 \approx 5{,}14$`, R`$s_p^2 \approx 6{,}14$`],
          answer: 0,
          hint: R`Súlyozott átlag – de mi a súly: a csoportméret vagy a szabadságfok? És mivel osztasz a végén?`,
          explain: R`$s_p^2 = \dfrac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} = \dfrac{4 \cdot 10 + 8 \cdot 4}{12} = \dfrac{72}{12} = 6$ – közelebb a nagyobb minta 4-éhez. A 7 a sima átlag $(10 + 4)/2$: nem veszi figyelembe, hogy a második csoport nagyobb. Az $5{,}14 = 72/14$ jó számlálóval, de $n_1 + n_2$-vel oszt. A $6{,}14 = (5 \cdot 10 + 9 \cdot 4)/14$ a szabadságfok helyett a csoportméretekkel súlyoz.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n_1 = n_2 = 8$, $\bar x_1 - \bar x_2 = 6$, $s_1 = s_2 = 4$. Mennyi a kétmintás (közös szórásos) $t$, és hány a szabadságfok?`,
          options: [R`$t = 3$, $df = 14$`, R`$t = 3$, $df = 16$`, R`$t \approx 2{,}12$, $df = 14$`, R`$t \approx 4{,}24$, $df = 7$`],
          answer: 0,
          hint: R`$s_p = 4$. Az SE-ben a szórásnégyzet adódik össze: $s_p\sqrt{1/n_1 + 1/n_2}$. Hány átlagot becsültél?`,
          explain: R`$\mathrm{SE} = 4\sqrt{2/8} = 2$, $t = 6/2 = 3$, $df = 8 + 8 - 2 = 14$ ($p \approx 0{,}01$). A $df = 16$ elfelejti, hogy mindkét átlag „elvisz” egy szabadságfokot. A $2{,}12$ az SE-ket adja össze ($4/\sqrt8 + 4/\sqrt8 \approx 2{,}83$) a szórásnégyzetek helyett. A $4{,}24$ csak egy csoport SE-jével ($4/\sqrt 8$) oszt, mintha egymintás próba lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Welch-próba: $n_1 = 9$, $s_1 = 3$; $n_2 = 12$, $s_2 = 6$; $\bar x_1 - \bar x_2 = 5$. Mennyi az SE és a $t$?`,
          options: [
            R`$\mathrm{SE} = 2$, $t = 2{,}5$`,
            R`$\mathrm{SE} \approx 2{,}73$, $t \approx 1{,}83$`,
            R`$\mathrm{SE} \approx 0{,}91$, $t \approx 5{,}48$`,
            R`$\mathrm{SE} \approx 6{,}71$, $t \approx 0{,}75$`
          ],
          answer: 0,
          hint: R`Ugyanaz a képlet, mint a kétmintás u-próbánál, csak $\sigma$ helyett $s$: $\sqrt{s_1^2/n_1 + s_2^2/n_2}$. Négyzetre emelted a szórásokat? Osztottál $n$-nel?`,
          explain: R`$\mathrm{SE} = \sqrt{9/9 + 36/12} = \sqrt{1 + 3} = 2$, $t = 5/2 = 2{,}5$ (Welch-$df \approx 17$). A $2{,}73 = 1 + \sqrt3$ a két SE összege – a szórásnégyzetek adódnak össze, nem a szórások. A $0{,}91 = \sqrt{3/9 + 6/12}$ a szórásokat nem emeli négyzetre. A $6{,}71 = \sqrt{9 + 36}$ elfelejti az $n$-nel osztást: ez az egyedi értékek különbségének szórása, nem az átlagoké.`
        },
        {
          type: "single", shuffle: true,
          q: R`Welch-próbát végzel $n_1 = 6$ és $n_2 = 15$ fős csoporttal. Melyik szabadságfok jöhet ki a Welch–Satterthwaite-képletből?`,
          options: [R`$11{,}3$`, R`$4$`, R`$19{,}5$`, R`$21$`],
          answer: 0,
          hint: R`A Welch-$df$ két határ közé esik: az egyik a kisebb csoportból jön, a másik a közös szórásos próba szabadságfoka.`,
          explain: R`A Welch-$df$ $\min(n_1, n_2) - 1 = 5$ és $n_1 + n_2 - 2 = 19$ közé esik, és általában nem egész: a 11,3 lehetséges. A 4 kisebb, mint a kisebb csoport $n - 1$-e – ennél kevesebb nem lehet. A 19,5 túllépi a közös szórásos próba 19-ét, a 21 pedig $n_1 + n_2$ – egyik sem jöhet ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kis csoport nagy szórással ($n_1 = 6$, $s_1 = 15$), nagy csoport kis szórással ($n_2 = 30$, $s_2 = 4$). Melyik próbát válaszd az átlagok összehasonlítására, és miért?`,
          options: [
            "Welch-próbát: a közös szórásnégyzet a nagy, kis szórású csoport felé húz, alábecsüli az SE-t, és a próba túl gyakran riaszt.",
            "Közös szórásos t-próbát: nagyobb a szabadságfoka, ezért erősebb.",
            "Előbb F-próbát; ha az nem szignifikáns, közös szórásos t-próbát.",
            "Közös szórásos t-próbát, mert a Welch-próba csak egyforma csoportméretnél használható."
          ],
          answer: 0,
          hint: R`Melyik csoport szórásnégyzete dominálja $s_p^2$-et, és mekkora a kis csoport valódi bizonytalansága?`,
          explain: R`Ez az 5 vs 20 fős példa helyzete: a kisebb csoport szórása a nagyobb. Itt $s_p^2 = (5 \cdot 225 + 29 \cdot 16)/34 \approx 46{,}7$ a 16 felé húz, a közös SE kb. 3,06, a Welch-SE kb. 6,17 – a közös próba a felére becsüli a bizonytalanságot, és igaz $H_0$ mellett is sokszor riaszt (a szöveg példájában 28%-ban 5% helyett). A nagyobb $df$ nem ér semmit, ha az SE rossz. Az F-próbás előszűrés kis mintán gyenge és normalitásérzékeny – egyből Welch kell. A Welch épp eltérő csoportméreteknél és szórásoknál hasznos.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a közös szórásos t és a Welch-próba választásáról? (Több jó válasz is lehet.)`,
          options: [
            "Ha a szórások valóban egyformák, a Welch-próba szinte semmit sem veszít.",
            R`Egyforma csoportméretnél ($n_1 = n_2$) a közös szórásos próba is elég robusztus.`,
            R`A Welch-SE-hez a Welch-$df$ tartozik; az $n_1 + n_2 - 2$ vele túl liberális.`,
            "A szórások egyenlőségét érdemes előbb F-próbával ellenőrizni, és csak utána választani.",
            "Ha a kisebb csoport szórása a nagyobb, a közös szórásos próba túl óvatos lesz."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a „kétség esetén Welch” hüvelykujjszabályra és az 5 vs 20 fős szimulációra: melyik irányba téved a közös szórásos próba?",
          explain: R`Az első három igaz: egyenlő szórásnál a Welch alig gyengébb; egyforma $n$-nél a közös szórásos próba is jól viselkedik; a Welch-SE-t a nagyobb $n_1 + n_2 - 2$ szabadságfokkal párosítani túl kis kritikus értéket ad. Az F-próbás előszűrés rossz ötlet: kis mintán gyenge, nem normális adaton megbízhatatlan, és a két lépés együtt rosszabb, mint az egyből választott Welch. Ha a <em>kisebb</em> csoport szórása a nagyobb, a közös próba nem óvatos, hanem <b>túl liberális</b> (túl sokat riaszt); a túl óvatos eset a fordított (nagy csoport, nagy szórás).`
        },
        {
          type: "single", shuffle: true,
          q: R`Két tanítási módszer: az A csoport javulása egymintás próbával szignifikáns ($p = 0{,}03$), a B csoporté nem ($p = 0{,}08$). Mit mondhatsz?`,
          options: [
            "Ebből nem tudjuk, különbözik-e a két módszer – a különbséget magát kell kétmintás próbával tesztelni.",
            "Az A módszer szignifikánsan jobb a B-nél.",
            "A B módszer hatástalan, mert nem szignifikáns.",
            R`A két p-érték különbsége ($0{,}05$) a két módszer különbségének p-értéke.`
          ],
          answer: 0,
          hint: "Melyik hipotézist tesztelte a két egymintás próba – és melyiket kérdezed valójában?",
          explain: R`A két próba két külön kérdésre felelt („javult-e A?”, „javult-e B?”); a kérdés viszont az, hogy <b>különbözik-e</b> a kettő. A $p = 0{,}03$ és $0{,}08$ nagyon hasonló eredmény, a különbségük könnyen lehet véletlen. A „nem szignifikáns” nem jelenti, hogy B hatástalan (lehet, hogy csak kicsi a minta). A p-értékek nem vonhatók ki egymásból. Helyesen: a két csoport javulásait kétmintás (Welch-) próbával kell összevetni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 3 + 3 dolgozó adatára (7, 9, 11 vs 3, 5, 4) a kétmintás t-próba $p \approx 0{,}018$-at ad, a permutációs próba $p = 0{,}10$-et. Mi a magyarázat?`,
          options: [
            "A t-próba a normalitás feltevésével „pótolja” a hiányzó adatot; ha a feltevés igaz, jogosan erősebb, ha nem, félrevezet. A permutációs próba 20 felosztásnál 0,10-nél kisebbet nem is adhat.",
            "A t-próba hibásan számolt: 6 adatnál a t-eloszlás nem használható.",
            "A permutációs próba elfelejtette duplázni a p-értéket, ezért pontatlan.",
            "A két p-érték ugyanazt jelenti, csak más skálán."
          ],
          answer: 0,
          hint: R`Hányféleképpen osztható szét 6 adat 3–3-ra? Mekkora lehet így a legkisebb kétoldali p? És mit tesz fel a t-próba, amit a permutációs nem?`,
          explain: R`$\binom63 = 20$ felosztás van; a megfigyelt (és a tükörképe) a két legszélsőségesebb, így a kétoldali p legalább $2/20 = 0{,}10$. A t-próba ($t = 3{,}87$, $df = 4$) a normális modellből „tudja”, mi lenne több adatnál – ezért kisebb p-t ad, de csak akkor jogosan, ha a sokaság tényleg normális, és ezt hat adatból nem lehet ellenőrizni. A t-eloszlás kis mintán is használható (épp arra való), és a permutációs p itt már kétoldali.`
        }
      ]
    },

    /* ------------------------------------------------ 8.6 */
    "ms8-86": {
      title: "Kvíz – 8.6 Szórások próbái: χ²-próba és F-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$n = 11$, $s = 5$, $H_0$: $\sigma = 4$. Mennyi a $\chi^2$-próbastatisztika?`,
          options: [R`$\chi^2 \approx 15{,}63$`, R`$\chi^2 = 12{,}5$`, R`$\chi^2 \approx 17{,}19$`, R`$\chi^2 = 6{,}4$`],
          answer: 0,
          hint: R`$\chi^2 = (n - 1)s^2/\sigma_0^2$. Négyzetre emelted mindkét szórást? Mi a számláló szorzója?`,
          explain: R`$\chi^2 = \dfrac{10 \cdot 25}{16} \approx 15{,}63$. A 12,5 $= 10 \cdot 5/4$ a szórásokkal számol, nem a szórásnégyzetekkel. A 17,19 $= 11 \cdot 25/16$ $n$-nel szoroz $n - 1$ helyett. A 6,4 $= 10 \cdot 16/25$ fordítva osztja a két szórásnégyzetet.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gép régi szórása 8 g. Beállítás után 21 zacskóból $s = 5$ g. Csökkent-e a szórás? ($\alpha = 5\%$, $\chi^2_{20;\,0{,}05} = 10{,}85$, $\chi^2_{20;\,0{,}95} = 31{,}41$)`,
          options: [
            R`$\chi^2 \approx 7{,}81 \le 10{,}85$ → elvetjük $H_0$-t: a szórás szignifikánsan csökkent.`,
            R`$\chi^2 \approx 7{,}81 \lt 31{,}41$ → nem vetjük el $H_0$-t.`,
            R`A kis $\chi^2$ $H_0$ mellett szól, ezért nem vetjük el.`,
            R`Elvetjük, mert $s/\sigma_0 = 0{,}625 \lt 0{,}95$.`
          ],
          answer: 0,
          hint: R`Baloldali próba ($H_1$: $\sigma \lt 8$): a kritikus tartomány a $\chi^2$-eloszlás melyik szélén van?`,
          explain: R`$\chi^2 = 20 \cdot 25/64 \approx 7{,}81$. A „csökkent” baloldali kérdés, a kritikus tartomány $\chi^2 \le \chi^2_{20;\,0{,}05} = 10{,}85$ – a 7,81 oda esik, elvetjük ($p \approx 0{,}007$). A 31,41-es felső kvantilis a jobboldali (növekedést kérdező) próbáé. A kicsi $\chi^2$ itt épp a csökkenés jele. Az $s/\sigma_0$ arányt nem kvantilissel kell összevetni, hanem a $\chi^2$-statisztikát.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kétoldali $\chi^2$-próbánál a szórásra miért kell két külön kritikus értéket kikeresni, és nem elég egy $\pm$ érték?`,
          options: [
            R`Mert a $\chi^2$-eloszlás nem szimmetrikus (csak pozitív értékeket vesz fel, jobbra ferde).`,
            "Mert két szórást hasonlítunk össze.",
            R`Mert a $\chi^2$-eloszlás csak nagy $n$-nél használható.`,
            R`Nem kell: ugyanúgy $\pm 1{,}96$ a határ, mint az u-próbánál.`
          ],
          answer: 0,
          hint: R`Rajzold le a $\chi^2_{10}$ sűrűségfüggvényét. Van-e negatív értéke? Tükrös-e?`,
          explain: R`A $\chi^2$ szórásnégyzetből számolt, nem negatív mennyiség, és az eloszlása jobbra ferde: a két farok nem egymás tükörképe. Ezért kell külön $\chi^2_{n-1;\,\alpha/2}$ és $\chi^2_{n-1;\,1-\alpha/2}$ (pl. $df = 10$-nél 3,25 és 20,48). Egy szórást vetünk egy előírt értékhez – két szórás az F-próba. A $\pm 1{,}96$ a standard normálisé, itt nem érvényes.`
        },
        {
          type: "single", shuffle: true,
          q: R`F-próba két szórásra: $s_1 = 5$ ($n_1 = 9$), $s_2 = 10$ ($n_2 = 16$). Mi a próbastatisztika és a szabadságfokok (számláló, nevező)?`,
          options: [
            R`$F = 4$, $df = (15, 8)$`,
            R`$F = 2$, $df = (15, 8)$`,
            R`$F = 0{,}25$, $df = (8, 15)$`,
            R`$F = 4$, $df = (8, 15)$`
          ],
          answer: 0,
          hint: "Melyik szórásnégyzet kerül a számlálóba? A szabadságfokok közül melyik az első?",
          explain: R`A nagyobb szórásnégyzet megy a számlálóba: $F = 100/25 = 4$. Az első szabadságfok a számlálóé: a 16 elemű mintából $16 - 1 = 15$, a nevezőé $9 - 1 = 8$. A 2 a szórások aránya (nem a négyzeteké). A 0,25-nél a kisebb került a számlálóba – a felső kvantilissel összevetve így sosem vetnéd el $H_0$-t. A $df = (8, 15)$ jó $F$ mellett is hibás sorrend: $F_{15,8} \ne F_{8,15}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gép 13 zacskójából $s_1 = 8$ g, B gép 11 zacskójából $s_2 = 4$ g. Normális töltés, kétoldali 5%, $F_{12,10;\,0{,}975} = 3{,}62$. Mi a döntés?`,
          options: [
            R`$F = 4 \ge 3{,}62$ → elvetjük: a két gép pontossága különbözik.`,
            R`$F = 2 \lt 3{,}62$ → nem vetjük el.`,
            R`$F = 0{,}25 \lt 3{,}62$ → nem vetjük el.`,
            R`$F = 2 \ge 1{,}96$ → elvetjük.`
          ],
          answer: 0,
          hint: "Szórásnégyzetek aránya, a nagyobb felül – és az F-eloszlás kvantilisével vesd össze, ne a normálissal.",
          explain: R`$F = 64/16 = 4 \ge 3{,}62$ → elvetjük ($p \approx 0{,}036$). Az $F = 2$ a szórások aránya – négyzet nélkül a próbastatisztika túl kicsi, és tévesen nem vetnénk el. A 0,25 a fordított hányados. Az 1,96 a standard normális kvantilise, az F-próbához semmi köze.`
        },
        {
          type: "multi",
          q: R`Szimuláció igaz $H_0$ mellett (egyenlő szórások), kétoldali 5%-os F-próba. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "Exponenciális (jobbra ferde) adaton csoportonként 100 fővel is kb. 31% a téves riasztás.",
            R`Csúcsos ($t_5$) adaton a téves riasztás a minta növelésével nő (13% → 22%).`,
            "Egyenletes eloszlású adaton a próba túl óvatos (kb. 0,3–1% téves riasztás).",
            R`$n \ge 30$-nál a centrális határeloszlás-tétel miatt a téves riasztás 5% körül van.`,
            "A Levene-próba a normalitásra még érzékenyebb, mint az F-próba."
          ],
          answer: [0, 1, 2],
          hint: "Az átlagot a CHT „megmenti” nagy mintán. Igaz ez a szórásnégyzet eloszlására is? Mitől függ annak ingadozása?",
          explain: R`Az első három a 8.6-c táblázatából jön: ferde és vastag farkú adaton az F-próba sokat riaszt, és <b>a minta növelésével romlik</b>; rövid farkú (egyenletes) adaton túl óvatos. A szórásnégyzet ingadozása a farkak vastagságától (negyedik momentum) függ, ezt a CHT nem javítja – a „nagy minta megoldja” a t-próbára igaz, az F-re nem. A Levene-próba épp azért ajánlott, mert <em>kevésbé</em> érzékeny a normalitásra.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két gép (13 és 11 zacskó, $s$ 6 és 4 g) F-próbája: $F = 2{,}25$, $p \approx 0{,}21$. Melyik a helyes megfogalmazás?`,
          options: [
            "Ennyi adatból nem mutatható ki különbség a két gép pontossága között.",
            "A két gép egyformán pontos.",
            "Bebizonyítottuk, hogy a két szórás egyenlő.",
            "Az A gép 1,5-szer pontatlanabb, ez szignifikáns."
          ],
          answer: 0,
          hint: "Mit jelent a „nem vetjük el” – és mit nem jelent?",
          explain: R`A nem-szignifikáns eredmény azt jelenti, hogy az adat összefér $H_0$-lal, nem azt, hogy $H_0$ igaz. Kis mintán a szórásnégyzet nagyon ingadozik, ezért egy másfélszeres szórásarány is belefér a véletlenbe – kimutatásához jóval több zacskó kellene. Az „egyformán pontos” és a „bebizonyítottuk” $H_0$ elfogadását mondja ki; a „szignifikáns” pedig ellentmond a $p = 0{,}21$-nek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két bolt várakozási ideje (erősen jobbra ferde), $n = 200$–200. Egyformán szóródnak-e a várakozási idők? Melyik próba?`,
          options: [
            "Levene-próba (vagy a mediánnal számolt Brown–Forsythe-változat).",
            "F-próba – 200 fős mintánál a normalitás nem számít.",
            "Welch-próba.",
            R`$\chi^2$-próba a szórásra.`
          ],
          answer: 0,
          hint: "Két szórás összehasonlítása – de mi az F-próba feltétele, és segít-e rajta a nagy minta?",
          explain: R`Két szórást kell összevetni, de az adat ferde: az F-próba itt nagy mintán is sokszor riaszt tévesen (exponenciálisnál kb. 31%). A Levene-próba az átlagtól (mediántól) mért abszolút eltérésekre végez átlag-összehasonlítást, ezért robusztus. A Welch-próba az átlagokat hasonlítja, nem a szórásokat. A $\chi^2$-próba egy szórást vet össze egy előírt értékkel – és az is normalitást kíván.`
        }
      ]
    },

    /* ------------------------------------------------ 8.7 */
    "ms8-87": {
      title: "Kvíz – 8.7 Arányok próbái",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$H_0$: $p = 0{,}2$. Egy 400 fős mintában 100 „igen” ($\hat p = 0{,}25$). Mennyi a $z$?`,
          options: [R`$z = 2{,}5$`, R`$z \approx 2{,}31$`, R`$z \approx 2{,}24$`, R`$z = 0{,}125$`],
          answer: 0,
          hint: R`A próbát $H_0$ feltételezésével végezzük: melyik arány kerül a standard hibába, $p_0$ vagy $\hat p$? És ne felejtsd az $n$-nel osztást.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}2 \cdot 0{,}8/400} = 0{,}02$, $z = 0{,}05/0{,}02 = 2{,}5$ (kétoldali $p \approx 0{,}012$). A 2,31 $\hat p$-vel számolja az SE-t ($\sqrt{0{,}25 \cdot 0{,}75/400}$) – az a KI-é, nem a próbáé. A 2,24 kihagyja az $(1 - p_0)$ tényezőt ($\sqrt{0{,}2/400}$). A 0,125 az egyetlen megfigyelés szórásával, $\sqrt{0{,}16} = 0{,}4$-del oszt, nem a standard hibával.`
        },
        {
          type: "multi",
          q: R`Melyik esetben <b>nem</b> használható egy arány z-próbája (normális közelítés), és pontos binomiális próba kell? (Több jó válasz is lehet.)`,
          options: [
            R`$n = 50$, $p_0 = 0{,}1$`,
            R`$n = 200$, $p_0 = 0{,}04$`,
            R`$n = 1000$, $p_0 = 0{,}995$`,
            R`$n = 400$, $p_0 = 0{,}15$`,
            R`$n = 100$, $p_0 = 0{,}5$`
          ],
          answer: [0, 1, 2],
          hint: R`Számold ki mindkét várt gyakoriságot: $np_0$ és $n(1 - p_0)$. Mindkettőnek legalább 10-nek kell lennie.`,
          explain: R`$50 \cdot 0{,}1 = 5$, $200 \cdot 0{,}04 = 8$ – kevés várt „igen”. Az $n = 1000$, $p_0 = 0{,}995$ esetben $np_0 = 995$ rendben, de $n(1 - p_0) = 5$: kevés a várt „nem” – a feltétel <em>mindkét</em> gyakoriságra vonatkozik, a nagy $n$ önmagában nem elég. A $400 \cdot 0{,}15 = 60$ és 340, illetve az 50–50 rendben van.`
        },
        {
          type: "single", shuffle: true,
          q: R`NGA selejtpélda: megengedett selejtarány 2%, 70 csavarból 3 selejtes. Melyik a helyes eljárás?`,
          options: [
            R`Pontos binomiális próba: $P(X \ge 3 \mid n = 70,\ p = 0{,}02) \approx 0{,}165$ → nem vetjük el.`,
            R`z-próba $p_0$-lal: $z \approx 1{,}37$ → nem vetjük el.`,
            R`z-próba $\hat p$-vel és $n - 1$-gyel: $z \approx 0{,}94$ → nem vetjük el.`,
            R`z-próba $\hat p$-vel és $n$-nel: $z \approx 0{,}94$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Mielőtt képletet választasz: mennyi itt $np_0$?`,
          explain: R`$np_0 = 70 \cdot 0{,}02 = 1{,}4$ – messze 10 alatt, a normális közelítés nem használható, a pontos binomiális próba kell ($p \approx 0{,}165$). A $z \approx 1{,}37$ a „szokásos” képlet helyes alkalmazása, de itt a feltétele nem teljesül. A könyv $z = 0{,}942$-je két hibát halmoz: $\hat p$ és $n - 1$ az SE-ben. A $\hat p$-vel és $n$-nel számolt változat ugyanúgy hibás. Mindegyik „nem vetjük el” – a döntés véletlenül ugyanaz, a módszer nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`A/B-teszt: A változat 100 látogatójából 30, B változat 200 látogatójából 90 vásárolt. Mennyi az összevont arány, $\hat p$?`,
          options: [R`$0{,}4$`, R`$0{,}375$`, R`$0{,}6$`, R`$0{,}15$`],
          answer: 0,
          hint: R`Összes „igen” osztva az összes látogatóval – nem a két arány átlaga.`,
          explain: R`$\hat p = (30 + 90)/(100 + 200) = 120/300 = 0{,}4$. A 0,375 a két arány (0,30 és 0,45) egyszerű átlaga – eltérő csoportméretnél ez nem a közös arány becslése. A 0,6 $= 120/200$ csak az egyik csoport méretével oszt. A 0,15 a két arány különbsége, a próbastatisztika számlálója.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanitt (30/100 vs 90/200, összevont $\hat p = 0{,}4$) mennyi a két arány z-próbájának statisztikája?`,
          options: [R`$z = 2{,}5$`, R`$z \approx 2{,}60$`, R`$z \approx 1{,}85$`, R`$z \approx 5{,}30$`],
          answer: 0,
          hint: R`$\mathrm{SE} = \sqrt{\hat p(1 - \hat p)(1/n_1 + 1/n_2)}$ az összevont aránnyal.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}4 \cdot 0{,}6 \cdot (1/100 + 1/200)} = \sqrt{0{,}0036} = 0{,}06$, $z = 0{,}15/0{,}06 = 2{,}5$ ($p \approx 0{,}012$). A 2,60 a két arányt külön használja az SE-ben – az a KI képlete; a próbánál $H_0$ mellett a közös arány a legjobb becslés. Az 1,85 a két SE-t adja össze ($0{,}046 + 0{,}035$) a szórásnégyzetek helyett. Az 5,30 a teljes $n = 300$-zal egyszer oszt ($\sqrt{0{,}24/300}$), mintha egyetlen minta lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért a két arányt <em>külön</em> használjuk a különbség konfidencia-intervallumában, és nem az összevont arányt?`,
          options: [
            "Mert a KI nem tételezi fel, hogy a két arány egyenlő – épp a különbségüket becsüljük.",
            "Mert az összevont arány csak egyforma csoportméretnél számolható.",
            "Mert a KI-nél nagyobb SE kell, és a külön számolt mindig nagyobb.",
            "Mert az összevont arány csak kétoldali próbánál érvényes."
          ],
          answer: 0,
          hint: R`Az összevont arány melyik hipotézisből következik? Van-e hipotézis a KI-nél?`,
          explain: R`Az összevont arány $H_0$-ból jön: ha $p_1 = p_2$, egyetlen közös arány van. A KI-nél nincs $H_0$ – egy (lehet, hogy nem nulla) különbséget becsülünk, így a két arányt külön kell használni. Az összevont arány bármilyen csoportméretnél számolható. A külön SE nem mindig nagyobb (az A/B-példában 0,0340 vs 0,0342). Az egyoldali próbánál is összevont arányt használunk.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mindkét oldal valódi vásárlási aránya 10%. Változatonként 100 látogatónként megnézed a $z$-próbát 2000-ig (20 belenézés), és leállsz, ha $p \lt 0{,}05$. Kb. a kísérletek hány százalékában lesz valamikor „szignifikáns” az eredmény?`,
          options: ["kb. 25%", "kb. 5%", "kb. 64%", "kb. 0,25%"],
          answer: 0,
          hint: "Minden belenézés újabb esély a téves riasztásra – de független-e a 20 belenézés?",
          explain: R`A szimuláció szerint kb. 25% – ötször annyi, mint az $\alpha = 5\%$. Az 5% csak egyetlen, a végén elvégzett próbára igaz. A 64% $= 1 - 0{,}95^{20}$ 20 <em>független</em> próbáé; a belenézések viszont összefüggnek (a későbbi adat tartalmazza a korábbit), ezért kevesebb. A 0,25% $= 0{,}05/20$ a Bonferroni-küszöb, nem a téves riasztás aránya.`
        },
        {
          type: "multi",
          q: R`Melyik eljárás tartja az elsőfajú hibát legfeljebb 5%-on egy A/B-tesztben? (Több jó válasz is lehet.)`,
          options: [
            "Előre rögzített mintanagyság (erőtervezés), és egyetlen próba a végén.",
            R`5 tervezett időközi elemzés, mindegyiknél $0{,}05/5 = 0{,}01$-es küszöb (Bonferroni).`,
            "Szekvenciális próba („alfa-költés”), amely minden belenézésre kisebb küszöböt ad.",
            "Naponta ránézni, és az első szignifikáns eredménynél leállni.",
            "Ha még nem szignifikáns, addig futtatni, amíg az nem lesz."
          ],
          answer: [0, 1, 2],
          hint: "Melyik eljárás számol a belenézések számával – és melyik ad minden belenézéskor újabb 5%-os esélyt a téves riasztásra?",
          explain: R`Az előre rögzített $n$ egyetlen próbával pontosan $\alpha$-t ad. A Bonferroni-küszöb (óvatosan) és a szekvenciális módszerek (kevésbé szigorúan, a belenézések összefüggését kihasználva) szintén kordában tartják a teljes hibát. A „leállás az első szignifikánsnál” és a „futtassuk, amíg szignifikáns nem lesz” ugyanaz a hiba két irányból: többszörös tesztelés, a tényleges hiba jóval 5% fölött.`
        }
      ]
    },

    /* ------------------------------------------------ 8.8 */
    "ms8-88": {
      title: "Kvíz – 8.8 Erő és mintanagyság két csoport összehasonlításához",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két csoport, $\sigma = 10$, valódi különbség $\Delta = 4$, csoportonként $n = 50$, kétoldali 5%. Mennyi a próba ereje (normális közelítés)?`,
          options: [R`$\approx 0{,}52$`, R`$\approx 0{,}81$`, R`$\approx 0{,}64$`, R`$\approx 0{,}48$`],
          answer: 0,
          hint: R`Erő $\approx \Phi\!\left(\Delta/\mathrm{SE} - z_{1-\alpha/2}\right)$. Két csoport különbségének SE-je: $\sigma\sqrt{2/n}$.`,
          explain: R`$\mathrm{SE} = 10\sqrt{2/50} = 2$, erő $\approx \Phi(4/2 - 1{,}96) = \Phi(0{,}04) \approx 0{,}52$ – alig jobb a pénzfeldobásnál. A 0,81 az egy átlagra vonatkozó $\sigma/\sqrt n \approx 1{,}41$-gyel számol – elfelejti a $\sqrt 2$-t. A 0,64 egyoldali kvantilist (1,645) használ kétoldali próbához. A 0,48 a másodfajú hiba, $\beta = 1 - \text{erő}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány fő kell <b>csoportonként</b> $d = 0{,}4$ kimutatásához 80%-os erővel, kétoldali 5%-on? ($(1{,}96 + 0{,}842)^2 \approx 7{,}85$)`,
          options: ["99", "50", "198", "78"],
          answer: 0,
          hint: R`$n = 2\left(\dfrac{z_{1-\alpha/2} + z_{1-\beta}}{d}\right)^2$ csoportonként – és mindig felfelé kerekítünk.`,
          explain: R`$n = 2 \cdot 7{,}85/0{,}16 \approx 98{,}1$ → 99 fő csoportonként (t-eloszlással számoló szoftver 100-at ad). Az 50 kihagyja a 2-es szorzót – az az egymintás képlet. A 198 a két csoport együtt: a képlet csoportonkénti létszámot ad. A 78 egyoldali kvantilissel (1,645) számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálathoz $\Delta = 4$ kimutatására 60 fő kell csoportonként. Hány kell, ha feleakkora, $\Delta = 2$ különbséget akarsz ugyanakkora erővel kimutatni?`,
          options: ["240", "120", "85", "30"],
          answer: 0,
          hint: R`Hogyan függ az $n$ a $\Delta$-tól a mintanagyság képletében?`,
          explain: R`$n \propto 1/\Delta^2$: feleakkora hatás → négyszer akkora minta, $4 \cdot 60 = 240$. A 120 lineáris arányosságot feltételez („kétszer akkora”) – a leggyakoribb hiba. A 85 $\approx 60\sqrt 2$ a négyzetgyökös skálát keveri bele. A 30 fordított irány: kisebb hatáshoz nem kevesebb, hanem több adat kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Lehr-szabály (kétoldali 5%, 80% erő): hány fő kell csoportonként $d = 0{,}25$-höz?`,
          options: ["256", "64", "128", "512"],
          answer: 0,
          hint: R`$n \approx 16/d^2$ csoportonként.`,
          explain: R`$16/0{,}25^2 = 16/0{,}0625 = 256$ fő csoportonként (ez épp a vérnyomás-példa $d = 3/12$-je – a pontos képlet 252-t ad). A 64 $= 16/d$ elfelejti a négyzetet. A 128 $= 8/d^2$ kihagyja a két csoport miatti 2-es szorzót. Az 512 a teljes létszám – a szabály csoportonkénti $n$-et ad.`
        },
        {
          type: "multi",
          q: R`A/B-tesztek mintanagysága (kétoldali 5%, 80% erő). Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "10% → 15%-hoz változatonként kb. 686, összesen kb. 1372 látogató kell.",
            "20% → 25%-hoz több látogató kell, mint 10% → 15%-hoz (kb. 1094 változatonként).",
            "10% → 12% kimutatásához nagyságrendileg kb. hatszor annyi adat kell, mint 10% → 15%-hoz.",
            "Ugyanakkora (5 százalékpontos) javuláshoz mindig ugyanakkora minta kell, bármekkora is az alapráta.",
            "A 686 a két változat együttes létszáma."
          ],
          answer: [0, 1, 2],
          hint: R`Arányoknál a szórás a $p$-ből jön: hol nagyobb a $p(1 - p)$, 10% vagy 20% körül? És csoportonkénti vagy teljes $n$-et ad a képlet?`,
          explain: R`A képlet változatonkénti $n$-et ad: 686, összesen 1372. 20% körül nagyobb a $p(1-p)$, tehát a zaj, ezért ugyanahhoz az 5 százalékponthoz több adat kell (1094) – vagyis nem igaz, hogy az alapráta mindegy. A 2 százalékpont kb. $(5/2)^2 \approx 6$-szor annyi adatot kér (a pontos arány kb. 5,6, mert a $p(1-p)$ is változik).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálathoz csoportonként 200 kiértékelhető beteg kell, de várhatóan 20% kiesik. Hány beteget toborozz csoportonként?`,
          options: ["250", "240", "220", "160"],
          answer: 0,
          hint: R`A toborzottak 80%-a marad bent – hány ember 80%-a a 200?`,
          explain: R`$200/0{,}8 = 250$; ebből 20% (50 fő) kiesve épp 200 marad. A 240 $= 200 \cdot 1{,}2$: a 240-ből 20% kiesve csak 192 marad. A 220 csak 10%-kal számol. A 160 $= 200 \cdot 0{,}8$ – a kiesést levonja, ahelyett hogy pótolná.`
        },
        {
          type: "single", shuffle: true,
          q: R`Páros terv: a különbségek szórása $\sigma_d = 5$, a keresett hatás $\Delta = 2$, kétoldali 5%, 80% erő. Hány <b>pár</b> kell? (Egymintás képlet: $n = \left(\frac{z_{1-\alpha/2} + z_{1-\beta}}{\Delta/\sigma_d}\right)^2$, $1{,}96 + 0{,}842 \approx 2{,}80$)`,
          options: ["50", "99", "39", "7"],
          answer: 0,
          hint: R`Páros tervnél a különbségekre egymintás próba fut – nincs két csoport, nincs 2-es szorzó.`,
          explain: R`$n = (2{,}80 \cdot 5/2)^2 = 7^2 = 49{,}06$ → 50 pár. A 99 a kétcsoportos képlet 2-es szorzóval – a páros tervben a különbségek egyetlen mintát alkotnak. A 39 egyoldali kvantilissel (1,645) számol. A 7 elfelejti a négyzetre emelést.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy A/B-teszt nem lett szignifikáns. A vezető: „A megfigyelt különbséggel számolt erő csak 30% volt, tehát nem tudhatjuk.” Mi a gond az érveléssel?`,
          options: [
            "A megfigyelt hatással számolt utólagos erő a p-értékből következik (nem-szignifikánsnál mindig kicsi), új információt nem ad; az erőt előre, a minimális érdekes hatásra kell számolni, utólag a KI a tájékoztató.",
            "Semmi: az utólagos erő a megfigyelt hatással a legjobb módja annak, hogy értékeljük a vizsgálatot.",
            "Az erőt csak szignifikáns eredménynél szabad kiszámolni.",
            "A 30%-os erő azt jelenti, hogy 70% eséllyel igaz a nullhipotézis."
          ],
          answer: 0,
          hint: "Ha a megfigyelt különbséget teszed a $\\Delta$ helyére, honnan jön minden szám az erőképletben?",
          explain: R`A megfigyelt hatással számolt („post hoc”) erő a p-érték átfogalmazása: ugyanabból az adatból jön, és nem-szignifikáns eredménynél mindig kicsi. Az erő tervezési eszköz: a <em>még érdekes</em> hatásra, előre kell kiszámolni. Utólag a különbség KI-je mutatja meg, mekkora hatások férnek bele az adatba. Az erő nem $H_0$ valószínűsége: $1 - \text{erő} = \beta$ annak esélye, hogy egy <em>adott</em> valódi hatást elszalasztunk.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms8-final": {
      title: "Fejezetzáró teszt – 8. Paraméteres próbák",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy gép szórása régóta $\sigma = 12$ g. 36 zacskó átlaga $\bar x = 96$ g, $H_0$: $\mu = 100$, kétoldali próba. Mi a döntés 5%-os és 1%-os szinten?`,
          options: [
            R`$z = -2$; 5%-on elvetjük, 1%-on nem.`,
            R`$z \approx -0{,}33$; egyik szinten sem vetjük el.`,
            R`$z = -2$; egyik szinten sem vetjük el, mert $|z| \lt 2{,}576$.`,
            R`$z = -12$; mindkét szinten elvetjük.`
          ],
          answer: 0,
          hint: R`u-próba: $\mathrm{SE} = \sigma/\sqrt n$. Kétoldali kritikus értékek: 1,96 (5%) és 2,576 (1%).`,
          explain: R`$\mathrm{SE} = 12/6 = 2$, $z = -4/2 = -2$; $|z| \ge 1{,}96$, de $\lt 2{,}576$ → 5%-on elvetjük ($p \approx 0{,}046$), 1%-on nem. A $-0{,}33$ $\sigma$-val oszt $\sigma/\sqrt n$ helyett. Az „egyik szinten sem” az 1%-os kritikus értéket (2,576) használja az 5%-os próbához is. A $-12$ $\sigma/n$-nel oszt $\sigma/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gép, ismert szórásokkal: $\sigma_1 = 6$, $n_1 = 36$; $\sigma_2 = 8$, $n_2 = 16$. Mennyi az átlagok különbségének standard hibája?`,
          options: [R`$\sqrt 5 \approx 2{,}24$`, R`$3$`, R`$\sqrt 3 \approx 1{,}73$`, R`$1$`],
          answer: 0,
          hint: R`Az egyes átlagok SE-je 1 és 2. Mi adódik össze különbségnél: a szórások vagy a szórásnégyzetek? És kivonódik-e valami?`,
          explain: R`$\sqrt{36/36 + 64/16} = \sqrt{1 + 4} = \sqrt 5 \approx 2{,}24$ – a szórásnégyzetek adódnak össze, különbségnél is. A 3 a két SE összege (1 + 2). Az $\sqrt 3 = \sqrt{4 - 1}$ kivonja a szórásnégyzeteket, mert „különbséget nézünk”. Az 1 $= 2 - 1$ a szórásokat vonja ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ismeretlen szórás: 9 zacskó, $\bar x = 96$, $s = 6$, $H_0$: $\mu = 100$, kétoldali 5%. ($t_{8;\,0{,}975} = 2{,}306$, $t_{9;\,0{,}975} = 2{,}262$) Mi a döntés?`,
          options: [
            R`$t = -2$, $df = 8$, $|t| \lt 2{,}306$ → nem vetjük el.`,
            R`$t = -2$, $|t| \ge 1{,}96$ → elvetjük.`,
            R`$t = -2$, $df = 9$, $|t| \lt 2{,}262$ → nem vetjük el.`,
            R`$t \approx -0{,}67$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Egymintás t-próba: $\mathrm{SE} = s/\sqrt n$, $df = n - 1$. A kvantilis a t-eloszlásé, nem a normálisé.`,
          explain: R`$\mathrm{SE} = 6/3 = 2$, $t = -2$, $df = 8$; $2 \lt 2{,}306$ → nem vetjük el ($p \approx 0{,}08$). Az 1,96 a $z$-kvantilis: kis mintán a $t$ vastagabb farka beárazza, hogy $s$ is bizonytalan – $z$-vel tévesen elvetnénk. A $df = 9$ $n$-nel számol $n - 1$ helyett. A $-0{,}67$ $s$-sel oszt $s/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`5 dolgozó teljesítménye betanítás előtt és után; a különbségek: 4, 6, 2, 5, 3. Mennyi a páros t-próba statisztikája és szabadságfoka?`,
          options: [
            R`$t \approx 5{,}66$, $df = 4$`,
            R`$t \approx 6{,}32$, $df = 4$`,
            R`$t \approx 5{,}66$, $df = 5$`,
            R`$t \approx 2{,}53$, $df = 4$`
          ],
          answer: 0,
          hint: R`$\bar d = 4$. Az $s_d^2$-nél $n - 1$-gyel osztasz, aztán $\mathrm{SE} = s_d/\sqrt n$; $df$ = a párok száma mínusz 1.`,
          explain: R`Eltérések négyzetösszege $0 + 4 + 4 + 1 + 1 = 10$, $s_d^2 = 10/4 = 2{,}5$, $s_d \approx 1{,}58$, $\mathrm{SE} \approx 0{,}707$, $t = 4/0{,}707 \approx 5{,}66$, $df = 4$ ($p \approx 0{,}005$). A 6,32 $n$-nel osztva számolja $s_d^2$-et (2), ezért kisebb SE-t kap. A $df = 5$ a párok száma, nem $n - 1$. A 2,53 $s_d$-vel oszt $s_d/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`5 fős csoport ($s = 10$) és 20 fős csoport ($s = 3$), az átlagkülönbség 6. Közös szórásos t-próba: $p \approx 0{,}024$; Welch: $p \approx 0{,}25$. Melyikben bízz?`,
          options: [
            "A Welch-próbában: a közös szórásos próba itt alábecsüli az SE-t, és igaz H₀ mellett kb. 28%-ban riaszt 5% helyett.",
            "A közös szórásos próbában, mert nagyobb a szabadságfoka (23).",
            "Egyikben sem: ilyenkor a két p-érték átlaga (kb. 0,14) a jó.",
            "A közös szórásos próbában, mert az szignifikáns, a Welch pedig túl óvatos."
          ],
          answer: 0,
          hint: "Melyik csoport szórása a nagyobb, és melyik csoport „húzza” a közös szórásnégyzetet?",
          explain: R`A közös $s_p^2 \approx 24{,}8$ a nagy, kis szórású csoport 9-e felé húz, így a kis csoport valódi $100/5 = 20$-as varianciatagja helyett kb. 5 kerül a képletbe: SE 2,49 a Welch 4,52-je helyett. Szimuláció szerint a közös próba ilyenkor kb. 28%-ban riaszt tévesen, a Welch kb. 5%-ban. A nagy $df$ nem pótolja a rossz SE-t, a p-értékek átlagolásának nincs értelme, és a „szignifikáns, tehát jobb” a kívánt eredmény szerinti válogatás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gép: $s_1 = 9$ ($n_1 = 16$), $s_2 = 6$ ($n_2 = 21$). Az F-próba statisztikája és szabadságfokai?`,
          options: [
            R`$F = 2{,}25$, $df = (15, 20)$`,
            R`$F = 1{,}5$, $df = (15, 20)$`,
            R`$F \approx 0{,}44$, $df = (20, 15)$`,
            R`$F = 2{,}25$, $df = (20, 15)$`
          ],
          answer: 0,
          hint: "Szórásnégyzetek aránya, a nagyobb a számlálóban; az első szabadságfok a számlálóé.",
          explain: R`$F = 81/36 = 2{,}25$, $df = (16 - 1, 21 - 1) = (15, 20)$; $F_{15,20;\,0{,}975} = 2{,}57$, így kétoldali 5%-on nem vetnénk el ($p \approx 0{,}09$). Az 1,5 a szórások aránya. A 0,44 a kisebbet teszi a számlálóba. A $(20, 15)$ felcseréli a szabadságfokok sorrendjét.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy felmérésben 900-ból 486 „igen” ($\hat p = 0{,}54$). Eltér-e a támogatottság 50%-tól? Mennyi a $z$ és a kétoldali p-érték?`,
          options: [
            R`$z = 2{,}4$; $p \approx 0{,}016$`,
            R`$z = 2{,}4$; $p \approx 0{,}008$`,
            R`$z = 2{,}4$; $p \approx 0{,}992$`,
            R`$z = 0{,}08$; $p \approx 0{,}94$`
          ],
          answer: 0,
          hint: R`$\mathrm{SE} = \sqrt{p_0(1 - p_0)/n}$. Kétoldali kérdésnél mindkét farok számít.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}25/900} = 1/60 \approx 0{,}0167$, $z = 0{,}04/0{,}0167 = 2{,}4$; kétoldali $p = 2 \cdot (1 - \Phi(2{,}4)) \approx 0{,}016$ → 5%-on elvetjük. A 0,008 egyetlen farok – kétoldali kérdésnél elfelejtett duplázás. A 0,992 $= \Phi(2{,}4)$, a farok helyett a „test”. A 0,08 a $\sqrt{p_0(1-p_0)} = 0{,}5$ egyedi szórással oszt, nem az SE-vel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató $d = 0{,}3$ hatást akar kimutatni két csoport között (kétoldali 5%, 80% erő). A Lehr-szabály szerint kb. hány fő kell csoportonként?`,
          options: ["178", "53", "356", "89"],
          answer: 0,
          hint: R`$n \approx 16/d^2$ csoportonként.`,
          explain: R`$16/0{,}09 \approx 177{,}8$ → kb. 178 fő csoportonként (a pontos $z$-képlet 175-öt ad). Az 53 $= 16/d$ elfelejti a négyzetet. A 356 a két csoport együtt. A 89 $= 8/d^2$ kihagyja a két csoport miatti 2-es szorzót.`
        },
        {
          type: "multi",
          q: R`Születési súly és dohányzás (ncbirths): különbség 0,40 font, Welch-próba $p \approx 0{,}12$, 95%-os KI $[-0{,}11;\ 0{,}91]$ font. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "A KI-be a nulla és egy majdnem 1 fontos különbség is belefér.",
            "A vizsgálat ereje egy valódi 0,4 fontos különbségre csak kb. 34% volt, ezért a nem-szignifikáns eredmény keveset mond.",
            "Welch-próba azért, mert két független csoport, eltérő szórásokkal és csoportméretekkel.",
            "Kimutattuk, hogy a dohányzás nem befolyásolja a születési súlyt.",
            "Páros t-próba kellett volna, mert mindkét csoport újszülöttekből áll."
          ],
          answer: [0, 1, 2],
          hint: "Mit jelent a „nem vetjük el” – és párosítható-e egy dohányzó anya újszülöttje egy nem dohányzóéval?",
          explain: R`A KI $-0{,}11$ és $0{,}91$ között van: a nulla is, a jelentős hatás is összefér az adattal. Az erő kb. 34% – a vizsgálat kétharmad eséllyel elszalasztaná a 0,4 fontos hatást, így a „nem szignifikáns ≠ nincs hatás” (nagyobb adatbázisok ki is mutatják). A csoportok különböző anyák – független minták, eltérő szórással és méretekkel, ezért Welch. A páros próbához ugyanazon egységen két mérés (vagy valódi párok) kellene; az, hogy mindkét csoport újszülött, ehhez nem elég.`
        },
        {
          type: "match",
          q: R`Melyik próba kell? Párosítsd a helyzeteket a próbákkal!`,
          pairs: [
            ["Kávéautomata: 10 pohár átlaga és szórása, a gyártó 2 dl-t ígér.", "egymintás t-próba"],
            ["15 futó idejét mérik a régi és az új cipőben is.", "páros t-próba"],
            ["Két gyár csavarátmérőjének pontossága, a QQ-ábrák egyenesek.", "F-próba"],
            ["Hírlevél két tárgysora 5000–5000 címre, a megnyitások száma.", "két arány z-próbája"],
            ["Egy gép régóta ismert, 10 g-os szórással; 25 zacskó átlaga.", "egymintás u-próba"],
            ["Két bolt erősen ferde várakozási idejének szóródása.", "Levene-próba"]
          ],
          hint: "Először: arány vagy mért érték? Átlag vagy szórás a kérdés? Hány minta, független vagy páros? Ismert-e a szórás? Normális-e az adat?",
          explain: R`Kávéautomata: egy átlag, a szórást a mintából becsüljük → egymintás t. Futók: ugyanazon személyen két mérés → páros t a különbségekre. Csavarok: két szórás, normális adat → F-próba. Hírlevél: igen/nem kimenet két csoportban → két arány z-próbája összevont aránnyal. Ismert szórású gép, egy átlag → u-próba. Ferde adat szórása: az F-próba nagy mintán is sokat riasztana → Levene-próba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy A/B-teszt felelőse naponta ránéz az eredményre, és a 6. napon „$p = 0{,}04$, szignifikáns!” felkiáltással leállítja. Mi a helyes értékelés?`,
          options: [
            "Hat próbát végzett, a tényleges elsőfajú hiba jóval 5% fölött van; előre rögzített mintanagyság és egyetlen végső próba (vagy szekvenciális módszer) kellett volna.",
            R`Rendben van: $0{,}04 \lt 0{,}05$, a döntés helyes.`,
            "Csak akkor gond, ha az utolsó napokban csökkent a p-érték.",
            R`A $p = 0{,}04$-et 6-tal osztva kapjuk a valódi p-értéket.`
          ],
          answer: 0,
          hint: "Hány esélye volt a téves riasztásra? Mikor és hogyan kellett volna eldönteni a leállást?",
          explain: R`Minden belenézés újabb próba – 20 belenézésnél például kb. 25% a téves riasztás 5% helyett, hatnál is jóval 5% fölött. A $p \lt 0{,}05$ csak egyetlen, előre tervezett próbánál jelenti az 5%-os hibát. A p-érték útja ezt nem változtatja meg. Bonferroni-korrekciónál a <em>küszöböt</em> osztjuk ($0{,}05/6$), nem a p-értéket – és ezt is előre kell tervezni.`
        },
        {
          type: "multi",
          q: R`Betanítási módszer, két terv: (a) ugyanaz a 6 dolgozó előtte–utána, páros t-próba, $p \approx 0{,}023$; (b) 8 + 8 dolgozó véletlen beosztással, kétmintás t-próba, $p \approx 0{,}023$. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "Az előtte–utána terv kontrollcsoport nélkül nem mondja meg, hogy a javulást a betanítás okozta-e (lehet a teszt ismétlése is).",
            "A véletlen beosztású kétcsoportos terv oksági következtetést is megenged.",
            "Az előtte–utána adatot két független mintaként elemezve sokkal nagyobb p-t kapnánk (kb. 0,68).",
            "A két terv egyforma p-értéke miatt mindkettő ugyanolyan erős bizonyíték az okságra.",
            "A páros adatra a Welch-próba lenne a helyes, mert a szórások ismeretlenek."
          ],
          answer: [0, 1, 2],
          hint: "Mi különbözteti meg a kísérletet a megfigyeléstől? És mi tűnik el a páros elemzésben, ha függetlenként számolsz?",
          explain: R`Előtte–utána terv kontroll nélkül: a javulás jöhet a teszt ismétléséből is. A véletlen beosztás miatt a (b) terv csoportjai csak a módszerben különböznek, így okságra is lehet következtetni. Ha a páros adatot függetlenként elemeznénk, a személyek közti nagy szóródás a „zajba” kerülne: $p \approx 0{,}68$. Az egyforma p-érték nem jelent egyforma tervet. A Welch-próba független mintákra való – páros adatra a különbségek egymintás (páros) t-próbája kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Előírt szórás 10 g; 25 csomagból $s = 14$ g. Eltér-e a szórás az előírttól (kétoldali 5%, $\chi^2_{24;\,0{,}025} = 12{,}40$, $\chi^2_{24;\,0{,}975} = 39{,}36$, normális töltés)?`,
          options: [
            R`$\chi^2 = 47{,}04 \ge 39{,}36$ → elvetjük.`,
            R`$\chi^2 = 33{,}6$, a két határ között → nem vetjük el.`,
            R`$\chi^2 = 49 \ge 39{,}36$ → elvetjük.`,
            R`$\chi^2 \approx 12{,}24 \le 12{,}40$ → elvetjük, mert kisebb a szórás.`
          ],
          answer: 0,
          hint: R`$\chi^2 = (n - 1)s^2/\sigma_0^2$ – szórásnégyzetekkel, $n - 1$-gyel, és a minta szórásnégyzete a számlálóban.`,
          explain: R`$\chi^2 = 24 \cdot 196/100 = 47{,}04 \ge 39{,}36$ → elvetjük ($p \approx 0{,}007$): a szórás nagyobb az előírtnál. A 33,6 $= 24 \cdot 14/10$ négyzet nélkül számol, és tévesen nem vet el. A 49 $= 25 \cdot 196/100$ $n$-nel szoroz (itt a döntés véletlenül azonos, a statisztika nem). A 12,24 fordítva osztja a szórásnégyzeteket, és a szórás <em>csökkenésére</em> következtetne. Fontos: a $\chi^2$-próba a normalitásra érzékeny, nagy mintán is.`
        }
      ]
    },

}; })();
