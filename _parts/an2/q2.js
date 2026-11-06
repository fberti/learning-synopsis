    /* ------------------------------------------------ 2.5 */
    "an2-25": {
      title: "Kvíz – 2.5 Nevezetes határértékek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{3^{n+1} - 2^n}{3^n + 2^{n+1}} = ?$`,
          options: [R`$3$`, R`$1$`, R`$-\tfrac12$`, R`$+\infty$`],
          answer: 0,
          hint: R`Írd át a $3^{n+1}$-et és a $2^{n+1}$-et, aztán oszd el mindent a legnagyobb alap hatványával!`,
          explain: R`$3^{n+1} = 3\cdot3^n$, $2^{n+1} = 2\cdot2^n$. $3^n$-nel osztva: $\dfrac{3 - \left(\frac23\right)^n}{1 + 2\left(\frac23\right)^n} \to \dfrac{3 - 0}{1 + 0} = 3$. Az $1$ abból jön, hogy $3^{n+1}$-et $3^n + 1$-nek veszed; a $-\tfrac12$ abból, hogy a kisebb alap ($2^n$) tagjait tartod meg; a $+\infty$ abból, hogy azt hiszed, a $3^{n+1}$ „gyorsabb”, mint a $3^n$ – pedig csak 3-szorosa.`
        },
        {
          type: "match",
          q: R`Párosítsd a sorozatokat a határértékükkel!`,
          pairs: [
            [R`$(-0{,}7)^n$`, "0"],
            [R`$(-1{,}2)^n$`, "nincs határértéke"],
            [R`$1^n$`, "1"],
            [R`$1{,}01^n$`, "+végtelen"]
          ],
          hint: R`Csak a $q$ számít: $|q| \lt 1$? $q = 1$? $q \gt 1$? $q \le -1$?`,
          explain: R`$|-0{,}7| \lt 1$, ezért $(-0{,}7)^n \to 0$ (cikázva). $q = -1{,}2 \le -1$: az előjel váltakozik, az abszolút érték nő – nincs határértéke (nem $+\infty$, és nem is $-\infty$!). $1^n = 1$ minden $n$-re. $1{,}01 \gt 1$, ezért a $1{,}01^n$ minden határon túl nő – lassan, de biztosan.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \sqrt[n]{5^n + 3^n} = ?$`,
          options: [R`$5$`, R`$1$`, R`$8$`, R`$+\infty$`],
          answer: 0,
          hint: R`Fogd közre a gyök alatti összeget a legnagyobb tag segítségével, és használd a rendőrelvet!`,
          explain: R`$5^n \le 5^n + 3^n \le 2\cdot5^n$, ezért $5 \le \sqrt[n]{5^n + 3^n} \le \sqrt[n]2\cdot5 \to 5$. A határérték $5$: a gyök alatt a legnagyobb alap „nyer”. Az $1$ a tévhit, hogy minden $n$-edik gyök 1-hez tart (csak akkor igaz, ha a gyök alatt nincs exponenciális növekedés). A $8$ a $\sqrt[n]{a + b} = \sqrt[n]a + \sqrt[n]b$ hiba.`
        },
        {
          type: "multi",
          q: R`Melyik sorozat tart 1-hez?`,
          options: [R`$\sqrt[n]{100}$`, R`$\sqrt[n]{n^2}$`, R`$\sqrt[n]{2^n}$`, R`$\left(1 + \tfrac1n\right)^n$`, R`$\left(1 + \tfrac1{n^2}\right)^n$`],
          answer: [0, 1, 4],
          hint: R`Nézd meg, mi van a gyök alatt (szám, polinom vagy exponenciális?), és az $1^\infty$ alakoknál ne feltételezd, hogy az eredmény 1!`,
          explain: R`$\sqrt[n]{100} \to 1$ (bármely pozitív számra), $\sqrt[n]{n^2} = \left(\sqrt[n]n\right)^2 \to 1$. Viszont $\sqrt[n]{2^n} = 2$ minden $n$-re. Az $\left(1 + \tfrac1n\right)^n \to e$ – az $1^\infty$ kritikus alak, nem 1. Az $\left(1 + \tfrac1{n^2}\right)^n$ szintén $1^\infty$ alakú, de itt az alap olyan gyorsan közelít az 1-hez, hogy a határérték tényleg 1 (a 2.5 buktató-dobozának példája).`
        },
        {
          type: "set",
          q: R`Jelöld ki azokat a hányadosokat, amelyek 0-hoz tartanak!`,
          items: [R`$\dfrac{n^{100}}{1{,}01^n}$`, R`$\dfrac{n!}{50^n}$`, R`$\dfrac{\ln n}{n}$`, R`$\dfrac{n^n}{n!}$`, R`$\dfrac{3^n}{2^n}$`],
          answer: [R`$\dfrac{n^{100}}{1{,}01^n}$`, R`$\dfrac{\ln n}{n}$`],
          hint: R`Használd a rangsort: $\ln n \ll n^k \ll a^n \ll n! \ll n^n$. Ha a nevező áll feljebb, a hányados 0-hoz tart.`,
          explain: R`$n^{100} \ll 1{,}01^n$ (bármilyen nagy a kitevő és bármilyen kicsi az alap 1 fölött) és $\ln n \ll n$, ezért ez a kettő 0-hoz tart. A $\tfrac{n!}{50^n}$ és az $\tfrac{n^n}{n!}$ fordítva áll: a számláló van feljebb, ezek $+\infty$-hez tartanak. A $\tfrac{3^n}{2^n} = 1{,}5^n \to \infty$. Vigyázz: kis $n$-re (pl. $n = 10$) a $n^{100}$ jóval nagyobb, mint a $1{,}01^n$ – a rangsor a „végső” sorrend.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{n^3 + 4^n}{n^{10} + 2\cdot4^n} = ?$`,
          options: [R`$\tfrac12$`, R`$0$`, R`$1$`, R`$2$`],
          answer: 0,
          hint: R`Melyik tag a domináns a számlálóban és a nevezőben? A polinom fokának nagysága itt nem számít.`,
          explain: R`$4^n$-nel osztva: $\dfrac{\frac{n^3}{4^n} + 1}{\frac{n^{10}}{4^n} + 2} \to \dfrac{0 + 1}{0 + 2} = \tfrac12$, mert minden polinom eltörpül az exponenciális mellett. A $0$ abból jön, hogy a nevező $n^{10}$-ét tartod erősebbnek (rangsor felcserélése); az $1$ a „$\tfrac\infty\infty = 1$” hiba; a $2$ a fordított hányados.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \left(\dfrac{n + 3}{n}\right)^n = ?$`,
          options: [R`$e^3$`, R`$1$`, R`$e$`, R`$+\infty$`],
          answer: 0,
          hint: R`Bontsd fel a törtet: $\dfrac{n + 3}{n} = 1 + \dfrac{?}{n}$. Melyik nevezetes határérték ez?`,
          explain: R`$\left(\tfrac{n + 3}{n}\right)^n = \left(1 + \tfrac3n\right)^n \to e^3 \approx 20{,}09$ (az $\left(1 + \tfrac xn\right)^n \to e^x$ szabály $x = 3$-mal). Az $1$ az „$1^\infty = 1$” tévhit, az $e$ abból jön, hogy a számlálóban lévő 3-at elfelejted, a $+\infty$ abból, hogy csak a kitevőt nézed. Az $1^\infty$ kritikus alak – átalakítás kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \left(1 + \dfrac1{3n}\right)^n = ?$`,
          options: [R`$\sqrt[3]{e}$`, R`$e$`, R`$e^3$`, R`$1$`],
          answer: 0,
          hint: R`A nevezetes alakban a kitevő ugyanaz, mint a nevező. Itt mi a nevező, és mi a kitevő?`,
          explain: R`$\left(1 + \tfrac1{3n}\right)^n = \left[\left(1 + \tfrac1{3n}\right)^{3n}\right]^{1/3} \to e^{1/3} = \sqrt[3]e \approx 1{,}396$. Másképp: $\tfrac1{3n} = \tfrac{1/3}{n}$, tehát $x = \tfrac13$. Az $e$ abból jön, hogy a kitevőt nem illeszted a nevezőhöz; az $e^3$ abból, hogy rossz irányba szorzol; az $1$ az „$1^\infty = 1$” hiba.`
        }
      ]
    },

    /* ------------------------------------------------ 2.6 */
    "an2-26": {
      title: "Kvíz – 2.6 Végtelen sorok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$2 + \tfrac23 + \tfrac29 + \tfrac2{27} + \cdots = ?$`,
          options: [R`$3$`, R`$1$`, R`$\tfrac32$`, R`$6$`],
          answer: 0,
          hint: R`Mértani sor: mi az első tag és mi a kvóciens? Teljesül-e $|q| \lt 1$?`,
          explain: R`$a = 2$, $q = \tfrac13$, $|q| \lt 1$: az összeg $\dfrac{a}{1 - q} = \dfrac{2}{2/3} = 3$. Az $1$ rossz első taggal ($a = \tfrac23$) jön ki, a $\tfrac32$ az $\tfrac{a}{1 + q}$ előjelhiba, a $6$ az $\tfrac aq$ (az $1 - q$ helyett $q$-val osztva).`
        },
        {
          type: "single", shuffle: true,
          q: R`Írd fel törtként: $0{,}\dot2\dot7 = 0{,}272727\ldots$`,
          options: [R`$\tfrac3{11}$`, R`$\tfrac{27}{100}$`, R`$\tfrac3{10}$`, R`$\tfrac1{37}$`],
          answer: 0,
          hint: R`Bontsd mértani sorra: $0{,}27 + 0{,}0027 + \cdots$ Mennyivel szorzódik egy tag a következőig?`,
          explain: R`$a = 0{,}27$, $q = 0{,}01$: $\dfrac{0{,}27}{0{,}99} = \dfrac{27}{99} = \dfrac{3}{11}$. A $\tfrac{27}{100}$ csak a véges $0{,}27$; a $\tfrac3{10} = \tfrac{27}{90}$ a rossz kvóciens ($q = 0{,}1$); az $\tfrac1{37} = \tfrac{27}{999}$ háromjegyű ismétlődést feltételez ($q = 0{,}001$).`
        },
        {
          type: "multi",
          q: R`Melyik sor konvergens?`,
          options: [R`$\sum\limits_{n=1}^\infty \left(\tfrac34\right)^n$`, R`$\sum\limits_{n=1}^\infty \dfrac{n}{n + 1}$`, R`$\sum\limits_{n=1}^\infty \dfrac1n$`, R`$\sum\limits_{n=1}^\infty \dfrac1{n^2}$`, R`$\sum\limits_{n=1}^\infty (-1)^n$`],
          answer: [0, 3],
          hint: R`Először: tartanak-e a tagok 0-hoz? Ha igen, az még nem elég – milyen ismert sorral lehet összevetni?`,
          explain: R`$\sum\left(\tfrac34\right)^n$ mértani sor, $|q| \lt 1$: konvergens (összege 3). $\sum\tfrac1{n^2}$ konvergens (összege $\tfrac{\pi^2}6$). A $\tfrac{n}{n + 1} \to 1 \ne 0$ és a $(-1)^n$ tagjai sem tartanak 0-hoz: divergensek. A harmonikus sor $\sum\tfrac1n$ tagjai 0-hoz tartanak, mégis divergens (Oresme).`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik állítás igaz minden $\sum a_n$ sorra?`,
          options: [
            R`Ha a sor konvergens, akkor $a_n \to 0$.`,
            R`Ha $a_n \to 0$, akkor a sor konvergens.`,
            R`Ha $a_n \to 0$, akkor a sor divergens.`,
            R`Ha a sor konvergens, az összege $\lim a_n$.`
          ],
          answer: 0,
          hint: R`Gondolj a harmonikus sorra és a mértani sorra: mindkettőnek 0-hoz tartanak a tagjai. Mi a különbség köztük?`,
          explain: R`A szükséges feltétel: konvergens sor tagjai 0-hoz tartanak ($a_n = S_n - S_{n-1} \to S - S = 0$). Megfordítva nem igaz: $\sum\tfrac1n$ divergens, pedig $\tfrac1n \to 0$; és $\sum\tfrac1{2^n}$ konvergens, tehát a „divergens” sem következik. Sor ≠ sorozat: a $\sum\tfrac1{2^n}$ összege 1, a $\tfrac1{2^n}$ sorozat határértéke 0.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\displaystyle\sum_{n=1}^\infty \left(\frac1{n + 1} - \frac1{n + 2}\right) = ?$`,
          options: [R`$\tfrac12$`, R`$1$`, R`$0$`, R`$\tfrac32$`],
          answer: 0,
          hint: R`Írd fel az első néhány tagot, és nézd meg, mi ejti ki egymást. Mi marad meg az $S_n$-ben?`,
          explain: R`Teleszkópösszeg: $S_n = \left(\tfrac12 - \tfrac13\right) + \left(\tfrac13 - \tfrac14\right) + \cdots + \left(\tfrac1{n + 1} - \tfrac1{n + 2}\right) = \tfrac12 - \tfrac1{n + 2} \to \tfrac12$. Az $1$ akkor jön ki, ha azt hiszed, az első tag $1$ (mint a $\sum\left(\tfrac1n - \tfrac1{n + 1}\right)$-nél); a $0$, ha „minden kiesik”; a $\tfrac32$ a két lépés távolságra kiejtő $\sum\left(\tfrac1n - \tfrac1{n + 2}\right)$ összege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy labdát 3 m magasról leejtünk; minden pattanás után az előző magasság felére emelkedik. Mekkora utat tesz meg összesen?`,
          options: ["9 m", "6 m", "12 m", "15 m"],
          answer: 0,
          hint: R`Az első esés egyszeri. Utána minden pattanás kétszer számít (fel és le). Mi az első felfelé út hossza?`,
          explain: R`Lefelé először 3 m. Utána fel-le: $2\cdot(1{,}5 + 0{,}75 + \cdots) = 2\cdot\dfrac{1{,}5}{1 - 0{,}5} = 2\cdot3 = 6$ m. Összesen $3 + 6 = 9$ m. A 6 m csak a lefelé utakat számolja ($\tfrac{3}{1 - 1/2}$), a 12 m az első esést is duplán veszi ($2\cdot6$), a 15 m rossz első taggal jön ki ($3 + 2\cdot\tfrac{3}{1/2}$: a mértani sor a 3 m-rel indul, pedig az első pattanás csak 1,5 m).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit mond a hányadoskritérium a $\displaystyle\sum_{n=1}^\infty \frac{n}{3^n}$ sorról?`,
          options: [
            R`Konvergens, mert $\tfrac{a_{n+1}}{a_n} \to \tfrac13 \lt 1$.`,
            R`Divergens, mert $\tfrac{a_{n+1}}{a_n} \to 3 \gt 1$.`,
            R`Nem dönt, mert $\tfrac{a_{n+1}}{a_n} \to 1$.`,
            R`Divergens, mert a számláló a végtelenbe tart.`
          ],
          answer: 0,
          hint: R`Írd fel $a_{n+1}$-et, és oszd el $a_n$-nel. A hatványok szépen egyszerűsödnek.`,
          explain: R`$\dfrac{a_{n+1}}{a_n} = \dfrac{n + 1}{3^{n+1}}\cdot\dfrac{3^n}{n} = \dfrac{n + 1}{3n} \to \dfrac13 \lt 1$: konvergens (az összege egyébként $\tfrac34$). A $3$ a fordított hányados ($\tfrac{a_n}{a_{n+1}}$), az „1” abból jön, ha csak az $\tfrac{n + 1}{n}$ részt nézed. A számláló növekedése nem számít: a $3^n$ sokkal gyorsabban nő (rangsor).`
        },
        {
          type: "single", shuffle: true,
          q: R`Konvergens-e a $\displaystyle\sum_{n=1}^\infty \frac1{3n} = \frac13 + \frac16 + \frac19 + \cdots$ sor?`,
          options: [
            R`Divergens: ez a harmonikus sor harmada.`,
            R`Konvergens: mértani sor $q = \tfrac13$-dal, összege $\tfrac12$.`,
            R`Konvergens, mert a tagok 0-hoz tartanak.`,
            R`Konvergens, mert minden tag legfeljebb $\tfrac13$.`
          ],
          answer: 0,
          hint: R`Vigyázz: $\tfrac1{3n}$ nem ugyanaz, mint $\tfrac1{3^n}$. Emeld ki az $\tfrac13$-ot!`,
          explain: R`$\sum\tfrac1{3n} = \tfrac13\sum\tfrac1n$, a részletösszegek $\tfrac13 H_n \to \infty$: divergens. A mértani sor a $\sum\tfrac1{3^n} = \tfrac12$ lenne – más sor. Az $a_n \to 0$ csak szükséges feltétel, nem elégséges; a „minden tag kicsi” pedig semmit sem bizonyít (a $\sum\tfrac13$ is divergens).`
        }
      ]
    },

    /* ------------------------------------------------ 2.7 */
    "an2-27": {
      title: "Kvíz – 2.7 Pénzügyi számítások",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`50 000 Ft-ot teszel be évi 4%-os kamatos kamatra. Mennyi lesz 3 év múlva?`,
          options: ["56 243 Ft", "56 000 Ft", "54 080 Ft", "58 493 Ft"],
          answer: 0,
          hint: R`Kamatos kamat: $k_n = k_0q^n$. Mennyi a kamattényező, és hányszor kell vele szorozni?`,
          explain: R`$q = 1{,}04$, $k_3 = 50\,000\cdot1{,}04^3 \approx 56\,243$ Ft. Az 56 000 Ft az egyszerű kamat ($3\cdot4\% = 12\%$, a kamat nem kamatozik tovább); az 54 080 Ft $q^2$-vel, a 58 493 Ft $q^4$-nel számol – eggyel elcsúszott kitevő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Évi 9%-os kamatos kamattal mikorra duplázódik meg a pénz (a kamatot év végén írják jóvá)?`,
          options: ["a 9. év végére", "a 8. év végére", "a 12. év végére", "a 7. év végére"],
          answer: 0,
          hint: R`Oldd meg a $1{,}09^n = 2$ egyenletet logaritmussal – és nézd meg, hogyan kell kerekíteni!`,
          explain: R`$n = \dfrac{\ln2}{\ln1{,}09} \approx 8{,}04$. Kerekítés: $1{,}09^8 \approx 1{,}993 \lt 2$, tehát 8 év még nem elég; $1{,}09^9 \approx 2{,}172$ – a 9. év végére duplázódik. A 8. év a lefelé kerekítés hibája (mint a 9,006 → 9 csapda), a 12. év az egyszerű kamat ($9\% \cdot n \ge 100\%$), a 7. év a 70-es szabály ($\tfrac{70}{9} \approx 7{,}8$) rossz kerekítése.`
        },
        {
          type: "single", shuffle: true,
          q: R`Évi 8% névleges kamat, negyedéves jóváírással. Mennyi az effektív éves kamatláb?`,
          options: ["8,24%", "8,00%", "8,33%", "36,05%"],
          answer: 0,
          hint: R`Negyedévente mekkora a kamat, és egy év alatt hányszor írják jóvá?`,
          explain: R`Negyedévente $2\%$, 4 jóváírás: $1{,}02^4 - 1 \approx 0{,}0824$, azaz kb. 8,24%. A 8% a névleges kamatláb (nem számol a kamat kamatával), a 8,33% a folytonos kamatozás ($e^{0{,}08} - 1$), a 36,05% a havi/éves keverés: negyedévente a teljes 8%-kal számol ($1{,}08^4 - 1$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a 2 év múlva esedékes 121 000 Ft jelenértéke 10%-os kamatláb mellett?`,
          options: ["100 000 Ft", "98 010 Ft", "110 000 Ft", "96 800 Ft"],
          answer: 0,
          hint: R`Jelenérték: $k_0 = \dfrac{k_n}{q^n}$ – osztani kell a kamattényező hatványával, nem levonni.`,
          explain: R`$k_0 = \dfrac{121\,000}{1{,}1^2} = \dfrac{121\,000}{1{,}21} = 100\,000$ Ft. Ellenőrzés: $100\,000\cdot1{,}1^2 = 121\,000$. A 98 010 Ft abból jön, hogy évente 10%-ot levonsz ($121\,000\cdot0{,}9^2$), a 110 000 Ft csak egy évvel diszkontál, a 96 800 Ft egyszerű kamattal kétszer levonja a 12 100 Ft-ot.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gépért (A) most 300 000 Ft-ot fizetsz, vagy (B) most 160 000 Ft-ot és 2 év múlva újabb 160 000 Ft-ot. 8%-os kamatlábnál melyik a kedvezőbb neked?`,
          options: [
            R`B: a jelenértéke kb. 297 174 Ft.`,
            R`A: a B névlegesen 320 000 Ft.`,
            R`A: a B jelenértéke $160\,000 + 160\,000\cdot1{,}08^2 \approx 346\,624$ Ft.`,
            R`A: a két ajánlat a kamattól függetlenül mindig az A javára dönt.`
          ],
          answer: 0,
          hint: R`Különböző időpontok összegeit csak közös időpontra (pl. mára) átszámolva szabad összeadni.`,
          explain: R`B jelenértéke: $160\,000 + \dfrac{160\,000}{1{,}08^2} \approx 160\,000 + 137\,174 = 297\,174$ Ft $\lt 300\,000$ Ft, tehát B a kedvezőbb. A 320 000 Ft a névleges összegek összeadása (tilos!), a 346 624 Ft rossz irányba kamatoztat (a jövőbeli összeget szorozni kell $q^{-n}$-nel, nem $q^n$-nel).`
        },
        {
          type: "single", shuffle: true,
          q: R`3 éven át minden év elején 10 000 Ft-ot teszel be évi 10%-ra. Mennyi lesz a 3. év végén?`,
          options: ["36 410 Ft", "33 100 Ft", "30 000 Ft", "36 000 Ft"],
          answer: 0,
          hint: R`Az első befizetés 3 évet, a második 2-t, az utolsó 1 évet kamatozik. Ez mértani sorozat összege.`,
          explain: R`$S = 10\,000\cdot(1{,}1 + 1{,}1^2 + 1{,}1^3) = 10\,000\cdot1{,}1\cdot\dfrac{1{,}1^3 - 1}{0{,}1} = 36\,410$ Ft (gyűjtőjáradék, év eleji befizetés: $aq\tfrac{q^n - 1}{q - 1}$). A 33 100 Ft az év végi befizetés képlete (elmarad az elöl álló $q$), a 30 000 Ft kamat nélkül, a 36 000 Ft egyszerű kamattal ($30\% + 20\% + 10\%$) számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`200 000 Ft hitel, évi 10%, 2 év, minden év végén azonos részlet. Mekkora a részlet (annuitás)?`,
          options: ["115 238 Ft", "120 000 Ft", "121 000 Ft", "100 000 Ft"],
          answer: 0,
          hint: R`A két részlet jelenértékének összege egyenlő a hitellel: $200\,000 = \dfrac{a}{1{,}1} + \dfrac{a}{1{,}1^2}$.`,
          explain: R`$a = V\dfrac{q^n(q - 1)}{q^n - 1} = 200\,000\cdot\dfrac{1{,}21\cdot0{,}1}{0{,}21} \approx 115\,238$ Ft. Ellenőrzés: az 1. év végén $220\,000 - 115\,238 = 104\,762$ Ft tartozás marad, ennek $1{,}1$-szerese éppen a 2. részlet. A 120 000 Ft a „hitel / évek száma + kamat” tévhit (a teljes hitel után számol kamatot, pedig a tartozás csökken), a 121 000 Ft a kamatos végösszeg fele, a 100 000 Ft kamat nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy alapítvány évente (az év végén) 60 000 Ft díjat akar kiosztani örökké, évi 4%-os kamat mellett. Mekkora alaptőke kell?`,
          options: ["1 500 000 Ft", "1 560 000 Ft", "150 000 Ft", "2 400 Ft"],
          answer: 0,
          hint: R`Örökjáradék: a tőke éves kamatának kell fedeznie a kifizetést, hogy a tőke sose fogyjon el.`,
          explain: R`$V = \dfrac{a}{q - 1} = \dfrac{60\,000}{0{,}04} = 1\,500\,000$ Ft – ennek 4%-a éppen 60 000 Ft. Az 1 560 000 Ft az év eleji kifizetéshez kellene ($\tfrac{aq}{q - 1}$, mert az első díjat azonnal ki kell fizetni); a 150 000 Ft a százalék rossz átváltása ($4\% \ne 0{,}4$); a 2 400 Ft a $60\,000\cdot0{,}04$ (szorzás osztás helyett).`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "an2-final": {
      title: "Fejezetzáró teszt – Számsorozatok és sorok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy számtani sorozatban $a_3 = 7$ és $a_8 = 22$. Mennyi az első 10 tag összege, $S_{10}$?`,
          options: [R`$145$`, R`$160$`, R`$130$`, R`$290$`],
          answer: 0,
          hint: R`Hány lépés van $a_3$-tól $a_8$-ig? Ebből $d$, aztán $a_1$ és $a_{10}$, végül a „nézőtér-trükk”.`,
          explain: R`$5d = 22 - 7 = 15$, $d = 3$; $a_1 = 7 - 2\cdot3 = 1$; $a_{10} = 1 + 9\cdot3 = 28$; $S_{10} = \tfrac{10\,(1 + 28)}{2} = 145$. A 160 az $a_{10} = a_1 + 10d$ hiba ($nd$ az $(n - 1)d$ helyett), a 130 eggyel kevesebb lépés ($a_1 + 8d$), a 290 az elfelejtett osztás 2-vel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi igaz az $a_n = \dfrac{n + 2}{n + 1}$ sorozatra ($n \ge 1$)?`,
          options: [
            R`$\inf = 1$ (de nem minimum), $\max = \tfrac32$`,
            R`$\min = 1$, $\max = \tfrac32$`,
            R`$\inf = 1$, $\sup = 2$, maximuma nincs`,
            R`$\min = \tfrac32$, $\sup = 1$`
          ],
          answer: 0,
          hint: R`Írd át: $a_n = 1 + \dfrac{?}{n + 1}$. Nő vagy csökken? Melyik az első tag? Felveszi-e a sorozat a korlátot?`,
          explain: R`$a_n = 1 + \tfrac1{n + 1}$: szigorúan monoton csökken, ezért az első tag a legnagyobb: $\max = a_1 = \tfrac32$. Alulról az 1 a legszorosabb korlát, de egyik tag sem 1, így $\inf = 1$, minimum nincs. A „$\min = 1$” az inf = min összekeverése; a „$\sup = 2$” a 0-tól indexelés hibája ($a_0 = 2$ nem tagja a sorozatnak); a negyedik a monotonitás irányát fordítja meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $a_n = -2^n$ sorozatra $\dfrac{a_{n+1}}{a_n} = 2 \gt 1$. Mit mondhatsz a monotonitásáról?`,
          options: [
            R`Szigorúan monoton csökken; a hányadosmódszer itt nem használható, mert a tagok negatívak.`,
            R`Szigorúan monoton nő, mert a hányados nagyobb 1-nél.`,
            R`Nem monoton, mert a hányados nem 1.`,
            R`Monoton nő, de nem szigorúan.`
          ],
          answer: 0,
          hint: R`Írd fel az első néhány tagot! Milyen tagokra érvényes a hányadosmódszer?`,
          explain: R`A tagok: $-2, -4, -8, \ldots$ – egyre kisebbek, tehát szigorúan monoton csökken (különbséggel: $a_{n+1} - a_n = -2^n \lt 0$). A hányadosmódszer csak pozitív tagokra jó: negatív számmal osztva az egyenlőtlenség iránya megfordul. A „nő, mert a hányados $\gt 1$” pontosan ezt a hibát követi el.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_n = \dfrac{4n - 1}{2n + 3} \to 2$. Mi a legkisebb $N$ küszöbindex $\varepsilon = 0{,}01$-hez (minden $n \gt N$ esetén $|a_n - 2| \lt \varepsilon$)?`,
          options: [R`$N = 348$`, R`$N = 349$`, R`$N = 697$`, R`$N = 350$`],
          answer: 0,
          hint: R`Hozd közös nevezőre $a_n - 2$-t, vedd az abszolút értékét, és oldd meg az egyenlőtlenséget $n$-re. Figyelj a kerekítésre!`,
          explain: R`$|a_n - 2| = \left|\dfrac{4n - 1 - 2(2n + 3)}{2n + 3}\right| = \dfrac{7}{2n + 3} \lt 0{,}01 \iff 2n + 3 \gt 700 \iff n \gt 348{,}5$. Az első jó tag a 349., tehát $N = 348$ (a definícióban $n \gt N$ áll). A 349 az eggyel elcsúszott küszöb ($n \ge$ és $n \gt$ keverése), a 697 a 2-es szorzó elhagyása ($n + 3 \gt 700$), a 350 a $+3$ elhagyása ($2n \gt 700$).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz?`,
          options: [
            R`Minden konvergens sorozat korlátos.`,
            R`Minden korlátos sorozat konvergens.`,
            R`Ha $a_n \to +\infty$, a sorozat divergens.`,
            R`Ha két részsorozat különböző számhoz tart, a sorozat divergens.`,
            R`Ha egy sorozat nem tart $\pm\infty$-hez, akkor konvergens.`
          ],
          answer: [0, 2, 3],
          hint: R`Keress ellenpéldát a gyanús állításokra! Gondolj a $(-1)^n$ és a $(-1)^n n$ sorozatra.`,
          explain: R`Konvergens ⇒ korlátos (a 2.3 tétele), de fordítva nem: a $(-1)^n$ korlátos, mégis divergens. A $\pm\infty$-hez tartó sorozat divergens, csak tágabb értelemben van határértéke. Konvergens sorozat minden részsorozata ugyanoda tart, ezért két különböző részsorozat-határérték divergenciát jelent. Az utolsó hamis: a $(-1)^n n$ se nem konvergens, se nem tart $\pm\infty$-hez.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \left(\sqrt{n^2 + 4n} - n\right) = ?$`,
          options: [R`$2$`, R`$0$`, R`$+\infty$`, R`$4$`],
          answer: 0,
          hint: R`$\infty - \infty$ alak: bővíts a konjugálttal, $\sqrt{n^2 + 4n} + n$-nel!`,
          explain: R`$\sqrt{n^2 + 4n} - n = \dfrac{(n^2 + 4n) - n^2}{\sqrt{n^2 + 4n} + n} = \dfrac{4}{\sqrt{1 + \frac4n} + 1} \to \dfrac42 = 2$. (Hiszen $\sqrt{n^2 + 4n} \approx n + 2$.) A $0$ az „$\infty - \infty = 0$” tévhit, a $+\infty$ a $\sqrt{n^2 + 4n} = n + \sqrt{4n}$ hibából jön, a $4$ abból, hogy a nevezőben csak az egyik tagot ($n$) tartod meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{(1 - 2n)^3}{4n^3 + n} = ?$`,
          options: [R`$-2$`, R`$2$`, R`$-\tfrac12$`, R`$1$`],
          answer: 0,
          hint: R`Elég a számláló főtagja: mi lesz $(-2n)^3$? A fokok azonosak.`,
          explain: R`A számláló főtagja $(-2n)^3 = -8n^3$, a nevezőé $4n^3$: azonos fok, a határérték a főegyütthatók hányadosa, $\tfrac{-8}{4} = -2$. A $2$ előjelhiba (a páratlan kitevő megtartja a negatív előjelet), a $-\tfrac12$ abból jön, hogy a $-2$-t nem emeled köbre, az $1$ a „$\tfrac\infty\infty = 1$” hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_1 = 1$, $a_{n+1} = \sqrt{12 + a_n}$. A sorozat monoton nő és felülről korlátos. Mi a határértéke?`,
          options: [R`$4$`, R`$-3$`, R`$2\sqrt3$`, R`$\sqrt{13}$`],
          answer: 0,
          hint: R`A mozgólépcső-tétel szerint van határérték, $A$. Írd $A$-t a rekurzió mindkét oldalára, és válaszd ki a lehetséges gyököt!`,
          explain: R`Fixpont-egyenlet: $A = \sqrt{12 + A} \Rightarrow A^2 - A - 12 = 0 \Rightarrow A = 4$ vagy $A = -3$. A tagok pozitívak (egy gyök értéke), ezért $A = 4$. A $-3$ a rossz gyök, a $2\sqrt3 = \sqrt{12}$ abból jön, hogy az $a_n$-t elhagyod, a $\sqrt{13}$ csak a második tag ($a_2$).`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \left(\dfrac{n + 2}{n - 1}\right)^n = ?$`,
          options: [R`$e^3$`, R`$e$`, R`$e^2$`, R`$1$`],
          answer: 0,
          hint: R`Oszd el a számlálót és a nevezőt is $n$-nel, és bontsd két nevezetes $\left(1 + \tfrac xn\right)^n$ alakú sorozat hányadosára!`,
          explain: R`$\left(\dfrac{n + 2}{n - 1}\right)^n = \dfrac{\left(1 + \frac2n\right)^n}{\left(1 - \frac1n\right)^n} \to \dfrac{e^2}{e^{-1}} = e^3 \approx 20{,}09$. Az $e$ előjelhiba ($e^2\cdot e^{-1}$, osztás helyett szorzás), az $e^2$ a nevező figyelmen kívül hagyása, az $1$ az „$1^\infty = 1$” tévhit.`
        },
        {
          type: "match",
          q: R`Párosítsd a sorozatokat a határértékükkel!`,
          pairs: [
            [R`$\dfrac{n^{10}}{1{,}1^n}$`, "0"],
            [R`$\dfrac{n! + 2^n}{n!}$`, "1"],
            [R`$\dfrac{3^n}{n^3}$`, "+végtelen"],
            [R`$\sqrt[n]{7^n + n}$`, "7"]
          ],
          hint: R`Rangsor: $\ln n \ll n^k \ll a^n \ll n! \ll n^n$. Az $n$-edik gyök alatti összegben a legnagyobb tag dönt.`,
          explain: R`$n^{10} \ll 1{,}1^n$, ezért az első 0-hoz tart (bár csak $n = 686$-tól nagyobb a nevező!). $\tfrac{n! + 2^n}{n!} = 1 + \tfrac{2^n}{n!} \to 1$. $n^3 \ll 3^n$, ezért a harmadik $+\infty$-hez tart. $7 \le \sqrt[n]{7^n + n} \le \sqrt[n]{2\cdot7^n} = \sqrt[n]2\cdot7$, rendőrelvvel a határérték 7.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\displaystyle\sum_{n=2}^{\infty}\left(\frac13\right)^n = ?$`,
          options: [R`$\tfrac16$`, R`$\tfrac12$`, R`$\tfrac32$`, R`$\tfrac1{12}$`],
          answer: 0,
          hint: R`Az összegképletben $a$ mindig a sor első tagja. Mi az első tag, ha az index 2-től indul?`,
          explain: R`Az első tag $\left(\tfrac13\right)^2 = \tfrac19$, $q = \tfrac13$: $\dfrac{1/9}{1 - 1/3} = \dfrac{1/9}{2/3} = \dfrac16$. Az $\tfrac12$ az $n = 1$-től, a $\tfrac32$ az $n = 0$-tól induló sor összege (rossz első tag), az $\tfrac1{12}$ az $\tfrac{a}{1 + q}$ előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Konvergens-e a $\displaystyle\sum_{n=1}^\infty \frac1{\sqrt n}$ sor?`,
          options: [
            R`Divergens: $\tfrac1{\sqrt n} \ge \tfrac1n$, és $\sum\tfrac1n$ divergens (minoráns).`,
            R`Konvergens, mert $\tfrac1{\sqrt n} \to 0$.`,
            R`Konvergens: $\tfrac1{\sqrt n} \ge \tfrac1n$, és $\sum\tfrac1n$ a majoránsa.`,
            R`Konvergens, mert a hányadoskritérium szerint $\tfrac{a_{n+1}}{a_n} \to 1$.`
          ],
          answer: 0,
          hint: R`Hasonlítsd össze a harmonikus sorral! Melyik irányú becslésből következik valami?`,
          explain: R`$\sqrt n \le n$, ezért $\tfrac1{\sqrt n} \ge \tfrac1n$: a divergens harmonikus sor minoráns, így a $\sum\tfrac1{\sqrt n}$ is divergens. Az $a_n \to 0$ nem elég (szükséges feltétel). A harmadik opció rossz irányú becslés: egy nagyobb tagú sor nem lehet egy kisebb tagú majoránsa. Az $L = 1$ esetén a hányadoskritérium nem dönt.`
        },
        {
          type: "single", shuffle: true,
          q: R`1 millió Ft-ot teszel be évi 100%-ra. Mi történik, ha a bank egyre sűrűbben (havonta, naponta, óránként, …) írja jóvá a kamatot?`,
          options: [
            R`Egy év múlva egyre többet kapsz, de sosem többet, mint $e$ millió ≈ 2 718 282 Ft.`,
            R`A sűrítéssel a pénz egy év alatt minden határon túl nőhet.`,
            R`Mindig 2 000 000 Ft lesz, a gyakoriság nem számít.`,
            R`Egy idő után kevesebb lesz, mert az egyes jóváírások kamata 0-hoz tart.`
          ],
          answer: 0,
          hint: R`Évi $m$ jóváírásnál a pénz $\left(1 + \tfrac1m\right)^m$-szeresére nő. Mit tudsz erről a sorozatról?`,
          explain: R`Az $\left(1 + \tfrac1m\right)^m$ szigorúan monoton nő és felülről korlátos, határértéke $e$. Ezért a sűrűbb kamatozás mindig kicsit többet hoz (évente egyszer 2 000 000, havonta 2 613 035, naponta 2 714 567 Ft), de $e\cdot10^6 \approx 2\,718\,282$ Ft fölé nem megy. Ez az $1^\infty$ kritikus alak: se nem 1, se nem végtelen.`
        },
        {
          type: "single", shuffle: true,
          q: R`500 000 Ft hitel, évi 8%, 2 év, minden év végén azonos részlet. Mekkora a részlet?`,
          options: ["280 385 Ft", "290 000 Ft", "291 600 Ft", "250 000 Ft"],
          answer: 0,
          hint: R`$a = V\dfrac{q^n(q - 1)}{q^n - 1}$ – vagy: a két részlet jelenértékének összege egyenlő a hitellel.`,
          explain: R`$a = 500\,000\cdot\dfrac{1{,}08^2\cdot0{,}08}{1{,}08^2 - 1} = 500\,000\cdot\dfrac{1{,}1664\cdot0{,}08}{0{,}1664} \approx 280\,385$ Ft. A 290 000 Ft a „hitel / évek száma + kamat” tévhit ($250\,000 + 40\,000$; a kamat a csökkenő tartozás után jár), a 291 600 Ft a kamatos végösszeg fele ($\tfrac{500\,000\cdot1{,}08^2}{2}$), a 250 000 Ft kamat nélkül.`
        }
      ]
    },
