/* =========================================================
   Matematikai statisztika 3. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 3.5 */
    "ms3-35": {
      title: "Kvíz – 3.5 A Pearson-féle korrelációs együttható",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy adatsorra $\sum d_x d_y = -12$, $\sum d_x^2 = 16$, $\sum d_y^2 = 25$. Mennyi a Pearson-féle $r$?`,
          options: ["−0,60", "0,60", "−0,03", "−0,75"],
          answer: 0,
          hint: "A harmadik alak: a szorzatösszeget a két négyzetösszeg szorzatának gyökével osztod.",
          explain: R`$r = \dfrac{-12}{\sqrt{16 \cdot 25}} = \dfrac{-12}{20} = -0{,}6$: közepes, negatív lineáris kapcsolat. A $0{,}6$ elveszíti az előjelet (pedig az az irány!).
            A $-0{,}03$ a gyökvonás elfelejtése ($-12/400$). A $-0{,}75$ csak $\sum d_x^2$-tel oszt ($-12/16$) – ez a regressziós egyenes meredeksége lenne, nem a korreláció.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két változó korrelációja $r(x, y) = 0{,}8$. Mennyi $r(3 - 2x,\; 10y)$?`,
          options: ["−0,8", "0,8", "−1,6", "−0,4"],
          answer: 0,
          hint: "Az eltolás és a pozitív szorzó nem számít. Mit csinál egy negatív szorzó?",
          explain: R`A $+3$ eltolás és a $10$-es (pozitív) szorzó nem változtat $r$-en; a $-2$-es szorzó csak az előjelet fordítja meg: $r = -0{,}8$.
            A $-1{,}6$ és a $-0{,}4$ úgy kezeli $r$-t, mintha a $-2$-es szorzóval szorozni vagy osztani kellene – a szorzótól a kovariancia változik, az $r$ nem (a $-1{,}6$ ráadásul kívül is esik a $[-1;\,1]$ intervallumon).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálatban $r = -0{,}6$. A lineáris kapcsolat az egyik változó szóródásának hány százalékát magyarázza?`,
          options: ["36%", "60%", "−36%", "64%"],
          answer: 0,
          hint: "A magyarázott hányadot a determinációs együttható adja.",
          explain: R`$r^2 = (-0{,}6)^2 = 0{,}36 = 36\%$. A 60% az $r$ százalékként olvasása – a leggyakoribb hiba. Négyzet nem lehet negatív, így a $-36\%$ sem jó.
            A 64% ($1 - r^2$) épp a <em>nem</em> magyarázott rész.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a Pearson-féle $r$-re? (Több jó válasz is lehet.)`,
          options: [
            R`Mértékegység nélküli szám.`,
            R`$r(x, y) = r(y, x)$.`,
            R`Ha minden pont egy csökkenő egyenesre esik, akkor $r = -1$.`,
            R`$r = 0{,}9$ azt jelenti: ha $x$ egy egységgel nő, $y$ átlagosan 0,9 egységgel nő.`,
            R`$r = 0{,}8$ kétszer olyan erős kapcsolat, mint $r = 0{,}4$.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a z-értékes alakra, a tétel négy pontjára, és a második lépés buktatóira.",
          explain: R`A z-értékek mértékegység nélküliek, így a szorzatuk átlaga is az; a képlet szimmetrikus; $\pm 1$ pontosan az egyenesre eső pontoknál.
            A „0,9 egységgel nő” a meredekségről szólna ($b = r\,\sigma_y/\sigma_x$) – csak z-értékekben, szórásnyi egységekben igaz.
            A „kétszer olyan erős” sem jó: a magyarázott hányad $0{,}64$ vs. $0{,}16$, vagyis négyszeres – az $r$ nem arányskála.`
        },
        {
          type: "single", shuffle: true,
          q: R`$x$: −2, −1, 0, 1, 2; $y = 4 - x^2$: 0, 3, 4, 3, 0. Mennyi $r$, és mit jelent?`,
          options: [
            R`$r = 0$: nincs lineáris kapcsolat, pedig $y$ függvényszerűen függ $x$-től.`,
            R`$r = 0$: a két változó független.`,
            R`$r = 1$, mert a kapcsolat függvényszerű.`,
            R`$r = -1$, mert a pontok a széleken lefelé mennek.`
          ],
          answer: 0,
          hint: R`Számold ki a $d_x d_y$ szorzatokat! $\bar x = 0$, $\bar y = 2$.`,
          explain: R`$d_y$: −2, 1, 2, 1, −2; a szorzatok: 4, −1, 0, 1, −4 → összeg 0, így $r = 0$. A bal ág „felfelé”, a jobb „lefelé” szavaz, és kioltják egymást.
            A függetlenségből következik $r \approx 0$, de fordítva nem: itt $x$ pontosan meghatározza $y$-t. Az $r = \pm 1$ csak egyenes mentén áll elő, a „függvényszerű” nem ugyanaz, mint a „lineáris”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Öt pont: (1; 5), (2; 3), (3; 4), (4; 2), (5; 1), ezekre $r = -0{,}9$. Hozzáveszünk egyetlen pontot: (15; 15). Mennyi lesz $r$ körülbelül?`,
          options: ["0,85", "−0,90", "0", "−0,95"],
          answer: 0,
          hint: "A messzi pont mindkét átlagot magával húzza, és a saját szorzata óriási. Melyik negyedbe esik?",
          explain: R`$r \approx +0{,}85$ – egyetlen pont megfordította a kapcsolat irányát! A (15; 15) mindkét változóban messze átlag fölött van, a szorzata minden mást elnyom,
            az eredeti öt pont pedig az új átlagokhoz (5; 5) képest a bal alsó negyedbe vagy annak határára kerül. Az $r$ <b>nem robusztus</b>: „egy pont nem számít” (−0,90) vagy „kioltja” (0) – mindkettő téves. Előbb rajzolj!`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 5 diák adataiból valaki a kovarianciát $n - 1$-es nevezővel számolja ($s_{xy} = 38/4 = 9{,}5$), a szórásokat viszont $n$-es nevezővel ($\sigma_x \approx 1{,}414$, $\sigma_y \approx 5{,}514$). Mit kap?`,
          options: [
            "≈ 1,22 – lehetetlen érték, a nevezők keverése okozza; helyesen 0,975",
            "≈ 0,975 – a nevezők keverése nem számít",
            "≈ 0,78 – mintából mindig kisebb r jön ki",
            "≈ 0,95 – ez a helyes r, mert mintából számoltunk"
          ],
          answer: 0,
          hint: "Számold ki a hányadost, és nézd meg, belefér-e a lehetséges tartományba.",
          explain: R`$9{,}5 / (1{,}414 \cdot 5{,}514) \approx 1{,}22 \gt 1$ – ilyen $r$ nincs. Vagy mindenhol $n$ (7,6 és 1,414, 5,514), vagy mindenhol $n - 1$ (9,5 és 1,581, 6,164): mindkét esetben $r \approx 0{,}975$.
            A 0,78 a fordított keverés ($7{,}6 / (1{,}581 \cdot 6{,}164)$), a 0,95 pedig $r^2$, nem $r$.`
        },
        {
          type: "match",
          q: R`Mit mutat az $r$ az alábbi pontfelhőkre? Párosítsd!`,
          pairs: [
            ["U alakú (parabola) pontfelhő, szimmetrikus $x$-ekkel", "r közel 0, pedig erős a kapcsolat"],
            ["szoros, emelkedő egyenes menti felhő + egy hibásan rögzített pont messze jobbra lent", "r jóval kisebb, mint a többi pont alapján várnád"],
            ["kapcsolat nélküli felhő + egy pont, amely mindkét változóban messze a többi fölött van", "r nagy, de csak egyetlen pont miatt"],
            ["minden pont egy emelkedő egyenesen", "r pontosan 1"]
          ],
          hint: "Az $r$ csak a lineáris kapcsolatot látja, és a messzi pontok szorzata nagyon nagy.",
          explain: R`A parabolánál a két ág kioltja egymást ($r = 0$). A „rombolás” (3.5-c: $0{,}99 \to 0{,}35$) és a „teremtés” ($0{,}14 \to 0{,}91$) példája mutatja, mennyire érzékeny az $r$ egyetlen kiugró pontra.
            $r = 1$ csak egyenes mentén – ez az Anscombe-kvartett tanulsága is: <b>előbb rajzolj, aztán számolj</b>.`
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "ms3-36": {
      title: "Kvíz – 3.6 Rangkorreláció",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Öt elem két rangsorában (kötés nélkül) $\sum D^2 = 6$. Mennyi a Spearman-féle $\rho$?`,
          options: ["0,700", "−0,500", "0,712", "0,950"],
          answer: 0,
          hint: R`$\rho = 1 - \dfrac{6\sum D^2}{n^3 - n}$ – figyelj a nevezőre!`,
          explain: R`$\rho = 1 - \dfrac{6 \cdot 6}{125 - 5} = 1 - \dfrac{36}{120} = 0{,}7$. A $-0{,}5$ az $n^2 - 1 = 24$-es nevezővel jön ki (ami 1-nél nagyobb kivonandót ad),
            a $0{,}712$ az $n^3 = 125$-tel, a $0{,}95$ pedig a 6-os szorzó elfelejtésével ($1 - 6/120$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Rangsorold növekvően: 3, 5, 5, 8, 8, 8, 10. Milyen rangot kapnak a 8-asok?`,
          options: ["mindhárom 5-öt", "4-et, 5-öt és 6-ot", "mindhárom 4-et", "mindhárom 6-ot"],
          answer: 0,
          hint: "Melyik helyezéseken osztoznak a 8-asok? Kötésnél ezek átlagát kapják.",
          explain: R`A 3 az 1., a két 5-ös a 2–3. helyen osztozik (mindkettő 2,5), a három 8-as a 4., 5., 6. helyen → mindegyik $(4 + 5 + 6)/3 = 5$, a 10 a 7.
            Az egymás utáni rangok (4, 5, 6) az adatok véletlen sorrendjén múlnának; a 4 vagy 6 „mindenkinek” pedig elrontja a rangok összegét.`
        },
        {
          type: "single", shuffle: true,
          q: R`Öt dolgozó: ledolgozott évek $x$: 10, 30, 20, 50, 40; teljesítményértékelés $y$: 3, 5, 9, 8, 7. Mennyi a Spearman-féle $\rho$?`,
          options: ["0,400", "−0,400", "0,424", "0,525"],
          answer: 0,
          hint: "Előbb mindkét változót rangsorold (1 = legkisebb), és a rangok különbségével számolj.",
          explain: R`$x$ rangjai: 1, 3, 2, 5, 4; $y$ rangjai: 1, 2, 5, 4, 3. $D$: 0, 1, −3, 1, 1; $\sum D^2 = 12$; $\rho = 1 - 72/120 = 0{,}4$.
            A $-0{,}4$ akkor jön ki, ha az egyiket növekvő, a másikat csökkenő sorrendben rangsorolod; a $0{,}424$ az $n^3$-ös nevezővel; a $0{,}525$ a nyers értékek Pearson-féle $r$-je – az nem rangkorreláció.`
        },
        {
          type: "single", shuffle: true,
          q: R`Rangok: $x$: 1, 2, 3, 4, 5; $y$: 3, 1, 2, 5, 4. Mennyi a Kendall-féle $\tau$?`,
          options: ["0,4", "0,7", "0,8", "0,2"],
          answer: 0,
          hint: R`Nézd végig mind a $\binom52 = 10$ párt: melyikben fordított $y$ sorrendje?`,
          explain: R`Ellentétes párok: (1–2), (1–3), (4–5) → $Q = 3$, $P = 7$. $\tau = (7 - 3)/10 = 0{,}4$.
            A 0,7 csak az egyetértő párok aránya ($P/10$), a 0,8 az $n = 5$-tel való osztás, a 0,2 a párok számának elszámolása ($n(n-1) = 20$, a 2-vel osztás elmaradt).`
        },
        {
          type: "single", shuffle: true,
          q: R`Hat elem két rangsorára (kötés nélkül) $\tau = 0{,}6$. Hány ellentétes pár van?`,
          options: ["3", "12", "6", "9"],
          answer: 0,
          hint: R`Hány pár van összesen 6 elemnél? Írj fel két egyenletet $P$-re és $Q$-ra.`,
          explain: R`$6 \cdot 5/2 = 15$ pár. $P - Q = 0{,}6 \cdot 15 = 9$ és $P + Q = 15$ → $Q = 3$, $P = 12$.
            A 12 az egyetértő párok száma, a 9 a különbség, a 6 a 30 „párral” ($n(n-1)$, felezés nélkül) számolva jön ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`$x$: 1, 2, 3, 4, 5; $y$: 1, 4, 9, 16, 100. Mennyi a Spearman-féle $\rho$, és mekkora a Pearson-féle $r$?`,
          options: [
            R`$\rho = 1$; $r \approx 0{,}80$`,
            R`$\rho \approx 0{,}80$; $r = 1$`,
            R`$\rho = 1$; $r = 1$`,
            R`$\rho \approx 0{,}80$; $r \approx 0{,}80$`
          ],
          answer: 0,
          hint: "Szigorúan növekvő-e a kapcsolat? És egy egyenesen vannak-e a pontok?",
          explain: R`A rangsorok teljesen egyeznek (szigorúan monoton) → $\rho = 1$. A pontok viszont nincsenek egy egyenesen (a 100 messze kiugrik), így $r \approx 0{,}80 \lt 1$.
            A rangkorreláció a „minél több, annál több” kapcsolatot méri, az $r$ csak az egyenes menti, és érzékeny a kiugró értékre.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`$\rho$ nem változik, ha minden $x$ helyett $\log x$-et veszünk ($x \gt 0$).`,
            R`Egy kiugró érték a $\rho$-ban legfeljebb egy szélső rangnyit számít, ezért robusztusabb, mint $r$.`,
            R`Ha a két rangsor teljesen fordított, $\tau = -1$.`,
            R`U alakú kapcsolatot a $\rho$ jól mér, mert nem kell hozzá egyenes.`,
            R`Ha egy adatra $\tau = 0{,}6$ és $\rho = 0{,}8$, a Spearman szerint erősebb a kapcsolat.`
          ],
          answer: [0, 1, 2],
          hint: "A rangkorreláció csak a sorrendet látja. Mi történik a sorrenddel egy U alaknál?",
          explain: R`A log szigorúan növekvő, a rangok nem változnak; a kiugró érték csak „a legnagyobb” rangot kapja; fordított rangsornál minden pár ellentétes.
            Nem monoton (U alakú) kapcsolatot a $\rho$ sem lát ($y = x^2$, $x$: −2…2 esetén $\rho = 0$). A $\tau$ és a $\rho$ más skálán mozog: ugyanannál az adatnál $|\tau|$ általában kisebb – egymással nem hasonlíthatók össze.`
        },
        {
          type: "match",
          q: "Melyik mérőszám dolgozik így? Párosítsd!",
          pairs: [
            ["a rangkülönbségek négyzetösszegéből számol", "Spearman-féle rangkorreláció"],
            ["megszámolja az egyetértő és az ellentétes párokat", "Kendall-féle rangkorreláció"],
            ["a z-értékek szorzatának átlaga", "Pearson-féle korrelációs együttható"],
            ["csak azt nézi, melyik negyedbe esik a pont az átlagokhoz képest", "előjel-korreláció"]
          ],
          hint: "Rangok, párok, szórásnyi egységek, előjelek – melyik mire épít?",
          explain: R`Spearman: $1 - 6\sum D^2/(n^3 - n)$; Kendall: $(P - Q)/\binom n2$; Pearson: $\overline{z_x z_y}$; előjel-korreláció (3.4): $K_r = (p - q)/(p + q)$, ahol csak a szorzatok előjele számít.`
        }
      ]
    },

    /* ------------------------------------------------ 3.7 */
    "ms3-37": {
      title: "Kvíz – 3.7 Korreláció ≠ okság",
      questions: [
        {
          type: "match",
          q: "Melyik csapda magyarázza leginkább a korrelációt? Párosítsd!",
          pairs: [
            ["Azokon a heteken, amikor több esernyőt adnak el, több a közlekedési baleset is.", "közös ok (zavaró változó)"],
            ["Akik sok fájdalomcsillapítót szednek, gyakrabban fáj a fejük.", "fordított okság"],
            ["Egy kutató 300 változópárt nézett meg 8 megfigyelésen, és talált néhány r ≈ 0,7-es párt.", "véletlen egybeesés"],
            ["Megyénként az átlagjövedelem és egy párt szavazataránya korrelál, ebből a gazdag választók viselkedésére következtetnek.", "ökológiai tévkövetkeztetés"]
          ],
          hint: "Van harmadik változó? Melyik irányban hat? Mennyi adat és hány kipróbált pár? Egyénekről vagy csoportokról szól az adat?",
          explain: R`Esernyő és baleset: az <b>eső</b> a közös ok. Fájdalomcsillapító: aki gyakran fejfájós, az szed többet – $Y \to X$. Sok pár kevés adaton: néhány a véletlenből is „erős” lesz (látszólagos korreláció).
            Megyei átlagokból az egyénekre következtetni ökológiai tévkövetkeztetés – lehet, hogy a gazdag megyék szegényebb lakói szavaznak a pártra.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gyógymód: A-nál a könnyű esetek 90%-a, a súlyosak 50%-a gyógyul; B-nél 85% és 40%. A-val az esetek 75%-a súlyos, B-vel csak 25%. Mennyi az összesített gyógyulási arány?`,
          options: ["A: 60%, B: 73,75%", "A: 70%, B: 62,5%", "A: 80%, B: 51,25%", "A: 60%, B: 51,25%"],
          answer: 0,
          hint: "Az összesített arány a csoportarányok súlyozott átlaga – a súly az esetek megoszlása.",
          explain: R`A: $0{,}25 \cdot 90\% + 0{,}75 \cdot 50\% = 60\%$; B: $0{,}75 \cdot 85\% + 0{,}25 \cdot 40\% = 73{,}75\%$. B tűnik jobbnak, pedig A mindkét csoportban jobb – Simpson-paradoxon, a zavaró változó az eset súlyossága.
            A 70% / 62,5% súlyozatlan átlag, a 80% / 51,25% felcserélt súlyokkal jön ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Berkeley, 1973: összesítve a férfiak 44,5%-át, a nők 30,4%-át vették fel, szakonként viszont hatból négyben a nők aránya volt jobb. Melyik a helyes magyarázat?`,
          options: [
            "A nők főleg a nehezen bejutható szakokra jelentkeztek; a zavaró változó a szak.",
            "Az összesített arány bizonyítja a nők hátrányos megkülönböztetését, a szakonkénti bontás csak elfedi.",
            "Több férfi jelentkezett, mint nő, ezért a férfiak összesített aránya nagyobb.",
            "A szakonkénti arányok megbízhatatlanok, mert a B szakra csak 25 nő jelentkezett."
          ],
          answer: 0,
          hint: "Az összesített arány súlyozott átlag. Kinek mi a súlya?",
          explain: R`A nők kb. 7%-a, a férfiak kb. 51%-a jelentkezett a könnyű A és B szakra. A szak összefügg a nemmel (ki hová jelentkezik) és a felvétellel is (hová nehéz bejutni) – ez a Simpson-paradoxon feltétele.
            Az összesített arányt elhinni épp a csapda. A jelentkezők <em>száma</em> önmagában nem számít, csak az arányok és a súlyok; a kis B-csoport sem magyarázza a megfordulást, hiszen négy szakon is a nők a jobbak.`
        },
        {
          type: "single", shuffle: true,
          q: R`Országonként az internet-hozzáférés aránya és a várható élettartam között $r = 0{,}8$. Melyik következtetés helyes?`,
          options: [
            "Az országok szintjén a kettő szorosan együtt jár; az egyénekről ebből nem következik semmi.",
            "Aki internetet használ, átlagosan tovább él.",
            "Az internet-hozzáférés 80%-ban magyarázza a várható élettartamot.",
            "Az egyének szintjén is legalább 0,8 a korreláció, hiszen ugyanazokból az emberekből számoltunk."
          ],
          answer: 0,
          hint: "Milyen szintű az adat: egyéni vagy csoport? És mit jelent $r$ a magyarázott hányadra?",
          explain: R`Csoportszintű adatból az egyénekre következtetni ökológiai tévkövetkeztetés – az egyéni kapcsolat lehet gyengébb, sőt ellentétes is (Robinson: államonként $-0{,}53$, egyénenként $+0{,}12$).
            A csoportátlagok korrelációja általában <em>erősebb</em>, mint az egyénieké. A „80%” az $r$ százalékként olvasása (a magyarázott hányad $r^2 = 64\%$ lenne) – és közös ok (gazdagság) is lehet.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért erősebb általában a csoportátlagok (pl. iskolák, megyék) korrelációja, mint az egyéneké?",
          options: [
            "Mert az átlagolás eltünteti a csoporton belüli (egyéni) szóródást.",
            "Mert csoportszinten több adatból számolunk.",
            "Mert csoportszinten nincs zavaró változó.",
            "Mert a csoportátlagok mindig egy egyenesre esnek."
          ],
          answer: 0,
          hint: "Gondolj a 3.3 belső és külső varianciájára: melyik marad meg az átlagokban?",
          explain: R`Az egyéni korrelációt a csoporton belüli „zaj” gyengíti; az átlagokban csak a külső szóródás marad meg. Csoportszinten valójában <em>kevesebb</em> adatpont van (megyék, nem emberek),
            a zavaró változók pedig ott is működnek (pl. gazdagság). Az átlagok sem esnek automatikusan egy egyenesre.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Ha a zavaró változót rögzítjük (rétegzés), a látszólagos kapcsolat eltűnik.",
            "Rétegzéssel csak olyan zavaró változót tudunk kiszűrni, amelyet megmértünk.",
            "Két független, de időben trendelő sorozat is erősen korrelálhat.",
            "Ha r = 0,94, az már biztosan ok-okozati kapcsolatot jelez.",
            "A korreláció előjeléből kiderül, melyik változó az ok."
          ],
          answer: [0, 1, 2],
          hint: "A fagyi–fulladás példára és a véletlen bolyongásokra gondolj. Szimmetrikus-e $r$?",
          explain: R`A fagyi–fulladás 0,94-es korrelációja azonos hőmérsékletű hónapokon belül eltűnik (nyáron $r = 0$) – de csak azért láttuk, mert a hőmérsékletet megmértük.
            A bolyongó sorozatok trendje látszólagos korrelációt hoz létre. A korreláció erőssége nem bizonyít okságot, és szimmetrikus ($r(x, y) = r(y, x)$), így az irányról semmit sem mond.`
        },
        {
          type: "single", shuffle: true,
          q: R`Könnyű szak: férfi 70%, nő 75% felvétel; nehéz szak: férfi 30%, nő 35%. A férfiak 25%-a jelentkezik a nehéz szakra. A nők több mint hány százalékának kell a nehéz szakra jelentkeznie, hogy összesítve a férfiak vezessenek?`,
          options: ["37,5%", "25%", "62,5%", "50%"],
          answer: 0,
          hint: R`Számold ki a férfiak összesített arányát, és írd fel a nőkét a nehéz szakra jelentkezők $p$ arányával.`,
          explain: R`Férfi: $0{,}75 \cdot 70\% + 0{,}25 \cdot 30\% = 60\%$. Nő: $(1 - p) \cdot 75\% + p \cdot 35\% = 75\% - 40p\%$. $75 - 40p \lt 60$ → $p \gt 0{,}375$.
            Azonos (25%-os) súlynál a nők vezetnek (65% vs. 60%) – nincs paradoxon. A 62,5% az $1 - p$, az 50% csak tipp: a küszöböt a súlyozott átlag adja.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms3-final": {
      title: "Fejezetzáró teszt – 3. Két változó kapcsolata",
      questions: [
        {
          type: "match",
          q: "Melyik mérőszám illik a változópárhoz? Párosítsd!",
          pairs: [
            ["szemüveges-e (igen / nem) és balkezes-e (igen / nem)", "Cramér-féle V vagy Yule-féle Q"],
            ["lakóhely típusa (főváros / város / község) és havi rezsiköltség (Ft)", "szóráshányados (H)"],
            ["egy használt autó kora (év) és piaci ára (Ft)", "Pearson-féle r"],
            ["két kritikus rangsora ugyanarról a 8 filmről", "Spearman-féle ρ vagy Kendall-féle τ"]
          ],
          hint: "Előbb döntsd el mindkét változó mérési skáláját, abból jön a kapcsolat fajtája, abból pedig a mérőszám.",
          explain: R`Két nominális (2×2-es tábla) → asszociáció: $\chi^2$-ből Cramér-féle $V$, 2×2-nél Yule-féle $Q$ is. Nominális + metrikus → vegyes kapcsolat: $H^2$ és $H$.
            Két metrikus → korreláció: pontdiagram és $r$. Két rangsor → rangkorreláció: $\rho$ vagy $\tau$. A lakóhely típusát hiába kódolod 1–3-mal: a kód nem teszi metrikussá.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tábla (sorok: férfi, nő; oszlopok: sportol, nem sportol): 35 | 15 és 15 | 35. Mennyi a $\chi^2$ és a Cramér-féle $V$?`,
          options: [
            R`$\chi^2 = 16$; $V = 0{,}40$`,
            R`$\chi^2 = 16$; $V = 0{,}16$`,
            R`$\chi^2 = 4$; $V = 0{,}20$`,
            R`$\chi^2 = 0$; $V = 0$`
          ],
          answer: 0,
          hint: R`Előbb a várt gyakoriságok (sorösszeg × oszlopösszeg / $N$), aztán mind a négy cella $(f - f^*)^2/f^*$ tagja.`,
          explain: R`Minden perem 50, $N = 100$, így minden $f^* = 25$. Mind a négy cellában $(\pm 10)^2/25 = 4$, összesen $\chi^2 = 16$; $V = \sqrt{16/(100 \cdot 1)} = 0{,}4$ – közepes kapcsolat.
            A $V = 0{,}16$ a gyökvonás elfelejtése, a $\chi^2 = 4$ csak egyetlen cella tagja, a 0 pedig a négyzetre emelés nélküli eltérések összege – az mindig 0, ezért kell a négyzet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a táblában (35 | 15 és 15 | 35) mennyi a Yule-féle $Q$?`,
          options: ["0,690", "0,400", "−0,690", "0,816"],
          answer: 0,
          hint: R`$Q = \dfrac{ad - bc}{ad + bc}$, ahol $a, b$ az első, $c, d$ a második sor.`,
          explain: R`$ad = 1225$, $bc = 225$: $Q = 1000/1450 \approx 0{,}690$. A 0,400 a Cramér-féle $V$ – a $Q$ ugyanazt a táblát jellemzően „szorosabbnak” mutatja, ezért mindig írd oda, melyik mutatót használtad.
            A $-0{,}690$ az $ad$ és $bc$ felcserélése, a 0,816 a nevezőben csak $ad$-vel oszt ($1000/1225$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cégnél a bérek szórása 50 (ezer Ft), a beosztásokon belüli (belső) variancia 900. A beosztás a bérek szóródásának hány százalékát magyarázza?`,
          options: ["64%", "80%", "40%", "36%"],
          answer: 0,
          hint: "A felbontás varianciákra igaz, nem szórásokra. És melyik mutató felel a „hány százalék” kérdésre?",
          explain: R`A teljes variancia $50^2 = 2500$, így $H^2 = 1 - 900/2500 = 0{,}64 = 64\%$, $H = 0{,}8$. A 80% a $H$ – az a szorosság, nem a magyarázott hányad.
            A 40% szórásokkal bont ($1 - 30/50$), pedig $\sigma \ne \sigma_B + \sigma_K$; a 36% a belső (meg nem magyarázott) rész.`
        },
        {
          type: "single", shuffle: true,
          q: R`10 pontra (egyik sincs az átlagvonalakon) az előjel-korrelációs együttható $K_r = -0{,}4$. Hány pont van a II. és IV. negyedben (az egyik változóban átlag fölött, a másikban alatta)?`,
          options: ["7", "3", "4", "6"],
          answer: 0,
          hint: R`$K_r = (p - q)/(p + q)$. Melyik betű számolja a II. és IV. negyed pontjait?`,
          explain: R`A II. és IV. negyedben negatív a szorzat: ez $q$. $p - q = -0{,}4 \cdot 10 = -4$ és $p + q = 10$ → $q = 7$, $p = 3$.
            A 3 a $p$ (az I. és III. negyed), a 4 a különbség, a 6 az $(1 - 0{,}4) \cdot 10$ – egyik sem a negatív szorzatok száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`$C = 12$, $\sigma_x = 4$, $\sigma_y = 5$. Mennyi a determinációs együttható?`,
          options: ["0,36", "0,60", "0,64", "0,03"],
          answer: 0,
          hint: R`Előbb az $r$, aztán a négyzete.`,
          explain: R`$r = 12/(4 \cdot 5) = 0{,}6$, $r^2 = 0{,}36$: a lineáris kapcsolat a szóródás 36%-át magyarázza. A 0,60 maga az $r$ (nem a magyarázott hányad), a 0,64 az $1 - r^2$,
            a 0,03 a varianciákkal való osztás ($12/(16 \cdot 25)$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy adatsor (Anscombe-kvartett): mindegyikben ugyanaz az átlag, a szórás, $r = 0{,}816$, és az illesztett egyenes is. Mi következik ebből?`,
          options: [
            "A pontfelhők alakjáról semmi biztosat – előbb rajzolni kell.",
            "Mind a négy pontfelhő gyakorlatilag ugyanúgy néz ki.",
            "Mind a négyben szoros, egyenes menti kapcsolat van, kiugró pont nélkül.",
            "Mind a négyben a kapcsolat a szóródás 81,6%-át magyarázza, ennyi elég a leíráshoz."
          ],
          answer: 0,
          hint: "Az $r$ egyetlen szám. Mit nem lát?",
          explain: R`Az egyik adatsor görbe, egy másikban egy kiugró pont rontja el az egyébként tökéletes egyenest, a negyedikben egyetlen pont teremti a kapcsolatot. Az $r$ csak „szivar” alakú felhőnél ír le jól.
            A 81,6% ráadásul az $r$ százalékként olvasása; a determinációs együttható $0{,}816^2 \approx 0{,}67$ lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két kritikus rangsorol 6 filmet. Az első sorrendje 1, 2, 3, 4, 5, 6; a másodiké ugyanezekre 2, 1, 3, 4, 6, 5. Mennyi a Spearman-féle $\rho$ és a Kendall-féle $\tau$?`,
          options: [
            R`$\rho \approx 0{,}886$; $\tau \approx 0{,}733$`,
            R`$\rho \approx 0{,}733$; $\tau \approx 0{,}886$`,
            R`$\rho \approx 0{,}886$; $\tau \approx 0{,}867$`,
            R`$\rho \approx 0{,}886$; $\tau \approx 0{,}367$`
          ],
          answer: 0,
          hint: R`$\rho$-hoz a $\sum D^2$ és $n^3 - n = 210$; $\tau$-hoz nézd végig a 15 párt.`,
          explain: R`$D$: −1, 1, 0, 0, −1, 1 → $\sum D^2 = 4$, $\rho = 1 - 24/210 \approx 0{,}886$. Ellentétes pár csak kettő: (1–2) és (5–6), így $P = 13$, $Q = 2$, $\tau = 11/15 \approx 0{,}733$.
            A felcserélt változat összekeveri a kettőt; a 0,867 csak az egyetértő párok aránya ($13/15$); a 0,367 a 30 „párral” (felezés nélkül) számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`$x$: 1, 2, 3, 4, 5, 6; $y$: 2, 1, 4, 3, 6, 30. A 6. pont $y$-értékét tévedésből 30 helyett 300-nak rögzítik. Mi történik a Pearson-féle $r$-rel és a Spearman-féle $\rho$-val?`,
          options: [
            R`$\rho$ nem változik, $r$ megváltozik.`,
            R`Mindkettő változatlan, hiszen a pont sorrendje ugyanaz.`,
            R`$r$ nem változik, $\rho$ megváltozik.`,
            R`Mindkettő ugyanannyival változik.`
          ],
          answer: 0,
          hint: "Megváltozik-e a 6. pont rangja? És a $d_y$ eltérése?",
          explain: R`A 30 és a 300 is „a legnagyobb” $y$, így a rangok és $\rho \approx 0{,}886$ változatlanok. Az $r$ viszont az értékekkel számol: $0{,}743$-ról $0{,}663$-ra változik.
            A rangkorreláció <b>robusztusabb</b>: egy szélsőséges érték legfeljebb egy rangnyit számít. Az $r$ nem robusztus.`
        },
        {
          type: "single", shuffle: true,
          q: "Életkor (5–90 év) és reakcióidő: gyerekkorban csökken, idős korban nő (U alak). Mivel írd le a kapcsolatot?",
          options: [
            "pontdiagrammal – se az r, se a ρ nem írja le jól",
            "Spearman-féle ρ-val, mert a kapcsolat nem lineáris",
            "Pearson-féle r-rel, mert mindkét változó metrikus",
            "Cramér-féle V-vel, mert az életkort csoportokba lehet sorolni"
          ],
          answer: 0,
          hint: "Monoton-e a kapcsolat? Mit lát a rangkorreláció?",
          explain: R`Az U alakú kapcsolat nem monoton: az $r$ gyengének mutatná (a két ág kioltja egymást), a $\rho$ is csak a monoton kapcsolatot látja. A döntési táblázat szerint: ábra, és a 11. fejezet modelljei.
            A $\rho$ a monoton, de görbe kapcsolatra jó (pl. exponenciális), nem az U alakra; a csoportosítás pedig információt dob el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két tanár: A-nál a jó osztályokban 90%, a gyengékben 60% sikeres vizsga; B-nél 85% és 55%. A tanítványainak 80%-a gyenge osztályba jár, B-éinek csak 20%-a. Melyik állítás igaz?`,
          options: [
            "A mindkét osztálytípusban jobb, összesítve mégis B tűnik jobbnak (66% vs. 79%).",
            "B a jobb tanár, hiszen összesítve 79% a 66%-kal szemben.",
            "A a jobb, és összesítve is A vezet (75% vs. 70%).",
            "A két tanár egyforma, mert az eltérések osztálytípusonként azonosak (5 százalékpont)."
          ],
          answer: 0,
          hint: "Számold ki a súlyozott átlagokat, és vesd össze a csoportonkénti arányokkal.",
          explain: R`A: $0{,}2 \cdot 90\% + 0{,}8 \cdot 60\% = 66\%$; B: $0{,}8 \cdot 85\% + 0{,}2 \cdot 55\% = 79\%$. Simpson-paradoxon: a zavaró változó az osztály típusa (összefügg a tanárral és a sikerrel is).
            Itt a bontott kép a fair. A 75% vs. 70% súlyozatlan átlag – az nem az összesített arány.`
        },
        {
          type: "single", shuffle: true,
          q: R`A tóparti kisvárosban 12 hónapra $r(F, D) \approx 0{,}94$ a fagylalteladás és a fulladások között, de a nyári hónapokon belül $r(F, D) = 0$. Mi a helyes következtetés?`,
          options: [
            "A hőmérséklet közös ok: azonos hőmérsékletnél nincs kapcsolat a fagyi és a fulladás között.",
            "A nyári adat a hibás, mert öt hónap kevés – a 12 havi 0,94 a megbízható.",
            "A fagyi télen okoz fulladást, nyáron nem.",
            R`$r^2 \approx 0{,}89$, tehát a fulladások 89%-át a fagyi okozza.`
          ],
          answer: 0,
          hint: "Mi történik a kapcsolattal, ha a harmadik változót (rögzítve) rétegezzük?",
          explain: R`Ez a rétegzés: hasonló hőmérsékletű hónapokon belül a kapcsolat eltűnik (nyáron 0, télen $\approx -0{,}06$), mert mindkettőt a meleg hajtja ($r(T, F) \approx 0{,}98$, $r(T, D) \approx 0{,}94$).
            Az $r^2$ együttmozgást mér, nem okozati részesedést – a fagyitilalom egyetlen életet sem mentene meg.`
        },
        {
          type: "multi",
          q: "A fagyi–fulladás adatokról (megfigyelés, nem kísérlet) melyik megfogalmazás helyes? (Több jó válasz is lehet.)",
          options: [
            "A fagylalteladás és a fulladások száma szorosan együtt jár (r ≈ 0,94).",
            "A két változó összefügg, de hőmérséklet szerint rétegezve a kapcsolat eltűnik.",
            "A melegebb hónapokban mindkettő magasabb.",
            "A fagyi a fulladások 89%-áért felelős.",
            "A fagyi fogyasztása növeli a fulladás kockázatát."
          ],
          answer: [0, 1, 2],
          hint: "A menetrend utolsó lépése: ok-okozati szavak nélkül írj („együtt jár”, „összefügg”), hacsak nem kísérletből van az adat.",
          explain: R`Az első három leíró: együttmozgást és a rétegzés eredményét mondja ki. A „felelős” és a „növeli a kockázatot” okságot állít – ezt korrelációból nem lehet, csak kísérlettel
            vagy a zavaró változók gondos kiszűrésével. A 89% ráadásul az $r^2$ ok-okozati értelmezése.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
