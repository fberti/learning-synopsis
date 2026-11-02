/* =========================================================
   Matematikai statisztika 4. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 4.4 */
    "ms4-44": {
      title: "Kvíz – 4.4 Érték-, ár- és volumenindex",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy termék ára 10%-kal nőtt, az eladott mennyisége 20%-kal csökkent. Hogyan változott az értéke (a bevétel)?",
          options: ["12,0%-kal csökkent", "10,0%-kal csökkent", "27,3%-kal csökkent", "88,0%-kal csökkent"],
          answer: 0,
          hint: R`Az egyedi értékindex az egyedi ár- és mennyiségindexből adódik – összeadással vagy szorzással?`,
          explain: R`$i_v = i_p \cdot i_q = 1{,}1 \cdot 0{,}8 = 0{,}88$: az érték a korábbinak 88%-a, vagyis <b>12%-kal csökkent</b>. A 10% a százalékok összeadásából jön ($+10 - 20$) – az egyedi indexek szorzódnak, nem adódnak össze. A 27,3% az osztásból ($0{,}8 / 1{,}1 \approx 0{,}727$), a 88% pedig a „százaléka” és a „százalékkal” összekeverése.`
        },
        {
          type: "match",
          q: "Melyik hányados melyik index? Párosítsd!",
          pairs: [
            [R`$\sum q_0 p_1 \,/\, \sum q_0 p_0$`, "Laspeyres-féle árindex"],
            [R`$\sum q_1 p_1 \,/\, \sum q_1 p_0$`, "Paasche-féle árindex"],
            [R`$\sum q_1 p_0 \,/\, \sum q_0 p_0$`, "volumenindex bázisidőszaki árakon"],
            [R`$\sum q_1 p_1 \,/\, \sum q_0 p_1$`, "volumenindex tárgyidőszaki árakon"],
            [R`$\sum q_1 p_1 \,/\, \sum q_0 p_0$`, "értékindex"]
          ],
          hint: "Nézd meg, mi azonos a számlálóban és a nevezőben: ha a q, árindex; ha a p, volumenindex; ha semmi, értékindex.",
          explain: R`Árindexben a <b>kosár ($q$) rögzített</b>, csak az ár változik: $q_0$-lal Laspeyres ($I_p^{0}$), $q_1$-gyel Paasche ($I_p^{1}$). Volumenindexben az <b>ár ($p$) rögzített</b>: $p_0$-lal $I_q^{0}$, $p_1$-gyel $I_q^{1}$. Ha fent és lent is minden más, az az értékindex ($I_v$): benne van az ár és a mennyiség változása is.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pékség két terméke: kifli – tavaly 5 tálca 200 Ft-ért, idén 2 tálca 300 Ft-ért; kenyér – tavaly 30 db 100 Ft-ért, idén 40 db 100 Ft-ért. Mennyi a Paasche-féle árindex?`,
          options: ["104,5%", "112,5%", "125,0%", "115,0%"],
          answer: 0,
          hint: R`Paasche: az <em>idei</em> kosarat árazd be az idei és a tavalyi árakon, és oszd el a kettőt.`,
          explain: R`Idei kosár idei áron: $\sum q_1 p_1 = 2 \cdot 300 + 40 \cdot 100 = 4600$; tavalyi áron: $\sum q_1 p_0 = 2 \cdot 200 + 40 \cdot 100 = 4400$. $I_p^{1} = 4600/4400 \approx 1{,}045$ → <b>104,5%</b>.<br>
          A 112,5% a Laspeyres-index ($\sum q_0 p_1 / \sum q_0 p_0 = 4500/4000$) – a súlyok felcserélése. A 125% az egyedi árindexek ($1{,}5$ és $1$) egyszerű átlaga, ami a kevés kiflit ugyanúgy számítja, mint a sok kenyeret. A 115% az értékindex ($4600/4000$), benne a mennyiségek változása is. A Paasche itt jóval kisebb, mert a dráguló kifliből idén kevesebb fogyott (helyettesítés).`
        },
        {
          type: "single", shuffle: true,
          q: R`Panni kosarának értékindexe $I_v = 125\%$, a Laspeyres-féle árindexe $I_p^{0} = 110\%$. Mennyi a belőlük kiszámolható volumenindex, és melyik az?`,
          options: [
            R`$113{,}6\%$, és ez $I_q^{1}$ (tárgyidőszaki árakon)`,
            R`$113{,}6\%$, és ez $I_q^{0}$ (bázisidőszaki árakon)`,
            R`$115{,}0\%$, és ez $I_q^{1}$ (tárgyidőszaki árakon)`,
            R`$137{,}5\%$, és ez $I_q^{0}$ (bázisidőszaki árakon)`
          ],
          answer: 0,
          hint: "Az indexkörben ár- és volumenindex szorzata adja az értékindexet – de csak bizonyos párosításban.",
          explain: R`Indexkör: $I_v = I_p^{0} \cdot I_q^{1}$, tehát $I_q^{1} = 1{,}25 / 1{,}10 \approx 1{,}136$ → <b>113,6%</b>. A Laspeyres-árindex párja a <b>Paasche</b>-volumenindex (ellentétes súlyozás): $\dfrac{\sum q_0 p_1}{\sum q_0 p_0} \cdot \dfrac{\sum q_1 p_1}{\sum q_0 p_1} = \dfrac{\sum q_1 p_1}{\sum q_0 p_0}$. A 115% a kivonás ($125 - 110$), a 137,5% a szorzás ($1{,}25 \cdot 1{,}1$) hibája. Panni bázisárakon mért volumenindexe ($I_q^{0}$) amúgy 116%, de az a Paasche-árindexszel ($107{,}8\%$) alkot párt.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bolt forgalma (folyó áron) 8%-kal nőtt, miközben az árai átlagosan 20%-kal emelkedtek. Hogyan változott az eladások volumene?",
          options: ["10,0%-kal csökkent", "12,0%-kal csökkent", "11,1%-kal csökkent", "29,6%-kal nőtt"],
          answer: 0,
          hint: R`Deflálás: az értékindexből hogyan kapod meg a volumenindexet?`,
          explain: R`$I_q = I_v / I_p = 1{,}08 / 1{,}20 = 0{,}90$ → a volumen <b>10%-kal csökkent</b>. A 12% a kivonásból jön ($8 - 20$), ami csak közelítés – nagy árváltozásnál már érezhetően téved. A 11,1% a fordított osztás ($1{,}2 / 1{,}08$), a 29,6% pedig a szorzás ($1{,}08 \cdot 1{,}2$).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "A Laspeyres-féle árindex a bázisidőszaki kosarat árazza be a két időszak áraival.",
            R`$I_p^{0} \cdot I_q^{0} = I_v$, hiszen mindkettő bázisidőszaki súlyú.`,
            "A Fisher-féle árindex a Laspeyres- és a Paasche-féle árindex mértani átlaga.",
            "A Laspeyres-féle árindex mindig nagyobb a Paasche-félénél.",
            "Ha minden termék ára pontosan ugyanannyi százalékkal nő, a Laspeyres- és a Paasche-féle árindex egyenlő."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj az indexkörre (milyen párok szorzata az értékindex?) és a helyettesítésre.",
          explain: R`Az $I_p^{0} \cdot I_q^{0}$ <b>nem</b> az értékindex: Panninál $1{,}10 \cdot 1{,}16 = 1{,}276 \ne 1{,}25$ – csak az ellentétes súlyozású párok szorzata adja ki. A Laspeyres csak <b>tipikusan</b> nagyobb (helyettesítésnél); ha épp a drágulóból vesznek többet, fordítva is lehet. Ha minden ár $1{,}1$-szeresére nő, akkor bármely kosárra $\sum q \cdot 1{,}1 p_0 / \sum q p_0 = 1{,}1$, tehát a két index egyenlő. A Fisher-index $\sqrt{I_p^{0} \cdot I_p^{1}}$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy háztartás tavaly a pénze 50%-át élelmiszerre, 30%-át lakhatásra, 20%-át egyébre költötte. Idén az élelmiszer 6%-kal, a lakhatás 10%-kal drágult, az egyéb kiadások ára 5%-kal csökkent. Mennyi a háztartás Laspeyres-féle árindexe?",
          options: ["105,0%", "103,7%", "104,7%", "111,0%"],
          answer: 0,
          hint: R`Bázisidőszaki kiadási arányok ($v_0$) és egyedi árindexek: melyik átlagforma kell?`,
          explain: R`Bázisidőszaki értéksúlyokkal <b>számtani</b> átlag: $0{,}5 \cdot 1{,}06 + 0{,}3 \cdot 1{,}10 + 0{,}2 \cdot 0{,}95 = 0{,}53 + 0{,}33 + 0{,}19 = 1{,}05$ → <b>105,0%</b>. A 103,7% a súlyozatlan átlag ($(6 + 10 - 5)/3$), ami a kis tételt ugyanúgy számítja, mint a nagyot. A 104,7% a harmonikus átlag ugyanezekkel a súlyokkal – az a $v_1$ súlyokhoz illik, nem a $v_0$-hoz. A 111% a százalékok összeadása ($6 + 10 - 5$), súlyok nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Panni idei kiadásai: kenyér 6000, tej 9200, kávé 2600, alma 7200 Ft (összesen 25&nbsp;000 Ft); az egyedi árindexek: 1; 1; 1,3; 1,2. Mennyi ebből a Paasche-féle árindex?`,
          options: ["107,8%", "108,9%", "112,5%", "110,0%"],
          answer: 0,
          hint: R`Tárgyidőszaki értékek ($v_1$) és egyedi árindexek – számtani vagy harmonikus átlag kell?`,
          explain: R`$v_1$ súlyokkal <b>harmonikus</b> átlag: $\dfrac{25\,000}{6000/1 + 9200/1 + 2600/1{,}3 + 7200/1{,}2} = \dfrac{25\,000}{23\,200} \approx 1{,}078$ → <b>107,8%</b>. (A nevező épp $\sum q_1 p_0$, mert $v_1 / i_p = q_1 p_1 \cdot p_0 / p_1$.)<br>
          A 108,9% a számtani átlag $v_1$ súlyokkal ($27\,220 / 25\,000$) – rossz súly a formához; se nem Laspeyres, se nem Paasche (csak véletlenül esik közel a Fisher-indexhez). A 112,5% az egyedi indexek egyszerű átlaga, a 110% a Laspeyres-index, ami a <em>tavalyi</em> kiadási szerkezetből jönne.`
        }
      ]
    },

    /* ------------------------------------------------ 4.5 */
    "ms4-45": {
      title: "Kvíz – 4.5 Indexsorok, láncolás és reálérték",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Néhány adat a 8.6. táblából (sor: melyik év mennyisége, oszlop: melyik év árain, ezer Ft). Az 1992-es mennyiség 1992-es / 1996-os áron: 3100 / 5800. Az 1994-es mennyiség 1992-es / 1995-ös / 1996-os áron: 3170 / 4630 / 5840. A valódi érték (átló) 1996-ban: 6280. Mennyi az 1996-os árindex 1994-es súllyal, 1992 = 100% bázison?`,
          options: ["184,2%", "187,1%", "202,6%", "126,1%"],
          answer: 0,
          hint: "Árindexsorhoz a mennyiséget rögzíted – tehát egy sort használsz. Melyiket, és melyik két elemét?",
          explain: R`1994-es súly = az 1994-es <b>sor</b> (rögzített mennyiség, változó árak): $5840 / 3170 \approx 1{,}842$ → <b>184,2%</b>. A 187,1% az 1992-es sorból jön ($5800/3100$) – az is árindex, de más súllyal; a súlyválasztás számít. A 202,6% az átlóból ($6280/3100$): az értékindex, benne a mennyiség változása is. A 126,1% az 1996-os <b>lánc</b>index ($5840/4630$), nem a bázisindex.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy termékcsoport árindexei (előző év = 100%) három egymást követő évben: 110%, 90%, 120%. Mennyi az árszint a harmadik évben a kiinduló évhez képest?",
          options: ["118,8%", "120,0%", "121,4%", "106,7%"],
          answer: 0,
          hint: "Láncindexekből bázisindex: összeadás vagy szorzás?",
          explain: R`$1{,}10 \cdot 0{,}90 \cdot 1{,}20 = 1{,}188$ → <b>118,8%</b>. A 120% a százalékok összeadása ($+10 - 10 + 20$) – a $+10\%$ és a $-10\%$ nem oltja ki egymást ($1{,}1 \cdot 0{,}9 = 0{,}99$). A 106,7% a három láncindex számtani átlaga, a 121,4% pedig ennek köbe – egyik sem a láncindexek szorzata.`
        },
        {
          type: "single", shuffle: true,
          q: "A KSH szerint a fogyasztói árak 2022-ben 14,5%-kal, 2023-ban 17,6%-kal, 2024-ben 3,7%-kal nőttek. Hány százalékkal nőttek az árak 2021 és 2024 között összesen?",
          options: ["39,6%-kal", "35,8%-kal", "139,6%-kal", "13,2%-kal"],
          answer: 0,
          hint: R`Az éves indexek előző év = 100%-os láncindexek. Mit csinálsz velük, hogy 2021 = 100%-os bázisindexet kapj?`,
          explain: R`Láncolás: $1{,}145 \cdot 1{,}176 \cdot 1{,}037 \approx 1{,}396$ → az árszint 139,6%, vagyis <b>39,6%-kal</b> nőtt. A 35,8% az inflációs százalékok összeadása ($14{,}5 + 17{,}6 + 3{,}7$) – nagy inflációnál ez jelentősen alábecsül. A „139,6%-kal” a „százaléka” és a „százalékkal” összekeverése, a 13,2% pedig a 39,6% harmada – az se nem összes, se nem átlagos változás.`
        },
        {
          type: "single", shuffle: true,
          q: "Ugyanebből (2022: 14,5%, 2023: 17,6%, 2024: 3,7%; összesen 139,6%) mennyi volt az átlagos évi infláció 2022 és 2024 között?",
          options: ["11,8%", "11,9%", "13,2%", "18,2%"],
          answer: 0,
          hint: "Az átlagos változási ütem a láncindexek mértani átlaga. Hány láncindexed van?",
          explain: R`Három láncindex → harmadik gyök: $\sqrt[3]{1{,}396} \approx 1{,}118$ → évi átlagosan <b>11,8%</b>. A 11,9% a százalékok számtani átlaga ($35{,}8/3$) – kicsit felfelé torzít. A 13,2% a $39{,}6\%$ elosztása hárommal, a 18,2% pedig rossz gyökkitevő: négyzetgyök a köbgyök helyett ($\sqrt{1{,}396} \approx 1{,}182$).`
        },
        {
          type: "single", shuffle: true,
          q: "Panni bére 2022-ben 10%-kal nőtt, a fogyasztói árak 14,5%-kal. Hogyan változott a reálbére?",
          options: ["3,9%-kal csökkent", "4,5%-kal csökkent", "4,1%-kal csökkent", "26,0%-kal nőtt"],
          answer: 0,
          hint: "Reálindex = nominális index / árindex.",
          explain: R`$1{,}10 / 1{,}145 \approx 0{,}961$ → a reálbér <b>3,9%-kal csökkent</b>. A 4,5% a kivonás ($10 - 14{,}5$), ami csak közelítés. A 4,1% a fordított hányados ($1{,}145 / 1{,}10 \approx 1{,}041$): az azt mutatja, mennyivel drágult a kosár a bérhez képest, nem a reálbér változását. A 26% a szorzás – a deflálás osztás.`
        },
        {
          type: "single", shuffle: true,
          q: "2023-ban a magyar infláció 17,6% volt, 2024-ben 3,7%. Melyik állítás helyes?",
          options: [
            "Az árak 2024-ben is nőttek, átlagosan 3,7%-kal; az infláció 13,9 százalékponttal csökkent.",
            "Az árak 2024-ben átlagosan 13,9%-kal csökkentek.",
            "Az infláció 13,9%-kal csökkent.",
            "Az árak 2024-ben 13,9 százalékponttal csökkentek, tehát olcsóbb lett az élet."
          ],
          answer: 0,
          hint: "Az infláció az árak változásának üteme. Ha az ütem kisebb lesz, de pozitív marad, mi történik az árakkal?",
          explain: R`A 3,7% azt jelenti, hogy az árak 2024-ben is <b>nőttek</b>, csak lassabban – a 2023-as magas szintről még 3,7%-kal. Az infláció (egy százalékos adat) $17{,}6 - 3{,}7 = 13{,}9$ <b>százalékponttal</b> csökkent; relatíve $3{,}7/17{,}6 \approx 0{,}21$, vagyis 79%-kal – ezért hibás a „13,9%-kal”. „Csökkent az infláció” ≠ „csökkentek az árak”.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az indexsorokra és a láncolásra? (Több jó válasz is lehet.)",
          options: [
            "A láncolt index változó súlyú indexsor: minden láncszem a saját kosarával számol.",
            "A KSH fogyasztóiár-indexe Laspeyres-típusú láncszemekből áll, a súlyokat évente frissíti.",
            R`A láncolt bázisindex felírható egyetlen kosár árváltozásaként, $\sum q_s p_t / \sum q_s p_1$ alakban.`,
            "Állandó súlyú árindexsorban a láncindexek szorzata a bázisindex.",
            "Az értékindexsort is állandó súllyal kell számolni, különben nem láncolható."
          ],
          answer: [0, 1, 3],
          hint: "Mi az ára annak, hogy a láncolás naprakészen tartja a kosarat? És van-e súlya egyáltalán az értékindexnek?",
          explain: R`A láncolás évente frissíti a kosarat (változó súly), ezért a láncolt bázisindex már <b>nem</b> egyetlen kosár árváltozása – ez a láncolás ára. Állandó súlynál viszont a tagok úgy viselkednek, mint egy idősor bázisviszonyszámai: a láncindexek szorzata a bázisindex. Az értékindexsornak <b>nincs súlya</b> ($\sum q_t p_t / \sum q_b p_b$) – ha az árat vagy a mennyiséget rögzítenénk, már ár- vagy volumenindex lenne.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy ország GDP-je folyó áron 8%-kal nőtt, a GDP-deflátor (a GDP árindexe) 5%-kal. Mennyi volt a gazdasági növekedés (a GDP volumenének változása)?",
          options: ["2,9%", "3,0%", "13,4%", "8,0%"],
          answer: 0,
          hint: "A „növekedés” változatlan áron értendő. Hogyan kapod a folyó áras indexből?",
          explain: R`Deflálás: $1{,}08 / 1{,}05 \approx 1{,}029$ → <b>2,9%</b>. A 3,0% a kivonás ($8 - 5$) – kis számoknál jó közelítés, de nem pontos. A 13,4% a szorzás ($1{,}08 \cdot 1{,}05$). A 8,0% a nominális (folyó áras) növekedés – benne van az árak emelkedése is, ezért nem „növekedés”.`
        }
      ]
    },

    /* ------------------------------------------------ 4.6 */
    "ms4-46": {
      title: "Kvíz – 4.6 Standardizálás: részhatás és összetételhatás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy cégnél tavaly 6 mérnök 500 ezer és 4 technikus 300 ezer Ft-ot keresett; idén 4 mérnök 520 ezer és 16 technikus 310 ezer Ft-ot. ($V_0 = 420$, $V_1 = 352$ ezer Ft.) Mennyi a standard főátlag, $V_S$?`,
          options: ["340 ezer Ft", "436 ezer Ft", "400 ezer Ft", "352 ezer Ft"],
          answer: 0,
          hint: R`$V_S$: melyik év létszámai és melyik év csoportátlagai kellenek bele?`,
          explain: R`$V_S = \dfrac{\sum B_1 v_0}{\sum B_1} = \dfrac{4 \cdot 500 + 16 \cdot 300}{20} = \dfrac{6800}{20} = $ <b>340 ezer Ft</b>: az <b>idei</b> összetétel a <b>tavalyi</b> bérekkel. A 436 a fordított párosítás ($\sum B_0 v_1 / \sum B_0$) – rossz súlyok. A 400 a tavalyi csoportátlagok egyszerű átlaga, a 352 pedig maga a $V_1$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanez a cég: $V_0 = 420$, $V_S = 340$, $V_1 = 352$ ezer Ft (a mérnökök bére +20, a technikusoké +10 ezer Ft). Mennyi a részhatás- és az összetételhatás-különbség?`,
          options: [
            R`$K_R = +12$, $K_{\text{Ö}} = -80$ ezer Ft`,
            R`$K_R = -84$, $K_{\text{Ö}} = +16$ ezer Ft`,
            R`$K_R = +15$, $K_{\text{Ö}} = -83$ ezer Ft`,
            R`$K_R = -68$, $K_{\text{Ö}} = 0$ ezer Ft`
          ],
          answer: 0,
          hint: R`$K_R = V_1 - V_S$, $K_{\text{Ö}} = V_S - V_0$. Ellenőrizd: az összegük a teljes különbség?`,
          explain: R`$K_R = 352 - 340 = $ <b>+12</b>, $K_{\text{Ö}} = 340 - 420 = $ <b>−80</b> ezer Ft; együtt $-68 = K_T$ ✔. A részhatás a csoportváltozások $B_1$-gyel súlyozott átlaga: $(4 \cdot 20 + 16 \cdot 10)/20 = 12$. A +15 a súlyozatlan átlag $(20 + 10)/2$; a −84 / +16 a rossz $V_S = 436$-ból jön; a −68 / 0 pedig a teljes különbséget mondja részhatásnak. Mindenki többet keres, az átlag mégis 68 ezerrel esett – mert a technikusok aránya 40%-ról 80%-ra nőtt.`
        },
        {
          type: "single", shuffle: true,
          q: R`A bővülő cégnél $V_0 = 540$, $V_S = 420$, $V_1 = 450$ ezer Ft. Mennyi az összetételhatás-index, $I_{\text{Ö}}$?`,
          options: ["77,8%", "83,3%", "107,1%", "76,2%"],
          answer: 0,
          hint: R`Az összetételhatás-indexben mindkét főátlag a <em>bázis</em> részátlagaival számol, csak a súlyok mások.`,
          explain: R`$I_{\text{Ö}} = V_S / V_0 = 420 / 540 \approx 0{,}778$ → <b>77,8%</b>: az összetétel változása önmagában 22,2%-kal húzta le az átlagot. A 83,3% a főátlag-index ($I_F = 450/540$), a 107,1% a részátlag-index ($I_R = 450/420$). A 76,2% az indexek „kivonásából” jön ($I_F - I_R + 1$) – az indexek szorzódnak: $I_F = I_R \cdot I_{\text{Ö}} = 1{,}071 \cdot 0{,}778 \approx 0{,}833$ ✔.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vállalat átlagos termelékenységének főátlag-indexe $I_F = 90\%$, az összetételhatás-indexe $I_{\text{Ö}} = 80\%$. Mennyi a részátlag-index?`,
          options: ["112,5%", "110,0%", "72,0%", "88,9%"],
          answer: 0,
          hint: R`$I_F = I_R \cdot I_{\text{Ö}}$ – fejezd ki belőle $I_R$-t.`,
          explain: R`$I_R = I_F / I_{\text{Ö}} = 0{,}90 / 0{,}80 = 1{,}125$ → <b>112,5%</b>: az üzemeken belül átlagosan 12,5%-kal javult a termelékenység, de az összetétel változása ezt bőven elvitte. A 110% az indexek kivonásából jön ($90 - 80 + 100$), a 72% a szorzásból, a 88,9% a fordított osztásból ($0{,}8/0{,}9$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cég három üzemében a termelékenység csoportindexei 103%, 105% és 108%. Melyik lehet a részátlag-index értéke?",
          options: ["106,0%", "101,0%", "110,0%", "116,0%"],
          answer: 0,
          hint: "A részátlag-index a csoportindexek valamilyen súlyozott átlaga. Hová eshet egy átlag?",
          explain: R`$I_R$ a csoportindexek ($B_1 v_1$ súlyú, harmonikus) átlaga, ezért mindig a <b>legkisebb és a legnagyobb</b> csoportindex között van: 103% és 108% között. Ebből csak a 106% lehet. A 116% a növekedések összeadása ($3 + 5 + 8$). A főátlag-index ($I_F$) viszont lehet 110% vagy 101% is, mert abban az összetételhatás is benne van.`
        },
        {
          type: "single", shuffle: true,
          q: "Két település: A lakosságának 50%-a fiatal (halálozás 2‰) és 50%-a idős (40‰); B-nek 80%-a fiatal (3‰) és 20%-a idős (45‰). Mennyi lenne B halálozási arányszáma A korszerkezetével?",
          options: ["24,0‰", "11,4‰", "21,0‰", "9,6‰"],
          answer: 0,
          hint: "B korcsoportonkénti arányszámait kell súlyozni – de kinek a korszerkezetével?",
          explain: R`$0{,}5 \cdot 3 + 0{,}5 \cdot 45 = $ <b>24,0‰</b>. A nyers arányszámok: A $0{,}5 \cdot 2 + 0{,}5 \cdot 40 = 21{,}0$‰, B $0{,}8 \cdot 3 + 0{,}2 \cdot 45 = 11{,}4$‰. Nyersen B tűnik sokkal jobbnak, de azonos korszerkezettel (24,0 vs. 21,0‰) <b>B a rosszabb</b> – minden korcsoportban nagyobb a halálozása, csak fiatalabb a népessége. A 9,6‰ a fordított párosítás (A arányszámai B szerkezetével).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a standardizálásra? (Több jó válasz is lehet.)",
          options: [
            R`$V_S$ a tárgyidőszaki összetételt a bázisidőszaki részátlagokkal kombinálja.`,
            "A részhatás-különbség mindig a legkisebb és a legnagyobb csoportváltozás közé esik.",
            "Ha minden részátlag nő, a főátlag is biztosan nő.",
            "A standardizált halálozási arányszám a település tényleges halálozási arányszáma.",
            R`Ha a sokaság összetétele nem változik, $I_{\text{Ö}} = 100\%$ és $I_F = I_R$.`
          ],
          answer: [0, 1, 4],
          hint: R`Írd fel $V_S$ képletét és $K_R$-t súlyozott átlagként. Mi történik, ha $B_1$ arányai megegyeznek $B_0$-éival?`,
          explain: R`$V_S = \sum B_1 v_0 / \sum B_1$. $K_R = \sum B_1 (v_1 - v_0) / \sum B_1$ súlyozott átlag, ezért a csoportváltozások között van. Ha az összetétel nem változik, $V_S = V_0$, így $I_{\text{Ö}} = 1$ és $I_F = I_R$. A főátlag viszont csökkenhet akkor is, ha minden részátlag nő (bővülő cég: 540 → 450). A standardizált arányszám „mi lenne, ha” szám, csak összehasonlításra való – értéke a standard választásától is függ.`
        },
        {
          type: "match",
          q: "Egy cég átlagbérének változása. Párosítsd a helyzetet a hatásokkal!",
          pairs: [
            ["Minden csoportban 5%-kal nőtt a bér, a létszámarányok nem változtak.", "csak részhatás"],
            ["Senkinek nem változott a bére, de elküldték a legalacsonyabb bérű dolgozókat.", "csak összetételhatás"],
            ["A csoportátlagok nőttek, de az alacsony bérű csoport aránya is nőtt.", "ellentétes irányú hatások"],
            ["A csoportátlagok nőttek, és a magas bérű csoport aránya is nőtt.", "azonos irányú hatások"]
          ],
          hint: "Kérdezd meg külön: változtak-e a részátlagok (részhatás)? És változott-e az összetétel (összetételhatás)? Ha mindkettő, melyik irányba húz?",
          explain: R`Változatlan összetételnél $V_S = V_0$, minden változás részhatás. Változatlan részátlagoknál $V_1 = V_S$, minden változás összetételhatás (ilyenkor $I_R = 100\%$ – lásd 4.7, „senki nem kapott béremelést”). Ha az alacsony bérűek aránya nő, az összetételhatás negatív, a részhatás pozitív – ez a bővülő cég esete. Ha a magas bérűek aránya nő, mindkét hatás felfelé húz (mint a két boltnál: $K_R = +0{,}1$, $K_{\text{Ö}} = +0{,}2$).`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms4-final": {
      title: "Fejezetzáró teszt – 4. Viszonyszámok, indexek, standardizálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy termék árát 25%-kal megemelik. Hány százalékkal kell utána csökkenteni, hogy visszaálljon az eredeti árra?",
          options: ["20,0%-kal", "25,0%-kal", "33,3%-kal", "80,0%-kal"],
          answer: 0,
          hint: "A csökkentés alapja már az emelt ár. Hányszorosára kell változnia?",
          explain: R`$1{,}25 \cdot x = 1$ → $x = 0{,}8$: az emelt ár 80%-a, vagyis <b>20%-kal</b> kell csökkenteni. A 25% a „visszafelé ugyanaz a százalék” hibája ($1{,}25 \cdot 0{,}75 \approx 0{,}94$). A 33,3% a fordított kérdés válasza (25%-os <em>csökkentés</em> után kell ennyivel emelni), a 80% pedig a „százaléka” és a „százalékkal” összekeverése.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bank betéti kamata 4%-ról 5%-ra nő. Melyik állítás helyes?",
          options: [
            "1 százalékponttal, relatíve 25%-kal nőtt.",
            "1%-kal nőtt.",
            "25 százalékponttal nőtt.",
            "1 százalékponttal, relatíve 20%-kal nőtt."
          ],
          answer: 0,
          hint: "Két százalék különbsége és hányadosa mást mond. Melyik szó melyikhez tartozik, és mi a nevező?",
          explain: R`A különbség $5 - 4 = 1$ <b>százalékpont</b>; a hányados $5/4 = 1{,}25$, vagyis relatíve <b>25%-kal</b> nőtt. Az „1%-kal” hibás: az 4,04% lenne. A „25 százalékpont” összekeveri a két fogalmat. A 20% rossz alapra mér ($1/5$) – a változást a kiinduló értékhez (4%) viszonyítjuk.`
        },
        {
          type: "set",
          q: "Melyik sor adatait van értelme összeadni? Jelöld ki mindet!",
          items: [
            "egy bolt havi forgalma 12 hónapon át",
            "egy raktár készlete minden hónap végén",
            "egy egyetem hallgatói karonként",
            "a megyék átlagbérei",
            "egy autó tömege, teljesítménye és ára"
          ],
          answer: ["egy bolt havi forgalma 12 hónapon át", "egy egyetem hallgatói karonként"],
          hint: "Időszakra vagy időpontra vonatkozik? Felosztja-e az egészet, vagy csak összevet? Azonos-e a mértékegység?",
          explain: R`A havi forgalom <b>tartamidősor</b> (összege az éves forgalom), a karonkénti hallgatószám <b>csoportosító</b> minőségi sor (összege az egyetem összes hallgatója). A hónapvégi készlet <b>állapotidősor</b> – összege nem jelent semmit, átlagolni kronologikus átlaggal lehet. A megyei átlagbérek <b>összehasonlító</b> sort alkotnak. Az autó adatai <b>leíró</b> sor, eltérő mértékegységben.`
        },
        {
          type: "single", shuffle: true,
          q: "Panni két piacon vesz almát: az egyiken 3000 Ft-ot költ 500 Ft/kg-os, a másikon 2000 Ft-ot 250 Ft/kg-os áron. Mennyi az átlagár?",
          options: ["357,1 Ft/kg", "375,0 Ft/kg", "400,0 Ft/kg", "333,3 Ft/kg"],
          answer: 0,
          hint: "Az ár Ft/kg. Az ismert súly (a kifizetett forint) a számlálóhoz vagy a nevezőhöz tartozik?",
          explain: R`A súly a kifizetett összeg, ami a Ft/kg <b>számlálója</b> → harmonikus átlag: $\dfrac{3000 + 2000}{3000/500 + 2000/250} = \dfrac{5000}{6 + 8} \approx 357{,}1$ Ft/kg. A 375 az egyszerű átlag, a 400 a forinttal súlyozott <em>számtani</em> átlag (rossz súly a formához), a 333,3 pedig a súlyozatlan harmonikus átlag. Ellenőrzés: 14 kg-ot vett 5000 Ft-ért.`
        },
        {
          type: "match",
          q: "Milyen viszonyszám? Párosítsd!",
          pairs: [
            ["egy hektárra jutó búzatermés", "intenzitási"],
            ["a nyugdíjasok aránya a lakosságban", "megoszlási"],
            ["1000 fiúszületésre jutó leányszületés", "koordinációs"],
            ["a 2025-ös forgalom a 2021-es százalékában", "dinamikus"]
          ],
          hint: "Mit osztunk mivel: részt az egészhez, részt egy másik részhez, két különnemű adatot, vagy két időszakot?",
          explain: R`A termés (q) és a terület (ha) különnemű → <b>intenzitási</b>. A nyugdíjasok a lakosság része → <b>megoszlási</b> (rész / egész). A leány- és a fiúszületések ugyanannak az egésznek két része → <b>koordinációs</b> (rész / másik rész). Két időszak azonos adata → <b>dinamikus</b> (itt bázisviszonyszám, 2021 = 100%).`
        },
        {
          type: "single", shuffle: true,
          q: "Panni kedvenc kávézójának forgalma 2021-ben 40, 2025-ben 54 millió Ft volt. Mennyi volt az átlagos évi növekedés?",
          options: ["7,8%", "8,8%", "6,2%", "35,0%"],
          answer: 0,
          hint: "Öt év adata hány évről évre történő változást jelent? És milyen átlag illik a szorzódó változásokhoz?",
          explain: R`$54/40 = 1{,}35$, és 5 év adata 4 változás → $\sqrt[4]{1{,}35} \approx 1{,}078$: évi <b>7,8%</b>. A 8,8% (pontosan 8,75%) a $35\%/4$, ami a láncindexek számtani átlaga is – felfelé torzít ($1{,}0875^4 \approx 1{,}40$). A 6,2% rossz gyökkitevő (ötödik gyök a negyedik helyett), a 35% az összes, nem az évi változás.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bázissor (2020 = 100%): 100; 125; 150; 135 (2020–2023). Mennyi 2023 értéke 2022 = 100% bázison?",
          options: ["90,0%", "85,0%", "108,0%", "111,1%"],
          answer: 0,
          hint: "Bázisváltás: a régi bázisindexeket mivel kezeled – kivonással vagy osztással?",
          explain: R`Minden tagot elosztunk az új bázisév bázisindexével: $135 / 150 = 0{,}90$ → <b>90,0%</b>. A 85% a kivonásos bázisváltás ($135 - 150 + 100$) hibája. A 108% a 2023-as láncindex 2021-hez mérve ($135/125$) – rossz bázis. A 111,1% a fordított osztás ($150/135$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy iskolában tavaly a diákok 50%-a „jó” osztályba (átlag 80 pont), 50%-a „gyengébb” osztályba (50 pont) járt; idén 25%–75% az arány, az átlagok 85 és 52 pont. ($V_0 = 65$, $V_1 = 60{,}25$.) Mennyi az összetételhatás-különbség, $K_{\text{Ö}}$?`,
          options: ["−7,50 pont", "−4,75 pont", "+3,50 pont", "+2,75 pont"],
          answer: 0,
          hint: R`Kell a standard főátlag: idei arányok, tavalyi osztályátlagok. Utána $K_{\text{Ö}} = V_S - V_0$.`,
          explain: R`$V_S = 0{,}25 \cdot 80 + 0{,}75 \cdot 50 = 57{,}5$, így $K_{\text{Ö}} = 57{,}5 - 65 = $ <b>−7,50</b> pont. A részhatás $K_R = 60{,}25 - 57{,}5 = +2{,}75$, a teljes különbség $K_T = -4{,}75$ ✔. A +3,50 a fordított párosításból jön ($0{,}5 \cdot 85 + 0{,}5 \cdot 52 = 68{,}5$, és $68{,}5 - 65$). Mindkét osztálytípus javult, az iskolai átlag mégis esett, mert a gyengébb osztályokba járók aránya 50%-ról 75%-ra nőtt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy termékcsoport értékindexe 120%, a Paasche-féle árindexe 104%. Mennyi a Laspeyres-féle (bázisárakon számolt) volumenindex?`,
          options: ["115,4%", "116,0%", "124,8%", "86,7%"],
          answer: 0,
          hint: "Melyik volumenindex alkot indexkört a Paasche-féle árindexszel?",
          explain: R`Indexkör: $I_v = I_p^{1} \cdot I_q^{0}$, így $I_q^{0} = 1{,}20 / 1{,}04 \approx 1{,}154$ → <b>115,4%</b>. A Paasche-ár párja éppen a Laspeyres-volumen, tehát a kérdés kiszámolható. A 116% a kivonás ($120 - 104 + 100$), a 124,8% a szorzás, a 86,7% a fordított osztás ($1{,}04/1{,}2$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy háztartás idei kiadása: élelmiszer 60 000 Ft (egyedi árindex 1,2), egyéb 40 000 Ft (egyedi árindex 1,0). Mennyi a Paasche-féle árindex?",
          options: ["111,1%", "112,0%", "110,0%", "90,0%"],
          answer: 0,
          hint: R`Tárgyidőszaki értékek ($v_1$) és egyedi árindexek: melyik átlagforma adja a Paasche-indexet?`,
          explain: R`$v_1$ súlyokkal <b>harmonikus</b> átlag: $\dfrac{100\,000}{60\,000/1{,}2 + 40\,000/1{,}0} = \dfrac{100\,000}{90\,000} \approx 1{,}111$ → <b>111,1%</b>. (A nevező az idei kosár tavalyi áron, $\sum q_1 p_0$.) A 112% a számtani átlag $v_1$ súlyokkal – rossz forma; a 110% a súlyozatlan átlag; a 90% a hányados fordítva ($90\,000 / 100\,000$).`
        },
        {
          type: "single", shuffle: true,
          q: "A bérek 20%-kal, a fogyasztói árak 25%-kal nőttek. Hogyan változott a reálbér?",
          options: ["4,0%-kal csökkent", "5,0%-kal csökkent", "4,2%-kal csökkent", "50,0%-kal nőtt"],
          answer: 0,
          hint: "Reálindex = nominális index / árindex.",
          explain: R`$1{,}20 / 1{,}25 = 0{,}96$ → a reálbér <b>4,0%-kal csökkent</b>. Az 5% a kivonás ($20 - 25$) – nagy inflációnál ez már észrevehetően téved. A 4,2% a fordított hányados ($1{,}25/1{,}20 \approx 1{,}042$), az 50% a szorzás. A „20%-kal több bér” itt valójában reálcsökkenés: nominális ≠ reál.`
        },
        {
          type: "single", shuffle: true,
          q: "Panni 1 millió forintot tesz félre, kamat nélkül. Két év alatt az árak először 10%-kal, majd 20%-kal nőnek. Mennyit ér a pénze a kiinduló év árain?",
          options: ["757,6 ezer Ft", "769,2 ezer Ft", "700,0 ezer Ft", "720,0 ezer Ft"],
          answer: 0,
          hint: "Először láncold az inflációt (árszint a két év végén), aztán deflálj: oszd el vele a nominális összeget.",
          explain: R`Árszint: $1{,}10 \cdot 1{,}20 = 1{,}32$. Reálérték: $1000 / 1{,}32 \approx$ <b>757,6 ezer Ft</b> – az infláció kb. 242 ezret „vitt el”. A 769,2 az inflációs százalékok összeadásából jön ($1000/1{,}30$). A 700 a kivonásos deflálás ($1000 \cdot (1 - 0{,}3)$), a 720 pedig a „mínusz százalékok” szorzata ($1000 \cdot 0{,}9 \cdot 0{,}8$) – a deflálás osztás az árindexszel, nem szorzás $(1 - \text{infláció})$-val.`
        },
        {
          type: "single", shuffle: true,
          q: "Öregfalu nyers halálozási arányszáma 22,7‰, Ifjúvárosé 10,2‰. Öregfalu korszerkezetével Ifjúváros arányszáma 27,6‰ lenne. Melyik következtetés helyes?",
          options: [
            "Ifjúvárosban minden korcsoportban nagyobb a halálozás; a nyers különbséget a korszerkezet okozza.",
            "Öregfaluban rosszabb a helyzet, hiszen a nyers arányszáma több mint kétszeres.",
            "Ifjúváros tényleges halálozási arányszáma 27,6‰, csak eddig rosszul mérték.",
            "A két település közti valódi különbség pontosan 27,6 − 22,7 = 4,9‰, bármilyen standardot választunk."
          ],
          answer: 0,
          hint: "Mit szűr ki a közös korszerkezet? És mire való a standardizált érték – leírásra vagy összehasonlításra?",
          explain: R`Azonos korszerkezettel Ifjúváros a rosszabb (27,6 vs. 22,7‰): az összetételhatás kiszűrése után a csoportonkénti arányszámok döntenek, és azok Ifjúvárosban mind nagyobbak. A nyers arányszám összetett viszonyszám – a sok idős lakos húzza fel Öregfaluét. A 27,6‰ csak egy „mi lenne, ha” szám, nem a tényleges halálozás. Értéke (és a különbség nagysága) a standard választásától is függ: egyenlő (1/3) súlyokkal például 19,7 és 24‰ – a <b>sorrend</b> marad, a 4,9‰ nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Panni kiadása 25%-kal nőtt ($I_v = 125\%$), a tavalyi kosarával mért drágulás 10% ($I_p^{0} = 110\%$). Panni így okoskodik: „A maradék 15% abból jön, hogy többet vásároltam.” Mi a helyes?`,
          options: [
            R`A volumen $1{,}25 / 1{,}10 \approx 1{,}136$, vagyis 13,6%-kal nőtt – ez az idei árakon mért volumen ($I_q^{1}$).`,
            R`Igaza van: $125\% - 110\% = 15\%$ a mennyiségek hatása.`,
            R`A volumen $1{,}25 \cdot 1{,}10 = 1{,}375$, vagyis 37,5%-kal nőtt.`,
            R`A volumen $1{,}25 / 1{,}10 \approx 1{,}136$, vagyis 13,6%-kal nőtt – ez a tavalyi árakon mért volumen ($I_q^{0}$).`
          ],
          answer: 0,
          hint: "Indexkör: az értékindex ár- és volumenindex szorzata. Melyik súlyozású volumenindex párja a Laspeyres-árindex?",
          explain: R`A maradék <b>osztással</b> jön, nem kivonással: $1{,}25 / 1{,}10 \approx 1{,}136$. A Laspeyres-ár párja az <b>ellentétes</b> súlyozású, tárgyidőszaki árakon számolt volumenindex: $I_v = I_p^{0} \cdot I_q^{1}$. A tavalyi árakon mért volumen ($I_q^{0}$) 116% – az a Paasche-árindexszel (107,8%) alkot párt. A „maradék 15%” tehát valójában 13,6–16%, attól függően, melyik év árain mérjük (4.7).`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
