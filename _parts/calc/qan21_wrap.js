(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 2.1 */
    "an2-21": {
      title: "Kvíz – 2.1 Mi az a sorozat?",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$a_n = n^2 + 3$. Melyik az $a_{n+1}$?`,
          options: [R`$n^2 + 2n + 4$`, R`$n^2 + 4$`, R`$n^2 + n + 4$`, R`$n^2 + 2n + 1$`],
          answer: 0,
          hint: R`Az $a_{n+1}$ a következő tag: a képletben az $n$ helyére írj $(n + 1)$-et – zárójellel!`,
          explain: R`$a_{n+1} = (n + 1)^2 + 3 = n^2 + 2n + 1 + 3 = n^2 + 2n + 4$. Az $n^2 + 4$ az $a_n + 1$ – a leggyakoribb tévedés, hogy a „következő tag” helyett a taghoz adunk 1-et. Az $n^2 + n + 4$ a rossz kifejtésből jön ($(n + 1)^2 \ne n^2 + n + 1$), az $n^2 + 2n + 1$-ből pedig kimaradt a $+3$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi az $a_n = \dfrac{(-1)^{n+1}}{n^2}$ sorozat negyedik tagja?`,
          options: [R`$-\tfrac1{16}$`, R`$\tfrac1{16}$`, R`$-\tfrac18$`, R`$\tfrac1{25}$`],
          answer: 0,
          hint: R`Írd be az $n = 4$-et mindkét helyre. Páros vagy páratlan a $(-1)$ kitevője?`,
          explain: R`$a_4 = \dfrac{(-1)^5}{4^2} = \dfrac{-1}{16}$. Az $\tfrac1{16}$ az előjel elvesztése (a kitevő $n + 1 = 5$ páratlan!), a $-\tfrac18$ az $n^2$ helyett $2n$-nel számol, az $\tfrac1{25}$ pedig már az ötödik tag – elcsúszott index.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_1 = 2$, $a_{n+1} = 3a_n - 1$. Mennyi $a_4$?`,
          options: [R`$41$`, R`$14$`, R`$122$`, R`$15$`],
          answer: 0,
          hint: "Rekurzió: lépésenként haladj, mindig az előző tagból számolj. Számold meg, hány lépés kell az 1. tagtól a 4.-ig!",
          explain: R`$a_2 = 3\cdot2 - 1 = 5$, $a_3 = 3\cdot5 - 1 = 14$, $a_4 = 3\cdot14 - 1 = 41$. A $14$ csak $a_3$, a $122$ már $a_5$ (eggyel elcsúszott a számolás). A $15$ akkor jön ki, ha $3a_n - 1$ helyett $3(a_n - 1)$-gyel számolsz: $2, 3, 6, 15$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy számtani sorozatban $a_1 = 4$ és $d = 3$. Mennyi $a_{15}$?`,
          options: [R`$46$`, R`$49$`, R`$42$`, R`$43$`],
          answer: 0,
          hint: R`Hány lépés (hányszor $+d$) vezet az első tagtól a 15.-ig?`,
          explain: R`$a_{15} = a_1 + 14d = 4 + 14\cdot3 = 46$. A $49 = 4 + 15\cdot3$ a tipikus „$nd$” hiba – az első tagban még nincs egy lépés sem. A $42 = 14\cdot3$-ból kimaradt az $a_1$, a $43$ eggyel kevesebb lépéssel számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $3 + 7 + 11 + \cdots + 43$?`,
          options: [R`$253$`, R`$230$`, R`$506$`, R`$276$`],
          answer: 0,
          hint: R`Előbb számold meg, hány tag van: hány $4$-es lépés vezet a 3-tól a 43-ig? Utána jöhet a nézőtér-trükk.`,
          explain: R`$d = 4$, és $43 = 3 + 10\cdot4$, tehát $n = 11$ tag van. $S_{11} = \tfrac{11\,(3 + 43)}{2} = 253$. A $230$ 10 taggal számol (a lépések száma nem a tagok száma!), a $276$ 12 taggal, az $506$-nál elmaradt a 2-vel osztás (minden tagot kétszer számoltunk).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy mértani sorozatban $a_2 = 6$ és $a_5 = 48$. Mennyi a kvóciens és az első tag?`,
          options: [R`$q = 2,\ a_1 = 3$`, R`$q = 14,\ a_1 = -8$`, R`$q = 8,\ a_1 = \tfrac34$`, R`$q = 2,\ a_1 = 12$`],
          answer: 0,
          hint: "Mértani sorozatnál osztunk és gyököt vonunk. Hány szorzás vezet a 2. tagtól az 5.-ig? Az első tagot visszafelé kapod.",
          explain: R`3 lépés: $q^3 = \tfrac{48}{6} = 8$, tehát $q = 2$; visszafelé $a_1 = \tfrac{a_2}{q} = 3$. A $q = 14,\ a_1 = -8$ a számtani sorozat módszere ($3d = 42$) – különbség hányados helyett. A $q = 8$-nál elmaradt a köbgyökvonás, az $a_1 = 12$-nél pedig visszafelé szoroztunk osztás helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi a $2 + 6 + 18 + \cdots$ mértani sorozat első 6 tagjának összege?`,
          options: [R`$728$`, R`$2186$`, R`$486$`, R`$1456$`],
          answer: 0,
          hint: R`$S_n = a_1\dfrac{q^n - 1}{q - 1}$ – mennyi itt $a_1$, $q$ és $n$? Ne felejtsd el a nevezőt!`,
          explain: R`$a_1 = 2$, $q = 3$, $n = 6$: $S_6 = 2\cdot\dfrac{3^6 - 1}{3 - 1} = 2\cdot\dfrac{728}{2} = 728$ (tagonként: $2 + 6 + 18 + 54 + 162 + 486 = 728$ ✔). A $2186$ hét taggal számol ($3^7$), a $486$ csak a hatodik tag ($2\cdot3^5$), az $1456$-nál kimaradt a $(q - 1)$-gyel osztás.`
        },
        {
          type: "match",
          q: R`Mind a négy sorozat első tagja 5. Párosítsd az explicit képletet a rekurzív megadással!`,
          pairs: [
            [R`$a_n = 3n + 2$`, "a₁ = 5, aₙ₊₁ = aₙ + 3"],
            [R`$a_n = 5\cdot3^{n-1}$`, "a₁ = 5, aₙ₊₁ = 3·aₙ"],
            [R`$a_n = 6 - n$`, "a₁ = 5, aₙ₊₁ = aₙ − 1"],
            [R`$a_n = 2^n + 3$`, "a₁ = 5, aₙ₊₁ = 2·aₙ − 3"]
          ],
          hint: "Számold ki mindegyik képletből a 2. tagot (vagy írd fel aₙ₊₁-et), és nézd meg, melyik szabály adja ugyanezt az 5-ből!",
          explain: R`A második tagok: $8$, $15$, $4$, $7$ – és $5 + 3 = 8$, $3\cdot5 = 15$, $5 - 1 = 4$, $2\cdot5 - 3 = 7$. Általánosan is stimmel, pl. $2(2^n + 3) - 3 = 2^{n+1} + 3$. Tanulság: a kezdőérték egyedül nem határozza meg a sorozatot – a szabály is kell, és fordítva.`
        }
      ]
    },

    /* ------------------------------------------------ 2.2 */
    "an2-22": {
      title: "Kvíz – 2.2 Monotonitás és korlátosság",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$a_n = \dfrac{n}{n + 1}$. Mennyi $a_{n+1} - a_n$?`,
          options: [R`$\dfrac{1}{(n + 1)(n + 2)}$`, R`$\dfrac{-1}{(n + 1)(n + 2)}$`, R`$\dfrac{1 - 2n}{(n + 1)(n + 2)}$`, R`$\dfrac{1}{n + 1}$`],
          answer: 0,
          hint: R`$a_{n+1}$-ben az $n$ mindkét helyén $n + 1$ áll. Utána közös nevező, és figyelj a $(n + 1)^2$ kifejtésére!`,
          explain: R`$a_{n+1} = \dfrac{n + 1}{n + 2}$, így $a_{n+1} - a_n = \dfrac{(n + 1)^2 - n(n + 2)}{(n + 1)(n + 2)} = \dfrac{n^2 + 2n + 1 - n^2 - 2n}{(n + 1)(n + 2)} = \dfrac{1}{(n + 1)(n + 2)} \gt 0$: a sorozat szigorúan nő. A negatív előjelű változat fordított sorrendű kivonás ($a_n - a_{n+1}$). Az $\tfrac{1 - 2n}{\ldots}$ a hibás $(n + 1)^2 = n^2 + 1$ kifejtésből jön, az $\tfrac1{n + 1}$ pedig abból, hogy csak a számlálóba írtuk be az $n + 1$-et ($a_{n+1} = \tfrac{n + 1}{n + 1} = 1$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $a_n = n^2 - 8n$ sorozatra $a_{n+1} - a_n = 2n - 7$. Hányadik tagtól kezdve nő szigorúan?`,
          options: ["a 4. tagtól", "a 3. tagtól", "az 5. tagtól", "a 8. tagtól"],
          answer: 0,
          hint: R`Mikor pozitív a $2n - 7$? És ha $a_{n+1} - a_n \gt 0$, melyik két tagot hasonlítja össze?`,
          explain: R`$2n - 7 \gt 0 \iff n \ge 4$, azaz $a_5 \gt a_4$, $a_6 \gt a_5$, … – az $a_4$-től kezdve szigorúan nő. Előtte csökken: $-7, -12, -15, -16, -15, \ldots$, tehát $a_4 = -16$ a legkisebb tag. A „3.” a $3{,}5$ lefelé kerekítése (de $n = 3$-ra $2n - 7 = -1 \lt 0$: $a_4 \lt a_3$). Az „5.” abból jön, hogy az $n = 4$-es különbséget az $a_5$-höz kötjük – pedig az $a_4$ és $a_5$ viszonyáról szól. A 8. tagnál a tag 0 – ennek a monotonitáshoz nincs köze.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi igaz az $a_n = \dfrac{2^n}{n!}$ sorozatra? (A hányados: $\dfrac{a_{n+1}}{a_n} = \dfrac{2}{n + 1}$.)`,
          options: [
            R`Monoton csökken, de nem szigorúan, mert $a_1 = a_2$.`,
            "Szigorúan monoton csökken.",
            R`Szigorúan monoton nő, mert a $2^n$ nő.`,
            "Nem monoton."
          ],
          answer: 0,
          hint: R`Pozitív tagú sorozat, a hányadost szabad használni. Nézd meg külön az $n = 1$ esetet!`,
          explain: R`$n = 1$-re a hányados $\tfrac22 = 1$, tehát $a_2 = a_1 = 2$; $n \ge 2$-re $\tfrac2{n+1} \lt 1$, tehát onnan szigorúan csökken: $2, 2, \tfrac43, \tfrac23, \ldots$ Összességében monoton csökkenő, de nem szigorúan. A „szigorúan” az első lépés elnézése, a „nő” pedig csak a számlálót nézi – az $n!$ gyorsabban nő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Valaki az $a_n = -2^n$ sorozatra kiszámolja: $\dfrac{a_{n+1}}{a_n} = 2 \gt 1$, tehát „a sorozat nő”. Mi a helyzet?`,
          options: [
            "Szigorúan monoton csökken – a hányadosmódszer negatív tagokra nem használható.",
            "Igaza van: szigorúan monoton nő.",
            "Nem monoton, mert a tagok előjele váltakozik.",
            "Konstans, mert a hányados állandó."
          ],
          answer: 0,
          hint: "Írd fel az első néhány tagot! Melyik feltételt hagyta figyelmen kívül a hányadosmódszernél?",
          explain: R`A tagok $-2, -4, -8, -16, \ldots$ – egyre kisebbek: szigorúan csökken. Negatív számmal osztva az egyenlőtlenség megfordul, ezért a hányadosmódszer csak pozitív tagokra jó. Különbséggel: $a_{n+1} - a_n = -2^{n+1} + 2^n = -2^n \lt 0$. Az előjel nem váltakozik (mindegyik negatív), és az állandó hányados mértani sorozatot jelent, nem konstanst.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mi az $a_n = \dfrac{2n + 3}{n + 1} = 2 + \dfrac{1}{n + 1}$ sorozat szuprémuma és infimuma ($n \ge 1$)?`,
          options: [
            R`$\sup = \max = 2{,}5$; $\inf = 2$, minimum nincs`,
            R`$\sup = \max = 2{,}5$; $\inf = \min = 2$`,
            R`$\sup = 3$, maximum nincs; $\inf = 2$, minimum nincs`,
            R`$\sup = \max = 2{,}5$; $\inf = 0$, minimum nincs`
          ],
          answer: 0,
          hint: R`Nő vagy csökken? Melyik tag a legnagyobb? Felveszi-e a sorozat valaha azt az értéket, amelyhez közelít?`,
          explain: R`Egyre kisebbet adunk a 2-höz, tehát a sorozat csökken: a legnagyobb tag az első, $a_1 = \tfrac52 = 2{,}5$ – ez szuprémum és maximum is. Lefelé a 2 a legszorosabb korlát, de egyik tag sem 2 (mindig hozzáadunk valami pozitívat): $\inf = 2$, minimum nincs. Az infimum nem feltétlenül tag – ez a sup = max típusú összekeverés. A $3$ az $n = 0$ behelyettesítése, a $0$ a $\tfrac1{n+1}$ infimuma (elmaradt a $+2$).`
        },
        {
          type: "multi",
          q: "Melyik sorozat korlátos?",
          options: [R`$\dfrac{(-1)^n}{n}$`, R`$(-1)^n$`, R`$3 - \dfrac{1}{n + 1}$`, R`$2n + 1$`, R`$n^2 - 6n$`],
          answer: [0, 1, 2],
          hint: "Korlátos = alulról ÉS felülről is. Keress mindegyikhez egy alsó és egy felső korlátot – vagy mutasd meg, hogy valamelyik oldalon nincs.",
          explain: R`$\left|\tfrac{(-1)^n}{n}\right| \le 1$ és $|(-1)^n| = 1$: korlátosak (az utóbbi mégsem „nyugszik meg”). A $3 - \tfrac1{n+1}$ a $[2{,}5;\ 3[$ intervallumban van. A $2n + 1$ és az $n^2 - 6n$ alulról korlátos (3, illetve $-9$), de felülről nem – ezért nem korlátosak. Egy oldal kevés!`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik állítás igaz?",
          options: [
            "Monoton növő sorozatnak az első tagja alsó korlát.",
            "Monoton növő sorozatnak az első tagja felső korlát.",
            "A szuprémum mindig a sorozat egyik tagja.",
            "Ha az 5 felső korlát, akkor az 5 a szuprémum."
          ],
          answer: 0,
          hint: "Ha a sorozat nő, a többi tag az elsőhöz képest hol van? A többinél keress ellenpéldát a fejezetből!",
          explain: R`Növő sorozatnál minden tag legalább akkora, mint az első, tehát $a_1$ alsó korlát (felső korlát a csökkenő sorozatnál lenne). Az $1 - \tfrac2{n+1}$ szuprémuma 1, de egyik tag sem 1. Ha 5 felső korlát, akkor 6 és 100 is az – a szuprémum a legkisebb felső korlát, ami lehet 5-nél kisebb is.`
        },
        {
          type: "match",
          q: "Párosítsd a sorozatokat a monotonitásukkal!",
          pairs: [
            [R`$\dfrac1n$`, "szigorúan monoton csökken"],
            [R`$3n - 1$`, "szigorúan monoton nő"],
            [R`$5,\ 5,\ 5,\ \ldots$`, "monoton nő és csökken is"],
            [R`$\dfrac{(-1)^n}{n}$`, "nem monoton"]
          ],
          hint: R`Számold ki az $a_{n+1} - a_n$ különbséget – vagy írd fel az első néhány tagot, ha ellenpéldát keresel.`,
          explain: R`$\tfrac1{n+1} - \tfrac1n = \tfrac{-1}{n(n+1)} \lt 0$; $3(n + 1) - 1 - (3n - 1) = 3 \gt 0$; a konstans sorozatnál a különbség 0, ez $\ge 0$ és $\le 0$ is, tehát (nem szigorúan) nő és csökken is. A $\tfrac{(-1)^n}{n}$-nél $a_1 = -1 \lt a_2 = \tfrac12$, de $a_2 \gt a_3 = -\tfrac13$.`
        }
      ]
    },

    /* ------------------------------------------------ 2.3 */
    "an2-23": {
      title: "Kvíz – 2.3 Konvergencia",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Melyik a $\lim a_n = A$ helyes definíciója?`,
          options: [
            R`Minden $\varepsilon \gt 0$-hoz van olyan $N$, hogy minden $n \gt N$ esetén $|a_n - A| \lt \varepsilon$.`,
            R`Van olyan $\varepsilon \gt 0$, amelyhez van olyan $N$, hogy minden $n \gt N$ esetén $|a_n - A| \lt \varepsilon$.`,
            R`Minden $\varepsilon \gt 0$-hoz van olyan $n$, hogy $|a_n - A| \lt \varepsilon$.`,
            R`Minden $n$-re $|a_{n+1} - A| \lt |a_n - A|$ (a tagok egyre közelebb kerülnek $A$-hoz).`
          ],
          answer: 0,
          hint: "Három dolog kell: tetszőlegesen kicsi hibahatár, egy idő után, és ott is kell maradni. Melyik megfogalmazásból hiányzik valamelyik?",
          explain: R`A helyes: minden $\varepsilon$-hoz kell küszöb, és az $N$ utáni összes tag a sávban van. Egyetlen $\varepsilon$ kevés: a $(-1)^n$ minden tagja benne van a 0 körüli $\varepsilon = 2$-es sávban. Egyetlen tag a sávban kevés (2. próbálkozás): a $(-1)^n$-nek végtelen sok tagja 1, mégsem tart 1-hez. Az „egyre közelebb” (1. próbálkozás) szerint az $\tfrac1{2^n}$ a $-10$-hez is tartana.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_n = \dfrac{4n + 1}{2n + 3} \to 2$. Mi a legkisebb jó küszöbindex $\varepsilon = 0{,}01$-hez?`,
          options: [R`$N = 248$`, R`$N = 249$`, R`$N = 250$`, R`$N = 500$`],
          answer: 0,
          hint: R`Közös nevezőre hozva számold ki $|a_n - 2|$-t, és oldd meg az egyenlőtlenséget $n$-re. A végén a kerekítésre figyelj!`,
          explain: R`$|a_n - 2| = \left|\dfrac{4n + 1 - 2(2n + 3)}{2n + 3}\right| = \dfrac{5}{2n + 3} \lt 0{,}01 \iff 2n + 3 \gt 500 \iff n \gt 248{,}5$. Az első jó tag az $a_{249}$, tehát $N = 248$ (ekkor „minden $n \gt 248$”). A $249$ felfelé kerekít (jó küszöb, de nem a legkisebb), a $250$ a $+3$ elhagyásából jön ($\tfrac5{2n}$), az $500$ megállt a $2n + 3 \gt 500$-nál.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_n = \dfrac{1}{3^n} \to 0$. Mi a legkisebb jó küszöbindex $\varepsilon = 0{,}01$-hez?`,
          options: [R`$N = 4$`, R`$N = 5$`, R`$N = 33$`, R`$N = 100$`],
          answer: 0,
          hint: R`$\tfrac1{3^n} \lt 0{,}01 \iff 3^n \gt 100$. Melyik az első $n$, amire igaz? A küszöb az ennél eggyel kisebb szám – miért?`,
          explain: R`$3^4 = 81$, $3^5 = 243$, tehát az első jó tag az $a_5$, és $N = 4$: minden $n \gt 4$ esetén a tag a sávban van (a sorozat csökken, ott is marad). Az $N = 5$ összekeveri a küszöböt az első jó indexszel ($n \gt N$, nem $n \ge N$). A $33$ az $\tfrac1{3n}$-re lenne jó, a $100$ az $\tfrac1n$-re.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_n = \dfrac{n - 4}{n + 1} \to 1$. Ali így számol $\varepsilon = 0{,}01$-re: „$a_n - 1 = \dfrac{-5}{n + 1} \lt 0{,}01$ minden $n$-re, tehát $N = 0$.” Mi a helyzet?`,
          options: [
            R`Elfelejtette az abszolút értéket; a legkisebb jó küszöb $N = 499$.`,
            R`Elfelejtette az abszolút értéket; a legkisebb jó küszöb $N = 500$.`,
            R`Nincs hiba: $N = 0$ jó küszöb.`,
            R`A határérték nem 1, hanem $-4$, ezért nincs ilyen küszöb.`
          ],
          answer: 0,
          hint: R`Benne van-e $a_1 = -\tfrac32$ az $]0{,}99;\ 1{,}01[$ sávban? A definícióban $|a_n - A|$ áll.`,
          explain: R`A negatív szám mindig kisebb $0{,}01$-nél, de ettől még messze lehet a sávtól. Helyesen: $\left|\tfrac{-5}{n + 1}\right| = \tfrac5{n + 1} \lt 0{,}01 \iff n + 1 \gt 500 \iff n \gt 499$, tehát $N = 499$ (az első jó tag az 500.). Az $N = 500$ eggyel elcsúszott küszöb. A $-4$ a számláló konstansa – a határérték a főegyütthatók hányadosa, $\tfrac11 = 1$.`
        },
        {
          type: "multi",
          q: "Melyik sorozat konvergens?",
          options: [R`$\dfrac{(-1)^n}{n}$`, R`$(-1)^n$`, R`$n^2$`, R`$3 + \dfrac{(-1)^n}{n}$`, R`$(-1)^n + \dfrac1n$`],
          answer: [0, 3],
          hint: "Konvergens = egy VALÓS számhoz tart. A ±∞ ide nem számít, és a két részsorozat sem tarthat különböző helyre.",
          explain: R`$\tfrac{(-1)^n}{n} \to 0$ és $3 + \tfrac{(-1)^n}{n} \to 3$ – cikázva, de konvergálnak. A $(-1)^n$ és a $(-1)^n + \tfrac1n$ két részsorozata $1$-hez és $-1$-hez tart: divergensek (pedig korlátosak). Az $n^2 \to +\infty$ tágabb értelemben vett határérték, de a sorozat divergens.`
        },
        {
          type: "match",
          q: "Párosítsd a sorozatokat a viselkedésükkel!",
          pairs: [
            [R`$\dfrac{5}{n + 3}$`, "konvergens"],
            [R`$3n - 5$`, "+végtelenbe tart"],
            [R`$1 - n^2$`, "−végtelenbe tart"],
            [R`$(-1)^n\,n$`, "nincs határértéke"],
            [R`$\sin\left(\tfrac{n\pi}{2}\right)$`, "nincs határértéke"]
          ],
          hint: "Írd fel néhány tagot nagy n-re! Ha a tagok ugrálnak, nézd külön a páros és a páratlan indexűeket.",
          explain: R`$\tfrac5{n + 3} \to 0$. A $3n - 5$ minden $K$-n túlnő, az $1 - n^2$ minden $K$ alá kerül. A $(-1)^n n$ se nem korlátos, se nem tart $\pm\infty$-hez ($-1, 2, -3, 4, \ldots$). A $\sin\tfrac{n\pi}2$ tagjai $1, 0, -1, 0, \ldots$ – korlátos, de két részsorozata különböző helyre tart.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik állítás igaz?",
          options: [
            "Ha egy sorozat nem korlátos, akkor nem konvergens.",
            "Ha egy sorozat korlátos, akkor konvergens.",
            "Ha egy sorozat a +∞-hez tart, akkor konvergens.",
            "Ha egy sorozat első 1000 tagját megváltoztatjuk, a határértéke is megváltozhat."
          ],
          answer: 0,
          hint: "Konvergens ⇒ korlátos. Melyik a vele egyenértékű megfordítás, és melyik a hibás megfordítás?",
          explain: R`A „konvergens ⇒ korlátos” tételből következik a „nem korlátos ⇒ nem konvergens”. A fordított irány hamis: a $(-1)^n$ korlátos, de divergens. A $+\infty$-hez tartó sorozat divergens, csak tágabb értelemben van határértéke. Véges sok tag pedig nem számít: a küszöbindexet legfeljebb 1000 fölé kell vinni.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit mondhatsz az $a_n = (-1)^n\cdot\dfrac{n}{n + 1}$ sorozatról?`,
          options: [
            R`Korlátos, de divergens: a páros indexű tagok 1-hez, a páratlan indexűek $-1$-hez tartanak.`,
            "Konvergens, a határértéke 1.",
            R`Konvergens, a határértéke 0, mert a $(-1)^n$ „kiejti” magát.`,
            R`A $+\infty$-hez tart.`
          ],
          answer: 0,
          hint: R`Nézd külön a páros és a páratlan $n$-eket! Hová tart az $\tfrac{n}{n + 1}$?`,
          explain: R`$|a_n| = \tfrac{n}{n + 1} \lt 1$, tehát korlátos. Páros $n$-re $a_n = \tfrac{n}{n + 1} \to 1$, páratlanra $-\tfrac{n}{n + 1} \to -1$. Két részsorozat különböző határértékkel: a sorozat divergens, nincs határértéke. A 0 akkor lenne jó, ha a tagok abszolút értéke 0-hoz tartana (mint a $\tfrac{(-1)^n}{n}$-nél) – itt 1-hez tart.`
        }
      ]
    },

    /* ------------------------------------------------ 2.4 */
    "an2-24": {
      title: "Kvíz – 2.4 Határérték kiszámolása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{4n^2 - 3n + 1}{2n^2 + 5} = ?$`,
          options: [R`$2$`, R`$1$`, R`$\tfrac15$`, R`$\tfrac12$`],
          answer: 0,
          hint: R`Azonos a fok? Oszd el a számlálót és a nevezőt is $n^2$-tel!`,
          explain: R`$n^2$-tel osztva: $\dfrac{4 - \frac3n + \frac1{n^2}}{2 + \frac5{n^2}} \to \dfrac42 = 2$ – azonos fok, a főegyütthatók hányadosa. Az $1$ a „$\tfrac\infty\infty = 1$” tévhit, az $\tfrac15$ a konstans tagok hányadosa (pedig épp azok tűnnek el), az $\tfrac12$ a fordított hányados.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{3n^3 - n}{2 - 4n^2} = ?$`,
          options: [R`$-\infty$`, R`$+\infty$`, R`$-\tfrac34$`, R`$0$`],
          answer: 0,
          hint: "Melyik fok nagyobb? Ha a számlálóé, akkor a főegyütthatók előjele dönt.",
          explain: R`A számláló foka 3, a nevezőé 2, tehát $\pm\infty$; az előjel a főegyütthatóké: $\tfrac{3}{-4} \lt 0$, így $-\infty$. Kiemelve: $n\cdot\dfrac{3 - \frac1{n^2}}{\frac2{n^2} - 4} \to \infty\cdot\left(-\tfrac34\right) = -\infty$. A $+\infty$ elveszti az előjelet, a $-\tfrac34$ figyelmen kívül hagyja a fokokat, a $0$ megfordítja őket.`
        },
        {
          type: "set",
          q: "Melyik kritikus alak (ránézésre nem dönthető el a határérték)?",
          items: ["∞ − ∞", "0 · ∞", "∞ + ∞", "∞ / ∞", "5 / ∞", "0 / 0", "∞ · ∞"],
          answer: ["∞ − ∞", "0 · ∞", "∞ / ∞", "0 / 0"],
          hint: "Keress mindegyikhez két példát különböző eredménnyel! Ha mindig ugyanaz jön ki, az nem kritikus.",
          explain: R`Kritikus: $\infty - \infty$ (pl. $n - n \to 0$, de $(n + 5) - n \to 5$), $0\cdot\infty$, $\tfrac\infty\infty$ ($\tfrac{n}{n^2} \to 0$, $\tfrac{7n}{n} \to 7$, $\tfrac{n^2}{n} \to \infty$) és $\tfrac00$. Nem kritikus: $\infty + \infty = \infty$, $\infty\cdot\infty = \infty$, $\tfrac5\infty = 0$ – ezek mindig ugyanazt adják.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \left(\sqrt{n^2 + 4n} - n\right) = ?$`,
          options: [R`$2$`, R`$0$`, R`$4$`, R`$+\infty$`],
          answer: 0,
          hint: R`$\infty - \infty$ alak: bővíts a konjugálttal, $\sqrt{n^2 + 4n} + n$-nel!`,
          explain: R`$\sqrt{n^2 + 4n} - n = \dfrac{(n^2 + 4n) - n^2}{\sqrt{n^2 + 4n} + n} = \dfrac{4n}{\sqrt{n^2 + 4n} + n} = \dfrac{4}{\sqrt{1 + \frac4n} + 1} \to \dfrac42 = 2$. (Szemléletesen: $\sqrt{n^2 + 4n} \approx n + 2$.) A $0$ a „$\infty - \infty = 0$” tévhit, a $4$ abból jön, hogy a nevezőben csak az egyik tagot ($n$) tartjuk meg, a $+\infty$ pedig a hibás $\sqrt{n^2 + 4n} = n + \sqrt{4n}$ felbontásból.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{\sqrt{9n^2 + 1}}{3n - 2} = ?$`,
          options: [R`$1$`, R`$3$`, R`$\tfrac13$`, R`$+\infty$`],
          answer: 0,
          hint: R`Mekkora a $\sqrt{9n^2 + 1}$ „foka”? Oszd el mindkettőt $n$-nel; a gyök alá $n = \sqrt{n^2}$ alakban kerül.`,
          explain: R`$\dfrac{\sqrt{9n^2 + 1}}{3n - 2} = \dfrac{\sqrt{9 + \frac1{n^2}}}{3 - \frac2n} \to \dfrac{\sqrt9}{3} = 1$. A $3$ a gyökvonás elfelejtése ($\tfrac93$), az $\tfrac13$ a $\sqrt{9n^2} = n$ hiba ($3n$ helyett). A $+\infty$ abból jön, hogy a gyök alatti fokot (2) vetjük össze a nevezőével – de a gyökös tag foka ennek fele, 1.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\lim \dfrac{5n + \sin n}{n + 2} = ?$`,
          options: [R`$5$`, R`$6$`, R`$0$`, "nincs határértéke, mert a sin n-nek sincs"],
          answer: 0,
          hint: R`Használd a $-1 \le \sin n \le 1$ becslést, és fogd közre a sorozatot két rendőrrel!`,
          explain: R`$\dfrac{5n - 1}{n + 2} \le a_n \le \dfrac{5n + 1}{n + 2}$, és mindkét rendőr 5-höz tart (azonos fok, $\tfrac51$), tehát $a_n \to 5$. A $6$ a $\sin n$ helyére írt 1 és a főegyüttható összekeverése ($5 + 1$), a $0$ a „korlátos szor nullsorozat” szabály rossz helyen alkalmazva (itt a $\tfrac{\sin n}{n + 2}$ tart 0-hoz, a $\tfrac{5n}{n + 2}$ nem). A $\sin n$-nek valóban nincs határértéke, de a rendőrelvhez erre nincs is szükség.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_1 = 1$, $a_{n+1} = \sqrt{12 + a_n}$. A sorozat nő és felülről korlátos. Mi a határértéke?`,
          options: [R`$4$`, R`$-3$`, R`$\sqrt{12}$`, R`$4$ és $-3$ is lehet`],
          answer: 0,
          hint: R`Mozgólépcső-tétel: van határérték, $A$. Írd mindkét oldalra $A$-t, oldd meg, és nézd meg, melyik gyök lehetséges!`,
          explain: R`Fixpont-egyenlet: $A = \sqrt{12 + A}$, négyzetre emelve $A^2 - A - 12 = 0$, gyökei $4$ és $-3$. A tagok pozitívak ($1;\ 3{,}606;\ 3{,}950;\ \ldots$), ezért $A = 4$. A $-3$ a rossz gyök, a „mindkettő” elfelejti a kiválasztást (a határérték egyértelmű!), a $\sqrt{12}$-nél az $A$ kimaradt a gyök alól.`
        },
        {
          type: "single", shuffle: true,
          q: R`$a_1 = 2$, $a_{n+1} = 3a_n - 2$. Az $A = 3A - 2$ fixpont-egyenletből $A = 1$. Mi a sorozat határértéke?`,
          options: [
            R`$+\infty$ – a fixpont-egyenlet itt félrevezet, mert nincs véges határérték.`,
            R`$1$, a fixpont-egyenlet szerint.`,
            R`$0$, mert a tagok különbsége nő.`,
            R`$-\infty$`
          ],
          answer: 0,
          hint: "Írd fel az első néhány tagot! A fixpont-egyenlet mikor adja a határértéket?",
          explain: R`A tagok $2, 4, 10, 28, 82, \ldots$ – minden határon túlnőnek: $a_n \to +\infty$. Az $A = f(A)$ egyenlet csak akkor adja a határértéket, ha már tudjuk, hogy van (véges) határérték – ezért kell előbb a monotonitás és a korlátosság. Itt a sorozat nő, de felülről nem korlátos.`
        }
      ]
    },
}; })();
