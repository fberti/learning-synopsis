/* =========================================================
   Matematikai statisztika 8. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 8.5 */
    "ms8-85": {
      title: "Kvíz – 8.5 Kétmintás t-próba és Welch-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két független csoport: $n_1 = 5$, $s_1^2 = 10$; $n_2 = 9$, $s_2^2 = 4$. Mennyi a közös szórásnégyzet, $s_p^2$?`,
          options: [R`$s_p^2 = 6$`, R`$s_p^2 = 7$`, R`$s_p^2 \approx 5{,}14$`, R`$s_p^2 \approx 6{,}14$`],
          answer: 0,
          hint: R`Súlyozott átlag – de mi a súly: a csoportméret vagy a szabadságfok? És mivel osztasz a végén?`,
          explain: R`$s_p^2 = \dfrac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} = \dfrac{4 \cdot 10 + 8 \cdot 4}{12} = \dfrac{72}{12} = 6$ – közelebb a nagyobb minta 4-éhez. A 7 a sima átlag $(10 + 4)/2$: nem veszi figyelembe, hogy a második csoport nagyobb. Az $5{,}14 = 72/14$ jó számlálóval, de $n_1 + n_2$-vel oszt. A $6{,}14 = (5 \cdot 10 + 9 \cdot 4)/14$ a szabadságfok helyett a csoportméretekkel súlyoz.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n_1 = n_2 = 8$, $\bar x_1 - \bar x_2 = 6$, $s_1 = s_2 = 4$. Mennyi a kétmintás (közös szórásos) $t$, és hány a szabadságfok?`,
          options: [R`$t = 3$, $df = 14$`, R`$t = 3$, $df = 16$`, R`$t \approx 2{,}12$, $df = 14$`, R`$t \approx 4{,}24$, $df = 7$`],
          answer: 0,
          hint: R`$s_p = 4$. Az SE-ben a szórásnégyzet adódik össze: $s_p\sqrt{1/n_1 + 1/n_2}$. Hány átlagot becsültél?`,
          explain: R`$\mathrm{SE} = 4\sqrt{2/8} = 2$, $t = 6/2 = 3$, $df = 8 + 8 - 2 = 14$ ($p \approx 0{,}01$). A $df = 16$ elfelejti, hogy mindkét átlag „elvisz” egy szabadságfokot. A $2{,}12$ az SE-ket adja össze ($4/\sqrt8 + 4/\sqrt8 \approx 2{,}83$) a szórásnégyzetek helyett. A $4{,}24$ csak egy csoport SE-jével ($4/\sqrt 8$) oszt, mintha egymintás próba lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Welch-próba: $n_1 = 9$, $s_1 = 3$; $n_2 = 12$, $s_2 = 6$; $\bar x_1 - \bar x_2 = 5$. Mennyi az SE és a $t$?`,
          options: [
            R`$\mathrm{SE} = 2$, $t = 2{,}5$`,
            R`$\mathrm{SE} \approx 2{,}73$, $t \approx 1{,}83$`,
            R`$\mathrm{SE} \approx 0{,}91$, $t \approx 5{,}48$`,
            R`$\mathrm{SE} \approx 6{,}71$, $t \approx 0{,}75$`
          ],
          answer: 0,
          hint: R`Ugyanaz a képlet, mint a kétmintás u-próbánál, csak $\sigma$ helyett $s$: $\sqrt{s_1^2/n_1 + s_2^2/n_2}$. Négyzetre emelted a szórásokat? Osztottál $n$-nel?`,
          explain: R`$\mathrm{SE} = \sqrt{9/9 + 36/12} = \sqrt{1 + 3} = 2$, $t = 5/2 = 2{,}5$ (Welch-$df \approx 17$). A $2{,}73 = 1 + \sqrt3$ a két SE összege – a szórásnégyzetek adódnak össze, nem a szórások. A $0{,}91 = \sqrt{3/9 + 6/12}$ a szórásokat nem emeli négyzetre. A $6{,}71 = \sqrt{9 + 36}$ elfelejti az $n$-nel osztást: ez az egyedi értékek különbségének szórása, nem az átlagoké.`
        },
        {
          type: "single", shuffle: true,
          q: R`Welch-próbát végzel $n_1 = 6$ és $n_2 = 15$ fős csoporttal. Melyik szabadságfok jöhet ki a Welch–Satterthwaite-képletből?`,
          options: [R`$11{,}3$`, R`$4$`, R`$19{,}5$`, R`$21$`],
          answer: 0,
          hint: R`A Welch-$df$ két határ közé esik: az egyik a kisebb csoportból jön, a másik a közös szórásos próba szabadságfoka.`,
          explain: R`A Welch-$df$ $\min(n_1, n_2) - 1 = 5$ és $n_1 + n_2 - 2 = 19$ közé esik, és általában nem egész: a 11,3 lehetséges. A 4 kisebb, mint a kisebb csoport $n - 1$-e – ennél kevesebb nem lehet. A 19,5 túllépi a közös szórásos próba 19-ét, a 21 pedig $n_1 + n_2$ – egyik sem jöhet ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kis csoport nagy szórással ($n_1 = 6$, $s_1 = 15$), nagy csoport kis szórással ($n_2 = 30$, $s_2 = 4$). Melyik próbát válaszd az átlagok összehasonlítására, és miért?`,
          options: [
            "Welch-próbát: a közös szórásnégyzet a nagy, kis szórású csoport felé húz, alábecsüli az SE-t, és a próba túl gyakran riaszt.",
            "Közös szórásos t-próbát: nagyobb a szabadságfoka, ezért erősebb.",
            "Előbb F-próbát; ha az nem szignifikáns, közös szórásos t-próbát.",
            "Közös szórásos t-próbát, mert a Welch-próba csak egyforma csoportméretnél használható."
          ],
          answer: 0,
          hint: R`Melyik csoport szórásnégyzete dominálja $s_p^2$-et, és mekkora a kis csoport valódi bizonytalansága?`,
          explain: R`Ez az 5 vs 20 fős példa helyzete: a kisebb csoport szórása a nagyobb. Itt $s_p^2 = (5 \cdot 225 + 29 \cdot 16)/34 \approx 46{,}7$ a 16 felé húz, a közös SE kb. 3,06, a Welch-SE kb. 6,17 – a közös próba a felére becsüli a bizonytalanságot, és igaz $H_0$ mellett is sokszor riaszt (a szöveg példájában 28%-ban 5% helyett). A nagyobb $df$ nem ér semmit, ha az SE rossz. Az F-próbás előszűrés kis mintán gyenge és normalitásérzékeny – egyből Welch kell. A Welch épp eltérő csoportméreteknél és szórásoknál hasznos.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a közös szórásos t és a Welch-próba választásáról? (Több jó válasz is lehet.)`,
          options: [
            "Ha a szórások valóban egyformák, a Welch-próba szinte semmit sem veszít.",
            R`Egyforma csoportméretnél ($n_1 = n_2$) a közös szórásos próba is elég robusztus.`,
            R`A Welch-SE-hez a Welch-$df$ tartozik; az $n_1 + n_2 - 2$ vele túl liberális.`,
            "A szórások egyenlőségét érdemes előbb F-próbával ellenőrizni, és csak utána választani.",
            "Ha a kisebb csoport szórása a nagyobb, a közös szórásos próba túl óvatos lesz."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a „kétség esetén Welch” hüvelykujjszabályra és az 5 vs 20 fős szimulációra: melyik irányba téved a közös szórásos próba?",
          explain: R`Az első három igaz: egyenlő szórásnál a Welch alig gyengébb; egyforma $n$-nél a közös szórásos próba is jól viselkedik; a Welch-SE-t a nagyobb $n_1 + n_2 - 2$ szabadságfokkal párosítani túl kis kritikus értéket ad. Az F-próbás előszűrés rossz ötlet: kis mintán gyenge, nem normális adaton megbízhatatlan, és a két lépés együtt rosszabb, mint az egyből választott Welch. Ha a <em>kisebb</em> csoport szórása a nagyobb, a közös próba nem óvatos, hanem <b>túl liberális</b> (túl sokat riaszt); a túl óvatos eset a fordított (nagy csoport, nagy szórás).`
        },
        {
          type: "single", shuffle: true,
          q: R`Két tanítási módszer: az A csoport javulása egymintás próbával szignifikáns ($p = 0{,}03$), a B csoporté nem ($p = 0{,}08$). Mit mondhatsz?`,
          options: [
            "Ebből nem tudjuk, különbözik-e a két módszer – a különbséget magát kell kétmintás próbával tesztelni.",
            "Az A módszer szignifikánsan jobb a B-nél.",
            "A B módszer hatástalan, mert nem szignifikáns.",
            R`A két p-érték különbsége ($0{,}05$) a két módszer különbségének p-értéke.`
          ],
          answer: 0,
          hint: "Melyik hipotézist tesztelte a két egymintás próba – és melyiket kérdezed valójában?",
          explain: R`A két próba két külön kérdésre felelt („javult-e A?”, „javult-e B?”); a kérdés viszont az, hogy <b>különbözik-e</b> a kettő. A $p = 0{,}03$ és $0{,}08$ nagyon hasonló eredmény, a különbségük könnyen lehet véletlen. A „nem szignifikáns” nem jelenti, hogy B hatástalan (lehet, hogy csak kicsi a minta). A p-értékek nem vonhatók ki egymásból. Helyesen: a két csoport javulásait kétmintás (Welch-) próbával kell összevetni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 3 + 3 dolgozó adatára (7, 9, 11 vs 3, 5, 4) a kétmintás t-próba $p \approx 0{,}018$-at ad, a permutációs próba $p = 0{,}10$-et. Mi a magyarázat?`,
          options: [
            "A t-próba a normalitás feltevésével „pótolja” a hiányzó adatot; ha a feltevés igaz, jogosan erősebb, ha nem, félrevezet. A permutációs próba 20 felosztásnál 0,10-nél kisebbet nem is adhat.",
            "A t-próba hibásan számolt: 6 adatnál a t-eloszlás nem használható.",
            "A permutációs próba elfelejtette duplázni a p-értéket, ezért pontatlan.",
            "A két p-érték ugyanazt jelenti, csak más skálán."
          ],
          answer: 0,
          hint: R`Hányféleképpen osztható szét 6 adat 3–3-ra? Mekkora lehet így a legkisebb kétoldali p? És mit tesz fel a t-próba, amit a permutációs nem?`,
          explain: R`$\binom63 = 20$ felosztás van; a megfigyelt (és a tükörképe) a két legszélsőségesebb, így a kétoldali p legalább $2/20 = 0{,}10$. A t-próba ($t = 3{,}87$, $df = 4$) a normális modellből „tudja”, mi lenne több adatnál – ezért kisebb p-t ad, de csak akkor jogosan, ha a sokaság tényleg normális, és ezt hat adatból nem lehet ellenőrizni. A t-eloszlás kis mintán is használható (épp arra való), és a permutációs p itt már kétoldali.`
        }
      ]
    },

    /* ------------------------------------------------ 8.6 */
    "ms8-86": {
      title: "Kvíz – 8.6 Szórások próbái: χ²-próba és F-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$n = 11$, $s = 5$, $H_0$: $\sigma = 4$. Mennyi a $\chi^2$-próbastatisztika?`,
          options: [R`$\chi^2 \approx 15{,}63$`, R`$\chi^2 = 12{,}5$`, R`$\chi^2 \approx 17{,}19$`, R`$\chi^2 = 6{,}4$`],
          answer: 0,
          hint: R`$\chi^2 = (n - 1)s^2/\sigma_0^2$. Négyzetre emelted mindkét szórást? Mi a számláló szorzója?`,
          explain: R`$\chi^2 = \dfrac{10 \cdot 25}{16} \approx 15{,}63$. A 12,5 $= 10 \cdot 5/4$ a szórásokkal számol, nem a szórásnégyzetekkel. A 17,19 $= 11 \cdot 25/16$ $n$-nel szoroz $n - 1$ helyett. A 6,4 $= 10 \cdot 16/25$ fordítva osztja a két szórásnégyzetet.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gép régi szórása 8 g. Beállítás után 21 zacskóból $s = 5$ g. Csökkent-e a szórás? ($\alpha = 5\%$, $\chi^2_{20;\,0{,}05} = 10{,}85$, $\chi^2_{20;\,0{,}95} = 31{,}41$)`,
          options: [
            R`$\chi^2 \approx 7{,}81 \le 10{,}85$ → elvetjük $H_0$-t: a szórás szignifikánsan csökkent.`,
            R`$\chi^2 \approx 7{,}81 \lt 31{,}41$ → nem vetjük el $H_0$-t.`,
            R`A kis $\chi^2$ $H_0$ mellett szól, ezért nem vetjük el.`,
            R`Elvetjük, mert $s/\sigma_0 = 0{,}625 \lt 0{,}95$.`
          ],
          answer: 0,
          hint: R`Baloldali próba ($H_1$: $\sigma \lt 8$): a kritikus tartomány a $\chi^2$-eloszlás melyik szélén van?`,
          explain: R`$\chi^2 = 20 \cdot 25/64 \approx 7{,}81$. A „csökkent” baloldali kérdés, a kritikus tartomány $\chi^2 \le \chi^2_{20;\,0{,}05} = 10{,}85$ – a 7,81 oda esik, elvetjük ($p \approx 0{,}007$). A 31,41-es felső kvantilis a jobboldali (növekedést kérdező) próbáé. A kicsi $\chi^2$ itt épp a csökkenés jele. Az $s/\sigma_0$ arányt nem kvantilissel kell összevetni, hanem a $\chi^2$-statisztikát.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kétoldali $\chi^2$-próbánál a szórásra miért kell két külön kritikus értéket kikeresni, és nem elég egy $\pm$ érték?`,
          options: [
            R`Mert a $\chi^2$-eloszlás nem szimmetrikus (csak pozitív értékeket vesz fel, jobbra ferde).`,
            "Mert két szórást hasonlítunk össze.",
            R`Mert a $\chi^2$-eloszlás csak nagy $n$-nél használható.`,
            R`Nem kell: ugyanúgy $\pm 1{,}96$ a határ, mint az u-próbánál.`
          ],
          answer: 0,
          hint: R`Rajzold le a $\chi^2_{10}$ sűrűségfüggvényét. Van-e negatív értéke? Tükrös-e?`,
          explain: R`A $\chi^2$ szórásnégyzetből számolt, nem negatív mennyiség, és az eloszlása jobbra ferde: a két farok nem egymás tükörképe. Ezért kell külön $\chi^2_{n-1;\,\alpha/2}$ és $\chi^2_{n-1;\,1-\alpha/2}$ (pl. $df = 10$-nél 3,25 és 20,48). Egy szórást vetünk egy előírt értékhez – két szórás az F-próba. A $\pm 1{,}96$ a standard normálisé, itt nem érvényes.`
        },
        {
          type: "single", shuffle: true,
          q: R`F-próba két szórásra: $s_1 = 5$ ($n_1 = 9$), $s_2 = 10$ ($n_2 = 16$). Mi a próbastatisztika és a szabadságfokok (számláló, nevező)?`,
          options: [
            R`$F = 4$, $df = (15, 8)$`,
            R`$F = 2$, $df = (15, 8)$`,
            R`$F = 0{,}25$, $df = (8, 15)$`,
            R`$F = 4$, $df = (8, 15)$`
          ],
          answer: 0,
          hint: "Melyik szórásnégyzet kerül a számlálóba? A szabadságfokok közül melyik az első?",
          explain: R`A nagyobb szórásnégyzet megy a számlálóba: $F = 100/25 = 4$. Az első szabadságfok a számlálóé: a 16 elemű mintából $16 - 1 = 15$, a nevezőé $9 - 1 = 8$. A 2 a szórások aránya (nem a négyzeteké). A 0,25-nél a kisebb került a számlálóba – a felső kvantilissel összevetve így sosem vetnéd el $H_0$-t. A $df = (8, 15)$ jó $F$ mellett is hibás sorrend: $F_{15,8} \ne F_{8,15}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gép 13 zacskójából $s_1 = 8$ g, B gép 11 zacskójából $s_2 = 4$ g. Normális töltés, kétoldali 5%, $F_{12,10;\,0{,}975} = 3{,}62$. Mi a döntés?`,
          options: [
            R`$F = 4 \ge 3{,}62$ → elvetjük: a két gép pontossága különbözik.`,
            R`$F = 2 \lt 3{,}62$ → nem vetjük el.`,
            R`$F = 0{,}25 \lt 3{,}62$ → nem vetjük el.`,
            R`$F = 2 \ge 1{,}96$ → elvetjük.`
          ],
          answer: 0,
          hint: "Szórásnégyzetek aránya, a nagyobb felül – és az F-eloszlás kvantilisével vesd össze, ne a normálissal.",
          explain: R`$F = 64/16 = 4 \ge 3{,}62$ → elvetjük ($p \approx 0{,}036$). Az $F = 2$ a szórások aránya – négyzet nélkül a próbastatisztika túl kicsi, és tévesen nem vetnénk el. A 0,25 a fordított hányados. Az 1,96 a standard normális kvantilise, az F-próbához semmi köze.`
        },
        {
          type: "multi",
          q: R`Szimuláció igaz $H_0$ mellett (egyenlő szórások), kétoldali 5%-os F-próba. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "Exponenciális (jobbra ferde) adaton csoportonként 100 fővel is kb. 31% a téves riasztás.",
            R`Csúcsos ($t_5$) adaton a téves riasztás a minta növelésével nő (13% → 22%).`,
            "Egyenletes eloszlású adaton a próba túl óvatos (kb. 0,3–1% téves riasztás).",
            R`$n \ge 30$-nál a centrális határeloszlás-tétel miatt a téves riasztás 5% körül van.`,
            "A Levene-próba a normalitásra még érzékenyebb, mint az F-próba."
          ],
          answer: [0, 1, 2],
          hint: "Az átlagot a CHT „megmenti” nagy mintán. Igaz ez a szórásnégyzet eloszlására is? Mitől függ annak ingadozása?",
          explain: R`Az első három a 8.6-c táblázatából jön: ferde és vastag farkú adaton az F-próba sokat riaszt, és <b>a minta növelésével romlik</b>; rövid farkú (egyenletes) adaton túl óvatos. A szórásnégyzet ingadozása a farkak vastagságától (negyedik momentum) függ, ezt a CHT nem javítja – a „nagy minta megoldja” a t-próbára igaz, az F-re nem. A Levene-próba épp azért ajánlott, mert <em>kevésbé</em> érzékeny a normalitásra.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két gép (13 és 11 zacskó, $s$ 6 és 4 g) F-próbája: $F = 2{,}25$, $p \approx 0{,}21$. Melyik a helyes megfogalmazás?`,
          options: [
            "Ennyi adatból nem mutatható ki különbség a két gép pontossága között.",
            "A két gép egyformán pontos.",
            "Bebizonyítottuk, hogy a két szórás egyenlő.",
            "Az A gép 1,5-szer pontatlanabb, ez szignifikáns."
          ],
          answer: 0,
          hint: "Mit jelent a „nem vetjük el” – és mit nem jelent?",
          explain: R`A nem-szignifikáns eredmény azt jelenti, hogy az adat összefér $H_0$-lal, nem azt, hogy $H_0$ igaz. Kis mintán a szórásnégyzet nagyon ingadozik, ezért egy másfélszeres szórásarány is belefér a véletlenbe – kimutatásához jóval több zacskó kellene. Az „egyformán pontos” és a „bebizonyítottuk” $H_0$ elfogadását mondja ki; a „szignifikáns” pedig ellentmond a $p = 0{,}21$-nek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két bolt várakozási ideje (erősen jobbra ferde), $n = 200$–200. Egyformán szóródnak-e a várakozási idők? Melyik próba?`,
          options: [
            "Levene-próba (vagy a mediánnal számolt Brown–Forsythe-változat).",
            "F-próba – 200 fős mintánál a normalitás nem számít.",
            "Welch-próba.",
            R`$\chi^2$-próba a szórásra.`
          ],
          answer: 0,
          hint: "Két szórás összehasonlítása – de mi az F-próba feltétele, és segít-e rajta a nagy minta?",
          explain: R`Két szórást kell összevetni, de az adat ferde: az F-próba itt nagy mintán is sokszor riaszt tévesen (exponenciálisnál kb. 31%). A Levene-próba az átlagtól (mediántól) mért abszolút eltérésekre végez átlag-összehasonlítást, ezért robusztus. A Welch-próba az átlagokat hasonlítja, nem a szórásokat. A $\chi^2$-próba egy szórást vet össze egy előírt értékkel – és az is normalitást kíván.`
        }
      ]
    },

    /* ------------------------------------------------ 8.7 */
    "ms8-87": {
      title: "Kvíz – 8.7 Arányok próbái",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$H_0$: $p = 0{,}2$. Egy 400 fős mintában 100 „igen” ($\hat p = 0{,}25$). Mennyi a $z$?`,
          options: [R`$z = 2{,}5$`, R`$z \approx 2{,}31$`, R`$z \approx 2{,}24$`, R`$z = 0{,}125$`],
          answer: 0,
          hint: R`A próbát $H_0$ feltételezésével végezzük: melyik arány kerül a standard hibába, $p_0$ vagy $\hat p$? És ne felejtsd az $n$-nel osztást.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}2 \cdot 0{,}8/400} = 0{,}02$, $z = 0{,}05/0{,}02 = 2{,}5$ (kétoldali $p \approx 0{,}012$). A 2,31 $\hat p$-vel számolja az SE-t ($\sqrt{0{,}25 \cdot 0{,}75/400}$) – az a KI-é, nem a próbáé. A 2,24 kihagyja az $(1 - p_0)$ tényezőt ($\sqrt{0{,}2/400}$). A 0,125 az egyetlen megfigyelés szórásával, $\sqrt{0{,}16} = 0{,}4$-del oszt, nem a standard hibával.`
        },
        {
          type: "multi",
          q: R`Melyik esetben <b>nem</b> használható egy arány z-próbája (normális közelítés), és pontos binomiális próba kell? (Több jó válasz is lehet.)`,
          options: [
            R`$n = 50$, $p_0 = 0{,}1$`,
            R`$n = 200$, $p_0 = 0{,}04$`,
            R`$n = 1000$, $p_0 = 0{,}995$`,
            R`$n = 400$, $p_0 = 0{,}15$`,
            R`$n = 100$, $p_0 = 0{,}5$`
          ],
          answer: [0, 1, 2],
          hint: R`Számold ki mindkét várt gyakoriságot: $np_0$ és $n(1 - p_0)$. Mindkettőnek legalább 10-nek kell lennie.`,
          explain: R`$50 \cdot 0{,}1 = 5$, $200 \cdot 0{,}04 = 8$ – kevés várt „igen”. Az $n = 1000$, $p_0 = 0{,}995$ esetben $np_0 = 995$ rendben, de $n(1 - p_0) = 5$: kevés a várt „nem” – a feltétel <em>mindkét</em> gyakoriságra vonatkozik, a nagy $n$ önmagában nem elég. A $400 \cdot 0{,}15 = 60$ és 340, illetve az 50–50 rendben van.`
        },
        {
          type: "single", shuffle: true,
          q: R`NGA selejtpélda: megengedett selejtarány 2%, 70 csavarból 3 selejtes. Melyik a helyes eljárás?`,
          options: [
            R`Pontos binomiális próba: $P(X \ge 3 \mid n = 70,\ p = 0{,}02) \approx 0{,}165$ → nem vetjük el.`,
            R`z-próba $p_0$-lal: $z \approx 1{,}37$ → nem vetjük el.`,
            R`z-próba $\hat p$-vel és $n - 1$-gyel: $z \approx 0{,}94$ → nem vetjük el.`,
            R`z-próba $\hat p$-vel és $n$-nel: $z \approx 0{,}94$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Mielőtt képletet választasz: mennyi itt $np_0$?`,
          explain: R`$np_0 = 70 \cdot 0{,}02 = 1{,}4$ – messze 10 alatt, a normális közelítés nem használható, a pontos binomiális próba kell ($p \approx 0{,}165$). A $z \approx 1{,}37$ a „szokásos” képlet helyes alkalmazása, de itt a feltétele nem teljesül. A könyv $z = 0{,}942$-je két hibát halmoz: $\hat p$ és $n - 1$ az SE-ben. A $\hat p$-vel és $n$-nel számolt változat ugyanúgy hibás. Mindegyik „nem vetjük el” – a döntés véletlenül ugyanaz, a módszer nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`A/B-teszt: A változat 100 látogatójából 30, B változat 200 látogatójából 90 vásárolt. Mennyi az összevont arány, $\hat p$?`,
          options: [R`$0{,}4$`, R`$0{,}375$`, R`$0{,}6$`, R`$0{,}15$`],
          answer: 0,
          hint: R`Összes „igen” osztva az összes látogatóval – nem a két arány átlaga.`,
          explain: R`$\hat p = (30 + 90)/(100 + 200) = 120/300 = 0{,}4$. A 0,375 a két arány (0,30 és 0,45) egyszerű átlaga – eltérő csoportméretnél ez nem a közös arány becslése. A 0,6 $= 120/200$ csak az egyik csoport méretével oszt. A 0,15 a két arány különbsége, a próbastatisztika számlálója.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanitt (30/100 vs 90/200, összevont $\hat p = 0{,}4$) mennyi a két arány z-próbájának statisztikája?`,
          options: [R`$z = 2{,}5$`, R`$z \approx 2{,}60$`, R`$z \approx 1{,}85$`, R`$z \approx 5{,}30$`],
          answer: 0,
          hint: R`$\mathrm{SE} = \sqrt{\hat p(1 - \hat p)(1/n_1 + 1/n_2)}$ az összevont aránnyal.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}4 \cdot 0{,}6 \cdot (1/100 + 1/200)} = \sqrt{0{,}0036} = 0{,}06$, $z = 0{,}15/0{,}06 = 2{,}5$ ($p \approx 0{,}012$). A 2,60 a két arányt külön használja az SE-ben – az a KI képlete; a próbánál $H_0$ mellett a közös arány a legjobb becslés. Az 1,85 a két SE-t adja össze ($0{,}046 + 0{,}035$) a szórásnégyzetek helyett. Az 5,30 a teljes $n = 300$-zal egyszer oszt ($\sqrt{0{,}24/300}$), mintha egyetlen minta lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért a két arányt <em>külön</em> használjuk a különbség konfidencia-intervallumában, és nem az összevont arányt?`,
          options: [
            "Mert a KI nem tételezi fel, hogy a két arány egyenlő – épp a különbségüket becsüljük.",
            "Mert az összevont arány csak egyforma csoportméretnél számolható.",
            "Mert a KI-nél nagyobb SE kell, és a külön számolt mindig nagyobb.",
            "Mert az összevont arány csak kétoldali próbánál érvényes."
          ],
          answer: 0,
          hint: R`Az összevont arány melyik hipotézisből következik? Van-e hipotézis a KI-nél?`,
          explain: R`Az összevont arány $H_0$-ból jön: ha $p_1 = p_2$, egyetlen közös arány van. A KI-nél nincs $H_0$ – egy (lehet, hogy nem nulla) különbséget becsülünk, így a két arányt külön kell használni. Az összevont arány bármilyen csoportméretnél számolható. A külön SE nem mindig nagyobb (az A/B-példában 0,0340 vs 0,0342). Az egyoldali próbánál is összevont arányt használunk.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mindkét oldal valódi vásárlási aránya 10%. Változatonként 100 látogatónként megnézed a $z$-próbát 2000-ig (20 belenézés), és leállsz, ha $p \lt 0{,}05$. Kb. a kísérletek hány százalékában lesz valamikor „szignifikáns” az eredmény?`,
          options: ["kb. 25%", "kb. 5%", "kb. 64%", "kb. 0,25%"],
          answer: 0,
          hint: "Minden belenézés újabb esély a téves riasztásra – de független-e a 20 belenézés?",
          explain: R`A szimuláció szerint kb. 25% – ötször annyi, mint az $\alpha = 5\%$. Az 5% csak egyetlen, a végén elvégzett próbára igaz. A 64% $= 1 - 0{,}95^{20}$ 20 <em>független</em> próbáé; a belenézések viszont összefüggnek (a későbbi adat tartalmazza a korábbit), ezért kevesebb. A 0,25% $= 0{,}05/20$ a Bonferroni-küszöb, nem a téves riasztás aránya.`
        },
        {
          type: "multi",
          q: R`Melyik eljárás tartja az elsőfajú hibát legfeljebb 5%-on egy A/B-tesztben? (Több jó válasz is lehet.)`,
          options: [
            "Előre rögzített mintanagyság (erőtervezés), és egyetlen próba a végén.",
            R`5 tervezett időközi elemzés, mindegyiknél $0{,}05/5 = 0{,}01$-es küszöb (Bonferroni).`,
            "Szekvenciális próba („alfa-költés”), amely minden belenézésre kisebb küszöböt ad.",
            "Naponta ránézni, és az első szignifikáns eredménynél leállni.",
            "Ha még nem szignifikáns, addig futtatni, amíg az nem lesz."
          ],
          answer: [0, 1, 2],
          hint: "Melyik eljárás számol a belenézések számával – és melyik ad minden belenézéskor újabb 5%-os esélyt a téves riasztásra?",
          explain: R`Az előre rögzített $n$ egyetlen próbával pontosan $\alpha$-t ad. A Bonferroni-küszöb (óvatosan) és a szekvenciális módszerek (kevésbé szigorúan, a belenézések összefüggését kihasználva) szintén kordában tartják a teljes hibát. A „leállás az első szignifikánsnál” és a „futtassuk, amíg szignifikáns nem lesz” ugyanaz a hiba két irányból: többszörös tesztelés, a tényleges hiba jóval 5% fölött.`
        }
      ]
    },

    /* ------------------------------------------------ 8.8 */
    "ms8-88": {
      title: "Kvíz – 8.8 Erő és mintanagyság két csoport összehasonlításához",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két csoport, $\sigma = 10$, valódi különbség $\Delta = 4$, csoportonként $n = 50$, kétoldali 5%. Mennyi a próba ereje (normális közelítés)?`,
          options: [R`$\approx 0{,}52$`, R`$\approx 0{,}81$`, R`$\approx 0{,}64$`, R`$\approx 0{,}48$`],
          answer: 0,
          hint: R`Erő $\approx \Phi\!\left(\Delta/\mathrm{SE} - z_{1-\alpha/2}\right)$. Két csoport különbségének SE-je: $\sigma\sqrt{2/n}$.`,
          explain: R`$\mathrm{SE} = 10\sqrt{2/50} = 2$, erő $\approx \Phi(4/2 - 1{,}96) = \Phi(0{,}04) \approx 0{,}52$ – alig jobb a pénzfeldobásnál. A 0,81 az egy átlagra vonatkozó $\sigma/\sqrt n \approx 1{,}41$-gyel számol – elfelejti a $\sqrt 2$-t. A 0,64 egyoldali kvantilist (1,645) használ kétoldali próbához. A 0,48 a másodfajú hiba, $\beta = 1 - \text{erő}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány fő kell <b>csoportonként</b> $d = 0{,}4$ kimutatásához 80%-os erővel, kétoldali 5%-on? ($(1{,}96 + 0{,}842)^2 \approx 7{,}85$)`,
          options: ["99", "50", "198", "78"],
          answer: 0,
          hint: R`$n = 2\left(\dfrac{z_{1-\alpha/2} + z_{1-\beta}}{d}\right)^2$ csoportonként – és mindig felfelé kerekítünk.`,
          explain: R`$n = 2 \cdot 7{,}85/0{,}16 \approx 98{,}1$ → 99 fő csoportonként (t-eloszlással számoló szoftver 100-at ad). Az 50 kihagyja a 2-es szorzót – az az egymintás képlet. A 198 a két csoport együtt: a képlet csoportonkénti létszámot ad. A 78 egyoldali kvantilissel (1,645) számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálathoz $\Delta = 4$ kimutatására 60 fő kell csoportonként. Hány kell, ha feleakkora, $\Delta = 2$ különbséget akarsz ugyanakkora erővel kimutatni?`,
          options: ["240", "120", "85", "30"],
          answer: 0,
          hint: R`Hogyan függ az $n$ a $\Delta$-tól a mintanagyság képletében?`,
          explain: R`$n \propto 1/\Delta^2$: feleakkora hatás → négyszer akkora minta, $4 \cdot 60 = 240$. A 120 lineáris arányosságot feltételez („kétszer akkora”) – a leggyakoribb hiba. A 85 $\approx 60\sqrt 2$ a négyzetgyökös skálát keveri bele. A 30 fordított irány: kisebb hatáshoz nem kevesebb, hanem több adat kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Lehr-szabály (kétoldali 5%, 80% erő): hány fő kell csoportonként $d = 0{,}25$-höz?`,
          options: ["256", "64", "128", "512"],
          answer: 0,
          hint: R`$n \approx 16/d^2$ csoportonként.`,
          explain: R`$16/0{,}25^2 = 16/0{,}0625 = 256$ fő csoportonként (ez épp a vérnyomás-példa $d = 3/12$-je – a pontos képlet 252-t ad). A 64 $= 16/d$ elfelejti a négyzetet. A 128 $= 8/d^2$ kihagyja a két csoport miatti 2-es szorzót. Az 512 a teljes létszám – a szabály csoportonkénti $n$-et ad.`
        },
        {
          type: "multi",
          q: R`A/B-tesztek mintanagysága (kétoldali 5%, 80% erő). Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "10% → 15%-hoz változatonként kb. 686, összesen kb. 1372 látogató kell.",
            "20% → 25%-hoz több látogató kell, mint 10% → 15%-hoz (kb. 1094 változatonként).",
            "10% → 12% kimutatásához nagyságrendileg kb. hatszor annyi adat kell, mint 10% → 15%-hoz.",
            "Ugyanakkora (5 százalékpontos) javuláshoz mindig ugyanakkora minta kell, bármekkora is az alapráta.",
            "A 686 a két változat együttes létszáma."
          ],
          answer: [0, 1, 2],
          hint: R`Arányoknál a szórás a $p$-ből jön: hol nagyobb a $p(1 - p)$, 10% vagy 20% körül? És csoportonkénti vagy teljes $n$-et ad a képlet?`,
          explain: R`A képlet változatonkénti $n$-et ad: 686, összesen 1372. 20% körül nagyobb a $p(1-p)$, tehát a zaj, ezért ugyanahhoz az 5 százalékponthoz több adat kell (1094) – vagyis nem igaz, hogy az alapráta mindegy. A 2 százalékpont kb. $(5/2)^2 \approx 6$-szor annyi adatot kér (a pontos arány kb. 5,6, mert a $p(1-p)$ is változik).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálathoz csoportonként 200 kiértékelhető beteg kell, de várhatóan 20% kiesik. Hány beteget toborozz csoportonként?`,
          options: ["250", "240", "220", "160"],
          answer: 0,
          hint: R`A toborzottak 80%-a marad bent – hány ember 80%-a a 200?`,
          explain: R`$200/0{,}8 = 250$; ebből 20% (50 fő) kiesve épp 200 marad. A 240 $= 200 \cdot 1{,}2$: a 240-ből 20% kiesve csak 192 marad. A 220 csak 10%-kal számol. A 160 $= 200 \cdot 0{,}8$ – a kiesést levonja, ahelyett hogy pótolná.`
        },
        {
          type: "single", shuffle: true,
          q: R`Páros terv: a különbségek szórása $\sigma_d = 5$, a keresett hatás $\Delta = 2$, kétoldali 5%, 80% erő. Hány <b>pár</b> kell? (Egymintás képlet: $n = \left(\frac{z_{1-\alpha/2} + z_{1-\beta}}{\Delta/\sigma_d}\right)^2$, $1{,}96 + 0{,}842 \approx 2{,}80$)`,
          options: ["50", "99", "39", "7"],
          answer: 0,
          hint: R`Páros tervnél a különbségekre egymintás próba fut – nincs két csoport, nincs 2-es szorzó.`,
          explain: R`$n = (2{,}80 \cdot 5/2)^2 = 7^2 = 49{,}06$ → 50 pár. A 99 a kétcsoportos képlet 2-es szorzóval – a páros tervben a különbségek egyetlen mintát alkotnak. A 39 egyoldali kvantilissel (1,645) számol. A 7 elfelejti a négyzetre emelést.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy A/B-teszt nem lett szignifikáns. A vezető: „A megfigyelt különbséggel számolt erő csak 30% volt, tehát nem tudhatjuk.” Mi a gond az érveléssel?`,
          options: [
            "A megfigyelt hatással számolt utólagos erő a p-értékből következik (nem-szignifikánsnál mindig kicsi), új információt nem ad; az erőt előre, a minimális érdekes hatásra kell számolni, utólag a KI a tájékoztató.",
            "Semmi: az utólagos erő a megfigyelt hatással a legjobb módja annak, hogy értékeljük a vizsgálatot.",
            "Az erőt csak szignifikáns eredménynél szabad kiszámolni.",
            "A 30%-os erő azt jelenti, hogy 70% eséllyel igaz a nullhipotézis."
          ],
          answer: 0,
          hint: "Ha a megfigyelt különbséget teszed a $\\Delta$ helyére, honnan jön minden szám az erőképletben?",
          explain: R`A megfigyelt hatással számolt („post hoc”) erő a p-érték átfogalmazása: ugyanabból az adatból jön, és nem-szignifikáns eredménynél mindig kicsi. Az erő tervezési eszköz: a <em>még érdekes</em> hatásra, előre kell kiszámolni. Utólag a különbség KI-je mutatja meg, mekkora hatások férnek bele az adatba. Az erő nem $H_0$ valószínűsége: $1 - \text{erő} = \beta$ annak esélye, hogy egy <em>adott</em> valódi hatást elszalasztunk.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms8-final": {
      title: "Fejezetzáró teszt – 8. Paraméteres próbák",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy gép szórása régóta $\sigma = 12$ g. 36 zacskó átlaga $\bar x = 96$ g, $H_0$: $\mu = 100$, kétoldali próba. Mi a döntés 5%-os és 1%-os szinten?`,
          options: [
            R`$z = -2$; 5%-on elvetjük, 1%-on nem.`,
            R`$z \approx -0{,}33$; egyik szinten sem vetjük el.`,
            R`$z = -2$; egyik szinten sem vetjük el, mert $|z| \lt 2{,}576$.`,
            R`$z = -12$; mindkét szinten elvetjük.`
          ],
          answer: 0,
          hint: R`u-próba: $\mathrm{SE} = \sigma/\sqrt n$. Kétoldali kritikus értékek: 1,96 (5%) és 2,576 (1%).`,
          explain: R`$\mathrm{SE} = 12/6 = 2$, $z = -4/2 = -2$; $|z| \ge 1{,}96$, de $\lt 2{,}576$ → 5%-on elvetjük ($p \approx 0{,}046$), 1%-on nem. A $-0{,}33$ $\sigma$-val oszt $\sigma/\sqrt n$ helyett. Az „egyik szinten sem” az 1%-os kritikus értéket (2,576) használja az 5%-os próbához is. A $-12$ $\sigma/n$-nel oszt $\sigma/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gép, ismert szórásokkal: $\sigma_1 = 6$, $n_1 = 36$; $\sigma_2 = 8$, $n_2 = 16$. Mennyi az átlagok különbségének standard hibája?`,
          options: [R`$\sqrt 5 \approx 2{,}24$`, R`$3$`, R`$\sqrt 3 \approx 1{,}73$`, R`$1$`],
          answer: 0,
          hint: R`Az egyes átlagok SE-je 1 és 2. Mi adódik össze különbségnél: a szórások vagy a szórásnégyzetek? És kivonódik-e valami?`,
          explain: R`$\sqrt{36/36 + 64/16} = \sqrt{1 + 4} = \sqrt 5 \approx 2{,}24$ – a szórásnégyzetek adódnak össze, különbségnél is. A 3 a két SE összege (1 + 2). Az $\sqrt 3 = \sqrt{4 - 1}$ kivonja a szórásnégyzeteket, mert „különbséget nézünk”. Az 1 $= 2 - 1$ a szórásokat vonja ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ismeretlen szórás: 9 zacskó, $\bar x = 96$, $s = 6$, $H_0$: $\mu = 100$, kétoldali 5%. ($t_{8;\,0{,}975} = 2{,}306$, $t_{9;\,0{,}975} = 2{,}262$) Mi a döntés?`,
          options: [
            R`$t = -2$, $df = 8$, $|t| \lt 2{,}306$ → nem vetjük el.`,
            R`$t = -2$, $|t| \ge 1{,}96$ → elvetjük.`,
            R`$t = -2$, $df = 9$, $|t| \lt 2{,}262$ → nem vetjük el.`,
            R`$t \approx -0{,}67$ → nem vetjük el.`
          ],
          answer: 0,
          hint: R`Egymintás t-próba: $\mathrm{SE} = s/\sqrt n$, $df = n - 1$. A kvantilis a t-eloszlásé, nem a normálisé.`,
          explain: R`$\mathrm{SE} = 6/3 = 2$, $t = -2$, $df = 8$; $2 \lt 2{,}306$ → nem vetjük el ($p \approx 0{,}08$). Az 1,96 a $z$-kvantilis: kis mintán a $t$ vastagabb farka beárazza, hogy $s$ is bizonytalan – $z$-vel tévesen elvetnénk. A $df = 9$ $n$-nel számol $n - 1$ helyett. A $-0{,}67$ $s$-sel oszt $s/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`5 dolgozó teljesítménye betanítás előtt és után; a különbségek: 4, 6, 2, 5, 3. Mennyi a páros t-próba statisztikája és szabadságfoka?`,
          options: [
            R`$t \approx 5{,}66$, $df = 4$`,
            R`$t \approx 6{,}32$, $df = 4$`,
            R`$t \approx 5{,}66$, $df = 5$`,
            R`$t \approx 2{,}53$, $df = 4$`
          ],
          answer: 0,
          hint: R`$\bar d = 4$. Az $s_d^2$-nél $n - 1$-gyel osztasz, aztán $\mathrm{SE} = s_d/\sqrt n$; $df$ = a párok száma mínusz 1.`,
          explain: R`Eltérések négyzetösszege $0 + 4 + 4 + 1 + 1 = 10$, $s_d^2 = 10/4 = 2{,}5$, $s_d \approx 1{,}58$, $\mathrm{SE} \approx 0{,}707$, $t = 4/0{,}707 \approx 5{,}66$, $df = 4$ ($p \approx 0{,}005$). A 6,32 $n$-nel osztva számolja $s_d^2$-et (2), ezért kisebb SE-t kap. A $df = 5$ a párok száma, nem $n - 1$. A 2,53 $s_d$-vel oszt $s_d/\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`5 fős csoport ($s = 10$) és 20 fős csoport ($s = 3$), az átlagkülönbség 6. Közös szórásos t-próba: $p \approx 0{,}024$; Welch: $p \approx 0{,}25$. Melyikben bízz?`,
          options: [
            "A Welch-próbában: a közös szórásos próba itt alábecsüli az SE-t, és igaz H₀ mellett kb. 28%-ban riaszt 5% helyett.",
            "A közös szórásos próbában, mert nagyobb a szabadságfoka (23).",
            "Egyikben sem: ilyenkor a két p-érték átlaga (kb. 0,14) a jó.",
            "A közös szórásos próbában, mert az szignifikáns, a Welch pedig túl óvatos."
          ],
          answer: 0,
          hint: "Melyik csoport szórása a nagyobb, és melyik csoport „húzza” a közös szórásnégyzetet?",
          explain: R`A közös $s_p^2 \approx 24{,}8$ a nagy, kis szórású csoport 9-e felé húz, így a kis csoport valódi $100/5 = 20$-as varianciatagja helyett kb. 5 kerül a képletbe: SE 2,49 a Welch 4,52-je helyett. Szimuláció szerint a közös próba ilyenkor kb. 28%-ban riaszt tévesen, a Welch kb. 5%-ban. A nagy $df$ nem pótolja a rossz SE-t, a p-értékek átlagolásának nincs értelme, és a „szignifikáns, tehát jobb” a kívánt eredmény szerinti válogatás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két gép: $s_1 = 9$ ($n_1 = 16$), $s_2 = 6$ ($n_2 = 21$). Az F-próba statisztikája és szabadságfokai?`,
          options: [
            R`$F = 2{,}25$, $df = (15, 20)$`,
            R`$F = 1{,}5$, $df = (15, 20)$`,
            R`$F \approx 0{,}44$, $df = (20, 15)$`,
            R`$F = 2{,}25$, $df = (20, 15)$`
          ],
          answer: 0,
          hint: "Szórásnégyzetek aránya, a nagyobb a számlálóban; az első szabadságfok a számlálóé.",
          explain: R`$F = 81/36 = 2{,}25$, $df = (16 - 1, 21 - 1) = (15, 20)$; $F_{15,20;\,0{,}975} = 2{,}57$, így kétoldali 5%-on nem vetnénk el ($p \approx 0{,}09$). Az 1,5 a szórások aránya. A 0,44 a kisebbet teszi a számlálóba. A $(20, 15)$ felcseréli a szabadságfokok sorrendjét.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy felmérésben 900-ból 486 „igen” ($\hat p = 0{,}54$). Eltér-e a támogatottság 50%-tól? Mennyi a $z$ és a kétoldali p-érték?`,
          options: [
            R`$z = 2{,}4$; $p \approx 0{,}016$`,
            R`$z = 2{,}4$; $p \approx 0{,}008$`,
            R`$z = 2{,}4$; $p \approx 0{,}992$`,
            R`$z = 0{,}08$; $p \approx 0{,}94$`
          ],
          answer: 0,
          hint: R`$\mathrm{SE} = \sqrt{p_0(1 - p_0)/n}$. Kétoldali kérdésnél mindkét farok számít.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}25/900} = 1/60 \approx 0{,}0167$, $z = 0{,}04/0{,}0167 = 2{,}4$; kétoldali $p = 2 \cdot (1 - \Phi(2{,}4)) \approx 0{,}016$ → 5%-on elvetjük. A 0,008 egyetlen farok – kétoldali kérdésnél elfelejtett duplázás. A 0,992 $= \Phi(2{,}4)$, a farok helyett a „test”. A 0,08 a $\sqrt{p_0(1-p_0)} = 0{,}5$ egyedi szórással oszt, nem az SE-vel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató $d = 0{,}3$ hatást akar kimutatni két csoport között (kétoldali 5%, 80% erő). A Lehr-szabály szerint kb. hány fő kell csoportonként?`,
          options: ["178", "53", "356", "89"],
          answer: 0,
          hint: R`$n \approx 16/d^2$ csoportonként.`,
          explain: R`$16/0{,}09 \approx 177{,}8$ → kb. 178 fő csoportonként (a pontos $z$-képlet 175-öt ad). Az 53 $= 16/d$ elfelejti a négyzetet. A 356 a két csoport együtt. A 89 $= 8/d^2$ kihagyja a két csoport miatti 2-es szorzót.`
        },
        {
          type: "multi",
          q: R`Születési súly és dohányzás (ncbirths): különbség 0,40 font, Welch-próba $p \approx 0{,}12$, 95%-os KI $[-0{,}11;\ 0{,}91]$ font. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "A KI-be a nulla és egy majdnem 1 fontos különbség is belefér.",
            "A vizsgálat ereje egy valódi 0,4 fontos különbségre csak kb. 34% volt, ezért a nem-szignifikáns eredmény keveset mond.",
            "Welch-próba azért, mert két független csoport, eltérő szórásokkal és csoportméretekkel.",
            "Kimutattuk, hogy a dohányzás nem befolyásolja a születési súlyt.",
            "Páros t-próba kellett volna, mert mindkét csoport újszülöttekből áll."
          ],
          answer: [0, 1, 2],
          hint: "Mit jelent a „nem vetjük el” – és párosítható-e egy dohányzó anya újszülöttje egy nem dohányzóéval?",
          explain: R`A KI $-0{,}11$ és $0{,}91$ között van: a nulla is, a jelentős hatás is összefér az adattal. Az erő kb. 34% – a vizsgálat kétharmad eséllyel elszalasztaná a 0,4 fontos hatást, így a „nem szignifikáns ≠ nincs hatás” (nagyobb adatbázisok ki is mutatják). A csoportok különböző anyák – független minták, eltérő szórással és méretekkel, ezért Welch. A páros próbához ugyanazon egységen két mérés (vagy valódi párok) kellene; az, hogy mindkét csoport újszülött, ehhez nem elég.`
        },
        {
          type: "match",
          q: R`Melyik próba kell? Párosítsd a helyzeteket a próbákkal!`,
          pairs: [
            ["Kávéautomata: 10 pohár átlaga és szórása, a gyártó 2 dl-t ígér.", "egymintás t-próba"],
            ["15 futó idejét mérik a régi és az új cipőben is.", "páros t-próba"],
            ["Két gyár csavarátmérőjének pontossága, a QQ-ábrák egyenesek.", "F-próba"],
            ["Hírlevél két tárgysora 5000–5000 címre, a megnyitások száma.", "két arány z-próbája"],
            ["Egy gép régóta ismert, 10 g-os szórással; 25 zacskó átlaga.", "egymintás u-próba"],
            ["Két bolt erősen ferde várakozási idejének szóródása.", "Levene-próba"]
          ],
          hint: "Először: arány vagy mért érték? Átlag vagy szórás a kérdés? Hány minta, független vagy páros? Ismert-e a szórás? Normális-e az adat?",
          explain: R`Kávéautomata: egy átlag, a szórást a mintából becsüljük → egymintás t. Futók: ugyanazon személyen két mérés → páros t a különbségekre. Csavarok: két szórás, normális adat → F-próba. Hírlevél: igen/nem kimenet két csoportban → két arány z-próbája összevont aránnyal. Ismert szórású gép, egy átlag → u-próba. Ferde adat szórása: az F-próba nagy mintán is sokat riasztana → Levene-próba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy A/B-teszt felelőse naponta ránéz az eredményre, és a 6. napon „$p = 0{,}04$, szignifikáns!” felkiáltással leállítja. Mi a helyes értékelés?`,
          options: [
            "Hat próbát végzett, a tényleges elsőfajú hiba jóval 5% fölött van; előre rögzített mintanagyság és egyetlen végső próba (vagy szekvenciális módszer) kellett volna.",
            R`Rendben van: $0{,}04 \lt 0{,}05$, a döntés helyes.`,
            "Csak akkor gond, ha az utolsó napokban csökkent a p-érték.",
            R`A $p = 0{,}04$-et 6-tal osztva kapjuk a valódi p-értéket.`
          ],
          answer: 0,
          hint: "Hány esélye volt a téves riasztásra? Mikor és hogyan kellett volna eldönteni a leállást?",
          explain: R`Minden belenézés újabb próba – 20 belenézésnél például kb. 25% a téves riasztás 5% helyett, hatnál is jóval 5% fölött. A $p \lt 0{,}05$ csak egyetlen, előre tervezett próbánál jelenti az 5%-os hibát. A p-érték útja ezt nem változtatja meg. Bonferroni-korrekciónál a <em>küszöböt</em> osztjuk ($0{,}05/6$), nem a p-értéket – és ezt is előre kell tervezni.`
        },
        {
          type: "multi",
          q: R`Betanítási módszer, két terv: (a) ugyanaz a 6 dolgozó előtte–utána, páros t-próba, $p \approx 0{,}023$; (b) 8 + 8 dolgozó véletlen beosztással, kétmintás t-próba, $p \approx 0{,}023$. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "Az előtte–utána terv kontrollcsoport nélkül nem mondja meg, hogy a javulást a betanítás okozta-e (lehet a teszt ismétlése is).",
            "A véletlen beosztású kétcsoportos terv oksági következtetést is megenged.",
            "Az előtte–utána adatot két független mintaként elemezve sokkal nagyobb p-t kapnánk (kb. 0,68).",
            "A két terv egyforma p-értéke miatt mindkettő ugyanolyan erős bizonyíték az okságra.",
            "A páros adatra a Welch-próba lenne a helyes, mert a szórások ismeretlenek."
          ],
          answer: [0, 1, 2],
          hint: "Mi különbözteti meg a kísérletet a megfigyeléstől? És mi tűnik el a páros elemzésben, ha függetlenként számolsz?",
          explain: R`Előtte–utána terv kontroll nélkül: a javulás jöhet a teszt ismétléséből is. A véletlen beosztás miatt a (b) terv csoportjai csak a módszerben különböznek, így okságra is lehet következtetni. Ha a páros adatot függetlenként elemeznénk, a személyek közti nagy szóródás a „zajba” kerülne: $p \approx 0{,}68$. Az egyforma p-érték nem jelent egyforma tervet. A Welch-próba független mintákra való – páros adatra a különbségek egymintás (páros) t-próbája kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Előírt szórás 10 g; 25 csomagból $s = 14$ g. Eltér-e a szórás az előírttól (kétoldali 5%, $\chi^2_{24;\,0{,}025} = 12{,}40$, $\chi^2_{24;\,0{,}975} = 39{,}36$, normális töltés)?`,
          options: [
            R`$\chi^2 = 47{,}04 \ge 39{,}36$ → elvetjük.`,
            R`$\chi^2 = 33{,}6$, a két határ között → nem vetjük el.`,
            R`$\chi^2 = 49 \ge 39{,}36$ → elvetjük.`,
            R`$\chi^2 \approx 12{,}24 \le 12{,}40$ → elvetjük, mert kisebb a szórás.`
          ],
          answer: 0,
          hint: R`$\chi^2 = (n - 1)s^2/\sigma_0^2$ – szórásnégyzetekkel, $n - 1$-gyel, és a minta szórásnégyzete a számlálóban.`,
          explain: R`$\chi^2 = 24 \cdot 196/100 = 47{,}04 \ge 39{,}36$ → elvetjük ($p \approx 0{,}007$): a szórás nagyobb az előírtnál. A 33,6 $= 24 \cdot 14/10$ négyzet nélkül számol, és tévesen nem vet el. A 49 $= 25 \cdot 196/100$ $n$-nel szoroz (itt a döntés véletlenül azonos, a statisztika nem). A 12,24 fordítva osztja a szórásnégyzeteket, és a szórás <em>csökkenésére</em> következtetne. Fontos: a $\chi^2$-próba a normalitásra érzékeny, nagy mintán is.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
