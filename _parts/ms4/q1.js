    /* ------------------------------------------------ 4.1 */
    "ms4-41": {
      title: "Kvíz – 4.1 Statisztikai sorok és a viszonyítás",
      questions: [
        {
          type: "match",
          q: "Milyen statisztikai sor? Párosítsd!",
          pairs: [
            ["egy lakás jellemzői: 62 m², 3 szoba, 1985-ös építés, 48 millió Ft", "leíró sor"],
            ["egy könyvtár kölcsönzései műfajonként (regény, ismeretterjesztő, gyerekkönyv)", "minőségi sor"],
            ["egy áruházlánc forgalma megyénként", "területi sor"],
            ["egy raktár készlete minden hónap utolsó napján", "állapotidősor"],
            ["egy pékség havonta eladott kenyérmennyisége egy éven át", "tartamidősor"],
            ["a háztartások száma a havi jövedelem osztályközei szerint", "mennyiségi sor"]
          ],
          hint: "Kérdezd meg: egyetlen egység sokféle jellemzője? Ha nem, milyen ismérv szerint bontjuk a sokaságot – minőségi, területi, időbeli vagy mennyiségi? Időnél: időpont vagy időszak?",
          explain: R`A lakás adatai egy egység különböző jellemzői, más-más mértékegységben → <b>leíró sor</b>. A műfaj minőségi ismérv → <b>minőségi sor</b>; a megye földrajzi → <b>területi sor</b>. A hónap utolsó napi készlet <b>időpontra</b> vonatkozik → állapotidősor; a havi eladás <b>időszakra</b> → tartamidősor. A jövedelem-osztályközök mennyiségi ismérv → <b>mennyiségi sor</b> (gyakorisági sor). A tipikus csapda az állapot ↔ tartam: a „hónap végén” szó időpontot jelez.`
        },
        {
          type: "multi",
          q: "Melyik sor adatait van értelme összeadni? (Több jó válasz is lehet.)",
          options: [
            "Panni bankszámla-egyenlege négy egymást követő hónap végén",
            "Panni havi bevásárlásainak összege négy egymást követő hónapban",
            "három megye átlagos havi bére",
            "egy egyetem hallgatóinak száma karonként",
            "egy vállalat dolgozóinak száma bérkategóriák szerint"
          ],
          answer: [1, 3, 4],
          hint: "Két kérdés: időpontra vagy időszakra vonatkozik az adat? És felosztja-e a sor az egész sokaságot (csoportosító sor), vagy csak összeveti a tagokat (összehasonlító sor)?",
          explain: R`A havi költés tartamidősor: összege a négy hónap költése. A karonkénti hallgatószám és a bérkategóriánkénti létszám csoportosító sor: az összeg az egész egyetem, illetve a teljes létszám. A hónapvégi egyenleg <b>állapotadat</b>: négy egyenleg összege nem „pénz” (átlagolni a kronologikus átlaggal lehet). A megyei átlagbérek <b>összehasonlító sort</b> alkotnak: az összegük nem bér, és az egyszerű átlaguk sem az országos átlag.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy mozijegy ára 400 Ft-ról 520 Ft-ra nőtt. Melyik állítás helyes?",
          options: [
            "Az új ár a régi 130%-a, vagyis 30%-kal több.",
            "Az új ár 130%-kal több a réginél.",
            "Az új ár 23,1%-kal több a réginél, mert 120/520 ≈ 0,231.",
            "A régi ár 30%-kal kevesebb az újnál."
          ],
          answer: 0,
          hint: R`Számold ki a $V = A/B$ hányadost. Mi a tárgy, és mi az alap? Utána: „százaléka” = $V \cdot 100\%$, „százalékkal több” = $(V - 1) \cdot 100\%$.`,
          explain: R`$V = 520/400 = 1{,}3$: az új ár a régi <b>130%-a</b>, vagyis <b>30%-kal több</b> (+120 Ft). A „130%-kal több” összekeveri a „százaléka” és a „százalékkal” kifejezést – az 230%-a lenne. A 23,1% rossz alapot használ: a változást az <b>új</b> árhoz mérte. Visszafelé pedig nem ugyanaz a százalék: $400/520 \approx 0{,}769$, a régi ár csak 23,1%-kal kevesebb az újnál.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy termék árát 20%-kal megemelték. Hány százalékkal kell utána csökkenteni, hogy visszaálljon az eredeti árra?",
          options: ["16,7%-kal", "20,0%-kal", "25,0%-kal", "83,3%-kal"],
          answer: 0,
          hint: R`A csökkentés alapja már a megemelt ár. Milyen $x$-re igaz, hogy $1{,}2 \cdot x = 1$?`,
          explain: R`$1{,}2 \cdot x = 1$ → $x = 1/1{,}2 \approx 0{,}833$: az emelt ár 83,3%-ára kell csökkenteni, vagyis <b>16,7%-kal</b>. A 20% a „visszafelé ugyanaz a százalék” hiba: $1{,}2 \cdot 0{,}8 = 0{,}96$, 4%-kal az eredeti alatt maradnánk. A 25% a fordított irány (20%-os csökkentés után kellene 25%-kal emelni, $1/0{,}8 = 1{,}25$). A 83,3% a „százaléka” – nem azt kérdeztük, hány százalékára, hanem hány százalékkal.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy részvény árfolyama hétfőn 10%-kal nőtt, kedden 10%-kal csökkent. Hogyan változott a két nap alatt összesen?",
          options: ["1,0%-kal csökkent", "nem változott (0,0%)", "1,0%-kal nőtt", "99,0%-kal csökkent"],
          answer: 0,
          hint: "A keddi csökkenés alapja a hétfői, már megemelt árfolyam. A változások összeadódnak vagy szorzódnak?",
          explain: R`A változások <b>szorzódnak</b>: $1{,}1 \cdot 0{,}9 = 0{,}99$ – az árfolyam az eredeti 99%-a, vagyis <b>1%-kal csökkent</b>. A „nem változott” az összeadás hibája (+10% − 10% = 0): a 10%-os csökkenés a nagyobb, megemelt árból vesz el. Az 1%-os növekedés előjelhiba. A „99%-kal csökkent” a „99%-a” és a „99%-kal kevesebb” összekeverése.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy fesztiválra idén 15%-kal több látogató jött, mint tavaly: $69\,000$ fő. Hányan jöttek tavaly?`,
          options: ["60&nbsp;000", "58&nbsp;650", "79&nbsp;350", "81&nbsp;176"],
          answer: 0,
          hint: R`Írd fel $V = A/B$ alakban: mi a tárgy, mi az alap, és mennyi $V$? A keresett adat az alap: $B = A/V$.`,
          explain: R`$V = 1{,}15$, $A = 69\,000$, így $B = A/V = 69\,000 / 1{,}15 = 60\,000$ fő. Ellenőrzés: $60\,000 \cdot 1{,}15 = 69\,000$ ✔. Az $58\,650 = 69\,000 \cdot 0{,}85$ a tipikus hiba: a 15%-ot az idei (nagyobb) számból vonja le, pedig a 15% a tavalyira vonatkozik. A $79\,350 = 69\,000 \cdot 1{,}15$ és a $81\,176 \approx 69\,000 / 0{,}85$ rossz irányba számol: tavaly kevesebben voltak, nem többen.`
        },
        {
          type: "single", shuffle: true,
          q: "A munkanélküliségi ráta 8%-ról 6%-ra csökkent. Melyik megfogalmazás helyes?",
          options: [
            "2 százalékponttal, relatíve 25%-kal csökkent.",
            "2%-kal csökkent.",
            "2 százalékponttal, relatíve 33,3%-kal csökkent.",
            "25 százalékponttal, relatíve 2%-kal csökkent."
          ],
          answer: 0,
          hint: "Két százalék különbsége százalékpont. A relatív változáshoz osztani kell – de mi van a nevezőben?",
          explain: R`Különbség: $8 - 6 = 2$ <b>százalékpont</b>. Relatív változás: $6/8 = 0{,}75$ → <b>25%-kal</b> csökkent. A „2%-kal” a százalékok különbségét mondja százaléknak (az 7,84% lenne). A 33,3% rossz alaphoz mér ($8/6 \approx 1{,}333$): a csökkenést a kiinduló 8%-hoz kell viszonyítani. Az utolsó felcseréli a két fogalmat.`
        },
        {
          type: "multi",
          q: "Egy párt támogatottsága 10%-ról 15%-ra nőtt. Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "5 százalékponttal nőtt.",
            "50%-kal nőtt.",
            "5%-kal nőtt.",
            "150%-kal nőtt.",
            "A mostani támogatottság a korábbi 150%-a."
          ],
          answer: [0, 1, 4],
          hint: "Különbség → százalékpont; hányados → „százaléka”, illetve „százalékkal”. Számold ki mindkettőt!",
          explain: R`Különbség: $15 - 10 = 5$ <b>százalékpont</b>. Hányados: $15/10 = 1{,}5$ → a korábbi <b>150%-a</b>, vagyis <b>50%-kal</b> nőtt. Az „5%-kal” a százalékpontot mondja százaléknak (az 10,5% lenne). A „150%-kal nőtt” a „százaléka” ↔ „százalékkal” csere: az 250%-a, 25% lenne. Jó gyakorlat mindkét adatot megadni: „10%-ról 15%-ra, 5 százalékponttal nőtt”.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2 */
    "ms4-42": {
      title: "Kvíz – 4.2 Megoszlás, koordináció, intenzitás",
      questions: [
        {
          type: "match",
          q: "Milyen viszonyszám? Párosítsd!",
          pairs: [
            ["a háztartás kiadásainak hány százaléka megy élelmiszerre", "megoszlási"],
            ["100 fiúra jutó lányok száma egy osztályban", "koordinációs"],
            ["1000 lakosra jutó orvosok száma", "intenzitási, egyenes"],
            ["egy orvosra jutó lakosok száma", "intenzitási, fordított"],
            ["a készlet forgási napjainak száma", "intenzitási, fordított"],
            ["egy hektárra jutó búzatermés", "intenzitási, egyenes"]
          ],
          hint: "Rész az egészhez, rész egy másik részhez, vagy két különnemű adat? Intenzitásinál: a nagyobb érték a jobb vagy a rosszabb?",
          explain: R`Az élelmiszerre jutó rész a teljes kiadáshoz mérve <b>megoszlási</b> (rész / egész). A lányok a fiúkhoz: két rész egymáshoz → <b>koordinációs</b>. Orvos és lakos, búza és hektár, készlet és forgalom különnemű adatok → <b>intenzitási</b>. Több orvos 1000 lakosra és nagyobb termésátlag jobb → egyenes; több lakos egy orvosra és több forgási nap rosszabb → fordított. Az „1000 lakosra jutó orvos” és az „egy orvosra jutó lakos” ugyanaz a két adat, csak megcserélve.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cég exportbevétele 3 milliárd Ft, ez a teljes bevétel 60%-a. Mennyi a teljes bevétel?",
          options: ["5,0 milliárd Ft", "1,8 milliárd Ft", "4,8 milliárd Ft", "7,5 milliárd Ft"],
          answer: 0,
          hint: R`Megoszlási viszonyszám: $V_m = x_i / \sum x$. Melyik ismert, és melyiket keresed?`,
          explain: R`$\sum x = x_i / V_m = 3 / 0{,}6 = 5$ milliárd Ft. Ellenőrzés: $5 \cdot 0{,}6 = 3$ ✔. Az 1,8 ($3 \cdot 0{,}6$) a 3 milliárdnak veszi a 60%-át, pedig a 3 milliárd már maga a rész. A 4,8 ($3 \cdot 1{,}6$) „60%-kal többnek” olvassa. A 7,5 ($3 / 0{,}4$) a hazai rész (40%) arányával osztott.`
        },
        {
          type: "single", shuffle: true,
          q: R`Panni tavaly a havi $20\,000$ Ft-jából $6000$ Ft-ot, idén a $25\,000$ Ft-jából $9200$ Ft-ot költött tejre. Hogyan változott a tejre jutó <b>rész</b>?`,
          options: [
            "6,8 százalékponttal nőtt (relatíve 22,7%-kal).",
            "6,8%-kal nőtt.",
            "22,7 százalékponttal nőtt.",
            "53,3%-kal nőtt."
          ],
          answer: 0,
          hint: "Először számold ki mindkét év megoszlási viszonyszámát. Két százalék különbsége milyen mértékegységű?",
          explain: R`Tavaly $6000 / 20\,000 = 30\%$, idén $9200 / 25\,000 = 36{,}8\%$. A rész $36{,}8 - 30 = 6{,}8$ <b>százalékponttal</b> nőtt; relatíve $36{,}8 / 30 \approx 1{,}227$ → 22,7%-kal. A „6,8%-kal” a százalékpontot mondja százaléknak, a „22,7 százalékpont” fordítva. Az 53,3% ($9200 / 6000$) a tejre költött <b>összeg</b> változása, nem a részé: közben az egész is nőtt.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bolt éves forgalma 600 millió Ft, 20 dolgozója van, ebből 75% eladó. Mennyi az egy eladóra jutó (tisztított) forgalom?",
          options: ["40 millió Ft/fő", "30 millió Ft/fő", "22,5 millió Ft/fő", "120 millió Ft/fő"],
          answer: 0,
          hint: "A tisztított viszonyszám nevezőjében csak az a rész van, amely tényleg összefügg a számlálóval. Ha csak az arányát ismered: tisztított = nyers / arány.",
          explain: R`Nyers: $600 / 20 = 30$ millió Ft/fő. Tisztított: $30 / 0{,}75 = 40$ millió Ft/fő – ugyanez közvetlenül: $600 / 15$ eladó $= 40$. A 30 a nyers érték (minden dolgozóval osztva). A 22,5 ($30 \cdot 0{,}75$) szoroz osztás helyett – a tisztított érték mindig nagyobb a nyersnél, mert kisebb a nevező. A 120 ($600 / 5$) a nem eladó dolgozókkal osztott.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az intenzitási viszonyszámra? (Több jó válasz is lehet.)",
          options: [
            "Az egy orvosra jutó lakosok száma fordított intenzitási viszonyszám.",
            "A tisztított viszonyszám nevezőjében csak az alapnak az a része áll, amely összefügg a számlálóval.",
            "Intenzitási viszonyszám csak azonos mértékegységű adatokból számolható.",
            "Két város közül a kisebb nyers halálozási arányszámú biztosan az egészségesebb.",
            "A 15–49 éves nők számához viszonyított születésszám tisztított arányszám."
          ],
          answer: [0, 1, 4],
          hint: "Gondolj a definícióra (különnemű adatok), az egyenes / fordított és a nyers / tisztított párra, és a szakasz buktató-dobozára.",
          explain: R`Az egy orvosra jutó lakos: minél kisebb, annál jobb → <b>fordított</b>. A tisztított mutató nevezője csak az összefüggő rész (bolti eladók, szülőképes korú nők) – ezért a 15–49 éves nőkre vetített születésszám tisztított. Az intenzitási viszonyszám éppen <b>különnemű</b> adatokat oszt el (fő/üzlet, Ft/fő). A nyers halálozási arányszám a korszerkezettől is függ: egy „öreg” város nyers mutatója akkor is magasabb lehet, ha egészségesebb (lásd 4.6).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy iskolában a 10 fős csoport átlaga 80 pont, a 30 fős csoporté 60 pont. Mennyi a két csoport együttes átlaga?",
          options: ["65 pont", "70 pont", "75 pont", "64 pont"],
          answer: 0,
          hint: "Az átlag „pont / fő” – melyik adat a súly? Számtani vagy harmonikus átlag kell?",
          explain: R`A nevező (a létszám) a súly → súlyozott számtani átlag: $\dfrac{10 \cdot 80 + 30 \cdot 60}{40} = \dfrac{2600}{40} = 65$ pont. A 70 az egyszerű átlag – a kis csoportot túlsúlyozza. A 75 felcseréli a súlyokat ($\tfrac{30 \cdot 80 + 10 \cdot 60}{40}$). A 64 harmonikus átlag létszámsúllyal ($40 / (10/80 + 30/60)$) – az akkor kellene, ha a súly a számláló (az összpontszám) lenne. Ellenőrzés: összesen $800 + 1800 = 2600$ pont jut 40 diákra.`
        },
        {
          type: "single", shuffle: true,
          q: "Panni két piacon vesz almát: az egyiken 2000 Ft-ot költ 400 Ft/kg-os, a másikon 6000 Ft-ot 600 Ft/kg-os áron. Mennyi az átlagár?",
          options: ["533,3 Ft/kg", "550,0 Ft/kg", "500,0 Ft/kg", "480,0 Ft/kg"],
          answer: 0,
          hint: "Az ár „Ft / kg”. Az ismert súly (a kifizetett összeg) a számláló vagy a nevező? Ebből tudod, melyik átlag kell.",
          explain: R`A súly a kifizetett összeg, vagyis a <b>számláló</b> → súlyozott harmonikus átlag: $\dfrac{8000}{2000/400 + 6000/600} = \dfrac{8000}{5 + 10} \approx 533{,}3$ Ft/kg. Ellenőrzés: 8000 Ft-ért 15 kg almát kapott. Az 550 forintösszeggel súlyozott <b>számtani</b> átlag ($\tfrac{2000 \cdot 400 + 6000 \cdot 600}{8000}$) – rossz súlyozás. Az 500 az egyszerű átlag, a 480 a súlyozatlan harmonikus átlag ($2 / (1/400 + 1/600)$).`
        },
        {
          type: "multi",
          q: R`Egy cég több boltjának egy főre jutó forgalma $v_i = A_i / B_i$ (részviszonyszámok). Melyik igaz a cég egészére vonatkozó $V = \sum A_i / \sum B_i$ összetett viszonyszámra? (Több jó válasz is lehet.)`,
          options: [
            "Mindig a legkisebb és a legnagyobb részviszonyszám között van.",
            "A boltok súlyától (a dolgozók megoszlásától) is függ.",
            "Egyenlő a részviszonyszámok egyszerű átlagával.",
            "Ha minden boltban nő az egy főre jutó forgalom, a cégé is biztosan nő.",
            "Számtani átlagként a dolgozók száma (a nevező) a súly."
          ],
          answer: [0, 1, 4],
          hint: R`Írd fel $V$-t súlyozott átlagként: $V = \sum B_i v_i / \sum B_i$. Mi következik ebből?`,
          explain: R`$V = \sum B_i v_i / \sum B_i$ a részviszonyszámok <b>súlyozott</b> számtani átlaga a nevezővel ($B_i$, a dolgozók számával) súlyozva – ezért a legkisebb és a legnagyobb $v_i$ közé esik, és a súlyok arányától is függ. Egyszerű átlaggal csak egyforma súlyoknál egyezik. Mivel a súlyoktól is függ, a súlyok eltolódása lehúzhatja $V$-t akkor is, ha minden $v_i$ nő – ez az összetételhatás (4.6).`
        }
      ]
    },

    /* ------------------------------------------------ 4.3 */
    "ms4-43": {
      title: "Kvíz – 4.3 Dinamikus viszonyszámok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy bolt forgalma négy egymást követő évben (millió Ft): 50, 60, 54, 81. Mennyi a negyedik év láncviszonyszáma?",
          options: ["150,0%", "162,0%", "135,0%", "66,7%"],
          answer: 0,
          hint: R`Láncviszonyszám: $l_t = y_t / y_{t-1}$. Mi a negyedik év előtti, közvetlenül megelőző adat?`,
          explain: R`$l_4 = 81 / 54 = 1{,}5$ → <b>150%</b>: a forgalom 50%-kal nőtt az előző évhez képest. A 162% a bázisviszonyszám ($81/50$, első év = 100%). A 135% ($81/60$) egy évvel korábbi adatot vesz nevezőnek. A 66,7% ($54/81$) felcseréli a tárgy- és a bázisidőszakot.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kávézó forgalmának láncviszonyszámai három egymást követő évben: 120%, 90%, 110%. Mennyi a harmadik év bázisviszonyszáma (a kiinduló év = 100%)?",
          options: ["118,8%", "120,0%", "110,0%", "106,7%"],
          answer: 0,
          hint: "Minden évben az előző év értékét szorozzuk meg valamivel. Mit kell tehát a láncviszonyszámokkal csinálni?",
          explain: R`A láncviszonyszámokat <b>össze kell szorozni</b>: $b = 1{,}2 \cdot 0{,}9 \cdot 1{,}1 = 1{,}188$ → <b>118,8%</b>. A 120% a százalékok összeadása ($+20 - 10 + 10$) – a változások szorzódnak, nem adódnak. A 110% csak az utolsó láncviszonyszám (az az előző évhez mér, nem a kiindulóhoz). A 106,7% a láncviszonyszámok számtani átlaga, ami se nem bázisviszonyszám, se nem átlagos ütem.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bázissor (2020 = 100%): 2021: 125%, 2022: 160%, 2023: 140%. Mennyi a 2023-as érték, ha a bázist 2022-re váltjuk (2022 = 100%)?",
          options: ["87,5%", "80,0%", "112,0%", "114,3%"],
          answer: 0,
          hint: R`Bázisváltás: $b'_t = b_t / b_k$. Kezeld a bázisviszonyszámokat úgy, mintha az eredeti adatok lennének.`,
          explain: R`$b'_{2023} = 140 / 160 = 0{,}875$ → <b>87,5%</b>: 2023-ban 12,5%-kal kisebb volt az érték, mint 2022-ben. A 80% a kivonásos bázisváltás ($140 - 160 + 100$) – a különbség százalékpont, nem viszonyszám. A 112% ($140/125$) rossz évet (2021-et) vett bázisnak. A 114,3% ($160/140$) fordítva osztott.`
        },
        {
          type: "multi",
          q: "Egy idősor bázisviszonyszámai (2020 = 100%): 2021: 120%, 2022: 108%, 2023: 135%. Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "2022-ben az érték 10%-kal kisebb volt, mint 2021-ben.",
            "2023-ban az érték 25%-kal nagyobb volt, mint 2022-ben.",
            "2023-ban az érték 27%-kal nagyobb volt, mint 2022-ben.",
            "2022-ben az érték 8%-kal nagyobb volt, mint 2020-ban.",
            "2022-ben az érték 12%-kal kisebb volt, mint 2021-ben."
          ],
          answer: [0, 1, 3],
          hint: R`A bázisévhez a bázisviszonyszám közvetlenül mér. Két másik év összevetéséhez: $l_t = b_t / b_{t-1}$ – kivonni vagy osztani kell?`,
          explain: R`A 2020-hoz mért változás közvetlenül leolvasható: 108% → 8%-kal több. Két szomszédos év között a láncviszonyszám kell: $108/120 = 0{,}9$ → 10%-kal kevesebb; $135/108 = 1{,}25$ → 25%-kal több. A 27% és a 12% a bázisviszonyszámok <b>különbsége</b> – ez százalékpont a bázisévhez mérve, nem a két év közti változás.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy webshop havi rendelésszáma 2020-ban 625, 2024-ben 1296 volt. Mennyi az átlagos évi növekedési ütem?",
          options: ["20,0%", "26,8%", "15,7%", "21,5%"],
          answer: 0,
          hint: R`Hány változás van 2020 és 2024 között? Az átlagos ütem a láncviszonyszámok mértani átlaga: $\bar l = \sqrt[n-1]{y_n / y_1}$.`,
          explain: R`$1296 / 625 = 2{,}0736$, és 5 év adata 4 változás: $\bar l = \sqrt[4]{2{,}0736} = 1{,}2$ → évi <b>20%</b> (ellenőrzés: $1{,}2^4 = 2{,}0736$). A 26,8% a teljes 107,36%-os növekedés negyede – a számtani átlag felfelé torzít ($1{,}268^4 \approx 2{,}59$ lenne). A 15,7% rossz gyökkitevő: ötödik gyök ($n$ helyett $n - 1$ kellene). A 21,5% a két hibát egyszerre követi el ($107{,}36 / 5$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy részvény árfolyama az első évben 50%-kal nőtt, a másodikban 50%-kal csökkent. Mennyi az átlagos évi változás?",
          options: ["−13,4%", "0,0%", "−25,0%", "−12,5%"],
          answer: 0,
          hint: "Először számold ki a két év együttes változását (szorzással!), aztán keress olyan állandó évi ütemet, amely két év alatt ugyanezt adja.",
          explain: R`Együtt: $1{,}5 \cdot 0{,}5 = 0{,}75$ – az árfolyam 25%-kal csökkent. Átlagos ütem: $\sqrt{0{,}75} \approx 0{,}866$ → évente átlagosan <b>13,4%-kal csökkent</b> (ellenőrzés: $0{,}866^2 \approx 0{,}75$). A 0% a százalékok számtani átlaga ($+50 - 50$) – a „+x% majd −x% = 0” hiba. A −25% a teljes két év változása, nem az évi átlag. A −12,5% a teljes változás fele: számtani átlag mértani helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy ország GDP-je egy év alatt 4%-kal nőtt, a lakossága 2%-kal csökkent. Hány százalékkal nőtt az egy főre jutó GDP?",
          options: ["6,1%-kal", "6,0%-kal", "2,0%-kal", "1,9%-kal"],
          answer: 0,
          hint: R`Az egy főre jutó GDP intenzitási viszonyszám: $V_i = A/B$. Hogyan kapod a dinamikáját a számláló és a nevező dinamikájából?`,
          explain: R`$\dfrac{V_{i1}}{V_{i0}} = \dfrac{A_1/A_0}{B_1/B_0} = \dfrac{1{,}04}{0{,}98} \approx 1{,}0612$ → <b>6,1%-kal</b> nőtt. A 6% a százalékok kivonása ($4 - (-2)$) – csak közelítés. A 2% előjelhibás kivonás (a csökkenő lakosság nem rontja, hanem javítja az egy főre jutó értéket). Az 1,9% ($1{,}04 \cdot 0{,}98$) szoroz osztás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy síbolt forgalma idén decemberben 150, januárban 90 millió Ft volt; tavaly januárban 75 millió. Melyik összehasonlítás mutatja helyesen, milyen volt az idei január?",
          options: [
            "Az előző év januárjához: 90/75 = 120%, vagyis 20%-kal jobb.",
            "Az előző hónaphoz (decemberhez): 90/150 = 60%, vagyis 40%-os visszaesés.",
            "Az előző év januárjához: 75/90 ≈ 83,3%, vagyis 16,7%-os visszaesés.",
            "Az előző év januárjához: +15 millió Ft, vagyis 15%-kal több."
          ],
          answer: 0,
          hint: "Évszakosan ingadozó adat: mihez érdemes hasonlítani, hogy az évszak hatása kiessen? És mi a bázisidőszak?",
          explain: R`Évszakos adatnál a hónapot az <b>előző év azonos hónapjához</b> hasonlítjuk: $90/75 = 1{,}2$ → 20%-kal jobb. A decemberhez mért 40%-os „visszaesés” az évszak hatása (az ünnepi szezon után januárban mindig kisebb a forgalom), nem valódi változás. A 83,3% felcseréli a tárgy- és a bázisidőszakot. A 15 millió Ft az abszolút változás; százalékhoz a bázishoz (75) kell mérni: $15/75 = 20\%$.`
        }
      ]
    },
