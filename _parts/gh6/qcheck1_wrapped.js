(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 6.1 */
    "gh6-61": {
      title: "Kvíz – 6.1 Háromszögek és klaszterezettség",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $AE$, $BC$, $CD$, $DE$. Mennyi az $A$ helyi klaszterezettsége, $C_A$?`,
          options: [R`$0{,}5$`, R`$0{,}75$`, R`$0{,}25$`, R`$0{,}19$`],
          answer: 0,
          hint: R`Írd fel $A$ szomszédait, és nézd végig az összes szomszédpárt. Hány pár képezhető 4 elemből, ha a sorrend nem számít?`,
          explain: R`$A$ szomszédai $B, C, D, E$ ($k_A = 4$). A $\binom42 = 6$ párból 3 van összekötve: $BC$, $CD$, $DE$ – tehát $T_A = 3$, és $C_A = 3/6 = 0{,}5$. A $0{,}75 = 3/4$ $k_i$-vel oszt, a $0{,}19 \approx 3/16$ $k_i^2$-tel – egyik sem a szomszédpárok száma. A $0{,}25 = 3/12$ $k_i(k_i-1)$-gyel oszt, vagyis a párokat sorrendben számolja ($\{B, C\}$ és $\{C, B\}$ ugyanaz a pár). Az $A$-ból induló négy él a nevezőbe tartozik, nem a számlálóba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf szomszédsági mátrixára $\operatorname{tr}(A^3) = 36$. Hány háromszög van a gráfban?`,
          options: [R`$6$`, R`$12$`, R`$18$`, R`$36$`],
          answer: 0,
          hint: R`Az $(A^3)_{ii}$ az $i$-ből induló és oda visszatérő 3 hosszú séták száma. Egy háromszög hány ilyen sétát ad összesen?`,
          explain: R`Egy háromszöget mindhárom csúcsából kétféle irányban lehet körbejárni: $3 \cdot 2 = 6$ zárt séta. Ezért a háromszögek száma $\operatorname{tr}(A^3)/6 = 36/6 = 6$ (ilyen például egy $K_4$ és egy tőle különálló gyémánt: $4 + 2$ háromszög). A $12$ csak 3-mal oszt – a két körüljárási irányt elfelejti; ez a $\sum_i T_i/3$ szabály keveredése a mátrixos képlettel. A $18$ csak 2-vel oszt: ez a $\sum_i T_i$, amelyben minden háromszög még háromszor szerepel. A $36$ a nyers nyom, osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában a Kormánynak és a Polgármesternek is 4 társa van, de $C_{\mathrm{Ko}} = 0{,}5$ és $C_{\mathrm{Po}} \approx 0{,}33$. Mit jelent ez?`,
          options: [
            R`A Polgármester társai közül kevesebb pár szerepel egymással is: a társai két külön világból jönnek.`,
            R`A Polgármester kevésbé fontos szereplő, mint a Kormány.`,
            R`A Polgármesternek kevesebb kapcsolata van, mint a Kormánynak.`,
            R`A Polgármester kevesebb cikkben szerepel, mint a Kormány.`
          ],
          answer: 0,
          hint: R`A $C_i$ nem a csúcs saját éleit méri, hanem valami mást a csúcs <b>környékén</b>. Mit?`,
          explain: R`A $C_i$ a szomszédpárok összekötött hányada. A Kormány társai ($\mathrm{Vi}, \mathrm{Po}, \mathrm{Sz}, \mathrm{Kl}$) között 6 párból 3 él fut, a Polgármesteréi ($\mathrm{Ko}, \mathrm{Vi}, \mathrm{La}, \text{Ön}$) között csak 2 ($\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{La}$–$\text{Ön}$): ő két, egymással alig érintkező kört köt össze. A „kevésbé fontos” a tipikus félreolvasás: a klaszterezettség a környék <b>sűrűsége</b>, nem centralitás – sőt, köztesség szerint éppen a Polgármester a legközpontibb (5.3). A kapcsolatok száma egyforma (4–4), a cikkszámról a $C_i$ pedig semmit sem mond.`
        },
        {
          type: "match",
          q: R`A gyémántgráfban (élek: $AB$, $AC$, $AD$, $BC$, $CD$) párosítsd a mennyiségeket az értékükkel!`,
          pairs: [
            [R`$C_A$`, "2/3"],
            [R`$C_B$`, "1"],
            [R`$\bar C$`, "5/6 ≈ 0,83"],
            [R`$C_\Delta$`, "0,75"],
            ["összefüggő hármasok (ékek) száma", "8"]
          ],
          hint: R`Fokszámok: $A$ és $C$ 3, $B$ és $D$ 2. Minden csúcsnál számold meg a szomszédpárokat és közülük az összekötötteket.`,
          explain: R`$A$ szomszédai $B, C, D$: a 3 párból $BC$ és $CD$ él, így $C_A = 2/3$ (ugyanígy $C_C = 2/3$). $B$ szomszédai $A, C$, és $AC$ él: $C_B = 1$ (ugyanígy $C_D = 1$). Átlag: $(2/3 + 1 + 2/3 + 1)/4 = 5/6 \approx 0{,}83$. Ékek: $\binom32 + \binom22 + \binom32 + \binom22 = 3 + 1 + 3 + 1 = 8$; a 2 háromszög $3 \cdot 2 = 6$ zárt hármast ad, így $C_\Delta = 6/8 = 0{,}75$. Itt is $\bar C > C_\Delta$: a két 2 fokú csúcs 1-et „szavaz”.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $BC$, $CD$, $CE$ (egy háromszög, és a $C$-n két „lógó” csúcs). Mennyi a $\bar C$ és a $C_\Delta$? (A $k_i \lt 2$ csúcsoknál a szokás szerint $C_i = 0$.)`,
          options: [
            R`$\bar C \approx 0{,}43$, $C_\Delta = 0{,}375$`,
            R`$\bar C \approx 0{,}43$, $C_\Delta = 0{,}125$`,
            R`$\bar C \approx 0{,}83$, $C_\Delta = 0{,}375$`,
            R`$\bar C = 0{,}375$, $C_\Delta \approx 0{,}43$`
          ],
          answer: 0,
          hint: R`Előbb a $C_i$-ket írd fel ($C$-nek 4 szomszédja van). A $C_\Delta$-hoz: hány ék van összesen, és hány zárt hármast ad egy háromszög?`,
          explain: R`$C_A = C_B = 1$, $C_C = 1/\binom42 = 1/6$, $C_D = C_E = 0$: $\bar C = (2 + 1/6)/5 = 13/30 \approx 0{,}43$. Ékek: $1 + 1 + 6 + 0 + 0 = 8$; zárt: $3 \cdot 1 = 3$, így $C_\Delta = 3/8 = 0{,}375$. A $0{,}125 = 1/8$ elhagyja a 3-as szorzót (a háromszög három zárt hármas). A $0{,}83 = 5/6$ az 1 fokú csúcsokat $C = 1$-nek veszi – pedig nekik nincs egyetlen szomszédpárjuk sem. Az utolsó opció a két mérőszámot cseréli fel.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubban (34 tag, 78 él) 45 háromszög és 528 összefüggő hármas van. Mennyi a globális klaszterezettség, $C_\Delta$?`,
          options: [R`$\approx 0{,}26$`, R`$\approx 0{,}085$`, R`$\approx 0{,}13$`, R`$\approx 0{,}57$`],
          answer: 0,
          hint: R`A $C_\Delta$ a zárt hármasok aránya az összes közül. Hány zárt hármas van egy háromszögben?`,
          explain: R`$C_\Delta = 3 \cdot 45/528 = 135/528 \approx 0{,}26$. A $0{,}085 = 45/528$ elhagyja a 3-as szorzót. A $0{,}13 = 135/1056$ a hármasokat sorrendben (kétszer) számolja. A $0{,}57$ az <b>átlagos</b> klaszterezettség, $\bar C$ – a kettőt nem szabad felcserélni. Hogy az átlag több mint kétszer akkora, azt a sok kis fokú, sűrű kis körbe tartozó tag okozza; a két vezető (16 és 17 társ) rengeteg ékje viszont nagyrészt nyitott ($C_1 \approx 0{,}15$, $C_{34} \approx 0{,}11$), és a $C_\Delta$-ban ezek nyomnak sokat.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Egy 2 fokú csúcs $C_i$-je csak $0$ vagy $1$ lehet.`,
            R`A $C_\Delta$ a $C_i$-k $\binom{k_i}{2}$-vel súlyozott átlaga.`,
            R`Ha $C_i = 1$, akkor $i$ a gráf egyik legfontosabb csúcsa.`,
            R`Egy 3 fokú csúcs klaszterezettsége lehet $0{,}5$.`,
            R`Egy 1 fokú csúcs $C_i$-je 1, hiszen a szomszédai „mind ismerik egymást”.`
          ],
          answer: [0, 1],
          hint: R`Írd fel, milyen törtek jöhetnek ki $T_i/\binom{k_i}2$ alakban $k_i = 1, 2, 3$ esetén. A súlyozott átlagnál gondolj arra, hogy a $C_\Delta$ minden <b>ékre</b> ad egy szavazatot.`,
          explain: R`2 fokú csúcsnak egyetlen szomszédpárja van: az vagy össze van kötve ($C = 1$), vagy nem ($C = 0$). A $C_\Delta = \sum_i T_i / \sum_i \binom{k_i}2$, és $T_i = C_i\binom{k_i}2$ – vagyis valóban súlyozott átlag (az Árvízhéten is $4/7$ jön ki így). A $C_i = 1$ gyakran épp a levélszerű, 2 fokú csúcsoké: a klaszterezettség sűrűség, nem fontosság. 3 fokú csúcsnál $C_i$ csak $0$, $1/3$, $2/3$ vagy $1$ lehet. Az 1 fokú csúcsnak nincs szomszédpárja; a szokás $C_i = 0$ (vagy értelmezetlen) – 1-nek venni felfelé torzítja a $\bar C$-t.`
        }
      ]
    },

    /* ------------------------------------------------ 6.2 */
    "gh6-62": {
      title: "Kvíz – 6.2 Homofília és asszortativitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában (élek: $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{La}$–$\mathrm{Po}$, $\mathrm{Po}$–$\text{Ön}$) az egyik csoport a „klímaszál”: $\{\mathrm{Sz}, \mathrm{Kl}\}$, a másik a többi öt szereplő. Mennyi a kategóriás asszortativitás, $r$?`,
          options: [R`$0{,}2$`, R`$0{,}7$`, R`$0{,}4$`, R`$0{,}265$`],
          answer: 0,
          hint: R`Három lépés: a belső élek aránya; az élvégarányok (a fokszámokból, nem a csúcsok számából); végül $r = (\text{belső} - \text{véletlen})/(1 - \text{véletlen})$.`,
          explain: R`Belső élek: $\mathrm{Sz}$–$\mathrm{Kl}$, és a másik csoport 6 éle ($\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{La}$–$\mathrm{Po}$, $\mathrm{Po}$–$\text{Ön}$): $7/10 = 0{,}7$. Élvégek: $k_{\mathrm{Sz}} + k_{\mathrm{Kl}} = 3 + 2 = 5$ a 20-ból, $a = (0{,}25;\ 0{,}75)$, véletlen szint $0{,}0625 + 0{,}5625 = 0{,}625$. $r = (0{,}7 - 0{,}625)/(1 - 0{,}625) = 0{,}075/0{,}375 = 0{,}2$ – gyenge homofília. A $0{,}7$ a nyers belső arány. A $0{,}265$ csúcsarányból ($2/7$, $5/7$) számolja a véletlen szintet ($29/49 \approx 0{,}59$) – de a $\mathrm{Sz}$ és a $\mathrm{Kl}$ kevesebb élvéget ad, mint a csúcsszámuk alapján járna. A $0{,}4 = 2 \cdot 0{,}7 - 1$ a két <b>egyforma</b> csoportra érvényes rövid képlet, itt nem használható.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hálózatban az élvégek 80%-a az A, 20%-a a B csoporté, és az élek 68%-a fut csoporton belül. Mennyi az $r$?`,
          options: [R`$0$`, R`$0{,}36$`, R`$0{,}68$`, R`$0{,}11$`],
          answer: 0,
          hint: R`Számold ki a véletlen szintet: minden csoport élvégarányát emeld négyzetre, és add össze <b>az összeset</b>.`,
          explain: R`Véletlen szint: $0{,}8^2 + 0{,}2^2 = 0{,}64 + 0{,}04 = 0{,}68$. A megfigyelt 68% pontosan ennyi, így $r = 0$: a csoportok úgy keverednek, mintha az élek vakon kötnék össze a csúcsokat. A $0{,}68$ a nyers arány – azért magas, mert az A csoport nagy. A $0{,}36 = 2 \cdot 0{,}68 - 1$ a két egyforma csoportra szóló képlet. A $0{,}11 \approx (0{,}68 - 0{,}64)/(1 - 0{,}64)$ elfelejti a kis csoport $a_B^2$ tagját. Figyeld meg: $r = 0$, pedig az élek több mint kétharmada belső – az $r = 0$ nem azt jelenti, hogy nincs él a csoportokon belül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két egyforma csoport van ($a_1 = a_2 = \tfrac12$), és az élek 30%-a fut csoporton belül. Mennyi az $r$, és mit jelent?`,
          options: [
            R`$r = -0{,}4$: heterofília, a különbözők kapcsolódnak inkább`,
            R`$r = 0{,}3$: gyenge homofília`,
            R`$r = 0{,}4$: mérsékelt homofília`,
            R`$r = -0{,}2$: enyhe heterofília`
          ],
          answer: 0,
          hint: R`Mennyi itt a véletlen szint? A 30% e fölött vagy alatt van? És mivel kell osztani a különbséget?`,
          explain: R`Véletlen szint: $\tfrac14 + \tfrac14 = 0{,}5$. $r = (0{,}3 - 0{,}5)/(1 - 0{,}5) = -0{,}4$ – vagy a rövid képlettel $2 \cdot 0{,}3 - 1 = -0{,}4$. Negatív: kevesebb a belső él, mint véletlenül, ez a <b>heterofília</b> (diszasszortatív keveredés). A $0{,}3$ a nyers belső arány. A $0{,}4$ előjelhibás. A $-0{,}2 = 0{,}3 - 0{,}5$ elhagyja a nevezőt – a különbséget a lehetséges legnagyobb különbséghez ($1 - 0{,}5$) kell mérni.`
        },
        {
          type: "match",
          q: R`Párosítsd a gráfot a fokszám-asszortativitásával, $r_k$-val!`,
          pairs: [
            ["csillag 5 levéllel", "−1"],
            [R`$K_4$ és egy tőle különálló él`, "+1"],
            [R`6 hosszú kör ($C_6$)`, "nem értelmezhető"],
            ["4 csúcsú út (1–2–3–4)", "−0,5"],
            ["5 csúcsú út (1–2–3–4–5)", "−1/3"]
          ],
          hint: "Minden élt írj fel mindkét irányban fokszámpárként. Ki áll párban kivel: a nagy a kicsivel, vagy a nagy a naggyal? És mi van, ha minden fokszám egyforma?",
          explain: R`Csillag: minden pár $(5, 1)$ vagy $(1, 5)$ – a nagy mindig a kicsivel: $-1$. $K_4$ + él: a párok $(3, 3)$ és $(1, 1)$ – a nagy a naggyal, a kicsi a kicsivel: $+1$. $C_6$: minden fokszám 2, nincs szórás, a korreláció <b>nem értelmezhető</b> (nem 0 és nem 1 – ez a tipikus hiba). A 4 csúcsú úton a 6 pár $-0{,}5$-öt ad, az 5 csúcsún a 8 pár $-1/3$-ot: minél hosszabb az út, annál több a $(2, 2)$ pár, és annál gyengébb a diszasszortativitás.`
        },
        {
          type: "single", shuffle: true,
          q: R`A barátsággráfban (élek: $AB$, $AC$, $BC$, $CD$; fokszámok $2, 2, 3, 1$) mennyi a fokszám-asszortativitás, $r_k$?`,
          options: [
            R`$r_k \approx -0{,}71$: diszasszortatív`,
            R`$r_k \approx +0{,}71$: asszortatív`,
            R`$r_k \approx -0{,}87$: diszasszortatív`,
            R`nem értelmezhető, mert $A$ és $B$ fokszáma egyenlő`
          ],
          answer: 0,
          hint: R`8 párod lesz (4 él, mindkét irányban). Elég az első oszlop átlaga és az eltérések: a második oszlop ugyanazokat a számokat tartalmazza.`,
          explain: R`A párok: $(2,2)$ kétszer ($AB$ mindkét irányban), $(2,3)$ és $(3,2)$ kétszer-kétszer ($AC$, $BC$), $(3,1)$ és $(1,3)$ ($CD$). Átlag: $18/8 = 9/4$. Szorzatösszeg $-5/2$, négyzetösszeg $7/2$: $r_k = -5/7 \approx -0{,}71$ – diszasszortatív, mert a 3 fokú $C$ az 1 fokú $D$-hez is kapcsolódik. A $-0{,}87$ akkor jön ki, ha minden élt csak <b>egy irányban</b> írsz fel ($(2,2), (2,3), (2,3), (3,1)$) – ez az eredmény a felírás sorrendjétől függ. A „nem értelmezhető” csak akkor igaz, ha <b>minden</b> fokszám egyenlő; két egyforma fokszám még nem baj. A $+0{,}71$ előjelhibás.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`$r = 0$ mellett is lehet az élek többsége csoporton belüli.`,
            R`A véletlen szinthez ($\sum_g a_g^2$) az élvégek arányát kell négyzetre emelni, nem a csúcsokét.`,
            R`Ha az élek 80%-a csoporton belül fut, a hálózat biztosan homofil.`,
            R`A politikai blogok erős homofíliája ($r \approx 0{,}81$) azt mutatja, hogy a linkelt blogok hatottak egymás nézeteire.`,
            R`A fokszám-asszortativitáshoz a csúcsok fokszámát kell korrelálni valamilyen csúcstulajdonsággal, $n$ adatponttal.`
          ],
          answer: [0, 1],
          hint: "Mindegyiknél kérdezd meg: mihez képest mérünk, és mi az adatpont – csúcs vagy élvég? A blogos állításnál: mi derülhet ki egyetlen pillanatfelvételből?",
          explain: R`Az $r$ a véletlen szinthez mér: ha egy csoport nagy, a belső arány véletlenül is magas (80/20-as élvégaránynál 68%). A véletlen szint az <b>élvégarányból</b> jön, mert a sok kapcsolatú csúcs sok élvéget ad. A „80% → biztosan homofil” a nyers arány buktatója: a 90/10-es élvégaránynál a 82% is csak a véletlen. A homofíliából nem következik befolyás: a hasonlók <b>választhatják</b> is egymást (szelekció), és egy pillanatfelvételből a kettő nem választható szét. A fokszám-asszortativitás az <b>élek két végét</b> korrelálja egymással: $2m$ pár, nem $n$ csúcs.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy diák a 4 csúcsú út (1–2–3–4) fokszám-asszortativitásához minden élt csak <b>egy irányban</b> ír fel, 3 párral. Mi a baj ezzel?`,
          options: [
            R`Az eredmény a felírás sorrendjétől függ: $(1,2), (2,2), (2,1)$ sorrenddel $-0{,}5$ jön ki, de $(2,1), (2,2), (2,1)$ sorrenddel az első oszlop csupa 2, és a korreláció nem is értelmezhető.`,
            R`Semmi: a korreláció szimmetrikus, ezért bármilyen sorrendben ugyanaz jön ki.`,
            R`Csak annyi, hogy kevesebb az adatpont, ezért az eredmény pontatlanabb, de mindig $-0{,}5$ körül lesz.`,
            R`Így a csúcsok fokszámát korrelálja, nem az élek végeit.`
          ],
          answer: 0,
          hint: R`Próbáld ki: írd az $12$ és a $34$ élt is úgy, hogy a 2 fokú csúcs álljon elöl. Mi lesz az első oszlop szórása?`,
          explain: R`Az irányítatlan élnek nincs „első” vége. Ha egy irányban írod fel, a két oszlop tartalma a választásodtól függ: $(1,2), (2,2), (2,1)$ mellett $r = -0{,}5$, $(2,1), (2,2), (2,1)$ mellett az első oszlop $(2, 2, 2)$, szórása 0, a korreláció értelmezhetetlen. Ezért kell minden élt <b>mindkét</b> irányban felvenni (6 pár): akkor a két oszlop szerepe szimmetrikus, és $r_k = -0{,}5$. A korreláció szimmetrikus az oszlopok cseréjére, de nem arra, hogy soronként mit írsz melyik oszlopba. A párok itt is élvégek, nem csúcsok – a csúcsonkénti korreláció más hiba.`
        }
      ]
    },

    /* ------------------------------------------------ 6.3 */
    "gh6-63": {
      title: "Kvíz – 6.3 A gyenge kötések ereje",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BE$, $CE$, $DE$, $DF$. A triadikus zárás alapján melyik hiányzó él létrejötte a legvalószínűbb?`,
          options: [R`$AE$`, R`$BC$`, R`$CD$`, R`$AF$`],
          answer: 0,
          hint: "Minden jelölt párnál számold meg a közös szomszédokat.",
          explain: R`Közös szomszédok: $A$–$E$: $B, C, D$ (3); $B$–$C$: $A, E$ (2); $C$–$D$: $A, E$ (2); $A$–$F$: $D$ (1). A legtöbb közös szomszéddal rendelkező, még nem összekötött pár az első jelölt: $AE$. A $BC$ és a $CD$ is jó jelölt, csak kevésbé. Az $AF$-nek egyetlen közös szomszédja van – a közös szomszédok <b>száma</b> számít, nem az, hogy van-e egyáltalán.`
        },
        {
          type: "set",
          q: R`Az Árvízhét gráfjában (élek: $\mathrm{Ko}$–$\mathrm{Vi}$, $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Sz}$–$\mathrm{Kl}$, $\mathrm{Sz}$–$\mathrm{Ko}$, $\mathrm{Kl}$–$\mathrm{Ko}$, $\mathrm{La}$–$\text{Ön}$, $\mathrm{La}$–$\mathrm{Po}$, $\mathrm{Po}$–$\text{Ön}$) jelöld ki azokat a hiányzó párokat, amelyeknek <b>pontosan egy</b> közös társuk van!`,
          items: [R`$\mathrm{Ko}$–$\mathrm{La}$`, R`$\mathrm{Vi}$–$\text{Ön}$`, R`$\mathrm{Po}$–$\mathrm{Kl}$`, R`$\mathrm{Vi}$–$\mathrm{Kl}$`, R`$\mathrm{Po}$–$\mathrm{Sz}$`, R`$\mathrm{Sz}$–$\mathrm{La}$`, R`$\mathrm{Kl}$–$\text{Ön}$`],
          answer: [R`$\mathrm{Ko}$–$\mathrm{La}$`, R`$\mathrm{Vi}$–$\text{Ön}$`, R`$\mathrm{Po}$–$\mathrm{Kl}$`],
          hint: R`A gráf két „kör”, a Polgármester köti össze őket. Egy párnak közös társa csak olyan szereplő lehet, aki mindkettőjükkel szerepel.`,
          explain: R`$\mathrm{Ko}$–$\mathrm{La}$ és $\mathrm{Vi}$–$\text{Ön}$: a közös társ a Polgármester; $\mathrm{Po}$–$\mathrm{Kl}$: a Kormány – mindhárom 1. A $\mathrm{Vi}$–$\mathrm{Kl}$ párnak 2 közös társa van ($\mathrm{Ko}$, $\mathrm{Sz}$), a $\mathrm{Po}$–$\mathrm{Sz}$-nek is 2 ($\mathrm{Ko}$, $\mathrm{Vi}$) – ők a triadikus zárás első jelöltjei. A $\mathrm{Sz}$–$\mathrm{La}$ és a $\mathrm{Kl}$–$\text{Ön}$ párnak nincs közös társa: két lépésnél messzebb vannak, zárással nem kerülhetnek kapcsolatba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét gráfjában $N(\mathrm{Vi}) = \{\mathrm{Ko}, \mathrm{Po}, \mathrm{Sz}\}$ és $N(\mathrm{Sz}) = \{\mathrm{Vi}, \mathrm{Kl}, \mathrm{Ko}\}$. Mennyi a $\mathrm{Vi}$–$\mathrm{Sz}$ él szomszédsági átfedése, $O_{\mathrm{Vi},\mathrm{Sz}}$?`,
          options: [R`$1/3$`, R`$1/5$`, R`$1/2$`, R`$1/4$`],
          answer: 0,
          hint: R`Számláló: a közös szomszédok. Nevező: a két szomszédhalmaz uniója – de mit kell kivenni belőle?`,
          explain: R`Közös szomszéd: $\{\mathrm{Ko}\}$. Unió a két végpont nélkül: $\{\mathrm{Ko}, \mathrm{Po}, \mathrm{Kl}\}$. $O = 1/3$. Az $1/5$ a nevezőben hagyja a két végpontot ($\mathrm{Vi}$, $\mathrm{Sz}$) – így az átfedés sosem érhetné el az 1-et. Az $1/2$ csak az egyik végpont többi szomszédjával ($\mathrm{Ko}, \mathrm{Po}$) oszt. Az $1/4$ a két „többi szomszéd” halmaz méretét összeadja ($2 + 2$), és a közös $\mathrm{Ko}$-t kétszer számolja – unió kell, nem összeg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $12$, $23$, $34$, $45$, $51$ (egy 5 hosszú kör) és $56$. Melyik él helyi híd, és melyik híd?`,
          options: [
            R`Mind a 6 él helyi híd, de csak az $56$ híd.`,
            R`Csak az $56$ helyi híd, és az híd is.`,
            R`Egyik sem helyi híd, mert a gráf összefüggő.`,
            R`Mind a 6 él helyi híd és híd is.`
          ],
          answer: 0,
          hint: R`Helyi híd: a két végpontnak nincs közös szomszédja. Híd: a törlése szétszakítja a gráfot. Van-e háromszög a gráfban?`,
          explain: R`A gráfban nincs háromszög, így egyik él két végpontjának sincs közös szomszédja: mind a 6 él helyi híd. A kör élei viszont nem hidak – bármelyiket törölve a kör többi részén kerülővel el lehet jutni (pl. $12$ törlése után $1$–$5$–$4$–$3$–$2$). Az $56$ törlése a 6-ost elszakítja: ez híd is. A második opció a tipikus csere (híd ↔ helyi híd): minden híd helyi híd, de fordítva nem. A „gráf összefüggő” nem számít – a helyi híd a közös szomszédokról szól.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek erős (E) és gyenge (gy) kötésekkel: $AB$ E, $AC$ E, $BC$ gy, $CD$ E, $DE$ E, $CE$ gy, $EF$ gy. Melyik csúcs sérti az erős triadikus zárást?`,
          options: [R`$C$`, R`$A$`, R`$D$`, R`$E$`],
          answer: 0,
          hint: "Minden csúcsnál írd fel csak az erős kötésű szomszédokat, és nézd meg, össze vannak-e kötve egymással (bármilyen éllel).",
          explain: R`$C$ erős szomszédai: $A$ és $D$ – köztük nincs él, ez a sértés. $A$ erős szomszédai $B$ és $C$, köztük van ($BC$, gyenge – az is elég). $D$ erős szomszédai $C$ és $E$, köztük a gyenge $CE$ él fut: rendben. $E$-nek csak egy erős kötése van ($D$), $F$-nek egy sincs – nekik nincs mit ellenőrizni. Ha az $A$-t vagy a $D$-t választottad, valószínűleg csak erős élt fogadtál el összekötésnek – a feltételhez bármilyen él megfelel. Az $E$ gyenge $EF$ éle nem számít: a feltétel csak az erős szomszédpárokról szól.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $A$–$B$ él helyi híd. Melyik feltevésből következik Granovetter tétele szerint, hogy gyenge kötés?`,
          options: [
            R`$A$ teljesíti az erős triadikus zárást, és legalább két erős kötése van.`,
            R`$A$ teljesíti az erős triadikus zárást.`,
            R`$A$-nak legalább két erős kötése van.`,
            R`Az $A$–$B$ él átfedése 0.`
          ],
          answer: 0,
          hint: R`Gondold végig a bizonyítást: ha $A$–$B$ erős lenne, melyik másik csúcs lenne a közös szomszéd, és miért kellene élnek futnia?`,
          explain: R`A bizonyítás: ha $A$–$B$ erős, és $A$-nak van egy másik erős kötése $C$-vel, akkor az erős triadikus zárás miatt $B$–$C$ él van, így $C$ közös szomszéd – ellentmondás. Mindkét feltétel kell. Csak erős triadikus zárással: ha $A$-nak egyetlen erős kötése van, az lehet maga az $A$–$B$ helyi híd, nincs ellentmondás. Csak két erős kötéssel: zárás nélkül a $B$–$C$ él hiányozhat. Az „átfedés 0” egyszerűen azt mondja, hogy az él helyi híd – ez a kiindulás, nem a gyengeség oka.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Onnela és munkatársai mobilhálózatán a gyenge élek előbbi törlésekor az óriáskomponens hirtelen szétesett.`,
            R`A karateklubban a két tábor közti élek átlagsúlya ($2{,}27$) kisebb, mint a táborokon belülieké ($3{,}07$).`,
            R`A gyenge kötés általában fontosabb, mint az erős.`,
            R`Ha egy pillanatfelvételen sok háromszöget látsz, abból kiderül, hogy triadikus zárással keletkeztek.`,
            R`A karateklub súlyai bebizonyítják Granovetter tételét.`
          ],
          answer: [0, 1],
          hint: "Melyik állítás egy mérést ír le, és melyik általánosít túl? Mi kell ahhoz, hogy egy él keletkezésének sorrendjét lásd?",
          explain: R`Onnela és mtsai (2007) kb. 4,6 millió előfizetőn mérték: a gyenge élek törlése gyorsan szétszedi a hálózatot, az erőseké csak lassan zsugorítja. A karateklubban a táborokat összekötő 11 él átlagsúlya $2{,}27$, a belsőké $3{,}07$, és az átfedésük is kisebb. A gyenge kötés nem „fontosabb”, hanem <b>másra</b> jó: új információt és elérést ad, az erős bizalmat és támogatást. A háromszög a végállapot: hogy előbb nyitott hármas volt-e, csak időbélyeges élekből dönthető el (az Árvízhéten pl. a $\mathrm{Ko}$–$\mathrm{Po}$ él egy háromszereplős cikkel, „gyárilag” jött). A tétel egy idealizált feltevésből következik; egy 78 élű, zajos adat csak azt mutatja, mennyire áll közel hozzá a valóság.`
        }
      ]
    },

}; return Q; })();
