# Gráfelmélet és hálózattudomány – fejezettervezet

Ez a dokumentum a *Gráfelmélet és hálózattudomány* témakör fejezeteinek **kidolgozási terve**, a Mesterséges intelligencia
(`mesterseges-intelligencia/TERV.md`), az Analízis és a Matematikai statisztika tervének mintájára. Minden fejezethez megadja
a felépítést, a kidolgozott példákat, az interaktív szemléltetéseket, a kvízeket, a csapdákat és a forrásokat. A kidolgozáskor
ebből indulunk ki; a terv menet közben finomítható.

**A témakör íve:** az első két blokk a gráfelmélet és a hálózattudomány **alapjait** adja, a harmadik a **gépi tanulást
gráfokon**, a negyedik – a témakör súlypontja – az **alkalmazást a hírek és a média elemzésére**: egy történeti áttekintéssel indul
(mikor, milyen eszközökkel és kérdésekkel használták a hálózatokat a média- és hírkutatásban), majd napirend-kijelölés,
keretezés, médiarendszerek térképe, hírterjedés és félretájékoztatás, mélytanulási gráfmodellek a hírelemzésben, végül egy
végigvitt esettanulmány. A negyedik blokk a szerző szakdolgozati témájához (magyar online hírek eseményalapú összehasonlítása,
hálózati napirend-kijelölés) illeszkedik; az ottani jegyzetek (`Projects/szakdolgozat/`) forrásként szolgálnak.

---

## 0. Általános szerkesztési elvek

### Stílus
- **A `CLAUDE.md` sémája az irányadó:** motiváló kérdés → útiterv → lépések az egyszerűtől a bonyolultig (kis, kézzel
  végigszámolható eset → szabály „miért?”-tel → 2–3 egylépéses kidolgozott példa → buktató → csukott gyakorló blokk) →
  alkalmazás → összefoglalás + döntési táblázat → kvíz.
- **Előbb a rajz, aztán a mátrix, aztán a képlet.** A gráfelmélet nagy előnye, hogy minden fogalom **lerajzolható**. Minden
  új fogalmat 4–8 csúcsú, kézzel végigszámolható gráfon mutatunk meg (teljes felsorolással, ahol lehet), és csak utána
  általánosítunk. Minden numerikus eredményt Pythonnal (`networkx`, `numpy`) ellenőrzünk.
- **Lépcsőzetes nehézség.** ★ alap · ★★ közép · ★★★ haladó / kitekintés. Az ★★★ szakaszok kihagyhatók.
- **Intuíció + matematika egyensúlya.** A gerinc a szemléletes magyarázat; a tételek `box thm`-ben, a bizonyítások
  lenyitható „📐 Bizonyítás” részekben. Aki csak az alkalmazást akarja, az is végigér.
- **Kód opcionálisan.** Ahol egy rövid kódrészlet sokat ad (`networkx`-elemzés, PyTorch Geometric-réteg, `spaCy`-alapú
  entitáskinyerés), csukott „🐍 Python” lenyíló mögé kerül, 5–15 sorban, futtatva és ellenőrizve. A megértéshez sosem kell.
- **Interaktivitás.** Fejezetenként 5–9 szemléltetés. A témakör alapélménye: **„rajzold meg, és a gép azonnal kiszámolja”**
  – a widgetek többségében a gráf szerkeszthető (csúcs / él hozzáadása, törlése, húzás), és minden mérőszám élőben frissül.
- **Hírelemzési szál végig.** Már az 1. fejezettől kezdve minden blokkban van legalább egy hírekhez kötött példa
  (lásd *Futó példák*), hogy a IV. blokk ne „új témának”, hanem a meglévő eszközök alkalmazásának hasson.
- **Kutatási frissesség.** A IV. blokk fejezetei a legfrissebb (2020–2026-os) szakirodalomra épülnek. Minden kutatási
  állítás **hivatkozással és évszámmal** jelenik meg; a `📅 Állapot: 2026` jelölés mutatja, mi változhat. Ahol a szakirodalom
  megosztott, egy **„⚖️ Konszenzus és vita”** doboz (`box tip`) külön mondja meg, miben értenek egyet a kutatók, és mi vitatott.
  A fejezetek megírása előtt **Consensus-keresés** frissíti az adott fejezet kutatási részét (lásd az egyes fejezeteknél).
- **Történeti szál.** A 14. fejezet egy idővonalon mutatja be, mikor, milyen kérdésekkel, adatokkal és eszközökkel
  használták a gráfokat és hálózatokat a média- és hírkutatásban. Az I–III. blokk fogalmainál egy-egy `box history`
  jelzi, mikor jelent meg az adott eszköz a médiakutatásban (pl. a centralitásnál Freeman 1979 és a véleményvezérek,
  a QAP-nál Krackhardt 1987 és a NAS), és a 14. fejezet megfelelő korszakára mutat.
- **Módszertani józanság.** A hálózatelemzés csábító ábrákat ad. Visszatérő `box warn` témák: az él definíciója egy
  döntés, nem adottság; az együttelőfordulás nem kapcsolat; az időbeli sorrend nem bizonyít átvételt; a hálózati mérőszámot
  **nullmodellhez** kell mérni; a közösségkeresés eredménye nem „a” közösségek, hanem egy modell válasza.

### Terminológia
Magyar elnevezések, az angol megfelelő első előforduláskor zárójelben, eltérés esetén `box tip`. A magyar gráfelméleti
hagyomány (Kőnig Dénes első gráfelméleti tankönyve, 1936; Erdős–Rényi; Lovász László; Barabási Albert-László) erős –
`box history` dobozokban megjelenik. Alapszótár:

| Magyar | Angol |
|---|---|
| gráf, csúcs (pont), él | graph, vertex (node), edge (link) |
| irányított / súlyozott / előjeles gráf | directed / weighted / signed graph |
| szomszédsági mátrix, illeszkedési mátrix | adjacency matrix, incidence matrix |
| fokszám, befok, kifok | degree, in-degree, out-degree |
| séta, út, kör | walk, path, cycle |
| összefüggő komponens, óriáskomponens | connected component, giant component |
| páros gráf, egymódusú vetület | bipartite graph, one-mode projection |
| centralitás (fokszám-, közelségi, köztességi, sajátvektor-) | degree / closeness / betweenness / eigenvector centrality |
| klaszterezettségi együttható | clustering coefficient |
| homofília, asszortativitás | homophily, assortativity |
| kisvilág-tulajdonság, skálafüggetlen hálózat | small-world property, scale-free network |
| nullmodell, konfigurációs modell | null model, configuration model |
| közösségkeresés, modularitás | community detection, modularity |
| hálózati gerinc (kivonat) | network backbone |
| kaszkád, terjedés | cascade, diffusion / spreading |
| csúcsbeágyazás, kapcsolat-előrejelzés | node embedding, link prediction |
| tudásgráf, hármas (alany–állítmány–tárgy) | knowledge graph, triple (subject–predicate–object) |
| napirend-kijelölés, hálózati napirend-kijelölés | agenda setting, network agenda setting (NAS) |
| keretezés | framing |
| médiaközi napirend-kijelölés | intermedia agenda setting |
| hírlánc | story chain |

⚠️ **Buktatók a terminológiában:**
- A *path* magyarul **út** (nem ismétel csúcsot), a *walk* **séta** – az angol szakirodalom egy része (és a `networkx`) ezt
  lazábban kezeli; `box tip` az 2. fejezetben.
- A *network* és a *graph* a hálózattudományban szinonimaként fut; a témakörben: **gráf** = matematikai objektum,
  **hálózat** = valós rendszer gráfmodellje (csúcs- és élattribútumokkal).
- A *degree centrality* normalizált és nem normalizált alakja is használatos – mindig kiírjuk, melyiket számoljuk.
- „Szemantikai hálózat” két dolgot jelent: (1) szavak / fogalmak együttelőfordulási hálózata (kommunikációtudomány),
  (2) a tudásreprezentáció hármasokból álló gráfja (MI). A 13. fejezet külön tisztázza.

### Technikai konvenciók
- Mappa: `grafelmelet-halozattudomany/NN-rovid-cim/` → `index.html`, `widgets.js`, `quizzes.js` (+ adatfájlok, pl.
  `news-data.js`).
- Kvízazonosítók: `gh<fejezet>-<szakasz>`, pl. `gh5-53`, `gh15-152`; fejezetzáró: `gh5-final`. Kvíz minden szakaszhoz.
  A témakör `index.html`-jében és a főoldal `data-progress` listájában frissíteni kell.
- KaTeX; `<` helyett `\lt`. Gráf: $G = (V, E)$, $n = |V|$, $m = |E|$; szomszédsági mátrix $A$, fokszámmátrix $D$,
  Laplace-mátrix $L = D - A$; csúcs fokszáma $k_i$ (hálózattudományi szokás) vagy $d(v)$ (gráfelméleti szokás) – a 2. fejezet
  egyezteti, a témakör a **$d(v)$**-t használja a gráfelméleti, a **$k_i$**-t a hálózattudományi fejezetekben, `box tip`-pel.
- Doboztípusok: `def`, `thm`, `example`, `tip`, `warn`, `history`.
- **Gráfrajzolás közös modulban** (`assets/graph.js`, lásd *Közös komponensek*): erőirányított elrendezés, húzható csúcsok,
  színezés attribútum szerint, a szokásos algoritmusok. Külső könyvtár (D3, Cytoscape, sigma.js) nem kell.
- **Előre számolt adatok.** A nagyobb valós hálózatok (100–2000 csúcs) elrendezése és drága mérőszámai (köztesség,
  beágyazás, GNN-jóslat) Pythonban előre számolva, JSON-ben kerülnek az oldalra (≤ 1 MB / fájl); a generáló szkriptek a
  `_parts/graf/` mappában. A böngészőben csak kis gráfokon fut élő számítás.
- **Szerzői jog és adatvédelem.** Valós hírszövegeket **nem** teszünk az oldalra: csak metaadatot (médium, dátum, cím
  rövid kivonata, ha szabad), kinyert entitásokat, éllistákat és aggregált mérőszámokat. Közösségimédia-adatból csak
  anonimizált, nyilvánosan közzétett kutatási adatkészletek aggregátumai szerepelnek.

### Előfeltételek és kapcsolatok más témakörökkel
- **Valószínűségszámítás:** kombinatorika (1. fejezet → élszámok, $\binom n2$), feltételes valószínűség, binomiális és
  Poisson-eloszlás (→ véletlen gráfok fokszámeloszlása, 7. fejezet), Markov-láncok szemlélete (→ véletlen séta, PageRank).
- **Matematikai statisztika:** korreláció (3. fejezet → QAP-korreláció, asszortativitás), hipotézisvizsgálat és
  permutációs próba (→ nullmodellek, 10. fejezet), regresszió (→ MRQAP).
- **Mesterséges intelligencia:** beágyazások és figyelem (12. fejezet), **gráf neurális hálók (13. fejezet)** – a III. blokk
  nem tanítja újra a GNN-alapokat, hanem hivatkozik rájuk („🔁 Emlékeztető” dobozokkal), és a hírelemzéshez szükséges
  kiterjesztésekre (heterogén, időbeli, tudásgráf, szöveggráf) koncentrál. Kapcsolat: RAG / GraphRAG (MI 18.),
  ajánlórendszerek (MI 23.).
- **Lineáris algebra minimum** (mátrixszorzás, sajátvektor): a 4. fejezet önállóan összefoglalja „🔁 Emlékeztető”-ként.
- **Ágensalapú modellezés:** terjedési és véleménydinamikai modellek hálózaton (9. fejezet) – a szakdolgozati
  ABM-ötlethez (`Projects/szakdolgozat/resources/ABM es napirend-kijeloles…`) is kapcsolódik.

### Futó példák
1. **„Árvízhét”** – a témakör saját, kitalált mini hírkorpusza (a konzulensi jegyzet árvízi példájából kiindulva):
   **4 lap** (Reggeli Hírlap, Esti Krónika, Nyitott Szó, Vidéki Napló), **12 cikk** egy hét alatt, **7 szereplő / fogalom**
   (Kormány, Vízügy, Polgármester, Lakók, Önkéntesek, Szakértő, Klímaváltozás). Minden cikkhez: lap, nap, említett
   szereplők, megszólaltatott szereplők, keret (védekezés / felkészülési hiány / lakossági veszteség). Ebből épül:
   - az 1. fejezetben a szereplők **együttemlítési gráfja** (első gráf, kézzel),
   - a 3. fejezetben a **cikk–szereplő** és **lap–esemény páros gráf** és vetületeik,
   - az 5–6. fejezetben a centralitások és a háromszögek,
   - a 8. fejezetben a keretezési közösségek,
   - a 14. fejezetben a történeti módszerek „újrajátszása”,
   - a 16–17. fejezetben a lapok **napirend-hálózatai**, keretei és megszólalói,
   - a 21. fejezetben a teljes elemzési lánc „kicsiben”.
   A konkrét éllistát az 1. fejezet megírásakor rögzítjük és Pythonnal ellenőrizzük; utána **nem változik** (a későbbi
   fejezetek számai erre épülnek).
2. **Öt barát (A–E)** – az MI 13. fejezet gráfja (élek A–B, A–C, B–C, B–D, D–E), a III. blokkban a GNN-emlékeztetőkhöz.
3. **Valós hálózatok** (előre számolt JSON-ben):
   - **Zachary karateklubja** (34 csúcs, 78 él; már megvan: `mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js`)
     – közösségek, centralitás;
   - **Les Misérables** szereplőinek együttszereplési hálózata (77 csúcs; Knuth, 1993) – a „ki kivel jelenik meg”
     hálózat irodalmi előképe, híd a hírek entitáshálózataihoz;
   - **politikai blogok** (Adamic–Glance, 2005; ~1 200 csúcs az óriáskomponensben) – hivatkozási hálózat, polarizáció,
     HITS / PageRank;
   - **Twitter15/16** vagy **PHEME** terjedési fák (kis részhalmaz) – kaszkádok, álhírfelismerés;
   - **GDELT** (nyílt eseményadat) kis, Magyarországra szűrt kivonata – szereplő–esemény hálózat, időbeli gráf;
   - **MIND** (Microsoft News Dataset) kis részhalmaza – hírajánlás tudásgráffal (licencfeltételek ellenőrzendők).
   Az adatkészletek elérhetőségét és licencét a `_parts/graf/research.md` rögzíti.

### Források (rövidítések)
A `Topics/` mappában nincs gráfelméleti forráskönyv, ezért a témakör nagyrészt **szabadon elérhető, standard tankönyvekre**
és a szakdolgozati jegyzetekre épül:

| Rövidítés | Forrás | Szerep |
|---|---|---|
| **NSB** | A.-L. Barabási: *Network Science* (Cambridge UP, 2016; szabadon olvasható: networksciencebook.com) | a II. blokk gerince: véletlen, kisvilág-, skálafüggetlen hálózatok, közösségek, terjedés |
| **NEW** | M. E. J. Newman: *Networks* (2. kiad., Oxford UP, 2018) | matematikai gerinc: mérőszámok, spektrális módszerek, modellek, terjedés |
| **EK** | D. Easley – J. Kleinberg: *Networks, Crowds, and Markets* (Cambridge UP, 2010; szabadon elérhető) | strukturális egyensúly, gyenge kötések, kaszkádok, PageRank / HITS, információs kaszkádok |
| **KDG** | Kőnig D.: *Theorie der endlichen und unendlichen Graphen* (1936) és magyar egyetemi jegyzetek (pl. Katona–Recski–Szabó: *A számítástudomány alapjai*) | gráfelméleti alapok, magyar terminológia |
| **GRL** | W. L. Hamilton: *Graph Representation Learning* (2020) | III. blokk: beágyazások, GNN-ek, tudásgráfok |
| **MENC** | F. Menczer – S. Fortunato – C. A. Davis: *A First Course in Network Science* (Cambridge UP, 2020) | bevezető, sok Python-példa, közösségi média, félretájékoztatás |
| **SAJ** | saját jegyzetek: `ME/ACTIVE/Optimalizálás/Gráfok - elmélet.md`, `Graph notes.md` | formális definíciók, magyar megfogalmazás |
| **NAS** | `Projects/szakdolgozat/Network Agenda Setting (NAS) - atfogo ismerteto.md` | a 16. fejezet gerince, a 14. fejezet NAS-történeti része: elmélet, Guo öt lépése, kritika, konszenzustérkép |
| **HHSZ** | `Projects/szakdolgozat/resources/hirocikkek-halozatelemzese-szakirodalom.md` | a 15. és 18. fejezet: cikk-, szöveg-, médiumhálózatok; story chains; szövegátvétel |
| **HKK** | `Projects/szakdolgozat/resources/hirkeretezes-kutatasi-hatter.md`, `idea_creation.md` | a 17. és 21. fejezet: keretezés, megszólalók, eseményalapú összehasonlítás |
| **PDF** | `Projects/szakdolgozat/resources/pdf/` (MediaGraph; Computational News Framing Analysis via Community Detection; Textual network analysis; Network analysis reveals news press landscape; The Power of Information Networks; Network Agenda Setting or Networked Framing – YouTube) | IV. blokk esettanulmányai |
| **RES** | `_parts/graf/research.md` – Consensus- és webes szakirodalmi összefoglaló (2026-10-30) | a IV. blokk 2020–2026-os eredményei, adatkészletek |

---

## A fejezetek áttekintése

