/* =========================================================
   Gráfelmélet és hálózattudomány 7. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
