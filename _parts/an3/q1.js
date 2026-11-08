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
