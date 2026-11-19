/* =========================================================
   Mesterséges intelligencia 15. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 15.1 */
    "ai15-151": {
      title: "Kvíz – 15.1 Ágens, környezet, jutalom",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Mi különbözteti meg leginkább a megerősítéses tanulást a felügyelt tanulástól?",
          options: [
            "Nincs helyes válasz címkeként: csak jutalom jön, gyakran késve, és az ágens maga gyűjti az adatát.",
            "Megerősítéses tanulásnál nem használunk neurális hálót.",
            "Megerősítéses tanulásnál nincs semmilyen visszajelzés, csak az adatok szerkezete.",
            "Megerősítéses tanulásnál minden lépéshez megkapjuk, mi lett volna a legjobb cselekvés."
          ],
          answer: 0,
          hint: "Mit mond a jutalom – azt, hogy mi lett volna jó, vagy azt, hogy mennyire volt jó, ami történt?",
          explain: R`A jutalom csak azt mondja meg, mennyire volt jó, ami történt – azt nem, mi lett volna jobb. Gyakran késik (a játszma végén jön), és az ágens a cselekvéseivel maga dönti el, milyen adatot lát. A „semmilyen visszajelzés” a felügyelet nélküli tanulás, a „minden lépéshez a legjobb cselekvés” pedig a felügyelt (utánzásos) tanulás. Neurális háló RL-ben is lehet (pl. a mély Q-háló, DQN).`
        },
        {
          type: "single", shuffle: true,
          q: R`A folyosón a robot ezt teszi: 2. → jobbra → 3. → balra → 2. → jobbra → 3. → jobbra → töltő. Mennyi az összjutalom (diszkont nélkül)?`,
          options: ["10", "40", "−10", "0"],
          answer: 0,
          hint: "Melyik lépésnél kap a robot nem nulla jutalmat?",
          explain: R`Csak az utolsó lépés (a töltőbe) ad jutalmat: +10. Az összeg nem bünteti a kerülőt – ezt majd a diszkontálás teszi meg. A 40 akkor jönne ki, ha minden lépés +10 lenne, a 0 a véletlen stratégia átlaga, a −10 a lépcsőre esés.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány determinisztikus stratégia van a folyosón, ahol 3 belső cella van, és mindegyikben 2 cselekvés közül lehet választani?",
          options: ["8", "6", "9", "5"],
          answer: 0,
          hint: "Minden cellában egymástól függetlenül választasz.",
          explain: R`Cellánként 2 lehetőség, 3 cella: $2^3 = 8$. A 6 a $2 \cdot 3$ (összeadás vagy szorzás helyett), a 9 a $3^2$ (felcserélt alap és kitevő), az 5 a cellák száma.`
        },
        {
          type: "single", shuffle: true,
          q: "A 8 determinisztikus stratégia közül hány ér célba (a töltőhöz) a 2. cellából indulva?",
          options: ["2", "1", "4", "3"],
          answer: 0,
          hint: "A 2. cellából jobbra kell lépni, aztán a 3.-ból is jobbra. Számít-e, mit mond a stratégia az 1. cellára?",
          explain: R`A 2.-ben és a 3.-ban is „jobbra” kell; az 1. cellára vonatkozó szabály ilyenkor nem számít (a robot oda sem lép). Ezért 2 stratégia jó: „← → →” és „→ → →”. Az 1.-ből indulva viszont csak a „→ → →”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Csúszós padlón (20% eséllyel helyben marad) a robot a 3. cellából mindig jobbra lép. Mekkora eséllyel ér célba pontosan a második lépésben?`,
          options: ["0,16", "0,8", "0,04", "0,64"],
          answer: 0,
          hint: "Pontosan a másodikban: az elsőben még nem sikerült, a másodikban igen.",
          explain: R`Először megcsúszik (0,2), aztán sikerül (0,8): $0{,}2 \cdot 0{,}8 = 0{,}16$. A 0,8 az első lépésben való célba érés, a 0,04 a két egymás utáni csúszás, a 0,64 két sikeres lépés – de a célba érés után az epizód már véget ér.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Markov-tulajdonságra?",
          options: [
            "A következő állapot csak a mostani állapottól és cselekvéstől függ, a korábbiaktól nem.",
            "Egy pingpongjátékban egyetlen képkocka nem Markov-állapot, mert nem látszik belőle a labda iránya.",
            "Ha nem teljesül, az állapot bővítésével (pl. több képkockával) gyakran elérhető.",
            "A Markov-tulajdonság azt jelenti, hogy a környezet determinisztikus.",
            "Markov-tulajdonság esetén a jutalom mindig azonnal jön."
          ],
          answer: [0, 1, 2],
          hint: "A tulajdonság arról szól, mi kell a jövő előrejelzéséhez – nem arról, hogy van-e véletlen, vagy mikor jön a jutalom.",
          explain: R`A Markov-tulajdonság: a jövő csak a jelentől függ. Egy képkockából a labda helye látszik, az iránya nem – ezért adott be a DQN négy képkockát. A tulajdonság a <b>leírásunk</b> tulajdonsága: bővített állapottal elérhető. A csúszós folyosó véletlen, mégis Markov; a késleltetett jutalom (go) sem mond ellent neki.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a folyosós példa megfelelő elemével!",
          pairs: [
            ["állapot", "melyik cellában áll a robot"],
            ["cselekvés", "balra vagy jobbra lép"],
            ["jutalom", "+10 a töltőnél, −10 a lépcsőnél, különben 0"],
            ["stratégia", "minden cellára megmondja, merre lépjen"],
            ["epizód", "egy próbálkozás a starttól a töltőig vagy a lépcsőig"]
          ],
          hint: "Melyik egy szám, melyik egy szabály, melyik egy egész próbálkozás?",
          explain: R`Az állapot az, amit az ágens megfigyel (a cella), a cselekvés, amit tesz (lépés), a jutalom a környezet egyetlen számú visszajelzése, a stratégia a szabály minden állapotra, az epizód egy teljes próbálkozás a végállapotig.`
        }
      ]
    },

    /* ------------------------------------------------ 15.2 */
    "ai15-152": {
      title: "Kvíz – 15.2 A többkarú bandita",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy automata eddig négyszer fizetett ötből, a becslése $Q = 0{,}8$. A hatodik húzás nem fizet. Mennyi az új átlag a $Q \leftarrow Q + \frac1n(r - Q)$ szabállyal?`,
          options: ["0,667", "0,4", "0,64", "0,75"],
          answer: 0,
          hint: R`Most $n = 6$, és $r = 0$.`,
          explain: R`$0{,}8 + \tfrac16(0 - 0{,}8) = 0{,}8 - 0{,}133 = 0{,}667$ – ugyanaz, mint $4/6$. A 0,4 az $(0{,}8 + 0)/2$ (rossz súlyozás), a 0,64 az $\alpha = 0{,}2$-es állandó lépésköz, a 0,75 a $\tfrac34$ (rossz $n$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Három kar, ε = 0,1, a C a legjobbnak hitt. Mekkora eséllyel húzza az ε-mohó ágens a C-t?`,
          options: ["kb. 0,933", "0,9", "0,1", "kb. 0,967"],
          answer: 0,
          hint: "A véletlen választásban is kijöhet a C.",
          explain: R`$0{,}9$ (kiaknázás) $+ 0{,}1 \cdot \tfrac13$ (véletlenül épp C) $\approx 0{,}933$. A 0,9 elfelejti, hogy a véletlen választás is eltalálhatja a C-t, a 0,1 a felfedezés esélye, a 0,967 a $0{,}9 + 0{,}1 \cdot \tfrac23$ (rossz arány).`
        },
        {
          type: "multi",
          q: "Mi igaz a tiszta mohó stratégiára (mindig a legnagyobb becslésű kar)?",
          options: [
            "Beragadhat egy rossz karra, ha az az elején szerencsés volt.",
            "A soha ki nem próbált karok becslése sosem változik.",
            "A szimulációkban (2000 futás) a futások kb. felében nem a legjobb karnál kötött ki.",
            "Hosszú távon mindig megtalálja a legjobb kart.",
            "A megbánása idővel ellaposodik."
          ],
          answer: [0, 1, 2],
          hint: "Mit tud meg a mohó ágens azokról a karokról, amelyeket sosem húz?",
          explain: R`Csak a választott kar becslése javul, így egy szerencsés kezdés örökre rossz döntésbe zárhat: a szimulációkban a futások 54%-ában a mohó nem a C-nél kötött ki. Ezért a megbánása egyenesen nő (állandó veszteség húzásonként), nem lapul el, és nem garantált, hogy megtalálja a legjobbat.`
        },
        {
          type: "single", shuffle: true,
          q: R`100 húzásból 10 volt A (esély 0,3), 30 B (0,5) és 60 C (0,7). Mennyi a megbánás?`,
          options: ["10", "30", "60", "64"],
          answer: 0,
          hint: R`$T q^* - \sum q(a_t)$ – a valódi esélyekkel számolj, nem a kapott érmékkel.`,
          explain: R`$100 \cdot 0{,}7 - (10 \cdot 0{,}3 + 30 \cdot 0{,}5 + 60 \cdot 0{,}7) = 70 - (3 + 15 + 42) = 10$. A 60 a várható érmék száma, a 64 a hibás $70 - 6$, a 30 a B húzásainak száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`UCB, $c = 1$, $t = 10$ ($\ln 10 \approx 2{,}3$): $Q = (0{,}7;\ 0{,}4;\ 0{,}5)$, $N = (6;\ 1;\ 3)$. Melyik kart húzza?`,
          options: ["B", "A", "C", "mindhárom egyforma, véletlen"],
          answer: 0,
          hint: R`Számold ki mindháromra: $Q + \sqrt{\ln t / N}$. Melyiknél nagy a bónusz?`,
          explain: R`A: $0{,}7 + 0{,}62 = 1{,}32$; B: $0{,}4 + 1{,}52 = 1{,}92$; C: $0{,}5 + 0{,}88 = 1{,}38$. A B-t csak egyszer próbáltuk, a bizonytalansága nagy – az UCB ezt kipróbálja. A mohó az A-t húzná.`
        },
        {
          type: "match",
          q: "Párosítsd a stratégiát a felfedezés módjával!",
          pairs: [
            ["ε-mohó", "ε eséllyel egyenletesen véletlen kar"],
            ["optimista kezdőérték", "minden becslés magasról indul, a csalódások hajtják a próbálkozást"],
            ["UCB", "a ritkán próbált kar bizonytalansági bónuszt kap"],
            ["tiszta mohó", "nem fedez fel"]
          ],
          hint: "Melyik vak, melyik célzott, melyik csak az elején fedez fel?",
          explain: R`Az ε-mohó vakon fedez fel (a nyilvánvalóan rosszat is), az optimista kezdés csak az elején, amíg a magas kezdőértékek le nem kopnak, az UCB célzottan, a bizonytalanság szerint. A tiszta mohó egyáltalán nem.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért rosszabb ε = 0,3, mint ε = 0,1 a három automatánál, 1000 húzás alatt?",
          options: [
            "Mert a legjobb kar megtalálása után is az idő 30%-ában véletlenül választ, és ennek kétharmada rossz kar.",
            "Mert nagyobb ε-nál lassabban találja meg a legjobb kart.",
            "Mert ε = 0,3-nál a mohó választás tilos.",
            "Nem rosszabb: a több felfedezés mindig jobb."
          ],
          answer: 0,
          hint: "Mennyibe kerül a felfedezés, miután már tudod, melyik a legjobb?",
          explain: R`A nagy ε gyorsabban talál rá a C-re, de utána is folyamatosan pazarol: a legjobb kar aránya 78% (a 0,1-es 88% helyett), a megbánás kétszeres (64 vs. 32). Ezért csökkentik ε-t idővel.`
        }
      ]
    },

    /* ------------------------------------------------ 15.3 */
    "ai15-153": {
      title: "Kvíz – 15.3 Hozam, érték, Bellman-egyenlet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Jutalmak: $0, 0, 1$, $\gamma = 0{,}9$. Mennyi $G_0$?`,
          options: ["0,81", "1", "0,9", "0,729"],
          answer: 0,
          hint: R`A $k$-adik jutalom súlya $\gamma^k$; az első jutalom $k = 0$.`,
          explain: R`$G_0 = 0 + 0{,}9 \cdot 0 + 0{,}9^2 \cdot 1 = 0{,}81$. Az 1 a diszkont nélküli összeg, a 0,9 egy lépés diszkont, a 0,729 a $0{,}9^3$ (egy lépéssel elszámolva).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy végtelen feladatban minden lépésben +1 a jutalom, $\gamma = 0{,}99$. Mennyi a hozam?`,
          options: ["100", "99", "végtelen", "1,99"],
          answer: 0,
          hint: "Mértani sor összege.",
          explain: R`$1 + 0{,}99 + 0{,}99^2 + \dots = \frac1{1 - 0{,}99} = 100$. A diszkontálás épp azért kell, hogy ez ne legyen végtelen; a 99 a $\gamma/(1 - \gamma)$ (az első tag kimaradt), az 1,99 csak két tag.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik $\gamma$ mellett egyforma jó a „+1 most” és a „+3 tíz lépés múlva”?`,
          options: [R`kb. 0,896`, R`kb. 0,333`, R`kb. 0,9`, R`kb. 0,966`],
          answer: 0,
          hint: R`$3\gamma^{10} = 1$.`,
          explain: R`$\gamma^{10} = 1/3$, $\gamma = 3^{-1/10} \approx 0{,}896$. A 0,333 egyetlen lépésre vonatkozna ($3\gamma = 1$), a 0,9 csak kerekítve közel, a 0,966 a $3^{-1/32}$-hez hasonló rossz kitevő. A widget A/B ajánlata épp itt fordul át.`
        },
        {
          type: "single", shuffle: true,
          q: R`A véletlen robot (50–50%) értékei a folyosón $\gamma = 0{,}9$-cel: $V = (-5;\ 0;\ 5)$. Mennyi $Q(2, \text{jobbra})$?`,
          options: ["4,5", "5", "0", "2,5"],
          answer: 0,
          hint: R`$Q(2, \to) = r + \gamma\,V(3)$, a jutalom itt 0.`,
          explain: R`$0 + 0{,}9 \cdot 5 = 4{,}5$. Az 5 a diszkont elfelejtése, a 0 maga $V(2)$ (a két cselekvés átlaga), a 2,5 a $0{,}5 \cdot 5$ (a stratégia valószínűségével szorozva – de a $Q$ a cselekvés <b>után</b> számol).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a $V^\pi$ és $Q^\pi$ függvényekre?`,
          options: [
            R`$V^\pi(s) = \sum_a \pi(a \mid s)\,Q^\pi(s, a)$.`,
            "Ugyanaz az állapot más stratégia mellett más értékű.",
            R`$Q$-ból térkép nélkül is lehet dönteni: $\arg\max_a Q(s, a)$.`,
            "Az érték egy lépés azonnali jutalma.",
            "Az állapotérték nem függ a stratégiától, csak a környezettől."
          ],
          answer: [0, 1, 2],
          hint: "Az érték a jövő várható összege – és a jövő attól is függ, ki játszik tovább.",
          explain: R`Az állapotérték a cselekvésértékek stratégia szerinti átlaga. A 2. cella a véletlen robotnak 0-t, a „mindig jobbra” robotnak 9-et ér – az érték stratégiafüggő. A $V$-ből döntéshez tudni kell, hová visz egy lépés, a $Q$-ból nem. Az érték nem azonos a jutalommal: a folyosón minden belső lépés jutalma 0.`
        },
        {
          type: "single", shuffle: true,
          q: R`Értékiteráció a folyosón $\gamma = 0{,}5$-tel, 0-ról indulva, szinkron söprésekkel. Mi lesz a 3. söprés után $V = (V(1);\ V(2);\ V(3))$?`,
          options: [R`$(2{,}5;\ 5;\ 10)$`, R`$(0;\ 5;\ 10)$`, R`$(8{,}1;\ 9;\ 10)$`, R`$(5;\ 7{,}5;\ 10)$`],
          answer: 0,
          hint: "Söprésenként egy cellával terjed a töltő híre; minden cellában a régi számokból számolj.",
          explain: R`1.: $(0;\ 0;\ 10)$, 2.: $(0;\ 5;\ 10)$, 3.: $(2{,}5;\ 5;\ 10)$. A $(0;\ 5;\ 10)$ a 2. söprés állása, a $(8{,}1;\ 9;\ 10)$ a $\gamma = 0{,}9$-es eredmény, az $(5;\ 7{,}5;\ 10)$ összeadással számol szorzás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Csúszós padlón (20% helyben marad) a „mindig jobbra” stratégiával mennyi $V(3)$, $\gamma = 0{,}9$?`,
          options: ["kb. 9,76", "8", "10", "kb. 9,8"],
          answer: 0,
          hint: R`$V(3) = 0{,}8 \cdot 10 + 0{,}2 \cdot 0{,}9\,V(3)$ – oldd meg $V(3)$-ra!`,
          explain: R`$V(3)(1 - 0{,}18) = 8$, $V(3) = 8/0{,}82 \approx 9{,}76$. A 8 elfelejti, hogy a csúszás után is van még esély, a 9,8 az első söprés értéke (amikor a régi $V(3)$ még 10 volt), a 10 a csúszás nélküli érték.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi kell az értékiterációhoz, ami a Q-tanuláshoz nem?",
          options: [
            R`a környezet ismerete: az átmenet-valószínűségek $P(s' \mid s, a)$ és a jutalmak`,
            "felfedező (ε-mohó) stratégia",
            "egy neurális háló",
            "a tanulási ráta, α"
          ],
          answer: 0,
          hint: "Az értékiteráció minden lehetséges következményre átlagol. Honnan tudja, mik ezek?",
          explain: R`Az értékiteráció tervez: a Bellman-egyenlet átlagában a $P$ és az $r$ szerepel, tehát ismerni kell a térképet. Felfedezés és tanulási ráta a Q-tanuláshoz kell, nem az értékiterációhoz; neurális háló egyikhez sem szükséges.`
        }
      ]
    },

    /* ------------------------------------------------ 15.4 */
    "ai15-154": {
      title: "Kvíz – 15.4 Q-tanulás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$V(s) = 30$, a lépés jutalma 10, a következő állapot becsült értéke 35, $\gamma = 1$. Mennyi a TD-hiba?`,
          options: ["15", "5", "−15", "45"],
          answer: 0,
          hint: R`$\delta = r + \gamma V(s') - V(s)$.`,
          explain: R`$10 + 35 - 30 = 15$ – a villamosos példa. A 45 maga a TD-cél, az 5 a $35 - 30$ (a jutalom kimaradt), a −15 előjelhibás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Minden $Q = 0$, $\alpha = 0{,}5$, $\gamma = 0{,}9$. A robot kétszer egymás után végigmegy: 2. → jobbra → 3. → jobbra → töltő (+10). Mennyi $Q(2, \to)$ a második epizód után?`,
          options: ["2,25", "4,5", "0", "4,05"],
          answer: 0,
          hint: R`Az első epizódban a $Q(2, \to)$ frissítésekor $Q(3, \cdot)$ még 0 volt. Mennyi lett $Q(3, \to)$ az első epizód végére?`,
          explain: R`1. epizód: $Q(2, \to) = 0$, $Q(3, \to) = 5$. 2. epizód: $Q(2, \to) = 0 + 0{,}5\,(0 + 0{,}9 \cdot 5) = 2{,}25$. A 4,5 a $\gamma \cdot 5$ (az $\alpha$ kimaradt), a 4,05 a $0{,}9 \cdot 4{,}5$, a 0 az első epizód utáni érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`$Q(s, a) = 2$, $r = 0$, $Q(s', \cdot) = (1;\ 3;\ -2;\ 0)$, $\alpha = 0{,}1$, $\gamma = 0{,}9$. Mennyi az új $Q(s, a)$ Q-tanulással?`,
          options: ["2,07", "2,7", "1,99", "2,3"],
          answer: 0,
          hint: "A cél a legjobb következő cselekvés értékével számol.",
          explain: R`Cél: $0 + 0{,}9 \cdot 3 = 2{,}7$; új: $2 + 0{,}1 \cdot 0{,}7 = 2{,}07$. A 2,7 maga a cél ($\alpha = 1$), az 1,99 az átlagos $Q(s')$-sel ($0{,}5$) számol, a 2,3 a $\gamma$ nélkül ($2 + 0{,}1 \cdot 3$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanez a lépés, de SARSA-val, és a ténylegesen választott következő cselekvés az első ($Q = 1$). Mennyi az új $Q(s, a)$?`,
          options: ["1,89", "2,07", "2,11", "0,9"],
          answer: 0,
          hint: R`A SARSA célja $r + \gamma Q(s', a')$, a valóban választott $a'$-vel.`,
          explain: R`Cél: $0 + 0{,}9 \cdot 1 = 0{,}9$; új: $2 + 0{,}1\,(0{,}9 - 2) = 1{,}89$. A 2,07 a Q-tanulás eredménye, a 2,11 előjelhibás ($2 - 0{,}1 \cdot (0{,}9 - 2)$), a 0,9 maga a cél ($\alpha = 1$).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "A Q-tanulás off-policy: a mohó stratégia értékét tanulja, akármilyen viselkedéssel gyűjt adatot.",
            "A SARSA on-policy: a követett (felfedezést is tartalmazó) stratégia értékét tanulja.",
            "A szirten ε = 0,1 mellett a SARSA biztonságosabb utat tanul, mint a Q-tanulás.",
            "A Q-tanulás csak akkor működik, ha ismerjük az átmenet-valószínűségeket.",
            "A TD-tanulás megvárja az epizód végét, mielőtt frissít."
          ],
          answer: [0, 1, 2],
          hint: "Melyik módszer használja a ténylegesen következő cselekvést, és melyik a legjobbat? Melyik kell térkép?",
          explain: R`A Q-tanulás célja $\max_{a'} Q(s', a')$ – a viselkedéstől független; a SARSA a valóban választott $a'$-vel számol, ezért beárazza a felfedezést, és a szirten feljebb megy. A Q-tanulás modell nélküli (nem kell $P$), és a TD minden lépés után frissít – a végét a Monte-Carlo várja meg.`
        },
        {
          type: "match",
          q: "Párosítsd a módszert a céljával (a frissítés „cél” részével)!",
          pairs: [
            ["Monte-Carlo", R`a valódi hozam, $G$`],
            ["TD(0)", R`$r + \gamma V(s')$`],
            ["Q-tanulás", R`$r + \gamma \max_{a'} Q(s', a')$`],
            ["SARSA", R`$r + \gamma Q(s', a')$, a választott $a'$-vel`]
          ],
          hint: "Mind „régi + α · (cél − régi)” alakú – csak a cél más.",
          explain: R`A Monte-Carlo a teljes pálya valódi hozamát használja (pontos, de zajos, a végén). A TD egy lépés után a saját becslésből (bootstrapping). A Q-tanulás és a SARSA ugyanez cselekvésértékekre: a legjobb, illetve a ténylegesen választott következő cselekvéssel.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi történik, ha a Q-tanulást ε = 0-val (felfedezés nélkül) futtatod a raktárban, csupa 0 kezdőértékkel?",
          options: [
            "Könnyen beragad: amit egyszer nem próbál ki, annak a Q-értéke sosem változik.",
            "Gyorsabban tanul, mert sosem pazarol.",
            "Pontosan ugyanúgy tanul, mint ε = 0,1-gyel.",
            "Nem tud lépni, mert minden Q egyforma."
          ],
          answer: 0,
          hint: "Ugyanaz a gond, mint a mohó banditánál.",
          explain: R`Felfedezés nélkül a Q-tanulás is beragadhat: a rossz lépések Q-ja negatív lesz, a ki nem próbáltaké 0 marad, és ha egy hurok „elég jónak” tűnik, onnan nem lép ki. (A döntetlenek véletlen feloldása egy kis felfedezést ad, de nem garantálja a legjobb utat.) Lépni ε = 0-val is tud.`
        }
      ]
    },

    /* ------------------------------------------------ 15.5 */
    "ai15-155": {
      title: "Kvíz – 15.5 Mély RL és stratégia-gradiens",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`DQN-lépés: $r = 1$, a célháló legnagyobb értéke az új állapotban 3, $\gamma = 0{,}9$, a háló becslése $Q_\theta(s, a) = 2$. Mennyi a négyzetes veszteség?`,
          options: ["2,89", "1,7", "4", "0,49"],
          answer: 0,
          hint: R`Előbb a cél: $y = r + \gamma \max Q_{\bar\theta}$, aztán $(y - Q_\theta)^2$.`,
          explain: R`$y = 1 + 2{,}7 = 3{,}7$; $(3{,}7 - 2)^2 = 2{,}89$. Az 1,7 a hiba négyzetre emelés nélkül, a 4 a $\gamma$ elhagyásával ($(1 + 3 - 2)^2$), a 0,49 a $(2{,}7 - 2)^2$ (a jutalom kimaradt).`
        },
        {
          type: "multi",
          q: "Mire jó a DQN tapasztalat-visszajátszása és célhálója?",
          options: [
            "A visszajátszás közel független kötegeket ad az egymás utáni, nagyon hasonló lépések helyett.",
            "A visszajátszással minden tapasztalat többször is felhasználható.",
            "A célháló miatt a TD-cél nem mozog együtt a tanított hálóval.",
            "A célháló adja a jutalmat a környezet helyett.",
            "A visszajátszás miatt a DQN on-policy módszer lesz."
          ],
          answer: [0, 1, 2],
          hint: "Mi teszi instabillá a sima Q-tanulást egy hálóval? És mi kell ahhoz, hogy régi adatból tanulhass?",
          explain: R`A visszajátszás szétszedi a korrelált sorozatot, és újrahasznosít; a célháló befagyasztja a célt néhány ezer lépésre. A régi tapasztalatok használata épp off-policy tanulást kíván – a Q-tanulás ilyen. A jutalmat továbbra is a környezet adja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Softmax-stratégia, $\theta = (0;\ 0;\ 0)$. A C-t húztuk, $r = 1$, nincs alapvonal, $\alpha = 0{,}3$. Mi lesz az új $\theta$?`,
          options: [R`$(-0{,}1;\ -0{,}1;\ 0{,}2)$`, R`$(0;\ 0;\ 0{,}3)$`, R`$(-0{,}2;\ -0{,}2;\ 0{,}2)$`, R`$(0;\ 0;\ 0{,}2)$`],
          answer: 0,
          hint: R`$\Delta\theta_k = \alpha\,r\,(\mathbb 1[k = a] - \pi_k)$, és most minden $\pi_k = 1/3$.`,
          explain: R`$\theta_C$: $0{,}3 \cdot (1 - \tfrac13) = 0{,}2$; $\theta_A, \theta_B$: $0{,}3 \cdot (0 - \tfrac13) = -0{,}1$. A $(0;\ 0;\ 0{,}3)$ elfelejti a $-\pi_k$ tagot, a $(0;\ 0;\ 0{,}2)$ csak a választottat frissíti, a $(-0{,}2;\ -0{,}2;\ 0{,}2)$ rossz súllyal büntet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Alapvonal $b = 0{,}5$, a választott kar nem fizetett ($r = 0$). Mi történik a REINFORCE-frissítésnél?`,
          options: [
            "A választott kar esélye csökken, a többié nő.",
            "Semmi sem változik, mert a jutalom 0.",
            "A választott kar esélye nő, mert ki lett próbálva.",
            "Minden kar esélye egyformán csökken."
          ],
          answer: 0,
          hint: R`Az előny $r - b$. Mi az előjele?`,
          explain: R`Az előny $0 - 0{,}5 = -0{,}5$, negatív: a vártnál rosszabb kimenetel, ezért a választott cselekvés esélye csökken (a példában 33%-ról 30%-ra). Alapvonal nélkül ($r = 0$) valóban nem változna semmi. A valószínűségek összege 1 marad, ezért nem csökkenhet mind.`
        },
        {
          type: "multi",
          q: "Mit tesz az alapvonal a stratégia-gradiensben?",
          options: [
            "Csökkenti a gradiensbecslés zaját.",
            "Az átlagos gradienst (az irányt) nem változtatja.",
            "Csak a vártnál jobb kimenetel növeli a választott cselekvés esélyét.",
            "Deriválhatóvá teszi a jutalmat.",
            "Off-policy módszerré alakítja a REINFORCE-t."
          ],
          answer: [0, 1, 2],
          hint: R`Mennyi $\sum_a \pi(a)\,\nabla \ln \pi(a)$?`,
          explain: R`Mivel $\sum_a \pi(a)\nabla\ln\pi(a) = \nabla\sum_a\pi(a) = 0$, a $b$ levonása nem torzít, de a zajt csökkenti (a 20 futás szórása 0,21 → 0,10). A jutalomnak a REINFORCE-ban eleve nem kell deriválhatónak lennie, és az alapvonal nem változtat az on-policy jellegen.`
        },
        {
          type: "single", shuffle: true,
          q: R`PPO, $\epsilon = 0{,}2$: az előny $A = 2$, az arány $\rho = 1{,}5$. Mennyi a vágott cél, $\min(\rho A,\ \text{vág}(\rho) A)$?`,
          options: ["2,4", "3", "1,6", "2"],
          answer: 0,
          hint: R`A $\rho$-t a $[0{,}8;\ 1{,}2]$ sávba vágjuk, és a kettő közül a kisebbet vesszük.`,
          explain: R`$\rho A = 3$, a vágott $1{,}2 \cdot 2 = 2{,}4$, a minimum 2,4. A 3 a vágás nélküli cél, az 1,6 a sáv alsó szélével ($0{,}8 \cdot 2$), a 2 a $\rho = 1$.`
        },
        {
          type: "match",
          q: "Párosítsd a rendszert a legfontosabb újításával!",
          pairs: [
            ["DQN (2015)", "Atari-játékok képernyőből, visszajátszással és célhálóval"],
            ["AlphaGo (2016)", "emberi játszmák utánzása + önjáték + értékháló + fakeresés"],
            ["AlphaGo Zero (2017)", "emberi adat nélkül, csak önjátékkal"],
            ["MuZero (2019–2020)", "a játékszabályokat sem kapta meg: a világ modelljét is tanulja"]
          ],
          hint: "Az időrend segít: minden lépés egy korábbi mankót hagy el.",
          explain: R`A DQN mutatta meg, hogy egy háló képből tanulhat RL-lel. Az AlphaGo utánzással indult, aztán önjátékkal és kereséssel lett világbajnoki szintű. A Zero az emberi adatot, a MuZero a szabályokat is elhagyta.`
        }
      ]
    },

    /* ------------------------------------------------ 15.6 */
    "ai15-156": {
      title: "Kvíz – 15.6 A jutalom tervezése és kijátszása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Potenciál-alapú alakítás, $\Phi = -$(távolság a céltól), $\gamma = 0{,}9$. Mennyi $F$, ha az ágens 3 lépés távolságról 2-re lép?`,
          options: ["1,2", "1", "−0,7", "0,9"],
          answer: 0,
          hint: R`$F = \gamma\,\Phi(s') - \Phi(s)$.`,
          explain: R`$0{,}9 \cdot (-2) - (-3) = 1{,}2$. Az 1 a diszkont nélküli különbség, a −0,7 a visszalépés (2-ről 3-ra) értéke, a 0,9 csak a $\gamma$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért nem változtatja meg a potenciál-alapú alakítás a legjobb stratégiát?`,
          options: [
            R`Mert egy pálya alakító jutalmainak diszkontált összege teleszkopikusan $-\Phi(s_0)$ – minden pályán ugyanannyi.`,
            "Mert az alakító jutalom mindig 0.",
            "Mert csak a célba lépéskor ad jutalmat.",
            "Mert a visszalépés mindig pontosan annyi büntetést kap, amennyi jutalmat a közeledés."
          ],
          answer: 0,
          hint: R`Írd fel az összeget: $\sum_t \gamma^t(\gamma\Phi(s_{t+1}) - \Phi(s_t))$. Mi esik ki?`,
          explain: R`A szomszédos tagok kiejtik egymást, csak $-\Phi(s_0)$ marad (a végállapotban $\Phi = 0$). Ez minden stratégiára ugyanaz az eltolás, ezért a sorrendjük nem változik. Az alakító jutalom nem mindig 0, és egy oda-vissza lépés diszkontált összege sem pontosan 0 (a példában 0,57) – csak a teljes pályáé állandó.`
        },
        {
          type: "single", shuffle: true,
          q: R`A versenypályán a bója minden belépésért +1-et ad, és azonnal újratöltődik; a cél +10 öt lépésre. Mit tesz az optimális ágens $\gamma = 0{,}99$-nél?`,
          options: [
            "Örökké a bója körül köröz, mert az ér többet (kb. 48,8 vs. 9,6).",
            "Célba megy, mert a +10 nagyobb, mint az +1.",
            "Egyszer felveszi a bóját, aztán célba megy.",
            "Helyben marad, mert minden lépés diszkontál."
          ],
          answer: 0,
          hint: R`Körözés: $\gamma^3/(1 - \gamma^2)$; célba érés: $10\gamma^4$.`,
          explain: R`$0{,}99^3/(1 - 0{,}99^2) \approx 48{,}8$, $10 \cdot 0{,}99^4 \approx 9{,}6$: a türelmes ágens a végtelenül ismételhető pontforrást választja. $\gamma = 0{,}9$-nél fordított a helyzet (3,84 vs. 6,56). Ez a hajóverseny-játék kiskapuja.`
        },
        {
          type: "multi",
          q: "Melyik jutalom-kijátszás?",
          options: [
            "A Tetris-program örökre szünetelteti a játékot, hogy ne veszítsen.",
            "A robotkar a kezét a kamera és a labda közé teszi, hogy úgy tűnjön, megfogta.",
            "Egy porszívórobot kiüríti a tartályát, és újra felszívja ugyanazt a port.",
            "Egy ágens a szirten a legrövidebb utat tanulja meg.",
            "Egy bandita-algoritmus egyre többször húzza a legjobb automatát."
          ],
          answer: [0, 1, 2],
          hint: "Melyikben ér el az ágens magas jutalmat olyan viselkedéssel, amit a tervező nem akart?",
          explain: R`A Tetris-szünet, a kamera becsapása és a por újrahasznosítása mind a mérőszám kijátszása: a jutalom nő, a valódi cél nem teljesül. A szirt legrövidebb útja és a legjobb automata gyakori húzása épp a kívánt viselkedés.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit mond Goodhart törvénye?",
          options: [
            "Ha egy mérőszám céllá válik, megszűnik jó mérőszám lenni.",
            "A jobb algoritmus mindig a kívánt viselkedést tanulja meg.",
            "A jutalomnak mindig ritkának kell lennie.",
            "A diszkonttényezőt 1-hez közel kell választani."
          ],
          answer: 0,
          hint: "A törvény a közgazdaságtanból jön, és a mérés és a cél viszonyáról szól.",
          explain: R`Minél erősebben optimalizálunk egy mérőszámot, annál inkább kihasználjuk a mérőszám és a valódi cél közötti rést. Ezért talál egy erős RL-ágens több kiskaput, mint egy gyenge – nem fordítva.`
        },
        {
          type: "match",
          q: "Párosítsd a nehézséget a válasszal!",
          pairs: [
            ["sok próbálkozás kell", "szimuláció, modellalapú RL"],
            ["a szimulátor nem pontosan olyan, mint a valóság", "tartomány-véletlenítés"],
            ["csak régi naplók vannak", "offline RL, óvatosan"],
            ["ritka a jutalom", "potenciál-alapú alakítás, kíváncsiság"]
          ],
          hint: "Melyik válasz a „sok különböző szimulált világ”?",
          explain: R`A mintaigényt a szimuláció és a világmodell csökkenti. A sim-to-real rést a változatos szimulátorbeállítások (tartomány-véletlenítés) hidalják át. Próbálgatás nélkül offline RL kell, a naplótól eltérő cselekvések büntetésével. Ritka jutalomnál alakítás és célzott felfedezés segít.`
        }
      ]
    },

    /* ------------------------------------------------ 15.7 */
    "ai15-157": {
      title: "Kvíz – 15.7 RL a nagy nyelvi modellekben",
      questions: [
        {
          type: "match",
          q: "Párosítsd az RL-fogalmat a szöveggenerálásbeli megfelelőjével!",
          pairs: [
            ["állapot", "a prompt és az eddig generált tokenek"],
            ["cselekvés", "a következő token"],
            ["stratégia", "maga a nyelvi modell"],
            ["epizód", "egy teljes válasz"],
            ["jutalom", "egy értékelő pontszáma a válasz végén"]
          ],
          hint: "A modell tokenről tokenre dönt, a jutalom általában csak a végén jön.",
          explain: R`A szöveggenerálás döntéssorozat: az állapot az eddigi szöveg, a cselekvés a következő token, a stratégia a modell $\pi_\theta(\text{token} \mid \text{szöveg})$ eloszlása. Egy válasz egy epizód, a jutalmat a végén egy jutalommodell, ember vagy ellenőrző program adja.`
        },
        {
          type: "single", shuffle: true,
          q: R`A jutalommodell az A válaszra 2-t, a B-re 0,5-öt ad. Mekkora eséllyel jósolja, hogy egy ember az A-t választja?`,
          options: ["kb. 0,82", "0,8", "kb. 0,62", "1,5"],
          answer: 0,
          hint: R`Bradley–Terry: $P(A \succ B) = \sigma(r_A - r_B)$.`,
          explain: R`$\sigma(1{,}5) \approx 0{,}82$. A 0,8 a $2/2{,}5$ arány (nem így működik), a 0,62 a $\sigma(0{,}5)$, az 1,5 maga a különbség – valószínűség nem lehet 1-nél nagyobb.`
        },
        {
          type: "single", shuffle: true,
          q: R`RLHF: a jutalommodell 2,0-t ad, a válasz log-aránya a referencia modellhez képest 3, $\beta = 0{,}1$. Mennyi a teljes jutalom?`,
          options: ["1,7", "2,3", "1,4", "−1,0"],
          answer: 0,
          hint: R`$r - \beta \ln(\pi/\pi_{\text{ref}})$.`,
          explain: R`$2{,}0 - 0{,}1 \cdot 3 = 1{,}7$. A 2,3 előjelhibás (a KL büntetés, nem jutalom), az 1,4 a $\beta = 0{,}2$, a −1,0 a $\beta$ elhagyása ($2 - 3$).`
        },
        {
          type: "multi",
          q: "Miért kell a KL-büntetés az RLHF-ben?",
          options: [
            "Mert a jutalommodell csak közelíti az emberi ítéletet, és vannak kijátszható gyengéi.",
            "Hogy a tanított modell a kiinduló modell közelében maradjon.",
            "Hogy fékezze a jutalom-kijátszást (hosszúság, hízelgés).",
            "Mert nélküle a jutalom nem lenne deriválható.",
            "Mert a KL-büntetés adja a jutalmat a jutalommodell helyett."
          ],
          answer: [0, 1, 2],
          hint: "Mi történik, ha a modell nagyon messzire megy a jól ismert területtől?",
          explain: R`A jutalommodell egy mérőszám – messze a kiindulástól a modell megtalálja a gyengéit. A KL-tag póráz: a kiinduló modell közelében tartja a stratégiát. A stratégia-gradienshez eleve nem kell deriválható jutalom, és a KL nem helyettesíti a jutalmat, csak kiegészíti.`
        },
        {
          type: "single", shuffle: true,
          q: R`GRPO: négy válasz jutalma $(1;\ 0;\ 0;\ 1)$. Mennyi az előnyük?`,
          options: [R`$(+1;\ -1;\ -1;\ +1)$`, R`$(+0{,}5;\ -0{,}5;\ -0{,}5;\ +0{,}5)$`, R`$(1;\ 0;\ 0;\ 1)$`, R`$(+2;\ -2;\ -2;\ +2)$`],
          answer: 0,
          hint: "Átlag és szórás a csoporton belül, aztán (jutalom − átlag) / szórás.",
          explain: R`Átlag 0,5, szórás 0,5: $(1 - 0{,}5)/0{,}5 = 1$, $(0 - 0{,}5)/0{,}5 = -1$. A $\pm 0{,}5$ nem osztott a szórással, az $(1;\ 0;\ 0;\ 1)$ maga a jutalom (alapvonal nélkül), a $\pm 2$ a szórással szoroz osztás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy feladatra a modell mind a 8 próbálkozása helyes. Mit tanul ebből a GRPO?`,
          options: [
            "Semmit: minden előny 0.",
            "Erősen megnöveli mind a 8 válasz valószínűségét.",
            "Csökkenti a leghosszabb válasz valószínűségét.",
            "A KL-tag miatt eltávolodik a kiinduló modelltől."
          ],
          answer: 0,
          hint: "Mennyi a csoportátlag, és mennyi egy válasz jutalma ehhez képest?",
          explain: R`Minden jutalom 1, az átlag 1, minden előny 0 – nincs „vártnál jobb” válasz. A túl könnyű (vagy túl nehéz) feladat nem ad jelet; ezért úgy válogatják a tanítófeladatokat, hogy a modell néha oldja meg őket.`
        },
        {
          type: "multi",
          q: "Melyik feladathoz adható ellenőrizhető jutalom (RLVR)?",
          options: [
            "egy egyenlet megoldása, ismert végeredménnyel",
            "egy függvény megírása, tesztekkel",
            "egy kért JSON-formátum betartása",
            "egy vers szépsége",
            "egy tanács hasznossága"
          ],
          answer: [0, 1, 2],
          hint: "Lehet-e egy programmal eldönteni, hogy jó-e a válasz?",
          explain: R`A végeredmény egyezése, a tesztek lefutása és a formátum programmal ellenőrizhető. A vers szépsége és a tanács hasznossága ízlés kérdése – ott jutalommodell vagy emberi ítélet kell. (Az ellenőrző is kijátszható: egy modell megtanulhatja a teszteket kikerülni.)`
        }
      ]
    },

    /* ------------------------------------------------ 15.8 */
    "ai15-158": {
      title: "Kvíz – 15.8 Alkalmazás: a raktár és a szirt",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A raktárban a Q-tanulás (300 epizód) végén a start $\max Q$-ja kb. 0,629. Mivel egyezik meg ez?`,
          options: [
            R`az értékiteráció $V^*(\text{start})$-jával`,
            "a tanulás közbeni átlagos hozammal (2,77)",
            "a legrövidebb út hosszával",
            "az optimális hozammal diszkont nélkül (4)"
          ],
          answer: 0,
          hint: "A Q-tanulás a Bellman-optimalitási egyenlet mintavételes megoldása.",
          explain: R`A Q-tanulás térkép nélkül ugyanoda jut, mint a tervezés: $V^*(\text{start}) = 0{,}629$ ($\gamma = 0{,}9$ diszkonttal). A 4 diszkont nélküli hozam, a 2,77 a felfedezéssel csökkentett, tanulás közbeni hozam, a 7 a lépésszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért csak 2,77 a Q-tanulás átlagos hozama a raktárban (az utolsó 50 epizódban), ha az optimális 4?`,
          options: [
            "Mert ε = 0,1 mellett az ágens tanulás közben is néha véletlenül lép.",
            "Mert a Q-tanulás nem találja meg a legrövidebb utat.",
            "Mert a raktár véletlen (csúszós).",
            "Mert a diszkont miatt a hozam mindig kisebb."
          ],
          answer: 0,
          hint: "Mi a felfedezés ára?",
          explain: R`A mohó út optimális (7 lépés), de ε = 0,1-gyel minden tizedik lépés véletlen: kerülők, olajfolt. A kísérletben a padló nem csúszós, és a 2,77 diszkont nélküli hozam – a felfedezés ára.`
        },
        {
          type: "multi",
          q: "Mi igaz a szirt-kísérletre (ε = 0,1)?",
          options: [
            "A Q-tanulás mohó útja a szakadék szélén vezet (11 lépés).",
            "A SARSA biztonságosabb, hosszabb utat tanul (15 lépés).",
            "Tanulás közben a SARSA átlagos hozama jobb (−22,6 vs. −39,9).",
            "A Q-tanulás tanulás közben ritkábban esik le, mint a SARSA.",
            "A két módszer ε-tól függetlenül ugyanazt az utat tanulja."
          ],
          answer: [0, 1, 2],
          hint: "Melyik módszer árazza be a saját véletlen lépéseit?",
          explain: R`A Q-tanulás a tökéletes jövőt feltételezi, ezért a szélen megy – és tanulás közben sokszor leesik (500 epizódból 105-ben). A SARSA a felfedezéssel együtt értékel, ezért feljebb megy, és csak 30 epizódban esik le. Kis ε-nál (0,01) közelednek: a SARSA is 13 lépésesre rövidít.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik módszert választanád egy drága, valódi robothoz, amely tanulás közben sem eshet le a szirtről?",
          options: [
            "SARSA (on-policy), lehetőleg szimulátorban előtanítva",
            "Q-tanulás nagy ε-nal",
            "tiszta mohó stratégia",
            "REINFORCE alapvonal nélkül"
          ],
          answer: 0,
          hint: "A tanulás közbeni hibák a drágák.",
          explain: R`A SARSA beárazza a saját felfedezését, ezért távol tart a veszélytől; a szimulátor a próbálgatást ingyenessé teszi. A nagy ε-ú Q-tanulás tanulás közben sokszor esne le, a mohó beragadhat, az alapvonal nélküli REINFORCE zajos.`
        },
        {
          type: "single", shuffle: true,
          q: "A fejezet első rejtvénye: honnan „tudja meg” a robot, hogy a harmadik lépése volt jó, ha jutalmat csak a töltőnél kap?",
          options: [
            "A harmadik lépés egy értékesebb állapotba vitte – az értékek epizódról epizódra visszaszivárognak a töltőtől.",
            "Sehogy: csak az utolsó lépés kap hitelt.",
            "Minden lépés egyformán megkapja a +10-et.",
            "A robot emlékszik az egész pályára, és a végén kiszámolja."
          ],
          answer: 0,
          hint: "Gondolj a Bellman-egyenletre és a három epizód táblázatára.",
          explain: R`A Bellman-egyenlet szerint egy állapot értéke a következő jutalom plusz a következő állapot értéke. A TD- és a Q-tanulás minden lépésben egy kicsit visszaviszi a töltő értékét, így a korábbi lépések is hitelt kapnak – a jobbak többet. (A Monte-Carlo valóban a végén számol, de egyformán osztja ki a hozamot, a diszkont szerint.)`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai15-final": {
      title: "Fejezetzáró teszt – Megerősítéses tanulás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Melyik feladat illik leginkább a többkarú bandita keretébe?",
          options: [
            "Egy hírportál eldönti, melyik címet mutassa egy cikknek, és a kattintást méri.",
            "Egy robot egy labirintusból keres kiutat.",
            "Egy program sakkot tanul.",
            "Képek osztályozása címkézett adatból."
          ],
          answer: 0,
          hint: "Egyetlen döntés, azonnali visszajelzés, csak a választottról?",
          explain: R`A címválasztás egy döntés, azonnali jutalommal (kattintás), és a döntés nem befolyásolja a következő állapotot – bandita. A labirintus és a sakk döntéssorozat (MDP), a képosztályozás felügyelt tanulás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Jutalmak: $2, 0, 0, 5$, $\gamma = 0{,}9$. Mennyi a hozam az elejétől?`,
          options: ["5,645", "7", "6,05", "3,645"],
          answer: 0,
          hint: R`A negyedik jutalom súlya $\gamma^3$.`,
          explain: R`$2 + 0{,}9^3 \cdot 5 = 2 + 3{,}645 = 5{,}645$. A 7 a diszkont nélküli összeg, a 6,05 a $\gamma^2$-tel számol, a 3,645 elhagyja az első, azonnali jutalmat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy kar, ε = 0,2. Mekkora eséllyel választja az ágens egy adott, nem a legjobbnak hitt kart?`,
          options: ["0,05", "0,2", "0,067", "0,85"],
          answer: 0,
          hint: "Csak a véletlen választásban jöhet ki, és ott négy kar közül egyenletesen.",
          explain: R`$0{,}2 \cdot \tfrac14 = 0{,}05$. A 0,85 a legjobbnak hitt kar esélye ($0{,}8 + 0{,}05$), a 0,2 a teljes felfedezés, a 0,067 a $0{,}2/3$ (a legjobbnak hitt kart kihagyja a véletlen választásból).`
        },
        {
          type: "single", shuffle: true,
          q: R`$V(s) = 9$, a lépés jutalma 0, $V(s') = 9$, $\gamma = 0{,}9$. Mennyi a TD-hiba?`,
          options: ["−0,9", "0", "8,1", "0,9"],
          answer: 0,
          hint: R`$\delta = r + \gamma V(s') - V(s)$.`,
          explain: R`$0 + 8{,}1 - 9 = -0{,}9$: az érték túl nagy (vagy a $V(s')$ túl kicsi). A 0 a $\gamma$ elhagyásával jönne ki, a 8,1 maga a TD-cél, a 0,9 előjelhibás.`
        },
        {
          type: "single", shuffle: true,
          q: R`$Q(s, a) = 1$, $r = -1$, $Q(s', \cdot) = (2;\ 4;\ 0;\ 1)$, a ténylegesen választott $a'$ értéke 0, $\alpha = 0{,}5$, $\gamma = 1$. Mennyi az új $Q(s, a)$ Q-tanulással, illetve SARSA-val?`,
          options: ["2 és 0", "0 és 2", "3 és −1", "2 és 2"],
          answer: 0,
          hint: "A két cél: a legjobb, illetve a ténylegesen választott következő cselekvés értékével.",
          explain: R`Q-tanulás: cél $-1 + 4 = 3$, új $1 + 0{,}5 \cdot 2 = 2$. SARSA: cél $-1 + 0 = -1$, új $1 + 0{,}5 \cdot (-2) = 0$. A „3 és −1” maguk a célok ($\alpha = 1$), a „0 és 2” felcseréli a módszereket.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az értékiterációra?",
          options: [
            "Ismernie kell az átmenet-valószínűségeket és a jutalmakat.",
            R`$\gamma \lt 1$ mellett minden söprés legalább $\gamma$-szorosára csökkenti a legnagyobb hibát.`,
            "A folyosón söprésenként egy cellával terjed a töltő értéke.",
            "Felfedezés kell hozzá.",
            "Óriási állapottérben (go) is közvetlenül használható."
          ],
          answer: [0, 1, 2],
          hint: "Tervezés vagy tanulás? És mennyi munka egy söprés?",
          explain: R`Az értékiteráció tervezés: a teljes térképet használja, felfedezés nélkül. A frissítés összehúzó leképezés, ezért mértani sebességgel konvergál; a folyosón 3 söprés kell. Go-ban egyetlen söprés is lehetetlen ($10^{170}$ állás).`
        },
        {
          type: "single", shuffle: true,
          q: "Miért stratégia-gradienssel (és nem Q-tanulással) tanítják a nyelvi modelleket RL-lel?",
          options: [
            R`Mert a cselekvéstér (a szótár) óriási, és a modell eleve egy valószínűségi stratégia – a $\max$ helyett a valószínűségeket kell tolni.`,
            "Mert a Q-tanulás csak képekre működik.",
            "Mert a nyelvi modellek jutalma deriválható.",
            "Mert a stratégia-gradienshez nem kell jutalom."
          ],
          answer: 0,
          hint: "Hány cselekvés van egy lépésben, és milyen kimenetet ad a modell?",
          explain: R`Több tízezer–százezer token közül kell választani, és a modell softmax-eloszlást ad – ez természetes stratégia. A Q-tanulás nem csak képekre jó; a stratégia-gradiens előnye épp az, hogy a jutalomnak <b>nem</b> kell deriválhatónak lennie; jutalom viszont kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`A naiv alakítás (+1 minden közeledésért, 0 a távolodásért) mellett egy végtelen oda-vissza lépkedés értéke $\gamma = 0{,}99$-nél kb. 50, a célba érésé kb. 14,5. Mit tanulsz ebből?`,
          options: [
            "A naiv részjutalom kiskaput nyit: a türelmes ágens a haladás jutalmát bányássza, és nem ér célba.",
            "A részjutalom mindig gyorsítja a tanulást, mellékhatás nélkül.",
            "A nagyobb γ mindig jobb viselkedést ad.",
            "Az ágens hibásan számol, mert az oda-vissza lépkedés nem ér semmit."
          ],
          answer: 0,
          hint: "Kerül-e valamibe a távolodás?",
          explain: R`Mivel a távolodás nem büntetett, a „közeledés” végtelenül ismételhető. Az ágens jól számol – a jutalom hibás. A potenciál-alapú forma ($\gamma\Phi(s') - \Phi(s)$) ezt kizárja, és a nagyobb γ itt épp a kijátszást segíti.`
        },
        {
          type: "single", shuffle: true,
          q: R`REINFORCE, két cselekvés, $\pi = (0{,}25;\ 0{,}75)$, az elsőt választottuk, $G = 2$, $b = 1$, $\alpha = 0{,}5$. Mennyivel változik $\theta_1$?`,
          options: ["+0,375", "+0,75", "−0,375", "+0,125"],
          answer: 0,
          hint: R`$\Delta\theta_1 = \alpha (G - b)(1 - \pi_1)$.`,
          explain: R`$0{,}5 \cdot 1 \cdot 0{,}75 = 0{,}375$. A +0,75 az alapvonalat felejti el ($G = 2$-vel), a −0,375 a $\theta_2$ változása, a +0,125 a $\pi_1$-gyel szoroz $(1 - \pi_1)$ helyett.`
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a legjobban illő módszerrel!",
          pairs: [
            ["ismert térkép, kis állapottér", "értékiteráció"],
            ["ismeretlen világ, kis állapottér, olcsó próbálkozás", "táblázatos Q-tanulás"],
            ["képernyőt látó ágens, 18 gomb", "DQN"],
            ["nyelvi modell matekfeladatokon", "ellenőrizhető jutalom + GRPO"],
            ["egy döntés, azonnali kattintás-visszajelzés", "UCB bandita"]
          ],
          hint: "Döntési táblázat: ismert-e a világ, mekkora az állapot- és a cselekvéstér, egy vagy sok döntés?",
          explain: R`Ismert térképnél tervezünk; ismeretlennél, kis térben tanulunk Q-táblával; képi állapotnál háló kell (DQN); óriási, valószínűségi cselekvéstérnél stratégia-gradiens (GRPO, ellenőrző programmal); egyetlen ismételt döntésnél bandita.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi az RLHF jutalommodelljének tipikus kijátszása?",
          options: [
            "A modell bőbeszédű és hízelgő lesz, mert az értékelők az ilyen válaszokat kedvelték.",
            "A modell nem tud több választ generálni.",
            "A modell elfelejti a tokenizálást.",
            "A jutalommodell kijátszása lehetetlen, mert emberi adatokon tanult."
          ],
          answer: 0,
          hint: "A jutalommodell is csak egy mérőszám – mit mér, és mi a valódi cél?",
          explain: R`A jutalommodell az emberi ítéletek gyengéit is megtanulja: a hosszú, egyetértő, magabiztos válaszokat. Az RL ezeket felerősíti – ez a jutalom-kijátszás nyelvi változata. Ezért kell a KL-póráz, és ezért vonzó az ellenőrizhető jutalom.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a fejezet egészére?",
          options: [
            "A bandita, a TD, a Q-tanulás és a SARSA frissítése mind „régi + lépésköz · (cél − régi)” alakú.",
            "Felfedezés nélkül a ki nem próbált cselekvésekről nem lehet tanulni.",
            "Az RL-ágens azt optimalizálja, amit a jutalom mér, nem azt, amit a tervező gondolt.",
            "Ha van címkézett adat a helyes döntésekről, az RL mindig jobb a felügyelt tanulásnál.",
            "Egyetlen RL-futás eredménye megbízható összevetési alap két algoritmus között."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a hüvelykujjszabályokra!",
          explain: R`A közös frissítési forma, a felfedezés szükségessége és a „azt kapod, amit mérsz” a fejezet három fő tanulsága. Ha van címke, a felügyelt tanulás egyszerűbb és megbízhatóbb; és az RL-eredmények érzékenyek a véletlenre – mindig több futás átlagát kell nézni.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
