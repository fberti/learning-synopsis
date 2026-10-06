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
          explain: "Diszkrét: megszámlálható (véges vagy „1, 2, 3, …” módon felsorolható) sok értéke van. Folytonos: egy intervallum bármely értékét felveheti."
        },
        {
          type: "numeric",
          q: R`Két kockával dobunk, $X = |a - b|$ (a két szám eltérése). Mennyi $P(X = 0)$?`,
          answer: 1 / 6,
          explain: R`$X = 0$ pontosan a dupláknál: 6 eset a 36-ból, $P = \tfrac16$.`
        },
        {
          type: "numeric",
          q: R`Egy $X$ változó az 1, 2, 3, 4 értékeket rendre 0,1; 0,3; $p$; 0,2 valószínűséggel veszi fel. Mennyi $p$?`,
          answer: 0.4,
          explain: R`A valószínűségek összege 1: $p = 1 - 0{,}1 - 0{,}3 - 0{,}2 = 0{,}4$.`
        },
        {
          type: "numeric",
          q: "Egy urnában 2 piros és 3 fehér golyó van. Visszatevés nélkül kihúzunk kettőt, X a piros golyók száma. Mennyi P(X = 1)?",
          answer: 0.6,
          explain: R`$P(X = 1) = \dfrac{\binom21\binom31}{\binom52} = \dfrac{6}{10} = 0{,}6$.`
        }
      ]
    },

    /* ------------------------------------------------ 3.3 */
    "p3-33": {
      title: "Kvíz – 3.3 Várható érték",
      questions: [
        {
          type: "numeric",
          q: "X a 0, 1, 2 értékeket rendre 0,5; 0,3; 0,2 valószínűséggel veszi fel. Mennyi E(X)?",
          answer: 0.7,
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
          explain: "A várható érték a hosszú távú átlag. A 3,5-öt egyetlen dobás sem adja ki, és általában nem is a leggyakoribb érték."
        },
        {
          type: "numeric",
          q: "500 sorsjegyet adnak el 100 Ft-ért. Egy 20 000 Ft-os és két 5000 Ft-os nyeremény van. Mennyi egy jegy várható nettó nyeresége (forintban)?",
          answer: -40, tol: 0.01, unit: "Ft", placeholder: "pl. -25",
          explain: R`A nyeremények várható értéke $\tfrac{20\,000 + 2\cdot5000}{500} = 60$ Ft, a jegy ára 100 Ft: $E = 60 - 100 = -40$ Ft.`
        },
        {
          type: "numeric",
          q: R`$E(X) = 4$. Mennyi $E(3X + 2)$?`,
          answer: 14,
          explain: R`A várható érték lineáris: $E(3X + 2) = 3E(X) + 2 = 14$.`
        },
        {
          type: "numeric",
          q: "Ruletten (37 mező: 18 piros, 18 fekete, 1 zöld nulla) 1000 Ft-ot teszünk a pirosra. Ha nyerünk, +1000 Ft, különben −1000 Ft. Mennyi a várható nyereség?",
          answer: -1000 / 37, tol: 0.05, unit: "Ft",
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
          explain: R`Korrekt: $E(X) = 0$. Ez <em>nem</em> jelent 50%-os nyerési esélyt: a „hatos → +500 Ft, különben −100 Ft” játék korrekt, pedig csak $\tfrac16$ eséllyel nyerünk.`
        }
      ]
    },

    /* ------------------------------------------------ 3.4 */
    "p3-34": {
      title: "Kvíz – 3.4 Szórásnégyzet és szórás",
      questions: [
        {
          type: "numeric",
          q: R`X a 0, 1, 2 értékeket rendre 0,5; 0,3; 0,2 valószínűséggel veszi fel ($E(X) = 0{,}7$). Mennyi $D^2(X)$?`,
          answer: 0.61,
          explain: R`$E(X^2) = 0 + 0{,}3 + 4\cdot0{,}2 = 1{,}1$, így $D^2(X) = 1{,}1 - 0{,}7^2 = 0{,}61$.`
        },
        {
          type: "numeric",
          q: R`$D(X) = 3$. Mennyi $D(-2X + 5)$?`,
          answer: 6,
          explain: R`$D^2(aX + b) = a^2 D^2(X)$, így $D(aX+b) = |a|\,D(X) = 2\cdot 3 = 6$. Az eltolás nem változtat a szóráson, és a szórás sosem negatív.`
        },
        {
          type: "numeric",
          q: "Mennyi egy szabályos kockadobás szórásnégyzete?",
          answer: 35 / 12,
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
          explain: R`$D^2(2X) = 4D^2(X)$. Az 5. állítás a $D^2(X) = E(X^2) - E(X)^2 \ge 0$ átrendezése.`
        },
        {
          q: "Két befektetés várható hozama egyaránt 5%, de az A szórása 2%, a B-é 15%. Mit mondhatunk?",
          options: ["A kettő teljesen egyforma.", "A B a kockázatosabb: a hozama sokkal jobban ingadozik.", "A B várhatóan többet hoz.", "Az A hozama biztosan 3% és 7% között lesz."],
          answer: 1,
          explain: "A szórás az ingadozás (kockázat) mértéke. A 4. válasz azért hibás, mert a szórás nem korlát: csak azt mondja meg, mekkora a tipikus eltérés."
        }
      ]
    },

    /* ------------------------------------------------ 3.5 */
    "p3-35": {
      title: "Kvíz – 3.5 Eloszlásfüggvény",
      questions: [
        {
          type: "numeric",
          q: R`Kockadobás. Mennyi $F(3{,}5) = P(X \lt 3{,}5)$?`,
          answer: 0.5,
          explain: R`$X \lt 3{,}5$ az 1, 2, 3 dobásoknál: $\tfrac36 = \tfrac12$.`
        },
        {
          type: "numeric",
          q: R`Kockadobás, Obádovics jelölésével: $F(x) = P(X \lt x)$. Mennyi $F(3)$?`,
          answer: 1 / 3,
          explain: R`$P(X \lt 3) = P(X = 1) + P(X = 2) = \tfrac13$ – a 3-as itt még <em>nem</em> számít bele. (A $P(X \le x)$ definícióval $\tfrac12$ lenne.)`
        },
        {
          type: "numeric",
          q: R`$F(2) = 0{,}3$ és $F(5) = 0{,}8$. Mennyi $P(2 \le X \lt 5)$?`,
          answer: 0.5,
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
          explain: "Diszkrét változónál F lépcsős, tehát nem folytonos, és a lépcsők között konstans, tehát nem szigorúan növekvő. (Obádovics jelölésével F balról folytonos.)"
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "p3-36": {
      title: "Kvíz – 3.6 Folytonos valószínűségi változó",
      questions: [
        {
          type: "numeric",
          q: R`Az $f(x) = c\,x$ ($0 \le x \le 2$, máshol 0) sűrűségfüggvény. Mennyi $c$?`,
          answer: 0.5,
          explain: R`$\int_0^2 c\,x\,dx = 2c = 1$, tehát $c = \tfrac12$.`
        },
        {
          type: "numeric",
          q: "Egy izzó élettartama egyenletes eloszlású a [0; 1000] órán. Mi a valószínűsége, hogy 200 és 450 óra között ég ki?",
          answer: 0.25,
          explain: R`$F(450) - F(200) = \tfrac{450 - 200}{1000} = 0{,}25$.`
        },
        {
          q: R`$X$ folytonos valószínűségi változó. Mennyi $P(X = 1)$?`,
          options: [R`$f(1)$`, "0", R`$F(1)$`, "nem lehet tudni"],
          answer: 1,
          explain: R`Folytonos változónál egyetlen pont valószínűsége 0: $P(X = 1) = \int_1^1 f = 0$. Az $f(1)$ <em>nem</em> valószínűség, hanem sűrűség.`
        },
        {
          q: "Lehet-e egy sűrűségfüggvény értéke 1-nél nagyobb?",
          options: ["Nem, mert valószínűség.", "Igen, csak a görbe alatti teljes terület 1.", "Csak diszkrét változónál."],
          answer: 1,
          explain: R`Pl. az $f(x) = 2$ a $[0; \tfrac12]$-en érvényes sűrűségfüggvény. A sűrűség „valószínűség egységnyi hosszra”: $P(x \lt X \lt x + \Delta x) \approx f(x)\,\Delta x$.`
        },
        {
          type: "numeric",
          q: R`$f(x) = 2x$ a $[0; 1]$-en. Mennyi $P(X \gt 0{,}5)$?`,
          answer: 0.75,
          explain: R`$F(x) = x^2$, így $P(X \gt 0{,}5) = 1 - 0{,}25 = 0{,}75$.`
        },
        {
          type: "numeric",
          q: R`$f(x) = \tfrac38 x^2$ a $[0; 2]$-n. Mennyi $E(X)$?`,
          answer: 1.5,
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
          explain: "A kevés, nagyon nagy jövedelem felhúzza az átlagot, a mediánt alig mozdítja: jobbra ferde eloszlásnál tipikusan módusz < medián < átlag."
        },
        {
          type: "numeric",
          q: R`$F(x) = \tfrac{x^3}{8}$ a $[0; 2]$-n. Mennyi a medián? (3 tizedesjegy)`,
          answer: Math.cbrt(4), tol: 0.002,
          explain: R`$\tfrac{x^3}{8} = \tfrac12 \Rightarrow x = \sqrt[3]{4} \approx 1{,}587$.`
        },
        {
          type: "numeric",
          q: "Egy izzó élettartama egyenletes a [0; 1000] órán. Mennyi a felső kvartilis?",
          answer: 750, tol: 0.5, unit: "óra",
          explain: R`$F(x) = \tfrac{x}{1000} = 0{,}75 \Rightarrow x = 750$.`
        },
        {
          type: "numeric",
          q: R`X a 0, 1, 2 értékeket rendre 0,5; 0,3; 0,2 valószínűséggel veszi fel. Mennyi a második momentum, $E(X^2)$?`,
          answer: 1.1,
          explain: R`$0^2\cdot0{,}5 + 1^2\cdot0{,}3 + 2^2\cdot0{,}2 = 1{,}1$.`
        },
        {
          q: R`Egy eloszlás ferdeségi együtthatója $\gamma_1 = 1{,}2$. Mit jelent ez?`,
          options: ["szimmetrikus", "jobbra (a nagy értékek felé) elnyúló", "balra elnyúló", "csúcsosabb a normálisnál"],
          answer: 1,
          explain: R`Pozitív $\gamma_1$: hosszú jobb oldali „farok”. A csúcsosságot a lapultsági együttható ($\gamma_2$) méri.`
        },
        {
          q: "Melyik szám minimalizálja az E|X − r| átlagos abszolút eltérést?",
          options: ["a várható érték", "a medián", "a módusz", "a terjedelem fele"],
          answer: 1,
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
          explain: R`A függetlenségből következik a korrelálatlanság, fordítva nem: pl. $X \in \{-1, 0, 1\}$ egyenletes és $Y = X^2$ esetén $\operatorname{Cov} = 0$, pedig $Y$-t $X$ teljesen meghatározza.`
        },
        {
          type: "numeric",
          q: R`$X$ és $Y$ függetlenek, $D^2(X) = 4$, $D^2(Y) = 9$. Mennyi $D^2(X - Y)$?`,
          answer: 13,
          explain: R`$D^2(X - Y) = D^2(X) + (-1)^2 D^2(Y) = 13$. A különbség szórásnégyzete is <em>összeadódik</em>, nem kivonódik!`
        },
        {
          type: "numeric",
          q: R`$\operatorname{Cov}(X, Y) = 3$, $D(X) = 2$, $D(Y) = 4$. Mennyi a korreláció?`,
          answer: 0.375,
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
          explain: R`$|R| = 1$ pontosan a lineáris függvénykapcsolatnál; az előjel a meredekség előjele.`
        },
        {
          type: "numeric",
          q: "Négy független kockadobás átlagának mennyi a szórásnégyzete? (Egy dobásé 35/12.)",
          answer: 35 / 48,
          explain: R`$D^2\!\left(\tfrac{X_1 + \dots + X_4}{4}\right) = \tfrac{1}{16}\cdot 4\cdot\tfrac{35}{12} = \tfrac{35}{48} \approx 0{,}729$ – negyedannyi, a szórás pedig fele akkora.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p3-final": {
      title: "Fejezetzáró teszt – 3. fejezet",
      questions: [
        {
          type: "numeric",
          q: "Három érmét dobunk fel, X a fejek száma. Mennyi E(X)?",
          answer: 1.5,
          explain: R`$E(X) = 0\cdot\tfrac18 + 1\cdot\tfrac38 + 2\cdot\tfrac38 + 3\cdot\tfrac18 = 1{,}5$.`
        },
        {
          type: "numeric",
          q: "Két kockával dobunk, X a kisebbik szám. Mennyi P(X = 2)?",
          answer: 0.25,
          explain: R`A kisebbik 2: $(2,2)$, valamint $(2, b)$ és $(a, 2)$ $a, b \in \{3,\dots,6\}$ – összesen $1 + 4 + 4 = 9$ eset, $\tfrac{9}{36} = 0{,}25$.`
        },
        {
          type: "numeric",
          q: R`$E(X) = 2$ és $E(X^2) = 7$. Mennyi $D^2(X)$?`,
          answer: 3,
          explain: R`$D^2(X) = E(X^2) - E(X)^2 = 7 - 4 = 3$.`
        },
        {
          type: "numeric",
          q: R`(V.3.7) Az $f(x) = \tfrac16x + b$ ($0 \le x \le 3$, máshol 0) sűrűségfüggvény. Mennyi $b$?`,
          answer: 1 / 12,
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
          ]
        },
        {
          type: "numeric",
          q: "Egy biztosító évi 20 000 Ft díjat szed egy lakásbiztosításért. 1% eséllyel kell 1,5 millió Ft kárt fizetnie (más kár nincs). Mennyi a biztosító várható nyeresége szerződésenként?",
          answer: 5000, tol: 1, unit: "Ft",
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
          explain: R`$\operatorname{Cov}(a + b, a - b) = D^2(a) - D^2(b) = 0$, de pl. $S = 2$ esetén biztosan $D = 0$ – nem függetlenek. Nézd meg a 3.8 szemléltetésében!`
        },
        {
          q: "A szentpétervári játékban (az első fejig dobunk, a k-adik dobásnál jövő első fej 2^k dukátot ér) mennyi a nyeremény várható értéke korlátlan bank mellett?",
          options: ["2 dukát", "4 dukát", "1 dukát", "végtelen"],
          answer: 3,
          explain: R`$\sum_{k\ge1} 2^{-k}\cdot2^k = 1 + 1 + \dots = \infty$. Mégsem fizetne senki 1000 dukátot egy játékért – ez a paradoxon.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
