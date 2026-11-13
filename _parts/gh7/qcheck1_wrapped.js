(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 7.1 */
    "gh7-71": {
      title: "Kvíz – 7.1 Erdős–Rényi-gráf",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy $G(12;\ 0{,}25)$ gráfot sorsolsz. Mennyi a várható élszám és az átlagos fokszám?`,
          options: [
            R`$\mathbb E(m) = 16{,}5$, $\langle k\rangle = 2{,}75$`,
            R`$\mathbb E(m) = 36$, $\langle k\rangle = 6$`,
            R`$\mathbb E(m) = 33$, $\langle k\rangle = 5{,}5$`,
            R`$\mathbb E(m) = 16{,}5$, $\langle k\rangle = 0{,}25$`
          ],
          answer: 0,
          hint: R`Hány csúcspár van 12 csúcs között, ha a sorrend nem számít? Egy csúcsnak hány lehetséges társa van?`,
          explain: R`$\binom{12}{2} = 66$ pár, mindegyik $0{,}25$ eséllyel él: $\mathbb E(m) = 0{,}25 \cdot 66 = 16{,}5$. Egy csúcsnak 11 lehetséges társa van: $\langle k\rangle = 0{,}25 \cdot 11 = 2{,}75$ (ellenőrzés: $2 \cdot 16{,}5/12 = 2{,}75$). A $36$ és a $6$ az $n^2 = 144$ „párból” jön, a $33$ és az $5{,}5$ az $n(n-1) = 132$-ből – ez az irányított élek száma, minden párt kétszer számol. Az utolsó opció a $p$-t keveri az átlagos fokszámmal: $p$ egy pár esélye, $\langle k\rangle$ egy csúcs várható társainak száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $G(4, 3)$ modell 4 csúcson pontosan 3 élt sorsol (egyenletesen a lehetséges élhármasok közül). Mekkora eséllyel lesz a gráf összefüggő?`,
          options: [R`$0{,}8$`, R`$0{,}6$`, R`$0{,}2$`, R`$1$`],
          answer: 0,
          hint: R`Sorold fel, milyen alakú lehet 3 él 4 csúcson: háromszög (+ egy izolált csúcs), csillag vagy út. Hány gráf van összesen, és melyik alak nem összefüggő?`,
          explain: R`A 6 lehetséges élből 3-at $\binom63 = 20$-féleképpen választhatsz, mind egyformán valószínű. Ebből 4 háromszög (a negyedik csúcs izolált), 4 csillag és 12 út. Összefüggő a csillag és az út: $16/20 = 0{,}8$. A $0{,}6 = 12/20$ csak az utakat számolja, a csillagokat elfelejti. A $0{,}2$ a háromszög esélye – épp az ellentett esemény. Az $1$ abból a hibás gondolatból jön, hogy „3 él 4 csúcshoz mindig elég”: egy fához elég, de a 3 él háromszöget is alkothat, és akkor egy csúcs kimarad.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 2000 csúcsú ritka ER-gráfban $\langle k\rangle = 2$. Kb. hány izolált csúcs várható?`,
          options: [R`$\approx 271$`, R`$\approx 406$`, R`$0$`, R`$\approx 1594$`],
          answer: 0,
          hint: R`Nagy, ritka gráfban a fokszám jó közelítéssel Poisson-eloszlású. Mennyi annak az esélye, hogy a fokszám éppen 0?`,
          explain: R`$p_0 \approx e^{-2} \approx 0{,}135$, így kb. $2000 \cdot 0{,}135 \approx 271$ izolált csúcs. A $406 \approx 2000 \cdot (1 - 0{,}797)$ az óriáskomponensen <b>kívüli</b> összes csúcs: ebben a kis komponensek is benne vannak, nem csak az izoláltak. Az $1594$ az óriáskomponens mérete ($S \approx 0{,}797$). A $0$ a két küszöböt keveri: $\langle k\rangle = 2 \gt 1$ mellett van óriás, de összefüggő csak $\langle k\rangle \approx \ln 2000 \approx 7{,}6$ körül lesz a gráf – addig maradnak izolált csúcsok.`
        },
        {
          type: "single", shuffle: true,
          q: R`$n = 10\,000$ csúcsú $G(n, p)$. Mekkora $p$-nél jelenik meg az óriáskomponens, és mekkoránál lesz (nagy valószínűséggel) összefüggő a gráf?`,
          options: [
            R`óriás: $p \approx 0{,}0001$; összefüggés: $p \approx 0{,}00092$`,
            R`óriás: $p \approx 0{,}00092$; összefüggés: $p \approx 0{,}0001$`,
            R`mindkettő $p \approx 0{,}0001$-nél: amint van óriás, a gráf összefüggő`,
            R`óriás: $p \approx 0{,}0001$; összefüggés: $p \approx 0{,}0004$`
          ],
          answer: 0,
          hint: R`Két küszöb van, két különböző $\langle k\rangle$-értéknél. Ha megvan a $\langle k\rangle$, a $p$-t a $\langle k\rangle = p(n - 1)$ összefüggésből kapod.`,
          explain: R`Az óriás $\langle k\rangle = 1$-nél jelenik meg: $p = 1/9999 \approx 0{,}0001$. Az összefüggéshez $\langle k\rangle \approx \ln n = \ln 10\,000 \approx 9{,}2$ kell: $p \approx 9{,}2/9999 \approx 0{,}00092$. A második opció felcseréli a két küszöböt (az összefüggés nem jöhet előbb, mint az óriás). A harmadik a tipikus keverés: a két küszöb között van óriás, de mellette még izolált csúcsok is. A $0{,}0004$ tízes alapú logaritmussal számol ($\log_{10} 10\,000 = 4$) – a tételben természetes logaritmus áll.`
        },
        {
          type: "match",
          q: R`Párosítsd az átlagos fokszámot az óriáskomponens arányával, $S$-sel (az $S = 1 - e^{-\langle k\rangle S}$ egyenlet szerint, nagy $n$-re)!`,
          pairs: [
            [R`$\langle k\rangle = 0{,}5$`, "0 (nincs óriás)"],
            [R`$\langle k\rangle = 1{,}5$`, "≈ 0,58"],
            [R`$\langle k\rangle = 2$`, "≈ 0,80"],
            [R`$\langle k\rangle = 3$`, "≈ 0,94"],
            [R`$\langle k\rangle = 4$`, "≈ 0,98"]
          ],
          hint: R`$\langle k\rangle \le 1$-nél csak az $S = 0$ megoldás létezik. A többinél próbálgass: helyettesítsd be a jelölteket a jobb oldalba, és nézd meg, melyik adja vissza önmagát. $S$ nő a $\langle k\rangle$-val.`,
          explain: R`$\langle k\rangle = 0{,}5 \lt 1$: a bejárás elhal, minden komponens kicsi, $S = 0$. A többi a fixpont: például $\langle k\rangle = 3$-ra $1 - e^{-3 \cdot 0{,}94} = 1 - e^{-2{,}82} \approx 0{,}940$ ✔, $\langle k\rangle = 2$-re $1 - e^{-2 \cdot 0{,}797} \approx 0{,}797$ ✔. Figyeld meg, milyen gyorsan nő: már $\langle k\rangle = 2$-nél a csúcsok 80%-a az óriásban van. Ne keverd az izolált csúcsok arányával ($e^{-\langle k\rangle}$ az $1{,}5$; $2$; $3$; $4$ értékekre: 0,223; 0,135; 0,050; 0,018) – az óriáson kívüli rész, $1 - S$, ennél nagyobb, mert a kis, de nem izolált komponensek is oda tartoznak.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy ER-gráfban $n = 10^6$ és $\langle k\rangle = 100$. Mennyi nagyjából az átlagos úthossz és a klaszterezettség?`,
          options: [
            R`$\ell \approx 3$, $C \approx 0{,}0001$`,
            R`$\ell \approx 3$, $C \approx 0{,}01$`,
            R`$\ell \approx 13{,}8$, $C \approx 0{,}0001$`,
            R`$\ell \approx 0{,}33$, $C \approx 0{,}0001$`
          ],
          answer: 0,
          hint: R`Két képlet: hány lépésben éred el az $n$ csúcsot, ha lépésenként $\langle k\rangle$-szorosára nő az elért kör? És mekkora eséllyel szomszéd egy csúcs két szomszédja?`,
          explain: R`$\ell \approx \ln n/\ln\langle k\rangle = 13{,}8/4{,}6 = 3$. $C \approx p = \langle k\rangle/(n - 1) = 100/999\,999 \approx 0{,}0001$: két szomszéd egymástól függetlenül, $p$ eséllyel szomszéd. A $0{,}01 = 1/\langle k\rangle$ – a $C$ nem a fokszám reciproka, hanem a párok esélye. A $13{,}8$ csak $\ln n$, a $\ln\langle k\rangle$-val való osztás kimaradt. A $0{,}33$ fordítva oszt. Egy valódi társas hálózat $C$-je ($0{,}1$–$0{,}6$) ennél több nagyságrenddel nagyobb.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az Erdős–Rényi-gráfra? (Több jó válasz is lehet.)",
          options: [
            R`Egy csúcs fokszáma binomiális eloszlású; nagy $n$-re és rögzített $\langle k\rangle$-ra jól közelíti a Poisson-eloszlás.`,
            R`$\langle k\rangle = 3$-nál, bár van óriáskomponens, a csúcsok kb. 5%-a még izolált.`,
            R`A klaszterezettsége kb. $p$, ezért nagy, ritka gráfban pici.`,
            R`Gyakran vannak benne hubok, az átlag tízszeresét elérő fokszámú csúcsok – hiszen „véletlen”.`,
            R`Ha $\langle k\rangle \gt 1$, a gráf (nagy valószínűséggel) összefüggő.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj az ER-mérlegre: mit ad meg „magától” a pénzfeldobás-recept, és mit nem? És melyik küszöb tartozik az $\langle k\rangle = 1$-hez?`,
          explain: R`Az első három igaz: a fokszám $n - 1$ független kísérlet sikereinek száma (binomiális → Poisson); $e^{-3} \approx 0{,}050$, vagyis kb. 5% izolált; $C \approx p = \langle k\rangle/(n-1)$. A hubos állítás hamis: a Poisson-fokszámok az átlag körül csomósodnak (szórás $\sqrt{\langle k\rangle}$), a nagy fokszám elképesztően ritka – a karateklub $G(34, 78)$-ikerében a 17-es fokszám 2000 sorsolásból egyszer sem jött ki. Az utolsó a két küszöböt keveri: $\langle k\rangle \gt 1$ az óriáskomponenshez elég, az összefüggéshez $\langle k\rangle \gt \ln n$ kell.`
        }
      ]
    },

    /* ------------------------------------------------ 7.2 */
    "gh7-72": {
      title: "Kvíz – 7.2 Kisvilág-hálózatok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy hálózatban $C = 0{,}4$, $L = 3{,}3$; az azonos $n$-ű és $m$-ű véletlen gráfban $C_{\text{ER}} = 0{,}02$, $L_{\text{ER}} = 3{,}0$. Mennyi a $\sigma$?`,
          options: [R`$\approx 18$`, R`$20$`, R`$22$`, R`$\approx 0{,}055$`],
          answer: 0,
          hint: R`$\sigma$ két hányados hányadosa: a klaszterezettség-arányt osztod az úthossz-aránnyal.`,
          explain: R`$C/C_{\text{ER}} = 0{,}4/0{,}02 = 20$, $L/L_{\text{ER}} = 3{,}3/3{,}0 = 1{,}1$, így $\sigma = 20/1{,}1 \approx 18$ – jóval 1 fölött: kisvilág. A $20$ csak a klaszterezettség-arány, az úthosszat elhagyja. A $22 = 20 \cdot 1{,}1$ szoroz osztás helyett. A $0{,}055$ fejjel lefelé fordítja a törtet. Az, hogy $L$ itt kicsit hosszabb, mint $L_{\text{ER}}$, belefér: a lényeg, hogy nagyjából akkora.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Travers–Milgram-cikk (1969) szerint a 296 elindított levélláncból 64 ért célba, átlagosan 5,2 közvetítővel. Mi a helyes következtetés?`,
          options: [
            R`A láncoknak csak kb. 22%-a ért célba, az elveszettek valószínűleg hosszabbak lettek volna: a „hat” nagyságrend, nem állandó.`,
            R`Bizonyított természeti törvény, hogy bárki legfeljebb hat lépésre van bárkitől.`,
            R`A láncok kb. 78%-a ért célba, tehát a mérés nagyon megbízható.`,
            R`A rövid láncok bizonyítják, hogy a társas hálózat kisvilág-tulajdonságú.`
          ],
          answer: 0,
          hint: R`Számold ki a célba ért arányt. Melyik láncok vesztek el nagyobb eséllyel – a rövidek vagy a hosszúak? És mi kell a kisvilág-állításhoz a rövid utakon kívül?`,
          explain: R`$64/296 \approx 21{,}6\%$ ért célba. Egy hosszabb láncnak több esélye van megszakadni, ezért a célba értek átlaga valószínűleg alulbecsli a valódi távolságot: a „hat lépés” nagyságrend, nem állandó (a Facebookon 2011-ben 4,74 jött ki). A 78% az elveszett láncok aránya. Az utolsó opció a kisvilágot a rövid utakkal azonosítja – pedig rövid út az ER-gráfban is van; kisvilágról akkor beszélünk, ha <b>emellett</b> a klaszterezettség is sokkal nagyobb a véletlennél.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy nagy gyűrűrácsban minden csúcs a 4-4 legközelebbi szomszédjával van összekötve ($k = 8$). Mennyi a klaszterezettség?`,
          options: [R`$\approx 0{,}64$`, R`$0{,}75$`, R`$0{,}5$`, R`$\approx 0{,}86$`],
          answer: 0,
          hint: R`Használd a gyűrűrács képletét: $C$ csak $k$-tól függ, $n$-től nem.`,
          explain: R`$C = \dfrac{3(k-2)}{4(k-1)} = \dfrac{3 \cdot 6}{4 \cdot 7} = \dfrac{18}{28} \approx 0{,}64$. A $0{,}75$ a $k \to \infty$ határérték, nem a $k = 8$-as érték. A $0{,}5$ a $k = 4$-es gyűrűé (például a 8 csúcsú kiinduló példáé). A $0{,}86 = 6/7$ a $3/4$-es szorzót hagyja el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Gyűrűrács: $n = 2000$ csúcs, $k = 10$. Kb. mekkora az átlagos legrövidebb út, $L$?`,
          options: [R`$\approx 100$`, R`$\approx 3{,}3$`, R`$\approx 200$`, R`$\approx 7{,}6$`],
          answer: 0,
          hint: R`Egy lépésben legfeljebb $k/2$ helyet haladsz a körön, és egy csúcs átlagosan kb. $n/4$ helyre van. A rácsban lineárisan vagy logaritmikusan nő az út?`,
          explain: R`$L \approx n/(2k) = 2000/20 = 100$ (pontosan 100,45). A $3{,}3 = \ln 2000/\ln 10$ az ER-gráf becslése – a rácsra nem érvényes, ott az úthossz $n$-nel arányosan nő. A $200 = n/k$ a 2-es osztót felejti el (egy lépés $k/2$ hely, az átlagos távolság $n/4$ hely). A $7{,}6 = \ln n$ egyik képlet sem.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Watts–Strogatz-modellben ($n = 1000$, $k = 10$) $p = 0{,}01$-gyel kötjük át az éleket – az 5000 élből kb. 50-et. Mi történik?`,
          options: [
            R`Az átlagos út kb. ötödére rövidül ($50{,}45$-ről kb. $9{,}1$-re), a klaszterezettség 97%-a megmarad.`,
            R`Az átlagos út és a klaszterezettség egyaránt kb. ötödére esik.`,
            R`Az átlagos út alig változik, a klaszterezettség kb. ötödére esik.`,
            R`Az átlagos út kb. 1%-kal rövidül, hiszen az élek 1%-át kötöttük át.`
          ],
          answer: 0,
          hint: R`Egy hosszú ugrás hány csúcspár távolságát rövidíti le? És egy átkötött él hány háromszöget ront el?`,
          explain: R`A táblázat szerint $p = 0{,}01$-nél $L(p)/L(0) = 0{,}18$ és $C(p)/C(0) = 0{,}97$. Egy hosszú ugrás egy csapásra sok pár távolságát rövidíti (mindenkiét, aki a két vége közelében van), a klaszterezettség viszont csak helyben, a saját néhány háromszögénél sérül. Ezért a két mennyiség <b>nem</b> egyforma ütemben esik – ez a kisvilág-tartomány. A harmadik opció épp fordítva mondja. A „1%-kal rövidül” lineáris gondolkodás: a hatás nagyon nem arányos az átkötött élek számával.`
        },
        {
          type: "match",
          q: R`Watts–Strogatz-modell, $n = 1000$, $k = 10$. Párosítsd az átkötési valószínűséget azzal, ami jellemzi!`,
          pairs: [
            [R`$p = 0$`, "gyűrűrács: sok háromszög, hosszú utak"],
            [R`$p = 0{,}01$`, "kisvilág: a háromszögek szinte mind megvannak, az utak rövidek"],
            [R`$p = 0{,}3$`, "a klaszterezettség kb. harmadára esett, az utak rövidek"],
            [R`$p = 1$`, "nagyjából ER-gráf: kevés háromszög, rövid utak"]
          ],
          hint: "Az úthossz már nagyon kevés átkötéstől leesik, a klaszterezettség csak sok átkötéstől. Melyik p-nél melyik esett már le?",
          explain: R`$p = 0$: maga a rács ($C \approx 0{,}67$, $L = 50{,}45$). $p = 0{,}01$: $C/C_0 = 0{,}97$, $L/L_0 = 0{,}18$ – ez a kisvilág. $p = 0{,}3$: $C/C_0 = 0{,}35$, $L/L_0 = 0{,}071$ – a háromszögek nagy része már elveszett. $p = 1$: minden él véletlenül kötött, nagyjából ER-gráf ($C/C_0 = 0{,}014$, $L \approx 3{,}3$). Gyakori hiba a $p = 1$-es modellt rácsnak gondolni: épp az a másik véglet. Az érdekes tartomány logaritmikus $p$-tengelyen látszik, $0{,}001$ és $0{,}1$ között.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A gyűrűrács klaszterezettsége nem függ $n$-től, csak $k$-tól.`,
            R`A Watts–Strogatz-gráf fokszámai szinte egyformák: hubokat ez a modell sem ad.`,
            R`A kisvilág-tulajdonsághoz kétféle feltétel kell: $L \approx L_{\text{ER}}$ és $C \gg C_{\text{ER}}$.`,
            R`A gyűrűrács átlagos úthossza $\ln n$-nel nő, mint az ER-gráfé.`,
            R`Egy hálózat már akkor kisvilág, ha kicsi az átlagos úthossza, akármekkora a klaszterezettsége.`
          ],
          answer: [0, 1, 2],
          hint: R`Idézd fel a gyűrűrács két képletét ($C$ és $L$), és a kisvilág definíciójának két pontját.`,
          explain: R`A gyűrűrácsban a társak egymáshoz közel vannak a körön, $C = 3(k-2)/(4(k-1))$ – $n$ nem szerepel benne. A WS-modellben mindenki fokszáma $k$ körül van, a hubok kérdése a 7.3-ban jön. A kisvilág-definíció két feltétele igaz. A rácsban viszont $L \approx n/(2k)$: az út $n$-nel <b>arányosan</b> nő, nem logaritmikusan ($n = 1000$, $k = 10$: 50, szemben az ER-gráf kb. 3-ával). Az utolsó a kisvilágot a rövid utakkal azonosítja – rövid út az ER-gráfban „ingyen” van; ha $C \approx C_{\text{ER}}$, akkor $\sigma \approx 1$, és a hálózat egyszerűen véletlen gráfnak látszik.`
        }
      ]
    },

    /* ------------------------------------------------ 7.3 */
    "gh7-73": {
      title: "Kvíz – 7.3 Skálafüggetlen hálózatok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy hálózat fokszámeloszlása $p_k = c\,k^{-3}$. Hányszor ritkább a 30-as fokszám a 10-esnél?`,
          options: [R`$27$`, R`$9$`, R`$8$`, R`$3$`],
          answer: 0,
          hint: R`Írd fel a $p_{30}/p_{10}$ hányadost: a $c$ kiesik, a $k$-k hányadosa marad egy hatványon.`,
          explain: R`$p_{30}/p_{10} = (30/10)^{-3} = 3^{-3} = 1/27$, tehát 27-szer ritkább. A $9 = 3^2$ a $\gamma - 1$ kitevővel számol – az a CCDF kitevője, nem a $p_k$-é. A $8 = 2^3$ a duplázásra érvényes: itt nem kétszeres, hanem háromszoros a fokszám. A $3$ lineáris arányossággal számol. A skálafüggetlenség azt jelenti, hogy a háromszorozás bárhol (10 → 30 vagy 100 → 300) ugyanígy 27-tel oszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`A preferenciális kapcsolódásban a régi csúcsok fokszámai $4, 3, 2, 1$. Mekkora eséllyel köt az új csúcs (egyetlen éllel) a 4 fokúhoz?`,
          options: [R`$0{,}4$`, R`$0{,}25$`, R`$1$`, R`$0{,}1$`],
          answer: 0,
          hint: R`$\Pi_i = k_i/\sum_j k_j$. Mi kerül a nevezőbe: a csúcsok száma vagy a fokszámok összege?`,
          explain: R`$\sum_j k_j = 10$, így $\Pi = 4/10 = 0{,}4$. A $0{,}25 = 1/4$ az egyenletes választás (ott nincs preferencia, és nem lesznek hubok). Az $1 = 4/4$ a fokszámot a csúcsok számával osztja – így az esélyek összege nem 1 lenne. A $0{,}1 = 1/10$ elfelejti a számlálóba tenni a fokszámot.`
        },
        {
          type: "single", shuffle: true,
          q: R`Barabási–Albert-modell, $m = 3$. Kb. mekkora a 400. lépésben született csúcs fokszáma a $10\,000$. lépésben?`,
          options: [R`$15$`, R`$75$`, R`$5$`, R`$0{,}6$`],
          answer: 0,
          hint: R`$k_i(t) \approx m\sqrt{t/t_i}$. Melyik a nagyobb: $t$ vagy $t_i$? Mi kerül a gyök alá?`,
          explain: R`$k_i \approx 3\sqrt{10\,000/400} = 3 \cdot \sqrt{25} = 3 \cdot 5 = 15$. A $75 = 3 \cdot 25$ elhagyja a gyököt – a fokszám nem lineárisan, hanem $\sqrt t$-vel nő. Az $5$ elfelejti az $m$-et (a csúcs $m = 3$ éllel érkezett). A $0{,}6$ fordítva írja a hányadost; a fokszám nem csökkenhet $m$ alá.`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy csúcs fokszáma $3, 3, 5, 10$; $k_{\min} = 3$. Mennyi a $\gamma$ maximum likelihood becslése, $\hat\gamma = 1 + n_{\text{farok}}\Big[\sum \ln\dfrac{k_i}{k_{\min} - 1/2}\Big]^{-1}$?`,
          options: [R`$\approx 2{,}64$`, R`$\approx 1{,}64$`, R`$\approx 3{,}33$`, R`$\approx 4{,}77$`],
          answer: 0,
          hint: R`Minden fokszámot $2{,}5$-del oszt, abból természetes logaritmust vesz. A végén ne felejtsd el a képlet elején álló $1 +$-t.`,
          explain: R`$\ln(3/2{,}5) = 0{,}182$ (kétszer), $\ln(5/2{,}5) = \ln 2 = 0{,}693$, $\ln(10/2{,}5) = \ln 4 = 1{,}386$. Összeg: $2{,}444$. $\hat\gamma = 1 + 4/2{,}444 \approx 2{,}64$. Az $1{,}64$ elhagyja az $1 +$-t. A $3{,}33$ a $\tfrac12$-es korrekciót hagyja el ($\ln(k_i/3)$: a két 3-as tag 0 lesz). A $4{,}77$ tízes alapú logaritmussal számol.`
        },
        {
          type: "match",
          q: R`A politikai blogok fokszámeloszlásának kitevőjét többféleképpen becsülték. Párosítsd a módszert az eredménnyel!`,
          pairs: [
            ["egyenes a nyers hisztogram log–log ábrájára", "1,07"],
            ["egyenes a CCDF log–log ábrájára (γ = 1 − meredekség)", "2,23"],
            [R`maximum likelihood, $k_{\min} = 29$`, "2,36"],
            [R`maximum likelihood, $k_{\min} = 100$`, "3,79"]
          ],
          hint: "Melyik módszert torzítja a farok „padlója” (egyszer előforduló fokszámok), és melyik irányba? Mi történik az ML-becsléssel, ha egyre feljebb kezdődik a farok, és az eloszlás lefelé görbül?",
          explain: R`A nyers hisztogram farkában a sok $p_k = 1/1222$ pont „padlót” rajzol, ez laposra húzza az egyenest: $1{,}07$ – messze a reális 2,2–2,4 alatt. A CCDF összegez, nem zajos: meredeksége $-(\gamma - 1)$, így $\gamma \approx 2{,}23$. Az ML-becslés $k_{\min} = 29$-nél (380 blog) $2{,}36$. Ha a $k_{\min}$-t 100-ra emeled, $3{,}79$ jön ki: a becslés a $k_{\min}$-nel vándorol, ami arra utal, hogy a farok lefelé görbül – nehéz farok, de nem tiszta hatványfüggvény (a lognormális és a levágott hatványfüggvény jobban illik).`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$, $DE$. Válassz egy véletlen élt, és annak egy véletlen végét. Mennyi az ott álló csúcs fokszámának várható értéke?`,
          options: [R`$2{,}2$`, R`$2$`, R`$4{,}4$`, R`$2{,}4$`],
          answer: 0,
          hint: R`Fokszámok: $A$ 3, $B, C, D$ 2, $E$ 1. A $k$ fokú csúcs $k$ élvéget birtokol. Számold ki $\langle k\rangle$-t és $\langle k^2\rangle$-t.`,
          explain: R`$\langle k\rangle = 10/5 = 2$, $\langle k^2\rangle = (9 + 4 + 4 + 4 + 1)/5 = 22/5 = 4{,}4$, és az élvég átlagos fokszáma $\langle k^2\rangle/\langle k\rangle = 4{,}4/2 = 2{,}2$ (közvetlenül: a 10 élvég fokszámainak összege 22). A $2$ a csúcsok átlaga – épp ennél nagyobbat látsz az él végéről (barátság-paradoxon). A $4{,}4$ maga a $\langle k^2\rangle$, osztás nélkül. A $2{,}4 = \langle k\rangle + \operatorname{Var}(k)$ elfelejti a szórásnégyzetet $\langle k\rangle$-val osztani: helyesen $2 + 0{,}4/2 = 2{,}2$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Ha $p_k \propto k^{-\gamma}$, akkor a CCDF log–log ábráján a meredekség $-(\gamma - 1)$.`,
            R`A Barabási–Albert-modellben $\langle k\rangle = 2m$, és a kitevő $\gamma = 3$.`,
            R`Ha a BA-modellből elhagyod a preferenciát (az új csúcs egyenletesen választ), a fokszámeloszlás exponenciális lesz, hubok nélkül.`,
            R`„Skálafüggetlen” azt jelenti, hogy a hálózatban minden csúcs nagyjából egyforma fokszámú.`,
            R`Ha a fokszám-hisztogram log–log ábrán egyenesnek látszik, az eloszlás biztosan hatványfüggvény.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig: miből „nincs jellemző méret”, és mitől lesznek hubok a BA-modellben? Elég-e a szemre egyenes vonal bizonyítéknak?`,
          explain: R`A CCDF egy összeg, és $k^{-\gamma}$ összege $k^{-(\gamma - 1)}$-gyel arányos – ezért a CCDF meredekségéhez 1-et kell adni. A BA-modellben minden új csúcs $m$ élt hoz, minden él 2 fokszámot ad: $\langle k\rangle = 2m$; a kitevő mindig 3 (nem 2 vagy 2,5). Mindkét összetevő kell: preferencia nélkül exponenciális eloszlás lesz, növekedés nélkül végül mindenki összekapcsolódik. A skálafüggetlenség épp nem egyformaságot jelent: arról szól, hogy a $p_{2k}/p_k$ arány bárhol ugyanannyi, nincs jellemző fokszám – és vannak hubok. A log–log egyenes nem bizonyíték: sok eloszlás néz ki egyenesnek két nagyságrenden át, próba kell (likelihood-hányados a lognormálissal, levágott hatványfüggvénnyel).`
        }
      ]
    },

}; return Q; })();
