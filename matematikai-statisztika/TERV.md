# Matematikai statisztika – fejezettervezet

Ez a dokumentum a *Matematikai statisztika* témakör fejezeteinek **kidolgozási terve**. Minden fejezethez megadja a felépítést,
a kulcsfogalmakat, a példákat, az interaktív szemléltetések ötleteit, a kvízeket, a csapdákat és a forrásokat. A fejezetek
kidolgozásakor ebből indulunk ki – a terv nem kőbe vésett, menet közben finomítható.

---

## 0. Általános szerkesztési elvek

### Stílus
- **Laza, beszélgetős nyelvezet, de matematikai precizitással.** Minden fogalom pontos definícióval, minden fontos állítás tételként
  (bizonyítással vagy bizonyításvázlattal `<details>`-ben). A szöveg kérdésekkel, hétköznapi helyzetekkel vezet rá a fogalmakra.
- **Lépcsőzetes nehézség.** Minden fejezet a szemléletes megértéssel indul, aztán jön a formalizmus, végül a haladó rész.
  A szakaszok és feladatok jelölése: ★ alap · ★★ közép · ★★★ haladó / kitekintés.
- **Sok példa.** Szakaszonként legalább 2–3 kidolgozott példa (lenyitható megoldással), lehetőleg valós adatokkal vagy
  híres esetekkel (Literary Digest, Wald bombázói, Galton, Anscombe, Benford, Challenger …).
- **Interaktivitás.** Fejezetenként 6–10 szemléltetés (szimuláció, csúszkás kísérlet, „játék”). A statisztikában a legfontosabb
  élmény a **mintavételi ingadozás látványa**: sok widget ismételt mintavételt szimulál.
- **Ellenőrzés.** Szakaszonként kvíz, a fejezet végén villámkártyák, gyakorló feladatok (megoldással), fejezetzáró teszt, szómagyarázó.
- **Források kritikus kezelése.** Ha egy forrásban hibás adat vagy ellentmondás van, azt az oldalon jelezzük, és a javított változattal számolunk
  (mint a 2. valószínűségszámítás-fejezet csizma/bakancs példájánál).

### Technikai konvenciók (a valószínűségszámítás-fejezetek mintájára)
- Mappa: `matematikai-statisztika/NN-rovid-cim/` → `index.html`, `widgets.js`, `quizzes.js`.
- Kvízazonosítók: `ms<fejezet>-<szakasz>`, pl. `ms6-62`, fejezetzáró: `ms6-final`. A témakör `index.html`-jében és a főoldalon
  a `data-progress` listát frissíteni kell.
- Matematika: KaTeX (`$…$`, `$$…$$`); a `<` jel helyett `\lt` vagy szóköz.
- Doboztípusok: `def` (definíció), `thm` (tétel), `example`, `tip`, `warn`, `history`.
- Szómagyarázó: `<a class="gloss" href="#g-…">`, a fejezet végén `<dl class="glossary">` etimológiával.
- Statisztikai táblázatok (normális, t, χ², F) helyett **beépített kalkulátor-widget** (`dist-calc`), amely közös modulba kerülhet
  (`assets/stat.js`: eloszlásfüggvények, kvantilisek, véletlenszám-generátorok, kis adatkészletek).
- Adatkészletek: kicsik, a JS-be ágyazva (pl. Anscombe-kvartett, Galton-magasságok mintája, magyar KSH-idősorok kivonata).

### Előfeltételek a valószínűségszámításból
A 5. fejezettől kezdve szükség van a valószínűségszámítás **3–5. fejezetére** (valószínűségi változók, várható érték, szórás,
nevezetes eloszlások, nagy számok törvénye). A centrális határeloszlás-tételt a statisztika 5. fejezete tárgyalja részletesen
(a valószínűségszámítás 5. fejezete csak a Csebisev-egyenlőtlenséget és a nagy számok törvényét tervezi). Amíg ezek nem készülnek el,
a statisztika-fejezetekben rövid „🔁 Emlékeztető” dobozok pótolják a szükséges minimumot.

### Források (rövidítések)
| Rövidítés | Forrás |
|---|---|
| **OB** | Obádovics J. Gyula: *Valószínűségszámítás és matematikai statisztika*, II. rész (Scolar, 2003) |
| **NGA** | Némethné Gál Andrea: *Általános statisztika* (MÜTF, 2000) – `mutf_galandrea_stat.pdf` |
| **OI** | Diez–Çetinkaya-Rundel–Barr: *OpenIntro Statistics* (4. kiad.) |
| **PSDS** | Bruce–Bruce–Gedeck: *Practical Statistics for Data Scientists* (2. kiad.) |
| **BK** | Békés Gábor – Kézdi Gábor: *Data Analysis for Business, Economics, and Policy* (Cambridge, 2021) |
| **J-PM** | saját jegyzet: *Populáció és Minta* (stathelp.hu alapján) |
| **J-LS** | saját jegyzet: *Leíró Statisztikák* (stathelp.hu alapján) |
| **J-MBH** | saját jegyzet: *Statisztikai mintavétel, becslés és hipotézisvizsgálat* |
| **J-RK** | saját jegyzet: *Háromváltozós lineáris regresszió ill. korreláció* |
| **J-EL** | saját jegyzet: *Prognosztika és idősorelemzés* (Varga Beatrix előadásai alapján) |

---

## A fejezetek áttekintése

| # | Fejezet | Blokk | Szint |
|---|---|---|---|
| 1 | Adatok, populáció és minta | Alapok | ★ |
| 2 | Egy változó leírása: középértékek, szóródás, alak | Leíró statisztika | ★ |
| 3 | Két változó kapcsolata: asszociáció és korreláció | Leíró statisztika | ★–★★ |
| 4 | Viszonyszámok, indexek, standardizálás *(gazdaságstatisztikai kitérő)* | Leíró statisztika | ★ |
| 5 | Mintavételi eloszlások és a centrális határeloszlás-tétel | Következtetés alapjai | ★★ |
| 6 | Becslés: pontbecslés és konfidencia-intervallum | Következtetés | ★★ |
| 7 | A hipotézisvizsgálat logikája | Következtetés | ★★ |
| 8 | Paraméteres próbák: u-, t- és F-próba | Következtetés | ★★ |
| 9 | Khi-négyzet-próbák és nemparaméteres módszerek | Következtetés | ★★ |
| 10 | Varianciaanalízis (ANOVA) | Következtetés | ★★–★★★ |
| 11 | Lineáris regresszió I: egy magyarázó változó | Modellezés | ★★ |
| 12 | Regresszió II: többváltozós és logisztikus modellek | Modellezés | ★★★ |
| 13 | Idősorelemzés és előrejelzés | Modellezés | ★★ |
| 14 | Kitekintés: bayesi statisztika és modern módszerek | Kitekintés | ★★★ |

