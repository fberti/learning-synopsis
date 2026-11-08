    /* ------------------------------------------------ 7.5 */
    "ms7-75": {
      title: "Kvíz – 7.5 Próba és konfidencia-intervallum",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A $\mu$ 95%-os KI-je $[3{,}2;\ 8{,}6]$. Mit dönt a kétoldali 5%-os próba a $H_0$: $\mu = 3$, illetve a $H_0$: $\mu = 8$ hipotézisről?`,
          options: [
            R`A $\mu_0 = 3$-at elveti, a $\mu_0 = 8$-at nem veti el.`,
            R`A $\mu_0 = 8$-at elveti, a $\mu_0 = 3$-at nem veti el.`,
            R`Mindkettőt elveti, mert egyik sem a KI közepe ($5{,}9$).`,
            R`Egyiket sem veti el, mert mindkettő közel van az intervallumhoz.`
          ],
          answer: 0,
          hint: R`Kettősség: a kétoldali próba pontosan azokat a $\mu_0$ értékeket nem veti el, amelyek benne vannak a KI-ben.`,
          explain: R`A 3 kívül esik a $[3{,}2;\ 8{,}6]$ intervallumon → elvetjük; a 8 benne van → nem vetjük el. A fordított válasz felcseréli a szabályt („a KI-ben lévő értéket vetjük el”). A KI közepe ($\bar x$) nem az egyetlen „elfogadható” érték: a KI <em>minden</em> pontja összefér az adattal. Az pedig, hogy egy érték „közel van” a KI széléhez, nem számít – a határ éles: kívül vagy belül.`
        },
        {
          type: "single", shuffle: true,
          q: R`A konzervek várható töltősúlyának 95%-os $t$-KI-je $[390{,}65;\ 405{,}35]$ g. Melyik gyártói állítást ($H_0$: $\mu = \mu_0$) veti el 5%-on a kétoldali $t$-próba?`,
          options: [R`$\mu_0 = 388$ g`, R`$\mu_0 = 392$ g`, R`$\mu_0 = 400$ g`, R`$\mu_0 = 405$ g`],
          answer: 0,
          hint: R`Nem kell újra számolnod a $t$-t: nézd meg, melyik érték esik a KI-n kívül.`,
          explain: R`Csak a 388 esik az intervallumon kívül, ezt elveti a próba (ellenőrzésképp: $t \approx 2{,}92$, $p \approx 0{,}011$). A 392, a 400 és a 405 mind a $[390{,}65;\ 405{,}35]$-ben van, ezeket nem veti el (a 405-nél $p \approx 0{,}06$ – közel a határhoz, de még belül). Aki a 400-at választja, az a „nem vetjük el” és az „elvetjük” szerepét keveri: a 400 a fejezet példájában épp összefért az adattal ($p \approx 0{,}57$).`
        },
        {
          type: "set",
          q: R`A joghurtoknál ($\bar x = 196$, $\sigma/\sqrt n \approx 0{,}894$) a 99%-os KI $[193{,}70;\ 198{,}30]$. Mely $\mu_0$ értékeket <b>nem</b> veti el az 1%-os kétoldali próba? Jelöld meg mindet!`,
          items: ["193", "194", "196", "198", "199", "200"],
          answer: ["194", "196", "198"],
          hint: R`Melyik megbízhatósági szint tartozik az 1%-os kétoldali próbához? Utána csak azt kell nézni, mi esik az intervallumba.`,
          explain: R`Az $\alpha = 1\%$-os kétoldali próbához az $1 - \alpha = 99\%$-os KI tartozik. Benne van: 194, 196, 198 – ezeket nem veti el. Kívül esik: 193 (a bal szél 193,70), 199 és 200 (a jobb szél 198,30) – ezeket elveti. A 200 tehát 1%-on is elvetendő, ahogy a szakasz gyakorló feladata is kiszámolta. A 193 és a 199 „közel van” az intervallumhoz, de a határ éles: ami kívül esik, azt elveti a próba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 99%-os KI tartalmazza a $\theta_0$-t. Mit mondhatunk az 5%-os kétoldali próbáról ($H_0$: $\theta = \theta_0$)?`,
          options: [
            R`Semmi biztosat: a 95%-os KI szűkebb, a $\theta_0$ kieshet belőle.`,
            R`5%-on sem veti el, hiszen a 99%-os KI-ben benne van.`,
            R`5%-on biztosan elveti, mert a két szint különbözik.`,
            R`5%-on sem veti el, mert a 95%-os KI tágabb a 99%-osnál.`
          ],
          answer: 0,
          hint: R`Melyik intervallum a szélesebb: a 95%-os vagy a 99%-os? És melyik intervallumot kell nézni az 5%-os próbához?`,
          explain: R`Az 5%-os próbához a 95%-os KI kell, és az <b>szűkebb</b> a 99%-osnál. Ha a $\theta_0$ a 99%-osban benne van, a 95%-osból még kieshet (a széle közelében) – lehet elvetés is, nem-elvetés is. Fordítva viszont biztos: ha a 95%-os KI tartalmazza, a 99%-os is. A „95%-os KI tágabb” a megbízhatóság és a szélesség kapcsolatát fordítja meg: nagyobb biztonsághoz <em>szélesebb</em> intervallum kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy átlagos változás 95%-os KI-je $[-1{,}2;\ 3{,}4]$. Melyik a helyes következtetés?`,
          options: [
            R`5%-on nem szignifikáns, mert a 0 benne van; de akár $3{,}4$-es növekedés is összefér az adattal.`,
            R`5%-on szignifikáns, mert az intervallum nagyobb része pozitív.`,
            R`5%-on nem szignifikáns, tehát bebizonyosodott, hogy nincs változás.`,
            R`5%-on szignifikáns, mert az intervallum közepe ($1{,}1$) nem 0.`
          ],
          answer: 0,
          hint: R`Melyik érték jelenti azt, hogy „nincs változás”? Benne van az intervallumban? És mit állít a nem-elvetés?`,
          explain: R`A „nincs változás” a 0, és ez benne van a KI-ben → a kétoldali 5%-os próba nem veti el. De a nem-elvetés nem bizonyítja $H_0$-t: a KI szerint $-1{,}2$ és $+3{,}4$ között minden összefér az adattal, köztük egy elég nagy növekedés is. Az intervallum „nagyobb része” vagy a középpontja nem dönt – csak az, hogy a $\theta_0 = 0$ belül van-e.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cikk csak ennyit közöl: „$p = 0{,}20$, nem szignifikáns”. Mit tudnánk meg, ha a KI-t is közölné?`,
          options: [
            "Hogy mekkora hatások férnek össze az adattal – a hatás nagyságát és a bizonytalanságot.",
            R`Hogy mekkora valószínűséggel igaz $H_0$.`,
            "Hogy a vizsgálat egy pontosabb p-értékkel mégis szignifikáns-e.",
            R`Semmi újat: a KI ugyanazt mondja, mint a $p$.`
          ],
          answer: 0,
          hint: "A próba csak annyit mond: a $\\theta_0$ összefér-e az adattal. Mit mond a KI a többi értékről?",
          explain: R`A KI azoknak az értékeknek a halmaza, amelyeket a próba nem vetne el – tehát megmutatja, mi minden fér össze az adattal. Egy $[-0{,}1;\ 0{,}5]$ és egy $[-0{,}01;\ 0{,}05]$ intervallum ugyanúgy „nem szignifikáns”, de nagyon mást jelent (az elsőnél nagy hatás sincs kizárva, a másodiknál a hatás biztosan kicsi). A KI sem $H_0$ valószínűségét adja, és nem „javítja meg” a p-értéket. A „semmi újat” csak a 0-ról szóló igen–nem döntésre igaz.`
        }
      ]
    },

    /* ------------------------------------------------ 7.6 */
    "ms7-76": {
      title: "Kvíz – 7.6 Permutációs próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hat diák: az új módszerrel 7, 9, 11, a régivel 3, 5, 4 pont (különbség 5, a legnagyobb a 20 felosztás közül). Mennyi a <b>kétoldali</b> p-érték?`,
          options: ["0,10", "0,05", "0,025", "0,014"],
          answer: 0,
          hint: R`Kétoldalinál a $|\text{különbség}| \ge 5$ felosztásokat kell megszámolni. Hány ilyen van a 20-ból?`,
          explain: R`A $+5$ és a $-5$ is egy-egy felosztásból jön, így $p = 2/20 = 0{,}10$. A 0,05 az egyoldali p-érték (elmaradt a duplázás). A 0,025 a felezés – kétoldalinál nem felezünk, hanem mindkét szélet összeadjuk. A 0,014 $= 1/70$ a teás kísérlet p-értéke: ott 70 választás volt, itt csak $\binom63 = 20$ felosztás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanez a hat pontszám (7, 9, 11, 3, 5, 4), de az új csoportba a 11, 9, 5, a régibe a 7, 3, 4 került. A megfigyelt különbség $25/3 - 14/3 \approx 3{,}67$. Mennyi az <b>egyoldali</b> p-érték? (A 20 felosztás közül egy-egy ad $3{,}67$-et, illetve 5-öt; a többi kisebb.)`,
          options: ["0,10", "0,05", "0,15", "0,20"],
          answer: 0,
          hint: R`A p-érték a <em>legalább ilyen</em> szélsőséges felosztások aránya – nem csak a pontosan ugyanilyeneké.`,
          explain: R`Legalább 3,67-es különbséget két felosztás ad (3,67 és 5), így $p = 2/20 = 0{,}10$. A 0,05 csak a megfigyelt felosztást számolja – mintha a „pontosan ennyi” valószínűségét kérdeznénk, nem a „legalább ennyiét”. A 0,15 a 3-as különbséget is beveszi (az már kevésbé szélsőséges). A 0,20 a kétoldali érték ($\pm 3{,}67$ és $\pm 5$: 4 felosztás).`
        },
        {
          type: "single", shuffle: true,
          q: R`Hányféleképpen osztható 10 diák egy 5 fős „új” és egy 5 fős „régi” csoportra?`,
          options: ["252", "30 240", "1024", "50"],
          answer: 0,
          hint: R`Elég kiválasztani, ki kerül az új csoportba. Számít-e a csoporton belüli sorrend?`,
          explain: R`$\binom{10}5 = 252$ (a maradék 5 automatikusan a régi csoport). A 30 240 $= 10\cdot9\cdot8\cdot7\cdot6$ a variáció – sorrendet is számol, pedig a csoporton belül nem számít. Az 1024 $= 2^{10}$ minden diákot egymástól függetlenül sorol be, így a csoportméret nem lenne 5–5. Az 50 $= 10 \cdot 5$ értelmetlen szorzat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a legkisebb elérhető egyoldali p-érték 4–4 fős csoportoknál (minden pontszám különböző)?`,
          options: [R`$1/70 \approx 0{,}014$`, R`$1/20 = 0{,}05$`, R`$1/16 \approx 0{,}063$`, R`$1/256 \approx 0{,}004$`],
          answer: 0,
          hint: R`A legszélsőségesebb felosztás egyetlen egy. Hány felosztás van összesen?`,
          explain: R`$\binom84 = 70$ felosztás van, a legszélsőségesebb közülük egy, így a legkisebb p-érték $1/70 \approx 0{,}014$ – 5%-on lehet szignifikáns, 1%-on soha. (Ugyanez a 8 csészés teás kísérlet!) Az $1/20$ a 3–3 fős eset. Az $1/16 = 1/2^4$ és az $1/256 = 1/2^8$ érmedobásszerű, független besorolást feltételez – a permutációs próba viszont rögzített csoportméretekkel osztja újra az adatokat.`
        },
        {
          type: "single", shuffle: true,
          q: R`10&nbsp;000 véletlen keverésből 230 adott a megfigyeltnél nem kisebb különbséget (egyoldali próba). Mennyi a p-érték becslése?`,
          options: ["0,023", "0,23", "0,0023", "0,046"],
          answer: 0,
          hint: "A p-érték: a keverések hányadában lett a statisztika legalább olyan szélsőséges, mint a megfigyelt.",
          explain: R`$230/10\,000 = 0{,}023$. A 0,23 és a 0,0023 tizedesvessző-csúszás. A 0,046 duplázás – de a kérdés egyoldali, ott nem duplázunk.`
        },
        {
          type: "match",
          q: R`Párosítsd a módszert a lényegével!`,
          pairs: [
            ["permutációs próba", "visszatevés nélkül újraosztja a csoportcímkéket"],
            ["bootstrap", "visszatevéssel újramintáz, a statisztika ingadozását becsli"],
            ["Fisher egzakt próbája", "a teás kísérlet permutációs próbája"],
            [R`kétmintás $t$-próba`, "a nullhipotézis melletti eloszlást képletből veszi"]
          ],
          hint: R`Melyik módszer modellezi $H_0$ eloszlását, és melyik egy becslés bizonytalanságát? Melyiknél van visszatevés?`,
          explain: R`A permutációs próba a meglévő adatokat osztja újra, visszatevés nélkül, és így állítja elő $H_0$ eloszlását. A bootstrap (5.6) visszatevéssel mintáz újra – ez standard hibát, KI-t ad, nem próbát. Fisher egzakt próbája a teás kísérletre ugyanez a permutációs gondolat (a 70 választás egyformán valószínű). A $t$-próba ugyanazt a kérdést képletből válaszolja meg – a 8 + 8 diáknál nagyon hasonló eredménnyel (0,011 vs 0,013).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a permutációs próbára? (Több jó válasz is lehet.)`,
          options: [
            "Nem kell hozzá normalitás, és képlet sem.",
            R`Feltétele, hogy $H_0$ mellett a címkék felcserélhetők legyenek – ezt a véletlen besorolás biztosítja.`,
            "Nagy mintánál nem soroljuk fel az összes felosztást, hanem pl. 10 000-szer véletlenül keverünk.",
            "A keverést visszatevéssel végezzük, hogy minden keverésben más adatok szerepeljenek.",
            "Megfigyeléses adatnál is megmutatja, mi okozza a különbséget."
          ],
          answer: [0, 1, 2],
          hint: "Mit biztosít a randomizálás? És mi a különbség a permutáció és a bootstrap között?",
          explain: R`Az első három igaz (lásd a módszer-dobozt és a 8 + 8-as példát). A visszatevéses keverés a bootstrap – az más kérdésre felel; a permutációs próba ugyanazokat az adatokat osztja újra. Megfigyeléses adatnál a próba legfeljebb annyit mutat, hogy a különbség nem csak véletlen; az okot nem – a csoportosítást zavaró változó is okozhatja.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 8 + 8 diáknál a $\binom{16}8 = 12\,870$ felosztásból 173 adott legalább 7,25-os különbséget. Mennyi a <b>kétoldali</b> p-érték?`,
          options: ["0,027", "0,013", "0,0067", "0,011"],
          answer: 0,
          hint: R`Az egyoldali $173/12\,870$. Kétoldalinál a másik irányú, ugyanilyen nagy különbség is számít – és a felosztások szimmetrikusak.`,
          explain: R`Egyoldali: $173/12\,870 \approx 0{,}013$; kétoldali: $2 \cdot 173/12\,870 \approx 0{,}027$ (minden felosztásnak van „tükörképe”, ahol a két csoport helyet cserél). A 0,013 az egyoldali érték, a 0,0067 a hibás felezés. A 0,011 a kétmintás $t$-próba <em>egyoldali</em> p-értéke – közel van az egyoldali permutációshoz, de nem a kétoldali válasz.`
        }
      ]
    },

    /* ------------------------------------------------ 7.7 */
    "ms7-77": {
      title: "Kvíz – 7.7 Többszörös tesztelés és p-hacking",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`8 független próba, mindegyikben igaz $H_0$, $\alpha = 5\%$. Mennyi az esélye legalább egy téves riasztásnak?`,
          options: ["0,337", "0,400", "0,050", "0,663"],
          answer: 0,
          hint: R`Komplementer: mennyi az esélye, hogy egyik próba sem riaszt?`,
          explain: R`$P(\text{egyik sem riaszt}) = 0{,}95^8 \approx 0{,}663$, így $P(\text{legalább egy}) = 1 - 0{,}95^8 \approx 0{,}337$. A 0,663 maga a $0{,}95^8$ – elmaradt a komplementer. A 0,400 $= 8 \cdot 0{,}05$: ez a téves találatok <em>várható száma</em>, nem a valószínűség (sok próbánál 1 fölé is menne). A 0,050 azt hiszi, hogy a próbák száma nem számít.`
        },
        {
          type: "single", shuffle: true,
          q: R`10 próbát végzel, a családonkénti hibaarányt 5%-on akarod tartani. Mi a Bonferroni-féle szint próbánként?`,
          options: ["0,005", "0,5", "0,05", "0,0005"],
          answer: 0,
          hint: R`A Bonferroni-korrekció az $\alpha$-t szétosztja a próbák között.`,
          explain: R`$\alpha/m = 0{,}05/10 = 0{,}005$. A 0,5 $= \alpha \cdot m$ – szorzás osztás helyett, ez épp lazítana. A 0,05 a korrekció nélküli szint. A 0,0005 $0{,}05/100$, tizedes-csúszás.`
        },
        {
          type: "set",
          q: R`Egy vizsgálatban 20 próbát végeztek. Bonferroni-korrekcióval (5%-os családonkénti szint) melyik p-érték szignifikáns? Jelöld meg mindet!`,
          items: ["0,0009", "0,0024", "0,003", "0,01", "0,04"],
          answer: ["0,0009", "0,0024"],
          hint: R`Először számold ki a küszöböt: $\alpha/m$.`,
          explain: R`A küszöb $0{,}05/20 = 0{,}0025$. Ez alatt van a 0,0009 és a 0,0024. A 0,003 már fölötte van – hajszállal, de a küszöb éles. A 0,01 és a 0,04 korrekció nélkül szignifikáns lenne, de 20 próbánál ez semmit sem ér: átlagosan 1 téves találat úgyis jönne.`
        },
        {
          type: "single", shuffle: true,
          q: R`20 független próbát egyenként $0{,}0025$-ös szinten végzünk, mindegyikben igaz $H_0$. Mennyi a családonkénti hibaarány (legalább egy téves riasztás esélye)?`,
          options: ["0,049", "0,0025", "0,642", "0,951"],
          answer: 0,
          hint: R`Ugyanaz a képlet, mint korrekció nélkül: $1 - (1-\alpha)^m$, csak most $\alpha = 0{,}0025$.`,
          explain: R`$1 - 0{,}9975^{20} \approx 0{,}049$ – a Bonferroni tényleg 5% alá szorítja. A 0,0025 egyetlen próba szintje. A 0,642 $= 1 - 0{,}95^{20}$, a korrekció nélküli érték. A 0,951 $= 0{,}9975^{20}$: annak esélye, hogy <em>egyik</em> próba sem riaszt – elmaradt a komplementer.`
        },
        {
          type: "single", shuffle: true,
          q: R`60 próbát végzünk 5%-on, és egyikben sincs valódi hatás. Átlagosan hány téves „felfedezésre” számíthatunk?`,
          options: ["3", "1", "57", "0,95"],
          answer: 0,
          hint: R`Ez várható érték: hány próba, és mindegyik mekkora eséllyel riaszt tévesen?`,
          explain: R`$60 \cdot 0{,}05 = 3$ téves találat várható. Az 1 a zselécukros példa (20 próba) számát hozza át. Az 57 a <em>nem</em> riasztó próbák várható száma. A 0,95 $\approx 1 - 0{,}95^{60}$ annak <em>valószínűsége</em>, hogy legalább egy téves találat lesz – ez nem darabszám.`
        },
        {
          type: "multi",
          q: R`Melyik p-hacking? (Több jó válasz is lehet.)`,
          options: [
            R`Addig gyűjteni adatot, amíg $p$ 0,05 alá nem esik, és ott megállni.`,
            "Alcsoportokat vizsgálni (nők, 40 év felettiek…), amíg valahol „ki nem jön”.",
            "Az egy- vagy kétoldali próbát az eredmény láttán választani.",
            "A hipotézist és az elemzési tervet az adatgyűjtés előtt nyilvánosan rögzíteni.",
            "Mind a 12 mért mutatót közölni, Bonferroni-korrekcióval."
          ],
          answer: [0, 1, 2],
          hint: "A p-hacking rejtett többszörös tesztelés: sok elemzési út közül a szignifikánsat választjuk. Melyik lehetőség zárja ezt ki?",
          explain: R`Az első három az „elágazó ösvények kertje”: mindegyiknél több próbát (vagy több lehetséges elemzést) végzünk, és csak a szignifikánsat mutatjuk meg – a közölt p 5%-os biztonságot sugall, a valódi téves riasztási arány jóval nagyobb. Az előzetes regisztráció épp a védekezés ellene, és az összes mutató korrigált közlése is tisztességes eljárás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit jelent a publikációs torzítás (file drawer problem)?`,
          options: [
            "A szignifikáns eredményeket szívesebben közlik, a „semmit sem találtunk” a fiókban marad – ezért a megjelent irodalom túlbecsüli a hatásokat.",
            "A folyóiratok a nem szignifikáns eredményeket részesítik előnyben, ezért a valódi hatások rejtve maradnak.",
            "A kutatók megjelenés előtt meghamisítják az adatokat.",
            "A cikkek mind Bonferroni-korrekciót használnak, ezért túl szigorúak."
          ],
          answer: 0,
          hint: "Melyik eredmény kerül nagyobb eséllyel címlapra: a „szignifikáns” vagy a „nincs különbség”?",
          explain: R`A folyóiratok a szignifikáns eredményt közlik szívesebben; a nem szignifikánsak eltűnnek. Így a megjelent irodalomban több a téves riasztás, és a hatások nagyobbnak látszanak – az Open Science Collaboration (2015) ismétlésében az eredeti 97% helyett csak kb. 36% lett szignifikáns, és a hatások átlagosan feleakkorák voltak. Ez nem csalás, hanem rendszerszintű szelekció; az irány pedig épp fordított, mint a második opcióban.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cég 40 hirdetésváltozatot tesztel a régivel szemben (mindegyik külön próba, 5%). Kettő „szignifikánsan jobb” lett. Mit mondasz?`,
          options: [
            "Ennyi téves találat átlagosan akkor is várható, ha egyik sem jobb – korrekció és új mintán megismétlés kell.",
            R`Mindkettő biztosan jobb, hiszen mindkettőnél $p \lt 0{,}05$.`,
            "Legalább az egyik 95% eséllyel valóban jobb.",
            "Mindkettő téves riasztás, mert 40 próbánál a szignifikáns eredmények mindig tévesek."
          ],
          answer: 0,
          hint: R`Hány téves találat várható 40 próbánál, ha egyik változat sem jobb?`,
          explain: R`$40 \cdot 0{,}05 = 2$ téves találat várható akkor is, ha egyik változat sem jobb – a kapott kettő tehát pont ennyi. Bonferronival a küszöb $0{,}05/40 = 0{,}00125$ lenne, és a két „nyertest” új mintán érdemes megismételni. A „95% eséllyel valódi” a $1 - p$ = hatás valószínűsége hiba. Az utolsó opció túloz: lehet köztük valódi hatás is, csak a próbák alapján nem tudjuk megkülönböztetni.`
        }
      ]
    },

    /* ------------------------------------------------ 7.8 */
    "ms7-78": {
      title: "Kvíz – 7.8 Statisztikai vs. gyakorlati szignifikancia",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egymillió diákon a reggelizők átlagos IQ-ja 0,1 ponttal magasabb ($\sigma = 15$), $z \approx 6{,}7$. Mennyi a hatásnagyság (Cohen-féle $d$)?`,
          options: [R`$\approx 0{,}007$`, R`$\approx 6{,}7$`, R`$\approx 0{,}015$`, R`$0{,}1$`],
          answer: 0,
          hint: R`$d$ = a különbség a szórás egységeiben. Függ-e a mintanagyságtól?`,
          explain: R`$d = 0{,}1/15 \approx 0{,}007$ – gyakorlatilag nulla (a „kicsi” határa is 0,2). A 6,7 a próbastatisztika: az a mintanagysággal együtt nő, a hatásnagyság nem. A 0,015 a standard hiba ($15/\sqrt{10^6}$). A 0,1 a nyers különbség IQ-pontban, nem szórásegységben.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n = 40\,000$, $\sigma = 15$, a mért különbség $0{,}3$ pont. Mennyi a $z$ és a $d$?`,
          options: [R`$z = 4$, $d = 0{,}02$`, R`$z = 0{,}02$, $d = 4$`, R`$z = 4$, $d = 0{,}3$`, R`$z = 800$, $d = 0{,}02$`],
          answer: 0,
          hint: R`$z = \frac{\text{különbség}}{\sigma/\sqrt n}$, $d = \frac{\text{különbség}}{\sigma}$. Mennyi $\sqrt{40\,000}$?`,
          explain: R`$\sigma/\sqrt n = 15/200 = 0{,}075$, így $z = 0{,}3/0{,}075 = 4$ (nagyon szignifikáns), de $d = 0{,}3/15 = 0{,}02$ (elhanyagolható). A $z = 0{,}02$, $d = 4$ felcseréli a kettőt. A $d = 0{,}3$ elfelejt a szórással osztani. A $z = 800$ az $\sigma/n$-nel számol $\sigma/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pilot-vizsgálat 10 betegen: a kezelés átlagosan 8 Hgmm-rel csökkenti a vérnyomást (klinikailag jelentős), $p = 0{,}12$, a KI kb. $-18$-tól $+2$ Hgmm-ig. Mi a helyes értelmezés?`,
          options: [
            "A minta kicsi, a KI széles: a hatásosság nem igazolt, de nem is kizárt – nagyobb vizsgálat kell.",
            "A kezelés hatástalan, mert nem szignifikáns.",
            R`88% az esélye, hogy a kezelés hat ($1 - p$).`,
            R`„Majdnem szignifikáns”, ezért hatásosként közölhető.`
          ],
          answer: 0,
          hint: "Mit árul el a KI a lehetséges hatásokról? És mit jelent a nem-elvetés?",
          explain: R`A KI-ben a nagy csökkenés (akár 18 Hgmm) és a nulla körüli hatás is benne van – a kis minta miatt nem tudjuk eldönteni. A „hatástalan” a nem-elvetést bizonyításnak veszi. Az $1 - p$ nem a hatás valószínűsége. A „majdnem szignifikáns” a döntési szabály és a folytonos bizonyíték keveréke – 5%-on ez nem szignifikáns.`
        },
        {
          type: "match",
          q: R`Mit közölj? Párosítsd az elemet azzal a kérdéssel, amelyre felel!`,
          pairs: [
            ["hatásnagyság (különbség, Cohen-féle d)", "mennyit?"],
            ["konfidencia-intervallum", "mennyire biztosan?"],
            ["p-érték", "lehet-e csak véletlen?"],
            ["a szakmai (orvosi, üzleti) szempont", "mekkora különbség számít a gyakorlatban?"]
          ],
          hint: "A szakasz hüvelykujjszabálya: hatásnagyság + KI + p, ebben a fontossági sorrendben.",
          explain: R`A hatásnagyság a „mennyit?”, a KI a „mennyire biztosan?”, a p-érték a „lehet-e csak véletlen?” kérdésre felel. Azt pedig, hogy egy különbség gyakorlatilag fontos-e, nem a statisztika, hanem a szakmai kérdés dönti el. A p-érték önmagában egyikre sem válaszol a négy közül, csak a harmadikra.`
        },
        {
          type: "multi",
          q: R`Melyik állítás helyes? (Több jó válasz is lehet.)`,
          options: [
            R`Ugyanaz a $p$ jöhet nagy hatásból kis mintán és apró hatásból nagy mintán.`,
            R`A Cohen-féle $d$ nem függ a mintanagyságtól.`,
            "Nagyon szignifikáns eredmény (kis p) nagy hatást jelent.",
            "A szignifikancia csillagai (*, **, ***) a hatás fontosságát mérik.",
            R`$p = 0{,}06$ „majdnem szignifikáns”, ezért közel annyit ér, mint egy szignifikáns eredmény, és úgy is közölhető.`
          ],
          answer: [0, 1],
          hint: "Mitől függ a p-érték? Két dologtól is – és ezek közül csak az egyik a hatás.",
          explain: R`Az első kettő igaz: a $p$ a hatásnagyságtól és a mintanagyságtól is függ, a $d$ csak a hatástól. A „kis p = nagy hatás” és a csillagok mint fontosság a szakasz tipikus hibái – a kis p óriási mintából is jöhet, a csillag csak a $p$ nagyságát jelzi. A „majdnem szignifikáns” a döntési szabály és a folytonos bizonyíték keveréke: vagy előre rögzített szint szerint döntesz (akkor ez nem szignifikáns), vagy a $p$-t folytonosan értelmezed – de akkor sincs éles „majdnem”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy érmét 10 milliószor dobunk, a fejek aránya 50,1%. Mennyi a próbastatisztika ($H_0$: $p = 0{,}5$, $z = \frac{\hat p - 0{,}5}{\sqrt{0{,}25/n}}$)?`,
          options: [R`$\approx 6{,}3$`, R`$\approx 12{,}6$`, R`$\approx 40\,000$`, R`$\approx 2{,}0$`],
          answer: 0,
          hint: R`$\sqrt{0{,}25/10^7} = 0{,}5/\sqrt{10^7}$, és $\sqrt{10^7} \approx 3162$.`,
          explain: R`$\sqrt{0{,}25/10^7} \approx 0{,}000158$, így $z = 0{,}001/0{,}000158 \approx 6{,}3$ – rendkívül szignifikáns, pedig a 0,1 százalékpontos eltérés a legtöbb célra jelentéktelen. A 12,6 a $\sqrt{0{,}25} = 0{,}5$ helyett 0,25-tel oszt. A 40&nbsp;000 elfelejti a gyököt. A 2,0 a $10^6$-os mintára jönne ki – a $\sqrt n$-törvény szerint 10-szer több dobás $\sqrt{10} \approx 3{,}16$-szor nagyobb $z$-t ad.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gyógyszer átlagosan 0,5 Hgmm-rel csökkenti a vérnyomást, 95%-os KI $[0{,}3;\ 0{,}7]$, $p \lt 0{,}001$ ($n = 50\,000$). A klinikailag releváns csökkenés 5–10 Hgmm. Mi a helyes értékelés?`,
          options: [
            "Statisztikailag szignifikáns, gyakorlatilag nem: még a KI felső határa is messze a releváns hatás alatt van.",
            R`Engedélyezni kell: $p \lt 0{,}001$ nagyon erős hatást jelent.`,
            "Nem szignifikáns, mert a KI csak kis számokat tartalmaz.",
            "A hatás nem létezik, mert kisebb a releváns értéknél."
          ],
          answer: 0,
          hint: "Két külön kérdés: létezik-e a hatás (statisztika), és számít-e (szakma)? Mit mond a KI mindkettőről?",
          explain: R`A 0 nincs a KI-ben, tehát a hatás szinte biztosan létezik (szignifikáns). De a KI felső határa, 0,7 Hgmm is messze az 5–10 Hgmm alatt van: klinikailag jelentéktelen. A kis $p$ a hatalmas mintából jön, nem a nagy hatásból. A „nem szignifikáns” összekeveri a KI helyét a szélességével; a „nem létezik” pedig a gyakorlati jelentéktelenséget a statisztikai nem-létezéssel.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms7-final": {
      title: "Fejezetzáró teszt – 7. A hipotézisvizsgálat logikája",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`10 csészés teás kísérlet (5 T + 5 tea, $\binom{10}5 = 252$ választás). A hölgy 4 T-csészét talál el az 5-ből. Mennyi a p-érték?`,
          options: [R`$26/252 \approx 0{,}103$`, R`$25/252 \approx 0{,}099$`, R`$1/252 \approx 0{,}004$`, R`$5/252 \approx 0{,}020$`],
          answer: 0,
          hint: R`Legalább 4 találat kell: pontosan 4 vagy 5. A pontosan $k$ találat esetszáma $\binom5k\binom5{5-k}$.`,
          explain: R`Pontosan 4: $\binom54\binom51 = 25$ eset, pontosan 5: 1 eset, így $p = 26/252 \approx 0{,}103$ – 5%-on nem szignifikáns. A 25/252 csak a „pontosan 4”-et nézi, a „legalább 4” helyett. Az 1/252 a hibátlan eredmény p-értéke. Az 5/252 elfelejti, hogy a tévesen választott teás csészét is 5 közül választja ($\binom51$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kockáról azt gyanítod, hogy túl sok hatost dob ($p$ = a hatos valószínűsége). Melyik a helyes hipotézispár?`,
          options: [
            R`$H_0$: $p = 1/6$; $H_1$: $p \gt 1/6$`,
            R`$H_0$: $p \gt 1/6$; $H_1$: $p = 1/6$`,
            R`$H_0$: $\hat p = 1/6$; $H_1$: $\hat p \gt 1/6$`,
            R`$H_0$: $p = 1/6$; $H_1$: $p \lt 1/6$`
          ],
          answer: 0,
          hint: "Melyik állítással lehet számolni? Sokaságról vagy mintáról szól a hipotézis? És merre mutat a gyanú?",
          explain: R`$H_0$ az „unalmas”, számolható állítás ($p = 1/6$), $H_1$ a gyanú iránya ($p \gt 1/6$, jobboldali). A fordított pár hibás: a „$p \gt 1/6$” nem ad pontos modellt. A $\hat p$ a minta aránya – azt kiszámoljuk, arról nincs mit feltételezni. A $p \lt 1/6$ rossz irányba néz: a túl sok hatost nem venné észre.`
        },
        {
          type: "single", shuffle: true,
          q: R`Joghurtok: $\sigma = 4$, most $n = 16$, $\bar x = 198$, $\alpha = 3\%$, $H_0$: $\mu = 200$. Mi a döntés baloldali, illetve kétoldali próbával? ($z_{0{,}97} = 1{,}88$, $z_{0{,}985} = 2{,}17$)`,
          options: [
            "Baloldalival elvetjük, kétoldalival nem.",
            "Mindkettővel elvetjük.",
            "Egyikkel sem vetjük el.",
            "Kétoldalival elvetjük, baloldalival nem."
          ],
          answer: 0,
          hint: R`Számold ki $z$-t ($\sigma/\sqrt n = 1$). Egyoldalinál az egész $\alpha$ egy oldalon van, kétoldalinál $\alpha/2$ jut egy-egy oldalra.`,
          explain: R`$z = (198 - 200)/(4/\sqrt{16}) = -2$. Baloldali: $-2 \le -1{,}88$ → elvetjük. Kétoldali: $|{-2}| = 2 \lt 2{,}17$ → nem vetjük el. Az egyoldali próba a kijelölt irányban könnyebben vet el – ezért nem szabad az oldalt utólag, az eredmény láttán választani. Aki „mindkettővel elveti”, az a kétoldalinál is 1,88-cal számol ($\alpha$ helyett $\alpha/2$ kell); a fordított válasz a két kvantilist cseréli fel.`
        },
        {
          type: "single", shuffle: true,
          q: R`20 dobás, $H_1$: $p \gt 0{,}5$, $\alpha = 5\%$. $H_0$ mellett $P(X \ge 14) \approx 0{,}058$, $P(X \ge 15) \approx 0{,}021$, $P(X \ge 16) \approx 0{,}006$. Mi a kritikus tartomány?`,
          options: [R`$X \ge 15$`, R`$X \ge 14$`, R`$X \ge 16$`, R`$X \le 5$ vagy $X \ge 15$`],
          answer: 0,
          hint: R`A legbővebb jobboldali tartomány, amelynek valószínűsége $H_0$ mellett még nem lépi túl az 5%-ot.`,
          explain: R`$P(X \ge 15) \approx 0{,}021 \le 0{,}05$, de $P(X \ge 14) \approx 0{,}058 \gt 0{,}05$ – tehát $X \ge 15$ (tényleges szint 2,1%, a diszkrétség miatt az 5% alatt). Az $X \ge 14$ túllépi az $\alpha$-t. Az $X \ge 16$ is érvényes, de feleslegesen szigorú (kisebb az ereje). A kétoldali tartomány nem illik a jobboldali $H_1$-hez – és $2 \cdot 0{,}021 = 0{,}041$ valószínűségű volna.`
        },
        {
          type: "single", shuffle: true,
          q: R`20 dobásból 15 fej, $H_1$: $p \ne 0{,}5$. Mennyi a p-érték? ($P(X \ge 15 \mid H_0) \approx 0{,}0207$, $P(X = 15 \mid H_0) \approx 0{,}0148$)`,
          options: ["0,041", "0,021", "0,015", "0,959"],
          answer: 0,
          hint: R`Kétoldali próba: legalább ilyen messze a 10-től, bármelyik irányban. Használd a szimmetriát!`,
          explain: R`$P(X \ge 15) + P(X \le 5) = 2 \cdot 0{,}0207 \approx 0{,}041$ – 5%-on szignifikáns. A 0,021 az egyoldali érték (elmaradt a duplázás). A 0,015 a „pontosan 15 fej” valószínűsége, nem a „legalább ilyen szélsőségesé”. A 0,959 $= 1 - p$, ami semminek sem a valószínűsége, amit itt kérdezünk.`
        },
        {
          type: "single", shuffle: true,
          q: R`1000 kutatás, ebből 200-ban van valódi hatás. Mindegyik 5%-on tesztel, a próbaerő 80%. A szignifikáns eredmények hány százaléka téves riasztás?`,
          options: ["20%", "5%", "25%", "4%"],
          answer: 0,
          hint: "Készíts táblázatot: hány szignifikáns jön a valódi hatásokból, és hány a 800 „üres” kutatásból?",
          explain: R`Valódi hatás: $200 \cdot 0{,}8 = 160$ szignifikáns; nincs hatás: $800 \cdot 0{,}05 = 40$ szignifikáns. Téves: $40/(160 + 40) = 20\%$. Az 5% a $P(\text{szignifikáns} \mid H_0)$ – ez nem azonos a $P(H_0 \mid \text{szignifikáns})$-sal (Bayes!). A 25% $= 40/160$ rossz nevezővel számol, a 4% $= 40/1000$ az összes kutatással.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyoldali $z$-próba, $\alpha = 5\%$, várt hatás $d = 0{,}5$. Mekkora minta kell 80%-os erőhöz? ($z_{0{,}95} = 1{,}645$, $z_{0{,}975} = 1{,}96$, $z_{0{,}8} = 0{,}842$)`,
          options: ["25", "32", "11", "5"],
          answer: 0,
          hint: R`$n = \left(\frac{z_{1-\alpha} + z_{1-\beta}}{d}\right)^2$, felfelé kerekítve. Egyoldali próbánál melyik kvantilis kell?`,
          explain: R`$n = \left(\frac{1{,}645 + 0{,}842}{0{,}5}\right)^2 \approx 24{,}7 \to 25$ (ellenőrzés: 25 fővel az erő $\approx 0{,}80$, ahogy a 7.4 is írja). A 32 a kétoldali 1,96-tal számol – egyoldali próbánál az egész $\alpha$ egy oldalon van. A 11 kihagyja a $z_{1-\beta}$-t (az csak 50%-os erőt adna). Az 5 elfelejtette a négyzetre emelést ($4{,}97$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy szűrővizsgálat $H_0$-ja: „egészséges”. A teszt egy valójában beteg embert egészségesnek mond. Melyik hiba ez, és melyik valószínűség tartozik hozzá?`,
          options: [R`másodfajú hiba, $\beta$`, R`elsőfajú hiba, $\alpha$`, R`másodfajú hiba, $1 - \beta$`, R`elsőfajú hiba, $1 - \alpha$`],
          answer: 0,
          hint: R`Igaz vagy hamis itt $H_0$? És elvetjük, vagy nem?`,
          explain: R`$H_0$ hamis (az illető beteg), és nem vetjük el: ez másodfajú hiba (fals negatív), valószínűsége $\beta$. Az elsőfajú hiba az igaz $H_0$ elvetése (egészséges embert betegnek mondani), $\alpha$. Az $1 - \beta$ a próbaerő – a beteg helyes kiszűrésének esélye, nem a hibáé; az $1 - \alpha$ az igaz $H_0$ helyes megtartása.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy átlagos változás <b>90%-os</b> KI-je $[0{,}4;\ 3{,}0]$. Mit mondhatunk az 5%-os kétoldali próbáról ($H_0$: $\mu = 0$)?`,
          options: [
            "Semmi biztosat: a 95%-os KI tágabb, tartalmazhatja a 0-t.",
            "5%-on is biztosan elveti, mert a 0 nincs a KI-ben.",
            "5%-on biztosan nem veti el, mert a 90% kevesebb 95%-nál.",
            R`5%-on is elveti, mert $p \le 0{,}10 \lt 0{,}05$.`
          ],
          answer: 0,
          hint: R`A 90%-os KI a 10%-os próbához tartozik. Melyik KI kell az 5%-os próbához, és az szűkebb vagy tágabb?`,
          explain: R`A 90%-os KI-ből annyi biztos, hogy a 10%-os kétoldali próba elveti a 0-t ($p \le 0{,}10$). Az 5%-os próbához a 95%-os KI kell, ami <em>tágabb</em> – kinyúlhat a 0-ig, de nem feltétlenül. Ezért egyik irányban sem dönthetünk biztosan. A „$p \le 0{,}10 \lt 0{,}05$” egyenlőtlenség hamis: $0{,}10 \gt 0{,}05$, így $p \le 0{,}10$-ből nem következik $p \le 0{,}05$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két csoport: 1, 2, 6 és 4, 5, 9. A második csoport átlaga 3-mal nagyobb. Permutációs próbával mennyi az egyoldali p-érték? (A hat szám összege 27, a második csoporté 18.)`,
          options: ["0,15", "0,10", "0,05", "0,30"],
          answer: 0,
          hint: R`Elég megszámolni azokat a 3-as csoportokat (a 20-ból), amelyek összege legalább 18 – ezek adnak legalább 3-as különbséget.`,
          explain: R`Összeg $\ge 18$: $\{4, 5, 9\} = 18$, $\{6, 4, 9\} = 19$, $\{6, 5, 9\} = 20$ – 3 felosztás, $p = 3/20 = 0{,}15$; nem szignifikáns. A 0,10 a megfigyelt felosztást nem számolja bele (csak a szigorúan nagyobbakat) – a p-érték a „legalább ilyen szélsőséges”. A 0,05 csak a megfigyeltet számolja. A 0,30 a kétoldali érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató 12 kimeneti változót mért, és egyetlen szignifikáns eredményét közli: $p = 0{,}04$. Mi a Bonferroni-küszöb (5%-os családonkénti szint), és mi a döntés?`,
          options: [
            R`$\approx 0{,}0042$ – nem szignifikáns`,
            R`$\approx 0{,}0042$ – szignifikáns`,
            R`$0{,}6$ – szignifikáns`,
            R`$0{,}05$ – szignifikáns`
          ],
          answer: 0,
          hint: R`$\alpha/m$, és hasonlítsd össze vele a $p$-t.`,
          explain: R`$0{,}05/12 \approx 0{,}0042$, és $0{,}04 \gt 0{,}0042$ → korrekció után nem szignifikáns. Korrekció nélkül 12 próbánál $1 - 0{,}95^{12} \approx 46\%$ az esélye legalább egy téves riasztásnak – az egyetlen „találat” erősen gyanús. A 0,6 $= \alpha \cdot m$ (szorzás osztás helyett); a 0,05 elhagyja a korrekciót.`
        },
        {
          type: "multi",
          q: R`Két kísérlet ugyanazon a skálán ($\sigma = 15$). Az „A” vizsgálatban csoportonként 40 fő, a két átlag különbsége 6 pont, $p \approx 0{,}07$. A „B” vizsgálatban csoportonként 200&nbsp;000 fő, a különbség 0,3 pont, $p \lt 0{,}001$. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "A „B” vizsgálat hatásnagysága sokkal kisebb, mint az „A”-é.",
            "Az „A” vizsgálat nem bizonyítja, hogy nincs hatás; nagyobb minta kellene.",
            "A „B” kisebb p-értéke azt jelenti, hogy a „B” hatása nagyobb.",
            "Az „A” kezelés hatástalan, a „B” hatásos és fontos.",
            "A „B”-nél legalább 99,9% az esélye, hogy a hatás valódi."
          ],
          answer: [0, 1],
          hint: R`Számold ki mindkét $d$-t. Mitől lett B p-értéke ilyen kicsi?`,
          explain: R`$d_A = 6/15 = 0{,}4$, $d_B = 0{,}3/15 = 0{,}02$ – a „B” hatása hússzor kisebb; a kis $p$ az óriási mintából jön. Az „A”-nál a nem-szignifikáns eredmény nem jelent „nincs hatást”: kis mintán egy közepes hatás is rejtve maradhat. „Kis p = nagy hatás”, „szignifikáns = fontos” és „$1 - p$ = a hatás valószínűsége” – mindhárom a fejezet tipikus hibája.`
        },
        {
          type: "single", shuffle: true,
          q: R`A/B-teszt: A-ból 20/200 (10%), B-ből 34/200 (17%) vásárol; $z \approx 2{,}05$, $p \approx 0{,}04$, a különbség 95%-os KI-je kb. $[0{,}3;\ 13{,}7]$ százalékpont. Melyik a helyes jelentés?`,
          options: [
            "A B vásárlási aránya 7 százalékponttal nagyobb (KI: 0,3–13,7; p = 0,04): a hatás valószínűleg valódi, de a nagysága bizonytalan.",
            "96% az esélye, hogy a B oldal jobb.",
            "A B oldal pontosan 7 százalékponttal növeli a vásárlást, ez bizonyított.",
            "Nem szignifikáns, mert a KI alsó határa majdnem 0."
          ],
          answer: 0,
          hint: "Hatásnagyság + KI + p-érték – és mit árul el a KI szélessége?",
          explain: R`A jó jelentés a hatásnagyságot, a KI-t és a $p$-t is közli, és óvatosan értelmez: a 0 épp kívül esik a KI-n (szignifikáns), de a valódi javulás lehet szinte nulla és 14 százalékpont is. A „96%” az $1 - p$ = hatás valószínűsége hiba. A „pontosan 7, bizonyított” a pontbecslést kezeli biztos értékként. A KI alsó határának közelsége a 0-hoz nem teszi nem-szignifikánssá – a kettősség szerint az számít, hogy a 0 benne van-e.`
        },
        {
          type: "single", shuffle: true,
          q: R`12 csészés teás kísérlet (6 T + 6 tea, 924 választás). A hölgy 5 T-csészét talál el a 6-ból. Mennyi a p-érték, és szignifikáns-e 5%-on?`,
          options: [
            R`$37/924 \approx 0{,}040$ – szignifikáns`,
            R`$36/924 \approx 0{,}039$ – szignifikáns`,
            R`$1/924 \approx 0{,}001$ – szignifikáns`,
            R`$37/924 \approx 0{,}040$ – nem szignifikáns, mert egy csészét eltévesztett`
          ],
          answer: 0,
          hint: R`Legalább 5 találat: pontosan 5 ($\binom65\binom61$ eset) vagy 6 (1 eset).`,
          explain: R`$\binom65\binom61 = 36$, plusz a hibátlan 1 eset: $p = 37/924 \approx 0{,}040 \le 0{,}05$ → szignifikáns. A nagyobb kísérlet egy tévedést is „elbír” – a 8 csészésnél a 3/4 már nem volt szignifikáns ($17/70 \approx 0{,}24$). A 36/924 csak a „pontosan 5”-öt számolja, az 1/924 a hibátlan eredményé. Az utolsó opció a számot jól adja, de a döntés a $p \le \alpha$ szabályon múlik, nem azon, hogy volt-e tévedés.`
        }
      ]
    },
