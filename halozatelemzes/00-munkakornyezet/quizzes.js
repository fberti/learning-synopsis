/* =========================================================
   Hálózatelemzés 0. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk (a könyv adatain is).
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 0.1 */
    "sna0-1": {
      title: "Ellenőrző kvíz – 0.1 Projekt és Python-környezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Anna gépén a <code>nx.to_numpy_array(nx.karate_club_graph()).sum()</code> eredménye 156, Bencéén 462. Mi a magyarázat?`,
          options: [
            R`Más a <code>networkx</code> verziója: a 2.7-es óta a beépített karateklub élei súlyt kapnak, így a mátrix nem 0/1-es.`,
            "Bence gépén a gráf irányított, ezért minden él kétszer számít.",
            "Anna gépén egy tag hiányzik az adatból, ezért kevesebb az él.",
            "A 462 a háromszögek száma, a 156 az éleké; a két függvény mást számol."
          ],
          answer: 0,
          hint: "A kód ugyanaz. Mi lehet más a két gépen? Nézd meg, mi a 462 és a 156 fele.",
          explain: R`A $156/2 = 78$ a barátságok száma, a $462/2 = 231$ az élsúlyok összege. A <code>networkx</code> 2.7 óta a karateklub élein ott a <code>weight</code> attribútum (Zachary eredeti adatai), és a <code>to_numpy_array</code> alapból a súlyt írja a cellába. Irányított gráf esetén is 156 jönne ki (78 él két irányban), és tag sem hiányzik: mindkét gépen 34 csúcs van. A tanulság: <b>verzió nélkül nincs reprodukálható szám</b>.`
        },
        {
          type: "multi", shuffle: true,
          q: "Mely fájlok és mappák kerüljenek a projekt git-tárába? (Több jó válasz is lehet.)",
          options: [
            R`<code>pyproject.toml</code>`,
            R`<code>uv.lock</code>`,
            R`<code>.python-version</code>`,
            R`<code>.venv/</code>`,
            R`<code>data/asnr/</code> (a szkripttel előállított CSV-k)`
          ],
          answer: [0, 1, 2],
          hint: "Ami a környezet és az adat receptje, az kell. Ami a receptből bármikor újra előállítható, az nem.",
          explain: R`A <code>pyproject.toml</code> (mit kérsz), a <code>uv.lock</code> (pontosan mit kaptál) és a <code>.python-version</code> együtt a környezet receptje. A <code>.venv/</code> nagy, gépfüggő, és a <code>uv sync</code> újraépíti. A <code>data/asnr/</code>-t az exportszkript bármikor újra előállítja, ezért a <code>.gitignore</code>-ba kerül. A lock-fájlt kihagyni a tipikus hiba: nélküle a <code>pyproject.toml</code> csak kívánságlista.`
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a megfelelő uv-paranccsal!",
          pairs: [
            ["A 11. leckéhez kell a leidenalg a projektbe.", "uv add leidenalg"],
            ["Klónoztad a kolléga repóját, és futtatnád.", "uv sync"],
            ["Egyetlen ábrához kipróbálnád a seaborn-t.", "uv run --with seaborn python abra.py"],
            ["A pytest csak a tesztekhez kell.", "uv add --dev pytest"]
          ],
          hint: "Melyik parancs írja a pyproject.toml-t, melyik csak a lock-fájlból dolgozik, és melyik nem hagy nyomot?",
          explain: R`Az <code>uv add</code> felveszi a csomagot (pyproject + lock + telepítés), a <code>--dev</code> a fejlesztői csoportba teszi. Az <code>uv sync</code> a meglévő lock-fájlból építi fel a környezetet, ez kell klónozás után. Az <code>uv run --with</code> ideiglenes környezetet ad, a projekt fájljai nem változnak. Gyakori hiba a <code>pip install</code>: az a lock-fájlba nem kerül be, és a következő <code>uv sync</code> el is távolítja.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért használ a kurzus Python 3.12-t, és nem a legújabbat?",
          options: [
            "Mert 3.12-n a kurzus csomagjai mind kész kerékből telepíthetők, 3.14-en viszont nem (pl. a textnets).",
            "Mert a networkx 3.13-on és 3.14-en nem fut.",
            "Mert a 3.12 a legújabb Python-verzió.",
            "Mert az R csak a 3.12-vel tud adatot cserélni."
          ],
          answer: 0,
          hint: "Mit jelent, ha egy csomagnak nincs kereke (wheel) a Python-verziódhoz?",
          explain: R`Kerék nélkül a <code>uv</code> forrásból fordítana, ami lassú és gyakran elbukik. A <code>uv pip compile --only-binary :all:</code> próbája szerint 3.12-n minden kurzuscsomagnak van kereke (a <code>netbone</code> és az <code>rpy2</code> eleve csak forrásként létezik), 3.14-en a <code>textnets</code>-nek nincs. A <code>networkx</code> tiszta Python, minden verzión fut. A 3.12 nem a legújabb (2026-ban a 3.14 az). Az R-rel fájlokon (CSV) keresztül cserélünk adatot, ehhez nem kell egyező verzió.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az <code>uv add netbone</code> feloldhatatlan ütközéssel leáll. Mi a jó megoldás?`,
          options: [
            R`Külön, eldobható környezetben futtatni: <code>uv run --isolated --no-project --python 3.12 --with netbone …</code>`,
            R`A fő környezetben visszalépni <code>networkx==2.8.8</code>-ra és <code>scipy==1.13.0</code>-ra.`,
            R`<code>pip install netbone</code>-nal a <code>.venv</code>-be telepíteni, megkerülve a <code>uv</code>-t.`,
            R`Python 3.14-re váltani, mert ott újabb <code>netbone</code> van.`
          ],
          answer: 0,
          hint: "A netbone pontos régi verziókat kér. Megéri ezért az egész kurzust régi csomagokra állítani?",
          explain: R`A <code>netbone 0.2.3</code> pontos régi verziókat rögzít (<code>networkx==2.8.8</code>, <code>scipy==1.13.0</code>, <code>matplotlib==3.6.0</code>). Ezek a projekt többi követelményével nem férnek össze. A külön környezet a projektet nem érinti, az adat CSV-n át megy. A visszalépés az egész kurzust egy 2022-es <code>networkx</code>-re kényszerítené. A <code>pip install</code> szétrombolja a lock-fájl és a környezet összhangját, és a következő <code>uv sync</code> úgyis kiveszi. 3.14-re pedig egyáltalán nincs <code>netbone</code>: az egyetlen kiadása 3.12-ig fut.`
        }
      ]
    },

    /* ------------------------------------------------ 0.2 */
    "sna0-2": {
      title: "Ellenőrző kvíz – 0.2 Jegyzetfüzet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Jupyterben a cellák: A: <code>n = 16</code>, B: <code>n = n - 1</code>, C: <code>print(n)</code>. Újraindított kernel után a sorrend: A, B, B, C. Mit ír ki a C?`,
          options: ["14", "15", "16", R`<code>NameError</code>`],
          answer: 0,
          hint: "Kövesd végig a kernel állapotát futtatásról futtatásra.",
          explain: R`A: $n = 16$; B: $15$; B újra: $14$; C kiírja: <b>14</b>. A 15-öt az várná, aki a füzet szövegét olvassa: ez a rejtett állapot. 16 akkor lenne, ha a B nem futott volna. <code>NameError</code> akkor jönne, ha az A nem futott volna.`
        },
        {
          type: "single", shuffle: true,
          q: "Ugyanez a füzet: újraindított kernel után rögtön a B cellát futtatod. Mi történik?",
          options: [
            R`<code>NameError: name 'n' is not defined</code>`,
            R`Az <code>n</code> értéke −1 lesz.`,
            "A Jupyter magától lefuttatja előbb az A-t.",
            R`Az <code>n</code> értéke 15 lesz, mert a füzetben ott az A.`
          ],
          answer: 0,
          hint: "A kernel csak arról tud, amit lefuttattál. Hol jön létre az n?",
          explain: R`Az <code>n</code>-et csak az A hozza létre. A Jupyter nem nézi a cellák közti függőséget, ezért a B hibát ad. A „magától lefuttatja” a marimo viselkedése lenne. A „−1” azt feltételezné, hogy a nem létező változó 0.`
        },
        {
          type: "single", shuffle: true,
          q: R`Marimóban a B cellába ezt írod: <code>n = n - 1</code> (az A-ban <code>n = 16</code> áll). Mi történik?`,
          options: [
            R`Hibát kapsz (<code>multiple-definitions</code>): az <code>n</code>-et már az A definiálja.`,
            "A C 15-öt ír ki, és minden rendben.",
            "Minden futtatásnál eggyel csökken az n, ahogy a Jupyterben.",
            R`A marimo átnevezi a B változóját <code>n_2</code>-re.`
          ],
          answer: 0,
          hint: "Marimóban egy nevet hány cella definiálhat?",
          explain: R`Marimóban minden (nem <code>_</code>-sal kezdődő) nevet pontosan egy cella definiálhat, különben nem lenne egyértelmű a függőségi sorrend. A javítás egy új név (<code>m = n - 1</code>). Csendes átnevezés nincs, és az önmagát módosító cella éppen a Jupyter rejtett állapotának forrása, amit a marimo kizár.`
        },
        {
          type: "multi", shuffle: true,
          q: "Melyik igaz a marimo-füzetre? (Több jó válasz is lehet.)",
          options: [
            R`Sima <code>.py</code> fájl, szkriptként is futtatható.`,
            "Ha egy cellát módosítasz, a tőle függő cellák maguktól újrafutnak.",
            "A cellák futási sorrendjét a helyük adja a füzetben.",
            "Egy változót több cella is definiálhat, az utolsó nyer.",
            R`Ha egy másik cellában <code>G.add_edge(…)</code>-t hívsz, a <code>G</code>-t használó cellák maguktól újrafutnak.`
          ],
          answer: [0, 1],
          hint: "A marimo a neveket követi: ki definiál és ki használ. A tartalmuk változását is?",
          explain: R`A marimo-füzet <code>.py</code> fájl (<code>uv run python leckek/x.py</code>), és reaktív. A sorrendet a függőségek adják, nem a hely. Egy név csak egy cellában definiálható. A helyben módosított objektumot (<code>G.add_edge</code>) a marimo <b>nem</b> követi, mert az nem új név. Ezért az átalakítás kerüljön abba a cellába, amelyik a <code>G</code>-t létrehozza, vagy adjon vissza új objektumot.`
        }
      ]
    },

    /* ------------------------------------------------ 0.3 */
    "sna0-3": {
      title: "Ellenőrző kvíz – 0.3 Hálózati adat CSV-ben",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy irányítatlan, 0/1-es szomszédsági mátrix celláinak összege 40, az átló üres. Hány éle van a hálónak?",
          options: ["20", "40", "80", "10"],
          answer: 0,
          hint: "Egy irányítatlan él hány cellában jelenik meg?",
          explain: R`Minden irányítatlan él két cellában szerepel ($(i,j)$ és $(j,i)$), ezért $40/2 = 20$. (Ez a Padgett-féle házassági háló.) A 40 irányított háló esetén lenne helyes. A 80 a kétszerezés a felezés helyett, a 10 a kétszeres felezés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy szimmetrikus, súlyozott mátrixban (közös projektek száma) 6 nem nulla cella van, a cellák összege 12. Hány <b>kapcsolat</b> van?`,
          options: ["3", "6", "12", "4"],
          answer: 0,
          hint: "A kapcsolatokat a nem nulla cellák adják, nem az értékek összege.",
          explain: R`Hat nem nulla cella egy szimmetrikus mátrixban $6/2 = 3$ kapcsolat. A $12/2 = 6$ a <em>súlyok</em> összege (közös projektek), nem a kapcsolatok száma: ez a leggyakoribb tévedés. A 12 a felezést is kihagyja. A 4 a csúcsok száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az élista: <code>Anna,Bence</code> · <code>Anna,Csaba</code> · <code>Bence,Csaba</code>. A csoportnak Dóra is tagja, de neki nincs kapcsolata. Hány csúcsa lesz a <code>nx.from_pandas_edgelist</code>-tel épített gráfnak?`,
          options: ["3", "4", "6", "2"],
          answer: 0,
          hint: "Honnan tudhatná az élista, hogy Dóra létezik?",
          explain: R`Az élistából épített gráf csak az éllel rendelkező csúcsokat ismeri: Anna, Bence, Csaba. Dóra kimarad, pedig a háló 4 tagú. Ezért kell csúcslista és <code>G.add_nodes_from(…)</code>. Ugyanígy hiányzik a Pucci család a <code>networkx</code> beépített firenzei hálójából. A 6 a „csúcsok előfordulásainak” száma az élistában.`
        },
        {
          type: "single", shuffle: true,
          q: "Négy gyerek életkora: 12, 12, 13, −99, ahol a kódkönyv szerint −99 = hiányzó. Mennyi a helyes átlagéletkor?",
          options: ["≈ 12,33 év", "−15,5 év", "9,25 év", "12 év"],
          answer: 0,
          hint: "A hiánykód nem adat. Hány ismert életkorral számolsz?",
          explain: R`A −99-et hiányzónak (<code>NaN</code>) kell venni: $(12 + 12 + 13)/3 \approx 12{,}33$. A $-15{,}5 = (12 + 12 + 13 - 99)/4$ a kódot számként kezeli. A $9{,}25 = 37/4$ a hiányt 0-nak veszi, de a nevezőben meghagyja. A 12 a három ismert érték <em>mediánja</em>, nem az átlaga.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy irányított „kitől kérsz tanácsot?” mátrixban (sor kér, oszlop ad) hol olvasod le, hányan kérnek tanácsot Annától?`,
          options: [
            "Anna oszlopának összegéből.",
            "Anna sorának összegéből.",
            "Anna sorának és oszlopának összegéből, osztva kettővel.",
            "Az átló Anna-cellájából."
          ],
          answer: 0,
          hint: "Az (i, j) cella: i kér j-től. Annától kérni azt jelenti, hogy Anna van a j helyén.",
          explain: R`Aki Annától kér, annak a sorában Anna oszlopában áll 1. Ezért Anna <b>oszlopának</b> összege adja (a példában 3: Bence, Csaba, Dóra). Anna <b>sorának</b> összege azt mutatja, ő hány embertől kér (1). A kettő átlaga értelmetlen keverék. Az átló az önhurkok helye.`
        }
      ]
    },

    /* ------------------------------------------------ 0.4 */
    "sna0-4": {
      title: "Ellenőrző kvíz – 0.4 A könyv adatkészletei Pythonban",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Honnan jutsz hozzá a könyv (ASNR, 2022) adatkészleteihez?",
          options: [
            R`A könyv weboldaláról letölthető <code>xUCINET_0.0.2.0020.tar.gz</code> fájlból.`,
            R`A CRAN-ról: <code>install.packages("xUCINET")</code>.`,
            R`A GitHubról: <code>stephenborgatti/xucinet</code> (2.0).`,
            R`A PyPI-ról: <code>uv add xucinet</code>.`
          ],
          answer: 0,
          hint: "A könyv maga a CRAN-t írja. Működik ez ma? És melyik kiadáshoz készült a GitHubos csomag?",
          explain: R`A csomag a weboldal szerint sem a CRAN-on, sem a GitHubon nem érhető el, csak <code>.tar.gz</code>-ként. Ezért a könyv 5.4.1-ben leírt <code>install.packages("xUCINET")</code> ma hibát ad. A GitHubos <code>xucinet</code> 2.0 a 2. kiadáshoz készült, nulláról újraírva, más függvény- és adatkészletnevekkel. Python-csomag nincs.`
        },
        {
          type: "single", shuffle: true,
          q: R`A csomag <code>data/</code> mappájában 52 <code>.rda</code> fájl van. Hány közülük valódi adatkészlet (adatprojekt vagy tábla)?`,
          options: ["26", "52", "25", "51"],
          answer: 0,
          hint: R`Nézd meg a neveket: mit jelent az <code>ASNR_Fig…</code> és a <code>MAT_…</code> előtag?`,
          explain: R`$52 = 26 + 25 + 1$: 26 adatkészlet, 25 ábraadat (<code>ASNR_Fig09x4</code> = a 9.4. ábra kis hálója) és egy mátrixpélda (<code>MAT_12_5</code>). A 25 az ábrák száma, az 51 a mátrixpélda kihagyásával kapott szám.`
        },
        {
          type: "match",
          q: "Párosítsd a könyvbeli adatkészletnevet a csomagbeli mappanévvel!",
          pairs: [
            ["Johnson CitiesUS", "Borgatti_Cities"],
            ["Savage TradePre29", "Savage_TransactionFlows"],
            ["Knecht Class12h", "Knecht_Class12b"],
            ["Padgett FlorentineFamilies", "Padgett_FlorentineFamilies"]
          ],
          hint: "Keresd a tartalmat: 9 amerikai város távolsága; 15 ország kereskedelme 1929 előtt; 26 iskolás gyerek.",
          explain: R`A könyv adatlistájának nevei nem mindig egyeznek a csomagéval. A „CitiesUS” a <code>Borgatti_Cities</code> (9 város közúti távolsága). A „TradePre29” a <code>Savage_TransactionFlows</code> (15 ország, 1929 előtt). A „Class12h” a <code>Knecht_Class12b</code>: 26 gyerek, 17 lány, ahogy a könyv írja. A Padgett-adatnál csak az írásmód más.`
        },
        {
          type: "single", shuffle: true,
          q: R`A <code>Wolfe_Primates</code> <code>NetworkInfo</code>-ja szerint a <code>Kinship</code> háló irányítatlan, de a mátrix nem szimmetrikus. Mit teszel?`,
          options: [
            "Az adatnak hiszek: elolvasom a leírást, és tudatosan döntök, hogy irányítottként elemzem vagy szimmetrizálom.",
            "A metaadatnak hiszek, és csak a felső háromszöget használom.",
            "Törlöm a nem kölcsönös kapcsolatokat, mert azok hibák.",
            "Kihagyom az adatkészletet, mert hibás."
          ],
          answer: 0,
          hint: "Melyik a mérvadó: a mátrix vagy a róla írt felirat?",
          explain: R`A rokonság szülő → utód irányban van kódolva (15 nyíl, egyik sem kölcsönös). A metaadat címkéje hibás, az adat nem. A felső háromszög a nyilak egy részét (itt 6-ot) csendben eldobná. Ezt a hibát a mi <code>to_networkx</code>-ünk első változata is elkövette. A nem kölcsönös kapcsolatok törlése mind a 15-öt eltüntetné. Az adatkészlet használható, csak tudni kell róla.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az exportszkript miért a <code>rdata.parser.parse_data(bájtok)</code> függvényt használja, és nem a <code>rdata.read_rda(útvonal)</code>-t?`,
          options: [
            R`Mert az <code>.rda</code> fájlokat közvetlenül a <code>.tar.gz</code>-ből olvassa, kicsomagolás nélkül, ezért nincs hozzájuk útvonal.`,
            R`Mert a <code>read_rda</code> csak R telepítése mellett működik.`,
            R`Mert a <code>parse_data</code> gyorsabban olvas CSV-t.`,
            R`Mert a <code>read_rda</code> elveszíti a címkéket.`
          ],
          answer: 0,
          hint: "Hol vannak a fájlok a lemezen az export idején?",
          explain: R`A szkript a <code>tarfile</code>-lal a tömörített csomag tagjait bájtokként olvassa ki. Útvonal hiányában ezeket a <code>parse_data</code> kapja meg, a <code>convert</code> pedig Python-objektummá alakítja. Az <code>rdata</code> tiszta Python: egyik függvényéhez sem kell R. CSV-t nem olvas. A címkéket mindkét út megtartja.`
        }
      ]
    },

    /* ------------------------------------------------ 0.5 */
    "sna0-5": {
      title: "Ellenőrző kvíz – 0.5 R, csak ahol muszáj",
      questions: [
        {
          type: "multi", shuffle: true,
          q: "Mely feladatokhoz kell a kurzusban R? (Több jó válasz is lehet.)",
          options: [
            "ERGM (exponenciális véletlengráf-modell)",
            "SAOM (szereplőorientált hálózatdinamikai modell)",
            "A könyv adatainak CSV-be exportálása",
            "Fokszám- és közöttiség-centralitás",
            "QAP-regresszió"
          ],
          answer: [0, 1],
          hint: "Hol nincs érett Python-megfelelő? És mit oldottunk meg a 0.4-ben R nélkül?",
          explain: R`ERGM-hez (<code>statnet</code>/<code>ergm</code>) és SAOM-hoz (<code>RSiena</code>) nincs érett Python-csomag, ezek R-ben maradnak (16. lecke). Az exportot az <code>rdata</code> R nélkül megoldja. A centralitás a <code>networkx</code>-ben van. A QAP-ot <code>numpy</code>-ban magunk írjuk meg (15. lecke), az R-es <code>sna::netlm</code> legfeljebb ellenőrzésre kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az <code>xUCINET</code> telepítése ezzel áll le: <code>unable to load shared object '…/igraph/libs/igraph.so': libglpk.so.40: cannot open shared object file</code>. Mi a teendő?`,
          options: [
            R`Telepíteni a hiányzó rendszerkönyvtárat: <code>sudo apt install libglpk40</code>, majd újrapróbálni.`,
            R`Az <code>xUCINET</code> helyett a GitHubos <code>xucinet</code> 2.0-t telepíteni.`,
            R`<code>install.packages("igraph")</code>-ot futtatni még egyszer.`,
            "Python 3.12-re váltani."
          ],
          answer: 0,
          hint: R`Melyik fájlt nem találja a rendszer? R-csomag az, vagy Linux-könyvtár?`,
          explain: R`Az <code>igraph</code> R-csomag lefordított része a GLPK nevű Linux-könyvtárat használja (<code>libglpk.so.40</code>), és ez hiányzik. Az <code>apt install libglpk40</code> pótolja (forrásból fordításhoz a <code>libglpk-dev</code> kell). Az <code>igraph</code> újratelepítése ugyanígy elakadna. A 2.0 más csomag, és ugyanúgy <code>igraph</code>-ra épül. A Python-verziónak ehhez semmi köze.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Python- és az R-export összevetése: „105 mátrix összevetve, 0 eltérés”. Mit jelent ez?`,
          options: [
            R`Hogy a két út cellára ugyanazt az adatot adja, tehát a Python-exportban megbízhatsz.`,
            "Hogy a könyv adatai hibátlanok.",
            "Hogy a könyv összes kinyomtatott eredménye reprodukálható Pythonban.",
            "Hogy az R-re a továbbiakban egyáltalán nincs szükség."
          ],
          answer: 0,
          hint: "Mit hasonlítottunk össze mivel? Mit nem vizsgált ez az összevetés?",
          explain: R`Az összevetés két <em>exportot</em> hasonlít össze: azt igazolja, hogy az <code>rdata</code> ugyanazt olvassa ki, mint maga az R. Arról nem mond semmit, hogy az adat helyes-e: a metaadat-hibák (0.4) mindkét exportban benne vannak. Az eredmények reprodukálása leckéről leckére történik. Az R a 16. leckéhez (ERGM, SAOM) továbbra is kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ubuntun a <code>install.packages(c("statnet", "RSiena"))</code> percekig fordít. Hogyan gyorsíthatod?`,
          options: [
            R`A Posit Public Package Manager (P3M) bináris tárolójával: <code>options(repos = c(CRAN = "https://p3m.dev/cran/__linux__/noble/latest"))</code>, a megfelelő <code>HTTPUserAgent</code> beállítással.`,
            R`<code>uv add statnet RSiena</code>-val.`,
            R`A <code>rpy2</code> telepítésével.`,
            "Sehogy: R-csomag Linuxon csak forrásból telepíthető."
          ],
          answer: 0,
          hint: "Pythonban a kerék a megoldás. Mi lehet ennek az R-es párja Linuxon?",
          explain: R`A CRAN Linuxra forráscsomagot ad, ezért fordít. A P3M előre lefordított, Ubuntu-verzióhoz (<code>noble</code> = 24.04) igazított binárisokat ad, ha az R a <code>HTTPUserAgent</code>-ben elküldi a saját verzióját és platformját. Ugyanaz a gondolat, mint a Python-kerekeknél. Az <code>uv</code> Python-csomagkezelő, R-csomagot nem telepít. Az <code>rpy2</code> csak R-t hív Pythonból, a telepítést nem gyorsítja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ubuntu 24.04-en <code>sudo apt install r-base</code> után az <code>xUCINET</code> és a <code>statnet</code> települ, de az <code>install.packages("RSiena")</code> ezt írja: <em>package 'RSiena' is not available for this version of R</em>. Mi a teendő?`,
          options: [
            "Friss R-t telepíteni a CRAN Ubuntu-tárából, mert az Ubuntu saját R-je (4.3.3) túl régi az RSiena 1.6.6-hoz (R ≥ 4.5).",
            R`Az <code>RSiena</code>-t a <code>xUCINET</code>-hez hasonlóan egy letöltött <code>.tar.gz</code>-ből telepíteni.`,
            R`A P3M helyett a CRAN-ról telepíteni, mert a P3M-en nincs <code>RSiena</code>.`,
            R`Az <code>RSiena</code>-t <code>uv add RSiena</code>-val Python-csomagként felvenni.`
          ],
          answer: 0,
          hint: "A hibaüzenet a te R-verziódra panaszkodik, nem a csomagtárra.",
          explain: R`Az <code>RSiena</code> 1.6.6 R&nbsp;≥&nbsp;4.5.0-t kér, az Ubuntu 24.04 saját <code>r-base</code>-e pedig a 4.3.3. Kipróbáltuk: a CRAN Ubuntu-tárából R 4.6.2 jön, és azzal települ. A forrásfájlból telepítés ugyanúgy elbukna a verziókövetelményen. A P3M-en megvan a csomag, csak a te R-edhez nincs kompatibilis változat. Az <code>uv</code> Python-csomagkezelő.`
        }
      ]
    },

    /* ------------------------------------------------ 0.6 */
    "sna0-6": {
      title: "Ellenőrző kvíz – 0.6 A saját segédmodul",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mit ad a <code>to_networkx(load_project("Padgett_FlorentineFamilies").networks["Marriage"])</code> gráfjára a <code>(csúcsszám, élszám, a Medici fokszáma)</code>?`,
          options: ["(16, 20, 6)", "(15, 20, 6)", "(16, 40, 12)", "(16, 20, 5)"],
          answer: 0,
          hint: "Az izolált Pucci család benne marad? Egy irányítatlan él hány élnek számít?",
          explain: R`A <code>to_networkx</code> az élek előtt minden csúcsot hozzáad, így a Pucci is bekerül: 16 csúcs. Az él 20 (40 nem nulla cella, felezve). A Medici fokszáma 6, ahogy az ASNR 9.3.4 írja. A 15 csúcs a <code>networkx</code> beépített gráfja (élistából épült). A 40 és a 12 a felezés elmaradása.`
        },
        {
          type: "single", shuffle: true,
          q: R`A <code>Knecht_Class12b</code> <code>FriendshipT3</code> mátrixában 133 egyes, 50 kilences és 51 tízes van (a többi 0). Mit ad a <code>to_networkx</code>?`,
          options: [
            R`Egy 234 nyilas irányított gráfot, amelyből 101 hamis (9-es és 10-es „súlyú”) nyíl.`,
            R`<code>ValueError</code>-t, mert hiányzó érték van a mátrixban.`,
            "Egy 133 nyilas gráfot, mert a 9-et és a 10-et magától kihagyja.",
            "Egy 117 élű irányítatlan gráfot."
          ],
          answer: 0,
          hint: R`A függvény a <code>NaN</code>-t ismeri fel. Honnan tudhatná, hogy a 9 itt nem súly?`,
          explain: R`A <code>to_networkx</code> csak a <code>NaN</code>-ra dob hibát. A 9 és a 10 egyszerű számok, lehetnének valódi súlyok is. Így $133 + 50 + 51 = 234$ nyíl lesz, ebből 101 hamis. Ez ellen a <code>check_matrix</code> véd: az értékkészletben ott a 9 és a 10. A 117 a $234/2$, de a mátrix nem szimmetrikus, így a gráf irányított lesz.`
        },
        {
          type: "single", shuffle: true,
          q: R`A <code>leckek/03.py</code>-ban a <code>from sna_utils import load_project</code> sor <code>ModuleNotFoundError</code>-t ad, pedig a <code>sna_utils/__init__.py</code> megvan. Mi a legvalószínűbb ok?`,
          options: [
            R`Hiányzik a <code>[build-system]</code> és a <code>[tool.uv.build-backend]</code> blokk a <code>pyproject.toml</code>-ból, így a csomag nincs a környezetbe telepítve.`,
            R`A <code>sna_utils</code> mappanévben aláhúzás van, amit a Python nem enged.`,
            R`A <code>leckek/</code> mappába is kell egy <code>__init__.py</code>.`,
            R`A <code>load_project</code> függvény neve foglalt a <code>pandas</code>-ban.`
          ],
          answer: 0,
          hint: R`Honnan keresi a Python az importokat, ha a <code>leckek/x.py</code>-t futtatod?`,
          explain: R`A <code>uv run python leckek/03.py</code> a <code>leckek/</code> mappában keres, nem a gyökérben. A <code>sna_utils</code> csak akkor érhető el bárhonnan, ha a <code>uv</code> szerkeszthető csomagként telepíti a környezetbe, ehhez kell a build-blokk. Az aláhúzás megengedett a modulnevekben. A <code>leckek/__init__.py</code> a <code>leckek</code>-ből csinálna csomagot, a <code>sna_utils</code>-t nem találná meg tőle. Névütközés nincs.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért a könyv kinyomtatott számát írjuk a tesztbe (pl. <code>assert G.degree["MEDICI"] == 6</code>), és nem a saját kódunk kimenetét?`,
          options: [
            "Mert a könyv száma független forrás: ha egyezik vele, az a kódunkat és az adatunkat is igazolja.",
            "Mert a saját kód kimenete minden futtatásnál más.",
            "Mert a pytest csak egész számokat tud összehasonlítani.",
            "Mert így gyorsabban fut a teszt."
          ],
          answer: 0,
          hint: "Mi történik, ha a kódod már most hibás, és a kimenetét másolod a tesztbe?",
          explain: R`A saját kimenet bemásolása a jelenlegi állapotot rögzíti, a hibákkal együtt. A teszt így csak a <em>változást</em> jelezné, a hibát nem. A könyv száma külső mérce. A kód kimenete determinisztikus, nem változik futtatásról futtatásra. A pytest bármit összehasonlít (tizedestörtnél tűréssel). Sebességben nincs különbség.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "sna0-final": {
      title: "Fejezetzáró teszt – 0. fejezet",
      questions: [
        {
          type: "match",
          q: "A Medici család normalizált közelségi centralitása háromféleképpen. Párosítsd az eredményt az eredetével!",
          pairs: [
            ["0,560", "networkx beépített gráf (15 család, a Pucci nélkül)"],
            ["0,523", "ASNR-adat (16 család), nx.closeness_centrality alapbeállítással"],
            ["0,484", "ASNR-adat (16 család), a könyv konvenciója (elérhetetlen = legnagyobb távolság + 1)"]
          ],
          hint: "A 15 csúcsú hálóban mindenki elérhető. A 16 csúcsúban a Pucci nem: ott a konvenció dönt.",
          explain: R`15 csúcson: $14/25 = 0{,}56$. 16 csúcson a <code>networkx</code> kihagyja az elérhetetlen Puccit, és az elért csúcsok arányával szoroz: $(14/25) \cdot (14/15) \approx 0{,}523$. A könyv a Pucci távolságát $5 + 1 = 6$-nak veszi: $15/31 \approx 0{,}484$. Egy hálózati szám = adat + definíció + konvenció.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Medici-távolságok: 6 család 1, 5 család 2, 3 család 3 lépésre, a Pucci elérhetetlen ($n = 16$). Mennyi a normalizált közelség, ha a Pucci távolságát <b>16</b>-nak vesszük (a könyv 6-osa helyett)?`,
          options: ["≈ 0,366", "≈ 0,390", "0,600", "≈ 0,484"],
          answer: 0,
          hint: R`Távolságösszeg: $6 \cdot 1 + 5 \cdot 2 + 3 \cdot 3 + 1 \cdot ?$; a számláló $n - 1$.`,
          explain: R`$6 + 10 + 9 + 16 = 41$, és $15/41 \approx 0{,}366$. A $16/41 \approx 0{,}390$ a számlálóba $n$-et ír $n - 1$ helyett. A $15/25 = 0{,}6$ a Puccit kihagyja, de a számlálóban 15 marad. A 0,484 a könyv eredeti konvenciója (6-os távolság).`
        },
        {
          type: "single", shuffle: true,
          q: R`Jupyterben (A: <code>n = 16</code>, B: <code>n = n - 1</code>, C: <code>print(n)</code>) a sorrend újraindított kernel után: A, C, B, B, C. Mit ír ki a <b>második</b> C?`,
          options: ["14", "15", "16", "13"],
          answer: 0,
          hint: "Az első C a B-k előtt fut. Hányszor fut le a B a második C előtt?",
          explain: R`A: 16; C: kiír 16-ot; B: 15; B: 14; C: kiír <b>14</b>-et. A 15 egyetlen B-futással jönne ki, a 16 az első C kiírása, a 13 egy harmadik B-vel.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy irányított, 0/1-es mátrix (21 menedzser, „kitől kérsz tanácsot?”) celláinak összege 190. Hány nyíl van a hálóban?",
          options: ["190", "95", "380", "21"],
          answer: 0,
          hint: "Irányított hálóban kell-e felezni?",
          explain: R`Irányított hálóban minden nem nulla cella egy nyíl: 190 (Krackhardt <code>Advice</code>). A 95 a felezés, ami csak irányítatlan hálóban helyes. A 380 a kétszerezés, a 21 a csúcsok száma.`
        },
        {
          type: "multi", shuffle: true,
          q: R`A <code>check_matrix</code> egy barátsághálóra: <code>{'méret': (26, 26), 'értékek': [0.0, 1.0, 9.0, 10.0], 'szimmetrikus': False, 'átló összege': 28.0}</code>. Mely következtetések helyesek? (Több jó válasz is lehet.)`,
          options: [
            "A 9 és a 10 valószínűleg hiánykód; meg kell nézni a leírást.",
            "Az átlón is vannak nem nulla értékek, ami gyanús.",
            "A háló lehet irányított, ami egy barátsághálónál (jelölés) természetes.",
            "A háló súlyozott: vannak 10-es erősségű barátságok.",
            "Az adat rendben van, rögtön építhető belőle gráf."
          ],
          answer: [0, 1, 2],
          hint: "Egy 0/1-es kérdésre (barát-e?) milyen értékek várhatók? Mi legyen az átlón?",
          explain: R`A Knecht-adatban 9 = hiányzó, 10 = szerkezeti hiány. Ezt az <code>info.json</code> írja le, a mátrixból csak gyanítható. Az átló 28-as összege is kódokból jön. Az aszimmetria rendben van: ki kit nevez meg barátjának, az irányított jelölés. A „10-es erősségű barátság” a kódot súlynak olvassa. Gráfot csak a kódok kezelése után szabad építeni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik <b>nem</b> kerül a futó projekt git-tárába?`,
          options: [
            R`<code>data/asnr/</code>`,
            R`<code>uv.lock</code>`,
            R`<code>scripts/asnr_export.py</code>`,
            R`<code>tests/test_asnr.py</code>`
          ],
          answer: 0,
          hint: "Ami bármikor újra előállítható, azt nem tároljuk; a receptet igen.",
          explain: R`A <code>data/asnr/</code>-t az exportszkript a letöltött csomagból bármikor újra előállítja. A gitbe a recept kerül: a lock-fájl (környezet), a szkript (adat) és a tesztek (ellenőrzés).`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért nem a <code>networkx</code> beépített <code>florentine_families_graph()</code>-ját használjuk a könyv eredményeinek reprodukálásához?`,
          options: [
            "Mert élekből épül, és így hiányzik belőle az izolált Pucci család: 15 csúcsa van a könyv 16-ja helyett.",
            "Mert más házassági kapcsolatok vannak benne.",
            "Mert irányított gráf.",
            "Mert súlyozott, a könyvé pedig 0/1-es."
          ],
          answer: 0,
          hint: "Hasonlítsd össze a csúcs- és az élszámot a két változatban.",
          explain: R`Mindkettőben 20 él van, ugyanazok a házasságok, irányítatlanul és súly nélkül. A különbség egyetlen csúcs: a Pucci, akinek nincs éle, ezért az élistából épített gráfból kimarad. Ez minden olyan mértéket megváltoztat, amely a csúcsok számával számol (sűrűség, közelség).`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik kurzuscsomagot <b>nem</b> szabad a projekt fő környezetébe felvenni, és miért?`,
          options: [
            R`A <code>netbone</code>-t, mert régi <code>networkx</code>-, <code>scipy</code>- és <code>matplotlib</code>-verziókat rögzít.`,
            R`A <code>leidenalg</code>-ot, mert C++ kódot tartalmaz.`,
            R`A <code>rdata</code>-t, mert R-t igényel.`,
            R`A <code>marimo</code>-t, mert ütközik a Jupyterrel.`
          ],
          answer: 0,
          hint: "Melyik csomag kér pontos (==) régi verziókat?",
          explain: R`A <code>netbone 0.2.3</code> pontos régi verziókat kér (<code>networkx==2.8.8</code> …), ezért külön, eldobható környezetben fut. A <code>leidenalg</code>-nak kész kereke van, a C++ nem gond. Az <code>rdata</code> tiszta Python, nem kell hozzá R. A <code>marimo</code> és a Jupyter megfér egymás mellett.`
        },
        {
          type: "single", shuffle: true,
          q: R`A könyv 6. fejezete a „Johnson CitiesUS” adatot használja. Melyik mappát nyitod meg az exportban?`,
          options: [
            R`<code>data/asnr/Borgatti_Cities/</code>`,
            R`<code>data/asnr/Johnson_CitiesUS/</code>`,
            R`<code>data/asnr/Greenacre_DoctoratesByYearAndField/</code>`,
            "Egyiket sem: ez az adat nincs a csomagban."
          ],
          answer: 0,
          hint: "A könyvbeli és a csomagbeli nevek nem mindig egyeznek. Melyik adat tartalmaz városok közti távolságot?",
          explain: R`A <code>Borgatti_Cities</code> 9 amerikai város közúti távolságát tartalmazza: ez a könyv „CitiesUS” adata, más néven. <code>Johnson_CitiesUS</code> mappa nincs. A <code>Greenacre</code> a 6. fejezet másik adata (korrespondenciaelemzés). Ami valóban hiányzik a csomagból, az a Johnson PolarStation és a négy közösségimédia-adat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért mappa (<code>sna_utils/__init__.py</code>) a segédmodul, és nem egyetlen <code>sna_utils.py</code> a projekt gyökerében?`,
          options: [
            R`Hogy a <code>uv</code> szerkeszthető csomagként telepítse, és így a <code>leckek/</code> és a <code>tests/</code> mappából is importálható legyen.`,
            R`Mert a Python egyfájlos modult nem tud importálni.`,
            R`Mert a <code>pytest</code> csak mappát fogad el.`,
            R`Hogy a <code>sna_utils</code> ne kerüljön gitbe.`
          ],
          answer: 0,
          hint: R`Honnan keres importot az <code>uv run python leckek/x.py</code>?`,
          explain: R`A <code>leckek/</code>-ből futtatott füzet a <code>leckek/</code> mappában keresné a modult. A <code>uv_build</code> csomagmappát vár (<code>sna_utils/__init__.py</code>), és szerkeszthetően telepíti. Így bárhonnan importálható, és minden módosítás azonnal él. Egyfájlos modult a Python importál, ha a mappája a keresési úton van, itt éppen ez hiányzik. A gitbe a modul természetesen bekerül.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