A sorrend logikája: **leírás → a mintavétel bizonytalansága → következtetés (becslés, próbák) → modellek.**
A 4. és a 14. fejezet kihagyható anélkül, hogy a többi érthetetlenné válna.

---

## 1. fejezet – Adatok, populáció és minta ★

**Nagy kérdés:** *Hogyan lehet 1000 ember megkérdezéséből 10 millió ember véleményére következtetni – és mikor nem lehet?*

**Cél:** a statisztikai gondolkodás alapfogalmai; megérteni, hogy a rossz adat ellen nincs képlet.

### Felépítés
1. **1.1 Mi a statisztika?** ★ – leíró vs. következtető statisztika; a statisztika mint „a bizonytalanság alatti döntés tudománya”.
   Történeti doboz: népszámlálások, Graunt halálozási táblái (1662), Quetelet, Fisher, Neyman–Pearson.
2. **1.2 Sokaság, egyed, ismérv, változó** ★ – alapsokaság (populáció) vs. minta; paraméter (μ, σ, p) vs. statisztika (x̄, s, p̂);
   NGA terminológia (statisztikai sokaság, ismérv, ismérvváltozat) és a modern (populáció, változó) megfeleltetése.
3. **1.3 Változótípusok és mérési skálák** ★ – diszkrét/folytonos; nominális, ordinális, intervallum, arány; mit szabad
   kiszámolni melyiknél (átlagos irányítószám? átlagos Celsius-arány?). Szerep szerint: függő/független, magyarázó/eredmény.
4. **1.4 Mintavételi eljárások** ★–★★ – egyszerű véletlen, rétegzett, csoportos (klaszter), szisztematikus, többlépcsős;
   kényelmi és önkéntes minta; teljes körű vs. részleges megfigyelés (NGA 2.2).
5. **1.5 Torzítások – amikor a minta hazudik** ★★ – szelekciós, túlélési, válaszadási (non-response), kérdésfeltevési torzítás;
   mintavételi hiba vs. nem mintavételi hiba (J-MBH); „nagyobb minta ≠ jobb minta”.
6. **1.6 Megfigyeléses vizsgálat és kísérlet** ★★ – kontrollcsoport, randomizálás, vakpróba/kettős vak, placebo;
   zavaró (confounding) változó; korreláció vs. okság első találkozás.

### Kidolgozott példák
- **Literary Digest, 1936:** 2,4 millió válasz, mégis rossz jóslat (Landon vs. Roosevelt) – Gallup 50 ezres mintája helyesen jósolt.
- **Wald Ábrahám és a bombázók** (túlélési torzítás) – hova kell a páncél?
- **Stentek és stroke (OI 1.1)** – egy randomizált kísérlet anatómiája.
- **„Az iskolai étkeztetés javítja a jegyeket?”** – megfigyeléses adatból levont téves okság, zavaró változó: családi jövedelem.
- Mérési skála besorolási gyakorlat (J-LS 1.6).

### Interaktív szemléltetések
- `sampling-methods` – pöttyökből álló „ország” (régiók, rétegek); a felhasználó választ eljárást (egyszerű véletlen, rétegzett,
  klaszter, szisztematikus, kényelmi), és látja a kiválasztott mintát + a becsült átlagot; 1000-szeres ismétlés hisztogrammal.
- `literary-digest` – csúszkák: mintanagyság és a válaszadási hajlandóság különbsége csoportonként → a becslés torzítása nem tűnik el nagy mintán.
- `survivorship` – repülőgép-sziluett találatokkal; kapcsoló: „csak a visszatért gépek” / „minden gép”.
- `scale-sorter` – húzd a változókat a megfelelő mérési skála dobozába (drag & drop játék).
- `confounder` – szimulált adatok: X és Y korrelál, mert Z mindkettőt befolyásolja; Z szerinti színezés be/ki.

### Kvízek
`ms1-11` (statisztika fogalma), `ms1-12` (sokaság, minta, paraméter), `ms1-13` (skálák), `ms1-14` (mintavétel), `ms1-15` (torzítások), `ms1-16` (kísérlet vs. megfigyelés), `ms1-final`.

### Csapdák
- „Nagy minta = reprezentatív.” – nem: a torzítás nem csökken az elemszámmal.
- Nominális kódok átlagolása; Likert-skála „átlaga” (vitatott, de jelezni kell).

### Szómagyarázó-jelöltek
reprezentatív, randomizálás, placebo, ceteris paribus, konfundáló, rétegzés, census.

### Források
J-PM (egész), J-LS 1., NGA 1–2., OI 1., PSDS 2. (Random Sampling and Sample Bias, Selection Bias), BK 1.

---

## 2. fejezet – Egy változó leírása: középértékek, szóródás, alak ★

**Nagy kérdés:** *Mit jelent az, hogy „az átlagfizetés 600 ezer forint” – és miért keres a legtöbb ember kevesebbet?*

### Felépítés
1. **2.1 Gyakorisági eloszlás** ★ – gyakorisági és relatív gyakorisági tábla, kumulált gyakoriság, osztályközös gyakoriság
   (osztályközök száma, Sturges-szabály), hisztogram, gyakorisági poligon; diszkrét vs. folytonos adat ábrázolása.
2. **2.2 Középértékek** ★ – számtani átlag (egyszerű, súlyozott), medián, módusz; mértani átlag (növekedési ütemek!),
   harmonikus átlag (átlagsebesség!), négyzetes átlag, kronologikus átlag (állományi adatok – NGA 5.2.6);
   a középértékek közötti nagyságrendi összefüggés (H ≤ G ≤ A ≤ Q). Osztályközös adatok mediánja/módusza interpolációval (NGA 5.3).
3. **2.3 Átlag, medián, módusz – mikor melyiket?** ★ – ferdeség hatása, robusztusság, kiugró értékek; vágott átlag (PSDS).
4. **2.4 Helyzeti mutatók** ★ – kvantilisek, kvartilisek, percentilisek (több definíció létezik – jelezni!), ötszámos összefoglaló,
   doboz-ábra (boxplot), kiugró érték 1,5·IQR szabállyal.
5. **2.5 Szóródási mutatók** ★–★★ – terjedelem, IQR, átlagos abszolút eltérés, variancia, szórás; **miért n−1?** (szabadságfok –
   J-LS 4.5; a teljes bizonyítás a 6. fejezetben), relatív szórás (CV); a variancia „eltolási” képlete $\bar{x^2} - \bar x^2$
   (és a numerikus csapdája).
6. **2.6 Standardizálás, z-érték** ★★ – „ki a jobb: aki matekból 85 pontot, vagy aki töriből 70-et írt?”; Csebisev-egyenlőtlenség
   empirikus változata (legalább $1 - 1/k^2$ rész esik $k$ szóráson belül), 68–95–99,7 szabály normális esetben.
