/* =========================================================
   Gráfelmélet és hálózattudomány 3. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 3.1 */
    "gh3-31": {
      title: "Kvíz – 3.1 Irányított gráfok",
      questions: [
        {
          type: "match",
          q: "Párosítsd a fogalmat a jelentésével!",
          pairs: [
            [R`kifok $d^+(v)$`, "a v-ből induló élek száma"],
            [R`befok $d^-(v)$`, "a v-be érkező élek száma"],
            ["forrás", "befoka 0"],
            ["nyelő", "kifoka 0"],
            ["erős komponens", "kölcsönösen elérhető csúcsok legnagyobb csoportja"]
          ],
          hint: "A „ki” az induló, a „be” az érkező élre utal. A forrásba semmi sem érkezik.",
          explain: R`A kifok $d^+(v)$ a $v$-ből <b>induló</b>, a befok $d^-(v)$ a $v$-be <b>érkező</b> élek száma – ezeket könnyű felcserélni. A forrásba nem érkezik él (befok 0), a nyelőből nem indul (kifok 0). A lapgráfban a Vidéki Napló forrás, a Reggeli Hírlap nyelő. Az erős komponens azoknak a csúcsoknak a legnagyobb csoportja, amelyek között mindkét irányban van irányított út.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy irányított gráf élei: $P \to Q$, $P \to R$, $Q \to R$, $R \to S$, $S \to Q$. Mennyi az $R$ csúcs kifoka és befoka?`,
          options: [
            R`$d^+(R) = 1,\ d^-(R) = 2$`,
            R`$d^+(R) = 2,\ d^-(R) = 1$`,
            R`$d^+(R) = 1,\ d^-(R) = 1$`,
            R`$d^+(R) = 3,\ d^-(R) = 3$`
          ],
          answer: 0,
          hint: "Nézd meg minden élnél, hol van az R: a nyíl elején vagy a végén?",
          explain: R`Az $R$-ből egy él indul ($R \to S$): $d^+(R) = 1$. Az $R$-be kettő érkezik ($P \to R$, $Q \to R$): $d^-(R) = 2$. A „2 és 1” a ki- és befok felcserélése; a „3 és 3” az irányítatlan fokszám (3), kétszer. Ellenőrzés: a kifokok összege $2 + 1 + 1 + 1 = 5 = m$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az irányított szomszédsági mátrixban ($A_{ij} = 1$, ha $i \to j$) egy csúcs <b>sorában</b> csupa 0 áll, az <b>oszlopában</b> két 1-es. Mit tudunk erről a csúcsról?`,
          options: [
            "Nyelő: kifoka 0, befoka 2 – rá mutat két él, belőle nem indul egy sem.",
            "Forrás: befoka 0, kifoka 2 – belőle két él indul, bele nem érkezik egy sem.",
            "Izolált csúcs: a csupa 0-s sor miatt nincs éle.",
            "Fokszáma 1: a 0-k és az 1-esek kiegyenlítik egymást."
          ],
          answer: 0,
          hint: "A sor a kiinduló, az oszlop az érkező csúcs. Melyik összeg melyik fok?",
          explain: R`A sorösszeg a <b>kifok</b> (a sor az él kiinduló csúcsa), az oszlopösszeg a <b>befok</b>. Csupa 0-s sor: nem indul belőle él, $d^+ = 0$; két 1-es az oszlopban: $d^- = 2$. Ez nyelő – ilyen a lapgráfban a Reggeli Hírlap (rá két lap hivatkozik). A „forrás” válasz a sor és az oszlop felcserélése. Izolált sem lehet: az oszlopában él van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legfeljebb hány éle lehet egy 6 csúcsú, hurok nélküli, egyszerű irányított gráfnak?`,
          options: ["30", "15", "36", "25"],
          answer: 0,
          hint: R`Számít-e, hogy $u \to v$ vagy $v \to u$? Szabad-e $u = v$?`,
          explain: R`Minden <b>rendezett</b> pár lehet él, hurok nélkül: $n(n - 1) = 6 \cdot 5 = 30$. A 15 $= \binom62$ az irányítatlan gráf maximuma – irányítva az $u \to v$ és a $v \to u$ két különböző él, ezért ennek kétszerese. A $36 = 6^2$ a hurkokat is beszámolja, a $25 = 5^2$ pedig rossz szorzás.`
        },
        {
          type: "multi",
          q: R`A lapok hivatkozási gráfja: $EK \to RH$, $NY \to EK$, $VN \to RH$, $VN \to NY$. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            "Gyengén összefüggő.",
            "A Vidéki Naplóból irányított úton mindegyik másik lap elérhető.",
            R`Egyetlen új él ($RH \to VN$) hozzáadásával erősen összefüggővé válik.`,
            "Erősen összefüggő, hiszen a rajzon egyben van.",
            "A Reggeli Hírlapból irányított úton elérhető a Vidéki Napló."
          ],
          answer: [0, 1, 2],
          hint: "Irányított úton csak a nyilak irányában léphetsz. Van-e a Reggeli Hírlapnak kifelé mutató éle?",
          explain: R`Irány nélkül a gráf egyben van: gyengén összefüggő. A $VN \to NY \to EK \to RH$ út mindenkit elér a Vidéki Naplóból. A Reggeli Hírlapnak viszont nincs kimenő éle, ezért belőle senki sem érhető el – így a gráf <b>nem</b> erősen összefüggő (minden erős komponens egycsúcsú). „Egyben van, tehát mindenki elér mindenkit” – ez csak az erős összefüggésre igaz. Az $RH \to VN$ éllel kör jön létre: $RH \to VN \to NY \to EK \to RH$, és ez mind a négy lapot tartalmazza.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $1 \to 2$, $2 \to 3$, $3 \to 1$, $3 \to 4$, $4 \to 5$, $5 \to 4$. Melyek az erős komponensek?`,
          options: [
            R`$\{1, 2, 3\}$ és $\{4, 5\}$`,
            R`$\{1, 2, 3, 4, 5\}$`,
            R`$\{1, 2, 3\}$, $\{4\}$ és $\{5\}$`,
            R`$\{1\}$, $\{2\}$, $\{3\}$, $\{4\}$ és $\{5\}$`
          ],
          answer: 0,
          hint: "Keress irányított köröket! Egy erős komponensen belül oda-vissza el kell tudni jutni.",
          explain: R`Az $1 \to 2 \to 3 \to 1$ kör egy erős komponenst ad, a $4 \to 5 \to 4$ (kétirányú él) egy másikat. A $3 \to 4$ él csak egy irányban köti össze őket: a 3-ból eljutunk a 4-be, vissza nem. Ezért az $\{1, \dots, 5\}$ csak <b>gyenge</b> komponens. A $\{4\}$, $\{5\}$ szétválasztás elfelejti, hogy a $4 \to 5$ és az $5 \to 4$ együtt kört alkot; az öt egycsúcsú komponens DAG-ra lenne igaz, de itt van kör.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a DAG-okra (irányított kör nélküli gráfokra)? (Több jó válasz is lehet.)",
          options: [
            "Minden erős komponensük egyetlen csúcs.",
            "Mindig van befok 0-s és kifok 0-s csúcsuk.",
            "A 12 cikk hivatkozási gráfja azért DAG, mert egy cikk csak korábbi (vagy aznapi) cikkre hivatkozhat.",
            "Ha az irányokat elhagyjuk, sem lehet bennük kör.",
            "Egy DAG-ban bármelyik csúcsból bármelyikbe vezet irányított út."
          ],
          answer: [0, 1, 2],
          hint: "Két csúcs akkor van egy erős komponensben, ha kör köti össze őket. A DAG-ban csak az irányított kör tilos.",
          explain: R`Kör nélkül nem lehet oda-vissza eljutni, ezért minden erős komponens egycsúcsú. A nyilak mentén haladva sosem ismétlődik csúcs, így elakadunk – ott a kifok 0; visszafelé haladva befok 0-s csúcsot találunk. A hivatkozás időben visszafelé mutat, ezért kör nem lehet benne. <b>Irányítatlan</b> kör viszont lehet: a cikkeknél pl. $9 - 8 - 7 - 11 - 10 - 1 - 4 - 5 - 9$. A DAG ráadásul sosem erősen összefüggő (ha legalább 2 csúcsa van), tehát nem érhet el mindenki mindenkit.`
        }
      ]
    },

    /* ------------------------------------------------ 3.2 */
    "gh3-32": {
      title: "Kvíz – 3.2 Súlyozott gráfok és a normalizálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Súlyozott élek: $AB$ 3, $AC$ 1, $BC$ 2, $CD$ 4. Mennyi a $C$ csúcs erőssége, $s(C)$?`,
          options: ["7", "3", "4", "10"],
          answer: 0,
          hint: "Az erősség nem az élek száma: a C-re illeszkedő élek súlyát kell összeadnod.",
          explain: R`$s(C) = w_{AC} + w_{BC} + w_{CD} = 1 + 2 + 4 = 7$. A 3 a fokszám (hány éle van), a 4 csak a legnagyobb súly, a 10 pedig az összes él súlyának összege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az A lap 40 cikkéből 8 említi a Szakértőt, a B lap 12 cikkéből 4. Melyik lap foglalkozott vele arányosan többet?`,
          options: [
            "B: kb. 33%, szemben az A 20%-ával",
            "A: 8 cikk, szemben a B 4 cikkével",
            "A: 20%, szemben a B 10%-ával",
            "Egyformán: mindkettő a cikkei kisebb részében említi"
          ],
          answer: 0,
          hint: "A darabszám a lap méretét is méri. Oszd el a lap cikkszámával!",
          explain: R`Normalizálás a forrás mérete szerint: A $8/40 = 20\%$, B $4/12 \approx 33\%$. Darabra az A írt többet, de az csak azt mutatja, hogy nagyobb lap. A „10%” a $4/40$ – rossz nevezővel osztott. Nyers darabszámot különböző méretű forrásoknál nem érdemes összevetni.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cikk 4 szereplőt említ. Mekkora Newman-súlyt kap egy szereplőpárja?",
          options: [R`$\frac13$`, R`$\frac14$`, R`$\frac16$`, R`$6$`],
          answer: 0,
          hint: R`Newman-súlyozásnál egy $k$ szereplős cikk minden párja ugyanannyit kap, úgy, hogy egy szereplő összesen 1-et kapjon.`,
          explain: R`A Newman-súly $\frac{1}{k - 1} = \frac13$. Egy szereplőnek 3 párja van, $3 \cdot \frac13 = 1$ – minden cikk minden szereplőjéhez pontosan 1-et ad. Az $\frac14 = \frac1k$ tipikus elírás (ekkor egy szereplő csak $\frac34$-et kapna). Az $\frac16 = 1/\binom42$ a cikk összes súlyát osztaná 1-re, a 6 $= \binom42$ pedig a párok száma, nem súly.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három cikk: $\{A, B\}$, $\{A, B, C\}$, $\{A, B, C, D\}$. Mennyi az $AB$ él Newman-súlya (két tizedesre)?`,
          options: ["1,83", "3", "1,08", "1,5"],
          answer: 0,
          hint: R`Cikkenként add össze a $\frac{1}{k - 1}$-eket, ahol $k$ az adott cikk szereplőinek száma.`,
          explain: R`$\frac{1}{1} + \frac{1}{2} + \frac{1}{3} = \frac{11}{6} \approx 1{,}83$. A 3 a nyers súly (három közös cikk). Az $1{,}08 = \frac12 + \frac13 + \frac14$ az $\frac1k$-val számol. Az $1{,}5 = 1 + \frac13 + \frac16$ a $1/\binom k2$ súlyt használja – ez túlbünteti a sokszereplős cikkeket.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Vízügyet az 1. $\{\mathrm{Ko}, \mathrm{Vi}\}$, a 2. $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}\}$, a 4. $\{\mathrm{Vi}, \mathrm{Sz}\}$ és a 10. $\{\mathrm{Po}, \mathrm{Vi}\}$ cikk említi. Mennyi a Vízügy <b>Newman</b>-erőssége?`,
          options: ["4", "5", "3", "2,17"],
          answer: 0,
          hint: "Newman-súlyozásnál egy cikk mennyit ad összesen egy szereplőjének?",
          explain: R`Minden (legalább kétszereplős) cikk pontosan 1-et ad a szereplőinek, ezért a Newman-erősség = a cikkek száma: 4. Részletesen: $1 + 2 \cdot \frac12 + 1 + 1 = 4$. Az 5 a <b>nyers</b> erősség ($\mathrm{Ko}$ 2 + $\mathrm{Po}$ 2 + $\mathrm{Sz}$ 1) – a 2. cikk ott két párt is ad. A 3 a fokszám (három szomszéd), a $2{,}17$ az $\frac1k$-s súlyokból jön.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Newman-súlyozásra? (Több jó válasz is lehet.)",
          options: [
            "Minden cikk minden szereplőjéhez összesen pontosan 1-et ad.",
            "A Polgármester nyers erőssége (8) azért nagyobb a Newman-erősségénél (6), mert két háromszereplős cikkben is szerepel.",
            "Célja, hogy a sokszereplős cikkek ne kapjanak aránytalanul nagy súlyt.",
            R`Egy $k$ szereplős cikk minden párja $\frac1k$ súlyt kap.`,
            "Bármelyik normalizálást választod, a szereplők rangsora ugyanaz marad."
          ],
          answer: [0, 1, 2],
          hint: R`Egy $k$ szereplős cikk $\binom k2$ párt ad. Mi lesz a nyers és mi a Newman-súllyal egy szereplőnek jutó összeg?`,
          explain: R`A pár súlya $\frac{1}{k - 1}$ (nem $\frac1k$), így egy szereplő $k - 1$ párja összesen 1-et kap. Ezért a Newman-erősség a szereplőt említő cikkek száma: a Polgármesteré 6. A nyers erősségben a háromszereplős cikkek (2., 8.) két-két párt adnak, ezért 8. A normalizálás döntés: más-más normalizálás más rangsort adhat – írd le, melyiket használtad.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy úthálózatban az él súlya a két település távolsága km-ben. Mit jelent itt a nagyobb súly?",
          options: [
            "Távolabbi, „gyengébb” kapcsolatot – ezért az elemzés előtt mindig rögzíteni kell a súly jelentését.",
            "Szorosabb kapcsolatot, mert a nagyobb súly mindig erősebb kapcsolatot jelent.",
            "Semmit: a súlyt elemzés előtt mindig 0 és 1 közé kell normálni, és utána mindegy.",
            "Azt, hogy hány cikkben szerepel együtt a két település."
          ],
          answer: 0,
          hint: "A súly jelentése az élszabályból jön. Mit mér itt a szám?",
          explain: R`A km-ben mért súly hossz: a nagyobb súly <b>messzebbi</b> kapcsolatot jelent (a legrövidebb út ezt minimalizálja, 2.4). Együttes említésnél viszont a nagyobb súly szorosabb kapcsolat. Ezért mindig írd le a súly egységét és irányát – különben a legrövidebb utat és a centralitást sem tudod értelmezni. A normálás nem oldja meg ezt a kérdést, és a „közös cikk” egy másik élszabály.`
        }
      ]
    },

    /* ------------------------------------------------ 3.3 */
    "gh3-33": {
      title: "Kvíz – 3.3 Előjeles gráfok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Hány pozitív és hány negatív éle van az Árvízhét előjeles gráfjának?",
          options: [
            "7 pozitív, 1 negatív",
            "8 pozitív, 0 negatív",
            "6 pozitív, 2 negatív",
            "10 pozitív, 1 negatív"
          ],
          answer: 0,
          hint: "Az előjeles gráf a cikkekből kiolvasott viszonyokat tartalmazza, nem az együttes említéseket. Ki bírál kit?",
          explain: R`Nyolc viszonyt olvasunk ki: 7 támogató (pl. $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Po}$–$\mathrm{Ko}$, $\mathrm{La}$–$\text{Ön}$) és 1 bíráló: a Szakértő bírálja a Kormányt (5. cikk). A „10” az együttes említés gráfjának élszáma – az nem mond semmit arról, ki ért egyet kivel (a Klímaváltozással pl. nincs előjeles viszony).`
        },
        {
          type: "single", shuffle: true,
          q: R`A Kormány – Vízügy – Szakértő háromszögben $\mathrm{Ko}$–$\mathrm{Vi}$ +, $\mathrm{Sz}$–$\mathrm{Vi}$ +, $\mathrm{Sz}$–$\mathrm{Ko}$ −. Milyen ez a háromszög?`,
          options: [
            "Kiegyensúlyozatlan: az előjelek szorzata negatív („a barátom barátja az ellenségem”).",
            "Kiegyensúlyozott, mert a pozitív élek vannak többségben.",
            "Kiegyensúlyozott, mert az előjelek összege pozitív (+1).",
            "Nem is háromszög, mert a negatív él hiányzó élnek számít."
          ],
          answer: 0,
          hint: "Szorozd össze a három előjelet!",
          explain: R`$(+1)(+1)(-1) = -1$: a $++-$ háromszög kiegyensúlyozatlan. A szakértő egyetért a vízüggyel, a vízügy a kormánnyal, de a szakértő bírálja a kormányt – ez „feszült” helyzet (részletek: 6. fejezet). Nem a többség vagy az összeg számít, hanem a szorzat. A negatív él pedig létező kapcsolat (bírálat), nem hiányzó él.`
        },
        {
          type: "set",
          q: "Jelöld ki a kiegyensúlyozott háromszögeket!",
          items: ["+ + +", "+ + −", "+ − −", "− − −"],
          answer: ["+ + +", "+ − −"],
          hint: "A kiegyensúlyozottság az előjelek szorzatán múlik.",
          explain: R`Szorzat $+$: a $+++$ („mindenki barátja mindenkinek”) és a $+--$ („az ellenségem ellensége a barátom”) kiegyensúlyozott. Szorzat $-$: a $++-$ és a $---$ kiegyensúlyozatlan. A $++-$-t könnyű kiegyensúlyozottnak hinni, mert „majdnem minden pozitív” – pedig épp ez a feszült eset. Részletek: 6. fejezet.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy előjeles gráf mátrixában mi a különbség az $A_{uv} = 0$ és az $A_{uv} = -1$ között?`,
          options: [
            "0: nincs viszony köztük; −1: bírálja / ellenzi – ez is kapcsolat, csak ellentétes előjelű.",
            "Nincs különbség: mindkettő azt jelenti, hogy nincs kapcsolat.",
            "−1: a két szereplő nem szerepel együtt egyetlen cikkben sem; 0: együtt szerepelnek, de semlegesen.",
            "0: semleges említés; −1: hiányzó adat."
          ],
          answer: 0,
          hint: "A bírálat kapcsolat-e?",
          explain: R`$\sigma(uv) = -1$ azt jelenti, hogy van viszony, és az negatív (bírál, ellenez). A 0 azt, hogy nincs viszony. A negatív él nem „hiányzó” él – a Szakértő és a Kormány között épp a bírálat a kapcsolat. A −1 nem az együttes említés hiánya és nem hiányzó adat.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Szakértő előjeles viszonyai: Vízügy (+), Kormány (−). Mennyi az előjeles erőssége?`,
          options: ["0", "2", "1", "−1"],
          answer: 0,
          hint: "Az előjeles erősség a pozitív élek száma mínusz a negatívaké.",
          explain: R`$1 - 1 = 0$. A 2 az előjel nélküli fokszám, az 1 csak a pozitív éleket számolja, a $-1$ csak a negatívat. Figyeld meg: a 0 itt <b>nem</b> azt jelenti, hogy nincs viszonya – két ellentétes viszonya van, és az összeg elrejti ezt. Ezért néha jobb külön számolni a pozitív és a negatív éleket.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cikkben X bírálja Y-t, egy másikban dicséri. Hogyan ábrázold az előjeles gráfban?",
          options: [
            "Két külön éllel (egy + és egy −), két réteggel vagy időbélyeggel – úgy, hogy a vita látsszon.",
            "Egyetlen 0 előjelű éllel, hiszen a kettő kiegyenlíti egymást.",
            "Sehogy: az ellentmondásos élt törölni kell.",
            "Csak a pozitív éllel, mert a dicséret erősebb jel."
          ],
          answer: 0,
          hint: "Mit rejtene el az összevont érték?",
          explain: R`Az összevont „0” elrejtené, hogy vita volt – és a 0 ráadásul „nincs viszony”-t jelent. Jobb két külön él (multigráf), két réteg (3.6), vagy időbélyeg (3.5), ha a sorrend számít. Törölni vagy egyik előjelet kiválasztani információvesztés.`
        }
      ]
    },

    /* ------------------------------------------------ 3.4 */
    "gh3-34": {
      title: "Kvíz – 3.4 Páros gráfok és vetületük",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A lap–esemény illeszkedési mátrixban ($B$, sor: lap, oszlop: esemény) mit jelent egy <b>oszlop</b>összeg?`,
          options: [
            "Hány lap írt az eseményről.",
            "Hány eseményről írt a lap.",
            "Hány cikk szólt az eseményről.",
            "Hány másik eseménnyel van közös lapja."
          ],
          answer: 0,
          hint: "Egy oszlop egy eseményhez tartozik; benne minden 1-es egy lapot jelent.",
          explain: R`Az oszlop egy esemény; minden 1-es egy lap, amely írt róla: az oszlopösszeg a lapok száma (az E6-é 3). A sorösszeg mondja meg, hány eseményről írt a lap – a kettőt könnyű felcserélni. A cikkek számát a 0–1 mátrix nem mutatja: az E5-ről az Esti Krónika két cikket írt, mégis 1 áll ott. A közös lapok száma a $B^\top B$ vetületből jön.`
        },
        {
          type: "multi",
          q: "Melyik gráf páros? (Több jó válasz is lehet.)",
          options: [
            "élek: AB, BC, CD, DA",
            "élek: AB, BC, CA",
            "élek: AB, BC, CD, DE, EA",
            "élek: AB, AC, AD, DE",
            "élek: AB, BC, CD, DA, AC"
          ],
          answer: [0, 3],
          hint: "Kőnig tétele: egy gráf pontosan akkor páros, ha nincs benne páratlan hosszú kör.",
          explain: R`Az első egy 4 hosszú kör: $\{A, C\}$ és $\{B, D\}$ a két osztály. A negyedik fa (kör nélkül), az is páros: $\{A, E\}$ és $\{B, C, D\}$. A második háromszög, a harmadik 5 hosszú kör – páratlan kör, tehát nem páros. Az ötödikben az $AC$ húr két háromszöget hoz létre ($ABC$, $ACD$). A „nincs háromszög, tehát páros” hiba: az 5 hosszú kör is kizárja.`
        },
        {
          type: "single", shuffle: true,
          q: R`$B$ a $4 \times 6$-os lap–esemény illeszkedési mátrix (sor: lap). Melyik mátrix a <b>lapvetület</b> (lap–lap közös események)?`,
          options: [
            R`$BB^\top$ ($4 \times 4$-es)`,
            R`$B^\top B$ ($6 \times 6$-os)`,
            R`$B + B^\top$`,
            R`$B^2$`
          ],
          answer: 0,
          hint: "A vetület csúcsai a lapok. Melyik szorzat lesz 4 × 4-es?",
          explain: R`$P = BB^\top$, $P_{ij} = \sum_e B_{ie}B_{je}$: azon események száma, amelyekről az $i$. és a $j$. lap is írt. Ez $4 \times 4$-es. A $B^\top B$ az <b>esemény</b>vetület ($6 \times 6$) – a kettőt gyakran felcserélik. $B + B^\top$ és $B^2$ nem is értelmes, mert $B$ nem négyzetes.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az E3-ról RH és VN, az E6-ról RH, NY és VN írt. Mennyi az E3–E6 él súlya az eseményvetületben ($B^\top B$)?`,
          options: ["2", "1", "3", "5"],
          answer: 0,
          hint: "Az eseményvetületben két esemény súlya a közös lapjaik száma.",
          explain: R`Közös lapok: RH és VN – a súly 2. A 3 a két halmaz uniója (RH, NY, VN), az 5 a két oszlopösszeg összege ($2 + 3$), az 1 egy közös lap kifelejtése.`
        },
        {
          type: "single", shuffle: true,
          q: R`$N(RH) = \{E1, E3, E6\}$, $N(NY) = \{E2, E4, E6\}$. Mennyi a két lap Jaccard-hasonlósága?`,
          options: ["0,2", "0,33", "0,17", "1"],
          answer: 0,
          hint: "Jaccard: a közös elemek száma osztva az unió elemszámával.",
          explain: R`Közös: $\{E6\}$, 1 elem; unió: $\{E1, E2, E3, E4, E6\}$, 5 elem. $J = 1/5 = 0{,}2$. A $0{,}33 = 1/3$ a kisebbik halmazzal osztott (közös/min), a $0{,}17 = 1/6$ az összes eseménnyel osztott, az 1 pedig a nyers közös darabszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Darabszámban az RH–EK (közös: E1, 2 lap írt róla) és az RH–NY (közös: E6, 3 lap írt róla) egyforma: 1. Mekkora a Newman-súlyuk?`,
          options: [
            "RH–EK 1, RH–NY 0,5",
            "RH–EK 1, RH–NY 1",
            "RH–EK 0,5, RH–NY 1",
            "RH–EK 0,5, RH–NY 0,33"
          ],
          answer: 0,
          hint: R`Egy közös $e$ esemény $\frac{1}{k_e - 1}$-et ad, ahol $k_e$ az eseményről író lapok száma.`,
          explain: R`E1: $k = 2$, súly $\frac11 = 1$; E6: $k = 3$, súly $\frac12 = 0{,}5$. Newman-súllyal tehát az RH–EK kétszer erősebb: a ritka közös téma árulkodóbb, mint amiről mindenki írt. Az „1 és 1” a nyers darabszám, a „0,5 és 1” fordítva gondolja, a „0,5 és 0,33” az $\frac1k$-s képlettel számol.`
        },
        {
          type: "multi",
          q: "Mit veszít a lapvetület a lap–esemény páros gráfhoz képest? (Több jó válasz is lehet.)",
          options: [
            "Az E4 és az E5 nem látszik benne, mert csak egy-egy lap írt róluk.",
            "A vetületből nem állítható vissza az eredeti páros gráf.",
            "A vetületbeli fokszám már nem azt mutatja, hány eseményről írt a lap.",
            "Az RH–NY–VN háromszög csak abból jöhet, hogy egy eseményről mindhárom lap írt.",
            "Semmit: a vetület klaszterezettsége ugyanúgy értelmezhető, mint egy eredeti hálózaté."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj arra, mi lesz egy olyan eseményből, amelyről csak egy lap írt, és mi egy háromlapos eseményből.",
          explain: R`Az egy lap által lefedett esemény egyetlen lappárt sem köt össze, ezért eltűnik (az Esti Krónika beruházási vitája is). Ugyanazt a háromszöget adná egy háromlapos esemény és három külön, kétlapos esemény is – ezért a páros gráf nem állítható vissza, és a háromszög sem árulja el az eredetét. A vetületbeli fokszám azt mondja meg, hány másik lappal van közös eseménye. A sok klikk miatt a klaszterezettség mesterségesen magas – ha lehet, a páros gráfon elemezz.`
        }
      ]
    },

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

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
