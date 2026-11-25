/* =========================================================
   Gráfelmélet és hálózattudomány 12. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 12.1 */
    "gh12-121": {
      title: "Kvíz – 12.1 Üzenetküldés (emlékeztető)",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az öt barát gráfján (élek: A–B, A–C, B–C, B–D, D–E) mekkora a D–E él súlya a GCN-ben, azaz $P_{DE}$, ha $P = \hat D^{-1/2}\hat A\hat D^{-1/2}$?`,
          options: [R`$1/\sqrt6 \approx 0{,}408$`, R`$1/\sqrt2 \approx 0{,}707$`, R`$1/6 \approx 0{,}167$`, R`$1/3 \approx 0{,}333$`],
          answer: 0,
          hint: R`Mennyi $\hat d_D$ és $\hat d_E$? Ne felejtsd el, mit ad hozzá az $\hat A = A + I$ a fokszámhoz.`,
          explain: R`Dávidnak 2 szomszédja van, Emesének 1; önhurokkal $\hat d_D = 3$, $\hat d_E = 2$. A súly a két fokszám mértani közepének reciproka: $1/\sqrt{3 \cdot 2} = 1/\sqrt6 \approx 0{,}408$. Az $1/\sqrt2$ az önhurkot kihagyja a fokszámból ($\deg D = 2$, $\deg E = 1$) – ez a leggyakoribb hiba. Az $1/6$ elfelejti a gyököt, az $1/3 = 1/\hat d_D$ sornormálást (átlagot) számol a szimmetrikus normálás helyett. Lásd a <a class="xref" href="#s121-a">12.1 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanott $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$. Mennyi Dávid értéke egy GCN-lépés után ($P\mathbf x$, $W = 1$, aktiváció nélkül)?`,
          options: [R`$\approx 2{,}041$`, R`$\approx 3{,}536$`, R`$2{,}5$`, R`$\approx 1{,}667$`],
          answer: 0,
          hint: R`Dávid sorában három tag van: Bence, Dávid maga (önhurok) és Emese – mindegyik a saját $1/\sqrt{\hat d_D \hat d_u}$ súlyával.`,
          explain: R`$\hat d_D = 3$, $\hat d_B = 4$, $\hat d_E = 2$: $\tfrac{1}{\sqrt{12}}\cdot 0 + \tfrac13\cdot 0 + \tfrac{1}{\sqrt6}\cdot 5 = 5/\sqrt6 \approx 2{,}041$. A $3{,}536 = 5/\sqrt2$ önhurok nélkül számol ($\deg D = 2$, $\deg E = 1$). A $2{,}5$ az egyszerű átlag ($m_D$) – az nem a GCN normálása. Az $1{,}667 = 5/3$ az önhurkos összeget Dávid saját fokszámával osztja (sornormálás), Emese fokszámát figyelmen kívül hagyva.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanott, $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$, egy átlagoló üzenetküldő lépés: $h' = 0{,}5\cdot x + m$, ahol $m$ a szomszédok átlaga. Mi az eredmény (A, B, C, D, E sorrendben)?`,
          options: [
            R`$(0{,}5;\ 0{,}333;\ 0{,}5;\ 2{,}5;\ 2{,}5)$`,
            R`$(0{,}5;\ 0{,}167;\ 0{,}333;\ 2{,}583;\ 5{,}083)$`,
            R`$(0;\ 0{,}333;\ 0{,}5;\ 2{,}5;\ 0)$`,
            R`$(0{,}5;\ 1;\ 1;\ 5;\ 2{,}5)$`
          ],
          answer: 0,
          hint: R`Mindenki a lépés előtti értékekből számol. Kétféle tag van: a saját érték fele és a szomszédok átlaga.`,
          explain: R`A szomszédátlag $m = (0;\ 0{,}333;\ 0{,}5;\ 2{,}5;\ 0)$, ehhez jön a saját érték fele: $(0{,}5;\ 0{,}333;\ 0{,}5;\ 2{,}5;\ 2{,}5)$. A $(0{,}5;\ 0{,}167;\ 0{,}333;\ 2{,}583;\ 5{,}083)$ sorban frissít: Bence már Anna új értékét látja, Emese Dávidét – így a csúcsok sorrendje számítana. A $(0;\ 0{,}333;\ \dots;\ 0)$ csak $m$, a saját tag kimaradt: Emese elfelejtené az ötösét. A $(0{,}5;\ 1;\ 1;\ 5;\ 2{,}5)$ átlag helyett összeget ($A\mathbf x$) vesz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az öt barát gráfján most $\mathbf x = (0;\ 0;\ 0;\ 1;\ 0)$ (csak Dávid). Átlagoló lépés: $h' = x + \mathop{\text{átlag}}$. Mennyi Bence és Emese értéke?`,
          options: [R`Bence $\approx 0{,}333$, Emese $1$`, R`Bence $1$, Emese $1$`, R`Bence $0{,}25$, Emese $0{,}5$`, R`Bence $\approx 0{,}289$, Emese $\approx 0{,}408$`],
          answer: 0,
          hint: R`Hány szomszédja van Bencének és Emesének? Az átlagba csak a szomszédok kerülnek, a saját érték külön tag.`,
          explain: R`Bence szomszédai A, C, D: $0 + \tfrac{0 + 0 + 1}{3} \approx 0{,}333$. Emese egyetlen szomszédja D: $0 + \tfrac11 = 1$. A „1 és 1” összeggel gyűjt, nem átlaggal. A „0,25 és 0,5” a saját csúcsot is beteszi az átlagba (önhurkos átlag: $\tfrac14$, $\tfrac12$) – ez egy másik szabály. A „0,289 és 0,408” a GCN súlyait ($P_{BD} = 1/\sqrt{12}$, $P_{ED} = 1/\sqrt6$) használja, pedig itt sima átlag a feladat.`
        },
        {
          type: "match",
          q: "Párosítsd a GCN hallgatólagos feltevését azzal, amit a hírgráfban megsért!",
          pairs: [
            ["egyféle él", "említi, támogatja, bírálja – más-más jelentés"],
            ["egyféle csúcs", "lap, cikk, szereplő, esemény, keret"],
            ["statikus gráf", "a cikkek napról napra érkeznek"],
            ["a szomszéd hasonló", "a bíráló és a bírált szomszédos, de nem hasonló"]
          ],
          hint: R`Mindegyik feltevés a GCN egy-egy részletéből jön: a közös $W$, a közös jellemzőtér, az idő nélküli élhalmaz, az átlagoló gyűjtés.`,
          explain: R`Az egyféle él (minden élen ugyanaz a $W$) a <a class="xref" href="#s122">12.2 relációs GNN</a>-ben oldódik fel, az egyféle csúcs a <a class="xref" href="#s123">12.3</a> heterogén modelljeiben és a <a class="xref" href="#s124">12.4</a> tudásgráfjában, a statikus gráf a <a class="xref" href="#s125">12.5</a> időbeli hálóiban, a hasonló szomszéd (homofília) a <a class="xref" href="#s126">12.6</a>-ban. A GCN minden gráfon lefut és ad egy számot – hogy a szám értelmes-e, ezeken a feltevéseken múlik.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Egy 16 → 8 dimenziós GCN-rétegnek az öt barát gráfján és egy millió csúcsú gráfon is 128 súlya van (eltolás nélkül).`,
            R`A GCN-ben azt, hogy egy szomszéd mennyit nyom, a fokszámok döntik el, nem a tartalom.`,
            R`Ha 384 dimenziós cikkvektorok és 3 dimenziós lapvektorok vannak egy gráfban, típusonként külön bemeneti vetítés (vagy közös jellemzőtér) kell.`,
            R`A bírálatot $-1$ súlyú élként megadva a GCN helyesen kezeli az éltípust.`,
            R`Két GCN-réteg után Emese ötöse már eljut Annához.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig: mitől függ a $W$ mérete, és mi a $\hat d$-s normálás szerepe? Hány ugrásra van Anna Emesétől?`,
          explain: R`Igaz az első: $W$ $16 \times 8$-as, minden csúcsnál ugyanaz, így $128$ súly a gráf méretétől függetlenül. Igaz a második: a GCN súlya $1/\sqrt{\hat d_u \hat d_v}$ – tanult, szomszédonként más súly a GAT-ban van (<a class="xref" href="../../mesterseges-intelligencia/13-graf-neuralis-halok/#s135-b">MI 13.5</a>). Igaz a harmadik: 384 és 3 dimenziós vektort ugyanaz a $W$ nem szoroz. Hamis a negyedik: a $\sqrt{\hat d_u \hat d_v}$-s normálás nem negatív súlyhoz készült – a típus nem szám, saját paraméter kell neki. Hamis az ötödik: Anna és Emese távolsága 3 (A–B–D–E), $k$ réteg $k$ ugrás, tehát három réteg kell. Lásd a <a class="xref" href="#s121-b">12.1 2. lépését</a>.`
        }
      ]
    },

    /* ------------------------------------------------ 12.2 */
    "gh12-122": {
      title: "Kvíz – 12.2 Relációs GNN",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Négy szereplő: támogató ($+$) élek Ko–Vi, Sz–Vi, Po–Ko, Vi–Po, bíráló ($-$) él Sz → Ko (itt még irányítatlannak vesszük). $x_{\mathrm{Sz}} = 1$, a többieké 0; $w_0 = w_+ = 1$, $w_- = -1$, relációnkénti átlag. Mennyi Ko értéke homogén (egy súly, sima átlag) és relációs lépés után?`,
          options: [R`homogén $\approx 0{,}333$, relációs $-1$`, R`homogén $\approx 0{,}333$, relációs $\approx -0{,}333$`, R`homogén $\approx 0{,}333$, relációs $0$`, R`homogén $\approx 0{,}333$, relációs $1$`],
          answer: 0,
          hint: R`Ko szomszédai: $N_+(\mathrm{Ko}) = \{\mathrm{Vi}, \mathrm{Po}\}$, $N_-(\mathrm{Ko}) = \{\mathrm{Sz}\}$. Relációnként külön átlagolj, aztán súlyozva add össze.`,
          explain: R`Homogén: $0 + \tfrac{0 + 0 + 1}{3} \approx 0{,}333$ – a kormány „kicsit szakértői” lett. Relációs: $0 + 1\cdot\tfrac{0+0}{2} + (-1)\cdot\tfrac11 = -1$: a kormány bírálatot hall. A $-0{,}333$ a bírálatot a teljes szomszédsággal (3) normálja relációnként helyett – ez egy másik változat. A $0$ a ReLU-t alkalmazza a negatív érték után: egyetlen skalárnál a bírálat jele eltűnik. Az $1$ a bírálat súlyát $+1$-nek veszi – akkor a két reláció megint ugyanazt mondaná. Lásd a <a class="xref" href="#s122-a">12.2 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanez a négy szereplő, most $x_{\mathrm{Vi}} = 1$, a többieké 0; $w_0 = w_+ = 1$, $w_- = -1$. Mi a relációs lépés eredménye (Ko, Vi, Po, Sz sorrendben)?`,
          options: [R`$(0{,}5;\ 1;\ 0{,}5;\ 1)$`, R`$(0{,}333;\ 1;\ 0{,}5;\ 0{,}5)$`, R`$(0{,}5;\ 0;\ 0{,}5;\ 1)$`, R`$(1;\ 1;\ 1;\ 1)$`],
          answer: 0,
          hint: R`Vi csak támogató éleken kapcsolódik. Kinek a támogató szomszédja Vi, és hány támogató szomszédja van annak?`,
          explain: R`Ko: $0 + \tfrac{1 + 0}{2} - \tfrac01 = 0{,}5$; Vi: $1 + \tfrac{0+0+0}{3} = 1$; Po: $0 + \tfrac{0 + 1}{2} = 0{,}5$; Sz: $0 + \tfrac11 - \tfrac01 = 1$. A $(0{,}333;\ 1;\ 0{,}5;\ 0{,}5)$ a homogén lépés (teljes szomszédság átlaga) – Ko-nál és Sz-nél a bíráló él „hígítja” a támogatást. A $(0{,}5;\ 0;\ 0{,}5;\ 1)$ elfelejti a saját tagot ($W_0$): Vi elveszti a saját értékét. Az $(1;\ 1;\ 1;\ 1)$ átlag helyett összeget vesz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legyen $w_+ = w_- = 1$ (a két reláció súlya egyenlő), $w_0 = 1$, $x_{\mathrm{Ko}} = 1$. Mennyi Sz értéke homogén és relációs lépés után?`,
          options: [R`homogén $0{,}5$, relációs $1$`, R`homogén $0{,}5$, relációs $0{,}5$`, R`homogén $1$, relációs $1$`, R`homogén $1$, relációs $0{,}5$`],
          answer: 0,
          hint: R`Egyenlő súly még nem jelenti ugyanazt a normálást. Sz-nek hány támogató és hány bíráló szomszédja van?`,
          explain: R`Homogén: $0 + \tfrac{0 + 1}{2} = 0{,}5$ (Vi és Ko átlaga). Relációs: $0 + \tfrac01 + \tfrac11 = 1$ – relációnként külön átlag, aztán összeg. A „0,5 és 0,5” azt hiszi, egyenlő súlyokkal a relációs lépés a homogénre egyszerűsödik; de a relációnkénti normálás miatt egy ritka reláció egyetlen éle annyit nyom, mint egy gyakori reláció összes éle. A homogén $1$ az átlag helyett összeget vesz.`
        },
        {
          type: "single", shuffle: true,
          q: R`A bírálatot most irányítottan kezeljük: Ko felé a „bírálja” ($w_- = -1$), Sz felé az inverz reláció ($w_{-^{-1}} = -0{,}5$). $x_{\mathrm{Ko}} = 1$, $w_0 = w_+ = 1$. Mennyi Sz értéke?`,
          options: [R`$-0{,}5$`, R`$-1$`, R`$0$`, R`$-1{,}5$`],
          answer: 0,
          hint: R`Melyik élen hall Sz Ko-tól: a „bírálja” élen vagy az inverzén? Az üzenet iránya dönti el, melyik súly érvényes.`,
          explain: R`Sz a támogató Vi-től $0$-t hall, Ko-tól az inverz élen: $0 + 1\cdot 0 + (-0{,}5)\cdot 1 = -0{,}5$. A $-1$ az irányítatlan változat – mintha Sz is a „bírálja” súlyával hallana; így elvész, ki bírál kit. A $0$ a kiinduló példa $w_{-^{-1}} = 0$ beállításával számol. A $-1{,}5$ mindkét súlyt hozzáadja, pedig egy élen egy irányban csak egy üzenet megy. Lásd a <a class="xref" href="#s122-b">12.2 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három irányított reláció, $d = d' = 32$. Hány súlya van egy R-GCN-rétegnek (eltolás nélkül)?`,
          options: [R`$7168$`, R`$6144$`, R`$4096$`, R`$3072$`],
          answer: 0,
          hint: R`Irányított gráfban minden relációhoz jön egy inverz. És a saját vektornak is van mátrixa.`,
          explain: R`Az inverzekkel $R = 6$, plusz a $W_0$: $(6 + 1)\cdot 32 \cdot 32 = 7168$. A $6144 = 6 \cdot 1024$ a $W_0$-t hagyja ki. A $4096 = 4 \cdot 1024$ az inverz relációkat nem számolja ($R = 3$ a $2R$ helyett). A $3072$ mindkét hibát elköveti. Minden reláció egy teljes $d \times d'$-s mátrixot kap – ezért nő a paraméterszám ilyen gyorsan.`
        },
        {
          type: "single", shuffle: true,
          q: R`Bázisfelbontás: $R = 40$ reláció (az inverzekkel együtt), $d = d' = 64$, $B = 8$ alapmátrix. Hány paraméter van rétegenként?`,
          options: [R`$37\,184$`, R`$36\,864$`, R`$33\,088$`, R`$167\,936$`],
          answer: 0,
          hint: R`Három rész van: az alapmátrixok $V_b$, a relációnkénti együtthatók $a_{rb}$ és a saját tag $W_0$.`,
          explain: R`$B\cdot d\cdot d' + R\cdot B + d\cdot d' = 8 \cdot 4096 + 40 \cdot 8 + 4096 = 37\,184$. A $36\,864$ az együtthatókat ($RB = 320$) felejti el, a $33\,088$ a $W_0$-t. A $167\,936 = 41 \cdot 4096$ a felbontás nélküli R-GCN – a bázisfelbontás itt több mint négyszer kevesebb.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Bázisfelbontással egy ritka reláció a gyakori relációk adataiból is tanult alapmátrixokat használja.`,
            R`Két relációnál, $B = 2$, $d = d' = 16$ mellett a felbontás nem spórol: $772$ paraméter a $768$ helyett.`,
            R`Egy szimmetrikus relációhoz (pl. „közösen nyilatkozik”) nem kell külön inverz súly.`,
            R`Az $a_{rb}$ együtthatók egyértelműen megadják a reláció jelentését.`,
            R`Az inverz relációt érdemes ugyanazzal a súllyal venni, mint az eredetit.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi történik az együtthatókkal, ha az alapmátrixokat elforgatod? És mi vész el, ha az oda- és a visszaút súlya azonos?`,
          explain: R`Igaz az első: a felbontás megosztja a statisztikai erőt – ez regularizál. Igaz a második: $2 \cdot 256 + 2\cdot 2 + 256 = 772$, nélküle $3 \cdot 256 = 768$; kevés relációnál nem éri meg. Igaz a harmadik: szimmetrikus relációnál az inverz ugyanaz a reláció. Hamis a negyedik: az alapmátrixok forgatásával más együtthatók ugyanazt a $W_r$-t adják. Hamis az ötödik: azonos súllyal az irány megint elvész – épp ez az irányítatlan változat. Lásd a <a class="xref" href="#s122-c">12.2 3. lépését</a>.`
        }
      ]
    },

    /* ------------------------------------------------ 12.3 */
    "gh12-123": {
      title: "Kvíz – 12.3 Heterogén GNN-ek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A heterogén Árvízhét 32 csúcsú, 63 élű (L–C 12, C–Sz 27, C–K 12, C–E 12). Hány éle marad, ha az eseményeket kihagyjuk, és hány reláció kell akkor egy R-GCN-hez az inverzekkel?`,
          options: [R`51 él, 6 reláció`, R`51 él, 3 reláció`, R`57 él, 6 reláció`, R`63 él, 8 reláció`],
          answer: 0,
          hint: R`Az eseménycsúcsokkal együtt az összes C–E él eltűnik. A maradék éltípusok mind irányítottak.`,
          explain: R`$63 - 12 = 51$ él marad (L–C, C–Sz, C–K). A 3 éltípus mind irányított (a lap közli a cikket, nem fordítva), az inverzekkel $6$ reláció. A „3 reláció” az inverzeket hagyja ki. Az „57 él” a 6 eseménycsúcsot vonja le a 12 C–E él helyett. A „63 él, 8 reláció” a teljes gráfé, események nélkül nem ennyi. Lásd a <a class="xref" href="#s123-a">12.3 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Nyitott Szó cikkei: C7 (La, Ön), C8 (La, Po, Ön), C9 (La, Ön); a Vidéki Naplóé: C10 (Po, Vi), C11 (Po, La), C12 (Ön, Po). Hány L–C–Sz–C–L út van NY és VN között?`,
          options: [R`$9$`, R`$3$`, R`$7$`, R`$12$`],
          answer: 0,
          hint: R`Közös szereplőnként szorozz: hány NY-cikk és hány VN-cikk említi az adott szereplőt? Aztán add össze.`,
          explain: R`Közös szereplők: La (NY 3 cikke · VN 1 cikke $= 3$), Po ($1 \cdot 3 = 3$), Ön ($3 \cdot 1 = 3$) – összesen $9$. Ez $M_\Phi = A_{LC}A_{CS}A_{CS}^\top A_{LC}^\top$ NY–VN eleme. A $3$ csak a közös szereplőket számolja, nem az utakat. A $7$ a közös szereplős cikkpárokat számolja – de a C8–C11 és a C8–C12 párnak két közös szereplője van, így két-két utat ad. A $12$ a VN főátlóbeli eleme. Lásd a <a class="xref" href="#s123-b">12.3 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az L–C–Sz–C–L mátrix RH sora (RH, EK, NY, VN sorrendben): $(17;\ 5;\ 2;\ 8)$. Mit jelent a $17$?`,
          options: [
            R`Az RH oda-vissza útjainak számát: az RH szereplő-említéseiből adódó aktivitást, nem kapcsolatot`,
            R`Hogy az RH a legerősebben önmagához kapcsolódik, ezért ő a saját legjobb szomszédja`,
            R`Hogy az RH cikkei 17 különböző szereplőt említenek`,
            R`Az RH és a többi lap közti utak összegét`
          ],
          answer: 0,
          hint: R`Írd fel, hányszor említi az RH három cikke (C1, C2, C3) az egyes szereplőket. Egy oda-vissza út: lap → cikk → szereplő → cikk → ugyanaz a lap.`,
          explain: R`Az RH-ban Ko-t 3, Vi-t 2, Po-t 2 cikk említi: $3^2 + 2^2 + 2^2 = 17$ oda-vissza út. Ez a csúcs aktivitása – a főátlót szomszédságnak olvasni tipikus hiba. Különböző szereplő csak 3 van. A többi lappal $5 + 2 + 8 = 15$ út fut, nem 17. És a sor többi eleme sem erősség normálás nélkül: az RH–VN 8 részben azért nagy, mert mindkét lap sokat írt a Po-ról – erősséghez Jaccard vagy koszinusz kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Keretek: a NY mindhárom cikke lakossági veszteség; a VN-nél C10 védekezés, C11 és C12 veszteség. Mennyi az L–C–K–C–L mátrix NY–VN eleme?`,
          options: [R`$6$`, R`$1$`, R`$9$`, R`$5$`],
          answer: 0,
          hint: R`Közös keretenként szorozz: hány NY-cikk és hány VN-cikk tartozik ahhoz a kerethez?`,
          explain: R`Egyetlen közös keret van, a veszteség: $3 \cdot 2 = 6$ út. Az $1$ a közös keretek száma, nem az utaké. A $9 = 3 \cdot 3$ a NY főátlója, az $5 = 1^2 + 2^2$ a VN-é – ezek oda-vissza utak, nem a két lap kapcsolata.`
        },
        {
          type: "single", shuffle: true,
          q: R`A HAN szemantikai pontszámai három metaútvonalra: $w = (1;\ 1;\ -1)$. Mennyi a $\beta$?`,
          options: [R`$\approx (0{,}468;\ 0{,}468;\ 0{,}063)$`, R`$(0{,}5;\ 0{,}5;\ 0)$`, R`$\approx (0{,}333;\ 0{,}333;\ 0{,}333)$`, R`$\approx (0{,}731;\ 0{,}731;\ 0{,}269)$`],
          answer: 0,
          hint: R`$\beta_\Phi = \exp(w_\Phi) / \sum_{\Phi'}\exp(w_{\Phi'})$. Az eredménynek 1-re kell összegződnie.`,
          explain: R`$e^1 \approx 2{,}718$ kétszer, $e^{-1} \approx 0{,}368$: összeg $5{,}804$, $\beta \approx (0{,}468;\ 0{,}468;\ 0{,}063)$. A $(0{,}5;\ 0{,}5;\ 0)$ a negatív pontszámot nullára vágja – a softmax nem így működik, a $-1$ is kap kis súlyt. Az egyenlő $\beta$ csak egyenlő pontszámnál jönne ki. A $(0{,}731;\ 0{,}731;\ 0{,}269)$ metaútvonalanként külön szigmoidot számol: az összege nem 1, nem eloszlás. Lásd a <a class="xref" href="#s123-c">12.3 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A C10 két nézete: $\mathbf z^{\text{CLC}} = (0;\ 0;\ 1)$ és $\mathbf z^{\text{CSzC}} = (0{,}5;\ 0{,}125;\ 0{,}375)$ (védekezés; hiány; veszteség). Mekkora $\beta_{\text{CSzC}}$ fölött jósolja a kevert vektor a helyes védekezést?`,
          options: [R`$8/9 \approx 0{,}889$`, R`$2/3 \approx 0{,}667$`, R`$0{,}5$`, R`semmilyen $\beta$ mellett`],
          answer: 0,
          hint: R`Legyen $b = \beta_{\text{CSzC}}$, $\beta_{\text{CLC}} = 1 - b$. Írd fel a védekezés és a veszteség koordinátáját $b$ függvényében – mindkét nézetből jön veszteség.`,
          explain: R`Védekezés: $0{,}5b$; veszteség: $(1 - b) + 0{,}375b$. Egyenlőség: $0{,}5b = 1 - 0{,}625b$ → $b = 8/9 \approx 0{,}889$. A $2/3$ elfelejti, hogy a C–Sz–C nézet is ad $0{,}375$ veszteséget. A $0{,}5$ azt hiszi, elég, ha a szereplők nézete a nagyobb súlyú. A „semmilyen” a C–Sz–C szomszédokat súlyozatlanul számolja (a C2-t egyszer, nem kétszer): akkor $(3;\ 1;\ 3)/7$ jönne ki, a védekezés és a veszteség egyenlő, és a CLC nézet mindig a veszteséget billentené. A tanulság: egy közös $\beta$ minden cikkre ugyanaz, és a legtöbb cikknél a lap a jobb nézet (<a class="xref" href="#s127">12.7</a>).`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány súlya van egy HGT-rétegnek 3 csúcstípussal, 4 relációval, $d = 8$-cal (csúcstípusonként $Q$, $K$, $V$, éltípusonként $W^{\text{ATT}}$ és $W^{\text{MSG}}$)?`,
          options: [R`$1088$`, R`$832$`, R`$704$`, R`$1600$`],
          answer: 0,
          hint: R`Minden mátrix $d \times d = 64$ elemű. Számold meg: típusonként hány vetítés, éltípusonként hány mátrix?`,
          explain: R`$3 \cdot 3 \cdot 64 + 4 \cdot 2 \cdot 64 = 576 + 512 = 1088$. A $832$ éltípusonként csak egy mátrixot vesz (a $W^{\text{MSG}}$ kimarad). A $704$ típusonként egyetlen vetítést számol $Q$, $K$, $V$ helyett. Az $1600$ a 4 relációt még egyszer megduplázza inverzekkel – de az itt megadott 4 reláció már a teljes lista. Egy 12 címkés gráfon ez már túl sok paraméter: ezért kell mellé homogén alapvonal. Lásd a <a class="xref" href="#s123-d">12.3 4. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a HAN-ról és a HGT-ről? (Több jó válasz is lehet.)",
          options: [
            R`A HAN csak a megadott metaútvonalak között választ: ha a jó nézet nincs a listán, a figyelem sem találja meg.`,
            R`A HAN $\beta_\Phi$ súlya minden csúcsra ugyanaz – a metaútvonal „globális fontossága”.`,
            R`Lv és társai (2021) újrafuttatásában a megfelelő bemenettel futtatott homogén GAT a legtöbb heterogén GNN-t utolérte vagy megelőzte.`,
            R`Ha $\beta_{\text{CLC}} \approx 0{,}73$, az bizonyítja, hogy a cikk keretét a lap okozza.`,
            R`A HGT-nek is meg kell adni a metaútvonalak listáját.`
          ],
          answer: [0, 1, 2],
          hint: R`Ki dönti el a metaútvonalakat a HAN-ban, és min dolgozik a HGT? Mit mond (és mit nem) egy tanult figyelmi súly?`,
          explain: R`Igaz az első: a metaútvonalak kiválasztása szakértői döntés. Igaz a második: a szemantikai figyelem pontszáma az összes csúcson átlagolt. Igaz a harmadik – a Simple-HGN (GAT éltípus-vektorral) még erősebb is volt. Hamis a negyedik: a figyelmi súly tanított súly, nem magyarázat; több súlyozás is ugyanolyan jóslatot adhat. Hamis az ötödik: a HGT a közvetlen éleken dolgozik meta-relációkkal, a hosszabb utakat a rétegek járják be. Lásd a <a class="xref" href="#s123-d-konszenzus">konszenzus és vita</a> dobozt.`
        }
      ]
    },

    /* ------------------------------------------------ 12.4 */
    "gh12-124": {
      title: "Kvíz – 12.4 Tudásgráf-beágyazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`TransE a síkon: Budapest $(1;\ 1)$, Ausztria $(4;\ 4)$, $\mathbf r_{\textit{fővárosa}} = (3;\ 1)$. Mennyi a (Budapest, fővárosa, Ausztria) hármas pontszáma, $f = -\lVert \mathbf h + \mathbf r - \mathbf t\rVert$?`,
          options: [R`$-2$`, R`$2$`, R`$-4$`, R`$\approx -4{,}243$`],
          answer: 0,
          hint: R`Előbb told el a fejet a reláció vektorával, aztán mérd meg a távolságot a faroktól. Figyelj az előjelre!`,
          explain: R`Budapest $+ \mathbf r = (4;\ 2)$, Ausztria $(4;\ 4)$: a távolság $2$, a pontszám $-2$ (a nagyobb a jobb, $0$ a tökéletes). A $2$ a távolság maga – az előjel összekeverése tipikus hiba: távolság szerint növekvően, pontszám szerint csökkenően rendezünk. A $-4$ a négyzetes távolság. A $-4{,}243 = -\sqrt{18}$ elfelejti a reláció vektorát, és Budapestet közvetlenül Ausztriához méri. Lásd a <a class="xref" href="#s124-b">12.4 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanazokkal a vektorokkal (Prága $(1;\ 5)$, Bécs $(1;\ 3)$, Magyarország $(4;\ 2)$, Ausztria $(4;\ 4)$, Csehország $(4;\ 6)$, $\mathbf r = (3;\ 1)$): milyen sorrendbe kerül a három ország a $(\text{Prága},\ \textit{fővárosa},\ ?)$ lekérdezésre?`,
          options: [
            R`Csehország (0), Ausztria (2), Magyarország (4)`,
            R`Magyarország (4), Ausztria (2), Csehország (0)`,
            R`Csehország és Ausztria holtversenyben ($\approx 3{,}162$), Magyarország ($\approx 4{,}243$)`,
            R`Ausztria (0), holtversenyben Magyarország és Csehország (2)`
          ],
          answer: 0,
          hint: R`Számold ki Prága $+ \mathbf r$-et, és mérd meg a távolságát mindhárom országtól. Melyik irányban rendezel?`,
          explain: R`Prága $+ \mathbf r = (4;\ 6)$ = Csehország (0), utána Ausztria (2) és Magyarország (4) – a helyes válasz az első. A fordított sorrend a távolságot pontszámnak olvassa (a nagyobb távolságot teszi előre). A holtversenyes, $3{,}162$-es változat elfelejti az eltolást, és Prágát közvetlenül méri. Az „Ausztria (0)” a Bécs-lekérdezés eredménye – rossz fejjel számol. (Az összes entitás között Prága maga a 3. lenne, $3{,}162$-vel: a fejet is rangsoroljuk.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Margós veszteség: $\mathbf r = (2;\ 1)$, pozitív (Budapest, fővárosa, Magyarország), negatív (Budapest, fővárosa, Ausztria); így $d^+ = 1$, $d^- = \sqrt5 \approx 2{,}236$. Mennyi a veszteség $\gamma = 1$ és $\gamma = 2$ mellett?`,
          options: [R`$0$ és $\approx 0{,}764$`, R`$\approx -0{,}236$ és $\approx 0{,}764$`, R`$\approx 2{,}236$ és $\approx 3{,}236$`, R`$0$ és $0$`],
          answer: 0,
          hint: R`$\mathcal L = \max(0,\ \gamma + d^+ - d^-)$. Melyik távolság kerül pozitív előjellel a képletbe, és mit csinál a $\max$?`,
          explain: R`$\gamma = 1$: $1 + 1 - 2{,}236 \lt 0$, tehát $\mathcal L = 0$ – a margó teljesül, a pár nem tanít, pedig $d^+$ még nem 0. $\gamma = 2$: $2 + 1 - 2{,}236 \approx 0{,}764$ – a nagyobb margó miatt most tanít. A $-0{,}236$ elhagyja a $\max(0, \cdot)$-t: a veszteség nem lehet negatív. A $2{,}236$ / $3{,}236$ felcseréli $d^+$-t és $d^-$-t. A „0 és 0” négyzetes távolságokkal számol ($1$ és $5$) – a TransE itt a távolságot használja. Ne feledd: 0 veszteség csak annyit jelent, hogy a látott párokban teljesül a margó, nem tökéletes modellt.`
        },
        {
          type: "single", shuffle: true,
          q: R`RotatE, egy dimenzió az egységkörön: Szakértő a $0°$-nál, Kormány a $90°$-nál, $\varphi_{\textit{bírálja}} = 60°$. Mennyi a $d(\text{Sz} \circ r,\ \text{Ko})$? (Az egységkörön két pont távolsága $2\sin(\Delta/2)$.)`,
          options: [R`$\approx 0{,}518$`, R`$1$`, R`$\approx 0{,}524$`, R`$\approx 1{,}732$`],
          answer: 0,
          hint: R`Hová kerül a Szakértő a forgatás után? Mekkora a szögkülönbség a Kormányig?`,
          explain: R`Sz $\circ\ r$ a $60°$-nál, Ko a $90°$-nál: $\Delta = 30°$, a távolság $2\sin 15° \approx 0{,}518$. Az $1 = 2\sin 30°$ a fél szög helyett az egészet teszi a szinuszba. A $0{,}524 = \pi/6$ az ívhossz, nem a húr (a távolság egyenes vonalú). Az $1{,}732 = 2\sin 60°$ a forgatás szögét veszi szögkülönbségnek. $\varphi = 90°$-nál a távolság 0 lenne, a fordított irányban 2 – így különbözteti meg a RotatE, ki bírál kit.`
        },
        {
          type: "set",
          q: R`Melyik relációmintát tudja kifejezni a TransE (van olyan beágyazás, amelyben a minta hármasai tökéletes pontszámot kapnak, a hamisak nem)?`,
          items: ["antiszimmetrikus (bírálja)", "inverz (szülője ↔ gyermeke)", "összetett (anyja ∘ férje = apja)", "szimmetrikus (házastársa)", "1–N (Magyarország városa: Budapest, Debrecen)"],
          answer: ["antiszimmetrikus (bírálja)", "inverz (szülője ↔ gyermeke)", "összetett (anyja ∘ férje = apja)"],
          hint: R`Írd fel a mintát eltolásokkal: $\mathbf h + \mathbf r = \mathbf t$. Mi jön ki, ha ugyanazt a relációt oda-vissza kell alkalmazni, vagy ha egy fejhez két különböző farok tartozik?`,
          explain: R`Antiszimmetrikus: egy nem nulla eltolás visszafelé nem ad vissza – ✓. Inverz: $-\mathbf r$ – ✓. Összetett: $\mathbf r_1 + \mathbf r_2$ – ✓. Szimmetrikus: $\mathbf a + \mathbf r = \mathbf b$ és $\mathbf b + \mathbf r = \mathbf a$ → $\mathbf r = \mathbf 0$, $\mathbf a = \mathbf b$ – a két entitás egybeesik ✗ (ide a DistMult vagy a RotatE $180°$-kal való). 1–N: Budapest és Debrecen ugyanoda kellene kerüljön; Magyarország $(1;\ 3)$, Budapest $(4;\ 4)$, Debrecen $(4;\ 2)$ mellett a legjobb $\mathbf r = (3;\ 0)$, és mindkét távolság 1 ✗. Vigyázz: „ki tudja fejezni” nem azonos azzal, hogy kevés adatból „meg is tanulja”. Lásd a <a class="xref" href="#s124-c">12.4 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy teszthármasra a helyes válasz helyezése: 1., 2., 4. és 5. Mennyi az MRR és a Hits@3?`,
          options: [R`MRR $\approx 0{,}488$, Hits@3 $= 0{,}5$`, R`MRR $\approx 0{,}333$, Hits@3 $= 0{,}5$`, R`MRR $= 0{,}5$, Hits@3 $\approx 0{,}488$`, R`MRR $= 1{,}95$, Hits@3 $= 0{,}5$`],
          answer: 0,
          hint: R`Az MRR a reciprok rangok átlaga – nem az átlagos rang reciproka. A Hits@3 azt számolja, hányszor volt a top 3-ban.`,
          explain: R`MRR $= \tfrac14\big(1 + \tfrac12 + \tfrac14 + \tfrac15\big) = \tfrac{1{,}95}{4} \approx 0{,}488$. Hits@3: az 1. és a 2. hely számít, $2/4 = 0{,}5$. A $0{,}333 = 1/3$ az átlagos rang ($3$) reciproka – az nem az MRR. A harmadik opció felcseréli a két mértéket. Az $1{,}95$ a reciprokok összege, átlagolás nélkül. Az MRR az első helyeket jutalmazza: az 1. és a 2. hely között $0{,}5$ a különbség, a 4. és az 5. között csak $0{,}05$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $(h, r, ?)$ lekérdezésre a helyes válasz nyers rangja 6. Előtte az 1. és a 4. helyen olyan jelölt áll, amely más igaz hármasként már ismert (a tanítóadatban); a 2., 3. és 5. helyen nem. Mi a szűrt rang?`,
          options: [R`$4$`, R`$6$`, R`$3$`, R`$5$`],
          answer: 0,
          hint: R`A szűrt rangsorból melyik jelölteket hagyjuk ki: az ismert igaz válaszokat vagy a hamisakat?`,
          explain: R`A két ismert igaz választ kihagyjuk: $6 - 2 = 4$. A $6$ a nyers rang – az bünteti a modellt azért, mert egy másik helyes választ tett elé; mindig írd ki, melyiket számoltad. A $3$ éppen a hamis jelölteket szűri ki – fordítva. Az $5$ csak az egyik igaz választ hagyja ki. Lásd a <a class="xref" href="#s124-d">12.4 4. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az, hogy a (Szakértő, bírálja, Vízügy) hármas nincs a gráfban, nem jelenti, hogy hamis.`,
            R`A fejcserével készült (Lakók, bírálja, Kormány) „negatív” hármas akár igaz is lehet.`,
            R`Ha a helyes válasz 5 másik jelölttel holtversenyben áll, optimistán az 1. helyet adni torzít.`,
            R`Ha a margós veszteség minden tanítópáron 0, a modell tökéletes.`,
            R`DistMult-tal megkülönböztethető, hogy a Szakértő bírálja a Kormányt, vagy a Kormány a Szakértőt.`
          ],
          answer: [0, 1, 2],
          hint: R`Nyílt vagy zárt világ? És mit ad a DistMult pontszáma, ha a fejet és a farkat felcseréled?`,
          explain: R`Igaz az első: a tudásgráf nyílt világ – ami nincs benne, az ismeretlen, nem hamis (zárt világ egy menetrendnél ésszerű, a híreknél nem). Igaz a második: a negatív mintavétel csak feltételezett negatívat ad; a károsult lakók bírálhatják a kormányt. Igaz a harmadik: szokás a holtverseny középső (vagy legrosszabb) rangja. Hamis a negyedik: a 0 veszteség csak annyi, hogy a látott párokon teljesül a margó. Hamis az ötödik: a $\sum_i h_i r_i t_i$ szorzat sorrendje mindegy, pl. Sz $= (1;\ 2)$, Ko $= (2;\ 1)$, $\mathbf r = (1;\ 1)$ mellett mindkét irány $4$ – a DistMult irányított relációra rossz választás. Lásd a <a class="xref" href="#s124-a">12.4 1. lépését</a>.`
        }
      ]
    },

    /* ------------------------------------------------ 12.5 */
    "gh12-125": {
      title: "Kvíz – 12.5 Időbeli gráfhálók",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét 12 cikke összesen 27 szereplőt említ (cikkenként 2 vagy 3). Ha minden cikk minden szereplőpárja egy $(u, v, t)$ esemény, hány esemény lesz?`,
          options: [R`$18$`, R`$27$`, R`$12$`, R`$21$`],
          answer: 0,
          hint: R`Egy cikk nem szereplőnként, hanem szereplőpáronként ad eseményt. Hány pár van 2, és hány 3 szereplő között?`,
          explain: R`Kilenc cikk 2 szereplős ($\binom22 = 1$ esemény), három (a 2., az 5. és a 8.) 3 szereplős ($\binom32 = 3$): $9 + 3 \cdot 3 = 18$. A 27 az említések (a C–Sz élek) száma, nem a pároké. A 12 a cikkek száma – mintha minden cikk egy esemény lenne. A 21 a 7 szereplő összes lehetséges párja ($\binom72$); ezek közül sok sosem fordul elő, a La–Ön pedig háromszor is. Lásd a <a class="xref" href="#s125-a-folyam">12.5 kiinduló példáját</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Csúcsmemória $\lambda = 0{,}5$-tel: minden nap elején feleződik, minden esemény 1-gyel növeli. A Kormány (Ko) eseményei: H 1, K 0, Sze 2, Cs 2. Mennyi $s_{\mathrm{Ko}}$ csütörtök este?`,
          options: [R`$3{,}125$`, R`$4{,}25$`, R`$5$`, R`$1{,}5625$`],
          answer: 0,
          hint: R`Napról napra haladj: előbb szorozz $\lambda$-val, aztán add hozzá az aznapi eseményeket.`,
          explain: R`H: $1$; K: $0{,}5$; Sze: $0{,}25 + 2 = 2{,}25$; Cs: $0{,}5 \cdot 2{,}25 + 2 = 3{,}125$. A $4{,}25 = 2{,}25 + 2$ csütörtökön elfelejti a feleződést. Az $5$ a $\lambda = 1$ eset: az addigi események száma, semmi nem halványul. Az $1{,}5625$ fordított sorrendben számol (előbb hozzáad, aztán feleződik minden nap): így az aznapi esemény is azonnal veszít a súlyából. Lásd a <a class="xref" href="#s125-b-memoria">12.5 memóriapéldáját</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Időkódolás két frekvenciával, $\omega = (1;\ 0{,}25)$ (napokban), $\phi(\Delta t) = \big(\cos(\omega_1 \Delta t),\ \cos(\omega_2 \Delta t)\big)$. A Polgármester előző eseménye 2 napja volt. Mi $\phi(2)$?`,
          options: [R`$(-0{,}416;\ 0{,}878)$`, R`$(0{,}909;\ 0{,}479)$`, R`$(0{,}540;\ 0{,}969)$`, R`$(-0{,}990;\ 0{,}732)$`],
          answer: 0,
          hint: R`Mindkét koordinátában a saját frekvenciával szorozd az eltelt időt, és radiánban számolj.`,
          explain: R`$\cos 2 \approx -0{,}416$, $\cos(0{,}25 \cdot 2) = \cos 0{,}5 \approx 0{,}878$. A $(0{,}909;\ 0{,}479)$ szinuszt számol koszinusz helyett. A $(0{,}540;\ 0{,}969)$ a $\phi(1)$, a $(-0{,}990;\ 0{,}732)$ a $\phi(3)$ – rossz $\Delta t$. Figyeld meg: a gyors koordináta egy nap alatt az előjelét is váltja, a lassú alig mozdul – együtt különböztetik meg a közeli és a távoli múltat. Lásd a <a class="xref" href="#s125-b">12.5 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy teszthalmaz eseményeinek 75%-a ismétlés (a pár már korábban előfordult). Mennyi az EdgeBank AUC-ja könnyű, illetve történeti negatívákkal?`,
          options: [R`könnyű: $0{,}875$, történeti: $0{,}375$`, R`könnyű: $0{,}75$, történeti: $0$`, R`könnyű: $1$, történeti: $0{,}75$`, R`könnyű: $0{,}875$, történeti: $0{,}625$`],
          answer: 0,
          hint: R`Az EdgeBank pontszáma 1 a látott, 0 a nem látott párra. Milyen pontszámú egy könnyű és egy történeti negatíva? Holtverseny: fél pont.`,
          explain: R`Könnyű negatíva (soha nem látott): 0. Az ismétlés (1) mindig nyer, az új pár (0) holtverseny: $0{,}75 + 0{,}25 \cdot \tfrac12 = 0{,}875$. Történeti negatíva (látott): 1. Az ismétlés holtverseny, az új pár mindig veszít: $0{,}75 \cdot \tfrac12 + 0 = 0{,}375$. A „$0{,}75$ / $0$” a holtversenyt 0-nak számolja, az „$1$ / $0{,}75$” 1-nek. A „$0{,}625$” azt hiszi, hogy a történeti negatívák ellen az új pár nyer – pedig a 0 a kisebb pontszám. Tanulság: az EdgeBank könnyű negatívákkal erősnek látszik, történetiekkel a véletlennél is rosszabb. Lásd a <a class="xref" href="#s125-c-edgebank">12.5 EdgeBank-példáját</a>.`
        },
        {
          type: "set",
          q: R`Szerda este vágunk, az EdgeBank memóriája minden nap végén bővül. Jelöld ki a teszteseményeket, amelyeket „eltalál” (a pár korábban már előfordult)!`,
          items: ["Cs: Ko–Sz", "Cs: Ko–Kl", "Cs: Sz–Kl", "Cs: Po–La", "Cs: Po–Ön", "Cs: La–Ön", "P: Ko–Po", "Szo: Sz–Kl", "Szo: Po–Ön", "V: La–Ön"],
          answer: ["Cs: Po–La", "Cs: La–Ön", "P: Ko–Po", "Szo: Sz–Kl", "Szo: Po–Ön", "V: La–Ön"],
          hint: R`A hét eleji párok: Ko–Vi, Vi–Sz, La–Ön, Vi–Po, Ko–Po, Po–La. És ne feledd: a csütörtöki események szombatra már „látottak”.`,
          explain: R`Csütörtökön a Po–La (szerdán volt) és a La–Ön (kedden volt) ismétlés; a Ko–Sz, a Ko–Kl, a Sz–Kl és a Po–Ön új. Pénteken a Ko–Po (szerda), szombaton a Sz–Kl és a Po–Ön (mindkettő csütörtökön), vasárnap a La–Ön – ez 6 a 10-ből. Aki a memóriát nem bővíti a tesztidőszakban, a szombati Sz–Kl-t és Po–Ön-t is kihagyja (csak 4 találat). A bővítés nem szivárgás: a szombati jóslás idejére a csütörtök már múlt. Lásd a <a class="xref" href="#s125-c-edgebank">12.5 EdgeBank-táblázatát</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szerda esti memóriák ($\lambda = 0{,}5$): Po 3,5; Vi 3; Ko 2,25; La 1,5; Ön 0,5; Sz 0,25; Kl 0. A népszerűségi alapvonal pontszáma $s_u \cdot s_v$. Melyik <b>új</b> (szerdáig elő nem fordult) pár kapja a legnagyobb pontszámot?`,
          options: [R`Vi–La, $4{,}5$`, R`Vi–Po, $10{,}5$`, R`Ko–La, $3{,}375$`, R`Ko–Kl, $2{,}25$`],
          answer: 0,
          hint: R`Előbb húzd ki a szerdáig már előfordult párokat (Ko–Vi, Vi–Sz, La–Ön, Vi–Po, Ko–Po, Po–La), aztán szorozz.`,
          explain: R`A legnagyobb szorzat a Vi–Po ($3{,}5 \cdot 3 = 10{,}5$), de az már kedden és szerdán is előfordult – nem új. Az új párok közül a Vi–La: $3 \cdot 1{,}5 = 4{,}5$; a második a Ko–La ($2{,}25 \cdot 1{,}5 = 3{,}375$). A Ko–Kl pontszáma $2{,}25 \cdot 0 = 0$; a $2{,}25$ összeadja a memóriákat szorzás helyett. A Vi–La a hét végén sem jön elő, a Ko–Kl viszont igen: a Kl-nek nincs memóriája, így egy aktivitás-alapú módszer sem találhatja meg. Lásd a <a class="xref" href="#s125-c">12.5 3. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az időbeli modellek kiértékeléséről? (Több jó válasz is lehet.)",
          options: [
            R`Ha a 18 eseményt véletlenül osztjuk tanító- és teszthalmazra, a csütörtöki eseményt a vasárnapiból is tanulhatnánk jósolni.`,
            R`Ha a csütörtöki jóslás előtt a csütörtöki eseményeket is beírjuk a memóriába, pontosabb lesz a modell, ezért ez a helyes eljárás.`,
            R`Ha egy modell könnyű negatívákkal 0,85-ös AUC-t ér el, az EdgeBank pedig 0,8-at, a különbségből még nem derül ki, hogy a modell tud-e többet az ismétlésnél.`,
            R`A nagyobb $\lambda$ mindig jobb, mert a modell többet emlékszik.`,
            R`Az ismétlődő és az új párokra elért eredményt külön kell közölni.`
          ],
          answer: [0, 2, 4],
          hint: R`Gondold végig a <a class="xref" href="#s125-c">12.5 kiértékelési szabályát</a>: időrend, erős alapvonal, többféle negatív, ismétlés külön.`,
          explain: R`Igaz az első: véletlen felosztásnál a jövőből tanulunk – időbeli gráfon ezért mindig időrendben vágunk. Igaz a harmadik: könnyű negatívákkal az ismétlés is 0,8-at ér, a kis különbség keveset mond; a történeti negatívák mutatják meg, tud-e többet a modell. Igaz az ötödik: egy hírelemzési kérdés többnyire az új kapcsolatokról szól, ott az ismétlés-alapú pontosság semmit nem mond. Hamis a második: ez szivárgás – a TGN egy eseményt csak azután ír a memóriába, hogy jósolt rá. Hamis a negyedik: a nagy $\lambda$ lassan reagál az új eseményekre; a jó érték a gráf ritmusától függ, ezért tanuljuk. Lásd a <a class="xref" href="#s125-c">12.5 3. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a jelentésével!",
          pairs: [
            ["pillanatfelvétel", "egy időablak (pl. egy nap) összes éle egy gráfban"],
            ["eseményfolyam", "az egyenként, időrendben érkező (u, v, t) események"],
            ["csúcsmemória", "minden őt érintő eseménnyel frissülő, idővel halványuló állapot"],
            ["időkódolás", "az eltelt idő vektora, több frekvenciájú koszinuszokból"],
            ["EdgeBank", "tanulás nélküli szabály: ami volt, az lesz"],
            ["történeti negatíva", "korábban látott pár, amely most nem fordul elő"],
            ["induktív negatíva", "a tesztben először megjelenő pár"]
          ],
          hint: R`Kettő az idő ábrázolásáról szól, kettő a folytonos idejű modell részeiről, három a kiértékelésről.`,
          explain: R`A pillanatfelvétel-modell napi (heti) gráfokon dolgozik, és egy ablakon belül elveszti az időrendet; az eseményfolyam minden időpontot megtart. A TGN a csúcsmemóriát GRU-val frissíti ($s \leftarrow \lambda s + 1$ ennek egyszámos változata), a TGAT időkódolása $\phi(\Delta t) = (\cos \omega_i \Delta t)_i$. Az EdgeBank a látott párokra 1-et ad: a történeti negatívák ellen ezért gyenge, az induktív negatívák ellen semmit nem tud. Lásd a <a class="xref" href="#s125-a">12.5 1. lépését</a> és a <a class="xref" href="#s125-c">3. lépését</a>.`
        }
      ]
    },

    /* ------------------------------------------------ 12.6 */
    "gh12-126": {
      title: "Kvíz – 12.6 Gyakorlati kérdések",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Képzeld el, hogy a 12 cikk közül 6 védekezés, 3 hiány és 3 veszteség. Két különböző cikket véletlenül választva mennyi az esélye, hogy azonos keretűek (a véletlen szint)?`,
          options: [R`$21/66 \approx 0{,}318$`, R`$1/3 \approx 0{,}333$`, R`$54/144 = 0{,}375$`, R`$6/12 = 0{,}5$`],
          answer: 0,
          hint: R`Számold meg az azonos keretű párokat keretenként, és oszd az összes cikkpár számával. Egy cikk önmagával nem pár.`,
          explain: R`Azonos keretű párok: $\binom62 + \binom32 + \binom32 = 15 + 3 + 3 = 21$, összes pár $\binom{12}2 = 66$: $21/66 \approx 0{,}318$. Az $1/3$ az egyenlő arányú, nagy gráfra érvényes közelítés – itt az arányok nem egyenlők. Az $54/144 = (6^2 + 3^2 + 3^2)/12^2$ visszatevéssel számol, vagyis egy cikket önmagával is párnak vesz. A $0{,}5$ a legnagyobb keret aránya – ez a többségi alapvonal, nem a véletlen szint. Egy metaútvonal akkor homofil, ha élhomofíliája e fölött van. Lásd a <a class="xref" href="#s126-a">12.6 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Új cikk érkezik, amely a Vízügyet és az Önkénteseket említi; a lapja ismeretlen. A meglévő cikkek a közös szereplők száma szerint szavaznak (C–Sz–C). Vi-t a C1, C2, C10 (védekezés) és a C4 (hiány), Ön-t a C7, C8, C9, C12 (veszteség) említi. Mi a jóslat, és mi lesz, ha kiderül, hogy a Reggeli Hírlap (3 védekezés-cikk) közölte?`,
          options: [
            R`lap nélkül veszteség (4 : 3), az RH-val védekezés (6 : 4)`,
            R`lap nélkül védekezés (3 : 1), az RH-val védekezés (6 : 1)`,
            R`lap nélkül veszteség (4 : 3), az RH-val is veszteség (4 : 4 holtverseny helyett a régi jóslat marad)`,
            R`lap nélkül döntetlen (3 : 3), az RH-val védekezés (6 : 3)`
          ],
          answer: 0,
          hint: R`Mindkét szereplő cikkei szavaznak. A lap a C–L–C metaútvonalon szavaz: a lap minden cikke egy-egy szavazat.`,
          explain: R`Védekezés: C1, C2, C10 = 3; hiány: C4 = 1; veszteség: C7, C8, C9, C12 = 4 → veszteség. Az RH-val a C1, C2, C3 még 3 védekezés-szavazatot hoz: 6 : 4 → védekezés. A „$3 : 1$” változat elfelejti az Ön cikkeit. A „$4 : 4$” a lapot egyetlen szavazatnak veszi a három cikke helyett. A „$3 : 3$” csak az NY három cikkét számolja az Ön-nél, a C12-t kihagyja. A tanulság ugyanaz, mint a <a class="xref" href="#s126-b-uj">13. cikknél</a>: az új cikk tanítás nélkül, a szomszédain át kap jóslatot – és a lap „szokása” átbillentheti. Lásd a <a class="xref" href="#s126-b-uj">12.6 kiinduló példáját</a>.`
        },
        {
          type: "set",
          q: R`Melyik modell induktív (új csúcsra újratanítás nélkül is ad vektort)?`,
          items: ["node2vec", "spektrális beágyazás", "TransE", "GraphSAGE", "R-GCN", "HGT", "TGN"],
          answer: ["GraphSAGE", "R-GCN", "HGT", "TGN"],
          hint: R`Keresőtáblát tanul a modell (minden csúcsnak saját vektort), vagy függvényt, amely a jellemzőkből és a szomszédokból számol?`,
          explain: R`Induktív: GraphSAGE, R-GCN, HGT, TGN – a csúcs vektorát egy függvény számolja a jellemzőiből és a szomszédaiból, ugyanaz a függvény új csúcsra is működik. Transzduktív: node2vec, a spektrális beágyazás és a TransE – minden csúcsnak (entitásnak) saját, tanult vektora van; egy új szereplőnek nincs sora a táblában. A hírgráf folyamatosan nő, ezért ott induktív modell kell. Lásd a <a class="xref" href="#s126-b">12.6 2. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik eljárás okoz időbeli szivárgást egy szerda esti vágású jóslásban? (Több jó válasz is lehet.)",
          options: [
            R`A cikkek szövegét a teljes hét korpuszán illesztett TF-IDF-fel alakítod vektorrá.`,
            R`Az előtanított nyelvi modellt nem tanítod tovább, ezért a tanítási dátuma nem számít.`,
            R`A „Klímaváltozás” szereplővektorát a hét összes cikkéből számolod.`,
            R`Egy 2026-ban tanított nyelvi modellel kódolod egy 2022-es hírkorpusz cikkeit.`,
            R`A cikk keretét az annotátor a szöveg alapján adta, és ugyanez a szöveg a jellemző – ez mindig szivárgás, ezért a szöveget nem szabad használni.`
          ],
          answer: [0, 2, 3],
          hint: R`Kérdezd meg minden lépésnél: használ-e olyan adatot, amely a vágás pillanatában még nem volt meg?`,
          explain: R`Szivárog az első: az IDF-súlyok a csütörtöktől gyakori szavakat is „ismerik”. Szivárog a harmadik: a Kl vektorában ott a csütörtöki cikk. Szivárog a negyedik: a nyelvi modell a 2022 utáni hírekből is tanult. Hamis a második: épp a tanítási dátum a gond, továbbtanítás nélkül is – a nyelvi modell dátuma is a felosztás része. Hamis az ötödik: a szöveg használata rendben van, csak akkor a gráf hatását a szöveg <b>felett</b> kell mérni („csak szöveg” alapvonal). Lásd a <a class="xref" href="#s126-c">12.6 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A keret-jóslásban 12 címke van. Egy 2 rétegű R-GCN-nek $4608$ súlya lenne, a metaútvonal-szavazásnak 3 (a három $\beta$). Hány súly jut az R-GCN-ben egy címkére?`,
          options: [R`$384$`, R`$192$`, R`$1536$`, R`$4608$`],
          answer: 0,
          hint: R`A 4608 a két réteg együtt. Mit osztasz mivel?`,
          explain: R`$4608 / 12 = 384$ súly címkénként – egy ilyen modell bármilyen 12 címkét megtanulna, akár véletlent is. A $192 = 2304/12$ csak egy réteget számol. Az $1536 = 4608/3$ a szavazás paramétereivel oszt, nem a címkékkel. A szavazás 3 paramétere keveset tud, de keveset is ront el – ha mindkettő 11/12-t ér el, a szavazásban bízhatsz jobban. Lásd a <a class="xref" href="#s126-d">12.6 4. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy TGN AUC-ja könnyű negatívákkal 0,95, az EdgeBanké 0,93; történeti negatívákkal 0,71, illetve 0,45. A szórás 5 véletlen magon 0,01. Mit mondasz?`,
          options: [
            R`A könnyű negatívás különbség kicsi, de a történeti negatívákkal a TGN jóval az EdgeBank fölött van: többet tud az ismétlésnél.`,
            R`A TGN alig jobb az EdgeBanknél (0,95 vs. 0,93), tehát semmit nem tanult az ismétlésen túl.`,
            R`A történeti negatívás 0,71 rosszabb a 0,95-nél, tehát a modell a nehezebb mérésen elromlott.`,
            R`Az EdgeBank történeti negatívákkal a véletlen alatt van, tehát ez a mérés hibás, a könnyű negatívás eredmény a mérvadó.`
          ],
          answer: 0,
          hint: R`Melyik negatívfajta választja el az ismétlést a valódi időbeli tudástól? És nagyobb-e a különbség a szórásnál?`,
          explain: R`Könnyű negatívákkal az ismétlés is közel tökéletes, ezért a 0,02-es különbség keveset mond. A történeti negatívák – korábban látott, most elő nem forduló párok – ellen az EdgeBank tehetetlen (0,45), a TGN 0,71-et ér el: valamit tud arról, melyik régi pár ismétlődik <b>most</b>, és a 0,26-os különbség jóval nagyobb a 0,01-es szórásnál. A második opció csak a könnyű mérést nézi. A harmadik két különböző nehézségű mérést hasonlít össze egymással – a mérce az alapvonal, nem a másik negatívfajta. A negyedik fordítva érti: épp a könnyű negatívás eredmény félrevezető egyedül. Lásd a <a class="xref" href="#s126-d">12.6 4. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A C–E–C metaútvonal (ugyanarról az eseményről szóló cikkek) élhomofíliája a keretre nézve 29%, a véletlen szint 19/66 ≈ 29%. Melyik állítás igaz?`,
          options: [
            R`A C–E–C a keretre nézve nem homofil, a megjelenési napra nézve viszont erősen az – a homofília a gráf és a címke közös tulajdonsága.`,
            R`A C–E–C gráf heterofil, ezért bármilyen címkét rosszul jósol.`,
            R`Heterofil szomszédságon a GNN reménytelen, ezért a C–E–C-t minden feladatból ki kell hagyni.`,
            R`Negatív súllyal ez a 7 pár biztosan megtanítja a modellnek, hogy „az eseménytárs kerete nem az enyém”.`
          ],
          answer: 0,
          hint: R`Mitől függ az élhomofília értéke: csak az élektől, vagy attól is, melyik címkét nézzük?`,
          explain: R`A homofília a gráf <b>és a címke</b> együttes tulajdonsága: egy eseményről a lapok többnyire ugyanazon a napon, de más-más keretben írnak. A második opció a heterofíliát a gráf tulajdonságának hiszi. A harmadik a „heterofil gráfon a GNN reménytelen” tévhit: rendes heterofil adatokon a jól beállított standard GNN-ek gyakran jók (Platonov és társai, 2023), és a C–E–C más címkére hasznos lehet. A negyedik túloz: elvben a negatív súly használná az információt, de 7 párból ezt nem lehet megbízhatóan megtanulni. Lásd a <a class="xref" href="#s126-a">12.6 1. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a mindenképp futtatandó alapvonallal!",
          pairs: [
            ["bármely osztályozás – a padló", "többségi osztály vagy véletlen"],
            ["a cikkeknek szövegük van", "gráf nélküli modell csak a szövegen"],
            ["kis gráf, kevés címke", "szavazás vagy közös szomszédok"],
            ["heterogén GNN-t teszel közzé", "homogén GAT típusjelzővel"],
            ["időbeli kapcsolat-előrejelzés", "EdgeBank és népszerűség"],
            ["tudásgráf-kiegészítés", "jól hangolt DistMult vagy TransE"]
          ],
          hint: R`Minden alapvonal azt kérdezi: mennyit ad hozzá az, ami a bonyolult modellben új?`,
          explain: R`A többségi osztály a padló (az Árvízhéten 5/12). A „csak szöveg” megmutatja, mennyit ad a gráf a tartalom fölött. A szavazás vagy a közös szomszédok a tanítás nélküli szomszédsági heurisztikák. A homogén GAT típusjelzővel a heterogén architektúra hasznát méri (Lv és társai, 2021). Időbeli adaton az EdgeBank az ismétlést, a népszerűség az aktivitást fogja meg; tudásgráfon a régi modellek gondos tanítással is versenyképesek. A szabály: a bonyolult modell akkor ér valamit, ha mindegyiket ugyanazon a felosztáson, ugyanakkora hangolással, a szórásnál nagyobb különbséggel veri. Lásd a <a class="xref" href="#s126-d">12.6 4. lépését</a>.`
        }
      ]
    },

    /* ------------------------------------------------ 12.7 */
    "gh12-127": {
      title: "Kvíz – 12.7 Alkalmazás: az Árvízhét heterogén, időbeli gráfja",
      questions: [
        {
          type: "set",
          q: R`„Csak lap” szavazás (C–L–C, önmagát kihagyva). Lapok és keretek: RH: C1, C2, C3 védekezés; EK: C4, C5, C6 hiány; NY: C7, C8, C9 veszteség; VN: C10 védekezés, C11, C12 veszteség. Melyik cikkeknél <b>nem</b> biztos találat a jóslat?`,
          items: ["C1", "C4", "C5", "C7", "C9", "C10", "C11", "C12"],
          answer: ["C10", "C11", "C12"],
          hint: R`Egy cikkre csak a lap <b>másik</b> két cikke szavaz. Hol nem egyforma a lap három cikkének kerete?`,
          explain: R`Az RH, az EK és az NY minden cikke egy keretben íródott: a két laptárs mindig a helyes keretre szavaz (9 biztos találat). A VN vegyes: a C10-re a C11 és a C12 szavaz (mindkettő veszteség) – biztos, de rossz jóslat. A C11-re a C10 (védekezés) és a C12 (veszteség) szavaz: 1 : 1 döntetlen, fél találat; a C12 ugyanígy. Várható találat: $9 + 2 \cdot \tfrac12 = 10$. Aki a cikket önmagára is szavaztatja, a C11-et és a C12-t „megmenti” – ez szivárgás, a saját címke nem lehet a bemenet. Lásd a <a class="xref" href="#s127-a">12.7 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`„Csak szereplő” szavazás (C–Sz–C, a közös szereplők számával súlyozva). A C4 (hiány) a Vízügyet és a Szakértőt említi. Vi-t a C1, C2, C10 (védekezés), Sz-t a C5, C6 (hiány) is említi. Mi a C4 jóslata?`,
          options: [R`védekezés, $3 : 2$ – rossz jóslat`, R`hiány, $4 : 3$ – jó jóslat`, R`döntetlen, $2 : 2$ – fél találat`, R`hiány, $2 : 0$ – jó jóslat`],
          answer: 0,
          hint: R`A C4-et kihagyod, a többi cikk egy-egy szavazatot ad minden közös szereplőért. Melyik keret kap többet?`,
          explain: R`Vi-n át a C1, C2, C10 (3 védekezés), Sz-en át a C5, C6 (2 hiány): $3 : 2$, a védekezés nyer – rossz. A „hiány, $4 : 3$” a C4-et önmagára is szavaztatja (két közös szereplő önmagával: $+2$ hiány) – ez szivárgás, a saját címke nem lehet bemenet. A „hiány, $2 : 0$” csak a Szakértőt nézi, a Vízügy cikkeit kihagyja. A „$2 : 2$” a C10-et kihagyja, mert más lapban jelent meg – pedig a C–Sz–C-n a lap nem számít. A C4 a „csak szereplő” szavazás egyetlen hibája; a C5 döntetlen ($3 : 3$), így a várható találat $10{,}5$. A lap viszont a C4-et jól adja – ezért egészíti ki egymást a két út. Lásd a <a class="xref" href="#s127-a-eredmeny">12.7 eredménytábláját</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A „lap + szereplő” szavazás ($\beta = (1;\ 1;\ 0)$) a 12 cikkből 11-et eltalál. Melyik marad hibás, és mi segítene rajta?`,
          options: [
            R`A C10: a lapja veszteség-keretű, a szereplői vegyesek – a címe (szövegjellemző) segítene.`,
            R`A C4: a szereplői a védekezés felé húzzák – az esemény-metaútvonal hozzáadása segítene.`,
            R`A C5: döntetlen marad – a $\beta_{\text{CSzC}}$ növelése segítene.`,
            R`A C11: a lapja vegyes – egy harmadik lap hozzáadása segítene.`
          ],
          answer: 0,
          hint: R`Melyik cikket hibázza el a „csak lap”, és melyiket a „csak szereplő”? Melyik közös hiba?`,
          explain: R`A „csak lap” a C10-et rosszul, a C11-et és a C12-t döntetlennel adja; a „csak szereplő” a C4-et rosszul, a C5-öt döntetlennel. Együtt a C4-et, a C5-öt, a C11-et és a C12-t a másik út rendbe teszi – csak a C10 marad: a lapja (VN) veszteség-keretű, a szereplői (Po, Vi) vegyesek. A címe („bejárta a töltést”) viszont egyértelműen védekezés, ezért a szövegjellemző segítene. Az esemény-metaútvonal nem segít a C4-en: egyforma súllyal hozzáadva a C4 döntetlen lesz, és az összes $11$-ről $10{,}5$-re romlik. Lásd a <a class="xref" href="#s127-a-eredmeny">12.7 eredménytábláját</a> és a <a class="xref" href="#s126-c">12.6 3. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a keret-jóslás eredményeire? (Több jó válasz is lehet.)",
          options: [
            R`A „lap + szereplő = 11/12” optimista becslés, mert a $\beta$-kat ugyanazon a 12 cikken választottuk, amelyen mérünk.`,
            R`Az esemény-metaútvonalat egyforma súllyal hozzáadni javít, mert több információ mindig segít.`,
            R`A C–L–C részben azért erős, mert minden lap többnyire egy keretben írt: a modell itt a lapot ismeri fel, nem a keretet.`,
            R`A 11/12 becsületes becslés, mert a szavazás leave-one-out, tehát semmit nem tanultunk a mérési adaton.`,
            R`Az esemény-metaútvonal egyedül a többségi alapvonalnál (5/12) is rosszabb.`
          ],
          answer: [0, 2, 4],
          hint: R`A leave-one-out a cikk saját címkéjét hagyja ki – de ki választotta a $\beta$-t, és milyen adaton?`,
          explain: R`Igaz az első: a súlyválasztás is tanítás; becsületesen beágyazott keresztvalidáció kellene. Igaz a harmadik: egy új lapnál vagy egy keretet váltó lapnál ez a jel eltűnik. Igaz az ötödik: a C–E–C heterofil (29%, a véletlen szinten), egyedül 3/12. Hamis a második: egyforma súllyal a 11 helyett 10,5 – a heterofil út árt, ezért kell a kis $\beta$. Hamis a negyedik: a leave-one-out a szavazást teszi becsületessé, a kipróbált $\beta$-k közüli választást nem. Lásd a <a class="xref" href="#s127-a">12.7 1. lépését</a>.`
        },
        {
          type: "match",
          q: "Szerda esti vágás. Párosítsd a teszteseményt azzal a módszerrel, amely megtalálja!",
          pairs: [
            ["Cs: Po–La", "EdgeBank (ismétlés)"],
            ["Cs: Ko–Sz", "Jaccard (első hely az új párok közül)"],
            ["Cs: Po–Ön", "Adamic–Adar (első hely az új párok közül)"],
            ["Cs: Ko–Kl", "egyik sem – új esemény hozta"]
          ],
          hint: R`Volt-e már a pár szerdáig? Ha nem: van-e közös szomszédjuk szerda este, és ki az? Ha a pár egyik tagja még sosem szerepelt…`,
          explain: R`A Po–La szerdán már előfordult: ismétlés, az EdgeBank 1-et ad neki. A Ko–Sz közös szomszédja a Vi – a Jaccard szerint ez az első új pár. A Po–Ön közös szomszédja a La, akinek kevés kapcsolata van – nagy Adamic–Adar-pontszám. A Ko–Kl az E5 új eseményből jött: a Kl-nek szerda estig nincs éle, memóriája, szomszédja – semmilyen gráfmodell nem tudhatja. A heurisztikák eredménye a <a class="xref" href="../11-csucsbeagyazasok/#s116-a">11.6</a>-ból jön; lásd a <a class="xref" href="#s127-b-ido">12.7 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A memória-szorzat ($s_u \cdot s_v$, $\lambda = 0{,}5$) AUC-ja a csütörtök–vasárnapi teszten könnyű negatívákkal kb. 0,42 – a véletlennél rosszabb. Mi a fő oka?`,
          options: [
            R`A szerdán aktív szereplők (Po, Vi) párjai sokszor nem jönnek elő, a csütörtöki új esemény pedig egy szerdán „hideg” szereplőt (Kl) hoz.`,
            R`A memória a jövővel frissül, és ez összezavarja a rangsort.`,
            R`A $\lambda = 0{,}5$ túl nagy: a modell túl sokáig emlékszik.`,
            R`A könnyű negatívák túl nehezek, ezért minden módszer a véletlen alatt marad.`
          ],
          answer: 0,
          hint: R`Kik kapnak nagy pontszámot egy aktivitás-alapú módszerben, és kik szerepelnek valójában a tesztben?`,
          explain: R`A memória-szorzat a „forró” szereplőket teszi előre. A szerdai csúcs (Po, Vi) azonban a hét végén kevés új párt ad, a Kl-es párok (Ko–Kl, Sz–Kl) pedig 0 pontot kapnak, mert $s_{\mathrm{Kl}} = 0$ szerda este. A második opció nem igaz: a memória itt csak a múltból frissül. A harmadik: $\lambda$-tól függetlenül a Kl memóriája 0 marad. A negyedik fordítva érti: a könnyű negatívák épp könnyűek – az EdgeBank 0,8-at kap ellenük. A tanulság: a népszerűségi alapvonal is kötelező, de itt nem ő a nyerő; az EdgeBank és a heurisztikák mást-mást tudnak. Lásd a <a class="xref" href="#s127-b-ido">12.7 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A <a class="xref" href="#s121-kerdes">fejezet kérdése</a>: melyik éltípust kell figyelmen kívül hagyni (vagy kis súlyt adni neki), hogy a keret-jóslás jobb legyen?`,
          options: [
            R`a cikk–esemény éleket – az eseményen át a szomszéd többnyire más keretű`,
            R`a lap–cikk éleket – a lap „szokása” nem tartalom`,
            R`a cikk–szereplő éleket – a szereplők vegyes keretű cikkekben szerepelnek`,
            R`egyiket sem – a HAN magától megtalálja a jó metaútvonalakat`
          ],
          answer: 0,
          hint: R`Nézd meg a metaútvonalak élhomofíliáját: melyik van a véletlen szinten?`,
          explain: R`A C–E–C élhomofíliája 29%, a véletlen szinten: egy eseményről a lapok más-más keretben írnak. Egyedül 3/12-t ad (a többség 5/12), egyforma súllyal a legjobb 11-et 10,5-re rontja. A lap tényleg „szokás”, nem tartalom – de ezen az adaton a legerősebb jel (83%), elhagyni rontana. A szereplők útja (56%) a lappal együtt adja a 11-et. A HAN csak a megadott metaútvonalak között választ, és a $\beta$-t tanulná kicsire az eseményre – a metaútvonalakat neked kell megadnod. Lásd a <a class="xref" href="#s127-c-valasz">12.7 válaszát</a>.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh12-final": {
      title: "Fejezetzáró teszt – 12. Gráf neurális hálók heterogén, időbeli és tudásgráfokon",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az öt barát gráfján (A–B, A–C, B–C, B–D, D–E) csak Emese értéke 1: $\mathbf x = (0;\ 0;\ 0;\ 0;\ 1)$. Mennyi Dávid értéke egy GCN-lépés után ($P\mathbf x$, $P = \hat D^{-1/2}\hat A\hat D^{-1/2}$, $W = 1$, aktiváció nélkül)?`,
          options: [R`$1/\sqrt6 \approx 0{,}408$`, R`$1/\sqrt2 \approx 0{,}707$`, R`$0{,}5$`, R`$1/3 \approx 0{,}333$`],
          answer: 0,
          hint: R`Az E–D él súlya $1/\sqrt{\hat d_D \hat d_E}$, ahol $\hat d_v = \deg(v) + 1$.`,
          explain: R`$\hat d_D = 3$, $\hat d_E = 2$: $P_{DE} = 1/\sqrt6 \approx 0{,}408$; a többi tag 0 (Dávid és Bence értéke 0). Az $1/\sqrt2$ elfelejti az önhurkot a fokszámokban ($\deg D = 2$, $\deg E = 1$). A $0{,}5$ a sima átlag-gyűjtés (Dávid két szomszédjának átlaga), nem a GCN szimmetrikus normálása. Az $1/3 = 1/\hat d_D$ csak Dávid fokszámával oszt. Lásd a <a class="xref" href="#s121-a">12.1 1. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a GCN hallgatólagos feltevését a fejezet megoldásával!",
          pairs: [
            ["egyféle él", "relációs GNN: éltípusonként külön súly"],
            ["egyféle csúcs", "heterogén GNN: metaútvonalak, típusonkénti vetítés"],
            ["statikus gráf", "időbeli gráfháló: memória, időrendi kiértékelés"],
            ["a szomszéd hasonló", "metaútvonalankénti homofília, heterofil út lesúlyozása"]
          ],
          hint: R`A fejezet szakaszai sorban egy-egy feltevést oldanak fel.`,
          explain: R`Az 1. feltevést a <a class="xref" href="#s122-a">12.2</a> R-GCN-je oldja fel (a „támogat” és a „bírál” saját $W_r$-t kap), a 2.-at a <a class="xref" href="#s123-a">12.3</a> (HAN, HGT; a tudásgráf a <a class="xref" href="#s124-a">12.4</a>-ben). A 3.-at a <a class="xref" href="#s125-a">12.5</a> (pillanatfelvétel vagy eseményfolyam, TGN-memória, EdgeBank), a 4.-et a <a class="xref" href="#s126-a">12.6</a>: a homofília metaútvonalanként más, a heterofil utat le kell súlyozni, vagy negatív súlyt kell adni neki. Lásd a <a class="xref" href="#s121-b">12.1 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: A–B támogat ($+$), B–C bírál ($-$), A–C bírál ($-$); $\mathbf x = (1;\ 0;\ 2)$ az A, B, C sorrendben, $w_0 = w_+ = 1$, $w_- = -1$, relációnkénti átlag. Mennyi B relációs értéke?`,
          options: [R`$-1$`, R`$1{,}5$`, R`$-0{,}5$`, R`$0$`],
          answer: 0,
          hint: R`B-nek egy $+$ szomszédja (A) és egy $-$ szomszédja (C) van. Relációnként külön átlag, aztán súlyozott összeg.`,
          explain: R`$h_B' = 0 + 1 \cdot 1 + (-1) \cdot 2 = -1$. Az $1{,}5 = (1 + 2)/2$ homogén átlag: a bírálatot támogatásnak veszi. A $-0{,}5 = (1 - 2)/2$ a teljes szomszédsággal normál relációnként helyett. A $0$ a ReLU-val levágott $-1$ – egyetlen skalárnál ez tényleg eltünteti a bírálat jelét. Lásd a <a class="xref" href="#s122-a">12.2 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hírgráfban 5 irányított és 1 szimmetrikus reláció van, $d = d' = 32$. Hány paramétere van egy R-GCN-rétegnek $B = 4$ alapmátrixos bázisfelbontással?`,
          options: [R`$5164$`, R`$5168$`, R`$5120$`, R`$4140$`],
          answer: 0,
          hint: R`Először számold meg a relációkat az inverzekkel – a szimmetrikusnak kell-e inverz? Aztán: alapmátrixok $+$ együtthatók $+ W_0$.`,
          explain: R`$R = 5 \cdot 2 + 1 = 11$ (a szimmetrikus reláció inverze önmaga). $B d d' + R B + d d' = 4 \cdot 1024 + 11 \cdot 4 + 1024 = 5164$. Az $5168$ a szimmetrikust is duplázza ($R = 12$). Az $5120$ elfelejti az $a_{rb}$ együtthatókat, a $4140$ a $W_0$-t. Bázisfelbontás nélkül $12 \cdot 1024 = 12\,288$ lenne. Lásd a <a class="xref" href="#s122-b">12.2 2. lépését</a> és a <a class="xref" href="#s122-c">3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Lapok és keretek: NY: C7, C8, C9 mind veszteség; VN: C10 védekezés, C11, C12 veszteség. Hány L–C–K–C–L út van NY és VN között?`,
          options: [R`$6$`, R`$5$`, R`$9$`, R`$1$`],
          answer: 0,
          hint: R`Közös keretenként szorozd össze, hány cikke van az adott keretben az egyik és a másik lapnak.`,
          explain: R`Közös keret csak a veszteség: az NY 3, a VN 2 veszteség-cikke ad $3 \cdot 2 = 6$ utat. Az $5 = 3 + 2$ összead szorzás helyett. A $9$ az NY főátlója ($3 \cdot 3$ oda-vissza út) – a főátló aktivitás, nem kapcsolat. Az $1$ a közös keretek száma, nem az utaké. Normálás nélkül a 6 nem „erősség”: részben azért nagy, mert mindkét lap sok veszteség-cikket írt. Lásd a <a class="xref" href="#s123-b">12.3 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`HAN, három metaútvonal, a szemantikai pontszámok $w = (\ln 2;\ 0;\ -\ln 2)$. Mennyi a $\beta$?`,
          options: [R`$(0{,}571;\ 0{,}286;\ 0{,}143)$`, R`$(0{,}5;\ 0;\ -0{,}5)$`, R`$(0{,}333;\ 0{,}333;\ 0{,}333)$`, R`$(0{,}693;\ 0;\ -0{,}693)$`],
          answer: 0,
          hint: R`$\beta_\Phi = e^{w_\Phi} / \sum e^{w_{\Phi'}}$, és $e^{\ln 2} = 2$.`,
          explain: R`$e^{w} = (2;\ 1;\ 0{,}5)$, összeg $3{,}5$: $\beta = (4/7;\ 2/7;\ 1/7) \approx (0{,}571;\ 0{,}286;\ 0{,}143)$. A $(0{,}5;\ 0;\ -0{,}5)$ a pontszámokat az abszolút összegükkel normálja exponenciális nélkül – negatív súly softmaxból nem jöhet. Az egyenlő harmadok azt hiszik, hogy a pontszámok összege 0, ezért nincs különbség – a softmax a különbségekre érzékeny. A $(0{,}693;\ 0;\ -0{,}693)$ maguk a pontszámok. És ne feledd: a $\beta$ súly, nem magyarázat. Lásd a <a class="xref" href="#s123-c">12.3 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`TransE: $\mathbf h = (0;\ 0)$, $\mathbf r = (1;\ 1)$, a pozitív farok $\mathbf t = (1;\ 2)$, a negatív $\mathbf t' = (3;\ 2)$, $\gamma = 1{,}5$. Mennyi a margós veszteség, $\max(0,\ \gamma + d^+ - d^-)$?`,
          options: [R`$\approx 0{,}264$`, R`$0$`, R`$\approx 2{,}736$`, R`$2{,}5$`],
          answer: 0,
          hint: R`$\mathbf h + \mathbf r = (1;\ 1)$. Számold ki a két euklideszi távolságot.`,
          explain: R`$d^+ = \lVert(1;1) - (1;2)\rVert = 1$, $d^- = \lVert(1;1) - (3;2)\rVert = \sqrt5 \approx 2{,}236$. $\mathcal L = \max(0;\ 1{,}5 + 1 - 2{,}236) \approx 0{,}264$: a margó nem teljesül, a pár tanít. A $0$ elhagyja a margót ($\max(0, d^+ - d^-)$). A $2{,}736 = \gamma + d^- - d^+$ felcseréli a pozitívat és a negatívat. A $2{,}5 = \gamma + d^+$ a negatívat elhagyja. Lásd a <a class="xref" href="#s124-b">12.4 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három tesztlekérdezés nyers rangjai: 1, 4, 6. A másodiknál 1, a harmadiknál 2 másik ismert igaz válasz áll a helyes előtt. Mennyi a szűrt MRR?`,
          options: [R`$\approx 0{,}528$`, R`$\approx 0{,}472$`, R`$0{,}375$`, R`$\approx 0{,}667$`],
          answer: 0,
          hint: R`Előbb a szűrt rangok: a nyers rangból vond le az előtte álló igaz válaszokat. Aztán a reciprokok átlaga.`,
          explain: R`Szűrt rangok: 1, 3, 4. $\text{MRR} = \tfrac13(1 + \tfrac13 + \tfrac14) \approx 0{,}528$. A $0{,}472$ a nyers rangokkal számol – a modellt a többi helyes válaszért bünteti. A $0{,}375 = 1/\tfrac{8}{3}$ az átlagos rang reciproka, nem a reciprokok átlaga. A $0{,}667$ a szűrt Hits@3 (2 a 3-ból) – egy másik mérték. Lásd a <a class="xref" href="#s124-d">12.4 4. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a tudásgráf-beágyazásokról? (Több jó válasz is lehet.)",
          options: [
            R`A DistMult a $(h, r, t)$ és a $(t, r, h)$ hármasnak mindig ugyanazt a pontszámot adja, ezért a „bírálja” relációra rossz választás.`,
            R`A TransE egy szimmetrikus relációt csak $\mathbf r = \mathbf 0$-val és a két entitás egybeesésével tud leírni.`,
            R`Ha egy hármas nincs a tudásgráfban, az hamis – ezért a negatív mintavétel mindig valódi negatívákat ad.`,
            R`Ha a RotatE ki tud fejezni egy relációmintát, kevés adatból is biztosan megtanulja.`,
            R`A nulla margós veszteség azt jelenti, hogy a modell tökéletes.`
          ],
          answer: [0, 1],
          hint: R`Gondold végig a relációminták táblázatát, a nyílt világ feltevést és a margó jelentését.`,
          explain: R`Igaz az első: $\sum_i h_i r_i t_i = \sum_i t_i r_i h_i$, a DistMult nem lát irányt. Igaz a második: $\mathbf a + \mathbf r = \mathbf b$ és $\mathbf b + \mathbf r = \mathbf a$ összeadva $2\mathbf r = \mathbf 0$. Hamis a harmadik: a tudásgráf nyílt világ, a hiány nem tagadás; a véletlen csere csak feltételezett negatívát ad. Hamis a negyedik: a „ki tudja fejezni” csak azt mondja, létezik jó beágyazás – a tanítás megtalálása más kérdés. Hamis az ötödik: a 0 veszteség csak azt jelenti, hogy a látott párokban teljesül a margó. Lásd a <a class="xref" href="#s124-c">12.4 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Csúcsmemória $\lambda = 0{,}5$-tel (nap eleji feleződés, eseményenként $+1$). A Szakértő (Sz) eseményei: H 1, K 0, Sze 0, Cs 2, P 0, Szo 1. Mennyi $s_{\mathrm{Sz}}$ szombat este?`,
          options: [R`$\approx 1{,}531$`, R`$4$`, R`$1{,}5$`, R`$\approx 0{,}766$`],
          answer: 0,
          hint: R`Haladj napról napra; a hétfői esemény sem tűnik el teljesen, csak halványul.`,
          explain: R`H 1; K $0{,}5$; Sze $0{,}25$; Cs $0{,}125 + 2 = 2{,}125$; P $1{,}0625$; Szo $0{,}531 + 1 \approx 1{,}531$. A $4$ a $\lambda = 1$ eset (összes esemény). Az $1{,}5$ a hétfői eseményt elhagyja (mintha szerdáig nullázódott volna – ez a Kl memóriája). A $0{,}766$ fordított sorrendben számol (előbb hozzáad, aztán feleződik). A memória a friss aktivitást méri – és csak a múltból frissülhet. Lásd a <a class="xref" href="#s125-b">12.5 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Most kedd este vágunk: tanítás H–K (Ko–Vi, Vi–Sz, La–Ön, Vi–Po), teszt a szerda–vasárnapi 14 esemény; az EdgeBank memóriája minden nap végén bővül. Hány teszteseményt „talál el”, és mennyi az AUC-ja könnyű negatívákkal?`,
          options: [
            R`8 / 14, AUC $\approx 0{,}786$`,
            R`4 / 14, AUC $\approx 0{,}643$`,
            R`6 / 14, AUC $\approx 0{,}714$`,
            R`8 / 14, AUC $\approx 0{,}571$`
          ],
          answer: 0,
          hint: R`Menj végig napról napra: Sze (Ko–Vi, Ko–Po, Vi–Po, Po–La), Cs (Ko–Sz, Ko–Kl, Sz–Kl, Po–La, Po–Ön, La–Ön), P (Ko–Po), Szo (Sz–Kl, Po–Ön), V (La–Ön). A nap végén a memória bővül.`,
          explain: R`Sze: Ko–Vi, Vi–Po (2). Cs: Po–La (szerdán volt), La–Ön (2). P: Ko–Po (1). Szo: Sz–Kl, Po–Ön (2). V: La–Ön (1). Összesen 8 a 14-ből, az ismétlés aránya $4/7$. AUC könnyű negatívákkal: $\tfrac{8}{14} + \tfrac{6}{14}\cdot\tfrac12 = \tfrac{11}{14} \approx 0{,}786$. A „4 / 14” nem bővíti a memóriát a tesztidőszakban (csak a kétnapos tanítóadat párjait ismeri), az AUC-ja $\approx 0{,}643$. A „6 / 14” a szerda esti vágás 6 találatát hozza át – más vágás, más teszt. A „0,571” a holtversenyt 0-nak számolja. Lásd a <a class="xref" href="#s125-c-edgebank">12.5 EdgeBank-példáját</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az új csúcsokról és a homofíliáról? (Több jó válasz is lehet.)",
          options: [
            R`Az EdgeBank egy új szereplőt érintő párnak 0 pontot ad – ezért kell induktív negatívákkal is mérni.`,
            R`A TransE egy csütörtökön megjelenő új szereplőnek a szomszédaiból számol vektort.`,
            R`A 13. cikk {Ko, Kl} jóslata lap nélkül döntetlen, az Esti Krónikával felkészülési hiány – a lap „szokása” dönt, nem a tartalom.`,
            R`Ha egy metaútvonal heterofil, a GNN-t reménytelen rajta használni.`,
            R`A homofília csak a gráf tulajdonsága, a címkétől független.`
          ],
          answer: [0, 2],
          hint: R`Ki tud vektort adni egy új csúcsnak: a keresőtábla vagy a függvény? És mitől függ az élhomofília?`,
          explain: R`Igaz az első: az EdgeBank csak látott párokat ismer; az induktív negatívák ellen elveszti az előnyét. Igaz a harmadik: védekezés 3, hiány 3, aztán az EK három hiány-cikkével 6 : 3 – a Reggeli Hírlappal védekezés lenne. Hamis a második: a TransE transzduktív, az új entitásnak nincs vektora; a GNN számol a szomszédokból. Hamis a negyedik: jól beállított GNN heterofil adaton is működhet, és a heterofil út le is súlyozható. Hamis az ötödik: a homofília a gráf és a címke együttes tulajdonsága (a C–E–C a keretre nem, a napra igen homofil). Lásd a <a class="xref" href="#s126-a">12.6 1. lépését</a> és a <a class="xref" href="#s126-b">2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Időbélyeges hírgráfod van, percre pontos eseményekkel; a tesztben új szereplők is megjelennek. Melyik terv illik a fejezet <a class="xref" href="#s-sum">döntési táblázatához</a>?`,
          options: [
            R`Folytonos idejű, induktív modell (TGN) szövegjellemzőkkel; időrendi felosztás, EdgeBank- és népszerűségi alapvonal, történeti és induktív negatívák.`,
            R`TransE a szereplőkön véletlen élfelosztással; a szűrt MRR-t közlöd.`,
            R`Napi pillanatfelvételek és GCN; a 18 eseményt véletlenül osztod, és könnyű negatívákkal méred az AUC-t.`,
            R`HGT alapvonal nélkül, mert sok a csúcstípus; a figyelmi súlyokból írod meg, mi okozza az új kapcsolatokat.`
          ],
          answer: 0,
          hint: R`Három szempont: pontos időbélyeg, új csúcsok, becsületes kiértékelés. Melyik terv teljesíti mindhármat?`,
          explain: R`Pontos időbélyegekhez a folytonos idejű modell illik, új szereplőkhöz induktív modell kell szövegjellemzőkkel, és a kiértékelés időrendi felosztással, EdgeBank- és népszerűségi alapvonallal, történeti és induktív negatívákkal becsületes. A TransE transzduktív, és a véletlen felosztás szivárog. A napi pillanatfelvétel elmossa a percre pontos sorrendet, a véletlen felosztás és a csak könnyű negatívák pedig kétszer is félrevezetnek. A HGT alapvonal nélkül nem mond semmit, a figyelmi súly pedig nem magyarázat. Lásd a <a class="xref" href="#s127-c">12.7 ellenőrző listáját</a>.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