7. **2.7 Az eloszlás alakja** ★★ – ferdeség (Pearson-féle, momentum alapú), csúcsosság; bimodális eloszlások; sűrűségbecslés (kernel) kitekintés.
8. **2.8 Szóródás felbontása csoportokra** ★★ – teljes = belső + külső variancia (NGA 5.5) – előkészíti a 3. fejezet szóráshányadosát és az ANOVA-t.

### Kidolgozott példák
- Bérek (KSH-szerű, jobbra ferde eloszlás): átlag vs. medián; „ha Mészáros Lőrinc belép a kocsmába, mindenki milliomos lesz átlagban”.
- Átlagsebesség: odafelé 60, visszafelé 40 km/h → harmonikus átlag 48, nem 50.
- Infláció 3 évre: 5%, 10%, 2% → mértani átlag.
- Kronologikus átlag: havi záró készletek → éves átlagos készlet.
- Két osztály dolgozata ugyanazzal az átlaggal, nagyon eltérő szórással.
- Osztályközös adatsor (NGA számpélda): medián és módusz interpolálása.

### Interaktív szemléltetések
- `histogram-bins` – adatkészlet + osztályköz-szélesség csúszka → hogyan változik a hisztogram „története”.
- `mean-median-drag` – pontok egy számegyenesen, húzhatók; az átlag, a medián és a módusz élőben mozog („húzd el a milliárdost!”).
- `means-compare` – számtani, mértani, harmonikus, négyzetes átlag ugyanarra az adatra, ábrán; útvonal-sebesség feladat.
- `boxplot-builder` – adatok → ötszámos összefoglaló lépésenként, kiugró értékek jelölésével; hisztogram és boxplot egymás alatt.
- `sd-intuition` – „szórásbecslő játék”: hisztogram, tippeld meg a szórást, pontszám.
- `zscore` – két eloszlás, két érték; z-értékek összehasonlítása, a normálgörbe alatti terület.
- `variance-decomp` – csoportok csúszkákkal tologatva: belső és külső variancia oszlopdiagramon.

### Kvízek
`ms2-21` … `ms2-28`, `ms2-final`. Típusok: numerikus számolás (átlag, medián, szórás kis adatsorra), match (melyik középérték melyik helyzethez), multi (robusztus mutatók).

### Csapdák
- Átlagok átlaga ≠ az összevont átlag (súlyozás!).
- Szórás és SE összekeverése (előre jelezni, részletesen az 5. fejezetben).
- Medián páros elemszámnál; kvartilisek különböző definíciói (Excel ≠ R ≠ tankönyv).

### Szómagyarázó-jelöltek
módusz, medián, kvantilis, robusztus, ferdeség, kurtózis, variancia, interkvartilis.

### Források
J-LS 2–5., 9.; NGA 5., 6.; OI 2.1; PSDS 1. (Estimates of Location, Variability, Exploring the Data Distribution).

---

## 3. fejezet – Két változó kapcsolata: asszociáció és korreláció ★–★★

**Nagy kérdés:** *Ha a jégkrémfogyasztás és a fulladásos balesetek száma együtt mozog, betiltsuk a jégkrémet?*

### Felépítés
1. **3.1 A kapcsolatok fajtái** ★ – függetlenség, sztochasztikus és függvényszerű kapcsolat; a kapcsolat típusa a mérési szinttől függ
   (NGA 7.2): **asszociáció** (két minőségi), **vegyes kapcsolat** (minőségi–mennyiségi), **korreláció** (két mennyiségi).
2. **3.2 Kontingencia-táblák és asszociáció** ★★ – peremeloszlások, feltételes eloszlások (visszautalás a valószínűségszámítás 2. fejezetére),
   függetlenség esetén várt gyakoriságok, χ²-mérőszám, Cramér-féle V, Yule-féle Q (2×2), oszlopdiagramok, mozaikábra.
3. **3.3 Vegyes kapcsolat** ★★ – szóráshányados (H, H²) a variancia-felbontásból (2.8) – az ANOVA előfutára.
4. **3.4 Pontdiagram és kovariancia** ★ – négy síknegyed szemlélet, kovariancia előjele, mértékegység-függés.
5. **3.5 Pearson-féle korrelációs együttható** ★★ – definíció, $-1 \le r \le 1$ (bizonyítás Cauchy–Schwarz-szal ★★★), $r$ csak *lineáris*
   kapcsolatot mér; **Anscombe-kvartett**, **Datasaurus**; kiugró pont hatása.
6. **3.6 Rangkorreláció** ★★ – Spearman, Kendall (röviden); monoton, de nem lineáris kapcsolat.
7. **3.7 Korreláció ≠ okság** ★ – zavaró változó, fordított okság, véletlen egybeesés (spurious correlations), **Simpson-paradoxon**
   (visszautalás: valószínűségszámítás 2.2.2), ökológiai tévkövetkeztetés.

### Kidolgozott példák
- Dohányzás × nem 2×2-es tábla: várt gyakoriságok, Yule Q.
- Iskolai végzettség × jövedelem (vegyes kapcsolat, H²).
- Magasság–súly adat: kovariancia cm-ben és m-ben (változik!), r nem változik.
- Anscombe-kvartett: azonos átlag, szórás, r = 0,816 – négy teljesen különböző kép.
- Berkeley-felvételi adatok (Simpson).

### Interaktív szemléltetések
- `guess-r` – „Találd ki a korrelációt!” játék: véletlen pontfelhő, tipp, pontozás, sorozat.
- `scatter-drag` – pontok hozzáadása/húzása; r, kovariancia és a négy síknegyed szorzatainak színezése élőben; egy kiugró pont hatalmas hatása.
- `anscombe` – a négy adatkészlet váltogatása, azonos statisztikákkal.
- `contingency-assoc` – szerkeszthető kétdimenziós tábla; megfigyelt vs. várt gyakoriságok hőtérképe, Cramér V.
- `simpson-slider` – két csoport, csoporton belüli trend vs. összesített trend; csoportarány csúszka.
- `spurious` – két független véletlen bolyongás gyakran „erősen korrelál” – ismételt generálás.

### Kvízek
`ms3-32`, `ms3-35`, `ms3-37`, `ms3-final`.

### Csapdák
r = 0 ≠ nincs kapcsolat (parabola); r nagy ≠ meredek egyenes; korreláció trendelő idősorok között.

### Források
NGA 7.; OI 2.1 (scatterplot), 8.1; PSDS 1. (Correlation, Exploring Two or More Variables); BK 4.; J-RK (korrelációs mátrix).

---

## 4. fejezet – Viszonyszámok, indexek, standardizálás ★ *(gazdaságstatisztikai kitérő, opcionális)*