| # | Fejezet | Blokk | Szint |
|---|---|---|---|
| 1 | Mi a hálózat? Gráfok a hírekben és mindenütt | I. Gráfelméleti alapok | ★ |
| 2 | Séták, utak, összefüggőség és fák | I. Gráfelméleti alapok | ★ |
| 3 | Gráftípusok: irányított, súlyozott, páros, időbeli, többrétegű | I. Gráfelméleti alapok | ★–★★ |
| 4 | Gráfok és mátrixok: véletlen séta, sajátvektorok, Laplace-mátrix | I. Gráfelméleti alapok | ★★ |
| 5 | Centralitás: ki a fontos a hálózatban? | II. Hálózattudomány | ★★ |
| 6 | Helyi szerkezet: háromszögek, homofília, strukturális egyensúly | II. Hálózattudomány | ★★ |
| 7 | Hálózatmodellek és nullmodellek | II. Hálózattudomány | ★★ |
| 8 | Közösségek keresése | II. Hálózattudomány | ★★–★★★ |
| 9 | Terjedés hálózatokon: járványok, kaszkádok, vélemények | II. Hálózattudomány | ★★ |
| 10 | Hálózatok összehasonlítása és statisztikai következtetés | II. Hálózattudomány | ★★–★★★ |
| 11 | Csúcsbeágyazások és kapcsolat-előrejelzés | III. Gépi tanulás gráfokon | ★★ |
| 12 | Gráf neurális hálók heterogén, időbeli és tudásgráfokon | III. Gépi tanulás gráfokon | ★★–★★★ |
| 13 | Szövegből gráf: együttelőfordulás, entitások, tudásgráfok, GraphRAG | III. Gépi tanulás gráfokon | ★★ |
| 14 | Hálózatok a média- és hírkutatásban: történeti áttekintés | IV. Hírelemzés hálózatokkal | ★ |
| 15 | Hírkorpuszból hálózat: cikkek, események, hírláncok | IV. Hírelemzés hálózatokkal | ★★ |
| 16 | Napirend-kijelölés hálózatokkal (NAS) | IV. Hírelemzés hálózatokkal | ★★ |
| 17 | Keretezés és szereplők: szemantikai és megszólalói hálózatok | IV. Hírelemzés hálózatokkal | ★★ |
| 18 | A médiarendszer térképe: médiumhálózatok, polarizáció, szövegátvétel | IV. Hírelemzés hálózatokkal | ★★ |
| 19 | Hírterjedés és félretájékoztatás hálózatokon | IV. Hírelemzés hálózatokkal | ★★–★★★ |
| 20 | Mélytanulási gráfmodellek a hírelemzésben | IV. Hírelemzés hálózatokkal | ★★★ |
| 21 | Esettanulmány: egy hírhét hálózatelemzése az elejétől a végéig | IV. Hírelemzés hálózatokkal | ★★ |

## Tanulási útvonalak

| Útvonal | Fejezetek | Kinek? |
|---|---|---|
| **Teljes út** | 1 → 21 sorban | aki alaposan meg akarja érteni a területet |
| **Gyors út a hírelemzéshez** | 1 → 3 → 5 → 6.1–6.2 → 7.4 → 8 → 10.1–10.3 → 14 → 15 → 16 → 17 → 18 → 21 | kommunikáció- és médiakutató, aki hálózatelemzést akar használni, gépi tanulás nélkül |
| **Gépi tanulásos út** | 1 → 3 → 4 → 5 → 8 → 11 → 12 → 13 → 15 → 19 → 20 (+ MI 12–13.) | aki hírelemző modelleket akar építeni |
| **Matematikai út** | 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (★★★ részekkel) | aki a gráfelméletet és a hálózatok matematikáját akarja |

---
# I. blokk – Gráfelméleti alapok

## 1. fejezet – Mi a hálózat? Gráfok a hírekben és mindenütt ★

**Nagy kérdés:** *Egy héten át négy lap ír ugyanarról az árvízről. Az egyik a Kormányt és a Vízügyet említi együtt, a másik
a Lakókat és az Önkénteseket. Hogyan lehet ezt a különbséget egyetlen ábrán – és utána számokkal – megmutatni?*

**Cél:** a gráf mint modell: csúcs, él, szomszédság, fokszám; ábrázolásai (rajz, éllista, szomszédsági lista, szomszédsági
mátrix); a kézfogási lemma; egyszerű gráf, hurok, többszörös él; néhány nevezetes gráf. A „mi legyen a csúcs, mi az él?”
modellezési döntés első tudatosítása.

### Felépítés
1. **1.1 Pontok és vonalak** ★ – három történet egy szerkezettel: barátságok, városok és utak, szereplők együttemlítése
   egy cikkben. Az Árvízhét első három cikkéből kézzel rajzolt gráf. Definíció: $G = (V, E)$; szomszédos csúcsok;
   illeszkedés. `box history`: Euler és a königsbergi hidak (1736) – a gráfelmélet születése; Kőnig Dénes (1936) első
   gráfelméleti tankönyve.
2. **1.2 Mi legyen a csúcs, és mi az él?** ★ – modellezési döntések: ugyanabból a 12 cikkből három különböző gráf
   (szereplő–szereplő, cikk–cikk, lap–lap). Hüvelykujjszabály: **„az él egy állítás – mondd ki, mit állít”** (pl. „egy
   cikkben szerepelnek”, „ugyanarról az eseményről szólnak”, „hivatkozik rá”). Buktató: az együttemlítés nem jelent
   egyetértést vagy kapcsolatot.
3. **1.3 Fokszám és a kézfogási lemma** ★ – fokszám, izolált csúcs, levél; $\sum_v d(v) = 2m$ kézzel ellenőrizve, majd
   „miért?”: minden él két végpontot ad. Következmény: a páratlan fokú csúcsok száma páros. Fokszámsorozat.
4. **1.4 Ábrázolások** ★ – éllista, szomszédsági lista, szomszédsági mátrix ugyanarra a gráfra; a mátrix szimmetrikus
   (irányítatlan gráf), főátlója 0 (egyszerű gráf); sorösszeg = fokszám. Mikor melyik ábrázolás jó (ritka gráf → lista).
   Ritkaság: $m \ll \binom n2$ – a valós hálózatok szinte mind ritkák; sűrűség $\rho = m / \binom n2$.
5. **1.5 Egyszerű gráf, hurok, többszörös él** ★ – a saját jegyzet (SAJ) $(V, E, \varphi)$ definíciója; mikor kell a
   többszörös él (két szereplő több cikkben is együtt → többszörös él vagy **súly**? – előremutatás a 3. fejezetre).
6. **1.6 Nevezetes gráfok** ★ – teljes gráf $K_n$ ($\binom n2$ él), út $P_n$, kör $C_n$, csillag $S_n$, üres gráf; komplementer;
   izomorfia szemléletesen („ugyanaz a gráf, másképp lerajzolva”) – a csúcsok átszámozása nem változtat a gráfon.
7. **1.7 Alkalmazás: az Árvízhét együttemlítési gráfja** ★ – a teljes 12 cikkből a 7 szereplő gráfja; lapokra bontva négy
   kis gráf egymás mellett (`two-col`). Első megfigyelés: a lapok gráfjai „másképp néznek ki” – a II. blokk adja hozzá a
   mérőszámokat.

### Kidolgozott példák
- 5 csúcs, 6 él: fokszámok, $\sum d = 12 = 2 \cdot 6$.
- Lehet-e 5 embernek egy társaságban rendre 1, 2, 2, 3, 3 ismerőse? (Nem: páratlan fokszámösszeg.)
- $K_7$ éleinek száma: $\binom72 = 21$; a 7 szereplős Árvízhét-gráf sűrűsége $m / 21$.
- Ugyanaz a gráf két rajzban + két számozásban: két különböző mátrix, ugyanaz a fokszámsorozat.
- Egy cikk 4 szereplőt említ → 4 csúcsú teljes részgráf ($\binom42 = 6$ él) – „egy cikk = egy klikk” az együttemlítési
  modellben (buktató: a hosszú cikkek túl sok élt adnak).

### Interaktív szemléltetések
- `graph-draw` – a témakör alapwidgetje: kattintással csúcs, húzással él; élőben a fokszámok, $\sum d = 2m$ ellenőrzés,
  éllista / szomszédsági lista / mátrix fülek. (A közös `assets/graph.js`-re épül, más fejezetek is beágyazzák.)
- `handshake` – véletlen fokszámsorozat-generátor: „rajzolható-e?” – a gép mutatja, ha a fokszámösszeg páratlan
  (az Erdős–Gallai-feltétel ★★★ lenyílóban).
- `cooccurrence-builder` – az Árvízhét cikkkártyái; bekapcsolod, mely cikkek számítsanak, és élőben épül az
  együttemlítési gráf; lapszűrő.
- `isomorphism-game` – két rajz: ugyanaz a gráf-e? (húzd a csúcsokat, amíg fedik egymást).

### Kvízek
`gh1-11` … `gh1-17`, `gh1-final`.

> ✅ **Elkészült** (`01-mi-a-halozat/`, 2026-10-30). Kvízek: `gh1-11` … `gh1-17`, `gh1-final` (63 kérdés). 6 widget: `three-graphs`, `handshake`,
> `graph-draw`, `named-graphs`, `isomorphism-game`, `cooccurrence-builder`; statikus ábrák a közös `assets/graph.js` `.gfig` elemével.
> Az Árvízhét adatai rögzítve: `grafelmelet-halozattudomany/arvizhet-data.js` (ellenőrzés: `_parts/gh1/arviz.py`). Teljes szereplőgráf: 7 csúcs, 10 él,
> fokszámok Ko 4, Po 4, Vi 3, Sz 3, Kl 2, La 2, Ön 2; erősség Po 8, Ko 6, Vi/La/Ön 5, Sz 4, Kl 3; multigráf 18 él; komplementer 11 él.
> Lapgráfok: RH $K_3$ (Ko, Vi, Po), EK háromszög + levél (Sz középpont), NY $K_3$ (La, Ön, Po), VN csillag $K_{1,3}$ (Po). Az árvízi 8. fejezet „nagy kérdése”
> a tényleges közösségekhez igazítandó. Összeállítás: `_parts/gh1/build.sh`.

### Csapdák
A rajz elrendezése nem információ (két közeli csúcs nem feltétlenül szomszédos) · a fokszám nem fontosság · az
együttemlítés nem kapcsolat · irányítatlan gráf mátrixa szimmetrikus, irányítotté nem (3. fejezet) · a „hálózat” ábrája
egy modellezési döntés eredménye.

### Források
NSB 2; NEW 6; EK 2; KDG; SAJ (Gráfok – elmélet); HHSZ (a vizsgálat három szintje); HKK (árvízi példa).

---

## 2. fejezet – Séták, utak, összefüggőség és fák ★

**Nagy kérdés:** *Hány „kézfogásnyira” van két szereplő az Árvízhét gráfjában – és igaz-e, hogy bárki bárkivel összeköthető
hat lépésben?*

**Cél:** séta, út, kör; összefüggőség, komponensek; távolság, átmérő; szélességi bejárás (BFS) és legrövidebb út;
súlyozott legrövidebb út (Dijkstra); fák és feszítőfák; Euler-séta (és a Hamilton-kör nehézsége). Kisvilág-élmény
előkészítése.

### Felépítés
1. **2.1 Séta, út, kör** ★ – definíciók egy 6 csúcsú gráfon, teljes felsorolással (összes A→F út). `box tip`: séta vs. út,
   angol *walk / path*.
2. **2.2 Összefüggőség és komponensek** ★ – komponens, izolált csúcs, óriáskomponens (előremutatás: 7. fejezet);
   hírpélda: a lapgráfokban a „Klímaváltozás” csúcs csak egy lapnál kapcsolódik a többihez.
3. **2.3 Távolság és szélességi bejárás** ★ – távolság $d(u, v)$; BFS lépésenként rétegekkel (sorral); excentricitás, átmérő,
   átlagos úthossz. `box history`: Karinthy Frigyes *Láncszemek* (1929) és Milgram (1967) – „hat lépés”.
4. **2.4 Súlyozott legrövidebb út** ★★ – amikor az élnek hossza / költsége van; Dijkstra algoritmusa kézzel 5 csúcson;
   buktató: negatív súly; a súly mint **erősség** vs. **távolság** (ha a súly erősség, a távolság $1/w$ – gyakori hiba).
5. **2.5 Fák** ★ – fa = összefüggő, körmentes; ekvivalens jellemzések ($n - 1$ él; bármely két csúcs között egyetlen út);
   feszítőfa; minimális feszítőfa (Kruskal) röviden. Hírpélda: egy hír **terjedési fája** (ki kitől osztotta meg; →
   19. fejezet).
6. **2.6 Euler és Hamilton** ★★ – königsbergi hidak, Euler tétele (páros fokszámok); Hamilton-kör: egyszerű kérdés,
   nehéz feladat – a „könnyű” és „nehéz” gráfproblémák első példája (`box tip`, NP-nehézség szemléletesen).
7. **2.7 Séták száma és a mátrixhatványok** ★★ – $(A^k)_{ij}$ = $k$ hosszú séták száma $i$-ből $j$-be; kézzel $A^2$ a 4 csúcsú
   gráfon; közös szomszédok száma = $(A^2)_{ij}$ (→ 11. fejezet: kapcsolat-előrejelzés).

### Kidolgozott példák
- BFS rétegei egy 7 csúcsú gráfon; átmérő és átlagos úthossz.
- Dijkstra: 5 város, súlyozott utak – a legrövidebb út nem a legkevesebb élű.
- „Hány éle van egy 12 csúcsú fának?” (11) – és miért.
- $A^2$ egy négyzet + átló gráfra; a főátló = fokszámok.
- Königsberg: 4 csúcs, fokszámok 5, 3, 3, 3 → nincs Euler-séta.

### Interaktív szemléltetések
- `bfs-animator` – BFS lépésenként a `graph-draw` gráfján: sor tartalma, rétegek színezve, távolságok a csúcsokon.
- `dijkstra-step` – Dijkstra lépésenként, ideiglenes / végleges címkékkel; kapcsoló: „súly = erősség” → automatikus $1/w$.
- `components` – élek törlése kattintással; a komponensek színe élőben változik (hídél kiemelése).
- `walk-counter` – $A^k$ elemei; csúcspár kiválasztásakor a $k$ hosszú séták felsorolva.
- `konigsberg` – a hidak gráfja; hidak hozzáadása / elvétele, amíg Euler-séta lesz.

### Kvízek
`gh2-21` … `gh2-27`, `gh2-final`.

### Csapdák
Séta ≠ út · a súly erősség vagy távolság? · a nem összefüggő gráf átmérője végtelen (a programok gyakran csendben az
óriáskomponensen számolnak) · „hat lépés” ≠ „bárki elérhető” (a kereshetőség más kérdés).

### Források
NSB 2–3; NEW 6, 8; EK 2, 20; KDG; SAJ.

---

## 3. fejezet – Gráftípusok: irányított, súlyozott, páros, időbeli, többrétegű ★–★★

**Nagy kérdés:** *Az Árvízhét adatából egyszerre akarjuk látni, melyik lap melyik eseményről írt, ki kit idézett, és hogyan
változott mindez napról napra. Milyen gráf bírja el ezt az információt?*

**Cél:** a valós hálózatok gazdagabb gráftípusai – és mindegyiknél, **mi vész el**, ha egyszerű gráfra egyszerűsítjük.
Ez a fejezet a IV. blokk kulcs-előfeltétele.

### Felépítés
1. **3.1 Irányított gráfok** ★ – befok, kifok; irányított út; erősen és gyengén összefüggő komponensek; nem szimmetrikus
   mátrix. Hírpélda: hivatkozási háló (lap → lap link), idézési háló (cikk → megszólaló).
2. **3.2 Súlyozott gráfok** ★ – élsúly, erősség (súlyozott fokszám); a 12 cikk együttemlítési gráfja súllyal (hány cikkben
   szerepelnek együtt); normalizálás (pl. a lap cikkszámával) – miért kell (HKK: „tíz cikk más súlyt jelent…”).
3. **3.3 Előjeles gráfok** ★ – pozitív / negatív él (egyetért / bírál; szövetséges / ellenfél); előkészíti a strukturális
   egyensúlyt (6. fejezet).
4. **3.4 Páros gráfok és vetületük** ★★ – két csúcstípus, élek csak a típusok között: **cikk–szereplő**, **lap–esemény**,
   **felhasználó–hír**. Egymódusú vetület: $B B^\top$ (közös szomszédok száma) – kézzel a 4 lap × 6 esemény mátrixon.
   Mi vész el a vetítéskor (egy 10 szereplős cikk 45 élt ad; a vetület tele van klikkekkel); normalizált vetületek
   (Jaccard, Newman-féle súlyozás) bevezetése. Kőnig tétele (páros gráf ⇔ nincs páratlan kör) ★★★ lenyílóban.
5. **3.5 Időbeli gráfok** ★★ – időbélyeges élek; pillanatfelvétel-sorozat vs. eseményfolyam; **időben érvényes út**
   (csak előre haladó időbélyegekkel): A→B hétfőn, B→C vasárnap – de C→D kedden nem folytatja. Ablakméret választása
   (napi / heti gráf) mint döntés.
6. **3.6 Többrétegű és heterogén gráfok** ★★ – rétegek (ugyanazok a lapok hivatkozási, közös-esemény és szövegátvételi
   rétege); heterogén gráf: több csúcs- és éltípus (lap, cikk, szereplő, esemény, téma) – a hírelemzés természetes adatmodellje
   (→ 12. és 20. fejezet). Hipergráf röviden: egy cikk = egy hiperél a szereplői fölött (a klikk-kibontás alternatívája).
7. **3.7 Tudásgráf: hármasok** ★ – (alany, állítmány, tárgy): (Polgármester, *bírálja*, Kormány); a tudásgráf mint
   irányított, címkézett élű multigráf; előremutatás a 13. fejezetre.
8. **3.8 Alkalmazás: az Árvízhét adatmodellje** ★★ – egy döntési táblázat: kutatási kérdés → gráftípus → csúcs, él, súly,
   idő (a HHSZ táblázata alapján: cikkhasonlósági, szövegátvételi, szemantikai, médium–esemény, hivatkozási, időbeli
   médiumhálózat).

