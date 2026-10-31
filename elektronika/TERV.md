# Elektromosságtan és digitális elektronika – fejezettervezet

Ez a dokumentum az *Elektromosságtan és digitális elektronika* témakör fejezeteinek **kidolgozási terve**, az Analízis, a
Mesterséges intelligencia és a Gráfelmélet tervének (`analizis/TERV.md`, `mesterseges-intelligencia/TERV.md`,
`grafelmelet-halozattudomany/TERV.md`) mintájára. Minden fejezethez megadja a felépítést, a kidolgozott példákat, a
**laborgyakorlatokat** (a meglévő Arduino-kittel és multiméterrel), az interaktív szemléltetéseket, a kvízeket, a csapdákat
és a forrásokat. A kidolgozáskor ebből indulunk ki; a terv menet közben finomítható.

**A témakör íve:** teljesen az alapoktól – *mi az elektromos töltés?* – jutunk el addig, hogy megértsük, mi történik egy
mikrovezérlő belsejében. Öt blokk:

1. **Fizikai alapok** – töltés, mező, feszültség, áram, ellenállás, teljesítmény. Itt még alig építünk, inkább mérünk.
2. **Áramkörök** – soros és párhuzamos kapcsolás, Kirchhoff-törvények, feszültségosztó és érzékelők, kondenzátor és
   RC-kör, mágnesség és induktivitás, váltakozó áram.
3. **Félvezetők** – dióda, LED, tranzisztor mint kapcsoló (és röviden mint erősítő).
4. **Digitális logika** – logikai szintek, kapuk és Boole-algebra, kombinációs hálózatok, számrendszerek és összeadó,
   tárolók és flip-flopok, számlálók és léptetőregiszterek, oszcillátorok.
5. **A mikrovezérlő és a valós világ** – A/D és D/A átalakítás, PWM, soros kommunikáció, az ATmega2560 belülről,
   záróprojekt.

A témakör **sajátossága** a többihez képest: minden fejezetben van **kézzelfogható labor**. A szimuláció és a valódi mérés
egymás mellett jelenik meg: előbb kiszámoljuk, aztán a szimulátorban megnézzük, végül megépítjük és megmérjük – és ha a
három nem egyezik, abból tanulunk a legtöbbet.

---

## 0. Általános szerkesztési elvek

### Stílus
- **A `CLAUDE.md` sémája az irányadó:** motiváló kérdés → útiterv → lépések az egyszerűtől a bonyolultig (kis, kézzel
  végigszámolható eset → szabály „miért?”-tel → 2–3 egylépéses kidolgozott példa → buktató → csukott gyakorló blokk) →
  alkalmazás → összefoglalás + döntési táblázat → kvíz.
- **Jósolj – szimulálj – mérj.** Ez a témakör alapritmusa. Minden új összefüggést (1) kézzel kiszámolunk, (2) a
  szimulátorban kipróbálunk, (3) a breadboardon megmérünk. A labor végén mindig ott a kérdés: *mennyire egyezett, és miért
  nem pontosan?* (tűrés, belső ellenállás, a műszer terhelése, hőmérséklet).
- **Előbb a jelenség, aztán a képlet.** Az elektromosság láthatatlan, ezért minden fogalom egy **látható modellel** indul
  (vízmodell, magasság–gravitáció analógia, töltésrészecskék animációja), és csak utána jön a képlet. Az analógiák
  korlátait mindig kimondjuk (`box warn`: „hol sántít a vízmodell?”).
- **Lépcsőzetes nehézség.** ★ alap · ★★ közép · ★★★ haladó / kitekintés. Az ★★★ szakaszok kihagyhatók; a laborok
  többsége ★ vagy ★★.
- **Matematika csak annyi, amennyi kell.** Az I–II. blokk középiskolai algebrával érthető (egyenletrendezés, arányosság,
  normálalak). Ahol differenciálegyenlet vagy komplex szám jön (RC-kör, impedancia), az ★★★-os, és az Analízis
  megfelelő fejezetére mutat („🔁 Kapcsolat: Analízis 10.”). A szemléletes, numerikus út mindig megvan.
- **Kód opcionálisan, de futtatható.** Minden laborhoz tartozik egy rövid, magyar kommentekkel ellátott Arduino-sketch
  (`elektronika/sketches/`), csukott „💻 Arduino-kód” lenyíló mögött, 10–40 sorban. A sketch nem cél, hanem eszköz: mérőműszer,
  jelforrás vagy logikai tesztelő. A C++-t nem tanítjuk külön; az első fejezetekben minden sort elmagyarázunk, később csak
  az újat.
- **Interaktivitás.** Fejezetenként 5–9 szemléltetés. A témakör alapélménye: **„kattints a kapcsolóra, és lásd, hová
  folyik az áram”** – a widgetek többsége a közös áramkör-szimulátorra (`assets/circuit.js`) vagy a logikai szimulátorra
  (`assets/logic.js`) épül, élő feszültség- és áramértékekkel, animált töltésáramlással.
- **Ellenőrzés.** Minden numerikus eredményt (példák, gyakorlók, kvízválaszok és rossz válaszok, a laborok *várható*
  értékei) Pythonnal ellenőrizni kell; az áramköri számításokat ezen felül `ngspice`-szal / `PySpice`-szal is, ahol a
  nemlineáris elemek (dióda, tranzisztor) miatt a kézi közelítés eltérhet. A számoló szkriptek helye: `_parts/elx/`.

### Laborelvek
- **Minden labor csak a meglévő eszközökkel elvégezhető** (lásd *Eszközkészlet*). Ha egy kísérlethez hiányzó alkatrész kellene
  (pl. logikai kapu IC, műveleti erősítő), akkor (1) diszkrét alkatrészekből (dióda, tranzisztor, ellenállás) építjük meg,
  vagy (2) az Arduino **emulálja** a hiányzó elemet, vagy (3) a szimulátorban mutatjuk meg, és egy „🛒 Opcionális” doboz jelzi,
  mit érdemes hozzá vásárolni.
- **Egységes laborformátum** (új doboztípus: `box lab`, lásd *Közös komponensek*):
  1. **Cél** – egy mondat, mit akarunk megtudni;
  2. **Alkatrészek** – a kit tételszámaival (pl. „1 × 220 Ω (37.), 1 × piros LED (33.)”);
  3. **Kapcsolási rajz + breadboard-nézet** – a saját `breadboard` widgetünkkel, nem a kit fotóival;
  4. **Multiméter-beállítás** – melyik üzemmód, melyik aljzat, hová tegyük a mérőzsinórokat;
  5. **Jóslat** – amit előre kiszámolunk (a tanuló először maga írja be);
  6. **Lépések** – számozva, fényképszerű pontossággal;
  7. **Mérési napló** – kitölthető táblázat (`lab-log` widget: a beírt mért értékeket összeveti a jóslattal, eltérést %-ban
     számol, és a böngészőben elmenti);
  8. **Mi történt?** – értelmezés, a tipikus eltérések okai;
  9. **Ha nem működik** – hibakereső lista (fordított LED, rossz breadboard-sor, laza vezeték, rossz pin a sketchben).
- **Az Arduino mint műszer.** A 10 bites ADC (felbontás $5\,\text{V}/1024 \approx 4{,}88\,\text{mV}$), a `micros()` és a
  Serial Plotter együtt egy „szegény ember oszcilloszkópját” adja (kb. 9 kHz mintavétel). Ezt a 7. fejezettől
  rendszeresen használjuk: feszültségmérő, RC-töltési görbe, I–U karakterisztika, logikai analizátor.
- **Élő mérés a böngészőben** (★, opcionális): Chrome/Edge alatt a **Web Serial API** segítségével a `scope` widget közvetlenül
  az Arduinóról olvas, és a mért görbét **a szimulált mellé** rajzolja. Firefoxban a Serial Plotter / kézi bevitel marad.
- **Kapcsolat a kit leckéivel.** A kit 33 leckéje (`resources/FullVersion_kit_for_Arduino_MEGA_2560/`) nyersanyag: a
  kapcsolásokat és a kódokat átvesszük, de minden labort a fejezet fogalmai köré szervezünk, és a „miért?”-et mi tesszük
  hozzá. Hivatkozás: „KIT-L12” = 12. lecke (*A Simple Voltmeter*).

### Biztonság (első fejezettől, visszatérő `box warn`)
- **Csak törpefeszültséggel dolgozunk:** USB 5 V, a breadboard-tápmodul 5 V / 3,3 V kimenete, 9 V-os elem. **Hálózati
  feszültséghez (230 V) a kurzus egyetlen laborja sem nyúl** – a relét is csak LED-et vagy motort kapcsolva használjuk.
  A hálózati áramot (11. fejezet) csak elméletben és szimulátorban tárgyaljuk; a multiméter NCV-funkciója (érintésmentes
  feszültségérzékelés) az egyetlen „hálózati” kísérlet, és az is érintés nélküli.
- **Az Arduino védelme:** egy kimeneti láb legfeljebb 20 mA-t adjon (abszolút határ 40 mA), LED mindig áramkorlátozó
  ellenállással; motort, relét, léptetőmotort sosem közvetlenül a lábról (meghajtó: tranzisztor, L9110, ULN2003); induktív
  terhelés mellé mindig szabadonfutó dióda (1N4001); a 9 V-ot sosem a 5 V-os sínre.
- **A multiméter védelme:** árammérés soros bekötéssel; feszültség alatt álló körben nincs ellenállás-, dióda- és
  szakadásvizsgálat; a mérőzsinórt az aljzat váltása előtt ki kell húzni a körből (a kézikönyv biztonsági utasításai, MM 2. o.).
- **Elektrolitkondenzátor polaritása** (10 µF): fordítva bekötve tönkremehet – ez a 9. fejezet első buktatója.
- **Rövidzár:** a tápsínek közé közvetlenül bekötött vezeték az elemet / USB-portot terheli. Az USB-port túláramvédelme
  segít, a 9 V-os elemé nem.

### Terminológia
Magyar elnevezések, az angol megfelelő első előforduláskor zárójelben; eltérés esetén `box tip`. Alapszótár:

| Magyar | Angol |
|---|---|
| töltés, elektron, proton | charge, electron, proton |
| elektromos mező (térerősség), potenciál | electric field (field strength), potential |
| feszültség, áramerősség, ellenállás | voltage, current, resistance |
| ellenállás (alkatrész), potenciométer | resistor, potentiometer (pot) |
| fajlagos ellenállás, vezető, szigetelő, félvezető | resistivity, conductor, insulator, semiconductor |
| teljesítmény, energia, hatásfok | power, energy, efficiency |
| csomópont, ág, hurok | node, branch, loop |
| föld (közös pont, referencia), tápfeszültség | ground (GND, common), supply voltage (VCC) |
| soros / párhuzamos kapcsolás | series / parallel connection |
| feszültségosztó, áramosztó | voltage divider, current divider |
| belső ellenállás, helyettesítő generátor | internal resistance, Thévenin equivalent |
| kondenzátor, kapacitás, időállandó | capacitor, capacitance, time constant |
| tekercs, induktivitás, önindukció | inductor (coil), inductance, self-induction |
| váltakozó áram, frekvencia, periódusidő, effektív érték | alternating current (AC), frequency, period, RMS value |
| reaktancia, impedancia, aluláteresztő szűrő | reactance, impedance, low-pass filter |
| dióda, nyitóirány, záróirány, nyitófeszültség | diode, forward / reverse bias, forward voltage |
| egyenirányító, Graetz-híd | rectifier, bridge rectifier |
| tranzisztor: bázis, kollektor, emitter; áramerősítési tényező | transistor: base, collector, emitter; current gain ($\beta$, $h_{FE}$) |
| telítés, lezárás | saturation, cut-off |
| felhúzó / lehúzó ellenállás | pull-up / pull-down resistor |
| lebegő bemenet | floating input |
| zajtávolság, logikai szint | noise margin, logic level |
| kapu, igazságtábla, Karnaugh-tábla | gate, truth table, Karnaugh map |
| kombinációs / sorrendi (szekvenciális) hálózat | combinational / sequential circuit |
| tároló (retesz), billenőkör (flip-flop), élvezérelt | latch, flip-flop, edge-triggered |
| órajel, kitöltési tényező | clock, duty cycle |
| számláló, léptetőregiszter | counter, shift register |
| pergés, pergésmentesítés | (contact) bounce, debouncing |
| impulzusszélesség-moduláció | pulse-width modulation (PWM) |
| analóg–digitális / digitális–analóg átalakító | ADC / DAC |
| mintavételezés, felbontás, kvantálás | sampling, resolution, quantization |
| soros kommunikáció, busz, protokoll | serial communication, bus, protocol |
| mikrovezérlő, regiszter, megszakítás, időzítő | microcontroller, register, interrupt, timer |

⚠️ **Buktatók a terminológiában:**
- Az „ellenállás” egyszerre fizikai mennyiség (*resistance*) és alkatrész (*resistor*) – a szövegben ahol kell, „ellenállás
  (alkatrész)” vagy „ellenálláselem”.
- A **technikai áramirány** (+ → −) és az **elektronáramlás iránya** (− → +) ellentétes. A témakör végig a technikai
  irányt használja (ez van a kapcsolási rajzjelekben is: a dióda nyila); a források egy része az elektronáramlást rajzolja –
  `box tip` a 3. fejezetben, és ahol egy forrás eltér, jelezzük.
- Az angol *ground* nem feltétlenül a földelés (védőföld), hanem a **közös referenciapont** (0 V). A 2. fejezet tisztázza.
- *Flip-flop* és *latch*: a magyar irodalom a „tároló” és „billenőkör” szavakat nem egységesen használja. Nálunk:
  **retesz / szintvezérelt tároló = latch**, **flip-flop = élvezérelt billenőkör**.
- A kapcsolási rajzjelek az európai (IEC) és az amerikai (ANSI) szabványban eltérnek (ellenállás: téglalap vs. cikcakk;
  logikai kapuk: téglalap „&” vs. ívelt alak). A könyvek az ANSI-t használják; mi **mindkettőt bemutatjuk**, és az ANSI
  kapualakot használjuk (ez terjedt el), az ellenállást IEC-téglalappal rajzoljuk (a magyar tankönyvi szokás) – `box tip`
  az 1. és a 16. fejezetben.

### Technikai konvenciók
- Mappa: `elektronika/NN-rovid-cim/` → `index.html`, `widgets.js`, `quizzes.js` (+ szükség esetén adatfájl, pl.
  `led-curves-data.js`). Sketchek: `elektronika/sketches/NN_nev/NN_nev.ino` (letölthető, a labor hivatkozik rá).
- Kvízazonosítók: `el<fejezet>-<szakasz>`, pl. `el4-43`, `el17-172`; fejezetzáró: `el4-final`. A témakör `index.html`-jében
  és a főoldal `data-progress` listájában frissíteni kell.
- KaTeX; `<` helyett `\lt`. Mértékegységek álló betűvel (`\text{V}`, `\Omega`), szám és mértékegység között vékony szóköz
  (`5\,\text{V}`), magyar tizedesvessző (`0{,}5`). Jelölések: feszültség $U$ (a magyar tankönyvi szokás; az angol $V$ `box tip`-ben),
  áram $I$, ellenállás $R$, teljesítmény $P$, kapacitás $C$, induktivitás $L$, időállandó $\tau$. Logikai műveletek:
  $A \cdot B$ (ÉS), $A + B$ (VAGY), $\overline{A}$ (NEM), $A \oplus B$ (KIZÁRÓ VAGY) – a matematikai logikai
  $\wedge, \vee, \neg$ jelölés `box tip`-ben (kapcsolat a Logika témakörrel).
- Doboztípusok: `def`, `thm`, `example`, `tip`, `warn`, `history` + **új: `lab`** (laborgyakorlat) és **`safety`** (biztonsági
  figyelmeztetés, a `warn` piros változata).
- **Kapcsolási rajzok SVG-ben, kódból generálva** (`assets/circuit.js` rajzoló része), egységes jelkészlettel – nem képfájlok.
  A breadboard-nézetek ugyanígy (`breadboard` komponens).
- **Előre számolt adatok:** a valódi alkatrészek mért karakterisztikái (a saját kitünkből mért LED I–U görbék, NTC-táblázat)
  a mérés után JSON-ben kerülnek az oldalra; amíg nincs saját mérés, adatlapi / SPICE-modellből számolt görbe, jelölve.

### Előfeltételek és kapcsolatok más témakörökkel
- **Középiskolai matematika:** egyenletrendezés, egyenes arányosság, normálalak – az 1. fejezet „🔁 Emlékeztető” dobozban
  ismétli a prefixumokat ($\text{m}, \mu, \text{k}, \text{M}$) és a normálalakot.
- **Analízis:** derivált (áram = a töltés változási sebessége, $i = C\,\frac{du}{dt}$), exponenciális függvény (RC-kör),
  **differenciálegyenletek** (Analízis 10.: az RC- és RL-kör elsőrendű lineáris DE), szinuszfüggvény (váltakozó áram),
  integrál (energia, átlag- és effektív érték). Minden ilyen pont „🔁 Kapcsolat” doboz, a szemléletes út nélküle is járható.
- **Logika** (tervezett témakör): ítéletlogika ↔ Boole-algebra (16. fejezet), igazságtáblák, normálformák (17. fejezet).
- **Valószínűségszámítás / statisztika:** mérési hiba, tűrés, átlagolás (4. és 7. fejezet: miért ingadozik az ADC-érték,
  és miért segít az átlagolás); álvéletlen számok – LFSR (20. fejezet).
- **Mesterséges intelligencia:** a perceptron mint küszöblogikai kapu (16. fejezet, `box tip`); a neurális hálók hardveres
  kitekintése (24. fejezet, ★★★).

### Futó példák
1. **🗼 A Világítótorony** – a témakör saját, végig épülő projektje. Egyetlen LED-ből indul, és fejezetről fejezetre okosodik:
   - 2–4. fejezet: egy LED + 220 Ω – az első áramkör, megmérjük a feszültségeket és az áramot;
   - 7. fejezet: fotoellenállásos feszültségosztó – „sötétben világít”;
   - 9. fejezet: RC-kör – lassan felvillanó és elhalványuló fény;
   - 13. fejezet: tranzisztor – több LED, nagyobb áram;
   - 15. fejezet: nyomógomb pull-up ellenállással és pergésmentesítéssel – üzemmódváltás;
   - 17. fejezet: 7 szegmenses kijelző dekóderrel – kiírja az üzemmódot;
   - 19–20. fejezet: állapotgép és 74HC595 – fényjáték-minták, LED-sor;
   - 21. fejezet: 555-ös időzítő – villogás mikrovezérlő nélkül;
   - 22. fejezet: PWM – fokozatmentes fényerő;
   - 23. fejezet: IR távirányító – távvezérlés;
   - 25. fejezet: a végleges, összerakott „torony”.
   Minden fejezet elején egy kis ábra mutatja, hol tart a torony.
2. **„A szabványkör”**: 5 V, 220 Ω, piros LED (nyitófeszültség ≈ 2 V) → $I \approx \frac{5 - 2}{220} \approx 13{,}6\,\text{mA}$.
   Ez az a kör, amelyhez minden új fogalmat (teljesítmény, Kirchhoff, dióda, tranzisztor, PWM) visszavezetünk.
3. **Elemek a fiókból**: 1,5 V-os AA-elem, a 9 V-os elem és az USB 5 V – a belső ellenállás és a kapacitás (mAh) példái.

### Eszközkészlet
A labor **kizárólag** a következőkre épül (a kit alkatrészlistája – `FullVersion_kit_for_Arduino_MEGA_2560-1.docx` – és a
multiméter kézikönyve – `multimeter.pdf` – alapján).

**Arduino MEGA 2560 kit (tételszám: megnevezés × db)**

