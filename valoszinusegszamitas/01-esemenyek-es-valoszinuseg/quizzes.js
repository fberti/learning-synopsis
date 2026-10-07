/* =========================================================
   1. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;
  const DET = "Determinisztikus", STO = "Sztochasztikus";

  const QUIZZES = {
    /* ------------------------------------------------ 1.1 */
    "p1-11": {
      title: "Kvíz – 1.1 Bevezetés",
      questions: [
        {
          type: "match",
          q: "Determinisztikus vagy sztochasztikus? Párosítsd a jelenségeket!",
          choices: [DET, STO], shuffle: false,
          pairs: [
            ["Egy elejtett kő esési ideje légüres térben, adott magasságból", DET],
            ["Holnap esik-e az eső Budapesten", STO],
            ["Egy villanykörte élettartama", STO],
            ["A 10 V feszültségre kapcsolt 5 Ω-os ellenálláson átfolyó áram (Ohm-törvény)", DET],
            ["Hány vásárló lép be egy boltba 10 és 11 óra között", STO]
          ],
          explain: "Sztochasztikus, ha a figyelembe vett feltételek nem határozzák meg egyértelműen az eredményt."
        },
        {
          q: R`Mit jelent az, hogy egy szabályos kockával a hatos dobás valószínűsége $\tfrac16$?`,
          options: [
            "Hat dobásból pontosan egyszer lesz hatos.",
            "Nagyon sok dobás esetén a dobásoknak körülbelül a hatoda lesz hatos.",
            "Ha öt dobás óta nem jött hatos, a következő biztosan hatos lesz.",
            "A hatos dobása ritkább, mint a többi számé."
          ],
          answer: 1,
          explain: "A valószínűség a relatív gyakoriság „stabil” értéke hosszú kísérletsorozatban. Rövid távon bármi előfordulhat – és a kocka nem „emlékszik” a korábbi dobásokra."
        },
        {
          q: "Ki alkotta meg a valószínűségszámítás axiomatikus elméletét, és mikor?",
          options: ["Blaise Pascal, 1654", "Jakob Bernoulli, 1713", "Pierre-Simon Laplace, 1812", "Andrej Kolmogorov, 1933"],
          answer: 3,
          explain: "Kolmogorov 1933-ban a halmaz- és mértékelméletre építve adta meg az axiómákat. Pascal és Fermat 1654-es levelezése a tudományág kezdete."
        },
        {
          q: "Miért tekintjük véletlennek a pénzfeldobást?",
          options: [
            "Mert a pénzérme mozgásának nincs fizikai oka.",
            "Mert nem ismerjük (vagy nem vesszük figyelembe) az eredményt befolyásoló összes tényezőt.",
            "Mert a pénzérmék sosem szabályosak.",
            "Mert a fej és az írás valószínűsége különböző."
          ],
          answer: 1,
          explain: "A véletlen nem az okok hiánya, hanem az okok nem teljes ismerete."
        },
        {
          q: "Igaz vagy hamis? <em>„Ha 10 dobásból 4-szer jött ki a hatos, akkor a kocka biztosan cinkelt.”</em>",
          options: ["Igaz", "Hamis"],
          answer: 1,
          explain: "Kevés kísérletnél a relatív gyakoriság erősen ingadozik; 10 dobásból 4 hatos szabályos kockával is előfordul (kb. 5,4% eséllyel). Próbáld ki a fenti szimulátorral!"
        }
      ]
    },

    /* ------------------------------------------------ 1.2 */
    "p1-12": {
      title: "Kvíz – 1.2 Esemény, eseménytér, műveletek",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy piros és egy kék kockával dobunk. Hány elemi eseményből áll az eseménytér?",
          options: [R`$36$`, R`$12$`, R`$21$`, R`$30$`],
          answer: 0,
          explain: R`A piros kocka mind a 6 értékéhez a kék 6 értéke társulhat: $6\cdot 6 = 36$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kísérlet eseménytere $\Omega = \{\text{fej}, \text{írás}, \text{élére esik}\}$. Hány különböző esemény tartozik hozzá (a biztos és a lehetetlen eseményt is beleszámítva)?`,
          options: [R`$8$`, R`$3$`, R`$6$`, R`$7$`],
          answer: 0,
          explain: R`Minden részhalmaz egy esemény; egy 3 elemű halmaznak $2^3 = 8$ részhalmaza van.`
        },
        {
          type: "set",
          q: R`Kockadobás: $A = \{1,3,5\}$ (páratlan), $C = \{2,3,5\}$ (prím). Jelöld ki az $A\overline{C}$ esemény elemeit!`,
          items: [1, 2, 3, 4, 5, 6], answer: [1],
          explain: R`$\overline{C} = \{1,4,6\}$, így $A\overline{C} = \{1,3,5\}\cap\{1,4,6\} = \{1\}$: páratlan, de nem prím.`
        },
        {
          type: "set",
          q: R`Ugyanezekkel: jelöld ki az $\overline{A + C}$ esemény elemeit!`,
          items: [1, 2, 3, 4, 5, 6], answer: [4, 6],
          explain: R`$A + C = \{1,2,3,5\}$, ennek ellentettje $\{4,6\}$. Ugyanez: $\overline{A}\,\overline{C} = \{2,4,6\}\cap\{1,4,6\} = \{4,6\}$ (De Morgan).`
        },
        {
          q: R`Mivel egyenlő $\overline{AB}$?`,
          options: [R`$\overline{A}\,\overline{B}$`, R`$\overline{A} + \overline{B}$`, R`$A + B$`, R`$A\overline{B}$`],
          answer: 1,
          explain: R`De Morgan: „nem igaz, hogy mindkettő” = „legalább az egyik nem”: $\overline{AB} = \overline{A} + \overline{B}$.`
        },
        {
          type: "match",
          q: "Egy üzemben piros és zöld szalagon szállíthatnak alkatrészt. A: „a piros szalagon van szállítás”, B: „a zöld szalagon van szállítás”. Párosítsd!",
          pairs: [
            ["Mindkét szalagon van szállítás", "A·B"],
            ["Legalább az egyik szalagon van szállítás", "A + B"],
            ["Egyik szalagon sincs szállítás", "Ā·B̄"],
            ["Pontosan az egyik szalagon van szállítás", "A·B̄ + Ā·B"],
            ["Legfeljebb az egyik szalagon van szállítás", "Ā + B̄"]
          ],
          explain: R`Figyeld meg: „legfeljebb az egyik” $= \overline{AB} = \overline{A}+\overline{B}$, „egyik sem” $= \overline{A+B} = \overline{A}\,\overline{B}$.`
        },
        {
          type: "multi",
          q: "Kockadobásnál melyek alkotnak teljes eseményrendszert? (Több jó válasz is lehet.)",
          options: [
            R`$\{1,2\},\ \{3,4\},\ \{5,6\}$`,
            "páros, páratlan",
            "prím, nem prím",
            R`$\{1,2,3\},\ \{3,4,5,6\}$`,
            R`$\{1\},\ \{2,3\},\ \{4,5\}$`
          ],
          answer: [0, 1, 2],
          explain: R`A 4. nem, mert a 3 mindkettőben benne van (nem kizárók); az 5. nem, mert a 6-ot egyik sem tartalmazza (összegük nem $\Omega$).`
        },
        {
          q: "Melyik azonosság NEM igaz minden eseményre?",
          options: [R`$A + BC = (A+B)(A+C)$`, R`$A(B+C) = AB + AC$`, R`$(A+B) - C = A + (B-C)$`, R`$A + \overline{A} = \Omega$`],
          answer: 2,
          explain: R`Ellenpélda kockával: $A = \{1,3,5\}$, $B = \{2,4,6\}$, $C = \{2,3,5\}$: $(A+B)-C = \{1,4,6\}$, de $A + (B - C) = \{1,3,4,5,6\}$. A különbséggel óvatosan kell bánni!`
        }
      ]
    },

    /* ------------------------------------------------ 1.3 */
    "p1-13": {
      title: "Kvíz – 1.3 A valószínűség és axiómái",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy kockát 200-szor feldobtunk, és 38-szor jött ki hatos. Mennyi a hatos dobás relatív gyakorisága?",
          options: [R`$0{,}19$`, R`$0{,}38$`, R`$0{,}167$`, R`$0{,}81$`],
          answer: 0,
          explain: R`$k/n = 38/200 = 0{,}19$ – közel van az $1/6 \approx 0{,}167$-hez, de 200 dobásnál még bőven van ingadozás.`
        },
        {
          type: "multi",
          q: "Melyik szám lehet egy esemény valószínűsége?",
          options: ["0", "1", R`$1/\pi$`, R`$-0{,}1$`, R`$1{,}01$`, R`$7/5$`],
          answer: [0, 1, 2],
          explain: R`Az I. axióma szerint $0 \le P(A) \le 1$. $1/\pi \approx 0{,}318$ rendben van.`
        },
        {
          type: "single", shuffle: true,
          q: R`$P(A) = 0{,}35$. Mennyi $P(\overline{A})$?`,
          options: [R`$0{,}65$`, R`$0{,}35$`, R`$0{,}5$`, R`$0{,}55$`],
          answer: 0,
          explain: R`$P(\overline{A}) = 1 - P(A) = 0{,}65$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$P(A) = 0{,}5$, $P(B) = 0{,}4$, $P(AB) = 0{,}2$. Mennyi $P(A + B)$?`,
          options: [R`$0{,}7$`, R`$0{,}9$`, R`$0{,}5$`, R`$0{,}3$`],
          answer: 0,
          explain: R`$0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$.`
        },
        {
          q: R`$P(A) = 0{,}6$ és $P(B) = 0{,}7$. Lehetnek-e $A$ és $B$ egymást kizáró események?`,
          options: ["Igen, bármikor.", R`Nem, mert akkor $P(A+B) = 1{,}3 > 1$ lenne.`, "Csak ha függetlenek.", "Igen, ha a kísérletet elég sokszor ismételjük."],
          answer: 1,
          explain: R`Kizáró eseményekre $P(A+B) = P(A)+P(B)$, de ez nem lehet 1-nél nagyobb. Sőt: $P(AB) \ge 0{,}6 + 0{,}7 - 1 = 0{,}3$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$P(A+B) = 0{,}8$, $P(A) = 0{,}5$, $P(B) = 0{,}6$. Mennyi $P(AB)$?`,
          options: [R`$0{,}3$`, R`$0{,}2$`, R`$0{,}1$`, R`$0{,}4$`],
          answer: 0,
          explain: R`Az összeadási tételből: $P(AB) = P(A)+P(B)-P(A+B) = 0{,}5+0{,}6-0{,}8 = 0{,}3$.
            <details><summary>💡 Példa az érthetőség kedvéért</summary>
              <p>Egy cégnél <b>100 ember</b> dolgozik. $A$ = „beszél angolul” (<b>50</b> fő), $B$ = „beszél németül” (<b>60</b> fő),
                és legalább az egyik nyelvet <b>80</b> fő beszéli, vagyis $P(A+B) = 0{,}8$. Hányan beszélik <em>mindkettőt</em>?</p>
              <p>A két névsort összeadva $50 + 60 = 110$ nevet kapunk, pedig csak 80 különböző ember van.
                A többlet azoktól jön, akik <b>mindkét</b> névsorban szerepelnek, őket kétszer számoltuk:
                $110 - 80 = 30$ fő, tehát $P(AB) = 0{,}3$.</p>
              <table style="margin:.4rem 0">
                <tr><td>csak angolul</td><td>$50 - 30 = 20$</td></tr>
                <tr><td>angolul <b>és</b> németül</td><td>$30$</td></tr>
                <tr><td>csak németül</td><td>$60 - 30 = 30$</td></tr>
                <tr><td><b>legalább az egyiken</b></td><td>$20 + 30 + 30 = 80$ ✔</td></tr>
                <tr><td>egyiken sem</td><td>$100 - 80 = 20$</td></tr>
              </table>
              <p>Az összeadási tétel $-P(AB)$ tagja éppen ezt a kétszer számolt közös részt vonja le.
                Gyors ellenőrzés: már $P(A) + P(B) = 1{,}1 > 1$ is mutatja, hogy a két eseménynek <em>muszáj</em> átfednie.</p>
            </details>`
        },
        {
          type: "single", shuffle: true,
          q: R`$P(A) = 0{,}5$ és $P(AB) = 0{,}2$. Mennyi $P(A \setminus B)$?`,
          options: [R`$0{,}3$`, R`$0{,}2$`, R`$0{,}5$`, R`$0{,}7$`],
          answer: 0,
          explain: R`5. tétel: $P(A\setminus B) = P(A) - P(AB) = 0{,}3$.`
        },
        {
          q: R`Tudjuk, hogy $A \subseteq B$ és $P(B) = 0{,}3$. Melyik lehet $P(A)$ értéke?`,
          options: ["0,35", "0,5", "0,25", "1"],
          answer: 2,
          explain: R`Monotonitás: $A \subseteq B \Rightarrow P(A) \le P(B) = 0{,}3$.`
        },
        {
          type: "single", shuffle: true,
          q: "A 32 lapos magyar kártyából húzunk egy lapot. Mi a valószínűsége, hogy piros vagy ász? (Színenként 8 lap, mindegyik színben 1 ász.)",
          options: [R`$\tfrac{11}{32} \approx 0{,}344$`, R`$\tfrac{12}{32} \approx 0{,}375$`, R`$\tfrac{10}{32} \approx 0{,}313$`, R`$\tfrac{1}{32} \approx 0{,}031$`],
          answer: 0,
          explain: R`$P = \tfrac{8}{32} + \tfrac{4}{32} - \tfrac{1}{32} = \tfrac{11}{32} \approx 0{,}344$ (a piros ászt egyszer kell levonni).`
        }
      ]
    },

    /* ------------------------------------------------ 1.4 – 1.4.2 */
    "p1-14": {
      title: "Kvíz – 1.4 Valószínűségi mezők és kombinatorika",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Három versenyző indul: András esélye háromszorosa Bélának, Béla és Csaba esélye egyforma. Mi a valószínűsége, hogy András nyer?",
          options: [R`$0{,}6$`, R`$0{,}2$`, R`$0{,}75$`, R`$0{,}8$`],
          answer: 0,
          explain: R`$3p + p + p = 1 \Rightarrow p = 0{,}2$, így $P(\text{András}) = 0{,}6$.`
        },
        {
          q: R`Melyik számnégyes lehet egy négyelemű $\Omega$ valószínűség-eloszlása?`,
          options: ["0,1; 0,2; 0,3; 0,4", "0,5; 0,5; 0,1; −0,1", "0,3; 0,3; 0,3; 0,3", "0,25; 0,25; 0,25; 0,3"],
          answer: 0,
          explain: R`Feltétel: minden $p_i \ge 0$ és $\sum p_i = 1$. A 2. negatív értéket tartalmaz, a 3. összege 1,2, a 4.-é 1,05.`
        },
        {
          type: "single", shuffle: true,
          q: "Két szabályos kockával dobunk. Mi a valószínűsége, hogy a dobott számok összege 8?",
          options: [R`$\tfrac{5}{36} \approx 0{,}139$`, R`$\tfrac{6}{36} \approx 0{,}167$`, R`$\tfrac{4}{36} \approx 0{,}111$`, R`$\tfrac{3}{21} \approx 0{,}143$`],
          answer: 0,
          explain: R`Kedvező esetek: (2,6), (3,5), (4,4), (5,3), (6,2) – 5 db. $P = \tfrac{5}{36} \approx 0{,}139$.`
        },
        {
          type: "match",
          q: "Melyik kombinatorikai fogalom illik a feladathoz?",
          choices: ["permutáció", "ismétléses permutáció", "variáció", "ismétléses variáció", "kombináció", "ismétléses kombináció"],
          pairs: [
            ["Hányféle sorrendben ülhet le 5 ember 5 székre?", "permutáció"],
            ["Hány különböző négyjegyű PIN-kód létezik (0000–9999)?", "ismétléses variáció"],
            ["Hányféleképp választható 3 fős bizottság 10 emberből?", "kombináció"],
            ["Hányféleképp osztható ki arany-, ezüst- és bronzérem 8 versenyző között?", "variáció"],
            ["Hányféleképp kérhetünk 4 gombóc fagyit 6 ízből (egy íz többször is lehet)?", "ismétléses kombináció"],
            ["Hány különböző „szó” rakható ki a KAKAÓ betűiből?", "ismétléses permutáció"]
          ],
          explain: "A kulcskérdések: számít-e a sorrend, és lehet-e ismétlés?"
        },
        {
          type: "single", shuffle: true,
          q: "Hány hárombetűs „szó” képezhető az A, B, C, D, E betűkből, ha egy betű legfeljebb egyszer szerepelhet?",
          options: [R`$60$`, R`$125$`, R`$10$`, R`$120$`],
          answer: 0,
          explain: R`Ismétlés nélküli variáció: $V_5^3 = 5\cdot 4\cdot 3 = 60$.`
        },
        {
          type: "single", shuffle: true,
          q: "Hányféleképp választható ki egy 3 fős bizottság 10 ember közül?",
          options: [R`$120$`, R`$720$`, R`$30$`, R`$220$`],
          answer: 0,
          explain: R`$\binom{10}{3} = \tfrac{10\cdot9\cdot8}{3\cdot2\cdot1} = 120$.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány szelvényt kell kitölteni a hatos lottón (45 számból 6) a biztos telitalálathoz?",
          options: [R`$8\,145\,060$`, R`$5\,864\,443\,200$`, R`$8\,303\,765\,625$`, R`$1\,221\,759$`],
          answer: 0,
          explain: R`$\binom{45}{6} = 8\,145\,060$.`
        },
        {
          type: "single", shuffle: true,
          q: "Hány különböző betűsorrend készíthető a KAKAÓ szó betűiből?",
          options: [R`$30$`, R`$120$`, R`$60$`, R`$10$`],
          answer: 0,
          explain: R`5 betű, a K és az A is kétszer: $\dfrac{5!}{2!\,2!} = \dfrac{120}{4} = 30$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy kosárban 10 alma van, ebből 3 rothadt. Kiveszünk kettőt (visszatevés nélkül). Mi a valószínűsége, hogy egyik sem rothadt?",
          options: [R`$\tfrac{7}{15} \approx 0{,}467$`, R`$\tfrac{49}{100} \approx 0{,}49$`, R`$\tfrac{8}{15} \approx 0{,}533$`, R`$\tfrac{7}{30} \approx 0{,}233$`],
          answer: 0,
          explain: R`$\dfrac{\binom72}{\binom{10}2} = \dfrac{21}{45} = \dfrac{7}{15} \approx 0{,}467$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy urnában a golyók 30%-a piros. Visszatevéssel 3 golyót húzunk. Mi a valószínűsége, hogy pontosan egy piros lesz köztük?",
          options: [R`$0{,}441$`, R`$0{,}147$`, R`$0{,}189$`, R`$0{,}657$`],
          answer: 0,
          explain: R`$\binom31 \cdot 0{,}3 \cdot 0{,}7^2 = 3 \cdot 0{,}3 \cdot 0{,}49 = 0{,}441$.`
        }
      ]
    },

    /* ------------------------------------------------ 1.4.3 */
    "p1-142": {
      title: "Kvíz – 1.4.3 Híres feladatok",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Mi a valószínűsége, hogy egy kockával 3 dobásból legalább egyszer hatost dobunk?",
          options: [R`$\tfrac{91}{216} \approx 0{,}421$`, R`$\tfrac{125}{216} \approx 0{,}579$`, R`$\tfrac{75}{216} \approx 0{,}347$`, R`$\tfrac{108}{216} \approx 0{,}5$`],
          answer: 0,
          explain: R`$1 - (5/6)^3 = 1 - \tfrac{125}{216} = \tfrac{91}{216} \approx 0{,}421$.`
        },
        {
          q: "Legalább hány dobás kell egy kockával ahhoz, hogy a „legalább egy hatos” valószínűsége 1/2-nél nagyobb legyen?",
          options: ["3", "4", "5", "6"],
          answer: 1,
          explain: R`$1-(5/6)^3 \approx 0{,}42$, de $1-(5/6)^4 \approx 0{,}518$. A kritikus érték 4.`
        },
        {
          q: "Miért nem működik de Méré „arányossági szabálya” (4 : 6 = 24 : 36) pontosan?",
          options: [
            "Mert a két kocka nem független egymástól.",
            R`Mert a „legalább egyszer” valószínűsége nem lineárisan, hanem $1-(1-p)^s$ szerint nő $s$-sel.`,
            "Mert de Méré rosszul számolta meg a kimeneteleket.",
            "Mert a dupla hatos lehetetlen esemény."
          ],
          answer: 1,
          explain: R`A kritikus érték kb. $\ln 2 / p$; ez csak nagyon kis $p$-re arányos pontosan $1/p$-vel.`
        },
        {
          type: "single", shuffle: true,
          q: "Osztozkodás: Péternek még 1, Pálnak még 2 győzelem hiányzik (minden játszma 50–50%). Mekkora hányad jár igazságosan Péternek?",
          options: [R`$\tfrac{3}{4} \approx 0{,}75$`, R`$\tfrac{2}{3} \approx 0{,}667$`, R`$\tfrac{1}{2} \approx 0{,}5$`, R`$\tfrac{1}{4} \approx 0{,}25$`],
          answer: 0,
          explain: R`$n+m-1 = 2$ játszma dönt; Péter akkor nyer, ha ebből legalább 1-et megnyer: $1 - \tfrac14 = \tfrac34$.`
        },
        {
          type: "single", shuffle: true,
          q: "És ha Péternek 1, Pálnak 3 győzelem hiányzik?",
          options: [R`$\tfrac{7}{8} \approx 0{,}875$`, R`$\tfrac{3}{4} \approx 0{,}75$`, R`$\tfrac{1}{8} \approx 0{,}125$`, R`$\tfrac{15}{16} \approx 0{,}938$`],
          answer: 0,
          explain: R`3 játszma dönt; Pál csak akkor nyer, ha mindhármat megnyeri: $\tfrac18$. Így Péternek $\tfrac78$ jár.`
        },
        {
          q: "Legalább hány ember kell ahhoz, hogy 50%-nál nagyobb eséllyel legyen köztük két azonos születésnapú (365 nap)?",
          options: ["23", "57", "183", "366"],
          answer: 0,
          explain: R`23 embernél $P \approx 0{,}507$. 57 embernél már $\approx 0{,}99$!`
        },
        {
          q: "Hány ember esetén <em>biztos</em>, hogy van köztük két azonos születésnapú (szökőnapot nem számítva)?",
          options: ["183", "300", "365", "366"],
          answer: 3,
          explain: "Skatulya-elv: 365 napra 366 ember már biztosan nem fér el úgy, hogy mindenkinek külön napja legyen."
        },
        {
          type: "single", shuffle: true,
          q: "Három ember mindegyike a hét egy véletlen napján született. Mi a valószínűsége, hogy legalább kettő ugyanazon a napon?",
          options: [R`$\tfrac{133}{343} \approx 0{,}388$`, R`$\tfrac{210}{343} \approx 0{,}612$`, R`$\tfrac{126}{343} \approx 0{,}367$`, R`$\tfrac{147}{343} \approx 0{,}429$`],
          answer: 0,
          explain: R`$1 - \dfrac{7\cdot6\cdot5}{7^3} = 1 - \dfrac{210}{343} = \dfrac{133}{343} \approx 0{,}388$.`
        }
      ]
    },

    /* ------------------------------------------------ 1.4.2 – a Probability Demystified fejezetvégi tesztje alapján */
    "p1-komb": {
      title: "Teszt – 1.4.2 Kombinatorika",
      questions: [
        { q: R`Mennyi $6!$?`, options: ["6", "30", "120", "720"], answer: 3,
          explain: R`$6! = 6\cdot5\cdot4\cdot3\cdot2\cdot1 = 720$. (A 120 az $5!$, a 30 a $6\cdot5$.)` },
        { q: R`Mennyi $0!$?`, options: ["0", "1", "10", "100"], answer: 1,
          explain: R`Megállapodás szerint $0! = 1$. Így marad érvényes pl. $V_n^n = \frac{n!}{0!} = n!$ és $\binom{n}{0} = 1$.` },
        { q: R`Mennyi $V_8^3$ (8 elem harmadosztályú, ismétlés nélküli variációinak száma)?`, options: ["120", "256", "336", "432"], answer: 2,
          explain: R`$V_8^3 = \frac{8!}{5!} = 8\cdot7\cdot6 = 336$. (Gyakori hiba $\frac{8!}{3!}$-sal számolni: a nevezőben $(n-k)! = 5!$ áll.)` },
        { q: R`Mennyi $C_5^2 = \binom52$?`, options: ["10", "12", "120", "324"], answer: 0,
          explain: R`$\binom52 = \frac{5\cdot4}{2\cdot1} = 10$.` },
        { q: "Hány háromjegyű körzetszám képezhető, ha a számjegyek nem ismétlődhetnek?", options: ["100", "720", "1000", "504"], answer: 1,
          explain: R`A sorrend számít, ismétlés nincs: $V_{10}^3 = 10\cdot9\cdot8 = 720$. Az 1000 az ismétléses eset ($10^3$).` },
        { q: "Hányféleképpen választhat valaki egy könyvet 3 regényből, egyet 5 életrajzból és egyet 7 önsegítő könyvből?", options: ["15", "105", "3", "22"], answer: 1,
          explain: R`Szorzási szabály: $3\cdot5\cdot7 = 105$. (A 15 az összeg – az „és” nem összeadás!)` },
        { q: "Hányféleképpen rakható ki 7 különböző számológép egy sorban a polcra?", options: ["7", "49", "823 543", "5040"], answer: 3,
          explain: R`Ismétlés nélküli permutáció: $7! = 5040$. A $823\,543 = 7^7$ az lenne, ha ugyanaz a gép több helyre is kerülhetne.` },
        { q: "Egy 10 tagú igazgatótanácsból vezérigazgatót, igazgatót, pénztárost és titkárt választanak. Hányféleképpen?", options: ["5040", "210", "40", "14"], answer: 0,
          explain: R`Különböző tisztségek → számít a sorrend: $V_{10}^4 = 10\cdot9\cdot8\cdot7 = 5040$. A 210 a $\binom{10}{4}$ lenne (ha egyenrangú tagokat választanánk).` },
        { q: "Hány különböző zászlójelzés készíthető 3 piros, 2 zöld és 2 fehér zászlóból (mind a 7-et egy sorban kitűzve)?", options: ["49", "84", "210", "320"], answer: 2,
          explain: R`Ismétléses permutáció: $\frac{7!}{3!\,2!\,2!} = \frac{5040}{24} = 210$.` },
        { q: "Hányféleképpen választható ki 12 doboz gabonapehelyből 3 bevizsgálásra?", options: ["36", "220", "480", "1320"], answer: 1,
          explain: R`A sorrend nem számít: $\binom{12}{3} = 220$. Az 1320 a $V_{12}^3$ – ott a sorrendet is számolnánk.` },
        { q: "Hányféleképpen állítható össze egy 5 férfiből és 7 nőből álló esküdtszék 10 férfi és 10 nő közül?", options: ["120", "252", "372", "30 240"], answer: 3,
          explain: R`5 férfi a 10-ből <b>és</b> 7 nő a 10-ből: $\binom{10}{5}\cdot\binom{10}{7} = 252 \cdot 120 = 30\,240$. A 372 a két szám összege – az „és” szorzás!` },
        { q: "Egy mellékállomás száma 3 számjegyből áll, minden számjegy egyforma eséllyel, ismétlés megengedett. Mi a valószínűsége, hogy az 1, 2, 3 számjegyekből áll (tetszőleges sorrendben)?", options: ["0,555", "0,006", "0,233", "0,125"], answer: 1,
          explain: R`Összes: ismétléses variáció, $10^3 = 1000$. Kedvező: az 1, 2, 3 sorrendjei, $3! = 6$. $P = \frac{6}{1000} = 0{,}006$.` },
        { q: "Egy 52 lapos pakliból véletlenszerűen húzunk 3 lapot. Mi a valószínűsége, hogy mindhárom treff?", options: ["0,002", "0,034", "0,013", "0,127"], answer: 2,
          explain: R`$\frac{\binom{13}{3}}{\binom{52}{3}} = \frac{286}{22\,100} \approx 0{,}013$.` },
        { q: "Egy antikváriumban 6 regény és 4 életrajz van. Valaki véletlenszerűen kiválaszt 4 könyvet. Mi a valószínűsége, hogy 2 regényt és 2 életrajzot választ?", options: ["0,383", "0,562", "0,137", "0,429"], answer: 3,
          explain: R`$\frac{\binom62\binom42}{\binom{10}{4}} = \frac{15\cdot6}{210} = \frac{90}{210} \approx 0{,}429$.` },
        { q: "Egy lottón 20 számból kell 4-et eltalálni (a sorrend nem számít, ismétlés nincs). Mi a nyerés valószínűsége egy szelvénnyel?", options: ["0,0002", "0,0034", "0,0018", "0,0015"], answer: 0,
          explain: R`$\binom{20}{4} = 4845$ lehetséges számnégyes van, ebből 1 nyer: $P = \frac{1}{4845} \approx 0{,}0002$.` }
      ]
    },

    /* ------------------------------------------------ 1.5 */
    "p1-15": {
      title: "Kvíz – 1.5 Geometriai valószínűség",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy $r$ sugarú körlapon véletlen pontot választunk. Mi a valószínűsége, hogy a vele koncentrikus $r/3$ sugarú körbe esik?`,
          options: [R`$\tfrac{1}{9} \approx 0{,}111$`, R`$\tfrac{1}{3} \approx 0{,}333$`, R`$\tfrac{8}{9} \approx 0{,}889$`, R`$\tfrac{1}{27} \approx 0{,}037$`],
          answer: 0,
          explain: R`$\dfrac{\pi(r/3)^2}{\pi r^2} = \dfrac19$.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 1 m hosszú rudat egy véletlen pontban kettétörünk. Mi a valószínűsége, hogy a rövidebb darab 20 cm-nél rövidebb?",
          options: [R`$0{,}4$`, R`$0{,}2$`, R`$0{,}6$`, R`$0{,}8$`],
          answer: 0,
          explain: R`A töréspont a $[0; 0{,}2)$ vagy a $(0{,}8; 1]$ szakaszba kell essen: összhossz $0{,}4$ m, $P = 0{,}4$.`
        },
        {
          type: "single", shuffle: true,
          q: "A busz pontosan 10 percenként jár. Véletlen időpontban érkezünk a megállóba. Mi a valószínűsége, hogy 3 percnél kevesebbet várunk?",
          options: [R`$0{,}3$`, R`$0{,}7$`, R`$0{,}15$`, R`$0{,}03$`],
          answer: 0,
          explain: R`A „kedvező” időszakasz 3 perc a 10-ből: $P = 0{,}3$.`
        },
        {
          q: "Egy szakaszon egyenletes eloszlással választunk pontot. Mekkora a valószínűsége, hogy pontosan a felezőpontot választjuk?",
          options: ["1/2", "0", "Nagyon kicsi, de pozitív", "Nem értelmezhető"],
          answer: 1,
          explain: "Egy pont „hossza” 0, így valószínűsége is 0 – mégsem lehetetlen esemény! Folytonos esetben a 0 valószínűség nem jelent lehetetlenséget."
        },
        {
          type: "single", shuffle: true,
          q: "Egy 2 egység oldalú négyzetbe írt kör. Mi a valószínűsége, hogy a négyzet egy véletlen pontja a körbe esik?",
          options: [R`$\tfrac{\pi}{4} \approx 0{,}785$`, R`$1-\tfrac{\pi}{4} \approx 0{,}215$`, R`$\tfrac{\pi}{8} \approx 0{,}393$`, R`$\tfrac{\pi}{16} \approx 0{,}196$`],
          answer: 0,
          explain: R`$\dfrac{\pi \cdot 1^2}{2^2} = \dfrac{\pi}{4} \approx 0{,}785$.`
        },
        {
          type: "single", shuffle: true,
          q: "Randevú: ketten 12 és 13 óra között véletlen időpontban érkeznek, és 30 percet várnak a másikra. Mi a valószínűsége, hogy találkoznak?",
          options: [R`$0{,}75$`, R`$0{,}25$`, R`$0{,}5$`, R`$0{,}875$`],
          answer: 0,
          explain: R`$1 - \left(\tfrac{30}{60}\right)^2 = 1 - \tfrac14 = 0{,}75$.`
        },
        {
          q: "Monte-Carlo: az egységnégyzetbe szórt 1000 pontból 780 esett a negyedkörbe. Mennyi a π becsült értéke?",
          options: ["3,00", "3,12", "3,14", "7,80"],
          answer: 1,
          explain: R`$\pi \approx 4 \cdot \tfrac{780}{1000} = 3{,}12$. Több ponttal pontosabb becslés várható.`
        }
      ]
    },

    /* ------------------------------------------------ Fejezetzáró */
    "p1-final": {
      title: "Fejezetzáró teszt – 1. fejezet",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Három érmét feldobunk. Mi a valószínűsége, hogy pontosan két fej lesz?",
          options: [R`$\tfrac{3}{8} \approx 0{,}375$`, R`$\tfrac{1}{4} \approx 0{,}25$`, R`$\tfrac{1}{8} \approx 0{,}125$`, R`$\tfrac{1}{2} \approx 0{,}5$`],
          answer: 0,
          explain: R`FFI, FIF, IFF: 3 kedvező a 8-ból.`
        },
        {
          type: "single", shuffle: true,
          q: "A 32 lapos magyar kártyából két lapot húzunk. Mi a valószínűsége, hogy mindkettő ász?",
          options: [R`$\tfrac{6}{496} \approx 0{,}0121$`, R`$\tfrac{1}{64} \approx 0{,}0156$`, R`$\tfrac{12}{496} \approx 0{,}0242$`, R`$\tfrac{6}{992} \approx 0{,}0060$`],
          answer: 0,
          explain: R`$\dfrac{\binom42}{\binom{32}2} = \dfrac{6}{496} \approx 0{,}0121$.`
        },
        {
          type: "single", shuffle: true,
          q: R`$A$ és $B$ egymást kizáró események, $P(A) = 0{,}3$, $P(B) = 0{,}4$. Mennyi $P(\overline{A}\,\overline{B})$?`,
          options: [R`$0{,}3$`, R`$0{,}7$`, R`$0{,}42$`, R`$0{,}12$`],
          answer: 0,
          explain: R`$\overline{A}\,\overline{B} = \overline{A+B}$, így $P = 1 - (0{,}3 + 0{,}4) = 0{,}3$.`
        },
        {
          type: "set",
          q: R`Kockadobás: $A$ = páratlan, $B$ = páros, $C$ = prím. Jelöld ki a $(B + C) \setminus A$ esemény elemeit!`,
          items: [1, 2, 3, 4, 5, 6], answer: [2, 4, 6],
          explain: R`$B + C = \{2,3,4,5,6\}$; ebből elhagyjuk a páratlanokat: $\{2,4,6\}$.`
        },
        {
          type: "single", shuffle: true,
          q: "4 fiú és 3 lány véletlenszerű sorrendben sorba áll. Mi a valószínűsége, hogy a sor mindkét végén lány áll?",
          options: [R`$\tfrac{1}{7} \approx 0{,}143$`, R`$\tfrac{3}{7} \approx 0{,}429$`, R`$\tfrac{9}{49} \approx 0{,}184$`, R`$\tfrac{6}{49} \approx 0{,}122$`],
          answer: 0,
          explain: R`A két szélre $3\cdot2 = 6$-féleképp állhat lány, a többi 5 ember $5! = 120$-féleképp: $\dfrac{720}{7!} = \dfrac{720}{5040} = \dfrac17$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy cinkelt kockánál az $i$ dobásának valószínűsége $i/21$. Mi a valószínűsége a hatosnak?`,
          options: [R`$\tfrac{6}{21} \approx 0{,}286$`, R`$\tfrac{1}{6} \approx 0{,}167$`, R`$\tfrac{1}{21} \approx 0{,}048$`, R`$\tfrac{5}{21} \approx 0{,}238$`],
          answer: 0,
          explain: R`$\tfrac{6}{21} = \tfrac27 \approx 0{,}286$ – több mint másfélszerese a szabályos kocka $\tfrac16$-ának.`
        },
        {
          q: "Egy esemény relatív gyakorisága 1000 kísérletben 0,47 lett. Melyik állítás a legpontosabb?",
          options: [
            "Az esemény valószínűsége pontosan 0,47.",
            "Az esemény valószínűsége valószínűleg 0,47 közelében van.",
            "A következő 1000 kísérletben is pontosan 470-szer következik be.",
            "Az esemény valószínűsége biztosan 0,5."
          ],
          answer: 1,
          explain: "A relatív gyakoriság a valószínűség becslése; a valószínűség körül ingadozik, de nem egyenlő vele."
        },
        {
          type: "single", shuffle: true,
          q: "25 termék közül 5 hibás. Visszatevés nélkül 4-et kiválasztunk. Mi a valószínűsége, hogy pontosan 1 hibás lesz köztük?",
          options: [R`$\approx 0{,}451$`, R`$\approx 0{,}410$`, R`$\approx 0{,}090$`, R`$\approx 0{,}617$`],
          answer: 0,
          explain: R`$\dfrac{\binom51\binom{20}3}{\binom{25}4} = \dfrac{5\cdot1140}{12650} \approx 0{,}451$.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $[0, 1]$ intervallumból egyenletesen választunk egy $x$ számot. Mi a valószínűsége, hogy $x^2 < 0{,}25$?`,
          options: [R`$0{,}5$`, R`$0{,}25$`, R`$0{,}75$`, R`$0{,}0625$`],
          answer: 0,
          explain: R`$x^2 < 0{,}25 \iff x < 0{,}5$ (mivel $x \ge 0$), ennek hossza 0,5.`
        },
        {
          type: "multi",
          q: R`Mely állítások igazak <b>tetszőleges</b> $A$, $B$ eseményekre?`,
          options: [R`$P(A+B) \le P(A) + P(B)$`, R`$P(AB) \le P(A)$`, R`$P(A+B) = P(A) + P(B)$`, R`$P(\overline{A}) = 1 - P(A)$`, R`$P(AB) = P(A)\,P(B)$`],
          answer: [0, 1, 3],
          explain: R`A 3. csak kizáró eseményekre igaz; az 5. csak <em>független</em> eseményekre – erről a 2. fejezetben lesz szó!`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
