/* =========================================================
   Gráfelmélet és hálózattudomány 1. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 1.1 */
    "gh1-11": {
      title: "Kvíz – 1.1 Pontok és vonalak",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Legyen $V = \{1, 2, 3, 4, 5, 6\}$ és $E = \{12, 23, 31, 45\}$. Mennyi $n$ és $m$?`,
          options: [R`$n = 6,\ m = 4$`, R`$n = 5,\ m = 4$`, R`$n = 6,\ m = 8$`, R`$n = 4,\ m = 6$`],
          answer: 0,
          hint: R`$n$ a $V$ halmaz, $m$ az $E$ halmaz elemeinek száma. Nézd meg, minden csúcs szerepel-e valamelyik élben – és kell-e szerepelnie?`,
          explain: R`$n = |V| = 6$ és $m = |E| = 4$. A 6-os csúcsra nem illeszkedik él, de benne van $V$-ben, tehát csúcs ($n = 5$ akkor jönne ki, ha csak az élekben szereplő csúcsokat számolnád). Az $m = 8$ minden élt kétszer számol (egyszer mindkét végpontjánál) – ez a fokszámok összege lesz (1.3). Az $n = 4,\ m = 6$ a két halmaz felcserélése.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az $ab$ és a $ba$ ugyanaz az él.`,
            "Ahol két él a rajzon keresztezi egymást, ott új csúcs keletkezik.",
            R`Ha $uv \in E$, akkor az $uv$ él illeszkedik $u$-ra és $v$-re is.`,
            "Ha két csúcsot a rajzon egymáshoz közel rajzoltak, akkor szomszédosak.",
            "Ha két csúcs között van több élből álló út, akkor szomszédosak."
          ],
          answer: [0, 2],
          hint: R`Gondolj a definícióra: az él rendezetlen pár, a csúcsok pedig pontosan $V$ elemei. A rajz többi része nem információ.`,
          explain: R`Az él rendezetlen pár: $ab = ba = \{a, b\}$. Az él a két végpontjára illeszkedik. A rajz nem a gráf: a keresztezés nem csúcs (csúcs csak az, ami $V$-ben van), és a rajzbeli távolság sem jelent semmit. A szomszédosság közvetlen élt jelent; a több lépéses elérhetőség más fogalom (2. fejezet).`
        },
        {
          type: "single", shuffle: true,
          q: R`A barátsággráfban Anna, Bence és Csilla hárman jóban vannak, Csilla ismeri Dávidot is (élek: $AB, AC, BC, CD$). Szomszédos-e Anna és Dávid?`,
          options: [
            "Nem szomszédosak, de Csillán keresztül elérhetők egymásból.",
            "Szomszédosak, mert Csillán keresztül össze vannak kötve.",
            "Nem szomszédosak, és egymásból nem is érhetők el.",
            "Szomszédosak, mert mindketten Csilla szomszédai."
          ],
          answer: 0,
          hint: R`Keresd meg az $AD$ élt az élhalmazban. Ha nincs ott, nézd meg, el lehet-e jutni egyikből a másikba több lépésben.`,
          explain: R`$AD \notin E$, tehát nem szomszédosak. Az $A$–$C$–$D$ úton viszont két lépésben eljutunk egyikből a másikba. A tipikus hiba a <b>szomszédos</b> és az <b>elérhető</b> összekeverése: a szomszédosság csak közvetlen élt jelent. A közös szomszéd sem teszi szomszédossá a két csúcsot.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy cikk négy szereplőt említ. Hány élt ad ez a cikk az együttes említés gráfjához?",
          options: ["6", "12", "16", "3"],
          answer: 0,
          hint: "Minden szereplőpár egy él. Hány pár képezhető 4 elemből, ha a pár rendezetlen?",
          explain: R`Négy szereplőből $\binom42 = 6$ rendezetlen pár képezhető, és mindegyik egy él. A 12 a rendezett párok száma ($4 \cdot 3$): így minden élt kétszer számolnál ($ab$ és $ba$). A 16 $= 4^2$ a szereplőt önmagával is párba állítja. A 3 csak az egyik szereplő éleit számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legfeljebb hány éle lehet egy 7 csúcsú gráfnak (az 1.1 definíciója szerint, hurok és többszörös él nélkül)?`,
          options: ["21", "42", "49", "7"],
          answer: 0,
          hint: "Minden él egy csúcspár, és egy pár legfeljebb egyszer szerepel. Hány pár van?",
          explain: R`Legfeljebb annyi él van, ahány csúcspár: $\binom72 = \frac{7 \cdot 6}{2} = 21$. A 42 $= 7 \cdot 6$ minden párt kétszer számol ($uv$ és $vu$ ugyanaz). A 49 $= 7^2$ ráadásul a csúcsot önmagával is párosítja. A 7 csak a csúcsok száma.`
        },
        {
          type: "match",
          q: "Párosítsd a magyar szakszót az angol megfelelőjével!",
          pairs: [
            ["csúcs", "vertex (node)"],
            ["él", "edge (link)"],
            ["szomszédos", "adjacent"],
            ["illeszkedik", "incident"]
          ],
          hint: "Az „illeszkedik” csúcs és él viszonya, a „szomszédos” két csúcsé.",
          explain: R`Csúcs = vertex, a hálózattudományban node; él = edge, a hálózattudományban link (a társadalmi hálózatelemzésben tie). Két csúcs <em>adjacent</em> (szomszédos), ha él köti össze őket; az él <em>incident</em> (illeszkedik) a végpontjaira. A két utóbbit könnyű összekeverni: az egyik csúcs–csúcs, a másik él–csúcs kapcsolat.`
        },
        {
          type: "single", shuffle: true,
          q: R`A szakasz három története (barátok, városok, hírek) ugyanazt a szerkezetet adta: egy háromszöget és egy negyedik csúcsot, amely egyetlen éllel kapcsolódik hozzá. Melyik élhalmaz írja le ugyanezt a szerkezetet?`,
          options: [
            R`$\{xy,\ yz,\ zw,\ wy\}$`,
            R`$\{xy,\ yz,\ zw,\ wx\}$`,
            R`$\{xy,\ yz,\ zw\}$`,
            R`$\{xy,\ xz,\ xw\}$`
          ],
          answer: 0,
          hint: "Keress három csúcsot, amelyek páronként szomszédosak, és nézd meg, mi a helyzet a negyedikkel.",
          explain: R`Az $\{xy, yz, zw, wy\}$-ban $y, z, w$ háromszöget alkot, $x$ pedig csak $y$-hoz kapcsolódik – ez a keresett szerkezet, csak a betűk mások. Az $\{xy, yz, zw, wx\}$ egy négyszög (kör), nincs benne háromszög. Az $\{xy, yz, zw\}$ egy négy csúcsú út, az $\{xy, xz, xw\}$ pedig egy csillag: egyikben sincs háromszög. Mind a négyben 4 csúcs van, mégsem ugyanaz a szerkezet – a csúcsszám kevés az azonossághoz.`
        }
      ]
    },

    /* ------------------------------------------------ 1.2 */
    "gh1-12": {
      title: "Kvíz – 1.2 Mi legyen a csúcs, és mi az él?",
      questions: [
        {
          type: "match",
          q: "Melyik gráf melyik kérdésre felel? Párosítsd!",
          pairs: [
            ["Kiket kapcsol össze a sajtó?", "szereplőgráf"],
            ["Mely cikkek szólnak ugyanarról?", "cikkgráf"],
            ["Mely lapok hasonlítanak egymásra?", "lapgráf"],
            ["Melyik gráfból olvasható vissza a táblázat minden sora?", "cikk–szereplő gráf"]
          ],
          hint: "Nézd meg, mi a csúcs az egyes gráfokban – a kérdés mindig a csúcsokról szól.",
          explain: R`A szereplőgráf csúcsai szereplők, ezért a szereplők közti viszonyról szól; a cikkgráf csúcsai cikkek, a lapgráfé lapok. A cikk–szereplő gráf az egyetlen, amelyben semmi sem vész el: minden él egy (cikk, szereplő) bejegyzés a táblázatból. A másik három belőle készül, és közben információt veszít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy cikk: az 1-es a Kormányt és a Vízügyet, a 4-es a Vízügyet és a Szakértőt, a 6-os a Szakértőt és a Klímaváltozást, a 7-es a Lakókat és az Önkénteseket említi. Készíts cikkgráfot (él = van közös szereplőjük)! Hány csúcsa és éle van?`,
          options: ["4 csúcs, 2 él", "6 csúcs, 4 él", "4 csúcs, 3 él", "4 csúcs, 6 él"],
          answer: 0,
          hint: "A csúcsok most a cikkek. Nézd végig a cikkpárokat: melyiknek van közös szereplője?",
          explain: R`Élek: 1–4 (Vízügy) és 4–6 (Szakértő); az 1-es és a 6-os cikknek nincs közös szereplője, a 7-esnek pedig senkivel. Tehát 4 csúcs, 2 él (a 7-es izolált, de csúcs marad). A „6 csúcs, 4 él” a <em>szereplőgráf</em> – rossz csúcsválasztás. A „3 él” abból a tévedésből jön, hogy ha 1–4 és 4–6 él, akkor 1–6 is az: a közös szereplő nem „öröklődik”. A 6 él az összes lehetséges cikkpár.`
        },
        {
          type: "single", shuffle: true,
          q: R`A szereplőgráfban (él = legalább egy cikkben együtt szerepelnek) él köti össze a Polgármestert és a Kormányt. Mit lehet <b>ebből az élből</b> biztosan állítani?`,
          options: [
            "Legalább egy cikk mindkettőjüket említi.",
            "A Polgármester és a Kormány szövetségesek.",
            "A Polgármester köszönetet mondott a Kormánynak.",
            "Sok cikkben szerepelnek együtt."
          ],
          answer: 0,
          hint: "Mondd ki az élszabályt egy mondatban. Amit ez a mondat nem tartalmaz, azt az él sem tudja.",
          explain: R`Az él egy állítás, és ez az állítás csak az együttes említés. A szövetség, az egyetértés vagy az ok-okozat nincs benne az élszabályban. A „köszönetet mondott” a 2-es cikk <em>címében</em> szerepel, de a gráfból nem olvasható ki – az él ugyanígy nézne ki, ha bírálná. Hogy hány cikkben szerepelnek együtt, azt sem tudjuk: az él csak „van vagy nincs”.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban nincs él a Kormány és a Lakók között. Mit jelent ez?",
          options: [
            "A vizsgált 12 cikk egyikében sem szerepeltek együtt.",
            "A kormány a héten nem foglalkozott a lakókkal.",
            "A Kormány és a Lakók érdekei ellentétesek.",
            "A Kormány és a Lakók között a valóságban nincs kapcsolat."
          ],
          answer: 0,
          hint: "A gráf csak arról szól, amit összegyűjtöttünk. Mi volt az összegyűjtött adat?",
          explain: R`A hiányzó él a megfigyelt adatról szól, nem a világról: ebben a 12 cikkben nem szerepeltek együtt. Egy másik lap, egy másik hét vagy egy tévéhíradó együtt említhetné őket, és a kormány a lakókkal attól még foglalkozhatott. A hiányzó él nem bizonyíték – sem a kapcsolat hiányára, sem ellentétre.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 1.2 négy cikkéből (2: Kormány, Vízügy, Polgármester; 5: Szakértő, Klímaváltozás, Kormány; 8: Lakók, Polgármester, Önkéntesek; 10: Polgármester, Vízügy) cikkgráfot készítünk, de szigorúbb szabállyal: él csak akkor legyen, ha a két cikknek <b>legalább két</b> közös szereplője van. Hány éle lesz?`,
          options: ["1", "4", "2", "0"],
          answer: 0,
          hint: "Vedd sorra az eredeti cikkgráf négy élét, és mindegyiknél számold meg a közös szereplőket.",
          explain: R`Az eredeti élek: 2–5 (Kormány), 2–8 (Polgármester), 2–10 (Vízügy, Polgármester), 8–10 (Polgármester). Csak a 2–10 párnak van két közös szereplője, tehát 1 él marad. A 4 az eredeti, „legalább egy közös” szabály eredménye. Ugyanabból az adatból egyetlen szabályváltoztatással más gráf lett.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a cikk–szereplő gráfra (él = a cikk említi a szereplőt)? (Több jó válasz is lehet.)",
          options: [
            "Él csak egy cikk és egy szereplő között futhat.",
            "A cikkek és szereplők táblázatának minden sora visszaolvasható belőle.",
            "Két szereplő között akkor van él, ha egy cikkben szerepelnek.",
            "A szereplőgráf elkészíthető belőle, de a szereplőgráfból ez nem rakható vissza.",
            "Kevesebb információt tartalmaz, mint a szereplőgráf."
          ],
          answer: [0, 1, 3],
          hint: "Fogalmazd meg az élszabályt, és nézd meg, értelmes-e két cikk vagy két szereplő között.",
          explain: R`Az élszabály („a cikk említi a szereplőt”) két szereplő vagy két cikk között nem értelmes, ezért ilyen él nincs. Minden él egy táblázatbeli bejegyzés, így semmi sem vész el. A szereplőgráf és a cikkgráf ebből készül, és közben információt veszít: a szereplőgráfból már nem látszik, melyik él melyik cikkből jött. A „két szereplő között él” a szereplőgráf szabálya, nem ezé.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét lapgráfjában (csúcs = lap, él = van közös szereplőjük) a lapok szereplői: RH: Kormány, Vízügy, Polgármester; EK: Vízügy, Szakértő, Klímaváltozás, Kormány; NY: Lakók, Önkéntesek, Polgármester; VN: Polgármester, Vízügy, Lakók, Önkéntesek. Melyik két lap között <b>nincs</b> él?`,
          options: [
            "Esti Krónika – Nyitott Szó",
            "Reggeli Hírlap – Nyitott Szó",
            "Esti Krónika – Vidéki Napló",
            "Reggeli Hírlap – Esti Krónika"
          ],
          answer: 0,
          hint: "Minden laphoz írd fel a szereplőhalmazát, és nézd meg, melyik két halmaz metszete üres.",
          explain: R`EK és NY szereplői közt nincs közös, ezért nincs köztük él. RH–NY a Polgármester, EK–VN a Vízügy miatt szomszédos (egy közös szereplő elég), RH–EK pedig a Kormány és a Vízügy miatt. A lapgráfnak így 4 csúcsa és 5 éle van.`
        }
      ]
    },

    /* ------------------------------------------------ 1.3 */
    "gh1-13": {
      title: "Kvíz – 1.3 Fokszám és a kézfogási lemma",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$V = \{a, b, c, d, e, f\}$, $E = \{ab, bc, bd, cd, de\}$. Mi a fokszámsorozat?`,
          options: [R`$(3, 3, 2, 1, 1, 0)$`, R`$(3, 3, 2, 1, 1)$`, R`$(3, 2, 2, 1, 1, 0)$`, R`$(0, 1, 1, 2, 3, 3)$`],
          answer: 0,
          hint: "Számold meg minden csúcsnál, hány él illeszkedik rá – az $f$-re is. Utána rendezd a listát.",
          explain: R`$d(a) = 1$, $d(b) = 3$, $d(c) = 2$, $d(d) = 3$, $d(e) = 1$, $d(f) = 0$, nemnövekvő sorrendben $(3, 3, 2, 1, 1, 0)$. Ellenőrzés: az összeg $10 = 2 \cdot 5$. Az $(3, 3, 2, 1, 1)$ kihagyja az izolált $f$-et – pedig az izolált csúcs is csúcs. A $(3, 2, 2, 1, 1, 0)$ összege páratlan, tehát biztosan elszámolás. A $(0, 1, 1, 2, 3, 3)$ növekvő sorrendű; a fokszámsorozatot csökkenő (nemnövekvő) sorrendben írjuk.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf fokszámsorozata $(5, 4, 3, 3, 2, 1)$. Hány éle van?`,
          options: ["9", "18", "6", "15"],
          answer: 0,
          hint: "Minden él két fokszámot növel eggyel.",
          explain: R`A fokszámok összege $18$, és a kézfogási lemma szerint ez $2m$, tehát $m = 9$. A 18 az elfelejtett felezés: az összeg minden élt kétszer számol. A 6 a csúcsok száma, a 15 $= \binom62$ a lehetséges élek száma.`
        },
        {
          type: "multi",
          q: "Melyik sorozat lehet egy egyszerű gráf fokszámsorozata? (Több jó válasz is lehet.)",
          options: [R`$(2, 2, 2)$`, R`$(3, 2, 2, 1)$`, R`$(3, 3, 1, 1)$`, R`$(2, 2, 1, 1, 1)$`, R`$(4, 3, 2, 1)$`],
          answer: [0, 1],
          hint: R`Három dolgot nézz: páros-e az összeg; nincs-e $n - 1$-nél nagyobb fokszám; és ha egy csúcs mindenkivel szomszédos, maradhat-e valakinek túl kicsi a fokszáma.`,
          explain: R`$(2, 2, 2)$: háromszög. $(3, 2, 2, 1)$: egy háromszög és egy függő csúcs (a barátsággráf). $(2, 2, 1, 1, 1)$: az összeg 7, páratlan – nem lehet. $(4, 3, 2, 1)$: 4 csúcsnál a fokszám legfeljebb 3. $(3, 3, 1, 1)$: az összeg 8, páros, mégsem rajzolható – a két 3-as fokú csúcs mindhárom másikkal szomszédos, így az „1-esek” fokszáma legalább 2 lenne. A páros összeg szükséges, de nem elégséges.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 8 csúcsú gráfnak 12 éle van. Mennyi az átlagos fokszám?`,
          options: [R`$3$`, R`$1{,}5$`, R`$24$`, R`$\approx 0{,}43$`],
          answer: 0,
          hint: R`Először a fokszámok összegét számold ki a kézfogási lemmával, aztán oszd el a csúcsok számával.`,
          explain: R`$\sum d(v) = 2m = 24$, ezért $\bar d = 2m/n = 24/8 = 3$. Az $1{,}5 = m/n$ elfelejti, hogy minden él két csúcs fokszámát növeli. A 24 a fokszámösszeg, nem az átlag. A $0{,}43 = 12/28$ a sűrűség (1.4), nem az átlagos fokszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 5 csúcsú egyszerű gráf fokszámai: $4, 3, 3, 2$ és $x$. Melyik $x$ lehetséges?`,
          options: [R`$x = 2$`, R`$x = 0$`, R`$x = 1$`, R`$x = 3$`],
          answer: 0,
          hint: R`Nézd meg az összeg paritását. Aztán gondold meg: mit jelent a 4-es fokú csúcs egy 5 csúcsú gráfban?`,
          explain: R`$4 + 3 + 3 + 2 = 12$, így az összeg csak páros $x$-re lehet páros: $x = 1$ és $x = 3$ kiesik (a páratlan fokú csúcsok száma is páratlan lenne). $x = 0$ sem jó: a 4-es fokú csúcs mind a 4 többivel szomszédos, így izolált csúcs nem lehet. $x = 2$ működik, például a $(4, 3, 3, 2, 2)$ sorozatú gráffal (az összeg 14, $m = 7$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy hírhéten 7 szereplő mindegyikét pontosan 3 másikkal említették együtt. Hány éle van a szereplőgráfnak?",
          options: ["Ilyen gráf nem létezik.", "21", "10", "11"],
          answer: 0,
          hint: "Számold ki a fokszámok összegét. Milyennek kell lennie ennek a számnak?",
          explain: R`$\sum d = 7 \cdot 3 = 21$, ami páratlan, pedig a kézfogási lemma szerint $2m$, tehát páros. Ilyen gráf nincs: 7 páratlan fokú csúcs lenne, pedig a páratlan fokúak száma mindig páros. A 21 a felezés elfelejtése. A 10 és a 11 a felezést elvégzi ($10{,}5$), majd lefelé vagy felfelé kerekít – pedig a nem egész eredmény éppen azt jelzi, hogy ilyen gráf nincs.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Ha az izolált csúcsokat kihagyod, megváltozik az átlagos fokszám.",
            R`Egyszerű gráfban minden csúcsra $d(v) \le n - 1$.`,
            "A nagy fokszámú szereplőről biztosan sok cikk szól.",
            "A levél fokszáma 0.",
            "Minden gráfban páros sok páratlan fokú csúcs van."
          ],
          answer: [0, 1, 4],
          hint: "Gondold végig a definíciókat (izolált csúcs, levél) és a kézfogási lemma következményét. Mit számol pontosan a fokszám?",
          explain: R`Az izolált csúcs elhagyása csökkenti $n$-et, a fokszámösszeget nem, így $\bar d = 2m/n$ megnő. Egy csúcs legfeljebb a többi $n - 1$ csúccsal lehet szomszédos. A páratlan fokúak száma páros (kézfogási lemma). A fokszám a <em>különböző</em> szomszédok száma, nem a cikkeké: aki sok cikkben szerepel, de mindig ugyanazzal a párral, annak kicsi a fokszáma. A levél fokszáma 1; a 0 fokú csúcs az izolált.`
        }
      ]
    },

    /* ------------------------------------------------ 1.4 */
    "gh1-14": {
      title: "Kvíz – 1.4 Ábrázolások: lista és mátrix",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Melyik az alábbi szomszédsági mátrixú gráf élhalmaza (a csúcsok sorrendje $1, 2, 3, 4$)?
$$A = \begin{pmatrix} 0 & 1 & 1 & 0\\ 1 & 0 & 0 & 1\\ 1 & 0 & 0 & 1\\ 0 & 1 & 1 & 0 \end{pmatrix}$$`,
          options: [
            R`$\{12,\ 13,\ 24,\ 34\}$`,
            R`$\{12,\ 13,\ 21,\ 24,\ 31,\ 34,\ 42,\ 43\}$`,
            R`$\{12,\ 13,\ 24\}$`,
            R`$\{11,\ 14,\ 22,\ 23\}$`
          ],
          answer: 0,
          hint: "A mátrix szimmetrikus, ezért elég a főátló feletti részt olvasni. Hol áll 1-es?",
          explain: R`A főátló felett az $A_{12}, A_{13}, A_{24}, A_{34}$ cellákban áll 1, tehát az élek $12, 13, 24, 34$ – egy négyszög (kör). A 8 elemű lista minden élt kétszer ír fel ($12 = 21$): ez az 1-esek száma ($2m = 8$), nem az élszám. A 3 elemű lista kihagyja a $34$-et, a negyedik pedig a 0-s cellákat olvassa ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy egyszerű gráfnak 6 csúcsa és 8 éle van. Hány 1-es áll a szomszédsági mátrixában?`,
          options: ["16", "8", "36", "15"],
          answer: 0,
          hint: R`Egy $uv$ élhez hány cella tartozik a mátrixban?`,
          explain: R`Minden $uv$ él két cellában jelenik meg ($A_{uv}$ és $A_{vu}$), így az 1-esek száma $2m = 16$ – ez a kézfogási lemma mátrixban: az elemösszeg a fokszámok összege. A 8 az élszám (csak a mátrix egyik fele). A 36 $= 6 \cdot 6$ az összes cella, a 15 $= \binom62$ a lehetséges élek száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf szomszédsági listája: $a$: $b, c$; $b$: $a, c, d$; $c$: $a, b$; $d$: $b$; $e$: (üres). Hány éle van?`,
          options: ["4", "8", "5", "10"],
          answer: 0,
          hint: "A sorok hossza a fokszám. Mit mond a kézfogási lemma a sorhosszak összegéről?",
          explain: R`A sorhosszak (fokszámok) összege $2 + 3 + 2 + 1 + 0 = 8 = 2m$, tehát $m = 4$: $ab, ac, bc, bd$. A szomszédsági lista minden élt kétszer tárol (mindkét végpontnál), ezért a 8 a bejegyzések száma, nem az élszám. Az 5 a sorok (csúcsok) száma, a 10 $= \binom52$ a lehetséges élek száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi egy 6 csúcsú, 9 élű egyszerű gráf sűrűsége?`,
          options: [R`$0{,}6$`, R`$0{,}25$`, R`$1{,}5$`, R`$0{,}3$`],
          answer: 0,
          hint: R`A sűrűség a meglévő élek aránya a lehetséges élekhez. Hány lehetséges él van 6 csúcson?`,
          explain: R`$\rho = m / \binom n2 = 9/15 = 0{,}6$. A $0{,}25 = 9/36$ az $n^2$-tel oszt (a mátrix celláival, a főátlót és a duplázást is beleértve). Az $1{,}5 = m/n$ nem is arány: 1-nél nagyobb, pedig $0 \le \rho \le 1$. A $0{,}3 = 9/30$ az $n(n-1)$-gyel oszt, vagyis elfelejti, hogy a pár rendezetlen.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két hálózat: az egyiknek 10 csúcsa van, a másiknak 1000, és mindkettőben 4 az átlagos fokszám. Melyik állítás igaz?`,
          options: [
            "Egy átlagos csúcsnak mindkettőben ugyanannyi szomszédja van, a nagy hálózat sűrűsége mégis kb. százszor kisebb.",
            "Mivel az átlagos fokszám egyforma, a sűrűségük is egyforma.",
            "A nagy hálózatban egy átlagos csúcsnak sokkal kevesebb szomszédja van, hiszen ritkább.",
            "A kis hálózat sűrűbb, tehát a csúcsainak több szomszédja van."
          ],
          answer: 0,
          hint: R`Írd fel a sűrűséget az átlagos fokszámmal: $\rho = \bar d/(n - 1)$.`,
          explain: R`$\rho = \bar d/(n-1)$: a kis hálózatban $4/9 \approx 0{,}44$, a nagyban $4/999 \approx 0{,}004$, vagyis kb. százszor kisebb. Az átlagos csúcs szomszédszáma ($\bar d = 4$) viszont mindkettőben ugyanaz. A sűrűség az $n - 1$-gyel oszt, ezért különböző méretű hálózatokat ne a sűrűségük, hanem az átlagos fokszámuk alapján hasonlíts össze.`
        },
        {
          type: "match",
          q: "Melyik ábrázolás illik a feladathoz? Párosítsd!",
          pairs: [
            ["egy nagy, ritka hálózat tárolása", "szomszédsági lista"],
            ["egyetlen cellából eldönteni, szomszédos-e két csúcs", "szomszédsági mátrix"],
            ["a gráf elküldése CSV-fájlban", "éllista"],
            ["egy csúcs szomszédainak gyors kiolvasása egy ritka gráfban", "szomszédsági lista"],
            [R`mátrixszámolás (pl. a kétlépéses utak $A^2$-ből)`, "szomszédsági mátrix"]
          ],
          hint: "Gondold meg, mennyi helyet foglal az egyes ábrázolás egy ritka gráfnál, és melyikből mi olvasható ki egy lépésben.",
          explain: R`A szomszédsági lista csak $2m$ bejegyzést tárol, ezért a nagy, ritka hálózatokhoz ez kell, és egy csúcs szomszédai egy sorban állnak. A mátrix $n^2$ cellát foglal, de egy cellából azonnal látszik a szomszédosság, és számolni is lehet vele. Az éllista a legtömörebb „nyers adat”: CSV-ben egy sor = egy él. (Az éllistából a szomszédok kikereséséhez végig kellene nézni minden élt.)`
        },
        {
          type: "multi",
          q: "Melyik igaz minden egyszerű, irányítatlan gráf szomszédsági mátrixára? (Több jó válasz is lehet.)",
          options: [
            "A mátrix szimmetrikus a főátlóra.",
            "A főátlóban csupa 0 áll.",
            R`Az $i$-edik sor összege az $i$-edik csúcs fokszáma.`,
            R`Az összes elem összege az élszám, $m$.`,
            "Ha a csúcsokat átszámozzuk, más gráfot kapunk."
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig, mi történik a mátrixban, amikor beírsz egy $uv$ élt. És mi változik átszámozáskor: a gráf vagy csak a leírása?`,
          explain: R`Az él rendezetlen pár, ezért $A_{uv} = A_{vu} = 1$: a mátrix szimmetrikus, és a sorösszeg a fokszám. Hurok nincs, így $A_{ii} = 0$. Az elemösszeg $\sum d(i) = 2m$, nem $m$ – minden él kétszer szerepel. Átszámozáskor a mátrix megváltozik, a gráf nem: ugyanazok a csúcsok és élek, csak más sorrendben írjuk fel őket.`
        }
      ]
    },

    /* ------------------------------------------------ 1.5 */
    "gh1-15": {
      title: "Kvíz – 1.5 Egyszerű gráf, hurok, többszörös él",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban $p$ és $q$ között 2 párhuzamos él fut, $q$ és $r$ között 1 él, $r$-en pedig van egy hurokél. Mennyi a fokszámok összege?`,
          options: ["8", "7", "6", "4"],
          answer: 0,
          hint: "Minden él annyit ad a fokszámhoz, ahányszor a csúcsra illeszkedik. Hányszor illeszkedik a hurok a saját csúcsára?",
          explain: R`$d(p) = 2$, $d(q) = 2 + 1 = 3$, $d(r) = 1 + 2 = 3$, összesen $8$. Ez $2m$, hiszen $m = 2 + 1 + 1 = 4$ – a kézfogási lemma itt is igaz. A 7 akkor jön ki, ha a hurkot 1-nek számolod (ekkor páratlan lenne az összeg, ami lehetetlen). A 6 a párhuzamos éleket egynek veszi, a 4 pedig maga az élszám, nem a fokszámösszeg.`
        },
        {
          type: "single", shuffle: true,
          q: "A königsbergi hidak gráfjában a négy szárazföldi rész a csúcs, a hét híd az él. Mi a fokszámsorozat?",
          options: ["(5, 3, 3, 3)", "(3, 3, 2, 2)", "(5, 3, 3, 2)", "(4, 3, 3, 3)"],
          answer: 0,
          hint: "Minden híd külön él – a párhuzamos hidak külön-külön számítanak. Ellenőrizd a kézfogási lemmával!",
          explain: R`A sziget: 2 híd északra, 2 délre, 1 keletre, $d = 5$. Az északi part, a déli part és a keleti terület 3-3. Összeg: $14 = 2 \cdot 7$ ✓. A $(3, 3, 2, 2)$ a <b>különböző szomszédokat</b> számolja (az egyszerűsített gráf sorozata), pedig a fokszám az illeszkedő élek száma. A többi sorozat összege páratlan (13), tehát biztosan elszámolás.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány éle van a königsbergi hidak gráfjának, és hány szomszédos csúcspár van benne?",
          options: ["7 él, 5 szomszédos pár", "5 él, 5 szomszédos pár", "7 él, 7 szomszédos pár", "14 él, 5 szomszédos pár"],
          answer: 0,
          hint: "Az élek itt önálló objektumok (hidak), nem csúcspárok. Ugyanaz a pár több hídhoz is tartozhat.",
          explain: R`Hét híd = 7 él. A szomszédos párok: É–Sz, D–Sz, K–Sz, É–K, D–K, összesen 5 – az É–Sz és a D–Sz párhoz két-két híd tartozik. A „5 él” az egyszerűsített gráf, amely elveszíti a többszörösséget. A 14 a fokszámösszeg ($2m$), nem az élszám.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az $e$ él hurokél, ha $|\varphi(e)| = 1$.`,
            "Egy gráf egyszerű, ha nincs benne sem hurokél, sem párhuzamos él.",
            R`Ha a networkx <code>Graph</code> típusába háromszor hozzáadod a La–Ön élt, a gráfnak 1 éle lesz.`,
            "A hurokél 1-gyel növeli a csúcsa fokszámát.",
            R`A $G = (V, E)$ definícióban az $E$ halmaz többször is tartalmazhatja ugyanazt a csúcspárt.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a $(V, E, \varphi)$ definícióra és a szakasz buktató-dobozára. Mi történik egy halmazban az ismétlődő elemmel?`,
          explain: R`A hurokélnek egyetlen végpontja van, ezért $|\varphi(e)| = 1$. Egyszerű az a gráf, amelyben nincs sem hurok, sem párhuzamos él. A networkx <code>Graph</code> egy már meglévő élt csendben nem ad hozzá újra, így a többszörösség elvész. A hurok viszont <b>2</b>-t ad a fokszámhoz (mindkét „vége” ott van), különben sérülne a kézfogási lemma. Az $E$ halmaz pedig egy elemet csak egyszer tartalmazhat – éppen ezért kell a $(V, E, \varphi)$ hármas a többszörös élekhez.`
        },
        {
          type: "match",
          q: "Melyik fogalom illik a leíráshoz? Párosítsd!",
          pairs: [
            ["él, ha a két szereplő legalább egy cikkben együtt szerepel", "egyszerű gráf"],
            ["minden közös cikk külön él a két szereplő között", "multigráf"],
            ["egy él, mellette a közös cikkek száma", "súlyozott gráf"],
            ["a csúcsra illeszkedő élek súlyainak összege", "erősség"],
            ["olyan él, amely a csúcsából önmagába tér vissza", "hurokél"]
          ],
          hint: "Ugyanaz az adat háromféleképpen: csak azt jegyzed fel, volt-e közös cikk; minden cikket külön vonallal rajzolsz; vagy egy vonalra számot írsz.",
          explain: R`Az egyszerű gráf csak azt tárolja, volt-e közös cikk – a „háromszor együtt” és az „egyszer együtt” ugyanúgy egy él. A multigráf minden közös cikket külön élként tart meg, a súlyozott gráf ugyanezt egyetlen él súlyaként ($w_{uv}$). Egész súlynál a kettő ugyanazt az információt hordozza. A súlyozott fokszám neve erősség; a hurokél pedig önmagába tér vissza.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét 12 cikke alapján hány éle van a szereplők multigráfjának (minden közös cikk egy él)?",
          options: ["18", "10", "36", "12"],
          answer: 0,
          hint: R`Egy $k$ szereplős cikk $\binom k2$ élt ad. Hány cikk említ 3 szereplőt, és hány 2-t?`,
          explain: R`Három cikk (2, 5, 8) 3 szereplős: $3 \cdot \binom32 = 9$ él. A többi kilenc cikk 2 szereplős: 9 él. Összesen $m = 18$. A 10 az <b>egyszerű</b> gráf élszáma (a különböző párok száma), a 36 a fokszámösszeg ($2m$), a 12 pedig a cikkek száma – de egy cikk több élt is adhat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Három cikk: (La, Ön), (La, Ön, Po), (La, Po). Mennyi a Lakók fokszáma és erőssége a súlyozott szereplőgráfban?`,
          options: ["fokszám 2, erősség 4", "fokszám 4, erősség 2", "fokszám 2, erősség 3", "fokszám 3, erősség 4"],
          answer: 0,
          hint: "Előbb írd fel az éleket és a súlyukat (hány cikkben szerepel együtt a pár). A fokszám a szomszédok száma, az erősség a súlyok összege.",
          explain: R`Élek és súlyok: La–Ön 2, La–Po 2, Ön–Po 1. A Lakók szomszédai: Önkéntesek, Polgármester → fokszám 2. Erősség: $2 + 2 = 4$. A 3 a Lakók <b>cikkeinek</b> száma – de a 3 szereplős cikk két párt ad a Lakóknak, ezért az erősség nagyobb. A „4 és 2” felcseréli a fokszámot és az erősséget.`
        }
      ]
    },

    /* ------------------------------------------------ 1.6 */
    "gh1-16": {
      title: "Kvíz – 1.6 Nevezetes gráfok, komplementer, izomorfia",
      questions: [
        {
          type: "match",
          q: "Párosítsd a gráfot a jellemzőjével!",
          pairs: [
            [R`$K_5$`, "10 él"],
            [R`$P_5$`, "4 él"],
            [R`$C_5$`, "5 él"],
            [R`$K_{1,5}$`, "6 csúcs"],
            [R`$\overline{K_5}$ (üres gráf)`, "0 él"]
          ],
          hint: R`Nézd meg a nevezetes gráfok táblázatát: a $P_n$-ben $n$ csúcs van, a $K_{1,n}$-ben $n$ levél.`,
          explain: R`$K_5$: $\binom52 = 10$ él. $P_5$: 5 csúcs, $5 - 1 = 4$ él. $C_5$: 5 csúcs, 5 él (az út + a záró él). $K_{1,5}$: egy középpont + 5 levél = 6 csúcs (és 5 él). Az üres gráfnak nincs éle. Tipikus hiba: $P_n$-nek $n$ élt adni, vagy a csillagnak $n$ csúcsot.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány éle van $K_8$-nak?`,
          options: ["28", "56", "64", "7"],
          answer: 0,
          hint: "Minden csúcspár egy él. Hány pár van, ha a sorrend nem számít?",
          explain: R`$\binom82 = \frac{8 \cdot 7}{2} = 28$. Az 56 = $8 \cdot 7$ minden élt kétszer számol (ez a fokszámösszeg), a 64 = $8^2$ a csúcs önmagával alkotott „párjait” is beleveszi. A 7 egy csúcs fokszáma, nem az élszám.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 10 csúcsú egyszerű gráfnak 6 éle van. Hány éle van a komplementerének?`,
          options: ["39", "4", "94", "84"],
          answer: 0,
          hint: R`Minden csúcspár pontosan az egyik gráfban él: vagy $G$-ben, vagy $\overline G$-ben.`,
          explain: R`$\overline m = \binom{10}{2} - 6 = 45 - 6 = 39$. A 4 = $n - m$ – ennek nincs értelme, hiszen a komplementer a hiányzó <b>párokat</b> köti össze, nem a csúcsokat számolja. A 94 = $10^2 - 6$ és a 84 = $10 \cdot 9 - 6$ a párok számát rosszul adja meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 8 csúcsú egyszerű gráfban $d_G(v) = 3$. Mennyi $v$ fokszáma a komplementerben?`,
          options: ["4", "5", "3", "25"],
          answer: 0,
          hint: R`Hány lehetséges szomszédja van egy csúcsnak egy $n$ csúcsú egyszerű gráfban?`,
          explain: R`$d_{\overline G}(v) = n - 1 - d_G(v) = 7 - 3 = 4$. Az 5 = $n - d$ elfelejti, hogy a csúcs önmagával nem lehet szomszédos. A 25 = $\binom82 - 3$ a komplementer élszámának képletét keveri a fokszámmal.`
        },
        {
          type: "single", shuffle: true,
          q: R`$V = \{A, B, C, D\}$, $E = \{AB, BC, CD, DA\}$. Mi a komplementer élhalmaza?`,
          options: [
            R`$\{AC, BD\}$`,
            R`$\{BA, CB, DC, AD\}$`,
            R`$\{AA, BB, CC, DD\}$`,
            R`$\{AC, BD, AB, CD\}$`
          ],
          answer: 0,
          hint: R`Írd fel mind a $\binom42 = 6$ párt, és húzd ki a foglaltakat. A komplementerben $u \ne v$.`,
          explain: R`A 6 párból 4 foglalt, marad $AC$ és $BD$. Ellenőrzés: $4 + 2 = 6$. A $\{BA, CB, DC, AD\}$ ugyanaz a négy él, csak megfordítva – az él rendezetlen pár. Hurok a komplementerbe sem kerül ($u \ne v$). Az utolsó opció két meglévő élt is tartalmaz.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            "Ha két gráf fokszámsorozata különbözik, biztosan nem izomorfak.",
            "Izomorf gráfokban a háromszögek száma megegyezik.",
            "A Reggeli Hírlap és a Nyitott Szó szereplőgráfja izomorf, pedig a csúcsaik mások.",
            "Ha két gráf fokszámsorozata megegyezik, akkor izomorfak.",
            "Ha két rajz másképp néz ki, akkor különböző gráfokat ábrázolnak."
          ],
          answer: [0, 1, 2],
          hint: "Mi az invariáns? Mire elég, ha egy invariáns eltér, és mire nem elég, ha mind egyezik?",
          explain: R`A fokszámsorozat és a háromszögek száma invariáns: izomorf gráfokban egyezik, ezért ha eltér, nincs izomorfia. A Reggeli Hírlap és a Nyitott Szó gráfja egyaránt $K_3$ – a szerkezet egyezik, a szereplők nem. A fordított irány hamis: $C_6$ és két különálló háromszög fokszámsorozata egyaránt $(2, 2, 2, 2, 2, 2)$, mégsem izomorfak. A rajz pedig nem a gráf: az ötszög és az ötágú csillag ugyanaz a $C_5$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$G_1$ élei: $ab, bc, cd, de, ea, ac$. $G_2$ élei: $12, 23, 34, 45, 51, 24$. Izomorfak?`,
          options: [
            R`Igen, pl. $a \mapsto 2$, $b \mapsto 3$, $c \mapsto 4$, $d \mapsto 5$, $e \mapsto 1$.`,
            "Igen, mert a fokszámsorozatuk megegyezik – ez elég.",
            R`Nem, mert a „húr” $G_1$-ben az $a$ és $c$, $G_2$-ben a 2 és 4 között fut.`,
            "Nem, mert a fokszámsorozatuk különbözik."
          ],
          answer: 0,
          hint: "Mindkettő egy ötszög plusz egy húr. Melyik két csúcs 3-as fokú, és szomszédosak-e? Próbálj megadni egy megfeleltetést, és ellenőrizd mind a hat élt!",
          explain: R`Mindkét gráfban két 3-as fokú csúcs van, és ezek szomszédosak ($ac$, illetve $24$). Az $f$: $a \mapsto 2$, $b \mapsto 3$, $c \mapsto 4$, $d \mapsto 5$, $e \mapsto 1$ minden élt élre visz: $ab \to 23$, $bc \to 34$, $cd \to 45$, $de \to 51$, $ea \to 12$, $ac \to 24$ ✓. A fokszámsorozat valóban egyezik, $(3, 3, 2, 2, 2)$, de ez önmagában <b>nem bizonyítja</b> az izomorfiát – ahhoz a megfeleltetés kell. A csúcsok neve pedig nem számít.`
        }
      ]
    },

    /* ------------------------------------------------ 1.7 */
    "gh1-17": {
      title: "Kvíz – 1.7 Alkalmazás: az Árvízhét szereplőhálózata",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban mi a különbség a Polgármester és a Kormány között?",
          options: [
            "Fokszámuk egyenlő (4), de a Polgármester erőssége nagyobb (8, illetve 6).",
            "A Polgármester fokszáma nagyobb (8, illetve 6).",
            "Erősségük egyenlő, de a Polgármester fokszáma nagyobb.",
            "Semmi: fokszámuk és erősségük is egyenlő."
          ],
          answer: 0,
          hint: "A fokszám azt számolja, hány különböző szereplővel említik együtt; az erősség azt, hányszor.",
          explain: R`Mindkettőnek 4 szomszédja van, tehát $d = 4$. Az erősség (a súlyok összege) viszont a Polgármesternél $2 + 2 + 2 + 2 = 8$, a Kormánynál $2 + 2 + 1 + 1 = 6$: a Polgármester szerepel a legtöbbször másokkal együtt. A „fokszám 8” a fokszámot és az erősséget keveri össze.`
        },
        {
          type: "match",
          q: "Milyen szerkezetű az egyes lapok heti szereplőgráfja? Párosítsd!",
          pairs: [
            ["Reggeli Hírlap", "háromszög"],
            ["Esti Krónika", "háromszög egy levéllel"],
            ["Nyitott Szó", "háromszög"],
            ["Vidéki Napló", "csillag"]
          ],
          hint: "Lapokként csak 3 cikk van. Írd fel a cikkek szereplőit, és kösd össze, akik egy cikkben szerepelnek.",
          explain: R`Reggeli Hírlap: Ko–Vi, Ko–Po, Vi–Po – egy $K_3$. Nyitott Szó: La–Ön, La–Po, Ön–Po – szintén $K_3$ (a kettő izomorf). Esti Krónika: Sz–Vi, Sz–Kl, Sz–Ko, Kl–Ko – háromszög, amelyhez a Szakértőn át a Vízügy levélként kapcsolódik. Vidéki Napló: Po–Vi, Po–La, Po–Ön – csillag, $K_{1,3}$, a Polgármester a középpont.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a Vidéki Napló heti szereplőgráfjának sűrűsége?",
          options: [R`$0{,}5$`, R`$0{,}75$`, R`$0{,}19$`, R`$1$`],
          answer: 0,
          hint: R`Hány csúcs és hány él? A sűrűség a meglévő élek aránya a $\binom n2$ lehetségeshez.`,
          explain: R`$n = 4$, $m = 3$: $\rho = 3 / \binom42 = 3/6 = 0{,}5$. A $0{,}75$ az $m/n$, a $0{,}19$ az $m/n^2 = 3/16$ – egyik sem sűrűség. Az 1 a háromszögeké (Reggeli Hírlap, Nyitott Szó), ahol minden pár szomszédos.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik szereplőpár éle a teljes heti szereplőgráf komplementerének?",
          options: ["Polgármester – Szakértő", "Kormány – Klímaváltozás", "Vízügy – Szakértő", "Polgármester – Vízügy"],
          answer: 0,
          hint: "A komplementerben azok a párok szerepelnek, amelyeket egyetlen cikk sem említ együtt. Keress cikket mindegyik párhoz!",
          explain: R`A Polgármestert és a Szakértőt egyik cikk sem említi együtt, ezért ez a pár a komplementer 11 élének egyike. A Kormány és a Klímaváltozás az 5-ös, a Vízügy és a Szakértő a 4-es, a Polgármester és a Vízügy a 2-es és a 10-es cikkben szerepel együtt. A komplementer él persze csak annyit mond, hogy <b>ebben az adatban</b> nem szerepeltek együtt.`
        },
        {
          type: "multi",
          q: "Melyik következtetés megalapozott az Árvízhét gráfjai alapján? (Több jó válasz is lehet.)",
          options: [
            "A Reggeli Hírlap és a Nyitott Szó gráfja azonos szerkezetű, de más szereplők körül szerveződik.",
            "A Vidéki Naplóban a Polgármester a középpont: minden másik szereplővel ő szerepel együtt.",
            "Egy 3 szereplős cikk egymaga 3 élt ad, ezért a sok szereplős cikkek „maguktól” sűrítik a gráfot.",
            "Az Esti Krónika Szakértő–Kormány éle azt mutatja, hogy a Szakértő támogatja a kormányt.",
            R`Az Esti Krónika gráfja ($\rho \approx 0{,}67$) sűrűbb, mint a teljes heti gráf ($\rho \approx 0{,}48$), tehát a lap szereplői szorosabban kapcsolódnak.`
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a szakasz „Mire vigyázz?” dobozára: élszabály, egy cikk = egy klikk, különböző méretű gráfok sűrűsége.",
          explain: R`Az első három a számokból következik: a két háromszög izomorf, de más csúcsokkal; a Vidéki Napló $K_{1,3}$ csillag; egy $k$ szereplős cikk $\binom k2$ élt ad. A Szakértő–Kormány él egy <b>bíráló</b> cikkből jön – az él együttes említés, nem vélemény. A sűrűség pedig függ a mérettől: a 4 csúcsú és a 7 csúcsú gráf sűrűsége nem hasonlítható össze közvetlenül.`
        },
        {
          type: "single", shuffle: true,
          q: "Az egyik lap egyetlen cikket ír, amely 5 szereplőt említ. A másik lap öt cikket ír, mindegyik 2 szereplőt említ, és nincs két egyforma pár. Hány éle van a két lap szereplőgráfjának?",
          options: ["10, illetve 5", "5, illetve 5", "4, illetve 5", "20, illetve 5"],
          answer: 0,
          hint: R`Egy cikk = egy klikk: egy $k$ szereplős cikk minden szereplőpárt összeköt.`,
          explain: R`Az 5 szereplős cikk egy $K_5$-öt ad: $\binom52 = 10$ él. Az öt 2 szereplős cikk 5 különböző élt ad. Egyetlen hosszú cikk tehát kétszer annyi élt hoz, mint öt rövid – az élek egy része a cikkek hosszáról szól, nem a lap szemléletéről (ezért javasolt pl. az $1/(k-1)$-es súlyozás). A 4 a csillag élszáma lenne, a 20 = $5 \cdot 4$ minden élt kétszer számol.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban két sűrű csoport látszik: Kormány–Vízügy–Szakértő–Klímaváltozás, illetve Polgármester–Lakók–Önkéntesek. Melyik szereplő köti össze a kettőt?",
          options: ["Polgármester", "Szakértő", "Klímaváltozás", "Önkéntesek"],
          answer: 0,
          hint: "Keresd azt a szereplőt a második csoportban, akinek az első csoportban is van szomszédja.",
          explain: R`A Polgármester a Kormánnyal és a Vízügygyel is szomszédos (2-es, 3-as, 10-es cikk), és a Lakókkal, az Önkéntesekkel is. A Lakóknak és az Önkénteseknek nincs szomszédja az első csoportban, a Szakértőnek és a Klímaváltozásnak pedig a másodikban. Ezért a nagy erősség (8) mellett a Polgármesternek összekötő szerepe is van – ezt az 5. fejezet centralitásmértékei pontosabban mérik.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh1-final": {
      title: "Fejezetzáró teszt – 1. Mi a hálózat?",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$V = \{a, b, c\}$, és az éleket így sorolták fel: $ab, ba, bc, ac$. Mennyi $m$?`,
          options: ["3", "4", "6", "2"],
          answer: 0,
          hint: "Az él rendezetlen pár, és az élek halmazt alkotnak.",
          explain: R`$ab = ba = \{a, b\}$, ezért ez egyetlen él. A különböző élek: $ab, bc, ac$, tehát $m = 3$ (ez egy háromszög). A 4 a felsorolás hossza, a 6 a fokszámösszeg ($2m$), a 2 pedig az $ab$-t és a $ba$-t is kihagyja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: $ab, bc, cd$. Szomszédos-e $a$ és $c$?`,
          options: [
            R`Nem, de $b$-n át eljuthatunk egyikből a másikba.`,
            R`Igen, mert $b$-n át össze vannak kötve.`,
            "Igen, ha a rajzon egymás mellé kerülnek.",
            "Nem, és egyikből a másikba el sem lehet jutni."
          ],
          answer: 0,
          hint: "Mi a különbség a „szomszédos” és az „elérhető” között?",
          explain: R`Két csúcs akkor szomszédos, ha <b>közvetlenül</b> él köti össze őket; $ac \notin E$. Elérhetők viszont: $a - b - c$ (ezekkel az utakkal a 2. fejezet foglalkozik). A rajz elhelyezése nem információ – két közel rajzolt pont nem feltétlenül szomszédos.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti lapgráfban két lap között akkor legyen él, ha legalább két közös szereplőjük van. Hány éle lesz?",
          options: ["3", "5", "6", "1"],
          answer: 0,
          hint: "RH: Ko, Vi, Po; EK: Vi, Sz, Kl, Ko; NY: La, Ön, Po; VN: Po, Vi, La, Ön. Számold meg mind a 6 lappár közös szereplőit!",
          explain: R`Legalább 2 közös: RH–EK (Ko, Vi), RH–VN (Vi, Po), NY–VN (La, Ön, Po) – 3 él. Az 5 a „legalább egy közös szereplő” szabály élszáma, a 6 a $K_4$, az 1 a „legalább három közös” szabályé (csak NY–VN). Ugyanabból az adatból egyetlen szabályváltoztatással más gráf lesz – ezért kell mindig kimondani az élszabályt.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti szereplőgráfban nincs él a Kormány és a Lakók között. Mit jelent ez?",
          options: [
            "Ebben a 12 cikkben nem szerepeltek együtt.",
            "A kormány nem foglalkozott a lakókkal az árvíz idején.",
            "A Kormány és a Lakók szemben állnak egymással.",
            "Más héten vagy más lapban sem fogják őket együtt említeni."
          ],
          answer: 0,
          hint: "Az él egy állítás – és a hiányzó él is csak az élszabály alapján értelmezhető. Milyen adatból készült a gráf?",
          explain: R`Az élszabály: „legalább egy cikkben együtt szerepelnek”. A hiányzó él tehát csak annyit mond, hogy a gyűjtött 12 cikkben nem voltak együtt – a megfigyelt adatról szól, nem a világról. Ellentétről sincs szó. Arról pedig, hogy más héten, más lapban vagy egy tévéhíradóban mi lesz, a gráf semmit sem mond – a hiányzó él nem bizonyíték.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik sorozat lehet egy egyszerű gráf fokszámsorozata?",
          options: ["(3, 3, 2, 2, 2)", "(3, 3, 1, 1)", "(4, 4, 4, 1, 1)", "(5, 3, 2, 2, 2)"],
          answer: 0,
          hint: R`A páros összeg szükséges, de nem elég. Nézd meg a legnagyobb fokszámot is: egyszerű gráfban $d(v) \le n - 1$, és a nagy fokú csúcsok „lefoglalják” a többieket.`,
          explain: R`A $(3, 3, 2, 2, 2)$ rajzolható: például egy ötszög egy húrral. A $(3, 3, 1, 1)$ összege páros, de a két 3-as fokú csúcs mindenkivel szomszédos, így az „1-esek” fokszáma legalább 2 lenne. A $(4, 4, 4, 1, 1)$ ugyanígy bukik el: a három 4-es fokú csúcs mind a két utolsóval szomszédos. Az $(5, 3, 2, 2, 2)$-ben 5 csúcsnál az 5-ös fok lehetetlen ($n - 1 = 4$). A páros fokszámösszeg tehát nem garancia.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy gráfnak 15 éle van, és minden csúcsának 3 a fokszáma. Hány csúcsa van?",
          options: ["10", "5", "15", "45"],
          answer: 0,
          hint: R`Kézfogási lemma: $\sum d(v) = 2m$. A bal oldal itt $3n$.`,
          explain: R`$3n = 2 \cdot 15 = 30$, tehát $n = 10$. Az 5 = $15/3$ elfelejti, hogy minden él két fokszámot növel. A 45 = $15 \cdot 3$ az élszámot keveri a csúcsszámmal, a 15 pedig az élszám maga.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 6 csúcsú egyszerű gráf szomszédsági mátrixában az elemek összege 18. Mennyi a gráf sűrűsége?",
          options: [R`$0{,}6$`, R`$0{,}25$`, R`$0{,}5$`, R`$1{,}2$`],
          answer: 0,
          hint: R`Az elemösszeg nem az élszám! Mi a kapcsolat a mátrix elemösszege és $m$ között? Utána: $\rho = m/\binom n2$.`,
          explain: R`Az elemösszeg $2m$, tehát $m = 9$. $\rho = 9/\binom62 = 9/15 = 0{,}6$. Az $1{,}2 = 18/15$ az elemösszeget veszi élszámnak (sűrűség nem is lehet 1-nél nagyobb). A $0{,}25 = 9/36$ ($m/n^2$) és a $0{,}5 = 18/36$ a cellák számával oszt, nem a lehetséges párokéval.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a gráf ábrázolásairól? (Több jó válasz is lehet.)",
          options: [
            "Egy nagy, ritka hálózatot érdemes szomszédsági listában tárolni.",
            "Egyszerű, irányítatlan gráf szomszédsági mátrixában a sorösszeg a fokszám.",
            R`Ha egy mátrixban $A_{23} = 1$, de $A_{32} = 0$, az nem egyszerű, irányítatlan gráf mátrixa.`,
            "A szomszédsági mátrix elemeinek összege az élszám.",
            "Ha átszámozzuk a csúcsokat, a mátrixszal együtt a gráf is megváltozik."
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a mátrix három tulajdonságára (szimmetria, főátló, sorösszeg) és a „melyik ábrázolás mikor?” szabályra.",
          explain: R`Ritka, nagy gráfnál a szomszédsági lista csak $2m$ bejegyzést tárol, a mátrix $n^2$ cellát. A sorösszeg a fokszám, és irányítatlan gráf mátrixa szimmetrikus – ha nem az, elírás vagy irányított gráf. Az elemösszeg viszont $2m$, nem $m$. Átszámozáskor a <b>mátrix</b> változik, a gráf (csúcsok és élek) nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfban $a$ és $b$ között 2 párhuzamos él fut, $b$-n van egy hurokél, és $b$–$c$ között is van egy él. Mi a fokszámsorozat?`,
          options: ["(5, 2, 1)", "(4, 2, 1)", "(3, 2, 1)", "(2, 1, 1)"],
          answer: 0,
          hint: "Párhuzamos élek külön-külön, a hurokél kétszer számít. Ellenőrizd: a fokszámösszeg legyen az élszám kétszerese!",
          explain: R`$d(b) = 2 + 2 + 1 = 5$ (két párhuzamos él, a hurok 2-vel, a $bc$ él), $d(a) = 2$, $d(c) = 1$. Összeg: $8 = 2 \cdot 4$ ✓. A $(4, 2, 1)$ a hurkot 1-nek számolja – összege páratlan, ez lehetetlen. A $(3, 2, 1)$ kihagyja a hurkot, a $(2, 1, 1)$ pedig egyszerű gráfnak veszi.`
        },
        {
          type: "single", shuffle: true,
          q: "Az Árvízhét súlyozott szereplőgráfjában mennyi az Önkéntesek fokszáma és erőssége?",
          options: ["fokszám 2, erősség 5", "fokszám 5, erősség 2", "fokszám 2, erősség 4", "fokszám 3, erősség 5"],
          answer: 0,
          hint: "Az Önkéntesek a 7, 8, 9 és 12-es cikkben szerepelnek. Kikkel, és hányszor?",
          explain: R`Szomszédok: Lakók (7, 8, 9: súly 3) és Polgármester (8, 12: súly 2). Fokszám 2, erősség $3 + 2 = 5$. A 4 az Önkéntesek cikkeinek száma – de a 8-as cikk két párt ad nekik. A „5 és 2” felcseréli a fokszámot és az erősséget.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a $K_{1,3}$ csillag komplementere?`,
          options: [
            "egy háromszög és egy izolált csúcs",
            R`$P_4$`,
            R`$K_{1,3}$ (önkomplementer)`,
            "az üres gráf"
          ],
          answer: 0,
          hint: "A középpont minden lehetséges élét felhasználta. Mi a helyzet a három levéllel egymás között?",
          explain: R`A középpont foka 3 = $n - 1$, így a komplementerben 0: izolált csúcs. A három levél egymással nem szomszédos, a komplementerben tehát mind a 3 pár él: háromszög. Ellenőrzés: $3 + 3 = 6 = \binom42$ ✓. Az önkomplementer 4 csúcsú gráf a $P_4$, nem a csillag. Az üres gráf a $K_4$ komplementere lenne.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy csillagnak 9 csúcsa van. Hány éle van, és mi a jelölése?",
          options: [
            R`8 él, $K_{1,8}$`,
            R`9 él, $K_{1,9}$`,
            R`36 él, $K_9$`,
            R`8 él, $K_{1,9}$`
          ],
          answer: 0,
          hint: R`A $K_{1,n}$-ben egy középpont és $n$ levél van; minden levél egy éllel kapcsolódik a középponthoz.`,
          explain: R`9 csúcs = 1 középpont + 8 levél, tehát $K_{1,8}$, és 8 éle van (levelenként egy). A $K_{1,9}$-nek 10 csúcsa lenne – a csillag csúcsszáma $n + 1$, nem $n$. A 36 = $\binom92$ a teljes gráf élszáma.`
        },
        {
          type: "single", shuffle: true,
          q: "A teljes heti lapgráfban (él, ha a két lapnak van közös szereplője) melyik lappár között NINCS él?",
          options: ["Esti Krónika – Nyitott Szó", "Reggeli Hírlap – Nyitott Szó", "Esti Krónika – Vidéki Napló", "Reggeli Hírlap – Vidéki Napló"],
          answer: 0,
          hint: "Az Esti Krónika szereplői: Vízügy, Szakértő, Klímaváltozás, Kormány. A Nyitott Szóéi: Lakók, Önkéntesek, Polgármester.",
          explain: R`Az Esti Krónika és a Nyitott Szó szereplőhalmaza diszjunkt – ez az egyetlen hiányzó él, a lapgráfnak $6 - 1 = 5$ éle van. RH–NY a Polgármester, EK–VN a Vízügy, RH–VN a Vízügy és a Polgármester révén össze van kötve. Ez a két lap a két szélső tudósítási minta: a szakértői magyarázat és az érintettek nézőpontja.`
        },
        {
          type: "single", shuffle: true,
          q: "A 2, 5, 8 és 10-es cikkből épített szereplőgráfnak 9 éle van, a teljes heti szereplőgráfnak 10. Melyik él hiányzik a négycikkesből?",
          options: ["Vízügy – Szakértő", "Kormány – Lakók", "Polgármester – Szakértő", "Klímaváltozás – Vízügy"],
          answer: 0,
          hint: "Melyik él jön olyan cikkből, amely nincs a 2, 5, 8, 10 között? A Kormány–Lakók párt egyik cikk sem említi együtt.",
          explain: R`A Vízügy–Szakértő él csak a 4-es cikkből (Esti Krónika, hétfő) jön. A többi teljes heti él már a négy cikkben megvan, mert a többi cikk csak ismétel egy-egy párt (ezek a súlyt növelik, az élszámot nem). A Kormány–Lakók, a Polgármester–Szakértő és a Klímaváltozás–Vízügy pár a teljes héten sem él – ezek a komplementerben vannak.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
