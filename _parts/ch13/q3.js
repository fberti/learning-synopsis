    /* ------------------------------------------------ 13.11 */
    "ai13-1311": {
      title: "Kvíz – 13.11 Alkalmazás: hivatkozások és molekulák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A Cora-kísérlet melyik két sorának összevetése mutatja meg, mennyit ad a hivatkozási gráf a cikkek szövegéhez képest?",
          options: [
            "MLP a szózsákon (58,6%) vs. GCN (82,2%)",
            "mindig a leggyakoribb téma (31,9%) vs. MLP a szózsákon (58,6%)",
            "címketerjesztés (69,9%) vs. GCN (82,2%)",
            "GCN (82,2%) vs. GAT (82,6%)"
          ],
          answer: 0,
          hint: "Olyan párt keress, amelyben a két modell ugyanazt a szöveget kapja, és csak az egyik látja a gráfot.",
          explain: "Az MLP és a GCN ugyanazt az 1433 szavas szózsákot kapja, csak a GCN látja a hivatkozásokat is: a 23,6 százalékpontos különbség a gráf hozzájárulása. A leggyakoribb téma vs. MLP azt méri, mennyit ad a szöveg a semmihez képest. A címketerjesztés vs. GCN fordítva: mennyit ad a szöveg a gráfhoz. A GCN vs. GAT két gráfos modell, ott csak a gyűjtés módja más."
        },
        {
          type: "single", shuffle: true,
          q: "A Cora-n fokszám szerint bontva: 1 hivatkozású cikkeken a GCN 76,4%, 2–3 hivatkozásúakon 81,7%, legalább 4 hivatkozásúakon 88,6%; az MLP mindhárom csoportban 57–61%. Mi a legjobb magyarázat?",
          options: [
            "Több szomszéd több bizonyítékot ad a cikk témájáról – a GCN előnye a fokszámmal nő.",
            "A sok hivatkozású cikkek szövege informatívabb, ezért minden modell jobb rajtuk.",
            "A sok szomszédú cikkeken a GCN túlsimít, ezért ott a legkisebb az előnye.",
            "Az 1 hivatkozású cikkeken a gráf már árt: ott az MLP jobb a GCN-nél."
          ],
          answer: 0,
          hint: "Nézd meg, változik-e az MLP pontossága a csoportok között. Ha nem, mi okozza a GCN javulását?",
          explain: "Az MLP csak a szöveget látja, és mindhárom csoportban kb. ugyanannyit ér el – tehát a sok hivatkozású cikkek szövege nem könnyebb. A GCN-é viszont 76,4%-ról 88,6%-ra nő: minél több szomszédtól gyűjt, annál biztosabb a témában (a homofília 81,0%). Túlsimítás két rétegnél még nincs. Az 1 hivatkozásúakon is jobb a GCN az MLP-nél (76,4% vs. kb. 61%), csak ott a legkisebb az előnye."
        },
        {
          type: "single", shuffle: true,
          q: "A szöveget egyáltalán nem használó, paraméter nélküli címketerjesztés a Cora-n 69,9%-ot ér el, az MLP a szózsákon csak 58,6%-ot. Mit mutat ez?",
          options: [
            "A Cora-n a gráfszerkezet önmagában sokat elárul a témáról: a hivatkozások nagy része azonos témájú cikkek között fut.",
            "A szózsák felesleges: a gráf egyedül is annyit tud, mint a GCN.",
            "A címketerjesztés azért jobb, mert több paramétere van, mint az MLP-nek.",
            "A Cora heterofil gráf, ezért a szöveg félrevezeti az MLP-t."
          ],
          answer: 0,
          hint: "Mire épít a címketerjesztés? Gondolj a 13.7 homofília-mérésére.",
          explain: "A címketerjesztés a szomszédok címkéit veszi át – ez akkor működik, ha a hasonlók összekapcsolódnak. A Cora-n a hivatkozások 81,0%-a azonos témájú cikkek között fut (erősen homofil). A szöveg nem felesleges: a GCN a kettővel együtt 82,2%-ot ér el. A címketerjesztésnek 0 paramétere van – nem a méret dönt."
        },
        {
          type: "single", shuffle: true,
          q: "Tízszeres keresztvalidáció 188 molekulán. Körülbelül hány százalékpontot változtat egyetlen molekula (jó vagy rossz válasz) egy hajtás pontosságán?",
          options: ["kb. 5,3–5,6", "kb. 0,53", "10", "kb. 18,8"],
          answer: 0,
          hint: "Hány molekula van egy hajtásban? Egy molekula ennek hányad része?",
          explain: R`Egy hajtásban $188 / 10 = 18{,}8$, vagyis 18 vagy 19 molekula van: egy molekula $1/19 \approx 5{,}3\%$ vagy $1/18 \approx 5{,}6\%$. A 0,53 az egész adatkészletre számolt arány ($1/188$), a 10 egy egész hajtás súlya, a 18,8 a hajtás mérete, nem százalék. Ezért nagy a ±7–10 pontos szórás.`
        },
        {
          type: "single", shuffle: true,
          q: "A tesztmolekulák atomjait átszámozva az MLP pontossága 83,7%-ról 69,5%-ra esett, a GIN kimenete viszont legfeljebb 4 · 10⁻⁶-nal változott. Miért változott egyáltalán a GIN kimenete?",
          options: [
            "Lebegőpontos kerekítés: az összegek más sorrendben adódnak össze, de matematikailag a kimenet ugyanaz.",
            "A GIN csak közelítőleg invariáns; nagyobb molekulákon az eltérés több százalékpont is lehetne.",
            "Az összeg-kiolvasás a csúcsok sorszámától függ, csak itt szerencsére kicsit.",
            "A GIN tanítás közben véletlenül mintavételezi a szomszédokat, ezért minden futás kicsit más."
          ],
          answer: 0,
          hint: "Az összeg matematikailag sorrendfüggetlen. Igaz ez a számítógép véges pontosságú számaira is?",
          explain: "A GIN rétegei ekvivariánsak, a kiolvasása invariáns – matematikailag a kimenet egyáltalán nem változik. A számítógép viszont véges pontossággal ad össze, és a más sorrendben összeadott számok az utolsó jegyekben eltérhetnek: ez a 4 · 10⁻⁶. A GIN nem mintavételez (az a GraphSAGE), és az összeg nem sorszámfüggő. Az MLP 14 százalékpontos esése ezzel szemben valódi: ő a számozási konvenciót tanulta meg."
        },
        {
          type: "match",
          q: "Párosítsd a MUTAG-kísérlet modelljeit azzal, amit a molekulából látnak!",
          pairs: [
            ["atomzsák + logisztikus regresszió", "melyik atomból hány van"],
            ["WL-színek (1 kör) + logisztikus regresszió", "az atomok és közvetlen szomszédságuk"],
            ["MLP a szomszédsági mátrixon", "a mátrix, rögzített számozással"],
            ["GIN + összeg-kiolvasás", "a szerkezet, darabszámokkal"],
            ["GIN + átlag-kiolvasás", "a szerkezet, a méret nélkül"]
          ],
          hint: "Melyik modell számol szomszédságot, melyik függ a számozástól, és melyik kiolvasás méretvak?",
          explain: "Az atomzsák csak az atomtípusok darabszámát látja. Egy WL-kör minden atomot a saját típusával és a szomszédai típusainak multihalmazával színez – ezek darabszámai a jellemzők. Az MLP a mátrix helyeihez köt súlyokat, ezért a számozástól függ. A két GIN ugyanazt a szerkezetet tanulja, de az összeg-kiolvasás a darabszámokat (a méretet) is megtartja, az átlag csak az arányokat (13.6)."
        },
        {
          type: "multi",
          q: "Mely következtetések helyesek a MUTAG-eredményekből (atomzsák 86,0% ± 7,2; WL + LR 87,6% ± 7,0; GIN + összeg 81,9% ± 7,9; GIN + átlag 80,7% ± 7,5)?",
          options: [
            "Az atomzsák és a GIN közti 4,1 pontos különbség a szóráshoz képest kicsi: nem bizonyítja, hogy bármelyik jobb.",
            "A MUTAG-on az atomösszetétel önmagában sokat elárul a mutagenitásról.",
            "A WL + logisztikus regresszió ugyanazt a szerkezeti információt látja, mint a GIN, és kevés adaton kevesebb paraméterrel jól általánosít.",
            "A GIN bizonyítottan rosszabb molekulákra, mint a logisztikus regresszió.",
            "Az összeg-kiolvasás 1,2 pontos előnye bizonyítja, hogy molekulákra az összeg jobb, mint az átlag."
          ],
          answer: [0, 1, 2],
          hint: "Vesd össze a különbségeket a szórásokkal, és gondold végig, mit mond a 13.7 WL-tétele.",
          explain: "±7–10 pontos szórás mellett a 4,1 és az 1,2 pontos különbség sem bizonyít semmit – sem azt, hogy a GIN rosszabb, sem azt, hogy jobb. Az atomzsák 86%-a mutatja, hogy az összetétel sokat elárul. A WL-színek az üzenetküldés erejét képviselik (13.7), így a WL + LR a gráfos „klasszikus alapvonal”. A GNN előnye ott jön ki, ahol a szerkezet dönt és sok az adat (pl. a halicin-kísérlet 2335 molekulája)."
        },
        {
          type: "single", shuffle: true,
          q: "A Cora-n: GCN 82,2% ± 0,7, GraphSAGE 81,4% ± 0,5, GAT (8 fej) 82,6% ± 0,8 – 10 kezdéssel. Mit mondhatsz a három modellről?",
          options: [
            "A különbségek a kezdések szórásának nagyságrendjében vannak – ebből a mérésből nem lehet rangsort felállítani.",
            "A GAT a legjobb, hiszen neki a legmagasabb az átlaga.",
            "A GraphSAGE a leggyengébb, mert a mintavétel zajt visz a tanításba.",
            "A GAT kb. négyszer annyi paraméterrel csak 0,4 ponttal jobb, tehát túltanul."
          ],
          answer: 0,
          hint: "Mekkora a GCN és a GAT közti különbség a szórásokhoz képest?",
          explain: "A GAT és a GCN közti 0,4 pont kisebb, mint bármelyik szórás (0,7–0,8), a GraphSAGE 0,8 pontos lemaradása is alig nagyobb egy szórásnál. Ez egyezik az irodalommal: jól beállított GCN, GraphSAGE és GAT között a Cora-n a különbség a zaj szintjén van (13.8). A GAT valóban kb. négyszer annyi paraméterű (92 373 vs. 23 063), de a teszten nem rosszabb – túltanulásra ebből nem lehet következtetni."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai13-final": {
      title: "Fejezetzáró teszt – Gráf neurális hálók",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 4 csúcsú teljes gráfban (mindenki mindenkivel össze van kötve) mennyi $A^3$ főátlójának összege?`,
          options: ["24", "4", "12", "8"],
          answer: 0,
          hint: "Hány háromszög van a gráfban, és hányszor számol meg egy háromszöget a főátló összege?",
          explain: R`A 4 csúcsból $\binom{4}{3} = 4$ háromszög választható. A főátló összege minden háromszöget 3 kezdőcsúcsból és 2 irányban számol: $4 \cdot 6 = 24$ (csúcsonként $(A^3)_{vv} = 6$). A 4 maga a háromszögszám, a 12 elfelejti a két irányt, a 8 a három kezdőcsúcsot.`
        },
        {
          type: "multi",
          q: "Egy közösségi oldalra naponta új felhasználók érkeznek; mindegyikről tudod az életkorát, az érdeklődését és az első néhány ismerősét. Melyik módszer ad nekik vektort / jóslatot újratanítás nélkül?",
          options: [
            "GraphSAGE a valódi jellemzőkön",
            "GCN a valódi jellemzőkön (életkor, érdeklődés)",
            "kézi gráfjellemzők (fokszám, klaszterezettség) + logisztikus regresszió",
            "DeepWalk-beágyazás (véletlen séta + word2vec)",
            "GCN „kicsoda” one-hot jellemzővel, mint a karateklubon"
          ],
          answer: [0, 1, 2],
          hint: "Függvényt tanul-e a módszer (jellemzőkből vektort), vagy csúcsonként egy táblázatsort?",
          explain: "A GraphSAGE és a valódi jellemzőkön futó GCN szabályt tanul: a vektort a jellemzőkből és a szomszédokból számolja, ez új csúcsra is működik (induktív). A kézi jellemzők az új csúcsra is kiszámolhatók. A DeepWalk csúcsonként egy szabad vektort tanul – új csúcsnak nincs sora. A one-hot „kicsoda” jellemző ugyanígy transzduktív: az új tagnak nincs oszlopa (13.4)."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik molekulaszintű jellemző permutációinvariáns (nem függ az atomok számozásától)?",
          options: [
            "a csúcsvektorok összege két GCN-réteg után",
            "az 1. sorszámú atom vektora két GCN-réteg után",
            "a csúcsvektorok sorszám szerinti egymás után fűzése két GCN-réteg után",
            "minden csúcsnál a szomszédok vektorainak sorszám szerinti összefűzése, majd ezek összege a csúcsokon"
          ],
          answer: 0,
          hint: "Ekvivariáns réteg + invariáns összegzés = ? Hol lép be a sorszám a többi opcióban?",
          explain: "A GCN-rétegek ekvivariánsak, a csúcsokon vett összeg invariáns – együtt invariáns modellt adnak (13.2, 13.6). Az 1. atom attól függ, ki kapta az 1-es sorszámot; a sorszám szerinti összefűzés is sorrendfüggő. Az utolsó opcióban már a gyűjtés sorrendfüggő, így a csúcsvektorok sem ekvivariánsak – ezen a végső összeg sem segít."
        },
        {
          type: "single", shuffle: true,
          q: "Egy úthálózaton a kérdésre adott válasz egy 6 ugrásnyira lévő csúcs állapotán múlik, a modelled 3 rétegű GNN. Mi segíthet?",
          options: [
            "Több réteg vagy hosszú élek / virtuális csúcs, hogy az információ elérjen a csúcsig.",
            "Sokkal több tanítóadat – elég példából a 3 rétegű háló is megtanulja.",
            "Nagyobb rejtett dimenzió (pl. 16 helyett 256 neuron rétegenként).",
            "Átlag helyett összeg-gyűjtés, mert az összeg érzékenyebb."
          ],
          answer: 0,
          hint: "Mekkora a 3 rétegű GNN recepciós mezője? Mi van azon túl?",
          explain: "$k$ réteg = $k$ ugrás: ami 3 ugráson túl van, az a csúcs vektorában nem jelenhet meg – akárhány adat, akárhány neuron vagy akármilyen gyűjtés mellett. Segít a több réteg (túlsimítás-kockázattal), a hosszú élek vagy a durvább, hierarchikus gráf (GraphCast), illetve a virtuális csúcs, amelyen át bárki két lépésben elér bárkit (13.3, 13.7)."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy GCN-ben a $u$ csúcsnak 15, a $v$ csúcsnak 3 szomszédja van (önhurok nélkül számolva), és él köti össze őket. Mekkora súllyal kerül $\mathbf h_u$ a $v$ gyűjtésébe?`,
          options: ["0,125", "0,149", "0,250", "0,016"],
          answer: 0,
          hint: R`$1/\sqrt{\hat d_u\,\hat d_v}$, ahol $\hat d = \deg + 1$.`,
          explain: R`Önhurokkal $\hat d_u = 16$, $\hat d_v = 4$: $1/\sqrt{64} = 0{,}125$. A 0,149 az önhurkot felejti el ($1/\sqrt{45}$), a 0,250 az önhurkos átlag súlya (csak a fogadó fokszámával oszt, $1/4$), a 0,016 a gyököt hagyja le ($1/64$).`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a hozzá illő gyűjtéssel!",
          pairs: [
            ["Hány nitrocsoport kapcsolódik egy atomhoz?", "összeg"],
            ["A barátok hányad része szavaz egy pártra?", "átlag"],
            ["Van-e ismert csaló a számla partnerei között?", "maximum"],
            ["A szomszédok fontossága a tartalmuktól függ.", "figyelem (GAT)"]
          ],
          hint: "Darabszám, arány, előfordulás – és mi van, ha a súlyokat tanulni kell?",
          explain: "Darabszámhoz összeg kell (csak az különbözteti meg az {N} és az {N, N} szomszédságot). Arányhoz átlag – egy sok barátú embernél is az arány számít, nem a darabszám. Ha az a kérdés, előfordul-e valami, a maximum a legtisztább (az átlag egy csalót 100 tisztességes partner közt 0,01-re hígít). Ha a szomszédok súlya a tartalmuktól függ, figyelem tanulja meg (13.5)."
        },
        {
          type: "single", shuffle: true,
          q: "Egy gyógyszercég a modelljét új vegyületcsaládok szűrésére akarja használni. Véletlen felosztáson 92%-ot, vázfelosztáson (scaffold split) 78%-ot mértél. Melyik számot közlöd várható teljesítményként?",
          options: [
            "A 78%-ot: a vázfelosztás teszt-vázait a modell nem látta, mint a valóságban az új családokat.",
            "A 92%-ot: a véletlen felosztás az elfogadott szabvány, és több adatot használ.",
            "A kettő átlagát (85%), mert mindkettő egy-egy torzított becslés.",
            "Egyiket sem: molekuláknál csak időbeli felosztás ad korrekt becslést."
          ],
          answer: 0,
          hint: "Melyik felosztás tesztje hasonlít jobban arra, amire a modellt használni fogják?",
          explain: "Véletlen felosztásnál a tesztmolekulák „testvérei” (azonos vázzal) a tanítóban vannak – a modell a hasonlóságot ismeri fel, ez túl optimista. A vázfelosztás új vázakat tesz a tesztbe, ahogy a valóságban az új családok érkeznek – ez a becsületes becslés (13.6). Az átlagnak nincs értelme; az időbeli vágás az időben változó gráfoknál (közösségi háló, tranzakciók) kell."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik két gráfot tudja megkülönböztetni egy jellemzők nélküli üzenetküldő GNN (pl. GIN)?",
          options: [
            "a 4 csúcsú utat és a 4 csúcsú csillagot",
            "a hatszöget és a két különálló háromszöget",
            "a 8 csúcsú kört és a két különálló négyzetet",
            "a dekalint és a biciklopentilt (hidrogén nélkül, csak szénatomok)"
          ],
          answer: 0,
          hint: "Futtasd fejben az 1-WL első körét: milyen fokszámok vannak a két gráfban?",
          explain: "Az út fokszámai (1, 2, 2, 1), a csillagé (3, 1, 1, 1) – az 1-WL már az 1. körben szétválasztja őket, tehát egy GIN is. A hatszögben és a két háromszögben, illetve a 8-körben és a két négyzetben minden csúcsnak két ugyanolyan szomszédja van: a színezés nem finomodik, a hisztogram egyforma. A dekalin és a biciklopentil (11 kötés, 2 atom három, 8 atom két szomszéddal) is WL-egyforma. A tétel szerint amit az 1-WL nem lát, azt egyetlen üzenetküldő GNN sem."
        },
        {
          type: "single", shuffle: true,
          q: R`Csillaggráf: egy középpont 3 levéllel, kezdőértékek $x = (4;\ 0;\ 0;\ 0)$ (a középpont 4). Mi lesz minden csúcs értéke nagyon sok önhurkos átlagolás ($\hat D^{-1}\hat A$) után?`,
          options: ["1,6", "1,0", "2,0", "0"],
          answer: 0,
          hint: "A határérték nem a sima átlag, hanem az önhurkos fokszámmal súlyozott átlag.",
          explain: R`Az önhurkos fokszámok: középpont 4, levelek 2–2–2. A határérték $\dfrac{4 \cdot 4 + 2 \cdot 0 + 2 \cdot 0 + 2 \cdot 0}{4 + 2 + 2 + 2} = \dfrac{16}{10} = 1{,}6$ – minden csúcson (túlsimítás). Az 1,0 a sima átlag ($4/4$), a 2,0 a levelek értéke egy lépés után, a 0 azt feltételezi, hogy az átlagolás „kioltja” a jelet – de az összeg (súlyozva) megmarad.`
        },
        {
          type: "multi",
          q: "Mely állítások igazak a gráf-Transformerekre?",
          options: [
            "Pozíciókódolás nélkül az önfigyelem-réteg permutációekvivariáns, de nem tudja, ki kinek a szomszédja.",
            "A véletlen séta visszatérési valószínűségei (RWSE) a számozástól független pozíciókódolást adnak.",
            "A GPS-rétegben egy helyi üzenetküldő ág és egy globális figyelemág fut egymás mellett, az eredményük összeadódik.",
            "A csúcsok sorszáma (1, 2, …, n) jó pozíciókódolás, ugyanúgy, mint a mondatok tokenjeinél.",
            "A Laplace-sajátvektor előjele egyértelmű, ezért úgy, ahogy van, jellemzőnek adható."
          ],
          answer: [0, 1, 2],
          hint: "Melyik kódolás jön csak a szerkezetből, és melyik függ valamilyen önkényes választástól?",
          explain: "Az önfigyelem üzenetküldés a teljes gráfon: ekvivariáns, de a szerkezetet vissza kell kódolni. Az RWSE a gráfból számolt valószínűség – nem függ a számozástól. A GPS két ága (helyi MPNN + globális figyelem) összeadódik, utána FFN jön. A sorszám a számozástól függ (az MLP hibája jönne vissza), a Laplace-sajátvektor előjele pedig önkényes – ezért tanításkor véletlenszerűen átfordítják (13.8)."
        },
        {
          type: "single", shuffle: true,
          q: "Az egyes atomokra ható erőket akarod jósolni egy 3D-s molekulán. Melyik felépítés helyes?",
          options: [
            "Egy invariáns háló az energiát jósolja a távolságokból, az erő ennek negatív gradiense – ez automatikusan ekvivariáns.",
            "Egy csak távolságokat látó invariáns háló közvetlenül kiadja az erővektor három komponensét.",
            "MLP a nyers koordinátákon, véletlen forgatásokkal bővítve – ez garantálja az ekvivarianciát.",
            R`EGNN-szerű frissítés, de a különbségvektor helyett az abszolút koordinátákkal: $\mathbf x_i' = \mathbf x_i + \sum_j \mathbf x_j\,\phi(\ldots)$.`
          ],
          answer: 0,
          hint: "Az erő vektor: a molekulával együtt kell elfordulnia. Melyik konstrukció garantálja ezt?",
          explain: R`Ha $E(R\mathbf x) = E(\mathbf x)$, a láncszabály szerint $\nabla E(R\mathbf x) = R\,\nabla E(\mathbf x)$: az invariáns energia gradiense ekvivariáns erő (13.9). Egy invariáns háló kimenete forgatáskor nem változik – az erő iránya így rossz lenne. Az adatbővítés csak közelít, nem garantál. Az abszolút koordinátákkal az eltolás nem esik ki: $\sum_j (\mathbf x_j + \mathbf t)\phi$ nem egyszerűen $\mathbf t$-vel tolódik el.`
        },
        {
          type: "set",
          q: "Jelöld ki azokat a rendszereket, amelyekben tanult üzenetküldés (GNN vagy gráfon futó figyelem) fut!",
          items: [
            "GraphCast (időjárás)",
            "Chemprop (a halicin megtalálása)",
            "PinSage (ajánlás a Pinteresten)",
            "GraphRAG (visszakeresés tudásgráfból)",
            "Pangu-Weather (időjárás)",
            "LLM-prompt, amelyben a gráf éllistaként szerepel"
          ],
          answer: ["GraphCast (időjárás)", "Chemprop (a halicin megtalálása)", "PinSage (ajánlás a Pinteresten)"],
          hint: "Van-e a rendszerben tanuló háló, amely egy gráf élei mentén gyűjt? A „gráf” szó a névben nem elég.",
          explain: "A GraphCast 16 üzenetküldő réteget futtat egy gömbhálón, a Chemprop irányított élekkel dolgozó MPNN, a PinSage a GraphSAGE ipari változata. A GraphRAG-ban a gráf csak index, amelyet egy LLM épít és olvas – tanult üzenetküldés nincs benne. A Pangu-Weather 3D-s Transformer rácson, nem gráfon. Az éllistás promptban az LLM tokensorozatot lát, nem gráfot (13.10)."
        },
        {
          type: "single", shuffle: true,
          q: "Saját, 150 molekulás adatkészleten (tízszeres keresztvalidáció) a GIN 84% ± 9, az atomzsák + logisztikus regresszió 82% ± 8 pontosságot ér el. Mi a helyes következtetés?",
          options: [
            "A 2 pontos különbség jóval kisebb a szórásnál: ebből a mérésből a GIN előnye nem bizonyított.",
            "A GIN jobb, mert a pontossága magasabb.",
            "Az atomzsák jobb, mert kisebb a szórása.",
            "A GIN-t kell választani, mert az 1-WL-teszt erejéig kifejező."
          ],
          answer: 0,
          hint: "Hány molekula van egy hajtásban, és mennyit ér közülük egy?",
          explain: "Egy hajtásban 15 molekula van, egy molekula 6,7 százalékpont – a 2 pontos különbség kevesebb egyetlen molekulánál, a szórás pedig 8–9 pont. Ugyanez volt a MUTAG-on (86,0% vs. 81,9%, ±7–10): a különbség nem bizonyít semmit egyik irányban sem. A kisebb szórás sem tesz jobbá egy modellt, a kifejezőerő pedig nem jelenti, hogy kevés adatból meg is tanulja (13.7, 13.11)."
        },
        {
          type: "match",
          q: "Melyik eszköz illik a feladathoz? (A fejezet döntési táblázata alapján.)",
          pairs: [
            ["Egy fehérje 3D-szerkezetéből egy kötőzseb energiáját kell jósolni.", "távolságokra épülő invariáns 3D-s GNN"],
            ["Milliárd csúcsú, folyamatosan bővülő felhasználói gráf, mini-kötegek.", "GraphSAGE mintavétellel"],
            ["Hivatkozási háló, témánként néhány címke, homofil gráf.", "GCN, címketerjesztés-alapvonallal"],
            ["Tranzakciós háló, ahol a szomszédok jellemzően különböző típusúak.", "külön saját és szomszéd súly (GraphSAGE, GIN)"],
            ["Hány háromszög van egy 1000 csúcsú gráfban?", "klasszikus gráfalgoritmus"],
            ["A csúcsok hosszú szöveges leírások (termékek, cikkek).", "nyelvi modellel kódolt jellemzők + GNN"]
          ],
          hint: "Minden sornál kérdezd meg: milyen az adat (3D, szöveg), mekkora a gráf, homofil-e, és tanulni kell-e egyáltalán?",
          explain: "Az energia forgatásra invariáns – távolságokra épülő háló kell. Óriási, bővülő gráfhoz mintavételes, induktív GraphSAGE. Kevés címkéhez, homofil gráfhoz GCN – a címketerjesztéshez mérve. Heterofil gráfon a GCN átlaga félrevezet, a külön saját súly segít. Az algoritmikus kérdést egy program hibátlanul megoldja – se nem GNN, se nem LLM. Szöveges csúcsoknál a nyelvi modell beágyazása + GNN az egyik legolcsóbb erős recept."
        }
      ]
    },