**Nagy kérdés:** *Ha minden termék ára 10%-kal nőtt, de a kosár tartalma megváltozott – mennyivel drágult az élet?*

### Felépítés
1. **4.1 Viszonyszámok** ★ – megoszlási, koordinációs, dinamikus (bázis- és lánc-), intenzitási viszonyszám (NGA 4.2);
   bázis- és láncviszonyszámok átszámítása (J-EL 3.2).
2. **4.2 Statisztikai sorok** ★ – leíró, területi, idősor, mennyiségi, minőségi sor (NGA 3.) – röviden, táblázatban.
3. **4.3 Érték-, ár- és volumenindex** ★★ – egyedi és aggregát indexek; **Laspeyres**, **Paasche**, Fisher-féle index;
   az indexkör ($I_v = I_p \cdot I_q$); számtani és harmonikus átlagformák (NGA 8.3).
4. **4.4 Indexsorok** ★ – bázis- és láncindexsorok, átszámítás.
5. **4.5 Standardizálás** ★★ – főátlag-, részátlag- és összetételhatás-index; különbségfelbontás (NGA 9.) – kapcsolat a Simpson-paradoxonnal.

### Kidolgozott példák
KSH-fogyasztóiár-index logikája; két bolt átlagárainak összehasonlítása eltérő termékösszetétel mellett (összetételhatás);
„nőtt-e a bérek átlaga, ha minden csoportban csökkent?” (Simpson-szerű).

### Interaktív szemléltetések
- `basket-index` – bevásárlókosár: árak és mennyiségek két időszakban, Laspeyres/Paasche/Fisher élőben; mikor tér el a kettő nagyon?
- `chain-base` – bázis- és láncindexek átszámítása idősoron, grafikonnal.
- `composition-effect` – két csoport, átlagok és arányok csúszkákkal → főátlag-, részátlag-, összetételhatás-index felbontása vízesésdiagramon.

### Kvízek
`ms4-41`, `ms4-43`, `ms4-45`, `ms4-final`.

### Források
NGA 3., 4., 8., 9.; J-EL 3.2.

---

## 5. fejezet – Mintavételi eloszlások és a centrális határeloszlás-tétel ★★

**Nagy kérdés:** *Ha ugyanabból a sokaságból sokszor vennénk mintát, mennyire ugrálna a mintaátlag?*

**Előfeltétel:** valószínűségszámítás 3–5. fejezet (várható érték, szórás, normális eloszlás, nagy számok törvénye) – emlékeztetőkkel.

### Felépítés
1. **5.1 A statisztika mint valószínűségi változó** ★ – minta = független, azonos eloszlású valószínűségi változók ($X_1,\dots,X_n$);
   a mintaátlag maga is valószínűségi változó (OB II.1.2).
2. **5.2 A mintaátlag várható értéke és szórása** ★★ – $E(\bar X) = \mu$, $D(\bar X) = \sigma/\sqrt n$ (bizonyítással);
   **standard hiba (SE)** és a $\sqrt n$-törvény („négyszer annyi adat → feleakkora hiba”); visszatevés nélküli mintavétel:
   véges sokasági korrekció $\sqrt{(N-n)/(N-1)}$.
3. **5.3 Centrális határeloszlás-tétel** ★★ – kimondás, feltételek, mikor „elég nagy” n (ferde eloszlásnál több kell);
   arány mintavételi eloszlása, $\hat p$ szórása $\sqrt{p(1-p)/n}$.
