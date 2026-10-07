/* =========================================================
   Analízis 1. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 1.1 */
    "an1-11": {
      title: "Kvíz – 1.1 Mi az a függvény?",
      questions: [
        {
          q: "Melyik hozzárendelés NEM függvény?",
          options: [
            "Minden emberhez a születési dátumát rendeljük.",
            "Minden természetes számhoz a négyzetét rendeljük.",
            "Minden pozitív számhoz azt a számot rendeljük, amelynek ő a négyzete.",
            "Minden diákhoz a magasságát (cm-ben) rendeljük."
          ],
          answer: 2,
          hint: "Keress olyan bemenetet, amelyhez egynél több kimenet tartozna!",
          explain: R`A 4 a $2$-nek és a $-2$-nek is a négyzete, így a 4-hez két szám tartozna – nem egyértelmű. A többinél minden bemenethez pontosan egy érték tartozik (az nem baj, hogy két embernek lehet ugyanaz a születésnapja).`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^2 - 2x$. Mennyi $f(-3)$?`,
          options: [R`$15$`, R`$3$`, R`$-3$`, R`$-15$`],
          answer: 0,
          hint: R`Az $x$ helyére zárójelben írd a $-3$-at, mindkét helyen!`,
          explain: R`$f(-3) = (-3)^2 - 2\cdot(-3) = 9 + 6 = 15$. A $-3$ a zárójel elhagyásából jön ($-3^2 + 6$), a $3$ abból, hogy a $-2\cdot(-3)$ előjelét elrontjuk ($9 - 6$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az értelmezési tartománya: $f(x) = \dfrac{\sqrt{x + 2}}{x - 3}$?`,
          options: [R`$[-2; \infty[ \setminus \{3\}$`, R`$]-2; \infty[ \setminus \{3\}$`, R`$[2; \infty[ \setminus \{3\}$`, R`$[-2; \infty[ \setminus \{-3\}$`],
          answer: 0,
          hint: "Két feltétel: mi lehet a gyök alatt, és mi nem lehet a nevezőben? A határpontoknál figyelj, benne vannak-e!",
          explain: R`Gyök alatt: $x + 2 \ge 0 \Rightarrow x \ge -2$ (a $-2$ benne van, mert $\sqrt0 = 0$). Nevező: $x \ne 3$. Így $D_f = [-2; \infty[ \setminus \{3\}$. A tipikus hibák: nyitott intervallum a $-2$-nél, illetve előjelhiba ($2$ vagy $-3$).`
        },
        {
          type: "multi",
          q: R`Melyik ad meg függvényt (minden $x$-hez egy $y$)?`,
          options: [R`$y = x^2 + 1$`, R`$x^2 + y^2 = 4$`, R`$y^2 = x$`, R`$y = |x|$`, R`az $x$: 1, 2, 3 → $y$: 5, 5, 5 táblázat`],
          answer: [0, 3, 4],
          hint: "Függőleges egyenes teszt: van-e olyan x, amelyhez két y is tartozik?",
          explain: R`A kör ($x = 0 \Rightarrow y = \pm2$) és a „fekvő parabola” ($x = 4 \Rightarrow y = \pm2$) nem függvény. A konstans táblázat függvény: minden $x$-hez pontosan egy (ugyanaz az) érték tartozik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = 2 - x^2$ értékkészlete?`,
          options: [R`$]-\infty; 2]$`, R`$[2; \infty[$`, R`$\mathbb R$`, R`$[-2; 2]$`],
          answer: 0,
          hint: R`Mekkora lehet legfeljebb $-x^2$? És mennyi az $x = 0$-ban felvett érték?`,
          explain: R`$x^2 \ge 0$, így $-x^2 \le 0$ és $2 - x^2 \le 2$. A 2-t felveszi ($x = 0$), lefelé pedig minden értéket. $R_f = ]-\infty; 2]$. A $[2; \infty[$ a $2 + x^2$ értékkészlete lenne.`
        },
        {
          type: "match",
          q: "Párosítsd az intervallumokat az egyenlőtlenségekkel!",
          pairs: [
            [R`$[1; 4[$`, "1 ≤ x < 4"],
            [R`$]1; 4]$`, "1 < x ≤ 4"],
            [R`$]-\infty; 4[$`, "x < 4"],
            [R`$[4; \infty[$`, "x ≥ 4"]
          ],
          hint: "A befelé néző szögletes zárójel: a végpont benne van; a kifelé néző: nincs benne.",
          explain: R`$[$ befelé néz → $\le$; $]$ kifelé néz → $\lt$. A végtelen mellett mindig nyitott a zárójel.`
        }
      ]
    },

    /* ------------------------------------------------ 1.2 */
    "an1-12": {
      title: "Kvíz – 1.2 Elemi függvények",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mekkora a meredeksége az $(1; 2)$ és a $(3; 8)$ ponton átmenő egyenesnek?`,
          options: [R`$3$`, R`$\tfrac13$`, R`$-3$`, R`$5$`],
          answer: 0,
          hint: R`$m = \dfrac{\Delta y}{\Delta x}$ – mindkettőt ugyanabban a sorrendben számold!`,
          explain: R`$m = \dfrac{8 - 2}{3 - 1} = \dfrac62 = 3$. Az $\tfrac13$ a fordított hányados ($\Delta x/\Delta y$), a $-3$ a vegyes sorrend ($\tfrac{8 - 2}{1 - 3}$) eredménye.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 4 millió Ft-os autó évente 25%-ot veszít az értékéből. Mennyit ér 2 év múlva?",
          options: ["2 250 000 Ft", "2 000 000 Ft", "3 000 000 Ft", "250 000 Ft"],
          answer: 0,
          hint: "Állandó százalékos változás: minden évben ugyanazzal a szorzóval kell szorozni. Mennyi marad meg egy év alatt?",
          explain: R`Évente az érték 75%-a marad: $4\,000\,000\cdot0{,}75^2 = 2\,250\,000$ Ft. A 2 millió a lineáris hiba (kétszer a 25%-ot vonjuk le az <em>eredeti</em> értékből), a 3 millió csak egy év, a 250 ezer a $0{,}25^2$-tel való szorzás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Oldd meg: $3\cdot2^t = 48$.`,
          options: [R`$t = 4$`, R`$t = 16$`, R`$t = 8$`, R`$t \approx 5{,}58$`],
          answer: 0,
          hint: "Előbb különítsd el a hatványt (oszd el mindkét oldalt), csak utána keresd a kitevőt!",
          explain: R`$2^t = 16 = 2^4$, tehát $t = 4$. A 16 a hatvány értéke, nem a kitevő; a $5{,}58 = \log_2 48$ azt jelenti, hogy elfelejtettük a 3-mal osztást.`
        },
        {
          q: "Melyik azonosság igaz minden pozitív a, b számra?",
          options: [R`$\ln(ab) = \ln a + \ln b$`, R`$\ln(a + b) = \ln a + \ln b$`, R`$\ln(ab) = \ln a\cdot\ln b$`, R`$\ln(a^2) = (\ln a)^2$`],
          answer: 0,
          hint: "A logaritmus kitevő: mi történik a kitevőkkel, ha hatványokat szorzunk?",
          explain: R`$e^x\cdot e^y = e^{x+y}$, ezért a szorzat logaritmusa a logaritmusok összege. A többi gyakori tévhit; a helyes $\ln(a^2) = 2\ln a$.`
        },
        {
          type: "match",
          q: "Párosítsd a függvényeket az értelmezési tartományukkal!",
          pairs: [
            [R`$\ln x$`, "]0; ∞["],
            [R`$\sqrt x$`, "[0; ∞["],
            [R`$\dfrac1x$`, "ℝ ∖ {0}"],
            [R`$2^x$`, "ℝ"]
          ],
          hint: "Mi tilos? Nevező 0, negatív szám gyöke, nempozitív szám logaritmusa.",
          explain: R`A $\sqrt0 = 0$ létezik, de $\ln 0$ nem – ezért zárt, illetve nyitott a 0-nál. Az exponenciális függvény mindenhol értelmes.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a $\sin x + 2$ értékkészlete?`,
          options: [R`$[1; 3]$`, R`$[-1; 1]$`, R`$[2; 3]$`, R`$[-1; 3]$`],
          answer: 0,
          hint: R`Milyen értékek között mozog a $\sin x$? Mi történik ezekkel, ha mindegyikhez 2-t adunk?`,
          explain: R`$-1 \le \sin x \le 1$, és 2-t hozzáadva $1 \le \sin x + 2 \le 3$. A $[-1; 1]$ az eredeti $\sin x$ értékkészlete.`
        }
      ]
    },

    /* ------------------------------------------------ 1.3 */
    "an1-13": {
      title: "Kvíz – 1.3 Függvénytranszformációk",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hogyan kapjuk meg az $(x + 4)^2$ grafikonját az $x^2$-éből?`,
          options: ["4 egységgel balra toljuk", "4 egységgel jobbra toljuk", "4 egységgel felfelé toljuk", "4 egységgel lefelé toljuk"],
          answer: 0,
          hint: "Hol lesz a zárójel nulla? Ott lesz az új csúcs.",
          explain: R`$x + 4 = 0 \Rightarrow x = -4$: a csúcs a $-4$-be kerül, tehát balra. A „+” jel megtévesztő: a zárójelen belüli változtatás fordítva hat.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hol van a csúcsa és milyen szélsőérték: $y = -3(x - 2)^2 + 5$?`,
          options: [R`$(2; 5)$, maximum`, R`$(-2; 5)$, maximum`, R`$(2; 5)$, minimum`, R`$(2; -5)$, maximum`],
          answer: 0,
          hint: "Olvasd le az eltolásokat, és nézd meg az előjelet a zárójel előtt: merre nyílik a parabola?",
          explain: R`2-vel jobbra, 5-tel fel: csúcs $(2; 5)$. A $-3$ tükrözi (és nyújtja) a parabolát, ezért lefelé nyílik, a csúcs maximum.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mik az aszimptotái: $y = \dfrac{1}{x + 3} - 1$?`,
          options: [R`$x = -3$ és $y = -1$`, R`$x = 3$ és $y = -1$`, R`$x = -3$ és $y = 1$`, R`$x = -1$ és $y = -3$`],
          answer: 0,
          hint: R`Az $\tfrac1x$ aszimptotái $x = 0$ és $y = 0$. Hová tolja őket a két transzformáció?`,
          explain: R`3-mal balra (a nevező $x = -3$-nál nulla), 1-gyel le: $x = -3$ és $y = -1$.`
        },
        {
          type: "match",
          q: R`Párosítsd a képleteket a transzformációval (az $f(x)$ grafikonjából kiindulva)!`,
          pairs: [
            [R`$-f(x)$`, "tükrözés az x tengelyre"],
            [R`$f(-x)$`, "tükrözés az y tengelyre"],
            [R`$f(2x)$`, "vízszintes összenyomás a felére"],
            [R`$2f(x)$`, "függőleges nyújtás a kétszeresére"],
            [R`$f(x) + 2$`, "eltolás 2-vel felfelé"]
          ],
          hint: "Ami a zárójelen belül van, az x-et (vízszintes irány), ami kívül, az y-t (függőleges irány) módosítja.",
          explain: R`A belső változtatások „fordítva” hatnak: $f(2x)$ kétszer gyorsabban fut végig a függvényen, ezért fele olyan széles.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi a $\sin 3x$ periódusa?`,
          options: [R`$\tfrac{2\pi}{3}$`, R`$6\pi$`, R`$2\pi$`, R`$\tfrac{\pi}{3}$`],
          answer: 0,
          hint: R`A $\sin x$ periódusa $2\pi$. A $3x$ összenyomja vagy széthúzza a grafikont?`,
          explain: R`A vízszintes összenyomás 3-szoros, a periódus $\tfrac{2\pi}{3}$. Ellenőrzés: $\sin\big(3(x + \tfrac{2\pi}{3})\big) = \sin(3x + 2\pi) = \sin 3x$. A $6\pi$ a fordított irányú (nyújtás) hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $\sqrt x$ grafikonját 2-vel jobbra és 3-mal lefelé toljuk. Mi az új képlet?`,
          options: [R`$\sqrt{x - 2} - 3$`, R`$\sqrt{x + 2} - 3$`, R`$\sqrt{x - 3} - 2$`, R`$\sqrt{x - 2} + 3$`],
          answer: 0,
          hint: "Melyik eltolás megy a gyök alá, melyik kívülre? És milyen előjellel?",
          explain: R`Jobbra tolás: $x$ helyett $x - 2$ (a gyök alatt); lefelé tolás: $-3$ (kívül). A $\sqrt{x + 2}$ balra tolná.`
        }
      ]
    },

    /* ------------------------------------------------ 1.4 */
    "an1-14": {
      title: "Kvíz – 1.4 Függvénytulajdonságok",
      questions: [
        {
          type: "multi",
          q: "Melyik függvény páros?",
          options: [R`$x^4 + 1$`, R`$|x|$`, R`$\cos x$`, R`$x^3$`, R`$x^2 + x$`, R`$\dfrac{1}{x^2}$`],
          answer: [0, 1, 2, 5],
          hint: R`Írd be az $x$ helyére a $-x$-et: visszakapod-e az eredetit?`,
          explain: R`Páros: $f(-x) = f(x)$ – ez teljesül az $x^4 + 1$, $|x|$, $\cos x$ és $\tfrac{1}{x^2}$ esetén. Az $x^3$ páratlan, az $x^2 + x$ egyik sem ($(-x)^2 + (-x) = x^2 - x$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyek az $f(x) = x^3 - 4x$ zérushelyei?`,
          options: [R`$-2$, $0$ és $2$`, R`$-2$ és $2$`, R`$0$ és $4$`, R`csak a $4$`],
          answer: 0,
          hint: R`Emelj ki $x$-et, és használd: egy szorzat akkor 0, ha valamelyik tényezője 0.`,
          explain: R`$x(x^2 - 4) = 0 \Rightarrow x = 0$ vagy $x^2 = 4$, azaz $x = \pm2$. A leggyakoribb hiba, hogy $x$-szel leosztunk, és elveszítjük a $0$-t.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = x^2$ abszolút maximuma a $[-3; 1]$ intervallumon?`,
          options: [R`$9$, az $x = -3$ helyen`, R`$1$, az $x = 1$ helyen`, R`$0$, az $x = 0$ helyen`, "Nincs maximuma."],
          answer: 0,
          hint: "Zárt intervallumon a végpontokat is meg kell nézni. Melyik végpont van messzebb a csúcstól?",
          explain: R`$f(-3) = 9$, $f(1) = 1$, $f(0) = 0$. A maximum a bal végpontban van: 9. A 0 a <em>minimum</em> (a csúcs), az 1 a jobb végpont – az kisebb.`
        },
        {
          q: R`Melyik állítás igaz az $f(x) = e^x$ függvényre?`,
          options: [
            "Alulról korlátos, az alsó határa 0, de minimuma nincs.",
            "A minimuma 0.",
            "A minimuma 1, az x = 0 helyen.",
            "Alulról nem korlátos."
          ],
          answer: 0,
          hint: "Felveszi-e a függvény a 0-t? Van-e legkisebb felvett érték?",
          explain: R`$e^x \gt 0$ mindig, és bármilyen közel kerül a 0-hoz, de el nem éri: a 0 alsó határ, de nem függvényérték, ezért minimum nincs. Az 1 csak az $x = 0$-ban felvett érték, nem a legkisebb.`
        },
        {
          q: R`Melyik állítás igaz az $f(x) = \dfrac1x$ függvényre?`,
          options: [
            R`Szigorúan csökkenő a $]-\infty; 0[$-n és a $]0; \infty[$-en külön-külön, de a teljes értelmezési tartományán nem.`,
            R`Szigorúan csökkenő a teljes $\mathbb R \setminus \{0\}$-n.`,
            "Szigorúan növekvő.",
            "Egyik intervallumon sem monoton."
          ],
          answer: 0,
          hint: R`Hasonlítsd össze $f(-1)$-et és $f(1)$-et: mit mond ez a teljes tartományról?`,
          explain: R`Mindkét ágon csökken, de $-1 \lt 1$ mellett $f(-1) = -1 \lt f(1) = 1$ – ez ellentmond a teljes tartományon való csökkenésnek. A monotonitást intervallumon mondjuk ki.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik függvény páratlan?",
          options: [R`$x^3 - x$`, R`$x^3 + 1$`, R`$x^2 + x$`, R`$|x^3|$`],
          answer: 0,
          hint: R`Páratlan: $f(-x) = -f(x)$. Ellenőrizd a definícióval, ne a kitevők alapján!`,
          explain: R`$(-x)^3 - (-x) = -x^3 + x = -(x^3 - x)$ ✓. Az $x^3 + 1$ csapda: a konstans tag miatt $f(-x) = -x^3 + 1 \ne -(x^3 + 1)$. Az $|x^3|$ páros.`
        }
      ]
    },

    /* ------------------------------------------------ 1.5 */
    "an1-15": {
      title: "Kvíz – 1.5 Összetett és inverz függvény",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x - 1$, $g(x) = x^2$. Mennyi $f(g(3))$?`,
          options: [R`$8$`, R`$4$`, R`$18$`, R`$11$`],
          answer: 0,
          hint: "Melyik függvény dolgozik először: a belső vagy a külső?",
          explain: R`Először a belső: $g(3) = 9$, aztán $f(9) = 8$. A 4 a fordított sorrend ($g(f(3)) = 2^2$), a 18 a szorzat ($f(3)\cdot g(3)$), a 11 az összeg.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \sqrt x$, $g(x) = x + 4$. Mi az $(f \circ g)(x)$?`,
          options: [R`$\sqrt{x + 4}$`, R`$\sqrt x + 4$`, R`$(x + 4)\sqrt x$`, R`$\sqrt x + 2$`],
          answer: 0,
          hint: R`$(f \circ g)(x) = f(g(x))$: az $f$ képletében az $x$ helyére a teljes $g(x)$ kerül.`,
          explain: R`$f(g(x)) = \sqrt{g(x)} = \sqrt{x + 4}$. A $\sqrt x + 4$ a $g \circ f$; a $\sqrt x + 2$ abból a hibából jön, hogy $\sqrt{x + 4} = \sqrt x + \sqrt4$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = 3x - 6$ inverze?`,
          options: [R`$\dfrac{x + 6}{3}$`, R`$\dfrac{1}{3x - 6}$`, R`$\dfrac{x - 6}{3}$`, R`$3x + 6$`],
          answer: 0,
          hint: R`Írd fel $y = 3x - 6$-ot, fejezd ki az $x$-et, majd cseréld fel a betűket.`,
          explain: R`$y = 3x - 6 \Rightarrow x = \dfrac{y + 6}{3}$, így $f^{-1}(x) = \dfrac{x + 6}{3}$. Ellenőrzés: $f(2) = 0$, $f^{-1}(0) = 2$ ✓. Az $\dfrac{1}{3x - 6}$ a reciprok, nem az inverz.`
        },
        {
          type: "multi",
          q: R`Melyik függvény invertálható a teljes $\mathbb R$-en?`,
          options: [R`$x^3$`, R`$e^x$`, R`$2x + 1$`, R`$x^2$`, R`$|x|$`, R`$\sin x$`],
          answer: [0, 1, 2],
          hint: "Vízszintes egyenes teszt: van-e két különböző x ugyanazzal a függvényértékkel?",
          explain: R`Az $x^3$, az $e^x$ és a $2x + 1$ szigorúan monoton, tehát kölcsönösen egyértelmű. Az $x^2$ és az $|x|$ a $\pm x$-hez ugyanazt rendeli, a $\sin x$ periodikus.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = e^x + 1$. Mi az inverz függvény értelmezési tartománya?`,
          options: [R`$]1; \infty[$`, R`$]0; \infty[$`, R`$\mathbb R$`, R`$[1; \infty[$`],
          answer: 0,
          hint: R`Az inverz értelmezési tartománya az eredeti függvény értékkészlete. Mit vesz fel az $e^x + 1$?`,
          explain: R`$e^x \gt 0$, így $e^x + 1 \gt 1$, és minden 1-nél nagyobb számot felvesz: $D_{f^{-1}} = R_f = ]1; \infty[$. (Valóban: $f^{-1}(x) = \ln(x - 1)$.) A $]0; \infty[$ az $e^x$ értékkészlete lenne, eltolás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = 2^x$. Mennyi $f^{-1}(8)$?`,
          options: [R`$3$`, R`$256$`, R`$\tfrac18$`, R`$4$`],
          answer: 0,
          hint: R`$f^{-1}(8)$ az az $x$, amelyre $f(x) = 8$.`,
          explain: R`$2^x = 8 \Rightarrow x = 3$ (azaz $\log_2 8 = 3$). A 256 az $f(8)$, az $\tfrac18$ a reciprok, a 4 az $8/2$.`
        }
      ]
    },

    /* ------------------------------------------------ 1.6 */
    "an1-16": {
      title: "Kvíz – 1.6 Modellezés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Melyik modell illik az adatokra? $x$: 0, 1, 2, 3; $y$: 5, 10, 20, 40.`,
          options: [R`exponenciális: $y = 5\cdot2^x$`, R`lineáris: $y = 5x + 5$`, R`exponenciális: $y = 2\cdot5^x$`, R`hatvány: $y = 5x^2$`],
          answer: 0,
          hint: "Nézd meg az egymás utáni értékek különbségét és hányadosát. Melyik állandó?",
          explain: R`Hányadosok: 2, 2, 2 → exponenciális, a kezdőérték $f(0) = 5$, a szorzó 2. A különbségek (5, 10, 20) nem állandók. A $5x + 5$ csak az első két pontra illik.`
        },
        {
          type: "single", shuffle: true,
          q: "8 000 Ft-ot betétbe teszünk évi 6%-os kamatos kamatra. Mennyi lesz 3 év múlva?",
          options: ["≈ 9 528 Ft", "9 440 Ft", "8 480 Ft", "≈ 10 100 Ft"],
          answer: 0,
          hint: "Kamatos kamat: minden évben az aktuális összeg nő 6%-kal. Hányszor szorzol, és mivel?",
          explain: R`$8000\cdot1{,}06^3 \approx 9528{,}13$ Ft. A 9 440 Ft az egyszerű kamat ($8000\cdot1{,}18$, a kamat mindig az eredeti összegre), a 8 480 Ft egy év, a ≈10 100 Ft négy év.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy műhely fix költsége 30 000 Ft, egy darab változó költsége 200 Ft, eladási ára 500 Ft. Hány darabnál van a fedezeti pont?",
          options: ["100", "60", "150", "≈ 43"],
          answer: 0,
          hint: "Írd fel a bevételt és a költséget, és keresd meg, hol egyenlők!",
          explain: R`$500x = 30\,000 + 200x \Rightarrow 300x = 30\,000 \Rightarrow x = 100$. A 60 a változó költséget hagyja ki ($30\,000/500$), a 150 a bevételt ($30\,000/200$), a 43 összeadja őket.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kereslet: $q_D = 300 - 5p$, kínálat: $q_S = 10p - 60$. Mi az egyensúlyi ár és mennyiség?`,
          options: [R`$p^* = 24$, $q^* = 180$`, R`$p^* = 16$, $q^* = 220$`, R`$p^* = 36$, $q^* = 120$`, R`$p^* = 20$, $q^* = 200$`],
          answer: 0,
          hint: "Egyensúlyban a kereslet egyenlő a kínálattal. Rendezd az egyenletet p-re, és figyelj az előjelekre!",
          explain: R`$300 - 5p = 10p - 60 \Rightarrow 360 = 15p \Rightarrow p^* = 24$, $q^* = 300 - 120 = 180$ (és a kínálat is $240 - 60 = 180$ ✓). A 16 előjelhibából jön ($300 - 60 = 15p$).`
        },
        {
          type: "single", shuffle: true,
          q: "Kb. hány év alatt duplázódik meg egy évi 7%-kal növekvő mennyiség?",
          options: ["≈ 10 év", "≈ 14 év", "≈ 7 év", "≈ 5 év"],
          answer: 0,
          hint: "Használd a 70-es szabályt, vagy oldd meg az 1,07^t = 2 egyenletet logaritmussal!",
          explain: R`$t = \dfrac{\ln 2}{\ln 1{,}07} \approx 10{,}2$ év; a 70-es szabály: $70/7 = 10$. A 14 év az egyszerű (lineáris) növekedés: $100\% / 7\% \approx 14{,}3$.`
        },
        {
          q: "Melyik függvény nő a leggyorsabban hosszú távon (nagyon nagy x-re)?",
          options: [R`$1{,}01^x$`, R`$1000x$`, R`$x^5$`, R`$100\log x$`],
          answer: 0,
          hint: "Növekedési rangsor: logaritmus, hatvány, exponenciális – melyik nyer mindig?",
          explain: R`Az $1{,}01^x$ sokáig lassú – az $x^5$-öt csak $x \approx 4200$ körül előzi meg –, de onnan végleg. Bármely $a \gt 1$ alapú exponenciális előbb-utóbb minden polinomot megelőz.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "an1-final": {
      title: "Fejezetzáró teszt – Függvények és modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = \ln(4 - x)$ értelmezési tartománya?`,
          options: [R`$]-\infty; 4[$`, R`$]4; \infty[$`, R`$]-\infty; 4]$`, R`$\mathbb R \setminus \{4\}$`],
          answer: 0,
          hint: "A logaritmus után csak pozitív szám állhat. Oldd meg az egyenlőtlenséget – figyelj az irányra!",
          explain: R`$4 - x \gt 0 \Rightarrow x \lt 4$. A 4 nincs benne ($\ln 0$ nem létezik). Az $]4; \infty[$ a rossz irányú egyenlőtlenség, az $\mathbb R \setminus \{4\}$ a nevezős szabály.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = 2x^2 - 3$. Mennyi $f(-2)$?`,
          options: [R`$5$`, R`$-11$`, R`$13$`, R`$-7$`],
          answer: 0,
          hint: "Előbb a hatványozás, aztán a szorzás – és a negatív számot zárójelbe!",
          explain: R`$2\cdot(-2)^2 - 3 = 2\cdot4 - 3 = 5$. A $-11$ a zárójel hiánya ($-2^2$), a 13 a $(2\cdot(-2))^2 - 3$, a $-7$ a négyzet elfelejtése.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = \dfrac{x + 1}{3}$ inverze?`,
          options: [R`$3x - 1$`, R`$3x + 1$`, R`$\dfrac{3}{x + 1}$`, R`$\dfrac{x - 1}{3}$`],
          answer: 0,
          hint: "Fejezd ki x-et y-nal, aztán cseréld fel a betűket. Ellenőrizd egy számmal!",
          explain: R`$y = \tfrac{x + 1}{3} \Rightarrow x = 3y - 1$, tehát $f^{-1}(x) = 3x - 1$. Ellenőrzés: $f(2) = 1$, $f^{-1}(1) = 2$ ✓.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $y = |x|$ grafikonját 2-vel balra és 1-gyel lefelé toljuk. Mi az új képlet?`,
          options: [R`$|x + 2| - 1$`, R`$|x - 2| - 1$`, R`$|x + 2| + 1$`, R`$|x + 1| - 2$`],
          answer: 0,
          hint: "A vízszintes eltolás az abszolútérték-jelen belül van, és „fordítva” hat.",
          explain: R`Balra tolás 2-vel: $x \to x + 2$; lefelé 1-gyel: $-1$. A csúcs $(-2; -1)$-be kerül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Oldd meg: $2\cdot10^x = 200$.`,
          options: [R`$x = 2$`, R`$x = 100$`, R`$x \approx 2{,}3$`, R`$x = 1$`],
          answer: 0,
          hint: "Előbb oszd el mindkét oldalt, aztán gondold végig: 10 hányadik hatványa?",
          explain: R`$10^x = 100 \Rightarrow x = \lg 100 = 2$. A $\approx 2{,}3$ az $\lg 200$ (a 2-vel osztás elmaradt), a 100 a hatvány értéke, nem a kitevő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Páros vagy páratlan az $f(x) = x^4 - 3x^2 + 1$ függvény?`,
          options: ["páros", "páratlan", "egyik sem", "páros is és páratlan is"],
          answer: 0,
          hint: R`Számold ki $f(-x)$-et!`,
          explain: R`$(-x)^4 - 3(-x)^2 + 1 = x^4 - 3x^2 + 1 = f(x)$: páros. (Itt a konstans tag nem ront el semmit, mert páros függvényeknél a konstans megengedett.)`
        },
        {
          q: R`Milyen belső és külső függvényből áll az $e^{3x + 1}$?`,
          options: [R`belső: $3x + 1$, külső: $e^u$`, R`belső: $e^x$, külső: $3u + 1$`, R`belső: $3x$, külső: $e^u + 1$`, R`belső: $e^{3x}$, külső: $u + 1$`],
          answer: 0,
          hint: "Mit számolnál ki először, ha egy konkrét x-re kellene az értéket meghatározni?",
          explain: R`Először a kitevőt: $u = 3x + 1$, aztán $e^u$. A $3e^x + 1$ (2. válasz) és az $e^{3x} + 1$ (3. és 4. válasz) más függvények.`
        },
        {
          q: "Egy termék ára 100 Ft. Az A forgatókönyv szerint évente 10%-kal, a B szerint évente 12 Ft-tal drágul. Melyik a drágább 5 év múlva?",
          options: [
            "Az A (≈ 161,05 Ft a 160 Ft ellen).",
            "A B (160 Ft a 150 Ft ellen).",
            "Egyformák (mindkettő 160 Ft).",
            "A B (160 Ft a ≈ 146 Ft ellen)."
          ],
          answer: 0,
          hint: "Az egyik lineáris, a másik exponenciális modell. Írd fel mindkettőt t = 5-re!",
          explain: R`A: $100\cdot1{,}1^5 \approx 161{,}05$ Ft; B: $100 + 5\cdot12 = 160$ Ft. A 150 Ft abból a hibából jön, hogy a 10%-ot mindig az eredeti 100 Ft-ra számoljuk (lineárisan), a ≈146 Ft pedig csak 4 év ({,}1^4$).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`$\sqrt{x^2} = |x|$ minden valós $x$-re`,
            R`$\ln(a + b) = \ln a + \ln b$`,
            R`$f^{-1}(x) = \dfrac{1}{f(x)}$`,
            R`$(f \circ g)(x) = f\big(g(x)\big)$`,
            R`$(-3)^2 = -3^2$`
          ],
          answer: [0, 3],
          hint: "Mindegyik a fejezet egy-egy buktató-dobozából való. Próbáld ki konkrét számokkal!",
          explain: R`Igaz: $\sqrt{(-3)^2} = 3 = |-3|$ és az összetett függvény definíciója. Hamis: $\ln 2 \ne \ln 1 + \ln 1 = 0$; az inverz nem a reciprok; $(-3)^2 = 9$, $-3^2 = -9$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hol van az $f(x) = x^3 - 3x$ lokális maximuma, és mennyi az értéke?`,
          options: [R`az $x = -1$ helyen, értéke $2$`, R`az $x = 1$ helyen, értéke $-2$`, R`az $x = -\sqrt3$ helyen, értéke $0$`, R`az $x = 2$ helyen, értéke $2$`],
          answer: 0,
          hint: "Készíts értéktáblázatot x = −2, −1, 0, 1, 2-re, és nézd meg, hol fordul a függvény növekedésből csökkenésbe!",
          explain: R`$f(-2) = -2$, $f(-1) = 2$, $f(0) = 0$, $f(1) = -2$, $f(2) = 2$. A $-1$-nél növekedésből csökkenésbe fordul: lokális maximum, értéke 2. Az $x = 1$ lokális minimum, a $-\sqrt3$ zérushely, az $x = 2$-ben pedig $\mathbb R$-en nincs szélsőérték (utána tovább nő).`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
