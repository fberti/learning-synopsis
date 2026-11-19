    /* ------------------------------------------------ 8.1 */
    "gh8-81": {
      title: "Kvíz – 8.1 Mi a közösség?",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $BC$, $CD$, $DE$. Mennyi a $c = \{A, B, C\}$ csoport $L_c$, $K_c$ és $d_c$ értéke?`,
          options: [
            R`$L_c = 3$, $K_c = 2$, $d_c = 8$`,
            R`$L_c = 3$, $K_c = 2$, $d_c = 6$`,
            R`$L_c = 3$, $K_c = 2$, $d_c = 5$`,
            R`$L_c = 3$, $K_c = 1$, $d_c = 7$`
          ],
          answer: 0,
          hint: R`Számold meg külön a mindkét végükkel bent lévő éleket és a pontosan egy végükkel bent lévőket. A fokszámösszegnél minden csúcs teljes fokszáma számít.`,
          explain: R`Belül: $AB$, $AC$, $BC$, tehát $L_c = 3$. Kifelé: $AD$ és $CD$, tehát $K_c = 2$. A fokszámok $k_A = 3$, $k_B = 2$, $k_C = 3$, így $d_c = 8 = 2 \cdot 3 + 2$. A $d_c = 6$ a $2L_c$: kihagyja a kifelé futó éleket. Az $5 = L_c + K_c$ a belső éleket csak egyszer számolja, pedig mindkét végüknél benne vannak a fokszámban. A $K_c = 1$ a kifelé futó élek helyett a külső szomszédokat számolja: mindkét él a $D$-be fut, de ez két él.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 15 élű gráfot három közösségre bontasz. A $K_c$ értékek: 4, 2 és 6. Hány él fut összesen közösségeken belül?`,
          options: [R`$9$`, R`$3$`, R`$6$`, R`$12$`],
          answer: 0,
          hint: R`Egy közösségek között futó él hány $K_c$-ben jelenik meg?`,
          explain: R`Minden vágott él két közösség $K_c$-jében is szerepel, ezért a vágott élek száma $(4 + 2 + 6)/2 = 6$, a belső éleké $15 - 6 = 9$. A $3 = 15 - 12$ a vágott éleket kétszer vonja le. A $6$ a vágott élek száma, nem a belsőké. A $12$ a $\sum_c K_c$ – ez sem az, amit kérdeztünk.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 20 élű gráfban egy csoportnak 5 belső éle van, a fokszámösszege $d_c = 14$. Mennyivel van a belső élek aránya a véletlen szint fölött?`,
          options: [R`$0{,}1275$`, R`$-0{,}24$`, R`$-0{,}1$`, R`$0{,}25$`],
          answer: 0,
          hint: R`A véletlen szint $(d_c/2m)^2$. Hány élvég van összesen a gráfban?`,
          explain: R`Belső arány $5/20 = 0{,}25$, véletlen szint $(14/40)^2 = 0{,}35^2 = 0{,}1225$, a többlet $0{,}1275$. A $-0{,}24$ a $d_c/m$-mel számol: $(14/20)^2 = 0{,}49$ – de élvégből $2m$ van. A $-0{,}1$ elhagyja a négyzetet ($14/40 = 0{,}35$); pedig az él mindkét végének a csoportba kell esnie. A $0{,}25$ csak a belső arány, a véletlen szintet nem vonja le.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az Árvízhéten öt különböző 2 élű vágás is van; a vágott élek száma nem tud dönteni köztük.`,
            R`Egy magányos csúcs (pl. $\{\mathrm{Kl}\}$) többlete negatív: belső éle nincs, a véletlen szint viszont pozitív.`,
            R`Az a legjobb felbontás, amelyben a legkevesebb él fut közösségek között.`,
            R`A nagyobb csoportnak több a belső éle, ezért mindig erősebb közösség, mint egy kisebb.`,
            R`A „mindenki egy csoportban” felbontás többlete 0.`
          ],
          answer: [0, 1, 4],
          hint: R`Mit nyer a „semmit sem vágunk” felbontás a vágott élek mércéjén? És mihez mérjük a belső élek számát?`,
          explain: R`Igaz: a legkisebb vágás 2 él, és ilyen az $\{\mathrm{Kl}\}$, $\{\mathrm{La}\}$, $\{\text{Ön}\}$, $\{\mathrm{La}, \text{Ön}\}$ és $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$ levágása. Igaz: $\{\mathrm{Kl}\}$-re $0 - (2/20)^2 = -0{,}01$. Igaz: egy csoportnál $L/m = 1$ és a véletlen szint $(2m/2m)^2 = 1$. Hamis a „kevés vágott él” mérce: a győztes a semmit sem vágó felbontás vagy egy csúcs lecsípése. Hamis a méretes állítás is: a nagyobb csoportnak a véletlen szint is többet „ad” – az Árvízhéten a 4 fős és a 3 fős csoport többlete egyaránt $0{,}14$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hányféleképpen bontható csoportokra 4 csúcs (a csoportok sorrendje nem számít, üres csoport nincs)?`,
          options: [R`$15$`, R`$16$`, R`$24$`, R`$8$`],
          answer: 0,
          hint: R`Csoportosítsd a felbontásokat a csoportméretek szerint: 4; 3 + 1; 2 + 2; 2 + 1 + 1; 1 + 1 + 1 + 1.`,
          explain: R`$1 + 4 + 3 + 6 + 1 = 15$ (ez a 4. Bell-szám; a sorozat 1, 2, 5, 15, 52, 203, 877). A $16 = 2^4$ azt számolja, hányféleképpen lehet minden csúcsot két címkézett csoport egyikébe tenni – ebben a címkék cseréje mást ad, és egy csoport üres is lehet. A $24 = 4!$ a sorbarendezések száma. A $8 = 2^3$ a „hol vágom el a sort” felbontások száma, ha a csúcsok egy sorban állnak – de a felbontásnál nincs sorrend. Ugyanez a gyors növekedés miatt nem próbálható ki minden felbontás 34 csúcsra ($\approx 2 \cdot 10^{28}$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklub két tábora (17–17 tag): a 78 élből 11 fut a táborok között, a táborok fokszámösszege 81 és 75. Mennyi a belső élek arányának többlete a véletlen szint fölött?`,
          options: [R`$\approx 0{,}358$`, R`$\approx 0{,}859$`, R`$\approx 0{,}72$`, R`$\approx -0{,}141$`],
          answer: 0,
          hint: R`Három lépés: belső arány, a két tábor véletlen szintje ($2m = 156$), különbség.`,
          explain: R`Belül $67/78 \approx 0{,}859$. Véletlen szint $(81/156)^2 + (75/156)^2 \approx 0{,}270 + 0{,}231 = 0{,}501$. Többlet $\approx 0{,}358$. A $0{,}859$ csak a belső arány. A $0{,}72$ a 6.2 kategóriás asszortativitása: ott a többletet még $1 - 0{,}501$-gyel osztottuk. A $-0{,}141$ elhagyja a négyzetet: $81/156 + 75/156 = 1$ – a négyzet nélkül a véletlen szint mindig 1 lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy algoritmus a karateklubon mindenkit a valódi táborába sorol, kivéve a 9-es tagot. Mi a helyes értelmezés?`,
          options: [
            R`Nem feltétlenül hiba: a 9-es barátainak többsége az elnök körében van, a döntése a hálózaton kívüli okból született.`,
            R`Az algoritmus hibás: a valódi kettéválás a tökéletes mérce.`,
            R`A 9-es tagot ki kell hagyni az adatból, mert zavarja a mérést.`,
            R`Ez azt mutatja, hogy a karateklubnak nincs közösségszerkezete.`
          ],
          answer: 0,
          hint: R`Mit lát az algoritmus – a barátságokat vagy a tag döntésének okát?`,
          explain: R`A kettéválás társadalmi esemény, nem a hálózat tulajdonsága. Zachary szerint a 9-es az edzővel tartott, mert három hétre állt a fekete öves vizsgájától – a barátai viszont inkább az elnök körében voltak. Az algoritmus a hálózatot látja, és a szerkezet szerint jól sorolta be. Ezért a „valódi” címke egy lehetséges mérce, nem a tökéletes. Az adat megcsonkítása nem megoldás, és egy tagnyi eltérés ($33/34$) éppen erős közösségszerkezetet jelez.`
        }
      ]
    },

    /* ------------------------------------------------ 8.2 */
    "gh8-82": {
      title: "Kvíz – 8.2 A Girvan–Newman-algoritmus",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az $1$–$2$–$3$–$4$–$5$ úton mennyi a $2$–$3$ él köztessége, $b(2\text{–}3)$?`,
          options: [R`$6$`, R`$12$`, R`$3$`, R`$5$`],
          answer: 0,
          hint: R`Egy úton minden párt egyetlen legrövidebb út köt össze. Mely párok útja megy át a 2–3 élen? Az él két oldalán hány csúcs van?`,
          explain: R`A 2–3 él egyik oldalán $\{1, 2\}$, a másikon $\{3, 4, 5\}$ van: $2 \cdot 3 = 6$ pár útja megy át rajta. A $12$ a párokat kétszer számolja ($(s, t)$ és $(t, s)$) – irányítatlan gráfban ez ugyanaz a pár. A $3$ a 2-es <b>csúcs</b> köztessége ($\{1\} \times \{3, 4, 5\}$): mi élt törlünk, nem csúcsot. Az $5 = 2 + 3$ összeadja az oldalak méretét szorzás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`A „csokornyakkendő” élei: $AB$, $AC$, $BC$, $CD$, $CE$, $DE$. Mennyi az élköztességek összege, $\sum_e b(e)$?`,
          options: [R`$14$`, R`$10$`, R`$28$`, R`$6$`],
          answer: 0,
          hint: R`Nem kell élenként számolni: minden legrövidebb út annyi élen megy át, amilyen hosszú. Add össze a csúcspárok távolságát!`,
          explain: R`$\sum_e b(e) = \sum_{s \lt t} d(s, t)$. A 10 párból 6 szomszédos (távolság 1), a maradék 4 ($AD$, $AE$, $BD$, $BE$) a $C$-n át 2 lépés: $6 + 8 = 14$. Élenként: $AB$ és $DE$ 1-1, a $C$-hez futó négy él 3-3: $1 + 1 + 4 \cdot 3 = 14$ ✓. A $10$ a párok száma – ez csak akkor lenne jó, ha minden pár szomszédos lenne. A $28$ rendezett párokkal számol. A $6$ az élek száma.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten (súly nélkül) az első törölt él a $\mathrm{Ko}$–$\mathrm{Po}$ (köztessége 7,5). Mi a Girvan–Newman második lépése?`,
          options: [
            R`A $\mathrm{Vi}$–$\mathrm{Po}$ törlése: a köztessége újraszámolva 12.`,
            R`A $\mathrm{Po}$–$\mathrm{La}$ törlése: az eredeti sorrendben 5-tel ő a következő.`,
            R`A $\mathrm{Po}$ csúcs törlése: neki a legnagyobb a köztessége.`,
            R`A $\mathrm{Ko}$–$\mathrm{Kl}$ törlése: köztessége 4,5.`
          ],
          answer: 0,
          hint: R`Mi történik a csoportközi forgalommal, ha a két oldalt összekötő két élből az egyik eltűnik? És mit ír elő az algoritmus 3. lépése?`,
          explain: R`Minden törlés után újraszámoljuk a köztességeket. A $\mathrm{Ko}$–$\mathrm{Po}$ után a $\mathrm{Vi}$–$\mathrm{Po}$ maradt az egyetlen él a $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ és a $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$ között, ezért a $4 \cdot 3 = 12$ csoportközi pár mind rajta megy át: 4,5-ről 12-re ugrik. Törlése után a gráf a két csoportra esik szét. A $\mathrm{Po}$–$\mathrm{La}$ az újraszámolás elhagyásából jön – rossz helyen vágnánk. A csúcstörlés a $\mathrm{Po}$-t is elveszítené. A $\mathrm{Ko}$–$\mathrm{Kl}$ a régi 4,5-ös érték, újraszámolva csak 3.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két 10 csúcsú klikket két él köt össze (különböző csúcspárok között). Mennyi a két összekötő él köztessége, és mennyi az egyik törlése után a megmaradóé?`,
          options: [
            R`mindkettő $50$; a törlés után a megmaradó $100$`,
            R`mindkettő $100$; a törlés után is $100$`,
            R`mindkettő $50$; a törlés után is $50$`,
            R`mindkettő $100$; a törlés után $200$`
          ],
          answer: 0,
          hint: R`Hány csoportközi pár van, és hogyan oszlik meg a forgalmuk a két él között, ha a helyzet szimmetrikus?`,
          explain: R`$10 \cdot 10 = 100$ csoportközi pár van; a szimmetria miatt pontosan fele-fele jut a két élre: 50–50 (a klikkeken belüli élek legfeljebb 6-ot kapnak). Az egyik törlése után mind a 100 pár a másikon megy át – ezért kell újraszámolni. A „törlés után is 50” éppen az újraszámolás elhagyása. A 100–100 és a 200 rendezett párokkal számol: minden pár kétszer szerepel.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Girvan–Newman-algoritmusra? (Több jó válasz is lehet.)",
          options: [
            R`Minden törlés után újra kell számolni az összes él köztességét.`,
            R`Egy egész felbontássorozatot (dendrogramot) ad, nem egyetlen felbontást.`,
            R`Mindig két csoportnál áll meg, az első kettéesésnél.`,
            R`Lépésenként a legnagyobb köztességű csúcsot törli.`,
            R`Egy lógó, egyetlen éllel kötött csúcs éle is kaphat nagy köztességet.`
          ],
          answer: [0, 1, 4],
          hint: R`Gondold végig az algoritmus lépéseit: mit töröl, mikor számol, és meddig fut?`,
          explain: R`Igaz az újraszámolás (a törlés átrendezi a forgalmat), és igaz, hogy dendrogramot ad: 1, 2, 3, … csoportos szinteket – a szintet utólag, pl. a modularitással választjuk ki. Igaz a lógó csúcs is: a két háromszög + 7-es csúcs gráfban az 1–7 él köztessége 6 (a 7-es mind a 6 társa ezen át érhető el). Hamis, hogy mindig két csoportnál áll meg: addig fut, amíg van él, és a legjobb szint lehet több csoportos is (a karateklubon 5). Hamis a csúcstörlés: élt törlünk, különben a csúcsot is elveszítenénk.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két háromszög + híd gráfon (élek 12, 13, 23, 34, 45, 46, 56) a Girvan–Newman mind a 7 élt törli. Hány törlésnél esik ténylegesen szét valamelyik komponens (hány elágazása van a dendrogramnak)?`,
          options: [R`$5$`, R`$7$`, R`$6$`, R`$2$`],
          answer: 0,
          hint: R`Hány komponens van a legelején, és hány a legvégén? Egy törlés legfeljebb eggyel növeli a komponensek számát.`,
          explain: R`Kezdetben 1 komponens, a végén 6 (mindenki egyedül). Egy él törlése legfeljebb egy komponenst vág ketté, ezért pontosan $6 - 1 = 5$ elágazás van (Pythonnal a komponensszámok: 2, 2, 3, 4, 4, 5, 6). A $7$ minden törlést elágazásnak vesz – de egy háromszög első élének törlése csak ritkít, nem vág. A $6$ a csúcsok száma. A $2$ csak az első kettéesést nézi.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Girvan–Newman dendrogramjából egy felbontást kell választanod egy 1000 csúcsú gráfon. Mi a fejezet szerinti módszer?`,
          options: [
            R`Azt a szintet, ahol a modularitás ($Q$) a legnagyobb.`,
            R`Mindig az első kettéesést, mert az a legerősebb vágás.`,
            R`Azt a szintet, ahol a legkevesebb él fut a csoportok között.`,
            R`Az utolsó szintet, mert ott minden él törlődött.`
          ],
          answer: 0,
          hint: R`Kell egy szám, amely minden szintet pontoz. Melyik mérce nem jutalmazza sem a „semmit sem vágunk”, sem a „mindent szétvágunk” felbontást?`,
          explain: R`Girvan és Newman erre vezette be a modularitást: a 8.1 többletét minden közösségre összeadva. Az Árvízhéten a szintek $Q$-ja 0 (1 csoport), 0,28 (2), 0,215 (3), …, $-0{,}155$ (7): a két csoportos nyer. A karateklubon viszont 5 csoportnál van a csúcs ($Q = 0{,}401$), nem az első kettéesésnél – ezért nem jó az „első kettéesés” szabály. A legkevesebb vágott él a legfelső szint (1 csoport, 0 vágott él), az utolsó szint pedig mindenkit szétszed – mindkettő értelmetlen.`
        }
      ]
    },

    /* ------------------------------------------------ 8.3 */
    "gh8-83": {
      title: "Kvíz – 8.3 Modularitás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két $K_4$ (teljes gráf 4 csúcson), egyetlen éllel összekötve: $m = 13$. Mennyi a $Q$ a két $K_4$-ből álló felbontásra?`,
          options: [R`$\approx 0{,}423$`, R`$\approx -0{,}077$`, R`$\approx 1{,}346$`, R`$\approx -1{,}077$`],
          answer: 0,
          hint: R`Egy $K_4$-nek 6 éle van. Mennyi egy csoport $d_c$-je, ha egy él fut ki belőle? Utána: $L_c/m - (d_c/2m)^2$, csoportonként.`,
          explain: R`Csoportonként $L_c = 6$, $K_c = 1$, $d_c = 2 \cdot 6 + 1 = 13$. $Q = 2 \cdot \big(6/13 - (13/26)^2\big) = 2 \cdot (0{,}4615 - 0{,}25) \approx 0{,}423$. A $-0{,}077$ elhagyja a négyzetet ($13/26 = 0{,}5$). Az $1{,}346$ a belső éleket kétszer számolja ($2L_c/m$) – már az is gyanús, hogy $Q \lt 1$ mindig. A $-1{,}077$ a $d_c/m$-mel számol ($13/13 = 1$), és a $Q \ge -1/2$ korlátot is áttöri.`
        },
        {
          type: "match",
          q: R`A két háromszög + híd gráf (élek 12, 13, 23, 34, 45, 46, 56; $m = 7$). Párosítsd a felbontásokat a modularitásukkal!`,
          pairs: [
            [R`$\{1, 2, 3\}$ · $\{4, 5, 6\}$`, "≈ 0,357"],
            [R`$\{1, 2\}$ · $\{3, 4, 5, 6\}$`, "≈ 0,122"],
            [R`$\{1, 2\}$ · $\{3, 4\}$ · $\{5, 6\}$`, "≈ 0,082"],
            [R`mindenki egy csoportban`, "0"],
            [R`mindenki külön`, "≈ −0,173"]
          ],
          hint: R`A fokszámok 2, 2, 3, 3, 2, 2, $2m = 14$. Két felbontásnál számolás nélkül is tudod az eredményt: melyik az a kettő?`,
          explain: R`$\{1, 2, 3\}$ · $\{4, 5, 6\}$: $2 \cdot (3/7 - (7/14)^2) = 2 \cdot (0{,}429 - 0{,}25) \approx 0{,}357$. $\{1, 2\}$ · $\{3, 4, 5, 6\}$: $(1/7 - (4/14)^2) + (4/7 - (10/14)^2) = 0{,}061 + 0{,}061 \approx 0{,}122$. Három pár: $3/7 - (16 + 36 + 16)/196 \approx 0{,}082$. Egy csoport: $1 - 1 = 0$, mindig. Mindenki külön: belső él nincs, $Q = -\sum_i (k_i/2m)^2 = -34/196 \approx -0{,}173$, mindig negatív. A természetes felbontás nyer, és a kettévágás „rossz helyen” (a 3-as a másik oldalon) sokat veszít.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a modularitásra? (Több jó válasz is lehet.)",
          options: [
            R`$Q \lt 1$ minden felbontásra.`,
            R`$Q \ge -\tfrac12$; ezt két csoport éri el, ha minden él köztük fut.`,
            R`Az egyetlen közösségből álló felbontás $Q$-ja 0.`,
            R`A „mindenki külön” felbontás $Q$-ja pozitív is lehet, ha a gráf ritka.`,
            R`A modularitás maximuma mindig a valódi közösségeket adja.`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg a szélső eseteket: mennyi a belső él, és mennyi a véletlen szint, ha mindenki egy csoportban van, illetve ha mindenki külön?`,
          explain: R`Az első három a modularitás tulajdonságai közül való: $Q$ csak közelít 1-hez (sok elszigetelt, egyforma közösségnél), $-1/2$-et két csoport éri el, ha minden él köztük fut (pl. a négyzet $\{1, 3\}$ · $\{2, 4\}$ felbontása), és egy csoportnál $1 - 1 = 0$. A „mindenki külön” mindig negatív: belső él nincs, csak a $-\sum_i (k_i/2m)^2$ marad. A maximum sem a „valódi” közösség: a felbontási határ miatt kis, sűrű csoportok összeolvadhatnak, és a hálózat szerkezete sem mindig egyezik a külső címkékkel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten (súly nélkül, $m = 10$) a győztes felbontásból a $\mathrm{Po}$-t átteszed: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}, \mathrm{Po}\}$ · $\{\mathrm{La}, \text{Ön}\}$. Az első csoportnak 7 belső éle van és $d = 16$, a másodiknak 1 éle és $d = 4$. Mennyi a $Q$?`,
          options: [R`$0{,}12$`, R`$-0{,}2$`, R`$0{,}92$`, R`$0{,}06$`],
          answer: 0,
          hint: R`Mindkét csoportra: belső arány mínusz $(d_c/20)^2$, aztán add össze a két tagot.`,
          explain: R`Első: $7/10 - (16/20)^2 = 0{,}7 - 0{,}64 = 0{,}06$. Második: $1/10 - (4/20)^2 = 0{,}1 - 0{,}04 = 0{,}06$. $Q = 0{,}12$ – sokkal rosszabb a győztes $0{,}28$-nál. A $-0{,}2$ a négyzetet hagyja el ($0{,}7 - 0{,}8 + 0{,}1 - 0{,}2$). A $0{,}92$ a belső éleket kétszer számolja ($2L_c/m$). A $0{,}06$ csak az egyik csoport tagja – a $Q$ az összes közösség összege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Súlyozott Árvízhét: $W = 18$, az erősségek $\mathrm{Sz}$ 4, $\mathrm{Kl}$ 3; az $\mathrm{Sz}$–$\mathrm{Kl}$ él súlya 2 (súly nélkül a fokszámuk 3 és 2). Mennyi az $\{\mathrm{Sz}, \mathrm{Kl}\}$ csoport hozzájárulása $Q^w$-hez?`,
          options: [R`$\approx 0{,}073$`, R`$\approx 0{,}092$`, R`$\approx 0{,}038$`, R`$\approx -0{,}040$`],
          answer: 0,
          hint: R`Súlyozva minden „élszám” helyére súly kerül: belső súly / $W$, és a véletlen szinthez erősségösszeg / $2W$.`,
          explain: R`$W_c/W - (s_c/2W)^2 = 2/18 - (7/36)^2 \approx 0{,}111 - 0{,}038 = 0{,}073$. A $0{,}092$ súlyozott belső súlyhoz súlyozatlan fokszámot párosít: $2/18 - (5/36)^2$. A $0{,}038$ a súly nélküli érték ($1/10 - (5/20)^2 = 0{,}0375$). A $-0{,}040$ a nevezőben $W$-t használ $2W$ helyett: $2/18 - (7/18)^2$ – de erősségből (élvégsúlyból) $2W$ van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 5000 élű hálózatban két közösség fokszámösszege 40 és 50, és egyetlen él köti össze őket. Összevonja-e őket a modularitás (vagyis nő-e $Q$ az összevonással)?`,
          options: [
            R`Igen, mert $1 \gt d_1 d_2/2m = 0{,}2$: az az egy él több, mint a várható.`,
            R`Nem, mert egyetlen él a 90-es fokszámösszeghez képest elhanyagolható.`,
            R`Nem: a felbontási határ miatt a kis közösségek nagy gráfban inkább szétesnek.`,
            R`Nem, mert $d_1 d_2 = 2000$ nagyobb, mint $\sqrt{2m} = 100$.`
          ],
          answer: 0,
          hint: R`Két közösség összevonása akkor növeli $Q$-t, ha a köztük futó élek száma nagyobb, mint $d_1 d_2/2m$.`,
          explain: R`$d_1 d_2/2m = 40 \cdot 50/10\,000 = 0{,}2 \lt 1$: az egy él „meglepően sok”, az összevonás $\tfrac1m(1 - 0{,}2) \gt 0$-val növeli $Q$-t. Ez a felbontási határ: nagy gráfban a véletlen szint nevezője ($2m$) nagy, ezért kis csoportok közt egyetlen él is összevonást ér. Az irány a lényeg: a kis közösségek összeolvadnak, nem szétesnek. A $\sqrt{2m}$-es szabály a fokszámösszegekre vonatkozik (itt $40, 50 \lt 100$, tehát éppen összeolvadnak), nem a szorzatukra.`
        },
        {
          type: "single", shuffle: true,
          q: R`12 háromszöget fűzöl gyűrűbe, a szomszédosakat egy-egy éllel összekötve ($m = 48$). Melyik felbontásnak nagyobb a modularitása: minden háromszög külön, vagy szomszédos párokba vonva?`,
          options: [
            R`A pároké: a felbontási határ miatt a kis közösségek összeolvadnak.`,
            R`A háromszögeké: a modularitás-maximum a szemmel látható közösségeket adja.`,
            R`Holtverseny: a gyűrűben a kettő mindig egyforma.`,
            R`Egyiké sem: a háromszögek egyes csúcsokra esnek szét.`
          ],
          answer: 0,
          hint: R`Számold ki mindkettőt: egy háromszög $d = 8$, egy pár 7 belső éllel, $d = 16$. Vagy használd a gyűrű feltételét: $n_c \gt l(l - 1) + 2$.`,
          explain: R`Külön: $12 \cdot \big(3/48 - (8/96)^2\big) \approx 0{,}667$. Párok: $6 \cdot \big(7/48 - (16/96)^2\big) \approx 0{,}708$. A párok nyernek, mert $12 \gt 3 \cdot 2 + 2 = 8$ (8 háromszögnél holtverseny, 6-nál még a háromszögek nyernek). Ez a felbontási határ: a modularitás-maximum nem mindig a szemmel látható közösség, és a hiba iránya az összeolvadás, nem a szétesés.`
        }
      ]
    },

    /* ------------------------------------------------ 8.4 */
    "gh8-84": {
      title: "Kvíz – 8.4 Louvain és Leiden",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 15 élű gráfban az egyedül álló $i$ csúcs fokszáma 3, és 2 éle fut a $C$ közösségbe, amelynek fokszámösszege $\Sigma_C = 12$. Mennyi a $\Delta Q$, ha $i$-t $C$-be teszed?`,
          options: [R`$\approx 0{,}053$`, R`$\approx -0{,}027$`, R`$\approx 0{,}033$`, R`$\approx 0{,}133$`],
          answer: 0,
          hint: R`$\Delta Q = k_{i,C}/m - \Sigma_C k_i/2m^2$. Figyelj a második tag nevezőjére!`,
          explain: R`$2/15 - 12 \cdot 3/(2 \cdot 225) = 0{,}133 - 0{,}08 \approx 0{,}053$. A $-0{,}027$ a nevezőből elhagyja a 2-t ($36/225 = 0{,}16$). A $0{,}033$ a csúcs saját fokszámát is $\Sigma_C$-be számolja ($\Sigma_C = 15$) – ez a „ki nem vett csúcs” hibája. A $0{,}133$ csak a nyert belső élek aránya, a megnövő véletlen szint nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanez az $i$ ($k_i = 3$, $m = 15$) két szomszédos közösség közül választ: $C$-be 2 éle fut, $\Sigma_C = 20$; $D$-be 1 éle fut, $\Sigma_D = 3$. Mit tesz a Louvain?`,
          options: [
            R`A $D$-be megy.`,
            R`A $C$-be megy, mert oda több éle fut.`,
            R`Egyedül marad, mert egyik lépés sem javít.`,
            R`Holtverseny: mindkettő ugyanannyit ad.`
          ],
          answer: 0,
          hint: R`Számold ki mindkét $\Delta Q$-t. A nagy fokszámösszegű közösség „drága”.`,
          explain: R`$C$: $2/15 - 20 \cdot 3/450 = 0{,}133 - 0{,}133 = 0$. $D$: $1/15 - 3 \cdot 3/450 = 0{,}067 - 0{,}02 \approx 0{,}047$. A $D$ szigorúan javít, ezért oda megy. A több él önmagában nem dönt: a $C$-nél a véletlen szint éppen annyit nő, amennyit a két él hoz. Egyedül maradni ($\Delta Q = 0$) rosszabb, mint a $D$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két háromszög + híd gráfon a Louvain első fázisa után két szuperpont maradt: $A = \{1, 2, 3\}$ és $B = \{4, 5, 6\}$ (mindkettőn 3-as súlyú hurok, köztük 1 él, $m = 7$). Mennyi az összevonásuk $\Delta Q$-ja?`,
          options: [R`$\approx -0{,}357$`, R`$\approx 0{,}143$`, R`$\approx 0{,}133$`, R`$\approx -0{,}071$`],
          answer: 0,
          hint: R`Mennyi egy szuperpont „fokszáma”, ha a belső élek hurokként benne maradnak?`,
          explain: R`A szuperpont fokszáma $2 \cdot 3 + 1 = 7$ (a hurok kétszer számít). $\Delta Q = 1/7 - 7 \cdot 7/98 = 0{,}143 - 0{,}5 \approx -0{,}357$ – éppen a $Q = 0{,}357$ elvesztése, hiszen egy közösség $Q$-ja 0. Az algoritmus megáll. A $0{,}143$ csak a nyert él, a véletlen szint nélkül. A $0{,}133$ a hurkot felejti el (fokszám 1): $1/7 - 1/98$ – és rossz összevonáshoz vezetne. A $-0{,}071$ a 4-es <b>csúcs</b> lépése az $\{1, 2, 3\}$-ba az első fázisban.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy közösség 5 csúcsból áll, köztük 6 él fut, és 4 él fut ki belőle. Az összevonás után mennyi a szuperpont hurkának súlya és a szuperpont fokszáma?`,
          options: [
            R`hurok $6$, fokszám $16$`,
            R`hurok $6$, fokszám $10$`,
            R`hurok $12$, fokszám $16$`,
            R`hurok $6$, fokszám $4$`
          ],
          answer: 0,
          hint: R`A hurok a belső éleket őrzi. A szuperpont fokszáma a közösség $d_c$-je – mi volt rá a 8.1 képlete?`,
          explain: R`A hurok súlya a belső élek száma: 6. A fokszám $d_c = 2L_c + K_c = 12 + 4 = 16$ – a hurok kétszer számít, ettől marad változatlan a $Q$ az összevonásnál. A $10 = 6 + 4$ a hurkot csak egyszer számolja. A „hurok 12” a dupla számolást a súlyba is beleteszi. A „fokszám 4” elfelejti a hurkot – ekkor a véletlen szint rossz lesz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két közösség között 3 él fut, $d_1 = 12$, $d_2 = 15$, $m = 40$. Mely $\gamma$ felbontási paraméterekre éri meg összevonni őket ($Q_\gamma$ szerint)?`,
          options: [
            R`$\gamma \lt 4/3$`,
            R`$\gamma \gt 4/3$`,
            R`$\gamma \lt 2/3$`,
            R`minden $\gamma$-ra, mert 3 él sok`
          ],
          answer: 0,
          hint: R`Az összevonás feltétele $\gamma$-val: $\ell_{12} \gt \gamma\, d_1 d_2/2m$.`,
          explain: R`$d_1 d_2/2m = 180/80 = 2{,}25$, így $3 \gt 2{,}25\gamma \iff \gamma \lt 4/3 \approx 1{,}33$. A $\gamma \gt 4/3$ megfordítja az irányt: nagyobb $\gamma$-nál a véletlen szint drágább, a csoportok külön maradnak. A $2/3$ a $2m$ helyett $m$-mel oszt. A „3 él sok” mérce nélküli: elég nagy $\gamma$-nál bármennyi él kevés.`
        },
        {
          type: "match",
          q: R`A Louvain a felbontási paraméter ($\gamma$) különböző értékeinél. Párosítsd!`,
          pairs: [
            [R`karateklub, $\gamma = 0{,}5$`, "2 közösség (szinte a valódi kettéválás)"],
            [R`karateklub, $\gamma = 1$`, "4 közösség"],
            [R`karateklub, $\gamma = 2$`, "7 közösség"],
            [R`bármely gráf, $\gamma = 0$`, "mindenki egy csoportban"]
          ],
          hint: R`Nagyobb $\gamma$: drágább véletlen szint. Kisebb vagy nagyobb közösségeket kapsz? És mi marad a $Q_\gamma$-ból, ha $\gamma = 0$?`,
          explain: R`Nagyobb $\gamma$ → több, kisebb közösség: 2, 4, 7. A $\gamma = 0{,}5$ felbontás szinte a valódi kettéválás (két tag, a 9-es és a 10-es a „rossz” oldalon), a $\gamma = 1$ a táborokon belüli köröket is szétválasztja. $\gamma = 0$-nál $Q_0 = \sum_c L_c/m$, a belső élek aránya, és ezt a „mindenki egy csoportban” maximalizálja ($Q_0 = 1$). Mindegyik egy nagyítás – a kérdés dönti el, melyik kell.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Louvain- és a Leiden-algoritmusra? (Több jó válasz is lehet.)",
          options: [
            R`A Louvain mohó: helyi optimumban állhat meg, és különböző futásai különböző $Q$-t adhatnak.`,
            R`A Louvain egy közössége szétszakadhat (nem összefüggő lehet); a Leiden finomítási fázisa ezt kizárja.`,
            R`A Leiden a modularitás valódi maximumát adja, ezért nála nincs felbontási határ.`,
            R`Nagyobb $\gamma$ kevesebb, nagyobb közösséget ad.`,
            R`A Louvain csak a szomszédos közösségeket vizsgálja: ha $k_{i,C} = 0$, a $\Delta Q$ biztosan negatív.`
          ],
          answer: [0, 1, 4],
          hint: R`Mit javít a Leiden, és mit nem? Melyik tag lesz negatív a $\Delta Q$-ban, ha nincs él a közösségbe?`,
          explain: R`Igaz: a Louvain mohó, a karateklubon 100 futás $Q$-ja is szóródik. Igaz: ha egy összetartó csúcs átvándorol, a régi közösség szétesik, de szuperpontként a Louvain már nem nézi a belsejét – a Leiden finomítása csak a jól összekötött részeket vonja össze. Igaz: $k_{i,C} = 0$-nál csak a negatív véletlenszint-tag marad, ettől gyors az algoritmus. Hamis a Leiden-állítás: ő is a modularitást (vagy hasonlót) optimalizálja heurisztikusan, a felbontási határ és a $\gamma$-függés megmarad. Hamis a $\gamma$ iránya: nagyobb $\gamma$ több, kisebb közösséget ad.`
        }
      ]
    },