### Kidolgozott példák
- Irányított 4 csúcsú gráf befokai / kifokai; $\sum$ befok = $\sum$ kifok = $m$.
- Páros 4 × 6-os illeszkedési mátrix → lapvetület $BB^\top$ (főátló = a lap lefedett eseményeinek száma).
- Egy 10 szereplős cikk vetületben: 45 él – és a súlyozás $1/(k - 1)$-gyel.
- Időben érvényes utak felsorolása egy 4 élű időbeli gráfon.
- Ugyanaz a három lap két rétegben: hivatkozás vs. közös esemény – a két réteg mást mond.

### Interaktív szemléltetések
- `bipartite-projection` – a fejezet fő widgetje: lap–esemény páros gráf (élek kapcsolgathatók), mellette élőben a lapvetület
  és az eseményvetület; súlyozás-választó (darabszám / Jaccard / Newman).
- `temporal-paths` – idővonal-csúszka; az időbeli gráf pillanatfelvételei; „ki érhető el A-ból időben érvényes úton?”
- `multilayer-view` – három réteg egymás felett, rétegkapcsolók; az összevont (aggregált) gráf mellette.
- `graph-type-chooser` – kutatási kérdés kártyák → a tanuló választ gráftípust → visszajelzés (játék).

### Kvízek
`gh3-31` … `gh3-38`, `gh3-final`.

### Csapdák
A vetítés információt veszít és torzítja a fokszámokat · irányított gráfot irányítatlanként elemezni · a súly egysége
(darab? arány?) · az aggregált időbeli gráfban „utak” jelennek meg, amelyek időben nem léteztek.

### Források
NSB 2; NEW 6; MENC 1; HHSZ; HKK; Holme–Saramäki (2012) *Temporal networks* (Physics Reports); Kivelä et al. (2014)
*Multilayer networks* (J. Complex Networks).

---

## 4. fejezet – Gráfok és mátrixok: véletlen séta, sajátvektorok, Laplace-mátrix ★★

**Nagy kérdés:** *Ha egy olvasó linkről linkre kattintgat a híroldalak között, hol fog a legtöbb időt tölteni? – És hogyan
vágható ketté egy hálózat úgy, hogy a lehető legkevesebb élt kelljen elvágni?*

**Cél:** a gráf lineáris algebrája annyiban, amennyi a centralitáshoz (5.), a közösségkereséshez (8.), a beágyazásokhoz
(11.) és a GNN-ekhez (12.) kell. „🔁 Emlékeztető” dobozok: mátrixszorzás, sajátérték, sajátvektor.

### Felépítés
1. **4.1 Emlékeztető: mátrix–vektor szorzás mint „szomszédok összegzése”** ★ – $A\mathbf x$ $i$-edik eleme a szomszédok
   értékeinek összege; ez minden későbbi algoritmus magja (vö. MI 13.3 üzenetküldés).
2. **4.2 Véletlen séta** ★★ – átmenetmátrix $P = D^{-1}A$; eloszlás lépésenként $\mathbf p_{t+1}^\top = \mathbf p_t^\top P$;
   stacionárius eloszlás irányítatlan gráfon $\pi_i = d_i / 2m$ (kézzel ellenőrizve). Kapcsolat a Valószínűségszámítás
   Markov-lánc szemléletével.
3. **4.3 Sajátvektorok szemléletesen** ★★ – hatványiteráció: ismételt $A\mathbf x$ + normálás → domináns sajátvektor; ez
   lesz a sajátvektor-centralitás és a PageRank (5. fejezet). Perron–Frobenius tétel kimondva (★★★ lenyíló).
4. **4.4 A Laplace-mátrix** ★★ – $L = D - A$; $\mathbf x^\top L \mathbf x = \sum_{(i,j) \in E} (x_i - x_j)^2$ – „mennyire
   simított a jel a gráfon”; a 0 sajátérték multiplicitása = komponensek száma.
5. **4.5 Spektrális kettévágás** ★★★ – a Fiedler-vektor előjele szerinti kettévágás; két háromszög egy híddal → tökéletes
   vágás; a karateklub két fele. Előremutatás: spektrális klaszterezés (8.), spektrális beágyazás (11.), GCN szűrő (MI 13.4).

### Kidolgozott példák
- $A\mathbf x$ egy 4 csúcsú úton.
- Véletlen séta 3 lépése egy 4 csúcsú gráfon; stacionárius eloszlás = fokszám / $2m$.
- Hatványiteráció 5 lépése egy csillag + él gráfon.
- $L$ és $\mathbf x^\top L\mathbf x$ egy 3 csúcsú úton két különböző $\mathbf x$-re (sima vs. „ugráló” jel).
- Fiedler-vektor két háromszög + híd gráfon (értékek Pythonból).

### Interaktív szemléltetések
- `random-surfer` – egy „olvasó” bolyong a gráfon; a látogatási gyakoriságok hisztogramja konvergál $d_i/2m$-hez.
- `power-iteration` – lépésenként a vektor a csúcsokon (méret = érték), konvergenciagörbe.
- `laplacian-smooth` – csúcsértékek csúszkával; $\mathbf x^\top L\mathbf x$ élőben; a Fiedler-vektor gombnyomásra.
- `spectral-cut` – szerkeszthető gráf + Fiedler-vektor szerinti színezés + a vágott élek száma.

### Kvízek
`gh4-41` … `gh4-45`, `gh4-final`.

### Csapdák
Irányított gráfon a véletlen séta „beragadhat” (zsákutca) → PageRank-teleportálás (5.) · a sajátvektor előjele önkényes ·
a normalizált és nem normalizált Laplace-mátrix keverése.

### Források
NEW 6, 11; NSB 4 (melléklet); EK 14; GRL 2; MI 2. és 13. fejezet.

---

# II. blokk – Hálózattudomány

## 5. fejezet – Centralitás: ki a fontos a hálózatban? ★★

**Nagy kérdés:** *Az Árvízhét gráfjában ki a „legfontosabb” szereplő: akit a legtöbbször említenek, aki mindenkihez közel van,
akin át a legtöbb kapcsolat fut, vagy akit fontos szereplők említenek? – És miért adnak ezek más-más választ?*

**Cél:** a centralitás mint **a „fontosság” különböző definíciói**: fokszám-, közelségi, köztességi, sajátvektor-centralitás,
PageRank, HITS (hub / authority). Mikor melyik illik a kutatási kérdéshez.

### Felépítés
1. **5.1 Fokszám-centralitás** ★ – a legegyszerűbb; normalizálás $n - 1$-gyel; súlyozott változat (erősség); befok / kifok
   irányított gráfon (idézett vs. idéző). Hírelemzés: az első szintű napirend-kijelölés „kiemeltsége” lényegében fokszám /
   gyakoriság.
2. **5.2 Közelségi centralitás** ★★ – átlagos távolság reciproka; harmonikus változat nem összefüggő gráfra.
3. **5.3 Köztességi centralitás** ★★ – a legrövidebb utak hány százaléka megy át rajta; kézzel egy 5 csúcsú „híd” gráfon;
   hídszereplő (broker), strukturális lyukak (Burt) szemléletesen; hírpélda: a „Szakértő” két keret között.
4. **5.4 Sajátvektor-centralitás** ★★ – „fontos, akit fontosak említenek”: $\lambda \mathbf x = A\mathbf x$; hatványiteráció
   a 4. fejezetből.
5. **5.5 PageRank** ★★ – a véletlen szörföző + teleportálás ($\alpha = 0{,}85$); zsákutcák kezelése; kézzel 4 csúcson
   3 iteráció; `box history`: Brin–Page (1998).
6. **5.6 HITS: hubok és tekintélyek** ★★★ – két szerep irányított gráfon (gyűjtőoldal vs. eredeti forrás); hírpélda:
   hírösszesítők (hub) vs. eredeti tudósítók (authority).
7. **5.7 Melyik centralitást mikor?** ★★ – döntési táblázat kutatási kérdés szerint; centralitások korrelációja valós
   hálózatokon; ugyanazon gráfon a különböző rangsorok egymás mellett (`two-col`).
8. **5.8 Alkalmazás** ★★ – Árvízhét: lapokra bontott centralitás-rangsorok (melyik lapnál központi a Kormány, melyiknél a
   Lakók); politikai blogok: PageRank és HITS a két tábor között.

### Kidolgozott példák
- Csillag + út („sárkány” gráf): a fokszám, a közelség és a köztesség három különböző „győztest” ad.
- Köztesség kézzel: két háromszög egy közös csúccsal → a középső csúcs köztessége.
- PageRank 3 iteráció egy 4 csúcsú irányított gráfon, zsákutcával és anélkül.
- Sajátvektor-centralitás: két csúcs azonos fokszámmal, de különböző szomszédokkal.
- HITS két iterációja egy 5 oldalas hivatkozási gráfon.

### Interaktív szemléltetések
- `centrality-explorer` – a fejezet fő widgetje: szerkeszthető gráf, centralitásválasztó; csúcsméret = érték; mellette
  rangsortáblázat; „versenyző” mód: két centralitás rangsora egymás mellett, eltérések kiemelve.
- `pagerank-surfer` – $\alpha$ csúszka; a szörföző animáció és a PageRank-értékek; zsákutca-kapcsoló.
- `betweenness-paths` – csúcs kijelölésekor az összes rajta átmenő legrövidebb út kiemelve.
- `polblogs-hits` – politikai blogok (előre számolt elrendezés), színezés tábor szerint, PageRank / HITS / fokszám váltás.
- `arvizhet-centrality` – négy lap gráfja egymás mellett, ugyanazzal a centralitással.

### Kvízek
`gh5-51` … `gh5-58`, `gh5-final`.

### Csapdák
A centralitás a választott élmodellhez képest „fontos”, nem önmagában · a köztesség érzékeny a hiányzó élekre ·
normalizált vs. nyers értékek összehasonlítása különböző méretű gráfok között · a PageRank irányítatlan gráfon közel
arányos a fokszámmal · a centralitás nem oksági hatás.

### Források
NEW 7; EK 14; NSB 4 (melléklet); MENC 2; Freeman (1977/1979); Bonacich (1987); Brin–Page (1998); Kleinberg (1999);
Adamic–Glance (2005).

---

## 6. fejezet – Helyi szerkezet: háromszögek, homofília, strukturális egyensúly ★★

**Nagy kérdés:** *Ha a Polgármester és a Lakók is szerepelnek a Kormánnyal egy-egy cikkben, szerepelnek-e egymással is? –
És ha két szereplő ugyanazt bírálja, „szövetségesek”-e a hírek világában?*

**Cél:** háromszögek és klaszterezettség; homofília és asszortativitás; gyenge kötések; strukturális egyensúly előjeles
gráfon; motívumok röviden.

### Felépítés
1. **6.1 Háromszögek és klaszterezettség** ★ – helyi klaszterezettségi együttható $C_i = \frac{2 T_i}{k_i (k_i - 1)}$ kézzel;
   globális (tranzitivitás) vs. átlagos; háromszögek száma $= \operatorname{tr}(A^3)/6$.
2. **6.2 Homofília és asszortativitás** ★★ – „hasonló a hasonlóval”: kategóriás asszortativitás (pl. lap politikai
   besorolása), fokszám-asszortativitás; korrelációként (Mat. stat. 3. fejezet). Hírpélda: a politikai blogok erősen
   homofilek.
3. **6.3 Gyenge kötések ereje** ★★ – Granovetter (1973): a hidak gyenge kötések; triadikus zárás; hírpélda: egy témát a
   „hídszereplők” visznek át egyik keretből a másikba.
4. **6.4 Strukturális egyensúly** ★★ – előjeles háromszögek négy típusa; Heider-féle egyensúly („barátom barátja barátom,
   ellenségem ellensége barátom”); egyensúlyi tétel (Cartwright–Harary): kiegyensúlyozott teljes gráf két táborra bomlik;
   hírpélda: szereplők közötti támogató / bíráló kijelentésekből épített előjeles gráf → polarizáció mértéke.
5. **6.5 Motívumok** ★★★ – kis részgráfok gyakorisága a nullmodellhez képest (→ 7.); irányított triádok (a 16 triádtípus
   röviden); feed-forward hurok a hírátvételben.

### Kidolgozott példák
- Klaszterezettség egy 5 csúcsú gráf minden csúcsára; átlagos vs. globális eltérése.
- Asszortativitás 6 csúcson két csoporttal: 0-hoz közeli vs. erősen pozitív.
- Előjeles háromszögek: melyik kiegyensúlyozott ($+++$, $+--$) és melyik nem ($++-$, $---$).
- Egy kiegyensúlyozott 5 csúcsú előjeles gráf két táborra bontása.

### Interaktív szemléltetések
- `triangle-counter` – csúcsra kattintva a szomszédai közti élek kiemelve, $C_i$ levezetése.
- `homophily-slider` – két csoport, a csoporton belüli / közötti élvalószínűség csúszkával; asszortativitás élőben.
- `balance-game` – előjeles gráf; élek előjelének átkapcsolása; a kiegyensúlyozatlan háromszögek pirosan; „bontsd két
  táborra” feladat.
- `weak-ties` – élsúlyok + hídélek kiemelése; a hídél törlése szétszakítja a komponenst.

### Kvízek
`gh6-61` … `gh6-65`, `gh6-final`.

### Csapdák
Átlagos és globális klaszterezettség különböző szám · a homofília és a társadalmi befolyás nem különíthető el
megfigyelési adatból (Shalizi–Thomas, 2011) · az együttemlítési gráfban a háromszögek egy része „gyári” (egy cikk = klikk)
· az előjel kinyerése szövegből hibás lehet (irónia, idézett vélemény).

### Források
NEW 7, 10; EK 3, 5; NSB 2; Granovetter (1973); Heider (1946); Cartwright–Harary (1956); McPherson et al. (2001);
Milo et al. (2002) motívumok.

---

## 7. fejezet – Hálózatmodellek és nullmodellek ★★

**Nagy kérdés:** *Az Árvízhét gráfjában a Kormány és a Vízügy 5 cikkben szerepel együtt. Sok ez – vagy csak annyi, amennyi
két gyakran említett szereplőnél véletlenül is várható?*

**Cél:** véletlen gráfmodellek mint (1) a valós hálózatok magyarázatai és (2) **nullmodellek**, amelyekhez mérünk.
Erdős–Rényi, kisvilág, skálafüggetlen modellek, konfigurációs modell, z-pontszám és permutációs gondolkodás.

### Felépítés
1. **7.1 Erdős–Rényi-gráf** ★★ – $G(n, p)$; várható élszám $p\binom n2$, fokszám binomiális → Poisson (Valószínűségszámítás
   4. fejezet); az óriáskomponens megjelenése $\langle k \rangle = 1$-nél (fázisátalakulás); `box history`: Erdős Pál és
   Rényi Alfréd (1959–60).
2. **7.2 Kisvilág-hálózatok** ★★ – Watts–Strogatz (1998): rácsból kis újrahuzalozással rövid utak + magas klaszterezettség.
3. **7.3 Skálafüggetlen hálózatok** ★★ – hatványfüggvény-fokszámeloszlás, hubok; Barabási–Albert (1999): növekedés +
   preferenciális kapcsolódás; log–log ábra. **⚖️ Konszenzus és vita:** Broido–Clauset (2019) „a skálafüggetlen hálózatok
   ritkák” vs. Barabási-válasz; a mai álláspont: a nehéz farkú fokszámeloszlás gyakori, a tiszta hatványfüggvény
   statisztikailag ritkán igazolható.
4. **7.4 Nullmodellek: a konfigurációs modell** ★★ – ugyanaz a fokszámsorozat, véletlen élek; várható élszám két csúcs
   között $\approx k_i k_j / 2m$ (→ modularitás, 8.); élcserés újrahuzalozás; z-pontszám
   $z = (x_{\text{megfigyelt}} - \bar x_{\text{null}}) / s_{\text{null}}$. Hírpélda: „sok-e az 5 közös cikk?” – a két szereplő
   gyakoriságát megtartó nullmodellel.
5. **7.5 Melyik nullmodell?** ★★★ – mit tartunk fixen (csúcsszám, élszám, fokszámok, cikkenkénti szereplőszám, lapok
   cikkszáma); páros gráfok nullmodelljei (fix fokszámú páros újrahuzalozás); hüvelykujjszabály: **„a nullmodell azt tartja
   meg, amit nem akarsz felfedezésnek tekinteni”**.

### Kidolgozott példák
- $G(10; 0{,}2)$ várható élszáma (9) és fokszáma (1,8).
- Az óriáskomponens küszöbe $n = 1000$-nél: $p \approx 0{,}001$.
- Konfigurációs modell: két csúcs 4 és 3 fokszámmal, $m = 20$: várható közös élszám $\approx 0{,}3$.
- z-pontszám: megfigyelt 5 közös cikk, null átlag 2,1, szórás 1,0 → $z = 2{,}9$.
- Ugyanaz a fokszámsorozat két különböző gráfban (élcsere).

### Interaktív szemléltetések
- `er-giant` – $G(n, p)$ élőben, $\langle k \rangle$ csúszka; a legnagyobb komponens aránya görbén; a fázisátalakulás.
- `watts-strogatz` – újrahuzalozási valószínűség csúszka (log skála); $C(p)/C(0)$ és $L(p)/L(0)$ görbe.
- `ba-growth` – preferenciális kapcsolódás animálva; fokszámeloszlás log–log; ER-rel összevetve.
- `null-model-lab` – a fejezet fő widgetje: Árvízhét-gráf; „1000 véletlen gráf a nullmodellből” gomb → hisztogram, rajta a
  megfigyelt érték és a z-pontszám; nullmodell-választó (ER / konfigurációs / cikkenkénti permutáció).

### Kvízek
`gh7-71` … `gh7-75`, `gh7-final`.

### Csapdák
Log–log ábrán „egyenes” ≠ hatványfüggvény · az ER nem jó nullmodell erősen heterogén fokszámú hálózathoz · egyetlen
véletlen gráf nem nullmodell (sok kell) · a z-pontszám nem normális eloszlású nullmodellnél félrevezethet (empirikus
p-érték jobb).

