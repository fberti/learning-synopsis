# Mesterséges intelligencia – fejezettervezet

Ez a dokumentum a *Mesterséges intelligencia* témakör fejezeteinek **kidolgozási terve**, az Analízis (`analizis/TERV.md`) és a
Matematikai statisztika (`matematikai-statisztika/TERV.md`) tervének mintájára. A `Topics/AI/resources` mappa 19 forrásából
szintetizálja az anyagot: minden fejezethez megadja a felépítést, a kulcsfogalmakat, a példákat, az interaktív szemléltetések
ötleteit, a kvízeket, a csapdákat és a forrásokat. A kidolgozáskor ebből indulunk ki; a terv menet közben finomítható.

---

## 0. Általános szerkesztési elvek

### Stílus
- **A `CLAUDE.md` sémája az irányadó:** motiváló kérdés → útiterv → lépések az egyszerűtől a bonyolultig (kis, kézzel
  végigszámolható eset → szabály „miért?”-tel → 2–3 egylépéses kidolgozott példa → buktató → csukott gyakorló blokk) →
  alkalmazás → összefoglalás + döntési táblázat → kvíz.
- **Előbb a konkrét eset, aztán a fogalom.** Az MI-ben ez különösen fontos, mert a szakirodalom tele van absztrakt
  diagramokkal. Minden új modellt egy **kézzel végigszámolható mini-példán** mutatunk meg (4–10 adatpont, 2–3 neuron,
  3 token), és csak utána általánosítunk. A mintapéldák számait Pythonnal ellenőrizzük.
- **Lépcsőzetes nehézség.** Jelölés: ★ alap · ★★ közép · ★★★ haladó / kitekintés. Az ★★★ szakaszok kihagyhatók a
  továbbhaladás veszélyeztetése nélkül.
- **Intuíció + matematika egyensúlya.** A gerinc a szemléletes magyarázat (DLV, HAW, MLAB stílusában); a képletek
  (MDL, ESL szintjén) `box def`-ben és lenyitható „📐 A matematika mögötte” részekben jönnek. Aki csak az intuíciót akarja,
  az is végigérhet a fejezeten.
- **Kód opcionálisan.** A források többsége Python-alapú (PDL, AAMLP, MLD, MLAB). Ahol egy rövid kódrészlet sokat ad
  (scikit-learn-illesztés, PyTorch-réteg, API-hívás), csukott `<details>` mögé kerül „🐍 Python” címmel, 5–15 sorban,
  futtatva és ellenőrizve. A megértéshez a kód sosem szükséges.
- **Interaktivitás.** Fejezetenként 4–8 szemléltetés. Az MI-ben a legfontosabb élmény a **„nézd, ahogy tanul”**: a widgetek
  nagy része élőben tanít egy kis modellt (egyenes, döntési határ, neurális háló, Q-tábla), és látjuk a veszteség csökkenését.
- **Ellenőrzés.** Szakaszonként kvíz, fejezetzáró kvíz, „Vegyes gyakorló feladatok”, szómagyarázó.
- **Frissesség.** Az MI gyorsan változik. A **fogalmak és elvek** (gradiens módszer, figyelem, RAG, ágensciklus) tartósak;
  a **konkrét modellek, termékek, keretrendszerek** csak példaként szerepelnek, `📅 Állapot: 2026` jelöléssel. Számszerű
  állítást (paraméterszám, benchmark-eredmény, ár) mindig forrással és dátummal adunk meg.
- **Források kritikus kezelése.** Ahol a források ellentmondanak egymásnak (pl. az „emergens képességek” vitája, a
  CoT-szöveg hűsége) vagy elavultak (a 2016-os ESL vagy a 2021-es MLD egyes állításai), az oldalon jelezzük.

### Terminológia
Magyar elnevezések, az angol megfelelő első előforduláskor zárójelben, eltérés esetén `box tip`. A bevett angol betűszavakat
(LLM, RAG, MCP, CNN, GAN, RLHF) megtartjuk, de első előfordulásukkor kifejtjük. Alapszótár:

| Magyar | Angol |
|---|---|
| gépi tanulás / mélytanulás | machine learning / deep learning |
| felügyelt / felügyelet nélküli / megerősítéses / önfelügyelt tanulás | supervised / unsupervised / reinforcement / self-supervised learning |
| jellemző, címke, minta | feature, label, sample |
| veszteségfüggvény | loss function |
| gradiens módszer (gradiensereszkedés) | gradient descent |
| visszaterjesztés | backpropagation |
| túlillesztés / alulillesztés | overfitting / underfitting |
| tévesztési mátrix | confusion matrix |
| pontosság / precizitás / felidézés | accuracy / precision / recall |
| beágyazás, látens tér | embedding, latent space |
| figyelem(mechanizmus), önfigyelem | attention, self-attention |
| előtanítás / utótanítás / finomhangolás | pre-training / post-training / fine-tuning |
| igazítás | alignment |
| következtetés (a modell futtatása) | inference |
| visszakereséssel kiegészített generálás | retrieval-augmented generation (RAG) |
| ágens, eszköz, eszközhívás | agent, tool, tool / function calling |

⚠️ **Buktató:** az *accuracy* és a *precision* magyarul is könnyen összekeveredik – a 6. fejezetben külön tip-doboz rendezi.

### Technikai konvenciók
- Mappa: `mesterseges-intelligencia/NN-rovid-cim/` → `index.html`, `widgets.js`, `quizzes.js`.
- Kvízazonosítók: `ai<fejezet>-<szakasz>`, pl. `ai9-93`, `ai16-165`; fejezetzáró: `ai9-final`. A témakör `index.html`-jében
  és a főoldal `data-progress` listájában frissíteni kell.
- KaTeX; `<` helyett `\lt`. Vektorok félkövérrel ($\mathbf x$), mátrixok nagybetűvel ($W$), transzponált: $\mathbf w^\top$.
- Doboztípusok: `def`, `thm`, `example`, `tip`, `warn`, `history`.
- **Nincs élő LLM-hívás.** Az oldal statikus (GitHub Pages, nincs API-kulcs). Az LLM- és ágens-widgetek **előre rögzített,
  valódi modellkimeneteket** játszanak le (JSON-forgatókönyvek), vagy apró, böngészőben futó játékmodellt használnak
  (bigram nyelvi modell, TF-IDF-keresés). Ezt a widget mindig jelzi („szimuláció”).
- **Nincs nehéz külső könyvtár.** A tanítást végző widgetek saját, kis JS-modulra épülnek (lásd *Közös komponensek*);
  TensorFlow.js és hasonlók nem kellenek. Előre tanított mini-modellek JSON-ban, ≤ 1 MB.

### Előfeltételek és kapcsolatok más témakörökkel
- **Valószínűségszámítás** (1–4. fejezet): feltételes valószínűség, Bayes-tétel (→ naiv Bayes, 5. fejezet), eloszlások,
  várható érték (→ veszteségek, mintavételezés az LLM-ekben).
- **Matematikai statisztika:** leíró statisztika (→ 4. fejezet), regresszió és legkisebb négyzetek (→ 3. fejezet),
  becslés, konfidenciaintervallum, hipotézisvizsgálat (→ 6. fejezet, A/B teszt a 22. fejezetben).
- **Analízis:** derivált, láncszabály (4. fejezet), gradiens, többváltozós szélsőérték, legkisebb négyzetek (9. fejezet)
  → a gépi tanulás optimalizálásának teljes háttere (2., 3., 10. fejezet).
- **Játékelmélet:** stratégia, egyensúly → megerősítéses tanulás (15.), többágenses rendszerek (20.).
- **Ágensalapú modellezés:** egyszerű szabályokból kibontakozó viselkedés → többágenses rendszerek (20.),
  evolúciós algoritmusok (24.).
- A 2. fejezet a fenti matematikai minimumot önállóan is összefoglalja („🔁 Emlékeztető” dobozokkal), így az MI-témakör
  a többi témakör befejezése nélkül is olvasható.

