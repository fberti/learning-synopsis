/* =========================================================
   Gráfelmélet és hálózattudomány 5. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 5.5 */
    "gh5-55": {
      title: "Kvíz – 5.5 PageRank",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf: $A\to B$, $B\to C$, $C\to A$, $C\to B$. Mi a teleportálás nélküli ($\alpha = 1$) PageRank, vagyis a $p_i = \sum_{j\to i} p_j/k^{\text{ki}}_j$, $\sum p_i = 1$ megoldása ($A, B, C$ sorrendben)?`,
          options: [
            R`$(0{,}2;\ 0{,}4;\ 0{,}4)$`,
            R`$(0{,}25;\ 0{,}5;\ 0{,}25)$`,
            R`$(0{,}25;\ 0{,}25;\ 0{,}5)$`,
            R`$(0{,}33;\ 0{,}33;\ 0{,}33)$`
          ],
          answer: 0,
          hint: R`Írd fel csúcsonként: ki küld neki, és a küldő hány felé osztja a pontszámát? Legyen $p_C = c$, és fejezd ki vele a többit.`,
          explain: R`A $C$ kifoka 2, ezért a pontszámát felezi. Egyenletek: $p_A = p_C/2$, $p_B = p_A + p_C/2$, $p_C = p_B$. Ha $p_C = c$, akkor $p_A = c/2$, $p_B = c/2 + c/2 = c$; az összeg $2{,}5c = 1$, így $\mathbf p = (0{,}2;\ 0{,}4;\ 0{,}4)$.
            A $(0{,}25;\ 0{,}5;\ 0{,}25)$ a befok arányos része (1, 2, 1 a 4-ből) – ez nem veszi figyelembe, honnan jön a link. A $(0{,}25;\ 0{,}25;\ 0{,}5)$ a kifok, ami a <b>küldő</b> aktivitása, nem a fontosság. A csupa $\tfrac13$ akkor jönne ki, ha mindenki ugyanannyit kapna – de a $C$ két felé oszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanezen a gráfon ($A\to B$, $B\to C$, $C\to A$, $C\to B$) $\alpha = 0{,}85$, és $\mathbf p_0 = (\tfrac13, \tfrac13, \tfrac13)$. Mennyi $p_B$ egy lépés után?`,
          options: [R`$0{,}475$`, R`$0{,}358$`, R`$0{,}425$`, R`$0{,}617$`],
          answer: 0,
          hint: R`Két rész: a teleportálásból mindenki $\frac{1-\alpha}{n}$-t kap, a linkeken érkező részt $\alpha$-val szorozd. Ki küld a $B$-nek, és hány felé oszt?`,
          explain: R`Teleportálás: $0{,}15/3 = 0{,}05$. A $B$-nek az $A$ küld (kifok 1): $\tfrac13$, és a $C$ (kifok 2): $\tfrac16$; összesen $0{,}5$. Így $p_B = 0{,}05 + 0{,}85 \cdot 0{,}5 = 0{,}475$.
            A $0{,}358 = 0{,}85/3 + 0{,}15 \cdot 0{,}5$ felcseréli a két szerepet ($\alpha/n$ a teleportálásnál). A $0{,}425$ kihagyja a teleportálásból kapott $0{,}05$-öt. A $0{,}617$ a $C$ pontszámát nem osztja el a kifokával ($\tfrac13 + \tfrac13$).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a PageRank $\alpha$ paraméteréről? (Több jó válasz is lehet.)`,
          options: [
            R`$\alpha$ annak a valószínűsége, hogy a szörföző egy kimenő linket követ.`,
            R`$\alpha = 0$ esetén minden oldal PageRankje $1/n$.`,
            R`$\alpha \to 1$ esetén visszajön a teleportálás nélküli séta a zsákutca és az elérhetetlen oldal problémájával.`,
            R`$\alpha$ a teleportálás valószínűsége, ezért $\alpha = 0{,}85$ mellett a szörföző többnyire ugrik.`,
            R`Ha $\alpha$-t csökkentjük, a pontszámok jobban szétszóródnak, a különbségek nőnek.`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg a képletet: melyik tag előtt áll $\alpha$, és melyik előtt $1 - \alpha$? Mi marad belőle $\alpha = 0$-nál?`,
          explain: R`A képletben $\alpha$ a linkeken érkező részt szorozza: ez a link követésének valószínűsége, a teleportálásé $1 - \alpha$ (0,15). $\alpha = 0$-nál csak a $\frac{1}{n}$ tag marad, mindenki egyforma. $\alpha \to 1$-nél eltűnik a teleportálás, és újra elszivárog a pontszám, illetve beragad.
            Kisebb $\alpha$ több teleportálást jelent, ezért az eloszlás az <b>egyenleteshez</b> közeledik – a különbségek csökkennek (a lapok gráfján az RH 0,416-ról 0,347-re esik, ha $\alpha = 0{,}5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf: $A\to B$, $B\to C$, a $C$-ből nem indul link. A zsákutcát <b>nem</b> kezeljük, és nincs teleportálás. $\mathbf p_0 = (\tfrac13, \tfrac13, \tfrac13)$-ból indulva mennyi a pontszámok összege <b>két</b> lépés után?`,
          options: [R`$\tfrac13$`, R`$1$`, R`$\tfrac23$`, R`$0$`],
          answer: 0,
          hint: "Lépésenként: ki mit küld tovább? Ami a zsákutcába ér, az a következő lépésben hova kerül?",
          explain: R`1. lépés: $A$ nem kap semmit, $B$ az $A$-tól $\tfrac13$-ot, $C$ a $B$-től $\tfrac13$-ot; a $C$ saját $\tfrac13$-a elveszett. Összeg $\tfrac23$. 2. lépés: $B$ megint semmit nem kap, $C$ a $B$-től $\tfrac13$-ot: összeg $\tfrac13$. 3. lépés után minden elfolyt (0).
            Az 1 akkor lenne, ha a pontszám megmaradna – ez csak zsákutca-kezeléssel igaz. A $\tfrac23$ az első lépés utáni összeg, a $0$ a harmadiké.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 5 oldalas gráfban nincs zsákutca, és az $E$ oldalra egyetlen link sem mutat. Mennyi $p_E$, ha $\alpha = 0{,}85$?`,
          options: [R`$0{,}03$`, R`$0$`, R`$0{,}17$`, R`$0{,}2$`],
          answer: 0,
          hint: R`Linken nem kap semmit, zsákutcából sem. Melyik tag marad a képletből?`,
          explain: R`Csak a teleportálásból kap: $p_E = \frac{1 - \alpha}{n} = \frac{0{,}15}{5} = 0{,}03$. A 0 a teleportálás nélküli eredmény (az „elérhetetlen oldal” hibája). A $0{,}17 = 0{,}85/5$ felcseréli $\alpha$ és $1 - \alpha$ szerepét. A $0{,}2 = 1/5$ az $\alpha = 0$ esete.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lapok hivatkozási gráfjában ($\mathrm{EK}\to\mathrm{RH}$, $\mathrm{NY}\to\mathrm{EK}$, $\mathrm{VN}\to\mathrm{RH}$, $\mathrm{VN}\to\mathrm{NY}$) az RH zsákutca, $p_{\mathrm{RH}} \approx 0{,}416$, $\alpha = 0{,}85$. A VN-re senki sem hivatkozik. Mennyi $p_{\mathrm{VN}}$?`,
          options: [R`$\approx 0{,}126$`, R`$0{,}0375$`, R`$\approx 0{,}141$`, R`$0$`],
          answer: 0,
          hint: "Mi történik a zsákutcában lévő pontszámmal? Mindenki, így a VN is kap belőle?",
          explain: R`A zsákutcából a szörföző mindig teleportál: az RH pontszámának $\alpha$-szorosa mindenki között egyenlően oszlik szét. $p_{\mathrm{VN}} = 0{,}0375 + 0{,}85 \cdot 0{,}416/4 \approx 0{,}126$.
            A $0{,}0375 = 0{,}15/4$ csak a teleportálást számolja, a zsákutca részét nem. A $0{,}141 = 0{,}0375 + 0{,}416/4$ elfelejti az $\alpha$-val szorzást. A 0 a teleportálás nélküli gondolkodás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfja irányítatlan, 10 éle van; a Polgármester fokszáma 4, PageRankje ($\alpha = 0{,}85$) $0{,}196$. Mennyi lenne a PageRankje teleportálás nélkül?`,
          options: [R`$0{,}2$`, R`$0{,}67$`, R`$0{,}22$`, R`$0{,}14$`],
          answer: 0,
          hint: R`Irányítatlan gráfon a véletlen séta stacionárius eloszlása (4.2) egy egyszerű képlet a fokszámból. Hány élvég van összesen?`,
          explain: R`Teleportálás nélkül a PageRank a véletlen séta stacionárius eloszlása, irányítatlan gráfon $d_i/2m = 4/20 = 0{,}2$. A teleportálás ezt csak kicsit simítja (0,196) – irányítatlan gráfon a PageRank majdnem a fokszám.
            A $0{,}67 = 4/6$ a fokszám-centralitás, az nem eloszlás. A $0{,}22 = 8/36$ az erősséggel számol, de a PageRank itt súlytalan gráfon fut. A $0{,}14 \approx 1/7$ az egyenletes eloszlás ($\alpha = 0$).`
        }
      ]
    },

    /* ------------------------------------------------ 5.6 */
    "gh5-56": {
      title: "Kvíz – 5.6 HITS: hubok és tekintélyek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf: $P\to Q$, $P\to R$, $S\to Q$, $S\to R$, $R\to Q$. A HITS első lépésében ($\mathbf h = \mathbf 1$-ből: $\mathbf a = A^\top\mathbf h$, majd $\mathbf h = A\mathbf a$) mi lesz a hub-vektor, max = 1-re normálva?`,
          options: [
            R`$P = S = 1$, $R = 0{,}6$, $Q = 0$`,
            R`$P = S = 1$, $R = 0{,}5$, $Q = 0$`,
            R`$Q = 1$, $R = 0{,}67$, $P = S = 0$`,
            R`$Q = 1$, $P = R = S = 0$`
          ],
          answer: 0,
          hint: R`Előbb a tekintély: ki hány linket kap? Aztán a hub: akikre mutatsz, azok tekintélyét add össze.`,
          explain: R`$\mathbf a = A^\top\mathbf 1$ = befok: $Q$ 3, $R$ 2, $P = S = 0$. Hub: $h_P = a_Q + a_R = 5$, $h_S = 5$, $h_R = a_Q = 3$, $h_Q = 0$. Normálva: $P = S = 1$, $R = 0{,}6$.
            A „$R = 0{,}5$” a kifokot normálja (2, 2, 1) – a hub nem a linkek száma, hanem a linkelt oldalak tekintélye. A „$Q = 1$, $R = 0{,}67$” a tekintély-vektor, a két szerep felcserélve. A „csak $Q$” a bejövő szomszédok tekintélyét adja össze – rossz irány.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik mátrix domináns sajátvektora a HITS <b>tekintély</b>-vektora?`,
          options: [R`$A^\top A$`, R`$AA^\top$`, R`$A$`, R`$A^\top$`],
          answer: 0,
          hint: R`Tedd egymás után a két frissítést: $\mathbf a_{\text{új}} = A^\top\mathbf h$, és $\mathbf h = A\mathbf a$. Mi lesz $\mathbf a$-ból $\mathbf a$-ba?`,
          explain: R`$\mathbf a_{\text{új}} = A^\top\mathbf h = A^\top A\,\mathbf a$: a tekintély-vektor az $A^\top A$-val végzett hatványiteráció, tehát annak domináns sajátvektora. Az $AA^\top$ a <b>hub</b>-vektoré – ez a tipikus felcserélés.
            Az $A$ vagy $A^\top$ sajátvektora a (kimenő vagy beérkező) sajátvektor-centralitás lenne, ami irányított, körmentes gráfon csupa 0.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a jelentésével!",
          pairs: [
            [R`tekintély ($\mathbf a = A^\top\mathbf h$)`, "akire jó hubok mutatnak"],
            [R`hub ($\mathbf h = A\mathbf a$)`, "aki jó tekintélyekre mutat"],
            [R`$(A^\top A)_{ij}$`, "hány oldal mutat egyszerre i-re és j-re (közös idézés)"],
            [R`$(AA^\top)_{ij}$`, "hány oldalra mutat i is és j is (bibliográfiai csatolás)"],
            [R`az első lépés tekintély-vektora ($\mathbf h = \mathbf 1$)`, "a befok"]
          ],
          hint: R`$A^\top$ a bejövő, $A$ a kimenő élek mentén gyűjt. A szorzatban először melyik irányba lépsz, aztán melyikbe?`,
          explain: R`A tekintély a bejövő élekből ($A^\top$), a hub a kimenő élekből ($A$) áll össze. $(A^\top A)_{ij} = \sum_k A_{ki}A_{kj}$: azok a $k$ oldalak, amelyek $i$-re és $j$-re is mutatnak – ez a közös idézés. $(AA^\top)_{ij} = \sum_k A_{ik}A_{jk}$: azok a $k$ oldalak, amelyekre $i$ és $j$ is mutat – bibliográfiai csatolás.
            Az első lépésben $\mathbf a = A^\top\mathbf 1$, ami a befok; ezután a HITS már finomít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az „összesítők és tudósítók” gráfjában ($H1\to T1$, $H1\to T2$, $H1\to T3$, $H2\to T1$, $H2\to T2$, $T3\to T1$) mennyi $(A^\top A)_{T1,T2}$, vagyis hány oldal idézi egyszerre a T1-et és a T2-t?`,
          options: [R`$2$`, R`$3$`, R`$0$`, R`$1$`],
          answer: 0,
          hint: "Sorold fel, kik mutatnak a T1-re, és kik a T2-re. Hány közös van?",
          explain: R`A T1-re a H1, a H2 és a T3 mutat; a T2-re a H1 és a H2. Közös: H1 és H2, tehát $(A^\top A)_{T1,T2} = 2$.
            A 3 a T1 befoka – az a főátló, $(A^\top A)_{T1,T1}$. A 0 az $(AA^\top)_{T1,T2}$ lenne: hány oldalra mutat a T1 is és a T2 is (egyre sem). Az 1 csak a H1-et számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a gráfban az első lépés hub-vektora ($H1, H2, T1, T2, T3$ sorrendben) $(1;\ 0{,}83;\ 0;\ 0;\ 0{,}5)$. Mennyi a T2 tekintélye a második lépésben, normálás előtt?`,
          options: [R`$1{,}83$`, R`$2$`, R`$2{,}33$`, R`$1{,}33$`],
          answer: 0,
          hint: "Ki mutat a T2-re? Az ő hub-pontszámukat add össze – ne a linkek számát.",
          explain: R`A T2-re a H1 és a H2 mutat: $a_{T2} = 1 + 0{,}83 = 1{,}83$. (Normálva a T1 $2{,}33$-ával: $\approx 0{,}79$, a határ 0,80.)
            A 2 a befok – az első lépés értéke, amikor még minden hub 1 volt. A $2{,}33 = 1 + 0{,}83 + 0{,}5$ a T1 értéke (rá a T3 is mutat). Az $1{,}33 = 0{,}83 + 0{,}5$ rossz forrásokat ad össze: a T3 nem a T2-re mutat.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lapok hivatkozási gráfjában ($\mathrm{EK}\to\mathrm{RH}$, $\mathrm{NY}\to\mathrm{EK}$, $\mathrm{VN}\to\mathrm{RH}$, $\mathrm{VN}\to\mathrm{NY}$) ki a legjobb tekintély és ki a legjobb hub?`,
          options: [
            R`tekintély: $\mathrm{RH}$; hub: $\mathrm{VN}$`,
            R`tekintély: $\mathrm{VN}$; hub: $\mathrm{RH}$`,
            R`tekintély: $\mathrm{RH}$; hub: $\mathrm{EK}$`,
            R`tekintély: $\mathrm{EK}$; hub: $\mathrm{VN}$`
          ],
          answer: 0,
          hint: "A tekintély a bejövő, a hub a kimenő élekből jön. Ki kapja a legtöbb (és legjobb) hivatkozást, és ki mutat a legjobbakra?",
          explain: R`Tekintély: $\mathrm{RH}$ 1, $\mathrm{NY}$ 0,62, a többi 0. Hub: $\mathrm{VN}$ 1, $\mathrm{EK}$ 0,62, a többi 0. A VN mindkét tekintélyre (RH, NY) mutat, ezért a legjobb hub.
            A „VN tekintély, RH hub” felcseréli a szerepeket: a VN-re senki sem mutat, az RH senkire. Az EK csak egy linket ad (az RH-ra), ezért gyengébb hub a VN-nél. Az EK tekintélye a határban 0: egyetlen hivatkozója, a NY, a határban 0 hub-pontszámú.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a HITS-ről? (Több jó válasz is lehet.)",
          options: [
            R`Annak az oldalnak, amelyre semmi sem mutat, 0 a tekintélye.`,
            R`Irányítatlan gráfon a hub- és a tekintély-vektor is a sajátvektor-centralitás lenne.`,
            R`Két, alig kapcsolódó tábor közül a HITS szinte csak a sűrűbbikben ad nagy értéket.`,
            R`A hub-pontszám a határban is a kifokkal arányos.`,
            R`A legtöbb linket kiosztó oldal mindig a legjobb hub.`
          ],
          answer: [0, 1, 2],
          hint: "Melyik állítás csak az első lépésre igaz? És mit díjaz a hub: a linkek számát vagy a linkelt oldalak minőségét?",
          explain: R`A tekintély a bejövő hub-pontszámok összege: bejövő él nélkül 0. Irányítatlan gráfon $A^\top = A$, így mindkét vektor az $A^2$, azaz az $A$ domináns sajátvektora. A domináns sajátvektor a legsűrűbb csoportra „ül rá” (politikai blogok: a top 10 tekintélyből 9 liberális).
            A hub még az első lépésben sem a kifok, hanem a kimenő szomszédok befokának összege; a határban a linkelt oldalak tekintélye számít. Ezért nem a legtöbbet linkelő blog (blogsforbush.com, 256 link) a legjobb hub.`
        }
      ]
    },

    /* ------------------------------------------------ 5.7 */
    "gh5-57": {
      title: "Kvíz – 5.7 Melyik centralitást mikor?",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Krackhardt sárkányában (élek $AB$, $AC$, $AD$, $AF$, $BD$, $BE$, $BG$, $CD$, $CF$, $DE$, $DF$, $DG$, $EG$, $FG$, $FH$, $GH$, $HI$, $IJ$) ki a köztességi centralitás győztese?`,
          options: [R`$H$`, R`$D$`, R`$F$ és $G$`, R`$I$`],
          answer: 0,
          hint: "Melyik csúcson megy át minden út a farok (I, J) és a sárkánytest között?",
          explain: R`A $H$ köztessége 14: a farok ($I$, $J$) és a test hét csúcsa közötti 14 pár mind rajta megy át. Csak 3 kapcsolata van – tipikus közvetítő. A $D$ a fokszám (6) és a sajátvektor győztese, de a köztessége csak 3,67. Az $F$ és a $G$ a közelségé (0,64), köztességük 8,33. Az $I$ köztessége 8 (a $J$ párjai), kevesebb, mint a $H$-é.`
        },
        {
          type: "single", shuffle: true,
          q: R`A sárkányban ($n = 10$) a $H$ nyers köztessége 14. Mennyi a normált köztessége?`,
          options: [R`$\approx 0{,}39$`, R`$\approx 0{,}31$`, R`$\approx 0{,}78$`, R`$\approx 1{,}56$`],
          answer: 0,
          hint: R`Hány olyan pár van, amely nem tartalmazza a $H$-t?`,
          explain: R`A $H$-t nem tartalmazó párok száma $\binom{9}{2} = 36$, így $14/36 \approx 0{,}39$. A $0{,}31 = 14/45$ az összes párral ($\binom{10}{2}$) oszt. A $0{,}78 = 28/36$ minden párt kétszer számol. Az $1{,}56 = 14/9$ a fokszám normálását ($n - 1$) keveri ide – egy normált köztesség nem lehet 1-nél nagyobb.`
        },
        {
          type: "match",
          q: "Párosítsd a kutatási kérdést a hozzá illő centralitással!",
          pairs: [
            ["„Kit említenek a legtöbb cikkben együtt másokkal?”", "fokszám (súlyozva: erősség)"],
            ["„Ki éri el leggyorsabban a többieket?”", "közelségi (vagy harmonikus)"],
            ["„Ki szűri az információt két tábor között?”", "köztesség"],
            ["„Ki van a fontosak között?” – irányítatlan gráf", "sajátvektor"],
            ["„Melyik forrás a legtekintélyesebb egy átvételi hálózatban?”", "PageRank"],
            ["„Ki gyűjt, ki az eredeti forrás?”", "HITS"]
          ],
          hint: "Minden centralitás más áramlást feltételez: csak a közvetlen kapcsolat, legrövidebb út mindenki felé, átmenő forgalom, végtelen sok lépés, véletlen séta irányított éleken, két szerep.",
          explain: R`A fokszám a közvetlen kapcsolatot (láthatóság), a közelségi a terjedés gyorsaságát, a köztesség az átmenő forgalmat méri. A sajátvektor a fontos szomszédokat jutalmazza irányítatlan gráfon; irányított hivatkozási hálózaton ugyanerre a PageRank való. A HITS két szerepet választ szét: hub (gyűjtő) és tekintély (eredeti forrás). A párosítás Borgatti gondolatát követi: a mérőszám feltevése illjen a jelenséghez.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 34 tagú karateklubban (Pearson-korreláció) melyik centralitáspár egyezik a <b>legkevésbé</b>?`,
          options: [R`közelségi – köztesség`, R`fokszám – PageRank`, R`fokszám – sajátvektor`, R`fokszám – köztesség`],
          answer: 0,
          hint: "Melyik kettő mér egészen más dolgot: a mindenkitől mért távolságot, illetve az átmenő utakat?",
          explain: R`A korrelációk: közelségi–köztesség 0,72 (a leggyengébb), fokszám–köztesség 0,91, fokszám–sajátvektor 0,92, fokszám–PageRank 1,00 (0,998). Irányítatlan gráfon a PageRank gyakorlatilag a fokszám, ezért ez a pár a legerősebb, nem a leggyengébb. Valós hálózatokon a centralitások általában erősen korrelálnak – ezért az <b>eltérő</b> csúcsok az érdekesek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy blog befoka a 10 legnagyobb között van, a PageRankje viszont csak a középmezőnyben. Mi a legvalószínűbb magyarázat?`,
          options: [
            R`Sokan idézik, de jelentéktelen, kevés pontszámú helyekről.`,
            R`Ő maga sok blogra linkel, ezért a PageRankje „szétoszlik”.`,
            R`Két tábor közötti közvetítő, ezért magas a köztessége.`,
            R`Egy sűrű csoport közepén ül, ezért a PageRank bünteti.`
          ],
          answer: 0,
          hint: "Miben különbözik a befok és a PageRank? Számít-e, honnan jön a link?",
          explain: R`A befok minden linket egyformán számol, a PageRank a linkelő oldal pontszámával (és kifokával) súlyoz. Magas befok, alacsony PageRank: sok, de gyenge hivatkozás. A saját kimenő linkjei a <b>saját</b> PageRankjét nem csökkentik, csak azt, amit továbbad. A köztesség és a „sűrű csoport közepe” más mérőszámok (köztesség, sajátvektor) eltéréseit magyarázza, nem ezt.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubban az edző (1-es) és az elnök (34-es) a két legfontosabb tag. Melyik állítás igaz a köztességre (normálva)?`,
          options: [
            R`Az edző az első: $0{,}44$, az elnök $0{,}30$.`,
            R`Az elnök az első: $0{,}52$, az edző $0{,}48$.`,
            R`Az elnök az első: $0{,}44$, az edző $0{,}30$.`,
            R`Holtverseny: mindkettő $0{,}44$.`
          ],
          answer: 0,
          hint: "Fokszám, sajátvektor és PageRank szerint az elnök az első. Ugyanaz-e a győztes minden centralitásnál?",
          explain: R`Köztesség (és közelség) szerint az edző az első: $0{,}44$ a $0{,}30$ ellen. A $0{,}52$ és $0{,}48$ a <b>fokszám</b>-centralitás ($17/33$ és $16/33$) – ott az elnök vezet. Ez a fejezet egyik fő tanulsága: a legmagasabb értékű csúcs nem mindig ugyanaz minden centralitásnál.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Magas centralitásból nem következik, hogy a szereplő befolyásolja a többieket.`,
            R`Különböző méretű gráfok között normált értékeket vagy rangsorokat érdemes összevetni.`,
            R`Ugyanazon a korpuszon egy másik élmodell (pl. ki kit bírál) más rangsort adhat.`,
            R`Ha egy csúcs fokszám szerint első, akkor minden más centralitás szerint is első.`,
            R`Egy köztességi értékről önmagában eldönthető, hogy meglepően nagy-e.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a módszertani józanság dobozra: okság, normálás, élmodell, nullmodell. És a sárkányra.",
          explain: R`A centralitás pozíciót mér, nem oksági hatást – befolyáshoz beavatkozás vagy időbeli adat kell. Normált értékek vagy rangsorok hasonlíthatók össze. A centralitás az élmodellhez képest „fontos”. A sárkányban a fokszám győztese ($D$) sem a közelség, sem a köztesség szerint nem első. Hogy egy érték „magas”-e, azt egy nullmodellhez (véletlen gráfhoz) kell mérni.`
        }
      ]
    },

    /* ------------------------------------------------ 5.8 */
    "gh5-58": {
      title: "Kvíz – 5.8 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában melyik centralitás teszi a Kormányt <b>egyértelműen</b> a Polgármester elé?`,
          options: [R`sajátvektor`, R`köztesség`, R`erősség`, R`közelségi`],
          answer: 0,
          hint: "Melyik mérőszám jutalmazza azt, ha a szomszédaid egymással is sűrűn össze vannak kötve?",
          explain: R`A sajátvektor szerint $\mathrm{Ko}$ 1, $\mathrm{Po}$ 0,87: a Kormány szomszédai ($\mathrm{Vi}$, $\mathrm{Sz}$, $\mathrm{Kl}$) a sűrű országos mag tagjai. A köztesség (8 a 5 ellen) és az erősség (8 a 6 ellen) éppen a Polgármestert teszi előre. A közelségi centralitás holtversenyt ad (0,75–0,75).`
        },
        {
          type: "multi",
          q: R`Az Árvízhéten melyik mérőszám szerint előzi meg a Polgármester a Kormányt (nem holtverseny)? (Több jó válasz is lehet.)`,
          options: [R`köztesség`, R`erősség`, R`PageRank`, R`fokszám`, R`harmonikus`],
          answer: [0, 1, 2],
          hint: "A fokszám 4–4. A távolságösszeg mindkettőnél 8. Melyik mérőszám lát mást?",
          explain: R`Köztesség: $\mathrm{Po}$ 8, $\mathrm{Ko}$ 5. Erősség: 8 és 6. PageRank: 0,196 és 0,190 – minimálisan. A fokszám (4–4, normálva 0,67–0,67) és a harmonikus (5–5) holtversenyt ad, ahogy a közelségi is (0,75–0,75). A Polgármester a <b>híd</b> a helyi és az országos szál között.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Esti Krónika szereplőgráfja: $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$. Mennyi a Szakértő (nyers) köztessége?`,
          options: [R`$2$`, R`$3$`, R`$4$`, R`$5$`],
          answer: 0,
          hint: R`Sorold fel a $\mathrm{Sz}$-et nem tartalmazó párokat, és nézd meg, melyik legrövidebb útja megy át rajta.`,
          explain: R`A $\mathrm{Sz}$-et nem tartalmazó párok: $\mathrm{Vi}$–$\mathrm{Kl}$ (csak $\mathrm{Vi}$–$\mathrm{Sz}$–$\mathrm{Kl}$), $\mathrm{Vi}$–$\mathrm{Ko}$ (csak $\mathrm{Vi}$–$\mathrm{Sz}$–$\mathrm{Ko}$), $\mathrm{Kl}$–$\mathrm{Ko}$ (szomszédos). Köztesség: <b>2</b>.
            A 3 a fokszám. A 4 minden párt kétszer számol. Az 5 a végpontként érintett 3 párt is beszámolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik lap saját szereplőgráfjában a Kormány a központi szereplő?`,
          options: [R`egyikében sem`, R`a Reggeli Hírlapéban`, R`az Esti Krónikáéban`, R`a Vidéki Naplóéban`],
          answer: 0,
          hint: "Nézd végig a négy lap szereplőgráfját: háromszög, Szakértő-központú gráf, háromszög, csillag. Melyikben szerepel egyáltalán a Kormány?",
          explain: R`A Kormány csak két lapban szerepel. A Reggeli Hírlap háromszögében ($\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$) mindenki egyforma; az Esti Krónikában a Szakértő a központ (fokszám 3, köztesség 2). A Vidéki Napló csillagának közepén a Polgármester áll, a Kormány ott nem is szerepel.
            Az összesített gráfban mégis az élen van – az összesítés elfedi, hogy a lapok más-más szereplő köré szervezik a történetet.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 2004-es politikai blogok hálózatában (586 liberális, 636 konzervatív blog) a 10 legjobb HITS-tekintélyből csak 1 konzervatív, a PageRank szerint 6. Mi a legjobb magyarázat?`,
          options: [
            R`A liberális blogok linkjei sűrűbben fonódnak össze, és az $A^\top A$ domináns sajátvektora erre a csoportra „ül rá”.`,
            R`A liberális blogok valóban tekintélyesebbek voltak, ezt a HITS pontosabban méri.`,
            R`A liberális blogok voltak többen, ezért több jut nekik a tekintélyből.`,
            R`A HITS a kifokkal oszt, ezért bünteti a sokat linkelő konzervatív blogokat.`
          ],
          answer: 0,
          hint: "Mit tud a HITS egy két táborra szakadt gráfon? Melyik csoportra fókuszál a domináns sajátvektor?",
          explain: R`A HITS a legsűrűbb csoportot jutalmazza: a domináns sajátvektor szinte csak a sűrűbb táborban ad nagy értéket. Ez a módszer sajátossága, nem tartalmi eredmény – a befok és a PageRank (6–6 konzervatív a top 10-ben) nem támasztja alá a liberális fölényt.
            A konzervatív blogok voltak többen (636), nem a liberálisok. Kifokkal a PageRank oszt, a HITS nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`A legtöbbet linkelő blog (blogsforbush.com, 256 kimenő link) mégsem a legjobb hub. Miért?`,
          options: [
            R`A hub-pontszám a linkelt oldalak tekintélyét díjazza, nem a linkek számát.`,
            R`A hub-pontszám a befok, és erre a blogra kevesen linkelnek.`,
            R`A HITS a sok kimenő linket kifokkal osztja, ezért a sok link büntetést jelent.`,
            R`A konzervatív blogokat a HITS kizárja a számításból.`
          ],
          answer: 0,
          hint: R`$h_i = \sum_{i \to j} a_j$. Mi számít: hány tag van az összegben, vagy mekkorák?`,
          explain: R`A hub a kimenő szomszédok tekintélyének összege. Ha a 256 link nagy része alacsony tekintélyű (a sűrű liberális magon kívüli) blogra mutat, az összeg kicsi marad. A hub nem a befokból jön (az a tekintély első lépése), és a HITS nem oszt kifokkal – az a PageRank. Senkit nem zár ki; a liberális tábor dominanciája a sűrűségből jön.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a politikai blogok elemzésére? (Több jó válasz is lehet.)",
          options: [
            R`A befok és a PageRank majdnem ugyanazt mutatja: a top 10-ből 9 közös.`,
            R`A linkeknek csak kis része (kb. 9%) fut a két tábor között.`,
            R`A 10 legjobb HITS-hub között nincs konzervatív blog.`,
            R`A HITS-tekintély eredménye bizonyítja, hogy a liberális blogok uralták a vitát.`,
            R`A címkék (liberális / konzervatív) hibátlanok, mert kézzel adták őket.`
          ],
          answer: [0, 1, 2],
          hint: "Melyik állítás von le tartalmi következtetést egyetlen mérőszámból? És mit mond a szöveg a címkékről?",
          explain: R`A befok és a PageRank rangkorrelációja 0,94, a top 10-ből 9 közös. A $19\,021$ linknek 8,8%-a fut a táborok között. A hub top 10-ben 0 konzervatív van. Ha csak a HITS-et közölnénk, hamis képet kapnánk – a befok és a PageRank ezt nem támasztja alá. A címkék részben blogkönyvtárakból, részben kézzel készültek, és mindkettő hibás lehet.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh5-final": {
      title: "Fejezetzáró teszt – 5. Centralitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 21 csúcsú gráfban az $u$ fokszáma 8, egy 6 csúcsú gráfban a $v$ fokszáma 4. Mennyi a normált fokszám-centralitásuk?`,
          options: [
            R`$u$: $0{,}4$; $v$: $0{,}8$`,
            R`$u$: $0{,}38$; $v$: $0{,}67$`,
            R`$u$: $8$; $v$: $4$`,
            R`$u$: $0{,}8$; $v$: $0{,}4$`
          ],
          answer: 0,
          hint: R`Hány lehetséges szomszédja van egy csúcsnak egy $n$ csúcsú egyszerű gráfban?`,
          explain: R`$C_{\text{fok}} = d/(n-1)$: $8/20 = 0{,}4$ és $4/5 = 0{,}8$ – a kis gráf csúcsa a központibb, a kisebb nyers szám ellenére. A $0{,}38$ és $0{,}67$ $n$-nel oszt ($8/21$, $4/6$), akkor a mindenkit ismerő csúcs sem érné el az 1-et. A nyers 8 és 4 különböző méretű gráfok között félrevezet. Az utolsó opció felcseréli a kettőt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Súlyozott, irányított gráf: $A\to B$ (súly 3), $C\to B$ (1), $B\to D$ (2), $A\to D$ (1). Mennyi a $B$ súlyozott befoka?`,
          options: [R`$4$`, R`$2$`, R`$6$`, R`$3$`],
          answer: 0,
          hint: "Csak a B-be érkező éleket nézd, és a súlyukat add össze.",
          explain: R`A $B$-be az $A$ (3) és a $C$ (1) mutat: súlyozott befok $3 + 1 = 4$. A 2 a súlyozatlan befok (és véletlenül a súlyozott kifok is) – az a kapcsolatok száma, nem a mennyisége. A 6 a súlyozott be- és kifok összege, a 3 a súlyozatlané. Befokot és kifokot ne adj össze: két külön kérdés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $BC$, $CD$, $CE$. Mennyi a $D$ közelségi centralitása?`,
          options: [R`$0{,}5$`, R`$8$`, R`$0{,}625$`, R`$0{,}125$`],
          answer: 0,
          hint: R`Számold ki a $D$ távolságát mindenkitől, add össze, és használd a $(n-1)/\sum\operatorname{dist}$ képletet.`,
          explain: R`Távolságok a $D$-től: $C$ 1, $B$ 2, $E$ 2, $A$ 3; összeg 8. $C_{\text{köz}} = 4/8 = 0{,}5$. A 8 a távolságösszeg – ott a kisebb a jobb, nem centralitás. A $0{,}625 = 5/8$ $n$-nel szoroz, nem $n - 1$-gyel. A $0{,}125 = 1/8$ elhagyja az $n - 1$ szorzót.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $1$–$2$, $2$–$3$, $3$–$4$, $5$–$6$ (két komponens). Mennyi az 1-es csúcs harmonikus centralitása (nem normálva)?`,
          options: [R`$\approx 1{,}83$`, R`$\approx 0{,}37$`, R`$0$`, R`$6$`],
          answer: 0,
          hint: R`Elérhetetlen csúcs: $1/\infty = 0$. A többieknél add össze a távolságok reciprokát.`,
          explain: R`Távolságok: 2-es 1, 3-as 2, 4-es 3, az 5-ös és a 6-os elérhetetlen. $C_{\text{harm}} = 1 + \tfrac12 + \tfrac13 + 0 + 0 = \tfrac{11}{6} \approx 1{,}83$. A $0{,}37 = \tfrac{11}{30}$ a normált érték (osztva $n - 1 = 5$-tel), de nem azt kérdeztük. A 0 a közelségi képlet eredménye a végtelen távolságösszeg miatt. A 6 az elérhető csúcsok távolságösszege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $BD$, $CD$, $DE$. Mennyi a $D$ köztessége (nyersen)?`,
          options: [R`$3{,}5$`, R`$4$`, R`$7$`, R`$3$`],
          answer: 0,
          hint: R`A $D$-t nem tartalmazó párok közül melyiknek van több legrövidebb útja? Ott csak törtet kap.`,
          explain: R`$A$–$E$: két út ($A$–$B$–$D$–$E$, $A$–$C$–$D$–$E$), mindkettő a $D$-n át: 1. $B$–$E$, $C$–$E$: 1 + 1. $B$–$C$: két út ($B$–$A$–$C$, $B$–$D$–$C$), csak az egyik a $D$-n: $\tfrac12$. $A$–$B$, $A$–$C$: szomszédosak. Összesen $3{,}5$.
            A 4 a $B$–$C$ párt egészben adja oda. A 7 minden párt kétszer számol. A 3 a $B$–$C$ párt kihagyja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 7 csúcsú út közepének (4-es) nyers köztessége 9. Mennyi a normált köztessége?`,
          options: [R`$0{,}6$`, R`$\approx 0{,}43$`, R`$1{,}5$`, R`$0{,}3$`],
          answer: 0,
          hint: R`A normálás a $v$-t nem tartalmazó párok számával oszt.`,
          explain: R`$\binom{6}{2} = 15$ pár nem tartalmazza a 4-est: $9/15 = 0{,}6$. A $0{,}43 = 9/21$ az összes párral ($\binom72$) oszt. Az $1{,}5 = 9/6$ a fokszám-normálást ($n - 1$) használja. A $0{,}3 = 9/30$ a rendezett párokkal (kétszer) számol a nevezőben.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 10 csúcsú csillagban (közép + 9 levél) a közép sajátvektor-centralitása 1. Mennyi egy levélé?`,
          options: [R`$\approx 0{,}33$`, R`$\approx 0{,}11$`, R`$0{,}5$`, R`$3$`],
          answer: 0,
          hint: R`Legyen a levél $y$. Írd fel $\lambda y$-t és $\lambda \cdot 1$-et a szomszédok összegeként.`,
          explain: R`A levélnek egy szomszédja van: $\lambda y = 1$. A középnek 9 levele: $\lambda = 9y$. Ebből $\lambda^2 = 9$, $\lambda = 3$, $y = \tfrac13 \approx 0{,}33$. A $0{,}11 = 1/9$ a fokszámok aránya – a sajátvektor nem a fokszám. A $0{,}5$ a 4 levelű csillag eredménye. A 3 a sajátérték, nem a centralitás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított lánc: $A\to B\to C\to D$. Melyik állítás igaz?`,
          options: [
            R`A „beérkező” sajátvektor-centralitás mindenkinek 0, a PageRank mindenkinek pozitív, és a $D$-é a legnagyobb.`,
            R`A sajátvektor-centralitás a $D$-nek a legnagyobb, a PageRank mindenkinek egyforma.`,
            R`Mindkettő mindenkinek 0, mert a gráf körmentes.`,
            R`A PageRank az $A$-nak a legnagyobb, mert ő linkel elsőként.`
          ],
          answer: 0,
          hint: "Az A-ra senki sem mutat. Mi terjed tovább a sajátvektornál? És mit ad a teleportálás?",
          explain: R`A sajátvektornál az $A$ nullája végigfut: $x_B \propto x_A = 0$, és így tovább – körmentes gráfon csupa 0. A PageRankben a teleportálás mindenkinek ad $\frac{0{,}15}{4}$-et, és a pontszám előrefolyik: $0{,}116$; $0{,}215$; $0{,}299$; $0{,}370$ – a $D$ (zsákutca) a legnagyobb. A PageRank pont ezért kell irányított gráfon.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lapok hivatkozási gráfjában $\alpha = 0{,}85$-nél $p_{\mathrm{RH}} = 0{,}416$, $p_{\mathrm{VN}} = 0{,}126$. Mi történik, ha $\alpha = 0{,}5$-re csökkentjük?`,
          options: [
            R`A pontszámok közelebb kerülnek egymáshoz: az RH 0,347-re csökken, a VN 0,168-ra nő.`,
            R`A pontszámok szétszóródnak: az RH nő, a VN csökken.`,
            R`Semmi: a PageRank nem függ az $\alpha$-tól, csak a sebessége.`,
            R`A VN 0 lesz, mert kevesebb a link követése.`
          ],
          answer: 0,
          hint: R`Mi történik $\alpha = 0$-nál? Kisebb $\alpha$: több vagy kevesebb teleportálás?`,
          explain: R`Kisebb $\alpha$ = több teleportálás, az eloszlás az egyenletes $\tfrac14$ felé tolódik: RH 0,347, EK 0,274, NY 0,211, VN 0,168. Az $\alpha$ szerepét felcserélő gondolkodás adná a „szétszóródást”. A határeloszlás igenis függ $\alpha$-tól. A VN sosem lesz 0, mert a teleportálásból mindig kap.`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf: $A\to C$, $B\to C$, $B\to D$. Mi a HITS határban kapott hub-vektora (max = 1)?`,
          options: [
            R`$B = 1$, $A \approx 0{,}62$, $C = D = 0$`,
            R`$A = B = 1$, $C = D = 0$`,
            R`$C = 1$, $D \approx 0{,}62$, $A = B = 0$`,
            R`$B = 1$, $A = 0{,}5$, $C = D = 0$`
          ],
          answer: 0,
          hint: R`Előbb a tekintély: $C$-re ketten mutatnak, $D$-re egy. Aztán: $A$ csak a $C$-re mutat, $B$ mindkettőre. Ismételd, amíg az arány be nem áll.`,
          explain: R`Tekintély: $C$ 1, $D \approx 0{,}62$; hub: $h_A = a_C = 1$, $h_B = a_C + a_D \approx 1{,}62$, normálva $B = 1$, $A \approx 0{,}62$. (Ez az $AA^\top$ $\begin{pmatrix}1&1\\1&2\end{pmatrix}$ blokkjának domináns sajátvektora, $(\sqrt5-1)/2 \approx 0{,}62$.)
            Az „$A = B = 1$” mindkettőnek ugyanannyi tekintélyt tulajdonít. A „$C = 1$, $D = 0{,}62$” a tekintély-vektor – felcserélt szerepek. Az „$A = 0{,}5$” a kifokot normálja (1 és 2): a hub nem kifok.`
        },
        {
          type: "single", shuffle: true,
          q: R`Krackhardt sárkányában a $D$ fokszáma 6 (a legnagyobb), sajátvektor-centralitása 1, a köztessége viszont csak 3,67 (a $H$-é 14). Mit árul el ez az eltérés a $D$-ről?`,
          options: [
            R`Egy sűrű csoport belsejében ül, kifelé nem közvetít.`,
            R`Két csoport közötti közvetítő, strukturális lyukat hidal át.`,
            R`Kevés, de fontos kapcsolata van az elit közelében.`,
            R`Sokan idézik, de jelentéktelen helyekről.`
          ],
          answer: 0,
          hint: "Az 5.7 hüvelykujjszabálya: két centralitás eltérése mit jelent? Itt magas a fokszám, alacsony a köztesség.",
          explain: R`Magas fokszám, alacsony köztesség: a csúcs egy sűrű csoport közepén van, a szomszédai egymással is össze vannak kötve, ezért kevés legrövidebb út megy át rajta. A közvetítő a fordított eset (magas köztesség, alacsony fokszám) – ez a $H$. A „kevés, de fontos kapcsolat” a magas sajátvektor és közepes fokszám esete, a „gyenge helyekről idézik” a magas befok és alacsony PageRank esete.`
        },
        {
          type: "match",
          q: "Párosítsd a leírást a centralitással!",
          pairs: [
            ["akin át sok legrövidebb út fut", "köztesség"],
            ["akinek a szomszédai is fontosak (irányítatlan gráf)", "sajátvektor-centralitás"],
            ["véletlen szörföző, teleportálással", "PageRank"],
            ["a távolságok reciprokának összege", "harmonikus centralitás"],
            ["n − 1 osztva a távolságösszeggel", "közelségi centralitás"],
            ["akire jó gyűjtők mutatnak", "HITS-tekintély"]
          ],
          hint: "Gondold végig a fejezet összefoglaló táblázatát: képlet és „mit mér?”.",
          explain: R`Köztesség: $\sum \sigma_{st}(v)/\sigma_{st}$, az átmenő legrövidebb utak. Sajátvektor: $A\mathbf x = \lambda_1\mathbf x$. PageRank: a teleportálásos véletlen séta stacionárius eloszlása. Harmonikus: $\sum 1/\operatorname{dist}$, nem összefüggő gráfon is működik. Közelségi: $(n-1)/\sum\operatorname{dist}$ – csak összefüggő gráfon. HITS-tekintély: $\mathbf a = A^\top\mathbf h$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Vidéki Napló szereplőgráfja csillag: a Polgármester középen, a Vízügy, a Lakók és az Önkéntesek a levelek. Mennyi a Polgármester normált köztessége?`,
          options: [R`$1$`, R`$3$`, R`$0{,}5$`, R`$0{,}75$`],
          answer: 0,
          hint: R`Hány pár nem tartalmazza a Polgármestert, és ezek közül hánynak megy át rajta a legrövidebb útja?`,
          explain: R`A három levél közötti $\binom32 = 3$ pár mind a közepen megy át: nyers köztesség 3. Normálva $3/\binom{3}{2} = 1$ – a csillag közepe a maximumot éri el. A 3 a nyers érték. A $0{,}5 = 3/\binom42$ az összes párral oszt. A $0{,}75 = 3/4$ a csúcsok számával oszt.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Irányítatlan gráfon a PageRank majdnem a fokszám.`,
            R`Körmentes irányított gráfon a „beérkező” sajátvektor-centralitás mindenkinek 0.`,
            R`A HITS első lépésében ($\mathbf h = \mathbf 1$) a tekintély-vektor a befok.`,
            R`A köztességben az $s$–$t$ út végpontjai is kapnak pontot.`,
            R`A közelségi centralitás nem összefüggő gráfon is gond nélkül használható.`
          ],
          answer: [0, 1, 2],
          hint: "Két állítás egy-egy tipikus hibát fogalmaz meg: a végpont beszámolását és a végtelen távolságot.",
          explain: R`Irányítatlan gráfon a PageRank teleportálás nélkül $d_i/2m$ lenne (a karateklubon a korreláció 0,998). Körmentes gráfon a nulla végigfut, az egyetlen sajátérték 0. A HITS az első lépésben a befokot adja, aztán finomít.
            A köztesség csak a <b>belső</b> csúcsokat jutalmazza. Nem összefüggő gráfon a távolságösszeg végtelen, a közelségi képlet 0-t ad – ott a harmonikus kell.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
