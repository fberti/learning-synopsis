    /* ------------------------------------------------ 1.5 */
    "gh1-15": {
      title: "Kvíz – 1.5 Egyszerű gráf, hurok, többszörös él",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban $p$ és $q$ között 2 párhuzamos él fut, $q$ és $r$ között 1 él, $r$-en pedig van egy hurokél. Mennyi a fokszámok összege?`,
          options: ["8", "7", "6", "4"],
          answer: 0,
          hint: "Minden él annyit ad a fokszámhoz, ahányszor a csúcsra illeszkedik. Hányszor illeszkedik a hurok a saját csúcsára?",
          explain: R`$d(p) = 2$, $d(q) = 2 + 1 = 3$, $d(r) = 1 + 2 = 3$, összesen $8$. Ez $2m$, hiszen $m = 2 + 1 + 1 = 4$ – a kézfogási lemma itt is igaz. A 7 akkor jön ki, ha a hurkot 1-nek számolod (ekkor páratlan lenne az összeg, ami lehetetlen). A 6 a párhuzamos éleket egynek veszi, a 4 pedig maga az élszám, nem a fokszámösszeg.`
        },
        {
          type: "single", shuffle: true,
          q: "A königsbergi hidak gráfjában a négy szárazföldi rész a csúcs, a hét híd az él. Mi a fokszámsorozat?",
          options: ["(5, 3, 3, 3)", "(3, 3, 2, 2)", "(5, 3, 3, 2)", "(4, 3, 3, 3)"],
          answer: 0,
          hint: "Minden híd külön él – a párhuzamos hidak külön-külön számítanak. Ellenőrizd a kézfogási lemmával!",
          explain: R`A sziget: 2 híd északra, 2 délre, 1 keletre, $d = 5$. Az északi part, a déli part és a keleti terület 3-3. Összeg: $14 = 2 \cdot 7$ ✓. A $(3, 3, 2, 2)$ a <b>különböző szomszédokat</b> számolja (az egyszerűsített gráf sorozata), pedig a fokszám az illeszkedő élek száma. A többi sorozat összege páratlan (13), tehát biztosan elszámolás.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány éle van a königsbergi hidak gráfjának, és hány szomszédos csúcspár van benne?",
          options: ["7 él, 5 szomszédos pár", "5 él, 5 szomszédos pár", "7 él, 7 szomszédos pár", "14 él, 5 szomszédos pár"],
          answer: 0,
          hint: "Az élek itt önálló objektumok (hidak), nem csúcspárok. Ugyanaz a pár több hídhoz is tartozhat.",
          explain: R`Hét híd = 7 él. A szomszédos párok: É–Sz, D–Sz, K–Sz, É–K, D–K, összesen 5 – az É–Sz és a D–Sz párhoz két-két híd tartozik. A „5 él” az egyszerűsített gráf, amely elveszíti a többszörösséget. A 14 a fokszámösszeg ($2m$), nem az élszám.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az $e$ él hurokél, ha $|\varphi(e)| = 1$.`,
            "Egy gráf egyszerű, ha nincs benne sem hurokél, sem párhuzamos él.",
            R`Ha a networkx <code>Graph</code> típusába háromszor hozzáadod a La–Ön élt, a gráfnak 1 éle lesz.`,
            "A hurokél 1-gyel növeli a csúcsa fokszámát.",
            R`A $G = (V, E)$ definícióban az $E$ halmaz többször is tartalmazhatja ugyanazt a csúcspárt.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a $(V, E, \varphi)$ definícióra és a szakasz buktató-dobozára. Mi történik egy halmazban az ismétlődő elemmel?`,
          explain: R`A hurokélnek egyetlen végpontja van, ezért $|\varphi(e)| = 1$. Egyszerű az a gráf, amelyben nincs sem hurok, sem párhuzamos él. A networkx <code>Graph</code> egy már meglévő élt csendben nem ad hozzá újra, így a többszörösség elvész. A hurok viszont <b>2</b>-t ad a fokszámhoz (mindkét „vége” ott van), különben sérülne a kézfogási lemma. Az $E$ halmaz pedig egy elemet csak egyszer tartalmazhat – éppen ezért kell a $(V, E, \varphi)$ hármas a többszörös élekhez.`
        },
        {
          type: "match",
          q: "Melyik fogalom illik a leíráshoz? Párosítsd!",
          pairs: [
            ["él, ha a két szereplő legalább egy cikkben együtt szerepel", "egyszerű gráf"],
            ["minden közös cikk külön él a két szereplő között", "multigráf"],
            ["egy él, mellette a közös cikkek száma", "súlyozott gráf"],
            ["a csúcsra illeszkedő élek súlyainak összege", "erősség"],
            ["olyan él, amely a csúcsából önmagába tér vissza", "hurokél"]
          ],
          hint: "Ugyanaz az adat háromféleképpen: csak azt jegyzed fel, volt-e közös cikk; minden cikket külön vonallal rajzolsz; vagy egy vonalra számot írsz.",
          explain: R`Az egyszerű gráf csak azt tárolja, volt-e közös cikk – a „háromszor együtt” és az „egyszer együtt” ugyanúgy egy él. A multigráf minden közös cikket külön élként tart meg, a súlyozott gráf ugyanezt egyetlen él súlyaként ($w_{uv}$). Egész súlynál a kettő ugyanazt az információt hordozza. A súlyozott fokszám neve erősség; a hurokél pedig önmagába tér vissza.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét 12 cikke alapján hány éle van a szereplők multigráfjának (minden közös cikk egy él)?",
          options: ["18", "10", "36", "12"],
          answer: 0,
          hint: R`Egy $k$ szereplős cikk $\binom k2$ élt ad. Hány cikk említ 3 szereplőt, és hány 2-t?`,
          explain: R`Három cikk (2, 5, 8) 3 szereplős: $3 \cdot \binom32 = 9$ él. A többi kilenc cikk 2 szereplős: 9 él. Összesen $m = 18$. A 10 az <b>egyszerű</b> gráf élszáma (a különböző párok száma), a 36 a fokszámösszeg ($2m$), a 12 pedig a cikkek száma – de egy cikk több élt is adhat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három cikk: (La, Ön), (La, Ön, Po), (La, Po). Mennyi a Lakók fokszáma és erőssége a súlyozott szereplőgráfban?`,
          options: ["fokszám 2, erősség 4", "fokszám 4, erősség 2", "fokszám 2, erősség 3", "fokszám 3, erősség 4"],
          answer: 0,
          hint: "Előbb írd fel az éleket és a súlyukat (hány cikkben szerepel együtt a pár). A fokszám a szomszédok száma, az erősség a súlyok összege.",
          explain: R`Élek és súlyok: La–Ön 2, La–Po 2, Ön–Po 1. A Lakók szomszédai: Önkéntesek, Polgármester → fokszám 2. Erősség: $2 + 2 = 4$. A 3 a Lakók <b>cikkeinek</b> száma – de a 3 szereplős cikk két párt ad a Lakóknak, ezért az erősség nagyobb. A „4 és 2” felcseréli a fokszámot és az erősséget.`
        }
      ]
    },

    /* ------------------------------------------------ 1.6 */
    "gh1-16": {
      title: "Kvíz – 1.6 Nevezetes gráfok, komplementer, izomorfia",
      questions: [
        {
          type: "match",
          q: "Párosítsd a gráfot a jellemzőjével!",
          pairs: [
            [R`$K_5$`, "10 él"],
            [R`$P_5$`, "4 él"],
            [R`$C_5$`, "5 él"],
            [R`$K_{1,5}$`, "6 csúcs"],
            [R`$\overline{K_5}$ (üres gráf)`, "0 él"]
          ],
          hint: R`Nézd meg a nevezetes gráfok táblázatát: a $P_n$-ben $n$ csúcs van, a $K_{1,n}$-ben $n$ levél.`,
          explain: R`$K_5$: $\binom52 = 10$ él. $P_5$: 5 csúcs, $5 - 1 = 4$ él. $C_5$: 5 csúcs, 5 él (az út + a záró él). $K_{1,5}$: egy középpont + 5 levél = 6 csúcs (és 5 él). Az üres gráfnak nincs éle. Tipikus hiba: $P_n$-nek $n$ élt adni, vagy a csillagnak $n$ csúcsot.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány éle van $K_8$-nak?`,
          options: ["28", "56", "64", "7"],
          answer: 0,
          hint: "Minden csúcspár egy él. Hány pár van, ha a sorrend nem számít?",
          explain: R`$\binom82 = \frac{8 \cdot 7}{2} = 28$. Az 56 = $8 \cdot 7$ minden élt kétszer számol (ez a fokszámösszeg), a 64 = $8^2$ a csúcs önmagával alkotott „párjait” is beleveszi. A 7 egy csúcs fokszáma, nem az élszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 10 csúcsú egyszerű gráfnak 6 éle van. Hány éle van a komplementerének?`,
          options: ["39", "4", "94", "84"],
          answer: 0,
          hint: R`Minden csúcspár pontosan az egyik gráfban él: vagy $G$-ben, vagy $\overline G$-ben.`,
          explain: R`$\overline m = \binom{10}{2} - 6 = 45 - 6 = 39$. A 4 = $n - m$ – ennek nincs értelme, hiszen a komplementer a hiányzó <b>párokat</b> köti össze, nem a csúcsokat számolja. A 94 = $10^2 - 6$ és a 84 = $10 \cdot 9 - 6$ a párok számát rosszul adja meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 8 csúcsú egyszerű gráfban $d_G(v) = 3$. Mennyi $v$ fokszáma a komplementerben?`,
          options: ["4", "5", "3", "25"],
          answer: 0,
          hint: R`Hány lehetséges szomszédja van egy csúcsnak egy $n$ csúcsú egyszerű gráfban?`,
          explain: R`$d_{\overline G}(v) = n - 1 - d_G(v) = 7 - 3 = 4$. Az 5 = $n - d$ elfelejti, hogy a csúcs önmagával nem lehet szomszédos. A 25 = $\binom82 - 3$ a komplementer élszámának képletét keveri a fokszámmal.`
        },
        {
          type: "single", shuffle: true,
          q: R`$V = \{A, B, C, D\}$, $E = \{AB, BC, CD, DA\}$. Mi a komplementer élhalmaza?`,
          options: [
            R`$\{AC, BD\}$`,
            R`$\{BA, CB, DC, AD\}$`,
            R`$\{AA, BB, CC, DD\}$`,
            R`$\{AC, BD, AB, CD\}$`
          ],
          answer: 0,
          hint: R`Írd fel mind a $\binom42 = 6$ párt, és húzd ki a foglaltakat. A komplementerben $u \ne v$.`,
          explain: R`A 6 párból 4 foglalt, marad $AC$ és $BD$. Ellenőrzés: $4 + 2 = 6$. A $\{BA, CB, DC, AD\}$ ugyanaz a négy él, csak megfordítva – az él rendezetlen pár. Hurok a komplementerbe sem kerül ($u \ne v$). Az utolsó opció két meglévő élt is tartalmaz.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Ha két gráf fokszámsorozata különbözik, biztosan nem izomorfak.",
            "Izomorf gráfokban a háromszögek száma megegyezik.",
            "A Reggeli Hírlap és a Nyitott Szó szereplőgráfja izomorf, pedig a csúcsaik mások.",
            "Ha két gráf fokszámsorozata megegyezik, akkor izomorfak.",
            "Ha két rajz másképp néz ki, akkor különböző gráfokat ábrázolnak."
          ],
          answer: [0, 1, 2],
          hint: "Mi az invariáns? Mire elég, ha egy invariáns eltér, és mire nem elég, ha mind egyezik?",
          explain: R`A fokszámsorozat és a háromszögek száma invariáns: izomorf gráfokban egyezik, ezért ha eltér, nincs izomorfia. A Reggeli Hírlap és a Nyitott Szó gráfja egyaránt $K_3$ – a szerkezet egyezik, a szereplők nem. A fordított irány hamis: $C_6$ és két különálló háromszög fokszámsorozata egyaránt $(2, 2, 2, 2, 2, 2)$, mégsem izomorfak. A rajz pedig nem a gráf: az ötszög és az ötágú csillag ugyanaz a $C_5$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$G_1$ élei: $ab, bc, cd, de, ea, ac$. $G_2$ élei: $12, 23, 34, 45, 51, 24$. Izomorfak?`,
          options: [
            R`Igen, pl. $a \mapsto 2$, $b \mapsto 3$, $c \mapsto 4$, $d \mapsto 5$, $e \mapsto 1$.`,
            "Igen, mert a fokszámsorozatuk megegyezik – ez elég.",
            R`Nem, mert a „húr” $G_1$-ben az $a$ és $c$, $G_2$-ben a 2 és 4 között fut.`,
            "Nem, mert a fokszámsorozatuk különbözik."
          ],
          answer: 0,
          hint: "Mindkettő egy ötszög plusz egy húr. Melyik két csúcs 3-as fokú, és szomszédosak-e? Próbálj megadni egy megfeleltetést, és ellenőrizd mind a hat élt!",
          explain: R`Mindkét gráfban két 3-as fokú csúcs van, és ezek szomszédosak ($ac$, illetve $24$). Az $f$: $a \mapsto 2$, $b \mapsto 3$, $c \mapsto 4$, $d \mapsto 5$, $e \mapsto 1$ minden élt élre visz: $ab \to 23$, $bc \to 34$, $cd \to 45$, $de \to 51$, $ea \to 12$, $ac \to 24$ ✓. A fokszámsorozat valóban egyezik, $(3, 3, 2, 2, 2)$, de ez önmagában <b>nem bizonyítja</b> az izomorfiát – ahhoz a megfeleltetés kell. A csúcsok neve pedig nem számít.`
        }
      ]
    },

    /* ------------------------------------------------ 1.7 */
    "gh1-17": {
      title: "Kvíz – 1.7 Alkalmazás: az Árvízhét szereplőhálózata",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban mi a különbség a Polgármester és a Kormány között?",
          options: [
            "Fokszámuk egyenlő (4), de a Polgármester erőssége nagyobb (8, illetve 6).",
            "A Polgármester fokszáma nagyobb (8, illetve 6).",
            "Erősségük egyenlő, de a Polgármester fokszáma nagyobb.",
            "Semmi: fokszámuk és erősségük is egyenlő."
          ],
          answer: 0,
          hint: "A fokszám azt számolja, hány különböző szereplővel említik együtt; az erősség azt, hányszor.",
          explain: R`Mindkettőnek 4 szomszédja van, tehát $d = 4$. Az erősség (a súlyok összege) viszont a Polgármesternél $2 + 2 + 2 + 2 = 8$, a Kormánynál $2 + 2 + 1 + 1 = 6$: a Polgármester szerepel a legtöbbször másokkal együtt. A „fokszám 8” a fokszámot és az erősséget keveri össze.`
        },
        {
          type: "match",
          q: "Milyen szerkezetű az egyes lapok heti szereplőgráfja? Párosítsd!",
          pairs: [
            ["Reggeli Hírlap", "háromszög"],
            ["Esti Krónika", "háromszög egy levéllel"],
            ["Nyitott Szó", "háromszög"],
            ["Vidéki Napló", "csillag"]
          ],
          hint: "Lapokként csak 3 cikk van. Írd fel a cikkek szereplőit, és kösd össze, akik egy cikkben szerepelnek.",
          explain: R`Reggeli Hírlap: Ko–Vi, Ko–Po, Vi–Po – egy $K_3$. Nyitott Szó: La–Ön, La–Po, Ön–Po – szintén $K_3$ (a kettő izomorf). Esti Krónika: Sz–Vi, Sz–Kl, Sz–Ko, Kl–Ko – háromszög, amelyhez a Szakértőn át a Vízügy levélként kapcsolódik. Vidéki Napló: Po–Vi, Po–La, Po–Ön – csillag, $K_{1,3}$, a Polgármester a középpont.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a Vidéki Napló heti szereplőgráfjának sűrűsége?",
          options: [R`$0{,}5$`, R`$0{,}75$`, R`$0{,}19$`, R`$1$`],
          answer: 0,
          hint: R`Hány csúcs és hány él? A sűrűség a meglévő élek aránya a $\binom n2$ lehetségeshez.`,
          explain: R`$n = 4$, $m = 3$: $\rho = 3 / \binom42 = 3/6 = 0{,}5$. A $0{,}75$ az $m/n$, a $0{,}19$ az $m/n^2 = 3/16$ – egyik sem sűrűség. Az 1 a háromszögeké (Reggeli Hírlap, Nyitott Szó), ahol minden pár szomszédos.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik szereplőpár éle a teljes heti szereplőgráf komplementerének?",
          options: ["Polgármester – Szakértő", "Kormány – Klímaváltozás", "Vízügy – Szakértő", "Polgármester – Vízügy"],
          answer: 0,
          hint: "A komplementerben azok a párok szerepelnek, amelyeket egyetlen cikk sem említ együtt. Keress cikket mindegyik párhoz!",
          explain: R`A Polgármestert és a Szakértőt egyik cikk sem említi együtt, ezért ez a pár a komplementer 11 élének egyike. A Kormány és a Klímaváltozás az 5-ös, a Vízügy és a Szakértő a 4-es, a Polgármester és a Vízügy a 2-es és a 10-es cikkben szerepel együtt. A komplementer él persze csak annyit mond, hogy <b>ebben az adatban</b> nem szerepeltek együtt.`
        },
        {
          type: "multi",
          q: "Melyik következtetés megalapozott az Árvízhét gráfjai alapján? (Több jó válasz is lehet.)",
          options: [
            "A Reggeli Hírlap és a Nyitott Szó gráfja azonos szerkezetű, de más szereplők körül szerveződik.",
            "A Vidéki Naplóban a Polgármester a középpont: minden másik szereplővel ő szerepel együtt.",
            "Egy 3 szereplős cikk egymaga 3 élt ad, ezért a sok szereplős cikkek „maguktól” sűrítik a gráfot.",
            "Az Esti Krónika Szakértő–Kormány éle azt mutatja, hogy a Szakértő támogatja a kormányt.",
            R`Az Esti Krónika gráfja ($\rho \approx 0{,}67$) sűrűbb, mint a teljes heti gráf ($\rho \approx 0{,}48$), tehát a lap szereplői szorosabban kapcsolódnak.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a szakasz „Mire vigyázz?” dobozára: élszabály, egy cikk = egy klikk, különböző méretű gráfok sűrűsége.",
          explain: R`Az első három a számokból következik: a két háromszög izomorf, de más csúcsokkal; a Vidéki Napló $K_{1,3}$ csillag; egy $k$ szereplős cikk $\binom k2$ élt ad. A Szakértő–Kormány él egy <b>bíráló</b> cikkből jön – az él együttes említés, nem vélemény. A sűrűség pedig függ a mérettől: a 4 csúcsú és a 7 csúcsú gráf sűrűsége nem hasonlítható össze közvetlenül.`
        },
        {
          type: "single", shuffle: true,
          q: "Az egyik lap egyetlen cikket ír, amely 5 szereplőt említ. A másik lap öt cikket ír, mindegyik 2 szereplőt említ, és nincs két egyforma pár. Hány éle van a két lap szereplőgráfjának?",
          options: ["10, illetve 5", "5, illetve 5", "4, illetve 5", "20, illetve 5"],
          answer: 0,
          hint: R`Egy cikk = egy klikk: egy $k$ szereplős cikk minden szereplőpárt összeköt.`,
          explain: R`Az 5 szereplős cikk egy $K_5$-öt ad: $\binom52 = 10$ él. Az öt 2 szereplős cikk 5 különböző élt ad. Egyetlen hosszú cikk tehát kétszer annyi élt hoz, mint öt rövid – az élek egy része a cikkek hosszáról szól, nem a lap szemléletéről (ezért javasolt pl. az $1/(k-1)$-es súlyozás). A 4 a csillag élszáma lenne, a 20 = $5 \cdot 4$ minden élt kétszer számol.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban két sűrű csoport látszik: Kormány–Vízügy–Szakértő–Klímaváltozás, illetve Polgármester–Lakók–Önkéntesek. Melyik szereplő köti össze a kettőt?",
          options: ["Polgármester", "Szakértő", "Klímaváltozás", "Önkéntesek"],
          answer: 0,
          hint: "Keresd azt a szereplőt a második csoportban, akinek az első csoportban is van szomszédja.",
          explain: R`A Polgármester a Kormánnyal és a Vízügygyel is szomszédos (2-es, 3-as, 10-es cikk), és a Lakókkal, az Önkéntesekkel is. A Lakóknak és az Önkénteseknek nincs szomszédja az első csoportban, a Szakértőnek és a Klímaváltozásnak pedig a másodikban. Ezért a nagy erősség (8) mellett a Polgármesternek összekötő szerepe is van – ezt az 5. fejezet centralitásmértékei pontosabban mérik.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh1-final": {
      title: "Fejezetzáró teszt – 1. Mi a hálózat?",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$V = \{a, b, c\}$, és az éleket így sorolták fel: $ab, ba, bc, ac$. Mennyi $m$?`,
          options: ["3", "4", "6", "2"],
          answer: 0,
          hint: "Az él rendezetlen pár, és az élek halmazt alkotnak.",
          explain: R`$ab = ba = \{a, b\}$, ezért ez egyetlen él. A különböző élek: $ab, bc, ac$, tehát $m = 3$ (ez egy háromszög). A 4 a felsorolás hossza, a 6 a fokszámösszeg ($2m$), a 2 pedig az $ab$-t és a $ba$-t is kihagyja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: $ab, bc, cd$. Szomszédos-e $a$ és $c$?`,
          options: [
            R`Nem, de $b$-n át eljuthatunk egyikből a másikba.`,
            R`Igen, mert $b$-n át össze vannak kötve.`,
            "Igen, ha a rajzon egymás mellé kerülnek.",
            "Nem, és egyikből a másikba el sem lehet jutni."
          ],
          answer: 0,
          hint: "Mi a különbség a „szomszédos” és az „elérhető” között?",
          explain: R`Két csúcs akkor szomszédos, ha <b>közvetlenül</b> él köti össze őket; $ac \notin E$. Elérhetők viszont: $a - b - c$ (ezekkel az utakkal a 2. fejezet foglalkozik). A rajz elhelyezése nem információ – két közel rajzolt pont nem feltétlenül szomszédos.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti lapgráfban két lap között akkor legyen él, ha legalább két közös szereplőjük van. Hány éle lesz?",
          options: ["3", "5", "6", "1"],
          answer: 0,
          hint: "RH: Ko, Vi, Po; EK: Vi, Sz, Kl, Ko; NY: La, Ön, Po; VN: Po, Vi, La, Ön. Számold meg mind a 6 lappár közös szereplőit!",
          explain: R`Legalább 2 közös: RH–EK (Ko, Vi), RH–VN (Vi, Po), NY–VN (La, Ön, Po) – 3 él. Az 5 a „legalább egy közös szereplő” szabály élszáma, a 6 a $K_4$, az 1 a „legalább három közös” szabályé (csak NY–VN). Ugyanabból az adatból egyetlen szabályváltoztatással más gráf lesz – ezért kell mindig kimondani az élszabályt.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban nincs él a Kormány és a Lakók között. Mit jelent ez?",
          options: [
            "Ebben a 12 cikkben nem szerepeltek együtt.",
            "A kormány nem foglalkozott a lakókkal az árvíz idején.",
            "A Kormány és a Lakók szemben állnak egymással.",
            "Más héten vagy más lapban sem fogják őket együtt említeni."
          ],
          answer: 0,
          hint: "Az él egy állítás – és a hiányzó él is csak az élszabály alapján értelmezhető. Milyen adatból készült a gráf?",
          explain: R`Az élszabály: „legalább egy cikkben együtt szerepelnek”. A hiányzó él tehát csak annyit mond, hogy a gyűjtött 12 cikkben nem voltak együtt – a megfigyelt adatról szól, nem a világról. Ellentétről sincs szó. Arról pedig, hogy más héten, más lapban vagy egy tévéhíradóban mi lesz, a gráf semmit sem mond – a hiányzó él nem bizonyíték.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik sorozat lehet egy egyszerű gráf fokszámsorozata?",
          options: ["(3, 3, 2, 2, 2)", "(3, 3, 1, 1)", "(4, 4, 4, 1, 1)", "(5, 3, 2, 2, 2)"],
          answer: 0,
          hint: R`A páros összeg szükséges, de nem elég. Nézd meg a legnagyobb fokszámot is: egyszerű gráfban $d(v) \le n - 1$, és a nagy fokú csúcsok „lefoglalják” a többieket.`,
          explain: R`A $(3, 3, 2, 2, 2)$ rajzolható: például egy ötszög egy húrral. A $(3, 3, 1, 1)$ összege páros, de a két 3-as fokú csúcs mindenkivel szomszédos, így az „1-esek” fokszáma legalább 2 lenne. A $(4, 4, 4, 1, 1)$ ugyanígy bukik el: a három 4-es fokú csúcs mind a két utolsóval szomszédos. Az $(5, 3, 2, 2, 2)$-ben 5 csúcsnál az 5-ös fok lehetetlen ($n - 1 = 4$). A páros fokszámösszeg tehát nem garancia.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy gráfnak 15 éle van, és minden csúcsának 3 a fokszáma. Hány csúcsa van?",
          options: ["10", "5", "15", "45"],
          answer: 0,
          hint: R`Kézfogási lemma: $\sum d(v) = 2m$. A bal oldal itt $3n$.`,
          explain: R`$3n = 2 \cdot 15 = 30$, tehát $n = 10$. Az 5 = $15/3$ elfelejti, hogy minden él két fokszámot növel. A 45 = $15 \cdot 3$ az élszámot keveri a csúcsszámmal, a 15 pedig az élszám maga.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 6 csúcsú egyszerű gráf szomszédsági mátrixában az elemek összege 18. Mennyi a gráf sűrűsége?",
          options: [R`$0{,}6$`, R`$0{,}25$`, R`$0{,}5$`, R`$1{,}2$`],
          answer: 0,
          hint: R`Az elemösszeg nem az élszám! Mi a kapcsolat a mátrix elemösszege és $m$ között? Utána: $\rho = m/\binom n2$.`,
          explain: R`Az elemösszeg $2m$, tehát $m = 9$. $\rho = 9/\binom62 = 9/15 = 0{,}6$. Az $1{,}2 = 18/15$ az elemösszeget veszi élszámnak (sűrűség nem is lehet 1-nél nagyobb). A $0{,}25 = 9/36$ ($m/n^2$) és a $0{,}5 = 18/36$ a cellák számával oszt, nem a lehetséges párokéval.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a gráf ábrázolásairól? (Több jó válasz is lehet.)",
          options: [
            "Egy nagy, ritka hálózatot érdemes szomszédsági listában tárolni.",
            "Egyszerű, irányítatlan gráf szomszédsági mátrixában a sorösszeg a fokszám.",
            R`Ha egy mátrixban $A_{23} = 1$, de $A_{32} = 0$, az nem egyszerű, irányítatlan gráf mátrixa.`,
            "A szomszédsági mátrix elemeinek összege az élszám.",
            "Ha átszámozzuk a csúcsokat, a mátrixszal együtt a gráf is megváltozik."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a mátrix három tulajdonságára (szimmetria, főátló, sorösszeg) és a „melyik ábrázolás mikor?” szabályra.",
          explain: R`Ritka, nagy gráfnál a szomszédsági lista csak $2m$ bejegyzést tárol, a mátrix $n^2$ cellát. A sorösszeg a fokszám, és irányítatlan gráf mátrixa szimmetrikus – ha nem az, elírás vagy irányított gráf. Az elemösszeg viszont $2m$, nem $m$. Átszámozáskor a <b>mátrix</b> változik, a gráf (csúcsok és élek) nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban $a$ és $b$ között 2 párhuzamos él fut, $b$-n van egy hurokél, és $b$–$c$ között is van egy él. Mi a fokszámsorozat?`,
          options: ["(5, 2, 1)", "(4, 2, 1)", "(3, 2, 1)", "(2, 1, 1)"],
          answer: 0,
          hint: "Párhuzamos élek külön-külön, a hurokél kétszer számít. Ellenőrizd: a fokszámösszeg legyen az élszám kétszerese!",
          explain: R`$d(b) = 2 + 2 + 1 = 5$ (két párhuzamos él, a hurok 2-vel, a $bc$ él), $d(a) = 2$, $d(c) = 1$. Összeg: $8 = 2 \cdot 4$ ✓. A $(4, 2, 1)$ a hurkot 1-nek számolja – összege páratlan, ez lehetetlen. A $(3, 2, 1)$ kihagyja a hurkot, a $(2, 1, 1)$ pedig egyszerű gráfnak veszi.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét súlyozott szereplőgráfjában mennyi az Önkéntesek fokszáma és erőssége?",
          options: ["fokszám 2, erősség 5", "fokszám 5, erősség 2", "fokszám 2, erősség 4", "fokszám 3, erősség 5"],
          answer: 0,
          hint: "Az Önkéntesek a 7, 8, 9 és 12-es cikkben szerepelnek. Kikkel, és hányszor?",
          explain: R`Szomszédok: Lakók (7, 8, 9: súly 3) és Polgármester (8, 12: súly 2). Fokszám 2, erősség $3 + 2 = 5$. A 4 az Önkéntesek cikkeinek száma – de a 8-as cikk két párt ad nekik. A „5 és 2” felcseréli a fokszámot és az erősséget.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a $K_{1,3}$ csillag komplementere?`,
          options: [
            "egy háromszög és egy izolált csúcs",
            R`$P_4$`,
            R`$K_{1,3}$ (önkomplementer)`,
            "az üres gráf"
          ],
          answer: 0,
          hint: "A középpont minden lehetséges élét felhasználta. Mi a helyzet a három levéllel egymás között?",
          explain: R`A középpont foka 3 = $n - 1$, így a komplementerben 0: izolált csúcs. A három levél egymással nem szomszédos, a komplementerben tehát mind a 3 pár él: háromszög. Ellenőrzés: $3 + 3 = 6 = \binom42$ ✓. Az önkomplementer 4 csúcsú gráf a $P_4$, nem a csillag. Az üres gráf a $K_4$ komplementere lenne.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy csillagnak 9 csúcsa van. Hány éle van, és mi a jelölése?",
          options: [
            R`8 él, $K_{1,8}$`,
            R`9 él, $K_{1,9}$`,
            R`36 él, $K_9$`,
            R`8 él, $K_{1,9}$`
          ],
          answer: 0,
          hint: R`A $K_{1,n}$-ben egy középpont és $n$ levél van; minden levél egy éllel kapcsolódik a középponthoz.`,
          explain: R`9 csúcs = 1 középpont + 8 levél, tehát $K_{1,8}$, és 8 éle van (levelenként egy). A $K_{1,9}$-nek 10 csúcsa lenne – a csillag csúcsszáma $n + 1$, nem $n$. A 36 = $\binom92$ a teljes gráf élszáma.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti lapgráfban (él, ha a két lapnak van közös szereplője) melyik lappár között NINCS él?",
          options: ["Esti Krónika – Nyitott Szó", "Reggeli Hírlap – Nyitott Szó", "Esti Krónika – Vidéki Napló", "Reggeli Hírlap – Vidéki Napló"],
          answer: 0,
          hint: "Az Esti Krónika szereplői: Vízügy, Szakértő, Klímaváltozás, Kormány. A Nyitott Szóéi: Lakók, Önkéntesek, Polgármester.",
          explain: R`Az Esti Krónika és a Nyitott Szó szereplőhalmaza diszjunkt – ez az egyetlen hiányzó él, a lapgráfnak $6 - 1 = 5$ éle van. RH–NY a Polgármester, EK–VN a Vízügy, RH–VN a Vízügy és a Polgármester révén össze van kötve. Ez a két lap a két szélső tudósítási minta: a szakértői magyarázat és az érintettek nézőpontja.`
        },
        {
          type: "single", shuffle: true,
          q: "A 2, 5, 8 és 10-es cikkből épített szereplőgráfnak 9 éle van, a teljes heti szereplőgráfnak 10. Melyik él hiányzik a négycikkesből?",
          options: ["Vízügy – Szakértő", "Kormány – Lakók", "Polgármester – Szakértő", "Klímaváltozás – Vízügy"],
          answer: 0,
          hint: "Melyik él jön olyan cikkből, amely nincs a 2, 5, 8, 10 között? A Kormány–Lakók párt egyik cikk sem említi együtt.",
          explain: R`A Vízügy–Szakértő él csak a 4-es cikkből (Esti Krónika, hétfő) jön. A többi teljes heti él már a négy cikkben megvan, mert a többi cikk csak ismétel egy-egy párt (ezek a súlyt növelik, az élszámot nem). A Kormány–Lakók, a Polgármester–Szakértő és a Klímaváltozás–Vízügy pár a teljes héten sem él – ezek a komplementerben vannak.`
        }
      ]
    },