### Források
NSB 3–5; NEW 11–13; EK 20; Erdős–Rényi (1959); Watts–Strogatz (1998); Barabási–Albert (1999); Broido–Clauset (2019);
Holme (2019) *Rare and everywhere* (Nat. Commun.); Fosdick et al. (2018) a konfigurációs modellekről (SIAM Review).

---

## 8. fejezet – Közösségek keresése ★★–★★★

**Nagy kérdés:** *Az Árvízhét szereplői két-három csoportba rendeződnek: {Kormány, Vízügy}, {Lakók, Önkéntesek, Polgármester},
{Szakértő, Klímaváltozás}. Ezek a csoportok a hírek **keretei**? Hogyan találja meg őket egy algoritmus – és mennyire
bízhatunk benne?*

**Cél:** a közösség fogalma; modularitás; Girvan–Newman, Louvain és Leiden, címketerjesztés, spektrális klaszterezés,
sztochasztikus blokkmodell (SBM); az eredmény stabilitása és validálása. A 17. fejezet (keretezés) közvetlen előfeltétele.

### Felépítés
1. **8.1 Mi a közösség?** ★ – sűrű belül, ritka kívül; két háromszög egy híddal; a karateklub története (a klub valóban
   kettévált).
2. **8.2 Élek eltávolítása: Girvan–Newman** ★★ – a legnagyobb köztességű él törlése ismétlődően; dendrogram.
3. **8.3 Modularitás** ★★ – $Q = \frac{1}{2m}\sum_{ij}\big(A_{ij} - \frac{k_i k_j}{2m}\big)\delta(c_i, c_j)$: a megfigyelt belső
   élek mínusz a konfigurációs nullmodell szerint várható (7.4!); kézzel a két háromszög gráfon ($Q \approx 0{,}357$);
   felbontási határ.
4. **8.4 Louvain és Leiden** ★★ – mohó modularitás-optimalizálás két fázisban; a Leiden-javítás (összefüggő közösségek);
   felbontási paraméter $\gamma$.
5. **8.5 Címketerjesztés és spektrális klaszterezés** ★★ – gyors, de instabil; Fiedler-vektor (4.5) általánosítása.
6. **8.6 Sztochasztikus blokkmodell** ★★★ – generatív modell: blokkok közötti élvalószínűségek; nem csak „sűrű belül”
   szerkezetet talál (mag–periféria, kétrészes); fokszám-korrigált SBM; bayesi következtetés röviden.
7. **8.7 Megbízhatóság: stabilitás és validálás** ★★ – különböző véletlen kezdés / felbontás → különböző eredmény;
   NMI és ARI két partíció összevetésére; konszenzus-klaszterezés; nullmodell: a véletlen gráfok modularitása is
   lehet nagy (Guimerà et al., 2004). Hüvelykujjszabály: **„egy közösségfelbontás hipotézis, nem eredmény”**.
8. **8.8 Alkalmazás** ★★ – karateklub (a valódi kettéválással összevetve); Les Misérables; az Árvízhét szereplőgráfja →
   „keretjelöltek” (előremutatás a 17. fejezetre); átfedő közösségek röviden (egy szereplő több keretben).

### Kidolgozott példák
- Modularitás kézzel: két háromszög + híd, a két természetes felbontás és az „egy közösség” felbontás $Q$-ja.
- Girvan–Newman első lépése: melyik él köztessége a legnagyobb.
- Louvain első fázisa 6 csúcson: melyik áthelyezés növeli $Q$-t.
- NMI / ARI két 6 csúcsú felbontás között (egy csúcs „átcsúszik”).
- SBM: két blokk, $p_{\text{be}} = 0{,}5$, $p_{\text{ki}} = 0{,}05$ – várható élszámok.

### Interaktív szemléltetések
- `modularity-painter` – a fejezet fő widgetje: a tanuló kifesti a csúcsokat; $Q$ élőben; „győzd le a Louvaint”.
- `girvan-newman` – lépésenkénti éltörlés + dendrogram.
- `louvain-steps` – a két fázis animálva; $\gamma$ csúszka (felbontás).
- `stability-check` – ugyanaz a gráf 20 futtatással; csúcsonként „mennyire stabil a közössége” (színintenzitás);
  NMI-mátrix.
- `sbm-generator` – blokkmátrix szerkesztése → generált gráf → visszatalál-e a Louvain / az SBM?
- `karate-split` – a valódi kettéválás vs. az algoritmusok.

### Kvízek
`gh8-81` … `gh8-88`, `gh8-final`.

### Csapdák
A modularitás-maximum nem „az igazság” · felbontási határ (kis közösségek beolvadnak) · Louvain véletlen kezdéstől függ ·
nem összefüggő közösségek (Louvain) · a közösség ≠ keret ≠ téma (a 17. fejezet validálja) · nincs nullmodell →
nincs értelmezhető modularitás.

### Források
NSB 9; NEW 14; Fortunato (2010) és Fortunato–Hric (2016) áttekintések; Girvan–Newman (2002); Newman (2006); Blondel et al.
(2008) Louvain; Traag–Waltman–van Eck (2019) Leiden; Karrer–Newman (2011) DC-SBM; Peixoto (2019) bayesi SBM; Guimerà et al.
(2004); PDF: *Computational News Framing Analysis via Community Detection*.

---

## 9. fejezet – Terjedés hálózatokon: járványok, kaszkádok, vélemények ★★

**Nagy kérdés:** *Egy hír néhány óra alatt eljut mindenkihez, egy másik elhal az első megosztások után. A hír tartalmán
múlik – vagy azon is, hogy milyen hálózatban indul el?*

**Cél:** terjedési modellek hálózaton: SI / SIS / SIR, járványküszöb; független kaszkád és küszöbmodell (egyszerű vs.
összetett fertőzés); kaszkádméret-eloszlás; befolyásmaximalizálás; véleménydinamika röviden (DeGroot, korlátos bizalom) –
ezek a 19. fejezet modelljei.

### Felépítés
1. **9.1 SI és SIR egy kis gráfon** ★ – diszkrét idejű szimuláció kézzel 6 csúcson, $\beta$ fertőzési valószínűséggel;
   átlagtérközelítés (keverő populáció) vs. hálózat.
2. **9.2 Járványküszöb** ★★ – $R_0$ hálózaton: $\langle k^2 \rangle / \langle k \rangle$ szerepe; skálafüggetlen hálózatokon
   eltűnő küszöb (Pastor-Satorras–Vespignani, 2001); hubok szerepe.
3. **9.3 Független kaszkád és küszöbmodellek** ★★ – független kaszkád (minden él egyszer próbálkozik); lineáris küszöbmodell
   (Granovetter, 1978); **összetett fertőzés** (Centola–Macy, 2007): a viselkedéshez több forrás kell → a klaszterezett
   hálózat segít, a véletlen hidak nem.
4. **9.4 Kaszkádok mérése** ★★ – kaszkádméret, mélység, szélesség, **strukturális virálisság** (Goel et al., 2016:
   műsorszórás vs. virális terjedés); a kaszkádméret-eloszlás nehéz farka (a legtöbb hír nem terjed).
5. **9.5 Befolyásmaximalizálás** ★★★ – kit válasszunk kezdőnek? Kempe–Kleinberg–Tardos (2003): mohó algoritmus,
   szubmodularitás szemléletesen; „a legnagyobb fokszámú nem mindig a legjobb”.
6. **9.6 Véleménydinamika és visszhangkamrák** ★★ – DeGroot-átlagolás (→ 4. fejezet véletlen sétája), korlátos bizalom
   (Deffuant–Hegselmann–Krause) → polarizáció; homofil újrahuzalozás → visszhangkamra-modell. `box tip`: kapcsolat az
   ágensalapú modellezéssel (szakdolgozati ABM-ötlet).

### Kidolgozott példák
- SIR egy 6 csúcsú úton és csillagon, $\beta = 1$: hány lépés alatt fertőződik meg mindenki.
- Független kaszkád valószínűsége egy 3 élű úton $p = 0{,}5$-tel: $0{,}125$ a végpontig.
- Küszöbmodell: küszöb $\theta = 0{,}5$, ugyanaz a kezdőpont rácson vs. véletlen gráfon.
- $\langle k^2 \rangle / \langle k \rangle$ két 6 csúcsú gráfon azonos átlagfokszámmal.
- DeGroot 3 lépése 3 ágensen; korlátos bizalom két csoporttal.

### Interaktív szemléltetések
- `sir-network` – a fejezet fő widgetje: gráftípus-választó (rács / ER / BA / kisvilág), $\beta$, $\gamma$ csúszka, kezdőcsúcs
  kattintással; animáció + S/I/R görbék; 100 futás átlaga.
- `simple-vs-complex` – ugyanaz a hálózat, független kaszkád vs. küszöbmodell; az újrahuzalozás hatása a kettőre ellentétes.
- `cascade-tree` – egy terjedési fa rajza; méret, mélység, strukturális virálisság számolva; „műsorszórás” vs. „lánc” példák.
- `seed-picker` – a tanuló 3 kezdőcsúcsot választ, a gép a mohó algoritmus választásával versenyez (várható elért csúcsszám).
- `opinion-dynamics` – korlátos bizalom: bizalmi küszöb csúszka → konszenzus / polarizáció / fragmentáció.

### Kvízek
`gh9-91` … `gh9-96`, `gh9-final`.

### Csapdák
A járványmodell nem automatikusan jó hírmodell (a hírnél az „újrafertőzés”, a figyelem és az algoritmus is számít) ·
egy szimuláció ≠ várható viselkedés (sok futás kell) · a legnagyobb fokszámú csúcs nem feltétlenül a legjobb terjesztő ·
a modellből levont oksági állítás csak a modellen belül érvényes.

### Források
NSB 10; NEW 16–17; EK 16, 19; MENC 7; Pastor-Satorras et al. (2015) *Epidemic processes in complex networks* (Rev. Mod.
Phys.); Kempe–Kleinberg–Tardos (2003); Centola–Macy (2007); Centola (2010) *Science*; Goel et al. (2016) *Management
Science*; Hegselmann–Krause (2002).

---

## 10. fejezet – Hálózatok összehasonlítása és statisztikai következtetés ★★–★★★

**Nagy kérdés:** *A Reggeli Hírlap és a Nyitott Szó szereplőhálózata „hasonlít” – de mennyire, és ez több-e, mint ami
véletlenül is kijönne? Egyáltalán: hogyan lehet két hálózatot összehasonlítani, és mikor szignifikáns a különbség?*

**Cél:** a IV. blokk statisztikai eszköztára: élátfedés (Jaccard), mátrixkorreláció és **QAP** (a NAS fő eszköze),
MRQAP-regresszió, hálózati gerinc (backbone) kivonása, bootstrap és mintavételi torzítás, az ERGM és az időbeli modellek
röviden. Hálózatoknál a megfigyelések **nem függetlenek** – a hagyományos próbák nem használhatók.

### Felépítés
1. **10.1 Élátfedés** ★ – Jaccard-index két élhalmazon; súlyozott változat; kézzel két lap gráfján.
2. **10.2 Mátrixkorreláció** ★★ – a két szomszédsági mátrix főátlón kívüli elemeinek Pearson-korrelációja (Mat. stat.
   3. fejezet); miért nem jó a szokásos p-érték (a cellák nem függetlenek: egy csúcs sora és oszlopa együtt mozog).
3. **10.3 QAP-próba** ★★ – a csúcsok közös permutálása (sorok és oszlopok együtt) → nulleloszlás → empirikus p-érték;
   kézzel 4 csúcson az összes $4! = 24$ permutáció (teljes felsorolás!), aztán mintavétel nagy $n$-re. Ez a hálózati
   napirend-kijelölés (16. fejezet) standard próbája.
4. **10.4 MRQAP-regresszió** ★★★ – több magyarázó hálózat egyszerre (pl. a közvélemény-hálózatot a médiahálózat és a
   tavalyi közvélemény-hálózat magyarázza); Dekker–Krackhardt–Snijders (2007) kettős szemi-parciális eljárás szemléletesen.
5. **10.5 Hálózati gerinc** ★★ – sűrű, súlyozott vetületből a lényeges élek kiválasztása: globális küszöb és problémái;
   **diszparitásszűrő** (Serrano–Boguñá–Vespignani, 2009) – helyi nullmodell a csúcs súlyaira; páros vetületek gerince
   (pl. sztochasztikus fokszám-sorozat modell, Neal 2014) röviden. Hüvelykujjszabály: **„a küszöb is modellezési döntés –
   nézd meg, mennyire érzékeny rá az eredmény”**.
6. **10.6 Mintavétel, hiányzó adat, robusztusság** ★★ – a hálózat a gyűjtés eredménye: hiányzó csúcsok / élek hatása a
   centralitásra és a közösségekre (Borgatti et al., 2006); API-korlátok, platform-hozzáférés; érzékenységvizsgálat
   (küszöb, ablakméret, entitáskinyerő).
7. **10.7 Kitekintés: ERGM és időbeli hálózati modellek** ★★★ – az exponenciális véletlengráf-modell mint „hálózati
   logisztikus regresszió” (él-, háromszög-, homofília-tagok); SAOM / TERGM röviden; mikor kell (oksági / folyamatbeli
   kérdések).

### Kidolgozott példák
- Jaccard két 6 élű élhalmazon, 4 közös éllel: $4/8 = 0{,}5$.
- Mátrixkorreláció két 4 csúcsú súlyozott mátrixra (6 cellapár).
- QAP teljes felsorolással: a 24 permutáció korrelációi, a megfigyelt helye → $p = $ (Pythonból).
- Diszparitásszűrő egy csúcson: 4 él, súlyok 10, 1, 1, 1 → melyik marad meg $\alpha = 0{,}05$ mellett.
- Egy él eltávolításának hatása a köztességi rangsorra.

### Interaktív szemléltetések
- `qap-lab` – a fejezet fő widgetje: két kis hálózat mátrixa egymás mellett; „permutálj” gomb (sorok + oszlopok együtt,
  animálva); a korrelációk hisztogramja gyűlik; a megfigyelt érték és az empirikus p-érték.
- `backbone-filter` – súlyozott vetület; globális küszöb vs. diszparitásszűrő csúszkával; megmaradó élek és komponensek.
- `missing-data` – a csúcsok / élek $x$%-ának véletlen törlése → a centralitás-rangsor korrelációja az eredetivel.
- `sensitivity-grid` – küszöb × ablakméret rács, cellánként a közösségek száma / NMI az alapesettel (az eredmény
  „robusztussági térképe”).

### Kvízek
`gh10-101` … `gh10-107`, `gh10-final`.

### Csapdák
Szokásos t-próba / korrelációs próba hálózati adaton · a QAP-ban külön permutálni a sorokat és oszlopokat · globális küszöb
nagyon különböző fokszámú csúcsoknál · a ritka élek „szignifikanciája” nagy mintán triviális · a gerinc a kérdéstől függ.

### Források
NEW 6, 15; Krackhardt (1987, 1988) QAP; Dekker–Krackhardt–Snijders (2007); Serrano–Boguñá–Vespignani (2009); Neal (2014);
Borgatti–Carley–Krackhardt (2006); Lusher–Koskinen–Robins (2013) *ERGM*; NAS 4. (Guo öt lépése, QAP).

---

# III. blokk – Gépi tanulás gráfokon

## 11. fejezet – Csúcsbeágyazások és kapcsolat-előrejelzés ★★

**Nagy kérdés:** *Két szereplőt eddig egyetlen cikk sem említett együtt. Melyik pár fog a jövő héten valószínűleg együtt
szerepelni – és hogyan lehet ezt egy algoritmusnak megjósolni?*

**Cél:** a kapcsolat-előrejelzés mint gépi tanulási feladat; heurisztikák (közös szomszédok, Jaccard, Adamic–Adar,
preferenciális kapcsolódás); csúcsbeágyazások (spektrális, DeepWalk / node2vec); helyes kiértékelés (időbeli felosztás,
szivárgás, AUC / precision@k). Előkészíti a 12. fejezet GNN-jeit.

### Felépítés
1. **11.1 A feladat** ★ – „melyik nem létező él fog megjelenni?”; pontozás + rangsor; tanító- és tesztélek (időbeli
   felosztás: múlt hét → e hét).
2. **11.2 Szomszédsági heurisztikák** ★★ – közös szomszédok $(A^2)_{ij}$ (2.7!), Jaccard, Adamic–Adar, erőforrás-allokáció,
   preferenciális kapcsolódás; kézzel az Árvízhét-gráfon.
3. **11.3 Kiértékelés** ★★ – ROC-AUC, precision@k (MI 6. fejezet); negatív mintavétel; **szivárgás**: a tesztélek nem
   lehetnek benne a pontozó gráfban; az időbeli felosztás szükségessége.
4. **11.4 Spektrális beágyazás** ★★ – a Laplace-mátrix kis sajátvektorai mint koordináták (4.5 általánosítása).
5. **11.5 Véletlen sétás beágyazások** ★★ – DeepWalk / node2vec: séták = „mondatok”, csúcsok = „szavak” → word2vec
   (🔁 MI 12.2); $p$, $q$ paraméterek: BFS-szerű (szerkezeti szerep) vs. DFS-szerű (közösség) séták.
6. **11.6 Alkalmazás** ★★ – együttemlítés előrejelzése a GDELT magyar kivonatán vagy az Árvízhéten (hét 1 → hét 2);
   heurisztikák vs. node2vec + logisztikus regresszió.

### Kidolgozott példák
- Közös szomszédok, Jaccard, Adamic–Adar egy csúcspárra a 7 szereplős gráfon.
- AUC kézzel: 3 pozitív és 3 negatív pár pontszámaiból (9 összehasonlítás).
- Egy véletlen séta mint „mondat”: A, B, D, E, D, B, C → szópárok ablakkal.
- Szivárgás: ugyanaz a modell AUC-ja tesztélekkel és nélkülük a gráfban (Pythonból).

