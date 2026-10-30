(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 4.4 */
    "gh4-44": {
      title: "Kvíz – 4.4 A Laplace-mátrix",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $12$, $23$, $24$, $34$ (a 2–3–4 háromszög, rajta lóg az 1-es). Melyik a Laplace-mátrix 2-es <b>sora</b>?`,
          options: [
            R`$(-1,\ 3,\ -1,\ -1)$`,
            R`$(1,\ -3,\ 1,\ 1)$`,
            R`$(-1,\ 0,\ -1,\ -1)$`,
            R`$(1,\ 3,\ 1,\ 1)$`
          ],
          answer: 0,
          hint: R`$L = D - A$: mi kerül az átlóba, és mi a szomszédok helyére?`,
          explain: R`A 2-es csúcs fokszáma 3 (szomszédai 1, 3, 4), ez az átlóba kerül; a szomszédok helyén $-1$ áll: $(-1, 3, -1, -1)$. A sorösszeg 0, ahogy kell. Az $(1, -3, 1, 1)$ az $A - D$ – fordított előjel, ekkor minden sajátérték nempozitív lenne. A $(-1, 0, -1, -1)$ a $-A$: kimaradt a fokszám. Az $(1, 3, 1, 1)$ a $D + A$: a sorösszege nem 0, tehát nem lehet Laplace-mátrix.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 4 csúcsú úton (1–2–3–4) legyen $\mathbf x = (2, 0, 1, 1)$. Mennyi $\mathbf x^\top L\,\mathbf x$?`,
          options: ["5", "10", "3", "1"],
          answer: 0,
          hint: R`Élenként nézd az ugrást: $\sum (x_i - x_j)^2$. Hány éle van az útnak?`,
          explain: R`Három él: $(2 - 0)^2 + (0 - 1)^2 + (1 - 1)^2 = 4 + 1 + 0 = 5$. A 10 az, ha minden élt kétszer számolsz ($ij$ és $ji$) – a bizonyításban ez a kettes a $-2x_ix_j$-ben „elfogy”. A 3 a négyzetre emelés nélküli $|2| + |{-1}| + 0$, az 1 pedig az előjeles különbségek összege $2 - 1 + 0$ – ez elfedi az ugrásokat.`
        },
        {
          type: "multi",
          q: R`Élek: $12$, $23$, $45$ (5 csúcs, két komponens: $\{1,2,3\}$ és $\{4,5\}$). Melyik vektorra $\mathbf x^\top L\,\mathbf x = 0$? (Több jó válasz is lehet.)`,
          options: [
            R`$(1, 1, 1, 1, 1)$`,
            R`$(2, 2, 2, -1, -1)$`,
            R`$(1, 1, 1, 0, 0)$`,
            R`$(1, 2, 3, 0, 0)$`,
            R`$(0, 0, 0, 1, -1)$`
          ],
          answer: [0, 1, 2],
          hint: R`$\mathbf x^\top L\mathbf x$ négyzetek összege. Mikor 0 egy ilyen összeg? Kell-e a két komponensnek ugyanazt az értéket kapnia?`,
          explain: R`$\mathbf x^\top L\mathbf x = \sum (x_i - x_j)^2 = 0$ pontosan akkor, ha minden élen egyforma a két vég, vagyis $\mathbf x$ <b>komponensenként</b> konstans. A két komponens különböző konstanst is kaphat: $(2, 2, 2, -1, -1)$ és $(1, 1, 1, 0, 0)$ is jó. Az $(1, 2, 3, 0, 0)$ az első komponensen belül változik: $1 + 1 = 2$. A $(0, 0, 0, 1, -1)$ a $45$ élen ugrik: $2^2 = 4$. Ezért van itt két 0 sajátérték – annyi, ahány komponens.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráfnak 8 csúcsa és 7 éle van, és 3 komponensből áll (az egyik egy izolált csúcs). Hány 0 sajátértéke van a Laplace-mátrixának?`,
          options: ["3", "2", "8", "7"],
          answer: 0,
          hint: "Az izolált csúcs is komponens. Mit számol meg a 0 sajátérték multiplicitása?",
          explain: R`A 0 sajátérték multiplicitása = a komponensek száma = 3. Az izolált csúcs is külön komponens: a sora csupa 0 az $L$-ben, és a „csak ott 1” vektor is nulla energiájú. A 2 ezt az izolált csúcsot hagyja ki; a 8 és a 7 a csúcsok, illetve az élek száma – ezekhez a nullák számának nincs köze.`
        },
        {
          type: "match",
          q: "Párosítsd a mátrixot vagy mennyiséget a nevével!",
          pairs: [
            [R`$L = D - A$`, "kombinatorikus (nem normalizált) Laplace-mátrix"],
            [R`$D^{-1}L = I - P$`, "véletlen sétás Laplace-mátrix"],
            [R`$D^{-1/2}LD^{-1/2}$`, "szimmetrikusan normalizált Laplace-mátrix"],
            [R`$\mu_2$`, "algebrai összefüggőség"],
            [R`a 0 sajátérték multiplicitása`, "a komponensek száma"]
          ],
          hint: R`Melyikben szerepel az átmenetmátrix $P$? Melyik szimmetrikus a két oldali $D^{-1/2}$ miatt?`,
          explain: R`A fejezetben a kombinatorikus $L = D - A$-t használjuk. A $D^{-1}L = I - D^{-1}A = I - P$ a véletlen séta átmenetmátrixából jön, a $D^{-1/2}LD^{-1/2}$ a szimmetrikusan normalizált (ezt használja a spektrális klaszterezés és a GCN). A $\mu_2$ neve algebrai összefüggőség (Fiedler). A 0 sajátérték multiplicitása mindhárom változatnál a komponensek száma – a többi sajátérték viszont különbözik, ezért a hármat nem szabad keverni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két 6 csúcsú gráf Laplace-spektruma: <br>két háromszög híddal: $0;\ 0{,}44;\ 3;\ 3;\ 3;\ 4{,}56$; <br>a 6 hosszú kör ($C_6$): $0;\ 1;\ 1;\ 3;\ 3;\ 4$. <br>Melyik állítás igaz?`,
          options: [
            R`Mindkettő összefüggő, de a $C_6$-ot nehezebb kettévágni: $\mu_2 = 1 > 0{,}44$.`,
            R`A két háromszöget nehezebb kettévágni, mert a legnagyobb sajátértéke ($4{,}56$) nagyobb.`,
            R`Egyik sem összefüggő, hiszen mindkettőnek van 0 sajátértéke.`,
            R`A $C_6$ két komponensből áll, mert az 1 kétszer szerepel a spektrumában.`
          ],
          answer: 0,
          hint: R`Hány 0 van egy-egy spektrumban? Az összefüggőség „erősségét” melyik sajátérték méri – a legkisebb nem nulla, vagy a legnagyobb?`,
          explain: R`Mindkét spektrumban pontosan egy 0 van, tehát mindkettő összefüggő (a $\mu_1 = 0$ minden gráfban ott van, mert $L\mathbf 1 = \mathbf 0$). Az algebrai összefüggőség a $\mu_2$: a hidas gráfé $0{,}44$ (egyetlen él elvágásával kettéesik), a $C_6$-é 1 (legalább 2 élt kell elvágni). A legnagyobb sajátérték nem az összefüggőséget méri – a $\mu_2$ és a legnagyobb sajátérték keverése tipikus hiba. A komponenseket csak a 0-k száma mutatja, a többi sajátérték ismétlődése nem.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a Laplace-mátrixra ($L = D - A$, irányítatlan gráf)? (Több jó válasz is lehet.)`,
          options: [
            R`Minden sorának összege 0, ezért $L\mathbf 1 = \mathbf 0$.`,
            R`Minden sajátértéke nemnegatív, mert $\mathbf x^\top L\mathbf x$ négyzetek összege.`,
            "A 0 sajátérték multiplicitása a normalizált változatoknál is a komponensek száma.",
            R`Ha $\mathbf x^\top L\mathbf x$ nagy, akkor a gráf csúcsai fontosak.`,
            "A normalizált és a nem normalizált Laplace-mátrix sajátértékei megegyeznek."
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig, mit mér $\mathbf x^\top L\mathbf x$: a gráfot, a jelet, vagy a kettőt együtt?`,
          explain: R`Az átlóban a fokszám, a sorban ugyanannyi $-1$: a sorösszeg 0, így $L\mathbf 1 = \mathbf 0$. Ha $L\mathbf v = \mu\mathbf v$, akkor $\mu\,\mathbf v^\top\mathbf v = \mathbf v^\top L\mathbf v \ge 0$, tehát $\mu \ge 0$. A nullák száma mindhárom változatnál a komponensszám. A $\mathbf x^\top L\mathbf x$ viszont a <b>jel</b> változékonyságát méri, nem a csúcsok fontosságát: ugyanazon a gráfon a konstans jel 0-t ad. A normalizált változatok sajátértékei a $[0, 2]$-ben vannak, a kombinatorikusé nem – csak a nullák közösek.`
        }
      ]
    },

    /* ------------------------------------------------ 4.5 */
    "gh4-45": {
      title: "Kvíz – 4.5 Spektrális kettévágás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az 5 csúcsú úton (1–2–3–4–5) legyen $\mathbf x = (1, 1, -1, -1, -1)$. Mennyi $\mathbf x^\top L\,\mathbf x$?`,
          options: ["4", "1", "2", "8"],
          answer: 0,
          hint: R`Mely éleken különbözik a két vég? Mekkora ott a különbség, és mi a négyzete?`,
          explain: R`Csak a 2–3 élen tér el a két vég: $(1 - (-1))^2 = 2^2 = 4$. Az 1 a vágott élek száma – a $\mathbf x^\top L\mathbf x$ ennek a <b>4-szerese</b>, mert $\pm 1$-es jelölésnél a különbség 2. A 2 a négyzetre emelés nélküli különbség, a 8 az élenként kétszeri számolás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ha a $\pm 1$-es jelölések közül egyszerűen a legkisebb $\mathbf x^\top L\mathbf x$-űt keresnénk (a $\sum x_i = 0$ feltétel nélkül), mi lenne a „győztes”?`,
          options: [
            R`Mindenki egy csoportban ($\mathbf x = \mathbf 1$): 0 vágott él.`,
            "A Fiedler-vektor előjel szerinti vágása.",
            "A két pontosan egyforma méretű csoportra bontás.",
            "Az a felosztás, amely a legtöbb élt vágja el."
          ],
          answer: 0,
          hint: R`Mennyi $\mathbf x^\top L\mathbf x$ a konstans vektorra? Lehet ennél kisebb?`,
          explain: R`$\mathbf x^\top L\mathbf x \ge 0$, és a konstans $\mathbf x = \mathbf 1$ éppen 0-t ad: senkit sem választunk le, egyetlen élt sem vágunk el. Majdnem ilyen „olcsó” egyetlen levél levágása is. Ezért kell a kiegyensúlyozás: $\sum x_i = 0$, vagyis $\mathbf x \perp \mathbf 1$. A „legkisebb vágás a jó” kiegyensúlyozás nélkül tipikus hiba. A Fiedler-vektor éppen a $\mathbf x \perp \mathbf 1$ feltétellel kapott (lazított) feladat megoldása.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 6 csúcsú gráf Fiedler-vektora $(-0{,}52;\ -0{,}31;\ 0{,}04;\ 0{,}22;\ 0{,}48;\ 0{,}09)$ (az 1–6. csúcs). Mi a spektrális kettévágás, és melyik csúcs besorolása a legbizonytalanabb?`,
          options: [
            R`$\{1, 2\} \mid \{3, 4, 5, 6\}$; a 3-as a legbizonytalanabb.`,
            R`$\{1, 2\} \mid \{3, 4, 5, 6\}$; az 1-es a legbizonytalanabb.`,
            R`$\{1, 2, 3\} \mid \{4, 5, 6\}$; a 3-as a legbizonytalanabb.`,
            R`$\{1, 2, 3, 6\} \mid \{4, 5\}$; a 6-os a legbizonytalanabb.`
          ],
          answer: 0,
          hint: "Az előjel dönt, nem a csúcsok sorszáma. Mit jelent, ha egy érték nagyon közel van a nullához?",
          explain: R`Negatív: 1, 2; pozitív: 3, 4, 5, 6. A 3-as értéke ($0{,}04$) áll a legközelebb a nullához: ő a két oldal határán van, a kerekítés könnyen „rossz” oldalra teheti. Az 1-es ($-0{,}52$) a legnagyobb abszolút értékű – ő a legbiztosabban a helyén. A $\{1,2,3\}|\{4,5,6\}$ a sorszám szerinti felezés, nem az előjel; a $\{1,2,3,6\}$ a kis pozitív értékeket tévesen a negatívakhoz sorolja. (Itt a vágás 2–4: a Fiedler-vágás nem garantál pontos egyensúlyt.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 30 csúcsú összefüggő gráfra $\mu_2 = 0{,}4$. Legalább hány élt kell elvágni bármely 15–15-ös kettévágásnál?`,
          options: ["3", "12", "6", R`$0{,}1$`],
          answer: 0,
          hint: R`Pontosan kiegyensúlyozott $\pm 1$-es $\mathbf x$-re $\mathbf x^\top\mathbf x = n$, és $\mathbf x^\top L\mathbf x$ a vágás hányszorosa?`,
          explain: R`$4 \cdot \text{vágás} = \mathbf x^\top L\mathbf x \ge \mu_2\,\mathbf x^\top\mathbf x = n\mu_2$, így vágás $\ge n\mu_2/4 = 30 \cdot 0{,}4/4 = 3$. A 12 az $n\mu_2$ – kimaradt a 4-es szorzó (vágás $\ne \mathbf x^\top L\mathbf x$). A 6 a $/2$-es változat, a $0{,}1 = \mu_2/4$ pedig elfelejti, hogy $\mathbf x^\top\mathbf x = n$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Fiedler-vektorra? (Több jó válasz is lehet.)",
          options: [
            R`A Laplace-mátrix $\mu_2$ sajátértékéhez tartozó sajátvektor.`,
            R`Ha $\mathbf u_2$ Fiedler-vektor, $-\mathbf u_2$ is az, és ugyanazt a vágást adja.`,
            R`Merőleges $\mathbf 1$-re, ezért van pozitív és negatív eleme is.`,
            "A Laplace-mátrix legnagyobb sajátértékéhez tartozik.",
            "Az előjel szerinti vágása mindig a legjobb kiegyensúlyozott vágás."
          ],
          answer: [0, 1, 2],
          hint: R`A „legsimább nem konstans jel” – sima jelhez kicsi vagy nagy $\mathbf x^\top L\mathbf x$ tartozik?`,
          explain: R`A Fiedler-vektor a $\mu_2$-höz tartozik: ez minimalizálja $\mathbf x^\top L\mathbf x / \mathbf x^\top\mathbf x$-et a $\mathbf x \perp \mathbf 1$ vektorok között. Az előjele önkényes, a $-\mathbf u_2$ ugyanazt a felosztást adja, csak az oldalak „neve” cserélődik. Mivel $\sum x_i = 0$, és a vektor nem nulla, kell pozitív és negatív elemének is lennie. A legnagyobb sajátértékhez a legugrálóbb jel tartozik, nem a legsimább. A lazítás pedig nem garancia: a kerekítés jó közelítés, de nem mindig optimális, és a pontos egyensúlyt sem kényszeríti ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két háromszög, híd <b>nélkül</b>: a Laplace-spektrum $0;\ 0;\ 3;\ 3;\ 3;\ 3$. Mi a helyzet a $\mu_2$-vel és a Fiedler-vektorral?`,
          options: [
            R`$\mu_2 = 0$; a Fiedler-vektor a két komponenst választja szét, 0 vágott éllel.`,
            R`$\mu_2 = 3$, az első nem nulla sajátérték; a Fiedler-vektor a háromszögeken belül vág.`,
            R`$\mu_2 > 0$, mert a $\mu_2$ minden gráfban pozitív.`,
            R`$\mu_2 = 0$, ezért ilyen gráfnak nincs Fiedler-vektora.`
          ],
          answer: 0,
          hint: R`A $\mu_2$ a növekvő sorrend második eleme – akkor is, ha az 0. Mit tudsz a komponensenként konstans vektorokról?`,
          explain: R`A sorrend $0 = \mu_1 \le \mu_2 \le \dots$, tehát $\mu_2 = 0$ – két komponens, két nulla. A hozzá tartozó, $\mathbf 1$-re merőleges sajátvektor komponensenként konstans, pl. $(1, 1, 1, -1, -1, -1)$: a két háromszöget választja szét, 0 éllel. Ez helyes, de a komponenseken belüli szerkezetről semmit nem mond – ezért előbb komponensekre bontunk. A „$\mu_2 > 0$ mindig” csak összefüggő gráfra igaz, a „$\mu_2 = 3$” pedig átugorja a második nullát.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon (34 tag) az előjel szerinti vágás 15–19, 10 élt vág el, és 32 tagot tesz a valódi oldalára. A medián szerinti küszöb 17–17-et ad, 11 élt vág el, és mind a 34 tagot jó oldalra teszi. Mit tanulunk ebből?`,
          options: [
            "A kevesebb elvágott él nem mindig a jobb felosztás: a kiegyensúlyozás is számít, és a 0 körüli csúcsoknál érdemes más küszöböt is kipróbálni.",
            "Az előjel szerinti vágás mindig pontosan kiegyensúlyozott, a medián csak kerekítési különbség.",
            "A medián szerinti vágás kevesebb élt vág el, ezért jobb.",
            "A rosszul besorolt 3. és 9. tag Fiedler-értéke a legnagyobb abszolút értékű, ezért ők a legbiztosabbak."
          ],
          answer: 0,
          hint: "Hasonlítsd össze a két vágást: melyik vág kevesebb élt, és melyik a kiegyensúlyozottabb?",
          explain: R`Az előjel szerinti vágás kevesebb élt vág (10), de nem kiegyensúlyozott (15–19), és két tagot – a 3.-at és a 9.-et – rossz oldalra tesz. Az ő Fiedler-értékük nagyon közel van a nullához: a vágás határán állnak. A medián szerinti küszöb eggyel több élt vág el (11), de pontosan kiegyensúlyozott, és éppen a valódi szakadást adja. A lazítás tehát nem garancia; az előjel sem kényszeríti ki az egyensúlyt.`
        }
      ]
    },

    /* ------------------------------------------------ 4.6 */
    "gh4-46": {
      title: "Kvíz – 4.6 Alkalmazás: az Árvízhét mátrixai",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét szereplőgráfján (7 csúcs, 10 él) súlyozatlan linkeken kattintgat az olvasó. Hosszú távon az idejének mekkora részét tölti a Vízügy oldalán ($d_{\mathrm{Vi}} = 3$)?`,
          options: [
            R`$\frac{3}{20} = 0{,}15$`,
            R`$\frac{3}{10} = 0{,}3$`,
            R`$\frac{1}{7} \approx 0{,}143$`,
            R`$\frac{5}{36} \approx 0{,}139$`
          ],
          answer: 0,
          hint: R`Irányítatlan gráfon $\pi_i = d_i / 2m$. Mennyi itt $2m$?`,
          explain: R`$\pi_{\mathrm{Vi}} = d_{\mathrm{Vi}}/2m = 3/20 = 0{,}15$. A $3/10$ $m$-mel oszt $2m$ helyett – akkor az összeg 2 lenne, nem 1. Az $1/7$ az egyenletes eloszlás, a $5/36$ a súlyozott séta értéke ($s_{\mathrm{Vi}} = 5$, $\sum s = 36$) – ez egy másik modell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Súlyozatlanul a Kormány és a Polgármester holtversenyben vezet (20–20%). Ha a linkeket az együttes cikkek számával súlyozzuk, ki nyer, és miért?`,
          options: [
            R`A Polgármester ($22{,}2\%$): neki a legnagyobb az erőssége, $s = 8$.`,
            R`Marad a holtverseny: a súlyozás a fokszámokat nem változtatja meg.`,
            R`A Kormány: a domináns sajátvektorban is ő az első.`,
            R`A Lakók: az övék a legerősebb kapcsolat (3 közös cikk az Önkéntesekkel).`
          ],
          answer: 0,
          hint: R`Súlyozott sétánál a fokszám helyett mi áll a $\pi_i$ képletében?`,
          explain: R`Súlyozva $\pi_i = s_i/\sum s$, $\sum s = 36$. Erősség: $\mathrm{Po}\ 8$, $\mathrm{Ko}\ 6$, … – így $\mathrm{Po}$ $8/36 \approx 22{,}2\%$, $\mathrm{Ko}$ $6/36 \approx 16{,}7\%$. A „marad a holtverseny” a súlyozott sétán is fokszámmal számol – tipikus hiba. A sajátvektor egy másik mérőszám, nem a séta eloszlása. A Lakók erőssége 5 ($3 + 2$): a legerősebb élük feljebb hozza őket ($13{,}9\%$), de nem az élre.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az olvasó a Klímaváltozás oldaláról indul ($\mathrm{Kl}$ szomszédai: $\mathrm{Ko}$, $d = 4$, és $\mathrm{Sz}$, $d = 3$; mindkettőnek szomszédja a $\mathrm{Vi}$). Mekkora eséllyel van <b>két</b> lépés után a Vízügy oldalán?`,
          options: [
            R`$\frac{7}{24}$`,
            R`$\frac{1}{8}$`,
            R`$\frac{1}{6}$`,
            R`$\frac{7}{12}$`
          ],
          answer: 0,
          hint: "Két út vezet a Vízügyre. Mindkettőnél szorozd össze a lépések esélyét, aztán add össze a két utat.",
          explain: R`$\mathrm{Kl} \to \mathrm{Ko} \to \mathrm{Vi}$: $\frac12 \cdot \frac14 = \frac18$; $\mathrm{Kl} \to \mathrm{Sz} \to \mathrm{Vi}$: $\frac12 \cdot \frac13 = \frac16$. Összesen $\frac18 + \frac16 = \frac{7}{24}$ (teljes valószínűség). Az $\frac18$ és az $\frac16$ csak az egyik utat számolja; a $\frac7{12} = \frac14 + \frac13$ elfelejti az első lépés $\frac12$-es esélyét.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Kormány és a Polgármester fokszáma egyaránt 4, a domináns sajátvektorban viszont $\mathrm{Ko}\ 1$, $\mathrm{Po}\ 0{,}87$. Mi a különbség oka?`,
          options: [
            "A Kormány szomszédai maguk is sok szálon kötődnek; a Polgármester két szomszédja (Lakók, Önkéntesek) a gráf szélén van.",
            "A Kormánynak valójában több szomszédja van, csak a fokszám rosszul számol.",
            "A sajátvektor a súlyokat is figyelembe veszi, és a Kormány élei erősebbek.",
            "A véletlen séta több időt tölt a Kormány oldalán, és a sajátvektor ezt méri."
          ],
          answer: 0,
          hint: "A sajátvektorban egy csúcs értéke a szomszédai értékének összegével arányos. Kik a két szereplő szomszédai?",
          explain: R`$\lambda_1 v_i = \sum_j A_{ij}v_j$: „az a fontos, akinek fontos szomszédai vannak”. A Kormány szomszédai $\mathrm{Vi}$, $\mathrm{Po}$, $\mathrm{Sz}$, $\mathrm{Kl}$ – sűrű csoport; a Polgármesteré $\mathrm{Ko}$, $\mathrm{Vi}$, $\mathrm{La}$, $\text{Ön}$, ebből kettő csak egymáshoz és hozzá kötődik. A sajátvektort itt a súlyozatlan $A$-ból számoltuk (a súlyozott erősség épp a Polgármesternél nagyobb: 8 vs. 6). A véletlen séta irányítatlan gráfon csak a fokszámot adja vissza: ott $\mathrm{Ko}$ és $\mathrm{Po}$ egyforma, 20–20%.`
        },
        {
          type: "multi",
          q: R`A Fiedler-vektor az Árvízhéten: $\mathrm{Kl}\ {-0{,}45}$, $\mathrm{Sz}\ {-0{,}37}$, $\mathrm{Ko}\ {-0{,}24}$, $\mathrm{Vi}\ {-0{,}18}$, $\mathrm{Po}\ 0{,}19$, $\mathrm{La}\ 0{,}52$, $\text{Ön}\ 0{,}52$. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`A vágás: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\} \mid \{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$.`,
            R`A vágott élek a $\mathrm{Ko}$–$\mathrm{Po}$ és a $\mathrm{Vi}$–$\mathrm{Po}$: mindkettő a Polgármesterhez fut.`,
            R`A megfelelő $\pm 1$-es vektorra $\mathbf x^\top L\mathbf x = 8$.`,
            R`A megfelelő $\pm 1$-es vektorra $\mathbf x^\top L\mathbf x = 2$, mert 2 élt vágunk el.`,
            R`A vágás 3–4-es, tehát a Fiedler-vágás itt nem működött – pontosan kiegyensúlyozott vágást kellett volna adnia.`
          ],
          answer: [0, 1, 2],
          hint: R`Az előjel dönt. Utána számold meg a két oldal közötti éleket, és emlékezz: $\pm 1$-es jelölésnél egy vágott él mennyit ad a $\mathbf x^\top L\mathbf x$-hez?`,
          explain: R`Negatív: $\mathrm{Kl}, \mathrm{Sz}, \mathrm{Ko}, \mathrm{Vi}$ (országos szál), pozitív: $\mathrm{Po}, \mathrm{La}, \text{Ön}$ (helyi szál). A két oldal között a $\mathrm{Ko}$–$\mathrm{Po}$ és a $\mathrm{Vi}$–$\mathrm{Po}$ fut, így $\mathbf x^\top L\mathbf x = 4 \cdot 2 = 8$ (a 2 a 4-es szorzó elfelejtése). 7 csúcsnál pontos egyensúly nem is lehetséges, és a Fiedler-vágás amúgy sem kényszeríti ki – a 3–4 a lehető legkiegyensúlyozottabb, és a 3 csúcsú oldalak közül ez vág a legkevesebb élt (Pythonnal ellenőrizve).`
        },
        {
          type: "single", shuffle: true,
          q: R`A lapok hivatkozási gráfjában ($\mathrm{EK} \to \mathrm{RH}$, $\mathrm{NY} \to \mathrm{EK}$, $\mathrm{VN} \to \mathrm{RH}$, $\mathrm{VN} \to \mathrm{NY}$) a Vidéki Naplóról indul az olvasó, és a nyilak mentén kattint. Mi történik hosszú távon?`,
          options: [
            R`Legfeljebb 3 lépés után a Reggeli Hírlapon ragad: onnan nem vezet ki link, a $d_i/2m$ képlet itt nem érvényes.`,
            R`A fokszámmal arányos időt tölt minden lapon: $\pi_i = d_i/2m$.`,
            "Egyenletesen oszlik el a négy lap között.",
            "A Vidéki Napló és a Reggeli Hírlap között oszcillál, mint a páros gráfon."
          ],
          answer: 0,
          hint: "Van-e a Reggeli Hírlapnak kimenő éle? Hová léphet onnan az olvasó?",
          explain: R`Az $\mathrm{RH}$ kifoka 0: aki odaér, nem tud továbblépni – a séta beragad. A Vidéki Naplóról $\mathrm{VN} \to \mathrm{RH}$ (1 lépés) vagy $\mathrm{VN} \to \mathrm{NY} \to \mathrm{EK} \to \mathrm{RH}$ (3 lépés) vezet oda. A $d_i/2m$ csak irányítatlan gráfra igaz – irányított gráfon alkalmazni tipikus hiba. Oszcillációról sincs szó: az $\mathrm{RH}$-ról nincs visszaút. A javítás a teleportálás: a PageRank (5. fejezet).`
        },
        {
          type: "multi",
          q: "Melyik következtetés helyes az Árvízhét elemzése alapján? (Több jó válasz is lehet.)",
          options: [
            "A „ki nyer” kérdés a modelltől függ: súlyozva más lett a győztes, ezért az eredményt a modellel együtt kell közölni.",
            "Hét csúcson a két szál szemléltetés, nem felfedezés: valódi szerkezetet nullmodellel kellene ellenőrizni.",
            "A Fiedler-vektor akkor is két részt ad, ha a gráfban nincs is két csoport.",
            "A Fiedler-vágás bizonyítja, hogy a hírekben pontosan két szál van.",
            "A véletlen séta eredménye nem függ attól, hogy súlyozunk-e."
          ],
          answer: [0, 1, 2],
          hint: "Melyik állítás állít többet, mint amit egy 7 csúcsú gráf és egy választott modell alátámaszt?",
          explain: R`A „linkek = együttes említések” és az „egyenletes választás” a mi döntésünk; súlyozva a Polgármester nyert a holtverseny helyett – tehát a séta igenis függ a súlyozástól. Hét csúcs és 12 cikk kevés ahhoz, hogy felfedezésről beszéljünk: ehhez nullmodell kell (7. és 10. fejezet). A Fiedler-vektor mindig két részt ad, akkor is, ha nincs (vagy három van) csoport – hogy hány csoport van, azt a közösségkeresés dönti el (8. fejezet).`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh4-final": {
      title: "Fejezetzáró teszt – Gráfok és mátrixok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Élek: $AB$, $AC$, $AD$, $CD$; az értékek $\mathbf x = (2, 4, 1, 3)$ ($A, B, C, D$ sorrendben). Mennyi a szomszédátlag az $A$ csúcsnál, $(D^{-1}A\mathbf x)_A$?`,
          options: [
            R`$\frac83 \approx 2{,}67$`,
            R`$2{,}5$`,
            R`$2$`,
            R`$8$`
          ],
          answer: 0,
          hint: "Kik az A szomszédai? Összeadod az értéküket, aztán mivel osztasz?",
          explain: R`Az $A$ szomszédai $B, C, D$: összegük $(A\mathbf x)_A = 4 + 1 + 3 = 8$, a fokszám $d_A = 3$, az átlag $8/3 \approx 2{,}67$. A $2{,}5 = (8 + 2)/4$ a saját értéket is beszámolja (az az $A + I$ lenne). A $2 = 8/4$ a csúcsok számával ($n$) oszt a fokszám helyett, a 8 pedig az osztás nélküli szomszédösszeg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a gráfban (élek $AB$, $AC$, $AD$, $CD$) mennyi a véletlen séta átmenetmátrixában $P_{AC}$ és $P_{CA}$?`,
          options: [
            R`$P_{AC} = \frac13$, $P_{CA} = \frac12$`,
            R`$P_{AC} = \frac12$, $P_{CA} = \frac13$`,
            R`$P_{AC} = P_{CA} = \frac14$`,
            R`$P_{AC} = P_{CA} = \frac13$`
          ],
          answer: 0,
          hint: R`$P_{ij} = A_{ij}/d_i$: az <b>induló</b> csúcs fokszámával osztunk.`,
          explain: R`$d_A = 3$, $d_C = 2$. Az $A$-ból 3 link közül választ: $P_{AC} = \frac13$; a $C$-ből kettő közül: $P_{CA} = \frac12$. A felcserélt változat a cél fokszámával ($1/d_j$) oszt. Az $\frac14 = 1/n$ nem a linkekből jön. A $P$ – az $A$-val ellentétben – általában nem szimmetrikus: a sorösszege 1, az oszlopösszege nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanitt (élek $AB$, $AC$, $AD$, $CD$; fokszámok $3, 1, 2, 2$) mennyi a stacionárius eloszlás $\pi_A$ eleme?`,
          options: [
            R`$\frac38$`,
            R`$\frac34$`,
            R`$\frac14$`,
            R`$\frac13$`
          ],
          answer: 0,
          hint: R`Hány éle van a gráfnak? A képletben $m$ vagy $2m$ áll a nevezőben?`,
          explain: R`$m = 4$, $2m = 8$, $\pi_A = d_A/2m = 3/8$. A $\frac34 = d_A/m$ – ekkor az összeg 2 lenne. Az $\frac14$ az egyenletes eloszlás (csak szabályos gráfon helyes), az $\frac13 = 1/d_A$ az átmenet-valószínűség, nem a tartózkodási idő. A gráfban van háromszög ($ACD$), tehát nem páros, így a séta bárhonnan ide konvergál.`
        },
        {
          type: "multi",
          q: R`Melyik gráfon konvergál a véletlen séta eloszlása $\mathbf p_t$ <b>bármely</b> csúcsból indítva? (Több jó válasz is lehet.)`,
          options: [
            R`a háromszög ($K_3$)`,
            R`az 5 hosszú kör ($C_5$)`,
            R`a 4 hosszú kör ($C_4$)`,
            "a 3 levelű csillag",
            "a 3 csúcsú út"
          ],
          answer: [0, 1],
          hint: "Összefüggő gráfon egyetlen dolog akadályozza a konvergenciát. Melyik gráf színezhető két színnel úgy, hogy a szomszédok különbözzenek?",
          explain: R`A $K_3$ és a $C_5$ összefüggő, és páratlan kört tartalmaz, tehát nem páros: $\mathbf p_t \to \boldsymbol\pi$. A $C_4$, a csillag és a 3 csúcsú út páros: a séta páros lépésszámnál az egyik, páratlannál a másik osztályban van – oszcillál. A stacionárius eloszlás ott is létezik, csak $\mathbf p_t$ nem tart hozzá. A „mindig konvergál” tipikus hiba; a javítás a lusta séta.`
        },
        {
          type: "single", shuffle: true,
          q: R`Lusta séta a csillagon (középen $A$, levelek $B, C, D$): minden lépésben $\frac12$ eséllyel helyben marad, különben a szokásos módon lép. A középről indulva mi $\mathbf p_1$?`,
          options: [
            R`$(\frac12,\ \frac16,\ \frac16,\ \frac16)$`,
            R`$(0,\ \frac13,\ \frac13,\ \frac13)$`,
            R`$(\frac14,\ \frac14,\ \frac14,\ \frac14)$`,
            R`$(1,\ 0,\ 0,\ 0)$`
          ],
          answer: 0,
          hint: R`$P' = \frac12(I + P)$: fele eséllyel marad, fele eséllyel a sima séta egy lépését teszi.`,
          explain: R`$\frac12$ eséllyel marad a középen; $\frac12$ eséllyel a három levél egyikére lép, mindegyikre $\frac12 \cdot \frac13 = \frac16$. Így $\mathbf p_1 = (\frac12, \frac16, \frac16, \frac16)$ – ez éppen a stacionárius $\boldsymbol\pi$ ($\pi_i = d_i/2m$, $2m = 6$), tehát már egy lépés után beállt. A $(0, \frac13, \frac13, \frac13)$ a sima séta lépése (az oszcillál), az egyenletes eloszlás nem stacionárius itt, az $(1, 0, 0, 0)$ pedig elfelejti, hogy csak fele eséllyel marad.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hatványiteráció: élek $AB$, $AC$, $AD$, $CD$, $\mathbf x_0 = \mathbf 1$. Mi $\mathbf x_1$, ha a legnagyobb elemre normálunk?`,
          options: [
            R`$(1;\ 0{,}33;\ 0{,}67;\ 0{,}67)$`,
            R`$(3;\ 1;\ 2;\ 2)$`,
            R`$(0{,}375;\ 0{,}125;\ 0{,}25;\ 0{,}25)$`,
            R`$(1;\ 0{,}5;\ 0{,}75;\ 0{,}75)$`
          ],
          answer: 0,
          hint: R`Először $A\mathbf 1$ – mit ad ez minden csúcsra? Utána oszd el a legnagyobb elemmel.`,
          explain: R`$A\mathbf 1$ a fokszámvektor: $(3, 1, 2, 2)$; a legnagyobbal (3) osztva $(1;\ 0{,}33;\ 0{,}67;\ 0{,}67)$. A $(3, 1, 2, 2)$ normálatlan; a $(0{,}375; \dots)$ az összegre normált (ez is skála, de nem a kért) – a sorrend és az arányok ugyanazok. Az $(1;\ 0{,}5;\ 0{,}75;\ 0{,}75)$ az $(A + I)\mathbf 1 = (4, 2, 3, 3)$ normálva: a saját értéket is beszámolta.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy összefüggő gráfnak 8 csúcsa és 12 éle van, a legnagyobb fokszám 5. Mit tudsz a szomszédsági mátrix legnagyobb sajátértékéről, $\lambda_1$-ről?`,
          options: [
            R`$3 \le \lambda_1 \le 5$`,
            R`$1{,}5 \le \lambda_1 \le 5$`,
            R`$3 \le \lambda_1 \le 12$`,
            R`$\lambda_1 = 3$ pontosan`
          ],
          answer: 0,
          hint: R`A korlátok: az átlagos fokszám és a legnagyobb fokszám. Mennyi az átlagos fokszám a kézfogási lemmával?`,
          explain: R`$\frac{2m}{n} = \frac{24}{8} = 3 \le \lambda_1 \le d_{\max} = 5$. Az $1{,}5 = m/n$ – kimaradt a kettes a kézfogási lemmából. A 12 az élek száma, nem fokszám. „Pontosan 3” csak 3-szabályos gráfra igaz, itt pedig van 5-ös fokszámú csúcs.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a sajátvektorokra és a hatványiterációra? (Több jó válasz is lehet.)",
          options: [
            R`Ha $\mathbf v$ sajátvektor, akkor $2\mathbf v$ és $-\mathbf v$ is az, ugyanazzal a $\lambda$-val.`,
            R`Összefüggő gráfon a $\lambda_1$-hez tartozó sajátvektor választható minden csúcson pozitívnak.`,
            R`Páros gráfon $-\lambda_1$ is sajátérték, ezért a hatványiteráció oszcillálhat.`,
            "A hatványiteráció a legkisebb sajátértékhez tartozó sajátvektorhoz tart.",
            "A sajátvektor negatív eleme azt jelenti, hogy a csúcs kevésbé fontos a többinél."
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig a $\mathbf x_0 = c_1\mathbf v_1 + c_2\mathbf v_2 + \dots$ felbontást: $k$ szorzás után melyik tag nő a leggyorsabban?`,
          explain: R`$A(c\mathbf v) = c\lambda\mathbf v$, így minden nem nulla számszoros sajátvektor – a sajátvektor nem egyértelmű, és az előjele önkényes, nem jelent semmit. A Perron–Frobenius-tétel szerint összefüggő gráfon a domináns sajátvektor pozitívra választható. Páros gráfon a spektrum szimmetrikus, $-\lambda_1$ is sajátérték, ezért pl. a csillagon a vektor két állapot között váltakozik. A hatványiteráció a <b>legnagyobb</b> abszolút értékű sajátértékhez tart, mert az ő tagja nő a leggyorsabban.`
        },
        {
          type: "single", shuffle: true,
          q: R`A barátsággráfban (élek $AB$, $AC$, $BC$, $CD$) legyen $\mathbf x = (2, 0, 1, 1)$ ($A, B, C, D$). Mennyi $\mathbf x^\top L\,\mathbf x$?`,
          options: ["6", "12", "4", "3"],
          answer: 0,
          hint: "Menj végig a 4 élen, és add össze a különbségek négyzetét.",
          explain: R`$AB$: $(2 - 0)^2 = 4$; $AC$: $(2 - 1)^2 = 1$; $BC$: $(0 - 1)^2 = 1$; $CD$: $(1 - 1)^2 = 0$. Összesen 6. A 12 minden élt kétszer számol, a 4 a négyzet nélküli $2 + 1 + 1 + 0$, a 3 a 6 fele.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 6 csúcsú gráf Laplace-spektruma $0;\ 0;\ 0;\ 1;\ 2;\ 3$. Hány komponense van?`,
          options: ["3", "1", "6", "2"],
          answer: 0,
          hint: "Melyik sajátérték multiplicitása számolja a komponenseket?",
          explain: R`A 0 háromszor szerepel, tehát 3 komponens (pl. egy 3 csúcsú út, egy él és egy izolált csúcs adja pontosan ezt a spektrumot). Az 1 abból jön, hogy „a $\mu_1 = 0$ mindig ott van” – de a többi nulla is komponenst jelent. A 6 a csúcsok száma. A 2 az izolált csúcsot nem számolja komponensnek – pedig az is az.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $12$, $13$, $23$, $34$, $45$, $46$, $56$, $25$. A felosztás $\{1, 2, 3\} \mid \{4, 5, 6\}$, $\mathbf x = (1, 1, 1, -1, -1, -1)$. Mennyi $\mathbf x^\top L\,\mathbf x$?`,
          options: ["8", "2", "4", "16"],
          answer: 0,
          hint: "Melyik élek futnak a két csoport között? Egy ilyen él mennyit ad a ±1-es jelölésnél?",
          explain: R`A csoportok között a $34$ és a $25$ fut: 2 vágott él. Mindegyiken $(1 - (-1))^2 = 4$, így $\mathbf x^\top L\mathbf x = 4 \cdot 2 = 8$. A 2 a vágás mérete (a 4-es szorzó nélkül), a 4 egyetlen él járuléka (egy vágott élt elfelejtett), a 16 az élenként kétszeri számolás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 12 csúcsú összefüggő gráfra $\mu_2 = 1$. Találtál egy 6–6-os kettévágást, amely 3 élt vág el. Mit mondhatsz róla?`,
          options: [
            "Optimális: pontosan kiegyensúlyozott vágás ennél kevesebb élt nem vághat el.",
            "Lehetetlen: a korlát szerint legalább 12 élt kell elvágni.",
            "Lehet, hogy van jobb is: a korlát csak annyit mond, hogy legalább 1 él kell.",
            "Biztosan a Fiedler-vágás, mert a Fiedler-vágás mindig optimális."
          ],
          answer: 0,
          hint: R`Számold ki az alsó korlátot: vágás $\ge n\mu_2/4$.`,
          explain: R`Minden pontosan kiegyensúlyozott kettévágásra vágás $\ge n\mu_2/4 = 12 \cdot 1/4 = 3$. A talált vágás eléri a korlátot, tehát optimális. A „legalább 12” elfelejti a 4-es osztót (vágás $\ne \mathbf x^\top L\mathbf x$). A „legalább 1” csak az összefüggőségből jönne, a $\mu_2$ ennél többet mond. A Fiedler-vágás pedig nem mindig optimális – itt a korlát bizonyítja az optimalitást, nem a módszer.`
        },
        {
          type: "match",
          q: "Párosítsd a fejezet eszközeit azzal, amire használtuk őket!",
          pairs: [
            [R`$A\mathbf x$`, "szomszédok értékének összege"],
            [R`$P = D^{-1}A$`, "a véletlen séta átmenetmátrixa"],
            [R`$\pi_i = d_i/2m$`, "hol tölti az idejét az olvasó (irányítatlan gráfon)"],
            [R`a domináns sajátvektor`, "az a fontos, akinek fontos szomszédai vannak"],
            [R`a Fiedler-vektor`, "kettévágás előjel szerint"]
          ],
          hint: "Melyik válaszol a „hová áll be a séta?”, és melyik a „hol vágjuk ketté?” kérdésre?",
          explain: R`$A\mathbf x$ a szomszédösszeg (4.1); a $P = D^{-1}A$ ugyanaz a mátrix, amely szomszédátlagot számol, de balról szorozva a valószínűséget adja tovább (4.2). A $\pi_i = d_i/2m$ felelt az olvasó idejére – irányított gráfon nem érvényes. A domináns sajátvektor (4.3) a fokszámot finomítja: a szomszédok fontosságát is számítja. A Fiedler-vektor (4.4–4.5) a legsimább nem konstans jel, az előjele adja a kettévágást.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét Fiedler-vágása $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\} \mid \{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$ ($\mathbf x^\top L\mathbf x = 8$). Mennyi lesz $\mathbf x^\top L\mathbf x$, ha az Önkénteseket átteszed az országos oldalra? (Az $\text{Ön}$ szomszédai: $\mathrm{La}$, $\mathrm{Po}$.)`,
          options: ["16", "8", "12", "4"],
          answer: 0,
          hint: R`Számold meg újra a két oldal közötti éleket: melyik vágott él marad, melyik szűnik meg, melyik új?`,
          explain: R`Az új felosztás $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}, \text{Ön}\} \mid \{\mathrm{Po}, \mathrm{La}\}$. Vágott élek: $\mathrm{Ko}$–$\mathrm{Po}$, $\mathrm{Vi}$–$\mathrm{Po}$ (megmaradnak), és új: $\mathrm{La}$–$\text{Ön}$, $\mathrm{Po}$–$\text{Ön}$. Ez 4 él, $\mathbf x^\top L\mathbf x = 4 \cdot 4 = 16$. A 8 a régi érték (mintha az $\text{Ön}$ élei nem változnának), a 12 csak az egyik új élt számolja, a 4 a vágott élek száma a 4-es szorzó nélkül. A rosszabb vágás azt mutatja: az $\text{Ön}$ (Fiedler-értéke $0{,}52$) biztosan a helyi oldalra tartozik.`
        }
      ]
    },

}; return Q; })();
