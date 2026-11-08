(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 5.1 */
    "ms5-51": {
      title: "Kvíz – 5.1 A statisztika mint valószínűségi változó",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 6 fős sokaságból 2 fős mintát veszünk, <b>visszatevés nélkül</b> (a sorrend nem számít). Hány lehetséges minta van?`,
          options: ["15", "36", "30", "12"],
          answer: 0,
          hint: "Visszatevés nélkül ugyanaz az ember nem jöhet kétszer, és a {Anna, Bence} ugyanaz a minta, mint a {Bence, Anna}.",
          explain: R`$\binom62 = 15$ minta, mindegyik $1/15$ eséllyel. A $6^2 = 36$ a <b>visszatevéses</b>, sorrendezett minták száma (ott ugyanaz az ember kétszer is kijöhet). A $6 \cdot 5 = 30$ visszatevés nélküli, de <b>sorrendezett</b> húzásokat számol: minden mintát kétszer. A $6 \cdot 2 = 12$ nem kombinatorikai szám, csak a két adat szorzata.`
        },
        {
          type: "match",
          q: R`A sportolók sokasága: Anna 2, Bence 4, Csilla 6, Dani 8, Emese 10 óra. Mi micsoda? Párosítsd!`,
          pairs: [
            [R`$\mu = 6$ óra`, "paraméter (rögzített szám)"],
            [R`a sorsolás előtt: $\bar X = (X_1 + X_2)/2$`, "valószínűségi változó (statisztika)"],
            [R`a kihúzott Bence és Dani átlaga: $\bar x = 6$`, "megfigyelt érték (egy szám)"],
            ["2, 4, 6, 8, 10, mindegyik 1/5 eséllyel", "az adatok (sokaság) eloszlása"],
            ["3, 4, 5, …, 9 a 0,1; 0,1; 0,2; … valószínűségekkel", "mintavételi eloszlás"]
          ],
          hint: R`Kérdezd meg: egy ember értékeiről szól, vagy az összes lehetséges minta átlagáról? Már megtörtént a húzás, vagy még nem?`,
          explain: R`A $\mu$ a sokaság rögzített jellemzője: <b>paraméter</b>. A $\bar X$ a sorsolás előtt még ismeretlen, ezért <b>valószínűségi változó</b> – van eloszlása, várható értéke, szórása. A $\bar x = 6$ egy konkrét minta eredménye: <b>egy szám</b>, aminek nincs szórása. A 2, 4, …, 10 az egyes emberek értékei: az <b>adatok eloszlása</b>. A 3, …, 9 a 10 lehetséges 2 fős minta átlagai: a $\bar X$ <b>mintavételi eloszlása</b>. A tipikus hiba a két eloszlás összekeverése: a mintavételi eloszlás nem az egyedekről, hanem a mintajellemzőről szól.`
        },
        {
          type: "single", shuffle: true,
          q: R`A sportolók 2 fős, <b>visszatevés nélküli</b> mintáinál mennyi $P(\bar x = 7)$?`,
          options: ["0,20", "0,16", "0,10", "0,40"],
          answer: 0,
          hint: R`Sorold fel, melyik két ember átlaga 7! Hány minta van összesen visszatevés nélkül?`,
          explain: R`Átlag 7 = összeg 14. Két ilyen pár van: <b>Bence–Emese</b> (4 + 10) és <b>Csilla–Dani</b> (6 + 8). Két minta a 10-ből: $P = 0{,}2$. A 0,16 $= 4/25$ a <b>visszatevéses</b> modell értéke (ott a sorrendezett párok és az ismétlés is számít). A 0,10 csak az egyik párt veszi észre. A 0,40 a $P(\bar x \ge 7)$ – nem pontosan 7.`
        },
        {
          type: "single", shuffle: true,
          q: R`Most <b>visszatevéssel</b> húzunk kétszer a sportolók közül. Mennyi $P(\bar X = 4)$?`,
          options: ["0,12", "0,08", "0,10", "0,04"],
          answer: 0,
          hint: R`Visszatevéssel $5 \cdot 5 = 25$ egyformán valószínű <b>sorrendezett</b> minta van. Melyik $(X_1, X_2)$ párok adnak 8-as összeget?`,
          explain: R`Összeg 8: $(2, 6)$, $(6, 2)$ és $(4, 4)$ – 3 eset a 25-ből, $P = 3/25 = 0{,}12$. A 0,08 $= 2/25$ elfelejti, hogy $(2,6)$ és $(6,2)$ két külön sorrendezett minta. A 0,10 a visszatevés nélküli érték (ott $(4,4)$ nem jöhet ki). A 0,04 $= 1/25$ csak a $(4,4)$-et számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy szabályos kockával kétszer dobunk (visszatevéses minta az 1, …, 6 „sokaságból”). Mennyi az esélye, hogy a két dobás <b>átlaga</b> 2?`,
          options: ["3/36", "2/36", "1/36", "6/36"],
          answer: 0,
          hint: "Átlag 2 = összeg 4. Sorold fel a sorrendezett dobáspárokat!",
          explain: R`Összeg 4: $(1,3)$, $(2,2)$, $(3,1)$ – 3 eset a 36-ból, $P = 3/36 = 1/12$. A 2/36 elhagyja a sorrendet ($(1,3)$ és $(3,1)$ két eset). Az 1/36 csak a $(2,2)$-t veszi. A 6/36 = 1/6 egyetlen dobás esélye arra, hogy 2 – az átlag eloszlása viszont nem egyezik az egyes dobásokéval.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`A $\bar X$ valószínűségi változó: van várható értéke és szórása.`,
            R`A $\bar x$ egy konkrét szám, egyetlen számnak nincs szórása.`,
            R`Visszatevéses modellben minden $X_i$ eloszlása a sokaság eloszlása.`,
            R`Kis sokaságnál a visszatevés nélküli húzások is függetlenek.`,
            R`Egy 2 fős minta két adata (pl. 4 és 8) maga a mintavételi eloszlás.`
          ],
          answer: [0, 1, 2],
          hint: R`Nagy betű: még nem húztunk. Kis betű: már húztunk. És gondold végig: ha Annát kihúztuk, visszatevés nélkül jöhet-e újra?`,
          explain: R`Az első három igaz: $\bar X$ a sorsolás előtti véletlen mennyiség, $\bar x$ a realizációja; visszatevéssel minden húzás ugyanabból a teljes sokaságból jön, így $E(X_i) = \mu$, $D(X_i) = \sigma$. <b>Hamis</b>, hogy kis sokaságnál a visszatevés nélküli húzások függetlenek: ha az első Anna volt, a második várható értéke már $(4+6+8+10)/4 = 7$, nem 6. <b>Hamis</b> az utolsó is: két adat a minta eloszlása; a mintavételi eloszlás az <b>összes lehetséges</b> minta átlagainak eloszlása.`
        },
        {
          type: "multi",
          q: R`A független (visszatevéses) modellben melyik statisztika <b>torzítatlan</b> becslése a mellé írt paraméternek? (Több jó válasz is lehet.)`,
          options: [
            R`$\bar X$ a $\mu$-nek`,
            R`$s^2$ (az $n-1$-es nevezővel) a $\sigma^2$-nek`,
            "a minta maximuma a sokaság maximumának",
            "a minta minimuma a sokaság minimumának",
            "a minta terjedelme a sokaság terjedelmének"
          ],
          answer: [0, 1],
          hint: R`Torzítatlan: a mintavételi eloszlás várható értéke épp a paraméter. Lehet-e a minta maximuma nagyobb a sokaságénál?`,
          explain: R`$E(\bar X) = \mu$ és $E(s^2) = \sigma^2$ (a sportolóknál a 25 visszatevéses minta $s^2$-einek átlaga pontosan 8). A minta maximuma sosem nagyobb a sokaságénál, de gyakran kisebb, ezért <b>alábecsül</b> (visszatevés nélkül $E = 8 \lt 10$). A minimum ugyanígy <b>túlbecsül</b> ($E = 4 \gt 2$), a terjedelem erősen alábecsül ($E = 3{,}2 \lt 8$). Egyetlen mintából ez nem látszik – csak a mintavételi eloszlásból.`
        },
        {
          type: "single", shuffle: true,
          q: R`A sokaság: 1, 3, 5. Két elemet húzunk <b>visszatevés nélkül</b>. Mennyi a minta maximumának várható értéke?`,
          options: ["4,33", "3,89", "5,00", "3,00"],
          answer: 0,
          hint: R`Sorold fel mind a $\binom32$ mintát, és írd mellé a nagyobbik elemet!`,
          explain: R`$\{1,3\} \to 3$, $\{1,5\} \to 5$, $\{3,5\} \to 5$, mindegyik $1/3$ eséllyel: $E = 13/3 \approx 4{,}33$ – kevesebb a sokasági maximumnál (5), tehát torzított. A 3,89 $= 35/9$ a visszatevéses modell értéke (9 sorrendezett minta). Az 5,00 azt feltételezi, hogy a maximum torzítatlan. A 3,00 a sokaság átlaga ($\mu$) – az a $\bar X$ várható értéke, nem a maximumé.`
        }
      ]
    },

    /* ------------------------------------------------ 5.2 */
    "ms5-52": {
      title: "Kvíz – 5.2 A mintaátlag várható értéke és szórása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A sokaság szórása $\sigma = 12$, a minta $n = 16$ elemű. Mennyi a mintaátlag standard hibája?`,
          options: ["3,00", "0,75", "9,00", "12,00"],
          answer: 0,
          hint: R`$\mathrm{SE} = \sigma/\sqrt n$. A gyököt ne felejtsd el – és a szórást oszd, ne a szórásnégyzetet!`,
          explain: R`$\mathrm{SE} = 12/\sqrt{16} = 12/4 = 3$. A 0,75 $= 12/16$: $n$-nel osztott $\sqrt n$ helyett. A 9 $= 144/16$ a <b>szórásnégyzet</b>, $D^2(\bar X)$ – ennek a gyöke az SE. A 12 a $\sigma$ maga: ez az egyes adatok szóródása (SD), nem az átlagé (SE).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 100 fős felmérésben az átlag standard hibája 4. Mennyi lesz, ha <b>200</b> főt kérdezünk meg (minden más változatlan)?`,
          options: ["2,83", "2,00", "4,00", "5,66"],
          answer: 0,
          hint: R`Az SE nem $n$-nel, hanem $\sqrt n$-nel arányosan csökken. Hányszorosára nő a $\sqrt n$?`,
          explain: R`Kétszeres minta → a $\sqrt n$ $\sqrt2$-szeresére nő → $\mathrm{SE} = 4/\sqrt2 \approx 2{,}83$ (kb. 29%-kal kisebb). A 2,00 a tipikus „kétszer annyi adat, fele akkora hiba” tévedés – a felezéshez <b>négyszer</b> annyi adat kell. A 4,00 összekeveri az SE-t az SD-vel (a szórás nem függ $n$-től). Az 5,66 rossz irányba számol: nagyobb mintánál a hiba nem nőhet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az IQ szórása $\sigma = 15$; 25 fős mintánál $\mathrm{SE} = 3$. Hány fős minta kell az $\mathrm{SE} = 1$-hez?`,
          options: ["225", "75", "15", "9"],
          answer: 0,
          hint: R`Hányadára kell csökkenteni a hibát? A $\sqrt n$-törvény szerint ehhez hányszoros minta kell? (Vagy: $n = (\sigma/\mathrm{SE})^2$.)`,
          explain: R`A hibát harmadára kell csökkenteni → $3^2 = 9$-szeres minta: $9 \cdot 25 = 225$. Ugyanez a képlettel: $n = (15/1)^2 = 225$. A 75 a lineáris gondolkodás (háromszoros minta → harmad hiba). A 15 a négyzetre emelés elfelejtése ($\sigma/\mathrm{SE}$). A 9 csak a szorzó: elfelejti, hogy a 25 fős mintát kell kilencszerezni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 400 fős sokaságból 100 elemet választunk <b>visszatevés nélkül</b>; $\sigma = 20$. Mennyi a mintaátlag standard hibája?`,
          options: ["1,73", "2,00", "2,31", "1,50"],
          answer: 0,
          hint: R`A kiválasztási arány 25% – ez nem kicsi. Szorozd meg a $\sigma/\sqrt n$-t a $\sqrt{(N-n)/(N-1)}$ korrekcióval!`,
          explain: R`Korrekció nélkül $20/\sqrt{100} = 2$. A szorzó $\sqrt{300/399} \approx 0{,}867$, így $\mathrm{SE} \approx 1{,}73$. A 2,00 elhagyja a korrekciót (25%-os aránynál ez nem megengedett). A 2,31 $= 2/0{,}867$ fordítva alkalmazza – a korrekció mindig <b>csökkenti</b> az SE-t. Az 1,50 a gyököt felejti el: $2 \cdot 300/399 \approx 1{,}50$; a $(N-n)/(N-1)$ a szórásnégyzetet szorozza, a szórást a gyöke.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a szórásra (SD) és a standard hibára (SE)? (Több jó válasz is lehet.)`,
          options: [
            R`Ha nő az $n$, az SD becslése nagyjából ugyanakkora marad, csak pontosabb lesz.`,
            R`Ha nő az $n$, az SE 0-hoz tart.`,
            R`Az SE $\sqrt n$-szer kisebb, mint a szórás.`,
            R`A grafikonon az SE-vel rajzolt hibasáv az adatok szóródását mutatja.`,
            R`Elég nagy mintánál a torzítás (pl. rossz mintavételi lista) is eltűnik.`
          ],
          answer: [0, 1, 2],
          hint: R`Az SD az egyes adatokról szól („milyen különbözők az emberek?”), az SE az átlagról („mennyire bízhatok benne?”). Mit mér a standard hiba – és mit nem?`,
          explain: R`Az első három igaz: az SD az emberek közti különbséget méri, ez nem függ attól, hányat kérdezünk meg; az SE $= \sigma/\sqrt n$ $\sqrt n$-szer kisebb, és nagy $n$-nél 0-hoz tart. <b>Hamis</b>, hogy az SE-sáv az adatok szóródása: $\sqrt n$-szer keskenyebb annál – ez a cikkek gyakori félreolvasása. <b>Hamis</b> az utolsó is: az SE csak a véletlen ingadozást méri; a torzítást semekkora minta nem tünteti el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 10 milliós országban 1000 fős (egyszerű véletlen) mintával mérünk. Egy 100 ezres városban körülbelül hány fő kell <b>ugyanakkora</b> standard hibához (azonos $\sigma$ mellett)?`,
          options: [
            "kb. 1000 (a korrekció miatt valamivel kevesebb, kb. 990)",
            "kb. 10 (a sokaság századrésze → a minta is századrész)",
            "kb. 100 (a sokaság arányának gyöke szerint)",
            "kb. 100 000 (az egész várost)"
          ],
          answer: 0,
          hint: R`Mitől függ az SE: az $n$-től vagy az $n/N$ kiválasztási aránytól? Mekkora a korrekciós szorzó, ha $n/N$ kicsi?`,
          explain: R`Az SE gyakorlatilag csak az $n$-től függ: $\sigma/\sqrt n$, a korrekciós szorzó kis kiválasztási aránynál közel 1. Az országban a szorzó $\approx 1$, a városban (1%) $\approx 0{,}995$ – ezért ott kb. 990 fő is elég. A „századakkora sokasághoz századakkora minta” a tipikus hiba: a pontosságot az $n$ határozza meg, nem az $n/N$. Az egész város megkérdezése teljes körű megfigyelés lenne – pontosabb, de messze nem kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy minta: 1, 3, 5, 7, 9. Mennyi a mintaátlag <b>becsült</b> standard hibája?`,
          options: ["1,41", "1,26", "3,16", "0,63"],
          answer: 0,
          hint: R`Előbb a korrigált szórás ($n-1$-es nevező), aztán $s/\sqrt n$.`,
          explain: R`$\bar x = 5$; $\sum(x_i - \bar x)^2 = 16 + 4 + 0 + 4 + 16 = 40$, $s^2 = 40/4 = 10$, $s \approx 3{,}16$; $\widehat{\mathrm{SE}} = 3{,}16/\sqrt5 \approx 1{,}41$. Az 1,26 az $n$-es nevezőjű szórással számol ($\sqrt8/\sqrt5$) – az alábecsüli a $\sigma$-t és így az SE-t is. A 3,16 maga az $s$ (SD, nem SE). A 0,63 $= s/n$: $n$-nel osztott $\sqrt n$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cikk: „Az átlagos ingázási idő 40 perc (SE = 0,8; n = 225).” Mennyi volt az ingázási idők szórása a mintában?`,
          options: ["12 perc", "144 perc", "180 perc", "0,05 perc"],
          answer: 0,
          hint: R`$\widehat{\mathrm{SE}} = s/\sqrt n$ – fejezd ki az $s$-t!`,
          explain: R`$s = \mathrm{SE}\cdot\sqrt n = 0{,}8 \cdot 15 = 12$ perc. A 144 $= 0{,}8^2 \cdot 225$ a szórásnégyzet ($s^2$), nem a szórás. A 180 $= 0{,}8 \cdot 225$: $n$-nel szoroz $\sqrt n$ helyett. A 0,05 $= 0{,}8/15$ rossz irányba számol: a szórás nagyobb az SE-nél, nem kisebb.`
        }
      ]
    },

    /* ------------------------------------------------ 5.3 */
    "ms5-53": {
      title: "Kvíz – 5.3 A centrális határeloszlás-tétel",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy gép töltősúlya $N(500, 10)$ grammban. Mennyi az esélye, hogy <b>4</b> véletlen doboz átlaga 495 g alatti? ($\Phi(0{,}5) \approx 0{,}691$, $\Phi(1) \approx 0{,}841$, $\Phi(2) \approx 0{,}977$.)`,
          options: ["0,159", "0,309", "0,023", "0,841"],
          answer: 0,
          hint: R`Átlagról van szó: a standardizálásnál a $\sigma$ helyett az SE-vel oszd az eltérést.`,
          explain: R`$\mathrm{SE} = 10/\sqrt4 = 5$; $z = (495 - 500)/5 = -1$; $P = \Phi(-1) = 1 - 0{,}841 \approx 0{,}159$. (A sokaság normális, így ez pontos, nem csak közelítés.) A 0,309 a $\sigma$-val standardizál – az egyetlen dobozra vonatkozik. A 0,023 $n$-nel oszt $\sqrt n$ helyett ($10/4 = 2{,}5$ → $z = -2$). A 0,841 a rossz oldal: $P(\bar X \gt 495)$.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a centrális határeloszlás-tételre? (Több jó válasz is lehet.)`,
          options: [
            R`Nagy $n$-nél a mintaátlag eloszlása közel normális, akkor is, ha a sokaság ferde.`,
            R`Ha maga a sokaság normális, $\bar X$ minden $n$-re pontosan normális.`,
            R`Nagy mintában az adatok hisztogramja is harang alakú lesz.`,
            R`$n \ge 30$ esetén a közelítés bármilyen sokaságnál jó.`,
            R`A tétel olyan sokaságra is érvényes, amelynek nincs véges szórása (pl. Cauchy).`
          ],
          answer: [0, 1],
          hint: R`A tétel az <b>átlag</b> eloszlásáról szól, nem az adatokéról. Milyen feltételei vannak?`,
          explain: R`Az első kettő igaz: a CHT az átlag (és az összeg) eloszlását teszi közel normálissá, és normális sokaságnál az átlag pontosan normális. <b>Hamis</b>: az adatok hisztogramja a sokaság alakját mutatja (ferde jövedelmek ferdék maradnak). <b>Hamis</b>: a 30 csak ökölszabály mérsékelten ferde eloszlásra; óriási kiugrókkal több száz is kevés lehet. <b>Hamis</b>: véges szórás nélkül nincs CHT – a Cauchy-átlag nem „nyugszik meg”.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\mu = 80$, $\sigma = 10$, $n = 25$. Mennyi közelítőleg $P(\bar X \gt 82)$? ($\Phi(0{,}2) \approx 0{,}579$, $\Phi(1) \approx 0{,}841$.)`,
          options: ["0,159", "0,841", "0,421", "0,579"],
          answer: 0,
          hint: R`Számold ki az SE-t, aztán a $z$-értéket. „Nagyobb, mint” → a jobb oldali farok kell.`,
          explain: R`$\mathrm{SE} = 10/5 = 2$; $z = (82 - 80)/2 = 1$; $P = 1 - \Phi(1) \approx 0{,}159$. A 0,841 a rossz oldal ($P(\bar X \lt 82)$). A 0,421 $\sigma$-val standardizál ($z = 0{,}2$) – ez egyetlen adatra lenne igaz. A 0,579 mindkét hibát elköveti.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 10$. Legalább hány elemű minta kell, hogy a mintaátlag 95% eséllyel 2-nél kevesebbel térjen el a $\mu$-től?`,
          options: ["97", "96", "10", "25"],
          answer: 0,
          hint: R`A normális eloszlás 95%-a $\pm 1{,}96$ SE-n belül van. Írd fel: $1{,}96 \cdot \sigma/\sqrt n \le 2$, és oldd meg $n$-re. Hogyan kell kerekíteni?`,
          explain: R`$1{,}96 \cdot 10/\sqrt n \le 2 \iff \sqrt n \ge 9{,}8 \iff n \ge 96{,}04$, tehát legalább <b>97</b> elem. A 96 lefelé kerekít – akkor a feltétel épp nem teljesül; mintanagyságnál mindig felfelé kerekítünk. A 10 a $\sqrt n$, négyzetre emelés nélkül. A 25 $= (10/2)^2$ elhagyja az 1,96-ot: az csak kb. 68%-os biztonságot ad.`
        },
        {
          type: "match",
          q: R`Milyen sokaságnál mekkora $n$ kell, hogy a mintaátlag közel normális legyen? Párosítsd (hüvelykujjszabály)!`,
          pairs: [
            ["normális sokaság", "bármely n (pontos)"],
            ["nagyjából szimmetrikus, kiugró értékek nélkül (pl. kockadobás)", "már n ≈ 10–15 is elég"],
            ["mérsékelten ferde", "n ≥ 30"],
            ["erősen ferde, óriási kiugrókkal (vagyon, biztosítási kár)", "akár több száz is kevés lehet"],
            ["nincs véges szórás (Cauchy)", "semekkora n sem elég"]
          ],
          hint: "Minél ferdébb a sokaság és minél nagyobbak a kiugrók, annál később „harangosodik” az átlag eloszlása.",
          explain: R`Normális sokaságnál az átlag pontosan normális. Szimmetrikus, kiugrók nélküli sokaságnál (kocka) a 3 kocka átlaga már szinte harang alakú, $n \approx 10$–$15$ bőven elég. Mérsékelten ferdénél a közismert 30-as szabály működik (izzók: $n = 30$-nál pontos 0,138, CHT 0,137). Óriási kiugróknál egy-egy extrém érték uralja az átlagot – ilyenkor rajzolj, vagy használj bootstrapet. Véges szórás nélkül a tétel feltétele nem teljesül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Exponenciális élettartamú izzók (átlag 100 óra, $\sigma = 100$ óra), $n = 5$: a pontos $P(\bar X \gt 120) = 0{,}285$, a CHT-közelítés 0,327. Mi az eltérés fő oka?`,
          options: [
            "Öt izzó átlagának eloszlása még maga is ferde.",
            R`A $\sigma$ helyett tévesen az SE-vel standardizáltunk.`,
            "A CHT csak szimmetrikus sokaságra érvényes.",
            "Az exponenciális eloszlásnak nincs véges szórása."
          ],
          answer: 0,
          hint: "A tétel határértéket mond ki. Mitől függ, hogy egy adott n-nél mennyire jó már a közelítés?",
          explain: R`A sokaság erősen ferde, és $n = 5$-nél az átlag eloszlása is ferde marad (ferdesége $2/\sqrt5 \approx 0{,}89$). $n = 30$-nál már jó a közelítés (0,138 / 0,137). Az átlagnál épp az SE-vel <b>kell</b> standardizálni, az nem hiba. A CHT ferde sokaságra is érvényes, csak később „kapcsol be”. Az exponenciálisnak van véges szórása ($\sigma = 100$) – a Cauchy-eloszlásnak nincs.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy sokaság szórása $\sigma = 8$. 64 elemet húzunk. Mennyi az elemek <b>összegének</b> szórása, és mennyi az <b>átlag</b> standard hibája?`,
          options: [
            "összeg: 64, átlag: 1",
            "összeg: 8, átlag: 1",
            "összeg: 512, átlag: 0,125",
            "összeg: 64, átlag: 8"
          ],
          answer: 0,
          hint: R`Független összeg szórásnégyzete $n\sigma^2$. Az átlag az összeg $n$-ed része.`,
          explain: R`Összeg: $D = \sigma\sqrt n = 8 \cdot 8 = 64$ – $\sqrt n$-nel <b>nő</b>. Átlag: $\sigma/\sqrt n = 8/8 = 1$ – $\sqrt n$-nel <b>csökken</b> ($64/64 = 1$). Az „összeg: 8” azt hiszi, hogy összeadáskor a szórás nem változik. Az 512 és 0,125 $n$-nel szoroz/oszt $\sqrt n$ helyett. Az „átlag: 8” az SD-t adja az SE helyett.`
        }
      ]
    },

    /* ------------------------------------------------ 5.4 */
    "ms5-54": {
      title: "Kvíz – 5.4 Az arány mintavételi eloszlása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két embert kérdezünk meg (független, visszatevéses modell); a támogatók aránya a sokaságban $p = 0{,}3$. Mennyi $P(\hat p = 1/2)$?`,
          options: ["0,42", "0,21", "0,09", "0,49"],
          answer: 0,
          hint: R`$\hat p = 1/2$ azt jelenti: pontosan egy támogató a kettőből. Hányféle sorrendben jöhet ki?`,
          explain: R`Pontosan egy támogató: (igen, nem) vagy (nem, igen), $P = 2 \cdot 0{,}3 \cdot 0{,}7 = 0{,}42$ (binomiális). A 0,21 elfelejti a 2-es szorzót (csak az egyik sorrendet nézi). A 0,09 $= 0{,}3^2$ a $P(\hat p = 1)$, a 0,49 $= 0{,}7^2$ a $P(\hat p = 0)$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$p = 0{,}2$, $n = 400$. Mennyi a mintabeli arány standard hibája?`,
          options: ["0,0200", "0,0224", "0,0080", "0,0004"],
          answer: 0,
          hint: R`Egy 0–1 adat szórásnégyzete $p(1-p)$. Utána ugyanaz, mint az átlagnál: $\sqrt{\sigma^2/n}$.`,
          explain: R`$\mathrm{SE}(\hat p) = \sqrt{0{,}2 \cdot 0{,}8/400} = \sqrt{0{,}0004} = 0{,}02$, azaz 2 százalékpont. A 0,0224 $= \sqrt{0{,}2/400}$: $p(1-p)$ helyett $p$-vel számol. A 0,0080 $= 0{,}16/\sqrt{400}$: a szórásnégyzetet osztja $\sqrt n$-nel. A 0,0004 a gyök elhagyása – ez a szórásnégyzet, $D^2(\hat p)$.`
        },
        {
          type: "multi",
          q: R`Melyik esetben használható a $\hat p$ normális közelítése (a feltétel: $np \ge 10$ és $n(1-p) \ge 10$)? (Több jó válasz is lehet.)`,
          options: [
            R`$n = 1000$, $p = 0{,}4$`,
            R`$n = 200$, $p = 0{,}9$`,
            R`$n = 200$, $p = 0{,}03$`,
            R`$n = 1000$, $p = 0{,}001$`,
            R`$n = 50$, $p = 0{,}02$`
          ],
          answer: [0, 1],
          hint: R`Ne csak az $n$-t nézd! Számold ki a várt „igen” ($np$) és a várt „nem” ($n(1-p)$) darabszámot.`,
          explain: R`$1000 \cdot 0{,}4 = 400$, $600$ ✔. $200 \cdot 0{,}9 = 180$, $200 \cdot 0{,}1 = 20$ ✔. $200 \cdot 0{,}03 = 6$ ✘. $1000 \cdot 0{,}001 = 1$ ✘ – az $n = 1000$ sem elég, ha a tulajdonság nagyon ritka. $50 \cdot 0{,}02 = 1$ ✘: itt $P(\hat p = 0) \approx 0{,}36$, az eloszlás egyáltalán nem harang alakú. A tipikus hiba, hogy csak az $n$ nagyságát nézzük.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy párt 40%-ot kapott egy felmérésben, a hibahatár ± 3 százalékpont. Melyik sáv felel meg ennek?`,
          options: ["37%–43%", "38,8%–41,2%", "34%–46%", "38,5%–41,5%"],
          answer: 0,
          hint: "Százalék vagy százalékpont? A ± 3 százalékpontot hozzáadjuk a 40-hez, vagy a 40 valahány százalékát vesszük?",
          explain: R`A hibahatár már tartalmazza az $1{,}96$-os szorzót: $40 \pm 3$ százalékpont → 37%–43%. A 38,8–41,2% a százalék ↔ százalékpont hiba (a 40-nek a 3%-a, 1,2 pont). A 34–46% még egyszer megduplázza a hibahatárt ($2 \cdot 1{,}96\,\mathrm{SE}$). A 38,5–41,5% a hibahatárt az SE-vel keveri (± 1,5 pont).`
        },
        {
          type: "single", shuffle: true,
          q: R`$n = 400$, $\hat p = 0{,}5$. Mennyi a 95%-os hibahatár?`,
          options: ["± 4,9 százalékpont", "± 2,5 százalékpont", "± 9,8 százalékpont", "± 0,1 százalékpont"],
          answer: 0,
          hint: R`Hibahatár $= 1{,}96 \cdot \sqrt{\hat p(1-\hat p)/n}$.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}25/400} = 0{,}025$; hibahatár $= 1{,}96 \cdot 0{,}025 = 0{,}049$, azaz ± 4,9 százalékpont. A ± 2,5 az SE maga (elhagyja az 1,96-ot). A ± 9,8 kétszer szoroz ($2 \cdot 1{,}96$). A ± 0,1 a gyököt felejti el ($1{,}96 \cdot 0{,}25/400 \approx 0{,}0012$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány fős minta kell a ± 2 százalékpontos 95%-os hibahatárhoz, ha $\hat p \approx 0{,}5$?`,
          options: ["2401", "625", "9604", "4802"],
          answer: 0,
          hint: R`Oldd meg $n$-re: $1{,}96\sqrt{0{,}25/n} \le 0{,}02$. Vagy: a ± 1 ponthoz 9604 fő kell – a $\sqrt n$-törvény szerint mennyi kell a dupla hibához?`,
          explain: R`$n = (1{,}96/0{,}02)^2 \cdot 0{,}25 = 98^2 \cdot 0{,}25 = 2401$. A 625 $= 0{,}25/0{,}02^2$ elhagyja az 1,96-ot – az az $\mathrm{SE} = 2$ pont mintanagysága, nem a hibahatáré. A 9604 a ± 1 pontos hibahatárhoz kell. A 4802 $= 9604/2$ a „dupla hibához fele minta” tévedés: kétszeres hibához negyedakkora minta elég.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 1000 fős mintában 250 fiatal van; közülük 50% támogatja a javaslatot. Mennyi a hibahatár a fiatalokra?`,
          options: ["± 6,2 százalékpont", "± 3,1 százalékpont", "± 12,4 százalékpont", "± 3,2 százalékpont"],
          answer: 0,
          hint: R`Az alcsoportra a saját $n$-jével számolj, ne a teljes minta 1000 főjével!`,
          explain: R`$1{,}96\sqrt{0{,}25/250} \approx 0{,}062$: ± 6,2 százalékpont. A negyedakkora alcsoportban a hiba $\sqrt4 = 2$-szeres, nem négyszeres. A ± 3,1 a teljes 1000 fős minta hibahatára – az alcsoportra nem érvényes. A ± 12,4 a négyszeres hiba („negyed minta → négyszeres hiba”). A ± 3,2 az alcsoport SE-je, 1,96 nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legalább hány fős minta kell ahhoz, hogy $\mathrm{SE}(\hat p) \le 2$ százalékpont legyen, <b>bármekkora</b> is a $p$?`,
          options: ["625", "25", "2401", "1250"],
          answer: 0,
          hint: R`Melyik $p$-nél a legnagyobb $p(1-p)$? Ezzel a legrosszabb esettel számolj.`,
          explain: R`A legrosszabb eset $p = 0{,}5$, ekkor $\mathrm{SE} = 0{,}5/\sqrt n \le 0{,}02 \iff \sqrt n \ge 25 \iff n \ge 625$. A 25 a $\sqrt n$, négyzetre emelés nélkül. A 2401 a ± 2 pontos <b>hibahatárhoz</b> kell (az 1,96-szoros SE-hez) – itt csak az SE-t kérdeztük. Az 1250 $= 0{,}5/0{,}02^2$: $p(1-p) = 0{,}25$ helyett $p = 0{,}5$-tel számol.`
        }
      ]
    },

};})();
