    /* ------------------------------------------------ 5.1 */
    "gh5-51": {
      title: "Kvíz – 5.1 Fokszám-centralitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában ($n = 7$) a Vízügy szomszédai a $\mathrm{Ko}$, a $\mathrm{Po}$ és a $\mathrm{Sz}$; az élsúlyok $2$, $2$, $1$. Mennyi a Vízügy (normált) fokszám-centralitása, $C_{\text{fok}}(\mathrm{Vi})$?`,
          options: [R`$0{,}5$`, R`$0{,}43$`, R`$3$`, R`$0{,}83$`],
          answer: 0,
          hint: R`A fokszámot számold, ne a súlyokat. Utána: legfeljebb hány szomszédja lehet egy csúcsnak egy $n$ csúcsú gráfban?`,
          explain: R`$C_{\text{fok}} = d(v)/(n - 1) = 3/6 = 0{,}5$. A $0{,}43 = 3/7$ $n$-nel normál, pedig egy csúcs önmagával nem lehet szomszédos: a maximum $n - 1 = 6$. A $3$ a nyers fokszám, normálás nélkül. A $0{,}83 = 5/6$ az erősséget ($2 + 2 + 1 = 5$) normálja – a fokszám-centralitás a szomszédok <b>számát</b> nézi, nem a súlyukat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 21 csúcsú gráfban az egyik csúcs fokszáma 10, egy 6 csúcsú gráfban az egyik csúcsé 4. Mennyi a fokszám-centralitásuk, és melyik a központibb a saját gráfjában?`,
          options: [
            R`$0{,}5$ és $0{,}8$ – a 6 csúcsú gráf csúcsa`,
            R`$0{,}48$ és $0{,}67$ – a 6 csúcsú gráf csúcsa`,
            R`$10$ és $4$ – a 21 csúcsú gráf csúcsa`,
            R`$0{,}5$ és $0{,}8$ – a 21 csúcsú gráf csúcsa, mert több a szomszédja`
          ],
          answer: 0,
          hint: R`Különböző méretű gráfokat hasonlítasz össze. Mindkét csúcsnál nézd meg, a <b>lehetséges</b> kapcsolatok hányad része valósult meg.`,
          explain: R`$10/(21 - 1) = 0{,}5$ és $4/(6 - 1) = 0{,}8$: a kis gráf csúcsa a lehetséges kapcsolatai 80%-át megvalósította, a nagyé csak a felét. A $0{,}48 = 10/21$ és $0{,}67 = 4/6$ $n$-nel normál $n - 1$ helyett (a sorrend itt véletlenül ugyanaz, de az érték rossz). A nyers fokszám különböző méretű gráfok között félrevezet – ez az 5.1 első buktatója. Az utolsó opció jól számol, de rossz következtetést von le: a normált értéket kell összevetni, nem a nyers számot.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét súlyozott szereplőgráfjában (élek és súlyok: $\mathrm{Ko}$–$\mathrm{Vi}$ 2, $\mathrm{Ko}$–$\mathrm{Po}$ 2, $\mathrm{Vi}$–$\mathrm{Po}$ 2, $\mathrm{Vi}$–$\mathrm{Sz}$ 1, $\mathrm{Sz}$–$\mathrm{Kl}$ 2, $\mathrm{Sz}$–$\mathrm{Ko}$ 1, $\mathrm{Kl}$–$\mathrm{Ko}$ 1, $\mathrm{La}$–$\text{Ön}$ 3, $\mathrm{La}$–$\mathrm{Po}$ 2, $\mathrm{Po}$–$\text{Ön}$ 2) mennyi a Vízügy erőssége, $s(\mathrm{Vi})$?`,
          options: [R`$5$`, R`$3$`, R`$4$`, R`$1$`],
          answer: 0,
          hint: "Keresd meg a Vízügy éleit, és add össze a súlyukat – nem az éleket számold.",
          explain: R`A Vízügy élei: $\mathrm{Ko}$ (2), $\mathrm{Po}$ (2), $\mathrm{Sz}$ (1), így $s(\mathrm{Vi}) = 2 + 2 + 1 = 5$. A $3$ a fokszám (hány szomszéd), nem az erősség (hány együttes említés). A $4$ az, hogy hány cikk <b>említi</b> a Vízügyet (cikk–szereplő páros gráf), az $1$ pedig, hogy hány cikkben <b>szólal meg</b> – ugyanabból a korpuszból három másik „gyakoriság”. Az erősség azért több a cikkszámnál, mert a 2. cikkben két társa is van, így ott kétszer számít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf, élek: $A \to B$, $A \to C$, $B \to C$, $D \to C$, $C \to A$. Mennyi a $C$ befoka és kifoka?`,
          options: [
            R`befok $3$, kifok $1$`,
            R`befok $1$, kifok $3$`,
            R`befok $4$, kifok $4$`,
            R`befok $2$, kifok $1$`
          ],
          answer: 0,
          hint: R`Befok: hány nyíl <b>érkezik</b> a $C$-be. Kifok: hány nyíl <b>indul</b> belőle. Minden élt nézz végig.`,
          explain: R`A $C$-be érkezik $A \to C$, $B \to C$, $D \to C$: befok 3. A $C$-ből indul $C \to A$: kifok 1. Az „1 és 3” a kettőt felcseréli. A „4 és 4” mindkét irányt beszámolja – ez a befok + kifok összege, amely éppen azt mossa el, hogy a $C$-t idézik, de ő keveset idéz. A „2 és 1” kihagyja a $D \to C$ élt (a $D$-re senki sem mutat, de a $D$-ből induló él attól még számít).`
        },
        {
          type: "match",
          q: "Párosítsd a „fokszámszerű” mérőszámot azzal, amit mér!",
          pairs: [
            ["hány cikk említi a szereplőt (cikk–szereplő páros gráf)", "láthatóság"],
            ["hány cikkben szólal meg (cikk → megszólaló)", "hang: ki kap szót"],
            ["hány szereplővel említik együtt (szereplőgráf)", "kapcsoltság"],
            [R`erősség $s(v)$ a súlyozott szereplőgráfban`, "az együttes említések mennyisége"],
            ["befok a hivatkozási gráfban", "népszerűség, tekintély: akit idéznek"],
            ["kifok a hivatkozási gráfban", "aktivitás: aki idéz"]
          ],
          hint: "Mindegyik egy fokszám, csak más gráfban, vagy más irányban. Kérdezd meg mindegyiknél: mit számol meg pontosan?",
          explain: R`A korpuszból többféle gráf készül, és mindegyik fokszáma más kérdésre felel. A cikk–szereplő páros gráfban a szereplő fokszáma az említések száma (<b>láthatóság</b>); a cikk → megszólaló gráfban a <b>hang</b>; a szereplőgráfban a különböző társak száma (<b>kapcsoltság</b>). Az erősség a társakat a közös cikkek számával súlyozza. Irányított gráfon a befok a „népszerűség”, a kifok az „aktivitás”. Tipikus hiba összekeverni őket: a Lakókról 4 cikk szól, 3-ban ők beszélnek, mégis csak 2 a fokszámuk a szereplőgráfban.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az Árvízhét szereplőgráfjára? (Több jó válasz is lehet.)",
          options: [
            R`Fokszám szerint holtverseny van az élen a Kormány és a Polgármester között.`,
            R`Erősség szerint a Polgármester egyedül vezet.`,
            R`A Lakók fokszáma és erőssége is 2.`,
            R`Ha a fokszámokat $n - 1 = 6$-tal normálod, megváltozik a gráfon belüli rangsor.`,
            R`A Vízügyet 4 cikk említi, de csak egyben kap szót.`
          ],
          answer: [0, 1, 4],
          hint: "Mi változik, ha minden számot ugyanazzal a pozitív számmal osztasz? És számít-e a Lakóknál, hogy a La–Ön élnek 3 a súlya?",
          explain: R`A fokszám $\mathrm{Ko} = \mathrm{Po} = 4$, holtverseny. Erősség szerint $\mathrm{Po} = 8$, $\mathrm{Ko} = 6$: a Polgármester egyedül vezet. A Lakók fokszáma 2, de az erőssége $3 + 2 = 5$ – a súly a tartós kapcsolatot jutalmazza. A normálás egy gráfon belül mindenkit ugyanazzal a számmal oszt, ezért a sorrenden <b>nem</b> változtat; csak különböző méretű gráfok összevetéséhez kell. A Vízügyet az 1., 2., 4. és 10. cikk említi, de csak a 2.-ban szólal meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lapok hivatkozási gráfjában (élek: $\mathrm{EK}\to\mathrm{RH}$, $\mathrm{NY}\to\mathrm{EK}$, $\mathrm{VN}\to\mathrm{RH}$, $\mathrm{VN}\to\mathrm{NY}$) minden lapra összeadod a befokot és a kifokot. Mit kapsz?`,
          options: [
            R`Minden lap 2-t kap: eltűnik a különbség az idézett RH és az idéző VN között.`,
            R`Az RH kapja a legtöbbet (4), mert őt idézik a legtöbben.`,
            R`RH 2, EK 1, NY 1, VN 0 – ugyanazt, mint a befok.`,
            R`VN 2, EK 1, NY 1, RH 0 – ugyanazt, mint a kifok.`
          ],
          answer: 0,
          hint: "Írd fel külön a befokot és a kifokot laponként, és csak utána add össze.",
          explain: R`Befok: RH 2, EK 1, NY 1, VN 0. Kifok: VN 2, EK 1, NY 1, RH 0. Az összeg mindenkinél $2$: a „csak idézett” Reggeli Hírlap és a „csak idéző” Vidéki Napló ugyanazt kapja. Ezért hiba a befokot és a kifokot összeadni – két különböző kérdést (tekintély és aktivitás) mos egybe. A „RH 4” az RH befokát duplázza; a másik két opció csak a befokot, illetve csak a kifokot adja, az összeadást nem végzi el.`
        }
      ]
    },

    /* ------------------------------------------------ 5.2 */
    "gh5-52": {
      title: "Kvíz – 5.2 Közelségi centralitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $BC$, $CD$, $CE$ (5 csúcs). Mennyi a $C$ közelségi centralitása, $C_{\text{köz}}(C)$?`,
          options: [R`$0{,}8$`, R`$5$`, R`$0{,}2$`, R`$1$`],
          answer: 0,
          hint: R`Szélességi bejárással írd fel a $C$ távolságait a többi négy csúcstól. Utána: mit csinál a képletben az $n - 1$ és a reciprok?`,
          explain: R`A $C$-től $B$, $D$, $E$ 1 lépésre, $A$ 2 lépésre van: a távolságösszeg $1 + 1 + 1 + 2 = 5$. $C_{\text{köz}} = (n - 1)/5 = 4/5 = 0{,}8$. Az $5$ maga a távolságösszeg – az nem centralitás, ott a kisebb a jobb. A $0{,}2 = 1/5$ elhagyja az $n - 1$-es szorzót. Az $1 = 5/5$ $n$-nel szoroz $n - 1$ helyett – így a $C$ a maximumot kapná, pedig az $A$ nem a szomszédja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában ($n = 7$) a Szakértő szomszédai a $\mathrm{Vi}$, a $\mathrm{Kl}$ és a $\mathrm{Ko}$; a $\mathrm{Po}$ 2, a $\mathrm{La}$ és az $\text{Ön}$ 3 lépésre van tőle. Mennyi $C_{\text{köz}}(\mathrm{Sz})$?`,
          options: [R`$0{,}55$`, R`$11$`, R`$0{,}64$`, R`$0{,}09$`],
          answer: 0,
          hint: "Add össze a hat távolságot, és fordítsd meg úgy, hogy átlagos távolság reciproka legyen.",
          explain: R`Távolságösszeg: $1 + 1 + 1 + 2 + 3 + 3 = 11$. $C_{\text{köz}} = 6/11 \approx 0{,}55$ – vagyis az átlagos távolság $11/6 \approx 1{,}83$ lépés. A $11$ a távolságösszeg, reciprok nélkül. A $0{,}64 = 7/11$ $n$-nel szoroz $n - 1$ helyett. A $0{,}09 = 1/11$ az $n - 1$-es szorzót hagyja el. (A teljes rangsor: $\mathrm{Ko} = \mathrm{Po} = 0{,}75$, $\mathrm{Vi} \approx 0{,}67$, $\mathrm{Sz} \approx 0{,}55$, a többi $0{,}5$.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $1$–$2$, $2$–$3$, $3$–$4$, $5$–$6$ (6 csúcs, két komponens). Mennyi a 2-es csúcs harmonikus centralitása, $C_{\text{harm}}(2)$?`,
          options: [R`$2{,}5$`, R`$4$`, R`$0{,}75$`, R`$0$`],
          answer: 0,
          hint: R`Minden más csúcs $1/\operatorname{dist}$-et ad. Mennyit ad az, amelyik egyáltalán nem érhető el?`,
          explain: R`A 2-es csúcstól az 1-es és a 3-as 1 lépésre, a 4-es 2 lépésre van, az 5-ös és a 6-os elérhetetlen ($1/\infty = 0$): $C_{\text{harm}}(2) = 1 + 1 + \tfrac12 + 0 + 0 = 2{,}5$. A $4$ az elérhető csúcsok távolságösszege – a reciprokot kihagyja. A $0{,}75 = 3/4$ a csak a saját komponensen belül számolt közelségi centralitás: úgy tesz, mintha a másik komponens nem létezne. A $0$-t a közelségi képlet adná a teljes gráfon (végtelen távolságösszeg) – éppen ezért kell a harmonikus változat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában a Vízügytől a $\mathrm{Ko}$, a $\mathrm{Po}$ és a $\mathrm{Sz}$ 1 lépésre, a $\mathrm{Kl}$, a $\mathrm{La}$ és az $\text{Ön}$ 2 lépésre van. Mennyi $C_{\text{harm}}(\mathrm{Vi})$ (normálás nélkül)?`,
          options: [R`$4{,}5$`, R`$9$`, R`$3$`, R`$0{,}67$`],
          answer: 0,
          hint: R`Minden csúcs a távolsága reciprokát adja: a szomszéd 1-et, a 2 lépésre lévő mennyit?`,
          explain: R`$C_{\text{harm}}(\mathrm{Vi}) = 3 \cdot 1 + 3 \cdot \tfrac12 = 4{,}5$. A $9$ a távolságösszeg ($3 + 6$) – reciprok nélkül. A $3$ csak a szomszédokat számolja (ez a fokszám), a 2 lépésre lévőket elhagyja. A $0{,}67 = 6/9$ a közelségi centralitás, nem a harmonikus. (Normálva: $4{,}5/6 = 0{,}75$.)`
        },
        {
          type: "match",
          q: R`Az 5 csúcsú úton (1–2–3–4–5) párosítsd a 2-es csúcs mérőszámait az értékükkel!`,
          pairs: [
            [R`$C_{\text{fok}}(2)$`, "0,5"],
            [R`$\sum_u \operatorname{dist}(2, u)$`, "7"],
            [R`$C_{\text{köz}}(2)$`, "0,57"],
            [R`$C_{\text{harm}}(2)$`, "2,83"],
            [R`$C_{\text{harm}}(2)/(n-1)$`, "0,71"]
          ],
          hint: "Írd fel a 2-es csúcs távolságait: 1, 1, 2, 3. Ebből minden szám kijön.",
          explain: R`A 2-es csúcs távolságai az 1-es, 3-as, 4-es, 5-ös csúcstól: $1, 1, 2, 3$. Fokszám-centralitás: $2/4 = 0{,}5$. Távolságösszeg: $7$. Közelségi: $4/7 \approx 0{,}57$. Harmonikus: $1 + 1 + \tfrac12 + \tfrac13 = \tfrac{17}{6} \approx 2{,}83$, normálva $2{,}83/4 \approx 0{,}71$. A távolságösszeg az egyetlen, ahol a kisebb a jobb.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik nagyobb: a 4 hosszú kör ($C_4$) egy csúcsának, vagy a 4 csúcsú út (1–2–3–4) 2-es csúcsának közelségi centralitása?`,
          options: [
            R`Egyenlők: mindkettő $0{,}75$.`,
            R`Egyenlők: mindkettő $1$.`,
            R`Egyenlők: mindkettő $0{,}25$.`,
            R`A kör csúcsáé: $0{,}75$, az út 2-es csúcsáé $0{,}5$.`
          ],
          answer: 0,
          hint: "Írd fel mindkét csúcs három távolságát. Számít-e, hogy a körben eggyel több él van?",
          explain: R`A kör csúcsa: két szomszéd és a szemközti csúcs 2 lépésre: $1 + 1 + 2 = 4$. Az út 2-es csúcsa: $1$, $3$ szomszéd, a $4$ 2 lépésre: szintén $4$. Mindkettő $3/4 = 0{,}75$ – a plusz él a körben a <b>végpontoknak</b> segít, nem a belső csúcsnak. Az „1” $n/4$-et számol $(n - 1)/4$ helyett, a „0,25” az $n - 1$-es szorzót hagyja el. A „0,5” az út <b>végpontjának</b> értéke ($3/6$), nem a 2-es csúcsé.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A távolságösszeg szerint a <b>legkisebb</b> értékű csúcs a legközpontibb.`,
            R`Nem összefüggő gráfon a közelségi képlet a végtelen távolságösszeg miatt mindenkinek 0-t ad.`,
            R`A harmonikus centralitásban az elérhetetlen csúcs 0-t ad, ezért nem „rontja el” a többit.`,
            R`Ha a súly a közös cikkek száma, közvetlenül használható távolságként a közelségi centralitásban.`,
            R`Nagy kisvilág-hálózatban a közelségi centralitások élesen szétválnak, így a kis különbségek is jelentősek.`
          ],
          answer: [0, 1, 2],
          hint: "Gondold végig: a nagy súly közeli vagy távoli kapcsolatot jelent? És kisvilág-hálózatban hány lépésre van egymástól szinte mindenki?",
          explain: R`A távolságösszeg „fordított” mérőszám: a kisebb a jobb, ezért kell a reciprok. Nem összefüggő gráfon a távolságösszeg végtelen, a képlet mindenkire 0-t ad; a harmonikus változat ($1/\infty := 0$) ezt oldja meg. A „közös cikkek száma” súlynál a nagy súly <b>közelebbi</b> kapcsolatot jelent, a távolsághoz előbb meg kell fordítani (pl. $1/w$). Kisvilág-hálózatban szinte mindenki 3–5 lépésre van mindenkitől, ezért az értékek <b>összenyomódnak</b> – a kis különbséget ne értelmezd túl.`
        }
      ]
    },

    /* ------------------------------------------------ 5.3 */
    "gh5-53": {
      title: "Kvíz – 5.3 Köztességi centralitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi a 6 csúcsú út (1–2–3–4–5–6) 3-as csúcsának köztessége (normálás nélkül)?`,
          options: [R`$6$`, R`$11$`, R`$12$`, R`$5$`],
          answer: 0,
          hint: "Melyik csúcspárok legrövidebb útjának belső csúcsa a 3-as? Az egyik végpont a 3-as egyik oldalán, a másik a másikon legyen.",
          explain: R`Az úton minden pár között egyetlen út van. A 3-as akkor belső csúcs, ha az egyik végpont $\{1, 2\}$-ből, a másik $\{4, 5, 6\}$-ból való: $2 \cdot 3 = 6$ pár. A $11$ a 3-ast tartalmazó 5 párt is beszámolja – ott a 3-as végpont, és a köztesség csak a belső csúcsokat jutalmazza. A $12$ minden párt kétszer számol ($s$–$t$ és $t$–$s$), ez irányítatlan gráfon hiba. Az $5$ éppen csak a végpontos párokat számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanitt (6 csúcsú út, a 3-as köztessége 6) mennyi a 3-as csúcs <b>normált</b> köztessége?`,
          options: [R`$0{,}6$`, R`$0{,}4$`, R`$1{,}2$`, R`$0{,}3$`],
          answer: 0,
          hint: R`Legfeljebb hány pár mehet át a 3-ason? Csak azok a párok jöhetnek szóba, amelyekben a 3-as nem szerepel.`,
          explain: R`A 3-ast nem tartalmazó párok száma $\binom{n-1}{2} = \binom52 = 10$, így $6/10 = 0{,}6$. A $0{,}4 = 6/15$ $\binom n2 = \binom62$-vel normál – ebben a 3-ast tartalmazó párok is benne vannak, pedig azok sosem számítanak. Az $1{,}2 = 6/5$ $(n - 1)$-gyel oszt, mint a fokszám; az eredmény 1-nél nagyobb, ami már jelzi a hibát. A $0{,}3 = 6/20$ a rendezett párok számával, $(n-1)(n-2)$-vel oszt, de a köztesség rendezetlen párokat számolt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $BD$, $CD$, $DE$ (egy négyzet, a $D$-n egy „farokkal”). Mennyi a $D$ köztessége?`,
          options: [R`$3{,}5$`, R`$4$`, R`$7$`, R`$7{,}5$`],
          answer: 0,
          hint: R`Nézd végig a $D$-t nem tartalmazó párokat. A $B$–$C$ párnak hány legrövidebb útja van, és ezek közül hány megy át a $D$-n?`,
          explain: R`A $D$-t nem tartalmazó párok: $A$–$B$, $A$–$C$ szomszédos (0). $A$–$E$, $B$–$E$, $C$–$E$: minden legrövidebb út a $D$-n át vezet (az $A$–$E$ párnak kettő is, de mindkettő a $D$-n megy): $3$. $B$–$C$: két legrövidebb út ($B$–$A$–$C$ és $B$–$D$–$C$), ebből egy megy a $D$-n: $\tfrac12$. Összesen $3{,}5$. A $4$ a $B$–$C$ párt egészben adja oda ($\tfrac12$ helyett 1). A $7$ minden párt kétszer számol. A $7{,}5$ a $D$-t végpontként tartalmazó 4 párt is beszámolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában (élek: $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{La}$–$\mathrm{Po}$, $\mathrm{Po}$–$\text{Ön}$) mennyi a Vízügy köztessége?`,
          options: [R`$1{,}5$`, R`$3$`, R`$7{,}5$`, R`$2$`],
          answer: 0,
          hint: R`A Vízügy a $\mathrm{Sz}$ és a $\mathrm{Po}$ között „ül”. Mely párok útja mehet át rajta, és nekik hány legrövidebb útjuk van?`,
          explain: R`A $\mathrm{Sz}$–$\mathrm{Po}$, $\mathrm{Sz}$–$\mathrm{La}$, $\mathrm{Sz}$–$\text{Ön}$ pároknak két-két legrövidebb útjuk van: a $\mathrm{Vi}$-n vagy a $\mathrm{Ko}$-n át. Mindegyikből $\tfrac12$ jut a Vízügynek: $3 \cdot \tfrac12 = 1{,}5$. A $3$ az egész párokat odaadja. A $7{,}5$ azokat a párokat is beszámolja, amelyekben a Vízügy végpont. A $2$ a $\mathrm{Kl}$–$\mathrm{Vi}$ pár felét is hozzáadja – de abban a Vízügy végpont (az a fél a Szakértőé). A teljes rangsor: $\mathrm{Po}$ 8, $\mathrm{Ko}$ 5, $\mathrm{Vi}$ 1,5, $\mathrm{Sz}$ 0,5.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten a Polgármester köztessége 8, a Kormányé 5. Mi történne, ha egyetlen cikk a Lakókat és a Vízügyet együtt említené (új $\mathrm{La}$–$\mathrm{Vi}$ él)?`,
          options: [
            R`A Polgármester köztessége 4-re esne, és utolérné a Kormány (4).`,
            R`A Polgármester köztessége 8 maradna, mert a Lakók és az Önkéntesek továbbra is rajta át érnek ki.`,
            R`A Polgármester köztessége 0 lenne, mert már nem elvágó csúcs.`,
            R`A Vízügy kerülne az élre 9-cel, a Polgármester 8 maradna.`
          ],
          answer: 0,
          hint: R`Az új éllel a Lakóknak lesz egy második kijárata az országos szálhoz. Mi történik azokkal a párokkal, amelyeknek eddig egyetlen legrövidebb útjuk volt?`,
          explain: R`Az új él miatt sok pár útja a Vízügyön át is ugyanolyan rövid, sőt rövidebb lesz (pl. $\mathrm{La}$–$\mathrm{Sz}$ most 2 lépés a Vízügyön át). Pythonnal: $\mathrm{Po}$ 4, $\mathrm{Ko}$ 4, $\mathrm{Vi} \approx 3{,}33$. A köztesség <b>érzékeny a hiányzó élekre</b>: egyetlen cikk felezheti a „fő közvetítő” értékét. A „8 marad” hiba: a Lakóknak már van más kijárata. A „0” túloz: a Polgármester valóban nem elvágó csúcs többé, de sok legrövidebb út még mindig rajta megy át. A „Vízügy 9” egy másik változtatás (a $\mathrm{Ko}$–$\mathrm{Po}$ él törlése) eredménye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $1$–$2$, $1$–$3$, $2$–$3$, $3$–$X$, $X$–$4$, $4$–$5$, $4$–$6$, $5$–$6$ (két háromszög, köztük az $X$; $n = 7$). Mennyi az $X$ normált köztessége?`,
          options: [R`$0{,}6$`, R`$0{,}43$`, R`$1{,}2$`, R`$1{,}5$`],
          answer: 0,
          hint: R`Először a nyers érték: melyik párok útja megy át az $X$-en? Utána: hány olyan pár van, amelyben az $X$ nem szerepel?`,
          explain: R`Az $\{1, 2, 3\}$ és a $\{4, 5, 6\}$ közötti $3 \cdot 3 = 9$ pár mind az $X$-en át megy, egyetlen legrövidebb úttal: nyers köztesség 9. A normáló $\binom{n-1}{2} = \binom62 = 15$, így $9/15 = 0{,}6$. A $0{,}43 = 9/21$ $\binom n2 = \binom72$-vel oszt. Az $1{,}2 = 18/15$ minden párt kétszer számol. Az $1{,}5 = 9/6$ $(n - 1)$-gyel oszt. Figyeld meg: az $X$ fokszáma csak 2, a köztessége mégis magas – ez a <b>közvetítő</b> (strukturális lyuk) jele.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a köztességre? (Több jó válasz is lehet.)",
          options: [
            R`A köztesség csak a legrövidebb utak <b>belső</b> csúcsait jutalmazza, a végpontokat nem.`,
            R`Ha $\sigma_{st} = 2$, és csak az egyik út megy át $v$-n, a pár $\tfrac12$-et ad $v$-nek.`,
            R`A magas köztesség és az alacsony fokszám együtt közvetítő (broker) szerepre utal.`,
            R`Irányítatlan gráfon az $s$–$t$ és a $t$–$s$ párt külön kell számolni.`,
            R`A normáláshoz $\binom n2$-vel kell osztani, mert ennyi pár van a gráfban.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a három tipikus hibára: végpont, egész pár, kétszer számolt pár. És mely párok jöhetnek szóba egyáltalán v-nél?",
          explain: R`A köztesség azt méri, hány pár kapcsolata megy át $v$-n mint közbülső csúcson – a végpont nem „ellenőriz” semmit. Több legrövidebb útnál a párt egyenlően osztjuk szét. Burt <b>strukturális lyuk</b> fogalma szerint aki két alig kapcsolódó csoport között áll, kevés kapcsolattal is sok utat ellenőriz. Irányítatlan gráfon $\{s, t\} = \{t, s\}$, egy párt egyszer számolunk (egyes programok mindkét irányt veszik, ezért kétszeres értéket adnak). A normáló $\binom{n-1}{2}$: a $v$-t tartalmazó párokban $v$ végpont, azok sosem számítanak.`
        }
      ]
    },

    /* ------------------------------------------------ 5.4 */
    "gh5-54": {
      title: "Kvíz – 5.4 Sajátvektor-centralitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $DE$. Induljunk a csupa 1 vektorból, és lépésenként mindenki kapja meg a szomszédai pontszámának összegét. Mi a 2. lépés eredménye (az $A, B, C, D, E$ sorrendben, normálás nélkül)?`,
          options: [
            R`$(4, 3, 3, 4, 2)$`,
            R`$(3, 1, 1, 2, 1)$`,
            R`$(7, 4, 4, 6, 3)$`,
            R`$(1{,}33;\ 3;\ 3;\ 2;\ 2)$`
          ],
          answer: 0,
          hint: R`Az 1. lépés a fokszám ($A\mathbf 1$). A 2. lépésben mindenki a szomszédai <b>fokszámát</b> adja össze. Benne van-e a saját értéke?`,
          explain: R`1. lépés: a fokszámok, $(3, 1, 1, 2, 1)$. 2. lépés: $A = 1 + 1 + 2 = 4$, $B = C = 3$ (az $A$ fokszáma), $D = 3 + 1 = 4$, $E = 2$. A $D$ így utoléri az $A$-t: neki „erősebb” a szomszédja. A $(3, 1, 1, 2, 1)$ csak egy lépés. A $(7, 4, 4, 6, 3)$ a saját értéket is hozzáadja – ez $(A + I)$, de a szabály csak a szomszédokat nézi. Az $(1{,}33;\ 3;\ \dots)$ átlagol (oszt a saját fokszámmal), nem összegez.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a levelek sajátvektor-centralitása egy 6 csúcsú csillagban (közép + 5 levél), ha a közép értéke 1?`,
          options: [R`$0{,}45$`, R`$0{,}2$`, R`$0{,}5$`, R`$2{,}24$`],
          answer: 0,
          hint: R`Írd fel a két egyenletet: a levélnek egy szomszédja van (a közép), a középnek öt (a levelek). Mindkettőben ugyanaz a $\lambda$.`,
          explain: R`Legyen a levél $y$. Levél: $\lambda y = 1$. Közép: $\lambda \cdot 1 = 5y$. Ebből $\lambda^2 = 5$, $\lambda = \sqrt5 \approx 2{,}24$, $y = 1/\sqrt5 \approx 0{,}45$. A $0{,}2 = 1/5$ a fokszámok aránya – a sajátvektor nem a fokszám. A $0{,}5$ a 4 levelű csillag értéke ($\lambda = 2$), itt nem érvényes. A $2{,}24$ a sajátérték, nem a sajátvektor eleme.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 4 csúcsú úton (1–2–3–4) a szimmetria miatt $x_1 = x_4 = a$, $x_2 = x_3 = 1$. Mennyi a végpontok max = 1-re normált sajátvektor-centralitása, $a$?`,
          options: [R`$0{,}62$`, R`$0{,}5$`, R`$0{,}71$`, R`$1{,}62$`],
          answer: 0,
          hint: R`Két egyenlet: a végpontnak egy szomszédja van, a belső csúcsnak kettő (egy végpont és egy belső). Fejezd ki $\lambda$-t, és oldd meg a másodfokú egyenletet.`,
          explain: R`Végpont: $\lambda a = 1$. Belső csúcs: $\lambda \cdot 1 = a + 1$. Az elsőből $a = 1/\lambda$, behelyettesítve $\lambda^2 = 1 + \lambda$, a pozitív gyök $\lambda = \tfrac{1 + \sqrt5}{2} \approx 1{,}62$, így $a = 1/\lambda \approx 0{,}62$. A $0{,}5$ a fokszámok aránya ($1/2$). A $0{,}71$ a 3 csúcsú út végpontjának értéke ($1/\sqrt2$) – azt nem lehet átvinni. Az $1{,}62$ a sajátérték, nem a végpont értéke.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában a Kormány és a Polgármester fokszáma egyaránt 4. Melyik centralitás szerint vezet a Kormány <b>egyedül</b>?`,
          options: [
            R`sajátvektor-centralitás`,
            R`fokszám-centralitás`,
            R`közelségi centralitás`,
            R`köztességi centralitás`
          ],
          answer: 0,
          hint: "Nem az számít, hány szomszédja van, hanem hogy kik azok. Kinek a szomszédai ülnek a gráf sűrű magjában?",
          explain: R`Sajátvektor szerint $\mathrm{Ko} = 1$, $\mathrm{Po} \approx 0{,}87$ ($\lambda_1 \approx 3{,}09$): a Kormány szomszédai a sűrű országos csoport tagjai, a Polgármesteréi közül kettő (Lakók, Önkéntesek) a gráf szélén ül. A fokszám (4–4) és a közelségi ($0{,}75$–$0{,}75$) holtversenyt ad. A köztesség épp fordítva dönt: a Polgármester vezet (8 vs. 5). Tanulság: ugyanazon a gráfon a különböző centralitások más győztest adhatnak.`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított lánc: $A \to B \to C \to D$. Mi a „beérkező” sajátvektor-centralitás ($x_i$ = a rá mutatók pontszámának összegével arányos)?`,
          options: [
            R`$(0, 0, 0, 0)$ – mindenki 0`,
            R`$(0, 1, 1, 1)$ – a befok`,
            R`$(0, 1, 2, 3)$ – a lánc vége a legfontosabb`,
            R`$(1, 1, 1, 1)$ – mindenki egyforma`
          ],
          answer: 0,
          hint: R`Kezdd az $A$-val: ki mutat rá? Utána a $B$: kitől kapja a pontszámát?`,
          explain: R`Az $A$-ra senki sem mutat: $x_A = 0$. A $B$ csak az $A$-tól kap: $x_B \propto x_A = 0$, és így tovább – a nulla végigfolyik a láncon. Körmentes irányított gráfban a szomszédsági mátrix egyetlen sajátértéke a 0, nincs pozitív sajátvektor. A $(0, 1, 1, 1)$ a befok, az csak az első iteráció. A $(0, 1, 2, 3)$ azt hiszi, hogy a hosszabb lánc több pontot hoz – de a pontszám a forrás értékéből jön, és az 0. Ezért kell a Katz-centralitás vagy a PageRank.`
        },
        {
          type: "match",
          q: "Párosítsd a kifejezést a jelentésével!",
          pairs: [
            [R`$A\mathbf 1$`, "a fokszám"],
            [R`$A^2\mathbf 1$`, "a szomszédok fokszámának összege"],
            [R`$A^k\mathbf 1$ iránya, ha $k \to \infty$`, "a sajátvektor-centralitás"],
            [R`$\lambda_1$`, "a legnagyobb sajátérték, az arányossági tényező"],
            [R`$\mathbf x = \alpha A^\top\mathbf x + \beta\mathbf 1$`, "a Katz-centralitás"]
          ],
          hint: "Minden lépés egy újabb szomszédösszeg. Mi lesz egy lépés után, kettő után, végtelen sok után? És mi az, ahol mindenki kap egy alappontszámot?",
          explain: R`$A\mathbf 1$: mindenki annyi 1-est kap, ahány szomszédja van – a fokszám. $A^2\mathbf 1$: a szomszédok fokszámának összege (a 2 hosszú séták száma). A hatványiteráció iránya a legnagyobb sajátértékhez ($\lambda_1$) tartozó sajátvektorhoz tart (Perron–Frobenius): ez a sajátvektor-centralitás. A Katz-centralitás $\beta$ alappontszámot ad mindenkinek, így irányított gráfon sem fut le minden 0-ra. „Fokszám = 1 lépés, sajátvektor = végtelen sok lépés.”`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a sajátvektor-centralitásra? (Több jó válasz is lehet.)",
          options: [
            R`Két egyforma fokszámú csúcs sajátvektor-centralitása jócskán eltérhet.`,
            R`Összefüggő gráfon a legnagyobb sajátértékhez tartozik csupa pozitív sajátvektor.`,
            R`Ha egy program csupa negatív vektort ad vissza, megfordíthatod az előjelét.`,
            R`A legkisebb sajátértékhez tartozó sajátvektort kell venni.`,
            R`Irányított gráfon mindig van csupa pozitív sajátvektor, ezért ott is gond nélkül használható.`
          ],
          answer: [0, 1, 2],
          hint: R`Emlékezz az $X$–$Y$ példára, a Perron–Frobenius-tételre és az $A \to B \to C$ láncra.`,
          explain: R`Az $X$–$Y$ gráfban $X$ és $Y$ fokszáma is 2, a sajátvektor mégis $0{,}75$ és $0{,}40$: számít, kik a szomszédok. A Perron–Frobenius-tétel szerint összefüggő gráfon <b>csak</b> a legnagyobb sajátértékhez tartozik csupa pozitív sajátvektor – ezért azt vesszük, nem a legkisebbet (annak vannak negatív elemei). A sajátvektor előjele önkényes: $-\mathbf v$ is sajátvektor, így ha minden elem negatív, fordítsd meg. Irányított gráfon viszont a sajátvektor sokszor csupa 0 (pl. láncon, körmentes gráfon) – erre jön a Katz és a PageRank.`
        }
      ]
    },
