<!-- A Hálózatelemzés kurzus részletes terve. Forrás: Vault/Learning/Topics/Social network analysis/Hálózatelemzés TOC.md (2026-11-04). -->
# Hálózatelemzés – kurzusterv

> [!abstract] A kurzus célja
> A társadalmi hálózatelemzés (SNA) elméletének és módszertanának elsajátítása **Python** eszközökkel, úgy, hogy a végén önálló **Network Agenda Setting (NAS)** kutatást és **gráfalapú hírelemzést** tudj tervezni és lefuttatni. Minden lecke két kérdésre felel: *mit tanulunk az SNA-ból?* és *mire használjuk ezt a NAS-ban vagy a hírelemzésben?*

## Források és rövidítések

| Rövidítés | Mű | Szerep a kurzusban |
|---|---|---|
| **ASN** | Borgatti, Everett & Johnson: *Analyzing Social Networks* (2. kiad., epub) | Az SNA elméleti gerince (15 fejezet) |
| **ASNR** | Borgatti, Everett, Johnson & Agneessens: *Analyzing Social Networks Using R* (2022, pdf + OCR-szöveg: `…_ocr.txt`) | Gyakorlati párja az ASN-nek. A könyv a saját **`xUCINET`** R-csomagjára épül (a 15. fejezetben `statnet`/`ergm` és `RSiena` is). Az `xUCINET`-hívásokat **Pythonra fordítjuk**, a könyvből a módszertani magyarázatot, az adatkészleteket, a gyakorlófeladatokat és a **kinyomtatott numerikus eredményeket** használjuk |
| **PIN** | Guo & McCombs (szerk.): *The Power of Information Networks – New Directions for Agenda Setting* (2016) | A NAS elmélete, módszertana és esettanulmányai |
| **[n]** | Friss kutatások (Consensus-keresés, 2021–2026) | Lásd [[#Friss kutatások (Consensus)]] |

## Technikai alapelv: Python először, R csak ahol muszáj

| Feladat | Python (alapértelmezett) | R (csak ha nincs érett Python-megfelelő) |
|---|---|---|
| Gráfok, alapmértékek | `networkx`, `python-igraph` | – |
| Nagy hálózatok | `python-igraph`, `networkit`, `graph-tool` | – |
| Közösségkeresés | `networkx`, `leidenalg`, `infomap` | – |
| Mag–periféria | `cpnet` | – |
| Blokkmodellek | saját `numpy` (CONCOR, strukturális ekvivalencia, REGE) + **SBM**: `graph-tool` | `blockmodeling` (általánosított blokkmodellezés, csak összevetésre) |
| MDS, korrespondenciaelemzés, klaszterezés | `scikit-learn`, `prince`, `scipy` | – |
| Vizualizáció | `matplotlib`/`networkx`, `pyvis`, Gephi (GEXF export) | – |
| **QAP / MRQAP** | **saját `numpy` implementáció** (jó tanulási feladat) | `sna::qaptest`, `sna::netlm`, csak a saját kód ellenőrzésére |
| **ERGM** | nincs érett csomag | **`statnet`/`ergm`** (opcionálisan `rpy2`-vel hívva) |
| **SAOM** (hálózatdinamika) | nincs | **`RSiena`** |
| Relációs esemény- és DyNAM-modellek | nincs érett csomag | **`goldfish`** |
| Bipartit projekciók backbone-ja (SDSM/FDSM) | `netbone` (ellenőrizendő, mely modelleket tudja) | `backbone` (Neal) [B4] |
| Szövegfeldolgozás (magyarul is) | `spaCy` + **`huSpaCy`**, `gensim`, `BERTopic`, `sentence-transformers` | – |
| Idősorok (Granger, VAR, transzferentrópia) | `statsmodels`, `IDTxl`/`pyinform` | – |
| LLM-alapú kódolás | Anthropic SDK strukturált kimenettel, `krippendorff` a megbízhatósághoz | – |
| Diskurzus-hálózatelemzés | saját pipeline vagy a Java DNA-szoftver exportja | `rDNA` (opcionális) |

## ASNR → Python: az `xUCINET`-függvények megfelelői

Az OCR-szöveg „Overview of R functions used” függeléke alapján. Ahol „saját” szerepel, ott nincs kész Python-függvény. Ezeket a lecke részeként írjuk meg, és a könyvben kinyomtatott eredményekhez mérjük.

| ASNR-fejezet | `xUCINET`-függvények | Python-megfelelő |
|---|---|---|
| 5 Adatkezelés | `xCreateDataProject`, `xAddToDataProject`, `xDichotomize`, `xSymmetrize`, `xTranspose`, `xNormalize`, `xCombineRelations`, `xAttributeToMatrix`, `xImputeMissingData`, `xGeodesicDistance` | saját `DataProject` (szótár `numpy`-mátrixokkal + `pandas` attribútumtábla), `numpy`, `nx.floyd_warshall_numpy` |
| 6 Többváltozós | `xMDS`, `xCorrespondenceAnalysis`, `xHierarchicalClustering`, `xCorrelation` | `sklearn.manifold.MDS`, `prince.CA`, `scipy.cluster.hierarchy`, `numpy.corrcoef` |
| 8 Ego-hálózatok | `xTieComposition`, `xValuedTieComposition`, `xAlterCompositionCat/Cor`, `xEgoAlterSimilarityCat/Con`, `xEgonetStructure`, `xStructuralHoles` | `pandas` csoportosítás (saját), `nx.constraint`, `nx.effective_size`, `nx.ego_graph` |
| 9 Centralitás | `xDegreeCentrality`, `xEigenvectorCentrality`, `xClosenessCentrality`, `xBetweennessCentrality` | `networkx` |
| 9 Centralitás | `xBetaCentrality`, `xReachCentrality`, `xBetaReachCentrality`, `xPNCentrality`, `xInducedCentrality` | saját `numpy` (Bonacich-hatalom, k-lépéses elérés, PN-centralitás, indukált centralitás) |
| 10 Csoportszint | `xDensity`, `xReciprocity`, `xTransitivity`, `xCyclicality`, `xComponents`, `xConnectedness`, `xCompactness`, `xCentralization`, `xCorePeriphery` | `networkx` + saját (ciklikusság, fragmentáció, kompaktság, centralizáció), `cpnet` (Borgatti–Everett-modell) |
| 11 Alcsoportok | `xCliques`, `xCliqueComembership`, `xGirvanNewman`, `xFastGreedy`, `xWalkTrap`, `xLouvainMethod`, `xLabelProp` | `nx.find_cliques`, `nx.community.*`, `igraph.community_walktrap`, `leidenalg` |
| 12 Ekvivalencia | `xStructuralEquivalence`, `xBlockOptimize`, `xREGE` | saját `numpy` (profilkorreláció, blokk-optimalizálás, REGE) + `graph-tool` SBM |
| 13 Kétmódú adatok | `xTwoModeToOneMode`, `xTwoModeToBipartite`, `xBiCliques`, `xDualLouvainMethod`, `xDualCorePeriphery` | `numpy` (szorzat- és **minimum-módszer**), `networkx.bipartite`, saját bi-klikk és duális mag–periféria |
| 14 Statisztika | `xQAPCorrelation`, `xQAPRegression`, `xQAPLogisticRegression`, `xRegression`, `xAutoRegression` | saját `numpy` + `statsmodels` (permutációs keret, Y-permutáció, double semi-partialling, LRQAP, hálózati autoregresszió) |
| 15 ERGM/SAOM | `ergm`, `RSiena` | **R marad** |

## Adatkészletek

Az ASNR mintegy 25 adatkészlettel dolgozik, ezek mind az `xUCINET` csomagban vannak.
- **Egyszeri R-lépés (0. lecke):** az összes adatkészlet exportja CSV-be (mátrixok + attribútumok). Utána csak Pythonban dolgozunk.
- **Közvetlenül `networkx`-ben is elérhető:** Zachary karateklub, Padgett firenzei családok (csak a házassági háló), Davis Southern Women.
- **A leckékben használt fő adatkészletek:** Krackhardt HighTech, Padgett, Zachary, Sampson Monastery, Davis Southern Women, Hawthorne BankWiring, Borgatti Camp92, Johnson CitiesUS, Greenacre Doctorates, Baker Journals.

> [!tip] Kétlépcsős gyakorlat
> Minden módszertani lecke két lépésben gyakoroltat:
> 1. **Reprodukálás:** az ASNR példáját Pythonban, a könyv adatkészletén újra lefuttatod, és az eredményt a könyvben kinyomtatott számokkal veted össze. Az OCR-szövegben ezek kereshetők. Például: a walktrap a karateklubon 5 közösséget ad, 0,353-as modularitással.
> 2. **Átvitel:** ugyanazt a módszert a futó hírkorpuszra alkalmazod.
>
> Gyakorlófeladatként az ASNR fejezetvégi *Problems and exercises* részei is felhasználhatók.

> [!tip] Futó projekt
> A kurzus végig **egy közös hírkorpuszon** dolgozik, amely leckéről leckére épül: például magyar online hírportálok cikkei egy kiválasztott ügyről. Így a 2. leckében épített mátrix a 15. leckében QAP-tesztelt média-agendahálózat lesz, a 26. leckében pedig a záróprojekt alapja.

---

## I. rész: A hálózati gondolkodás alapjai

### 0. Munkakörnyezet és adatok (előkészítő)
- **Python-környezet:** `uv` vagy `conda`, Jupyter/marimo, a kurzus csomagjai (lásd a fenti táblázatot).
- **Egyszeri R-lépés:** az `xUCINET` telepítése, és az ASNR összes adatkészletének exportja CSV-be. Ugyanitt telepítjük a `statnet`-et és az `RSiena`-t is, a 16. leckéhez.
- **Saját segédmodul:** `sna_utils.py`, ebbe kerülnek a leckék során megírt, `xUCINET`-et kiváltó függvények.

### 1. Miért hálózatok? – SNA és agenda setting találkozása
- **Forrás:** ASN 1 · ASNR 1 · PIN Preface, PIN 1 (bevezető)
- **SNA:** csomópont és kapcsolat; a relációk típusai (hasonlóság, társas viszony, interakció, áramlás); az elemzés céljai; hálózati változó mint magyarázó és mint kimeneti változó.
- **NAS-kapcsolat:** Lippmann „képek a fejünkben” gondolata hálózatként; az asszociatív hálózati memóriamodell mint a NAS pszichológiai alapja. Az ügyek és attribútumok **csomópontok**, együttes előfordulásuk **kapcsolat**.
- **Gyakorlat:** első `networkx`-gráf egy kézzel kódolt 5 cikkes mini-korpuszból.

### 2. Matematikai alapok
- **Forrás:** ASN 2 · ASNR 2
- **SNA:** gráf, irányított és súlyozott gráf, út, komponens, szomszédsági mátrix, „ways and modes”, mátrixszorzatok.
- **NAS-kapcsolat:** a **dokumentum × ügy** előfordulási mátrixból (`X`) az ügy × ügy együtt-előfordulási hálózat `XᵀX`. Ez a NAS-mérés matematikai magja.
- **Python:** `numpy`, `scipy.sparse`, `networkx`.
- **ASNR-adat:** Hawthorne BankWiring (gráfok, utak), Borgatti Camp92 (szomszédsági mátrix), Davis Southern Women (kétmódú adat).
- **Gyakorlat:** a futó korpusz első mátrixa; ellenőrzés, hogy `XᵀX` diagonálisa az ügyek első szintű (objektum-)szalienciája.

### 3. Kutatási design – SNA és NAS
- **Forrás:** ASN 3 · ASNR 3 · PIN 1, PIN 3 (Carroll)
- **SNA:** teljes hálózat vs. személyes (ego) hálózat; csomópont- és kapcsolattípusok; szereplői attribútumok; mintavétel és határmegvonás (*boundary specification*); validitás, reliabilitás, etika.
- **NAS:** az agenda setting három szintje (objektum, attribútum, hálózat); Carroll **uniplex / duplex / multiplex** asszociációi; az objektum- és attribútumhálózatok határmegvonása (mi számít csomópontnak?); **explicit vs. implicit** közvélemény-agenda.

### 4. Adatgyűjtés – kérdőívtől a hírfolyamig
- **Forrás:** ASN 4 · ASNR 4 · PIN 2 (Guo: mind mapping)
- **SNA:** hálózati kérdések és kérdésformátumok, válaszadói terhelés, archív és elektronikus adatok.
- **NAS/hír:** tartalomelemzési kódkönyv (ügyek és attribútumok), kódolók közötti megbízhatóság (Krippendorff α); hírforrások (RSS, archívumok, GDELT, Media Cloud); a közönség oldala: **mind map** kérdőív, survey-alapú implicit hálózat, közösségi média mint „közvélemény-agenda”; jogi és etikai kérdések (szövegbányászati kivétel, GDPR).
- **Közösségi média (ASNR 4.7.1):** a könyv a `vosonSML` R-csomaggal négyféle hálót épít Twitter-, Reddit- és YouTube-adatból:
  - **szereplőháló:** felhasználók, közöttük említés, válasz vagy retweet;
  - **aktivitásháló:** posztok és kommentek, közöttük válaszkapcsolat;
  - **felhasználó × hashtag** kétmódú háló;
  - **szemantikus háló:** szavak együtt-előfordulása.

  Ez a négy háló a közönségagenda mérésének alaptípusai. Pythonban saját API-kliensekkel építjük fel őket (Reddit: `praw`, YouTube Data API). Az ASNR óta az X/Twitter API fizetőssé vált, ezt az adatforrás-választásnál figyelembe kell venni.
- **Gyakorlat:** kódkönyv-vázlat a futó projekt ügyéhez; 20 cikk kettős kódolása, α kiszámítása `krippendorff`-fal.

### 5. Adatkezelés és a szövegből hálózat pipeline
- **Forrás:** ASN 5 · ASNR 5
- **SNA:** adatformátumok (szomszédsági mátrix, élista, csúcslista, attribútumtábla; GraphML, GEXF). Transzformációk az ASNR 5.5 sorrendjében:
  - dichotomizálás;
  - relációk kombinálása;
  - transzponálás és szimmetrizálás;
  - hiányzó adatok kezelése;
  - normalizálás;
  - geodetikus távolság;
  - **csomópontok összevonása**.

  Ezt követi az attribútumok mátrixszá alakítása (ASNR 5.6).
- **NAS/hír:** az ASNR-transzformációk közvetlen megfelelői:
  - **csomópont-összevonás** = szinonimák és entitásváltozatok egyesítése („Orbán”, „miniszterelnök”, „kormányfő”);
  - **dichotomizálás** = küszöb az együtt-előfordulási súlyon. A küszöbválasztás érzékenységét külön vizsgáljuk.

  Emellett: az **együtt-előfordulás egysége** (mondat / bekezdés / cikk), súlyozás és normalizálás (nyers szám, Jaccard, PMI, koszinusz).
- **Az ASNR adatprojektje Pythonban:** egy saját `DataProject` osztály (hálózatok + attribútumok + metaadat) kiváltja az `xCreateDataProject`-et. Ezt használja a kurzus minden további leckéje.
- **Python:** `pandas`, `networkx`, `huSpaCy` (lemmatizálás, NER).
- **Gyakorlat:** reprodukálható pipeline: nyers cikkek → tisztított tokenek → `X` → súlyozott hálózat → GEXF.

---

## II. rész: Leíró hálózatelemzés

### 6. Többváltozós technikák
- **Forrás:** ASN 6 · ASNR 6
- **SNA:** többdimenziós skálázás (MDS), korrespondenciaelemzés (CA), hierarchikus klaszterezés.
- **NAS:** ügyek „kognitív térképe” MDS-sel (Guo, PIN 2); **orgánum × ügy** CA: melyik lap mely ügyekhez áll közel?
- **Python:** `sklearn.manifold.MDS`, `prince.CA`, `scipy.cluster.hierarchy`.
- **ASNR-adat:** Johnson CitiesUS (MDS, klaszterezés), Greenacre Doctorates (CA).

### 7. Vizualizáció
- **Forrás:** ASN 7 · ASNR 7 · PIN 2
- **SNA:** háromféle elrendezés (ASNR 7.2):
  - csomópont-attribútumokon alapuló;
  - ordinációs (MDS-alapú);
  - gráfalgoritmusos.

  Ezen felül: csomópont- és kapcsolatattribútumok megjelenítése, irányított és többféle kapcsolat, szűrés (izolált pontok, attribútum szerinti fókusz, ego-hálózatok), változás megjelenítése, exportálás.
- **NAS:** média- és közönségagenda-hálózatok egymás melletti, **azonos elrendezésű** ábrázolása. Ehhez az attribútum- vagy MDS-alapú, rögzített koordinátás elrendezés jobb, mint a futásonként változó erőalapú. Közben a vizualizáció mint érvelés és mint félrevezetés.
- **ASNR-adat:** Krackhardt HighTech, Borgatti Scientists504, Wolfe Primates.
- **Python:** `networkx` + `matplotlib`, `pyvis` (interaktív), Gephi.

### 8. Ego-hálózatok és lokális csúcsszintű mértékek
- **Forrás:** ASN 15 · ASNR 8
- **SNA:**
  - kapcsolatösszetétel, bináris és súlyozott;
  - alteri összetétel kategoriális és folytonos attribútumokra;
  - ego–alter hasonlóság (homofília, E–I index, Yule-féle Q);
  - ego-hálózatok szerkezete: strukturális lyukak (Burt-féle *constraint*, *effective size*), brokerség, és a teljes hálózatra kidolgozott mértékek ego-hálózatra alkalmazva.
- **NAS:** egy kiemelt ügy (pl. „migráció”) **ego-hálózata**: milyen attribútumok veszik körül orgánumonként? Brokerattribútumok, amelyek két ügycsoportot kötnek össze.
- **Python:** `nx.ego_graph`, `nx.constraint`, `nx.effective_size`.

### 9. Centralitás – hálózati szaliencia
- **Forrás:** ASN 10 · ASNR 9 · PIN 3 (3.3 táblázat), PIN 4–5
- **SNA:**
  - fokszám, sajátvektor, Bonacich-féle β, közelség, k-lépéses elérés és β-elérés, közöttiség;
  - irányított hálók (be- és kifok, HITS, PageRank);
  - súlyozott hálók;
  - **negatív kapcsolatok (PN-centralitás)**;
  - **indukált centralitás**: mennyit veszít a háló, ha egy csomópontot eltávolítunk.
- **Hír/DNA-kapcsolat:** a PN-centralitás előjeles (támogat / ellenez) diskurzushálókra is alkalmazható (23. lecke). Az indukált centralitás megmutatja, melyik ügy „tartja össze” az agendát.
- **NAS:** a **fokszám-centralitás mint hálózati szaliencia**, ez a PIN-esettanulmányok leggyakoribb mértéke. Média- és közönségoldali centralitás-rangsorok összevetése (Spearman-féle ρ), ami a klasszikus első és második szintű tesztek hálózati változata.
- **Gyakorlat:** centralitás-rangsorok orgánumonként; mennyire robusztusak a súlyozási döntésekre?

### 10. Teljes hálózatok jellemzése
- **Forrás:** ASN 9 · ASNR 10 · PIN 3 (3.4 táblázat)
- **SNA:**
  - lokális mértékek: sűrűség és átlagfokszám, reciprocitás, tranzitivitás és **ciklikusság**, triádcenzus;
  - globális mértékek: komponensek és **fragmentáció**, távolságalapú mértékek (kompaktság);
  - centralizáció és mag–periféria jelleg;
  - **attribútumalapú csoportmértékek**, például csoportszintű E–I index.
- **NAS:**
  - orgánumok agendájának összevetése **sűrűség**, **fragmentáció** és **centralizáció** alapján: egy fókuszált, néhány ügyre épülő agenda és egy szétszórt agenda különbsége;
  - E–I index attribútumkategóriák között (pl. tárgyi vs. affektív attribútumok, vö. [N27]).
- **Python:** `networkx`, `cpnet`.

### 11. Alcsoportok és közösségkeresés
- **Forrás:** ASN 11 · ASNR 11
- **SNA:**
  - klikkek és **klikkátfedés-elemzés** (közös klikktagság);
  - Girvan–Newman;
  - modularitás-optimalizálás: fast greedy, walktrap, Louvain, és a modern utód, a Leiden;
  - címkepropagáció;
  - irányított, széteső és súlyozott adatok; nagy adatok; számítási szempontok.
- **ASNR-adat:** Zachary karateklub, Kapferer Tailor Shop, Hawthorne BankWiring.
- **NAS/hír:** **ügycsomagok (bundles)** és keretek mint közösségek; hálózatalapú témafeltárás szó-együttelőfordulási hálón, a témamodellek alternatívájaként [S7].
- **Python:** `leidenalg`, `python-igraph`, `infomap`.

### 12. Ekvivalencia és blokkmodellek
- **Forrás:** ASN 12 · ASNR 12
- **SNA:** strukturális ekvivalencia, profilhasonlóság, blokkmodellek, közvetlen módszer és optimalizálás, reguláris ekvivalencia (REGE), mag–periféria modellek. Modern kiegészítés: **sztochasztikus blokkmodell (SBM)**.
- **NAS/hír:** strukturálisan ekvivalens orgánumok az intermediális hálóban; azonos szerepű attribútumok különböző ügyekben.
- **ASNR-adat:** Sampson Monastery (strukturális ekvivalencia, blokkmodellek), Schwimmer Papuan Village (reguláris ekvivalencia), Baker Journals (mag–periféria).
- **Python:** saját CONCOR/REGE `numpy`-ban; SBM: `graph-tool`. *R csak összevetésre:* `blockmodeling`.

### 13. Kétmódú (bipartit) hálózatok és backbone-kinyerés
- **Forrás:** ASN 13 · ASNR 13 · friss kutatások [B1–B4]
- **SNA:**
  - egymódúvá alakítás;
  - **súlyozott kétmódú mátrixok projekciója**: a szorzatmódszer (`XXᵀ`) mellett a **minimum-módszer** (a cellaértékek minimumainak összege) és más hasonlósági mértékek (ASNR 13.3);
  - bipartit hálózatok;
  - bi-klikkek, duális Louvain;
  - kétmódú mag–periféria;
  - strukturális és reguláris ekvivalencia.
- **NAS-relevancia:** ha a cikk × ügy mátrix súlyozott (pl. említésszám), a szorzatmódszer felülsúlyozza a sokat említett ügyeket. A minimum-módszer és a normalizált változatok értelmezhetőbb súlyt adnak. Ez a döntés közvetlenül befolyásolja a NAS-hálózat súlyait.
- **NAS/hír:** a hírelemzés szinte minden adata kétmódú: **cikk × ügy**, **orgánum × ügy**, **szereplő × állítás**. A projekció zajos, sűrű hálót ad, ezért kell **backbone-kinyerés** (disparity filter, noise-corrected, SDSM). A módszerek eltérő backbone-t adnak, a választást indokolni kell [B2, B3].
- **Python:** `networkx.bipartite`, `netbone`; *R:* `backbone` az SDSM/FDSM-hez.

### 14. Nagy hálózatok
- **Forrás:** ASN 14 · ASNR 11.7
- **SNA:** a probléma méretének csökkentése, megfelelő módszer választása, mintavétel, kisvilág- és skálafüggetlen hálózatok.
- **Hír:** napi entitásgráfok hosszú idősoron, például 12 év, 55 hírcsatorna [K10]; memória- és futásidő-szempontok.
- **Python:** `python-igraph`, `networkit`, `graph-tool`.

---

## III. rész: Statisztikai következtetés hálózatokon

### 15. Permutációs tesztek, QAP és MRQAP – a NAS fő statisztikai eszköze
- **Forrás:** ASN 8.1–8.6 · ASNR 14 · PIN 4 (Vargo & Guo), PIN 5, 13 · [N3, N13, N16]
- **SNA:**
  - Miért nem használható a klasszikus statisztika? A megfigyelések nem függetlenek, és a teljes populációt figyeljük meg, nem mintát.
  - Az ASNR 14.1 táblázata hatféle kérdéstípust különít el: diád, csúcs és csoport szintjén, a hálózati változó lehet ok vagy okozat.
  - Csoportszinten permutációs teszt; csúcsszinten permutációs regresszió és **hálózati autoregresszió**.
  - Diádszinten **QAP-korreláció**, **MRQAP** (Y-permutáció vs. Dekker-féle *double semi-partialling*) és **logisztikus QAP (LRQAP)** bináris függő hálóra.
- **NAS:**
  - Az alap NAS-hipotézis **diádszintű**: a média két ügyet összekapcsol → a közönség is összekapcsolja őket.
  - **QAP-korreláció** a média- és a közönségagenda-hálózat között.
  - **MRQAP** több médiaforrással egyszerre, például a hagyományos média vs. a botok hatása a közönségagendára [N13].
  - **LRQAP**, ha a közönségháló bináris (mind map: kapcsolja / nem kapcsolja).
  - Kombinálás Granger-teszttel [N16].
- **ASNR-adat:** Krackhardt HighTech (MRQAP: tanácskérés előrejelzése), Padgett (házasság és üzlet), Newcomb Fraternity.
- **Gyakorlat:** QAP, MRQAP (mindkét permutációs változat) és LRQAP **saját implementációja `numpy`-ban**. Ellenőrzés a könyv kinyomtatott eredményein (ASNR 14.3 táblázat), opcionálisan az R `sna::netlm`-mel is.

### 16. ERGM és SAOM (haladó, R)
- **Forrás:** ASN 8.7–8.8 · ASNR 15 · [D3]
- **SNA:**
  - ERGM: hálózati hajlamok és az őket megragadó paraméterek; hálók szimulálása adott paraméterekkel; MCMC-MLE becslés és a konvergencia ellenőrzése; paraméterválasztás és illeszkedésvizsgálat (GOF); irányított hálók;
  - SAOM: alapelvek és cél.
- **ASNR-adat:** Pane Training (irányított ERGM), Knecht Class12h (SAOM).
- **NAS/hír:** mi magyarázza, hogy két ügy összekapcsolódik-e (homofília, tranzitivitás, attribútumhatások)? Diskurzushálózatok dinamikája többmódú DyNAM-mel [D3].
- **Eszköz:** `statnet`/`ergm`, `RSiena`, `goldfish` (R). Ezeknek nincs érett Python-megfelelője.

---

## IV. rész: Network Agenda Setting – elmélet és módszertan

### 17. Az agenda setting három szintje és a NAS-modell
- **Forrás:** PIN 1 (Guo), PIN 15 (Guo & McCombs) · [N6, N8, N10, N25]
- **Tartalom:** az első és második szint öröksége; a NAS-modell hipotézisei; orientációs szükséglet (NFO) a NAS-ban [N9]; tolakodó (*obtrusive*) és nem tolakodó ügyek.
- **Friss viták:**
  - **NAS vagy hálózati keretezés?** 19 ezer YouTube-videó és 660 millió komment elemzése szerint a kommentek *új* asszociációkat vezetnek be, és nem veszik át a média „csomagjait” [N10].
  - **Algoritmikus fordulat:** „flash agendák” és *agenda leadership* hibrid médiarendszerben [N8]; a médiarendszer és a rezsimtípus mint moderáló tényező, hat tesztelhető propozícióval [N6].

### 18. NAS-mérés I: a média-agendahálózat felépítése
- **Forrás:** PIN 2 (Guo), PIN 3 (Carroll), PIN 11 (Kiousis & Ragas) · [N15, K11, L2, L4]
- **Hagyományos út:** kézi kódolás, együtt-előfordulás egy elemzési egységen belül.
- **Számítógépes utak:**
  - szótár és NER;
  - **LDA-témák** mint csomópontok [N15];
  - **word2vec** alapú implicit kapcsolatok [K11];
  - BERTopic és mondatbeágyazások;
  - **LLM-alapú kódkönyv-annotáció**: a modellek F1-értéke 0,64–0,82 között mozog, multiágens felállással magasabb [L4], ezért mindig kézi validáló mintán kell mérni.
- **Gyakorlat:** ugyanannak a korpusznak három hálózata (kézi, LDA/BERTopic, LLM). Mennyire konvergálnak (QAP)?

### 19. NAS-mérés II: a közönség-agendahálózat
- **Forrás:** PIN 2, PIN 4 (Vargo & Guo: big social data) · [N1, N2, N5, N19]
- **Tartalom:**
  - explicit (mind map) és implicit (survey-válaszok együtt-előfordulása) agenda;
  - közösségi média mint közönségagenda: előnyök és torzítások;
  - **időeltolás:** egy török vizsgálatban kb. **hat hét** alatt alakult ki a legnagyobb média–közönség hasonlóság [N1];
  - nemzetközi összehasonlítás [N19].

### 20. Intermediális és dinamikus NAS: idősorok hálózatokon
- **Forrás:** PIN 5 (Meraz), PIN 9 (Kim & Min: issue attention cycle) · [N16, N18, N27, N29, T1, T3, T9]
- **Tartalom:** centralitás-idősorok, Granger-okság, VAR, keresztkésleltetett korreláció, transzferentrópia; időablakok megválasztása (napi vagy **órás** felbontás, ahol kb. 4 órás átadási késést mértek [T9]).
- **Friss eredmény:** a **hálózatszerkezeti mutatók** (pl. agendasűrűség) a puszta szalienciánál jobban előrejelzik a médiák közötti agendaátadást [T1].
- **Python:** `statsmodels.tsa` (VAR, `grangercausalitytests`), `IDTxl`/`pyinform`.

### 21. Esettanulmány-szeminárium (PIN II. rész)
- **A. Politikai kommunikáció:**
  - PIN 6: tech-bloggerek;
  - PIN 7: *compelling arguments* → *compelling associations*;
  - PIN 8: újságírói szerepek, USA–Chile;
  - PIN 10: iraki háború, nemzetközi összehasonlítás.
- **B. Stratégiai kommunikáció és PR:** PIN 11–14 (harmadik szintű agenda-building, vállalati válság, sajtóközlemények vs. média, termékattribútumok).
- **Feladat:** leckénként egy tanulmány módszertani „kicsontozása”: mi a csomópont, mi a kapcsolat, mi a statisztika, mi a gyenge pont? Utána párhuzam egy 2021–2026-os tanulmánnyal [N3, N5, N13, N27, N29].

---

## V. rész: Gráfalapú hírelemzés a NAS-on túl

### 22. Szemantikus és szöveghálózat-elemzés
- **Forrás:** ASN 13 (bipartit alapok) · [S1, S5, S7, S10]
- **Tartalom:** szó-együttelőfordulási hálók; dokumentum × szó bipartit szöveghálózatok; TopicRank; témaevolúció hálózati idősorokkal; hálózatalapú vs. valószínűségi témamodellek.
- **Python:** `textnets`, `networkx`, `BERTopic`.

### 23. Diskurzus-hálózatelemzés (DNA)
- **Forrás:** ASN 13 · [D1–D3, D9, D11, L2]
- **Tartalom:**
  - **szereplő × állítás** bipartit háló, állásfoglalással (egyetért / ellenez) előjelezve; diskurzuskoalíciók; polarizáció;
  - hosszú távú, automatizált DNA (500 ezer cikk, szélsőjobboldali mainstreamesedés) [D11];
  - **automatizált DNA:** NER, entitás-összekapcsolás és **LLM-alapú stance-detekció**, csúszó időablakos aggregálással javuló validitás [L2];
  - LLM-ek gyengesége a szereplő-azonosításban [D9].
- **Kapcsolat a NAS-hoz:** ki állítja az ügy-attribútum asszociációkat? Ez az agenda-building hálózati szintje.

### 24. Tudásgráfok, eseménygráfok és narratívák hírekből
- **Forrás:** [K2, K3, K7, K9, K13, K15]
- **Tartalom:** NER, entity linking (Wikidata), relációkinyerés; **LLM-alapú tudásgráf-építés** (multiágens állítás-kinyerés és -forrásolás [K7]; LLM + RAG eseménytörténetek [K15]); eseménycentrikus időbeli tudásgráf és „narrative graph” [K3]; oksági gráfok hírekből [K9, K13].
- **Python:** `huSpaCy`, LLM strukturált kimenettel, `rdflib`; opcionálisan Neo4j.

### 25. Kitekintés: gráfbeágyazások és GNN-ek, botok, koordinált viselkedés
- **Forrás:** [K12, K23, K24, N13, B3]
- **Tartalom:** node2vec és gráfbeágyazások; GNN-ek eseménygráfokon (félretájékoztatás- és összeesküvés-elmélet-detekció); botok hatása a közönségagendára [N13]; backbone-kinyerés online kollektív viselkedés modellezésére [B3].
- **Megjegyzés:** opcionális lecke, a NAS-célhoz csak kiegészítés.
- **Python:** `PyTorch Geometric` (opcionális).

---

## VI. rész: Záróprojekt

### 26. Saját NAS-kutatás
1. **Kutatási kérdés és hipotézisek.** Javaslat: egy magyar közügy hálózati agendája a kormányközeli és a független online sajtóban (intermediális NAS), kitekintéssel a közösségi médiára mint közönségagendára.
2. **Design:** korpusz, időszak, elemzési egység, csomópontok (ügyek és attribútumok), határmegvonás.
3. **Mérés:** kézi validáló minta → LLM- vagy BERTopic-alapú kódolás → megbízhatósági mutatók.
4. **Hálózatépítés:** súlyozás, normalizálás, backbone.
5. **Elemzés:** leíró mutatók (centralitás, sűrűség, közösségek), QAP/MRQAP, idősoros Granger/VAR időeltolással.
6. **Robusztusság:** alternatív súlyozás, egység és backbone mellett is megmaradnak az eredmények?
7. **Írás:** módszertani napló, reprodukálható kód (Jupyter vagy marimo notebook), vizualizációk.

---

## Javasolt ütemezés (tájékoztató)

| Hét | Leckék | Fókusz |
|---|---|---|
| 1–2 | 0–5 | Alapok + futó projekt adatpipeline |
| 3–5 | 6–11 | Leíró SNA |
| 6–7 | 12–14 | Haladó struktúrák, kétmódú adatok, nagy hálók |
| 8–9 | 15–16 | Statisztikai következtetés (QAP!) |
| 10–12 | 17–21 | NAS elmélet és mérés |
| 13–14 | 22–25 | Gráfalapú hírelemzés |
| 15–18 | 26 | Záróprojekt |

> [!note] Következő lépés
> A leckék kidolgozása egyenként, a `tananyag` séma szerint: motiváció → konkrét példa → szabály → kidolgozott Python-kód → buktatók → gyakorlás → kvíz. Fájlnév-javaslat: `Hálózatelemzés anyag.md`, vagy leckénként külön jegyzet.

---

## Friss kutatások (Consensus)

### NAS – elmélet, áttekintések, empirikus vizsgálatok
- **[N1]** [The optimal time-lag for media’s third-level agenda-setting effect](https://consensus.app/papers/details/5f47897a31d4595f887a4b38428a24be/?utm_source=claude_desktop) (Yüksel et al., 2024, *Connectist*)
- **[N2]** [The pictures in our heads of certain diseases](https://consensus.app/papers/details/ef25ba37a2a55c24836b216512b1b48c/?utm_source=claude_desktop) (Yüksel et al., 2021)
- **[N3]** [Third Level Intermedia Agenda: Electoral Rigging Issue Coverage in Urdu Press of Pakistan](https://consensus.app/papers/details/6569c203e4645219a4f600e1ea28d2f8/?utm_source=claude_desktop) (Bilal, 2023)
- **[N5]** [Delineating the NAS Model in Non-Political Semi-Obtrusive Public Affairs in China](https://consensus.app/papers/details/251dfd92b407519780e29aa795292671/?utm_source=claude_desktop) (Yang et al., 2025, *Mass Communication and Society*)
- **[N6]** [Revisiting Agenda-Setting Across Media Systems and Regime Types](https://consensus.app/papers/details/5cfad6de4b4650c5a1ba965ab75f1f3e/?utm_source=claude_desktop) (Almakaty, 2026, *Journalism and Media*). A magyar esetet is tárgyalja.
- **[N8]** [Revisiting Agenda-Setting Theory in Hybrid Media Ecosystems: Flash Agendas, Agenda Leadership, and Algorithmic Curation](https://consensus.app/papers/details/59bce74f493c5d9b9b6780a3dc3262b4/?utm_source=claude_desktop) (Elishar et al., 2026)
- **[N9]** [Applicability of Need for Orientation Scales in Network Agenda-Setting](https://consensus.app/papers/details/ac432c1d60835bf79fbc7f92488c5b41/?utm_source=claude_desktop) (Melek, 2025, *IJPOR*)
- **[N10]** [Network Agenda Setting, or Networked Framing? … Semantic Networks on YouTube](https://consensus.app/papers/details/fdb7c3ecdbb2545f8bfdc90afa88613c/?utm_source=claude_desktop) (Hsiao et al., 2024, *Communication Research*)
- **[N13]** [Social bots shape public issue networks in China’s dual-carbon agenda: MRQAP](https://consensus.app/papers/details/c13f5269746d51129ee3407b3164e577/?utm_source=claude_desktop) (Lin et al., 2025, *HSSC*)
- **[N15]** [NAS model during COVID-19 based on LDA topic modeling](https://consensus.app/papers/details/165401c089a55352aa40fb3711eca738/?utm_source=claude_desktop) (Liu et al., 2022, *Frontiers in Psychology*)
- **[N16]** [The Mutual Influence of the WHO and Twitter Users During COVID-19: NAS Analysis](https://consensus.app/papers/details/be0a360cf19554249d5190426d9fe61e/?utm_source=claude_desktop) (Tahamtan et al., 2022, *JMIR*)
- **[N18]** [Decentralized agenda networks between Wikipedia and global news media 2015–2020](https://consensus.app/papers/details/fb7b90fabdc056aeb8c25d6ac3a18796/?utm_source=claude_desktop) (Ren et al., 2023, *New Media & Society*)
- **[N19]** [THAAD: a cross-national network agenda-setting study](https://consensus.app/papers/details/13ba3eb73c3c5600ae4027829b1eb33d/?utm_source=claude_desktop) (Jiang et al., 2021, *Chinese Journal of Communication*)
- **[N25]** [Agenda setting theory in the digital media age: a comprehensive and critical literature review](https://consensus.app/papers/details/633c82cbcd1b5348900862842f5b03d1/?utm_source=claude_desktop) (Almakaty, 2025)
- **[N27]** [Networked agenda flow between elite U.S. newspapers and Twitter: BLM 2020](https://consensus.app/papers/details/da674ec84aa45b3dbac13dbe2b4dbada/?utm_source=claude_desktop) (Su, 2022, *Journalism*)
- **[N29]** [The Stability of Cable and Broadcast News Intermedia Agenda Setting Across the COVID-19 Issue Attention Cycle](https://consensus.app/papers/details/b3290f80e0985dba8451bdc21c8dabd5/?utm_source=claude_desktop) (Budak et al., 2023, *Political Communication*)

### Időbeli / intermediális dinamika
- **[T1]** [Modeling cross-media agenda interactions … using multi-source news time-series data](https://consensus.app/papers/details/2e72212cccd55dcf8d5801d57eb0f90d/?utm_source=claude_desktop) (Deng, 2026, *Scientific Reports*)
- **[T3]** [Tracking Attention about COVID-19 Vaccines on Twitter and Newspapers: A Dynamic Agenda-setting Approach](https://consensus.app/papers/details/e91e7a130eda5143af431f3c6c3e0e5e/?utm_source=claude_desktop) (Wang et al., 2024)
- **[T9]** [Unpacking the Nuances of Agenda-Setting in the Online Media Environment: An Hourly-Event Approach](https://consensus.app/papers/details/656fa3c664ad5fc98f1ab77b95315237/?utm_source=claude_desktop) (Tao et al., 2024, *Journalism Studies*)
- **[K11]** [Agenda Dynamics on Social Media During COVID-19: Public, Media, and Government Agendas](https://consensus.app/papers/details/2baf49e0a8be51309d15b02b40b7adcd/?utm_source=claude_desktop) (Zhou et al., 2022, *Communication Studies*). word2vec-alapú agendahálózatok.

### LLM-ek a tartalomelemzésben
- **[L2]** [Automated extraction of discourse networks from large volumes of media data](https://consensus.app/papers/details/62cf52ad8d5758f1b94f4611e4b6eff3/?utm_source=claude_desktop) (Angst et al., 2025, *Network Science*)
- **[L4]** [Beyond Manual Media Coding: Evaluating LLMs and Agents for News Content Analysis](https://consensus.app/papers/details/6e086a2192345abf909daeaeffe96745/?utm_source=claude_desktop) (Doropoulos et al., 2025, *Applied Sciences*)
- [Intermedia Agenda-Setting of a Scientific Controversy … Hydroxychloroquine](https://consensus.app/papers/details/6e47dc4aa53f5adcb170f7c3ed45de9c/?utm_source=claude_desktop) (Wang et al., 2026, *Science Communication*). LLM-segített keretelemzés + idősor.

### Diskurzus-hálózatelemzés
- **[D1]** [Slovak MPs’ response to the 2022 Russian invasion of Ukraine … DNA](https://consensus.app/papers/details/0588434f114553f49e2401b78af25749/?utm_source=claude_desktop) (Lintner et al., 2023, *HSSC*)
- **[D2]** [Between welcome culture and border fence (DebateNet2.0)](https://consensus.app/papers/details/b5fafb1ba85454fdbc5a90887327e8c4/?utm_source=claude_desktop) (Blokker et al., 2023)
- **[D3]** [Multimodal mechanisms of political discourse dynamics: Germany's nuclear phase-out](https://consensus.app/papers/details/59e0ec8c383e589193002a391a859f93/?utm_source=claude_desktop) (Haunss et al., 2022, *Network Science*)
- **[D9]** [Actor Identification in Discourse: A Challenge for LLMs?](https://consensus.app/papers/details/02716cba3dda5928ba6da69939084821/?utm_source=claude_desktop) (Barić et al., 2024)
- **[D11]** [Discourse Networks of the Far Right](https://consensus.app/papers/details/67cb9b520c7255e8be44eaba338c58fe/?utm_source=claude_desktop) (Völker et al., 2024, *Political Communication*)

### Szemantikus és szöveghálózatok
- **[S1]** [Analysis of media coverage … Suwon Hwaseong Cultural Festival](https://consensus.app/papers/details/ca6bb932ea7550259f8220006d74042b/?utm_source=claude_desktop) (Paek et al., 2026)
- **[S5]** [Dynamics of online debates: insights from textual network analysis](https://consensus.app/papers/details/0f809740b9c5585ba710dcef49844afd/?utm_source=claude_desktop) (Pronello et al., 2024)
- **[S7]** [Uncovering Flat and Hierarchical Topics by Community Discovery on Word Co-occurrence Network](https://consensus.app/papers/details/7bdbd3c28edd5a8ab034488b8925ed59/?utm_source=claude_desktop) (Austin et al., 2024)
- **[S10]** [Topic Network Analysis Based on Co-Occurrence Time Series Clustering](https://consensus.app/papers/details/13aa54587a4551dcb08ec75a85f590ef/?utm_source=claude_desktop) (Lin et al., 2022, *Mathematics*)

### Tudás- és eseménygráfok
- **[K2]** [Knowledge-Based News Event Analysis and Forecasting Toolkit](https://consensus.app/papers/details/585b7e0a93fd50d89458741353b71dc9/?utm_source=claude_desktop) (Hassanzadeh et al., 2022, IJCAI)
- **[K3]** [Narrative Graph: Telling Evolving Stories Based on Event-centric Temporal Knowledge Graph](https://consensus.app/papers/details/65e3d694b5d75cd8b0b34f58eb65a54a/?utm_source=claude_desktop) (Yan et al., 2023)
- **[K7]** [Generating knowledge graphs from news articles via multi-agent claim extraction and attribution](https://consensus.app/papers/details/859bb2bdd8af56d2a4769fc59155c9cd/?utm_source=claude_desktop) (Fadda et al., 2026, *Knowledge-Based Systems*)
- **[K9]** [Constructing and Interpreting Causal Knowledge Graphs from News](https://consensus.app/papers/details/e52a9cfff1705e568c4450649113ea9b/?utm_source=claude_desktop) (Tan et al., 2023)
- **[K10]** [Macro centrality analysis in Twitter news entity graphs](https://consensus.app/papers/details/c5b534453111521480125615d79d187b/?utm_source=claude_desktop) (Bodaghi et al., 2025, *IJDL*)
- **[K12]** [Open-Domain Event Graph Induction for Mitigating Framing Bias](https://consensus.app/papers/details/40048b9f24695759b150104c378f97ff/?utm_source=claude_desktop) (Liu et al., 2023)
- **[K13]** [Causal graph extraction from news: time-series causality learning techniques](https://consensus.app/papers/details/3c5b4ae71b165bc388a7de766f7124f0/?utm_source=claude_desktop) (Maisonnave et al., 2022, *PeerJ CS*)
- **[K15]** [Disaster Storylines and Knowledge Graphs from Global News with LLMs and RAG](https://consensus.app/papers/details/c0bfee9b395d5307bbd40bd5b1df74aa/?utm_source=claude_desktop) (Ronco et al., 2026, *Scientific Data*)
- **[K23]** [Identifying Conspiracy Theories News based on Event Relation Graph](https://consensus.app/papers/details/e6bb3490554e563eb2c08f9aaeb5a352/?utm_source=claude_desktop) (Lei et al., 2023)
- **[K24]** [Cross-document Misinformation Detection based on Event Graph Reasoning](https://consensus.app/papers/details/e786c52a4c9a54a898f110782b325d3a/?utm_source=claude_desktop) (Wu et al., 2022, NAACL)

### Backbone-kinyerés
- **[B2]** [Backbone extraction through statistical edge filtering: A comparative study](https://consensus.app/papers/details/577aa66018cb59328dee80a56dd2cb8e/?utm_source=claude_desktop) (Yassin et al., 2025, *PLOS ONE*)
- **[B3]** [On network backbone extraction for modeling online collective behavior](https://consensus.app/papers/details/32da992c301052f0ab9b289c8d2788c1/?utm_source=claude_desktop) (Ferreira et al., 2022, *PLOS ONE*)
- **[B4]** [backbone: An R package to extract network backbones](https://consensus.app/papers/details/d321c25f1237572c910a82b4abaabef6/?utm_source=claude_desktop) (Neal, 2022, *PLOS ONE*)
- **[B1]** [Exploring weighted network backbone extraction: structural techniques](https://consensus.app/papers/details/6b62cd15c0005054ba0ba8ddb8bf14b9/?utm_source=claude_desktop) (Yassin et al., 2025, *PLOS ONE*)

---

## Megjegyzések a kidolgozás során (0. lecke, 2026-11-04)

- **Export R nélkül:** a Python `rdata` csomagja közvetlenül olvassa az `xUCINET` `.rda` fájljait; az R-es export ellenőrzésre fut (105 mátrix, 0 eltérés).
- **A könyv csomagja:** `xUCINET_0.0.2.0020.tar.gz` a könyv weboldaláról (nem CRAN, nem a GitHubos `xucinet` 2.0, amely a 2. kiadáshoz készült, és nem kompatibilis).
- **Adatnevek:** a könyv „Johnson CitiesUS” = `Borgatti_Cities`, „Savage TradePre29” = `Savage_TransactionFlows`, „Knecht Class12h” = `Knecht_Class12b`;
  a Johnson PolarStation és az Everett-féle közösségimédia-adatok nincsenek a 0.0.2-es csomagban.
- **`networkx`-beli Padgett:** a `florentine_families_graph()` 15 csúcsú (hiányzik az izolált Pucci), ezért reprodukáláshoz az ASNR-adat kell.
- **`netbone`:** pontos régi verziókat rögzít (`networkx==2.8.8`, `scipy==1.13.0`), a fő környezetbe nem vehető fel; külön környezetben fut.
- **`graph-tool`:** pip-pel nem telepíthető (conda-forge vagy Docker).
- **Python 3.12:** ezen minden kurzuscsomagnak van kereke (3.14-en a `textnets`-nek nincs).
- **`sna_utils`:** csomagmappa (`sna_utils/__init__.py`), szerkeszthető telepítéssel (`uv_build`).
