# Analízis – fejezettervezet

Ez a dokumentum az *Analízis* témakör fejezeteinek **kidolgozási terve**, a Matematikai statisztika tervének (`matematikai-statisztika/TERV.md`)
mintájára. Minden fejezethez megadja a felépítést, a kulcsfogalmakat és tételeket, a példákat, az interaktív szemléltetések ötleteit,
a kvízeket, a csapdákat és a forrásokat. A kidolgozáskor ebből indulunk ki; a terv menet közben finomítható.

---

## 0. Általános szerkesztési elvek

### Stílus
- **Laza, beszélgetős nyelvezet, matematikai precizitással.** Minden fogalom pontos definícióval, minden fontos állítás tételként
  (bizonyítással vagy bizonyításvázlattal `<details>`-ben). A szöveg a „miért kell ez?” kérdéssel, hétköznapi vagy gazdasági
  helyzettel vezet rá a fogalmakra – ahogy a MAT1-órák jegyzetei (motiváció → absztrakció → definíció).
- **Lépcsőzetes nehézség.** Minden fejezet a szemléletes megértéssel indul (ábra, numerikus kísérlet), aztán jön a formalizmus,
  végül a haladó rész. Jelölés: ★ alap · ★★ közép · ★★★ haladó / kitekintés.
- **Sok példa.** Szakaszonként 2–3 kidolgozott példa lenyitható megoldással; a Nagyné Csóti-példatár és Csernyák feladatai a gerinc,
  gazdasági példák Kis Mártától és az *Applied Calculus*-ból, szemléletes magyarázatok a *Calculus for Dummies*-ból.
- **Interaktivitás.** Fejezetenként 6–10 szemléltetés. Az analízisben a legfontosabb élmény a **„közelítsünk és nézzük, mi történik”**:
  szelő → érintő, téglalapok → terület, részletösszegek → határérték, Taylor-polinom fokszámának növelése. Szinte minden widget egy
  **függvényrajzolóra** épül (lásd közös komponensek).
- **Ellenőrzés.** Szakaszonként kvíz, fejezet végén villámkártyák, gyakorló feladatok megoldással (példatár-számokkal hivatkozva),
  fejezetzáró teszt, szómagyarázó etimológiával.
