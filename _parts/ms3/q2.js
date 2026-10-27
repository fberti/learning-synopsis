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