| Csoport | Alkatrészek |
|---|---|
| Vezérlő, tápellátás, szerelés | Arduino MEGA 2560 (ATmega2560, 16 MHz, 5 V) · USB-kábel (54.) · breadboard (53.) · breadboard-tápmodul 5 V / 3,3 V (19.) · 9 V-os elemcsatlakozó (52.) · jumperkábelek: apa–apa 40, apa–anya 20, anya–anya 20 (55–57.) · tüskesor 40 pin (58.) · színkód-kártya (59.) |
| Passzív elemek | ellenállás 220 Ω × 16 (37.), 1 kΩ × 10 (38.), 10 kΩ × 10 (39.) · potenciométer 10 kΩ × 2 (40.) · kerámia kondenzátor 100 nF („104”) × 5 (41.) · elektrolit kondenzátor 10 µF × 4 (42.) |
| Félvezetők | 1N4148 kisjelű dióda × 4 (50.) · 1N4001 egyenirányító dióda × 4 (51.) · NPN tranzisztor S8050 × 4 (48.) · PNP tranzisztor S8550 × 4 (49.) · LED: piros × 8, zöld × 4, sárga × 4, kék × 4 (33–36.) · RGB LED × 1 (32.) |
| IC-k és meghajtók | 74HC595 léptetőregiszter × 2 (28.) · NE555 időzítő × 1 (27.) · L9110 motormeghajtó × 1 (22.) · ULN2003 léptetőmotor-meghajtó modul × 1 (11.) |
| Kijelzők | LCD1602 (23.) · 8 × 8 pontmátrix (24.) · 1 digites 7 szegmenses (25.) · 4 digites 7 szegmenses (26., 3641AH) · 10 szegmenses LED-sor (13.) |
| Bemenetek, érzékelők | nyomógomb nagy × 4, kicsi × 8 + sapkák (43–47.) · tolókapcsoló × 2 (31.) · billenőkapcsoló (tilt) × 2 (30.) · fotoellenállás × 2 (29.) · termisztor (NTC) × 2 (18.) · DHT-11 hőmérséklet- és páratartalom-érzékelő (12.) · PIR mozgásérzékelő (16.) · 4 × 4 mátrix-billentyűzet (20.) · a leckék alapján továbbá: HC-SR04 ultrahangos távolságmérő, ADXL345 gyorsulásmérő, joystick, HX1838 IR-vevő + távirányító |
| Beavatkozók | aktív zümmer (14.) · passzív zümmer (15.) · szervó SG90 (17.) · DC motor (21.) · léptetőmotor 28BYJ-48 (10.) · relé(modul) |

**Multiméter** (kézikönyv: `resources/multimeter.pdf`, magyar fordítás)

| Funkció | Tartomány / felbontás (kézikönyv szerint) | Mire használjuk |
|---|---|---|
| Egyenfeszültség (DCV) | 0,8–600 V, 1 mV, ±(0,8% + 5), bemeneti ellenállás 10 MΩ | szinte minden laborban; a 10 MΩ a terhelési hatás példája (7. fejezet) |
| Váltakozó feszültség (ACV), True RMS | 0,5–600 V, 45 Hz – 2 kHz | PWM és négyszögjel effektív értéke (11., 22. fejezet) |
| Egyenáram / váltakozó áram | 5 mA – 10 A, **0,1 mA felbontás**, ±(2,0% + 5) | LED- és motoráram; µA-es áramot **nem** mér → bázisáram feszültségmérésből (13. fejezet) |
| Ellenállás | 0,1 Ω – 60 MΩ | színkód ellenőrzése, fotoellenállás, NTC, potméter |
| Kapacitás | 0,001 nF – 100 mF | a „104” és a 10 µF lemérése (9. fejezet) |
| Frekvencia | kb. 10 Hz – 2 kHz (a táblázat nehezen olvasható – **ellenőrizendő**) | PWM (490 / 980 Hz), 555, `tone()` |
| Hőmérséklet | −20 … 530 °C (mellékelt hőelemmel) | NTC-kalibráció (7. fejezet), ellenállás melegedése (5. fejezet) |
| Dióda-teszt, szakadásvizsgálat (csipogó) | nyitófeszültség kijelzése | dióda/LED/tranzisztor-átmenetek (12–13. fejezet), breadboard-sorok felderítése (Laborkalauz) |
| NCV (érintésmentes feszültségérzékelés) | – | a 230 V-os vezeték körüli mező „látható” jele (1. és 11. fejezet) |
| Automatikus méréshatár, „okos” üzemmód, 6000 digit | – | a 6000 digit és a ±(% + digit) pontosság értelmezése (Laborkalauz) |

⚠️ **Ami hiányzik** (és ezért máshogy oldjuk meg): **oszcilloszkóp** → Arduino + Serial Plotter / `scope` widget;
**logikai kapu IC-k** (74HC00, 08, 32, 86, 74) → diódás–tranzisztoros kapuk + Arduino-emuláció + szimulátor; **műveleti
erősítő, komparátor** → szimulátor (14. fejezet, ★★★); **függvénygenerátor** → Arduino `tone()` / PWM; **laboratóriumi
tápegység** → USB 5 V + tápmodul + 9 V-os elem; **nagyobb kondenzátorok, több ellenállásérték** → soros/párhuzamos
kombinációk (ez maga is gyakorlat!). A multiméternek a kézikönyv szerint **egyetlen áramaljzata** van (10 A) – a kis áramok
mérését az első laborban ellenőrizzük.

🛒 **Opcionális bővítőcsomag** (néhány ezer Ft, nem kötelező; a „🛒” jelölésű kitekintő laborokhoz): 74HC00 (NAND), 74HC02 (NOR),
74HC04 (NEM), 74HC08 (ÉS), 74HC32 (VAGY), 74HC86 (XOR), 74HC74 (D flip-flop), 74HC14 (Schmitt-NEM), 74HC193 vagy 74HC393
(számláló), CD4017 (Johnson-számláló), 74HC283 (4 bites összeadó), LM358 (műveleti erősítő), LM393 (komparátor),
elektrolit kondenzátorok (1, 47, 100, 470 µF), ellenállás-válogatás (E12-sor), néhány 2N7000 MOSFET. Ezekkel a *Make: More
Electronics* kísérleteinek nagy része is megépíthető.

### Források (rövidítések)

| Rövidítés | Forrás | Szerep |
|---|---|---|
| **ED** | S. Gibilisco: *Electricity Demystified* (McGraw-Hill, 2005) – I. DC (rajzjelek; töltés, áram, feszültség, ellenállás; Ohm, teljesítmény, energia; egyszerű DC-körök, Kirchhoff; elemek), II. AC (alapok; háztartási áram; tápegységek; vezetékek), III. mágnesség (mágneses tér; elektromágneses hatások; gyakorlati mágnesség) | az I–II. blokk gerince; quizek ötletforrása |
| **END** | S. Gibilisco: *Electronics Demystified* (McGraw-Hill, 2005) – DC, AC, impedancia, tápegységek, félvezető diódák, tranzisztorok és IC-k, erősítők, oszcillátorok (+ rádiótechnika, amit kihagyunk) | II–III. blokk: impedancia, dióda, tranzisztor, erősítő, oszcillátor |
| **CE** | E. Kybett – E. Boysen: *Complete Electronics Self-Teaching Guide with Projects* (Wiley, 2012) – DC-ismétlés (Ohm, soros/párhuzamos, teljesítmény, feszültség- és áramosztó, kapcsolók, kondenzátor DC-ben), dióda és Zener, tranzisztor, **tranzisztor mint kapcsoló**, AC, szűrők, rezgőkör, erősítők, oszcillátorok, transzformátor, tápegység | lépésről lépésre, sok számpéldával: a kidolgozott példák és gyakorlók fő forrása (II–III. blokk) |
| **DED** | M. Predko: *Digital Electronics Demystified* (McGraw-Hill, 2005) – logikai alapok, Boole-optimalizálás (Karnaugh), digitális áramkörök építése, számrendszerek, bináris aritmetika, gyakorlati kombinációs hálózatok, visszacsatolás és sorrendi hálózatok, oszcillátorok, összetett sorrendi hálózatok, interfészek, **adatlapolvasás**, processzorok, PC-interfész | a IV–V. blokk gerince |
| **MME** | C. Platt: *Make: More Electronics* (Maker Media, 2014) – 36 kísérlet: tranzisztor, fototranzisztor, 555, komparátor és hiszterézis, műveleti erősítő, audioerősítés, logikai IC-k (dekóderek, számlálók, léptetőregiszter, összeadó), érzékelők, LFSR | kísérletötletek, „Make Even More” kitekintések; sok kísérlethez 🛒-alkatrész kell |
| **KIT** | A kit oktatóanyaga (`FullVersion_kit_for_Arduino_MEGA_2560-1.docx`, 33 lecke) + kapcsolási rajzok, breadboard-fotók, kódok (`Schematic/`, `Physical_connection_diagram/`, `code/`) | a laborok kiindulópontja; KIT-L*n* = *n*. lecke |
| **DS** | Adatlapok: 74HC595, ADXL345, LCD1602 (`Datasheet/`); kiegészítendő: ATmega2560, NE555, S8050/S8550, 1N4148/1N4001, L9110, ULN2003, DHT11, HC-SR04 (letöltendő, `resources/datasheets/`) | adatlapolvasás (DED 11.), határértékek |
| **MM** | A multiméter kézikönyve (`multimeter.pdf`) | Laborkalauz, minden mérés beállítása |
| **Kiegészítés** | saját ismeret, standard egyetemi/középiskolai fizika (Coulomb-törvény, mező, potenciál, a vezetés mikroszkopikus modellje, elektromágneses indukció) | a fizikai alapok egy része, amit a Demystified-könyvek csak érintenek – „Kiegészítés” jelöléssel |

Ha egy forrásban hiba van, az oldalon jelezzük (`box warn` „⚠️ Forráshiba”). Már most ismert:
- **KIT-L1:** „a LED-nek van bizonyos ellenállása, ezért 220 Ω-ot választunk” – valójában a LED **nyitófeszültsége** (≈ 2 V)
  miatt kisebb az ellenálláson eső feszültség; a LED nem ohmos ellenállás (4. és 12. fejezet).
- A forráshibákat a kidolgozás közben `_parts/elx/NOTES.md`-ben gyűjtjük (a többi témakör gyakorlata szerint).

---

## A fejezetek áttekintése

| # | Fejezet | Blokk | Szint |
|---|---|---|---|
| 0 | Laborkalauz: breadboard, multiméter, Arduino | Bevezető | ★ |
| 1 | Az elektromos töltés és az elektromos mező | I. Fizikai alapok | ★ |
| 2 | Feszültség és potenciál: az elektromosság „magassága” | I. Fizikai alapok | ★ |
| 3 | Áram: töltések mozgásban | I. Fizikai alapok | ★ |
| 4 | Ellenállás és az Ohm-törvény | I. Fizikai alapok | ★ |
| 5 | Teljesítmény, energia, hő | I. Fizikai alapok | ★ |
| 6 | Soros és párhuzamos kapcsolás, Kirchhoff-törvények | II. Áramkörök | ★–★★ |
| 7 | Feszültségosztó, potméter, érzékelők – az Arduino mint voltmérő | II. Áramkörök | ★★ |
| 8 | Hálózatszámítás: csomóponti potenciálok, helyettesítő generátor | II. Áramkörök | ★★–★★★ |
| 9 | A kondenzátor és az RC-kör | II. Áramkörök | ★★ |
| 10 | Mágnesség, elektromágnes, induktivitás: relé, motor, zümmer | II. Áramkörök | ★★ |
| 11 | Váltakozó áram és jelek | II. Áramkörök | ★★ |
| 12 | Félvezetők, dióda, LED | III. Félvezetők | ★★ |
| 13 | A tranzisztor mint kapcsoló | III. Félvezetők | ★★ |
| 14 | Erősítés és visszacsatolás – analóg kitekintés | III. Félvezetők | ★★–★★★ |
| 15 | Analógból digitális: logikai szintek, bemenetek, pergés | IV. Digitális logika | ★ |
| 16 | Logikai kapuk és a Boole-algebra | IV. Digitális logika | ★–★★ |
| 17 | Kombinációs hálózatok tervezése: igazságtáblától a kapcsolásig | IV. Digitális logika | ★★ |
| 18 | Számrendszerek és bináris aritmetika: az összeadó | IV. Digitális logika | ★★ |
| 19 | Sorrendi hálózatok: tárolók, flip-flopok, állapotgépek | IV. Digitális logika | ★★ |
| 20 | Számlálók, regiszterek, léptetőregiszter (74HC595) | IV. Digitális logika | ★★ |
| 21 | Időzítés és oszcillátorok: multivibrátor, 555, órajel | IV. Digitális logika | ★★ |
| 22 | Az analóg és a digitális világ határa: ADC, DAC, PWM | V. Mikrovezérlő és valós világ | ★★ |
| 23 | Kommunikáció: soros protokollok, buszok, kijelzők | V. Mikrovezérlő és valós világ | ★★ |
| 24 | A mikrovezérlő belülről: az ATmega2560 | V. Mikrovezérlő és valós világ | ★★–★★★ |
| 25 | Záróprojekt: a Világítótorony és saját tervek | V. Mikrovezérlő és valós világ | ★★ |

A sorrend az **ED** (fizikai alapok) → **CE** (áramkörök, dióda, tranzisztor) → **DED** (digitális) ívét követi, de a fizikai
alapokat mélyebbről indítjuk (töltés és mező, „Kiegészítés”), és a digitális részt a kit eszközeihez igazítjuk. A számrendszerek
a DED-ben a kapuk után jönnek (4. fejezet) – mi is így teszünk, mert az összeadó áramkörhöz már kellenek a kapuk.

## Tanulási útvonalak

| Útvonal | Fejezetek | Kinek? |
|---|---|---|
| **Teljes út** | 0 → 25 sorban | aki alaposan, a fizikától a processzorig érteni akarja |
| **Gyors út a digitálishoz** | 0 → 2 → 3 → 4 → 5.1–5.3 → 6 → 7 → 12.4–12.5 → 13 → 15 → 16 → 17 → 18 → 19 → 20 → 22 → 23 | aki főleg Arduinózni és logikát tervezni akar |
| **Fizikai út** | 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 14 (★★★ részekkel) | akit az elektromosságtan mint fizika érdekel |
| **Labor nélkül** | bármelyik út; a laborok „🎛️ Csak szimulátorral” változata a szimulátorban fut | ha épp nincs kéznél a kit |

---

## 0. fejezet – Laborkalauz: breadboard, multiméter, Arduino ★

**Nagy kérdés:** *Itt egy doboz alkatrész, egy mérőműszer és egy kék panel. Hogyan lesz ebből mérés – úgy, hogy semmi ne
menjen tönkre?*

**Cél:** az eszközök biztonságos használata, mielőtt a fizikába fognánk. Rövid fejezet, kvíz csak a végén; az 1. fejezettől
kezdve erre hivatkozunk („→ Laborkalauz 0.3”).

### Felépítés
1. **0.1 Biztonság és a tíz aranyszabály** ★ – a *Biztonság* rész összefoglalása; mit tehet tönkre egy rossz bekötés
   (LED, Arduino-láb, USB-port, multiméter-biztosíték).
2. **0.2 A breadboard** ★ – belső kötések (5-ös oszlopcsoportok, tápsínek, a középső árok); hogyan derítsük fel
   **szakadásvizsgálóval** (csipogó) – az első mérés. Az alkatrészek lábai, a jumperkábelek típusai.
3. **0.3 A multiméter** ★ – aljzatok (COM, V/Ω, 10 A), üzemmódok, automatikus méréshatár; a **6000 digit** és a
   „±(0,8% + 5)” pontosság értelmezése egy számpéldán; a `HOLD`, az `OL` kijelzés, az alacsony elem jele (MM 1–5. o.).
4. **0.4 Az ellenállás színkódja** ★ – 4 és 5 sávos kód; a kit színkód-kártyája; ellenőrzés multiméterrel.
5. **0.5 Az Arduino MEGA 2560** ★ – a panel részei (USB, tápcsatlakozó, 5 V/3,3 V/GND lábak, digitális és analóg lábak);
   az Arduino IDE telepítése Linuxon (soros port, `dialout` csoport), az első feltöltés (`Blink` a beépített LED-del),
   Serial Monitor és **Serial Plotter**.
6. **0.6 A breadboard-tápmodul és a 9 V-os elem** ★ – mikor melyik; a jumperek beállítása (5 V / 3,3 V).
7. **0.7 Mérési napló és hibakeresés** ★ – hogyan vezessünk jegyzőkönyvet (a `lab-log` widget); általános hibakereső
   lista.

### Laborok
- 🔧 **L0.1 A breadboard térképe** – szakadásvizsgálóval végigcsipogjuk, mely lyukak vannak összekötve; az eredményt a
  `breadboard` widgeten jelöljük, és összevetjük a „hivatalos” térképpel.
- 🔧 **L0.2 Színkód-vadászat** – a három ellenállástípus (220 Ω, 1 kΩ, 10 kΩ) azonosítása színkódról, majd mérés: mennyi a
  tűrés? (10 db 1 kΩ mért értékei → átlag, szórás – „🔁 Kapcsolat: Statisztika 2.”).
- 🔧 **L0.3 Az első sketch** – a beépített LED (13. láb) villogtatása; a késleltetés módosítása; „Hello” a Serial Monitoron.
- 🔧 **L0.4 Mennyi az „5 V”?** – az Arduino 5 V és 3,3 V lába, a tápmodul kimenete, a 9 V-os elem feszültsége
  multiméterrel – az első valódi mérési napló.

### Interaktív szemléltetések
- `breadboard-map` – kattintható breadboard: egy lyukra kattintva kiemeli az összes vele összekötött lyukat.
- `multimeter-sim` – virtuális multiméter: forgasd a módot, dugd át a zsinórt; rossz beállításnál figyelmeztet („feszültség
  alatt ellenállást mérsz!”).
- `color-code` – színkód-dekóder és -kódoló, véletlenszerű ellenállásokkal gyakorlásra.
- `accuracy-calc` – „±(% + digit)” kalkulátor: adott leolvasásnál mekkora az intervallum, amibe a valódi érték esik.

### Kvízek
`el0-final`.

### Csapdák
A breadboard tápsínje egyes típusokon a közepén **meg van szakítva** · az ellenállás színkódját rossz irányból olvasni
(a tűréssáv a jobb oldalon) · árammérő módban feszültséget mérni = rövidzár a műszeren át · az „OL” nem nullát jelent,
hanem túlcsordulást/szakadást.

### Források
MM; KIT („About Arduino”, L1, L5); CE 1. függelék C–D (prefixumok, szabványos ellenállásértékek); ED 1. (rajzjelek).

---

# I. blokk – Fizikai alapok

## 1. fejezet – Az elektromos töltés és az elektromos mező ★

**Nagy kérdés:** *Miért áll égnek a hajad, ha lehúzod a pulóvert – és mi köze ennek ahhoz, hogy világít egy LED?*

**Cél:** a töltés mint alapmennyiség; vonzás és taszítás; a mező mint „a töltés hatásának térképe”; vezetők és szigetelők
atomi szinten. Ez a fejezet szinte teljesen **Kiegészítés** (az ED 2. fejezete csak röviden érinti).

### Felépítés
1. **1.1 Az atom és a töltés** ★ – proton, neutron, elektron; a töltés **mennyisége** és előjele; az elemi töltés
   ($e \approx 1{,}602 \cdot 10^{-19}\,\text{C}$); a coulomb mint „elektroncsomag” ($1\,\text{C} \approx 6{,}24 \cdot 10^{18}$
   elektron). Töltésmegmaradás.
2. **1.2 Dörzselektromosság, vonzás és taszítás** ★ – két töltésfajta; miért vonzza a feltöltött fésű a papírdarabkát
   (megosztás, polarizáció).
3. **1.3 A Coulomb-törvény** ★–★★ – $F = k\,\frac{|Q_1 Q_2|}{r^2}$; a távolság négyzete; összevetés a gravitációval
   (mennyivel erősebb?). Kis, kézzel számolható esetek: két töltés 1 m-re, majd 2 m-re.
4. **1.4 Az elektromos mező** ★★ – a mező mint „erő egységnyi töltésre”, $E = F/q$; erővonalak; pont- és síkkondenzátor-mező
   szemléletesen (előkészíti a 9. fejezetet).
5. **1.5 Vezetők, szigetelők, félvezetők** ★ – szabad elektronok a fémekben; miért vezet a réz, és miért nem az üveg;
   a félvezető mint „köztes eset” (előkészíti a 12. fejezetet).
6. **1.6 Töltés a mindennapokban** ★ – villám, elektrosztatikus kisülés (ESD) – **miért kell vigyázni a CMOS IC-kre**
   (74HC595); földelés; a 230 V-os vezeték körüli mező és az NCV-érzékelő.
7. **1.7 Alkalmazás** – a „lebegő bemenet” mint töltésérzékelő (a 15. fejezet előzetese).

