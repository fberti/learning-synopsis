/* =========================================================
   Mesterséges intelligencia 7. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 7.1 */
    "ai7-71": {
      title: "Kvíz – 7.1 Döntési fák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy csomópontban 3 esős és 1 száraz nap van. Mennyi a Gini-indexe?",
          options: ["0,375", "0,25", "0,811", "0,75"],
          answer: 0,
          hint: R`Gini $= 1 - \sum_k p_k^2$ – az osztályarányok négyzetét vond ki 1-ből.`,
          explain: R`$1 - 0{,}75^2 - 0{,}25^2 = 1 - 0{,}5625 - 0{,}0625 = 0{,}375$. A 0,25 a hibaarány (a többséget mondva), a 0,811 az entrópia bitben, a 0,75 a többségi osztály aránya.`
        },
        {
          type: "single", shuffle: true,
          q: "Tíz napot egy kérdés két ötfős ágra vág: az egyikben 4 esős és 1 száraz, a másikban 0 esős és 5 száraz nap van. Mennyi a vágás súlyozott Gini-indexe?",
          options: ["0,16", "0,32", "0,48", "0,18"],
          answer: 0,
          hint: "Számold ki mindkét ág Gini-indexét, aztán súlyozd az ágak méretével (5/10 és 5/10).",
          explain: R`Az első ág: $1 - 0{,}8^2 - 0{,}2^2 = 0{,}32$, a második tiszta: 0. Súlyozva $0{,}5 \cdot 0{,}32 + 0{,}5 \cdot 0 = 0{,}16$. A 0,32 a súlyozás elhagyása (vagy a Gini-csökkenés), a 0,48 a szülő Gini-indexe,
            a 0,18 abból jön, ha a képletből kimarad a $(1 - p)^2$ tag ($1 - 0{,}64 = 0{,}36$, ennek fele).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 50 : 50 arányú csomópontot (1 bit) két részre vágunk: 40 : 10 és 10 : 40. Mindkét rész entrópiája kb. 0,722 bit. Mennyi az információnyereség?",
          options: ["≈ 0,278 bit", "≈ 0,722 bit", "≈ −0,444 bit", "≈ 1,444 bit"],
          answer: 0,
          hint: "A gyerekek entrópiáját méretük szerint átlagold – ne add össze –, és vond ki a szülőéből.",
          explain: R`Súlyozott átlag: $0{,}5 \cdot 0{,}722 + 0{,}5 \cdot 0{,}722 = 0{,}722$, a nyereség $1 - 0{,}722 \approx 0{,}278$ bit. Az 1,444 a két entrópia összege, a −0,444 az „$1 - 1{,}444$” – ezt a hibát egy népszerű
            könyv (DLV) el is követi. A 0,722 a megmaradt, nem a megszüntetett bizonytalanság.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a döntési fákra?",
          options: [
            "Osztályozásnál a levél a benne lévő tanító minták többségi osztályát mondja.",
            "A fához a jellemzőket standardizálni kell, különben a nagy számú jellemzők uralkodnak.",
            "Számjellemzőknél a döntési határ tengelyekkel párhuzamos szakaszokból áll.",
            "A mohó építés mindig a lehető legkisebb hibájú, legkevesebb levelű fát találja meg.",
            "Egy levél szabálya a hozzá vezető válaszok „ÉS”-kapcsolata."
          ],
          answer: [0, 2, 4],
          hint: "Gondold végig: mit használ egy vágás a jellemzőből – az értékét vagy csak a sorrendjét? És mit jelent, hogy „mohó”?",
          explain: "A fa csak a jellemzők sorrendjét használja, ezért nem kell skálázni. A mohó építés minden lépésben a pillanatnyilag legjobb vágást választja, előre nem néz – az optimális fa megtalálása NP-teljes, ezt nem garantálja (lásd a XOR-t)."
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a jellemzőjével!",
          pairs: [
            ["Gini-index két osztálynál", "2p(1 − p), legfeljebb 0,5"],
            ["ID3, C4.5", "entrópia, többágú vágás"],
            ["CART (scikit-learn)", "Gini-index, mindig bináris vágás"],
            ["döntési tönk", "egyetlen vágásból álló fa"]
          ],
          hint: "Melyik algoritmus jött a gépi tanulásból (Quinlan), és melyik a statisztikából (Breiman és társai)?",
          explain: "Quinlan ID3-a és C4.5-je entrópiát (információnyereséget) használ, és egy kategóriás kérdésnek annyi ága lehet, ahány értéke van. A CART bináris, Gini-indexszel. A tönk egyetlen kérdés – az 5.1 küszöbszabálya."
        },
        {
          type: "single", shuffle: true,
          q: "Egy jellemző értékei a csomópontban: 2, 4, 4, 7, 9. Hány küszöböt kell kipróbálnia a CART-nak?",
          options: ["3", "4", "5", "2"],
          answer: 0,
          hint: "Csak a szomszédos, különböző értékek felezőpontjai számítanak.",
          explain: "A különböző értékek: 2, 4, 7, 9 – a felezőpontok 3; 5,5; 8, azaz 3 küszöb. A 4 az ismétlődés figyelmen kívül hagyásából jön (5 érték − 1), az 5 minden értéket küszöbnek venne."
        },
        {
          type: "single", shuffle: true,
          q: "A XOR négy pontján (két „+”, két „−”, átlósan) mennyi bármelyik első tengelyirányú vágás Gini-csökkenése?",
          options: ["0", "0,25", "0,5", "1"],
          answer: 0,
          hint: "Nézd meg, milyen arányban kerülnek a pontok a két ágba egy vágás után.",
          explain: R`Mindkét ágba egy „+” és egy „−” kerül: a Gini ágonként 0,5 – ugyanannyi, mint a szülőé. A csökkenés 0, pedig egy 2 mélységű fa hibátlan. A mohó, „csak javulásnál vágok” szabály itt elakad.`
        }
      ]
    },

    /* ------------------------------------------------ 7.2 */
    "ai7-72": {
      title: "Kvíz – 7.2 A fa korlátai",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy korlátlan mélységű fa a tanító adaton 100%-os, a teszten 81,8%-os. Egy 2 mélységű fáé 90,0% és 86,1%. Mi a diagnózis?",
          options: [
            "A mély fa túlilleszt: nagy a varianciája.",
            "A mély fa alulilleszt: nagy a torzítása.",
            "A sekély fa illeszt túl, mert kisebb a tanító pontossága.",
            "Mindkét fa jó, hiszen a tanító pontosságuk magas."
          ],
          answer: 0,
          hint: "Hasonlítsd össze a tanító és a teszt pontosság közti rést a két fánál.",
          explain: "A mély fa a zajt is megjegyzi: tanító 100%, teszt 81,8% – nagy rés, nagy variancia. A sekély fa kisebb réssel jobb teszteredményt ad. A tanító pontosság önmagában semmit nem bizonyít."
        },
        {
          type: "single", shuffle: true,
          q: "Egy 3 levelű részfa 2 tanítóhibát vét; egyetlen levéllé összevonva 5-öt vétene. Melyik α („levéladó”) felett éri meg összevonni?",
          options: ["1,5", "3", "0,75", "1"],
          answer: 0,
          hint: R`Hasonlítsd össze a két változat $R(T) + \alpha|T|$ költségét.`,
          explain: R`$2 + 3\alpha = 5 + \alpha$ → $\alpha = 1{,}5$. A 3 a hibák különbsége a levélszám-különbséggel (2) való osztás nélkül; a többi számolási tévedés.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy regressziós fa levelébe a 20, 24 és 70 címkéjű minták kerültek. Mit jósol a levél?",
          options: ["38", "24", "45", "114"],
          answer: 0,
          hint: "Melyik konstans minimalizálja a négyzetes hibát?",
          explain: "Az átlag: 114/3 = 38. A 24 a medián (az abszolút hibát minimalizálná), a 45 a legkisebb és a legnagyobb érték közepe, a 114 az összeg."
        },
        {
          type: "single", shuffle: true,
          q: "A fagylaltos fa (levelek: 22, 42, 72 gombóc; a legmelegebb tanító nap 31 °C) mit jósol 40 °C-ra?",
          options: ["72", "kb. 106,5", "74", "45,3"],
          answer: 0,
          hint: "Melyik levélbe esik a 40 °C, és mit mond a levél?",
          explain: "A 40 °C a „26,5 fölött” levélbe esik, amely a 70 és a 74 átlagát, 72-t mondja. A fa nem extrapolál. A 106,5 a legkisebb négyzetes egyenes jóslata, a 74 a legnagyobb látott érték, a 45,3 az összes nap átlaga."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a döntési fa instabilitására?",
          options: [
            "Egyetlen új tanító minta megváltoztathatja a gyökérkérdést, és vele az egész fát.",
            "A fa torzítása nagy, a varianciája kicsi.",
            "Egy fenti vágás megváltozása lefelé végiggyűrűzik a fán.",
            "Az instabilitás ellenszere sok, kissé különböző fa átlaga.",
            "Egy lineáris regresszió ugyanennyire instabil."
          ],
          answer: [0, 2, 3],
          hint: "Gondolj a tizenegyedik reggelre: mi történt a gyökérrel? És mi történik egy egyenessel, ha egy pontot hozzáadsz?",
          explain: "A fa kis torzítású, nagy varianciájú modell: R11 hozzáadásával a páratartalom került a gyökérbe, és az egész fa átalakult. Az egyenes egy új ponttól csak kicsit fordul el. A variancia ellen az átlagolás (bagging, véletlen erdő) segít."
        },
        {
          type: "single", shuffle: true,
          q: "Legfeljebb hány levele lehet egy 1000 mintán tanított fának, ha min_samples_leaf = 25?",
          options: ["40", "25", "16", "975"],
          answer: 0,
          hint: "Minden levélben legalább 25 minta van. Hány ilyen csoport fér el 1000 mintában?",
          explain: "1000/25 = 40. A 16 a max_depth = 4 korlátja lenne (2⁴), a 25 a levélméret maga, a 975 = 1000 − 25 értelmetlen."
        }
      ]
    },

    /* ------------------------------------------------ 7.3 */
    "ai7-73": {
      title: "Kvíz – 7.3 Bagging és véletlen erdő",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Három független osztályozó egyenként 80%-os. Mennyi a többségi szavazás pontossága?",
          options: ["0,896", "0,8", "0,512", "0,992"],
          answer: 0,
          hint: "A többség akkor jó, ha legalább kettő jó: „mindhárom” + „pontosan kettő”.",
          explain: R`$0{,}8^3 + 3 \cdot 0{,}8^2 \cdot 0{,}2 = 0{,}512 + 0{,}384 = 0{,}896$. A 0,512 csak a „mindhárom jó” eset, a 0,992 annak esélye, hogy legalább egy jó ($1 - 0{,}2^3$) – az nem többség.`
        },
        {
          type: "single", shuffle: true,
          q: "Tíz mintából bootstrap-mintát húzunk. Mekkora eséllyel marad ki belőle egy adott minta?",
          options: ["≈ 0,349", "≈ 0,368", "0,1", "≈ 0,651"],
          answer: 0,
          hint: "Tíz független húzás, mindegyik 9/10 eséllyel „nem ő”.",
          explain: R`$(9/10)^{10} \approx 0{,}349$. A 0,368 $= 1/e$ a határérték nagyon sok mintára, a 0,651 annak esélye, hogy bekerül, a 0,1 egyetlen húzás esélye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tíz fa átlagát vesszük. Egy fa varianciája 1, bármely két fa korrelációja 0,4. Mennyi az átlag varianciája?`,
          options: ["0,46", "0,1", "0,4", "0,04"],
          answer: 0,
          hint: R`$\rho\sigma^2 + (1 - \rho)\sigma^2/B$.`,
          explain: R`$0{,}4 + 0{,}6/10 = 0{,}46$. A 0,1 független fákra lenne igaz, a 0,4 a végtelen sok fa határértéke, a 0,04 a $\rho/B$ – rossz képlet.`
        },
        {
          type: "single", shuffle: true,
          q: "Hat jellemző, vágásonként 2 véletlen jelölt. Mekkora eséllyel jelölt egy adott jellemző (pl. az előrejelzés)?",
          options: ["1/3", "1/6", "1/2", "2/3"],
          answer: 0,
          hint: "A 15 lehetséges párból hányban szerepel? (Vagy: m/p.)",
          explain: "5 olyan pár van, amelyben szerepel, a 15-ből: 5/15 = 1/3 = m/p. Az 1/6 egyetlen húzás, a 2/3 annak esélye, hogy nem jelölt."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a véletlen erdőre?",
          options: [
            "A jellemzőket minden vágásnál újra sorsolja, nem fánként egyszer.",
            "Ha túl sok fát veszünk bele, túlilleszt.",
            "m = p esetén éppen a bagginget kapjuk.",
            "A jellemzőket standardizálni kell.",
            "Az OOB-becslés nagyjából a keresztvalidációs becslésnek felel meg, ingyen."
          ],
          answer: [0, 2, 4],
          hint: "Miben különbözik a baggingtől, és mit tesz a fák számának növelése egy átlaggal?",
          explain: "A véletlen erdő vágásonként sorsol (a fánkénti sorsolás Ho véletlen altér módszere). Több fa nem okoz túlillesztést, csak lassabb (a mély fák átlaga persze lehet túl gazdag). Fákból áll, ezért nem kell skálázni."
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["Gini-alapú fontosság (MDI)", "gyors, de a sokértékű jellemzőket túlértékeli"],
            ["permutációs fontosság", "mennyit romlik a validációs pontosság egy oszlop összekeverése után"],
            ["OOB-becslés", "minden mintára csak az őt nem látott fák szavaznak"],
            ["bootstrap-minta", "n húzás visszatevéssel az n mintából"]
          ],
          hint: "Melyik számol a tanító adaton, és melyik egy félretett (vagy kimaradt) részen?",
          explain: "Az MDI a tanító adaton összegzi a Gini-csökkenéseket – torzított. A permutációs fontosság validáción (vagy OOB-mintákon) méri a romlást. Az OOB-becslés a kimaradt kb. 37%-ot használja validációra."
        },
        {
          type: "single", shuffle: true,
          q: "Egy fagylalteladást jósló erdőben a „napszemüveg-eladás” a legfontosabb jellemző. Mit következtethetsz?",
          options: [
            "A modell erősen támaszkodik rá, de ebből nem következik, hogy okozza a fagylalteladást.",
            "A napszemüveg-akció növelni fogja a fagylalteladást.",
            "A jellemző hibás, mert a fontosság csak ok-okozati kapcsolatnál lehet nagy.",
            "A többi jellemző biztosan haszontalan."
          ],
          answer: 0,
          hint: "Mit mér a fontosság: a modell viselkedését vagy a világ okait?",
          explain: "A fontosság azt méri, mennyit használ a modell egy jellemzőt a jósláshoz. A napszemüveg- és a fagylalteladást is a napsütés okozza – közös ok. Oksági kérdéshez kísérlet kell."
        }
      ]
    },

    /* ------------------------------------------------ 7.4 */
    "ai7-74": {
      title: "Kvíz – 7.4 Boosting",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az AdaBoost egy tagjának súlyozott hibája 0,25. Mennyi a szavazati ereje (α = ½·ln((1 − ε)/ε))?",
          options: ["≈ 0,549", "≈ 1,099", "≈ 0,693", "0,25"],
          answer: 0,
          hint: "(1 − 0,25)/0,25 = 3; vedd a természetes logaritmusát, és felezd.",
          explain: R`$\tfrac12\ln 3 \approx 0{,}549$. Az 1,099 $= \ln 3$ a fél nélkül (ez az ESL írásmódja – önmagában nem hiba, de akkor a súlyfrissítés is más), a 0,693 $= \tfrac12\ln 4$ a 0,2-es hibához tartozna.`
        },
        {
          type: "single", shuffle: true,
          q: "Az AdaBoost súlyfrissítése és normálása után mekkora a most betanított tag által elrontott minták összsúlya?",
          options: ["pontosan 0,5", "ε, mint korábban", "2ε", "1 − ε"],
          answer: 0,
          hint: R`A hibásak összsúlya $\varepsilon e^{\alpha}$, a jóké $(1 - \varepsilon)e^{-\alpha}$. Számold ki $e^{\alpha}$-t!`,
          explain: R`Mindkét összeg $\sqrt{\varepsilon(1 - \varepsilon)}$, tehát normálás után 0,5–0,5. A következő tagnak így valami újat kell találnia – az előző hibáit már nem „ússza meg”.`
        },
        {
          type: "single", shuffle: true,
          q: "Gradiens boosting: x = 1, 2, 3, 4; y = 1, 2, 4, 7. Mennyi az x = 4 pont maradéka az első fa előtt?",
          options: ["3,5", "7", "−2,5", "0"],
          answer: 0,
          hint: "A kezdő modell F₀ = az y-ok átlaga.",
          explain: "F₀ = (1 + 2 + 4 + 7)/4 = 3,5, a maradék 7 − 3,5 = 3,5. A 7 maga a címke, a −2,5 az x = 1 pont maradéka."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a bagging és a boosting összevetésére?",
          options: [
            "A bagging fái párhuzamosan, egymástól függetlenül taníthatók; a boostingé egymás után.",
            "A bagging elsősorban a varianciát, a boosting elsősorban a torzítást csökkenti.",
            "A boosting tipikusan mély, a bagging sekély fákat használ.",
            "A boostingnál a túl sok fa túlillesztéshez vezethet, ezért korai leállítás kell.",
            "A gradiens boosting a rosszul jósolt minták súlyát növeli."
          ],
          answer: [0, 1, 3],
          hint: "Melyik javítja az előző modell hibáit, és melyik átlagol független modelleket?",
          explain: "A bagging mély, nagy varianciájú fákat átlagol; a boosting sekély, gyenge fákat ad össze egymás után. Mintasúlyokat az AdaBoost használ – a gradiens boosting a maradékokra illeszt (ezt egy kezdőkönyv, MLAB, összekeveri)."
        },
        {
          type: "single", shuffle: true,
          q: "Egy XGBoost-levélbe két minta jut, maradékuk 2 és 4, λ = 1. Mennyi a levél értéke (négyzetes veszteségnél Σr/(n + λ))?",
          options: ["2", "3", "6", "1,5"],
          answer: 0,
          hint: "Számláló: a maradékok összege; nevező: a minták száma + λ.",
          explain: "6/(2 + 1) = 2. A 3 a sima átlag (λ = 0), a 6 az összeg, az 1,5 = 6/4 rossz nevezővel. A λ a kis levelek értékét a 0 felé húzza, mint a ridge."
        },
        {
          type: "single", shuffle: true,
          q: "Korai leállítás, türelem 100 kör. A validációs veszteség a 100., 200., 300., 400., 500. körben: 0,30; 0,26; 0,25; 0,255; 0,27. Melyik modellt tartod meg?",
          options: ["a 300 fásat", "az 500 fásat", "a 400 fásat", "a 200 fásat"],
          answer: 0,
          hint: "Melyik körben a legkisebb a validációs veszteség?",
          explain: "A legjobb a 300. kör (0,25). A 400. körnél leáll (100 kör óta nincs javulás), de a 300 fás modellt tartja meg. Az 500 fás már túlilleszt."
        },
        {
          type: "match",
          q: "Párosítsd a módszert a jellegzetességével!",
          pairs: [
            ["AdaBoost", "a hibásan osztályozott minták súlya körről körre nő"],
            ["gradiens boosting", "minden új fa a maradékokra (negatív gradiensre) illeszkedik"],
            ["LightGBM", "hisztogramos vágáskeresés, levélenkénti növesztés"],
            ["CatBoost", "a kategóriás jellemzők szivárgásmentes, rendezett kódolása"]
          ],
          hint: "Melyik az eredeti, súlyozó algoritmus, melyik az általános gradienses, és melyik könyvtár miről híres?",
          explain: "AdaBoost: mintasúlyok. Gradiens boosting: maradékok. LightGBM (Microsoft): hisztogram + levélenkénti növesztés. CatBoost (Yandex): rendezett célváltozó-kódolás a kategóriákra."
        }
      ]
    },

    /* ------------------------------------------------ 7.5 */
    "ai7-75": {
      title: "Kvíz – 7.5 Szavazás és stacking",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Három modell esővalószínűsége: 0,9; 0,4; 0,45. Mit mond a kemény és mit a lágy szavazás (0,5-ös küszöb)?",
          options: [
            "Kemény: nem esik; lágy: esik.",
            "Kemény: esik; lágy: nem esik.",
            "Mindkettő: esik.",
            "Mindkettő: nem esik."
          ],
          answer: 0,
          hint: "Kemény: számold a 0,5 fölötti szavazatokat. Lágy: átlagold a valószínűségeket.",
          explain: R`Kemény: 1 : 2 → nem esik. Lágy: $(0{,}9 + 0{,}4 + 0{,}45)/3 \approx 0{,}583$ → esik. A lágy szavazás a bizonyosságot is figyelembe veszi: a fa nagyon biztos, a másik kettő a határon billeg.`
        },
        {
          type: "single", shuffle: true,
          q: "Súlyok 0,5; 0,3; 0,2, a modellek valószínűségei 0,8; 0,4; 0,1. Mennyi a súlyozott átlag?",
          options: ["0,54", "≈ 0,433", "0,8", "0,46"],
          answer: 0,
          hint: "Szorozd össze páronként a súlyt és a valószínűséget, aztán add össze.",
          explain: R`$0{,}5 \cdot 0{,}8 + 0{,}3 \cdot 0{,}4 + 0{,}2 \cdot 0{,}1 = 0{,}4 + 0{,}12 + 0{,}02 = 0{,}54$. A 0,433 a súlyozatlan átlag, a 0,8 a legnagyobb súlyú modell egyedül, a 0,46 = 1 − 0,54.`
        },
        {
          type: "single", shuffle: true,
          q: "Az A modell pontszámai három mintára: 0,9; 0,2; 0,4. A B modellé: 0,6; 0,7; 0,1. Mennyi az első minta átlagos rangja (1 = legkisebb)?",
          options: ["2,5", "0,75", "2", "3"],
          answer: 0,
          hint: "Alakítsd mindkét modell pontszámait rangokká külön-külön, aztán átlagolj.",
          explain: "A rangjai: 3, 1, 2; B rangjai: 2, 3, 1. Az első minta: (3 + 2)/2 = 2,5. A 0,75 a pontszámok átlaga (azt nem szabad, ha más a skála), a 3 csak az A rangja."
        },
        {
          type: "multi",
          q: "Melyik a helyes gyakorlat stackingnél?",
          options: [
            "A metamodell az alapmodellek hajtáson kívüli (OOF) jóslatain tanul.",
            "Minden szinten ugyanazokat a hajtásokat használjuk.",
            "Metamodellnek egyszerű modellt (pl. logisztikus regressziót) választunk.",
            "A metamodell az alapmodellek saját tanító adatukon adott jóslatain tanul.",
            "Az alapmodellek közül azt tartjuk meg, amelyik a teszt halmazon a legjobb."
          ],
          answer: [0, 1, 2],
          hint: "Mire kell a metamodellnek felkészülnie: a tanító adatra vagy az új adatra?",
          explain: "A tanító adaton adott jóslatok túl jók (egy mély fa ott 100%-os) – a metamodell rossz súlyokat tanulna. A teszt halmazon választani a teszt elhasználása. Az egyszerű metamodell nem illeszt túl a kevés, korrelált bemenetre."
        },
        {
          type: "single", shuffle: true,
          q: "3 alapmodell, 5-szörös OOF-stacking. Hány alapmodell-tanítás kell összesen a végső, teljes adaton való újratanítással együtt?",
          options: ["18", "15", "8", "3"],
          answer: 0,
          hint: "Az OOF-hoz minden modellt minden hajtásra külön tanítasz; utána mindegyiket még egyszer az összes adaton.",
          explain: "3 · 5 = 15 az OOF-jóslatokhoz, plusz 3 végső tanítás = 18. A 15 kihagyja a végső tanítást, a 8 = 3 + 5 összeadás szorzás helyett."
        }
      ]
    },

    /* ------------------------------------------------ 7.6 */
    "ai7-76": {
      title: "Kvíz – 7.6 Szupport vektor gépek",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy lineáris SVM-nél w = (3; 4). Milyen széles az utca (2/‖w‖)?",
          options: ["0,4", "0,2", "10", "2/7"],
          answer: 0,
          hint: "‖w‖ a vektor hossza: gyök alatt a koordináták négyzetösszege.",
          explain: R`$\|\mathbf w\| = \sqrt{9 + 16} = 5$, szélesség $2/5 = 0{,}4$. A 0,2 a fél utca ($1/\|\mathbf w\|$), a 10 $= 2\|\mathbf w\|$, a 2/7 a koordináták összegével számol hossz helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy jellemző: negatív pontok 1 és 2, pozitívak 4 és 5. Hol a maximális margójú küszöb, és mekkora az utca?",
          options: ["3-nál, 2 széles", "3-nál, 1 széles", "2,5-nél, 3 széles", "bárhol 2 és 4 között, mindegyik egyforma"],
          answer: 0,
          hint: "A legközelebbi ellentétes pontok (2 és 4) között félúton.",
          explain: "A küszöb 3, az utca 2-től 4-ig tart: 2 széles (a fél utca 1). Bármely 2 és 4 közötti küszöb hibátlan a tanító adaton, de csak a 3 hagyja a legnagyobb tűrést mindkét oldalon."
        },
        {
          type: "single", shuffle: true,
          q: "Egy pozitív pontra (y = +1) az SVM f(x) = 0,4-et ad. Mennyi a csuklóvesztesége max(0, 1 − y·f(x))?",
          options: ["0,6", "0", "1,4", "0,4"],
          answer: 0,
          hint: "A pont a jó oldalon van, de az utcán belül-e?",
          explain: "1 − 0,4 = 0,6: jó oldalon van, de az utcában – ezért fizet. A 0 akkor lenne, ha y·f ≥ 1 (az utcán kívül). Az 1,4 = 1 + 0,4 előjelhiba."
        },
        {
          type: "match",
          q: "Mit okoz a hiperparaméter?",
          pairs: [
            ["nagy C", "keskeny utca, kevés tanítóhiba, túlillesztés veszélye"],
            ["kis C", "széles utca, erősebb regularizáció"],
            ["nagy γ (RBF)", "kacskaringós határ, pontok körüli buborékok"],
            ["kis γ (RBF)", "sima, majdnem egyenes határ"]
          ],
          hint: "A C a szabálysértés ára; a γ azt szabja meg, milyen messzire hat egy szupportvektor hasonlósága.",
          explain: "Nagy C: drága a sértés, keskeny utca. Kis C: olcsó, széles utca. Nagy γ: keskeny harang, csak a közeli pontok számítanak – túlillesztés. Két forrás (MLD, DLV) ezek irányát fordítva írja!"
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a (xz + 1)² polinomiális kernel értéke x = 2, z = 3 esetén?",
          options: ["49", "36", "13", "7"],
          answer: 0,
          hint: "Előbb a szorzat, aztán +1, aztán négyzetre emelés.",
          explain: R`$(2 \cdot 3 + 1)^2 = 49$ – ugyanannyi, mint $\varphi(x) = (x^2;\ \sqrt2x;\ 1)$ és $\varphi(z)$ skaláris szorzata: $36 + 12 + 1$. A 36 csak az első tag, a 7 a négyzetre emelés előtti érték.`
        },
        {
          type: "single", shuffle: true,
          q: "RBF-kernel, γ = 1, a két pont távolsága 2. Mennyi K = exp(−γ‖x − z‖²)?",
          options: ["≈ 0,018", "≈ 0,135", "≈ 0,368", "0,5"],
          answer: 0,
          hint: "A kitevőben a távolság négyzete áll.",
          explain: R`$e^{-1 \cdot 4} \approx 0{,}018$. A 0,135 $= e^{-2}$ (a távolság négyzetre emelése nélkül), a 0,368 $= e^{-1}$.`
        },
        {
          type: "multi",
          q: "Melyik igaz az SVM gyakorlati használatára?",
          options: [
            "A jellemzőket standardizálni kell (a csővezetékben).",
            "A C-t és a γ-t együtt, logaritmikus rácson, keresztvalidációval érdemes hangolni.",
            "Az f(x) pontszám egy kalibrált valószínűség.",
            "A kernel-SVM milliós adaton is gyorsan tanul.",
            "A nem szupportvektor pontok elhagyása nem változtat a megoldáson."
          ],
          answer: [0, 1, 4],
          hint: "Mit lát egy RBF-kernel a mértékegységekből? Mi a csuklóveszteség az utcán kívüli pontokra?",
          explain: "Skálázás nélkül az emlőrák-adatokon 92,1%, skálázva 97,7%. A pontszám távolság-jellegű, nem valószínűség (ahhoz Platt-skálázás kell). A tanítás nagyjából n²–n³-nel nő. Az utcán kívüli pontok vesztesége 0, nem befolyásolják a megoldást."
        }
      ]
    },

    /* ------------------------------------------------ 7.7 */
    "ai7-77": {
      title: "Kvíz – 7.7 Mikor melyik?",
      questions: [
        {
          type: "match",
          q: "Melyik modell illik leginkább az adathoz?",
          pairs: [
            ["pontfelhő, körülötte gyűrű a másik osztályból", "RBF-SVM vagy kNN"],
            ["két osztály egy ferde egyenes két oldalán", "logisztikus regresszió"],
            ["nyers képek pixelekkel", "mélytanulás"],
            ["nagy táblázat hiányzó értékekkel, kategóriás oszlopokkal", "gradiens boosting"]
          ],
          hint: "Gondolj az induktív torzításra: milyen alakú határt „szeret” az egyes modell?",
          explain: "A gyűrűhöz sima, görbe határ kell (RBF, helyi szavazás). Ferde egyeneshez a lineáris modell illik – a fák lépcsőznek. Képeken a térbeli szerkezetet a konvolúciós hálók tanulják meg. Táblázatos adaton a gradiens boosting a bajnok."
        },
        {
          type: "single", shuffle: true,
          q: "Mit állít a „nincs ingyen ebéd” tétel?",
          options: [
            "Az összes elképzelhető feladatra átlagolva egyik tanuló algoritmus sem jobb a másiknál.",
            "A bonyolultabb modell mindig jobb, csak több adat kell hozzá.",
            "A gradiens boosting minden táblázatos feladaton a legjobb.",
            "A modellek tanítása mindig számítási költséggel jár."
          ],
          answer: 0,
          hint: "Ha egy modell valahol jobb, mi következik ebből máshol?",
          explain: "Wolpert (1996): átlagosan minden algoritmus egyforma; egy modell csak azért nyer egy feladaton, mert a feltevései illenek hozzá. Ezért kell alapvonal és validáció."
        },
        {
          type: "set",
          q: "Melyik modellnél kell a jellemzőket skálázni?",
          items: ["kernel-SVM", "kNN", "regularizált logisztikus regresszió", "döntési fa", "véletlen erdő", "gradiens boosting"],
          answer: ["kernel-SVM", "kNN", "regularizált logisztikus regresszió"],
          hint: "Melyik számol távolságot vagy büntet súlynagyságot, és melyik használ csak sorrendet?",
          explain: "Az SVM és a kNN távolságokkal, a regularizált logisztikus regresszió a súlyok nagyságával dolgozik – ezek mértékegységfüggők. A fák és a fákból álló együttesek csak a sorrendet nézik."
        },
        {
          type: "single", shuffle: true,
          q: "A logisztikus regresszió a XOR-adaton kb. 48%-os. Miért?",
          options: [
            "Mert egyetlen egyenes nem választja szét a XOR négy csoportját – a véletlen szintjén marad.",
            "Mert túl kevés volt a tanító adat.",
            "Mert a jellemzőket nem standardizáltuk.",
            "Mert a logisztikus regresszió túlilleszt."
          ],
          answer: 0,
          hint: "Rajzold le a négy csoportot, és próbálj egy egyenest húzni.",
          explain: R`Bármely egyenes mindkét oldalára nagyjából fele-fele jut mindkét osztályból. Ez az induktív torzítás korlátja (alulillesztés), nem az adatmennyiségé. Egy $x_1x_2$ jellemző megoldaná (5.6).`
        },
        {
          type: "single", shuffle: true,
          q: "Két modell ugyanazon a 400 pontos teszten 88,8% és 89,3%. Mit mondhatsz?",
          options: [
            "A különbség (2 pont) a mérés bizonytalanságán belül van – ebből nem dönthető el.",
            "A második biztosan jobb.",
            "Az első biztosan jobb, mert egyszerűbb.",
            "Mindkettő túlilleszt."
          ],
          answer: 0,
          hint: "Mekkora egy 89%-os arány hibahatára 400 mintánál?",
          explain: R`$1{,}96\sqrt{0{,}89 \cdot 0{,}11/400} \approx 0{,}03$ – kb. ±3 százalékpont. A 0,5 pont különbség ennél sokkal kisebb; ismételt CV vagy páros összehasonlítás kellene (6.9).`
        },
        {
          type: "single", shuffle: true,
          q: "A célváltozó (pl. egy webshop forgalma) évről évre nő. Melyik modell jósolja a legkevésbé alá a jövő évet?",
          options: ["lineáris regresszió (trenddel)", "véletlen erdő", "gradiens boosting", "döntési fa"],
          answer: 0,
          hint: "Melyik modell tud a tanító adat tartományán túl is „folytatni”?",
          explain: "A fák (és a fákból álló együttesek) levelei a látott értékek átlagai, ezért nem extrapolálnak. A lineáris trend folytatódik – vagy a trendet leválasztva a fák a maradékot jósolhatják."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai7-final": {
      title: "Fejezetzáró teszt – 7. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy csomópontban 2 esős és 2 száraz nap van. Mennyi a Gini-indexe?",
          options: ["0,5", "1", "0,25", "0"],
          answer: 0,
          hint: R`$1 - p^2 - (1 - p)^2$ két osztálynál.`,
          explain: R`$1 - 0{,}25 - 0{,}25 = 0{,}5$ – két osztálynál ez a legnagyobb érték. Az 1 az entrópia (bit), a 0,25 egyetlen tag.`
        },
        {
          type: "single", shuffle: true,
          q: "8 minta (4 : 4). Három jelölt vágás: A → (4 : 1) és (0 : 3); B → (3 : 1) és (1 : 3); C → (2 : 2) és (2 : 2). Melyiket választja a CART?",
          options: ["A-t", "B-t", "C-t", "mindhárom egyforma"],
          answer: 0,
          hint: "Számold ki a súlyozott Gini-indexet mindháromra.",
          explain: R`A: $\tfrac58 \cdot 0{,}32 + 0 = 0{,}2$. B: mindkét ág 0,375, súlyozva 0,375. C: 0,5 – semmit nem javít. A legkisebb súlyozott Gini az A-é.`
        },
        {
          type: "single", shuffle: true,
          q: "x = 1, 2, 3, 4 és y = 3, 4, 10, 12. Mi egy regressziós fa első vágása?",
          options: ["x < 2,5 (levelek: 3,5 és 11)", "x < 1,5 (levelek: 3 és 8,67)", "x < 3,5 (levelek: 5,67 és 12)", "nincs jó vágás, a levél 7,25"],
          answer: 0,
          hint: "Mindhárom lehetséges vágásra add össze a két oldal négyzetes hibáját.",
          explain: "SSE: x < 1,5 → 34,7; x < 2,5 → 0,5 + 2 = 2,5; x < 3,5 → 28,7. A legkisebb a 2,5-ös vágásé. A 7,25 a vágás nélküli átlag (SSE 58,75)."
        },
        {
          type: "single", shuffle: true,
          q: "Nagy n esetén egy bootstrap-minta az eredeti minták kb. hány százalékát tartalmazza (legalább egyszer)?",
          options: ["kb. 63%", "100%", "kb. 37%", "kb. 50%"],
          answer: 0,
          hint: R`Egy adott minta $(1 - 1/n)^n \approx 1/e$ eséllyel marad ki.`,
          explain: R`$1 - 1/e \approx 0{,}632$. A 37% a kimaradó (OOB) rész. A 100% akkor lenne, ha visszatevés nélkül húznánk n-et – az az eredeti adat.`
        },
        {
          type: "single", shuffle: true,
          q: "Miben különbözik a véletlen erdő a baggingtől?",
          options: [
            "Minden vágásnál csak a jellemzők egy véletlen része közül választhat, ezért a fák kevésbé korreláltak.",
            "Sekély fákat használ, és egymás után tanítja őket.",
            "Nem használ bootstrap-mintákat.",
            "A fák szavazatát a hibájuk szerint súlyozza."
          ],
          answer: 0,
          hint: R`Melyik tag csökken a $\rho\sigma^2 + (1 - \rho)\sigma^2/B$ képletben?`,
          explain: "A véletlen erdő = bagging + vágásonkénti véletlen jellemző-részhalmaz. Ez a ρ korrelációt csökkenti, így a variancia padlóját is. A sekély, egymás utáni fák és a súlyozott szavazás a boostingra jellemző."
        },
        {
          type: "single", shuffle: true,
          q: "Gradiens boosting két ponttal: y = 2 és y = 6, a tönk mindkét maradékot pontosan megtanulja, ν = 0,5. Mennyi F₁?",
          options: ["3 és 5", "2 és 6", "4 és 4", "3,8 és 4,2"],
          answer: 0,
          hint: "F₀ = 4, a maradékok −2 és +2; ebből csak a ν-szörösét adjuk hozzá.",
          explain: "F₁ = 4 + 0,5 · (−2) = 3 és 4 + 0,5 · 2 = 5. A 2 és 6 ν = 1 lenne, a 4 és 4 a kezdő modell, a 3,8 és 4,2 ν = 0,1-gyel jönne ki."
        },
        {
          type: "single", shuffle: true,
          q: "Az AdaBoost egy tagjának súlyozott hibája 0,6. Mi történik a szavazatával?",
          options: [
            "α negatív lesz: a tag véleményét megfordítva számítjuk.",
            "α nagyobb lesz, mint egy 0,4-es hibájú tagé.",
            "α = 0,6 lesz.",
            "Semmi: minden tag egyforma súllyal szavaz."
          ],
          answer: 0,
          hint: R`$\alpha = \tfrac12\ln\frac{1 - \varepsilon}{\varepsilon}$ – mi az előjele, ha a tört 1-nél kisebb?`,
          explain: R`$\tfrac12\ln(0{,}4/0{,}6) \approx -0{,}2$. Egy 60%-ban tévedő osztályozó megfordítva 60%-ban talál – a negatív súly épp ezt teszi.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy stack metamodellje az alapmodellek saját tanító adatukon adott jóslatain tanult, és a validáción rosszabb, mint a legjobb alapmodell. Mi a valószínű ok?",
          options: [
            "Szivárgás: a tanító adaton adott jóslatok túl jók, a metamodell rossz súlyokat tanult – OOF-jóslat kellett volna.",
            "Túl kevés alapmodell volt.",
            "A metamodell túl egyszerű volt.",
            "A stacking sosem jobb egy modellnél."
          ],
          answer: 0,
          hint: "Milyen pontosak a mély fák a saját tanító adatukon?",
          explain: "Egy mély fa a tanító adaton 100%-os, így a metamodell „mindig a fának higgy” szabályt tanul – új adaton ez nem igaz. Hajtáson kívüli jóslatokon kell tanítani."
        },
        {
          type: "single", shuffle: true,
          q: "Egy lineáris SVM-ből elhagyunk egy tanító pontot, amely az utcán kívül, a jó oldalon van. Mi változik?",
          options: ["semmi", "az utca kiszélesedik", "az utca keskenyebb lesz", "a határ elfordul"],
          answer: 0,
          hint: "Mekkora ennek a pontnak a csuklóvesztesége, és szupportvektor-e?",
          explain: "A megoldás csak a szupportvektoroktól függ; az utcán kívüli pont vesztesége 0, nem szupportvektor. Ha egy szupportvektort hagynánk el (vagy mozgatnánk), az utca megváltozhatna."
        },
        {
          type: "single", shuffle: true,
          q: "Egy RBF-SVM a tanító adaton 100%-os, a validáción 82%-os. Mit próbálnál előbb?",
          options: ["C és γ csökkentését", "C és γ növelését", "a skálázás elhagyását", "több fa hozzáadását"],
          answer: 0,
          hint: "Túlillesztés: melyik irány ad szélesebb utcát és simább határt?",
          explain: "Kisebb C → szélesebb utca, kisebb γ → simább határ: mindkettő a túlillesztés ellen hat. A kettőt együtt kell hangolni, CV-vel. A skálázás az SVM-nek kell; „fák” nincsenek benne."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a kernel trükkre?",
          options: [
            "A kernel két pont skaláris szorzatát egy nagyobb dimenziós térben számolja ki, a leképezés kiszámítása nélkül.",
            "Az RBF-kernelhez tartozó jellemzőtér végtelen dimenziós.",
            "A kernel egy transzformált jellemzővektort ad vissza.",
            "A kernel a lényegtelen jellemzőket automatikusan figyelmen kívül hagyja.",
            "Az SVM döntése felírható a szupportvektorokkal vett kernelértékek súlyozott összegeként."
          ],
          answer: [0, 1, 4],
          hint: "A kernel egy számot ad két pontra. Mit mutatott az ESL kísérlete a zajos jellemzőkkel?",
          explain: "A kernel egyetlen szám ($\\varphi(\\mathbf x)^\\top\\varphi(\\mathbf z)$), nem vektor. A zajos jellemzők a kernel-SVM-et is rontják (ESL: a másodfokú kernel 92%-ról 85%-ra esett 6 zajos jellemzőtől)."
        },
        {
          type: "single", shuffle: true,
          q: "Az emlőrák-adatokon az RBF-SVM nyers jellemzőkkel 92,1%, standardizálva 97,7%; a döntési fa mindkét esetben 92,6%. Miért?",
          options: [
            "Az SVM távolságokkal számol, ezért függ a mértékegységektől; a fa csak a jellemzők sorrendjét használja.",
            "A standardizálás több adatot ad az SVM-nek.",
            "A fát nem lehet standardizált adaton tanítani.",
            "Véletlen ingadozás; a különbség nem valódi."
          ],
          answer: 0,
          hint: "Melyik modell látja a jellemzők nagyságát, és melyik csak a sorrendjüket?",
          explain: "Skálázás nélkül a nagy számértékű jellemzők uralják az RBF-távolságot. A fa vágásai csak a sorrendet nézik, a monoton átalakítás nem változtat rajtuk. A +5,6 pont jóval nagyobb a szórásnál."
        },
        {
          type: "single", shuffle: true,
          q: "Egy kórháznak olyan modell kell, amelynek döntését szabályként a betegnek is meg lehet magyarázni. Mit javasolsz?",
          options: [
            "Metszett, sekély döntési fát (vagy kevés jellemzős logisztikus regressziót).",
            "500 fás véletlen erdőt.",
            "Stackinget öt különböző modellel.",
            "RBF-kernelű SVM-et."
          ],
          answer: 0,
          hint: "Melyik modell szerkezete olvasható ki közvetlenül HA–AKKOR szabályokként?",
          explain: "A sekély fa levelei közvetlenül szabályok. Az erdő, a stack és a kernel-SVM pontosabb lehet, de egyetlen döntésük sem olvasható ki egyszerű szabályként. Érdemes megmérni, mennyi pontosságba kerül az érthetőség."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
