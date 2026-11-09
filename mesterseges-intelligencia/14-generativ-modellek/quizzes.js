/* =========================================================
   Mesterséges intelligencia 14. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 14.1 */
    "ai14-141": {
      title: "Kvíz – 14.1 Mit jelent generálni?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Melyik modell generatív?",
          options: [
            "a naiv Bayes spamszűrő",
            "a logisztikus regresszió",
            "a döntési fa",
            "a 9–11. fejezet osztályozó hálója"
          ],
          answer: 0,
          hint: R`Melyik tanulja meg, milyenek maguk az adatok – $p(\mathbf x)$ vagy $p(\mathbf x \mid y)$ –, és melyik csak a címkét adja meg?`,
          explain: R`A naiv Bayes a $p(\text{szavak} \mid \text{spam})$ és a $p(\text{spam})$ valószínűségeket tanulja – ebből elvben spamet is írhatna. A logisztikus regresszió, a döntési fa és az osztályozó hálók csak $p(y \mid \mathbf x)$-et adnak: meghúzzák a határt, de nem tudják, melyik adat milyen gyakori.`
        },
        {
          type: "single", shuffle: true,
          q: R`A futó példában mennyi $p(\texttt{0011} \mid \text{vízszintes})$?`,
          options: ["0,4", "0,2", "0,5", "0,6"],
          answer: 0,
          hint: "Csak a vízszintes rajzokat számold: hány van belőlük, és ebből hány alsó csík?",
          explain: R`Vízszintes rajz 5 van (1100 ×3, 0011 ×2), ebből 2 alsó csík: $2/5 = 0{,}4$. A 0,2 az együttes $p(\texttt{0011}, \text{vízszintes}) = 0{,}4 \cdot 0{,}5$, a 0,5 maga $p(\text{vízszintes})$, a 0,6 a felső csík feltételes valószínűsége.`
        },
        {
          type: "single", shuffle: true,
          q: R`A táblázatos modell a $[0;\ 1)$ szakaszt a képek sorrendjében osztja fel: 1100 $[0;\ 0{,}3)$, 0011 $[0{,}3;\ 0{,}5)$, 1010 $[0{,}5;\ 0{,}7)$, 0101 $[0{,}7;\ 0{,}9)$, 1001 $[0{,}9;\ 1)$. Melyik képet rajzolja $u = 0{,}5$-nél?`,
          options: ["1010 (bal csík)", "0011 (alsó csík)", "0101 (jobb csík)", "1100 (felső csík)"],
          answer: 0,
          hint: R`A szakaszok balról zártak, jobbról nyitottak: $[a;\ b)$. Melyikbe tartozik a 0,5?`,
          explain: R`A $0{,}5$ a $[0{,}5;\ 0{,}7)$ bal vége, tehát a 1010-é. Az alsó csík szakasza $[0{,}3;\ 0{,}5)$ – a 0,5-öt már nem tartalmazza. Úgy is mondhatod: az első kép, ahol a halmozott valószínűség már nagyobb $u$-nál ($0{,}3$, $0{,}5$, $0{,}7$ → a harmadik).`
        },
        {
          type: "single", shuffle: true,
          q: R`A független pixelek modelljében $p_1 = 0{,}6$, $p_2 = 0{,}5$, $p_3 = 0{,}4$, $p_4 = 0{,}5$ (a pixel fekete valószínűsége). Mennyi a fordított átló, $p(\texttt{0110})$?`,
          options: ["0,04", "0", "0,06", "0,0625"],
          answer: 0,
          hint: "Pixelenként szorozz: fekete pixelnél p_i, fehérnél 1 − p_i.",
          explain: R`$(1 - 0{,}6) \cdot 0{,}5 \cdot 0{,}4 \cdot (1 - 0{,}5) = 0{,}4 \cdot 0{,}5 \cdot 0{,}4 \cdot 0{,}5 = 0{,}04$. A 0 a táblázatos modell válasza (ott nincs ilyen rajz), a 0,06 a csupa fekete $p(\texttt{1111})$, a 0,0625 az egyenletes modell $1/16$-a.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a táblázatos (empirikus) modell meglepetése az átlón (1001, $p = 0{,}1$)?`,
          options: ["3,32 bit", "1 bit", "2,30 bit", "10 bit"],
          answer: 0,
          hint: "A meglepetés −log p – de melyik alapú logaritmus ad bitet?",
          explain: R`$-\log_2 0{,}1 \approx 3{,}32$ bit. Az 1 a tízes alapú logaritmus ($-\lg 0{,}1$), a 2,30 a természetes ($-\ln 0{,}1$, az nat, nem bit), a 10 pedig $1/p$ – logaritmus nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: "Laplace-simítással (minden kép darabszámához +1) mennyi lesz az átló (1001) valószínűsége?",
          options: ["2/26 ≈ 0,077", "2/11 ≈ 0,182", "1/10 = 0,1", "2/16 = 0,125"],
          answer: 0,
          hint: "A számlálóhoz 1-et adunk – de hány +1 kerül a nevezőbe?",
          explain: R`Az átló 1 + 1 = 2 darabot kap. A nevezőbe mind a 16 kép +1-e bekerül: $10 + 16 = 26$, így $2/26 \approx 0{,}077$. A 2/11 csak egyet ad a nevezőhöz (akkor az összeg nem lenne 1), a 2/16 elfelejti az eredeti 10 rajzot, az 1/10 a simítás nélküli érték.`
        },
        {
          type: "match",
          q: "Párosítsd a modellt a tulajdonságával!",
          pairs: [
            ["táblázat (empirikus eloszlás)", "csak a látott 5 képet rajzolja, új rajzon végtelen a meglepetése"],
            ["független pixelek", "mind a 16 képet rajzolhatja, csupa feketét is"],
            ["egyenletes modell", "minden képen 4 bit a meglepetése"],
            ["Laplace-simított táblázat", "a nem látott képekre is véges meglepetést ad"]
          ],
          hint: "Melyik modell nem tud semmit, melyik csak másol, és melyik szedi szét a képet?",
          explain: R`A táblázat a memorizálás legtisztább formája: pontosan a tanítóadatokat adja vissza, és egy nem látott rajzra $p = 0$. A független pixelek modellje szétszedi a képet: minden $p_i$ 0 és 1 között van, így bármely kép kijöhet. Az egyenletes modell a „semmit sem tudok” alapvonal: $-\log_2(1/16) = 4$ bit. A simítás valószínűséget vesz el a látott képektől, és szétosztja a nem látottak között.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a negatív log-likelihoodra (NLL)?",
          options: [
            "A tíz tanítórajzon a táblázatos modell 2,25 bitjénél egyetlen modell sem érhet el kisebbet.",
            "Egyetlen nem látott rajz a simítás nélküli táblázat NLL-jét végtelenné teszi.",
            "8 × 8-as fekete-fehér képeken az egyenletes modell NLL-je 64 bit.",
            "Kisebb NLL mindig szebb mintákat jelent.",
            "A tanítóadaton mért NLL a legjobb mérce két modell összevetésére."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a memorizálásra: mit jutalmaz a tanítóadaton mért NLL? És mennyi bit jut egy pixelre, ha semmit sem tudsz?",
          explain: R`A 2,25 bit az adatok entrópiája – a tanítóadaton ez a minimum. A $-\log_2 0 = \infty$ miatt egy új rajz végtelen NLL-t ad. Az egyenletes modell pixelenként 1 bit, $64$ bit összesen. Hamis: a kis NLL nem garantál szép mintát (és fordítva, 14.8); a tanítóadaton mért NLL a memorizálást jutalmazza – a valódi mérce a teszt-NLL.`
        }
      ]
    },

    /* ------------------------------------------------ 14.2 */
    "ai14-142": {
      title: "Kvíz – 14.2 Autoregresszív modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Számold ki a láncszabállyal, soronkénti sorrendben a bal csík valószínűségét a tíz rajzon: $p(\texttt{1010}) = p(x_1 = 1)\,p(x_2 = 0 \mid 1)\,p(x_3 = 1 \mid 10)\,p(x_4 = 0 \mid 101)$.`,
          options: ["0,2", "0,3", "0,12", "0,06"],
          answer: 0,
          hint: "A 10-val kezdődő rajzok: 1010 ×2, 1001 ×1. Ezek közül hányban fekete a bal alsó?",
          explain: R`$0{,}6 \cdot 0{,}5 \cdot \tfrac23 \cdot 1 = 0{,}2$ – pontosan a táblázat értéke, mert a láncszabály közelítés nélkül igaz. A 0,3 a $\tfrac23$-os tényezőt felejti ki, a 0,12 a Markov-modell értéke, a 0,06 a független pixeleké ($0{,}6 \cdot 0{,}5 \cdot 0{,}4 \cdot 0{,}5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A Markov-modell paraméterei: $p(x_1 = 1) = 0{,}6$; $p(x_2 = 1 \mid x_1) = 0{,}5$; $p(x_3 = 1 \mid x_2 = 1) = 0$, $p(x_3 = 1 \mid x_2 = 0) = 0{,}8$; $p(x_4 = 1 \mid x_3) = 0{,}5$. Mennyi $p(\texttt{0010})$?`,
          options: ["0,08", "0", "0,16", "0,04"],
          answer: 0,
          hint: "Minden pixelnél csak az előző pixel számít. Ne hagyd ki az utolsó tényezőt!",
          explain: R`$p(x_1 = 0) = 0{,}4$, $p(x_2 = 0 \mid 0) = 0{,}5$, $p(x_3 = 1 \mid x_2 = 0) = 0{,}8$, $p(x_4 = 0 \mid x_3 = 1) = 0{,}5$: $0{,}4 \cdot 0{,}5 \cdot 0{,}8 \cdot 0{,}5 = 0{,}08$. A 0 a táblázatos modell (a 0010-t senki sem rajzolta) – a Markov-modell viszont a látott darabokból újat rak össze. A 0,16 az utolsó tényezőt hagyja ki, a 0,04 a független pixelek modellje.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány paramétere van egy logisztikus autoregresszív modellnek 3 × 3-as fekete-fehér képre (az i-edik pixel az összes előzőből jósol, torzítással)?",
          options: ["45", "36", "81", "511"],
          answer: 0,
          hint: "Az i-edik pixelnek i − 1 súlya és egy torzítása van. Add össze i = 1-től 9-ig.",
          explain: R`$\sum_{i=1}^{9} i = 45$, általában $D(D+1)/2$. A 36 a torzításokat hagyja ki ($\sum (i-1)$), a 81 mintha minden pixel mind a 9-et látná (a későbbieket is – az tilos), az 511 a teljes feltételes táblázat ($2^9 - 1$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pixel logitja $z = 2$. Mennyi a fekete valószínűsége $T = 2$ hőmérsékleten?`,
          options: ["0,73", "0,98", "0,88", "0,62"],
          answer: 0,
          hint: R`A logitot osztjuk a hőmérséklettel, aztán szigmoid: $\sigma(z/T)$.`,
          explain: R`$\sigma(2/2) = \sigma(1) \approx 0{,}73$. A 0,98 $\sigma(4)$ – szoroz osztás helyett; a 0,88 $\sigma(2)$ – a hőmérsékletet figyelmen kívül hagyja; a 0,62 $\sigma(0{,}5)$ – kétszer oszt. A magas $T$ kiegyenlítettebb, bizonytalanabb választ ad (0,88 helyett 0,73).`
        },
        {
          type: "single", shuffle: true,
          q: "Kiegészítés: a felső sor 10. A teljes láncszabályos modell (a tíz rajzból) mekkora valószínűséggel egészíti ki átlóvá (1001)?",
          options: ["1/3", "2/3", "0,1", "1/2"],
          answer: 0,
          hint: "Csak azokat a rajzokat nézd, amelyek 10-val kezdődnek.",
          explain: R`A 10-val kezdődő rajzok: 1010 ×2, 1001 ×1 – a folytatás 1/3 eséllyel 01 (átló), 2/3 eséllyel 10 (bal csík). A 2/3 a bal csík esélye, a 0,1 az átló feltétel nélküli valószínűsége (a felső sort figyelmen kívül hagyja), az 1/2 a két lehetőséget egyformának veszi.`
        },
        {
          type: "single", shuffle: true,
          q: "A 8 × 8-as számjegyek tesztképein a logisztikus autoregresszív modell NLL-je 25,9 bit képenként. Hány bit jut átlagosan egy pixelre?",
          options: ["kb. 0,40 bit", "kb. 0,57 bit", "1 bit", "kb. 2,47 bit"],
          answer: 0,
          hint: "Egy képen 64 pixel van.",
          explain: R`$25{,}9 / 64 \approx 0{,}40$ bit/pixel. A 0,57 a független pixelek modellje ($36{,}3/64$), az 1 bit az egyenletes modell, a 2,47 fordítva oszt ($64/25{,}9$). Jóval 1 alatt van, mert a háttér nagy része fehér, és a vonalak összefüggők – a jó modellel a kép kb. 40%-ára tömöríthető.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az autoregresszív modellekre?",
          options: [
            "Egy D pixeles képhez D egymás utáni mintavételi lépés kell.",
            "A GPT-család autoregresszív generatív modell: maszkolt figyelmű Transformer, amely a következő token eloszlását adja.",
            "Ha egy korai húzás rossz, a modell onnantól ehhez igazodik, és nem tudja kiradírozni.",
            "A láncszabály csak a Markov-feltevéssel együtt igaz.",
            "Magasabb hőmérséklet jobb minőségű, kreatívabb mintákat ad."
          ],
          answer: [0, 1, 2],
          hint: "Melyik közelítés, és melyik pontos azonosság? És mit növel valójában a hőmérséklet?",
          explain: R`Igaz: a mintavétel lépésről lépésre halad (ezért „gépel” a nyelvi modell); a GPT ilyen modell; a hiba továbbgyűrűzik. Hamis: a láncszabály közelítés nélkül igaz bármely sorrendben – a Markov-feltevés egy külön egyszerűsítés, amely a paraméterek számát csökkenti. A magas $T$ csak a véletlent növeli, nem a minőséget.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem lehet egy nyelvi modell válaszának 500 tokenjét egyszerre, párhuzamosan kihúzni?",
          options: [
            "Mert az i-edik token eloszlása az előző i − 1 kihúzott tokentől függ, és amíg azok nincsenek meg, nincs mire feltételezni.",
            "Mert a Transformer nem tud párhuzamosan számolni – tanításkor sem.",
            "Mert a hőmérséklet miatt minden tokent többször kell kihúzni.",
            "Mert a láncszabály csak rövid szövegekre igaz."
          ],
          answer: 0,
          hint: R`Nézd meg, mire feltételezünk a $p(x_i \mid \mathbf x_{\lt i})$ tényezőben.`,
          explain: "Mintavételkor minden token a már kihúzott előzményekre épül, ezért sorban kell haladni (500 · 20 ms = 10 s). Tanításkor viszont párhuzamos a számolás, mert ott a teljes szöveg ismert (12.7). A láncszabály tetszőleges hosszra igaz, a hőmérséklet pedig csak átskálázza a logitokat."
        }
      ]
    },

    /* ------------------------------------------------ 14.3 */
    "ai14-143": {
      title: "Kvíz – 14.3 Autoenkóderek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A lineáris autoenkóder kódja: $z_1 = \tfrac12(x_1 + x_2 - x_3 - x_4)$ (fent mínusz lent), $z_2 = \tfrac12(x_1 - x_2 + x_3 - x_4)$ (bal mínusz jobb). Mi a 0111 kódja?`,
          options: [R`$(-0{,}5;\ -0{,}5)$`, R`$(0{,}5;\ 0{,}5)$`, R`$(-1;\ -1)$`, R`$(0;\ 0)$`],
          answer: 0,
          hint: "Helyettesíts be: x₁ = 0, x₂ = x₃ = x₄ = 1. Ne felejtsd el az ½-es szorzót!",
          explain: R`$z_1 = \tfrac12(0 + 1 - 1 - 1) = -0{,}5$, $z_2 = \tfrac12(0 - 1 + 1 - 1) = -0{,}5$. A $(0{,}5;\ 0{,}5)$ előjelhibás (az az 1000 kódja), a $(-1;\ -1)$ elhagyja az ½-et, a $(0;\ 0)$ az átló és a csupa fekete kódja.`
        },
        {
          type: "single", shuffle: true,
          q: "A kétszámos lineáris autoenkóder a fordított átlót (0110) kódolja és visszarajzolja. Mekkora a rekonstrukciós hiba (négyzetösszeg)?",
          options: ["1", "0,5", "2", "0,25"],
          answer: 0,
          hint: "Számold ki először a kódot – mit rajzol a dekódoló a (0; 0) kódból?",
          explain: R`A kód $(0;\ 0)$, a kép csupa $0{,}5$. A hiba $4 \cdot 0{,}5^2 = 1$ – ugyanannyi, mint az átlónál. A 2 az abszolút eltérések összege (nem négyzetes), a 0,5 az 1000 hibája, a 0,25 egyetlen pixel hibája. A két szám a csíkok nyelvét tanulta meg – az átlókra nincs szava.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy zajos bal csík: $(0{,}9;\ 0{,}1;\ 1{,}2;\ -0{,}2)$. Mit rajzol belőle a kétszámos lineáris autoenkóder? (Dekódoló: $\hat{\mathbf x} = 0{,}5 + z_1 \cdot (0{,}5;\ 0{,}5;\ -0{,}5;\ -0{,}5) + z_2 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5)$.)`,
          options: [
            R`$(1{,}05;\ -0{,}05;\ 1{,}05;\ -0{,}05)$`,
            R`$(1;\ 0;\ 1;\ 0)$`,
            R`$(0{,}9;\ 0{,}1;\ 1{,}2;\ -0{,}2)$`,
            R`$(-0{,}05;\ 1{,}05;\ -0{,}05;\ 1{,}05)$`
          ],
          answer: 0,
          hint: "Kódold (z₁, z₂), aztán dekódold. A zajnak az a része, amely a két kódirányba esik, átmegy.",
          explain: R`$z_1 = \tfrac12(0{,}9 + 0{,}1 - 1{,}2 + 0{,}2) = 0$, $z_2 = \tfrac12(0{,}9 - 0{,}1 + 1{,}2 + 0{,}2) = 1{,}1$. A kép $0{,}5 + 1{,}1 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5) = (1{,}05;\ -0{,}05;\ 1{,}05;\ -0{,}05)$. Nem tökéletes $(1;\ 0;\ 1;\ 0)$: a zaj kódiránnyal párhuzamos része átment. A hiba négyzetösszege mégis $0{,}10$-ről $0{,}01$-re csökkent. Az utolsó opció $z_2$ előjelét rontja el.`
        },
        {
          type: "single", shuffle: true,
          q: "A 8 × 8-as számjegyeken (pixelenkénti átlagos négyzetes hiba a tesztképeken) a 8 számos mély autoenkóder hibája 0,006. A PCA hibái: k = 4: 0,038; 8: 0,025; 16: 0,012; 32: 0,003. Hány számos PCA-kód kell legalább ilyen jó eredményhez?",
          options: ["32", "16", "8", "4"],
          answer: 0,
          hint: "Keresd meg az első PCA-értéket, amely nem nagyobb 0,006-nál.",
          explain: R`A PCA 16-tal még 0,012 (kétszer rosszabb), 32-vel 0,003 – csak az jobb. Tehát 32. A 8 az „ugyanakkora kód, ugyanakkora hiba” tévedés; a mély háló kis kódnál sokkal jobb, mert nem síkra, hanem görbült felületre vetít. Nagy kódnál ($k = 32$) már mindkettő szinte tökéletes.`
        },
        {
          type: "single", shuffle: true,
          q: R`Interpolálj a bal csík $(0;\ 1)$ és a jobb csík $(0;\ -1)$ kódja között $t = 0{,}25$-nél, $\mathbf z(t) = (1 - t)\,\mathbf z_A + t\,\mathbf z_B$! Mit rajzol a lineáris dekódoló?`,
          options: [
            R`$(0{,}75;\ 0{,}25;\ 0{,}75;\ 0{,}25)$`,
            R`$(0{,}25;\ 0{,}75;\ 0{,}25;\ 0{,}75)$`,
            R`$(0{,}5;\ 0{,}5;\ 0{,}5;\ 0{,}5)$`,
            R`$(1;\ 0;\ 1;\ 0)$`
          ],
          answer: 0,
          hint: "t = 0-nál még az A kép, t = 1-nél a B. Melyikhez van közelebb a 0,25?",
          explain: R`$\mathbf z = 0{,}75 \cdot (0;\ 1) + 0{,}25 \cdot (0;\ -1) = (0;\ 0{,}5)$, a kép $0{,}5 + 0{,}5 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5) = (0{,}75;\ 0{,}25;\ 0{,}75;\ 0{,}25)$ – halványuló bal csík. A második opció a $t$ szerepét fordítja meg ($t = 0{,}75$), a csupa 0,5 a $t = 0{,}5$ felezőpont, az utolsó maga a bal csík ($t = 0$).`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem generatív modell a sima autoenkóder, bár a dekódolója bármilyen kódból rajzol valamit?",
          options: [
            "Mert nem ad eloszlást a kódokra: nem tudjuk, honnan sorsoljunk, és a kódfelhő lyukaiból értelmetlen kép jön.",
            "Mert a dekódoló csak a tanítóképek kódjaiból tud rajzolni, más kódból hibát ad.",
            "Mert a tanításához címkék kellenek.",
            "Mert csak lineáris lehet, ezért a PCA-nál többet nem tud."
          ],
          answer: 0,
          hint: "Mi kell egy generatív modellhez a mintavételhez – és ezt megadja-e az autoenkóder?",
          explain: "A kódfelhő alakja, helye, mérete a tanítás mellékterméke: a 8 számos autoenkóder N(0, I)-ből sorsolt kódjainak csak 27%-a ad biztosan felismert számjegyet (a valódi képeknél 93%). A dekódoló bármely kódból rajzol – csak gyakran nem képet. A tanításhoz címke nem kell (a cél maga a bemenet), és a mély autoenkóder nemlineáris. A megoldás a VAE: ismert eloszlásra kényszeríti a kódokat."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "Egy négyzetes hibával tanított lineáris autoenkóder ugyanazt a teret találja meg, mint a PCA.",
            "Ha a kód mérete eléri a bemenetét (k ≥ D), a háló megtanulhatja egyszerűen továbbadni a pixeleket.",
            "A zajszűrő autoenkóder keresztmetszetének nem kell szűknek lennie: a feladat maga kényszeríti a tanulásra.",
            "A négyzetes hibával tanított dekódoló bizonytalan helyen éles, de véletlenszerű éleket rajzol.",
            "Egy mély autoenkóder kódkoordinátái általában egy-egy jól értelmezhető tulajdonságot jelentenek."
          ],
          answer: [0, 1, 2],
          hint: "Gondold végig: mi kényszeríti a hálót arra, hogy ne csak másoljon? És mit csinál a négyzetes hiba, ha bizonytalan?",
          explain: R`Igaz: lineáris AE + négyzetes hiba = PCA (az első $k$ főkomponens tere); tág keresztmetszetnél másolás jön (Glassner tigrise); a zajszűrőnél a bemenet maga rossz, így a másolás nem megoldás. Hamis: bizonytalan helyen a négyzetes hiba „középre” rajzol – szürke, elmosódott széleket, nem éleseket. A mély hálók kódjának koordinátái általában nem értelmezhetők egyenként, csak együtt hordozzák a képet.`
        },
        {
          type: "single", shuffle: true,
          q: "Hányszoros a tömörítés, ha egy 64 × 64-es szürkeárnyalatos képből 32 számos kódot készít az autoenkóder?",
          options: ["128-szoros", "2-szeres", "384-szeres", "4096-szoros"],
          answer: 0,
          hint: "Hány szám a kép, és hány a kód?",
          explain: R`$64 \cdot 64 = 4096$ pixel, $4096 / 32 = 128$-szoros. A 2 csak az oldalhosszt osztja ($64/32$), a 384 három színcsatornával számol (de a kép szürkeárnyalatos), a 4096 a pixelek száma.`
        }
      ]
    },

    /* ------------------------------------------------ 14.4 */
    "ai14-144": {
      title: "Kvíz – 14.4 Variációs autoenkóder",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A VAE kódolója $\mu = 0{,}5$-öt és $\sigma = 0{,}2$-t ad, a húzott zaj $\varepsilon = -1{,}5$. Mennyi a kód a reparaméterezéssel?`,
          options: ["0,2", "−0,8", "0,44", "0,8"],
          answer: 0,
          hint: R`$z = \mu + \sigma\varepsilon$ – a zajt a szórással szorozzuk.`,
          explain: R`$z = 0{,}5 + 0{,}2 \cdot (-1{,}5) = 0{,}5 - 0{,}3 = 0{,}2$. A $-0{,}8$ összeadja a hármat ($\mu + \sigma + \varepsilon$), a 0,44 a varianciával szoroz ($\sigma^2 = 0{,}04$), a 0,8 elhagyja $\varepsilon$ előjelét.`
        },
        {
          type: "single", shuffle: true,
          q: R`A háló $\ln \sigma^2 = -4$-et ad ki. Mennyi $\sigma$?`,
          options: ["≈ 0,135", "≈ 0,018", "−2", "≈ 7,39"],
          answer: 0,
          hint: R`$\sigma = e^{(\ln \sigma^2)/2}$.`,
          explain: R`$\sigma^2 = e^{-4} \approx 0{,}018$, $\sigma = e^{-2} \approx 0{,}135$. A 0,018 a variancia, nem a szórás; a $-2$ a $\ln \sigma$ (szórás nem lehet negatív – ezért adja ki a háló a logaritmust); a 7,39 $e^{2}$, előjelhibával.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora a KL-tag $\tfrac12(\mu^2 + \sigma^2 - 1 - \ln\sigma^2)$, ha $\mu = 0$ és $\sigma = 0{,}5$?`,
          options: ["≈ 0,32", "≈ 0,64", "≈ −0,03", "≈ −0,38"],
          answer: 0,
          hint: R`$\ln 0{,}25 \approx -1{,}386$. A KL sosem negatív.`,
          explain: R`$\tfrac12(0 + 0{,}25 - 1 + 1{,}386) \approx 0{,}32$. A 0,64 az ½-et felejti el; a $-0{,}03$ $\ln\sigma^2$ helyett $\ln\sigma$-val számol; a $-0{,}38$ a logaritmusos tagot hagyja ki. A két utóbbi negatív – a KL-divergencia viszont sosem az. A felhő a 0-n van, mégis büntet: túl keskeny.`
        },
        {
          type: "match",
          q: R`Párosítsd a kódoló felhőjét ($\mu$, $\sigma$) a KL-tag értékével!`,
          pairs: [
            [R`$\mu = 0,\ \sigma = 1$`, "0"],
            [R`$\mu = 2,\ \sigma = 1$`, "2"],
            [R`$\mu = 0,\ \sigma = 0{,}1$`, "kb. 1,81"],
            [R`$\mu = 0,\ \sigma = 2$`, "kb. 0,81"]
          ],
          hint: R`$\sigma = 1$-nél a szórásos tagok kiesnek: marad $\mu^2/2$.`,
          explain: R`$\mathcal N(0, 1)$ maga a prior: KL $= 0$. $\mu = 2$, $\sigma = 1$: $\tfrac12 \cdot 4 = 2$ – csak a középpont van messze. $\sigma = 0{,}1$: $\tfrac12(0{,}01 - 1 + 4{,}605) \approx 1{,}81$ – túl keskeny. $\sigma = 2$: $\tfrac12(4 - 1 - 1{,}386) \approx 0{,}81$ – a túl széles felhőt is bünteti.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány számot ad ki a VAE kódolója képenként, ha a kód 16 dimenziós (és a kovariancia átlós)?",
          options: ["32", "16", "48", "272"],
          answer: 0,
          hint: "Minden kódkoordinátához mi tartozik?",
          explain: R`Koordinátánként egy középpont és egy (log-)variancia: $16 + 16 = 32$. A 16 csak a középpontokat számolja (az a sima autoenkóder), a 48 egy harmadik számot is feltételez, a 272 egy teljes $16 \times 16$-os kovarianciamátrixszal számol – de a VAE kódolója átlós ($\operatorname{diag}\boldsymbol\sigma^2$).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a VAE-re?",
          options: [
            R`Új kép generálásakor nincs kódoló: $\mathbf z \sim \mathcal N(0, I)$, aztán dekódoló.`,
            R`A KL-tag a kódoló felhőit veti össze a priorral, $\mathcal N(0, I)$-vel.`,
            "A VAE vesztesége a negatív log-likelihood egy felső korlátja (az ELBO ellentettje).",
            "A reparaméterezésnél a zajt a dekódoló kimenetéhez adjuk.",
            "A KL-tag a kódoló és a dekódoló hasonlóságát méri."
          ],
          answer: [0, 1, 2],
          hint: "Hol van a zaj: a kódban vagy a képen? És mivel veti össze a KL a kódoló kimenetét?",
          explain: R`Igaz: generáláskor csak a dekódoló kell; a KL a $q(\mathbf z \mid \mathbf x)$ felhőket húzza a prior felé; a veszteség az ELBO ellentettje, tehát az NLL felső korlátja (ezért nem vethető össze közvetlenül az autoregresszív modell pontos számával). Hamis: a zaj a kódhoz kerül ($\mathbf z = \boldsymbol\mu + \boldsymbol\sigma \odot \boldsymbol\varepsilon$), nem a kimenethez; és a KL nem a kódoló és a dekódoló hasonlóságát méri – ez egy népszerű tankönyv hibája.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kódhoz 60% eséllyel a felső csík (1100), 40% eséllyel a jobb csík (0101) tartozik. Mit rajzol egy négyzetes hibán tanult dekódoló?",
          options: [
            R`$(0{,}6;\ 1;\ 0;\ 0{,}4)$`,
            R`$(1;\ 1;\ 0;\ 0)$`,
            R`$(0{,}4;\ 1;\ 0;\ 0{,}6)$`,
            R`$(0{,}5;\ 1;\ 0;\ 0{,}5)$`
          ],
          answer: 0,
          hint: "A négyzetes hibát a valószínűségekkel súlyozott átlag minimalizálja.",
          explain: R`$0{,}6 \cdot (1;\ 1;\ 0;\ 0) + 0{,}4 \cdot (0;\ 1;\ 0;\ 1) = (0{,}6;\ 1;\ 0;\ 0{,}4)$ – egyik rajzra sem hasonlít: ez a VAE homálya. Az $(1;\ 1;\ 0;\ 0)$ a legvalószínűbb kép (azt egy éles, „merész” modell rajzolná), a $(0{,}4;\ 1;\ 0;\ 0{,}6)$ felcseréli a súlyokat, a $(0{,}5;\ 1;\ 0;\ 0{,}5)$ súlyozatlan átlag.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $\mathcal N(0, I)$-ből sorsolt 8 számos kódok dekódolt képeinek az autoenkódernél 27%-a, a VAE-nél 76%-a biztosan felismert számjegy. Mi okozza a különbséget, ha a dekódolók felépítése majdnem ugyanaz?`,
          options: [
            "A tanítás: a KL-tag a kódokat N(0, I)-re húzta, a kódzaj pedig kitöltötte a teret, így a sorsolás oda lő, ahol a dekódoló tanult.",
            "A VAE dekódolója nagyobb, ezért élesebb képeket rajzol.",
            "A VAE generáláskor egy valódi kép kódjából indul ki.",
            "A VAE-t címkékkel tanították, az autoenkódert nem."
          ],
          answer: 0,
          hint: "Hol vannak a sima autoenkóder kódjai a standard normálishoz képest?",
          explain: R`Az autoenkóder kódfelhője valahol van (koordinátánként 2–3-as szórással, nem a 0 körül), és lyukas. A VAE KL-tagja a felhőket $\mathcal N(0, I)$ köré húzta, a kódzaj a lyukakat kitöltötte. A VAE képei nem élesebbek, hanem elmosódottak; generáláskor nincs kódolás; címke egyiknél sem kell.`
        }
      ]
    },

    /* ------------------------------------------------ 14.5 */
    "ai14-145": {
      title: "Kvíz – 14.5 Generatív versengő hálók",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy képre $p_{\text{adat}}(\mathbf x) = 0{,}1$ és $p_G(\mathbf x) = 0{,}4$. Mennyi az optimális detektív ítélete, $D^*(\mathbf x)$?`,
          options: ["0,2", "0,25", "0,8", "0,5"],
          answer: 0,
          hint: R`$D^* = p_{\text{adat}} / (p_{\text{adat}} + p_G)$.`,
          explain: R`$0{,}1 / (0{,}1 + 0{,}4) = 0{,}2$ – a kép inkább hamis. A 0,25 a két sűrűség hányadosa ($0{,}1/0{,}4$, nem a Bayes-tétel), a 0,8 a „hamis” esélye (fordított szerep), a 0,5 az egyensúlyi érték, amely csak $p_G = p_{\text{adat}}$ esetén áll.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kép $D^*$-a 0,75. Mit tudunk a két eloszlásról ezen a képen?`,
          options: [
            "A valódiak között háromszor gyakoribb, mint a hamisítványok között.",
            "A hamisítványok között háromszor gyakoribb, mint a valódiak között.",
            "A valódiak között 1,33-szor gyakoribb.",
            "A két eloszlás itt egyforma."
          ],
          answer: 0,
          hint: R`Írd fel: $p_{\text{adat}} / (p_{\text{adat}} + p_G) = 0{,}75$, és fejezd ki $p_G$-t.`,
          explain: R`$p_{\text{adat}} = 0{,}75\,(p_{\text{adat}} + p_G)$ → $0{,}25\,p_{\text{adat}} = 0{,}75\,p_G$ → $p_{\text{adat}} = 3\,p_G$. A második opció a szerepeket cseréli (az a $D^* = 0{,}25$ eset), az 1,33 az $1/0{,}75$, az egyforma eloszláshoz $D^* = 0{,}5$ tartozna.`
        },
        {
          type: "single", shuffle: true,
          q: R`A detektív egy valódi képre $D = 0{,}9$-et, egy hamisra $D = 0{,}4$-et mond. Mennyi a vesztesége, $\mathcal L_D = -\ln D(\mathbf x) - \ln\big(1 - D(G(\mathbf z))\big)$?`,
          options: ["≈ 0,62", "≈ 1,02", "≈ 0,89", "≈ 0,11"],
          answer: 0,
          hint: "A hamis kép címkéje 0: ott az 1 − D kerül a logaritmusba.",
          explain: R`$-\ln 0{,}9 - \ln 0{,}6 \approx 0{,}105 + 0{,}511 = 0{,}62$. Az 1,02 a hamisnál $\ln 0{,}4$-et vesz ($1 - D$ helyett $D$), a 0,89 kettes alapú logaritmussal számol, a 0,11 a hamis kép tagját elfelejti.`
        },
        {
          type: "single", shuffle: true,
          q: R`$D(G(\mathbf z)) = 0{,}2$. Mennyi a hamisító nem telítődő vesztesége, $\mathcal L_G = -\ln D(G(\mathbf z))$?`,
          options: ["≈ 1,61", "≈ −0,22", "≈ 0,22", "≈ 2,32"],
          answer: 0,
          hint: "A nem telítődő változat a hamisítványt „valódi” címkével adja a detektívnek.",
          explain: R`$-\ln 0{,}2 \approx 1{,}61$. A $-0{,}22$ a minimax-változat, $\ln(1 - 0{,}2) = \ln 0{,}8$; a 0,22 a $-\ln 0{,}8$ (ellentett esemény); a 2,32 kettes alapú logaritmus.`
        },
        {
          type: "single", shuffle: true,
          q: R`A tanítás elején $D(G(\mathbf z)) = 0{,}05$. A $D$ logitja szerinti gradiens nagysága minimaxnál $D$, a nem telítődő veszteségnél $1 - D$. Hányszor nagyobb a nem telítődő gradiens?`,
          options: ["19-szer", "20-szor", "0,95-ször", "ugyanakkora"],
          answer: 0,
          hint: "Oszd el a két gradiensnagyságot egymással.",
          explain: R`$0{,}95 / 0{,}05 = 19$. A 20 az $1/0{,}05$ – az $1 - D$ helyett 1-gyel számol; a 0,95 csak a nem telítődő gradiens maga. Épp az elején, amikor a hamisító rossz, a minimax-veszteség szinte vízszintes – a $-\ln D$ ott meredek.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hamisító fele-fele arányban rajzol felső csíkot (1100) és alsó csíkot (0011), mást nem. A gyerekeknél $p_{\text{adat}}(\texttt{0011}) = 0{,}2$. Mennyi $D^*(\texttt{0011})$?`,
          options: ["≈ 0,29", "0,4", "≈ 0,71", "0,5"],
          answer: 0,
          hint: R`Itt $p_G(\texttt{0011}) = 0{,}5$.`,
          explain: R`$0{,}2 / (0{,}2 + 0{,}5) \approx 0{,}29$: az alsó csík gyanús, mert a hamisító túl gyakran rajzolja. A 0,4 a $p_{\text{adat}} / p_G$ hányados, a 0,71 a „hamis” esélye, a 0,5 az egyensúlyi érték. (A három másik rajzon $D^* = 1$ – azokat a hamisító sosem rajzolja.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyensúlyban mindenhol $D = 0{,}5$. Mennyi ekkor a detektív vesztesége (egy valódi és egy hamis képen, természetes logaritmussal)?`,
          options: ["≈ 1,39", "≈ 0,69", "0", "2"],
          answer: 0,
          hint: "Két tag van, mindkettő −ln 0,5.",
          explain: R`$-\ln 0{,}5 - \ln 0{,}5 = 2\ln 2 \approx 1{,}39$. A 0,69 csak egy tag, a 2 kettes alapú logaritmussal számol, a 0 a tökéletes detektív – ez a GAN-nál baj: a hamisító reménytelenül le van maradva. A GAN-veszteség nem megy 0-ra.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a GAN-ra?",
          options: [
            "A generátor sosem látja a valódi képeket – csak a detektív ítéletén keresztül tanul.",
            R`A GAN nem ad $p(\mathbf x)$-et, ezért NLL-t sem lehet rá számolni.`,
            "A hamisítólépésben a gradiens átfolyik a detektíven, de a detektív súlyai nem változnak.",
            "A módusösszeomlás ugyanaz, mint a túlillesztés: a generátor a tanítóképeket jegyzi meg.",
            "Ha a detektív vesztesége 0-ra csökken, a generátor kiváló."
          ],
          answer: [0, 1, 2],
          hint: "Ki lát valódi képet, és mi frissül melyik lépésben? És mit jelent, ha az egyik játékos teljesen nyer?",
          explain: "Igaz: a hamisító csak a detektív gradiensén át tanul; a GAN csak mintát ad, valószínűséget nem; a hamisítólépésben a detektív befagy. Hamis: a módusösszeomlás a sokféleség hiánya (néhány, nem feltétlenül tanítókép ismételgetése), a túlillesztés a memorizálás. A 0 detektívveszteség azt jelenti, hogy a detektív tökéletesen nyer – a hamisító le van maradva."
        }
      ]
    },

    /* ------------------------------------------------ 14.6 */
    "ai14-146": {
      title: "Kvíz – 14.6 Diffúziós modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A zajerősségek $\beta = (0{,}1;\ 0{,}2;\ 0{,}3)$. Mennyi $\bar\alpha_3$, vagyis a jel varianciájából mennyi marad három lépés után?`,
          options: ["0,504", "0,4", "0,72", "0,006"],
          answer: 0,
          hint: R`$\bar\alpha_t$ szorzat – de minek a szorzata? Lépésenként a jel varianciájából mennyi marad meg?`,
          explain: R`$\bar\alpha_3 = (1 - 0{,}1)(1 - 0{,}2)(1 - 0{,}3) = 0{,}9 \cdot 0{,}8 \cdot 0{,}7 = 0{,}504$. A 0,4 az $1 - \sum\beta$ – a megmaradó részek nem kivonódnak, hanem összeszorzódnak. A 0,72 a $\bar\alpha_2$ (egy lépés kimaradt), a 0,006 pedig a $\beta$-k szorzata, vagyis a zaj részeit szorozza a jel részei helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\bar\alpha_t = 0{,}64$, a tiszta pixel $x_0 = 1$, a zaj $\varepsilon = -0{,}5$. Mennyi $x_t$ a zárt alak szerint?`,
          options: ["0,5", "0,46", "0,62", "0,2"],
          answer: 0,
          hint: R`$x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1 - \bar\alpha_t}\,\varepsilon$ – mindkét együtthatóban gyök van.`,
          explain: R`$\sqrt{0{,}64} \cdot 1 + \sqrt{0{,}36} \cdot (-0{,}5) = 0{,}8 - 0{,}3 = 0{,}5$. A 0,46 mindkét gyököt elfelejti ($0{,}64 - 0{,}36 \cdot 0{,}5$), a 0,62 csak a zaj együtthatójáét. A 0,2 felcseréli a két együtthatót ($0{,}6 \cdot 1 + 0{,}8 \cdot (-0{,}5)$) – pedig $\bar\alpha_t$ a <em>jel</em> részaránya.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\bar\alpha_t = 0{,}36$, a zajos pixel $x_t = 0{,}2$, a háló zajtippje $\hat\varepsilon = -0{,}5$. Mennyi a tiszta pixelre vonatkozó tipp, $\hat x_0$?`,
          options: ["1,00", "−0,33", "0,60", "1,67"],
          answer: 0,
          hint: R`Fordítsd meg a zárt alakot: vond ki a zaj részét, aztán oszd el a jel együtthatójával.`,
          explain: R`$\hat x_0 = (x_t - \sqrt{1 - \bar\alpha_t}\,\hat\varepsilon)/\sqrt{\bar\alpha_t} = (0{,}2 + 0{,}8 \cdot 0{,}5)/0{,}6 = 0{,}6/0{,}6 = 1$. A $-0{,}33$ előjelhiba (hozzáadja a zajt kivonás helyett), a 0,60 elfelejti az osztást, az 1,67 pedig $\bar\alpha_t$-vel oszt $\sqrt{\bar\alpha_t}$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit kell megjósolnia a hálónak egy DDPM-tanítási lépésben?",
          options: [
            R`A teljes zajt ($\boldsymbol\varepsilon$), amely $\mathbf x_0$-ból $\mathbf x_t$-t csinálta – a zajos képből és $t$-ből.`,
            R`Csak az utolsó lépésben hozzáadott zajt, vagyis $\mathbf x_{t-1}$ és $\mathbf x_t$ különbségét.`,
            R`A tiszta képet, $t$ ismerete nélkül – a zajszintet a háló magától kitalálja.`,
            R`Azt, hogy a kép valódi vagy generált – mint a GAN detektívje.`
          ],
          answer: 0,
          hint: R`Nézd meg a veszteséget: $\lVert \boldsymbol\varepsilon - \hat{\boldsymbol\varepsilon} \rVert^2$. Melyik $\boldsymbol\varepsilon$ ez, és mit kap a háló bemenetként?`,
          explain: R`A háló $\hat{\boldsymbol\varepsilon} = \varepsilon_\theta(\mathbf x_t, t)$-t ad, és a célpont az az egyetlen $\boldsymbol\varepsilon$, amellyel a zárt alakból $\mathbf x_t$ készült – nem egy lépésnyi zaj. Ebből bármelyik korábbi lépésre vissza lehet számolni. A $t$ is bemenet: ha a háló nem tudná, mekkora a zaj, nem tudná, mennyit vegyen le. Versengés nincs benne – ez közönséges regresszió.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a diffúziós modellre?",
          options: [
            R`A zárt alak miatt bármely $t$-re egy lépésben előállítható $\mathbf x_t$, nem kell a zajosítást lépésenként végigjátszani.`,
            "Az előre irányú (zajosító) folyamatot is a háló tanulja meg.",
            "Erős zajnál a háló tisztakép-tippje éles, gyenge zajnál homályos.",
            R`Véges tanítóhalmazon az ideális zajtalanító $\hat{\mathbf x}_0$-ja a tanítóképek súlyozott átlaga, és a mintavétel végén egy tanítóképre ugrik.`,
            "Ugyanaz a háló minden zajszinten dolgozik, ezért a zajszintet is bemenetként kapja."
          ],
          answer: [0, 3, 4],
          hint: "Mi az, amiben „nincs semmi tanulnivaló”? És mikor átlagol a tipp sok lehetséges kép között?",
          explain: R`Igaz: a zárt alak (ettől olcsó a tanítás), a tökéletes tanuló „csal” (kis zajnál egy tanítókép súlya lesz 1), és $t$ bemenet. Hamis: a zajosításban nincs tanulnivaló, az csak a tanítóadat előállítása. És fordítva van: erős zajnál a tipp sok kép átlaga, tehát homályos; a mintavétel ezt lépésenként élesíti.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az adat két érték, $-1$ és $+1$, fele-fele eséllyel; az ideális tipp $\hat x_0 = \tanh\big(\sqrt{\bar\alpha}\,x_t/(1 - \bar\alpha)\big)$. Mennyi $\hat x_0$, ha $\bar\alpha = 0{,}36$ és $x_t = -1$?`,
          options: ["−0,73", "−0,94", "−0,51", "−0,64"],
          answer: 0,
          hint: R`Előbb számold ki a zárójelet ($\sqrt{0{,}36} = 0{,}6$), és ne hagyd le a $\tanh$-t.`,
          explain: R`$\tanh(0{,}6 \cdot (-1)/0{,}64) = \tanh(-0{,}9375) \approx -0{,}73$: a $-1$ felé hajlik, de erős zajnál még óvatos. A $-0{,}94$ a $\tanh$ nélküli argumentum, a $-0{,}51$ a gyököt felejti el ($0{,}36$ a $0{,}6$ helyett), a $-0{,}64$ pedig $\sqrt{1 - \bar\alpha}$-val oszt $1 - \bar\alpha$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy DDIM-lépésben a tippek $\hat x_0 = 0{,}5$ és $\hat\varepsilon = 1$, a mostani szint $\bar\alpha_t = 0{,}36$, a következő $\bar\alpha_{t-1} = 0{,}81$. Mennyi $x_{t-1}$?`,
          options: ["0,89", "1,10", "0,60", "0,45"],
          answer: 0,
          hint: R`„Tippeld meg a tiszta képet, aztán zajosítsd vissza egy kicsit kevésbé” – melyik $\bar\alpha$-val zajosítasz vissza?`,
          explain: R`$x_{t-1} = \sqrt{0{,}81} \cdot 0{,}5 + \sqrt{0{,}19} \cdot 1 \approx 0{,}45 + 0{,}436 = 0{,}89$. Az 1,10 a régi szinttel ($\bar\alpha_t = 0{,}36$) zajosít vissza – akkor nem haladnánk. A 0,60 elfelejti a gyököket, a 0,45 a zajtagot hagyja el (ez csak az utolsó lépésben helyes, ahol $\bar\alpha_{t-1} = 1$).`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["DDPM-mintavétel", "a zaj egy részét minden lépésben friss véletlen zajra cseréli"],
            ["DDIM-mintavétel", "determinisztikus: ugyanabból a kezdőzajból mindig ugyanaz a kép"],
            ["flow matching", "a zajt és az adatot összekötő egyenes pálya sebességét tanulja"],
            ["desztillált modell", "1–4 lépésben rajzol"],
            ["pontszám (score)", "a zajos eloszlás logaritmusának gradiense, a sűrűbb régió felé mutat"]
          ],
          hint: "Melyik eljárás sztochasztikus, melyik determinisztikus? Melyik tanul sebességet, és melyik „iránytű”?",
          explain: R`A DDPM friss zajt kever minden lépésbe, a DDIM ugyanennek a folyamatnak determinisztikus változata (ezért lehet a kezdőzajok között interpolálni). A flow matching $\mathbf x_t = (1 - t)\,\mathbf x_0 + t\,\boldsymbol\varepsilon$ mentén a $\mathbf v = \boldsymbol\varepsilon - \mathbf x_0$ sebességet tanulja. A desztillált modellek 1–4 lépéssel dolgoznak, a pontszám pedig $\nabla_{\mathbf x}\ln p_t(\mathbf x) \approx -\hat{\boldsymbol\varepsilon}/\sqrt{1 - \bar\alpha_t}$.`
        }
      ]
    },

    /* ------------------------------------------------ 14.7 */
    "ai14-147": {
      title: "Kvíz – 14.7 Feltételes generálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 2 × 2-es rajzokon mennyi $p(\texttt{1100} \mid \text{vízszintes})$?`,
          options: ["0,6", "0,3", "0,5", "1"],
          answer: 0,
          hint: "Szűkítsd le a tíz rajzot a vízszintesekre, és csak köztük számolj arányt.",
          explain: R`Vízszintes rajz 5 van (3 felső, 2 alsó csík), ezért $p(\texttt{1100} \mid \text{vízszintes}) = 3/5 = 0{,}6$. A 0,3 az együttes valószínűség, $p(\texttt{1100}, \text{vízszintes})$; a 0,5 a $p(\text{vízszintes})$; az 1 a fordított feltétel, $p(\text{vízszintes} \mid \texttt{1100})$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pixelnél $\hat\varepsilon_u = 0{,}3$ (feltétel nélkül) és $\hat\varepsilon_c = 0{,}5$ (feltétellel). Mennyi az irányított tipp $s = 4$-nél?`,
          options: ["1,1", "2,0", "−0,3", "0,8"],
          answer: 0,
          hint: R`$\tilde\varepsilon = \hat\varepsilon_u + s\,(\hat\varepsilon_c - \hat\varepsilon_u)$: honnan indulsz, és merre lépsz?`,
          explain: R`$0{,}3 + 4 \cdot (0{,}5 - 0{,}3) = 0{,}3 + 0{,}8 = 1{,}1$. A 2,0 egyszerűen $s\,\hat\varepsilon_c$, a $-0{,}3$ felcseréli a két tippet (a feltételestől a feltétel nélküli felé extrapolál), a 0,8 pedig elfelejti a kiindulópontot, $\hat\varepsilon_u$-t.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit kapsz az osztályozómentes irányításban $s = 1$-nél?`,
          options: [
            "A modell saját feltételes eloszlását – irányításról csak s > 1-nél beszélünk.",
            "A feltétel nélküli modellt.",
            "Gyenge irányítást, félúton a feltétel nélküli és a feltételes modell között.",
            "Kétszeres erősségű feltételt."
          ],
          answer: 0,
          hint: R`Írd be $s = 1$-et a képletbe: mi marad $\hat\varepsilon_u + 1 \cdot (\hat\varepsilon_c - \hat\varepsilon_u)$-ból?`,
          explain: R`$s = 1$-nél $\tilde\varepsilon = \hat\varepsilon_c$, vagyis a sima feltételes modell. A feltétel nélküli modell $s = 0$, a „félút” $s = 0{,}5$ lenne. Az $s \gt 1$ megy túl a feltételes tippen („még hetesebb, mint egy átlagos hetes”).`
        },
        {
          type: "single", shuffle: true,
          q: "Az A modell 30 lépéssel, osztályozómentes irányítással rajzol. A B modellbe guidance distillationnel „belesütötték” az irányítást, és szintén 30 lépéssel rajzol. Hány hálóhívás kell egy képhez az A-nak, illetve a B-nek?",
          options: ["60, illetve 30", "30, illetve 30", "60, illetve 60", "120, illetve 60"],
          answer: 0,
          hint: "Hányszor kell lépésenként hívni a hálót, ha a feltételes és a feltétel nélküli tipp is kell? És ha az irányítás már a hálóban van?",
          explain: R`CFG-vel lépésenként két hívás kell ($\hat{\boldsymbol\varepsilon}_c$ és $\hat{\boldsymbol\varepsilon}_u$): $2 \cdot 30 = 60$. A belesütött irányítású modell (pl. FLUX.1 [dev]) lépésenként egyszer hív: 30. A „30, 30” elfelejti a kettős hívást, a „60, 60” a desztilláció hasznát, a „120, 60” kétszer duplázik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $512 \times 512 \times 3$-as képet egy autoenkóder $64 \times 64 \times 16$-os kódba tömörít. Hányszor kevesebb számmal dolgozik a látens diffúzió, mint a pixeleken?`,
          options: ["12-szer", "48-szor", "64-szer", "4-szer"],
          answer: 0,
          hint: "Számold meg mindkét oldalon az összes számot – a csatornákkal együtt.",
          explain: R`$512 \cdot 512 \cdot 3 = 786\,432$, a kód $64 \cdot 64 \cdot 16 = 65\,536$, a hányados 12. A 48 a Stable Diffusion 4 csatornás kódjáé – a 16 csatorna kevesebb tömörítést ad (élesebb részletekért). A 64 csak a felbontást nézi ($8^2$), a 4 pedig $64/16$, a 3 eredeti csatornát kihagyva.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a feltételes generálásra?",
          options: [
            "Az osztályozómentes irányításhoz tanításkor a példák egy részénél (pl. 10–20%) a feltételt üresre cseréljük.",
            "Minél nagyobb az irányítás erőssége (s), annál jobb a kép.",
            "A negatív prompt a feltétel nélküli tipp helyére egy „ne ilyen legyen” feltétel tippjét teszi, és attól távolodik.",
            "Az osztályozómentes irányításhoz egy külön osztályozó háló gradiense kell.",
            "A diffúziós zajtalanító a szöveg beágyazás-sorozatát kereszt-figyelemmel olvassa."
          ],
          answer: [0, 2, 4],
          hint: "Honnan jön a feltétel nélküli tipp, ha csak egy háló van? És mi az ára a nagy s-nek?",
          explain: R`Igaz: az üres feltétel teszi lehetővé, hogy ugyanaz a háló $\hat{\boldsymbol\varepsilon}_u$-t is adjon; a negatív prompt ugyanez a trükk; a szöveget kereszt-figyelem olvassa. Hamis: nagy $s$-nél a kép hűbb a feltételhez, de kevésbé sokféle, túl nagynál „égett”. Az „osztályozómentes” épp azt jelenti, hogy nincs külön osztályozó: a két tipp különbsége játssza a szerepét.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy látens diffúziós szövegből kép rendszer új képet generál (nem meglévő képből indul). Melyik részére NINCS szükség ehhez?",
          options: ["Az autoenkóder kódolójára", "Az autoenkóder dekódolójára", "A szövegkódolóra", "A kódtérben dolgozó zajtalanítóra"],
          answer: 0,
          hint: "Kövesd végig a generálás útját: honnan indulsz, és mi rajzolja ki a végén a képet?",
          explain: "A generálás: szövegkódoló (feltétel) → zajtalanítás a kódtérben, tiszta zajból → dekódoló (kódból kép). A kódoló csak a tanításhoz kell, és ha meglévő képből indulunk (kép-ből-kép). A dekódoló nélkül nem lenne kép, a szövegkódoló nélkül nem lenne irányítás."
        },
        {
          type: "single", shuffle: true,
          q: "Kép-ből-kép módban egy fényképet kódolsz, t lépésig zajosítasz, majd az „akvarell” felirattal visszafelé mintavételezel. Mi történik, ha t nagyon kicsi?",
          options: [
            "A kép alig változik: az eredeti uralkodik, kevés akvarellhatással.",
            "Szinte teljesen új kép lesz, csak a felirat számít.",
            "A kép tiszta zaj marad, mert nincs elég lépés a zajtalanításra.",
            "A modell figyelmen kívül hagyja a fényképet, és a kódolót sem használja."
          ],
          answer: 0,
          hint: "Kis t mellett mennyi zaj kerül a fénykép kódjára – mennyi „döntenivaló” marad a modellnek?",
          explain: "Kis t: kevés zaj, a visszafelé mintavétel csak finom részleteken dönthet, ezért a kép alig változik. Majdnem T-nél szinte tiszta zajból indulunk, akkor lesz új kép, amelyben csak a felirat számít. A köztes t a felületek „erősség” csúszkája."
        }
      ]
    },

    /* ------------------------------------------------ 14.8 */
    "ai14-148": {
      title: "Kvíz – 14.8 Értékelés és kockázatok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy jellemzőszám a valódi képeken $\mathcal N(5;\ 2^2)$, a generáltakon $\mathcal N(3{,}5;\ 1^2)$ eloszlású. Mennyi az egydimenziós Fréchet-távolság?`,
          options: ["3,25", "11,25", "2,5", "2,25"],
          answer: 0,
          hint: R`$(\mu_1 - \mu_2)^2 + (\sigma_1 - \sigma_2)^2$ – a szórásokkal számolj, ne a varianciákkal.`,
          explain: R`$(5 - 3{,}5)^2 + (2 - 1)^2 = 2{,}25 + 1 = 3{,}25$. A 11,25 a varianciák különbségét emeli négyzetre ($(4 - 1)^2 = 9$), a 2,5 elfelejti a négyzetre emelést, a 2,25 csak az átlagok eltérését nézi – pedig itt a szórás is hibás: a modell túl szűk (kevéssé sokféle).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy modell pontossága 0,97, felidézése 0,1. Milyenek a mintái?",
          options: [
            "Szinte mind valószerű, de a valódi képek változatosságának csak kis részét fedik le.",
            "Sokfélék, de többségük nem valószerű.",
            "A modell másol: a minták a tanítóképek pontos másolatai.",
            "Rossz minőségűek és kevéssé sokfélék is."
          ],
          answer: 0,
          hint: "A pontosság a generált minták felől néz a valódiakra, a felidézés a valódiak felől a generáltakra. Melyik mér minőséget, melyik lefedettséget?",
          explain: "Pontosság: a minták hányad része esik a valódi képek környékére – 97%, tehát jó minőség. Felidézés: a valódi képek hányad részéhez van hasonló minta – csak 10%, tehát kicsi a lefedettség. Ez a VAE-szerű „óvatos” modell vagy a módusösszeomlás képe. Másolásról ezek a számok nem mondanak semmit – azt a legközelebbi tanítókép mutatja meg."
        },
        {
          type: "single", shuffle: true,
          q: "A 14.9-ben a tanítóképeket visszaadó „másoló” FID-je 23,3 – jobb, mint bármelyik valódi modellé. Miért?",
          options: [
            "Mert a FID csak azt méri, mennyire hasonlít a két jellemzőfelhő; azt nem kérdezi, újak-e a minták.",
            "Mert a másoló a tesztképeket adja vissza, és azokhoz mérjük.",
            "Mert a FID a másolást jutalmazza, a memorizálást viszont bünteti.",
            "Mert túl kevés mintán mértük; 50 000 mintánál a másoló FID-je rosszabb lenne."
          ],
          answer: 0,
          hint: "Mit tartalmaz a FID képlete: van-e benne bármi, ami a tanítóképekre hivatkozik?",
          explain: "A FID a valódi és a generált képek jellemzőire illesztett két normális eloszlás (átlag, kovariancia) távolsága. A tanítóképek ugyanolyan eloszlásúak, mint a tesztképek, ezért a másoló felhője nagyon hasonlít a valódiakéra – a FID nem tudja, hogy ezek nem új képek. A másoló tanítóképeket ad, nem tesztképeket (ezért nem 0 a FID-je). A minta száma torzít, de ez a vakságon nem segít: a másolást külön kell vizsgálni (legközelebbi tanítókép)."
        },
        {
          type: "match",
          q: "Párosítsd a mérőszámot vagy próbát azzal, amit mér!",
          pairs: [
            ["pontosság", "minőség: a minták valódi képek környékére esnek-e"],
            ["felidézés", "lefedettség: a valódi képekhez van-e hasonló minta"],
            ["FID", "két illesztett normális eloszlás távolsága a jellemzőtérben"],
            ["legközelebbi tanítókép", "másol-e a modell"],
            ["NLL", "átlagos meglepetés, csak valószínűséget adó modellnél"]
          ],
          hint: "Három kérdést kell külön feltenni: jók-e a minták, elég sokfélék-e, újak-e. Melyik eszköz melyikre felel?",
          explain: "A pontosság a minőséget, a felidézés a lefedettséget méri; a FID a kettőt egy számba mossa. A másolást csak a tanítóképekkel való összevetés (legközelebbi szomszéd, kinyerési próba) mutatja meg. NLL-t csak olyan modellnél tudunk mérni, amely valószínűséget ad (autoregresszív; VAE-nél csak korlát, GAN-nál semmi)."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 100 tokenes szövegben 62 „zöld” token van. Vízjel nélkül 50 várható, a szórás $\sqrt{100 \cdot 0{,}25}$. Mennyi a $z$-érték?`,
          options: ["2,4", "0,48", "1,70", "0,24"],
          answer: 0,
          hint: R`$z = (\text{megfigyelt} - \text{várható})/\text{szórás}$ – előbb vonj gyököt.`,
          explain: R`A szórás $\sqrt{25} = 5$, így $z = 12/5 = 2{,}4$: gyanús, de rövid szövegen nem erős bizonyíték. A 0,48 a varianciával (25) oszt, az 1,70 a $\sqrt{100 \cdot 0{,}5}$ hibás szórással, a 0,24 a várható értékkel (50) – ez relatív eltérés, nem $z$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a memorizálásról és a másolásról?",
          options: [
            "Carlini és társai kísérletében a kinyert képek jellemzően legalább százszor szerepeltek a tanítóadatban.",
            "A memorizálás elleni fő védekezés a duplikátumok kiszűrése a tanítóadatból.",
            "A diffúziós modell egy beépített képtárból vág ki és ragaszt össze darabokat.",
            "Ha egy modell generációról generációra a saját kimenetén tanul, elvesznek a ritka esetek (model collapse).",
            "Egy festő stílusában rajzolni ugyanaz, mint egy konkrét képét visszaadni – jogilag mindkettő egyformán védett."
          ],
          answer: [0, 1, 3],
          hint: "Mitől kerül a háló közel a „tökéletes”, másoló zajtalanítóhoz? És mi van benne egy diffúziós modellben – képek vagy egy háló?",
          explain: "Igaz: a sokszor ismétlődő képek kinyerhetők, ezért a duplikátumszűrés a fő védekezés; és a saját kimeneten tanuló modell elveszíti a „farkakat” (Shumailov és társai, 2024). Hamis: a diffúziós modellben nincs képtár, csak egy zajszűrő háló – ha mégis másol, az a túl sokszor látott képek memorizálása. A stílus általában nem védett, a konkrét mű igen (a határ vitatott)."
        },
        {
          type: "single", shuffle: true,
          q: "Carlini és társai 175 millió generált képben 109 közel-másolatot találtak. Ez körülbelül hány képenként egy?",
          options: ["kb. 1,6 millió képenként egy", "kb. 16 000 képenként egy", "kb. 160 000 képenként egy", "kb. 16 millió képenként egy"],
          answer: 0,
          hint: "Oszd el a generált képek számát a találatokkal – és figyelj a nagyságrendre.",
          explain: R`$175\,000\,000/109 \approx 1{,}6 \cdot 10^6$, vagyis kb. 1,6 millió képenként egy (arányként $6{,}2 \cdot 10^{-7}$). A többi opció egy-két nagyságrendet téveszt. Fontos: ez célzott keresés volt, a 350 000 leggyakrabban ismétlődő kép feliratával – egy átlagos kérés ritkán ad másolatot, egy ismert festmény vagy logó nevére viszont könnyebben.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy képben nem találsz SynthID-vízjelet. Mit jelent ez?",
          options: [
            "Csak annyit, hogy a kép nem egy vízjelező rendszerből jött – vagy a jelet eltávolították.",
            "Hogy a kép biztosan valódi fénykép.",
            "Hogy a kép biztosan hamis, mert a valódi fotókban is van vízjel.",
            "Hogy a kép C2PA-metaadatát levágták."
          ],
          answer: 0,
          hint: "Melyik tartalmakra működik a vízjel egyáltalán?",
          explain: "A vízjel csak a vízjelező rendszerek kimenetére működik, és átírással, erős szerkesztéssel gyengíthető. Hiánya tehát nem bizonyítja a valódiságot. A C2PA egy másik eszköz (csatolt, aláírt metaadat), amely a vízjeltől függetlenül hiányozhat. Általános, megbízható „MI-detektor” nincs."
        }
      ]
    },

    /* ------------------------------------------------ 14.9 */
    "ai14-149": {
      title: "Kvíz – 14.9 Alkalmazás: négy gép, egy adathalmaz",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A négy modell és a két alapvonal (másoló, Gauss-modell) közül melyiknek a legkisebb a FID-je a 14.9 táblázatában?",
          options: ["A másolónak", "A diffúziós modellnek", "Az autoregresszív modellnek", "A VAE-nek"],
          answer: 0,
          hint: "Ne csak a valódi modelleket nézd – a semmit nem tanult viszonyítási pontokat is.",
          explain: "A másoló FID-je 23,3, a diffúzióé 38,7 (a valódi modellek közül ez a legjobb), az autoregresszívé 56,7 (fekete-fehér képeken mérve), a VAE-é 101,4 – az utóbbi a legrosszabb. A tanulság: a FID a semmit nem tanult másolót hozza ki győztesnek, mert nem kérdezi, újak-e a minták."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik modellre igaz: a mintái szinte mind a valódi számjegyek felhőjén belül vannak (pontosság 0,99), de a valódi változatosság töredékét fedik le (felidézés 0,08)?",
          options: ["A VAE-re", "A GAN-ra", "Az autoregresszív modellre", "A Gauss-modellre"],
          answer: 0,
          hint: "Melyik modell rajzol homályos, „tipikus” átlagképeket?",
          explain: "A VAE „óvatos”: homályos, tipikus alakokat rajzol, amelyek a valódi számjegyek közé esnek, de csak egy szűk sávban – mint a 14.8 A modellje. A GAN közepes pontosságú és felidézésű (0,64 és 0,48), az autoregresszív modell épp fordított (0,56 és 0,88), a Gauss-modell 0,50 és 0,55."
        },
        {
          type: "single", shuffle: true,
          q: "A diffúziós modell mintáinak legközelebbi tanítóképe medián 17,3 egységre van, a valódi tesztképeké 16,7-re. Mit jelent ez?",
          options: [
            "A minták újak, de „a helyükön” vannak: ugyanolyan messze vannak a tanítóképektől, mint egy valódi új kép.",
            "A modell memorizál, mert a mintái közel vannak a tanítóképekhez.",
            "A minták furcsák, mert távolabb vannak a tanítóképektől, mint a tesztképek.",
            "Semmit, mert a legközelebbi szomszéd távolsága nem mond semmit a másolásról."
          ],
          answer: 0,
          hint: "Mihez kell mérni a távolságot: a nullához, vagy egy valódi, új kép távolságához?",
          explain: "A viszonyítási pont a valódi tesztkép: egy jó modell mintái se sokkal közelebb (másolás), se sokkal távolabb (furcsaság) ne legyenek. A 17,3 szinte ugyanannyi, mint a 16,7, és pontos másolat sincs. A másoló 0-ja lebukik, a GAN (22,2) és a Gauss (26,0) mintái viszont távolabb vannak, ami a kisebb pontosságukkal egyezik."
        },
        {
          type: "single", shuffle: true,
          q: "Hány hálóhívás kell a 450 minta előállításához a diffúziós modellnek, illetve a VAE-nek?",
          options: ["450 000, illetve 450", "1000, illetve 1", "450 000, illetve 3600", "450, illetve 450"],
          answer: 0,
          hint: "Mintánként hány lépés kell az egyiknek és a másiknak – és hány minta van?",
          explain: R`A diffúzió mintánként 1000 hálóhívás: $450 \cdot 1000 = 450\,000$. A VAE mintánként egy dekódolás: 450. Az „1000, 1” egyetlen mintára számol, a 3600 a 8 számos kódot szorozza be ($450 \cdot 8$), pedig a kód mérete nem lépésszám. Ez a diffúzió ára a jobb FID-ért.`
        },
        {
          type: "single", shuffle: true,
          q: "A GAN 450 mintájában a legritkább osztály (5-ös) 28-szor, a leggyakoribb (9-es) 60-szor szerepel. Hányszor gyakoribb a 9-es az 5-ösnél?",
          options: ["kb. 2,1-szer", "kb. 1,3-szer", "kb. 0,47-szer", "32-szer"],
          answer: 0,
          hint: "Két darabszám aránya – melyiket osztod melyikkel?",
          explain: R`$60/28 \approx 2{,}1$. Az 1,3 a leggyakoribb osztály a várható 45-höz képest ($60/45$), a 0,47 a fordított arány ($28/60$), a 32 pedig különbség, nem hányados. Ez enyhe részleges módusösszeomlás – egy kis, MLP-alapú GAN-tól várható.`
        },
        {
          type: "match",
          q: "Párosítsd a „gépet” a 14.9-ben látott jellemzőjével!",
          pairs: [
            ["autoregresszív modell", "egyedül ad pontos valószínűséget (25,9 bit/kép)"],
            ["VAE", "nagy pontosság, nagyon kicsi felidézés"],
            ["GAN", "a legegyenetlenebb osztályeloszlás (28–60)"],
            ["diffúziós modell", "a legkisebb FID a valódi modellek közül, 1000 hálóhívás mintánként"],
            ["másoló", "minden mintája 0 távolságra van egy tanítóképtől"]
          ],
          hint: "Gondold végig a két táblázatot: FID, pontosság/felidézés, osztályok, legközelebbi tanítókép – és melyik modell ad számot a valószínűségre.",
          explain: "Az autoregresszív modell az egyetlen pontos valószínűség (25,9 bit/kép), de zajos mintákkal. A VAE óvatos (0,99 és 0,08). A GAN osztályai a legegyenetlenebbek (28–60). A diffúzió a legjobb valódi modell a FID szerint (38,7), cserébe 1000 hívás mintánként. A másoló a legközelebbi szomszéd próbáján azonnal lebukik."
        },
        {
          type: "multi",
          q: "Mit NEM bizonyít ez a kísérlet, vagy mire kell vigyázni az értelmezésénél? Jelöld a helyes óvatossági megjegyzéseket!",
          options: [
            "A modellek sorrendje inkább átvihető a nagy modellekre, mint a különbségek mértéke.",
            "A GAN eredménye különösen érzékeny a véletlen magra.",
            "A mini-FID értékei közvetlenül összevethetők a szakirodalom FID-számaival.",
            "Az autoregresszív modell fekete-fehér képeket rajzol, ezért a számai a többiekkel csak óvatosan vethetők össze.",
            "A legközelebbi szomszéd próbája szerint a diffúziós modell memorizált."
          ],
          answer: [0, 1, 3],
          hint: "Melyik „szem” (jellemzőkinyerő) mérte a FID-et? És hány pontos másolatot rajzolt a diffúziós modell?",
          explain: "Helyes óvatosság: kis adat, kis hálók – a sorrend átvihetőbb, mint a számok; egy tanítás, egy mag (a GAN-nál ez különösen számít); az autoregresszív modellt fekete-fehér tesztképekhez mértük. Hamis: a mini-FID egy saját osztályozó 64 rejtett neuronjának terében készült, nem az Inception-hálóéban, ezért nem vethető össze a szakirodalommal. És a diffúziós modell nem memorizált: 0 pontos másolat, a távolság (17,3) a tesztképekéhez (16,7) hasonló."
        },
        {
          type: "single", shuffle: true,
          q: "Az autoregresszív modell mintáinak legközelebbi tanítókép-távolsága 35,8, a valódi (szürkeárnyalatos) tesztképeké 16,7. Miért félrevezető ezt a kettőt közvetlenül összevetni?",
          options: [
            "Mert az autoregresszív modell fekete-fehér képeket rajzol; a fekete-fehér tesztképeké 27,7, ehhez kell mérni.",
            "Mert az autoregresszív modell másol, csak a távolság ezt elrejti.",
            "Mert a legközelebbi szomszéd távolsága csak diffúziós modellnél értelmes.",
            "Mert az autoregresszív modell 64 lépésben rajzol, a többi egyben."
          ],
          answer: 0,
          hint: "Milyen képeket rajzol az autoregresszív modell, és milyenek a tesztképek?",
          explain: "Fekete-fehér és szürke képek távolsága nem vethető össze közvetlenül. A helyes viszonyítás a fekete-fehérré alakított tesztképek 27,7-es távolsága. A 35,8 ennél is nagyobb: a minták nem másolnak, de kevésbé valószerűek – ez egyezik a 0,56-os pontossággal. A mintavétel lépésszáma a távolságot nem befolyásolja."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai14-final": {
      title: "Fejezetzáró teszt – Generatív modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A tíz rajzon Laplace-simítást alkalmazunk (minden kép darabszáma +1, a nevező $10 + 16 = 26$). Hány bit a meglepetés az átlón ($\texttt{1001}$)?`,
          options: ["3,70 bit", "3,32 bit", "4,70 bit", "2,56 bit"],
          answer: 0,
          hint: R`Az átlót egy gyerek rajzolta. Számold ki a simított valószínűséget, aztán $-\log_2$.`,
          explain: R`$p = (1 + 1)/26 \approx 0{,}077$, a meglepetés $-\log_2(2/26) \approx 3{,}70$ bit. A 3,32 bit a simítás nélküli $-\log_2 0{,}1$, a 4,70 bit egy soha nem látott képé ($1/26$), a 2,56 pedig $\ln$-nel számolt (nat, nem bit).`
        },
        {
          type: "single", shuffle: true,
          q: R`A Markov-modellben (minden pixel csak az előtte lévőtől függ) $p(x_1 = 1) = 0{,}6$, $p(x_2 = 1 \mid x_1) = 0{,}5$, $p(x_3 = 1 \mid x_2 = 1) = 0$, $p(x_3 = 1 \mid x_2 = 0) = 0{,}8$, $p(x_4 = 1 \mid x_3) = 0{,}5$. Mennyi $p(\texttt{0101})$?`,
          options: ["0,10", "0,20", "0,06", "0,02"],
          answer: 0,
          hint: R`Négy tényező szorzata. A harmadiknál: mi az előző pixel, és fehér vagy fekete a bal alsó?`,
          explain: R`$p(x_1 = 0) = 0{,}4$, $p(x_2 = 1 \mid 0) = 0{,}5$, $p(x_3 = 0 \mid x_2 = 1) = 1$, $p(x_4 = 1 \mid x_3 = 0) = 0{,}5$: a szorzat 0,10. A 0,20 a teljes láncszabály (= táblázat) értéke, a 0,06 a független pixeleké. A 0,02 rossz feltételt használ: $p(x_3 = 0 \mid x_2 = 0) = 0{,}2$-t, pedig $x_2 = 1$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pixel logitja $z = -1$. Mennyi a fekete valószínűsége $T = 0{,}5$ hőmérsékleten?`,
          options: ["0,12", "0,38", "0,27", "0,88"],
          answer: 0,
          hint: R`$p = \sigma(z/T)$ – a hőmérséklettel osztunk.`,
          explain: R`$\sigma(-1/0{,}5) = \sigma(-2) \approx 0{,}12$: az alacsony hőmérséklet a valószínűtlen értéket még valószínűtlenebbé teszi. A 0,38 szoroz $T$-vel osztás helyett ($\sigma(-0{,}5)$), a 0,27 a $T = 1$-es érték, a 0,88 előjelhibás ($\sigma(2)$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A 14.3 lineáris dekódolója: $\hat{\mathbf x} = 0{,}5 + z_1 \cdot (0{,}5;\ 0{,}5;\ -0{,}5;\ -0{,}5) + z_2 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5)$. Mit rajzol a $(0;\ -0{,}5)$ kódból?`,
          options: [
            R`$(0{,}25;\ 0{,}75;\ 0{,}25;\ 0{,}75)$ – halvány jobb csík`,
            R`$(0{,}75;\ 0{,}25;\ 0{,}75;\ 0{,}25)$ – halvány bal csík`,
            R`$(0{,}25;\ 0{,}25;\ 0{,}75;\ 0{,}75)$ – halvány alsó csík`,
            R`$(0;\ 1;\ 0;\ 1)$ – a jobb csík`
          ],
          answer: 0,
          hint: R`$z_1 = 0$, tehát csak a második irány számít, $-0{,}5$-szörösen. Figyelj az előjelre!`,
          explain: R`$0{,}5 - 0{,}5 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5) = (0{,}25;\ 0{,}75;\ 0{,}25;\ 0{,}75)$: a $z_2$ „bal mínusz jobb”, a negatív érték jobbra húz, de csak félig. A bal csík előjelhiba, az alsó csík a $z_1$ irányát használja, a teljes jobb csík a $(0;\ -1)$ kódé lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy VAE kódolója $\boldsymbol\mu = (0;\ 1)$, $\boldsymbol\sigma = (0{,}5;\ 1)$-et ad. Mennyi a KL-tag?`,
          options: ["0,82", "0,13", "0,47", "1,64"],
          answer: 0,
          hint: R`Koordinátánként $\tfrac12(\mu^2 + \sigma^2 - 1 - \ln\sigma^2)$, aztán összeadod.`,
          explain: R`Első koordináta: $\tfrac12(0 + 0{,}25 - 1 - \ln 0{,}25) \approx 0{,}32$ (a keskeny felhőt bünteti); második: $\tfrac12(1 + 1 - 1 - 0) = 0{,}5$ (az eltolást bünteti). Összesen kb. 0,82. A 0,13 elhagyja a $-\ln\sigma^2$ tagot, a 0,47 $\ln\sigma$-val számol $\ln\sigma^2$ helyett, az 1,64 az $\tfrac12$-et felejti el.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az autoenkóderre és a VAE-re?",
          options: [
            R`Új kép generálásához a VAE-nek nincs szüksége a kódolóra: $\mathbf z \sim \mathcal N(0, I)$, aztán dekódoló.`,
            R`Egy sima autoenkóder kódterébe $\mathcal N(0, I)$-ből sorsolva a minták többsége biztosan felismerhető számjegy.`,
            "A VAE képeinek homálya abból jön, hogy a pixelenkénti rekonstrukciós hibát a kódhoz tartozó képek átlaga minimalizálja.",
            "A KL-tag a kódoló és a dekódoló hasonlóságát méri.",
            "A reparaméterezés teszi deriválhatóvá a kód sorsolását."
          ],
          answer: [0, 2, 4],
          hint: "Mit mér valójában a KL-tag – mihez hasonlítja a kódoló felhőit? És hány százalék volt a sima autoenkóder biztosan felismert mintáinak aránya?",
          explain: R`Igaz: generáláskor csak a prior és a dekódoló kell; a homály az átlagolás következménye; a $\mathbf z = \boldsymbol\mu + \boldsymbol\sigma \odot \boldsymbol\varepsilon$ alak deriválható $\boldsymbol\mu$ és $\boldsymbol\sigma$ szerint. Hamis: a sima autoenkóder véletlen kódjainak csak 27%-a ad biztosan felismert számjegyet (a VAE-nél 76%), mert a kódtér lyukas. A KL a kódoló felhőit a <em>priorhoz</em>, $\mathcal N(0, I)$-hez méri – nem a dekódolóhoz (ez egy népszerű tankönyv tévedése).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy képre $p_{\text{adat}} = 0{,}3$, $p_G = 0{,}1$. Mekkora a generátor nem telítődő vesztesége ezen a képen, ha a detektív optimális?`,
          options: ["0,29", "1,39", "0,75", "0,12"],
          answer: 0,
          hint: R`Előbb $D^* = p_{\text{adat}}/(p_{\text{adat}} + p_G)$, aztán a nem telítődő veszteség: $-\ln D$.`,
          explain: R`$D^* = 0{,}3/0{,}4 = 0{,}75$, a veszteség $-\ln 0{,}75 \approx 0{,}29$ – kicsi, mert ezt a képet a hamisító inkább túl ritkán rajzolja, a detektív valódinak tartja. Az 1,39 a $-\ln(1 - D)$, a 0,75 maga a $D^*$, a 0,12 pedig 10-es alapú logaritmussal számol.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a különbség a GAN módusösszeomlása és a memorizálás között?",
          options: [
            "A memorizáló modell tanítóképeket másol; az összeomlott GAN néhány (nem feltétlenül tanító-) képet ismételget – ez a sokféleség hiánya.",
            "Nincs különbség: mindkettő azt jelenti, hogy a modell a tanítóképeket adja vissza.",
            "A módusösszeomlás a VAE, a memorizálás a GAN jellemző hibája.",
            "A módusösszeomlást a legközelebbi tanítókép távolsága mutatja ki, a memorizálást az osztályok aránya."
          ],
          answer: 0,
          hint: "Az egyik a tanítóadathoz túl közel kerül, a másik a változatosságot veszíti el. Melyik melyik?",
          explain: "Módusösszeomlás ≠ túlillesztés. A memorizálás tanítópéldák (közel) pontos másolata – a legközelebbi tanítóképpel mutatható ki. A módusösszeomlás a sokféleség hiánya – az osztályarányok és a felidézés mutatják ki. A VAE jellemző hibája a homály, nem az összeomlás."
        },
        {
          type: "single", shuffle: true,
          q: R`A zajütemezés $\beta_1 = \beta_2 = \beta_3 = 0{,}2$. Mekkora a jel együtthatója, $\sqrt{\bar\alpha_3}$ a zárt alakban?`,
          options: ["0,72", "0,51", "0,40", "0,49"],
          answer: 0,
          hint: R`$\bar\alpha_3 = (1 - 0{,}2)^3$ – és a kérdés a gyökére vonatkozik.`,
          explain: R`$\bar\alpha_3 = 0{,}8^3 = 0{,}512$, a jel együtthatója $\sqrt{0{,}512} \approx 0{,}72$. A 0,51 maga $\bar\alpha_3$ (a variancia, nem az együttható), a 0,40 az $1 - \sum\beta$, a 0,49 pedig $1 - \bar\alpha_3$, a zaj varianciája.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért stabilabb a diffúziós modell tanítása, mint a GAN-é?",
          options: [
            "Mert közönséges regresszió rögzített célponttal (a hozzáadott zaj): nincs versengés, nincs mozgó ellenfél.",
            "Mert a diffúziós modellben nincs neurális háló, csak egy rögzített zajosító folyamat.",
            "Mert a diffúziós háló a valódi képeket egyáltalán nem látja.",
            "Mert a diffúziós modell ugyanazt a minimax-játékot játssza, csak több lépésben."
          ],
          answer: 0,
          hint: "Mi a veszteség célpontja a diffúziós tanításban, és változik-e tanítás közben?",
          explain: R`A diffúziós háló a $\lVert \boldsymbol\varepsilon - \hat{\boldsymbol\varepsilon} \rVert^2$ négyzetes hibát csökkenti, és a célpont, $\boldsymbol\varepsilon$, ismert és rögzített. A GAN-nál a hamisító célja a közben változó detektívtől függ – kétszereplős játék, amely nem garantáltan konvergál. A zajosításban valóban nincs tanulnivaló, de a zajtalanító háló igen; és a háló tanítóképeket zajosítva lát.`
        },
        {
          type: "single", shuffle: true,
          q: R`Negatív prompttal: $\hat\varepsilon_n = 0{,}4$ (a „homályos, torz” feltétel tippje), $\hat\varepsilon_c = 0{,}1$ (a kért feltételé), $s = 3$. Mennyi az irányított tipp?`,
          options: ["−0,5", "1,0", "−0,9", "0,3"],
          answer: 0,
          hint: R`A negatív prompt tippje veszi át a feltétel nélküli tipp helyét: $\hat\varepsilon_n + s\,(\hat\varepsilon_c - \hat\varepsilon_n)$.`,
          explain: R`$0{,}4 + 3 \cdot (0{,}1 - 0{,}4) = 0{,}4 - 0{,}9 = -0{,}5$: a negatív tipptől elfelé, a kért feltétel felé és azon túl lépünk. Az 1,0 felcseréli a szerepeket (a kért feltételtől távolodna), a $-0{,}9$ elfelejti a kiindulópontot, a 0,3 pedig egyszerűen $s\,\hat\varepsilon_c$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 300 tokenes szövegben 180 zöld token van. Vízjel nélkül 150 várható, a szórás $\sqrt{300 \cdot 0{,}25}$. Mennyi a $z$-érték?`,
          options: ["3,46", "0,40", "2,45", "0,20"],
          answer: 0,
          hint: R`$z = (\text{megfigyelt} - \text{várható})/\text{szórás}$; a szórás a variancia gyöke.`,
          explain: R`A szórás $\sqrt{75} \approx 8{,}66$, $z = 30/8{,}66 \approx 3{,}46$ – erős jel egy ilyen vízjelre (de csak annak a modellnek a vízjelére, és egy próba önmagában nem vád). A 0,40 a varianciával oszt, a 2,45 $\sqrt{150}$-nel, a 0,20 a várható értékkel.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a „Négy gép, egy füzet” rejtvény tanulsága a 14.9 alapján?",
          options: [
            "A „legjobb” attól függ, mit mérsz – és a FID-et a semmit nem tanult másoló nyerte, ezért egyetlen szám nem elég.",
            "A diffúziós modell minden mérőszámban a legjobb, ezért mindig azt kell választani.",
            "A VAE a legjobb, mert a legnagyobb a pontossága.",
            "A FID megbízható egyetlen mérőszám, a többit nem kell nézni."
          ],
          answer: 0,
          hint: "Melyik modell nyerte a pontosságot, melyik a FID-et, és melyik adott egyedül pontos valószínűséget?",
          explain: "A diffúzió a FID-ben a legjobb valódi modell, a VAE a pontosságban, az autoregresszív modell az egyetlen pontos valószínűségben – a FID-et pedig a másoló nyerte. Minőséget, lefedettséget és újdonságot külön kell mérni, és mindig meg kell nézni a legközelebbi tanítóképet."
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a fejezet döntési táblázata szerinti módszerrel!",
          pairs: [
            ["pontos valószínűség kell (tömörítés, modellek összevetése bitekben)", "autoregresszív modell"],
            ["valós idejű, egylépéses generálás szűk témában", "GAN vagy desztillált diffúzió"],
            ["a legjobb képminőség, szöveges irányítással", "látens diffúzió osztályozómentes irányítással"],
            ["anomália a rekonstrukciós hibából", "autoenkóder"],
            ["valódi-e ez a kép?", "eredetigazolás (C2PA) és vízjel"]
          ],
          hint: "Valószínűség, sebesség, minőség, tömörítés, eredet – melyik eszköz melyikben erős?",
          explain: "Pontos valószínűséget a láncszabály ad (autoregresszív modell). Egy lépésben a GAN vagy a desztillált diffúzió rajzol. A legjobb, szöveggel irányított kép a látens diffúzió / flow matching CFG-vel. A rekonstrukciós hiba az autoenkóder anomáliajelzője. A valódiságra az eredetigazolás és a vízjel felel – egy felismerő ítélete önmagában nem bizonyíték."
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
