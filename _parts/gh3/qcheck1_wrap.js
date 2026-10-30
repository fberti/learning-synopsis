(function(){const R=String.raw; const Q={
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
}; })();