### Interaktív szemléltetések
- `link-heuristics` – csúcspár kijelölésekor négy pontszám; „top 5 jóslat” táblázat; a valódi jövőbeli élek kiemelése.
- `random-walk-corpus` – séták generálása $p$, $q$ csúszkával; a séták szövegként; a kapott 2D-s beágyazás.
- `auc-builder` – pontozott párok rangsora, ROC-görbe lépésről lépésre.
- `leakage-demo` – kapcsoló: tesztélek a gráfban igen / nem → a pontosság „csodája” eltűnik.

### Kvízek
`gh11-111` … `gh11-116`, `gh11-final`.

### Csapdák
Szivárgás (tesztél a gráfban) · véletlen felosztás időbeli adaton · AUC kiegyensúlyozatlan negatívokkal túl optimista ·
a beágyazás tengelyeinek nincs jelentése · a node2vec érzékeny a hiperparaméterekre.

### Források
GRL 3; NEW 7; Liben-Nowell–Kleinberg (2007); Adamic–Adar (2003); Perozzi et al. (2014) DeepWalk; Grover–Leskovec (2016)
node2vec; MI 12–13. fejezet.

---

## 12. fejezet – Gráf neurális hálók heterogén, időbeli és tudásgráfokon ★★–★★★

**Nagy kérdés:** *Egy hírgráfban vannak lapok, cikkek, szereplők, események és olvasók, és az élek időben érkeznek. Az MI
13. fejezet GNN-je egyféle csúcsot és statikus gráfot ismer. Mi kell ahhoz, hogy ezen a gráfon is tanuljon?*

**Cél:** az MI 13. fejezet **ismétlése** (üzenetküldés, GCN, GAT – „🔁 Emlékeztető”) és **kiterjesztése** a hírelemzés
gráfjaira: relációs / heterogén GNN-ek (R-GCN, HAN, HGT), tudásgráf-beágyazás (TransE, DistMult, RotatE), időbeli gráfhálók
(TGN, TGAT; pillanatfelvétel-alapú vs. folytonos idejű), és a hírelemzésben fontos gyakorlati kérdések (heterofília,
induktív tanulás új cikkekre, skálázás).

> 🔬 **Kidolgozáskor kötelező:** Consensus-keresés: heterogén és időbeli GNN-ek friss összehasonlításai és benchmarkjai
> (pl. TGB, *Temporal Graph Benchmark*), a „gondosan hangolt klasszikus GNN-ek is erősek” típusú újraértékelések, a
> tudásgráf-beágyazások vs. LLM-alapú megoldások. `📅 Állapot: 2026`.

### Felépítés
1. **12.1 🔁 Emlékeztető: üzenetküldés** ★★ – az öt barát gráfján egy GCN-lépés (az MI 13.3–13.4 számaival); link az
   MI 13. fejezet widgetjeire.
2. **12.2 Relációs GNN** ★★ – éltípusonként külön súlymátrix (R-GCN): „említi”, „idézi”, „bírálja” élek; bázisfelbontás
   röviden.
3. **12.3 Heterogén GNN-ek** ★★★ – metaútvonalak (lap–cikk–szereplő–cikk–lap); HAN (metaútvonal-szintű figyelem), HGT
   (típusfüggő figyelem) szemléletesen; mikor elég a homogén gráf + csúcstípus-jellemző.
4. **12.4 Tudásgráf-beágyazás** ★★ – hármasok pontozása: TransE ($\mathbf h + \mathbf r \approx \mathbf t$) kézzel 2D-ben;
   DistMult, RotatE röviden (mit tudnak kifejezni: szimmetrikus, inverz, összetett relációk); kapcsolat-előrejelzés tudásgráfon.
5. **12.5 Időbeli gráfhálók** ★★★ – diszkrét (pillanatfelvétel + RNN) vs. folytonos idejű (eseményfolyam, csúcsmemória:
   TGN); időkódolás; kiértékelés: csak a múltból jósolunk; a „ma is ugyanaz, mint tegnap” (EdgeBank-szerű) alapvonal
   meglepő ereje.
6. **12.6 Gyakorlati kérdések** ★★ – heterofília (a bírált és a bíráló szereplő „szomszédok”, de nem hasonlók);
   induktív beállítás (új cikk, új szereplő); szövegjellemzők a csúcsokon (nyelvi modell-beágyazás – 🔁 MI 12.);
   mikor győz egy egyszerű alapvonal.

### Kidolgozott példák
- R-GCN-lépés egy 4 csúcsú, 2 éltípusú gráfon (két súly, skalárjellemzők).
- TransE: (Budapest, *fővárosa*, Magyarország) 2D vektorokkal; a pontszám $-\lVert \mathbf h + \mathbf r - \mathbf t \rVert$.
- Metaútvonal-szomszédság: lap–esemény–lap úton két lap „szomszéd”.
- Időbeli kapcsolat-előrejelzés: „ismétlés” alapvonal pontossága egy kis eseményfolyamon.

### Interaktív szemléltetések
- `hetero-graph-explorer` – Árvízhét heterogén gráfja (lap, cikk, szereplő, keret); csúcstípus-szűrő; metaútvonal-
  választó → a kapott homogén szomszédság.
- `transe-2d` – entitások és relációk 2D-ben húzható vektorokkal; a hármasok pontszáma élőben; „tanítás” gomb.
- `temporal-stream` – eseményfolyam lejátszása; csúcsmemória-sávok frissülnek; jóslat a következő élre vs. ismétlés-alapvonal.
- `relation-message` – R-GCN üzenetek éltípus szerinti színezéssel.

### Kvízek
`gh12-121` … `gh12-126`, `gh12-final`.

### Csapdák
Az időbeli adatot véletlenszerűen felosztani · a tudásgráf „nyílt világ”: a hiányzó hármas nem hamis · a figyelmi súly
nem magyarázat · bonyolult modell erős alapvonal nélkül · heterogén gráf → sok hiperparaméter, kis adat → túlillesztés.

### Források
GRL 4–7; MI 13. fejezet; Schlichtkrull et al. (2018) R-GCN; Wang et al. (2019) HAN; Hu et al. (2020) HGT; Bordes et al.
(2013) TransE; Yang et al. (2015) DistMult; Sun et al. (2019) RotatE; Rossi et al. (2020) TGN; Xu et al. (2020) TGAT;
Poursafaei et al. (2022) EdgeBank / időbeli kiértékelés; Huang et al. (2023) TGB; RES.

---

## 13. fejezet – Szövegből gráf: együttelőfordulás, entitások, tudásgráfok, GraphRAG ★★

**Nagy kérdés:** *Van 12 cikkünk szövegként. Hogyan lesz belőlük automatikusan gráf – és melyik lépésnél csúszhat be a hiba,
ami aztán minden hálózati eredményt elront?*

**Cél:** a szöveg → gráf átalakítás láncolata: szóegyüttelőfordulási hálózat (ablak, mondat, cikk), névelem-felismerés és
egyértelműsítés, relációkinyerés, tudásgráf-építés (szabályalapú → LLM-alapú); szöveggráf-modellek (TextGCN) röviden;
GraphRAG (gráfalapú visszakeresés) – és mindegyik validálása. A IV. blokk adatelőkészítő eszköztára.

> 🔬 **Kidolgozáskor kötelező:** Consensus-keresés: LLM-alapú tudásgráf-építés pontossága és validálása; GraphRAG vs.
> sima RAG összehasonlítások; magyar NER / entitás-egyértelműsítés eszközök állapota (huSpaCy, HuBERT-alapú modellek). `📅`.

### Felépítés
1. **13.1 Szavak hálózata** ★ – együttelőfordulás ablakban / mondatban / cikkben; stopszavak, lemmatizálás (magyar
   ragozás!); súlyozás PMI-vel (miért nem elég a nyers darabszám); textual network analysis (PDF).
2. **13.2 Entitások** ★★ – névelem-felismerés (személy, szervezet, hely); **egyértelműsítés és összevonás** („a miniszter”,
   „X. Y.”, „a tárcavezető” → egy csúcs); hiba hatása a gráfra (szétszakadó vagy összeolvadó csúcsok).
3. **13.3 Relációk és tudásgráf** ★★ – szabályalapú (függőségi elemzés), felügyelt és LLM-alapú relációkinyerés
   (alany–állítmány–tárgy); sémák (pl. CAMEO-szerű eseménykódok a GDELT-ben); **forráshely-hűség**: minden él mellé az
   eredeti mondat (HKK: „minden megállapításhoz eredeti szöveghellyel”).
4. **13.4 Validálás** ★★ – kézzel annotált minta, precizitás / felidézés élekre (MI 6.); annotátorok közötti egyetértés;
   a hibák nem véletlenszerűek (pl. kevésbé ismert szereplők kimaradnak) → torzított hálózat.
5. **13.5 Szöveggráf-modellek** ★★★ – TextGCN (szó–dokumentum gráf) röviden; mikor ad többet egy nyelvi modellnél.
6. **13.6 GraphRAG** ★★ – 🔁 MI 18. RAG; a dokumentumokból LLM-mel épített entitásgráf → közösségek (Leiden, 8.4!) →
   közösségi összefoglalók → globális kérdések megválaszolása („miről szólt a héten a sajtó?”); előnyök, költség, hibák.

### Kidolgozott példák
- Mondatszintű vs. cikkszintű együttelőfordulás ugyanazon a 3 cikken: különböző élszám.
- PMI kézzel: két szó gyakorisága és együttes gyakorisága 100 mondatban.
- Egyértelműsítési hiba: „Kovács” két különböző személy → egy hamis hídcsúcs magas köztességgel.
- Precizitás / felidézés egy 10 élű kézi mintán.
- Egy mondatból kinyert hármas + a hozzá tartozó szöveghely.

### Interaktív szemléltetések
- `text-to-graph` – a fejezet fő widgetje: rövid (kitalált) cikkszöveg, kiemelt entitásokkal; ablakméret-csúszka →
  élőben épülő együttelőfordulási gráf; PMI-kapcsoló.
- `entity-merge` – entitásváltozatok kártyái; összevonás / szétválasztás → a gráf és a centralitások változnak.
- `triple-extractor` – előre rögzített (szimulált) LLM-kimenetek mondatonként; a tanuló jóváhagyja / elveti a hármasokat →
  precizitás.
- `graphrag-flow` – a GraphRAG lépései lejátszva egy kis korpuszon (dokumentum → entitásgráf → közösségek → összefoglalók
  → válasz) – „szimuláció” jelöléssel.

### Kvízek
`gh13-131` … `gh13-136`, `gh13-final`.

### Csapdák
Az ablakméret / egység (mondat, bekezdés, cikk) megváltoztatja a gráfot · nyers gyakoriság PMI helyett · a magyar
ragozás lemmatizálás nélkül szétszórja a csúcsokat · LLM-hallucinált élek · az entitás-felismerés szisztematikus hibái
torzítják a centralitást · a GraphRAG összefoglalója nem forrás.

### Források
GRL 7; MI 12., 18. fejezet; PDF: *Textual network analysis*; Yao–Mao–Luo (2019) TextGCN; Edge et al. (2024) *From Local to
Global: A Graph RAG Approach* (Microsoft); huSpaCy (Orosz et al.); Leetaru–Schrodt (2013) GDELT; HKK; RES.

---
# IV. blokk – Hírelemzés hálózatokkal

> A blokk közös szerkezete: minden fejezet egy **médiakutatási kérdéssel** indul, az Árvízhéten kézzel végigszámolt
> mini-elemzéssel folytatódik, aztán egy **valós kutatási eredményt** mutat be (hivatkozással), és egy **„⚖️ Konszenzus és
> vita”** dobozzal zárul. A kutatási állítások forrása a `_parts/graf/research.md` (RES); a fejezetek megírása előtt
> Consensus-kereséssel frissítjük. A fejezetek elején egy `box history` mindig visszautal a 14. fejezet idővonalára: mikor
> és milyen eszközzel tették fel először ezt a kérdést.

## 14. fejezet – Hálózatok a média- és hírkutatásban: történeti áttekintés ★

**Nagy kérdés:** *„Ki befolyásolja kit, és mi kapcsolódik mihez a hírekben?” – ezt a kérdést 1940-ben kérdőívvel és kézzel
rajzolt szociogrammal, 1990-ben kódlappal, 2010-ben Twitter-adatokkal, 2026-ban nyelvi modellel és gráf neurális hálóval
vizsgálták. Mi változott – és mi maradt ugyanaz?*

**Cél:** a IV. blokk „térképe”: a hálózati gondolkodás útja a média- és hírkutatásban, korszakonként – **milyen kérdést**
tettek fel, **mi volt a csúcs és az él**, **honnan jött az adat**, **milyen eszközzel** számoltak, és **milyen kritika**
vezetett a következő korszakhoz. A fejezet nem matematikai, hanem fogalmi és módszertörténeti; minden korszakhoz egy mini
példa az Árvízhét adataiból „úgy, ahogy akkor csinálták volna”. Az I–III. blokk eszközei itt kapnak történeti helyet.

> 🔬 **Kidolgozáskor kötelező:** az évszámok, szerzők és első közlések ellenőrzése (Consensus + kiadói oldal); a korszakhatárok
> a szakirodalomban nem egységesek – a fejezet ezt jelzi. A lenti idővonal **tervezet**: a „(ellenőrzendő)” tételeket a
> megírás előtt forrással kell igazolni.

### Felépítés
1. **14.1 Személyes hálók a médiahatás mögött (1930–1960)** ★ – *Kérdés:* hogyan hat a média, ha az emberek egymással is
   beszélnek? *Csúcs/él:* emberek / „kitől kér tanácsot”. *Adat:* kérdőív, interjú. *Eszköz:* kézzel rajzolt szociogram.
   - Moreno szociometriája (*Who Shall Survive?*, 1934) – a szociogram megszületése.
   - Lazarsfeld–Berelson–Gaudet: *The People's Choice* (1944) → **kétlépcsős kommunikáció**, véleményvezérek;
     Katz–Lazarsfeld: *Personal Influence* (1955, Decatur-vizsgálat).
   - A hírek és innovációk terjedése: hírterjedés-vizsgálatok (pl. Deutschmann–Danielson, 1960 – ellenőrzendő);
     Coleman–Katz–Menzel *Medical Innovation* (1957/1966); Rogers: *Diffusion of Innovations* (1962).
   - *Mini példa:* az Árvízhét 8 olvasójának „kitől hallottál az árvízről?” válaszaiból szociogram → a véleményvezér =
     legnagyobb befokú csúcs (5.1 előképe).
   - *Kritika, ami továbbvitt:* kis minták, a hálót csak a válaszadó szemével látjuk; a média tartalma kívül marad.
2. **14.2 A gráfelmélet belép a társadalomtudományba; a tartalom kapcsolatai (1950–1980)** ★★ – *Kérdés:* milyen
   fogalmak, szereplők kapcsolódnak egymáshoz a szövegben – és a csoportokban? *Csúcs/él:* fogalmak / együttes előfordulás;
   emberek / előjeles viszony. *Eszköz:* mátrixok kézzel, korai számítógépek.
   - Cartwright–Harary (1956): **strukturális egyensúly** gráfelméletben (→ 6.4); Harary–Norman–Cartwright: *Structural
     Models* (1965).
   - Osgood **kontingenciaanalízise** (1959): fogalmak együttes előfordulása szövegegységekben – az együttelőfordulási
     hálózat előfutára (→ 13.1).
   - McCombs–Shaw Chapel Hill-vizsgálata (1968, közölve 1972): a napirend-kijelölés születése – ekkor még **rangsorok**
     összevetése, nem hálózat (→ 16.1).
   - Granovetter: gyenge kötések (1973) (→ 6.3); Freeman centralitásfogalmai (1977/1979) (→ 5.); az INSNA és a *Social
     Networks* folyóirat (1978) – a társadalmi hálózatelemzés (SNA) intézményesül.
   - *Mini példa:* az Árvízhét 12 cikkéből Osgood-féle kontingenciatábla (7 fogalom × 7) – ez már az 1. fejezet
     szomszédsági mátrixa.
3. **14.3 Relációs és szemantikai hálózati tartalomelemzés (1980–2005)** ★★ – *Kérdés:* hogyan kapcsolja össze a sajtó a
   szereplőket és a fogalmakat – ki értékel kit, milyen előjellel? *Csúcs/él:* szereplők, fogalmak / kódolt állítások
   (alany–viszony–tárgy). *Adat:* kézzel kódolt cikkminták. *Eszköz:* SNA-szoftverek (UCINET, Pajek), korai
   szövegelemző programok.
   - Rogers–Kincaid: *Communication Networks* (1981) – kommunikációs hálózatelemzés.
   - Relációs tartalomelemzés: van Cuilenburg–Kleinnijenhuis–de Ridder (1986; NET-módszer) → később van Atteveldt (2008)
     *Semantic Network Analysis* – automatizált, hármasalapú szemantikai hálózatok (→ 3.7, 13.3).
   - Carley térképelemzése (*map analysis*, 1990-es évek eleje) és Danowski szóhálózatai; CATPAC-szerű
     „neurális” fogalomhálók (ellenőrzendő évszámok).
   - Krackhardt **QAP-próbája** (1987–88) – hálózatok szignifikáns összevetése (→ 10.3, és később a NAS fő eszköze).
   - Reese–Grant–Danielian (1994): tévéhírek **forrásainak hálózata** – egy szűk „bennfentes” klikk (→ 17.4).
   - Keretezés: Gamson–Modigliani (1989), Entman (1993) – a keret mint fogalmak elrendezése (→ 17.).
   - *Mini példa:* az Árvízhét 4 cikkének kézi kódolása hármasokba ((Polgármester, −, Kormány), …) → előjeles gráf.
   - *Kritika:* drága kézi kódolás, kis minták, kódolói megbízhatóság.
