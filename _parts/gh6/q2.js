    /* ------------------------------------------------ 6.4 */
    "gh6-64": {
      title: "Kvíz – 6.4 Strukturális egyensúly",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az ellenzék bírálja a kormányt ($-$), a kormány támogatja a szakszervezetet ($+$). Milyen legyen az ellenzék és a szakszervezet viszonya, hogy a háromszög kiegyensúlyozott legyen?`,
          options: [
            R`$-$: az ellenzék a szakszervezetet is bírálja.`,
            R`$+$: az ellenzék támogatja a szakszervezetet.`,
            R`Mindegy: már van egy mínusz, a harmadik él nem számít.`,
            R`Ne legyen köztük viszony: a hiányzó él $-1$-nek számít, és az pont jó.`
          ],
          answer: 0,
          hint: R`Szorozd össze a két ismert előjelet. Mit kell adnia a harmadiknak, hogy a szorzat $+$ legyen?`,
          explain: R`A két ismert él szorzata $(-)(+) = -$: „a barátom ellensége” – itt a kormány barátja az ellenzék ellenfele. A kiegyensúlyozottsághoz a harmadik élnek ezt meg kell erősítenie: $-$. Így $(-)(+)(-) = +$, két mínusz, stabil. A $+$ esetén $+\,+\,-$ lenne: egy mínusz, feszült. A „mindegy” rossz, mert a harmadik él dönti el a paritást. A hiányzó él pedig nem $-1$: ha nincs viszony, háromszög sincs, és nincs mit vizsgálni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy szereplő között minden viszony megvan: $AB+$, $CD-$, és a többi négy él ($AC$, $AD$, $BC$, $BD$) is $-$. Hány feszült háromszög van, és mennyi a frusztrációs index?`,
          options: [
            R`2 feszült háromszög, frusztrációs index 1`,
            R`2 feszült háromszög, frusztrációs index 2`,
            R`0 feszült háromszög, frusztrációs index 0`,
            R`1 feszült háromszög, frusztrációs index 1`
          ],
          answer: 0,
          hint: R`Írd fel mind a négy háromszöget, és számold meg bennük a mínuszokat. A frusztrációs indexnél: van-e olyan él, amely mindkét feszült háromszögben benne van?`,
          explain: R`$ABC$: $+,-,-$ és $ABD$: $+,-,-$ – kiegyensúlyozott. $ACD$: $-,-,-$ és $BCD$: $-,-,-$ – három mínusz, feszült. Mindkét feszült háromszögben benne van a $CD$ él: ha $+$-ra fordítod, mindkettő $+--$ lesz, és a gráf két táborra bomlik, $\{A, B\}$ és $\{C, D\}$. Ezért a frusztrációs index 1. A „2 és 2” azt hiszi, hogy a frusztrációs index a feszült háromszögek száma – nem mindig az: egy él több háromszöget is megjavíthat. A „0 és 0” a $---$-t stabilnak veszi („sok mínusz, de egyenletes”) – ez csak a gyenge egyensúlyban igaz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Öt szereplő körben: $AB+$, $BC-$, $CD-$, $DE+$, $EA+$ (más él nincs). Kiegyensúlyozott-e a gráf, és ha igen, mik a táborok?`,
          options: [
            R`Igen; táborok $\{A, B, D, E\}$ és $\{C\}$`,
            R`Igen; táborok $\{A, B\}$ és $\{C, D, E\}$`,
            R`Nem: két negatív él van, és mindkettő a $C$-be fut`,
            R`Nem: a $C$-nek csak ellenségei vannak, ezért három tábor kell`
          ],
          answer: 0,
          hint: R`Csináld meg a bejárást: $A$ az 1-es táborba; $+$ él mentén ugyanoda, $-$ él mentén a másikba. A végén ellenőrizd az utolsó élt.`,
          explain: R`$A \to 1$; $B$ ($AB+$) $\to 1$; $C$ ($BC-$) $\to 2$; $D$ ($CD-$) $\to 1$; $E$ ($DE+$) $\to 1$; ellenőrzés: $EA+$, 1–1 ✔. A körben két mínusz van – páros, tehát kiegyensúlyozott, a táborok $\{A, B, D, E\}$ és $\{C\}$. A $\{A, B\}$ / $\{C, D, E\}$ beosztás két élt sért: a $CD-$ táboron belül, az $EA+$ táborok között futna (a második mínusz után vissza kell váltani!). Az, hogy a mínuszok hol vannak, nem számít, csak a körönkénti számuk paritása. És egy „magányos” szereplő is lehet tábor.`
        },
        {
          type: "single", shuffle: true,
          q: R`Előjeles gráf: $AB+$, $BC+$, $CA+$, $CD+$, $DE+$, $EA-$. Egyetlen háromszöge, az $ABC$, $+\,+\,+$. Kiegyensúlyozott-e a gráf?`,
          options: [
            R`Nem: az $A$–$C$–$D$–$E$–$A$ körben egy mínusz van; a frusztrációs index 1.`,
            R`Igen: minden háromszöge kiegyensúlyozott.`,
            R`Igen: a táborok $\{A, B, C, D\}$ és $\{E\}$.`,
            R`Nem, és a frusztrációs index 2: a kört két él javítja meg.`
          ],
          answer: 0,
          hint: R`A gráf nem teljes. Elég-e itt a háromszögeket nézni? Keress olyan kört, amely nem háromszög.`,
          explain: R`Nem teljes gráfon a háromszögek ellenőrzése nem elég: minden <b>kör</b> számít. Az $A$–$C$–$D$–$E$–$A$ kör előjelei $+, +, +, -$: egy mínusz, páratlan – a gráf nem kiegyensúlyozott (ugyanígy az $A$–$B$–$C$–$D$–$E$–$A$ kör). Egyetlen fordítás elég (pl. $EA \to +$, vagy $DE \to -$, vagy $CD \to -$), tehát a frusztrációs index 1, nem 2. A $\{A, B, C, D\}$ / $\{E\}$ beosztás nem jó: a $DE+$ él a táborok között futna – ez éppen az egyetlen „hiba”, amit a frusztrációs index számol.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Egy teljes, kiegyensúlyozott előjeles gráfban lehet három, páronként ellenséges tábor.`,
            R`A $-\,-\,-$ háromszög nem kiegyensúlyozott, de gyengén kiegyensúlyozott (három tábor, mindenki egyedül).`,
            R`Ha egy nem teljes előjeles gráf minden háromszöge kiegyensúlyozott, a gráf kiegyensúlyozott.`,
            R`Egy előjeles fa (körmentes gráf) az előjelektől függetlenül mindig kiegyensúlyozott.`,
            R`A kéttáboros beosztásban az egyik tábor lehet üres, és egyetlen szereplő is lehet tábor.`
          ],
          answer: [1, 3, 4],
          hint: "Gondolj a táboronként kiválasztott három szereplőre, a háromszögmentes körre, és arra, hogy egy fában van-e egyáltalán kör.",
          explain: R`Három páronként ellenséges tábor nem fér bele az (erős) egyensúlyba: táboronként egy-egy szereplő $---$ háromszöget alkot, ami kiegyensúlyozatlan – ezt csak a <b>gyenge</b> egyensúly (Davis) engedi meg, amelyben a $---$ háromszög is rendben van, három egyszemélyes táborral. Nem teljes gráfon a háromszögek nem elegendők: egy háromszögmentes kör is tartalmazhat páratlan sok mínuszt. A fában nincs kör, így páratlan mínuszú kör sem – a bejárás sosem talál ellentmondást. A tétel szerint az egyik tábor lehet üres (mindenki barát), és a „magányos ellenfél” is tábor.`
        },
        {
          type: "match",
          q: "Párosítsd az előjeles mintát az állapotával!",
          pairs: [
            [R`$+\,+\,+$ háromszög`, "kiegyensúlyozott, mindhárman egy táborban"],
            [R`$+\,-\,-$ háromszög`, "kiegyensúlyozott: az ellenségem ellensége a barátom"],
            [R`$+\,+\,-$ háromszög`, "feszült, és gyengén sem kiegyensúlyozott"],
            [R`$-\,-\,-$ háromszög`, "feszült Heider szerint, de gyengén kiegyensúlyozott"],
            [R`négyszög $+$, $+$, $+$, $-$ előjelekkel`, "feszült, pedig nincs benne háromszög"]
          ],
          hint: "Számold meg a mínuszokat. Páros → kiegyensúlyozott. Páratlan → feszült; a gyenge egyensúlynál csak a pontosan egy mínusz tilos.",
          explain: R`A $+++$-ban nincs mínusz, a $+--$-ban kettő: mindkettő kiegyensúlyozott (szorzat $+$). A $++-$-ban pontosan egy mínusz van – ez sem az erős, sem a gyenge egyensúlyba nem fér bele. A $---$-ban három mínusz van, páratlan, tehát Heider (és Cartwright–Harary) szerint feszült; Davis gyenge egyensúlyában viszont csak a pontosan egy mínuszú kör tilos, így ez megengedett. A $+++-$ négyszögben egy mínusz van: kiegyensúlyozatlan kör, háromszög nélkül – ezért nem elég a háromszögeket nézni. A tipikus hiba a „sok mínusz = rossz”: a $+--$ stabil, a $++-$ nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét előjeles gráfja: $\mathrm{Ko}$–$\mathrm{Vi}$ $+$, $\mathrm{Sz}$–$\mathrm{Vi}$ $+$, $\mathrm{Po}$–$\mathrm{Ko}$ $+$, $\mathrm{Vi}$–$\mathrm{Po}$ $+$, $\mathrm{Sz}$–$\mathrm{Ko}$ $-$, $\mathrm{La}$–$\text{Ön}$ $+$, $\mathrm{Po}$–$\mathrm{La}$ $+$, $\mathrm{Po}$–$\text{Ön}$ $+$. Melyik egyetlen fordítás teszi kiegyensúlyozottá, és mik lesznek a táborok?`,
          options: [
            R`$\mathrm{Sz}$–$\mathrm{Vi}$ $\to -$; táborok $\{\mathrm{Sz}\}$ és a többiek`,
            R`$\mathrm{Ko}$–$\mathrm{Vi}$ $\to -$; táborok $\{\mathrm{Ko}, \mathrm{Po}, \mathrm{La}, \text{Ön}\}$ és $\{\mathrm{Vi}, \mathrm{Sz}\}$`,
            R`$\mathrm{Sz}$–$\mathrm{Ko}$ $\to +$; táborok $\{\mathrm{Sz}, \mathrm{Ko}\}$ és a többiek`,
            R`$\mathrm{Sz}$–$\mathrm{Vi}$ $\to -$; táborok $\{\mathrm{Sz}, \mathrm{Vi}\}$ és a többiek`
          ],
          answer: 0,
          hint: R`Az egyetlen feszült háromszög a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$. A fordítás után végezd el a bejárást, és nézd meg, nem lesz-e feszült egy <b>másik</b> háromszög.`,
          explain: R`Ha a $\mathrm{Sz}$–$\mathrm{Vi}$ $-$ lesz, a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ háromszög $+--$, és a bejárás a Szakértőt egyedül teszi a másik táborba (mindkét éle, a $\mathrm{Sz}$–$\mathrm{Vi}$ és a $\mathrm{Sz}$–$\mathrm{Ko}$ is $-$). A $\mathrm{Ko}$–$\mathrm{Vi}$ $\to -$ egymagában nem elég: a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$ háromszög $+-+$ lenne, feszült – a megadott beosztásban a $\mathrm{Vi}$–$\mathrm{Po}$ $+$ éle a táborok között futna. A $\mathrm{Sz}$–$\mathrm{Ko}$ $\to +$ is jó fordítás, de akkor mindenki <b>egy</b> táborban van (a másik üres), nem $\{\mathrm{Sz}, \mathrm{Ko}\}$ külön. Az utolsó opció a fordítást jól választja, de a $\mathrm{Sz}$–$\mathrm{Vi}$ $-$ éle nem futhat táboron belül. (A $\mathrm{Kl}$-nek nincs előjeles éle, bármelyik táborba tehető.)`
        }
      ]
    },

    /* ------------------------------------------------ 6.5 */
    "gh6-65": {
      title: "Kvíz – 6.5 Motívumok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy génszabályozó hálózatban 52 előrecsatolt hurok (FFL) van. A nullmodellben átlagosan 40, a szórás 5. Mennyi a z-érték, és motívum-e az FFL ($z > 2$)?`,
          options: [
            R`$z = 2{,}4$ – motívum`,
            R`$z = 12$ – motívum`,
            R`$z = 1{,}3$ – nem motívum`,
            R`$z = 10{,}4$ – motívum`
          ],
          answer: 0,
          hint: "A z azt méri, hány szórásnyira van a megfigyelt érték a nullmodell átlagától.",
          explain: R`$z = (52 - 40)/5 = 12/5 = 2{,}4 > 2$: ehhez a nullmodellhez képest motívum. A $12$ a nyers különbség – szórással osztani kell, különben a „sok” a mértékegységtől függne. Az $1{,}3 = 52/40$ hányados, nem z-érték. A $10{,}4 = 52/5$ kihagyja az átlag levonását. (És ne feledd: egy másik nullmodellhez képest más jöhet ki.)`
        },
        {
          type: "single", shuffle: true,
          q: R`5 csúcs közé 6 élt sorsolsz teljesen véletlenül (a $\binom52 = 10$ lehetséges párból 6-ot). Átlagosan hány háromszög lesz?`,
          options: [R`$\approx 1{,}67$`, R`$\approx 2{,}16$`, R`$\approx 0{,}17$`, R`$10$`],
          answer: 0,
          hint: R`Egy adott csúcshármas akkor háromszög, ha mindhárom párja a kisorsolt élek között van. Mennyi ennek az esélye visszatevés nélkül? És hány csúcshármas van?`,
          explain: R`Egy hármas mindhárom éle $\frac{6}{10}\cdot\frac{5}{9}\cdot\frac{4}{8} = \frac16$ eséllyel van kisorsolva, és $\binom53 = 10$ hármas van: a várható érték $10/6 \approx 1{,}67$. A $2{,}16 = 10 \cdot 0{,}6^3$ úgy számol, mintha az élek egymástól függetlenül, visszatevéssel jönnének – de a sorsolás visszatevés nélküli: ha egy pár már él, a maradék 9 párra csak 5 él jut. A $0{,}17$ csak egy hármas esélye, a hármasok számával nem szoroz. A $10$ a sorrendes hármasokkal ($5 \cdot 4 \cdot 3 = 60$) szoroz, pedig a háromszög csúcsainak sorrendje nem számít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában 4 háromszög van. Fokszámtartó átkötéssel a véletlen gráfokban átlagosan 2,4 a háromszögek száma (szórás 0,8). Mennyi a z, és mit mondhatsz?`,
          options: [
            R`$z = 2{,}0$; feltűnőbb, mint $G(n, m)$-hez képest, de 7 csúcson ingatag: a véletlen gráfok kb. 8%-ában is van legalább 4`,
            R`$z = 2{,}0$; a háromszög biztosan motívum, mert a z nem kisebb 2-nél`,
            R`$z = 1{,}6$; nem motívum`,
            R`$z = 0{,}7$; nem motívum, mert a $G(n, m)$ a szigorúbb nullmodell`
          ],
          answer: 0,
          hint: "Számold ki a z-t. Utána gondold meg: mennyire lehet bízni egy z-értékben, ha a véletlen gráfok csak 7 csúcsúak? És melyik nullmodell tart meg többet?",
          explain: R`$z = (4 - 2{,}4)/0{,}8 = 2{,}0$. A $G(n, m)$-hez képest $z \approx 0{,}7$ volt, a fokszámtartóhoz képest már határeset – de 7 csúcson a véletlen eloszlás nagyon „darabos”, ezért jobb a közvetlen arányt nézni: kb. 8% a véletlen gráfok közül legalább 4 háromszöget ad. A „biztosan motívum” ezt az ingatagságot hagyja figyelmen kívül. Az $1{,}6$ a nyers különbség, szórással nem oszt. A $0{,}7$ a $G(n, m)$ z-je, és a nullmodelleket fordítva rangsorolja: a <b>fokszámtartó</b> a szigorúbb (többet tart meg a gráfból).`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubban 45 háromszög van. $G(n, m)$-hez képest $z \approx 7{,}7$, fokszámtartó átkötéshez képest $z \approx 1{,}2$. Mi a helyes következtetés?`,
          options: [
            R`A háromszögek többségét már a fokszámeloszlás (a két nagy fokú vezető) megmagyarázza; a fokszámtartó modellhez képest nem kiugró.`,
            R`A háromszög a klubban erős motívum, hiszen $z \approx 7{,}7$.`,
            R`A két z ellentmond egymásnak, tehát valamelyik számolás hibás.`,
            R`A fokszámtartó modell rossz kiindulópont, mert kisebb z-t ad.`
          ],
          answer: 0,
          hint: R`Mit tart meg a fokszámtartó átkötés, amit a $G(n, m)$ nem? Ha a megtartott tulajdonság már „legyártja” a háromszögeket, mit mutat a z?`,
          explain: R`A $G(n, m)$ csak a csúcs- és élszámot tartja meg; ehhez képest szinte minden valós hálózat „tele van” háromszöggel. A fokszámtartó átkötés minden fokszámot megtart – és a két 16, illetve 17 fokú vezető körül sok hármas magától is bezárul: átlagosan kb. 39,3 háromszög, $z = (45 - 39{,}3)/4{,}7 \approx 1{,}2$, a véletlen gráfok kb. 14%-ában legalább 45. A „$z \approx 7{,}7$, tehát motívum” csak a gyengébb nullmodellt nézi. A két z nem ellentmond egymásnak, csak más kérdésre felel. A kisebb z nem hiba: a „sok” mindig valamihez képest sok.`
        },
        {
          type: "single", shuffle: true,
          q: R`Irányított gráf: $A \to B$, $B \to C$, $A \to C$, $C \to D$, $B \to D$. Hány előrecsatolt hurok (FFL) és hány irányított 3-kör van benne?`,
          options: [
            R`2 FFL, 0 irányított 3-kör`,
            R`0 FFL, 2 irányított 3-kör`,
            R`1 FFL, 0 irányított 3-kör`,
            R`2 FFL, 2 irányított 3-kör`
          ],
          answer: 0,
          hint: R`Keresd meg a háromszöget alkotó csúcshármasokat (az irányt egyelőre elhagyva), majd mindegyiknél nézd meg: van-e „forrás”, amelyből két nyíl indul, vagy körbeérnek a nyilak?`,
          explain: R`Irány nélkül két háromszög van: $ABC$ és $BCD$. Az $ABC$-ben $A \to B \to C$ és $A \to C$: az $A$ közvetlenül és $B$-n át is hat $C$-re – FFL. A $BCD$-ben $B \to C \to D$ és $B \to D$ – szintén FFL. Egyikben sem érnek körbe a nyilak ($C \to A$ vagy $D \to B$ kellene), így 3-kör nincs. A „2 és 2” minden irányítatlan háromszöget körnek is számol – de az FFL és a 3-kör két <b>különböző</b> minta. Az „1 FFL” a $BCD$ hármast nem veszi észre.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy hírátvételi hálózatban minden él a korábbi cikkre mutat (ki kitől vett át). Melyik minta NEM fordulhat elő benne?",
          options: [
            R`irányított 3-kör ($A \to B \to C \to A$)`,
            R`előrecsatolt hurok ($A \to B$, $B \to C$, $A \to C$)`,
            R`lánc ($A \to B \to C$)`,
            R`közös cél ($A \to C$ és $B \to C$)`
          ],
          answer: 0,
          hint: "Rendezd a cikkeket időrendbe. Melyik mintában kellene valakinek egy későbbi cikkre mutatnia?",
          explain: R`Ha minden nyíl a korábbira mutat, egy körben valahol egy <b>későbbi</b> cikkre kellene mutatni – az időrend nem érhet körbe, ezért irányított 3-kör nem lehet. Az FFL lehetséges: $A$ a legkésőbbi, $C$ a legkorábbi, $B$ köztes, és mindhárom él a korábbira mutat. A lánc és a közös cél is gond nélkül időrendbe állítható. A tipikus hiba az FFL-t és a 3-kört összekeverni: mindkettő irány nélkül háromszög, de csak a kör „ér vissza”.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a jelentésével!",
          pairs: [
            [R`$G(n, m)$ nullmodell`, "a csúcsok és az élek száma marad, minden más véletlen"],
            ["fokszámtartó átkötés", "minden csúcs fokszáma is marad, csak az élpárok cserélődnek"],
            ["z-érték", "hány szórásnyira van a megfigyelt érték a nullmodell átlagától"],
            ["motívum", "kis minta, amely szignifikánsan gyakoribb, mint a nullmodellben"],
            ["triádcenzus", "a 16-féle irányított hármastípus megszámlálása"]
          ],
          hint: "Melyik fogalom egy szabály véletlen gráfok előállítására, melyik egy szám, és melyik egy darabszámlálás?",
          explain: R`A két nullmodell abban különbözik, mit tart meg: a $G(n, m)$ csak $n$-et és $m$-et, a fokszámtartó átkötés ($a$–$b$, $c$–$d$ → $a$–$d$, $c$–$b$) minden fokszámot is. A z-érték $(\text{megfigyelt} - \text{átlag})/\text{szórás}$. Motívumnak csak a nullmodellhez képest szignifikánsan gyakori mintát nevezzük – nyers darabszámból („120 FFL van”) nem. A triádcenzus a 16 nem izomorf irányított hármastípus számlálása (Holland–Leinhardt).`
        }
      ]
    },

    /* ------------------------------------------------ 6.6 */
    "gh6-66": {
      title: "Kvíz – 6.6 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét négy háromszöge közül melyik „rakódott össze” különböző cikkekből (a többi egy-egy cikkből „gyári”)?`,
          options: [
            R`$\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$`,
            R`$\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$`,
            R`$\mathrm{Ko}$–$\mathrm{Sz}$–$\mathrm{Kl}$`,
            R`$\mathrm{Po}$–$\mathrm{La}$–$\text{Ön}$`
          ],
          answer: 0,
          hint: "Keresd meg azokat a cikkeket, amelyek három szereplőt említenek egyszerre. Melyik háromszögnek nincs ilyen cikke?",
          explain: R`A 2. cikk a $\mathrm{Ko}$, $\mathrm{Vi}$, $\mathrm{Po}$, az 5. a $\mathrm{Sz}$, $\mathrm{Kl}$, $\mathrm{Ko}$, a 8. a $\mathrm{La}$, $\mathrm{Po}$, $\text{Ön}$ hármast említi: ez három gyári háromszög. A $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ éleit három különböző forrás adja: $\mathrm{Ko}$–$\mathrm{Vi}$ az 1–2., $\mathrm{Vi}$–$\mathrm{Sz}$ a 4., $\mathrm{Sz}$–$\mathrm{Ko}$ az 5. cikk. Ez az egyetlen összerakott háromszög – és éppen ez a feszült háromszög az előjeles gráfban.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában 21 összefüggő hármas van. Mennyi lenne a $C_\Delta$, ha csak az egyetlen összerakott háromszöget számolnánk, a három gyárit nem?`,
          options: [R`$\approx 0{,}14$`, R`$\approx 0{,}05$`, R`$0{,}25$`, R`$\approx 0{,}57$`],
          answer: 0,
          hint: "Hány zárt hármast ad egyetlen háromszög? A nevező (összefüggő hármasok) változik-e?",
          explain: R`Egy háromszög 3 zárt hármast ad (mindhárom csúcsa lehet középen): $C_\Delta = 3 \cdot 1/21 = 1/7 \approx 0{,}14$. A $0{,}05 = 1/21$ elhagyja a 3-as szorzót. A $0{,}25 = 1/4$ a háromszögek közti arány (négyből egy összerakott) – az nem klaszterezettség. A $0{,}57 = 12/21$ az eredeti érték, a gyári háromszögekkel együtt. A különbség ($0{,}57$ vs. $0{,}14$) mutatja, mennyire felfújja a klaszterezettséget a vetítés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cikk négy szereplőt említ egyszerre. Hány háromszöget hoz létre egymagában az együttemlítési gráfban?`,
          options: [R`$4$`, R`$6$`, R`$24$`, R`$1$`],
          answer: 0,
          hint: R`A négy szereplő mind össze lesz kötve. Hányféleképpen választható ki közülük három?`,
          explain: R`A cikk egy $K_4$-et hoz, és abban minden szereplőhármas háromszög: $\binom43 = 4$. A $6 = \binom42$ az élek (párok) száma, nem a háromszögeké. A $24 = 4 \cdot 3 \cdot 2$ a hármasokat sorrendben számolja. Az $1$ úgy tesz, mintha egy cikk egy háromszöget adna – ez csak háromszereplős cikkre igaz. Általában egy $s$ szereplős cikk $\binom s3$ háromszöget ad „ingyen”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szerda estére az Árvízhét gráfjában ez a 6 él van: $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{Po}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Po}$–$\mathrm{La}$ (a $\mathrm{Kl}$ még izolált). Mennyi a $C_\Delta$?`,
          options: [R`$0{,}375$`, R`$0{,}125$`, R`$\approx 0{,}24$`, R`$\approx 0{,}43$`],
          answer: 0,
          hint: R`Számold ki a fokszámokat, és add össze a $\binom{k_i}2$-ket. Hány háromszög van, és hány zárt hármast ad?`,
          explain: R`Fokszámok: $\mathrm{Ko}$ 2, $\mathrm{Vi}$ 3, $\mathrm{Po}$ 3, $\mathrm{La}$ 2, $\mathrm{Sz}$ 1, $\text{Ön}$ 1, $\mathrm{Kl}$ 0. Összefüggő hármasok: $1 + 3 + 3 + 1 = 8$. Egy háromszög van ($\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$), az 3 zárt hármas: $C_\Delta = 3/8 = 0{,}375$. A $0{,}125 = 1/8$ a 3-as szorzót hagyja el. A $0{,}24$ az átlagos klaszterezettség, $\bar C = (1 + \tfrac13 + \tfrac13)/7 = 5/21$ – a két változat felcserélése. A $0{,}43 = 3/7$ csak azt mondja, a 7 szereplőből hány van háromszögben.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplői közül kinek a legkisebb a helyi klaszterezettsége, és egyben a legnagyobb a köztessége – és miért?`,
          options: [
            R`a Polgármesternek: ő 4 nyitott hármas közepe ($\mathrm{Ko}$–$\mathrm{La}$, $\mathrm{Ko}$–$\text{Ön}$, $\mathrm{Vi}$–$\mathrm{La}$, $\mathrm{Vi}$–$\text{Ön}$), ezeket a párokat csak ő köti össze`,
            R`a Kormánynak: neki van a legtöbb háromszöge (3), ezért ő a legközpontibb`,
            R`a Klímaváltozásnak: $C = 1$, tehát minden társát összeköti`,
            R`a Vízügynek: ő van a feszült háromszög közepén, mindkét fél rá hivatkozik`
          ],
          answer: 0,
          hint: R`Nézd meg a 4 fokú szereplőket: hány pár van a társaik között, és ebből hány nincs összekötve? Minden ilyen nyitott pár egy „strukturális lyuk”.`,
          explain: R`A Polgármester 4 társából 6 pár képezhető, ebből csak 2 van összekötve ($\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{La}$–$\text{Ön}$): $C_{\mathrm{Po}} = 2/6 \approx 0{,}33$, és 4 nyitott hármas közepe – ezek a párok csak rajta át érik el egymást, ezért a köztessége 8, a legnagyobb. A Kormánynak 3 háromszöge van, $C = 0{,}5$, 3 nyitott hármas, köztesség 5: sok háromszög éppen kevesebb közvetítést jelent. A Klímaváltozás $C = 1$-e a kis fokszám következménye, a köztessége 0 – a magas $C_i$ nem „fontosság”. A Vízügy valóban a vita vonalán áll, de a $C_{\mathrm{Vi}} = 2/3$, köztessége 1,5. Hüvelykujjszabály: alacsony klaszterezettség + nagy fokszám = közvetítő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét egyetlen feszült háromszöge a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ ($\mathrm{Ko}$–$\mathrm{Vi}$ $+$, $\mathrm{Sz}$–$\mathrm{Vi}$ $+$, $\mathrm{Sz}$–$\mathrm{Ko}$ $-$). Elég-e egymagában, ha a Vízügy a Kormánytól határolódik el ($\mathrm{Ko}$–$\mathrm{Vi}$ $\to -$)?`,
          options: [
            R`Nem: a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$ háromszög feszült lenne, a $\mathrm{Vi}$–$\mathrm{Po}$-t is meg kellene fordítani – ez két fordítás.`,
            R`Igen: a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ így $+--$ lesz, és más feszült háromszög nincs.`,
            R`Igen: a táborok $\{\mathrm{Ko}, \mathrm{Po}, \mathrm{La}, \text{Ön}\}$ és $\{\mathrm{Vi}, \mathrm{Sz}\}$ lesznek.`,
            R`Nem: ehhez a $\mathrm{Sz}$–$\mathrm{Ko}$-t is $+$-ra kellene fordítani.`
          ],
          answer: 0,
          hint: R`A $\mathrm{Ko}$–$\mathrm{Vi}$ él nem csak egy háromszögben van benne. Melyik másikban még?`,
          explain: R`A $\mathrm{Ko}$–$\mathrm{Vi}$ él a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$ háromszögben is szerepel. Ha $-$ lesz, az a háromszög $+-+$: egy mínusz, feszült. A javasolt táborokban a $\mathrm{Vi}$–$\mathrm{Po}$ $+$ éle a táborok között futna – ezt is meg kellene fordítani, összesen kettőt. A „más feszült háromszög nincs” csak az eredeti feszült háromszöget nézi meg. Az utolsó opció rossz: ha a $\mathrm{Sz}$–$\mathrm{Ko}$ is $+$ lenne, a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ megint $++-$ volna. Az egyfordításos feloldások a $\mathrm{Sz}$–$\mathrm{Ko}$ $\to +$ (kibékülés) és a $\mathrm{Sz}$–$\mathrm{Vi}$ $\to -$ (oldalválasztás).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a fejezet három hálózatára (Árvízhét, karateklub, politikai blogok)? (Több jó válasz is lehet.)",
          options: [
            R`A blogoknál a linkek kb. 91%-a táboron belüli, a véletlen szint kb. 0,50, így $r \approx 0{,}81$.`,
            R`Mindhárom hálózat diszasszortatív a fokszámra nézve ($r_k \lt 0$).`,
            R`Mindhárom hálózatban az átlagos klaszterezettség nagyobb a globálisnál ($\bar C > C_\Delta$).`,
            R`A blogok $r = 0{,}81$-e azt mutatja, hogy a linkek hasonlóvá teszik a blogokat (befolyás).`,
            R`Az Árvízhét 80%-os belső aránya majdnem akkora homofíliát jelent, mint a karateklub 86%-a.`
          ],
          answer: [0, 1, 2],
          hint: "Vesd össze a nyers belső arányt és az r-t mindhárom hálózatnál. És mit lehet egy pillanatfelvételből az okokról mondani?",
          explain: R`Blogok: $r = (0{,}906 - 0{,}50)/(1 - 0{,}50) \approx 0{,}81$. Az $r_k$ mindháromnál negatív ($-0{,}16$; $-0{,}48$; $-0{,}22$), és $\bar C > C_\Delta$ mindenütt ($0{,}74 > 0{,}57$; $0{,}57 > 0{,}26$; $0{,}32 > 0{,}23$): sok kis fokú, sűrű környezetű csúcs, néhány ritka környezetű központ. A homofília nem mond okot: szelekció, befolyás vagy a téma közös hatása ugyanazt a mintát adja, és egy pillanatfelvételből ez nem dönthető el. A nyers belső arány félrevezet: az Árvízhéten a véletlen szint már 0,68, így $r$ csak $0{,}375$, a karateklubban viszont $0{,}72$.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh6-final": {
      title: "Fejezetzáró teszt – 6. Helyi szerkezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$, $BD$, $DE$. Mennyi az átlagos ($\bar C$) és a globális ($C_\Delta$) klaszterezettség? (A $k_i \lt 2$ csúcsnál $C_i = 0$.)`,
          options: [
            R`$\bar C \approx 0{,}53$, $C_\Delta = 0{,}6$`,
            R`$\bar C \approx 0{,}67$, $C_\Delta = 0{,}6$`,
            R`$\bar C = 0{,}6$, $C_\Delta \approx 0{,}53$`,
            R`$\bar C \approx 0{,}53$, $C_\Delta = 0{,}2$`
          ],
          answer: 0,
          hint: R`Két háromszög van ($ABC$, $ABD$). Számold ki csúcsonként a $C_i$-t, és külön az összefüggő hármasok számát.`,
          explain: R`$C_A = C_B = 2/3$ (3 szomszéd, 2 összekötött pár), $C_C = 1$, $C_D = 1/3$ (szomszédai $A, B, E$; csak $AB$ él), $C_E = 0$. $\bar C = (2/3 + 2/3 + 1 + 1/3 + 0)/5 = 8/15 \approx 0{,}53$. Hármasok: $3 + 3 + 1 + 3 + 0 = 10$, zárt $3 \cdot 2 = 6$: $C_\Delta = 0{,}6$. A $0{,}67$ az $E$-t kihagyja az átlagból (4-gyel oszt 5 helyett). A harmadik opció a kettőt felcseréli. A $0{,}2 = 2/10$ a 3-as szorzót hagyja el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban az $i$ csúcs fokszáma $k_i = 4$, és az $A^3$ mátrixban $(A^3)_{ii} = 6$. Mennyi a $C_i$?`,
          options: [R`$0{,}5$`, R`$1$`, R`$0{,}25$`, R`$0{,}375$`],
          answer: 0,
          hint: R`Az $(A^3)_{ii}$ az $i$-ből induló és oda visszaérő 3 hosszú sétákat számolja. Egy háromszöget hány ilyen séta jár körbe?`,
          explain: R`Minden háromszöget két irányban lehet körbejárni, ezért $T_i = (A^3)_{ii}/2 = 3$. $C_i = T_i/\binom{k_i}2 = 3/6 = 0{,}5$. Az $1 = 6/6$ elfelejti a 2-vel osztást (mindkét irányt külön háromszögnek veszi). A $0{,}25 = 3/12$ a $k_i(k_i - 1)$-gyel oszt $\binom{k_i}2$ helyett. A $0{,}375 = 6/16$ felezés nélkül, $k_i^2$-tel oszt. (Az Árvízhéten pont ez a Kormány: $(A^3)_{\mathrm{Ko}\,\mathrm{Ko}} = 6$, $C_{\mathrm{Ko}} = 0{,}5$.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hálózatban 12 piros–piros, 4 kék–kék és 4 piros–kék él van. Mennyi a kategóriás asszortativitás, $r$?`,
          options: [R`$\approx 0{,}52$`, R`$0{,}8$`, R`$0{,}6$`, R`$0{,}22$`],
          answer: 0,
          hint: R`Előbb az élvégarányok: hány élvég piros és hány kék a 40-ből? Utána a véletlen szint $\sum a_g^2$, és a képlet.`,
          explain: R`Belső arány: $16/20 = 0{,}8$. Élvégek: piros $2 \cdot 12 + 4 = 28$, kék $2 \cdot 4 + 4 = 12$ a 40-ből: $a = (0{,}7;\ 0{,}3)$, a véletlen szint $0{,}49 + 0{,}09 = 0{,}58$. $r = (0{,}8 - 0{,}58)/(1 - 0{,}58) = 0{,}22/0{,}42 \approx 0{,}52$. A $0{,}8$ a nyers belső arány. A $0{,}6 = 2 \cdot 0{,}8 - 1$ a két <b>egyforma</b> csoportra érvényes rövid képlet – itt a csoportok nem egyformák. A $0{,}22$ a számláló, a nevezővel nem oszt.`
        },
        {
          type: "match",
          q: R`Párosítsd a gráfot a fokszám-asszortativitásával ($r_k$)!`,
          pairs: [
            ["csillag (közép + 4 levél)", "−1"],
            [R`$K_5$ és egy különálló él ($K_2$)`, "+1"],
            [R`5 hosszú kör ($C_5$)`, "nem értelmezhető"],
            ["4 csúcsú út", "−0,5"],
            ["5 csúcsú út", "−0,33"]
          ],
          hint: "Minden élt írj fel mindkét irányban a két végpont fokszámával. Ha minden fokszám egyenlő, mi a szórás?",
          explain: R`A csillagon minden pár $(4, 1)$ vagy $(1, 4)$: a nagy mindig a kicsivel, $r_k = -1$. A $K_5 + K_2$-ben a párok $(4, 4)$ és $(1, 1)$: tökéletes együttmozgás, $+1$. A körön minden fokszám 2, a szórás 0, ezért $r_k$ <b>nem értelmezhető</b> – nem 0 és nem 1. A 4 csúcsú úton (fokszámok $1, 2, 2, 1$) $r_k = -0{,}5$, az 5 csúcsún ($1, 2, 2, 2, 1$) $-1/3$: a hosszabb úton több a $(2, 2)$ pár, gyengébb a diszasszortativitás. A tipikus hiba a párokat egy irányban felírni – akkor az eredmény a végpontok sorrendjétől függne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a gráfban (élek $AB$, $AC$, $AD$, $BC$, $BD$, $DE$) mennyi az $AD$ él szomszédsági átfedése, $O_{AD}$?`,
          options: [R`$1/3$`, R`$1/5$`, R`$1/2$`, R`$1/4$`],
          answer: 0,
          hint: R`Írd fel $N(A) \setminus \{D\}$-t és $N(D) \setminus \{A\}$-t. A nevezőben a két végpont nem szerepelhet.`,
          explain: R`$N(A) \setminus \{D\} = \{B, C\}$, $N(D) \setminus \{A\} = \{B, E\}$. Közös: $\{B\}$, unió: $\{B, C, E\}$. $O_{AD} = 1/3$. Az $1/5$ a két végpontot is a nevezőbe számolja ($\{A, B, C, D, E\}$) – így az átfedés sosem lehetne 1. Az $1/4$ csak az egyik végpontot hagyja benne. Az $1/2$ a közös szomszédot csak az egyik végpont szomszédaihoz méri. (Ugyanitt $O_{AB} = 1$, a $DE$ pedig helyi híd és híd is.)`
        },
        {
          type: "set",
          q: R`Az Árvízhét szereplőgráfjában jelöld ki azokat a <b>hiányzó</b> párokat, amelyeknek 2 közös társuk van – ezek a triadikus zárás legerősebb jelöltjei!`,
          items: ["Vi–Kl", "Po–Sz", "Ko–La", "Vi–Ön", "Po–Kl", "Sz–La"],
          answer: ["Vi–Kl", "Po–Sz"],
          hint: R`Az élek: $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{La}$–$\mathrm{Po}$, $\mathrm{Po}$–$\text{Ön}$. Minden párra írd fel a két szomszédhalmaz metszetét.`,
          explain: R`$\mathrm{Vi}$–$\mathrm{Kl}$: közös társ $\mathrm{Ko}$ és $\mathrm{Sz}$; $\mathrm{Po}$–$\mathrm{Sz}$: $\mathrm{Ko}$ és $\mathrm{Vi}$ – 2–2. A $\mathrm{Ko}$–$\mathrm{La}$ és a $\mathrm{Vi}$–$\text{Ön}$ csak a Polgármesteren, a $\mathrm{Po}$–$\mathrm{Kl}$ csak a Kormányon át kapcsolódik (1 közös társ); a $\mathrm{Sz}$–$\mathrm{La}$-nak egy sincs. A legvalószínűbb új él a legtöbb közös szomszédú, még nem összekötött pár. De vigyázz: ez előrejelzés – hogy egy meglévő háromszög zárással jött-e létre, azt egy pillanatfelvételből nem lehet látni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $A$ csúcs teljesíti az erős triadikus zárást. Egyetlen erős kötése van ($A$–$B$), és ez helyi híd. Mit mond erről Granovetter tétele?`,
          options: [
            R`Semmit: a tétel legalább két erős kötést feltesz, így ez nem ellentmondás.`,
            R`Ellentmond a tételnek, mert minden helyi híd gyenge.`,
            R`Azt, hogy $A$ mégsem teljesíti az erős triadikus zárást.`,
            R`Azt, hogy az $A$–$B$ él híd is, mert erős helyi híd csak híd lehet.`
          ],
          answer: 0,
          hint: "Olvasd el pontosan a tétel feltételeit. Hol használja a bizonyítás a második erős kötést?",
          explain: R`A tétel: ha $A$ teljesíti az erős triadikus zárást <b>és legalább két erős kötése van</b>, akkor minden helyi hídja gyenge. A bizonyítás a második erős szomszédot ($C$) használja: az erős triadikus zárás miatt $B$–$C$ él van, így $C$ közös szomszéd, és az $A$–$B$ nem lehetne helyi híd. Egyetlen erős kötésnél nincs ilyen $C$, a tétel nem mond semmit. A „minden helyi híd gyenge” a feltétel elhagyása. Az erős triadikus zárás egyetlen erős kötésnél automatikusan teljesül (nincs két erős szomszéd). Hidat és helyi hidat pedig ne keverd: a helyi híd törlése csak megnyújtja az utat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 7 szereplős teljes előjeles gráf kiegyensúlyozott, a táborok 4 és 3 fősek. Hány negatív és hány pozitív éle van?`,
          options: [
            R`12 negatív, 9 pozitív`,
            R`9 negatív, 12 pozitív`,
            R`12 negatív, 18 pozitív`,
            R`6 negatív, 15 pozitív`
          ],
          answer: 0,
          hint: "Hol futnak a negatív élek, és hol a pozitívak? Az összes él száma ellenőrzésnek jó.",
          explain: R`A negatív élek a táborok között futnak: $4 \cdot 3 = 12$. A pozitívak a táborokon belül: $\binom42 + \binom32 = 6 + 3 = 9$. Összesen $21 = \binom72$ ✔. A „9 negatív, 12 pozitív” a kettőt felcseréli. A „18 pozitív” a táboron belüli párokat sorrendben számolja ($4 \cdot 3 + 3 \cdot 2$). A „6 negatív” a táborok közti párokat feleslegesen felezi – azok eleve különböző táborból valók, nem számolódnak kétszer. A felcserélt változat összege is 21 – az összeg ellenőrzése itt nem elég, azt is nézd meg, hol futnak a negatív élek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hat szereplő körben: $AB+$, $BC-$, $CD+$, $DE-$, $EF+$, $FA-$ (más él nincs). Mit mondhatsz az egyensúlyáról?`,
          options: [
            R`Nem kiegyensúlyozott, de gyengén igen: táborok $\{A, B\}$, $\{C, D\}$, $\{E, F\}$.`,
            R`Kiegyensúlyozott: nincs háromszöge, így feszült háromszöge sincs.`,
            R`Kiegyensúlyozott: táborok $\{A, B\}$ és $\{C, D, E, F\}$.`,
            R`Gyengén sem kiegyensúlyozott: a körben páratlan sok mínusz van.`
          ],
          answer: 0,
          hint: "Számold meg a kör mínuszait. Az erős egyensúly a páratlan sok mínuszt tiltja – a gyenge egyensúly mit tilt pontosan?",
          explain: R`A körben 3 mínusz van – páratlan, ezért a gráf nem kiegyensúlyozott (a frusztrációs index 1). A gyenge egyensúly csak a <b>pontosan egy</b> mínuszt tartalmazó kört tiltja; itt az egyetlen kör 3 mínuszú, tehát gyengén kiegyensúlyozott. A táborok a $+$ élek mentén: $\{A, B\}$, $\{C, D\}$, $\{E, F\}$, és minden $-$ él táborok között fut. A „nincs háromszöge” érv a „csak háromszögeket ellenőrizni” hiba. A $\{A, B\}$ / $\{C, D, E, F\}$ beosztásban a $DE-$ táboron belül futna. Az utolsó opció a gyenge és az erős egyensúly feltételét keveri össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hírátvételi hálózatban 30 előrecsatolt hurok van. $G(n, m)$-ben átlagosan 12 (szórás 3), fokszámtartó átkötéssel átlagosan 26 (szórás 4). Mi a helyes összegzés?`,
          options: [
            R`$G(n, m)$-hez képest $z = 6$, kiugró; a fokszámtartóhoz képest $z = 1$, nem kiugró – az FFL-ek nagy részét a fokszámok megmagyarázzák.`,
            R`Mindkét nullmodellben több a megfigyelt az átlagnál, tehát az FFL motívum.`,
            R`$z = 18$ és $z = 4$: mindkét nullmodellhez képest motívum.`,
            R`$z = 6$ és $z = 1$: a $G(n, m)$ a szigorúbb nullmodell, ezért a $z = 6$ a mérvadó.`
          ],
          answer: 0,
          hint: "Számold ki mindkét z-t. Utána: melyik nullmodell tart meg többet a megfigyelt hálózatból?",
          explain: R`$z_{G(n,m)} = (30 - 12)/3 = 6$, $z_{\text{fok}} = (30 - 26)/4 = 1$. A fokszámtartó átkötés a szigorúbb: megtartja a fokszámokat, és ha így is átlagosan 26 FFL jön ki, a 30 nem meglepő. A „több az átlagnál” nem elég – a szórásnyi eltérés számít. A 18 és a 4 a nyers különbség, szórással nem oszt. Az utolsó opció jól számol, de a nullmodelleket fordítva rangsorolja. Mindig írd ki, melyik nullmodellt használtad.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lapok átvételi gráfja: $\mathrm{EK}\to\mathrm{RH}$, $\mathrm{NY}\to\mathrm{EK}$, $\mathrm{VN}\to\mathrm{RH}$, $\mathrm{VN}\to\mathrm{NY}$. Melyik új él hozna létre <b>irányított 3-kört</b>?`,
          options: [
            R`$\mathrm{RH}\to\mathrm{NY}$`,
            R`$\mathrm{NY}\to\mathrm{RH}$`,
            R`$\mathrm{VN}\to\mathrm{EK}$`,
            R`$\mathrm{RH}\to\mathrm{EK}$`
          ],
          answer: 0,
          hint: "Keress olyan 2 hosszú irányított utat, amelynek a végéből az új él vissza tudna mutatni a kezdetére.",
          explain: R`A $\mathrm{NY}\to\mathrm{EK}\to\mathrm{RH}$ láncot az $\mathrm{RH}\to\mathrm{NY}$ zárja körré: $\mathrm{NY}\to\mathrm{EK}\to\mathrm{RH}\to\mathrm{NY}$. Ha az élek időrendben a korábbira mutatnak, ez lehetetlen – a Reggeli Hírlapnak egy későbbi cikket kellene átvennie. Az $\mathrm{NY}\to\mathrm{RH}$ ugyanezt a hármast nem körré, hanem két <b>előrecsatolt hurokká</b> zárja (a $\mathrm{VN}\to\mathrm{NY}\to\mathrm{RH}$ + $\mathrm{VN}\to\mathrm{RH}$ is FFL). A $\mathrm{VN}\to\mathrm{EK}$ szintén két FFL-t ad, kört nem. Az $\mathrm{RH}\to\mathrm{EK}$ kölcsönös élt hoz létre az $\mathrm{EK}\to\mathrm{RH}$-val – ez 2-kör, nem 3-kör. Tipikus hiba az FFL-t és a 3-kört összekeverni: irány nélkül mindkettő háromszög.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy elemzés szerint az Árvízhét szereplőgráfja „erősen csoportos”, mert $C_\Delta \approx 0{,}57$. Mi a legfontosabb ellenvetés?`,
          options: [
            R`A 4 háromszögből 3 egyetlen háromszereplős cikkből jön; csak az összerakottal $C_\Delta \approx 0{,}14$ lenne.`,
            R`A $\bar C = 0{,}74$ nagyobb a $C_\Delta$-nél, ezért a $C_\Delta$ alulbecsüli a csoportosságot.`,
            R`A háromszögek triadikus zárással keletkeztek, ami társas folyamat, tehát a szám valóban csoportosságot mutat.`,
            R`A $C_\Delta$ súly nélküli, az együttemlítési gráf pedig súlyozott, ezért nem számolható.`
          ],
          answer: 0,
          hint: "Honnan jönnek egy együttemlítési gráf háromszögei? Mennyit ad egy háromszereplős cikk egymagában?",
          explain: R`A vetített (együttemlítési) gráfban egy $s$ szereplős cikk $\binom s3$ háromszöget ad „ingyen”. Az Árvízhéten a 2., az 5. és a 8. cikk egy-egy teljes háromszöget hoz; csak a $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ rakódik össze, és vele egyedül $C_\Delta = 3/21 \approx 0{,}14$. Ráadásul $G(n, m)$-hez képest a 4 háromszög nem kiugró ($z \approx 0{,}7$). A $\bar C$ és a $C_\Delta$ két különböző változat – egyik sem „javítja” a másikat. A „társas zárás” éppen a hiba: a $\mathrm{Ko}$–$\mathrm{Po}$ él egy háromszereplős cikkel jött. A súly elhagyható, a $C_\Delta$ súly nélkül is értelmes.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az Árvízhétre? (Több jó válasz is lehet.)",
          options: [
            R`A Polgármester $C = 0{,}33$, köztessége 8: ő köti össze a döntéshozók és az érintettek világát.`,
            R`A civil / többi beosztásban $r = 0{,}375$, pedig az élek 80%-a csoporton belüli.`,
            R`Az előjeles gráfban a frusztrációs index és a feszült háromszögek száma egyaránt 1.`,
            R`A $\mathrm{Ko}$–$\mathrm{Po}$ él helyi híd, mert a gráf legkisebb átfedésű éle.`,
            R`A Klímaváltozás $C = 1$, ezért a hálózat legfontosabb szereplője.`
          ],
          answer: [0, 1, 2],
          hint: "Az átfedés mikor 0? És mit mér valójában a helyi klaszterezettség egy 2 fokú csúcsnál?",
          explain: R`A Polgármester 4 nyitott hármas közepe, köztessége 8 – a közvetítő. A civilek belső aránya 0,8, de a véletlen szint $0{,}2^2 + 0{,}8^2 = 0{,}68$, így $r = 0{,}12/0{,}32 = 0{,}375$: a nyers arány félrevezet. Az előjeles gráfban egy feszült háromszög van, és egy fordítás elég – itt a kettő egyezik, de általában nem kell (egy él több feszült háromszöget is megjavíthat). A $\mathrm{Ko}$–$\mathrm{Po}$ átfedése $1/5 = 0{,}2$, nem 0: van közös társuk (a Vízügy), így nem helyi híd – az Árvízhéten egyáltalán nincs helyi híd. A Klímaváltozás $C = 1$-e a 2-es fokszám következménye: a klaszterezettség a környék sűrűsége, nem fontosság.`
        }
      ]
    },
