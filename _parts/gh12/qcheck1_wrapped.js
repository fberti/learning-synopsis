(function(){const R=String.raw; const Q={
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
          q: R`Az öt barát gráfján most $\mathbf x = (0;\ 0;\ 0;\ 1;\ 0)$ (csak Dávid). Átlagoló lépés: $h' = x + \operatorname{átlag}$. Mennyi Bence és Emese értéke?`,
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
}; })();
