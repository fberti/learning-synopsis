/* =========================================================
   Analízis 3. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 3.1 */
    "an3-31": {
      title: "Kvíz – 3.1 A határérték szemléletesen",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 4}\dfrac{x^2 - 16}{x - 4}$?`,
          options: [R`$8$`, R`$1$`, R`$0$`, "nem létezik, mert a 4-ben nincs értelmezve"],
          answer: 0,
          hint: R`Behelyettesítve $\tfrac00$ jön ki – ez nem szám, hanem jelzés. Bontsd szorzattá a számlálót, és egyszerűsíts ($x \ne 4$)!`,
          explain: R`$x \ne 4$ esetén $\dfrac{(x - 4)(x + 4)}{x - 4} = x + 4 \to 8$. A grafikon az $y = x + 4$ egyenes, a $(4; 8)$ pontban lyukkal. Az $1$ és a $0$ a „$\tfrac00 = 1$”, illetve „$\tfrac00 = 0$” tévhit. A „nem létezik” azt keveri össze, hogy $f(4)$ nincs értelmezve – a határérték viszont csak a 4 <em>körüli</em> értékeken múlik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to -2}\dfrac{x^2 + 2x}{x + 2}$?`,
          options: [R`$-2$`, R`$2$`, R`$0$`, R`$1$`],
          answer: 0,
          hint: R`Emelj ki a számlálóból! Melyik tényező egyezik meg a nevezővel? Utána figyelj az előjelre.`,
          explain: R`$\dfrac{x(x + 2)}{x + 2} = x$ ($x \ne -2$), és $x \to -2$, tehát a határérték $-2$; a lyuk a $(-2; -2)$ pontban van. A $2$ előjelhiba (a pont $-2$, nem $2$), a $0$ és az $1$ a $\tfrac00$-t „számnak” veszi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Legyen $g(x) = x^2$, ha $x \ne 1$, és $g(1) = 7$. Mi igaz az 1-ben?`,
          options: [
            R`$\lim\limits_{x\to 1} g(x) = 1$ és $g(1) = 7$`,
            R`$\lim\limits_{x\to 1} g(x) = 7$ és $g(1) = 7$`,
            R`$\lim\limits_{x\to 1} g(x) = 1$ és $g(1) = 1$`,
            R`$\lim\limits_{x\to 1} g(x)$ nem létezik, mert $g(1) \ne 1$`
          ],
          answer: 0,
          hint: "A határérték azt nézi, mi történik a pont körül, a helyettesítési érték azt, hogy mi van a pontban. Mit vesz fel g az 1 közelében, ha x ≠ 1?",
          explain: R`Az 1 körül $g(x) = x^2$, pl. $g(0{,}99) = 0{,}9801$, $g(1{,}01) = 1{,}0201$ – az értékek az 1-hez közelítenek: $\lim\limits_{x\to 1} g(x) = 1$. A helyettesítési érték viszont a megadott $g(1) = 7$. A „határérték $= 7$” a „határérték = behelyettesítés” tévhit; a „$g(1) = 1$” a képletbe írja be az 1-et, holott $x = 1$-re külön szabály van. A határérték létezik – csak $g$ nem folytonos az 1-ben, mert a kettő nem egyenlő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Valaki $x = 0{,}001$-re kiszámolja: $\dfrac{\sin x}{x} \approx 0{,}01745$, és arra jut, hogy $\lim\limits_{x\to 0}\dfrac{\sin x}{x} \approx 0{,}017$. Mi történt?`,
          options: [
            R`A gép fokban (DEG) számolt; radiánban az érték $\approx 1$, és a határérték $1$.`,
            R`Igaza van: a határérték kb. $0{,}017$.`,
            R`Túl kicsi $x$-et választott, kerekítési hiba miatt; a határérték $0$.`,
            R`A 0-ban $\tfrac00$ áll, ezért a határérték nem létezik.`
          ],
          answer: 0,
          hint: R`A $0{,}01745$ egy ismert szám: $\tfrac{\pi}{180}$. Mit jelent ez a szögmérésnél?`,
          explain: R`DEG módban $\sin(0{,}001°) \approx 0{,}00001745$, így a hányados $\approx 0{,}01745 = \tfrac{\pi}{180}$ – a fok és a radián váltószáma. Radiánban $\tfrac{\sin 0{,}001}{0{,}001} \approx 0{,}99999983$, és a határérték 1. Az analízisben mindig radiánban számolunk. A $\tfrac00$ itt sem jelenti, hogy nincs határérték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $f(x) = \sin\dfrac{\pi}{x}$ értéke $x = 1;\ 0{,}1;\ 0{,}01;\ 0{,}001$-re mind $0$, viszont $x = \tfrac25;\ \tfrac29;\ \tfrac2{13}$-ra mind $1$. Mit mondhatsz a $\lim\limits_{x\to 0} f(x)$-ről?`,
          options: [
            "Nincs határérték: a 0 közelében a függvény végtelen sokszor leng −1 és 1 között.",
            "A határérték 0, mert végtelen sok, 0-hoz tartó pontban 0 az érték.",
            "A határérték 1, mert a második pontsor egyre közelebb van a 0-hoz.",
            "A határérték 1/2, a két érték átlaga."
          ],
          answer: 0,
          hint: "Néhány jól kiválasztott pont táblázata csak sejtést ad. Mit jelent, hogy két, a 0-hoz közelítő pontsoron más-más értéket kapsz?",
          explain: R`Ha lenne határérték, minden 0 felé közelítő pontsoron oda kellene közelíteniük az értékeknek. Itt az $x = \tfrac1n$ pontokon $\sin(n\pi) = 0$, az $x = \tfrac{2}{4n + 1}$ pontokon $\sin\left(2n\pi + \tfrac{\pi}2\right) = 1$ – tehát nincs határérték (pontosan a 3.2-ben bizonyítjuk). A „0” és az „1” egyetlen pontsorra hagyatkozik; az „átlag” nem határérték-fogalom.`
        },
        {
          type: "single", shuffle: true,
          q: R`A táblázat: $x = 0{,}1$: $0{,}7177$; $x = 0{,}01$: $0{,}6956$; $x = -0{,}01$: $0{,}6908$; $x = -0{,}1$: $0{,}6697$. Ezek a $\dfrac{2^x - 1}{x}$ értékei. Mi a legjobb sejtés a 0-beli határértékre?`,
          options: [R`kb. $0{,}69$`, R`$1$`, R`$2$`, R`$0$`],
          answer: 0,
          hint: "Nézd, hogy balról és jobbról közeledve egyre közelebb kerülnek-e az értékek egymáshoz – és mihez.",
          explain: R`Jobbról $0{,}7177 \to 0{,}6956$ csökken, balról $0{,}6697 \to 0{,}6908$ nő: a két oldal kb. $0{,}69$ felé szorul (a pontos érték $\ln 2 \approx 0{,}6931$, 3.4). Az $1$ az $\tfrac{e^x - 1}{x}$ határértéke – a 2-es alap mást ad. A $2$ az alapot veszi határértéknek, a $0$ pedig a $\tfrac00 = 0$ tévhit.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            "Egy függvénynek lehet határértéke olyan helyen, ahol nincs értelmezve.",
            "Ha f(a) létezik, akkor a határérték az a-ban f(a).",
            R`$\dfrac{x^2 - 1}{x - 1}$ és $x + 1$ nem ugyanaz a függvény, de az 1-beli határértékük ugyanaz.`,
            R`$\tfrac00 = 1$, mert „bármi osztva önmagával 1”.`,
            R`Ha egy táblázatban $x = 0{,}1;\ 0{,}01;\ 0{,}001$-re az érték mindig $0$, akkor a 0-beli határérték $0$.`
          ],
          answer: [0, 2],
          hint: "Gondolj a lyukas függvényekre, az áthelyezett pontra (g(1) = 5), a 0/0 két különböző kimenetelére és a sin(π/x) példájára.",
          explain: R`Igaz: $\tfrac{x^2 - 1}{x - 1}$ az 1-ben nincs értelmezve, mégis 2 a határértéke; és ez a függvény $x + 1$-től csak abban tér el, hogy az 1 nincs az értelmezési tartományában – a határérték csak a pont körüli értékeken múlik. Hamis: a $g(x) = x + 1$ ($x \ne 1$), $g(1) = 5$ függvénynél $g(1) = 5$, a határérték 2. A $\tfrac00$ nem szám: a 3.1 két példájában egyszer 4-et, egyszer 3-at adott. A táblázat nem bizonyít: $\sin\tfrac{\pi}{x}$ ezekben a pontokban 0, mégsincs határértéke.`
        },
        {
          type: "match",
          q: R`Párosítsd a függvényeket az 1-beli határértékükkel és helyettesítési értékükkel! ($g(x) = x + 1$, ha $x \ne 1$, és $g(1) = 5$.)`,
          pairs: [
            [R`$x + 1$`, "határérték 2, f(1) = 2"],
            [R`$\dfrac{x^2 - 1}{x - 1}$`, "határérték 2, f(1) nincs"],
            [R`$g(x)$`, "határérték 2, f(1) = 5"],
            [R`$\dfrac{x^3 - 1}{x - 1}$`, "határérték 3, f(1) nincs"]
          ],
          hint: "Két külön kérdés: mihez közelít a függvény az 1 körül (egyszerűsíts!), és mit ad a képlet (vagy a külön szabály) pontosan az 1-ben?",
          explain: R`Az első három az 1 körül ugyanazt az $x + 1$ értéket veszi fel, ezért mindhárom határértéke 2; a helyettesítési értékük viszont $2$, „nincs”, illetve $5$ – csak az $x + 1$ folytonos az 1-ben. A negyediknél $x^3 - 1 = (x - 1)(x^2 + x + 1)$, így a határérték $1 + 1 + 1 = 3$, és az 1-ben itt is $\tfrac00$ állna: nincs értelmezve.`
        }
      ]
    },

    /* ------------------------------------------------ 3.2 */
    "an3-32": {
      title: "Kvíz – 3.2 Határérték véges helyen – pontosan",
      questions: [
        {
          type: "multi",
          q: R`Melyik állítás igaz az átviteli elvről ($\lim\limits_{x\to a} f(x) = A$ sorozatokkal)? (Több is lehet.)`,
          options: [
            "Egyetlen olyan, a-hoz tartó (xₙ ≠ a) sorozat, amelynek a képsorozata divergens, elég ahhoz, hogy ne legyen határérték.",
            R`Ha az $x_n = \tfrac1n$ sorozatra $f(x_n) \to 0$, akkor $\lim\limits_{x\to 0} f(x) = 0$.`,
            R`Az $x_n \ne a$ kikötés miatt az $f(a)$ értéke nem befolyásolja a határértéket.`,
            "Ha két, a-hoz tartó sorozat képsorozata ugyanahhoz a számhoz tart, akkor létezik a határérték.",
            "Ha mindkét egyoldali határérték létezik, akkor létezik a (kétoldali) határérték is."
          ],
          answer: [0, 2],
          hint: R`A definícióban „<b>minden</b> sorozatra” áll. Mit bizonyít egy (vagy két) jó sorozat, és mit egy rossz?`,
          explain: R`Igaz: ha lenne határérték, minden ilyen sorozat képének konvergálnia kellene – egy divergens képsorozat (pl. $\operatorname{sgn}\tfrac{(-1)^n}{n}$) elég a cáfolathoz. Igaz: az $x_n \ne a$ miatt az $f(a)$ sosem kerül a képsorozatba (a $g(1) = 5$ példánál ezért 2 a határérték). Hamis: egy vagy két jó sorozat nem bizonyít – a $\sin\tfrac{\pi}{x}$-nél az $\tfrac1n$ képei mind 0-k, mégsincs határérték. Hamis az utolsó is: a két egyoldali határértéknek <em>egyenlőnek</em> is kell lennie ($\operatorname{sgn} x$: $-1$ és $1$).`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^2$, ha $x \lt 2$, és $f(x) = x + 3$, ha $x \ge 2$. Mennyi $\lim\limits_{x\to 2-} f(x)$?`,
          options: [R`$4$`, R`$5$`, "nem létezik, mert a két oldal különbözik", R`$4{,}5$`],
          answer: 0,
          hint: R`Bal oldali határértékhez csak az $x \lt 2$ értékek számítanak. Melyik ág érvényes ott?`,
          explain: R`Balról az $x^2$ ág érvényes: $x^2 \to 4$. Az $5$ a jobb oldali határérték (és $f(2)$) – a „rossz ág” hiba: hiába tartozik az $x = 2$ az $x + 3$ ágba, a bal oldali határértékbe az $f(2)$ nem számít bele. A két oldal valóban különbözik ($4 \ne 5$), de ez csak azt jelenti, hogy a <em>kétoldali</em> határérték nem létezik; a bal oldali igen. A $4{,}5$ átlagolás – ilyen szabály nincs.`
        },
        {
          type: "single", shuffle: true,
          q: R`Milyen $c$-re létezik a határérték az 1-ben: $f(x) = cx + 1$, ha $x \lt 1$, és $f(x) = x^2 + 4$, ha $x \gt 1$?`,
          options: [R`$c = 4$`, R`$c = 5$`, R`$c = 3$`, R`$c = 6$`],
          answer: 0,
          hint: "Számold ki külön a bal és a jobb oldali határértéket (c-vel), és tedd őket egyenlővé!",
          explain: R`Balról $c\cdot1 + 1 = c + 1$, jobbról $1 + 4 = 5$. Egyenlők, ha $c + 1 = 5$, azaz $c = 4$; ekkor a határérték 5. A $c = 5$-nél a bal oldalból kimaradt a $+1$ (akkor $6 \ne 5$), a $c = 3$-nál a jobb oldalt $4$-nek vették ($x^2$ elfelejtve), a $c = 6$ pedig rendezési előjelhiba ($c = 5 + 1$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Mik az egészrész-függvény, $\lfloor x\rfloor$ egyoldali határértékei a $-1$-ben?`,
          options: [
            R`balról $-2$, jobbról $-1$`,
            R`balról $-1$, jobbról $-1$`,
            R`balról $-1$, jobbról $0$`,
            R`balról $0$, jobbról $-1$`
          ],
          answer: 0,
          hint: R`$\lfloor x\rfloor$ a legnagyobb egész, amely nem nagyobb $x$-nél. Mennyi pl. $\lfloor -1{,}01\rfloor$ és $\lfloor -0{,}99\rfloor$?`,
          explain: R`Ha $-2 \le x \lt -1$, akkor $\lfloor x\rfloor = -2$ (pl. $\lfloor -1{,}01\rfloor = -2$), tehát balról $-2$. Ha $-1 \le x \lt 0$, akkor $-1$ (pl. $\lfloor -0{,}99\rfloor = -1$), tehát jobbról $-1$. A határérték nem létezik. A tipikus hiba a negatív számok „levágása” ($\lfloor -1{,}01\rfloor = -1$ vagy $\lfloor -0{,}99\rfloor = 0$) – az egészrész lefelé, a $-\infty$ felé kerekít.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik sorozatpár bizonyítja, hogy $\lim\limits_{x\to 0}\cos\dfrac{\pi}{x}$ nem létezik?`,
          options: [
            R`$x_n = \tfrac{1}{2n}$ és $y_n = \tfrac{1}{2n + 1}$`,
            R`$x_n = \tfrac{1}{2n}$ és $y_n = \tfrac{1}{4n}$`,
            R`$x_n = \tfrac{1}{2n}$ és $y_n = 2 + \tfrac1n$`,
            R`$x_n = \tfrac{1}{2n}$ és $y_n = 0$`
          ],
          answer: 0,
          hint: R`Két feltétel: mindkét sorozat a 0-hoz tartson (és tagjai ne legyenek 0-k), a képsorozatok pedig <em>különböző</em> határértékhez tartsanak. Számold ki $\tfrac{\pi}{x_n}$-et!`,
          explain: R`$x_n = \tfrac1{2n}$: $\cos(2n\pi) = 1 \to 1$; $y_n = \tfrac{1}{2n + 1}$: $\cos((2n + 1)\pi) = -1 \to -1$. Mindkettő 0-hoz tart, a képek máshová – nincs határérték. Az $\tfrac1{4n}$ képei is mind 1-ek: két jó sorozat semmit sem bizonyít. A $2 + \tfrac1n$ nem a 0-hoz tart. Az $y_n = 0$ sérti az $x_n \ne a$ feltételt (és a 0-ban $f$ nincs is értelmezve).`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to 1}(4x - 3) = 1$. Mekkora $\delta$ jó az $\varepsilon = 0{,}2$ hibahatárhoz (a lehető legnagyobb)?`,
          options: [R`$\delta = 0{,}05$`, R`$\delta = 0{,}8$`, R`$\delta = 0{,}2$`, R`$\delta = 0{,}1$`],
          answer: 0,
          hint: R`Írd fel $|f(x) - 1|$-et $|x - 1|$ segítségével. Hányszorosára nagyítja a függvény a távolságot?`,
          explain: R`$|4x - 3 - 1| = 4|x - 1| \lt 0{,}2 \iff |x - 1| \lt 0{,}05$, tehát $\delta = \tfrac{\varepsilon}{4} = 0{,}05$. A meredek függvény szűkíti az ablakot. A $0{,}8 = 4\varepsilon$ fordítva számol (szoroz osztás helyett), a $0{,}2$ a „$\delta = \varepsilon$” tévedés, a $0{,}1$ pedig $\tfrac{\varepsilon}{2}$ – pl. $x = 1{,}06$ már benne van az ablakban, de $|f(x) - 1| = 0{,}24 \gt 0{,}2$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^2$, $a = 2$, $A = 4$, $\varepsilon = 0{,}5$. Mi a legnagyobb jó $\delta$? (Kerekítve.)`,
          options: [R`$0{,}1213$`, R`$0{,}1292$`, R`$0{,}125$`, R`$0{,}5$`],
          answer: 0,
          hint: R`Oldd meg: $3{,}5 \lt x^2 \lt 4{,}5$. Mekkora hely van a 2-től jobbra és balra? Az ablak szimmetrikus!`,
          explain: R`$\sqrt{3{,}5} \approx 1{,}8708 \lt x \lt \sqrt{4{,}5} \approx 2{,}1213$. Jobbra $0{,}1213$, balra $0{,}1292$ hely van; a szimmetrikus ablak a <b>kisebbik</b>: $\delta \approx 0{,}1213$. A $0{,}1292$ a nagyobbik oldal – ott jobbra kilóg: $2{,}1292^2 - 4 \approx 0{,}53 \gt 0{,}5$. A $0{,}125 = \tfrac{\varepsilon}{4}$ úgy számol, mintha a függvény egyenes lenne 4-es meredekséggel; de a görbe jobbra meredekebb, ezért $2{,}125^2 - 4 \approx 0{,}516 \gt 0{,}5$. A $0{,}5$ a „$\delta = \varepsilon$” hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik a határérték helyes $\varepsilon$–$\delta$ definíciója?`,
          options: [
            R`$\forall\varepsilon \gt 0\ \exists\delta \gt 0$: $0 \lt |x - a| \lt \delta,\ x \in D_f \Rightarrow |f(x) - A| \lt \varepsilon$`,
            R`$\exists\delta \gt 0\ \forall\varepsilon \gt 0$: $0 \lt |x - a| \lt \delta,\ x \in D_f \Rightarrow |f(x) - A| \lt \varepsilon$`,
            R`$\forall\varepsilon \gt 0\ \exists\delta \gt 0$: $|x - a| \lt \delta,\ x \in D_f \Rightarrow |f(x) - A| \lt \varepsilon$`,
            R`$\forall\varepsilon \gt 0\ \exists\delta \gt 0\ \exists x$: $0 \lt |x - a| \lt \delta$ és $|f(x) - A| \lt \varepsilon$`
          ],
          answer: 0,
          hint: "Három dologra figyelj: ki „lép” először (a hibahatár vagy az ablak), kizárjuk-e magát az a pontot, és az ablak minden pontjára vagy csak egyre kell-e a feltétel.",
          explain: R`Előbb jön az $\varepsilon$ (az ellenfél hibahatára), és erre válaszolsz egy $\delta$-val; a $0 \lt |x - a|$ kizárja az $x = a$-t; és az ablak <em>minden</em> pontjára kell a feltétel. A második rögzíti a $\delta$-t minden $\varepsilon$ előtt – ez csak akkor teljesülne, ha $f$ az $a$ körül (az $a$-t kivéve) állandóan $A$ lenne. A harmadikból hiányzik a $0 \lt$: ekkor $f(a)$ is számítana (a $g(1) = 5$ példánál nem lenne határérték). A negyedik csak azt kéri, hogy <em>legyen</em> egy jó $x$ az ablakban – ez a $\sin\tfrac{\pi}{x}$-re is teljesülne $A = 0$-val.`
        }
      ]
    },

    /* ------------------------------------------------ 3.3 */
    "an3-33": {
      title: "Kvíz – 3.3 Végtelen határérték és aszimptoták",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 1-}\dfrac{2x}{x - 1}$ és $\lim\limits_{x\to 1+}\dfrac{2x}{x - 1}$?`,
          options: [
            R`$-\infty$ és $+\infty$`,
            R`$+\infty$ és $+\infty$`,
            R`$+\infty$ és $-\infty$`,
            R`$2$ és $2$`
          ],
          answer: 0,
          hint: "„Nem nulla per nulla”: a határérték ±∞ lesz – csak az előjel kérdéses. Milyen előjelű a számláló és a nevező az 1-től balra, illetve jobbra?",
          explain: R`A számláló $\to 2 \gt 0$. Balról ($x \lt 1$) a nevező kicsi negatív: $\tfrac{2}{0-} \to -\infty$; jobbról kicsi pozitív: $\tfrac{2}{0+} \to +\infty$. Az $x = 1$ függőleges aszimptota. A „$+\infty$ mindkét oldalon” a „$\tfrac10 = \infty$” hiba (előjelvizsgálat nélkül), a fordított párosítás a két oldal felcserélése, a „2 és 2” pedig csak a számlálót nézi.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hol van függőleges aszimptotája és hol lyuka az $f(x) = \dfrac{x^2 - 4}{x^2 - 3x + 2}$ függvénynek?`,
          options: [
            R`függőleges aszimptota: $x = 1$; lyuk: $x = 2$ (a határérték ott $4$)`,
            R`függőleges aszimptota: $x = 1$ és $x = 2$; lyuk nincs`,
            R`függőleges aszimptota: $x = -1$ és $x = -2$; lyuk nincs`,
            R`függőleges aszimptota: $x = 1$; lyuk: $x = 2$ (a határérték ott $0$)`
          ],
          answer: 0,
          hint: "Bontsd szorzattá a számlálót és a nevezőt is! Melyik nevező-zérushely tűnik el egyszerűsítéskor?",
          explain: R`$f(x) = \dfrac{(x - 2)(x + 2)}{(x - 1)(x - 2)} = \dfrac{x + 2}{x - 1}$ ($x \ne 2$). A 2-ben a közös tényező egyszerűsödik: <b>lyuk</b>, a határérték $\tfrac{2 + 2}{2 - 1} = 4$. Az 1-ben a nevező 0 marad, a számláló $\to 3$: <b>függőleges aszimptota</b>. A „mindkettő aszimptota” elfelejti az egyszerűsítést; az $x = -1$, $x = -2$ gyöktényező-előjelhiba ($x^2 - 3x + 2 = (x - 1)(x - 2)$); a lyuk értéke nem $0$ – a $\tfrac00$ nem 0.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to -\infty}\dfrac{6x^3 + x}{2x^2 - 1}$?`,
          options: [R`$-\infty$`, R`$+\infty$`, R`$3$`, R`$0$`],
          answer: 0,
          hint: R`A végtelenben a főtagok döntenek: hogyan viselkedik $\tfrac{6x^3}{2x^2}$? És mi az előjele, ha $x$ negatív?`,
          explain: R`Nagy $|x|$-re a tört úgy viselkedik, mint $\tfrac{6x^3}{2x^2} = 3x$, ami $x \to -\infty$-re $-\infty$. A $k - m = 1$ fokkülönbség páratlan, ezért $-\infty$-ben előjelet vált – a $+\infty$ ezt felejti el. A $3$ a főegyütthatók hányadosa, de az csak azonos fokú számlálónál és nevezőnél a határérték. A $0$ akkor jönne, ha a számláló foka lenne kisebb.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = \dfrac{4x^2 - 3x + 7}{2x^2 + 5}$ vízszintes aszimptotája?`,
          options: [R`$y = 2$`, R`$y = \tfrac75$`, R`$y = 0$`, "nincs vízszintes aszimptotája"],
          answer: 0,
          hint: R`Ugyanakkora a számláló és a nevező foka? Ha igen, melyik együtthatók döntenek – a legnagyobb vagy a legkisebb hatványé?`,
          explain: R`Mindkét fok 2, ezért $x \to \pm\infty$-re $f(x) \to \tfrac{4}{2} = 2$ (osszunk $x^2$-tel: $\tfrac{4 - 3/x + 7/x^2}{2 + 5/x^2}$): $y = 2$ mindkét irányban. Az $\tfrac75$ a konstans tagok hányadosa – azok a 0 közelében számítanak, nem a végtelenben ($f(0) = \tfrac75$). Az $y = 0$ akkor lenne, ha a nevező foka nagyobb; vízszintes aszimptota pedig van, mert a határérték véges.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több is lehet.)",
          options: [
            "A vízszintes aszimptotát a függvény grafikonja metszheti, akár végtelen sokszor is.",
            R`Az $e^x$-nek a $-\infty$ felé az $y = 0$ vízszintes aszimptotája, a $+\infty$ felé nincs vízszintes aszimptotája.`,
            "A nevező minden zérushelye függőleges aszimptota.",
            R`Ha $\lim\limits_{x\to +\infty} f(x) = A$, akkor $\lim\limits_{x\to -\infty} f(x) = A$ is teljesül.`,
            R`Ha az $a$-ban legalább az egyik egyoldali határérték $+\infty$ vagy $-\infty$, akkor az $x = a$ függőleges aszimptota.`
          ],
          answer: [0, 1, 4],
          hint: R`Gondolj a $2 + \tfrac{\sin x}{x}$ függvényre, az $e^x$ két irányára, a lyukakra és a függőleges aszimptota definíciójára.`,
          explain: R`Igaz: $2 + \tfrac{\sin x}{x} \to 2$, de ahol $\sin x = 0$, ott a grafikon metszi az $y = 2$ egyenest – az aszimptota nem „fal”. Igaz: $e^x \to 0$, ha $x \to -\infty$, de $e^x \to +\infty$, ha $x \to +\infty$. Igaz az utolsó is: ez a függőleges aszimptota definíciója (elég egy oldal, pl. $\ln x$ a 0-ban). Hamis: a nevező zérushelye lehet lyuk is, ha egyszerűsödik (pl. $\tfrac{x^2 - 1}{x - 1}$ az 1-ben). Hamis: a két irányt külön kell vizsgálni – épp az $e^x$ a példa.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = \dfrac{x^2 + 3x + 1}{x + 1}$ ferde aszimptotája?`,
          options: [R`$y = x + 2$`, R`$y = x + 3$`, R`$y = x$`, R`$y = x + 4$`],
          answer: 0,
          hint: R`Végezd el a polinomosztást $(x + 1)$-gyel, és ellenőrizd visszaszorzással! A maradéktört a végtelenben 0-hoz tart.`,
          explain: R`$x^2 + 3x + 1 = (x + 1)(x + 2) - 1$ (ellenőrzés: $x^2 + 3x + 2 - 1$ ✔), így $f(x) = x + 2 - \tfrac{1}{x + 1}$, és az aszimptota $y = x + 2$. Az $x + 3$ csak $x$-szel osztja a számlálót ($\tfrac{x^2 + 3x}{x}$), a nevező $+1$-ét elhagyva; az $y = x$ csak a főtagokat nézi ($\tfrac{x^2}{x}$) – ez a meredekséget megadja, a tengelymetszetet nem. Az $x + 4$ az osztás második lépésének előjelhibája ($3x - x$ helyett $3x + x$). (Az $f(x) - (x + 3) \to -1$, nem 0.)`
        },
        {
          type: "match",
          q: R`Az $f(x) = \dfrac{x^2 - 3x + 2}{x^2 - 1}$ függvény. Párosítsd a kérdést a válasszal!`,
          pairs: [
            ["a lyuk helye", "x = 1"],
            ["a függőleges aszimptota", "x = −1"],
            ["a vízszintes aszimptota", "y = 1"],
            ["a határérték az 1-ben", "−1/2"],
            [R`$\lim\limits_{x\to -1-} f(x)$`, "+végtelen"]
          ],
          hint: R`Szorzattá alakítás: számláló és nevező is osztható $(x - 1)$-gyel. Az egyszerűsített alakban helyettesíts, a végtelenben a fokokat hasonlítsd!`,
          explain: R`$f(x) = \dfrac{(x - 1)(x - 2)}{(x - 1)(x + 1)} = \dfrac{x - 2}{x + 1}$ ($x \ne 1$). Az 1-ben lyuk, a határérték $\tfrac{1 - 2}{1 + 1} = -\tfrac12$. Az $x = -1$-ben a nevező 0 marad (a számláló $\to -3$): függőleges aszimptota; balról $\tfrac{-3}{0-} \to +\infty$ (jobbról $-\infty$). A fokok egyenlők, a főegyütthatók hányadosa 1: $y = 1$. Gyakori hiba az 1-et is aszimptotának venni – előbb egyszerűsíts!`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 0}\dfrac{x^2 + x}{x}$?`,
          options: [
            R`$1$ – a 0-ban lyuk van, nincs aszimptota`,
            R`$+\infty$ – a nevező 0, tehát függőleges aszimptota`,
            R`balról $-\infty$, jobbról $+\infty$`,
            R`$0$`
          ],
          answer: 0,
          hint: R`Mi jön ki behelyettesítéskor: „nem nulla per nulla”, vagy $\tfrac00$? Ha az utóbbi, előbb egyszerűsíts!`,
          explain: R`A számláló is 0-hoz tart, tehát $\tfrac00$ – nem „szám per 0”. $\tfrac{x(x + 1)}{x} = x + 1 \to 1$: a 0-ban lyuk van, a $(0; 1)$ pontban. A $\pm\infty$-es válaszok a „nevező 0 ⇒ aszimptota” hibát követik (egyszerűsítés elmarad), a $0$ pedig a $\tfrac00 = 0$ tévhit.`
        }
      ]
    },

    /* ------------------------------------------------ 3.4 */
    "an3-34": {
      title: "Kvíz – 3.4 Határérték kiszámolása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 3}\dfrac{x^2 - x - 6}{x^2 - 9}$?`,
          options: [R`$\tfrac56$`, R`$\tfrac23$`, R`$1$`, "nem létezik"],
          answer: 0,
          hint: R`Behelyettesítve $\tfrac00$. Ha egy polinom a 3-ban 0, akkor kiemelhető belőle $(x - 3)$. Bontsd szorzattá mindkettőt!`,
          explain: R`$\dfrac{(x - 3)(x + 2)}{(x - 3)(x + 3)} = \dfrac{x + 2}{x + 3} \to \dfrac56$. A $\tfrac23 = \tfrac{-6}{-9}$ a konstans tagok „tagonkénti egyszerűsítése” – csak szorzótényezővel szabad egyszerűsíteni. Az $1$ a $\tfrac00 = 1$ tévhit, a „nem létezik” pedig a $\tfrac00$-t végeredménynek tekinti, holott az csak azt jelzi: át kell alakítani.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 0}\dfrac{\sqrt{x + 4} - 2}{x}$?`,
          options: [R`$\tfrac14$`, R`$\tfrac12$`, R`$4$`, R`$0$`],
          answer: 0,
          hint: R`Bővíts a konjugálttal, $(\sqrt{x + 4} + 2)$-vel! Mit kapsz a számlálóban $(a - b)(a + b) = a^2 - b^2$ szerint?`,
          explain: R`$\dfrac{(x + 4) - 4}{x(\sqrt{x + 4} + 2)} = \dfrac{1}{\sqrt{x + 4} + 2} \to \dfrac{1}{2 + 2} = \dfrac14$. Az $\tfrac12$-nél a nevezőben a $\sqrt{x + 4} + 2$ helyett csak $2$ maradt, a $4$ a reciprok (a tört rossz oldalán marad a gyök), a $0$ a $\tfrac00 = 0$ tévhit.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to +\infty}\left(\sqrt{x^2 + 6x} - x\right)$?`,
          options: [R`$3$`, R`$6$`, R`$0$`, R`$+\infty$`],
          answer: 0,
          hint: R`$\infty - \infty$ kritikus alak. Bővíts $(\sqrt{x^2 + 6x} + x)$-szel, aztán oszd a számlálót és a nevezőt is $x$-szel!`,
          explain: R`$\dfrac{x^2 + 6x - x^2}{\sqrt{x^2 + 6x} + x} = \dfrac{6x}{\sqrt{x^2 + 6x} + x} = \dfrac{6}{\sqrt{1 + 6/x} + 1} \to \dfrac62 = 3$. A $6$-nál a nevezőben az egyik tagot elfelejtették (csak $x$-szel osztottak). A „$\infty - \infty = 0$” és a „$= +\infty$” is hibás: a kritikus alak bármi lehet, csak átalakítás után derül ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to -\infty}\dfrac{x}{\sqrt{x^2 + 4}}$?`,
          options: [R`$-1$`, R`$1$`, R`$0$`, R`$\tfrac12$`],
          answer: 0,
          hint: R`Emeld ki $\sqrt{x^2}$-et a gyök alól. Mennyi $\sqrt{x^2}$, ha $x$ negatív?`,
          explain: R`$\sqrt{x^2 + 4} = |x|\sqrt{1 + \tfrac4{x^2}}$, és $x \lt 0$-ra $|x| = -x$. Így a tört $\dfrac{x}{-x\sqrt{1 + 4/x^2}} \to -1$. Az $1$ a $\sqrt{x^2} = x$ hiba – az csak $x \gt 0$-ra igaz ($+\infty$-ben valóban 1). A $0$ a „számláló kicsi a gyökhöz képest” téves érzése (a fokok egyformák), az $\tfrac12$ pedig a $\sqrt4 = 2$ konstans tagot keveri bele.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 0}\dfrac{\sin 4x}{2x}$?`,
          options: [R`$2$`, R`$1$`, R`$4$`, R`$\tfrac12$`],
          answer: 0,
          hint: R`A $\tfrac{\sin u}{u} \to 1$ csak akkor használható, ha a szinusz argumentuma és a nevező <em>ugyanaz</em>. Bővíts úgy, hogy a nevezőben $4x$ álljon!`,
          explain: R`$\dfrac{\sin 4x}{2x} = 2\cdot\dfrac{\sin 4x}{4x}$, és $u = 4x \to 0$ miatt $\tfrac{\sin u}{u} \to 1$; a határérték $2$. Az $1$ a „$\tfrac{\sin 3x}{x} \to 1$” típusú hiba (eltérő argumentum és nevező). A $4$-nél kimaradt a nevező 2-es szorzója, az $\tfrac12$ a szorzó megfordítása.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to +\infty}\left(1 + \dfrac{3}{x}\right)^{2x}$?`,
          options: [R`$e^6$`, R`$1$`, R`$e^3$`, R`$e^{3/2}$`],
          answer: 0,
          hint: R`$1^\infty$ alak. Mi lesz $\left(1 + \tfrac3x\right)^{x}$ határértéke? A $2x$ kitevő ennek hányadik hatványa?`,
          explain: R`$\left(1 + \tfrac3x\right)^{2x} = \left[\left(1 + \tfrac3x\right)^{x}\right]^2 \to \left(e^3\right)^2 = e^6 \approx 403{,}4$. Az $1$ a legfontosabb buktató: „$1^\infty = 1$” – de itt a kitevő is nő. Az $e^3$ elfelejti a kitevő 2-es szorzóját ($e^{r}$ helyett $e^{rs}$ kell), az $e^{3/2}$ pedig szorzás helyett oszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 0}\dfrac{3^x - 1}{x}$?`,
          options: [R`$\ln 3$`, R`$3$`, R`$1$`, R`$0$`],
          answer: 0,
          hint: R`Írd át: $3^x = e^{x\ln 3}$, és használd az $\tfrac{e^u - 1}{u} \to 1$ nevezetes határértéket!`,
          explain: R`$\dfrac{e^{x\ln 3} - 1}{x} = \ln 3\cdot\dfrac{e^u - 1}{u}$ ($u = x\ln 3 \to 0$) $\to \ln 3 \approx 1{,}0986$. (Ugyanígy $\tfrac{2^x - 1}{x} \to \ln 2 \approx 0{,}6931$, a 3.1 táblázata.) A $3$ az alapot veszi határértéknek, az $1$ csak $e$ alapnál igaz, a $0$ a $\tfrac00 = 0$ tévhit.`
        },
        {
          type: "match",
          q: "Párosítsd a határértéket azzal az eszközzel, amellyel a legközvetlenebbül kiszámolható!",
          pairs: [
            [R`$\lim\limits_{x\to 2}\dfrac{x^2 - 4}{x - 2}$`, "szorzattá alakítás"],
            [R`$\lim\limits_{x\to 0}\dfrac{\sqrt{x + 1} - 1}{x}$`, "bővítés a konjugálttal"],
            [R`$\lim\limits_{x\to 0}x^2\cos\dfrac1x$`, "rendőrelv"],
            [R`$\lim\limits_{x\to 0}\dfrac{\sin 5x}{x}$`, "sin u / u → 1"],
            [R`$\lim\limits_{x\to +\infty}\left(1 + \dfrac2x\right)^x$`, "(1 + α/x)^x → e^α"]
          ],
          hint: "Mindegyiknél helyettesíts be előbb: milyen alak jön ki, és mi van a kifejezésben (polinom, gyök, korlátos oszcilláló tényező, szinusz, 1^∞)?",
          explain: R`$\tfrac{(x - 2)(x + 2)}{x - 2} = x + 2 \to 4$; $\tfrac{x}{x(\sqrt{x + 1} + 1)} \to \tfrac12$; $-x^2 \le x^2\cos\tfrac1x \le x^2$, mindkét rendőr 0-hoz tart, így 0; $5\cdot\tfrac{\sin 5x}{5x} \to 5$; $\left(1 + \tfrac2x\right)^x \to e^2 \approx 7{,}389$. A $\cos\tfrac1x$-nek magának nincs határértéke – ezért nem működne a műveleti szabály, csak a rendőrelv („0-hoz tartó szorozva korlátossal”).`
        }
      ]
    },

    /* ------------------------------------------------ 3.5 */
    "an3-35": {
      title: "Kvíz – 3.5 Folytonosság",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Melyik függvény folytonos az $x = 1$ pontban?`,
          options: [
            R`$f(x) = x^2 + 1$, ha $x \lt 1$, és $f(x) = 3x - 1$, ha $x \ge 1$`,
            R`$g(x) = x + 1$, ha $x \ne 1$, és $g(1) = 5$`,
            R`$h(x) = \dfrac{x^2 - 1}{x - 1}$`,
            R`$u(x) = x + 1$, ha $x \lt 1$, és $u(x) = x^2$, ha $x \ge 1$`
          ],
          answer: 0,
          hint: "Mindegyiknél nézd végig a három feltételt: van-e érték a pontban, van-e határérték, és egyenlők-e?",
          explain: R`Az $f$-nél balról $1 + 1 = 2$, jobbról $3 - 1 = 2$, és $f(1) = 2$: mindhárom feltétel teljesül. A $g$-nek van határértéke (2), de $g(1) = 5$ más – a 3. feltétel sérül. A $h$ az 1-ben nincs értelmezve – az 1. feltétel sérül, pedig a határértéke 2. Az $u$ értelmezve van ($u(1) = 1$), de balról 2, jobbról 1: nincs határérték. Tanulság: egyetlen feltétel („van határérték”, „értelmezve van”) sosem elég.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi igaz az $f(x) = \lfloor x\rfloor$ (egészrész) függvényre az $x = 2$ pontban?`,
          options: [
            "Jobbról folytonos, balról nem – tehát nem folytonos.",
            "Balról folytonos, jobbról nem – tehát nem folytonos.",
            R`Folytonos, mert értelmezve van: $\lfloor 2\rfloor = 2$.`,
            "Egyik oldalról sem folytonos."
          ],
          answer: 0,
          hint: R`Számold ki külön $f(2)$-t, a bal oldali és a jobb oldali határértéket. Melyik egyoldali határérték egyezik $f(2)$-vel?`,
          explain: R`$f(2) = 2$. Jobbról ($2 \le x \lt 3$) $\lfloor x\rfloor = 2 = f(2)$: jobbról folytonos. Balról ($1 \le x \lt 2$) az érték 1, és $1 \ne 2$: balról nem folytonos. Folytonossághoz mindkét oldal kell. A „balról folytonos” a két oldal felcserélése (az $x = 2$ a jobb oldali, $[2; 3[$ szakaszhoz „ragad”). Az „értelmezve van, tehát folytonos” a három feltétel közül csak az elsőt nézi.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`Az $|x|$ függvény folytonos a 0-ban.`,
            R`Ha $f$ folytonos az $a$-ban, akkor $\lim\limits_{x\to a} f(x) = f(a)$.`,
            R`Ha a $\lim\limits_{x\to a} f(x)$ véges határérték létezik, akkor $f$ folytonos az $a$-ban.`,
            R`Ha $f$ értelmezve van az $a$-ban, akkor ott folytonos.`,
            "Ha egy függvény folytonos, a grafikonja sima, csúcsmentes."
          ],
          answer: [0, 1],
          hint: "Gondolj a 3.5 ellenpéldáira: egy áthelyezett pont, az egységugrás és az abszolútérték „csúcsa”.",
          explain: R`Igaz: az $|x|$ a 0-ban folytonos (balról $-x \to 0$, jobbról $x \to 0$, és $|0| = 0$), és a folytonosság definíciója éppen $\lim\limits_{x\to a} f(x) = f(a)$. Hamis: a határérték létezése kevés – a $g(x) = x + 1$ ($x \ne 1$), $g(1) = 5$ függvénynek van határértéke az 1-ben, mégsem folytonos. Hamis: az egységugrás a 0-ban értelmezve van, mégsem folytonos. Hamis: „folytonos = sima” – az $|x|$-nek csúcsa van, mégis folytonos; a csúcs a deriválhatóságnak árt (4. fejezet), a folytonosságnak nem.`
        },
        {
          type: "match",
          q: R`Milyen szakadása van a függvénynek az $x = 3$ pontban? Párosítsd!`,
          pairs: [
            [R`$\dfrac{x - 3}{x^2 - 9}$`, "megszüntethető"],
            [R`$\dfrac{x + 3}{x^2 - 9}$`, "végtelen szakadás"],
            [R`$\dfrac{|x - 3|}{x - 3}$`, "ugrás"],
            [R`$\sin\dfrac{1}{x - 3}$`, "oszcilláló"]
          ],
          hint: "Előbb egyszerűsíts, aztán nézd meg a bal és a jobb oldali határértéket! Ugyanaz a nevező még nem jelent ugyanolyan szakadást.",
          explain: R`$\dfrac{x - 3}{x^2 - 9} = \dfrac{1}{x + 3} \to \dfrac16$: véges és a két oldal egyenlő – megszüntethető (lyuk). $\dfrac{x + 3}{x^2 - 9} = \dfrac{1}{x - 3}$: balról $-\infty$, jobbról $+\infty$ – végtelen szakadás („nem nulla per nulla”). $\dfrac{|x - 3|}{x - 3}$: balról $-1$, jobbról $1$ – két különböző véges érték, ugrás. $\sin\dfrac{1}{x - 3}$: a 3 felé végtelen sokszor leng $-1$ és $1$ között, egyoldali határérték sincs – oszcilláló. Az első kettő nevezője azonos, a szakadásuk mégis más: a típus a határértékeken múlik, nem a képleten.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \dfrac{x^2 - 5x + 6}{x - 2}$, ha $x \ne 2$, és $f(2) = c$. Milyen $c$-re folytonos $f$ a 2-ben?`,
          options: [R`$c = -1$`, R`$c = 0$`, R`$c = 1$`, R`$c = 5$`],
          answer: 0,
          hint: R`Megszüntethető szakadás: $f(2)$-nek a határértékkel kell egyeznie. A számláló a 2-ben 0 – melyik gyöktényező emelhető ki?`,
          explain: R`$x^2 - 5x + 6 = (x - 2)(x - 3)$, így $x \ne 2$-re $f(x) = x - 3 \to -1$. Folytonos, ha $c = \lim\limits_{x\to 2} f(x) = -1$ (csereszabály: az $x - 3$ folytonos, és a 2 körül egyenlő $f$-fel). A $0$ és az $1$ a „$\tfrac00 = 0$”, illetve „$\tfrac00 = 1$” tévhit. Az $5$ gyöktényező-előjelhibából jön: ha $(x - 3)$ helyett $(x + 3)$ marad, $2 + 3 = 5$ (visszaszorzással kiderül: $(x - 2)(x + 3) = x^2 + x - 6$).`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x + a$, ha $x \lt 2$; $f(2) = 5$; $f(x) = bx - 1$, ha $x \gt 2$. Milyen $a$, $b$ mellett folytonos $f$ a 2-ben?`,
          options: [
            R`$a = 3$ és $b = 3$`,
            R`minden olyan pár, amelyre $a = 2b - 3$`,
            R`$a = 3$, a $b$ pedig tetszőleges`,
            R`semmilyen: a külön megadott $f(2)$ mindig szakadást okoz`
          ],
          answer: 0,
          hint: R`A csatlakozási pontban három számnak kell egyeznie: bal oldali határérték, jobb oldali határérték és $f(2)$.`,
          explain: R`Bal: $2 + a$; jobb: $2b - 1$; ezeknek $f(2) = 5$-tel kell egyezniük: $2 + a = 5 \Rightarrow a = 3$, $2b - 1 = 5 \Rightarrow b = 3$. Az „$a = 2b - 3$” csak a két ágat teszi egyenlővé, $f(2)$-t elfelejti – így pl. $a = 1$, $b = 2$ mellett van határérték (3), de $f(2) = 5 \ne 3$. Az „$a = 3$, $b$ tetszőleges” csak a bal oldali folytonosságot biztosítja. Az utolsó tévhit: a külön megadott érték nem baj, ha éppen a határértékkel egyezik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hol folytonos az $f(x) = \dfrac{x - 1}{x^2 - 4x + 3}$ függvény?`,
          options: [R`$\mathbb R\setminus\{1; 3\}$`, R`$\mathbb R\setminus\{3\}$`, R`$\mathbb R$`, R`$\mathbb R\setminus\{-1; -3\}$`],
          answer: 0,
          hint: R`A racionális függvény az értelmezési tartományának minden pontjában folytonos. Hol nincs értelmezve? Az egyszerűsítés ezen nem változtat!`,
          explain: R`$x^2 - 4x + 3 = (x - 1)(x - 3)$, a nevező az 1-ben és a 3-ban 0, ott $f$ nincs értelmezve, tehát nem folytonos; máshol folytonos. Az 1-ben megszüntethető szakadás van (egyszerűsítve $\tfrac{1}{x - 3} \to -\tfrac12$), a 3-ban végtelen. Az $\mathbb R\setminus\{3\}$ összekeveri az eredeti függvényt az egyszerűsített $\tfrac{1}{x - 3}$-mal – a lyuk egyszerűsítés után is megmarad. Az $\mathbb R$ elfelejti a nevezőt, a $\{-1; -3\}$ pedig gyöktényező-előjelhiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két függvény, $f$ és $g$, a 0-ban nem folytonos. Mit mondhatsz az $f + g$ összegről a 0-ban?`,
          options: [
            "Lehet folytonos, és lehet nem folytonos is – a tétel ilyenkor semmit sem mond.",
            "Biztosan nem folytonos.",
            "Biztosan folytonos, mert a szakadások kioltják egymást.",
            "Csak akkor lehet folytonos, ha mindkettőnek megszüntethető szakadása van."
          ],
          answer: 0,
          hint: R`A műveleti tétel csak egy irányt mond: folytonosból folytonos. Próbáld ki $f = \operatorname{sgn} x$-szel és két különböző $g$-vel!`,
          explain: R`$\operatorname{sgn} x + (-\operatorname{sgn} x) = 0$ – állandó, tehát folytonos, pedig mindkét tag ugrik a 0-ban. Viszont $\operatorname{sgn} x + \operatorname{sgn} x = 2\operatorname{sgn} x$ nem folytonos. Tehát mindkét eset előfordulhat. A „biztosan nem” a tétel megfordítása (a tétel csak azt mondja, hogy folytonosak összege folytonos). A „kioltják egymást” csak szerencsés esetben igaz. Az utolsó opció hamis: a példában ugrások oltották ki egymást.`
        }
      ]
    },

    /* ------------------------------------------------ 3.6 */
    "an3-36": {
      title: "Kvíz – 3.6 Folytonos függvények tételei zárt intervallumon",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$f(x) = x^3 - 2x - 5$. Melyik intervallumban garantál gyököt a Bolzano-tétel?`,
          options: [R`$[2; 3]$`, R`$[1; 2]$`, R`$[0; 1]$`, R`$[3; 4]$`],
          answer: 0,
          hint: "Számold ki a függvényértéket a 0, 1, 2, 3, 4 helyeken, és keresd az előjelváltást!",
          explain: R`$f(0) = -5$, $f(1) = -6$, $f(2) = -1$, $f(3) = 16$, $f(4) = 51$. Előjelváltás csak a $[2; 3]$-on van ($f(2)\cdot f(3) \lt 0$), és a polinom folytonos – Bolzano: van gyök a $]2; 3[$-ban. A többi intervallum végpontjaiban azonos az előjel, ott a tétel <em>semmit sem mond</em> (nem azt mondja, hogy nincs gyök – itt csak véletlenül nincs).`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`Ha $f$ folytonos a $[a; b]$-n és $f(a)\cdot f(b) \lt 0$, akkor van $c \in\ ]a; b[$, amelyre $f(c) = 0$.`,
            R`Ha $f(a)$ és $f(b)$ azonos előjelű, akkor $f$-nek nincs gyöke a $[a; b]$-n.`,
            R`Az $\tfrac1x$ a $[-1; 1]$ végpontjaiban ellentétes előjelű, és mégsincs gyöke – mert a 0-ban nem folytonos.`,
            "A Bolzano-tétel azt is megmondja, hány gyök van az intervallumban.",
            "Minden páratlan fokú polinomnak van valós gyöke."
          ],
          answer: [0, 2, 4],
          hint: "Melyik a tétel feltétele, és mit állít pontosan? Gondolj a fordított irányra és a folytonosság szerepére is!",
          explain: R`Igaz a tétel maga, igaz az $\tfrac1x$-es ellenpélda (a feltétel – folytonosság – sérül, és a tétel állítása is), és igaz a páratlan fokú polinomokról szóló állítás (a két végtelenben ellentétes előjelű, Bolzano ad gyököt). Hamis a fordított irány: $x^2 - 1$ a $[-2; 2]$-n, $f(\pm2) = 3$, mégis van két gyöke ($\pm1$). Hamis, hogy a tétel megmondja a gyökök számát: csak azt mondja, hogy <em>van</em>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $x^2 - 3 = 0$ gyökét keressük intervallumfelezéssel az $[1; 2]$-ből. Két felezés után melyik intervallumban van a gyök?`,
          options: [R`$[1{,}5; 1{,}75]$`, R`$[1{,}75; 2]$`, R`$[1{,}25; 1{,}5]$`, R`$[1{,}5; 2]$`],
          answer: 0,
          hint: "Minden lépésben azt a felet tartsd meg, amelynek a végpontjaiban az előjel különböző. Hány felezés kell?",
          explain: R`$f(1) = -2 \lt 0$, $f(2) = 1 \gt 0$. 1. lépés: $f(1{,}5) = -0{,}75 \lt 0$, az előjelváltás a $[1{,}5; 2]$-n van. 2. lépés: $f(1{,}75) = 0{,}0625 \gt 0$, tehát $[1{,}5; 1{,}75]$ (valóban: $\sqrt3 \approx 1{,}732$). A $[1{,}75; 2]$ a rossz fél (ott $f(1{,}75)$ és $f(2)$ is pozitív), a $[1{,}25; 1{,}5]$ már az első lépésben a rossz felet tartja meg, a $[1{,}5; 2]$ pedig csak egy felezés eredménye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány felezés kell a $[0; 2]$ intervallumból indulva, hogy az intervallum hossza $0{,}01$ alá csökkenjen?`,
          options: ["8", "7", "9", "200"],
          answer: 0,
          hint: R`$n$ lépés után a hossz $\dfrac{b - a}{2^n}$. Itt $b - a = 2$ – ne felejtsd ki!`,
          explain: R`$\dfrac{2}{2^n} \lt 0{,}01 \iff 2^n \gt 200$. $2^7 = 128$ kevés, $2^8 = 256$ elég: 8 lépés. A 7 akkor jön ki, ha az intervallum hosszát 1-nek veszed ($2^n \gt 100$). A 9 eggyel elcsúszott lépésszám (a $2^8 = 256 \gt 200$-at is kevésnek gondolni). A 200 a $2^n \gt 200$ egyenlőtlenség jobb oldala – az nem a lépések száma, hanem a $2^n$-é.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $f(x) = x^2$ folytonos a $[-1; 3]$-on, $f(-1) = 1$ és $f(3) = 9$. Mit garantál a Darboux-tétel?`,
          options: [
            "Minden 1 és 9 közötti értéket felvesz a [−1; 3]-on.",
            "Csak az 1 és 9 közötti értékeket veszi fel, más értéket nem.",
            "Semmit: a tétel csak a 0 felvételéről szól.",
            R`Semmit, mert az $x^2$ a $[-1; 3]$-on nem monoton.`
          ],
          answer: 0,
          hint: R`A Darboux-tétel feltétele csak a folytonosság. Mit mond, és mit <em>nem</em> mond az $f(a)$ és $f(b)$ közötti értékeken kívüliekről?`,
          explain: R`Darboux: folytonos függvény minden $f(a)$ és $f(b)$ közötti értéket felvesz – itt minden $d \in [1; 9]$-et. A „csak ezeket” hamis: az $x^2$ a 0-t is felveszi ($x = 0$), sőt az értékkészlete $[0; 9]$. A tétel nem csak a 0-ról szól – az a Bolzano-tétel, amelyből a $g(x) = f(x) - d$ eltolással kapjuk. A monotonitás nem feltétel.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik esetben garantálja a Weierstrass-tétel, hogy a függvénynek van legnagyobb értéke?",
          options: [
            R`$\sqrt{x + 1}$ a $[0; 8]$-on`,
            R`$x^2$ a $]-1; 2[$-n`,
            R`$e^x$ az $\mathbb R$-en`,
            R`$f(x) = \tfrac1x$ ($x \ne 0$), $f(0) = 0$ a $[-1; 1]$-en`
          ],
          answer: 0,
          hint: "Három feltétel kell egyszerre: folytonos függvény, zárt és korlátos intervallum. Melyiknél teljesül mind?",
          explain: R`A $\sqrt{x + 1}$ folytonos a zárt, korlátos $[0; 8]$-on: van max ($\sqrt9 = 3$) és min ($1$). Az $x^2$ a nyílt $]-1; 2[$-n nem éri el a 4-et – nincs maximuma. Az $e^x$ az $\mathbb R$-en folytonos, de az intervallum nem korlátos – se max, se min. Az utolsó függvény a 0-ban nem folytonos, és nem is korlátos a $[-1; 1]$-en.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = x^2 - 4x$ értékkészlete a $[0; 5]$ intervallumon?`,
          options: [R`$[-4; 5]$`, R`$[0; 5]$`, R`$]-4; 5[$`, R`$[-4; +\infty[$`],
          answer: 0,
          hint: R`Weierstrass + Darboux: a kép a $[\min; \max]$ intervallum. A szélsőértéket ne csak a végpontokban keresd – alakítsd teljes négyzetté!`,
          explain: R`$f(x) = (x - 2)^2 - 4$: a minimum $f(2) = -4$; a végpontok $f(0) = 0$, $f(5) = 5$, így a maximum 5. Folytonos függvény zárt intervallumon felveszi a minimumát és a maximumát, és közöttük mindent: a kép $[-4; 5]$. A $[0; 5]$ csak a végpontok közötti értékeket nézi („Darboux csak a köztes értékeket” tévhit). A $]-4; 5[$ azt hiszi, a szélsőértékeket nem veszi fel – zárt intervallumon felveszi. A $[-4; +\infty[$ elfelejti, hogy csak a $[0; 5]$-ön vizsgálunk.`
        }
      ]
    },

    /* ------------------------------------------------ 3.7 */
    "an3-37": {
      title: "Kvíz – 3.7 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A víz modellje: $V(T) = 1000 + 0{,}0075\,(T - 4)^2$ cm³ ($T \ge 0$). 20 °C körül a bal oldali sávhatár $19{,}578$ °C, a jobb oldali $20{,}411$ °C (ha $\varepsilon = 0{,}1$ cm³). Mekkora a jó $\delta$?`,
          options: [R`$\delta \approx 0{,}41$ °C`, R`$\delta \approx 0{,}42$ °C`, R`$\delta \approx 3{,}65$ °C`, R`$\delta \approx 13{,}33$ °C`],
          answer: 0,
          hint: R`Az ablak a 20 körül szimmetrikus ($|T - 20| \lt \delta$), és az ablak <em>minden</em> pontjában jónak kell lennie. Melyik oldal a szűkebb?`,
          explain: R`Jobbra $20{,}411 - 20 = 0{,}411$, balra $20 - 19{,}578 = 0{,}422$ hely van. A szimmetrikus ablaknak mindkét oldalon bele kell férnie, ezért a <b>kisebbik</b> távolság a jó: $\delta \approx 0{,}41$ °C. A $0{,}42$ a nagyobbik oldal – ekkor az ablak jobb szélén a hiba már $0{,}1$ fölött van. A $3{,}65$ a 4 °C-hoz tartozó $\delta$ – de $\delta$ a ponttól is függ. A $13{,}33 = \tfrac{0{,}1}{0{,}0075}$ a $(T - 4)^2$ megengedett növekménye, nem hőmérséklet-eltérés.`
        },
        {
          type: "single", shuffle: true,
          q: R`A modellben a jég térfogata 1091 cm³ ($T \lt 0$), a 0 °C-os vízé $V(0) = 1000{,}12$ cm³. Miért nem segít 0 °C-on még egy $\pm0{,}001$ °C-os hőmérő sem?`,
          options: [
            "Mert V-nek a 0-ban ugrása van: a mért 0,000 °C mellett a hiba akár 90,88 cm³ is lehet.",
            "Mert V a 0 °C-ban nincs értelmezve.",
            "Mert 0 °C körül V nagyon meredek – egy még pontosabb hőmérő már elég lenne.",
            "Segít: elég pontos hőmérővel itt is tetszőlegesen kicsi a térfogat hibája."
          ],
          answer: 0,
          hint: "Nézd meg a bal és a jobb oldali határértéket a 0-ban! Folytonos-e ott V?",
          explain: R`$\lim\limits_{T\to 0-} V(T) = 1091$, $\lim\limits_{T\to 0+} V(T) = V(0) = 1000{,}12$: ugrás, a különbség $90{,}88$ cm³. Akármilyen kicsi $\delta$-ablakban van jég és víz is, ezért egyetlen $\delta$ sem jó az $\varepsilon = 0{,}1$-hez – a 0-ban $V$ nem folytonos. $V(0)$ értelmezve van (a víz ágon), tehát nem ez a gond. A „meredek” függvénynél kisebb $\delta$ segítene – szakadásnál semmilyen $\delta$ sem segít; ez a különbség a meredekség és a szakadás között.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a modellben 4 °C-on mekkora $\delta$ kell, ha a térfogat hibája legfeljebb $\varepsilon = 0{,}03$ cm³ lehet?`,
          options: [R`$\delta = 2$ °C`, R`$\delta = 4$ °C`, R`$\delta \approx 0{,}17$ °C`, R`$\delta = 0{,}03$ °C`],
          answer: 0,
          hint: R`$V(4) = 1000$, és $|V(T) - V(4)| = 0{,}0075\,(T - 4)^2$. Oldd meg a $0{,}0075\,(T - 4)^2 \lt 0{,}03$ egyenlőtlenséget!`,
          explain: R`$(T - 4)^2 \lt \tfrac{0{,}03}{0{,}0075} = 4 \iff |T - 4| \lt 2$: $\delta = 2$ °C. A 4 °C a $(T - 4)^2$ korlátja – kimaradt a gyökvonás. A $0{,}17$ °C-nál kimaradt a $0{,}0075$-ös szorzó: $(T - 4)^2 \lt 0{,}03$, $\sqrt{0{,}03} \approx 0{,}17$. A $0{,}03$ °C a „$\delta = \varepsilon$” tévhit: a 4 °C körül a függvény lapos, ezért itt nagyon pontatlan hőmérő is elég.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy bank 1 millió Ft-ot ad, és 3 évig évi 370 000 Ft-ot kér vissza. Mekkora az éves kamatláb?",
          options: ["kb. 5,41%", "11%", "kb. 3,67%", "10%"],
          answer: 0,
          hint: "A kamat csak a még fennálló tartozásra jár, és a tartozás évről évre csökken. Az egyenletet nem tudod p-re kifejezni – mit mond Bolzano és a felezés?",
          explain: R`Az $F(p) = 370\,000\cdot\dfrac{q^3 - 1}{q^3(q - 1)} - 1\,000\,000$ ($q = 1 + \tfrac{p}{100}$) folytonos, $F(1) \gt 0$, $F(9) \lt 0$: van gyök, felezéssel $p \approx 5{,}41\%$. A 11% a „$3 \cdot 370\,000 = 1{,}11$ millió” egyszerű osztás – de a tőke folyamatosan csökken. A $3{,}67\% = \tfrac{11\%}{3}$ ugyanez a hiba évekre osztva. A 10% a 2.7 hitele, ott a részlet $402\,115$ Ft volt – a kisebb részlethez kisebb kamatláb tartozik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az előző hitelnél $F(1) \approx 88\,165 \gt 0$, $F(9) \approx -63\,421 \lt 0$, és a felezőpontban $F(5) \approx 7\,602$. Melyik intervallumban folytatod a felezést?`,
          options: [R`$[5; 9]$`, R`$[1; 5]$`, R`$[1; 9]$`, R`$[5; 7]$`],
          answer: 0,
          hint: "Melyik félen van előjelváltás?",
          explain: R`$F(5) \gt 0$ és $F(9) \lt 0$: az előjelváltás a $[5; 9]$-en van, ott van a gyök. Az $[1; 5]$ a rossz fél – ott $F(1)$ és $F(5)$ is pozitív. Az $[1; 9]$-nél elmaradt a felezés. Az $[5; 7]$ már a következő lépés eredménye, amihez $F(7) \approx -29\,003$ kell – azt még nem számoltuk ki.`
        },
        {
          type: "match",
          q: R`Parkolás: $P(t) = 400\cdot\lceil t\rceil$ Ft (minden megkezdett óra 400 Ft). Párosítsd!`,
          pairs: [
            [R`$P(0{,}3)$`, "400 Ft"],
            [R`$P(2)$`, "800 Ft"],
            [R`$\lim\limits_{t\to 2+} P(t)$`, "1200 Ft"],
            [R`$\lim\limits_{t\to 3+} P(t)$`, "1600 Ft"]
          ],
          hint: R`$\lceil t\rceil$ a felfelé kerekítés: az egész számot nem változtatja, a 2-nél kicsit nagyobb számot 3-ra kerekíti.`,
          explain: R`$\lceil 0{,}3\rceil = 1$: 400 Ft. $\lceil 2\rceil = 2$: 800 Ft. Ha $t \to 2+$, akkor $\lceil t\rceil = 3$: 1200 Ft; ha $t \to 3+$, akkor 4: 1600 Ft. Balról viszont $\lim\limits_{t\to 2-} P(t) = 800 = P(2)$: az egész helyeken ugrás van (400 Ft-tal), és a függvény <b>balról</b> folytonos. Két egész között $P$ állandó, ott folytonos.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x, y) = \dfrac{xy}{x^2 + y^2}$. Mihez tart $f$, ha a $(0; 0)$-hoz az $y = 2x$ egyenes mentén közelítünk?`,
          options: [R`$\tfrac25$`, R`$\tfrac12$`, R`$2$`, R`$0$`],
          answer: 0,
          hint: R`Helyettesíts $y = 2x$-et, emelj ki $x^2$-et a számlálóból és a nevezőből is!`,
          explain: R`$f(x, 2x) = \dfrac{2x^2}{x^2 + 4x^2} = \dfrac{2}{5}$ minden $x \ne 0$-ra (általában $\tfrac{m}{1 + m^2}$, itt $m = 2$). Az $\tfrac12$ az $y = x$ átlóhoz tartozik, a $0$ az $x$ tengelyhez (vagy a „$\tfrac00 = 0$” tévhit), a $2$ magának a meredekségnek a beírása. Mivel a különböző irányok más-más értéket adnak, a $(0; 0)$-ban nincs határérték.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "an3-final": {
      title: "Fejezetzáró teszt – 3. Függvények határértéke és folytonossága",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \sin\dfrac{\pi}{x}$ értéke $x = 1;\ 0{,}1;\ 0{,}01;\ 0{,}001$-re mind 0. Mi következik ebből a $\lim\limits_{x\to 0} f(x)$-re?`,
          options: [
            R`Semmi biztos – sőt, az $x = \tfrac{2}{4n + 1}$ pontokban $f = 1$, ezért nincs határérték.`,
            "A határérték 0, mert a táblázat minden értéke 0.",
            R`A határérték 0, mert behelyettesítve $\sin 0 = 0$.`,
            R`A 0-ban $f$ nincs értelmezve, ezért ott határértéket keresni értelmetlen.`
          ],
          answer: 0,
          hint: "Egy-két jól választott pont (vagy egy jó sorozat) bizonyít-e határértéket? Mit mond az átviteli elv a „minden sorozatra” kikötésről?",
          explain: R`Az $x_n = \tfrac1n$ sorozatra $\sin(n\pi) = 0 \to 0$, az $y_n = \tfrac{2}{4n + 1}$ sorozatra $\sin\left(2n\pi + \tfrac\pi2\right) = 1 \to 1$. Két 0-hoz tartó sorozat, különböző képhatárérték: nincs határérték. A táblázat csak sejtés – „egy jó sorozat” nem bizonyíték. A $\sin 0$ behelyettesítés hibás: $x \to 0$ esetén $\tfrac{\pi}{x} \to \pm\infty$, nem 0. Az értelmezetlenség pedig nem akadály: a $\tfrac{x^2 - 1}{x - 1}$-nek az 1-ben van határértéke, pedig ott sincs értelmezve.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to 1}(4x - 3) = 1$. Mekkora $\delta$ jó $\varepsilon = 0{,}02$-höz (a legnagyobb ilyen)?`,
          options: [R`$0{,}005$`, R`$0{,}08$`, R`$0{,}02$`, R`$0{,}01$`],
          answer: 0,
          hint: R`Írd fel $|f(x) - 1|$-et $|x - 1|$ segítségével. Hányszorosára nagyítja a függvény az eltérést?`,
          explain: R`$|4x - 3 - 1| = 4|x - 1| \lt 0{,}02 \iff |x - 1| \lt 0{,}005$: $\delta = \tfrac{\varepsilon}{4} = 0{,}005$. A $0{,}08 = 4\varepsilon$ fordítva számol (a meredekség szűkíti az ablakot, nem tágítja). A $0{,}02$ a „$\delta = \varepsilon$” tévhit, a $0{,}01 = \tfrac\varepsilon2$ a $2x + 1$ példájának meredekségével számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\lim\limits_{x\to 2-}\lfloor x\rfloor + \lim\limits_{x\to 2+}\lfloor x\rfloor$?`,
          options: ["3", "4", "2", "nem létezik"],
          answer: 0,
          hint: R`Külön-külön számold ki a két egyoldali határértéket! Melyik egész szám a $\lfloor x\rfloor$, ha $x$ kicsivel kisebb, illetve nagyobb 2-nél?`,
          explain: R`Ha $1 \le x \lt 2$, akkor $\lfloor x\rfloor = 1$; ha $2 \le x \lt 3$, akkor 2. Az összeg $1 + 2 = 3$. A 4 mindkét oldalra $f(2) = 2$-t ír (a határérték nem a helyettesítési érték). A 2 mindkét oldalon 1-gyel számol. A „nem létezik” összekeveri a kérdést a kétoldali határértékkel: az valóban nem létezik, de a két <em>egyoldali</em> létezik, és ezeket adjuk össze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mik az $f(x) = \dfrac{x^2 - 4}{x^2 - 3x + 2}$ függvény lyukai és aszimptotái?`,
          options: [
            R`lyuk az $x = 2$-ben; függőleges aszimptota: $x = 1$; vízszintes: $y = 1$`,
            R`függőleges aszimptoták: $x = 1$ és $x = 2$; vízszintes: $y = 1$`,
            R`lyuk az $x = 2$-ben; függőleges aszimptota: $x = 1$; vízszintes: $y = -2$`,
            R`lyuk az $x = -2$-ben; függőleges aszimptota: $x = -1$; vízszintes: $y = 1$`
          ],
          answer: 0,
          hint: "Bonts szorzattá a számlálót és a nevezőt is! A közös tényező lyukat ad, a megmaradó nevező-gyök aszimptotát. A végtelenben a főegyütthatók döntenek.",
          explain: R`$\dfrac{(x - 2)(x + 2)}{(x - 1)(x - 2)} = \dfrac{x + 2}{x - 1}$ ($x \ne 2$). A 2-ben lyuk (értéke $\tfrac41 = 4$), az 1-ben a nevező 0 marad, a számláló 3: függőleges aszimptota. Azonos fok, a főegyütthatók hányadosa $\tfrac11$: $y = 1$. A második opcióban elmaradt az egyszerűsítés, a harmadikban a konstans tagok hányadosa ($\tfrac{-4}{2}$) került a főegyütthatók helyére, a negyedikben gyöktényező-előjelhiba van.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to -\infty}\dfrac{2x^4 - x}{3x^3 + 1} = ?$`,
          options: [R`$-\infty$`, R`$+\infty$`, R`$\tfrac23$`, R`$0$`],
          answer: 0,
          hint: R`Mihez hasonlít a tört nagy $|x|$-re? Írd fel a $\tfrac{a_k}{b_m}x^{k - m}$ alakot, és figyelj: $x$ negatív!`,
          explain: R`A tört úgy viselkedik, mint $\dfrac{2x^4}{3x^3} = \dfrac23x$. Ha $x \to -\infty$, akkor $\tfrac23x \to -\infty$ (a fokkülönbség 1, páratlan, ezért a $-\infty$-ben előjelet vált). A $+\infty$ ez az előjelhiba (csak a $+\infty$ irányt nézi). A $\tfrac23$ a főegyütthatók hányadosa, de az csak azonos fokú számlálónál és nevezőnél határérték. A $0$ a konstans tagokból jön ($\tfrac01$) – a végtelenben a legnagyobb hatványok döntenek.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $f(x) = \dfrac{x^2 + 3x + 1}{x + 1}$ ferde aszimptotája?`,
          options: [R`$y = x + 2$`, R`$y = x + 3$`, R`$y = x$`, R`$y = 1$`],
          answer: 0,
          hint: "Végezd el a polinomosztást, és ellenőrizd visszaszorzással! A maradéktört a végtelenben 0-hoz tart.",
          explain: R`$x^2 + 3x + 1 = (x + 1)(x + 2) - 1$, így $f(x) = x + 2 - \tfrac{1}{x + 1}$, és $f(x) - (x + 2) \to 0$: az aszimptota $y = x + 2$. Az $y = x + 3$ a tagonkénti „egyszerűsítésből” jön ($\tfrac{x^2}{x} + \tfrac{3x}{x}$, mintha a nevező csak $x$ lenne). Az $y = x$ csak a főtagokat ($\tfrac{x^2}{x}$) nézi, a $b$-t elhagyja. Az $y = 1$ vízszintes aszimptotának gondolja – de a számláló foka eggyel nagyobb, a függvény a végtelenbe tart.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to -\infty}\dfrac{3x}{\sqrt{x^2 + 4}} = ?$`,
          options: [R`$-3$`, R`$3$`, R`$0$`, R`$-1$`],
          answer: 0,
          hint: R`Emelj ki $|x|$-et a gyök alól. Mennyi $\sqrt{x^2}$, ha $x$ negatív?`,
          explain: R`$x \lt 0$ esetén $\sqrt{x^2 + 4} = |x|\sqrt{1 + \tfrac4{x^2}} = -x\sqrt{1 + \tfrac4{x^2}}$, így a tört $\dfrac{3x}{-x\sqrt{1 + 4/x^2}} = \dfrac{-3}{\sqrt{1 + 4/x^2}} \to -3$. A $3$ a $\sqrt{x^2} = x$ hiba (az csak $+\infty$-ben jó). A $0$ a „számláló per nagy nevező” elhamarkodott olvasata – a fokok itt egyenlők. A $-1$ az $\tfrac{x}{\sqrt{x^2 + 1}}$ bemagolt eredménye, a 3-as szorzó nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim\limits_{x\to +\infty}\left(\dfrac{x + 3}{x + 1}\right)^{2x} = ?$`,
          options: [R`$e^4$`, R`$1$`, R`$e^2$`, R`$e^6$`],
          answer: 0,
          hint: R`$1^\infty$ alak. Írd az alapot $1 + \tfrac{r}{p(x)}$ alakba egészrész-kiemeléssel, a kitevőt pedig $p(x)\cdot\tfrac{q(x)}{p(x)}$ alakba!`,
          explain: R`$\dfrac{x + 3}{x + 1} = 1 + \dfrac{2}{x + 1}$, $r = 2$, $p(x) = x + 1$. A kitevő $(x + 1)\cdot\dfrac{2x}{x + 1}$, és $\dfrac{2x}{x + 1} \to 2 = s$. A határérték $e^{rs} = e^{2\cdot2} = e^4 \approx 54{,}6$. Az $1$ az „$1^\infty = 1$” tévhit. Az $e^2$-nél kimaradt a kitevő-arány ($s = 2$). Az $e^6$ az $r$ helyett a számláló konstans tagjával (3) számol.`
        },
        {
          type: "match",
          q: "Párosítsd a határértékeket az értékükkel!",
          pairs: [
            [R`$\lim\limits_{x\to 0}\dfrac{\sin 5x}{x}$`, "5"],
            [R`$\lim\limits_{x\to +\infty}\dfrac{\sin x}{x}$`, "0"],
            [R`$\lim\limits_{x\to 0}\dfrac{e^{2x} - 1}{x}$`, "2"],
            [R`$\lim\limits_{x\to 0}\dfrac{\ln(1 + x)}{x}$`, "1"],
            [R`$\lim\limits_{x\to 0}\dfrac{3^x - 1}{x}$`, "ln 3"]
          ],
          hint: R`A nevezetes határértékeknél az argumentum és a nevező legyen ugyanaz – ha kell, bővíts! És figyeld, hová tart $x$: a 0-hoz vagy a végtelenbe?`,
          explain: R`$\tfrac{\sin 5x}{x} = 5\cdot\tfrac{\sin 5x}{5x} \to 5$ (nem 1!). A végtelenben $\left|\tfrac{\sin x}{x}\right| \le \tfrac1x \to 0$ – a $\tfrac{\sin x}{x} \to 1$ csak a 0-ban igaz. $\tfrac{e^{2x} - 1}{x} = 2\cdot\tfrac{e^{2x} - 1}{2x} \to 2$. $\tfrac{\ln(1 + x)}{x} \to 1$ (nevezetes). $3^x = e^{x\ln 3}$, így $\tfrac{3^x - 1}{x} \to \ln 3 \approx 1{,}0986$ – nem 3 és nem 1.`
        },
        {
          type: "single", shuffle: true,
          q: R`Milyen szakadása van az $f(x) = \dfrac{\sin x}{|x|}$ függvénynek a 0-ban?`,
          options: ["ugrás", "megszüntethető", "végtelen szakadás", "oszcilláló"],
          answer: 0,
          hint: R`Bontsd két esetre: $x \gt 0$ és $x \lt 0$. Mivel egyenlő ott $|x|$?`,
          explain: R`$x \gt 0$: $\tfrac{\sin x}{x} \to 1$. $x \lt 0$: $\tfrac{\sin x}{-x} \to -1$. Két különböző véges egyoldali határérték: ugrás (elsőfajú), folytonossá nem tehető. A „megszüntethető” csak a jobb oldalt nézi ($\tfrac{\sin x}{x} \to 1$) – az $|x|$ előjelét elfelejti. A „végtelen” a $\tfrac{\ldots}{0}$ látványából jön, de a számláló is 0-hoz tart ($\tfrac00$). Oszcilláló nincs: mindkét egyoldali határérték létezik.`
        },
        {
          type: "single", shuffle: true,
          q: R`$f(x) = \dfrac{\sin(kx)}{2x}$, ha $x \ne 0$, és $f(0) = 3$. Milyen $k$-ra folytonos $f$ a 0-ban?`,
          options: [R`$k = 6$`, R`$k = 3$`, R`$k = \tfrac32$`, R`nincs ilyen $k$, mert $\tfrac{\sin kx}{2x} \to \tfrac12$`],
          answer: 0,
          hint: R`Számold ki a határértéket $k$-val: bővíts úgy, hogy a szinusz argumentuma és a nevező megegyezzen. Utána tedd egyenlővé $f(0)$-val!`,
          explain: R`$\dfrac{\sin kx}{2x} = \dfrac{k}{2}\cdot\dfrac{\sin kx}{kx} \to \dfrac k2$ ($k \ne 0$). Folytonosság: $\tfrac k2 = 3$, $k = 6$. A $k = 3$-nál elmaradt a nevező 2-es szorzója ($\tfrac{\sin kx}{x} \to k$). A $\tfrac32$ fordítva szoroz ($\tfrac{k}{2}$ helyett $2k = 3$). Az utolsó a „$\tfrac{\sin 3x}{x} \to 1$” típusú hiba: a $\tfrac{\sin u}{u} \to 1$ csak azonos argumentumra igaz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány felezés kell az $[1; 3]$ intervallumból indulva, hogy a gyököt tartalmazó intervallum hossza $0{,}001$ alá csökkenjen?`,
          options: ["11", "10", "12", "9"],
          answer: 0,
          hint: R`$\dfrac{b - a}{2^n} \lt h$. Mennyi itt $b - a$? Keresd meg az első elég nagy kettőhatványt!`,
          explain: R`$\dfrac{2}{2^n} \lt 0{,}001 \iff 2^n \gt 2000$. $2^{10} = 1024$ kevés, $2^{11} = 2048$ elég: 11 lépés. A 10 az 1 hosszú intervallum receptje ($2^{10} \gt 1000$) – itt az intervallum 2 hosszú. A 12 eggyel túllő ($2^{12} = 4096$ is jó, de nem ez a legkevesebb). A 9-nél $2^9 = 512 \lt 2000$ – kevés.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz?",
          options: [
            R`A $\cos x - x$ a $\left[0; \tfrac\pi2\right]$ végpontjaiban ellentétes előjelű, ezért van ott gyöke.`,
            R`Ha $f$ folytonos a $]0; 1[$ nyílt intervallumon, akkor van legnagyobb értéke.`,
            R`Az $x^2$ a $[-1; 2]$-n csak az 1 és 4 közötti értékeket veszi fel.`,
            R`Folytonos függvény a $[a; b]$-t a $[\min; \max]$ intervallumra képezi.`,
            R`A $\operatorname{sgn} x$-nek nincs gyöke a $[-1; 1]$-en, mert nem folytonos.`
          ],
          answer: [0, 3],
          hint: "Melyik tételnek mi a feltétele (folytonosság, zárt intervallum)? És ha a feltétel nem teljesül, következik-e, hogy az állítás hamis?",
          explain: R`Igaz: $\cos 0 - 0 = 1 \gt 0$, $\cos\tfrac\pi2 - \tfrac\pi2 = -\tfrac\pi2 \lt 0$, a függvény folytonos – Bolzano (a gyök $\approx 0{,}739$). Igaz: Weierstrass szerint van min és max, Darboux szerint közöttük mindent felvesz. Hamis: nyílt intervallumon nincs garancia – az $x$ a $]0; 1[$-en nem veszi fel a maximumát. Hamis: Darboux nem mondja, hogy <em>csak</em> a köztes értékeket – az $x^2$ a 0-t is felveszi. Hamis: a $\operatorname{sgn} x$-re a tétel nem alkalmazható, de gyöke van: $\operatorname{sgn} 0 = 0$ (a feltétel elégséges, nem szükséges).`
        },
        {
          type: "single", shuffle: true,
          q: R`A víz modelljében $\varepsilon = 0{,}1$ cm³-hez 20 °C-on $\delta \approx 0{,}41$ °C, 4 °C-on $\delta \approx 3{,}65$ °C kell. Mit mutat ez?`,
          options: [
            R`A folytonosság definíciójában $\delta$ nemcsak az $\varepsilon$-tól, hanem a ponttól is függhet.`,
            "Az egyik számolás hibás: ugyanahhoz az ε-hoz mindenhol ugyanaz a δ tartozik.",
            "A 4 °C-ban a függvény nem folytonos, ezért ott más a δ.",
            R`A kisebb $\delta$ a jobb: 4 °C-on is elég lenne $\delta = 0{,}41$, a $3{,}65$ felesleges.`
          ],
          answer: 0,
          hint: R`Hol meredek és hol lapos a $V(T) = 1000 + 0{,}0075\,(T - 4)^2$ grafikonja? Mit mond a definíció: $\delta$-t mikor és mi alapján választjuk?`,
          explain: R`A 4 °C-ban $V$-nek minimuma van, a grafikon lapos: nagy hőmérséklet-eltérés is csak kis térfogathibát okoz. 20 °C-on meredekebb, ott kisebb $\delta$ kell. A definíció minden pontban külön mondja ki: „minden $\varepsilon$-hoz van $\delta$” – és ez a $\delta$ pontonként más lehet. Nem kell, hogy egy $\delta$ mindenhol jó legyen. A 4 °C-ban $V$ folytonos (polinom), tehát nem szakadás okozza a különbséget. A $0{,}41$ 4 °C-on is <em>jó</em> volna, de a kérdés az, hogy mennyire pontatlan hőmérő elég – ott sokkal pontatlanabb is.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