4. **14.4 A web és a „hálózattudomány” (1998–2010)** ★★ – *Kérdés:* hogyan szerveződik az online nyilvánosság; kik a
   kapuőrök a linkek világában? *Csúcs/él:* oldalak, blogok / hiperlinkek. *Adat:* webes bejárás (crawl). *Eszköz:*
   fizikai ihletésű modellek, nagy gráfok algoritmusai.
   - Watts–Strogatz (1998), Barabási–Albert (1999) → a hálózattudomány mint önálló terület (→ 7.); Barabási: *Behálózva*
     (*Linked*, 2002) – `box history` a magyar iskoláról (Erdős–Rényi, Barabási, Kertész, Vicsek, Csermely – ellenőrzendő
     hivatkozásokkal).
   - Brin–Page PageRank (1998), Kleinberg HITS (1999) (→ 5.5–5.6).
   - Hiperlink-hálózatelemzés (Park, 2003 – ellenőrzendő); Adamic–Glance (2005): az amerikai politikai blogoszféra két
     tábora (→ 5.8, 18.).
   - Közösségkeresés: Girvan–Newman (2002), modularitás (2004–2006), Louvain (2008) (→ 8.).
   - Szövegből hálózat automatikusan: Diesner–Carley (2005) meta-mátrix szövegelemzés (AutoMap / ORA – ellenőrzendő);
     Leskovec–Backstrom–Kleinberg (2009) **MemeTracker**: idézetváltozatok a hírciklusban (→ 15.4, 18.5).
   - Témamodellek (LDA, Blei et al., 2003) – később a témák hálózata lesz a keretelemzés alapja.
   - *Mini példa:* a 4 lap egymásra mutató linkjeiből PageRank és HITS (hub = összesítő, authority = eredeti tudósító).
5. **14.5 A közösségi média és a „big data” korszaka (2009–2022)** ★★ – *Kérdés:* hogyan terjednek a hírek, és kik
   alakítják a napirendet a platformokon? *Csúcs/él:* felhasználók, hírek, hashtagek / retweet, követés, említés,
   közös megosztás. *Adat:* platform-API-k (különösen a Twitteré). *Eszköz:* Python / R (`networkx`, `igraph`), Gephi;
   automatikus NLP (névelem-felismerés, témamodell).
   - „Twitter: közösségi háló vagy hírmédium?” (Kwak et al., 2010 – ellenőrzendő); retweet-hálózatok polarizációja
     (Conover et al., 2011 – ellenőrzendő).
   - **Hálózati napirend-kijelölés:** Guo–McCombs (2011), Guo (2012), Vargo et al. (2014) Twitter-adatokon; *The Power of
     Information Networks* (Guo–McCombs szerk., 2015) (→ 16.).
   - Médiaökoszisztéma-térképek: Media Cloud (Berkman Klein Center, ellenőrzendő évszám), GDELT (2013), Benkler–Faris–
     Roberts: *Network Propaganda* (2018) (→ 18.).
   - Félretájékoztatás: Del Vicario et al. (2016) visszhangkamrák és kaszkádok; Shao et al. (2018) k-mag; **Vosoughi–Roy–
     Aral (2018)**: a hamis hír gyorsabban és messzebbre jut (→ 19.); koordinált viselkedés: Giglietto et al. (2020).
   - ANTMN: Walter–Ophir (2019) – témahálózat + közösségkeresés = keretek (→ 17.2); Nicholls–Bright (2019) hírláncok (→ 15.).
   - *Mini példa:* az Árvízhét cikkeinek megosztási fája egy kitalált platformon → kaszkádméret és mélység (9.4).
   - *Kritika:* az adat a platform szűrőjén át érkezik (mintavételi torzítás, a Twitter ≠ a társadalom); a hálózati ábra
     csábít, de gyenge az okságra; reprodukálhatóság.
