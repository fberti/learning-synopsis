(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 3.5 */
    "an3-35": {
      title: "Kvíz – 3.5 Folytonosság",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Melyik függvény folytonos az $x = 1$ pontban?`,
          options: [
            R`$f(x) = x^2 + 1$, ha $x \lt 1$, és $f(x) = 3x - 1$, ha $x \ge 1$`,
            R`$g(x) = x + 1$, ha $x \ne 1$, és $g(1) = 5$`,
            R`$h(x) = \dfrac{x^2 - 1}{x - 1}$`,
            R`$u(x) = x + 1$, ha $x \lt 1$, és $u(x) = x^2$, ha $x \ge 1$`
          ],
          answer: 0,
          hint: "Mindegyiknél nézd végig a három feltételt: van-e érték a pontban, van-e határérték, és egyenlők-e?",
          explain: R`Az $f$-nél balról $1 + 1 = 2$, jobbról $3 - 1 = 2$, és $f(1) = 2$: mindhárom feltétel teljesül. A $g$-nek van határértéke (2), de $g(1) = 5$ más – a 3. feltétel sérül. A $h$ az 1-ben nincs értelmezve – az 1. feltétel sérül, pedig a határértéke 2. Az $u$ értelmezve van ($u(1) = 1$), de balról 2, jobbról 1: nincs határérték. Tanulság: egyetlen feltétel („van határérték”, „értelmezve van”) sosem elég.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi igaz az $f(x) = \lfloor x\rfloor$ (egészrész) függvényre az $x = 2$ pontban?`,
          options: [
            "Jobbról folytonos, balról nem – tehát nem folytonos.",
            "Balról folytonos, jobbról nem – tehát nem folytonos.",
            R`Folytonos, mert értelmezve van: $\lfloor 2\rfloor = 2$.`,
            "Egyik oldalról sem folytonos."
          ],
          answer: 0,
          hint: R`Számold ki külön $f(2)$-t, a bal oldali és a jobb oldali határértéket. Melyik egyoldali határérték egyezik $f(2)$-vel?`,
          explain: R`$f(2) = 2$. Jobbról ($2 \le x \lt 3$) $\lfloor x\rfloor = 2 = f(2)$: jobbról folytonos. Balról ($1 \le x \lt 2$) az érték 1, és $1 \ne 2$: balról nem folytonos. Folytonossághoz mindkét oldal kell. A „balról folytonos” a két oldal felcserélése (az $x = 2$ a jobb oldali, $[2; 3[$ szakaszhoz „ragad”). Az „értelmezve van, tehát folytonos” a három feltétel közül csak az elsőt nézi.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`Az $|x|$ függvény folytonos a 0-ban.`,
            R`Ha $f$ folytonos az $a$-ban, akkor $\lim\limits_{x\to a} f(x) = f(a)$.`,
            R`Ha a $\lim\limits_{x\to a} f(x)$ véges határérték létezik, akkor $f$ folytonos az $a$-ban.`,
            R`Ha $f$ értelmezve van az $a$-ban, akkor ott folytonos.`,
            "Ha egy függvény folytonos, a grafikonja sima, csúcsmentes."
          ],
          answer: [0, 1],
          hint: "Gondolj a 3.5 ellenpéldáira: egy áthelyezett pont, az egységugrás és az abszolútérték „csúcsa”.",
          explain: R`Igaz: az $|x|$ a 0-ban folytonos (balról $-x \to 0$, jobbról $x \to 0$, és $|0| = 0$), és a folytonosság definíciója éppen $\lim\limits_{x\to a} f(x) = f(a)$. Hamis: a határérték létezése kevés – a $g(x) = x + 1$ ($x \ne 1$), $g(1) = 5$ függvénynek van határértéke az 1-ben, mégsem folytonos. Hamis: az egységugrás a 0-ban értelmezve van, mégsem folytonos. Hamis: „folytonos = sima” – az $|x|$-nek csúcsa van, mégis folytonos; a csúcs a deriválhatóságnak árt (4. fejezet), a folytonosságnak nem.`
        },
        {
          type: "match",
          q: R`Milyen szakadása van a függvénynek az $x = 3$ pontban? Párosítsd!`,
          pairs: [
            [R`$\dfrac{x - 3}{x^2 - 9}$`, "megszüntethető"],
            [R`$\dfrac{x + 3}{x^2 - 9}$`, "végtelen szakadás"],
            [R`$\dfrac{|x - 3|}{x - 3}$`, "ugrás"],
            [R`$\sin\dfrac{1}{x - 3}$`, "oszcilláló"]
          ],
          hint: "Előbb egyszerűsíts, aztán nézd meg a bal és a jobb oldali határértéket! Ugyanaz a nevező még nem jelent ugyanolyan szakadást.",
          explain: R`$\dfrac{x - 3}{x^2 - 9} = \dfrac{1}{x + 3} \to \dfrac16$: véges és a két oldal egyenlő – megszüntethető (lyuk). $\dfrac{x + 3}{x^2 - 9} = \dfrac{1}{x - 3}$: balról $-\infty$, jobbról $+\infty$ – végtelen szakadás („nem nulla per nulla”). $\dfrac{|x - 3|}{x - 3}$: balról $-1$, jobbról $1$ – két különböző véges érték, ugrás. $\sin\dfrac{1}{x - 3}$: a 3 felé végtelen sokszor leng $-1$ és $1$ között, egyoldali határérték sincs – oszcilláló. Az első kettő nevezője azonos, a szakadásuk mégis más: a típus a határértékeken múlik, nem a képleten.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \dfrac{x^2 - 5x + 6}{x - 2}$, ha $x \ne 2$, és $f(2) = c$. Milyen $c$-re folytonos $f$ a 2-ben?`,
          options: [R`$c = -1$`, R`$c = 0$`, R`$c = 1$`, R`$c = 5$`],
          answer: 0,
          hint: R`Megszüntethető szakadás: $f(2)$-nek a határértékkel kell egyeznie. A számláló a 2-ben 0 – melyik gyöktényező emelhető ki?`,
          explain: R`$x^2 - 5x + 6 = (x - 2)(x - 3)$, így $x \ne 2$-re $f(x) = x - 3 \to -1$. Folytonos, ha $c = \lim\limits_{x\to 2} f(x) = -1$ (csereszabály: az $x - 3$ folytonos, és a 2 körül egyenlő $f$-fel). A $0$ és az $1$ a „$\tfrac00 = 0$”, illetve „$\tfrac00 = 1$” tévhit. Az $5$ gyöktényező-előjelhibából jön: ha $(x - 3)$ helyett $(x + 3)$ marad, $2 + 3 = 5$ (visszaszorzással kiderül: $(x - 2)(x + 3) = x^2 + x - 6$).`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x + a$, ha $x \lt 2$; $f(2) = 5$; $f(x) = bx - 1$, ha $x \gt 2$. Milyen $a$, $b$ mellett folytonos $f$ a 2-ben?`,
          options: [
            R`$a = 3$ és $b = 3$`,
            R`minden olyan pár, amelyre $a = 2b - 3$`,
            R`$a = 3$, a $b$ pedig tetszőleges`,
            R`semmilyen: a külön megadott $f(2)$ mindig szakadást okoz`
          ],
          answer: 0,
          hint: R`A csatlakozási pontban három számnak kell egyeznie: bal oldali határérték, jobb oldali határérték és $f(2)$.`,
          explain: R`Bal: $2 + a$; jobb: $2b - 1$; ezeknek $f(2) = 5$-tel kell egyezniük: $2 + a = 5 \Rightarrow a = 3$, $2b - 1 = 5 \Rightarrow b = 3$. Az „$a = 2b - 3$” csak a két ágat teszi egyenlővé, $f(2)$-t elfelejti – így pl. $a = 1$, $b = 2$ mellett van határérték (3), de $f(2) = 5 \ne 3$. Az „$a = 3$, $b$ tetszőleges” csak a bal oldali folytonosságot biztosítja. Az utolsó tévhit: a külön megadott érték nem baj, ha éppen a határértékkel egyezik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hol folytonos az $f(x) = \dfrac{x - 1}{x^2 - 4x + 3}$ függvény?`,
          options: [R`$\mathbb R\setminus\{1; 3\}$`, R`$\mathbb R\setminus\{3\}$`, R`$\mathbb R$`, R`$\mathbb R\setminus\{-1; -3\}$`],
          answer: 0,
          hint: R`A racionális függvény az értelmezési tartományának minden pontjában folytonos. Hol nincs értelmezve? Az egyszerűsítés ezen nem változtat!`,
          explain: R`$x^2 - 4x + 3 = (x - 1)(x - 3)$, a nevező az 1-ben és a 3-ban 0, ott $f$ nincs értelmezve, tehát nem folytonos; máshol folytonos. Az 1-ben megszüntethető szakadás van (egyszerűsítve $\tfrac{1}{x - 3} \to -\tfrac12$), a 3-ban végtelen. Az $\mathbb R\setminus\{3\}$ összekeveri az eredeti függvényt az egyszerűsített $\tfrac{1}{x - 3}$-mal – a lyuk egyszerűsítés után is megmarad. Az $\mathbb R$ elfelejti a nevezőt, a $\{-1; -3\}$ pedig gyöktényező-előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két függvény, $f$ és $g$, a 0-ban nem folytonos. Mit mondhatsz az $f + g$ összegről a 0-ban?`,
          options: [
            "Lehet folytonos, és lehet nem folytonos is – a tétel ilyenkor semmit sem mond.",
            "Biztosan nem folytonos.",
            "Biztosan folytonos, mert a szakadások kioltják egymást.",
            "Csak akkor lehet folytonos, ha mindkettőnek megszüntethető szakadása van."
          ],
          answer: 0,
          hint: R`A műveleti tétel csak egy irányt mond: folytonosból folytonos. Próbáld ki $f = \operatorname{sgn} x$-szel és két különböző $g$-vel!`,
          explain: R`$\operatorname{sgn} x + (-\operatorname{sgn} x) = 0$ – állandó, tehát folytonos, pedig mindkét tag ugrik a 0-ban. Viszont $\operatorname{sgn} x + \operatorname{sgn} x = 2\operatorname{sgn} x$ nem folytonos. Tehát mindkét eset előfordulhat. A „biztosan nem” a tétel megfordítása (a tétel csak azt mondja, hogy folytonosak összege folytonos). A „kioltják egymást” csak szerencsés esetben igaz. Az utolsó opció hamis: a példában ugrások oltották ki egymást.`
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "an3-36": {
      title: "Kvíz – 3.6 Folytonos függvények tételei zárt intervallumon",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^3 - 2x - 5$. Melyik intervallumban garantál gyököt a Bolzano-tétel?`,
          options: [R`$[2; 3]$`, R`$[1; 2]$`, R`$[0; 1]$`, R`$[3; 4]$`],
          answer: 0,
          hint: "Számold ki a függvényértéket a 0, 1, 2, 3, 4 helyeken, és keresd az előjelváltást!",
          explain: R`$f(0) = -5$, $f(1) = -6$, $f(2) = -1$, $f(3) = 16$, $f(4) = 51$. Előjelváltás csak a $[2; 3]$-on van ($f(2)\cdot f(3) \lt 0$), és a polinom folytonos – Bolzano: van gyök a $]2; 3[$-ban. A többi intervallum végpontjaiban azonos az előjel, ott a tétel <em>semmit sem mond</em> (nem azt mondja, hogy nincs gyök – itt csak véletlenül nincs).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`Ha $f$ folytonos a $[a; b]$-n és $f(a)\cdot f(b) \lt 0$, akkor van $c \in\ ]a; b[$, amelyre $f(c) = 0$.`,
            R`Ha $f(a)$ és $f(b)$ azonos előjelű, akkor $f$-nek nincs gyöke a $[a; b]$-n.`,
            R`Az $\tfrac1x$ a $[-1; 1]$ végpontjaiban ellentétes előjelű, és mégsincs gyöke – mert a 0-ban nem folytonos.`,
            "A Bolzano-tétel azt is megmondja, hány gyök van az intervallumban.",
            "Minden páratlan fokú polinomnak van valós gyöke."
          ],
          answer: [0, 2, 4],
          hint: "Melyik a tétel feltétele, és mit állít pontosan? Gondolj a fordított irányra és a folytonosság szerepére is!",
          explain: R`Igaz a tétel maga, igaz az $\tfrac1x$-es ellenpélda (a feltétel – folytonosság – sérül, és a tétel állítása is), és igaz a páratlan fokú polinomokról szóló állítás (a két végtelenben ellentétes előjelű, Bolzano ad gyököt). Hamis a fordított irány: $x^2 - 1$ a $[-2; 2]$-n, $f(\pm2) = 3$, mégis van két gyöke ($\pm1$). Hamis, hogy a tétel megmondja a gyökök számát: csak azt mondja, hogy <em>van</em>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $x^2 - 3 = 0$ gyökét keressük intervallumfelezéssel az $[1; 2]$-ből. Két felezés után melyik intervallumban van a gyök?`,
          options: [R`$[1{,}5; 1{,}75]$`, R`$[1{,}75; 2]$`, R`$[1{,}25; 1{,}5]$`, R`$[1{,}5; 2]$`],
          answer: 0,
          hint: "Minden lépésben azt a felet tartsd meg, amelynek a végpontjaiban az előjel különböző. Hány felezés kell?",
          explain: R`$f(1) = -2 \lt 0$, $f(2) = 1 \gt 0$. 1. lépés: $f(1{,}5) = -0{,}75 \lt 0$, az előjelváltás a $[1{,}5; 2]$-n van. 2. lépés: $f(1{,}75) = 0{,}0625 \gt 0$, tehát $[1{,}5; 1{,}75]$ (valóban: $\sqrt3 \approx 1{,}732$). A $[1{,}75; 2]$ a rossz fél (ott $f(1{,}75)$ és $f(2)$ is pozitív), a $[1{,}25; 1{,}5]$ már az első lépésben a rossz felet tartja meg, a $[1{,}5; 2]$ pedig csak egy felezés eredménye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány felezés kell a $[0; 2]$ intervallumból indulva, hogy az intervallum hossza $0{,}01$ alá csökkenjen?`,
          options: ["8", "7", "9", "200"],
          answer: 0,
          hint: R`$n$ lépés után a hossz $\dfrac{b - a}{2^n}$. Itt $b - a = 2$ – ne felejtsd ki!`,
          explain: R`$\dfrac{2}{2^n} \lt 0{,}01 \iff 2^n \gt 200$. $2^7 = 128$ kevés, $2^8 = 256$ elég: 8 lépés. A 7 akkor jön ki, ha az intervallum hosszát 1-nek veszed ($2^n \gt 100$). A 9 eggyel elcsúszott lépésszám (a $2^8 = 256 \gt 200$-at is kevésnek gondolni). A 200 a $2^n \gt 200$ egyenlőtlenség jobb oldala – az nem a lépések száma, hanem a $2^n$-é.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $f(x) = x^2$ folytonos a $[-1; 3]$-on, $f(-1) = 1$ és $f(3) = 9$. Mit garantál a Darboux-tétel?`,
          options: [
            "Minden 1 és 9 közötti értéket felvesz a [−1; 3]-on.",
            "Csak az 1 és 9 közötti értékeket veszi fel, más értéket nem.",
            "Semmit: a tétel csak a 0 felvételéről szól.",
            R`Semmit, mert az $x^2$ a $[-1; 3]$-on nem monoton.`
          ],
          answer: 0,
          hint: R`A Darboux-tétel feltétele csak a folytonosság. Mit mond, és mit <em>nem</em> mond az $f(a)$ és $f(b)$ közötti értékeken kívüliekről?`,
          explain: R`Darboux: folytonos függvény minden $f(a)$ és $f(b)$ közötti értéket felvesz – itt minden $d \in [1; 9]$-et. A „csak ezeket” hamis: az $x^2$ a 0-t is felveszi ($x = 0$), sőt az értékkészlete $[0; 9]$. A tétel nem csak a 0-ról szól – az a Bolzano-tétel, amelyből a $g(x) = f(x) - d$ eltolással kapjuk. A monotonitás nem feltétel.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik esetben garantálja a Weierstrass-tétel, hogy a függvénynek van legnagyobb értéke?",
          options: [
            R`$\sqrt{x + 1}$ a $[0; 8]$-on`,
            R`$x^2$ a $]-1; 2[$-n`,
            R`$e^x$ az $\mathbb R$-en`,
            R`$f(x) = \tfrac1x$ ($x \ne 0$), $f(0) = 0$ a $[-1; 1]$-en`
          ],
          answer: 0,
          hint: "Három feltétel kell egyszerre: folytonos függvény, zárt és korlátos intervallum. Melyiknél teljesül mind?",
          explain: R`A $\sqrt{x + 1}$ folytonos a zárt, korlátos $[0; 8]$-on: van max ($\sqrt9 = 3$) és min ($1$). Az $x^2$ a nyílt $]-1; 2[$-n nem éri el a 4-et – nincs maximuma. Az $e^x$ az $\mathbb R$-en folytonos, de az intervallum nem korlátos – se max, se min. Az utolsó függvény a 0-ban nem folytonos, és nem is korlátos a $[-1; 1]$-en.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = x^2 - 4x$ értékkészlete a $[0; 5]$ intervallumon?`,
          options: [R`$[-4; 5]$`, R`$[0; 5]$`, R`$]-4; 5[$`, R`$[-4; +\infty[$`],
          answer: 0,
          hint: R`Weierstrass + Darboux: a kép a $[\min; \max]$ intervallum. A szélsőértéket ne csak a végpontokban keresd – alakítsd teljes négyzetté!`,
          explain: R`$f(x) = (x - 2)^2 - 4$: a minimum $f(2) = -4$; a végpontok $f(0) = 0$, $f(5) = 5$, így a maximum 5. Folytonos függvény zárt intervallumon felveszi a minimumát és a maximumát, és közöttük mindent: a kép $[-4; 5]$. A $[0; 5]$ csak a végpontok közötti értékeket nézi („Darboux csak a köztes értékeket” tévhit). A $]-4; 5[$ azt hiszi, a szélsőértékeket nem veszi fel – zárt intervallumon felveszi. A $[-4; +\infty[$ elfelejti, hogy csak a $[0; 5]$-ön vizsgálunk.`
        }
      ]
    },

    /* ------------------------------------------------ 3.7 */
    "an3-37": {
      title: "Kvíz – 3.7 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A víz modellje: $V(T) = 1000 + 0{,}0075\,(T - 4)^2$ cm³ ($T \ge 0$). 20 °C körül a bal oldali sávhatár $19{,}578$ °C, a jobb oldali $20{,}411$ °C (ha $\varepsilon = 0{,}1$ cm³). Mekkora a jó $\delta$?`,
          options: [R`$\delta \approx 0{,}41$ °C`, R`$\delta \approx 0{,}42$ °C`, R`$\delta \approx 3{,}65$ °C`, R`$\delta \approx 13{,}33$ °C`],
          answer: 0,
          hint: R`Az ablak a 20 körül szimmetrikus ($|T - 20| \lt \delta$), és az ablak <em>minden</em> pontjában jónak kell lennie. Melyik oldal a szűkebb?`,
          explain: R`Jobbra $20{,}411 - 20 = 0{,}411$, balra $20 - 19{,}578 = 0{,}422$ hely van. A szimmetrikus ablaknak mindkét oldalon bele kell férnie, ezért a <b>kisebbik</b> távolság a jó: $\delta \approx 0{,}41$ °C. A $0{,}42$ a nagyobbik oldal – ekkor az ablak jobb szélén a hiba már $0{,}1$ fölött van. A $3{,}65$ a 4 °C-hoz tartozó $\delta$ – de $\delta$ a ponttól is függ. A $13{,}33 = \tfrac{0{,}1}{0{,}0075}$ a $(T - 4)^2$ megengedett növekménye, nem hőmérséklet-eltérés.`
        },
        {
          type: "single", shuffle: true,
          q: R`A modellben a jég térfogata 1091 cm³ ($T \lt 0$), a 0 °C-os vízé $V(0) = 1000{,}12$ cm³. Miért nem segít 0 °C-on még egy $\pm0{,}001$ °C-os hőmérő sem?`,
          options: [
            "Mert V-nek a 0-ban ugrása van: a mért 0,000 °C mellett a hiba akár 90,88 cm³ is lehet.",
            "Mert V a 0 °C-ban nincs értelmezve.",
            "Mert 0 °C körül V nagyon meredek – egy még pontosabb hőmérő már elég lenne.",
            "Segít: elég pontos hőmérővel itt is tetszőlegesen kicsi a térfogat hibája."
          ],
          answer: 0,
          hint: "Nézd meg a bal és a jobb oldali határértéket a 0-ban! Folytonos-e ott V?",
          explain: R`$\lim\limits_{T\to 0-} V(T) = 1091$, $\lim\limits_{T\to 0+} V(T) = V(0) = 1000{,}12$: ugrás, a különbség $90{,}88$ cm³. Akármilyen kicsi $\delta$-ablakban van jég és víz is, ezért egyetlen $\delta$ sem jó az $\varepsilon = 0{,}1$-hez – a 0-ban $V$ nem folytonos. $V(0)$ értelmezve van (a víz ágon), tehát nem ez a gond. A „meredek” függvénynél kisebb $\delta$ segítene – szakadásnál semmilyen $\delta$ sem segít; ez a különbség a meredekség és a szakadás között.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a modellben 4 °C-on mekkora $\delta$ kell, ha a térfogat hibája legfeljebb $\varepsilon = 0{,}03$ cm³ lehet?`,
          options: [R`$\delta = 2$ °C`, R`$\delta = 4$ °C`, R`$\delta \approx 0{,}17$ °C`, R`$\delta = 0{,}03$ °C`],
          answer: 0,
          hint: R`$V(4) = 1000$, és $|V(T) - V(4)| = 0{,}0075\,(T - 4)^2$. Oldd meg a $0{,}0075\,(T - 4)^2 \lt 0{,}03$ egyenlőtlenséget!`,
          explain: R`$(T - 4)^2 \lt \tfrac{0{,}03}{0{,}0075} = 4 \iff |T - 4| \lt 2$: $\delta = 2$ °C. A 4 °C a $(T - 4)^2$ korlátja – kimaradt a gyökvonás. A $0{,}17$ °C-nál kimaradt a $0{,}0075$-ös szorzó: $(T - 4)^2 \lt 0{,}03$, $\sqrt{0{,}03} \approx 0{,}17$. A $0{,}03$ °C a „$\delta = \varepsilon$” tévhit: a 4 °C körül a függvény lapos, ezért itt nagyon pontatlan hőmérő is elég.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bank 1 millió Ft-ot ad, és 3 évig évi 370 000 Ft-ot kér vissza. Mekkora az éves kamatláb?",
          options: ["kb. 5,41%", "11%", "kb. 3,67%", "10%"],
          answer: 0,
          hint: "A kamat csak a még fennálló tartozásra jár, és a tartozás évről évre csökken. Az egyenletet nem tudod p-re kifejezni – mit mond Bolzano és a felezés?",
          explain: R`Az $F(p) = 370\,000\cdot\dfrac{q^3 - 1}{q^3(q - 1)} - 1\,000\,000$ ($q = 1 + \tfrac{p}{100}$) folytonos, $F(1) \gt 0$, $F(9) \lt 0$: van gyök, felezéssel $p \approx 5{,}41\%$. A 11% a „$3 \cdot 370\,000 = 1{,}11$ millió” egyszerű osztás – de a tőke folyamatosan csökken. A $3{,}67\% = \tfrac{11\%}{3}$ ugyanez a hiba évekre osztva. A 10% a 2.7 hitele, ott a részlet $402\,115$ Ft volt – a kisebb részlethez kisebb kamatláb tartozik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az előző hitelnél $F(1) \approx 88\,165 \gt 0$, $F(9) \approx -63\,421 \lt 0$, és a felezőpontban $F(5) \approx 7\,602$. Melyik intervallumban folytatod a felezést?`,
          options: [R`$[5; 9]$`, R`$[1; 5]$`, R`$[1; 9]$`, R`$[5; 7]$`],
          answer: 0,
          hint: "Melyik félen van előjelváltás?",
          explain: R`$F(5) \gt 0$ és $F(9) \lt 0$: az előjelváltás a $[5; 9]$-en van, ott van a gyök. Az $[1; 5]$ a rossz fél – ott $F(1)$ és $F(5)$ is pozitív. Az $[1; 9]$-nél elmaradt a felezés. Az $[5; 7]$ már a következő lépés eredménye, amihez $F(7) \approx -29\,003$ kell – azt még nem számoltuk ki.`
        },
        {
          type: "match",
          q: R`Parkolás: $P(t) = 400\cdot\lceil t\rceil$ Ft (minden megkezdett óra 400 Ft). Párosítsd!`,
          pairs: [
            [R`$P(0{,}3)$`, "400 Ft"],
            [R`$P(2)$`, "800 Ft"],
            [R`$\lim\limits_{t\to 2+} P(t)$`, "1200 Ft"],
            [R`$\lim\limits_{t\to 3+} P(t)$`, "1600 Ft"]
          ],
          hint: R`$\lceil t\rceil$ a felfelé kerekítés: az egész számot nem változtatja, a 2-nél kicsit nagyobb számot 3-ra kerekíti.`,
          explain: R`$\lceil 0{,}3\rceil = 1$: 400 Ft. $\lceil 2\rceil = 2$: 800 Ft. Ha $t \to 2+$, akkor $\lceil t\rceil = 3$: 1200 Ft; ha $t \to 3+$, akkor 4: 1600 Ft. Balról viszont $\lim\limits_{t\to 2-} P(t) = 800 = P(2)$: az egész helyeken ugrás van (400 Ft-tal), és a függvény <b>balról</b> folytonos. Két egész között $P$ állandó, ott folytonos.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x, y) = \dfrac{xy}{x^2 + y^2}$. Mihez tart $f$, ha a $(0; 0)$-hoz az $y = 2x$ egyenes mentén közelítünk?`,
          options: [R`$\tfrac25$`, R`$\tfrac12$`, R`$2$`, R`$0$`],
          answer: 0,
          hint: R`Helyettesíts $y = 2x$-et, emelj ki $x^2$-et a számlálóból és a nevezőből is!`,
          explain: R`$f(x, 2x) = \dfrac{2x^2}{x^2 + 4x^2} = \dfrac{2}{5}$ minden $x \ne 0$-ra (általában $\tfrac{m}{1 + m^2}$, itt $m = 2$). Az $\tfrac12$ az $y = x$ átlóhoz tartozik, a $0$ az $x$ tengelyhez (vagy a „$\tfrac00 = 0$” tévhit), a $2$ magának a meredekségnek a beírása. Mivel a különböző irányok más-más értéket adnak, a $(0; 0)$-ban nincs határérték.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "an3-final": {
      title: "Fejezetzáró teszt – 3. Függvények határértéke és folytonossága",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \sin\dfrac{\pi}{x}$ értéke $x = 1;\ 0{,}1;\ 0{,}01;\ 0{,}001$-re mind 0. Mi következik ebből a $\lim\limits_{x\to 0} f(x)$-re?`,
          options: [
            R`Semmi biztos – sőt, az $x = \tfrac{2}{4n + 1}$ pontokban $f = 1$, ezért nincs határérték.`,
            "A határérték 0, mert a táblázat minden értéke 0.",
            R`A határérték 0, mert behelyettesítve $\sin 0 = 0$.`,
            R`A 0-ban $f$ nincs értelmezve, ezért ott határértéket keresni értelmetlen.`
          ],
          answer: 0,
          hint: "Egy-két jól választott pont (vagy egy jó sorozat) bizonyít-e határértéket? Mit mond az átviteli elv a „minden sorozatra” kikötésről?",
          explain: R`Az $x_n = \tfrac1n$ sorozatra $\sin(n\pi) = 0 \to 0$, az $y_n = \tfrac{2}{4n + 1}$ sorozatra $\sin\left(2n\pi + \tfrac\pi2\right) = 1 \to 1$. Két 0-hoz tartó sorozat, különböző képhatárérték: nincs határérték. A táblázat csak sejtés – „egy jó sorozat” nem bizonyíték. A $\sin 0$ behelyettesítés hibás: $x \to 0$ esetén $\tfrac{\pi}{x} \to \pm\infty$, nem 0. Az értelmezetlenség pedig nem akadály: a $\tfrac{x^2 - 1}{x - 1}$-nek az 1-ben van határértéke, pedig ott sincs értelmezve.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to 1}(4x - 3) = 1$. Mekkora $\delta$ jó $\varepsilon = 0{,}02$-höz (a legnagyobb ilyen)?`,
          options: [R`$0{,}005$`, R`$0{,}08$`, R`$0{,}02$`, R`$0{,}01$`],
          answer: 0,
          hint: R`Írd fel $|f(x) - 1|$-et $|x - 1|$ segítségével. Hányszorosára nagyítja a függvény az eltérést?`,
          explain: R`$|4x - 3 - 1| = 4|x - 1| \lt 0{,}02 \iff |x - 1| \lt 0{,}005$: $\delta = \tfrac{\varepsilon}{4} = 0{,}005$. A $0{,}08 = 4\varepsilon$ fordítva számol (a meredekség szűkíti az ablakot, nem tágítja). A $0{,}02$ a „$\delta = \varepsilon$” tévhit, a $0{,}01 = \tfrac\varepsilon2$ a $2x + 1$ példájának meredekségével számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 2-}\lfloor x\rfloor + \lim\limits_{x\to 2+}\lfloor x\rfloor$?`,
          options: ["3", "4", "2", "nem létezik"],
          answer: 0,
          hint: R`Külön-külön számold ki a két egyoldali határértéket! Melyik egész szám a $\lfloor x\rfloor$, ha $x$ kicsivel kisebb, illetve nagyobb 2-nél?`,
          explain: R`Ha $1 \le x \lt 2$, akkor $\lfloor x\rfloor = 1$; ha $2 \le x \lt 3$, akkor 2. Az összeg $1 + 2 = 3$. A 4 mindkét oldalra $f(2) = 2$-t ír (a határérték nem a helyettesítési érték). A 2 mindkét oldalon 1-gyel számol. A „nem létezik” összekeveri a kérdést a kétoldali határértékkel: az valóban nem létezik, de a két <em>egyoldali</em> létezik, és ezeket adjuk össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mik az $f(x) = \dfrac{x^2 - 4}{x^2 - 3x + 2}$ függvény lyukai és aszimptotái?`,
          options: [
            R`lyuk az $x = 2$-ben; függőleges aszimptota: $x = 1$; vízszintes: $y = 1$`,
            R`függőleges aszimptoták: $x = 1$ és $x = 2$; vízszintes: $y = 1$`,
            R`lyuk az $x = 2$-ben; függőleges aszimptota: $x = 1$; vízszintes: $y = -2$`,
            R`lyuk az $x = -2$-ben; függőleges aszimptota: $x = -1$; vízszintes: $y = 1$`
          ],
          answer: 0,
          hint: "Bonts szorzattá a számlálót és a nevezőt is! A közös tényező lyukat ad, a megmaradó nevező-gyök aszimptotát. A végtelenben a főegyütthatók döntenek.",
          explain: R`$\dfrac{(x - 2)(x + 2)}{(x - 1)(x - 2)} = \dfrac{x + 2}{x - 1}$ ($x \ne 2$). A 2-ben lyuk (értéke $\tfrac41 = 4$), az 1-ben a nevező 0 marad, a számláló 3: függőleges aszimptota. Azonos fok, a főegyütthatók hányadosa $\tfrac11$: $y = 1$. A második opcióban elmaradt az egyszerűsítés, a harmadikban a konstans tagok hányadosa ($\tfrac{-4}{2}$) került a főegyütthatók helyére, a negyedikben gyöktényező-előjelhiba van.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to -\infty}\dfrac{2x^4 - x}{3x^3 + 1} = ?$`,
          options: [R`$-\infty$`, R`$+\infty$`, R`$\tfrac23$`, R`$0$`],
          answer: 0,
          hint: R`Mihez hasonlít a tört nagy $|x|$-re? Írd fel a $\tfrac{a_k}{b_m}x^{k - m}$ alakot, és figyelj: $x$ negatív!`,
          explain: R`A tört úgy viselkedik, mint $\dfrac{2x^4}{3x^3} = \dfrac23x$. Ha $x \to -\infty$, akkor $\tfrac23x \to -\infty$ (a fokkülönbség 1, páratlan, ezért a $-\infty$-ben előjelet vált). A $+\infty$ ez az előjelhiba (csak a $+\infty$ irányt nézi). A $\tfrac23$ a főegyütthatók hányadosa, de az csak azonos fokú számlálónál és nevezőnél határérték. A $0$ a konstans tagokból jön ($\tfrac01$) – a végtelenben a legnagyobb hatványok döntenek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = \dfrac{x^2 + 3x + 1}{x + 1}$ ferde aszimptotája?`,
          options: [R`$y = x + 2$`, R`$y = x + 3$`, R`$y = x$`, R`$y = 1$`],
          answer: 0,
          hint: "Végezd el a polinomosztást, és ellenőrizd visszaszorzással! A maradéktört a végtelenben 0-hoz tart.",
          explain: R`$x^2 + 3x + 1 = (x + 1)(x + 2) - 1$, így $f(x) = x + 2 - \tfrac{1}{x + 1}$, és $f(x) - (x + 2) \to 0$: az aszimptota $y = x + 2$. Az $y = x + 3$ a tagonkénti „egyszerűsítésből” jön ($\tfrac{x^2}{x} + \tfrac{3x}{x}$, mintha a nevező csak $x$ lenne). Az $y = x$ csak a főtagokat ($\tfrac{x^2}{x}$) nézi, a $b$-t elhagyja. Az $y = 1$ vízszintes aszimptotának gondolja – de a számláló foka eggyel nagyobb, a függvény a végtelenbe tart.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to -\infty}\dfrac{3x}{\sqrt{x^2 + 4}} = ?$`,
          options: [R`$-3$`, R`$3$`, R`$0$`, R`$-1$`],
          answer: 0,
          hint: R`Emelj ki $|x|$-et a gyök alól. Mennyi $\sqrt{x^2}$, ha $x$ negatív?`,
          explain: R`$x \lt 0$ esetén $\sqrt{x^2 + 4} = |x|\sqrt{1 + \tfrac4{x^2}} = -x\sqrt{1 + \tfrac4{x^2}}$, így a tört $\dfrac{3x}{-x\sqrt{1 + 4/x^2}} = \dfrac{-3}{\sqrt{1 + 4/x^2}} \to -3$. A $3$ a $\sqrt{x^2} = x$ hiba (az csak $+\infty$-ben jó). A $0$ a „számláló per nagy nevező” elhamarkodott olvasata – a fokok itt egyenlők. A $-1$ az $\tfrac{x}{\sqrt{x^2 + 1}}$ bemagolt eredménye, a 3-as szorzó nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to +\infty}\left(\dfrac{x + 3}{x + 1}\right)^{2x} = ?$`,
          options: [R`$e^4$`, R`$1$`, R`$e^2$`, R`$e^6$`],
          answer: 0,
          hint: R`$1^\infty$ alak. Írd az alapot $1 + \tfrac{r}{p(x)}$ alakba egészrész-kiemeléssel, a kitevőt pedig $p(x)\cdot\tfrac{q(x)}{p(x)}$ alakba!`,
          explain: R`$\dfrac{x + 3}{x + 1} = 1 + \dfrac{2}{x + 1}$, $r = 2$, $p(x) = x + 1$. A kitevő $(x + 1)\cdot\dfrac{2x}{x + 1}$, és $\dfrac{2x}{x + 1} \to 2 = s$. A határérték $e^{rs} = e^{2\cdot2} = e^4 \approx 54{,}6$. Az $1$ az „$1^\infty = 1$” tévhit. Az $e^2$-nél kimaradt a kitevő-arány ($s = 2$). Az $e^6$ az $r$ helyett a számláló konstans tagjával (3) számol.`
        },
        {
          type: "match",
          q: "Párosítsd a határértékeket az értékükkel!",
          pairs: [
            [R`$\lim\limits_{x\to 0}\dfrac{\sin 5x}{x}$`, "5"],
            [R`$\lim\limits_{x\to +\infty}\dfrac{\sin x}{x}$`, "0"],
            [R`$\lim\limits_{x\to 0}\dfrac{e^{2x} - 1}{x}$`, "2"],
            [R`$\lim\limits_{x\to 0}\dfrac{\ln(1 + x)}{x}$`, "1"],
            [R`$\lim\limits_{x\to 0}\dfrac{3^x - 1}{x}$`, "ln 3"]
          ],
          hint: R`A nevezetes határértékeknél az argumentum és a nevező legyen ugyanaz – ha kell, bővíts! És figyeld, hová tart $x$: a 0-hoz vagy a végtelenbe?`,
          explain: R`$\tfrac{\sin 5x}{x} = 5\cdot\tfrac{\sin 5x}{5x} \to 5$ (nem 1!). A végtelenben $\left|\tfrac{\sin x}{x}\right| \le \tfrac1x \to 0$ – a $\tfrac{\sin x}{x} \to 1$ csak a 0-ban igaz. $\tfrac{e^{2x} - 1}{x} = 2\cdot\tfrac{e^{2x} - 1}{2x} \to 2$. $\tfrac{\ln(1 + x)}{x} \to 1$ (nevezetes). $3^x = e^{x\ln 3}$, így $\tfrac{3^x - 1}{x} \to \ln 3 \approx 1{,}0986$ – nem 3 és nem 1.`
        },
        {
          type: "single", shuffle: true,
          q: R`Milyen szakadása van az $f(x) = \dfrac{\sin x}{|x|}$ függvénynek a 0-ban?`,
          options: ["ugrás", "megszüntethető", "végtelen szakadás", "oszcilláló"],
          answer: 0,
          hint: R`Bontsd két esetre: $x \gt 0$ és $x \lt 0$. Mivel egyenlő ott $|x|$?`,
          explain: R`$x \gt 0$: $\tfrac{\sin x}{x} \to 1$. $x \lt 0$: $\tfrac{\sin x}{-x} \to -1$. Két különböző véges egyoldali határérték: ugrás (elsőfajú), folytonossá nem tehető. A „megszüntethető” csak a jobb oldalt nézi ($\tfrac{\sin x}{x} \to 1$) – az $|x|$ előjelét elfelejti. A „végtelen” a $\tfrac{\ldots}{0}$ látványából jön, de a számláló is 0-hoz tart ($\tfrac00$). Oszcilláló nincs: mindkét egyoldali határérték létezik.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \dfrac{\sin(kx)}{2x}$, ha $x \ne 0$, és $f(0) = 3$. Milyen $k$-ra folytonos $f$ a 0-ban?`,
          options: [R`$k = 6$`, R`$k = 3$`, R`$k = \tfrac32$`, R`nincs ilyen $k$, mert $\tfrac{\sin kx}{2x} \to \tfrac12$`],
          answer: 0,
          hint: R`Számold ki a határértéket $k$-val: bővíts úgy, hogy a szinusz argumentuma és a nevező megegyezzen. Utána tedd egyenlővé $f(0)$-val!`,
          explain: R`$\dfrac{\sin kx}{2x} = \dfrac{k}{2}\cdot\dfrac{\sin kx}{kx} \to \dfrac k2$ ($k \ne 0$). Folytonosság: $\tfrac k2 = 3$, $k = 6$. A $k = 3$-nál elmaradt a nevező 2-es szorzója ($\tfrac{\sin kx}{x} \to k$). A $\tfrac32$ fordítva szoroz ($\tfrac{k}{2}$ helyett $2k = 3$). Az utolsó a „$\tfrac{\sin 3x}{x} \to 1$” típusú hiba: a $\tfrac{\sin u}{u} \to 1$ csak azonos argumentumra igaz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány felezés kell az $[1; 3]$ intervallumból indulva, hogy a gyököt tartalmazó intervallum hossza $0{,}001$ alá csökkenjen?`,
          options: ["11", "10", "12", "9"],
          answer: 0,
          hint: R`$\dfrac{b - a}{2^n} \lt h$. Mennyi itt $b - a$? Keresd meg az első elég nagy kettőhatványt!`,
          explain: R`$\dfrac{2}{2^n} \lt 0{,}001 \iff 2^n \gt 2000$. $2^{10} = 1024$ kevés, $2^{11} = 2048$ elég: 11 lépés. A 10 az 1 hosszú intervallum receptje ($2^{10} \gt 1000$) – itt az intervallum 2 hosszú. A 12 eggyel túllő ($2^{12} = 4096$ is jó, de nem ez a legkevesebb). A 9-nél $2^9 = 512 \lt 2000$ – kevés.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`A $\cos x - x$ a $\left[0; \tfrac\pi2\right]$ végpontjaiban ellentétes előjelű, ezért van ott gyöke.`,
            R`Ha $f$ folytonos a $]0; 1[$ nyílt intervallumon, akkor van legnagyobb értéke.`,
            R`Az $x^2$ a $[-1; 2]$-n csak az 1 és 4 közötti értékeket veszi fel.`,
            R`Folytonos függvény a $[a; b]$-t a $[\min; \max]$ intervallumra képezi.`,
            R`A $\operatorname{sgn} x$-nek nincs gyöke a $[-1; 1]$-en, mert nem folytonos.`
          ],
          answer: [0, 3],
          hint: "Melyik tételnek mi a feltétele (folytonosság, zárt intervallum)? És ha a feltétel nem teljesül, következik-e, hogy az állítás hamis?",
          explain: R`Igaz: $\cos 0 - 0 = 1 \gt 0$, $\cos\tfrac\pi2 - \tfrac\pi2 = -\tfrac\pi2 \lt 0$, a függvény folytonos – Bolzano (a gyök $\approx 0{,}739$). Igaz: Weierstrass szerint van min és max, Darboux szerint közöttük mindent felvesz. Hamis: nyílt intervallumon nincs garancia – az $x$ a $]0; 1[$-en nem veszi fel a maximumát. Hamis: Darboux nem mondja, hogy <em>csak</em> a köztes értékeket – az $x^2$ a 0-t is felveszi. Hamis: a $\operatorname{sgn} x$-re a tétel nem alkalmazható, de gyöke van: $\operatorname{sgn} 0 = 0$ (a feltétel elégséges, nem szükséges).`
        },
        {
          type: "single", shuffle: true,
          q: R`A víz modelljében $\varepsilon = 0{,}1$ cm³-hez 20 °C-on $\delta \approx 0{,}41$ °C, 4 °C-on $\delta \approx 3{,}65$ °C kell. Mit mutat ez?`,
          options: [
            R`A folytonosság definíciójában $\delta$ nemcsak az $\varepsilon$-tól, hanem a ponttól is függhet.`,
            "Az egyik számolás hibás: ugyanahhoz az ε-hoz mindenhol ugyanaz a δ tartozik.",
            "A 4 °C-ban a függvény nem folytonos, ezért ott más a δ.",
            R`A kisebb $\delta$ a jobb: 4 °C-on is elég lenne $\delta = 0{,}41$, a $3{,}65$ felesleges.`
          ],
          answer: 0,
          hint: R`Hol meredek és hol lapos a $V(T) = 1000 + 0{,}0075\,(T - 4)^2$ grafikonja? Mit mond a definíció: $\delta$-t mikor és mi alapján választjuk?`,
          explain: R`A 4 °C-ban $V$-nek minimuma van, a grafikon lapos: nagy hőmérséklet-eltérés is csak kis térfogathibát okoz. 20 °C-on meredekebb, ott kisebb $\delta$ kell. A definíció minden pontban külön mondja ki: „minden $\varepsilon$-hoz van $\delta$” – és ez a $\delta$ pontonként más lehet. Nem kell, hogy egy $\delta$ mindenhol jó legyen. A 4 °C-ban $V$ folytonos (polinom), tehát nem szakadás okozza a különbséget. A $0{,}41$ 4 °C-on is <em>jó</em> volna, de a kérdés az, hogy mennyire pontatlan hőmérő elég – ott sokkal pontatlanabb is.`
        }
      ]
    },
}; })();
