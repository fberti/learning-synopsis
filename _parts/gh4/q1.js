    /* ------------------------------------------------ 4.1 */
    "gh4-41": {
      title: "Kvíz – 4.1 Mátrix–vektor szorzás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $BC$, $BD$, $CD$. A csúcsok értékei az $A, B, C, D$ sorrendben $\mathbf x = (2, 1, 3, 5)^\top$. Mi $A\mathbf x$?`,
          options: [
            R`$(1, 10, 6, 4)^\top$`,
            R`$(3, 11, 9, 9)^\top$`,
            R`$(1;\ 3{,}33;\ 3;\ 2)^\top$`,
            R`$(8, 0, 2, 2)^\top$`
          ],
          answer: 0,
          hint: "Minden csúcs a szomszédai értékét adja össze. Benne van-e a saját értéke?",
          explain: R`$(A\mathbf x)_i$ a szomszédok értékeinek összege: $A$: $x_B = 1$; $B$: $x_A + x_C + x_D = 2 + 3 + 5 = 10$; $C$: $x_B + x_D = 1 + 5 = 6$; $D$: $x_B + x_C = 1 + 3 = 4$. A $(3, 11, 9, 9)$ a saját értéket is beszámolja – ez az $(A + I)\mathbf x$, de a főátlóban 0 áll. Az $(1;\ 3{,}33;\ 3;\ 2)$ már a szomszédátlag ($D^{-1}A\mathbf x$). A $(8, 0, 2, 2)$ a <b>nem</b> szomszédokat adja össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanitt (élek $AB$, $BC$, $BD$, $CD$; $\mathbf x = (2, 1, 3, 5)^\top$) mennyi a $B$ szomszédátlaga, $(D^{-1}A\mathbf x)_B$?`,
          options: [R`$3{,}33$`, R`$2{,}5$`, R`$2{,}75$`, R`$10$`],
          answer: 0,
          hint: R`Átlag: a szomszédok összegét mivel osztod? A csúcsok számával vagy a $B$ fokszámával?`,
          explain: R`A $B$ szomszédainak összege $2 + 3 + 5 = 10$, a fokszáma $d_B = 3$, így az átlag $10/3 \approx 3{,}33$. A $2{,}5 = 10/4$ a csúcsok számával ($n = 4$) oszt – ez nem átlag, hanem $\frac1n A\mathbf x$. A $2{,}75 = 11/4$ a saját értéket is beveszi, és 4 értéket átlagol. A 10 az összeg, osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $BC$, $CD$, $DA$, $AC$ (4 csúcs, 5 él). Mi $A\mathbf 1$, ahol $\mathbf 1$ a csupa egyes vektor?`,
          options: [
            R`$(3, 2, 3, 2)^\top$`,
            R`$(4, 4, 4, 4)^\top$`,
            R`$(5, 5, 5, 5)^\top$`,
            R`$(4, 3, 4, 3)^\top$`
          ],
          answer: 0,
          hint: "Ha minden csúcs értéke 1, és mindenki összeadja a szomszédai értékét, mit számol meg?",
          explain: R`Minden csúcs annyi 1-est kap, ahány szomszédja van: $A\mathbf 1 = \mathbf d$, a fokszámok vektora, itt $(3, 2, 3, 2)$. Az elemek összege $10 = 2m$ – a kézfogási lemma. A $(4, 4, 4, 4)$ a csúcsok száma ($n$), az $(5, 5, 5, 5)$ az élek száma ($m$) – egyik sem csúcsonkénti. A $(4, 3, 4, 3)$ a saját 1-est is beszámolja: ez $(A + I)\mathbf 1$.`
        },
        {
          type: "match",
          q: "Párosítsd a kifejezést a jelentésével!",
          pairs: [
            [R`$A\mathbf x$`, "a szomszédok értékeinek összege"],
            [R`$D^{-1}A\mathbf x$`, "a szomszédok értékeinek átlaga"],
            [R`$A\mathbf 1$`, "a fokszámok vektora"],
            [R`$(A + I)\mathbf x$`, "a saját érték plusz a szomszédok összege"],
            [R`$A^k\mathbf x$`, "a k hosszú séták végpontjain álló értékek összege"],
            [R`$D^{-1}A\mathbf 1$`, "a csupa egyes vektor"]
          ],
          hint: R`$A$: add össze; $D^{-1}$: oszd el a fokszámmal; $I$: a saját érték; a $k$-adik hatvány: csináld meg $k$-szor.`,
          explain: R`$A\mathbf x$ összegez, $D^{-1}A\mathbf x$ átlagol (csúcsonként a saját fokszámmal oszt). $A\mathbf 1$-ben mindenki annyi 1-est kap, ahány szomszédja van: a fokszámvektor. Az $(A + I)$ főátlójában 1 áll, így a saját érték is bekerül (ezt használja a GCN). $A^k\mathbf x$ a 2.7 eredménye: $k$-szor ismételt összegzés. A konstans 1 vektor szomszédátlaga mindenütt 1, ezért $D^{-1}A\mathbf 1 = \mathbf 1$ (izolált csúcs nélkül).`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfjában (élek: $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{La}$–$\mathrm{Po}$, $\mathrm{Po}$–$\text{Ön}$) legyen $x_i = 1$ a Lakókra, az Önkéntesekre, a Polgármesterre és a Vízügyre, a többieknél 0. Mennyi $(A\mathbf x)_{\mathrm{Po}}$ és $(A\mathbf x)_{\mathrm{Ko}}$?`,
          options: [
            R`$(A\mathbf x)_{\mathrm{Po}} = 3$, $(A\mathbf x)_{\mathrm{Ko}} = 2$`,
            R`$(A\mathbf x)_{\mathrm{Po}} = 4$, $(A\mathbf x)_{\mathrm{Ko}} = 2$`,
            R`$(A\mathbf x)_{\mathrm{Po}} = 0{,}75$, $(A\mathbf x)_{\mathrm{Ko}} = 0{,}5$`,
            R`$(A\mathbf x)_{\mathrm{Po}} = 4$, $(A\mathbf x)_{\mathrm{Ko}} = 4$`
          ],
          answer: 0,
          hint: "Sorold fel a Polgármester és a Kormány szomszédait, és számold meg, hány 1-es van köztük. Beleszámít-e a csúcs saját értéke?",
          explain: R`$(A\mathbf x)_i$ = hány „kijelölt” szomszédja van $i$-nek. A Polgármester szomszédai: $\mathrm{Ko}$, $\mathrm{Vi}$, $\mathrm{La}$, $\text{Ön}$ – közülük 3 kijelölt ($\mathrm{Vi}$, $\mathrm{La}$, $\text{Ön}$). A Kormány szomszédai: $\mathrm{Vi}$, $\mathrm{Po}$, $\mathrm{Sz}$, $\mathrm{Kl}$ – közülük 2. A „4 és 2” a Polgármester saját 1-esét is beszámolja. A „0,75 és 0,5” már szomszédátlag (osztva a 4-es fokszámmal). A „4 és 4” a fokszám, vagyis $A\mathbf 1$ – mintha mindenki 1-es lenne.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Hurok nélküli gráfban $(A\mathbf x)_i$-ben nem szerepel $x_i$.`,
            R`Izolált csúcs nélküli gráfban $D^{-1}A\mathbf 1 = \mathbf 1$.`,
            R`Az $A\mathbf x$ elemeinek összege $\sum_j d_j x_j$.`,
            R`A szomszédátlag $\frac1n A\mathbf x$, ahol $n$ a csúcsok száma.`,
            R`Irányított gráfban is mindig $A\mathbf x = (\mathbf x^\top A)^\top$.`
          ],
          answer: [0, 1, 2],
          hint: "Mi áll a főátlóban? Mivel osztunk átlagoláskor? És irányított gráfban szimmetrikus-e a mátrix?",
          explain: R`A főátló 0, ezért a saját érték nem kerül bele az összegbe. A konstans 1 jel szomszédátlaga 1, tehát $D^{-1}A\mathbf 1 = \mathbf 1$. Minden $x_j$ annyi szomszéd összegébe kerül be, ahány szomszédja van, ezért az összeg $\sum_j d_j x_j$. Az átlagnál viszont csúcsonként a <b>saját fokszámmal</b> osztunk, nem $n$-nel. Irányított gráfban $A$ nem szimmetrikus: $A\mathbf x$ a kimenő, $\mathbf x^\top A$ a bejövő szomszédokat gyűjti – a kettő általában különbözik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf ($A_{ij} = 1$, ha $i \to j$), élek: $1 \to 2$, $1 \to 3$, $2 \to 3$, $3 \to 1$; $\mathbf x = (1, 2, 3)^\top$. Mennyi $(A\mathbf x)_1$ és $(\mathbf x^\top A)_1$?`,
          options: [
            R`$(A\mathbf x)_1 = 5$, $(\mathbf x^\top A)_1 = 3$`,
            R`$(A\mathbf x)_1 = 3$, $(\mathbf x^\top A)_1 = 5$`,
            R`$(A\mathbf x)_1 = 5$, $(\mathbf x^\top A)_1 = 5$`,
            R`$(A\mathbf x)_1 = 6$, $(\mathbf x^\top A)_1 = 4$`
          ],
          answer: 0,
          hint: R`$A\mathbf x$ az 1. <b>sor</b> mentén gyűjt, $\mathbf x^\top A$ az 1. <b>oszlop</b> mentén. Melyik a kimenő, melyik a bejövő szomszéd?`,
          explain: R`Az 1. sorban az 1-ből induló élek állnak ($1 \to 2$, $1 \to 3$): $(A\mathbf x)_1 = x_2 + x_3 = 5$ – a kimenő szomszédok összege. Az 1. oszlopban az 1-be érkező élek ($3 \to 1$): $(\mathbf x^\top A)_1 = x_3 = 3$ – a bejövőké. A „3 és 5” a sor és az oszlop felcserélése. Az „5 és 5” azt feltételezi, hogy $A$ szimmetrikus – irányított gráfban nem az. A „6 és 4” a saját értéket ($x_1 = 1$) is hozzáadja.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2 */
    "gh4-42": {
      title: "Kvíz – 4.2 Véletlen séta",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$. Mi a véletlen séta átmenetmátrixának $A$-sora, $(P_{AA}, P_{AB}, P_{AC}, P_{AD})$?`,
          options: [
            R`$(0, \frac13, \frac13, \frac13)$`,
            R`$(0, \frac12, \frac12, 1)$`,
            R`$(\frac14, \frac14, \frac14, \frac14)$`,
            R`$(0, 1, 1, 1)$`
          ],
          answer: 0,
          hint: R`$P_{ij} = A_{ij}/d_i$: kinek a fokszámával osztasz – azé, ahonnan lép, vagy azé, ahová?`,
          explain: R`Az $A$-nak három szomszédja van ($d_A = 3$), mindegyikhez $\frac13$ eséllyel lép; önmagába 0-val. A sor összege 1, ahogy egy sztochasztikus mátrixban kell. A $(0, \frac12, \frac12, 1)$ a <b>cél</b> fokszámával oszt ($1/d_j$) – ez valójában a $P$ $A$-<b>oszlopa</b>, és az összege nem 1. Az $(\frac14, \dots)$ az $1/n$-es hiba: a séta csak szomszédra léphet. A $(0, 1, 1, 1)$ az $A$ szomszédsági sora, a fokszámmal való osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanezen a gráfon (élek $AB$, $AC$, $AD$, $BC$) a séta a $B$-ről indul: $\mathbf p_0 = (0, 1, 0, 0)$. Mi $\mathbf p_2$ (az $A, B, C, D$ sorrendben)?`,
          options: [
            R`$(\frac14, \frac5{12}, \frac16, \frac16)$`,
            R`$(\frac12, 0, \frac12, 0)$`,
            R`$(\frac14, \frac14, \frac16, \frac16)$`,
            R`$(\frac16, \frac12, \frac14, \frac12)$`
          ],
          answer: 0,
          hint: R`Először $\mathbf p_1$. Utána minden célcsúcsra: honnan juthat oda, és mekkora eséllyel? Az utakat add össze (teljes valószínűség).`,
          explain: R`$\mathbf p_1 = (\frac12, 0, \frac12, 0)$, a $B$ sora. Második lépés: az $A$-ról ($\frac12$) a három szomszédja egyikére, egyenként $\frac12 \cdot \frac13 = \frac16$; a $C$-ről ($\frac12$) az $A$-ra vagy a $B$-re, egyenként $\frac12 \cdot \frac12 = \frac14$. Összegezve: $A$: $\frac14$; $B$: $\frac16 + \frac14 = \frac5{12}$; $C$: $\frac16$; $D$: $\frac16$ – összeg 1. ✓ A $(\frac14, \frac14, \frac16, \frac16)$ elfelejti az $A \to B$ utat (összege nem is 1). A $(\frac12, 0, \frac12, 0)$ csak egy lépés. A $(\frac16, \frac12, \frac14, \frac12)$ a $P\mathbf p_1$ (jobbról szorzás = szomszédátlag), nem $\mathbf p_1^\top P$ – az összege sem 1.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a stacionárius eloszlás az élek $AB$, $AC$, $AD$, $BC$ gráfon (az $A, B, C, D$ sorrendben)?`,
          options: [
            R`$(\frac38, \frac14, \frac14, \frac18)$`,
            R`$(\frac34, \frac12, \frac12, \frac14)$`,
            R`$(\frac14, \frac14, \frac14, \frac14)$`,
            R`$(\frac17, \frac3{14}, \frac3{14}, \frac37)$`
          ],
          answer: 0,
          hint: R`Irányítatlan, összefüggő gráf: nem kell mátrixot hatványozni. Mivel arányos az idő, amit a séta egy csúcson tölt? És mennyi a nevező?`,
          explain: R`A fokszámok $3, 2, 2, 1$, összegük $2m = 8$, így $\pi_i = d_i/2m = (\frac38, \frac28, \frac28, \frac18)$. A $(\frac34, \frac12, \frac12, \frac14)$ $m$-mel oszt $2m$ helyett – az összege 2, ez nem eloszlás. Az egyenletes eloszlás csak szabályos gráfon stacionárius. A $(\frac17, \dots)$ a fokszám <b>reciprokával</b> arányos – fordítva: a sok szomszédú csúcsra több úton lehet eljutni, ott tölt több időt a séta.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a véletlen séta konvergenciájáról? (Több jó válasz is lehet.)",
          options: [
            R`A csillagon a középről indított séta eloszlása nem konvergál, mert a csillag páros gráf.`,
            R`A lusta séta ($P' = \frac12(I + P)$) stacionárius eloszlása ugyanaz, és már konvergál.`,
            R`Nem összefüggő gráfon a határeloszlás attól függ, honnan indult a séta.`,
            R`Összefüggő gráfon a $\mathbf p_t$ bárhonnan indulva mindig konvergál.`,
            R`Irányított gráfon is $\pi_i = d_i/2m$ a stacionárius eloszlás.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a csillagra (középről indulva hol van a séta páros és páratlan lépés után?), és a lapok hivatkozási gráfjára.",
          explain: R`A páros gráfon a séta váltakozva az egyik, majd a másik osztályban van: a csillagon $\mathbf p_1 = (0, \frac13, \frac13, \frac13)$, $\mathbf p_2 = (1, 0, 0, 0)$, és így tovább. Ezért az „összefüggő gráfon mindig konvergál” hamis – a tételhez az is kell, hogy a gráf <b>ne legyen páros</b>. A lusta séta $\frac12$ eséllyel helyben marad, ez megtöri az oszcillációt; a $\boldsymbol\pi$ nem változik. Nem összefüggő gráfon a séta nem hagyja el a komponensét. Irányított gráfon a $d_i/2m$ képlet nem érvényes: a lapgráfon a séta a Reggeli Hírlapon beragad.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét <b>súlyozott</b> szereplőgráfján az erősségek: $\mathrm{Po}$ 8, $\mathrm{Ko}$ 6, $\mathrm{Vi}$ 5, $\mathrm{La}$ 5, $\text{Ön}$ 5, $\mathrm{Sz}$ 4, $\mathrm{Kl}$ 3 (a fokszámok összege $2m = 20$). Hol tölti a súlyozott séta a legtöbb időt, és mekkora hányadát?`,
          options: [
            R`a Polgármesteren, kb. $22{,}2\%$-át`,
            R`a Kormányon és a Polgármesteren egyformán, $20\%$–$20\%$-ot`,
            R`a Polgármesteren, $40\%$-át`,
            R`a Polgármesteren, kb. $11{,}1\%$-át`
          ],
          answer: 0,
          hint: R`Súlyozott sétánál a fokszám helyére az erősség kerül – a nevezőbe is.`,
          explain: R`Súlyozva $\pi_i = s_i / \sum_k s_k$. Az erősségek összege $8 + 6 + 5 + 5 + 5 + 4 + 3 = 36$, így $\pi_{\mathrm{Po}} = 8/36 \approx 22{,}2\%$. A „20%–20%” a súlyozatlan séta ($d_i/2m$, a Kormány és a Polgármester fokszáma egyaránt 4) – a súly itt eldönti a holtversenyt. A 40% $= 8/20$ az erősséget a fokszámösszeggel osztja – keveri a kettőt. A $11{,}1\% = 8/72$ még egyszer megduplázza a nevezőt, pedig a $\sum s_k$ már minden élt kétszer számol (mint a $2m$).`
        },
        {
          type: "match",
          q: "Párosítsd a jelölést a jelentésével!",
          pairs: [
            [R`$P_{ij}$`, "annak esélye, hogy i-ből egy lépésben j-be lép"],
            [R`$\boldsymbol\pi^\top P = \boldsymbol\pi^\top$`, "a stacionárius eloszlás feltétele"],
            [R`$\mathbf p_0^\top P^t$`, "az eloszlás t lépés után"],
            [R`$P\mathbf x$`, "a szomszédok értékeinek átlaga"],
            [R`$\frac12(I + P)$`, "a lusta séta átmenetmátrixa"],
            ["sztochasztikus mátrix", "nemnegatív, minden sorának összege 1"]
          ],
          hint: R`Figyelj az oldalra: a valószínűséget sorvektorként, balról szorozzuk; a jobbról szorzás a 4.1 művelete.`,
          explain: R`$P_{ij} = A_{ij}/d_i$ az egylépéses átmenet esélye. A stacionárius eloszlás az, amelyet egy lépés nem változtat: $\boldsymbol\pi^\top P = \boldsymbol\pi^\top$. A $t$ lépés utáni eloszlás $\mathbf p_t^\top = \mathbf p_0^\top P^t$ (balról!). A jobbról szorzás, $P\mathbf x = D^{-1}A\mathbf x$, a szomszédátlag – másik művelet. A lusta séta $\frac12$ eséllyel helyben marad: $\frac12(I + P)$. A sztochasztikus mátrix sorai valószínűség-eloszlások.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét súlyozatlan szereplőgráfján az olvasó a Lakók oldaláról indul. A Lakók szomszédai: $\text{Ön}$ és $\mathrm{Po}$; az Önkéntesek szomszédai: $\mathrm{La}$, $\mathrm{Po}$ (fokszám 2); a Polgármesteré: $\mathrm{Ko}$, $\mathrm{Vi}$, $\mathrm{La}$, $\text{Ön}$ (fokszám 4). Mekkora eséllyel van 2 lépés után újra a Lakókon?`,
          options: [R`$\frac38$`, R`$\frac14$`, R`$\frac34$`, R`$\frac1{10}$`],
          answer: 0,
          hint: "Az első lépés után hol lehet, és milyen eséllyel? Onnan mekkora eséllyel lép vissza? Az utakat add össze.",
          explain: R`$\mathbf p_1$: $\text{Ön}$ $\frac12$, $\mathrm{Po}$ $\frac12$. Vissza a Lakókra: az Önkéntesektől $\frac12 \cdot \frac12 = \frac14$, a Polgármestertől $\frac12 \cdot \frac14 = \frac18$; összesen $\frac38$. Az $\frac14$ elfelejti a Polgármesteren át vezető utat. A $\frac34 = \frac12 + \frac14$ az átmenet-valószínűségeket adja össze, de nem szorozza meg őket azzal, hogy mekkora eséllyel volt ott az olvasó. Az $\frac1{10} = \frac2{20}$ a stacionárius $\pi_{\mathrm{La}}$ – az a <b>hosszú távú</b> arány, nem a 2 lépés utáni esély.`
        }
      ]
    },

    /* ------------------------------------------------ 4.3 */
    "gh4-43": {
      title: "Kvíz – 4.3 Sajátvektorok, hatványiteráció",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 3 csúcsú úton (élek $12$, $23$) melyik vektor sajátvektora a szomszédsági mátrixnak?`,
          options: [
            R`$(1, \sqrt2, 1)$`,
            R`$(1, 1, 1)$`,
            R`$(1, 2, 1)$`,
            R`$(2, 1, 2)$`
          ],
          answer: 0,
          hint: R`Számold ki minden csúcsra a szomszédok összegét. Sajátvektornál ez <b>minden</b> csúcson a saját érték ugyanannyiszorosa.`,
          explain: R`$A(1, \sqrt2, 1) = (\sqrt2,\ 2,\ \sqrt2) = \sqrt2 \cdot (1, \sqrt2, 1)$, tehát sajátvektor, $\lambda = \sqrt2$. Az $\mathbf 1$-re $A\mathbf 1 = (1, 2, 1)$ – ez nem számszorosa: az $\mathbf 1$ csak szabályos gráfon sajátvektor. Az $(1, 2, 1)$ a fokszámvektor, de $A(1, 2, 1) = (2, 2, 2)$ – a sajátvektor nem a fokszám. A $(2, 1, 2)$-re $A(2, 1, 2) = (1, 4, 1)$, ez sem arányos.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$. Sajátvektora-e $A$-nak a $\mathbf v = (0, 1, -1, 0)$ (az $A, B, C, D$ sorrendben)?`,
          options: [
            R`Igen, $\lambda = -1$ sajátértékkel.`,
            R`Igen, $\lambda = 1$ sajátértékkel.`,
            R`Nem, mert $A\mathbf v \ne \mathbf v$.`,
            R`Nem, mert van 0 eleme.`
          ],
          answer: 0,
          hint: R`Számold ki $A\mathbf v$-t csúcsonként, és hasonlítsd $\mathbf v$-hez. A sajátérték lehet negatív is.`,
          explain: R`$A\mathbf v$: $A$: $1 - 1 + 0 = 0$; $B$: $0 + (-1) = -1$; $C$: $0 + 1 = 1$; $D$: $0$. Tehát $A\mathbf v = (0, -1, 1, 0) = -1 \cdot \mathbf v$: sajátvektor, $\lambda = -1$. A „$\lambda = 1$” elrontja az előjelet. A sajátvektornak nem kell változatlannak maradnia ($A\mathbf v = \lambda\mathbf v$, nem $A\mathbf v = \mathbf v$), és lehet 0 eleme – csak az egész vektor nem lehet nulla. (Pozitív, 0 nélküli csak a <b>domináns</b> sajátvektor biztosan.)`
        },
        {
          type: "single", shuffle: true,
          q: R`A barátsággráfon (élek $AB$, $AC$, $BC$, $CD$) hatványiterációt végzel $\mathbf x_0 = \mathbf 1$-ből, minden lépés után a legnagyobb elemre normálva. Mi $\mathbf x_2$ (az $A, B, C, D$ sorrendben)?`,
          options: [
            R`$(1;\ 1;\ 1;\ 0{,}6)$`,
            R`$(0{,}67;\ 0{,}67;\ 1;\ 0{,}33)$`,
            R`$(0{,}83;\ 0{,}83;\ 1;\ 0{,}5)$`,
            R`$(0{,}25;\ 0{,}25;\ 0{,}375;\ 0{,}125)$`
          ],
          answer: 0,
          hint: "Két kör: szorozz A-val (szomszédösszeg), majd oszd el a legnagyobb elemmel – és ismételd.",
          explain: R`1. lépés: $A\mathbf 1 = (2, 2, 3, 1)$, normálva $(0{,}67;\ 0{,}67;\ 1;\ 0{,}33)$ – ez csak $\mathbf x_1$. 2. lépés: $A$: $0{,}67 + 1 = 1{,}67$; $B$: $1{,}67$; $C$: $0{,}67 + 0{,}67 + 0{,}33 = 1{,}67$; $D$: $1$. Normálva $(1;\ 1;\ 1;\ 0{,}6)$. A $(0{,}83;\ 0{,}83;\ 1;\ 0{,}5)$ a saját értéket is beszámolja ($A + I$-vel iterál). A $(0{,}25;\ \dots)$ a véletlen séta stacionárius eloszlása – az a $P$-hez tartozik, nem az $A$ hatványiterációjához. (A határ $(0{,}85;\ 0{,}85;\ 1;\ 0{,}46)$, $\lambda_1 \approx 2{,}17$ – ez a gráf ugyanis a „csillag + él”, csak más betűkkel.)`
        },
        {
          type: "multi",
          q: "Összefüggő gráf szomszédsági mátrixáról melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`A legnagyobb sajátérték, $\lambda_1$, egyszeres, és sajátvektora (alkalmas előjellel) minden csúcson pozitív.`,
            R`$\frac{2m}{n} \le \lambda_1 \le d_{\max}$.`,
            R`Ha a gráf páros, $-\lambda_1$ is sajátérték, és a hatványiteráció oszcillál.`,
            R`A hatványiteráció a legkisebb sajátértékhez tartozó sajátvektorhoz tart.`,
            R`A domináns sajátvektor egyértelmű: a számszorosa már nem sajátvektor.`
          ],
          answer: [0, 1, 2],
          hint: "Perron–Frobenius. Melyik tag nő a leggyorsabban az ismételt szorzásnál? És mi történik egy sajátvektor kétszeresével?",
          explain: R`Az első kettő a Perron–Frobenius-tétel (és a korlátja). Páros gráfon a spektrum szimmetrikus, $-\lambda_1$ is sajátérték, ezért a csillagon $(1;\ \frac13;\ \frac13;\ \frac13)$ és $(1;\ 1;\ 1;\ 1)$ váltakozik. A hatványiteráció a <b>legnagyobb</b> (abszolút értékű) sajátértékhez tartozó irányt erősíti fel, mert az a tag nő $\lambda_1^k$-val a leggyorsabban. A sajátvektor számszorosa (pl. $-\mathbf v$ vagy $2\mathbf v$) is sajátvektor – csak az <b>iránya</b> egyértelmű; ezért kell normálni és az előjelet rögzíteni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy összefüggő gráfnak 8 csúcsa és 12 éle van, a legnagyobb fokszám 5. Mit mondhatsz a szomszédsági mátrix legnagyobb sajátértékéről?`,
          options: [
            R`$3 \le \lambda_1 \le 5$`,
            R`$1{,}5 \le \lambda_1 \le 5$`,
            R`$\lambda_1 = 3$`,
            R`$3 \le \lambda_1 \le 8$`
          ],
          answer: 0,
          hint: "Az átlagos és a legnagyobb fokszám közé esik. Mennyi az átlagos fokszám – élek per csúcs, vagy annak kétszerese?",
          explain: R`$\frac{2m}{n} = \frac{24}{8} = 3$ az átlagos fokszám, a felső korlát $d_{\max} = 5$. Az $1{,}5 = m/n$ elfelejti, hogy minden él két csúcs fokszámába számít bele. A $\lambda_1 = 3$ csak 3-szabályos gráfra igaz (ott $\mathbf 1$ a sajátvektor) – itt van 5-ös fokszám, tehát a gráf nem szabályos. A 8 a csúcsok száma, nem a legnagyobb fokszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét domináns sajátvektorában (max = 1) a Kormány értéke 1, a Polgármesteré $0{,}87$, pedig mindkettő fokszáma 4. Miért?`,
          options: [
            "Mert a Kormány szomszédai maguk is sok szálon kötődnek, a Polgármester két szomszédja (Lakók, Önkéntesek) viszont csak egymáshoz és hozzá.",
            "Mert a Kormány súlyozott erőssége nagyobb, mint a Polgármesteré.",
            "Mert a numpy véletlenszerűen választja az előjelet, és ez a sorrendet is eldönti.",
            "Mert a sajátvektor a fokszámot méri, és a kerekítés miatt tér el a két érték."
          ],
          answer: 0,
          hint: "A sajátvektorban egy csúcs értéke a szomszédai értékének összegével arányos. Kik a két szereplő szomszédai?",
          explain: R`$\lambda_1 v_i = \sum_j A_{ij} v_j$: az kap nagy értéket, akinek <b>fontos szomszédai</b> vannak. A Kormány szomszédai ($\mathrm{Vi}$ 0,86, $\mathrm{Po}$ 0,87, $\mathrm{Sz}$ 0,79, $\mathrm{Kl}$ 0,58) erősebbek, mint a Polgármesteréi ($\mathrm{Ko}$ 1, $\mathrm{Vi}$ 0,86, $\mathrm{La}$ 0,42, $\text{Ön}$ 0,42). Az erősség itt nem számít (a sajátvektor a súlyozatlan gráfé), és egyébként is a Polgármesteré a nagyobb (8 vs. 6). Az előjel csak az egész vektort fordítja meg, a sorrendet nem. A domináns sajátvektor pedig nem a fokszám: az egyforma fokszám ellenére eltér.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["sajátvektor", "a mátrixszal szorozva csak a számszorosa lesz"],
            ["sajátérték", "a szorzó, amennyivel a sajátvektor megnyúlik"],
            ["spektrum", "a sajátértékek összessége"],
            ["hatványiteráció", "ismételt szorzás és normálás"],
            ["Perron–Frobenius-tétel", "összefüggő gráfon a domináns sajátvektor pozitív és egyértelmű"],
            [R`iterálás $A + I$-vel`, "páros gráfon is konvergál"]
          ],
          hint: "Az első kettő a definíció két fele. Az utolsó a csillag oszcillálásának javítása.",
          explain: R`$A\mathbf v = \lambda\mathbf v$: a $\mathbf v$ sajátvektor, a $\lambda$ sajátérték. A sajátértékek együtt a gráf spektruma. A hatványiteráció újra és újra $A$-val szoroz, és normál – így a $\lambda_1$-hez tartozó sajátvektorhoz tart. A Perron–Frobenius-tétel garantálja, hogy ez a vektor összefüggő gráfon pozitív és (számszorostól eltekintve) egyértelmű. Páros gráfon $-\lambda_1$ is sajátérték, ezért oszcillál; az $A + I$ sajátértékei 1-gyel nagyobbak, így $\lambda_1 + 1$ már egyértelműen a legnagyobb abszolút értékű.`
        }
      ]
    },
