    /* ------------------------------------------------ 14.6 */
    "ai14-146": {
      title: "Kvíz – 14.6 Diffúziós modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A zajerősségek $\beta = (0{,}1;\ 0{,}2;\ 0{,}3)$. Mennyi $\bar\alpha_3$, vagyis a jel varianciájából mennyi marad három lépés után?`,
          options: ["0,504", "0,4", "0,72", "0,006"],
          answer: 0,
          hint: R`$\bar\alpha_t$ szorzat – de minek a szorzata? Lépésenként a jel varianciájából mennyi marad meg?`,
          explain: R`$\bar\alpha_3 = (1 - 0{,}1)(1 - 0{,}2)(1 - 0{,}3) = 0{,}9 \cdot 0{,}8 \cdot 0{,}7 = 0{,}504$. A 0,4 az $1 - \sum\beta$ – a megmaradó részek nem kivonódnak, hanem összeszorzódnak. A 0,72 a $\bar\alpha_2$ (egy lépés kimaradt), a 0,006 pedig a $\beta$-k szorzata, vagyis a zaj részeit szorozza a jel részei helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\bar\alpha_t = 0{,}64$, a tiszta pixel $x_0 = 1$, a zaj $\varepsilon = -0{,}5$. Mennyi $x_t$ a zárt alak szerint?`,
          options: ["0,5", "0,46", "0,62", "0,2"],
          answer: 0,
          hint: R`$x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1 - \bar\alpha_t}\,\varepsilon$ – mindkét együtthatóban gyök van.`,
          explain: R`$\sqrt{0{,}64} \cdot 1 + \sqrt{0{,}36} \cdot (-0{,}5) = 0{,}8 - 0{,}3 = 0{,}5$. A 0,46 mindkét gyököt elfelejti ($0{,}64 - 0{,}36 \cdot 0{,}5$), a 0,62 csak a zaj együtthatójáét. A 0,2 felcseréli a két együtthatót ($0{,}6 \cdot 1 + 0{,}8 \cdot (-0{,}5)$) – pedig $\bar\alpha_t$ a <em>jel</em> részaránya.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\bar\alpha_t = 0{,}36$, a zajos pixel $x_t = 0{,}2$, a háló zajtippje $\hat\varepsilon = -0{,}5$. Mennyi a tiszta pixelre vonatkozó tipp, $\hat x_0$?`,
          options: ["1,00", "−0,33", "0,60", "1,67"],
          answer: 0,
          hint: R`Fordítsd meg a zárt alakot: vond ki a zaj részét, aztán oszd el a jel együtthatójával.`,
          explain: R`$\hat x_0 = (x_t - \sqrt{1 - \bar\alpha_t}\,\hat\varepsilon)/\sqrt{\bar\alpha_t} = (0{,}2 + 0{,}8 \cdot 0{,}5)/0{,}6 = 0{,}6/0{,}6 = 1$. A $-0{,}33$ előjelhiba (hozzáadja a zajt kivonás helyett), a 0,60 elfelejti az osztást, az 1,67 pedig $\bar\alpha_t$-vel oszt $\sqrt{\bar\alpha_t}$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: "Mit kell megjósolnia a hálónak egy DDPM-tanítási lépésben?",
          options: [
            R`A teljes zajt ($\boldsymbol\varepsilon$), amely $\mathbf x_0$-ból $\mathbf x_t$-t csinálta – a zajos képből és $t$-ből.`,
            R`Csak az utolsó lépésben hozzáadott zajt, vagyis $\mathbf x_{t-1}$ és $\mathbf x_t$ különbségét.`,
            R`A tiszta képet, $t$ ismerete nélkül – a zajszintet a háló magától kitalálja.`,
            R`Azt, hogy a kép valódi vagy generált – mint a GAN detektívje.`
          ],
          answer: 0,
          hint: R`Nézd meg a veszteséget: $\lVert \boldsymbol\varepsilon - \hat{\boldsymbol\varepsilon} \rVert^2$. Melyik $\boldsymbol\varepsilon$ ez, és mit kap a háló bemenetként?`,
          explain: R`A háló $\hat{\boldsymbol\varepsilon} = \varepsilon_\theta(\mathbf x_t, t)$-t ad, és a célpont az az egyetlen $\boldsymbol\varepsilon$, amellyel a zárt alakból $\mathbf x_t$ készült – nem egy lépésnyi zaj. Ebből bármelyik korábbi lépésre vissza lehet számolni. A $t$ is bemenet: ha a háló nem tudná, mekkora a zaj, nem tudná, mennyit vegyen le. Versengés nincs benne – ez közönséges regresszió.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a diffúziós modellre?",
          options: [
            R`A zárt alak miatt bármely $t$-re egy lépésben előállítható $\mathbf x_t$, nem kell a zajosítást lépésenként végigjátszani.`,
            "Az előre irányú (zajosító) folyamatot is a háló tanulja meg.",
            "Erős zajnál a háló tisztakép-tippje éles, gyenge zajnál homályos.",
            R`Véges tanítóhalmazon az ideális zajtalanító $\hat{\mathbf x}_0$-ja a tanítóképek súlyozott átlaga, és a mintavétel végén egy tanítóképre ugrik.`,
            "Ugyanaz a háló minden zajszinten dolgozik, ezért a zajszintet is bemenetként kapja."
          ],
          answer: [0, 3, 4],
          hint: "Mi az, amiben „nincs semmi tanulnivaló”? És mikor átlagol a tipp sok lehetséges kép között?",
          explain: R`Igaz: a zárt alak (ettől olcsó a tanítás), a tökéletes tanuló „csal” (kis zajnál egy tanítókép súlya lesz 1), és $t$ bemenet. Hamis: a zajosításban nincs tanulnivaló, az csak a tanítóadat előállítása. És fordítva van: erős zajnál a tipp sok kép átlaga, tehát homályos; a mintavétel ezt lépésenként élesíti.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az adat két érték, $-1$ és $+1$, fele-fele eséllyel; az ideális tipp $\hat x_0 = \tanh\big(\sqrt{\bar\alpha}\,x_t/(1 - \bar\alpha)\big)$. Mennyi $\hat x_0$, ha $\bar\alpha = 0{,}36$ és $x_t = -1$?`,
          options: ["−0,73", "−0,94", "−0,51", "−0,64"],
          answer: 0,
          hint: R`Előbb számold ki a zárójelet ($\sqrt{0{,}36} = 0{,}6$), és ne hagyd le a $\tanh$-t.`,
          explain: R`$\tanh(0{,}6 \cdot (-1)/0{,}64) = \tanh(-0{,}9375) \approx -0{,}73$: a $-1$ felé hajlik, de erős zajnál még óvatos. A $-0{,}94$ a $\tanh$ nélküli argumentum, a $-0{,}51$ a gyököt felejti el ($0{,}36$ a $0{,}6$ helyett), a $-0{,}64$ pedig $\sqrt{1 - \bar\alpha}$-val oszt $1 - \bar\alpha$ helyett.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy DDIM-lépésben a tippek $\hat x_0 = 0{,}5$ és $\hat\varepsilon = 1$, a mostani szint $\bar\alpha_t = 0{,}36$, a következő $\bar\alpha_{t-1} = 0{,}81$. Mennyi $x_{t-1}$?`,
          options: ["0,89", "1,10", "0,60", "0,45"],
          answer: 0,
          hint: R`„Tippeld meg a tiszta képet, aztán zajosítsd vissza egy kicsit kevésbé” – melyik $\bar\alpha$-val zajosítasz vissza?`,
          explain: R`$x_{t-1} = \sqrt{0{,}81} \cdot 0{,}5 + \sqrt{0{,}19} \cdot 1 \approx 0{,}45 + 0{,}436 = 0{,}89$. Az 1,10 a régi szinttel ($\bar\alpha_t = 0{,}36$) zajosít vissza – akkor nem haladnánk. A 0,60 elfelejti a gyököket, a 0,45 a zajtagot hagyja el (ez csak az utolsó lépésben helyes, ahol $\bar\alpha_{t-1} = 1$).`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a leírásával!",
          pairs: [
            ["DDPM-mintavétel", "a zaj egy részét minden lépésben friss véletlen zajra cseréli"],
            ["DDIM-mintavétel", "determinisztikus: ugyanabból a kezdőzajból mindig ugyanaz a kép"],
            ["flow matching", "a zajt és az adatot összekötő egyenes pálya sebességét tanulja"],
            ["desztillált modell", "1–4 lépésben rajzol"],
            ["pontszám (score)", "a zajos eloszlás logaritmusának gradiense, a sűrűbb régió felé mutat"]
          ],
          hint: "Melyik eljárás sztochasztikus, melyik determinisztikus? Melyik tanul sebességet, és melyik „iránytű”?",
          explain: R`A DDPM friss zajt kever minden lépésbe, a DDIM ugyanennek a folyamatnak determinisztikus változata (ezért lehet a kezdőzajok között interpolálni). A flow matching $\mathbf x_t = (1 - t)\,\mathbf x_0 + t\,\boldsymbol\varepsilon$ mentén a $\mathbf v = \boldsymbol\varepsilon - \mathbf x_0$ sebességet tanulja. A desztillált modellek 1–4 lépéssel dolgoznak, a pontszám pedig $\nabla_{\mathbf x}\ln p_t(\mathbf x) \approx -\hat{\boldsymbol\varepsilon}/\sqrt{1 - \bar\alpha_t}$.`
        }
      ]
    },

    /* ------------------------------------------------ 14.7 */
    "ai14-147": {
      title: "Kvíz – 14.7 Feltételes generálás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A 2 × 2-es rajzokon mennyi $p(\texttt{1100} \mid \text{vízszintes})$?`,
          options: ["0,6", "0,3", "0,5", "1"],
          answer: 0,
          hint: "Szűkítsd le a tíz rajzot a vízszintesekre, és csak köztük számolj arányt.",
          explain: R`Vízszintes rajz 5 van (3 felső, 2 alsó csík), ezért $p(\texttt{1100} \mid \text{vízszintes}) = 3/5 = 0{,}6$. A 0,3 az együttes valószínűség, $p(\texttt{1100}, \text{vízszintes})$; a 0,5 a $p(\text{vízszintes})$; az 1 a fordított feltétel, $p(\text{vízszintes} \mid \texttt{1100})$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pixelnél $\hat\varepsilon_u = 0{,}3$ (feltétel nélkül) és $\hat\varepsilon_c = 0{,}5$ (feltétellel). Mennyi az irányított tipp $s = 4$-nél?`,
          options: ["1,1", "2,0", "−0,3", "0,8"],
          answer: 0,
          hint: R`$\tilde\varepsilon = \hat\varepsilon_u + s\,(\hat\varepsilon_c - \hat\varepsilon_u)$: honnan indulsz, és merre lépsz?`,
          explain: R`$0{,}3 + 4 \cdot (0{,}5 - 0{,}3) = 0{,}3 + 0{,}8 = 1{,}1$. A 2,0 egyszerűen $s\,\hat\varepsilon_c$, a $-0{,}3$ felcseréli a két tippet (a feltételestől a feltétel nélküli felé extrapolál), a 0,8 pedig elfelejti a kiindulópontot, $\hat\varepsilon_u$-t.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit kapsz az osztályozómentes irányításban $s = 1$-nél?`,
          options: [
            "A modell saját feltételes eloszlását – irányításról csak s > 1-nél beszélünk.",
            "A feltétel nélküli modellt.",
            "Gyenge irányítást, félúton a feltétel nélküli és a feltételes modell között.",
            "Kétszeres erősségű feltételt."
          ],
          answer: 0,
          hint: R`Írd be $s = 1$-et a képletbe: mi marad $\hat\varepsilon_u + 1 \cdot (\hat\varepsilon_c - \hat\varepsilon_u)$-ból?`,
          explain: R`$s = 1$-nél $\tilde\varepsilon = \hat\varepsilon_c$, vagyis a sima feltételes modell. A feltétel nélküli modell $s = 0$, a „félút” $s = 0{,}5$ lenne. Az $s \gt 1$ megy túl a feltételes tippen („még hetesebb, mint egy átlagos hetes”).`
        },
        {
          type: "single", shuffle: true,
          q: "Az A modell 30 lépéssel, osztályozómentes irányítással rajzol. A B modellbe guidance distillationnel „belesütötték” az irányítást, és szintén 30 lépéssel rajzol. Hány hálóhívás kell egy képhez az A-nak, illetve a B-nek?",
          options: ["60, illetve 30", "30, illetve 30", "60, illetve 60", "120, illetve 60"],
          answer: 0,
          hint: "Hányszor kell lépésenként hívni a hálót, ha a feltételes és a feltétel nélküli tipp is kell? És ha az irányítás már a hálóban van?",
          explain: R`CFG-vel lépésenként két hívás kell ($\hat{\boldsymbol\varepsilon}_c$ és $\hat{\boldsymbol\varepsilon}_u$): $2 \cdot 30 = 60$. A belesütött irányítású modell (pl. FLUX.1 [dev]) lépésenként egyszer hív: 30. A „30, 30” elfelejti a kettős hívást, a „60, 60” a desztilláció hasznát, a „120, 60” kétszer duplázik.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy $512 \times 512 \times 3$-as képet egy autoenkóder $64 \times 64 \times 16$-os kódba tömörít. Hányszor kevesebb számmal dolgozik a látens diffúzió, mint a pixeleken?`,
          options: ["12-szer", "48-szor", "64-szer", "4-szer"],
          answer: 0,
          hint: "Számold meg mindkét oldalon az összes számot – a csatornákkal együtt.",
          explain: R`$512 \cdot 512 \cdot 3 = 786\,432$, a kód $64 \cdot 64 \cdot 16 = 65\,536$, a hányados 12. A 48 a Stable Diffusion 4 csatornás kódjáé – a 16 csatorna kevesebb tömörítést ad (élesebb részletekért). A 64 csak a felbontást nézi ($8^2$), a 4 pedig $64/16$, a 3 eredeti csatornát kihagyva.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a feltételes generálásra?",
          options: [
            "Az osztályozómentes irányításhoz tanításkor a példák egy részénél (pl. 10–20%) a feltételt üresre cseréljük.",
            "Minél nagyobb az irányítás erőssége (s), annál jobb a kép.",
            "A negatív prompt a feltétel nélküli tipp helyére egy „ne ilyen legyen” feltétel tippjét teszi, és attól távolodik.",
            "Az osztályozómentes irányításhoz egy külön osztályozó háló gradiense kell.",
            "A diffúziós zajtalanító a szöveg beágyazás-sorozatát kereszt-figyelemmel olvassa."
          ],
          answer: [0, 2, 4],
          hint: "Honnan jön a feltétel nélküli tipp, ha csak egy háló van? És mi az ára a nagy s-nek?",
          explain: R`Igaz: az üres feltétel teszi lehetővé, hogy ugyanaz a háló $\hat{\boldsymbol\varepsilon}_u$-t is adjon; a negatív prompt ugyanez a trükk; a szöveget kereszt-figyelem olvassa. Hamis: nagy $s$-nél a kép hűbb a feltételhez, de kevésbé sokféle, túl nagynál „égett”. Az „osztályozómentes” épp azt jelenti, hogy nincs külön osztályozó: a két tipp különbsége játssza a szerepét.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy látens diffúziós szövegből kép rendszer új képet generál (nem meglévő képből indul). Melyik részére NINCS szükség ehhez?",
          options: ["Az autoenkóder kódolójára", "Az autoenkóder dekódolójára", "A szövegkódolóra", "A kódtérben dolgozó zajtalanítóra"],
          answer: 0,
          hint: "Kövesd végig a generálás útját: honnan indulsz, és mi rajzolja ki a végén a képet?",
          explain: "A generálás: szövegkódoló (feltétel) → zajtalanítás a kódtérben, tiszta zajból → dekódoló (kódból kép). A kódoló csak a tanításhoz kell, és ha meglévő képből indulunk (kép-ből-kép). A dekódoló nélkül nem lenne kép, a szövegkódoló nélkül nem lenne irányítás."
        },
        {
          type: "single", shuffle: true,
          q: "Kép-ből-kép módban egy fényképet kódolsz, t lépésig zajosítasz, majd az „akvarell” felirattal visszafelé mintavételezel. Mi történik, ha t nagyon kicsi?",
          options: [
            "A kép alig változik: az eredeti uralkodik, kevés akvarellhatással.",
            "Szinte teljesen új kép lesz, csak a felirat számít.",
            "A kép tiszta zaj marad, mert nincs elég lépés a zajtalanításra.",
            "A modell figyelmen kívül hagyja a fényképet, és a kódolót sem használja."
          ],
          answer: 0,
          hint: "Kis t mellett mennyi zaj kerül a fénykép kódjára – mennyi „döntenivaló” marad a modellnek?",
          explain: "Kis t: kevés zaj, a visszafelé mintavétel csak finom részleteken dönthet, ezért a kép alig változik. Majdnem T-nél szinte tiszta zajból indulunk, akkor lesz új kép, amelyben csak a felirat számít. A köztes t a felületek „erősség” csúszkája."
        }
      ]
    },

    /* ------------------------------------------------ 14.8 */
    "ai14-148": {
      title: "Kvíz – 14.8 Értékelés és kockázatok",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy jellemzőszám a valódi képeken $\mathcal N(5;\ 2^2)$, a generáltakon $\mathcal N(3{,}5;\ 1^2)$ eloszlású. Mennyi az egydimenziós Fréchet-távolság?`,
          options: ["3,25", "11,25", "2,5", "2,25"],
          answer: 0,
          hint: R`$(\mu_1 - \mu_2)^2 + (\sigma_1 - \sigma_2)^2$ – a szórásokkal számolj, ne a varianciákkal.`,
          explain: R`$(5 - 3{,}5)^2 + (2 - 1)^2 = 2{,}25 + 1 = 3{,}25$. A 11,25 a varianciák különbségét emeli négyzetre ($(4 - 1)^2 = 9$), a 2,5 elfelejti a négyzetre emelést, a 2,25 csak az átlagok eltérését nézi – pedig itt a szórás is hibás: a modell túl szűk (kevéssé sokféle).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy modell pontossága 0,97, felidézése 0,1. Milyenek a mintái?",
          options: [
            "Szinte mind valószerű, de a valódi képek változatosságának csak kis részét fedik le.",
            "Sokfélék, de többségük nem valószerű.",
            "A modell másol: a minták a tanítóképek pontos másolatai.",
            "Rossz minőségűek és kevéssé sokfélék is."
          ],
          answer: 0,
          hint: "A pontosság a generált minták felől néz a valódiakra, a felidézés a valódiak felől a generáltakra. Melyik mér minőséget, melyik lefedettséget?",
          explain: "Pontosság: a minták hányad része esik a valódi képek környékére – 97%, tehát jó minőség. Felidézés: a valódi képek hányad részéhez van hasonló minta – csak 10%, tehát kicsi a lefedettség. Ez a VAE-szerű „óvatos” modell vagy a módusösszeomlás képe. Másolásról ezek a számok nem mondanak semmit – azt a legközelebbi tanítókép mutatja meg."
        },
        {
          type: "single", shuffle: true,
          q: "A 14.9-ben a tanítóképeket visszaadó „másoló” FID-je 23,3 – jobb, mint bármelyik valódi modellé. Miért?",
          options: [
            "Mert a FID csak azt méri, mennyire hasonlít a két jellemzőfelhő; azt nem kérdezi, újak-e a minták.",
            "Mert a másoló a tesztképeket adja vissza, és azokhoz mérjük.",
            "Mert a FID a másolást jutalmazza, a memorizálást viszont bünteti.",
            "Mert túl kevés mintán mértük; 50 000 mintánál a másoló FID-je rosszabb lenne."
          ],
          answer: 0,
          hint: "Mit tartalmaz a FID képlete: van-e benne bármi, ami a tanítóképekre hivatkozik?",
          explain: "A FID a valódi és a generált képek jellemzőire illesztett két normális eloszlás (átlag, kovariancia) távolsága. A tanítóképek ugyanolyan eloszlásúak, mint a tesztképek, ezért a másoló felhője nagyon hasonlít a valódiakéra – a FID nem tudja, hogy ezek nem új képek. A másoló tanítóképeket ad, nem tesztképeket (ezért nem 0 a FID-je). A minta száma torzít, de ez a vakságon nem segít: a másolást külön kell vizsgálni (legközelebbi tanítókép)."
        },
        {
          type: "match",
          q: "Párosítsd a mérőszámot vagy próbát azzal, amit mér!",
          pairs: [
            ["pontosság", "minőség: a minták valódi képek környékére esnek-e"],
            ["felidézés", "lefedettség: a valódi képekhez van-e hasonló minta"],
            ["FID", "két illesztett normális eloszlás távolsága a jellemzőtérben"],
            ["legközelebbi tanítókép", "másol-e a modell"],
            ["NLL", "átlagos meglepetés, csak valószínűséget adó modellnél"]
          ],
          hint: "Három kérdést kell külön feltenni: jók-e a minták, elég sokfélék-e, újak-e. Melyik eszköz melyikre felel?",
          explain: "A pontosság a minőséget, a felidézés a lefedettséget méri; a FID a kettőt egy számba mossa. A másolást csak a tanítóképekkel való összevetés (legközelebbi szomszéd, kinyerési próba) mutatja meg. NLL-t csak olyan modellnél tudunk mérni, amely valószínűséget ad (autoregresszív; VAE-nél csak korlát, GAN-nál semmi)."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 100 tokenes szövegben 62 „zöld” token van. Vízjel nélkül 50 várható, a szórás $\sqrt{100 \cdot 0{,}25}$. Mennyi a $z$-érték?`,
          options: ["2,4", "0,48", "1,70", "0,24"],
          answer: 0,
          hint: R`$z = (\text{megfigyelt} - \text{várható})/\text{szórás}$ – előbb vonj gyököt.`,
          explain: R`A szórás $\sqrt{25} = 5$, így $z = 12/5 = 2{,}4$: gyanús, de rövid szövegen nem erős bizonyíték. A 0,48 a varianciával (25) oszt, az 1,70 a $\sqrt{100 \cdot 0{,}5}$ hibás szórással, a 0,24 a várható értékkel (50) – ez relatív eltérés, nem $z$.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a memorizálásról és a másolásról?",
          options: [
            "Carlini és társai kísérletében a kinyert képek jellemzően legalább százszor szerepeltek a tanítóadatban.",
            "A memorizálás elleni fő védekezés a duplikátumok kiszűrése a tanítóadatból.",
            "A diffúziós modell egy beépített képtárból vág ki és ragaszt össze darabokat.",
            "Ha egy modell generációról generációra a saját kimenetén tanul, elvesznek a ritka esetek (model collapse).",
            "Egy festő stílusában rajzolni ugyanaz, mint egy konkrét képét visszaadni – jogilag mindkettő egyformán védett."
          ],
          answer: [0, 1, 3],
          hint: "Mitől kerül a háló közel a „tökéletes”, másoló zajtalanítóhoz? És mi van benne egy diffúziós modellben – képek vagy egy háló?",
          explain: "Igaz: a sokszor ismétlődő képek kinyerhetők, ezért a duplikátumszűrés a fő védekezés; és a saját kimeneten tanuló modell elveszíti a „farkakat” (Shumailov és társai, 2024). Hamis: a diffúziós modellben nincs képtár, csak egy zajszűrő háló – ha mégis másol, az a túl sokszor látott képek memorizálása. A stílus általában nem védett, a konkrét mű igen (a határ vitatott)."
        },
        {
          type: "single", shuffle: true,
          q: "Carlini és társai 175 millió generált képben 109 közel-másolatot találtak. Ez körülbelül hány képenként egy?",
          options: ["kb. 1,6 millió képenként egy", "kb. 16 000 képenként egy", "kb. 160 000 képenként egy", "kb. 16 millió képenként egy"],
          answer: 0,
          hint: "Oszd el a generált képek számát a találatokkal – és figyelj a nagyságrendre.",
          explain: R`$175\,000\,000/109 \approx 1{,}6 \cdot 10^6$, vagyis kb. 1,6 millió képenként egy (arányként $6{,}2 \cdot 10^{-7}$). A többi opció egy-két nagyságrendet téveszt. Fontos: ez célzott keresés volt, a 350 000 leggyakrabban ismétlődő kép feliratával – egy átlagos kérés ritkán ad másolatot, egy ismert festmény vagy logó nevére viszont könnyebben.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy képben nem találsz SynthID-vízjelet. Mit jelent ez?",
          options: [
            "Csak annyit, hogy a kép nem egy vízjelező rendszerből jött – vagy a jelet eltávolították.",
            "Hogy a kép biztosan valódi fénykép.",
            "Hogy a kép biztosan hamis, mert a valódi fotókban is van vízjel.",
            "Hogy a kép C2PA-metaadatát levágták."
          ],
          answer: 0,
          hint: "Melyik tartalmakra működik a vízjel egyáltalán?",
          explain: "A vízjel csak a vízjelező rendszerek kimenetére működik, és átírással, erős szerkesztéssel gyengíthető. Hiánya tehát nem bizonyítja a valódiságot. A C2PA egy másik eszköz (csatolt, aláírt metaadat), amely a vízjeltől függetlenül hiányozhat. Általános, megbízható „MI-detektor” nincs."
        }
      ]
    },

    /* ------------------------------------------------ 14.9 */
    "ai14-149": {
      title: "Kvíz – 14.9 Alkalmazás: négy gép, egy adathalmaz",
      questions: [
        {
          type: "single", shuffle: true,
          q: "A négy modell és a két alapvonal (másoló, Gauss-modell) közül melyiknek a legkisebb a FID-je a 14.9 táblázatában?",
          options: ["A másolónak", "A diffúziós modellnek", "Az autoregresszív modellnek", "A VAE-nek"],
          answer: 0,
          hint: "Ne csak a valódi modelleket nézd – a semmit nem tanult viszonyítási pontokat is.",
          explain: "A másoló FID-je 23,3, a diffúzióé 38,7 (a valódi modellek közül ez a legjobb), az autoregresszívé 56,7 (fekete-fehér képeken mérve), a VAE-é 101,4 – az utóbbi a legrosszabb. A tanulság: a FID a semmit nem tanult másolót hozza ki győztesnek, mert nem kérdezi, újak-e a minták."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik modellre igaz: a mintái szinte mind a valódi számjegyek felhőjén belül vannak (pontosság 0,99), de a valódi változatosság töredékét fedik le (felidézés 0,08)?",
          options: ["A VAE-re", "A GAN-ra", "Az autoregresszív modellre", "A Gauss-modellre"],
          answer: 0,
          hint: "Melyik modell rajzol homályos, „tipikus” átlagképeket?",
          explain: "A VAE „óvatos”: homályos, tipikus alakokat rajzol, amelyek a valódi számjegyek közé esnek, de csak egy szűk sávban – mint a 14.8 A modellje. A GAN közepes pontosságú és felidézésű (0,64 és 0,48), az autoregresszív modell épp fordított (0,56 és 0,88), a Gauss-modell 0,50 és 0,55."
        },
        {
          type: "single", shuffle: true,
          q: "A diffúziós modell mintáinak legközelebbi tanítóképe medián 17,3 egységre van, a valódi tesztképeké 16,7-re. Mit jelent ez?",
          options: [
            "A minták újak, de „a helyükön” vannak: ugyanolyan messze vannak a tanítóképektől, mint egy valódi új kép.",
            "A modell memorizál, mert a mintái közel vannak a tanítóképekhez.",
            "A minták furcsák, mert távolabb vannak a tanítóképektől, mint a tesztképek.",
            "Semmit, mert a legközelebbi szomszéd távolsága nem mond semmit a másolásról."
          ],
          answer: 0,
          hint: "Mihez kell mérni a távolságot: a nullához, vagy egy valódi, új kép távolságához?",
          explain: "A viszonyítási pont a valódi tesztkép: egy jó modell mintái se sokkal közelebb (másolás), se sokkal távolabb (furcsaság) ne legyenek. A 17,3 szinte ugyanannyi, mint a 16,7, és pontos másolat sincs. A másoló 0-ja lebukik, a GAN (22,2) és a Gauss (26,0) mintái viszont távolabb vannak, ami a kisebb pontosságukkal egyezik."
        },
        {
          type: "single", shuffle: true,
          q: "Hány hálóhívás kell a 450 minta előállításához a diffúziós modellnek, illetve a VAE-nek?",
          options: ["450 000, illetve 450", "1000, illetve 1", "450 000, illetve 3600", "450, illetve 450"],
          answer: 0,
          hint: "Mintánként hány lépés kell az egyiknek és a másiknak – és hány minta van?",
          explain: R`A diffúzió mintánként 1000 hálóhívás: $450 \cdot 1000 = 450\,000$. A VAE mintánként egy dekódolás: 450. Az „1000, 1” egyetlen mintára számol, a 3600 a 8 számos kódot szorozza be ($450 \cdot 8$), pedig a kód mérete nem lépésszám. Ez a diffúzió ára a jobb FID-ért.`
        },
        {
          type: "single", shuffle: true,
          q: "A GAN 450 mintájában a legritkább osztály (5-ös) 28-szor, a leggyakoribb (9-es) 60-szor szerepel. Hányszor gyakoribb a 9-es az 5-ösnél?",
          options: ["kb. 2,1-szer", "kb. 1,3-szer", "kb. 0,47-szer", "32-szer"],
          answer: 0,
          hint: "Két darabszám aránya – melyiket osztod melyikkel?",
          explain: R`$60/28 \approx 2{,}1$. Az 1,3 a leggyakoribb osztály a várható 45-höz képest ($60/45$), a 0,47 a fordított arány ($28/60$), a 32 pedig különbség, nem hányados. Ez enyhe részleges módusösszeomlás – egy kis, MLP-alapú GAN-tól várható.`
        },
        {
          type: "match",
          q: "Párosítsd a „gépet” a 14.9-ben látott jellemzőjével!",
          pairs: [
            ["autoregresszív modell", "egyedül ad pontos valószínűséget (25,9 bit/kép)"],
            ["VAE", "nagy pontosság, nagyon kicsi felidézés"],
            ["GAN", "a legegyenetlenebb osztályeloszlás (28–60)"],
            ["diffúziós modell", "a legkisebb FID a valódi modellek közül, 1000 hálóhívás mintánként"],
            ["másoló", "minden mintája 0 távolságra van egy tanítóképtől"]
          ],
          hint: "Gondold végig a két táblázatot: FID, pontosság/felidézés, osztályok, legközelebbi tanítókép – és melyik modell ad számot a valószínűségre.",
          explain: "Az autoregresszív modell az egyetlen pontos valószínűség (25,9 bit/kép), de zajos mintákkal. A VAE óvatos (0,99 és 0,08). A GAN osztályai a legegyenetlenebbek (28–60). A diffúzió a legjobb valódi modell a FID szerint (38,7), cserébe 1000 hívás mintánként. A másoló a legközelebbi szomszéd próbáján azonnal lebukik."
        },
        {
          type: "multi",
          q: "Mit NEM bizonyít ez a kísérlet, vagy mire kell vigyázni az értelmezésénél? Jelöld a helyes óvatossági megjegyzéseket!",
          options: [
            "A modellek sorrendje inkább átvihető a nagy modellekre, mint a különbségek mértéke.",
            "A GAN eredménye különösen érzékeny a véletlen magra.",
            "A mini-FID értékei közvetlenül összevethetők a szakirodalom FID-számaival.",
            "Az autoregresszív modell fekete-fehér képeket rajzol, ezért a számai a többiekkel csak óvatosan vethetők össze.",
            "A legközelebbi szomszéd próbája szerint a diffúziós modell memorizált."
          ],
          answer: [0, 1, 3],
          hint: "Melyik „szem” (jellemzőkinyerő) mérte a FID-et? És hány pontos másolatot rajzolt a diffúziós modell?",
          explain: "Helyes óvatosság: kis adat, kis hálók – a sorrend átvihetőbb, mint a számok; egy tanítás, egy mag (a GAN-nál ez különösen számít); az autoregresszív modellt fekete-fehér tesztképekhez mértük. Hamis: a mini-FID egy saját osztályozó 64 rejtett neuronjának terében készült, nem az Inception-hálóéban, ezért nem vethető össze a szakirodalommal. És a diffúziós modell nem memorizált: 0 pontos másolat, a távolság (17,3) a tesztképekéhez (16,7) hasonló."
        },
        {
          type: "single", shuffle: true,
          q: "Az autoregresszív modell mintáinak legközelebbi tanítókép-távolsága 35,8, a valódi (szürkeárnyalatos) tesztképeké 16,7. Miért félrevezető ezt a kettőt közvetlenül összevetni?",
          options: [
            "Mert az autoregresszív modell fekete-fehér képeket rajzol; a fekete-fehér tesztképeké 27,7, ehhez kell mérni.",
            "Mert az autoregresszív modell másol, csak a távolság ezt elrejti.",
            "Mert a legközelebbi szomszéd távolsága csak diffúziós modellnél értelmes.",
            "Mert az autoregresszív modell 64 lépésben rajzol, a többi egyben."
          ],
          answer: 0,
          hint: "Milyen képeket rajzol az autoregresszív modell, és milyenek a tesztképek?",
          explain: "Fekete-fehér és szürke képek távolsága nem vethető össze közvetlenül. A helyes viszonyítás a fekete-fehérré alakított tesztképek 27,7-es távolsága. A 35,8 ennél is nagyobb: a minták nem másolnak, de kevésbé valószerűek – ez egyezik a 0,56-os pontossággal. A mintavétel lépésszáma a távolságot nem befolyásolja."
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai14-final": {
      title: "Fejezetzáró teszt – Generatív modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A tíz rajzon Laplace-simítást alkalmazunk (minden kép darabszáma +1, a nevező $10 + 16 = 26$). Hány bit a meglepetés az átlón ($\texttt{1001}$)?`,
          options: ["3,70 bit", "3,32 bit", "4,70 bit", "2,56 bit"],
          answer: 0,
          hint: R`Az átlót egy gyerek rajzolta. Számold ki a simított valószínűséget, aztán $-\log_2$.`,
          explain: R`$p = (1 + 1)/26 \approx 0{,}077$, a meglepetés $-\log_2(2/26) \approx 3{,}70$ bit. A 3,32 bit a simítás nélküli $-\log_2 0{,}1$, a 4,70 bit egy soha nem látott képé ($1/26$), a 2,56 pedig $\ln$-nel számolt (nat, nem bit).`
        },
        {
          type: "single", shuffle: true,
          q: R`A Markov-modellben (minden pixel csak az előtte lévőtől függ) $p(x_1 = 1) = 0{,}6$, $p(x_2 = 1 \mid x_1) = 0{,}5$, $p(x_3 = 1 \mid x_2 = 1) = 0$, $p(x_3 = 1 \mid x_2 = 0) = 0{,}8$, $p(x_4 = 1 \mid x_3) = 0{,}5$. Mennyi $p(\texttt{0101})$?`,
          options: ["0,10", "0,20", "0,06", "0,02"],
          answer: 0,
          hint: R`Négy tényező szorzata. A harmadiknál: mi az előző pixel, és fehér vagy fekete a bal alsó?`,
          explain: R`$p(x_1 = 0) = 0{,}4$, $p(x_2 = 1 \mid 0) = 0{,}5$, $p(x_3 = 0 \mid x_2 = 1) = 1$, $p(x_4 = 1 \mid x_3 = 0) = 0{,}5$: a szorzat 0,10. A 0,20 a teljes láncszabály (= táblázat) értéke, a 0,06 a független pixeleké. A 0,02 rossz feltételt használ: $p(x_3 = 0 \mid x_2 = 0) = 0{,}2$-t, pedig $x_2 = 1$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy pixel logitja $z = -1$. Mennyi a fekete valószínűsége $T = 0{,}5$ hőmérsékleten?`,
          options: ["0,12", "0,38", "0,27", "0,88"],
          answer: 0,
          hint: R`$p = \sigma(z/T)$ – a hőmérséklettel osztunk.`,
          explain: R`$\sigma(-1/0{,}5) = \sigma(-2) \approx 0{,}12$: az alacsony hőmérséklet a valószínűtlen értéket még valószínűtlenebbé teszi. A 0,38 szoroz $T$-vel osztás helyett ($\sigma(-0{,}5)$), a 0,27 a $T = 1$-es érték, a 0,88 előjelhibás ($\sigma(2)$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A 14.3 lineáris dekódolója: $\hat{\mathbf x} = 0{,}5 + z_1 \cdot (0{,}5;\ 0{,}5;\ -0{,}5;\ -0{,}5) + z_2 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5)$. Mit rajzol a $(0;\ -0{,}5)$ kódból?`,
          options: [
            R`$(0{,}25;\ 0{,}75;\ 0{,}25;\ 0{,}75)$ – halvány jobb csík`,
            R`$(0{,}75;\ 0{,}25;\ 0{,}75;\ 0{,}25)$ – halvány bal csík`,
            R`$(0{,}25;\ 0{,}25;\ 0{,}75;\ 0{,}75)$ – halvány alsó csík`,
            R`$(0;\ 1;\ 0;\ 1)$ – a jobb csík`
          ],
          answer: 0,
          hint: R`$z_1 = 0$, tehát csak a második irány számít, $-0{,}5$-szörösen. Figyelj az előjelre!`,
          explain: R`$0{,}5 - 0{,}5 \cdot (0{,}5;\ -0{,}5;\ 0{,}5;\ -0{,}5) = (0{,}25;\ 0{,}75;\ 0{,}25;\ 0{,}75)$: a $z_2$ „bal mínusz jobb”, a negatív érték jobbra húz, de csak félig. A bal csík előjelhiba, az alsó csík a $z_1$ irányát használja, a teljes jobb csík a $(0;\ -1)$ kódé lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy VAE kódolója $\boldsymbol\mu = (0;\ 1)$, $\boldsymbol\sigma = (0{,}5;\ 1)$-et ad. Mennyi a KL-tag?`,
          options: ["0,82", "0,13", "0,47", "1,64"],
          answer: 0,
          hint: R`Koordinátánként $\tfrac12(\mu^2 + \sigma^2 - 1 - \ln\sigma^2)$, aztán összeadod.`,
          explain: R`Első koordináta: $\tfrac12(0 + 0{,}25 - 1 - \ln 0{,}25) \approx 0{,}32$ (a keskeny felhőt bünteti); második: $\tfrac12(1 + 1 - 1 - 0) = 0{,}5$ (az eltolást bünteti). Összesen kb. 0,82. A 0,13 elhagyja a $-\ln\sigma^2$ tagot, a 0,47 $\ln\sigma$-val számol $\ln\sigma^2$ helyett, az 1,64 az $\tfrac12$-et felejti el.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az autoenkóderre és a VAE-re?",
          options: [
            R`Új kép generálásához a VAE-nek nincs szüksége a kódolóra: $\mathbf z \sim \mathcal N(0, I)$, aztán dekódoló.`,
            R`Egy sima autoenkóder kódterébe $\mathcal N(0, I)$-ből sorsolva a minták többsége biztosan felismerhető számjegy.`,
            "A VAE képeinek homálya abból jön, hogy a pixelenkénti rekonstrukciós hibát a kódhoz tartozó képek átlaga minimalizálja.",
            "A KL-tag a kódoló és a dekódoló hasonlóságát méri.",
            "A reparaméterezés teszi deriválhatóvá a kód sorsolását."
          ],
          answer: [0, 2, 4],
          hint: "Mit mér valójában a KL-tag – mihez hasonlítja a kódoló felhőit? És hány százalék volt a sima autoenkóder biztosan felismert mintáinak aránya?",
          explain: R`Igaz: generáláskor csak a prior és a dekódoló kell; a homály az átlagolás következménye; a $\mathbf z = \boldsymbol\mu + \boldsymbol\sigma \odot \boldsymbol\varepsilon$ alak deriválható $\boldsymbol\mu$ és $\boldsymbol\sigma$ szerint. Hamis: a sima autoenkóder véletlen kódjainak csak 27%-a ad biztosan felismert számjegyet (a VAE-nél 76%), mert a kódtér lyukas. A KL a kódoló felhőit a <em>priorhoz</em>, $\mathcal N(0, I)$-hez méri – nem a dekódolóhoz (ez egy népszerű tankönyv tévedése).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy képre $p_{\text{adat}} = 0{,}3$, $p_G = 0{,}1$. Mekkora a generátor nem telítődő vesztesége ezen a képen, ha a detektív optimális?`,
          options: ["0,29", "1,39", "0,75", "0,12"],
          answer: 0,
          hint: R`Előbb $D^* = p_{\text{adat}}/(p_{\text{adat}} + p_G)$, aztán a nem telítődő veszteség: $-\ln D$.`,
          explain: R`$D^* = 0{,}3/0{,}4 = 0{,}75$, a veszteség $-\ln 0{,}75 \approx 0{,}29$ – kicsi, mert ezt a képet a hamisító inkább túl ritkán rajzolja, a detektív valódinak tartja. Az 1,39 a $-\ln(1 - D)$, a 0,75 maga a $D^*$, a 0,12 pedig 10-es alapú logaritmussal számol.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a különbség a GAN módusösszeomlása és a memorizálás között?",
          options: [
            "A memorizáló modell tanítóképeket másol; az összeomlott GAN néhány (nem feltétlenül tanító-) képet ismételget – ez a sokféleség hiánya.",
            "Nincs különbség: mindkettő azt jelenti, hogy a modell a tanítóképeket adja vissza.",
            "A módusösszeomlás a VAE, a memorizálás a GAN jellemző hibája.",
            "A módusösszeomlást a legközelebbi tanítókép távolsága mutatja ki, a memorizálást az osztályok aránya."
          ],
          answer: 0,
          hint: "Az egyik a tanítóadathoz túl közel kerül, a másik a változatosságot veszíti el. Melyik melyik?",
          explain: "Módusösszeomlás ≠ túlillesztés. A memorizálás tanítópéldák (közel) pontos másolata – a legközelebbi tanítóképpel mutatható ki. A módusösszeomlás a sokféleség hiánya – az osztályarányok és a felidézés mutatják ki. A VAE jellemző hibája a homály, nem az összeomlás."
        },
        {
          type: "single", shuffle: true,
          q: R`A zajütemezés $\beta_1 = \beta_2 = \beta_3 = 0{,}2$. Mekkora a jel együtthatója, $\sqrt{\bar\alpha_3}$ a zárt alakban?`,
          options: ["0,72", "0,51", "0,40", "0,49"],
          answer: 0,
          hint: R`$\bar\alpha_3 = (1 - 0{,}2)^3$ – és a kérdés a gyökére vonatkozik.`,
          explain: R`$\bar\alpha_3 = 0{,}8^3 = 0{,}512$, a jel együtthatója $\sqrt{0{,}512} \approx 0{,}72$. A 0,51 maga $\bar\alpha_3$ (a variancia, nem az együttható), a 0,40 az $1 - \sum\beta$, a 0,49 pedig $1 - \bar\alpha_3$, a zaj varianciája.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért stabilabb a diffúziós modell tanítása, mint a GAN-é?",
          options: [
            "Mert közönséges regresszió rögzített célponttal (a hozzáadott zaj): nincs versengés, nincs mozgó ellenfél.",
            "Mert a diffúziós modellben nincs neurális háló, csak egy rögzített zajosító folyamat.",
            "Mert a diffúziós háló a valódi képeket egyáltalán nem látja.",
            "Mert a diffúziós modell ugyanazt a minimax-játékot játssza, csak több lépésben."
          ],
          answer: 0,
          hint: "Mi a veszteség célpontja a diffúziós tanításban, és változik-e tanítás közben?",
          explain: R`A diffúziós háló a $\lVert \boldsymbol\varepsilon - \hat{\boldsymbol\varepsilon} \rVert^2$ négyzetes hibát csökkenti, és a célpont, $\boldsymbol\varepsilon$, ismert és rögzített. A GAN-nál a hamisító célja a közben változó detektívtől függ – kétszereplős játék, amely nem garantáltan konvergál. A zajosításban valóban nincs tanulnivaló, de a zajtalanító háló igen; és a háló tanítóképeket zajosítva lát.`
        },
        {
          type: "single", shuffle: true,
          q: R`Negatív prompttal: $\hat\varepsilon_n = 0{,}4$ (a „homályos, torz” feltétel tippje), $\hat\varepsilon_c = 0{,}1$ (a kért feltételé), $s = 3$. Mennyi az irányított tipp?`,
          options: ["−0,5", "1,0", "−0,9", "0,3"],
          answer: 0,
          hint: R`A negatív prompt tippje veszi át a feltétel nélküli tipp helyét: $\hat\varepsilon_n + s\,(\hat\varepsilon_c - \hat\varepsilon_n)$.`,
          explain: R`$0{,}4 + 3 \cdot (0{,}1 - 0{,}4) = 0{,}4 - 0{,}9 = -0{,}5$: a negatív tipptől elfelé, a kért feltétel felé és azon túl lépünk. Az 1,0 felcseréli a szerepeket (a kért feltételtől távolodna), a $-0{,}9$ elfelejti a kiindulópontot, a 0,3 pedig egyszerűen $s\,\hat\varepsilon_c$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 300 tokenes szövegben 180 zöld token van. Vízjel nélkül 150 várható, a szórás $\sqrt{300 \cdot 0{,}25}$. Mennyi a $z$-érték?`,
          options: ["3,46", "0,40", "2,45", "0,20"],
          answer: 0,
          hint: R`$z = (\text{megfigyelt} - \text{várható})/\text{szórás}$; a szórás a variancia gyöke.`,
          explain: R`A szórás $\sqrt{75} \approx 8{,}66$, $z = 30/8{,}66 \approx 3{,}46$ – erős jel egy ilyen vízjelre (de csak annak a modellnek a vízjelére, és egy próba önmagában nem vád). A 0,40 a varianciával oszt, a 2,45 $\sqrt{150}$-nel, a 0,20 a várható értékkel.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a „Négy gép, egy füzet” rejtvény tanulsága a 14.9 alapján?",
          options: [
            "A „legjobb” attól függ, mit mérsz – és a FID-et a semmit nem tanult másoló nyerte, ezért egyetlen szám nem elég.",
            "A diffúziós modell minden mérőszámban a legjobb, ezért mindig azt kell választani.",
            "A VAE a legjobb, mert a legnagyobb a pontossága.",
            "A FID megbízható egyetlen mérőszám, a többit nem kell nézni."
          ],
          answer: 0,
          hint: "Melyik modell nyerte a pontosságot, melyik a FID-et, és melyik adott egyedül pontos valószínűséget?",
          explain: "A diffúzió a FID-ben a legjobb valódi modell, a VAE a pontosságban, az autoregresszív modell az egyetlen pontos valószínűségben – a FID-et pedig a másoló nyerte. Minőséget, lefedettséget és újdonságot külön kell mérni, és mindig meg kell nézni a legközelebbi tanítóképet."
        },
        {
          type: "match",
          q: "Párosítsd a feladatot a fejezet döntési táblázata szerinti módszerrel!",
          pairs: [
            ["pontos valószínűség kell (tömörítés, modellek összevetése bitekben)", "autoregresszív modell"],
            ["valós idejű, egylépéses generálás szűk témában", "GAN vagy desztillált diffúzió"],
            ["a legjobb képminőség, szöveges irányítással", "látens diffúzió osztályozómentes irányítással"],
            ["anomália a rekonstrukciós hibából", "autoenkóder"],
            ["valódi-e ez a kép?", "eredetigazolás (C2PA) és vízjel"]
          ],
          hint: "Valószínűség, sebesség, minőség, tömörítés, eredet – melyik eszköz melyikben erős?",
          explain: "Pontos valószínűséget a láncszabály ad (autoregresszív modell). Egy lépésben a GAN vagy a desztillált diffúzió rajzol. A legjobb, szöveggel irányított kép a látens diffúzió / flow matching CFG-vel. A rekonstrukciós hiba az autoenkóder anomáliajelzője. A valódiságra az eredetigazolás és a vízjel felel – egy felismerő ítélete önmagában nem bizonyíték."
        }
      ]
    },
