/* =========================================================
   Matematikai statisztika 2. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;
  const JOBB = "jobbra ferde", BAL = "balra ferde", SZIM = "közel szimmetrikus";
  const SZAMT = "számtani", MERT = "mértani", HARM = "harmonikus", KRON = "kronologikus", NEGYZ = "négyzetes";
  const MO = "módusz", ME = "medián", ATL = "számtani átlag";

  const QUIZZES = {
    /* ------------------------------------------------ 2.1 */
    "ms2-21": {
      title: "Kvíz – 2.1 Gyakorisági eloszlás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy 40 fős csoportban a „legfeljebb 3 testvér” kumulált relatív gyakorisága 0,7. Hány diáknak van 3-nál több testvére?",
          options: ["12", "28", "30", "3"],
          answer: 0,
          hint: "A kumulált érték a „legfeljebb” kérdésre válaszol. Neked a komplementere kell – darabszámban.",
          explain: R`A diákok 70%-ának legfeljebb 3 testvére van, tehát 30%-nak több: $0{,}3 \cdot 40 = 12$ diák. A 28 a „legfeljebb 3” létszáma ($0{,}7 \cdot 40$), a 30 a százalék és a darabszám összekeverése, a 3 pedig az érték, nem a gyakoriság.`
        },
        {
          type: "match",
          q: "Melyik ábra illik az adathoz? Párosítsd!",
          pairs: [
            ["napi elfogyasztott kávé (csésze)", "oszlopdiagram, rés az oszlopok között"],
            ["testmagasság (cm), 200 fő", "hisztogram, összeérő téglalapok"],
            ["lakóhely típusa (főváros, város, község)", "oszlop- vagy kördiagram, tetszőleges sorrend"]
          ],
          hint: "Diszkrét, folytonos vagy nominális a változó?",
          explain: R`A csészék száma diszkrét (nincs 1,5 csésze közte) → különálló oszlopok. A magasság folytonos → hisztogram, rés nélkül. A lakóhely típusa nominális → nincs természetes sorrend, oszlop- vagy kördiagram.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy felmérésben 0–10 perc között 20 fő, 10–30 perc között 30 fő ingázik. A hisztogramon a 0–10-es téglalap magassága 2 (fő/perc). Milyen magas a 10–30-as téglalap?`,
          options: ["1,5", "3", "30", "2"],
          answer: 0,
          hint: "Egyenlőtlen osztályközöknél a terület arányos a gyakorisággal: magasság = gyakoriság / szélesség.",
          explain: R`$30/20 = 1{,}5$ fő/perc. A 3 akkor jönne ki, ha a 30 főt 10 perces szélességgel osztanánk; a 30 a gyakoriság (ami az egyforma szélességű esetben lenne magasság); a 2 azt feltételezi, hogy a sűrűség ugyanaz, mint az első osztályban.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány osztályközt javasol a „$2^k \ge n$” szabály $n = 100$ adatra?`,
          options: ["7", "6", "50", "100"],
          answer: 0,
          hint: "Keresd a legkisebb $k$-t, amelyre $2^k$ eléri a 100-at.",
          explain: R`$2^6 = 64 \lt 100 \le 128 = 2^7$, tehát $k = 7$ (a Sturges-szabály is $1 + \log_2 100 \approx 7{,}6$-et ad). A 6 kevés ($2^6 \lt 100$); 50 vagy 100 osztályköz esetén szinte minden osztályban 1-2 adat lenne.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "A relatív gyakoriságok összege 1.",
            "Az utolsó kumulált gyakoriság egyenlő az adatok számával.",
            "A kumulált gyakoriság azt mutatja meg, hány adat legalább akkora, mint az adott érték.",
            "A hisztogramon a téglalapok területe arányos a gyakorisággal.",
            "Az osztályközös táblából pontosan visszaállíthatók az eredeti adatok."
          ],
          answer: [0, 1, 3],
          hint: "Gondolj a kumulált gyakoriság definíciójára (≤ vagy ≥?), és arra, mit veszítünk az osztályokba sorolással.",
          explain: R`A kumulált gyakoriság a <em>legfeljebb</em> akkora adatokat számolja, nem a legalább akkorákat. Az osztályközös táblából csak azt tudjuk, hány adat esik egy-egy osztályba, a pontos értékeket nem – ez az áttekinthetőség ára.`
        }
      ]
    },

    /* ------------------------------------------------ 2.2 */
    "ms2-22": {
      title: "Kvíz – 2.2 A számtani átlag",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Jegyek egy 20 fős csoportban: 2-es 4 fő, 3-as 6 fő, 4-es 8 fő, 5-ös 2 fő. Mennyi az átlag?",
          options: ["3,4", "3,5", "5", "17"],
          answer: 0,
          hint: "Minden jegyet annyiszor kell számolni, ahányan kapták.",
          explain: R`$\dfrac{2 \cdot 4 + 3 \cdot 6 + 4 \cdot 8 + 5 \cdot 2}{20} = \dfrac{68}{20} = 3{,}4$. A 3,5 a jegyek súlyozatlan átlaga, az 5 a gyakoriságok átlaga ($20/4$), a 17 a súlyozott összeg osztva a sorok számával ($68/4$).`
        },
        {
          type: "single", shuffle: true,
          q: "Az A osztály 20 diákjának átlaga 3,2, a B osztály 30 diákjáé 4,2. Mennyi az 50 diák közös átlaga?",
          options: ["3,8", "3,7", "3,6", "4,2"],
          answer: 0,
          hint: "Az átlagokat a létszámukkal kell súlyozni.",
          explain: R`$\dfrac{20 \cdot 3{,}2 + 30 \cdot 4{,}2}{50} = \dfrac{64 + 126}{50} = 3{,}8$. A 3,7 az átlagok átlaga (súlyozás nélkül), a 3,6 felcserélt súlyokkal jön ki, a 4,2 csak a nagyobb osztály átlaga.`
        },
        {
          type: "multi",
          q: "Melyik tulajdonsága van a számtani átlagnak? (Több jó válasz is lehet.)",
          options: [
            "Az átlagtól vett eltérések összege 0.",
            "Ha minden adathoz 5-öt adunk, az átlag is 5-tel nő.",
            "Mindig egyenlő valamelyik adattal.",
            "Egy kiugró érték nem változtatja meg lényegesen.",
            R`A $\sum (x_i - c)^2$ összeg $c = \bar x$-re a legkisebb.`
          ],
          answer: [0, 1, 4],
          hint: "Gondolj a 2.2-a tételére és a „milliárdos a kocsmában” példára.",
          explain: R`Az eltérések összege 0, az eltolás átvihető, és az eltérésnégyzet-összeg az átlagnál minimális. Az átlag viszont lehet nem létező érték (1,65 gyerek), és egy kiugró érték erősen elhúzza – ezért nem robusztus.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az ingázási tábla: 0–10: 2, 10–20: 4, 20–30: 6, 30–40: 4, 40–50: 2, 50–60: 1, 60–70: 0, 70–80: 1 fő. Mennyi az osztályközepekkel becsült átlag?`,
          options: ["29 perc", "40 perc", "72,5 perc", "2,5 perc"],
          answer: 0,
          hint: "Az osztályközepeket (5, 15, …, 75) súlyozd a gyakoriságokkal, és oszd a létszámmal.",
          explain: R`$\sum f_i m_i = 580$, $580/20 = 29$ perc. A 40 az osztályközepek súlyozatlan átlaga, a 72,5 a súlyozott összeg osztva az osztályok számával (8), a 2,5 pedig $20/8$ – „egy osztályra jutó létszám”.`
        },
        {
          type: "single", shuffle: true,
          q: "Öt adat átlaga 12. Négy közülük: 10, 11, 13, 15. Mennyi az ötödik?",
          options: ["11", "12,25", "12", "49"],
          answer: 0,
          hint: "Az átlagból vissza lehet számolni az összeget.",
          explain: R`Az öt adat összege $5 \cdot 12 = 60$, a négyé 49, tehát az ötödik $60 - 49 = 11$. A 12,25 a négy adat átlaga, a 12 a „biztos az átlaggal egyenlő” tipp, a 49 a négy adat összege.`
        }
      ]
    },

    /* ------------------------------------------------ 2.3 */
    "ms2-23": {
      title: "Kvíz – 2.3 Medián és módusz",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Mennyi a 8, 3, 5, 12, 7, 4 adatsor mediánja?",
          options: ["6", "8,5", "6,5", "5"],
          answer: 0,
          hint: "Először rendezd sorba! Páros sok adatnál a két középső átlaga kell.",
          explain: R`Rendezve: 3, 4, <b>5, 7</b>, 8, 12 → Me $= (5 + 7)/2 = 6$. A 8,5 a rendezés nélküli két középső (5 és 12) átlaga, a 6,5 a számtani átlag, az 5 csak az egyik középső elem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Osztályközös sor: 0–10: 3, 10–20: 9, 20–30: 6, 30–40: 2 (n = 20). Mennyi a medián interpolációval?`,
          options: ["17,8", "7,8", "27,8", "15"],
          answer: 0,
          hint: "Keresd meg a kumulált gyakoriságból, melyik osztályban van az $n/2 = 10$-edik adat, és az osztály alsó határából indulj.",
          explain: R`Kumulált: 3, 12 → a 10–20-as osztály. $\text{Me} = 10 + \dfrac{10 - 3}{9} \cdot 10 \approx 17{,}8$. A 7,8 a medián osztályát is beleszámító kumulált értékkel (12) jön ki, a 27,8 a felső határból indulva, a 15 csak az osztályközép.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebből a sorból (0–10: 3, 10–20: 9, 20–30: 6, 30–40: 2) mennyi a módusz interpolációval?`,
          options: ["16,7", "15", "13,3", "9"],
          answer: 0,
          hint: R`$\text{Mo} = x_a + \frac{d_a}{d_a + d_f} h$, ahol $d_a$ az alsó, $d_f$ a felső szomszédtól vett különbség.`,
          explain: R`$d_a = 9 - 3 = 6$, $d_f = 9 - 6 = 3$: $\text{Mo} = 10 + \dfrac{6}{9} \cdot 10 \approx 16{,}7$ – a gyakoribb felső szomszéd felé tolódik. A 13,3 a $d_a$ és $d_f$ felcserélésével jön ki, a 15 az osztályközép, a 9 a gyakoriság (nem érték).`
        },
        {
          type: "match",
          q: "Melyik középérték illik leginkább a helyzethez? Párosítsd!",
          choices: [MO, ME, ATL], shuffle: false,
          pairs: [
            ["Melyik autómárkát veszik a legtöbben?", MO],
            ["Mennyi a „tipikus” lakásár egy kerületben, ahol néhány luxusvilla is van?", ME],
            ["Mennyi az átlagos kárösszeg, ha a jövő évi összes kifizetést kell tervezni?", ATL],
            ["Elégedettség egy 1–5-ös rangsorskálán – mi a középső vélemény?", ME]
          ],
          hint: "Melyik skálán van az adat, mennyire ferde, és az összeg fontos-e?",
          explain: R`A márka nominális → módusz. A lakásár jobbra ferde, kiugró értékekkel → medián. A kifizetések tervezéséhez az összeg kell → átlag (kárszám × átlagos kár). A rangsorskála ordinális → medián.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy adatsorban $\bar x = 52$, Me $= 45$, Mo $= 40$. Milyen az eloszlás alakja?`,
          options: ["jobbra ferde (hosszú jobb oldali farok)", "balra ferde (hosszú bal oldali farok)", "szimmetrikus", "kétcsúcsú"],
          answer: 0,
          hint: "Melyik középértéket húzza legjobban a farok?",
          explain: R`Mo &lt; Me &lt; $\bar x$: az átlagot néhány nagy érték felhúzta – jobbra ferde, mint a bérek. Szimmetrikusnál a három közel egyenlő lenne; a kétcsúcsúságot a sorrend nem mutatja.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 9 elemű adatsor legnagyobb értékét tízszeresére növeljük. Melyik mutató NEM változik?",
          options: ["medián", "számtani átlag", "terjedelem", "szórás"],
          answer: 0,
          hint: "Melyik mutató használja csak a sorrendet, és nem a szélső érték nagyságát?",
          explain: R`A medián az 5. elem marad, akármekkora a legnagyobb. Az átlag, a terjedelem és a szórás mind a tényleges értékekből számol, így a kiugró érték mindhármat megnöveli.`
        }
      ]
    },

    /* ------------------------------------------------ 2.4 */
    "ms2-24": {
      title: "Kvíz – 2.4 Különleges átlagok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy kerékpáros 30 km/h-val megy el a munkahelyére, és 60 km/h-val (autóval) jön vissza ugyanazon az úton. Mennyi az átlagsebesség?",
          options: ["40 km/h", "45 km/h", "42,4 km/h", "47,4 km/h"],
          answer: 0,
          hint: "Mi egyforma a két szakaszon: az idő vagy az út?",
          explain: R`Azonos utak → harmonikus átlag: $\dfrac{2}{1/30 + 1/60} = 40$ km/h (pl. 30 km 1 óra + 0,5 óra alatt, 60 km / 1,5 óra). A 45 a számtani, a 42,4 a mértani, a 47,4 a négyzetes átlag – a lassú szakaszon több időt töltünk, ezért az húz jobban.`
        },
        {
          type: "single", shuffle: true,
          q: "Az árak három év alatt +10%, +20% és −20%-kal változtak. Mennyi az átlagos éves változás?",
          options: ["+1,83%", "+3,33%", "+5,6%", "+1,87%"],
          answer: 0,
          hint: "A változások szorzódnak: használd a szorzószámokat (1,1; 1,2; 0,8).",
          explain: R`$\sqrt[3]{1{,}1 \cdot 1{,}2 \cdot 0{,}8} = \sqrt[3]{1{,}056} \approx 1{,}0183$ → +1,83%. A 3,33% a százalékok számtani átlaga, az 5,6% a teljes háromévi változás, az 1,87% ennek harmada – egyik sem veszi figyelembe a szorzódást.`
        },
        {
          type: "match",
          q: "Melyik átlag kell? Párosítsd!",
          choices: [SZAMT, MERT, HARM, KRON, NEGYZ], shuffle: false,
          pairs: [
            ["átlagos évi infláció az éves árindexekből", MERT],
            ["átlagsebesség azonos hosszú szakaszokon", HARM],
            ["éves átlagos készlet negyedév eleji adatokból", KRON],
            ["egy főre jutó átlagjövedelem", SZAMT],
            ["az átlagtól vett pozitív és negatív eltérések átlagos nagysága", NEGYZ]
          ],
          hint: "Mi marad változatlan: az összeg, a szorzat, a reciprokok összege, a négyzetösszeg – vagy időponti adatokról van szó?",
          explain: R`Infláció: szorzódó változások → mértani. Azonos utak: az idők adódnak össze → harmonikus. Időponti készletadatok → kronologikus. Egy főre jutó jövedelem: az összeg az érdekes → számtani. Az eltérések előjele nem számít → négyzetes (ebből lesz a szórás).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy raktár készlete jan. 1-jén 50, júl. 1-jén 70, dec. 31-én 60 tonna. Mennyi az éves átlagos készlet?",
          options: ["62,5 tonna", "60 tonna", "41,7 tonna", "65 tonna"],
          answer: 0,
          hint: "Állapotadatok, két egyenlő félév: első és utolsó adat fél súllyal, a nevező az időszakok száma.",
          explain: R`$\dfrac{25 + 70 + 30}{2} = 62{,}5$ tonna. A 60 a három adat egyszerű átlaga (az év eleje és vége túl nagy súlyt kap), a 41,7 a jó számláló 3-mal osztva (adatok száma időszakok helyett), a 65 csak a második félév átlaga.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a 4 és a 9 mértani átlaga?",
          options: ["6", "6,5", "5,54", "6,96"],
          answer: 0,
          hint: R`$G = \sqrt{a \cdot b}$.`,
          explain: R`$\sqrt{36} = 6$. A 6,5 a számtani, az 5,54 a harmonikus, a 6,96 a négyzetes átlag – épp a $H \le G \le \bar x \le Q$ sorrendben.`
        },
        {
          type: "single", shuffle: true,
          q: "Két boltban egyaránt 1200 Ft-ért veszünk almát; az egyikben 300 Ft/kg, a másikban 400 Ft/kg. Mennyi az átlagár?",
          options: ["342,9 Ft/kg", "350 Ft/kg", "346,4 Ft/kg", "353,6 Ft/kg"],
          answer: 0,
          hint: "A súly a kifizetett összeg – az ár (Ft/kg) számlálója vagy nevezője?",
          explain: R`Számlálóban a súly → harmonikus: $\dfrac{2}{1/300 + 1/400} \approx 342{,}9$ Ft/kg (2400 Ft-ért 4 + 3 = 7 kg). A 350 a számtani (azonos <em>mennyiség</em> esetén lenne helyes), a 346,4 a mértani, a 353,6 a négyzetes átlag.`
        }
      ]
    },

    /* ------------------------------------------------ 2.5 */
    "ms2-25": {
      title: "Kvíz – 2.5 Kvartilisek és boxplot",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Mennyi az 1, 3, 4, 6, 8, 9, 12 adatsor interkvartilis terjedelme (IQR)?",
          options: ["6", "11", "3", "9"],
          answer: 0,
          hint: R`$n = 7$; a kvartilisek helye $(n+1) \cdot 0{,}25$ és $(n+1) \cdot 0{,}75$.`,
          explain: R`Helyek: 2 és 6 → $Q_1 = 3$, $Q_3 = 9$, IQR $= 6$. A 11 a terjedelem (max − min), a 3 a $Q_3$ és a medián (6) különbsége, a 9 maga a $Q_3$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy adatsorra $Q_1 = 20$, $Q_3 = 30$. Melyik érték kiugró a $1{,}5 \cdot \text{IQR}$ szabály szerint?`,
          options: ["48", "44", "6", "35"],
          answer: 0,
          hint: "Számold ki a két kerítést!",
          explain: R`IQR = 10, kerítés: $20 - 15 = 5$ és $30 + 15 = 45$. Csak a 48 esik kívül. A 44 és a 6 közel van a kerítéshez, de belül; a 35 a dobozon kívül, de a bajuszon belül van.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a boxplotra? (Több jó válasz is lehet.)",
          options: [
            "A doboz az adatok középső felét fogja közre.",
            "A dobozban lévő vonal a medián.",
            "A négy szakasz (bajusz, doboz két fele, bajusz) mindegyikébe nagyjából ugyanannyi adat esik.",
            "A bajusz mindig a kerítés értékéig tart.",
            "A boxplotról mindig látszik, ha az eloszlás kétcsúcsú."
          ],
          answer: [0, 1, 2],
          hint: "Mit jelölnek a kvartilisek, és meddig rajzoljuk a bajuszt?",
          explain: R`Minden negyedben kb. az adatok 25%-a van, a doboz $Q_1$-től $Q_3$-ig tart, benne a medián. A bajusz a kerítésen belüli <em>legszélső adatig</em> tart, nem a kerítésig. A kétcsúcsúságot a boxplot elrejtheti – ehhez hisztogram kell.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy boxploton a medián közel van a doboz jobb széléhez ($Q_3$), és a bal oldali bajusz sokkal hosszabb a jobb oldalinál. Milyen az eloszlás?",
          options: ["balra ferde", "jobbra ferde", "szimmetrikus", "nem lehet megmondani"],
          answer: 0,
          hint: "Melyik oldalon szóródnak jobban az adatok?",
          explain: R`A kis értékek oldalán szétterültek az adatok (hosszú bal bajusz, széles bal doboz-fél), a nagyok összenyomódtak: hosszú bal oldali farok → balra ferde (pl. egy könnyű dolgozat pontszámai).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a 10, 20, 30, 40, 50, 60, 70, 80, 90 adatsor alsó kvartilise az $(n+1)p$ módszerrel?`,
          options: ["25", "20", "30", "22,5"],
          answer: 0,
          hint: R`A hely $10 \cdot 0{,}25 = 2{,}5$ – nem egész, interpolálni kell.`,
          explain: R`A 2. és 3. elem között félúton: $20 + 0{,}5 \cdot 10 = 25$. A 20 és a 30 a hely lefelé, illetve felfelé kerekítése, a 22,5 a maximum 25%-a – az nem kvartilis.`
        }
      ]
    },

    /* ------------------------------------------------ 2.6 */
    "ms2-26": {
      title: "Kvíz – 2.6 Szóródási mutatók",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi a 2, 4, 6, 8 adatsor (sokasági, $n$-es nevezős) szórása?`,
          options: ["2,24", "5", "2", "2,58"],
          answer: 0,
          hint: "Átlag, eltérések, négyzetek, átlag, gyök – ebben a sorrendben.",
          explain: R`$\bar x = 5$; eltérésnégyzetek 9, 1, 1, 9; $\sigma^2 = 20/4 = 5$; $\sigma = \sqrt 5 \approx 2{,}24$. Az 5 a variancia (elmaradt a gyök), a 2 az átlagos abszolút eltérés, a 2,58 az $n-1$-es (minta) szórás.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy gyár a napi termelésből kivett 15 csavar hosszából akarja becsülni a teljes napi termelés szórását. Melyik képletet használja?",
          options: [
            R`$s = \sqrt{\frac{1}{n-1}\sum (x_i - \bar x)^2}$`,
            R`$\sigma = \sqrt{\frac{1}{n}\sum (x_i - \bar x)^2}$`,
            R`$\frac{1}{n}\sum |x_i - \bar x|$`,
            R`$x_{\max} - x_{\min}$`
          ],
          answer: 0,
          hint: "Mintából becsül a sokaságra – melyik nevező torzítatlan?",
          explain: R`Mintából a sokasági variancia torzítatlan becslése $s^2$, $n - 1$-es nevezővel; az $n$-es változat átlagosan alábecsül (lásd a 2.6-c teljes felsorolását). Az átlagos abszolút eltérés és a terjedelem más mutató.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy adatsor szórása 3. Minden adatot 2-vel szorzunk, majd 5-öt adunk hozzá. Mennyi az új szórás?",
          options: ["6", "11", "3", "36"],
          answer: 0,
          hint: "Az eltolás nem változtatja a szóródást, a nyújtás igen.",
          explain: R`$a + b\,x$ szórása $|b|\,\sigma = 2 \cdot 3 = 6$. A 11 az eltolást is hozzáadja ($2 \cdot 3 + 5$), a 3 a szorzást hagyja figyelmen kívül, a 36 az új <em>variancia</em> ($4 \cdot 9$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy adatsor átlaga 6, a négyzetek átlaga $\overline{x^2} = 45$. Mennyi a szórás?`,
          options: ["3", "9", "6,24", "39"],
          answer: 0,
          hint: R`Eltolási képlet: $\sigma^2 = \overline{x^2} - \bar x^2$.`,
          explain: R`$\sigma^2 = 45 - 36 = 9$, $\sigma = 3$. A 9 a variancia, a 39 és a $\sqrt{39} \approx 6{,}24$ abból jön, hogy az átlagot négyzetre emelés nélkül vonjuk ki.`
        },
        {
          type: "single", shuffle: true,
          q: "A termék átlagára 200 Ft, szórása 20 Ft; B termék átlagára 50 Ft, szórása 8 Ft. Melyik ára szóródik relatíve jobban?",
          options: [
            "B, mert relatív szórása 16%, A-é 10%",
            "A, mert nagyobb a szórása",
            "egyformán, mert mindkettő ára forintban van",
            "nem lehet összehasonlítani, mert más az átlag"
          ],
          answer: 0,
          hint: "Eltérő nagyságrend – viszonyítsd a szórást az átlaghoz.",
          explain: R`$V_A = 20/200 = 10\%$, $V_B = 8/50 = 16\%$. A relatív szórás éppen arra való, hogy eltérő átlagú (arányskálás) adatsorok szóródását összevesse; az abszolút szórás itt félrevezet.`
        },
        {
          type: "multi",
          q: "Melyik változónál NEM értelmes a relatív szórás? (Több jó válasz is lehet.)",
          options: [
            "hőmérséklet °C-ban",
            "testsúly kg-ban",
            "születési év",
            "havi jövedelem",
            "napi tőzsdei hozam (%), amely negatív is lehet, átlaga 0 körül"
          ],
          answer: [0, 2, 4],
          hint: "Van-e valódi nullpont, és pozitív-e (nem 0 körüli) az átlag?",
          explain: R`A °C és az évszám intervallumskála (önkényes nullpont), a hozam átlaga 0 körüli és lehet negatív – mindháromnál a $\sigma/\bar x$ értelmetlen vagy instabil. A testsúly és a jövedelem arányskálás, pozitív – ott jó.`
        }
      ]
    },

    /* ------------------------------------------------ 2.7 */
    "ms2-27": {
      title: "Kvíz – 2.7 Standardizálás, z-érték",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az átlag 80, a szórás 4. Mennyi a 74-es érték z-értéke?",
          options: ["−1,5", "1,5", "−6", "−0,375"],
          answer: 0,
          hint: R`$z = (x - \bar x)/\sigma$ – figyelj az előjelre és a nevezőre!`,
          explain: R`$z = (74 - 80)/4 = -1{,}5$: másfél szórással az átlag alatt. Az 1,5 előjele rossz, a −6 az eltérés szórással való osztás nélkül, a −0,375 a varianciával (16) osztva.`
        },
        {
          type: "single", shuffle: true,
          q: "Gábor fizikából 68 pontot ért el (átlag 60, szórás 5), Dóra kémiából 83-at (átlag 75, szórás 6). Ki teljesített jobban a saját évfolyamán?",
          options: ["Gábor (z = 1,6)", "Dóra (z ≈ 1,33)", "egyformán, mert mindketten 8 ponttal az átlag fölött vannak", "Dóra, mert több pontot ért el"],
          answer: 0,
          hint: "A pontok és az eltérések más-más skálán vannak – mérj szórásban!",
          explain: R`Gábor: $8/5 = 1{,}6$; Dóra: $8/6 \approx 1{,}33$. Azonos pontkülönbség kisebb szórás mellett kiemelkedőbb. A nyers pontszám vagy az eltérés önmagában nem összevethető.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy adatsor átlaga 40, szórása 5; az alakja ismeretlen. Legalább az adatok hány százaléka esik 30 és 50 közé?",
          options: ["75%", "95%", "50%", "25%"],
          answer: 0,
          hint: "Hány szórásnyira van a 30 és az 50 az átlagtól? Ismeretlen alaknál melyik tétel garantál valamit?",
          explain: R`$k = 10/5 = 2$, Csebisev: legalább $1 - 1/4 = 75\%$. A 95% csak normális (harang alakú) eloszlásnál igaz, a 25% ($1/k^2$) a legfeljebb kívül eső rész, az 50% ($1/k$) nem következik semmiből.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális eloszlásnál az adatok kb. hány százaléka esik $\mu \pm \sigma$ közé?`,
          options: ["68%", "95%", "50%", "75%"],
          answer: 0,
          hint: "A 68–95–99,7 szabály első száma.",
          explain: R`Kb. 68% (±2σ: 95%, ±3σ: 99,7%). Az 50% az IQR-nek felel meg (a középső fél), a 75% a Csebisev-korlát $k = 2$-re.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy teszt átlaga 50, szórása 6. Hány pontot ért el az, akinek z-értéke 2?",
          options: ["62", "52", "100", "53"],
          answer: 0,
          hint: R`Visszafelé: $x = \bar x + z\,\sigma$.`,
          explain: R`$50 + 2 \cdot 6 = 62$. Az 52 a z-t pontként adja hozzá, a 100 az átlagot szorozza, az 53 a szórás felét adja hozzá.`
        }
      ]
    },

    /* ------------------------------------------------ 2.8 */
    "ms2-28": {
      title: "Kvíz – 2.8 Az eloszlás alakja",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\bar x = 30$, Mo $= 24$, $\sigma = 12$. Mennyi a Pearson-féle ferdeségi mutató, és mit jelent?`,
          options: ["0,5 – jobbra ferde", "−0,5 – balra ferde", "0,5 – balra ferde", "2 – jobbra ferde"],
          answer: 0,
          hint: R`$A = (\bar x - \text{Mo})/\sigma$; pozitív érték: a farok a nagy értékek felé nyúlik.`,
          explain: R`$A = 6/12 = 0{,}5$, pozitív → jobbra ferde (jobbra elnyúló). A −0,5 rossz sorrendű kivonás, a „0,5 – balra ferde” az előjel félreértése (vagy a régi „bal oldali aszimmetria” szó tükörfordítása), a 2 a hányados megfordítása.`
        },
        {
          type: "match",
          q: "Milyen alakú tipikusan az eloszlás? Párosítsd!",
          choices: [JOBB, BAL, SZIM], shuffle: false,
          pairs: [
            ["havi jövedelem egy országban", JOBB],
            ["egy nagyon könnyű dolgozat pontszámai", BAL],
            ["felnőtt nők testmagassága", SZIM],
            ["várakozási idő a postán", JOBB],
            ["halálozási életkor egy fejlett országban", BAL]
          ],
          hint: "Hol van a „fal” (alsó vagy felső korlát), és merre lehetnek ritka, szélsőséges értékek?",
          explain: R`Jövedelem, várakozás: alul korlát (0), felül ritka nagy értékek → jobbra ferde. Könnyű dolgozat, halálozási kor: felül korlát vagy tömörülés, alul ritka kis értékek → balra ferde. A testmagasság közel normális.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit jelent, ha egy adatsor csúcsossága (a −3-mal korrigált kurtózis) nagy pozitív szám?",
          options: [
            "A normálisnál több a szélsőséges (kiugró) érték, és az adatok közepe is sűrűbb.",
            "Az eloszlás jobbra ferde.",
            "Az adatok egyenletesen oszlanak el.",
            "Az átlag nagyobb a mediánnál."
          ],
          answer: 0,
          hint: "A kurtózis a negyedik hatványt használja – mit nagyít fel a negyedik hatvány?",
          explain: R`A $z^4$ a nagy eltéréseket erősen felnagyítja: pozitív csúcsosság → „vastag farok”, sok kiugró érték, mellette éles csúcs. A ferdeség az irányról szól, nem erről; az egyenletes eloszlás csúcsossága negatív.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "A 0 ferdeség nem garantálja, hogy az eloszlás egycsúcsú.",
            "Pozitív ferdeségnél az átlag jellemzően nagyobb a mediánnál.",
            "A ferdeség megváltozik, ha a súlyt kg helyett grammban mérjük.",
            "A normális eloszlás korrigált csúcsossága 0.",
            "Kétcsúcsú eloszlásnál az átlag jó „tipikus érték”."
          ],
          answer: [0, 1, 3],
          hint: "Gondolj az 1, 1, 1, 9, 9, 9 példára, és arra, hogy a mutatók z-értékekből számolnak.",
          explain: R`Az 1, 1, 1, 9, 9, 9 ferdesége 0, mégis kétcsúcsú, és az átlaga (5) olyan helyen van, ahol egy adat sincs. A ferdeség és csúcsosság z-értékekből számol, ezért mértékegység-váltáskor nem változik. A −3-as korrekció épp azért van, hogy a normálisé 0 legyen.`
        },
        {
          type: "single", shuffle: true,
          q: "Az NGA-jegyzet szerint „bal oldali aszimmetria” esetén Mo < Me < x̄. Hogyan mondjuk ezt ebben a tananyagban?",
          options: ["jobbra ferde (jobbra elnyúló)", "balra ferde (balra elnyúló)", "szimmetrikus", "kétcsúcsú"],
          answer: 0,
          hint: "A régi magyar elnevezés a csúcs helyét, a mai a farok irányát mondja.",
          explain: R`Mo &lt; Me &lt; $\bar x$: a tömeg (csúcs) balra van, a hosszú farok jobbra → mai szóhasználattal (és az angol <em>right-skewed</em> szerint) jobbra ferde. Az elnevezések ütközése miatt mindig a középértékek sorrendjét érdemes nézni.`
        }
      ]
    },

    /* ------------------------------------------------ 2.9 */
    "ms2-29": {
      title: "Kvíz – 2.9 Szóródás csoportokra bontva",
      questions: [
        {
          type: "single", shuffle: true,
          q: "I. csoport: 2, 4; II. csoport: 8, 10. Mennyi a külső (csoportok közötti) variancia?",
          options: ["9", "10", "1", "3"],
          answer: 0,
          hint: "Csoportátlagok: 3 és 9, főátlag 6. A külső variancia a csoportátlagok eltérésnégyzeteinek létszámmal súlyozott átlaga.",
          explain: R`$\dfrac{2 \cdot (3 - 6)^2 + 2 \cdot (9 - 6)^2}{4} = 9$. A 10 a teljes variancia, az 1 a belső (mindkét csoportban 1), a 3 a külső szórás (gyök) – variancia helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy adatsor teljes varianciája 40, a csoportokon belüli (belső) variancia 10. Mekkora részt „magyaráz” a csoportosítás ($H^2$)?`,
          options: ["0,75", "0,25", "0,33", "3"],
          answer: 0,
          hint: "Előbb számold ki a külső varianciát, aztán oszd a teljessel.",
          explain: R`Külső: $40 - 10 = 30$; $H^2 = 30/40 = 0{,}75$. A 0,25 a belső rész aránya, a 0,33 a belső/külső, a 3 a külső/belső hányados – egyik sem a teljeshez viszonyít.`
        },
        {
          type: "single", shuffle: true,
          q: "A belső variancia 9, a külső 16. Mennyi a teljes adatsor szórása?",
          options: ["5", "7", "25", "12"],
          answer: 0,
          hint: "A felbontás varianciákra igaz, nem szórásokra.",
          explain: R`Teljes variancia $9 + 16 = 25$, szórás $\sqrt{25} = 5$. A 7 a szórások ($3 + 4$) összeadása – ez hibás; a 25 a variancia; a 12 a két szórás szorzata.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a variancia-felbontásra? (Több jó válasz is lehet.)",
          options: [
            "Ha minden csoportátlag egyenlő, a külső variancia 0.",
            "Ha minden csoporton belül az adatok egyenlők, a belső variancia 0.",
            "A külső variancia lehet nagyobb a teljes varianciánál.",
            "A csoportvarianciákat és a csoportátlag-eltéréseket a csoportlétszámmal kell súlyozni.",
            "A felbontás a szórásokra is igaz: teljes szórás = belső szórás + külső szórás."
          ],
          answer: [0, 1, 3],
          hint: "Mindkét tag nemnegatív; és melyik mennyiségekre bizonyítottuk a tételt?",
          explain: R`Mindkét rész $\ge 0$, és összegük a teljes, így egyik sem lehet nagyobb nála. A felbontás négyzetes mennyiségekre (varianciákra, négyzetösszegekre) igaz, szórásokra nem. Különböző létszámoknál a súlyozás elengedhetetlen.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "ms2-final": {
      title: "Fejezetzáró teszt – Egy változó leírása",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy évfolyam két csoportja: 15 fő, átlag 3,0; 25 fő, átlag 4,6. Mennyi az évfolyam átlaga?",
          options: ["4,0", "3,8", "3,6", "4,6"],
          answer: 0,
          hint: "Csoportátlagokból főátlag: létszámmal súlyozz.",
          explain: R`$\dfrac{15 \cdot 3{,}0 + 25 \cdot 4{,}6}{40} = \dfrac{45 + 115}{40} = 4{,}0$. A 3,8 a súlyozatlan átlagok átlaga, a 3,6 felcserélt súlyokkal jön ki, a 4,6 csak a nagyobb csoporté.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy autó három egyenlő hosszú szakaszt tesz meg 20, 30 és 60 km/h-val. Mennyi az átlagsebessége?",
          options: ["30 km/h", "36,7 km/h", "33,0 km/h", "40,4 km/h"],
          answer: 0,
          hint: "Azonos utak – melyik átlag?",
          explain: R`Harmonikus: $\dfrac{3}{1/20 + 1/30 + 1/60} = \dfrac{3}{0{,}1} = 30$ km/h. A 36,7 a számtani, a 33,0 a mértani, a 40,4 a négyzetes átlag.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cég árbevétele 3 év alatt 2000-ről 2662 millió Ft-ra nőtt. Mennyi az évi átlagos növekedés?",
          options: ["10%", "11,03%", "33,1%", "7,4%"],
          answer: 0,
          hint: R`Mértani átlag: $\sqrt[n]{y_n/y_0}$ – hány változás történt?`,
          explain: R`$\sqrt[3]{2662/2000} = \sqrt[3]{1{,}331} = 1{,}1$ → 10%. A 11,03% a teljes növekedés harmada (számtani szemlélet), a 33,1% a teljes növekedés, a 7,4% negyedik gyökkel (rossz kitevő) jön ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy adatsorban $Q_1 = 12$ és $Q_3 = 20$. Melyik érték kiugró?`,
          options: ["33", "31", "1", "25"],
          answer: 0,
          hint: R`Kerítés: $Q_1 - 1{,}5\,\text{IQR}$ és $Q_3 + 1{,}5\,\text{IQR}$.`,
          explain: R`IQR = 8, kerítés: $12 - 12 = 0$ és $20 + 12 = 32$. Csak a 33 esik kívül; a 31 és az 1 közel van a kerítéshez, de belül.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 3, 5, 7 egy minta. Mennyi a korrigált (mintabeli) szórása, $s$?`,
          options: ["2", "1,63", "4", "2,67"],
          answer: 0,
          hint: R`Mintából becslünk: a nevező $n - 1$, és ne felejtsd el a gyököt!`,
          explain: R`Eltérésnégyzetek 4, 0, 4, összegük 8; $s^2 = 8/2 = 4$, $s = 2$. Az 1,63 az $n$-es szórás ($\sqrt{8/3}$), a 4 az $s^2$, a 2,67 az $n$-es variancia.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik párosítás jellemzi legjobban egy erősen jobbra ferde, kiugró értékeket tartalmazó béradatsort?",
          options: ["medián és interkvartilis terjedelem", "átlag és szórás", "módusz és terjedelem", "átlag és relatív szórás"],
          answer: 0,
          hint: "Melyik közép- és szóródási mutató robusztus?",
          explain: R`A medián és az IQR alig érzékeny a kiugró értékekre. Az átlagot és a szórást (és így a relatív szórást) néhány nagyon magas bér erősen felhúzza; a terjedelem csak a két szélső adattól függ.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy adatsorról csak annyit tudunk: átlag 100, szórás 10. Legalább az adatok hányad része esik 70 és 130 közé?",
          options: ["≈ 88,9%", "≈ 99,7%", "75%", "≈ 33,3%"],
          answer: 0,
          hint: "Hány szórásnyi a távolság, és mit mond Csebisev ismeretlen alaknál?",
          explain: R`$k = 3$: legalább $1 - 1/9 \approx 88{,}9\%$. A 99,7% csak normális eloszlásra igaz, a 75% a $k = 2$ esete, a 33,3% $1/k$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cég létszáma jan. 1-jén 40, máj. 1-jén 50, szept. 1-jén 44, dec. 31-én 60 fő. Mennyi az éves átlagos létszám?",
          options: ["48 fő", "48,5 fő", "36 fő", "50 fő"],
          answer: 0,
          hint: "Időponti adatok, három egyenlő (négyhónapos) időszak.",
          explain: R`Kronologikus átlag: $\dfrac{20 + 50 + 44 + 30}{3} = \dfrac{144}{3} = 48$ fő. A 48,5 az egyszerű számtani átlag, a 36 a jó számláló 4-gyel osztva (adatok száma időszakok helyett), az 50 csak az első és utolsó adat átlaga.`
        },
        {
          type: "single", shuffle: true,
          q: "Két 10 fős csoport: az egyikben átlag 50, a másikban 60, a szórás mindkettőben 5. Mennyi a 20 fő teljes varianciája?",
          options: ["50", "25", "5", "100"],
          answer: 0,
          hint: "Teljes = belső + külső. Mennyi a főátlag?",
          explain: R`Belső: 25. Főátlag 55, külső: $(10 \cdot 25 + 10 \cdot 25)/20 = 25$. Teljes: $25 + 25 = 50$. A 25 csak az egyik rész, az 5 a csoportszórás, a 100 a csoportátlagok különbségének négyzete.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Jobbra ferde eloszlásnál a többség az átlag alatt van.",
            "A kvartiliseknek több elterjedt számítási módja van, kis mintán eltérő eredménnyel.",
            "A mintából számolt szórásnál az $n - 1$-es nevező azért kell, mert a mintaátlagtól mért eltérések átlagosan kisebbek a valódiaknál.",
            "A hisztogram oszlopainak magassága mindig a gyakorisággal egyenlő.",
            "A z-érték megmutatja, hány százalék van az adott érték alatt."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a bérpéldára, a kvartilis-definíciók táblázatára és az egyenlőtlen osztályközökre.",
          explain: R`Az első három igaz (2.10, 2.5-a, 2.6-c). Egyenlőtlen osztályközöknél a hisztogram magassága a sűrűség, nem a gyakoriság. A z-érték szórásban méri a távolságot; százalékot csak egy adott eloszlás (pl. normális) ismeretében lehet belőle mondani.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
