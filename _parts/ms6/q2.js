    /* ------------------------------------------------ 6.5 */
    "ms6-65": {
      title: "Kvíz – 6.5 Konfidencia-intervallum a szórásra",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Normális sokaságból $n = 10$ elemű mintát veszünk, $s = 3$. Mi a 95%-os KI a <b>szórásra</b>, $\sigma$-ra? ($\chi^2_{9}$: 2,700 és 19,023)`,
          options: ["[2,06; 5,48]", "[4,26; 30,00]", "[2,18; 5,77]", "[1,19; 3,16]"],
          answer: 0,
          hint: R`A képletben $(n-1)s^2$ áll, és a végén gyököt kell vonni. Melyik kvantilis adja az alsó határt?`,
          explain: R`$(n-1)s^2 = 9 \cdot 9 = 81$. $\sigma^2 \in [81/19{,}023;\ 81/2{,}700] = [4{,}26;\ 30{,}00]$, gyököt vonva $\sigma \in [2{,}06;\ 5{,}48]$. A [4,26; 30,00] a <b>szórásnégyzet</b> intervalluma – szórásként közölni gyökvonás nélkül tipikus hiba. A [2,18; 5,77] $n = 10$-zel szoroz $n - 1 = 9$ helyett. Az [1,19; 3,16] $s^2$ helyett $s$-sel számol ($9 \cdot 3 = 27$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A szórásnégyzet KI-jénél melyik kvantilissel osztva kapjuk az <b>alsó</b> határt?`,
          options: [
            R`A nagyobbikkal, $\chi^2_{n-1;\,1-\alpha/2}$-vel`,
            R`A kisebbikkel, $\chi^2_{n-1;\,\alpha/2}$-vel`,
            R`A $z_{1-\alpha/2}$-vel, mint az átlagnál`,
            R`A $t_{n-1;\,1-\alpha/2}$-vel, mert $\sigma$ ismeretlen`
          ],
          answer: 0,
          hint: R`A $\sigma^2$ a törtnek a nevezőjében áll: $(n-1)s^2/\sigma^2$. Mi történik az egyenlőtlenséggel, ha reciprokot veszel?`,
          explain: R`$\chi^2_{\alpha/2} \lt (n-1)s^2/\sigma^2 \lt \chi^2_{1-\alpha/2}$. A reciprok megfordítja az egyenlőtlenségeket, ezért $\sigma^2 \gt (n-1)s^2/\chi^2_{1-\alpha/2}$: a <b>nagyobb</b> kvantilis adja az alsó határt. Ha a kisebbikkel osztasz, a „határok” helyet cserélnek (az alsó nagyobb lesz a felsőnél). A $z$ és a $t$ az átlag intervallumához kell; a szórásnál a $\chi^2$-tétel (5.5-a) az eszköz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $n = 15$, $s = 10$. Mi a <b>90%-os</b> KI $\sigma$-ra? ($\chi^2_{14}$ 5%-os és 95%-os kvantilise: 6,571 és 23,685)`,
          options: ["[7,69; 14,60]", "[7,32; 15,77]", "[7,96; 15,11]", "[59,11; 213,06]"],
          answer: 0,
          hint: R`90%-hoz a két szélen 5–5% marad ki. Számold ki $(n-1)s^2$-et, oszd el a két kvantilissel, és ne felejts el gyököt vonni!`,
          explain: R`$(n-1)s^2 = 14 \cdot 100 = 1400$. $\sigma^2 \in [1400/23{,}685;\ 1400/6{,}571] = [59{,}11;\ 213{,}06]$, gyökvonás után $\sigma \in [7{,}69;\ 14{,}60]$. A [7,32; 15,77] a 95%-os kvantilisekkel (5,629 és 26,119) készült – az a szélesebb, 95%-os sáv. A [7,96; 15,11] $n = 15$-tel szoroz $n - 1$ helyett. A [59,11; 213,06] a szórásnégyzet intervalluma, gyökvonás nélkül.`
        },
        {
          type: "multi",
          q: R`A konzervek szórásának 95%-os KI-je [9,71; 20,92] g, a pontbecslés $s = 13{,}27$ g. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`Az $s$ nem a sáv közepén van: a közép 15,3, az $s$ ettől balra esik.`,
            R`Az aszimmetria oka, hogy a $\chi^2$-eloszlás jobbra ferde.`,
            R`A sáv felírható $13{,}27 \pm \Delta$ alakban, csak a $\Delta$-t kell kiszámolni.`,
            R`A szélesség hibás számolásra utal: egy helyes KI-nek a pontbecslésre szimmetrikusnak kell lennie.`,
            R`A szórás KI-jét a szórásnégyzet KI-jének két határából gyökvonással kapjuk.`
          ],
          answer: [0, 1, 4],
          hint: R`Számold ki a sáv közepét, és gondold végig, milyen alakú a $\chi^2$-eloszlás.`,
          explain: R`Igaz az első, a második és az ötödik. $(9{,}71 + 20{,}92)/2 \approx 15{,}3 \gt 13{,}27$. A $\chi^2$ jobbra ferde: a felső határnál a kicsi (bal oldali) kvantilissel osztunk, ami messzebb tolja a határt. A szórás sávját a $\sigma^2$-sáv határainak gyökéből kapjuk. <b>Hamis</b>, hogy van „$s \pm \Delta$” alak – ez a tipikus hiba. Hamis az is, hogy egy KI-nek mindig szimmetrikusnak kell lennie: csak a $z$- és a $t$-intervallum ilyen.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gyártó szerint a konzervtöltő gép szórása $\sigma = 10$ g. A minta alapján a 95%-os KI $\sigma$-ra [9,71; 20,92], a 90%-os [10,20; 19,36]. Mi a helyes következtetés?`,
          options: [
            "A 95%-os sáv még tartalmazza a 10-et, a 90%-os már nem: az adat inkább nagyobb szórásra utal, de 15 konzerv kevés – érdemes több adatot gyűjteni.",
            "Mindkét szinten ellentmond a gyártónak, hiszen a pontbecslés 13,27 > 10.",
            "A 95%-os sáv bizonyítja, hogy a gyártónak igaza van: a szórás pontosan 10.",
            "A két sáv ellentmond egymásnak, ezért valamelyik számolás hibás."
          ],
          answer: 0,
          hint: "Melyik sávban van benne a 10? És mi a viszony a 90%-os és a 95%-os sáv között?",
          explain: R`A 90%-os sáv mindig szűkebb a 95%-osnál (kisebb megbízhatósághoz keskenyebb „háló” kell), ezért nincs ellentmondás, ha a 10 az egyikbe belefér, a másikba nem. A 95%-os szinten a 10 épphogy benne van: az adat <b>összeegyeztethető</b> vele, de nem bizonyítja. A pontbecslés egymagában (13,27 > 10) semmit sem dönt el, hiszen a mintából számolt $s$ ingadozik. A 15 elemű minta a szórásról kevés információt hordoz: a sáv több mint kétszeres tartományt fog át.`
        },
        {
          type: "match",
          q: R`15 elemű mintákból „95%-os” $\chi^2$-intervallumot szerkesztettünk $\sigma$-ra, sokféle sokaságból (szimuláció). Párosítsd a sokaságot a tényleges lefedettséggel!`,
          pairs: [
            ["normális", "kb. 95% – annyi, amennyit ígér"],
            ["ferde (exponenciális)", "kb. 74% – túl ritkán fed le"],
            ["egyenletes", "kb. 99,5% – feleslegesen széles"]
          ],
          hint: R`A $\chi^2$-tétel melyik sokaságra pontos? Egy hosszú farkú sokaságban gyakoriak a nagy eltérések – ez hogyan hat az $s$ ingadozására?`,
          explain: R`A $(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$ tétel <b>csak normális sokaságra</b> igaz, ott a lefedettség 95,0%. Ferde, hosszú farkú (exponenciális) sokaságnál az $s^2$ sokkal jobban ingadozik, a sáv túl szűk: a „95%-os” intervallum csak 74,3%-ban fedi le a szórást. Az egyenletes sokaságnál fordítva: 99,5% – ez sem jó, a sáv feleslegesen széles, a „95%” itt sem igaz. A hiba nagy $n$-nél sem tűnik el.`
        },
        {
          type: "set",
          q: R`Melyik esetben használnád nyugodtan a szórás $\chi^2$-intervallumát? (Jelöld meg mindet!)`,
          items: [
            "nagyjából normális, kiugró érték nélküli töltősúlyok",
            "200 háztartás erősen ferde jövedelmei",
            "ügyfélszolgálati várakozási idők (exponenciális jellegűek)",
            "felnőtt férfiak testmagassága (jó közelítéssel normális)",
            "1000 elemű, erősen ferde minta – a nagy n miatt"
          ],
          answer: [
            "nagyjából normális, kiugró érték nélküli töltősúlyok",
            "felnőtt férfiak testmagassága (jó közelítéssel normális)"
          ],
          hint: "Csak egyetlen feltétel számít – és ezt a mintanagyság nem helyettesíti.",
          explain: R`A $\chi^2$-intervallum feltétele a <b>normális sokaság</b>: ez a töltősúlyokra és a testmagasságra jó közelítéssel teljesül. Ferde adatoknál (jövedelem, várakozási idő) a lefedettség messze 95% alatt lehet. A tipikus hiba az átlag intervallumából áthozott gondolat, hogy „nagy mintán a CHT megment”: az $s^2$ eloszlása a sokaság csúcsosságától függ, és ez nagy $n$-nél sem tűnik el. Ilyenkor bootstrap (6.7) a jobb választás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány szabadságfokú $\chi^2$-eloszlás kvantilisei kellenek egy 25 elemű minta szórásának KI-jéhez?`,
          options: ["24", "25", "23", "26"],
          answer: 0,
          hint: R`Nézd meg a tételt: $(n-1)s^2/\sigma^2 \sim \chi^2_{?}$.`,
          explain: R`$(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$, tehát $25 - 1 = 24$ szabadságfok – ugyanannyi, mint az $s^2$ nevezője. A 25 a tipikus „szabadságfok = $n$” hiba. A 23 és a 26 mellé lő: egy paramétert ($\mu$-t) becsültünk az $\bar x$-szel, ezért pontosan egy szabadságfok vész el.`
        }
      ]
    },

    /* ------------------------------------------------ 6.6 */
    "ms6-66": {
      title: "Kvíz – 6.6 Mintanagyság tervezése",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 12$, és a várható érték 95%-os hibahatára legfeljebb $\Delta = 2$ lehet. Legalább mekkora minta kell?`,
          options: ["139", "138", "12", "98"],
          answer: 0,
          hint: R`$n \ge (z\sigma/\Delta)^2$ – és gondold végig, merre kell kerekíteni.`,
          explain: R`$(1{,}96 \cdot 12/2)^2 = 11{,}76^2 \approx 138{,}3$ → felfelé kerekítve <b>139</b>. A 138 lefelé kerekít: azzal a hibahatár kicsit nagyobb lenne az előírtnál. A 12 a $z\sigma/\Delta = 11{,}76$ kerekítése – a négyzetre emelés maradt el. A 98 a 90%-os $z = 1{,}645$-tel számol ($9{,}87^2 \approx 97{,}4$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A KI <b>teljes szélessége</b> legfeljebb 4 g lehet (95%, $\sigma = 10$ g). Hány elem kell?`,
          options: ["97", "25", "385", "96"],
          answer: 0,
          hint: R`A képletben a hibahatár, $\Delta$ szerepel. Hogyan aránylik a hibahatár a teljes szélességhez?`,
          explain: R`A szélesség $2\Delta$, tehát $\Delta = 2$: $(1{,}96 \cdot 10/2)^2 = 9{,}8^2 = 96{,}04$ → <b>97</b>. A 25 a szélességet vette hibahatárnak ($\Delta = 4$: $4{,}9^2 \approx 24{,}0$). A 385 $\Delta = 1$-gyel számol (a szélesség negyedével). A 96 lefelé kerekít – 96,04-nél ez már kevés.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 10$, $\Delta = 2$, 95%. A sokaság csak $N = 400$ elemű, visszatevés nélkül húzunk. Legalább mekkora minta kell?`,
          options: ["78", "97", "77", "73"],
          answer: 0,
          hint: R`Előbb számold ki a végtelen sokaságra vonatkozó $n_0$-t, aztán használd az $n = n_0/(1 + n_0/N)$ korrekciót!`,
          explain: R`$n_0 = (1{,}96 \cdot 10/2)^2 = 96{,}04$. $n = 96{,}04/(1 + 96{,}04/400) = 96{,}04/1{,}2401 \approx 77{,}4$ → <b>78</b>. A 97 a korrekció nélküli érték: itt a kiválasztási arány kb. 20%, ezért érdemes korrigálni. A 77 lefelé kerekít. A 73 a rossz $n_0(1 - n_0/N) \approx 73{,}0$ képletből jön – a helyes korrekció osztás, nem szorzás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy felméréshez ± 4 százalékpontos hibahatár kell (95%). Az arányról semmit sem tudunk. Hány főt kérdezzünk?`,
          options: ["601", "600", "423", "25"],
          answer: 0,
          hint: R`Ha $p$ ismeretlen, a legrosszabb esettel számolj: melyik $p$-nél legnagyobb $p(1-p)$? A $\Delta$-t tizedes törtként írd be!`,
          explain: R`$p = 0{,}5$-tel: $n = 1{,}96^2 \cdot 0{,}25/0{,}04^2 = 600{,}25$ → <b>601</b>. A 600 lefelé kerekít. A 423 a 90%-os $z = 1{,}645$-tel számol. A 25 a $\Delta$ négyzetre emelését hagyja el ($0{,}9604/0{,}04 \approx 24{,}0$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy korábbi felmérés szerint az arány kb. 20%. Legalább hány fő kell a ± 3 százalékpontos (95%) hibahatárhoz?`,
          options: ["683", "1068", "682", "854"],
          answer: 0,
          hint: R`Most van előzetes becslésünk $p$-re: írd be a $z^2 p(1-p)/\Delta^2$ képletbe!`,
          explain: R`$1{,}96^2 \cdot 0{,}2 \cdot 0{,}8/0{,}03^2 \approx 683{,}0$ → <b>683</b> (682,95, tehát a 682 kevés). Az 1068 a $p = 0{,}5$-ös legrosszabb eset – elég volna, de a feltett kérdés a <b>legkisebb</b> elég mintára vonatkozik, és ha $p$ messze van 0,5-től, kisebb minta is elég. A 854 elhagyja az $(1-p)$ tényezőt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány fő kell egy <b>99%-os</b>, ± 2 százalékpontos hibahatárú felméréshez, ha $p$-ről semmit sem tudunk? ($z = 2{,}576$)`,
          options: ["4148", "2401", "4147", "1610"],
          answer: 0,
          hint: R`Ugyanaz a képlet, mint 95%-nál, csak a $z$ más. Ne felejtsd el a $z$-t is négyzetre emelni!`,
          explain: R`$2{,}576^2 \cdot 0{,}25/0{,}02^2 \approx 4147{,}4$ → <b>4148</b>. A 2401 a 95%-os ($z = 1{,}96$) érték. A 4147 lefelé kerekít. Az 1610 a $z$ négyzetre emelését hagyja el ($2{,}576 \cdot 0{,}25/0{,}0004$).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a közvélemény-kutatások mintanagyságáról? (Több jó válasz is lehet.)`,
          options: [
            "A ± 3 százalékponthoz Magyarországon (8 millió felnőtt) és az USA-ban (260 millió) is kb. 1068 fő kell.",
            "Egy 5000 fős városban a ± 3 százalékponthoz kevesebb, kb. 880 fő is elég.",
            "Az USA-ban kb. 30-szor akkora minta kell, mert a sokaság 30-szor nagyobb.",
            "A hibahatár felezéséhez kétszeres minta kell.",
            R`Ha $p$ ismeretlen, a $p = 0{,}5$ adja a legkisebb szükséges mintát.`
          ],
          answer: [0, 1],
          hint: R`Nézd meg a véges sokasági korrekciót: mikor számít a sokaság mérete? És a $\Delta$ hogyan szerepel a képletben?`,
          explain: R`Igaz az első kettő. $n_0 \approx 1067{,}1$, és $n_0/(1 + n_0/N)$ 8 milliónál és 260 milliónál is gyakorlatilag ugyanennyi – a sokaság mérete nem számít, amíg a minta a töredéke. Egy 5000 fős városban viszont a kiválasztási arány nagy, a korrekció 879,4 → 880-at ad. <b>Hamis</b> a „nagyobb sokasághoz arányosan nagyobb minta”. Hamis a kétszeres minta is: a $\Delta$ négyzetesen áll a nevezőben, a felezéshez <b>négyszeres</b> minta kell. A $p = 0{,}5$ a <b>legnagyobb</b> $p(1-p)$-t, tehát a legnagyobb mintát adja – ezért biztonságos.`
        },
        {
          type: "match",
          q: R`Hüvelykujjszabály (95%, $p$ ismeretlen): párosítsd a hibahatárt a szükséges mintanagysággal!`,
          pairs: [
            ["± 5 százalékpont", "385 fő"],
            ["± 3 százalékpont", "1068 fő"],
            ["± 2 százalékpont", "2401 fő"],
            ["± 1 százalékpont", "9604 fő"]
          ],
          hint: R`$n = 1{,}96^2/(4\Delta^2)$. A ± 3-hoz tartozó szám a fejezet kérdéséből ismerős; a többit a négyzetes összefüggés adja.`,
          explain: R`$1{,}96^2 \cdot 0{,}25/\Delta^2$: ± 5 → 384,2 → 385; ± 3 → 1067,1 → 1068; ± 2 → 2401; ± 1 → 9604. Figyeld meg: a ± 2-ről ± 1-re (felezés) négyszeres minta, a ± 3-ról ± 1-re kilencszeres. Ezért áll meg a legtöbb felmérés 1000 fő körül – a pontosság gyorsan drágul.`
        }
      ]
    },

    /* ------------------------------------------------ 6.7 */
    "ms6-67": {
      title: "Kvíz – 6.7 Bootstrap-konfidenciaintervallum",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hogyan készül egy bootstrap-minta egy 15 elemű eredeti mintából?`,
          options: [
            "15 elemet húzunk az eredeti mintából, visszatevéssel.",
            "15 elemet húzunk az eredeti mintából, visszatevés nélkül.",
            "15 új elemet veszünk a sokaságból.",
            "Az eredeti minta felét (7–8 elemet) húzzuk ki, visszatevés nélkül."
          ],
          answer: 0,
          hint: "Mi lenne, ha visszatevés nélkül húznánk mind a 15 elemet? Mennyiben különbözne az eredetitől?",
          explain: R`A bootstrap-minta az eredeti mintából <b>visszatevéssel</b> húzott, ugyanakkora ($n$ elemű) minta: egyes adatok többször, mások egyszer sem jönnek ki. Visszatevés nélkül 15 elemet húzva mindig ugyanazt a mintát kapnánk (más sorrendben), így minden statisztika ugyanannyi lenne – nincs ingadozás. Új minta a sokaságból épp az, amire nincs lehetőségünk; a bootstrap ezt helyettesíti. A fele minta más mintanagyság, más standard hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`2000 bootstrap-átlagot sorba rendeztünk. Melyik két sorszámú érték adja a 95%-os percentilis-intervallum határait?`,
          options: [
            "az 50. és az 1950.",
            "a 25. és a 975.",
            "a 100. és az 1900.",
            "az 50. és a 950."
          ],
          answer: 0,
          hint: "95%-hoz a 2,5%-os és a 97,5%-os percentilis kell. Mennyi a 2000 2,5%-a?",
          explain: R`$0{,}025 \cdot 2000 = 50$ és $0{,}975 \cdot 2000 = 1950$. A 25. és a 975. 1000 bootstrap-értékhez illene. A 100. és az 1900. az 5%-os és a 95%-os percentilis, vagyis a <b>90%-os</b> intervallum. Az 50. és a 950. vegyes hiba: alul 2000-rel, felül 1000-rel számol.`
        },
        {
          type: "multi",
          q: R`Melyik igaz a bootstrap-percentilis-intervallumra? (Több jó válasz is lehet.)`,
          options: [
            "Nem kell hozzá normális sokaság.",
            "Olyan statisztikára is ad KI-t, amelyre nincs egyszerű képlet (medián, korreláció).",
            "6–8 elemű mintán is megbízható, hiszen akárhány bootstrap-mintát vehetünk.",
            "Kijavítja a torzított (nem reprezentatív) mintavétel hibáját.",
            "A minta maximumára is jól működik."
          ],
          answer: [0, 1],
          hint: R`A bootstrap csak azt „látja”, ami az eredeti mintában benne van. Mi következik ebből kis mintánál, torzított mintánál és a maximumnál?`,
          explain: R`Igaz az első kettő: a bootstrap képlet és normalitás nélkül, a minta tényleges alakjából dolgozik, ezért mediánra, korrelációra is jó. <b>Hamis</b>, hogy kis mintán megbízható: a bootstrap-minták számának növelése nem pótolja a kevés eredeti adatot – kis mintán a sáv túl szűk (20–30 elem alatt óvatosan). Torzított mintát sem javít: ha a minta nem tükrözi a sokaságot, az újraminták sem. A maximumra rossz, mert az újraminták maximuma sosem haladja meg az eredeti maximumot.`
        },
        {
          type: "single", shuffle: true,
          q: R`A konzervek szórására a $\chi^2$-intervallum [9,71; 20,92], a bootstrap-percentilis-intervallum kb. [9,0; 15,9]. Mi a helyes értékelés, ha a töltősúly normális?`,
          options: [
            R`A $\chi^2$-intervallum a megbízható; a bootstrap 15 adatból alábecsüli a bizonytalanságot, ezért túl szűk.`,
            "A bootstrap a jobb, mert szűkebb, tehát pontosabb.",
            R`A $\chi^2$-intervallum hibás, mert nem szimmetrikus a 13,27-re.`,
            "A két módszer ugyanazt adja, az eltérés csak kerekítés."
          ],
          answer: 0,
          hint: "Normális sokaságnál melyik módszer pontos? És mit „lát” a bootstrap 15 adatból a ritka, nagy eltérésekből?",
          explain: R`Normális sokaságnál a $\chi^2$-intervallum pontos. A bootstrap újraminták szórása sosem lehet nagyobb, mint amit a 15 adat „megenged”, a ritka nagy eltéréseket nem látja – kis mintán a bootstrap-sáv túl optimista. A szűkebb sáv csak akkor jobb, ha közben tartja a megbízhatóságot; itt nem tartja. Az aszimmetria nem hiba, a $\chi^2$ jobbra ferdeségéből jön. A különbség (a felső határ 20,9 vs. 15,9) messze nem kerekítés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ingázási idők (12 adat, jobbra ferde, egy 61 perces kiugró értékkel): $t$-KI [17,7; 35,6], bootstrap-KI kb. [19,9; 35,0]. Miért aszimmetrikus a bootstrap-sáv az átlag (26,7) körül?`,
          options: [
            "A ferde adatban kis átlagokhoz nincs „honnan” jönni, nagyokhoz (a 61-es többszöri kihúzásával) van – a bootstrap a minta tényleges alakját követi.",
            "Mert a bootstrap-mintákat visszatevés nélkül húzzuk.",
            "A bootstrap mindig aszimmetrikus, az adatok alakjától függetlenül.",
            R`Mert a $t$-kvantilis helyett $z$-t használ.`
          ],
          answer: 0,
          hint: R`A $t$-KI képlete eleve $\bar x \pm \Delta$ alakú. A bootstrap-eloszlás alakját mi határozza meg?`,
          explain: R`A $t$-intervallum a képlete miatt szimmetrikus. A bootstrap-eloszlás a minta alakját tükrözi: ferde adatnál ferde a bootstrap-eloszlás is. A nagy átlagokat a kiugró 61-es többszöri kihúzása adja, kis átlagokhoz nincs ilyen szélső érték – ezért balra rövidebb a sáv. A bootstrap visszatevéssel húz, nem visszatevés nélkül. Szimmetrikus adatnál a bootstrap-sáv is közel szimmetrikus. A bootstrap-percentilis-intervallum egyáltalán nem használ $z$- vagy $t$-kvantilist.`
        },
        {
          type: "set",
          q: R`Melyik esetben a bootstrap-percentilis-intervallum a jó választás? (Jelöld meg mindet!)`,
          items: [
            "80 háztartás jövedelmének mediánja",
            "30 pontpár korrelációs együtthatója",
            "200 elemű, nagyjából szimmetrikus minta átlaga",
            "50 elemű minta maximuma",
            "6 elemű minta szórása"
          ],
          answer: [
            "80 háztartás jövedelmének mediánja",
            "30 pontpár korrelációs együtthatója"
          ],
          hint: "Van-e megbízható képlet? Ha nincs: elég nagy-e a minta, és nem szélsőértékről van-e szó?",
          explain: R`A mediánra és a korrelációra nincs egyszerű képlet, a minták elég nagyok: ide bootstrap kell (a korrelációnál pontpárokat húzunk visszatevéssel). A 200 elemű szimmetrikus minta átlagára a $t$-intervallum pontos – a bootstrap ugyanazt adná, de nincs rá szükség. A maximumra a bootstrap rossz: az újraminták maximuma sosem lépi túl az eredetit. 6 elemnél a bootstrap erősen alábecsüli a bizonytalanságot; normális sokaságnál ott a $\chi^2$-intervallum a jobb.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanarra a várható értékre a $t$-KI [12; 20], a bootstrap-KI [13; 26]. Mit gyanítasz?`,
          options: [
            R`Erősen jobbra ferde adatot nagy kiugró értékekkel – a $t$-intervallum itt kevésbé megbízható, nézd meg a hisztogramot.`,
            "A bootstrap biztosan hibás, mert eltér a képlettől – a t-KI-t kell elfogadni.",
            "Balra ferde adatot, sok kis kiugró értékkel.",
            "Nincs mit gyanítani: a két módszer mindig ennyire eltér."
          ],
          answer: 0,
          hint: "Merre nyúlik el a bootstrap-sáv a t-sávhoz képest? És mit mond a hüvelykujjszabály, ha a két módszer nagyon eltér?",
          explain: R`A bootstrap-sáv jobbra elnyúlik (felső határ 26 vs. 20): ez jobbra ferde, nagy kiugró értékeket tartalmazó adatra utal. A hüvelykujjszabály szerint, ha a képlet és a bootstrap nagyon eltér, az <b>jelzés</b>: nézd meg alaposabban az adatokat. Nem a bootstrap a „hibás” – ferde adatnál épp a $t$-intervallum szimmetriája gyanús. Balra ferde adatnál a sáv balra nyúlna el. Ha a feltételek teljesülnek, a két módszer nagyon hasonlót ad (a konzerveknél [390,65; 405,35] vs. [391,6; 404,6]).`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms6-final": {
      title: "Fejezetzáró teszt – 6. Becslés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy $\theta$ paraméterre két becslés van. Az A torzítatlan, szórásnégyzete 10. A B torzítása $-2$, szórásnégyzete 5. Mennyi a B átlagos négyzetes hibája (MSE)?`,
          options: ["9", "3", "5", "7"],
          answer: 0,
          hint: R`$\mathrm{MSE} = b^2 + D^2$. Figyelj a torzítás előjelére és a négyzetre!`,
          explain: R`$\mathrm{MSE}(B) = (-2)^2 + 5 = 9 \lt 10 = \mathrm{MSE}(A)$: a torzított B a jobb. A 3 a $b + D^2$ hibás képletből jön ($-2 + 5$), a 7 az $|b| + D^2$-ből – mindkettő elfelejti a négyzetet. Az 5 csak a szórásnégyzet: torzított becslésnél ez kevés, az MSE a torzítást is bünteti.`
        },
        {
          type: "multi",
          q: R`Melyik becslés <b>konzisztens</b> a mellé írt paraméterre? (Több jó válasz is lehet.)`,
          options: [
            R`$\bar X$ a $\mu$-re`,
            R`$\hat\sigma^2_n$ (az $n$-es nevezőjű szórásnégyzet) a $\sigma^2$-re`,
            R`$\bar X + \frac1n$ a $\mu$-re`,
            R`$X_1$ (az első megfigyelés) a $\mu$-re`,
            R`$\frac{X_1 + X_n}{2}$ a $\mu$-re`
          ],
          answer: [0, 1, 2],
          hint: R`Elég feltétel: aszimptotikusan torzítatlan, és a szórásnégyzete 0-hoz tart. Melyiknek csökken a szórásnégyzete $n$-nel?`,
          explain: R`$\bar X$: torzítatlan, $D^2 = \sigma^2/n \to 0$ – konzisztens. $\hat\sigma^2_n$: torzított, de aszimptotikusan torzítatlan ($\frac{n-1}{n} \to 1$), szórásnégyzete 0-hoz tart – konzisztens. $\bar X + \frac1n$: a torzítás $\frac1n \to 0$ – konzisztens. Az $X_1$ torzítatlan, de a szórásnégyzete $\sigma^2$ marad, akármekkora a minta – <b>nem</b> konzisztens (a tipikus hiba: torzítatlan = jó). Az $\frac{X_1 + X_n}{2}$ szórásnégyzete mindig $\sigma^2/2$ – szintén nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyenletes eloszlás a $[0; \theta]$ szakaszon, minta: 1, 3, 11. Mi a $\theta$ <b>maximum likelihood</b> becslése?`,
          options: ["11", "10", "5", "14,67"],
          answer: 0,
          hint: R`A likelihood $\theta^{-3}$, ha $\theta$ legalább akkora, mint minden adat, különben 0. Hol a legnagyobb?`,
          explain: R`$L(\theta) = \theta^{-3}$, ha $\theta \ge 11$, különben 0. A $\theta^{-3}$ csökken, ezért a legkisebb megengedett érték a maximum: $\hat\theta = \max = 11$. A 10 a momentum-becslés ($2\bar x = 2 \cdot 5$) – kisebb a megfigyelt 11-nél, tehát lehetetlen. Az 5 a mintaátlag, az a $\theta/2$-t becsüli. A 14,67 $= \frac{n+1}{n}\max$ a torzításra javított becslés – torzítatlan, de nem az ML (az ML nem mindig torzítatlan).`
        },
        {
          type: "single", shuffle: true,
          q: R`10 dobásból 7 fej: $L(0{,}7) = 0{,}00222$ a legnagyobb likelihood. Mit jelent ez helyesen?`,
          options: [
            R`A $p = 0{,}7$ mellett a legvalószínűbb, hogy épp ez a sorozat jön ki.`,
            R`A $p$ értéke 0,222% valószínűséggel 0,7.`,
            R`A $p = 0{,}7$ a $p$ legvalószínűbb értéke.`,
            R`A $p$ biztosan 0,7, hiszen az ML becslés torzítatlan.`
          ],
          answer: 0,
          hint: R`A likelihood a megfigyelt adat valószínűsége a paraméter függvényében. Van-e a $p$-nek valószínűsége a klasszikus statisztikában?`,
          explain: R`A likelihood <b>az adat</b> valószínűsége egy adott $p$ mellett: $L(p) = p^7(1-p)^3$. A $p$ rögzített (csak ismeretlen) szám, nincs valószínűsége – ezért pontatlan a „$p$ legvalószínűbb értéke”, és hamis a „0,222% valószínűséggel 0,7”. Az ML becslés sem „biztos” érték, csak egy becslés; és az ML nem mindig torzítatlan (pl. a normális eloszlás $\hat\sigma^2_n$-e).`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaságból $n = 16$, $\bar x = 40$, $s = 6$. Mi a 95%-os KI a várható értékre? ($t_{15;\,0{,}975} = 2{,}131$)`,
          options: ["[36,80; 43,20]", "[37,06; 42,94]", "[27,21; 52,79]", "[37,53; 42,47]"],
          answer: 0,
          hint: R`A $\sigma$-t a mintából becsüljük. Mekkora a becsült standard hiba?`,
          explain: R`$s/\sqrt n = 6/4 = 1{,}5$; $\Delta = 2{,}131 \cdot 1{,}5 \approx 3{,}20$; KI: $[36{,}80;\ 43{,}20]$. A [37,06; 42,94] $z = 1{,}96$-tal számol – kis mintánál, ismeretlen $\sigma$ mellett túl szűk. A [27,21; 52,79] elhagyja a $\sqrt n$-t ($2{,}131 \cdot 6$): az az adatok szóródása, nem az átlagé. A [37,53; 42,47] az $1{,}645$-öt használja, ami a 90%-os $z$.`
        },
        {
          type: "multi",
          q: R`A konzervek várható töltősúlyára a 95%-os KI [392,94; 403,06] g. Melyik megfogalmazás helyes? (Több jó válasz is lehet.)`,
          options: [
            "Az eljárás a lehetséges minták kb. 95%-ában olyan sávot ad, amely lefedi a valódi várható értéket.",
            "A 400 g benne van a sávban, így az adat összeegyeztethető a gyártó állításával.",
            "A konzervek 95%-a 392,94 és 403,06 g közötti.",
            "Egy újabb 15 konzerves minta átlaga 95% eséllyel a sávba esik.",
            "A 99%-os KI ugyanebből a mintából szűkebb, tehát pontosabb lenne."
          ],
          answer: [0, 1],
          hint: R`Mi a véletlen: a $\mu$ vagy a sáv? És a KI az egyes konzervekről vagy az átlagról szól?`,
          explain: R`Az első kettő helyes: a 95% az <b>eljárás</b> tulajdonsága, és a sávon belüli 400 összeegyeztethető az adattal. Az egyes konzervek kb. $\pm 19{,}6$ g-on belül szóródnak, a KI csak az átlagról szól. Egy új átlag nem 95%-ban, hanem csak kb. 83%-ban esik a sávba, mert a sáv közepe maga is ingadozik. A 99%-os KI <b>szélesebb</b> (megbízhatóbb, de kevésbé pontos).`
        },
        {
          type: "single", shuffle: true,
          q: R`900 megkérdezettből 360 támogat egy javaslatot. Mi a 95%-os Wald-intervallum?`,
          options: ["[36,8%; 43,2%]", "[37,3%; 42,7%]", "[38,7%; 41,3%]", "[35,8%; 44,2%]"],
          answer: 0,
          hint: R`$\hat p = 0{,}4$. A hibahatár $1{,}96\sqrt{\hat p(1-\hat p)/n}$ – és százalékpontban kell hozzáadni.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}4 \cdot 0{,}6/900} \approx 0{,}0163$; $\Delta = 1{,}96 \cdot 0{,}0163 \approx 0{,}032$ – azaz 3,2 <b>százalékpont</b>: [36,8%; 43,2%]. A [37,3%; 42,7%] a 90%-os $z = 1{,}645$-tel készült, a [35,8%; 44,2%] a 99%-os $2{,}576$-tal. A [38,7%; 41,3%] a százalék–százalékpont keverése: a 40%-nak vette a 3,2%-át (1,28 pont).`
        },
        {
          type: "single", shuffle: true,
          q: R`30 tesztből egyik sem volt hibás. Kb. mennyi a hibaarány 95%-os felső határa?`,
          options: ["10%", "0%", "3,3%", "5%"],
          answer: 0,
          hint: "0 esemény esetén a Wald használhatatlan. Van egy egyszerű szabály a felső határra.",
          explain: R`A „3-as szabály”: 0 esemény $n$ próbából → a 95%-os felső határ kb. $3/n = 3/30 = 10\%$. A 0% a Wald-intervallum ([0; 0]) – azt állítaná, hogy biztosan nincs hiba, ami butaság. A 3,3% $= 1/30$ azt az arányt adja, mintha egy hibát láttunk volna – felső határnak túl optimista. Az 5% az $\alpha$-t keveri össze a felső határral.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $n = 20$, $s = 4$. Mi a 95%-os KI $\sigma$-ra? ($\chi^2_{19}$: 8,907 és 32,852)`,
          options: ["[3,04; 5,84]", "[9,25; 34,13]", "[3,12; 5,99]", "[1,52; 2,92]"],
          answer: 0,
          hint: R`$(n-1)s^2$-et oszd a két kvantilissel – a nagyobbikkal az alsó határhoz –, aztán vonj gyököt.`,
          explain: R`$19 \cdot 16 = 304$; $\sigma^2 \in [304/32{,}852;\ 304/8{,}907] = [9{,}25;\ 34{,}13]$; $\sigma \in [3{,}04;\ 5{,}84]$. A [9,25; 34,13] a szórásnégyzet sávja, gyökvonás nélkül. A [3,12; 5,99] $n = 20$-szal szoroz $n - 1$ helyett. Az [1,52; 2,92] $s^2$ helyett $s$-sel számol. Vedd észre: a sáv aszimmetrikus a 4-re.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 8$. Legalább mekkora minta kell, hogy a <b>99%-os</b> KI teljes szélessége legfeljebb 4 legyen? ($z = 2{,}576$)`,
          options: ["107", "106", "27", "62"],
          answer: 0,
          hint: R`A teljes szélesség $2\Delta$. Utána $n \ge (z\sigma/\Delta)^2$, felfelé kerekítve.`,
          explain: R`$\Delta = 2$: $(2{,}576 \cdot 8/2)^2 = 10{,}304^2 \approx 106{,}2$ → <b>107</b>. A 106 lefelé kerekít. A 27 a szélességet vette hibahatárnak ($\Delta = 4$: $\approx 26{,}5$). A 62 a 95%-os $z = 1{,}96$-tal számol ($\approx 61{,}5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik állítás igaz a bootstrap-percentilis-intervallumra?`,
          options: [
            "Kis mintán általában túl szűk: a névlegesnél ritkábban fedi le a paramétert.",
            "Kis mintán is megbízható, mert akárhány bootstrap-mintát vehetünk.",
            "Mindig szélesebb a képletes intervallumnál, ezért biztonságosabb.",
            "Csak normális sokaságra használható, mint a szórás χ²-intervalluma."
          ],
          answer: 0,
          hint: R`A bootstrap az eredeti mintát újramintázza. Mit nem lát egy kis minta a sokaságból?`,
          explain: R`A bootstrap-intervallum kis mintán túl optimista: az újraminták nem tartalmazhatnak olyan nagy eltérést, ami az eredeti mintában nincs (a konzervek szórásánál [9,0; 15,9] a $\chi^2$-sáv [9,71; 20,92]-jével szemben). Több bootstrap-minta csak a percentilisek számolási hibáját csökkenti, az eredeti adatok kevésségét nem pótolja. Nem mindig szélesebb – inkább szűkebb. Normális sokaságot pedig épp nem igényel: ez az egyik nagy előnye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 1000 fős felmérésben a Zöld Út 31% ([28,1%; 33,9%]), egy másik párt 27% ([24,2%; 29,8%]). Mi a helyes következtetés?`,
          options: [
            "Ebből nem dönthető el, hogy a Zöld Út vezet: a különbség hibahatára kb. ± 4,7 százalékpont, a 4 pontos előny belefér.",
            "A sávok átfednek, tehát biztosan nincs különbség a két párt között.",
            "A Zöld Út biztosan vezet, hiszen 31 > 27.",
            "A különbség hibahatára a két hibahatár összege, kb. ± 5,6 százalékpont, ezért a sávokat kell összevetni."
          ],
          answer: 0,
          hint: "Az átfedés vagy a pontbecslések sorrendje dönt – vagy a különbségre kell külön intervallum?",
          explain: R`A helyes eljárás: a <b>különbségre</b> számolj intervallumot. Két arány egy mintából: a különbség hibahatára kb. ± 4,7 százalékpont, a 4 pontos előny belefér – a minta alapján nem biztos, hogy a Zöld Út vezet. Az átfedésből <b>nem</b> következik, hogy nincs különbség (a különbség hibahatára kisebb, mint a két hibahatár összege, így a ± 5,6 is téves). A 31 > 27 pedig figyelmen kívül hagyja a mintavételi ingadozást.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hír: „52% támogatja, ± 2,5 százalékpont (95%)”. Kb. mekkora volt a minta?`,
          options: ["kb. 1530 fő", "kb. 1080 fő", "kb. 5670 fő", "kb. 40 fő"],
          answer: 0,
          hint: R`Fejezd ki $n$-et a $\Delta = 1{,}96\sqrt{\hat p(1-\hat p)/n}$ képletből! A $\Delta$ százalékpont: tizedes törtként 0,025.`,
          explain: R`$n = 1{,}96^2 \cdot 0{,}52 \cdot 0{,}48/0{,}025^2 \approx 1534$ – kb. 1530 fő. A kb. 1080 a 90%-os $z = 1{,}645$-tel számol. A kb. 5670 a százalék–százalékpont keverése: a 52% 2,5%-át (1,3 pont) vette hibahatárnak. A kb. 40 a $\Delta$ négyzetre emelését hagyja el.`
        },
        {
          type: "match",
          q: R`Melyik intervallum kell? Párosítsd a helyzetet a módszerrel!`,
          pairs: [
            [R`átlag, a gép szórása ismert ($\sigma = 10$ g)`, "z-intervallum"],
            ["átlag, 12 elemű normális minta, a szórást a mintából számoljuk", "t-intervallum, n − 1 szabadságfok"],
            ["arány, 25 betegből 1 mellékhatás", "Wilson vagy „plusz négy”"],
            ["egy gép szórása, normális töltősúlyok", "khi-négyzet-intervallum"],
            ["60 lakás árának mediánja", "bootstrap-percentilis-intervallum"]
          ],
          hint: "Mit becsülsz (átlag, arány, szórás, más)? Ismert-e a szórás? Elég sok-e az „igen”?",
          explain: R`Átlag, ismert $\sigma$ → $z$. Átlag, $s$ a mintából → $t_{n-1}$ (kis mintánál normális sokaság kell). Arány kevés „igennel” ($n\hat p = 1 \lt 10$) → a Wald nem megbízható, Wilson vagy „plusz négy”. Szórás normális sokaságból → $\chi^2$-intervallum (aszimmetrikus). Mediánra nincs egyszerű képlet → bootstrap-percentilis. A tipikus csere a $z$ ↔ $t$: ha a szórást a mintából számoljuk, a $t$-kvantilis kell.`
        }
      ]
    },
