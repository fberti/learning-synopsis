    /* ------------------------------------------------ 13.6 */
    "ai13-136": {
      title: "Kvíz – 13.6 Csúcs, él, gráf – a kimenet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A metanol (C–O) és a glioxál (O–C–C–O) atomjainak one-hot (C; O) jellemzőiből kiolvasást számolunk, üzenetküldés nélkül. Melyik kiolvasás különbözteti meg a két molekulát?`,
          options: [
            R`Csak az összeg: $(1;\ 1)$, illetve $(2;\ 2)$.`,
            R`Csak az átlag: $(0{,}5;\ 0{,}5)$, illetve $(1;\ 1)$.`,
            R`Csak a maximum: $(1;\ 1)$, illetve $(2;\ 2)$.`,
            R`Az összeg és az átlag is, a maximum nem.`
          ],
          answer: 0,
          hint: "Számold ki mindhárom kiolvasást mindkét molekulára! Mit lát az átlag: a darabszámot vagy az arányt?",
          explain: R`Összeg: metanol $(1;\ 1)$, glioxál $(2;\ 2)$ – eltér. Átlag: mindkettő $(0{,}5;\ 0{,}5)$, mert mindkettő fele szén, fele oxigén; az $(1;\ 1)$ a glioxál összegét az atomfajták számával (2) osztja a 4 atom helyett. Maximum: mindkettő $(1;\ 1)$ – a maximum sosem lehet $(2;\ 2)$ one-hot vektorokból. Az átlag és a maximum <b>méretvak</b>, az összeg nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`A glioxálon (O–C–C–O, one-hot (C; O) jellemzők) lefuttatunk egy $\mathbf h_v' = \mathbf h_v + \sum_u \mathbf h_u$ üzenetküldő réteget, majd összeg-kiolvasást. Mi az eredmény?`,
          options: [R`$(6;\ 4)$`, R`$(2;\ 2)$`, R`$(4;\ 2)$`, R`$(1{,}5;\ 1)$`],
          answer: 0,
          hint: R`Számold ki atomonként: saját vektor + a szomszédok vektorainak összege. A szélső O-nak egy, a középső C-knek két szomszédja van.`,
          explain: R`Szélső O: $(0;1) + (1;0) = (1;\ 1)$, kétszer. Középső C: $(1;0) + (0;1) + (1;0) = (2;\ 1)$, kétszer. Összeg: $(6;\ 4)$. A $(2;\ 2)$ az üzenetküldés előtti összeg, a $(4;\ 2)$ elfelejti a saját vektort (csak a szomszédokat adja össze), az $(1{,}5;\ 1)$ az átlag, nem az összeg.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a kiolvasásra (readout)?",
          options: [
            "Invariáns: bárhogy számozzuk az atomokat, ugyanazt adja.",
            "Extenzív tulajdonsághoz (pl. a molekula energiája) az összeg illik, mert az átlag a méretet nem látja.",
            "Ha minden réteg után kiolvasunk és a vektorokat összefűzzük, az eredmény a csúcsok számozásától függ, mert az összefűzés sorrendfüggő.",
            "Már a kezdeti jellemzők összegéből is kiolvasható a molekula szerkezete.",
            "A benzolt és a „két ciklopropánt” egy ügyesebb kiolvasás szétválasztaná."
          ],
          answer: [0, 1],
          hint: "Az összefűzés minek a sorrendjében történik? És hol vész el a benzol és a két ciklopropán közti különbség?",
          explain: R`Az első kettő igaz. Az összefűzés a <b>rétegek</b> rögzített sorrendjében történik, nem a csúcsokéban – minden réteg kiolvasása invariáns, így az egész is. A kezdeti jellemzők összege csak az atomok darabszámát adja (az etanol és a dimetil-éter is $(2;\ 1)$); a szerkezetet az üzenetküldés írja bele a vektorokba. A benzol és a két ciklopropán minden atomja minden réteg után ugyanaz – ez az üzenetküldés korlátja (13.7), nem a kiolvasásé.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kapcsolat-előrejelzés: $\mathbf z_u = (1;\ 2)$, $\mathbf z_v = (0{,}5;\ -0{,}5)$, $p(u{-}v) = \sigma(\mathbf z_u \cdot \mathbf z_v)$. Mekkora a valószínűség?`,
          options: ["0,378", "0,622", "−0,5", "0,818"],
          answer: 0,
          hint: "Előbb a skaláris szorzat (vigyázz az előjelre!), aztán a szigmoid.",
          explain: R`$\mathbf z_u \cdot \mathbf z_v = 0{,}5 - 1 = -0{,}5$, $\sigma(-0{,}5) \approx 0{,}378$. A 0,622 a $\sigma(+0{,}5)$ (előjelhiba), a $-0{,}5$ a nyers pontszám – szigmoid nélkül nem valószínűség –, a 0,818 a $\sigma(1{,}5)$, ha a negatív tagot is pozitívnak veszed.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy <b>nem létező</b> párra (negatív minta) a modell pontszáma 1, azaz $p = \sigma(1) \approx 0{,}731$. Mekkora ennek a párnak a bináris keresztentrópia-vesztesége?`,
          options: ["1,313", "0,313", "0,570", "0,269"],
          answer: 0,
          hint: R`Negatív párnál a veszteség tagja $-\ln\big(1 - \sigma(s)\big)$.`,
          explain: R`$-\ln(1 - 0{,}731) = -\ln 0{,}269 \approx 1{,}313$ – erős büntetés, mert a modell élt mondott oda, ahol nincs. A 0,313 a $-\ln 0{,}731$: ennyi lenne, ha a pár pozitív volna. A 0,570 tízes alapú logaritmussal számol ($-\lg 0{,}269$), a 0,269 pedig csak $1 - p$, logaritmus nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért kellenek negatív minták a kapcsolat-előrejelzés tanításához?",
          options: [
            "Csak pozitív élekkel a legjobb „megoldás” minden vektort nagyra és egyirányúra állítani – akkor minden párra 1 jön ki.",
            "Mert a bináris keresztentrópia csak akkor értelmezhető, ha legalább annyi negatív példa van, ahány pozitív.",
            "Mert a pozitív élek túl sokan vannak, és nem férnek el a memóriában.",
            "Mert a skaláris szorzat szimmetrikus, és a negatív minták teszik irányítottá."
          ],
          answer: 0,
          hint: R`Írd fel a veszteséget csak a pozitív tagokkal: $-\sum \ln \sigma(\mathbf z_u \cdot \mathbf z_v)$. Hogyan lehet ezt 0-hoz vinni?`,
          explain: R`Csak pozitívakkal a veszteség akkor csökken, ha minden skaláris szorzat nő – a nem létező párokra is. Egyirányú, nagy vektorokkal $\sigma \to 1$ mindenhol, $\mathcal L \to 0$: a modell „mindenki mindenkivel kapcsolatban áll” – használhatatlan. A negatív tag bünteti ezt. A pozitív-negatív arány nem a veszteség értelmezhetőségén múlik; az irányított gráf problémáját pedig két külön vektor vagy aszimmetrikus pontszám oldja meg, nem a negatív minta.`
        },
        {
          type: "multi",
          q: "Melyik okoz szivárgást (a teszt válasza bekerül a tanításba)?",
          options: [
            "Kapcsolat-előrejelzésnél a teszt-élek bent maradnak az üzenetküldő gráfban.",
            "Csalásfelderítésnél a „hány csalóval van kapcsolatban a számla” jellemzőt a teljes címkehalmazból számolod.",
            "Transzduktív csúcsosztályozásnál a tesztcsúcsok jellemzői és élei részt vesznek az üzenetküldésben.",
            "Élfelosztásnál a tesztél két végpontja a tanításban is szerepel.",
            "Molekuláknál véletlen felosztás helyett vázfelosztást használsz."
          ],
          answer: [0, 1],
          hint: "Kerül-e a tanításba a teszt címkéje (vagy a tesztél maga)? A tesztcsúcs jellemzője még nem a válasza.",
          explain: R`Az első kettő szivárgás: a bent hagyott tesztél miatt a végpontok közvetlenül egymástól gyűjtenek (még a fokszámuk is 1-gyel nagyobb), a teljes címkehalmazból számolt jellemző pedig a teszt címkéit hordozza. A transzduktív beállításban a tesztcsúcsok jellemzői és élei részt vehetnek – csak a <em>címkéik</em> nem (Cora: 140 tanítócsúcs, de az üzenetküldés mind a 2708-on fut). A tesztél végpontjainak ismerete rendben van, csak azt méri, mennyire jósol új kapcsolatot ismert csúcsok között. A vázfelosztás éppen a túl könnyű véletlen felosztás ellenszere.`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a helyes felosztással!",
          pairs: [
            ["Csúcsosztályozás egyetlen gráfon (pl. Cora)", "tanító / validációs / teszt csúcsmaszk"],
            ["Kapcsolat-előrejelzés", "üzenetküldő, felügyeleti, validációs és teszt élek"],
            ["Molekulák tulajdonságának jóslása", "vázfelosztás"],
            ["Jövőbeli barátságok jóslása egy közösségi hálón", "idő szerinti vágás"]
          ],
          hint: "Mi a „minta” az egyes feladatokban: csúcs, él vagy egész gráf? És mikor számít az idő?",
          explain: R`Csúcsszinten (transzduktív) a csúcsokat maszkokkal osztjuk, az üzenetküldés mindenhol fut. Élszinten négyfelé osztjuk az éleket, és a validációs/teszt élek nincsenek az üzenetküldő gráfban. Molekuláknál a vázfelosztás a közös vázú molekulákat egy oldalra teszi (a véletlen felosztás túl könnyű). Időbeli gráfon a jövő élei sosem lehetnek a múlt tanításában.`
        }
      ]
    },

    /* ------------------------------------------------ 13.7 */
    "ai13-137": {
      title: "Kvíz – 13.7 Mennyit tud egy GNN? Kifejezőerő és korlátok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Futtasd az 1-WL színfinomítást a futó példán (élek A–B, A–C, B–C, B–D, D–E; kezdetben minden csúcs egyforma)! Mik a végső színosztályok?",
          options: [
            "{Anna, Csilla}, {Bence}, {Dávid}, {Emese}",
            "{Anna, Csilla, Dávid}, {Bence}, {Emese}",
            "{Anna}, {Bence}, {Csilla}, {Dávid}, {Emese}",
            "{Anna, Csilla}, {Bence}, {Dávid, Emese}"
          ],
          answer: 0,
          hint: "Az 1. körben a fokszám dönt. A 2. körben nézd meg, milyen színű szomszédai vannak a 2-es fokú csúcsoknak!",
          explain: R`1. kör: Bence (3 szomszéd), {Anna, Csilla, Dávid} (2), Emese (1). 2. kör: Anna és Csilla szomszédai egy „2-es” és egy „3-as”, Dávidé egy „3-as” és egy „1-es” – Dávid leválik. 3. kör: nincs új szétválás. A {Anna, Csilla, Dávid} az 1. kör után megálló színezés. Anna és Csilla sosem válik szét – helyesen, mert felcserélhetők; Dávid és Emese fokszáma már az 1. körben eltér.`
        },
        {
          type: "multi",
          q: "Mely gráfpárokat NEM tudja megkülönböztetni az 1-WL (és így egyetlen üzenetküldő GNN sem), ha a csúcsoknak nincs jellemzője?",
          options: [
            "A hatszög és a két különálló háromszög",
            "Egy 8 csúcsú kör és két különálló négyzet",
            "A dekalin és a biciklopentil (csak a szénváz)",
            "A 4 csúcsú út és a 4 csúcsú csillag",
            "A négyzet (4 csúcsú kör) és a 4 csúcsú út"
          ],
          answer: [0, 1, 2],
          hint: "Ha minden csúcs fokszáma (és a szomszédok fokszáma) ugyanaz a két gráfban, a színezés nem tud elindulni. Hol tér el már a fokszámok hisztogramja?",
          explain: R`Az első háromban a fokszám-hisztogram egyezik, és a finomítás sem választ szét semmit: a hatszögben, a két háromszögben, a 8-as körben és a két négyzetben mindenki 2-es fokú; a dekalinban és a biciklopentilben 2 atom 3-as, 8 atom 2-es fokú, 11 kötés. Pedig ezek különböző gráfok – az egyezés <b>nem bizonyít</b> semmit. Az út $(1, 2, 2, 1)$ és a csillag $(3, 1, 1, 1)$, illetve a négyzet (csupa 2) és az út már az 1. körben szétválik.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy hat csúcsú láncon a címkék váltakoznak: 0, 1, 0, 1, 0, 1. Melyik réteg tudja a két osztályt jól szétválasztani?",
          options: [
            R`Külön súly a saját és a szomszédos vektorra (GraphSAGE-szerű, pl. $w_1 = 1$, $w_2 = -1$).`,
            "Több egymás utáni GCN-réteg: a sok átlagolás végül kiszűri a zajt.",
            "Önhurkos átlagolás: így a csúcs a saját értékét is látja.",
            "Egy virtuális csúcs, amely mindenkivel össze van kötve."
          ],
          answer: 0,
          hint: "Mennyi a szomszédok átlaga egy 0-s és egy 1-es csúcsnál? Mit tesz ezzel egy közös súly, és mit két külön súly?",
          explain: R`A szomszédok átlaga mindig a <b>másik</b> osztály. A $h' = h_v - m_v$ réteg: 0-s csúcsnál $0 - 1 = -1$, 1-esnél $1 - 0 = 1$ – a különbség nőtt. Az önhurkos átlag mindent 0,5 körülire mos össze ($0{,}5;\ 0{,}333;\ 0{,}667;\ldots$), a további GCN-rétegek ezt még tovább simítják. A virtuális csúcs a túlnyomás ellen jó, a heterofíliát nem oldja meg. Heterofil gráfon a GCN közös súlya ($w_1 = w_2$) a gond; a GraphSAGE és a GIN külön kezeli a saját vektort.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 3 csúcsú úton (1–2–3) $x = (0;\ 0;\ 7)$. Ismételt önhurkos átlagolással ($\hat D^{-1}\hat A$) minden csúcs ugyanahhoz az értékhez tart. Mennyi ez?`,
          options: ["2", "2,333", "1,75", "0"],
          answer: 0,
          hint: "A határérték nem a sima átlag, hanem súlyozott átlag. Mi a súly – és számít-e az önhurok?",
          explain: R`Az önhurokkal számolt fokszámok $(2;\ 3;\ 2)$, összegük 7: $\dfrac{2 \cdot 0 + 3 \cdot 0 + 2 \cdot 7}{7} = 2$. A 2,333 a sima átlag ($7/3$), az 1,75 önhurok nélküli fokszámokkal $(1;\ 2;\ 1)$ súlyoz ($7/4$). A 0 tévhit: a túlsimítás nem nullázza ki az értékeket, hanem mindenkit egy közös értékre húz – a különbségek tűnnek el.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit mond a 13.7 📅 doboza (2026-os állapot) a mély GNN-ek gyakorlati kudarcáról?",
          options: [
            "A túlsimítás bizonyított, de legalább ekkora ok a nehéz taníthatóság; a túlsimítás megszüntetése szükséges, de nem elégséges.",
            "A túlsimítás csak a GCN-t érinti; a figyelem (GAT, Transformer) megvéd tőle.",
            "Maradékkapcsolattal a túlsimítást megszüntették, ezért ma 50–150 rétegű GNN-ek a jellemzők.",
            "A túlsimítás csak látszat, valójában kizárólag a hangolatlan hiperparaméterek okozzák."
          ],
          answer: 0,
          hint: "Két okot említ a doboz – az egyik a simítás, a másik a súlymátrixokhoz kapcsolódik. Hány réteg a jellemző ma?",
          explain: R`A túlsimítás matematikailag bizonyított – GCN-re, GAT-ra, sőt a Transformer figyelmére is (Wu és társai, 2023), tehát a figyelem nem véd. Több tanulmány szerint a sok egymásra rakott súlymátrix nehéz taníthatósága legalább ekkora ok, és Rusch–Bronstein–Mishra (2023) szerint a túlsimítás megszüntetése szükséges, de nem elégséges. A gyakorlatban ma is 2–4 réteg a jellemző; az 50–150 réteg a CNN-ek (ResNet) világa.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy fában minden csúcsnak 2 gyereke van. Hány levél információja jut el a gyökérhez 6 üzenetküldő réteg után – ugyanabba a rögzített méretű vektorba?",
          options: ["64", "12", "36", "127"],
          answer: 0,
          hint: "Rétegenként egy szinttel lejjebb látunk; minden szinten hányszorozódik a csúcsok száma?",
          explain: R`$2^6 = 64$ levél. A 12 a $2 \cdot 6$ (összeadja a szinteket szorzás helyett), a 36 a $6^2$ (kitevő és alap felcserélve), a 127 az összes csúcs a 6 ugrásnyi környezetben ($1 + 2 + \ldots + 64$), nem csak a levelek. Ez a <b>túlnyomás</b>: a recepciós mező exponenciálisan nő, a vektor mérete nem.`
        },
        {
          type: "single", shuffle: true,
          q: "A futó példán (élek A–B, A–C, B–C, B–D, D–E) Anna, Csilla és Dávid címkéje 0, Bence és Emese címkéje 1. Mennyi az élhomofília?",
          options: ["0,2", "0,8", "0,6", "0,4"],
          answer: 0,
          hint: "Az élek közül hány köt össze azonos címkéjű csúcsokat? Élekre számolj, ne csúcsokra!",
          explain: R`A–B (0–1), A–C (0–0), B–C (1–0), B–D (1–0), D–E (0–1): csak 1 azonos az 5-ből, $1/5 = 0{,}2$ – erősen heterofil. A 0,8 a különböző címkéjű élek aránya (fordítva számolva), a 0,6 és a 0,4 a 0-s, illetve 1-es címkéjű <em>csúcsok</em> aránya – az nem homofília.`
        },
        {
          type: "match",
          q: "Párosítsd a korlátot a leírásával!",
          pairs: [
            ["Túlsimítás", "sok réteg után minden csúcsvektor ugyanahhoz tart"],
            ["Túlnyomás", "sok távoli csúcs információja egy rögzített méretű vektorba préselődik"],
            ["Heterofília", "a szomszédok jellemzően más osztályba tartoznak"],
            ["WL-korlát", "két különböző gráfra minden üzenetküldő háló ugyanazt adja"]
          ],
          hint: "Melyik szól a mélységről, melyik a szűk keresztmetszetről, melyik a címkékről és melyik a megkülönböztetésről?",
          explain: R`Túlsimítás: az ismételt átlagolás exponenciálisan egy közös vektorhoz visz. Túlnyomás (Alon és Yahav, 2021): exponenciálisan nő a recepciós mező, a vektor nem – különösen „hidaknál” súlyos. Heterofília: alacsony élhomofília, ilyenkor a GCN-féle átlagolás jelet ront. WL-korlát: amit az 1-WL nem választ szét (pl. hatszög és két háromszög), azt semmilyen üzenetküldő GNN sem.`
        }
      ]
    },

    /* ------------------------------------------------ 13.8 */
    "ai13-138": {
      title: "Kvíz – 13.8 Gráf-Transformerek: a Transformer mint GNN",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Ha az önfigyelem-réteget üzenetküldésként írjuk fel, mi a csúcs szomszédsága, $N(v)$?`,
          options: [
            R`Mindenki: $N(v) = V$, önmagát is beleértve.`,
            "A sorozatban közvetlenül előtte és utána álló token.",
            "Csak a legnagyobb figyelmi súlyú néhány token.",
            "Senki: az önfigyelem nem üzenetküldés, mert nincs benne gráf."
          ],
          answer: 0,
          hint: "A 12.5-ben a „levél” token hány tokenre figyelt?",
          explain: R`Az önfigyelem egy GNN a <b>teljes</b> gráfon (önhurkokkal): az üzenet $\mathbf h_u W_V$, a gyűjtés figyelemmel súlyozott összeg mindenkin. Olyan, mint a GAT, csak a gráf teljes, és a pontszám a lekérdezés és a kulcs skaláris szorzata. A „bal és jobb szomszéd” egy láncon futó GNN lenne; a figyelem nem vág le tokeneket, minden pár kap súlyt.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 1000 csúcsú, 4000 élű (irányítatlan) gráfon hányszor több párt vizsgál a teljes önfigyelem, mint egy GCN-réteg (mindkét irány + önhurkok)?",
          options: ["kb. 111-szer", "kb. 125-ször", "kb. 250-szer", "kb. 200-szor"],
          answer: 0,
          hint: R`GCN: minden él kétszer (oda-vissza) + csúcsonként egy önhurok. Teljes figyelem: $n^2$.`,
          explain: R`GCN: $2 \cdot 4000 + 1000 = 9000$ pár; teljes figyelem: $1000^2 = 10^6$; arány $\approx 111$. A 125 elfelejti az önhurkokat ($10^6/8000$), a 250 az önhurkokat és a második irányt is ($10^6/4000$), a 200 csak a második irányt ($10^6/5000$). Ez a 12.5 négyzetes ára gráfokon.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a gond egy pozíciókódolás nélküli gráf-Transformerrel?",
          options: [
            "Permutációekvivariáns ugyan, de nem tudja, ki kinek a szomszédja – a gráf szerkezetét be kell adni.",
            "Elveszíti a permutációekvivarianciát, mert a csúcsok sorrendje számít a figyelemben.",
            "Kevesebb párt vizsgál, mint egy GCN, ezért a távoli csúcsokat nem látja.",
            "Semmi: a figyelem a jellemzőkből magától megtanulja az éleket."
          ],
          answer: 0,
          hint: "A teljes gráfon mindenki mindenkinek szomszédja. Hol szerepel ebben a molekula kötéseinek listája?",
          explain: R`A $W_Q, W_K, W_V$ minden csúcsra ugyanaz, és a figyelem az összes csúcson összegez, ezért a réteg ekvivariáns – átszámozásra csak a sorok rendeződnek át. Ugyanezért viszont az eredeti gráf szerkezete (mely atomok között van kötés) <b>eltűnik</b>; pozíció- és szerkezeti kódolással (vagy egy helyi üzenetküldő ággal) kell visszaadni. A teljes figyelem több párt néz, nem kevesebbet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 4 csúcsú teljes gráfban (mindenki mindenkivel, önhurok nélkül) mekkora a véletlen séta visszatérési valószínűsége 3 lépés után, $(M^3)_{vv}$, ahol $M = D^{-1}A$?`,
          options: [R`$2/9 \approx 0{,}222$`, R`$1/4 = 0{,}25$`, R`$2/27 \approx 0{,}074$`, R`$0$`],
          answer: 0,
          hint: "Minden lépés 1/3 eséllyel megy egy adott szomszédba. Hány különböző 3 lépéses zárt séta van v → a → b → v alakban?",
          explain: R`Az első lépés 3 csúcs közül, a második a maradék 2 közül (nem mehet vissza $v$-be, különben a 3. lépés nem érne vissza): $3 \cdot 2 = 6$ séta, mindegyik $(1/3)^3$ valószínűségű: $6/27 = 2/9$. Az $1/4$ a háromszög értéke (ott 2 séta, $(1/2)^3$ valószínűséggel); a $2/27$ csak két irányt számol, mint a háromszögben; a 0 páros (kétszínezhető) gráfra lenne igaz, de itt vannak háromszögek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 5 csúcsú gráf Laplace-mátrixának ($L = D - A$) sajátértékei: $0;\ 0;\ 0;\ 1;\ 3$. Hány összefüggő darabból (komponensből) áll a gráf?`,
          options: ["3", "2", "1", "5"],
          answer: 0,
          hint: "Minden összefüggő darabon külön állandó vektor ad 0-t.",
          explain: R`A 0 sajátértékek száma = a komponensek száma: 3 (például egy 3 csúcsú út – sajátértékei $0;\ 1;\ 3$ – és két izolált csúcs). A 2 a nem nulla sajátértékek száma, az 5 az összes sajátértéké, az 1 azt hinné, hogy a 0 mindig csak egyszer fordulhat elő (az csak összefüggő gráfra igaz – mint a hatszögnél).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a gráfos pozíciókódolásra?",
          options: [
            R`A Laplace-sajátvektor előjele önkényes ($\mathbf u$ és $-\mathbf u$ is sajátvektor), ezért tanításkor véletlenszerűen átfordítják, vagy előjelfüggetlen hálót használnak.`,
            "A véletlenséta-kódolás nem függ a számozástól, és ritka mátrixszorzásokkal olcsón számolható.",
            "A csúcs sorszáma (1, 2, …, n) jó pozíciókódolás, ahogy a mondatoknál a token sorszáma.",
            "Egy jó pozíciókódolás a futó példán Annát és Csillát is megkülönbözteti.",
            "A pozíciókódolás nem segít a WL-korláton, hiszen az üzenetküldés ugyanaz marad."
          ],
          answer: [0, 1],
          hint: "Mi történik egy kódolással átszámozáskor? És honnan jön a kódolás: helyi vagy globális szerkezetből?",
          explain: R`Az első kettő igaz (a sajátvektoroknál egyenlő sajátértékeknél még rosszabb: tetszőlegesen elforgathatók). A sorszám a számozástól függ – átszámozás után ugyanaz a csúcs más kódot kapna, a modell nem lenne ekvivariáns. Anna és Csilla szimmetrikusak: a 2 lépéses visszatérésük is egyforma (0,417) – jó kódolás nem tesz különbséget, ahol a gráfban nincs. A pozíciókódolás globális szerkezetet (gyűrűk, távolságok) ad a kezdő jellemzőkhöz, így a WL-korlát átléphető: a hatszögben a 3 lépéses visszatérés 0, a két háromszögben 0,25.`
        },
        {
          type: "single", shuffle: true,
          q: "Hogyan épül fel egy GPS-típusú gráf-Transformer-réteg (Rampášek és társai, 2022)?",
          options: [
            "Rétegenként egy üzenetküldő ág az éleken és egy teljes önfigyelem-ág fut egymás mellett, az eredményt összeadják, utána FFN; a bemenethez RWSE/LapPE kódolást fűznek.",
            "Előbb több üzenetküldő réteg fut, a végén egyetlen önfigyelem-réteg veszi át a kiolvasás szerepét.",
            "Csak teljes önfigyelem van, az éleket kizárólag a pozíciókódolás hordozza – üzenetküldő ág nincs.",
            "Az önfigyelem csak a szomszédokon fut (mint a GAT), a globális kapcsolatot egy virtuális csúcs adja."
          ],
          answer: 0,
          hint: "„Helyi + globális” – egymás után vagy egymás mellett? És mit kap a bemenet?",
          explain: R`$H' = \operatorname{FFN}(H_{\text{helyi}} + H_{\text{globális}})$, maradékkapcsolatokkal és normalizálással. A helyi ág (költség $\sim |E|$) megtartja a kötések pontos szerkezetét, a globális ág ($\sim n^2$) egy lépésben összeköti a távoli csúcsokat – ez a túlnyomás ellenszere. A „csak figyelem” változat a szerkezetet csak közvetve látná, a „csak szomszédokon figyelő” változat pedig egy GAT lenne, globális ág nélkül.`
        },
        {
          type: "multi",
          q: "Mit állít a 13.8 📅 doboza a gráf-Transformerek és a klasszikus GNN-ek összevetéséről?",
          options: [
            "Az LRGB-benchmarkon a gráf-Transformerek előnye alapos hiperparaméter-hangolás után eltűnt (Tönshoff és társai, 2024).",
            "Kis hangolással a GCN, a GAT és a GraphSAGE 18 csúcsosztályozási adatkészletből 17-en hozta vagy verte a gráf-Transformereket.",
            "A gráf-Transformerek minden benchmarkon egyértelműen legyőzték a klasszikus GNN-eket, ezért a szakirodalom egységes.",
            "A nagy időjárásmodellek (GenCast, WeatherNext 2) elhagyták a gráfot, és rácson futó CNN-t használnak.",
            "A globális figyelemnek a valódi hosszú távú fizikai kölcsönhatásoknál sincs előnye."
          ],
          answer: [0, 1],
          hint: "A doboz így kezdődik: „A szakirodalom megosztott.” Mit mond az egyik, és mit a másik tábor?",
          explain: R`Az első kettő a „klasszikus GNN erős alapvonal” tábor eredménye (Luo és társai gráfszintű feladatokon is: 14-ből mindegyiken az első háromban, 8-on első). A másik tábor szerint valódi hosszú távú fizikai kölcsönhatásoknál a helyi + globális modellek előnye a legtisztább, és a nagy rendszerek egyre inkább figyelmet használnak <b>egy gráfon</b>: a GenCast és a WeatherNext 2 gráf-Transformert futtat a gömbháló csúcsain. A tanulság: előbb egy jól hangolt klasszikus GNN-t mérj.`
        }
      ]
    },

    /* ------------------------------------------------ 13.9 */
    "ai13-139": {
      title: "Kvíz – 13.9 Geometriai és ekvivariáns GNN-ek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két atom az $(1;\ 1;\ 1)$ és a $(3;\ 4;\ 7)$ pontban van. Mennyi a távolságuk, és mennyi lesz, ha a molekulát elforgatod, majd $(5;\ 0;\ 0)$-val eltolod?`,
          options: ["7, és utána is 7", "7, utána a forgatástól függően más", "49, és utána is 49", "11, és utána is 11"],
          answer: 0,
          hint: "Különbségvektor, aztán a hossza. Mit tesz a forgatás és az eltolás a különbségvektor hosszával?",
          explain: R`A különbség $(2;\ 3;\ 6)$, hossza $\sqrt{4 + 9 + 36} = \sqrt{49} = 7$. Forgatás és eltolás után is 7: az eltolás a különbségvektort nem érinti, a forgatás a hosszát nem változtatja meg – a távolság E(3)-invariáns. A 49 a gyökvonást felejti el, a 11 a koordinátakülönbségek sima összege. A koordináták változnak, a távolság nem.`
        },
        {
          type: "set",
          q: "Sugárgráfot építünk 5 Å-ös határral. A távolságok: A–B 3,2 Å; A–C 5,4 Å; B–C 4,9 Å; C–D 2,0 Å; B–D 6,3 Å. Jelöld ki a gráf éleit!",
          items: ["A–B", "A–C", "B–C", "C–D", "B–D"],
          answer: ["A–B", "B–C", "C–D"],
          hint: "Él akkor van, ha a távolság a határ alatt van – a kötésektől függetlenül.",
          explain: R`A–B (3,2), B–C (4,9) és C–D (2,0) az 5 Å alatt van; A–C (5,4) és B–D (6,3) fölötte. A sugárgráf a térből jön, nem a kémiai kötésekből: egy fehérjében a láncban 100 lépésre lévő aminosavak is szomszédok lehetnek, ha a térben közel vannak.`
        },
        {
          type: "multi",
          q: "Melyik mennyiség ekvivariáns (forog együtt a molekulával)?",
          options: [
            "Az egyes atomokra ható erők",
            "A molekula dipólusmomentum-vektora",
            "Az EGNN koordináta-frissítésében az atomok elmozdulása",
            "A molekula teljes energiája",
            "Az atomok közti legkisebb távolság"
          ],
          answer: [0, 1, 2],
          hint: "Szám vagy vektor? A szám (skalár) forgatáskor marad, a vektor elfordul.",
          explain: R`Az erő, a dipólus és az elmozdulás vektor: elforgatott molekulánál ugyanúgy elfordul, $F(R\mathbf x + \mathbf t) = R\,F(\mathbf x)$ – ekvivariáns. Az energia és a legkisebb távolság szám: forgatásra nem változik – invariáns. Ha egy erőt invariáns modellel jósolsz, elforgatott molekulára rossz irányt kapsz. Az erőt gyakran az invariáns energia deriváltjából ($-\nabla_{\mathbf x} E$) kapják, az automatikusan ekvivariáns.`
        },
        {
          type: "single", shuffle: true,
          q: R`A rugós szabály: $\mathbf x_i' = \mathbf x_i + (\mathbf x_i - \mathbf x_j)\, c(d)$, $c(d) = -0{,}25\,(d - 1)$. Hová kerül a $(0;\ 0)$ és a $(0;\ 1{,}4)$ pontban lévő két atom?`,
          options: [
            R`$(0;\ 0{,}14)$ és $(0;\ 1{,}26)$`,
            R`$(0;\ -0{,}14)$ és $(0;\ 1{,}54)$`,
            R`$(0;\ 0{,}1)$ és $(0;\ 1{,}3)$`,
            R`$(0;\ 0{,}49)$ és $(0;\ 0{,}91)$`
          ],
          answer: 0,
          hint: R`$d = 1{,}4$, tehát $c = -0{,}25 \cdot 0{,}4$. Az első atomnál $\mathbf x_1 - \mathbf x_2 = (0;\ -1{,}4)$.`,
          explain: R`$c = -0{,}1$. Első: $(0;0) + (0;\ -1{,}4)\cdot(-0{,}1) = (0;\ 0{,}14)$; második: $(0;\ 1{,}4) + (0;\ 1{,}4)\cdot(-0{,}1) = (0;\ 1{,}26)$ – a rugó kicsit összehúzódik a nyugalmi hossz felé. A $-0{,}14$ / $1{,}54$ a különbségvektort fordítva veszi (szétlöki az atomokat); a $0{,}1$ / $1{,}3$ egységvektorral számol, elhagyja a távolsággal szorzást; a $0{,}49$ / $0{,}91$ a $(d - 1)$ helyett $d$-vel számolja $c$-t.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem tudja egy csak távolságokat látó háló megkülönböztetni egy molekulát a tükörképétől (pl. a talidomid két formáját)?",
          options: [
            "Mert a tükrözés minden távolságot (és szöget) megőriz – a háló bemenete a két esetben pontosan ugyanaz.",
            "Mert a távolságok tükrözéskor előjelet váltanak, és a háló csak az abszolút értéket látja.",
            "Mert a sugárgráf 5 Å-ös határa túl kicsi a teljes molekulához.",
            "Mert a tükrözés átszámozza az atomokat, a háló pedig permutációinvariáns."
          ],
          answer: 0,
          hint: "Az E(3) a forgatásokat, az eltolásokat – és még mit tartalmaz?",
          explain: R`A tükrözés is távolságtartó (E(3) része), ezért egy csak távolságokra épülő, E(3)-invariáns háló a molekulát és a tükörképét (kiralitás) egyformának látja. A távolság mindig nemnegatív, nincs előjele. Ha a kiralitás számít, csak a forgatásra (SE(3)) szabad invariánsnak lenni, a tükrözésre nem – ehhez előjeles mennyiség kell (pl. torziós szög előjele).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kolléga az EGNN koordináta-frissítésében a különbségvektor helyett az abszolút koordinátát használná: $\mathbf x_i' = \mathbf x_i + \sum_j \mathbf x_j\,\phi(\ldots)$. Melyik tulajdonság romlik el?`,
          options: [
            "Az eltolás-ekvivariancia",
            "A forgatás-ekvivariancia",
            "A permutációekvivariancia",
            "Csak a számítás lesz drágább, a szimmetriák megmaradnak"
          ],
          answer: 0,
          hint: R`Told el az összes atomot $\mathbf t$-vel! Kiesik-e $\mathbf t$ a $\sum_j \mathbf x_j\,\phi$ tagból? És forgatásnál kiemelhető-e $R$?`,
          explain: R`Eltolásnál a $\sum_j \mathbf x_j\phi$ tag $\mathbf t \sum_j \phi$-vel változik, ami általában nem $\mathbf t$ – az eredmény nem egyszerűen eltolódik. Forgatásnál viszont $\sum_j R\mathbf x_j\,\phi = R\sum_j \mathbf x_j\,\phi$ (a $\phi$ invariáns), így a forgatás-ekvivariancia megmaradna. A különbségvektorban az eltolás kiesik: $(\mathbf x_i + \mathbf t) - (\mathbf x_j + \mathbf t) = \mathbf x_i - \mathbf x_j$.`
        },
        {
          type: "match",
          q: "Párosítsd az adattípust a szimmetriájával és a hozzá illő architektúrával (a geometriai mélytanulás táblázata)!",
          pairs: [
            ["rács (kép)", "eltolás – CNN"],
            ["halmaz", "permutáció – összegzés + MLP (Deep Sets)"],
            ["3D molekula, pontfelhő", "permutáció + forgatás + eltolás – ekvivariáns GNN"],
            ["gömb (Föld, időjárás)", "forgatás – GNN a gömbhálón (GraphCast)"]
          ],
          hint: "Két kérdés: milyen átalakítás nem változtatja meg a választ, és mi a „szomszédság”?",
          explain: R`Kép: a szűrő minden helyen ugyanaz (eltolás). Halmaz: a sorrend nem számít, az összeg invariáns (Deep Sets; a GIN ugyanezt teszi a szomszédokon). 3D molekula: a számozás, a forgatás és az eltolás sem változtat a fizikán (EGNN, NequIP, MACE). Gömb: forgatás – a GraphCast egyenletes gömbhálón futtat üzenetküldést. Mindegyik ugyanazt a receptet követi: a szimmetriát a felépítésbe tesszük.`
        },
        {
          type: "multi",
          q: "Mit állít a 13.9 📅 doboza a geometriai GNN-ek nagy eredményeiről?",
          options: [
            "Az AlphaFold 2 gráfszemléletű, figyelemre épülő háló sűrű gráfon – nem klasszikus, ritka üzenetküldő GNN.",
            "A GNoME 2,2 millió stabilnak jósolt kristályszerkezetet javasolt, de anyagkémikusok szerint kevés a bizonyíték, hogy ezek egyszerre újak, hihetők és hasznosak.",
            "Az alapmodell-potenciálok (pl. MACE-MP-0) rendszeres hibája, hogy a valóságosnál „puhábbnak” látják az energiafelületet.",
            "Az AlphaFold 3 a figyelmet klasszikus, ritka üzenetküldő GNN-re cserélte.",
            "A GNoME mind a 2,2 millió anyagát független laborok már előállították."
          ],
          answer: [0, 1, 2],
          hint: "Figyelj a pontos megfogalmazásra: „gráfszemléletű” ≠ „klasszikus GNN”, és „jósolt” ≠ „előállított”.",
          explain: R`Az első három a szöveg állítása (a MACE-MP-0 „puhaságát” kevés adatos finomhangolás javítja). Az AlphaFold 3 a törzset egyszerűsítette (Pairformer), a szerkezetet diffúziós modullal állítja elő – nem tért át ritka üzenetküldésre. A GNoME 2,2 millió jelöltjéből a szöveg szerint 736-ot állítottak elő független laborok. Jóslat ≠ felfedezés: a számítógépes szűrés a laborkísérletet rövidíti le, nem helyettesíti.`
        }
      ]
    },

    /* ------------------------------------------------ 13.10 */
    "ai13-1310": {
      title: "Kvíz – 13.10 Alkalmazások; gráfok és nagy nyelvi modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A halicin-történetben (Stokes és társai, 2020) mi volt a GNN szerepe?",
          options: [
            "Eldöntötte, melyik 23 molekulát érdemes kipróbálni a 107 millióból – a laborkísérletet nem váltotta ki.",
            "Kiváltotta a laborkísérleteket: a 107 millió molekula hatását a modell igazolta.",
            "Atomról atomra megtervezte a halicin szerkezetét, mint egy generatív modell.",
            "Engedélyezett antibiotikumot talált, amely ma gyógyszerként kapható."
          ],
          answer: 0,
          hint: "A 107 millió pontozott molekulából hányat teszteltek a laborban? És mit mond a buktató-doboz a halicin státuszáról?",
          explain: R`A modell (Chemprop, irányított élekkel dolgozó MPNN) 2335 molekulán tanult, aztán pontozott; a 107 millióból 23-at teszteltek, 8 hatott ($8/23 \approx 34{,}8\%$). Ez a „GNN mint szűrő” minta: kevés drága mérés → tanítás → olcsó pontozás → a legjobbak újramérése. A halicin létező vegyület, amelyet a modell egy adatbázisban talált meg, nem tervezett. A szöveg szerint a halicin és az abaucin preklinikai fázisú – egyik sem engedélyezett gyógyszer.`
        },
        {
          type: "single", shuffle: true,
          q: "A GraphCast rácspontjaiban 5 felszíni és 6 légköri mennyiség szerepel, ez utóbbiak 37 magasságban. Hány változó tartozik egy rácsponthoz?",
          options: ["227", "48", "222", "1110"],
          answer: 0,
          hint: "A légköri mennyiségek minden magasságban külön változók; a felszínieket csak egyszer számold.",
          explain: R`$5 + 6 \cdot 37 = 227$. A 48 összeadja a három számot ($5 + 6 + 37$), a 222 elfelejti a felszíni változókat ($6 \cdot 37$), az 1110 mindent összeszoroz. A $721 \cdot 1440 = 1\,038\,240$ rácsponttal egy időpont kb. 236 millió szám – ezt kódolja a GraphCast egy 40&nbsp;962 csúcsú gömbhálóra.`
        },
        {
          type: "match",
          q: "Párosítsd az időjárásmodellt a felépítésével!",
          pairs: [
            ["GraphCast (2023)", "üzenetküldő GNN a gömbhálón"],
            ["GenCast (2024)", "gráf-Transformer a gömbhálón + diffúzió"],
            ["ECMWF AIFS (2025)", "GNN-kódoló és -dekódoló, Transformer-feldolgozó"],
            ["Pangu-Weather", "3D-s Transformer rácson – nem GNN"]
          ],
          hint: "Melyik az, amelyiknél a szöveg külön kiemeli, hogy nem minden MI-időjárásmodell GNN?",
          explain: R`A GraphCast 16 üzenetküldő réteggel lép 6 órát előre a gömbhálón. A GenCast valószínűségi együttest ad: gráf-Transformer + diffúzió. Az ECMWF 2025. február 25-én élesítette az AIFS-t (GNN-kódoló/-dekódoló, Transformer-feldolgozó). A Pangu-Weather rácson futó 3D-s Transformer – nem minden MI-időjárásmodell GNN.`
        },
        {
          type: "match",
          q: "Párosítsd az alkalmazást a gráffal és a feladatszinttel!",
          pairs: [
            ["Érkezésiidő-becslés (Google Maps)", "csúcs = útszakasz, él = csatlakozás"],
            ["Ajánlás (PinSage)", "kétrészes gráf, élszintű feladat"],
            ["Csalásfelderítés", "csúcs = számla, csúcsszintű feladat"],
            ["Antibiotikum-keresés (halicin)", "csúcs = atom, gráfszintű feladat"]
          ],
          hint: "Minden alkalmazásnál kérdezd meg: mi a csúcs, mi az él, és egy csúcsra, egy párra vagy egy egész gráfra kell-e válasz?",
          explain: R`Google Maps: útszakaszok és csatlakozásaik, a GNN „szuperszakaszok” részgráfjain jósol menetidőt. PinSage: felhasználó/kép–tábla kétrészes gráf, GNN-beágyazás + skaláris szorzat – élszintű (13.6). Csalás: számlák és tranzakciók, „csaló-e?” – csúcsszintű, gyakran heterofil gráfon. Molekula: egy egész gráfra egy válasz, invariáns kiolvasással.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért lehet egy GNN tanítása lassú a GPU-n, pedig kevés szorzást végez?",
          options: [
            "Mert a szomszédok vektorai szétszórva vannak a memóriában, a fokszám csúcsonként más – a számítás ritka és szabálytalan.",
            "Mert egy GNN-réteg több szorzást végez, mint egy azonos méretű CNN-réteg.",
            "Mert a GPU nem tud ritka mátrixot tárolni, ezért a gráfot mindig a processzor dolgozza fel.",
            "Mert a kiolvasás (összeg a csúcsokon) a teljes gráfon négyzetes költségű."
          ],
          answer: 0,
          hint: "Mit szeret a GPU: sűrű, szabályos mátrixszorzást – vagy szétszórt sorok összeszedését?",
          explain: R`A sebesség itt nem a műveletszámon múlik: a szétszórt sorok összegyűjtése, a szomszédok kikeresése és a mintavétel viszi az idő nagyobb részét. Ellenszer: mintavétel (GraphSAGE), csoportokra bontás és csoportonkénti kötegek (Cluster-GCN), gyorsítótárazás. A kiolvasás lineáris a csúcsszámban, nem négyzetes; a ritka mátrix GPU-n is tárolható – csak a hozzáférés szabálytalan.`
        },
        {
          type: "multi",
          q: "Mely állítások szerepelnek a 13.10 📅/⚖️ jelű eredményei között?",
          options: [
            "Az Elliptic-adatkészlet eredeti cikkében a véletlen erdő jobb volt a GCN-nél; későbbi, más beállítású összehasonlításokban a GNN-ek jöttek ki jobban.",
            "A chiptervező ágens (AlphaChip) eredménye vitatott: független kutatók szerint a klasszikus módszerek és a szakértők jobbak, és 2025 végéig nem született sikeres független reprodukció.",
            "A „Talk like a Graph” szerint ugyanannak a gráfnak más szöveges kódolása feladattól függően 4,8–61,8%-kal is javíthatja vagy ronthatja az eredményt.",
            "A GraphRAG az eredeti cikkben és a 2025-ös újraértékeléseken is minden kérdéstípuson verte a sima visszakeresést.",
            "2026-ban már létezik általános, „GPT-szerű” gráf-alapmodell."
          ],
          answer: [0, 1, 2],
          hint: "Figyelj a vitákra: hol mond a szöveg „viszont”-ot, és hol írja, hogy valami (még) nincs?",
          explain: R`Az első három a szöveg állítása. A GraphRAG az eredeti cikkben az átfogó kérdéseken nyert (72–83%-ban teljesebb válasz egy LLM-bíró szerint), de a 2025-ös újraértékelések szerint sok ténykereső kérdésen a sima visszakeresés a jobb – a kettő együtt a legerősebb. A szöveg szerint 2026-ban <b>általános</b> gráf-alapmodell nincs, csak terület-specifikusak (ULTRA tudásgráfokon, MACE-MP-0 atomszimulációban), és ez is vitatott.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem GNN a GraphRAG?",
          options: [
            "Mert nincs benne tanult üzenetküldés: a tudásgráfot egy LLM építi és olvassa, a gráf egy index.",
            "Mert a tudásgráf irányított, a GNN pedig csak irányítatlan gráfon futhat.",
            "Mert a gráf túl nagy, ezért mintavételt használ – a mintavételes háló már nem GNN.",
            "Mert a gráfot csak szövegként írja a promptba, mint a „Talk like a Graph” kísérletei."
          ],
          answer: 0,
          hint: "Mi tesz valamit GNN-né: az, hogy van benne gráf, vagy az, hogy tanult üzenetküldés fut rajta?",
          explain: R`A GraphRAG-ban egy LLM a dokumentumokból tudásgráfot épít, csoportokra bontja és összefoglalja, kérdéskor ezekből válaszol – tanult üzenetküldés nincs benne, a „gráf” adatszerkezet. A GNN irányított gráfon is futhat (pl. a Chemprop irányított élekkel dolgozik), és a mintavételes GraphSAGE is GNN. A GraphRAG nem a nyers gráfot írja a promptba, hanem a csoport-összefoglalókból dolgozik.`
        },
        {
          type: "match",
          q: "Melyik megoldás illik a feladathoz?",
          pairs: [
            ["100 000 cikk témájának besorolása a hivatkozások és a szöveg alapján", "nyelvi modellel kódolt szöveges jellemzők + GNN"],
            ["Átfogó összefoglaló egy céges dokumentumtárból", "GraphRAG (esetleg sima visszakereséssel kombinálva)"],
            ["Háromszögek megszámolása egy 1000 csúcsú gráfban", "egy egyszerű program – se LLM, se GNN"],
            ["Molekula antibakteriális hatásának jóslása", "üzenetküldő GNN gráfszintű kiolvasással"]
          ],
          hint: "Szöveges csúcsok + hivatkozási gráf? Átfogó kérdés sok dokumentumon? Algoritmikus feladat? Nem szöveges, természetes gráf?",
          explain: R`Szöveges csúcsoknál az LLM-beágyazás + klasszikus GNN (pl. TAPE) az egyik legolcsóbb erős recept. Átfogó kérdésekre a GraphRAG erős, ténykeresésre a sima visszakeresés – együtt a legjobbak. A háromszögszámlálás algoritmikus ($\operatorname{tr}(A^3)/6$): egy program hibátlanul megoldja, az LLM legfeljebb megírja. Molekuláknál a gráf az adat természetes formája – ott a GNN dolgozik.`
        }
      ]
    },
