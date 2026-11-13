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
