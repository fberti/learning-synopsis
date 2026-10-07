/* =========================================================
   Matematikai statisztika 1. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;
  const LEIRO = "leíró", KOVETK = "következtető";
  const NOM = "nominális", ORD = "ordinális", INT = "intervallum", ARANY = "arány";
  const PAR = "paraméter", STAT = "statisztika";

  const QUIZZES = {
    /* ------------------------------------------------ 1.1 */
    "ms1-11": {
      title: "Kvíz – 1.1 Mi a statisztika?",
      questions: [
        {
          type: "match",
          q: "Leíró vagy következtető állítás? Párosítsd!",
          choices: [LEIRO, KOVETK], shuffle: false,
          pairs: [
            ["A cég mind a 40 dolgozójának átlagos túlórája múlt hónapban 6,5 óra volt.", LEIRO],
            ["Egy 1000 fős felmérés szerint a választók 38%-a támogatja az A pártot, ±3 pont hibahatárral.", KOVETK],
            ["A tavalyi évfolyam 120 hallgatójából 84 vizsgázott sikeresen.", LEIRO],
            ["A napi termelésből kivett 30 csavar alapján a selejtarány legfeljebb 2%.", KOVETK],
            ["A népszámlálási adatok alapján a lakosság aránya 10 év múlva 22% lesz 65 év felett.", KOVETK]
          ],
          hint: "Kiről szól az állítás: azokról, akiket megfigyeltek, vagy egy nagyobb (esetleg jövőbeli) körről?",
          explain: R`Leíró, ha csak a ténylegesen megfigyelt adatokat foglalja össze (40 dolgozó, 120 hallgató). Következtető, ha a megfigyeltekből egy nagyobb körre (választók, teljes termelés) vagy a jövőre általánosít – ilyenkor mindig van bizonytalanság.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik kifejezés utal a legegyértelműbben arra, hogy egy hír következtető statisztikát közöl?",
          options: ["„±3 százalékpontos hibahatárral”", "„a nyilvántartás szerint összesen”", "„a vizsgált 30 diák átlaga”", "„a tavalyi évben ténylegesen”"],
          answer: 0,
          hint: "Melyik kifejezés utal bizonytalanságra?",
          explain: R`A hibahatár a mintavételből fakadó bizonytalanság mértéke – csak akkor van értelme, ha mintából a sokaságra következtetünk. A többi kifejezés egy teljesen megfigyelt körről szól (leíró).`
        },
        {
          type: "single", shuffle: true,
          q: "Miért bizonytalan mindig a következtető statisztika eredménye?",
          options: [
            "Mert a sokaságnak csak egy részét figyeltük meg, és egy másik rész más eredményt adhatott volna.",
            "Mert a számítások kerekítési hibát tartalmaznak.",
            "Mert a statisztikusok nem ismerik pontosan a képleteket.",
            "Mert a leíró statisztika is mindig bizonytalan."
          ],
          answer: 0,
          hint: "Gondolj az 5 diákos példára: mitől függött a mintából kapott átlag?",
          explain: R`A következtetés a meg nem figyelt egyedekre is vonatkozik. Hogy kik kerültek a mintába, az a véletlenen múlik, így a belőle számolt érték is ingadozik. A leíró statisztika (ha nincs mérési hiba) nem bizonytalan: azt foglalja össze, amit láttunk.`
        },
        {
          type: "multi",
          q: "Melyik feladathoz kell következtető statisztika? (Több jó válasz is lehet.)",
          options: [
            "Egy új gyógyszer hatásának megállapítása 300 beteg adataiból, minden jövőbeli betegre",
            "Egy bolt múlt havi összes bevételének kiszámítása a pénztárgép adataiból",
            "Egy tó halállományának becslése befogott halakból",
            "A választás végeredményének előrejelzése a szavazás estéjén, a kiválasztott szavazókörök adataiból",
            "Egy osztály dolgozatjegyeinek átlaga az osztálynaplóban"
          ],
          answer: [0, 2, 3],
          hint: "Melyik esetben akarunk a ténylegesen megfigyeltnél nagyobb körről nyilatkozni?",
          explain: R`A gyógyszer (jövőbeli betegek), a halállomány (az összes hal) és a választási előrejelzés (az összes szavazat) egy részből általánosít. A bolti bevétel és az osztály átlaga teljes körű adat – leíró statisztika.`
        },
        {
          type: "match",
          q: "Párosítsd a neveket a statisztika történetének mérföldköveivel!",
          pairs: [
            ["John Graunt (1662)", "halotti jegyzékekből becsülte London népességét"],
            ["Adolphe Quetelet", "„átlagember”, valószínűségszámítás a társadalomra"],
            ["Ronald Fisher", "randomizált kísérlettervezés, szignifikanciavizsgálat"],
            ["Jerzy Neyman és Egon Pearson", "a hipotézisvizsgálat elmélete, konfidencia-intervallum"]
          ],
          hint: "A sorrend időrendi: 17. század, 19. század, 20. század eleje.",
          explain: R`Graunt a „politikai aritmetika” atyja; Quetelet a 19. század közepén az emberi jellemzők eloszlását vizsgálta; Fisher az 1920–30-as években a kísérlettervezést, Neyman és Pearson ugyanekkor a próbák és a konfidencia-intervallum elméletét alapozta meg.`
        }
      ]
    },

    /* ------------------------------------------------ 1.2 */
    "ms1-12": {
      title: "Kvíz – 1.2 Sokaság, minta, paraméter",
      questions: [
        {
          type: "match",
          q: "Párosítsd az adattábla részeit a statisztikai fogalmakkal!",
          pairs: [
            ["egy sor (pl. Bence összes adata)", "egyed"],
            ["egy oszlop (pl. „szak”)", "ismérv (változó)"],
            ["egy cella tartalma (pl. „mérnök”)", "ismérvváltozat (érték)"],
            ["egy jellemző, amely minden egyednél ugyanaz (pl. „2025-ben beiratkozott”)", "közös ismérv"]
          ],
          hint: "Sor = kiről, oszlop = mit mértünk, cella = mi lett az eredmény.",
          explain: R`Az adatmátrixban minden sor egy egyed, minden oszlop egy ismérv (változó), a cella az ismérvváltozat. A közös ismérv nem különbözteti meg az egyedeket – ez határolja körül a sokaságot.`
        },
        {
          type: "match",
          q: "Paraméter vagy statisztika? Párosítsd!",
          choices: [PAR, STAT], shuffle: false,
          pairs: [
            [R`$\mu$`, PAR],
            [R`$\bar x$`, STAT],
            [R`$\hat p$`, STAT],
            [R`$\sigma$`, PAR],
            ["egy 500 fős telefonos felmérés válaszadóinak átlagéletkora", STAT],
            ["a teljes körű népszámlálás szerinti átlagéletkor", PAR]
          ],
          hint: "A sokaságból vagy a mintából számoltuk? Görög betű vagy latin (illetve kalapos)?",
          explain: R`A paraméter a sokaság jellemzője (görög betű: $\mu$, $\sigma$; a népszámlálás teljes körű, ezért abból paraméter jön). A statisztika a mintából számolt érték ($\bar x$, $s$, $\hat p$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gyár egy napon 5&nbsp;000 izzót gyártott. Ebből 200-at megvizsgálnak, és 6 hibásat találnak. Mennyi $\hat p$?`,
          options: [R`$0{,}03$`, R`$0{,}0012$`, R`$0{,}04$`, R`$0{,}97$`],
          answer: 0,
          hint: R`A $\hat p$ a mintabeli arány: mi van a számlálóban és mi a nevezőben?`,
          explain: R`$\hat p = 6/200 = 0{,}03$. A $0{,}0012 = 6/5000$ a sokaság méretével oszt (de csak a mintát vizsgáltuk), a $0{,}04 = 200/5000$ a mintavételi arány, a $0{,}97$ a jó izzók aránya.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 5 fős sokaságból (Anna 2, Bence 4, Csilla 6, Dani 8, Emese 10 óra) Csillát és Emesét sorsoltuk ki. Mennyi a mintaátlag?`,
          options: [R`$8$`, R`$6$`, R`$16$`, R`$4$`],
          answer: 0,
          hint: "Csak a kisorsolt két ember adatát átlagold!",
          explain: R`$\bar x = (6 + 10)/2 = 8$. A 6 a sokaság átlaga ($\mu$) – a paraméter, nem a statisztika. A 16 az összeg osztás nélkül, a 4 a két érték különbsége.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik állítás igaz?",
          options: [
            "A paraméter rögzített, de általában ismeretlen; a statisztika ismert, de mintáról mintára változik.",
            "A paraméter mintáról mintára változik; a statisztika rögzített.",
            "A paramétert mindig ki tudjuk számolni, ha elég nagy a minta.",
            "A paraméter és a statisztika ugyanaz, csak más betűvel jelöljük."
          ],
          answer: 0,
          hint: "Melyik függ attól, kik kerültek a mintába?",
          explain: R`A $\mu$ egyetlen szám (pl. 6 óra), akármilyen mintát veszünk. A $\bar x$ attól függ, kik kerültek be (3, 4, … 9). A paramétert mintából csak becsülni lehet – pontosan csak teljes körű megfigyelésből kapjuk meg.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik mozgó sokaság?",
          options: [
            "egy bolt júniusi eladásai",
            "a bolt raktárkészlete június 30-án",
            "Magyarország lakossága január 1-jén",
            "egy bank ügyfelei december 31-én"
          ],
          answer: 0,
          hint: "Állapot egy időpontban, vagy történések egy időtartam alatt?",
          explain: R`A mozgó sokaság egy időszak alatt lezajló események összessége (eladások júniusban). A többi egy időpontra vonatkozó állomány – álló sokaság.`
        }
      ]
    },

    /* ------------------------------------------------ 1.3 */
    "ms1-13": {
      title: "Kvíz – 1.3 Változók és mérési skálák",
      questions: [
        {
          type: "match",
          q: "Melyik mérési skálán mérjük? Párosítsd!",
          choices: [NOM, ORD, INT, ARANY], shuffle: false,
          pairs: [
            ["irányítószám", NOM],
            ["legmagasabb iskolai végzettség", ORD],
            ["hőmérséklet Celsius-fokban", INT],
            ["havi nettó jövedelem forintban", ARANY],
            ["naptári év (pl. 2004)", INT],
            ["helyezés egy versenyen", ORD]
          ],
          hint: "Lépcsőzz: van-e sorrend? értelmes-e a különbség? van-e valódi nullpont (értelmes-e a „kétszer annyi”)?",
          explain: R`Az irányítószám csak címke (nominális). A végzettség és a helyezés sorba rendezhető, de a „távolságok” nem összevethetők (ordinális). A °C és a naptári év különbsége értelmes, de a nullpontjuk önkényes (intervallum). A jövedelemnek valódi nullpontja van (arány).`
        },
        {
          type: "single", shuffle: true,
          q: "Tegnap 10 °C volt, ma 20 °C. Igaz-e, hogy ma kétszer olyan meleg van?",
          options: [
            "Nem: a Celsius-skálán nincs valódi nullpont, abszolút hőmérsékletben (kelvinben) csak kb. 3,5%-kal melegebb van.",
            "Igen, mert 20 = 2 · 10.",
            "Igen, de csak Celsiusban; Fahrenheitben nem.",
            "Nem, mert a hőmérséklet minőségi változó."
          ],
          answer: 0,
          hint: "Számold át más egységre (pl. kelvinre) – ugyanaz marad a hányados?",
          explain: R`283,15 K → 293,15 K: a hányados $\approx 1{,}035$. Fahrenheitben 50 °F → 68 °F: $1{,}36$. A hányados egységfüggő, tehát értelmetlen – a Celsius intervallumskála. A hőmérséklet mennyiségi változó, csak a 0 °C önkényes.`
        },
        {
          type: "multi",
          q: "Melyik számításnak van értelme? (Több jó válasz is lehet.)",
          options: [
            "a vércsoportok közül a leggyakoribb (módusz)",
            "az átlagos irányítószám",
            "a nyelvvizsgaszintek mediánja",
            "két dátum különbsége napokban",
            "két Celsius-hőmérséklet hányadosa",
            "két jövedelem hányadosa"
          ],
          answer: [0, 2, 3, 5],
          hint: "Nézd meg, milyen skálán van a változó, és az a skála megengedi-e az adott műveletet!",
          explain: R`Nominálison csak a módusz értelmes (az irányítószám-átlag nem). Ordinálison a medián is. Intervallumskálán (dátum) a különbség is, de a hányados (°C) nem. Arányskálán (jövedelem) a hányados is.`
        },
        {
          type: "match",
          q: "Milyen típusú változó? Párosítsd!",
          choices: ["minőségi", "diszkrét mennyiségi", "folytonos mennyiségi"], shuffle: false,
          pairs: [
            ["vércsoport", "minőségi"],
            ["a gyerekek száma egy családban", "diszkrét mennyiségi"],
            ["várakozási idő a pénztárnál", "folytonos mennyiségi"],
            ["egy könyv ISBN-száma", "minőségi"],
            ["egy ügyfél havi vásárlásainak száma", "diszkrét mennyiségi"],
            ["testtömeg", "folytonos mennyiségi"]
          ],
          hint: "„Hány?” → diszkrét; „mennyi, mekkora, meddig?” → folytonos. És ha a szám csak címke?",
          explain: R`A darabszámok (gyerek, vásárlás) diszkrétek; az idő és a tömeg folytonos. Az ISBN szám, de csak azonosító – minőségi, mint a vércsoport.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy elégedettségi kérdőív (1 = nagyon elégedetlen … 5 = nagyon elégedett) 10 válasza: 5, 5, 4, 4, 4, 3, 2, 1, 1, 1. Mennyi a medián?`,
          options: [R`$3{,}5$`, R`$3{,}0$`, R`$4$`, R`$2{,}5$`],
          answer: 0,
          hint: "Rendezd sorba a válaszokat! Páros sok adatnál a medián a két középső átlaga.",
          explain: R`Rendezve: 1, 1, 1, 2, 3, 4, 4, 4, 5, 5. Az 5. és a 6. elem 3 és 4, a medián $3{,}5$. A $3{,}0$ az átlag (amit ordinális skálán szigorúan véve nem illik számolni), a 4 az egyik módusz, a $2{,}5$ rossz középső elemekből jön.`
        },
        {
          type: "single", shuffle: true,
          q: "„Hogyan függ egy lakás négyzetméterára a belvárostól mért távolságtól?” Melyik a magyarázó és melyik az eredményváltozó?",
          options: [
            "magyarázó: a távolság; eredmény: a négyzetméterár",
            "magyarázó: a négyzetméterár; eredmény: a távolság",
            "mindkettő magyarázó változó",
            "nincs magyarázó változó, mert ez megfigyeléses adat"
          ],
          answer: 0,
          hint: "Melyikről feltételezzük, hogy hat a másikra?",
          explain: R`A távolság hat (feltételezésünk szerint) az árra, nem fordítva. A szerep a kérdésből jön; megfigyeléses adatnál is van magyarázó változó – csak az okságot nem tudjuk bizonyítani.`
        }
      ]
    },

    /* ------------------------------------------------ 1.4 */
    "ms1-14": {
      title: "Kvíz – 1.4 Mintavételi eljárások",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány különböző 3 elemű egyszerű véletlen minta vehető egy 8 fős sokaságból?",
          options: ["56", "336", "24", "512"],
          answer: 0,
          hint: "Számít-e a sorrend a mintában? Visszatesszük-e a kihúzottat?",
          explain: R`Visszatevés nélkül, sorrend nélkül: $\binom83 = 56$. A 336 a sorrendet is számolja ($8 \cdot 7 \cdot 6$), az 512 visszatevéssel és sorrenddel ($8^3$), a 24 csak $8 \cdot 3$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cég 1 000 ügyfele: 600 magánszemély, 300 kisvállalat, 100 nagyvállalat. Hány ügyfelet válassz az egyes rétegekből egy 50 fős arányosan rétegzett mintához?",
          options: ["30 – 15 – 5", "17 – 17 – 16", "60 – 30 – 10", "25 – 20 – 5"],
          answer: 0,
          hint: R`Arányos rétegzés: $n_h = n \cdot N_h / N$.`,
          explain: R`$50 \cdot 600/1000 = 30$, $50 \cdot 300/1000 = 15$, $50 \cdot 100/1000 = 5$. A 17–17–16 egyenlő elosztás (nem arányos), a 60–30–10 a sokaság 10%-a (100 fős mintához tartozna).`
        },
        {
          type: "match",
          q: "Melyik mintavételi eljárás? Párosítsd!",
          choices: ["egyszerű véletlen", "rétegzett", "csoportos", "szisztematikus", "kvótás", "önkéntes"],
          pairs: [
            ["A teljes hallgatói listából számítógéppel 100 nevet sorsolnak.", "egyszerű véletlen"],
            ["Mind a 7 régióból a lakosságarányának megfelelő számú embert sorsolnak.", "rétegzett"],
            ["200 ládából kisorsolnak 10-et, és abban minden almát megvizsgálnak.", "csoportos"],
            ["Egy listából véletlen kezdőponttól minden 25. nevet választják.", "szisztematikus"],
            ["A kérdezőbiztos 10 nőt és 10 férfit kérdez meg, akiket az utcán talál.", "kvótás"],
            ["Egy hírportál olvasói szavazhatnak egy kérdésről.", "önkéntes"]
          ],
          hint: "Kérdezd meg: ki dönt arról, ki kerül be (véletlen, kérdező, a válaszadó maga)? És egyénenként vagy csoportonként választunk?",
          explain: R`A véletlenen alapuló eljárások: egyszerű véletlen, rétegzett (minden rétegből), csoportos (egész csoportok), szisztematikus (minden $k$-adik). A kvótás mintánál a kérdező, az önkéntesnél a válaszadó maga választ – ezek nem véletlenek.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bolt egy év napi forgalmából „minden 7. napot” veszi mintába, véletlen kezdőponttal. Mi a fő veszély?",
          options: [
            "Minden mintanap a hét ugyanazon napjára esik, így a minta torz lehet.",
            "A minta túl kicsi lesz.",
            "A szisztematikus minta sosem véletlen.",
            "Nincs veszély, mert a kezdőpont véletlen."
          ],
          answer: 0,
          hint: "Van-e ismétlődő mintázat a napi forgalomban, és hogyan illeszkedik rá a 7-es lépésköz?",
          explain: R`A forgalomnak heti periódusa van, és a 7-es lépésköz pontosan ráilleszkedik: ha a kezdőnap szombat, minden mintaelem szombat. A véletlen kezdőpont csak azt dönti el, melyik napot kapjuk mindig. 365/7 ≈ 52 nap egyébként nem kicsi minta.`
        },
        {
          type: "single", shuffle: true,
          q: "Mikor működik jól a csoportos (klaszteres) mintavétel?",
          options: [
            "Ha a csoportok belül vegyesek, és egymáshoz hasonlók – mindegyik egy „mini-sokaság”.",
            "Ha a csoportok belül egyneműek, és egymástól nagyon különböznek.",
            "Ha csak egyetlen csoportot választunk ki.",
            "Ha a csoportokon belül is mindig csak egy elemet figyelünk meg."
          ],
          answer: 0,
          hint: "Gondolj a kollégiumi szobás példára: mikor adott jó becslést egyetlen kisorsolt szoba?",
          explain: R`Vegyes szobáknál a mintaátlag 6 vagy 8 volt (jó), egynemű szobáknál 3 vagy 11 (rossz). A „belül egynemű, egymástól különböző” csoportok a rétegzéshez valók, nem a csoportos mintavételhez. Egyetlen csoport sosem elég.`
        },
        {
          type: "single", shuffle: true,
          q: "Szisztematikus minta: N = 1 200, n = 60, a kisorsolt kezdőpont a 7. elem. Hányadik elem a minta 10. eleme?",
          options: ["187", "200", "180", "207"],
          answer: 0,
          hint: R`Először a lépésközt számold ki: $k = N/n$. Az első elem a 7., a második a $7 + k$-adik…`,
          explain: R`$k = 1200/60 = 20$. A $j$-edik elem: $7 + (j - 1)\cdot 20$, tehát a 10.: $7 + 9 \cdot 20 = 187$. A 207 egy lépéssel túllő ($7 + 10 \cdot 20$), a 200 és a 180 elfelejti a kezdőpontot.`
        }
      ]
    },

    /* ------------------------------------------------ 1.5 */
    "ms1-15": {
      title: "Kvíz – 1.5 Torzítások",
      questions: [
        {
          type: "multi",
          q: "Egy felmérés mintáját 500-ról 50 000-re növeljük, minden más változatlan. Melyik hiba csökken jelentősen? (Több jó válasz is lehet.)",
          options: [
            "a mintavételi (véletlen) hiba",
            "a lefedettségi torzítás (a keretből kimaradók miatt)",
            "a válaszmegtagadási torzítás",
            "a sugalmazó kérdés okozta torzítás"
          ],
          answer: [0],
          hint: "Melyik hiba származik a véletlenből, és melyik a módszerből?",
          explain: R`Csak a véletlen ingadozás csökken a minta növelésével. A torzítások a módszerből fakadnak (rossz keret, eltérő válaszadási hajlandóság, rossz kérdés) – nagyobb mintával ugyanúgy megmaradnak, csak „magabiztosabban” tévedünk.`
        },
        {
          type: "single", shuffle: true,
          q: R`A választók 60%-a R-re, 40%-a L-re szavaz. Az R-szavazók 20%-a, az L-szavazók 40%-a válaszol a kérdőívre. Mekkora lesz az R aránya a válaszadók között?`,
          options: ["kb. 43%", "60%", "kb. 33%", "kb. 57%"],
          answer: 0,
          hint: "Számold ki, 100 megkérdezett közül hány R- és hány L-szavazó küld vissza választ!",
          explain: R`$60 \cdot 0{,}2 = 12$ R-es és $40 \cdot 0{,}4 = 16$ L-es válasz: $12/28 \approx 0{,}43$. A 60% figyelmen kívül hagyja a válaszmegtagadást; a 33% ($0{,}2/(0{,}2 + 0{,}4)$) elfelejti a 60–40-es megoszlást; az 57% az L aránya.`
        },
        {
          type: "match",
          q: "Melyik torzításra példa? Párosítsd!",
          choices: ["lefedettségi", "válaszmegtagadási", "túlélési", "mérési"],
          pairs: [
            ["Közlekedési szokások felmérése a parkolóházakban kiosztott kérdőívvel.", "lefedettségi"],
            ["Az elégedetlen ügyfelek háromszor olyan szívesen töltik ki a kérdőívet, mint az elégedettek.", "válaszmegtagadási"],
            ["A ma is létező befektetési alapok elmúlt 10 éves átlaghozama.", "túlélési"],
            ["„Ön is egyetért, hogy végre be kell vezetni a dugódíjat?”", "mérési"]
          ],
          hint: "Ki nem került a listára? Ki nem válaszolt? Ki esett ki menet közben? Vagy maga a kérdés a hibás?",
          explain: R`A parkolóház kizárja a nem autósokat (keret). Az eltérő válaszadási hajlandóság válaszmegtagadási torzítás. A megszűnt alapok kiesnek (túlélés). A sugalmazó kérdés a válaszokat torzítja (mérési torzítás).`
        },
        {
          type: "single", shuffle: true,
          q: "A visszatért bombázókon a törzsön és a szárnyakon sok, a hajtóműveken alig van találat. Hova javasolta Wald Ábrahám a páncélt?",
          options: ["a hajtóművekre", "a törzsre", "a szárnyakra", "egyenletesen mindenhová"],
          answer: 0,
          hint: "Mi történt azokkal a gépekkel, amelyek a hajtóművükön kaptak találatot?",
          explain: R`A hajtóműtalálatot kapott gépek nem tértek vissza, ezért nem szerepelnek a mintában. A visszatért gépek lyukai éppen azt mutatják, hol <em>bírja</em> a gép a találatot. A páncél oda kell, ahol a túlélőkön nincs lyuk – ez a túlélési torzítás klasszikus esete.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért tévedett a Literary Digest 1936-ban 2,4 millió válasz ellenére kb. 18 százalékpontot?",
          options: [
            "Torz volt a keret (telefon- és autótulajdonosok), és a Roosevelt-ellenesek szívesebben válaszoltak.",
            "Túl kicsi volt a minta az amerikai választókhoz képest.",
            "A véletlen ingadozás ekkora mintánál is ±18 pont.",
            "Rosszul adták össze a beérkezett szavazatokat."
          ],
          answer: 0,
          hint: "Mekkora lenne a véletlen hiba 2,4 millió véletlen válasznál? Akkor honnan jöhet ekkora tévedés?",
          explain: R`2,4 millió véletlen válasznál a mintavételi hiba csak kb. ±0,06 pont lenne. A 18 pontos tévedés torzításból jön: lefedettségi (a jómódúak listái) és válaszmegtagadási. A minta nem volt kicsi – csak rossz.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a jobb becslés egy párt támogatottságára?",
          options: [
            "egy 1 000 fős egyszerű véletlen minta, amelyre a válaszadók mindkét táborból egyforma arányban válaszolnak",
            "egy 100 000 fős online önkéntes szavazás",
            "egy 50 000 fős minta egy olyan listából, amelyből a fiatalok kimaradnak",
            "egy 5 fős, nagyon gondosan kiválasztott szakértői csoport véleménye"
          ],
          answer: 0,
          hint: "Melyiknél nincs torzítás? És annak a véletlen hibája elfogadható-e?",
          explain: R`Az 1 000 fős véletlen minta torzítatlan, és a véletlen hibája kb. ±3 pont. Az online szavazás önkiválasztó, a fiatalokat kihagyó lista lefedettségi torzítású – a nagy elemszám ezeken nem segít. Az 5 fő pedig túl kevés, és nem is véletlenül választották.`
        }
      ]
    },

    /* ------------------------------------------------ 1.6 */
    "ms1-16": {
      title: "Kvíz – 1.6 Megfigyelés és kísérlet",
      questions: [
        {
          type: "match",
          q: "Megfigyeléses vizsgálat vagy kísérlet? Párosítsd!",
          choices: ["megfigyeléses vizsgálat", "randomizált kísérlet", "nem randomizált kísérlet"], shuffle: false,
          pairs: [
            ["10 000 ember étkezési szokásait és egészségét követik 20 évig.", "megfigyeléses vizsgálat"],
            ["Egy webáruház a látogatók véletlenszerűen kiválasztott felének piros, a többieknek zöld gombot mutat.", "randomizált kísérlet"],
            ["Egy tanár az egyik osztályában új, a másikban régi módszerrel tanít.", "nem randomizált kísérlet"],
            ["Összevetik a magán- és az állami egyetemen végzettek keresetét.", "megfigyeléses vizsgálat"],
            ["40 parcellát sorsolással két csoportra osztanak, az egyik új műtrágyát kap.", "randomizált kísérlet"]
          ],
          hint: "Ki döntötte el, ki melyik csoportba kerül: a kutató (és ha igen, sorsolással?) vagy maguk az egyedek?",
          explain: R`Kísérletben a kutató osztja ki a kezelést; randomizáltban sorsolással. Ha a csoportok eleve adottak (osztályok) vagy maguk választanak (egyetem, étrend), a csoportok más szempontból is különbözhetnek.`
        },
        {
          type: "single", shuffle: true,
          q: "Gyerekek körében a nagyobb cipőméretűek jobban olvasnak. Mi a legvalószínűbb magyarázat?",
          options: [
            "Zavaró változó: az életkor hat a lábméretre és az olvasási készségre is.",
            "A nagyobb láb okozza a jobb olvasást.",
            "Fordított okság: az olvasás növeli a lábméretet.",
            "Ez biztosan csak a véletlen műve."
          ],
          answer: 0,
          hint: "Keress egy harmadik változót, amely mindkettővel összefügg!",
          explain: R`Az idősebb gyerek lába nagyobb, és jobban is olvas. Egy korcsoporton belül a kapcsolat eltűnik. Ez a zavaró változó tankönyvi példája: $X \leftarrow Z \rightarrow Y$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A kávés–dohányos példában (1&nbsp;000 fő, 500 kávézik, közülük 82 tüdőrákos) mekkora a tüdőrák aránya a kávézók között?`,
          options: ["16,4%", "8,2%", "20%", "5,6%"],
          answer: 0,
          hint: "A kávézók számához viszonyíts, ne az összes résztvevőhöz!",
          explain: R`$82/500 = 16{,}4\%$. A $8{,}2\%$ az 1&nbsp;000 főhöz viszonyít, a 20% a dohányosok aránya (kávétól függetlenül), az $5{,}6\%$ a nem kávézóké. A bontás után kiderül: a különbséget a dohányzás okozza, nem a kávé.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a randomizálás (véletlen besorolás) fő célja egy kísérletben?",
          options: [
            "Hogy a zavaró változók – az ismeretlenek is – átlagosan kiegyenlítődjenek a csoportok között.",
            "Hogy a minta reprezentálja a teljes lakosságot.",
            "Hogy a résztvevők ne tudják, melyik csoportba kerültek.",
            "Hogy a minta nagyobb legyen."
          ],
          answer: 0,
          hint: "A véletlen kiválasztás és a véletlen besorolás mást-mást biztosít. Melyik melyiket?",
          explain: R`A véletlen besorolás a csoportok összehasonlíthatóságát (és így az okságot) alapozza meg. A reprezentativitás a véletlen <em>kiválasztás</em> feladata; a résztvevők elől a kezelést a <em>vakság</em> rejti el.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit jelent, hogy egy gyógyszerkísérlet kettős vak?",
          options: [
            "Sem a betegek, sem a kezelő / értékelő orvosok nem tudják, ki kap valódi gyógyszert.",
            "A betegek nem tudják, ki kap valódi gyógyszert, de az orvosok igen.",
            "Két kontrollcsoport van: az egyik placebót, a másik semmit sem kap.",
            "A betegeket kétszer sorsolják."
          ],
          answer: 0,
          hint: "Ki az a két „szereplő”, akinek a tudása befolyásolhatja az eredményt?",
          explain: R`Egyszeres vak: csak a beteg nem tudja. Kettős vak: az orvos/értékelő sem – így az ő elvárásai sem torzíthatják a mérést vagy a bánásmódot.`
        },
        {
          type: "match",
          q: "Mit szabad kimondani? Párosítsd a vizsgálatokat a következtetéssel!",
          choices: ["okság, a sokaságra általánosítva", "okság, de csak a résztvevőkhöz hasonlókra", "kapcsolat, a sokaságra általánosítva", "csak leírás"], shuffle: false,
          pairs: [
            ["Az ügyfelek közül véletlenszerűen kiválasztott 2 000-ből sorsolással 1 000 kap új ajánlatot.", "okság, a sokaságra általánosítva"],
            ["Önkéntes egyetemistákat sorsolnak két csoportba (alvás előtt telefon / nincs telefon).", "okság, de csak a résztvevőkhöz hasonlókra"],
            ["Országos egyszerű véletlen mintában a sportolók között kisebb a depresszió aránya.", "kapcsolat, a sokaságra általánosítva"],
            ["Egy fórum önkéntes hozzászólói szerint az étrend után jobban érzik magukat.", "csak leírás"]
          ],
          hint: "Két kérdés: volt-e véletlen kiválasztás (→ általánosítás)? Volt-e véletlen besorolás (→ okság)?",
          explain: R`Véletlen kiválasztás + besorolás: okság és általánosítás. Csak besorolás: okság a résztvevőkre. Csak kiválasztás: a kapcsolat általánosítható, de nem oksági. Egyik sem: csak leírás.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "ms1-final": {
      title: "Fejezetzáró teszt – Adatok, populáció és minta",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`„Egy 1&nbsp;200 fős véletlen mintában a háztartások 64%-ának van háziállata.” Melyik állítás igaz?`,
          options: [
            R`A 64% statisztika ($\hat p$), amely az összes háztartásra vonatkozó $p$ paraméter becslése.`,
            R`A 64% paraméter, mert a háztartásokról szól.`,
            R`A 64% a sokaság elemszáma.`,
            R`A 64% leíró statisztika az összes háztartásról.`
          ],
          answer: 0,
          hint: "A mintából vagy a teljes sokaságból számolták?",
          explain: R`A 64% a mintából számolt arány ($\hat p$), tehát statisztika; a valódi, összes háztartásra vonatkozó arány ($p$) ismeretlen paraméter. Az összes háztartásról csak következtetni lehet belőle.`
        },
        {
          type: "match",
          q: "Sorold be a mérési skálákba!",
          choices: [NOM, ORD, INT, ARANY], shuffle: false,
          pairs: [
            ["vércsoport", NOM],
            ["katonai rang", ORD],
            ["születési év", INT],
            ["életkor években", ARANY]
          ],
          hint: "Sorrend? Értelmes különbség? Valódi nullpont?",
          explain: R`A vércsoport csak kategória; a rangok sorba rendezhetők; a születési év különbsége értelmes, de a 0. év önkényes; az életkor 0-ja a születés – valódi nullpont.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány különböző 2 elemű egyszerű véletlen minta vehető egy 6 elemű sokaságból?",
          options: ["15", "30", "36", "12"],
          answer: 0,
          hint: "Visszatevés nélkül, és a sorrend nem számít.",
          explain: R`$\binom62 = 15$. A 30 a sorrendet is számolja ($6 \cdot 5$), a 36 visszatevéssel és sorrenddel ($6^2$), a 12 csak $6 \cdot 2$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy város 1 000 boltja: 450 élelmiszer, 350 ruházati, 200 egyéb. Hány boltot válassz az egyes rétegekből egy 80 fős arányosan rétegzett mintához?",
          options: ["36 – 28 – 16", "27 – 27 – 26", "45 – 35 – 20", "40 – 28 – 12"],
          answer: 0,
          hint: R`$n_h = n \cdot N_h / N$ – minden réteg ugyanakkora hányadát válaszd!`,
          explain: R`$80 \cdot 0{,}45 = 36$, $80 \cdot 0{,}35 = 28$, $80 \cdot 0{,}2 = 16$. A 27–27–26 egyenlő elosztás, a 45–35–20 a sokaság 10%-a (100 fős mintához).`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik igaz a rétegzett mintavételre?",
          options: [
            "Akkor a leghatékonyabb, ha a rétegek belül egyneműek, egymástól pedig különböznek.",
            "Néhány réteget kisorsolunk, és azokat teljesen megfigyeljük.",
            "A rétegeken belül a kérdező választja ki, kit kérdez meg.",
            "Csak akkor használható, ha nincs listánk a sokaságról."
          ],
          answer: 0,
          hint: "Rétegzésnél honnan veszünk mintát: minden rétegből, vagy csak néhányból?",
          explain: R`Rétegzésnél <em>minden</em> rétegből véletlenszerűen választunk – ez a rétegek közötti különbségeket ártalmatlanítja. A „néhány csoportot teljesen” a csoportos mintavétel; a „kérdező választ” a kvótás minta.`
        },
        {
          type: "single", shuffle: true,
          q: R`A sokaság 50%-a „igen”, 50%-a „nem”. Az igenesek 30%-a, a nemesek 10%-a válaszol. Mekkora az „igen” aránya a válaszadók között?`,
          options: ["75%", "50%", "30%", "60%"],
          answer: 0,
          hint: "100 megkérdezettből hány igenes és hány nemes válasz jön vissza?",
          explain: R`$50 \cdot 0{,}3 = 15$ igen, $50 \cdot 0{,}1 = 5$ nem: $15/20 = 75\%$. Az 50% a valódi arány (a torzítás nélkül), a 30% az igenesek válaszadási aránya.`
        },
        {
          type: "multi",
          q: "Melyek NEM véletlenen alapuló mintavételi eljárások? (Több jó válasz is lehet.)",
          options: ["kvótás minta", "hólabda-mintavétel", "önkéntes online szavazás", "rétegzett minta", "többlépcsős minta", "egyszerű véletlen minta"],
          answer: [0, 1, 2],
          hint: "Ki dönti el, ki kerül a mintába: egy sorsolás, vagy egy ember (kérdező, válaszadó, ajánló)?",
          explain: R`A kvótás mintánál a kérdező, a hólabdánál az ajánló, az önkéntesnél a válaszadó maga dönt. A rétegzett, a többlépcsős és az egyszerű véletlen minta minden lépcsőben sorsol.`
        },
        {
          type: "single", shuffle: true,
          q: "A stentes kísérletben 224 stentes betegből 45-nek, 227 kontrollbetegből 28-nak lett egy éven belül stroke-ja. Mekkora a stroke aránya a két csoportban?",
          options: ["20% és 12%", "10% és 6%", "62% és 38%", "80% és 88%"],
          answer: 0,
          hint: "Minden csoportban a saját létszámához viszonyíts!",
          explain: R`$45/224 \approx 20\%$, $28/227 \approx 12\%$. A 10% és 6% az összes (451) beteghez viszonyít, a 62% és 38% azt mutatja, hogyan oszlik meg a 73 stroke a csoportok között, a 80% és 88% a stroke nélküliek aránya.`
        },
        {
          type: "single", shuffle: true,
          q: "Randomizált válasz: a diák titokban érmét dob; fejnél őszintén felel, írásnál mindenképp „igen”-t mond. Az „igen” válaszok aránya 60%. Mekkora a puskázók aránya?",
          options: ["20%", "60%", "30%", "10%"],
          answer: 0,
          hint: R`Az „igenek” aránya $q = 0{,}5\,p + 0{,}5$, ahol $p$ a puskázók aránya.`,
          explain: R`$0{,}6 = 0{,}5p + 0{,}5 \Rightarrow p = 2 \cdot 0{,}6 - 1 = 0{,}2$. A 60% elfelejti, hogy a válaszok felét az érme „igen”-re kényszeríti; a 30% csak felezi a $q$-t; a 10% csak levonja a fél „kényszer-igent”, de nem szoroz 2-vel.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy országos, egyszerű véletlen mintán alapuló felmérés szerint a rendszeresen reggelizők között kevesebb a túlsúlyos. Mit mondhatunk ki?",
          options: [
            "A reggelizés és a túlsúly közötti kapcsolat az egész lakosságra általánosítható, de nem oksági.",
            "A reggelizés csökkenti a túlsúly kockázatát.",
            "Semmit, mert megfigyeléses adat.",
            "Az összefüggés csak a megkérdezettekre igaz."
          ],
          answer: 0,
          hint: "Volt véletlen kiválasztás? Volt véletlen besorolás?",
          explain: R`Véletlen kiválasztás van → az együttjárás általánosítható. Véletlen besorolás nincs (mindenki maga döntötte el, reggelizik-e) → okságot nem mondhatunk: lehetnek zavaró változók (életmód, munkarend) és fordított okság is.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a fejezet legfontosabb tanulsága a mintanagyságról?",
          options: [
            "A nagyobb minta a véletlen hibát csökkenti, a torzítást nem; egy jól megválasztott kis minta jobb lehet egy torz nagynál.",
            "Minél nagyobb a minta, annál biztosabban reprezentatív.",
            "A mintának a sokaság legalább 10%-ának kell lennie.",
            "A mintanagyság nem számít, csak a kiválasztás módja."
          ],
          answer: 0,
          hint: "Gondolj a Literary Digest 2,4 millió válaszára és Gallup sokkal kisebb mintájára!",
          explain: R`A Digest 2,4 millió válasza torz volt, Gallup kisebb mintája pontosabb. A minta mérete <em>is</em> számít (a véletlen hibát szabja meg), de nem pótolja a jó kiválasztást – és a sokaság méretétől alig függ, mekkora minta kell.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
