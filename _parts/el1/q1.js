    /* ------------------------------------------------ 1.1 */
    "el1-11": {
      title: "Kvíz – 1.1 Az atom és a töltés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $(3 \cdot 10^4) \cdot (5 \cdot 10^{-7})$ normálalakban?`,
          options: [R`$1{,}5 \cdot 10^{-2}$`, R`$1{,}5 \cdot 10^{-3}$`, R`$1{,}5 \cdot 10^{-28}$`, R`$6 \cdot 10^{10}$`],
          answer: 0,
          hint: "A mantisszákat szorozd össze, a kitevőket add össze. Aztán nézd meg, tényleg 1 és 10 közé esik-e a mantissza.",
          explain: R`Mantisszák: $3 \cdot 5 = 15$, kitevők: $4 + (-7) = -3$, tehát $15 \cdot 10^{-3}$. Ez még nem normálalak ($15 \ge 10$): $15 = 1{,}5 \cdot 10^1$, így az eredmény $1{,}5 \cdot 10^{-2}$. Az $1{,}5 \cdot 10^{-3}$ akkor jön ki, ha a 15-öt 1,5-re írod át, de a kitevőt elfelejted eggyel növelni. Az $1{,}5 \cdot 10^{-28}$-ban a kitevőket összeszoroztad ($4 \cdot (-7)$) összeadás helyett. A $6 \cdot 10^{10}$ az osztás eredménye ($3/5 = 0{,}6$ és $4 - (-7) = 11$).`
        },
        {
          type: "match",
          q: "Párosítsd a prefixumot az értékével!",
          pairs: [
            ["m (milli)", "ezred rész"],
            [R`$\mu$ (mikro)`, "milliomod rész"],
            ["n (nano)", "milliárdod rész"],
            ["k (kilo)", "ezerszeres"],
            ["M (mega)", "milliószoros"]
          ],
          hint: "A prefixumok ezresével lépnek. Figyelj a kis m és a nagy M különbségére!",
          explain: R`m = $10^{-3}$ (ezred), $\mu$ = $10^{-6}$ (milliomod), n = $10^{-9}$ (milliárdod), k = $10^3$ (ezer), M = $10^6$ (millió). A leggyakoribb hiba a kis m (milli) és a nagy M (mega) összekeverése: a kettő között $10^9$-szeres a különbség. A $\mu$ helyett billentyűzeten gyakran „u”-t írnak ($10\,\text{uC} = 10\,\mu\text{C}$), de az nem milli.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ionnak 20 protonja, 20 neutronja és 18 elektronja van. Mekkora a töltése?`,
          options: [R`$+2e$`, R`$-2e$`, R`$+22e$`, R`$-18e$`],
          answer: 0,
          hint: "A nettó töltés: (protonok száma − elektronok száma) · e. Melyik részecske nem számít bele?",
          explain: R`$Q = (20 - 18)\,e = +2e$: két elektron hiányzik, ezért pozitív (ez a $\text{Ca}^{2+}$ ion). A $-2e$ előjelhiba: az elektron<em>hiány</em> pozitív töltést jelent, nem negatívat. A $+22e$-ben a neutronokat is hozzáadtad ($20 + 20 - 18$), pedig a neutron töltése 0. A $-18e$ csak az elektronokat számolja, a protonok töltését elhagyja.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "A pozitív töltésű test elektronokat veszített.",
            "A pozitív töltésű test protonokat kapott.",
            "A semleges testben egyáltalán nincs töltés.",
            "Szilárd testben a töltés átrendeződésekor elektronok vándorolnak, a protonok a helyükön maradnak.",
            "Minél több neutron van egy atomban, annál pozitívabb a töltése."
          ],
          answer: [0, 3],
          hint: "Gondold végig, melyik részecske tud elmozdulni egy szilárd testben, és mennyi a neutron töltése.",
          explain: R`A pozitív test elektront <b>veszített</b> – a protonokat a mag erősen fogja, és egy proton kb. 1836-szor nehezebb az elektronnál, ezért szilárd testben csak elektronok vándorolnak. A „protont kapott” a tipikus félreértés. A semleges test tele van töltéssel, csak a pozitív és a negatív pontosan kiegyenlíti egymást (ez kell majd a megosztáshoz). A neutron töltése 0, akármennyi van belőle, nem számít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy tárgy töltése $-8\,\text{nC}$. Hány elektron van rajta többletben? ($e \approx 1{,}6 \cdot 10^{-19}\,\text{C}$)`,
          options: [R`$5 \cdot 10^{10}$`, R`$1{,}3 \cdot 10^{-27}$`, R`$5 \cdot 10^{19}$`, R`$5 \cdot 10^{13}$`],
          answer: 0,
          hint: R`Töltésből darabszám: szorozni vagy osztani kell $e$-vel? Előbb váltsd át a nC-ot coulombra.`,
          explain: R`$N = |Q|/e = 8 \cdot 10^{-9} / 1{,}6 \cdot 10^{-19} = 5 \cdot 10^{10}$ (ötvenmilliárd elektron). Az $1{,}3 \cdot 10^{-27}$ a szorzás ($Q \cdot e$): darabszámnak $10^{-27}$ képtelenség, ilyenkor fordítva számoltál. Az $5 \cdot 10^{19}$ akkor jön ki, ha a „nano” prefixumot elhagyod (8 C-tal számolsz), az $5 \cdot 10^{13}$ pedig akkor, ha a nC-ot µC-nak veszed ($8 \cdot 10^{-6}\,\text{C}$). Az előjel csak annyit mond: többlet van, nem hiány – a darabszám pozitív.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik töltés <b>nem</b> lehet egy porszem töltése? ($e \approx 1{,}6 \cdot 10^{-19}\,\text{C}$)`,
          options: [R`$4{,}0 \cdot 10^{-19}\,\text{C}$`, R`$3{,}2 \cdot 10^{-19}\,\text{C}$`, R`$1{,}6 \cdot 10^{-18}\,\text{C}$`, R`$-4{,}8 \cdot 10^{-19}\,\text{C}$`],
          answer: 0,
          hint: R`Oszd el mindegyiket $e$-vel. Mi a feltétele, hogy egy töltés előfordulhasson?`,
          explain: R`A töltés kvantált: csak $e$ egész számú többszöröse lehet. $4{,}0 \cdot 10^{-19}/1{,}6 \cdot 10^{-19} = 2{,}5$ – fél elektron nincs, ezért ez lehetetlen. A többi: $3{,}2 \cdot 10^{-19}\,\text{C} = 2e$, $1{,}6 \cdot 10^{-18}\,\text{C} = 10e$ (a $10^{-18}$ ne tévesszen meg: tízszer annyi, mint $1{,}6 \cdot 10^{-19}$), $-4{,}8 \cdot 10^{-19}\,\text{C} = -3e$ (a negatív előjel csak elektrontöbbletet jelent, attól még egész számú többszörös).`
        },
        {
          type: "single", shuffle: true,
          q: R`Két egyforma fémgömb töltése $+5\,\text{nC}$ és $-11\,\text{nC}$. Összeérintjük, majd szétválasztjuk őket. Mekkora lesz egyenként a töltésük?`,
          options: [R`$-3\,\text{nC}$`, R`$+3\,\text{nC}$`, R`$+8\,\text{nC}$`, R`$-6\,\text{nC}$`],
          answer: 0,
          hint: "Az összes töltés megmarad. Add össze előjelesen, aztán oszd el a két egyforma gömb között.",
          explain: R`Töltésmegmaradás: az összeg $+5 + (-11) = -6\,\text{nC}$, és egyforma fémgömbökön ez egyenlően oszlik el: $-3\,\text{nC}$ mindkettőn. A $+3\,\text{nC}$ előjelhiba. A $+8\,\text{nC}$ előjel nélküli összeadásból jön ($(5 + 11)/2$). A $-6\,\text{nC}$ az összes töltés – azt még meg kell felezni. Ellenőrzés: $-3 + (-3) = -6$, ugyanannyi, mint előtte.`
        }
      ]
    },

    /* ------------------------------------------------ 1.2 */
    "el1-12": {
      title: "Kvíz – 1.2 Vonzás és taszítás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy nejlonharisnyát gyapjúval dörzsölsz. Milyen töltésű lesz a nejlon és a gyapjú? (Triboelektromos sor, $+ \to -$: üveg · emberi haj · nejlon · gyapjú · selyem · papír · pamut · borostyán · gumi · poliészter · PVC · teflon)`,
          options: [
            "A nejlon pozitív, a gyapjú negatív.",
            "A nejlon negatív, a gyapjú pozitív.",
            "Mindkettő negatív lesz.",
            "A nejlon pozitív, mert protonokat kap a gyapjútól."
          ],
          answer: 0,
          hint: "A sorban feljebb álló anyag ad elektront az alatta állónak. Melyik áll feljebb? És mi lesz attól, aki elektront ad?",
          explain: R`A nejlon a gyapjú fölött áll, ezért ő ad elektront: a nejlon pozitív (elektronhiány), a gyapjú negatív (többlet). A fordított válasz a sor irányának összekeverése. „Mindkettő negatív” nem lehet: a töltés megmarad, ami az egyikről elmegy, a másikra kerül. A „protont kap” rossz magyarázat: dörzsöléskor mindig elektronok vándorolnak, a pozitív töltés elektronhiányt jelent.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanazzal a pamutkendővel előbb egy üvegrudat, aztán egy teflonrudat dörzsölsz. Milyen töltésű lesz a kendő a két esetben? (A sor: üveg · haj · nejlon · gyapjú · selyem · papír · pamut · borostyán · gumi · poliészter · PVC · teflon)`,
          options: [
            "Az üvegnél negatív, a teflonnál pozitív.",
            "Az üvegnél pozitív, a teflonnál negatív.",
            "Mindkét esetben negatív.",
            "Mindkét esetben pozitív."
          ],
          answer: 0,
          hint: "Egy anyagnak nincs „saját” töltése. Mindkét párnál külön nézd meg, ki áll feljebb a sorban.",
          explain: R`Az üveg a pamut fölött áll: az üveg ad elektront, a kendő kapja, tehát negatív. A teflon a pamut alatt áll: most a kendő ad elektront, és pozitív lesz. A partner dönti el az előjelet. A fordított válasz a sor irányának felcserélése; a „mindkét esetben ugyanaz” válaszok abból a tévhitből jönnek, hogy a pamutnak saját, állandó töltése van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kis tárgyat vonz a negatív lufi, és vonz a pozitív üvegrúd is. Melyik magyarázat illik a megfigyelésre?`,
          options: [
            "A tárgy semleges: mindkét töltött test megosztással vagy polarizációval vonzza.",
            "A tárgy pozitív, ezért vonzza a lufi.",
            "A tárgy negatív, ezért vonzza az üveg.",
            "A tárgyon kétféle töltés van többletben, ezért mindkettőt vonzza."
          ],
          answer: 0,
          hint: "Mi történne egy pozitív tárggyal a pozitív üveg mellett? És egy negatívval a lufi mellett?",
          explain: R`Ha a tárgy pozitív lenne, az üveg taszítaná; ha negatív, a lufi taszítaná. Mindkettő vonzza, tehát semleges: a közelített töltés megosztja (vezetőben) vagy polarizálja (szigetelőben), és a közelebbi, ellentétes oldalra nagyobb erő hat. A tanulság: a vonzás nem bizonyítja, hogy mindkét test töltött – csak a taszítás biztos jel. „Kétféle töltés többletben” nincs: a nettó töltés egyetlen szám.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Ha két test taszítja egymást, mindkettő töltött, és azonos előjelű.",
            "Ha két test vonzza egymást, mindkettő biztosan töltött.",
            "A semleges papírfecnit a pozitív és a negatív rúd is vonzza.",
            "Megosztáskor a fémgolyó összes töltése megváltozik.",
            "Hogy egy anyag dörzsöléskor pozitív vagy negatív lesz, az a dörzsölő partnertől függ."
          ],
          answer: [0, 2, 4],
          hint: "Melyik jelenség jöhet létre semleges testtel is? És mi történik a megosztásnál az összes töltéssel?",
          explain: R`A taszítás biztos jel: semleges testet semmi sem taszít, tehát mindkettő töltött, azonos előjellel. A vonzás nem bizonyít semmit: az egyik test lehet semleges (megosztás, polarizáció) – ezért a papírfecnit bármelyik előjelű rúd felkapja. Megosztáskor a töltés csak átrendeződik, az összes töltés 0 marad. Az előjelet az anyagpár dönti el (a triboelektromos sorban ki áll feljebb).`
        },
        {
          type: "match",
          q: "Párosítsd a jelenséget a nevével!",
          pairs: [
            ["Fémben a szabad elektronok a test egyik oldalára vándorolnak egy közeli töltés hatására.", "megosztás"],
            ["Szigetelőben a molekulák apró dipólusokká válnak, a test felszínén két ellentétes töltésréteg jelenik meg.", "polarizáció"],
            ["A fóliagolyó hozzáér a negatív fésűhöz, aztán eltaszítódik tőle.", "töltésátadás érintéssel"],
            ["Dörzsöléskor a feljebb álló anyag ad elektront az alatta állónak.", "triboelektromos sor"]
          ],
          hint: "A megosztás és a polarizáció közti különbség: hová juthatnak el az elektronok – az egész testen át, vagy csak a saját atomjukon, molekulájukon belül?",
          explain: R`Megosztás: vezetőben az elektronok az egész testen átvándorolnak. Polarizáció: szigetelőben az elektronok csak az atomon, molekulán belül tolódnak el, a molekulák dipólusok lesznek. A kettőt könnyű összekeverni, mert a hatás ugyanaz (a közeli oldal ellentétes előjelű, ezért vonzás). A visszapattanó golyó érintéskor elektronokat kap a fésűtől, így maga is negatív lesz, és a fésű taszítja. A triboelektromos sor mondja meg, ki ad és ki kap elektront dörzsöléskor.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy semleges elektroszkóphoz felülről, érintés nélkül pozitív üvegrudat közelítünk. Mi történik a lemezkékkel?`,
          options: [
            "Pozitívak lesznek, és szétállnak.",
            "Negatívak lesznek, és szétállnak.",
            "Nem mozdulnak, mert a műszer összes töltése 0.",
            "Ellentétes töltésűek lesznek, és összetapadnak."
          ],
          answer: 0,
          hint: "Merre mozdulnak a fémrúd elektronjai, ha felülről pozitív rúd vonzza őket? Mi marad lent?",
          explain: R`A pozitív rúd felfelé vonzza az elektronokat (megosztás), ezért lent, a lemezkéken elektronhiány lesz: mindkettő pozitív, és szétállnak. A „negatívak” válasz az elektronok mozgásirányát fordítja meg. A műszer összes töltése valóban 0, de a töltés átrendeződik, és a lemezkéken nem nulla. A két lemezke a rúd ugyanazon végén van, ezért azonos előjelű – taszítják egymást, nem vonzzák.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szigetelő állványon álló semleges fémgömb bal oldalához <b>pozitív</b> rudat közelítünk. Közben ujjal megérintjük a gömb jobb oldalát, aztán elvesszük az ujjunkat, végül a rudat. Milyen lesz a gömb töltése?`,
          options: [
            "Negatív.",
            "Pozitív, mint a rúd.",
            "Semleges, mert megosztással nem lehet töltést adni.",
            "A bal oldala negatív, a jobb oldala pozitív marad."
          ],
          answer: 0,
          hint: "A pozitív rúd vonzza az elektronokat. Ha az ujjadon át a testedből utánpótlás jöhet, mi kerül a gömbre, és mi marad ott, ha előbb az ujjat veszed el?",
          explain: R`A pozitív rúd elektronokat vonz a gömbbe – az ujjon (a testünkön) át elektronok áramlanak a gömbre. Az ujj elvétele után ez a többlet nem tud távozni, és a rúd eltávolítása után az egész gömbön eloszlik: a gömb negatív, a rúddal ellentétes. Ez töltés megosztással, érintés nélkül (a rúd nem ért hozzá). A „semleges” válasz igaz lenne az ujj nélkül – az ujj tette lehetővé a töltésátvitelt. A „bal negatív, jobb pozitív” csak addig áll, amíg a rúd ott van; utána a töltés egyenletesen eloszlik.`
        }
      ]
    },

    /* ------------------------------------------------ 1.3 */
    "el1-13": {
      title: "Kvíz – 1.3 A Coulomb-törvény",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két töltés $F$ erővel hat egymásra. Az egyik töltést háromszorosára növeljük, és a távolságot is háromszorosára növeljük. Mekkora lesz az erő?`,
          options: [R`$F/3$`, R`$F$`, R`$F/9$`, R`$2F/9$`],
          answer: 0,
          hint: "Külön nézd a töltés és a távolság hatását, aztán szorozd össze a két tényezőt. A távolság négyzete számít.",
          explain: R`A töltés miatt $3$-szoros, a távolság miatt $\frac{1}{3^2} = \frac19$-szeres: $3 \cdot \frac19 = \frac13$, tehát $F/3$. Az $F$ akkor jön ki, ha a távolságot nem emeled négyzetre ($3/3$). Az $F/9$ a töltés növelését felejti el. A $2F/9$ a töltések <em>összegével</em> számol ($(3 + 1)/(1 + 1) = 2$-szeres): az erő a töltések szorzatával arányos, nem az összegükkel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két töltés $12\,\text{N}$ erővel taszítja egymást. Kétszer olyan messzire visszük őket egymástól. Mekkora lesz az erő?`,
          options: [R`$3\,\text{N}$`, R`$6\,\text{N}$`, R`$24\,\text{N}$`, R`$48\,\text{N}$`],
          answer: 0,
          hint: R`Az erő a távolság négyzetével fordítottan arányos. Mi lesz $2^2$?`,
          explain: R`Kétszeres távolság → $\frac{1}{2^2} = \frac14$-szeres erő: $12/4 = 3\,\text{N}$. A $6\,\text{N}$ a leggyakoribb hiba: „kétszer messzebb, fele akkora” – nem fele, hanem negyede. A $24$ és a $48\,\text{N}$ az irányt fordítja meg: távolításkor az erő csökken, nem nő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora erővel taszítja egymást egy $4\,\text{nC}$-os és egy $5\,\text{nC}$-os töltés $2\,\text{cm}$-ről? ($k = 9 \cdot 10^9\,\text{N m}^2/\text{C}^2$)`,
          options: [R`$4{,}5 \cdot 10^{-4}\,\text{N}$`, R`$9 \cdot 10^{-6}\,\text{N}$`, R`$4{,}5 \cdot 10^{-8}\,\text{N}$`, R`$4{,}5 \cdot 10^{-22}\,\text{N}$`],
          answer: 0,
          hint: R`Mindent SI-be: nC → C, cm → m, és csak utána emelj négyzetre. Figyelj $k$ kitevőjére!`,
          explain: R`$F = 9 \cdot 10^9 \cdot \dfrac{4 \cdot 10^{-9} \cdot 5 \cdot 10^{-9}}{(0{,}02)^2} = 9 \cdot 10^9 \cdot \dfrac{2 \cdot 10^{-17}}{4 \cdot 10^{-4}} = 4{,}5 \cdot 10^{-4}\,\text{N}$. A $9 \cdot 10^{-6}$ akkor jön ki, ha $r$-et nem emeled négyzetre ($0{,}02$-vel osztasz). A $4{,}5 \cdot 10^{-8}$-ban a cm-t nem váltottad m-re ($2^2 = 4$-gyel osztasz). A $4{,}5 \cdot 10^{-22}$ a $k = 9 \cdot 10^{-9}$ hibája: $k$ óriási szám, $10^{9}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $1\,\text{nC}$-os és egy $5\,\text{nC}$-os töltés taszítja egymást. A kisebbikre $2 \cdot 10^{-4}\,\text{N}$ erő hat. Mekkora erő hat a nagyobbikra?`,
          options: [
            R`Ugyanakkora: $2 \cdot 10^{-4}\,\text{N}$.`,
            R`Ötször akkora: $10^{-3}\,\text{N}$.`,
            R`Ötödakkora: $4 \cdot 10^{-5}\,\text{N}$.`,
            "A távolság ismerete nélkül nem lehet megmondani."
          ],
          answer: 0,
          hint: R`Nézd meg a Coulomb-törvényt: melyik töltés szerepel benne, $Q_1$ vagy $Q_2$? És mit mond Newton III. törvénye?`,
          explain: R`A képletben a két töltés szorzata áll, $|Q_1 \cdot Q_2|$, ez mindkét töltésre ugyanaz. Newton III. törvénye szerint is a két test ugyanakkora, ellentétes irányú erővel hat egymásra – akkor is, ha a töltések különbözők. A „nagyobb töltésre nagyobb erő hat” tipikus tévedés. A távolságra nincs szükség: az egyik erőt már ismerjük, a másik ugyanannyi.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az elektromos és a gravitációs erőről? (Több jó válasz is lehet.)",
          options: [
            R`A hidrogénatomban az $F_e / F_g$ arány nem függ a proton–elektron távolságtól.`,
            R`Mindkét erő a távolság négyzetével fordítottan arányos.`,
            R`Két $1\,\text{C}$-os töltés $1\,\text{m}$-ről kb. $9 \cdot 10^9\,\text{N}$ erővel hatna egymásra.`,
            "Az elektromos erőt azért nem érezzük a hétköznapokban, mert a távolsággal sokkal gyorsabban csökken, mint a gravitáció.",
            "A gravitációs erő is lehet taszító, ha a két test ellentétes előjelű."
          ],
          answer: [0, 1, 2],
          hint: R`Hasonlítsd össze a két képlet szerkezetét: $k Q_1 Q_2 / r^2$ és $G m_1 m_2 / r^2$. Mi a különbség a töltés és a tömeg között?`,
          explain: R`Mindkét erő $1/r^2$ szerint csökken, ezért a hányadosukból $r^2$ kiesik: a hidrogénatomban $F_e/F_g \approx 2{,}3 \cdot 10^{39}$, távolságtól függetlenül. Két 1 C-os töltés között $9 \cdot 10^9 \cdot 1 \cdot 1 / 1^2 = 9 \cdot 10^9\,\text{N}$ hatna – álló töltésként az 1 C óriási. Az elektromos erőt nem a gyorsabb csökkenés miatt nem érezzük, hanem mert az anyag szinte tökéletesen semleges: a pozitív és negatív töltések hatása kioltja egymást. Tömegből nincs negatív, ezért a gravitáció mindig vonz, és nagy léptékben összeadódik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $x = 0$-ban és az $x = 30\,\text{cm}$-ben egy-egy $+1\,\mu\text{C}$-os töltés van. Mekkora és milyen irányú eredő erő hat egy $+1\,\text{nC}$-os próbatöltésre az $x = 10\,\text{cm}$-ben? ($k = 9 \cdot 10^9\,\text{N m}^2/\text{C}^2$)`,
          options: [
            R`$6{,}75 \cdot 10^{-4}\,\text{N}$, jobbra`,
            R`$6{,}75 \cdot 10^{-4}\,\text{N}$, balra`,
            R`$1{,}125 \cdot 10^{-3}\,\text{N}$, jobbra`,
            R`$0\,\text{N}$ (a két egyforma töltés kioltja egymást)`
          ],
          answer: 0,
          hint: "Számold ki külön a két erőt (10 cm-ről és 20 cm-ről), döntsd el mindkettő irányát, és csak utána add össze előjelesen.",
          explain: R`Bal töltés, $10\,\text{cm}$-ről: $9 \cdot 10^9 \cdot 10^{-15}/0{,}01 = 9 \cdot 10^{-4}\,\text{N}$, taszít → jobbra. Jobb töltés, $20\,\text{cm}$-ről: $9 \cdot 10^9 \cdot 10^{-15}/0{,}04 = 2{,}25 \cdot 10^{-4}\,\text{N}$, taszít → balra. Eredő: $9 \cdot 10^{-4} - 2{,}25 \cdot 10^{-4} = 6{,}75 \cdot 10^{-4}\,\text{N}$ jobbra – a közelebbi töltés győz. Az $1{,}125 \cdot 10^{-3}$ az irány nélküli összeadás hibája. A „balra” a két irány összekeverése. Nulla csak pontosan középen ($x = 15\,\text{cm}$) lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $x = 0$-ban $+1\,\mu\text{C}$, az $x = 40\,\text{cm}$-ben $+9\,\mu\text{C}$ töltés van. A két töltés között hol nulla az eredő erő egy $+1\,\text{nC}$-os próbatöltésre?`,
          options: [R`$x = 10\,\text{cm}$`, R`$x = 20\,\text{cm}$`, R`$x = 30\,\text{cm}$`, R`$x = 4\,\text{cm}$`],
          answer: 0,
          hint: R`Ott nulla, ahol a két erő egyenlő: $\dfrac{1}{x^2} = \dfrac{9}{(0{,}4 - x)^2}$. Vonj gyököt mindkét oldalból.`,
          explain: R`Gyökvonás után: $\dfrac{1}{x} = \dfrac{3}{0{,}4 - x}$, vagyis $0{,}4 - x = 3x$, $x = 0{,}1\,\text{m} = 10\,\text{cm}$. A kilencszer nagyobb töltés háromszor messzebb van ($30\,\text{cm}$), és $9/3^2 = 1$. A felezőpont ($20\,\text{cm}$) csak egyforma töltéseknél jó. A $30\,\text{cm}$ a nagyobb töltéshez van közel – ott az győz. A $4\,\text{cm}$ akkor jön ki, ha $1/r^2$ helyett $1/r$-rel számolsz ($0{,}4 - x = 9x$).`
        }
      ]
    },

    /* ------------------------------------------------ 1.4 */
    "el1-14": {
      title: "Kvíz – 1.4 Az elektromos mező",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy $2\,\text{nC}$-os próbatöltésre $8 \cdot 10^{-5}\,\text{N}$ erő hat. Mekkora ott a térerősség?`,
          options: [R`$4 \cdot 10^{4}\,\text{N/C}$`, R`$4 \cdot 10^{1}\,\text{N/C}$`, R`$2{,}5 \cdot 10^{-5}\,\text{N/C}$`, R`$1{,}6 \cdot 10^{-13}\,\text{N/C}$`],
          answer: 0,
          hint: R`A térerősség az egységnyi töltésre jutó erő. Melyik mennyiséget osztod melyikkel? Ne felejtsd el a nC-ot coulombra váltani.`,
          explain: R`$E = F/q = 8 \cdot 10^{-5} / (2 \cdot 10^{-9}) = 4 \cdot 10^4\,\text{N/C}$. A $4 \cdot 10^{1}$ akkor jön ki, ha a nC-ot µC-nak veszed ($2 \cdot 10^{-6}\,\text{C}$). A $2{,}5 \cdot 10^{-5}$ a fordított osztás ($q/F$), az $1{,}6 \cdot 10^{-13}$ pedig a szorzat ($F \cdot q$) – egyik sem N/C mértékegységű.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy helyen a térerősség $2000\,\text{N/C}$, felfelé mutat. Mekkora és milyen irányú erő hat egy $-4\,\text{nC}$-os töltésre?`,
          options: [
            R`$8 \cdot 10^{-6}\,\text{N}$, lefelé`,
            R`$8 \cdot 10^{-6}\,\text{N}$, felfelé`,
            R`$2 \cdot 10^{3}\,\text{N}$, lefelé`,
            R`$5 \cdot 10^{11}\,\text{N}$, lefelé`
          ],
          answer: 0,
          hint: R`$F = |q| \cdot E$. Az irányhoz: a mező iránya a <em>pozitív</em> töltésre ható erő iránya. Mi a helyzet negatív töltéssel?`,
          explain: R`$F = |q| \cdot E = 4 \cdot 10^{-9} \cdot 2000 = 8 \cdot 10^{-6}\,\text{N}$. A töltés negatív, ezért az erő a mezővel ellentétes: lefelé. A „felfelé” a negatív töltésnél elfelejtett irányfordítás. A $2 \cdot 10^3\,\text{N}$ a térerősséget tekinti erőnek (N/C ≠ N). Az $5 \cdot 10^{11}$ szorzás helyett osztás ($E/q$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pontban egy $3\,\text{pC}$-os próbatöltésre $F$ erő hat, a térerősség $E$. Kicseréljük a próbatöltést egy $6\,\text{pC}$-osra. Mi változik?`,
          options: [
            R`A térerősség marad $E$, az erő $2F$ lesz.`,
            R`A térerősség $2E$, az erő $2F$ lesz.`,
            R`A térerősség $E/2$ lesz, az erő marad $F$.`,
            R`Sem a térerősség, sem az erő nem változik.`
          ],
          answer: 0,
          hint: "A térerősség a helyről mond valamit, vagy a próbatöltésről? Az erő pedig?",
          explain: R`A térerősség a mezőt létrehozó (forrás) töltésektől és a helytől függ, a próbatöltéstől nem: marad $E$. Az erő $F = qE$, a próbatöltéssel arányos, ezért duplázódik. A „$2E$” az erőt és a térerősséget keveri össze. Az „$E/2$” az $E = F/q$ képletet úgy olvassa, mintha $F$ állandó lenne – pedig $F$ is változik, a hányados marad.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a térerősség egy $4\,\text{nC}$-os pontszerű töltéstől $20\,\text{cm}$-re? ($k = 9 \cdot 10^9\,\text{N m}^2/\text{C}^2$)`,
          options: [R`$9 \cdot 10^{2}\,\text{N/C}$`, R`$1{,}8 \cdot 10^{2}\,\text{N/C}$`, R`$9 \cdot 10^{-2}\,\text{N/C}$`, R`$9 \cdot 10^{-16}\,\text{N/C}$`],
          answer: 0,
          hint: R`$E = k|Q|/r^2$. Mindent SI-be, és ne feledd a négyzetet!`,
          explain: R`$E = 9 \cdot 10^9 \cdot 4 \cdot 10^{-9} / (0{,}2)^2 = 36 / 0{,}04 = 900\,\text{N/C}$. Az $1{,}8 \cdot 10^2$ négyzetre emelés nélkül jön ki ($36/0{,}2$). A $9 \cdot 10^{-2}$ a cm-t nem váltja m-re ($36/20^2$). A $9 \cdot 10^{-16}$ a $k = 9 \cdot 10^{-9}$ hibája.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $-6\,\text{nC}$-os töltéstől $30\,\text{cm}$-re egy $+2\,\text{nC}$-os próbatöltés van. Mekkora a <b>térerősség</b> a próbatöltés helyén, és merre mutat? ($k = 9 \cdot 10^9\,\text{N m}^2/\text{C}^2$)`,
          options: [
            R`$6 \cdot 10^{2}\,\text{N/C}$, a $-6\,\text{nC}$-os töltés felé`,
            R`$6 \cdot 10^{2}\,\text{N/C}$, a $-6\,\text{nC}$-os töltéstől elfelé`,
            R`$2 \cdot 10^{2}\,\text{N/C}$, a $-6\,\text{nC}$-os töltés felé`,
            R`$1{,}2 \cdot 10^{-6}\,\text{N}$, a $-6\,\text{nC}$-os töltés felé`
          ],
          answer: 0,
          hint: "Melyik töltés hozza létre a mezőt, és melyik csak „érzi” azt? A képletbe a forrás kerül.",
          explain: R`A mezőt a $-6\,\text{nC}$ hozza létre: $E = 9 \cdot 10^9 \cdot 6 \cdot 10^{-9} / 0{,}09 = 600\,\text{N/C}$, és negatív forrásnál a töltés felé mutat. A $2 \cdot 10^2$ a próbatöltést írja a képletbe a forrás helyett. Az „elfelé” a pozitív forrás iránya. Az $1{,}2 \cdot 10^{-6}\,\text{N}$ a próbatöltésre ható <em>erő</em> ($qE$) – a kérdés a térerősségre vonatkozott (N ≠ N/C).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az erővonalakra? (Több jó válasz is lehet.)",
          options: [
            "Ahol a vonalak sűrűbbek, ott erősebb a mező.",
            "Két erővonal sosem metszi egymást.",
            "Két ellentétes töltésű lemez között a vonalak párhuzamosak és egyenletesen sűrűk: ott a mező homogén.",
            "Egy elengedett töltés mindig az erővonal mentén mozog.",
            "Az erővonalak a negatív töltéseken kezdődnek, és a pozitívakon végződnek."
          ],
          answer: [0, 1, 2],
          hint: "Az erővonal érintője minden pontban a pozitív próbatöltésre ható erő iránya. Az erő iránya ugyanaz, mint a mozgás iránya?",
          explain: R`A sűrűség a térerősség nagyságát mutatja. Két vonal nem metszheti egymást, mert egy pontban a térerősség egyetlen vektor, csak egy iránya lehet. A lemezek között a mező homogén: mindenhol ugyanakkora és ugyanolyan irányú. Az erővonal nem pálya: az erő irányát mutatja, nem a sebességét (csak egyenes vonalon, nyugalomból indulva esik egybe a kettő). A vonalak a pozitív töltésen kezdődnek és a negatívon végződnek, mert a pozitív töltésre ható erő irányát követik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $+3\,\text{nC}$-os és egy $-1\,\text{nC}$-os töltés $20\,\text{cm}$-re van egymástól. Mekkora a térerősség a felezőpontban, és merre mutat? ($k = 9 \cdot 10^9\,\text{N m}^2/\text{C}^2$)`,
          options: [
            R`$3\,600\,\text{N/C}$, a negatív töltés felé`,
            R`$1\,800\,\text{N/C}$, a negatív töltés felé`,
            R`$3\,600\,\text{N/C}$, a pozitív töltés felé`,
            R`$1\,800\,\text{N/C}$, a pozitív töltés felé`
          ],
          answer: 0,
          hint: "Számold ki külön a két mezőt 10 cm-ről. Merre mutat a pozitív töltés mezője, és merre a negatívé? Csak az irányok után adj össze.",
          explain: R`$E_+ = 9 \cdot 10^9 \cdot 3 \cdot 10^{-9}/0{,}01 = 2700\,\text{N/C}$, a pozitív töltéstől kifelé, vagyis a negatív felé. $E_- = 9 \cdot 10^9 \cdot 10^{-9}/0{,}01 = 900\,\text{N/C}$, a negatív töltés felé. A kettő egy irányba mutat: $3\,600\,\text{N/C}$ a negatív felé. Az $1\,800$ abból jön, hogy a két mezőt ellentétesnek veszed, és kivonod ($2700 - 900$) – a „különböző előjelű töltések ellentétes mezőt adnak” csapdája. A „pozitív felé” a mező irányát fordítja meg.`
        }
      ]
    },
