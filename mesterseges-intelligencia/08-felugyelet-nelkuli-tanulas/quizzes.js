/* =========================================================
   Mesterséges intelligencia 8. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 8.1 */
    "ai8-81": {
      title: "Kvíz – 8.1 Klaszterezés: a k-közép",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy klaszter tagjai: 1, 3, 8. Mennyi a klaszteren belüli négyzetösszeg (SSE)?",
          options: ["26", "8,67", "8", "74"],
          answer: 0,
          hint: "Előbb a középpont (az átlag), aztán a tőle mért eltérések négyzetösszege.",
          explain: R`A középpont $12/3 = 4$; $(1 - 4)^2 + (3 - 4)^2 + (8 - 4)^2 = 9 + 1 + 16 = 26$. A 8,67 ennek a harmada (variancia, nem összeg), a 8 az abszolút eltérések összege,
            a 74 a négyzetösszeg középre tolás nélkül ($1 + 9 + 64$).`
        },
        {
          type: "single", shuffle: true,
          q: "Pontok: 0, 2, 9, 11; a kezdő középpontok 0 és 2. Hol lesznek a középpontok az első hozzárendelés és frissítés után?",
          options: ["0 és 7,33", "1 és 10", "0 és 2", "0 és 6,5"],
          answer: 0,
          hint: "A hozzárendelésnél mindenki a közelebbi középponthoz megy – a 9 és a 11 is. Utána átlagolj.",
          explain: R`Hozzárendelés: {0} | {2, 9, 11} (a 9-nek és a 11-nek a 2 van közelebb). Frissítés: 0 és $(2 + 9 + 11)/3 \approx 7{,}33$. Az „1 és 10” a végeredmény, de ahhoz még egy kör kell;
            a „0 és 6,5” a 2 és a 11 átlaga – a 9 kimaradt.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a k-közép (Lloyd) algoritmusra?",
          options: [
            "Az SSE a futás során egyik lépésben sem nő.",
            "Mindig a lehető legkisebb SSE-jű felosztást találja meg.",
            "Az eredmény függhet a kezdő középpontoktól.",
            "Mivel nincs címke, a jellemzőket nem kell skálázni.",
            "Két középpont klasztereit egyenes (több dimenzióban sík) választja el."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj a beragadt középpont példájára, és arra, hogy a távolság mértékegységfüggő.",
          explain: "A két lépés egyike sem növeli az SSE-t, de az algoritmus lokális optimumban is megállhat – ezért számít a kezdés. A távolság mértékegységfüggő, a skálázás itt is kell. A határ a két középpont felező merőlegese."
        },
        {
          type: "single", shuffle: true,
          q: "Pontok: 0, 1, 4. A k-means++ első középpontja a 0. Mekkora eséllyel lesz a második középpont a 4?",
          options: ["≈ 94%", "80%", "50%", "≈ 33%"],
          answer: 0,
          hint: "A sorsolás a legközelebbi középponttól mért távolság négyzetével arányos.",
          explain: R`$D^2$: 0, 1, 16, összeg 17; $16/17 \approx 94\%$. A 80% a $D$-vel (négyzet nélkül) számolt arány ($4/5$), az 50% az egyenletes választás a két maradék pont közül, a 33% a három pont közül.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy pontra a saját klaszterétől mért átlagos távolság a = 3, a legközelebbi másik klaszterétől b = 1. Mennyi a sziluettje?",
          options: ["≈ −0,67", "≈ 0,67", "−2", "≈ 0,33"],
          answer: 0,
          hint: R`$s = (b - a)/\max(a, b)$ – figyelj a sorrendre!`,
          explain: R`$s = (1 - 3)/3 \approx -0{,}67$: a pont közelebb van egy másik klaszterhez, valószínűleg rossz helyen van. A 0,67 az $a$ és $b$ felcserélése, a −2 a normálás elhagyása, a 0,33 a $b/a$ hányados.`
        },
        {
          type: "single", shuffle: true,
          q: "Az SSE k = 1, …, 5-re: 500, 200, 120, 110, 105. Melyik k-t javasolja a könyökmódszer?",
          options: ["3", "5", "2", "1"],
          answer: 0,
          hint: "Nézd a csökkenéseket: hol lesz a következő klaszter haszna hirtelen kicsi?",
          explain: "A csökkenések: 300, 80, 10, 5. A 3. klaszter még sokat hoz (80), a 4. már alig (10): a könyök k = 3-nál van. Az 5 a legkisebb SSE – de az SSE mindig csökken k-val; a 2 a legnagyobb egyedi csökkenés utáni pont, de a 3. klaszter még megérte."
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a jelentésével!",
          pairs: [
            ["k-means++", "a kezdőpontok távolságnégyzet-arányos sorsolása"],
            ["újraindítás", "több futás, a legkisebb SSE-jű marad"],
            ["sziluett", "tömörség és szétválás egyetlen számban"],
            ["könyökmódszer", "az SSE-görbe törésének keresése"]
          ],
          hint: "Melyik szól a kezdésről, melyik a futások számáról, és melyik kettő a k megválasztásáról?",
          explain: "A k-means++ és az újraindítás a lokális optimum ellen véd; a könyök és a sziluett a klaszterek számának megválasztását segíti."
        }
      ]
    },

    /* ------------------------------------------------ 8.2 */
    "ai8-82": {
      title: "Kvíz – 8.2 Hierarchikus és sűrűségalapú klaszterezés",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az 1, 2, 4, 8, 9 pontok dendrogramja (egyszerű kapcsolás) összevonási magasságai: 1, 1, 2, 4. Hány klasztert kapsz, ha 1,5-nél vágod el?",
          options: ["3", "2", "4", "5"],
          answer: 0,
          hint: "Csak az 1,5 alatti összevonások történtek meg.",
          explain: "1,5 alatt csak a két 1-es magasságú összevonás történt meg: {1, 2}, {8, 9}, és a {4} egyedül maradt – 3 klaszter. A 2 klaszterhez 2 és 4 közötti vágás kell."
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi az A = {0, 2} és a B = {6, 12} klaszter távolsága teljes (complete) kapcsolással?",
          options: ["12", "4", "8", "64"],
          answer: 0,
          hint: "Teljes kapcsolás: a két klaszter legtávolabbi tagpárja.",
          explain: R`A tagpárok távolsága: 6, 12, 4, 10. A legnagyobb 12. A 4 az egyszerű kapcsolás (legkisebb), a 8 az átlagos, a 64 a Ward-féle SSE-növekedés: $\frac{2 \cdot 2}{4}(9 - 1)^2$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Pontok: 0, 1, 2, 10; DBSCAN $\varepsilon = 1{,}5$, minPts = 3 (a pont önmagát is számolja). Mi az eredmény?`,
          options: ["1 klaszter és 1 zajpont", "2 klaszter, zajpont nélkül", "1 klaszter, zajpont nélkül", "nincs klaszter, minden pont zaj"],
          answer: 0,
          hint: "Számold meg minden pont 1,5 sugarú környezetében a pontokat.",
          explain: "Szomszédszámok: 0: 2, 1: 3, 2: 2, 10: 1. Az 1 magpont, a 0 és a 2 határpont: klaszter {0, 1, 2}. A 10 senki környezetében nincs: zaj. A k-közép a 10-et külön klaszterbe tenné – a DBSCAN zajnak nevezi."
        },
        {
          type: "multi",
          q: "Melyik igaz a DBSCAN-re?",
          options: [
            "A klaszterek számát nem kell előre megadni.",
            "Tetszőleges alakú (pl. hold alakú) klasztereket is megtalálhat.",
            "Eltérő sűrűségű csoportokat egyetlen ε-nal is jól kezel.",
            "Minden pontot besorol valamelyik klaszterbe.",
            "Az ε értelme a jellemzők mértékegységétől függ."
          ],
          answer: [0, 1, 4],
          hint: "Gondolj a zajpontra és arra, hogy egyetlen sugár van az egész adatra.",
          explain: "A DBSCAN a sűrű tartományokat keresi, ezért nem kell k, és az alak tetszőleges. Egyetlen ε-ja van, ezért eltérő sűrűségnél gondban van (erre a HDBSCAN való), és a ritkás helyen lévő pontokat zajnak hagyja. Az ε távolság – mértékegységfüggő."
        },
        {
          type: "match",
          q: "Párosítsd a kapcsolási módot a tulajdonságával!",
          pairs: [
            ["egyszerű (single)", "hajlamos a láncolódásra"],
            ["teljes (complete)", "tömör, kis átmérőjű csoportok"],
            ["átlagos (average)", "az összes tagpár átlagos távolsága"],
            ["Ward", "az összevonás okozta SSE-növekedés"]
          ],
          hint: "A legkisebb távolság, a legnagyobb, az átlag – és melyik rokona a k-középnek?",
          explain: "Az egyszerű kapcsolásnál egy vékony pontsor is összeköthet két csoportot; a teljes a legtávolabbi párt nézi, ezért tömör csoportokat ad; a Ward a k-közép mércéjét (SSE) használja."
        },
        {
          type: "single", shuffle: true,
          q: "Pontok: 0, 1, …, 10 és a 15. Két klaszterre vágva melyik módszer adja a {0, 1, 2, 3} | {4, …, 10, 15} felosztást?",
          options: ["Ward-kapcsolás", "egyszerű kapcsolás", "teljes kapcsolás", "átlagos kapcsolás"],
          answer: 0,
          hint: "Melyik kapcsolás szereti a hasonló méretű csoportokat, akárcsak a k-közép?",
          explain: "A Ward minden lépésben a legkisebb SSE-növekedést választja; a végeredmény SSE-je 89, a {0, …, 10} | {15} felosztásé 110. Az egyszerű, a teljes és az átlagos kapcsolás a hosszú csoportot egyben hagyja, és a 15-öt választja le."
        }
      ]
    },

    /* ------------------------------------------------ 8.3 */
    "ai8-83": {
      title: "Kvíz – 8.3 Főkomponens-elemzés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy középre tolt adat kovarianciamátrixa $\begin{pmatrix} 2{,}5 & 1{,}5 \\ 1{,}5 & 2{,}5 \end{pmatrix}$. Mennyi a vetített variancia a 45°-os irányban?`,
          options: ["4", "2,5", "5", "1"],
          answer: 0,
          hint: R`$\operatorname{Var}(\mathbf u) = \mathbf u^\top C\mathbf u$, ahol $\mathbf u = \frac{1}{\sqrt2}(1; 1)$.`,
          explain: R`$\mathbf u^\top C\mathbf u = \frac12(2{,}5 + 1{,}5 + 1{,}5 + 2{,}5) = 4$ – ez $\lambda_1$, a 45° a fő irány. A 2,5 a tengelyirányú variancia, az 5 a teljes variancia (nyom), az 1 a másik sajátérték (135°).`
        },
        {
          type: "single", shuffle: true,
          q: "A sajátértékek: 6, 3, 1. Mekkora részt magyaráz az első két főkomponens együtt?",
          options: ["90%", "60%", "≈ 66,7%", "30%"],
          answer: 0,
          hint: "Megtartott sajátértékek összege osztva az összes sajátérték összegével.",
          explain: R`$(6 + 3)/(6 + 3 + 1) = 90\%$. A 60% csak az első, a 66,7% a $6/9$ (a nevezőből kimaradt az 1), a 30% a második.`
        },
        {
          type: "multi",
          q: "Melyik igaz a PCA-ra?",
          options: [
            "A legtöbb variancia megtartása ugyanaz, mint a legkisebb átlagos rekonstrukciós hiba.",
            "A PCA kiválasztja a legfontosabb eredeti jellemzőket.",
            "Különböző mértékegységű jellemzőknél előtte standardizálni kell.",
            "Az első főkomponens mindig a legjobb irány az osztályok szétválasztására.",
            "A főkomponensek előjele önkényes."
          ],
          answer: [0, 2, 4],
          hint: "Gondolj a Pitagorasz-felbontásra, a két párhuzamos szivarra és arra, hogy egy sajátvektor ellentettje is sajátvektor.",
          explain: "A teljes variancia = megtartott + rekonstrukciós hiba. A főkomponensek az összes jellemző kombinációi (jellemzőkivonás, nem kiválasztás). A PCA nem látja a címkét: a két szivarnál épp a kis varianciájú irány választja szét az osztályokat."
        },
        {
          type: "single", shuffle: true,
          q: "A wine adatkészlet nyers PCA-jában az első főkomponens a variancia 99,8%-át magyarázza. Mi ennek a legvalószínűbb oka?",
          options: [
            "Egy jellemző (a prolin) nagy számai uralják a varianciát.",
            "A borok valójában egydimenziós adatot alkotnak.",
            "A 13 jellemző szinte tökéletesen korrelál egymással.",
            "A PCA-t túl kevés adaton illesztették."
          ],
          answer: 0,
          hint: "Nézd meg a jellemzők szórását: van, amelyik százas nagyságrendű, van, amelyik tized.",
          explain: "A prolin szórása 314, a színárnyalaté 0,23 – a varianciák aránya kb. 1,9 millió. Standardizálás után az első komponens csak 36,2%-ot magyaráz. A nagy arány itt egy mértékegység uralmát jelzi, nem az adat egyszerűségét."
        },
        {
          type: "single", shuffle: true,
          q: "Sajátértékek: 5, 3, 1, 1. Két főkomponenst tartasz meg. Mennyi az átlagos rekonstrukciós hiba?",
          options: ["2", "8", "1", "10"],
          answer: 0,
          hint: "Ami a megtartott irányokon kívül esik, az a hiba.",
          explain: "A kihagyott sajátértékek összege: 1 + 1 = 2. A 8 a megtartott variancia, a 10 a teljes, az 1 csak az egyik kihagyott."
        },
        {
          type: "single", shuffle: true,
          q: "Egy osztályozó elé PCA-t teszel. Hogyan válaszd meg a megtartott komponensek számát?",
          options: [
            "Az osztályozó keresztvalidált teljesítménye alapján, a PCA-t a hajtáson belül illesztve.",
            "Mindig annyit, amennyi a variancia 95%-ához kell – az biztosan megtartja, ami a jósláshoz kell.",
            "A teljes adaton illesztett PCA kőomlás-ábrájáról, a felosztás előtt.",
            "Mindig kettőt, mert az ábrázolható."
          ],
          answer: 0,
          hint: "A PCA nem látja a címkét – ki tudja megmondani, mi kell a jósláshoz?",
          explain: "A variancia-szabály nem garantálja, hogy a jósláshoz fontos irány megmarad (lásd a két szivart). A teljes adaton illesztett PCA szivárgás. Ha a cél a jóslás, a q is hiperparaméter: keresztvalidációval, csővezetékben kell hangolni."
        }
      ]
    },

    /* ------------------------------------------------ 8.4 */
    "ai8-84": {
      title: "Kvíz – 8.4 t-SNE és UMAP",
      questions: [
        {
          type: "multi",
          q: "Egy t-SNE-térképről mit olvashatsz le megbízhatóan?",
          options: [
            "Hogy két pont egymás közeli szomszédja-e.",
            "Hogy melyik csoport szóródik jobban (a sziget mérete alapján).",
            "Hogy melyik két csoport hasonlít jobban egymásra (a szigetek távolsága alapján).",
            "Hogy egy pont egy szigeten belül van-e."
          ],
          answer: [0, 3],
          hint: "A t-SNE célfüggvénye mit büntet erősen, és mit alig?",
          explain: "A KL-divergencia a szomszédok szétszakítását bünteti erősen; a nagy távolságokért szinte semmit nem fizet. Ezért a helyi szomszédság megbízható, a szigetek mérete és távolsága nem."
        },
        {
          type: "single", shuffle: true,
          q: "Mit szabályoz a t-SNE perplexitás paramétere?",
          options: [
            "Nagyjából hány „hatásos szomszédot” vesz figyelembe minden pont.",
            "Hány dimenziós legyen a térkép.",
            "Hány klasztert keressen az algoritmus.",
            "Hány iterációig fusson a gradiens módszer."
          ],
          answer: 0,
          hint: R`A perplexitás $2^H$, ahol $H$ a szomszédsági valószínűségek entrópiája.`,
          explain: R`Ha egy pontnak $k$ szomszédja van egyenlő súllyal, a perplexitás pontosan $k$. A t-SNE pontonként úgy állítja be a Gauss-harang szélességét ($\sigma_i$), hogy ez a megadott érték legyen. Klasztert a t-SNE nem keres.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért használ a t-SNE a térképen vastag farkú t-eloszlást a Gauss-harang helyett?",
          options: [
            "Hogy a közepesen távoli pontok a térképen messzebb kerülhessenek, és a csoportok ne zsúfolódjanak egymásra.",
            "Hogy a térkép távolságai pontosan megegyezzenek az eredetiekkel.",
            "Mert a t-eloszlással a módszer lineáris lesz.",
            "Hogy új pontokat is el lehessen helyezni a térképen."
          ],
          answer: 0,
          hint: "Sok dimenzióban sok közepesen távoli pont van – elfér-e mind 2D-ben közepes távolságban?",
          explain: "Ez a zsúfoltsági probléma: 2D-ben nincs elég hely. A t-eloszlás lassan cseng le, így egy kis hasonlóságot nagy térképtávolság is kifejezhet – a csoportok közé „levegő” kerül. A távolságokat nem őrzi meg, és új pontra sincs képlet."
        },
        {
          type: "single", shuffle: true,
          q: "800 számjegyen az 5-NN pontosság a 2D-s PCA-térképen 64%, a t-SNE-térképen 95%. Mi a fő ok?",
          options: [
            "A PCA két lineáris tengelye a variancia kis részét őrzi, a számjegyek egymásra vetülnek; a t-SNE kifejezetten a szomszédságot őrzi.",
            "A t-SNE a címkéket is felhasználta a térkép készítéséhez.",
            "A PCA-t nem standardizált adaton futtatták.",
            "A t-SNE több dimenzióra vetít, mint a PCA."
          ],
          answer: 0,
          hint: "Mennyi varianciát őriz meg az első két főkomponens, és mit mér az 5-NN?",
          explain: "Az első két főkomponens csak a variancia kb. 28,5%-át őrzi; az 5-NN viszont épp a szomszédságot méri, amit a t-SNE optimalizál. A címkét egyik módszer sem látta – csak a színezéshez használtuk."
        },
        {
          type: "match",
          q: "Párosítsd a módszert a tulajdonságával!",
          pairs: [
            ["PCA", "lineáris, új pontra képlettel alkalmazható"],
            ["t-SNE", "helyi szomszédság, új pontra nem alkalmazható"],
            ["UMAP", "szomszédsági gráf, új pontokra is transzformál"],
            ["Isomap, LLE", "a 2000-es évek korai nemlineáris módszerei"]
          ],
          hint: "Melyik tanul függvényt, és melyik csak a meglévő pontokat rendezi el?",
          explain: "A PCA egy lineáris vetítés, bármely új pontra alkalmazható. A t-SNE csak a meglévő pontok elrendezése. Az UMAP gráfot illeszt, és van transzformációja új pontokra."
        }
      ]
    },

    /* ------------------------------------------------ 8.5 */
    "ai8-85": {
      title: "Kvíz – 8.5 Anomáliadetektálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az L vásárló (14 vásárlás/hó, 28 ezer Ft) z-értékei 1,24 és 1,12, mégis a leggyanúsabb. Miért nem vette észre a z-szabály?",
          options: [
            "Mert a különlegessége a két jellemző kombinációjában van, a z-érték pedig oszloponként vizsgál.",
            "Mert a z-értéket rosszul számoltuk: a minta szórásával 3 fölött lenne.",
            "Mert a z-szabály csak negatív kiugrásokat talál meg.",
            "Mert L valójában nem anomália."
          ],
          answer: 0,
          hint: "Melyik oszlopban lóg ki L? És a kettő együtt?",
          explain: "Mindkét értéke a szokásos tartományban van; csak az együttesük ritka (a többiek vagy gyakran vásárolnak keveset, vagy ritkán sokat). Ezt többváltozós módszer látja: szomszédtávolság, középponttól mért távolság, Mahalanobis-távolság."
        },
        {
          type: "single", shuffle: true,
          q: "Pontok egy egyenesen: 1, 2, 3, 4, 12. Mennyi a 12-es pont 1. szomszédjának távolsága?",
          options: ["8", "9", "10", "11"],
          answer: 0,
          hint: "A legközelebbi másik pont távolsága.",
          explain: R`A legközelebbi pont a 4: $12 - 4 = 8$. A 9 a 2. szomszéd (a 3) távolsága, a 10 a 3. szomszédé (a 2), a 11 a legtávolabbi ponté (az 1).`
        },
        {
          type: "single", shuffle: true,
          q: "Pontok: 0, 1, 2, 10. Mekkora eséllyel szigeteli el a 10-et az izolációs fa első, véletlen vágása (egyenletesen 0 és 10 között)?",
          options: ["80%", "20%", "25%", "10%"],
          answer: 0,
          hint: "Hová kell esnie a vágásnak, hogy a 10 egyedül maradjon?",
          explain: "A vágásnak a 2 és a 10 közé kell esnie: 8/10 = 80%. A 25% az „egy a négy pontból” gondolat, a 10% a 0 elszigetelésének esélye (a 0 és az 1 közé eső vágás)."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pont átlagos úthossza az izolációs erdőben 5, a normáló érték $c(\psi) = 10$. Mennyi az anomáliapontszáma ($s = 2^{-E[h]/c}$)?`,
          options: ["≈ 0,71", "0,5", "≈ 0,29", "≈ 1,41"],
          answer: 0,
          hint: R`$2^{-0{,}5} = 1/\sqrt2$.`,
          explain: R`$2^{-5/10} = 2^{-0{,}5} \approx 0{,}71$ – jóval 0,5 fölött, tehát gyanús. A 0,5 akkor lenne, ha az úthossz épp az átlagos ($E[h] = c$); a 0,29 az $1 - 0{,}71$; az 1,41 az előjel elhagyása.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy detektor a felső 20 esetet jelöli meg; köztük 5 valódi anomália van, összesen 8 van az adatban. Mennyi a precizitás?",
          options: ["25%", "62,5%", "40%", "≈ 0,25%"],
          answer: 0,
          hint: "Precizitás: a megjelöltek hányad része valódi. Felidézés: a valódiak hányad részét jelölte meg.",
          explain: "Precizitás@20 = 5/20 = 25%. A 62,5% a felidézés (5/8); a 40% a 8/20 (az összes anomália osztva a megjelöltekkel); a 0,25% a 0,25 arány még egyszer százalékra „váltva”."
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "Az izolációs erdő előtt nem kell skálázni.",
            "A PCA-rekonstrukciós hiba elsősorban a fő irány mentén távoli, de szokásos pontokat jelöli meg.",
            "Ritka anomáliáknál a pontosság (accuracy) jó mérőszám.",
            "Ha a tanító adatban sok anomália van, a modell őket is „szokásosnak” tanulhatja.",
            "A küszöböt gyakran az ellenőrzési kapacitás határozza meg."
          ],
          answer: [0, 3, 4],
          hint: "Gondolj a (3; 3,5) és a (2; −2) pontra, és a 99,9%-os semmittevőre.",
          explain: "Az izolációs erdő egy jellemzőn belül vág, ezért mértékegység-független. A rekonstrukciós hiba épp a szokásos szerkezetből kilépő pontokat jelöli. Ritka eseménynél a pontosság félrevezet – precizitás, felidézés, PR-görbe kell."
        }
      ]
    },

    /* ------------------------------------------------ 8.6 */
    "ai8-86": {
      title: "Kvíz – 8.6 Ajánlórendszerek",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Anna értékelései (5, 4, 1), Csilláé (1, 2, 5) ugyanazon a három könyvön. Mennyi a nyers koszinusz-hasonlóságuk?",
          options: ["≈ 0,51", "−1", "18", "≈ 0,97"],
          answer: 0,
          hint: "Skaláris szorzat osztva a két hossz szorzatával – átlagra igazítás nélkül.",
          explain: R`$\frac{5 + 8 + 5}{\sqrt{42}\sqrt{30}} \approx 0{,}51$. Pedig az ízlésük ellentétes: átlagra igazítva (Pearson) −1 jön ki. A 18 a normálatlan skaláris szorzat, a 0,97 Anna és Bence hasonlósága.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy olvasó átlaga 3. Szomszédai: hasonlóság 0,8, a könyv értékelése 5, saját átlaga 4; hasonlóság 0,4, értékelés 2, átlag 3. Mennyi a becslés az átlagra igazított képlettel?",
          options: ["≈ 3,33", "4", "3,4", "≈ 0,33"],
          answer: 0,
          hint: R`$\hat r = \bar r_u + \sum \operatorname{sim}\cdot(r_v - \bar r_v) / \sum|\operatorname{sim}|$.`,
          explain: R`$3 + \frac{0{,}8 \cdot (5 - 4) + 0{,}4 \cdot (2 - 3)}{0{,}8 + 0{,}4} = 3 + \frac{0{,}4}{1{,}2} \approx 3{,}33$. A 4 a nyers értékelések súlyozott átlaga (az átlagokat figyelmen kívül hagyva), a 3,4 a normálás elhagyása, a 0,33 csak az eltérés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mátrixfaktorizáció: $\mu = 3{,}6$, az olvasó eltolása $b_u = -0{,}3$, a könyvé $b_i = 0{,}5$, a tényezők skaláris szorzata $0{,}6$. Mennyi a becslés?`,
          options: ["4,4", "3,8", "5,0", "0,6"],
          answer: 0,
          hint: "Minden tagot adj össze, előjelesen.",
          explain: R`$3{,}6 - 0{,}3 + 0{,}5 + 0{,}6 = 4{,}4$. A 3,8 a tényezők elhagyása, az 5,0 a $b_u$ előjelének elrontása ($3{,}6 + 0{,}3 + 0{,}5 + 0{,}6$), a 0,6 csak a skaláris szorzat.`
        },
        {
          type: "multi",
          q: "Egy vadonatúj könyvet (senki nem értékelte még) szeretnél ajánlani. Mi segít?",
          options: [
            "a könyv tartalmi jellemzői (műfaj, szerző, leírás)",
            "felhasználóalapú kollaboratív szűrés",
            "a meglévő értékelésekből tanult mátrixfaktorizáció",
            "a hasonló, már értékelt könyvek népszerűsége",
            "egy rövid kérdőív vagy kiemelés az új könyvekről"
          ],
          answer: [0, 3, 4],
          hint: "Melyik módszerhez kell, hogy valaki már értékelje a könyvet?",
          explain: "Ez a hidegindítás. A kollaboratív szűrésnek és a mátrixfaktorizációnak értékelés kell (a könyvnek nincs tanult tényezővektora). A tartalom, a hasonló könyvek és az aktív adatgyűjtés segít – ezért hibrid a legtöbb valódi ajánló."
        },
        {
          type: "single", shuffle: true,
          q: "Miért hiba a hiányzó értékeléseket 0-val kitölteni, mielőtt SVD-t számolsz?",
          options: [
            "Mert a modell azt tanulja meg, hogy a legtöbb könyvet mindenki 0-ra értékeli – a „nem olvasta” nem „utálja”.",
            "Mert az SVD csak négyzetes mátrixra működik.",
            "Mert a 0 kívül esik az 1–5 skálán, és az SVD ezt hibának jelzi.",
            "Mert így túl sok lesz a számítás."
          ],
          answer: 0,
          hint: "Mit jelent egy üres cella egy könyvesbolt értékelési táblájában?",
          explain: "Az üres cella ismeretlen, nem rossz értékelés. A mátrixfaktorizáció ezért csak a látott cellákon illeszt (regularizálva). Az SVD bármilyen alakú mátrixra működik."
        },
        {
          type: "match",
          q: "Párosítsd az ajánlási módszert a lényegével!",
          pairs: [
            ["tartalomalapú", "termékjellemzők és a felhasználó profilja"],
            ["felhasználóalapú szűrés", "hasonló ízlésű felhasználók értékelései"],
            ["termékalapú szűrés", "hasonlóan értékelt termékek („akik ezt vették…”)"],
            ["mátrixfaktorizáció", "rejtett tényezők, skaláris szorzat"]
          ],
          hint: "Mihez mér az egyes módszer: a termék tartalmához, más felhasználókhoz, más termékekhez, vagy tanult vektorokhoz?",
          explain: "A tartalomalapú módszer a termékek jellemzőiből, a kollaboratív szűrés a visszajelzésekből (sorok vagy oszlopok hasonlóságából), a mátrixfaktorizáció tanult rejtett vektorokból dolgozik."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai8-final": {
      title: "Fejezetzáró teszt – 8. Felügyelet nélküli tanulás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Pontok: 1, 2, 10, 12; kezdő középpontok: 1 és 10. Hol áll meg a k-közép?",
          options: ["1,5 és 11", "1 és 10", "6,25 és 6,25", "1,5 és 10"],
          answer: 0,
          hint: "Egy hozzárendelés, egy átlagolás – aztán ellenőrizd, változik-e még valami.",
          explain: "Hozzárendelés: {1, 2} | {10, 12}; frissítés: 1,5 és 11. Újabb hozzárendelésnél nincs változás – vége. A 6,25 az összes pont átlaga (egy klaszter), az „1 és 10” a kezdés."
        },
        {
          type: "single", shuffle: true,
          q: "Két hold alakú pontfelhő és néhány szétszórt zajpont. Melyik módszert választod?",
          options: ["DBSCAN", "k-közép, k = 2", "PCA", "Ward-kapcsolású hierarchikus klaszterezés"],
          answer: 0,
          hint: "Melyik módszer követ tetszőleges alakot, és melyiknek van „zaj” kategóriája?",
          explain: "A DBSCAN a sűrű tartományok mentén lépked, így a holdakat egészben találja meg, a zajpontokat pedig zajnak jelöli. A k-közép és a Ward gömbölyű csoportokat keres; a PCA nem klaszterez."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pontra $a = 1$, $b = 4$. Mennyi a sziluettje?`,
          options: ["0,75", "−0,75", "3", "0,25"],
          answer: 0,
          hint: R`$s = (b - a)/\max(a, b)$.`,
          explain: R`$(4 - 1)/4 = 0{,}75$: a pont jól a helyén van. A −0,75 a felcserélés, a 3 a normálás elhagyása, a 0,25 az $a/b$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kétdimenziós adat sajátértékei 3 és 1. Hány százalékot magyaráz az első főkomponens?",
          options: ["75%", "33%", "3%", "25%"],
          answer: 0,
          hint: "Az első sajátérték osztva az összeggel.",
          explain: "3/(3 + 1) = 75%. A 25% a második komponensé; a 33% az 1/3 – a két sajátérték hányadosa, nem a magyarázott rész; a 3% a sajátérték „százalékként” olvasva."
        },
        {
          type: "set",
          q: "Melyik módszer eredménye függ a jellemzők mértékegységétől (skálázás nélkül)?",
          items: ["k-közép", "DBSCAN", "PCA", "hierarchikus klaszterezés euklideszi távolsággal", "izolációs erdő", "döntési fa"],
          answer: ["k-közép", "DBSCAN", "PCA", "hierarchikus klaszterezés euklideszi távolsággal"],
          hint: "Melyik számol távolságot vagy varianciát, és melyik vág csak egy-egy jellemzőn belül?",
          explain: "A k-közép, a DBSCAN és a hierarchikus klaszterezés távolsággal, a PCA varianciával dolgozik – mind mértékegységfüggő. Az izolációs erdő és a döntési fa egy jellemzőn belül, annak saját tartományában vág."
        },
        {
          type: "single", shuffle: true,
          q: "Egy t-SNE-térképen az A és a B sziget közel van egymáshoz, a C messze. Mit mondhatsz?",
          options: [
            "Semmi biztosat: a szigetek távolságát a t-SNE nem őrzi meg, ezt az eredeti térben kell ellenőrizni.",
            "A és B biztosan hasonlóbb egymáshoz, mint A és C.",
            "C biztosan anomália.",
            "A és B valójában egy klaszter."
          ],
          answer: 0,
          hint: "Mit büntet a t-SNE célfüggvénye, és mit nem?",
          explain: "A t-SNE a helyi szomszédságot őrzi; a nagy távolságokért a célfüggvény szinte semmit nem fizet. A szigetek távolsága és mérete a térképen nem értelmezhető."
        },
        {
          type: "single", shuffle: true,
          q: "Pontok: 1, 2, 3, 4, 10, 11, 12 és egy 40-es. Mit ad a k-közép k = 2-vel?",
          options: ["{1, …, 12} és {40}", "{1, 2, 3, 4} és {10, 11, 12, 40}", "{1, 2, 3, 4} és {10, 11, 12}, a 40 zaj", "{1, 2, 3, 4, 10} és {11, 12, 40}"],
          answer: 0,
          hint: "A kiugró pont távolsága négyzetesen számít az SSE-ben.",
          explain: "A 40 messze van mindenkitől; ha más klaszterben lenne, hatalmas négyzetes eltérést okozna. Ezért saját klasztert kap, a két valódi csoport pedig összeolvad (SSE 130,9). Zaj kategória a k-középben nincs – az a DBSCAN-ben van."
        },
        {
          type: "single", shuffle: true,
          q: "Miért ad a nyers koszinusz-hasonlóság még ellentétes ízlésű olvasóknál is pozitív (0,5 körüli) értéket?",
          options: [
            "Mert minden értékelés pozitív szám, ezért a vektorok nagyjából egy irányba mutatnak – az átlagot ki kell vonni.",
            "Mert a koszinusz a vektorok hosszától függ.",
            "Mert a koszinusz csak 0 és 1 között lehet.",
            "Mert túl kevés közös könyvük van."
          ],
          answer: 0,
          hint: "Az 1–5 skála minden értéke pozitív. Merre mutatnak az ilyen vektorok?",
          explain: "Az 1–5 csillagos vektorok mind a pozitív „térnegyedben” vannak, így a szögük kicsi. Az átlagra igazítás (Pearson) után az ízlés iránya látszik: Anna és Csilla −1. A koszinusz a hossztól független, és −1 és 1 között lehet."
        },
        {
          type: "single", shuffle: true,
          q: "Egy csapat 30 jellemzős vásárlói adaton futtat k-közepet nyers adatokon; az egyik jellemző az éves költés forintban. Mire számíts?",
          options: [
            "A klasztereket szinte csak az éves költés határozza meg.",
            "A klaszterek ugyanazok lesznek, mint standardizálva.",
            "A k-közép nem fog konvergálni.",
            "A sziluett automatikusan kijavítja a mértékegység hatását."
          ],
          answer: 0,
          hint: "Melyik jellemzőnek a legnagyobbak a számai, és hogyan számol a távolság?",
          explain: "Az euklideszi távolságban a legnagyobb számú (legnagyobb szórású) jellemző dominál – itt a forintban mért költés. A konvergencia nem függ ettől, és a sziluett ugyanazt a torz távolságot használja."
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a legalkalmasabb eszközzel!",
          pairs: [
            ["vásárlói szegmensek kerek, hasonló csoportokban", "k-közép"],
            ["fajok rokonsági fája, nem tudjuk a csoportok számát", "hierarchikus klaszterezés"],
            ["30 jellemző tömörítése egy modell előtt", "PCA"],
            ["szokatlan tranzakciók milliós adatban", "izolációs erdő"],
            ["mit olvasson még, aki ezt szerette?", "kollaboratív szűrés"]
          ],
          hint: "Csoportok, fa, tömörítés, kilógó esetek, ajánlás – mindegyikhez más eszköz illik.",
          explain: "A k-közép gyors és jó gömbölyű csoportokra; a hierarchikus klaszterezés fát ad és nem kéri a k-t; a PCA tömörít; az izolációs erdő nagy adaton is gyors anomáliadetektor; az ajánláshoz a kollaboratív szűrés (vagy mátrixfaktorizáció) kell."
        },
        {
          type: "single", shuffle: true,
          q: "Egy két jellemzős adatban a (3; 3,5) pont messze van az átlagtól, de a fő irány mentén fekszik; a (2; −2) közelebb van, de merőleges rá. Melyiket jelöli meg a PCA-rekonstrukciós hiba (egy komponenssel)?",
          options: ["a (2; −2)-t", "a (3; 3,5)-öt", "mindkettőt egyformán", "egyiket sem"],
          answer: 0,
          hint: "A rekonstrukciós hiba azt méri, mennyi marad ki a fő irányra vetítésből.",
          explain: "A (3; 3,5) szinte a fő irányon fekszik: hibája 0,125. A (2; −2) teljesen merőleges: vetülete 0, hibája 8. A rekonstrukciós hiba a szokásos szerkezetből kilépő pontot jelöli meg, nem a távolit."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
