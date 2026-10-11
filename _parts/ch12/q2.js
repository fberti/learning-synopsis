    /* ------------------------------------------------ 12.5 */
    "ai12-125": {
      title: "Kvíz – 12.5 Önfigyelem",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az A mondat: fa $= (2;\ 0)$, levél $= (1;\ 1)$, hullik $= (1;\ 0)$; $W_Q = W_K = W_V$ = egységmátrix, $d = 2$. Mennyi a „hullik” súlysora (a fára, a levélre, a hullikra)?`,
          options: [R`$(0{,}503;\ 0{,}248;\ 0{,}248)$`, R`$(0{,}576;\ 0{,}212;\ 0{,}212)$`, R`$(0{,}407;\ 0{,}150;\ 0{,}150)$`, R`$(0{,}164;\ 0{,}198;\ 0{,}248)$`],
          answer: 0,
          hint: R`Pontszám skaláris szorzattal, osztás $\sqrt 2$-vel, aztán softmax – a „hullik” a lekérdező, tehát az ő sorát keresed.`,
          explain: R`Pontszámok: hullik·fa $= 2$, hullik·levél $= 1$, hullik·hullik $= 1$; $\sqrt 2$-vel osztva $1{,}414;\ 0{,}707;\ 0{,}707$; softmax: $(0{,}503;\ 0{,}248;\ 0{,}248)$. A $(0{,}576;\ 0{,}212;\ 0{,}212)$ kihagyja a skálázást, a $(0{,}407;\ 0{,}150;\ 0{,}150)$ a softmax <em>után</em> oszt (ezért az összege már nem 1). A $(0{,}164;\ 0{,}198;\ 0{,}248)$ a súlymátrix „hullik” <b>oszlopa</b>: azt mutatja, ki mennyire figyel a hullikra – ennek az összege sem 1.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az önfigyelemre?",
          options: [
            "A súlymátrix minden sorának összege 1.",
            "A kimenet ugyanannyi vektor, ahány token a bemenet.",
            R`A keverési súlyokat minden mondatra újra kiszámoljuk; csak $W_Q$, $W_K$, $W_V$ rögzített.`,
            "Minden token önmagára kapja a legnagyobb súlyt – ez szabály.",
            "A súlymátrix minden oszlopának összege is 1."
          ],
          answer: [0, 1, 2],
          hint: "Melyik irányban hat a softmax? És mitől függ, hogy ki kire figyel?",
          explain: R`A softmax soronként (lekérdezésenként) hat, így a sorok összege 1; az oszlopoké bármi lehet – egy fontos szóra többen is figyelhetnek. Az önfigyelem nem összegzi a mondatot: minden token kap egy új, kontextusfüggő vektort. A súlyok bemenetfüggők, ellentétben egy teljesen összekötött réteg rögzített súlyaival. Az, hogy a szó önmagára figyel a legjobban, csak $W_Q = W_K$ mellett gyakori; tanult, különböző mátrixokkal egy fej akár szinte csak a szomszédra figyelhet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legyen $W_V$ az egységmátrix, $W_Q$ és $W_K$ viszont csupa nulla. Mit csinál ekkor az önfigyelem?`,
          options: [
            "Minden token új vektora a mondat összes vektorának átlaga lesz.",
            "Minden token a saját vektorát kapja vissza változatlanul.",
            "Minden kimenet nullvektor lesz.",
            "Minden token csak az első tokenre figyel."
          ],
          answer: 0,
          hint: R`Mennyi lesz minden pontszám? És mit ad a softmax, ha minden bemenete egyenlő?`,
          explain: R`Minden lekérdezés és kulcs nullvektor, így minden pontszám 0, a softmax pedig egyenlő súlyokat ad: $1/n$. A kimenet az értékek (itt a bemeneti vektorok) sima átlaga – ez a 12.3 átlagoló modellje. A nullvektor kimenet akkor jönne, ha $W_V$ lenne nulla; a „saját vektor” akkor, ha mindenki csak magára figyelne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két token: $\mathbf x_1 = (2;\ 0)$, $\mathbf x_2 = (0;\ 2)$; minden $W$ az egységmátrix, $d = 2$. Mi az első token új vektora?`,
          options: [R`$(1{,}888;\ 0{,}112)$`, R`$(1{,}964;\ 0{,}036)$`, R`$(1{,}389;\ 0{,}025)$`, R`$(1{,}762;\ 0{,}238)$`],
          answer: 0,
          hint: R`Pontszámok: $\mathbf x_1 \cdot \mathbf x_1$ és $\mathbf x_1 \cdot \mathbf x_2$. Mivel kell osztani, és mikor?`,
          explain: R`Pontszámok $4$ és $0$; $\sqrt 2$-vel osztva $2{,}828$ és $0$; softmax: $(0{,}944;\ 0{,}056)$; új vektor $0{,}944\cdot(2;0) + 0{,}056\cdot(0;2) = (1{,}888;\ 0{,}112)$. Skálázás nélkül $(1{,}964;\ 0{,}036)$ – keményebb súlyok. A $(1{,}389;\ 0{,}025)$ a softmax után oszt, így a súlyok összege már nem 1, és a vektor „összezsugorodik”. A $(1{,}762;\ 0{,}238)$ $d$-vel oszt $\sqrt d$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért osztjuk a pontszámokat $\sqrt{d_k}$-val a softmax előtt?`,
          options: [
            R`Mert a véletlen skaláris szorzatok szórása $\sqrt{d_k}$-val nő, és nagy pontszámokra a softmax szinte kemény kereséssé válik – a gradiens pedig szinte nulla lesz.`,
            "Hogy a súlyok összege 1 legyen.",
            "Hogy a kimeneti vektorok hossza 1 legyen.",
            "Mert a softmax csak 0 és 1 közötti bemenetet fogad el."
          ],
          answer: 0,
          hint: R`Mi történik a $\operatorname{softmax}(8;\ 16;\ 24)$-gyel a $\operatorname{softmax}(1;\ 2;\ 3)$-hoz képest?`,
          explain: R`$d_k$ darab, 1 szórású szorzat összegének szórása $\sqrt{d_k}$ ($d_k = 64$-nél kb. 8). A $\operatorname{softmax}(8;\ 16;\ 24) \approx (0{,}0000;\ 0{,}0003;\ 0{,}9997)$ – egy nyertes, a többi eldobva, és a háló alig tanul. Az 1-es összeget a softmax magától biztosítja; a kimenet hosszát a skálázás nem állítja be; a softmax bármilyen valós bemenetet elfogad.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy szöveg 1000 tokenről 3000 tokenre nő. Hányszor annyi figyelmi pontszámot kell kiszámolni (fejenként, rétegenként)?",
          options: ["9-szer annyit", "3-szor annyit", "6-szor annyit", "27-szer annyit"],
          answer: 0,
          hint: "Hány pontszám van egy n tokenes szövegben?",
          explain: R`A $QK^\top$ pontszámmátrix $n \times n$-es, így a pontszámok száma $n^2$: $3^2 = 9$-szeres. A 3-szoros a tokenenkénti rétegekre (pl. FFN) igaz, a 6-szoros $2 \cdot 3$ (összeadás négyzetre emelés helyett), a 27-szeres köbös növekedést feltételez. A FlashAttention a memóriát teszi lineárissá, a műveletek száma marad $n^2$-es.`
        },
        {
          type: "single", shuffle: true,
          q: R`$d = 1024$, $h = 16$ fej. Mekkora egy fej $d_k$-ja, és hány súlya van a többfejű figyelemrétegnek ($W_Q, W_K, W_V, W_O$, torzítás nélkül)?`,
          options: [R`$d_k = 64$; $4\,194\,304$`, R`$d_k = 64$; $67\,108\,864$`, R`$d_k = 64$; $3\,145\,728$`, R`$d_k = 16$; $4\,194\,304$`],
          answer: 0,
          hint: R`A fejek a $d$ dimenziót osztják fel egymás között. Ne felejtsd el a kimeneti $W_O$ mátrixot!`,
          explain: R`$d_k = d/h = 1024/16 = 64$, a súlyok száma $4d^2 = 4 \cdot 1024^2 = 4\,194\,304$ – ugyanannyi, mint egy teljes szélességű fejnél. A $67\,108\,864$ minden fejnek teljes $4d^2$-et ad ($\times 16$), a $3\,145\,728$ kihagyja $W_O$-t ($3d^2$), a $d_k = 16$ a fejek számát keveri össze a fej méretével.`
        },
        {
          type: "match",
          q: "Párosítsd a pozíciókezelést a leírásával!",
          pairs: [
            ["szinuszos pozíciókódolás", "rögzített sin/cos képlet, az eredeti Transformerben"],
            ["tanult pozícióvektorok", "táblázat, mint a szóbeágyazás (BERT, GPT-2); nem nyújtható hosszabb szövegre"],
            ["RoPE (forgatásos)", "rétegenként a lekérdezést és a kulcsot forgatja; a pontszám a távolságtól függ"],
            ["pozíció nélküli önfigyelem", "összekevert szavakra ugyanazt a mondatvektort adja, mint egy zsák"]
          ],
          hint: "Melyik adódik a bemenethez, melyik hat közvetlenül a pontszámra – és melyik nem tud a sorrendről semmit?",
          explain: R`A szinuszos kód képletből jön, nem tanuljuk. A tanult táblázat $n_{\max} \times d$-s, az 513. pozícióra egy 512-es táblázat nem tud mit mondani. A RoPE nem a bemenethez adódik: a $\mathbf q$-t és a $\mathbf k$-t forgatja, az értéket nem, így a pontszám a relatív távolságot „látja”. Pozíció nélkül a kísérlet Transformere a „de”-s mondatokon 49,5%-ot ért el – mint az átlagoló modell.`
        }
      ]
    },

    /* ------------------------------------------------ 12.6 */
    "ai12-126": {
      title: "Kvíz – 12.6 A Transformer",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy Transformer-blokknak $d = 256$ és $d_{\text{ff}} = 4d$ mellett (figyelem, FFN, két rétegnormalizálás, torzításokkal)?`,
          options: ["789 760", "786 432", "263 168", "525 568"],
          answer: 0,
          hint: R`Figyelem $4d^2 + 4d$, FFN $8d^2 + 5d$, két LN $4d$.`,
          explain: R`$12d^2 + 13d = 12 \cdot 65\,536 + 13 \cdot 256 = 786\,432 + 3328 = 789\,760$. A $786\,432$ csak a $12d^2$ (a torzítások és az LN paraméterei kimaradtak), a $263\,168$ csak a figyelem ($4d^2 + 4d$), az $525\,568$ csak az FFN ($8d^2 + 5d$) – ez a nagyobb rész.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normáld rétegnormalizálással ($\gamma = 1$, $\beta = 0$) a $(2;\ 2;\ 2;\ 6)$ tokenvektort!`,
          options: [R`$(-0{,}577;\ -0{,}577;\ -0{,}577;\ 1{,}732)$`, R`$(-0{,}5;\ -0{,}5;\ -0{,}5;\ 1{,}5)$`, R`$(-0{,}333;\ -0{,}333;\ -0{,}333;\ 1)$`, R`$(-1;\ -1;\ -1;\ 3)$`],
          answer: 0,
          hint: "Átlag, eltérések, szórásnégyzet (osztás a darabszámmal), aztán osztás a szórással.",
          explain: R`Átlag 3, eltérések $(-1;\ -1;\ -1;\ 3)$, szórásnégyzet $(1 + 1 + 1 + 9)/4 = 3$, szórás $\sqrt 3 \approx 1{,}732$. Eredmény: $(-0{,}577;\ -0{,}577;\ -0{,}577;\ 1{,}732)$. A $(-0{,}5;\ \ldots;\ 1{,}5)$ $n - 1$-gyel osztott a szórásnégyzetnél, a $(-0{,}333;\ \ldots;\ 1)$ a szórásnégyzettel osztott szórás helyett, a $(-1;\ \ldots;\ 3)$ csak középre tolt.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Transformer-blokkra?",
          options: [
            "Az előrecsatolt háló (FFN) tokenenként külön fut, minden tokenen ugyanazokkal a súlyokkal.",
            "Egy blokk paramétereinek nagyobb része az FFN-ben van, nem a figyelemben.",
            R`Utó-normalizálás: $\operatorname{LN}(\mathbf x + F(\mathbf x))$; elő-normalizálás: $\mathbf x + F(\operatorname{LN}(\mathbf x))$.`,
            "A rétegnormalizálás egy jellemzőt normál a köteg mintái között.",
            "Az FFN-en keresztül a tokenek információt cserélnek egymással."
          ],
          answer: [0, 1, 2],
          hint: "Hol „beszélgetnek” a tokenek, és hol „gondolkodik” mindegyik külön?",
          explain: R`Az FFN tokenenként fut ($8d^2$ súly), a figyelem $4d^2$ – az FFN a nagyobb. A két normalizálási sorrend nem egyenértékű; a GPT-2 óta az elő-normalizált a gyakoribb. A köteg mintái között a <b>kötegnormalizálás</b> normál; a rétegnormalizálás egy token $d$ jellemzőjét egymás között. A tokenek közti információcsere csak a figyelemben történik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány $-\infty$ elem van egy 8 tokenes kauzális maszkban?`,
          options: ["28", "36", "56", "64"],
          answer: 0,
          hint: "Melyik elemek kapnak −∞-t: a főátló fölöttiek, alattiak, vagy a főátló is?",
          explain: R`A főátló <b>fölötti</b> elemek ($j > i$): $7 + 6 + \ldots + 1 = 28$. A 36 a főátlót is maszkolja ($8 \cdot 9/2$) – akkor az első token semmire nem figyelhetne. Az 56 mindkét háromszöget, a 64 minden elemet számolja. A maszk többi 36 eleme 0.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 4 tokenes szöveg 2. tokenjének pontszámsora (skálázás után, maszk előtt): $(1;\ 3;\ 2;\ 0)$. Mi a súlysor kauzális maszkkal?`,
          options: [R`$(0{,}119;\ 0{,}881;\ 0;\ 0)$`, R`$(0{,}087;\ 0{,}644;\ 0{,}237;\ 0{,}032)$`, R`$(0;\ 0{,}705;\ 0{,}259;\ 0{,}035)$`, R`$(0{,}087;\ 0{,}644;\ 0;\ 0)$`],
          answer: 0,
          hint: R`A 3. és 4. token jövőbeli: $-\infty$-t kapnak a softmax <em>előtt</em>.`,
          explain: R`Maszk után a sor $(1;\ 3;\ -\infty;\ -\infty)$, softmax: $\operatorname{softmax}(1;\ 3) = (0{,}119;\ 0{,}881)$, a jövő súlya pontosan 0. A $(0{,}087;\ 0{,}644;\ 0{,}237;\ 0{,}032)$ maszk nélküli; a $(0;\ 0{,}705;\ \ldots)$ a rossz háromszöget maszkolja (a múltat tiltja); a $(0{,}087;\ 0{,}644;\ 0;\ 0)$ a softmax <em>után</em> nulláz – a súlyok összege így csak 0,731.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi igaz egy maszkolt (dekódoló) Transformer tanítására és szöveggenerálására?",
          options: [
            "Tanításkor egyetlen menetben minden hely jóslását kiszámolja; generáláskor tokenenként halad.",
            "Tanításkor is tokenenként halad, mert a maszk miatt a jövőt nem látja.",
            "Generáláskor kikapcsoljuk a maszkot, hiszen úgysincs jövő.",
            "Generáláskor a maszk miatt az egész választ egyszerre írja meg."
          ],
          answer: 0,
          hint: "Tanításkor a teljes szöveg ismert. Generáláskor létezik-e már a következő token?",
          explain: "Tanításkor a szöveg megvan: a maszk gondoskodik róla, hogy egy menetben minden hely csak a múltat lássa – mind tanítójel, párhuzamosan. Generáláskor a következő token még nem létezik: jósol egyet, hozzáfűzi, újra jósol (autoregresszió). A maszk a modell része, generáláskor is: a már leírt tokenek vektorai nem változhatnak meg a később jövőktől."
        },
        {
          type: "match",
          q: "Párosítsd a modellt a jellemzőjével!",
          pairs: [
            ["BERT", "kétirányú figyelem, a tokenek 15%-át kell kitalálnia"],
            ["GPT", "kauzális maszk, a következő tokent jósolja"],
            ["az eredeti Transformer, T5", "kódoló és dekódoló, keresztfigyelemmel"],
            ["RoBERTa", "megmutatta, hogy a következő mondat jóslása (NSP) elhagyható"]
          ],
          hint: "Melyik család generál szöveget, melyik tölt ki lyukat, és melyik köti össze a kettőt?",
          explain: "A BERT csak kódoló: kétirányú, a maszkolt tokeneket találja ki – osztályozásra, keresésre jó, generálásra nem. A GPT csak dekódoló: kauzális maszk, következő token – ez a mai nagy nyelvi modellek alapja. Az eredeti Transformer (és a T5, BART) kódoló–dekódoló, fordításra, összefoglalásra. A RoBERTa (2019) a BERT receptjét javította, NSP nélkül."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 300 tokenes szövegben a BERT hány tokent cserél <code>[MASK]</code>-ra (átlagosan)?`,
          options: ["36", "45", "240", "9"],
          answer: 0,
          hint: "Először kiválasztja a tokenek egy részét; ezeknek csak egy része kap [MASK]-ot.",
          explain: R`$0{,}15 \cdot 300 = 45$ tokent választ ki; ezek 80%-a, $0{,}8 \cdot 45 = 36$ kap <code>[MASK]</code>-ot, 10% (4,5) véletlen tokent, 10% változatlan marad. A 45 az összes kiválasztott, a 240 a 80%-ot a teljes szövegre veszi, a 9 a kiválasztottak nem maszkolt 20%-a.`
        }
      ]
    },

    /* ------------------------------------------------ 12.7 */
    "ai12-127": {
      title: "Kvíz – 12.7 Miért nyert a Transformer?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány egymásra váró lépés kell egy 3 rétegű RNN-nek és egy 3 rétegű Transformernek egy 100 tokenes szöveg feldolgozásához (tanításkor)?",
          options: ["RNN: 102, Transformer: 3", "RNN: 300, Transformer: 3", "RNN: 100, Transformer: 1", "RNN: 102, Transformer: 300"],
          answer: 0,
          hint: R`Az RNN következő rétegének $t$-edik lépése az előző réteg $t$-edik lépésére vár – nem az egész rétegre. A Transformer rétegében minden token egyszerre számolható.`,
          explain: R`RNN: rétegenként 100 lépés, de a rétegek „egymásra csúsznak”: a legrövidebb út $100 + 2 = 102$ lépés. Transformer: rétegenként egy lépés (minden token egyszerre), összesen 3. A 300 nem veszi észre, hogy a rétegek átfedhetnek; a „100 és 1” egyetlen réteget számol; a Transformernél a tokenenkénti 300 lépés pont az, amit a párhuzamosság megspórol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy blokkban a vetítések és az FFN kb. $12\,n d^2$, a figyelem pontszámai és keverése kb. $2\,n^2 d$ szorzás. $d = 512$-nél kb. hány token fölött viszi a figyelem a nagyobb részt?`,
          options: ["3072", "6144", "2048", "512"],
          answer: 0,
          hint: R`Írd fel: $2n^2 d > 12 n d^2$, és oszd el mindkét oldalt $2nd$-vel.`,
          explain: R`$2n^2 d > 12 n d^2 \iff n > 6d = 3072$. A 6144 elhagyja a $2$-es szorzót ($n^2 d > 12nd^2$), a 2048 csak az FFN $8nd^2$-ét veszi (a vetítéseket kihagyja), az 512 naivan $n > d$-t ír. A szokásos néhány száz tokenes szövegeknél tehát a munka nagyja nem a figyelemben, hanem a tokenenkénti szorzásokban van.`
        },
        {
          type: "set",
          q: R`Melyik nő a szöveg hosszával ($n$) egy önfigyelem-rétegben (tanításkor, FlashAttention nélkül)?`,
          items: ["a műveletek száma", "a pontszámmátrix memóriaigénye", "az egymásra váró lépések száma", "két token közti út hossza", "a réteg paramétereinek száma"],
          answer: ["a műveletek száma", "a pontszámmátrix memóriaigénye"],
          hint: "Mi függ n-től a táblázatban (műveletek, egymás utáni lépések, út)? És függnek-e a súlymátrixok n-től?",
          explain: R`A műveletek száma $\sim n^2 d$, a pontszámmátrix $n \times n$-es – mindkettő négyzetesen nő. Az egymás utáni lépések száma 1, két token között az út 1 lépés, akármilyen hosszú a szöveg – ez a Transformer előnye. A paraméterek ($W_Q, W_K, W_V, W_O$) nem függnek $n$-től. Vigyázz: „a hossz mindegy” csak a lépések számára igaz.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["előtanítás", "önfelügyelt feladat óriási címkézetlen szövegen"],
            ["jellemzőkinyerés", "a modell súlyai fixek, csak a ráépített kis osztályozót tanítjuk"],
            ["finomhangolás", "az egész modellt továbbtanítjuk a feladat adatain, kis tanulási rátával"],
            ["promptolás", "a feladatot szövegként, néhány példával adjuk meg, súlymódosítás nélkül"]
          ],
          hint: "Melyiknél változnak a modell súlyai, és melyiknél egyáltalán nem?",
          explain: "Előtanításkor a címke magából a szövegből jön (következő vagy maszkolt token). Utána három út: jellemzőkinyerésnél csak a ráépített réteg tanul, finomhangolásnál az egész modell, promptolásnál egyik sem – a feladat a bemeneti szövegben van."
        },
        {
          type: "single", shuffle: true,
          q: "Egy cégnek 2000 címkézett ügyfélpanasza van, ezeket kell osztályozni. Mivel érdemes kezdeni?",
          options: [
            "TF-IDF + logisztikus regresszióval mint alapvonallal; csak akkor továbblépni, ha a mért különbség megéri.",
            "Rögtön finomhangolt BERT-tel, mert az IMDB-n 93%-ot ért el a TF-IDF 89,7%-ával szemben.",
            "Egy GPT-szerű modell előtanításával a 2000 panaszon.",
            "Kétirányú LSTM-mel, mert az mindig jobb a TF-IDF-nél."
          ],
          answer: 0,
          hint: "Mit mond a hüvelykujjszabály: mit mérj meg először?",
          explain: R`„Ne azért válassz BERT-et, mert menő.” Az olcsó alapvonal percek alatt kész, és ehhez mérheted a többit. A 93% vs. 89,7% (kb. 3,3 százalékpont) ráadásul eltérő protokollal mért (egy 90/10-es felosztás vs. 5-szörös keresztvalidáció). Előtanításhoz 2000 panasz nevetségesen kevés – arra óriási szöveg kell. A kétirányú LSTM az IMDB-n 89,5%-kal a TF-IDF (89,7%) szintjén volt, nem fölötte.`
        },
        {
          type: "single", shuffle: true,
          q: R`$L \propto N^{-0{,}076}$ mellett hányszorosára változik a veszteség, ha a modell 100-szor nagyobb (adat és számítás bőven van)?`,
          options: ["0,705", "0,839", "0,924", "0,010"],
          answer: 0,
          hint: R`Számold ki $100^{-0{,}076}$-ot – vagy $\left(10^{-0{,}076}\right)^2$-et.`,
          explain: R`$100^{-0{,}076} = (10^{-0{,}076})^2 \approx 0{,}839^2 \approx 0{,}705$ – kb. 30%-kal kisebb veszteség, kétszeres nagyságrendnyi méretnövelésért. A 0,839 a tízszeres modell. A 0,924 $1 - 0{,}076$: mintha a kitevő egy „lineáris” csökkenés lenne. A 0,010 a „duplázás felezi a veszteséget” tévhit ($0{,}5^{\log_2 100}$) – a mért törvény szerint a duplázás kb. 5%.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 10 milliárd paraméteres modellt a Chinchilla-szabály szerint tanítunk. Kb. mennyi a tanítás számításigénye a $C \approx 6ND$ szabállyal?`,
          options: [R`$1{,}2 \cdot 10^{22}$`, R`$2 \cdot 10^{21}$`, R`$6 \cdot 10^{20}$`, R`$2{,}4 \cdot 10^{23}$`],
          answer: 0,
          hint: "Előbb a tokenek száma: hány token jut egy paraméterre?",
          explain: R`$D = 20N = 2 \cdot 10^{11}$ token; $C \approx 6 \cdot 10^{10} \cdot 2 \cdot 10^{11} = 1{,}2 \cdot 10^{22}$ művelet. A $2 \cdot 10^{21}$ elhagyja a 6-os szorzót, a $6 \cdot 10^{20}$ $D = N$-nel számol (elfelejti a 20-at), a $2{,}4 \cdot 10^{23}$ kétszer szoroz 20-szal.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a skálázásra és a Transformer korlátaira?",
          options: [
            "A skálázási törvény tapasztalati illesztés egy adott tartományban, nem természeti törvény.",
            "A Transformer kevés dolgot feltételez az adatról (gyenge induktív torzítás), ezért sok adat kell neki.",
            "A Llama 3 8B szándékosan sokkal több tokenen tanult, mint a Chinchilla-optimum: drágább tanítás, olcsóbb használat.",
            "Kétszer nagyobb modell nagyjából a felére csökkenti a veszteséget.",
            "A FlashAttention a figyelem műveletszámát is lineárissá teszi."
          ],
          answer: [0, 1, 2],
          hint: R`Számold ki $2^{-0{,}076}$-ot. És mit takarít meg a FlashAttention: időt vagy memóriát?`,
          explain: R`A skálázási törvény egy tartományban illesztett tapasztalati szabály; nem mondja meg, mikor jelenik meg egy képesség. A Transformernek nincs beépített lokalitása (mint a konvolúciónak), ezt az adatból kell megtanulnia. A Llama 3 8B kb. 1900 tokent látott paraméterenként (a Chinchilla 20-at ajánl). A duplázás $2^{-0{,}076} \approx 0{,}949$-szeresre csökkenti a veszteséget – kb. 5%, nem felezés. A FlashAttention a memóriát teszi lineárissá, a műveletek száma $n^2$-es marad.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai12-final": {
      title: "Fejezetzáró teszt – 12. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 12.1 négy kritikájában D1 = „a film jó volt”, D3 = „a zene unalmas volt”, $\text{idf}(t) = \ln(4/\text{df}(t))$ (df: a: 4, film: 3, jó: 2, volt: 3, zene, unalmas: 1). Mennyi D1 és D3 koszinusz-hasonlósága TF-IDF-vektorokkal?`,
          options: ["0,052", "0,500", "0,318", "0,780"],
          answer: 0,
          hint: "Csak a közös szavak adnak tagot a skaláris szorzatba. Mennyi az „a” súlya?",
          explain: R`Közös szavak: „a” (idf $= \ln 1 = 0$) és „volt” ($0{,}288$). Skaláris szorzat $0{,}288^2 \approx 0{,}083$; a hosszak $\approx 0{,}804$ és $\approx 1{,}982$; $\cos \approx 0{,}052$. A 0,5 a sima szózsák koszinusza (a semmitmondó „a” és „volt” sokat számít), a 0,318 a scikit-learn-féle $\ln\frac{1+N}{1+\text{df}} + 1$ idf-fel jön ki, a 0,780 idf helyett df-fel szoroz (a gyakori szót jutalmazza). Tízes alapú logaritmussal ugyanúgy 0,052 lenne – a koszinusz a nyújtásra érzéketlen.`
        },
        {
          type: "set",
          q: R`Egy „…, de …” kritikában felcseréled a két tagmondatot (pl. „a film jó volt , de a vége unalmas volt” → „a vége unalmas volt , de a film jó volt”). Melyik modell kimenete marad <b>hajszálpontosan</b> ugyanaz?`,
          items: ["szózsák + logisztikus regresszió", "TF-IDF + logisztikus regresszió", "átlagolt beágyazás + MLP", "Transformer pozíció nélkül", "RNN", "LSTM", "Transformer tanult pozícióvektorokkal"],
          answer: ["szózsák + logisztikus regresszió", "TF-IDF + logisztikus regresszió", "átlagolt beágyazás + MLP", "Transformer pozíció nélkül"],
          hint: "Melyik modell látja a tokenek sorrendjét – rekurzióval vagy pozícióvektorral?",
          explain: R`A szózsák és a TF-IDF csak számol, az átlag csak összead – a sorrend mindháromnál elvész. A pozíció nélküli önfigyelem összekevert bemenetre összekevert kimenetet ad, amit a végén átlagolunk: ugyanaz (ezért 49,5% a „de”-s mondatokon). Az RNN és az LSTM szóról szóra olvas, a pozícióvektoros Transformer tudja, hol áll a token – ezek ítélete megfordul.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 12.2 hatmondatos együttes-előfordulási táblájában (darabszámok; oszlopok: tejet, vizet, iszik, egeret, labdát, kerget, benzint, fogyaszt) a macska sora $(1, 0, 1, 1, 0, 1, 0, 0)$, a kutyáé $(0, 1, 1, 0, 1, 1, 0, 0)$. Hozzáveszünk egy hetedik mondatot: „a kutya tejet iszik”. Mennyi most a macska–kutya koszinusz?`,
          options: ["0,707", "0,671", "0,500", "0,750"],
          answer: 0,
          hint: "A kutya sorában két szám változik – az egyik 2 lesz. A hossz is megváltozik!",
          explain: R`Kutya: $(1, 1, 2, 0, 1, 1, 0, 0)$. Skaláris szorzat $1 + 2 + 1 = 4$, hosszak $2$ és $\sqrt 8 \approx 2{,}828$: $\cos \approx 0{,}707$. A 0,671 az „iszik”-et 1-nek hagyja (0/1 táblázat), a 0,5 a régi érték, a 0,75 a régi hosszakkal osztja a régi szorzatot plusz egyet. A tanulság: egy közös környezet „közelebb húzza” a két szót.`
        },
        {
          type: "single", shuffle: true,
          q: "Az 50 dimenziós GloVe-vektorokkal a king − man + woman vektorhoz melyik szó van a legközelebb?",
          options: [
            "A king (0,886); a queen (0,861) csak akkor nyer, ha a bemeneti szavakat kizárjuk.",
            "A queen (0,861) – a vektoraritmetika mindig kiadja az analógiát.",
            "A woman, mert a hozzáadott vektor a legnagyobb.",
            "Egyik sem: a koszinusz itt értelmetlen, euklideszi távolság kell."
          ],
          answer: 0,
          hint: "Az összeg-különbség vektor nagyrészt még mindig a kiinduló szó vektora…",
          explain: R`A híres analógia „csalással” működik: a legközelebbi szó maga a king; a queen csak a bemeneti szavak kizárása után nyer, és sokszor így sem jön ki (lemon − yellow + green → ginger). Az analógiát éppen koszinusszal keressük, mert a vektorhossz nagyrészt a gyakoriságtól függ. Ne a kiválasztott látványos példákból ítéld meg a beágyazásokat.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 12.3 játék-RNN-je: $h_{\text{új}} = \tanh(0{,}5\,h + x)$, $h_0 = 0$; unalmas $= -1$, jó $= +1$, de $= 0$. Mennyi $h_3$ az „unalmas jó de” sorozat után?`,
          options: ["0,269", "0,250", "−0,551", "0,000"],
          answer: 0,
          hint: "Lépésről lépésre: minden lépésben a régi állapot felét adod a szó értékéhez, aztán tanh.",
          explain: R`$h_1 = \tanh(-1) = -0{,}7616$; $h_2 = \tanh(-0{,}3808 + 1) = 0{,}5506$; $h_3 = \tanh(0{,}2753) = 0{,}269$ – pozitív: a legutóbbi erős szó (jó) dönt. A 0,250 a $\tanh$-ot hagyja ki, a $-0{,}551$ fordított sorrendben olvas („de jó unalmas”), a 0 az átlagoló modell eredménye – az a sorrendet nem látja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány paramétere van egy LSTM-cellának, ha a bemenet $d = 16$, a rejtett állapot $h = 32$?`,
          options: ["6272", "1568", "4704", "6144"],
          answer: 0,
          hint: R`Négy réteg (három kapu és a jelölt $\mathbf g$), mindegyik $\mathbf x_t$-ből és $\mathbf h_{t-1}$-ből számol, torzítással.`,
          explain: R`$4\,(dh + h^2 + h) = 4\,(512 + 1024 + 32) = 4 \cdot 1568 = 6272$. Az 1568 egy sima RNN-cella (egy réteg), a 4704 háromszorosa – a GRU-é lenne ($\tfrac34$ annyi) –, a 6144 a torzításokat hagyja ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Puha keresés (12.4): kulcsok $\mathbf k_1 = (2;\ 0) \to 10$, $\mathbf k_2 = (0;\ 2) \to 20$, $\mathbf k_3 = (1;\ 1) \to 30$; a lekérdezés $\mathbf q = (2;\ 0)$, skálázás nélkül. Mennyi a válasz?`,
          options: ["12,50", "10,00", "20,00", "16,67"],
          answer: 0,
          hint: "Pontszám skaláris szorzattal, súly softmax-szal, válasz az értékek súlyozott átlaga.",
          explain: R`Pontszámok $4;\ 0;\ 2$, súlyok $(0{,}867;\ 0{,}016;\ 0{,}117)$, válasz $8{,}67 + 0{,}32 + 3{,}51 \approx 12{,}50$. A 10 a kemény keresés (csak a legjobb kulcs), a 20 a sima átlag (mintha minden pontszám egyenlő lenne), a 16,67 a pontszámokat a softmax helyett az összegükkel normálja ($4/6$, $0$, $2/6$).`
        },
        {
          type: "match",
          q: "Honnan jön a lekérdezés, a kulcs és az érték? Párosítsd!",
          pairs: [
            ["önfigyelem a kódolóban", "mindhárom ugyanabból a mondatból, minden token minden tokenre figyel"],
            ["maszkolt önfigyelem a dekódolóban", "ugyanabból a mondatból, de csak a korábbi tokenekre"],
            ["keresztfigyelem", "lekérdezés a célmondatból, kulcs és érték a forrásmondatból"],
            ["Bahdanau-figyelem (2015)", "a dekódoló RNN állapota kérdez, a kódoló RNN állapotai a kulcsok és értékek"]
          ],
          hint: "Az „ön-” azt jelenti: ugyanabból a sorozatból. Ki kérdez fordításkor?",
          explain: "Az önfigyelemben Q, K és V ugyanabból a mondatból jön; a dekódolóban ehhez kauzális maszk jár. A keresztfigyelemben a lekérdezés a készülő célmondatból, a kulcs és az érték a forrásból – fordítva a modell a célnyelvi szöveget „keresné” a forrásban. A Bahdanau-figyelem ugyanez a keresztfigyelem, csak RNN-ek állapotaival."
        },
        {
          type: "single", shuffle: true,
          q: R`Az eredeti Transformerben $d = 512$, $h = 8$ fej. Mivel osztjuk egy fej pontszámait a softmax előtt?`,
          options: [R`$\sqrt{64} = 8$-cal`, R`$\sqrt{512} \approx 22{,}6$-del`, R`$64$-gyel`, R`$\sqrt 8 \approx 2{,}83$-mal`],
          answer: 0,
          hint: R`Egy fej kulcsvektora milyen hosszú? A képletben $\sqrt{d_k}$ áll.`,
          explain: R`Egy fej $d_k = d/h = 64$ hosszú kulcsokkal dolgozik, a skaláris szorzatok szórása $\sqrt{64} = 8$. A $\sqrt{512}$ a teljes $d$-vel oszt (egy fej szorzatai ennél kisebbek – túlságosan „ellaposodna” a softmax), a 64 a gyökvonást felejti el, a $\sqrt 8$ a fejek számával keveri össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az A mondat (fa $= (2;\ 0)$, levél $= (1;\ 1)$, hullik $= (1;\ 0)$, $W$ = egységmátrix, $d = 2$) kauzális maszkkal. Mi lesz a „levél” új vektora?`,
          options: [R`$(1{,}5;\ 0{,}5)$`, R`$(1{,}401;\ 0{,}401)$`, R`$(1;\ 0{,}670)$`, R`$(1{,}203;\ 0{,}401)$`],
          answer: 0,
          hint: "A levél a 2. token: kikre figyelhet? A megmaradt súlyok összege legyen 1.",
          explain: R`A levél csak a fára és magára figyelhet; mindkét pontszám 2, így a súlyok $0{,}5$–$0{,}5$: $0{,}5\cdot(2;0) + 0{,}5\cdot(1;1) = (1{,}5;\ 0{,}5)$. Az $(1{,}401;\ 0{,}401)$ a maszk nélküli (12.5) eredmény, az $(1;\ 0{,}670)$ a rossz háromszöget maszkolja (magára és a hullikra figyel), az $(1{,}203;\ 0{,}401)$ a softmax után nulláz, és nem normál újra.`
        },
        {
          type: "single", shuffle: true,
          q: R`A GPT-2 legnagyobb változatában 48 blokk van, $d = 1600$. Kb. hány paraméter van a blokkokban ($12d^2 + 13d$ blokkonként)?`,
          options: ["kb. 1,48 milliárd", "kb. 0,49 milliárd", "kb. 0,98 milliárd", "kb. 30,7 millió"],
          answer: 0,
          hint: "Egy blokk paraméterszáma, aztán szorozd a blokkok számával.",
          explain: R`$12 \cdot 1600^2 + 13 \cdot 1600 = 30\,740\,800$ blokkonként, $\times 48 \approx 1{,}48$ milliárd – a beágyazásokkal ez a „1,5 milliárd paraméteres GPT-2”. A 0,49 milliárd csak a figyelmet számolja ($4d^2 + 4d$), a 0,98 milliárd csak az FFN-t ($8d^2 + 5d$), a 30,7 millió egyetlen blokk.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a BERT-re és a GPT-re?",
          options: [
            "A BERT nem jósolhatja a következő tokent úgy, mint a GPT, mert kétirányú figyelmével a következő tokent is látja.",
            "Egy véleményelemző (osztályozó) Transformernek nem kell kauzális maszk.",
            "Egy 512 tokenes szövegből a GPT több mint hatszor annyi tanítójelet kap, mint a BERT.",
            "Az első dekódoló-modell a GPT-2 volt.",
            "A BERT következőmondat-feladata (NSP) a két mondat sorrendjét kérdezi."
          ],
          answer: [0, 1, 2],
          hint: "Ki mit lát a figyelemben? És hány helyen tanul a BERT egy szövegből?",
          explain: R`A BERT kétirányú: a „következő” token ott van a bemenetében, kinézhetné. Osztályozásnál a teljes mondat ismert, minden token figyelhet a későbbiekre is (a „de” utánira éppen kell). A BERT kb. $0{,}15 \cdot 512 \approx 77$ helyen tanul, a GPT 511 helyen – kb. 6,6-szor annyi. Az első dekódoló a GPT (2018) volt, még a BERT előtt. Az NSP azt kérdezi, hogy a B mondat valóban az A után jött-e, vagy egy véletlen mondat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Számítási keretünk $C = 1{,}2 \cdot 10^{23}$ művelet. A $C \approx 6ND$ szabály és a Chinchilla-szabály (20 token paraméterenként) szerint kb. mekkora modellt érdemes tanítani?`,
          options: ["kb. 31,6 milliárd paraméter", "kb. 141 milliárd paraméter", "kb. 77,5 milliárd paraméter", "kb. 632 milliárd paraméter"],
          answer: 0,
          hint: R`Írd be $D = 20N$-et: $C = 6 \cdot N \cdot 20N = 120\,N^2$.`,
          explain: R`$N = \sqrt{C/120} = \sqrt{10^{21}} \approx 3{,}16 \cdot 10^{10}$, vagyis kb. 31,6 milliárd paraméter, kb. 632 milliárd tokenen. A 141 milliárd a 20-at hagyja ki ($C = 6N^2$), a 77,5 milliárd a 6-ot ($C = 20N^2$), a 632 milliárd megfordítja az arányt (20 paraméter jut egy tokenre) – érdekes módon pont a helyes tokenszám.`
        },
        {
          type: "single", shuffle: true,
          q: "A huBERT „levél”-vektoraiban a 0. rétegben az azonos és az eltérő jelentésű párok koszinusza is 0,97; a 4. rétegben 0,952 vs. 0,832. Mi a helyes értelmezés?",
          options: [
            "A 0. réteg statikus beágyazás (+ pozíció), nem tudja, melyik levélről van szó; az önfigyelem rétegei a szomszédos szavakból választják szét a jelentéseket.",
            "A 4. rétegben a két jelentés teljesen különböző, hiszen 0,832 messze van 1-től.",
            "A modell előtanításkor megkapta a „levél” két jelentését címkeként.",
            "A 0. rétegben már szétválik a két jelentés, csak kerekítés miatt látszik egyformának."
          ],
          answer: 0,
          hint: "Mit lát a 0. réteg a mondatból? És az abszolút számot nézd, vagy a két átlag különbségét?",
          explain: "A 0. rétegben a token vektora a szótárból jön – mint a GloVe „bank”-jánál, egy szóhoz egy vektor. A figyelemrétegek után a vektor a környezettől (fáról, postán, bélyeg) függ. A BERT-szerű modellek vektorai egy szűk „kúpban” vannak, ezért szinte minden koszinusz 0,8 fölötti: a beszédes a két átlag különbsége, nem a 0,832 önmagában. Címkét senki nem adott – önfelügyelt előtanítás."
        }
      ]
    },
