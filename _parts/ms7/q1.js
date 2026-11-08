    /* ------------------------------------------------ 7.1 */
    "ms7-71": {
      title: "Kvíz – 7.1 A gondolatmenet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`6 csésze tea: 3 „tej előbb” (T) és 3 „tea előbb”. A hölgy kiválaszt 3-at, amelyeket T-nek gondol. Mennyi az esélye, hogy csak tippel, és mégis mind a 3 T-t eltalálja?`,
          options: [R`$1/20 = 0{,}05$`, R`$1/8 = 0{,}125$`, R`$1/6 \approx 0{,}167$`, R`$1/120 \approx 0{,}008$`],
          answer: 0,
          hint: R`Tippelésnél minden 3-as választás egyformán valószínű. Hány 3 elemű részhalmaza van 6 csészének – és számít-e a sorrend?`,
          explain: R`$\binom63 = 20$ egyformán valószínű választás van, ebből egy a tökéletes: $1/20 = 0{,}05$. Az $1/8 = (1/2)^3$ úgy számol, mintha a csészéket egymástól függetlenül, pénzfeldobással találgatná – de a hölgy tudja, hogy pontosan 3 T van. Az $1/6$ a 4 csészés kísérlet eredménye. Az $1/120 = 1/(6\cdot5\cdot4)$ a sorrendet is számolja (variáció), pedig csak az számít, melyik 3 csészét választja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Fisher 8 csészéje (4 T, 4 tea): a hölgy 3 T-csészét talál el. Mennyi a valószínűsége tippelés mellett, hogy <em>legalább</em> 3-at eltalál?`,
          options: [R`$17/70 \approx 0{,}243$`, R`$16/70 \approx 0{,}229$`, R`$1/70 \approx 0{,}014$`, R`$53/70 \approx 0{,}757$`],
          answer: 0,
          hint: R`A 0–4 találat esetszámai a 70-ből: 1, 16, 36, 16, 1. Mely értékek „legalább 3”?`,
          explain: R`Legalább 3 = pontosan 3 vagy 4: $(16 + 1)/70 = 17/70 \approx 0{,}243$ – tippeléssel is minden negyedik-ötödik kísérletben előfordul, nem meglepő. A $16/70$ a „pontosan 3”, kimarad belőle a még szélsőségesebb 4. Az $1/70$ a tökéletes eredményé. Az $53/70$ az ellentett esemény (legfeljebb 2 találat).`
        },
        {
          type: "single", shuffle: true,
          q: R`Szabályos érmével 10 dobásból mennyi a valószínűsége, hogy 8 vagy több fej jön?`,
          options: [R`$56/1024 \approx 0{,}055$`, R`$45/1024 \approx 0{,}044$`, R`$11/1024 \approx 0{,}011$`, R`$968/1024 \approx 0{,}945$`],
          answer: 0,
          hint: R`Add össze a 8, 9 és 10 fej esetszámait: $\binom{10}{8}$, $\binom{10}{9}$, $\binom{10}{10}$, és oszd el $2^{10}$-zel.`,
          explain: R`$\frac{45 + 10 + 1}{1024} = \frac{56}{1024} \approx 0{,}055$. A $45/1024$ csak a „pontosan 8” – a szélsőségesebb eseteket is bele kell venni. A $11/1024$ a „9 vagy több”. A $0{,}945$ az ellentett esemény (legfeljebb 7 fej).`
        },
        {
          type: "multi",
          q: R`Melyik jó nullhipotézis? (Több jó válasz is lehet.)`,
          options: [
            R`$H_0$: $\mu = 200$ (a joghurtok átlagos töltése a szabvány szerinti)`,
            R`$H_0$: $\bar x = 200$`,
            R`$H_0$: $p = 1/6$ (a kockán a hatos esélye szabályos)`,
            "„A hölgy csak tippel.”",
            "„A hölgy jobban teljesít a tippelésnél.”"
          ],
          answer: [0, 2, 3],
          hint: R`A nullhipotézis az „unalmas” állítás, amely pontosan meghatároz egy valószínűségi modellt. És miről szól: a sokaságról vagy a mintáról?`,
          explain: R`$\mu = 200$, $p = 1/6$ és „csak tippel” pontos modellt adnak, amellyel számolni lehet – jó nullhipotézisek. A $\bar x = 200$ hibás: a mintaátlagot kiszámoljuk, a hipotézis a sokasági $\mu$-ről szól. „Jobban teljesít a tippelésnél” az ellenhipotézis ($H_1$): nem mondja meg, mennyivel, így nem lehet vele valószínűséget számolni.`
        },
        {
          type: "match",
          q: R`Párosítsd a bírósági analógia elemeit a hipotézisvizsgálat lépéseivel!`,
          pairs: [
            ["ártatlanság vélelme", "a nullhipotézisből indulunk ki"],
            ["a vád bizonyítékokat mutat be", "adatot gyűjtünk"],
            ["„minden kétséget kizáróan” bűnös → elítélik", "elvetjük a nullhipotézist"],
            ["nincs elég bizonyíték → felmentik", "nem vetjük el a nullhipotézist"]
          ],
          hint: "Az ártatlanság az „unalmas” kiinduló állapot. Mikor ítélik el a vádlottat – és mit jelent a felmentés?",
          explain: R`A vádlott ártatlan, amíg az ellenkezőjét nem bizonyítják – ez a $H_0$. Ha az adat $H_0$ mellett nagyon valószínűtlen („minden kétséget kizáróan”), elvetjük. A felmentés nem azt mondja, hogy a vádlott ártatlan, csak hogy nem bizonyították a bűnösségét – ugyanígy a „nem vetjük el” sem bizonyítja $H_0$-t.`
        },
        {
          type: "single", shuffle: true,
          q: R`100 dobásból 60 fej jött. Miért a $P(X \ge 60 \mid H_0)$-t nézzük, és nem a $P(X = 60 \mid H_0)$-t?`,
          options: [
            "Mert 100 dobásnál minden konkrét érték valószínűtlen (még az 50 is csak kb. 8%); azt mérjük, mennyire valószínű ilyen vagy még szélsőségesebb eredmény.",
            R`Mert a $P(X = 60)$ binomiális eloszlásnál nem számolható ki.`,
            R`Mert a $P(X \ge 60 \mid H_0)$ annak a valószínűsége, hogy az érme szabályos.`,
            R`Mert a $P(X \ge 60)$ mindig kisebb, mint a $P(X = 60)$, így szigorúbb.`
          ],
          answer: 0,
          hint: "Mennyi lenne a „pontosan 50 fej” valószínűsége – a szabályos érme legvalószínűbb eredményéé? Meglepő-e az?",
          explain: R`Egy konkrét érték valószínűsége akkor is kicsi, ha teljesen hétköznapi: $P(X = 50) \approx 0{,}08$. A kérdés az, hogy az eredmény a szélen van-e, ezért a „legalább ilyen szélsőséges” valószínűségét nézzük. A $P(X = 60)$ simán kiszámolható. A $P(X \ge 60 \mid H_0)$ a $H_0$ <b>feltételezésével</b> számolt valószínűség, nem $H_0$ valószínűsége. És a $P(X \ge 60)$ sosem kisebb a $P(X = 60)$-nál, hiszen tartalmazza.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szabályos érmével $P(20 \text{ dobásból} \ge 15 \text{ fej}) = 0{,}021$ és $P(100 \text{ dobásból} \ge 60 \text{ fej}) = 0{,}028$. Melyik eredmény meglepőbb $H_0$ mellett?`,
          options: [
            R`A 20-ból 15, mert $H_0$ mellett kisebb a valószínűsége ($0{,}021 \lt 0{,}028$).`,
            "A 100-ból 60, mert nagyobb mintán született.",
            "A 20-ból 15, mert a 75% messzebb van az 50%-tól, mint a 60%.",
            "Egyformán meglepők, mert mindkettő 5% alatt van."
          ],
          answer: 0,
          hint: "Mi méri a meglepetést: a fejek aránya, vagy a $H_0$ melletti valószínűség?",
          explain: R`A meglepetést a $H_0$ melletti valószínűség méri: $0{,}021 \lt 0{,}028$, tehát a 20-ból 15 egy kicsit meglepőbb. A „75% messzebb van” jó következtetés rossz indokkal: kis mintán a véletlen sokkal nagyobb kilengéseket okoz, ezért a százalék önmagában félrevezet (20-ból 13 = 65% például nem lenne meglepő). A nagyobb minta önmagában nem tesz meglepőbbé egy eredményt, és a két valószínűség nem egyforma, csak mindkettő kicsi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a próbastatisztika Fisher teás kísérletében (8 csésze, 4 T), és milyen az eloszlása $H_0$ mellett?`,
          options: [
            "Az eltalált T-csészék száma; hipergeometrikus eloszlású (1, 16, 36, 16, 1 eset a 70-ből).",
            R`Az eltalált T-csészék száma; $\mathrm{Bin}(4;\ 0{,}5)$ eloszlású.`,
            "A hölgy ügyessége; ezt akarjuk kimutatni.",
            R`A p-érték, ami $H_0$ mellett $1/70$.`
          ],
          answer: 0,
          hint: "A próbastatisztika a mintából számolt szám, amelynek eloszlását $H_0$ mellett ismerjük. Függetlenek-e a csészénkénti tippek, ha a hölgy tudja, hogy pontosan 4 T van?",
          explain: R`A próbastatisztika az eltalált T-csészék száma; $H_0$ mellett a 4 T-ből $k$-t és a 4 teásból $4-k$-t választ: $\binom4k\binom4{4-k}$ eset a 70-ből – hipergeometrikus eloszlás. A binomiális modell független tippeket feltételezne, de itt pontosan 4 csészét kell kiválasztani. Az „ügyesség” nem a mintából számolt szám, hanem amit $H_1$ állít. A p-érték a próbastatisztikából számolódik, nem maga a próbastatisztika (és csak a 4 találatnál $1/70$).`
        }
      ]
    },

    /* ------------------------------------------------ 7.2 */
    "ms7-72": {
      title: "Kvíz – 7.2 Kritikus tartomány és szignifikanciaszint",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`100 dobás, $H_0$: $p = 0{,}5$, kétoldali próba 5%-on. Ismert: $P(X \ge 59) = 0{,}044$, $P(X \ge 60) = 0{,}028$, $P(X \ge 61) = 0{,}018$. Mi a kritikus tartomány?`,
          options: [
            R`$X \le 39$ vagy $X \ge 61$`,
            R`$X \le 40$ vagy $X \ge 60$`,
            R`$X \le 41$ vagy $X \ge 59$`,
            R`$X \ge 59$`
          ],
          answer: 0,
          hint: R`Kétoldali próbánál az 5% két részre oszlik. Melyik az a legkisebb $k$, amelynél a felső farok még nem lépi túl a 2,5%-ot?`,
          explain: R`Mindkét szélen legfeljebb 2,5% lehet: $P(X \ge 61) = 0{,}018 \le 0{,}025$, de $P(X \ge 60) = 0{,}028 \gt 0{,}025$. Szimmetria miatt a bal oldalon $X \le 39$. Az $X \le 40$ vagy $X \ge 60$ összesen 5,7%-ot adna – túllépi az $\alpha$-t. Az $X \le 41$ vagy $X \ge 59$ mindkét oldalra a teljes 5%-ot engedi (összesen 8,9%). Az $X \ge 59$ a jobboldali próba kritikus tartománya.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az előző próbánál ($X \le 39$ vagy $X \ge 61$, $P(X \ge 61 \mid H_0) = 0{,}0176$) mennyi a tényleges szignifikanciaszint?`,
          options: ["3,5%", "5%", "1,8%", "2,5%"],
          answer: 0,
          hint: R`A tényleges szint a teljes kritikus tartomány valószínűsége $H_0$ mellett – mindkét szélen.`,
          explain: R`$2 \cdot 0{,}0176 \approx 0{,}035$. Nem pontosan 5%, mert a binomiális eloszlás diszkrét: a határt csak egész értéknél húzhatjuk meg, úgy, hogy ne lépjük túl az $\alpha$-t. Az 1,8% csak az egyik szél. A 2,5% az oldalankénti megengedett felső korlát, nem a tényleges érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Standard normális próbastatisztika, $\alpha = 3\%$, kétoldali próba (joghurtpélda). Mi a kritikus érték? ($z_{0{,}97} = 1{,}88$, $z_{0{,}985} = 2{,}17$)`,
          options: [R`$\pm 2{,}17$`, R`$\pm 1{,}88$`, R`$\pm 1{,}96$`, R`$\pm 2{,}576$`],
          answer: 0,
          hint: R`Kétoldali próbánál mekkora valószínűség jut egy-egy szélre?`,
          explain: R`Kétoldalt az $\alpha$ kettéoszlik: 1,5–1,5%, ezért $z_{0{,}985} = 2{,}17$. Az 1,88 az egyoldali 3%-os próbáé ($\alpha$ és $\alpha/2$ összekeverése). Az 1,96 az 5%-os, a 2,576 az 1%-os kétoldali próba kritikus értéke.`
        },
        {
          type: "multi",
          q: R`Joghurt: $\mu_0 = 200$, $\sigma = 4$, $n = 20$, $\bar x = 196$, így $z \approx -4{,}47$; $\alpha = 3\%$. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`Kétoldali próbával ($|z| \ge 2{,}17$) elvetjük $H_0$-t.`,
            R`Baloldali próbával ($z \le -1{,}88$) elvetjük $H_0$-t.`,
            R`Jobboldali próbával ($z \ge 1{,}88$) elvetjük $H_0$-t, mert $|z|$ nagy.`,
            R`Baloldali próbával nem vetjük el, mert $z$ negatív.`,
            R`Mindhárom próba elveti $H_0$-t, mert $|z| \gt 2{,}17$.`
          ],
          answer: [0, 1],
          hint: "Rajzold le, hol van a kritikus tartomány az egyes ellenhipotéziseknél. Hová esik a −4,47?",
          explain: R`Kétoldalt $|{-4{,}47}| \ge 2{,}17$, baloldalt $-4{,}47 \le -1{,}88$ – mindkettő elvet. A jobboldali próba kritikus tartománya a jobb szélen van ($z \ge 1{,}88$); a $-4{,}47$ oda nem esik, így ez a próba nem veszi észre az alultöltést – ezért kell az oldalt a kérdéshez illeszteni. A baloldali próbánál épp a negatív $z$ a gyanús irány.`
        },
        {
          type: "single", shuffle: true,
          q: R`Standard normális próbastatisztika, $z = 1{,}8$, $\alpha = 5\%$. Mi a döntés kétoldali, illetve jobboldali próbánál?`,
          options: [
            "Kétoldali: nem vetjük el; jobboldali: elvetjük.",
            "Kétoldali: elvetjük; jobboldali: nem vetjük el.",
            "Mindkettőnél elvetjük.",
            "Egyiknél sem vetjük el."
          ],
          answer: 0,
          hint: R`Kétoldali 5%: $|z| \ge 1{,}96$; egyoldali 5%: $z \ge 1{,}645$.`,
          explain: R`Kétoldalt $1{,}8 \lt 1{,}96$ → nem vetjük el; jobboldalt $1{,}8 \ge 1{,}645$ → elvetjük. Egyoldali próbánál a teljes $\alpha$ egy oldalon van, ezért ott könnyebb elvetni. Ha valaki a 1,645-öt kétoldali, az 1,96-ot egyoldali határnak hiszi, a fordított választ kapja. (Az oldalt persze előre kell rögzíteni, nem az eredmény láttán.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Joghurt: $\mu_0 = 200$, $\sigma = 4$, $n = 20$, de most $\bar x = 199$. Mi a $z$, és mi a döntés baloldali próbával, $\alpha = 3\%$-on ($z \le -1{,}88$)?`,
          options: [
            R`$z \approx -1{,}12$, nem vetjük el`,
            R`$z \approx -1{,}12$, elvetjük`,
            R`$z = -0{,}25$, nem vetjük el`,
            R`$z = -5$, elvetjük`
          ],
          answer: 0,
          hint: R`$z = \frac{\bar x - \mu_0}{\sigma/\sqrt n}$ – a standard hibával osztunk, nem a szórással.`,
          explain: R`$\mathrm{SE} = 4/\sqrt{20} \approx 0{,}894$, $z = -1/0{,}894 \approx -1{,}12 \gt -1{,}88$, ezért nem vetjük el. A $-0{,}25$ a $\sigma$-val oszt ($\sqrt n$ nélkül), a $-5$ a $\sigma/n$-nel – mindkettő a standard hibát rontja el. Az „elvetjük” a negatív előjelből következtetne, de $-1{,}12$ nincs a kritikus tartományban.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató kétoldali próbát végez: $p = 0{,}07$. Ekkor átvált egyoldalira, $p = 0{,}035$, és „5%-on szignifikáns” eredményt közöl. Mi a gond?`,
          options: [
            "Az oldalt az adatok láttán választotta: ha mindig a neki kedvező próbát közli, az elsőfajú hiba valószínűsége 5% fölé nő (akár 10%).",
            "Semmi: az egyoldali próba is érvényes próba, és 0,035 ≤ 0,05.",
            "Az egyoldali p-t duplázni kellett volna (0,14), nem felezni.",
            "Csak annyi, hogy az egyoldali próbánál 1%-os szintet kellett volna választani."
          ],
          answer: 0,
          hint: "Mikor kell eldönteni, hogy egy- vagy kétoldali a próba – az adatok előtt vagy után?",
          explain: R`Az egyoldali próba önmagában érvényes, ha a kérdés és az irány <b>előre</b> rögzített. Aki az eredmény láttán választ, az valójában mindkét lehetőséget fenntartja, és így a téves riasztás esélye nő – ez a p-hacking egy formája. Az egyoldali p a kétoldali fele (jó irányú eltérésnél), tehát a 0,035 maga nem számolási hiba – a gond a választás időzítése. Szigorúbb szint utólag szintén nem orvosolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`10 dobásból 7 fej; $P(X \ge 7 \mid p = 0{,}5) \approx 0{,}17$, így $H_0$-t nem vetjük el. Mi a helyes megfogalmazás?`,
          options: [
            "Az adat nem mond ellent a szabályos érmének – de egy erősen cinkelt (pl. 70%-os) érmének sem; 10 dobás kevés a megkülönböztetéshez.",
            "Bebizonyítottuk, hogy az érme szabályos.",
            R`$H_0$-t elfogadjuk: az érme fejvalószínűsége $0{,}5$.`,
            R`Az érme $1 - 0{,}17 = 83\%$ eséllyel szabályos.`
          ],
          answer: 0,
          hint: "Felmentés ≠ ártatlanság. Mi történne, ha az érme valójában 70%-ban fejre esne – milyen eredmények jönnének 10 dobásból?",
          explain: R`A „nem vetjük el” gyenge állítás: az adat összefér $H_0$-val, de a 0,7-es érmével is (ilyenkor 10 dobásból kb. 70% eséllyel 6–8 fej jön). A 95%-os Wilson-intervallum kb. $[0{,}40;\ 0{,}89]$. A „bebizonyítottuk” és az „elfogadjuk” azt sugallja, hogy $H_0$ igazolódott – a hiányzó bizonyíték nem bizonyítéka a hiánynak. Az $1 - p$ pedig nem $H_0$ valószínűsége (lásd 7.3).`
        }
      ]
    },

    /* ------------------------------------------------ 7.3 */
    "ms7-73": {
      title: "Kvíz – 7.3 A p-érték",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mi a p-érték?`,
          options: [
            R`Annak valószínűsége, hogy – ha $H_0$ igaz – a próbastatisztika legalább olyan szélsőséges értéket vesz fel, mint amit megfigyeltünk.`,
            R`Annak valószínűsége, hogy $H_0$ igaz.`,
            "Annak valószínűsége, hogy a megfigyelt hatás csak a véletlen műve.",
            R`Annak valószínűsége, hogy – ha $H_0$ igaz – pontosan a megfigyelt eredményt kapjuk.`
          ],
          answer: 0,
          hint: R`A p-érték egy feltételes valószínűség. Mi áll a feltételben: $H_0$ vagy az adat?`,
          explain: R`$p = P(\text{a megfigyeltnél nem kevésbé szélsőséges eredmény} \mid H_0)$. A „$H_0$ valószínűsége” és a „csak véletlen műve” ugyanaz a hiba: az $P(H_0 \mid \text{adat})$ volna, a feltétel megfordítása („az ügyész tévedése”). A „pontosan a megfigyelt” kimarad a szélsőségesebb esetekből – és egy konkrét érték mindig valószínűtlen.`
        },
        {
          type: "single", shuffle: true,
          q: R`100 dobásból 60 fej. $P(X \ge 60 \mid H_0) \approx 0{,}028$. Mennyi a kétoldali p-érték (pontos binomiális eloszlással)?`,
          options: ["0,057", "0,028", "0,046", "0,972"],
          answer: 0,
          hint: R`Kétoldali próbánál „szélsőségesebb” = legalább ennyire messze az 50-től, <em>bármelyik</em> irányban.`,
          explain: R`$P(X \ge 60) + P(X \le 40) \approx 2 \cdot 0{,}028 = 0{,}057$ – 5%-on nem szignifikáns (egyoldalról viszont igen). A 0,028 az egyoldali p, a duplázás elmaradt. A 0,046 a normális közelítés ($z = 2$) folytonossági korrekció nélkül – határesetben épp a rossz döntést adja. A 0,972 az $1 - p$ (egyoldali).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy standard normális próbastatisztika értéke $z = 2{,}5$; $\Phi(2{,}5) \approx 0{,}9938$. Mennyi a kétoldali p-érték?`,
          options: ["0,0124", "0,0062", "0,9938", "0,0248"],
          answer: 0,
          hint: R`Egy farok: $1 - \Phi(2{,}5)$. Kétoldalt hány farok számít?`,
          explain: R`Egyoldali: $1 - 0{,}9938 = 0{,}0062$; kétoldali: $2 \cdot 0{,}0062 = 0{,}0124$. A 0,0062 az egyoldali (elfelejtett duplázás). A 0,9938 maga a $\Phi$-érték, nem farokvalószínűség. A 0,0248 kétszer duplázott.`
        },
        {
          type: "single", shuffle: true,
          q: R`1000 kutatás: 200-ban valódi hatás van, 800-ban nincs ($H_0$ igaz). Mindegyik 5%-os szinten tesztel, a próbaerő 80%. A szignifikáns eredmények hány százaléka téves riasztás?`,
          options: ["20%", "5%", "25%", "4%"],
          answer: 0,
          hint: "Készíts táblázatot: hány szignifikáns a valódi hatásúak közül, és hány a hatás nélküliek közül? Utána: téves / összes szignifikáns.",
          explain: R`Valódi: $200 \cdot 0{,}8 = 160$ szignifikáns; nincs hatás: $800 \cdot 0{,}05 = 40$ szignifikáns. Téves: $40 / (160 + 40) = 20\%$. Az 5% az $\alpha = P(\text{szignifikáns} \mid H_0)$ – nem azonos a $P(H_0 \mid \text{szignifikáns})$-sal. A 25% $= 40/160$ a valódi találatokkal oszt, nem az összes szignifikánssal. A 4% $= 40/1000$ az összes kutatással.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`$p = 0{,}03$ esetén az eredmény 5%-on szignifikáns, 1%-on nem.`,
            "A p-érték az a legkisebb szignifikanciaszint, amelyen az eredmény még elvetést jelentene.",
            R`Ha $H_0$ igaz (folytonos próbastatisztikánál), a p-érték egyenletes eloszlású $[0;\ 1]$-en.`,
            "Kis p-érték nagy hatást jelent.",
            R`$p = 0{,}049$ és $p = 0{,}051$ alapvetően különböző bizonyítékot jelent.`
          ],
          answer: [0, 1, 2],
          hint: "Döntés: $p \\le \\alpha$ → elvetjük. A p függ-e a minta nagyságától is?",
          explain: R`Az első három igaz: $0{,}03 \le 0{,}05$, de $0{,}03 \gt 0{,}01$; a p épp az elvetéshez szükséges legkisebb $\alpha$; és $H_0$ mellett $P(p \le \alpha) = \alpha$, vagyis egyenletes. <b>Hamis</b>, hogy kis p = nagy hatás: a p a mintanagyságtól is függ, óriási mintán apró hatás is kicsi p-t ad. <b>Hamis</b> a 0,049 vs 0,051: gyakorlatilag ugyanazt mondják, az 5%-os határ konvenció.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teát kóstoló hölgy mind a 4 T-csészét eltalálja: $p = 1/70 \approx 0{,}014$. Melyik a helyes megfogalmazás?`,
          options: [
            "Ha a hölgy csak tippelne, ilyen jó eredményt kb. 70 kísérletből egyszer érne el; ez 5%-on szignifikáns bizonyíték arra, hogy jobban teljesít a tippelésnél.",
            "98,6% az esélye, hogy a hölgy tényleg érzi a különbséget.",
            "1,4% az esélye, hogy a hölgy csak tippelt.",
            "Az eredmény 1%-os szinten is szignifikáns."
          ],
          answer: 0,
          hint: "A p-értéket valamilyen feltevés mellett számoltuk. Melyik mellett? És hogy viszonyul 0,014 az 1%-hoz?",
          explain: R`A p-érték a „csak tippel” feltevés mellett számolt valószínűség: tippeléssel 70-ből egyszer jönne ki ilyen eredmény. A „98,6% érzi” ($1 - p$) és az „1,4% hogy tippelt” egyaránt $H_0$ valószínűségének olvassa a p-t – ez a leggyakoribb félreértés. Az 1%-os szinten nem szignifikáns, mert $0{,}014 \gt 0{,}01$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsgálatban $p = 0{,}01$, a pontos megismétlésben $p = 0{,}25$ (a próbaerő kb. 50%). Mi a legjobb értelmezés?`,
          options: [
            "Ez a p-érték természetes ingadozása: mérsékelt erőnél valódi hatás mellett is ilyen tágan szóródik.",
            "Az első vizsgálat biztosan hibás volt.",
            "A második vizsgálat bebizonyította, hogy nincs hatás.",
            "A két p átlaga (0,13) a „valódi” p-érték."
          ],
          answer: 0,
          hint: "A p-érték a mintából számolódik – tehát maga is statisztika. Mit mutatott a 100 000-szer megismételt kísérlet ($d = 0{,}5$, 32 fő csoportonként)?",
          explain: R`A p mintáról mintára változik: $d = 0{,}5$ és 32 fő/csoport mellett (erő kb. 50%) a p-értékek 10%-a 0,0014 alatt, 10%-a 0,46 fölött volt – ugyanaz a valódi hatás mellett. Ezért egyik vizsgálat sem „biztosan hibás”. A nem-szignifikáns megismétlés nem bizonyítja $H_0$-t. P-értékeket átlagolni nincs értelme; helyette a hatásnagyságot és a konfidencia-intervallumot érdemes nézni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ha $H_0$ igaz, mennyi az esélye, hogy két független vizsgálatból legalább az egyik $p \le 0{,}05$-öt ad?`,
          options: ["0,0975", "0,10", "0,0025", "0,05"],
          answer: 0,
          hint: R`$H_0$ mellett egy vizsgálat 5% eséllyel ad $p \le 0{,}05$-öt. Számold ki az ellentett eseményt: egyik sem szignifikáns.`,
          explain: R`$1 - 0{,}95^2 = 0{,}0975$ – majdnem 10%. A 0,10 $= 2 \cdot 0{,}05$ közelítés, a „mindkettő szignifikáns” esetet kétszer számolja. A $0{,}0025 = 0{,}05^2$ annak az esélye, hogy <em>mindkettő</em> szignifikáns. Az 5% egyetlen vizsgálatra igaz. Ez a többszörös tesztelés problémája (7.7).`
        }
      ]
    },

    /* ------------------------------------------------ 7.4 */
    "ms7-74": {
      title: "Kvíz – 7.4 Elsőfajú és másodfajú hiba, próbaerő",
      questions: [
        {
          type: "match",
          q: R`Egy gyógyszervizsgálat $H_0$-ja: „a gyógyszer hatástalan”. Párosítsd a helyzetet a döntés minősítésével!`,
          pairs: [
            ["Hatástalan gyógyszerről kimondjuk, hogy hat.", "elsőfajú hiba"],
            ["Hatásos gyógyszerről nem mutatunk ki hatást.", "másodfajú hiba"],
            ["Hatásos gyógyszerről kimutatjuk, hogy hat.", "helyes döntés – a próbaerő esete"],
            ["Hatástalan gyógyszerről nem mutatunk ki hatást.", "helyes döntés – az igaz nullhipotézist nem vetjük el"]
          ],
          hint: "Először azt döntsd el, igaz-e a $H_0$ (hatástalan-e a gyógyszer), aztán azt, hogy elvetettük-e.",
          explain: R`Igaz $H_0$ elvetése: elsőfajú hiba (téves riasztás, fals pozitív, valószínűsége $\alpha$). Hamis $H_0$ meg nem vetése: másodfajú hiba (elszalasztott hatás, fals negatív, $\beta$). Hamis $H_0$ elvetése: helyes döntés, valószínűsége a próbaerő $1 - \beta$. Igaz $H_0$ megtartása: helyes döntés, $1 - \alpha$. Gyakori hiba a két hibafajta felcserélése.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az érmés kétoldali 5%-os próba (100 dobás, elvetjük, ha $X \le 39$ vagy $X \ge 61$) ereje $p = 0{,}6$ valódi fejvalószínűségnél 0,462. Mennyi a másodfajú hiba valószínűsége ($\beta$)?`,
          options: ["0,538", "0,462", "0,035", "0,965"],
          answer: 0,
          hint: R`A próbaerő $1 - \beta$.`,
          explain: R`$\beta = 1 - 0{,}462 = 0{,}538$: egy 60%-os érmét 100 dobással az esetek több mint felében nem leplezünk le. A 0,462 maga az erő (erő és $\beta$ összekeverése). A 0,035 az $\alpha$ (tényleges elsőfajú hibavalószínűség), a 0,965 pedig $1 - \alpha$ – ezek a $p = 0{,}5$ világhoz tartoznak, nem a $p = 0{,}6$-hoz.`
        },
        {
          type: "single", shuffle: true,
          q: R`IQ-teszt: $H_0$: $\mu = 100$, $\sigma = 15$, jobboldali próba 5%-on ($z \ge 1{,}645$), a valódi $\mu = 105$. 25 fős mintánál az erő 0,51. Mennyi az erő 100 fős mintánál? ($\Phi(1{,}69) \approx 0{,}95$)`,
          options: [R`$\approx 0{,}95$`, R`$\approx 0{,}05$`, R`$\approx 0{,}51$`, R`$\approx 1{,}00$`],
          answer: 0,
          hint: R`Erő $= 1 - \Phi\!\left(1{,}645 - \frac{\mu - \mu_0}{\mathrm{SE}}\right)$, ahol $\mathrm{SE} = \sigma/\sqrt n$.`,
          explain: R`$\mathrm{SE} = 15/\sqrt{100} = 1{,}5$; $1 - \Phi(1{,}645 - 5/1{,}5) = 1 - \Phi(-1{,}69) = \Phi(1{,}69) \approx 0{,}95$. A 0,05 a $\Phi(-1{,}69)$, vagyis a $\beta$. A 0,51 azt hinné, hogy az erő nem függ $n$-től. Az 1,00 a $\sigma/n = 0{,}15$ „standard hibából” jön ($\sqrt n$ helyett $n$).`
        },
        {
          type: "multi",
          q: R`Mitől <b>nő</b> a próbaerő (a többi változatlan)? (Több jó válasz is lehet.)`,
          options: [
            R`Nagyobb a valódi hatás ($\mu - \mu_0$).`,
            R`Nagyobb a mintanagyság ($n$).`,
            R`Nagyobb szignifikanciaszintet választunk (pl. 5% helyett 10%).`,
            R`Nagyobb a szórás ($\sigma$, a zaj).`,
            R`Szigorúbb szignifikanciaszintet választunk (5% helyett 1%).`
          ],
          answer: [0, 1, 2],
          hint: R`Képzeld el a $H_0$ és a valódi eloszlás két haranggörbéjét: mitől távolodnak el, mitől keskenyednek, és merre mozdul a kritikus érték?`,
          explain: R`Nagyobb hatás: messzebb a két eloszlás. Nagyobb $n$: kisebb SE, keskenyebb eloszlások. Nagyobb $\alpha$: közelebb a kritikus érték – de több a téves riasztás. <b>Csökkenti</b> az erőt a nagyobb zaj (több átfedés) és a szigorúbb $\alpha$: az IQ-példában ($n = 25$) 5%-on 0,51, 1%-on csak 0,25.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\mu_0 = 50$, a valódi $\mu = 54$, $\sigma = 8$. Mennyi a Cohen-féle $d$, és Cohen hüvelykujjszabálya szerint mekkora hatás ez?`,
          options: [R`$d = 0{,}5$ – közepes`, R`$d = 4$ – nagy`, R`$d = 0{,}5$ – kicsi`, R`$d = 2$ – nagy`],
          answer: 0,
          hint: R`$d = \frac{\mu - \mu_0}{\sigma}$. Cohen: 0,2 kicsi, 0,5 közepes, 0,8 nagy.`,
          explain: R`$d = 4/8 = 0{,}5$ – közepes hatás. A $d = 4$ a nyers különbség, a szórással nem osztott; a $d = 2$ fordítva oszt ($\sigma / (\mu - \mu_0)$). A „kicsi” a hüvelykujjszabály elnézése: kicsi a 0,2 körüli. A $d$ nem függ a mintanagyságtól.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyoldali $z$-próba, $\alpha = 5\%$ ($z_{0{,}95} = 1{,}645$), közepes hatás: $d = 0{,}5$. Mekkora minta kell 80%-os erőhöz? ($z_{0{,}8} = 0{,}842$)`,
          options: ["25", "5", "11", "32"],
          answer: 0,
          hint: R`Az erő $1 - \Phi(1{,}645 - d\sqrt n)$. 80%-hoz $1{,}645 - d\sqrt n = -0{,}842$ kell – fejezd ki $n$-et.`,
          explain: R`$n = \left(\frac{1{,}645 + 0{,}842}{0{,}5}\right)^2 \approx 24{,}7 \to 25$ (egészre felfelé kerekítünk). Az 5 a négyzetre emelés nélküli $\sqrt n \approx 4{,}97$. A 11 $= (1{,}645/0{,}5)^2$ a 0,842-t hagyja ki – az csak 50%-os erőt adna. A 32 az 1,96-tal (kétoldali kvantilissel) számol egyoldali próbánál.`
        },
        {
          type: "single", shuffle: true,
          q: R`Azonos mintanagyság mellett az $\alpha$-t 5%-ról 1%-ra csökkentjük. Mi történik a másodfajú hiba valószínűségével ($\beta$)?`,
          options: [
            R`Nő (az erő csökken) – adott $n$-nél az egyik hiba csak a másik rovására csökken.`,
            R`Ő is csökken, mert szigorúbb lett a próba.`,
            R`Nem változik, mert $\beta$ csak a valódi hatástól függ.`,
            R`Egyenlő lesz $\alpha$-val, vagyis 1%.`
          ],
          answer: 0,
          hint: R`Merre mozdul a kritikus érték, ha szigorítunk? Mi történik ezzel a valódi eloszlás „elvetési” részével?`,
          explain: R`Szigorúbb $\alpha$ → távolabbi kritikus érték → nehezebb elvetni, a valódi hatást is. Az IQ-példában ($n = 25$) az erő 0,51-ről 0,25-re esik, $\beta$ 0,49-ről 0,75-re nő. $\alpha$ és $\beta$ egyszerre csak nagyobb mintával csökkenthető. $\beta$ függ a hatástól, de $\alpha$-tól, $n$-től és a zajtól is; és nincs semmi oka egyenlőnek lennie $\alpha$-val.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi egy próba „ereje”, ha a valódi paraméter pontosan a $H_0$-beli érték?`,
          options: [R`$\alpha$`, R`$1 - \alpha$`, R`$\beta$`, "0"],
          answer: 0,
          hint: R`Az erő az elvetés valószínűsége a valódi paraméter mellett. Hogy hívjuk az elvetést, ha $H_0$ igaz?`,
          explain: R`Ha a valódi paraméter a $H_0$ értéke, az elvetés valószínűsége épp a szignifikanciaszint, $\alpha$ – ekkor az „elvetés” elsőfajú hiba (az érmés táblázatban $p = 0{,}5$-nél 0,035). Az $1 - \alpha$ a helyes megtartás valószínűsége. A $\beta$ csak hamis $H_0$ mellett értelmes (igaz $H_0$ mellett másodfajú hiba nem lehet). A 0 azt hinné, hogy igaz $H_0$-t sosem vetünk el.`
        }
      ]
    },
