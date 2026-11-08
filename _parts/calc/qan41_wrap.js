(function(){const R=String.raw; const Q={
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
}; })();