4. **5.4 A normális eloszlásból származtatott eloszlások** ★★–★★★ – χ²-eloszlás (szórásnégyzet mintavételi eloszlása:
   $(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$), Student-féle t (Gosset és a Guinness-sörgyár története), F-eloszlás;
   sűrűségfüggvények alakja a szabadságfok függvényében. Kvantilisek kalkulátorral (tábla helyett).
5. **5.5 Bootstrap** ★★ – „húzzuk ki magunkat a saját cipőfűzőnknél fogva”: visszatevéses újramintavételezés,
   a standard hiba becslése bármilyen statisztikára (pl. mediánra) (PSDS 2.).
6. **5.6 Regresszió a középhez** ★★ – Galton, „Sports Illustrated-átok”, ismételt mérések (PSDS 2.).

### Kidolgozott példák
- Kockadobások átlaga n = 1, 2, 5, 30 esetén – az eloszlás alakjának változása.
- Közvélemény-kutatás: n = 1000, p = 0,4 → $\hat p$ szórása ≈ 1,5 százalékpont.
- Egy gyár töltősúlyai: mennyi az esélye, hogy 25 doboz átlaga 495 g alatti?
- Exponenciális (ferde) eloszlásból vett átlagok – mikor lesz „normális”?

### Interaktív szemléltetések
- `sampling-dist` – a központi widget: választható sokasági eloszlás (egyenletes, ferde, bimodális, saját rajzolt),
  n csúszka, „vegyél 1 / 100 / 10 000 mintát” → a mintaátlagok hisztogramja + rárajzolt normálgörbe; ugyanez mediánra, szórásra, maximumra.
- `sqrt-n` – SE az n függvényében, log-skálán; „mennyi adat kell a fele hibához?”.
- `dist-calc` – közös eloszlás-kalkulátor (normális, t, χ², F): terület ↔ kvantilis, árnyékolt sűrűségfüggvénnyel. Később minden fejezet használja.
- `t-vs-normal` – t-eloszlás konvergál a normálishoz df növelésével.
- `bootstrap` – kis minta pöttyökkel, újramintavétel animálva, bootstrap-eloszlás felépülése.
- `galton-board` – Galton-deszka golyókkal (a CLT fizikai modellje).

### Kvízek
`ms5-52`, `ms5-53`, `ms5-54`, `ms5-55`, `ms5-final`.

### Csapdák
- SD vs. SE: a szórás az adatok, a standard hiba a becslés ingadozása (J-LS 5.7).
- A CLT nem azt mondja, hogy *az adatok* normálisak lesznek.
- „Nagy n esetén a minta eloszlása normális” – nem, csak az átlagé.

### Források
OB II.1.; J-LS 5.; OI 4.1, 5.1; PSDS 2. (Sampling Distribution, CLT, Standard Error, Bootstrap, Normal/t/χ²/F distribution).

---

## 6. fejezet – Becslés: pontbecslés és konfidencia-intervallum ★★

**Nagy kérdés:** *„A párt támogatottsága 31% ± 3%” – pontosan mit jelent ez a ± 3%?*

### Felépítés
1. **6.1 Pontbecslés és jó tulajdonságai** ★★ – becslőfüggvény; torzítatlanság, hatásosság (kisebb variancia), konzisztencia,
   elégségesség (röviden); **átlagos négyzetes hiba = torzítás² + variancia** (bias–variance felbontás);
   $s^2$ torzítatlansága – az $n-1$ bizonyítása; a korrigálatlan szórás torzított (OB II.2.1).
2. **6.2 Becslési módszerek** ★★–★★★ – momentumok módszere; **maximum likelihood** (érme, Poisson, normális példák;
   log-likelihood ábra); legkisebb négyzetek módszere (előre utalás a 11. fejezetre).
3. **6.3 Konfidencia-intervallum a várható értékre** ★★ – σ ismert (z), σ ismeretlen (t); a CI **helyes értelmezése**
   (a módszer fed le 95%-ban, nem „95% eséllyel van benne μ”); hibahatár, megbízhatósági szint és n kapcsolata.
4. **6.4 Konfidencia-intervallum arányra** ★★ – Wald-intervallum és gyengeségei kis n-nél; Wilson-intervallum (kitekintés).
5. **6.5 Konfidencia-intervallum a szórásra** ★★ – χ²-alapú, aszimmetrikus intervallum (OB II.2.2).
6. **6.6 Mintanagyság tervezése** ★★ – adott hibahatárhoz szükséges n átlagnál és aránynál; miért elég 1000 fő egy országnak is.
7. **6.7 Bootstrap-konfidenciaintervallum** ★★ – percentilis módszer; mediánra, korrelációra.

### Kidolgozott példák
- Közvélemény-kutatás: 1000 fő, 31% → 95%-os CI; mekkora minta kell ± 1%-hoz?
- Töltősúlyok mintája (n = 16): t-alapú CI; mi változik, ha σ-t ismernénk?
- Gépalkatrész-szórás CI-je (OB II.2 feladatai).
- MLE: 10 dobásból 7 fej – miért éppen 0,7 a becslés?
- Mintavételi hiba számítása NGA 10.2 számpéldái alapján.

### Interaktív szemléltetések
- `ci-coverage` – a központi widget: 100 minta, 100 intervallum egymás alatt; a μ-t nem tartalmazók pirossal; csúszkák: n, szint, σ ismert/ismeretlen.
- `ci-width` – hibahatár a szint, n és σ függvényében (három csúszka, élő képlet).
- `likelihood` – adat (pl. fej/írás sorozat) → likelihood- és log-likelihood-görbe, maximum kiemelve.
- `bias-variance` – céltábla-metafora: négy becslő (torzított/torzítatlan × kis/nagy variancia), sok becslés pontfelhőként.
- `n-planner` – mintanagyság-tervező kalkulátor.
- `proportion-ci` – Wald vs. Wilson lefedettség p és n függvényében (hol „hazudik” a Wald?).

### Kvízek
`ms6-61`, `ms6-62`, `ms6-63`, `ms6-64`, `ms6-66`, `ms6-final`.

### Csapdák
CI értelmezése; „95%-os CI → az adatok 95%-a ebben van” (nem!); átfedő CI-k ≠ nincs szignifikáns különbség.

### Források
OB II.2.; NGA 10.2; J-MBH; J-LS 6.; OI 5.2, 6.1, 7.1; PSDS 2. (Confidence Intervals, Bootstrap); BK 5.

---

## 7. fejezet – A hipotézisvizsgálat logikája ★★

**Nagy kérdés:** *Egy hölgy állítja, hogy megkóstolva megmondja, a teába vagy a tejet öntötték előbb a csészébe. Hogyan teszteljük?* (Fisher)

### Felépítés
1. **7.1 A gondolatmenet** ★ – bírósági analógia (ártatlanság vélelme = H₀); nullhipotézis, alternatív hipotézis; próbastatisztika;
   „ha H₀ igaz lenne, mennyire lenne meglepő az adat?”
2. **7.2 Elfogadási és kritikus tartomány, szignifikanciaszint** ★★ – egy- és kétoldali próbák (OB II.3).
3. **7.3 A p-érték** ★★ – pontos definíció; mit **nem** jelent (nem $P(H_0 \mid \text{adat})$! – visszautalás az ügyész tévedésére és a Bayes-tételre);
   az ASA 2016-os állásfoglalása.
4. **7.4 Elsőfajú és másodfajú hiba, próbaerő** ★★ – négy döntési kimenetel (J-PM 4.); α, β, 1−β; erő a hatásnagyság,
   n, α és a zaj függvényében (J-PM 5.); hatásnagyság (Cohen-féle d).
5. **7.5 Kapcsolat a konfidencia-intervallummal** ★★ – kétoldali próba ⇔ CI tartalmazza-e a hipotetikus értéket.
6. **7.6 Permutációs próba** ★★ – a „hölgy teát kóstol” egzakt próbája; véletlen átcímkézés (PSDS 3. Resampling).
7. **7.7 Többszörös tesztelés és p-hacking** ★★–★★★ – 20 próbából 1 „szignifikáns” véletlenül; Bonferroni; reprodukálhatósági válság;
   a xkcd-féle „zselés cukorka” példa; publikációs torzítás.
8. **7.8 Statisztikai vs. gyakorlati szignifikancia** ★★ – óriási n mellett minden szignifikáns.

### Kidolgozott példák
- Lady tasting tea (8 csésze, kombinatorikus p-érték: $1/\binom84 = 1/70$).
- Érme: 100 dobásból 60 fej – cinkelt? (binomiális p-érték, majd normális közelítés)
- Szülészeti osztály: fiúk aránya – kétoldali próba.
- Gyógyszer-hatásosság: α és β kompromisszuma (mi a drágább hiba?).

### Interaktív szemléltetések
- `tea-tasting` – a kísérlet lejátszása: a felhasználó „kóstol”, a gép kiszámítja a p-értéket; permutációs eloszlás.
- `p-value-machine` – adott H₀ eloszlás, megfigyelt próbastatisztika húzható; árnyékolt p-érték, egy- és kétoldali kapcsoló.
- `errors-power` – két eltolt normálgörbe (H₀ és H₁), α-terület, β-terület, erő; csúszkák: hatásnagyság, n, α.
- `p-hacking` – 20 független, hatás nélküli kísérlet szimulálása → „szignifikáns” találatok jelölése; Bonferroni kapcsoló.
- `p-dance` – ugyanaz a kísérlet sokszor megismételve: a p-értékek „táncolnak” (Cumming).
- `permutation-test` – két csoport pöttyei, véletlen átcímkézés animációval, a különbségek eloszlása.

### Kvízek
`ms7-71`, `ms7-73`, `ms7-74`, `ms7-77`, `ms7-final`.

### Csapdák
„H₀-t elfogadjuk” vs. „nem vetjük el”; p > 0,05 ≠ nincs hatás; p ≠ a hatás nagysága; „majdnem szignifikáns”.

### Források
OB II.3. (bevezető); J-PM 4–6.; OI 5.3; PSDS 3. (A/B Testing, Hypothesis Tests, Resampling, p-Values, Type 1/2 Errors, Multiple Testing, Power); BK 6.

---

## 8. fejezet – Paraméteres próbák: u-, t- és F-próba ★★

**Nagy kérdés:** *Tényleg 500 grammos a zacskó? Jobb-e az új tanítási módszer? Egyformán pontos-e a két gép?*

### Felépítés
1. **8.1 Egymintás u-próba** ★★ – σ ismert; menetrend: hipotézisek → próbastatisztika → döntés → szöveges értelmezés (OB II.3.1).
2. **8.2 Kétmintás u-próba** ★★ – két független minta, ismert szórások.
3. **8.3 Egymintás t-próba** ★★ – σ ismeretlen; feltételek (normalitás vagy nagy n), QQ-ábra (OB II.3.2, OI 7.1).
4. **8.4 Páros t-próba** ★★ – előtte–utána mérések; miért erősebb, mint a kétmintás (OI 7.2).
5. **8.5 Kétmintás t-próba és Welch-próba** ★★ – egyenlő szórások feltétele; Welch-féle szabadságfok (OB II.3.3, OI 7.3).
6. **8.6 F-próba két szórás összehasonlítására** ★★ – (OB II.3.4) és érzékenysége a normalitásra.
7. **8.7 Arányok próbái** ★★ – egy arány, két arány különbsége (OI 6.1–6.2); A/B-tesztelés (PSDS 3.).
8. **8.8 Mintanagyság és erő tervezése** ★★★ – két átlag különbségére (OI 7.4).
9. **8.9 Döntési fa: melyik próbát mikor?** ★ – összefoglaló folyamatábra (interaktív).

### Kidolgozott példák
OB II.3 számpéldái és feladatai (töltősúlyok, gépek pontossága, két technológia); OI: születési súlyok dohányzó/nem dohányzó anyák;
páros példa: tankönyvárak két boltban (OI); A/B-teszt: weboldal-konverzió.

### Interaktív szemléltetések
- `test-wizard` – próbaválasztó varázsló (adattípus, minták száma, párosítás, ismert σ?) → javasolt próba + képlet.
- `t-test-lab` – két csoport adatai (szerkeszthető vagy generált), élő t-statisztika, df, p-érték, CI a különbségre; Welch kapcsoló.
- `paired-vs-indep` – ugyanaz az adat párosan és függetlenként elemezve; az egyéni különbségek „kiejtik” a szóródást.
- `qq-plot` – normalitás ellenőrzése; különböző eloszlásokból vett minták QQ-ábrája.
- `ab-test` – két weboldalváltozat szimulált látogatókkal, élő arányok és próba; „mikor álljunk le?” (peeking-probléma).
- `power-planner` – erő/mintanagyság kalkulátor.

### Kvízek
`ms8-81`, `ms8-83`, `ms8-84`, `ms8-85`, `ms8-87`, `ms8-final`.

### Csapdák
Páros adat független mintásként elemezve; többszöri „belenézés” az A/B-tesztbe; F-próba nem normális adatra.

### Források
OB II.3.1–3.4 + V. feladatok; OI 6.1–6.2, 7.1–7.4; PSDS 3. (t-Tests, A/B Testing, Power and Sample Size); NGA 10.3 (hipotézisvizsgálat).

---

## 9. fejezet – Khi-négyzet-próbák és nemparaméteres módszerek ★★

**Nagy kérdés:** *Szabályos-e a kocka? Független-e a pártpreferencia a lakóhelytől? Mit tegyünk, ha az adat nem normális?*

### Felépítés
1. **9.1 Illeszkedésvizsgálat (χ²)** ★★ – megfigyelt vs. várt gyakoriságok, szabadságfok, a „legalább 5 várt gyakoriság” szabály;
   becsült paraméterek miatti df-csökkenés (OB II.3.5).
2. **9.2 Homogenitásvizsgálat** ★★ – azonos eloszlásból származik-e több minta (OB II.3.5).
3. **9.3 Függetlenségvizsgálat** ★★ – kontingencia-tábla, visszautalás a 3. fejezet asszociációs mérőszámaira (OB II.3.6, OI 6.4).
4. **9.4 Fisher-féle egzakt próba** ★★★ – kis mintákra; kapcsolat a hipergeometrikus eloszlással (PSDS 3.).
5. **9.5 Nemparaméteres próbák** ★★ – előjelpróba, Wilcoxon-féle előjeles rangpróba, Mann–Whitney-féle U-próba,
   Kruskal–Wallis (röviden); mikor éri meg, mennyi erőt veszítünk.
6. **9.6 Kolmogorov–Szmirnov-próba** ★★★ – empirikus eloszlásfüggvény, maximális eltérés.

### Kidolgozott példák
Kockadobás 600-szor (illeszkedés); **Benford-törvény** és könyvelési csalások; Mendel borsói („túl jó” illeszkedés – Fisher gyanúja);
lakóhely × pártpreferencia tábla; kis klinikai minta Fisher-próbával.

### Interaktív szemléltetések
- `chi-square-dice` – dobj egy (esetleg cinkelt) kockával, élő χ² és p-érték; cinkeltség csúszka → mikor „buktatjuk le”?
- `benford` – adatkészletek (városlakosság, folyóhosszak, kitalált számok) első számjegyeinek eloszlása vs. Benford; illeszkedésvizsgálat.
- `independence-table` – szerkeszthető tábla, várt gyakoriságok, cellánkénti χ²-hozzájárulás hőtérképen.
- `rank-test` – két minta rangjai vizualizálva, U-statisztika; kiugró érték hatása t-próbára vs. rangpróbára.
- `ecdf-ks` – empirikus eloszlásfüggvény és elméleti eloszlásfüggvény, a KS-távolság kiemelve.

### Kvízek
`ms9-91`, `ms9-93`, `ms9-95`, `ms9-final`.

### Források
OB II.3.5–3.6; OI 6.3–6.4; PSDS 3. (Chi-Square Test, Fisher's Exact Test).

---

## 10. fejezet – Varianciaanalízis (ANOVA) ★★–★★★

**Nagy kérdés:** *Három műtrágya közül van-e, amelyik jobb – és miért nem csinálunk egyszerűen három t-próbát?*

### Felépítés
1. **10.1 Miért nem páronkénti t-próbák?** ★★ – a többszörös tesztelés problémája (visszautalás 7.7).
2. **10.2 Egyszempontos ANOVA** ★★ – variancia-felbontás (SST = SSB + SSW, visszautalás 2.8 és 3.3), F-statisztika,
   ANOVA-tábla, feltételek (normalitás, szóráshomogenitás – Levene/Bartlett röviden).
3. **10.3 Utóelemzés** ★★ – Tukey HSD, Bonferroni-korrekció.
4. **10.4 Kétszempontos ANOVA** ★★★ – főhatások és interakció; interakciós ábra (PSDS 3.).
5. **10.5 Kapcsolat a regresszióval** ★★★ – az ANOVA mint dummy-változós regresszió (előre utalás a 12. fejezetre).

### Kidolgozott példák
Fisher rothamstedi kísérletei (történeti doboz); három tanítási módszer teszteredményei; OI: baseball-pozíciók ütési átlaga; PSDS: weboldal-ragadósság négy változatra.

### Interaktív szemléltetések
- `anova-sliders` – három csoport, csúszkák: csoportátlagok és csoporton belüli szórás → SSB, SSW, F, p élőben; pontdiagram + oszlopok.
- `anova-permutation` – F-statisztika permutációs eloszlása.
- `interaction-plot` – kétszempontos elrendezés, interakció ki/be.

### Kvízek
`ms10-102`, `ms10-103`, `ms10-final`.

### Források
OI 7.5; PSDS 3. (ANOVA, F-Statistic, Two-Way ANOVA); NGA 5.5 és 7.2.2 (variancia-felbontás, szóráshányados).

---

## 11. fejezet – Lineáris regresszió I: egy magyarázó változó ★★

**Nagy kérdés:** *Mennyivel nő átlagosan a lakás ára négyzetméterenként – és mennyire bízhatunk ebben a számban?*

### Felépítés
1. **11.1 A regressziós egyenes ötlete** ★ – feltételes várható érték; Galton és a „regresszió” szó eredete.
2. **11.2 Legkisebb négyzetek módszere** ★★ – a normálegyenletek levezetése (OB II.4.2); $b_1 = r \cdot s_y/s_x$;
   az egyenes átmegy az $(\bar x, \bar y)$ ponton; reziduumok, reziduumösszeg = 0.
3. **11.3 Az illeszkedés jósága** ★★ – SST = SSR + SSE, determinációs együttható ($R^2 = r^2$ egy változónál), a reziduumok szórása;
   reziduumábra és mintázatai (J-EL 10.).
4. **11.4 Az empirikus képlet kiválasztása, linearizálás** ★★ – hatvány-, exponenciális, logaritmikus kapcsolat linearizálása
   logaritmálással (OB II.4.1); log–log modell értelmezése (rugalmasság).
5. **11.5 A statisztikai modell és a következtetés** ★★–★★★ – $Y = \beta_0 + \beta_1 x + \varepsilon$, feltételek (LINE);
   $\beta_1$ standard hibája, t-próba a meredekségre, CI (OB II.4.3, OI 8.4).
6. **11.6 Becslés és előrejelzés** ★★ – konfidencia-intervallum az átlagra vs. predikciós intervallum egyedi értékre;
   az extrapoláció veszélye (PSDS 4.).
7. **11.7 Kiugró és befolyásos pontok** ★★ – leverage, Cook-távolság (szemléletesen) (OI 8.3).

### Kidolgozott példák
Galton apa–fiú magasságok (regresszió a középhez); lakásárak és alapterület (BK 7.); OB II.4 számpéldái (pl. fizikai mérések
empirikus képlete); Challenger-katasztrófa (hőmérséklet × O-gyűrű-hibák) mint figyelmeztető példa az adatok kihagyására.

### Interaktív szemléltetések
- `least-squares` – pontfelhő, húzható egyenes; a reziduumnégyzetek valódi négyzetekként rajzolva, összterületük; „győzd le az OLS-t!”, majd az OLS-egyenes megjelenítése.
- `regression-drag` – pontok húzása, élő egyenes, R², egy befolyásos pont hatása.
- `residual-patterns` – adatkészletek (lineáris, görbült, heteroszkedasztikus) reziduumábrái.
- `linearize` – nyers és logaritmált tengelyek közti váltás; exponenciális/hatványfüggvény illesztése.
- `ci-vs-pi` – konfidencia- és predikciós sáv a regressziós egyenes körül, n és szórás csúszkával.
- `regression-to-mean` – szimulált teszt–újrateszt eredmények.

### Kvízek
`ms11-112`, `ms11-113`, `ms11-115`, `ms11-116`, `ms11-final`.

### Csapdák
x-et y-ra vagy y-t x-re regresszálni nem ugyanaz; R² magas ≠ jó modell; okság a meredekségből.

### Források
OB II.4. + V. feladatok; OI 8.; BK 7–9.; PSDS 4. (Simple Linear Regression, Prediction Using Regression); J-EL 9–10.

---

## 12. fejezet – Regresszió II: többváltozós és logisztikus modellek ★★★

**Nagy kérdés:** *Mennyit ér egy plusz év iskola a fizetésben, ha a tapasztalatot is figyelembe vesszük?*

### Felépítés
1. **12.1 Két magyarázó változó** ★★ – a háromváltozós modell (J-RK): regressziós sík, parciális regressziós együtthatók,
   **ceteris paribus** értelmezés; miért más az együttható, mint az egyszerű regresszióban (kihagyott változó torzítása).
2. **12.2 Mátrixos alak** ★★★ – $\hat\beta = (X^\top X)^{-1}X^\top y$ (kitekintés, geometriai vetítés-szemlélettel).
3. **12.3 Gauss–Markov-feltételek** ★★★ – és mi történik, ha sérülnek (J-RK 4.).
4. **12.4 Többszörös és parciális korreláció** ★★ – korrelációs mátrix, $R^2$, korrigált $R^2$, parciális korreláció és
   parciális determináció (J-RK második fele, kidolgozott példával).
5. **12.5 Kategóriás magyarázó változók** ★★ – dummy-változók, referenciakategória, interakció (PSDS 4.).
6. **12.6 Multikollinearitás** ★★★ – VIF, instabil együtthatók.
7. **12.7 Modellválasztás és túlillesztés** ★★★ – korrigált R², AIC (röviden), lépésenkénti szelekció veszélyei,
   tanító/teszt minta, keresztvalidáció (OI 9.2, PSDS 4., BK 13–14.).
8. **12.8 Logisztikus regresszió** ★★★ – valószínűség modellezése, logit, esélyhányados (visszautalás az odds fogalmára,
   valószínűségszámítás 2.2.1), maximum likelihood-illesztés (OI 9.5, BK 11.).

### Kidolgozott példák
J-RK kidolgozott példája (korrelációs mátrix → R², parciális korrelációk); bérek: iskolázottság + tapasztalat; OI Mario Kart esettanulmány;
King County lakásárak (PSDS); e-mail spam-szűrés logisztikus regresszióval (OI).

### Interaktív szemléltetések
- `regression-plane` – 3D pontfelhő forgatható regressziós síkkal (canvas, egyszerű forgatás).
- `omitted-variable` – szimuláció: Z befolyásolja X-et és Y-t; Y~X vs. Y~X+Z együttható összehasonlítása.
- `overfitting` – polinomfok csúszka; tanító és teszt hiba görbéje (a klasszikus U alak).
- `multicollinearity` – két erősen korrelált magyarázó változó; az együtthatók ingadozása ismételt mintákon.
- `logistic-fit` – 0/1 adatok, szigmoid görbe húzható paraméterekkel, majd ML-illesztés; esélyhányados értelmezése.

### Kvízek
`ms12-121`, `ms12-124`, `ms12-125`, `ms12-127`, `ms12-128`, `ms12-final`.

### Források
J-RK (egész); OI 9.; BK 10–11., 13–14.; PSDS 4–5.

---

## 13. fejezet – Idősorelemzés és előrejelzés ★★

**Nagy kérdés:** *Mennyi fagylalt fogy jövő júliusban – és mennyire bízhatunk a jóslatban?*

### Felépítés
1. **13.1 A prognosztika alapjai** ★ – determinisztikus és sztochasztikus előrejelzés, jövőkutatás vs. prognosztika (J-EL 1.).
2. **13.2 Idősorok alapjai** ★ – idősor vs. keresztmetszeti adat; állapot- és tartamidősor; grafikus ábrázolás és torzításai (J-EL 2–3.1).
3. **13.3 Egyszerű eszközök** ★ – bázis- és láncviszonyszámok, kronologikus átlag, átlagos változás mértéke és üteme (J-EL 3.2–3.4).
4. **13.4 Az idősor komponensei és a dekompozíció** ★★ – trend, szezonalitás, ciklus, véletlen; additív és multiplikatív modell;
   szezonális eltérés és szezonindex (J-EL 5–6.).
5. **13.5 Mozgóátlagolás** ★★ – páratlan és páros tagszám, centírozás; előnyök és hátrányok (J-EL 8.).
6. **13.6 Analitikus trendszámítás** ★★ – lineáris, exponenciális, polinomiális, logisztikus trend; illeszkedés jósága: reziduum, R², relatív reziduális szórás (J-EL 9–10.).
7. **13.7 Exponenciális simítás** ★★ – egyszeres (SES), α szerepe; Holt-féle kettős simítás; Holt–Winters additív és multiplikatív (J-EL 11–15.).
8. **13.8 Előrejelzés értékelése** ★★ – előrejelzési hiba mutatói (MAE, RMSE, MAPE), tanító/ellenőrző időszak; módszerválasztás (J-EL 16.).
9. **13.9 Kitekintés: autokorreláció, stacionaritás** ★★★ – miért nem lehet idősorokra naivan regressziót futtatni (BK 12.).

### Kidolgozott példák
KSH havi kiskereskedelmi forgalom vagy szállásférőhely-adatok (szezonalitás); magyar GDP lánc- és bázisindexei;
egy webshop napi forgalma (heti szezonalitás); J-EL vizsgakérdései (17.) feladatként.

### Interaktív szemléltetések
- `ts-decompose` – idősor-generátor (trend, szezonalitás amplitúdója, zaj csúszkákkal; additív/multiplikatív) és a dekompozíció négy panelje.
- `moving-average` – mozgóátlag tagszám-csúszkával, centírozással; mit „nyel el” a simítás?
- `trend-fit` – lineáris/exponenciális/polinomiális trend illesztése, R² és reziduumok, előrejelzés a jövőbe.
- `exp-smoothing` – α (β, γ) csúszkák, SES / Holt / Holt–Winters; élő előrejelzés és hibamutatók.
- `forecast-eval` – tanító/ellenőrző időszak határának húzása, MAE/RMSE/MAPE összehasonlítás.

### Kvízek
`ms13-133`, `ms13-134`, `ms13-136`, `ms13-137`, `ms13-final`.

### Források
J-EL (egész, beleértve a képletgyűjteményt és a vizsgakérdéseket); NGA 3.3, 4.2 (dinamikus viszonyszámok), 5.2.6 (kronologikus átlag); BK 12.

---

## 14. fejezet – Kitekintés: bayesi statisztika és modern módszerek ★★★ *(opcionális)*

**Nagy kérdés:** *Mi lenne, ha a paramétert is valószínűségi változónak tekintenénk?*

### Felépítés
1. **14.1 Frekventista vs. bayesi szemlélet** ★★ – visszautalás a Bayes-tételre (valószínűségszámítás 2.2.1); prior, likelihood, poszterior.
2. **14.2 Béta–binomiális modell** ★★★ – érme torzításának bayesi becslése; konjugált prior; hiteles intervallum vs. konfidencia-intervallum.
3. **14.3 Bayesi A/B-tesztelés** ★★★ – „mekkora valószínűséggel jobb B, mint A?”
4. **14.4 Többkarú rabló (multi-armed bandit)** ★★★ – felfedezés vs. kihasználás (PSDS 3.).
5. **14.5 Statisztika és gépi tanulás** ★★ – predikció vs. magyarázat, döntési fák, keresztvalidáció (PSDS 6., BK 15–16.) – rövid térkép a további tanuláshoz.

### Interaktív szemléltetések
- `beta-update` – fej/írás gombok, a béta-poszterior élőben frissül; különböző priorok összehasonlítása.
- `bayes-ab` – két béta-poszterior, $P(p_B > p_A)$ Monte-Carlo-becsléssel.
- `bandit` – három „félkarú rabló” ismeretlen nyerési eséllyel; epsilon-mohó vs. Thompson-mintavétel.

### Források
PSDS 3. (Multi-Arm Bandit), 6.; BK 15–16.; valószínűségszámítás 2. fejezet és a saját *Bayes' Theorem* jegyzet.

---

## Közös komponensek (elsőként kidolgozandók)

| Komponens | Tartalom | Használja |
|---|---|---|
| `assets/stat.js` | normális/t/χ²/F sűrűség-, eloszlás- és kvantilisfüggvények; véletlenszám-generátorok (normális, exponenciális, binomiális); leíró statisztikák; OLS | 2–14. fejezet |
| `dist-calc` widget | eloszlás-kalkulátor (táblázatok helyett) | 5–10. fejezet |
| `sampling-dist` widget | ismételt mintavétel motorja | 5–7. fejezet |
| kis adatkészletek | Anscombe, Galton (minta), Benford-adatok, KSH-idősorok, iskolai/bér adatok | több fejezet |

## Javasolt kidolgozási sorrend
1. `assets/stat.js` + `dist-calc`
2. 1. és 2. fejezet (nincs valószínűségszámítási előfeltétel)
3. 3. fejezet
4. *(ideális esetben itt készülnek el a valószínűségszámítás 3–5. fejezetei)*
5. 5–7. fejezet (a következtetés magja)
6. 8–10. fejezet
7. 11–13. fejezet
8. 4. és 14. fejezet (opcionálisak)