### Kidolgozott példák
- Hány elektron hiányzik egy $+1\,\text{nC}$ töltésű fésűről?
- Két $1\,\mu\text{C}$-os töltés 10 cm-re: mekkora az erő? És 20 cm-re? (negyedére csökken – „egy példa = egy gondolat”)
- Hidrogénatom: elektromos vs. gravitációs vonzás aránya ($\approx 10^{39}$).
- A mező iránya két ellentétes töltés között (rajzos feladat).

### Laborok
- 🔧 **L1.1 Az Arduino mint elektroszkóp** – egy analóg bemenetre (A0) csak egy hosszú jumperkábelt kötünk („antenna”), a
  sketch kiírja az `analogRead` értékét a Serial Plotterre. Egy megdörzsölt műanyag fésűt / lufit közelítünk és távolítunk:
  a görbe kilendül. *Mi történt?* A lebegő bemenet nagy impedanciájú, a közeledő töltés megosztást okoz.
  (Biztonság: a fésűt ne érintsük a lábhoz – ESD.)
- 🔧 **L1.2 A láthatatlan mező** – a multiméter NCV-üzemmódjával egy (falon belüli) hálózati vezeték nyomvonalát követjük
  **érintés nélkül**. Mit érzékel, és miért csak váltakozó mezőt? (Kitekintés a 11. fejezetre.)

### Interaktív szemléltetések
- `atom-charge` – atommodell: elektronokat adunk el/veszünk el, kijelzi a nettó töltést (ion).
- `coulomb-lab` – két mozgatható töltés, erővektorok; csúszka: töltésnagyság, távolság; az $1/r^2$ grafikon élőben.
- `field-lines` – töltéseket helyezhetsz el a síkon; erővonalak és egy „próbatöltés”, amely a mezőben mozog.
- `conductor-insulator` – szabad és kötött elektronok animációja külső mezőben (megosztás vezetőben, polarizáció szigetelőben).
- `esd-spark` – mekkora feszültség keletkezik dörzsöléssel (kV!) és mekkora energia (mJ) – miért nem veszélyes ránk, de az IC-re igen.

### Kvízek
`el1-11`, `el1-13`, `el1-14`, `el1-15`, `el1-16`, `el1-final`.

### Csapdák
„Az áram az elektronok gyors száguldása” (a 3. fejezet cáfolja) · a töltés nem „fogy el”, csak szétválik · a Coulomb-törvényben
a távolság **négyzete** · a „pozitív töltés” nem a protonok mozgását jelenti fémben.

### Források
ED 2. (töltés); END 1. (*The Nature of DC*); Kiegészítés (Coulomb, mező, megosztás).

---

## 2. fejezet – Feszültség és potenciál: az elektromosság „magassága” ★

**Nagy kérdés:** *Mit jelent pontosan, hogy egy elem „1,5 voltos”? És miért nem ráz meg a 9 V-os elem, ha a nyelvünk mégis érzi?*

### Felépítés
1. **2.1 Munka a mezőben** ★ – a töltést a mezővel szemben mozgatni munka; **analógia: magasság és gravitáció**
   (a labda felvitele a dombra). A potenciális energia.
2. **2.2 Potenciál és feszültség** ★ – a potenciál = energia egységnyi töltésre; a **feszültség = potenciálkülönbség**,
   $U = W/Q$, $1\,\text{V} = 1\,\text{J}/\text{C}$. A feszültség mindig **két pont között** értelmes.
3. **2.3 A referenciapont: a „föld”** ★ – miért választunk egy 0 V-os pontot (GND), és hogy ez önkényes; ugyanaz a kör
   más referenciával; csomóponti potenciálok jelölése a rajzon.
4. **2.4 Feszültségforrások** ★ – elem (kémiai energia → szétválasztott töltés), USB-tápegység, napelem (ED 5.); a forrás
   mint „töltéspumpa”, nem mint „töltéstartály”.
5. **2.5 Elemek soros és párhuzamos kapcsolása** ★ – a feszültségek összeadódnak (sorosan); mi a 9 V-os elem belül
   (6 × 1,5 V); fordított elem a sorban.
6. **2.6 Feszültségmérés** ★ – a voltmérő **párhuzamosan** kapcsolódik; a COM a referencia; negatív kijelzés jelentése.

### Kidolgozott példák
- Mennyi energiát ad át egy 9 V-os elem 1 C töltésnek? És 1 mAh-nyi töltésnek ($3{,}6\,\text{C}$)?
- Egy pont potenciálja +5 V, egy másiké +2 V: mennyi a feszültség köztük? És fordítva mérve?
- Három AA elem sorosan, az egyik fordítva: mennyi a teljes feszültség? (1,5 V)
- Ugyanaz a kör kétféle földponttal: mely számok változnak és melyek nem? (a potenciálok igen, a feszültségek nem)

### Laborok
- 🔧 **L2.1 Potenciáltérkép** – az USB-ről táplált breadboardon három sorba kötött 1 kΩ-os ellenállás (5 V és GND között).
  Mérjük minden csomópont potenciálját a GND-hez képest, majd két tetszőleges pont közti feszültséget – és ellenőrizzük:
  a feszültség a két potenciál különbsége. (Várható: 5; 3,33; 1,67; 0 V.) *Ez a labor már átvezet a 6. fejezetbe, de itt
  csak a potenciál fogalmát használjuk.*
- 🔧 **L2.2 Elemek sorosan** – 9 V-os elem + az Arduino 5 V-ja *nem* köthető össze közvetlenül → helyette két (vagy több)
  1,5 V-os elem sorosan, egyenesen és egy fordítva (ha nincs AA-elemtartó: a breadboard tápmodul 3,3 V és 5 V kimenete
  közötti feszültség mint „két forrás különbsége”).

### Interaktív szemléltetések
- `potential-hill` – magassági térkép analógia: a töltés „legurul” a potenciáldombon; a feszültség = szintkülönbség.
- `ground-choice` – ugyanaz a kör, a GND-szimbólumot áthúzhatod másik csomópontra: a csomóponti potenciálok frissülnek, a
  feszültségek nem.
- `battery-stack` – elemeket húzhatsz sorba (normál / fordított), a voltmérő kijelzi az eredőt.
- `voltmeter-probe` – virtuális mérőcsúcsok a szimulátor bármely két pontjára.

### Kvízek
`el2-22`, `el2-23`, `el2-25`, `el2-26`, `el2-final`.

### Csapdák
„A feszültség átfolyik az ellenálláson” (az áram folyik, a feszültség *rajta esik*) · egyetlen pont feszültségéről beszélni
referencia nélkül · a nagyobb feszültségű elem nem „több áramot tárol” · a 9 V-os elem nem 9 V mindig (terhelés, lemerülés).

### Források
ED 2–3., 5.; END 1.; CE 1. (*Current Flow*); KIT L12 (a voltmérő-lecke potenciálfogalma).

---

## 3. fejezet – Áram: töltések mozgásban ★

**Nagy kérdés:** *Ha az elektronok csigalassúsággal – másodpercenként tized millimétereket – haladnak a vezetékben, miért
gyullad fel a lámpa azonnal, amikor felkapcsolod?*

### Felépítés
1. **3.1 Az áramerősség** ★ – $I = Q/t$; $1\,\text{A} = 1\,\text{C}/\text{s}$; mA, µA. Számolás töltésből és fordítva.
2. **3.2 A zárt áramkör** ★ – forrás, vezető, fogyasztó, kapcsoló; nyitott és zárt kör; rövidzár. A **vízkör analógia**
   (szivattyú = forrás, cső = vezeték, szűkület = ellenállás) és korlátai.
3. **3.3 Áramirány** ★ – technikai irány vs. elektronáramlás (`box tip` a forrásokról).
4. **3.4 Sodródási sebesség és jelterjedés** ★★ – az elektronok lassan sodródnak, a „lökés” (a mező) közel fénysebességgel
   terjed; számpélda egy rézvezetékre (ED + Kiegészítés).
5. **3.5 Az áram egy körben mindenhol ugyanaz** (soros kör) ★ – „az áram nem fogy el a fogyasztóban” – mérésből.
6. **3.6 Árammérés** ★ – az ampermérő **sorosan** kapcsolódik; a műszer áramaljzata; miért veszélyes párhuzamosan bekötni.
7. **3.7 Egyenáram és váltakozó áram** ★ – első találkozás (DC/AC), a 11. fejezet előzetese.

### Kidolgozott példák
- 20 mA folyik 1 percig: mennyi töltés haladt át? Hány elektron?
- Egy 2000 mAh-s akkumulátor mennyi ideig ad 100 mA-t (ideális esetben)?
- Sodródási sebesség 1 mm²-es rézvezetékben 1 A-nél (≈ 0,07 mm/s) vs. a jel terjedése.

### Laborok
- 🔧 **L3.1 A szabványkör** – 5 V (Arduino 5 V lába) → 220 Ω → piros LED → GND. Az áram mérése a kör **három különböző pontján**
  (a LED előtt, között, után): mindhárom ≈ 13–14 mA. (Itt ellenőrizzük azt is, hogy a multiméter mA-tartománya hogyan
  viselkedik – lásd *Eszközkészlet*.)
- 🔧 **L3.2 Nyitott, zárt, rövidzárt** – kapcsoló (tolókapcsoló) a körben; mit mutat a voltmérő a nyitott kapcsolón (5 V – 2 V
  helyett az egész!) és zárt állapotban (≈ 0 V). Rövidzár **csak a szimulátorban**.

### Interaktív szemléltetések
- `charge-flow` – a közös szimulátor alapnézete: animált pontok az áram irányában, sebességük arányos az árammal; váltható
  „technikai irány / elektronok”.
- `drift-vs-signal` – egy hosszú vezeték: a sodródó elektronok és a „lökéshullám” animációja, valós arányokkal (logaritmikus időskálán).
- `water-circuit` – vízkör és elektromos kör egymás mellett, ugyanazokkal a csúszkákkal; a „hol sántít?” pontok kiemelve.
- `ammeter-placement` – a tanuló teszi be az ampermérőt; rossz helyen (párhuzamosan) a műszer „kiég”.

### Kvízek
`el3-31`, `el3-32`, `el3-34`, `el3-35`, `el3-36`, `el3-final`.

### Csapdák
Az áram „elfogy” a fogyasztóban · az ampermérő párhuzamosan · a „mAh” nem energia, hanem töltés · a vízmodell túlhajtása
(nyitott „csap” = zárt kapcsoló – a szóhasználat fordított!).

### Források
ED 2. (*Current*); END 1.; CE 1. (*Current Flow*); KIT L1.

---

## 4. fejezet – Ellenállás és az Ohm-törvény ★

**Nagy kérdés:** *Miért pont 220 Ω kell a LED elé – és mi történne 22 Ω-mal vagy 22 kΩ-mal?*

### Felépítés
1. **4.1 Az ellenállás mint jelenség** ★ – ütközések a kristályrácsban; mitől függ: anyag, hossz, keresztmetszet,
   hőmérséklet; $R = \rho\,\frac{l}{A}$. Vezetés ($G = 1/R$, siemens).
2. **4.2 Az Ohm-törvény kis esetekből** ★ – mérési táblázatból (U–I párok) → egyenes arányosság → $U = R \cdot I$;
   a három alak és az „Ohm-háromszög”.
3. **4.3 Az U–I karakterisztika** ★ – egyenes = ohmos (lineáris) elem; meredekség = $1/R$. **Nem minden elem ohmos:** a LED
   görbéje (előzetes a 12. fejezethez).
4. **4.4 Az ellenálláselem** ★ – típusok, színkód, E-sorok (E12, E24), tűrés, terhelhetőség (1/4 W).
5. **4.5 Változtatható ellenállások** ★ – potenciométer mint változtatható ellenállás (két láb) és mint osztó (három láb –
   csak a 7. fejezetben); fotoellenállás, termisztor (NTC) mint „érzékelő ellenállás”.
6. **4.6 Az áramkorlátozó ellenállás** ★ – a szabványkör számítása: $R = \frac{U_\text{táp} - U_\text{LED}}{I}$; miért
   jó a 220 Ω (és miért *nem* azért, mert a LED-nek „ellenállása van” – ⚠️ Forráshiba, KIT-L1).

### Kidolgozott példák
- 5 V-on 10 kΩ-on mennyi áram folyik? (0,5 mA) – és 220 Ω-on? (22,7 mA)
- Mekkora ellenállás kell, hogy 5 V-ról egy kék LED (≈ 3 V) 10 mA-t kapjon? (200 Ω → a legközelebbi E12-érték 220 Ω)
- Ugyanaz a LED 220 Ω, 1 kΩ, 10 kΩ ellenállással: 13,6 mA, 3 mA, 0,3 mA – hogyan változik a fényerő?
- Egy 10 m-es, 0,5 mm²-es rézvezeték ellenállása.

### Laborok
- 🔧 **L4.1 Ohm-törvény a potméterrel** – 9 V-os elem → 1 kΩ (védő-ellenállás) → potméter (változtatható ellenállás) → GND.
  A potméter forgatásával 6 különböző áramnál mérjük az U-t és az I-t a 1 kΩ-on → U–I tábla → egyenes; a meredekségből
  visszakapjuk a 1 kΩ-ot. A mérési napló automatikusan egyenest illeszt.
- 🔧 **L4.2 A LED nem ohmos** – a szabványkörben a 220 Ω helyett 1 kΩ, majd 10 kΩ; mérjük a LED feszültségét és áramát
  mindhárom esetben: az áram 45-szörösére nő, a LED feszültsége alig változik (≈ 1,8 → 2,0 V). Az „ellenállás” $U/I$ nem állandó.
- 🔧 **L4.3 Érzékelő ellenállások** – a fotoellenállás ellenállása sötétben, szobafényben, telefon-zseblámpánál; az NTC
  ellenállása szobahőmérsékleten és megfogva (melegítve) – ohmmérővel.

### Interaktív szemléltetések
- `resistivity` – vezetékdarab: hossz, keresztmetszet, anyag csúszkával → ellenállás; „ütköző elektronok” animáció.
- `ohm-lab` – virtuális mérés: forrásfeszültség csúszka, ellenállás választó; pontokat gyűjt az U–I síkra, egyenest illeszt.
- `iv-compare` – ellenállás, LED, izzó (melegedő!) U–I görbéje egymáson.
- `led-resistor-calc` – LED színe + tápfeszültség + kívánt áram → ellenállás; a legközelebbi E12-érték és a tényleges áram.

### Kvízek
`el4-41`, `el4-42`, `el4-43`, `el4-44`, `el4-46`, `el4-final`.

### Csapdák
Az Ohm-törvényt nemlineáris elemre (LED, dióda) alkalmazni · $R = U/I$ nem jelenti, hogy az ellenállás a feszültségtől
függ (ohmos elemnél) · a színkód félreolvasása (piros–piros–barna = 220, nem 22) · LED ellenállás nélkül az Arduinón.