### Források (rövidítések)
| Rövidítés | Forrás | Szerep |
|---|---|---|
| **HAW** | R. T. Kneusel: *How AI Works – From Sorcery to Science* (No Starch, 2023) | közérthető áttekintés, történet, LLM-ek, implikációk |
| **MLAB** | O. Theobald: *Machine Learning for Absolute Beginners* (3. kiad.) | a legszelídebb belépő a klasszikus algoritmusokhoz |
| **MLD** | J. Mueller – L. Massaron: *Machine Learning for Dummies* (2. kiad., Wiley, 2021) | matek alapok, hasonlóság, lineáris modellek, ajánlók, etika |
| **MDL** | R. T. Kneusel: *Math for Deep Learning* (No Starch, 2021) | valószínűség, lineáris algebra, differenciál- és mátrixkalkulus, backprop kézzel, gradiens módszer |
| **PDL** | R. T. Kneusel: *Practical Deep Learning – A Python-Based Introduction* (No Starch) | adatkészletek, klasszikus modellek kísérletekkel, MLP, CNN, értékelés |
| **DLV** | A. Glassner: *Deep Learning – A Visual Approach* (No Starch, 2021) | vizuális intuíció a teljes mélytanuláshoz (Bayes → Transformer, RL, GAN) |
| **ESL** | Hastie – Tibshirani – Friedman: *The Elements of Statistical Learning* (2. kiad.) | a statisztikai tanulás elmélete – ★★★ mélyítés |
| **AAMLP** | A. Thakur: *Approaching (Almost) Any Machine Learning Problem* | gyakorlati receptek: CV, metrikák, kategóriás változók, jellemzők, HPO, kép, szöveg, ensemble |
| **RWML** | Brink – Richards – Fetherolf: *Real-World Machine Learning* (Manning) | munkafolyamat, valós adat, jellemzőmérnökség, esettanulmányok (NYC taxi, hirdetés) |
| **MLQ** | S. Raschka: *Machine Learning and AI Beyond the Basics* (No Starch, 2024) | 30 rövid haladó kérdés–válasz (beágyazás, Transformer, PEFT, értékelés, eltolódás, konform predikció) |
| **FLLM** | T. Xiao – J. Zhu: *Foundations of Large Language Models* (arXiv 2501.09223, 2025) | előtanítás, generatív modellek, promptolás, igazítás, következtetés |
| **AIE** | C. Huyen: *AI Engineering* (O'Reilly, 2025) | alkalmazásépítés foundation modellekre: értékelés, prompt, RAG, ágensek, finomhangolás, inference |
| **DMLS** | C. Huyen: *Designing Machine Learning Systems* (O'Reilly, 2022) | ML-rendszerek életciklusa, adat, telepítés, eltolódás, MLOps, felelős AI |
| **MLSYS** | V. J. Reddi et al.: *Machine Learning Systems* (Harvard, MLSysBook, 2025) | rendszerszemlélet: keretrendszerek, tanítás, hatékonyság, telepítés, TinyML, biztonság, fenntarthatóság |
| **MLDI** | Khang Pham: *Machine Learning Design Interview* (2022) | rendszertervezési esettanulmányok (ajánlók, hírfolyam, hirdetés, ETA) |
| **HGA** | H. Roitman: *The Hitchhiker's Guide to Agentic AI* (arXiv 2606.24937, v1.3, 2026) | LLM-architektúra, RL módszerek LLM-ekhez (PPO, DPO, GRPO), érvelés, ágensek (RAG, memória, harness, MCP, A2A) |
| **WAA** | B. Labaschin: *What Are AI Agents?* (O'Reilly report) | rövid bevezető: ágenstípusok, eszközök |
| **EDL** | M. Lanham: *Evolutionary Deep Learning* (Manning) | genetikus algoritmusok, neuroevolúció, NEAT |
| **MV** | J. W. Rettberg: *Machine Vision – How Algorithms are Changing the Way We See the World* (Polity, 2023) | kultúra- és társadalomtudományi nézőpont a gépi látásra |

**A források szerepe a szintézisben:**
- *Intuíció-gerinc:* DLV (mélytanulás), HAW (áttekintés), MLAB (klasszikus ML).
- *Matematikai gerinc:* MDL (alapok), ESL (elmélet ★★★).
- *Gyakorlati gerinc:* AAMLP, PDL, RWML (klasszikus ML és mélytanulás), AIE (LLM-alkalmazások), DMLS + MLSYS (rendszerek).
- *LLM- és ágens-gerinc:* FLLM (elmélet), HGA (2026-os állapot, ágensek), AIE (mérnöki gyakorlat), MLQ (rövid haladó kérdések).
- *Kiegészítők:* MLDI (esettanulmányok), EDL (evolúció), MV (társadalom), WAA (ágensek bevezetője).

---

## A fejezetek áttekintése

| # | Fejezet | Blokk | Szint |
|---|---|---|---|
| 1 | Mi a mesterséges intelligencia? | I. Alapok | ★ |
| 2 | A gépi tanulás matematikai eszköztára | I. Alapok | ★★ |
| 3 | A tanulás anatómiája: adat, modell, veszteség, optimalizálás | II. Klasszikus gépi tanulás | ★ |
| 4 | Adatok és jellemzők | II. Klasszikus gépi tanulás | ★★ |
| 5 | Osztályozás: legközelebbi szomszéd, logisztikus regresszió, naiv Bayes | II. Klasszikus gépi tanulás | ★★ |
| 6 | Modellértékelés és általánosítás | II. Klasszikus gépi tanulás | ★★ |
| 7 | Döntési fák, szupport vektor gépek, együttes módszerek | II. Klasszikus gépi tanulás | ★★ |
| 8 | Felügyelet nélküli tanulás | II. Klasszikus gépi tanulás | ★★ |
| 9 | Neurális hálózatok | III. Mélytanulás | ★★ |
| 10 | A háló tanítása: visszaterjesztés, optimalizálók, regularizáció | III. Mélytanulás | ★★–★★★ |
| 11 | Konvolúciós hálók és gépi látás | III. Mélytanulás | ★★ |
| 12 | Beágyazások, szekvenciák és a figyelemmechanizmus | III. Mélytanulás | ★★–★★★ |
| 13 | Gráf neurális hálók | III. Mélytanulás | ★★–★★★ |
| 14 | Generatív modellek | III. Mélytanulás | ★★★ |
| 15 | Megerősítéses tanulás | III. Mélytanulás | ★★–★★★ |
| 16 | Hogyan működik egy nagy nyelvi modell? | IV. Nagy nyelvi modellek | ★★ |
| 17 | Finomhangolás, igazítás és érvelő modellek | IV. Nagy nyelvi modellek | ★★★ |
| 18 | Promptolás és visszakereséssel kiegészített generálás (RAG) | IV. Nagy nyelvi modellek | ★★ |
| 19 | AI-ágensek: eszközök, ciklus, tervezés, memória | V. AI-ágensek | ★★ |
| 20 | Ágensrendszerek: MCP, többágenses rendszerek, keretrendszerek | V. AI-ágensek | ★★★ |
| 21 | AI-alkalmazások építése és értékelése | VI. Mérnöki gyakorlat | ★★ |
| 22 | ML-rendszerek életciklusa és MLOps | VI. Mérnöki gyakorlat | ★★ |
| 23 | Rendszertervezési esettanulmányok *(opcionális)* | VI. Mérnöki gyakorlat | ★★ |
| 24 | Evolúciós algoritmusok és neuroevolúció *(opcionális)* | VII. Kitekintés | ★★ |
| 25 | Felelős MI és társadalmi hatások | VII. Kitekintés | ★ |

**A sorrend logikája.** A klasszikus gépi tanulás (II.) előzi meg a mélytanulást (III.), mert minden alapfogalom
(veszteség, gradiens módszer, túlillesztés, értékelés) ott a legegyszerűbb, és a neurális háló ezek „nagyobb” változata.
A III. blokk gerince a Transformer (12.); a gráf neurális hálók (13.) ugyanezt a „szomszédoktól tanulás” gondolatot
viszik át tetszőleges gráfokra. A Transformerre épül a IV. blokk (LLM-ek), arra az V. (ágensek). A VI. blokk a mérnöki
oldal: hogyan lesz egy modellből megbízható termék. A 23–24. fejezet kihagyható, a 25. bármikor olvasható.

A források sorrendje eltér: a DLV és az MDL a matematikával kezd, a MLAB és a HAW szinte matek nélkül; mi a 2. fejezetben
csak a **minimumot** adjuk (a részletek a Synopsis matematikai témaköreiben vannak), és a mélyebb matematikát mindig ott
vezetjük be, ahol először kell (pl. láncszabály a 10. fejezetben, entrópia a 5. fejezetben újra).

## Tanulási útvonalak

| Útvonal | Fejezetek | Kinek? |
|---|---|---|
| **Teljes út** | 1 → 25 sorban (a 23–24. opcionális) | aki alaposan meg akarja érteni a területet |
| **Gyors út az LLM-ekhez és ágensekhez** | 1 → 2 (2.1–2.3, 2.7–2.8) → 3 → 9 → 10 → 12 → 16 → 18 → 19 → 20 (+ 17, 21) | aki elsősorban a mai generatív MI-t akarja érteni és használni |
| **Klasszikus adattudós út** | 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 22 (+ 23) | táblázatos adatok, előrejelzés, üzleti elemzés |
| **Alkalmazásfejlesztő út** | 1 → 3 → 16 → 18 → 19 → 21 → 20 → 22 → 25 | aki LLM-alapú terméket épít, kevés matekkal |

---

## 1. fejezet – Mi a mesterséges intelligencia? ★

**Nagy kérdés:** *Egy sakkprogram, egy spamszűrő és a ChatGPT – mindhárom „mesterséges intelligencia”? Mi a közös bennük,
és mi a különbség?*

**Cél:** térkép a teljes témakörhöz; a szabályalapú és a tanuló rendszerek szembeállítása; a tanulás fajtái; történeti keret.

### Felépítés
1. **1.1 Mi az MI?** ★ – definíciók (emberi vs. racionális, gondolkodó vs. cselekvő); szűk vs. általános MI;
   a fogalmak egymásba ágyazása: MI ⊃ gépi tanulás ⊃ mélytanulás ⊃ generatív MI / LLM (HAW 1, MLD 1, DLV 1).
2. **1.2 Szabályok vs. tanulás** ★ – szakértői rendszerek (szimbolikus MI) kontra adatból tanulás: „hagyományos program:
   adat + szabály → válasz; gépi tanulás: adat + válasz → szabály” (MLAB 1, MLSYS 1 *How ML Systems Differ*).
3. **1.3 A tanulás fajtái** ★ – felügyelt (regresszió, osztályozás), felügyelet nélküli (klaszterezés), megerősítéses;
   az önfelügyelt tanulás előzetese (MLAB 2, AAMLP *Supervised vs unsupervised*, MLQ 2).
4. **1.4 Rövid történet** ★ – Turing (1950), Dartmouth (1956), perceptron (1958), MI-telek, szakértői rendszerek,
   visszaterjesztés (1986), Deep Blue (1997), AlexNet (2012), AlphaGo (2016), Transformer (2017), ChatGPT (2022),
   érvelő modellek és ágensek (2024–2026) (HAW 2, MLSYS 1 *Historical Evolution*, MLD 1–3).
5. **1.5 Miért most?** ★ – számítási kapacitás (GPU), algoritmus, adat – a HAW 2 hármasa; Sutton „keserű leckéje”
   (*The Bitter Lesson*): az általános, skálázható módszerek nyernek (MLSYS 1).
6. **1.6 Mire jó és mire nem?** ★ – mikor érdemes gépi tanulást használni (DMLS 1 kritériumai: van tanulható mintázat,
   van adat, ismétlődő feladat, a hibák ára elviselhető); tipikus felhasználások (AIE 1 *Use Cases*); mikor jobb egy
   egyszerű szabály.

### Kidolgozott példák
- Spamszűrő kétféleképpen: kézzel írt szabályok („ha tartalmazza: INGYEN”) vs. tanult súlyok – hol bukik el a szabály?
- Celsius → Fahrenheit: a képlet ismert (hagyományos program) vs. 5 mért párból „megtanult” egyenes (gépi tanulás).
- Besorolás: 8 hétköznapi alkalmazás (filmajánló, arcfelismerés, időjárás-előrejelzés, sakkprogram, vásárlói szegmentálás,
  önvezető autó, ChatGPT, csalásfelderítés) → melyik tanulási fajta?

### Interaktív szemléltetések
- `ai-venn` – kattintható egymásba ágyazott halmazok (MI ⊃ ML ⊃ DL ⊃ GenAI), mindegyikhez példák és a későbbi fejezetek linkjei.
- `rules-vs-learning` – a tanuló szabályokat ír egy mini spamszűrőhöz; ugyanazon 30 levélen egy tanult modell is fut;
  a pontosságok összevetése (és a szabályok „kijátszása” új leveleken).
- `ai-timeline` – interaktív idővonal a telekkel és a „nyarakkal”, paradigmák szerint szűrhető.
- `learning-type-sorter` – húzd a példát a megfelelő tanulási fajtához.

### Kvízek
`ai1-11`, `ai1-12`, `ai1-13`, `ai1-14`, `ai1-15`, `ai1-16`, `ai1-final`.

> ✅ **Elkészült** (`01-mi-a-mesterseges-intelligencia/`). Eltérések a tervtől: önálló 1.7 Alkalmazás rész (sakk–spam–ChatGPT
> összevetés, webáruház-esettanulmány); az 1.3-ba bekerült az önfelügyelt tanulás külön lépésként; két további szemléltetés
> (`cf-learn` – egyenesillesztés gradiens módszerrel, `compute-growth` – évi szorzó és duplázási idő) és egy döntéstámogató
> (`ml-checklist`); kvíz minden szakaszhoz (`ai1-12`, `ai1-15` is).

### Csapdák
„MI = ChatGPT” · a gépi tanulás nem „gondolkodik”, hanem mintázatot illeszt · több adat nem mindig jobb (rossz adat) ·
a hype-ciklusok és az MI-telek ismétlődnek.

### Források
HAW 1–2, 8; MLAB 1–2; MLD 1–3; DLV 1; MLSYS 1; DMLS 1; AIE 1; MV Bevezetés.

---

## 2. fejezet – A gépi tanulás matematikai eszköztára ★★

**Nagy kérdés:** *Egy kép a számítógépnek csak egy nagy számtáblázat. Hogyan lesz belőle „macska”? – Vektorok, mátrixok,
és egy lejtő, amin lefelé gurulunk.*

**Cél:** a későbbi fejezetekhez szükséges matematika **minimuma**, gépi tanulási szemmel. Minden szakasz egy konkrét
MI-felhasználással indul („erre lesz szükség a …-nál”), és a Synopsis matematikai témaköreire hivatkozik a részletekért.

### Felépítés
1. **2.1 Vektorok, mátrixok, tenzorok** ★ – skalár, vektor, mátrix, tenzor; az adat mint mátrix (sor = minta,
   oszlop = jellemző); a kép mint tenzor (magasság × szélesség × csatorna) (MDL 5, PDL 1, 3).
2. **2.2 Műveletek** ★ – összeadás, skalárszoros, **skaláris szorzat** (súlyozott összeg = egy neuron!), mátrix–vektor
   szorzat mint „sok skaláris szorzat egyszerre”, méretegyeztetés, broadcasting (MDL 5, PDL 3).
3. **2.3 Hossz, távolság, hasonlóság** ★★ – L1 és L2 norma, euklideszi távolság, koszinusz-hasonlóság
   (MDL 6, MLD 12) – előkészíti a kNN-t (5.) és a beágyazásokat (12.).
4. **2.4 Sajátvektorok, PCA, SVD – röviden** ★★★ – a 8. fejezethez (MDL 6).
5. **2.5 Valószínűség és Bayes – emlékeztető** ★★ – feltételes valószínűség, Bayes-tétel, Bernoulli-, kategoriális és
   normális eloszlás; a modell kimenete mint eloszlás (MDL 2–3, DLV 4; valószínűségszámítás 1–4. fejezet).
6. **2.6 Információelmélet** ★★ – meglepetés, entrópia, keresztentrópia, KL-divergencia – „hány bit kell?”
   (DLV 6; AIE 3 *Entropy, Cross Entropy* – a perplexitás előzetese).
7. **2.7 Derivált, gradiens, láncszabály** ★★ – meredekség, parciális derivált, a gradiens mint a legmeredekebb emelkedés
   iránya; láncszabály (MDL 7–8; analízis 4. és 9. fejezet).
8. **2.8 A gradiens módszer – előzetes** ★★ – lejtőn lefelé: $w \leftarrow w - \eta\, f'(w)$; tanulási ráta;
   túl kicsi és túl nagy lépés (MDL 11, MLD 8).

### Kidolgozott példák
- Két film 3 jellemzős vektora (akció, romantika, humor) – koszinusz-hasonlóság.
- $2\times3$-as mátrix szorozva 3-elemű vektorral kézzel – egy „neuronréteg” előzetese.
- Érme entrópiája $p = 0{,}5$ és $p = 0{,}9$ esetén; keresztentrópia, ha rossz $p$-t feltételezünk.
- Bayes: 1%-os betegség, 95%-os teszt (visszautalás a valószínűségszámítás 2. fejezetére).
- $f(w) = (w - 3)^2$: három gradienslépés $\eta = 0{,}1$-gyel és $\eta = 1{,}1$-gyel (az utóbbi szétszáll).

### Interaktív szemléltetések
- `vector-playground` – két húzható vektor, kiírva a skaláris szorzat, a szög és a koszinusz-hasonlóság.
- `matrix-transform` – egy $2\times2$-es mátrix hatása a síkra (rácshálóval), a sajátirányok kiemelve.
- `entropy-bars` – eloszlás csúszkákkal → entrópia; egy második eloszlással keresztentrópia és KL-divergencia.
- `gradient-1d` – lejtő és golyó; tanulási ráta csúszka, lépésenkénti futtatás (a `calc.js` rajzolójára épül).
- `gradient-2d` – szintvonalas felület, gradiensnyilak, kattintásra indul a gradiens módszer.

### Kvízek
`ai2-22`, `ai2-23`, `ai2-26`, `ai2-27`, `ai2-28`, `ai2-final`.

> ✅ **Elkészült** (`02-matematikai-eszkoztar/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai2-21`, `ai2-24`, `ai2-25` is);
> a 2.5-be külön lépésként bekerült a softmax (hőmérséklettel), a 2.2-be a mátrix–mátrix szorzás és a broadcasting; önálló
> 2.9 Alkalmazás rész (2×2 képpontos mini képosztályozó kézzel tanítva, szemantikus keresés koszinusszal, „hol találkozol velük?”
> táblázat). Szemléltetések: `pixel-matrix`, `matvec`, `vector-playground`, `matrix-transform`, `softmax-bars`, `entropy-bars`,
> `tangent-slope`, `gradient-1d` (parabola és „két völgy”), `gradient-2d`. A `calc.js` rajzolója `xname`/`yname` opciót kapott.

### Csapdák
A mátrixszorzás nem kommutatív, a méreteknek egyezniük kell · a koszinusz-hasonlóság nem távolság · a gradiens felfelé
mutat, ezért kell a mínusz előjel · túl nagy tanulási ráta → szétszáll · a logaritmus alapja (bit vs. nat).

### Források
MDL 2–8, 11; DLV 2, 4–6; PDL 1, 3; MLD 7–8; AIE 3; Synopsis: valószínűségszámítás 1–4., analízis 4. és 9.

---

## 3. fejezet – A tanulás anatómiája: adat, modell, veszteség, optimalizálás ★

**Nagy kérdés:** *Van öt lakás alapterülete és ára. Mennyit ér egy 70 m²-es? – És hogyan „tanulja meg” ezt a gép, ha
senki nem mondja meg neki a képletet?*

**Cél:** a gépi tanulás négy alkotóelemét (adat, modell, veszteség, optimalizálás) **egyetlen futó példán**, a lineáris
regresszión mutatjuk meg. Minden későbbi modell (a neurális hálótól az LLM-ig) ugyanerre a vázra épül.

### Felépítés
1. **3.1 Adat: minta, jellemző, címke** ★ – jellemzővektor, célváltozó, táblázatos adat (MLAB 3, PDL 4, RWML 1).
2. **3.2 Modell: paraméteres függvény** ★ – $\hat y = wx + b$; a paraméterek „gombok”, a tanulás = a gombok beállítása (MLAB 6).
3. **3.3 Veszteség** ★ – hiba, átlagos négyzetes hiba (MSE), miért négyzet; a veszteség mint a paraméterek függvénye
   (veszteségfelület) (MLAB 6, DLV 5, MLQ 27).
4. **3.4 Optimalizálás** ★★ – zárt képlet (legkisebb négyzetek, visszautalás a statisztikára) vs. gradiens módszer;
   tanulási ráta, iteráció, epoch (MLD 8, MDL 11).
5. **3.5 Általánosítás: tanító és teszt halmaz** ★ – a cél az **új** adat; memorizálás vs. tanulás; polinomillesztés mint
   a túlillesztés előzetese (MLAB 5, PDL 4, DLV 8–9).
6. **3.6 Több jellemző** ★★ – többváltozós lineáris regresszió, vektoros alak $\hat y = \mathbf w^\top\mathbf x + b$;
   polinomiális jellemzők; miért kell skálázni a gradiens módszernél (MLAB 6, ESL 3).
7. **3.7 A gépi tanulási munkafolyamat** ★ – adat → előkészítés → modell → értékelés → telepítés → monitorozás;
   a következő fejezetek térképe (RWML 1, MLSYS *AI Workflow*, AAMLP *Arranging ML projects*).

### Kidolgozott példák
- Öt lakás: egyenes illesztése kézzel (normálegyenletek), becslés a 70 m²-esre.
- Ugyanez gradiens módszerrel: az első 3 iteráció táblázata ($w$, $b$, MSE).
- Két jelölt egyenes MSE-je – melyik jobb, és miért nem elég „ránézni”?
- 10 pontra 1., 3. és 9. fokú polinom: tanítóhiba és teszthiba összevetése.

### Interaktív szemléltetések
- `fit-a-line` – húzható pontok; a tanuló kézzel állítja $w$-t és $b$-t, a hibák négyzetként rajzolódnak, MSE kiírva;
  „Optimális” gomb a zárt képlettel.
- `loss-landscape` – az MSE-felület a $(w, b)$ síkon szintvonalakkal; a gradiens módszer útja lépésenként.
- `learning-rate-lab` – ugyanaz a feladat három tanulási rátával egymás mellett (lassú / jó / szétszálló).
- `polyfit-overfit` – fokszám csúszka, a tanító- és teszthiba görbéje a fokszám függvényében.

### Kvízek
`ai3-32`, `ai3-33`, `ai3-34`, `ai3-35`, `ai3-final`.

> ✅ **Elkészült** (`03-tanulas-anatomiaja/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai3-31` … `ai3-37`, `ai3-final`);
> futó példa: öt lakás (20, 40, 50, 60, 80 m² → 21, 35, 44, 51, 69 M Ft), legjobb egyenes $0{,}8x + 4$, 70 m² → 60 M Ft; a kézi
> gradiens módszerhez a „kis adat” $(1;2), (2;5), (3;5)$. Új lépések: a legjobb konstans (átlag / medián, alapvonal) a 3.4 elején,
> köteg–epoch–SGD külön lépésként, validációs halmaz a 3.5-ben, külön 3.8 Alkalmazás (🐍 Python: zárt képlet, scikit-learn, gradiens
> módszer). Szemléltetések: `fit-a-line`, `loss-landscape` (három adatkészlettel: nyers, kis adat, standardizált – három helyen),
> `best-constant`, `learning-rate-lab`, `polyfit-overfit` (Bishop-féle $\sin(2\pi x)$ + zaj, 10 + 10 pont).

### Csapdák
A tanítóhiba nem a valódi teljesítmény · skálázatlan jellemzőknél a gradiens módszer cikázik · korreláció ≠ ok-okozat ·
extrapoláció a tanítóadat tartományán kívül.

### Források
MLAB 3, 5–6; MLD 8–9, 13; RWML 1, 3; PDL 4; DLV 5, 8; ESL 2–3; MDL 11; MLSYS *AI Workflow*;
Synopsis: matematikai statisztika (regresszió).

---

## 4. fejezet – Adatok és jellemzők ★★

**Nagy kérdés:** *„Szemét be, szemét ki.” Miért tölti egy adattudós az ideje nagy részét adattisztítással – és mit csinál közben?*

### Felépítés
1. **4.1 Az adat típusai és minősége** ★ – numerikus, kategóriás (nominális, ordinális), szöveg, kép, idősor;
   a jó adatkészlet ismérvei (PDL 4, RWML 2, MLSYS *Data Engineering*).
2. **4.2 Adattisztítás** ★ – hiányzó értékek (törlés, imputálás), kiugró értékek, duplikátumok (MLAB 4, MDL 4, MLD 11).
3. **4.3 Kategóriás változók kódolása** ★★ – címkekódolás, one-hot kódolás, ritka kategóriák, célváltozó-alapú kódolás
   (target encoding), a beágyazás előzetese (AAMLP *Approaching categorical variables*, MLAB 4).
4. **4.4 Skálázás és transzformációk** ★★ – min–max skálázás, standardizálás, log-transzformáció, kategorizálás (binning)
   (DMLS 5, MLD 11, DLV 10).
5. **4.5 Jellemzőképzés** ★★ – dátumból a hét napja és az óra, arányok, interakciók; szövegből szózsák (a 12. fejezet
   előzetese) (AAMLP *Feature engineering*, RWML 5, 7).
6. **4.6 Jellemzőkiválasztás és a dimenzió átka** ★★ – szűrő-, burkoló- és beágyazott módszerek (Lasso); miért lesz
   „minden pont távol mindentől” sok dimenzióban (AAMLP *Feature selection*, DLV 10, ESL 2.5).
7. **4.7 Adatszivárgás** ★★ – a legalattomosabb hiba: a jövő információja a tanítóadatban, a skálázás a teljes adaton,
   duplikátumok a tanító és a teszt halmaz között (DMLS 5 *Data Leakage*, MLDI *Primer*).
8. **4.8 Címkék, mintavétel, kiegyensúlyozatlanság** ★★ – a címkézés költsége, gyenge felügyelet; ritka osztály
   (csalás 0,1%), túl- és alulmintavételezés, súlyozás; adatbővítés (DMLS 4, PDL 5, MLQ 5, 30).

### Kidolgozott példák
- Hiányzó életkor pótlása átlaggal vs. mediánnal, egy kiugró érték mellett.
- „Szín” változó one-hot kódolása; miért hibás az 1–2–3 kódolás nominális változónál (szembeállító pár).
- Standardizálás kézzel 4 értékre.
- Szivárgásnyomozás: kórházi adat „kezelés típusa” jellemzővel → gyanúsan jó modell.
- NYC taxi: az időbélyegből óra és hétvége jellemző – mennyit javít? (RWML 6).

### Interaktív szemléltetések
- `scaling-viz` – ugyanaz a pontfelhő eredetiben, min–max skálázva és standardizálva.
- `one-hot-builder` – kategóriás oszlop → one-hot mátrix, a dimenziószám növekedésével.
- `imputation-lab` – hiányzó értékek pótlása különféle módszerekkel, hatás az eloszlásra.
- `leakage-detective` – játék: egy jellemzőlistából válaszd ki a szivárgókat.
- `curse-of-dimensionality` – véletlen pontok legközelebbi/legtávolabbi távolságarányának eloszlása a dimenzió növelésével.

### Kvízek
`ai4-42`, `ai4-43`, `ai4-44`, `ai4-47`, `ai4-48`, `ai4-final`.

> ✅ **Elkészült** (`04-adatok-es-jellemzok/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai4-41` … `ai4-48`, `ai4-final`);
> futó példa: egy 10 soros „piszkos” ingatlantáblázat (duplikátum, „gáz/Gáz/gáz␣”, 650 m²-es elírás, forintban megadott ár, 4 üres cella,
> szivárgó „illeték” = 0,04 · ár), a 4.9 Alkalmazásban sorról sorra rendbe téve, időrendi felosztással (7 tanító, 2 teszt lakás):
> piszkos adaton $\hat y = 0{,}0054\,m^2 + 51{,}2$ (rosszabb az alapvonalnál), tisztán $0{,}791\,m^2 + 3{,}52\cdot\text{állapot} + 1{,}07$; 🐍 pandas + scikit-learn csővezeték.
> Új lépések: strukturálatlan adat és csúszóablak (4.1), robusztus skálázás külön lépésként (4.4), XOR a szűrő módszerek korlátjaként (4.6),
> adatbővítés külön lépésként (4.8). Szemléltetések: `imputation-lab` (MCAR/MNAR), `one-hot-builder`, `scaling-viz` (kNN négy skálán, kastéllyal),
> `transform-hist`, `curse-of-dimensionality`, `leakage-detective` (4 forgatókönyv), `imbalance-lab`. A NYC taxi esettanulmány (RWML 6) két helyen.

### Csapdák
Skálázás a teszt halmazzal együtt · one-hot kódolás nagyon sok kategóriánál · az átlaggal pótlás torzítja a szórást ·
a pontosság félrevezető kiegyensúlyozatlan adaton (előre utalás a 6. fejezetre).

### Források
AAMLP (*Categorical variables, Feature engineering, Feature selection*); DMLS 3–5; RWML 2, 5–7; MLAB 4; MLD 11;
PDL 4–5; DLV 10; MDL 4; MLQ 5, 21, 30; MLSYS *Data Engineering*.

---

## 5. fejezet – Osztályozás: legközelebbi szomszéd, logisztikus regresszió, naiv Bayes ★★

**Nagy kérdés:** *Spam vagy nem spam? Jóindulatú vagy rosszindulatú daganat? – Ha a válasz egy kategória, a regresszió
egyenese már nem elég.*

### Felépítés
1. **5.1 Az osztályozási feladat** ★ – bináris és többosztályos osztályozás; döntési határ (DLV 7).
2. **5.2 Legközelebbi szomszédok (kNN) és legközelebbi centroid** ★ – „mondd meg, kik a szomszédaid”; $k$ választása;
   a távolságmérték és a skálázás szerepe (MLAB 8, PDL 6, MLD 12, ESL 13).
3. **5.3 Logisztikus regresszió** ★★ – szigmoid függvény, a kimenet mint valószínűség, log-esélyhányados (log-odds);
   keresztentrópia-veszteség; döntési küszöb (MLAB 7, MLD 13, ESL 4.4).
4. **5.4 Többosztályos eset: softmax** ★★ – egy-a-többi ellen, softmax és kategoriális keresztentrópia (DLV 7, MLD 13).
5. **5.5 Naiv Bayes** ★★ – Bayes-tétel + feltételes függetlenség; spamszűrő szógyakoriságokkal; Laplace-simítás (PDL 6, DLV 4).
6. **5.6 Lineáris és nemlineáris döntési határ** ★★ – a XOR-probléma; jellemzőtranszformáció; előzetes az SVM-hez (7.)
   és a neurális hálókhoz (9.) (DLV 7, 11).

### Kidolgozott példák
- kNN 8 ponttal: $k = 1$ és $k = 3$ eltérő döntést ad.
- Szigmoid: $z = 2 \Rightarrow \sigma(z) \approx 0{,}88$; küszöb 0,5 és 0,9 mellett.
- Keresztentrópia: magabiztos jó, bizonytalan és magabiztos rossz válasz vesztesége.
- Naiv Bayes spamszűrő 3 szóval, kis gyakorisági táblázattal és Laplace-simítással.
- Softmax három logitra (2; 1; 0,1).

### Interaktív szemléltetések
- `knn-boundary` – két színű pontok elhelyezése kattintással, $k$ csúszka, a döntési térkép élőben.
- `sigmoid-fit` – egydimenziós adat, logisztikus görbe illesztése gradiens módszerrel, állítható küszöb.
- `softmax-lab` – logitok csúszkával → valószínűségek oszlopdiagramon.
- `naive-bayes-spam` – mondatot írsz be → szavankénti hozzájárulás a „spam” és „nem spam” pontszámhoz.
- `xor-problem` – próbálj egyetlen egyenessel elválasztani XOR-pontokat; aztán egy új jellemzővel ($x_1x_2$) sikerül.

### Kvízek
`ai5-52`, `ai5-53`, `ai5-54`, `ai5-55`, `ai5-final`.

> ✅ **Elkészült** (`05-osztalyozas/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai5-51` … `ai5-56`, `ai5-final`); futó példa: egy 10 leveles
> postafiók (4 spam, 6 nem spam; jellemzők: linkek, felkiáltójelek és 4 szó – ingyen, nyertél, kattints, holnap) és egy új levél, ★ = (3; 3), „nyertél, kattints”:
> 1-NN → nem spam (H5), 3-NN → spam (2 : 1), centroidok (4; 4) és (1; 1), határ $x_1 + x_2 = 5$ → spam; logisztikus regresszió a felkiáltójelekre $\sigma(x - 2{,}7)$
> (ML: $w = 0{,}992$, $b = -2{,}736$), két jellemzőre (C = 1) $0{,}99x_1 + 0{,}69x_2 - 4{,}85$ → 0,55; naiv Bayes Laplace-simítással → 0,905. Új lépések: küszöbszabály és
> alapvonal (5.1), döntési határ síkban statikus SVG-vel (5.1), legközelebbi centroid külön lépésként (5.2), „miért nem jó az egyenes” (5.3), esély/log-esély és küszöb külön
> lépés (5.3), a naiv Bayes log-esély alakja és a generatív/diszkriminatív tip (5.5), kitekintés a nemlineáris határ három útjára (5.6), külön 5.7 Alkalmazás 4 tesztlevéllel
> (minden módszer 3/4, de máshol hibázik) és 🐍 scikit-learn kóddal. Szemléltetések: `knn-boundary` (tíz levél + zajos „holdak” tanító/teszt, kNN/centroid),
> `line-vs-sigmoid` (20 felkiáltójeles kiugró spam), `sigmoid-fit` (gradiens módszer, küszöb, veszteséggörbe), `softmax-lab` (OvR-szigmoidokkal összevetve),
> `naive-bayes-spam` (tíz levél / 100 kitalált levél, simítás ki-be), `xor-problem` (XOR, zajos XOR, céltábla; kézi egyenes / LR / + új jellemző).
> A forrásokból jelzett hibák az oldalon: MLAB (kis $k$ ≠ nagy torzítás), MLD (esélyhányados ≠ valószínűség-növekedés, Laplace-nevező), DLV (a „naiv” magyarázata).

### Csapdák
A logisztikus regresszió – a neve ellenére – osztályozó · kNN skálázás nélkül · a kimeneti „valószínűség” nem
feltétlenül kalibrált · a naiv függetlenségi feltevés ritkán igaz, a módszer mégis gyakran működik.

### Források
MLAB 7–8; MLD 10, 12–13; PDL 6–7; DLV 4, 7, 11; ESL 4, 14.

---

## 6. fejezet – Modellértékelés és általánosítás ★★

**Nagy kérdés:** *Egy daganatszűrő modell 99%-ban pontos. Jó modell? – Ha a betegek aránya 1%, akkor egy mindig
„egészséges”-t mondó program is az.*

### Felépítés
1. **6.1 Tanító, validációs és teszt halmaz** ★ – miért három; véletlen és időbeli felosztás; tanító–teszt eltérés
   (PDL 4, DLV 8, MLQ 29).
2. **6.2 Keresztvalidáció** ★★ – $k$-szoros, rétegzett, csoportos, idősoros; $k$ megválasztása (AAMLP *Cross-validation*,
   MLQ 28, ESL 7.10).
3. **6.3 Túl- és alulillesztés, torzítás–variancia** ★★ – tanulási görbék; a torzítás–variancia felbontás (MLAB 11, DLV 9, ESL 7.3).
4. **6.4 Osztályozási metrikák** ★★ – tévesztési mátrix, pontosság (accuracy), precizitás, felidézés (recall), F1,
   specificitás (PDL 11, AAMLP *Evaluation metrics*, DLV 3).
5. **6.5 Küszöb, ROC és AUC** ★★ – a küszöb csúsztatása; ROC-görbe; precizitás–felidézés görbe; többosztályos átlagolás
   (PDL 11, AAMLP, DLV 3).
6. **6.6 Regressziós metrikák** ★ – MAE, MSE, RMSE, $R^2$, MAPE (AAMLP, MLQ 27).
7. **6.7 Regularizáció** ★★ – Ridge (L2), Lasso (L1), elasztikus háló; a büntetőtag mint „egyszerűségi adó” (ESL 3.4, MLD 13, MLQ 6).
8. **6.8 Hiperparaméter-hangolás** ★★ – rácskeresés, véletlen keresés, Bayes-optimalizálás (AAMLP *Hyperparameter
   optimization*, MLAB 17; az evolúciós változat a 24. fejezetben).
9. **6.9 Bizonytalanság** ★★★ – konfidenciaintervallum a pontosságra (bootstrap), konform predikció (MLQ 25–26;
   visszautalás a statisztika becslés-fejezetére).

### Kidolgozott példák
- 1000 szűrés, 10 beteg: tévesztési mátrix; pontosság vs. felidézés.
- Szembeállító pár: daganatszűrés (a felidézés a fontos) vs. spamszűrő (a precizitás a fontos).
- ROC-pontok 6 pontszámra, 3 küszöbbel, kézzel.
- 5-szörös keresztvalidáció: a 5 pontosság átlaga és szórása.
- Ridge: $\lambda$ növelésével az együtthatók zsugorodnak (kis táblázat).

### Interaktív szemléltetések
- `confusion-threshold` – a fejezet fő widgetje: két átfedő pontszám-eloszlás, küszöb csúszka; a tévesztési mátrix,
  a metrikák és a ROC-görbe aktuális pontja élőben.
- `kfold-viz` – az adatsor $k$ részre bontása, a forgó validációs rész animálva.
- `bias-variance` – sok újramintázott adatkészletre illesztett polinomok „legyezője” a fokszám függvényében.
- `learning-curve` – tanító- és validációs hiba a tanítóhalmaz méretének függvényében.
- `regularization-path` – Lasso/Ridge együtthatók útja $\lambda$ függvényében.

### Kvízek
`ai6-62`, `ai6-63`, `ai6-64`, `ai6-65`, `ai6-67`, `ai6-final`.

> ✅ **Elkészült** (`06-modellertekeles/`). Eltérések a tervtől: a sorrend „mit mérünk → hol mérünk → hogyan javítunk → mennyire biztos”: 6.1 osztályozási metrikák, 6.2 küszöb/ROC/AUC,
> 6.3 regressziós metrikák, 6.4 felosztás, 6.5 CV, 6.6 torzítás–variancia, 6.7 regularizáció, 6.8 hangolás, 6.9 bizonytalanság (★★★), 6.10 Alkalmazás; kvíz minden szakaszhoz (`ai6-61` … `ai6-69`, `ai6-final`).
> Futó példák: a fejezet kérdése két ajánlat egy kórháznak (1000 szűrt, 10 beteg; „A” = mindig egészséges, 99%; „B”: TP 8, FN 2, FP 40, TN 950, 95,8%), a kézi számolásokhoz tíz páciens
> pontszámmal (4 beteg; 0,5-ös küszöbnél 3/1/1/5, AUC = 21/24 = 0,875). A 6.10-ben költség ($C_{FN} = 100$) alapján a 0,3-as küszöb nyer (180 vs 240), a felidézés Wilson-intervalluma [0,49; 0,94].
> Új lépések: makró/mikro átlag (6.1), PR-görbe és kalibráció, Brier (6.2), eloszlás-eltolódás és ellenséges validáció (6.4), „minden tanulás a hajtáson belül” ESL 7.10.2-vel (6.5),
> diagnózis az elérhető szinthez mérve (6.6), λ választása LOOCV-vel a 3.5 polinomján (6.7), egy-standard-hiba szabály és beágyazott CV az emlőrák-adatokon (6.8), Wilson, bootstrap, konform predikció (6.9).
> Szemléltetések: `confusion-threshold` (binormális modell, gyakoriság-gombok, ROC/PR), `kfold-viz` (rendezett/időrendi adat, keverés/rétegzés/idősor), `bias-variance`, `learning-curve`,
> `regularization-path` (ridge zárt alakban, lasso koordinátás ereszkedéssel; a számok egyeznek a scikit-learnnel), `tuning-search`, `bootstrap-ci`.
> A forrásokból jelzett hibák az oldalon: PDL 11 (kétféle mátrixállás), DLV 3 (precizitás/felidézés, specificitás/NPV, „szükségszerű” csereviszony), DLV 8–9 (újrahasználható teszt, alulillesztés több adattal),
> MLAB 6/11/18 (CV „egy modellé áll össze”, torzítás = hiba, hangolás tanítóhibával), AAMLP (MAPE ×100, StratifiedGroupKFold, ROC ferde adatra), MLQ 25/26/29 (`zscore`, konform kvantilis n = 15-nél, „teszt jobb → nincs túlillesztés”).

### Csapdák
Pontosság kiegyensúlyozatlan adaton · hangolás a teszt halmazon (a teszt „elhasználása”) · idősor keresztvalidálása
összekeverve · az *accuracy* = pontosság és a *precision* = precizitás összekeverése (tip-doboz) · jó AUC ≠ jó kalibráció.

### Források
PDL 11; AAMLP (*Cross-validation, Evaluation metrics, Hyperparameter optimization*); DLV 3, 8–9; ESL 7; MLAB 11, 17;
MLD 9; MLQ 25–29; DMLS 6.

---

## 7. fejezet – Döntési fák, szupport vektor gépek, együttes módszerek ★★

**Nagy kérdés:** *Hogyan döntöd el, hogy vigyél-e esernyőt? Kérdések sorozatával – pont úgy, mint egy döntési fa.
És ha 500 fa szavaz?*

### Felépítés
1. **7.1 Döntési fák** ★ – kérdések sorozata; szétválasztás Gini-index, illetve entrópia (információnyereség) alapján;
   mélység és túlillesztés; regressziós fa (MLAB 14, PDL 6, ESL 9.2, DLV 11).
2. **7.2 Bagging és véletlen erdő** ★★ – bootstrap-minták, szavazás, véletlen jellemző-részhalmaz; out-of-bag hiba;
   jellemzőfontosság (MLAB 15, ESL 15, MLD 16).
3. **7.3 Boosting** ★★ – AdaBoost (a hibás pontok súlya nő), gradiens boosting (a maradékokra illesztett fák);
   XGBoost és LightGBM – a táblázatos adatok „királyai” (ESL 10, MLD 16, AAMLP).
4. **7.4 Stacking és blending** ★★ (AAMLP *Ensembling and stacking*, DLV 12).
5. **7.5 Szupport vektor gépek** ★★ – maximális margó, szupportvektorok, puha margó ($C$), kernel trükk (MLAB 12, ESL 12, MLD 15, PDL 6).
6. **7.6 Mikor melyik?** ★ – döntési táblázat: táblázatos adat → fák és boosting; kevés adat → egyszerű modell;
   kép, hang, szöveg → mélytanulás; „nincs ingyen ebéd” (PDL 7 *When to Use Classical Models*, MLD 20).

### Kidolgozott példák
- 10 soros „teniszezünk-e?” adat: a gyökér szétválasztása Gini-index és entrópia alapján.
- Bootstrap-minta 6 elemből; mely elemek maradnak ki (out-of-bag)?
- Gradiens boosting két lépése 4 ponton (maradékok kézzel).
- SVM-margó 2D-ben 4 ponttal; a kernel trükk: $x \mapsto (x, x^2)$ egydimenziós adaton.

### Interaktív szemléltetések
- `tree-builder` – a tanuló választja a szétválasztást (Gini kiírva), aztán összeveti az automatikus fával.
- `forest-vote` – sok sekély fa döntési határa egyenként és a szavazás eredménye.
- `boosting-steps` – lépésenként hozzáadott fák, a maradékok és az illesztés javulása.
- `svm-margin` – húzható pontok, $C$ csúszka, lineáris / RBF-kernel kapcsoló.
- `classifier-zoo` – ugyanazon 2D adatkészleten a kNN, logisztikus regresszió, fa, erdő és SVM döntési határa egymás mellett.

### Kvízek
`ai7-71`, `ai7-72`, `ai7-73`, `ai7-75`, `ai7-final`.

> ✅ **Elkészült** (`07-fak-svm-egyuttes/`). Eltérések a tervtől: a fa két szakaszra bomlott – 7.1 döntési fák (olvasás, Gini, entrópia, számjellemző + mohó CART), 7.2 a fa korlátai (mélység és metszés,
> regressziós fa, instabilitás) –, így 7.3 bagging és véletlen erdő (szavazás, bootstrap, $m$, OOB, fontosság), 7.4 boosting (AdaBoost, gradiens boosting, XGBoost/LightGBM/CatBoost), 7.5 szavazás és stacking,
> 7.6 SVM (max. margó, puha margó, kernel, gyakorlat), 7.7 mikor melyik, 7.8 Alkalmazás; kvíz minden szakaszhoz (`ai7-71` … `ai7-77`, `ai7-final`).
> Futó példa a „teniszezünk-e?” helyett: tíz reggel – „vigyél-e esernyőt?” (ég, előrejelzés, szél, páratartalom; 4 esős nap). Gyökér: előrejelzés (G 0,16, IG 0,61), utána „tiszta az ég?” → hibátlan kétkérdéses fa;
> egy 11. reggel (R11) a páratartalmat teszi a gyökérbe (instabilitás); a 7.8-ban 500 fás erdő ugyanerre és az emlőrák-adatokon tíz modell CV-vel (a logisztikus regresszió nyer, 97,9%; SVM nyers 92,1% vs skálázva 97,7%).
> További kézi példák: ESL 400/400 vágás, XOR mint a mohóság csapdája, fagylalt-regressziós fa (nem extrapolál), 3 körös AdaBoost (ESL-szerű 10 pont), gradiens boosting 4 ponton ($\nu = 1$ és $0{,}5$),
> XGBoost-levél $\sum r/(n + \lambda)$, keverési súly validáción, 1D/2D margó, betolakodós puha margó ($C = 1$ vs $10$), polinomiális kernel ellenőrzése.
> Szemléltetések: `split-picker`, `tree-builder` (kézi és automatikus, mélység–pontosság görbe), `forest-vote`, `boosting-steps`, `kernel-lift`, `svm-margin` (saját SMO), `classifier-zoo` (6 modell × 4 adatkészlet).
> A forrásokból jelzett hibák az oldalon: MLAB (levél = „csomópont”, RF „gyengén felügyelt”, gradiens boosting mint átsúlyozás, modellvödör a teszten, C-értelmezés), PDL (fánkénti jellemzősorsolás, sávosítás, $\gamma$-alapérték,
> hangolás a tanító adaton), MLD (C és $\gamma$ iránya fordítva, keverhetetlen AdaBoost-képletek, LightGBM „mélységi”, kernel mint vektor, `ccp_alpha` a teszten), DLV (Gini mint hibaarány, súlyozatlan entrópiaösszeg,
> „mintáról mintára” növő fa, C iránya, bagging csak fákra), AAMLP (`max_voting` hiba, „az átlag jobb” a saját eredményeivel szemben, XGBoost alapmélység).

### Csapdák
Mély fa = túlillesztés · a jellemzőfontosság nem ok-okozat · SVM skálázás nélkül · a boosting érzékeny a zajos címkékre.

### Források
MLAB 12, 14–15; PDL 6–7; MLD 15–16, 20; DLV 11–12; ESL 9–10, 12, 15–16; AAMLP (*Ensembling and stacking*).

---

## 8. fejezet – Felügyelet nélküli tanulás ★★

**Nagy kérdés:** *Tízezer vásárló, címkék nélkül. Vannak-e „típusok” köztük? – Csoportok keresése, amikor senki sem
mondja meg a helyes választ.*

### Felépítés
1. **8.1 Klaszterezés: $k$-közép** ★ – a Lloyd-algoritmus lépésről lépésre; $k$ választása (könyökmódszer, sziluett) (MLAB 9, ESL 14.3).
2. **8.2 Hierarchikus és sűrűségalapú klaszterezés** ★★ – dendrogram; DBSCAN röviden (ESL 14.3, MLD 12).
3. **8.3 Főkomponens-elemzés (PCA)** ★★ – a legnagyobb szórás iránya; sajátvektorok; magyarázott variancia (MDL 6, ESL 14.5, DLV 10).
4. **8.4 Nemlineáris dimenziócsökkentés** ★★★ – t-SNE, UMAP szemléletesen; beágyazások megjelenítése (ESL 14.9, MLQ 1).
5. **8.5 Anomáliadetektálás** ★★ – csalásfelderítés, szenzoradatok (MLSYS gyakorlat: *Motion Classification and Anomaly Detection*).
6. **8.6 Ajánlórendszerek alapjai** ★★ – tartalomalapú és kollaboratív szűrés, mátrixfaktorizáció (MLD 19; a 23. fejezet előzetese).

### Kidolgozott példák
- $k$-közép 6 ponton, $k = 2$, két iteráció kézzel.
- PCA 2D-ben 4 ponttal: kovarianciamátrix, főirány (Python-ellenőrzéssel).
- Film–felhasználó mátrix ($4\times4$): hiányzó értékelés becslése a leghasonlóbb felhasználóból.

### Interaktív szemléltetések
- `kmeans-steps` – pontok kattintással, lépésenkénti futtatás; rossz kezdőpont → rossz lokális optimum.
- `elbow-plot` – a klaszteren belüli szórás $k$ függvényében.
- `pca-projection` – 2D pontfelhő, forgatható vetítési tengely, a vetített variancia kiírva.
- `digit-embedding` – előre kiszámolt 2D PCA- és t-SNE-beágyazás kézzel írt számjegyekről, egérrel bejárható.
- `recommender-toy` – kis értékelési mátrix, hasonlóságok, ajánlások.

### Kvízek
`ai8-81`, `ai8-83`, `ai8-84`, `ai8-86`, `ai8-final`.

> ✅ **Elkészült** (`08-felugyelet-nelkuli-tanulas/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai8-81` … `ai8-86`, `ai8-final`); a 8.1 öt lépés (SSE és a felosztások teljes felsorolása, Lloyd, lokális optimum + k-means++,
> könyök + sziluett, a k-közép korlátai), a 8.2 három (dendrogram, kapcsolási módok, DBSCAN; Gauss-keverék tip-dobozban), a 8.3 a 2.4 receptjére épít (vetített variancia = $\mathbf u^\top C\mathbf u$, rekonstrukció, magyarázott variancia, skálázás, korlátok + SVD),
> a 8.4 két lépés (a t-SNE ötlete, térképolvasás + UMAP), a 8.5 három (távolságalapú + Mahalanobis, izolációs erdő, rekonstrukciós hiba + értékelés), a 8.6 három (tartalomalapú, kollaboratív, mátrixfaktorizáció), 8.7 Alkalmazás.
> Futó példa: a „Lapozó” könyvesbolt 12 vásárlója (az 1. fejezet A–H vásárlóinak bővítése; L az anomália: oszloponként átlagos, együtt furcsa) és egy 4×4-es (a widgetben 5×6-os) könyvértékelési mátrix.
> Nagyban: 178 bor (wine) – nyers PCA 99,8% (prolin), standardizálva 36,2% + 19,2%; k-közép k = 3, ARI 0,90; 800 számjegy t-SNE/UMAP (előre számolt `digits-data.js`).
> Szemléltetések: `kmeans-steps`, `elbow-plot`, `dendrogram`, `dbscan-explorer`, `pca-projection`, `digit-embedding`, `anomaly-explorer` (saját izolációs erdő), `recommender-toy` (CF + SGD-mátrixfaktorizáció).
> A forrásokból jelzett hibák az oldalon: MLAB (kNN mint klaszterezés, „nem talál végső felosztást”, „scree plot” a k-közép görbéjére, kézi kezdőpont), DLV („mértani közép”, „legnagyobb tartomány”, PCA mint az eredményeket kímélő kiválasztás, sajátarcok standardizálása),
> MLD (mini-batch „lassabb”, PCA „javítja” a távolságot, Calinski–Harabasz fordítva, koszinusz „százalék”, hiányzó = 0 az SVD előtt, SVD új termékre, outlier/novelty), ESL (monotonitás a centroid kapcsolásnál), MLSYS (PCA mint kiválasztás),
> PDL (t-SNE-távolságok értelmezése, PCA a teljes adaton), MLDI (kNN-klaszterezés, hibás szorzatmátrix).

### Csapdák
A $k$-közép csak „gömbölyű” klasztereket talál, és skálázásérzékeny · a PCA lineáris · a t-SNE-ábra távolságai
globálisan nem értelmezhetők · a klaszter nem feltétlenül valódi kategória.

### Források
MLAB 9; MLD 12, 19; MDL 6; ESL 14; DLV 10; MLQ 1; MLSYS (gyakorlatok); MLDI (*Recommendation System Components*).

---

## 9. fejezet – Neurális hálózatok ★★

**Nagy kérdés:** *Az agyban egy neuron csak „összead és tüzel”. Hogyan tud egy ilyen egyszerű egységekből álló háló
felismerni egy arcot?*

### Felépítés
1. **9.1 A mesterséges neuron** ★ – súlyozott összeg + torzítás + aktiváció; a biológiai analógia és határai
   (DLV 13, HAW 4, MLSYS *DL Primer – From Biology to Silicon*).
2. **9.2 A perceptron** ★ – Rosenblatt (1958); a perceptron tanulási szabálya; az ÉS és a VAGY megtanulható, a XOR nem
   (Minsky–Papert → az első MI-tél) (HAW 4, DLV 13, ESL 4.5).
3. **9.3 Rétegek: többrétegű perceptron (MLP)** ★★ – rejtett réteg; a XOR két rejtett neuronnal; mátrixos alak
   $\mathbf h = \sigma(W\mathbf x + \mathbf b)$ (MDL 9, PDL 8).
4. **9.4 Aktivációs függvények** ★★ – lépcső, szigmoid, tanh, ReLU (és miért ez lett a nyerő), softmax kimenet (DLV 13, PDL 10).
5. **9.5 Miért működik? Univerzális közelítés** ★★ – sok „ReLU-darab” összege bármilyen folytonos függvényt közelít;
   mélység vs. szélesség (DLV 13, MLSYS *DNN Architectures*).
6. **9.6 Előre irányuló számítás és paraméterszám** ★★ – a forward pass lépései; a paraméterek megszámolása (MDL 9, MLQ 11, PDL 8).

### Kidolgozott példák
- Egy neuron kézzel: $\mathbf x = (1; 2)$, $\mathbf w = (0{,}5; -1)$, $b = 1$ – ReLU- és szigmoid-kimenet.
- A perceptron tanítása az ÉS-függvényre, 4 lépésben.
- XOR kézzel beállított súlyokkal (2 rejtett neuron).
- Egy 784–128–10-es háló paraméterszáma.

### Interaktív szemléltetések
- `neuron-lab` – súly- és torzításcsúszkák, aktivációválasztó; a kimenet 1D-ben és 2D-ben.
- `perceptron-train` – lépésenkénti tanulás, a döntési egyenes mozgása; XOR-on nem konvergál.
- `nn-playground` – **a fejezet fő widgetje** (a TensorFlow Playground mintájára): rétegek és neuronok száma, aktiváció,
  adatkészlet (körök, spirál, XOR, holdak); élő tanítás, a rejtett neuronok „látványa” kis ábrákon. Az `assets/ml.js`-re épül.
- `relu-sum` – ReLU-darabok összege közelít egy görbét; a darabok száma csúszkával.
- `param-counter` – rétegméretek megadása → paraméterszám rétegenként.

### Kvízek
`ai9-91`, `ai9-92`, `ai9-93`, `ai9-94`, `ai9-96`, `ai9-final`.

> ✅ **Elkészült** (`09-neuralis-halozatok/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai9-91` … `ai9-96`, `ai9-final`); minden szakasz három lépés
> (9.1: súlyozott összeg, aktiváció + logikai kapuk, geometria/sablon · 9.2: szabály, konvergenciatétel (Block–Novikoff, kiegészítés), XOR-ciklus + történet · 9.3: XOR 2 rejtett neuronnal, mátrixos alak, összeomlás aktiváció nélkül ·
> 9.4: szigmoid/tanh, ReLU + eltűnő gradiens, kimeneti réteg · 9.5: ReLU-zsanérok, a tétel (Cybenko/Hornik/Leshno), mélység vs. szélesség (Telgarsky-féle hajtogatás) · 9.6: forward pass, paraméterszám), 9.7 Alkalmazás.
> Kidolgozott perceptron-példa a VAGY-ra (4 javítás); az ÉS 6 epoch/10 javítás, fordított sorrendben más egyenes; XOR-on a 2. epochtól ciklus. Futó példa: 8×8-as *digits*, 64–16–10-es háló (1210 paraméter, 97,3%; softmax-regresszió 96,9%).
> Új közös modul: `assets/ml.js` (rng, adatkészletek, aktivációk, MLP + Adam) – a 10. fejezet is erre épülhet. Szemléltetések: `neuron-lab`, `perceptron-train`, `hidden-space`, `activation-gallery`, `relu-sum`, `param-counter`, `nn-playground`, `digit-mlp` (előre tanított súlyok: `digit-net.js`).
> A forrásokból jelzett hibák az oldalon: DLV (összeomlás 78A+86B → 60A+80B, softmax-arány, „összeadás és szorzás lineáris”, tanh „trigonometria”, Mark I évszám, egybefolyó MI-tél), HAW (borháló 2. mintája 0,4883 → 0,5578, Minsky–Papert „két réteg”, szigmoid „alkalmatlan”),
> MLAB (önkényes perceptron-frissítés, „a 0 nem megy tovább”, szigmoid értelmezési tartomány, kétkimenetes bináris kvíz), MLD (lépcső = „lineáris”, „két perceptron” a XOR-hoz, UAT „bármi”, „nulla alatti szorzás”, perceptron „pontosan a határon”),
> PDL (első tél oka „lineáris aktiváció”, transzponálás „kommutativitás”, UAT „megtanul”), MLSYS (4 pixeles számpélda, alak-ellentmondás, torzítás „1–5%”, ReLU „megoldotta”, UAT „learn any function”, torzítás nélkül „nulla kimenet”).

### Csapdák
Aktiváció nélkül a sok réteg is csak egy lineáris függvény · a háló nem „agy” · több réteg nem mindig jobb ·
a torzítás (bias) paramétereit el szokták felejteni a paraméterszámolásnál.

### Források
DLV 13; HAW 4; PDL 8; MDL 9; MLD 14; MLAB 13; ESL 11; MLSYS (*DL Primer, DNN Architectures*); MLQ 11–12.

---

## 10. fejezet – A háló tanítása: visszaterjesztés, optimalizálók, regularizáció ★★–★★★

**Nagy kérdés:** *Egy hálóban több millió súly van. Melyiket merre tekerjük, hogy kisebb legyen a hiba? – A visszaterjesztés
egyetlen visszafelé menetben mindegyikről megmondja.*

### Felépítés
1. **10.1 Veszteségfüggvények** ★★ – MSE és keresztentrópia; miért a log-valószínűség (PDL 9, MLQ 27).
2. **10.2 Gradiens módszer és sztochasztikus változata** ★★ – teljes köteg, mini-köteg (mini-batch), SGD; epoch;
   a kötegméret hatása (MDL 11, PDL 9–10, DLV 15).
3. **10.3 Visszaterjesztés kézzel** ★★ – láncszabály egy 2–2–1-es hálón számszerűen (MDL 10 *Backpropagation by Hand*, DLV 14).
4. **10.4 Számítási gráf és automatikus differenciálás** ★★★ – csúcsok, lokális deriváltak, visszafelé szorzás –
   így működik a PyTorch is (MDL 10, MLSYS *AI Frameworks*).
5. **10.5 Optimalizálók** ★★ – momentum, RMSProp, Adam; tanulási ráta ütemezése (MDL 11, DLV 15).
6. **10.6 Inicializálás, eltűnő és robbanó gradiens** ★★★ – Xavier/He-inicializálás; köteg- és rétegnormalizálás
   (PDL 9, DLV 14–15).
7. **10.7 Regularizáció** ★★ – L2 (súlycsökkentés), dropout, korai leállítás, adatbővítés (MLQ 5–6, PDL 9–10, DLV 9).
8. **10.8 A tanítás gyakorlata** ★★ – hiperparaméter-kísérletek (PDL 10); a véletlenség forrásai és a reprodukálhatóság
   (MLQ 10); GPU és többgépes tanítás röviden (MLQ 7, MLSYS *AI Training*); kitekintés: a lottószelvény-hipotézis (MLQ 4).

### Kidolgozott példák
- Visszaterjesztés kézzel: 2 bemenet, 2 rejtett szigmoid neuron, 1 kimenet, egy teljes tanítási lépés (MDL 10 nyomán,
  Python-ellenőrzéssel).
- Számítási gráf: $f = (x + y)\cdot z$, előre és vissza.
- Sima gradiens módszer vs. momentum egy keskeny völgyben – 3 lépés.
- Dropout hatása a tanító- és validációs görbére (PDL 10 kísérletei alapján).

### Interaktív szemléltetések
- `backprop-stepper` – kis háló lépésenként előre és vissza; minden élen a gradiens értéke, a frissített súlyok.
- `compute-graph` – kifejezésből számítási gráf, a gradiensek visszafelé terjedése.
- `optimizer-race` – SGD, momentum, RMSProp és Adam versenye a Rosenbrock-felületen.
- `batch-size-noise` – a veszteséggörbe zajossága kötegméret szerint.
- `train-monitor` – az `nn-playground` tanító- és validációs veszteséggörbéje: a túlillesztés élőben, dropout/L2 kapcsolóval.

### Kvízek
`ai10-101`, `ai10-102`, `ai10-103`, `ai10-105`, `ai10-107`, `ai10-final`.

> ✅ **Elkészült** (`10-halo-tanitasa/`). Eltérések a tervtől: kvíz minden szakaszhoz (`ai10-101` … `ai10-108`, `ai10-final`); minden szakasz három lépés (10.7 négy), 10.9 Alkalmazás.
> 10.1: −ln p, szigmoid + négyzetes hiba vs. keresztentrópia (z = −4: −0,0173 vs. −0,982), kanonikus párok δ = ŷ − y · 10.2: tanítási ciklus, kötegzaj σ/√B (négy minta összes kötege), lineáris skálázás (digits: B = 128, η = 0,4 = B = 32, η = 0,1), gradiensgyűjtés ·
> 10.3: egy neuron, majd 2–2–1-es ReLU/szigmoid háló minden számmal (x = (1; 2), L 0,6931 → 0,3696), numerikus deriválás, gradiensellenőrzés, történet (Linnainmaa, Werbos, Rumelhart–Hinton–Williams) · 10.4 (★★★): (x + y)·z, kapuszabályok, elágazás, előre/fordított mód, PyTorch-ellenőrzés ·
> 10.5: momentum a 2.8 tálján (3 lépés: 1,061 vs. 0,684), RMSProp/Adam (első lépés = η, korrekció nélkül 3,16η), ütemezés (zajos tál: ugrálás η/(2 − η)), bemelegítés · 10.6 (★★★): szimmetria, nulla kezdés (digits: 2,303), Var(z) = n·Var(w)·E(x²), Xavier/He, vágás, köteg-/rétegnormalizálás, maradékkapcsolat ·
> 10.7: korai leállítás valódi görbével (100 kép, 64 rejtett: legjobb a 19. epoch, 0,462 → 0,611), L2 és AdamW (Kiegészítés), fordított dropout, adatbővítés (eltolás: 0,462 → 0,396) · 10.8: első ellenőrzések (ln K), η keresése, 10 mag (95,8–98,0%), 16 bájt/paraméter, párhuzamosítás, lottószelvény (kitekintés).
> Futó példa: a 9.7 64–16–10-es számjegyhálója, 1047/300/450-es felosztás (`digits-data.js`), a böngészőben tanítva (Adam 0,01: teszt 98,0%). `assets/ml.js` bővült: momentum, RMSProp, fordított dropout, választható kezdés.
> Szemléltetések: `loss-compare`, `batch-size-noise`, `backprop-stepper`, `compute-graph`, `optimizer-race`, `deep-signal`, `train-monitor`, `digit-trainer`.
> A forrásokból jelzett hibák az oldalon: DLV (kimeneti δ előjele, rejtett δ φ′ nélkül, AdaGrad gyök nélkül, dropout felszorzás nélkül, kötegnormalizálás csak regularizálóként, η „0 és 1 között”, „a kötegméret mindegy”, több adat az alulillesztésre, LSTM „elkerüli” a gradiensproblémát),
> MDL (Adam t = 0-tól és v̂ elírás, momentum mellett csökkentett η valójában nagyobb lépés, „Rumelhart vezette be”), PDL (momentum előjele, dropout AlexNetnek tulajdonítva, L2 = súlycsökkentés Adamnál is, sklearn alpha, a szigmoidos hálók kudarcának oka),
> MLQ (korai leállítás „ahol a görbék a legközelebb”, lottószelvény „desztilláció”, FFT/Winograd „közelítés”, több adat az alulillesztésre), MLSYS (f′(2) = 2,805 → 1,973, előre/fordított mód magyarázata, optimalizálók memóriája gradiens nélkül, vegyes pontosság „felezi”, gradiensgyűjtésnél η szorzása, „10–20 mrd paraméter egy GPU-n”), ESL („a visszaterjesztés lassú”).

### Csapdák
Túl nagy tanulási ráta · a gradiens előjele · a dropout kiértékeléskor ki van kapcsolva · ha a validációs veszteség nő,
miközben a tanító csökken: túlillesztés · nullára inicializált súlyok szimmetriája (minden neuron ugyanazt tanulja).

### Források
MDL 7–8, 10–11; DLV 9, 14–15; PDL 9–10; MLQ 4–7, 10, 27; MLD 8, 14; MLSYS (*AI Frameworks, AI Training*); ESL 11.4–11.5.

---

## 11. fejezet – Konvolúciós hálók és gépi látás ★★

**Nagy kérdés:** *Hogyan ismer fel egy háló egy macskát, akárhol is van a képen? – Kis „nagyítók” csúsznak végig a képen,
és mintákat keresnek.*

### Felépítés
1. **11.1 A kép mint tenzor; miért nem elég az MLP?** ★ – paraméterrobbanás, a térbeli szerkezet elvesztése (PDL 12, MDL 9).
2. **11.2 A konvolúció** ★ – szűrő (kernel); élkeresés kézzel; lépésköz (stride), kitöltés (padding) (PDL 12, DLV 16).
3. **11.3 A CNN felépítése** ★★ – konvolúciós réteg, csatornák, pooling, teljesen összekötött réteg; recepciós mező;
   jellemzőhierarchia (élek → formák → tárgyak) (DLV 16, PDL 12, HAW 5).
4. **11.4 Híres architektúrák** ★★ – LeNet, AlexNet, VGG, ResNet (reziduális kapcsolat) (DLV 17, MLSYS *DNN Architectures*;
   történeti doboz: USPS-számjegyek, MLSYS *DL Primer*).
5. **11.5 Transzfer tanulás és finomhangolás** ★★ – előtanított háló újrahasznosítása kevés adattal (PDL 14, AAMLP, MLQ 2).
6. **11.6 Feladattípusok** ★★ – osztályozás, objektumdetekció, szegmentálás; adatbővítés (AAMLP *Image classification &
   segmentation*, MLSYS gyakorlatok).
7. **11.7 Vision Transformer** ★★★ – a kép mint foltok sorozata; induktív torzítás; miért kell sok adat (MLQ 13 –
   a 12. fejezet után olvasandó).
8. **11.8 A gépi látás társadalmi oldala** ★ – megfigyelés, arcfelismerés, „algoritmikus tekintet”, vakfoltok (MV 3–5;
   kapcsolat a 25. fejezettel).

### Kidolgozott példák
- $5\times5$-ös kép és $3\times3$-as függőleges élszűrő → $3\times3$-as kimenet kézzel.
- A kimeneti méret képlete: $\lfloor (n + 2p - k)/s \rfloor + 1$, három beállítással.
- Paraméterszám: konvolúciós réteg vs. teljesen összekötött réteg ugyanarra a bemenetre (MLQ 11–12).
- Max-pooling: $4\times4$ → $2\times2$.

### Interaktív szemléltetések
- `convolution-lab` – pixelrajzoló + választható / szerkeszthető kernel (él, elmosás, élesítés); a kimenet élőben.
- `pooling-viz` – max- és átlag-pooling animálva.
- `receptive-field` – rétegenként növekvő recepciós mező kiemelve.
- `digit-recognizer` – rajzolj számjegyet → egy előre tanított kis CNN jósol, és megmutatja a jellemzőtérképeket
  (súlyok JSON-ben).

### Kvízek
`ai11-112`, `ai11-113`, `ai11-115`, `ai11-116`, `ai11-final`.

### Csapdák
A mélytanulás „konvolúciója” valójában keresztkorreláció (nem tükrözi a kernelt) · a kimeneti méret elszámolása ·
a háló „rövidítéseket” tanulhat (háttér, vízjel a képen) · az arcfelismerés pontossága csoportonként eltérhet.

### Források
PDL 12–14; DLV 16–17; HAW 5; MDL 9; AAMLP (*Image classification & segmentation*); MLQ 2, 11–13; MLD 17;
MLSYS (*DNN Architectures*, gyakorlatok); MV 1–5.

---

## 12. fejezet – Beágyazások, szekvenciák és a figyelemmechanizmus ★★–★★★

**Nagy kérdés:** *„A folyó partján ültem a padon” – „A bankban ültem a pult előtt.” Honnan tudja egy gép, mit jelent egy
szó? – A szavak jelentését a szomszédaik adják.*

### Felépítés
1. **12.1 Szövegből számok** ★ – tokenek, szózsák (bag of words), TF-IDF (AAMLP *Text classification*, MLD 18).
2. **12.2 Beágyazások** ★★ – sűrű vektorok; word2vec; „király − férfi + nő ≈ királynő”; disztribúciós hipotézis;
   látens tér (MLQ 1, 14; DLV 20).
3. **12.3 Szekvenciák: rekurrens hálók** ★★ – rejtett állapot, RNN, LSTM röviden; a hosszú távú függőség problémája
   (DLV 19, MLSYS *DNN Architectures*).
4. **12.4 A figyelemmechanizmus** ★★ – „melyik szóra figyeljek?”; RNN + figyelem gépi fordításban (MLQ 16, DLV 20).
5. **12.5 Önfigyelem** ★★★ – lekérdezés, kulcs, érték ($Q$, $K$, $V$); $\mathrm{softmax}(QK^\top/\sqrt{d})\,V$ kézzel
   3 tokenre; több figyelmi fej; pozíciókódolás (MLQ 16; HGA I *The Transformer Architecture*; FLLM 2).
6. **12.6 A Transformer** ★★★ – enkóder, dekóder, enkóder–dekóder; reziduális kapcsolat + rétegnormalizálás + előrecsatolt
   réteg; maszkolt figyelem; BERT vs. GPT (MLQ 8, 17; FLLM 1; DLV 20).
7. **12.7 Miért nyert a Transformer?** ★★ – párhuzamosíthatóság, önfelügyelt előtanítás, skálázhatóság (MLQ 8).
   Kitekintés: az önfigyelem üzenetküldés egy teljes gráfon → 13. fejezet (gráf neurális hálók).

### Kidolgozott példák
- TF-IDF három rövid mondatra.
- Koszinusz-hasonlóság három (játék-) szóvektor között; vektoraritmetika.
- Önfigyelem 3 tokennel, $d = 2$: pontszámok → softmax → súlyozott összeg (Python-ellenőrzéssel).
- Szentiment-osztályozás szózsákkal vs. beágyazással (AAMLP; RWML 8 – filmkritikák).

### Interaktív szemléltetések
- `tfidf-table` – saját mondatok → TF-IDF-mátrix.
- `embedding-arithmetic` – előre kiszámolt kis beágyazáskészlet 2D-s vetületben; vektoraritmetika és legközelebbi szavak.
- `rnn-unroll` – az RNN időben „kigöngyölítve”, a rejtett állapot lépésenként.
- `attention-heatmap` – mondat → figyelmi súlyok mátrixa (előre kiszámolt kis modellből), fejek közötti váltással.
- `qkv-calculator` – a 12.5 számpéldája lépésenként, módosítható vektorokkal.
- `transformer-block` – kattintható blokkdiagram, minden elemhez magyarázat és a megfelelő szakasz linkje.

### Kvízek
`ai12-121`, `ai12-122`, `ai12-124`, `ai12-125`, `ai12-126`, `ai12-final`.

### Csapdák
A beágyazás tükrözi az adat torzításait · a figyelmi súly nem „magyarázat” · RNN és Transformer összekeverése ·
a $\sqrt d$-vel való skálázás elfelejtése · az enkóder-modell (BERT) nem generál szöveget.

### Források
MLQ 1, 8, 14–17; DLV 19–20; FLLM 1–2; HGA I (*LLM Architecture*); AAMLP (*Text classification/regression*); RWML 8;
MLD 18; MLSYS (*DNN Architectures*).

---

## 13. fejezet – Gráf neurális hálók ★★–★★★

**Nagy kérdés:** *Hogyan mondja meg egy gép egy sosem látott molekuláról, hogy hat-e a baktériumokra, vagy egy közösségi
hálóról, hogy ki kit ismerhet? – Az adat itt se nem sor, se nem rács, hanem **gráf**: minden csúcs a szomszédaitól tanul.*

**Cél:** a gráf mint adattípus; miért kell új architektúra; az üzenetküldés (message passing) mint a GNN-ek közös váza;
a fő modellcsaládok (GCN, GraphSAGE, GAT, GIN); csúcs-, él- és gráfszintű feladatok; a korlátok (kifejezőerő, túlsimítás,
túlnyomás); a Transformer és a GNN kapcsolata; a mai nagy alkalmazások (molekulák, anyagok, időjárás, ajánlók) és a
gráfok + LLM-ek friss iránya.

**Kapcsolódás:** a 11. fejezet konvolúciója (rács = speciális gráf), a 12. fejezet beágyazásai és önfigyelme (teljes gráf);
a 2. fejezet mátrixszorzása és sajátvektorai; előre: ajánlórendszerek (23.), GraphRAG és tudásgráfok (18.), többágenses
rendszerek kommunikációs gráfja (20.).

> 🔬 **Kidolgozáskor kötelező:** a fejezet megírása előtt **Consensus-kutatás** (`mcp__plugin_consensus_Consensus__search`)
> a legfrissebb (2024–2026-os) eredményekről, legalább ezekben a kérdésekben: gráf-alapmodellek (graph foundation models);
> GNN + LLM (gráf mint prompt, GraphRAG, LLM mint csúcsjellemző-kódoló); gráf-Transformerek vs. üzenetküldő hálók (mikor
> melyik jobb – pl. a „klasszikus GNN-ek erős alapvonalak” típusú újraértékelések); túlsimítás és túlnyomás elmélete és
> ellenszerei (újrahuzalozás, virtuális csúcs); kifejezőerő a WL-hierarchián túl; ekvivariáns és geometriai GNN-ek
> (molekulák, anyagtudomány, fehérjék); időjárás-előrejelzés (GraphCast és utódai); skálázás nagy gráfokra; a benchmarkok
> megbízhatósága. Az eredmények `📅 Állapot: 2026` jelöléssel, hivatkozással és dátummal kerülnek be; ahol a szakirodalom
> megosztott, az oldal ezt jelzi. A végleges felépítést a kutatás alapján finomítjuk.

### Felépítés
1. **13.1 Gráfok mint adat** ★ – csúcs, él; irányított, súlyozott, heterogén (több csúcs- és éltípus) gráf; csúcs-, él- és
   gráfjellemzők; példák: molekula (atom = csúcs, kötés = él), közösségi háló, úthálózat, hivatkozási háló, tudásgráf,
   fehérje-kölcsönhatás. Ábrázolás: szomszédsági mátrix, szomszédsági lista, éllista; fokszám; $A^2$ elemei = kétlépéses
   séták száma. Feladattípusok: **csúcsszintű** (szerep, csalás), **élszintű** (kapcsolat-előrejelzés, ajánlás),
   **gráfszintű** (molekula-tulajdonság); transzduktív vs. induktív beállítás (Kiegészítés: gráfelméleti alapok röviden,
   mert a Synopsisban nincs külön gráfelmélet-témakör).
2. **13.2 Miért nem elég az MLP, a CNN vagy az RNN?** ★★ – változó méret, nincs természetes sorrend és nincs „bal felső
   sarok”; ugyanaz a gráf $n!$-féleképpen számozható → **permutációinvariancia** (gráfszintű kimenet) és **-ekvivariancia**
   (csúcsszintű kimenet). Régi megoldások alapvonalként: kézi gráfjellemzők (fokszám, klaszterezettség, PageRank) + klasszikus
   modell; véletlen sétákból tanult csúcsbeágyazások (DeepWalk, node2vec – a word2vec ötlete a 12.2-ből).
3. **13.3 Üzenetküldés** ★★ – a GNN-ek közös váza: minden csúcs **összegyűjti** a szomszédai vektorát (összeg / átlag /
   maximum – mind sorrendfüggetlen), majd **frissíti** a sajátját: $\mathbf h_v' = \phi\big(\mathbf h_v,\ \bigoplus_{u \in N(v)}
   \psi(\mathbf h_u)\big)$. Egy lépés kézzel egy 5 csúcsos gráfon; $k$ réteg = $k$ ugrásnyi szomszédság (recepciós mező,
   vö. 11.3); súlymegosztás minden csúcs között (vö. a konvolúció súlymegosztásával). Mátrixalakban: $H' = \sigma(AHW)$.
4. **13.4 Gráfkonvolúciós háló (GCN)** ★★ – önhurok ($\hat A = A + I$) és szimmetrikus normalizálás:
   $H' = \sigma\big(\hat D^{-1/2}\hat A\hat D^{-1/2} H W\big)$; miért kell a normalizálás (a nagy fokszámú csúcsok
   „elszállnak”); a rácsos kép mint gráf → a CNN speciális eset. Félig felügyelt csúcsosztályozás kevés címkével (Zachary
   karateklubja, Cora-hivatkozási háló). 📐 Lenyílóban ★★★: gráf-Laplace-mátrix, sajátvektorai mint „gráf-Fourier-bázis”,
   a spektrális GCN mint simító szűrő.
5. **13.5 GraphSAGE, GAT, GIN** ★★ – **GraphSAGE:** mintavételezett szomszédság, induktív tanulás, milliárd élű gráfok
   (Pinterest – PinSage); **GAT:** a szomszédok súlya nem a fokszámból, hanem **figyelemből** jön (vö. 12.4–12.5),
   több fejjel; **GIN:** összeg-aggregálás + MLP – a legerősebb az üzenetküldők között (13.7). Döntési táblázat: mikor melyik.
6. **13.6 Csúcs-, él- és gráfszintű kimenet** ★★ – **kiolvasás** (readout / pooling): a csúcsvektorok összege / átlaga →
   gráfvektor → osztályozó (molekula mérgező-e); **kapcsolat-előrejelzés:** két csúcsbeágyazás skaláris szorzata +
   szigmoid, negatív mintavétel; ajánlás kétrészes (felhasználó–termék) gráfon. Tanítás és kiértékelés: csúcs- és élfelosztás,
   **adatszivárgás** gráfokon (a tesztélek nem maradhatnak bent az üzenetküldésben).
7. **13.7 Mennyit tud egy GNN? Kifejezőerő és korlátok** ★★★ – a **Weisfeiler–Lehman-teszt** (színfinomítás) és a
   tétel, hogy az üzenetküldő GNN legfeljebb ennyire erős; a klasszikus ellenpélda: hatszög vs. két háromszög; erősebb
   változatok (magasabb rendű WL, részgráf-számlálás, pozíciókódolás). **Túlsimítás** (oversmoothing): sok réteg után
   minden csúcs vektora ugyanaz lesz; **túlnyomás** (oversquashing): a távoli információ szűk keresztmetszeten fér át;
   homofil vs. heterofil gráfok. Ellenszerek: reziduális kapcsolat, normalizálás, újrahuzalozás (rewiring), virtuális csúcs.
8. **13.8 Gráf-Transformerek: a Transformer mint GNN** ★★★ – az önfigyelem üzenetküldés a **teljes gráfon**, a pozíció-
   kódolás pedig a „gráfszerkezet”; gráf-Transformerek: szerkezeti és pozíciókódolások (Laplace-sajátvektorok, véletlen
   séta), helyi üzenetküldés + globális figyelem kombinációja (GPS-recept); költség ($n^2$) és mikor éri meg.
   📅 Friss vita a Consensus-kutatás alapján: gráf-Transformer vs. jól hangolt klasszikus GNN.
9. **13.9 Geometriai és ekvivariáns GNN-ek** ★★★ – 3D molekulák és anyagok: a jóslat nem függhet a forgatástól és
   eltolástól (invariancia) – vagy együtt kell forognia vele (ekvivariancia); E(n)-ekvivariáns GNN szemléletesen; a
   „geometriai mélytanulás” nézőpontja (rács, gráf, csoport, sokaság – a CNN, a GNN és a Transformer egy családban).
   Alkalmazások 📅: AlphaFold (fehérjeszerkezet), GNoME (új kristályok), gépi tanult atomközi potenciálok.
10. **13.10 Alkalmazások; gráfok és nagy nyelvi modellek** ★★ – gyógyszerkutatás (a halicin antibiotikum felfedezése,
    2020); forgalom és érkezési idő (Google Maps); időjárás-előrejelzés (GraphCast, 2023 – és utódai 📅); ajánlórendszerek
    (PinSage; → 23. fejezet); csalásfelderítés tranzakciós gráfon; chiptervezés. **Gráfok + LLM 📅:** tudásgráf mint
    visszakeresési forrás (GraphRAG, → 18. fejezet), gráf szövegként a promptban, LLM-mel kódolt csúcsjellemzők,
    gráf-alapmodellek. Mérnöki oldal: ritka, szabálytalan számítás – miért nehezebb GPU-n, mint a CNN (MLSYS).

### Kidolgozott példák
- Egy 5 csúcsos gráf (élek: 1–2, 1–3, 2–3, 2–4, 4–5) szomszédsági mátrixa, fokszámai (2, 3, 2, 2, 1); $A^2$ első sora
  $(2, 1, 1, 1, 0)$ – kétlépéses séták.
- Permutáció: a csúcsok átszámozása után a mátrix más, az összeg-kiolvasás és a fokszám-hisztogram ugyanaz.
- Egy üzenetküldési lépés skalár jellemzőkkel: átlag-aggregálás + $h' = \mathrm{ReLU}(w_1 h_v + w_2 \cdot \bar h_{N(v)} + b)$.
- GCN-normalizálás a 3 csúcsos úton (1–2–3): $\hat D^{-1/2}\hat A\hat D^{-1/2}$ elemei $\tfrac12$, $\tfrac1{\sqrt6} \approx 0{,}408$,
  $\tfrac13$.
- Kétrétegű GCN recepciós mezője az 5 csúcsos gráfon: melyik csúcs „lát” melyiket.
- GAT: egy csúcs három szomszédjának figyelmi pontszáma → softmax → súlyozott átlag (vö. 12.5).
- Gráfszintű kiolvasás: két kis „molekula” összeg- és átlag-poolinggal – mikor nem különbözteti meg őket az átlag?
- Kapcsolat-előrejelzés: három felhasználó és két termék beágyazásának skaláris szorzata → szigmoid → ajánlási sorrend.
- WL-színfinomítás: hatszög vs. két háromszög – minden csúcs foka 2, a színek sosem válnak szét (az 1-WL és így minden
  üzenetküldő GNN „vak” rájuk).
- Túlsimítás számokkal: az 5 csúcsos gráfon önhurkos átlagolás az $(1, 0, 0, 0, 5)$ kezdőértékekről: a szórás 1,94 → 0,91
  (1 lépés) → 0,35 (5) → 0,11 (10) → 0,001 (30); végül minden csúcs ≈ 0,87.
- (Mindegyik Python-ellenőrzéssel; a 🐍 Python-lenyílóban PyTorch Geometric-kód egy GCN-réteghez, 5–15 sor.)

### Interaktív szemléltetések
- `graph-builder` – kattintással csúcsot és élt adsz hozzá; a szomszédsági mátrix, a szomszédsági lista és a fokszámok
  élőben; csúcsátszámozás gombbal (a mátrix változik, a gráf nem).
- `message-passing` – **a fejezet fő widgetje:** kis gráf színnel kódolt csúcsjellemzőkkel, lépésenkénti üzenetküldés,
  aggregátorválasztó (összeg / átlag / max), egy kijelölt csúcs recepciós mezőjének kiemelése rétegenként.
- `gcn-karate` – Zachary karateklubja (34 csúcs, 78 él): kétrétegű GCN élő tanítása csúcsonként 1–1 címkével (félig
  felügyelt); a csúcsok 2D-s beágyazása animálva szétválik a két csoportra. Saját kis JS-tanítóval (`assets/ml.js`).
- `wl-test` – Weisfeiler–Lehman-színfinomítás két gráfon lépésenként; jelzi, ha a színhisztogramok megegyeznek.
- `oversmoothing` – rétegszám-csúszka; a csúcsvektorok szóródása és egy 2D-s vetület; kapcsoló: reziduális kapcsolat be/ki.
- `gat-attention` – egy csúcs szomszédainak figyelmi súlyai élvastagsággal, a pontszámok szerkeszthetők.
- `molecule-readout` – kis molekulagráfok (atomtípus = szín) → kiolvasás → „tulajdonság” jóslása; összeg vs. átlag.

### Kvízek
`ai13-131`, `ai13-132`, `ai13-133`, `ai13-134`, `ai13-135`, `ai13-136`, `ai13-137`, `ai13-final`
(a 13.8–13.10 kérdései a fejezetzáróba kerülnek).

### Csapdák
A GNN gráfja ≠ a 10.4 számítási gráfja · a csúcsok sorrendje nem számíthat (aki sorrendfüggő aggregálást ír, hibázik) ·
több réteg nem jobb (túlsimítás) · átlag-aggregálás nem látja a szomszédok számát · adatszivárgás a kapcsolat-előrejelzésnél ·
a homofília feltételezése (heterofil gráfon a szomszédok átlaga félrevezet) · a figyelmi súly nem magyarázat ·
a benchmark-eredmények érzékenyek a hangolásra és a felosztásra (📅 Consensus) · az LLM nem „érti” jól a szövegesen
leírt gráfot.

### Források
A `Topics/AI/resources` könyvei közül csak az MLSYS érinti (hardveres és rendszerszintű kihívások); a fejezet ezért
**külső forrásokra** épül:
- **GRL** – W. L. Hamilton: *Graph Representation Learning* (Morgan & Claypool, 2020; szabadon elérhető) – a fő tankönyv.
- **GDL** – M. Bronstein, J. Bruna, T. Cohen, P. Veličković: *Geometric Deep Learning: Grids, Groups, Graphs, Geodesics,
  and Gauges* (arXiv 2104.13478, 2021) – az egységes nézőpont (13.9).
- **GIG** – B. Sanchez-Lengeling et al.: *A Gentle Introduction to Graph Neural Networks* (Distill, 2021) – vizuális intuíció.
- Alapcikkek: Gilmer et al. 2017 (MPNN); Kipf–Welling 2017 (GCN); Hamilton–Ying–Leskovec 2017 (GraphSAGE);
  Veličković et al. 2018 (GAT); Xu et al. 2019 (GIN, WL-kapcsolat); Ying et al. 2018 (PinSage); Satorras et al. 2021
  (E(n)-GNN); Rampášek et al. 2022 (GPS gráf-Transformer); Stokes et al. 2020 (halicin); Derrow-Pinion et al. 2021
  (Google Maps ETA); Lam et al. 2023 (GraphCast); Zachary 1977 (karateklub); Weisfeiler–Lehman 1968.
- 📅 2024–2026-os cikkek: a kidolgozáskor Consensus-kereséssel (lásd fent), hivatkozással és dátummal.
- MLSYS (*AI Acceleration*, *AI Training* – GNN-ek ritka számítása).

---

## 14. fejezet – Generatív modellek ★★★

**Nagy kérdés:** *Hogyan rajzol egy gép olyan arcot, amely sosem létezett? – Megtanulja az adatok eloszlását, aztán mintát vesz belőle.*

### Felépítés
1. **14.1 Generatív vs. diszkriminatív** ★★ – $p(y \mid x)$ vs. $p(x)$; mintavétel egy eloszlásból (MLQ 9, HAW 6).
2. **14.2 Autoenkóderek** ★★ – szűk keresztmetszet, tömörítés, zajszűrés; látens tér (DLV 18, EDL 8).
3. **14.3 Variációs autoenkóder (VAE)** ★★★ – a látens tér mint eloszlás; interpoláció két kép között (DLV 18, MLQ 9).
4. **14.4 Generatív versengő hálók (GAN)** ★★ – hamisító és detektív; módusösszeomlás (DLV 22, HAW 6, EDL 9).
5. **14.5 Diffúziós modellek** ★★★ – zaj hozzáadása és lépésenkénti eltávolítása; szövegből kép (HAW 6, MLQ 9).
6. **14.6 Autoregresszív modellek** ★★ – a következő elem jóslása → átvezetés az LLM-ekhez (MLQ 9, FLLM 2).
7. **14.7 Kreatív alkalmazások és kérdések** ★ – stílusátvitel, deepfake, szerzői jog (DLV 23, HAW 6, 8).

### Kidolgozott példák
- Autoenkóder $4 \to 2 \to 4$ egyszerű adaton: mit „tömörít”?
- GAN egy dimenzióban: a generátor eloszlása lépésenként közelít a valódihoz (szimulációs táblázat).
- Diffúzió előre irányban: egy pont zajosítása 5 lépésben (zajütemezéssel).

### Interaktív szemléltetések
- `latent-space-walk` – előre tanított kis VAE számjegyekre; 2D látens tér, húzd a pontot → generált kép.
- `gan-1d` – két hisztogram (valódi és generált), a generátor és a diszkriminátor tanulása élőben.
- `diffusion-steps` – 2D pontfelhő (pl. spirál) zajosítása és „visszafelé” zajtalanítása animálva.
- `autoencoder-compress` – a szűk keresztmetszet méretének hatása a rekonstrukcióra.

### Kvízek
`ai14-141`, `ai14-142`, `ai14-144`, `ai14-145`, `ai14-final`.

### Csapdák
A generált kép nem másolat, de a modell memorizálhat · a GAN-tanítás instabil · a VAE képei homályosak ·
generatív modell ≠ LLM (az LLM csak egy fajtája).

### Források
DLV 18, 22–23; HAW 6; MLQ 9–10; EDL 8–9; FLLM 2.

---

## 15. fejezet – Megerősítéses tanulás ★★–★★★

**Nagy kérdés:** *Hogyan tanul meg egy program úgy Go-t játszani, hogy senki nem mutatja meg neki a jó lépéseket? –
Próbálkozik, és a végén megtudja, nyert-e.*

**Cél:** az RL alapfogalmai; előkészíti az LLM-ek igazítását (17.) és az ágenseket (19–20.). Kapcsolat a játékelmélettel.

### Felépítés
1. **15.1 Ágens, környezet, jutalom** ★ – állapot, akció, jutalom, epizód, stratégia (policy); Markov-döntési folyamat
   (HGA I *Introduction to RL*, DLV 21).
2. **15.2 Felfedezés vs. kiaknázás: a többkarú bandita** ★★ – ε-mohó stratégia (DLV 21; MLDI *Exploration vs. Exploitation*).
3. **15.3 Érték és Bellman-egyenlet** ★★ – diszkontált hozam, értékfüggvény, Q-függvény (HGA I, DLV 21).
4. **15.4 Q-tanulás** ★★ – időbeli különbség (TD) frissítés; táblázatos Q-tanulás egy rácsvilágon (HGA I *Q-Learning*, DLV 21).
5. **15.5 Mély RL és stratégia-gradiens** ★★★ – DQN röviden; REINFORCE, aktor–kritikus; AlphaGo (HGA I, HAW 2).
6. **15.6 Az RL szerepe az LLM-ekben – előzetes** ★★ – jutalommodell, RLHF (→ 17. fejezet) (HGA II *RL Foundations for
   Language Models*).

### Kidolgozott példák
- Diszkontált hozam: jutalmak $0, 0, 1$, $\gamma = 0{,}9$.
- Egy Q-frissítés kézzel: $Q \leftarrow Q + \alpha\,(r + \gamma \max Q' - Q)$.
- Háromkarú bandita ε = 0,1-gyel, 10 lépés táblázata.

### Interaktív szemléltetések
- `bandit-lab` – 3–5 „félkarú rabló”, ε csúszka, kumulált jutalom és megbánás (regret).
- `gridworld-q` – **a fejezet fő widgetje:** rácsvilág falakkal, csapdával, céllal; a Q-értékek és a stratégia nyilai
  tanulás közben; α, γ, ε csúszkák.
- `bellman-backup` – egy állapot értékének frissítése a szomszédokból, lépésenként.
- `reward-hacking` – rosszul megadott jutalom → az ágens „kiskaput” talál (a hajós játék körbeforgása mintájára).

### Kvízek
`ai15-151`, `ai15-152`, `ai15-153`, `ai15-154`, `ai15-final`.

### Csapdák
A jutalom nem azonos a céllal (jutalom-kijátszás) · a $\gamma$ szerepe (rövid- vs. hosszútávú) · túl kevés felfedezés ·
on-policy vs. off-policy összekeverése.

### Források
DLV 21; HGA I (*Introduction to Reinforcement Learning*), II (*RL Foundations for Language Models*); HAW 2; MLDI; PDL 17.

---

## 16. fejezet – Hogyan működik egy nagy nyelvi modell? ★★

**Nagy kérdés:** *A ChatGPT „csak” a következő szót jósolja. Hogyan lesz ebből vers, programkód és orvosi tanács?*

### Felépítés
1. **16.1 Nyelvi modell** ★ – a következő token valószínűsége; $n$-gram modell → neurális nyelvi modell (AIE 1, HAW 7, FLLM 2).
2. **16.2 Tokenizálás** ★★ – szó-, karakter- és alszószintű tokenek; a BPE lépésről lépésre; miért nehéz egy LLM-nek
   betűket számolni; miért „drágább” a magyar szöveg (HGA I *Tokenization*, AIE 2).
3. **16.3 Előtanítás** ★★ – önfelügyelt tanulás hatalmas szövegen; dekóder-only (GPT), enkóder-only (BERT, maszkolt nyelvi
   modell), enkóder–dekóder (T5) (FLLM 1–2, MLQ 2, 17).
4. **16.4 Skálázás** ★★ – paraméterek, adat, számítás; skálázási törvények (Chinchilla); az „emergens képességek” vitája;
   szakértőkeverék (MoE) (FLLM 2, AIE 2 *Model Size*, MLSYS *Efficient AI*, HGA I *Mixture of Experts*).
5. **16.5 Szövegalkotás: mintavételezés** ★★ – mohó választás, nyalábkeresés, hőmérséklet, top-$k$, top-$p$;
   strukturált kimenet; a valószínűségi természet következményei (AIE 2 *Sampling*, FLLM 5 *Decoding Algorithms*).
6. **16.6 A kontextusablak és a KV-gyorsítótár** ★★★ – előtöltés (prefill) és dekódolás; hosszú kontextus,
   pozíció-interpoláció (FLLM 2, 5; HGA I).
7. **16.7 Hallucináció és korlátok** ★ – miért talál ki dolgokat; a tudás határideje (cutoff) (AIE 2, HGA I
   *Hallucination Detection*, HAW 7).
8. **16.8 Multimodális modellek** ★★ – kép + szöveg (VLM), beszéd; kis nyelvi modellek eszközön (MLSYS gyakorlatok:
   *SLM, VLM*; AIE 1).

### Kidolgozott példák
- Bigram nyelvi modell két mondatból: valószínűségtábla, majd szöveg generálása.
- BPE: „alma almás almáspite” – az első három összevonás.
- Softmax hőmérséklettel: logitok $(2;\ 1;\ 0{,}5;\ 0)$, $T = 0{,}5;\ 1;\ 2$ (Python-ellenőrzéssel).
- Top-$p = 0{,}9$: melyik tokenek maradnak a halmazban?
- Paraméterszámból memória: 7 milliárd paraméter 16 biten ≈ 14 GB.

### Interaktív szemléltetések
- `bigram-lm` – saját szöveg → bigram-tábla → generálás; összevetés egy trigram-modellel.
- `bpe-tokenizer` – BPE-összevonások lépésenként egy kis korpuszon.
- `token-viewer` – szöveg tokenekre bontása színezve (előre kiszámolt valódi tokenizálóval), magyar vs. angol tokenszám.
- `sampling-lab` – **a fejezet fő widgetje:** következő token eloszlása; hőmérséklet, top-$k$, top-$p$ csúszkák;
  ismételt mintavétel → a kimenetek változatossága.
- `scaling-law-plot` – veszteség a számítás függvényében log–log skálán; az optimális modellméret–adatmennyiség arány.
- `kv-cache-viz` – prefill és dekódolás animálva; mi kerül a gyorsítótárba.

### Kvízek
`ai16-161`, `ai16-162`, `ai16-163`, `ai16-165`, `ai16-167`, `ai16-final`.

### Csapdák
Token ≠ szó (a magyar szöveg több tokenből áll) · $T = 0$ mellett sem mindig determinisztikus a kimenet · az LLM nem
adatbázis · a nagyobb modell nem mindig jobb · a kontextusablak nem memória.

### Források
FLLM 1–2, 5; AIE 1–2; HGA I; HAW 7; MLQ 2, 8, 17; MLSYS (*Efficient AI*, gyakorlatok); DLV 21.

---

## 17. fejezet – Finomhangolás, igazítás és érvelő modellek ★★★

**Nagy kérdés:** *Egy előtanított modell csak folytatja a szöveget. Hogyan lesz belőle segítőkész, ártalmatlan asszisztens,
amely lépésről lépésre gondolkodik?*

### Felépítés
1. **17.1 Az utótanítás áttekintése** ★★ – előtanítás → felügyelt finomhangolás → preferencia-igazítás → érvelés
   (AIE 2 *Post-Training*, FLLM 4).
2. **17.2 Felügyelt finomhangolás (SFT) és utasításkövetés** ★★ – utasítás–válasz párok; adatminőség (FLLM 4, HGA II
   *SFT Best Practices*, AIE 8).
3. **17.3 Paraméterhatékony finomhangolás** ★★★ – LoRA (alacsony rangú frissítés), adapterek, prompthangolás; kvantálás és
   QLoRA; memória-számtan (AIE 7, MLQ 18, HGA I *LoRA*).
4. **17.4 Mikor finomhangoljunk?** ★★ – prompt vs. RAG vs. finomhangolás döntési fa (AIE 7 *Finetuning and RAG*,
   HGA V *RAG + Fine-Tuning Synergy*).
5. **17.5 RLHF** ★★★ – jutalommodell páros összehasonlításokból (Bradley–Terry), PPO, KL-büntetés (FLLM 4, HGA II
   *PPO, Reward Model Training*, MLQ 18).
6. **17.6 DPO és rokonai** ★★★ – közvetlen preferencia-optimalizálás jutalommodell nélkül (FLLM 4, HGA II *DPO,
   Preference Optimization Variants*).
7. **17.7 Érvelő modellek** ★★★ – lánc-gondolkodás (CoT) tanítása, GRPO, ellenőrizhető jutalom (matematika, kód);
   következtetési idejű számításskálázás (HGA II *GRPO*, III; FLLM 5 *Inference-time Scaling*; AIE 2 *Test Time Compute*).
8. **17.8 Adatkészlet-mérnökség** ★★ – kuráció, szintetikus adat, desztilláció, deduplikáció (AIE 8).

### Kidolgozott példák
- LoRA paraméterszám: egy $4096\times4096$-os mátrix vs. $r = 8$ → $2\cdot4096\cdot8 = 65\,536$ paraméter (kb. 0,4%).
- Bradley–Terry: jutalmak 2,0 és 0,5 → preferencia-valószínűség $\sigma(1{,}5) \approx 0{,}82$.
- GRPO csoportos előny: 4 válasz jutalma $(1, 0, 0, 1)$ → normált előnyök.
- Memória-számtan: 7B modell teljes finomhangolása (Adam) vs. LoRA vs. QLoRA.

### Interaktív szemléltetések
- `post-training-pipeline` – kattintható folyamatábra (alapmodell → SFT → RLHF/DPO → érvelés); minden lépésnél ugyanarra
  a kérdésre adott, rögzített modellválasz – látszik, mit tesz hozzá az adott lépés.
- `lora-rank` – nagy mátrix és két kis mátrix szorzata; rang csúszka, paraméterszám és közelítési hiba.
- `preference-pairs` – a tanuló választ két válasz közül; a játék-jutalommodell pontszámai és a Bradley–Terry
  valószínűség frissülnek.
- `grpo-advantage` – egy válaszcsoport jutalmai → normált előnyök → mely válaszokat erősíti a frissítés.
- `finetune-decision` – döntési fa: prompt, RAG vagy finomhangolás?

### Kvízek
`ai17-171`, `ai17-173`, `ai17-174`, `ai17-175`, `ai17-177`, `ai17-final`.

### Csapdák
A finomhangolás nem tanít megbízhatóan új tényeket (arra a RAG való) · katasztrofális felejtés · jutalom-kijátszás és
hízelgés (sycophancy) · a CoT-szöveg nem feltétlenül tükrözi a modell „valódi” számítását.

### Források
FLLM 4–5; AIE 2, 7–8; HGA I (*SFT, LoRA*), II–III; MLQ 18; DLV 22.

---

## 18. fejezet – Promptolás és visszakereséssel kiegészített generálás (RAG) ★★

**Nagy kérdés:** *Ugyanaz a modell egyszer zseniális, máskor használhatatlan választ ad. Mennyi múlik azon, hogyan
kérdezünk – és mit adunk mellé olvasnivalónak?*

### Felépítés
1. **18.1 A prompt anatómiája** ★ – rendszerprompt, felhasználói üzenet, kontextus; csevegősablon (AIE 5, FLLM 3).
2. **18.2 Kontextusbeli tanulás** ★ – zero-shot, few-shot; a példák hatása (AIE 5 *In-Context Learning*, FLLM 3, MLQ 18).
3. **18.3 Bevált gyakorlatok** ★★ – egyértelmű utasítás, elegendő kontextus, kimeneti formátum, részfeladatokra bontás,
   „adj időt gondolkodni”, iterálás és verziózás (AIE 5 *Best Practices*, HGA I *Prompt Engineering*).
4. **18.4 Haladó promptolás** ★★ – lánc-gondolkodás, problémafelbontás, önjavítás, önkonzisztencia (szavazás) (FLLM 3).
5. **18.5 Támadások és védekezés** ★★ – jailbreak, prompt-injektálás (közvetett is), információkinyerés; védelmi rétegek
   (AIE 5 *Defensive Prompt Engineering*).
6. **18.6 RAG: miért és hogyan?** ★★ – a tudás határa és a hallucináció; az architektúra: indexelés → visszakeresés →
   generálás (AIE 6 *RAG*, HGA V *RAG*, FLLM 3 *RAG and Tool Use*).
7. **18.7 Visszakeresés** ★★ – kulcsszavas (BM25/TF-IDF) vs. szemantikus (beágyazás + vektoros keresés, közelítő
   legközelebbi szomszéd); hibrid keresés, újrarangsorolás; darabolás (chunking) (AIE 6, HGA V *Retrieval Methods,
   Chunking Strategies*).
8. **18.8 Haladó és ágensalapú RAG** ★★★ – lekérdezés-átírás, többlépéses keresés, a RAG értékelése (HGA V *Advanced RAG
   Patterns, Agentic RAG, Evaluation*).

### Kidolgozott példák
- Ugyanaz a feladat zero-shot és 3-shot promptolással: hogyan változik a kimenet formátuma?
- Prompt-injektálás egy e-mail-összefoglalóban (közvetett támadás) és a védekezés lépései.
- Mini-RAG kézzel: 5 rövid dokumentum, egy kérdés, TF-IDF koszinusz-pontszámok, a legjobb 2 bekerül a promptba.
- Darabolás: 1000 szavas szöveg 200 szavas darabokra, 50 szavas átfedéssel – hány darab lesz?
- Önkonzisztencia: 5 mintából többségi szavazás.

### Interaktív szemléltetések
- `prompt-anatomy` – egy valódi prompt címkézett részekre bontva, kattintható magyarázatokkal.
- `few-shot-effect` – különböző promptokra adott, előre rögzített modellválaszok összevetése (szimuláció).
- `injection-game` – a tanuló megkeresi a rejtett utasítást dokumentumokban, e-mailekben, weboldalakon.
- `chunking-lab` – szöveg, darabméret és átfedés csúszkák; a darabok kiemelve.
- `mini-rag` – **a fejezet fő widgetje:** kis magyar dokumentumgyűjtemény (pl. a Synopsis saját fejezetei); kérdés →
  TF-IDF- és beágyazás-pontszámok → a kiválasztott darabok → az összeállított prompt.
- `vector-search-2d` – dokumentumok és lekérdezés 2D-s beágyazásban, a legközelebbi $k$ kiemelve.

### Kvízek
`ai18-182`, `ai18-183`, `ai18-185`, `ai18-186`, `ai18-187`, `ai18-final`.

### Csapdák
A hosszabb prompt nem mindig jobb („elveszett a közepén” jelenség) · a RAG nem szünteti meg a hallucinációt ·
a beágyazásos keresés elvéti a pontos azonosítókat (cikkszám, név) – ezért kell a hibrid keresés · a prompt-injektálás
pusztán prompttal nem védhető ki.

### Források
AIE 5–6; FLLM 3; HGA I (*Prompt Engineering*), V (*RAG*); MLQ 18; WAA (*Document Q&A Agents*).

---

## 19. fejezet – AI-ágensek: eszközök, ciklus, tervezés, memória ★★

**Nagy kérdés:** *Egy csevegőrobot válaszol. Egy ágens cselekszik: keres, számol, fájlt ír, és addig próbálkozik, amíg
kész nincs. Mi kell ehhez egy nyelvi modellen felül?*

### Felépítés
1. **19.1 Mi az ágens?** ★ – LLM + eszközök + ciklus (+ memória); az autonómia fokozatai: rögzített munkafolyamat vs.
   autonóm ágens; ágenstípusok (dokumentum-kérdezz-felelek, csevegő, kódsegéd) (WAA, AIE 6 *Agent Overview*,
   HGA V *Introduction to Agentic AI*, *Agent Design Patterns*).
2. **19.2 Eszközhasználat** ★★ – függvényhívás, JSON-séma, eszközleírás; az eredmény visszakerül a kontextusba
   (AIE 6 *Tools*, HGA V *Agent Harness – Tool Integration*).
3. **19.3 Az ágensciklus: ReAct** ★★ – gondolat → cselekvés → megfigyelés; leállási feltétel; ellenőrzés
   (HGA V *Loop Engineering*, AIE 6 *Planning*).
4. **19.4 Tervezés** ★★ – feladatbontás, terv–végrehajtás, reflexió és önjavítás (AIE 6 *Planning*, FLLM 3
   *Problem Decomposition, Self-refinement*).
5. **19.5 Memória** ★★ – rövid távú (kontextus) és hosszú távú (vektoros tár, összefoglalás); memóriatípusok
   (AIE 6 *Memory*, HGA V *Agentic Memory Systems*).
6. **19.6 Kontextus-mérnökség és a „harness”** ★★★ – a kontextusablak kezelése, tömörítés, állapot, hibakezelés és
   helyreállítás (HGA V *Agent Harness, Loop Engineering*).
7. **19.7 Tervezési minták** ★★ – prompt-láncolás, útválasztás (routing), párhuzamosítás, irányító–munkások
   (orchestrator–workers), értékelő–optimalizáló (HGA V *Agent Design Patterns*).
8. **19.8 Hibamódok és értékelés** ★★ – végtelen ciklus, rossz eszközválasztás, költségrobbanás; ágens-benchmarkok és
   -környezetek (AIE 6 *Agent Failure Modes*, HGA V *Agentic Environments and Benchmarks*).

### Kidolgozott példák
- ReAct-nyomkövetés: „Mennyit ér 3 év múlva egy 50 millió forintos lakás évi 6%-os értéknövekedéssel, és ez hány euró
  a mai árfolyamon?” – kereső- és számológép-eszköz, 3 kör.
- Eszközleírás JSON-sémában egy időjárás-lekérdező függvényhez.
- Ugyanaz a feladat rögzített munkafolyamatként és ágensként – mikor melyik?
- Kontextusköltség: 10 kör, körönként 2000 új token – hány tokent dolgoz fel összesen a modell, ha minden kör az egész
  előzményt újraküldi?
- Hibahalmozódás: ha egy lépés 95%-ban sikeres, 10 lépés után $0{,}95^{10} \approx 0{,}60$.

### Interaktív szemléltetések
- `agent-loop-sim` – **a fejezet fő widgetje:** lépésenként lejátszható, valódi modellből rögzített ReAct-nyomkövetés;
  a tanuló elágazási pontokon eszközt választhat; a kontextus növekedése sávként.
- `tool-schema-builder` – eszközleírás összerakása űrlapból → JSON-séma; „jó” és „rossz” leírások hatása (rögzített példákkal).
- `pattern-gallery` – a tervezési minták animált folyamatábrái, mindegyikhez egy példafeladat.
- `context-budget` – tokensáv: rendszerprompt, eszközleírások, előzmények, eszközkimenetek; tömörítés gomb.
- `error-compounding` – lépésenkénti sikerarány és lépésszám → a teljes feladat sikervalószínűsége.

### Kvízek
`ai19-191`, `ai19-192`, `ai19-193`, `ai19-195`, `ai19-197`, `ai19-final`.

### Csapdák
Nem minden feladathoz kell ágens („a legegyszerűbb működő megoldás”) · a hibák halmozódnak · az eszközkimenet nem
megbízható bemenet (injektálás!) · a kontextus nem végtelen, és a költség a lépésszámmal nő.

### Források
WAA; AIE 6; HGA V (*Introduction, Agentic Memory, Agent Harness, Loop Engineering, Agent Design Patterns, Environments*);
FLLM 3 (*RAG and Tool Use*).

---

## 20. fejezet – Ágensrendszerek: MCP, többágenses rendszerek, keretrendszerek ★★★

**Nagy kérdés:** *Hogyan dolgozik együtt több ágens – és hogyan csatlakoztatható bármely eszköz bármely ágenshez anélkül,
hogy mindent újraírnánk?*

### Felépítés
1. **20.1 Model Context Protocol (MCP)** ★★ – az integrációs probléma ($N \times M$); kliens–szerver felépítés; eszközök,
   erőforrások, promptok; biztonsági modell (HGA V *Model Context Protocol*).
2. **20.2 Készségek (skills)** ★★ – utasítások és szkriptek csomagja, igény szerinti betöltés; készség vs. finomhangolás
   (HGA V *Agent Skills*).
3. **20.3 Ágens–ágens kommunikáció (A2A)** ★★★ – ágenskártya, felfedezés, üzenetformátum; A2A vs. MCP (HGA V *A2A*).
4. **20.4 Többágenses rendszerek** ★★★ – architektúrák (központi irányító, hierarchikus, egyenrangú), szerepek,
   koordináció; mikor éri meg (HGA V *Multi-Agent Systems*).
5. **20.5 Keretrendszerek és fejlesztési életciklus** ★★ – a keretrendszerek típusai (📅 2026-os példák: LangGraph,
   OpenAI Agents SDK, Claude Agent SDK, CrewAI) – csak mintaként; tesztelés, megfigyelhetőség (HGA V *Agent Development
   Frameworks*).
6. **20.6 Ágens-felhasználói felületek** ★★ – streaming, ember a hurokban (human-in-the-loop), generatív UI
   (HGA V *Agentic UI Frameworks*).
7. **20.7 Ágensek tanítása** ★★★ – ágenskörnyezetek, RL ágensfeladatokon (HGA II *LLM Agentic Training*, V *Environments*).
8. **20.8 Biztonság és bizalom** ★★ – jogosultságok, homokozó (sandbox), emberi jóváhagyás; a „halálos hármas”
   (privát adat + nem megbízható tartalom + kifelé kommunikáció) (HGA V *MCP Security Model, Security and Trust in
   Multi-Agent Systems*; AIE 5; WAA). *Kiegészítés:* a „halálos hármas” elnevezés a forrásokban nem szerepel, a szakmai
   közbeszédből vesszük.

Kapcsolat: **ágensalapú modellezés** (emergens viselkedés), **játékelmélet** (koordináció, ösztönzők).

### Kidolgozott példák
- $N$ alkalmazás × $M$ eszköz: integrációk száma MCP nélkül ($N\cdot M$) és vele ($N + M$), pl. $N = 5$, $M = 20$.
- Kutató többágenses munkafolyamat: irányító + 3 kereső ágens + összegző – tokenköltség és idő vs. egyetlen ágens.
- Egy MCP-eszközdefiníció (JSON) olvasása: mit lát belőle a modell?
- Jogosultsági mátrix: melyik ágens mit tehet, és mihez kell emberi jóváhagyás.

### Interaktív szemléltetések
- `mcp-architecture` – kattintható diagram (gazda, kliens, szerver, eszköz), az üzenetváltás animálva.
- `nm-integrations` – $N$ és $M$ csúszka, a két megoldás integrációinak száma és rajza.
- `multi-agent-topologies` – topológiák összevetése: üzenetszám, késleltetés, hibatűrés.
- `permission-sandbox` – forgatókönyvek: engedélyezed vagy megtagadod az ágens kérését? Visszajelzés a kockázatról.

### Kvízek
`ai20-201`, `ai20-202`, `ai20-203`, `ai20-204`, `ai20-208`, `ai20-final`.

### Csapdák
Több ágens nem feltétlenül jobb (koordinációs költség, hibaterjedés) · egy MCP-szerver telepítése kódfuttatási bizalmat
jelent · a keretrendszerek gyorsan változnak – a minták maradnak.

### Források
HGA II (*LLM Agentic Training*), V (*MCP, Agent Skills, A2A, Multi-Agent Systems, Agent Development Frameworks,
Agentic UI, Environments*); AIE 6, 10; WAA.

---

## 21. fejezet – AI-alkalmazások építése és értékelése ★★

**Nagy kérdés:** *Elkészült a demó egy délután alatt. Miért tart még fél évig, mire megbízható termék lesz belőle?*

### Felépítés
1. **21.1 Az AI-mérnökség** ★ – foundation modellek; a stack három rétege (alkalmazás, modell, infrastruktúra);
   AI- vs. ML-mérnökség; felhasználási esetek értékelése, mérföldkövek (AIE 1).
2. **21.2 Miért nehéz értékelni?** ★★ – nyílt végű kimenetek; perplexitás, pontos egyezés, funkcionális helyesség
   (kódfuttatás), hasonlóság a referenciához (AIE 3, MLQ 19, FLLM 5 *Evaluation Metrics*).
3. **21.3 MI mint bíró** ★★ – előnyök és torzítások (pozíció, hosszúság, önpreferencia); páros összehasonlítás,
   Elo-rangsor (AIE 3 *AI as a Judge, Comparative Evaluation*; HGA IV).
4. **21.4 Modellválasztás és értékelési folyamat** ★★ – nyilvános benchmarkok és szennyezettségük; saját értékelő
   készlet; költség és késleltetés; építs vagy vegyél (AIE 4, HGA IV).
5. **21.5 A következtetés optimalizálása** ★★★ – késleltetés (első tokenig eltelt idő, tokenenkénti idő), áteresztőképesség;
   kvantálás, desztilláció, metszés, spekulatív dekódolás, kötegelés, KV-gyorsítótár (AIE 9, FLLM 5, MLQ 22,
   MLSYS *Model Optimizations*, HGA I *Model Compression, Speculative Decoding, vLLM*).
6. **21.6 Architektúra** ★★ – kontextusbővítés, védőkorlátok (guardrails), modellútválasztó és átjáró, gyorsítótár,
   megfigyelhetőség (AIE 10 – öt lépésben).
7. **21.7 Felhasználói visszajelzés** ★★ – explicit és implicit jelek, adatlendkerék (AIE 10 *User Feedback*).

### Kidolgozott példák
- Perplexitás négy token valószínűségéből.
- AI-bíró pozíciótorzítása: 100 páron A/B és B/A sorrendben eltérő ítéletek aránya.
- Egy Elo-frissítés páros összehasonlítás után.
- Kvantálás: 70B paraméteres modell memóriaigénye FP16-ban és INT4-ben.
- Költségbecslés: napi 10 000 kérés × (1500 bemeneti + 300 kimeneti token) adott token-ár mellett (📅 árak dátummal).

### Interaktív szemléltetések
- `perplexity-calc` – token-valószínűségek → perplexitás; „mennyire meglepett a modell?”
- `judge-bias-sim` – szimulált bíró pozíció- és hosszúságtorzítással; a sorrend-cserés ellenőrzés hatása.
- `elo-arena` – páros összevetések sorozata → Elo-rangsor élőben.
- `latency-budget` – első token ideje + tokenenkénti idő × kimeneti hossz; kötegméret csúszka → áteresztőképesség vs. késleltetés.
- `quantization-viz` – súlyok hisztogramja, kerekítési hiba a bitszám függvényében.
- `app-architecture` – lépésenként épülő architektúradiagram az AIE 10 öt lépése szerint.

### Kvízek
`ai21-212`, `ai21-213`, `ai21-214`, `ai21-215`, `ai21-216`, `ai21-final`.

### Csapdák
A benchmark-pontszám nem a te feladatod · az AI-bíró is téved · átlagos késleltetés vs. p99 · a „ránézésre jó”
(vibe check) nem értékelés.

### Források
AIE 1, 3–4, 8–10; FLLM 5; HGA I, IV; MLQ 19, 22; MLSYS (*Model Optimizations, AI Acceleration, Benchmarking AI*).

---

## 22. fejezet – ML-rendszerek életciklusa és MLOps ★★

**Nagy kérdés:** *A modell a laborban 95%-os volt. Fél év múlva éles üzemben 70%-os. Senki nem nyúlt hozzá. Mi történt?*

### Felépítés
1. **22.1 Az ML-rendszer** ★ – a modell csak egy kis doboz a rendszerben; kutatás vs. éles üzem; követelmények
   (megbízhatóság, skálázhatóság, karbantarthatóság, alkalmazkodóképesség) (DMLS 1–2, MLSYS *Introduction, ML Systems*).
2. **22.2 A probléma keretezése** ★★ – üzleti cél → ML-cél; osztályozás vagy regresszió; több cél szétválasztása
   (DMLS 2, MLDI *Primer*).
3. **22.3 Adatmérnökség** ★★ – adatforrások, formátumok, kötegelt vs. folyamfeldolgozás; adatcsővezeték
   (DMLS 3, MLSYS *Data Engineering*).
4. **22.4 Telepítés** ★★ – kötegelt vs. online előrejelzés; felhő, peremeszköz (edge), mobil, TinyML; modelltömörítés
   (DMLS 7, MLSYS *ML Systems, On-Device Learning*, gyakorlatok).
5. **22.5 Eloszláseltolódás és monitorozás** ★★ – kovariáns-, címke- és koncepciósodródás; észlelés statisztikai
   próbákkal; mit figyeljünk (DMLS 8, MLQ 23).
6. **22.6 Folyamatos tanulás és tesztelés éles üzemben** ★★ – állapotmentes vs. állapottartó újratanítás; árnyéktelepítés,
   A/B teszt, kanári-kiadás, bandita-alapú tesztelés (DMLS 9, MLQ 20, MLDI *A/B Testing*).
7. **22.7 MLOps-infrastruktúra** ★★ – kísérletkövetés, jellemzőtár, modellregiszter, orkesztráció; építsd vagy vedd
   (DMLS 10, MLSYS *ML Operations*, AAMLP *Reproducible code & model serving*).
8. **22.8 Adatközpontú MI** ★★ – a modell helyett az adat javítása (MLQ 21, MLSYS *Data Engineering*).

### Kidolgozott példák
- A Spotify-eset: egy apró hiba négy hónapig észrevétlen maradt (MLDI).
- Koncepciósodródás: a COVID-járvány és a keresleti előrejelzések.
- A/B teszt két modell konverziós arányára – szignifikáns-e a különbség? (visszautalás a statisztika hipotézisvizsgálatára)
- Kötegelt vs. online előrejelzés: filmajánló vs. kártyacsalás-felderítés (szembeállító pár).

### Interaktív szemléltetések
- `ml-system-map` – kattintható rendszerarchitektúra (adat → jellemzők → tanítás → regiszter → kiszolgálás → monitorozás).
- `drift-monitor` – élő adatfolyam; eltolódás „beinjektálása”; PSI- és KS-statisztika riasztási küszöbbel.
- `ab-test-sim` – két változat szimulált forgalma, a p-érték és a konfidenciaintervallum alakulása.
- `deployment-chooser` – követelmények (késleltetés, adatvédelem, költség, kapcsolat) → javasolt telepítési mód.

### Kvízek
`ai22-222`, `ai22-224`, `ai22-225`, `ai22-226`, `ai22-final`.

### Csapdák
Az offline metrika nem azonos az üzleti hatással · tanítás–kiszolgálás eltérés (training–serving skew) ·
visszacsatolási hurkok · túl ritka vagy túl gyakori újratanítás.

### Források
DMLS 1–10; MLSYS (*Introduction, ML Systems, AI Workflow, Data Engineering, ML Operations, On-Device Learning,
Benchmarking AI*); MLQ 20–23; MLDI (*Primer*); RWML 9; AAMLP (*Reproducible code & model serving*).

---

## 23. fejezet – Rendszertervezési esettanulmányok ★★ *(opcionális)*

**Nagy kérdés:** *Hogyan dönti el a YouTube, hogy a milliárdnyi videóból melyik húszat mutassa neked – néhány tized
másodperc alatt?*

### Felépítés
1. **23.1 A tervezési recept** ★★ – probléma → metrikák (offline/online) → becslés (kérés/s, tárhely) → magas szintű terv →
   skálázás (MLDI).
2. **23.2 Ajánlórendszerek felépítése** ★★ – jelöltgenerálás, rangsorolás, újrarangsorolás; pozíciótorzítás, kalibráció,
   felfedezés–kiaknázás (MLDI *Common Recommendation System Components*, MLD 19).
3. **23.3 Esettanulmányok** ★★ – YouTube-videóajánlás, LinkedIn-hírfolyam, hirdetéskattintás-előrejelzés, Airbnb-keresési
   rangsor, ételkiszállítási idő becslése (MLDI; RWML 10 – digitális hirdetés).
4. **23.4 Tanulságok** ★ – „a mélytanulás nem drop-in csere” (Airbnb); egyszerű kezdés, mérés, iterálás (MLDI, DMLS 2).

### Kidolgozott példák
- Kérés/s becslése napi aktív felhasználókból.
- Kattintási arány (CTR) kalibrációja: becsült vs. megfigyelt arány.
- NDCG kiszámítása egy 5 elemű rangsorra.

### Interaktív szemléltetések
- `funnel-viz` – tölcsér: milliárd → ezer → száz → húsz jelölt, a lépcsők késleltetési költségvetésével.
- `ndcg-calc` – rangsor átrendezése húzással, NDCG élőben.
- `position-bias-sim` – kattintások szimulálása pozíciótorzítással; a naiv és a korrigált becslés.

### Kvízek
`ai23-232`, `ai23-233`, `ai23-final`.

### Források
MLDI; MLD 19; RWML 6, 10; DMLS 2, 7.

---

## 24. fejezet – Evolúciós algoritmusok és neuroevolúció ★★ *(opcionális)*

**Nagy kérdés:** *A természet gradiens nélkül „tervezte meg” az agyat. Lehet-e evolúcióval neurális hálót tervezni?*

### Felépítés
1. **24.1 Evolúciós számítás** ★ – populáció, rátermettség, szelekció, keresztezés, mutáció; előzmény: Conway-féle
   életjáték (EDL 1–2).
2. **24.2 Genetikus algoritmusok** ★★ – OneMax, utazóügynök-probléma; kódolás; a DEAP könyvtár (EDL 3–4).
3. **24.3 További módszerek** ★★ – genetikus programozás, részecskeraj-optimalizálás, evolúciós stratégiák,
   differenciális evolúció (EDL 4).
4. **24.4 Hiperparaméter-optimalizálás evolúcióval** ★★ – összevetés a rács- és véletlen kereséssel (EDL 5; 6.8).
5. **24.5 Neuroevolúció** ★★★ – súlyok és architektúrák evolúciója; NEAT (EDL 6–7, 10–11).
6. **24.6 Kitekintés** ★★★ – evolúciós autoenkóderek és generatív modellek, evolúciós gépi tanulás (EDL 8–9, 12).

Kapcsolat: **ágensalapú modellezés**, **játékelmélet** (evolúciósan stabil stratégia).

### Kidolgozott példák
- OneMax 6 bitre: két generáció kézzel.
- Rulettkerék-szelekció valószínűségei 4 egyedre.
- Egypontos keresztezés és mutáció két szülőn.

### Interaktív szemléltetések
- `ga-onemax` – populáció bitsorokként, generációnként; mutációs ráta és populációméret csúszka.
- `tsp-evolution` – utazóügynök-útvonal fejlődése generációról generációra.
- `pso-swarm` – részecskeraj egy szintvonalas felületen.
- `neat-xor` – a hálótopológia növekedése a XOR-feladaton (előre rögzített futás lejátszása).

### Kvízek
`ai24-241`, `ai24-242`, `ai24-245`, `ai24-final`.

### Források
EDL 1–12; AAMLP (*Hyperparameter optimization*).

---

## 25. fejezet – Felelős MI és társadalmi hatások ★

**Nagy kérdés:** *Egy önéletrajz-szűrő MI rendre hátrébb sorolja a nőket. Senki nem programozta így. Kinek a hibája –
és hogyan lehetett volna megelőzni?*

### Felépítés
1. **25.1 Torzítás és méltányosság** ★ – a torzítás forrásai (adat, címke, mérés, visszacsatolás); méltányossági
   metrikák és egymással való ellentmondásuk (DMLS 11 *Responsible AI*, MLSYS *Responsible AI*, MLD 21).
2. **25.2 Magyarázhatóság** ★★ – jellemzőfontosság, SHAP és LIME szemléletesen, ellenpéldák (MLSYS *Responsible AI*, DMLS 11).
3. **25.3 Adatvédelem, biztonság, robusztusság** ★★ – adatvédelem, differenciális adatvédelem röviden; ellenséges példák,
   adatmérgezés, modelllopás (MLSYS *Security & Privacy, Robust AI*).
4. **25.4 Megfigyelés és gépi látás** ★ – arcfelismerés, „algoritmikus tekintet”, vakfoltok (MV 3–5).
5. **25.5 Fenntarthatóság** ★ – energiaigény, szén-dioxid-lábnyom; hatékonyság mint felelősség (MLSYS *Sustainable AI*).
6. **25.6 Szabályozás** ★ – az EU MI-rendelet (AI Act, 2024) kockázati szintjei – röviden, dátumozva
   (*Kiegészítés:* a források nem tárgyalják).
7. **25.7 Merre tovább?** ★ – AGI-viták, munka, oktatás, „MI a jó ügyért” (HAW 8, MLSYS *AGI Systems, AI for Good*;
   LLM-biztonság: HGA I *LLM Safety and Responsible AI*).

### Kidolgozott példák
- Méltányosság: két csoport tévesztési mátrixa – azonos pontosság, eltérő hamis pozitív arány.
- Ellenséges példa: kis, célzott zaj egy lineáris osztályozó bemenetén → megfordul a döntés.
- Egy tanítás energiaigényének becslése (GPU-órák × teljesítmény × szénintenzitás).

### Interaktív szemléltetések
- `fairness-threshold` – két csoport pontszám-eloszlása; közös vagy csoportonkénti küszöb; a méltányossági metrikák
  egyszerre nem teljesíthetők.
- `adversarial-noise` – kis lineáris modellen a zaj nagysága csúszkával, a döntés átbillenése.
- `explain-prediction` – egy hitelbírálati játékmodell döntésének jellemzőnkénti hozzájárulásai.
- `ai-act-sorter` – húzd a felhasználási esetet a megfelelő kockázati szintre.

### Kvízek
`ai25-251`, `ai25-252`, `ai25-253`, `ai25-256`, `ai25-final`.

### Csapdák
„Az algoritmus objektív” · a védett tulajdonság törlése nem szünteti meg a torzítást (helyettesítő változók) ·
a méltányossági metrikák egyszerre általában nem teljesíthetők · a magyarázat nem bizonyíték.

### Források
DMLS 11; MLSYS (*Responsible AI, Security & Privacy, Robust AI, Sustainable AI, AI for Good, AGI Systems*); MV 1–5;
HAW 8; MLD 21; HGA I (*LLM Safety*).

---

## Közös komponensek (elsőként kidolgozandók)

| Komponens | Tartalom | Használja |
|---|---|---|
| `assets/ml.js` | kis lineáris algebra (vektor, mátrix); magolt (seedelt) véletlenszám-generátor; adatkészlet-generátorok (holdak, körök, spirál, XOR, Gauss-felhők); skaláris automatikus differenciálás (micrograd-stílusú `Value`); MLP + SGD/momentum/Adam; veszteségek; metrikák (tévesztési mátrix, ROC); pontfelhő- és döntésitérkép-rajzoló canvasra | 3–15., 25. |
| `assets/calc.js` (meglévő) | függvényrajzoló, numerikus derivált – a gradiens-widgetekhez | 2–3., 10. |
| `assets/text.js` | egyszerű BPE-tokenizáló, TF-IDF, koszinusz-hasonlóság, bigram nyelvi modell, softmax hőmérséklettel, top-$k$ / top-$p$ mintavétel | 12., 16., 18. |
| `assets/agent-sim.js` | rögzített JSON-forgatókönyvek (ReAct-nyomkövetés, eszközhívások) lépésenkénti lejátszója, elágazásokkal | 18–20. |
| `nn-playground` widget | a neurális háló „játszótere” – a 9–10. fejezet szíve, más fejezetek is beágyazzák | 9–10., 14. |
| előre tanított mini-modellek | számjegy-MLP/CNN (14×14-es MNIST), kis VAE, kis beágyazáskészlet, figyelmi súlyok – JSON-ben, ≤ 1 MB; a generáló Python-szkriptek a repóban (`tools/`) | 8., 11–12., 14., 16. |

## Javasolt kidolgozási sorrend
1. `assets/ml.js` + `nn-playground` + `assets/text.js` (a közös alapok).
2. **1. fejezet** (a térkép) és **3. fejezet** (a tanulás anatómiája – minden további erre épül).
3. **9–10. fejezet** (neurális hálók – a mélytanulás magja, a legtöbb látványos widget).
4. **12 → 16 → 18 → 19. fejezet** – az LLM–ágens szál, a legaktuálisabb rész (a „gyors út” gerince).
5. **2., 4–8. fejezet** – a klasszikus gépi tanulás pótlása; a 2. fejezet a menet közben „🔁 Emlékeztető”-ként
   használt matematikát gyűjti össze.
6. **11., 13., 14., 15., 17., 20–22. fejezet.**
7. **25. fejezet**, majd az opcionális **23–24. fejezet**.

*(Alternatíva: szigorúan 1→25 sorrendben. A fenti sorrend előnye, hogy a leggyakrabban keresett téma – LLM-ek és ágensek –
hamar olvasható, és a klasszikus rész utólag is beilleszthető, mert a fejezetek önállóan is érthetők.)*