6. **14.6 Mélytanulás gráfokon (2017–)** ★★ – *Kérdés:* meg lehet-e tanulni a gráfból (és a szövegből) a hír
   hitelességét, a következő eseményt, az olvasó érdeklődését? *Csúcs/él:* heterogén gráf (hír, felhasználó, entitás,
   téma) / sokféle él, időbélyeggel. *Eszköz:* GNN-ek (PyTorch Geometric, DGL), tudásgráf-beágyazások.
   - DKN tudásgráffal bővített hírajánlás (Wang et al., 2018); MIND benchmark (2020) (→ 20.).
   - Terjedésalapú álhírfelismerés: Monti et al. (2019), Bi-GCN (Bian et al., 2020), UPFD (2021) (→ 19.6, 20.).
   - Szöveggráfok: TextGCN (Yao et al., 2019); esemény-tudásgráfok, Story Forest (Liu et al., 2020) (→ 13., 20.).
   - *Kritika (2020–2026):* a benchmarkokon kiváló, új adathalmazon gyenge (Han et al., 2020; Hoy et al., 2022;
     Dell'Oglio et al., 2026); szivárgás, kiadói címkék; entitás-torzítás (Zhu et al., 2022).
7. **14.7 Adathozzáférési fordulat és nyelvi modellek (2023–2026)** ★★ – *Kérdés:* hogyan lehet hálózatot építeni, ha a
   platformadatok elzárultak, a szövegelemzés viszont olcsóvá vált? *Csúcs/él:* újra a **hírszövegek** szereplői,
   állításai, eseményei / LLM-mel kinyert, forráshelyhez kötött relációk. *Adat:* híroldalak saját gyűjtése, archívumok,
   GDELT; EU-ban a DSA szerinti kutatói adathozzáférés (ellenőrzendő dátum és hatály).
   - A Twitter Academic API megszűnése (2023), a CrowdTangle bezárása (2024. augusztus) – a terjedési kutatások
     visszaesése (RES).
   - LLM-alapú tudásgráf-építés, **GraphRAG** (Edge et al., 2024) és a vita a hasznáról (Han et al., 2025; GraphRAG-Bench)
     (→ 13.6, 20.).
   - Hálózati keretezés és napirend új adatokon: framing element network (Jiang et al., 2025); MediaGraph (Bali et al.,
     2026, indiai hírmédia, arXiv 2604.20982); „flash agenda”, „agenda leadership” (Elishar et al., 2026); Almakaty (2025,
     2026) áttekintései – Magyarország is szerepel (→ 16.–18.).
   - Módszertani önreflexió: a téma ≠ keret (Nicholls et al., 2020); a backbone-módszer választása megváltoztatja az
     eredményt (Yassin et al., 2025); a médiumnév befolyásolja az LLM-elemzést (EMNLP 2025, HKK) → **validálás,
     nullmodell, robusztusság** mint elvárás.
   - *Mini példa:* az Árvízhét egy cikkéből (szimulált) LLM-kimenet → hármasok forrásmondattal → ugyanaz az előjeles gráf,
     mint 14.3-ban kézzel – és a kettő eltérései.
8. **14.8 Mi változott, mi maradt?** ★ – összefoglaló táblázat (lent) és három tanulság:
   (1) **a kérdések állandók** (ki befolyásol kit; mi kapcsolódik mihez; mi terjed és miért) – az eszközök változnak;
   (2) **az adatforrás határozza meg a hálózatot** (kérdőív → kódlap → crawl → API → saját gyűjtés + LLM) – minden
   korszak „vakfoltja” az adatgyűjtésből jön; (3) **a kritikák visszatérnek** (mintavétel, validitás, okság) – a mai
   „jó gyakorlat” (nullmodell, robusztusság, kézi validálás) ezekre a tanulságokra épül.

### Összefoglaló táblázat (a fejezet döntési táblázata helyett)

| Korszak | Jellemző kérdés | Csúcs / él | Adatforrás | Fő eszközök | Fő kritika → továbblépés |
|---|---|---|---|---|---|
| 1930–60 | Hogyan közvetítik az emberek a médiahatást? | személy / tanácskérés | kérdőív, interjú | szociogram, kétlépcsős modell | kis minta, a tartalom kimarad |
| 1950–80 | Mi kapcsolódik mihez a szövegben, a csoportban? | fogalom / együttelőfordulás; személy / előjeles viszony | kézi kódolás | kontingenciaanalízis, egyensúlyelmélet, centralitás | kézi, kis léptékű |
| 1980–2005 | Hogyan kapcsolja össze a sajtó a szereplőket? | szereplő / kódolt állítás | kódolt cikkminták | relációs tartalomelemzés, SNA-szoftverek, QAP | drága, megbízhatósági gondok |
| 1998–2010 | Hogyan szerveződik az online nyilvánosság? | oldal, blog / hiperlink | webes bejárás | PageRank, HITS, modularitás, skálafüggetlen modellek | a link nem tartalom; fizikai modellek társadalmi értelmezése |
| 2009–2022 | Hogyan terjednek a hírek a platformokon? | felhasználó, hír / retweet, megosztás | platform-API | kaszkádelemzés, NAS big data-n, közösségkeresés, témamodellek | platformtorzítás, okság, reprodukálhatóság |
| 2017– | Megtanulható-e a gráfból a hitelesség, az érdeklődés? | heterogén gráf / tipizált, időbeli él | benchmarkok (FakeNewsNet, MIND, Twitter15/16) | GNN, tudásgráf-beágyazás | gyenge általánosítás, szivárgás |
| 2023–2026 | Mit mondanak maguk a hírszövegek, ha a platformadat elzárul? | szereplő, állítás, esemény / LLM-mel kinyert reláció | saját hírgyűjtés, GDELT, DSA-hozzáférés | LLM-kinyerés, GraphRAG, validált hálózati statisztika | LLM-torzítás, költség, validálás |

### Kidolgozott példák
- Ugyanaz a kérdés („kapcsolatban áll-e a Kormány és a Lakók a tudósításban?”) öt korszak módszerével megválaszolva az
  Árvízhéten – öt kis eredmény egymás mellett, és hogy miben térnek el.
- Osgood-kontingencia vs. mai PMI-súlyozás (13.1) ugyanazon a táblán.
- Reese et al. (1994) forráshálózatának logikája az Árvízhét megszólalóira: ki kivel szerepel ugyanabban a cikkben
  megszólalóként.
- A „Twitter-korszak” egy kitalált kaszkádja vs. a 2023 utáni helyzet: ugyanaz a kérdés, de csak a cikkek láthatók.

### Interaktív szemléltetések
- `history-timeline` – a fejezet fő widgetje: vízszintes idővonal 1930–2026; szűrők: *kérdéstípus* (hatás, napirend,
  keretezés, terjedés, médiarendszer), *adatforrás*, *eszköz*; kártyára kattintva: mini leírás, csúcs/él, hivatkozás, és
  link a témakör megfelelő fejezetére.
- `same-data-five-eras` – az Árvízhét adatai öt „szemüvegen” át (fülek): szociogram → kódolt előjeles gráf → linkhálózat →
  megosztási kaszkád → LLM-hármasokból épített tudásgráf; mindegyiknél: mit lát és mit nem lát a módszer.
- `method-heatmap` – korszak × módszer hőtérkép (melyik eszköz mikor volt jellemző); egérrel kiemelhető egy módszer
  „életpályája”.
- `who-measured-what` – kártyajáték: kutatási idézet / leírás → a tanuló korszakhoz és hálózattípushoz rendeli.

### Kvízek
`gh14-141` … `gh14-148`, `gh14-final` (`match` típus a korszak ↔ módszer párosításokra; a rossz válaszok tipikus
anakronizmusok, pl. „QAP-próba a Decatur-vizsgálatban”).

### Csapdák
Anakronizmus (a mai fogalmak visszavetítése) · „az új módszer mindig jobb” – a kézi kódolás validitása ma is mérce ·
a korszakhatárok elmosódnak, a módszerek egymás mellett élnek · a platformadatok elérhetősége nem a kutatási kérdés
fontosságát, hanem a hozzáférést tükrözi.

### Források
NAS 2. (történeti áttekintés, a NAS-ra vonatkozó részletek); MENC 1; NEW 1; Katz–Lazarsfeld (1955); Osgood (1959);
Cartwright–Harary (1956); McCombs–Shaw (1972); Rogers–Kincaid (1981); Reese–Grant–Danielian (1994); Entman (1993);
van Atteveldt (2008); Adamic–Glance (2005); Leskovec et al. (2009); Guo–McCombs (2015); Benkler et al. (2018); Vosoughi et
al. (2018); Walter–Ophir (2019); RES; HHSZ; `Projects/szakdolgozat/resources/A média- és újságírástudomány alapvető
elméletei.md`.

---

## 15. fejezet – Hírkorpuszból hálózat: cikkek, események, hírláncok ★★

**Nagy kérdés:** *Egy héten 4 lap 300 cikket közöl. Melyek szólnak **ugyanarról az eseményről**? – Mert amíg ezt nem tudjuk,
nem tudjuk összehasonlítani, ki hogyan tudósított.*

**Cél:** a hírelemzés első és legtöbb hibát rejtő lépése: a nyers cikkekből a **cikkhasonlósági hálózat**, ebből
közösségkereséssel **eseménycsoportok** és **hírláncok**; duplikátumok és ügynökségi anyagok; a lap–esemény páros gráf
(3.4) felépítése. A HHSZ jegyzet „három szintje” (cikkek, szövegen belüli, híroldalak) itt válik konkréttá.

### Felépítés
1. **15.1 A gyűjtés mint modellezési döntés** ★ – mely lapok, időszak, rovatok; cím, lead, szöveg, időbélyeg, módosítás;
   a gyűjtés hiánya ≠ a tudósítás hiánya (HKK: „nem találtunk tudósítást” vs. „nem sikerült ellenőrizni”).
2. **15.2 Cikkhasonlóság** ★★ – TF-IDF + koszinusz (🔁 MI 4. / 12.), szövegbeágyazás; a hasonlóság dimenziói (téma,
   esemény, megfogalmazás, keret – SemEval-2022 Task 8); magyar szöveg sajátosságai.
3. **15.3 Hasonlósági gráf és küszöb** ★★ – küszöb vs. $k$ legközelebbi szomszéd; a küszöb hatása a komponensekre
   (érzékenység – 10.6); időablak az élekre (két hét különbséggel nem ugyanaz az esemény).
4. **15.4 Duplikátumok és szövegátvétel** ★★ – n-gram-átfedés, MTI / hírügynökségi szöveg, sajtóközlemény (Nicholls,
   2019); a „közel azonos cikk” él külön éltípus (Horne et al., 2019).
5. **15.5 Eseménycsoportok közösségkereséssel** ★★ – Leiden a cikkhasonlósági gráfon (8.4) → eseményjelöltek; egy téma
   több eseményre bomlik (időt figyelembe vevő eseményfelismerés); kézi validálás (pár- és csoportszinten).
6. **15.6 Hírláncok és eseménygráf** ★★ – Nicholls–Bright (2019) story chains; események közötti időrendi / ok-okozati élek
   (Story Forest-szerű fa); idővonal.
7. **15.7 Lap–esemény páros gráf** ★★ – lefedettségi mátrix, normalizálás a lap méretével; ki milyen eseményt választ
   (hírszelekció) – előkészíti a 16. és 18. fejezetet.

### Kidolgozott példák
- 6 rövid (kitalált) cím TF-IDF-koszinusz-mátrixa kézzel; küszöb 0,3 vs. 0,5 → más komponensek.
- Ugyanaz a téma (árvíz), két esemény (gátszakadás kedden, kártérítési bejelentés pénteken) – az időablak szétválasztja.
- Ügynökségi szöveg 3 lapnál: mind „hasonló”, de egyik sem „átvétel” a másiktól.
- Lefedettségi arány: 10 cikk egy 20 cikket / nap közlő és egy 200 cikket / nap közlő lapnál.

### Interaktív szemléltetések
- `article-similarity-graph` – a fejezet fő widgetje: kb. 40 kitalált Árvízhét-cím; küszöb- és időablak-csúszka; élőben a
  komponensek / Leiden-közösségek; kattintásra a cím és a legközelebbi szomszédok.
- `story-chain` – események idővonalon, a hírláncok élei; lapszínezés.
- `coverage-matrix` – lap × esemény hőtérkép, normalizáláskapcsolóval; a páros gráf és a vetület egymás mellett.
- `reuse-detector` – két (kitalált) szöveg; közös n-gramok kiemelése; „ügynökségi forrás” jelölés.

### Kvízek
`gh15-151` … `gh15-157`, `gh15-final`.

### Csapdák
A téma ≠ esemény · a hasonlóság ≠ átvétel · időrend ≠ irány · a nem gyűjtött ≠ meg nem jelent · egyetlen küszöb
eredményére építeni · eseményen belüli és eseményen átnyúló összehasonlítás keverése · tesztcsoport-szivárgás:
ugyanazon esemény cikkei a tanító- és a tesztkészletben (HKK).

### Források
HHSZ (Nicholls–Bright 2019; Chen et al. 2022; Horne et al. 2019; Nicholls 2019; Leskovec et al. 2009); HKK; Liu et al.
(2020) Story Forest; RES; `idea_creation.md` (eseményalapú összehasonlítás, magyar hírgyűjtés).

---

## 16. fejezet – Napirend-kijelölés hálózatokkal (NAS) ★★

**Nagy kérdés:** *A média nemcsak azt mondja meg, **miről** gondolkodjunk, hanem azt is, **mit mivel kapcsoljunk össze**?
Ha a Reggeli Hírlap az árvizet mindig a Kormány intézkedéseivel együtt említi, az olvasói fejében is így kapcsolódik
össze?*

**Cél:** a napirend-kijelölés három szintje; a hálózati napirend-kijelölés (NAS) modellje; Guo öt lépése
(együttelőfordulási mátrix → közönségmátrix → QAP → oksági teszt → vizualizáció); médiaközi napirend-kijelölés hálózatokkal;
a NAS kritikája és a mai kutatási helyzet.

> 🔬 **Kidolgozáskor:** a NAS-jegyzet (NAS 5. és 7. szakasza: Consensus-áttekintés, konszenzustérkép) a kiindulópont;
> frissítés 2026-os cikkekkel (pl. Almakaty 2026; Elishar et al. 2026).

### Felépítés
1. **16.1 Három szint** ★ – 1. szint: témák fontossága (rangsor, 1968/1972 Chapel Hill); 2. szint: attribútumok; 3. szint
   (NAS): a témák / attribútumok **kapcsolatai**. Hüvelykujjszabály: **„1. szint: csúcsok mérete; 2. szint: a csúcsok
   jellemzői; 3. szint: az élek”**. `box history` (14.2, 14.5).
2. **16.2 A médianapirend mint hálózat** ★★ – attribútumok együttelőfordulása cikkekben (1., 3. fejezet); súlyozás és
   normalizálás; az Árvízhét négy lapjának napirend-hálózata.
3. **16.3 A közönség napirendje mint hálózat** ★★ – felmérés: explicit (kapcsolat-kérdés) vs. implicit (szabad asszociáció)
   mérés; mintapélda: 8 válaszadó → asszociációs mátrix. RES: az implicit mérés jellemzően erősebben korrelál.
4. **16.4 Összevetés: QAP** ★★ – 🔁 10.3; média- vs. közönségmátrix QAP-korrelációja kézzel (4 attribútum, 24 permutáció),
   majd a widgetben 8 attribútummal.
5. **16.5 Időbeliség és okság** ★★★ – keresztmetszet vs. idősor / panel; időkésés (pl. kb. 6 hét török adatokon – RES);
   keresztkésleltetett korreláció; miért gyenge a „transzfer” állítása keresztmetszeti QAP-ból.
6. **16.6 Médiaközi napirend-kijelölés** ★★ – lapok egymás közötti hálózati korrelációja (Vu et al., 2014); vezető és
   követő szerepek témánként (Vargo–Guo 2017; Stern–Livan–Smith 2020: Granger-hálózat; Granger ≠ szerkesztőségi befolyás).
7. **16.7 Kritika és mai állapot** ★★ – ⚖️ Konszenzus és vita (NAS 6–7.): sokszor replikált korreláció, gyenge okság;
   a NAS és a hálózati keretezés átfedése; fragmentált, algoritmikus médiakörnyezet: van-e még „a” napirend? (flash agenda,
   agenda leadership – Elishar et al., 2026); hibrid és nem nyugati médiarendszerek, Magyarország (Almakaty 2026).

### Kidolgozott példák
- Az Árvízhét egy lapjának 5 attribútumos együttelőfordulási mátrixa 6 cikkből.
- 8 válaszadó asszociációiból közönségmátrix.
- QAP 4 attribútumon teljes felsorolással (24 permutáció) – empirikus p-érték.
- Médiaközi: két lap napi témaarányai egynapos késleltetéssel – korreláció és alternatív magyarázatok.

### Interaktív szemléltetések
- `nas-three-levels` – ugyanaz a hírkorpusz három nézetben: rangsor (1. szint), attribútumprofil (2. szint), hálózat (3. szint).
- `nas-qap` – a fejezet fő widgetje: média- és közönséghálózat egymás mellett; a közönségmátrix szerkeszthető
  (csúszkák vagy élrajzolás); QAP élőben (a `qap-lab` újrahasznosítva).
- `lag-explorer` – két idősor (média, közönség) késleltetés-csúszkával; keresztkorreláció; „ez nem bizonyítja az irányt”
  figyelmeztetés közös sokkal (szimulált harmadik változó).
- `intermedia-network` – lapok irányított „vezet–követ” hálózata témánként (szimulált adat), témaválasztóval.

### Kvízek
`gh16-161` … `gh16-167`, `gh16-final`.

### Csapdák
Korreláció ≠ transzfer · a közönségmérés módja (explicit / implicit) megváltoztatja az eredményt · eltérő attribútumlisták
a két oldalon · a QAP nem oksági próba · a Granger-kapcsolat nem befolyás · a „média” nem egyetlen szereplő (lapok
különbsége elvész az aggregálásban).

### Források
NAS (teljes jegyzet; 4.1 Guo öt lépése, 4.2 mini példa, 5–8.); PDF: *The Power of Information Networks* + NAS-összefoglaló;
*Network Agenda Setting or Networked Framing – YouTube*; Guo–McCombs (2011, 2015); Guo (2012); Vu–Guo–McCombs (2014);
Vargo–Guo (2017); Wu–Guo (2020); Stern–Livan–Smith (2020); Ardévol-Abreu et al. (2020); Almakaty (2025, 2026); Elishar et
al. (2026); `Napirend-kijeloles a digitalis korban - Almakaty 2025 magyarazat.md`; RES 1.

---

## 17. fejezet – Keretezés és szereplők: szemantikai és megszólalói hálózatok ★★

**Nagy kérdés:** *Ugyanaz az árvíz: az egyik lapnál „védekezési teljesítmény”, a másiknál „felkészülési hiányosság”, a
harmadiknál „lakossági veszteség”. Megtalálhatók-e a keretek a fogalmak és szereplők hálózatában – és ki kap hangot az
egyes lapokban?*

**Cél:** keretezés hálózati megközelítései: szemantikai (fogalom-) hálózatok, ANTMN (témahálózat + közösség), framing
element network (szereplők + témák); szereplő- és megszólalói (forrás-) hálózatok; előjeles szereplőhálók (6.4); validálás:
téma ≠ keret.

### Felépítés
1. **17.1 Mi a keret?** ★ – Entman (1993): problémadefiníció, ok, erkölcsi értékelés, megoldás; keret mint fogalmak
   elrendezése → hálózat; `box history` (14.3).
2. **17.2 Szemantikai hálózat és közösségek** ★★ – fogalom-együttelőfordulási háló (13.1) → **gerinc** (10.5; Fudolig et al.:
   gerinc nélkül a gyakori, semleges szavak uralják) → közösségek (8.) = keretjelöltek; Schultz et al. (2012) BP-válság.
3. **17.3 ANTMN és framing element network** ★★ – Walter–Ophir (2019): témamodell → témák hálózata → Louvain →
   „keretcsomagok”; magyar alkalmazás (Nagy, 2024 – BERTopic + ANTMN, magyar hírportálok); Jiang et al. (2025): szereplők és
   témák közös hálózata; dinamikus közösségek keretváltozásra (Cobo et al., 2025).
4. **17.4 Ki kap hangot? Megszólalói hálózatok** ★★ – említett vs. megszólaltatott szereplő; cikk–megszólaló páros gráf →
   vetületek; megszólalók koncentrációja és diverzitása (fokszám-eloszlás, Gini, entrópia); Reese et al. (1994): elitforrások
   klikkje; Seuri et al. (2024): a hibrid médiakörnyezet inkább koncentrálta a forrásokat. HKK 2. irány (szakdolgozati
   kiindulópont).
5. **17.5 Előjeles szereplőhálók** ★★ – ki kit bírál / támogat (relációs tartalomelemzés, 14.3 → LLM-kinyerés, 13.3);
   strukturális egyensúly (6.4) → táborok; lapok közötti összevetés.
6. **17.6 Validálás** ★★ – ⚖️ Konszenzus és vita: a számítógépes „keretek” széles korpuszon gyakran témák (Nicholls et al.,
   2020); szintetikus validáló korpusz (Chan et al., 2024); kódkönyv, kézi annotáció, annotátorok közötti egyetértés;
   stabilitás (8.7); a médiumnév elrejtése LLM-elemzésnél.
7. **17.7 Alkalmazás: az Árvízhét keretezési térképe** ★★ – a HKK „eseményenkénti keretezési térkép” táblázata
   (címben hangsúlyozott elem, megszólalók, magyarázat, megoldás) hálózatokból levezetve, minden cella mögött a forráscikkel.

### Kidolgozott példák
- 8 fogalom együttelőfordulási hálója → gerinc → 2 közösség: melyik keret?
- Ugyanez gerinc nélkül: a „víz”, „ember”, „nap” szavak mindent összekötnek.
- Megszólalói koncentráció: két lap 10–10 megszólalása, Gini / entrópia.
- Előjeles szereplőháló 5 szereplővel → két tábor (6.4).
- Téma vs. keret: két cikk ugyanarról a témáról ellentétes kerettel – a témahálózat „egynek” látja őket.

### Interaktív szemléltetések
- `frame-network` – a fejezet fő widgetje: az Árvízhét fogalomhálója; gerincszűrő-csúszka; közösségek színezve; lapszűrő;
  egy közösségre kattintva a hozzá tartozó mondatok (kitalált korpusz).
- `who-speaks` – lap × megszólaló páros gráf; vetület; koncentrációs mutatók lapokként, oszlopdiagramon.
- `signed-actors` – előjeles szereplőháló, lapváltóval; kiegyensúlyozatlan háromszögek; táborok.
- `frame-vs-topic` – kártyák: a tanuló dönti el, hogy a közösség téma vagy keret – utána az indoklás.

### Kvízek
`gh17-171` … `gh17-177`, `gh17-final`.

### Csapdák
Közösség = keret automatikusan · gerinc nélküli fogalomháló · említés = megszólalás · a hosszabb cikkek / nagyobb lapok
több élt adnak (normalizálás) · az LLM-kinyerés torzításai (médiumnév) · egyetlen futás közösségeire építeni.

### Források
HKK; PDF: *Computational News Framing Analysis via Community Detection*; Entman (1993); Walter–Ophir (2019); Nagy (2024);
Jiang et al. (2025); Cobo et al. (2025); Fudolig et al. (2021/22); Segev (2020); Nicholls et al. (2020); Chan et al. (2024);
Reese–Grant–Danielian (1994); Seuri et al. (2024); Schultz et al. (2012); van Atteveldt (2008); RES 2.

---

## 18. fejezet – A médiarendszer térképe: médiumhálózatok, polarizáció, szövegátvétel ★★

**Nagy kérdés:** *Ha a lapokat csúcsoknak tekintjük, és összekötjük őket, ha ugyanazokat az eseményeket választják, egymásra
hivatkoznak, egymás szövegét veszik át vagy ugyanaz a közönségük – milyen térkép rajzolódik ki? Két tábor? Egy központ és
periféria? És mennyit bízhatunk a térképben?*

**Cél:** médiumszintű hálózatok négy típusa (közös esemény, hivatkozás, szövegátvétel, közönségátfedés); polarizáció
mérése hálózaton (modularitás, SBM, asszortativitás); szerkezeti szerepek (mag–periféria, hub / authority); nullmodellek és
szűrés; médiaökoszisztéma-esettanulmányok.

### Felépítés
1. **18.1 Lapok mint csúcsok** ★ – a négy élfajta és a kérdés, amire mindegyik válaszol (HHSZ táblázata); egy lap több
   rétegben (3.6).
2. **18.2 Közös hírszelekció** ★★ – a lap–esemény páros gráf (15.7) vetülete; normalizált átfedés; nullmodell: médiumcímke-
   permutáció eseményen belül (HHSZ). MediaGraph (Bali et al., 2026): hálózatelméleti keret az indiai hírmédia tudósítási
   preferenciáira.
3. **18.3 Hivatkozási és szövegátvételi hálózat** ★★ – hiperlinkek: HITS / PageRank (5.); Adamic–Glance (2005);
   Hrckova et al. (2021, SK/CZ: a bejövő linkek a médiatípus jelzői); szövegátvétel: Horne et al. (2019) *Different Spirals
   of Sameness* – fősodor és alternatív média tartalommegosztási közösségei.
4. **18.4 Közönségátfedés** ★★ – lapok közönségének átfedése (felmérés / mérési panel); **statisztikai szűrés kell** –
   a szűretlen és a szűrt háló más rangsort ad (Mukerjee et al., 2018).
5. **18.5 Polarizáció és szerkezet** ★★ – modularitás, asszortativitás a politikai besorolással, SBM (8.6) – Cointet et al.
   (2021, Franciaország: az ellen-információs oldalak periferikus blokkban); aszimmetrikus polarizáció (Benkler–Faris–
   Roberts, 2018); polarizációs mértékek áttekintése (Interian et al., 2022).
6. **18.6 ⚖️ Visszhangkamrák: hálózati kép vs. egyéni fogyasztás** ★★ – a hálózati nyomadat inkább „igen”, a felmérések
   inkább „nem” (Hartmann et al., 2024/25; Terren–Borge, 2021); Guess (2021): a fogyasztás nagyrészt mérsékelt és átfedő.
   Tanulság: a médiumhálózat ≠ az olvasók hálózata.
7. **18.7 Alkalmazás: egy magyar médiatérkép terve** ★★ – 6–8 magyar hírportál; közös esemény + szövegátvétel rétegek;
   a kérdések, a nullmodellek és a robusztussági ellenőrzés listája (előkészíti a 21. fejezetet). `box tip`: tulajdonosi
   hálózatok mint további réteg (pl. magyar médiatulajdonosi térképek – forrás a kidolgozáskor).

### Kidolgozott példák
- 4 lap × 6 esemény → lapvetület, Jaccard-normalizálás; „melyik két lap hasonlít a legjobban?”
- HITS 5 oldalon: összesítő (hub) vs. eredeti tudósító (authority).
- Közönségátfedés: 3 lap, 100 olvasó – nyers átfedés vs. várható átfedés függetlenség esetén (lift).
- Modularitás két táborra a 8 csúcsú lapgráfon; ugyanez véletlen címkékkel (nullmodell).

### Interaktív szemléltetések
- `media-map` – a fejezet fő widgetje: 8 kitalált lap, négy rétegfül (esemény / hivatkozás / átvétel / közönség);
  közösségek és szerepek; nullmodell-gomb (permutáció → $Q$ hisztogram).
- `polblogs-explorer` – Adamic–Glance adat; táborok szerinti színezés; HITS / PageRank; a két tábor közötti élek aránya.
- `audience-overlap-filter` – nyers vs. szűrt közönségátfedési háló, szűrőküszöb csúszkával; a központi lapok rangsora
  hogyan változik.
- `echo-chamber-lenses` – ugyanaz a szimulált populáció két „lencsén”: hálózati (megosztás) és fogyasztási (olvasott lapok)
  mérés – két különböző következtetés.

### Kvízek
`gh18-181` … `gh18-187`, `gh18-final`.

### Csapdák
A térkép az élfajtától függ · szűretlen közönségátfedés · nagy lapok mindennel átfednek (normalizálás) · a link nem
egyetértés · szövegátvétel vs. közös ügynökségi forrás · a médiumhálózatból egyéni fogyasztásra következtetni
(ökológiai tévkövetkeztetés).

### Források
HHSZ; PDF: *MediaGraph* (Bali et al., 2026, arXiv 2604.20982); *Network analysis reveals news press landscape…*; Adamic–Glance
(2005); Benkler–Faris–Roberts (2018); Horne et al. (2019); Li–Bond (2023); Mukerjee et al. (2018); Mukerjee (2021); Cointet et
al. (2021); Hrckova et al. (2021); Heft et al. (2020); Interian et al. (2022); Hartmann et al. (2024/25); Guess (2021); RES 2–3.

---

## 19. fejezet – Hírterjedés és félretájékoztatás hálózatokon ★★–★★★

**Nagy kérdés:** *Igaz-e, hogy a hamis hír gyorsabban és messzebbre terjed, mint a valódi? – És ha igen: a hálózat
szerkezete miatt, vagy mert a hamis hír „fertőzőbb”?*

**Cél:** a 9. fejezet modelljeinek alkalmazása valós hírterjedésre: kaszkádok mérése, a Vosoughi-féle eredmény és
újraértelmezése (méretkontroll), visszhangkamrák és kaszkádok, k-mag, koordinált viselkedés felderítése
felhasználó-hasonlósági hálózattal, a beavatkozások hatásának mérése; az adathozzáférés mai korlátai.

### Felépítés
1. **19.1 A terjedési fa** ★ – 🔁 2.5 és 9.4; méret, mélység, szélesség, strukturális virálisság egy Twitter15/16-szerű
   (anonimizált vagy szimulált) fán.
2. **19.2 A hamis hír terjedése** ★★ – Vosoughi–Roy–Aral (2018): messzebbre, gyorsabban, mélyebbre – emberek, nem botok.
   ⚖️ **Konszenzus és vita:** Juul–Ugander (2021): ha a kaszkádméretet kontrolláljuk, a szerkezeti különbségek nagyrészt
   eltűnnek → a különbség inkább a „fertőzőképességben” van (Slaughter et al., 2025 is). Hüvelykujjszabály: **„kaszkádokat
   csak azonos méretűekkel hasonlíts össze”**.
3. **19.3 Visszhangkamrák és kaszkádok** ★★ – homogén klaszterek mint a kaszkádméret előrejelzői (Del Vicario et al.,
   2016); kísérlet: szegregált hálózatokban több hamis információ (Stein et al., 2023); 🔁 18.6 vita.
4. **19.4 A hálózat magja** ★★ – k-mag felbontás (új fogalom kézzel); Shao et al. (2018): a dezinformációs háló magjában
   eltűnnek a tényellenőrzők.
5. **19.5 Koordinált viselkedés** ★★ – felhasználó-hasonlósági háló (közös URL / retweet rövid időablakban) → szűrés →
   közösség (Giglietto et al., 2020; Schoch et al., 2022); nullmodell (Cinelli et al., 2022); ⚖️ a koordináció ≠
   inautentikusság (Rogers et al., 2025: legitim médiacsoportok is fennakadnak).
6. **19.6 Beavatkozások és okság** ★★★ – tényellenőrzés, Community Notes (szintetikus kontroll: Slaughter et al., 2025);
   terepkísérlet (Bail et al., 2018); miért nem elég a megfigyelési hálózat az oksági állításhoz (6.2 homofília vs. hatás).
7. **19.7 Adathozzáférés 2026-ban** ★ – Twitter Academic API (2023) és CrowdTangle (2024) megszűnése; Meta Content Library;
   DSA szerinti kutatói hozzáférés (📅 ellenőrzendő állapot); a régi benchmarkok (Twitter15/16, PHEME, FakeNewsNet)
   licenckorlátai. Következmény: a terjedéskutatás egy része a hírszövegek hálózata felé fordul (14.7).
8. **19.8 Modellek és valóság** ★★ – SIR-típusú pletykamodellek: túlnyomóan szintetikus hálón, gyengén validálva
   (Karmaker et al., 2026) – a 9. fejezet modelljei magyarázó, nem előrejelző eszközök.

### Kidolgozott példák
- Két 10 csúcsú terjedési fa: azonos méret, eltérő mélység / strukturális virálisság.
- Méretkontroll: két csoport kaszkádjainak átlagos mélysége nyersen és méret szerint párosítva (kitalált adat, Python).
- k-mag felbontás egy 8 csúcsú gráfon.
- Koordinációs háló: 6 fiók, közös linkek 60 másodpercen belül → élek → közösség; és egy legitim lapcsoport, amely
  ugyanígy viselkedik.

### Interaktív szemléltetések
- `cascade-compare` – a fejezet fő widgetje: két (szimulált) kaszkádpopuláció; „méret szerinti párosítás” kapcsoló → a
  különbség eltűnik vagy megmarad; terjedési fák rajza.
- `k-core` – csúcsok rétegenkénti lehántása animálva.
- `coordination-detector` – fiókok idővonala; időablak-csúszka; a felhasználó-hasonlósági háló és közösségei élőben;
  „hamis pozitív” esetek jelölése.
- `echo-cascade` – a `sir-network` (9.) bővítése homofíliacsúszkával: a kaszkádméret-eloszlás változása.

### Kvízek
`gh19-191` … `gh19-198`, `gh19-final`.

### Csapdák
Kaszkádösszehasonlítás méretkontroll nélkül · a koordináció ≠ manipuláció · a botok szerepének túlbecslése · a megfigyelt
terjedésből oksági hatásra következtetni · régi benchmarkok mint a mai platformok tükre · szimulációs eredmény mint empirikus
tény.

### Források
RES 3; NSB 10; MENC 7; Vosoughi–Roy–Aral (2018); Juul–Ugander (2021); Slaughter et al. (2025); Del Vicario et al. (2016);
Stein et al. (2023); Shao et al. (2018); Giglietto et al. (2020); Schoch et al. (2022); Cinelli et al. (2022); Rogers et al.
(2025); Di Marco et al. (2024); Bail et al. (2018); Karmaker et al. (2026); Goel et al. (2016).

---

## 20. fejezet – Mélytanulási gráfmodellek a hírelemzésben ★★★

**Nagy kérdés:** *Egy hírről a szövege mellett tudjuk, kik osztották meg, milyen entitásokat említ, és milyen más hírekkel
áll kapcsolatban. Segít-e ez a gráf egy mélytanulási modellnek abban, hogy felismerje az álhírt, ajánljon olvasnivalót,
vagy összefoglalja egy hét eseményeit? – És mennyire hihetünk a 99%-os pontosságnak?*

**Cél:** a 11–13. fejezet eszközeinek alkalmazása a hírelemzés négy fő gépi tanulási feladatára, a 2026-os konszenzussal és
vitákkal: (1) terjedésalapú és heterogén gráfos álhírfelismerés, (2) tudásgráffal bővített hírajánlás, (3) eseménygráfok
és idővonalak, (4) LLM + gráf (GraphRAG, LLM-mel épített tudásgráfok); és a kiértékelés buktatói.

> 🔬 **Kidolgozáskor kötelező:** Consensus-frissítés: 2025–2026-os eredmények az álhírfelismerés tartományok közötti
> általánosításáról, LLM-alapú vs. gráfalapú hitelességvizsgálatról, GraphRAG hírkorpuszokon, időbeli gráfhálók
> eseményelőrejelzésre (GDELT / ICEWS). `📅 Állapot: 2026`.

### Felépítés
1. **20.1 A feladatok térképe** ★★ – csúcs-, él-, gráfszintű feladatok a hírgráfokon (🔁 MI 13.6): hír hitelessége
   (gráfszintű: terjedési fa), ajánlás (élszintű: olvasó–hír), esemény-előrejelzés (időbeli élszintű), összefoglalás
   (gráf → szöveg).
2. **20.2 Terjedésalapú álhírfelismerés** ★★★ – a terjedési fa mint gráf → GNN → osztályozás; Monti et al. (2019);
   Bi-GCN (Bian et al., 2020): lefelé és felfelé irányú GCN; UPFD (felhasználói preferencia + fa; PyG-ben elérhető
   Politifact / GossipCop gráfok). Taxonómia: tudásvezérelt, terjedésalapú, heterogén társas kontextus (Gong et al., 2023).
3. **20.3 Heterogén és tudásvezérelt modellek** ★★★ – hír–entitás–téma gráf (CompareNet: a hír összevetése a
   tudásbázissal); HeteroSGT (2024); témafüggetlen tanulás (PSIN, 2022).
4. **20.4 ⚖️ Mennyire hihetünk az eredményeknek?** ★★ – a fejezet kulcsszakasza: adathalmazon belül kiváló, új adaton
   gyenge (Han et al., 2020; Hoy et al., 2022; Dell'Oglio et al., 2026: 12 módszer × 10 adathalmaz); entitás-torzítás
   (Zhu et al., 2022: a „Trump” szó hamis jel); kiadói szintű címkék (Hoy et al., 2025); véletlen felosztás → szivárgás →
   98–99%; a gondosan válogatott adaton kb. 75% AUC (FANG). Hüvelykujjszabály: **„eseményen, időn és forráson átívelő
   teszt nélkül nincs eredmény”**.
5. **20.5 Tudásgráffal bővített hírajánlás** ★★ – DKN (Wang et al., 2018): szó–entitás igazítás; AnchorKG (2021)
   magyarázó útvonalak; heterogén GNN + diverzitás (2024); MIND benchmark; ⚖️ ajánlás és diverzitás / szűrőbuborék
   (🔁 MI 23., 18.6).
6. **20.6 Eseménygráfok, történetek, idővonalak** ★★★ – eseményközpontú tudásgráf hírekből (Rospocher et al., 2016),
   EventKG; Story Forest (🔁 15.6); idővonal-összefoglalás eseménygráf-tömörítéssel (Li et al., 2021); időbeli
   tudásgráf-előrejelzés GDELT-szerű adatokon (🔁 12.5; EdgeBank-alapvonal!).
7. **20.7 LLM + gráf** ★★ – LLM-mel kinyert tudásgráf hírkorpuszból (13.3); GraphRAG globális kérdésekre („mi történt a
   héten?”); ⚖️ GraphRAG vs. RAG: inkább kiegészítik egymást, az előny feladatfüggő (Han et al., 2025; GraphRAG-Bench);
   szerkesztőségi esettanulmány (NTNU); a kinyert gráf validálása (forráshely-hűség).
8. **20.8 Döntési táblázat** ★★ – feladat → adat → gráf → alapvonal → modell → kötelező kiértékelés.

### Kidolgozott példák
- Bi-GCN szemléletesen egy 6 csúcsú fán: a lefelé és felfelé irányú szomszédsági mátrix, egy aggregálási lépés skalárokkal.
- Gráfszintű kiolvasás két fán (összeg vs. átlag – 🔁 MI 13.6): a mély és a széles kaszkád megkülönböztethető-e.
- DKN-ötlet kicsiben: egy cím szavai + entitásbeágyazásai → hír vektor → olvasói profil skaláris szorzata.
- Szivárgás számokkal: véletlen vs. esemény szerinti felosztás pontossága ugyanazon (kitalált) adaton.
- GraphRAG kicsiben: 6 cikk → entitásgráf → 2 közösség → 2 összefoglaló → válasz a „mi történt?” kérdésre.

### Interaktív szemléltetések
- `propagation-gnn` – előre tanított kis GNN (UPFD Politifact-részhalmaz, előre számolt jóslatokkal): fát választasz,
  látod a jóslatot és a csúcsonkénti hozzájárulást; „tanítás: Politifact → teszt: GossipCop” kapcsoló → a pontosság esése.
- `split-leakage` – a fejezet fő widgetje: ugyanaz a modell (előre számolt eredmények) véletlen / esemény szerinti /
  időbeli / forrás szerinti felosztással – oszlopdiagram.
- `kg-recommender` – kitalált olvasó + 10 hír + kis tudásgráf; az ajánlás magyarázó útvonala kiemelve; diverzitás-csúszka.
- `event-timeline-graph` – az Árvízhét eseménygráfja időtengelyen; összefoglaló csúcsok tömörítéssel.
- `graphrag-news` – a 13. fejezet `graphrag-flow` widgetje az Árvízhét korpuszán (szimuláció, rögzített kimenetekkel).

### Kvízek
`gh20-201` … `gh20-208`, `gh20-final`.

### Csapdák
Véletlen felosztás → szivárgás · egy adathalmazon mért pontosság mint általános képesség · kiadói címke mint cikkcímke ·
a felhasználói terjedési adat ma sokszor nem érhető el (19.7) · bonyolult modell erős alapvonal nélkül (szöveg + logisztikus
regresszió, „ismétlés” alapvonal) · a figyelmi súly nem magyarázat · a GraphRAG összefoglalója nem forrás.

### Források
RES 4; GRL; MI 12–13., 18., 23. fejezet; Monti et al. (2019); Bian et al. (2020); UPFD (Dou et al., 2021); Gong et al.
(2023); Hu et al. (2021) CompareNet; Zhang et al. (2024) HeteroSGT; Min et al. (2022) PSIN; Han et al. (2020); Hoy et al.
(2022, 2025); Zhu et al. (2022); Dell'Oglio et al. (2026); Wang et al. (2018) DKN; Liu et al. (2021) AnchorKG; Wu et al.
(2022) hírajánlási áttekintés; Rospocher et al. (2016); Gottschalk–Demidova (2018); Liu et al. (2020) Story Forest; Li et al.
(2021); Knez–Žitnik (2023); Edge et al. (2024); Han et al. (2025); GraphRAG-Bench (2025).

---

## 21. fejezet – Esettanulmány: egy hírhét hálózatelemzése az elejétől a végéig ★★

**Nagy kérdés:** *Megmutatható-e – ellenőrizhetően –, milyen eltérő képet kapsz ugyanarról az eseményről attól függően,
melyik lapot olvasod? (A szakdolgozati jegyzet „felhasználói ígérete”, HKK.)*

**Cél:** a teljes témakör eszközeinek összekapcsolása egy végigvitt elemzésben: kérdés → gyűjtés → szövegből gráf →
eseménycsoportok → lapok összehasonlítása (napirend, keret, megszólalók) → nullmodell és robusztusság → validálás →
megjelenítés → korlátok és etika. Két szinten: (1) az **Árvízhét** (kitalált, teljesen átlátható, minden szám kézzel
követhető), (2) egy **valós, kis magyar hírminta** terve (6–8 portál, 2–4 hét; csak metaadat és kinyert hálózat kerül az
oldalra) – a valós rész megvalósítása a szakdolgozat haladásától függ.

### Felépítés
1. **21.1 A kutatási kérdés és az él definíciója** ★ – a HKK hat irányából kettő (keretezési térkép + ki kap hangot);
   melyik kérdéshez melyik gráf (3.8 döntési táblázata).
2. **21.2 Adatlánc** ★★ – gyűjtés, tisztítás, duplikátumok, ügynökségi anyag (15.); entitások és megszólalók (13.); a
   lánc minden lépésének naplózása.
3. **21.3 Eseményenkénti összehasonlítás** ★★ – eseménycsoportok (15.5), lap–esemény páros gráf; eseményen belüli
   különbségek, majd lapprofil.
4. **21.4 Három nézet** ★★ – napirend (16.: lapok attribútumhálózatai + QAP), keret (17.: gerinc + közösségek),
   megszólalók (17.4: koncentráció, diverzitás).
5. **21.5 Ellenőrzés** ★★ – nullmodellek (7., 10.: médiumcímke-permutáció eseményen belül), robusztusság (küszöb,
   ablak, közösségkereső több futása), kézi validálás (kódkönyv, két annotátor egy részmintán), LLM-kontroll (médiumnév
   elrejtése).
6. **21.6 Megjelenítés** ★ – a HKK eseményenkénti összehasonlító táblája hálózati ábrákkal, minden cella mögött forrás;
   bizonytalanság és mintanagyság kijelzése.
7. **21.7 Korlátok és etika** ★ – a nem gyűjtött ≠ elhallgatott; okság; szerzői jog; adatvédelem; a hálózati ábra
   retorikai ereje – hogyan ne vezessük félre az olvasót.

### Kidolgozott példák
- Az Árvízhét teljes elemzése lépésenként, minden számmal (a korábbi fejezetek eredményeinek összerakása).
- Egy robusztussági táblázat: 3 küszöb × 2 közösségkereső × 10 futás – mely következtetések maradnak meg.
- Egy „rossz elemzés” és javítása: nullmodell nélküli, egyetlen küszöbös, egyetlen futásos változat vs. a helyes.

### Interaktív szemléltetések
- `pipeline-dashboard` – a fejezet fő widgetje: az Árvízhét elemzési lánca lépésenként (fülek); minden lépésnél a
  paraméterek állíthatók, és látszik, hogyan változnak a végső következtetések („robusztussági jelzőlámpa”).
- `event-comparison-table` – a HKK árvízi táblázata; cellára kattintva a forrásmondat és a hálózati bizonyíték.
- `bad-vs-good-analysis` – két elemzés egymás mellett (`two-col`); a tanuló megkeresi a hibákat.
- (opcionális) `hu-news-sample` – valós magyar minta aggregált hálózatai, ha a szakdolgozati adatgyűjtés elkészül.

### Kvízek
`gh21-211` … `gh21-217`, `gh21-final`; a „Vegyes gyakorló feladatok” itt a teljes IV. blokkra.

### Csapdák
Az összes eddigi csapda egy helyen – ellenőrzőlistaként (`box warn`), a megfelelő fejezetre mutató linkekkel.

### Források
HKK (`idea_creation.md`, `hirkeretezes-kutatasi-hatter.md`, `konzulens1.md`); HHSZ; NAS 9. (Mit jelent ez a
szakdolgozatnak?); RES; Media Frames Corpus, BASIL, SemEval-2023 Task 3 (HKK hivatkozásai).

---

## Közös komponensek (elsőként kidolgozandók)

| Komponens | Tartalom | Használja |
|---|---|---|
| `assets/graph.js` | gráf adatszerkezet (irányított / súlyozott / előjeles / páros / időbeli); erőirányított elrendezés (Fruchterman–Reingold) + húzható csúcsok canvasra; szerkesztő mód (csúcs / él kattintással); színezés és méretezés attribútum szerint; algoritmusok: BFS, Dijkstra, komponensek, centralitások (fokszám, közelség, köztesség – Brandes, sajátvektor, PageRank, HITS), klaszterezettség, asszortativitás, modularitás, Louvain / Leiden-szerű, címketerjesztés, konfigurációs modell (élcsere), ER / WS / BA generátor, SIR / független kaszkád / küszöbmodell szimulátor, QAP-permutáció, diszparitásszűrő, k-mag; magolt véletlen (a `ml.js` `rng`-jének újrahasznosítása) | 1–21. |
| `graph-draw` widget | a témakör „játszótere” (1. fejezet) – a későbbi fejezetek beágyazzák, csak a kijelzett mérőszám változik | 1–10. |
| `arvizhet-data.js` | az Árvízhét teljes adata: 4 lap, 12 (a 15. fejezettől kb. 40) cikk címe és metaadata, szereplők, megszólalók, keretek, előjeles relációk, megosztási kaszkád (kitalált), szimulált közönségfelmérés | 1., 3., 5., 6., 8., 13–21. |
| valós hálózatok JSON-ben | karate (meglévő `graph-data.js` újrahasznosítva), Les Misérables, polblogs, polbooks, UPFD-részhalmaz, GDELT-kivonat – előre számolt elrendezéssel és mérőszámokkal; a generáló szkriptek `_parts/graf/` alatt | 5., 7., 8., 11., 18–20. |
| a MI 13. fejezet widgetjei | `message-passing`, `gcn-karate` – hivatkozással, nem másolva | 12. |

## Javasolt kidolgozási sorrend
1. `assets/graph.js` + `graph-draw` + `arvizhet-data.js` (a közös alap; az Árvízhét adatait itt rögzítjük és Pythonnal
   ellenőrizzük).
2. **1–3. fejezet** (a gráfok nyelve és a gráftípusok – minden további erre épül).
3. **5., 7., 8., 10. fejezet** (centralitás, nullmodell, közösségek, összehasonlítás – a hírelemzés statisztikai magja).
4. **14. fejezet** (történeti áttekintés – a IV. blokk térképe; a 2–10. fejezet `box history` dobozai erre hivatkoznak),
   majd **15–17. fejezet** (a szakdolgozathoz legközelebbi rész).
5. **4., 6., 9. fejezet**, majd **18–19. fejezet**.
6. **11–13. fejezet**, majd **20. fejezet** (gépi tanulás – a MI 12–13. fejezetére épít).
7. **21. fejezet** (esettanulmány) – utoljára, ha lehet, valós magyar mintával.

*(Alternatíva: szigorúan 1 → 21 sorrendben. A fenti sorrend előnye, hogy a szakdolgozathoz szükséges napirend- és
keretezési fejezetek hamar elkészülnek, a gépi tanulásos rész pedig utólag is beilleszthető.)*

## Nyitott kérdések a kidolgozás előtt
- **Valós magyar adat:** legyen-e a 21. fejezetben (és a 15–18. fejezet egy-egy szakaszában) valós magyar hírminta? Ha
  igen: forrásportálok, időszak, és mit szabad közzétenni (csak metaadat és kinyert hálózat).
- **A témakör mérete:** 21 fejezet sok; összevonható pl. a 4. a 8.-cal (spektrális rész), a 12. a 20.-szal (heterogén és
  időbeli GNN-ek csak alkalmazásban) – 19 fejezetre.
- **„Kiegészítés” jelölés:** forráskönyv híján a CLAUDE.md „Kiegészítés” jelölését csak ott használjuk, ahol a magyar
  egyetemi gráfelmélet-tananyag része (pl. Kőnig tétele, Erdős–Gallai) hiányzik a hálózattudományi tankönyvekből.
