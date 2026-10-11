    /* ------------------------------------------------ 13.1 */
    "ai13-131": {
      title: "Kvíz – 13.1 Gráfok mint adat",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy gráfban a csúcsok fokszámai: 4, 3, 3, 2, 2. Hány éle van?",
          options: ["7", "14", "5", "28"],
          answer: 0,
          hint: "Hány csúcs fokszámába számít bele egy él?",
          explain: R`Kézfogás-tétel: $\sum_v \deg(v) = 2|E|$, itt $14 = 2|E|$, tehát $|E| = 7$. A 14 a felezést felejti el (minden élt kétszer számol), az 5 a csúcsok száma, a 28 felezés helyett dupláz.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik fokszámlista NEM lehet egy (egyszerű, irányítatlan) gráfé?",
          options: ["3, 2, 2, 2", "3, 3, 2, 2", "2, 2, 2, 2", "1, 1, 1, 1"],
          answer: 0,
          hint: "Add össze a fokszámokat. Milyen szám lehet csak $2|E|$?",
          explain: R`A $3 + 2 + 2 + 2 = 9$ páratlan, de a fokszámok összege mindig $2|E|$, tehát páros. A többi megvalósítható: 3, 3, 2, 2 – négy csúcs, egy él híján mindenki mindenkivel; 2, 2, 2, 2 – négyszög; 1, 1, 1, 1 – két különálló él.`
        },
        {
          type: "single", shuffle: true,
          q: R`A futó példában (A–B, A–C, B–C, B–D, D–E) mennyi $(A^2)_{\text{B,B}}$?`,
          options: ["3", "0", "9", "6"],
          answer: 0,
          hint: R`$(A^2)_{uv}$ a kétlépéses <b>séták</b> száma. Visszaléphetsz-e oda, ahonnan jöttél?`,
          explain: R`Bence kétlépéses sétái önmagába: B→A→B, B→C→B, B→D→B – annyi, ahány szomszédja van, tehát 3 (a főátlóban a fokszám áll). A 0 a séta helyett utat számol (út nem érhet vissza a kiindulópontba), a 9 a fokszám négyzete, a 6 minden sétát kétszer számol („oda” és „vissza”) – pedig a B→A→B visszafelé olvasva is ugyanaz a séta.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban $A^3$ főátlójának összege 18. Hány háromszög van benne?`,
          options: ["3", "6", "9", "18"],
          answer: 0,
          hint: "Egy háromszöget hány kezdőcsúcsból és hány irányban lehet háromlépéses sétával bejárni?",
          explain: R`Minden háromszöget 3 kezdőcsúcsból × 2 irányban = 6-szor számolunk, így $18/6 = 3$. A 6 csak a kezdőcsúccsal oszt (az irányt felejti el), a 9 csak az iránnyal, a 18 egyáltalán nem oszt. (A futó példában a főátló $(2;\ 2;\ 2;\ 0;\ 0)$, összege 6, vagyis 1 háromszög.)`
        },
        {
          type: "single", shuffle: true,
          q: "A Cora hivatkozási hálón 2708 cikk és 5278 (irányítatlan) hivatkozás van. Hány 1-es áll a szomszédsági mátrixban?",
          options: ["10 556", "5278", "7 333 264", "2708"],
          answer: 0,
          hint: "Egy irányítatlan él a mátrix hány elemét teszi 1-essé?",
          explain: R`A mátrix szimmetrikus: az $u$–$v$ él $A_{uv}$-t és $A_{vu}$-t is 1-re állítja, így $2 \cdot 5278 = 10\,556$ egyes van. Az 5278 a szimmetriát felejti el, a 7 333 264 a mátrix összes eleme ($2708^2$), a 2708 a csúcsok száma. Az egyesek aránya mindössze 0,14% – ezért tárol a program listát, nem mátrixot.`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a szintjével!",
          pairs: [
            ["Egy bankszámla csaló-e a tranzakciós hálóban?", "csúcsszintű"],
            ["Egy molekula mutagén-e?", "gráfszintű"],
            ["Melyik terméket ajánljuk egy vásárlónak?", "élszintű"],
            ["Milyen témájú egy cikk a hivatkozási hálóban?", "csúcsszintű"],
            ["Összebarátkozik-e Anna és Dávid?", "élszintű"]
          ],
          hint: "Minek a tulajdonságát keressük: egy csúcsét, egy (esetleg még hiányzó) élét, vagy az egész gráfét?",
          explain: "A számla és a cikk egy-egy csúcs a nagy gráfban – csúcsszint. A molekula egésze kap egyetlen címkét – gráfszint. A termékajánlás és a barátság egy felhasználó–termék, illetve ember–ember él jóslása (kapcsolat-előrejelzés) – élszint. A gyakori hiba a termékajánlást csúcsszintűnek gondolni: nem a vásárlóról, hanem a vásárló és a termék <em>kapcsolatáról</em> kérdezünk."
        },
        {
          type: "single", shuffle: true,
          q: "Egy közösségi oldalon a ma regisztrált felhasználóknak is ismerősöket kell ajánlani. Milyen feladat ez?",
          options: [
            "Élszintű és induktív",
            "Élszintű és transzduktív",
            "Csúcsszintű és induktív",
            "Gráfszintű és transzduktív"
          ],
          answer: 0,
          hint: "Ott voltak-e az új felhasználók a gráfban tanításkor? És minek a tulajdonságát jósoljuk?",
          explain: "Az ismerősajánlás egy (még hiányzó) él jóslása – élszintű. Az új felhasználók tanításkor nem voltak a gráfban, ezért a modellnek sosem látott csúcsokra kell működnie – induktív. Transzduktív az lenne, ha a tesztcsúcsok tanításkor is a gráfban lennének (mint a karateklubban), csak a címkéjük hiányozna."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "Irányítatlan gráf szomszédsági mátrixa szimmetrikus, sorösszegei a fokszámok.",
            "Ha a csúcsokat másképp számozzuk, ugyanarra a gráfra más szomszédsági mátrixot kaphatunk.",
            R`$(A^2)_{uv}$ a visszalépő sétákat (pl. A→B→A) is beleszámolja.`,
            "A csúcsok rajzon elfoglalt helye is az adat része.",
            "A GNN gráfja ugyanaz, mint a 10. fejezet számítási gráfja, amelyen a visszaterjesztés fut."
          ],
          answer: [0, 1, 2],
          hint: "Mi az adat egy gráfban: a rajz, vagy hogy mi mivel van összekötve? És mit ír le a számítási gráf?",
          explain: R`Az első három igaz: a barátság kölcsönös, ezért $A_{uv} = A_{vu}$; a mátrix a számozástól függ (ez a 13.2 fő problémája); az $A^2$ sétákat számol, ezért a főátlóban a fokszám áll. A rajz csak szemléltetés – ugyanaz a gráf ezerféleképpen lerajzolható. A számítási gráf a műveletek sorrendjét írja le, a GNN gráfja az adat; egy GNN-nek mindkettő van.`
        }
      ]
    },

    /* ------------------------------------------------ 13.2 */
    "ai13-132": {
      title: "Kvíz – 13.2 Miért nem elég az MLP, a CNN vagy az RNN?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A futó példa (A–B, A–C, B–C, B–D, D–E) csúcsait 5! = 120-féleképpen számozhatjuk meg. Hány különböző szomszédsági mátrix jön ki?",
          options: ["60", "120", "30", "1"],
          answer: 0,
          hint: "Van-e két csúcs, amelyet felcserélve ugyanazt a mátrixot kapod? Ehhez a két csúcsnak pontosan ugyanazokat kell ismernie.",
          explain: "Anna és Csilla felcserélhető (mindketten egymást és Bencét ismerik), így minden mátrix kétszer jön ki: 120 / 2 = 60. A 120 ezt a szimmetriát felejti el. A 30 azt hiszi, hogy Dávid és Emese is felcserélhető – de Dávid Bencét ismeri, Emese nem. Az 1 a gráfot és a mátrixot keveri össze: a gráf ugyanaz, a mátrix nem."
        },
        {
          type: "single", shuffle: true,
          q: "Miért ért el az MLP a MUTAG molekuláin (eredeti számozással) 83,7%-ot, ha átszámozott tesztmolekulákon csak 69,5%-ot?",
          options: [
            "Mert az atomok rögzített konvenció szerint vannak számozva, és az MLP ezt a konvenciót tanulta meg, nem a kémiát.",
            "Mert az MLP megtanulta a kémiát, csak az átszámozás elrontja a molekulák szerkezetét.",
            "Mert a 28-ig nullákkal kitöltés sorrendfüggetlenné teszi a bemenetet.",
            "Mert elég sok rejtett neuronnal az MLP is permutációinvariáns lesz."
          ],
          answer: 0,
          hint: "Az átszámozás megváltoztatja-e a molekulát? És akkor mit tanulhatott meg a modell, ami az átszámozással elveszett?",
          explain: "Az átszámozás a molekulát nem változtatja meg, csak a felírását. Ha a pontosság mégis leesik, a modell a felírás egy véletlen tulajdonságára – az adatkészlet számozási konvenciójára – épített. Ugyanez a hiba, mint a 11.1 középre igazított számjegyekre tanult MLP-jénél. A kitöltés a változó méreten segít, a sorrenden nem; és az MLP semmilyen méretben nem lesz magától invariáns."
        },
        {
          type: "single", shuffle: true,
          q: "Egy MLP bemenete a 28 × 28-as (kitöltött) szomszédsági mátrix és atomonként egy 7 hosszú atomtípus-jelző (28 × 7). Hány bemeneti neuronja van?",
          options: ["980", "784", "812", "5488"],
          answer: 0,
          hint: "A két részt egymás után írjuk: add össze a két tábla elemszámát.",
          explain: R`$28 \cdot 28 + 28 \cdot 7 = 784 + 196 = 980$. A 784 az atomtípusokat hagyja ki, a 812 atomonként csak egy számot számol a 7 hosszú jelző helyett, az 5488 ($28 \cdot 28 \cdot 7$) összeadás helyett szoroz.`
        },
        {
          type: "match",
          q: "A futó példán eredeti és fordított számozással számolunk. Párosítsd a függvényt a viselkedésével!",
          pairs: [
            ["az élek száma", "invariáns"],
            ["a háromszögek száma", "invariáns"],
            ["a fokszámok vektora", "ekvivariáns"],
            [R`a szomszédösszegek vektora, $A\mathbf x$`, "ekvivariáns"],
            ["az 1. sorszámú csúcs fokszáma", "egyik sem"],
            [R`$\mathbf x$ első eleme mínusz az utolsó`, "egyik sem"]
          ],
          hint: "Egyetlen szám, amely nem függ a számozástól? Csúcsonkénti lista, amely a csúcsokkal együtt költözik? Vagy olyan érték, amely azon múlik, ki kapta az 1. sorszámot?",
          explain: R`Az élek és a háromszögek száma a gráf tulajdonsága – invariáns. A fokszámvektor és $A\mathbf x$ csúcsonkénti eredmény, amely átszámozáskor ugyanúgy átrendeződik, mint a csúcsok – ekvivariáns ($PAP^\top P\mathbf x = PA\mathbf x$). Az „1. csúcs fokszáma” (eredetileg 2, fordítva 1) és az „első mínusz utolsó” ($-4$, illetve $5$) a számozó önkényén múlik – egyik sem.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$ az A, B, C, D, E sorrendben. Számozzuk át a csúcsokat: E = 1, D = 2, B = 3, A = 4, C = 5. Mi lesz $A'\mathbf x'$ (a szomszédösszegek) az új sorrendben?`,
          options: [R`$(0;\ 5;\ 1;\ 0;\ 1)$`, R`$(0;\ 1;\ 1;\ 5;\ 0)$`, R`$(0;\ 5;\ 1;\ 1;\ 0)$`, R`$(5;\ 0;\ 0;\ 1;\ 0)$`],
          answer: 0,
          hint: R`Az eredeti $A\mathbf x = (0;\ 1;\ 1;\ 5;\ 0)$. Ekvivariáns a művelet: az eredmény a csúcsokkal együtt költözik. Írd ki csúcsonként!`,
          explain: R`Csúcsonként: E 0, D 5, B 1, A 0, C 1 – vagyis $(0;\ 5;\ 1;\ 0;\ 1) = P(A\mathbf x)$. A $(0;\ 1;\ 1;\ 5;\ 0)$ a régi sorrend (az átrendezés elmaradt), a $(0;\ 5;\ 1;\ 1;\ 0)$ egyszerűen megfordítja a vektort – de az új sorrend nem az E, D, C, B, A, hanem E, D, B, A, C. A $(5;\ 0;\ 0;\ 1;\ 0)$ az átszámozott $\mathbf x'$ maga, gyűjtés nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi Bence klaszterezettsége a futó példában (szomszédai: Anna, Csilla, Dávid)?",
          options: ["1/3", "1/2", "1", "1/6"],
          answer: 0,
          hint: R`$C(v) = \dfrac{\text{élek } v \text{ szomszédai között}}{\binom{\deg v}{2}}$. Számold meg a lehetséges párokat és a tényleges éleket.`,
          explain: R`Három szomszéd, $\binom{3}{2} = 3$ pár (A–C, A–D, C–D), ebből csak az Anna–Csilla él létezik: $C = 1/3$. Az 1/2 a nevezőben $\deg - 1 = 2$-vel oszt, az 1 Annáé (az ő két barátja ismeri egymást), az 1/6 a nevezőbe Bencét is beveszi ($\binom{4}{2} = 6$).`
        },
        {
          type: "single", shuffle: true,
          q: "Annából indulunk véletlen sétára; minden lépésben egyenletesen választunk az aktuális csúcs szomszédai közül. Mekkora valószínűséggel vagyunk két lépés után újra Annánál?",
          options: ["5/12", "1/2", "1/6", "1/4"],
          answer: 0,
          hint: "Az első lépés B-be vagy C-be visz (fele-fele). Onnan mekkora eséllyel lépünk vissza? Ügyelj a fokszámokra!",
          explain: R`$\tfrac12 \cdot \tfrac13 + \tfrac12 \cdot \tfrac12 = \tfrac16 + \tfrac14 = \tfrac{5}{12} \approx 0{,}417$ (Bencének 3, Csillának 2 szomszédja van). Az 1/6 csak a Bencén át vezető utat, az 1/4 csak a Csillán átit számolja; az 1/2 azt hiszi, hogy Bencétől is 1/2 eséllyel lépünk vissza.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a GNN előtti módszerekre?",
          options: [
            "A DeepWalk csúcsonként egy szabad vektort tanul, ezért egy új csúcshoz újra kell tanítani.",
            "A DeepWalk a csúcsok saját jellemzőit (pl. egy cikk szövegét) nem használja.",
            "A karateklubon a címketerjesztés a 32 ismeretlen tagból 31-et helyesen sorol be.",
            "A karateklubon a legrövidebb út módszere mind a 32 tagot helyesen sorolja be.",
            "A kézi jellemzők (fokszám, klaszterezettség) minden fontos mintázatot észrevesznek, pl. egy gyűrű melletti nitrocsoportot is."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a word2vec szótárára: mi történik egy új szóval? És mit ad a legrövidebb út, ha valaki egyforma messze van mindkét vezetőtől?",
          explain: "A DeepWalk a word2vec-hez hasonlóan táblázatot tanul (csúcsonként egy sort), ezért transzduktív, és csak a gráfszerkezetet használja. A címketerjesztés 31/32-t talál el. A legrövidebb út csak 26-ot: 6 tag döntetlen, mert egyforma messze van az edzőtől és az elnöktől. A kézi jellemzők csak azt látják, amit kitaláltál – egy nitrocsoportot a fokszám-hisztogram nem vesz észre."
        }
      ]
    },

    /* ------------------------------------------------ 13.3 */
    "ai13-133": {
      title: "Kvíz – 13.3 Üzenetküldés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A futó példán $\mathbf x = (2;\ 4;\ 0;\ 6;\ 0)$. Átlag-gyűjtéssel és $h' = \operatorname{ReLU}(0{,}5\,h + m - 2)$ frissítéssel mennyi Bence új értéke?`,
          options: ["2,667", "8", "4,667", "0,667"],
          answer: 0,
          hint: "Bence szomszédai Anna, Csilla és Dávid. Előbb az átlag, aztán a saját érték fele, végül a −2.",
          explain: R`$m_B = (2 + 0 + 6)/3 \approx 2{,}667$, $h' = 0{,}5 \cdot 4 + 2{,}667 - 2 = 2{,}667$. A 8 összeggel gyűjt ($2 + 8 - 2$), a 4,667 a $-2$-t felejti el, a 0,667 a saját értéket ($0{,}5 \cdot 4$) hagyja ki – pedig a frissítésben a csúcs a saját régi értékét is felhasználja.`
        },
        {
          type: "multi",
          q: R`A futó példán $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$. Melyik gyűjtés adja a $(0;\ 1;\ 1;\ 5;\ 0)$ gyűjtött vektort?`,
          options: ["összeg", "maximum", "átlag", "minimum", "összeg önhurokkal"],
          answer: [0, 1],
          hint: "Csúcsonként írd fel a szomszédok értékeit. Hol van legalább két nem nulla szomszéd?",
          explain: R`Minden csúcsnak legfeljebb egy nem nulla szomszédja van, ezért az összeg és a maximum itt egybeesik: $(0;\ 1;\ 1;\ 5;\ 0)$. Az átlag osztja a szomszédok számával: $(0;\ 0{,}333;\ 0{,}5;\ 2{,}5;\ 0)$. A minimum mindenhol 0 (mindenkinek van 0 értékű szomszédja). Önhurokkal a saját érték is bekerül: $(1;\ 1;\ 1;\ 5;\ 5)$.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány üzenetküldő réteg kell ahhoz, hogy Emese értéke Anna vektorába eljusson?",
          options: ["3", "2", "4", "5"],
          answer: 0,
          hint: "Rétegenként egy ugrás. Milyen messze van Emese Annától (A–B–D–E)?",
          explain: "Emese 3 ugrásra van Annától, és egy réteg csak szomszédtól szomszédig visz információt: 1 réteg után Dávid, 2 után Bence, 3 után Anna tudja. A 2 a köztes csúcsokat (B, D) számolja ugrás helyett, a 4 az úton lévő csúcsokat (A, B, D, E), az 5 a gráf csúcsszámát."
        },
        {
          type: "single", shuffle: true,
          q: "Hány csomópontja van Anna számítási fájának két rétegnél?",
          options: ["8", "4", "7", "10"],
          answer: 0,
          hint: "Gyökér A; alatta A szomszédai; mindegyik alatt az ő szomszédaik – a visszalépéssel együtt.",
          explain: R`Gyökér A; alatta B, C; B alatt A, C, D; C alatt A, B: $1 + 2 + 5 = 8$. A 4 a recepciós mező ({A, B, C, D}) – a fában ugyanaz a csúcs többször is szerepel (A háromszor). A 7 a gyökeret felejti el, a 10 Bence kétrétegű fája ($1 + 3 + 6$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy $H' = \operatorname{ReLU}(HW_1 + AHW_2 + \mathbf b)$ rétegnek, ha $d = 64$ és $d' = 32$?`,
          options: ["4128", "4096", "2080", "4160"],
          answer: 0,
          hint: R`Két $d \times d'$-s súlymátrix és egy $d'$ hosszú torzítás. Számít-e $n$?`,
          explain: R`$2 \cdot 64 \cdot 32 + 32 = 4128$, a csúcsok számától függetlenül. A 4096 a torzítást hagyja ki, a 2080 csak egy súlymátrixot számol ($64 \cdot 32 + 32$), a 4160 a torzítást a bemenet méretével (64) veszi, pedig a kimenethez tartozik.`
        },
        {
          type: "single", shuffle: true,
          q: R`A sportos példában Anna és Emese sportol $(1;\ 0)$, a többiek nem $(0;\ 1)$. Mi $D^{-1}AH$ Bence sora?`,
          options: [R`$(0{,}333;\ 0{,}667)$`, R`$(1;\ 2)$`, R`$(0{,}25;\ 0{,}5)$`, R`$(0{,}667;\ 0{,}333)$`],
          answer: 0,
          hint: "Bence barátai: Anna, Csilla, Dávid. Hány sportos és hány nem sportos – és mivel kell osztani?",
          explain: R`$AH$ Bence sora $(1;\ 2)$: egy sportos (Anna) és két nem sportos barát. $D^{-1}$ a fokszámmal (3) oszt: $(0{,}333;\ 0{,}667)$ – Bence barátainak harmada sportol. Az $(1;\ 2)$ az osztást felejti el, a $(0{,}25;\ 0{,}5)$ Bencét is beszámolja (4-gyel oszt, önhurok nincs), a $(0{,}667;\ 0{,}333)$ a két oszlop szerepét cseréli fel.`
        },
        {
          type: "single", shuffle: true,
          q: "A Cora 1433 hosszú jellemzővektorait egy réteg 16 dimenzióra vetíti és a szomszédokon gyűjti. Melyik számolási sorrend az olcsóbb (ritka A mellett)?",
          options: [
            R`$A(HW)$: előbb vetíts 16 dimenzióra, aztán gyűjts.`,
            R`$(AH)W$: előbb gyűjts 1433 dimenzióban, aztán vetíts.`,
            "Mindegy: a mátrixszorzás asszociatív, ezért a költség is ugyanannyi.",
            R`$A(HW)$ csak sűrű $A$ esetén olcsóbb, ritkánál fordítva.`
          ],
          answer: 0,
          hint: "A ritka gyűjtés költsége az élek száma szorozva a vektorok hosszával. Milyen hosszú vektorokat érdemes gyűjteni?",
          explain: R`A két sorrend eredménye ugyanaz (asszociativitás), de a költség nem: a gyűjtés élenként egy vektornyi munka, ezért olcsóbb a rövid (16 hosszú) vektorokat gyűjteni. A szakasz példájában ($1000 \times 64$ → 16, 5000 él) $A(HW)$ kb. 1,18 millió, $(AH)W$ kb. 1,66 millió szorzás. Az asszociativitás az eredményről szól, nem a költségről.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az üzenetküldő rétegre?",
          options: [
            "A súlyok minden csúcsnál ugyanazok, ezért a paraméterek száma nem függ a gráf méretétől.",
            R`$k$ réteg után egy csúcs vektora csak a legfeljebb $k$ ugrásra lévő csúcsoktól függhet.`,
            "Mindenki egyszerre frissít, a régi értékekből; ha sorban felülírnánk őket, a sorrend számítana.",
            "Több réteg mindig jobb: a tipikus GNN egy ResNethez hasonlóan mély.",
            R`Az átlag-gyűjtés megkülönbözteti az $\{1\}$ és az $\{1, 1\}$ szomszédságot.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a súlymegosztásra, a recepciós mezőre és a túlsimításra. Mennyi az $\{1\}$ és az $\{1, 1\}$ átlaga?`,
          explain: R`Az első három igaz: súlymegosztás (mint a konvolúciós szűrőnél), recepciós mező, egyidejű frissítés. Sok réteg után a vektorok egymáshoz hasonulnak (túlsimítás), ezért a tipikus GNN 2–4 rétegű. Az $\{1\}$ és az $\{1, 1\}$ átlaga is 1 – az átlag nem látja, hány szomszéd van; az összeg (1 vs. 2) igen.`
        }
      ]
    },

    /* ------------------------------------------------ 13.4 */
    "ai13-134": {
      title: "Kvíz – 13.4 Gráfkonvolúciós háló (GCN)",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A futó példán $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$. Mennyi $(A + I)\,\mathbf x$?`,
          options: [R`$(1;\ 1;\ 1;\ 5;\ 5)$`, R`$(0;\ 1;\ 1;\ 5;\ 0)$`, R`$(0{,}333;\ 0{,}25;\ 0{,}333;\ 1{,}667;\ 2{,}5)$`, R`$(2;\ 1;\ 1;\ 5;\ 10)$`],
          answer: 0,
          hint: "Az önhurok miatt minden csúcs a szomszédai értékét ÉS a sajátját adja össze – a sajátját egyszer.",
          explain: R`$(A + I)\mathbf x = A\mathbf x + \mathbf x = (0;\ 1;\ 1;\ 5;\ 0) + (1;\ 0;\ 0;\ 0;\ 5)$. A $(0;\ 1;\ 1;\ 5;\ 0)$ az önhurok nélküli $A\mathbf x$ (Emese elfelejti az 5-ösét), a tizedes törtes az önhurkos átlag ($\hat D^{-1}\hat A\mathbf x$), a $(2;\ 1;\ 1;\ 5;\ 10)$ a saját értéket kétszer adja hozzá.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy él két végpontjának fokszáma (önhurok nélkül) 3 és 8. Mekkora a GCN-súlya?",
          options: ["0,167", "0,204", "0,028", "0,25"],
          answer: 0,
          hint: R`A GCN az önhurkos fokszámokkal számol: $\hat d = \deg + 1$, és a súly $1/\sqrt{\hat d_u \hat d_v}$.`,
          explain: R`$\hat d = 4$ és $9$: $\tfrac{1}{\sqrt{36}} = \tfrac16 \approx 0{,}167$. A 0,204 ($1/\sqrt{24}$) az önhurkot felejti el a fokszámban, a 0,028 ($1/36$) a gyököt, a 0,25 ($1/4$) csak a fogadó fokszámával oszt, mint az önhurkos átlag.`
        },
        {
          type: "single", shuffle: true,
          q: R`A futó példán $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$. Mennyi Dávid értéke a GCN-normalizálás után, $P\mathbf x$-ben ($P = \hat D^{-1/2}\hat A\hat D^{-1/2}$)?`,
          options: ["2,041", "1,667", "2,5", "3,536"],
          answer: 0,
          hint: R`Dávid önhurkos fokszáma 3, Bencéé 4, Emeséé 2. Csak Emese értéke nem nulla.`,
          explain: R`$P\mathbf x$ Dávid sora: $\tfrac{1}{\sqrt{3 \cdot 4}} \cdot 0 + \tfrac13 \cdot 0 + \tfrac{1}{\sqrt{3 \cdot 2}} \cdot 5 \approx 2{,}041$. Az 1,667 a sima önhurkos átlag ($5/3$), a 2,5 az önhurok nélküli átlag ($5/2$), a 3,536 ($5/\sqrt{2 \cdot 1}$) a fokszámokat önhurok nélkül veszi. A GCN-ben Emese – kevés kapcsolattal – többet ér, mint az átlagban.`
        },
        {
          type: "single", shuffle: true,
          q: "Csillaggráf: egy középpont 100 levéllel, minden érték 1. Mekkora a középpont értéke egy GCN-normalizált gyűjtés után (önhurokkal)?",
          options: ["≈ 7,05", "101", "1", "≈ 0,57"],
          answer: 0,
          hint: R`Egy középpont–levél él súlya $1/\sqrt{101 \cdot 2}$; a középpont önhurkának súlya $1/101$.`,
          explain: R`$100 \cdot \tfrac{1}{\sqrt{202}} + \tfrac{1}{101} \approx 7{,}04 + 0{,}01 \approx 7{,}05$. A 101 az összeg (önhurokkal), az 1 az átlag, a 0,57 egy levél értéke a GCN-ben. A GCN középutat jár: a középpont nagyobb, de csak kb. $\sqrt{\deg}$ arányban.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány paramétere van a karateklub kétrétegű GCN-jének (34 → 16 → 2, torzítással)?",
          options: ["594", "576", "560", "612"],
          answer: 0,
          hint: "Rétegenként: bemenet × kimenet súly + kimenetnyi torzítás. A szomszédsági mátrixnak nincs tanulható paramétere.",
          explain: R`$34 \cdot 16 + 16 + 16 \cdot 2 + 2 = 544 + 16 + 32 + 2 = 594$. Az 576 a torzításokat hagyja ki, az 560 csak az első réteget számolja, a 612 az első réteg torzítását a bemenet méretével (34) veszi a kimenet (16) helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "A karateklubon (csak „kicsoda” one-hot jellemzővel, két címkével) a GCN 31/32-t ér el, egy MLP gráf nélkül pontosan 50%-ot. Miért?",
          options: [
            "A címkézetlen tagok saját bemeneti súlyai sosem kapnak gradienst, így az MLP kimenete róluk nem hordoz információt.",
            "Mert az MLP túl kevés lépést tanult; 2000 lépéssel elérné a GCN szintjét.",
            "Mert 34 bemenet és 16 rejtett neuron túl kicsi háló; nagyobb MLP-vel javulna.",
            "Mert a one-hot jellemzők ekvivariánsak, ezért az MLP-nek nincs mit tanulnia."
          ],
          answer: 0,
          hint: "A veszteség csak az 1. és a 34. tagon van. A one-hot bemenet melyik súlyokat aktiválja náluk?",
          explain: "Az 1. és a 34. tag bemenete csak a saját oszlopát aktiválja, így a többi 32 tag súlyai nem kapnak gradienst. Kimenetük a torzításokon és a véletlen kezdősúlyokon múlik – nincs benne információ. Több lépés vagy nagyobb háló ezen nem segít – információ nélkül nincs mit megtanulni. A GCN-nél a gráf viszi át a címkét a szomszédokra."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a GCN-re?",
          options: [
            R`A $P = \hat D^{-1/2}\hat A\hat D^{-1/2}$ sorai nem 1-re összegződnek (Bencénél 1,116).`,
            R`Önhurok után a normalizálásban $\deg(v) + 1$ szerepel, nem $\deg(v)$.`,
            "A GCN a homofíliára épít: akkor jó, ha a szomszédok hasonlók.",
            "A karateklubon a GCN felülmúlja a címketerjesztést.",
            R`$P$ pontosan átlagol, ugyanúgy, mint $\hat D^{-1}\hat A$.`
          ],
          answer: [0, 1, 2],
          hint: "Számold ki Bence sorának összegét: 3 szomszéd és önmaga. És mennyit ért el a címketerjesztés a 13.2-ben?",
          explain: R`Bence sora: $3 \cdot \tfrac{1}{\sqrt{12}} + \tfrac14 \approx 1{,}116$ – a GCN „majdnem átlag”, nem átlag; a $\hat D^{-1}\hat A$ sorai pontosan 1-re összegződnek. A $+1$ az önhurokból jön. A GCN a szomszédokat összemossa a sajáttal, ez homofil gráfon jó. A karateklubon a címketerjesztés is 31/32-t ér el ugyanazzal az egy hibával (a 9-es tag) – a GCN itt nem okosabb az alapvonalnál.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Laplace-mátrix $L = D - A$. Mennyi $\mathbf x^\top L\,\mathbf x$ a futó példán, ha $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$?`,
          options: ["27", "54", "25", "26"],
          answer: 0,
          hint: R`$\mathbf x^\top L\mathbf x = \sum_{(u,v) \in E} (x_u - x_v)^2$ – élenként egyszer.`,
          explain: R`Élenként: A–B $1$, A–C $1$, B–C $0$, B–D $0$, D–E $25$, összesen 27. Az 54 minden élt kétszer számol (mindkét irányban), a 25 csak a D–E élt veszi, a 26 az $\mathbf x^\top\mathbf x = 1 + 25$ (mintha $L$ helyett az egységmátrix állna). Egy önhurkos átlagolás után a „rücskösség” 2,715-re esik: az átlagolás simít.`
        }
      ]
    },

    /* ------------------------------------------------ 13.5 */
    "ai13-135": {
      title: "Kvíz – 13.5 GraphSAGE, GAT, GIN",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`GraphSAGE a futó példán: $\mathbf x = (1;\ 0;\ 0;\ 0;\ 5)$, átlag-gyűjtés, $h' = x_v + 0{,}5\, m_v$ (saját súly 1, a szomszédoké 0,5). Mennyi Dávid új értéke?`,
          options: ["1,25", "2,5", "1,667", "5"],
          answer: 0,
          hint: "Dávid szomszédai Bence (0) és Emese (5); a saját értéke 0. Átlag, aztán szorzás 0,5-del.",
          explain: R`$m_D = (0 + 5)/2 = 2{,}5$, $h' = 0 + 0{,}5 \cdot 2{,}5 = 1{,}25$. A 2,5 a 0,5-ös szorzót hagyja ki (vagy összeggel gyűjt), az 1,667 az önhurkos átlag (GCN-szerű, a saját értéket a szomszédokkal együtt átlagolja), az 5 összeggel gyűjt és nem szoroz.`
        },
        {
          type: "single", shuffle: true,
          q: "GraphSAGE két réteggel, az 1. szinten 25, a 2. szinten 10 mintavételezett szomszéddal. Legfeljebb hány csúcs kell egy célcsúcs kiszámításához?",
          options: ["276", "275", "36", "250"],
          answer: 0,
          hint: "Rajzold fel a számítási fát: gyökér, alatta a minta, mindegyik alatt a saját mintája.",
          explain: R`$1 + 25 + 25 \cdot 10 = 276$ – akármekkora a gráf. A 275 a célcsúcsot felejti el, a 36 összeadja a mintaméreteket szorzás helyett, a 250 csak a második szintet számolja.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy GraphSAGE-réteg 64 dimenziós bemenetből 32 dimenziósat csinál, a saját és a gyűjtött vektor összefűzésével. Hány paramétere van (torzítással)?",
          options: ["4128", "2080", "4096", "4160"],
          answer: 0,
          hint: "Milyen hosszú az összefűzött vektor? Ebből lesz a súlymátrix sorainak száma.",
          explain: R`Az összefűzött vektor $64 + 64 = 128$ hosszú, $W$ $128 \times 32$-es: $4096 + 32 = 4128$ – ugyanannyi, mint a 13.3 $W_1$, $W_2$-es rétegénél. A 2080 az összefűzést felejti el ($64 \cdot 32 + 32$), a 4096 a torzítást, a 4160 a torzítást 64 hosszúnak veszi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy csúcs négy szomszédjának GAT-pontszámai $(2;\ 0;\ 0;\ 0)$. Mekkora figyelmi súlyt kap az első szomszéd?`,
          options: ["0,711", "1", "0,881", "0,25"],
          answer: 0,
          hint: R`Softmax: $\alpha_i = e^{s_i} / \sum_j e^{s_j}$. Mennyi $e^0$?`,
          explain: R`$\dfrac{e^2}{e^2 + 3e^0} = \dfrac{7{,}389}{10{,}389} \approx 0{,}711$; a többiek $0{,}096$-ot kapnak. Az 1 azt hiszi, hogy $e^0 = 0$ (a softmax a többit sem nullázza), a 0,881 ($e^2/(e^2 + 1)$) csak egy másik szomszédot számol, a 0,25 egyenletes súly, mintha a pontszám nem számítana.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy GAT-rétegnek, ha $d = 16$, $d' = 8$, 8 figyelemfej, torzítás nélkül?`,
          options: ["1152", "1024", "144", "1040"],
          answer: 0,
          hint: R`Fejenként egy $d \times d'$-s $W$ és egy $2d'$ hosszú $\mathbf a$ vektor.`,
          explain: R`Fejenként $16 \cdot 8 + 2 \cdot 8 = 144$, nyolc fejjel $8 \cdot 144 = 1152$. Az 1024 az $\mathbf a$ figyelmi vektorokat hagyja ki, a 144 egyetlen fej, az 1040 egyetlen közös $\mathbf a$-t számol – pedig minden fejnek saját van.`
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a modellel (a szakasz döntési táblázata szerint)!",
          pairs: [
            ["Csúcsosztályozás homofil gráfon, első próbálkozás", "GCN"],
            ["Nagy gráf, folyamatosan jönnek új csúcsok, mini-köteg kell", "GraphSAGE"],
            ["A szomszédok fontossága eltér, és a tartalmuktól függ", "GAT"],
            ["Molekulák osztályozása, számít a szerkezet és a darabszám", "GIN"]
          ],
          hint: "Melyik modell vett mintát a szomszédokból, melyik tanul súlyt rájuk, és melyik gyűjt összeggel?",
          explain: "A GCN egyszerű, gyors, erős alapvonal homofil gráfon. A GraphSAGE mintavételez, induktív, és külön súlyt ad a saját vektornak – nagy, változó gráfra. A GAT figyelemmel súlyozza a szomszédokat (inkább GATv2). A GIN összeg + MLP: látja a darabszámot, és a WL-teszt erejéig kifejező – gráfszintű, kémiai feladatra."
        },
        {
          type: "single", shuffle: true,
          q: R`Skalár jellemzőkkel melyik gyűjtés különbözteti meg az $\{1, 3\}$ és a $\{2, 2\}$ multihalmazt?`,
          options: [
            "Csak a maximum",
            "Csak az összeg",
            "Csak az átlag",
            "Az összeg és az átlag is"
          ],
          answer: 0,
          hint: "Számold ki mindhármat mindkét multihalmazra.",
          explain: R`Összeg: 4 és 4; átlag: 2 és 2; maximum: 3 és 2. Itt csak a maximum különböztet meg. Skalár értékeknél tehát egyik gyűjtés sem tökéletes – az összeg is csak akkor kódolja egyértelműen a multihalmazt, ha a jellemzőket (az MLP) előbb több dimenzióba, pl. one-hot vektorokká alakítja. Ezért kell a GIN-ben az MLP.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`Az $\{\text{C}\}$ és a $\{\text{C, C}\}$ szomszédságot (one-hot jellemzővel) az összeg, az átlag és a maximum közül csak az összeg különbözteti meg.`,
            "A GAT figyelmi súlyai összege 1, ezért a GAT sem látja, hány szomszéd van.",
            R`Az eredeti GAT „statikus” figyelmet számol: a szomszédok rangsorát minden csúcsnál ugyanúgy a $\mathbf h_u$-s tag dönti el.`,
            R`A maximum megkülönbözteti a $\{\text{C, O}\}$ és a $\{\text{C, C, O, O}\}$ szomszédságot.`,
            "A GraphSAGE mintavétele torzítja a gyűjtött átlagot: a várható értéke nem a teljes átlag."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a „két egyforma szomszéd és egy ugyanolyan” esetre, és a LeakyReLU monotonitására. A mintaátlag várható értéke?",
          explain: R`Összeg $(1;\ 0)$ vs. $(2;\ 0)$, az átlag és a maximum mindkettőre $(1;\ 0)$. A GAT súlyozott átlag, így a darabszám elvész. Az eredeti GAT pontszáma $a_1 \cdot (\ldots h_v) + a_2 \cdot (\ldots h_u)$ alakú, a LeakyReLU monoton, ezért a rangsort csak a $\mathbf h_u$-s tag dönti el (a GATv2 ezt javítja). A maximum mindkét esetben $(1;\ 1)$ – csak azt látja, mi fordul elő. A mintaátlag várható értéke a teljes átlag: a mintavétel zajt ad, de nem torzít.`
        }
      ]
    },
