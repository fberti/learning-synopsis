/* =========================================================
   2. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 2.1 */
    "p2-21": {
      title: "Kvíz – 2.1 Feltételes valószínűség",
      questions: [
        {
          type: "numeric",
          q: "Két szabályos kockával dobunk. Tudjuk, hogy a dobott számok összege 8. Mi a valószínűsége, hogy valamelyik kockán 3-as van?",
          answer: 2 / 5,
          explain: R`$B$ = „összeg 8” $= \{(2,6),(3,5),(4,4),(5,3),(6,2)\}$, 5 elem. Ebből 3-ast tartalmaz: $(3,5)$ és $(5,3)$. $P(A \mid B) = \tfrac25$.`
        },
        {
          type: "numeric",
          q: R`$P(A) = 0{,}5$, $P(B) = 0{,}4$ és $P(AB) = 0{,}1$. Mennyi $P(A \mid B)$?`,
          answer: 0.25,
          explain: R`$P(A \mid B) = \dfrac{P(AB)}{P(B)} = \dfrac{0{,}1}{0{,}4} = 0{,}25$.`
        },
        {
          type: "numeric",
          q: "Egy 200 fős cégnél 120 nő és 80 férfi dolgozik. A nők közül 30-an, a férfiak közül 20-an dohányoznak. Egy véletlenül kiválasztott dolgozóról kiderül, hogy dohányzik. Mi a valószínűsége, hogy nő?",
          answer: 0.6,
          explain: R`Az új eseménytér az 50 dohányos; ebből 30 nő: $P(\text{nő} \mid \text{dohányzik}) = \tfrac{30}{50} = 0{,}6$. (Figyelem: $P(\text{dohányzik} \mid \text{nő}) = \tfrac{30}{120} = 0{,}25$ – egészen más szám!)`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak minden $A$ eseményre és minden $P(B) > 0$ eseményre?`,
          options: [
            R`$P(A \mid B) = P(B \mid A)$`,
            R`$P(\Omega \mid B) = 1$`,
            R`$P(\overline{A} \mid B) = 1 - P(A \mid B)$`,
            R`$P(A \mid B) \ge P(A)$`,
            R`$P(A \mid B) \ge P(AB)$`
          ],
          answer: [1, 2, 4],
          explain: R`Rögzített $B$ mellett $P(\,\cdot \mid B)$ maga is valószínűség (teljesíti az axiómákat), ezért igaz a 2. és a 3. Az 5.: $P(A\mid B) = P(AB)/P(B) \ge P(AB)$, mert $P(B) \le 1$. Az 1. és a 4. általában hamis.`
        },
        {
          q: "Egy családban két gyerek van, és tudjuk, hogy legalább az egyikük fiú. Mi a valószínűsége, hogy mindkettő fiú? (A fiú és a lány születését tekintsük egyformán valószínűnek.)",
          options: [R`$\tfrac12$`, R`$\tfrac13$`, R`$\tfrac14$`, R`$\tfrac23$`],
          answer: 1,
          explain: R`$\Omega = \{FF, FL, LF, LL\}$. A feltétel kizárja az $LL$-t, marad 3 egyformán valószínű eset, ebből 1 kedvező: $\tfrac13$. (A „$\tfrac12$” akkor lenne jó, ha azt tudnánk, hogy az <em>idősebb</em> gyerek fiú.)`
        }
      ]
    },

    /* ------------------------------------------------ 2.1.1 */
    "p2-211": {
      title: "Kvíz – 2.1.1 Szorzási tétel és fadiagram",
      questions: [
        {
          type: "numeric",
          q: "10 alkatrész közül 3 hibás. Visszatevés nélkül egymás után kettőt kiveszünk. Mi a valószínűsége, hogy mindkettő hibás?",
          answer: 1 / 15,
          explain: R`$\tfrac{3}{10}\cdot\tfrac{2}{9} = \tfrac{6}{90} = \tfrac{1}{15} \approx 0{,}067$.`
        },
        {
          type: "numeric",
          q: "A 32 lapos magyar kártyából egymás után (visszatevés nélkül) húzunk két lapot. Mi a valószínűsége, hogy mindkettő ász? (4 ász van.)",
          answer: 3 / 248,
          explain: R`$\tfrac{4}{32}\cdot\tfrac{3}{31} = \tfrac{12}{992} = \tfrac{3}{248} \approx 0{,}0121$.`
        },
        {
          q: R`Melyik az általános szorzási szabály három eseményre?`,
          options: [
            R`$P(ABC) = P(A)\,P(B)\,P(C)$`,
            R`$P(ABC) = P(A)\,P(B \mid A)\,P(C \mid AB)$`,
            R`$P(ABC) = P(A \mid B)\,P(B \mid C)\,P(C \mid A)$`,
            R`$P(ABC) = P(A) + P(B) + P(C) - 1$`
          ],
          answer: 1,
          explain: "Az első csak teljesen független eseményekre igaz; az általános szabályban minden tényező az összes korábbi eseményre van feltételezve."
        },
        {
          type: "numeric",
          q: "Feldobunk egy érmét: fej esetén az I. urnából (3 piros, 2 fehér), írás esetén a II. urnából (1 piros, 4 fehér) húzunk egy golyót. Mi a valószínűsége, hogy piros golyót húzunk?",
          answer: 0.4,
          explain: R`Két út vezet a piroshoz: $\tfrac12\cdot\tfrac35 + \tfrac12\cdot\tfrac15 = \tfrac{3}{10} + \tfrac{1}{10} = 0{,}4$.`
        },
        {
          q: "Hogyan kapjuk meg egy fadiagramon egy esemény valószínűségét, ha több út is hozzá vezet?",
          options: [
            "Az utak mentén összeadjuk, az utakat összeszorozzuk.",
            "Az utak mentén összeszorozzuk a valószínűségeket, majd az utakhoz tartozó szorzatokat összeadjuk.",
            "Csak a leghosszabb utat vesszük figyelembe.",
            "Az összes ág valószínűségét összeadjuk."
          ],
          answer: 1,
          explain: "Egy út = egymás utáni események együttes bekövetkezése → szorzási tétel. Különböző utak = egymást kizáró esetek → összeadás."
        }
      ]
    },

    /* ------------------------------------------------ 2.2 */
    "p2-22": {
      title: "Kvíz – 2.2 A teljes valószínűség tétele",
      questions: [
        {
          type: "numeric",
          q: "Egy termék 60%-át az A gép 2%-os, 40%-át a B gép 5%-os selejtaránnyal gyártja. Mi a valószínűsége, hogy egy véletlenül kiválasztott termék selejtes?",
          answer: 0.032,
          explain: R`$P(S) = 0{,}6\cdot0{,}02 + 0{,}4\cdot0{,}05 = 0{,}012 + 0{,}020 = 0{,}032$.`
        },
        {
          type: "numeric",
          q: "A hallgatók 70%-a felkészülten megy vizsgázni. A felkészültek 90%-a, a felkészületlenek 30%-a megy át. Mekkora a valószínűsége, hogy egy véletlenül kiválasztott hallgató átmegy?",
          answer: 0.72,
          explain: R`$0{,}7\cdot0{,}9 + 0{,}3\cdot0{,}3 = 0{,}63 + 0{,}09 = 0{,}72$.`
        },
        {
          type: "multi",
          q: "Kockadobásnál melyek alkotnak teljes eseményrendszert?",
          options: [
            R`$\{1,2\},\ \{3,4\},\ \{5,6\}$`,
            "páros, páratlan",
            "prím, nem prím",
            R`$\{1,2,3\},\ \{3,4,5,6\}$`,
            R`$\{1\},\ \{2\},\ \{3\}$`
          ],
          answer: [0, 1, 2],
          explain: "Teljes eseményrendszer: páronként kizáró események, amelyek összege a biztos esemény. A 4. esetben a 3 mindkettőben benne van; az 5. nem fedi le a 4, 5, 6 dobást."
        },
        {
          q: R`Egy teljes eseményrendszer két eleme $A_1$ és $A_2$. Tudjuk, hogy $P(B \mid A_1) = 0{,}2$ és $P(B \mid A_2) = 0{,}6$. Mit mondhatunk $P(B)$-ről?`,
          options: [
            "Pontosan 0,4.",
            "0,2 és 0,6 közé esik – a feltételes valószínűségek súlyozott átlaga.",
            "Lehet akár 0,7 is.",
            "Pontosan 0,8 (a kettő összege)."
          ],
          answer: 1,
          explain: R`$P(B) = P(A_1)\cdot0{,}2 + P(A_2)\cdot0{,}6$, ahol a súlyok összege 1 – ez egy súlyozott átlag. Pontosan 0,4 csak akkor, ha $P(A_1) = P(A_2) = \tfrac12$.`
        }
      ]
    },

    /* ------------------------------------------------ 2.2.1 */
    "p2-221": {
      title: "Kvíz – 2.2.1 Bayes tétele",
      questions: [
        {
          type: "numeric",
          q: "(Az előző kvíz gépei:) a termékek 60%-át az A gép 2%-os, 40%-át a B gép 5%-os selejttel gyártja. Egy kiválasztott termék selejtes. Mi a valószínűsége, hogy a B gépen készült?",
          answer: 0.625,
          explain: R`$P(B \mid S) = \dfrac{0{,}4\cdot0{,}05}{0{,}032} = \dfrac{0{,}02}{0{,}032} = 0{,}625$. A B gép csak a termékek 40%-át adja, de a selejtnek már 62,5%-át!`
        },
        {
          type: "numeric",
          q: "Egy betegség a lakosság 2%-át érinti. A teszt szenzitivitása 90% (beteget 90% eséllyel jelez pozitívnak), specificitása 95% (egészségeseknél 5% az álpozitív). Valakinek pozitív a tesztje. Mekkora eséllyel beteg?",
          answer: 0.018 / 0.067, tol: 0.003,
          explain: R`$\dfrac{0{,}02\cdot0{,}9}{0{,}02\cdot0{,}9 + 0{,}98\cdot0{,}05} = \dfrac{0{,}018}{0{,}067} \approx 0{,}269$. Csak kb. 27% – mert az egészségesek sokkal többen vannak.`
        },
        {
          type: "numeric",
          q: "Feldobunk egy érmét: fej esetén az 1. dobozból (2 piros, 1 kék), írás esetén a 2. dobozból (1 piros, 3 kék) húzunk. Piros golyót húztunk. Mi a valószínűsége, hogy az 1. dobozból?",
          answer: 8 / 11,
          explain: R`$\dfrac{\tfrac12\cdot\tfrac23}{\tfrac12\cdot\tfrac23 + \tfrac12\cdot\tfrac14} = \dfrac{1/3}{1/3 + 1/8} = \dfrac{8}{11} \approx 0{,}727$.`
        },
        {
          q: R`A Bayes-tételben $P(A_i)$-t és $P(A_i \mid B)$-t hogyan nevezzük?`,
          options: [
            R`$P(A_i)$: a posteriori, $P(A_i \mid B)$: a priori`,
            R`$P(A_i)$: a priori (előzetes), $P(A_i \mid B)$: a posteriori (utólagos)`,
            "Mindkettő likelihood.",
            "Mindkettő teljes valószínűség."
          ],
          answer: 1,
          explain: R`A priori = a megfigyelés <em>előtti</em> valószínűség; a posteriori = a $B$ megfigyelése <em>utáni</em>, frissített valószínűség. $P(B \mid A_i)$ a likelihood.`
        },
        {
          q: "A Monty Hall-játékban az első választás után a műsorvezető kinyit egy kecskés ajtót. Mekkora eséllyel nyer az, aki vált?",
          options: [R`$\tfrac13$`, R`$\tfrac12$`, R`$\tfrac23$`, R`$1$`],
          answer: 2,
          explain: R`Váltással pontosan akkor nyerünk, ha elsőre kecskét választottunk – ennek esélye $\tfrac23$.`
        }
      ]
    },

    /* ------------------------------------------------ 2.3 */
    "p2-23": {
      title: "Kvíz – 2.3 Események függetlensége",
      questions: [
        {
          q: R`$A$ és $B$ egymást kizáró események, $P(A) = 0{,}3$, $P(B) = 0{,}5$. Függetlenek-e?`,
          options: ["Igen, mert nincs közös elemük.", R`Nem, mert $P(AB) = 0 \ne 0{,}15 = P(A)P(B)$.`, "Nem dönthető el."],
          answer: 1,
          explain: "Pozitív valószínűségű kizáró események soha nem függetlenek: ha az egyik bekövetkezik, a másik biztosan nem – ez erős függés!"
        },
        {
          type: "numeric",
          q: "Két számítógép egymástól függetlenül működik; egy műszak alatt az egyik 0,3, a másik 0,2 valószínűséggel hibásodik meg. Mi a valószínűsége, hogy legalább az egyik meghibásodik?",
          answer: 0.44,
          explain: R`Egyik sem hibásodik meg: $0{,}7\cdot0{,}8 = 0{,}56$, ennek ellentettje $1 - 0{,}56 = 0{,}44$.`
        },
        {
          type: "multi",
          q: "Egy kockadobásnál melyik eseménypár független?",
          options: [
            R`páros és $\{1, 2\}$`,
            R`páros és $\{1, 2, 3\}$`,
            "páros és páratlan",
            R`páros és $\Omega$`,
            R`$\{1,2,3,4\}$ és páros`
          ],
          answer: [0, 3, 4],
          explain: R`Ellenőrizd $P(AB) = P(A)P(B)$-t: 1. $\tfrac16 = \tfrac12\cdot\tfrac13$ ✓; 2. $\tfrac16 \ne \tfrac14$; 3. $0 \ne \tfrac14$; 4. $\tfrac12 = \tfrac12\cdot1$ ✓; 5. $\tfrac13 = \tfrac23\cdot\tfrac12$ ✓.`
        },
        {
          type: "numeric",
          q: "Három, egymástól függetlenül 0,9 valószínűséggel működő elemet sorba kapcsolunk. Mi a valószínűsége, hogy a rendszer működik?",
          answer: 0.729,
          explain: R`Soros rendszer csak akkor működik, ha minden eleme működik: $0{,}9^3 = 0{,}729$.`
        },
        {
          q: "Egy szabályos érmével ötször egymás után fejet dobtunk. Mi a valószínűsége, hogy a hatodik dobás is fej lesz?",
          options: [R`$\tfrac12$`, R`$\tfrac1{64}$`, R`$\tfrac1{32}$`, R`kisebb, mint $\tfrac12$, mert „jár már” az írás`],
          answer: 0,
          explain: R`Az egymás utáni dobások függetlenek: $\tfrac12$. A „jár már az írás” gondolat a <em>szerencsejátékos tévedése</em>. ($\tfrac1{64}$ a hat fej <em>előre</em> számított esélye.)`
        },
        {
          type: "numeric",
          q: R`Hány egyenlőségnek kell teljesülnie ahhoz, hogy három esemény ($A$, $B$, $C$) teljesen független legyen?`,
          answer: 4, tol: 0, placeholder: "egész szám",
          explain: R`Három páronkénti ($AB$, $AC$, $BC$) és egy hármas ($ABC$): $2^3 - 3 - 1 = 4$.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p2-final": {
      title: "Fejezetzáró teszt – 2. fejezet",
      questions: [
        {
          type: "numeric",
          q: "Két kockával dobunk. Tudjuk, hogy az összeg legalább 10. Mi a valószínűsége, hogy dupla (a két szám egyenlő)?",
          answer: 1 / 3,
          explain: R`Összeg $\ge 10$: $(4,6),(5,5),(6,4),(5,6),(6,5),(6,6)$ – 6 eset, ebből dupla 2: $\tfrac26 = \tfrac13$.`
        },
        {
          type: "match",
          q: "Párosítsd a képleteket a nevükkel!",
          pairs: [
            [R`$P(AB) = P(A)\,P(B \mid A)$`, "szorzási tétel"],
            [R`$P(B) = \sum_i P(A_i)\,P(B \mid A_i)$`, "teljes valószínűség tétele"],
            [R`$P(A_k \mid B) = \dfrac{P(A_k)P(B \mid A_k)}{\sum_i P(A_i)P(B \mid A_i)}$`, "Bayes-tétel"],
            [R`$P(AB) = P(A)\,P(B)$`, "függetlenség"],
            [R`$P(A \mid B) = \dfrac{P(AB)}{P(B)}$`, "feltételes valószínűség definíciója"]
          ]
        },
        {
          type: "numeric",
          q: "Egy cipőkereskedő az X, Y, Z gyártól 25, 35, ill. 40%-ban vásárol; a gyárak cipőinek 5, 4, ill. 2%-a hibás. Egy kiválasztott cipő hibás. Mi a valószínűsége, hogy az X gyárban készült?",
          answer: 0.0125 / 0.0345,
          explain: R`$P(\text{hibás}) = 0{,}25\cdot0{,}05 + 0{,}35\cdot0{,}04 + 0{,}40\cdot0{,}02 = 0{,}0345$; $P(X \mid \text{hibás}) = \tfrac{0{,}0125}{0{,}0345} \approx 0{,}362$.`
        },
        {
          type: "numeric",
          q: R`$A$ és $B$ független, $P(A) = 0{,}4$, $P(B) = 0{,}5$. Mennyi $P(A + B)$?`,
          answer: 0.7,
          explain: R`$P(A+B) = 0{,}4 + 0{,}5 - 0{,}4\cdot0{,}5 = 0{,}7$. (Vagy: $1 - 0{,}6\cdot0{,}5 = 0{,}7$.)`
        },
        {
          type: "numeric",
          q: "A 32 lapos magyar kártyából három lapot húzunk egymás után, visszatevés nélkül. Mi a valószínűsége, hogy mindhárom piros? (8 piros lap van.)",
          answer: 336 / 29760, tol: 0.0005,
          explain: R`$\tfrac{8}{32}\cdot\tfrac{7}{31}\cdot\tfrac{6}{30} = \tfrac{336}{29\,760} \approx 0{,}0113$.`
        },
        {
          type: "numeric",
          q: "Két, egymástól függetlenül 0,8 valószínűséggel működő elemet párhuzamosan kapcsolunk. Mi a valószínűsége, hogy a rendszer működik?",
          answer: 0.96,
          explain: R`Csak akkor áll le, ha mindkettő hibás: $1 - 0{,}2^2 = 0{,}96$.`
        },
        {
          q: R`Ha $P(A \mid B) = P(A)$ (és $P(A), P(B) > 0$), akkor…`,
          options: [
            R`$A$ és $B$ kizárják egymást.`,
            R`$P(B \mid A) = P(B)$ is teljesül, azaz $A$ és $B$ függetlenek.`,
            R`$P(B) = 1$.`,
            R`$A \subseteq B$.`
          ],
          answer: 1,
          explain: R`$P(A\mid B) = P(A) \iff P(AB) = P(A)P(B) \iff P(B \mid A) = P(B)$ – a függetlenség szimmetrikus.`
        },
        {
          q: "Egy bírósági ügyben a szakértő: „Ha a vádlott ártatlan, csak 1 : 10 000 az esélye, hogy a minta egyezik.” Mit jelent ez?",
          options: [
            "Azt, hogy a vádlott 99,99% valószínűséggel bűnös.",
            R`Azt, hogy $P(\text{egyezés} \mid \text{ártatlan}) = 0{,}0001$ – ebből $P(\text{ártatlan} \mid \text{egyezés})$ csak az a priori adatokkal együtt számolható.`,
            "Azt, hogy 10 000 emberből pontosan egy bűnös.",
            "Semmit, mert a valószínűség nem alkalmazható bíróságon."
          ],
          answer: 1,
          explain: R`Ez az <em>ügyész tévedése</em>: $P(E \mid \text{ártatlan})$ és $P(\text{ártatlan} \mid E)$ összekeverése. Egymillió lehetséges elkövetőből kb. 100-nak egyezne a mintája – egy egyezés önmagában messze nem bizonyíték.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
