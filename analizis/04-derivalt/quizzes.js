/* =========================================================
   Analízis 4. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 4.1 */
    "an4-41": {
      title: "Kvíz – 4.1 Átlagos és pillanatnyi változás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A kő $t$ másodperc alatt $s(t) = 5t^2$ métert esik. Mekkora az átlagsebessége a $[1; 3]$ időszakban?`,
          options: [R`$20\ \tfrac{\text{m}}{\text{s}}$`, R`$40\ \tfrac{\text{m}}{\text{s}}$`, R`$30\ \tfrac{\text{m}}{\text{s}}$`, R`$22{,}5\ \tfrac{\text{m}}{\text{s}}$`],
          answer: 0,
          hint: R`Átlagos változási sebesség: az út változása osztva az idő változásával. Mennyi $s(3)$ és $s(1)$, és milyen hosszú az időszak?`,
          explain: R`$\dfrac{s(3) - s(1)}{3 - 1} = \dfrac{45 - 5}{2} = 20\ \tfrac{\text{m}}{\text{s}}$. A $40$ a megtett út ($\Delta s = 40$ m) – változás, nem változási sebesség: elmaradt az osztás $\Delta t = 2$-vel. A $30$ a pillanatnyi sebesség a $t = 3$-ban, nem az időszak átlaga. A $22{,}5$-nél $\tfrac{s(3)}{2}$-t számoltak: kimaradt az $s(1) = 5$ levonása.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy tartályban 10 perc alatt 900 literről 300 literre csökken a víz. Mennyi az átlagos változási sebesség?",
          options: [R`$-60\ \tfrac{\text{l}}{\text{perc}}$`, R`$60\ \tfrac{\text{l}}{\text{perc}}$`, R`$-600\ \tfrac{\text{l}}{\text{perc}}$`, R`$-90\ \tfrac{\text{l}}{\text{perc}}$`],
          answer: 0,
          hint: "Új érték mínusz régi érték, osztva az eltelt idővel. Mit jelent az eredmény előjele?",
          explain: R`$\dfrac{300 - 900}{10} = \dfrac{-600}{10} = -60\ \tfrac{\text{l}}{\text{perc}}$: percenként átlagosan 60 liter folyik ki. A $+60$ elhagyja az előjelet, pedig az mutatja, hogy a mennyiség csökken. A $-600$ a teljes változás ($\Delta V$), nincs elosztva az idővel. A $-90$ a kezdeti $900$-at osztotta el 10-zel – a változás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi az $f(x) = x^2$ szelőjének meredeksége a $2$ és az $5$ között?`,
          options: [R`$7$`, R`$21$`, R`$10$`, R`$3$`],
          answer: 0,
          hint: R`A szelő meredeksége a differenciahányados: $\tfrac{\Delta y}{\Delta x}$. (A 4.1 gyakorló feladata szerint az $x^2$-nél ez egy nagyon egyszerű kifejezés $a$-ból és $b$-ből.)`,
          explain: R`$\dfrac{f(5) - f(2)}{5 - 2} = \dfrac{25 - 4}{3} = 7$ – és valóban $a + b = 2 + 5 = 7$. A $21$ csak $\Delta y$ (nincs osztva $\Delta x$-szel), a $3$ csak $\Delta x$. A $10$ a parabola meredeksége az $5$-ben (az érintőé, nem a szelőé).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi az $f(x) = x^2$ átlagos változási sebessége a $[-3; 1]$ intervallumon?`,
          options: [R`$-2$`, R`$2$`, R`$4$`, R`$-8$`],
          answer: 0,
          hint: R`Ugyanabban a sorrendben vonj ki a számlálóban és a nevezőben! Vigyázz a negatív szám kivonására.`,
          explain: R`$\dfrac{f(1) - f(-3)}{1 - (-3)} = \dfrac{1 - 9}{4} = -2$. A $2$ akkor jön ki, ha csak az egyik helyen fordítod meg a sorrendet: $\tfrac{1 - 9}{-3 - 1}$. A $4$-nél a nevezőben $1 - 3 = -2$ szerepel $1 - (-3) = 4$ helyett. A $-8$ csak a függvényérték változása, nincs osztva az intervallum hosszával.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $f(x) = x^2$ differenciahányadosa az $a = 4$-ből: $\dfrac{(4 + h)^2 - 16}{h} = 8 + h$ ($h \ne 0$). Mennyi a pillanatnyi változási sebesség a 4-ben?`,
          options: [R`$8$`, R`$8{,}001$`, R`$16$`, R`$0$`],
          answer: 0,
          hint: R`A pillanatnyi változási sebesség a differenciahányados határértéke, ha $h \to 0$. Nem egy konkrét kis $h$-hoz tartozó érték.`,
          explain: R`$8 + h \to 8$, ha $h \to 0$. A $8{,}001$ a $h = 0{,}001$-hez tartozó átlag – csak közelítés, nem a pontos érték (ez a „kis $h$ is elég” hiba). A $16 = f(4)$ a függvény értéke, nem a meredeksége. A $0$-t az $(a + h)^2 = a^2 + h^2$ hiba adja: akkor a tört $\tfrac{h^2}{h} = h \to 0$ lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`A kő sebességét számolva ide jutottál: $\dfrac{10h + 5h^2}{h}$. Mi a helyes következő lépés?`,
          options: [
            R`Egyszerűsítesz $h$-val ($h \ne 0$): $10 + 5h$, és csak utána nézed, mihez tart, ha $h \to 0$.`,
            R`Beírod $h = 0$-t: $\tfrac00$ jön ki, tehát a pillanatnyi sebesség nem létezik.`,
            R`Beírod $h = 0$-t: a számláló 0, tehát a pillanatnyi sebesség 0.`,
            R`Beírod $h = 0{,}001$-et: az eredmény ($10{,}005$) a pontos pillanatnyi sebesség.`
          ],
          answer: 0,
          hint: R`A $\tfrac00$ nem szám, hanem jelzés. Mit tanultál a 3. fejezetben, mit kell ilyenkor tenni?`,
          explain: R`$h \ne 0$ esetén $\dfrac{10h + 5h^2}{h} = 10 + 5h$, és ez $h \to 0$-ra $10$-hez tart: $v(1) = 10\ \tfrac{\text{m}}{\text{s}}$. A $h = 0$ behelyettesítése egyszerűsítés előtt $\tfrac00$-t ad – ebből sem az nem következik, hogy nincs határérték, sem az, hogy 0. A $h = 0{,}001$ csak közelítést ad (10,005), a pontos érték a határérték.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            R`Az $\dfrac{f(x) - f(a)}{x - a}$ differenciahányados az $(a; f(a))$ és $(x; f(x))$ ponton átmenő szelő meredeksége.`,
            R`Ha az átlagos változási sebesség az $[a; b]$-n negatív, akkor $f(b) \lt f(a)$.`,
            "A pillanatnyi sebesség egy nagyon rövid időszak átlagsebessége.",
            "Ha a kő átlagsebessége a [0; 2] időszakban 10 m/s, akkor minden pillanatban 10 m/s-mal esett.",
            R`A pillanatnyi változási sebességhez elég a pozitív $h$-kat nézni.`
          ],
          answer: [0, 1],
          hint: "Gondolj a szelő meredekségére, az előjel jelentésére, és arra, hogy a pillanatnyi sebesség határérték.",
          explain: R`Igaz: a differenciahányados $\tfrac{\Delta y}{\Delta x}$, ez a szelő meredeksége ($\operatorname{tg}\alpha$). Igaz: $b - a \gt 0$, így a tört pontosan akkor negatív, ha $f(b) - f(a) \lt 0$. Hamis: a pillanatnyi sebesség nem egy rövid időszak átlaga, hanem az átlagsebességek <em>határértéke</em>. Hamis: az átlag nem jelenti, hogy végig ennyi volt – a kő gyorsul, $v(1) = 10$, $v(2) = 20\ \tfrac{\text{m}}{\text{s}}$. Hamis: a határértékhez a negatív $h$-kra is ugyanoda kell tartania.`
        },
        {
          type: "match",
          q: R`Párosítsd a kő ($s(t) = 5t^2$) adatait az értékükkel!`,
          pairs: [
            ["átlagsebesség a [0; 2] időszakban", "10 m/s"],
            ["átlagsebesség a [1; 2] időszakban", "15 m/s"],
            [R`pillanatnyi sebesség a $t = 2$-ben`, "20 m/s"],
            ["megtett út az első 2 másodpercben", "20 m"],
            [R`pillanatnyi sebesség a $t = 3$-ban`, "30 m/s"]
          ],
          hint: R`Átlag: $\tfrac{\Delta s}{\Delta t}$. Pillanatnyi: a differenciahányados határértéke ($5(a + h)^2$ kifejtésével). Az út nem sebesség – figyelj a mértékegységre!`,
          explain: R`$\tfrac{20 - 0}{2} = 10$, $\tfrac{20 - 5}{1} = 15$ m/s. A pillanatnyi sebesség a $t = a$-ban $\tfrac{5(a + h)^2 - 5a^2}{h} = 10a + 5h \to 10a$: a 2-ben $20$, a 3-ban $30$ m/s. Az első 2 másodpercben megtett út $s(2) = 20$ m – ugyanaz a szám, mint $v(2)$, de más mennyiség (változás, nem változási sebesség), más mértékegységgel.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2 */
    "an4-42": {
      title: "Kvíz – 4.2 A derivált definíciója",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Számold ki a definícióval: $f(x) = x^2 + x$, $f'(2) = ?$`,
          options: [R`$5$`, R`$6$`, R`$4$`, R`$1$`],
          answer: 0,
          hint: R`Írd fel $f(2 + h)$-t, fejtsd ki $(2 + h)^2$-t (mind a három tag kell!), vond le $f(2)$-t, és egyszerűsíts $h$-val.`,
          explain: R`$f(2 + h) = 4 + 4h + h^2 + 2 + h = 6 + 5h + h^2$, $f(2) = 6$, így $\dfrac{5h + h^2}{h} = 5 + h \to 5$. A $6 = f(2)$ a függvény értéke, nem a deriváltja. A $4$-nél kimaradt az $x$ tag meredeksége (csak $x^2$-t deriválták). Az $1$-et az $(2 + h)^2 = 4 + h^2$ hiba adja: akkor a tört $\tfrac{h^2 + h}{h} = h + 1 \to 1$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = x^2$ grafikonjának érintője az $a = 2$ pontban? ($f'(2) = 4$.)`,
          options: [R`$y = 4x - 4$`, R`$y = 4x - 8$`, R`$y = 4x + 4$`, R`$y = -4x + 12$`],
          answer: 0,
          hint: R`Érintő: $y = f(a) + f'(a)\,(x - a)$. Melyik pont, melyik meredekség? Ellenőrizd: átmegy-e a $(2; 4)$ ponton?`,
          explain: R`$y = 4 + 4(x - 2) = 4x - 4$; ellenőrzés: $x = 2$-re $4$ ✔. Az $y = 4x - 8$-ból kimaradt az $f(a) = 4$ (ez $y = 4(x - 2)$, a $(2; 0)$-n megy át). Az $y = 4x + 4$-ből az $(x - a)$ hiányzik: $y = 4 + 4x$. Az $y = -4x + 12$ előjelhibás: $4 - 4(x - 2)$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $f(x) = x^2 - 6x$ grafikonjának melyik pontjában vízszintes az érintő?`,
          options: [R`$(3; -9)$`, R`$(-3; 27)$`, R`$(6; 0)$`, R`$(3; 0)$`],
          answer: 0,
          hint: R`Vízszintes érintő: a meredekség 0, azaz $f'(a) = 0$. Számold ki $f'(a)$-t a definícióval, aztán a pont második koordinátája $f(a)$.`,
          explain: R`$\dfrac{(a + h)^2 - 6(a + h) - a^2 + 6a}{h} = 2a + h - 6 \to 2a - 6$, ez 0, ha $a = 3$. A pont $(3; f(3)) = (3; -9)$, a parabola csúcsa. A $(-3; 27)$ előjelhiba ($2a + 6 = 0$). A $(6; 0)$ a függvény zérushelye – ott $f(a) = 0$, nem $f'(a)$. A $(3; 0)$ jó helyen van, de második koordinátának $f'(3) = 0$-t írták $f(3)$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Deriválható-e az $f(x) = |x - 3|$ a 3-ban?`,
          options: [
            R`Nem: $f'_-(3) = -1$, $f'_+(3) = 1$, a két egyoldali derivált különbözik.`,
            R`Igen, $f'(3) = 0$, a két egyoldali derivált átlaga.`,
            "Igen, mert a 3-ban folytonos.",
            "Nem, mert a 3-ban nem folytonos."
          ],
          answer: 0,
          hint: R`Írd fel a differenciahányadost: $\tfrac{|h|}{h}$. Mennyi ez $h \lt 0$-ra és $h \gt 0$-ra?`,
          explain: R`$\dfrac{|3 + h - 3| - 0}{h} = \dfrac{|h|}{h}$: balról $-1$, jobbról $1$. A két egyoldali derivált létezik, de különbözik, tehát nincs derivált – a grafikon a $(3; 0)$-ban megtörik. Átlagolás nincs a definícióban. A függvény folytonos a 3-ban, de a folytonosságból nem következik a deriválhatóság (folytonos ⇏ deriválható). A „nem folytonos” pedig egyszerűen nem igaz.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^2$, ha $x \le 1$, és $f(x) = 3x - 2$, ha $x \gt 1$. Deriválható-e az 1-ben?`,
          options: [
            R`Nem: folytonos, de $f'_-(1) = 2 \ne 3 = f'_+(1)$ (törés).`,
            R`Igen, $f'(1) = 2$, mert $x \le 1$-re az $x^2$ ág érvényes.`,
            R`Igen, $f'(1) = 2{,}5$.`,
            "Nem, mert az 1-ben nem folytonos."
          ],
          answer: 0,
          hint: R`Először: $f(1) = ?$, és a jobb oldali darab az 1-hez közeledve ugyanide tart-e? Utána számold ki külön a bal és a jobb oldali deriváltat.`,
          explain: R`$f(1) = 1$, és $3\cdot 1 - 2 = 1$: a függvény folytonos. Balról $\tfrac{(1 + h)^2 - 1}{h} = 2 + h \to 2$, jobbról $\tfrac{3(1 + h) - 2 - 1}{h} = 3$. $2 \ne 3$: nem deriválható, a grafikon megtörik. Az „$f'(1) = 2$” csak a bal oldali deriváltat nézi – az egyik oldal nem elég. A $2{,}5$ átlagolás, a „nem folytonos” pedig hamis indok.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^2$, ha $x \le 1$, és $f(x) = 2x + 3$, ha $x \gt 1$. A két darab deriváltja az 1-ben $2$ és $2$. Deriválható-e $f$ az 1-ben?`,
          options: [
            "Nem, mert az 1-ben ugrik (nem folytonos).",
            R`Igen, $f'(1) = 2$, mert a két darab deriváltja egyezik.`,
            "Nem, mert a két darab deriváltja különbözik.",
            R`Csak jobbról: $f'_+(1) = 2$.`
          ],
          answer: 0,
          hint: "Mielőtt a meredekségeket összeveted: folytonos-e a függvény az 1-ben? Mit mond a deriválhatóság és a folytonosság kapcsolatáról szóló tétel?",
          explain: R`$f(1) = 1$, de jobbról $2x + 3 \to 5$: a függvény ugrik, nem folytonos, így nem is deriválható (deriválható ⇒ folytonos). A jobb oldali differenciahányados a valódi $f(1)$-gyel $\tfrac{2(1 + h) + 3 - 1}{h} = \tfrac{4 + 2h}{h} \to +\infty$ – tehát $f'_+(1)$ sem 2. A darabok deriváltjainak összevetése a folytonosság nélkül nem dönt. A „különbözik” pedig nem igaz: mindkettő 2.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            R`Ha $f$ deriválható az $a$-ban, akkor ott folytonos is.`,
            R`Ha $f$ nem folytonos az $a$-ban, akkor ott nem deriválható.`,
            R`Ha $f$ folytonos az $a$-ban, akkor ott deriválható.`,
            R`Ha $f$ nem deriválható az $a$-ban, akkor ott nem folytonos.`,
            R`A $\sqrt[3]{x}$ deriválható a 0-ban, a deriváltja $+\infty$.`
          ],
          answer: [0, 1],
          hint: R`Gondolj a $|x|$-re (folytonos, de törése van) és a $\sqrt[3]{x}$-re (függőleges érintő). A definícióban a határértéknek végesnek kell lennie.`,
          explain: R`Igaz a tétel (deriválható ⇒ folytonos) és vele egyenértékű következménye (nem folytonos ⇒ nem deriválható). Hamis a megfordítás: a $|x|$ folytonos a 0-ban, mégsem deriválható; ugyanez cáfolja a negyedik állítást is (nem deriválható, de folytonos). A $\sqrt[3]{x}$ differenciahányadosa a 0-ban $\tfrac{1}{\sqrt[3]{h^2}} \to +\infty$ – a határérték nem véges, tehát a definíció szerint <em>nem</em> deriválható (függőleges érintő).`
        },
        {
          type: "match",
          q: "Párosítsd a függvényeket azzal, ami a 0-ban igaz rájuk!",
          pairs: [
            [R`$|x|$`, "nem deriválható (törés)"],
            [R`$\sqrt[3]{x}$`, "nem deriválható (függőleges érintő)"],
            [R`$\operatorname{sgn} x$`, "nem folytonos, ezért nem deriválható"],
            [R`$x|x|$`, "deriválható, f'(0) = 0"],
            [R`$x^2 + 3x$`, "deriválható, f'(0) = 3"]
          ],
          hint: R`Írd fel mindegyikre a 0-beli differenciahányadost $\tfrac{f(h) - f(0)}{h}$, és nézd meg külön balról és jobbról.`,
          explain: R`$|x|$: $\tfrac{|h|}{h}$, balról $-1$, jobbról $1$ – törés. $\sqrt[3]{x}$: $\tfrac{1}{\sqrt[3]{h^2}} \to +\infty$ – függőleges érintő. $\operatorname{sgn} x$ a 0-ban ugrik, így nem folytonos, és ezért nem is deriválható. $x|x|$: $\tfrac{h|h|}{h} = |h| \to 0$ – deriválható, pedig $|x|$ van benne. $x^2 + 3x$: $\tfrac{h^2 + 3h}{h} = h + 3 \to 3$.`
        }
      ]
    },

    /* ------------------------------------------------ 4.3 */
    "an4-43": {
      title: "Kvíz – 4.3 Elemi függvények deriváltja",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\left(\dfrac{1}{x^4}\right)' = ?$`,
          options: [R`$-\dfrac{4}{x^5}$`, R`$-\dfrac{4}{x^3}$`, R`$\dfrac{1}{4x^3}$`, R`$-\dfrac{1}{x^5}$`],
          answer: 0,
          hint: R`Ne a nevezőt deriváld! Írd át hatvánnyá ($x^{-4}$), és alkalmazd az $(x^r)' = r\,x^{r - 1}$ szabályt.`,
          explain: R`$\tfrac{1}{x^4} = x^{-4}$, így $(x^{-4})' = -4x^{-5} = -\dfrac{4}{x^5}$. A $-\tfrac{4}{x^3}$ a negatív kitevő „növelése” ($-4x^{-3}$) – a kitevő negatívnál is eggyel <em>csökken</em>: $-4 - 1 = -5$. Az $\tfrac{1}{4x^3}$ a nevező deriválása. A $-\tfrac{1}{x^5}$-ből elmaradt a lejövő 4-es szorzó.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $\sqrt x$ deriváltja a 4-ben?`,
          options: [R`$\tfrac14$`, R`$1$`, R`$\tfrac18$`, R`$4$`],
          answer: 0,
          hint: R`$\sqrt x = x^{1/2}$. A kitevő lejön szorzónak és eggyel csökken. Az eredményt írd fel gyökkel, és helyettesíts be.`,
          explain: R`$(x^{1/2})' = \tfrac12 x^{-1/2} = \dfrac{1}{2\sqrt x}$, a 4-ben $\tfrac{1}{2\cdot 2} = \tfrac14$. Az $1$-nél nem csökkent a kitevő: $\tfrac12 x^{1/2} = \tfrac12\cdot 2$. Az $\tfrac18$-nál $\tfrac{1}{2x}$ szerepel $\tfrac{1}{2\sqrt x}$ helyett. A $4 = 2\sqrt 4$ a helyes képlet reciproka.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $\cos x$ deriváltja az $x = \tfrac\pi6$-ban?`,
          options: [R`$-\tfrac12$`, R`$\tfrac12$`, R`$-\tfrac{\sqrt3}{2}$`, R`$\tfrac{\sqrt3}{2}$`],
          answer: 0,
          hint: R`Melyik függvény a koszinusz deriváltja, és milyen előjellel? Ellenőrzés: a $\cos$ a 0 és a $\pi$ között csökken.`,
          explain: R`$(\cos x)' = -\sin x$, és $-\sin\tfrac\pi6 = -\tfrac12$. Negatív, ahogy kell: a koszinusz itt csökken. Az $\tfrac12$ az előjelet hagyja el ($(\cos x)' = \sin x$ hiba). A $-\tfrac{\sqrt3}2$ a $-\cos$ értéke, a $\tfrac{\sqrt3}2 = \cos\tfrac\pi6$ pedig magának a függvénynek az értéke – nem a meredeksége.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $3^x$ deriváltja az $x = 2$-ben?`,
          options: [R`$9\ln 3 \approx 9{,}888$`, R`$6$`, R`$9$`, R`$\ln 3 \approx 1{,}099$`],
          answer: 0,
          hint: R`Hatvány vagy exponenciális? Itt az alap állandó, a kitevő változik. Melyik szabály való ide a táblázatból?`,
          explain: R`$(a^x)' = a^x\ln a$, így $(3^x)' = 3^x\ln 3$, a 2-ben $9\ln 3 \approx 9{,}888$. A $6$ a hatványszabály rossz helyen: $x\cdot 3^{x - 1} = 2\cdot 3$. A $9 = 3^2$ úgy kezeli a $3^x$-et, mintha $e^x$ lenne ($(a^x)' = a^x$ csak $a = e$-re igaz). A $\ln 3$-ból elmaradt a $3^x$ tényező.`
        },
        {
          type: "single", shuffle: true,
          q: R`$(\log_{10} x)' = ?$`,
          options: [R`$\dfrac{1}{x\ln 10}$`, R`$\dfrac{\ln 10}{x}$`, R`$\dfrac1x$`, R`$\dfrac{1}{10x}$`],
          answer: 0,
          hint: R`Írd át természetes logaritmusra: $\log_a x = \dfrac{\ln x}{\ln a}$. Az $\tfrac{1}{\ln a}$ állandó szorzó.`,
          explain: R`$\log_{10} x = \dfrac{\ln x}{\ln 10}$, így a derivált $\dfrac{1}{\ln 10}\cdot\dfrac1x = \dfrac{1}{x\ln 10}$. A $\tfrac{\ln 10}{x}$ fordítva szorozza a váltószámot. Az $\tfrac1x$ csak a $\ln x$ deriváltja. Az $\tfrac{1}{10x}$ az alapot írja $\ln 10$ helyére.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $e^x$ grafikonjának érintője az $x = 1$ pontban?`,
          options: [R`$y = ex$`, R`$y = e(x - 1)$`, R`$y = x + e - 1$`, R`$y = ex + 2e$`],
          answer: 0,
          hint: R`Érintő: $y = f(a) + f'(a)(x - a)$. Mennyi $f(1)$ és $f'(1)$, ha $(e^x)' = e^x$?`,
          explain: R`$f(1) = e$, $f'(1) = e^1 = e$, így $y = e + e(x - 1) = ex$ (az érintő átmegy az origón). Az $y = e(x - 1)$-ből kimaradt az $f(1) = e$. Az $y = x + e - 1$ meredeksége 1 – ez az $e^x$ meredeksége a 0-ban, nem az 1-ben. Az $y = ex + 2e$ előjelhibás: $e + e(x + 1)$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            R`Ahol $f'(x) \gt 0$, ott $f$ nő; ahol $f'(x) = 0$, ott vízszintes az érintő.`,
            R`A $(\sin x)' = \cos x$ képlet csak akkor igaz, ha $x$-et radiánban mérjük.`,
            R`Az $f'$ grafikonja az $f$ grafikonjának eltoltja.`,
            R`$(e^x)' = x e^{x - 1}$.`,
            R`Ha $f(x)$ nagy, akkor $f'(x)$ is nagy.`
          ],
          answer: [0, 1],
          hint: R`Az $f'$ értéke az $f$ meredeksége, nem a magassága. Gondolj az $x^2$-re a $-3$-ban, és a fokban mért szinuszra.`,
          explain: R`Igaz: $f'$ előjele mutatja, hol nő és hol csökken $f$ (pontos tétel az 5. fejezetben). Igaz: fokban $\tfrac{d}{dx}\sin x° = \tfrac{\pi}{180}\cos x°$. Hamis: $f'$ magassága az $f$ meredeksége – ahol $f$-nek csúcsa van, ott $f' = 0$. Hamis: $(e^x)' = e^x$; az $xe^{x - 1}$ a hatványszabály rossz helyen. Hamis: az $x^2$ a $-3$-ban 9, mégis csökken, $f'(-3) = -6$.`
        },
        {
          type: "match",
          q: "Párosítsd a függvényeket a deriváltjukkal!",
          pairs: [
            [R`$x^5$`, "5x⁴"],
            [R`$5^x$`, "5ˣ · ln 5"],
            [R`$\cos x$`, "−sin x"],
            [R`$\ln x$`, "1/x"],
            [R`$\sqrt x$`, "1/(2√x)"],
            [R`$\log_5 x$`, "1/(x · ln 5)"]
          ],
          hint: "Az első kettőnél döntsd el: hatvány (állandó kitevő) vagy exponenciális (állandó alap)? A többi az alap-deriválttáblázatból jön.",
          explain: R`$(x^5)' = 5x^4$ (hatvány: a kitevő lejön), $(5^x)' = 5^x\ln 5$ (exponenciális: a függvény szorozva az alap logaritmusával) – az 1-ben $5$, illetve $\approx 8{,}047$. $(\cos x)' = -\sin x$ (a mínusz a koszinusznál van!), $(\ln x)' = \tfrac1x$, $(\sqrt x)' = \tfrac{1}{2\sqrt x}$, $(\log_5 x)' = \tfrac{1}{x\ln 5}$.`
        }
      ]
    },

    /* ------------------------------------------------ 4.4 */
    "an4-44": {
      title: "Kvíz – 4.4 Deriválási szabályok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$(x^2 e^x)' = ?$`,
          options: [R`$(x^2 + 2x)e^x$`, R`$2xe^x$`, R`$x^2e^x$`, R`$2x + e^x$`],
          answer: 0,
          hint: R`Szorzat: $(fg)' = f'g + fg'$. Mi itt $f$, $g$, és mi a deriváltjuk?`,
          explain: R`$f = x^2$, $g = e^x$: $2x\cdot e^x + x^2\cdot e^x = (x^2 + 2x)e^x$. A $2xe^x$ a „deriváltak szorzata” ($f'g' = 2x\cdot e^x$) – ez a leggyakoribb hiba, és itt véletlenül épp az első taggal egyezik, de a második tag elmaradt. Az $x^2e^x$ csak az $fg'$ tag. A $2x + e^x$ a szorzatot összegként deriválja.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\left(\dfrac{x}{x + 2}\right)' = ?$`,
          options: [R`$\dfrac{2}{(x + 2)^2}$`, R`$-\dfrac{2}{(x + 2)^2}$`, R`$\dfrac{2}{x + 2}$`, R`$1$`],
          answer: 0,
          hint: R`Hányados: $\left(\tfrac fg\right)' = \tfrac{f'g - fg'}{g^2}$. A számláló deriváltjával kezdünk, és a nevező négyzetre kerül.`,
          explain: R`$\dfrac{1\cdot(x + 2) - x\cdot 1}{(x + 2)^2} = \dfrac{2}{(x + 2)^2}$. A $-\tfrac{2}{(x + 2)^2}$ a felcserélt számláló ($fg' - f'g$). A $\tfrac{2}{x + 2}$-ből hiányzik a nevező négyzete. Az $1$ a $\tfrac{f'}{g'} = \tfrac11$ hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl((x^2 + 1)^3\bigr)'$ az $x = 1$-ben?`,
          options: [R`$24$`, R`$12$`, R`$6$`, R`$8$`],
          answer: 0,
          hint: R`Láncszabály: külső $u^3$, belső $u = x^2 + 1$. A külső deriváltját a belső helyen veszed, és megszorzod a belső deriváltjával.`,
          explain: R`$3(x^2 + 1)^2\cdot 2x$, az 1-ben $3\cdot 2^2\cdot 2 = 24$. A $12 = 3\cdot 2^2$-ből elmaradt a belső derivált ($2x = 2$). A $6$-nál a külső deriváltját nem a belső helyen vették: $3x^2\cdot 2x$ az 1-ben $3\cdot 1\cdot 2$. A $8 = (1 + 1)^3$ a függvény értéke, nem a deriváltja.`
        },
        {
          type: "single", shuffle: true,
          q: R`$(\sin^2 x)' = ?$`,
          options: [R`$2\sin x\cos x$`, R`$2x\cos(x^2)$`, R`$\cos^2 x$`, R`$2\cos x$`],
          answer: 0,
          hint: R`$\sin^2 x = (\sin x)^2$. Melyik a külső és melyik a belső függvény?`,
          explain: R`Külső $u^2$, belső $\sin x$: $2\sin x\cdot\cos x$. A $2x\cos(x^2)$ a $\sin(x^2)$ deriváltja – a $\sin^2 x$ és a $\sin x^2$ nem ugyanaz. A $\cos^2 x$ a külsőt hagyja meg és csak a belsőt deriválja. A $2\cos x$-ből elmaradt a $\sin x$ tényező: a külső $2u$ deriváltjába a belső $u = \sin x$-et kell beírni, így $2\sin x\cdot\cos x$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(\ln(x^2 + 3)\bigr)'$ az $x = 1$-ben?`,
          options: [R`$0{,}5$`, R`$0{,}25$`, R`$2$`, R`$1{,}386$`],
          answer: 0,
          hint: R`Láncszabály: külső $\ln u$ (deriváltja $\tfrac1u$), belső $u = x^2 + 3$. Hová kell beírni a belső függvényt?`,
          explain: R`$\dfrac{1}{x^2 + 3}\cdot 2x = \dfrac{2x}{x^2 + 3}$, az 1-ben $\tfrac24 = 0{,}5$. A $0{,}25 = \tfrac14$-ből elmaradt a belső derivált. A $2$-nél a külső deriváltját nem a belső helyen vették: $\tfrac1x\cdot 2x = 2$. Az $1{,}386 \approx \ln 4$ a függvény értéke.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^3 + 2x$ szigorúan nő, és $f(1) = 3$. Mennyi $\bigl(f^{-1}\bigr)'(3)$?`,
          options: [R`$\tfrac15$`, R`$5$`, R`$\tfrac1{29}$`, R`$\tfrac13$`],
          answer: 0,
          hint: R`$\bigl(f^{-1}\bigr)'(y) = \dfrac{1}{f'(x)}$, ahol $y = f(x)$. Melyik $x$-hez tartozik az $y = 3$?`,
          explain: R`$f'(x) = 3x^2 + 2$; az $y = 3$-hoz az $x = 1$ tartozik, $f'(1) = 5$, így $\bigl(f^{-1}\bigr)'(3) = \tfrac15$. Az $5$-ből kimaradt a reciprok. Az $\tfrac1{29}$ rossz pontban veszi a deriváltat: $f'(3) = 29$, de nem a 3-ban, hanem az $f^{-1}(3) = 1$-ben kell. Az $\tfrac13 = \tfrac{1}{f(1)}$ az $f^{-1}$-et $\tfrac1f$-fel keveri.`
        },
        {
          type: "multi",
          q: "Melyik deriválás helyes? (Több is lehet.)",
          options: [
            R`$(\operatorname{tg} x)' = \dfrac{1}{\cos^2 x}$`,
            R`$(\operatorname{arctg} x)' = \dfrac{1}{1 + x^2}$`,
            R`$\bigl((5x - 2)^4\bigr)' = 4(5x - 2)^3$`,
            R`$\left(\dfrac{f}{g}\right)' = \dfrac{f'}{g'}$`,
            R`$(\operatorname{ctg} x)' = \dfrac{1}{\sin^2 x}$`
          ],
          answer: [0, 1],
          hint: R`A $\operatorname{tg}$ és a $\operatorname{ctg}$ a hányadosszabályból jön, az $\operatorname{arctg}$ az inverz függvény szabályából. Lineáris belső függvénynél se felejtsd el a szorzót!`,
          explain: R`Helyes: $(\operatorname{tg} x)' = \tfrac{\cos^2 x + \sin^2 x}{\cos^2 x} = \tfrac{1}{\cos^2 x}$, és $(\operatorname{arctg} x)' = \tfrac{1}{1 + x^2}$ (mert $\tfrac{dy}{dx} = 1 + \operatorname{tg}^2 x = 1 + y^2$). Hibás: $\bigl((5x - 2)^4\bigr)' = 4(5x - 2)^3\cdot 5 = 20(5x - 2)^3$ – elmaradt a belső derivált. Hibás: a hányados deriváltja nem a deriváltak hányadosa ($\left(\tfrac xx\right)' = 0$, de $\tfrac11 = 1$). Hibás az előjel: $(\operatorname{ctg} x)' = -\tfrac{1}{\sin^2 x}$.`
        },
        {
          type: "match",
          q: "Melyik szabállyal kezdenéd a deriválást? Párosítsd!",
          pairs: [
            [R`$3x^2 + \sin x$`, "összeg- és konstansszoros-szabály"],
            [R`$(x^2 + 1)\sin x$`, "szorzatszabály (Leibniz)"],
            [R`$\dfrac{\sin x}{x}$`, "hányadosszabály"],
            [R`$\sin(x^2 + 1)$`, "láncszabály"],
            [R`$\operatorname{arctg} x$`, "inverz függvény deriváltja"]
          ],
          hint: "Nézd meg, mi a „legkülső” művelet: összeadás, szorzás, osztás, vagy egy függvénybe helyettesítünk be egy másikat? Az arctg a tg inverze.",
          explain: R`$3x^2 + \sin x$: összeg, tagonként: $6x + \cos x$. $(x^2 + 1)\sin x$: szorzat, $2x\sin x + (x^2 + 1)\cos x$. $\tfrac{\sin x}{x}$: hányados, $\tfrac{x\cos x - \sin x}{x^2}$. $\sin(x^2 + 1)$: összetett függvény, $\cos(x^2 + 1)\cdot 2x$ – a $\sin$ <em>argumentumában</em> van az $x^2 + 1$, nem szorozva vele. $\operatorname{arctg} x$: a $\operatorname{tg}$ inverze, $\tfrac{1}{1 + x^2}$.`
        }
      ]
    },

    /* ------------------------------------------------ 4.5 */
    "an4-45": {
      title: "Kvíz – 4.5 Deriválási gyakorlat",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(\cos^3 x\bigr)'$?`,
          options: [R`$-3\cos^2 x\sin x$`, R`$3\cos^2 x$`, R`$-\sin^3 x$`, R`$3\cos^2 x\sin x$`],
          answer: 0,
          hint: R`Mi az utolsó művelet, ha egy számra kiszámolod $\cos^3 x = (\cos x)^3$ értékét? Az a legkülső réteg.`,
          explain: R`A legkülső művelet a köbre emelés, a belső függvény $\cos x$. Láncszabály: $3(\cos x)^2\cdot(\cos x)' = 3\cos^2 x\cdot(-\sin x) = -3\cos^2 x\sin x$. A $3\cos^2 x$-ből elmaradt a belső derivált, a $-\sin^3 x$ belülről kezdte a „hámozást” (előbb a $\cos$-t deriválta, aztán köbre emelt), a $+3\cos^2 x\sin x$ pedig elfelejtette, hogy $(\cos x)' = -\sin x$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi az $f(x) = \ln(x^2 + 1)$ deriváltja az $x = 1$ pontban?`,
          options: [R`$1$`, R`$\tfrac12$`, R`$2$`, R`$\ln 2$`],
          answer: 0,
          hint: R`Külső függvény a $\ln$, belső egy polinom. Emlékezz a hüvelykujjszabályra: $\bigl(\ln g(x)\bigr)' = ?$`,
          explain: R`$\bigl(\ln g(x)\bigr)' = \dfrac{g'(x)}{g(x)}$, itt $\dfrac{2x}{x^2 + 1}$, az 1-ben $\dfrac{2}{2} = 1$. Az $\tfrac12 = \tfrac{1}{x^2 + 1}$ a belső deriváltat felejti el, a $2$ csak a belső deriváltat ($2x$) veszi, a nevezőt nem, az $\ln 2$ pedig a függvény értéke ($f(1)$), nem a meredeksége.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl((x^2 + 1)^3\bigr)'$ az $x = 1$ pontban?`,
          options: [R`$24$`, R`$12$`, R`$6$`, R`$8$`],
          answer: 0,
          hint: R`A legkülső művelet a köbre emelés. Ne fejtsd ki rosszul a köböt – és ne felejtsd el a belső függvény deriváltját!`,
          explain: R`Láncszabály: $3(x^2 + 1)^2\cdot 2x$, az 1-ben $3\cdot 4\cdot 2 = 24$. A $12 = 3\cdot 2^2$ a belső deriváltat ($2x$) hagyja el. A $6$ abból jön, hogy valaki $(x^2 + 1)^3$-t $x^6 + 1$-nek veszi – de $(a + b)^3 \ne a^3 + b^3$. A $8$ a függvény értéke az 1-ben.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(\ln(x^2 e^x)\bigr)'$, ha $x \gt 0$? (Előbb egyszerűsíts!)`,
          options: [R`$\dfrac2x + 1$`, R`$\dfrac{1}{x^2 e^x}$`, R`$\dfrac2x + e^x$`, R`$\dfrac2x$`],
          answer: 0,
          hint: R`A logaritmus a szorzatot összeggé, a hatványt szorzóvá teszi. Mi lesz $\ln(x^2)$-ből és $\ln(e^x)$-ből?`,
          explain: R`$\ln(x^2 e^x) = \ln x^2 + \ln e^x = 2\ln x + x$ ($x \gt 0$), ennek deriváltja $\tfrac2x + 1$. (Láncszabállyal ugyanez: $\tfrac{2xe^x + x^2e^x}{x^2e^x} = \tfrac2x + 1$.) Az $\tfrac{1}{x^2e^x}$-ből elmaradt a belső derivált. A $\tfrac2x + e^x$ elfelejti, hogy $\ln e^x = x$; a $\tfrac2x$ pedig a második tagot állandónak nézi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(x^x\bigr)'$ az $x = 2$ pontban?`,
          options: [R`$\approx 6{,}77$`, R`$4$`, R`$\approx 2{,}77$`, R`$\approx 3{,}77$`],
          answer: 0,
          hint: R`Itt az alap és a kitevő is változik: sem a hatvány-, sem az exponenciális szabály nem jó. Írd át: $x^x = e^{x\ln x}$.`,
          explain: R`$x^x = e^{x\ln x}$, így $(x^x)' = e^{x\ln x}(\ln x + 1) = x^x(\ln x + 1)$, a 2-ben $4(\ln 2 + 1) \approx 6{,}7726$. A $4$ a hatványszabály ($x\cdot x^{x - 1}$), a $2{,}77 = 4\ln 2$ az exponenciális szabály ($x^x\ln x$) rossz helyen – a helyes érték épp a kettő összege. A $3{,}77 = 4\ln 2 + 1$ visszaírásnál elfelejti a második tagot is $x^x$-szel szorozni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $y'$ az $x^2 + y^3 = 9$ görbe $(1; 2)$ pontjában?`,
          options: [R`$-\tfrac16$`, R`$\tfrac16$`, R`$-6$`, R`$-\tfrac12$`],
          answer: 0,
          hint: R`Deriváld mindkét oldalt $x$ szerint. Az $y$ az $x$ függvénye, ezért $y^3$ deriválásánál kell a láncszabály. Mennyi a jobb oldal deriváltja?`,
          explain: R`$2x + 3y^2\,y' = 0$, így $y' = -\dfrac{2x}{3y^2} = -\dfrac{2}{12} = -\dfrac16$. (A pont rajta van: $1 + 8 = 9$; ellenőrzés: $y = \sqrt[3]{9 - x^2}$, $y'(1) = -\tfrac16$ ✔.) A $\tfrac16$ előjelhiba, a $-6$ a tört reciproka. A $-\tfrac12$ abból jön, hogy $(y^3)'$-t $y^2y'$-nek veszi (lemaradt a 3-as szorzó).`
        },
        {
          type: "multi",
          q: "Melyik helyes? (Több is lehet.)",
          options: [
            R`$(xy)' = y + x\,y'$, ha $y$ az $x$ függvénye`,
            R`$(y^2)' = 2y$, ha $y$ az $x$ függvénye`,
            R`$\ln(x^2) = 2\ln x$ minden $x \ne 0$-ra`,
            R`$\left(\ln\dfrac{x}{x + 1}\right)' = \dfrac1x - \dfrac{1}{x + 1}$, ha $x \gt 0$`,
            R`$\ln(x + 1) = \ln x + \ln 1 = \ln x$`
          ],
          answer: [0, 3],
          hint: "Implicit deriválásnál y nem változó, hanem x függvénye. A logaritmus-azonosságok csak szorzatra, hányadosra, hatványra vonatkoznak – és figyelj az értelmezési tartományra.",
          explain: R`Helyes: $(xy)'$-hez Leibniz-szabály kell: $1\cdot y + x\cdot y'$. Helyes: $\ln\tfrac{x}{x + 1} = \ln x - \ln(x + 1)$, tagonként deriválva $\tfrac1x - \tfrac{1}{x + 1}$. Hibás: $(y^2)' = 2y\,y'$ – az $y'$ lemaradt. Hibás: $\ln(x^2) = 2\ln x$ csak $x \gt 0$-ra igaz, negatív $x$-re $2\ln|x|$. Hibás: $\ln(a + b) \ne \ln a + \ln b$ – összegre nincs logaritmus-azonosság.`
        },
        {
          type: "match",
          q: "Párosítsd a kifejezéseket azzal a szabállyal, amellyel a deriválást kezdened kell (a legkülső művelet alapján)!",
          pairs: [
            [R`$e^{x\sin x}$`, "láncszabály, külső: e-alapú hatvány"],
            [R`$x^2\cos x$`, "Leibniz-szabály"],
            [R`$\dfrac{\sin x}{x}$`, "hányadosszabály"],
            [R`$\sin^3 x$`, "láncszabály, külső: köbre emelés"],
            [R`$x^{\sin x}$`, "logaritmikus deriválás"]
          ],
          hint: "Mi lenne az utolsó lépés, ha egy konkrét x-re kiszámolnád az értéket? Ha az alap és a kitevő is függ x-től, egyik hatvány-szabály sem jó.",
          explain: R`$e^{x\sin x}$: utoljára $e$-t emeled a kitevőre → láncszabály (a belső $x\sin x$-hez utána kell a Leibniz). $x^2\cos x$: utoljára szorzol → Leibniz. $\tfrac{\sin x}{x}$: utoljára osztasz → hányadosszabály. $\sin^3 x = (\sin x)^3$: utoljára köbre emelsz → láncszabály, a külső réteg a hatvány, nem a $\sin$. $x^{\sin x}$: változó alap és kitevő → $e^{\sin x\ln x}$, logaritmikus deriválás.`
        }
      ]
    },

    /* ------------------------------------------------ 4.6 */
    "an4-46": {
      title: "Kvíz – 4.6 Magasabb rendű deriváltak",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Legyen $f(x) = x^4 - 2x^3$. Mennyi $f''(2)$?`,
          options: [R`$24$`, R`$64$`, R`$8$`, R`$0$`],
          answer: 0,
          hint: R`A második derivált a derivált deriváltja – kétszer deriválj egymás után, és csak a végén helyettesíts.`,
          explain: R`$f'(x) = 4x^3 - 6x^2$, $f''(x) = 12x^2 - 12x$, így $f''(2) = 48 - 24 = 24$. A $64 = \bigl(f'(2)\bigr)^2$ a „második = négyzet” tévedés ($f'' \ne (f')^2$); a $8 = f'(2)$ csak egyszer deriválta; a $0 = f(2)$ a függvény értéke.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy autó a fékezés kezdetétől $t$ másodperc alatt $s(t) = 30t - 3t^2$ métert tesz meg. Mekkora a gyorsulása, és mikor áll meg?`,
          options: [
            R`$a = -6\ \tfrac{\text{m}}{\text{s}^2}$, $t = 5$ s-nál`,
            R`$a = -3\ \tfrac{\text{m}}{\text{s}^2}$, $t = 10$ s-nál`,
            R`$a = -6\ \tfrac{\text{m}}{\text{s}^2}$, $t = 10$ s-nál`,
            R`$a = 30\ \tfrac{\text{m}}{\text{s}^2}$, $t = 5$ s-nál`
          ],
          answer: 0,
          hint: R`$v = s'$, $a = v' = s''$. Megállás: a sebesség 0 – nem az út!`,
          explain: R`$v(t) = 30 - 6t$, $a(t) = -6\ \tfrac{\text{m}}{\text{s}^2}$ (lassul: $v \gt 0$, $a \lt 0$). $v = 0 \Rightarrow t = 5$ s; addig $s(5) = 150 - 75 = 75$ m. A $-3$ a $t^2$ deriválásánál hagyja el a 2-es szorzót. A $t = 10$ az $s(t) = 0$ megoldása – az nem megállás (és a képlet csak $0 \le t \le 5$-re írja le a mozgást). A $30$ a kezdősebesség, nem gyorsulás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\cos^{(2027)} x$ (a koszinusz 2027-edik deriváltja)?`,
          options: [R`$\sin x$`, R`$-\sin x$`, R`$-\cos x$`, R`$\cos x$`],
          answer: 0,
          hint: "A szögfüggvények deriváltjai 4-es ciklust alkotnak. Mennyi 2027 maradéka 4-gyel osztva? Utána számold végig a ciklust a cos-tól indulva.",
          explain: R`$2027 = 4\cdot 506 + 3$, tehát a harmadik deriváltat kell venni: $\cos x \to -\sin x \to -\cos x \to \sin x$. A $-\sin x$ az első, a $-\cos x$ a második derivált – ezek a ciklus elcsúszásából jönnek; a $\cos x$ a 0. (vagy 4.) lépés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(e^{3x}\bigr)^{(4)}$?`,
          options: [R`$81\,e^{3x}$`, R`$12\,e^{3x}$`, R`$64\,e^{3x}$`, R`$3\,e^{3x}$`],
          answer: 0,
          hint: "Minden deriválás a láncszabály miatt ugyanazt a szorzót adja. Hányszor jön le?",
          explain: R`$\bigl(e^{kx}\bigr)^{(n)} = k^n e^{kx}$, itt $3^4 = 81$. A $12 = 3\cdot 4$ a $k$-t $n$-nel szorozza ahelyett, hogy az $n$-edik hatványra emelné; a $64 = 4^3$ felcseréli az alapot és a kitevőt; a $3e^{3x}$ csak az első derivált.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\left(\dfrac1x\right)^{(4)}$?`,
          options: [R`$\dfrac{24}{x^5}$`, R`$\dfrac{1}{x^5}$`, R`$-\dfrac{24}{x^5}$`, R`$\dfrac{24}{x^4}$`],
          answer: 0,
          hint: R`Írd $x^{-1}$-nek; minden deriválásnál lejön a kitevő, és eggyel csökken. Kövesd az előjelet is!`,
          explain: R`$-x^{-2} \to 2x^{-3} \to -6x^{-4} \to 24x^{-5}$, vagyis $\tfrac{(-1)^4\,4!}{x^5} = \tfrac{24}{x^5}$. Az $\tfrac{1}{x^5}$-ből elmaradt a faktoriális (a lejövő kitevők szorzódnak). A $-\tfrac{24}{x^5}$ előjelhiba: páros rendnél pozitív. A $\tfrac{24}{x^4}$-nél a kitevő csak háromszor csökkent.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy test útja $s(t) = t^3 - 3t^2$ (m, s). Mi igaz a $t = 1{,}5$ s pillanatban?`,
          options: [
            R`$v = -2{,}25\ \tfrac{\text{m}}{\text{s}}$, $a = 3\ \tfrac{\text{m}}{\text{s}^2}$: lassul, mert $v$ és $a$ ellentétes előjelű`,
            R`$v = -2{,}25\ \tfrac{\text{m}}{\text{s}}$, $a = 3\ \tfrac{\text{m}}{\text{s}^2}$: gyorsul, mert $a \gt 0$`,
            R`$v = -2{,}25\ \tfrac{\text{m}}{\text{s}}$, $a = 3\ \tfrac{\text{m}}{\text{s}^2}$: lassul, mert $v \lt 0$`,
            R`$v = 0$, $a = 0$: a test áll`
          ],
          answer: 0,
          hint: R`Számold ki $v = s'$ és $a = s''$ értékét. A gyorsulás vagy lassulás attól függ, hogy $v$ és $a$ azonos vagy ellentétes előjelű-e.`,
          explain: R`$v(t) = 3t^2 - 6t$, $v(1{,}5) = 6{,}75 - 9 = -2{,}25$ m/s (visszafelé halad); $a(t) = 6t - 6$, $a(1{,}5) = 3$ m/s². Ellentétes előjel → a sebesség nagysága csökken: lassul. Nem az $a$ előjele dönt egyedül („$a \gt 0$, tehát gyorsul” hibás), és nem is a $v$ előjele. $v = 0$ csak $t = 0$-ban és $t = 2$-ben van.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            R`$f''$ az $f'$ deriváltja.`,
            R`$(x^3)'' = \bigl((x^3)'\bigr)^2 = 9x^4$`,
            "Egy ötödfokú polinom hatodik deriváltja 0.",
            R`$\sin^{(4)} x = -\sin x$`,
            R`Ha $s$-et méterben, $t$-t másodpercben mérjük, $s''$ mértékegysége m/s².`
          ],
          answer: [0, 2, 4],
          hint: "A „második” a deriválások számát jelenti, nem hatványt. Számold végig a szinusz ciklusát, és gondold meg, mit csinál a deriválás a mértékegységgel.",
          explain: R`Igaz: $f'' = (f')'$. Igaz: az $n$-edfokú polinom $n$-edik deriváltja állandó ($5!\,a_5$), a következő már 0. Igaz: minden deriválás még egyszer oszt a $t$ egységével: m → m/s → m/s². Hamis: $(x^3)'' = 6x$, a $9x^4$ az első derivált négyzete. Hamis: $\sin \to \cos \to -\sin \to -\cos \to \sin$, tehát $\sin^{(4)} x = \sin x$.`
        },
        {
          type: "match",
          q: "Párosítsd a függvényeket a harmadik deriváltjukkal!",
          pairs: [
            [R`$x^3$`, "6"],
            [R`$e^{2x}$`, "8·e^(2x)"],
            [R`$\sin x$`, "−cos x"],
            [R`$\ln x$`, "2/x³"],
            [R`$x^2$`, "0"]
          ],
          hint: "Deriválj háromszor egymás után; az e^(kx)-nél minden lépés egy k szorzót ad, a ln x első deriváltja 1/x.",
          explain: R`$x^3 \to 3x^2 \to 6x \to 6$. $e^{2x}$: $2^3 = 8$, tehát $8e^{2x}$. $\sin x \to \cos x \to -\sin x \to -\cos x$. $\ln x \to \tfrac1x \to -\tfrac{1}{x^2} \to \tfrac{2}{x^3}$. $x^2 \to 2x \to 2 \to 0$: a másodfokú polinom harmadik deriváltja már 0.`
        }
      ]
    },

    /* ------------------------------------------------ 4.7 */
    "an4-47": {
      title: "Kvíz – 4.7 Lineáris közelítés és differenciál",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Becsüld meg lineáris közelítéssel $\sqrt{16{,}4}$ értékét!`,
          options: [R`$4{,}05$`, R`$4{,}1$`, R`$4{,}4$`, R`$4{,}2$`],
          answer: 0,
          hint: R`Válassz egy jól ismert pontot ($a = 16$), és használd: $f(a + h) \approx f(a) + f'(a)\,h$, ahol $(\sqrt x)' = \tfrac{1}{2\sqrt x}$.`,
          explain: R`$a = 16$, $h = 0{,}4$, $f'(16) = \tfrac{1}{2\cdot 4} = \tfrac18$: $\sqrt{16{,}4} \approx 4 + \tfrac{0{,}4}{8} = 4{,}05$ (pontosan $4{,}0497$). A $4{,}1$ a 2-es nevezőt hagyja el ($\tfrac14$ meredekség), a $4{,}4$ a $h$-t egyszerűen hozzáadja (mintha a meredekség 1 lenne), a $4{,}2$ pedig $\tfrac12$-nek veszi a meredekséget.`
        },
        {
          type: "single", shuffle: true,
          q: R`Becsüld meg $e^{-0{,}05}$ értékét lineáris közelítéssel!`,
          options: [R`$0{,}95$`, R`$1{,}05$`, R`$0{,}05$`, R`$-0{,}05$`],
          answer: 0,
          hint: R`Az $e^x$ érintője a 0-ban: $y = 1 + x$. Mennyi itt $x$?`,
          explain: R`Kis $x$-re $e^x \approx 1 + x$, itt $x = -0{,}05$: $e^{-0{,}05} \approx 0{,}95$ (pontosan $0{,}9512$). Az $1{,}05$ elveszti az előjelet; a $0{,}05$ és a $-0{,}05$ az $f(a) = 1$ tagot hagyja el – a lineáris közelítés a <em>változást</em> becsli $f'(a)h$-val, az értékhez $f(a)$ is kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`$y = x^2$, $x = 5$, $dx = 0{,}2$. Mennyi a differenciál, $dy$?`,
          options: [R`$2$`, R`$2{,}04$`, R`$0{,}04$`, R`$10$`],
          answer: 0,
          hint: R`A differenciál a növekmény lineáris része: $dy = f'(x)\,dx$. Nem azonos a valódi megváltozással, $\Delta y$-nal!`,
          explain: R`$dy = 2x\,dx = 2\cdot 5\cdot 0{,}2 = 2$. A $2{,}04 = 5{,}2^2 - 25$ a valódi $\Delta y$ – ez tartalmazza a kis sarkot is ($0{,}2^2 = 0{,}04$), a differenciál nem. A $0{,}04$ csak a sarok, a $10 = f'(5)$ pedig a meredekség, $dx$-szel nem szorozva.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kocka élét 2% relatív hibával mérjük. Kb. mekkora a térfogat relatív hibája?`,
          options: [R`$6\%$`, R`$2\%$`, R`$8\%$`, R`$4\%$`],
          answer: 0,
          hint: R`$V = a^3$. Hatványnál a relatív hiba: $\dfrac{dy}{y} = n\,\dfrac{dx}{x}$.`,
          explain: R`$\dfrac{dV}{V} = 3\,\dfrac{da}{a} = 3\cdot 2\% = 6\%$ (pontosan $1{,}02^3 - 1 \approx 6{,}12\%$). A $2\%$ a relatív hibát változatlannak veszi, a $8\% = 2^3$ a hibát köbre emeli ahelyett, hogy háromszorozná, a $4\%$ a négyzetre emelés (terület) szabálya.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kör sugarát 4 cm-nek mérjük, $\pm 0{,}1$ cm pontossággal. Kb. mekkora a terület ($A = \pi r^2$) hibája a differenciál szerint?`,
          options: [R`$\approx 2{,}51\ \text{cm}^2$`, R`$\approx 1{,}26\ \text{cm}^2$`, R`$\approx 0{,}031\ \text{cm}^2$`, R`$0{,}8\ \text{cm}^2$`],
          answer: 0,
          hint: R`$dA = A'(r)\,dr$. Mennyi $(\pi r^2)'$?`,
          explain: R`$dA = 2\pi r\,dr = 2\pi\cdot 4\cdot 0{,}1 = 0{,}8\pi \approx 2{,}51$ cm² (a pontos növekmény $\pi(4{,}1^2 - 16) \approx 2{,}54$). Az $1{,}26 = 0{,}4\pi$ a deriválásnál elhagyja a 2-es szorzót, a $0{,}031 = \pi\cdot 0{,}1^2$ a hibát négyzetre emeli, a $0{,}8$-ból kimaradt a $\pi$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 3. fejezet víz-modelljében $V(T) = 1000 + 0{,}0075(T - 4)^2$ cm³, $V'(T) = 0{,}015(T - 4)$. A differenciál szerint kb. milyen pontos hőmérő kell 14 °C-on, hogy a térfogat hibája 0,1 cm³ alatt maradjon?`,
          options: [R`$\approx 0{,}67$ °C`, R`$1{,}5$ °C`, R`$0{,}15$ °C`, R`$0{,}015$ °C`],
          answer: 0,
          hint: R`$|\Delta V| \approx |V'(T)|\cdot|\Delta T|$. Számold ki $V'(14)$-et, és fejezd ki $\Delta T$-t.`,
          explain: R`$V'(14) = 0{,}015\cdot 10 = 0{,}15\ \tfrac{\text{cm}^3}{\text{°C}}$, így $\Delta T \approx \tfrac{0{,}1}{0{,}15} \approx 0{,}67$ °C (a pontos számolás $\approx 0{,}646$ °C-ot ad). Az $1{,}5 = \tfrac{0{,}15}{0{,}1}$ fordítva osztott; a $0{,}15$ maga a derivált (cm³/°C, nem °C – a mértékegység is elárulja); a $0{,}015$ a $(T - 4)$ szorzót hagyja el.`
        },
        {
          type: "single", shuffle: true,
          q: R`A lineáris közelítés szerint $1{,}02^{50} \approx 1 + 50\cdot 0{,}02 = 2$, a valódi érték viszont kb. $2{,}69$. Mi a nagy hiba oka?`,
          options: [
            R`A függvény ($x^{50}$) az 1 körül nagyon görbül ($f''(1) = 2450$), így a $h^2$-tel arányos hiba nagy, pedig $h$ kicsi.`,
            R`Rossz pontot választottunk: $a = 1{,}02$-t kellett volna.`,
            R`A derivált hibás: $(x^{50})' = 49x^{50}$, tehát $f'(1) = 49$, nem $50$.`,
            R`A lineáris közelítés csak $h \lt 0$-ra működik.`
          ],
          answer: 0,
          hint: R`A közelítés hibája szép függvényeknél kb. $\tfrac{f''(a)}{2}h^2$. Mekkora itt $f''(1)$?`,
          explain: R`$f(x) = x^{50}$, $f'(1) = 50$ (ez rendben van, a $49$ a hibás $(x^{50})' = 49x^{50}$ szabályból jönne), de $f''(1) = 50\cdot 49 = 2450$, így a hiba kb. $\tfrac{2450}{2}\cdot 0{,}02^2 = 0{,}49$ – nagyságrendileg ennyi a valódi eltérés is. A lineáris közelítés csak az $a$ <em>közelében</em> jó, és a „közel” azon múlik, mennyire görbül a függvény. Az $a = 1{,}02$-ben épp az értéket nem ismerjük; a $h$ előjele pedig nem számít.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            R`A lineáris közelítés, $f(a) + f'(a)h$, az érintőn olvassa le az értéket a görbe helyett.`,
            R`A differenciál és a valódi megváltozás mindig egyenlő: $dy = \Delta y$.`,
            R`A $\sqrt{4 + h}$ közelítésénél, ha $h$ tizedére csökken, a hiba kb. századára csökken.`,
            R`Kis $x$-re (radiánban) $\sin x \approx x$.`,
            R`$\sqrt{4{,}1}$ becsléséhez az $a = 4{,}1$ pontot érdemes választani.`
          ],
          answer: [0, 2, 3],
          hint: "Gondolj a négyzet területének „kis sarkára”, a √(4+h) táblázatára, és arra, hogy melyik pontban ismerjük a függvény értékét.",
          explain: R`Igaz: $y = f(a) + f'(a)(x - a)$ az érintő egyenlete. Igaz: a hiba $h^2$-tel arányos ($0{,}000\,154 \to 0{,}000\,001\,56$). Igaz: a $\sin$ érintője a 0-ban $y = x$, pl. $\sin 0{,}1 \approx 0{,}1$. Hamis: $dy$ csak közelíti $\Delta y$-t (az $x^2$-nél a 3-ban $0{,}6$ kontra $0{,}61$). Hamis: $a = 4$ kell, mert ott ismerjük az értéket és a deriváltat; a $4{,}1$-ben épp $\sqrt{4{,}1}$ ismeretlen.`
        }
      ]
    },

    /* ------------------------------------------------ 4.8 */
    "an4-48": {
      title: "Kvíz – 4.8 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy kő $s(t) = 5t^2$ métert esik $t$ másodperc alatt. Mekkora sebességgel csapódik be, ha 80 m magasról ejtettük le?`,
          options: [R`$40\ \tfrac{\text{m}}{\text{s}}$`, R`$20\ \tfrac{\text{m}}{\text{s}}$`, R`$10\ \tfrac{\text{m}}{\text{s}}$`, R`$144\ \tfrac{\text{m}}{\text{s}}$`],
          answer: 0,
          hint: R`Előbb az időt keresd meg ($s(t) = 80$), aztán a pillanatnyi sebességet: $v = s'$.`,
          explain: R`$5t^2 = 80 \Rightarrow t = 4$ s, $v(t) = 10t$, így $v(4) = 40$ m/s $= 144$ km/h. A $20 = \tfrac{80}{4}$ az átlagsebesség az egész esésre, nem a pillanatnyi. A $10$ a gyorsulás ($\tfrac{\text{m}}{\text{s}^2}$). A $144$ km/h-ban helyes – m/s-ban mértékegység-hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`A költségfüggvény (ezer Ft-ban) $C(q) = 100 + 4q + 0{,}02q^2$. Mennyi a határköltség 50 darabnál?`,
          options: [R`$6$ ezer Ft/db`, R`$7$ ezer Ft/db`, R`$6{,}02$ ezer Ft/db`, R`$350$ ezer Ft/db`],
          answer: 0,
          hint: R`A határköltség a költségfüggvény deriváltja, $C'(q)$ – nem az átlag, és nem a teljes költség.`,
          explain: R`$C'(q) = 4 + 0{,}04q$, $C'(50) = 6$ ezer Ft/db. A $6{,}02 = C(51) - C(50)$ az 51. darab tényleges költsége – ezt közelíti a határköltség, de nem ugyanaz. A $7 = \tfrac{C(50)}{50} = \tfrac{350}{50}$ az átlagköltség (benne az állandó költség része is), a $350 = C(50)$ a teljes költség.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanennél a $C(q) = 100 + 4q + 0{,}02q^2$ költségnél a bevétel $R(q) = 16q - 0{,}01q^2$. Melyik darabszámig nő még a profit?`,
          options: [R`$q = 200$`, R`$q = 800$`, R`$q = 240$`, R`$q = 300$`],
          answer: 0,
          hint: R`Amíg a határbevétel nagyobb a határköltségnél ($R'(q) \gt C'(q)$), még egy darab többet hoz, mint amennyibe kerül.`,
          explain: R`$R'(q) = 16 - 0{,}02q$, $C'(q) = 4 + 0{,}04q$. $R' = C' \iff 12 = 0{,}06q \iff q = 200$; addig nő a profit. A $800$ az $R'(q) = 0$ megoldása – a bevétel maximuma, a költséget figyelmen kívül hagyja. A $240$ az $R'$-ből, a $300$ a $C'$-ből hagyja el a $q^2$ deriválásakor lejövő 2-es szorzót.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy település lakossága $t$ év múlva $B(t) = 2000\cdot 1{,}1^t$ fő. Milyen gyorsan nő most ($t = 0$)?`,
          options: [R`$\approx 190{,}6$ fő/év`, R`$200$ fő/év`, R`$0$ fő/év`, R`$2200$ fő/év`],
          answer: 0,
          hint: R`Exponenciális függvény: $(a^t)' = a^t\ln a$ – nem a hatványszabály!`,
          explain: R`$B'(t) = 2000\cdot 1{,}1^t\ln 1{,}1$, így $B'(0) = 2000\ln 1{,}1 \approx 190{,}6$ fő/év – a pillanatnyi ütem. A $200$ az első év teljes növekménye ($2200 - 2000$; az év közben a növekedés gyorsul). A $0$ a hibás $(a^t)' = t\,a^{t - 1}$ szabályból jön. A $2200 = B(1)$ egy létszám, nem ütem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $B(t) = 2000\cdot 1{,}1^t$ lakosság relatív növekedési üteme, $\tfrac{B'(t)}{B(t)}$?`,
          options: [R`$\approx 9{,}53\%$ évente, minden $t$-re`, R`$10\%$ évente, minden $t$-re`, R`$110\%$ évente, minden $t$-re`, R`$\approx 9{,}53\%$ évente, de csak $t = 0$-ban`],
          answer: 0,
          hint: R`Írd fel a hányadost: a $2000\cdot 1{,}1^t$ tényező egyszerűsödik. Mi marad?`,
          explain: R`$\tfrac{B'(t)}{B(t)} = \ln 1{,}1 \approx 0{,}0953 = 9{,}53\%$ – $t$-től független: ez az exponenciális növekedés ismertetőjele. A $10\%$ az évi (diszkrét) növekedés, nem a pillanatnyi relatív ütem; a $110\%$ a szorzót ($1{,}1$) keveri a növekedéssel. A „csak $t = 0$-ban” elfelejti, hogy a hányados minden $t$-re ugyanaz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy tartályban $t$ perc után $Q(t)$ liter víz van, és $Q'(10) = -12$. Mit jelent ez?`,
          options: [
            R`A 10. perc pillanatában a víz percenként 12 literes ütemben fogy.`,
            R`A 10. percben 12 liter víz van a tartályban.`,
            R`Az első 10 percben 12 liter víz folyt ki.`,
            R`A 10. percben a víz percenként 12 literes ütemben gyűlik.`
          ],
          answer: 0,
          hint: R`$[Q'] = \tfrac{[Q]}{[t]}$. Mit mutat a derivált előjele, és mit a nagysága?`,
          explain: R`$Q'$ mértékegysége liter/perc: a pillanatnyi változási sebesség. A negatív előjel csökkenést jelent – percenként kb. 12 liter fogy (ha így folytatódna). A „12 liter van” a $Q(10)$-zel keveri ($f'(a) \ne f(a)$), az „első 10 percben 12 liter” a változást keveri a változási sebességgel, a „gyűlik” előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`A kereslet $q(p) = 120 - 3p$. Mennyi a rugalmasság, $E = \dfrac{p\,q'(p)}{q(p)}$, a $p = 10$ árnál?`,
          options: [R`$\approx -0{,}33$`, R`$-3$`, R`$\approx -0{,}033$`, R`$-30$`],
          answer: 0,
          hint: R`Három szám kell: $p$, $q'(p)$ és $q(p)$. A rugalmasság a relatív változások aránya, ezért szorzunk $p$-vel és osztunk $q$-val.`,
          explain: R`$q(10) = 90$, $q' = -3$, $E = \tfrac{10\cdot(-3)}{90} = -\tfrac13 \approx -0{,}33$: 1% áremelés kb. 0,33% keresletcsökkenést okoz (rugalmatlan, $|E| \lt 1$). A $-3$ maga a derivált (darab/Ft, abszolút változás), a $-0{,}033 = \tfrac{-3}{90}$ a $p$-vel való szorzást hagyja el, a $-30 = 10\cdot(-3)$ a $q$-val való osztást.`
        },
        {
          type: "single", shuffle: true,
          q: R`$C(q) = 200 + 5q + 0{,}01q^2$ (ezer Ft). 100 darabnál az átlagköltség 8, a határköltség 7 ezer Ft/db. Mi következik ebből?`,
          options: [
            "Még egy darab legyártása csökkenti az egy darabra jutó (átlag)költséget.",
            "Még egy darab legyártása növeli az átlagköltséget.",
            "A 101. darab 8 ezer Ft-ba kerül.",
            "A határköltség hibás, mert mindig egyenlő az átlagköltséggel."
          ],
          answer: 0,
          hint: "Ha egy csoport átlagához egy, az átlagnál kisebb értéket adsz, mi történik az átlaggal?",
          explain: R`A következő darab kb. $C'(100) = 7$ ezer Ft-ba kerül (pontosan $7{,}01$), ami kevesebb az eddigi 8-as átlagnál, ezért az átlag csökken. Az átlagköltségben benne van a 200-as állandó költség része is, a határköltségben nincs – a kettő általában nem egyenlő. A „8 ezer Ft” az átlagot keveri a határköltséggel.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "an4-final": {
      title: "Fejezetzáró teszt – 4. A derivált",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A kő $s(t) = 5t^2$ métert esik. Mennyi az átlagsebessége a $[3; 5]$ időszakban?`,
          options: [R`$40\ \tfrac{\text{m}}{\text{s}}$`, R`$80\ \tfrac{\text{m}}{\text{s}}$`, R`$-40\ \tfrac{\text{m}}{\text{s}}$`, R`$30\ \tfrac{\text{m}}{\text{s}}$`],
          answer: 0,
          hint: R`Átlagos változási sebesség: $\dfrac{s(5) - s(3)}{5 - 3}$. Ugyanabban a sorrendben vonj ki fent és lent!`,
          explain: R`$\dfrac{125 - 45}{5 - 3} = \dfrac{80}{2} = 40$ m/s. A $80$ a megtett út (változás), nem osztottuk az idővel. A $-40$ a számlálóban és a nevezőben különböző sorrendben vont ki. A $30 = v(3)$ a pillanatnyi sebesség az időszak elején.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{h\to 0}\dfrac{f(1 + h) - f(1)}{h}$, ha $f(x) = x^2 + 3x$?`,
          options: [R`$5$`, R`$4$`, R`$2$`, R`$3$`],
          answer: 0,
          hint: R`Ez $f'(1)$ a definícióval. Fejtsd ki $f(1 + h)$-t, vonj ki, egyszerűsíts $h$-val – csak utána engedd $h$-t 0-hoz.`,
          explain: R`$f(1 + h) - f(1) = (1 + 2h + h^2 + 3 + 3h) - 4 = 5h + h^2$, osztva $h$-val: $5 + h \to 5$. (Szabállyal: $f'(x) = 2x + 3$, $f'(1) = 5$.) A $4 = f(1)$ a függvény értéke, nem a meredeksége. A $2$ csak az $x^2$, a $3$ csak a $3x$ tag deriváltja.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^2$, ha $x \le 1$, és $f(x) = 2x - 1$, ha $x \gt 1$. Mit mondhatsz $f$-ről az 1-ben?`,
          options: [
            R`Deriválható, és $f'(1) = 2$.`,
            "Nem deriválható, mert két képlettel van megadva.",
            R`Nem deriválható, mert ott törés van.`,
            R`Nem deriválható, mert nem folytonos.`
          ],
          answer: 0,
          hint: R`Két dolgot nézz meg: folytonos-e (a két darab ugyanoda ér-e $f(1) = 1$-ben), és egyenlő-e a bal és a jobb oldali derivált, a valódi $f(1)$-gyel számolva.`,
          explain: R`Folytonos: $2\cdot 1 - 1 = 1 = f(1)$. Bal oldali derivált: $\tfrac{(1 + h)^2 - 1}{h} = 2 + h \to 2$; jobb oldali: $\tfrac{2(1 + h) - 1 - 1}{h} = 2$. Egyenlők, tehát deriválható, $f'(1) = 2$ – a darabok simán csatlakoznak (az $y = 2x - 1$ éppen az $x^2$ érintője az 1-ben). A 4.2 hasonló példájában ($2x$ a jobb oldalon) a függvény ugrott – ott a folytonosság hiányzott. A két képlet önmagában nem akadály.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            "Ha f deriválható az a-ban, akkor ott folytonos is.",
            "Ha f nem deriválható az a-ban, akkor ott nem is folytonos.",
            R`$|x|$ folytonos a 0-ban, de ott nem deriválható.`,
            R`$\sqrt[3]{x}$ a 0-ban deriválható, a deriváltja $+\infty$.`,
            "A görbe érintője az az egyenes, amelynek pontosan egy közös pontja van a görbével."
          ],
          answer: [0, 2],
          hint: "Melyik irányban igaz a kapcsolat a deriválhatóság és a folytonosság között? Mit kíván a definíció a határértéktől? Gondolj az x³ érintőjére az 1-ben.",
          explain: R`Igaz: deriválható ⇒ folytonos (a bizonyításban $f'(a)$ végessége kell). Igaz: $|x|$-nél $f'_-(0) = -1 \ne 1 = f'_+(0)$, törés. Hamis: a megfordítás nem igaz – $|x|$ folytonos, mégsem deriválható. Hamis: a deriválhatósághoz <em>véges</em> határérték kell; a $+\infty$ függőleges érintőt jelent, nem deriválhatóságot. Hamis: az $x^3$ érintője az 1-ben ($y = 3x - 2$) a $-2$-ben újra metszi a görbét; az érintő helyi fogalom.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = x^3$ grafikonjának érintője az $x = 2$ pontban?`,
          options: [R`$y = 12x - 16$`, R`$y = 12x - 24$`, R`$y = 12x + 8$`, R`$y = -12x + 32$`],
          answer: 0,
          hint: R`$y = f(a) + f'(a)(x - a)$: kell az $f(2)$, az $f'(2)$, és az $(x - 2)$ tényező.`,
          explain: R`$f(2) = 8$, $f'(2) = 3\cdot 4 = 12$: $y = 8 + 12(x - 2) = 12x - 16$ (ellenőrzés: $x = 2$-ben $8$ ✔). A $12x - 24$ elhagyja az $f(a)$ tagot, a $12x + 8$ az $(x - a)$ helyett $x$-et ír, a $-12x + 32$ előjelhiba ($8 - 12(x - 2)$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(3^x\bigr)'$ az $x = 2$ pontban?`,
          options: [R`$9\ln 3 \approx 9{,}89$`, R`$6$`, R`$9$`, R`$\tfrac{9}{\ln 3} \approx 8{,}19$`],
          answer: 0,
          hint: "Hatvány vagy exponenciális? Melyik állandó: az alap vagy a kitevő?",
          explain: R`Az alap állandó, tehát exponenciális: $(a^x)' = a^x\ln a$, a 2-ben $9\ln 3 \approx 9{,}89$. A $6 = x\cdot 3^{x - 1}$ a hatványszabály rossz helyen; a $9 = 3^2$ az $e^x$ szabályát ($(e^x)' = e^x$) viszi át más alapra; a $\tfrac{9}{\ln 3}$ a logaritmusfüggvény $\tfrac{1}{x\ln a}$ alakjával keveri.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\left(\dfrac{x^2}{x + 1}\right)'$ az $x = 1$ pontban?`,
          options: [R`$\tfrac34$`, R`$-\tfrac34$`, R`$\tfrac32$`, R`$2$`],
          answer: 0,
          hint: R`Hányadosszabály: $\dfrac{f'g - fg'}{g^2}$. Figyelj a számláló sorrendjére és a nevező négyzetére.`,
          explain: R`$\dfrac{2x(x + 1) - x^2\cdot 1}{(x + 1)^2}$, az 1-ben $\dfrac{4 - 1}{4} = \dfrac34$. A $-\tfrac34$ felcserélte a számláló tagjait ($fg' - f'g$), a $\tfrac32$ a nevező négyzete helyett a nevezővel osztott, a $2 = \tfrac{f'}{g'} = \tfrac{2x}{1}$ a „számláló deriváltja per nevező deriváltja” tévedés.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^3 + x$ szigorúan nő, és $f(1) = 2$. Mennyi az inverz függvény deriváltja a 2-ben, $\bigl(f^{-1}\bigr)'(2)$?`,
          options: [R`$\tfrac14$`, R`$\tfrac{1}{13}$`, R`$4$`, R`$13$`],
          answer: 0,
          hint: R`$\bigl(f^{-1}\bigr)'(y) = \dfrac{1}{f'(x)}$, ahol $y = f(x)$. Melyik $x$ tartozik az $y = 2$-höz?`,
          explain: R`Az $y = 2$-höz az $x = 1$ tartozik, $f'(x) = 3x^2 + 1$, $f'(1) = 4$, tehát $\bigl(f^{-1}\bigr)'(2) = \tfrac14$. Az $\tfrac{1}{13} = \tfrac{1}{f'(2)}$ rossz pontban veszi a deriváltat (mint a $\sqrt x$-nél a 9 a 3 helyett). A $4$ és a $13$ elfelejti a reciprokot: a tükrözés felcseréli a vízszintes és a függőleges lépést.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(\sin^2 3x\bigr)'$?`,
          options: [R`$6\sin 3x\cos 3x$`, R`$2\sin 3x\cos 3x$`, R`$3\cos^2 3x$`, R`$18x\cos(9x^2)$`],
          answer: 0,
          hint: R`$\sin^2 3x = (\sin 3x)^2$: három réteg van. Melyik a legkülső? Minden réteg deriváltja szorzóként megjelenik.`,
          explain: R`Rétegek kívülről: négyzet → $\sin$ → $3x$. $2\sin 3x\cdot\cos 3x\cdot 3 = 6\sin 3x\cos 3x$. A $2\sin 3x\cos 3x$-ből a legbelső 3-as szorzó maradt el (félbehagyott láncszabály). A $3\cos^2 3x$ rossz sorrendben „hámoz” (előbb a $\sin$-t deriválja, aztán négyzetre emel). A $18x\cos(9x^2)$ a $\sin\bigl((3x)^2\bigr)$ deriváltja – $\sin^2 3x = (\sin 3x)^2$ és $\sin\bigl((3x)^2\bigr)$ nem ugyanaz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\bigl(x^{\ln x}\bigr)'$ az $x = e$ pontban?`,
          options: [R`$2$`, R`$1$`, R`$e \approx 2{,}72$`, R`$\tfrac2e \approx 0{,}74$`],
          answer: 0,
          hint: R`Változik az alap és a kitevő is: írd át $e^{\ln x\cdot\ln x}$ alakba, és használd a láncszabályt.`,
          explain: R`$x^{\ln x} = e^{(\ln x)^2}$, deriváltja $e^{(\ln x)^2}\cdot\tfrac{2\ln x}{x} = x^{\ln x}\cdot\tfrac{2\ln x}{x}$. Az $e$-ben $e^1\cdot\tfrac{2}{e} = 2$. Az $1$ csak a „hatványszerű” tagot ($\ln x\cdot x^{\ln x - 1}$) veszi – a helyes eredmény két ilyen tag összege. Az $e = x^{\ln x}\ln x$ az exponenciális szabály változó alapra. A $\tfrac2e$ elfelejti visszaszorozni $x^{\ln x}$-szel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $y'$ az $x\,y^2 = 4$ görbe $(1; 2)$ pontjában?`,
          options: [R`$-1$`, R`$0$`, R`$-2$`, R`$-4$`],
          answer: 0,
          hint: R`A bal oldal szorzat: Leibniz-szabály kell, és az $y^2$ deriválásánál a láncszabály ($y$ az $x$ függvénye).`,
          explain: R`$1\cdot y^2 + x\cdot 2y\,y' = 0$, így $y' = -\dfrac{y^2}{2xy} = -\dfrac{y}{2x} = -1$. (Ellenőrzés: $y = \tfrac{2}{\sqrt x}$, $y' = -x^{-3/2}$, az 1-ben $-1$ ✔.) A $0$ elhagyja a Leibniz-szabály első tagját ($(xy^2)' = 2xyy'$). A $-2$ a $(y^2)' = y\,y'$ hibából (lemaradt a 2), a $-4$ a $(y^2)' = y'$ hibából jön.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x\,e^{2x}$. Mennyi $f''(0)$?`,
          options: [R`$4$`, R`$1$`, R`$0$`, R`$3$`],
          answer: 0,
          hint: R`Deriválj kétszer: mindkétszer Leibniz-szabály, és az $e^{2x}$ deriválásánál ne feledd a láncszabályt.`,
          explain: R`$f'(x) = e^{2x} + 2x e^{2x} = (1 + 2x)e^{2x}$, $f''(x) = 2e^{2x} + (1 + 2x)\cdot 2e^{2x} = (4 + 4x)e^{2x}$, $f''(0) = 4$. Az $1 = \bigl(f'(0)\bigr)^2$ az „$f'' = (f')^2$” tévedés. A $0$ a Leibniz-szabályt hagyja el ($x\cdot 4e^{2x}$). A $3$-nál a második deriválásban az $e^{2x}$ belső deriváltja (2) maradt el: $2e^{2x} + (1 + 2x)e^{2x}$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kocka élét 10 cm-nek mérjük, $\pm 0{,}1$ cm hibával. Mekkora a térfogat hibája a differenciál szerint, abszolút és relatív értékben?`,
          options: [
            R`$30\ \text{cm}^3$ és $3\%$`,
            R`$30\ \text{cm}^3$ és $1\%$`,
            R`$3\ \text{cm}^3$ és $3\%$`,
            R`$0{,}001\ \text{cm}^3$ és $1\%$`
          ],
          answer: 0,
          hint: R`$dV = V'(a)\,da$, ahol $V = a^3$. A relatív hiba hatványnál: $\tfrac{dy}{y} = n\,\tfrac{dx}{x}$.`,
          explain: R`$dV = 3a^2\,da = 3\cdot 100\cdot 0{,}1 = 30$ cm³ (a pontos növekmény $10{,}1^3 - 1000 = 30{,}301$). Relatív: $\tfrac{30}{1000} = 3\% = 3\cdot\tfrac{0{,}1}{10}$ – az él 1%-os hibájának háromszorosa. Az „$1\%$” a relatív hibát változatlannak veszi, a $3$ cm³ $3a\,da$-t számol $3a^2\,da$ helyett, a $0{,}001 = 0{,}1^3$ a hibát köbre emeli.`
        },
        {
          type: "single", shuffle: true,
          q: R`$C(q) = 200 + 5q + 0{,}01q^2$ (ezer Ft). Mi igaz 200 darabnál?`,
          options: [
            R`$C'(200) = 9 \gt 8 = \tfrac{C(200)}{200}$, ezért még egy darab növeli az átlagköltséget.`,
            R`$C'(200) = 9 \gt 8 = \tfrac{C(200)}{200}$, ezért még egy darab csökkenti az átlagköltséget.`,
            R`$C'(200) = 8 = \tfrac{C(200)}{200}$, az átlag nem változik.`,
            R`$C'(200) = 1600$ ezer Ft/db.`
          ],
          answer: 0,
          hint: R`Számold ki a határköltséget, $C'(q) = 5 + 0{,}02q$, és az átlagköltséget, $\tfrac{C(q)}{q}$. Mi történik az átlaggal, ha az átlagnál drágább darab jön hozzá?`,
          explain: R`$C'(200) = 5 + 4 = 9$, $C(200) = 200 + 1000 + 400 = 1600$, átlag $8$. A következő darab (kb. 9, pontosan $C(201) - C(200) = 9{,}01$) drágább az átlagnál, ezért az átlag nő (201 darabnál $\approx 8{,}005$). A „csökkenti” rossz irányba következtet, a „$C' = 8$” az átlagot keveri a határköltséggel, az $1600 = C(200)$ a teljes költség, nem derivált.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