### Források
ED 2–3. (*Resistance*, *Ohm's Law*); END 1. (*Ohm's Law*); CE 1. (*Ohm's Law*, *The Graph of Resistance*); KIT L1, L27, L16;
MME 1. (*Background: Conductors and Insulators*).

---

## 5. fejezet – Teljesítmény, energia, hő ★

**Nagy kérdés:** *Melyik merül le hamarabb: egy LED-lámpa vagy egy zümmer? És miért melegszik az ellenállás?*

### Felépítés
1. **5.1 A teljesítmény** ★ – $P = U \cdot I$, és Ohm-törvénnyel: $P = I^2 R = U^2/R$; a watt. Melyik alakot mikor?
2. **5.2 Energia és idő** ★ – $W = P \cdot t$; wattóra, kilowattóra; az elem kapacitása mAh és Wh-ban.
3. **5.3 Joule-hő és terhelhetőség** ★ – miért 1/4 W az ellenállás; mi történik túlterheléskor; a biztosíték elve.
4. **5.4 Hatásfok** ★★ – a LED-es kör: mennyi teljesítmény megy a LED-re és mennyi az ellenállásra (≈ 40% / 60%).
5. **5.5 Az Arduino áramköltségvetése** ★★ – lábankénti 20 mA (abszolút 40 mA), összesen ≈ 200 mA; USB-port 500 mA. Mennyi
   LED köthető egyszerre? (Előkészíti a tranzisztoros meghajtást.)
6. **5.6 Kitekintés: a háztartási villamos energia** ★ – számlán a kWh; a 230 V-os készülékek teljesítménye (ED 7.).

### Kidolgozott példák
- 220 Ω közvetlenül 5 V-on: 22,7 mA és 114 mW – belefér a 250 mW-ba.
- Ugyanaz 9 V-on: 368 mW – túlterhelés! (tipikus hiba)
- A szabványkör: LED ≈ 27 mW, ellenállás ≈ 41 mW.
- Egy 9 V-os elem (≈ 500 mAh) hány órán át táplál egy 15 mA-es LED-es kört?

### Laborok
- 🔧 **L5.1 Teljesítményleltár** – a szabványkörben mérjük az ellenálláson és a LED-en eső feszültséget és az áramot →
  teljesítmények, hatásfok. A mérési napló kiszámolja.
- 🔧 **L5.2 Melegszik?** – két párhuzamos 220 Ω (≈ 110 Ω) a breadboard-tápmodul 5 V-ján (≈ 227 mW, mindkettőn ≈ 114 mW):
  a multiméter hőelemével mérjük a hőmérséklet-emelkedést néhány percig. Összevetés: egy ellenállás 1 kΩ-mal (25 mW).
  *(Biztonság: csak a megadott értékekkel; 9 V-on nem.)*
- 🔧 **L5.3 Áramfelvétel** – mennyit fogyaszt maga az Arduino (az USB-áram mérése nem lehetséges közvetlenül → a 9 V-os
  elemről, a DC-jack-en táplálva sorba kötött multiméterrel); és mennyivel nő, ha 8 LED világít (KIT-L6 kapcsolása).

### Interaktív szemléltetések
- `power-triangle` – $P$, $U$, $I$, $R$ – bármely kettőt megadva a többi; „melyik képletet használjam?” döntési fa.
- `resistor-heat` – ellenállás színe vörösödik a disszipált teljesítménnyel; a terhelhetőség túllépésekor füst-animáció.
- `battery-life` – elemtípus + fogyasztó → üzemidő; Peukert-hatás egyszerűsítve (★★).
- `arduino-budget` – lábakra húzható LED-ek, motorok; a panel figyelmeztet a láb- és összáram túllépésekor.

### Kvízek
`el5-51`, `el5-52`, `el5-53`, `el5-54`, `el5-55`, `el5-final`.

### Csapdák
$P = U \cdot I$-ben más elem feszültségét és áramát összeszorozni · a mAh-t energiának venni (feszültség nélkül nem az) ·
„nagyobb ellenállás = több hő” (állandó feszültségen éppen fordítva!) · Wh és W összekeverése.

### Források
ED 3. (*Power*, *Energy*), 7. (*Ohm's Law, Power, and Energy* a háztartásban); CE 1. (*Power*); KIT L6–L7.

---

# II. blokk – Áramkörök

## 6. fejezet – Soros és párhuzamos kapcsolás, Kirchhoff-törvények ★–★★

**Nagy kérdés:** *Ha egy karácsonyi füzérben kiég egy izzó, miért alszik ki az egész – és a másik fajta füzérben miért nem?*

### Felépítés
1. **6.1 Soros kapcsolás** ★ – közös áram; a feszültségek összeadódnak; eredő $R = R_1 + R_2 + \ldots$ – a 2. fejezet
   potenciáltérképéből.
2. **6.2 Párhuzamos kapcsolás** ★ – közös feszültség; az áramok összeadódnak; $\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}$;
   két ellenállásra a „replusz” $\frac{R_1 R_2}{R_1 + R_2}$; azonos ellenállások.
3. **6.3 Kirchhoff csomóponti törvénye** ★ – töltésmegmaradás: befolyó = kifolyó.
4. **6.4 Kirchhoff huroktörvénye** ★★ – energiamegmaradás: egy hurok mentén a feszültségek összege nulla; előjelszabály.
5. **6.5 Vegyes kapcsolások egyszerűsítése** ★★ – lépésenként; „nem minden kör egyszerűsíthető így” (híd – a 8. fejezetbe).
6. **6.6 Ellenállás-kombinációk a gyakorlatban** ★ – „nincs 500 Ω-om” → hogyan állítsuk elő a kit három értékéből
   (220, 1 k, 10 k) a kívántat.
7. **6.7 Alkalmazás:** LED-ek sorban és párhuzamosan; miért kap **minden LED saját** ellenállást.

### Kidolgozott példák
- 220 Ω + 1 kΩ sorosan 5 V-on: áram (4,1 mA), feszültségek (0,9 V és 4,1 V).
- 1 kΩ ∥ 1 kΩ = 500 Ω; 1 kΩ ∥ 10 kΩ ≈ 909 Ω (a kisebbiknél mindig kisebb).
- Kirchhoff-hurok egy kétforrásos körben, kézzel.
- Két LED párhuzamosan egyetlen ellenállással: miért világít az egyik erősebben? (eltérő nyitófeszültség – szimulátorral)

### Laborok
- 🔧 **L6.1 Eredő ellenállás** – kombinációk összerakása és ohmmérővel mérése: 220+1k, 1k∥1k, 1k∥1k∥1k, (1k+1k)∥10k stb.;
  előbb a jóslat.
- 🔧 **L6.2 Kirchhoff mérésben** – vegyes kör (5 V, 220 Ω soros, utána 1 kΩ ∥ 10 kΩ); minden ág áramát és minden elem
  feszültségét megmérjük, és ellenőrizzük mindkét törvényt a mérési naplóban (a napló kiszámolja a csomóponti és hurokösszegek
  „maradékát”).
- 🔧 **L6.3 Füzér** – 3 LED sorosan a 9 V-os elemről (egy ellenállással) vs. 3 LED párhuzamosan 5 V-ról (külön ellenállásokkal):
  kiveszünk egyet – mi történik?

### Interaktív szemléltetések
- `series-parallel` – ellenállások húzhatók soros/párhuzamos helyre; az eredő, az áramok, a feszültségek élőben; az áramlás
  animációjában jól látszik az ágak közötti szétválás.
- `kcl-junction` – csomópont 3–5 ággal, az áramok nyíllal; egy áramot változtatva a többi frissül.
- `kvl-loop` – hurok körbejárása: a „magasságprofil” (potenciál a hurok mentén) grafikonon – fel a forrásnál, le az ellenállásoknál.
- `reduce-steps` – vegyes kapcsolás egyszerűsítése lépésenként, animálva.
- `resistor-puzzle` – játék: adott célértéket rakj ki a kit ellenállásaiból a lehető legkevesebb darabból.

### Kvízek
`el6-61`, `el6-62`, `el6-63`, `el6-64`, `el6-65`, `el6-66`, `el6-final`.

### Csapdák
Párhuzamos eredőt összeadni · a huroktörvény előjeleinek keverése · „az áram a kisebb ellenálláson megy” (mindkettőn megy,
arányosan) · közös ellenállás párhuzamos LED-eknek.

### Források
ED 4. (*Series*, *Parallel*, *Kirchhoff's Laws*); END 1. (*Resistive Networks*); CE 1. (*Resistors in Series/Parallel*);
KIT L6–L7.

---

## 7. fejezet – Feszültségosztó, potméter, érzékelők – az Arduino mint voltmérő ★★

**Nagy kérdés:** *Hogyan tudja egy Arduino „megérezni”, hogy sötét van – amikor csak feszültséget tud mérni?*

### Felépítés
1. **7.1 A feszültségosztó** ★ – két soros ellenállás; $U_\text{ki} = U_\text{be}\,\frac{R_2}{R_1 + R_2}$, levezetve a 6. fejezetből.
2. **7.2 A potenciométer mint osztó** ★ – három láb; a csúszka helyzete → arányos feszültség (KIT-L12).
3. **7.3 Az Arduino analóg bemenete** ★ – `analogRead`: 0–1023 ↔ 0–5 V; felbontás 4,88 mV; átváltás a sketchben; a
   referenciafeszültség (USB-ről nem pontosan 5 V – mérjük meg!).
4. **7.4 Ellenállás-érzékelők osztóban** ★★ – fotoellenállás + 10 kΩ (KIT-L27), NTC + 10 kΩ (KIT-L16); melyik helyre tegyük
   a fix ellenállást, és mekkorát (érzékenység a munkapont körül).
5. **7.5 Az NTC-ből hőmérséklet** ★★ – B-paraméteres egyenlet (Steinhart–Hart egyszerűsítve); kalibráció a multiméter
   hőelemével.
6. **7.6 A terhelés hatása** ★★ – ha az osztó kimenetét terheljük, a feszültség leesik; **a műszer is terhel** (10 MΩ):
   kis ellenállású osztónál elhanyagolható, sötétben álló fotoellenállásnál (MΩ!) nem.
7. **7.7 Zaj és átlagolás** ★★ – miért ugrál ±1–2 egységet az ADC; átlagolás $n$ mintából (🔁 Statisztika: a középérték szórása $\sigma/\sqrt n$).
8. **7.8 Alkalmazás: 🗼 sötétben világító torony** – fotoellenállás + küszöb a sketchben → LED.

### Kidolgozott példák
- 10 kΩ / 10 kΩ osztó: 2,5 V; 1 kΩ / 10 kΩ: 4,55 V vagy 0,45 V – attól függően, melyik van alul.
- `analogRead` = 512 → mennyi a feszültség? És fordítva: 3,3 V → milyen érték?
- Fotoellenállás 1 kΩ (világos) és 50 kΩ (sötét) 10 kΩ-os osztóban: a két feszültség.
- 10 MΩ-os műszer egy 1 MΩ / 1 MΩ osztón: 2,5 V helyett ≈ 2,38 V.

### Laborok
- 🔧 **L7.1 Arduino-voltmérő** (KIT-L12 alapján) – potméter osztóként az A0-ra; a sketch kiírja a feszültséget; a potméter
  több állásában összevetjük a multiméterrel → kalibrációs egyenes; az eltérésből a tényleges referenciafeszültség.
- 🔧 **L7.2 Fénymérő** (KIT-L27) – fotoellenállás + 10 kΩ; érték a Serial Plotteren; „ujjal letakarva”, zseblámpa; a fix
  ellenállás cseréje (1 kΩ, 10 kΩ) → melyik ad nagyobb érzékenységet?
- 🔧 **L7.3 Hőmérő** (KIT-L16) – NTC + 10 kΩ; az egyenletből °C; kalibráció a multiméter hőelemével (két pont: szoba, kézben
  melegített); hiba becslése.
- 🔧 **L7.4 Terhelési hatás** – fotoellenállás sötétben (letakarva) + 10 kΩ, mérés multiméterrel és Arduinóval; mennyit
  „húz le” a műszer? (a fotoellenállás MΩ-os tartományában látható).
- 🔧 **L7.5 🗼 Torony v1** – sötétben bekapcsoló LED, a küszöb a potméterrel állítható (két analóg bemenet).

### Interaktív szemléltetések
- `divider` – két csúszkás osztó; a kimeneti feszültség és egy „terhelés” ellenállás, amely lehúzza.
- `adc-staircase` – bemeneti feszültség → 10 bites kód; nagyítható lépcsőfüggvény; 8 / 10 / 12 bites összehasonlítás.
- `ldr-sensitivity` – fotoellenállás-görbe (log megvilágítás); a fix ellenállás csúszkájával megkeresheted a legérzékenyebb munkapontot.
- `ntc-curve` – NTC ellenállás–hőmérséklet görbe, a B-paraméteres közelítés hibája.
- `noise-averaging` – zajos ADC-jel, átlagolási ablak csúszkával; a szórás csökkenése $1/\sqrt n$-nel.
- `scope` (első használat) – Web Serial: az Arduinóról élő görbe.

### Kvízek
`el7-71`, `el7-72`, `el7-73`, `el7-74`, `el7-76`, `el7-77`, `el7-final`.

### Csapdák
A képletben a felső és alsó ellenállás felcserélése · az osztó kimenetét erősen terhelni (pl. LED-et kötni rá) · azt hinni,
hogy a 1023 pontosan 5 V · az NTC-t lineárisnak venni.

### Források
CE 1. (*The Voltage Divider*, *The Current Divider*); KIT L12, L16, L27, L28; MME 2. (*Answers to Voltage Divider Examples*),
29. (*Common Sensors*), 34. (*Ambient Sensing*).

---

## 8. fejezet – Hálózatszámítás: csomóponti potenciálok, helyettesítő generátor ★★–★★★

**Nagy kérdés:** *Van olyan kapcsolás, amelyet nem lehet soros és párhuzamos részekre bontani. Hogyan számoljuk ki – és
hogyan csinálja ezt egy áramkör-szimulátor?*

**Cél:** szisztematikus módszerek; ez a fejezet a közös szimulátor (`circuit.js`) „motorháztető alatti” magyarázata is.
A digitális út kihagyhatja.

### Felépítés
1. **8.1 A Wheatstone-híd** ★★ – a példa, ahol a soros/párhuzamos egyszerűsítés elakad; kiegyenlített híd.
2. **8.2 Csomóponti potenciálok módszere** ★★ – ismeretlenek = csomóponti potenciálok; csomópontonként egy Kirchhoff-egyenlet;
   kis (2–3 ismeretlenes) egyenletrendszer kézzel.
3. **8.3 Mátrixos alak** ★★★ – $G\,\mathbf{u} = \mathbf{i}$; így számol a SPICE és a mi szimulátorunk (MNA röviden).
4. **8.4 Szuperpozíció** ★★ – több forrás hatása külön-külön.
5. **8.5 A valós forrás és a belső ellenállás** ★★ – üresjárási feszültség, rövidzárási áram; a 9 V-os elem belső ellenállása.
6. **8.6 Thévenin- és Norton-helyettesítés** ★★–★★★ – „bármilyen lineáris kétpólus = forrás + ellenállás”; a feszültségosztó
   Thévenin-alakja → a 7.6 terhelési hatás egyszerű magyarázata.
7. **8.7 Maximális teljesítményátvitel** ★★★ – $R_t = R_b$.

### Kidolgozott példák
- Kiegyenlítetlen híd (220, 1k, 1k, 10k) csomóponti módszerrel.
- Két forrás egy körben szuperpozícióval.
- 9 V-os elem: üresjárásban 9,3 V, 1 kΩ-mal terhelve 9,2 V → belső ellenállás.
- 10 kΩ / 10 kΩ osztó Thévenin-alakja: 2,5 V + 5 kΩ.

### Laborok
- 🔧 **L8.1 A híd** – Wheatstone-híd a kit ellenállásaiból, a potméterrel kiegyenlítve; a híd feszültsége nulla → az ismeretlen
  ellenállás (pl. az NTC) meghatározása.
- 🔧 **L8.2 Az elem belső ellenállása** – 9 V-os elem üresjárásban, majd 1 kΩ, 220 Ω, 2 × 220 Ω ∥ terheléssel (rövid ideig!);
  $U$–$I$ egyenes → meredekség = belső ellenállás, tengelymetszet = üresjárási feszültség. Ugyanez az Arduino 5 V-os lábára.
- 🔧 **L8.3 Thévenin igazolása** – osztó mérése különböző terhelésekkel, és összevetés a Thévenin-modell jóslatával.

### Interaktív szemléltetések
- `bridge` – Wheatstone-híd, egy ellenállás csúszkával; a híd feszültsége nulla-átmenettel.
- `nodal-solver` – lépésenként mutatja a csomóponti egyenleteket, a mátrixot és a megoldást egy kis körre (ez a szimulátor magja).
- `superposition` – forrásokat ki/be kapcsolhatsz (feszültségforrás → rövidzár), az áramok összegződnek.
- `thevenin-box` – „fekete doboz” két kivezetéssel; terhelést kötsz rá, mérsz, és megkeresed a helyettesítő forrást.
- `max-power` – terhelés csúszka; a terhelésen leadott teljesítmény görbéje, maximum $R_t = R_b$-nél.

### Kvízek
`el8-82`, `el8-84`, `el8-85`, `el8-86`, `el8-final`.

### Csapdák
Szuperpozícióban az áramforrást rövidrezárni (szakadás kell) · a teljesítményre nem érvényes a szuperpozíció · a belső
ellenállást elhanyagolni nagy áramnál.

### Források
END 1. (*Resistive Networks*); ED 4.; CE 1.; Kiegészítés (csomóponti módszer, Thévenin – standard villamosmérnöki anyag).

---

## 9. fejezet – A kondenzátor és az RC-kör ★★

**Nagy kérdés:** *Hogyan lehet egy LED-et úgy lekapcsolni, hogy még egy másodpercig lassan halványodva világítson –
program nélkül?*

### Felépítés
1. **9.1 A kondenzátor mint töltéstároló** ★ – két fegyverzet és szigetelő; $Q = C \cdot U$; a farad és gyakorlati egységei
   (pF, nF, µF); a kerámia „104” kódja ($10 \cdot 10^4\,\text{pF} = 100\,\text{nF}$); elektrolit polaritása.
2. **9.2 Töltés és kisütés kvalitatívan** ★ – vízmodell: tartály, amely lassan telik; kezdetben „rövidzár”, a végén „szakadás”.
3. **9.3 Az időállandó** ★ – $\tau = R \cdot C$; 1 τ után 63%, 5 τ után 99%; a kit értékeivel: 10 kΩ · 10 µF = 0,1 s.
4. **9.4 Az exponenciális töltési görbe** ★★ – $u_C(t) = U_0\,(1 - e^{-t/\tau})$ és kisütés $U_0\,e^{-t/\tau}$; numerikus
   lépésenkénti szimulációból (Euler-módszer) – „🔁 Kapcsolat: Analízis 10.” a differenciálegyenletes levezetéssel (★★★).
5. **9.5 Kondenzátorok soros és párhuzamos kapcsolása** ★ – fordítva, mint az ellenállásoknál; 4 × 10 µF párhuzamosan = 40 µF.
6. **9.6 Energia a kondenzátorban** ★★ – $W = \frac12 C U^2$.
7. **9.7 Alkalmazások** ★★ – lassú felfutás/lefutás (🗼 torony v2), pergésmentesítő RC (a 15. fejezet előzetese), tápszűrő
   (a „104” az IC tápja mellett – miért?), időzítés (a 21. fejezet előzetese).

### Kidolgozott példák
- 100 nF 5 V-ra töltve: 0,5 µC; 10 µF: 50 µC.
- τ = 1 kΩ · 10 µF = 10 ms; mikor éri el a 4 V-ot 5 V-ról töltve? ($t = -\tau \ln(1 - 0{,}8) \approx 16\,\text{ms}$)
- 2 × 10 µF sorosan: 5 µF; párhuzamosan: 20 µF.
- Mekkora ellenállás kell 10 µF-hoz, hogy τ = 1 s legyen? (100 kΩ – a kitben 10 × 10 kΩ sorosan!)

### Laborok
- 🔧 **L9.1 Kondenzátorok lemérése** – a „104” és a 10 µF mérése a multiméter kapacitás-üzemmódjával; soros/párhuzamos kombinációk.
- 🔧 **L9.2 Az RC-töltés felvétele Arduinóval** – a 8. láb (digitális kimenet) 10 kΩ-on át tölti a 10 µF-ot, az A0 méri a
  kondenzátor feszültségét `micros()` időbélyeggel; a görbét a `scope` widget a szimulált exponenciális mellé rajzolja.
  Meghatározzuk τ-t a 63%-os pontból és a logaritmikus ábrázolás meredekségéből. Ismétlés 1 kΩ-mal (τ = 10 ms) és 100 nF-dal.
- 🔧 **L9.3 🗼 Torony v2: lassan halványodó fény** – LED + 1 kΩ + 10 µF (vagy 4 × 10 µF párhuzamosan), nyomógombbal töltve;
  a halványodás ideje becsülve és mérve. *(Itt a LED nemlinearitása miatt a „látott” idő eltér a τ-tól – Mi történt?)*
- 🔧 **L9.4 Szűrés előzetes** – PWM-jel (`analogWrite`) RC-szűrőn át: a „négyszögből” egyenfeszültség lesz (a 22. fejezet
  előzetese, itt csak megfigyelés).

### Interaktív szemléltetések
- `capacitor-plates` – síkkondenzátor: lemezméret, távolság, szigetelő → C; töltéseket tölthetsz rá, a mező erővonalai.
- `rc-charge` – RC-kör kapcsolóval: töltés/kisütés animáció + $u_C(t)$, $i(t)$ görbe élőben; τ-jelölők (1τ, 2τ … 5τ).
- `euler-rc` – „lépésről lépésre” numerikus integrálás: Δt csúszka, a közelítés és a pontos exponenciális eltérése.
- `cap-combinations` – kondenzátorok soros/párhuzamos; összevetés az ellenállásokkal (két oszlopban, „szembeállító pár”).
- `rc-fade` – LED fényereje a kondenzátor kisülése közben (a LED küszöbe miatt a fény „hirtelen” alszik ki).

### Kvízek
`el9-91`, `el9-93`, `el9-94`, `el9-95`, `el9-96`, `el9-97`, `el9-final`.

### Csapdák
Elektrolitkondenzátor fordított polaritással · a kondenzátor nem „egy kis akkumulátor” (energiája nagyon kicsi) · a soros/párhuzamos
képletek felcserélése · „5 τ után teljesen feltöltődik” (99,3%, nem 100%) · feltöltött kondenzátort rövidre zárni.

### Források
ED 5. (töltéstárolás – röviden); END 3. (*Capacitive Reactance* előtte), CE 1. (*Capacitors in a DC Circuit*); KIT L8 (Breathing
LED – PWM-mel, összevetésre); MME 7. (*The Coupling Capacitor*); Kiegészítés (exponenciális töltés levezetése).

---

## 10. fejezet – Mágnesség, elektromágnes, induktivitás: relé, motor, zümmer ★★

**Nagy kérdés:** *Hogyan tud egy apró, 5 V-os jel egy kattanással „átkapcsolni” egy másik áramkört – és miért kell a relé
mellé egy dióda, különben tönkremegy az Arduino?*

### Felépítés
1. **10.1 A mágneses tér** ★ – állandó mágnes, erővonalak, Föld mágneses tere (ED 10.).
2. **10.2 Áram mágneses tere** ★ – Ørsted kísérlete; tekercs = elektromágnes; a menetszám és az áram szerepe (ED 11.).
3. **10.3 Erő az áramra a mágneses térben** ★★ – a motorelv; DC motor felépítése (kommutátor), forgásirány megfordítása.
4. **10.4 Elektromágneses indukció** ★★ – változó mágneses tér → feszültség (Faraday); generátor, transzformátor (kitekintés,
   ED 6–7., CE 10.).
5. **10.5 Önindukció és induktivitás** ★★ – a tekercs „tehetetlensége”: ellenáll az áram változásának; $u = L\,\frac{di}{dt}$
   szemléletesen; az RL-kör időállandója $L/R$.
6. **10.6 A visszarúgó feszültség és a szabadonfutó dióda** ★★ – kikapcsoláskor a tekercs nagy feszültséget induká; az 1N4001
   szerepe a relé/motor mellett. (A dióda működése a 12. fejezetben – itt „egyirányú szelep”-ként.)
7. **10.7 Beavatkozók a kitben** ★ – relé (elektromágneses kapcsoló), DC motor, léptetőmotor (tekercsek sorrendben – a 20.
   fejezetben digitálisan), szervó (motor + visszacsatolás), aktív és passzív zümmer.

### Kidolgozott példák
- Mekkora áram folyik egy 70 Ω-os relétekercsen 5 V-on? (≈ 71 mA – több, mint amit egy Arduino-láb adhat!)
- Az RL időállandó: 0,1 H és 100 Ω → 1 ms.
- Ha a 70 mA-es áram 1 µs alatt szakad meg egy 0,1 H-s tekercsben: becsült feszültség (≈ 7000 V nagyságrendű csúcs – ezért a dióda).

### Laborok
- 🔧 **L10.1 Iránytű és vezeték** *(ha van iránytű vagy telefon magnetométer-alkalmazás)* – egy vezetéken rövid ideig ≈ 0,5 A
  folyik (9 V-os elem + 2 × 220 Ω ∥ … → korlátozott áram); a telefon magnetométere kilendül.
- 🔧 **L10.2 Relé kattintása** (KIT-L4) – relé S8050-es tranzisztorral és 1N4001-gyel (a tranzisztort itt még „kapcsolóként”
  kezeljük, a 13. fejezet magyarázza); a relé két LED-et kapcsol felváltva. A tekercs ellenállásának mérése ohmmérővel;
  az áram számítása.
- 🔧 **L10.3 Motor iránya** (KIT-L22) – DC motor L9110 meghajtóval; két bemenet → előre/hátra/áll/fék; a motor áramának
  mérése terheletlenül és lefogva (a lefogott motor árama nagyobb – miért? nincs ellenindukció).
- 🔧 **L10.4 A két zümmer** (KIT-L2, L10) – aktív vs. passzív zümmer: az egyik egyenfeszültségre szól, a másikhoz váltakozó
  jel (`tone()`) kell. Ohmmérővel: mi van belül?

### Interaktív szemléltetések
- `magnetic-field` – vezeték és tekercs mágneses tere, iránytűkkel; áram irányának és nagyságának csúszkája.
- `motor-principle` – forgó keret mágnesek között, kommutátorral; erővektorok.
- `faraday` – mágnes mozgatása tekercsben (egérrel) → indukált feszültség görbéje.
- `rl-kickback` – RL-kör kapcsolóval, dióda be/ki: kikapcsoláskor a feszültségtüske (log skálán) – a dióda „elnyeli”.
- `stepper-coils` – a léptetőmotor 4 tekercse, a gerjesztési sorrend kattintható; a forgórész lép.

### Kvízek
`el10-102`, `el10-103`, `el10-104`, `el10-105`, `el10-106`, `el10-final`.

### Csapdák
Relét/motort közvetlenül Arduino-lábra kötni · elfelejteni a szabadonfutó diódát, vagy fordítva bekötni (rövidzár!) · a tekercs
„csak egy drót” (DC-ben igen, változáskor nem) · az aktív és passzív zümmer összekeverése.

### Források
ED 10–12. (*What Is Magnetism?*, *Electromagnetic Effects*, *Practical Magnetism*); END 1. (*DC Magnetism*); CE 5. (*The Inductor*),
10. (*The Transformer*); KIT L2, L4, L10, L15, L22, L26.

---

## 11. fejezet – Váltakozó áram és jelek ★★

**Nagy kérdés:** *Mit jelent, hogy a konnektorban „230 V” van, ha a feszültség másodpercenként százszor átmegy nullán?*

### Felépítés
1. **11.1 Jelek az idő függvényében** ★ – egyenfeszültség, négyszög, háromszög, szinusz; periódusidő, frekvencia, amplitúdó;
   a jel mint függvény ($u(t)$).
2. **11.2 A szinuszos váltakozó feszültség** ★★ – $u(t) = \hat U \sin(2\pi f t)$; a generátor (10.4) szinuszt állít elő (ED 6.).
3. **11.3 Az effektív érték** ★★ – „ugyanannyi hő, mint egyenárammal”; szinusznál $\hat U/\sqrt 2$; négyszögnél és PWM-nél
   más! (True RMS-műszer vs. átlagoló). 230 V effektív ↔ ≈ 325 V csúcs.
4. **11.4 A négyszögjel mint egyenszint + váltakozó rész** ★★ – kitöltési tényező, átlagérték ($D \cdot U$); az Arduino PWM-je
   490 Hz (4. és 13. lábon 980 Hz).
5. **11.5 Fázis** ★★ – két jel időbeli eltolása.
6. **11.6 Kondenzátor és tekercs váltakozó áramban** ★★ – reaktancia szemléletesen: a kondenzátor a gyors változást átengedi,
   a tekercs a lassút; $X_C = \frac{1}{2\pi f C}$, $X_L = 2\pi f L$; impedancia röviden (komplex számok csak ★★★, END 3.).
7. **11.7 Az RC-szűrő** ★★ – aluláteresztő és felüláteresztő; határfrekvencia $f_c = \frac{1}{2\pi RC}$; a PWM simítása (→ 22. fejezet).
8. **11.8 A háztartási áram** ★ (csak elmélet) – fázis, nulla, védőföld; háromfázis röviden; miért veszélyes; transzformátor és
   tápegység (ED 7–8., CE 11.). **Biztonsági `box safety`: hálózati feszültséggel nem kísérletezünk.**
9. **11.9 Hangok** ★ – a frekvencia mint hangmagasság; zenei hangok frekvenciái (KIT-L10).

### Kidolgozott példák
- 50 Hz periódusideje; 490 Hz periódusideje (≈ 2,04 ms).
- 230 V effektív → csúcsérték, csúcstól csúcsig (≈ 650 V).
- PWM 5 V, 25% kitöltés: átlag 1,25 V, effektív 2,5 V – a kettő különbözik!
- RC aluláteresztő 10 kΩ / 10 µF: $f_c \approx 1{,}6\,\text{Hz}$; 1 kΩ / 10 µF: ≈ 16 Hz.

### Laborok
- 🔧 **L11.1 Frekvenciamérés** – `tone(pin, f)` 100 Hz, 440 Hz, 1000 Hz; a multiméter Hz-üzemmódja; a passzív zümmeren meghallgatjuk.
  A PWM-lábak alapfrekvenciája (490 / 980 Hz) mérése.
- 🔧 **L11.2 Átlag és effektív érték** – PWM 0–255 kitöltéssel; DCV-üzemmódban mért érték (≈ átlag) vs. ACV True RMS (váltakozó
  rész) – a mérési napló összeveti a $D \cdot 5\,\text{V}$ és $\sqrt{D(1 - D)} \cdot 5\,\text{V}$ jóslattal. *(A műszer
  AC-módja a kézikönyv szerint 45 Hz – 2 kHz között érvényes.)*
- 🔧 **L11.3 RC-szűrő a PWM-re** – 10 kΩ + 10 µF a PWM-lábon; az A0 a szűrt jelet méri: a hullámosság a Serial Plotteren 1 kΩ-mal
  és 10 kΩ-mal.
- 🔧 **L11.4 Kétirányú „váltakozó áram” két lábbal** – két digitális láb ellenfázisban kapcsolgat (az egyik HIGH, a másik LOW,
  majd fordítva): a köztük lévő terhelésen (két LED ellentétes irányban párhuzamosan + 220 Ω) a feszültség ±5 V-os négyszög →
  felváltva világít a két LED. (A 12. fejezet egyenirányítójának jelforrása.)
- 🔧 **L11.5 Zenegép** (KIT-L10) – dallam a passzív zümmeren; frekvencia–hangmagasság.

### Interaktív szemléltetések
- `signal-gen` – jelgenerátor: alak, frekvencia, amplitúdó, egyenszint, kitöltés; virtuális oszcilloszkóp-kijelzővel.
- `rms-lab` – a jel négyzete és átlaga animálva; szinusz/négyszög/háromszög/PWM effektív értéke; „mit mutat egy átlagoló és egy True RMS-műszer?”.
- `phasor` – forgó vektor és a szinusz kapcsolata; két jel fáziseltolása.
- `rc-filter` – szűrő frekvenciamenete (Bode-diagram, log skála) + időtartományban a bemeneti és kimeneti jel.
- `mains-explainer` – 230 V-os hálózat: fázis/nulla/védőföld, mi történik érintéskor (áramút a testen át) – csak animáció.

### Kvízek
`el11-111`, `el11-113`, `el11-114`, `el11-116`, `el11-117`, `el11-118`, `el11-final`.

### Csapdák
Az effektív és a csúcsérték keverése · PWM effektív értékét $D \cdot U$-nak venni (az az átlag) · a frekvenciát a periódusidővel
szorozni (osztani kell) · „a kondenzátor nem vezet” (váltakozó áramot igen).

### Források
ED 6–9. (*Fundamentals of AC*, *Electricity in the Home*, *Power Supplies*, *Wire and Cable*); END 2–3. (*Alternating Current*,
*Impedance*); CE 5–7. (*AC Pre-Test and Review*, *Filters*, *Resonant Circuits* – kitekintés); KIT L8, L10.

---

# III. blokk – Félvezetők

## 12. fejezet – Félvezetők, dióda, LED ★★

**Nagy kérdés:** *Hogyan lehet egy anyagot rávenni, hogy csak az egyik irányba vezessen – és miért világít az egyik dióda
pirosan, a másik kéken?*

### Felépítés
1. **12.1 Félvezetők** ★ – szilícium kristály, kötött elektronok; adalékolás: n- és p-típus; lyuk mint „hiányzó elektron”
   (END 5., Kiegészítés).
2. **12.2 A pn-átmenet** ★★ – kiürített réteg, beépített feszültség; nyitóirány és záróirány szemléletesen.
3. **12.3 A dióda karakterisztikája** ★★ – exponenciális I–U görbe; nyitófeszültség (Si ≈ 0,6–0,7 V); letörés (Zener röviden – CE 2.);
   egyszerűsített modellek: ideális kapcsoló → kapcsoló + 0,7 V → + soros ellenállás.
4. **12.4 A LED** ★ – fénykibocsátás a rekombinációból; szín ↔ tiltott sáv ↔ nyitófeszültség (piros ≈ 1,8–2,0 V, kék ≈ 3 V);
   közös anódos / katódos RGB LED.
5. **12.5 Dióda a gyakorlatban** ★ – lábak azonosítása (csík = katód; a LED rövidebb lába / lapos oldala); a multiméter
   dióda-tesztje; 1N4148 (gyors, kisjelű) vs. 1N4001 (egyenirányító, 1 A).
6. **12.6 Egyenirányítás** ★★ – egyutas, kétutas (Graetz-híd); szűrés kondenzátorral; a tápegység felépítése (ED 8., CE 11.).
7. **12.7 Védőfunkciók** ★★ – fordított polaritás elleni védelem, szabadonfutó dióda (10.6 visszautal), a bemenetek
   védődiódái az ATmega-ban.
8. **12.8 Diódás logika előzetes** ★ – két dióda + ellenállás = VAGY-kapu (a 16. fejezetben folytatjuk).

### Kidolgozott példák
- 5 V, 1 kΩ, egy szilíciumdióda nyitóirányban: $I \approx 4{,}3\,\text{mA}$ (a 0,7 V-os modellel); ideális modellel 5 mA – mennyi a hiba?
- Ugyanez záróirányban: ≈ 0 A, az egész 5 V a diódán.
- Négy LED színe és nyitófeszültsége → mekkora ellenállás kell mindegyikhez 10 mA-hez 5 V-ról.
- Graetz-híd ±5 V-os négyszöggel: a terhelésen ≈ 5 − 2 · 0,7 = 3,6 V.

### Laborok
- 🔧 **L12.1 Diódateszt** – a multiméter dióda-üzemmódjával az 1N4148, az 1N4001 és a négy színű LED nyitófeszültsége (a LED
  halványan fel is villan); mindkét irányban. Táblázat: szín ↔ nyitófeszültség.
- 🔧 **L12.2 I–U karakterisztika Arduinóval** – PWM + RC-szűrő (11. fejezet) vagy a potméter mint változtatható forrás → 1 kΩ →
  dióda; két analóg bemenet méri a dióda feszültségét és az ellenálláson esőt (→ áram). A sketch végigsöpri a feszültséget, a `scope`
  widget kirajzolja az exponenciális görbét; összevetés a négy LED-re és a két diódára.
- 🔧 **L12.3 Graetz-híd** – 4 × 1N4001 hídban; jelforrás: a L11.4 két ellenfázisú lába (±5 V-os négyszög). A kimeneten egy LED
  mindkét bemeneti polaritásnál világít; a kimeneti feszültség mérése szűrés nélkül és 10 µF-dal.
- 🔧 **L12.4 RGB LED színkeverés** (KIT-L9) – három csatorna, három ellenállás; közös katód vagy anód? – a dióda-teszttel derítjük ki.

### Interaktív szemléltetések
- `pn-junction` – p és n tartomány, elektronok és lyukak animációja; a külső feszültség csúszkájával a kiürített réteg szélessége.
- `diode-iv` – exponenciális I–U görbe lineáris és logaritmikus skálán; a három egyszerűsített modell ráillesztve.
- `led-spectrum` – LED-szín ↔ hullámhossz ↔ foton energiája ↔ nyitófeszültség ($U \approx hc/(e\lambda)$, ★★).
- `rectifier` – egyutas / Graetz-híd / szűrőkondenzátor; bemeneti és kimeneti jel, a hullámosság a C csúszkával.
- `load-line` – munkapont-szerkesztés: az ellenállás egyenese és a dióda görbéje metszéspontja (★★).

### Kvízek
`el12-121`, `el12-122`, `el12-123`, `el12-124`, `el12-126`, `el12-127`, `el12-final`.

### Csapdák
LED fordítva → nem világít (és nagy záróirányú feszültségnél tönkremehet) · LED ellenállás nélkül · a dióda nem ohmos, az Ohm-törvényt
csak a soros ellenállásra alkalmazzuk · a nyitófeszültség nem állandó (áram- és hőmérsékletfüggő) · a „lyuk” nem részecske, hanem
modell.

### Források
END 5. (*Semiconductor Diodes*, *The P-N Junction*); CE 2. (*The Diode*, *Zener*); ED 8. (*Rectifiers*); MME 3–4.
(fototranzisztor – kitekintés); KIT L1, L9.

---

## 13. fejezet – A tranzisztor mint kapcsoló ★★

**Nagy kérdés:** *Egy Arduino-láb 20 mA-t bír – hogyan kapcsolhat mégis egy 70 mA-es relét vagy egy fél amperes motort?*

### Felépítés
1. **13.1 A bipoláris tranzisztor** ★ – két pn-átmenet; NPN és PNP; bázis, kollektor, emitter; lábkiosztás (S8050 / S8550,
   TO-92 – adatlap!). Dióda-teszttel mérhető két „dióda”.
2. **13.2 Áramerősítés** ★★ – kis bázisáram vezérel nagy kollektoráramot: $I_C = \beta I_B$; a vízcsap-analógia; a β szórása
   (100–400).
3. **13.3 A három működési tartomány** ★★ – lezárás, aktív (erősítő), telítés; a kapcsolóüzem a két szélső.
4. **13.4 A tranzisztoros kapcsoló méretezése** ★★ – lépések: terhelés árama → szükséges $I_B$ (tartalékkal, „β = 10–20-szal
   számolunk telítéshez”) → bázisellenállás (CE 4. módszere). Alacsony oldali (NPN) és magas oldali (PNP) kapcsoló.
5. **13.5 Kis áram mérése feszültségből** ★ – mivel a multiméter µA-t nem mér, a bázisáramot a bázisellenálláson eső
   feszültségből számoljuk (Ohm-törvény mint mérési módszer).
6. **13.6 Induktív terhelés kapcsolása** ★★ – relé, motor + szabadonfutó dióda (10.6 → most már teljes kép).
7. **13.7 Darlington és integrált meghajtók** ★★ – ULN2003 (7 Darlington + diódák), L9110 (H-híd); a H-híd elve.
8. **13.8 A MOSFET röviden** ★★ – feszültséggel vezérelt kapcsoló; miért ez van minden digitális IC-ben (a 16. fejezet CMOS-ának
   előzetese); a kitben nincs diszkrét MOSFET → szimulátor.
9. **13.9 Alkalmazás: 🗼 torony v3** – egy Arduino-láb + S8050 → 8 LED párhuzamosan (mindegyik saját ellenállással, ≈ 100 mA).

### Kidolgozott példák
- Relé 71 mA, β_min = 100 → $I_B$ ≥ 0,71 mA; tartalékkal 5 mA → $R_B = (5 - 0{,}7)/5\,\text{mA} \approx 860\,\Omega$ → 1 kΩ (≈ 4,3 mA).
- 8 LED × 13 mA ≈ 104 mA a tranzisztoron át; ellenőrzés: telítésben $U_{CE} \approx 0{,}2\,\text{V}$, a tranzisztor disszipációja ≈ 21 mW.
- PNP magas oldali kapcsoló: mikor van bekapcsolva? (LOW bázisnál – fordított logika!)
- Mi történik, ha a bázisellenállás 100 kΩ? (nem telít: aktív tartomány, a tranzisztor melegszik, a LED halvány)

### Laborok
- 🔧 **L13.1 Tranzisztor dióda-teszttel** – S8050 és S8550 lábainak azonosítása a multiméterrel (B–E, B–C átmenetek).
- 🔧 **L13.2 A β mérése** – NPN, 10 kΩ bázisellenállás + potméter, 220 Ω + LED a kollektorkörben; több állásban mérjük a
  bázisellenálláson és a kollektorellenálláson eső feszültséget → $I_B$, $I_C$, β; látjuk, hol telít (β „leesik”). A mérési napló
  kirajzolja az $I_C$–$I_B$ görbét.
- 🔧 **L13.3 Kapcsoló Arduinóval** – digitális láb → 1 kΩ → S8050 → a kollektorkörben aktív zümmer, majd relé (+ 1N4001); mérjük
  $U_{CE}$-t be- és kikapcsolt állapotban.
- 🔧 **L13.4 PNP-vel** – ugyanez S8550-nel a pozitív oldalon; a sketchben a logika megfordul.
- 🔧 **L13.5 🗼 Torony v3** – 8 LED egyetlen lábról tranzisztorral; áram és $U_{CE}$ mérése.

### Interaktív szemléltetések
- `bjt-water` – tranzisztor vízcsap-modell: kis bázis-„patak” nyit egy nagy kollektor-„folyót”; a telítés = teljesen nyitott csap.
- `bjt-regions` – kimeneti karakterisztika-sereg ($I_C$–$U_{CE}$ különböző $I_B$-kre) + terhelési egyenes; a munkapont húzható,
  kiírja a tartományt.
- `switch-designer` – terhelés (LED, relé, motor) + Arduino-láb → a program lépésenként méretezi a bázisellenállást, és szimulál.
- `h-bridge` – négy kapcsoló H-hídban; tiltott állás (rövidzár) kiemelve; a motor forgásiránya.
- `mosfet-vs-bjt` – áram- vs. feszültségvezérlés összevetése.

### Kvízek
`el13-131`, `el13-132`, `el13-133`, `el13-134`, `el13-136`, `el13-137`, `el13-final`.

### Csapdák
Bázisellenállás nélkül → a B–E dióda rövidzár a láb számára · a terhelés az emitterkörbe (emitterkövető, nem telít) · PNP-t NPN-ként
vezérelni · a β-ra mint pontos értékre tervezni · a lábkiosztás típusonként más (adatlap!).

### Források
CE 3–4. (*Introduction to the Transistor*, *The Transistor Switch*); END 6. (*Transistors and Integrated Circuits*);
MME 2. (*Transistor Behavior*, *Quick Facts About Transistors*); KIT L4, L22, L26; DS (S8050, ULN2003, L9110).

---

## 14. fejezet – Erősítés és visszacsatolás – analóg kitekintés ★★–★★★

**Nagy kérdés:** *Hogyan lesz egy mikrofon millivoltos jeléből hangszóró-hangerő – és mi köze ennek a digitális
elektronikához?*

**Cél:** az analóg világ legfontosabb gondolatai – erősítés, munkapont, **visszacsatolás**, komparátor – annyira, hogy
megértsük, miért *más* a digitális áramkör (két állapot, nagy zajtávolság). Kihagyható; a 15. fejezet csak a 14.6-ot használja.

### Felépítés
1. **14.1 Mi az erősítés?** ★ – feszültség-, áram-, teljesítményerősítés; decibel röviden.
2. **14.2 A közös emitteres fokozat** ★★ – munkapont-beállítás bázisosztóval, a kimeneti jel „fordítva” (CE 8.).
3. **14.3 Az emitterkövető** ★★ – áramerősítés feszültségerősítés nélkül.
4. **14.4 A negatív visszacsatolás** ★★ – stabilitás a β szórása ellenére; a gondolat mindenhol: termosztát, szervó (KIT-L15).
5. **14.5 A műveleti erősítő** ★★★ – ideális szabályok; nem invertáló és invertáló erősítő; csak szimulátorban (🛒 LM358).
6. **14.6 A komparátor és a pozitív visszacsatolás** ★★ – „melyik nagyobb?” → a digitális döntés őse; **hiszterézis**
   (Schmitt-trigger) – előkészíti a 15. fejezetet (MME 6.).
7. **14.7 Oszcilláció** ★★ – ha a visszacsatolás pozitív és elég nagy → oszcillátor (a 21. fejezet előzetese; END 8., CE 9.).

### Kidolgozott példák
- Bázisosztó tervezése 5 V-ról, $I_C$ = 1 mA munkaponthoz (10 kΩ-os elemekből).
- Nem invertáló műveleti erősítő: $1 + R_2/R_1$ = 11 (10 kΩ és 1 kΩ).
- Schmitt-trigger két küszöbe egy adott ellenállás-hálózattal.

### Laborok
- 🔧 **L14.1 Fényerősítő** – fotoellenállás + 10 kΩ osztó → S8050 bázisa (1 kΩ-on át) → kollektorban LED: a LED fényereje
  folyamatosan követi a megvilágítást (aktív tartomány!) – összevetés a 13. fejezet kapcsolójával.
- 🔧 **L14.2 Szervó mint visszacsatolt rendszer** (KIT-L15) – a szervó „tudja”, hol áll: a potméter állása → szöggel; lefogva
  érezzük, ahogy visszanyom.
- 🔧 **L14.3 Szoftveres hiszterézis** – a 7. fejezet sötétkapcsolója egy küszöbbel (villog a határon!) vs. két küszöbbel (stabil) –
  a pozitív visszacsatolás hatása kódban emulálva.
- 🎛️ **Csak szimulátorral:** közös emitteres fokozat, műveleti erősítő, komparátor hiszterézissel.

### Interaktív szemléltetések
- `ce-amplifier` – közös emitteres fokozat: bemeneti szinusz, kimenet; munkapont csúszka → torzulás (levágás) a széleken.
- `feedback-loop` – blokkdiagram: erősítés $A$, visszacsatolás $\beta$; zárt hurkú erősítés $A/(1 + A\beta)$ – az $A$ szórása alig hat.
- `opamp-sandbox` – ideális műveleti erősítő 3–4 kapcsolásban.
- `schmitt` – zajos bemenet egy küszöbbel és hiszterézissel; a kimenet „pergése” eltűnik.

### Kvízek
`el14-142`, `el14-144`, `el14-146`, `el14-final`.

### Csapdák
Az erősítő „energiát teremt” (a tápból veszi) · pozitív és negatív visszacsatolás összekeverése · a komparátor nem erősítő
lineáris tartományban.

### Források
CE 8–9. (*Transistor Amplifiers*, *Oscillators*); END 7–8. (*Signal Amplifiers*, *Signal Oscillators*); MME 6. (*Easy On, Easy Off* –
komparátor, hiszterézis), 9–14. (műveleti erősítő); KIT L15, L28.

---

# IV. blokk – Digitális logika

## 15. fejezet – Analógból digitális: logikai szintek, bemenetek, pergés ★

**Nagy kérdés:** *A valóságban a feszültség folytonos. Mikor „1” és mikor „0” egy jel – és miért éri meg a világot két
állapotra egyszerűsíteni?*

### Felépítés
1. **15.1 Miért digitális?** ★ – zaj, másolás, tárolás; a digitális jel visszaállítható (regenerálás), az analóg nem.
2. **15.2 Logikai szintek és zajtávolság** ★ – $U_{IL}$, $U_{IH}$, $U_{OL}$, $U_{OH}$; az ATmega2560 küszöbei 5 V-on
   (≈ 0,3 · VCC és 0,6 · VCC); a tiltott sáv; zajtávolság kiszámítása (DED 1., 10.).
3. **15.3 Digitális kimenet** ★ – a láb mint kapcsoló a VCC és a GND felé (push-pull); áramforrás és áramnyelő; a kimeneti
   feszültség terhelés alatt esik (belső ellenállás – 8.5 visszautal).
4. **15.4 Digitális bemenet és a lebegő láb** ★ – nagy impedancia; lebegő bemenet véletlenszerű (1.7 visszautal).
5. **15.5 Felhúzó és lehúzó ellenállás** ★ – nyomógomb + 10 kΩ; a belső felhúzó (`INPUT_PULLUP`, ≈ 20–50 kΩ); aktív alacsony logika.
6. **15.6 Pergés és pergésmentesítés** ★★ – a mechanikus kapcsoló pattog (ms-os nagyságrend); megoldások: RC + Schmitt (14.6),
   szoftveres késleltetés, állapotgép (19. fejezet előzetese).
7. **15.7 Szintillesztés** ★★ – 5 V és 3,3 V-os eszközök (ADXL345!) összekötése; osztó, soros ellenállás (DED 10.).
8. **15.8 Alkalmazás: 🗼 torony v4** – üzemmódváltó nyomógomb pergésmentesítve.

### Kidolgozott példák
- 5 V-os ATmega: $U_{IL,\max}$ = 1,5 V, $U_{IH,\min}$ = 3 V; egy 0,4 V-os $U_{OL}$-ű kimenet → alacsony szintű zajtávolság 1,1 V.
- Gomb lehúzó 10 kΩ-mal: mennyi áram folyik lenyomva? (0,5 mA)
- 3,3 V-os kimenet 5 V-os bemenetre: biztosan HIGH? (3,3 V > 3 V – épphogy; zajtávolság 0,3 V)

### Laborok
- 🔧 **L15.1 Hol vált a bemenet?** – potméter osztóként egy **digitális** bemenetre, közben az A0 is méri ugyanazt; lassan
  forgatva a sketch kiírja, melyik feszültségnél vált 0→1 és 1→0: **a két küszöb nem ugyanott van** – a bemenet beépített hiszterézise!
- 🔧 **L15.2 A lebegő bemenet** – gomb felhúzó ellenállás nélkül: a LED „magától” villog, ha közelítünk a kezünkkel; majd 10 kΩ lehúzó,
  végül `INPUT_PULLUP` (KIT-L3).
- 🔧 **L15.3 Pergés láthatóvá tétele** – a gomb lenyomásait megszakítás számolja (`attachInterrupt`): egy lenyomásra 1–10 „lenyomás”;
  `micros()` időbélyegekkel kirajzolva a pattogás. Majd RC-szűrő (10 kΩ + 100 nF) és szoftveres pergésmentesítés → 1.
- 🔧 **L15.4 A kimenet terhelése** – egy HIGH láb feszültsége terheletlenül, 1 kΩ-mal, 220 Ω-mal, 2 × 220 Ω ∥-lel (rövid ideig) →
  a láb belső ellenállása (≈ 25 Ω nagyságrend).
- 🔧 **L15.5 🗼 Torony v4** – üzemmódváltó gomb.

### Interaktív szemléltetések
- `logic-levels` – feszültségtengely a négy küszöbbel és a tiltott sávval; zajos jel → hol fordít rosszul?
- `noise-margin` – két kapu láncban, zaj hozzáadása; digitális regenerálás vs. analóg zajhalmozódás 10 fokozaton át.
- `pullup` – nyomógomb lehúzó/felhúzó ellenállással / anélkül; a bemenet feszültsége és a beolvasott érték.
- `bounce` – pattogó kontaktus jele (valósághű), RC-szűrő és Schmitt-trigger után; szoftveres ablak csúszkával.

### Kvízek
`el15-151`, `el15-152`, `el15-154`, `el15-155`, `el15-156`, `el15-157`, `el15-final`.

### Csapdák
Lebegő bemenet olvasása · `INPUT_PULLUP` mellett a lenyomott gomb **LOW** · két kimenetet összekötni (az egyik HIGH, a másik LOW →
rövidzár) · 5 V-os jelet 3,3 V-os eszköz bemenetére kötni.

### Források
DED 1., 3. (*Creating Digital Electronic Circuits*), 10. (*Circuit Interfaces*), 11. (*Reading Datasheets*); MME 6. (hiszterézis);
KIT L3, L21, L24; DS (ATmega2560 – DC-jellemzők).

---

## 16. fejezet – Logikai kapuk és a Boole-algebra ★–★★

**Nagy kérdés:** *Két kapcsolóból, néhány diódából és egy tranzisztorból hogyan lesz „gondolkodás” – és miért elég
mindehhez egyetlen fajta kapu?*

### Felépítés
1. **16.1 Kapcsolók logikája** ★ – két kapcsoló sorosan = ÉS, párhuzamosan = VAGY (a 6. fejezet kapcsolásai új szemmel);
   igazságtábla.
2. **16.2 Az alapkapuk** ★ – NEM, ÉS, VAGY, NAND, NOR, XOR, XNOR: jelölés (ANSI és IEC), igazságtábla, Boole-kifejezés.
3. **16.3 Kapuk diódákból és tranzisztorokból** ★★ – diódás ÉS és VAGY (DRL), tranzisztoros NEM (RTL), NAND, NOR; miért nem
   láncolható a diódás logika sokáig (szintvesztés). Történeti `box history`: RTL → DTL → TTL → CMOS.
4. **16.4 CMOS röviden** ★★ – komplementer MOSFET-pár; miért nem fogyaszt állandóan; a 74HC-család (a 74HC595 is ilyen).
5. **16.5 A Boole-algebra szabályai** ★★ – azonosságok (kommutativitás, asszociativitás, disztributivitás, elnyelés, $A + \overline{A} = 1$
   …); bizonyítás igazságtáblával (teljes felsorolás – „kis eset”).
6. **16.6 A De Morgan-azonosságok** ★★ – $\overline{A \cdot B} = \overline A + \overline B$; „buborék-tologatás” a rajzon.
7. **16.7 Univerzális kapuk** ★★ – minden kapu felépíthető NAND-ból (vagy NOR-ból): NEM, ÉS, VAGY, XOR NAND-okból.
8. **16.8 Kitekintés: a perceptron mint küszöblogika** ★★★ – súlyozott összeg + küszöb = ÉS / VAGY; az XOR nem megy egy
   rétegben („🔁 Kapcsolat: MI 9.”).

### Kidolgozott példák
- A sorba kötött két kapcsoló igazságtáblája és Boole-kifejezése.
- Diódás VAGY-kapu: bemenetek 0/5 V, kimenet ≈ 0 / 4,3 V – a dióda nyitófeszültsége „elvesz” a szintből.
- $\overline{A + B}$ = $\overline{A} \cdot \overline{B}$ igazságtáblával.
- XOR négy NAND-ból – lépésenként.

### Laborok
- 🔧 **L16.1 Kapcsolólogika** – két nyomógomb sorosan és párhuzamosan egy LED-del; igazságtábla kitöltése.
- 🔧 **L16.2 Diódás ÉS és VAGY** – 2 × 1N4148 + 10 kΩ; bemenetek kapcsolóval vagy Arduino-lábról; a kimeneti szintek mérése
  multiméterrel → a nem ideális „1” és „0”.
- 🔧 **L16.3 Tranzisztoros NEM, NAND, NOR** – S8050 + 1 kΩ / 10 kΩ; a NAND két soros, a NOR két párhuzamos tranzisztorral.
  Kimenet LED-en és multiméteren.
- 🔧 **L16.4 Automatikus igazságtábla-teszter** – az Arduino két kimenete adja a bemeneteket (00, 01, 10, 11), egy bemenete olvassa
  a kapu kimenetét, és kiírja az igazságtáblát; a sketch felismeri, melyik kaput építettük („Ez egy NOR!”). Ez a teszter a
  17–19. fejezetben is visszatér.
- 🔧 **L16.5 NAND-ból minden** – két tranzisztoros NAND-kapuból (4 db S8050) NEM és ÉS; a teszterrel ellenőrizve.
- 🛒 *Opcionális:* ugyanez 74HC00/02/08/32/86 IC-kkel; adatlap-olvasás (DED 11.).

### Interaktív szemléltetések
- `logic-sandbox` – a közös logikai szimulátor (`logic.js`) első használata: kapukat húzhatsz, összekötheted, a bemeneteket kattintással
  váltod; az igazságtáblát automatikusan generálja.
- `switch-logic` – kapcsolók soros/párhuzamos hálózata ↔ Boole-kifejezés ↔ kapus rajz, három nézet szinkronban.
- `gate-inside` – kattints egy kapura, és nézd meg belülről: diódás / RTL / CMOS változat, élő feszültségekkel a `circuit.js`-ből.
- `de-morgan` – buborék-tologató: egy kapus rajzon a buborékok áthúzhatók, a kifejezés átalakul, az igazságtábla ugyanaz marad.
- `nand-puzzle` – feladványok: építsd meg az adott függvényt csak NAND-kapukból, minél kevesebből.
- `perceptron-gate` (★★★) – súlyok és küszöb csúszkával; ÉS, VAGY megy, XOR nem – vizualizálva a síkon.

### Kvízek
`el16-161`, `el16-162`, `el16-163`, `el16-165`, `el16-166`, `el16-167`, `el16-final`.

### Csapdák
A Boole-algebra „+”-a nem összeadás ($1 + 1 = 1$) · De Morgan alkalmazásakor elfelejteni a műveletet is megfordítani · a XOR és a VAGY
keverése a köznyelvben („vagy … vagy”) · a diódás kapuk láncolása.

### Források
DED 1. (*The Underpinnings of Digital Electronics*), 2. (Boole-algebra – eleje), 3.; MME 15. (*It's All So Logical!*), 16–17.
(logikai kísérletek, 🛒); END 6. (*Integrated Circuits*); Kiegészítés (RTL/DTL történet, CMOS).

---

## 17. fejezet – Kombinációs hálózatok tervezése: igazságtáblától a kapcsolásig ★★

**Nagy kérdés:** *Hogyan tervezzük meg azt az áramkört, amely egy 4 bites számból kigyújtja a 7 szegmenses kijelző
megfelelő szegmenseit?*

### Felépítés
1. **17.1 Szövegből igazságtábla** ★ – a specifikáció formalizálása; példák: többségi szavazó (3 bemenet), riasztó (ajtó ÉS élesítve
   VAGY pánikgomb).
2. **17.2 Igazságtáblából kifejezés: diszjunktív normálforma** ★★ – minterm (az „1”-es sorok ÉS-tagjai) VAGY-olva; konjunktív
   normálforma röviden („🔁 Kapcsolat: Logika”).
3. **17.3 Egyszerűsítés algebrával** ★★ – a 16.5 szabályaival.
4. **17.4 Karnaugh-tábla** ★★ – 2, 3, 4 változóra; csoportosítás 1, 2, 4, 8 cellás téglalapokba; körbefordulás a széleken;
   közömbös („don't care”) bejegyzések (DED 2.).
5. **17.5 Nevezetes kombinációs egységek** ★★ – dekóder (2→4, BCD → 7 szegmens), multiplexer (adatválasztó), demultiplexer,
   enkóder, komparátor (DED 6.).
6. **17.6 Megvalósítás: kapuk, ROM vagy program** ★★ – ugyanaz a függvény kapukkal, diódamátrixos „ROM”-mal, és táblázatként
   egy Arduino-sketchben (*lookup table*) – a tervezési döntés szempontjai.
7. **17.7 Késleltetés és hazárd** ★★★ – a kapuk késleltetése; statikus hazárd egy példán; miért kell az órajel (→ 19. fejezet).
8. **17.8 Alkalmazás: 🗼 torony v5** – az üzemmód kijelzése 7 szegmensen.

### Kidolgozott példák
- Többségi szavazó: igazságtábla → DNF (4 minterm) → egyszerűsítve $AB + AC + BC$.
- Ugyanez Karnaugh-táblával.
- A 7 szegmenses dekóder „a” szegmensének Karnaugh-táblája 0–9-re, a 10–15 közömbös.
- 4 → 1 multiplexer kifejezése.

### Laborok
- 🔧 **L17.1 Többségi szavazó** – három nyomógomb, három tranzisztoros/diódás kapuból (vagy diódamátrixszal) → LED; a teszterrel
  (L16.4, 3 bemenetre bővítve) ellenőrizve.
- 🔧 **L17.2 7 szegmenses kijelző kézzel** (KIT-L13) – a szegmensek közvetlenül lábakról (7 × 220 Ω); közös anód vagy katód? (dióda-teszt);
  a 0–9 számjegyek kódolása táblázatként (a dekóder igazságtáblája).
- 🔧 **L17.3 Dekóder kapukkal vs. táblázattal** – egy szegmens (pl. „a” vagy „g”) megvalósítása diódás-tranzisztoros logikával a
  Karnaugh-tábla alapján, és mellette a teljes dekóder táblázatként a sketchben: a két megoldás ugyanazt mutatja.
- 🔧 **L17.4 Multiplexer szoftverben és hardverben** – négy kapcsoló, két „cím”-gomb, egy kimeneti LED; a 4 digites kijelző
  (KIT-L14) multiplexelése mint alkalmazás előzetese.
- 🔧 **L17.5 🗼 Torony v5** – üzemmód 7 szegmensen.

### Interaktív szemléltetések
- `truth-to-dnf` – igazságtábla kattintható kimeneti oszloppal → DNF → egyszerűsített alak → kapus rajz, automatikusan.
- `karnaugh` – interaktív Karnaugh-tábla 2–4 változóra: a tanuló jelöli a csoportokat, a program ellenőrzi (minimális-e), és megmutatja
  a Quine–McCluskey eredményét összevetésre.
- `seven-seg-designer` – 7 szegmenses kijelző: kattints a szegmensekre minden számjegyhez → generálja a dekóder igazságtábláját és a
  szegmensenkénti Karnaugh-táblákat.
- `mux-demux` – adatválasztó animáció, címbitekkel.
- `hazard` (★★★) – egy kapuhálózat időzítési diagramja késleltetésekkel; a tüske (glitch) megjelenése és eltüntetése redundáns taggal.

### Kvízek
`el17-171`, `el17-172`, `el17-173`, `el17-174`, `el17-175`, `el17-177`, `el17-final`.

### Csapdák
Karnaugh-táblában a sorrend nem bináris, hanem **Gray-kód** (00, 01, 11, 10) · a körbefordulás elfelejtése · nem kettőhatvány méretű
csoport · közömbös cellákat kötelezően lefedni · közös anódos kijelzőnél a logika fordított.

### Források
DED 2. (*Effectively Optimizing Combinatorial Circuits* – Karnaugh), 6. (*Practical Combinatorial Circuit Applications*); MME 19–21.
(dekóderek, 🛒); KIT L13, L14.

---

## 18. fejezet – Számrendszerek és bináris aritmetika: az összeadó ★★

**Nagy kérdés:** *Hogyan ad össze egy áramkör, amely csak ÉS-t, VAGY-ot és NEM-et ismer? És hogyan tárol negatív számot?*

### Felépítés
1. **18.1 Helyiértékes számrendszerek** ★ – tízes, kettes, tizenhatos; átváltás (osztásos és helyiértékes módszer); bit, bájt, nibble.
2. **18.2 Bináris összeadás kézzel** ★ – átvitel (carry).
3. **18.3 A félösszeadó és a teljes összeadó** ★★ – igazságtábla → $S = A \oplus B$, $C = A \cdot B$; a teljes összeadó két félösszeadóból.
4. **18.4 Több bites összeadó** ★★ – soros átvitelű (ripple-carry); késleltetés; átvitel-előrejelzés röviden (★★★).
5. **18.5 Negatív számok: kettes komplemens** ★★ – miért éppen ez; kivonás összeadással; túlcsordulás. Az Arduino `int` (16 bit) túlcsordulása.
6. **18.6 Egyéb kódok** ★★ – BCD (a 7 szegmenses kijelzőhöz), Gray-kód (a Karnaugh-tábla és a forgó jeladók miatt), ASCII (az LCD-hez).
7. **18.7 Bitműveletek a programban** ★★ – `&`, `|`, `^`, `~`, `<<`, `>>`; maszkolás – ezek kellenek a 20. és 24. fejezetben.

### Kidolgozott példák
- 45 → 101101₂ → 2D₁₆.
- 0110 + 0111 kézzel, átvitelekkel.
- −5 kettes komplemensben 8 biten (11111011); 100 + 50 8 bites előjeles számként → túlcsordulás.
- Egy bájt 3. bitjének beállítása, törlése, átbillentése maszkkal.

### Laborok
- 🔧 **L18.1 Bináris számláló LED-sorral** (KIT-L7 kapcsolása) – a 10 szegmenses LED-sor alsó 8 eleme egy bájtot mutat; gombnyomásra +1;
  a Serial Monitor kiírja tízes, kettes és tizenhatos alakban.
- 🔧 **L18.2 Félösszeadó tranzisztorokból** – XOR (NAND-okból, L16.5) + ÉS; két LED (S és C); a teszterrel ellenőrizve.
  *(Ha kevés a tranzisztor – 4 NPN + 4 PNP van –, az XOR-t diódás–tranzisztoros vegyes kapcsolással vagy az Arduino-emulációval.)*
- 🔧 **L18.3 4 bites összeadó „szoftveres hardverrel”** – a sketch kapuszinten (csak `&`, `|`, `^` bitműveletekkel) valósít meg
  egy ripple-carry összeadót; bemenet a 4 × 4 billentyűzetről, kimenet LED-soron és 7 szegmensen.
- 🔧 **L18.4 Túlcsordulás** – `int` és `byte` változó számlálása a határ felett; mit lát a soros monitor és miért.

### Interaktív szemléltetések
- `base-converter` – szám bármely alapban; a helyiértékek felbontása; bitenként kattintható bináris kijelző.
- `adder-chain` – 4 bites ripple-carry összeadó kapuszinten a `logic.js`-ben; az átvitel terjedése animálva, késleltetéssel.
- `twos-complement` – „számkör”: 8 bites számok körben, előjel nélküli és kettes komplemens címkével; túlcsordulás a körön.
- `bitmask` – bájt bitjei, maszk, művelet → eredmény; feladványok.

### Kvízek
`el18-181`, `el18-183`, `el18-184`, `el18-185`, `el18-186`, `el18-187`, `el18-final`.

### Csapdák
A helyiértékek számozása 0-tól · a kettes komplemensben „csak az előjelbit” megfordítása · az előjel nélküli és előjeles túlcsordulás
keverése · BCD-t binárisnak venni.

### Források
DED 4. (*Number Systems*), 5. (*Binary Arithmetic Using Digital Electronics*); MME 24–25. (*Adding It Up*, *Enhancing Your Adder*, 🛒);
KIT L7, L13, L21.

---

## 19. fejezet – Sorrendi hálózatok: tárolók, flip-flopok, állapotgépek ★★

**Nagy kérdés:** *Hogyan „emlékszik” egy áramkör? Hogyan lehet, hogy egy gombnyomás után a lámpa égve marad, pedig már
elengedtük a gombot?*

### Felépítés
1. **19.1 Visszacsatolás a digitális világban** ★ – egy kapu kimenete visszakötve a bemenetére; két inverter körben = két stabil állapot.
2. **19.2 Az SR-retesz** ★★ – két keresztbe kötött NOR (vagy NAND); set, reset, tiltott állapot; **két tranzisztorból** (bistabil multivibrátor).
3. **19.3 Pergésmentesítés SR-retesszel** ★★ – a váltókapcsoló + retesz klasszikus megoldása (15.6 visszautal).
4. **19.4 A D-retesz és a D flip-flop** ★★ – szintvezérlés vs. élvezérlés; master–slave elv; előkészítési és tartási idő (setup/hold) szemléletesen.
5. **19.5 JK és T flip-flop** ★★ – T flip-flop = frekvenciaosztó (→ 20. fejezet számlálói).
6. **19.6 Szinkron tervezés és órajel** ★★ – miért egyetlen órajel üteméhez igazítunk mindent (17.7 hazárd megoldása).
7. **19.7 Véges állapotgépek** ★★ – állapotok, átmenetek, kimenetek; állapotdiagram → állapottábla → kód (`switch` a sketchben);
   Moore és Mealy röviden. Példák: közlekedési lámpa, kódzár, 🗼 a torony üzemmódjai.
8. **19.8 Alkalmazás: kódzár** – 4 × 4 billentyűzet + állapotgép + szervó (KIT-L21, L15).

### Kidolgozott példák
- SR-retesz igazságtáblája az előző állapottal ($Q_{n+1}$); a tiltott S = R = 1 eset.
- D flip-flop időzítési diagramja egy adott órajel- és adatsorozatra.
- Közlekedési lámpa állapotgépe: 4 állapot, időzítéssel.
- Kódzár „1-2-3-A” állapotdiagramja (mi történik rossz gombnál?).

### Laborok
- 🔧 **L19.1 Kéttranzisztoros tároló** – két S8050 keresztbe kötve (kollektor → 10 kΩ → másik bázis), két LED a kollektorokban,
  két gomb a bázisok földre húzására: a LED-ek „emlékeznek” az utolsó gombnyomásra. Feszültségek mérése mindkét állapotban.
- 🔧 **L19.2 Retesz kapukból** – két tranzisztoros NOR (L16.3) keresztbe kötve; a tiltott állapot kipróbálása.
- 🔧 **L19.3 Flip-flop az Arduinóban** – D flip-flop emulálva: az órajel egy gomb (pergésmentesítve!), az adat egy kapcsoló; LED-kimenet;
  a teszter rögzíti az időzítési diagramot és kirajzolja a `scope` widgetben.
- 🔧 **L19.4 🗼 Torony v6: állapotgép** – üzemmódok (ki, folyamatos, villogó, „lélegző”, szenzoros) állapotgépként; állapotdiagram
  előbb papíron, aztán `switch`.
- 🔧 **L19.5 Kódzár** – 4 × 4 billentyűzet (mátrix-szkennelés magyarázata: sorok/oszlopok – 17.5 dekóder visszautal) + szervó; hibás
  kódnál a zümmer szól.

### Interaktív szemléltetések
- `latch-builder` – két kapu összekötése a `logic.js`-ben; a visszacsatolt hurok állapota animálva; a tiltott állapot „versenyhelyzete”.
- `bistable-transistor` – a kéttranzisztoros tároló a `circuit.js`-ben, élő feszültségekkel.
- `timing-diagram` – D, JK, T flip-flop: rajzolj bemeneti jelalakot, a kimenet automatikusan; setup/hold megsértése piros.
- `fsm-editor` – állapotgép-szerkesztő: állapotok, átmenetek, kimenetek; lépésenkénti futtatás; Arduino-kód generálása.
- `traffic-light` – közlekedési lámpa állapotgépe animációval.

### Kvízek
`el19-191`, `el19-192`, `el19-194`, `el19-195`, `el19-196`, `el19-197`, `el19-final`.

### Csapdák
Retesz és flip-flop összekeverése · az SR tiltott állapota · aszinkron bemenet (gomb) közvetlenül szinkron logikába · állapotgépben
hiányzó átmenet (beragad).

### Források
DED 7. (*Feedback and Sequential Circuits*), 9. (*Complex Sequential Circuits*); MME 18. (*Time to Switch*), 26. (🛒); KIT L15, L21.

---

## 20. fejezet – Számlálók, regiszterek, léptetőregiszter (74HC595) ★★

**Nagy kérdés:** *Az Arduinónak „csak” 54 digitális lába van – hogyan vezérel mégis egy 64 LED-es mátrixot, vagy akár
százakat?*

### Felépítés
1. **20.1 A regiszter** ★ – több flip-flop közös órajellel = több bites tároló.
2. **20.2 Aszinkron (hullámzó) számláló** ★★ – T flip-flopok láncban; frekvenciaosztás kettő hatványaival; a hullámzás késleltetése.
3. **20.3 Szinkron számláló** ★★ – közös órajel; modulo-$n$ számláló (pl. 0–9, BCD); fel/le számlálás.
4. **20.4 A léptetőregiszter** ★★ – soros be, párhuzamos ki (SIPO); soros adatátvitel elve; gyűrűs számláló és Johnson-számláló.
5. **20.5 A 74HC595 belülről** ★★ – adatlap-olvasás (DS): SER, SRCLK, RCLK (latch!), OE, QH′; a tárolóregiszter szerepe
   (nincs villogás léptetés közben); láncolás.
6. **20.6 Multiplexelés** ★★ – 4 digites 7 szegmenses és 8 × 8 mátrix: soronkénti gyors kapcsolgatás + szemünk tehetetlensége;
   frissítési frekvencia és fényerő.
7. **20.7 LFSR és álvéletlen számok** ★★★ – léptetőregiszter XOR-visszacsatolással; maximális hosszú sorozat (MME 35.);
   „🔁 Kapcsolat: Valószínűségszámítás”.
8. **20.8 Léptetőmotor mint „számláló”** ★★ – a tekercsek gerjesztési sorrendje egy gyűrűs számláló (KIT-L26).

### Kidolgozott példák
- 4 bites aszinkron számláló: 16 MHz-es órajelből a 4. kimeneten 1 MHz.
- 0110 léptetése 3 órajelen át egy 4 bites SIPO-ban (táblázat).
- 74HC595-be a 0b10110001 kiírása: bitsorrend (`MSBFIRST` vs. `LSBFIRST`).
- 8 × 8 mátrix, 1 ms soronként → 125 Hz képfrissítés.

### Laborok
- 🔧 **L20.1 74HC595 lépésről lépésre** – az órajelet és az adatot **kézzel, nyomógombokkal** adjuk (pergésmentesítve vagy a
  felhúzó + 100 nF RC-vel); 8 LED a kimeneteken: látjuk a bitek léptetését, majd a latch-impulzusra a megjelenést. Utána ugyanez
  `shiftOut`-tal (KIT-L7/L25 alapján).
- 🔧 **L20.2 Két 595 láncban** – 16 LED, 3 lábról; a QH′ kimenet szerepe.
- 🔧 **L20.3 Számláló a 595-ön** – bináris számláló, Johnson-számláló, Knight Rider-mintázat (gyűrűs számláló).
- 🔧 **L20.4 Multiplexelt kijelzők** – 4 digites 7 szegmenses (KIT-L14) számláló; a frissítési idő növelésével láthatóvá tesszük a
  villogást; 8 × 8 mátrix (KIT-L25) – egy saját ábra.
- 🔧 **L20.5 LFSR-dobókocka** – 8 bites LFSR a sketchben (bitműveletekkel), az eredmény 1–6-ra képezve a 7 szegmensen; 1000 dobás
  gyakorisága a Serial Monitoron (egyenletes?).
- 🔧 **L20.6 Léptetőmotor** (KIT-L26) – ULN2003; teljes és fél lépés sorrendje kézzel kódolva; lépésszám/fordulat mérése.
- 🔧 **L20.7 🗼 Torony v7** – fényjáték-minták LED-soron 595-tel.

### Interaktív szemléltetések
- `counter-sim` – aszinkron és szinkron számláló kapuszinten; időzítési diagram; a hullámzó számláló „glitch”-ei.
- `shift-register` – 74HC595 belső felépítése: léptető- és tárolóregiszter; SER, SRCLK, RCLK kattintható; a bitek animálva.
- `multiplex-persistence` – 4 digit multiplexelése; frissítési frekvencia csúszka; „lassított felvétel” mód.
- `lfsr` – LFSR-szerkesztő: hossz és megcsapolások; a periódushossz és a sorozat; maximális hosszúságú polinomok.
- `stepper-sequence` – teljes / fél lépés, hullámgerjesztés; a forgórész szöge.

### Kvízek
`el20-202`, `el20-203`, `el20-204`, `el20-205`, `el20-206`, `el20-207`, `el20-final`.

### Csapdák
A 74HC595 latch-lábának elfelejtése (semmi nem jelenik meg) · OE aktív alacsony · bitsorrend · a 595 kimenetét túlterhelni (összesen
≈ 70 mA – adatlap!) · multiplexelésnél az egy szegmensre jutó áram időátlaga.

### Források
DED 7., 9. (számlálók, léptetőregiszterek), 11. (adatlap); MME 26–28. (*Running Rings*, *Shifting Bits*, *The Ching Thing*), 35. (*The LFSR*);
KIT L7, L13, L14, L25, L26; DS (74HC595EN.pdf).

---

## 21. fejezet – Időzítés és oszcillátorok: multivibrátor, 555, órajel ★★

**Nagy kérdés:** *Minden sorrendi hálózatnak kell egy „szívverés”. Honnan jön az órajel – és hogyan lehet egy LED-et
villogtatni program nélkül?*

### Felépítés
1. **21.1 Oszcillátor = visszacsatolás + késleltetés** ★ – a 14.7 és a 19.1 összekapcsolása; gyűrűs oszcillátor (páratlan számú inverter).
2. **21.2 Az astabil multivibrátor** ★★ – két tranzisztor + két RC; periódus $T \approx 0{,}693\,(R_1 C_1 + R_2 C_2)$ (CE 9., END 8.).
3. **21.3 Az 555-ös időzítő** ★★ – belső felépítés: két komparátor (14.6!), SR-retesz (19.2!), kisütő tranzisztor (13.!); a
   „mindent egy chipben” pillanat.
4. **21.4 Astabil 555** ★★ – $f \approx \frac{1{,}44}{(R_A + 2R_B)\,C}$; kitöltési tényező; a potméterrel hangolható.
5. **21.5 Monostabil 555** ★★ – egy impulzus adott hosszal; időzítő (pl. „lépcsőházi automata”).
6. **21.6 Kvarc és a mikrovezérlő órajele** ★ – miért 16 MHz és miért kvarc (stabilitás); az órajel mint a 19. fejezet szinkron
   hálózatainak szívverése.
7. **21.7 Frekvenciamérés** ★★ – impulzusszámlálás adott idő alatt vs. periódusidő-mérés; melyik mikor pontosabb (KIT-L29).

### Kidolgozott példák
- Kéttranzisztoros astabil, 10 kΩ / 10 µF mindkét ágban: $T \approx 0{,}139\,\text{s}$, $f \approx 7{,}2\,\text{Hz}$.
- 555 astabil, $R_A = R_B = 10\,\text{k}\Omega$, $C = 10\,\mu\text{F}$: $f \approx 4{,}8\,\text{Hz}$, kitöltés ≈ 67%.
- Mekkora $C$ kell 1 kHz-hez 1 kΩ / 10 kΩ ellenállásokkal? (≈ 69 nF → 100 nF-dal ≈ 690 Hz)
- Monostabil: $T = 1{,}1\,RC$ – 10 kΩ, 10 µF → 0,11 s.

### Laborok
- 🔧 **L21.1 Kéttranzisztoros villogó** – két S8050, két 10 µF, két 10 kΩ bázis- és két 1 kΩ/220 Ω kollektorellenállás + LED-ek:
  felváltva villognak program nélkül. Periódus mérése stopperrel (10 periódus) és az Arduinóval (egyik kollektor → digitális bemenet,
  `pulseIn`). 100 nF-dal: villogás helyett „folyamatos” fény – a multiméter Hz-üzemmódja mutatja a frekvenciát.
- 🔧 **L21.2 555 astabil** (KIT-L29) – LED és passzív zümmer a kimeneten; a potméterrel hangolva; frekvencia a multiméterrel és az
  Arduino-frekvenciamérővel; a kondenzátor feszültségének felvétele (1/3 és 2/3 VCC között fűrészel – a `scope` widgeten).
- 🔧 **L21.3 555 monostabil** – gombnyomásra 1 másodpercig világító LED (10 kΩ ∥ … + 4 × 10 µF ∥ → ≈ 0,44 s; vagy soros 10 kΩ-ok).
- 🔧 **L21.4 Az 555 mint órajel** – az 555 kimenete a 74HC595 SRCLK-jére → „hardveres” futófény, az Arduino csak az adatot adja
  (vagy egy T flip-flop-emulációval osztva).
- 🔧 **L21.5 🗼 Torony v8** – villogás mikrovezérlő nélkül (555), a fényerő továbbra is Arduinóról.

### Interaktív szemléltetések
- `ring-oscillator` – 3, 5, 7 inverter körben; késleltetés → frekvencia.
- `astable-2t` – kéttranzisztoros multivibrátor a `circuit.js`-ben: a két kondenzátor feszültsége és a kollektorok jelalakja.
- `ne555-inside` – az 555 belső blokkvázlata élő állapotokkal (komparátorok, retesz), a kondenzátor fűrészjele a két küszöbbel.
- `ne555-calc` – astabil/monostabil kalkulátor a kit elemeivel; a kívánt frekvenciához a legközelebbi megvalósítható kombináció.
- `freq-measure` – kapuidő vs. periódusidő-mérés pontossága a frekvencia függvényében.

### Kvízek
`el21-211`, `el21-212`, `el21-213`, `el21-214`, `el21-215`, `el21-217`, `el21-final`.

### Csapdák
Az 555 RESET lábát lebegve hagyni · a kitöltés astabil 555-nél mindig > 50% (dióda nélkül) · a képlet $R_B$-jét kétszer számolni ·
elektrolit polaritása az időzítő kondenzátornál.

### Források
DED 8. (*Oscillators*); CE 9. (*Oscillators*); END 8. (*Signal Oscillators*); MME 3–5. (*Quick Facts About the 555*, *That Whooping Sound*);
KIT L29; DS (NE555 – letöltendő).

---

# V. blokk – A mikrovezérlő és a valós világ

## 22. fejezet – Az analóg és a digitális világ határa: ADC, DAC, PWM ★★

**Nagy kérdés:** *Az Arduinónak nincs „analóg kimenete” – hogyan tud mégis fokozatmentesen halványítani egy LED-et, és
hogyan mér ezredvoltos pontossággal feszültséget?*

### Felépítés
1. **22.1 Mintavételezés** ★ – időben diszkrét; mintavételi frekvencia; Nyquist röviden; **aliasing** (a „hátrafelé forgó kerék”).
2. **22.2 Kvantálás** ★ – értékben diszkrét; felbontás ($n$ bit → $2^n$ szint); kvantálási hiba (± ½ LSB) (7.3 visszautal).
3. **22.3 Az ADC működése** ★★ – fokozatos közelítés (bináris keresés!) egy DAC-kal és komparátorral; mintavevő-tartó; az ATmega2560
   ADC-je (≈ 100 µs/konverzió, multiplexer 16 csatornára).
4. **22.4 Referenciafeszültség** ★★ – `analogReference`: DEFAULT, INTERNAL1V1, INTERNAL2V56; nagyobb felbontás kis jelekhez.
5. **22.5 A DAC** ★★ – súlyozott ellenállás-hálózat és **R–2R létra**; felbontás, monotonitás.
6. **22.6 PWM mint „szegény ember DAC-ja”** ★ – kitöltési tényező → átlagfeszültség; RC-szűrés (11.7); a LED-nél a szemünk az aluláteresztő
   szűrő; a motor tehetetlensége. `analogWrite` 8 bit, 490/980 Hz.
7. **22.7 Az érzékelés fizikája a kitben** ★★ – mi méri mit: NTC (ellenállás), fotoellenállás, DHT11 (kapacitív páratartalom + NTC,
   digitális kimenet), HC-SR04 (hangsebesség), PIR (piroelektromos), ADXL345 (MEMS, kapacitív), joystick (két potméter), tilt switch.
8. **22.8 Alkalmazás: 🗼 torony v9** – fokozatmentes, a környezeti fényhez igazodó fényerő (fotoellenállás → ADC → PWM).

### Kidolgozott példák
- 10 bit, 5 V: LSB = 4,88 mV; 1,1 V-os belső referenciával: 1,07 mV.
- Fokozatos közelítés lépésről lépésre 3 biten, 3,1 V-ra (5 V referencia): 100 → 110? → 100 … → 100₂ = 4.
- 3 bites R–2R létra kimenete a 101 kódra: $5 \cdot 5/8 = 3{,}125\,\text{V}$.
- HC-SR04: 1 m távolságnál a visszhang ideje ≈ 5,8 ms (343 m/s).

### Laborok
- 🔧 **L22.1 R–2R DAC** – 3 bites létra **pontosan 10 db 1 kΩ-ból** (R = 1 kΩ, 2R = 2 × 1 kΩ sorosan); 3 digitális láb; a kimenet a multiméteren
  és az A0-n; 8 kód → 8 lépcső; a nemlinearitás mérése (az ellenállások tűréséből). Lépcsős „fűrészjel” a Serial Plotteren.
- 🔧 **L22.2 Fokozatos közelítés kézzel** – a DAC (L22.1) + a sketch mint „komparátor és vezérlő”: bináris kereséssel méri a potméter
  feszültségét 3 biten, lépésenként kiírva – egy saját ADC.
- 🔧 **L22.3 Lélegző LED** (KIT-L8) és **RGB-keverő** (KIT-L9, joystick-kal / potméterekkel) – PWM.
- 🔧 **L22.4 Aliasing** – a sketch szándékosan lassan mintavételez egy 555 (vagy `tone()`) jelet; a mért „frekvencia” hamis.
- 🔧 **L22.5 Ultrahangos távolságmérés** (KIT-L19) – időmérés → távolság; a hangsebesség hőmérséklet-függésének korrekciója a DHT11
  hőmérsékletével (KIT-L18) – két szenzor együtt.
- 🔧 **L22.6 🗼 Torony v9** – fényhez igazodó fényerő.

### Interaktív szemléltetések
- `sampling` – folytonos jel, mintavételi pontok csúszkával; rekonstrukció; aliasing kör/kerék animációval.
- `sar-adc` – fokozatos közelítés animációja: a DAC lépései, komparátor-döntések, a bitek kitöltődése.
- `r2r-ladder` – R–2R létra a `circuit.js`-ben, bitkapcsolókkal; tűrés csúszkával → nemlinearitás.
- `pwm-filter` – PWM kitöltés + RC-szűrő → kimenet, hullámosság; a szem / motor / RC „szűrő” összevetése.
- `sensor-gallery` – a kit érzékelői: fizikai elv, kimenet típusa (analóg, digitális, időtartam, protokoll), interfész.

### Kvízek
`el22-221`, `el22-222`, `el22-223`, `el22-225`, `el22-226`, `el22-227`, `el22-final`.

### Csapdák
A PWM nem valódi analóg feszültség (multiméterrel DC-ben az átlagot látjuk) · minden lábon van PWM (nincs – csak a jelölteken) · a felbontás
nem pontosság · az ADC referenciájának változása (USB-táp ingadozik).

### Források
DED 10. (*Circuit Interfaces*), 12.; END 9. (*Analog-to-Digital Conversion* – rövid); KIT L8, L9, L12, L18, L19, L20, L23, L27, L30;
DS (ATmega2560 ADC fejezet).

---

## 23. fejezet – Kommunikáció: soros protokollok, buszok, kijelzők ★★

**Nagy kérdés:** *Hogyan „beszélget” az Arduino a számítógéppel, a gyorsulásmérővel és a távirányítóval – és honnan tudja
a vevő, hol kezdődik egy bájt?*

### Felépítés
1. **23.1 Párhuzamos és soros átvitel** ★ – vezetékszám vs. sebesség; az LCD1602 4 bites párhuzamos busza (HD44780) vs. soros protokollok.
2. **23.2 UART** ★★ – start-, adat-, stopbit; baudráta; az USB–soros átalakító; a Serial Monitor mögött (KIT-L5).
3. **23.3 SPI-szerű kommunikáció** ★★ – órajel + adat + kiválasztás; a 74HC595 már ilyen volt (20.5); az ADXL345 SPI-n is mehet.
4. **23.4 I²C** ★★ – két vezeték (SDA, SCL), címek, nyitott kollektoros kimenet + felhúzó ellenállás (15.5 visszautal!); ADXL345 (KIT-L20).
5. **23.5 Egyvezetékes protokollok** ★★ – DHT11: impulzushossz-kódolás (KIT-L18).
6. **23.6 Infravörös távirányító** ★★ – 38 kHz-es vivő, NEC-protokoll (impulzus-szünet kódolás), címek és parancsok (KIT-L17).
7. **23.7 Kijelzők** ★ – LCD1602 (karaktergenerátor, ASCII), pontmátrix és 7 szegmens (20. fejezet), parancsok és adatok.
8. **23.8 Megbízhatóság** ★★ – paritás, ellenőrzőösszeg (a DHT11 ötödik bájtja), időtúllépés.
9. **23.9 Alkalmazás: 🗼 torony v10** – IR távirányítóval vezérelt üzemmódok, állapot az LCD-n (KIT-L31–L33).

### Kidolgozott példák
- 9600 baud: egy bájt (10 bit kerettel) ≈ 1,04 ms; 115200 baud: ≈ 87 µs.
- A „A” betű (0x41) UART-kerete bitenként.
- I²C-cím és olvasás/írás bit egy bájtban.
- DHT11 adatcsomag dekódolása és ellenőrzőösszeg számítása egy minta-bájtsorozatból.

### Laborok
- 🔧 **L23.1 UART lassítva** – a sketch „bitbang”-gel 2 baudon küld egy karaktert egy LED-re: szemmel olvasható a start-, adat- és stopbit;
  utána valós sebességen a Serial Monitorra.
- 🔧 **L23.2 Arduino-logikai analizátor** – a sketch nagy sebességgel mintavételez egy lábat, a `scope` widget idődiagramként rajzolja:
  a DHT11 válaszát és az IR-vevő kimenetét „lefényképezzük”, és kézzel dekódoljuk.
- 🔧 **L23.3 Gyorsulásmérő I²C-n** (KIT-L20) – ADXL345: a nehézségi gyorsulás tengelyenként; billentés → szög; a felhúzó ellenállások szerepe.
- 🔧 **L23.4 Kijelzők** – LCD1602 (KIT-L11): szöveg, saját karakter; kontraszt a potméterrel (feszültségosztó!).
- 🔧 **L23.5 IR távirányító** (KIT-L17) – gombok kódjainak kiolvasása; az impulzushosszak mérése.
- 🔧 **L23.6 🗼 Torony v10** – távirányítás + LCD-állapotkijelzés; PIR-ral (KIT-L30) jelenlét-érzékelés.

### Interaktív szemléltetések
- `uart-frame` – karakter → bitkeret animálva; baudráta; a vevő mintavételi pontjai (bitközép); rossz baudrátánál értelmetlen karakterek.
- `i2c-bus` – két vezeték, több eszköz; START, cím, ACK, adat, STOP lépésenként; nyitott kollektor + felhúzó.
- `nec-ir` – az IR-vivő, a burkoló és a dekódolt bitek három sávban.
- `dht11-decoder` – impulzushossz-sorozat → bitek → bájtok → hőmérséklet, páratartalom, ellenőrzőösszeg.
- `protocol-compare` – UART / SPI / I²C / 1-wire: vezetékszám, sebesség, címzés, órajel – döntési táblázat interaktívan.

### Kvízek
`el23-232`, `el23-233`, `el23-234`, `el23-235`, `el23-236`, `el23-238`, `el23-final`.

### Csapdák
TX–TX összekötés (TX–RX kell) · eltérő baudráta · I²C felhúzó nélkül · 3,3 V-os eszköz 5 V-os buszon (szintillesztés, 15.7) · közös föld
hiánya két eszköz között.

### Források
DED 10. (*Circuit Interfaces*), 13. (*PC Interfacing Basics*); KIT L5, L11, L17, L18, L20, L30–L33; DS (ADXL345.pdf, 1602lcd.pdf).

---

## 24. fejezet – A mikrovezérlő belülről: az ATmega2560 ★★–★★★

**Nagy kérdés:** *Mi történik pontosan, amikor a `digitalWrite(13, HIGH)` sor lefut? Hogyan lesz a tranzisztorokból,
kapukból és flip-flopokból egy programozható gép?*

**Cél:** az egész témakör összekapcsolása – a 16–21. fejezet építőkockái (kapuk, összeadó, regiszter, számláló, multiplexer,
órajel) a processzorban.

### Felépítés
1. **24.1 A számítógép építőkockái** ★★ – ALU (az összeadó, 18.), regiszterek (20.), utasításszámláló (számláló, 20.), dekóder (17.), memória,
   órajel (21.) – egy minimális processzor modellje (DED 12.).
2. **24.2 Memóriák** ★★ – flash (program), SRAM (változók), EEPROM (tartós adat); kapacitások az ATmega2560-ban (256 KB / 8 KB / 4 KB).
3. **24.3 Utasításciklus** ★★ – lehívás, dekódolás, végrehajtás; 16 MHz → 62,5 ns/ciklus.
4. **24.4 I/O-portok mint regiszterek** ★★ – DDRx, PORTx, PINx; a láb belső felépítése (kimeneti fokozat, felhúzó, Schmitt-bemenet, védődiódák –
   minden eddigi fejezetből egy darab!); közvetlen portkezelés vs. `digitalWrite`.
5. **24.5 Időzítők és PWM hardveresen** ★★ – a timer egy számláló + komparátor; így áll elő a PWM (22.6).
6. **24.6 Megszakítások** ★★ – külső és időzítő-megszakítás; a pergés-számláló (L15.3) újra.
7. **24.7 Alacsony fogyasztás** ★★★ – alvó üzemmódok; CMOS dinamikus fogyasztás ∝ frekvencia.
8. **24.8 Kitekintés** ★★★ – mikrovezérlő vs. FPGA vs. PC-processzor; hardveres MI-gyorsítók.

### Kidolgozott példák
- `PORTB |= (1 << PB7);` – melyik lábat kapcsolja, és miért (bitmaszk, 18.7).
- `digitalWrite` vs. közvetlen portírás: ciklusszám-becslés.
- Időzítő: 16 MHz, 64-es előosztó, 8 bites számláló → PWM-frekvencia ≈ 976 Hz (fázishelyes módban 490 Hz).

### Laborok
- 🔧 **L24.1 Sebességverseny** – egy láb villogtatása `digitalWrite`-tal és közvetlen portírással; a frekvencia a multiméterrel (ha a tartomány
  engedi) vagy egy másik láb `pulseIn`/számlálással; a különbség aránya.
- 🔧 **L24.2 Egyszerre 8 láb** – egy teljes port egyetlen utasítással: 8 LED egyszerre vált (vs. egymás után – a különbség a logikai
  analizátoron L23.2).
- 🔧 **L24.3 Időzítő-megszakítás** – pontos 1 Hz-es villogás `delay` nélkül, miközben a `loop` mást csinál (pl. gombot figyel).
- 🔧 **L24.4 EEPROM** – a 🗼 torony utolsó üzemmódja áramszünet után is megmarad.
- 🔧 **L24.5 Fogyasztás** – a 9 V-os elemről felvett áram normál és alvó üzemmódban (L5.3 módszerével).

### Interaktív szemléltetések
- `mini-cpu` – egy 4 bites játékprocesszor (néhány utasítás: LOAD, ADD, JMP, OUT) a `logic.js`-ben: regiszterek, ALU, utasításszámláló; lépésenként
  futtatható kis programokkal (pl. számlálás LED-eken).
- `pin-anatomy` – az ATmega-láb belső kapcsolása; DDR/PORT/PIN bitek kattinthatók; a lehetséges állapotok (kimenet H/L, bemenet, felhúzó).
- `timer-pwm` – számláló értéke fűrészként, összehasonlító szint → PWM-kimenet; előosztó és mód.
- `memory-map` – flash / SRAM / EEPROM térkép, mi hová kerül egy sketchből.

### Kvízek
`el24-241`, `el24-242`, `el24-244`, `el24-245`, `el24-246`, `el24-final`.

### Csapdák
A lábszám és a portbit összekeverése (Mega 13. láb = PB7) · közvetlen portírással a soros port lábait (PE0/PE1) felülírni · megszakításban
`delay` vagy hosszú `Serial.print` · `volatile` hiánya.

### Források
DED 12. (*Computer Processors and Support*), 13.; DS (ATmega2560 adatlap – letöltendő); KIT („About Arduino”).

---

## 25. fejezet – Záróprojekt: a Világítótorony és saját tervek ★★

**Nagy kérdés:** *Össze tudod-e rakni mindazt, amit tanultál, egyetlen működő eszközzé – úgy, hogy minden alkatrészéről
meg tudod mondani, miért van ott?*

### Felépítés
1. **25.1 A tervezési folyamat** ★ – követelmények → blokkvázlat → áramköri terv (számításokkal: ellenállások, áramköltségvetés) →
   szimuláció → breadboard → mérés → hibakeresés → dokumentáció.
2. **25.2 A 🗼 Világítótorony végső változata** ★★ – fényérzékelés, fokozatmentes PWM, üzemmód-állapotgép, 7 szegmens / LCD, IR-távirányítás,
   EEPROM, 555-ös vész-villogó (ha az Arduino „lefagy”), tranzisztoros meghajtás. Minden blokk visszautal a fejezetére.
3. **25.3 Választható projektek** ★★ – mindegyikhez specifikáció, blokkvázlat, alkatrészlista a kitből, mérföldkövek:
   - **Reakcióidő-mérő** – LED + gomb + 4 digites kijelző, ms pontossággal; statisztika a Serial Monitoron;
   - **Digitális széf** – billentyűzet + állapotgép + szervó + zümmer + EEPROM-ban tárolt kód;
   - **Mérőállomás** – DHT11 + NTC + fotoellenállás, LCD-n és a böngészőben (Web Serial) grafikonon;
   - **Dőlésjelző vízmérték** – ADXL345 + 8 × 8 mátrix (a „buborék” mozog);
   - **Mini zongora** – billentyűzet + passzív zümmer + LED-sor;
   - **Kétkerekű „napraforgó”** – két fotoellenállás + szervó a fényforrás követésére (KIT-L28 továbbfejlesztve, P-szabályozóval).
4. **25.4 Hibakeresés módszeresen** ★★ – feloszt és ellenőriz; mérés csomópontonként (2. fejezet!); a „jóslat – mérés” összevetés mint fő eszköz.
5. **25.5 Dokumentáció** ★ – kapcsolási rajz, mérési napló, kód; a `lab-log` exportja.

### Interaktív szemléltetések
- `project-planner` – blokkvázlat-szerkesztő, amely összeszámolja a lábhasználatot és az áramköltségvetést, és figyelmeztet a konfliktusokra
  (pl. I²C-lábak, PWM-lábak, 20 mA-es korlát).
- `tower-final` – a torony teljes szimulációja; az egyes blokkok ki-be kapcsolhatók.

### Kvízek
`el25-final` (átfogó, a teljes témakörből).

### Források
Minden korábbi forrás; KIT L28, L31–L33; MME 37. (*Is That All?*).

---

## Közös komponensek (elsőként kidolgozandók)

A témakör interaktív anyagainak többsége három közös modulra épül. Ezeket **az 1. fejezet előtt** kell elkészíteni (a gráfelméletnél
a `graph.js`, az analízisnél a `calc.js` mintájára), mert a fejezetek widgetjei rájuk támaszkodnak.

1. **`assets/circuit.js` – áramkör-szimulátor és -rajzoló** (a legnagyobb munka)
   - **Megoldó:** módosított csomóponti analízis (MNA) – lineáris elemek (ellenállás, feszültség- és áramforrás, kapcsoló, potméter); nemlineáris
     elemek Newton–Raphson-iterációval (dióda és LED Shockley-modellel – a kit LED-jeinek paramétereivel; BJT egyszerűsített Ebers–Moll-modellel;
     MOSFET négyzetes modellel); tranziens analízis (kondenzátor, tekercs – visszafelé Euler / trapéz-módszer, állítható lépésköz).
     Mérethatár: ≈ 30 csomópont – a böngészőben valós időben fut.
   - **Rajzoló:** SVG kapcsolási rajz egy egyszerű leíró nyelvből (pl. `R1 n1 n2 220`, `D1 n2 0 LED_RED`), IEC/ANSI jelkészlet; élő feliratok
     (csomóponti potenciál, ágáram), **animált töltésáramlás** (sebesség ∝ áram, irány váltható: technikai / elektron); kattintható kapcsolók,
     húzható potméterek; „virtuális multiméter” mérőcsúcsokkal.
   - **Nézetek:** kapcsolási rajz, időfüggvény-ábra (`scope`), U–I karakterisztika, „vízmodell” mód az első fejezetekhez.
   - **Ellenőrzés:** a megoldó eredményeit `ngspice`-szal vetjük össze egy tesztkészleten (`_parts/elx/spice/`), ≤ 1% eltérés.
2. **`assets/logic.js` – logikai szimulátor**
   - kapuk (NEM, ÉS, VAGY, NAND, NOR, XOR, XNOR, 3 bemenetes változatok), bemeneti kapcsoló/gomb, órajel, LED, 7 szegmens; SR/D/JK/T tárolók;
     magasabb szintű blokkok (multiplexer, dekóder, összeadó, számláló, 74HC595-modell).
   - eseményvezérelt szimuláció kapukésleltetéssel (a hazárd és a hullámzó számláló megmutatásához); **időzítési diagram** nézet.
   - szerkeszthető vászon (húzd-ejtsd, összekötés), igazságtábla-generálás, Boole-kifejezés ↔ kapcsolás oda-vissza.
   - kapcsolat a `circuit.js`-hez: egy kapu „belülről” megnyitható tranzisztorszinten (16.3–16.4).
3. **`assets/lab.js` – laborkomponensek**
   - `breadboard` – breadboard-nézet generálása a kapcsolási leírásból (alkatrészek, jumperek, színezett sorok); a kapcsolódó lyukak kiemelése.
   - `lab-log` – mérési napló: jóslat- és mérésoszlop, automatikus eltérés-számítás, egyenesillesztés (Ohm-törvény, β), mentés `localStorage`-ba,
     CSV-export.
   - `scope` – Web Serial (Chrome/Edge) adatfolyam fogadása egy egyszerű, egységes formátumban (`t,ch1,ch2\n`), élő rajzolás a szimulált görbe
     mellé; Firefox / offline esetén CSV beillesztése a Serial Monitorból.
   - `sketch-box` – a `sketches/` mappa kódjának megjelenítése szintaxiskiemeléssel, „Letöltés” gombbal.
4. **CSS-bővítés (`assets/style.css`)**: `box lab` (zöld keret, 🔧 ikon), `box safety` (piros, ⚡ ikon), alkatrészlista-címkék a kit tételszámaival.
5. **Sketch-gyűjtemény (`elektronika/sketches/`)**: egységes fejléc (labor azonosító, bekötés, várható kimenet), magyar kommentek, a `scope`
   formátumának megfelelő soros kimenet. Minden sketch lefordul (`arduino-cli compile --fqbn arduino:avr:mega`) – ezt a kidolgozáskor ellenőrizzük.

## Javasolt kidolgozási sorrend

1. **`circuit.js` alapváltozat** (lineáris DC-megoldó + rajzoló + töltésanimáció) és **`lab.js`** (`breadboard`, `lab-log`) – ezek kellenek az 0–8. fejezethez.
2. **0. Laborkalauz** – közben a valódi eszközökön **ellenőrizzük a nyitott kérdéseket** (multiméter áramaljzata és frekvenciatartománya, breadboard
   tápsínje, LED-ek nyitófeszültsége) – ezek a későbbi „várható értékek” alapjai.
3. **1–5. fejezet** (fizikai alapok).
4. `circuit.js` bővítése: tranziens (C, L), nemlineáris elemek (dióda, LED, BJT) → **6–14. fejezet**.
5. **`logic.js`** → **15–21. fejezet**.
6. `scope` (Web Serial) élesítése → **22–24. fejezet**.
7. **25. fejezet**, majd a főoldali kártya és a témakör `index.html`-je (a kvízazonosítókkal).

Fejezetenként a munkafolyamat: (1) a laborok kipróbálása a valódi kittel és a mért értékek rögzítése → (2) a számítások Pythonnal/ngspice-szal →
(3) szöveg a `CLAUDE.md` sémája szerint → (4) widgetek → (5) kvízek (`hint` + `explain` mindenhol) → (6) böngészős ellenőrzés (csukott lenyílók!).

## Nyitott kérdések a kidolgozás előtt

1. **Mélység a fizikai részben:** elég-e a középiskolai szint (Coulomb, mező szemléletesen), vagy kell vektoros/integrálos tárgyalás is (★★★)?
   A terv most a szemléletes szintet adja, „Kiegészítés”-ként.
2. **Opcionális vásárlás:** szeretnéd-e beszerezni a 🛒 bővítőcsomagot (74HC-kapuk, 74HC74, LM358, LM393, kondenzátorok)? Ha igen, a 16–21.
   fejezet laborjai „valódi” IC-kkel is megépülnek, és a *Make: More Electronics* kísérleteinek nagy része elérhetővé válik.
3. **Elemtartó:** van-e AA-elemtartó vagy néhány 1,5 V-os elem? (L2.2, L8.2 – ha nincs, a tápmodul és a 9 V-os elem marad.)
4. **Multiméter:** a kézikönyv szerint egyetlen (10 A-es) áramaljzat van, 0,1 mA-es felbontással, és a frekvenciamérés felső határa nehezen
   olvasható (2 kHz?). Az első labor ezt tisztázza; ha a mA-mérés pontatlan, az árammérést feszültségmérésre (söntellenállás) cseréljük.
5. **Programozás mélysége:** a C++/Arduino nyelvet „menet közben” magyarázzuk. Kell-e külön, rövid „Arduino-programozás dióhéjban” függelék?
6. **Web Serial:** Chrome/Edge-et használsz? Ha főleg Firefoxot, a `scope` widget elsődleges bemenete a CSV-beillesztés lesz.
7. **Hálózati áram:** a terv szándékosan kizár minden 230 V-os kísérletet. Ha a háztartási villamosság (biztosíték, FI-relé, védőföldelés)
   bővebben érdekel, az egy külön, csak elméleti fejezet lehet a 11. után.
