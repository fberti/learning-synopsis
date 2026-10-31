/* =========================================================
   Elektromosságtan és digitális elektronika 0. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ fejezetzáró */
    "el0-final": {
      title: "Fejezetzáró teszt – 0. fejezet",
      questions: [
        /* 0.1 – aranyszabályok */
        {
          type: "multi", shuffle: true,
          q: "Melyik lépés sérti a tíz aranyszabály valamelyikét? (Több jó válasz is lehet.)",
          options: [
            "Bekapcsolt USB mellett áthelyezel egy jumpert egy másik csíkba.",
            "Egy LED-et egy 220 Ω-os ellenálláson át kötsz a 13-as lábra.",
            "Ellenállást mérsz egy kapcsolásban, miközben az Arduino USB-ről fut.",
            "A 9 V-os elemet a tápmodul kerek bemenetére kötöd, a jumpereket 5V állásba teszed.",
            R`Egy lábról két LED-et hajtasz meg, mindkettő kb. $13{,}6\,\text{mA}$-t vesz fel.`
          ],
          answer: [0, 2, 4],
          hint: "Menj végig a szabályokon: áramtalanítva építs, ellenállást csak áramtalanítva mérj, és mennyi áramot adhat egy láb?",
          explain: R`Sérül a <b>2. szabály</b> (áram alatt építesz: egy rossz helyre csúszó láb rövidzárat okozhat), a <b>8. szabály</b> (ellenállást csak áramtalanított körben mérünk – a műszer saját áramot küld át, a körben folyó áram meghamisítja, és a műszer is sérülhet), és a <b>4. szabály</b>: két LED együtt $2 \cdot 13{,}6 = 27{,}2\,\text{mA}$, ez az ajánlott $20\,\text{mA}$ fölött van. Az, hogy a $40\,\text{mA}$-es abszolút határ alatt marad, nem teszi szabályossá – „működött, tehát jó” tipikus tévedés. A LED $220\,\Omega$-mal pontosan a 3. szabály szerinti bekötés. A 9 V a tápmodul <em>bemenetére</em> való (6,5–12 V); a modul alakítja 5 V-ra. A 6. szabály csak azt tiltja, hogy a 9 V közvetlenül a sínre kerüljön.`
        },

        /* 0.2 – belső kötések */
        {
          type: "single", shuffle: true,
          q: "Melyik két pont van a breadboardon belül összekötve?",
          options: [
            "b14 és e14",
            "e14 és f14",
            "c14 és c15",
            R`a felső $+$ sín és a felső $-$ sín`
          ],
          answer: 0,
          hint: "Egy ötös csík egy oszlopon belül öt lyukat köt össze. Mi választja el a két csíkot? És merre fut egy tápsín?",
          explain: R`A b14 és az e14 ugyanazon az ötös csíkon ül (a–e, 14. oszlop), tehát össze vannak kötve. Az e14 és az f14 az árok két oldalán van: két külön csík, akármilyen közel vannak egymáshoz. A c14 és a c15 egy sorban van ugyan, de két különböző oszlopban – a csík oszlop menti, nem sor menti. A tápsín a panel <em>hosszában</em> van összekötve, a $+$ és a $-$ sín között nincs kapcsolat; ha lenne, az rövidzár volna (5. aranyszabály).`
        },
        {
          type: "single", shuffle: true,
          q: R`A 13-as láb jumpere a b5-ben van. Egy ellenállás lábai: c5 és c9. A LED hosszabb lába a d9-ben, rövidebb lába a d12-ben. A GND-jumper az e13-ban. Világít-e majd a LED a Blinkkel?`,
          options: [
            "Nem: a LED rövidebb lába a 12-es, a GND a 13-as csíkon van, a kör nincs zárva.",
            "Nem: az ellenállás mindkét lába a c sorban van, ezért rövidre van zárva.",
            "Nem: a LED fordítva áll.",
            "Igen: minden alkatrész két különböző csík között van, a polaritás helyes."
          ],
          answer: 0,
          hint: "Kövesd az áramutat csíkról csíkra, a 13-as lábtól a GND-ig. Melyik oszlop melyik csík?",
          explain: R`Áramút: 13-as láb → 5-ös csík → ellenállás → 9-es csík → LED hosszabb lába (anód, ez a helyes irány) → LED rövidebb lába, 12-es csík → és itt vége: a GND a 13-as csíkon van, a 12-es és a 13-as oszlop nincs összekötve. A „c5 és c9 rövidre zárva” a sor és az oszlop összekeverése: az ötös csík egy <em>oszlopon</em> belül köt össze, a c5 és a c9 két külön csík – az ellenállás jól van bekötve. A LED nem fordított: a hosszabb láb (anód) néz az ellenállás, vagyis a $+$ felé. A „minden rendben” válasz azt hagyja figyelmen kívül, hogy a GND-jumper egy oszloppal arrébb csúszott.`
        },

        /* 0.3 – aljzatok, bekötés, kijelző */
        {
          type: "match",
          q: "Párosítsd! (Bal oldalt: mit mérsz, vagy mit látsz a kijelzőn. Jobb oldalt: hogyan kösd be a műszert, illetve mit jelent a kijelzés.)",
          pairs: [
            ["egy 9 V-os elem feszültsége", "V/Ω aljzat, a két pontra érintve"],
            ["egy LED árama", "10A aljzat, a megbontott körbe sorosan"],
            ["egy ellenállás értéke", "V/Ω aljzat, áramtalanított körben"],
            [R`<code>OL</code> ellenállásmérésnél`, "szakadás vagy a tartomány fölötti érték"],
            [R`<code>-9.43</code> V`, "fordítva érintett mérőhegyek"]
          ],
          hint: "Melyik mennyiséghez kell a kört megbontani? Melyikhez kell áramtalanítani? És mit jelent a túlcsordulás?",
          explain: R`Feszültséget <b>párhuzamosan</b> mérünk: V/Ω aljzat, a kört nem bontjuk meg, a két pontra érintünk. Áramot <b>sorosan</b>: piros zsinór a 10A aljzatba, a kört megbontjuk, hogy az áram a műszeren folyjon át – utána azonnal vissza a V/Ω-ba! (Ha a 10A-ben marad, a következő feszültségmérés rövidzár.) Ellenállást a V/Ω aljzattal, de csak áramtalanított körben, mert a műszer saját áramot küld át. Az <code>OL</code> túlcsordulás: a mért érték a tartomány fölött van, ellenállásnál szakadás – <b>nem</b> nulla; a 0 Ω épp az ellenkezője, a rövidzár. A mínuszjel csak azt mutatja, hogy a piros mérőhegy a negatívabb ponton van: az elem 9,43 V-os, semmi baj.`
        },

        /* 0.3 – pontosság */
        {
          type: "single", shuffle: true,
          q: R`A multiméter <code>2.500</code> V-ot mutat (DC, pontosság ±(0,8% + 5)). Mekkora a mérés bizonytalansága?`,
          options: [R`$\pm 0{,}025\,\text{V}$`, R`$\pm 0{,}020\,\text{V}$`, R`$\pm 0{,}053\,\text{V}$`, R`$\pm 0{,}070\,\text{V}$`],
          answer: 0,
          hint: "Két tag: a százalék minek a százaléka? És mennyit ér egy digit ezen a méréshatáron – nézd meg, hány tizedesjegyet mutat a kijelző.",
          explain: R`A 2,500 V az 5,999 V-os méréshatárba esik, a felbontás $0{,}001\,\text{V}$. $\Delta = 0{,}008 \cdot 2{,}500 + 5 \cdot 0{,}001 = 0{,}020 + 0{,}005 = 0{,}025\,\text{V}$, a valódi érték $2{,}475$ és $2{,}525\,\text{V}$ között van. A $\pm 0{,}020\,\text{V}$ csak a százalékos tag – az 5 digitet elhagytad. A $\pm 0{,}053\,\text{V}$-ban a 0,8%-ot a méréshatárra ($5{,}999\,\text{V}$) számoltad, pedig a <b>leolvasott</b> értékre vonatkozik. A $\pm 0{,}070\,\text{V}$ rossz felbontással jön ki: $5 \cdot 0{,}01 = 0{,}05$ – a $0{,}01\,\text{V}$-os felbontás a 59,99 V-os határé, itt három tizedesjegy látszik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy laptop USB-portjáról táplált Arduino 5V lábán <code>4.790</code> V-ot mérsz (DC, ±(0,8% + 5)). A USB-szabvány alsó határa $4{,}75\,\text{V}$. Biztos-e, hogy a feszültség e határ fölött van?`,
          options: [
            "Nem dönthető el: a valódi érték kb. 4,747 és 4,833 V között lehet.",
            "Igen: a valódi érték kb. 4,752 és 4,828 V között van.",
            "Igen: a kijelzett 4,790 V nagyobb, mint 4,75 V.",
            "Nem dönthető el: a valódi érték kb. 4,702 és 4,878 V között lehet."
          ],
          answer: 0,
          hint: "Előbb számold ki a bizonytalanságot (mindkét taggal, a jó felbontással), aztán nézd meg, hová esik a sáv alsó vége.",
          explain: R`Felbontás $0{,}001\,\text{V}$: $\Delta = 0{,}008 \cdot 4{,}790 + 5 \cdot 0{,}001 \approx 0{,}0383 + 0{,}005 = 0{,}0433\,\text{V}$. A valódi érték $4{,}747$ és $4{,}833\,\text{V}$ között lehet – az alsó vége a 4,75 V <em>alatt</em> van, tehát ezzel a műszerrel nem dönthető el. A „4,752–4,828” csak a százalékos taggal számol ($\pm 0{,}038$): az 5 digit elhagyása épp átbillenti a döntést. A „4,790 > 4,75” a bizonytalanságot teljesen figyelmen kívül hagyja – a különbség csak $0{,}040\,\text{V}$, kisebb, mint $\Delta$. A „4,702–4,878” rossz felbontással ($0{,}01\,\text{V}$, $\Delta \approx 0{,}088$) jön ki: a következtetés véletlenül ugyanaz, de a sáv kétszer olyan széles, mint a valódi.`
        },

        /* 0.4 – színkód */
        {
          type: "single", shuffle: true,
          q: "Egy 4 sávos ellenállás sávjai: sárga, lila, narancs, arany. Mennyi a névleges értéke?",
          options: [R`$47\,\text{k}\Omega$`, R`$473\,\Omega$`, R`$4{,}7\,\text{k}\Omega$`, R`$470\,\text{k}\Omega$`],
          answer: 0,
          hint: "4 sáv: két számjegy, szorzó, tűrés. A szorzó színe azt mondja meg, hány nulla jön a két számjegy után.",
          explain: R`Sárga = 4, lila = 7, a narancs szorzó $\times 10^3$ (3 nulla): $47 \cdot 1000 = 47\,000\,\Omega = 47\,\text{k}\Omega$, az arany sáv ±5%. A $473\,\Omega$ a tipikus hiba: a szorzó sávot harmadik számjegynek olvastad. A $4{,}7\,\text{k}\Omega$-hoz piros szorzó kellene (2 nulla, ez a kitben gyakori sárga-lila-piros), a $470\,\text{k}\Omega$-hoz sárga (4 nulla) – mindkettő egy nullával eltévesztett szorzó.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 5 sávos ellenállás sávjai: narancs, narancs, fekete, barna, barna. Rajta $3{,}36\,\text{k}\Omega$-ot mérsz. Mekkora a tűrési sáv, és benne van-e a mért érték? (A műszer bizonytalanságától most tekints el.)`,
          options: [
            R`$3267$–$3333\,\Omega$; a mért érték kívül esik`,
            R`$3135$–$3465\,\Omega$; a mért érték belül van`,
            R`$3326$–$3394\,\Omega$; a mért érték belül van`,
            R`$32{,}67$–$33{,}33\,\Omega$; a mért érték kívül esik`
          ],
          answer: 0,
          hint: "Számold meg a sávokat! Három számjegy, szorzó, tűrés. Melyik tűrést jelenti a barna? És minek a százaléka a tűrés?",
          explain: R`5 sáv: 3, 3, 0, szorzó barna ($\times 10$): $330 \cdot 10 = 3300\,\Omega$; az utolsó barna sáv ±1%. A tűrési sáv a <b>névleges</b> értékből: $3300 \cdot 0{,}99 = 3267\,\Omega$ és $3300 \cdot 1{,}01 = 3333\,\Omega$ – a mért $3360\,\Omega$ kívül esik. A $3135$–$3465\,\Omega$ ±5%-kal számol (az arany tűrése, nem a barnáé). A $3326$–$3394\,\Omega$-ban a tűrést a <em>mért</em> értékre számoltad – így a mért érték persze mindig „benne van”, ezért értelmetlen. A $32{,}67$–$33{,}33\,\Omega$ azt jelenti, hogy az 5 sávost 4 sávosként olvastad (narancs-narancs, fekete szorzó: $33\,\Omega$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kék testű, 5 sávos ellenállás egyik végéről olvasva: barna, piros, fekete, barna, barna. Mindkét vége barna, a sávok egyforma távolságra vannak. A kit ellenállásai az E12 sorból valók. Mennyi a valószínű névleges érték?`,
          options: [R`$1{,}2\,\text{k}\Omega$`, R`$11\,\text{k}\Omega$`, R`$12\,\Omega$`, R`$120\,\Omega$`],
          answer: 0,
          hint: "Olvasd le mindkét irányból (az 5 sávos kódot 5 sávosként!), és nézd meg, melyik eredmény szerepel az E12 sorban.",
          explain: R`Ebben az irányban: 1, 2, 0, szorzó barna ($\times 10$): $120 \cdot 10 = 1200\,\Omega = 1{,}2\,\text{k}\Omega$, ±1% – E12-érték. Fordítva: barna, barna, fekete, piros, barna → $110 \cdot 100 = 11\,\text{k}\Omega$: az 1,1 nincs az E12 sorban, így ez a fordított olvasási irány. A $12\,\Omega$ az 5 sávos kód 4 sávosként olvasva (két jegy, fekete szorzó). A $120\,\Omega$-nál a három számjegy után a szorzót elhagytad. Biztosat persze a multiméter mond: 1,2 kΩ és 11 kΩ között azonnal látszik a különbség.`
        },

        /* 0.5 – Blink */
        {
          type: "single", shuffle: true,
          q: R`A Blinkben a LED-et <code>delay(200)</code> ideig bekapcsolva, <code>delay(600)</code> ideig kikapcsolva tartod. Mennyi a periódusidő $T$, a frekvencia $f$ és a kitöltési tényező?`,
          options: [
            R`$T = 0{,}8\,\text{s}$, $f = 1{,}25\,\text{Hz}$, kitöltés 25%`,
            R`$T = 0{,}8\,\text{s}$, $f = 1{,}25\,\text{Hz}$, kitöltés 33%`,
            R`$T = 0{,}8\,\text{s}$, $f = 0{,}8\,\text{Hz}$, kitöltés 25%`,
            R`$T = 0{,}2\,\text{s}$, $f = 5\,\text{Hz}$, kitöltés 25%`
          ],
          answer: 0,
          hint: R`Egy periódus egy teljes „be + ki” ciklus. A frekvencia a periódusidő reciproka, a kitöltés a bekapcsolt idő aránya a <em>teljes</em> periódushoz.`,
          explain: R`$T = t_\text{be} + t_\text{ki} = 0{,}2 + 0{,}6 = 0{,}8\,\text{s}$, $f = 1/T = 1{,}25\,\text{Hz}$, kitöltés $t_\text{be}/T = 0{,}2/0{,}8 = 25\%$. A 33% a $t_\text{be}/t_\text{ki} = 200/600$ hányados – a kitöltés nevezője a teljes periódus, nem a kikapcsolt idő. Az $f = 0{,}8\,\text{Hz}$ a periódusidőt adja meg frekvenciaként ($f = T$ helyett $f = 1/T$ kell). A $T = 0{,}2\,\text{s}$, $f = 5\,\text{Hz}$ csak a bekapcsolt időt nézi, a kikapcsolt 600 ms-ot elhagyja.`
        },

        /* 0.5 – a panel */
        {
          type: "multi", shuffle: true,
          q: "Melyik állítás igaz az Arduino MEGA 2560-ra? (Több jó válasz is lehet.)",
          options: [
            "Ha a panel 9 V-os elemről jár a tápcsatlakozón át, a Vin lábon kb. 9 V van, nem 5 V.",
            "A 0-s és 1-es láb a USB-s soros kapcsolaté; ha ide kötsz valamit, a feltöltés és a soros monitor megzavarodhat.",
            "A beépített „L” LED a 13-as lábra van kötve.",
            "A 3.3V láb akár 200 mA-t is adhat, ezért kisebb motort is elbír.",
            R`„Permission denied: <code>/dev/ttyACM0</code>” esetén a <code>sudo usermod -aG dialout $USER</code> parancs azonnal hat, ki- és bejelentkezés nélkül.`
          ],
          answer: [0, 1, 2],
          hint: "Gondold végig a táblázatot: Vin, 0–1, 13-as láb, 3.3V terhelhetősége. A csoporttagság mikor lép életbe?",
          explain: R`Igaz: a <b>Vin</b> a külső táp feszültsége (9 V-os elemnél kb. 9 V) – „Vin = 5 V” tévhitből megy tönkre az 5 V-os IC. Igaz: a <b>0–1</b> a TX0/RX0, a USB-s soros kapcsolat. Igaz: a beépített LED a <b>13-as</b> lábon van (<code>LED_BUILTIN</code>). Hamis: a 3.3V láb legfeljebb kb. $50\,\text{mA}$-t ad; a 200 mA a <em>lábak összes</em> áramának ajánlott felső határa, és motort egyébként sem kötünk közvetlenül a panelre. Hamis: a <code>dialout</code> csoporthoz adás csak ki- és bejelentkezés (vagy újraindítás) után lép életbe.`
        },

        /* 0.5 + 0.7 – hibajelenségek */
        {
          type: "match",
          q: "Párosítsd a hibajelenséget a teendővel!",
          pairs: [
            [R`„Permission denied: <code>/dev/ttyACM0</code>” feltöltéskor`, "felvenni magad a dialout csoportba, majd ki- és bejelentkezni"],
            ["zagyva karakterek a soros monitorban", "a monitor baudját a programéhoz igazítani"],
            ["az IDE port-listájában nincs Arduino", "másik, adatátvitelre is alkalmas USB-kábelt kipróbálni"],
            ["„programmer is not responding”", "ellenőrizni az alaplapot és a portot az Eszközök menüben"],
            ["a panel jobb felén nincs táp, a balon van", "kimérni és áthidalni a megszakított tápsínt"]
          ],
          hint: "Melyik jelenség jelent jogosultsági, melyik beállítási, melyik kábel- és melyik bekötési hibát?",
          explain: R`A „Permission denied” jogosultsági hiba: a soros port csak a <code>dialout</code> csoport tagjainak írható, és a tagság csak újbóli bejelentkezés után él. A zagyva karakterek <b>nem</b> hardverhibát jeleznek: a soros monitor baudja eltér a <code>Serial.begin</code>-ben megadottól (nálunk 115200). Ha nincs port, a gép nem is látja a panelt: gyakran csak töltésre jó a kábel (<code>dmesg | tail</code> megmutatja). A „programmer is not responding” rossz alaplapot vagy portot jelent – legyen „Arduino Mega or Mega 2560” és <code>/dev/ttyACM0</code>. A fél panel sötét: egyes paneleken a tápsín a közepén meg van szakítva – szakadásvizsgálóval kimérhető, egy vezetékkel áthidalható.`
        },

        /* 0.6 – közös GND */
        {
          type: "single", shuffle: true,
          q: "A tápmodulról táplált kapcsolás egyik pontjának feszültségét az Arduino egyik analóg bemenetével méred (az Arduino USB-ről jár). Értelmetlen, ugráló számokat kapsz. Mi a legvalószínűbb hiba?",
          options: [
            "Nincs közös GND: a tápmodul és az Arduino GND-je nincs összekötve.",
            "A tápmodul 5V sínje nincs összekötve az Arduino 5V lábával.",
            "A soros monitor baudja nem egyezik a programéval.",
            "Az analóg bemenet tönkrement, cserélni kell az Arduinót."
          ],
          answer: 0,
          hint: "A feszültség mindig két pont különbsége. Mihez képest méri az Arduino a bemenetét?",
          explain: R`Az Arduino a bemenetét a <b>saját GND-jéhez</b> képest méri. Ha a tápmodul GND-je nincs vele összekötve, a két rendszernek nincs közös viszonyítási pontja, a bemenet „lebeg” – értelmetlen számok jönnek. Megoldás: egy vezeték a két GND közé. A két 5 V-ot viszont <b>tilos</b> összekötni, amíg az Arduino USB-ről is kap tápot: két táp dolgozna egymás ellen. A rossz baud zagyva <em>karaktereket</em> okoz, nem értelmes, de ugráló számokat. Hardverhibát gyanítani az utolsó lépés – előbb a bekötést ellenőrizd.`
        },

        /* 0.7 – eltérés */
        {
          type: "single", shuffle: true,
          q: R`A mérési naplóban: jóslat $9{,}0\,\text{V}$ (egy használt 9 V-os elem), mért $7{,}20\,\text{V}$. Mennyi az eltérés?`,
          options: [R`$-20{,}0\%$`, R`$-25{,}0\%$`, R`$+20{,}0\%$`, R`$-1{,}8\%$`],
          answer: 0,
          hint: "Eltérés = (mért − jósolt) / ? · 100%. Melyik értékkel osztunk, és milyen lesz az előjel, ha kevesebbet mértél?",
          explain: R`$\text{eltérés} = \dfrac{7{,}20 - 9{,}0}{9{,}0} \cdot 100\% = -20{,}0\%$: a negatív előjel azt jelenti, hogy kevesebbet mértél a jósoltnál. A $-25{,}0\%$-nál a mért értékkel osztottál ($-1{,}8/7{,}2$) – a szabály a jósolttal osztás, és ekkora eltérésnél ez már nagyon számít. A $+20{,}0\%$ előjelhiba (jósolt − mért). A $-1{,}8\%$ a voltban mért különbség ($-1{,}8\,\text{V}$), százalékra át sem váltva. (Egy friss elem 9,3–9,6 V-ot mutat, egy lemerült 7 V alá esik – ez az elem már közel jár hozzá.)`
        },

        /* 0.7 – hibakeresés */
        {
          type: "single", shuffle: true,
          q: R`A kapcsolás: 13-as láb → 220 Ω → LED → GND, a Blink fut, a beépített „L” LED villog, a tiéd nem. Méréseid a GND-hez képest: a 13-as lábon és az ellenállás LED felőli végén is 0 és kb. 4,9 V között ugrál a feszültség; a LED másik lábán mindig 0 V. Hol a hiba?`,
          options: [
            "A LED-nél: valószínűleg fordítva áll (vagy hibás) – fordítsd meg.",
            "A programban: töltsd fel újra a Blinket.",
            "A 13-as láb tönkrement.",
            "Az ellenállás szakadt."
          ],
          answer: 0,
          hint: "Kövesd a jelet a táptól a terhelés felé. Hol van még meg a villogó feszültség, és hol tűnik el?",
          explain: R`A hiba az utolsó „jó” és az első „rossz” mérési pont között van. A villogó feszültség az ellenállás LED felőli végén még megvan, a LED túlsó lábán már nincs: a hiba a LED-nél van – a leggyakoribb ok, hogy fordítva áll (a hosszabb lábnak, az anódnak kell az ellenállás felé néznie). A program fut, hiszen a beépített LED villog, és a 13-as lábon is ott a jel. A láb sem hibás: 0 és 4,9 V között kapcsol. Ha az ellenállás szakadt volna, a LED felőli végén nem jelenne meg a villogó feszültség.`
        },

        /* 0.8 – alkalmazás */
        {
          type: "single", shuffle: true,
          q: R`Az L0.4-ben a tápmodul 5V sínjén <code>5.071</code> V-ot mérsz (DC, ±(0,8% + 5)). Biztosan több-e a sín feszültsége 5 V-nál?`,
          options: [
            "Igen: a valódi érték kb. 5,025 és 5,117 V között van (eltérés +1,4%).",
            "Nem dönthető el: a valódi érték kb. 4,980 és 5,162 V között lehet.",
            "Igen, és ezredvoltra pontosan: a feszültség 5,071 V.",
            "Nem dönthető el: a +1,4%-os eltérés kisebb, mint a műszer 0,8% + 5% = 5,8%-os pontatlansága."
          ],
          answer: 0,
          hint: "Felbontás ezen a méréshatáron, aztán Δ mindkét taggal. Hová esik a sáv alsó vége az 5 V-hoz képest?",
          explain: R`Felbontás $0{,}001\,\text{V}$: $\Delta = 0{,}008 \cdot 5{,}071 + 5 \cdot 0{,}001 \approx 0{,}0406 + 0{,}005 = 0{,}046\,\text{V}$, a valódi érték $5{,}025$ és $5{,}117\,\text{V}$ között. Az alsó vége is 5 V fölött van, tehát <b>biztosan</b> több; az eltérés $(5{,}071 - 5)/5 \cdot 100\% \approx +1{,}4\%$. A „4,980–5,162” rossz, $0{,}01\,\text{V}$-os felbontással számol ($\Delta \approx 0{,}091$). Az „ezredvoltra pontosan” a tizedesjegyeket pontosságnak hiszi – a bizonytalanság a felbontás kb. 46-szorosa. Az „5,8%” az 5 digitet 5 százaléknak veszi; az 5 digit itt csak $5 \cdot 0{,}001 = 0{,}005\,\text{V}$ (0,1%).`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
