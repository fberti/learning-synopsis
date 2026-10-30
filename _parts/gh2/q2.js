    /* ------------------------------------------------ 2.5 */
    "gh2-25": {
      title: "Kvíz – 2.5 Fák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy erdő 3 fából áll, és összesen 20 csúcsa van. Hány éle van?",
          options: ["17", "19", "23", "16"],
          answer: 0,
          hint: "Minden fa eggyel kevesebb élt tartalmaz, mint ahány csúcsa van. Hány fa van?",
          explain: R`Fánként $n_i - 1$ él, összesen $(n_1 + n_2 + n_3) - 3 = 20 - 3 = 17$. Az erdő élszáma $n - c$. A 19 az $n - 1$: ez csak egyetlen fára (összefüggő erdőre) igaz. A 23 az $n + c$ (rossz előjel), a 16 pedig az $n - c - 1$ (még egyszer levonva az egyet).`
        },
        {
          type: "multi",
          q: "Egy 7 csúcsú gráfról tudjuk az alábbiak egyikét. Melyik esetben biztos, hogy fa? (Több jó válasz is lehet.)",
          options: [
            "összefüggő, és 6 éle van",
            "körmentes, és 6 éle van",
            "6 éle van",
            "bármely két csúcsa között pontosan egy út vezet",
            "összefüggő, és van levele"
          ],
          answer: [0, 1, 3],
          hint: "A fa egyenértékű jellemzései közül az élszám mindig egy másik tulajdonsággal párban szerepel.",
          explain: R`Az $n - 1$ él önmagában nem elég: egy $K_4$ (6 él) + három izolált csúcs is 7 csúcsú és 6 élű, de nem fa (a szakasz negyedik kiinduló gráfja ugyanilyen ellenpélda). Az $n - 1 = 6$ él <b>összefüggéssel</b> vagy <b>körmentességgel</b> együtt már fát jelent, és a „pontosan egy út” is a fa egyik jellemzése. Levele sok nem fa gráfnak is van (pl. egy háromszög egy lelógó éllel).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy fában 3 csúcs fokszáma 4, a többi csúcs levél. Hány levél van?",
          options: ["8", "12", "9", "6"],
          answer: 0,
          hint: R`Legyen $\ell$ a levelek száma. Írd fel a csúcsok és az élek számát $\ell$-lel, és használd a kézfogási lemmát!`,
          explain: R`$n = 3 + \ell$, $m = n - 1 = 2 + \ell$. A fokszámok összege $3 \cdot 4 + \ell = 2m = 4 + 2\ell$, ebből $\ell = 8$. A 12 azt feltételezi, hogy a 4-es fokú csúcsok minden éle levélhez megy – de a három nagy fokú csúcsot is össze kell kötni (2 él, 4 „élvég”). A 9 a $3 \cdot 3$: mintha csúcsonként csak egy élt használnánk az összekötésre.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kruskal-algoritmussal keresünk minimális feszítőfát. Élek: $ab = 1$, $bc = 3$, $ac = 2$, $cd = 2$, $bd = 5$, $de = 4$, $ce = 6$. Mennyi a feszítőfa összhossza?`,
          options: ["9", "8", "10", "17"],
          answer: 0,
          hint: "Rendezd az éleket növekvő sorrendbe, és mindegyiknél nézd meg: kört zárna-e a már bevettekkel?",
          explain: R`Sorrend: $ab$ (1) ✓, $ac$ (2) ✓, $cd$ (2) ✓, $bc$ (3) ✗ – kört zárna ($a, b, c$), $de$ (4) ✓. Megvan a 4 él: $1 + 2 + 2 + 4 = 9$. A 8 a négy legkisebb él összege – de abban a $bc$ kört zár, és az $e$ kimarad, tehát nem feszítőfa. A 10 a $bc$-t veszi az $ac$ helyett (nem rendezett sorrend). A 17 a <em>maximális</em> feszítőfa.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfja 7 csúcsú és 10 élű, összefüggő. Hány élt kell elhagyni belőle, hogy feszítőfát kapjunk?`,
          options: ["4", "6", "3", "7"],
          answer: 0,
          hint: "Hány éle van egy 7 csúcsú fának? És hány éle van most?",
          explain: R`A feszítőfának $n - 1 = 6$ éle van, tehát $m - n + 1 = 10 - 7 + 1 = 4$ élt hagyunk el (ez a ciklomatikus szám). A 6 a <em>megmaradó</em> élek száma, a 3 az $m - n$ (a $+1$ lemaradt), a 7 pedig a csúcsok száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 2.4 településeinek minimális feszítőfája 121 km (Sze–Hmv, Hmv–Mak, Sze–Kis, Kis–Csg). Melyik állítás igaz?`,
          options: [
            "A fában Szegedről Csongrádra 66 km az út, pedig a gráfban a távolságuk 62 km.",
            "A fában minden két település távolsága ugyanaz, mint az eredeti gráfban.",
            "A minimális feszítőfa a Szegedről induló Dijkstra-algoritmus legrövidebb utaiból áll.",
            "A fában Szegedről Csongrádra 62 km az út, a Hódmezővásárhelyen át."
          ],
          answer: 0,
          hint: "Szerepel-e a Hmv–Csg él a feszítőfában? Ha nem, merre kell menni Szegedről Csongrádra?",
          explain: R`A Hmv–Csg (37) kimaradt a fából, így Csongrádra csak Kisteleken át lehet eljutni: $30 + 36 = 66$ km. A gráfban viszont 62 km (Sze → Hmv → Csg). A feszítőfa az <b>összhosszt</b> minimalizálja, nem az egyes távolságokat – a feszítőfa nem a legrövidebb utak fája.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmakat a leírásukkal!",
          pairs: [
            ["levél", "1 fokú csúcs"],
            ["egy csúcs mélysége a gyökeres fában", "a gyökértől mért távolsága"],
            ["szülő", "a gyökér felé eső szomszéd"],
            ["BFS-fa", "a gyökértől mért távolságok ugyanazok, mint a gráfban"],
            [R`ciklomatikus szám ($m - n + c$)`, "ennyi élt hagyunk el, hogy erdőt kapjunk"]
          ],
          hint: "A gyökeres fában minden csúcsnak (a gyökéren kívül) egy szülője van; a BFS-fa szülője az, ahonnan először elértük.",
          explain: R`A levél 1 fokú csúcs; a mélység a gyökértől mért távolság; a szülő a gyökér felé eső szomszéd, a többi szomszéd gyerek. A BFS-fa a bejárás „ki kit ért el először” fája, ezért benne a gyökértől mért távolságok ugyanazok, mint az eredeti gráfban (más csúcspárok távolsága viszont nőhet). A ciklomatikus szám $m - n + c$: ennyi élt kell elhagyni, hogy a gráfból komponensenként feszítőfa, vagyis erdő maradjon.`
        }
      ]
    },

    /* ------------------------------------------------ 2.6 */
    "gh2-26": {
      title: "Kvíz – 2.6 Euler és Hamilton",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $BC$, $CD$, $DA$, $AC$. Bejárható-e minden él pontosan egyszer?`,
          options: [
            R`Igen, nyitott Euler-vonallal, amely $A$-ból $C$-be (vagy fordítva) megy.`,
            "Igen, zárt Euler-vonallal.",
            "Nem, mert van páratlan fokú csúcs.",
            R`Igen, nyitott Euler-vonallal, amely $B$-ből $D$-be megy.`
          ],
          answer: 0,
          hint: "Írd fel a fokszámokat, és számold meg a páratlanokat!",
          explain: R`Fokszámok: $A$ 3, $B$ 2, $C$ 3, $D$ 2; a gráf összefüggő. Pontosan két páratlan fokú csúcs van, tehát van nyitott Euler-vonal, és az a két páratlan fokú csúcs között fut, pl. $A, B, C, D, A, C$. Zárt vonalhoz minden fokszámnak párosnak kellene lennie. A „van páratlan fokú, tehát nincs” túl szigorú: kettő megengedett. A $B$ és a $D$ páros fokú, nem lehetnek végpontok.`
        },
        {
          type: "multi",
          q: "Melyik gráfban van zárt Euler-vonal? (Több jó válasz is lehet.)",
          options: [
            R`$K_5$`,
            R`$K_4$`,
            R`$C_6$`,
            R`$P_5$ (5 csúcsú út)`,
            "két különálló háromszög"
          ],
          answer: [0, 2],
          hint: "Két feltétel kell: minden fokszám páros, és a gráf összefüggő.",
          explain: R`$K_5$: minden fokszám 4, összefüggő → van. $C_6$: minden fokszám 2 → maga a kör a zárt Euler-vonal. $K_4$: négy 3-as fokú csúcs → semmilyen Euler-vonal nincs. $P_5$: a két végpont 1 fokú → csak nyitott van. Két különálló háromszögben minden fokszám páros, de a gráf nem összefüggő, így nem lehet átjutni az egyikből a másikba.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy összefüggő gráfban 4 páratlan fokú csúcs van. Legkevesebb hány új élt kell hozzáadni (párhuzamos él is lehet), hogy legyen zárt Euler-vonala?",
          options: ["2", "1", "4", "3"],
          answer: 0,
          hint: "Egy új él hány csúcs fokszámát változtatja meg, és mennyivel?",
          explain: R`Minden új él két csúcs fokszámát növeli eggyel, így két páratlan fokú csúcsot tesz párossá. 4 páratlan fokú csúcshoz $4/2 = 2$ él kell. Egyetlen él után még 2 páratlan fokú csúcs marad: az <em>nyitott</em> Euler-vonalhoz elég, zárthoz nem. A 4 azt feltételezi, hogy egy él csak egy csúcson segít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában a fokszámok: $\mathrm{Ko}$ 4, $\mathrm{Po}$ 4, $\mathrm{Vi}$ 3, $\mathrm{Sz}$ 3, $\mathrm{Kl}$ 2, $\mathrm{La}$ 2, $\text{Ön}$ 2. Melyik állítás igaz?`,
          options: [
            R`Van nyitott Euler-vonal a $\mathrm{Vi}$ és az $\mathrm{Sz}$ között; ez a $\mathrm{Po}$-t többször is érintheti.`,
            R`Nincs Euler-vonal, mert a $\mathrm{Po}$-n többször át kellene haladni.`,
            "Van zárt Euler-vonal, mert a fokszámok összege (20) páros.",
            R`Van nyitott Euler-vonal, amely a $\mathrm{Ko}$-ból indul, mert annak a legnagyobb a fokszáma.`
          ],
          answer: 0,
          hint: "Az Euler-vonal mit nem ismételhet: csúcsot vagy élt?",
          explain: R`Két páratlan fokú csúcs van ($\mathrm{Vi}$, $\mathrm{Sz}$), a gráf összefüggő → nyitott Euler-vonal $\mathrm{Vi}$-ből $\mathrm{Sz}$-be, pl. $\mathrm{Vi}, \mathrm{Ko}, \mathrm{Po}, \mathrm{La}, \text{Ön}, \mathrm{Po}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Ko}, \mathrm{Kl}, \mathrm{Sz}$. Az Euler-vonal csak az <b>éleket</b> nem ismétli, csúcsot szabad (itt a $\mathrm{Po}$-t és a $\mathrm{Ko}$-t kétszer is érinti). A fokszámok összege minden gráfban páros (kézfogási lemma), ebből semmi sem következik. A vonal végpontjai a páratlan fokú csúcsok, nem a legnagyobb fokúak.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy riporter sorra hívná az Árvízhét mind a 7 szereplőjét a gráf élei mentén, mindenkit egyszer, és a végén visszatérne az elsőhöz. Miért lehetetlen?",
          options: [
            R`Mert a $\mathrm{Po}$ elvágó csúcs: a $\{\mathrm{La}, \text{Ön}\}$ párba be is kellene lépni, ki is kellene jönni, és mindkettő csak a $\mathrm{Po}$-n át megy.`,
            "Mert nem teljesül a Dirac-feltétel (van 2 fokú csúcs, pedig n/2 = 3,5).",
            "Mert két páratlan fokú csúcs van.",
            "Mert a gráfnak nincs Euler-vonala."
          ],
          answer: 0,
          hint: "Ez Hamilton-kör kérdés. Melyik csúcs köti a Lakókat és az Önkénteseket a többiekhez?",
          explain: R`A körnek el kellene érnie a $\{\mathrm{La}, \text{Ön}\}$ párt és el is kellene hagynia: ez két áthaladás a Polgármesteren, pedig minden csúcson csak egyszer mehetünk át. Elvágó csúcsot tartalmazó gráfban nincs Hamilton-kör. A Dirac-tétel csak <b>elégséges</b> feltétel: ha nem teljesül, abból semmi nem következik. A páratlan fokszámok és az Euler-vonal az élek bejárásáról szólnak, nem a csúcsokéról (és Euler-vonal itt van is).`
        },
        {
          type: "single", shuffle: true,
          q: R`A $C_6$ körre nem teljesül a Dirac-feltétel (a fokszámok 2-esek, $n/2 = 3$). Mit következtethetünk ebből?`,
          options: [
            R`Semmit: a Dirac-tétel csak elégséges feltétel. A $C_6$-nak egyébként van Hamilton-köre (önmaga).`,
            R`A $C_6$-ban nincs Hamilton-kör.`,
            R`A $C_6$-ban Hamilton-út van, de Hamilton-kör nincs.`,
            R`A $C_6$-ban nincs zárt Euler-vonal.`
          ],
          answer: 0,
          hint: "A Dirac-tétel így szól: ha minden fokszám legalább n/2, akkor van Hamilton-kör. Mit mond, ha a feltétel nem teljesül?",
          explain: R`A Dirac-tétel egy „ha…, akkor van” állítás. Ha a feltétel nem teljesül, a tétel hallgat: lehet Hamilton-kör, lehet, hogy nincs. A $C_6$ maga egy Hamilton-kör, tehát a „nincs Hamilton-kör” rossz következtetés. Zárt Euler-vonala is van (minden fokszám páros) – ez egyébként sem a Dirac-tételből jönne.`
        },
        {
          type: "match",
          q: "Melyik fogalomhoz illik a leírás? Párosítsd!",
          pairs: [
            ["minden élen pontosan egyszer megy át", "Euler-vonal"],
            ["minden csúcsot pontosan egyszer érint, és visszatér a kiindulópontba", "Hamilton-kör"],
            ["minden csúcsot pontosan egyszer érint, de nem tér vissza", "Hamilton-út"],
            ["a fokszámokból gyorsan eldönthető, hogy létezik-e", "Euler-vonal"],
            ["nagy gráfon nehéz eldönteni, hogy létezik-e (NP-teljes)", "Hamilton-kör"]
          ],
          hint: "Euler: élek; Hamilton: csúcsok. Melyikre van egyszerű fokszámszabály?",
          explain: R`Az Euler-vonal az éleket járja be egyszer, és a létezése a páratlan fokú csúcsok számából (0 vagy 2) és az összefüggésből gyorsan eldönthető. A Hamilton-út és a Hamilton-kör a csúcsokat érinti egyszer; a kör visszatér, az út nem. A Hamilton-körre nincs egyszerű szükséges és elégséges feltétel: a probléma NP-teljes.`
        }
      ]
    },

    /* ------------------------------------------------ 2.7 */
    "gh2-27": {
      title: "Kvíz – 2.7 Séták száma és a mátrixhatványok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$, $BD$. Mennyi $(A^2)_{CD}$?`,
          options: ["2", "0", "1", "4"],
          answer: 0,
          hint: "A kétlépéses séták száma a közös szomszédok száma. Kik a C és a D szomszédai?",
          explain: R`$C$ szomszédai: $A, B$; $D$ szomszédai: $A, B$. Két közös szomszéd → két kétlépéses séta: $C, A, D$ és $C, B, D$, tehát $(A^2)_{CD} = 2$. A 0 abból a tévedésből jön, hogy „$C$ és $D$ nem szomszédos” – de az $A^2$ nem a szomszédságot, hanem a <b>kétlépéses</b> sétákat számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában a Polgármester fokszáma 4. Mennyi $(A^2)_{\mathrm{Po},\mathrm{Po}}$?`,
          options: ["4", "16", "8", "0"],
          answer: 0,
          hint: "Hányféleképpen lehet két lépésben visszajutni egy csúcsba egyszerű gráfban?",
          explain: R`$(A^2)_{ii} = d(i)$: két lépésben önmagába annyiféleképpen juthatunk, ahány szomszédja van (oda, és ugyanazon az élen vissza). Tehát $(A^2)_{\mathrm{Po},\mathrm{Po}} = 4$. A 16 a fokszám négyzete (mintha az elemeket négyzetre emelnénk), a 0 azt hiszi, hogy hurokél nélkül nincs zárt séta.`
        },
        {
          type: "single", shuffle: true,
          q: R`A barátsággráfban ($AB$, $AC$, $BC$, $CD$) $(A^3)_{AC} = 4$. Mit jelent ez?`,
          options: [
            R`Az $A$-ból $C$-be 4 darab 3 hosszú séta vezet.`,
            R`Az $A$-ból $C$-be 4 darab 3 hosszú út vezet.`,
            R`$\operatorname{dist}(A, C) = 3$.`,
            R`$A$-nak és $C$-nek 4 közös szomszédja van.`
          ],
          answer: 0,
          hint: "Az A-ból C-be vezető 3 hosszú lépéssorozatok ismételhetnek-e csúcsot?",
          explain: R`$(A^k)_{ij}$ a $k$ hosszú <b>séták</b> száma: $A, B, A, C$ · $A, C, A, C$ · $A, C, B, C$ · $A, C, D, C$ – mind ismétel csúcsot. 3 hosszú <b>út</b> $A$-ból $C$-be nincs is. A távolság 1 (szomszédok), a közös szomszédokat pedig az $A^2$ számolja (itt 1: a $B$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban $\operatorname{tr}(A^3) = 18$. Hány háromszög van benne?`,
          options: ["3", "6", "9", "18"],
          answer: 0,
          hint: "Hányszor számol meg egy háromszöget a főátló összege? Gondolj a csúcsokra és az irányokra!",
          explain: R`Minden háromszöget mindhárom csúcsánál, és ott két irányban is megszámolunk: $3 \cdot 2 = 6$-szor. Így $18 / 6 = 3$ háromszög van. A 6 a $/3$ (az irányok elfelejtése), a 9 a $/2$ (a csúcsok elfelejtése), a 18 pedig az osztás teljes kihagyása.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két különböző csúcsra $A_{ij} = 0$, $(A^2)_{ij} = 0$, de $(A^3)_{ij} = 2$. Mennyi $\operatorname{dist}(i, j)$?`,
          options: ["3", "2", "1", "végtelen"],
          answer: 0,
          hint: "Melyik az első hatvány, amelyben már nem 0 áll?",
          explain: R`A távolság a legkisebb $k$, amelyre $(A^k)_{ij} > 0$. Az 1 és 2 hosszú séták száma 0, a 3 hosszúaké már nem: $\operatorname{dist}(i, j) = 3$. A 2 az $(A^3)_{ij}$ <em>értéke</em> – ez a 3 hosszú séták (itt egyben a legrövidebb utak) száma, nem a távolság. Végtelen akkor lenne, ha minden hatványban 0 állna.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az Árvízhéten $(A^2)_{\mathrm{Ko},\mathrm{La}} = 1$, mert egy közös szomszédjuk van (a Polgármester).`,
            R`$(A^3)_{ii}$ az $i$-t tartalmazó háromszögek számának kétszerese.`,
            R`$(A^k)_{ij}$ az $i$-ből $j$-be vezető $k$ hosszú utak száma.`,
            R`Az $A^2$-t úgy kapjuk, hogy $A$ minden elemét négyzetre emeljük.`,
            R`Az Árvízhéten $(A^2)_{\mathrm{Ko},\mathrm{Vi}} = 2$, a közös szomszédok a $\mathrm{Po}$ és az $\mathrm{Sz}$.`
          ],
          answer: [0, 1, 4],
          hint: "Séta vagy út? Mátrixszorzat vagy elemenkénti művelet?",
          explain: R`A $\mathrm{Ko}$ és a $\mathrm{La}$ egyetlen közös szomszédja a $\mathrm{Po}$, a $\mathrm{Ko}$ és a $\mathrm{Vi}$ közösei a $\mathrm{Po}$ és az $\mathrm{Sz}$ – ezek helyesek. Egy háromszöget az $i$-ből két irányban lehet körbejárni, ezért $(A^3)_{ii}$ a háromszögek kétszerese. A mátrixhatvány <b>sétákat</b> számol (oda-vissza lépésekkel együtt), nem utakat. Az $A^2$ mátrixszorzat; az elemenkénti négyzet egy 0–1 mátrixnál maga az $A$ lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten $(A^2)_{\mathrm{Ko},\mathrm{La}} = 1$ és $(A^2)_{\mathrm{Sz},\mathrm{La}} = 0$. Egyik pár sincs összekötve. Melyikük a jobb jelölt arra, hogy a jövő héten együtt szerepeljen egy cikkben?`,
          options: [
            R`A $\mathrm{Ko}$–$\mathrm{La}$ pár: van közös szomszédjuk.`,
            R`Az $\mathrm{Sz}$–$\mathrm{La}$ pár: a 0 azt jelenti, hogy a legközelebb vannak.`,
            "Egyformán jók: egyik pár sincs összekötve.",
            R`Az $\mathrm{Sz}$–$\mathrm{La}$ pár: a távolabbi párok közé hamarabb kerül új él.`
          ],
          answer: 0,
          hint: "A kapcsolat-előrejelzés legegyszerűbb módszere a közös szomszédokat számolja.",
          explain: R`A sok közös szomszéddal rendelkező, de még nem összekötött párok a jó jelöltek új élre. A $\mathrm{Ko}$ és a $\mathrm{La}$ a Polgármesteren át „közel” van, az $\mathrm{Sz}$ és a $\mathrm{La}$ között nincs kétlépéses séta (távolságuk 3). Az $(A^2)_{ij} = 0$ nem közelséget jelent, hanem azt, hogy nincs közös szomszéd.`
        }
      ]
    },

    /* ------------------------------------------------ 2.8 */
    "gh2-28": {
      title: "Kvíz – 2.8 Alkalmazás: utak és távolságok az Árvízhéten",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét átmérője 3. Melyik szereplőpár távolsága ennyi?",
          options: [
            "Szakértő és Önkéntesek",
            "Klímaváltozás és Vízügy",
            "Kormány és Lakók",
            "Szakértő és Polgármester"
          ],
          answer: 0,
          hint: "Az átmérő a „magyarázó keret” és az „érintettek” között jön ki. Melyik pár tartozik egy-egy ilyen csoportba?",
          explain: R`$\operatorname{dist}(\mathrm{Sz}, \text{Ön}) = 3$, pl. $\mathrm{Sz}, \mathrm{Ko}, \mathrm{Po}, \text{Ön}$. Ugyanennyi a $\mathrm{Kl}$–$\mathrm{La}$, $\mathrm{Kl}$–$\text{Ön}$, $\mathrm{Sz}$–$\mathrm{La}$ távolság. A többi pár 2 lépésre van: $\mathrm{Kl}, \mathrm{Sz}, \mathrm{Vi}$ · $\mathrm{Ko}, \mathrm{Po}, \mathrm{La}$ · $\mathrm{Sz}, \mathrm{Vi}, \mathrm{Po}$. A távolság az élek száma: az $\mathrm{Sz}, \mathrm{Ko}, \mathrm{Po}, \text{Ön}$ út 4 csúcsú, de 3 hosszú.`
        },
        {
          type: "match",
          q: "Mi történik a hálózattal, ha az adott szereplő egyik cikkben sem szerepel? Párosítsd!",
          pairs: [
            ["Polgármester", "két komponensre esik"],
            ["Kormány", "egyben marad, az átmérő 4-re nő"],
            ["Vízügy", "egyben marad, átmérő 3, átlagos úthossz 1,80"],
            ["Lakók", "egyben marad, átmérő 3, átlagos úthossz 1,60"]
          ],
          hint: "Melyik csúcs elvágó? A többinél gondold végig, kinek a kiesése nyújtja meg a leghosszabb utakat.",
          explain: R`A Polgármester elvágó csúcs: nélküle $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ és $\{\mathrm{La}, \text{Ön}\}$ marad. A Kormány nélkül minden egyben marad, de a $\mathrm{Kl}$ már csak 4 lépésben éri el a $\mathrm{La}$-t ($\mathrm{Kl}, \mathrm{Sz}, \mathrm{Vi}, \mathrm{Po}, \mathrm{La}$), az átlagos úthossz kb. $2{,}07$. A Vízügy nélkül az átmérő 3 marad, az átlag $1{,}80$-ra nő. A Lakók kiesése az átlagot $1{,}60$-ra csökkenti – kevesebb messzi pár marad.`
        },
        {
          type: "single", shuffle: true,
          q: "A Kormány és a Polgármester fokszáma egyaránt 4. Melyik állítás igaz?",
          options: [
            "Csak a Polgármester elvágó csúcs; a Kormány kiesése nem bontja szét a hálózatot, de megnöveli a távolságokat.",
            "Mindketten elvágó csúcsok, hiszen ők a legnagyobb fokszámúak.",
            "Egyikük sem elvágó csúcs, mert az Árvízhét gráfjában nincs híd.",
            "Csak a Kormány elvágó csúcs, mert nélküle nő az átmérő."
          ],
          answer: 0,
          hint: "Az elvágás a szerkezeten múlik, nem a fokszámon. Mi marad, ha az egyiket, illetve a másikat elhagyod?",
          explain: R`A Polgármester nélkül a hálózat két darabra esik, a Kormány nélkül egyben marad (csak az átmérő nő 4-re). Ugyanaz a fokszám, két különböző szerep: az „összetartó” és a „rövidítő”. Az elvágó csúcs nem a legnagyobb fokszámú csúcs; és elvágó csúcs akkor is lehet, ha híd nincs. Az átmérő növekedése nem elvágás: elvágásnál a távolság végtelen lesz.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik két lap cikkei együtt kötik össze mind a 7 szereplőt?",
          options: [
            "Esti Krónika + Vidéki Napló",
            "Reggeli Hírlap + Esti Krónika",
            "Reggeli Hírlap + Nyitott Szó",
            "Esti Krónika + Nyitott Szó"
          ],
          answer: 0,
          hint: "A Szakértő és a Klímaváltozás csak az egyik lapban szerepel; a Lakók és az Önkéntesek a Polgármesteren át kapcsolódnak.",
          explain: R`Az Esti Krónika hozza a $\mathrm{Sz}$-t és a $\mathrm{Kl}$-t (és a $\mathrm{Vi}$-t, a $\mathrm{Ko}$-t), a Vidéki Napló a $\mathrm{Po}$-t köti a $\mathrm{Vi}$-hez, a $\mathrm{La}$-hoz és az $\text{Ön}$-höz – így mind a 7 egy komponens, átmérő 4. RH + EK-ból a $\mathrm{La}$ és az $\text{Ön}$ hiányzik (3 komponens), RH + NY-ból az $\mathrm{Sz}$ és a $\mathrm{Kl}$ (3 komponens), EK + NY pedig két darab, mert nincs közös szereplőjük.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a gráf átmérője, ha csak a Reggeli Hírlap és a Nyitott Szó cikkeit vesszük (mind a 7 szereplő csúcs)?",
          options: [
            "végtelen, mert a gráf nem összefüggő",
            "2, a legnagyobb távolság a gráfban",
            "1",
            "3, mint a teljes gráfban"
          ],
          answer: 0,
          hint: "Szerepel-e ebben a két lapban a Szakértő és a Klímaváltozás?",
          explain: R`Az $\mathrm{Sz}$ és a $\mathrm{Kl}$ izolált csúcs, így van $\infty$ távolság, és az átmérő végtelen. A 2 a <em>legnagyobb komponens</em> ($\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}, \mathrm{La}, \text{Ön}\}$) átmérője – a programok gyakran csendben ezt adják, ezért mindig írd oda, melyik komponensre vonatkozik a szám.`
        },
        {
          type: "multi",
          q: "Melyik értelmezés helyes az Árvízhét elemzése alapján? (Több jó válasz is lehet.)",
          options: [
            R`A $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Po}, \mathrm{La}$ út csak azt mutatja, hogy az együttes említések láncán így kapcsolódnak.`,
            "Egyetlen lap olvasója sem látja az összefüggő teljes képet.",
            "A 3 lépéses átmérő bizonyítja, hogy a hírhálózatok „kisvilágok”.",
            R`A $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Po}, \mathrm{La}$ út azt jelenti, hogy a klímaváltozásról szóló hír eljutott a lakókhoz.`,
            "Ha a Polgármester nem szerepelne, a lapok biztosan ugyanígy írnának, csak nélküle."
          ],
          answer: [0, 1],
          hint: "Mit ábrázol egy él: hírterjedést vagy együttes említést? És mennyit mond egy 7 csúcsú gráf?",
          explain: R`Az út nem hírfolyam: csak az együttes említések láncát mutatja. Egyetlen lapból a gráf 4–5 komponensre esik. Egy 7 csúcsú gráfban a kis átmérő nem meglepő, semmit sem bizonyít a „hat lépésről”. Az eltávolítási kísérlet a szerkezetről szól: a valóságban a lapok talán másokat említenének.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh2-final": {
      title: "Fejezetzáró teszt – 2. Séták, utak, összefüggőség és fák",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 2.1 gráfjában ($AB, AC, BC, BD, CD, DE, EF$) milyen az $A, B, C, D, B$ lépéssorozat, és mennyi a hossza?`,
          options: [
            "vonal, de nem út; hossza 4",
            "út; hossza 5",
            "séta, de nem vonal; hossza 4",
            "vonal, de nem út; hossza 5"
          ],
          answer: 0,
          hint: "Nézd meg külön: ismétlődik-e él, ismétlődik-e csúcs? A hosszt élekben mérjük.",
          explain: R`Az élek $AB, BC, CD, DB$ mind különbözők, tehát vonal; a $B$ csúcs kétszer szerepel, tehát nem út. A hossz a lépések száma: 4 (5 csúcs, de 4 él). „Nincs ismétlődő él, tehát út” – ez a tipikus hiba: az úthoz a csúcs sem ismétlődhet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány kör van a 2.1 gráfjában ($AB, AC, BC, BD, CD, DE, EF$)? (A más kezdőpontú vagy fordított irányú bejárás ugyanaz a kör.)`,
          options: ["3", "2", "6", "4"],
          answer: 0,
          hint: "Keresd a háromszögeket, aztán a hosszabb köröket! A D–E–F rész tartalmazhat-e kört?",
          explain: R`$A, B, C, A$ · $B, C, D, B$ · $A, B, D, C, A$ – három kör. A 2 csak a két háromszöget számolja (vagy a ciklomatikus számmal, $7 - 6 + 1 = 2$ független körrel keveri össze), a 6 mindegyiket két irányban is megszámolja. A $D, E, F$ rész körmentes.`
        },
        {
          type: "single", shuffle: true,
          q: R`$V = \{1, \dots, 8\}$, $E = \{12, 23, 31, 45, 67\}$. Hány komponense van a gráfnak?`,
          options: ["4", "3", "5", "8"],
          answer: 0,
          hint: "Ne felejtsd el azt a csúcsot, amelyik egyetlen élben sem szerepel!",
          explain: R`$\{1, 2, 3\}$, $\{4, 5\}$, $\{6, 7\}$ és az izolált $\{8\}$: 4 komponens. A 3 a 8-as csúcsot hagyja ki – de az izolált csúcs egymagában is komponens. (A $c \ge n - m = 3$ csak alsó korlát; itt a háromszög egy éle „fölösleges”.)`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Egy él pontosan akkor híd, ha nincs rajta egyetlen körön sem.",
            "Az Árvízhét gráfjában van elvágó csúcs, de nincs híd.",
            "Az elvágó csúcs mindig a legnagyobb fokszámú csúcs.",
            "Egy összefüggő, 8 csúcsú, 7 élű gráfban mindegyik él híd.",
            "Ha egy gráfnak van elvágó csúcsa, akkor hídja is van."
          ],
          answer: [0, 1, 3],
          hint: "Egy összefüggő, n csúcsú, n − 1 élű gráf milyen gráf? És mit tudsz az Árvízhét háromszögeiről?",
          explain: R`Az első a szakasz tétele. Az Árvízhéten a $\mathrm{Po}$ elvágó, de minden él rajta van egy háromszögön, így híd nincs – ez cáfolja az ötödiket is. Az összefüggő, $n - 1$ élű gráf fa, és a fában minden él híd. A Kormány fokszáma ugyanannyi (4), mint a Polgármesteré, mégsem elvágó: az elvágás a szerkezeten múlik.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 2.1 gráfjában ($AB, AC, BC, BD, CD, DE, EF$) mennyi a sugár, és mi a központ?`,
          options: [
            R`sugár 2, központ $\{D\}$`,
            R`sugár 4, központ $\{A, F\}$`,
            R`sugár 2, központ $\{B, C, D, E\}$`,
            R`sugár 3, központ $\{B, C, E\}$`
          ],
          answer: 0,
          hint: "Számold ki minden csúcs excentricitását (a tőle legtávolabbi csúcs távolságát)!",
          explain: R`Excentricitások: $A$ 4, $B$ 3, $C$ 3, $D$ 2, $E$ 3, $F$ 4. A sugár a legkisebb excentricitás (2), a központ az ezt elérő csúcsok halmaza: $\{D\}$. A 4 az átmérő, az $A$ és az $F$ a „legszélső” csúcsok – az átmérő és a sugár felcserélése.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $K_{1,4}$ csillag (1 középpont, 4 levél) átlagos úthossza $\bar\ell$?`,
          options: ["1,6", "2", "1,5", "3,2"],
          answer: 0,
          hint: "Hány csúcspár van, és ezek közül hány van 1, illetve 2 távolságra?",
          explain: R`$\binom52 = 10$ pár: a középpont és a levelek közt 4 darab 1-es, a levelek között $\binom42 = 6$ darab 2-es távolság. Összeg $4 + 12 = 16$, átlag $16/10 = 1{,}6$. A 2 az átmérő (legrosszabb eset, nem a tipikus), az 1,5 a $K_{1,3}$ átlaga, a 3,2 pedig a pároknak csak a felével oszt ($16/5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek (hosszal): $sa = 4$, $sb = 1$, $ba = 2$, $at = 1$, $bt = 5$. Mennyi a súlyozott távolság $s$ és $t$ között?`,
          options: ["4", "5", "6", "3"],
          answer: 0,
          hint: R`Dijkstra: a legkisebb ideiglenes címkéjű csúcs válik véglegessé. Az $a$ címkéje változhat-e, miután először kapott értéket?`,
          explain: R`Dijkstra $s$-ből: $b$ 1 (végleges), ekkor $a$ címkéje $4$-ről $1 + 2 = 3$-ra, $t$-é $6$-ra frissül; $a$ 3 (végleges), $t$ $3 + 1 = 4$. Az út $s, b, a, t$, hossza 4. Az 5 a legkevesebb élű út ($s, a, t$) – vagy az, amit az $a$ 4-es címkéjének első frissítéskor való véglegesítésével kapnánk. A 6 az $s, b, t$ út, a 3 az $a$ távolsága.`
        },
        {
          type: "single", shuffle: true,
          q: R`$A$ és $C$ 1 cikkben szerepel együtt, $A$ és $B$ 3-ban, $B$ és $C$ 3-ban. A súly erősség. Melyik a „legrövidebb” út $A$-ból $C$-be az $\ell = 1/w$ hosszakkal?`,
          options: [
            R`$A, B, C$, hossza $1/3 + 1/3 \approx 0{,}67$`,
            R`$A, C$, hossza 1`,
            R`$A, B, C$, hossza $3 + 3 = 6$`,
            R`$A, C$, hossza $1/3$`
          ],
          answer: 0,
          hint: "Előbb alakítsd az erősséget hosszá, és csak utána hasonlíts!",
          explain: R`$\ell_{AC} = 1$, a kerülő $1/3 + 1/3 = 2/3 \approx 0{,}67$ – az erősebb lánc a „rövidebb”. Ha a súlyt átalakítás nélkül hossznak vennénk ($1$ vs. $6$), a gyenge közvetlen kapcsolat nyerne: a hálózatelemzés egyik leggyakoribb rejtett hibája.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfnak 9 csúcsa, 12 éle és 2 komponense van. Hány élt kell elhagyni, hogy erdőt kapjunk (komponensenként egy feszítőfát)?`,
          options: ["5", "4", "3", "7"],
          answer: 0,
          hint: R`Egy $c$ fából álló, $n$ csúcsú erdőnek hány éle van?`,
          explain: R`Az erdő élszáma $n - c = 9 - 2 = 7$, tehát $12 - 7 = 5$ élt hagyunk el: ez a ciklomatikus szám, $m - n + c$. A 4 az $m - n + 1$ (mintha összefüggő lenne: az erdő élszámát $n - 1$-nek vette), a 3 az $m - n$, a 7 a megmaradó élek száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $ab = 1$, $bc = 1$, $cd = 1$, $da = 1$, $ac = 2$. Melyik állítás igaz a minimális feszítőfákra?`,
          options: [
            "Az összhossz 3, és 4 különböző minimális feszítőfa van (a négy 1-es élből bármelyik hármat).",
            "Az összhossz 3, és a minimális feszítőfa egyértelmű.",
            R`Az összhossz 4, mert a négy 1-es élet mind be kell venni.`,
            R`Az összhossz 4, és az $ac$ él mindenképp benne van, mert az a „középső” él.`
          ],
          answer: 0,
          hint: "Kruskal: a négy 1-es él közül melyik zár kört? Számít-e, milyen sorrendben vesszük az egyenlő hosszúakat?",
          explain: R`A négy 1-es él egy 4 hosszú kört alkot. Hármat bármelyik sorrendben bevehetünk, a negyedik kört zárna, az $ac$ (2) is. Összhossz 3. Mivel bármelyik 1-es él kimaradhat, 4 minimális feszítőfa van: egyenlő súlyoknál a feszítőfa nem egyértelmű. Négy él 4 csúcson már kört tartalmaz, az nem fa.`
        },
        {
          type: "single", shuffle: true,
          q: R`„Csokornyakkendő”: két háromszög egy közös $C$ csúcsban (élek: $AB, BC, CA, CD, DE, EC$). Melyik igaz?`,
          options: [
            "Van zárt Euler-vonala, de Hamilton-köre nincs.",
            "Van zárt Euler-vonala és Hamilton-köre is.",
            "Hamilton-köre van, de Euler-vonala nincs.",
            R`Egyik sincs, mert a $C$ elvágó csúcs.`
          ],
          answer: 0,
          hint: "Euler: fokszámok és összefüggés. Hamilton: hányszor kellene áthaladni a C-n?",
          explain: R`Fokszámok: $C$ 4, a többi 2 – mind páros, a gráf összefüggő → van zárt Euler-vonal: $C, A, B, C, D, E, C$ (a $C$-t ismétli, ez megengedett). Hamilton-kör nincs: a $C$ elvágó csúcs, és a körnek kétszer kellene rajta áthaladnia. Az elvágó csúcs csak a Hamilton-kört zárja ki, az Euler-vonalat nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a csokornyakkendő-gráfban ($AB, BC, CA, CD, DE, EC$) mennyi $(A^3)_{CC}$?`,
          options: ["4", "2", "8", "16"],
          answer: 0,
          hint: "A 3 hosszú zárt séták háromszögek. Hány háromszögben van benne a C, és hány irányban járható körbe egy háromszög?",
          explain: R`A $C$ két háromszögben van ($ABC$, $CDE$), mindegyiket két irányban lehet körbejárni: $(A^3)_{CC} = 2 \cdot 2 = 4$. A 2 csak a háromszögeket számolja (irány nélkül), a 8 és a 16 a fokszámból (4) számol: kétszerese, illetve négyzete.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhéten a BFS a Klímaváltozásból ezeket a rétegeket adja: 0: Kl · 1: Sz, Ko · 2: Vi, Po · 3: La, Ön. Mi a Polgármester szülője a BFS-fában?",
          options: [
            "a Kormány",
            "a Vízügy",
            "a Szakértő",
            "a Klímaváltozás"
          ],
          answer: 0,
          hint: "A BFS-fában minden csúcs szülője az, ahonnan először elértük. Kinek a szomszédja a Polgármester az 1. rétegből?",
          explain: R`A $\mathrm{Po}$ a 2. rétegben van, tehát egy 1. rétegbeli szomszédjától kapta a távolságát. Az 1. rétegből csak a $\mathrm{Ko}$ szomszédja ($\mathrm{Sz}$-nek nem). A $\mathrm{Vi}$ is szomszéd, de ő maga is a 2. rétegben van: tőle a $\mathrm{Po}$ 3-as távolságot kapna, ami a BFS-ben sosem írja felül az elsőt. A $\mathrm{Kl}$ nem szomszédja a $\mathrm{Po}$-nak.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhéten a Polgármestert elhagyva a hálózat szétesik, a Kormányt elhagyva nem. Melyik összefoglalás pontos?",
          options: [
            "A Polgármester elvágó csúcs (összetartó), a Kormány nélkül a gráf összefüggő marad, de az átmérő 3-ról 4-re nő (rövidítő).",
            "A Kormány a fontosabb, mert nélküle nő az átlagos úthossz, a Polgármester nélkül viszont nem.",
            "Mindkettő ugyanolyan szerepű, hiszen a fokszámuk egyaránt 4.",
            "A Polgármester nélkül az átmérő 4 lesz, a Kormány nélkül végtelen."
          ],
          answer: 0,
          hint: "Szétesés → végtelen távolságok. Összefüggő maradás → csak megnyúlnak az utak.",
          explain: R`A Polgármester nélkül $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ és $\{\mathrm{La}, \text{Ön}\}$ marad: a távolságok egy része végtelen, az átlagos úthossz nem is értelmezhető. A Kormány nélkül a gráf egyben marad, az átmérő 4 ($\mathrm{Kl}, \mathrm{Sz}, \mathrm{Vi}, \mathrm{Po}, \mathrm{La}$), az átlagos úthossz kb. $2{,}07$. Azonos fokszám, más szerep: hogy ki „központi”, az attól függ, mit kérdezünk.`
        }
      ]
    },