- **Források kritikus kezelése.** Ha a forrásokban hiba vagy ellentmondás van, az oldalon jelezzük.
- **Jelölések.** Derivált: $f'(x)$ és $\frac{dy}{dx}$ is (mindkettőt bevezetjük, a Leibniz-jelölést a láncszabálynál és a
  differenciálegyenleteknél használjuk). Integrál: $\int f(x)\,dx$. Határérték: $\lim_{x\to a}$. Intervallumok: $[a; b]$, $]a; b[$ (Csernyák)
  – egy jelölési dobozban az angol $(a, b)$ is.

### Technikai konvenciók
- Mappa: `analizis/NN-rovid-cim/` → `index.html`, `widgets.js`, `quizzes.js`.
- Kvízazonosítók: `an<fejezet>-<szakasz>`, pl. `an4-43`; fejezetzáró: `an4-final`. A témakör `index.html`-jében és a főoldal
  `data-progress` listájában frissíteni kell.
- KaTeX; `<` helyett `\lt`.
- Doboztípusok: `def`, `thm`, `example`, `tip`, `warn`, `history`.
- **Közös modul: `assets/calc.js`** (elsőként kidolgozandó!):
  - kifejezés-értelmező (`x^2*sin(x)` → függvény), hogy a tanuló **saját függvényt** írhasson be a widgetekbe;
  - numerikus derivált (központi differencia), numerikus integrál (téglalap/trapéz/Simpson), gyökkeresés (felezés, Newton);
  - egyszerű **szimbolikus deriválás** polinomokra és elemi függvényekre (szorzat-, hányados-, láncszabály) – a „deriválógép”
    widgetekhez; a kimenetet KaTeX-ben jelenítjük meg;
  - `plot` segédfüggvény: koordináta-rendszer, görbe, pont, szelő/érintő, satírozott terület, aszimptota, zoom/pan egérrel.
- Adatkészletek: kis gazdasági idősorok (ár–kereslet, költségfüggvény), fizikai mérések (út–idő), a legkisebb négyzetekhez
  pontfelhő.

### Előfeltételek és kapcsolatok más témakörökkel
- Középiskolai alapok (algebra, függvények, trigonometria, logaritmus) – az 1. fejezet gyors ismétlést ad, a részletek a
  Csernyák 1–2. és Kis Márta 1. fejezetére hivatkozva.
- **Valószínűségszámítás:** a 3. fejezet (sűrűségfüggvény, $\int f = 1$, várható érték mint integrál) és a 4. fejezet (normális
  eloszlás, Gauss-integrál) az **integrálszámítást** használja → a 8. analízis-fejezet visszautal rájuk, és fordítva.
- **Matematikai statisztika:** a legkisebb négyzetek módszere (9. fejezet) a regresszió alapja (statisztika 11–12. fejezet).
- **Közgazdaságtan:** határköltség, rugalmasság, növekedési modellek (Harrod–Domar, Solow) differenciálegyenletekkel.

### Források (rövidítések)
| Rövidítés | Forrás |
|---|---|
| **CS** | Dr. Csernyák László: *Analízis* (Nemzeti Tankönyvkiadó) – a gerinc; 7 fejezet + pénzügyi függelék |
| **KM** | Kis Márta: *Gazdasági matematika I. – Analízis* – gazdasági alkalmazások, pénzügyi számítások, többváltozós függvények |
| **PT1, PT2** | Nagyné Csóti Beáta: *Matematikai példatár* (MÜTF, 1995), I–II. kötet – Csernyákra épülő feladatok megoldással (I. sorozatok, II. függvények, III. differenciálszámítás, IV. integrálszámítás, V. többváltozós, VI. mátrixok) |
| **MAT1-2 … MAT1-8** | egyetemi óravázlatok: 2. Számsorozatok · 3. Határérték és folytonosság · 4. Differenciálszámítás I. · 6. Alkalmazások · 8. Határozatlan integrál (`resources/vidsmaterials/`) |
| **BME-S** | Czirók Emese: *Sorozatok összefoglalás* (BME Bevezető Matematika) |
| **KR** | Steven Krantz: *Calculus Demystified* |
| **RY** | Mark Ryan: *Calculus for Dummies* (2. kiad.) – szemléletes magyarázatok, „ten things to remember/forget” |
| **AC** | Hughes-Hallett et al.: *Applied Calculus* (5. kiad.) – gazdasági/alkalmazott példák, „Rule of Four” (grafikus, numerikus, algebrai, szöveges) |
| **ADV** | Bachman: *Advanced Calculus Demystified* – többváltozós |
| **DEQ** | Krantz: *Differential Equations Demystified* |
| **J-D1** | saját jegyzet: *Differenciálszámítás I. Bevezetés, deriválási szabályok* |
| **J-D2** | saját jegyzet: *Deriválás jegyzet* |
| **J-T** | saját jegyzet: *Taylor-polinomok* |
| **J-DE** | saját jegyzet: *Differenciálegyenletek – bevezetés* (cukoroldódás) |

---

## A fejezetek áttekintése

| # | Fejezet | Blokk | Szint |
|---|---|---|---|
| 1 | Függvények és modellek | Alapok | ★ |
| 2 | Számsorozatok és sorok | Alapok | ★–★★ |
| 3 | Függvények határértéke és folytonossága | Alapok | ★★ |
| 4 | A derivált | Differenciálszámítás | ★★ |
| 5 | A derivált alkalmazásai: függvényvizsgálat és optimalizálás | Differenciálszámítás | ★★ |
| 6 | Közelítés: L'Hospital, Newton-módszer, Taylor-polinomok | Differenciálszámítás | ★★–★★★ |
| 7 | A határozatlan integrál | Integrálszámítás | ★★ |
| 8 | A határozott integrál és alkalmazásai | Integrálszámítás | ★★ |
| 9 | Többváltozós függvények | Kitekintés | ★★★ |
| 10 | Differenciálegyenletek | Kitekintés | ★★★ |
| 11 | Gazdasági alkalmazások *(opcionális gyűjtőfejezet)* | Kitekintés | ★★ |

A sorrend Csernyák könyvét követi, és megfelel az egyetemi MAT1-kurzus órarendjének. A 2. fejezet (sorozatok) a határérték
fogalmát sorozatokon vezeti be, mielőtt függvényekre térnénk (CS és MAT1 így tanítja; a Dummies/Krantz rögtön függvényekkel kezd –
mi a magyar hagyományt követjük, mert a sorozatos határérték szemléletesebb, és a kamatos kamat/$e$ példa is ide illik).
A 9–11. fejezet kihagyható a többi megértése nélkül.

---

## 1. fejezet – Függvények és modellek ★

**Nagy kérdés:** *Egy függvény egy képlet? Egy grafikon? Egy táblázat? – Mind a négy (a „Rule of Four”).*

**Cél:** a középiskolai függvényismeret felfrissítése az analízis nyelvén; a modellezés szemlélete.

### Felépítés
1. **1.1 Mi az a függvény?** ★ – hozzárendelés, értelmezési tartomány, értékkészlet; négyféle megadás (képlet, grafikon, táblázat, szöveg – AC 1.1);
   jelölések ($f(x)$, $x \mapsto f(x)$, $D_f$, $R_f$). Intervallumjelölések.
2. **1.2 Elemi függvények** ★ – lineáris, hatvány, polinom, racionális tört, exponenciális, logaritmus, trigonometrikus; grafikonjaik és alaptulajdonságaik (CS 2.3, 2.8–2.9; KM 1).
3. **1.3 Függvénytranszformációk** ★ – eltolás, nyújtás, tükrözés: $f(x - a) + b$, $c\,f(kx)$ (CS 2.6).
4. **1.4 Tulajdonságok** ★ – korlátosság, monotonitás, szélsőérték, paritás, periodicitás, zérushely (CS 2.5).
5. **1.5 Műveletek, összetett és inverz függvény** ★–★★ – $f \circ g$, inverz létezése (injektivitás), az inverz grafikonja; $\exp$–$\ln$, $x^2$–$\sqrt x$ (CS 2.7, 2.10).
6. **1.6 Modellezés függvényekkel** ★★ – lineáris vs. exponenciális növekedés („mikor ér utol?”), kereslet–kínálat, költség–bevétel–profit függvények (AC 1; KM 7 előzetes).

### Kidolgozott példák
- Taxiköltség mint lineáris függvény; mobiltarifa mint szakaszonként lineáris (CS 2.4).
- Baktériumtelep (exponenciális) vs. megtakarítás fix befizetéssel (lineáris) – hol metszik egymást?
- Egy racionális törtfüggvény értelmezési tartománya és zérushelyei.
- $\ln$ és $e^x$ inverzek: $e^{\ln x} = x$ – „levetkőztetés”.

### Interaktív szemléltetések
- `function-plotter` – a közös rajzoló bemutatása: írj be egy képletet, nézd a grafikont, kattints egy pontra (érték, zérushely).
- `transform-lab` – csúszkák $a, b, c, k$ az $c\,f(k(x - a)) + b$ transzformációhoz; az eredeti és a transzformált görbe.
- `compose-inverse` – $f \circ g$ és $g \circ f$ összehasonlítása; inverz tükrözése az $y = x$ egyenesre, „vízszintes vonal-teszt”.
- `growth-race` – lineáris, hatvány, exponenciális és logaritmikus növekedés „versenye” log-skálán is.
- `rule-of-four` – ugyanaz a függvény négy nézetben: táblázat, grafikon, képlet, szöveg; bármelyiket módosítva a többi frissül.

### Kvízek
`an1-12`, `an1-13`, `an1-15`, `an1-16`, `an1-final`.

### Csapdák
$\sqrt{x^2} = |x|$, nem $x$ · $\ln(a + b) \ne \ln a + \ln b$ · a $\sin^{-1}$ nem $1/\sin$ · értelmezési tartomány elfelejtése ($\ln$, gyök, nevező).

### Források
CS 1–2, KM 1, AC 1, RY 4–6, KR 1.

---

## 2. fejezet – Számsorozatok és sorok ★–★★

**Nagy kérdés:** *Ha évente nem egyszer, hanem havonta, naponta, másodpercenként írják jóvá a kamatot, végtelen gazdag leszek?* (Nem – de megszületik az $e$.)

### Felépítés
1. **2.1 Sorozat fogalma, megadása** ★ – mint $\mathbb N$-en értelmezett függvény; explicit és rekurzív megadás; számtani és mértani sorozat ismétlése (CS 3.1, BME-S, MAT1-2 – rádium felezési ideje mint motiváció).
2. **2.2 Tulajdonságok** ★ – korlátosság, monotonitás, infimum/szuprémum (CS 3.2, PT1 I.).
3. **2.3 Konvergencia** ★★ – a határérték $\varepsilon$–$N$ definíciója lépésről lépésre („bármely környezetből véges sok tag marad ki”); küszöbindex kiszámolása; a határérték egyértelműsége; konvergens ⇒ korlátos (CS 3.3).
4. **2.4 Műveletek konvergens sorozatokkal** ★★ – összeg, szorzat, hányados határértéke; rendőrelv; monoton és korlátos ⇒ konvergens (CS 3.4).
5. **2.5 Nevezetes határértékek** ★★ – $\frac1n \to 0$, $q^n$, $\sqrt[n]{n} \to 1$, $\sqrt[n]{a} \to 1$, $\left(1 + \frac1n\right)^n \to e$ (bizonyításvázlat: monoton + korlátos), $\frac{n^k}{a^n} \to 0$ – a „növekedési rangsor”.
6. **2.6 Tágabb értelemben vett határérték** ★★ – $\to \pm\infty$, divergens oszcilláló sorozatok; „$\frac{\infty}{\infty}$” típusú racionális kifejezések (CS 3.5).
7. **2.7 Végtelen sorok** ★★–★★★ – részletösszegek, mértani sor összege, harmonikus sor divergenciája (Oresme-féle csoportosítás), konvergenciakritériumok röviden (hányados-, gyökkritérium); Zénón-paradoxon; a $0{,}999\ldots = 1$ (CS 3.6, AC 10).
8. **2.8 Pénzügyi számítások** ★★ – kamatos kamat, folytonos kamatozás és $e$, jelenérték, járadékok, törlesztés mint mértani sor (KM 3, CS F.2).

### Kidolgozott példák
- Küszöbindex: $a_n = \frac{2n + 1}{n + 3}$, $\varepsilon = 0{,}01$ (PT1 I. típusfeladat).
- Rekurzív sorozat: $a_{n+1} = \sqrt{2 + a_n}$ – monoton és korlátos, határértéke 2.
- $(1 + \frac{1}{n})^n$ táblázata $n = 1, 12, 365, 8760, \ldots$ → $e \approx 2{,}71828$.
- 1 millió Ft, 5% kamat: évi/havi/napi/folytonos kamatozás összehasonlítása.
- Lakáshitel törlesztőrészlete mértani sorral.
- Koch-görbe kerülete (divergens) és területe (konvergens).

### Interaktív szemléltetések
- `sequence-plot` – sorozat tagjai pontokként; $\varepsilon$-sáv a határérték körül csúszkával; a program kiszámolja és kiemeli a küszöbindexet.
- `recursive-cobweb` – rekurzív sorozat „pókháló-ábrája” ($a_{n+1} = f(a_n)$): konvergencia, ciklus, káosz (logisztikus leképezés – kitekintés).
- `e-limit` – kamatozási gyakoriság csúszka (évi → folytonos), a tőke értéke és $(1 + 1/n)^n$ közelít $e$-hez.
- `growth-hierarchy` – $\log n, \sqrt n, n, n^2, 2^n, n!$ versenye; melyik „nyer”, mikor előzi meg a másikat.
- `series-sum` – részletösszegek oszlopokként: mértani ($|q| \lt 1$ és $|q| \ge 1$), harmonikus (lassan, de divergál), $\sum 1/n^2 \to \pi^2/6$; Zénón futása animációval.
- `annuity-calc` – hitel/megtakarítás kalkulátor a mértani sor képletével; a törlesztés tőke–kamat felbontása grafikonon.

### Kvízek
`an2-23`, `an2-25`, `an2-27`, `an2-28`, `an2-final`.

### Csapdák
„A sorozat tart 0-hoz, tehát el is éri” · $\frac{\infty}{\infty}$ nem 1 · $\sum a_n$ konvergenciájához $a_n \to 0$ szükséges, de nem elég (harmonikus sor) · $0{,}999\ldots \lt 1$ tévhit.

### Források
CS 3, F.2; KM 2–3; PT1 I.; MAT1-2; BME-S; AC 10; RY 19.

---

## 3. fejezet – Függvények határértéke és folytonossága ★★

**Nagy kérdés:** *Egy hőmérővel mérjük a hőmérsékletet, és a térfogatot számoljuk belőle. Ha a mérés kicsit pontatlan, a számított térfogat is csak kicsit lesz az?* (MAT1-3 motivációja – ez a folytonosság.)

### Felépítés
1. **3.1 A határérték szemléletesen** ★ – $\frac{\sin x}{x}$ és $\frac{x^2 - 1}{x - 1}$ táblázattal és grafikonnal: „lyuk” a görbén; a határérték nem a helyettesítési érték.
2. **3.2 Határérték véges helyen** ★★ – átviteli elv (sorozatokkal) és $\varepsilon$–$\delta$ definíció egymás mellett; egyoldali határértékek; a határérték egyértelmű (CS 4.1, MAT1-3).
3. **3.3 Határérték a végtelenben, tágabb értelemben** ★★ – vízszintes és függőleges aszimptoták; racionális törtfüggvények viselkedése (CS 4.2–4.3, PT1 II.).
4. **3.4 Műveletek, nevezetes határértékek** ★★ – összeg/szorzat/hányados; rendőrelv; $\lim \frac{\sin x}{x} = 1$ (geometriai bizonyítás), $\lim (1 + x)^{1/x} = e$, $\lim \frac{e^x - 1}{x} = 1$, $\lim \frac{\ln(1 + x)}{x} = 1$.
5. **3.5 Folytonosság** ★★ – pontbeli és intervallumon vett folytonosság; szakadás típusai (megszüntethető, ugrás, végtelen); elemi függvények folytonosak (CS 4.4).
6. **3.6 Folytonos függvények tételei** ★★–★★★ – Bolzano (zérushely), Weierstrass (korlátos és zárt intervallumon van max/min), Darboux (köztes érték); alkalmazás: egyenlet megoldhatósága, **intervallumfelezés** (CS 4.6).
7. **3.7 Kitekintés: többváltozós függvények folytonossága** ★★★ – röviden, a 9. fejezetet előkészítve (CS 4.5).

### Kidolgozott példák
- $\lim_{x\to 2}\frac{x^2 - 5x + 6}{x^3 - 2x^2 - x + 2}$ (PT2 84. feladat – szorzattá alakítással, majd a 6. fejezetben L'Hospitallal újra).
- $\lim_{x\to\infty}\frac{3x^2 - 1}{2x^2 + x}$ és $\frac{x}{x^2 + 1}$ – „a legnagyobb hatvány dönt”.
- Szakaszonként definiált függvény: paraméter úgy, hogy folytonos legyen.
- Bolzano: $x^3 - x - 1 = 0$ gyöke az $[1; 2]$-ben; felezéssel 3 tizedesjegyre.
- Az $\frac{1}{x}$ és a $\operatorname{sgn} x$ szakadásai; a Dirichlet-függvény (sehol sem folytonos) – kitekintés.

### Interaktív szemléltetések
- `limit-zoom` – ráközelítés a „lyukra”: $x$ csúszka közelít $a$-hoz két oldalról, $f(x)$ értéke kiírva; táblázat generálása.
- `epsilon-delta` – $\varepsilon$ csúszka → a program megkeresi a legnagyobb jó $\delta$-t, színes sávokkal; „játék a gonosz ellenféllel”.
- `asymptote-explorer` – racionális törtfüggvény szerkesztő (számláló, nevező fokszáma és együtthatói) → aszimptoták, viselkedés $\pm\infty$-ben.
- `sinx-over-x` – a geometriai bizonyítás ábrája (háromszög – körcikk – háromszög) mozgatható szöggel.
- `continuity-types` – szakadástípusok galériája, a tanuló besorolja (játék).
- `bisection` – intervallumfelezés animációja Bolzano tételéhez; iterációk táblázata.

### Kvízek
`an3-32`, `an3-33`, `an3-34`, `an3-35`, `an3-36`, `an3-final`.

### Csapdák
A határérték létezéséhez nem kell, hogy $f(a)$ létezzen · $\lim_{x\to 0} \frac1x$ nem létezik (a kétoldali határérték eltér) · folytonos ≠ differenciálható (előre utalás: $|x|$).

### Források
CS 4; PT1 II.; MAT1-3; KR 2.1–2.3; RY 7–8.

---

## 4. fejezet – A derivált ★★

**Nagy kérdés:** *A sebességmérő egy pillanatban mutat egy számot – de a sebesség „út osztva idővel”. Milyen út és milyen idő egyetlen pillanatban?*

### Felépítés
1. **4.1 Átlagos és pillanatnyi változás** ★ – átlagsebesség, szelő meredeksége; a $\frac{0}{0}$ probléma és a határátmenet (J-D1, MAT1-4).
2. **4.2 A derivált definíciója** ★★ – differenciahányados, $f'(a) = \lim_{x\to a}\frac{f(x) - f(a)}{x - a} = \lim_{h\to0}\frac{f(a+h) - f(a)}{h}$; érintő egyenlete; bal- és jobboldali derivált; differenciálható ⇒ folytonos, de nem fordítva ($|x|$) (CS 5.1, 5.3; J-D2).
3. **4.3 Elemi függvények deriváltja definícióból** ★★ – $c$, $x$, $x^2$, $x^n$, $\frac1x$, $\sqrt x$, $\sin$, $e^x$, $\ln x$ – a táblázat születése (CS 5.2, 5.5).
4. **4.4 Deriválási szabályok** ★★ – összeg, konstansszoros, **szorzat (Leibniz)**, hányados, **láncszabály**, inverz függvény deriváltja – mindegyik bizonyítással vagy vázlattal; a Leibniz-jelölés ($\frac{dy}{dx} = \frac{dy}{du}\frac{du}{dx}$) (CS 5.4; J-D1).
5. **4.5 Deriválási gyakorlat** ★★ – összetett kifejezések lépésről lépésre; logaritmikus deriválás ($x^x$); implicit deriválás röviden (kör érintője).
6. **4.6 Magasabb rendű deriváltak** ★★ – $f''$, $f^{(n)}$; gyorsulás; $e^x$ és $\sin x$ deriváltjainak ciklusa (CS 5.6).
7. **4.7 A derivált mint változási sebesség** ★★ – fizikai, biológiai és gazdasági olvasat: határköltség, határbevétel (előzetes a 11. fejezethez); mértékegységek (AC 2, KR 2.6).
8. **4.8 Lineáris közelítés és differenciál** ★★★ – $f(a + h) \approx f(a) + f'(a)h$; hibabecslés; $dy = f'(x)\,dx$ (a Taylor-polinom előzetese).

### Kidolgozott példák
- $s(t) = 5t^2$ szabadesés: átlagsebesség az $[1; 1{,}1]$, $[1; 1{,}01]$ … intervallumon → $10$ m/s pillanatnyi sebesség.
- $f(x) = x^2$ deriváltja definícióból, aztán $x^3$ – a binomiális tétel szerepe.
- $|x|$ a 0-ban: bal- és jobboldali derivált $-1$ és $1$.
- Deriválási gyakorlatok a PT2 III. fejezetéből (racionális, exponenciális-logaritmikus, trigonometrikus kompozíciók).
- Érintő egyenlete adott pontban (CS 8 / KM 8); hol vízszintes az érintő?
- $\sqrt{4{,}1}$ közelítése lineárisan.

### Interaktív szemléltetések
- `secant-to-tangent` – a központi widget: $a$ rögzített, $x$ csúszka közelít; a szelő átmegy érintőbe, a meredekség kiírva; bármely beírt függvénnyel.
- `derivative-sketcher` – rajzold meg $f'$ grafikonját egérrel $f$ alapján, a program összeveti a valódival (pontszám).
- `derivative-machine` – „deriválógép”: beírt kifejezés szimbolikus deriváltja lépésenként (melyik szabályt alkalmazta), KaTeX-ben.
- `chain-rule-gears` – fogaskerék-metafora: $u = g(x)$ és $y = f(u)$ áttételei szorzódnak; csúszkával $x$ mozog, $u$ és $y$ sebessége kiírva.
- `tangent-line` – érintő egyenlete bármely pontban, a pont húzható; az érintő mint lineáris közelítés hibája zoommal.
- `differentiable-or-not` – galéria: $|x|$, $\sqrt[3]{x}$, $x\sin(1/x)$, lépcső – deriválható-e a 0-ban? Ráközelítés: a differenciálhatóság = „zoomolva egyenes”.

### Kvízek
`an4-42`, `an4-43`, `an4-44`, `an4-46`, `an4-47`, `an4-final`.

### Csapdák
$(fg)' \ne f'g'$ · $(e^{2x})' = 2e^{2x}$, nem $e^{2x}$ · $(x^x)'$ nem $x\cdot x^{x-1}$ · $\frac{d}{dx}\sin(x^2) \ne \cos(x^2)$ · a derivált a meredekség, nem a függvényérték.

### Források
CS 5.1–5.6; PT2 III.; MAT1-4; J-D1, J-D2; KM 5, 8; KR 2.4–2.6, 3; RY 9–10; AC 2–3.

---

## 5. fejezet – A derivált alkalmazásai: függvényvizsgálat és optimalizálás ★★

**Nagy kérdés:** *Mekkora dobozt lehet hajtogatni egy A4-es lapból? Mennyit termeljen a gyár, hogy a profit maximális legyen? – Ahol az érintő vízszintes.*

### Felépítés
1. **5.1 Középértéktételek** ★★–★★★ – Rolle, Lagrange (szemléletesen: „valahol pont az átlagsebességgel mentél”), Cauchy röviden; következmény: $f' = 0$ ⇒ konstans, $f' \gt 0$ ⇒ növekvő (CS 6.1).
2. **5.2 Monotonitás és lokális szélsőérték** ★★ – elsőrendű feltétel ($f' = 0$ szükséges, nem elégséges: $x^3$); előjelváltás-teszt; másodrendű feltétel ($f'' \gtrless 0$) (CS 6.2, MAT1-6).
3. **5.3 Konvexitás, inflexió** ★★ – $f''$ előjele; inflexiós pont; a „görbe alakja” táblázat (CS 6.3).
4. **5.4 Teljes függvényvizsgálat** ★★ – a recept: $D_f$, paritás, zérushelyek, határértékek/aszimptoták, $f'$-táblázat, $f''$-táblázat, grafikon; PT2 98–101. mintájára (CS 6.4).
5. **5.5 Abszolút szélsőérték zárt intervallumon** ★★ – Weierstrass + kritikus pontok + végpontok.
6. **5.6 Optimalizálási (szöveges) feladatok** ★★ – a módszer: ábra → változó → célfüggvény → kényszer behelyettesítése → szélsőérték → ellenőrzés; doboz, kerítés, konzervdoboz, legrövidebb út (Snellius), profitmaximum (CS 6.5, RY 12, AC 4).
7. **5.7 Kapcsolt változási sebességek** ★★★ – létra csúszik, léggömb fújódik: $\frac{dV}{dt} = \frac{dV}{dr}\frac{dr}{dt}$ (RY 13).

### Kidolgozott példák
- PT2 98.: $f(x) = 3x - x^3$ teljes vizsgálata táblázattal; 99.: $(x+1)(x-2)^2$; 100.: $x^2(\sqrt2 - x)(\sqrt2 + x)$ – páros függvény.
- Nyitott doboz 20×20 cm-es lapból – a kivágott négyzet oldala.
- Henger alakú konzervdoboz minimális felülettel adott térfogathoz ($h = 2r$).
- Profit: $P(x) = R(x) - C(x)$, $P' = 0 \iff R' = C'$ (határbevétel = határköltség).
- Lagrange-tétel: 2 óra alatt 180 km → valamikor pont 90 km/h-val ment (traffipax-érv).

### Interaktív szemléltetések
- `mvt-explorer` – Lagrange-tétel: húzd az intervallum végpontjait, a program megkeresi a $\xi$-t, ahol az érintő párhuzamos a szelővel.
- `sign-table-builder` – a tanuló beír egy függvényt; a program kiszámolja $f'$, $f''$ zérushelyeit, és **interaktívan tölteti ki** az előjeltáblázatot (ellenőrzéssel), majd rajzolja a grafikont.
- `curve-shape` – $f$, $f'$, $f''$ egymás alatt, összekötött kurzorral: ahol $f'$ nulla, $f$-nek szélsőértéke; ahol $f''$ nulla, inflexió.
- `box-optimizer` – A4-es lap sarkainak kivágása csúszkával, 3D-s doboz rajza, térfogat-görbe, az optimum kiemelve.
- `can-optimizer` – konzervdoboz $r$–$h$ csúszka adott térfogatnál, felület görbéje.
- `profit-max` – költség- és bevételfüggvény szerkesztése, $R'$ és $C'$ metszéspontja.
- `related-rates` – csúszó létra animáció: a felső vég sebessége a magasság függvényében.

### Kvízek
`an5-52`, `an5-53`, `an5-54`, `an5-56`, `an5-final`.

### Csapdák
$f'(a) = 0$ nem jelent szélsőértéket ($x^3$) · lokális ≠ abszolút szélsőérték · inflexió nem ott, ahol $f'' = 0$, hanem ahol előjelet vált ($x^4$) · az optimalizálásnál a végpontok ellenőrzése.

### Források
CS 6.1–6.5; PT2 III. (98–101 és környéke); MAT1-6; KM 6–7; RY 11–13; AC 4; KR 3.

---

## 6. fejezet – Közelítés: L'Hospital, Newton-módszer, Taylor-polinomok ★★–★★★

**Nagy kérdés:** *Hogyan számolja ki a számológép a $\sin 2$-t vagy az $e$-t, ha csak összeadni és szorozni tud?*

### Felépítés
1. **6.1 L'Hospital-szabály** ★★ – $\frac00$ és $\frac\infty\infty$; bizonyításvázlat Cauchy-tétellel; az egyéb határozatlan alakok ($0\cdot\infty$, $\infty - \infty$, $1^\infty$, $0^0$) átalakítása; PT2 84–91 (KR 5.1–5.2, CS 6 kieg.).
2. **6.2 Egyenletek megoldása iterációval: Newton-módszer** ★★ – az érintő gyökével lépünk tovább; kvadratikus konvergencia; mikor romlik el (CS 5.7).
3. **6.3 A Taylor-polinom** ★★ – a lineáris közelítés folytatása: illesszünk polinomot, amelynek deriváltjai $a$-ban megegyeznek $f$-ével; a képlet levezetése; MacLaurin-polinom (J-T, CS 5.10).
4. **6.4 Nevezetes sorok** ★★ – $e^x$, $\sin x$, $\cos x$, $\ln(1 + x)$, $\frac{1}{1 - x}$, $(1 + x)^\alpha$; konvergenciasugár szemléletesen ($\ln$ csak $(-1; 1]$-en).
5. **6.5 Hibabecslés – a Lagrange-féle maradéktag** ★★★ – $R_n = f^{(n+1)}(\xi)\frac{(x - a)^{n+1}}{(n+1)!}$; a fokszám megválasztása előírt hibához; $e$ öt tizedesjegyre (J-T példája).
6. **6.6 Kitekintés: Euler-formula** ★★★ – $e^{ix} = \cos x + i\sin x$ a sorokból; $e^{i\pi} + 1 = 0$.

### Kidolgozott példák
- PT2 86–91.: $\lim \frac{e^x - e^{-x}}{x}$, $\lim x\ln x$, $\lim xe^{-x}$, $\lim x^2e^{1/x^2}$, $\lim\left(\frac{1}{\ln x} - \frac{1}{x - 1}\right)$.
- Newton-módszer $\sqrt2$-re ($x^2 - 2 = 0$): 1,5 → 1,41667 → 1,41422 → …; a babiloni módszer.
- J-T példája: $e^x$ 5-ödfokú MacLaurin-polinomja, $e \approx 2{,}7167$, hiba $\le 4/720$.
- $\sin 2$ Taylor-polinommal 4 tizedesjegyre – hány tag kell?
- $\sqrt{1 + x}$ elsőfokú közelítése és a fizikában használt $\sqrt{1 + x} \approx 1 + x/2$.

### Interaktív szemléltetések
- `lhopital-view` – számláló és nevező külön görbéken; ráközelítve mindkettő „egyenes”, a meredekségek aránya adja a határértéket.
- `newton-iteration` – animált érintők; kezdőérték húzható; konvergencia-táblázat; példák, ahol ciklusba kerül vagy elszáll.
- `taylor-slider` – a központi widget: fokszám csúszka 0-tól 15-ig, az $a$ középpont húzható; a polinom „rásimul” a függvényre; $\ln(1 + x)$-nél látszik a konvergenciasugár fala.
- `taylor-table` – a J-T jegyzet táblázata interaktívan: deriváltak, $a$-beli értékek, tagok.
- `remainder-bound` – előírt hiba → szükséges fokszám; a valódi hiba vs. a Lagrange-korlát grafikonon.
- `euler-formula` – egységkör, $e^{i\theta}$ pontja, a sorok első $n$ tagjának összege a komplex síkon spirálként.

### Kvízek
`an6-61`, `an6-62`, `an6-63`, `an6-65`, `an6-final`.

### Csapdák
L'Hospital csak $\frac00$ / $\frac\infty\infty$ alakra · nem a hányados deriváltját vesszük, hanem a deriváltak hányadosát · a Taylor-polinom az $a$-tól távolodva romlik · $\ln(1+x)$ sora $x = 2$-ben nem konvergál.

### Források
CS 5.7, 5.10; PT2 III. (84–91); J-T; KR 5; RY 19; AC (Taylor-függelék).

---

## 7. fejezet – A határozatlan integrál ★★

**Nagy kérdés:** *Ismerjük a sebességet minden pillanatban – vissza tudjuk számolni a megtett utat? A deriválás „visszafelé”.*

### Felépítés
1. **7.1 Primitív függvény** ★ – definíció ($F' = f$), a $+C$ és miért kell (a primitív függvények egy konstansban különböznek – a Lagrange-tétel következménye); kezdeti feltétel (MAT1-8, CS 7.1).
2. **7.2 Alapintegrálok** ★★ – a deriválási táblázat megfordítva; $\int x^n$, $\int \frac1x = \ln|x|$, $\int e^x$, $\int \sin, \cos$, $\int \frac{1}{1 + x^2}$ (CS 7.2).
3. **7.3 Integrálási szabályok** ★★ – linearitás; $\int f(ax + b)$; $\int f^\alpha f'$ és $\int \frac{f'}{f} = \ln|f|$ – „felismerős” integrálás (CS 7.3).
4. **7.4 Parciális integrálás** ★★ – a szorzatszabály megfordítása; $\int xe^x$, $\int x\sin x$, $\int \ln x$ (trükk: $1\cdot\ln x$), $\int e^x\sin x$ (kétszer, majd egyenlet) (KR 7.1).
5. **7.5 Helyettesítéses integrálás** ★★ – a láncszabály megfordítása, a $dx$ átírása; $\int x\sqrt{x^2 + 1}$, $\int \frac{1}{\sqrt{1 - x^2}}$ trigonometrikus helyettesítéssel (KR 7.3).
6. **7.6 Racionális törtfüggvények** ★★★ – parciális törtekre bontás (KR 7.2).
7. **7.7 Mit nem lehet?** ★★★ – $\int e^{-x^2}$, $\int \frac{\sin x}{x}$ nem elemi – ezért kell a $\Phi$-táblázat a valószínűségszámításban (visszautalás 4. fejezet).

### Kidolgozott példák
- Sebességből út: $v(t) = 3t^2$, $s(0) = 2$ → $s(t) = t^3 + 2$.
- PT2 IV. alapintegrálok és „felismerős” típusok ($\int \frac{2x}{x^2 + 1}$, $\int \sin^3 x\cos x$).
- $\int \ln x\,dx = x\ln x - x + C$ parciálisan.
- $\int \frac{1}{x^2 - 1}$ parciális törtekkel.
- Ellenőrzés deriválással – mindig!

### Interaktív szemléltetések
- `antiderivative-family` – $f$ grafikonja fent, lent a primitív függvények serege ($C$ csúszka); kattints egy pontra: melyik $C$ megy át rajta.
- `integral-machine` – lépésenkénti szimbolikus integrálás egyszerű típusokra (alapintegrál, $f(ax+b)$, $f'/f$), a felismert szabály megnevezésével; ellenőrzés deriválással.
- `parts-chooser` – parciális integrálásnál mi legyen $u$ és mi $v'$? A tanuló választ, a program mutatja, egyszerűsödik-e (LIATE-szabály).
- `substitution-view` – helyettesítés mint koordinátanyújtás: $u = g(x)$ átskálázza a tengelyt, a terület változatlan.
- `integration-cards` – párosítós játék: integrál ↔ módszer ↔ eredmény.

### Kvízek
`an7-72`, `an7-73`, `an7-74`, `an7-75`, `an7-final`.

### Csapdák
A $+C$ elfelejtése · $\int \frac1x = \ln|x|$ (abszolút érték!) · $\int f\cdot g \ne \int f\cdot\int g$ · parciális integrálásnál a rossz választás körbe-körbe visz.

### Források
CS 7.1–7.3; PT2 IV.; MAT1-8; KR 4.1, 4.5, 7; RY 15–16.

---

## 8. fejezet – A határozott integrál és alkalmazásai ★★

**Nagy kérdés:** *Hogyan mérjük meg egy görbe vonalú telek területét? – Szeleteljük fel keskeny téglalapokra, és adjuk össze. Aztán vegyük a határértéket.*

### Felépítés
1. **8.1 A terület problémája, Riemann-összegek** ★ – alsó és felső összegek, finomodó felosztás; Arkhimédész parabolaszelete (történeti doboz) (CS 7.4, RY 14).
2. **8.2 A határozott integrál definíciója és tulajdonságai** ★★ – $\int_a^b f$; előjeles terület; additivitás, linearitás, monotonitás, $\int_a^a = 0$, $\int_b^a = -\int_a^b$; folytonos függvény integrálható (CS 7.6).
3. **8.3 A Newton–Leibniz-tétel** ★★ – az integrálfüggvény deriváltja $f$ (bizonyításvázlat); $\int_a^b f = F(b) - F(a)$ – „az analízis alaptétele”: a két nagy fogalom találkozása (CS 7.7).
4. **8.4 Területszámítás** ★★ – görbe alatti terület, két görbe közötti terület, tengelymetszések kezelése (CS 7.8).
5. **8.5 Térfogat, ívhossz, átlagérték** ★★ – forgástestek térfogata (szeletelés), függvény átlagértéke (az integrál-középértéktétel), ívhossz röviden (CS 7.10, KR 8).
6. **8.6 Improprius integrál** ★★★ – végtelen intervallum ($\int_1^\infty \frac{1}{x^p}$), nem korlátos integrandus; Gabriel kürtje (véges térfogat, végtelen felszín); $\int_{-\infty}^\infty e^{-x^2} = \sqrt\pi$ (CS 7.9, KR 5.3–5.4).
7. **8.7 Numerikus integrálás** ★★ – téglalap-, trapéz-, Simpson-szabály; hibák összevetése (CS 7.5).
8. **8.8 Integrál a valószínűségszámításban és a közgazdaságtanban** ★★ – sűrűségfüggvény, $\int f = 1$, várható érték; fogyasztói és termelői többlet, jelenérték folytonos pénzáramra (AC 5–7, KM 10).

### Kidolgozott példák
- $\int_0^1 x^2\,dx$ Riemann-összegekkel ($n = 4, 10, 100$) és Newton–Leibnizcel: $\frac13$.
- Két parabola közötti terület; $\sin x$ a $[0; 2\pi]$-n: előjeles terület 0, geometriai 4.
- Kúp és gömb térfogata forgástestként – a képletek „levezetése”.
- $\int_1^\infty \frac{1}{x}$ divergál, $\int_1^\infty \frac{1}{x^2} = 1$.
- Exponenciális eloszlás várható értéke integrállal (visszautalás valszám 4.3.2).
- Trapéz- és Simpson-szabály $\int_0^1 e^{-x^2}$-re.

### Interaktív szemléltetések
- `riemann-sums` – a központi widget: $n$ csúszka, bal/jobb/közép/alsó/felső összeg kapcsoló, a téglalapok és az összeg kiírva; bármely beírt függvény.
- `ftc-explorer` – az integrálfüggvény $F(x) = \int_a^x f$ „épül” ahogy $x$-et húzzuk; alatta $F'$ összehasonlítva $f$-fel – az alaptétel látványa.
- `area-between` – két szerkeszthető görbe, metszéspontok, a közöttük lévő terület.
- `solid-of-revolution` – forgástest 3D-s drótváz-rajza (canvas), szeletek száma csúszkával.
- `improper-integral` – a felső határ csúszkával $\to \infty$, a részletterület görbéje; $1/x$ vs. $1/x^2$; Gabriel kürtje.
- `numeric-integration` – téglalap / trapéz / Simpson egymás mellett, hiba az $n$ függvényében log-log skálán.
- `consumer-surplus` – kereslet–kínálat görbék, egyensúlyi ár, a többletek területként.

### Kvízek
`an8-81`, `an8-83`, `an8-84`, `an8-85`, `an8-86`, `an8-final`.

### Csapdák
Előjeles vs. geometriai terület · a Newton–Leibniz-tétel feltétele a folytonosság ($\int_{-1}^1 \frac{1}{x^2}$ „= −2”?!) · $\int_a^b$ és $\int$ összekeverése (szám vs. függvénycsalád) · az improprius integrál határérték, nem helyettesítés.

### Források
CS 7.4–7.11; PT2 IV.; KM 10; KR 4, 5.3–5.4, 8; RY 14, 17–18; AC 5–7.

---

## 9. fejezet – Többváltozós függvények ★★★

**Nagy kérdés:** *Egy termék ára az anyagköltségtől ÉS a bértől függ. Melyik változtatása „fáj” jobban? – Parciális deriváltak.*

### Felépítés
1. **9.1 Kétváltozós függvények** ★★ – felület, szintvonalak (térkép!), $D_f \subseteq \mathbb R^2$ (CS 2.11, ADV 1).
2. **9.2 Parciális deriváltak** ★★ – a többi változó rögzítve; geometriai jelentés (metszetgörbe érintője); másodrendű parciálisok, Young-tétel (CS 5.8–5.9, ADV 3).
3. **9.3 Gradiens és iránymenti derivált** ★★★ – a legmeredekebb emelkedés iránya; érintősík; teljes differenciál és hibaterjedés (ADV 7.3).
4. **9.4 Szélsőérték** ★★★ – stacionárius pontok, Hesse-mátrix / $D = f_{xx}f_{yy} - f_{xy}^2$ teszt; nyeregpont (CS 6.6, ADV 7.4).
5. **9.5 Feltételes szélsőérték – Lagrange-multiplikátor** ★★★ – adott költségvetés mellett maximális haszon (KM 9, ADV 7.6).
6. **9.6 A legkisebb négyzetek módszere** ★★★ – egyenes illesztése pontfelhőre mint kétváltozós minimumfeladat; a normálegyenletek → **a statisztika regressziójának levezetése** (CS 6.7).
7. **9.7 Kettős integrál** ★★★ – téglalapon, normáltartományon; térfogat; röviden (CS 7.11, ADV 4).

### Kidolgozott példák
- $f(x, y) = x^2 + y^2$ és $x^2 - y^2$ (nyereg) szintvonalai és parciálisai.
- Cobb–Douglas termelési függvény $Q = AK^\alpha L^\beta$: határtermékek, homogenitás (KM 9).
- Szélsőérték: $f = x^3 - 3x + y^2$; PT2 V. feladatai.
- Lagrange: téglalap maximális területe adott kerülettel; hasznosságmaximalizálás $U = xy$, $p_xx + p_yy = M$.
- Legkisebb négyzetek 5 pontra kézzel és a képlettel.

### Interaktív szemléltetések
- `surface-3d` – forgatható felület (canvas, egyszerű vetítés) és alatta a szintvonalas térkép, összekötve.
- `partial-slice` – a felület $x = $ const és $y = $ const metszete; az érintők meredeksége = parciális deriváltak.
- `gradient-field` – szintvonalak + gradiensnyilak; kattintásra iránymenti derivált tetszőleges irányban.
- `saddle-test` – stacionárius pontok osztályozása a $D$-teszttel; a tanuló tippel (min/max/nyereg), a program ellenőriz.
- `lagrange-view` – kényszergörbe és a célfüggvény szintvonalai; az érintési pontban a gradiensek párhuzamosak.
- `least-squares` – húzható pontok, az illesztett egyenes élőben, a négyzetes hibák mint négyzetek (a statisztika 11. fejezet `least-squares` widgetjével közös).

### Kvízek
`an9-92`, `an9-94`, `an9-95`, `an9-96`, `an9-final`.

### Források
CS 2.11, 4.5, 5.8–5.9, 6.6–6.7, 7.11; PT2 V.; KM 9; ADV 1–4, 7; AC 8.

---

## 10. fejezet – Differenciálegyenletek ★★★

**Nagy kérdés:** *100 g cukrot vízbe szórunk; az oldódás sebessége arányos a még fel nem oldott cukorral. Mennyi oldódott fel 5 perc múlva?* (J-DE bevezető feladata.)

### Felépítés
1. **10.1 Mi a differenciálegyenlet?** ★★ – ismeretlen függvény és deriváltjai; rend; általános és partikuláris megoldás; kezdetiérték-feladat; megoldás ellenőrzése behelyettesítéssel (J-DE, CS 7.12, DEQ 1.1–1.2).
2. **10.2 Iránymező és kvalitatív kép** ★★ – meredekségmezőn „látszik” a megoldássereg; egyensúlyi megoldások, stabilitás (AC 9).
3. **10.3 Szétválasztható változójú egyenletek** ★★ – a módszer és a mögötte lévő helyettesítés; $y' = ky$ (exponenciális növekedés/bomlás, felezési idő – visszautalás a 2. fejezet rádiumára), korlátos növekedés $y' = k(M - y)$ (cukor, Newton-féle lehűlés), logisztikus egyenlet (DEQ 1.3).
4. **10.4 Elsőrendű lineáris egyenletek** ★★★ – integráló tényező; $y' + p(x)y = q(x)$; alkalmazás: RC-áramkör, keveredési feladatok (DEQ 1.4, 1.8).
5. **10.5 Másodrendű lineáris, állandó együtthatós egyenletek** ★★★ – karakterisztikus egyenlet; harmonikus rezgés, csillapítás; rezonancia röviden (DEQ 2).
6. **10.6 Numerikus megoldás: Euler-módszer** ★★ – lépésköz és hiba; a „szimulációs” szemlélet (kapcsolat az ágensalapú modellezéssel).
7. **10.7 Gazdasági modellek** ★★★ – Harrod–Domar és Solow növekedési modell mint differenciálegyenlet; Malthus; piaci áralkalmazkodás $\dot p = k(D - S)$ (kapcsolat a Közgazdaságtan témakörrel).

### Kidolgozott példák
- J-DE: $y' = k(100 - y)$, $y(0) = 0$ → $y = 100(1 - e^{-kt})$; számpélda $k$ adott értékével.
- Radioaktív bomlás: felezési időből $k$; C-14 kormeghatározás.
- Newton-féle lehűlés: mikor halt meg az áldozat? (krimi-példa).
- Logisztikus növekedés: $y' = ry(1 - y/K)$ megoldása és S-görbéje; járványmodell egyszerűen.
- Rugó: $y'' + \omega^2 y = 0$ → $A\cos\omega t + B\sin\omega t$.
- Euler-módszer kézzel 4 lépésben $y' = y$, $y(0) = 1$-re; összevetés $e$-vel.

### Interaktív szemléltetések
- `slope-field` – iránymező bármely beírt $y' = f(x, y)$-ra; kattintásra megoldásgörbe indul a pontból.
- `sugar-dissolve` – a cukros feladat: $k$ csúszka, animált oldódás és a görbe.
- `growth-models` – exponenciális, korlátos és logisztikus növekedés egymás mellett, paraméterekkel; egyensúlyi pontok.
- `euler-steps` – Euler-módszer lépésköz csúszkával, a pontos megoldás mellett; hiba az $h$ függvényében.
- `spring-oscillator` – rugó–tömeg animáció, csillapítás és gerjesztés csúszkával, a megoldás grafikonja; rezonancia.
- `solow-model` – tőke/fő dinamikája, megtakarítási ráta és népességnövekedés csúszkákkal; a steady state.

### Kvízek
`an10-101`, `an10-103`, `an10-104`, `an10-106`, `an10-final`.

### Források
CS 7.12; J-DE; DEQ 1–2; AC 9; (Közgazdaságtan jegyzetek: Harrod–Domar).

---

## 11. fejezet – Gazdasági alkalmazások ★★ *(opcionális gyűjtőfejezet)*

**Nagy kérdés:** *Mit jelent a közgazdász „határ-” előtagja (határköltség, határhaszon)? – Deriváltat.*

Ez a fejezet a 4–8. fejezetben szétszórt gazdasági példákat gyűjti egy helyre, és kiegészíti a KM 7. fejezetének anyagával.
Kidolgozható a többi fejezet után, vagy beolvasztható azokba.

### Felépítés
1. **11.1 Határelemzés** ★★ – határköltség, határbevétel, határhaszon mint derivált; a „következő egység” közelítés; átlagköltség minimuma ott, ahol egyenlő a határköltséggel (KM 7.1, AC 4).
2. **11.2 Rugalmasság** ★★ – $\varepsilon = \frac{dQ}{dP}\frac{P}{Q}$; rugalmas/rugalmatlan szakaszok; bevétel és rugalmasság kapcsolata; logaritmikus derivált (KM 7.2).
3. **11.3 Profitmaximalizálás** ★★ – $MR = MC$; monopólium vs. versenypiac.
4. **11.4 Pénzügyi számítások integrállal** ★★ – folytonos pénzáram jelenértéke, folytonos kamatozás, Gini-index mint terület (Lorenz-görbe) (AC 6, CS F.2).
5. **11.5 Készletmodell (EOQ)** ★★ – optimális rendelési tételnagyság mint szélsőérték-feladat.

### Interaktív szemléltetések
- `marginal-cost` – költségfüggvény és határköltség; az „egy egységgel több” téglalap vs. az érintő.
- `elasticity-slider` – keresleti görbe, a rugalmasság változása a görbe mentén, a bevétel maximuma.
- `lorenz-gini` – húzható Lorenz-görbe, a Gini-index területként.
- `eoq` – készletszint fűrészfog-ábrája, költséggörbék, optimum.

### Kvízek
`an11-111`, `an11-112`, `an11-114`, `an11-final`.

### Források
KM 3, 7; CS 6.5, F.2; AC 1–6.

---

## Közös komponensek (elsőként kidolgozandók)

| Komponens | Tartalom | Használja |
|---|---|---|
| `assets/calc.js` | kifejezés-értelmező; numerikus derivált/integrál; gyökkeresés; egyszerű szimbolikus deriválás és KaTeX-kimenet; `plot` rajzoló (görbe, pont, szelő, érintő, satírozás, zoom) | 1–11. fejezet |
| `function-plotter` widget | a rajzoló önálló bemutatása, saját képlettel | 1. fejezet, és minden fejezet „saját függvénnyel” módja |
| `derivative-machine` / `integral-machine` | lépésenkénti szimbolikus számolás | 4., 7. fejezet |
| táblázatos előjelvizsgálat (`sign-table-builder`) | a példatár 98–101. feladatainak formátuma | 5. fejezet |

## Javasolt kidolgozási sorrend
1. `assets/calc.js` + `function-plotter`
2. 4. fejezet (derivált) – a legjobban kidolgozott források (három saját jegyzet, MAT1-4) és a legtöbb szemléltetési lehetőség
3. 5. és 6. fejezet (alkalmazások, Taylor – a J-T jegyzet kész anyag)
4. 3. fejezet (határérték), majd 2. (sorozatok) – visszamenőleg pótolva az alapokat; az 1. fejezet utoljára az alapblokkból (ismétlés)
5. 7–8. fejezet (integrál) – a valószínűségszámítás 3–4. fejezetével összekötve
6. 10. fejezet (differenciálegyenletek – a J-DE jegyzet és a közgazdasági modellek miatt érdekes)
7. 9. és 11. fejezet (opcionálisak)

*(Alternatíva: szigorúan 1→11 sorrendben. A fenti sorrend előnye, hogy a legérdekesebb, legjobban dokumentált rész készül el először.)*
