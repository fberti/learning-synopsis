    /* ------------------------------------------------ 1.5 */
    "el1-15": {
      title: "Kvíz – 1.5 Vezetők, szigetelők, félvezetők",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mi jellemzi a <b>félvezetőt</b> (pl. a szilíciumot)?`,
          options: [
            "Kevés szabad töltéshordozó van benne, de a számuk a hőmérséklettel, a megvilágítással és a szennyezéssel erősen változtatható.",
            "Félig vezet: nagyjából feleannyi szabad elektron van benne, mint a rézben.",
            "Egyáltalán nincs benne szabad töltéshordozó, ugyanúgy, mint az üvegben.",
            "Több szabad elektron van benne, mint a rézben, csak ezek lassabban mozognak."
          ],
          answer: 0,
          hint: R`A három anyagfajtát a szabad töltéshordozók <em>száma</em> különbözteti meg. A félvezetőnél ehhez jön még egy fontos tulajdonság – mi?`,
          explain: R`A félvezetőben kevés szabad töltéshordozó van (tiszta szilíciumban kb. $10^{10}$ köbcentinként, a rézben $8{,}5 \cdot 10^{22}$), de a számuk hővel, fénnyel és szennyezéssel tág határok között változtatható – ezért hasznos. A „félig vezet” a név félreolvasása: a különbség nem kétszeres, hanem billiószoros. A „nincs benne szabad töltéshordozó” a szigetelő leírása. A rézénél több szabad elektron pedig épp fordítva van.`
        },
        {
          type: "match",
          q: "Mi a töltéshordozó az egyes anyagokban? Párosítsd!",
          pairs: [
            ["réz", "szabad elektronok"],
            ["sós víz", "pozitív és negatív ionok"],
            ["száraz levegő (alapesetben)", "szinte semmi"],
            ["szilícium", "elektronok és lyukak"]
          ],
          hint: "Fémben az elektronok szabadok; oldatban a feloldott só részecskéi úsznak; a gáz alapesetben szigetel.",
          explain: R`Fémben (réz) a külső elektronok az egész kristályban szabadon mozognak. Az elektrolitban (sós víz) a só $\text{Na}^+$ és $\text{Cl}^-$ ionokra esik szét, ezek a töltéshordozók – szabad elektron nincs benne. A száraz levegőben alapesetben szinte nincs töltéshordozó, ezért szigetel; csak erős mezőben (átütés) keletkeznek benne ionok és elektronok. A félvezetőben elektronok és „lyukak” vezetnek (12. fejezet).`
        },
        {
          type: "single", shuffle: true,
          q: R`$1\,\text{cm}^3$ rézben kb. $8{,}5 \cdot 10^{22}$ szabad elektron van. Mekkora a szabad elektronok össztöltése (nagyságra) egy $2\,\text{cm}^3$-es rézdarabban?`,
          options: [
            R`$2{,}7 \cdot 10^{4}\,\text{C}$`,
            R`$1{,}4 \cdot 10^{4}\,\text{C}$`,
            R`$6{,}8 \cdot 10^{3}\,\text{C}$`,
            R`$1{,}1 \cdot 10^{42}\,\text{C}$`
          ],
          answer: 0,
          hint: R`Előbb számold ki, hány szabad elektron van $2\,\text{cm}^3$-ben. Darabszámból töltés: szorzás vagy osztás $e$-vel?`,
          explain: R`$N = 2 \cdot 8{,}5 \cdot 10^{22} = 1{,}7 \cdot 10^{23}$, és $|Q| = N e = 1{,}7 \cdot 10^{23} \cdot 1{,}602 \cdot 10^{-19}\,\text{C} \approx 2{,}7 \cdot 10^4\,\text{C}$. Az $1{,}4 \cdot 10^4\,\text{C}$ csak $1\,\text{cm}^3$-é (a térfogat kimaradt), a $6{,}8 \cdot 10^3\,\text{C}$ a térfogattal való osztásból jön. Az $1{,}1 \cdot 10^{42}\,\text{C}$-ot az adja, aki $e$-vel oszt szorzás helyett. A réz ettől még semleges: a rézionok pozitív töltése pontosan kiegyenlíti ezt az óriási mozgékony töltést.`
        },
        {
          type: "single", shuffle: true,
          q: "Zivatarban egy fém karosszériájú autóban ülsz. Miért vagy viszonylag biztonságban?",
          options: [
            "A fém karosszéria Faraday-kalitka: a töltés a külső fémfelületen halad, a belső térben nincs számottevő mező.",
            "A gumiabroncsok elszigetelik az autót a földtől, így a villám nem tud átfolyni rajta.",
            "Az autó belsejében a levegő jobban szigetel, mint kint, ezért ott nem üt át.",
            "A fém karosszéria magába szívja a villám töltését, és a belsejében tárolja."
          ],
          answer: 0,
          hint: "Hol helyezkedik el a többlettöltés egy vezetőn, és mekkora a mező a zárt vezető burok belsejében?",
          explain: R`Nyugalomban a vezető belsejében nincs mező, a többlettöltés a felületre ül, és a zárt fémburok belsejét a külső mező nem éri el: ez a Faraday-kalitka. A gumiabroncs nem véd – a villám kilométereket ugrik át a levegőn, néhány centi gumi meg sem állítja. A belső levegő semmivel sem jobb szigetelő. A töltés pedig épp nem a belsejében van, hanem a külső felületen.`
        },
        {
          type: "multi", shuffle: true,
          q: R`Egy fémgömbre $+10\,\text{nC}$ töltést viszünk, és megvárjuk, amíg a töltések nyugalomba kerülnek. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "A gömb belsejében a térerősség nulla.",
            "A többlettöltés a gömb külső felületén helyezkedik el.",
            "A töltés egyenletesen kitölti a gömb teljes térfogatát.",
            "Egy rézdrótban soha nincs elektromos mező, akkor sem, ha áram folyik benne.",
            "Egy zárt fémdoboz belsejét a külső mező nem éri el."
          ],
          answer: [0, 1, 4],
          hint: "Ha a vezető belsejében mező lenne, mit csinálnának a szabad elektronok? És hova húzódnak az egymást taszító azonos töltések?",
          explain: R`Nyugalomban a vezető belsejében $E = 0$ – különben a mező még mozgatná a szabad elektronokat. Az azonos előjelű többlettöltések taszítják egymást, és a lehető legmesszebb, a felületre húzódnak; ezért nem töltik ki a térfogatot. Ugyanezért zárt fémdoboz belsejébe nem jut be a külső mező (Faraday-kalitka). A „vezetőben nincs mező” viszont csak <b>nyugalomban</b> igaz: ha áram folyik, a mező hajtja az elektronokat.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy sóoldatban (elektrolitban) a mező jobbra mutat. Merre mozognak az ionok?",
          options: [
            "A pozitív ionok jobbra, a negatív ionok balra.",
            "Mind balra, a mezővel szemben, ahogy az elektronok is.",
            "Csak a negatív ionok mozognak (balra), a pozitívak a helyükön maradnak.",
            "A pozitív ionok balra, a negatív ionok jobbra."
          ],
          answer: 0,
          hint: "A térerősség iránya a pozitív töltésre ható erő iránya. Folyadékban mozoghatnak-e egész ionok?",
          explain: R`A pozitív ionra a mező irányába (jobbra), a negatívra azzal szemben (balra) hat erő, és folyadékban mindkettő szabadon elmozdulhat. „Csak az elektron mozog” – ez szilárd fémre igaz, oldatban egész ionok vándorolnak. A „mind balra” a fémbeli elektronok viselkedését vetíti az ionokra; a negyedik válasz pedig a mező irányát fordítja meg.`
        }
      ]
    },

    /* ------------------------------------------------ 1.6 */
    "el1-16": {
      title: "Kvíz – 1.6 Töltés a mindennapokban",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy szőnyegen végigsétálva $0{,}6\,\mu\text{C}$-ra töltődtél fel (negatívra). Hány elektron van rajtad többletben?`,
          options: [
            R`$3{,}7 \cdot 10^{12}$`,
            R`$3{,}7 \cdot 10^{15}$`,
            R`$3{,}7 \cdot 10^{9}$`,
            R`$9{,}6 \cdot 10^{-26}$`
          ],
          answer: 0,
          hint: R`Töltésből darabszám: $N = |Q|/e$. Figyelj a prefixumra: mennyi $1\,\mu\text{C}$ coulombban?`,
          explain: R`$N = 0{,}6 \cdot 10^{-6} / 1{,}602 \cdot 10^{-19} \approx 3{,}7 \cdot 10^{12}$ – közel négybillió elektron. A $3{,}7 \cdot 10^{15}$ a µ ↔ m összekeverése ($0{,}6\,\text{mC}$-val számolt), a $3{,}7 \cdot 10^{9}$ a µ ↔ n összekeverése. A $9{,}6 \cdot 10^{-26}$ szorzással jön ki osztás helyett: darabszámnak nem lehet törtrésze, ez biztos jele a fordított számolásnak.`
        },
        {
          type: "single", shuffle: true,
          q: "Megfogtál egy IC-t, és közben semmilyen csípést nem éreztél. Mit mondhatsz?",
          options: [
            "Lehet, hogy volt kisülés, és az IC-nek ez már árthatott: amit megérzel (kb. 3 kV), az több, mint amit egy IC biztosan kibír (pl. 2 kV).",
            "Biztosan nem volt kisülés, mert minden kisülést megérzünk.",
            "Ha te nem érezted, az IC-nek sem árthatott, mert a tested érzékenyebb, mint egy IC.",
            "Ha nem érezted, a töltésed biztosan kisebb volt 0,02 µC-nál, ami minden alkatrésznek ártalmatlan."
          ],
          answer: 0,
          hint: "Hasonlítsd össze az ESD-táblázatban az érzékelési küszöböt egy védett CMOS IC (74HC595) tűrési határával.",
          explain: R`Az épp érezhető csípés kb. $0{,}3\,\mu\text{C}$, azaz kb. $3\,\text{kV}$; egy védett CMOS IC (74HC595) tűrési határa kb. $2\,\text{kV}$ ($0{,}2\,\mu\text{C}$), egy érzékeny alkatrész pedig már $200\,\text{V}$-tól is tönkremehet. A hüvelykujjszabály: amit megérzel, az már <b>több</b>, mint amit egy IC biztosan kibír. A „nem éreztem, tehát nem volt” és a „ha nekem nem fájt, neki sem” épp a tipikus tévedés. A $0{,}02\,\mu\text{C}$ alatti töltést nem lehet az érzésből kikövetkeztetni – a $0{,}02$ és a $0{,}3\,\mu\text{C}$ között sem érzel semmit.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kilincs-szikra $1{,}5\,\text{mm}$ hosszú volt. Kb. hány kV-ra és mekkora töltésre voltál feltöltődve? (Levegő: kb. $3\,\text{kV/mm}$; a testnél $1\,\mu\text{C} \approx 10\,\text{kV}$.)`,
          options: [
            R`$4{,}5\,\text{kV}$, kb. $0{,}45\,\mu\text{C}$`,
            R`$0{,}5\,\text{kV}$, kb. $0{,}05\,\mu\text{C}$`,
            R`$4{,}5\,\text{kV}$, kb. $4{,}5\,\mu\text{C}$`,
            R`$4{,}5\,\text{kV}$, kb. $0{,}45\,\text{mC}$`
          ],
          answer: 0,
          hint: "Két lépés: a szikra hosszából a feszültség (kV/mm), aztán a feszültségből a töltés a táblázat arányával.",
          explain: R`$1{,}5\,\text{mm} \cdot 3\,\text{kV/mm} = 4{,}5\,\text{kV}$, és mivel $10\,\text{kV} \leftrightarrow 1\,\mu\text{C}$, a töltés $4{,}5/10 = 0{,}45\,\mu\text{C}$. A $0{,}5\,\text{kV}$ osztással jön ki ($1{,}5/3$) szorzás helyett. A $4{,}5\,\mu\text{C}$ az $1\,\text{kV} \leftrightarrow 1\,\mu\text{C}$ téves aránnyal adódik, a $0{,}45\,\text{mC}$ pedig a µ ↔ m összekeverése (ezerszer nagyobb).`
        },
        {
          type: "single", shuffle: true,
          q: R`Hányszor nagyobb töltést visz le egy $10\,\text{C}$-os villám, mint egy $0{,}2\,\mu\text{C}$-os ESD-szikra?`,
          options: [
            R`$5 \cdot 10^{7}$-szer`,
            R`$5 \cdot 10^{4}$-szer`,
            R`$5 \cdot 10^{10}$-szer`,
            R`$2 \cdot 10^{-8}$-szor`
          ],
          answer: 0,
          hint: R`Írd a kisebb töltést is coulombban, és a nagyobbat oszd a kisebbel.`,
          explain: R`$10 / (0{,}2 \cdot 10^{-6}) = 5 \cdot 10^7$, ötvenmilliószoros. Az $5 \cdot 10^4$ a µ helyett m-mel számol ($0{,}2 \cdot 10^{-3}$), az $5 \cdot 10^{10}$ n-nel ($0{,}2 \cdot 10^{-9}$). A $2 \cdot 10^{-8}$ a fordított hányados: a kisebb osztva a nagyobbal – „hányszor nagyobb” kérdésre 1-nél kisebb szám nem lehet válasz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy <b>pozitív</b> töltésű fémgömböt földelünk. Mi történik?`,
          options: [
            "A földből elektronok jönnek a gömbre, és pótolják a hiányt, amíg a gömb (gyakorlatilag) semleges nem lesz.",
            "A gömb pozitív töltése (protonjai) a földbe folyik.",
            "Semmi, mert a földelésen csak negatív töltés tud elfolyni, pozitív nem.",
            "A gömb elektronjai a földbe folynak, és a gömb még pozitívabb lesz."
          ],
          answer: 0,
          hint: "Fémben melyik részecske mozog? Mi a pozitív töltés valójában?",
          explain: R`A pozitív töltés elektronhiányt jelent. Fémben mindig az elektron mozog, a pozitív ion nem: a Földből elektronok áramlanak a gömbre, és pótolják a hiányt. A „protonok a földbe folynak” a tipikus hiba – a protonok a magban maradnak. A földelés mindkét előjelnél működik: többletnél elektronok folynak el, hiánynál elektronok jönnek. A negyedik válasz az előjelet fordítja meg: az elektronok kiáramlása a negatív gömbnél történik.`
        },
        {
          type: "multi", shuffle: true,
          q: "Melyik állítás igaz a földelésre és az IC-k kezelésére? (Több jó válasz is lehet.)",
          options: [
            "Egy töltött műanyag dobozt földeléssel nem lehet kisütni, mert a töltései nem jutnak el a földelési pontig.",
            R`Az elektronikában a „föld” (GND) általában nem a Föld, hanem az áramkör közös viszonyítási pontja (0 V).`,
            R`Az antisztatikus csuklópánt egy $1\,\text{M}\Omega$-os ellenálláson át földel, hogy a kisülés lassú és ártalmatlan legyen.`,
            "Az IC-t a lábainál érdemes fogni, mert így a tokja nem töltődik fel.",
            "A földelés és a szigetelés ugyanaz a védelem, csak két különböző néven."
          ],
          answer: [0, 1, 2],
          hint: "Gondold végig: szigetelőn el tud-e jutni a töltés egy pontig? És mit jelent a kapcsolási rajzon a GND?",
          explain: R`A szigetelőn a töltés ott marad, ahol keletkezett, ezért földeléssel nem süthető ki – a földelés és a szigetelés két <b>különböző</b> védelem (a szigetelő nem engedi elindulni a töltést, a földelés nem engedi felhalmozódni). A GND az áramkör 0 V-os viszonyítási pontja, például az elem negatív pólusa; „GND = földelés” tipikus tévedés. A csuklópánt ellenállása lassítja a kisülést. Az IC-t a <b>tokjánál</b> fogd: a lábak vezetnek közvetlenül a kényes belső részekhez.`
        },
        {
          type: "multi", shuffle: true,
          q: "Melyik állítás igaz a multiméter érintésmentes feszültségérzékelőjére (NCV)? (Több jó válasz is lehet.)",
          options: [
            "Változó elektromos mezőt érzékel, megosztás útján.",
            "Egy 9 V-os elem mellett nem jelez, mert az elem mezője állandó.",
            "Egy kikapcsolt lámpa vezetéke mellett is jelezhet.",
            "Ha nem jelez, a vezeték biztosan feszültségmentes, hozzá lehet nyúlni.",
            "Az egyenfeszültséget is jelzi, csak gyengébben, kevesebb vonallal."
          ],
          answer: [0, 1, 2],
          hint: "Az álló töltés mezője egyszer rendezi át az érzékelőlemez elektronjait. Mi történik utána?",
          explain: R`Az NCV a változó mezőt érzékeli: a hálózat 50 Hz-es mezője az érzékelő fémlemezében ide-oda mozgatja az elektronokat (megosztás). Az elem és az USB mezője állandó, ezért nem jelez – az egyenfeszültséget „gyengébben” sem jelzi. A kikapcsolt lámpa vezetéke is jelezhet, ha a kapcsoló csak az egyik vezetéket szakítja meg. A hallgatás viszont <b>nem bizonyítja</b> a feszültségmentességet: árnyékolt kábel, nullavezető, gyenge elem vagy rossz tartás miatt is hallgathat.`
        }
      ]
    },

    /* ------------------------------------------------ 1.7 */
    "el1-17": {
      title: "Kvíz – 1.7 A lebegő bemenet",
      questions: [
        {
          type: "multi", shuffle: true,
          q: "Melyik állítás igaz a lebegő bemenetre? (Több jó válasz is lehet.)",
          options: [
            "Nincs vezető kapcsolatban semmilyen meghatározott ponttal (sem a tápfeszültséggel, sem a GND-vel).",
            "Az értékét a környezet töltései és mezői határozzák meg, megosztás útján.",
            R`Egy felhúzó vagy lehúzó ellenállás megszünteti a lebegést.`,
            "Ha semmi sincs bekötve, a bemenet 0-t olvas.",
            "A leolvasott számokból kiszámolható a közelben lévő töltés coulombban."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a szigetelő állványon álló fémdarabra: mi határozza meg az állapotát, ha semmihez sincs kötve?",
          explain: R`A lebegő bemenet semmihez sincs kötve, ezért az állapotát a környezet – a közeledő töltés, a kezed, a hálózat váltakozó mezője – határozza meg megosztással. A felhúzó/lehúzó ellenállás egy meghatározott ponthoz köti, és elvezeti a töltést (15. fejezet). „A lebegő bemenet 0” a leggyakoribb tévhit: valójában határozatlan, bármi lehet. Pontos műszer sem: csak azt mutatja, hogy <em>van</em> a közelben töltés, és <em>változik</em>.`
        },
        {
          type: "single", shuffle: true,
          q: "Az L1.1 sketchje az átlagot egy hálózati periódusnyi időre számolja. Mennyi ez az idő, és miért éppen ennyi?",
          options: [
            "20 ms; egy teljes 50 Hz-es periódus átlagában a váltakozó „zümmögés” kiesik, és a lassú változás (a fésű hatása) marad.",
            "50 ms; ennyi idő alatt zajlik le az 50 Hz-es hálózat 50 rezgése.",
            "10 ms; ennyi idő alatt fordul meg a mező, így a zümmögés kiesik.",
            "20 ms; ennyi idő alatt az álló fésű hatása is kiátlagolódik, így csak a zaj marad."
          ],
          answer: 0,
          hint: R`Periódusidő = $1/\text{frekvencia}$. És mit akarunk kiszűrni: a gyors ingadozást vagy a lassú változást?`,
          explain: R`$T = 1/50\,\text{s} = 0{,}02\,\text{s} = 20\,\text{ms}$. Egy teljes periódus alatt a váltakozó rész pozitív és negatív fele kiegyenlíti egymást, a fésű lassú hatása viszont megmarad – ezért látszik tisztán az átlagon. Az 50 ms rossz átváltás ($1/50 \ne 50\,\text{ms}$; 50 rezgés egy egész másodperc). A 10 ms csak fél periódus: ennyi idő alatt a mező egyszer fordul meg, de a fél periódus átlaga nem nulla. A negyedik válasz megfordítja a szerepeket: az átlag a zajt szűri ki, nem a fésűt.`
        },
        {
          type: "single", shuffle: true,
          q: "Az L1.1-ben megdörzsölt fésűt közelítesz az A0-ra kötött antennához (érintés nélkül), és az átlag elmozdul. Mi a magyarázat?",
          options: [
            "Megosztás: a fésű töltése eltolja az antenna és a bemenet szabad elektronjait.",
            "Polarizáció: az antenna szigetelő, ezért csak a molekulái fordulnak el.",
            "A fésű elektronjai a levegőn át átvándorolnak az antennára.",
            "A fésű áramot indít az Arduino tápjában, és az módosítja a mérést."
          ],
          answer: 0,
          hint: R`Az antenna fémdrót – vezető vagy szigetelő? Melyik 1.2-es fogalom tartozik a vezetőhöz?`,
          explain: R`Az antenna és a bemenet vezető, a fésű töltése a szabad elektronjaikat eltolja: ez <b>megosztás</b>, töltésátadás nélkül. Polarizáció szigetelőben történik, a drót pedig vezet (megosztás ↔ polarizáció összekeverése). Érintés nélkül nem kerül át töltés – ezért tér vissza az érték a fésű távolításakor. (Érintésnél épp ez lenne veszélyes: a szikra tönkreteheti a bemenetet.)`
        },
        {
          type: "single", shuffle: true,
          q: "Ha a fésűt 10 másodpercig mozdulatlanul tartod 5 cm-re, az átlag lassan visszakúszik a kiinduló érték felé. Miért?",
          options: [
            "A bemenet parányi szivárgása és a levegő nedvessége lassan kiegyenlíti a megosztott töltést; az elektroszkóp igazán a változást érzékeli.",
            "A fésű töltése eltűnt: a töltés idővel magától megsemmisül.",
            "A 20 ms-os átlagolás kiszűri az álló fésű hatását, csak a mozgót engedi át.",
            "A fésű közben polarizálta a levegőt, és a levegő árnyékolja az antennát."
          ],
          answer: 0,
          hint: R`Az analóg bemenet „szinte semmi” töltést nem vesz fel – de nem pontosan semmit. És mi lesz idővel a megosztott töltésekkel?`,
          explain: R`A bemenet nem tökéletes szigetelő (kb. $100\,\text{M}\Omega$), és a nedves levegő is vezet egy kicsit: a megosztott állapot lassan kiegyenlítődik, a bemenet „hozzászokik” a fésűhöz. Ezért az elektroszkóp – akárcsak az NCV – a <em>változást</em> érzékeli jól. A töltés nem tűnik el (töltésmegmaradás). A 20 ms-os átlag csak az 50 Hz-es zümmögést szűri, a lassú változást átengedi – különben a fésű közelítését sem látnád. A levegő sem „árnyékol”.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy nyomógomb egyik lába az Arduino egyik bemenetére, a másik a GND-re van kötve. Mi a gond, amikor a gomb nincs lenyomva?",
          options: [
            "A bemenet lebeg, ezért véletlenszerű értékeket olvasunk; felhúzó ellenállás (vagy INPUT_PULLUP) kell.",
            "Semmi gond: lenyomatlan gombnál a bemenet 0-t olvas, mert a gomb a GND-re van kötve.",
            "Rövidzár van a bemenet és a GND között, ami tönkreteheti a lábat.",
            "Semmi gond: el nem nyomott gombnál a bemenet mindig 1023-at olvas."
          ],
          answer: 0,
          hint: "Nyitott gombnál mihez kapcsolódik a bemenet vezetően?",
          explain: R`Nyitott gombnál a bemenet semmihez sincs kötve – lebeg, és a környezet mezői szerint ide-oda vándorol. A megoldás a felhúzó ellenállás (15. fejezet) vagy a beépített <code>INPUT_PULLUP</code>. A „0-t olvas, mert a GND-re van kötve” elfelejti, hogy nyitott gombnál nincs vezető kapcsolat a GND-vel. Rövidzárról sincs szó: lenyomott gombnál a bemenet egyszerűen a GND-hez kapcsolódik, ez a gomb rendeltetése. Az „1023” ugyanaz a hiba, mint a „0”: a lebegő bemenetnek nincs meghatározott értéke.`
        },
        {
          type: "single", shuffle: true,
          q: "A fejezet kérdése: lehúzod a gyapjúpulóvert, és a hajad égnek áll. Mi történik?",
          options: [
            "A haj elektronokat ad át a pulóvernek; minden hajszál pozitív lesz, és taszítják egymást.",
            "A pulóver protonokat ad át a hajnak; a hajszálak pozitívak lesznek, és taszítják egymást.",
            "A haj elektronokat kap a pulóvertől; a hajszálak negatívak lesznek, és a pulóver vonzza őket.",
            "A hajszálak polarizálódnak, és a pulóver felfelé vonzza őket; a hajszálak maguk semlegesek maradnak."
          ],
          answer: 0,
          hint: "Nézd meg a triboelektromos sorban a hajat és a gyapjút! És mitől állnak a hajszálak egymástól távol: vonzástól vagy taszítástól?",
          explain: R`A haj feljebb áll a triboelektromos sorban, mint a gyapjú, ezért elektront ad át: a haj pozitív, a pulóver negatív lesz (töltés nem keletkezik, csak szétválik). Az egyformán pozitív hajszálak taszítják egymást, és a lehető legmesszebb állnak. A „protonokat ad át” a tipikus hiba – szilárd testben csak elektron mozog. A harmadik válasz az irányt fordítja meg. A negyedik vonzással magyaráz: az a pulóver felé húzná a hajat, de nem állítaná szét a szálakat – a szétállás taszítás, ami mindkét fél töltöttségét bizonyítja.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "el1-final": {
      title: "Fejezetzáró teszt – 1. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy porszem töltése $-0{,}8\,\text{nC}$. Hány elektron van rajta többletben?`,
          options: [
            R`$5{,}0 \cdot 10^{9}$`,
            R`$5{,}0 \cdot 10^{12}$`,
            R`$5{,}0 \cdot 10^{6}$`,
            R`$1{,}3 \cdot 10^{-28}$`
          ],
          answer: 0,
          hint: R`$N = |Q|/e$ – az előjel csak azt mondja meg, hiány vagy többlet. Írd át a nC-ot coulombra!`,
          explain: R`$N = 0{,}8 \cdot 10^{-9} / 1{,}602 \cdot 10^{-19} \approx 5{,}0 \cdot 10^9$. Az $5{,}0 \cdot 10^{12}$ µC-nak, az $5{,}0 \cdot 10^{6}$ pC-nak veszi a nC-ot. Az $1{,}3 \cdot 10^{-28}$ szorzással jön ki osztás helyett – elektronból nem lehet tört darab. Az előjel ($-$) csak azt jelzi, hogy többlet van; a darabszám mindig pozitív.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három egyforma fémgömb: $A = +12\,\text{nC}$, $B = -4\,\text{nC}$, $C$ semleges. $A$ hozzáér $B$-hez, majd $B$ hozzáér $C$-hez. Mennyi lesz a töltésük?`,
          options: [
            R`$A = 4,\ B = 2,\ C = 2\,\text{nC}$`,
            R`$A = 8,\ B = 4,\ C = 4\,\text{nC}$`,
            R`$A = 6,\ B = 3,\ C = 3\,\text{nC}$`,
            R`$A = B = C \approx 2{,}67\,\text{nC}$`
          ],
          answer: 0,
          hint: "Lépésenként: minden érintésnél add össze a két gömb töltését előjelesen, és feleld meg. A harmadik gömb az első érintésben nem vesz részt.",
          explain: R`1. érintés: $12 + (-4) = 8$, felezve $A = B = +4\,\text{nC}$. 2. érintés: $4 + 0 = 4$, felezve $B = C = +2\,\text{nC}$. Végül $4, 2, 2$; összesen $8\,\text{nC}$, mint kezdetben ($12 - 4$) ✓. A „8, 4, 4” előjel nélkül adja össze a $12$-t és a $4$-et; a „6, 3, 3” a $B$-t semlegesnek veszi; a $2{,}67$ úgy számol, mintha mindhárom gömb egyszerre ért volna össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy teflonrudat gyapjúval dörzsölsz, majd <b>érintés nélkül</b> egy semleges elektroszkóp tetejéhez közelíted. Mi történik a lemezkékkel?`,
          options: [
            "Negatívak lesznek, és szétállnak.",
            "Pozitívak lesznek, és szétállnak.",
            "Nem mozdulnak, mert az elektroszkóp semleges, és nem értünk hozzá.",
            "Összecsuknak, mert a rúd vonzza őket."
          ],
          answer: 0,
          hint: "Két lépés: előbb a triboelektromos sorból a teflon töltése, aztán a megosztás – merre mennek az elektroszkóp elektronjai?",
          explain: R`A teflon a sor legalján áll, a gyapjú elektront ad neki: a teflon <b>negatív</b>. A negatív rúd az elektroszkóp szabad elektronjait lefelé, a lemezkékre taszítja (megosztás): mindkét lemezke negatív lesz, és szétállnak. Az elektroszkóp összes töltése közben $0$ marad – a „nem mozdul, mert semleges” elfelejti, hogy a megosztás töltésátadás nélkül is szétválasztja a töltést. A „pozitívak” a teflon előjelét téveszti el (a lemezkék ilyenkor is szétállnának, csak elektronhiánnyal).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy megdörzsölt műanyag rúd magához vonz egy cérnán lógó, könnyű golyót. Mit állíthatsz biztosan a golyóról?",
          options: [
            "A töltéséről semmit biztosan: lehet ellentétes előjelű, de semleges is (megosztás vagy polarizáció).",
            "Biztosan töltött, és a rúddal ellentétes előjelű.",
            "Biztosan semleges, mert két töltött test taszítja egymást.",
            "Biztosan fémből van, mert szigetelőt a rúd nem vonzhat."
          ],
          answer: 0,
          hint: "Melyik jelenség a biztos jele annak, hogy két test töltött: a vonzás vagy a taszítás?",
          explain: R`A semleges testet bármilyen előjelű töltés vonzza: vezetőben megosztás, szigetelőben polarizáció miatt a közeli oldal ellentétes előjelű lesz. Ezért a vonzás <b>nem</b> bizonyítja, hogy a golyó töltött – csak a taszítás lenne biztos jel. A „biztosan semleges” sem igaz: ellentétes töltésű test is vonz. Szigetelőt is vonz a rúd (a papírfecnik is felugranak).`
        },
        {
          type: "single", shuffle: true,
          q: R`Két egyforma fémgömb töltése $+5\,\text{nC}$ és $-1\,\text{nC}$. Összeérintjük, majd $20\,\text{cm}$ távolságra tesszük őket. Mekkora és milyen erő hat köztük?`,
          options: [
            R`$9{,}0 \cdot 10^{-7}\,\text{N}$, taszítás`,
            R`$2{,}0 \cdot 10^{-6}\,\text{N}$, taszítás`,
            R`$1{,}1 \cdot 10^{-6}\,\text{N}$, vonzás`,
            R`$1{,}8 \cdot 10^{-7}\,\text{N}$, taszítás`
          ],
          answer: 0,
          hint: "Előbb töltésmegmaradás (mennyi lesz egy-egy gömbön?), aztán Coulomb-törvény SI-ben. Az előjelekből döntsd el az irányt.",
          explain: R`Összeérintve: $(5 - 1)/2 = +2\,\text{nC}$ mindkettőn. Utána $F = 9 \cdot 10^9 \cdot \dfrac{2 \cdot 10^{-9} \cdot 2 \cdot 10^{-9}}{0{,}2^2} = 9 \cdot 10^{-7}\,\text{N}$, és mivel mindkettő pozitív, <b>taszítás</b>. A $2{,}0 \cdot 10^{-6}\,\text{N}$ előjel nélkül osztja el a töltést ($3\,\text{nC}$ mindkettőn). Az $1{,}1 \cdot 10^{-6}\,\text{N}$ vonzás az érintés <em>előtti</em> állapot. Az $1{,}8 \cdot 10^{-7}\,\text{N}$ az $r$-rel oszt $r^2$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Két töltés közül az egyiket háromszorosára növeljük, és a távolságukat is háromszorosára növeljük. Hányszorosára változik a köztük ható erő?",
          options: ["harmadára csökken", "nem változik", "kilencedére csökken", "háromszorosára nő"],
          answer: 0,
          hint: R`Két hatás szorzódik: $\times a$ a töltés miatt, $\div b^2$ a távolság miatt.`,
          explain: R`A töltés miatt $\times 3$, a távolság miatt $\div 3^2 = 9$: összesen $3/9 = 1/3$, harmadára csökken. A „nem változik” a „kétszer messzebb → fele” típusú hiba ($1/r$ a négyzet helyett). A „kilencedére” kihagyja a töltés növelését, a „háromszorosára” a távolságot.`
        },
        {
          type: "single", shuffle: true,
          q: R`$+4\,\text{nC}$ az $x = 0$-ban, $+1\,\text{nC}$ az $x = 30\,\text{cm}$-ben. Hol nulla a térerősség a két töltés között?`,
          options: [
            R`$x = 20\,\text{cm}$`,
            R`$x = 10\,\text{cm}$`,
            R`$x = 15\,\text{cm}$`,
            R`$x = 24\,\text{cm}$`
          ],
          answer: 0,
          hint: R`A nullpontban a két mező egyforma nagy: $\dfrac{4}{x^2} = \dfrac{1}{(0{,}3 - x)^2}$. Melyik töltéshez lesz közelebb?`,
          explain: R`$\dfrac{4}{x^2} = \dfrac{1}{(0{,}3 - x)^2}$ → $x = 2(0{,}3 - x)$ → $x = 0{,}2\,\text{m} = 20\,\text{cm}$. Ellenőrzés: $9 \cdot 10^9 \cdot 4 \cdot 10^{-9}/0{,}04 = 900\,\text{N/C}$ és $9 \cdot 10^9 \cdot 10^{-9}/0{,}01 = 900\,\text{N/C}$, ellentétes irányban ✓. A nullpont a <b>gyengébb</b> töltéshez van közelebb. A $10\,\text{cm}$ a fordított oldal (ott $3600$ és $225\,\text{N/C}$). A $15\,\text{cm}$ a felezőpont – ez csak egyforma töltéseknél jó. A $24\,\text{cm}$ az $1/r$-es (négyzet nélküli) számolás eredménye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $-4\,\text{nC}$-os töltésre $2 \cdot 10^{-5}\,\text{N}$ erő hat <b>felfelé</b>. Mekkora és merre mutat ott a térerősség?`,
          options: [
            R`$5000\,\text{N/C}$, lefelé`,
            R`$5000\,\text{N/C}$, felfelé`,
            R`$5\,\text{N/C}$, lefelé`,
            R`$8 \cdot 10^{-14}\,\text{N/C}$, lefelé`
          ],
          answer: 0,
          hint: R`$E = F/|q|$, és a térerősség iránya a <em>pozitív</em> töltésre ható erő iránya.`,
          explain: R`$E = 2 \cdot 10^{-5} / 4 \cdot 10^{-9} = 5000\,\text{N/C}$. A töltés negatív, ezért rá a mezővel <b>szemben</b> hat erő: ha az erő felfelé mutat, a mező lefelé. A „felfelé” a negatív töltésnél elfelejti megfordítani az irányt. Az $5\,\text{N/C}$ µC-nak veszi a nC-ot, a $8 \cdot 10^{-14}$ pedig szorzással jön ki osztás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pontszerű töltés mezője $6\,\text{cm}$-re $4000\,\text{N/C}$. Mekkora a térerősség $12\,\text{cm}$-re, és mekkora erő hat ott egy $3\,\text{nC}$-os töltésre?`,
          options: [
            R`$1000\,\text{N/C}$; $3 \cdot 10^{-6}\,\text{N}$`,
            R`$2000\,\text{N/C}$; $6 \cdot 10^{-6}\,\text{N}$`,
            R`$1000\,\text{N/C}$; $3 \cdot 10^{-3}\,\text{N}$`,
            R`$1000\,\text{N/C}$; $3{,}3 \cdot 10^{11}\,\text{N}$`
          ],
          answer: 0,
          hint: R`Nem kell kiszámolni a forrástöltést: kétszeres távolság → ? Aztán $F = qE$.`,
          explain: R`Kétszeres távolság → negyed térerősség: $4000/4 = 1000\,\text{N/C}$. Az erő $F = qE = 3 \cdot 10^{-9} \cdot 1000 = 3 \cdot 10^{-6}\,\text{N}$. A $2000\,\text{N/C}$ az $1/r$-es hiba („kétszer messzebb → fele”), és ebből $6 \cdot 10^{-6}\,\text{N}$ lesz. A $3 \cdot 10^{-3}\,\text{N}$ µC-nak veszi a nC-ot, a $3{,}3 \cdot 10^{11}\,\text{N}$ pedig $E/q$-val számol $qE$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mekkora töltés hoz létre egy pontszerű (hegyes) tárgytól $2\,\text{cm}$-re akkora térerősséget, amelynél a levegő átüt ($3 \cdot 10^6\,\text{N/C}$)?`,
          options: [
            R`$1{,}3 \cdot 10^{-7}\,\text{C}$`,
            R`$6{,}7 \cdot 10^{-6}\,\text{C}$`,
            R`$1{,}3 \cdot 10^{-3}\,\text{C}$`,
            R`$1{,}3 \cdot 10^{11}\,\text{C}$`
          ],
          answer: 0,
          hint: R`Rendezd $E = k|Q|/r^2$-et $|Q|$-ra, és csak SI-ben ($r$ méterben) emelj négyzetre!`,
          explain: R`$|Q| = E r^2 / k = 3 \cdot 10^6 \cdot (0{,}02)^2 / 9 \cdot 10^9 = 3 \cdot 10^6 \cdot 4 \cdot 10^{-4} / 9 \cdot 10^9 \approx 1{,}3 \cdot 10^{-7}\,\text{C}$, azaz kb. $130\,\text{nC}$ – ESD-nagyságrend. A $6{,}7 \cdot 10^{-6}\,\text{C}$-nál $r$-rel szoroztak $r^2$ helyett, az $1{,}3 \cdot 10^{-3}\,\text{C}$-nál a $2\,\text{cm}$-t nem váltották méterre. Az $1{,}3 \cdot 10^{11}\,\text{C}$ a $k = 9 \cdot 10^{-9}$ elírásból jön.`
        },
        {
          type: "single", shuffle: true,
          q: "Melegítéskor a réz kicsit rosszabbul vezet, a tiszta szilícium viszont sokkal jobban. Mi ennek az oka?",
          options: [
            "A szilíciumban a hő újabb elektronokat szakít ki a kötésekből, így ugrásszerűen nő a szabad töltéshordozók száma; a rézben már mind szabad, csak többször ütköznek.",
            "A szilícium félig vezet, és melegen a másik fele is vezetni kezd.",
            "Melegítéskor a rézből elektronok párolognak át a szilíciumba.",
            "A melegebb szilíciumban az elektronok kevesebbet ütköznek, ezért gyorsabbak."
          ],
          answer: 0,
          hint: "A félvezető szabad töltéshordozóinak száma erősen függ … mitől? És mi változhat a rézben, ahol a külső elektronok már szabadok?",
          explain: R`A félvezetőben a szabad töltéshordozók száma erősen függ a hőmérséklettől: a hő újabb elektronokat szabadít fel a kötésekből. A rézben a szabad elektronok száma nem nő (atomonként kb. egy már szabad), viszont a melegebb rácsban többször ütköznek. A „félig vezet” a név félreolvasása. Az ütközések melegen nem ritkulnak, hanem gyakoribbak lesznek – a negyedik válasz épp fordítva mondja. Erre épül a termisztor (7. fejezet).`
        },
        {
          type: "match",
          q: "Melyik eszköz kell? Párosítsd a feladat kérdését a módszerrel!",
          pairs: [
            ["„Hány elektron hiányzik?”", "osztás az elemi töltéssel"],
            ["„Összeérnek, aztán szétválnak.”", "töltésmegmaradás, egyenlő elosztás"],
            ["„Dörzsöljük – milyen töltésű lesz?”", "triboelektromos sor"],
            ["„Miért nem jelez a műszer az elem mellett?”", "csak változó mezőt érzékel"],
            ["„Három töltés egy egyenesen – mekkora az erő?”", "szuperpozíció, irányokkal"]
          ],
          hint: "Gondolj a fejezetvégi döntési táblázatra: minden kérdéstípushoz egy eszköz tartozik.",
          explain: R`Töltésből darabszám: $N = |Q|/e$ (osztás, nagy szám jön ki). Összeérintésnél az összes töltés megmarad, egyforma fémtesteken egyenlően oszlik el. Dörzsölésnél a triboelektromos sorban feljebb álló ad elektront, és pozitív lesz. Az NCV csak változó mezőt érzékel, az elemé állandó. Több töltésnél előbb az egyes erők irányát kell eldönteni, és csak utána előjelesen összeadni (szuperpozíció).`
        },
        {
          type: "single", shuffle: true,
          q: "Az NCV-érzékelő előtt mozdulatlanul tartott megdörzsölt fésű nem vált ki jelet, de ha gyorsan meglengeted, néha felvillan a jel. Miért?",
          options: [
            "A mozgó fésű mezője az érzékelő helyén változik – az NCV-nek csak ez számít.",
            "A lengetéstől a fésű töltése váltakozó előjelű lesz, mint a hálózati vezetéké.",
            "A lengetés a levegőhöz dörzsöli a fésűt, és az így termelt új töltést jelzi a műszer.",
            "Az NCV az álló töltést is jelzi, csak a lengetés közben elég közel kerül a fésű."
          ],
          answer: 0,
          hint: "Mit érzékel az NCV: a töltés jelenlétét vagy a mező változását? És a mezőt mi változtathatja meg az előjelen kívül?",
          explain: R`Az NCV megosztás útján a <b>változó</b> mezőt érzékeli. A fésű töltésének előjele nem változik, de a távolság igen: így az érzékelőnél a mező változik, és ez elég a jelhez. A „váltakozó előjel” a hálózat működését vetíti a fésűre. A lengetés nem tölti fel újra a fésűt: a dörzselektromossághoz két anyag érintkezése és szétválása kell, és a jel a fésű mozgásával együtt jelenik meg és tűnik el. Az álló töltés mezője csak egyszer rendezi át a lemez elektronjait, utána nincs jel, akármilyen közel van.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy lebegő Arduino-bemenet átlaga 512 körül áll. Feltöltött fésűt közelítesz: 300-ra esik, majd a fésűt mozdulatlanul tartva 20 s alatt visszakúszik kb. 500-ra. Most elveszed a fésűt. Mit vársz?",
          options: [
            "Az érték az ellenkező irányba ugrik (512 fölé), majd lassan visszatér.",
            "Az érték 500 körül marad, mert a bemenet már nem érzi a fésűt.",
            "Az érték ismét 300-ra esik, mert a fésű távolítása ugyanúgy megosztást okoz.",
            "Az érték 0-ra esik, mert fésű nélkül a lebegő bemenet nullát olvas."
          ],
          answer: 0,
          hint: "Mit „tanult meg” a bemenet, amíg a fésű ott volt? Ha a fésű hatása hirtelen megszűnik, mi marad meg ebből?",
          explain: R`A közeledő fésű megosztást okozott (az érték leesett). Állva a bemenet parányi szivárgása kiegyenlítette a megosztott állapotot – ezért kúszott vissza. Ha most elveszed a fésűt, ez a kiegyenlítés ott marad, a fésű hatása viszont megszűnik: az érték az <b>ellenkező</b> irányba ugrik, és csak a szivárgással áll vissza. Az elektroszkóp a változást érzékeli, nem az állapotot. A „300-ra esik” az eltávolítást ugyanolyan irányú változásnak veszi, mint a közelítést; a „0-ra esik” a „lebegő bemenet = 0” tévhit.`
        }
      ]
    },
