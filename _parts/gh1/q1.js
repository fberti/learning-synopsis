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
