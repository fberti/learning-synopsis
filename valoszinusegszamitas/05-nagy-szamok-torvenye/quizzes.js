/* =========================================================
   5. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 5.1–5.2 */
    "p5-52": {
      title: "Kvíz – 5.1–5.2 Markov- és Csebisev-egyenlőtlenség",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy nemnegatív $X$ változó várható értéke 5. Legfeljebb mekkora $P(X \ge 20)$?`,
          options: [R`$\tfrac{1}{4} = 0{,}25$`, R`$\tfrac{3}{4} = 0{,}75$`, R`$\tfrac{1}{16} = 0{,}0625$`, R`$\tfrac{1}{3} \approx 0{,}333$`],
          answer: 0,
          explain: R`Markov: $P(X \ge 20) \le \tfrac{E(X)}{20} = \tfrac{5}{20} = 0{,}25$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$E(X) = 50$, $D(X) = 5$. Legfeljebb mekkora $P(|X - 50| \ge 10)$?`,
          options: [R`$\tfrac{1}{4} = 0{,}25$`, R`$\tfrac{1}{2} = 0{,}5$`, R`$\tfrac{3}{4} = 0{,}75$`, R`$\tfrac{5}{6} \approx 0{,}833$`],
          answer: 0,
          explain: R`Csebisev: $\le \tfrac{D^2(X)}{\varepsilon^2} = \tfrac{25}{100} = 0{,}25$ (itt $k = 2$, $\tfrac{1}{k^2}$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Csebisev szerint legalább mekkora valószínűséggel esik $X$ a várható értékének 3 szórásnyi környezetébe?`,
          options: [R`$0{,}889$`, R`$0{,}111$`, R`$0{,}667$`, R`$0{,}997$`],
          answer: 0,
          explain: R`$P(|X - m| \lt 3\sigma) \ge 1 - \tfrac19 = \tfrac89 \approx 0{,}889$. Normális eloszlásnál a valódi érték 0,997 – de Csebisev minden eloszlásra érvényes.`
        },
        {
          type: "single", shuffle: true,
          q: "(V.5.2) Egy gyár 35 m-es köteleket gyárt 0,3 m szórással. Legfeljebb mennyi a valószínűsége, hogy egy kötél legalább 1 m-rel eltér a 35 m-től?",
          options: [R`$0{,}09$`, R`$0{,}3$`, R`$0{,}91$`, R`$0{,}972$`],
          answer: 0,
          explain: R`$P(|X - 35| \ge 1) \le \tfrac{0{,}3^2}{1^2} = 0{,}09$.`
        },
        {
          q: "Melyik igaz a Csebisev-egyenlőtlenségre?",
          options: [
            "Megadja a pontos valószínűséget, ha ismerjük a szórást.",
            "Minden olyan eloszlásra igaz, amelynek van szórása – ezért általában durva, de mindig érvényes felső korlát.",
            "Csak normális eloszlásra igaz.",
            "Csak k < 1 esetén ad értelmes korlátot."
          ],
          answer: 1,
          explain: R`Univerzális, ezért óvatos. $k \le 1$ esetén $\tfrac1{k^2} \ge 1$ – semmitmondó. Vannak eloszlások, amelyeknél pontosan egyenlőség áll (lásd az „éles” példát).`
        }
      ]
    },

    /* ------------------------------------------------ 5.3 */
    "p5-53": {
      title: "Kvíz – 5.3 A nagy számok törvénye",
      questions: [
        {
          q: "Mit mond ki a nagy számok Bernoulli-féle törvénye?",
          options: [
            "Ha elég sokszor ismételünk egy kísérletet, az esemény pontosan np-szer következik be.",
            R`Bármely $\varepsilon \gt 0$-ra $P\left(\left|\tfrac kn - p\right| \ge \varepsilon\right) \to 0$, ha $n \to \infty$.`,
            "A relatív gyakoriság minden n-re p.",
            "Hosszú távon a sikerek és a kudarcok száma kiegyenlítődik."
          ],
          answer: 1,
          explain: "A relatív gyakoriság sztochasztikusan konvergál a valószínűséghez. A darabszámok különbsége viszont nem tűnik el – tipikusan √n nagyságrendben nő."
        },
        {
          q: "100 dobásból 60 lett fej (szabályos érmével). Mit várhatunk a következő 1000 dobásra?",
          options: [
            "Több írást, hogy kiegyenlítődjön a 10 fejes többlet.",
            "Kb. 500 fejet; a fejek aránya az összes 1100 dobásban kb. (60 + 500) / 1100 ≈ 0,51 lesz.",
            "Továbbra is 60% fejet, mert a sorozat „lendületben van”.",
            "Pontosan 500 fejet."
          ],
          answer: 1,
          explain: "Az érme nem emlékszik. A korábbi többlet nem „kompenzálódik”, hanem „felhígul”: az arány a nagy számok törvénye szerint így is 1/2 felé tart."
        },
        {
          type: "single", shuffle: true,
          q: R`100 kockadobás átlagának mennyi a szórása? (Egy dobásé $\sqrt{35/12} \approx 1{,}708$.)`,
          options: [R`$0{,}171$`, R`$0{,}0292$`, R`$0{,}0171$`, R`$1{,}708$`],
          answer: 0,
          explain: R`$D(\bar X) = \tfrac{\sigma}{\sqrt n} = \tfrac{1{,}708}{10} \approx 0{,}171$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Csebisev szerint legfeljebb mekkora a valószínűsége, hogy 100 kockadobás átlaga legalább 0,5-del eltér a 3,5-től? ($D^2 = 35/12$)`,
          options: [R`$0{,}117$`, R`$0{,}342$`, R`$0{,}0583$`, R`$0{,}883$`],
          answer: 0,
          explain: R`$P(|\bar X - 3{,}5| \ge 0{,}5) \le \tfrac{D^2(X)}{n\varepsilon^2} = \tfrac{35/12}{100\cdot0{,}25} \approx 0{,}117$.`
        },
        {
          q: "Miért nem érvényes a nagy számok törvénye Cauchy-eloszlású változókra?",
          options: [
            "Mert nem szimmetrikus az eloszlás.",
            "Mert nincs várható értéke (a farkai túl vastagok).",
            "Mert diszkrét eloszlás.",
            "Érvényes, csak lassabban konvergál."
          ],
          answer: 1,
          explain: R`A tétel feltétele a véges várható érték. Cauchy-változók átlaga ugyanolyan Cauchy-eloszlású, mint egyetlen változó – nem „nyugszik meg”.`
        }
      ]
    },

    /* ------------------------------------------------ 5.4 */
    "p5-54": {
      title: "Kvíz – 5.4 Alkalmazások",
      questions: [
        {
          type: "single", shuffle: true,
          q: "(V.5.3) A kesztyűk 10%-a hibás. Csebisev-egyenlőtlenséggel: hány darabos tétel kell ahhoz, hogy a hibás arány legalább 0,95 valószínűséggel 0,02-nál kevésbé térjen el a 10%-tól?",
          options: [R`$4\,500$`, R`$12\,500$`, R`$237$`, R`$865$`],
          answer: 0,
          explain: R`$\tfrac{pq}{n\varepsilon^2} \le 0{,}05 \iff n \ge \tfrac{0{,}09}{0{,}0004\cdot0{,}05} = 4500$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Közvélemény-kutatás: a normális közelítéssel legalább hány fő kell, hogy egy (legrosszabb esetben 50%-os) arányt 95%-os megbízhatósággal ±3 százalékponton belül becsüljünk? ($z = 1{,}96$)`,
          options: [R`$1\,068$ fő`, R`$1\,067$ fő`, R`$5\,556$ fő`, R`$2\,135$ fő`],
          answer: 0,
          explain: R`$n \ge \left(\tfrac{1{,}96}{0{,}03}\right)^2\cdot0{,}25 \approx 1067{,}1$, tehát 1068 fő. (Csebisevvel 5556 jönne ki.) Ezért kérdeznek meg a felmérések jellemzően kb. 1000 embert.`
        },
        {
          q: "Buffon tűkísérletében (ℓ = d) mihez tart a metsző tűk aránya?",
          options: ["1/2-hez", "2/π-hez", "π/4-hez", "1/π-hez"],
          answer: 1,
          explain: R`$P(\text{metsz}) = \tfrac{2\ell}{\pi d} = \tfrac2\pi \approx 0{,}637$; a nagy számok törvénye szerint a relatív gyakoriság ehhez tart, így $\pi \approx \tfrac{2n}{k}$.`
        },
        {
          q: "Miért nyer hosszú távon biztosan a kaszinó?",
          options: [
            "Mert a játékosok előbb-utóbb mindig veszítenek.",
            "Mert minden fogadás várható értéke a kaszinónak kedvez, és a rengeteg független fogadás átlagos nyeresége a nagy számok törvénye szerint ehhez a pozitív várható értékhez tart.",
            "Mert a rulett nem véletlen.",
            "Mert a játékosok ritkán játszanak sokat."
          ],
          answer: 1,
          explain: "Egy-egy játékos lehet szerencsés, de a kaszinó milliónyi fogadásának átlaga gyakorlatilag pontosan a 2,7%-os házelőny."
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p5-final": {
      title: "Fejezetzáró teszt – 5. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`(Obádovics példája) Egy pozitív $X$ változóra $E(X) = 8$ és $D(X) = 8$. Csebisev szerint legfeljebb mekkora $P(X \ge 52)$?`,
          options: [R`$0{,}0331$`, R`$0{,}1538$`, R`$0{,}0237$`, R`$0{,}1818$`],
          answer: 0,
          explain: R`$X \ge 52 \Rightarrow |X - 8| \ge 44$, így $P \le \tfrac{64}{44^2} \approx 0{,}0331$. (Exponenciális eloszlásnál a valódi érték $e^{-6{,}5} \approx 0{,}0015$.)`
        },
        {
          type: "single", shuffle: true,
          q: R`(V.5.1) Egy pozitív $X$-re $E(X) = 20$ és $D(X) = 20$. Csebisev szerint legfeljebb mekkora $P(X \ge 70)$?`,
          options: [R`$0{,}16$`, R`$0{,}286$`, R`$0{,}0816$`, R`$0{,}4$`],
          answer: 0,
          explain: R`$P(|X - 20| \ge 50) \le \tfrac{400}{2500} = 0{,}16$. (Markov csak $\tfrac{20}{70} \approx 0{,}29$-et adna.)`
        },
        {
          type: "match",
          q: "Párosítsd az állításokat!",
          pairs: [
            [R`$P(X \ge c) \le \dfrac{E(X)}{c}$ nemnegatív $X$-re`, "Markov-egyenlőtlenség"],
            [R`$P(|X - m| \ge k\sigma) \le \dfrac{1}{k^2}$`, "Csebisev-egyenlőtlenség"],
            [R`$P(|\bar X_n - m| \ge \varepsilon) \to 0$`, "a nagy számok gyenge törvénye"],
            [R`$P\left(\left|\tfrac kn - p\right| \ge \varepsilon\right) \to 0$`, "Bernoulli-féle törvény"],
            [R`$\dfrac{X_1 + \dots + X_n - nm}{\sigma\sqrt n}$ eloszlása $\to N(0, 1)$`, "centrális határeloszlás-tétel"]
          ]
        },
        {
          type: "single", shuffle: true,
          q: "400-szor feldobunk egy érmét. Csebisev szerint legfeljebb mekkora a valószínűsége, hogy a fejek aránya legalább 0,05-dal eltér 0,5-től?",
          options: [R`$0{,}25$`, R`$0{,}5$`, R`$0{,}0125$`, R`$0{,}75$`],
          answer: 0,
          explain: R`$\tfrac{pq}{n\varepsilon^2} = \tfrac{0{,}25}{400\cdot0{,}0025} = 0{,}25$. (A valódi érték kb. 0,05 – a korlát durva.)`
        },
        {
          type: "single", shuffle: true,
          q: "Egy várakozási idő exponenciális eloszlású, átlaga 10 perc. Mennyi 25 független várakozási idő átlagának szórása?",
          options: [R`$2$ perc`, R`$0{,}4$ perc`, R`$4$ perc`, R`$10$ perc`],
          answer: 0,
          explain: R`Exponenciálisnál $\sigma = E = 10$, így $D(\bar X) = \tfrac{10}{\sqrt{25}} = 2$ perc.`
        },
        {
          q: "Mi a különbség a nagy számok törvénye és a centrális határeloszlás-tétel között?",
          options: [
            "Semmi, ugyanazt mondják.",
            "A nagy számok törvénye azt mondja, hogy az átlag a várható értékhez tart; a CHT azt, hogy az átlag eltérése (√n-nel felnagyítva) közelítőleg normális eloszlású – vagyis mennyire és milyen alakban ingadozik.",
            "A CHT csak normális változókra igaz.",
            "A nagy számok törvénye csak pénzfeldobásra igaz."
          ],
          answer: 1,
          explain: R`A nagy számok törvénye: <em>hova</em> tart az átlag. A CHT: <em>hogyan</em> ingadozik körülötte (kb. $\sigma/\sqrt n$ szórással, normális alakban).`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
