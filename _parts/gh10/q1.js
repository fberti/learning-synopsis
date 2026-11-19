    /* ------------------------------------------------ 10.1 */
    "gh10-101": {
      title: "Kvíz – 10.1 Élátfedés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két hálózat ugyanazon a négy csúcson. Élek: $E_A = \{AB, AC, AD, BC\}$, $E_B = \{AB, AC, CD\}$. Mennyi a Jaccard-index, $J$?`,
          options: [R`$2/5 = 0{,}4$`, R`$2/7 \approx 0{,}286$`, R`$2/3 \approx 0{,}667$`, R`$2/4 = 0{,}5$`],
          answer: 0,
          hint: R`Számláló: hány él van meg mindkettőben? Nevező: hány él van meg legalább az egyikben – és ne számold a közöseket kétszer.`,
          explain: R`Közös: $AB$, $AC$ (2 él). Unió: $AB$, $AC$, $AD$, $BC$, $CD$, azaz $4 + 3 - 2 = 5$ él. $J = 2/5 = 0{,}4$. A $2/7$ az összeggel oszt ($4 + 3$) – így a két közös él kétszer kerül a nevezőbe. A $2/3$ a kisebbik élhalmazzal oszt (ez az átfedési együttható, nem a Jaccard). A $2/4$ csak az $E_A$ méretével oszt, és figyelmen kívül hagyja, hogy a $CD$ csak a $B$-ben van meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Vidéki Napló és a Nyitott Szó súlyozott szereplőgráfja (súly = közös cikkek): VN $\{\mathrm{Po}\text{–}\mathrm{Vi}\ 1,\ \mathrm{Po}\text{–}\mathrm{La}\ 1,\ \mathrm{Po}\text{–}\text{Ön}\ 1\}$, NY $\{\mathrm{Po}\text{–}\mathrm{La}\ 1,\ \mathrm{Po}\text{–}\text{Ön}\ 1,\ \mathrm{La}\text{–}\text{Ön}\ 3\}$. Mennyi a súlyozott Jaccard-index, $J_w$?`,
          options: [R`$1/3 \approx 0{,}333$`, R`$1/2 = 0{,}5$`, R`$1/4 = 0{,}25$`, R`$2/5 = 0{,}4$`],
          answer: 0,
          hint: R`Írd egymás alá a négy csúcspárt, ahol legalább az egyik lapban van él. Cellánként a kisebbik súly megy a számlálóba, a nagyobbik a nevezőbe.`,
          explain: R`$\min$: $0, 1, 1, 0$ → 2. $\max$: $1, 1, 1, 3$ → 6. $J_w = 2/6 = 1/3$. A $0{,}5$ a bináris $J$ (2 közös él a 4-ből) – a súlyt elfelejti, pedig a NY legerősebb kapcsolata, a $\mathrm{La}\text{–}\text{Ön}$ (3), a VN-ből hiányzik. A $0{,}25$ a két teljes súly összegével oszt ($3 + 5 = 8$) a $\max$-ok összege ($8 - 2 = 6$) helyett. A $0{,}4$ csak a NY teljes súlyával (5) oszt. Lásd a <a class="xref" href="#s101-b">10.1 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két súlyozott hálózat négy csúcspáron: $A = (3, 1, 0, 2)$, $B = (1, 2, 2, 2)$. Mennyi a $J_w$?`,
          options: [R`$4/9 \approx 0{,}444$`, R`$4/7 \approx 0{,}571$`, R`$3/4 = 0{,}75$`, R`$4/13 \approx 0{,}308$`],
          answer: 0,
          hint: R`A $\sum\max$-ba azok a csúcspárok is beletartoznak, ahol csak az egyik hálózatban van él.`,
          explain: R`$\min$: $1, 1, 0, 2$ → 4. $\max$: $3, 2, 2, 2$ → 9. $J_w = 4/9 \approx 0{,}444$. A $4/7$ csak a közös éleken számol (a harmadik párt kihagyja a nevezőből) – ez felfelé torzít. A $3/4$ a bináris $J$: 3 közös él a 4-ből, a súly elveszik. A $4/13$ a két teljes súly összegével ($6 + 7$) oszt; a helyes nevező $6 + 7 - 4 = 9$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $A$ hálózat teljes súlya 9, a $B$-é 6, és a kisebbik súlyok összege $\sum\min = 3$. Mennyi a $J_w$?`,
          options: [R`$0{,}25$`, R`$0{,}2$`, R`$0{,}5$`, R`$0{,}333$`],
          answer: 0,
          hint: R`Használd az azonosságot: $\max(x, y) = x + y - \min(x, y)$. Mit ad ez összegezve?`,
          explain: R`$\sum\max = 9 + 6 - 3 = 12$, $J_w = 3/12 = 0{,}25$. A $0{,}2 = 3/15$ a két teljes súly összegével oszt – a közös „mennyiséget” kétszer számolja. A $0{,}5 = 3/6$ a kisebbik hálózat súlyával oszt, a $0{,}333 = 3/9$ a nagyobbikéval; egyik sem a $\max$-ok összege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy lap pontosan ugyanazokról a szereplőpárokról ír, mint a Vidéki Napló, csak kétszer annyit: a súlyai $(2, 2, 2)$ a VN $(1, 1, 1)$-e helyett. Mennyi a két lap bináris és súlyozott Jaccard-indexe?`,
          options: [
            R`$J = 1$, $J_w = 0{,}5$`,
            R`$J = 1$, $J_w = 1$`,
            R`$J = 0{,}5$, $J_w = 0{,}5$`,
            R`$J = 1$, $J_w \approx 0{,}333$`
          ],
          answer: 0,
          hint: R`Binárisan ugyanazok az élek? Súlyozottan: cellánként mennyi a kisebbik és a nagyobbik?`,
          explain: R`Az élhalmaz ugyanaz, ezért $J = 1$. Súlyozottan $\sum\min = 3$, $\sum\max = 6$, $J_w = 0{,}5$ – pedig arányaiban ugyanazt írja a két lap. Ez a terjedelem és a tartalom összekeverése: ha a szerkezet érdekel, előbb normáld a súlyokat (arányok), és akkor $J_w = 1$. A „$J_w = 1$” opció a normálást már elvégzettnek veszi. A $J = 0{,}5$ a súlyozott eredményt keveri a binárissal. A $0{,}333 = 3/9$ a súlyok összegével oszt.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A $J = 0{,}5$ azt mondja meg, mekkora az átfedés – azt nem, hogy ez több-e, mint ami véletlenül kijönne.`,
            R`Ha minden súly 0 vagy 1, a súlyozott Jaccard megegyezik a binárissal.`,
            R`Egy kicsi és egy nagy lap szerkezetének összevetése előtt érdemes a súlyokat a lap teljes súlyával normálni.`,
            R`A súlyozott Jaccard sosem lehet nagyobb a binárisnál.`,
            R`Ha az $A$ összes éle megvan a $B$-ben, akkor $J(A, B) = 1$.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj egy olyan esetre, ahol a közös élek nagy súlyúak, a csak egyikben meglévők kicsik. És mi van, ha a $B$-nek sokkal több éle van?`,
          explain: R`Igaz az első: a Jaccard leíró szám, nem szignifikancia – két sűrű hálózatnak véletlenül is sok közös éle van; hogy mihez mérjük, a <a class="xref" href="#s103">10.3</a> témája. Igaz a második: 0/1 súlynál a $\min = 1$ pontosan a közös éleken, a $\max = 1$ pontosan az unión. Igaz a harmadik: különben a $J_w$ a terjedelmet méri. Hamis a negyedik: $A = (5, 1, 0)$, $B = (5, 0, 1)$ esetén $J = 1/3$, de $J_w = 5/7 \approx 0{,}71$. Hamis az ötödik: ha az $A$ 5 éle mind megvan a 20 élű $B$-ben, $J = 5/20 = 0{,}25$ – a nagyon különböző élszám lehúzza.`
        },
        {
          type: "match",
          q: "Párosítsd a képlet részét a jelentésével!",
          pairs: [
            [R`$|E_A \cap E_B|$`, "a közös élek száma"],
            [R`$|E_A \cup E_B|$`, "a legalább az egyikben meglévő élek száma"],
            [R`$\sum \min(a_{ij}, b_{ij})$`, "a kisebbik súlyok összege"],
            [R`$\sum \max(a_{ij}, b_{ij})$`, "a két teljes súly összege mínusz a közös rész"],
            [R`$|E_A| + |E_B|$`, "az unió, de a közös élek kétszer számolva"]
          ],
          hint: R`A súlyozott változat a bináris „általánosítása”: melyik felel meg a metszetnek, és melyik az uniónak?`,
          explain: R`A Jaccard számlálója a metszet, nevezője az unió ($|E_A| + |E_B| - |E_A \cap E_B|$). A súlyozott változatban a metszet szerepét a $\sum\min$, az unióét a $\sum\max$ veszi át, és $\sum\max = \sum a + \sum b - \sum\min$. Az $|E_A| + |E_B|$ az „összeggel osztás” tipikus hibájának nevezője: a közös éleket kétszer számolja.`
        }
      ]
    },

    /* ------------------------------------------------ 10.2 */
    "gh10-102": {
      title: "Kvíz – 10.2 Mátrixkorreláció",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány cella kerül a mátrixkorrelációba egy 12 csúcsú irányított hálózatnál?`,
          options: [R`$132$`, R`$66$`, R`$144$`, R`$78$`],
          answer: 0,
          hint: R`A főátló kimarad. Irányított hálózatban az $(i, j)$ és a $(j, i)$ ugyanaz a cella?`,
          explain: R`Irányítottnál minden $i \ne j$ cella külön kapcsolat: $N = n(n-1) = 12 \cdot 11 = 132$. A $66 = 12 \cdot 11/2$ az irányítatlan eset – irányítottnál az $a_{ij}$ és az $a_{ji}$ két különböző kapcsolat (ki kitől kér tanácsot). A $144 = 12^2$ a főátlót is beszámolja, pedig az önhurok nem kapcsolat két szereplő között. A $78 = 12 \cdot 13/2$ az irányítatlan felső háromszög a főátlóval együtt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két bináris hálózat 6 csúcson (15 cella). Az $A$-ban 4 él van, a $B$-ben 3, ebből 2 közös. Mennyi a $\varphi$-együttható?`,
          options: [R`$\approx 0{,}452$`, R`$0{,}4$`, R`$\approx 0{,}503$`, R`$\approx 0{,}667$`],
          answer: 0,
          hint: R`Töltsd ki a 2×2-es táblát: $a$ = mindkettőben, $b$ = csak $A$, $c$ = csak $B$, $d$ = egyikben sem. A $d$-hez a cellák teljes száma kell.`,
          explain: R`$a = 2$, $b = 2$, $c = 1$, $d = 15 - 5 = 10$. $\varphi = \dfrac{2 \cdot 10 - 2 \cdot 1}{\sqrt{4 \cdot 11 \cdot 3 \cdot 12}} = \dfrac{18}{\sqrt{1584}} \approx 0{,}452$. A $0{,}4 = 2/5$ a Jaccard-index – az a közös hiányokat ($d$) nem nézi, a korreláció igen. A $0{,}503$ elhagyja a $bc$ tagot a számlálóból. A $0{,}667 = 2/3$ a közös élek aránya a kisebbik élhalmazhoz – az sem korreláció.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 4 szereplős VN–NY példában ($\mathrm{Po}$, $\mathrm{Vi}$, $\mathrm{La}$, $\text{Ön}$; $a = 2$, $b = 1$, $c = 1$, $d = 2$) $\varphi = 1/3$. Hozzáveszel egy ötödik szereplőt, aki egyik lapban sem szerepel. Mennyi lesz a $\varphi$?`,
          options: [R`$11/21 \approx 0{,}524$`, R`$1/3$, nem változik`, R`$5/12 \approx 0{,}417$`, R`$33/54 \approx 0{,}611$`],
          answer: 0,
          hint: R`Hány új csúcspár keletkezik egy ötödik csúccsal, és melyik betűhöz ($a$, $b$, $c$, $d$) kerülnek?`,
          explain: R`Az új csúcs 4 új cellát hoz, mind „egyik sem”: $d = 2 + 4 = 6$, $N = 10$. $\varphi = (2 \cdot 6 - 1)/\sqrt{3 \cdot 7 \cdot 3 \cdot 7} = 11/21 \approx 0{,}524$. Az „1/3, nem változik” a csúcshalmazt semleges döntésnek veszi – pedig a közös hiányok egyezésnek számítanak, és felhúzzák a korrelációt. Az $5/12$ csak egy új cellát számol ($d = 3$). A $0{,}611$ a 7 szereplős eredmény (15 új „egyik sem” cellával). Lásd a <a class="xref" href="#s102-a">10.2 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 21 fős szervezet irányított tanácskérési hálózatában hány cellában szerepel egy adott ember (kérdezőként vagy megkérdezettként)?`,
          options: [R`40 a 420-ból`, R`20 a 420-ból`, R`20 a 210-ből`, R`40 a 441-ből`],
          answer: 0,
          hint: R`Irányított hálózat: a sora és az oszlopa is az övé. Hány cella van összesen a főátló nélkül?`,
          explain: R`A sora 20 cella (akiktől ő kér tanácsot), az oszlopa 20 (akik tőle kérnek): 40 a $21 \cdot 20 = 420$ cellából. Ennyi cella mozdul együtt, ha az illetőnek van egy „szokása” – ez a sor- és oszlopautokorreláció. A „20 a 420-ból” csak a sort nézi. A „20 a 210-ből” irányítatlannak veszi a hálózatot. A „40 a 441-ből” a főátlót is a cellák közé számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szimuláció: két egymástól teljesen független súlyozott hálózat 20 csúcson, mindkettőben erős csúcsonkénti „aktivitással”. Nagyjából milyen gyakran ad $p \lt 0{,}05$-öt a naiv korrelációs próba, és milyen gyakran a QAP?`,
          options: [
            R`naiv kb. 46–48%, QAP kb. 5%`,
            R`mindkettő kb. 5%`,
            R`naiv kb. 5%, QAP kb. 46–48%`,
            R`mindkettő kb. 46–48%`
          ],
          answer: 0,
          hint: R`A két hálózat független, tehát a „helyes” arány 5% lenne. Melyik próba feltételezi, hogy a cellák függetlenek – és itt teljesül-e ez?`,
          explain: R`A naiv próba független cellákat feltételez; a csúcshatás miatt egy csúcs összes cellája együtt mozog, a korreláció ingadozása sokkal nagyobb, ezért erős csúcshatásnál kb. minden második „felfedezés” hamis (46–48%). A QAP a csúcsokat permutálja, így a függőség a nulleloszlásban is megmarad: végig 5% körül (4,5–6%) marad. A „mindkettő 5%” csak csúcshatás nélkül igaz (ott a naiv is 4,5%). A fordított párosítás a két próbát cseréli fel. Lásd a <a class="xref" href="#s102-b">10.2 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 7 szereplős VN–NY-ban $\varphi = 0{,}611$, a naiv próba $t = 3{,}37$, $p = 0{,}003$. Miért nem hihető ez a p-érték?`,
          options: [
            R`Mert a 21 cella nem független: egy csúcs összes cellája együtt mozog (a VN csillagának mindhárom éle a $\mathrm{Po}$-n megy át).`,
            R`Mert a 21 cella túl kevés – 200 csúcson a naiv próba már megbízható lenne.`,
            R`Mert a korreláció bináris adaton nem értelmezhető.`,
            R`Mert a $\varphi$ a Jaccard-indexnél mindig nagyobb, ezért túlbecsüli a hasonlóságot.`
          ],
          answer: 0,
          hint: R`Mit feltételez a szokásos korrelációs próba a megfigyelésekről? Képzeld el, hogy a VN csillagának közepe a $\mathrm{Ko}$ lenne.`,
          explain: R`A szokásos próba 21 független cellapárral számol. De ha a csillag közepe máshová kerülne, mind a három egyezés egyszerre tűnne el: a diádok közös csúcson osztoznak (sor- és oszlopautokorreláció). A valódi információ jóval kevesebb, ezért a p túl kicsi. A „nagy $N$ megment” tévhit: több csúcs több cellát ad, de a függőség megmarad, és a próba még magabiztosabban téved. A bináris korreláció értelmes (ez a $\varphi$). A $\varphi$ és a $J$ más-más dolgot mér; a p-érték hibája nem ebből jön. A QAP-próba ugyanerre $p = 0{,}086$-ot ad: <a class="xref" href="#s103-a-5040">10.3</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a mátrixkorrelációra és a naiv próbára? (Több jó válasz is lehet.)",
          options: [
            R`A mátrixkorreláció maga lehet jó leíró szám; a naiv próba p-értéke a hamis.`,
            R`Irányított hálózatban az $a_{ij}$ és az $a_{ji}$ két külön cella.`,
            R`Ritka hálózatok $\varphi$-je az élszámoktól függően nem mehet le $-1$-ig.`,
            R`Csúcshatás nélkül is a naiv próba az esetek közel felében hamis riasztást ad.`,
            R`Irányítatlan gráfban mindkét fél ($a_{ij}$ és $a_{ji}$) beszámolása pontosabb p-értéket ad, mert duplázza az elemszámot.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi a különbség a leíró szám és a próba között? És mit csinál a duplázás a korrelációval, illetve az elemszámmal?`,
          explain: R`Igaz az első: a gond a függetlenségi feltevés, nem a korreláció. Igaz a második: ki kitől kér tanácsot – két különböző kapcsolat. Igaz a harmadik: 7 csúcson két 3 élű hálózat, közös él nélkül, csak $-9/54 \approx -0{,}167$. Hamis a negyedik: csúcshatás nélkül a szimulációban 4,5% a hamis riasztás – a gond akkor jön, ha mindkét hálózatban van csúcshatás. Hamis az ötödik: a duplázás a korrelációt nem változtatja, de az elemszámot hamisan megkétszerezi – ettől a naiv p még kisebb (még rosszabb) lesz.`
        }
      ]
    },

    /* ------------------------------------------------ 10.3 */
    "gh10-103": {
      title: "Kvíz – 10.3 QAP-próba",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`VN–NY négy szereplőn: a VN egy csillag (közepe $\mathrm{Po}$), a NY egy háromszög és egy magányos csúcs, $r = 1/3$. A 24 permutációból 18 ad $r^* = 1/3$-ot, 6 ad $r^* = -1$-et. Mennyi az egyoldali QAP p-érték?`,
          options: [R`$0{,}75$`, R`$\approx 0{,}042$`, R`$0{,}25$`, R`$1$`],
          answer: 0,
          hint: R`Egyoldali: hány permutáció ad legalább akkora $r^*$-ot, mint a megfigyelt? Az identitás is köztük van.`,
          explain: R`$r^* \ge 1/3$ a 18 permutációnál teljesül: $p = 18/24 = 0{,}75$. Hiába a lehető legnagyobb érték a megfigyelt, négy szereplőn ez a legtipikusabb eredmény. A $0{,}042 = 1/24$ azt hiszi, hogy csak az identitás éri el a megfigyeltet. A $0{,}25 = 6/24$ a kisebb értékeket számolja meg. Az $1$ a kétoldali p ($|-1| \ge 1/3$ is) – itt egyoldalit kérdeztünk.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mind a 7 szereplőn $r = 0{,}611$ (2 közös él). Egy permutáció akkor ad ismét 2 közös élt, ha a VN csillagának közepe a NY háromszögébe kerül, és a háromszög másik két csúcsa a csillag levelei közé esik. Mennyi a QAP p-érték?`,
          options: [R`$3/35 \approx 0{,}086$`, R`$3/7 \approx 0{,}429$`, R`$4/20 = 0{,}2$`, R`$\approx 0{,}003$`],
          answer: 0,
          hint: R`Két feltételnek kell egyszerre teljesülnie – szorozd össze a két esélyt. A második: a maradék 6 csúcsból 3 levél, hányféleképpen eshet a háromszög két csúcsa a levelek közé?`,
          explain: R`A közép a háromszögbe: $3/7$. A másik két háromszögcsúcs a 3 levél közé: $\binom32/\binom62 = 3/15 = 0{,}2$. $p = 3/7 \cdot 0{,}2 = 3/35 \approx 0{,}086$ (432 permutáció az 5040-ből). A $3/7$ csak az első feltétel, a $0{,}2$ csak a második. A $0{,}003$ a naiv próba p-értéke – ezt a QAP nem erősíti meg: 5%-on nem szignifikáns.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hogyan készül egy permutált mátrix a QAP-ban?`,
          options: [
            R`$b^*_{ij} = b_{\pi(i)\pi(j)}$: a $B$ sorait és oszlopait együtt, ugyanazzal a $\pi$-vel permutáljuk.`,
            R`A $B$ sorait egy $\pi$-vel, az oszlopait egy tőle független $\sigma$-val permutáljuk.`,
            R`A $B$ főátlón kívüli celláit egyenként, véletlenszerűen összekeverjük.`,
            R`Az $A$-t és a $B$-t is ugyanazzal a $\pi$-vel permutáljuk, és újra kiszámoljuk a korrelációt.`
          ],
          answer: 0,
          hint: R`A QAP egy átnevezés: egy csúcs minden kapcsolatának vele együtt kell költöznie. És mi történik, ha mindkét hálózatot ugyanúgy nevezzük át?`,
          explain: R`Csak a sorok és oszlopok közös permutációja átnevezés: a $B$ gráfja ugyanaz marad (izomorf), a fokszámai, csillagai, háromszögei megmaradnak, csak az illesztése lesz véletlen. A külön sor- és oszloppermutáció szétszedi a csúcsok kapcsolatait. A cellánkénti keverés visszahozza a függetlenségi feltevést – a naiv próba hibáját ismétli (túl szűk nulleloszlás, túl kicsi p). Ha mindkét mátrixot ugyanúgy nevezed át, a korreláció egyáltalán nem változik (mindig $r^* = r$), tehát nincs nulleloszlás. Lásd a <a class="xref" href="#s103-a">10.3 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Krackhardt menedzserei: a tanácskérés és a „kinek jelent” korrelációja $r = 0{,}224$. 20&nbsp;000 véletlen permutációból egy sem érte el. Mit írsz a cikkbe?`,
          options: [
            R`$\hat p = 1/20\,001 \approx 0{,}00005$, azaz $p \lt 0{,}001$ (20&nbsp;000 QAP-permutáció)`,
            R`$p = 0$`,
            R`$p = 1/20\,000$, és ez a pontos p-érték`,
            R`Nem lehet p-értéket mondani; addig kell futtatni, amíg legalább egy permutáció eléri.`
          ],
          answer: 0,
          hint: R`A megfigyelt elrendezés is egy a lehetségesek közül. Milyen képlettel becsüljük a p-t véletlen permutációknál?`,
          explain: R`$\hat p = (k + 1)/(M + 1) = 1/20\,001 \approx 0{,}00005$; ez becslés, ezért „$p \lt 0{,}001$” formában, a permutációk számával érdemes közölni. A $p = 0$ az identitás kihagyásából jön – permutációs próbánál értelmetlen. Az $1/20\,000$ is a $k/M$-féle számolás, és nem „pontos”: véletlen permutációból csak becslés jön. Az utolsó opció felesleges: a 0 találat is információ, a $(k+1)/(M+1)$ ezt kezeli.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy QAP-ban a valódi p-érték kb. $0{,}04$, és $M = 2000$ véletlen permutációt húzol. Mekkora kb. a $\hat p$ standard hibája?`,
          options: [R`$\approx 0{,}0044$`, R`$\approx 0{,}022$`, R`$\approx 0{,}000\,019$`, R`$\approx 0{,}196$`],
          answer: 0,
          hint: R`Minden permutáció egy „pénzfeldobás” $p$ eséllyel. Mekkora a szórása egy $M$ elemű minta arányának?`,
          explain: R`$\sqrt{p(1-p)/M} = \sqrt{0{,}04 \cdot 0{,}96/2000} \approx 0{,}0044$. Az 5%-os döntéshez ez elég (a $0{,}04$ kb. 2,3 standard hibányira van a $0{,}05$-től). A $0{,}022 = 1/\sqrt{2000}$ a $p(1-p)$ szorzót hagyja el. A $0{,}000\,019$ a variancia – a gyökvonás maradt el. A $0{,}196 = \sqrt{0{,}04 \cdot 0{,}96}$ egyetlen „pénzfeldobás” szórása, az $M$-mel nem osztott.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Krackhardt-adatban azt vártad előre, hogy a barátaidtól kérsz tanácsot. A tanácskérés–barátság $r = 0{,}155$; QAP egyoldali $p \approx 0{,}018$, kétoldali $0{,}033$, naiv $0{,}0015$. Melyiket jelented?`,
          options: [
            R`Az egyoldali QAP-ot ($\approx 0{,}018$), mert az irányt előre megmondtad.`,
            R`A kétoldali QAP-ot ($\approx 0{,}033$), mert a QAP-próba mindig kétoldali.`,
            R`A naivat ($0{,}0015$), mert 420 cella elég nagy minta.`,
            R`Mindig a legkisebbet, mert az a legerősebb bizonyíték.`
          ],
          answer: 0,
          hint: R`Mikor egyoldali egy próba, és mikor kétoldali? És melyik p-érték számol független cellákkal?`,
          explain: R`Előre irányított hipotézised volt (a két hálózat hasonlít), ezért egyoldali: $r^* \ge r$. Kétoldali ($|r^*| \ge |r|$) akkor kell, ha bármilyen irányú kapcsolat érdekel – a QAP mindkettőre képes. A naiv $p$ független cellákat feltételez; a 420 cella 21 emberhez tartozik, a nagy $N$ nem ment meg (a naiv p itt tizenkétszer kisebb). A „mindig a legkisebbet” a p-értékkel való válogatás: a próbát előre kell kiválasztani, nem az eredmény alapján. Lásd a <a class="xref" href="#s103-b-krack">Krackhardt-példát</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a QAP-próbára? (Több jó válasz is lehet.)",
          options: [
            R`Mivel az identitás is permutáció, teljes felsorolásnál $p \ge 1/n!$.`,
            R`4 csúcson a legkisebb elérhető p-érték is $1/24 \approx 0{,}042$, így erős bizonyítékot ott nem várhatsz.`,
            R`A QAP a két hálózat saját szerkezetét (fokszámok, háromszögek) megtartja, csak az illesztésüket teszi véletlenné.`,
            R`A kétoldali p-érték sosem nagyobb az egyoldalinál.`,
            R`A cellánkénti keverés is megtartja a csúcsok közötti függőséget, csak gyorsabb.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig a 4 csúcsú VN–NY példát: ott mennyi volt az egyoldali és a kétoldali p?`,
          explain: R`Igaz az első: a megfigyelt elrendezés is a permutációk között van. Igaz a második: kevés csúcson nincs erő – ehhez az is kellene, hogy egyetlen másik permutáció se érje utol a megfigyeltet. Igaz a harmadik: ez a QAP nullhipotézise (a szerkezet adott, a csúcsok megfeleltetése véletlen). Hamis a negyedik: a kétoldali feltétel ($|r^*| \ge |r|$) több permutációt enged át, a 4 csúcsú példában az egyoldali $0{,}75$, a kétoldali $1$. Hamis az ötödik: a cellánkénti keverés szétszedi a csúcsok kapcsolatait – a Krackhardt-adaton a nulleloszlás szórása 0,072 helyett 0,049 lesz, a p túl kicsi.`
        }
      ]
    },

    /* ------------------------------------------------ 10.4 */
    "gh10-104": {
      title: "Kvíz – 10.4 MRQAP-regresszió",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy hálózatban 40 „azonos részleg” cella van, ebből 18-ban van él; a többi 160 cellából 24-ben. Mennyi a $b_0$ és a $b_1$, ha az élt (0/1) az „azonos részleg” mátrixra regresszáljuk?`,
          options: [
            R`$b_0 = 0{,}15$, $b_1 = 0{,}30$`,
            R`$b_0 = 0{,}45$, $b_1 = 0{,}30$`,
            R`$b_0 = 0{,}15$, $b_1 = 0{,}45$`,
            R`$b_0 = 0{,}15$, $b_1 = 3$`
          ],
          answer: 0,
          hint: R`Egyetlen 0/1 magyarázónál az egyenes a két csoport átlagán megy át. Melyik csoport átlaga a tengelymetszet?`,
          explain: R`Arányok: azonos részleg $18/40 = 0{,}45$, többi $24/160 = 0{,}15$. $b_0$ = az $x = 0$ csoport átlaga = $0{,}15$, $b_1$ = a különbség = $0{,}45 - 0{,}15 = 0{,}30$. A $b_0 = 0{,}45$ a két csoportot cseréli fel. A $b_1 = 0{,}45$ az $x = 1$ csoport átlagát veszi meredekségnek ($b_0 + b_1$ helyett $b_1$-nek). A $b_1 = 3$ a két arány hányadosa – a lineáris regresszió különbséget mér, nem arányt. Lásd a <a class="xref" href="#s104-a">10.4 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A „tanácskérés ~ barátság + jelent” modell: $b_0 = 0{,}397$, $b_{\text{barát}} = 0{,}136$, $b_{\text{jelent}} = 0{,}472$. Mennyi a jósolt tanácskérési arány egy olyan párra, ahol $i$ barátjának tartja $j$-t, de $j$ nem a főnöke?`,
          options: [R`$0{,}533$`, R`$0{,}588$`, R`$0{,}397$`, R`$0{,}136$`],
          answer: 0,
          hint: R`Írd be a két magyarázó értékét (barát = 1, jelent = 0) az egyenletbe.`,
          explain: R`$0{,}397 + 0{,}136 \cdot 1 + 0{,}472 \cdot 0 = 0{,}533$. (A tényleges arány ebben a csoportban 49/90 = 0,544 – közel van.) A $0{,}588 = 60/102$ az egyváltozós barát-arány: abban a főnöki cellák is benne vannak, és a főnöktől amúgy is kérnek tanácsot. A $0{,}397$ csak a tengelymetszet (nem barát, nem főnök), a $0{,}136$ csak a barátság együtthatója – az egy különbség, nem arány.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyedül a barátság együtthatója $0{,}179$, a „jelent” mátrix bevétele után $0{,}136$. Mi a fő oka a csökkenésnek?`,
          options: [
            R`A főnöki cellák jó része baráti is (20-ból 12, miközben a barátság sűrűsége 24%), és a főnöktől amúgy is kérnek tanácsot – a barátság hatásának egy része „kölcsönvett”.`,
            R`A második magyarázó miatt kevesebb cellán fut a regresszió.`,
            R`A DSP-eljárás kisebb együtthatót ad, mint a szokásos legkisebb négyzetek módszere.`,
            R`Az $R^2$ nőtt, és a nagyobb $R^2$ mellett minden együttható kisebb.`
          ],
          answer: 0,
          hint: R`A többszörös regresszió azt méri, mennyit ad egy magyarázó a többin felül. Összefügg-e a barátság és a főnöki viszony?`,
          explain: R`A két magyarázó pozitívan korrelál ($r = 0{,}19$): a 20 főnöki cellából 12 baráti (60%, a 24%-os átlag helyett). Az egyváltozós modellben a barátság a főnöki viszony hatásának egy részét is magának számolta; a nem főnöki cellákon a különbség már csak $0{,}544 - 0{,}394 = 0{,}15$. A cellák száma nem változik (mindkét modell 420 cellán fut). A DSP a p-értéket adja, az együttható a szokásos regresszióé. Az $R^2$ növekedése nem csökkenti automatikusan az együtthatókat.`
        },
        {
          type: "single", shuffle: true,
          q: R`A „barátság + jelent” modellben a barátság $b = 0{,}136$; a naiv $p = 0{,}016$, az Y-permutációs $p = 0{,}11$, a DSP-s $p = 0{,}10$. Mit mondasz?`,
          options: [
            R`A főnöki viszony mellett a barátság hatása nem szignifikáns ($p \approx 0{,}10$).`,
            R`A barátság hatása szignifikáns, mert a naiv $p = 0{,}016 \lt 0{,}05$.`,
            R`Bizonyított, hogy a barátságnak nincs hatása a tanácskérésre.`,
            R`Szignifikáns, mert egyedül a barátság QAP p-értéke $0{,}032$ volt.`
          ],
          answer: 0,
          hint: R`Melyik p-érték veszi figyelembe a cellák függőségét? És mit jelent egy nem szignifikáns eredmény: „nincs hatás”, vagy „nem tudtuk kimutatni”?`,
          explain: R`MRQAP-ban az együttható a szokásos regresszióé, a p-érték permutációból jön: itt $p \approx 0{,}10$, nem szignifikáns. A naiv $p$ független cellákat feltételez, ezért túl kicsi. A „bizonyított, hogy nincs hatás” túlolvasás: a $b = 0{,}136$ pozitív, csak nem tudjuk elválasztani a véletlentől. Az egyváltozós $0{,}032$ a főnöki viszony nélkül készült – annak egy része éppen a főnökön keresztül jön. Lásd a <a class="xref" href="#s104-b">10.4 2. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["Y-permutáció", "a függő hálózat csúcsait permutálja, a magyarázókat békén hagyja"],
            ["kettős szemi-parciális eljárás (DSP)", "egy magyarázó maradékát permutálja, amit a többiek nem magyaráznak"],
            ["naiv p-érték", "független cellákat feltételez"],
            ["attribútummátrix", "csúcstulajdonságból gyártott magyarázó hálózat"],
            ["LRQAP", "logisztikus változat bináris függő hálózatra"]
          ],
          hint: R`Az MRQAP-ban kétféle permutációs eljárás van: az egyik a függő hálózathoz nyúl, a másik egy magyarázóhoz.`,
          explain: R`Y-permutáció: a $Y$ sorait és oszlopait együtt permutáljuk, a magyarázók egymáshoz viszonyított elrendezése megmarad. DSP: a vizsgált $X_k$-t a többi magyarázóra regresszáljuk, és a maradékát permutáljuk – ez a biztosabb, ha a magyarázók összefüggnek. A naiv p a szokásos regresszió p-értéke, független cellákkal. Az attribútummátrix pl. $x_{ij}$ = a $j$ szolgálati ideje, vagy 1, ha $i$ és $j$ azonos részlegben van. Az LRQAP a lineáris modell helyett logisztikusat illeszt, mert a lineáris jóslat 1 fölé is mehet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért a $t = b/\mathrm{se}(b)$ statisztikát hasonlítjuk a permutált értékekhez az MRQAP-ban, és nem magát a $b$-t?`,
          options: [
            R`Mert a $t$ eloszlása kevésbé függ attól, hogy a magyarázó mennyire szóródik és mennyire fedi a többit – így a permutációs próba pontosabb.`,
            R`Mert a $b$ permutáció után nem számolható ki.`,
            R`Mert a $t$ mindig nagyobb a $b$-nél, ezért a próba erősebb.`,
            R`Mert a $t$-ből a naiv p-érték jön, és azt kell a permutációssal összevetni.`
          ],
          answer: 0,
          hint: R`Mi változik a permutáció során egy magyarázó maradékában, ha az erősen összefügg a többivel?`,
          explain: R`A $t$ standardizált: a $b$-t a saját standard hibájával osztja, így a nulleloszlása kevésbé érzékeny a magyarázó szórására és a többivel való átfedésére (Dekker, Krackhardt és Snijders, 2007). A $b$ minden permutált regresszióból kiszámolható – csak a próba lenne vele pontatlanabb. A $t$ nem „mindig nagyobb”, és a nagysága nem ad erőt a próbának. A naiv p a $t$-ből jön ugyan, de az MRQAP éppen ezt helyettesíti a permutációs eloszlással.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az MRQAP-ra? (Több jó válasz is lehet.)",
          options: [
            R`Kis $R^2$ (pl. 6,3%) mellett is lehet egy hatás erős és biztos.`,
            R`A 0/1 függő hálózatra illesztett lineáris modell jóslata 1 fölé is mehet.`,
            R`Ha egy nyilvánvaló kontrollt kihagysz, egy másik magyarázó hatása feljebb tolódhat.`,
            R`A keresztmetszeti MRQAP megmutatja, hogy a barátság okozza a tanácskérést.`,
            R`Ha a magyarázók összefüggnek, elég őket cellánként keverni a p-értékhez.`
          ],
          answer: [0, 1, 2],
          hint: R`Számold ki a „barát és főnök” párra a jóslatot ($0{,}397 + 0{,}136 + 0{,}472$). És mit permutálunk mindig – cellákat vagy csúcsokat?`,
          explain: R`Igaz az első: a „jelent” hatása minden eljárással $p \lt 0{,}001$, pedig az $R^2$ csak 6,3% – a tanácskérést főleg nem mért dolgok (szakértelem, elérhetőség) döntik el. Igaz a második: $0{,}397 + 0{,}136 + 0{,}472 = 1{,}005$; ezért pontosabb bináris függő hálózatnál az LRQAP. Igaz a harmadik: a főnöki viszony nélkül a barátság „szignifikáns” – ez a kihagyott kontroll hibája. Hamis a negyedik: a kapcsolat mehet mindkét irányba (akitől tanácsot kérsz, az barátod lesz), és lehet közös oka is. Hamis az ötödik: a cellánkénti keverés a függetlenséget tételezi fel – mindig csúcsokat permutálunk.`
        }
      ]
    },
