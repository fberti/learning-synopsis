    /* ------------------------------------------------ 7.4 */
    "gh7-74": {
      title: "Kvíz – 7.4 A konfigurációs modell",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A $(2, 2, 2)$ fokszámsorozatra (három csúcs, mindegyik 2 fokú) építesz konfigurációs modellt. Hány félélpárosítás van, és ezek közül hány adja a háromszöget?`,
          options: [
            R`$15$ párosítás, ebből $8$ háromszög`,
            R`$15$ párosítás, ebből $1$ háromszög`,
            R`$720$ párosítás, ebből $8$ háromszög`,
            R`$15$ párosítás, és mind a $15$ háromszög`
          ],
          answer: 0,
          hint: R`Hány félél van összesen? A párosítások száma $(2m - 1)!!$, nem faktoriális. A háromszöghöz minden csúcs két féléle két <b>különböző</b> szomszédhoz kell menjen.`,
          explain: R`$2m = 6$ félél, a párosítások száma $5!! = 5 \cdot 3 \cdot 1 = 15$. A háromszöghöz $a$ egyik félélét $b$-hez, a másikat $c$-hez kell kötni: melyik $a$-félél megy $b$-hez (2), $b$ melyik féléle (2), $c$ melyik féléle kapja $a$ másikát (2) – $2 \cdot 2 \cdot 2 = 8$. A maradék 7 párosításban hurok van. Az „$1$” abból a tévedésből jön, hogy egy gráfhoz egy párosítás tartozik – pedig a félélek megkülönböztethetők. A $720 = 6!$ a félélek sorbarendezése, nem a párokba rendezése. A „mind a 15” azt feltételezi, hogy hurok nem fordulhat elő – de a konfigurációs modellben előfordul.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 25 élű gráfban két csúcs fokszáma 5 és 4. Hány él várható közöttük a konfigurációs modellben ($k_ik_j/2m$-es közelítéssel)?`,
          options: [R`$0{,}4$`, R`$0{,}8$`, R`$0{,}18$`, R`$20$`],
          answer: 0,
          hint: R`Az egyik csúcs minden féléle a többi félél közül egyenletesen választ párt. Hány félél van egy 25 élű gráfban?`,
          explain: R`$k_ik_j/2m = 5 \cdot 4/50 = 0{,}4$ (pontosan $20/49 \approx 0{,}41$). A $0{,}8 = 20/25$ $m$-mel oszt $2m$ helyett – de a félélek száma $2m$. A $0{,}18 = (5 + 4)/50$ összeadja a fokszámokat: a várható élszám a <b>szorzattal</b> arányos, hiszen mind az 5 félél $4/49$ eséllyel köt ki a másik csúcsnál. A $20$ a nyers szorzat, osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`A politikai blogok két legnagyobb hubjára ($k = 351$ és $306$, $2m = 33\,428$) a $k_ik_j/2m \approx 3{,}2$. Hogyan értsd ezt?`,
          options: [
            R`Várható élszám, nem valószínűség: a modell a hubok között többszörös éleket „vár”; egyszerű gráfban a valódi valószínűség legfeljebb 1.`,
            R`Elszámolás: a képlet valószínűséget ad, ezért 1-nél nagyobb nem jöhet ki.`,
            R`A két hub 3,2% eséllyel van összekötve.`,
            R`A két hub között 3 él van a valódi gráfban, ezt a modell pontosan visszaadja.`
          ],
          answer: 0,
          hint: R`Mit számol a képlet: egy esélyt vagy egy darabszám várható értékét? Mi történik a félélpárosításban két csúcs között, amelyeknek rengeteg féléle van?`,
          explain: R`A $k_ik_j/2m$ az $i$ és $j$ közötti élek <b>várható száma</b>. A félélpárosításban két hub között több él is keletkezhet, ezért lehet 1 fölött. Egyszerű gráfban két csúcs között legfeljebb 1 él van, így ott a valószínűség „telítődik”, ennél kisebb. A tipikus hiba éppen a képletet valószínűségnek venni (és az 1 fölötti értéket hibának vagy százaléknak olvasni). A modell semmit sem „ad vissza” a valódi élekből – csak a fokszámokat ismeri, és az egyszerű bloggráfban két csúcs között amúgy sem lehet 3 él.`
        },
        {
          type: "multi",
          q: R`Mit tart meg biztosan a fokszámtartó élcsere ($a$–$b$, $c$–$d$ → $a$–$d$, $c$–$b$, a hurkot / többszörös élt adó próbákat eldobva)? (Több jó válasz is lehet.)`,
          options: [
            R`minden csúcs fokszámát`,
            R`az élek számát`,
            R`hogy a gráf egyszerű marad (nincs hurok, többszörös él)`,
            R`a háromszögek számát`,
            R`az összefüggő komponensek számát`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a két háromszögre, amelyből egyetlen cserével hatszög lett. Mi változott, és mi nem?`,
          explain: R`A cserében mind a négy csúcs egy élvéget lead és egyet visszakap: a fokszámok, így az élszám is maradnak. Mivel a hurkot vagy többszörös élt adó próbát eldobjuk, a gráf egyszerű marad. A háromszögek és a komponensek viszont változhatnak: a két háromszögből (2 háromszög, 2 komponens) egy csere után hatszög lett (0 háromszög, 1 komponens). Pont ezért mérhető vele, hogy a háromszögek „a fokszámokból jönnek-e”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $1$–$2$–$3$–$4$–$5$ úton cseréld meg az $1$–$2$ és a $4$–$5$ élt $1$–$5$-re és $4$–$2$-re! Mi lesz az eredmény?`,
          options: [
            R`Egy háromszög ($2$–$3$–$4$) és egy különálló $1$–$5$ él; a fokszámok változatlanok.`,
            R`Érvénytelen csere: többszörös él keletkezne, ezért eldobjuk.`,
            R`Ugyanaz az út, csak más sorrendben: $1$–$5$–$4$–$3$–$2$.`,
            R`A $2$ és a $4$ csúcs fokszáma 3 lesz, az $1$-é és az $5$-é 0.`
          ],
          answer: 0,
          hint: R`Írd fel az új élhalmazt: a $2$–$3$ és a $3$–$4$ marad, ehhez jön a két új él. Létezett-e már a $2$–$4$ él?`,
          explain: R`Az új élek: $2$–$3$, $3$–$4$, $1$–$5$, $2$–$4$. A $2$–$4$ korábban nem létezett, hurok sincs, tehát a csere érvényes. A $2$, $3$, $4$ háromszöget alkot, az $1$–$5$ él külön komponens. A fokszámok ugyanazok: $(1, 2, 2, 2, 1)$ – hiszen minden csúcs egy élvéget lead és egyet kap. A cserétől lett egy háromszög, és szétesett a gráf: az élcsere a háromszögeket és a komponenseket nem őrzi. (A másik változat, $1$–$4$ és $5$–$2$, az $1$–$4$–$3$–$2$–$5$ utat adná.)`
        },
        {
          type: "single", shuffle: true,
          q: R`500 véletlen gráfot sorsoltál a nullmodellből; 4-ben volt legalább akkora a vizsgált érték, mint a megfigyelt gráfban. Mennyi az empirikus p-érték, $\hat p$?`,
          options: [R`$\approx 0{,}010$`, R`$0{,}008$`, R`$\approx 0{,}002$`, R`$\approx 0{,}992$`],
          answer: 0,
          hint: R`A képletben a számlálóhoz és a nevezőhöz is hozzáadunk valamit. Miért?`,
          explain: R`$\hat p = (1 + 4)/(1 + 500) = 5/501 \approx 0{,}010$. Az 1-esek a megfigyelt gráfot is beszámolják a véletlenek közé – így $\hat p$ sosem 0. A $0{,}008 = 4/500$ a +1-ek nélküli arány. A $0{,}002 \approx 1/501$ a legkisebb mondható érték (ha egyikben sem lett volna ennyi), itt nem az. A $0{,}992$ a fordított irány: azok aránya, amelyekben <b>kevesebb</b> jött ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét 4 háromszögét a fokszámtartó nullmodellhez mérve (átlag $2{,}40$, szórás $0{,}84$, legfeljebb 4 háromszög) $z \approx 1{,}9$. Mit mondhatsz a p-értékről?`,
          options: [
            R`Az empirikus arányt kell közölni (kb. 8% a véletlen gráfok közül ér el 4-et); a normális közelítés ($p \approx 0{,}03$) itt félrevezet.`,
            R`$p \approx 0{,}03$, hiszen a normális eloszlásban $z = 1{,}9$ fölé ennyi esik – tehát 5%-os szinten szignifikáns.`,
            R`$p$ nem számolható, mert a $z$ 2 alatt van.`,
            R`$p = 0$, mert egyetlen véletlen gráfban sem volt 4-nél több háromszög.`
          ],
          answer: 0,
          hint: R`Milyen alakú egy kis gráf nulleloszlása? Hány különböző értéket vehet fel a háromszögszám, ha legfeljebb 4 lehet?`,
          explain: R`A $z = (4 - 2{,}40)/0{,}84 \approx 1{,}9$ helyes, de normális p-értékké alakítani hiba: a nulleloszlás diszkrét (0–4), ferde, és a 4 itt éppen a maximum. A valódi arány kb. 0,08 – nem szignifikáns 5%-on, szemben a normálisból számolt 0,03-dal. A „$p = 0$” kétszeresen rossz: a kérdés a „legalább 4”, nem a „több mint 4”, és $\hat p = 0$-t amúgy sem közlünk. A $z$-ből és az empirikus $p$-ből is lehet mondani valamit – csak tudni kell, melyik mit jelent.`
        }
      ]
    },

    /* ------------------------------------------------ 7.5 */
    "gh7-75": {
      title: "Kvíz – 7.5 Melyik nullmodell?",
      questions: [
        {
          type: "match",
          q: R`Párosítsd a nullmodellt azzal, amit rögzít (megtart)!`,
          pairs: [
            [R`$G(n, m)$`, "csak a csúcsok és az élek számát"],
            ["konfigurációs modell / élcsere", "minden csúcs fokszámát"],
            ["páros (cikk–szereplő) nullmodell", "a cikkek szereplőszámát és a szereplők cikkszámát"],
            ["laptulajdonság-permutáció", "a cikkek tartalmát és a lapok cikkszámát"],
            ["rétegzett permutáció", "a címkék keverését eseményen belül"]
          ],
          hint: R`A létrán felfelé haladva egyre több mindent rögzítünk. A két utolsó nem a gráfot keveri, hanem egy címkét (melyik lapé a cikk).`,
          explain: R`$G(n, m)$: csak $n$ és $m$ (így az átlagos fokszám). A konfigurációs modell / élcsere ehhez hozzáveszi a fokszámsorozatot. A páros nullmodell a cikk–szereplő táblát keveri, rögzített sor- és oszlopösszegekkel. A laptulajdonság-permutáció a cikkeket hagyja, csak a lapcímkét keveri (a lapok cikkszámát megtartva). A rétegzett permutáció ugyanezt eseményen belül teszi, hogy az események közti különbség ne keveredjen a lapok közöttivel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét 4 háromszögét háromféle nullmodellhez mérted. Melyik összegzés helyes?`,
          options: [
            R`$G(n, m)$-hez átlagos ($z \approx 0{,}7$), fokszámtartóhoz inkább sok ($z \approx 1{,}9$), a páros nullmodellhez kevés ($z \approx -1{,}6$).`,
            R`$G(n, m)$-hez kevés, fokszámtartóhoz átlagos, a páros nullmodellhez sok.`,
            R`Mindhárom szerint sok, csak a $z$ nagysága különbözik.`,
            R`$G(n, m)$-hez sok ($z \approx 1{,}9$), fokszámtartóhoz átlagos ($z \approx 0{,}7$), a páros nullmodellhez kevés.`
          ],
          answer: 0,
          hint: R`Gondold végig, melyik modell tudja, hogy a háromszereplős cikkek „gyári” háromszögeket adnak. Az ilyen modellben több vagy kevesebb háromszög várható?`,
          explain: R`$G(n, m)$: $3{,}15 \pm 1{,}17$, a 4 átlagos. Fokszámtartó: $2{,}40 \pm 0{,}84$, a 4 inkább sok (8%). Páros nullmodell: $8{,}34 \pm 2{,}71$ – a véletlen cikkekben több különböző pár találkozik (13,2 a 10 helyett), így több háromszög jönne ki, a 4 kevés (csak 6% eséllyel jön ki legfeljebb 4). Ugyanaz a szám, három ítélet: ezért kell megmondani, mit tart fixen a nullmodell. Az utolsó opció a két első modell $z$-jét cseréli fel.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 12 cikkből a Lakók 4-ben, az Önkéntesek 4-ben szerepelnek. A csak a két gyakoriságot rögzítő (hipergeometrikus) nullmodellben hány közös cikk várható?`,
          options: [R`$\approx 1{,}33$`, R`$8$`, R`$16$`, R`$\approx 0{,}92$`],
          answer: 0,
          hint: R`Az Önkéntesek minden cikke $4/12$ eséllyel esik a Lakók cikkei közé.`,
          explain: R`Várható érték: $4 \cdot 4/12 \approx 1{,}33$. A $8 = 4 + 4$ összeadja, a $16 = 4 \cdot 4$ összeszorozza a gyakoriságokat, de nem osztja a cikkek számával – egyik sem lehet több, mint 4 közös cikk. A $0{,}92$ a <b>páros</b> nullmodell várható értéke, amely a cikkek méretét is rögzíti: ott kevesebb a véletlen „összefutás”, mert egy kétszereplős cikkben csak egy hely marad.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Szakértő 3, a Klímaváltozás 2 cikkben szerepel a 12-ből. A hipergeometrikus nullmodellben mekkora eséllyel van 2 közös cikkük?`,
          options: [R`$\approx 0{,}045$`, R`$\approx 0{,}015$`, R`$\approx 0{,}17$`, R`$0{,}5$`],
          answer: 0,
          hint: R`A Klímaváltozás 2 cikkét húzd a 12-ből. Hány olyan húzás van, amelyben mindkettő a Szakértő 3 cikke közül való?`,
          explain: R`$\binom32/\binom{12}2 = 3/66 \approx 0{,}045$. A $0{,}015 = 1/66$ elfelejti, hogy a Szakértő 3 cikkéből $\binom32 = 3$-féle pár jöhet szóba. A $0{,}17 = 2/12$ egyetlen húzás esélye, nem kettőé. A $0{,}5 = 3 \cdot 2/12$ a közös cikkek <b>várható száma</b>, nem valószínűség.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 2. cikk $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}\}$, a 9. cikk $\{\mathrm{La}, \text{Ön}\}$. Melyik lépés szabályos a páros (cikk–szereplő) nullmodellben?`,
          options: [
            R`A 2. cikkbe $\mathrm{La}$, a 9. cikkbe $\mathrm{Po}$ kerül: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{La}\}$ és $\{\mathrm{Po}, \text{Ön}\}$.`,
            R`A 2. cikkből kivesszük a $\mathrm{Po}$-t, így az is kétszereplős lesz.`,
            R`A 9. cikkbe betesszük a $\mathrm{Ko}$-t, hogy háromszereplős legyen.`,
            R`A vetületen a $\mathrm{Ko}$–$\mathrm{Vi}$ és a $\mathrm{La}$–$\text{Ön}$ élet cseréljük $\mathrm{Ko}$–$\text{Ön}$ és $\mathrm{La}$–$\mathrm{Vi}$ élre.`
          ],
          answer: 0,
          hint: R`Mit kell a páros nullmodellnek minden lépésben megtartania? Nézd meg minden opciónál a cikkek méretét és a szereplők cikkszámát.`,
          explain: R`A sakktábla-csere: $\mathrm{Po}$ szerepel a 2.-ban, de a 9.-ben nem; $\mathrm{La}$ a 9.-ben igen, a 2.-ban nem – megcserélhetők. Mindkét cikk mérete marad (3 és 2), és $\mathrm{Po}$ is, $\mathrm{La}$ is ugyanannyi cikkben szerepel. A kivétel és a betétel megváltoztatja a cikk méretét és egy szereplő gyakoriságát. A vetületen végzett élcsere a tipikus hiba: az együttemlítési gráf éleit nem egyenként „húzták”, egy háromszereplős cikk egyszerre ad 3 élt és egy háromszöget – a páros gráfot kell véletleníteni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Nyitott Szó 3 cikkéből mind a 3 lakossági veszteség keretet használ; a 12 cikkből összesen 5 ilyen. A lapcímkék permutálásával mekkora eséllyel jön ki ez véletlenül?`,
          options: [R`$\approx 0{,}045$`, R`$\approx 0{,}072$`, R`$\approx 0{,}0045$`, R`$\approx 0{,}42$`],
          answer: 0,
          hint: R`Permutáláskor a Nyitott Szó 3 cikke a 12-ből egy véletlen 3-as. Visszatevéssel vagy nélküle húzunk?`,
          explain: R`A 3 cikk visszatevés nélkül kerül a laphoz: $\binom53/\binom{12}3 = 10/220 \approx 0{,}045$. A $0{,}072 = (5/12)^3$ visszatevéses húzást feltételez – mintha ugyanaz a cikk többször is a laphoz kerülhetne. A $0{,}0045 = 1/220$ csak egyetlen kedvező hármast számol a $\binom53 = 10$ helyett. A $0{,}42 = 5/12$ egyetlen cikk esélye.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A hipergeometrikus modell kis (2–3 szereplős) cikkeknél túlbecsüli a véletlen egyezést, és így alábecsüli a kapcsolat erejét.`,
            R`A jó nullmodell azt rögzíti, amit nem akarsz felfedezésnek tekinteni.`,
            R`Minél több tulajdonságot rögzít a nullmodell, annál több marad „meglepőnek”.`,
            R`Ha a nullmodell a teljes vetített gráfot rögzítené, az lenne a legpontosabb próba.`,
            R`Két szereplő közös cikkeinek nyers száma önmagában méri a kapcsolat erejét.`
          ],
          answer: [0, 1],
          hint: R`Gondold végig a létrát: mi történik a „meglepő” résszel, ha egyre többet rögzítesz? És a végletben, ha mindent?`,
          explain: R`A hipergeometrikus modell feltételezi, hogy minden cikkben „van hely” – kis cikkeknél ezért túl sok véletlen egyezést vár (La–Ön: 1,33 a páros nullmodell 0,92-je helyett). A nullmodell azt tartja meg, amit nem akarsz felfedezésnek látni (pl. a szereplők gyakoriságát). Felfelé a létrán egyre több mindent rögzítünk, ezért egyre <b>kevesebb</b> marad meglepőnek. Ha mindent rögzítenél, a nullmodell ugyanazt adná, mint a megfigyelés: nem maradna kérdés. A nyers súly hiba: két gyakori szereplő véletlenül is sok közös cikket kap, a súlyt a nullmodell várható értékéhez kell mérni.`
        }
      ]
    },

    /* ------------------------------------------------ 7.6 */
    "gh7-76": {
      title: "Kvíz – 7.6 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A három kiemelt pár: $\mathrm{Ko}$–$\mathrm{Vi}$ (2 közös cikk), $\mathrm{Sz}$–$\mathrm{Kl}$ (2), $\mathrm{La}$–$\text{Ön}$ (3). Melyiknek a legkisebb a p-értéke a páros nullmodellben?`,
          options: [
            R`$\mathrm{Sz}$–$\mathrm{Kl}$ ($p \approx 0{,}016$), szorosan előtte a $\mathrm{La}$–$\text{Ön}$-nek ($0{,}018$)`,
            R`$\mathrm{La}$–$\text{Ön}$, mert neki van a legtöbb közös cikke`,
            R`$\mathrm{Ko}$–$\mathrm{Vi}$, mert két gyakori szereplő párja`,
            R`Egyforma mindhárom, mert mindhárom pár súlya legalább 2`
          ],
          answer: 0,
          hint: R`A nyers súly nem a meglepetés. A Klímaváltozás hány cikkben szerepel összesen, és ezek közül hányban van ott a Szakértő?`,
          explain: R`A Klímaváltozás mindössze 2 cikkben szerepel, és mindkettőben a Szakértővel: a páros nullmodellben a várható érték csak 0,31, $P(\ge 2) \approx 0{,}016$. A $\mathrm{La}$–$\text{Ön}$ (3 közös, várható 0,92) $p \approx 0{,}018$ – szinte ugyanannyi. A $\mathrm{Ko}$–$\mathrm{Vi}$-nek ugyanaz a súlya (2), mint a $\mathrm{Sz}$–$\mathrm{Kl}$-nek, de $p \approx 0{,}20$: két 4 cikkes szereplő véletlenül is gyakran összefut. A nyers súly sorrendje (La–Ön 3 a többi 2 előtt) nem azonos a meglepetés sorrendjével.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét mind a 21 szereplőpárját megvizsgálod 0,05-os szinten. Mennyi a Bonferroni-korrigált küszöb?`,
          options: [R`$\approx 0{,}0024$`, R`$\approx 0{,}0071$`, R`$\approx 0{,}0012$`, R`$0{,}05$`],
          answer: 0,
          hint: R`A Bonferroni-korrekció a szintet a tesztek számával osztja. Hány tesztet végzel?`,
          explain: R`$0{,}05/21 \approx 0{,}0024$ – ezt egyik pár sem éri el (a legkisebb $p$ is 0,016). A $0{,}0071 = 0{,}05/7$ a csúcsok számával oszt, nem a párokéval. A $0{,}0012 = 0{,}05/42$ a párokat sorrendben számolja ($\mathrm{Ko}$–$\mathrm{Vi}$ és $\mathrm{Vi}$–$\mathrm{Ko}$ ugyanaz a pár). A $0{,}05$ a korrekció elhagyása: 21 tesztnél így tisztán véletlenül is kb. $21 \cdot 0{,}05 \approx 1$ „szignifikáns” pár várható.`
        },
        {
          type: "single", shuffle: true,
          q: R`A páros nullmodellben a $\mathrm{Sz}$–$\mathrm{Kl}$ pár $z$-je 3,4, a $\mathrm{La}$–$\text{Ön}$-é 2,8 – a p-értékük mégis szinte azonos (0,016 és 0,018). Mi ennek az oka?`,
          options: [
            R`A nulleloszlás kevés értéket vehet fel és ferde: a $z$ csak az átlagot és a szórást nézi, a $p$ a teljes eloszlást.`,
            R`Elszámolás: nagyobb $z$-hez mindig kisebb $p$ tartozik.`,
            R`A $\mathrm{Sz}$–$\mathrm{Kl}$ pár kevesebb cikkben szerepel, ezért a $z$-je nem számolható.`,
            R`A $p$-értékek a hipergeometrikus modellből jönnek, a $z$-k a páros nullmodellből.`
          ],
          answer: 0,
          hint: R`Hány különböző értéket vehet fel a $\mathrm{Sz}$–$\mathrm{Kl}$ közös cikkeinek száma, ha a Klímaváltozás csak 2 cikkben szerepel?`,
          explain: R`A $\mathrm{Sz}$–$\mathrm{Kl}$ közös cikkeinek száma csak 0, 1 vagy 2 lehet, és erősen ferde (várható 0,31, szórás kb. 0,5). Ilyen diszkrét, ferde eloszlásnál a $z$ és a $p$ nem fordíthatók egymásba normális táblázattal – a „nagyobb $z$ ⇒ kisebb $p$” csak ugyanolyan alakú eloszlásokra igaz. Ezért kis gráfon a $p$ a megbízhatóbb – ez a 7.4 figyelmeztetése élesben. Mindkét szám ugyanabból a páros nullmodellből jön.`
        },
        {
          type: "single", shuffle: true,
          q: R`A politikai blogokra $\bar C = 0{,}32$, $L = 2{,}74$; az azonos $n$-ű, $m$-ű ER-gráfra $\bar C_{\text{ER}} = 0{,}022$, $L_{\text{ER}} = 2{,}51$. Mennyi a kisvilág-mutató, $\sigma$?`,
          options: [R`$\approx 13$`, R`$\approx 14{,}5$`, R`$\approx 15{,}9$`, R`$\approx 1{,}09$`],
          answer: 0,
          hint: R`$\sigma = \dfrac{C/C_{\text{ER}}}{L/L_{\text{ER}}}$ – két hányados hányadosa.`,
          explain: R`$C/C_{\text{ER}} = 0{,}32/0{,}022 \approx 14{,}5$, $L/L_{\text{ER}} = 2{,}74/2{,}51 \approx 1{,}09$, így $\sigma \approx 14{,}5/1{,}09 \approx 13$. A $14{,}5$ csak a klaszterezettség-hányados – az úthossz-korrekciót elhagyja. A $15{,}9$ szoroz osztás helyett. Az $1{,}09$ csak az úthossz-hányados: azt mutatja, hogy az utak szinte olyan rövidek, mint az ER-ben – ez a kisvilág egyik fele, nem a mutató.`
        },
        {
          type: "single", shuffle: true,
          q: R`A blogok tranzitivitása $C_\Delta \approx 0{,}226$, a fokszámtartó nullmodellé $\approx 0{,}149$, az ER-é $\approx 0{,}022$. A megfigyelt tranzitivitás hány százalékát magyarázzák már a fokszámok?`,
          options: [R`kb. 66%`, R`kb. 10%`, R`kb. 34%`, R`kb. 59%`],
          answer: 0,
          hint: R`Melyik nullmodell tartja meg a fokszámokat? Annak az értékét vesd össze a megfigyelttel.`,
          explain: R`A fokszámtartó modell a fokszámokat (a hubokat) megtartja: $0{,}149/0{,}226 \approx 0{,}66$, tehát kb. kétharmad. A maradék kb. 0,08 a „valódi” helyi szerkezet. A 10% ($0{,}022/0{,}226$) az ER-gráfot használja – az nem tartja meg a fokszámokat. A 34% a <b>meg nem</b> magyarázott rész. Az 59% ($0{,}19/0{,}32$) az átlagos klaszterezettségből ($\bar C$) jön, nem a tranzitivitásból.`
        },
        {
          type: "single", shuffle: true,
          q: R`A blogok fokszámtartó nullmodelljében a tranzitivitás szórása mindössze 0,0003, így a megfigyelt 0,23 kb. 250 szórásnyira van a null 0,15-étől. Mit közölj?`,
          options: [
            R`A $z$ mellett a hatás nagyságát is: 0,15 helyett 0,23 – kb. másfélszeres, valódi, de szerény többlet.`,
            R`Csak a $z \approx 250$-et: ilyen óriási $z$ óriási hatást jelent.`,
            R`Semmit: a $z$ túl nagy, ez biztosan számolási hiba.`,
            R`Csak a $p$-t: „$p = 0$”, mert egyik véletlen gráf sem érte el.`
          ],
          answer: 0,
          hint: R`Nagy hálózaton a nullmodell szórása pici. Mit mond a $z$ – „mennyire biztos” vagy „mennyivel több”?`,
          explain: R`Nagy hálózaton minden eltérés szignifikáns, mert a nulleloszlás nagyon keskeny: a $z$ az eltérés <b>biztosságát</b> méri, nem a nagyságát. A „mennyivel több” kérdésre a válasz szerény: 0,23 vs. 0,15. Ezért a megfigyelt és a null értéket (hányadost vagy különbséget) is közölni kell. A $\hat p = 0$ közlése hiba: $N$ sorsolásnál a legkisebb mondható érték $1/(N + 1)$, vagyis „$p \lt 1/(N+1)$”. A nagy $z$ nem számolási hiba, hanem a nagy minta következménye.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubban a fokszámtartó nullmodellben $L \approx 2{,}25$, a valódi $L = 2{,}41$. Mit jelent, hogy a valódi hosszabb?`,
          options: [
            R`A valódi gráfban a tagok csoportokba (a két táborba) zárkóznak; a véletlen átkötés a csoportokat összekeveri, és rövidebb utakat ad.`,
            R`A karateklub nem kisvilág, mert az útjai hosszabbak a véletlennél.`,
            R`A fokszámtartó modell elrontja a fokszámokat, ezért rövidülnek az utak.`,
            R`A két vezető (16 és 17 társ) nélkül az utak rövidebbek lennének.`
          ],
          answer: 0,
          hint: R`Mit tart meg az élcsere, és mit kever össze? Mi az, ami a valódi klubban van, a véletlenített változatban nincs?`,
          explain: R`Az élcsere a fokszámokat pontosan megtartja, de a csoportszerkezetet nem: a két tábor közti kevés élt sok „keresztéllé” keveri, ezért rövidülnek az utak. A karateklub ettől még kisvilág: $L$ olyan rövid, mint az ER-gráfban (2,41 vs. 2,40), $\bar C$ viszont sokszorosa ($\sigma \approx 4{,}3$). A vezetők a rövid utakat inkább segítik – nélkülük hosszabbak lennének az utak, nem rövidebbek.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh7-final": {
      title: "Fejezetzáró teszt – 7. Hálózatmodellek és nullmodellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$G(12;\ 0{,}25)$: 12 csúcs, minden pár $0{,}25$ eséllyel összekötve. Hány él várható?`,
          options: [R`$16{,}5$`, R`$36$`, R`$33$`, R`$2{,}75$`],
          answer: 0,
          hint: R`Hány lehetséges él (csúcspár) van 12 csúcs között, ha a sorrend nem számít?`,
          explain: R`$\mathbb E(m) = p\binom{12}2 = 0{,}25 \cdot 66 = 16{,}5$. A $36 = 0{,}25 \cdot 12^2$ $n^2$ párt számol (a csúcsot önmagával is párba állítja), a $33 = 0{,}25 \cdot 12 \cdot 11$ a rendezett párokat – minden élt kétszer. A $2{,}75 = 0{,}25 \cdot 11$ az átlagos fokszám, $\langle k\rangle = p(n - 1)$, nem az élszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $n = 10\,000$ csúcsú ER-gráfban fokozatosan növeled $p$-t. Melyik állítás helyes?`,
          options: [
            R`Az óriáskomponens $\langle k\rangle \approx 1$-nél ($p \approx 0{,}0001$) jelenik meg; összefüggő a gráf kb. $\langle k\rangle \gt \ln n \approx 9{,}2$-nél ($p \approx 0{,}0009$).`,
            R`Az óriáskomponens $\langle k\rangle \approx \ln n \approx 9{,}2$-nél jelenik meg; összefüggő a gráf $\langle k\rangle \gt 1$-nél.`,
            R`Az óriáskomponens megjelenésekor ($\langle k\rangle = 1$) a gráf már összefüggő.`,
            R`Az óriáskomponens $p \approx 0{,}0009$-nél jelenik meg, és $p \approx 0{,}0001$-nél lesz összefüggő a gráf.`
          ],
          answer: 0,
          hint: R`Két különböző küszöb van. Melyik kell ahhoz, hogy <b>egy</b> nagy komponens legyen, és melyik ahhoz, hogy egyetlen izolált csúcs se maradjon?`,
          explain: R`Az óriáskomponens küszöbe $\langle k\rangle = 1$ (átlagosan egy új szomszéd – az elágazó folyamat kritikus pontja), vagyis $p \approx 1/n = 0{,}0001$. Az összefüggéshez az kell, hogy az izolált csúcsok is eltűnjenek (a várható számuk, $n e^{-\langle k\rangle}$, 1 alá essen), ehhez $\langle k\rangle \gt \ln n \approx 9{,}2$, $p \approx \ln n/n \approx 0{,}0009$. A tipikus hiba a két küszöb felcserélése; és $\langle k\rangle = 1$-nél az óriás még csak születik, a gráf messze nem összefüggő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $10\,000$ csúcsú ER-gráfban $\langle k\rangle = 20$. Kb. mennyi az átlagos legrövidebb úthossz?`,
          options: [R`$\approx 3{,}1$`, R`$\approx 9{,}2$`, R`$250$`, R`$\approx 0{,}46$`],
          answer: 0,
          hint: R`$d$ lépésben kb. $\langle k\rangle^d$ csúcsot érsz el. Mikor éri ez el $n$-et?`,
          explain: R`$\ell \approx \ln n/\ln\langle k\rangle = 9{,}21/3{,}00 \approx 3{,}1$. A $9{,}2 = \ln n$ elfelejti az átlagos fokszámmal osztani. A $250 = n/2k$ a gyűrűrács képlete – a rácsban az úthossz $n$-nel arányos, az ER-gráfban csak logaritmikus. A $0{,}46 = \ln n/\langle k\rangle$ a logaritmust hagyja le a nevezőből.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $n = 1000$ csúcsú gyűrűrácsban minden csúcs a $k = 10$ legközelebbi szomszédjával van összekötve. Kb. mennyi az átlagos legrövidebb úthossz?`,
          options: [R`$\approx 50$`, R`$100$`, R`$\approx 6{,}9$`, R`$3$`],
          answer: 0,
          hint: R`Egy lépésben legfeljebb $k/2$ helyet haladsz a körön, és az átlagos „távolság a körön” kb. $n/4$.`,
          explain: R`$L \approx n/2k = 1000/20 = 50$ (pontosan 50,45). A $100 = n/k = (n/2)/(k/2)$ a <b>legtávolabbi</b> csúcs távolsága, nem az átlagos távolság. A $6{,}9 = \ln n$ és a $3 = \ln n/\ln k$ az ER-gráf logaritmikus úthossza – a rácsban az út $n$-nel arányosan nő. Ezért kell a Watts–Strogatz néhány hosszú ugrása: $p = 0{,}01$-nél már $L \approx 9{,}1$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a kisvilág-hálózatokra és a Watts–Strogatz-modellre? (Több jó válasz is lehet.)",
          options: [
            R`A kisvilághoz rövid utak <b>és</b> a véletlen gráfénál sokkal nagyobb klaszterezettség kell.`,
            R`Kevés átkötés ($p \approx 0{,}01$) az úthosszt drasztikusan csökkenti, a klaszterezettséget alig.`,
            R`Ha egy hálózatban rövidek az utak, az már önmagában kisvilág.`,
            R`A WS-modellben a $C$ és az $L$ az átkötéssel ugyanolyan gyorsan csökken.`,
            R`A $p = 1$-es WS-modell gyakorlatilag a gyűrűrács.`
          ],
          answer: [0, 1],
          hint: R`Mit tud az ER-gráf a rövid utakról? És mit ront el egyetlen hosszú ugrás: sok pár távolságát vagy csak a saját néhány háromszögét?`,
          explain: R`A rövid út egymagában nem különleges: az ER-gráfban is megvan – a kisvilág az, hogy sok háromszög <b>mellett</b> is rövidek az utak. Egy hosszú ugrás egyszerre sok pár távolságát rövidíti, de csak a saját néhány háromszögét rontja el: $p = 0{,}01$-nél $L$ kb. ötödére esik, $C$ 97%-a megmarad – a kettő tehát nem egyformán gyorsan csökken. $p = 0$ a rács, $p = 1$ nagyjából ER-gráf.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a hatványfüggvény-illesztésről? (Több jó válasz is lehet.)",
          options: [
            R`Ha $p_k \propto k^{-\gamma}$, akkor a CCDF log–log meredeksége $-(\gamma - 1)$.`,
            R`A kitevőt maximum likelihood módszerrel érdemes becsülni a $k \ge k_{\min}$ farokra.`,
            R`Broido és Clauset szerint a tiszta hatványfüggvény ritkán igazolható; gyakran a lognormális is ugyanolyan jól illik.`,
            R`Ha a log–log ábra egyenes, az bizonyítja, hogy az eloszlás hatványfüggvény.`,
            R`A nyers hisztogramra húzott egyenes meredeksége megbízható $\gamma$-becslés.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a blogokra: a nyers hisztogram 1,07-et, a CCDF 2,23-at, az ML 2,36-ot adott. Melyik hihető, és miért?`,
          explain: R`A CCDF a $p_k$-k összege, ezért kitevője eggyel kisebb: $-(\gamma - 1)$ (aki a CCDF-meredekséget $\gamma$-nak veszi, 1-gyel kisebbet közöl). A legmegbízhatóbb az ML-becslés a farokra (Clauset–Shalizi–Newman). Broido és Clauset (2019) szerint a hálózatok kevesebb mint 5%-ában igazolható „erősen” a tiszta hatványfüggvény. A log–log egyenesség nem bizonyíték – sok eloszlás néz ki két nagyságrenden át egyenesnek, próba kell. A nyers hisztogram farka zajos (0 vagy 1 darabos értékek), a „padló” laposra húzza az egyenest: a blogoknál 1,07 jött ki a reális 2,2–2,4 helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gráf fokszámai $3, 3, 2, 1, 1$. Az új csúcs preferenciális kapcsolódással köt. Mekkora eséllyel választja az egyik 3 fokú csúcsot (egy adottat)?`,
          options: [R`$0{,}3$`, R`$0{,}2$`, R`$0{,}6$`, R`$0{,}15$`],
          answer: 0,
          hint: R`$\Pi_i = k_i/\sum_j k_j$. Mennyi a fokszámok összege?`,
          explain: R`$\sum k_j = 3 + 3 + 2 + 1 + 1 = 10$, így $\Pi = 3/10 = 0{,}3$. A $0{,}2 = 1/5$ az egyenletes választás – preferencia nélkül nem lesznek hubok. A $0{,}6 = 3/5 = k_i/n$ nem is valószínűség (a csúcsokra összeadva 2-t adna). A $0{,}15 = 3/20$ $2m$-mel osztana – de a fokszámok összege már maga $2m$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Barabási–Albert-modell, $m = 3$. Kb. mekkora a 9. lépésben született csúcs fokszáma a 900. lépésben?`,
          options: [R`$30$`, R`$300$`, R`$10$`, R`$100$`],
          answer: 0,
          hint: R`$k_i(t) \approx m\sqrt{t/t_i}$. A fokszám a gyökkel nő, nem lineárisan.`,
          explain: R`$k_i \approx 3\sqrt{900/9} = 3 \cdot 10 = 30$. A $300 = m \cdot t/t_i$ elhagyja a gyököt – a fokszám növekedési sebessége $k_i/2t$, ennek megoldása $\sqrt t$-vel nő. A $10 = \sqrt{t/t_i}$ elfelejti, hogy a csúcs $m = 3$ éllel indult. A $100 = t/t_i$ mindkettőt elhagyja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$. Mennyi a csúcsok átlagos fokszáma, és mennyi egy véletlen él véletlen végén álló csúcs átlagos fokszáma?`,
          options: [
            R`$\langle k\rangle = 2$, élvég: $2{,}25$`,
            R`$\langle k\rangle = 2$, élvég: $2{,}5$`,
            R`$\langle k\rangle = 2$, élvég: $4{,}5$`,
            R`$\langle k\rangle = 2$, élvég: $2$`
          ],
          answer: 0,
          hint: R`Fokszámok: $A$ 3, $B$ 2, $C$ 2, $D$ 1. Egy $k$ fokú csúcs $k$ élvéget birtokol – $k$-szor gyakrabban kerül él végére.`,
          explain: R`$\langle k\rangle = 8/4 = 2$. Élvégek: $\sum k^2/\sum k = (9 + 4 + 4 + 1)/8 = 18/8 = 2{,}25 = \langle k^2\rangle/\langle k\rangle$. A $4{,}5 = \langle k^2\rangle$ elfelejti $\langle k\rangle$-val osztani. A $2{,}5 = \langle k\rangle + \operatorname{Var}(k)$ a szórásnégyzetet nem osztja $\langle k\rangle$-val (helyesen $2 + 0{,}5/2$). A „2” a paradoxon tagadása: egyenlőség csak akkor van, ha minden fokszám egyforma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában ($2m = 20$) a Vízügy és a Szakértő is 3 fokú. Hány $\mathrm{Vi}$–$\mathrm{Sz}$ él várható a konfigurációs modellben ($2m - 1$-es képlettel)?`,
          options: [R`$\approx 0{,}47$`, R`$0{,}9$`, R`$0{,}3$`, R`$9$`],
          answer: 0,
          hint: R`A Vízügy minden féléle a maradék 19 félél közül választ párt. Ebből hány a Szakértőé?`,
          explain: R`$k_ik_j/(2m - 1) = 3 \cdot 3/19 \approx 0{,}47$. A valódi gráfban 1 ilyen él van – ez nem kiugró. A $0{,}9 = 9/10$ $m$-mel oszt $2m$ helyett. A $0{,}3 = (3 + 3)/20$ összeadja a fokszámokat a szorzás helyett. A $9$ a nyers szorzat.`
        },
        {
          type: "single", shuffle: true,
          q: R`2000 véletlen gráfot sorsoltál a nullmodellből, és egyikben sem volt legalább akkora érték, mint a megfigyeltben. Mit közölsz?`,
          options: [
            R`$\hat p = 1/2001 \approx 0{,}0005$, vagyis „$p \lt 0{,}001$”`,
            R`$\hat p = 0$: a megfigyelt érték lehetetlen a nullmodellben`,
            R`Semmit: újra kell sorsolni, amíg legalább egy gráf eléri`,
            R`$\hat p = 0{,}05$, mert ennél kisebb p-t nem szokás közölni`
          ],
          answer: 0,
          hint: R`Az empirikus p-érték képletében mi kerül a számlálóba és a nevezőbe, ha a darabszám 0?`,
          explain: R`$\hat p = (1 + 0)/(1 + 2000) = 1/2001 \approx 0{,}0005$. Az 1-esek a megfigyelt gráfot is beszámítják – így $\hat p$ sosem 0, és a próba nem túl magabiztos. „$\hat p = 0$” hiba: csak annyit tudunk, hogy 2000 sorsolásban nem jött ki; a legkisebb mondható érték $1/(N + 1)$. Újrasorsolni „amíg sikerül” a p-értéket torzítaná, a 0,05 pedig a döntési küszöb, nem a p-érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató két lap cikkeit hasonlítja össze 6 eseményen: ugyanazokat a szereplőket szólaltatják-e meg? Melyik nullmodell illik?`,
          options: [
            R`Rétegzett permutáció: a lapcímkéket eseményen belül keverni.`,
            R`A lapcímkéket az egész héten át keverni.`,
            R`$G(n, m)$ a szereplőgráfra.`,
            R`Fokszámtartó élcsere az együttemlítési gráfon.`
          ],
          answer: 0,
          hint: R`A különböző napok eseményei eleve más szereplőket hoznak. Mi történne ezzel a különbséggel, ha az egész héten át kevernél?`,
          explain: R`Az események eleve más szereplőket hoznak (a vasárnapi gyűjtésben nincs Szakértő). Az egész hetes keverés ezt a különbséget „véletlennek” tekintené, és a két lap hasonlóságát túlbecsülné. Eseményen belül keverve csak az a hasonlóság marad meglepő, ami az eseményből nem következik. A $G(n, m)$ és az élcsere a kérdést sem érinti: itt a lap–cikk címkét kell keverni, nem a gráfot.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hírkorpusz együttemlítési gráfjában azt kérdezed: sok-e a háromszög? Melyik mérce a helyes?`,
          options: [
            R`A cikk–szereplő páros gráf véletlenítése (rögzített cikkméretek és szereplőgyakoriságok)`,
            R`$G(n, m)$ az együttemlítési gráfra`,
            R`Fokszámtartó élcsere az együttemlítési gráfon`,
            R`Egyetlen, azonos fokszámú véletlen gráf`
          ],
          answer: 0,
          hint: R`Hány élt és hány háromszöget ad egyetlen háromszereplős cikk a vetületben? Melyik nullmodell „tud” erről?`,
          explain: R`Egy háromszereplős cikk egyszerre 3 élt és egy „gyári” háromszöget ad. A vetületen futtatott $G(n, m)$ vagy élcsere ezt nem tudja, ezért a gyári háromszögeket felfedezésnek látja – az Árvízhéten mindkettő szerint „sok” vagy „átlagos” a 4 háromszög, a páros nullmodell szerint viszont kevés ($8{,}34 \pm 2{,}71$). Egyetlen véletlen gráf nem nullmodell: semmit sem mond a szórásról.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $\mathrm{Po}$–$\mathrm{La}$ pár 2 közös cikkben szerepel (a Polgármester 6, a Lakók 4 cikkben). A páros nullmodellben a várható érték 1,51, $P(\ge 2) \approx 0{,}50$. Mi a helyes olvasat?`,
          options: [
            R`Nem erős kapcsolat: a sokat szereplő Polgármester véletlenül is gyakran összefut bárkivel, a 2 a nulleloszlás közepén van.`,
            R`Erős kapcsolat, mert ugyanannyi közös cikk, mint a $\mathrm{Sz}$–$\mathrm{Kl}$ párnál.`,
            R`Erős kapcsolat, mert a megfigyelt 2 több, mint a várható 1,51.`,
            R`Gyenge kapcsolat, mert a Lakók és a Polgármester két külön csoport.`
          ],
          answer: 0,
          hint: R`Nem az számít, hogy a megfigyelt több-e az átlagnál, hanem hogy a nulleloszlásban mennyire szélsőséges.`,
          explain: R`$P(\ge 2) \approx 0{,}50$: a véletlen cikkek felében legalább ennyi közös cikk kijön, mert a Polgármester 6 cikkben szerepel. Ugyanaz a súly (2) a $\mathrm{Sz}$–$\mathrm{Kl}$-nél $p \approx 0{,}016$ – a meglepetést a gyakoriságok határozzák meg, nem a nyers súly. Az „átlag fölött” még nem jelentős eltérés. A $\mathrm{Po}$ és a $\mathrm{La}$ nem külön csoport: a $\mathrm{La}$–$\text{Ön}$–$\mathrm{Po}$ kör tagjai.`
        }
      ]
    },
