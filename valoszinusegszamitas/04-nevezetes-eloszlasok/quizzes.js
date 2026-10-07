/* =========================================================
   4. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;
  const BIN = "binomiális", POI = "Poisson", HYP = "hipergeometrikus", GEO = "geometriai", EXP = "exponenciális", NOR = "normális", UNI = "egyenletes";

  const QUIZZES = {
    /* ------------------------------------------------ 4.1 */
    "p4-421": {
      title: "Kvíz – 4.1 Binomiális eloszlás",
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
          hint: "Binomiálishoz független, azonos esélyű kísérletek kellenek – melyik esetben változik az esély húzásról húzásra?",
          explain: "Visszatevés nélkül a húzások nem függetlenek (a piros esélye húzásról húzásra változik) – ez hipergeometrikus eloszlás."
        },
        {
          type: "single", shuffle: true,
          q: "Tízszer feldobunk egy szabályos érmét. Mi a valószínűsége, hogy pontosan 5 fej lesz?",
          options: [
            R`$\tfrac{63}{256} \approx 0{,}246$`,
            R`$\tfrac{1}{1024} \approx 0{,}001$`,
            R`$\tfrac{1}{2} = 0{,}5$`,
            R`$\tfrac{1}{11} \approx 0{,}091$`
          ],
          answer: 0,
          hint: R`Binomiális eloszlás $n = 10$, $p = \tfrac12$ – ne felejtsd el, hányféle sorrendben jöhet ki az 5 fej!`,
          explain: R`$\binom{10}{5}\left(\tfrac12\right)^{10} = \tfrac{252}{1024} \approx 0{,}246$. A „legvalószínűbb” eredmény is csak kb. 25%-os! Gyakori hiba a $\binom{10}{5}$ szorzó elhagyása ($\tfrac{1}{1024}$).`
        },
        {
          type: "single", shuffle: true,
          q: R`$X$ binomiális eloszlású, $n = 20$, $p = 0{,}3$. Mennyi $D^2(X)$?`,
          options: [
            R`$4{,}2$`,
            R`$6$`,
            R`$2{,}05$`,
            R`$1{,}8$`
          ],
          answer: 0,
          hint: R`A binomiális szórásnégyzet képlete $npq$ – vigyázz, ne a várható értéket vagy a szórást add meg!`,
          explain: R`$D^2(X) = npq = 20\cdot0{,}3\cdot0{,}7 = 4{,}2$ (a várható érték $np = 6$). Gyakori hiba a szórás ($\sqrt{4{,}2} \approx 2{,}05$) vagy a várható érték megadása.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 5 kérdéses tesztben minden kérdésre 4 válasz közül pontosan egy jó. Ha minden kérdésre tippelünk, mi a valószínűsége, hogy legalább 4 válaszunk helyes?",
          options: [
            R`$\tfrac{16}{1024} \approx 0{,}0156$`,
            R`$\tfrac{15}{1024} \approx 0{,}0146$`,
            R`$\tfrac{4}{1024} \approx 0{,}0039$`,
            R`$\tfrac{648}{1024} \approx 0{,}633$`
          ],
          answer: 0,
          hint: R`Binomiális, $p = \tfrac14$; a „legalább 4” két tagot jelent: $P(X = 4) + P(X = 5)$.`,
          explain: R`$\binom54\left(\tfrac14\right)^4\tfrac34 + \left(\tfrac14\right)^5 = \tfrac{15 + 1}{1024} \approx 0{,}0156$. Gyakori hiba csak a $P(X = 4)$ tagot venni, vagy elhagyni a $\binom54$ szorzót.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2 */
    "p4-422": {
      title: "Kvíz – 4.2 Geometriai eloszlás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Átlagosan hányadik dobásra jön ki az első hatos egy szabályos kockával?",
          options: [
            R`$6$`,
            R`$5$`,
            R`$4$`,
            R`$3{,}5$`
          ],
          answer: 0,
          hint: R`Geometriai eloszlás, $p = \tfrac16$ – a kérdés a hatos <em>sorszáma</em>, nem az előtte lévő kudarcok száma.`,
          explain: R`A geometriai eloszlás várható értéke $\tfrac1p = 6$. Az 5 a hatos előtti sikertelen dobások átlagos száma – a kérdés a hatos sorszámára vonatkozik.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a valószínűsége, hogy egy érmével az első fej éppen a 3. dobásnál jön?",
          options: [
            R`$\tfrac{1}{8} = 0{,}125$`,
            R`$\tfrac{1}{2} = 0{,}5$`,
            R`$\tfrac{3}{8} = 0{,}375$`,
            R`$\tfrac{7}{8} = 0{,}875$`
          ],
          answer: 0,
          hint: "Írd fel, pontosan milyen dobássorozatot jelent ez az esemény – itt a sorrend is rögzített.",
          explain: R`Írás, írás, fej: $\left(\tfrac12\right)^2\cdot\tfrac12 = \tfrac18$. Az $\tfrac38$ a „pontosan egy fej 3 dobásból” (binomiális) valószínűsége – itt a sorrend is számít.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy szabályos érmét addig dobunk, amíg fejet nem kapunk. Mi a valószínűsége, hogy 3-nál több dobásra lesz szükség?",
          options: [
            R`$\tfrac{1}{8} = 0{,}125$`,
            R`$\tfrac{1}{16} = 0{,}0625$`,
            R`$\tfrac{7}{8} = 0{,}875$`,
            R`$\tfrac{3}{8} = 0{,}375$`
          ],
          answer: 0,
          hint: "Fogalmazd át: mi történik az első néhány dobásban, ha 3-nál több dobás kell az első fejig?",
          explain: R`3-nál több dobás kell $\iff$ az első 3 dobás mind írás: $P(X \gt 3) = q^3 = \left(\tfrac12\right)^3 = \tfrac18$. Az $\tfrac{1}{16} = q^4$ a $P(X \gt 4)$, a $\tfrac78 = 1 - q^3$ pedig a $P(X \le 3)$ – az ellentett esemény.`
        },
        {
          type: "multi",
          q: "Melyik változó geometriai eloszlású?",
          options: [
            "Hányadik dobásra jön ki először hatos egy kockával.",
            "Hány hatos lesz 10 kockadobásból.",
            "Hányadik próbálkozásra sikerül először egy 30%-os eséllyel bejutó szabaddobás (a dobások függetlenek).",
            "Hány piros golyót húzunk 5 húzásból visszatevés nélkül.",
            "Hány hívás érkezik egy óra alatt egy ügyfélszolgálatra."
          ],
          answer: [0, 2],
          hint: "Geometriai: ismétlés az első sikerig, és a kérdés az, hányadik kísérletnél jön a siker – nem a sikerek száma.",
          explain: R`Geometriai: független, azonos esélyű kísérleteket ismételünk <em>az első sikerig</em>, és azt kérdezzük, hányadik kísérletnél jön a siker. A 10 dobásból a hatosok száma binomiális (rögzített számú kísérlet, a sikerek <em>száma</em> a kérdés), a visszatevés nélküli húzás hipergeometrikus, a hívások száma Poisson.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy szabályos kockával már 5 dobás óta nem jött hatos. Mi a valószínűsége, hogy a következő dobás hatos lesz?",
          options: [
            R`$\tfrac{1}{6} \approx 0{,}167$`,
            R`$1 - \left(\tfrac56\right)^5 \approx 0{,}598$`,
            R`$\left(\tfrac56\right)^5\cdot\tfrac16 \approx 0{,}067$`,
            R`$\tfrac{5}{6} \approx 0{,}833$`
          ],
          answer: 0,
          hint: "Számít-e a kocka szempontjából, mi történt a korábbi dobásokban? Gondolj a függetlenségre.",
          explain: R`A dobások függetlenek, a kocka nem „emlékszik”: a következő dobás hatos esélye most is $\tfrac16$. Ez a geometriai eloszlás örökifjú tulajdonsága: $P(X \gt k + m \mid X \gt k) = P(X \gt m)$. A $\left(\tfrac56\right)^5\cdot\tfrac16$ annak az esélye, hogy <em>előre nézve</em> éppen a 6. dobás lesz az első hatos – de az első 5 dobás már megtörtént.`
        }
      ]
    },

    /* ------------------------------------------------ 4.3 */
    "p4-423": {
      title: "Kvíz – 4.3 Hipergeometrikus eloszlás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Az ötöslottón (90 számból 5-öt húznak) egy szelvénnyel mi a valószínűsége, hogy pontosan 2 találatunk lesz?",
          options: [
            R`$0{,}0225$`,
            R`$0{,}0022$`,
            R`$0{,}0260$`,
            R`$0{,}0025$`
          ],
          answer: 0,
          hint: R`Hipergeometrikus eloszlás: kedvező kiválasztások / összes kiválasztás – 5 nyerő és 85 nem nyerő szám közül választunk.`,
          explain: R`$\dfrac{\binom52\binom{85}{3}}{\binom{90}{5}} = \dfrac{10\cdot98\,770}{43\,949\,268} \approx 0{,}0225$ – kb. minden 44. szelvény kettes. A $0{,}0260$ a visszatevéses (binomiális) modell eredménye, ami itt pontatlan.`
        },
        {
          type: "single", shuffle: true,
          q: "10 alkatrész közül 3 hibás. Visszatevés nélkül kiveszünk 4-et. Hány hibás lesz átlagosan a kivettek között?",
          options: [
            R`$1{,}2$`,
            R`$0{,}3$`,
            R`$0{,}84$`,
            R`$2{,}8$`
          ],
          answer: 0,
          hint: R`A hipergeometrikus várható érték ugyanúgy $n$-szer a hibásak aránya, mint a binomiálisnál.`,
          explain: R`$E(X) = n\tfrac MN = 4\cdot\tfrac{3}{10} = 1{,}2$ – ugyanannyi, mint visszatevéssel. A $0{,}84$ a binomiális szórásnégyzet ($npq$), nem várható érték.`
        },
        {
          type: "single", shuffle: true,
          q: "Ugyanebben a helyzetben mi a valószínűsége, hogy egyik kivett alkatrész sem hibás?",
          options: [
            R`$\tfrac{1}{6} \approx 0{,}167$`,
            R`$\tfrac{2401}{10\,000} \approx 0{,}240$`,
            R`$\tfrac{5}{6} \approx 0{,}833$`,
            R`$\tfrac{7}{24} \approx 0{,}292$`
          ],
          answer: 0,
          hint: "Hipergeometrikus: mind a 4-et a 7 jó alkatrész közül kell választani – visszatevés nélkül!",
          explain: R`$\dfrac{\binom30\binom74}{\binom{10}{4}} = \dfrac{35}{210} = \dfrac16$. A $0{,}7^4 = 0{,}2401$ visszatevéses húzásra lenne igaz.`
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
          hint: "Mikor alig változik a sokaság összetétele attól, hogy kiveszünk néhány elemet?",
          explain: R`Ha $N \gg n$, egy-egy kivett elem alig változtat az összetételen, így a visszatevés nélküli húzás „majdnem” visszatevéses. A szórásnégyzetben a $\tfrac{N-n}{N-1}$ korrekciós tényező ilyenkor közel 1.`
        }
      ]
    },

    /* ------------------------------------------------ 4.4 */
    "p4-424": {
      title: "Kvíz – 4.4 Poisson-eloszlás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Egy ügyfélszolgálatra percenként átlagosan 2 hívás érkezik (Poisson-eloszlás). Mi a valószínűsége, hogy egy adott percben egy sem érkezik?",
          options: [
            R`$0{,}135$`,
            R`$0{,}865$`,
            R`$0{,}271$`,
            R`$0{,}607$`
          ],
          answer: 0,
          hint: R`Poisson-eloszlás $\lambda = 2$-vel; a $P(X = k)$ képletébe $k = 0$-t kell helyettesíteni.`,
          explain: R`$P(X = 0) = e^{-2} \approx 0{,}135$. A $2e^{-2} \approx 0{,}271$ a $P(X = 1)$ – a $P(X = 0)$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "λ = 3 paraméterű Poisson-eloszlásnál mennyi P(X ≥ 1)?",
          options: [
            R`$0{,}950$`,
            R`$0{,}050$`,
            R`$0{,}801$`,
            R`$0{,}851$`
          ],
          answer: 0,
          hint: "Használd az ellentett eseményt – melyik egyetlen értéket kell kizárni?",
          explain: R`$1 - P(X = 0) = 1 - e^{-3} \approx 0{,}950$. Gyakori hiba a $P(X = 1)$-et vonni ki 1-ből a $P(X = 0)$ helyett ($\approx 0{,}851$).`
        },
        {
          q: "Mennyi a λ paraméterű Poisson-eloszlás várható értéke és szórásnégyzete?",
          options: ["mindkettő λ", "λ és λ²", "λ és √λ", "1/λ és 1/λ²"],
          answer: 0,
          hint: "Ez a Poisson-eloszlás egyik nevezetes, megkülönböztető tulajdonsága – figyelj, szórást vagy szórásnégyzetet kérdez!",
          explain: R`$E(X) = D^2(X) = \lambda$. Ez gyakorlati próbája is a Poisson-modellnek: a darabszámok átlaga és szórásnégyzete közel egyenlő.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy 1000 darabos szállítmányban az alkatrészek 0,3%-a hibás. Poisson-közelítéssel mi a valószínűsége, hogy egyetlen hibás sincs benne?",
          options: [
            R`$0{,}0498$`,
            R`$0{,}7408$`,
            R`$0{,}9502$`,
            R`$0{,}1494$`
          ],
          answer: 0,
          hint: R`Binomiálist közelítünk Poissonnal: $\lambda = np$ – figyelj a százalék helyes átváltására!`,
          explain: R`$\lambda = np = 1000\cdot0{,}003 = 3$, $P(X = 0) \approx e^{-3} \approx 0{,}0498$. (A pontos binomiális érték $0{,}997^{1000} \approx 0{,}0496$.) Ha a 0,3%-ot 0,03%-nak vesszük, $\lambda = 0{,}3$ és $e^{-0{,}3} \approx 0{,}741$ jönne ki.`
        },
        {
          q: "Melyik jelenséget írja le tipikusan Poisson-eloszlás?",
          options: ["egy ember testmagassága", "egy óra alatt beérkező e-mailek száma", "hány dobás kell az első hatosig", "egy izzó élettartama"],
          answer: 1,
          hint: "Poisson: rögzített időszakban (vagy területen) bekövetkező ritka, független események darabszáma.",
          explain: "Sok, egymástól független, egyenként ritka esemény darabszáma egy rögzített időintervallumban (vagy területen) – ez a Poisson-eloszlás terepe."
        }
      ]
    },

    /* ------------------------------------------------ 4.5 */
    "p4-432": {
      title: "Kvíz – 4.5 Egyenletes és exponenciális eloszlás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A kapcsolási idő egyenletes eloszlású 10 és 100 másodperc között. Mi a valószínűsége, hogy legalább 50 másodpercet kell várni?",
          options: [
            R`$\tfrac{5}{9} \approx 0{,}556$`,
            R`$\tfrac{1}{2} = 0{,}5$`,
            R`$\tfrac{4}{9} \approx 0{,}444$`,
            R`$\tfrac{2}{5} = 0{,}4$`
          ],
          answer: 0,
          hint: R`Egyenletes eloszlásnál a valószínűség = a kérdezett szakasz hossza / a teljes intervallum hossza – az intervallum nem 0-nál kezdődik!`,
          explain: R`$P(X \ge 50) = \tfrac{100 - 50}{100 - 10} = \tfrac59 \approx 0{,}556$. Az $\tfrac12 = \tfrac{50}{100}$ hibásan a $[0; 100]$ intervallummal számol.`
        },
        {
          type: "single", shuffle: true,
          q: "Mennyi a [2; 8] intervallumon egyenletes eloszlás szórása?",
          options: [
            R`$1{,}732$`,
            R`$3$`,
            R`$0{,}5$`,
            R`$0{,}707$`
          ],
          answer: 0,
          hint: R`Egyenletes eloszlás szórásnégyzete $\tfrac{(b-a)^2}{12}$ – a kérdés a szórás, ne felejts el gyököt vonni!`,
          explain: R`$D = \tfrac{b - a}{\sqrt{12}} = \tfrac{6}{\sqrt{12}} = \sqrt3 \approx 1{,}732$. A 3 a szórásnégyzet, nem a szórás.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy alkatrész élettartama exponenciális eloszlású, átlagosan 500 óra. Mi a valószínűsége, hogy 1000 óránál tovább működik?",
          options: [
            R`$0{,}135$`,
            R`$0{,}865$`,
            R`$0{,}607$`,
            R`$0{,}393$`
          ],
          answer: 0,
          hint: R`Exponenciális eloszlás: $\lambda = \tfrac{1}{\text{átlag}}$, és $P(X \gt t) = e^{-\lambda t}$.`,
          explain: R`$P(X \gt 1000) = e^{-1000/500} = e^{-2} \approx 0{,}135$. Gyakori hiba a $\lambda$ és a várható érték felcserélése: $e^{-500/1000} \approx 0{,}607$.`
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
          hint: "Gondolj az exponenciális eloszlás „emlékezetnélküli” tulajdonságára.",
          explain: R`Az exponenciális eloszlás „örökifjú”: $P(X \gt t + s \mid X \gt t) = P(X \gt s)$. (Valódi izzók persze öregszenek – ott a modell csak közelítés.)`
        },
        {
          type: "single", shuffle: true,
          q: "λ = 0,1 paraméterű exponenciális eloszlás. Mennyi a medián?",
          options: [
            R`$6{,}93$`,
            R`$10$`,
            R`$5$`,
            R`$0{,}069$`
          ],
          answer: 0,
          hint: R`A medián az az $x$, ahol $F(x) = \tfrac12$ – oldd meg az $1 - e^{-\lambda x} = \tfrac12$ egyenletet, vigyázz az osztásra!`,
          explain: R`$1 - e^{-0{,}1x} = \tfrac12 \Rightarrow x = 10\ln2 \approx 6{,}93$ – kisebb, mint a várható érték (10): az eloszlás jobbra ferde. Gyakori hiba: $\tfrac{\ln2}{10}$ helyett $\lambda\ln 2 \approx 0{,}069$.`
        }
      ]
    },

    /* ------------------------------------------------ 4.6 */
    "p4-433": {
      title: "Kvíz – 4.6 Normális eloszlás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$X^* \sim N(0, 1)$, és $\Phi(1) = 0{,}8413$. Mennyi $P(X^* \gt 1)$?`,
          options: [
            R`$0{,}1587$`,
            R`$0{,}8413$`,
            R`$0{,}3174$`,
            R`$0{,}6827$`
          ],
          answer: 0,
          hint: R`Rajzold le a haranggörbét: $\Phi(1)$ az 1-től <em>balra</em> eső terület – te a jobb oldalit keresed.`,
          explain: R`$1 - \Phi(1) = 0{,}1587$. A $0{,}8413$ a $P(X^* \lt 1)$ – a komplementer valószínűség.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az IQ $N(100, 15)$ eloszlású. Mi a valószínűsége, hogy valakinek 130-nál kisebb az IQ-ja? ($\Phi(2) = 0{,}9772$)`,
          options: [
            R`$0{,}9772$`,
            R`$0{,}0228$`,
            R`$0{,}9545$`,
            R`$0{,}4772$`
          ],
          answer: 0,
          hint: R`Standardizálj: $z = \tfrac{x - m}{\sigma}$, és figyelj, hogy egyoldali vagy kétoldali valószínűséget kérdeznek.`,
          explain: R`$z = \tfrac{130 - 100}{15} = 2$, $P = \Phi(2) = 0{,}9772$. A $0{,}9545$ a $P(70 \lt X \lt 130)$ lenne (kétoldali).`
        },
        {
          type: "single", shuffle: true,
          q: R`$X \sim N(m, \sigma)$. Mennyi $P(m - \sigma \lt X \lt m + \sigma)$?`,
          options: [
            R`$0{,}6827$`,
            R`$0{,}8413$`,
            R`$0{,}3413$`,
            R`$0{,}9545$`
          ],
          answer: 0,
          hint: R`Standardizálj, és fejezd ki az intervallum valószínűségét $\Phi$ segítségével – a görbe szimmetrikus.`,
          explain: R`$2\Phi(1) - 1 \approx 0{,}6827$ – a „68–95–99,7” szabály első tagja. A $0{,}8413$ csak $P(X \lt m + \sigma)$, a $0{,}3413$ csak az egyik fél.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mennyi $\Phi(-1{,}5)$, ha $\Phi(1{,}5) = 0{,}9332$?`,
          options: [
            R`$0{,}0668$`,
            R`$0{,}9332$`,
            R`$0{,}4332$`,
            R`$0{,}1336$`
          ],
          answer: 0,
          hint: R`Rajzold le a haranggörbét: a $-1{,}5$-től balra eső terület a szimmetria miatt egyenlő egy jobb oldali farokkal.`,
          explain: R`A szimmetria miatt $\Phi(-x) = 1 - \Phi(x) = 0{,}0668$. A $0{,}4332 = \Phi(1{,}5) - 0{,}5$ a $[0; 1{,}5]$ közötti terület.`
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
          hint: "Gondold végig a haranggörbe alakját – és azt, mennyi egy folytonos változó egyetlen pontjának valószínűsége.",
          explain: R`Folytonos eloszlásnál minden egyes pont valószínűsége 0 – a sűrűségfüggvény maximuma attól még $m$-ben van.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy vizsga pontszámai $N(50, 10)$ eloszlásúak. Hány pont kell ahhoz, hogy valaki a legjobb 10%-ba kerüljön? ($\Phi(1{,}2816) = 0{,}9$)`,
          options: [
            R`$62{,}8$`,
            R`$37{,}2$`,
            R`$51{,}3$`,
            R`$60$`
          ],
          answer: 0,
          hint: R`A felső 10% határa az a pont, ahol $\Phi(z) = 0{,}9$; utána számolj vissza: $x = m + z\sigma$.`,
          explain: R`$x = m + z\sigma = 50 + 1{,}2816\cdot10 \approx 62{,}8$ pont. A $37{,}2$ az alsó 10% határa (rossz előjel).`
        }
      ]
    },

    /* ------------------------------------------------ 4.7 */
    "p4-44": {
      title: "Kvíz – 4.7 Közelítések és a centrális határeloszlás-tétel",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`100-szor feldobunk egy érmét. Normális közelítéssel, folytonossági korrekcióval mennyi $P(X \le 40)$? ($\Phi(1{,}9) = 0{,}9713$)`,
          options: [
            R`$0{,}0287$`,
            R`$0{,}0228$`,
            R`$0{,}0179$`,
            R`$0{,}9713$`
          ],
          answer: 0,
          hint: R`$E = np$, $D = \sqrt{npq}$; a folytonossági korrekciónál gondold végig, merre tolod a 40-et, hogy a 40 is benne legyen.`,
          explain: R`$np = 50$, $\sqrt{npq} = 5$. $P(X \le 40) \approx \Phi\!\left(\tfrac{40{,}5 - 50}{5}\right) = \Phi(-1{,}9) = 0{,}0287$. (A pontos érték 0,0284.) Korrekció nélkül $\Phi(-2) = 0{,}0228$, rossz irányú korrekcióval ($39{,}5$) $\Phi(-2{,}1) \approx 0{,}0179$ jönne ki.`
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
          hint: "A tétel összegekről (átlagokról) szól, nem az egyes mérésekről – és nem kell hozzá normális kiinduló eloszlás.",
          explain: "Nem az egyes mérések lesznek normálisak, hanem az összegük (és így az átlaguk) eloszlása."
        },
        {
          q: "Mikor érdemes a binomiális eloszlást Poisson-eloszlással közelíteni?",
          options: ["ha n nagy és p kicsi", "ha n kicsi és p ≈ 0,5", "ha np ≥ 5 és n(1 − p) ≥ 5", "soha"],
          answer: 0,
          hint: "A Poisson-eloszlás a ritka események eloszlása – milyen n és p mellett ritka a siker?",
          explain: R`Ritka események: $n$ nagy, $p$ kicsi, $\lambda = np$ mérsékelt. A harmadik feltétel a <em>normális</em> közelítés ökölszabálya.`
        },
        {
          type: "single", shuffle: true,
          q: "100 kockadobás összegének mennyi a szórása? (Egy dobás szórásnégyzete 35/12.)",
          options: [
            R`$17{,}08$`,
            R`$170{,}8$`,
            R`$291{,}7$`,
            R`$29{,}17$`
          ],
          answer: 0,
          hint: R`Független változók összegénél a szórásnégyzetek adódnak össze, nem a szórások.`,
          explain: R`$D = \sqrt{100\cdot\tfrac{35}{12}} \approx 17{,}08$ (a várható érték 350). Gyakori hiba: $100\cdot\sqrt{35/12} \approx 170{,}8$ – a szórás csak $\sqrt n$-nel nő.`
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
          hint: "Kérdezd meg minden változónál: darabszám vagy idő/mérés? Rögzített számú kísérlet, első sikerig tartó ismétlés, vagy visszatevés nélküli húzás?",
          choices: [BIN, GEO, HYP, POI, UNI, EXP, NOR],
          pairs: [
            ["hány fej lesz 20 pénzfeldobásból", BIN],
            ["hány dobás kell az első hatosig", GEO],
            ["hány selejt lesz 5 kivett darab között egy 50 darabos dobozból (visszatevés nélkül)", HYP],
            ["hány sajtóhiba van egy véletlen oldalon", POI],
            ["egy véletlen időpont percértéke egy órán belül", UNI],
            ["mennyi idő telik el a következő bomlásig egy radioaktív mintában", EXP],
            ["egy véletlenül választott felnőtt testmagassága", NOR]
          ],
          explain: "Darabszámnál: rögzített számú független kísérlet → binomiális; első sikerig → geometriai; visszatevés nélkül véges dobozból → hipergeometrikus; csak átlag ismert, ritka események → Poisson. Mérésnél: „bárhol egyforma eséllyel” → egyenletes; várakozási idő öregedés nélkül → exponenciális; sok kis hatás összege → normális. (Lásd a fejezet döntési táblázatát.)"
        },
        {
          type: "single", shuffle: true,
          q: "(V.4.2) Egy csapat minden játszmát 2/3 eséllyel nyer. Négy játszmából mi a valószínűsége, hogy többet nyer, mint a felét?",
          options: [
            R`$\tfrac{16}{27} \approx 0{,}593$`,
            R`$\tfrac{8}{9} \approx 0{,}889$`,
            R`$\tfrac{8}{27} \approx 0{,}296$`,
            R`$\tfrac{32}{81} \approx 0{,}395$`
          ],
          answer: 0,
          hint: R`Binomiális, $n = 4$, $p = \tfrac23$; a „többet, mint a felét” pontosan mely győzelemszámokat jelenti?`,
          explain: R`$P(X = 3) + P(X = 4) = 4\left(\tfrac23\right)^3\tfrac13 + \left(\tfrac23\right)^4 = \tfrac{32 + 16}{81} = \tfrac{16}{27} \approx 0{,}593$. A $\tfrac89$ a „legalább a felét” (2, 3 vagy 4 győzelem) esetet adja.`
        },
        {
          type: "single", shuffle: true,
          q: "(V.4.5) X Poisson-eloszlású, λ = 1,8. Mi a valószínűsége, hogy a várható értékénél kisebb értéket vesz fel?",
          options: [
            R`$0{,}463$`,
            R`$0{,}731$`,
            R`$0{,}165$`,
            R`$0{,}537$`
          ],
          answer: 0,
          hint: R`A $\lambda = 1{,}8$-nál kisebb egész értékek számítanak – sorold fel őket, és add össze a Poisson-valószínűségeket.`,
          explain: R`$P(X \lt 1{,}8) = P(X = 0) + P(X = 1) = e^{-1{,}8}(1 + 1{,}8) \approx 0{,}463$. A $0{,}731$ már a $P(X = 2)$-t is tartalmazza, pedig $2 \gt 1{,}8$.`
        },
        {
          type: "single", shuffle: true,
          q: "(V.4.3) Az alkatrészek 2%-a selejtes. Legalább hány darabot kell (visszatevéssel) megvizsgálni, hogy legalább 0,96 valószínűséggel legyen köztük selejtes?",
          options: [
            R`$160$`,
            R`$159$`,
            R`$48$`,
            R`$3$`
          ],
          answer: 0,
          hint: R`Használd az ellentett eseményt („egy selejtes sincs”), oldd meg logaritmussal $n$-re – és figyelj a kerekítés irányára!`,
          explain: R`$1 - 0{,}98^n \ge 0{,}96 \iff 0{,}98^n \le 0{,}04 \iff n \ge \tfrac{\ln 0{,}04}{\ln 0{,}98} \approx 159{,}3$, tehát $n = 160$. A 159 lefelé kerekítés: $1 - 0{,}98^{159} \approx 0{,}9597 \lt 0{,}96$.`
        },
        {
          type: "single", shuffle: true,
          q: "(V.4.10) 400 hallgató magassága N(170 cm, 16 cm) eloszlású. Körülbelül hányan magasabbak 190 cm-nél?",
          options: [
            R`$42 \text{ fő}$`,
            R`$358 \text{ fő}$`,
            R`$84 \text{ fő}$`,
            R`$158 \text{ fő}$`
          ],
          answer: 0,
          hint: R`Standardizálj, számold ki a felső farok valószínűségét, majd szorozd a létszámmal – csak egy farok kell.`,
          explain: R`$z = \tfrac{190 - 170}{16} = 1{,}25$, $1 - \Phi(1{,}25) \approx 0{,}1056$, és $400\cdot0{,}1056 \approx 42$ fő. A 84 fő a két szélső farok együtt (alacsony és magas is).`
        },
        {
          type: "single", shuffle: true,
          q: "Júliusban a hőmérséklet N(26 °C, 4 °C) eloszlású. Mi a valószínűsége, hogy 28 és 34 °C közé esik?",
          options: [
            R`$0{,}2857$`,
            R`$0{,}6687$`,
            R`$0{,}3085$`,
            R`$0{,}7143$`
          ],
          answer: 0,
          hint: R`Standardizáld mindkét határt, és rajzold le a haranggörbét – figyelj, melyik határ esik az átlag fölé.`,
          explain: R`$\Phi(2) - \Phi(0{,}5) = 0{,}9772 - 0{,}6915 = 0{,}2857$. A $0{,}6687$ úgy jön ki, ha a 28 °C-ot az átlag alá tesszük: $\Phi(2) - \Phi(-0{,}5)$.`
        },
        {
          q: "Melyik eloszlásnak egyenlő a várható értéke és a szórása?",
          options: ["Poisson", "exponenciális", "standard normális", "egyenletes a [0; 1]-en"],
          answer: 1,
          hint: "Idézd fel a nevezetes eloszlások várható értékét és szórását – vigyázz, szórásról van szó, nem szórásnégyzetről.",
          explain: R`Exponenciálisnál $E = D = \tfrac1\lambda$. (A Poissonnál a várható érték és a szórás<em>négyzet</em> egyenlő.)`
        },
        {
          q: "Egy gép 0,75 cm átmérőjű korongokat gyárt, az átmérő N(0,75; 0,06) eloszlású. Hibás a korong, ha 0,60 cm-nél kisebb vagy 0,84 cm-nél nagyobb. Kb. hány százalék a selejt?",
          options: ["0,6%", "7,3%", "13,4%", "31,7%"],
          answer: 1,
          hint: R`Standardizáld mindkét határt; a selejt a két farok összege, vagy 1 mínusz a köztes terület.`,
          explain: R`$z_1 = -2{,}5$, $z_2 = 1{,}5$: jó darab $\Phi(1{,}5) - \Phi(-2{,}5) = 0{,}9332 - 0{,}0062 = 0{,}927$, a selejt $7{,}3\%$.`
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
