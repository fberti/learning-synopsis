/* =========================================================
   Mesterséges intelligencia 3. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 3.1 */
    "ai3-31": {
      title: "Kvíz – 3.1 Adat: minta, jellemző, címke",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy táblázatnak 200 sora van, az oszlopai: azonosító, 6 mérési adat és az ár. Az árat jósoljuk. Mennyi $n$ és $d$?",
          options: [R`$n = 200$, $d = 6$`, R`$n = 200$, $d = 8$`, R`$n = 6$, $d = 200$`, R`$n = 200$, $d = 7$`],
          answer: 0,
          hint: "A sor a minta. Melyik oszlop nem jellemző – és melyik az, amelyik a címke?",
          explain: R`$n = 200$ minta (sor), $d = 6$ jellemző. Az azonosító nem jellemző, az ár a címke. A $d = 8$ mindkettőt, a $d = 7$ az egyiket beszámolja; a $n = 6$, $d = 200$ felcseréli a sort és az oszlopot.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik feladat osztályozás (és nem regresszió)?",
          options: ["egy kártyatranzakció csalás-e", "a holnapi csúcshőmérséklet", "egy lakás eladási ára", "egy ügyfél jövő havi költése forintban"],
          answer: 0,
          hint: "Szám vagy kategória a címke?",
          explain: "A csalás igen/nem kategória: osztályozás. A másik három címke szám: regresszió."
        },
        {
          type: "multi",
          q: "Melyik használható jellemzőként egy <em>most meghirdetett</em> lakás árának becslésénél?",
          options: ["alapterület", "emelet", "kerület", "hány nap alatt kelt el", "a végső eladási ár", "a hirdetés azonosítója"],
          answer: [0, 1, 2],
          hint: "Ismert-e az adat a jóslás pillanatában? És mond-e valamit a lakásról?",
          explain: "Az alapterület, az emelet és a kerület a meghirdetéskor ismert. Az eladási idő és a végső ár csak az eladás után derül ki (adatszivárgás, az ár ráadásul maga a címke); az azonosító nem jellemzi a lakást."
        },
        {
          type: "match",
          q: "Párosítsd a fogalmakat a lakásos példával!",
          pairs: [
            ["minta", "egy eladott lakás (egy sor)"],
            ["jellemző", "az alapterület oszlopa"],
            ["címke", "az eladási ár"],
            [R`$n$`, "a sorok (lakások) száma"],
            [R`$d$`, "a jellemzők száma"]
          ],
          hint: "Sor, bemeneti oszlop, jósolandó oszlop – és a két méret.",
          explain: R`A minta egy sor, a jellemző egy bemeneti oszlop, a címke a jósolandó érték. $X$ alakja $n\times d$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lakástáblázat (alapterület, szobák, emelet) sorai: (20, 1, 2), (40, 2, 0), (50, 2, 3), (60, 3, 1), (80, 3, 4). Mennyi $x_{42}$?`,
          options: ["3", "1", "60", "2"],
          answer: 0,
          hint: "Az első index a sor (a minta), a második az oszlop (a jellemző).",
          explain: R`4. sor, 2. oszlop: a negyedik lakás szobaszáma, 3. Az 1 az $x_{43}$ (emelet), a 60 az $x_{41}$ (alapterület), a 2 az $x_{32}$ (a harmadik lakás szobái) – sor és oszlop felcserélve.`
        }
      ]
    },

    /* ------------------------------------------------ 3.2 */
    "ai3-32": {
      title: "Kvíz – 3.2 Modell: paraméteres függvény",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A modell $\hat y = 0{,}7x + 10$ (millió Ft, $x$ m²-ben). Mit jósol egy 60 m²-es lakásra?`,
          options: ["52", "42", "49", "600,7"],
          answer: 0,
          hint: "Szorozd az alapterületet a súllyal, és add hozzá az eltolást.",
          explain: R`$0{,}7\cdot60 + 10 = 42 + 10 = 52$. A 42-ből kimaradt a $b$; a 49 a $0{,}7\cdot(60 + 10)$ hibás zárójelezés; a 600,7 felcseréli $w$-t és $b$-t ($10\cdot60 + 0{,}7$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy egyenes modell 40 m²-re 34, 60 m²-re 48 millió Ft-ot jósol. Mennyi $w$ és $b$?",
          options: [R`$w = 0{,}7$, $b = 6$`, R`$w = 0{,}7$, $b = 34$`, R`$w \approx 1{,}43$, $b \approx -23{,}1$`, R`$w = 14$, $b = -526$`],
          answer: 0,
          hint: R`$w$ = a jóslat változása osztva az alapterület változásával; aztán $b = \hat y - w x$ egy ismert pontból.`,
          explain: R`$w = (48 - 34)/(60 - 40) = 14/20 = 0{,}7$, $b = 34 - 0{,}7\cdot40 = 6$. A $b = 34$ az első jóslat; az 1,43 fordított hányados ($20/14$); a 14 osztás nélküli különbség.`
        },
        {
          type: "multi",
          q: R`Az $\hat y = wx + b$ modellben mi <b>paraméter</b>?`,
          options: [R`$w$`, R`$b$`, R`$x$ (alapterület)`, R`$y$ (ár)`, R`$\hat y$ (jóslat)`],
          answer: [0, 1],
          hint: "Melyik szám a modellé, és melyik az adaté vagy a kimenet?",
          explain: R`A paraméterek a modell állítható számai: $w$ és $b$. Az $x$ jellemző, az $y$ címke (adat), az $\hat y$ a modell kimenete.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lakásmodellben $w = 0{,}7$ millió Ft/m². Mit jelent ez?`,
          options: [
            "A modell szerint 10 m²-rel nagyobb lakás 7 millióval drágább.",
            "Egy négyzetméter 0,7 forintot ér.",
            "A modell 70%-ban pontos.",
            "A lakás ára mindig az alapterület 0,7-szerese."
          ],
          answer: 0,
          hint: "Mennyivel változik a jóslat, ha $x$ eggyel nő? Figyelj a mértékegységre!",
          explain: R`A súly a meredekség: 1 m² többlet → 0,7 millió Ft többlet, 10 m² → 7 millió. Nem forint, hanem millió forint; nem pontosság; és az ár nem csak $0{,}7x$, mert van eltolás is.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit választunk mi, és mit állít be a tanítás?",
          options: [
            "A modellcsaládot (pl. egyeneseket) mi, a paramétereket a tanítás.",
            "A paramétereket mi, a modellcsaládot a tanítás.",
            "Mindkettőt a tanítás.",
            "Mindkettőt mi."
          ],
          answer: 0,
          hint: "Mit kell eldönteni, mielőtt egyáltalán tanítani tudnánk?",
          explain: "A forma (egyenes, parabola, neurális háló) a mi döntésünk; a tanítás csak ezen a családon belül keresi a legjobb paramétereket. Ha a családban nincs jó függvény, a tanítás sem segít."
        }
      ]
    },

    /* ------------------------------------------------ 3.3 */
    "ai3-33": {
      title: "Kvíz – 3.3 Veszteség",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy modell hibái három mintán: $2, -1, -1$. Mennyi az MSE?`,
          options: ["2", "0", "≈ 1,33", "6"],
          answer: 0,
          hint: "Négyzetre emelés, aztán átlag.",
          explain: R`$(4 + 1 + 1)/3 = 2$. A 0 az előjeles átlag (a hibák kiejtik egymást); az 1,33 a MAE ($4/3$); a 6 a négyzetek összege, átlagolás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hibák: $3, 3, 1, 1, -3$ (millió Ft). Mennyi az RMSE?`,
          options: ["≈ 2,41", "5,8", "2,2", "1"],
          answer: 0,
          hint: "Előbb az MSE, aztán gyökvonás.",
          explain: R`MSE $= 29/5 = 5{,}8$, RMSE $= \sqrt{5{,}8} \approx 2{,}41$ millió Ft. Az 5,8 maga az MSE, a 2,2 a MAE, az 1 az előjeles átlag.`
        },
        {
          type: "single", shuffle: true,
          q: R`P modell hibái: $2, 2, 2, 2, 2$; Q modellé: $0, 0, 0, 0, 10$. Melyik igaz?`,
          options: [
            "A MAE-jük egyenlő, de a Q MSE-je ötször akkora.",
            "Az MSE-jük egyenlő, a MAE-jük különbözik.",
            "A P MSE-je a nagyobb, mert minden mintán téved.",
            "A Q mindkét mérce szerint jobb, mert négy mintán hibátlan."
          ],
          answer: 0,
          hint: "Számold ki mindkettőt: abszolút értékek átlaga, illetve négyzetek átlaga.",
          explain: R`MAE: $10/5 = 2$ mindkettőnél. MSE: P-nél $20/5 = 4$, Q-nál $100/5 = 20$. A négyzet a nagy hibát jobban bünteti.`
        },
        {
          type: "multi",
          q: R`Melyik igaz a lineáris regresszió $L(w, b)$ MSE-veszteségére?`,
          options: [
            "Rögzített adat mellett a paraméterek függvénye.",
            "Felfelé nyíló, konvex tál.",
            "A legmélyebb pontjában a gradiens nulla.",
            R`A változója $x$, az alapterület.`,
            "Több külön völgye (helyi minimuma) is lehet."
          ],
          answer: [0, 1, 2],
          hint: "Mi a változó a veszteségben, és milyen alakú egy négyzetösszeg a paraméterekben?",
          explain: R`A veszteségben a paraméterek a változók, az adat rögzített. Az MSE a paraméterekben másodfokú, konvex: egyetlen minimum, ott a gradiens nulla. Az $x$ a <em>modell</em> változója; több völgy a neurális hálóknál fordul elő.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lakásokon, $b = 4$ mellett $L(w) = 0{,}8 + 2900\,(w - 0{,}8)^2$. Mennyi $L(0{,}9)$?`,
          options: ["29,8", "290,8", "29", "0,8"],
          answer: 0,
          hint: R`$w - 0{,}8 = 0{,}1$ – és ezt négyzetre kell emelni.`,
          explain: R`$0{,}8 + 2900\cdot0{,}01 = 29{,}8$. A 290,8-nál elmaradt a négyzetre emelés, a 29-nél a $0{,}8$ hozzáadása; a 0,8 a minimum értéke ($w = 0{,}8$-nál).`
        }
      ]
    },

    /* ------------------------------------------------ 3.4 */
    "ai3-34": {
      title: "Kvíz – 3.4 Optimalizálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Címkék: $3, 7, 8$. Melyik konstans tipp ($\hat y = c$) minimalizálja az MSE-t?`,
          options: ["6", "7", "7,5", "5,5"],
          answer: 0,
          hint: "Az MSE-t az egyik nevezetes középérték minimalizálja.",
          explain: R`Az átlag: $18/3 = 6$. A 7 a medián (az a MAE-t minimalizálja); a 7,5 a két nagyobb érték átlaga; az 5,5 a legkisebb és a legnagyobb közepe.`
        },
        {
          type: "single", shuffle: true,
          q: R`Adat: $(0;\ 1)$, $(2;\ 2)$, $(4;\ 6)$. Mi a legkisebb négyzetek egyenese?`,
          options: [R`$w = 1{,}25$, $b = 0{,}5$`, R`$w = 1{,}25$, $b = 3$`, R`$w = 0{,}8$, $b = 1{,}4$`, R`$w = 10$, $b = -17$`],
          answer: 0,
          hint: R`$w = \sum(x_i - \bar x)(y_i - \bar y)/\sum(x_i - \bar x)^2$, utána $b = \bar y - w\bar x$.`,
          explain: R`$\bar x = 2$, $\bar y = 3$; szorzatösszeg $10$, négyzetösszeg $8$: $w = 1{,}25$, $b = 3 - 2{,}5 = 0{,}5$. A $b = 3$-nál elmaradt a $-w\bar x$; a $0{,}8$ a fordított hányados ($8/10$); a $w = 10$ a nevezővel való osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kis adat: $(1;\ 2)$, $(2;\ 5)$, $(3;\ 5)$. A gradiens módszer $(w, b) = (0, 0)$-ból indul, $\eta = 0{,}05$. Hová visz az első lépés?`,
          options: [R`$(0{,}9;\ 0{,}4)$`, R`$(-0{,}9;\ -0{,}4)$`, R`$(0{,}45;\ 0{,}2)$`, R`$(18;\ 8)$`],
          answer: 0,
          hint: R`Hibák: $-2, -5, -5$. Gradiens: $\frac2n\sum e_ix_i$ és $\frac2n\sum e_i$. Lépés: mínusz $\eta$-szor a gradiens.`,
          explain: R`$\partial L/\partial w = \frac23(-27) = -18$, $\partial L/\partial b = \frac23(-12) = -8$; az új pont $(0 + 0{,}9;\ 0 + 0{,}4)$. A $(-0{,}9;\ -0{,}4)$ pluszjellel lép (felfelé); a $(0{,}45;\ 0{,}2)$-nél elmaradt a 2-es szorzó; a $(18;\ 8)$ a negatív gradiens, $\eta$ nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: "60 000 tanító minta, kötegméret 100, 5 epoch. Hány paraméterfrissítés (iteráció) történik?",
          options: ["3000", "600", "300 000", "12 000"],
          answer: 0,
          hint: "Egy epoch hány köteg? És hány epoch van?",
          explain: R`Egy epoch $60\,000/100 = 600$ lépés, 5 epoch $3000$. A 600 egyetlen epoch; a 300 000 a feldolgozott minták száma ($5\cdot60\,000$), nem a lépéseké; a 12 000 a $60\,000/5$.`
        },
        {
          type: "single", shuffle: true,
          q: "A veszteség lépésenként: 18 → 22 → 27 → 33 → 40 … Mit tennél először?",
          options: ["Csökkenteném a tanulási rátát.", "Növelném a tanulási rátát.", "Tanítanék több epochig.", "Bővíteném a teszt halmazt."],
          answer: 0,
          hint: "Csökken vagy nő a veszteség? Mitől szállhat szét a gradiens módszer?",
          explain: R`A veszteség nő: a lépések átlőnek a völgyön, a módszer szétszáll – túl nagy $\eta$. Nagyobb $\eta$ rontana, több epoch csak tovább szállna el, a teszt halmaz pedig nem befolyásolja a tanítást.`
        },
        {
          type: "multi",
          q: "Melyik igaz a sztochasztikus (mini-köteges) gradiens módszerre?",
          options: [
            "Egy lépés gradiensét egy minta vagy egy kis köteg alapján számolja.",
            "A mintánkénti gradiensek átlaga a teljes gradiens, ezért a köteg gradiense jó becslés.",
            "A veszteség minden egyes lépésben garantáltan csökken.",
            "Egy epoch mindig pontosan egy lépés."
          ],
          answer: [0, 1],
          hint: "Mennyi adatból készül egy lépés? És hány lépés fér egy epochba?",
          explain: R`A köteg gradiense a teljes gradiens zajos becslése – olcsó, és átlagban jó irányba mutat. Éppen ezért a veszteség lépésenként ingadozhat. Egy epoch $\lceil n/B\rceil$ lépés, csak $B = n$-nél egy.`
        }
      ]
    },

    /* ------------------------------------------------ 3.5 */
    "ai3-35": {
      title: "Kvíz – 3.5 Általánosítás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy modell tanítóhibája 0,01, teszthibája 0,90 (az alapvonalé 0,40). Mi történt?",
          options: ["túlillesztés", "alulillesztés", "jó illesztés", "a tanulási ráta túl kicsi"],
          answer: 0,
          hint: "Hasonlítsd össze a tanító- és a teszthibát!",
          explain: "A tanítóadaton szinte hibátlan, új adaton még az alapvonalnál is rosszabb: a zajt is megtanulta – túlillesztés. Alulillesztésnél a tanítóhiba is nagy lenne; túl kicsi tanulási rátánál a tanítóhiba nem menne le ennyire."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik halmazon válasszuk ki a hiperparamétereket (pl. a polinom fokát)?",
          options: ["a validációs halmazon", "a teszt halmazon", "a tanító halmazon", "mindhármon együtt"],
          answer: 0,
          hint: "Melyik halmaznak kell érintetlennek maradnia a végső értékelésig? És miért nem jó a tanítóhiba?",
          explain: "A validációs halmazon. A tanítóhiba mindig a legbonyolultabb modellt választaná; a teszt halmazt csak a végén, egyszer szabad használni, különben a teszthiba optimista lesz."
        },
        {
          type: "multi",
          q: "Egy „magoló” modell a látott tanító mintákra a megjegyzett címkét adja, másra az átlagot. Melyik igaz?",
          options: [
            "A tanítóhibája 0.",
            "Új adaton általában rossz.",
            "A teszthiba leleplezi.",
            "Ez a legjobb modell, mert hibátlan."
          ],
          answer: [0, 1, 2],
          hint: "Mit mér a tanítóhiba, és mit a teszthiba?",
          explain: "A tanító mintákon tökéletes, de semmit nem tanult az összefüggésből – ez csak nem látott adaton derül ki. A hibátlan tanítóhiba nem jóság, hanem gyanú."
        },
        {
          type: "single", shuffle: true,
          q: "10 tanító pontra 9. fokú polinomot illesztünk (legkisebb négyzetekkel). Mi igaz?",
          options: [
            "A tanítóhiba 0, mert 10 paraméterrel minden ponton átmegy.",
            "Ez adja a legkisebb teszthibát, mert a legrugalmasabb.",
            "A tanítóhibája nagyobb, mint a harmadfokúé.",
            "Nem illeszthető, mert kevés a pont."
          ],
          answer: 0,
          hint: "Hány paramétere van egy 9. fokú polinomnak?",
          explain: "10 paraméter, 10 pont: a polinom pontosan átvezethető rajtuk – a zajon is. A tanítóhiba 0, de a teszthiba óriási (a példában 3,38 a harmadfokú 0,076-jával szemben). A tanítóhiba a fokszámmal sosem nő."
        },
        {
          type: "single", shuffle: true,
          q: R`Az $\hat y = 0{,}8x + 4$ modell két új lakáson: (30 m², 29 M) és (90 m², 74 M). Mennyi a teszt MSE?`,
          options: ["2,5", "0,5", "1,5", "5"],
          answer: 0,
          hint: "Jóslatok, hibák, négyzetek, átlag.",
          explain: R`Jóslatok: 28 és 76; hibák: $-1$ és $+2$; MSE $= (1 + 4)/2 = 2{,}5$. A 0,5 az előjeles átlag, az 1,5 a MAE, az 5 a négyzetösszeg átlagolás nélkül.`
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "ai3-36": {
      title: "Kvíz – 3.6 Több jellemző",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\hat y = 0{,}9x_1 - 2x_2 + 5$ ($x_1$: m², $x_2$: km a központtól). Mennyi a jóslat egy 60 m²-es, 2 km-re lévő lakásra?`,
          options: ["55", "63", "59", "50"],
          answer: 0,
          hint: "Minden jellemzőt a saját súlyával szorozz, aztán add össze, és ne felejtsd el az eltolást!",
          explain: R`$54 - 4 + 5 = 55$. A 63 előjelhiba ($+4$), az 59-ből kimaradt a távolság tagja, az 50-ből az eltolás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az alapterület átlaga a tanító halmazon 50, szórása 20. Mennyi a standardizált értéke egy 35 m²-es lakásnak?`,
          options: [R`$-0{,}75$`, R`$0{,}75$`, R`$-15$`, R`$1{,}75$`],
          answer: 0,
          hint: R`$z = (x - \bar x)/s$.`,
          explain: R`$(35 - 50)/20 = -0{,}75$. A $0{,}75$ előjelhibás, a $-15$-nél elmaradt az osztás, az $1{,}75$ a $35/20$ (az átlag kivonása nélkül).`
        },
        {
          type: "multi",
          q: "Melyik modell lineáris regresszió (a paraméterekben lineáris, megfelelő jellemzőkkel)?",
          options: [
            R`$\hat y = w_1x + w_2x^2 + b$`,
            R`$\hat y = w_1\ln x + b$`,
            R`$\hat y = w_1x_1x_2 + b$`,
            R`$\hat y = \sin(w_1x) + b$`,
            R`$\hat y = e^{w_1x}$`
          ],
          answer: [0, 1, 2],
          hint: "Nem az számít, hogy $x$-ben görbe-e, hanem hogy a paraméter csak egy (ismert) számmal szorzódik-e.",
          explain: R`Az $x^2$, a $\ln x$ és az $x_1x_2$ csak új jellemzők, a paraméterek csak szorzóként szerepelnek. A $\sin(w_1x)$-ben és az $e^{w_1x}$-ben a paraméter egy nemlineáris függvény <em>belsejében</em> van.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért gyorsítja meg a standardizálás a gradiens módszert?",
          options: [
            "Mert a veszteség tála kerekebb lesz, így egyetlen tanulási ráta minden irányban jó.",
            "Mert a zárt képlet csak standardizált adaton működik.",
            "Mert a standardizálás csökkenti a legkisebb elérhető MSE-t.",
            "Mert skálázás nélkül a modell nem lineáris."
          ],
          answer: 0,
          hint: "Mi szabja meg a legnagyobb stabil lépést, és mi a leglassabb irányt?",
          explain: "Nyers m²-nél a tál egyik irányban nagyon meredek (ez kis η-t kényszerít ki), a másikban nagyon lapos (ott ezzel a kis η-val alig halad). Kerek tálnál nincs ilyen feszültség. A legjobb egyenes és a minimális MSE nem változik, a zárt képletnek a skálázás mindegy."
        },
        {
          type: "single", shuffle: true,
          q: "A távolság méterben mért súlya −0,002 (millió Ft / m). Mennyit ér a modell szerint 1 km-rel közelebb lenni a központhoz (minden más változatlan)?",
          options: ["+2 millió Ft", "+0,002 millió Ft", "−2 millió Ft", "+2000 millió Ft"],
          answer: 0,
          hint: "1 km = 1000 m. És közelebb = kisebb távolság.",
          explain: R`$-0{,}002\cdot(-1000) = +2$ millió Ft. A 0,002 elfelejti a mértékegység-váltást, a −2 az irányt, a 2000 rossz irányba vált. A kis súly tehát nem jelent kis hatást.`
        }
      ]
    },

    /* ------------------------------------------------ 3.7 */
    "ai3-37": {
      title: "Kvíz – 3.7 A gépi tanulási munkafolyamat",
      questions: [
        {
          type: "match",
          q: "Melyik alkatrészt érinti a változtatás?",
          pairs: [
            ["MSE helyett MAE-t minimalizálunk", "veszteség"],
            ["egyenes helyett harmadfokú polinom", "modell"],
            ["a tanulási rátát felére vesszük", "optimalizálás"],
            ["begyűjtjük a tavalyi eladásokat is", "adat"]
          ],
          hint: "Mit mérünk, mivel jósolunk, hogyan keressük a paramétereket, miből tanulunk?",
          explain: "A veszteség a mérce, a modell a függvénycsalád, az optimalizálás a keresés módja ($\\eta$, köteg), az adat a tanulás alapanyaga."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a gépi tanulási munkafolyamat helyes sorrendje?",
          options: [
            "probléma → adat → előkészítés → modellezés → értékelés → telepítés → monitorozás",
            "adat → modellezés → előkészítés → probléma → értékelés → monitorozás → telepítés",
            "probléma → modellezés → adat → telepítés → értékelés → előkészítés → monitorozás",
            "modellezés → adat → probléma → előkészítés → telepítés → értékelés → monitorozás"
          ],
          answer: 0,
          hint: "Előbb tudni kell, mit akarunk; értékelni pedig telepítés előtt kell.",
          explain: "Probléma → adat → előkészítés → modellezés → értékelés → telepítés → monitorozás, és a folyamat ciklikus: a monitorozás gyakran visszaküld az adatgyűjtéshez."
        },
        {
          type: "multi",
          q: "Melyik hiperparaméter (és nem paraméter)?",
          options: [R`a tanulási ráta $\eta$`, R`a kötegméret $B$`, "a polinom foka", "az epochok száma", R`a súly $w$`, R`az eltolás $b$`],
          answer: [0, 1, 2, 3],
          hint: "Mit állít be a tanítás, és mit kell megadni a tanítás előtt?",
          explain: R`A $w$ és a $b$ paraméter: a tanítás állítja be. A többi a tanítás „beállítása”, előre választjuk (validációs halmazon).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy lakásármodell egy éve jól működik, de az utóbbi hónapokban a hibái rendre negatívak (alábecsül). Mi a legvalószínűbb ok és teendő?",
          options: [
            "Adateltolódás (emelkedtek az árak) – friss adattal újratanítani.",
            "Túl nagy volt a tanulási ráta – kisebbel újratanítani ugyanazon az adaton.",
            "Túlillesztés – kevesebb jellemzőt használni.",
            "A teszt halmaz túl kicsi volt – nagyobb teszt halmazzal újra kiértékelni."
          ],
          answer: 0,
          hint: "Ugyanaz a modell, egyre rosszabb, és mindig egy irányba téved. Mi változott – a modell vagy a világ?",
          explain: "A rendszeres, egyirányú hiba azt mutatja, hogy a világ (az árszint) elmozdult a tanítóadathoz képest. Ezt a monitorozás veszi észre, a megoldás friss adattal újratanítani. A tanulási ráta vagy a túlillesztés nem magyarázza, hogy a hiba idővel nő."
        },
        {
          type: "single", shuffle: true,
          q: "Mi egy nagy nyelvi modell előtanításának vesztesége?",
          options: [
            "keresztentrópia a következő szóra",
            "MSE a szavak sorszámán",
            "a pontosság (eltalált szavak aránya)",
            "nincs vesztesége, mert önfelügyelt"
          ],
          answer: 0,
          hint: "A következő szó egy kategória (a szótár egy eleme). Milyen veszteség illik az osztályozáshoz – és deriválható-e a pontosság?",
          explain: R`A modell minden lépésben a következő szóra ad valószínűséget, a veszteség $-\ln(\text{a valódi szó valószínűsége})$. A szavak sorszáma nem mennyiség; a pontosság nem deriválható; az önfelügyelt tanulásnak is van címkéje (a következő szó) és vesztesége.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai3-final": {
      title: "Fejezetzáró teszt – 3. A tanulás anatómiája",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Adat: $(1;\ 2)$, $(3;\ 4)$, $(5;\ 9)$. A legkisebb négyzetek egyenese $\hat y = 1{,}75x - 0{,}25$. Mit jósol $x = 4$-re?`,
          options: ["6,75", "7", "7,25", "5"],
          answer: 0,
          hint: "Helyettesíts be – figyelj az eltolás előjelére!",
          explain: R`$1{,}75\cdot4 - 0{,}25 = 6{,}75$. A 7-ből kimaradt az eltolás, a 7,25 rossz előjellel vette, az 5 az átlag (konstans modell).`
        },
        {
          type: "single", shuffle: true,
          q: R`Két minta: $(0;\ 1)$, $(2;\ 5)$; a modell $(w, b) = (1, 0)$. Hová visz egy gradienslépés $\eta = 0{,}1$-gyel?`,
          options: [R`$(1{,}6;\ 0{,}4)$`, R`$(0{,}4;\ -0{,}4)$`, R`$(1{,}3;\ 0{,}2)$`, R`$(7;\ 4)$`],
          answer: 0,
          hint: R`Hibák: $-1$, $-3$. $\partial L/\partial w = \frac2n\sum e_ix_i$, $\partial L/\partial b = \frac2n\sum e_i$.`,
          explain: R`Gradiens: $(-6;\ -4)$, lépés: $(1 + 0{,}6;\ 0 + 0{,}4)$. A $(0{,}4;\ -0{,}4)$ pluszjellel lép, a $(1{,}3;\ 0{,}2)$-nél elmaradt a 2-es szorzó, a $(7;\ 4)$-nél az $\eta$.`
        },
        {
          type: "single", shuffle: true,
          q: "12 000 minta, ebből 80% tanító; kötegméret 64, 20 epoch. Hány lépés a teljes tanítás?",
          options: ["3000", "3750", "150", "192 000"],
          answer: 0,
          hint: "Előbb a tanító minták száma, aztán a lépés / epoch.",
          explain: R`$9600/64 = 150$ lépés / epoch, $\cdot20 = 3000$. A 3750 a teljes 12 000 mintával számol (a teszt halmazon nem tanítunk!), a 150 egy epoch, a 192 000 a feldolgozott minták száma.`
        },
        {
          type: "match",
          q: "Párosítsd a hibaképet a diagnózissal!",
          pairs: [
            ["tanítóhiba nagy, teszthiba nagy", "alulillesztés"],
            ["tanítóhiba kicsi, teszthiba nagy", "túlillesztés"],
            ["tanítóhiba kicsi, teszthiba kicsi", "jó illesztés"],
            ["a veszteség lépésről lépésre nő", "túl nagy tanulási ráta"]
          ],
          hint: "Melyik hiba mit mér? És mi történik, ha a lépések átlövik a völgyet?",
          explain: "Ha már a tanítóadaton sem jó, a modell túl szegény; ha csak az újon rossz, a zajt tanulta meg; ha a veszteség nő, a gradiens módszer szétszáll."
        },
        {
          type: "single", shuffle: true,
          q: R`Címkék: $2, 4, 9, 45$. Melyik konstans minimalizálja a MAE-t?`,
          options: ["6,5", "15", "4", "23,5"],
          answer: 0,
          hint: "A MAE-t nem az átlag minimalizálja.",
          explain: R`A medián: $(4 + 9)/2 = 6{,}5$. A 15 az átlag (az az MSE-t minimalizálja, és a kiugró 45 felhúzza); a 4 csak az egyik középső érték; a 23,5 a legkisebb és a legnagyobb közepe.`
        },
        {
          type: "single", shuffle: true,
          q: R`Standardizált modell: $\hat y = 5z + 50$, ahol $z = (x - 120)/30$. Mit jósol $x = 90$-re?`,
          options: ["45", "55", "500", "−100"],
          answer: 0,
          hint: "Előbb alakítsd át a bemenetet a tanító halmaz átlagával és szórásával.",
          explain: R`$z = -30/30 = -1$, $\hat y = -5 + 50 = 45$. Az 55 előjelhibás; az 500 a nyers $x$-et írja $z$ helyére; a $-100$-nál elmaradt a szórással való osztás ($z = -30$).`
        },
        {
          type: "multi",
          q: "Melyik igaz?",
          options: [
            "A tanítóhiba a modell bonyolultságának növelésével nem nő.",
            "A teszt halmazt csak a végén, egyszer használjuk.",
            "Az RMSE és az MSE minimuma ugyanannál a beállításnál van.",
            "A legkisebb négyzetek zárt képlete a neurális hálókra is megadja a legjobb súlyokat.",
            "A standardizálás megváltoztatja a legkisebb négyzetek egyenesének jóslatait."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj az egymásba ágyazott modellcsaládokra, a gyökvonás monotonitására, és arra, hol van zárt képlet.",
          explain: "A gazdagabb család tartalmazza a szegényebbet; a teszt halmaz csak a végső értékelésé; a gyökvonás növekvő, így a minimum helye nem változik. Neurális hálóra nincs zárt képlet; a standardizálás csak a paraméterek alakját változtatja, a jóslatokat nem."
        },
        {
          type: "single", shuffle: true,
          q: "Az alapvonal (átlag) MSE-je 14, a modellé 2,5. Mennyi az $R^2$?",
          options: ["≈ 0,82", "≈ 0,18", "11,5", "5,6"],
          answer: 0,
          hint: R`$R^2 = 1 - \text{MSE}_{\text{modell}}/\text{MSE}_{\text{alapvonal}}$.`,
          explain: R`$1 - 2{,}5/14 \approx 0{,}82$. A 0,18 maga a hányados (az 1-ből kivonás elmaradt), a 11,5 a különbség, az 5,6 a fordított hányados.`
        },
        {
          type: "single", shuffle: true,
          q: R`A nyers lakásadaton (m²) $\eta = 0{,}01$-gyel a veszteség: 2192,8 → 7,1 millió → 23 milliárd… Mi a magyarázat?`,
          options: [
            R`A nyers m² miatt a tál nagyon meredek, a stabil határ $\eta \approx 0{,}000345$ – a 0,01 túl nagy.`,
            "Az MSE-felületnek több völgye van, és a módszer rossz völgybe esett.",
            "Kevés az adat, ezért túlillesztés történt.",
            "A kezdőpont (0; 0) rossz; más kezdőpontból konvergálna."
          ],
          answer: 0,
          hint: "Ilyen gyors növekedésnél mi a szokásos gyanú? És függ-e a stabilitás a kezdőponttól egy négyzetes tálon?",
          explain: R`Szétszállás: a lépések egyre jobban átlövik a völgyet. A határt a legmeredekebb irány szabja meg, ami nyers m²-nél óriási görbület. Az MSE-tál konvex (egy völgy), a túlillesztés nem okoz növekvő tanítóveszteséget, és négyzetes tálon a stabilitás nem a kezdőponttól függ. Megoldás: standardizálás vagy sokkal kisebb $\eta$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy nagy nyelvi modell előtanításában mi a „címke”?",
          options: ["a szövegben következő szó", "egy ember által adott pontszám", "a szöveg témája", "nincs címke, ezért nincs veszteség sem"],
          answer: 0,
          hint: "Önfelügyelt tanulás: honnan jön a helyes válasz, ha senki nem címkéz?",
          explain: "A címke magában az adatban van: a modell az eddigi szavakból a következőt jósolja, és a szöveg tényleges következő szava a helyes válasz. Emberi értékelés csak az utótanításnál jön (17. fejezet)."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
