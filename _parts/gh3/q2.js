    /* ------------------------------------------------ 3.5 */
    "gh3-35": {
      title: "Kvíz – 3.5 Időbeli gráfok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány éle van az Árvízhét csütörtöki pillanatfelvételének (együttes említés aznap)?",
          options: ["6", "3", "10", "2"],
          answer: 0,
          hint: "Csütörtökön két cikk jelent meg, mindkettő háromszereplős. Hány párt ad egy háromszereplős cikk?",
          explain: R`Csütörtökön az 5. cikk ($\mathrm{Sz}, \mathrm{Kl}, \mathrm{Ko}$) és a 8. cikk ($\mathrm{La}, \mathrm{Po}, \text{Ön}$) jelent meg; mindkettő $\binom32 = 3$ élt ad, összesen 6. A 3 csak az egyik cikk éleit számolja, a 2 a cikkek száma, a 10 pedig a teljes hét összevont gráfjának élszáma – a pillanatfelvétel csak az aznapi éleket tartalmazza.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik időben érvényes út az Árvízhét időbeli gráfjában? (A nyíl fölött a nap.)",
          options: [
            R`$\mathrm{Ko} \xrightarrow{\text{Sze}} \mathrm{Po} \xrightarrow{\text{Cs}} \text{Ön} \xrightarrow{\text{V}} \mathrm{La}$`,
            R`$\mathrm{Kl} \xrightarrow{\text{Cs}} \mathrm{Ko} \xrightarrow{\text{Sze}} \mathrm{Vi}$`,
            R`$\mathrm{La} \xrightarrow{\text{Cs}} \mathrm{Po} \xrightarrow{\text{Sze}} \mathrm{Ko}$`,
            R`$\mathrm{Sz} \xrightarrow{\text{Szo}} \mathrm{Kl} \xrightarrow{\text{Cs}} \mathrm{Ko}$`
          ],
          answer: 0,
          hint: "Mindegyik él létezik a megadott napon. Csak azt nézd: a napok sorrendje sehol sem lép-e vissza?",
          explain: R`Az időben érvényes útban az időbélyegek nem csökkenhetnek: $t_1 \le t_2 \le \dots$. Szerda ≤ csütörtök ≤ vasárnap – ez rendben van. A másik háromban minden él létezik, de a sorrend visszafelé lép: csütörtök → szerda, csütörtök → szerda, szombat → csütörtök. Az összevont gráfban ezek is utak – ezek a „hamis utak”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az összevont gráfban a Klímaváltozás 3 lépésre van a Lakóktól. Hány lépésből áll a legrövidebb <b>időben érvényes</b> út $\mathrm{Kl}$-ből $\mathrm{La}$-ba?`,
          options: ["4 lépés", "3 lépés", "2 lépés", "nincs ilyen út"],
          answer: 0,
          hint: R`A Klímaváltozás először csütörtökön kapcsolódik bárkihez. Mikor van $\mathrm{Po}$–$\mathrm{La}$ él, és mikor érhetjük el a Polgármestert?`,
          explain: R`A $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Po}, \mathrm{La}$ út időben nem járható: a Polgármestert csak pénteken érjük el ($\mathrm{Ko}$–$\mathrm{Po}$), a $\mathrm{Po}$–$\mathrm{La}$ élek viszont szerdán és csütörtökön voltak. Kerülő kell: $\mathrm{Kl} \xrightarrow{\text{Cs}} \mathrm{Ko} \xrightarrow{\text{P}} \mathrm{Po} \xrightarrow{\text{Szo}} \text{Ön} \xrightarrow{\text{V}} \mathrm{La}$ – 4 lépés. A 3 az összevont távolság. Az időben érvényes távolság soha nem kisebb ennél, de lehet nagyobb.`
        },
        {
          type: "set",
          q: "Kiket érhetünk el a Klímaváltozásból időben érvényes úton a hét végéig? Jelöld meg mindet!",
          items: ["Szakértő", "Kormány", "Polgármester", "Önkéntesek", "Lakók", "Vízügy"],
          answer: ["Szakértő", "Kormány", "Polgármester", "Önkéntesek", "Lakók"],
          hint: "A Klímaváltozás csütörtökön kapcsolódik be. Nézd meg, mely szereplőknek van éle csütörtökön vagy később!",
          explain: R`Csütörtökön elérjük a Szakértőt és a Kormányt, pénteken a Polgármestert, szombaton az Önkénteseket, vasárnap a Lakókat. A Vízügy élei viszont csak hétfőn, kedden és szerdán voltak – még a klímavita előtt –, ezért a Vízügy időben <b>nem</b> érhető el. Az összevont gráfban ott van a $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Vi}$ út, de az időben visszafelé halad.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik igaz a Vízügy és a Klímaváltozás időbeli elérhetőségére (hétfőtől vasárnapig)?",
          options: [
            "A Vízügyből a Klímaváltozás elérhető, a Klímaváltozásból a Vízügy nem.",
            "Kölcsönösen elérhetők, hiszen az élek irányítatlanok.",
            "A Klímaváltozásból a Vízügy elérhető, a Vízügyből a Klímaváltozás nem.",
            "Egyik sem érhető el a másikból, mert nincs közöttük közvetlen él."
          ],
          answer: 0,
          hint: "Melyik napokon vannak a Vízügy élei, és melyik napon kapcsolódik be a Klímaváltozás?",
          explain: R`A Vízügyből hétfőn indulva eljutunk a Szakértőhöz vagy a Kormányhoz, onnan csütörtökön a Klímaváltozáshoz: $\mathrm{Vi} \xrightarrow{\text{H}} \mathrm{Sz} \xrightarrow{\text{Cs}} \mathrm{Kl}$. Visszafelé nem megy, mert csütörtök után a Vízügynek már nincs éle. Az időbeli elérhetőség <b>nem szimmetrikus</b>, még irányítatlan élekkel sem – az idő maga ad irányt. Közvetlen él nem kell: elég egy időben érvényes út.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az eseményfolyam az időrendbe rakott $(u, v, t)$ élek listája.`,
            "Minden időben érvényes út egyben út az összevont gráfban is.",
            "Az összevont gráf minden útja létezett időben is, csak más sorrendben.",
            "Az időben érvényes távolság lehet kisebb, mint az összevont gráfbeli távolság.",
            "Az összevont gráfból visszaállítható, melyik él melyik napon volt."
          ],
          answer: [0, 1],
          hint: "Mi történik az idővel, amikor az összes élt egyetlen gráfba rakjuk?",
          explain: R`Az eseményfolyam valóban az $(u, v, t)$ élek időrendi listája. Az időben érvényes út élei mind benne vannak az összevont gráfban, így ott is út – ezért az időbeli távolság soha nem kisebb az összevontnál. Fordítva nem igaz: az összevont gráfban vannak olyan utak, amelyek időben visszafelé haladnak (pl. $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Vi}$) – ezek a „hamis utak”. Az összevonás elhagyja az időt, így a napokat nem lehet visszaállítani.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kutató napi ablakkal elemzi a hírhálózatot, és azt látja, hogy a gráf minden nap darabokra esik. Mit tanácsol a szakasz?",
          options: [
            "Az ablak legyen akkora, mint a kérdés időskálája, és az eredményt több ablakmérettel is ellenőrizd.",
            "Mindig a heti összevont gráfot kell használni, mert az összefüggő.",
            "A legkisebb ablak a legpontosabb, ezért a napi eredmény a helyes: a hálózat valóban szétesett.",
            "Az ablakméret csak az ábrát változtatja meg, az elemzés eredményét nem."
          ],
          answer: 0,
          hint: "Mi veszik el a túl kicsi ablakkal, és mi a túl naggyal?",
          explain: R`Napi ablakkal a pillanatfelvételek kicsik és szétszórtak (hétfőn 3 szereplő 2 éllel, pénteken 2 szereplő 1 éllel). Heti ablakkal összefüggő gráfot kapunk, de elveszik az időrend. Egyik sem „a helyes”: az ablakméret is döntés. Hüvelykujjszabály: akkora ablak, mint a kérdés időskálája, és ellenőrzés több ablakmérettel – ha egy minta csak egy bizonyos ablaknál jelenik meg, gyanús.`
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "gh3-36": {
      title: "Kvíz – 3.6 Többrétegű és heterogén gráfok, hipergráf",
      questions: [
        {
          type: "match",
          q: "A lapok háromrétegű gráfja (hivatkozás, közös esemény, közös szereplő). Melyik lappárt melyik réteg köti össze? Párosítsd!",
          pairs: [
            ["Esti Krónika – Nyitott Szó", "csak a hivatkozási réteg"],
            ["Esti Krónika – Vidéki Napló", "csak a közös szereplő réteg"],
            ["Reggeli Hírlap – Nyitott Szó", "közös esemény és közös szereplő"],
            ["Reggeli Hírlap – Vidéki Napló", "mindhárom réteg"]
          ],
          hint: "Nézd meg rétegenként: van-e hivatkozás a két lap között (bármelyik irányban), írtak-e ugyanarról az eseményről, említenek-e közös szereplőt?",
          explain: R`EK–NY: a Nyitott Szó vasárnapi cikke hivatkozik az Esti Krónika csütörtöki cikkére, de közös eseményük és közös szereplőjük nincs. EK–VN: csak a Vízügy a közös szereplő. RH–NY: közös esemény (E6) és közös szereplő (Polgármester), de hivatkozás nincs. RH–VN: a Vidéki Napló hivatkozik a Reggeli Hírlapra, közös esemény az E3 és az E6, közös szereplő a Vízügy és a Polgármester. Összevont gráfban ezek a különbségek mind eltűnnének.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány éle van a három réteg összevont, irányítatlan lapgráfjának? (A rétegek élszáma: 4, 4 és 5.)",
          options: ["6", "13", "5", "4"],
          answer: 0,
          hint: "Az összevont gráfban egy lappár akkor szomszédos, ha legalább egy rétegben össze van kötve. Hány lappár van összesen?",
          explain: R`Mind a 6 lappár össze van kötve legalább egy rétegben, így az összevont gráf a $K_4$, 6 éllel. A 13 a rétegek élszámainak összege – de ugyanaz a pár több rétegben is szerepelhet, az összevont egyszerű gráfban ez egyetlen él. Az 5 és a 4 egy-egy réteg élszáma. Az összevont $K_4$-ből már semmi sem derül ki a lapok különbségeiről.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért nem érdemes a többrétegű gráf rétegeit mindig összevonni?",
          options: [
            "Mert a rétegek különböző folyamatokat írnak le, és összevonva elveszik, melyik él melyik rétegből jön.",
            "Mert összevonáskor élek vesznek el: csak a mindhárom rétegben meglévő párok maradnak.",
            "Mert az összevont gráf csúcsainak száma eltér a rétegekétől.",
            "Mert az összevont gráf sosem lehet összefüggő."
          ],
          answer: 0,
          hint: "Mit jelent egy hivatkozás, egy közös esemény és egy közös szereplő? Ugyanazt a viszonyt mérik?",
          explain: R`A hivatkozás információáramlás, a közös esemény a hírszelekció hasonlósága, a közös szereplő tartalmi hasonlóság. Az összevont „kapcsolat” mindhármat összemossa. Az összevonás a rétegek <b>egyesítése</b>: él nem vész el (sőt, itt mind a 6 pár összekötött lesz), a csúcsok is ugyanazok – csak a réteg információja tűnik el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány „említi” (cikk → szereplő) él van az Árvízhét heterogén gráfjában? (Kilenc cikk 2, három cikk 3 szereplőt említ.)`,
          options: ["27", "24", "36", "12"],
          answer: 0,
          hint: "Minden cikk annyi „említi” élt ad, ahány szereplőt említ. Add össze cikkenként!",
          explain: R`$9 \cdot 2 + 3 \cdot 3 = 18 + 9 = 27$. A 24 azt feltételezi, hogy minden cikk 2 szereplőt említ ($12 \cdot 2$), a 36, hogy mind 3-at ($12 \cdot 3$). A 12 a „közli” vagy a „hivatkozik” élek száma – az említés más éltípus. A heterogén gráfban az éltípusokat külön számoljuk.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik metaútvonal adja a közös szereplő alapján összekötött lapgráfot?",
          options: [
            "lap – cikk – szereplő – cikk – lap",
            "lap – cikk – esemény – cikk – lap",
            "szereplő – cikk – szereplő",
            "lap – cikk – cikk – lap"
          ],
          answer: 0,
          hint: "A metaútvonal két végén a vetület csúcstípusa áll, a közepén az, ami „összeköti” őket.",
          explain: R`Két lap között a lap – cikk – szereplő – cikk – lap utak száma a közös szereplőn át futó cikkpárok száma: ez a közös szereplős lapgráf. A lap – cikk – esemény – cikk – lap a közös eseményes réteg, a szereplő – cikk – szereplő az 1. fejezet szereplőgráfja (végein szereplő áll, nem lap), a lap – cikk – cikk – lap pedig a hivatkozási réteg.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cikk 4 szereplőt említ. A hipergráfban ez egyetlen hiperél. Hány élt ad a klikk-kibontásban (a szereplőgráfban)?",
          options: ["6", "4", "3", "12"],
          answer: 0,
          hint: "A klikk-kibontásban minden hiperélből teljes gráf lesz. Hány éle van a négycsúcsú teljes gráfnak?",
          explain: R`$\binom42 = 6$ él – a 4 szereplő minden párja. A 4 a csúcsok száma, a 3 egy szereplő szomszédainak száma, a 12 a rendezett párok száma ($4 \cdot 3$), de az együttes említés irányítatlan.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a hipergráfra? (Több jó válasz is lehet.)",
          options: [
            R`Az $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}\}$ egyetlen hiperél és a $\{\mathrm{Ko}, \mathrm{Vi}\}$, $\{\mathrm{Vi}, \mathrm{Po}\}$, $\{\mathrm{Ko}, \mathrm{Po}\}$ három hiperél klikk-kibontása ugyanaz.`,
            "A hipergráf egyenértékű a cikk–szereplő páros gráffal: a hiperél a cikk-csúcsnak felel meg.",
            "A klikk-kibontásból egyértelműen visszaállítható a hipergráf.",
            "A hipergráf ugyanaz, mint a klikk-kibontása, csak másképp rajzolva.",
            "Az Árvízhét hipergráfjában 12 hiperél van, és mind kételemű."
          ],
          answer: [0, 1],
          hint: "Gondolj a 2. cikkre: háromszereplős cikk vagy három kétszereplős – látszik-e a különbség a szereplőgráfban?",
          explain: R`Mindkét hipergráf klikk-kibontása a $K_3$ háromszög – ezért a kibontásból nem állítható vissza a hipergráf, és a kettő nem ugyanaz: a kibontás elveszíti, hogy a három szereplő egyetlen cikkben, együtt szerepelt. A hipergráf viszont pontosan annyit tud, mint a cikk–szereplő páros gráf (a hiperél = a cikk-csúcs). Az Árvízhét 12 hiperéléből kilenc kételemű és három háromelemű.`
        }
      ]
    },

    /* ------------------------------------------------ 3.7 */
    "gh3-37": {
      title: "Kvíz – 3.7 Tudásgráf: hármasok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hogyan írod fel hármasként: „A Vidéki Napló szerint a polgármester lakossági fórumot tartott a lakóknak.”?",
          options: [
            "(Polgármester, fórumot tart, Lakók) – forrás: a Vidéki Napló 11. cikke",
            "(Vidéki Napló, szerint, Polgármester) – forrás: a 11. cikk",
            "(Lakók, fórumot tart, Polgármester) – forrás: a Vidéki Napló 11. cikke",
            "(Polgármester, fórumot tart, Vidéki Napló) – forrás nélkül"
          ],
          answer: 0,
          hint: "Ki cselekszik, mit tesz, kivel? És hová kerül a „szerint”?",
          explain: R`Az alany a Polgármester, az állítmány a „fórumot tart”, a tárgy a Lakók. A „Vidéki Napló szerint” nem a hármas része, hanem a forrás: azt jegyezzük fel mellé, hogy melyik cikk állítja. Az alany és a tárgy felcserélése más állítást adna (a tudásgráf irányított), forrás nélkül pedig nem ellenőrizhető, ki állította.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány különböző csúcs (entitás) van az Árvízhét 12 hármasában?",
          options: ["10", "7", "12", "24"],
          answer: 0,
          hint: "Sorold fel az alanyokat és a tárgyakat, és minden nevet csak egyszer számolj! Vannak-e olyan csúcsok, amelyek nem szereplők?",
          explain: R`Kormány, Védekezők, Polgármester, Vízügy, Gát, Szakértő, Klímaváltozás, Árvíz, Önkéntesek, Lakók: 10 entitás. A 7 csak a szereplőket számolja – de a tudásgráfban új csúcsok is megjelennek (Gát, Árvíz, Védekezők). A 12 a hármasok (élek) száma, a 24 az alany- és tárgyhelyek száma, ismétlődéssel.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik entitásnak van a legtöbb bejövő éle a 12 hármasból álló tudásgráfban?",
          options: ["a Gátnak", "a Polgármesternek", "a Kormánynak", "a Lakóknak"],
          answer: 0,
          hint: "A bejövő él a tárgy oldalán van. Számold meg, ki hányszor áll tárgyként!",
          explain: R`A Gát háromszor tárgy: (Vízügy, kijelenti, hogy tart, Gát), (Vízügy, figyelmeztetett, Gát), (Polgármester, bejárja, Gát). A Kormánynak és a Lakóknak 2-2 bejövő éle van. A Polgármesternek a legtöbb <b>kimenő</b> éle van (4) – ez a befok és a kifok felcserélése; bejövő éle csak 1 (a Kormány segélyt küld neki).`
        },
        {
          type: "single", shuffle: true,
          q: "Hány kimenő éle van a Polgármesternek a tudásgráfban?",
          options: ["4", "1", "5", "3"],
          answer: 0,
          hint: "Keresd azokat a hármasokat, amelyekben a Polgármester az alany!",
          explain: R`Köszönetet mond (Kormány), bejárja (Gát), fórumot tart (Lakók), köszönti (Önkéntesek): 4 kimenő él. Az 1 a bejövő élek száma (Kormány → Polgármester: segélyt küld), az 5 a ki- és bejövő élek együtt. A 3 a Gát befoka.`
        },
        {
          type: "single", shuffle: true,
          q: "Nincs (Kormány, bírálja, Szakértő) hármas a tudásgráfban. Mit jelent ez?",
          options: [
            "Nem tudjuk: a tudásgráf nyílt világ, a hiányzó hármas lehet, hogy csak nincs az adatokban.",
            "Azt, hogy a kormány nem bírálta a szakértőt.",
            "Semmit, mert a (Szakértő, bírálja, Kormány) hármas miatt a fordított állítás is benne van.",
            "Azt, hogy a Kormány és a Szakértő között negatív él van."
          ],
          answer: 0,
          hint: "Ugyanez a kérdés felmerült az 1.2-ben a hiányzó élnél. Mit tudunk abból, hogy valami nem szerepel az adatokban?",
          explain: R`A tudásgráf „nyílt világ”: a hiányzó hármas nem hamis állítás, csak ismeretlen. A „nem bírálta” a zárt világ feltevése lenne. A fordított hármas nem következik: a tudásgráf irányított, „X bírálja Y-t” ≠ „Y bírálja X-et”. A negatív él pedig létező (bíráló) viszony, nem hiány.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a tudásgráfra? (Több jó válasz is lehet.)",
          options: [
            "Irányított, mert az alany és a tárgy szerepe különbözik.",
            "Multigráf: két csúcs között több, különböző címkéjű él is futhat.",
            "A tudásgráf egyben heterogén gráf is: a csúcsoknak típusa lehet.",
            "Egyszerű gráf: két entitás között legfeljebb egy él van.",
            "Irányítatlan, mert minden viszony kölcsönös."
          ],
          answer: [0, 1, 2],
          hint: "Nézd meg a Kormány és a Polgármester közötti hármasokat!",
          explain: R`A Kormány → Polgármester „segélyt küld” és a Polgármester → Kormány „köszönetet mond” két külön, címkés, irányított él ugyanazon a csúcspáron – ezért a tudásgráf irányított multigráf, nem egyszerű gráf. A csúcsoknak típusa lehet (személy, szervezet, hely, fogalom), ezért heterogén gráf is. A viszonyok nem kölcsönösek: a „bírálja” nem fordítható meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`A „Ki bírálja a Kormányt?” lekérdezés egyetlen találatot ad, pedig három cikk is kritikus. A hármasokban a „bírálja”, a „kritizálja” és a „támadja” állítmány szerepel. Mi a hiba?`,
          options: [
            "Ugyanaz a viszony több néven szerepel: az állítmányokat nem egységesítették.",
            "A tudásgráf irányítatlan, ezért a fordított irányú élek elvesztek.",
            "Egy csúcspár között csak egy él lehet, ezért a többi kiesett.",
            "A hiányzó hármasok hamis állítások, ezért a lekérdezés kihagyja őket."
          ],
          answer: 0,
          hint: "A lekérdezés pontosan egy állítmányt keres. Mi történik a többi névvel?",
          explain: R`Ha az állítmányokat nem egységesítjük, a „bírálja” keresés nem találja meg a „kritizálja” és a „támadja” éleket. A tudásgráf irányított multigráf (két csúcs között több él is lehet), a hiányzó hármas pedig nyílt világban csak ismeretlen – egyik sem magyarázza a hiányzó találatokat.`
        }
      ]
    },

    /* ------------------------------------------------ 3.8 */
    "gh3-38": {
      title: "Kvíz – 3.8 Alkalmazás: az Árvízhét adatmodellje",
      questions: [
        {
          type: "match",
          q: "Melyik kutatási kérdéshez melyik gráftípus illik? Párosítsd!",
          pairs: [
            ["Mely lapok választják ugyanazokat a híreket?", "páros gráf és vetülete"],
            ["Ki kire hivatkozik, ki a forrás?", "irányított gráf (DAG)"],
            ["Ki támogat, ki bírál kit?", "előjeles gráf"],
            ["Hogyan változik a tudósítás napról napra?", "időbeli gráf"],
            ["Hasonlítanak-e a lapok – többféle értelemben?", "többrétegű gráf"],
            ["Mit állítanak a cikkek, és ki mondja?", "tudásgráf"]
          ],
          hint: "Mi a kérdésben a lényeg: két csúcsfajta, irány, előjel, idő, többféle él, vagy a viszony fajtája?",
          explain: R`Hírszelekció: lap és esemény – két csúcsfajta, tehát páros gráf, és a lapokra vett (normalizált) vetület. Hivatkozás: iránya van, és időben visszafelé nem mutathat, ezért DAG. Támogatás/bírálat: előjel. Napról napra: időbélyeges élek. Többféle hasonlóság: rétegek. Ki mit állít: (alany, állítmány, tárgy) hármasok forrással – tudásgráf.`
        },
        {
          type: "match",
          q: "Mi a fő veszteség, ha egyszerűsítünk? Párosítsd!",
          pairs: [
            ["időbeli gráf helyett összevont gráf", "hamis utak jelennek meg"],
            ["irányított hivatkozási gráf helyett irányítatlan", "a forrás és a gyűjtő összemosódik"],
            ["előjeles gráf helyett együttes említés", "a vita eltűnik"],
            ["lap–esemény páros gráf helyett csak a lapvetület", "az egyedi témák eltűnnek"],
            ["tudásgráf helyett egyszerű gráf", "a viszony fajtája és a forrás elvész"]
          ],
          hint: "Mindegyik egyszerűsítés egy-egy információt dob el: időt, irányt, előjelet, a második csúcsfajtát, címkét.",
          explain: R`Az idő elhagyásával olyan utak is megjelennek, amelyek időben visszafelé haladnak. Irány nélkül nem derül ki, ki idézett kit. Az együttes említésben a bírálat és a támogatás egyformán „kapcsolat”. A lapvetületből kiesik, amiről csak egy lap írt (pl. az E5 beruházási vita). A címke és a forrás nélküli él már nem mondja meg, mit állított ki.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik gráfot érdemes tárolni, ha az Árvízhéten többféle kérdést akarunk vizsgálni?",
          options: [
            "A heterogén, időbélyeges gráfot: belőle minden egyszerűbb nézet származtatható, fordítva nem.",
            "A szereplők összevont, súlyozott gráfját: abból a többi gráf visszaállítható.",
            "A többrétegű lapgráfot, mert abban minden kapcsolat benne van.",
            "A lap–esemény páros gráfot, mert a hírszelekció a legfontosabb kérdés."
          ],
          answer: 0,
          hint: "Melyik gráfból lehet a többit előállítani – és melyikből nem lehet visszafelé?",
          explain: R`A heterogén, időbélyeges gráf (lap, cikk, szereplő, esemény; közli, említi, szól róla, hivatkozik, támogat/bírál; minden cikknek napja van) őrzi meg a legtöbb információt. Az összevont szereplőgráfból nem állítható vissza sem a cikk, sem a nap, sem a lap. A többrétegű lapgráfban nincsenek szereplők és napok, a páros gráfban nincsenek hivatkozások – ezek mind <b>nézetek</b>, a kérdéshez származtatjuk őket.`
        },
        {
          type: "single", shuffle: true,
          q: "A hivatkozási nézetben melyik lapra hivatkoznak a legtöbbször, és melyik hivatkozik a legtöbbször másokra (ebben a sorrendben)?",
          options: [
            "Reggeli Hírlap (befok 3) – Vidéki Napló (kifok 3)",
            "Vidéki Napló (befok 3) – Reggeli Hírlap (kifok 3)",
            "Nyitott Szó (befok 2) – Esti Krónika (kifok 2)",
            "Esti Krónika (befok 2) – Nyitott Szó (kifok 2)"
          ],
          answer: 0,
          hint: "A rá hivatkozások száma a befok, a saját hivatkozásai a kifok. Melyik lapra senki nem hivatkozik?",
          explain: R`A Reggeli Hírlapra az Esti Krónika kétszer, a Vidéki Napló egyszer hivatkozik: befok 3 – ő a hírforrás szerepű lap. A Vidéki Napló egyszer a Reggeli Hírlapra, kétszer a Nyitott Szóra hivatkozik: kifok 3 – ő a gyűjtő; rá senki sem hivatkozik (befok 0). A második opció a befokot és a kifokot cseréli fel. A Nyitott Szó befoka 2, az Esti Krónika kifoka 2 – de nem ezek a legnagyobbak.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit mutat az időbeli nézet a klímavita „terjedéséről”?",
          options: [
            "Csak vasárnapra, kerülővel érhet el a Lakókig, a Vízügyhöz egyáltalán nem.",
            "Már csütörtökön, 3 lépésben eléri a Lakókat a Kormányon és a Polgármesteren át.",
            "Mindenkit elér, a Vízügyet is, mert a heti gráf összefüggő.",
            "A Lakókhoz nem jut el, a Vízügyhöz viszont szerdán eljut."
          ],
          answer: 0,
          hint: "A klímavita csütörtökön kezdődik. Mely élek vannak csütörtök után?",
          explain: R`Időben érvényes út: $\mathrm{Kl} \xrightarrow{\text{Cs}} \mathrm{Ko} \xrightarrow{\text{P}} \mathrm{Po} \xrightarrow{\text{Szo}} \text{Ön} \xrightarrow{\text{V}} \mathrm{La}$ – 4 lépés, vasárnapra. A 3 lépéses $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Po}, \mathrm{La}$ csak az összevont gráfban létezik (a $\mathrm{Po}$–$\mathrm{La}$ élek csütörtök után már nincsenek). A Vízügy élei mind a klímavita előtt voltak, ezért oda nincs időben érvényes út – az összevont gráf összefüggősége ezt elfedi.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit mutat az előjeles nézet az Árvízhéten?",
          options: [
            "1 negatív él, 1 kiegyensúlyozatlan háromszög",
            "1 negatív él, 0 kiegyensúlyozatlan háromszög",
            "1 negatív él, 3 kiegyensúlyozatlan háromszög",
            "2 negatív él, 2 kiegyensúlyozatlan háromszög"
          ],
          answer: 0,
          hint: "Hány háromszög van az előjeles gráfban, és melyikben van negatív él? Szorozd össze az előjeleket!",
          explain: R`Egyetlen negatív él van: a Szakértő bírálja a Kormányt. Az előjeles gráfban 3 háromszög van: $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ ($++-$), $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Po}$ ($+++$) és $\mathrm{Po}$–$\mathrm{La}$–$\text{Ön}$ ($+++$). Csak a $++-$ kiegyensúlyozatlan (az előjelek szorzata negatív) – ez a „feszült háromszög”. Aki a $++-$-t kiegyensúlyozottnak hiszi, 0-t mond; aki minden háromszöget számol, 3-at.`
        },
        {
          type: "single", shuffle: true,
          q: "A hírszelekciót csak a nyers lapvetületen ($BB^\\top$ nem átlós elemein) vizsgáljuk. Mi tűnik el?",
          options: [
            "Az E5 beruházási vita, amelyről csak az Esti Krónika írt.",
            "Az E6, mert mindhárom lap írt róla.",
            "A Reggeli Hírlap – Esti Krónika él, mert csak egy közös eseményük van.",
            "Semmi, mert a vetületből a páros gráf visszaállítható."
          ],
          answer: 0,
          hint: "Melyik eseményből nem lesz egyetlen lappár sem?",
          explain: R`Amiről csak egy lap írt (E4, E5), abból nem lesz él a lapvetületben – az Esti Krónika saját témája, a beruházási vita nyomtalanul kiesik. Az E6 egy háromszöget ad a vetületben, nem tűnik el (csak az nem látszik, hogy egyetlen eseményből jön). Az RH–EK él megvan, 1-es súllyal. A vetületből a páros gráf nem állítható vissza.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh3-final": {
      title: "Fejezetzáró teszt – 3. Gráftípusok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A lapok súlyozott hivatkozási mátrixában a sor a hivatkozó, az oszlop a hivatkozott lap. Mennyi a Reggeli Hírlap oszlopának összege, és mit jelent?",
          options: [
            "3 – a Reggeli Hírlap (súlyozott) befoka",
            "3 – a Reggeli Hírlap (súlyozott) kifoka",
            "0 – a Reggeli Hírlap (súlyozott) befoka",
            "6 – az összes lapközi hivatkozás"
          ],
          answer: 0,
          hint: "Az oszlopban azok állnak, akik a Reggeli Hírlapra mutatnak. Ez befok vagy kifok?",
          explain: R`Az RH oszlopában az EK sorában 2, a VN sorában 1 áll: összesen 3. Az oszlopösszeg a <b>befok</b> (hányszor hivatkoznak rá), a sorösszeg a kifok – az RH sora csupa 0, mert ő senkire nem hivatkozik. A 6 az összes elem összege ($m$), nem egy oszlopé.`
        },
        {
          type: "single", shuffle: true,
          q: "Legfeljebb hány éle lehet egy 5 csúcsú, hurok nélküli irányított gráfnak?",
          options: ["20", "10", "25", "16"],
          answer: 0,
          hint: R`Irányított gráfban az $u \to v$ és a $v \to u$ két különböző él. Hány rendezett pár van?`,
          explain: R`$n(n - 1) = 5 \cdot 4 = 20$: minden rendezett pár lehet él. A 10 az irányítatlan maximum, $\binom52$ – az irányt elfelejtve. A 25 ($n^2$) a hurkokat is megengedné, a 16 ($(n-1)^2$) számolási hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyek az erős komponensek az alábbi irányított gráfban? Élek: $A \to B$, $B \to C$, $C \to A$, $C \to D$, $D \to E$, $E \to D$.`,
          options: [
            R`$\{A, B, C\}$ és $\{D, E\}$`,
            R`$\{A, B, C, D, E\}$ – a gráf egyben van`,
            R`$\{A, B, C\}$, $\{D\}$ és $\{E\}$`,
            R`$\{A, B\}$, $\{C\}$ és $\{D, E\}$`
          ],
          answer: 0,
          hint: "Az erős komponens a kölcsönösen elérhető csúcsok csoportja. Hol vannak irányított körök?",
          explain: R`Az $A \to B \to C \to A$ kör miatt $A, B, C$ kölcsönösen elérhetők; a $D \to E \to D$ (két ellentétes él) miatt $D$ és $E$ is. A $C \to D$ élen át $D$-be eljutunk, de vissza nem, ezért ez két külön komponens. A gráf gyengén összefüggő, de ebből nem következik, hogy mindenki elér mindenkit. A kétirányú $D \leftrightarrow E$ pár egy komponens, nem kettő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három cikk: $\{A, B, C\}$, $\{A, B\}$ és $\{A, B, C, D\}$. Mennyi az $A$–$B$ él Newman-súlya?`,
          options: [R`$\frac{11}{6}$`, R`$3$`, R`$\frac{13}{12}$`, R`$\frac32$`],
          answer: 0,
          hint: R`Egy $k$ szereplős cikk minden párjának $\frac{1}{k-1}$-et ad. Mennyi ez $k = 3$, $2$ és $4$ esetén?`,
          explain: R`$\frac12 + 1 + \frac13 = \frac{11}{6} \approx 1{,}83$. A 3 a nyers súly (közös cikkek száma). A $\frac{13}{12}$ a hibás $\frac1k$ súlyból jön ($\frac13 + \frac12 + \frac14$), a $\frac32$ pedig az $\frac{1}{\binom k2}$ súlyból ($\frac13 + 1 + \frac16$). A Newman-súly $\frac{1}{k-1}$, mert így minden cikk minden szereplőjéhez pontosan 1-et ad.`
        },
        {
          type: "single", shuffle: true,
          q: "Kinek a legnagyobb az erőssége az Árvízhét szereplőgráfjában, és mennyi nyersen, illetve Newman-súlyokkal?",
          options: [
            "Polgármester: nyers 8, Newman 6",
            "Polgármester: nyers 6, Newman 8",
            "Kormány: nyers 6, Newman 4",
            "Polgármester: nyers 8, Newman 8"
          ],
          answer: 0,
          hint: "A Newman-erősség egyszerűen annyi, ahány (legalább kétszereplős) cikkben a szereplő szerepel. A nyers erősség a háromszereplős cikkekben kétszer számol.",
          explain: R`A Polgármester nyers erőssége $2 + 2 + 2 + 2 = 8$; Newman-erőssége 6, mert pontosan 6 cikkben szerepel. A nyers nagyobb, mert két háromszereplős cikkben (2., 8.) is benne van, és ezek két-két párt adnak neki. A Kormány nyers erőssége 6, Newman-erőssége 4. A Newman-súlyozás nem hagyja változatlanul az erősséget: a sokszereplős cikkek hatását csökkenti.`
        },
        {
          type: "set",
          q: "Melyik háromszög kiegyensúlyozott? Jelöld meg mindet!",
          items: [R`$+++$`, R`$++-$`, R`$+--$`, R`$---$`],
          answer: [R`$+++$`, R`$+--$`],
          hint: "Szorozd össze a három előjelet!",
          explain: R`A háromszög kiegyensúlyozott, ha az előjelek szorzata pozitív: $+++$ („mindenki barátja mindenkinek”) és $+--$ („az ellenségem ellensége a barátom”). A $++-$ (az Árvízhét $\mathrm{Ko}$–$\mathrm{Vi}$–$\mathrm{Sz}$ háromszöge) és a $---$ kiegyensúlyozatlan. Részletek: 6. fejezet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a Reggeli Hírlap és a Nyitott Szó Jaccard-hasonlósága? (RH: E1, E3, E6; NY: E2, E4, E6.)`,
          options: [R`$\frac15$`, R`$\frac13$`, R`$\frac16$`, R`$\frac12$`],
          answer: 0,
          hint: "Jaccard: a közös események száma osztva a két lap együttes (uniós) eseményeinek számával.",
          explain: R`Közös: E6 (1 db). Unió: E1, E2, E3, E4, E6 (5 db). $J = \frac15 = 0{,}2$. Az $\frac13$ a közös / kisebbik halmaz mérete, az $\frac16$ a közös / az összes esemény száma – egyik sem Jaccard. Az $\frac12$ a Newman-súly (az E6-ról 3 lap írt: $\frac{1}{3-1}$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Páros-e a gráf? Élek: $AB$, $BC$, $CD$, $DE$, $EF$, $FA$, $AD$.`,
          options: [
            R`Igen: nincs benne páratlan kör; az osztályok $\{A, C, E\}$ és $\{B, D, F\}$.`,
            "Nem, mert van benne kör.",
            R`Nem: az $AD$ húr páratlan kört ad.`,
            "Igen, mert a csúcsok száma páros."
          ],
          answer: 0,
          hint: R`Kőnig tétele: páros pontosan akkor, ha nincs páratlan kör. Milyen hosszú köröket ad az $AD$ húr?`,
          explain: R`A hatszög ($A \dots F$) páros hosszú kör. Az $AD$ húr két 4 hosszú kört ad: $A, B, C, D$ és $A, D, E, F$. Páratlan kör nincs, tehát a gráf páros; a színezés $\{A, C, E\}$, $\{B, D, F\}$, és az $AD$ is a két osztály között fut. A páros gráfban lehet kör, csak páratlan nem. A csúcsok száma nem számít.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik mátrix adja az eseményvetületet, és mennyi benne az E2–E6 elem?",
          options: [
            R`$B^\top B$, és az elem $2$`,
            R`$BB^\top$, és az elem $2$`,
            R`$B^\top B$, és az elem $1$`,
            R`$BB^\top$, és az elem $3$`
          ],
          answer: 0,
          hint: R`$B$ sorai a lapok, oszlopai az események. Melyik szorzat lesz $6 \times 6$-os?`,
          explain: R`$B$ $4 \times 6$-os, így $B^\top B$ a $6 \times 6$-os eseményvetület, $BB^\top$ a $4 \times 4$-es lapvetület. Az E2-ről NY és VN, az E6-ról RH, NY és VN írt; közös: NY és VN, tehát az elem 2. A 3 az E6 átlós eleme (hány lap írt róla).`
        },
        {
          type: "single", shuffle: true,
          q: R`Időbeli gráf: $(A, B, 2)$, $(B, C, 3)$, $(C, D, 4)$, $(B, D, 1)$. Hány lépés az $A$-ból $D$-be vezető legrövidebb út időben érvényesen, illetve az összevont gráfban?`,
          options: [
            "időben 3, összevontan 2",
            "időben 2, összevontan 2",
            "időben 2, összevontan 3",
            "időben nincs út, összevontan 2"
          ],
          answer: 0,
          hint: R`Az összevont gráfban az $A, B, D$ a rövidebb. Járható ez az időbélyegek sorrendjében?`,
          explain: R`Az összevont gráfban $A, B, D$: 2 lépés. Időben ez nem érvényes: az $A$–$B$ él a 2. időpontban van, a $B$–$D$ az 1.-ben, vagyis visszalépne. Az $A \xrightarrow{2} B \xrightarrow{3} C \xrightarrow{4} D$ viszont érvényes: 3 lépés. Az időben érvényes távolság soha nem kisebb az összevontnál, de lehet nagyobb.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az összevonás (aggregálás) veszteségeiről? (Több jó válasz is lehet.)",
          options: [
            "Az időbeli gráf összevont gráfjában lehetnek olyan utak, amelyek időben soha nem léteztek.",
            "A rétegek összevonása után nem derül ki, melyik él melyik rétegből jön.",
            "A szereplőgráfból (a klikk-kibontásból) visszaállítható, mely szereplők szerepeltek együtt egy cikkben.",
            "Az egy lap által lefedett esemény (pl. E5) is megjelenik a lapvetület valamelyik élén.",
            "Irányítatlan éleknél az időbeli elérhetőség szimmetrikus, ezért ott az összevonás nem veszít semmit."
          ],
          answer: [0, 1],
          hint: "Minden összevonás eldob valamit: időt, réteget, a hiperél egységét, a második csúcsfajtát. Melyik állítás tagadja ezt?",
          explain: R`Az időt elhagyva megjelennek a „hamis utak” (pl. $\mathrm{Kl}, \mathrm{Ko}, \mathrm{Vi}$), a rétegek egyesítésekor elveszik az éltípus. A klikk-kibontásban egy háromszereplős cikk és három kétszereplős cikk ugyanazt a háromszöget adja, így nem állítható vissza. Az egy lap által lefedett esemény nem ad lappárt, tehát a lapvetületből eltűnik. Az időbeli elérhetőség irányítatlan élekkel sem szimmetrikus (a Vízügyből elérhető a Klímaváltozás, fordítva nem).`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét hipergráfjának 12 hiperéle (9 kételemű, 3 háromelemű) a klikk-kibontásban hány szereplőpárt ad összesen (ismétlődéssel), és hány különböző élt?",
          options: [
            "18 pár, 10 különböző él",
            "12 pár, 10 különböző él",
            "21 pár, 10 különböző él",
            "18 pár, 18 különböző él"
          ],
          answer: 0,
          hint: R`Egy $k$ elemű hiperél $\binom k2$ párt ad. Utána gondold meg: ugyanaz a pár több cikkben is előfordulhat.`,
          explain: R`$9 \cdot 1 + 3 \cdot 3 = 18$ pár – ez éppen a szereplőgráf nyers súlyainak összege. Különböző él viszont csak 10 van, mert több pár ismétlődik (pl. $\mathrm{La}$–$\text{Ön}$ háromszor). A 12 azt hiszi, hogy minden hiperélből egy él lesz, a 21 a háromelemű hiperéleket 4 párral számolja, a 18 különböző él pedig elfelejti az ismétlődést.`
        },
        {
          type: "single", shuffle: true,
          q: "A tudásgráf 12 hármasában mennyi a Gát befoka és a Polgármester kifoka (ebben a sorrendben)?",
          options: ["3 és 4", "4 és 3", "3 és 1", "0 és 4"],
          answer: 0,
          hint: "A befok azt számolja, hányszor áll az entitás tárgyként, a kifok azt, hányszor alanyként.",
          explain: R`A Gát háromszor tárgy (kijelenti, hogy tart; figyelmeztetett; bejárja): befok 3. A Polgármester négyszer alany (köszönetet mond, bejárja, fórumot tart, köszönti): kifok 4. A „4 és 3” felcseréli a kettőt, a „3 és 1” a Polgármester befokát adja, a „0 és 4” a Gát kifokát (a Gát sosem alany).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kutató azt kérdezi: mely lapok hasonlítanak egymásra a hírszelekcióban? Egyes lapok sokkal több eseményről írnak, mint mások. Melyik gráfot és mértéket válassza?",
          options: [
            "A lap–esemény páros gráfot és annak normalizált (Jaccard- vagy Newman-) lapvetületét.",
            R`A nyers lapvetületet ($BB^\top$), mert a közös események száma pontosan a hasonlóság.`,
            "A lapok irányított hivatkozási gráfját, mert a hivatkozás mutatja a hasonlóságot.",
            R`Az eseményvetületet ($B^\top B$), mert az eseményekről szól a kérdés.`
          ],
          answer: 0,
          hint: "A kérdés lapok és események kapcsolatáról szól. Mi a gond a nyers darabszámmal, ha a lapok mérete eltér?",
          explain: R`A hírszelekció a lap–esemény páros gráf kérdése, a lapok hasonlóságához a lapokra vett vetület kell. A nyers közös-szomszédszám a „sokat író” lapoknak és a mindenki által lefedett eseményeknek kedvez – ezért normalizálunk (Jaccard vagy Newman). A hivatkozás információáramlás, nem hírszelekció. A $B^\top B$ az eseményeket köti össze, nem a lapokat.`
        }
      ]
    },
