/* =========================================================
   Mesterséges intelligencia 13. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 13.6 */
    "ai13-136": {
      title: "Kvíz – 13.6 Csúcs, él, gráf – a kimenet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A metanol (C–O) és a glioxál (O–C–C–O) atomjainak one-hot (C; O) jellemzőiből kiolvasást számolunk, üzenetküldés nélkül. Melyik kiolvasás különbözteti meg a két molekulát?`,
          options: [
            R`Csak az összeg: $(1;\ 1)$, illetve $(2;\ 2)$.`,
            R`Csak az átlag: $(0{,}5;\ 0{,}5)$, illetve $(1;\ 1)$.`,
            R`Csak a maximum: $(1;\ 1)$, illetve $(2;\ 2)$.`,
            R`Az összeg és az átlag is, a maximum nem.`
          ],
          answer: 0,
          hint: "Számold ki mindhárom kiolvasást mindkét molekulára! Mit lát az átlag: a darabszámot vagy az arányt?",
          explain: R`Összeg: metanol $(1;\ 1)$, glioxál $(2;\ 2)$ – eltér. Átlag: mindkettő $(0{,}5;\ 0{,}5)$, mert mindkettő fele szén, fele oxigén; az $(1;\ 1)$ a glioxál összegét az atomfajták számával (2) osztja a 4 atom helyett. Maximum: mindkettő $(1;\ 1)$ – a maximum sosem lehet $(2;\ 2)$ one-hot vektorokból. Az átlag és a maximum <b>méretvak</b>, az összeg nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`A glioxálon (O–C–C–O, one-hot (C; O) jellemzők) lefuttatunk egy $\mathbf h_v' = \mathbf h_v + \sum_u \mathbf h_u$ üzenetküldő réteget, majd összeg-kiolvasást. Mi az eredmény?`,
          options: [R`$(6;\ 4)$`, R`$(2;\ 2)$`, R`$(4;\ 2)$`, R`$(1{,}5;\ 1)$`],
          answer: 0,
          hint: R`Számold ki atomonként: saját vektor + a szomszédok vektorainak összege. A szélső O-nak egy, a középső C-knek két szomszédja van.`,
          explain: R`Szélső O: $(0;1) + (1;0) = (1;\ 1)$, kétszer. Középső C: $(1;0) + (0;1) + (1;0) = (2;\ 1)$, kétszer. Összeg: $(6;\ 4)$. A $(2;\ 2)$ az üzenetküldés előtti összeg, a $(4;\ 2)$ elfelejti a saját vektort (csak a szomszédokat adja össze), az $(1{,}5;\ 1)$ az átlag, nem az összeg.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a kiolvasásra (readout)?",
          options: [
            "Invariáns: bárhogy számozzuk az atomokat, ugyanazt adja.",
            "Extenzív tulajdonsághoz (pl. a molekula energiája) az összeg illik, mert az átlag a méretet nem látja.",
            "Ha minden réteg után kiolvasunk és a vektorokat összefűzzük, az eredmény a csúcsok számozásától függ, mert az összefűzés sorrendfüggő.",
            "Már a kezdeti jellemzők összegéből is kiolvasható a molekula szerkezete.",
            "A benzolt és a „két ciklopropánt” egy ügyesebb kiolvasás szétválasztaná."
          ],
          answer: [0, 1],
          hint: "Az összefűzés minek a sorrendjében történik? És hol vész el a benzol és a két ciklopropán közti különbség?",
          explain: R`Az első kettő igaz. Az összefűzés a <b>rétegek</b> rögzített sorrendjében történik, nem a csúcsokéban – minden réteg kiolvasása invariáns, így az egész is. A kezdeti jellemzők összege csak az atomok darabszámát adja (az etanol és a dimetil-éter is $(2;\ 1)$); a szerkezetet az üzenetküldés írja bele a vektorokba. A benzol és a két ciklopropán minden atomja minden réteg után ugyanaz – ez az üzenetküldés korlátja (13.7), nem a kiolvasásé.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kapcsolat-előrejelzés: $\mathbf z_u = (1;\ 2)$, $\mathbf z_v = (0{,}5;\ -0{,}5)$, $p(u{-}v) = \sigma(\mathbf z_u \cdot \mathbf z_v)$. Mekkora a valószínűség?`,
          options: ["0,378", "0,622", "−0,5", "0,818"],
          answer: 0,
          hint: "Előbb a skaláris szorzat (vigyázz az előjelre!), aztán a szigmoid.",
          explain: R`$\mathbf z_u \cdot \mathbf z_v = 0{,}5 - 1 = -0{,}5$, $\sigma(-0{,}5) \approx 0{,}378$. A 0,622 a $\sigma(+0{,}5)$ (előjelhiba), a $-0{,}5$ a nyers pontszám – szigmoid nélkül nem valószínűség –, a 0,818 a $\sigma(1{,}5)$, ha a negatív tagot is pozitívnak veszed.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy <b>nem létező</b> párra (negatív minta) a modell pontszáma 1, azaz $p = \sigma(1) \approx 0{,}731$. Mekkora ennek a párnak a bináris keresztentrópia-vesztesége?`,
          options: ["1,313", "0,313", "0,570", "0,269"],
          answer: 0,
          hint: R`Negatív párnál a veszteség tagja $-\ln\big(1 - \sigma(s)\big)$.`,
          explain: R`$-\ln(1 - 0{,}731) = -\ln 0{,}269 \approx 1{,}313$ – erős büntetés, mert a modell élt mondott oda, ahol nincs. A 0,313 a $-\ln 0{,}731$: ennyi lenne, ha a pár pozitív volna. A 0,570 tízes alapú logaritmussal számol ($-\lg 0{,}269$), a 0,269 pedig csak $1 - p$, logaritmus nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért kellenek negatív minták a kapcsolat-előrejelzés tanításához?",
          options: [
            "Csak pozitív élekkel a legjobb „megoldás” minden vektort nagyra és egyirányúra állítani – akkor minden párra 1 jön ki.",
            "Mert a bináris keresztentrópia csak akkor értelmezhető, ha legalább annyi negatív példa van, ahány pozitív.",
            "Mert a pozitív élek túl sokan vannak, és nem férnek el a memóriában.",
            "Mert a skaláris szorzat szimmetrikus, és a negatív minták teszik irányítottá."
          ],
          answer: 0,
          hint: R`Írd fel a veszteséget csak a pozitív tagokkal: $-\sum \ln \sigma(\mathbf z_u \cdot \mathbf z_v)$. Hogyan lehet ezt 0-hoz vinni?`,
          explain: R`Csak pozitívakkal a veszteség akkor csökken, ha minden skaláris szorzat nő – a nem létező párokra is. Egyirányú, nagy vektorokkal $\sigma \to 1$ mindenhol, $\mathcal L \to 0$: a modell „mindenki mindenkivel kapcsolatban áll” – használhatatlan. A negatív tag bünteti ezt. A pozitív-negatív arány nem a veszteség értelmezhetőségén múlik; az irányított gráf problémáját pedig két külön vektor vagy aszimmetrikus pontszám oldja meg, nem a negatív minta.`
        },
        {
          type: "multi",
          q: "Melyik okoz szivárgást (a teszt válasza bekerül a tanításba)?",
          options: [
            "Kapcsolat-előrejelzésnél a teszt-élek bent maradnak az üzenetküldő gráfban.",
            "Csalásfelderítésnél a „hány csalóval van kapcsolatban a számla” jellemzőt a teljes címkehalmazból számolod.",
            "Transzduktív csúcsosztályozásnál a tesztcsúcsok jellemzői és élei részt vesznek az üzenetküldésben.",
            "Élfelosztásnál a tesztél két végpontja a tanításban is szerepel.",
            "Molekuláknál véletlen felosztás helyett vázfelosztást használsz."
          ],
          answer: [0, 1],
          hint: "Kerül-e a tanításba a teszt címkéje (vagy a tesztél maga)? A tesztcsúcs jellemzője még nem a válasza.",
          explain: R`Az első kettő szivárgás: a bent hagyott tesztél miatt a végpontok közvetlenül egymástól gyűjtenek (még a fokszámuk is 1-gyel nagyobb), a teljes címkehalmazból számolt jellemző pedig a teszt címkéit hordozza. A transzduktív beállításban a tesztcsúcsok jellemzői és élei részt vehetnek – csak a <em>címkéik</em> nem (Cora: 140 tanítócsúcs, de az üzenetküldés mind a 2708-on fut). A tesztél végpontjainak ismerete rendben van, csak azt méri, mennyire jósol új kapcsolatot ismert csúcsok között. A vázfelosztás éppen a túl könnyű véletlen felosztás ellenszere.`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a helyes felosztással!",
          pairs: [
            ["Csúcsosztályozás egyetlen gráfon (pl. Cora)", "tanító / validációs / teszt csúcsmaszk"],
            ["Kapcsolat-előrejelzés", "üzenetküldő, felügyeleti, validációs és teszt élek"],
            ["Molekulák tulajdonságának jóslása", "vázfelosztás"],
            ["Jövőbeli barátságok jóslása egy közösségi hálón", "idő szerinti vágás"]
          ],
          hint: "Mi a „minta” az egyes feladatokban: csúcs, él vagy egész gráf? És mikor számít az idő?",
          explain: R`Csúcsszinten (transzduktív) a csúcsokat maszkokkal osztjuk, az üzenetküldés mindenhol fut. Élszinten négyfelé osztjuk az éleket, és a validációs/teszt élek nincsenek az üzenetküldő gráfban. Molekuláknál a vázfelosztás a közös vázú molekulákat egy oldalra teszi (a véletlen felosztás túl könnyű). Időbeli gráfon a jövő élei sosem lehetnek a múlt tanításában.`
        }
      ]
    },

    /* ------------------------------------------------ 13.7 */
    "ai13-137": {
      title: "Kvíz – 13.7 Mennyit tud egy GNN? Kifejezőerő és korlátok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Futtasd az 1-WL színfinomítást a futó példán (élek A–B, A–C, B–C, B–D, D–E; kezdetben minden csúcs egyforma)! Mik a végső színosztályok?",
          options: [
            "{Anna, Csilla}, {Bence}, {Dávid}, {Emese}",
            "{Anna, Csilla, Dávid}, {Bence}, {Emese}",
            "{Anna}, {Bence}, {Csilla}, {Dávid}, {Emese}",
            "{Anna, Csilla}, {Bence}, {Dávid, Emese}"
          ],
          answer: 0,
          hint: "Az 1. körben a fokszám dönt. A 2. körben nézd meg, milyen színű szomszédai vannak a 2-es fokú csúcsoknak!",
          explain: R`1. kör: Bence (3 szomszéd), {Anna, Csilla, Dávid} (2), Emese (1). 2. kör: Anna és Csilla szomszédai egy „2-es” és egy „3-as”, Dávidé egy „3-as” és egy „1-es” – Dávid leválik. 3. kör: nincs új szétválás. A {Anna, Csilla, Dávid} az 1. kör után megálló színezés. Anna és Csilla sosem válik szét – helyesen, mert felcserélhetők; Dávid és Emese fokszáma már az 1. körben eltér.`
        },
        {
          type: "multi",
          q: "Mely gráfpárokat NEM tudja megkülönböztetni az 1-WL (és így egyetlen üzenetküldő GNN sem), ha a csúcsoknak nincs jellemzője?",
          options: [
            "A hatszög és a két különálló háromszög",
            "Egy 8 csúcsú kör és két különálló négyzet",
            "A dekalin és a biciklopentil (csak a szénváz)",
            "A 4 csúcsú út és a 4 csúcsú csillag",
            "A négyzet (4 csúcsú kör) és a 4 csúcsú út"
          ],
          answer: [0, 1, 2],
          hint: "Ha minden csúcs fokszáma (és a szomszédok fokszáma) ugyanaz a két gráfban, a színezés nem tud elindulni. Hol tér el már a fokszámok hisztogramja?",
          explain: R`Az első háromban a fokszám-hisztogram egyezik, és a finomítás sem választ szét semmit: a hatszögben, a két háromszögben, a 8-as körben és a két négyzetben mindenki 2-es fokú; a dekalinban és a biciklopentilben 2 atom 3-as, 8 atom 2-es fokú, 11 kötés. Pedig ezek különböző gráfok – az egyezés <b>nem bizonyít</b> semmit. Az út $(1, 2, 2, 1)$ és a csillag $(3, 1, 1, 1)$, illetve a négyzet (csupa 2) és az út már az 1. körben szétválik.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy hat csúcsú láncon a címkék váltakoznak: 0, 1, 0, 1, 0, 1. Melyik réteg tudja a két osztályt jól szétválasztani?",
          options: [
            R`Külön súly a saját és a szomszédos vektorra (GraphSAGE-szerű, pl. $w_1 = 1$, $w_2 = -1$).`,
            "Több egymás utáni GCN-réteg: a sok átlagolás végül kiszűri a zajt.",
            "Önhurkos átlagolás: így a csúcs a saját értékét is látja.",
            "Egy virtuális csúcs, amely mindenkivel össze van kötve."
          ],
          answer: 0,
          hint: "Mennyi a szomszédok átlaga egy 0-s és egy 1-es csúcsnál? Mit tesz ezzel egy közös súly, és mit két külön súly?",
          explain: R`A szomszédok átlaga mindig a <b>másik</b> osztály. A $h' = h_v - m_v$ réteg: 0-s csúcsnál $0 - 1 = -1$, 1-esnél $1 - 0 = 1$ – a különbség nőtt. Az önhurkos átlag mindent 0,5 körülire mos össze ($0{,}5;\ 0{,}333;\ 0{,}667;\ldots$), a további GCN-rétegek ezt még tovább simítják. A virtuális csúcs a túlnyomás ellen jó, a heterofíliát nem oldja meg. Heterofil gráfon a GCN közös súlya ($w_1 = w_2$) a gond; a GraphSAGE és a GIN külön kezeli a saját vektort.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 3 csúcsú úton (1–2–3) $x = (0;\ 0;\ 7)$. Ismételt önhurkos átlagolással ($\hat D^{-1}\hat A$) minden csúcs ugyanahhoz az értékhez tart. Mennyi ez?`,
          options: ["2", "2,333", "1,75", "0"],
          answer: 0,
          hint: "A határérték nem a sima átlag, hanem súlyozott átlag. Mi a súly – és számít-e az önhurok?",
          explain: R`Az önhurokkal számolt fokszámok $(2;\ 3;\ 2)$, összegük 7: $\dfrac{2 \cdot 0 + 3 \cdot 0 + 2 \cdot 7}{7} = 2$. A 2,333 a sima átlag ($7/3$), az 1,75 önhurok nélküli fokszámokkal $(1;\ 2;\ 1)$ súlyoz ($7/4$). A 0 tévhit: a túlsimítás nem nullázza ki az értékeket, hanem mindenkit egy közös értékre húz – a különbségek tűnnek el.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit mond a 13.7 📅 doboza (2026-os állapot) a mély GNN-ek gyakorlati kudarcáról?",
          options: [
            "A túlsimítás bizonyított, de legalább ekkora ok a nehéz taníthatóság; a túlsimítás megszüntetése szükséges, de nem elégséges.",
            "A túlsimítás csak a GCN-t érinti; a figyelem (GAT, Transformer) megvéd tőle.",
            "Maradékkapcsolattal a túlsimítást megszüntették, ezért ma 50–150 rétegű GNN-ek a jellemzők.",
            "A túlsimítás csak látszat, valójában kizárólag a hangolatlan hiperparaméterek okozzák."
          ],
          answer: 0,
          hint: "Két okot említ a doboz – az egyik a simítás, a másik a súlymátrixokhoz kapcsolódik. Hány réteg a jellemző ma?",
          explain: R`A túlsimítás matematikailag bizonyított – GCN-re, GAT-ra, sőt a Transformer figyelmére is (Wu és társai, 2023), tehát a figyelem nem véd. Több tanulmány szerint a sok egymásra rakott súlymátrix nehéz taníthatósága legalább ekkora ok, és Rusch–Bronstein–Mishra (2023) szerint a túlsimítás megszüntetése szükséges, de nem elégséges. A gyakorlatban ma is 2–4 réteg a jellemző; az 50–150 réteg a CNN-ek (ResNet) világa.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy fában minden csúcsnak 2 gyereke van. Hány levél információja jut el a gyökérhez 6 üzenetküldő réteg után – ugyanabba a rögzített méretű vektorba?",
          options: ["64", "12", "36", "127"],
          answer: 0,
          hint: "Rétegenként egy szinttel lejjebb látunk; minden szinten hányszorozódik a csúcsok száma?",
          explain: R`$2^6 = 64$ levél. A 12 a $2 \cdot 6$ (összeadja a szinteket szorzás helyett), a 36 a $6^2$ (kitevő és alap felcserélve), a 127 az összes csúcs a 6 ugrásnyi környezetben ($1 + 2 + \ldots + 64$), nem csak a levelek. Ez a <b>túlnyomás</b>: a recepciós mező exponenciálisan nő, a vektor mérete nem.`
        },
        {
          type: "single", shuffle: true,
          q: "A futó példán (élek A–B, A–C, B–C, B–D, D–E) Anna, Csilla és Dávid címkéje 0, Bence és Emese címkéje 1. Mennyi az élhomofília?",
          options: ["0,2", "0,8", "0,6", "0,4"],
          answer: 0,
          hint: "Az élek közül hány köt össze azonos címkéjű csúcsokat? Élekre számolj, ne csúcsokra!",
          explain: R`A–B (0–1), A–C (0–0), B–C (1–0), B–D (1–0), D–E (0–1): csak 1 azonos az 5-ből, $1/5 = 0{,}2$ – erősen heterofil. A 0,8 a különböző címkéjű élek aránya (fordítva számolva), a 0,6 és a 0,4 a 0-s, illetve 1-es címkéjű <em>csúcsok</em> aránya – az nem homofília.`
        },
        {
          type: "match",
          q: "Párosítsd a korlátot a leírásával!",
          pairs: [
            ["Túlsimítás", "sok réteg után minden csúcsvektor ugyanahhoz tart"],
            ["Túlnyomás", "sok távoli csúcs információja egy rögzített méretű vektorba préselődik"],
            ["Heterofília", "a szomszédok jellemzően más osztályba tartoznak"],
            ["WL-korlát", "két különböző gráfra minden üzenetküldő háló ugyanazt adja"]
          ],
          hint: "Melyik szól a mélységről, melyik a szűk keresztmetszetről, melyik a címkékről és melyik a megkülönböztetésről?",
          explain: R`Túlsimítás: az ismételt átlagolás exponenciálisan egy közös vektorhoz visz. Túlnyomás (Alon és Yahav, 2021): exponenciálisan nő a recepciós mező, a vektor nem – különösen „hidaknál” súlyos. Heterofília: alacsony élhomofília, ilyenkor a GCN-féle átlagolás jelet ront. WL-korlát: amit az 1-WL nem választ szét (pl. hatszög és két háromszög), azt semmilyen üzenetküldő GNN sem.`
        }
      ]
    },

    /* ------------------------------------------------ 13.8 */
    "ai13-138": {
      title: "Kvíz – 13.8 Gráf-Transformerek: a Transformer mint GNN",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Ha az önfigyelem-réteget üzenetküldésként írjuk fel, mi a csúcs szomszédsága, $N(v)$?`,
          options: [
            R`Mindenki: $N(v) = V$, önmagát is beleértve.`,
            "A sorozatban közvetlenül előtte és utána álló token.",
            "Csak a legnagyobb figyelmi súlyú néhány token.",
            "Senki: az önfigyelem nem üzenetküldés, mert nincs benne gráf."
          ],
          answer: 0,
          hint: "A 12.5-ben a „levél” token hány tokenre figyelt?",
          explain: R`Az önfigyelem egy GNN a <b>teljes</b> gráfon (önhurkokkal): az üzenet $\mathbf h_u W_V$, a gyűjtés figyelemmel súlyozott összeg mindenkin. Olyan, mint a GAT, csak a gráf teljes, és a pontszám a lekérdezés és a kulcs skaláris szorzata. A „bal és jobb szomszéd” egy láncon futó GNN lenne; a figyelem nem vág le tokeneket, minden pár kap súlyt.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 1000 csúcsú, 4000 élű (irányítatlan) gráfon hányszor több párt vizsgál a teljes önfigyelem, mint egy GCN-réteg (mindkét irány + önhurkok)?",
          options: ["kb. 111-szer", "kb. 125-ször", "kb. 250-szer", "kb. 200-szor"],
          answer: 0,
          hint: R`GCN: minden él kétszer (oda-vissza) + csúcsonként egy önhurok. Teljes figyelem: $n^2$.`,
          explain: R`GCN: $2 \cdot 4000 + 1000 = 9000$ pár; teljes figyelem: $1000^2 = 10^6$; arány $\approx 111$. A 125 elfelejti az önhurkokat ($10^6/8000$), a 250 az önhurkokat és a második irányt is ($10^6/4000$), a 200 csak a második irányt ($10^6/5000$). Ez a 12.5 négyzetes ára gráfokon.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a gond egy pozíciókódolás nélküli gráf-Transformerrel?",
          options: [
            "Permutációekvivariáns ugyan, de nem tudja, ki kinek a szomszédja – a gráf szerkezetét be kell adni.",
            "Elveszíti a permutációekvivarianciát, mert a csúcsok sorrendje számít a figyelemben.",
            "Kevesebb párt vizsgál, mint egy GCN, ezért a távoli csúcsokat nem látja.",
            "Semmi: a figyelem a jellemzőkből magától megtanulja az éleket."
          ],
          answer: 0,
          hint: "A teljes gráfon mindenki mindenkinek szomszédja. Hol szerepel ebben a molekula kötéseinek listája?",
          explain: R`A $W_Q, W_K, W_V$ minden csúcsra ugyanaz, és a figyelem az összes csúcson összegez, ezért a réteg ekvivariáns – átszámozásra csak a sorok rendeződnek át. Ugyanezért viszont az eredeti gráf szerkezete (mely atomok között van kötés) <b>eltűnik</b>; pozíció- és szerkezeti kódolással (vagy egy helyi üzenetküldő ággal) kell visszaadni. A teljes figyelem több párt néz, nem kevesebbet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 4 csúcsú teljes gráfban (mindenki mindenkivel, önhurok nélkül) mekkora a véletlen séta visszatérési valószínűsége 3 lépés után, $(M^3)_{vv}$, ahol $M = D^{-1}A$?`,
          options: [R`$2/9 \approx 0{,}222$`, R`$1/4 = 0{,}25$`, R`$2/27 \approx 0{,}074$`, R`$0$`],
          answer: 0,
          hint: "Minden lépés 1/3 eséllyel megy egy adott szomszédba. Hány különböző 3 lépéses zárt séta van v → a → b → v alakban?",
          explain: R`Az első lépés 3 csúcs közül, a második a maradék 2 közül (nem mehet vissza $v$-be, különben a 3. lépés nem érne vissza): $3 \cdot 2 = 6$ séta, mindegyik $(1/3)^3$ valószínűségű: $6/27 = 2/9$. Az $1/4$ a háromszög értéke (ott 2 séta, $(1/2)^3$ valószínűséggel); a $2/27$ csak két irányt számol, mint a háromszögben; a 0 páros (kétszínezhető) gráfra lenne igaz, de itt vannak háromszögek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 5 csúcsú gráf Laplace-mátrixának ($L = D - A$) sajátértékei: $0;\ 0;\ 0;\ 1;\ 3$. Hány összefüggő darabból (komponensből) áll a gráf?`,
          options: ["3", "2", "1", "5"],
          answer: 0,
          hint: "Minden összefüggő darabon külön állandó vektor ad 0-t.",
          explain: R`A 0 sajátértékek száma = a komponensek száma: 3 (például egy 3 csúcsú út – sajátértékei $0;\ 1;\ 3$ – és két izolált csúcs). A 2 a nem nulla sajátértékek száma, az 5 az összes sajátértéké, az 1 azt hinné, hogy a 0 mindig csak egyszer fordulhat elő (az csak összefüggő gráfra igaz – mint a hatszögnél).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a gráfos pozíciókódolásra?",
          options: [
            R`A Laplace-sajátvektor előjele önkényes ($\mathbf u$ és $-\mathbf u$ is sajátvektor), ezért tanításkor véletlenszerűen átfordítják, vagy előjelfüggetlen hálót használnak.`,
            "A véletlenséta-kódolás nem függ a számozástól, és ritka mátrixszorzásokkal olcsón számolható.",
            "A csúcs sorszáma (1, 2, …, n) jó pozíciókódolás, ahogy a mondatoknál a token sorszáma.",
            "Egy jó pozíciókódolás a futó példán Annát és Csillát is megkülönbözteti.",
            "A pozíciókódolás nem segít a WL-korláton, hiszen az üzenetküldés ugyanaz marad."
          ],
          answer: [0, 1],
          hint: "Mi történik egy kódolással átszámozáskor? És honnan jön a kódolás: helyi vagy globális szerkezetből?",
          explain: R`Az első kettő igaz (a sajátvektoroknál egyenlő sajátértékeknél még rosszabb: tetszőlegesen elforgathatók). A sorszám a számozástól függ – átszámozás után ugyanaz a csúcs más kódot kapna, a modell nem lenne ekvivariáns. Anna és Csilla szimmetrikusak: a 2 lépéses visszatérésük is egyforma (0,417) – jó kódolás nem tesz különbséget, ahol a gráfban nincs. A pozíciókódolás globális szerkezetet (gyűrűk, távolságok) ad a kezdő jellemzőkhöz, így a WL-korlát átléphető: a hatszögben a 3 lépéses visszatérés 0, a két háromszögben 0,25.`
        },
        {
          type: "single", shuffle: true,
          q: "Hogyan épül fel egy GPS-típusú gráf-Transformer-réteg (Rampášek és társai, 2022)?",
          options: [
            "Rétegenként egy üzenetküldő ág az éleken és egy teljes önfigyelem-ág fut egymás mellett, az eredményt összeadják, utána FFN; a bemenethez RWSE/LapPE kódolást fűznek.",
            "Előbb több üzenetküldő réteg fut, a végén egyetlen önfigyelem-réteg veszi át a kiolvasás szerepét.",
            "Csak teljes önfigyelem van, az éleket kizárólag a pozíciókódolás hordozza – üzenetküldő ág nincs.",
            "Az önfigyelem csak a szomszédokon fut (mint a GAT), a globális kapcsolatot egy virtuális csúcs adja."
          ],
          answer: 0,
          hint: "„Helyi + globális” – egymás után vagy egymás mellett? És mit kap a bemenet?",
          explain: R`$H' = \operatorname{FFN}(H_{\text{helyi}} + H_{\text{globális}})$, maradékkapcsolatokkal és normalizálással. A helyi ág (költség $\sim |E|$) megtartja a kötések pontos szerkezetét, a globális ág ($\sim n^2$) egy lépésben összeköti a távoli csúcsokat – ez a túlnyomás ellenszere. A „csak figyelem” változat a szerkezetet csak közvetve látná, a „csak szomszédokon figyelő” változat pedig egy GAT lenne, globális ág nélkül.`
        },
        {
          type: "multi",
          q: "Mit állít a 13.8 📅 doboza a gráf-Transformerek és a klasszikus GNN-ek összevetéséről?",
          options: [
            "Az LRGB-benchmarkon a gráf-Transformerek előnye alapos hiperparaméter-hangolás után eltűnt (Tönshoff és társai, 2024).",
            "Kis hangolással a GCN, a GAT és a GraphSAGE 18 csúcsosztályozási adatkészletből 17-en hozta vagy verte a gráf-Transformereket.",
            "A gráf-Transformerek minden benchmarkon egyértelműen legyőzték a klasszikus GNN-eket, ezért a szakirodalom egységes.",
            "A nagy időjárásmodellek (GenCast, WeatherNext 2) elhagyták a gráfot, és rácson futó CNN-t használnak.",
            "A globális figyelemnek a valódi hosszú távú fizikai kölcsönhatásoknál sincs előnye."
          ],
          answer: [0, 1],
          hint: "A doboz így kezdődik: „A szakirodalom megosztott.” Mit mond az egyik, és mit a másik tábor?",
          explain: R`Az első kettő a „klasszikus GNN erős alapvonal” tábor eredménye (Luo és társai gráfszintű feladatokon is: 14-ből mindegyiken az első háromban, 8-on első). A másik tábor szerint valódi hosszú távú fizikai kölcsönhatásoknál a helyi + globális modellek előnye a legtisztább, és a nagy rendszerek egyre inkább figyelmet használnak <b>egy gráfon</b>: a GenCast és a WeatherNext 2 gráf-Transformert futtat a gömbháló csúcsain. A tanulság: előbb egy jól hangolt klasszikus GNN-t mérj.`
        }
      ]
    },

    /* ------------------------------------------------ 13.9 */
    "ai13-139": {
      title: "Kvíz – 13.9 Geometriai és ekvivariáns GNN-ek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két atom az $(1;\ 1;\ 1)$ és a $(3;\ 4;\ 7)$ pontban van. Mennyi a távolságuk, és mennyi lesz, ha a molekulát elforgatod, majd $(5;\ 0;\ 0)$-val eltolod?`,
          options: ["7, és utána is 7", "7, utána a forgatástól függően más", "49, és utána is 49", "11, és utána is 11"],
          answer: 0,
          hint: "Különbségvektor, aztán a hossza. Mit tesz a forgatás és az eltolás a különbségvektor hosszával?",
          explain: R`A különbség $(2;\ 3;\ 6)$, hossza $\sqrt{4 + 9 + 36} = \sqrt{49} = 7$. Forgatás és eltolás után is 7: az eltolás a különbségvektort nem érinti, a forgatás a hosszát nem változtatja meg – a távolság E(3)-invariáns. A 49 a gyökvonást felejti el, a 11 a koordinátakülönbségek sima összege. A koordináták változnak, a távolság nem.`
        },
        {
          type: "set",
          q: "Sugárgráfot építünk 5 Å-ös határral. A távolságok: A–B 3,2 Å; A–C 5,4 Å; B–C 4,9 Å; C–D 2,0 Å; B–D 6,3 Å. Jelöld ki a gráf éleit!",
          items: ["A–B", "A–C", "B–C", "C–D", "B–D"],
          answer: ["A–B", "B–C", "C–D"],
          hint: "Él akkor van, ha a távolság a határ alatt van – a kötésektől függetlenül.",
          explain: R`A–B (3,2), B–C (4,9) és C–D (2,0) az 5 Å alatt van; A–C (5,4) és B–D (6,3) fölötte. A sugárgráf a térből jön, nem a kémiai kötésekből: egy fehérjében a láncban 100 lépésre lévő aminosavak is szomszédok lehetnek, ha a térben közel vannak.`
        },
        {
          type: "multi",
          q: "Melyik mennyiség ekvivariáns (forog együtt a molekulával)?",
          options: [
            "Az egyes atomokra ható erők",
            "A molekula dipólusmomentum-vektora",
            "Az EGNN koordináta-frissítésében az atomok elmozdulása",
            "A molekula teljes energiája",
            "Az atomok közti legkisebb távolság"
          ],
          answer: [0, 1, 2],
          hint: "Szám vagy vektor? A szám (skalár) forgatáskor marad, a vektor elfordul.",
          explain: R`Az erő, a dipólus és az elmozdulás vektor: elforgatott molekulánál ugyanúgy elfordul, $F(R\mathbf x + \mathbf t) = R\,F(\mathbf x)$ – ekvivariáns. Az energia és a legkisebb távolság szám: forgatásra nem változik – invariáns. Ha egy erőt invariáns modellel jósolsz, elforgatott molekulára rossz irányt kapsz. Az erőt gyakran az invariáns energia deriváltjából ($-\nabla_{\mathbf x} E$) kapják, az automatikusan ekvivariáns.`
        },
        {
          type: "single", shuffle: true,
          q: R`A rugós szabály: $\mathbf x_i' = \mathbf x_i + (\mathbf x_i - \mathbf x_j)\, c(d)$, $c(d) = -0{,}25\,(d - 1)$. Hová kerül a $(0;\ 0)$ és a $(0;\ 1{,}4)$ pontban lévő két atom?`,
          options: [
            R`$(0;\ 0{,}14)$ és $(0;\ 1{,}26)$`,
            R`$(0;\ -0{,}14)$ és $(0;\ 1{,}54)$`,
            R`$(0;\ 0{,}1)$ és $(0;\ 1{,}3)$`,
            R`$(0;\ 0{,}49)$ és $(0;\ 0{,}91)$`
          ],
          answer: 0,
          hint: R`$d = 1{,}4$, tehát $c = -0{,}25 \cdot 0{,}4$. Az első atomnál $\mathbf x_1 - \mathbf x_2 = (0;\ -1{,}4)$.`,
          explain: R`$c = -0{,}1$. Első: $(0;0) + (0;\ -1{,}4)\cdot(-0{,}1) = (0;\ 0{,}14)$; második: $(0;\ 1{,}4) + (0;\ 1{,}4)\cdot(-0{,}1) = (0;\ 1{,}26)$ – a rugó kicsit összehúzódik a nyugalmi hossz felé. A $-0{,}14$ / $1{,}54$ a különbségvektort fordítva veszi (szétlöki az atomokat); a $0{,}1$ / $1{,}3$ egységvektorral számol, elhagyja a távolsággal szorzást; a $0{,}49$ / $0{,}91$ a $(d - 1)$ helyett $d$-vel számolja $c$-t.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem tudja egy csak távolságokat látó háló megkülönböztetni egy molekulát a tükörképétől (pl. a talidomid két formáját)?",
          options: [
            "Mert a tükrözés minden távolságot (és szöget) megőriz – a háló bemenete a két esetben pontosan ugyanaz.",
            "Mert a távolságok tükrözéskor előjelet váltanak, és a háló csak az abszolút értéket látja.",
            "Mert a sugárgráf 5 Å-ös határa túl kicsi a teljes molekulához.",
            "Mert a tükrözés átszámozza az atomokat, a háló pedig permutációinvariáns."
          ],
          answer: 0,
          hint: "Az E(3) a forgatásokat, az eltolásokat – és még mit tartalmaz?",
          explain: R`A tükrözés is távolságtartó (E(3) része), ezért egy csak távolságokra épülő, E(3)-invariáns háló a molekulát és a tükörképét (kiralitás) egyformának látja. A távolság mindig nemnegatív, nincs előjele. Ha a kiralitás számít, csak a forgatásra (SE(3)) szabad invariánsnak lenni, a tükrözésre nem – ehhez előjeles mennyiség kell (pl. torziós szög előjele).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kolléga az EGNN koordináta-frissítésében a különbségvektor helyett az abszolút koordinátát használná: $\mathbf x_i' = \mathbf x_i + \sum_j \mathbf x_j\,\phi(\ldots)$. Melyik tulajdonság romlik el?`,
          options: [
            "Az eltolás-ekvivariancia",
            "A forgatás-ekvivariancia",
            "A permutációekvivariancia",
            "Csak a számítás lesz drágább, a szimmetriák megmaradnak"
          ],
          answer: 0,
          hint: R`Told el az összes atomot $\mathbf t$-vel! Kiesik-e $\mathbf t$ a $\sum_j \mathbf x_j\,\phi$ tagból? És forgatásnál kiemelhető-e $R$?`,
          explain: R`Eltolásnál a $\sum_j \mathbf x_j\phi$ tag $\mathbf t \sum_j \phi$-vel változik, ami általában nem $\mathbf t$ – az eredmény nem egyszerűen eltolódik. Forgatásnál viszont $\sum_j R\mathbf x_j\,\phi = R\sum_j \mathbf x_j\,\phi$ (a $\phi$ invariáns), így a forgatás-ekvivariancia megmaradna. A különbségvektorban az eltolás kiesik: $(\mathbf x_i + \mathbf t) - (\mathbf x_j + \mathbf t) = \mathbf x_i - \mathbf x_j$.`
        },
        {
          type: "match",
          q: "Párosítsd az adattípust a szimmetriájával és a hozzá illő architektúrával (a geometriai mélytanulás táblázata)!",
          pairs: [
            ["rács (kép)", "eltolás – CNN"],
            ["halmaz", "permutáció – összegzés + MLP (Deep Sets)"],
            ["3D molekula, pontfelhő", "permutáció + forgatás + eltolás – ekvivariáns GNN"],
            ["gömb (Föld, időjárás)", "forgatás – GNN a gömbhálón (GraphCast)"]
          ],
          hint: "Két kérdés: milyen átalakítás nem változtatja meg a választ, és mi a „szomszédság”?",
          explain: R`Kép: a szűrő minden helyen ugyanaz (eltolás). Halmaz: a sorrend nem számít, az összeg invariáns (Deep Sets; a GIN ugyanezt teszi a szomszédokon). 3D molekula: a számozás, a forgatás és az eltolás sem változtat a fizikán (EGNN, NequIP, MACE). Gömb: forgatás – a GraphCast egyenletes gömbhálón futtat üzenetküldést. Mindegyik ugyanazt a receptet követi: a szimmetriát a felépítésbe tesszük.`
        },
        {
          type: "multi",
          q: "Mit állít a 13.9 📅 doboza a geometriai GNN-ek nagy eredményeiről?",
          options: [
            "Az AlphaFold 2 gráfszemléletű, figyelemre épülő háló sűrű gráfon – nem klasszikus, ritka üzenetküldő GNN.",
            "A GNoME 2,2 millió stabilnak jósolt kristályszerkezetet javasolt, de anyagkémikusok szerint kevés a bizonyíték, hogy ezek egyszerre újak, hihetők és hasznosak.",
            "Az alapmodell-potenciálok (pl. MACE-MP-0) rendszeres hibája, hogy a valóságosnál „puhábbnak” látják az energiafelületet.",
            "Az AlphaFold 3 a figyelmet klasszikus, ritka üzenetküldő GNN-re cserélte.",
            "A GNoME mind a 2,2 millió anyagát független laborok már előállították."
          ],
          answer: [0, 1, 2],
          hint: "Figyelj a pontos megfogalmazásra: „gráfszemléletű” ≠ „klasszikus GNN”, és „jósolt” ≠ „előállított”.",
          explain: R`Az első három a szöveg állítása (a MACE-MP-0 „puhaságát” kevés adatos finomhangolás javítja). Az AlphaFold 3 a törzset egyszerűsítette (Pairformer), a szerkezetet diffúziós modullal állítja elő – nem tért át ritka üzenetküldésre. A GNoME 2,2 millió jelöltjéből a szöveg szerint 736-ot állítottak elő független laborok. Jóslat ≠ felfedezés: a számítógépes szűrés a laborkísérletet rövidíti le, nem helyettesíti.`
        }
      ]
    },

    /* ------------------------------------------------ 13.10 */
    "ai13-1310": {
      title: "Kvíz – 13.10 Alkalmazások; gráfok és nagy nyelvi modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A halicin-történetben (Stokes és társai, 2020) mi volt a GNN szerepe?",
          options: [
            "Eldöntötte, melyik 23 molekulát érdemes kipróbálni a 107 millióból – a laborkísérletet nem váltotta ki.",
            "Kiváltotta a laborkísérleteket: a 107 millió molekula hatását a modell igazolta.",
            "Atomról atomra megtervezte a halicin szerkezetét, mint egy generatív modell.",
            "Engedélyezett antibiotikumot talált, amely ma gyógyszerként kapható."
          ],
          answer: 0,
          hint: "A 107 millió pontozott molekulából hányat teszteltek a laborban? És mit mond a buktató-doboz a halicin státuszáról?",
          explain: R`A modell (Chemprop, irányított élekkel dolgozó MPNN) 2335 molekulán tanult, aztán pontozott; a 107 millióból 23-at teszteltek, 8 hatott ($8/23 \approx 34{,}8\%$). Ez a „GNN mint szűrő” minta: kevés drága mérés → tanítás → olcsó pontozás → a legjobbak újramérése. A halicin létező vegyület, amelyet a modell egy adatbázisban talált meg, nem tervezett. A szöveg szerint a halicin és az abaucin preklinikai fázisú – egyik sem engedélyezett gyógyszer.`
        },
        {
          type: "single", shuffle: true,
          q: "A GraphCast rácspontjaiban 5 felszíni és 6 légköri mennyiség szerepel, ez utóbbiak 37 magasságban. Hány változó tartozik egy rácsponthoz?",
          options: ["227", "48", "222", "1110"],
          answer: 0,
          hint: "A légköri mennyiségek minden magasságban külön változók; a felszínieket csak egyszer számold.",
          explain: R`$5 + 6 \cdot 37 = 227$. A 48 összeadja a három számot ($5 + 6 + 37$), a 222 elfelejti a felszíni változókat ($6 \cdot 37$), az 1110 mindent összeszoroz. A $721 \cdot 1440 = 1\,038\,240$ rácsponttal egy időpont kb. 236 millió szám – ezt kódolja a GraphCast egy 40&nbsp;962 csúcsú gömbhálóra.`
        },
        {
          type: "match",
          q: "Párosítsd az időjárásmodellt a felépítésével!",
          pairs: [
            ["GraphCast (2023)", "üzenetküldő GNN a gömbhálón"],
            ["GenCast (2024)", "gráf-Transformer a gömbhálón + diffúzió"],
            ["ECMWF AIFS (2025)", "GNN-kódoló és -dekódoló, Transformer-feldolgozó"],
            ["Pangu-Weather", "3D-s Transformer rácson – nem GNN"]
          ],
          hint: "Melyik az, amelyiknél a szöveg külön kiemeli, hogy nem minden MI-időjárásmodell GNN?",
          explain: R`A GraphCast 16 üzenetküldő réteggel lép 6 órát előre a gömbhálón. A GenCast valószínűségi együttest ad: gráf-Transformer + diffúzió. Az ECMWF 2025. február 25-én élesítette az AIFS-t (GNN-kódoló/-dekódoló, Transformer-feldolgozó). A Pangu-Weather rácson futó 3D-s Transformer – nem minden MI-időjárásmodell GNN.`
        },
        {
          type: "match",
          q: "Párosítsd az alkalmazást a gráffal és a feladatszinttel!",
          pairs: [
            ["Érkezésiidő-becslés (Google Maps)", "csúcs = útszakasz, él = csatlakozás"],
            ["Ajánlás (PinSage)", "kétrészes gráf, élszintű feladat"],
            ["Csalásfelderítés", "csúcs = számla, csúcsszintű feladat"],
            ["Antibiotikum-keresés (halicin)", "csúcs = atom, gráfszintű feladat"]
          ],
          hint: "Minden alkalmazásnál kérdezd meg: mi a csúcs, mi az él, és egy csúcsra, egy párra vagy egy egész gráfra kell-e válasz?",
          explain: R`Google Maps: útszakaszok és csatlakozásaik, a GNN „szuperszakaszok” részgráfjain jósol menetidőt. PinSage: felhasználó/kép–tábla kétrészes gráf, GNN-beágyazás + skaláris szorzat – élszintű (13.6). Csalás: számlák és tranzakciók, „csaló-e?” – csúcsszintű, gyakran heterofil gráfon. Molekula: egy egész gráfra egy válasz, invariáns kiolvasással.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért lehet egy GNN tanítása lassú a GPU-n, pedig kevés szorzást végez?",
          options: [
            "Mert a szomszédok vektorai szétszórva vannak a memóriában, a fokszám csúcsonként más – a számítás ritka és szabálytalan.",
            "Mert egy GNN-réteg több szorzást végez, mint egy azonos méretű CNN-réteg.",
            "Mert a GPU nem tud ritka mátrixot tárolni, ezért a gráfot mindig a processzor dolgozza fel.",
            "Mert a kiolvasás (összeg a csúcsokon) a teljes gráfon négyzetes költségű."
          ],
          answer: 0,
          hint: "Mit szeret a GPU: sűrű, szabályos mátrixszorzást – vagy szétszórt sorok összeszedését?",
          explain: R`A sebesség itt nem a műveletszámon múlik: a szétszórt sorok összegyűjtése, a szomszédok kikeresése és a mintavétel viszi az idő nagyobb részét. Ellenszer: mintavétel (GraphSAGE), csoportokra bontás és csoportonkénti kötegek (Cluster-GCN), gyorsítótárazás. A kiolvasás lineáris a csúcsszámban, nem négyzetes; a ritka mátrix GPU-n is tárolható – csak a hozzáférés szabálytalan.`
        },
        {
          type: "multi",
          q: "Mely állítások szerepelnek a 13.10 📅/⚖️ jelű eredményei között?",
          options: [
            "Az Elliptic-adatkészlet eredeti cikkében a véletlen erdő jobb volt a GCN-nél; későbbi, más beállítású összehasonlításokban a GNN-ek jöttek ki jobban.",
            "A chiptervező ágens (AlphaChip) eredménye vitatott: független kutatók szerint a klasszikus módszerek és a szakértők jobbak, és 2025 végéig nem született sikeres független reprodukció.",
            "A „Talk like a Graph” szerint ugyanannak a gráfnak más szöveges kódolása feladattól függően 4,8–61,8%-kal is javíthatja vagy ronthatja az eredményt.",
            "A GraphRAG az eredeti cikkben és a 2025-ös újraértékeléseken is minden kérdéstípuson verte a sima visszakeresést.",
            "2026-ban már létezik általános, „GPT-szerű” gráf-alapmodell."
          ],
          answer: [0, 1, 2],
          hint: "Figyelj a vitákra: hol mond a szöveg „viszont”-ot, és hol írja, hogy valami (még) nincs?",
          explain: R`Az első három a szöveg állítása. A GraphRAG az eredeti cikkben az átfogó kérdéseken nyert (72–83%-ban teljesebb válasz egy LLM-bíró szerint), de a 2025-ös újraértékelések szerint sok ténykereső kérdésen a sima visszakeresés a jobb – a kettő együtt a legerősebb. A szöveg szerint 2026-ban <b>általános</b> gráf-alapmodell nincs, csak terület-specifikusak (ULTRA tudásgráfokon, MACE-MP-0 atomszimulációban), és ez is vitatott.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem GNN a GraphRAG?",
          options: [
            "Mert nincs benne tanult üzenetküldés: a tudásgráfot egy LLM építi és olvassa, a gráf egy index.",
            "Mert a tudásgráf irányított, a GNN pedig csak irányítatlan gráfon futhat.",
            "Mert a gráf túl nagy, ezért mintavételt használ – a mintavételes háló már nem GNN.",
            "Mert a gráfot csak szövegként írja a promptba, mint a „Talk like a Graph” kísérletei."
          ],
          answer: 0,
          hint: "Mi tesz valamit GNN-né: az, hogy van benne gráf, vagy az, hogy tanult üzenetküldés fut rajta?",
          explain: R`A GraphRAG-ban egy LLM a dokumentumokból tudásgráfot épít, csoportokra bontja és összefoglalja, kérdéskor ezekből válaszol – tanult üzenetküldés nincs benne, a „gráf” adatszerkezet. A GNN irányított gráfon is futhat (pl. a Chemprop irányított élekkel dolgozik), és a mintavételes GraphSAGE is GNN. A GraphRAG nem a nyers gráfot írja a promptba, hanem a csoport-összefoglalókból dolgozik.`
        },
        {
          type: "match",
          q: "Melyik megoldás illik a feladathoz?",
          pairs: [
            ["100 000 cikk témájának besorolása a hivatkozások és a szöveg alapján", "nyelvi modellel kódolt szöveges jellemzők + GNN"],
            ["Átfogó összefoglaló egy céges dokumentumtárból", "GraphRAG (esetleg sima visszakereséssel kombinálva)"],
            ["Háromszögek megszámolása egy 1000 csúcsú gráfban", "egy egyszerű program – se LLM, se GNN"],
            ["Molekula antibakteriális hatásának jóslása", "üzenetküldő GNN gráfszintű kiolvasással"]
          ],
          hint: "Szöveges csúcsok + hivatkozási gráf? Átfogó kérdés sok dokumentumon? Algoritmikus feladat? Nem szöveges, természetes gráf?",
          explain: R`Szöveges csúcsoknál az LLM-beágyazás + klasszikus GNN (pl. TAPE) az egyik legolcsóbb erős recept. Átfogó kérdésekre a GraphRAG erős, ténykeresésre a sima visszakeresés – együtt a legjobbak. A háromszögszámlálás algoritmikus ($\operatorname{tr}(A^3)/6$): egy program hibátlanul megoldja, az LLM legfeljebb megírja. Molekuláknál a gráf az adat természetes formája – ott a GNN dolgozik.`
        }
      ]
    },

    /* ------------------------------------------------ 13.11 */
    "ai13-1311": {
      title: "Kvíz – 13.11 Alkalmazás: hivatkozások és molekulák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A Cora-kísérlet melyik két sorának összevetése mutatja meg, mennyit ad a hivatkozási gráf a cikkek szövegéhez képest?",
          options: [
            "MLP a szózsákon (58,6%) vs. GCN (82,2%)",
            "mindig a leggyakoribb téma (31,9%) vs. MLP a szózsákon (58,6%)",
            "címketerjesztés (69,9%) vs. GCN (82,2%)",
            "GCN (82,2%) vs. GAT (82,6%)"
          ],
          answer: 0,
          hint: "Olyan párt keress, amelyben a két modell ugyanazt a szöveget kapja, és csak az egyik látja a gráfot.",
          explain: "Az MLP és a GCN ugyanazt az 1433 szavas szózsákot kapja, csak a GCN látja a hivatkozásokat is: a 23,6 százalékpontos különbség a gráf hozzájárulása. A leggyakoribb téma vs. MLP azt méri, mennyit ad a szöveg a semmihez képest. A címketerjesztés vs. GCN fordítva: mennyit ad a szöveg a gráfhoz. A GCN vs. GAT két gráfos modell, ott csak a gyűjtés módja más."
        },
        {
          type: "single", shuffle: true,
          q: "A Cora-n fokszám szerint bontva: 1 hivatkozású cikkeken a GCN 76,4%, 2–3 hivatkozásúakon 81,7%, legalább 4 hivatkozásúakon 88,6%; az MLP mindhárom csoportban 57–61%. Mi a legjobb magyarázat?",
          options: [
            "Több szomszéd több bizonyítékot ad a cikk témájáról – a GCN előnye a fokszámmal nő.",
            "A sok hivatkozású cikkek szövege informatívabb, ezért minden modell jobb rajtuk.",
            "A sok szomszédú cikkeken a GCN túlsimít, ezért ott a legkisebb az előnye.",
            "Az 1 hivatkozású cikkeken a gráf már árt: ott az MLP jobb a GCN-nél."
          ],
          answer: 0,
          hint: "Nézd meg, változik-e az MLP pontossága a csoportok között. Ha nem, mi okozza a GCN javulását?",
          explain: "Az MLP csak a szöveget látja, és mindhárom csoportban kb. ugyanannyit ér el – tehát a sok hivatkozású cikkek szövege nem könnyebb. A GCN-é viszont 76,4%-ról 88,6%-ra nő: minél több szomszédtól gyűjt, annál biztosabb a témában (a homofília 81,0%). Túlsimítás két rétegnél még nincs. Az 1 hivatkozásúakon is jobb a GCN az MLP-nél (76,4% vs. kb. 61%), csak ott a legkisebb az előnye."
        },
        {
          type: "single", shuffle: true,
          q: "A szöveget egyáltalán nem használó, paraméter nélküli címketerjesztés a Cora-n 69,9%-ot ér el, az MLP a szózsákon csak 58,6%-ot. Mit mutat ez?",
          options: [
            "A Cora-n a gráfszerkezet önmagában sokat elárul a témáról: a hivatkozások nagy része azonos témájú cikkek között fut.",
            "A szózsák felesleges: a gráf egyedül is annyit tud, mint a GCN.",
            "A címketerjesztés azért jobb, mert több paramétere van, mint az MLP-nek.",
            "A Cora heterofil gráf, ezért a szöveg félrevezeti az MLP-t."
          ],
          answer: 0,
          hint: "Mire épít a címketerjesztés? Gondolj a 13.7 homofília-mérésére.",
          explain: "A címketerjesztés a szomszédok címkéit veszi át – ez akkor működik, ha a hasonlók összekapcsolódnak. A Cora-n a hivatkozások 81,0%-a azonos témájú cikkek között fut (erősen homofil). A szöveg nem felesleges: a GCN a kettővel együtt 82,2%-ot ér el. A címketerjesztésnek 0 paramétere van – nem a méret dönt."
        },
        {
          type: "single", shuffle: true,
          q: "Tízszeres keresztvalidáció 188 molekulán. Körülbelül hány százalékpontot változtat egyetlen molekula (jó vagy rossz válasz) egy hajtás pontosságán?",
          options: ["kb. 5,3–5,6", "kb. 0,53", "10", "kb. 18,8"],
          answer: 0,
          hint: "Hány molekula van egy hajtásban? Egy molekula ennek hányad része?",
          explain: R`Egy hajtásban $188 / 10 = 18{,}8$, vagyis 18 vagy 19 molekula van: egy molekula $1/19 \approx 5{,}3\%$ vagy $1/18 \approx 5{,}6\%$. A 0,53 az egész adatkészletre számolt arány ($1/188$), a 10 egy egész hajtás súlya, a 18,8 a hajtás mérete, nem százalék. Ezért nagy a ±7–10 pontos szórás.`
        },
        {
          type: "single", shuffle: true,
          q: "A tesztmolekulák atomjait átszámozva az MLP pontossága 83,7%-ról 69,5%-ra esett, a GIN kimenete viszont legfeljebb 4 · 10⁻⁶-nal változott. Miért változott egyáltalán a GIN kimenete?",
          options: [
            "Lebegőpontos kerekítés: az összegek más sorrendben adódnak össze, de matematikailag a kimenet ugyanaz.",
            "A GIN csak közelítőleg invariáns; nagyobb molekulákon az eltérés több százalékpont is lehetne.",
            "Az összeg-kiolvasás a csúcsok sorszámától függ, csak itt szerencsére kicsit.",
            "A GIN tanítás közben véletlenül mintavételezi a szomszédokat, ezért minden futás kicsit más."
          ],
          answer: 0,
          hint: "Az összeg matematikailag sorrendfüggetlen. Igaz ez a számítógép véges pontosságú számaira is?",
          explain: "A GIN rétegei ekvivariánsak, a kiolvasása invariáns – matematikailag a kimenet egyáltalán nem változik. A számítógép viszont véges pontossággal ad össze, és a más sorrendben összeadott számok az utolsó jegyekben eltérhetnek: ez a 4 · 10⁻⁶. A GIN nem mintavételez (az a GraphSAGE), és az összeg nem sorszámfüggő. Az MLP 14 százalékpontos esése ezzel szemben valódi: ő a számozási konvenciót tanulta meg."
        },
        {
          type: "match",
          q: "Párosítsd a MUTAG-kísérlet modelljeit azzal, amit a molekulából látnak!",
          pairs: [
            ["atomzsák + logisztikus regresszió", "melyik atomból hány van"],
            ["WL-színek (1 kör) + logisztikus regresszió", "az atomok és közvetlen szomszédságuk"],
            ["MLP a szomszédsági mátrixon", "a mátrix, rögzített számozással"],
            ["GIN + összeg-kiolvasás", "a szerkezet, darabszámokkal"],
            ["GIN + átlag-kiolvasás", "a szerkezet, a méret nélkül"]
          ],
          hint: "Melyik modell számol szomszédságot, melyik függ a számozástól, és melyik kiolvasás méretvak?",
          explain: "Az atomzsák csak az atomtípusok darabszámát látja. Egy WL-kör minden atomot a saját típusával és a szomszédai típusainak multihalmazával színez – ezek darabszámai a jellemzők. Az MLP a mátrix helyeihez köt súlyokat, ezért a számozástól függ. A két GIN ugyanazt a szerkezetet tanulja, de az összeg-kiolvasás a darabszámokat (a méretet) is megtartja, az átlag csak az arányokat (13.6)."
        },
        {
          type: "multi",
          q: "Mely következtetések helyesek a MUTAG-eredményekből (atomzsák 86,0% ± 7,2; WL + LR 87,6% ± 7,0; GIN + összeg 81,9% ± 7,9; GIN + átlag 80,7% ± 7,5)?",
          options: [
            "Az atomzsák és a GIN közti 4,1 pontos különbség a szóráshoz képest kicsi: nem bizonyítja, hogy bármelyik jobb.",
            "A MUTAG-on az atomösszetétel önmagában sokat elárul a mutagenitásról.",
            "A WL + logisztikus regresszió ugyanazt a szerkezeti információt látja, mint a GIN, és kevés adaton kevesebb paraméterrel jól általánosít.",
            "A GIN bizonyítottan rosszabb molekulákra, mint a logisztikus regresszió.",
            "Az összeg-kiolvasás 1,2 pontos előnye bizonyítja, hogy molekulákra az összeg jobb, mint az átlag."
          ],
          answer: [0, 1, 2],
          hint: "Vesd össze a különbségeket a szórásokkal, és gondold végig, mit mond a 13.7 WL-tétele.",
          explain: "±7–10 pontos szórás mellett a 4,1 és az 1,2 pontos különbség sem bizonyít semmit – sem azt, hogy a GIN rosszabb, sem azt, hogy jobb. Az atomzsák 86%-a mutatja, hogy az összetétel sokat elárul. A WL-színek az üzenetküldés erejét képviselik (13.7), így a WL + LR a gráfos „klasszikus alapvonal”. A GNN előnye ott jön ki, ahol a szerkezet dönt és sok az adat (pl. a halicin-kísérlet 2335 molekulája)."
        },
        {
          type: "single", shuffle: true,
          q: "A Cora-n: GCN 82,2% ± 0,7, GraphSAGE 81,4% ± 0,5, GAT (8 fej) 82,6% ± 0,8 – 10 kezdéssel. Mit mondhatsz a három modellről?",
          options: [
            "A különbségek a kezdések szórásának nagyságrendjében vannak – ebből a mérésből nem lehet rangsort felállítani.",
            "A GAT a legjobb, hiszen neki a legmagasabb az átlaga.",
            "A GraphSAGE a leggyengébb, mert a mintavétel zajt visz a tanításba.",
            "A GAT kb. négyszer annyi paraméterrel csak 0,4 ponttal jobb, tehát túltanul."
          ],
          answer: 0,
          hint: "Mekkora a GCN és a GAT közti különbség a szórásokhoz képest?",
          explain: "A GAT és a GCN közti 0,4 pont kisebb, mint bármelyik szórás (0,7–0,8), a GraphSAGE 0,8 pontos lemaradása is alig nagyobb egy szórásnál. Ez egyezik az irodalommal: jól beállított GCN, GraphSAGE és GAT között a Cora-n a különbség a zaj szintjén van (13.8). A GAT valóban kb. négyszer annyi paraméterű (92 373 vs. 23 063), de a teszten nem rosszabb – túltanulásra ebből nem lehet következtetni."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai13-final": {
      title: "Fejezetzáró teszt – Gráf neurális hálók",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 4 csúcsú teljes gráfban (mindenki mindenkivel össze van kötve) mennyi $A^3$ főátlójának összege?`,
          options: ["24", "4", "12", "8"],
          answer: 0,
          hint: "Hány háromszög van a gráfban, és hányszor számol meg egy háromszöget a főátló összege?",
          explain: R`A 4 csúcsból $\binom{4}{3} = 4$ háromszög választható. A főátló összege minden háromszöget 3 kezdőcsúcsból és 2 irányban számol: $4 \cdot 6 = 24$ (csúcsonként $(A^3)_{vv} = 6$). A 4 maga a háromszögszám, a 12 elfelejti a két irányt, a 8 a három kezdőcsúcsot.`
        },
        {
          type: "multi",
          q: "Egy közösségi oldalra naponta új felhasználók érkeznek; mindegyikről tudod az életkorát, az érdeklődését és az első néhány ismerősét. Melyik módszer ad nekik vektort / jóslatot újratanítás nélkül?",
          options: [
            "GraphSAGE a valódi jellemzőkön",
            "GCN a valódi jellemzőkön (életkor, érdeklődés)",
            "kézi gráfjellemzők (fokszám, klaszterezettség) + logisztikus regresszió",
            "DeepWalk-beágyazás (véletlen séta + word2vec)",
            "GCN „kicsoda” one-hot jellemzővel, mint a karateklubon"
          ],
          answer: [0, 1, 2],
          hint: "Függvényt tanul-e a módszer (jellemzőkből vektort), vagy csúcsonként egy táblázatsort?",
          explain: "A GraphSAGE és a valódi jellemzőkön futó GCN szabályt tanul: a vektort a jellemzőkből és a szomszédokból számolja, ez új csúcsra is működik (induktív). A kézi jellemzők az új csúcsra is kiszámolhatók. A DeepWalk csúcsonként egy szabad vektort tanul – új csúcsnak nincs sora. A one-hot „kicsoda” jellemző ugyanígy transzduktív: az új tagnak nincs oszlopa (13.4)."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik molekulaszintű jellemző permutációinvariáns (nem függ az atomok számozásától)?",
          options: [
            "a csúcsvektorok összege két GCN-réteg után",
            "az 1. sorszámú atom vektora két GCN-réteg után",
            "a csúcsvektorok sorszám szerinti egymás után fűzése két GCN-réteg után",
            "minden csúcsnál a szomszédok vektorainak sorszám szerinti összefűzése, majd ezek összege a csúcsokon"
          ],
          answer: 0,
          hint: "Ekvivariáns réteg + invariáns összegzés = ? Hol lép be a sorszám a többi opcióban?",
          explain: "A GCN-rétegek ekvivariánsak, a csúcsokon vett összeg invariáns – együtt invariáns modellt adnak (13.2, 13.6). Az 1. atom attól függ, ki kapta az 1-es sorszámot; a sorszám szerinti összefűzés is sorrendfüggő. Az utolsó opcióban már a gyűjtés sorrendfüggő, így a csúcsvektorok sem ekvivariánsak – ezen a végső összeg sem segít."
        },
        {
          type: "single", shuffle: true,
          q: "Egy úthálózaton a kérdésre adott válasz egy 6 ugrásnyira lévő csúcs állapotán múlik, a modelled 3 rétegű GNN. Mi segíthet?",
          options: [
            "Több réteg vagy hosszú élek / virtuális csúcs, hogy az információ elérjen a csúcsig.",
            "Sokkal több tanítóadat – elég példából a 3 rétegű háló is megtanulja.",
            "Nagyobb rejtett dimenzió (pl. 16 helyett 256 neuron rétegenként).",
            "Átlag helyett összeg-gyűjtés, mert az összeg érzékenyebb."
          ],
          answer: 0,
          hint: "Mekkora a 3 rétegű GNN recepciós mezője? Mi van azon túl?",
          explain: "$k$ réteg = $k$ ugrás: ami 3 ugráson túl van, az a csúcs vektorában nem jelenhet meg – akárhány adat, akárhány neuron vagy akármilyen gyűjtés mellett. Segít a több réteg (túlsimítás-kockázattal), a hosszú élek vagy a durvább, hierarchikus gráf (GraphCast), illetve a virtuális csúcs, amelyen át bárki két lépésben elér bárkit (13.3, 13.7)."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy GCN-ben a $u$ csúcsnak 15, a $v$ csúcsnak 3 szomszédja van (önhurok nélkül számolva), és él köti össze őket. Mekkora súllyal kerül $\mathbf h_u$ a $v$ gyűjtésébe?`,
          options: ["0,125", "0,149", "0,250", "0,016"],
          answer: 0,
          hint: R`$1/\sqrt{\hat d_u\,\hat d_v}$, ahol $\hat d = \deg + 1$.`,
          explain: R`Önhurokkal $\hat d_u = 16$, $\hat d_v = 4$: $1/\sqrt{64} = 0{,}125$. A 0,149 az önhurkot felejti el ($1/\sqrt{45}$), a 0,250 az önhurkos átlag súlya (csak a fogadó fokszámával oszt, $1/4$), a 0,016 a gyököt hagyja le ($1/64$).`
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a hozzá illő gyűjtéssel!",
          pairs: [
            ["Hány nitrocsoport kapcsolódik egy atomhoz?", "összeg"],
            ["A barátok hányad része szavaz egy pártra?", "átlag"],
            ["Van-e ismert csaló a számla partnerei között?", "maximum"],
            ["A szomszédok fontossága a tartalmuktól függ.", "figyelem (GAT)"]
          ],
          hint: "Darabszám, arány, előfordulás – és mi van, ha a súlyokat tanulni kell?",
          explain: "Darabszámhoz összeg kell (csak az különbözteti meg az {N} és az {N, N} szomszédságot). Arányhoz átlag – egy sok barátú embernél is az arány számít, nem a darabszám. Ha az a kérdés, előfordul-e valami, a maximum a legtisztább (az átlag egy csalót 100 tisztességes partner közt 0,01-re hígít). Ha a szomszédok súlya a tartalmuktól függ, figyelem tanulja meg (13.5)."
        },
        {
          type: "single", shuffle: true,
          q: "Egy gyógyszercég a modelljét új vegyületcsaládok szűrésére akarja használni. Véletlen felosztáson 92%-ot, vázfelosztáson (scaffold split) 78%-ot mértél. Melyik számot közlöd várható teljesítményként?",
          options: [
            "A 78%-ot: a vázfelosztás teszt-vázait a modell nem látta, mint a valóságban az új családokat.",
            "A 92%-ot: a véletlen felosztás az elfogadott szabvány, és több adatot használ.",
            "A kettő átlagát (85%), mert mindkettő egy-egy torzított becslés.",
            "Egyiket sem: molekuláknál csak időbeli felosztás ad korrekt becslést."
          ],
          answer: 0,
          hint: "Melyik felosztás tesztje hasonlít jobban arra, amire a modellt használni fogják?",
          explain: "Véletlen felosztásnál a tesztmolekulák „testvérei” (azonos vázzal) a tanítóban vannak – a modell a hasonlóságot ismeri fel, ez túl optimista. A vázfelosztás új vázakat tesz a tesztbe, ahogy a valóságban az új családok érkeznek – ez a becsületes becslés (13.6). Az átlagnak nincs értelme; az időbeli vágás az időben változó gráfoknál (közösségi háló, tranzakciók) kell."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik két gráfot tudja megkülönböztetni egy jellemzők nélküli üzenetküldő GNN (pl. GIN)?",
          options: [
            "a 4 csúcsú utat és a 4 csúcsú csillagot",
            "a hatszöget és a két különálló háromszöget",
            "a 8 csúcsú kört és a két különálló négyzetet",
            "a dekalint és a biciklopentilt (hidrogén nélkül, csak szénatomok)"
          ],
          answer: 0,
          hint: "Futtasd fejben az 1-WL első körét: milyen fokszámok vannak a két gráfban?",
          explain: "Az út fokszámai (1, 2, 2, 1), a csillagé (3, 1, 1, 1) – az 1-WL már az 1. körben szétválasztja őket, tehát egy GIN is. A hatszögben és a két háromszögben, illetve a 8-körben és a két négyzetben minden csúcsnak két ugyanolyan szomszédja van: a színezés nem finomodik, a hisztogram egyforma. A dekalin és a biciklopentil (11 kötés, 2 atom három, 8 atom két szomszéddal) is WL-egyforma. A tétel szerint amit az 1-WL nem lát, azt egyetlen üzenetküldő GNN sem."
        },
        {
          type: "single", shuffle: true,
          q: R`Csillaggráf: egy középpont 3 levéllel, kezdőértékek $x = (4;\ 0;\ 0;\ 0)$ (a középpont 4). Mi lesz minden csúcs értéke nagyon sok önhurkos átlagolás ($\hat D^{-1}\hat A$) után?`,
          options: ["1,6", "1,0", "2,0", "0"],
          answer: 0,
          hint: "A határérték nem a sima átlag, hanem az önhurkos fokszámmal súlyozott átlag.",
          explain: R`Az önhurkos fokszámok: középpont 4, levelek 2–2–2. A határérték $\dfrac{4 \cdot 4 + 2 \cdot 0 + 2 \cdot 0 + 2 \cdot 0}{4 + 2 + 2 + 2} = \dfrac{16}{10} = 1{,}6$ – minden csúcson (túlsimítás). Az 1,0 a sima átlag ($4/4$), a 2,0 a levelek értéke egy lépés után, a 0 azt feltételezi, hogy az átlagolás „kioltja” a jelet – de az összeg (súlyozva) megmarad.`
        },
        {
          type: "multi",
          q: "Mely állítások igazak a gráf-Transformerekre?",
          options: [
            "Pozíciókódolás nélkül az önfigyelem-réteg permutációekvivariáns, de nem tudja, ki kinek a szomszédja.",
            "A véletlen séta visszatérési valószínűségei (RWSE) a számozástól független pozíciókódolást adnak.",
            "A GPS-rétegben egy helyi üzenetküldő ág és egy globális figyelemág fut egymás mellett, az eredményük összeadódik.",
            "A csúcsok sorszáma (1, 2, …, n) jó pozíciókódolás, ugyanúgy, mint a mondatok tokenjeinél.",
            "A Laplace-sajátvektor előjele egyértelmű, ezért úgy, ahogy van, jellemzőnek adható."
          ],
          answer: [0, 1, 2],
          hint: "Melyik kódolás jön csak a szerkezetből, és melyik függ valamilyen önkényes választástól?",
          explain: "Az önfigyelem üzenetküldés a teljes gráfon: ekvivariáns, de a szerkezetet vissza kell kódolni. Az RWSE a gráfból számolt valószínűség – nem függ a számozástól. A GPS két ága (helyi MPNN + globális figyelem) összeadódik, utána FFN jön. A sorszám a számozástól függ (az MLP hibája jönne vissza), a Laplace-sajátvektor előjele pedig önkényes – ezért tanításkor véletlenszerűen átfordítják (13.8)."
        },
        {
          type: "single", shuffle: true,
          q: "Az egyes atomokra ható erőket akarod jósolni egy 3D-s molekulán. Melyik felépítés helyes?",
          options: [
            "Egy invariáns háló az energiát jósolja a távolságokból, az erő ennek negatív gradiense – ez automatikusan ekvivariáns.",
            "Egy csak távolságokat látó invariáns háló közvetlenül kiadja az erővektor három komponensét.",
            "MLP a nyers koordinátákon, véletlen forgatásokkal bővítve – ez garantálja az ekvivarianciát.",
            R`EGNN-szerű frissítés, de a különbségvektor helyett az abszolút koordinátákkal: $\mathbf x_i' = \mathbf x_i + \sum_j \mathbf x_j\,\phi(\ldots)$.`
          ],
          answer: 0,
          hint: "Az erő vektor: a molekulával együtt kell elfordulnia. Melyik konstrukció garantálja ezt?",
          explain: R`Ha $E(R\mathbf x) = E(\mathbf x)$, a láncszabály szerint $\nabla E(R\mathbf x) = R\,\nabla E(\mathbf x)$: az invariáns energia gradiense ekvivariáns erő (13.9). Egy invariáns háló kimenete forgatáskor nem változik – az erő iránya így rossz lenne. Az adatbővítés csak közelít, nem garantál. Az abszolút koordinátákkal az eltolás nem esik ki: $\sum_j (\mathbf x_j + \mathbf t)\phi$ nem egyszerűen $\mathbf t$-vel tolódik el.`
        },
        {
          type: "set",
          q: "Jelöld ki azokat a rendszereket, amelyekben tanult üzenetküldés (GNN vagy gráfon futó figyelem) fut!",
          items: [
            "GraphCast (időjárás)",
            "Chemprop (a halicin megtalálása)",
            "PinSage (ajánlás a Pinteresten)",
            "GraphRAG (visszakeresés tudásgráfból)",
            "Pangu-Weather (időjárás)",
            "LLM-prompt, amelyben a gráf éllistaként szerepel"
          ],
          answer: ["GraphCast (időjárás)", "Chemprop (a halicin megtalálása)", "PinSage (ajánlás a Pinteresten)"],
          hint: "Van-e a rendszerben tanuló háló, amely egy gráf élei mentén gyűjt? A „gráf” szó a névben nem elég.",
          explain: "A GraphCast 16 üzenetküldő réteget futtat egy gömbhálón, a Chemprop irányított élekkel dolgozó MPNN, a PinSage a GraphSAGE ipari változata. A GraphRAG-ban a gráf csak index, amelyet egy LLM épít és olvas – tanult üzenetküldés nincs benne. A Pangu-Weather 3D-s Transformer rácson, nem gráfon. Az éllistás promptban az LLM tokensorozatot lát, nem gráfot (13.10)."
        },
        {
          type: "single", shuffle: true,
          q: "Saját, 150 molekulás adatkészleten (tízszeres keresztvalidáció) a GIN 84% ± 9, az atomzsák + logisztikus regresszió 82% ± 8 pontosságot ér el. Mi a helyes következtetés?",
          options: [
            "A 2 pontos különbség jóval kisebb a szórásnál: ebből a mérésből a GIN előnye nem bizonyított.",
            "A GIN jobb, mert a pontossága magasabb.",
            "Az atomzsák jobb, mert kisebb a szórása.",
            "A GIN-t kell választani, mert az 1-WL-teszt erejéig kifejező."
          ],
          answer: 0,
          hint: "Hány molekula van egy hajtásban, és mennyit ér közülük egy?",
          explain: "Egy hajtásban 15 molekula van, egy molekula 6,7 százalékpont – a 2 pontos különbség kevesebb egyetlen molekulánál, a szórás pedig 8–9 pont. Ugyanez volt a MUTAG-on (86,0% vs. 81,9%, ±7–10): a különbség nem bizonyít semmit egyik irányban sem. A kisebb szórás sem tesz jobbá egy modellt, a kifejezőerő pedig nem jelenti, hogy kevés adatból meg is tanulja (13.7, 13.11)."
        },
        {
          type: "match",
          q: "Melyik eszköz illik a feladathoz? (A fejezet döntési táblázata alapján.)",
          pairs: [
            ["Egy fehérje 3D-szerkezetéből egy kötőzseb energiáját kell jósolni.", "távolságokra épülő invariáns 3D-s GNN"],
            ["Milliárd csúcsú, folyamatosan bővülő felhasználói gráf, mini-kötegek.", "GraphSAGE mintavétellel"],
            ["Hivatkozási háló, témánként néhány címke, homofil gráf.", "GCN, címketerjesztés-alapvonallal"],
            ["Tranzakciós háló, ahol a szomszédok jellemzően különböző típusúak.", "külön saját és szomszéd súly (GraphSAGE, GIN)"],
            ["Hány háromszög van egy 1000 csúcsú gráfban?", "klasszikus gráfalgoritmus"],
            ["A csúcsok hosszú szöveges leírások (termékek, cikkek).", "nyelvi modellel kódolt jellemzők + GNN"]
          ],
          hint: "Minden sornál kérdezd meg: milyen az adat (3D, szöveg), mekkora a gráf, homofil-e, és tanulni kell-e egyáltalán?",
          explain: "Az energia forgatásra invariáns – távolságokra épülő háló kell. Óriási, bővülő gráfhoz mintavételes, induktív GraphSAGE. Kevés címkéhez, homofil gráfhoz GCN – a címketerjesztéshez mérve. Heterofil gráfon a GCN átlaga félrevezet, a külön saját súly segít. Az algoritmikus kérdést egy program hibátlanul megoldja – se nem GNN, se nem LLM. Szöveges csúcsoknál a nyelvi modell beágyazása + GNN az egyik legolcsóbb erős recept."
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
