/* =========================================================
   Mesterséges intelligencia 6. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 6.1 */
    "ai6-61": {
      title: "Kvíz – 6.1 Osztályozási metrikák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy modell tévesztési mátrixa: TP = 30, FN = 10, FP = 20, TN = 140. Mennyi a felidézés?",
          options: ["0,75", "0,6", "0,85", "0,875"],
          answer: 0,
          hint: "A felidézés a valóban pozitívak (a mátrix sora) közül a megtaláltak aránya.",
          explain: R`Felidézés $= TP/(TP + FN) = 30/40 = 0{,}75$. A 0,6 a precizitás ($30/50$), a 0,85 a pontosság ($170/200$), a 0,875 a specificitás ($140/160$).`
        },
        {
          type: "single", shuffle: true,
          q: "Ugyanennél a mátrixnál (TP = 30, FN = 10, FP = 20, TN = 140) mennyi a precizitás?",
          options: ["0,6", "0,75", "0,85", "0,125"],
          answer: 0,
          hint: "A precizitás a pozitívnak mondottak (a mátrix oszlopa) közül a valóban pozitívak aránya.",
          explain: R`Precizitás $= TP/(TP + FP) = 30/50 = 0{,}6$. A 0,75 a felidézés, a 0,85 a pontosság, a 0,125 a téves pozitív arány ($20/160$).`
        },
        {
          type: "match",
          q: "Párosítsd az orvos kérdését a mérőszámmal!",
          pairs: [
            ["A betegek közül hányat találtunk meg?", "felidézés (érzékenység)"],
            ["Akit betegnek mondtunk, az hány százalékban tényleg beteg?", "precizitás"],
            ["Az egészségesek közül hányat mondtunk egészségesnek?", "specificitás"],
            ["Az összes döntés hány százaléka helyes?", "pontosság"]
          ],
          hint: "Melyik halmazon belül számolsz arányt: a betegeken, a megjelölteken, az egészségeseken vagy mindenkin?",
          explain: "Felidézés: TP/(TP + FN) – a betegek sora. Precizitás: TP/(TP + FP) – a megjelöltek oszlopa. Specificitás: TN/(TN + FP) – az egészségesek sora. Pontosság: (TP + TN)/n – mindenki."
        },
        {
          type: "single", shuffle: true,
          q: "2000 tranzakcióból 10 csalás. Mennyi a „soha nem csalás” modell pontossága?",
          options: ["99,5%", "0,5%", "50%", "0%"],
          answer: 0,
          hint: "A modell minden rendben lévő tranzakciót eltalál. Hány ilyen van?",
          explain: R`$1990/2000 = 99{,}5\%$ – miközben a felidézése 0. A 0,5% a csalások aránya, a 0% a felidézés. Ritka osztálynál a pontosság szinte csak a negatívokat méri.`
        },
        {
          type: "single", shuffle: true,
          q: "Precizitás 0,5, felidézés 1. Mennyi az F1?",
          options: ["≈ 0,667", "0,75", "0,5", "≈ 0,333"],
          answer: 0,
          hint: R`Harmonikus átlag: $2PR/(P + R)$.`,
          explain: R`$F_1 = 2 \cdot 0{,}5 \cdot 1/1{,}5 \approx 0{,}667$. A 0,75 a számtani átlag; a 0,333 a 2-es szorzó elhagyásából jön. A harmonikus átlag a kisebbik érték felé húz.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a többosztályos átlagolásra?",
          options: [
            "Ha minden mintának egy címkéje van, a mikro-F1 egyenlő a pontossággal.",
            "A makróátlag minden osztályt egyformán súlyoz, a méretüktől függetlenül.",
            "A mikroátlag érzékenyebb a ritka osztály hibáira, mint a makróátlag.",
            "A súlyozott átlag az osztályok gyakoriságával súlyoz."
          ],
          answer: [0, 1, 3],
          hint: "Mikro: minden minta egyformán számít. Makró: minden osztály egyformán számít.",
          explain: "A mikroátlagot a gyakori osztályok uralják – a ritka osztály hibái épp a makróátlagban látszanak jobban. A többi állítás igaz."
        }
      ]
    },

    /* ------------------------------------------------ 6.2 */
    "ai6-62": {
      title: "Kvíz – 6.2 Küszöb, ROC és AUC",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Pozitívok pontszámai: 0,9 és 0,5. Negatívoké: 0,6; 0,2; 0,1. Mennyi az AUC?",
          options: ["≈ 0,833", "≈ 0,667", "0,5", "0,75"],
          answer: 0,
          hint: "Hány (pozitív, negatív) pár van, és hány párban nagyobb a pozitív pontszáma?",
          explain: R`$2 \cdot 3 = 6$ pár. A 0,9 mindhárom negatívnál nagyobb (3), a 0,5 a 0,2-nél és a 0,1-nél (2): $5/6 \approx 0{,}833$. A 0,667 és a 0,75 elszámolásból jön (egy pár kimarad vagy rossz irányba számít); a 0,5 a véletlen szint.`
        },
        {
          type: "single", shuffle: true,
          q: "A tíz páciensnél (6.2, 1. lépés) egy elmulasztott beteg 10, egy fölösleges kontroll 1 egység. Melyik küszöb a legolcsóbb?",
          options: ["0,30", "0,80", "0,55", "0,05"],
          answer: 0,
          hint: R`Számold ki mindegyikre: $10 \cdot FN + 1 \cdot FP$.`,
          explain: R`0,80: $20 + 0 = 20$; 0,55: $10 + 1 = 11$; 0,30: $0 + 2 = 2$; 0,05: $0 + 6 = 6$. A 0,30 minden beteget megtalál, csak két fölösleges kontrollal.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az AUC-ra?",
          options: [
            "Nem függ a döntési küszöbtől.",
            "Nem változik, ha minden pontszámot egy szigorúan növő függvénnyel átalakítunk.",
            "0,5 a véletlen (vagy állandó) pontszám szintje.",
            "Ha az AUC magas, a modell valószínűségei biztosan kalibráltak.",
            "Erősen függ attól, hány százalék a pozitív osztály."
          ],
          answer: [0, 1, 2],
          hint: "Az AUC csak a pontszámok sorrendjét nézi.",
          explain: "Az AUC a rangsort méri: küszöbfüggetlen, monoton átalakításra érzéketlen, 0,5 a véletlen. A kalibrációról nem mond semmit (a felezett pontszámok AUC-ja ugyanannyi), és mivel TPR-ből és FPR-ből épül, az osztályaránytól sem függ."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kalibrált modellnél egy téves negatív 4-szer drágább, mint egy téves pozitív. Mennyi a legjobb küszöb?`,
          options: ["0,2", "0,8", "0,25", "0,5"],
          answer: 0,
          hint: R`$t^* = C_{FP}/(C_{FP} + C_{FN})$.`,
          explain: R`$t^* = 1/(1 + 4) = 0{,}2$. A 0,8 a két költség felcserélése, a 0,25 az $1/4$ hányados (a nevezőből kimaradt a $C_{FP}$), a 0,5 az alapértelmezés, ami csak egyforma áraknál jó.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy ROC-pont: FPR = 0,05, TPR = 0,9. Az adatban 100 pozitív és 1900 negatív van. Mennyi a precizitás?",
          options: ["≈ 0,49", "0,9", "0,95", "0,05"],
          answer: 0,
          hint: "Számold ki a TP-t és az FP-t darabszámban!",
          explain: R`TP $= 0{,}9 \cdot 100 = 90$, FP $= 0{,}05 \cdot 1900 = 95$; precizitás $90/185 \approx 0{,}49$. A 0,9 a felidézés, a 0,95 a specificitás. A jó ROC-pont mögött is lehet sok hamis riasztás.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a PR-görbe véletlen szintje, ha a minták 2%-a pozitív?",
          options: ["0,02", "0,5", "0,98", "0"],
          answer: 0,
          hint: "Mekkora a precizitása egy olyan modellnek, ami véletlenszerűen jelöl meg mintákat?",
          explain: "A véletlenül megjelölt minták között ugyanannyi a pozitív, mint az egész adatban: 2%. A 0,5 a ROC-görbe (AUC) véletlen szintje – a PR-görbéé a pozitív osztály aránya."
        }
      ]
    },

    /* ------------------------------------------------ 6.3 */
    "ai6-63": {
      title: "Kvíz – 6.3 Regressziós metrikák",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A hibák: +3, −1, 0, −4. Mennyi a MAE és az RMSE?",
          options: ["MAE 2; RMSE ≈ 2,55", "MAE 2; RMSE 6,5", "MAE −0,5; RMSE ≈ 2,55", "MAE ≈ 2,55; RMSE 2"],
          answer: 0,
          hint: "A MAE-hez abszolút érték kell, az RMSE-hez a négyzetek átlagának gyöke.",
          explain: R`MAE $= (3 + 1 + 0 + 4)/4 = 2$; MSE $= (9 + 1 + 0 + 16)/4 = 6{,}5$, RMSE $= \sqrt{6{,}5} \approx 2{,}55$. A 6,5 az MSE (lemaradt a gyökvonás), a −0,5 az előjeles átlag.`
        },
        {
          type: "single", shuffle: true,
          q: R`A címkék szórásnégyzete 50, a modell MSE-je 10. Mennyi az $R^2$?`,
          options: ["0,8", "0,2", "5", "−0,8"],
          answer: 0,
          hint: R`$R^2 = 1 - \text{MSE}_{\text{modell}}/\text{MSE}_{\text{átlag}}$, és az átlag MSE-je épp a szórásnégyzet.`,
          explain: R`$1 - 10/50 = 0{,}8$. A 0,2 a hányados maga (kimaradt az „1 −”), az 5 a fordított hányados.`
        },
        {
          type: "match",
          q: "Melyik mérőszám illik a helyzethez?",
          pairs: [
            ["A nagy tévedések aránytalanul rosszak (árvízi vízszint).", "RMSE"],
            ["Nagyon különböző méretű boltok forgalmát vetjük össze.", "MAPE"],
            ["Jobb-e a modell, mint mindig az átlagot mondani?", "R² (determinációs együttható)"],
            ["Tipikus hiba kell, néhány kiugró pont mellett.", "MAE"]
          ],
          hint: "Melyik bünteti jobban a nagy hibát, melyik relatív, melyik viszonyít az átlaghoz?",
          explain: "Az RMSE a négyzetre emelés miatt a nagy hibákat bünteti; a MAPE relatív, így összevethető; az R² az átlag-alapvonalhoz mér; a MAE kevésbé érzékeny a kiugrókra."
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`Az $R^2$ a teszt halmazon negatív is lehet.`,
            "Az RMSE mindig legalább akkora, mint a MAE.",
            "A MAPE 0 közeli címkéknél is jól használható.",
            "Az MSE mértékegysége a címke mértékegységének négyzete.",
            "A MAE-t minimalizáló konstans jóslat a medián."
          ],
          answer: [0, 1, 3, 4],
          hint: "Gondolj a 0,5 °C-os példára és a legjobb konstans jóslatra (3.4).",
          explain: R`0 közeli címkénél a relatív hiba felrobban (0,5 °C helyett 1,5 °C: 200%), és 0-nál nem is értelmezhető. A többi igaz: negatív $R^2$ = rosszabb az átlagnál; RMSE ≥ MAE; MSE ~ egység²; a MAE-t a medián minimalizálja.`
        },
        {
          type: "single", shuffle: true,
          q: "A valódi érték 50, a jóslat 100. Mennyi a relatív (abszolút százalékos) hiba?",
          options: ["100%", "50%", "200%", "0,5%"],
          answer: 0,
          hint: "A hibát a valódi értékhez viszonyítjuk, nem a jóslathoz.",
          explain: R`$|100 - 50|/50 = 100\%$. Az 50% a jóslathoz viszonyított hiba lenne – fordítva (valódi 100, jóslat 50) jönne ki. Ez a MAPE aszimmetriája.`
        }
      ]
    },

    /* ------------------------------------------------ 6.4 */
    "ai6-64": {
      title: "Kvíz – 6.4 Tanító, validációs és teszt halmaz",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Melyik halmazon választjuk ki a döntési küszöböt?",
          options: ["a validációs halmazon", "a teszt halmazon", "a tanító halmazon, a súlyokkal együtt", "mindegy, a küszöb nem befolyásolja az értékelést"],
          answer: 0,
          hint: "A küszöb is döntés. Melyik halmaz való a döntésekhez?",
          explain: "Minden döntés (hiperparaméter, küszöb, modellválasztás) a validáción születik. A teszt halmazt csak egyszer, a végén használjuk – ha ott hangolnánk, a teszteredmény optimista lenne."
        },
        {
          type: "single", shuffle: true,
          q: "Három pénzfeldobással döntő modell, kétmintás teszt halmaz. Mekkora eséllyel lesz legalább egyikük 100%-os?",
          options: ["≈ 0,58", "0,75", "0,25", "≈ 0,42"],
          answer: 0,
          hint: "Egy modell 1/4 eséllyel 100%-os. Mi az esélye, hogy egyik sem az?",
          explain: R`$1 - (3/4)^3 = 1 - 27/64 \approx 0{,}58$. A 0,75 a $3 \cdot 1/4$ (az események nem zárják ki egymást), a 0,42 a $27/64$ (annak esélye, hogy egyik sem). A teszten kiválasztott „legjobb” könnyen csak szerencsés.`
        },
        {
          type: "match",
          q: "Milyen felosztás illik az adathoz?",
          pairs: [
            ["100 páciens, mindegyiktől 5 röntgenkép", "csoportos"],
            ["tőzsdei árfolyam előrejelzése", "időbeli"],
            ["ritka betegség, a minták 1%-a pozitív", "rétegzett"],
            ["független, kiegyensúlyozott minták", "véletlen"]
          ],
          hint: "Mit kell a felosztásnak utánoznia: új pácienst, a jövőt, ugyanakkora betegarányt?",
          explain: "Egy páciens képei egy halmazba kerüljenek (csoportos); a jövőt a múltból jósoljuk (időbeli); a ritka osztály aránya maradjon meg (rétegzett); egyébként a véletlen felosztás is jó."
        },
        {
          type: "single", shuffle: true,
          q: "Egy teszt felidézése és specificitása 90–90%. Kiegyensúlyozott teszt halmazon a precizitás 0,9. Mennyi lesz élesben, ha csak 1% a beteg?",
          options: ["≈ 0,083", "0,9", "0,5", "0,01"],
          answer: 0,
          hint: "Számolj 1000 emberrel: hány TP és hány FP lesz?",
          explain: R`10 beteg → 9 TP; 990 egészséges → 99 FP; precizitás $9/108 \approx 0{,}083$. Címke-eltolódás: a precizitás az osztályaránytól függ, a felidézés és a specificitás nem.`
        },
        {
          type: "multi",
          q: "Melyik okozhat eloszlás-eltolódást a tanító adat és az éles használat között?",
          options: [
            "a kórház új röntgengépet vesz",
            "egy járvány alatt sokszorosára nő a betegek aránya",
            "az infláció miatt ugyanaz a lakás más árat ér",
            "ugyanabból az eloszlásból vett, nagyobb teszt halmaz"
          ],
          answer: [0, 1, 2],
          hint: "Kovariáns-, címke- és fogalom-eltolódás.",
          explain: "Új gép: a jellemzők eloszlása változik (kovariáns); járvány: az osztályarány (címke); infláció: maga az összefüggés (fogalom). Egy ugyanonnan vett nagyobb teszt halmaz nem eltolódás – csak pontosabb becslés."
        }
      ]
    },

    /* ------------------------------------------------ 6.5 */
    "ai6-65": {
      title: "Kvíz – 6.5 Keresztvalidáció",
      questions: [
        {
          type: "single", shuffle: true,
          q: "800 minta, 4-szeres keresztvalidáció. Hány mintán tanul egy kör modellje?",
          options: ["600", "200", "800", "400"],
          answer: 0,
          hint: "Egy hajtás a validáció, a többi a tanítás.",
          explain: "Egy hajtás 800/4 = 200 minta (ez a validáció); a maradék 3 hajtás, 600 minta a tanító. Négy ilyen kör van."
        },
        {
          type: "single", shuffle: true,
          q: "Az öt hajtás pontossága: 0,90; 0,80; 0,85; 0,75; 0,70. Mennyi a keresztvalidációs becslés?",
          options: ["0,80", "0,75", "0,85", "0,70"],
          answer: 0,
          hint: "A CV-becslés a hajtások eredményének átlaga.",
          explain: R`$(0{,}90 + 0{,}80 + 0{,}85 + 0{,}75 + 0{,}70)/5 = 4{,}00/5 = 0{,}80$. A 0,90 és a 0,70 közötti szórás azt mutatja, mennyire függne az eredmény egyetlen felosztástól.`
        },
        {
          type: "multi",
          q: "Melyik lépésnek kell a keresztvalidáció hajtásain <em>belül</em> (csővezetékben) futnia?",
          options: [
            "standardizálás",
            "a címkével leginkább korreláló jellemzők kiválasztása",
            "a ritka osztály túlmintavételezése",
            "egy ügyfélazonosító oszlop törlése"
          ],
          answer: [0, 1, 2],
          hint: "Ami az adatból tanul valamit, az csak a tanító részt láthatja.",
          explain: "A standardizálás, a jellemzőkiválasztás és a túlmintavételezés mind tanul az adatból – a hajtáson kívül szivárgást okoznak (a kiválasztás és a túlmintavételezés súlyosat). Egy oszlop törlése semmit nem tanul, mehet előtte."
        },
        {
          type: "match",
          q: "Melyik keresztvalidáció-változat illik a helyzethez?",
          pairs: [
            ["40 beszélő felvételei, a modell új beszélőkre kell", "csoportos"],
            ["havi eladások 2018–2025", "idősoros"],
            ["1000 levél, ebből 5% spam", "rétegzett"],
            ["25 minta, nagyon gyors modell", "egyet kihagyó (LOOCV)"]
          ],
          hint: "Csoportok, idő, ritka osztály, nagyon kevés adat.",
          explain: "Beszélőnként csoportos CV, különben a modell a hangokat „ismeri”; idősornál a validáció mindig a tanítás után jön; ritka osztálynál rétegzés; nagyon kevés adatnál az egyet kihagyó CV minden mintát kihasznál."
        },
        {
          type: "single", shuffle: true,
          q: "50 minta, 5000 tisztán véletlen jellemző. Ha a 100 „legjobb” jellemzőt az összes adaton választjuk ki, és csak utána keresztvalidálunk, mekkora CV-hibát kapunk (ESL 7.10.2)?",
          options: ["közel 0-t (a könyvben kb. 3%)", "kb. 50%-ot", "kb. 25%-ot", "100%-ot"],
          answer: 0,
          hint: "A kiválasztás már látta a validációs minták címkéit is.",
          explain: "A rossz sorrend kb. 3%-ot mutat (nálunk Pythonban 1,3%-ot), pedig a valódi hiba 50% – a kiválasztás épp a validációs mintákra is „illő” véletlen jellemzőket választotta. Helyes sorrendben (kiválasztás a hajtáson belül) kb. 50% jön ki."
        }
      ]
    },

    /* ------------------------------------------------ 6.6 */
    "ai6-66": {
      title: "Kvíz – 6.6 Túl- és alulillesztés, torzítás–variancia",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy pontban a valódi érték 8. Egy modell jóslatai négy tanító halmazon: 6, 10, 8, 12. Mennyi a torzítás, a variancia és az átlagos négyzetes hiba?",
          options: ["torzítás 1, variancia 5, hiba 6", "torzítás 0, variancia 5, hiba 5", "torzítás 1, variancia 5, hiba 5", "torzítás 1, variancia 20, hiba 21"],
          answer: 0,
          hint: "Torzítás = átlagos jóslat − valódi érték; variancia = a jóslatok szórásnégyzete; hiba = torzítás² + variancia.",
          explain: R`Átlag 9 → torzítás 1. Eltérések: −3, 1, −1, 3 → variancia $(9 + 1 + 1 + 9)/4 = 5$. Hiba $1^2 + 5 = 6$ (közvetlenül: $(4 + 4 + 0 + 16)/4 = 6$). A 20 a négyzetösszeg osztás nélkül.`
        },
        {
          type: "match",
          q: "Párosítsd a tünetet a diagnózissal!",
          pairs: [
            ["tanító 0,01, validációs 0,35", "túlillesztés"],
            ["tanító 0,30, validációs 0,31, elérhető szint 0,05", "alulillesztés"],
            ["tanító 0,06, validációs 0,07, elérhető szint 0,05", "rendben"],
            ["a saját teszten 95%, egy másik kórházban 80%", "eloszlás-eltolódás"]
          ],
          hint: "Nagy rés? Magas padló? Vagy a tanító- és a teszthiba is jó, csak máshol nem?",
          explain: "Nagy rés: variancia (túlillesztés). Közeli, de magas hibák: torzítás (alulillesztés). Mindkettő közel az elérhető szinthez: rendben. Ha a saját teszt jó, de más környezetben rossz: eltolódás."
        },
        {
          type: "multi",
          q: "Mire jó a több tanító adat?",
          options: [
            "a túlillesztés csökkentésére",
            "a variancia csökkentésére",
            "az alulillesztés megszüntetésére",
            "a modellcsalád torzításának csökkentésére"
          ],
          answer: [0, 1],
          hint: "Gondolj a tanulási görbékre: az egyenes 0,26-nál megállt.",
          explain: "A több adat a varianciát csökkenti – a túlillesztésen segít. A merev modell torzításán nem: az egyenes akárhány pontnál sem követi a szinuszt. (Egy forrás, DLV 9, ezt tévesen állítja.)"
        },
        {
          type: "single", shuffle: true,
          q: "A tanulási görbén a tanító- és a validációs hiba 200 minta óta együtt halad 0,26 körül; a zaj szintje 0,06. Mit javasolsz?",
          options: ["bonyolultabb modellt vagy jobb jellemzőket", "több adat gyűjtését", "erősebb regularizációt", "kevesebb jellemzőt"],
          answer: 0,
          hint: "Magas padló vagy nagy rés?",
          explain: "A görbék összeértek, de magasan: nagy torzítás. Több adat nem segít, a regularizáció és a kevesebb jellemző tovább merevítené a modellt."
        },
        {
          type: "single", shuffle: true,
          q: "Hogyan változik a torzítás és a variancia, ha a polinom fokszámát növeljük?",
          options: ["a torzítás csökken, a variancia nő", "mindkettő csökken", "a torzítás nő, a variancia csökken", "mindkettő nő"],
          answer: 0,
          hint: "A rugalmasabb modell jobban követi az átlagos alakot – de a zajt is.",
          explain: "A bonyolultság a torzítást csökkenti (a 9. fokú polinom torzítása szinte 0), a varianciát növeli (0,389). A kettő összegének minimuma a legjobb modell."
        }
      ]
    },

    /* ------------------------------------------------ 6.7 */
    "ai6-67": {
      title: "Kvíz – 6.7 Regularizáció",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Modell $\hat y = wx$, $\sum x_iy_i = 20$, $\sum x_i^2 = 10$. Mennyi a ridge-súly $\lambda = 10$-zel?`,
          options: ["1", "2", "1,5", "0,5"],
          answer: 0,
          hint: R`Ridge: $w = \sum xy/(\sum x^2 + \lambda)$.`,
          explain: R`$20/(10 + 10) = 1$. A 2 a büntetés nélküli megoldás, az 1,5 a lasso-képlet ($(20 - 5)/10$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanez ($\sum xy = 20$, $\sum x^2 = 10$) lasso-büntetéssel, $\lambda = 10$. Mennyi a súly?`,
          options: ["1,5", "1", "2", "0"],
          answer: 0,
          hint: R`Lasso (pozitív súlynál): $w = (\sum xy - \lambda/2)/\sum x^2$, ha ez pozitív.`,
          explain: R`$(20 - 5)/10 = 1{,}5$. Pontosan 0 csak $\lambda \ge 40$-nél lenne. Az 1 a ridge-eredmény: a ridge oszt, a lasso kivon.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "A lasso egyes súlyokat pontosan 0-ra állíthat.",
            R`A ridge-súlyok véges $\lambda$-nál nem lesznek pontosan 0.`,
            "Regularizáció előtt standardizálni kell a jellemzőket.",
            "A tengelymetszetet is büntetni kell.",
            R`A $\lambda$-t a tanítóhiba alapján választjuk.`
          ],
          answer: [0, 1, 2],
          hint: "Melyik büntetés nulláz? Mi történne skálázás nélkül? És a tanítóhiba melyik λ-nál a legkisebb?",
          explain: R`A tengelymetszetet nem büntetjük (különben a $y$ nullpontjától függne a jóslat), és a $\lambda$-t validációval / CV-vel választjuk – a tanítóhiba mindig $\lambda = 0$-nál a legkisebb.`
        },
        {
          type: "single", shuffle: true,
          q: "scikit-learn LogisticRegression: melyik a regularizáltabb modell?",
          options: ["C = 0,001", "C = 1000", "egyformák, a C nem a regularizációt állítja", "C = 1"],
          answer: 0,
          hint: R`A $C$ a büntetés erősségének fordítottja: $C = 1/\lambda$.`,
          explain: R`$C = 0{,}001$ azt jelenti, hogy $\lambda = 1000$ – nagyon erős büntetés. A Ridge/Lasso <code>alpha</code> paraméterénél fordítva: ott a nagyobb az erősebb.`
        },
        {
          type: "match",
          q: "Melyik módszer illik a helyzethez?",
          pairs: [
            ["500 jellemző, ebből valószínűleg csak 20 számít", "lasso"],
            ["10 jellemző, mind fontos, enyhe túlillesztés", "ridge"],
            ["erősen összefüggő jellemzőcsoportok, ritkítás kell", "elasztikus háló"],
            ["a modell alulilleszt", "kevesebb regularizáció"]
          ],
          hint: "Ritkítás, zsugorítás, a kettő keveréke – vagy épp lazítás.",
          explain: "A lasso ritkít; a ridge mindent megtart, csak zsugorít; az elasztikus háló ritkít, de összefüggő jellemzőknél stabilabb. Alulillesztésnél a büntetést csökkenteni kell, nem növelni."
        }
      ]
    },

    /* ------------------------------------------------ 6.8 */
    "ai6-68": {
      title: "Kvíz – 6.8 Hiperparaméter-hangolás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Négy modell a bonyolultabbtól az egyszerűbbig, CV-pontosságuk: 0,880; 0,875; 0,860; 0,850. A legjobb standard hibája 0,01. Melyiket választja az egy-standard-hiba szabály?",
          options: ["a másodikat (0,875)", "az elsőt (0,880)", "a harmadikat (0,860)", "a negyediket (0,850)"],
          answer: 0,
          hint: "Határ: a legjobb mínusz egy standard hiba. Fölötte melyik a legegyszerűbb?",
          explain: R`Határ: $0{,}880 - 0{,}01 = 0{,}870$. Fölötte az első kettő van; az egyszerűbb a második. A harmadik már kívül esik.`
        },
        {
          type: "single", shuffle: true,
          q: "3 hiperparaméter, mindegyikre 5 érték, rácskeresés 5-szörös CV-vel. Hány tanítás (a végső modell nélkül)?",
          options: ["625", "75", "125", "3125"],
          answer: 0,
          hint: "A kombinációk száma szorzódik, és mindegyiket 5-ször tanítjuk.",
          explain: R`$5^3 = 125$ kombináció, $125 \cdot 5 = 625$ tanítás. A 75 a $3 \cdot 5 \cdot 5$ (összeadott rács), a 3125 a $5^5$.`
        },
        {
          type: "single", shuffle: true,
          q: "A jó beállítások a tér 10%-át teszik ki. Mekkora eséllyel talál legalább egyet 20 véletlen próba?",
          options: ["≈ 0,88", "≈ 0,12", "1 (biztosan)", "0,2"],
          answer: 0,
          hint: "Annak az esélye, hogy egyik sem talál: 0,9²⁰.",
          explain: R`$1 - 0{,}9^{20} \approx 1 - 0{,}12 = 0{,}88$. A 0,12 annak esélye, hogy egyik sem talál; a „biztosan” a $20 \cdot 10\%$ hibás összeadásából jön.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            "A legjobb jelölt saját CV-eredménye optimista.",
            "A beágyazott CV a hangolással együtt értékeli az eljárást.",
            R`A tanulási rátát $10^{-5}$ és $10^{-1}$ között egyenletes skálán érdemes sorsolni.`,
            "A döntési küszöb is hiperparaméter, a validáción választjuk.",
            "Rácskeresésnél a próbák száma a gombok számával összeadódik."
          ],
          answer: [0, 1, 3],
          hint: "Gondolj a pénzfeldobó modellekre, a logaritmikus skálára és a rács robbanására.",
          explain: "A nagyságrendekben ható gombot logaritmikusan sorsoljuk (egyenletes sorsolásnál a próbák kb. 90%-a 0,01 fölé esne). A rács próbáinak száma szorzódik, nem összeadódik."
        },
        {
          type: "single", shuffle: true,
          q: "Beágyazott CV: külső 5 hajtás, belső 3 hajtás, 4 jelölt. Hány tanítás kell, ha minden külső körben a kiválasztott beállítást is újratanítjuk?",
          options: ["65", "60", "12", "20"],
          answer: 0,
          hint: "Egy külső körben: jelöltek × belső hajtások + 1.",
          explain: R`Körönként $4 \cdot 3 + 1 = 13$, öt körben 65. A 60 az újratanítások nélkül, a 12 egyetlen külső kör belső tanításai.`
        }
      ]
    },

    /* ------------------------------------------------ 6.9 */
    "ai6-69": {
      title: "Kvíz – 6.9 Bizonytalanság",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy modell 300 tesztmintán 75%-os. Hol van nagyjából a 95%-os konfidenciaintervallum?",
          options: ["kb. 70% és 80% között", "kb. 74% és 76% között", "kb. 65% és 85% között", "pontosan 75%-on"],
          answer: 0,
          hint: R`$1{,}96\sqrt{p(1 - p)/n}$.`,
          explain: R`$1{,}96\sqrt{0{,}75 \cdot 0{,}25/300} \approx 1{,}96 \cdot 0{,}025 \approx 0{,}049$ → kb. $[70\%; 80\%]$. A szűk intervallum a gyökvonás elhagyásából jön.`
        },
        {
          type: "single", shuffle: true,
          q: "Hányszor annyi tesztminta kell a hibahatár megfelezéséhez?",
          options: ["4-szer", "2-szer", "√2-ször", "8-szor"],
          answer: 0,
          hint: R`A hibahatár $1/\sqrt n$-nel arányos.`,
          explain: R`$\sqrt{4n} = 2\sqrt n$, tehát négyszeres $n$ felezi a határt. Ezért drága a pontos értékelés.`
        },
        {
          type: "single", shuffle: true,
          q: "Konform predikció: 9 kalibrációs abszolút hiba sorba rendezve: 0,1; 0,3; 0,4; 0,6; 0,7; 0,9; 1,2; 1,8; 2,5. Mekkora a q 80%-os lefedettséghez?",
          options: ["1,8", "2,5", "1,2", "0,7"],
          answer: 0,
          hint: R`A $\lceil (n + 1)(1 - \alpha)\rceil$-edik legkisebb értéket keresd.`,
          explain: R`$\lceil 10 \cdot 0{,}8\rceil = 8$, a 8. legkisebb: 1,8. Az 1,2 a 7. (ha $n + 1$ helyett $n$-nel szorozva lefelé kerekítünk: $\lfloor 9 \cdot 0{,}8\rfloor = 7$), a 2,5 a 9. (a 90%-hoz kellene), a 0,7 a medián.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a bootstrapra?",
          options: [
            "Visszatevéssel húzunk ugyanannyi mintát.",
            "Bármilyen mérőszámra (F1, AUC, különbség) használható.",
            "Csoportos adatnál a csoportokat kell újramintavételezni.",
            "Új információt teremt, ezért javítja a modellt."
          ],
          answer: [0, 1, 2],
          hint: "A bootstrap mérőszám ingadozását becsli – nem tanít.",
          explain: "A bootstrap csak azt mutatja meg, mennyire ingadozik a mérőszám a meglévő adat alapján; a modellen nem javít, és új információt sem teremt."
        },
        {
          type: "single", shuffle: true,
          q: R`Konform osztályozás, $q = 0{,}5$. A modell egy képre: macska 0,6, kutya 0,3, nyúl 0,1. Mi a jóslathalmaz?`,
          options: ["{macska}", "{macska, kutya}", "{macska, kutya, nyúl}", "üres halmaz"],
          answer: 0,
          hint: R`Egy osztály akkor kerül a halmazba, ha $1 - \hat p \le q$.`,
          explain: R`$1 - \hat p$: 0,4; 0,7; 0,9. Csak a macskáé $\le 0{,}5$. Bizonytalanabb képre (pl. 0,55 / 0,40 / 0,05) több osztály kerülne be.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai6-final": {
      title: "Fejezetzáró teszt – 6. Modellértékelés és általánosítás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy modell 98%-ban pontos, a pozitív osztály aránya 2%. Mit tudunk biztosan?",
          options: [
            "Lehet, hogy egyetlen pozitívat sem talál meg.",
            "A felidézése legalább 98%.",
            "A precizitása 98%.",
            "Biztosan jobb a véletlen tippelésnél."
          ],
          answer: 0,
          hint: "Mennyi a „mindig negatív” modell pontossága?",
          explain: "A „mindig negatív” modell épp 98%-os – felidézése 0, precizitása nem értelmezhető. A pontosságból a felidézés és a precizitás nem olvasható ki."
        },
        {
          type: "single", shuffle: true,
          q: "TP = 45, FN = 5, FP = 15, TN = 935. Mennyi az F1?",
          options: ["≈ 0,818", "0,75", "0,9", "0,98"],
          answer: 0,
          hint: R`$F_1 = 2TP/(2TP + FP + FN)$.`,
          explain: R`$90/(90 + 15 + 5) = 90/110 \approx 0{,}818$. A 0,75 a precizitás ($45/60$), a 0,9 a felidézés, a 0,98 a pontosság.`
        },
        {
          type: "single", shuffle: true,
          q: "Pozitívok pontszámai: 0,8 és 0,35. Negatívoké: 0,6; 0,4; 0,1. Mennyi az AUC?",
          options: ["≈ 0,667", "≈ 0,833", "0,5", "≈ 0,333"],
          answer: 0,
          hint: "6 pár; hányban nagyobb a pozitív?",
          explain: R`0,8: mindhárom fölött (3); 0,35: csak a 0,1 fölött (1). $4/6 \approx 0{,}667$.`
        },
        {
          type: "match",
          q: "Mi a következménye a hibának?",
          pairs: [
            ["skálázás a teljes adaton, a CV előtt", "enyhe szivárgás, kicsit optimista CV"],
            ["jellemzőkiválasztás a címke alapján, az összes adaton", "súlyos szivárgás, nagyon optimista CV"],
            ["idősor kevert keresztvalidációval", "a modell a jövőből tanul"],
            ["egy beteg képei több hajtásban", "a modell a beteget ismeri fel"]
          ],
          hint: "Ami tanul, az csak a tanító részt láthatja – és a felosztás utánozza a használatot.",
          explain: "A skálázás csak a jellemzők eloszlását látja (kis hiba); a címke alapú kiválasztás a validációs címkéket is (nagy hiba). Idősornál a keverés a jövőt is a tanításba teszi; a csoportok szétszórása az egyedet tanítja meg."
        },
        {
          type: "single", shuffle: true,
          q: "A hibák: 0, 0, 0, 0, 10. Mennyi a MAE és az RMSE?",
          options: ["MAE 2; RMSE ≈ 4,47", "MAE 2; RMSE 2", "MAE 2; RMSE 20", "MAE 10; RMSE ≈ 4,47"],
          answer: 0,
          hint: "RMSE = a négyzetek átlagának gyöke.",
          explain: R`MAE $= 10/5 = 2$; MSE $= 100/5 = 20$, RMSE $= \sqrt{20} \approx 4{,}47$. Az egyetlen nagy hiba az RMSE-t a MAE duplájánál is nagyobbra viszi.`
        },
        {
          type: "single", shuffle: true,
          q: "Tanítóhiba 0,01, validációs hiba 0,30, és a validációs görbe a tanító halmaz növelésével még meredeken csökken. Mit javasolsz?",
          options: ["több adatot vagy erősebb regularizációt", "bonyolultabb modellt", "a regularizáció kikapcsolását", "a validációs halmaz elhagyását"],
          answer: 0,
          hint: "Nagy rés, ami még záródik: torzítás vagy variancia?",
          explain: "Nagy variancia (túlillesztés), és a görbe még nem ért le: több adat valószínűleg segít, a regularizáció a rést szűkíti. A bonyolultabb modell rontana."
        },
        {
          type: "single", shuffle: true,
          q: R`$\sum x_iy_i = 31$, $\sum x_i^2 = 14$. Mekkora $\lambda$-tól lesz a lasso-súly pontosan 0?`,
          options: ["62", "31", "14", "soha"],
          answer: 0,
          hint: R`A lasso-súly $(\sum xy - \lambda/2)/\sum x^2$, amíg pozitív.`,
          explain: R`$31 - \lambda/2 \le 0 \iff \lambda \ge 62$. A „soha” a ridge-re igaz: $31/(14 + \lambda)$ sosem 0.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy modell 10 betegből 8-at talált meg. Melyik a felidézés 95%-os Wilson-intervalluma?",
          options: ["kb. [0,49; 0,94]", "kb. [0,55; 1,05]", "kb. [0,78; 0,82]", "pontosan 0,8"],
          answer: 0,
          hint: "Tíz mintából nagyon széles az intervallum, és nem lóghat ki a [0; 1]-ből.",
          explain: "A normális közelítés 0,8 ± 0,25 = [0,55; 1,05] – a felső határ értelmetlen. A Wilson-intervallum [0,49; 0,94]: tíz betegből a „80%” nagyon bizonytalan."
        },
        {
          type: "multi",
          q: "Melyik szabály helyes a teszt halmazra?",
          options: [
            "Csak egyszer, a legvégén használjuk.",
            "A döntési küszöböt nem rajta választjuk.",
            "Ha harmincszor hangoltunk rajta, az eredménye akkor is torzítatlan.",
            "Ritka osztálynál rétegzetten választjuk ki."
          ],
          answer: [0, 1, 3],
          hint: "A teszt halmaz egy lezárt boríték.",
          explain: "Minden rajta hozott döntés optimistává teszi – harminc hangolás után már validációs halmaz. A többi szabály helyes."
        },
        {
          type: "single", shuffle: true,
          q: "A „B” szűrőmodell: 0,5-ös küszöbnél FN = 2, FP = 40; 0,3-nál FN = 1, FP = 80; 0,1-nél FN = 0, FP = 200. Egy elmulasztott beteg 100, egy fölösleges kontroll 1 egység. Melyik küszöb a legolcsóbb?",
          options: ["0,3", "0,5", "0,1", "egyik sem – a legjobb a mindig „egészséges” modell"],
          answer: 0,
          hint: R`$100 \cdot FN + FP$ mindhárom küszöbre.`,
          explain: R`0,5: $200 + 40 = 240$; 0,3: $100 + 80 = 180$; 0,1: $0 + 200 = 200$; a mindig „egészséges”: $1000$. A 0,3 a legolcsóbb – bár a pontossága kisebb, mint a 0,5-é.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
