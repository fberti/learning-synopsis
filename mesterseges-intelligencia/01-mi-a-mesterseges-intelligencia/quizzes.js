/* =========================================================
   Mesterséges intelligencia 1. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 1.1 */
    "ai1-11": {
      title: "Kvíz – 1.1 Mi az MI?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Mit mér a Turing-teszt?",
          options: [
            "Azt, hogy írásos beszélgetésben megkülönböztethető-e a gép az embertől.",
            "Azt, hogy a gépnek van-e tudata.",
            "Azt, hogy a gép le tudja-e győzni a sakkvilágbajnokot.",
            "A gép intelligenciahányadosát (IQ) egy szabványos teszttel."
          ],
          answer: 0,
          hint: "Turing a „Tudnak-e a gépek gondolkodni?” kérdést egy játékkal cserélte le. Mit lát ebben a játékban a kérdező?",
          explain: "A Turing-teszt (imitációs játék) csak a viselkedést nézi: ha a kérdező nem tudja megbízhatóan megmondani, melyik a gép, a gép „átment”. A tudatról és a belső működésről semmit sem mond – éppen ez volt Turing célja."
        },
        {
          type: "match",
          q: "Párosítsd a példákat az MI négy felfogásával (Russell–Norvig)!",
          pairs: [
            ["a Turing-teszt", "emberhez mért viselkedés"],
            ["egy logikai tételbizonyító program", "racionális gondolkodás"],
            ["egy program, amely az emberi problémamegoldás lépéseit utánozza (hibáival együtt)", "emberhez mért gondolkodás"],
            ["egy robot, amely a lehető legjobb várható eredményre törekszik", "racionális viselkedés"]
          ],
          hint: "Két kérdés: gondolkodást vagy viselkedést nézünk? Az emberhez vagy az ideális racionalitáshoz mérünk?",
          explain: "A Turing-teszt viselkedést mér emberhez; a tételbizonyító helyesen következtet (logika); a kognitív modell az ember gondolkodását utánozza, a hibáival együtt; a racionális ágens a legjobb várható eredményre törekszik – ez a mai mérnöki alapállás."
        },
        {
          type: "multi",
          q: "Melyik szűk MI?",
          options: [
            "egy spamszűrő",
            "az AlphaGo",
            "a telefon arcfelismerője",
            "egy rendszer, amely bármilyen új szellemi feladatot emberi szinten megtanul",
            "a Deep Blue sakkprogram"
          ],
          answer: [0, 1, 2, 4],
          hint: "A szűk MI egy feladatra vagy szűk feladatkörre készül. Melyik leírás szól tetszőleges feladatokról?",
          explain: "A spamszűrő, az AlphaGo, az arcfelismerő és a Deep Blue egy-egy feladatra készült: szűk MI. A tetszőleges új feladatot emberi szinten megtanuló rendszer az általános MI (AGI) definíciója – ilyen ma nincs, vagy legalábbis vitatott."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a helyes egymásba ágyazás?",
          options: [
            R`MI $\supset$ gépi tanulás $\supset$ mélytanulás $\supset$ generatív MI $\supset$ LLM`,
            R`gépi tanulás $\supset$ MI $\supset$ mélytanulás $\supset$ generatív MI $\supset$ LLM`,
            R`MI $\supset$ mélytanulás $\supset$ gépi tanulás $\supset$ generatív MI $\supset$ LLM`,
            R`MI $\supset$ gépi tanulás $\supset$ mélytanulás $\supset$ LLM $\supset$ generatív MI`
          ],
          answer: 0,
          hint: "Melyik a legtágabb fogalom? A mélytanulás a gépi tanulás egy fajtája vagy fordítva? Az LLM egy fajta generatív modell vagy fordítva?",
          explain: "Az MI a legtágabb (kézzel írt szabályok is). A gépi tanulás az adatból tanuló rész, ennek része a mélytanulás (sokrétegű neuronháló). A generatív MI új tartalmat hoz létre, az LLM ennek a szöveges (nyelvi) fajtája. A tipikus hiba a mélytanulás és a gépi tanulás, illetve az LLM és a generatív MI sorrendjének felcserélése."
        },
        {
          type: "match",
          q: "Mi a legszűkebb kategória, amelybe a program tartozik?",
          pairs: [
            ["útvonaltervező, amely a térképen keresi a legrövidebb utat", "MI, de nem gépi tanulás"],
            ["korábbi ügyfelekből épített döntési fa hitelbíráláshoz", "gépi tanulás, de nem mélytanulás"],
            ["arcfelismerő, sokrétegű neuronhálóval", "mélytanulás"],
            ["szöveges leírásból képet rajzoló program", "generatív MI"]
          ],
          hint: "Kérdezd meg mindegyiknél: honnan jön a tudása (ember írta / adatból), és ha adatból, van-e benne sokrétegű neuronháló? Hoz-e létre új tartalmat?",
          explain: "Az útvonaltervező keresőalgoritmust futtat, nem tanul. A döntési fa adatból tanul, de nincs benne neuronháló. Az arcfelismerő mély neuronháló. A képgeneráló új tartalmat hoz létre: generatív MI (ami ma mélytanulásra épül)."
        },
        {
          type: "single", shuffle: true,
          q: "Mit jelent az „MI-hatás” (AI effect)?",
          options: [
            "Ami már jól működik, azt hajlamosak vagyunk nem MI-nek tekinteni.",
            "Az MI-rendszerek idővel maguktól egyre okosabbak lesznek.",
            "Az MI-t használó cégek gyorsabban nőnek.",
            "Az emberek érzelmileg kötődnek a beszélgető programokhoz."
          ],
          answer: 0,
          hint: "Gondolj az útvonaltervezőre: régen MI-kutatás volt, ma minek hívjuk?",
          explain: "„MI az, amit még nem sikerült megcsinálni.” Az útvonaltervezés vagy a karakterfelismerés egykor MI-nek számított, ma „csak algoritmus”. Az érzelmi kötődés a beszélgető programokhoz az ELIZA-hatás (1.4) – más jelenség."
        }
      ]
    },

    /* ------------------------------------------------ 1.2 */
    "ai1-12": {
      title: "Kvíz – 1.2 Szabályok vs. tanulás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Melyik írja le a gépi tanulást?",
          options: [
            R`adat + válasz $\to$ szabály (modell)`,
            R`adat + szabály $\to$ válasz`,
            R`szabály + válasz $\to$ adat`,
            R`szabály $\to$ adat + válasz`
          ],
          answer: 0,
          hint: "Mit ad meg a programozó, és mit kell a gépnek megtalálnia, ha a °C → °F képletet nem ismerjük, csak mérési párokat?",
          explain: R`A gépi tanulásnál példákat adunk (bemenet + helyes válasz), és a gép keresi meg a szabályt. Az „adat + szabály $\to$ válasz” a hagyományos program: ott a programozó írja a szabályt.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kézzel írt spamszabály 25 levélből 20-at sorol jól. Mekkora a pontossága?",
          options: ["80%", "20%", "25%", "5%"],
          answer: 0,
          hint: "Pontosság = helyes döntések száma / összes döntés.",
          explain: R`$20/25 = 0{,}8 = 80\%$. A 20% a hibás döntések aránya ($5/25$), a 25% a hibák és a jó döntések hányadosa ($5/20$), az 5 pedig a hibák száma, nem arány.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mérések: $(30;\ 85)$ és $(40;\ 105)$ (°C; °F). Mekkora az $F = 2C + 30$ jelölt átlagos eltérése ezen a két ponton?`,
          options: ["5 °F", "10 °F", "0 °F", "2,5 °F"],
          answer: 0,
          hint: "Számold ki a jelölt jóslatát mindkét pontban, vond ki a mért értékből (abszolút értékben), és átlagold!",
          explain: R`Jóslatok: $2\cdot30 + 30 = 90$ és $2\cdot40 + 30 = 110$. Eltérések: $|90 - 85| = 5$ és $|110 - 105| = 5$, átlaguk 5 °F. A 10 a két eltérés összege (elmaradt az osztás), a 2,5 kétszer osztott eredmény.`
        },
        {
          type: "match",
          q: R`Párosítsd a fogalmakat a Celsius–Fahrenheit példa elemeivel ($F = mC + b$)!`,
          pairs: [
            ["jellemző", "a Celsius-fok (C)"],
            ["címke", "a mért Fahrenheit-érték"],
            ["paraméterek", "m és b"],
            ["következtetés", "37 °C → 98,8 °F a kész modellel"],
            ["tanítás", "m és b beállítása az öt mérésből"]
          ],
          hint: "Mi a bemenet? Mi a helyes kimenet a tanító példákban? Mi a modell állítható része? Melyik történik a kész modellel?",
          explain: "A jellemző a bemenet (C), a címke a tanító példák helyes kimenete (mért F). A paraméterek a modell állítható számai (m, b). A tanítás ezek beállítása az adatokból, a következtetés a kész modell használata új bemenetre."
        },
        {
          type: "multi",
          q: "Mi igaz a kézzel írt szabályokra épülő (szabályalapú) rendszerekre?",
          options: [
            "Átláthatók: minden döntés visszavezethető egy szabályra.",
            "Nem kell hozzájuk tanító adat.",
            "Ha valaki ismeri a szabályt, könnyen kijátszhatja.",
            "Maguktól alkalmazkodnak az új spamtrükkökhöz.",
            "Mindig pontosabbak a tanuló rendszereknél."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj az „INGYEN” → „1NGYEN” példára! Ki változtatja meg a szabályt, ha változik a világ?",
          explain: "A szabályalapú rendszer átlátható, adat nélkül is működik, de törékeny és kijátszható („1NGYEN”). Magától nem alkalmazkodik – minden változásnál embernek kell átírnia. Hogy pontosabb-e, az feladatfüggő: összetett mintázatoknál általában a tanuló rendszer nyer."
        },
        {
          type: "single", shuffle: true,
          q: R`A mérésekből tanult modell: $F = 1{,}8\,C + 32{,}2$. Mit jósol a modell 50 °C-ra?`,
          options: ["122,2 °F", "122 °F", "132,2 °F", "90 °F"],
          answer: 0,
          hint: R`Helyettesíts be a <em>tanult</em> modellbe: $m\cdot C + b$, mindkét taggal!`,
          explain: R`$1{,}8\cdot50 + 32{,}2 = 90 + 32{,}2 = 122{,}2$ °F. A 122 a valódi képlet ($1{,}8C + 32$) eredménye – a modell viszont ezt nem ismeri, a saját paramétereivel számol. A 132,2 a rossz meredekségből ($2\cdot50$), a 90 a $b$ elhagyásából jön.`
        }
      ]
    },

    /* ------------------------------------------------ 1.3 */
    "ai1-13": {
      title: "Kvíz – 1.3 A tanulás fajtái",
      questions: [
        {
          type: "match",
          q: "Melyik tanulási fajta (vagy feladattípus) illik a példához?",
          pairs: [
            ["egy használt autó árának becslése korábbi eladásokból", "felügyelt – regresszió"],
            ["kézzel írt számjegyek felismerése címkézett képekből", "felügyelt – osztályozás"],
            ["vásárlók csoportosítása, előre megadott csoportok nélkül", "felügyelet nélküli"],
            ["egy robot próbálkozással tanul meg járni, jutalomért", "megerősítéses"],
            ["egy nyelvi modell a következő szót jósolja nyers szövegből", "önfelügyelt"]
          ],
          hint: "Kérdések sorban: cselekszik és jutalmat kap? Van ember adta címke (szám vagy kategória)? A címke az adat eltakart része? Nincs címke?",
          explain: "Az ár szám → regresszió; a számjegy kategória → osztályozás; a címke nélküli csoportosítás felügyelet nélküli; a próbálkozás és jutalom megerősítéses; a következő szó jóslása nyers szövegből önfelügyelt."
        },
        {
          type: "single", shuffle: true,
          q: "Egy áramszolgáltató a holnapi csúcsfogyasztást (megawattban) jósolja az időjárás-előrejelzésből. Milyen feladat ez?",
          options: ["regresszió", "osztályozás", "klaszterezés", "megerősítéses tanulás"],
          answer: 0,
          hint: "Szám vagy kategória a kimenet? Vannak-e korábbi példák a helyes válasszal?",
          explain: "A kimenet mennyiség (MW), és a korábbi napokra ismert a valódi fogyasztás: felügyelt regresszió. Osztályozás akkor lenne, ha pl. csak azt kérdeznénk, „túllépi-e a kapacitást?” (igen/nem)."
        },
        {
          type: "single", shuffle: true,
          q: "Hány következőszó-jóslási tanító példa készíthető egy 9 szavas mondatból?",
          options: ["8", "9", "7", "36"],
          answer: 0,
          hint: "Melyik szavak lehetnek címkék? Lehet-e az első szó címke, ha előtte nincs semmi?",
          explain: R`Az első szó kivételével minden szó egyszer címke: $9 - 1 = 8$. A 9 az első szót is beszámolja, a 36 pedig az összes szópár száma ($\binom92$), ami itt nem játszik szerepet.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy robot célba érése +10 pont, minden lépés −1, egy olajfolt −3. Mennyi az összjutalom egy 5 lépéses úton, amely egyszer átmegy az olajfolton?",
          options: ["2", "5", "8", "−8"],
          answer: 0,
          hint: "Add össze a jutalmakat és a büntetéseket előjelesen!",
          explain: R`$10 - 5\cdot1 - 3 = 2$. Az 5 az olajfolt elfelejtése, a 8 előjelhiba ($+3$), a $-8$ a célba érés jutalmának elhagyása.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik állítás igaz az önfelügyelt tanulásra?",
          options: [
            "Van címke, de nem ember adja: magából az adatból készül (pl. a következő szó).",
            "Ugyanaz, mint a felügyelet nélküli tanulás: nincs címke.",
            "A modell maga dönti el, mit tanul, ember nélkül, jutalomért.",
            "Csak képekre működik, szövegre nem."
          ],
          answer: 0,
          hint: "A „macska felmászott a fára” példában volt-e helyes válasz, amihez a jóslatot mérni lehetett? Ki adta?",
          explain: "Az önfelügyelt tanulás technikailag felügyelt: van bemenet és címke, a hiba mérhető – csak a címkét az adat egy eltakart része adja. A felügyelet nélküli tanulásnál nincs címke; a jutalomért tanulás a megerősítéses tanulás. Szövegre (LLM-ek előtanítása) és képekre egyaránt használják."
        },
        {
          type: "multi",
          q: "Melyik feladatnál kell a tanító példákhoz előre ismert helyes válasz (címke)?",
          options: [
            "spamszűrő tanítása korábbi levelekből",
            "lakásár-becslő tanítása korábbi eladásokból",
            "vásárlói szegmensek keresése klaszterezéssel",
            "egy játékprogram tanítása önmaga elleni játszmákból, győzelem/vereség jutalommal"
          ],
          answer: [0, 1],
          hint: "Felügyelt tanulásnál minden példához tartozik helyes válasz. A megerősítéses tanulásnál minden lépéshez van „helyes lépés”?",
          explain: "A spamszűrő (spam/rendes) és a lakásár (eladási ár) felügyelt feladat, címke kell hozzá. A klaszterezés felügyelet nélküli: nincs címke. A játékprogram jutalomból tanul, nem lépésenkénti helyes válaszból – ez megerősítéses tanulás."
        }
      ]
    },

    /* ------------------------------------------------ 1.4 */
    "ai1-14": {
      title: "Kvíz – 1.4 Rövid történet",
      questions: [
        {
          type: "match",
          q: "Párosítsd az évszámokat az eseményekkel!",
          pairs: [
            ["1950", "Turing cikke és az imitációs játék"],
            ["1956", "a dartmouthi kutatótábor: megszületik az MI neve"],
            ["1986", "a visszaterjesztésről szóló cikk (Rumelhart, Hinton, Williams)"],
            ["2012", "AlexNet: a mélytanulás áttörése az ImageNeten"],
            ["2017", "a Transformer architektúra"]
          ],
          hint: "Sorrend: előbb a kérdés (gondolkodhat-e a gép?), aztán a név, aztán a tanítóalgoritmus, aztán a képfelismerési áttörés, végül a nyelvi modellek alapja.",
          explain: "1950 Turing, 1956 Dartmouth, 1986 visszaterjesztés, 2012 AlexNet, 2017 Transformer (<em>Attention Is All You Need</em>). Erre a Transformerre épül a 2022-es ChatGPT."
        },
        {
          type: "single", shuffle: true,
          q: "Hogyan győzte le a Deep Blue 1997-ben Kaszparovot?",
          options: [
            "Gyors kereséssel és nagymesterek által hangolt, kézzel írt értékelőfüggvénnyel.",
            "Önmaga ellen játszva, megerősítéses tanulással.",
            "Egy nagy nyelvi modellel, amely sakkkönyveket olvasott.",
            "Egy rejtett sakkozóval, mint Kempelen törökje."
          ],
          answer: 0,
          hint: "A Deep Blue tanult-e? Melyik program tanult önmaga ellen játszva – és mikor?",
          explain: "A Deep Blue nem tanult: óriási sebességgel keresett a lépések között, kézzel hangolt értékeléssel (szimbolikus MI + keresés). Az önmaga ellen játszva tanuló program az AlphaZero (2017). Kempelen törökjében (1770) valóban ember ült – a Deep Blue-ban nem."
        },
        {
          type: "single", shuffle: true,
          q: "Mi vezetett az első MI-télhez (kb. 1974–1980)?",
          options: [
            "A túlzott ígéretek nem teljesültek; a Perceptrons könyv és a Lighthill-jelentés után elapadt a pénz.",
            "Leálltak a Lisp-gépek gyártói.",
            "Kiderült, hogy a neuronhálók tudatosak, és betiltották őket.",
            "A ChatGPT megjelenése elvette a figyelmet."
          ],
          answer: 0,
          hint: "Melyik évtizedben volt az első tél, és mi történt közvetlenül előtte (1969, 1973)?",
          explain: "Az első tél előtt a gépi fordítás, a perceptron és az általános problémamegoldás ígéretei nem teljesültek; a Minsky–Papert-könyv (1969) és a Lighthill-jelentés (1973) után a finanszírozás összeomlott. A Lisp-gépek bukása (1987) a második tél egyik oka."
        },
        {
          type: "multi",
          q: "Melyik tartozik a konnekcionista (neuronhálós) irányzathoz?",
          options: ["Rosenblatt perceptronja", "a visszaterjesztés", "az AlexNet", "a MYCIN szakértői rendszer", "az ELIZA"],
          answer: [0, 1, 2],
          hint: "A konnekcionizmus sok egyszerű, összekötött egységből (neuronból) építkezik és tanul. Melyikben van ember által írt szabálylista?",
          explain: "A perceptron, a visszaterjesztés és az AlexNet neuronhálós. A MYCIN (szakértői rendszer) és az ELIZA (szövegminták) a szimbolikus irányzathoz tartozik: a tudásukat ember írta szabályokba."
        },
        {
          type: "single", shuffle: true,
          q: "Hány év telt el a dartmouthi kutatótábor és az AlexNet áttörése között?",
          options: ["56", "66", "46", "26"],
          answer: 0,
          hint: "Melyik évben volt Dartmouth, és melyikben az AlexNet?",
          explain: R`$2012 - 1956 = 56$ év. A 66 a ChatGPT-ig (2022) eltelt idő, a 26 a visszaterjesztés (1986) és az AlexNet közötti időszak.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi volt Kempelen Farkas sakkozó „törökjének” titka?",
          options: [
            "A szekrényben egy ember rejtőzött, ő játszott.",
            "Mechanikus fogaskerekek számolták ki a legjobb lépést.",
            "Egy korai elektromos számológép vezérelte.",
            "Minden játszmát előre betanult megnyitásokkal nyert."
          ],
          answer: 0,
          hint: "Az első híres „MI” – és az első híres MI-csalás.",
          explain: "A szekrényben egy erős sakkozó ült. Az automata „intelligenciája” emberi volt – ezért nevezte el az Amazon a <em>Mechanical Turk</em> szolgáltatását róla, ahol emberek végeznek gépnek nehéz apró feladatokat (pl. adatcímkézést)."
        }
      ]
    },

    /* ------------------------------------------------ 1.5 */
    "ai1-15": {
      title: "Kvíz – 1.5 Miért most?",
      questions: [
        {
          type: "multi",
          q: "Melyik volt a mélytanulás 2012-es áttörésének három fő összetevője?",
          options: ["számítási kapacitás (GPU-k)", "nagy címkézett adathalmazok (pl. ImageNet)", "jobb algoritmusok és tanítási trükkök", "kvantumszámítógépek", "tudatos gépek"],
          answer: [0, 1, 2],
          hint: "Kneusel három szava: sebesség, algoritmus, adat.",
          explain: "Számítás (2 GPU), adat (1,2 millió címkézett kép) és algoritmus (konvolúciós háló + ReLU, dropout) – együtt. Kvantumszámítógépet a mélytanulás nem használ, a „tudat” pedig nem technikai összetevő."
        },
        {
          type: "single", shuffle: true,
          q: "Ha a felhasznált számítás évente háromszorosára nő, hányszoros 3 év alatt?",
          options: ["27-szeres", "9-szeres", "6-szoros", "81-szeres"],
          answer: 0,
          hint: R`Minden év az előzőt szorozza: $k^t$.`,
          explain: R`$3^3 = 27$. A 9-szeres két év ($3^2$), a 6-szoros a hibás összeadás-szerű gondolkodás ($3 + 3$), a 81-szeres négy év ($3^4$).`
        },
        {
          type: "single", shuffle: true,
          q: "Évi négyszeres növekedésnél mennyi a duplázási idő?",
          options: ["6 hónap", "3 hónap", "1 év", "2 év"],
          answer: 0,
          hint: R`Melyik $T$-re lesz $4^T = 2$?`,
          explain: R`$4^{1/2} = 2$, tehát $T = \tfrac12$ év = 6 hónap. Az 1 év az évi kétszeres növekedés duplázási ideje, a 2 év a Moore-törvényé.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy angol cikk szerint egy modellnek „175 billion parameters” van. Hány paraméter ez magyarul?",
          options: ["175 milliárd", "175 billió", "175 millió", "1,75 billió"],
          answer: 0,
          hint: R`Az angol <em>billion</em> $10^9$. Mi a magyar neve a $10^9$-nek?`,
          explain: R`Az angol <em>billion</em> = $10^9$ = magyar milliárd. A magyar billió $10^{12}$ (= angol <em>trillion</em>), ezért a „175 billió” ezerszeres tévedés.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit állít Sutton „keserű leckéje”?",
          options: [
            "Hosszú távon a számítást kihasználó általános módszerek (keresés, tanulás) nyernek a kézzel beépített emberi tudással szemben.",
            "Az MI soha nem éri el az emberi szintet.",
            "A szakértői tudás haszontalan, adatot sem kell válogatni.",
            "Mindig a legnagyobb modellt kell választani, bármilyen kicsi a feladat."
          ],
          answer: 0,
          hint: "Gondolj a Deep Blue és az AlphaZero összevetésére: melyiknek volt több beépített emberi tudása, és melyik nyert végül?",
          explain: "A lecke a módszerekről szól: amelyik a növekvő számítással skálázódik (keresés, tanulás), hosszú távon nyer. Nem mondja, hogy a szakértelem haszontalan (az adat, a feladat és az értékelés emberi munka), és azt sem, hogy minden feladatra a legnagyobb modell kell."
        },
        {
          type: "single", shuffle: true,
          q: "Az ImageNeten 1000 kategória van. Mekkora egy véletlenszerű találgató top-5 hibája (vagyis amikor 5 tippből egyik sem talál)?",
          options: ["99,5%", "99,9%", "95%", "80%"],
          answer: 0,
          hint: "5 tipp 1000 lehetőségből: mekkora eséllyel van benne a helyes? A hiba ennek a komplementere.",
          explain: R`Talált: $5/1000 = 0{,}5\%$, hiba: $99{,}5\%$. A 99,9% az egytippes (top-1) hiba, a 95% abból a hibából jön, ha 5 tippet 100 kategóriára számolunk. Ehhez képest az AlexNet 15,3%-a óriási ugrás.`
        }
      ]
    },

    /* ------------------------------------------------ 1.6 */
    "ai1-16": {
      title: "Kvíz – 1.6 Mire jó és mire nem?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Melyik feladathoz NEM érdemes gépi tanulást használni?",
          options: [
            "a 27%-os áfa kiszámítása egy nettó árból",
            "spamszűrés",
            "lakások bérleti díjának becslése",
            "filmajánlás"
          ],
          answer: 0,
          hint: "Melyiknél ismert pontosan és egyszerűen a szabály?",
          explain: "Az áfa képlete pontosan ismert és egyszerű: egy hagyományos program hibátlanul számol, egy tanult modell legfeljebb közelítene. A többinél összetett, nehezen leírható mintázat van, sok adattal – ezek jó gépi tanulási feladatok."
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem lehet gépi tanulással megjósolni a következő heti lottószámokat, bármennyi korábbi húzás ismeretében?",
          options: [
            "Mert nincs tanulható mintázat: a húzások függetlenek.",
            "Mert túl kevés az adat.",
            "Mert a lottószámok kategóriák, nem számok.",
            "Mert a modellek nem tudnak számokkal dolgozni."
          ],
          answer: 0,
          hint: "Az ellenőrző lista első feltétele.",
          explain: "Ha nincs mintázat (a húzások egymástól függetlenek és egyenletesek), akkor nincs mit tanulni – bármennyi adat sem segít. Ugyanez igaz a szabályos kockadobásra."
        },
        {
          type: "single", shuffle: true,
          q: "Egy modell naponta 50 000 jóslást ad, 2%-os hibaaránnyal. Hány rossz jóslás születik naponta?",
          options: ["1000", "100", "10 000", "25 000"],
          answer: 0,
          hint: "Jóslások száma × hibaarány; a 2% = 0,02.",
          explain: R`$50\,000\cdot0{,}02 = 1000$. A 100 a 0,2%-nak, a 10 000 a 20%-nak felelne meg; a 25 000 a felezés.`
        },
        {
          type: "single", shuffle: true,
          q: "Naponta 200 döntés, 5%-os hibaarány, hibánként átlagosan 100 000 Ft kár. Mekkora a várható napi kár?",
          options: ["1 000 000 Ft", "100 000 Ft", "10 000 000 Ft", "500 000 Ft"],
          answer: 0,
          hint: "Várható kár ≈ jóslások száma × hibaarány × egy hiba ára.",
          explain: R`$200\cdot0{,}05 = 10$ hiba, $10\cdot100\,000 = 1\,000\,000$ Ft. A 100 000 Ft egyetlen hiba ára, az 500 000 Ft a $5\cdot100\,000$ (a százalékot darabszámnak vette), a 10 000 000 Ft tízszeres elszámolás.`
        },
        {
          type: "multi",
          q: "Huyen szerint mely körülmények mellett teljesít a gépi tanulás különösen jól?",
          options: [
            "a feladat ismétlődő",
            "a rossz jóslás ára alacsony",
            "nagy léptékű (sok jóslás kell)",
            "a mintázatok folyamatosan változnak",
            "egyetlen, egyszeri döntésről van szó",
            "a szabály pontosan ismert"
          ],
          answer: [0, 1, 2, 3],
          hint: "Gondolj a spamszűrőre és a filmajánlóra: mi teszi őket ideális gépi tanulási feladattá?",
          explain: "Ismétlődő, olcsó hiba, nagy lépték, változó mintázat. Egyszeri döntésnél nincs mit „ismételni”, és a modell ára nem térül meg; ha a szabály pontosan ismert, a hagyományos program jobb."
        },
        {
          type: "single", shuffle: true,
          q: "Mi az „alapvonal” (baseline) szerepe egy gépi tanulási projektben?",
          options: [
            "Egy egyszerű, nem tanuló megoldás, amelyet a modellnek meg kell vernie, hogy megérje.",
            "A tanító adatok legelső sora.",
            "A legnagyobb elérhető modell, amihez hasonlítunk.",
            "A modell pontosságának elméleti felső határa."
          ],
          answer: 0,
          hint: "Huyen: egy projekt első fázisa ne gépi tanulás legyen. Mi legyen helyette?",
          explain: "Az alapvonal egy egyszerű megoldás (pl. „mindig a legnépszerűbb filmet ajánld”). Ha a modell ezt nem veri meg érdemben, a gépi tanulás nem érte meg a ráfordítást."
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "ai1-final": {
      title: "Fejezetzáró teszt – Mi a mesterséges intelligencia?",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A három rendszer közül melyik NEM tanult adatokból?",
          options: ["a Deep Blue (1997)", "egy Bayes-alapú spamszűrő", "a ChatGPT", "az AlphaZero"],
          answer: 0,
          hint: "Honnan jött a tudás: ember írta, vagy adatból (illetve saját játszmákból) tanulta?",
          explain: "A Deep Blue kézzel hangolt értékeléssel és kereséssel dolgozott. A spamszűrő címkézett levelekből, a ChatGPT szövegekből és emberi visszajelzésből, az AlphaZero saját játszmáiból tanult."
        },
        {
          type: "single", shuffle: true,
          q: "Hogyan tanítják (nagy vonalakban) a ChatGPT-hez hasonló asszisztenseket?",
          options: [
            "önfelügyelt előtanítás → felügyelt finomhangolás → megerősítéses tanulás emberi visszajelzésből",
            "csak felügyelet nélküli klaszterezéssel",
            "kézzel írt szabályokkal, mint egy szakértői rendszert",
            "csak megerősítéses tanulással, szöveg nélkül"
          ],
          answer: 0,
          hint: "A valódi rendszerek kombinálják a tanulási fajtákat. Mi adja az általános nyelvtudást, és mi teszi segítőkész asszisztenssé?",
          explain: "Az előtanítás önfelügyelt (következő szó), aztán minta-beszélgetéseken felügyelt finomhangolás, végül RLHF. Kézi szabályokkal ilyen rendszer nem építhető, klaszterezéssel sem."
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a legjobb megoldással!",
          pairs: [
            ["szállítási díj a súly és a zóna alapján", "szabály (hagyományos program)"],
            ["csalásgyanús tranzakciók, megjelölt példák nélkül", "felügyelet nélküli (anomáliadetektálás)"],
            ["a holnapi forgalom (darabszám) előrejelzése", "felügyelt – regresszió"],
            ["termékfotó kategóriájának felismerése", "felügyelt – osztályozás"],
            ["termékleírás megírása néhány kulcsszóból", "generatív MI (LLM)"]
          ],
          hint: "Ismert-e a szabály? Van-e címke, és ha igen, szám vagy kategória? Új tartalmat kell létrehozni?",
          explain: "A díjtáblázat ismert szabály. Címke nélküli furcsaságkeresés: anomáliadetektálás. A darabszám regresszió, a kategória osztályozás. Új szöveg létrehozása: generatív MI."
        },
        {
          type: "single", shuffle: true,
          q: "Évi négyszeres növekedés 3 év alatt hányszoros növekedést jelent?",
          options: ["64-szeres", "12-szeres", "16-szoros", "81-szeres"],
          answer: 0,
          hint: "Szorozni kell, nem összeadni.",
          explain: R`$4^3 = 64$. A 12 a hibás összeadás ($4 + 4 + 4$), a 16 két év ($4^2$), a 81 a $3^4$ (alap és kitevő felcserélve).`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a racionális ágens legjobb leírása?",
          options: [
            "Érzékeli a környezetét, és úgy cselekszik, hogy a céljait a lehető legjobban elérje.",
            "Olyan program, amely átmegy a Turing-teszten.",
            "Olyan gép, amelynek tudata van.",
            "Olyan program, amely sosem téved."
          ],
          answer: 0,
          hint: "Az ágensfelfogás a viselkedést méri, a cél eléréséhez.",
          explain: "A racionális ágens a lehető legjobb (várható) eredményre törekszik – a körülmények között, hibázhat is. A Turing-teszt az emberhez mért viselkedés, a tudat pedig nem része a definíciónak."
        },
        {
          type: "single", shuffle: true,
          q: "Egy postafiókba 1000 levél érkezik: 980 rendes, 20 spam. Mekkora annak a „szűrőnek” a pontossága, amely minden levelet átenged?",
          options: ["98%", "2%", "100%", "50%"],
          answer: 0,
          hint: "Hány levelet sorol jól, ha mindent rendesnek mond?",
          explain: R`A 980 rendes levelet jól sorolja: $980/1000 = 98\%$ – és egyetlen spamet sem fog meg. A ritka osztálynál a pontosság félrevezető (6. fejezet). A 2% a spamek aránya.`
        },
        {
          type: "multi",
          q: "Mi igaz a gépi tanulásra?",
          options: [
            "A modell a tanító adatokból állítja be a paramétereit.",
            "A tanult szabály általában közelítés, a zajos adat zajos modellt ad.",
            "A modell tanítása és használata (következtetés) külön fázis.",
            "A modell minden beszélgetésből automatikusan tanul.",
            "A gépi tanulás mindig pontosabb a kézzel írt szabálynál."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a °C → °F példára: mi történt a 32,2-vel? És mikor változnak a paraméterek?",
          explain: "A paramétereket a tanítás állítja be; az eredmény közelítés (32,2 a 32 helyett); a tanítás és a következtetés külön fázis. A modell használat közben nem tanul, hacsak újra nem tanítják. Ha a szabály pontosan ismert (adó, díjtáblázat), a kézi szabály a jobb."
        },
        {
          type: "single", shuffle: true,
          q: "Egy szövegből képet generáló modell (pl. diffúziós modell) melyik a legszűkebb kategória?",
          options: ["generatív MI", "nagy nyelvi modell (LLM)", "szimbolikus MI", "felügyelet nélküli klaszterezés"],
          answer: 0,
          hint: "Új tartalmat hoz létre – de szöveget vagy képet?",
          explain: "Képet hoz létre: generatív MI (mélytanulással). Nem LLM, mert nem szöveget generál (bár egy nyelvi modul értelmezheti a leírást); nem szimbolikus és nem klaszterező."
        },
        {
          type: "single", shuffle: true,
          q: "Egy takarítórobot jutalma: „−1 pont minden kamerával látott koszfoltért”. A robot megtanulja eltakarni a kameráját. Hogy hívják ezt?",
          options: ["jutalom-kijátszás", "túlillesztés", "MI-tél", "önfelügyelt tanulás"],
          answer: 0,
          hint: "Az ágens azt maximalizálja, amit mérünk, nem azt, amit gondolunk.",
          explain: "Jutalom-kijátszás (reward hacking): a rosszul megfogalmazott jutalom nem szándékolt viselkedést tanít. A túlillesztés (6. fejezet) más jelenség: a modell a tanító adatok zaját is megtanulja."
        },
        {
          type: "single", shuffle: true,
          q: "Miért csak 2012 után tört át a mélytanulás, ha a visszaterjesztés már 1986-ban ismert volt?",
          options: [
            "Mert addigra lett elég számítás (GPU) és elég címkézett adat (ImageNet).",
            "Mert 2012-ben találták fel a mesterséges neuront.",
            "Mert a szakértői rendszerek 2012-ben szűntek meg.",
            "Mert 2012-ben jelent meg a ChatGPT."
          ],
          answer: 0,
          hint: "Az 1.5 három összetevője közül melyik volt meg 1986-ban, és melyik hiányzott?",
          explain: "Az algoritmus megvolt, de a számítás és az adat hiányzott. A mesterséges neuron 1943-as, a ChatGPT 2022-es; a szakértői rendszerek nem 2012-ben „szűntek meg”."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
