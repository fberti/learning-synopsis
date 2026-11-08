    /* ------------------------------------------------ 5.5 */
    "ms5-55": {
      title: "Kvíz – 5.5 Khi-négyzet, t és F",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy $N(\mu, \sigma)$ eloszlású sokaságból 12 elemű mintát veszünk. Milyen eloszlású $\dfrac{(n-1)\,s^2}{\sigma^2}$?`,
          options: [R`$\chi^2_{11}$`, R`$\chi^2_{12}$`, R`$t_{11}$`, R`$N(0, 1)$`],
          answer: 0,
          hint: "Szórásnégyzetről van szó. Hány eltérés „mozog szabadon”, ha az átlagot már kiszámoltuk a mintából?",
          explain: R`A tétel szerint $(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$, itt $\chi^2_{11}$. A $\chi^2_{12}$ a tipikus szabadságfok-hiba: az $n$ eltérés összege mindig 0, ezért csak $n - 1$ szabad – egyet „elhasznált” az átlag. A $t$ az átlaghoz tartozik (ha $s$-sel standardizálunk), a $N(0, 1)$ pedig a $\sigma$-val standardizált átlaghoz – egyik sem a szórásnégyzeté.`
        },
        {
          type: "single", shuffle: true,
          q: R`A töltőgép $N(500, 2)$ eloszlású ($\sigma^2 = 4$), 10 dobozt mérünk. Melyik valószínűség egyenlő $P(s^2 \gt 6)$-tal?`,
          options: [R`$P(\chi^2_9 \gt 13{,}5)$`, R`$P(\chi^2_{10} \gt 15)$`, R`$P(\chi^2_9 \gt 27)$`, R`$P(\chi^2_9 \gt 6)$`],
          answer: 0,
          hint: R`Alakítsd át az $s^2 \gt 6$ egyenlőtlenséget úgy, hogy a bal oldalon $(n-1)s^2/\sigma^2$ álljon. Figyelj: $\sigma$ vagy $\sigma^2$ van a nevezőben?`,
          explain: R`$s^2 \gt 6 \iff \frac{9 s^2}{4} \gt \frac{9 \cdot 6}{4} = 13{,}5$, és $\frac{9s^2}{4} \sim \chi^2_9$. Tehát $P(\chi^2_9 \gt 13{,}5) \approx 0{,}141$. A $P(\chi^2_{10} \gt 15)$ $n$-nel számol $n-1$ helyett. A 27 a szórással ($\sigma = 2$) oszt a szórásnégyzet helyett. A $P(\chi^2_9 \gt 6)$ kihagyja az átalakítást: $s^2$ maga nem $\chi^2$-eloszlású, csak a $(n-1)s^2/\sigma^2$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy normális sokaságból vett 16 elemű mintában $\bar x = 103$, $s = 8$. Ha $\mu = 100$ lenne, mennyi a $t$-érték, és milyen eloszlásból?`,
          options: [
            R`$t = 1{,}50$, a $t_{15}$ eloszlásból`,
            R`$t = 1{,}50$, a $t_{16}$ eloszlásból`,
            R`$t = 0{,}38$, a $t_{15}$ eloszlásból`,
            R`$t = 6{,}00$, a $t_{15}$ eloszlásból`
          ],
          answer: 0,
          hint: R`A nevezőben a becsült standard hiba áll: $s/\sqrt n$. A szabadságfok ugyanaz, mint a $\chi^2$-nél.`,
          explain: R`$t = \frac{103 - 100}{8/\sqrt{16}} = \frac{3}{2} = 1{,}50$, és $T \sim t_{n-1} = t_{15}$. A $t_{16}$ a szabadságfok-hiba ($n$ helyett $n - 1$). A $0{,}38 = 3/8$ az SD ↔ SE összekeverése: $s$-sel osztott $s/\sqrt n$ helyett. A $6{,}00 = 3/(8/16)$ $n$-nel oszt $\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy normális sokaságból 5 elemű mintát veszünk, és $s$-sel standardizálunk. Melyik szimmetrikus intervallumba esik $T$ 95% valószínűséggel? (Adott: $t_{4;\,0{,}975} = 2{,}776$, $t_{5;\,0{,}975} = 2{,}571$, $z_{0{,}975} = 1{,}960$, $z_{0{,}95} = 1{,}645$.)`,
          options: [R`$\pm 2{,}776$`, R`$\pm 2{,}571$`, R`$\pm 1{,}960$`, R`$\pm 1{,}645$`],
          answer: 0,
          hint: "Három döntés: $z$ vagy $t$? Hány szabadságfok? Kétoldali 95%-hoz melyik kvantilis kell?",
          explain: R`$s$-sel standardizálva $T \sim t_{n-1} = t_4$, és a kétoldali 95%-hoz a 97,5%-os kvantilis kell: $\pm 2{,}776$. A $2{,}571$ $n = 5$ szabadságfokkal számol. Az $1{,}960$ a $z$-kvantilis – kis mintánál ez a tipikus hiba: a helyes $t$-sáv kb. 40%-kal szélesebb nála ($2{,}776/1{,}960 \approx 1{,}42$), így túl gyakran „tévedünk”. Az $1{,}645$ a 95%-os kvantilis, ami csak egy oldalra hagy 5%-ot, nem kétoldali.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Student-féle $t$-eloszlásra? (Több jó válasz is lehet.)",
          options: [
            "Szimmetrikus a 0-ra.",
            "Vastagabbak a farkai, mint a standard normálisé.",
            R`A szabadságfok növekedésével ($k \to \infty$) a standard normálishoz tart.`,
            R`Csak kis mintára való; nagy mintánál $s$-sel standardizálva a $z$ a helyes eloszlás.`,
            R`A 97,5%-os kvantilise kisebb, mint 1,96, mert a $t$ „laposabb”.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a kvantilis-táblázatra: 12,706; 2,776; 2,262; …; 1,960. Merre mozognak a számok, és mihez tartanak?`,
          explain: R`A $t$ szimmetrikus, harang alakú, de vastagabb farkú, és $k \to \infty$ esetén a standard normálishoz tart. Normális sokaságnál, ha $s$-sel standardizálunk, <b>mindig</b> a $t$ a helyes – nagy mintánál csak már alig különbözik a $z$-től; a „csak kis mintára” tévhit. A vastagabb farok miatt a 97,5%-os kvantilis <b>nagyobb</b> 1,96-nál (pl. $t_{9;\,0{,}975} = 2{,}262$): ugyanakkora farokhoz messzebb kell menni.`
        },
        {
          type: "match",
          q: "Párosítsd a mennyiséget az eloszlásával! (Normális sokaság, független minták.)",
          pairs: [
            [R`$Z_1^2 + \dots + Z_k^2$ (független standard normálisok)`, "khi-négyzet, k szabadságfok"],
            [R`$(n-1)\,s^2/\sigma^2$`, "khi-négyzet, n − 1 szabadságfok"],
            [R`$(\bar X - \mu)/(s/\sqrt n)$`, "Student-féle t, n − 1 szabadságfok"],
            [R`$(\bar X - \mu)/(\sigma/\sqrt n)$`, "standard normális"],
            [R`$s_1^2/s_2^2$ (azonos $\sigma$)`, "F, (n1 − 1, n2 − 1) szabadságfok"]
          ],
          hint: R`Ismert $\sigma$ → $z$; $s$ a nevezőben → $t$; szórásnégyzet → $\chi^2$; két szórásnégyzet hányadosa → $F$.`,
          explain: R`A $\chi^2_k$ definíció szerint $k$ független standard normális négyzetösszege; a korrigált szórásnégyzetből képzett $(n-1)s^2/\sigma^2$ $\chi^2_{n-1}$ eloszlású (az átlag egy szabadságfokot elvisz). Ha a $\sigma$ ismert, az átlag standardizáltja standard normális; ha $s$ áll a helyén, $t_{n-1}$. Két független szórásnégyzet aránya (azonos $\sigma$ mellett) $F_{n_1-1,\,n_2-1}$ – az első szabadságfok a számlálóé.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tudod, hogy $F_{5,10;\,0{,}95} = 3{,}326$ és $F_{10,5;\,0{,}95} = 4{,}735$. Mennyi $F_{10,5;\,0{,}05}$?`,
          options: ["0,301", "0,211", "3,326", "4,735"],
          answer: 0,
          hint: R`Ha $s_1^2/s_2^2$ kicsi, akkor $s_2^2/s_1^2$ nagy. Felcserélve a szerepeket melyik eloszlást kapod?`,
          explain: R`Ha $F \sim F_{10,5}$, akkor $1/F \sim F_{5,10}$. Így $F_{10,5;\,0{,}05} = 1/F_{5,10;\,0{,}95} = 1/3{,}326 \approx 0{,}301$. A $0{,}211 = 1/4{,}735$ az $F_{5,10;\,0{,}05}$ – a szabadságfokok felcserélésének tipikus hibája. A 3,326 és a 4,735 felső kvantilisek; az alsó 5%-os kvantilis egy jobbra ferde, 1 körüli eloszlásnál 1 alatt van.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A $\chi^2_k$ várható értéke $k$, szórásnégyzete $2k$.`,
            R`A $\chi^2$ nem szimmetrikus: a 2,5%-os és a 97,5%-os kvantilist külön kell kikeresni.`,
            R`$t_k^2 \sim F_{1,k}$; például $2{,}262^2 \approx 5{,}117 = F_{1,9;\,0{,}95}$.`,
            R`Ferde sokaságnál nagy $n$ mellett az $(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$ tétel a CHT miatt pontos lesz.`,
            R`Az $F$-eloszlás két minta szórásainak (nem szórásnégyzeteinek) hányadosát írja le.`
          ],
          answer: [0, 1, 2],
          hint: R`Melyik állítás „javít meg” valamit a nagy $n$-nel, ami a szakasz szerint nem javul meg? És mi áll az $F$ definíciójában: $s$ vagy $s^2$?`,
          explain: R`$E(\chi^2_k) = k$, $D^2 = 2k$ (pl. $\chi^2_9$: 9 és 18). A $\chi^2$ jobbra ferde, ezért a kvantilisei nem tükrösek: $\chi^2_9$-nél 2,700 és 19,023. $t_k = Z/\sqrt{\chi^2_k/k}$, így $t_k^2 = (Z^2/1)/(\chi^2_k/k) \sim F_{1,k}$. A $\chi^2$-tétel <b>csak normális sokaságra</b> pontos, és – az átlaggal szemben – nagy $n$ sem javítja meg. Az $F$ a szórás<b>négyzetek</b> hányadosa.`
        }
      ]
    },

    /* ------------------------------------------------ 5.6 */
    "ms5-56": {
      title: "Kvíz – 5.6 Bootstrap",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy 3 elemű mintánk van (három különböző szám). Hány különböző (sorrendezett) bootstrap-minta húzható belőle?",
          options: ["27", "1", "6", "10"],
          answer: 0,
          hint: "A bootstrap-minta ugyanakkora, mint az eredeti, és visszatevéssel húzunk. Hány lehetőség van húzásonként?",
          explain: R`Mindhárom húzásnál 3 lehetőség van (visszatevés!), sorrendezve $3^3 = 27$. Az 1 a visszatevés nélküli húzás hibája: 3 elemből 3-at visszatevés nélkül húzva mindig ugyanaz a minta jön ki – nincs ingadozás. A $6 = 3!$ csak a sorrendeket (permutációkat) számolja, ismétlés nélkül. A 10 a sorrend nélküli, ismétléses kiválasztások száma – ezek nem egyformán valószínűek, ezért a bootstrap-eloszláshoz a 27 sorrendezett esetet kell nézni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A minta: 1, 3, 5. Mennyi az átlag bootstrap standard hibája (a 27 újraminta átlagának pontos szórása)?`,
          options: ["0,943", "1,155", "1,633", "0,889"],
          answer: 0,
          hint: R`Az újraminta 3 független húzás egy olyan „sokaságból”, amely maga a minta. Számold ki ennek $n$-es nevezőjű szórásnégyzetét, aztán alkalmazd az 5.2 tételét.`,
          explain: R`A „sokaság” (1, 3, 5) szórásnégyzete $n$-es nevezővel $\hat\sigma^2 = \frac{4 + 0 + 4}{3} = \frac83$. Az átlag szórásnégyzete $\hat\sigma^2/n = \frac89$, a bootstrap SE $\sqrt{8/9} \approx 0{,}943$. Az $1{,}155 = s/\sqrt3$ a képletes becslés ($s = 2$, $n-1$-es nevező) – a bootstrap kicsit kisebbet ad: $1{,}155\cdot\sqrt{2/3} \approx 0{,}943$. Az $1{,}633 = \hat\sigma$ az adatok szórása (SD ↔ SE). A $0{,}889 = 8/9$ a szórásnégyzet, a gyökvonás maradt el.`
        },
        {
          type: "single", shuffle: true,
          q: "A 2, 4, 9 minta 27 újramintájából hánynak 4 a mediánja?",
          options: ["13/27", "7/27", "9/27", "6/27"],
          answer: 0,
          hint: "Könnyebb a komplementer: mikor 2 a medián (legalább két 2-es), és mikor 9?",
          explain: R`A medián 2, ha legalább két 2-es van: $1 + 3 \cdot 2 = 7$ eset; ugyanígy 9: 7 eset. Marad $27 - 14 = 13$, a bootstrap-eloszlás 2: 7/27, 4: 13/27, 9: 7/27. A 7/27 a 2-es (vagy 9-es) medián valószínűsége. A 9/27 = 1/3 azt feltételezi, hogy a három érték egyforma eséllyel medián. A 6/27 csak a 2, 4, 9 sorrendjeit számolja, kihagyja például a 4, 4, 9 és a 2, 4, 4 típusú újramintákat.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a bootstrapre? (Több jó válasz is lehet.)",
          options: [
            R`Az újraminta ugyanannyi ($n$) elemű, mint az eredeti, és visszatevéssel húzzuk.`,
            R`A bootstrap-átlagok az eredeti $\bar x$ körül ingadoznak, nem a (nem ismert) $\mu$ körül.`,
            "A medián standard hibáját is megadja, pedig arra nincs egyszerű képletünk.",
            "Ha a minta torzított (pl. rossz listáról vették), a bootstrap kijavítja a torzítást.",
            "Visszatevés nélkül kell húzni, különben ugyanaz az adat többször szerepelne."
          ],
          answer: [0, 1, 2],
          hint: "Mit tud a bootstrap a mintáról? Csak azt, ami benne van – a véletlen ingadozást vagy a torzítást méri?",
          explain: R`A bootstrap-minta $n$ elemű, visszatevéssel húzott minta; az ismétlődés (pl. 9, 2, 9) így helyes. A bootstrap az eredeti statisztika körül ingadoztat (a 2, 4, 9 mintánál az újraminta-átlagok átlaga 5 = $\bar x$). Előnye, hogy képlet nélkül is működik (medián, korreláció). A torzítást viszont <b>nem</b> javítja: a torzított mintát ugráltatja, a torzítás megmarad – csak a véletlen hibát méri. Visszatevés nélkül pedig nincs ingadozás: mindig ugyanaz a minta jönne ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`$R = 2000$ bootstrap-mediánt sorba rendezünk. Melyik két érték határolja a 95%-os percentilis-intervallumot?`,
          options: ["az 50. és az 1950. érték", "a 25. és a 975. érték", "a 100. és az 1900. érték", "az 1. és a 2000. érték"],
          answer: 0,
          hint: R`Kell a 2,5%-os és a 97,5%-os percentilis. Mennyi 2000-nek a 2,5%-a?`,
          explain: R`$0{,}025 \cdot 2000 = 50$ és $0{,}975 \cdot 2000 = 1950$: a két szélen 2,5–2,5% marad ki. A 25. és 975. érték 1000 ismétlésnél volna jó – itt a percentilist $R$-hez kell igazítani. A 100. és 1900. a két oldalon 5–5%-ot vág le (az a 90%-os intervallum). Az 1. és a 2000. a teljes terjedelem: az 100%-os, és $R$ növelésével egyre szélesebb lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 30 pontos pontdiagramon $r = 0{,}62$. Hogyan becsülöd bootstrappel $r$ standard hibáját?`,
          options: [
            R`A 30 $(x, y)$ pontpárból húzok 30-at visszatevéssel, mindegyik újramintára kiszámolom $r$-t, és ezek szórását veszem.`,
            R`Az $x$-ekből és az $y$-okból külön-külön húzok 30-30-at visszatevéssel, és ezekből számolok $r$-t.`,
            R`A 30 pontpárból húzok 15-öt visszatevés nélkül, és a kapott $r$-ek szórását veszem.`,
            R`A bootstrap itt nem kell: a korreláció SE-je $s/\sqrt{30}$.`
          ],
          answer: 0,
          hint: "Mi egy „egyed” ebben a mintában: egy szám vagy egy számpár? És mekkora legyen az újraminta?",
          explain: R`Egy egyed egy pontpár, ezért párokat húzunk, visszatevéssel, ugyanannyit (30), mint az eredeti minta. Ha az $x$-eket és $y$-okat külön húznánk, szétvernénk a kapcsolatot, és $r$ 0 körül ingadozna. A 15 elem visszatevés nélkül két hiba egyszerre: más mintanagyság ingadozását mérné, és a visszatevés hiányzik. Az $s/\sqrt n$ az átlag standard hibája; a korrelációra nincs ilyen egyszerű képletünk – éppen ezért kell a bootstrap.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 150 elemű minta legnagyobb értéke 87. Mit mond a bootstrap a sokaság maximumáról?",
          options: [
            "Semmi megbízhatót: az újraminták maximuma sosem lehet 87-nél nagyobb, így a bizonytalanságot nem látja.",
            "Pontos becslést ad, mert 150 elem már elég nagy minta.",
            "A bootstrap-maximumok a CHT miatt közel normálisak, ezért jól használhatók.",
            "Megbízható, ha az ismétlések számát (R) elég nagyra, pl. 100 000-re növeljük."
          ],
          answer: 0,
          hint: "Lehet-e egy újramintában olyan érték, ami az eredeti mintában nem szerepelt?",
          explain: R`Az újraminta csak az eredeti adatokból áll, így a maximuma legfeljebb 87 – a bootstrap-eloszlás „beragad” az eredeti maximumnál. Ez a szélsőértékek ismert korlátja. A nagy $n$ ezen nem segít, a CHT pedig az átlagról szól, nem a maximumról. A nagyobb $R$ csak a szimuláció véletlen zaját csökkenti; az eredeti minta korlátait nem javítja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 40 elemű mintán $R = 1000$ ismétléssel a medián bootstrap SE-je 2,3. Mi változik, ha $R = 100\,000$ ismétlést futtatsz?`,
          options: [
            "A bootstrap SE nagyjából 2,3 marad; csak a szimuláció véletlen zaja csökken.",
            R`A bootstrap SE kb. $\sqrt{100} = 10$-szer kisebb lesz.`,
            "A medián torzítása eltűnik.",
            "A bootstrap SE a nullához tart, mert sok ismétlés kiátlagolja a hibát."
          ],
          answer: 0,
          hint: R`A standard hibát a mintanagyság ($n$) szabja meg. Az $R$ a mintanagyság vagy a szimuláció hossza?`,
          explain: R`Az $R$ csak azt dönti el, milyen pontosan közelítjük a (40 elemű mintához tartozó) bootstrap-eloszlást. A nagyobb $R$ a szimuláció zaját csökkenti, de a bootstrap SE a medián ingadozását méri $n = 40$ mellett – az nem változik. A „$\sqrt{100}$-szor kisebb” összekeveri $R$-t $n$-nel: a $\sqrt n$-törvény az eredeti minta méretére vonatkozik. A torzítást semmilyen $R$ nem javítja. $R = 1000$–$10\,000$ általában elég.`
        }
      ]
    },

    /* ------------------------------------------------ 5.7 */
    "ms5-57": {
      title: "Kvíz – 5.7 Regresszió a középhez",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két mérés azonos átlagú és szórású, korrelációjuk $r = 0{,}6$. Valaki az első mérésen $z_X = 2$. Mi a második mérés előrejelzése $z$-ben?`,
          options: ["1,20", "2,00", "3,33", "0,80"],
          answer: 0,
          hint: R`A standardizált előrejelzés: $z_Y \approx r \cdot z_X$. Szorzás vagy osztás?`,
          explain: R`$z_Y \approx 0{,}6 \cdot 2 = 1{,}20$: továbbra is az átlag fölött, de közelebb hozzá. A 2,00 elfelejti a regressziót (mintha $r = 1$ volna). A $3{,}33 = 2/0{,}6$ osztással még szélsőségesebb értéket jósol – épp fordítva. A $0{,}80 = 2 \cdot (1 - 0{,}6)$ a visszahúzás mértékét keveri össze az előrejelzéssel.`
        },
        {
          type: "single", shuffle: true,
          q: "A felnőtt férfiak átlagmagassága 176 cm, szórása 7 cm, az apa–fiú korreláció $r = 0{,}5$. Egy apa 162 cm. Mire számíthatunk a fia magasságánál?",
          options: ["169 cm", "162 cm", "148 cm", "172,5 cm"],
          answer: 0,
          hint: R`Számold ki az apa $z$-értékét, szorozd $r$-rel, és alakítsd vissza centiméterre. A regresszió alacsony apáknál is a közép felé húz.`,
          explain: R`$z_X = (162 - 176)/7 = -2$, $z_Y \approx 0{,}5 \cdot (-2) = -1$, a fiú várhatóan $176 - 7 = 169$ cm: alacsony, de az apjánál magasabb. A 162 cm a regresszió elfelejtése. A $148 = 176 + 7 \cdot (-2/0{,}5)$ $r$-rel oszt szorzás helyett. A $172{,}5$ $r^2$-tel szoroz $r$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tehetség + szerencse modellben a tehetség szórása $\sigma_T = 6$, a szerencséé $\sigma_L = 8$ pont. Mennyi a két forduló korrelációja?`,
          options: ["0,36", "0,43", "0,75", "0,56"],
          answer: 0,
          hint: R`$r = \sigma_T^2/(\sigma_T^2 + \sigma_L^2)$ – szórás vagy szórásnégyzet szerepel benne?`,
          explain: R`$r = \frac{36}{36 + 64} = 0{,}36$: a szerencse nagyobb szerepe miatt erős a visszahúzás. A $0{,}43 = 6/(6 + 8)$ szórásokkal számol szórásnégyzetek helyett. A $0{,}75 = 6/8$ és a $0{,}56 = 36/64$ a tehetséget a szerencséhez viszonyítja, nem a teljes (tehetség + szerencse) szóródáshoz.`
        },
        {
          type: "single", shuffle: true,
          q: R`A pénzérmés modellben ($X = T + L_1$, $Y = T + L_2$) mennyi a 2. fordulós átlaga azoknak, akik az 1. fordulóban a leggyengébbek voltak ($X = 0$)?`,
          options: ["0,5", "0", "1", "1,5"],
          answer: 0,
          hint: R`Ha $X = 0$, akkor $T = 0$ és $L_1 = 0$. Mi lesz $Y = T + L_2$, ha $L_2$ újra sorsolódik?`,
          explain: R`$X = 0$ csak $T = 0$, $L_1 = 0$ esetén lehet. Ekkor $Y = L_2$, ami 0 vagy 1 egyforma eséllyel: átlag $0{,}5$ – javulnak, pedig semmi sem változott. A 0 a regresszió elfelejtése. Az 1 a teljes visszatérés az átlaghoz (mintha a tehetség semmit sem számítana). Az 1,5 a legjobbak ($X = 2$) 2. fordulós átlaga.`
        },
        {
          type: "multi",
          q: "Melyik esetben magyarázhatja (legalább részben) a regresszió a középhez a megfigyelt változást? (Több jó válasz is lehet.)",
          options: [
            "Egy kiemelkedő újoncév után a játékos második éve gyengébb.",
            "A leggyengébb 10% diák korrepetálást kap, és a következő dolgozatán javul.",
            "Egy oktató a kiváló gyakorlat után dicsér, és a következő gyakorlat rosszabb.",
            "Véletlenszerűen kiválasztott dolgozók egyik csoportja tréninget kap, és a másik, szintén véletlenül kiválasztott csoportnál többet javul.",
            "Egy véletlenszerűen kiválasztott osztály átlaga két egymást követő évben gyakorlatilag ugyanaz."
          ],
          answer: [0, 1, 2],
          hint: "Kiválasztották-e a csoportot egy kiugró (nagyon jó vagy nagyon rossz) eredmény alapján?",
          explain: R`Az újonc, a leggyengébb diákok és a dicsért pilóták mind egy <b>szélsőséges</b> eredmény alapján kerültek a csoportba: a szerencse a következő mérésen újra sorsolódik, ezért beavatkozás nélkül is átlagosabb eredmény várható (Kahneman repülésoktatói). A véletlenül kiosztott tréning- és kontrollcsoport különbsége pont azt szűri ki, amit a regresszió okozna – ezért kell kontrollcsoport. A véletlenül választott osztályt nem a szélső értéke alapján választották, ezért nincs mihez „visszatérnie”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit jósol a $z_Y \approx r z_X$ szabály, ha $r = 0$, illetve ha $r = 1$?`,
          options: [
            R`$r = 0$: mindenkinél az átlagot; $r = 1$: a második mérés ugyanaz, mint az első.`,
            R`$r = 0$: a második mérés ugyanaz, mint az első; $r = 1$: mindenkinél az átlagot.`,
            R`$r = 0$: az első mérés ellentettjét; $r = 1$: az átlagot.`,
            R`Mindkét esetben az átlagot, mert a regresszió mindig a középhez húz.`
          ],
          answer: 0,
          hint: R`Helyettesíts be: $0 \cdot z_X$ és $1 \cdot z_X$. Mit jelent $z_Y = 0$?`,
          explain: R`$r = 0$: $z_Y = 0$, az előrejelzés mindenkinél az átlag – a teljesítmény csak szerencse, teljes a visszahúzás. $r = 1$: $z_Y = z_X$, nincs szerencse, nincs regresszió. A fordított párosítás a két szélső esetet cseréli fel. Az ellentett ($-z_X$) negatív korrelációhoz ($r = -1$) tartozna. A regresszió erőssége $r$-től függ: minél nagyobb a szerencse szerepe, annál kisebb $r$.`
        },
        {
          type: "single", shuffle: true,
          q: "Galton adataiban a legmagasabb fiúk apái milyenek a fiaikhoz képest – átlagosan?",
          options: [
            "Átlagosabbak (alacsonyabbak) a fiaiknál – a regresszió visszafelé is működik.",
            "Még magasabbak, hiszen a magasság öröklődik.",
            "Pontosan ugyanolyan magasak, mint a fiaik.",
            "Erről a regresszió nem mond semmit, mert csak időben előre hat."
          ],
          answer: 0,
          hint: "A szabály két azonos átlagú és szórású mérésre szól. Számít, melyiket nevezzük „elsőnek”?",
          explain: R`A $z_Y \approx r z_X$ szimmetrikus: ha a fiúk szerint választunk ki szélsőségeseket, az apák lesznek átlagosabbak. A regresszió nem ok-okozat és nem időbeli folyamat, hanem a kiválasztás és a nem tökéletes korreláció következménye. Az öröklődés miatt az apák is átlag fölöttiek lesznek, de nem még magasabbak; a „pontosan ugyanolyan” $r = 1$-et feltételezne.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy város a legtöbb balesettel járó 10 kereszteződésbe traffipaxot szerel; egy év múlva ott 30%-kal kevesebb a baleset. Hogyan lehetne eldönteni, hatott-e a traffipax?",
          options: [
            "Hasonlóan kiugró, de traffipax nélküli kereszteződésekkel összevetve (kontrollcsoport), lehetőleg véletlen kiosztással.",
            "Sehogy nem kell: a 30%-os csökkenés önmagában bizonyítja a hatást.",
            "Ha a következő évben is alacsony marad a balesetszám, az bizonyítja a hatást.",
            "Ha a 10 kereszteződés helyett 100-at vizsgálunk ugyanígy, a regresszió eltűnik."
          ],
          answer: 0,
          hint: "Mi történt volna traffipax nélkül? Hogyan becsülhető ez a „kezelés nélküli” javulás?",
          explain: R`A kereszteződéseket a kiugróan rossz évük alapján választották, ezért traffipax nélkül is javulás várható. A hatást csak úgy lehet elválasztani a regressziótól, ha egy hasonlóan kiválasztott, kezeletlen csoport javulásával vetjük össze. A tartósan alacsony szám sem bizonyít: a regresszió után a balesetszám a valódi (átlagos) szinten marad. Több kereszteződés csak a véletlen ingadozást csökkenti, a kiválasztásból eredő regressziót nem szünteti meg.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms5-final": {
      title: "Fejezetzáró teszt – 5. Mintavételi eloszlások",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A sportolók sokaságából (2, 4, 6, 8, 10 óra) 2 fős mintát veszünk <b>visszatevés nélkül</b>. Mennyi $P(5 \le \bar x \le 7)$?`,
          options: ["0,60", "0,52", "0,43", "0,20"],
          answer: 0,
          hint: R`Sorold fel a 10 lehetséges mintát és az átlagukat. Egyformán valószínűek?`,
          explain: R`A 10 minta átlaga: 3, 4, 5, 6, 5, 6, 7, 7, 8, 9; ebből 6 esik 5 és 7 közé: $6/10 = 0{,}60$. A $0{,}52 = 13/25$ a visszatevéses (25 mintás) eset. A $0{,}43 = 3/7$ a különböző átlag<b>értékeket</b> számolja (7-ből 3), de az értékek nem egyformán valószínűek. A 0,20 csak a $\bar x = 6$ eset.`
        },
        {
          type: "single", shuffle: true,
          q: R`100 elemű mintánál a mintaátlag standard hibája 3. Hány elemű minta kell, hogy a standard hiba 1 legyen?`,
          options: ["900", "300", "173", "2&nbsp;700"],
          answer: 0,
          hint: R`$\sqrt n$-törvény: ha a hibát $k$-adára akarod csökkenteni, hányszoros minta kell?`,
          explain: R`Harmadakkora hiba → $3^2 = 9$-szeres minta: 900. A 300 a „háromszor annyi adat, harmad akkora hiba” tévhit. A $173 \approx 100\sqrt3$ fordítva alkalmazza a gyököt. A 2700 $3^3$-nal szoroz $3^2$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 400 fős cégnél 100 dolgozót kérdezünk meg <b>visszatevés nélkül</b>; a válaszok szórása $\sigma = 12$. Mennyi az átlag standard hibája?`,
          options: ["1,041", "1,200", "1,384", "0,902"],
          answer: 0,
          hint: R`A kiválasztási arány 25% – kell véges sokasági korrekció. Merre változtatja a szorzó az SE-t?`,
          explain: R`$\frac{12}{\sqrt{100}}\cdot\sqrt{\frac{400 - 100}{400 - 1}} = 1{,}2 \cdot 0{,}867 \approx 1{,}041$. Az 1,200 elhagyja a korrekciót, pedig 25%-os kiválasztási aránynál nem elhanyagolható. Az 1,384 fordítva alkalmazza ($\sqrt{(N-1)/(N-n)}$) – a korrekció mindig csökkenti az SE-t. A $0{,}902 = 1{,}2 \cdot 300/399$ a gyökvonást felejti el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy enyhén ferde sokaságban $\sigma = 10$. 100 elemű mintát veszünk. Közelítőleg mennyi $P(\bar X \gt \mu + 2)$? ($\Phi(0{,}2) \approx 0{,}579$, $\Phi(2) \approx 0{,}977$.)`,
          options: ["0,023", "0,421", "0,000", "0,046"],
          answer: 0,
          hint: R`Az átlagot a standard hibával standardizáld, ne az adatok szórásával. Egy- vagy kétoldali a kérdés?`,
          explain: R`A CHT szerint $\bar X \approx N(\mu, 1)$, mert $\mathrm{SE} = 10/\sqrt{100} = 1$. $z = 2/1 = 2$, $P \approx 1 - 0{,}977 = 0{,}023$. A $0{,}421 = 1 - \Phi(0{,}2)$ az adatok szórásával standardizál (egy megfigyelés valószínűsége, nem az átlagé). A 0,000 $\sigma/n = 0{,}1$-del oszt ($z = 20$). A 0,046 a kétoldali $P(|\bar X - \mu| \gt 2)$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a centrális határeloszlás-tételre? (Több jó válasz is lehet.)",
          options: [
            R`Nagy $n$-re a mintaátlag közel $N(\mu, \sigma/\sqrt n)$ eloszlású, bármilyen véges szórású sokaságnál.`,
            "Normális sokaságnál a mintaátlag bármilyen n-re pontosan normális.",
            "A CHT a nagy minta adatait (hisztogramját) is normálissá teszi.",
            R`$n \ge 30$ mindig elég a normális közelítéshez.`,
            "Nagyobb mintánál az adatok szórása (SD) is a nullához tart."
          ],
          answer: [0, 1],
          hint: "A CHT miről szól: az egyes adatokról vagy egy statisztika (az átlag) eloszlásáról?",
          explain: R`A CHT az <b>átlag</b> mintavételi eloszlásáról szól: nagy $n$-re közel normális, és normális sokaságnál már bármely $n$-re pontosan az. Az adatok hisztogramja a sokaság alakját mutatja – a CHT nem teszi normálissá. A 30 csak ökölszabály mérsékelten ferde sokaságra; ritka, óriási értékeknél sokkal több kell. Az SD nem csökken a mintanagysággal, csak pontosabban becsüljük; az SE csökken $\sqrt n$-nel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 400 fős felmérésben $\hat p = 0{,}5$. Mennyi a 95%-os hibahatár?`,
          options: ["± 4,9 százalékpont", "± 2,5 százalékpont", "± 0,1 százalékpont", "± 9,8 százalékpont"],
          answer: 0,
          hint: R`Előbb a standard hiba $\sqrt{\hat p(1-\hat p)/n}$, aztán a 95%-os szorzó.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}25/400} = 0{,}025$, a hibahatár $1{,}96 \cdot 0{,}025 = 0{,}049$ → ± 4,9 százalékpont. A ± 2,5 maga az SE (az 1,96 maradt el). A ± 0,1 a gyököt felejti el: $1{,}96 \cdot 0{,}25/400 \approx 0{,}001$. A ± 9,8 a $2 \cdot 1{,}96$ szorzó hibája (a teljes intervallum szélessége, nem a fele).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ritka betegség aránya $p = 0{,}03$, a minta $n = 200$. Használható-e a $\hat p$ normális közelítése?`,
          options: [
            R`Nem, mert $np = 6 \lt 10$.`,
            R`Igen, mert $n = 200 \ge 30$.`,
            R`Igen, mert $n(1-p) = 194 \ge 10$.`,
            R`Igen, mert $p(1-p)/n$ kicsi, tehát kicsi a hiba.`
          ],
          answer: 0,
          hint: "A feltétel a várt darabszámokról szól – mindkettőről.",
          explain: R`A feltétel $np \ge 10$ <b>és</b> $n(1-p) \ge 10$. Itt $np = 200 \cdot 0{,}03 = 6$ – túl kevés várt „siker”, a $\hat p$ eloszlása ferde. Az $n \ge 30$ a tipikus hiba: csak az $n$-t nézi. Az $n(1-p) = 194$ csak az egyik feltétel. A kis standard hiba nem mond semmit az eloszlás alakjáról.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $\sigma^2 = 9$, $n = 10$. Mekkora $s^2$-et lépünk túl csak 5% eséllyel? ($\chi^2_{9;\,0{,}95} = 16{,}919$)`,
          options: ["16,92", "15,23", "5,64", "1,88"],
          answer: 0,
          hint: R`$(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$. Fejezd ki $s^2$-et a kvantilisből.`,
          explain: R`$s^2 = \frac{\sigma^2}{n-1}\chi^2_{9} $, így a határ $\frac{9 \cdot 16{,}919}{9} = 16{,}92$. A $15{,}23 = 9 \cdot 16{,}919/10$ $n$-nel oszt $n - 1$ helyett. Az $5{,}64 = 3 \cdot 16{,}919/9$ a szórással ($\sigma = 3$) szoroz a szórásnégyzet helyett. Az $1{,}88 = 16{,}919/9$ elhagyja a $\sigma^2$ szorzót.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy normális sokaságból vett 10 elemű mintában $\bar x = 54$, $s = 5$. Ha $\mu = 50$ lenne, mennyi a $t$-érték, és kívül esik-e a $\pm t_{9;\,0{,}975} = \pm 2{,}262$ sávon?`,
          options: [
            R`$t \approx 2{,}53$, kívül esik`,
            R`$t \approx 0{,}80$, belül van`,
            R`$t \approx 8{,}00$, kívül esik`,
            R`$t \approx 0{,}25$, belül van`
          ],
          answer: 0,
          hint: R`A nevező a becsült standard hiba, $s/\sqrt n$. $\sqrt{10} \approx 3{,}16$.`,
          explain: R`$t = \frac{4}{5/\sqrt{10}} \approx \frac{4}{1{,}58} \approx 2{,}53 \gt 2{,}262$: kívül esik, az eltérés szokatlan, ha $\mu = 50$. A 0,80 = 4/5 az SD-vel oszt SE helyett. A 8,00 = 4/(5/10) $n$-nel oszt $\sqrt n$ helyett. A 0,25 = 4/(5·√10) szorozza a $\sqrt n$-t ahelyett, hogy osztana vele.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két független, normális minta: $n_1 = 9$, $n_2 = 16$, azonos $\sigma$. Milyen eloszlású $s_1^2/s_2^2$?`,
          options: [R`$F_{8,15}$`, R`$F_{15,8}$`, R`$F_{9,16}$`, R`$t_{23}$`],
          answer: 0,
          hint: "Mindkét szórásnégyzetnél hány a szabadságfok? Melyik áll elöl?",
          explain: R`$s_1^2/s_2^2 \sim F_{n_1 - 1,\, n_2 - 1} = F_{8,15}$ – az első szabadságfok a számlálóé. Az $F_{15,8}$ felcseréli őket (a kvantilisek mások lennének). Az $F_{9,16}$ $n$-nel számol $n - 1$ helyett. A $t$ az átlag eloszlása, ha $s$-sel standardizálunk – két szórásnégyzet arányához az $F$ kell.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kutató 20 elemű mintájából bootstrap-mintákat készít: mindegyikbe 10 elemet húz visszatevés nélkül. Mi a baj ezzel?",
          options: [
            "Kétszeres hiba: a bootstrap-minta 20 elemű legyen, és visszatevéssel kell húzni.",
            "Semmi: 10 elem visszatevés nélkül is ugyanazt a standard hibát adja.",
            "Csak az, hogy 1000-nél kevesebb bootstrap-mintánál a becslés torzított.",
            "Csak a mintanagyság rossz; a visszatevés a bootstrapnél mindegy."
          ],
          answer: 0,
          hint: "Mekkora az újraminta a definíció szerint, és hogyan húzzuk?",
          explain: R`A bootstrap-minta ugyanakkora ($n = 20$), mint az eredeti, és visszatevéssel húzzuk. 10 elemmel egy fele akkora minta ingadozását mérnénk (az nagyobb), a visszatevés hiánya pedig csökkenti az ingadozást (20-ból 20-at visszatevés nélkül húzva mindig az eredeti minta jönne ki). Az ismétlések száma ($R$) csak a szimuláció zaját befolyásolja, nem okoz torzítást.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két teszt eredményei azonos átlagúak és szórásúak, a korrelációjuk $r = 0{,}7$. Valaki az elsőn 30 ponttal az átlag <b>alatt</b> teljesített. Mire számíthatunk a másodikon?`,
          options: ["21 ponttal az átlag alatt", "30 ponttal az átlag alatt", "43 ponttal az átlag alatt", "9 ponttal az átlag alatt"],
          answer: 0,
          hint: R`Azonos szórásnál a $z_Y \approx r z_X$ pontban is alkalmazható.`,
          explain: R`$0{,}7 \cdot 30 = 21$ ponttal az átlag alatt: továbbra is gyenge, de javul – beavatkozás nélkül is. A 30 a regresszió elfelejtése. A $43 \approx 30/0{,}7$ $r$-rel oszt. A $9 = 30 \cdot (1 - 0{,}7)$ a visszahúzás mértéke (ennyivel kerül közelebb), nem az előrejelzés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két független, 1000 fős felmérés ugyanarról a kérdésről, mindkettőben $\hat p \approx 0{,}5$. Mekkora a két eredmény különbségének 95%-os sávja?`,
          options: ["± 4,4 százalékpont", "± 3,1 százalékpont", "± 6,2 százalékpont", "± 2,2 százalékpont"],
          answer: 0,
          hint: "Független változók különbségének szórásnégyzete a szórásnégyzetek összege – nem a szórásoké!",
          explain: R`Egy felmérés SE-je $\sqrt{0{,}25/1000} \approx 1{,}58$ százalékpont. A különbségé $\sqrt2 \cdot 1{,}58 \approx 2{,}24$, a 95%-os sáv $1{,}96 \cdot 2{,}24 \approx 4{,}4$ százalékpont. A ± 3,1 egyetlen felmérés hibahatára. A ± 6,2 a két hibahatárt adja össze (a szórásokat, nem a szórásnégyzeteket). A ± 2,2 a különbség SE-je – az 1,96 maradt el.`
        },
        {
          type: "match",
          q: "Menetrend: melyik eszköz kell? Párosítsd!",
          pairs: [
            [R`25 doboz átlagáról kérdezünk, $\sigma$ ismert`, "normális eloszlás, SE = σ/√n"],
            [R`normális sokaság, átlag, $\sigma$ ismeretlen, 8 elemű minta`, "t-eloszlás, n − 1 szabadságfok"],
            ["normális sokaság, egyetlen minta szórásnégyzetének ingadozása", "khi-négyzet-eloszlás"],
            ["egy erősen ferde, 40 elemű minta mediánjának standard hibája", "bootstrap"],
            ["a tavalyi 5 legrosszabb iskola idén javult", "regresszió a középhez"]
          ],
          hint: "Először azt döntsd el, mi a statisztika (átlag, szórásnégyzet, medián), aztán: ismert-e σ, van-e képlet, és hogyan választották ki a csoportot?",
          explain: R`Átlag ismert $\sigma$-val: CHT, standardizálás $\sigma/\sqrt n$-nel. Ha $\sigma$ helyett $s$-sel standardizálunk (normális sokaság): $t_{n-1}$ – kis mintánál ez sokat számít. A szórásnégyzet ingadozása: $(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$. A mediánra nincs egyszerű képlet, és a ferdeség miatt a normális közelítés is kétséges: bootstrap. A szélső eredmény alapján kiválasztott csoport javulása részben regresszió a középhez – kontrollcsoport nélkül nem tulajdonítható beavatkozásnak.`
        }
      ]
    },
