/* =========================================================
   4. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;
  const BIN = "binomiális", POI = "Poisson", HYP = "hipergeometrikus", GEO = "geometriai", EXP = "exponenciális", NOR = "normális", UNI = "egyenletes";

  const QUIZZES = {
    /* ------------------------------------------------ 4.2.1–4.2.2 */
    "p4-421": {
      title: "Kvíz – 4.2.1–4.2.2 Binomiális és geometriai eloszlás",
      questions: [
        {
          q: "Melyik változó NEM binomiális eloszlású?",
          options: [
            "A fejek száma 10 pénzfeldobásnál.",
            "A hatosok száma 30 kockadobásnál.",
            "A piros golyók száma, ha egy 5 piros és 5 fehér golyót tartalmazó urnából visszatevés nélkül húzunk négyet.",
            "A selejtes darabok száma 20 visszatevéssel kiválasztott termék között."
          ],
          answer: 2,
          explain: "Visszatevés nélkül a húzások nem függetlenek (a piros esélye húzásról húzásra változik) – ez hipergeometrikus eloszlás."
        },
        {
          type: "numeric",
          q: "Tízszer feldobunk egy szabályos érmét. Mi a valószínűsége, hogy pontosan 5 fej lesz?",
          answer: 252 / 1024,
          explain: R`$\binom{10}{5}\left(\tfrac12\right)^{10} = \tfrac{252}{1024} \approx 0{,}246$. A „legvalószínűbb” eredmény is csak kb. 25%-os!`
        },
        {
          type: "numeric",
          q: R`$X$ binomiális eloszlású, $n = 20$, $p = 0{,}3$. Mennyi $D^2(X)$?`,
          answer: 4.2,
          explain: R`$D^2(X) = npq = 20\cdot0{,}3\cdot0{,}7 = 4{,}2$ (a várható érték $np = 6$).`
        },
        {
          type: "numeric",
          q: "Egy 5 kérdéses tesztben minden kérdésre 4 válasz közül pontosan egy jó. Ha minden kérdésre tippelünk, mi a valószínűsége, hogy legalább 4 válaszunk helyes?",
          answer: 16 / 1024,
          explain: R`$\binom54\left(\tfrac14\right)^4\tfrac34 + \left(\tfrac14\right)^5 = \tfrac{15 + 1}{1024} \approx 0{,}0156$.`
        },
        {
          type: "numeric",
          q: "Átlagosan hányadik dobásra jön ki az első hatos egy szabályos kockával?",
          answer: 6,
          explain: R`A geometriai eloszlás várható értéke $\tfrac1p = 6$.`
        },
        {
          type: "numeric",
          q: "Mi a valószínűsége, hogy egy érmével az első fej éppen a 3. dobásnál jön?",
          answer: 1 / 8,
          explain: R`Írás, írás, fej: $\left(\tfrac12\right)^2\cdot\tfrac12 = \tfrac18$.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2.3 */
    "p4-423": {
      title: "Kvíz – 4.2.3 Hipergeometrikus eloszlás",
      questions: [
        {
          type: "numeric",
          q: "Az ötöslottón (90 számból 5-öt húznak) egy szelvénnyel mi a valószínűsége, hogy pontosan 2 találatunk lesz? (4 tizedesjegy)",
          answer: 987700 / 43949268, tol: 0.0003,
          explain: R`$\dfrac{\binom52\binom{85}{3}}{\binom{90}{5}} = \dfrac{10\cdot98\,770}{43\,949\,268} \approx 0{,}0225$ – kb. minden 44. szelvény kettes.`
        },
        {
          type: "numeric",
          q: "10 alkatrész közül 3 hibás. Visszatevés nélkül kiveszünk 4-et. Hány hibás lesz átlagosan a kivettek között?",
          answer: 1.2,
          explain: R`$E(X) = n\tfrac MN = 4\cdot\tfrac{3}{10} = 1{,}2$ – ugyanannyi, mint visszatevéssel.`
        },
        {
          type: "numeric",
          q: "Ugyanebben a helyzetben mi a valószínűsége, hogy egyik kivett alkatrész sem hibás?",
          answer: 1 / 6,
          explain: R`$\dfrac{\binom30\binom74}{\binom{10}{4}} = \dfrac{35}{210} = \dfrac16$.`
        },
        {
          q: "Mikor közelíthető jól a hipergeometrikus eloszlás a binomiálissal?",
          options: [
            "Ha a minta (n) sokkal kisebb a sokaságnál (N).",
            "Ha M = N / 2.",
            "Ha n közel van N-hez.",
            "Soha."
          ],
          answer: 0,
          explain: R`Ha $N \gg n$, egy-egy kivett elem alig változtat az összetételen, így a visszatevés nélküli húzás „majdnem” visszatevéses. A szórásnégyzetben a $\tfrac{N-n}{N-1}$ korrekciós tényező ilyenkor közel 1.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2.4 */
    "p4-424": {
      title: "Kvíz – 4.2.4 Poisson-eloszlás",
      questions: [
        {
          type: "numeric",
          q: "Egy ügyfélszolgálatra percenként átlagosan 2 hívás érkezik (Poisson-eloszlás). Mi a valószínűsége, hogy egy adott percben egy sem érkezik?",
          answer: Math.exp(-2),
          explain: R`$P(X = 0) = e^{-2} \approx 0{,}135$.`
        },
        {
          type: "numeric",
          q: "λ = 3 paraméterű Poisson-eloszlásnál mennyi P(X ≥ 1)?",
          answer: 1 - Math.exp(-3),
          explain: R`$1 - P(X = 0) = 1 - e^{-3} \approx 0{,}950$.`
        },
        {
          q: "Mennyi a λ paraméterű Poisson-eloszlás várható értéke és szórásnégyzete?",
          options: ["mindkettő λ", "λ és λ²", "λ és √λ", "1/λ és 1/λ²"],
          answer: 0,
          explain: R`$E(X) = D^2(X) = \lambda$. Ez gyakorlati próbája is a Poisson-modellnek: a darabszámok átlaga és szórásnégyzete közel egyenlő.`
        },
        {
          type: "numeric",
          q: "Egy 1000 darabos szállítmányban az alkatrészek 0,3%-a hibás. Poisson-közelítéssel mi a valószínűsége, hogy egyetlen hibás sincs benne?",
          answer: Math.exp(-3),
          explain: R`$\lambda = np = 1000\cdot0{,}003 = 3$, $P(X = 0) \approx e^{-3} \approx 0{,}0498$. (A pontos binomiális érték $0{,}997^{1000} \approx 0{,}0496$.)`
        },
        {
          q: "Melyik jelenséget írja le tipikusan Poisson-eloszlás?",
          options: ["egy ember testmagassága", "egy óra alatt beérkező e-mailek száma", "hány dobás kell az első hatosig", "egy izzó élettartama"],
          answer: 1,
          explain: "Sok, egymástól független, egyenként ritka esemény darabszáma egy rögzített időintervallumban (vagy területen) – ez a Poisson-eloszlás terepe."
        }
      ]
    },

    /* ------------------------------------------------ 4.3.1–4.3.2 */
    "p4-432": {
      title: "Kvíz – 4.3.1–4.3.2 Egyenletes és exponenciális eloszlás",
      questions: [
        {
          type: "numeric",
          q: "A kapcsolási idő egyenletes eloszlású 10 és 100 másodperc között. Mi a valószínűsége, hogy legalább 50 másodpercet kell várni?",
          answer: 50 / 90,
          explain: R`$P(X \ge 50) = \tfrac{100 - 50}{100 - 10} = \tfrac59 \approx 0{,}556$.`
        },
        {
          type: "numeric",
          q: "Mennyi a [2; 8] intervallumon egyenletes eloszlás szórása?",
          answer: 6 / Math.sqrt(12),
          explain: R`$D = \tfrac{b - a}{\sqrt{12}} = \tfrac{6}{\sqrt{12}} = \sqrt3 \approx 1{,}732$.`
        },
        {
          type: "numeric",
          q: "Egy alkatrész élettartama exponenciális eloszlású, átlagosan 500 óra. Mi a valószínűsége, hogy 1000 óránál tovább működik?",
          answer: Math.exp(-2),
          explain: R`$P(X \gt 1000) = e^{-1000/500} = e^{-2} \approx 0{,}135$.`
        },
        {
          q: "Egy (exponenciális élettartamú) izzó már 300 órája ég. Mi igaz arra, hogy még további 500 órát kibír?",
          options: [
            "Kisebb a valószínűsége, mint egy új izzónál – már „elhasználódott”.",
            "Ugyanakkora, mint annak, hogy egy új izzó 500 órát kibír.",
            "Nagyobb, mert bizonyította, hogy jó darab.",
            "Nem lehet megmondani."
          ],
          answer: 1,
          explain: R`Az exponenciális eloszlás „örökifjú”: $P(X \gt t + s \mid X \gt t) = P(X \gt s)$. (Valódi izzók persze öregszenek – ott a modell csak közelítés.)`
        },
        {
          type: "numeric",
          q: "λ = 0,1 paraméterű exponenciális eloszlás. Mennyi a medián?",
          answer: 10 * Math.LN2, tol: 0.01,
          explain: R`$1 - e^{-0{,}1x} = \tfrac12 \Rightarrow x = 10\ln2 \approx 6{,}93$ – kisebb, mint a várható érték (10): az eloszlás jobbra ferde.`
        }
      ]
    },

    /* ------------------------------------------------ 4.3.3 */
    "p4-433": {
      title: "Kvíz – 4.3.3 Normális eloszlás",
      questions: [
        {
          type: "numeric",
          q: R`$X^* \sim N(0, 1)$, és $\Phi(1) = 0{,}8413$. Mennyi $P(X^* \gt 1)$?`,
          answer: 0.1587,
          explain: R`$1 - \Phi(1) = 0{,}1587$.`
        },
        {
          type: "numeric",
          q: R`Az IQ $N(100, 15)$ eloszlású. Mi a valószínűsége, hogy valakinek 130-nál kisebb az IQ-ja? ($\Phi(2) = 0{,}9772$)`,
          answer: 0.9772,
          explain: R`$z = \tfrac{130 - 100}{15} = 2$, $P = \Phi(2) = 0{,}9772$.`
        },
        {
          type: "numeric",
          q: R`$X \sim N(m, \sigma)$. Mennyi $P(m - \sigma \lt X \lt m + \sigma)$? (4 tizedesjegy)`,
          answer: 0.6827, tol: 0.0005,
          explain: R`$2\Phi(1) - 1 \approx 0{,}6827$ – a „68–95–99,7” szabály első tagja.`
        },
        {
          type: "numeric",
          q: R`Mennyi $\Phi(-1{,}5)$, ha $\Phi(1{,}5) = 0{,}9332$?`,
          answer: 0.0668,
          explain: R`A szimmetria miatt $\Phi(-x) = 1 - \Phi(x) = 0{,}0668$.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak az $N(m, \sigma)$ eloszlásra?`,
          options: [
            R`a sűrűségfüggvény szimmetrikus az $x = m$ egyenesre`,
            "a medián és a módusz is m",
            R`a sűrűségfüggvény inflexiós pontjai $m \pm \sigma$-nál vannak`,
            R`$P(X = m) \gt 0$`,
            "a ferdeségi és a lapultsági együttható is 0"
          ],
          answer: [0, 1, 2, 4],
          explain: R`Folytonos eloszlásnál minden egyes pont valószínűsége 0 – a sűrűségfüggvény maximuma attól még $m$-ben van.`
        },
        {
          type: "numeric",
          q: R`Egy vizsga pontszámai $N(50, 10)$ eloszlásúak. Hány pont kell ahhoz, hogy valaki a legjobb 10%-ba kerüljön? ($\Phi(1{,}2816) = 0{,}9$)`,
          answer: 62.816, tol: 0.05,
          explain: R`$x = m + z\sigma = 50 + 1{,}2816\cdot10 \approx 62{,}8$ pont.`
        }
      ]
    },

    /* ------------------------------------------------ 4.4 */
    "p4-44": {
      title: "Kvíz – 4.4 Közelítések és a centrális határeloszlás-tétel",
      questions: [
        {
          type: "numeric",
          q: R`100-szor feldobunk egy érmét. Normális közelítéssel, folytonossági korrekcióval mennyi $P(X \le 40)$? ($\Phi(1{,}9) = 0{,}9713$)`,
          answer: 1 - 0.9713, tol: 0.002,
          explain: R`$np = 50$, $\sqrt{npq} = 5$. $P(X \le 40) \approx \Phi\!\left(\tfrac{40{,}5 - 50}{5}\right) = \Phi(-1{,}9) = 0{,}0287$. (A pontos érték 0,0284.)`
        },
        {
          q: "Mit mond ki a centrális határeloszlás-tétel?",
          options: [
            "Sok mérés átlaga mindig pontosan a várható érték.",
            "Sok független, azonos eloszlású változó standardizált összege közelítőleg standard normális eloszlású – az eredeti eloszlástól függetlenül.",
            "Minden valószínűségi változó normális eloszlású, ha elég sokszor mérjük.",
            "A binomiális eloszlás mindig Poisson-eloszlással közelíthető."
          ],
          answer: 1,
          explain: "Nem az egyes mérések lesznek normálisak, hanem az összegük (és így az átlaguk) eloszlása."
        },
        {
          q: "Mikor érdemes a binomiális eloszlást Poisson-eloszlással közelíteni?",
          options: ["ha n nagy és p kicsi", "ha n kicsi és p ≈ 0,5", "ha np ≥ 5 és n(1 − p) ≥ 5", "soha"],
          answer: 0,
          explain: R`Ritka események: $n$ nagy, $p$ kicsi, $\lambda = np$ mérsékelt. A harmadik feltétel a <em>normális</em> közelítés ökölszabálya.`
        },
        {
          type: "numeric",
          q: "100 kockadobás összegének mennyi a szórása? (Egy dobás szórásnégyzete 35/12.)",
          answer: Math.sqrt(100 * 35 / 12), tol: 0.02,
          explain: R`$D = \sqrt{100\cdot\tfrac{35}{12}} \approx 17{,}08$ (a várható érték 350).`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p4-final": {
      title: "Fejezetzáró teszt – 4. fejezet",
      questions: [
        {
          type: "match",
          q: "Melyik eloszlás írja le legtermészetesebben az alábbi változókat?",
          choices: [BIN, GEO, HYP, POI, UNI, EXP, NOR],
          pairs: [
            ["hány fej lesz 20 pénzfeldobásból", BIN],
            ["hány dobás kell az első hatosig", GEO],
            ["hány selejt lesz 5 kivett darab között egy 50 darabos dobozból (visszatevés nélkül)", HYP],
            ["hány sajtóhiba van egy véletlen oldalon", POI],
            ["egy véletlen időpont percértéke egy órán belül", UNI],
            ["mennyi idő telik el a következő bomlásig egy radioaktív mintában", EXP],
            ["egy véletlenül választott felnőtt testmagassága", NOR]
          ]
        },
        {
          type: "numeric",
          q: "(V.4.2) Egy csapat minden játszmát 2/3 eséllyel nyer. Négy játszmából mi a valószínűsége, hogy többet nyer, mint a felét?",
          answer: 16 / 27,
          explain: R`$P(X = 3) + P(X = 4) = 4\left(\tfrac23\right)^3\tfrac13 + \left(\tfrac23\right)^4 = \tfrac{32 + 16}{81} = \tfrac{16}{27} \approx 0{,}593$.`
        },
        {
          type: "numeric",
          q: "(V.4.5) X Poisson-eloszlású, λ = 1,8. Mi a valószínűsége, hogy a várható értékénél kisebb értéket vesz fel?",
          answer: Math.exp(-1.8) * 2.8, tol: 0.001,
          explain: R`$P(X \lt 1{,}8) = P(X = 0) + P(X = 1) = e^{-1{,}8}(1 + 1{,}8) \approx 0{,}463$.`
        },
        {
          type: "numeric",
          q: "(V.4.3) Az alkatrészek 2%-a selejtes. Legalább hány darabot kell (visszatevéssel) megvizsgálni, hogy legalább 0,96 valószínűséggel legyen köztük selejtes?",
          answer: 160, tol: 0, placeholder: "egész szám",
          explain: R`$1 - 0{,}98^n \ge 0{,}96 \iff 0{,}98^n \le 0{,}04 \iff n \ge \tfrac{\ln 0{,}04}{\ln 0{,}98} \approx 159{,}3$, tehát $n = 160$.`
        },
        {
          type: "numeric",
          q: "(V.4.10) 400 hallgató magassága N(170 cm, 16 cm) eloszlású. Körülbelül hányan magasabbak 190 cm-nél?",
          answer: 42, tol: 1, placeholder: "egész szám",
          explain: R`$z = \tfrac{190 - 170}{16} = 1{,}25$, $1 - \Phi(1{,}25) \approx 0{,}1056$, és $400\cdot0{,}1056 \approx 42$ fő.`
        },
        {
          type: "numeric",
          q: "Júliusban a hőmérséklet N(26 °C, 4 °C) eloszlású. Mi a valószínűsége, hogy 28 és 34 °C közé esik?",
          answer: 0.2858, tol: 0.001,
          explain: R`$\Phi(2) - \Phi(0{,}5) = 0{,}9772 - 0{,}6915 = 0{,}2857$.`
        },
        {
          q: "Melyik eloszlásnak egyenlő a várható értéke és a szórása?",
          options: ["Poisson", "exponenciális", "standard normális", "egyenletes a [0; 1]-en"],
          answer: 1,
          explain: R`Exponenciálisnál $E = D = \tfrac1\lambda$. (A Poissonnál a várható érték és a szórás<em>négyzet</em> egyenlő.)`
        },
        {
          q: "Egy gép 0,75 cm átmérőjű korongokat gyárt, az átmérő N(0,75; 0,06) eloszlású. Hibás a korong, ha 0,60 cm-nél kisebb vagy 0,84 cm-nél nagyobb. Kb. hány százalék a selejt?",
          options: ["0,6%", "7,3%", "13,4%", "31,7%"],
          answer: 1,
          explain: R`$z_1 = -2{,}5$, $z_2 = 1{,}5$: jó darab $\Phi(1{,}5) - \Phi(-2{,}5) = 0{,}9332 - 0{,}0062 = 0{,}927$, a selejt $7{,}3\%$.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
