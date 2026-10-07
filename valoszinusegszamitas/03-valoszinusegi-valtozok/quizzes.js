/* =========================================================
   3. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;
  const DIS = "diszkrét", FOL = "folytonos";

  const QUIZZES = {
    /* ------------------------------------------------ 3.1–3.2 */
    "p3-32": {
      title: "Kvíz – 3.1–3.2 Valószínűségi változó, diszkrét eloszlás",
      questions: [
        {
          q: "Mi a valószínűségi változó?",
          options: [
            "Egy olyan szám, amelynek értékét nem ismerjük.",
            R`Egy függvény, amely az eseménytér minden elemi eseményéhez egy valós számot rendel.`,
            "Egy esemény, amelynek valószínűsége 0 és 1 közé esik.",
            "A kísérletek számának és a sikeres kísérletek számának hányadosa."
          ],
          answer: 1,
          hint: "Gondold végig: mihez rendel értéket X, és milyen fajta értéket ad vissza?",
          explain: R`$X : \Omega \to \mathbb{R}$. Nem „változó” és nem is „véletlen” a szó szoros értelmében: egy teljesen determinisztikus függvény – a véletlen abban van, hogy melyik $\omega \in \Omega$ következik be.`
        },
        {
          type: "match",
          q: "Diszkrét vagy folytonos valószínűségi változó?",
          choices: [DIS, FOL], shuffle: false,
          pairs: [
            ["egy kockával dobott szám", DIS],
            ["egy izzó élettartama órában", FOL],
            ["egy bolt napi vásárlóinak száma", DIS],
            ["a Balaton vizének hőmérséklete egy véletlen időpontban", FOL],
            ["a fejek száma 10 pénzfeldobásból", DIS]
          ],
          hint: "Megszámolhatók-e a lehetséges értékek, vagy egy egész intervallumot kitöltenek?",
          explain: "Diszkrét: megszámlálható (véges vagy „1, 2, 3, …” módon felsorolható) sok értéke van. Folytonos: egy intervallum bármely értékét felveheti."
        },
        {
          type: "single", shuffle: true,
          q: R`Két kockával dobunk, $X = |a - b|$ (a két szám eltérése). Mennyi $P(X = 0)$?`,
          options: [R`$\tfrac{1}{6} \approx 0{,}167$`, R`$\tfrac{1}{36} \approx 0{,}028$`, R`$\tfrac{2}{7} \approx 0{,}286$`, R`$\tfrac{5}{18} \approx 0{,}278$`],
          answer: 0,
          hint: "Mely (a, b) párokra lesz a két szám eltérése 0? Számold össze őket a 36 esetből.",
          explain: R`$X = 0$ pontosan a dupláknál: 6 eset a 36-ból, $P = \tfrac16$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $X$ változó az 1, 2, 3, 4 értékeket rendre 0,1; 0,3; $p$; 0,2 valószínűséggel veszi fel. Mennyi $p$?`,
          options: ["$0{,}4$", "$0{,}6$", "$0{,}25$", "$0{,}2$"],
          answer: 0,
          hint: "Ellenőrizd, hogy a valószínűségek összege 1.",
          explain: R`A valószínűségek összege 1: $p = 1 - 0{,}1 - 0{,}3 - 0{,}2 = 0{,}4$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy urnában 2 piros és 3 fehér golyó van. Visszatevés nélkül kihúzunk kettőt, X a piros golyók száma. Mennyi P(X = 1)?",
          options: ["$0{,}6$", "$0{,}48$", "$0{,}3$", "$0{,}4$"],
          answer: 0,
          hint: R`Klasszikus valószínűség: hányféleképpen húzható 1 piros és 1 fehér, és hányféleképpen 2 golyó összesen? Használj $\binom{n}{k}$-t.`,
          explain: R`$P(X = 1) = \dfrac{\binom21\binom31}{\binom52} = \dfrac{6}{10} = 0{,}6$.`
        }
      ]
    },

    /* ------------------------------------------------ 3.3 */
    "p3-33": {
      title: "Kvíz – 3.3 Várható érték",
      questions: [
        {
          type: "single", shuffle: true,
          q: "X a 0, 1, 2 értékeket rendre 0,5; 0,3; 0,2 valószínűséggel veszi fel. Mennyi E(X)?",
          options: ["$0{,}7$", "$1$", "$1{,}1$", "$0{,}5$"],
          answer: 0,
          hint: R`$E(X) = \sum_i x_i p_i$ – minden értéket szorozz a saját valószínűségével.`,
          explain: R`$E(X) = 0\cdot0{,}5 + 1\cdot0{,}3 + 2\cdot0{,}2 = 0{,}7$.`
        },
        {
          q: R`Egy szabályos kockára $E(X) = 3{,}5$. Mit jelent ez?`,
          options: [
            "A leggyakoribb dobás a 3,5.",
            "Minden dobás 3,5-höz közeli.",
            "Sok dobás átlaga 3,5 körül ingadozik (és egyre közelebb kerül hozzá).",
            "A dobások fele 3,5 alatti – ez a várható érték definíciója."
          ],
          answer: 2,
          hint: "A várható érték nem egyetlen dobásról szól – mire utal sok ismétlés esetén?",
          explain: "A várható érték a hosszú távú átlag. A 3,5-öt egyetlen dobás sem adja ki, és általában nem is a leggyakoribb érték."
        },
        {
          type: "single", shuffle: true,
          q: "500 sorsjegyet adnak el 100 Ft-ért. Egy 20 000 Ft-os és két 5000 Ft-os nyeremény van. Mennyi egy jegy várható nettó nyeresége (forintban)?",
          options: ["$-40$ Ft", "$60$ Ft", "$-50$ Ft", "$40$ Ft"],
          answer: 0,
          hint: "Számold ki egy jegyre jutó nyeremény várható értékét, és ne felejtsd el levonni a jegy árát.",
          explain: R`A nyeremények várható értéke $\tfrac{20\,000 + 2\cdot5000}{500} = 60$ Ft, a jegy ára 100 Ft: $E = 60 - 100 = -40$ Ft.`
        },
        {
          type: "single", shuffle: true,
          q: R`$E(X) = 4$. Mennyi $E(3X + 2)$?`,
          options: ["$14$", "$12$", "$38$", "$18$"],
          answer: 0,
          hint: R`A várható érték lineáris: $E(aX + b) = aE(X) + b$.`,
          explain: R`A várható érték lineáris: $E(3X + 2) = 3E(X) + 2 = 14$.`
        },
        {
          type: "single", shuffle: true,
          q: "Ruletten (37 mező: 18 piros, 18 fekete, 1 zöld nulla) 1000 Ft-ot teszünk a pirosra. Ha nyerünk, +1000 Ft, különben −1000 Ft. Mennyi a várható nyereség?",
          options: ["$-27{,}03$ Ft", "$0$ Ft", "$486{,}49$ Ft", "$-513{,}51$ Ft"],
          answer: 0,
          hint: "Hány mező kedvez nekünk és hány nem? A zöld nulla nem piros!",
          explain: R`$E = 1000\cdot\tfrac{18}{37} - 1000\cdot\tfrac{19}{37} = -\tfrac{1000}{37} \approx -27{,}03$ Ft. A zöld nulla a kaszinó „adója”: 2,7%.`
        },
        {
          q: "Mit jelent, hogy egy szerencsejáték korrekt (igazságos)?",
          options: [
            "Hogy 50% eséllyel nyerünk.",
            "Hogy a nyeremény várható értéke (a tétet levonva) 0.",
            "Hogy minden kimenetel egyformán valószínű.",
            "Hogy legalább egyszer biztosan nyerünk."
          ],
          answer: 1,
          hint: "A korrektség a várható nyereségről szól, nem a nyerési esélyről.",
          explain: R`Korrekt: $E(X) = 0$. Ez <em>nem</em> jelent 50%-os nyerési esélyt: a „hatos → +500 Ft, különben −100 Ft” játék korrekt, pedig csak $\tfrac16$ eséllyel nyerünk.`
        }
      ]
    },

    /* ------------------------------------------------ 3.4 */
    "p3-34": {
      title: "Kvíz – 3.4 Szórásnégyzet és szórás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`X a 0, 1, 2 értékeket rendre 0,5; 0,3; 0,2 valószínűséggel veszi fel ($E(X) = 0{,}7$). Mennyi $D^2(X)$?`,
          options: ["$0{,}61$", "$1{,}1$", "$0{,}4$", "$0{,}78$"],
          answer: 0,
          hint: R`Használd a $D^2(X) = E(X^2) - E(X)^2$ képletet; előbb számold ki $E(X^2)$-et.`,
          explain: R`$E(X^2) = 0 + 0{,}3 + 4\cdot0{,}2 = 1{,}1$, így $D^2(X) = 1{,}1 - 0{,}7^2 = 0{,}61$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$D(X) = 3$. Mennyi $D(-2X + 5)$?`,
          options: ["$6$", "$-6$", "$12$", "$-1$"],
          answer: 0,
          hint: "Hogyan hat a szorzás és az eltolás a szórásra? Ne feledd: a szórás sosem negatív.",
          explain: R`$D^2(aX + b) = a^2 D^2(X)$, így $D(aX+b) = |a|\,D(X) = 2\cdot 3 = 6$. Az eltolás nem változtat a szóráson, és a szórás sosem negatív.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi egy szabályos kockadobás szórásnégyzete?",
          options: [R`$\tfrac{35}{12} \approx 2{,}917$`, R`$\tfrac{91}{6} \approx 15{,}167$`, R`$\tfrac{35}{3} \approx 11{,}667$`, R`$\tfrac{7}{2} = 3{,}5$`],
          answer: 0,
          hint: R`Előbb a négyzetek átlagát, $E(X^2)$-et számold ki, aztán vond le $E(X)^2$-et.`,
          explain: R`$E(X^2) = \tfrac{1+4+9+16+25+36}{6} = \tfrac{91}{6}$, így $D^2(X) = \tfrac{91}{6} - 3{,}5^2 = \tfrac{35}{12} \approx 2{,}917$.`
        },
        {
          type: "multi",
          q: "Mely állítások igazak minden olyan X-re, amelynek létezik szórása?",
          options: [
            R`$D^2(X) \ge 0$`,
            R`$D^2(X) = 0$ pontosan akkor, ha $X$ (1 valószínűséggel) konstans`,
            R`$D(2X) = 2D(X)$`,
            R`$D^2(2X) = 2D^2(X)$`,
            R`$E(X^2) \ge E(X)^2$`
          ],
          answer: [0, 1, 2, 4],
          hint: "Konstans szorzó a szórásnégyzetben négyzetesen jelenik meg, a szórásban abszolút értékben.",
          explain: R`$D^2(2X) = 4D^2(X)$. Az 5. állítás a $D^2(X) = E(X^2) - E(X)^2 \ge 0$ átrendezése.`
        },
        {
          q: "Két befektetés várható hozama egyaránt 5%, de az A szórása 2%, a B-é 15%. Mit mondhatunk?",
          options: ["A kettő teljesen egyforma.", "A B a kockázatosabb: a hozama sokkal jobban ingadozik.", "A B várhatóan többet hoz.", "Az A hozama biztosan 3% és 7% között lesz."],
          answer: 1,
          hint: "A szórás az ingadozás mértéke – jelent-e korlátot vagy magasabb várható hozamot?",
          explain: "A szórás az ingadozás (kockázat) mértéke. A 4. válasz azért hibás, mert a szórás nem korlát: csak azt mondja meg, mekkora a tipikus eltérés."
        }
      ]
    },

    /* ------------------------------------------------ 3.5 */
    "p3-35": {
      title: "Kvíz – 3.5 Eloszlásfüggvény",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Kockadobás. Mennyi $F(3{,}5) = P(X \lt 3{,}5)$?`,
          options: [R`$\tfrac{1}{2} = 0{,}5$`, R`$\tfrac{2}{3} \approx 0{,}667$`, R`$\tfrac{1}{3} \approx 0{,}333$`, R`$\tfrac{7}{12} \approx 0{,}583$`],
          answer: 0,
          hint: "Mely dobások kisebbek 3,5-nél?",
          explain: R`$X \lt 3{,}5$ az 1, 2, 3 dobásoknál: $\tfrac36 = \tfrac12$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Kockadobás, Obádovics jelölésével: $F(x) = P(X \lt x)$. Mennyi $F(3)$?`,
          options: [R`$\tfrac{1}{3} \approx 0{,}333$`, R`$\tfrac{1}{2} = 0{,}5$`, R`$\tfrac{1}{6} \approx 0{,}167$`, R`$\tfrac{2}{3} \approx 0{,}667$`],
          answer: 0,
          hint: R`$P(X \lt x)$ vagy $P(X \le x)$? Itt szigorú egyenlőtlenség van – beleszámít-e maga a 3?`,
          explain: R`$P(X \lt 3) = P(X = 1) + P(X = 2) = \tfrac13$ – a 3-as itt még <em>nem</em> számít bele. (A $P(X \le x)$ definícióval $\tfrac12$ lenne.)`
        },
        {
          type: "single", shuffle: true,
          q: R`$F(2) = 0{,}3$ és $F(5) = 0{,}8$. Mennyi $P(2 \le X \lt 5)$?`,
          options: ["$0{,}5$", "$0{,}24$", "$0{,}7$", "$0{,}2$"],
          answer: 0,
          hint: R`$F(b) - F(a)$ egy intervallum valószínűsége – $F(x) = P(X \lt x)$ mellett melyik végpont tartozik bele?`,
          explain: R`$P(a \le X \lt b) = F(b) - F(a) = 0{,}8 - 0{,}3 = 0{,}5$.`
        },
        {
          type: "multi",
          q: "Melyek igazak minden eloszlásfüggvényre?",
          options: [
            "monoton nem csökkenő",
            R`$\lim_{x\to-\infty} F(x) = 0$ és $\lim_{x\to\infty} F(x) = 1$`,
            "mindenütt folytonos",
            R`$0 \le F(x) \le 1$`,
            "szigorúan monoton növekvő"
          ],
          answer: [0, 1, 3],
          hint: "Gondolj egy diszkrét változó lépcsős eloszlásfüggvényére: melyik tulajdonság sérül nála?",
          explain: "Diszkrét változónál F lépcsős, tehát nem folytonos, és a lépcsők között konstans, tehát nem szigorúan növekvő. (Obádovics jelölésével F balról folytonos.)"
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "p3-36": {
      title: "Kvíz – 3.6 Folytonos valószínűségi változó",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az $f(x) = c\,x$ ($0 \le x \le 2$, máshol 0) sűrűségfüggvény. Mennyi $c$?`,
          options: ["$0{,}5$", "$2$", "$0{,}25$", "$1$"],
          answer: 0,
          hint: "A sűrűségfüggvény alatti teljes terület 1 – integráld 0-tól 2-ig.",
          explain: R`$\int_0^2 c\,x\,dx = 2c = 1$, tehát $c = \tfrac12$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy izzó élettartama egyenletes eloszlású a [0; 1000] órán. Mi a valószínűsége, hogy 200 és 450 óra között ég ki?",
          options: ["$0{,}25$", "$0{,}45$", "$0{,}65$", "$0{,}55$"],
          answer: 0,
          hint: "Egyenletes eloszlásnál a valószínűség arányos az intervallum hosszával.",
          explain: R`$F(450) - F(200) = \tfrac{450 - 200}{1000} = 0{,}25$.`
        },
        {
          q: R`$X$ folytonos valószínűségi változó. Mennyi $P(X = 1)$?`,
          options: [R`$f(1)$`, "0", R`$F(1)$`, "nem lehet tudni"],
          answer: 1,
          hint: "Mekkora a sűrűségfüggvény alatti terület egyetlen pont fölött?",
          explain: R`Folytonos változónál egyetlen pont valószínűsége 0: $P(X = 1) = \int_1^1 f = 0$. Az $f(1)$ <em>nem</em> valószínűség, hanem sűrűség.`
        },
        {
          q: "Lehet-e egy sűrűségfüggvény értéke 1-nél nagyobb?",
          options: ["Nem, mert valószínűség.", "Igen, csak a görbe alatti teljes terület 1.", "Csak diszkrét változónál."],
          answer: 1,
          hint: "Mi a feltétel a sűrűségfüggvényre: az értékei korlátosak, vagy a görbe alatti terület kötött?",
          explain: R`Pl. az $f(x) = 2$ a $[0; \tfrac12]$-en érvényes sűrűségfüggvény. A sűrűség „valószínűség egységnyi hosszra”: $P(x \lt X \lt x + \Delta x) \approx f(x)\,\Delta x$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = 2x$ a $[0; 1]$-en. Mennyi $P(X \gt 0{,}5)$?`,
          options: ["$0{,}75$", "$0{,}25$", "$0{,}5$", "$1$"],
          answer: 0,
          hint: R`Írd fel $F(x) = \int_0^x f(t)\,dt$-t, és használd a komplementert: $P(X \gt a) = 1 - F(a)$.`,
          explain: R`$F(x) = x^2$, így $P(X \gt 0{,}5) = 1 - 0{,}25 = 0{,}75$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \tfrac38 x^2$ a $[0; 2]$-n. Mennyi $E(X)$?`,
          options: ["$1{,}5$", "$1$", "$2{,}4$", "$1{,}59$"],
          answer: 0,
          hint: R`$E(X) = \int x\,f(x)\,dx$ – ne felejtsd el az $x$-szel való szorzást.`,
          explain: R`$E(X) = \int_0^2 x\cdot\tfrac38x^2\,dx = \tfrac38\cdot\tfrac{2^4}{4} = 1{,}5$.`
        }
      ]
    },

    /* ------------------------------------------------ 3.7 */
    "p3-37": {
      title: "Kvíz – 3.7 Momentumok, medián, kvantilisek, módusz",
      questions: [
        {
          q: "A háztartások jövedelmének eloszlása erősen jobbra elnyúló. Mit várunk?",
          options: ["átlag < medián", "átlag > medián", "átlag = medián", "a módusz a legnagyobb"],
          answer: 1,
          hint: "Mit mozdít el jobban néhány kiugróan nagy érték: az átlagot vagy a mediánt?",
          explain: "A kevés, nagyon nagy jövedelem felhúzza az átlagot, a mediánt alig mozdítja: jobbra ferde eloszlásnál tipikusan módusz < medián < átlag."
        },
        {
          type: "single", shuffle: true,
          q: R`$F(x) = \tfrac{x^3}{8}$ a $[0; 2]$-n. Mennyi a medián?`,
          options: ["$1{,}587$", "$1{,}500$", "$1{,}260$", "$1{,}000$"],
          answer: 0,
          hint: R`A medián az az $x$, amelyre $F(x) = \tfrac12$.`,
          explain: R`$\tfrac{x^3}{8} = \tfrac12 \Rightarrow x = \sqrt[3]{4} \approx 1{,}587$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy izzó élettartama egyenletes a [0; 1000] órán. Mennyi a felső kvartilis?",
          options: ["$750$ óra", "$250$ óra", "$500$ óra", "$1000$ óra"],
          answer: 0,
          hint: R`A felső kvartilis az az $x$, amelyre $F(x) = 0{,}75$.`,
          explain: R`$F(x) = \tfrac{x}{1000} = 0{,}75 \Rightarrow x = 750$.`
        },
        {
          type: "single", shuffle: true,
          q: R`X a 0, 1, 2 értékeket rendre 0,5; 0,3; 0,2 valószínűséggel veszi fel. Mennyi a második momentum, $E(X^2)$?`,
          options: ["$1{,}1$", "$0{,}49$", "$0{,}61$", "$0{,}7$"],
          answer: 0,
          hint: R`$E(X^2) = \sum_i x_i^2 p_i$ – az értékeket emeld négyzetre, a valószínűségeket ne.`,
          explain: R`$0^2\cdot0{,}5 + 1^2\cdot0{,}3 + 2^2\cdot0{,}2 = 1{,}1$.`
        },
        {
          q: R`Egy eloszlás ferdeségi együtthatója $\gamma_1 = 1{,}2$. Mit jelent ez?`,
          options: ["szimmetrikus", "jobbra (a nagy értékek felé) elnyúló", "balra elnyúló", "csúcsosabb a normálisnál"],
          answer: 1,
          hint: "A ferdeség előjele melyik oldali „farokra” utal? A csúcsosságot más mutató méri.",
          explain: R`Pozitív $\gamma_1$: hosszú jobb oldali „farok”. A csúcsosságot a lapultsági együttható ($\gamma_2$) méri.`
        },
        {
          q: "Melyik szám minimalizálja az E|X − r| átlagos abszolút eltérést?",
          options: ["a várható érték", "a medián", "a módusz", "a terjedelem fele"],
          answer: 1,
          hint: "Az abszolút és a négyzetes eltérést más-más középérték minimalizálja.",
          explain: R`Obádovics éppen így definiálja a mediánt. A négyzetes eltérést, $E\big((X - r)^2\big)$-t viszont a várható érték minimalizálja.`
        }
      ]
    },

    /* ------------------------------------------------ 3.8 */
    "p3-38": {
      title: "Kvíz – 3.8 Több valószínűségi változó",
      questions: [
        {
          q: "Melyik igaz?",
          options: [
            "Ha Cov(X, Y) = 0, akkor X és Y függetlenek.",
            "Ha X és Y függetlenek, akkor Cov(X, Y) = 0.",
            "A kettő ekvivalens.",
            "Egyik sem igaz."
          ],
          answer: 1,
          hint: "Melyik irányban következik egyik a másikból? Keress ellenpéldát a fordított irányra.",
          explain: R`A függetlenségből következik a korrelálatlanság, fordítva nem: pl. $X \in \{-1, 0, 1\}$ egyenletes és $Y = X^2$ esetén $\operatorname{Cov} = 0$, pedig $Y$-t $X$ teljesen meghatározza.`
        },
        {
          type: "single", shuffle: true,
          q: R`$X$ és $Y$ függetlenek, $D^2(X) = 4$, $D^2(Y) = 9$. Mennyi $D^2(X - Y)$?`,
          options: ["$13$", "$5$", "$1$", "$25$"],
          answer: 0,
          hint: "A szórásnégyzetek adódnak össze, nem a szórások – és mit csinál a −1-es szorzó a szórásnégyzettel?",
          explain: R`$D^2(X - Y) = D^2(X) + (-1)^2 D^2(Y) = 13$. A különbség szórásnégyzete is <em>összeadódik</em>, nem kivonódik!`
        },
        {
          type: "single", shuffle: true,
          q: R`$\operatorname{Cov}(X, Y) = 3$, $D(X) = 2$, $D(Y) = 4$. Mennyi a korreláció?`,
          options: ["$0{,}375$", "$0{,}5$", "$0{,}047$", "$0{,}75$"],
          answer: 0,
          hint: R`$R = \dfrac{\operatorname{Cov}(X,Y)}{D(X)\,D(Y)}$ – a szórásokkal osztunk, nem a szórásnégyzetekkel.`,
          explain: R`$R = \tfrac{3}{2\cdot4} = 0{,}375$.`
        },
        {
          q: R`Mit jelent, hogy $R(X, Y) = -1$?`,
          options: [
            "X és Y függetlenek.",
            R`$Y = aX + b$ valamilyen $a \lt 0$-val (tökéletes negatív lineáris kapcsolat).`,
            "Ha X nő, Y csökkenhet, de ez semmit nem jelent.",
            "X és Y kizárják egymást."
          ],
          answer: 1,
          hint: "Mikor lehet a korreláció abszolút értéke pontosan 1?",
          explain: R`$|R| = 1$ pontosan a lineáris függvénykapcsolatnál; az előjel a meredekség előjele.`
        }
      ]
    },

    /* ------------------------------------------------ 3.9 */
    "p3-39": {
      title: "Kvíz – 3.9 Alkalmazások",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Kalapprobléma: $n$ ember leadja a kalapját, majd véletlenszerűen (egyenletes véletlen permutációval) kapják vissza. Átlagosan hányan kapják vissza a sajátjukat?`,
          options: ["$1$", R`$\tfrac{n}{2}$`, R`$\tfrac{1}{n}$`, "$0$"],
          answer: 0,
          hint: R`Írd fel a találatok számát indikátorok összegeként, $X = I_1 + \dots + I_n$, és használd a várható érték linearitását – a függetlenség itt nem kell.`,
          explain: R`$I_k = 1$, ha a $k$-adik ember a saját kalapját kapja: $E(I_k) = P(I_k = 1) = \tfrac1n$. Így $E(X) = n\cdot\tfrac1n = 1$, bármekkora is $n$. Az $\tfrac1n$ egyetlen ember esélye, nem a találatok átlagos száma; az $\tfrac n2$ pedig abból a téves hiedelemből jön, hogy mindenki 50% eséllyel talál.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 10 kérdéses tesztben minden kérdésnél 4 válasz közül pontosan egy jó. Valaki minden kérdésnél vaktában tippel. Átlagosan hány jó válasza lesz?",
          options: [R`$2{,}5$`, "$4$", "$5$", R`$0{,}25$`],
          answer: 0,
          hint: "Minden kérdéshez rendelj egy indikátort (1, ha jó a válasz), és add össze a várható értékeiket.",
          explain: R`$X = I_1 + \dots + I_{10}$, $E(I_k) = \tfrac14$, így $E(X) = 10\cdot\tfrac14 = 2{,}5$. A $0{,}25$ egyetlen kérdés esélye, az $5$ a „fele-fele” tévhit, a $4$ a válaszok száma.`
        },
        {
          type: "single", shuffle: true,
          q: "Két független befektetés hozamának várható értéke egyaránt 5%, szórása egyaránt 10%. A pénzünket fele-fele arányban osztjuk meg köztük. Mekkora a portfólió hozamának szórása?",
          options: [R`$\approx 7{,}1\%$`, R`$10\%$`, R`$5\%$`, R`$\approx 14{,}1\%$`],
          answer: 0,
          hint: R`A portfólió hozama $\tfrac12 X + \tfrac12 Y$; a szórásnégyzetek adódnak össze (nem a szórások), és a $\tfrac12$ szorzó négyzetesen jön ki.`,
          explain: R`$D^2\!\left(\tfrac12X + \tfrac12Y\right) = \tfrac14\cdot 10^2 + \tfrac14\cdot 10^2 = 50$, tehát $D = \sqrt{50} \approx 7{,}07\%$, miközben a várható hozam marad 5%. Ez a diverzifikáció: a kockázat csökken, a hozam nem. A $10\%$ akkor jön ki, ha a szórásokat adod össze ($\tfrac12\cdot10 + \tfrac12\cdot10$), az $5\%$ a várható hozam (vagy a szórás egyszerű felezése), a $14{,}1\%$ pedig $X + Y$ szórása, a felezés nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Szentpétervári játék véges bankkal: az első fejig dobunk, ha az első fej a $k$-adik dobásra jön, $2^k$ dukátot kapunk – de a bank legfeljebb $2^{20}$ (kb. 1 millió) dukátot tud kifizetni. Mennyi a nyeremény várható értéke?`,
          options: ["$21$ dukát", "$20$ dukát", R`$2^{20} \approx 1\,048\,576$ dukát`, "végtelen"],
          answer: 0,
          hint: R`Bontsd két részre az összeget: $k \le 20$ esetén a teljes $2^k$-t kapjuk, $k \gt 20$ esetén csak $2^{20}$-at – mennyi ez utóbbi rész valószínűsége?`,
          explain: R`$\sum_{k=1}^{20} 2^{-k}\cdot 2^k = 20$, és $P(k \gt 20) = 2^{-20}$, ami $2^{20}$ dukáttal szorozva még $1$. Összesen $E = 20 + 1 = 21$ dukát – általában $2^m$-es banknál $m + 1$. A végtelen várható érték csak korlátlan banknál jön ki; egy reális bankkal a „tisztességes” ár meglepően kicsi. A $20$ az elfelejtett utolsó tag, a $2^{20}$ a legnagyobb lehetséges nyeremény, nem az átlag.`
        },
        {
          type: "single", shuffle: true,
          q: "Négy független kockadobás átlagának mennyi a szórásnégyzete? (Egy dobásé 35/12.)",
          options: [R`$\tfrac{35}{48} \approx 0{,}729$`, R`$\tfrac{35}{12} \approx 2{,}917$`, R`$\tfrac{35}{192} \approx 0{,}182$`, R`$\tfrac{35}{24} \approx 1{,}458$`],
          answer: 0,
          hint: R`Független tagok összegének szórásnégyzete a szórásnégyzetek összege; az $n$-nel való osztás $\tfrac{1}{n^2}$-tel szorozza a szórásnégyzetet.`,
          explain: R`$D^2\!\left(\tfrac{X_1 + \dots + X_4}{4}\right) = \tfrac{1}{16}\cdot 4\cdot\tfrac{35}{12} = \tfrac{35}{48} \approx 0{,}729$ – negyedannyi, a szórás pedig fele akkora.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p3-final": {
      title: "Fejezetzáró teszt – 3. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Három érmét dobunk fel, X a fejek száma. Mennyi E(X)?",
          options: ["$1{,}5$", "$0{,}875$", "$0{,}5$", "$3$"],
          answer: 0,
          hint: "Írd fel az eloszlást (0, 1, 2, 3 fej), vagy használd, hogy X három indikátor összege.",
          explain: R`$E(X) = 0\cdot\tfrac18 + 1\cdot\tfrac38 + 2\cdot\tfrac38 + 3\cdot\tfrac18 = 1{,}5$.`
        },
        {
          type: "single", shuffle: true,
          q: "Két kockával dobunk, X a kisebbik szám. Mennyi P(X = 2)?",
          options: [R`$\tfrac{1}{4} = 0{,}25$`, R`$\tfrac{2}{9} \approx 0{,}222$`, R`$\tfrac{11}{36} \approx 0{,}306$`, R`$\tfrac{5}{36} \approx 0{,}139$`],
          answer: 0,
          hint: "Sorold fel a párokat, ahol a kisebbik szám 2 – vigyázz, a (2, 2) csak egyszer számít.",
          explain: R`A kisebbik 2: $(2,2)$, valamint $(2, b)$ és $(a, 2)$ $a, b \in \{3,\dots,6\}$ – összesen $1 + 4 + 4 = 9$ eset, $\tfrac{9}{36} = 0{,}25$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$E(X) = 2$ és $E(X^2) = 7$. Mennyi $D^2(X)$?`,
          options: ["$3$", "$5$", "$11$", "$45$"],
          answer: 0,
          hint: R`$D^2(X) = E(X^2) - E(X)^2$ – a második tagban a várható érték négyzete áll.`,
          explain: R`$D^2(X) = E(X^2) - E(X)^2 = 7 - 4 = 3$.`
        },
        {
          type: "single", shuffle: true,
          q: R`(V.3.7) Az $f(x) = \tfrac16x + b$ ($0 \le x \le 3$, máshol 0) sűrűségfüggvény. Mennyi $b$?`,
          options: [R`$\tfrac{1}{12} \approx 0{,}083$`, R`$\tfrac{1}{4} = 0{,}25$`, R`$\tfrac{1}{3} \approx 0{,}333$`, R`$\tfrac{1}{6} \approx 0{,}167$`],
          answer: 0,
          hint: "A sűrűségfüggvény alatti teljes terület 1 – integráld 0-tól 3-ig.",
          explain: R`$\int_0^3 \left(\tfrac x6 + b\right)dx = \tfrac{9}{12} + 3b = 1 \Rightarrow b = \tfrac{1}{12}$.`
        },
        {
          type: "match",
          q: "Párosítsd a képleteket a fogalmakkal!",
          pairs: [
            [R`$\sum_i x_i p_i$`, "várható érték (diszkrét)"],
            [R`$\int_{-\infty}^{\infty} x f(x)\,dx$`, "várható érték (folytonos)"],
            [R`$E(X^2) - E(X)^2$`, "szórásnégyzet"],
            [R`$P(X \lt x)$`, "eloszlásfüggvény"],
            [R`$E(XY) - E(X)E(Y)$`, "kovariancia"]
          ],
          hint: "Figyeld, hol szerepel összeg és hol integrál, és melyik képletben van két változó.",
          explain: R`Diszkrét esetben $\sum x_i p_i$, folytonosban $\int x f(x)\,dx$ a várható érték. $E(X^2) - E(X)^2$ a szórásnégyzet (egy változó), $E(XY) - E(X)E(Y)$ a kovariancia (két változó). $F(x) = P(X \lt x)$ az eloszlásfüggvény Obádovics jelölésével.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy biztosító évi 20 000 Ft díjat szed egy lakásbiztosításért. 1% eséllyel kell 1,5 millió Ft kárt fizetnie (más kár nincs). Mennyi a biztosító várható nyeresége szerződésenként?",
          options: [R`$5\,000$ Ft`, R`$4\,800$ Ft`, R`$15\,000$ Ft`, R`$-130\,000$ Ft`],
          answer: 0,
          hint: "Díjbevétel mínusz várható kifizetés; a kifizetés várható értéke = valószínűség · kárösszeg.",
          explain: R`$E = 20\,000 - 0{,}01\cdot1\,500\,000 = 20\,000 - 15\,000 = 5000$ Ft. A biztosítás a <em>biztosítónak</em> kedvező játék – a biztosított a kockázat csökkentéséért fizet.`
        },
        {
          q: "Két kockával dobunk: S = a + b (összeg), D = a − b (különbség). Mi igaz?",
          options: [
            "S és D függetlenek, és Cov(S, D) = 0.",
            "Cov(S, D) = 0, de S és D nem függetlenek.",
            "Cov(S, D) > 0.",
            "Cov(S, D) < 0."
          ],
          answer: 1,
          hint: R`Bontsd ki $\operatorname{Cov}(a + b, a - b)$-t a bilinearitással; a függetlenséghez nézd meg, mit árul el $S = 2$ a $D$-ről.`,
          explain: R`$\operatorname{Cov}(a + b, a - b) = D^2(a) - D^2(b) = 0$, de pl. $S = 2$ esetén biztosan $D = 0$ – nem függetlenek. Nézd meg a 3.8 szemléltetésében!`
        },
        {
          q: "A szentpétervári játékban (az első fejig dobunk, a k-adik dobásnál jövő első fej 2^k dukátot ér) mennyi a nyeremény várható értéke korlátlan bank mellett?",
          options: ["2 dukát", "4 dukát", "1 dukát", "végtelen"],
          answer: 3,
          hint: "Írd fel a várható érték végtelen sorát (valószínűség · nyeremény), és nézd meg, mekkorák a tagok.",
          explain: R`$\sum_{k\ge1} 2^{-k}\cdot2^k = 1 + 1 + \dots = \infty$. Mégsem fizetne senki 1000 dukátot egy játékért – ez a paradoxon.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
