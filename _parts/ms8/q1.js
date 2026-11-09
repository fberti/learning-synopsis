    /* ------------------------------------------------ 8.1 */
    "ms8-81": {
      title: "Kvíz – 8.1 Egymintás u-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A gép $\sigma = 10$ g szórással tölt, $\mu_0 = 500$. 16 zacskó átlaga $\bar x = 495$ g. Mennyi az u-próba statisztikája?`,
          options: [R`$z = -2$`, R`$z = -0{,}5$`, R`$z = -8$`, R`$z = -1{,}25$`],
          answer: 0,
          hint: R`Az átlag eltérését az átlag szórásával, a standard hibával kell mérni. Mennyi itt $\sigma/\sqrt n$?`,
          explain: R`$\mathrm{SE} = 10/\sqrt{16} = 2{,}5$, így $z = (495 - 500)/2{,}5 = -2$. A $-0{,}5$ a $\sigma$-val osztott eltérés – ez egy <em>zacskó</em> eltérése lenne, nem az átlagé (a szakasz első buktatója). A $-8$ úgy jön ki, ha $\sigma/n = 0{,}625$-tel osztasz: a gyök hiányzik. A $-1{,}25 = -5/4$ csak $\sqrt n$-nel oszt, a $\sigma$ kimaradt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kétoldali u-próbánál $z = -2{,}2$ jött ki. Ismert: $\Phi(-2{,}2) \approx 0{,}0139$. Mennyi a p-érték?`,
          options: [R`$\approx 0{,}028$`, R`$\approx 0{,}014$`, R`$\approx 0{,}986$`, R`$\approx 0{,}972$`],
          answer: 0,
          hint: R`Kétoldali próbánál mindkét irányú, legalább ekkora eltérés számít. Hány farokterületet kell összeadni?`,
          explain: R`Kétoldali p-érték: $2\,\Phi(-|z|) = 2 \cdot 0{,}0139 \approx 0{,}028$. A $0{,}014$ csak az egyik farok – ez a baloldali próba p-értéke lenne, kétoldalinál elfelejtetted a duplázást. A $0{,}986 = \Phi(2{,}2)$ a „rossz” oldal területe. A $0{,}972$ az $1 - p$: annak a valószínűsége, hogy az eltérés <em>kisebb</em> ennél.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató <b>előre</b> rögzítette, hogy csak a növekedés érdekli: $H_1$: $\mu \gt \mu_0$, $\alpha = 5\%$. Az u-próbánál $z = 1{,}8$. Mi a helyes döntés?`,
          options: [
            R`Elvetjük $H_0$-t, mert $1{,}8 \ge z_{0{,}95} = 1{,}645$.`,
            R`Nem vetjük el, mert $1{,}8 \lt 1{,}96$.`,
            R`Nem vetjük el, mert $z \gt 0$, és csak a negatív $z$ számít.`,
            R`Elvetjük, de csak akkor, ha a kétoldali p is 5% alatti.`
          ],
          answer: 0,
          hint: R`Jobboldali próbánál az egész $\alpha$ egyetlen farokba kerül. Melyik kvantilis tartozik hozzá?`,
          explain: R`Jobboldali 5%-os próbánál a kritikus érték $z_{0{,}95} = 1{,}645$; $1{,}8 \ge 1{,}645$ → elvetjük ($p = 1 - \Phi(1{,}8) \approx 0{,}036$). Az 1,96 a <em>kétoldali</em> 5%-os próba kvantilise – egyoldalinál a kettő összekeverése a tipikus hiba. Negatív $z$ a baloldali próbánál számít, itt épp a pozitív. A kétoldali p ($\approx 0{,}072$) itt nem érdekes: az irányt előre rögzítették, ezért az egyoldali próba a jogos.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\mu_0 = 200$, $\sigma = 6$, $n = 36$, kétoldali 5%-os u-próba. Mely $\bar x$-ekre <b>nem</b> vetjük el $H_0$-t?`,
          options: [
            R`$198{,}04 \lt \bar x \lt 201{,}96$`,
            R`$188{,}24 \lt \bar x \lt 211{,}76$`,
            R`$198{,}355 \lt \bar x \lt 201{,}645$`,
            R`$197{,}424 \lt \bar x \lt 202{,}576$`
          ],
          answer: 0,
          hint: R`Az elfogadási tartomány az átlag skáláján $\mu_0 \pm z_{1-\alpha/2} \cdot \mathrm{SE}$. Számold ki előbb az SE-t!`,
          explain: R`$\mathrm{SE} = 6/\sqrt{36} = 1$, a tartomány $200 \pm 1{,}96 \cdot 1 = (198{,}04;\ 201{,}96)$. A $(188{,}24;\ 211{,}76)$ $\sigma$-val számol $\sigma/\sqrt n$ helyett – egy zacskó, nem az átlag ingadozása. A $\pm 1{,}645$ az egyoldali 5%-os kvantilis (kétoldalinál túl szűk tartományt ad). A $\pm 2{,}576$ az 1%-os szinthez tartozik.`
        },
        {
          type: "multi",
          q: R`Egy átlagra számolt 95%-os ($z$-alapú) konfidencia-intervallum $[500{,}5;\ 507{,}5]$. $H_0$: $\mu = 500$. Mely állítások igazak? (Több jó válasz is lehet.)`,
          options: [
            R`Kétoldali 5%-os szinten elvetjük $H_0$-t.`,
            R`Kétoldali 10%-os szinten is elvetjük $H_0$-t.`,
            R`Kétoldali 1%-os szinten is biztosan elvetjük $H_0$-t.`,
            R`A kétoldali p-érték nagyobb 0,05-nél.`,
            R`Bebizonyítottuk, hogy $\mu = 504$.`
          ],
          answer: [0, 1],
          hint: R`$H_0$-t pontosan akkor nem vetjük el, ha $\mu_0$ benne van a megfelelő szintű KI-ben. Hogyan változik az intervallum szélessége a szinttel?`,
          explain: R`Az 500 nincs benne a 95%-os KI-ben → 5%-on elvetjük, tehát $p \lt 0{,}05$. A 90%-os KI ugyanakörüli, de <em>szűkebb</em>, így az 500 abból is kimarad → 10%-on is elvetjük. A 99%-os KI viszont <em>szélesebb</em>; lehet, hogy már tartalmazza az 500-at – ebből az adatból ez nem dönthető el biztosan. A KI közepe (504) csak becslés, nem bizonyított érték: a valódi $\mu$ bárhol lehet az intervallumban (sőt kívül is).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató kétoldali próbával $p = 0{,}06$-ot kap. Látja, hogy $\bar x \gt \mu_0$, ezért átvált jobboldali próbára, és „$p = 0{,}03$, szignifikáns” eredményt közöl. Mi a baj?`,
          options: [
            R`Az irányt az adat láttán választotta, így valójában kb. 10%-os, nem 5%-os elsőfajú hibával dolgozik.`,
            "Semmi: az egyoldali p mindig a kétoldali fele, ez csak egy másik számolási mód.",
            "Az egyoldali p-érték a kétoldalinak a duplája, tehát 0,12 lenne.",
            "Csak az a baj, hogy 1%-os szintet kellett volna választania."
          ],
          answer: 0,
          hint: "Mi történne, ha a $\\bar x$ a másik irányba tért volna el? Melyik próbát választotta volna akkor?",
          explain: R`Ha az irányt utólag, az adathoz igazítva választod, mindkét irányban „nyitva hagyod” az 5%-ot – a tényleges $\alpha$ így 10%. Helyesen: kétoldali $p = 0{,}06$, 5%-on nem szignifikáns. Igaz, hogy (a jó irányban) az egyoldali p a kétoldali fele, de ezt csak akkor használhatod, ha az irányt <em>előre</em> rögzítetted. Az egyoldali p nem a duplája. A szint utólagos szigorítása nem oldja meg a problémát.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány zacskó kell ahhoz, hogy az átlag standard hibája 0,5 g legyen, ha $\sigma = 10$ g?`,
          options: ["400", "20", "100", "200"],
          answer: 0,
          hint: R`Írd fel: $\sigma/\sqrt n = 0{,}5$, és fejezd ki $n$-et.`,
          explain: R`$10/\sqrt n = 0{,}5 \Rightarrow \sqrt n = 20 \Rightarrow n = 400$. A 20 a $\sqrt n$ – a négyzetre emelés maradt ki (vagy $\sigma/n$-nel számoltál). A 100 az 1 grammos SE-hez kell: feleakkora SE-hez négyszer annyi adat kell, nem kétszer. A 200 a $\sigma^2/n = 0{,}5$ egyenlet megoldása – szórásnégyzetet vettél szórás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 10$, $\mu_0 = 500$. Legalább hány zacskó kell, hogy egy 4 grammos hiány ($\bar x = 496$) kétoldali 5%-os u-próbán szignifikáns legyen?`,
          options: ["25", "24", "17", "5"],
          answer: 0,
          hint: R`A feltétel: $\dfrac{4}{10/\sqrt n} \ge 1{,}96$. Oldd meg $n$-re, és gondold meg, merre kell kerekíteni!`,
          explain: R`$\sqrt n \ge 1{,}96 \cdot 10/4 = 4{,}9 \Rightarrow n \ge 24{,}01$, tehát <b>25</b> zacskó kell (a szakasz is ezt látta: 25 zacskónál $z = -2$, épp szignifikáns). A 24 lefelé kerekít – 24 zacskónál $|z| \approx 1{,}96$ alá esik. A 17 az egyoldali kvantilissel (1,645) jön ki, pedig a próba kétoldali. Az 5 a $\sqrt n$ felkerekítve: a négyzetre emelés maradt ki.`
        }
      ]
    },

    /* ------------------------------------------------ 8.2 */
    "ms8-82": {
      title: "Kvíz – 8.2 Kétmintás u-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két független mérés szórása 6 és 8. Mennyi a különbségük szórása?`,
          options: ["10", "2", "14", "100"],
          answer: 0,
          hint: R`Független változóknál nem a szórások, hanem a szórásnégyzetek adódnak össze – a különbségnél is.`,
          explain: R`$D(X - Y) = \sqrt{36 + 64} = 10$ („Pitagorasz szerint”). A 2 a szórások kivonása – de a két véletlen hiba nem oltja ki egymást. A 14 a szórások összege. A 100 a különbség szórás<em>négyzete</em> – a végén gyököt kell vonni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gép: $\sigma_1 = 12$, $n_1 = 16$; B gép: $\sigma_2 = 8$, $n_2 = 16$ (független minták). Mennyi az $\mathrm{SE}(\bar X_1 - \bar X_2)$?`,
          options: [R`$\sqrt{13} \approx 3{,}61$`, "5", "1", "13"],
          answer: 0,
          hint: R`Számold ki gépenként a $\sigma_i^2/n_i$-t, és csak utána kombináld őket.`,
          explain: R`$\sigma_1^2/n_1 = 144/16 = 9$, $\sigma_2^2/n_2 = 64/16 = 4$; $\mathrm{SE} = \sqrt{9 + 4} = \sqrt{13} \approx 3{,}61$. Az 5 a két standard hiba ($3 + 2$) összege – a szakasz leggyakoribb buktatója. Az 1 a standard hibák különbsége. A 13 a gyökvonás nélküli szórásnégyzet.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma_1 = 15$, $n_1 = 25$, $\bar x_1 = 62$; $\sigma_2 = 12$, $n_2 = 9$, $\bar x_2 = 50$. Mennyi a kétmintás u-próba statisztikája ($H_0$: $\mu_1 = \mu_2$)?`,
          options: [R`$z = 2{,}4$`, R`$z \approx 1{,}71$`, R`$z = 12$`, R`$z = 0{,}48$`],
          answer: 0,
          hint: R`$\sigma_1^2/n_1$ és $\sigma_2^2/n_2$ itt is kerek szám. Utána: különbség osztva a standard hibával.`,
          explain: R`$\mathrm{SE} = \sqrt{225/25 + 144/9} = \sqrt{9 + 16} = 5$, $z = 12/5 = 2{,}4$ (kétoldali $p \approx 0{,}016$). Az $1{,}71 = 12/(3 + 4)$ a standard hibákat adja össze. A $12 = 12/(4 - 3)$ kivonja őket. A $0{,}48 = 12/25$ elfelejtette a gyökvonást.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gép összehasonlításánál (kétoldali kérdés, $\alpha = 5\%$) $z = -1{,}8$ jött ki. Ismert: $\Phi(-1{,}8) \approx 0{,}036$. Mi a p-érték és a döntés?`,
          options: [
            R`$p \approx 0{,}072$ – nem vetjük el $H_0$-t.`,
            R`$p \approx 0{,}036$ – elvetjük $H_0$-t.`,
            R`$p \approx 0{,}072$ – elvetjük $H_0$-t.`,
            R`$p \approx 0{,}964$ – nem vetjük el $H_0$-t.`
          ],
          answer: 0,
          hint: R`A kérdés kétoldali. Hány farok számít bele a p-értékbe?`,
          explain: R`Kétoldalinál $p = 2\,\Phi(-1{,}8) \approx 0{,}072 \gt 0{,}05$ → nem vetjük el; ugyanezt adja $|z| = 1{,}8 \lt 1{,}96$. A 0,036 az egyoldali p – azt csak akkor használhatnád, ha az irányt előre rögzítetted volna. A „0,072, elvetjük” a p-t jól számolja, de rosszul dönt. A 0,964 a $\Phi(1{,}8)$, a rossz oldal területe. Szövegesen: 5%-on nem mutatható ki, hogy a gépek eltérnek – ami nem azt jelenti, hogy egyformán töltenek.`
        },
        {
          type: "multi",
          q: R`Melyek a kétmintás u-próba feltételei? (Több jó válasz is lehet.)`,
          options: [
            "A két minta egymástól független.",
            R`A sokasági szórások ($\sigma_1$, $\sigma_2$) ismertek.`,
            "Normális sokaságok – vagy elég nagy minták.",
            R`A két minta egyforma nagy ($n_1 = n_2$).`,
            R`A két szórás egyenlő ($\sigma_1 = \sigma_2$).`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg az SE képletét: kell-e benne $n_1 = n_2$ vagy $\sigma_1 = \sigma_2$? És mire épül a $D^2(X - Y) = D^2(X) + D^2(Y)$ tétel?`,
          explain: R`A tétel <b>függetlenséget</b> kíván (különben a kovariancia nem 0); a $z$ képletében a <b>valódi</b> szórások szerepelnek; és a $z$ normalitásához normális sokaság vagy (CHT) nagy minta kell. A mintaméretek és a szórások bármilyenek lehetnek: a $\sqrt{\sigma_1^2/n_1 + \sigma_2^2/n_2}$ képlet ezt kezeli (a példában is 25 és 16 zacskó, 10 és 8 g szórás volt).`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanazt a 20 embert mérjük meg egy edzés előtt és után. Miért nem jó itt az $\mathrm{SE} = \sqrt{\sigma_1^2/n + \sigma_2^2/n}$ képlet?`,
          options: [
            R`Mert a két számsor nem független: ugyanaz az ember kétszer szerepel, a kovariancia nem 0.`,
            R`Mert a két mintának egyforma a mérete, és a képlet eltérő méreteket kíván.`,
            R`Mert a szórásokat ilyenkor ki kell vonni egymásból.`,
            R`Mert 20 fő kevés, a képlet csak 100 fölött érvényes.`
          ],
          answer: 0,
          hint: R`Idézd fel, miből jön a szórásnégyzetek összeadása: $D^2(X - Y) = D^2(X) + D^2(Y) - 2\,\mathrm{cov}(X, Y)$.`,
          explain: R`A képlet a $-2\,\mathrm{cov}$ tag elhagyásával készült, ami csak <b>független</b> mintáknál jogos. Ha ugyanazt az embert mérjük kétszer, az eredményei együtt mozognak, a kovariancia pozitív – erre a páros próba való (8.4). A képlet egyforma mintaméretekkel is működik. A szórásokat sosem kivonjuk. A mintaméret itt nem számít: a baj a függetlenség hiánya.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két egyforma gép ($\sigma = 10$ mindkettőnél), gépenként $n$ zacskó. Legalább mekkora $n$ kell <b>gépenként</b>, hogy egy 4 grammos különbség kétoldali 5%-on szignifikáns legyen?`,
          options: ["49", "25", "34", "98"],
          answer: 0,
          hint: R`Két csoport különbségének SE-je $\sigma\sqrt{2/n}$. A feltétel: $\dfrac{4}{10\sqrt{2/n}} \ge 1{,}96$.`,
          explain: R`$\sqrt n \ge \dfrac{1{,}96 \cdot 10 \cdot \sqrt 2}{4} \approx 6{,}93 \Rightarrow n \ge 48{,}02$, tehát gépenként <b>49</b>. A 25 az egymintás képletből jön ($\sigma/\sqrt n$, a $\sqrt 2$ nélkül) – két csoport összehasonlításához több adat kell. A 34 az egyoldali 1,645-tel számol. A 98 a két gép együtt – a kérdés gépenkénti számot kért.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik helyzetben <b>nem</b> használható a kétmintás u-próba?`,
          options: [
            "Egy új gépet hasonlítasz a régihez; az új gép szórását senki sem ismeri, és csak 8 zacskód van róla.",
            "Két régóta figyelt gép, mindkettő szórása évek óta ismert, gépenként 25 zacskó.",
            "Két osztály IQ-átlaga (a teszt szórása definíció szerint 15), osztályonként 30 tanuló.",
            "Két ismert szórású gép, de az egyikről 25, a másikról 16 zacskó van."
          ],
          answer: 0,
          hint: "Mi az u-próba „nagy gyengesége” a szakasz 3. lépése szerint?",
          explain: R`Az u-próba a sokasági szórás ismeretét kívánja. Új gépnél nincs honnan tudni; a mintából becsült $s$-sel – kis mintán – már $t$-eloszlás kell (8.3, 8.5). Az ismert szórású gépek és az IQ-teszt (szórása 15) jó példák az u-próbára. Az eltérő mintaméret nem akadály.`
        }
      ]
    },

    /* ------------------------------------------------ 8.3 */
    "ms8-83": {
      title: "Kvíz – 8.3 Egymintás t-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Adatok: 6, 8, 10, 12, 14; $H_0$: $\mu = 7$, a szórás ismeretlen. Mennyi a $t$-statisztika?`,
          options: [R`$t \approx 2{,}12$`, R`$t \approx 2{,}37$`, R`$t \approx 0{,}95$`, R`$t \approx 1{,}90$`],
          answer: 0,
          hint: R`Előbb $\bar x$, utána $s^2 = \sum (x_i - \bar x)^2/(n-1)$, végül $s/\sqrt n$. Mivel osztasz a szórásnégyzetnél?`,
          explain: R`$\bar x = 10$, az eltérések négyzetösszege $16 + 4 + 0 + 4 + 16 = 40$, $s^2 = 40/4 = 10$, $s \approx 3{,}16$; $\mathrm{SE} = \sqrt{10/5} = \sqrt 2 \approx 1{,}41$; $t = 3/1{,}41 \approx 2{,}12$ ($df = 4$). A 2,37 $n$-nel osztott szórásnégyzettel ($s^2 = 8$) számol – a próba a korrigált $s$-sel működik. A 0,95 $s$-sel oszt $s/\sqrt n$ helyett. Az 1,90 $\sqrt{n-1}$-gyel osztja $s$-t a $\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egymintás t-próba, $n = 10$, kétoldali 5%. Táblázat: $t_{9;\,0{,}95} = 1{,}833$, $t_{9;\,0{,}975} = 2{,}262$, $t_{10;\,0{,}975} = 2{,}228$. Melyik a kritikus érték?`,
          options: ["2,262", "2,228", "1,833", "1,96"],
          answer: 0,
          hint: R`Két dolgot kell eldönteni: hány a szabadságfok ($n$ vagy $n - 1$?), és melyik kvantilis tartozik a kétoldali 5%-hoz.`,
          explain: R`$df = n - 1 = 9$, kétoldali 5% → 97,5%-os kvantilis: $t_{9;\,0{,}975} = 2{,}262$. A 2,228 rossz szabadságfokkal ($n = 10$) számol. Az 1,833 az egyoldali 5%-os kvantilis. Az 1,96 a normális eloszlásé – becsült szórásnál, kis mintán ez túl kicsi kritikus értéket ad, és több téves riasztást.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egymintás t-próba, $n = 5$, $t = 2{,}65$, kétoldali 5%. ($t_{4;\,0{,}975} = 2{,}776$, $t_{5;\,0{,}975} = 2{,}571$.) Mi a döntés?`,
          options: [
            R`Nem vetjük el $H_0$-t, mert $2{,}65 \lt t_{4;\,0{,}975} = 2{,}776$.`,
            R`Elvetjük, mert $2{,}65 \ge 1{,}96$.`,
            R`Elvetjük, mert $2{,}65 \ge t_{5;\,0{,}975} = 2{,}571$.`,
            R`Nem dönthető el, mert $\sigma$ ismeretlen.`
          ],
          answer: 0,
          hint: R`Hány szabadságfoka van az egymintás $t$-próbának 5 adatnál?`,
          explain: R`$df = n - 1 = 4$, és $2{,}65 \lt 2{,}776$ → nem vetjük el ($p \approx 0{,}057$). Az 1,96-tal való összevetés a normális eloszlást használja becsült szórás mellett – kis mintán túl magabiztos. A $t_{5}$ a rossz szabadságfok ($n$ az $n - 1$ helyett): itt épp megfordítaná a döntést. Az ismeretlen $\sigma$ nem akadály – épp erre való a $t$-próba.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n = 16$, $\bar x = 497$, $\mu_0 = 500$. Ha $\sigma = 6$ ismert, az u-próba elveti $H_0$-t ($z = -2$). Ha a 6 a minta szórása ($s$), a $t$-próba nem veti el ($t = -2$). Miért?`,
          options: [
            R`Mert a becsült szórás is ingadozik: a $t_{15}$-eloszlás farka vastagabb, a kritikus érték 2,131 az 1,96 helyett.`,
            R`Mert a $t$-próba rosszabb, gyengébb próba, ezért kerülni kell.`,
            R`Mert a $t$-próba szabadságfoka 16, és $t_{16}$-ból számolva más jön ki.`,
            R`Mert a $t$ értéke valójában más: $s/\sqrt{n-1}$-gyel kell osztani.`
          ],
          answer: 0,
          hint: R`A statisztika értéke ugyanaz. Mi változik a viszonyítási eloszlásban, ha a nevező is véletlen?`,
          explain: R`A $t$ „beárazza”, hogy $s$ véletlenül kicsi is lehet: vastagabb farok, nagyobb kritikus érték ($t_{15;\,0{,}975} = 2{,}131$), $p \approx 0{,}064$ a $0{,}046$ helyett. Nem gyengébb próba: pontosan annyiszor riaszt tévesen, amennyit $\alpha$ ígér – az u-próba becsült szórással többször. A szabadságfok $n - 1 = 15$. A nevező $s/\sqrt n$, nem $s/\sqrt{n-1}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`QQ-ábrát készítesz 10 adatból. Melyik elméleti $z$ tartozik a legkisebb adathoz, ha az $i$-edikhez az $\frac{i - 0{,}5}{n}$ rendű normális kvantilist rendeljük?`,
          options: [R`$-1{,}645$`, R`$-1{,}28$`, R`$-1{,}96$`, R`$0{,}05$`],
          answer: 0,
          hint: R`Számold ki a rendet: $(1 - 0{,}5)/10$. Melyik standard normális kvantilis tartozik ehhez?`,
          explain: R`A rend $0{,}5/10 = 0{,}05$, a hozzá tartozó kvantilis $z_{0{,}05} = -1{,}645$. A $-1{,}28$ a $0{,}1 = 1/n$ rendű kvantilis – a $-0{,}5$ korrekció maradt ki. A $-1{,}96$ a 0,025-ös kvantilis. A 0,05 maga a rend (valószínűség), nem a $z$-érték.`
        },
        {
          type: "match",
          q: R`Párosítsd a QQ-ábra képét a jelentésével!`,
          pairs: [
            ["A pontok nagyjából egy egyenesen fekszenek.", "összefér a normalitással"],
            ["Mindkét vége kifelé hajlik az egyenestől.", "vastag farkú eloszlás"],
            ["Felfelé görbülő ív, a jobb vég egyre meredekebben fut fel.", "jobbra ferde eloszlás"],
            ["Egy-két pont messze esik az egyenestől, a többi rajta van.", "kiugró értékek"]
          ],
          hint: "A QQ-ábra az adat kvantiliseit veti össze a normális eloszlás kvantiliseivel. Mit jelent, ha a szélső adatok a vártnál messzebb vannak – az egyik oldalon vagy mindkettőn?",
          explain: R`Egyenes: az adat kvantilisei arányosak a normális kvantilisekkel. Ha mindkét szélen messzebb vannak az adatok a vártnál, több a szélsőérték – vastag farok. Ha csak a jobb oldalon nyúlnak el, hosszú jobb farok: jobbra ferde (jövedelem, várakozási idő). Egy-két kilógó pont kiugró érték – nézd meg, mi okozza! Vigyázz: 5–10 pontos ábra normális adatból is meglepően görbe lehet.`
        },
        {
          type: "multi",
          q: R`A szakasz hüvelykujjszabálya (OI) szerint melyik esetben bízhatsz az egymintás $t$-próbában? (Több jó válasz is lehet.)`,
          options: [
            R`$n = 12$, közel szimmetrikus adatok, kiugró érték nélkül.`,
            R`$n = 200$ várakozási idő, mérsékelten jobbra ferde, kiugró érték nincs.`,
            R`$n = 12$ fizetési adat, köztük a vezérigazgatóé.`,
            R`10 embert háromszor mértél meg, és a 30 mérést független adatként kezeled.`,
            R`$n = 8$, erősen jobbra ferde adatok.`
          ],
          answer: [0, 1],
          hint: R`$n \lt 30$: ne legyen egyértelmű kiugró érték, és ne legyen erősen ferde. $n \ge 30$: ne legyen extrém kiugró érték. És mi a még fontosabb feltétel a normalitásnál?`,
          explain: R`A 12 szimmetrikus adat és a 200 mérsékelten ferde adat (CHT!) rendben van. A 12 fizetés közt egy egyértelmű kiugró érték van, a 8 erősen ferde adat kis minta – mindkettőhöz nemparaméteres próba vagy bootstrap illik. A 30 mérés nem független: egy emberen belül hasonlók, a valódi információ inkább 10 adatnyi, a 30-cal számolt SE és p-érték túl kicsi lesz. A függetlenséget nem ábra, hanem a mintavétel módja dönti el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az új gép 5 zacskójánál ($t = -3{,}83$) valaki a becsült szórással, de normális eloszlással számolta a p-értéket, és $p \approx 0{,}0001$-et kapott (helyesen $p \approx 0{,}019$). Mi következik ebből általában?`,
          options: [
            R`Kis mintán becsült szórással az u-próba túl kicsi p-értéket ad: többször riaszt tévesen, mint amit $\alpha$ ígér.`,
            R`A normális eloszlás pontosabb, ezért a 0,0001 a helyes érték.`,
            R`A két p-érték csak kerekítésben tér el, a döntés mindig ugyanaz.`,
            R`A $t$-eloszlás vékonyabb farkú, ezért ad nagyobb p-értéket.`
          ],
          answer: 0,
          hint: R`Öt adatból mennyire megbízható a szórásbecslés? Melyik eloszlás veszi ezt figyelembe?`,
          explain: R`A normális eloszlás úgy tesz, mintha $s = \sigma$ biztosan igaz lenne; öt adatnál ez nagyon bizonytalan. Ezért a $z$-alapú p-érték itt kb. 150-szer kisebb a helyesnél, és általában is több téves riasztást ad. A „csak kerekítés” nem igaz: a 8.3-b példájában ($t = -2$, $n = 16$) a döntés is megfordul. A $t$-eloszlás farka <em>vastagabb</em>, nem vékonyabb – ezért nagyobb a p.`
        }
      ]
    },

    /* ------------------------------------------------ 8.4 */
    "ms8-84": {
      title: "Kvíz – 8.4 Páros t-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Öt beteg vérnyomáscsökkenése (előtte − utána, Hgmm): 1, 5, 3, 7, 4. Mennyi a páros $t$-próba statisztikája ($H_0$: $\mu_d = 0$)?`,
          options: [R`$t = 4$`, R`$t \approx 4{,}47$`, R`$t \approx 1{,}79$`, R`$t = 0{,}8$`],
          answer: 0,
          hint: R`Kezeld a különbségeket egyetlen mintaként: $\bar d$, $s_d$ ($n - 1$-gyel), majd $s_d/\sqrt n$.`,
          explain: R`$\bar d = 20/5 = 4$; az eltérések $-3, 1, -1, 3, 0$, négyzetösszegük 20, $s_d^2 = 20/4 = 5$, $s_d \approx 2{,}24$; $\mathrm{SE} = \sqrt{5/5} = 1$, $t = 4$ ($df = 4$; $4 \ge 2{,}776$ → kétoldali 5%-on elvetjük, $p \approx 0{,}016$). A 4,47 $n$-nel osztott szórásnégyzettel ($s_d^2 = 4$) számol. Az 1,79 $s_d$-vel oszt a standard hiba helyett. A 0,8 a szórásnégyzettel oszt ($4/5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`8 dolgozó írta meg a betanítás előtti tesztet, de közülük csak 7 az utánit. Hány szabadságfokú a páros $t$-próba?`,
          options: ["6", "7", "13", "14"],
          answer: 0,
          hint: R`Páros próbát csak teljes párokkal lehet végezni. Hány teljes pár van, és mennyi a különbségek egymintás $t$-próbájának $df$-je?`,
          explain: R`Csak a 7 teljes pár használható (a kiesett dolgozó „előtte” értékének nincs párja), így $df = 7 - 1 = 6$. A 7 vagy az összes dolgozóval ($8 - 1$) számol, vagy $n$-nel $n - 1$ helyett. A 13 ($8 + 7 - 2$) és a 14 a két független mintás próba szabadságfoka lenne – de az adat páros.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hat dolgozó példájában a páros próba $t \approx 3{,}22$-t ($p \approx 0{,}023$) ad, a két független mintás elemzés ugyanarra a 3 pontos javulásra $t \approx 0{,}43$-at ($p \approx 0{,}68$). Mi a különbség oka?`,
          options: [
            R`A független elemzés az emberek közti nagy szóródást (45–80 pont) is a zajhoz számolja; a páros elemzésben ez kiesik, mert mindenki önmagához hasonlít.`,
            R`A páros próbának több a szabadságfoka, ezért kisebb a kritikus érték.`,
            R`A páros próbánál nagyobb az átlagos különbség, mint a független elemzésnél.`,
            R`A független elemzés egyoldali, a páros kétoldali.`
          ],
          answer: 0,
          hint: R`Ugyanaz a 3 pontos átlagos különbség – akkor csak a nevező, a standard hiba térhet el. Mi kerül bele az egyik és a másik esetben?`,
          explain: R`A számláló mindkétszer 3. A független SE ($\approx 7{,}05$) a két számsor teljes szórásából jön, amelyben az emberek közti óriási különbség benne van; a páros SE ($\approx 0{,}93$) csak a javulások szórásából. Képletben: $D^2(Y - X) = D^2(X) + D^2(Y) - 2\,\mathrm{cov}(X, Y)$, és itt a kovariancia nagy ($r \approx 0{,}985$). A páros próbának <em>kevesebb</em> a szabadságfoka (5 a 10 helyett), mégis erősebb. Az átlagos különbség ugyanaz, és mindkét elemzés kétoldali.`
        },
        {
          type: "set",
          q: R`Melyik elrendezésben páros az adat? Jelöld meg mindet!`,
          items: [
            "15 termék ára két üzletben",
            "10 ikerpár: egyik testvér A, másik B étrendet kap",
            "20 beteg kap gyógyszert, másik 20 placebót",
            "egy gyár 30 nappali és 25 éjszakai műszakos dolgozója",
            "két osztály dolgozatai, névsor szerint egymás mellé írva"
          ],
          answer: ["15 termék ára két üzletben", "10 ikerpár: egyik testvér A, másik B étrendet kap"],
          hint: R`Kérdezd meg: „Van-e értelme sorról sorra kivonni?” – azaz minden sor ugyanarról (vagy egy illesztett) egységről szól?`,
          explain: R`Páros: a termékek (termékenként egy pár) és az ikrek (illesztett párok). A gyógyszer/placebo két különböző csoport – független. A nappali/éjszakai műszak eltérő létszámú, különböző emberek – független. A névsor szerinti „párosítás” tetszőleges: más sorrendben más különbségek jönnének ki, tehát nincs értelme sorról sorra kivonni – független mintás próba kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Előtte és utána a pontszámok szórása egyaránt 5, a korrelációjuk $r = 0{,}82$. Mennyi a különbségek szórása?`,
          options: ["3", R`$\approx 7{,}07$`, "0", R`$\approx 9{,}54$`],
          answer: 0,
          hint: R`$D^2(Y - X) = D^2(X) + D^2(Y) - 2\,r\,D(X)\,D(Y)$. Melyik előjel tartozik a kovarianciához?`,
          explain: R`$\sqrt{25 + 25 - 2 \cdot 0{,}82 \cdot 5 \cdot 5} = \sqrt{50 - 41} = 3$. A 7,07 $= \sqrt{50}$ a független eset – a korrelációt figyelmen kívül hagyja. A 0 a szórások kivonása. A 9,54 $+2\,\mathrm{cov}$-val számol: az az összeg szórása lenne, nem a különbségé. A páros terv itt kb. 2,4-szer kisebb szórást ad, mint a független.`
        },
        {
          type: "single", shuffle: true,
          q: R`Páros $t$-próba: a kétoldali p-érték 0,04, és $t \gt 0$ (javulás). A kutató <b>előre</b> rögzítette, hogy csak a javulás érdekli ($H_1$: $\mu_d \gt 0$). Mennyi az egyoldali p-érték?`,
          options: ["0,02", "0,08", "0,04", "0,98"],
          answer: 0,
          hint: R`A $t$-eloszlás szimmetrikus. A kétoldali p a két farok összege – hány farok kell most?`,
          explain: R`Csak a jobb farok számít: $0{,}04/2 = 0{,}02$ (ahogy a betanítási példában is: kétoldali 0,023 → egyoldali 0,012). A 0,08 duplázza a már kétoldali p-t. A 0,04 a kétoldali érték. A 0,98 a másik irányú ($H_1$: $\mu_d \lt 0$) egyoldali p lenne: $1 - 0{,}02$. Az egyoldali p-t csak előre rögzített irány mellett használhatod.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cég a 10 leggyengébb üzletében vezet be új rendszert; utána a páros $t$-próba szignifikáns javulást mutat. Mi a legfontosabb kifogás?`,
          options: [
            "A javulás regresszió a középhez is lehet, és kontrollcsoport nélkül nem tudni, hogy a rendszer okozta-e.",
            "Páros próba helyett két független mintás próba kellett volna.",
            "10 üzletnél a páros próba nem végezhető el.",
            "A páros próba csak emberekre alkalmazható, üzletekre nem."
          ],
          answer: 0,
          hint: "Mi történik átlagosan azokkal, akiket egy véletlenül rossz mérés alapján választottunk ki?",
          explain: R`A leggyengébbeknek kiválasztott üzletek eredménye a következő mérésnél átlagosan akkor is javulna, ha a rendszer semmit sem ér – ez a regresszió a középhez. Ráadásul az előtte–utána tervben nincs kontroll: a szezon, az idő múlása is okozhat változást. A páros próba maga jó (ugyanaz az üzlet kétszer) – csak azt mondja meg, hogy <em>változott</em> valami, nem azt, hogy <em>mitől</em>. 10 pár elég a próbához, és az egység lehet üzlet, termék, ember is.`
        }
      ]
    },
