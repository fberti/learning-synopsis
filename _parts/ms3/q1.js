    /* ------------------------------------------------ 3.1 */
    "ms3-31": {
      title: "Kvíz – 3.1 A kapcsolatok fajtái",
      questions: [
        {
          type: "match",
          q: "Milyen a kapcsolat a két változó között? Párosítsd!",
          pairs: [
            ["egy négyzet oldalhossza és területe", "függvényszerű"],
            ["a napi edzésidő és a nyugalmi pulzus", "sztochasztikus"],
            ["két különböző pénzérmével dobott eredmény", "független"],
            ["a hőmérséklet Celsius-fokban és Kelvinben", "függvényszerű"],
            ["a szülők és a felnőtt gyermekük testmagassága", "sztochasztikus"]
          ],
          hint: "Kérdezd meg magadtól: ha tudom az egyiket, pontosan tudom a másikat, csak valamennyit tudok róla, vagy semmit?",
          explain: R`A négyzet területe $T = a^2$, a Kelvin-fok $K = C + 273{,}15$ – az egyik <b>egyértelműen</b> meghatározza a másikat, tehát függvényszerű (a terület nem lineáris, de attól még függvényszerű). Az edzésidő és a pulzus, illetve a szülők és a gyerek magassága <b>általában</b> együtt mozog, de sok más tényező is számít – ez sztochasztikus. A két érme egymásról semmit sem árul el: független.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "A sztochasztikus kapcsolat lehet nagyon szoros is.",
            "A függvényszerű kapcsolat mindig lineáris.",
            R`Függetlenség esetén $Y$ eloszlása minden $X$-érték mellett ugyanaz.`,
            "Ha két változó együtt mozog, akkor az egyik biztosan okozza a másikat.",
            "A kapcsolat annál szorosabb, minél közelebb van a függvényszerűhöz."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj a három fokozatra (független – sztochasztikus – függvényszerű) és a szakasz buktató-dobozára.",
          explain: R`A sztochasztikus kapcsolat csak annyit jelent, hogy nem tökéletes – lehet nagyon szoros is (magasság és testsúly). A függvényszerű kapcsolat lehet görbe is ($T = \pi r^2$). Az együttmozgásból pedig nem következik ok-okozat: lehet, hogy egyik sem hat a másikra (lásd 3.7).`
        },
        {
          type: "single", shuffle: true,
          q: R`Legyen $Y = X^2$, ahol $X$ a $-2, -1, 1, 2$ értékeket veheti fel. Függvényszerűen függ-e $X$ az $Y$-tól?`,
          options: [
            R`Nem: $Y = 4$-ből nem tudjuk, hogy $X = -2$ vagy $X = 2$ volt.`,
            "Igen: a függvényszerű kapcsolat mindig kölcsönös.",
            R`Igen, mert $X = \sqrt{Y}$.`,
            R`Nem, mert $X$ és $Y$ között csak sztochasztikus kapcsolat van.`
          ],
          answer: 0,
          hint: R`Próbáld visszafelé: ha csak $Y$ értékét mondom meg, ki tudod-e találni $X$-et?`,
          explain: R`Az $Y$ függvényszerűen függ $X$-től ($X$ ismeretében $Y$ pontosan adódik), de visszafelé nem: $Y = 4$ mellett $X$ lehet $-2$ is és $2$ is. A függvényszerű kapcsolat <b>irányos</b> lehet; csak kölcsönösen egyértelmű függvénynél fordítható meg. Az $X = \sqrt{Y}$ elfelejti a negatív gyököt; a „sztochasztikus” pedig rossz, mert $X$-ből $Y$ pontosan kiszámolható.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kockával kétszer dobunk. $X$: az első dobás; $Y$: a két dobás összege. Milyen a kapcsolat $X$ és $Y$ között?`,
          options: [
            R`sztochasztikus: $X$ eltolja $Y$ eloszlását, de nem határozza meg`,
            "független: a kocka nem emlékszik az előző dobásra",
            R`függvényszerű: $Y$ az $X$-ből és a második dobásból képlettel adódik`,
            R`független, mert $Y$ a második dobástól is függ`
          ],
          answer: 0,
          hint: R`Ha tudod, hogy az első dobás 6, mit mondhatsz az összegről? És ha 1?`,
          explain: R`Ha $X = 1$, az összeg 2 és 7 közé esik; ha $X = 6$, 7 és 12 közé. $X$ tehát <b>változtat</b> $Y$ eloszlásán, de nem határozza meg – ez sztochasztikus kapcsolat. A „kocka nem emlékszik” az első és a <em>második</em> dobás viszonyára igaz, nem az első dobás és az összeg viszonyára. Függvényszerű akkor lenne, ha $Y$ <b>csak</b> $X$-től függne.`
        },
        {
          type: "match",
          q: "Melyik kapcsolattípus illik a változópárhoz? Párosítsd!",
          pairs: [
            ["kedvenc sportág és szemszín", "asszociáció"],
            ["nem (férfi / nő) és reakcióidő (ms)", "vegyes kapcsolat"],
            ["testsúly (kg) és vérnyomás (Hgmm)", "korreláció"],
            ["két zsűritag sorrendje 10 versenyzőről", "rangkorreláció"],
            ["munkakör (3 fajta) és havi kereset (ezer Ft)", "vegyes kapcsolat"]
          ],
          hint: "Döntsd el mindkét változóról: nominális, ordinális vagy metrikus (intervallum- / arányskála)?",
          explain: R`Két nominális (sportág, szemszín) → asszociáció. Nominális + metrikus (nem és reakcióidő, munkakör és kereset) → vegyes kapcsolat: csoportonként átlagot számolunk. Két metrikus (kg, Hgmm) → korreláció. Két rangsor → rangkorreláció.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató a 19 megyét 1-től 19-ig kódolta, és kiszámolta a megyekód és az átlagjövedelem Pearson-féle korrelációját: $r = 0{,}45$. Mit mondhatsz?`,
          options: [
            "Az eredmény értelmetlen: a megye nominális, a kódok sorrendje önkényes – vegyes kapcsolatként kell mérni.",
            "Közepes erősségű pozitív kapcsolat van a megye és a jövedelem között.",
            "A nagyobb kódú megyékben magasabb a jövedelem, tehát a kód sorrendje számít.",
            "Gyenge kapcsolat, mert 0,45 kisebb, mint 0,6."
          ],
          answer: 0,
          hint: "Ha más sorrendben számoznád a megyéket, ugyanaz jönne ki?",
          explain: R`A kód nem teszi metrikussá a változót. Más számozással teljesen más $r$ jönne ki, tehát a 0,45 semmit sem mér. A megye nominális, a jövedelem arányskálájú → <b>vegyes kapcsolat</b> (csoportátlagok, szóráshányados $H$, 3.3). Irányról („pozitív”) sem beszélhetünk, mert a megyéknek nincs sorrendje.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik változópárnál NEM értelmes a kapcsolat irányáról (pozitív / negatív) beszélni?",
          options: [
            "lakóhely típusa (főváros, város, község) és a választott párt",
            "életkor (év) és havi jövedelem (ezer Ft)",
            "iskolai végzettség (alap / közép / felső) és elégedettség (1–5 skála)",
            "napi tanulási idő (óra) és a dolgozat pontszáma"
          ],
          answer: 0,
          hint: "Az irányhoz mindkét változónak sorrendje kell, hogy legyen.",
          explain: R`Az irány csak akkor értelmes, ha <b>mindkét</b> változónak van sorrendje. A választott párt nominális (melyik a „nagyobb” párt?), ezért ott csak azt mondhatjuk, hogy van-e kapcsolat, és milyen szoros. A végzettség és az elégedettség ordinális, az életkor, a jövedelem, a tanulási idő és a pontszám metrikus – ezeknél van irány.`
        },
        {
          type: "single", shuffle: true,
          q: "Iskolai végzettség (alap / közép / felső) és az életével való elégedettség (1–5 skála). Melyik állítás igaz?",
          options: [
            "Rangkorrelációval is, és kontingencia-táblával (Cramér-féle V-vel) is mérhető a kapcsolat.",
            "Csak Pearson-féle korrelációval mérhető, hiszen mindkettőt számokkal kódoltuk.",
            "Csak kontingencia-táblával mérhető, mert nem metrikus változóknak nincs sorrendje.",
            "Csak szóráshányadossal mérhető, mert az elégedettség egy számskála."
          ],
          answer: 0,
          hint: "Milyen skálán van a két változó? És visszaminősíthető-e egy „erősebb” skála gyengébbre?",
          explain: R`Mindkettő <b>ordinális</b>: van sorrendjük, de a különbségük nem értelmes. Ezért a rangkorreláció a legjobb (kihasználja a sorrendet, irányt is ad), de az asszociáció mérőszámai (Cramér-féle $V$) bármilyen skálán használhatók – csak a sorrendet nem használják ki. A számkódolás nem teszi metrikussá a változót (ezért nem Pearson), az ordinális változónak pedig van sorrendje.`
        }
      ]
    },

    /* ------------------------------------------------ 3.2 */
    "ms3-32": {
      title: "Kvíz – 3.2 Kontingencia-tábla és asszociáció",
      questions: [
        {
          type: "single", shuffle: true,
          q: "120 hallgató: 50 kollégista, közülük 10 sportol rendszeresen; a 70 nem kollégista közül 30. A sportolók hány százaléka kollégista?",
          options: ["25,0%", "20,0%", "8,3%", "41,7%"],
          answer: 0,
          hint: "Mi a viszonyítási alap: a kollégisták vagy a sportolók? Előbb add össze a sportolókat.",
          explain: R`Sportoló összesen $10 + 30 = 40$, ebből kollégista 10: $10/40 = 25\%$ – ez <b>oszlopszázalék</b>. A 20% a sorszázalék ($10/50$: a kollégisták hány %-a sportol) – más kérdésre felel, mint $P(A \mid B)$ és $P(B \mid A)$. A 8,3% a cella aránya az egészben ($10/120$), a 41,7% a kollégisták aránya ($50/120$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Tábla (sorok: férfi, nő; oszlopok: dohányzik, nem): férfi 18 | 22, nő 12 | 48. Mennyi a „férfi, dohányzik” cella várt (elméleti) gyakorisága, $f^*_{11}$?`,
          options: ["12", "25", "18", "28"],
          answer: 0,
          hint: "Sorösszeg × oszlopösszeg / végösszeg – előbb számold ki a peremeket.",
          explain: R`Peremek: sorok 40 és 60, oszlopok 30 és 70, $N = 100$. $f^*_{11} = \dfrac{40 \cdot 30}{100} = 12$. A 25 az egyenletes elosztás ($N/4$) – a várt gyakoriság nem ez, hanem a peremekhez igazított érték. A 18 a tényleges gyakoriság, a 28 a rossz oszlopösszeggel számolt érték ($40 \cdot 70/100$, ez valójában $f^*_{12}$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a táblában (18 | 22 és 12 | 48; várt: 12, 28, 18, 42) mennyi a $\chi^2$?`,
          options: ["7,14", "7,39", "1,44", "1,19"],
          answer: 0,
          hint: R`Minden cellában $(f - f^*)^2 / f^*$, és ezeket add össze. Melyikkel osztasz: a ténylegessel vagy a várttal?`,
          explain: R`Minden eltérés $\pm 6$, így $\chi^2 = \frac{36}{12} + \frac{36}{28} + \frac{36}{18} + \frac{36}{42} \approx 3 + 1{,}286 + 2 + 0{,}857 = 7{,}14$. A 7,39 a tényleges $f$-fel osztva jön ki (a várttal kell!), az 1,44 a négyzetösszeg ($144$) osztva $N$-nel, az 1,19 pedig a négyzetre emelés nélkül, abszolút eltérésekkel. (A sima eltérések összege mindig 0.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $3 \times 4$-es kontingencia-táblában $N = 200$ és $\chi^2 = 32$. Mennyi a Cramér-féle $V$?`,
          options: ["0,283", "0,400", "0,231", "0,080"],
          answer: 0,
          hint: R`A nevezőben $N \cdot \min\{b - 1,\, c - 1\}$ áll, és a végén gyököt kell vonni.`,
          explain: R`$\min\{3 - 1,\, 4 - 1\} = 2$, így $V = \sqrt{\dfrac{32}{200 \cdot 2}} = \sqrt{0{,}08} \approx 0{,}283$ – gyenge kapcsolat. A 0,400 a $\min\{b-1, c-1\}$ elfelejtésével jön ki ($\sqrt{32/200}$), a 0,231 a maximummal ($c - 1 = 3$), a 0,080 a gyökvonás elhagyásával.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $2 \times 2$-es táblában $\chi^2 = 6$ és $V = 0{,}2$. Minden cellát megháromszorozunk. Mi lesz a két mutató?`,
          options: [
            R`$\chi^2 = 18$, $V = 0{,}2$`,
            R`$\chi^2 = 18$, $V = 0{,}6$`,
            R`$\chi^2 = 6$, $V = 0{,}2$`,
            R`$\chi^2 = 54$, $V = 0{,}6$`
          ],
          answer: 0,
          hint: "Változnak-e a sorszázalékok? És melyik mutató függ a létszámtól?",
          explain: R`A $\chi^2$ a létszámmal <b>arányosan nő</b>, ha az arányok nem változnak: $3 \cdot 6 = 18$. A $V$-ben viszont $\chi^2$-et elosztjuk $N$-nel (itt $N$ 150-ről 450-re nő), így $V = \sqrt{18/450} = 0{,}2$ marad – a kapcsolat szorossága ugyanaz. Ezért nem mér szorosságot a $\chi^2$ önmagában.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tábla: $\begin{smallmatrix} 15 & 5 \\ 10 & 20 \end{smallmatrix}$ (mindkét változó igen / nem sorrendben). Mennyi a Yule-féle $Q$?`,
          options: ["0,71", "0,41", "−0,71", "6,00"],
          answer: 0,
          hint: R`$Q = \dfrac{ad - bc}{ad + bc}$ – melyik szorzat az $ad$ (főátló) és melyik a $bc$?`,
          explain: R`$ad = 15 \cdot 20 = 300$, $bc = 5 \cdot 10 = 50$, így $Q = \dfrac{250}{350} \approx 0{,}71$. A 0,41 a Cramér-féle $V$ ugyanerre a táblára ($\chi^2 \approx 8{,}33$, $V = \sqrt{8{,}33/50}$) – a $Q$ jellemzően nagyobb, ezért mindig írd oda, melyiket számoltad. A −0,71 a felcserélt átlókkal jön ki ($bc - ad$), a 6 pedig maga az esélyhányados ($ad/bc$), amit a $Q$ sűrít a $[-1;\, 1]$ intervallumba.`
        },
        {
          type: "set",
          q: "Tábla (sorok: végzettség; oszlopok: sportol rendszeresen?): középfokú 20 igen | 40 nem; felsőfokú 25 igen | 15 nem. Jelöld meg a felülreprezentált cellákat!",
          items: ["közép – sportol", "közép – nem sportol", "felső – sportol", "felső – nem sportol"],
          answer: ["közép – nem sportol", "felső – sportol"],
          hint: R`Számold ki a várt gyakoriságokat (sorösszeg × oszlopösszeg / $N$), és hasonlítsd a tényleges értékekhez.`,
          explain: R`Peremek: sorok 60 és 40, oszlopok 45 és 55, $N = 100$. Várt: $27$; $33$; $18$; $22$. Tényleges: $20 \lt 27$ (alul), $40 > 33$ (felül), $25 > 18$ (felül), $15 \lt 22$ (alul). 2×2-es táblában a felülreprezentált cellák mindig átlósan párban állnak. Nem a legnagyobb nyers szám (40) a mérce, hanem a várt értékhez viszonyított eltérés.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Ha a sorszázalékok nem változnak, a $\chi^2$ a létszámmal arányosan nő.`,
            R`Ha $Q = 1$, a kapcsolat biztosan függvényszerű.`,
            R`$V = 0$ pontosan akkor, ha minden cellában $f_{ij} = f^*_{ij}$.`,
            R`Minél nagyobb a $\chi^2$, annál szorosabb a kapcsolat.`,
            R`A Yule-féle $Q$ bármilyen méretű táblára kiszámolható.`
          ],
          answer: [0, 2],
          hint: R`Gondolj a „kétszer akkora minta” példára és a 20 | 0 és 10 | 20 táblára.`,
          explain: R`A $\chi^2$ a létszámmal arányos, ezért a nagysága nem szorosság – ahhoz normálni kell ($V$). $V = 0 \iff \chi^2 = 0 \iff$ a tényleges tábla a várttal egyezik (függetlenség). A $Q = 1$-hez elég egyetlen üres cella: a 20 | 0 és 10 | 20 táblában $Q = 1$, de $V \approx 0{,}67$. A $Q$ csak 2×2-es táblára értelmezett.`
        }
      ]
    },

    /* ------------------------------------------------ 3.3 */
    "ms3-33": {
      title: "Kvíz – 3.3 Vegyes kapcsolat",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy vizsgálatban a teljes variancia 80, a csoportokon belüli (belső) variancia 20. A szóródás hány százalékát magyarázza a csoportosító változó?",
          options: ["75,0%", "25,0%", "86,6%", "50,0%"],
          answer: 0,
          hint: R`A „hány százalékot magyaráz” kérdésre $H^2$ felel – vagy $H$?`,
          explain: R`$H^2 = 1 - \dfrac{\sigma_B^2}{\sigma^2} = 1 - \dfrac{20}{80} = 0{,}75 = 75\%$. A 25% a belső (meg nem magyarázott) rész aránya, a 86,6% a szóráshányados $H = \sqrt{0{,}75}$ – ez a szorosság, nem a magyarázott arány. Az 50% a belső arány gyöke ($\sqrt{0{,}25}$).`
        },
        {
          type: "single", shuffle: true,
          q: "I. csoport: 2, 4; II. csoport: 6, 8. Mennyi a szóráshányados, H?",
          options: ["0,894", "0,800", "0,447", "0,200"],
          answer: 0,
          hint: "Számold ki a főátlagot, a csoportátlagokat, a külső és a teljes varianciát – a végén ne felejts gyököt vonni.",
          explain: R`Főátlag 5, csoportátlagok 3 és 7. Külső: $\sigma_K^2 = \frac{2 \cdot 4 + 2 \cdot 4}{4} = 4$; belső: mindkét csoportban 1, tehát $\sigma_B^2 = 1$; teljes: 5. $H^2 = 4/5 = 0{,}8$, $H = \sqrt{0{,}8} \approx 0{,}894$. A 0,800 maga $H^2$ (elmaradt a gyökvonás), a 0,447 és a 0,200 a belső rész arányából ($\sqrt{1/5}$, $1/5$) jön ki – az a meg nem magyarázott rész.`
        },
        {
          type: "single", shuffle: true,
          q: "Két csoport: 10 fő átlaga 50, 30 fő átlaga 70. Mennyi a külső (csoportok közötti) variancia?",
          options: ["75", "100", "125", "1500"],
          answer: 0,
          hint: "A főátlag is és a külső variancia is létszámmal súlyozott átlag.",
          explain: R`Főátlag: $\frac{10 \cdot 50 + 30 \cdot 70}{40} = 65$. $\sigma_K^2 = \frac{10 \cdot 15^2 + 30 \cdot 5^2}{40} = \frac{2250 + 750}{40} = 75$. A 100 a súlyozatlan főátlaggal (60) jön ki, a 125 a négyzetes eltérések súlyozatlan átlaga ($\frac{225 + 25}{2}$), az 1500 a csoportok számával (2) való osztás $n = 40$ helyett.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a szóráshányadosra? (Több jó válasz is lehet.)",
          options: [
            R`$H = 1$, ha a csoportokon belül nincs szóródás.`,
            R`$H = 0$, ha minden csoportátlag egyforma.`,
            R`$H$ negatív, ha a nagyobb sorszámú csoport átlaga a kisebb.`,
            R`A szórások is összeadódnak: $\sigma = \sigma_B + \sigma_K$.`,
            R`Ugyanakkora átlagkülönbség mindig ugyanakkora $H$-t ad.`
          ],
          answer: [0, 1],
          hint: R`Gondolj a két szélső esetre ($\sigma_B = 0$, $\sigma_K = 0$), és arra, hogy a felbontás mire igaz: szórásra vagy varianciára?`,
          explain: R`$\sigma_B = 0$ → $H = 1$ (függvényszerű), $\sigma_K = 0$ → $H = 0$ (független). A vegyes kapcsolatnak nincs iránya, $H \ge 0$ – a csoportok sorrendje közömbös. A felbontás csak a <b>varianciákra</b> igaz ($\sigma^2 = \sigma_B^2 + \sigma_K^2$); NGA példájában $3{,}16 \ne 2{,}14 + 2{,}33$. Ugyanakkora átlagkülönbség laza kapcsolatot is jelenthet, ha a csoportokon belül nagy a szóródás (37% vs. 90% a két példában).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálatban a szóráshányados $H = 0{,}7$. Melyik értelmezés helyes?`,
          options: [
            "A csoportosítás a szóródás 49%-át magyarázza; a kapcsolat szoros.",
            "A csoportosítás a szóródás 70%-át magyarázza; a kapcsolat szoros.",
            "A csoportosítás a szóródás 49%-át magyarázza; a kapcsolat pozitív irányú.",
            "A csoportosítás a szóródás 83,7%-át magyarázza; a kapcsolat szoros."
          ],
          answer: 0,
          hint: R`Hogyan kapod meg $H$-ból a magyarázott arányt? És van-e iránya a vegyes kapcsolatnak?`,
          explain: R`A magyarázott arány $H^2 = 0{,}7^2 = 0{,}49 = 49\%$; a szorosság $H = 0{,}7 > 0{,}6$ → szoros. A 70% a $H$ és $H^2$ összekeverése, a 83,7% a $\sqrt{0{,}7}$ (gyökvonás négyzetre emelés helyett). „Pozitív irányú” vegyes kapcsolat nincs: a csoportosító változónak nincs sorrendje, $H \ge 0$.`
        },
        {
          type: "single", shuffle: true,
          q: "Két vizsgálat, mindkettőben két egyforma létszámú csoport, átlaguk 20 és 30. Az A vizsgálatban a csoportokon belüli (belső) variancia 4, a B-ben 100. Hol szorosabb a kapcsolat?",
          options: [
            R`Az A-ban ($H^2 \approx 0{,}86$, a B-ben csak $0{,}20$).`,
            "A B-ben, mert ott nagyobb a teljes szóródás.",
            "Egyformán szoros, mert az átlagkülönbség ugyanaz.",
            "Nem dönthető el a csoportok pontos létszáma nélkül."
          ],
          answer: 0,
          hint: "A külső variancia mindkettőben ugyanaz. Mihez kell viszonyítani?",
          explain: R`Főátlag 25, a külső variancia mindkét esetben $\sigma_K^2 = 25$. A: $H^2 = 25/(25 + 4) \approx 0{,}86$; B: $H^2 = 25/(25 + 100) = 0{,}20$. Ugyanakkora átlagkülönbség <b>gyengébb</b> kapcsolatot jelent, ha a csoportokon belül nagy a szóródás. Egyforma létszámnál a pontos létszám nem számít, mert a súlyok egyformák.`
        },
        {
          type: "match",
          q: "Párosítsd a jelölést a jelentésével!",
          pairs: [
            [R`$\sigma_K^2$`, "a csoportátlagok szóródása a főátlag körül"],
            [R`$\sigma_B^2$`, "a csoportokon belüli varianciák súlyozott átlaga"],
            [R`$H^2$`, "a magyarázott szóródás aránya"],
            [R`$H$`, "a kapcsolat szorossága (0 és 1 között)"]
          ],
          hint: "K mint külső, B mint belső. A négyzetes mutató az arány, a gyöke a szorosság.",
          explain: R`$\sigma^2 = \sigma_B^2 + \sigma_K^2$: a belső variancia a csoportokon belüli varianciák létszámmal súlyozott átlaga, a külső a csoportátlagok szóródása a főátlag körül. $H^2 = \sigma_K^2/\sigma^2$ megmondja, hány százalékot magyaráz a csoportosítás; $H = \sqrt{H^2}$ a szorosság mértéke (hüvelykujjszabály: 0,4 alatt gyenge, 0,6 fölött szoros).`
        },
        {
          type: "single", shuffle: true,
          q: "Három csoport: 5, 5 és 10 fő; átlaguk 10, 14 és 18; csoportvarianciájuk 4, 9 és 6. Mennyi a variancia-hányados, H²?",
          options: ["63,8%", "79,9%", "36,2%", "65,8%"],
          answer: 0,
          hint: "Előbb a súlyozott főátlag, utána a külső és a belső variancia; a teljes ezek összege.",
          explain: R`Főátlag $\frac{50 + 70 + 180}{20} = 15$. Külső: $\frac{5 \cdot 25 + 5 \cdot 1 + 10 \cdot 9}{20} = 11$. Belső: $\frac{5 \cdot 4 + 5 \cdot 9 + 10 \cdot 6}{20} = 6{,}25$. Teljes: $17{,}25$. $H^2 = 11/17{,}25 \approx 63{,}8\%$. A 79,9% a $H$ (szorosság), a 36,2% a belső rész aránya, a 65,8% a súlyozatlan főátlaggal (14) számolt külső varianciából jön ki.`
        }
      ]
    },

    /* ------------------------------------------------ 3.4 */
    "ms3-34": {
      title: "Kvíz – 3.4 Pontdiagram és kovariancia",
      questions: [
        {
          type: "match",
          q: "Milyen pontdiagramot vársz? Párosítsd!",
          pairs: [
            ["egy autó kora és a piaci ára", "negatív, közel lineáris"],
            ["napi edzésidő (0–6 óra) és futóteljesítmény", "erős, de görbe"],
            ["a születésnap (a hónap hányadik napja) és a testmagasság", "nincs kapcsolat"],
            ["cégek forgalma és reklámköltése", "pozitív, közel lineáris"]
          ],
          hint: "Nézd az irányt (együtt nő vagy ellentétesen mozog) és a formát (egyenes vagy görbe).",
          explain: R`Az idősebb autó általában olcsóbb → a pontok süllyednek. Az edzés eleinte javít, a túledzés ront → görbe (egy egyenes rosszul írná le). A születésnap semmit sem mond a magasságról → pontfelhő minta nélkül. A nagyobb forgalmú cégek többet költenek reklámra → emelkedő, szinte egyenes (NGA 7.10).`
        },
        {
          type: "single", shuffle: true,
          q: "Két pontdiagram: az A-n a pontok egy meredek egyenes körül erősen szétszórva, a B-n egy lapos egyenes mentén szinte tökéletesen sorakoznak. Melyik mutat erősebb kapcsolatot?",
          options: [
            "a B, mert a pontok szorosabban követik az egyenest",
            "az A, mert meredekebb az egyenes",
            "egyformán erős, mert mindkettő pozitív irányú",
            "rajz alapján semmit sem lehet mondani az erősségről"
          ],
          answer: 0,
          hint: "Erősség = mennyire szorosan követik a pontok a formát. Mitől függ a meredekség?",
          explain: R`Az erősség azt méri, mennyire szorosan követik a pontok a formát – ebben a B jobb. A meredekség nem erősség: a tengelyek skálájától is függ (más mértékegységben ugyanaz a kapcsolat laposabb vagy meredekebb). Az irány (pozitív) az erősségről nem mond semmit. A pontdiagram pont arra jó, hogy irányt, formát és erősséget lássunk.`
        },
        {
          type: "single", shuffle: true,
          q: R`$x$: 1, 2, 3, 4, 5; $y$: 2, 5, 9, 4, 10. Mennyi az előjel-korrelációs együttható, $K_r$?`,
          options: ["0,50", "0,40", "0,60", "0,75"],
          answer: 0,
          hint: R`$\bar x = 3$, $\bar y = 6$. Melyik pont szorzata 0 – és az számít-e?`,
          explain: R`Előjelek: $(-)(-) = +$, $(-)(-) = +$, a 3. pont $x$-eltérése 0 (kimarad), $(+)(-) = -$, $(+)(+) = +$. $p = 3$, $q = 1$, $K_r = \frac{3 - 1}{3 + 1} = 0{,}5$. A 0,40 akkor jön ki, ha a 0 szorzatú pontot is beszámítod a nevezőbe ($2/5$), a 0,60, ha pozitívnak veszed ($3/5$), a 0,75 pedig $p/(p + q)$ – a negatív szavazat levonása nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi az előjel-korrelációs együttható fő gyengesége?",
          options: [
            "Csak az előjelet nézi: az átlaghoz közeli pont ugyanannyit számít, mint egy nagyon távoli.",
            "Nem lehet negatív, ezért az irányt nem mutatja.",
            "Függ a változók mértékegységétől.",
            "Csak 2×2-es kontingencia-táblára használható."
          ],
          answer: 0,
          hint: "Gondolj a 10 cég példájában a 6. és a 10. cégre.",
          explain: R`A 6. cég alig tér el az átlagoktól ($+0{,}1$ és $-1$), mégis egy teljes „negatív szavazat”, ugyanannyi, mint a 10. cég ($+1{,}1$ és $+16$) pozitív szavazata. Egy átlag körüli pont véletlenül átcsúszhat, és a $K_r$ ugrik. A $K_r$ $-1$ és $1$ között mozog (van iránya), és mértékegységtől független – a mértékegység-függés a <b>kovariancia</b> baja.`
        },
        {
          type: "single", shuffle: true,
          q: R`$x$: 1, 2, 3; $y$: 4, 3, 8. Mennyi a kovariancia ($n$-es nevezővel)?`,
          options: ["1,333", "2,000", "4,000", "11,333"],
          answer: 0,
          hint: R`Számold ki az eltéréseket az átlagoktól ($\bar x = 2$, $\bar y = 5$), szorozd össze őket páronként, és átlagold.`,
          explain: R`$d_x$: −1, 0, 1; $d_y$: −1, −2, 3; szorzatok 1, 0, 3, összegük 4. $C = 4/3 \approx 1{,}333$. A 2,000 az $n - 1$-es nevezővel jön ki (mintabecslés, $s_{xy}$), a 4,000 az összeg osztás nélkül, a 11,333 pedig $\overline{xy}$ – az eltolási képletből elmaradt a $\bar x \bar y = 10$ levonása.`
        },
        {
          type: "single", shuffle: true,
          q: R`4 pontra $\overline{xy} = 30$, $\bar x = 5$ és $\bar y = 7$. Mennyi a kovariancia?`,
          options: ["−5", "5", "18", "−20"],
          answer: 0,
          hint: R`Eltolási képlet: $C = \overline{xy} - \bar x\,\bar y$.`,
          explain: R`$C = 30 - 5 \cdot 7 = -5$: negatív irányú lineáris együttmozgás. Az 5 az előjel elvesztése, a 18 az átlagok összegével számol szorzat helyett ($30 - 12$), a −20 pedig az eltérésszorzatok <em>összege</em> ($4 \cdot (-5)$), nem az átlaga.`
        },
        {
          type: "single", shuffle: true,
          q: "A magasság (m) és a testsúly (kg) kovarianciája 0,8 m·kg. Mennyi lesz, ha a magasságot centiméterben, a testsúlyt grammban mérjük?",
          options: ["80 000 cm·g", "80 cm·g", "800 cm·g", "0,8 cm·g"],
          answer: 0,
          hint: "Hányszorosára nőnek az eltérések az egyik, és hányszorosára a másik változóban?",
          explain: R`Minden $d_x$ 100-szoros, minden $d_y$ 1000-szeres lesz, így a szorzatok $100\,000$-szeresek: $0{,}8 \cdot 100\,000 = 80\,000$ cm·g. A 80 csak a cm-váltást, a 800 csak a g-váltást veszi figyelembe, a 0,8 pedig azt hiszi, hogy a kovariancia nem függ a mértékegységtől. Ugyanaz a kapcsolat – sokkal nagyobb szám: a kovariancia nagysága nem erősség.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a kovarianciára? (Több jó válasz is lehet.)",
          options: [
            "Az előjele megmutatja a lineáris együttmozgás irányát.",
            R`Ha minden $y$-hoz 10-et adunk, a kovariancia nem változik.`,
            "Minél nagyobb a kovariancia, annál szorosabb a kapcsolat.",
            R`Ha $C = 0$, a két változó biztosan független.`,
            R`A mértékegysége ugyanaz, mint az $x$ változóé.`
          ],
          answer: [0, 1],
          hint: "Mi történik az eltérésekkel eltolásnál? És mi a kovariancia mértékegysége?",
          explain: R`Közvetlenül csak az előjel értelmezhető ($C > 0$ pozitív, $C \lt 0$ negatív irány). Eltolásnál az eltérések nem változnak, így $C$ sem. A nagysága a mértékegységtől függ (7,6 óra·pont vs. 456 perc·pont ugyanarra a kapcsolatra), ezért nem erősség. $C = 0$-ból nem következik függetlenség – csak az egyenes menti együttmozgás hiányzik (lásd a parabolát a 3.5-ben). A mértékegység a két mértékegység <b>szorzata</b>.`
        }
      ]
    },
