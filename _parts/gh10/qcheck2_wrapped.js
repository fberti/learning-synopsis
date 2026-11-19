(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 10.5 */
    "gh10-105": {
      title: "Kvíz – 10.5 Hálózati gerinc",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét súlyozott szereplőgráfjában (súly = közös cikkek) a $w_{ij} \ge 2$ globális küszöbbel vágsz. Mi marad?`,
          options: [
            "7 él, két komponens",
            "7 él, egyetlen összefüggő gráf",
            "1 él: csak a La–Ön",
            "3 él, egyetlen komponens"
          ],
          answer: 0,
          hint: R`Húzd ki az 1-es éleket ($\mathrm{Vi}$–$\mathrm{Sz}$, $\mathrm{Ko}$–$\mathrm{Sz}$, $\mathrm{Ko}$–$\mathrm{Kl}$). Mi köti ezután a $\mathrm{Sz}$-t és a $\mathrm{Kl}$-t a többiekhez?`,
          explain: R`A 10 élből 3 egyes, így 7 marad. Csakhogy pont ez a három kötötte a $\mathrm{Sz}$-t és a $\mathrm{Kl}$-t a többiekhez, ezért a gerinc két részre esik: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}, \mathrm{La}, \text{Ön}\}$ és $\{\mathrm{Sz}, \mathrm{Kl}\}$ (<a class="xref" href="#s105-a-arviz">10.5</a>). Az „összefüggő” válasz elfelejti, hogy a csoportokat összekötő élek a gyengék. A „csak La–Ön” a $w \gt 2$ (vagy $w \ge 3$) küszöb eredménye. A „3 él” épp a kidobott éleket tartja meg.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy csúcs 4 élének súlya 10, 1, 1, 1. Mennyi a 10-es él $\alpha_{ij}$-je a diszparitásszűrőben, ennek a csúcsnak a felől?`,
          options: [R`$\approx 0{,}012$`, R`$\approx 0{,}0028$`, R`$\approx 0{,}455$`, R`$\approx 0{,}231$`],
          answer: 0,
          hint: R`$\alpha_{ij} = (1 - w_{ij}/s_i)^{k_i - 1}$. Mennyi az $s_i$, és hány vágási pont kell 4 darabhoz?`,
          explain: R`$s = 13$, a 10-es él része $10/13$, és $k - 1 = 3$: $\alpha = (3/13)^3 \approx 0{,}012$ – nagyon meglepő, az él megmarad. A $0{,}0028 = (3/13)^4$ a $k$ kitevőt használja: 4 darabhoz csak 3 vágás kell. A $0{,}455 = (10/13)^3$ a $w/s$-t emeli hatványra az $1 - w/s$ helyett. A $0{,}231 = 3/13$ elhagyja a kitevőt – ez csak $k = 2$-nél lenne jó.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy csúcs 3 éle: 7, 2, 1. Megmarad-e a 7-es él $\alpha = 0{,}05$-nél (a csúcs felől nézve)?`,
          options: [
            R`Nem: $\alpha_{ij} = 0{,}09$`,
            R`Igen: $\alpha_{ij} = 0{,}027$`,
            R`Nem: $\alpha_{ij} = 0{,}49$`,
            R`Nem: $\alpha_{ij} = 0{,}3$`
          ],
          answer: 0,
          hint: R`Itt $s = 10$, $k = 3$. Mekkora rész jut a 7-es élre, és mennyi a kitevő?`,
          explain: R`$(1 - 0{,}7)^2 = 0{,}09 \gt 0{,}05$: nem marad meg, pedig a súly 70%-át viszi. Három él mellett ennyi nem elég meglepő. A $0{,}027 = 0{,}3^3$ a $k$ kitevővel számol – ez tévesen „megtartja”. A $0{,}49 = 0{,}7^2$ a $w/s$-t írja az $1 - w/s$ helyére. A $0{,}3$ kitevő nélkül számol. Kis fokszámnál a szűrő keveset tart meg (<a class="xref" href="#s105-b">10.5</a>).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy szereplőnek egyetlen éle van. Mit mond erről az élről a diszparitásszűrő?`,
          options: [
            R`A szereplő felől $\alpha = 1$; az él akkor marad, ha a másik vég felől $\alpha_{ij} \lt \alpha$.`,
            R`A szereplő felől $\alpha = 0$: a teljes súly egy élen van, tehát mindig megmarad.`,
            R`Mindig kiesik, mert egy élre nem lehet nullmodellt felírni.`,
            R`A szereplő felől $\alpha = 1/2$, mert két vége van.`
          ],
          answer: 0,
          hint: R`Írd be a képletbe: $w_{ij} = s_i$ és $k_i = 1$. Mennyi a kitevő?`,
          explain: R`$(1 - 1)^0$ – a képlet itt $\alpha = 1$-et ad: ha csak egy él van, a teljes súly „véletlen elosztásban” is arra esik, ez nem meglepő. Az él ettől nem esik ki: a szűrő akkor tartja meg, ha <em>valamelyik</em> végéről nézve meglepő, így a másik vég dönt. A „$\alpha = 0$” a $100\%$-os részt meglepőnek veszi, de a nullmodellben nincs más lehetőség. A „mindig kiesik” elfelejti a másik véget.`
        },
        {
          type: "multi",
          q: R`A Les Misérables-ben a diszparitásszűrő $\alpha = 0{,}3$-nál 85 élt tart meg. Mi igaz a gerincekre? (Több jó válasz is lehet.)`,
          options: [
            R`Ha a 85 legnagyobb súlyú élt tartanánk meg (globális küszöb), kevesebb szereplő maradna (37 a 46 helyett).`,
            R`A diszparitásszűrő erős éleket is kidobhat: a Marius–Enjolras (7) $\alpha = 0{,}2$-nél kiesik.`,
            R`A szűrő azért tart meg több mellékszereplőt, mert nekik egy gyengébb él is a legfontosabb kapcsolatuk lehet.`,
            R`A nagy súlyú élek a legfontosabbak, ezért a globális küszöb adja „a” helyes gerincet.`,
            R`Az $\alpha_{ij}$ az él valódi p-értéke, így 85 élből kb. 4 lehet hamis.`
          ],
          answer: [0, 1, 2],
          hint: R`Globális mérce vagy helyi mérce? És mit tesztel valójában az $\alpha_{ij}$ – hány tesztet végzünk?`,
          explain: R`Igaz az első három (<a class="xref" href="#s105-b">10.5</a>): ugyanannyi éllel a globális küszöb „a nagyok gerincét” adja (37 szereplő), a diszparitásszűrő mindenki saját legfontosabb kapcsolatait (46). Mariusnak sok, még erősebb kapcsolata van, így a 7-es éle neki nem meglepő. Hamis, hogy a nagy súly = fontos: két gyakori szereplő véletlenül is sokszor összefut. Hamis az utolsó: csúcsonként és élenként külön teszt fut, ezért az $\alpha$ itt inkább a gerinc méretét állító csúszka, nem hiteles p-érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`A páros vetület gerincében (a cikk–szereplő nullmodellel, <a class="xref" href="../07-halozatmodellek/#s76-a">7.6</a>) a p-értékek: $\mathrm{Ko}$–$\mathrm{Vi}$ 0,20, $\mathrm{Sz}$–$\mathrm{Kl}$ 0,016, La–Ön 0,018, Po–La 0,50. Mely párok kerülnek a gerincbe 5%-on, többszörös tesztelési korrekció nélkül?`,
          options: [
            "Sz–Kl és La–Ön",
            "Ko–Vi és Sz–Kl (mindkettő 2 súlyú)",
            "a 7 legalább 2 súlyú él",
            "csak a La–Ön, a legnagyobb súlyú"
          ],
          answer: 0,
          hint: R`Itt nem a súly számít, hanem hogy a gyakoriságokhoz képest meglepő-e. Melyik p kisebb 0,05-nél?`,
          explain: R`Csak a $\mathrm{Sz}$–$\mathrm{Kl}$ (0,016) és a La–Ön (0,018) p-je kisebb 0,05-nél. A $\mathrm{Ko}$–$\mathrm{Vi}$ súlya ugyanannyi, mint a $\mathrm{Sz}$–$\mathrm{Kl}$-é, de a $\mathrm{Ko}$ és a $\mathrm{Vi}$ 4–4 cikkben szerepel, így 2 közös cikk véletlenül is várható. A „7 él” a globális $w \ge 2$ küszöb. A „csak La–Ön” megint a súlyt nézi. (Bonferroni-korrekcióval, $0{,}05/21 \approx 0{,}0024$-gyel egyik pár sem maradna.)`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 50 szereplős korpuszban minden szereplőpárra páros gerinc-tesztet futtatsz. Mennyi a Bonferroni-küszöb 5%-on?`,
          options: [R`$\approx 4 \cdot 10^{-5}$`, R`$1 \cdot 10^{-3}$`, R`$\approx 2 \cdot 10^{-5}$`, R`$\approx 2{,}4 \cdot 10^{-3}$`],
          answer: 0,
          hint: R`Hány teszt fut? Irányítatlan párokról van szó.`,
          explain: R`$\binom{50}{2} = 1225$ pár, a küszöb $0{,}05/1225 \approx 4 \cdot 10^{-5}$. Az $1 \cdot 10^{-3} = 0{,}05/50$ a szereplők számával oszt, nem a párokéval. A $2 \cdot 10^{-5} = 0{,}05/2450$ rendezett párokkal számol, holott az együttemlítés szimmetrikus. A $0{,}0024 = 0{,}05/21$ az Árvízhét 7 szereplőjének küszöbe. Korrekció nélkül, ha egyik pár sem különleges, 1225 párból kb. 61 hamis „szignifikáns” pár várható.`
        }
      ]
    },

    /* ------------------------------------------------ 10.6 */
    "gh10-106": {
      title: "Kvíz – 10.6 Hiányzó adat és robusztusság",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten a köztesség szerint a $\mathrm{Po}$ a fő közvetítő (8). Egyetlen cikk hiányzik, és vele a $\mathrm{Ko}$–$\mathrm{Po}$ él. Ki lesz a fő közvetítő?`,
          options: [
            R`$\mathrm{Vi}$ (9)`,
            R`$\mathrm{Po}$ (8) – egy él nem változtat az első helyen`,
            R`$\mathrm{Ko}$ (9,5)`,
            R`$\mathrm{Sz}$ (2)`
          ],
          answer: 0,
          hint: R`A $\mathrm{Ko}$-oldal ($\mathrm{Ko}$, $\mathrm{Sz}$, $\mathrm{Kl}$) és a $\mathrm{Po}$-oldal ($\mathrm{Po}$, La, Ön) között ilyenkor merre mennek a legrövidebb utak?`,
          explain: R`A $\mathrm{Ko}$–$\mathrm{Po}$ nélkül a két oldal közti utak mind a $\mathrm{Vi}$-n át mennek: köztessége 1,5-ről 9-re ugrik, a $\mathrm{Po}$-é 8 marad, a $\mathrm{Ko}$-é 2-re esik (<a class="xref" href="#s106-a-el">10.6</a>). A „$\mathrm{Po}$ marad” a helyi mérőszámok logikája – a köztesség globális. A $\mathrm{Ko}$ 9,5-es értéke a $\mathrm{Vi}$–$\mathrm{Po}$ él hiányából jön. A $\mathrm{Sz}$ 2-re nő, de messze nem első.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben az esetben ($\mathrm{Ko}$–$\mathrm{Po}$ hiányzik) hogyan változik a $\mathrm{Ko}$ fokszáma és köztessége?`,
          options: [
            R`fokszám $4 \to 3$, köztesség $5 \to 2$`,
            R`fokszám $4 \to 3$, köztesség $5 \to 4$`,
            R`fokszám $4 \to 3$, köztesség $5 \to 5$`,
            R`fokszám $4 \to 2$, köztesség $5 \to 2$`
          ],
          answer: 0,
          hint: R`A fokszám helyi: csak a két végpont veszít. A köztességhez gondold végig, mely párok legrövidebb útja ment eddig a $\mathrm{Ko}$-n át.`,
          explain: R`A $\mathrm{Ko}$ egy élt veszít ($4 \to 3$), a köztessége viszont 5-ről 2-re esik, mert a $\mathrm{Sz}$ és a $\mathrm{Kl}$ felől a $\mathrm{Po}$-oldal felé az utak mostantól a $\mathrm{Vi}$-n át vezetnek. A „$5 \to 4$” és az „$5 \to 5$” a köztességet is helyi mérőszámnak kezeli, amely legfeljebb egy egységgel mozdul. A „$4 \to 2$” két élt vesz el, pedig csak egy hiányzik.`
        },
        {
          type: "set",
          q: R`Egyetlen él hiányzik. Melyik mérőszám változhat meg olyan csúcsoknál is, amelyek nem végpontjai a hiányzó élnek? (Jelöld meg mindet.)`,
          items: ["fokszám", "erősség", "köztesség", "közelség"],
          answer: ["köztesség", "közelség"],
          hint: R`Melyik mérőszám csak a csúcs saját éleiből számolódik, és melyik az összes csúcspár legrövidebb útjaiból?`,
          explain: R`A fokszám és az erősség helyi: egy hiányzó éltől csak a két végpont értéke változik, egy-egy egységgel (illetve a súllyal). A köztesség és a közelség utakra épül: egy él sok pár legrövidebb útját átírhatja, különösen, ha híd vagy egy alternatív út része. Ezért a köztesség az érzékenyebb – a tipikus hiba a fordítottját gondolni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubban 20% véletlenül hiányzó élnél a köztességi rangsor átlagos Spearman-$\rho$-ja az eredetivel 0,86. Az esetek hány százalékában változik meg, ki a fő közvetítő?`,
          options: ["kb. 10%", "kb. 14%", "szinte soha – a ρ magas", "kb. 90%"],
          answer: 0,
          hint: R`Az átlagos rangegyezés és az első hely egyezése két külön sor a <a class="xref" href="#s106-b">10.6</a> táblázatában.`,
          explain: R`20% hiánynál az első helyezett az esetek 90%-ában ugyanaz, tehát kb. 10%-ban megváltozik. A 14% az $1 - \rho$ – a $\rho$ nem „egyezési arány”. A „szinte soha” az átlagos $\rho$-ból von le egyéni állítást: a rangsor egésze és egy-egy pontja mást mér. A 90% az egyezés aránya, nem a változásé.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató API-n gyűjti a cikkeket, de az API csak a napi 100 legnépszerűbbet adja. Mi a helyes értékelés?`,
          options: [
            R`Nem véletlen hiány: a kis szereplők élei hiányoznak inkább, a nagyok centralitása felfelé torzul – ezt a véletlen törléses ellenőrzés nem mutatja meg.`,
            R`A hiány csak zaj: elég sok cikknél kiátlagolódik.`,
            R`A véletlen törléses robusztussági ellenőrzés kimutatja és korrigálja ezt a torzítást.`,
            R`Minden szereplő centralitása arányosan csökken, a rangsor nem változik.`
          ],
          answer: 0,
          hint: R`Véletlen-e, hogy mely cikkek maradnak ki? Kiket érint inkább?`,
          explain: R`A hiány rendszerszerű: a kevésbé népszerű témák (helyi ügyek, kis szereplők) cikkei esnek ki, így a nagy szereplők centralitása felfelé torzul (<a class="xref" href="#s106-b">10.6</a>). A nem véletlen hiány nem átlagolódik ki – ez a „csak zaj” tévedése. A véletlen törlés azt méri, mennyit rontana további <em>véletlen</em> hiány; a rendszerszerű hiányhoz a valószínű mechanizmust kell szimulálni. Az „arányos csökkenés” épp a torzítást tagadja.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy elemzésben három döntést vizsgálsz (küszöb, időablak, felbontás), mindegyikhez 4 értéket. Hány cellás az érzékenységi rács?",
          options: ["64", "12", "81", "16"],
          answer: 0,
          hint: "A rács minden döntés minden értékét minden más döntés minden értékével párosítja.",
          explain: R`$4 \cdot 4 \cdot 4 = 4^3 = 64$ cella. A 12 ($3 \cdot 4$) az egyenkénti változtatás – az nem rács, és a döntések kölcsönhatását nem mutatja. A 81 ($3^4$) felcseréli az alapot és a kitevőt. A 16 a Les Misérables 4 × 4-es rácsa, ott csak két döntés volt.`
        },
        {
          type: "multi",
          q: R`A Les Misérables közösségeit a küszöb ($t$ = 1, 2, 3, 5) és a Louvain-felbontás ($\gamma$ = 0,5, 1, 1,5, 2) rácsán futtattad, és NMI-vel vetetted össze az alapesettel ($t = 1$, $\gamma = 1$). Mi igaz? (Több jó válasz is lehet.)`,
          options: [
            R`Egy soron belül (a felbontás változtatásával) az egyezés viszonylag keveset változik; egy oszlopon belül (a küszöbbel) sokat.`,
            R`Ha egy állítás csak a $t = 1$ sorban jön ki, az a küszöb választásán múlik.`,
            R`A teljes térképet kell közölni, nem a legérdekesebb eredményt adó cellát.`,
            R`A legfontosabb döntés a felbontás; a küszöb alig számít.`,
            R`Elég a döntéseket egyenként változtatni, a rács fölösleges.`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg a <a class="xref" href="#s106-c-racs">10.6 rácsát</a>: hol nagyobb az eltérés, a sorok vagy az oszlopok mentén?`,
          explain: R`Igaz az első: pl. $t = 1$-nél az NMI 0,85–1, viszont $\gamma = 1$ mellett a küszöbbel 1 → 0,80 → 0,63 → 0,60. Ezért a „csak $t = 1$-nél” igaz állítás a küszöbön múlik. Igaz a harmadik: a legszebb cella kiválasztása hálózati p-hacking. Hamis a negyedik (fordítva igaz). Hamis az ötödik: a döntések kölcsönhatnak, egyenként változtatva ezt nem látod.`
        }
      ]
    },

    /* ------------------------------------------------ 10.7 */
    "gh10-107": {
      title: "Kvíz – 10.7 ERGM és időbeli modellek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 8 csúcsú gráfban 7 él van. Mennyi az élparaméteres ERGM legjobban illeszkedő $\theta$-ja?`,
          options: [R`$\approx -1{,}099$`, R`$\approx 1{,}099$`, R`$\approx -1{,}386$`, R`$0{,}25$`],
          answer: 0,
          hint: R`Ez az Erdős–Rényi-gráf: a becsült $p$ = élszám / párok száma, és $\theta$ a $p$ logitja.`,
          explain: R`$\binom82 = 28$ pár, $p = 7/28 = 0{,}25$, $\theta = \ln\dfrac{0{,}25}{0{,}75} = \ln(1/3) \approx -1{,}099$. A $+1{,}099$ fordítva osztott ($\ln(0{,}75/0{,}25)$). A $-1{,}386 = \ln 0{,}25$ elfelejti az $1 - p$-vel osztást. A $0{,}25$ maga a $p$: a $\theta$ nem valószínűség, hanem logit (ritka hálózatban negatív).`
        },
        {
          type: "single", shuffle: true,
          q: R`ERGM él- és háromszögtaggal: $\theta_{\text{él}} = -1{,}5$, $\theta_\Delta = 0{,}5$. Mekkora a $(i, j)$ él feltételes esélye, ha $i$-nek és $j$-nek 3 közös szomszédja van?`,
          options: [R`$0{,}5$`, R`$\approx 0{,}182$`, R`$\approx 0{,}269$`, R`$\approx 0{,}818$`],
          answer: 0,
          hint: R`Változási statisztika: a feltételes logit $\theta_{\text{él}} + \theta_\Delta \cdot c_{ij}$. Aztán vissza valószínűségre.`,
          explain: R`Logit $= -1{,}5 + 0{,}5 \cdot 3 = 0$, az esély $e^0/(1 + e^0) = 0{,}5$. A $0{,}182$ a háromszögtagot kihagyja ($c = 0$). A $0{,}269$ csak egy közös szomszéddal számol (logit $-1$). A $0{,}818$ az élparamétert hagyja el (logit $1{,}5$). Minden közös szomszéd $\theta_\Delta$-val emeli a logitot – az él annyi háromszöget zárna be.`
        },
        {
          type: "single", shuffle: true,
          q: R`4 csúcson a 64 címkézett gráfból hánynak van pontosan 3 éle és 0 háromszöge?`,
          options: ["16", "20", "12", "4"],
          answer: 0,
          hint: R`Hányféleképpen választható 3 él a 6 párból? Ezek közül hány zár háromszöget?`,
          explain: R`$\binom63 = 20$ háromélű gráf van; ebből 4 háromszög (egy-egy a 4 csúcshármasra), így $20 - 4 = 16$ háromszögmentes: 12 út és 4 csillag (<a class="xref" href="#s107-b">10.7</a>). A 20 az összes 3 élű gráf. A 12 csak az utakat, a 4 csak a csillagokat (vagy a háromszögeket) számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`4 csúcson $\theta = (0, 0)$, azaz mind a 64 gráf egyformán valószínű. Mennyi a várható élszám és a várható háromszögszám?`,
          options: [
            R`$3$ él, $0{,}5$ háromszög`,
            R`$3$ él, $0{,}125$ háromszög`,
            R`$3$ él, $4$ háromszög`,
            R`$6$ él, $4$ háromszög`
          ],
          answer: 0,
          hint: R`Ilyenkor minden él $1/2$ eséllyel van meg, egymástól függetlenül. Hány lehetséges háromszög van 4 csúcson, és mekkora eséllyel van meg egy?`,
          explain: R`Élek: $6 \cdot 0{,}5 = 3$. Háromszögek: 4 lehetséges, mindegyik $0{,}5^3 = 0{,}125$ eséllyel, összesen $4 \cdot 0{,}125 = 0{,}5$. A $0{,}125$ egyetlen háromszög esélye, a 4-gyel szorzás elmaradt. A 4 a <em>lehetséges</em> háromszögek száma, nem a várható. A „6 él, 4 háromszög” a teljes gráf.`
        },
        {
          type: "single", shuffle: true,
          q: R`A megfigyelt 4 csúcsú gráf: háromszög + egy hozzá lógó él (4 él, 1 háromszög). Az él- és háromszögtagos ERGM illesztése $\theta_{\text{él}} = 1{,}275$, $\theta_\Delta = -0{,}647$. Miért negatív a háromszögtag?`,
          options: [
            R`Mert ennyi élhez a független élek ($p = 2/3$) kb. 1,185 háromszöget jósolnának, a megfigyelt 1 ennél kevesebb.`,
            R`Mert a gráfban van háromszög – a háromszögtag ilyenkor mindig negatív.`,
            R`Mert az élparaméter pozitív, és a két paraméter összege mindig nulla közelében van.`,
            R`Mert a gráf szélső eset, a becslés nem létezik, a negatív érték csak numerikus hiba.`
          ],
          answer: 0,
          hint: R`A háromszögtag előjele azt mutatja, több vagy kevesebb háromszög van-e, mint amit a többi tag (itt az élszám) megmagyaráz.`,
          explain: R`Az élszámot a $\theta_{\text{él}}$ hozza be; a $\theta_\Delta$ csak azt méri, a háromszög a „független” várhatóhoz képest több vagy kevesebb. $4 \cdot (2/3)^3 \approx 1{,}185 \gt 1$, így negatív. Hogy van-e háromszög, önmagában nem dönt: a háromszög + magányos csúcs (3 él, 1 háromszög) $\theta_\Delta = 1{,}469$-et ad. A paraméterek összegére nincs ilyen szabály. Szélső eset (nem létező becslés) a 3 élű út – ez a gráf nem az.`
        },
        {
          type: "multi",
          q: R`Mi igaz az él- és háromszögtagos ERGM-re? (Több jó válasz is lehet.)`,
          options: [
            R`Ha a megfigyelt gráf a 3 élű út (3 él, 0 háromszög), a becslés nem létezik: a $\theta_\Delta$ a $-\infty$ felé szalad.`,
            R`Nagyobb gráfon a pozitív $\theta_\Delta$ degenerációt okozhat: a modell majdnem üres vagy majdnem teljes gráfot ad.`,
            R`Az élek már nem függetlenek, mert egy háromszög három élen múlik egyszerre.`,
            R`Egy szignifikáns pozitív $\theta_\Delta$ bizonyítja, hogy a barátok barátai barátok lesznek.`,
            R`A $\theta_{\text{él}}$ egy él megjelenésének valószínűsége.`
          ],
          answer: [0, 1, 2],
          hint: R`Mit mond a változási statisztika, és mit nem mond az illesztett modell az okokról?`,
          explain: R`Igaz az első: kevesebb háromszög 3 élen nem lehet, a likelihood a $\theta_\Delta \to -\infty$ felé nő. Igaz a második: 6 csúcson $(-1;\ 1)$-nél a várható élszám már 10,6 a 15-ből, $(-1{,}5;\ 1{,}2)$-nél kétpúpú az eloszlás – ezért használnak szelídebb tagokat (GWESP). Igaz a harmadik: a háromszögtag nem bomlik páronkénti szorzóra. Hamis a negyedik: a pozitív $\theta_\Delta$ csak azt mondja, hogy több a háromszög, mint amit a többi tag magyaráz – közös fókusz vagy homofília is okozhatja. Hamis az ötödik: a $\theta$ logit, az esély $e^\theta/(1 + e^\theta)$.`
        },
        {
          type: "match",
          q: "Párosítsd a kérdést a modellel!",
          pairs: [
            ["Hasonlít-e két lap napirend-hálózata ugyanazon a héten?", "QAP"],
            ["Melyik hálózat magyarázza a tanácskérést, a többit rögzítve?", "MRQAP"],
            ["Több-e a háromszög, mint amit a gyakoriság és a homofília magyaráz?", "ERGM"],
            ["Szelekció vagy befolyás: a barátok azért dohányoznak együtt, mert egymást választják, vagy mert egymásra hatnak?", "SAOM"],
            ["A heti hálózatot írja le egy olyan modell, amelyben a múlt heti él is tag.", "TERGM"]
          ],
          hint: R`Teszt vagy modell? Keresztmetszet vagy idő? Nézd meg a <a class="xref" href="#s107-c">10.7 „Mikor melyiket?”</a> listáját.`,
          explain: R`Két hálózat hasonlósága: QAP (<a class="xref" href="#s103">10.3</a>). Magyarázat a többi rögzítésével: MRQAP (<a class="xref" href="#s104">10.4</a>). A szerkezet okai (háromszögzárás, homofília együtt): ERGM. A viselkedés és a hálózat együttes változása, szelekció vs. befolyás: SAOM (RSiena). Időbeli ERGM, a korábbi hálózat tagként: TERGM. A tipikus hiba a QAP-ot „magyarázó modellnek” használni – az csak tesztel, a szerkezetet nem modellezi.`
        }
      ]
    },

    /* ------------------------------------------------ 10.8 */
    "gh10-108": {
      title: "Kvíz – 10.8 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A VN–NY bináris mátrixkorrelációjára 7 szereplőn a naiv próba $p = 0{,}003$-at ad. Miért rossz ez a szám?`,
          options: [
            R`Mert 21 független cellát feltételez, holott a VN mindhárom éle a $\mathrm{Po}$-n megy át: az egyezések „csomagban” jönnek.`,
            R`Mert 21 cella túl kevés; 1000 cellánál a naiv próba már helyes lenne.`,
            R`Mert a súlyozott korreláció negatív, és csak az számít.`,
            R`Mert a naiv próba kétoldali, a helyes pedig egyoldali.`
          ],
          answer: 0,
          hint: R`Mit tesz fel a naiv t-próba a cellákról? Igaz ez, ha egy csúcs több élben is szerepel?`,
          explain: R`A naiv próba a diádokat függetlennek veszi, de egy csúcs sora együtt mozog (sor- és oszlopautokorreláció, <a class="xref" href="#s102-b">10.2</a>). A VN csillagja a $\mathrm{Po}$ körül van, így ha a $\mathrm{Po}$ „egyezik”, egyszerre több cella egyezik. A „nagy $N$ megment” tévedés: a függőség nem tűnik el sok cellánál, a szimulációban a hamis riasztás akár 46%. A súlyozott $r$ egy másik döntés, nem a naiv p hibája. Az egy- és kétoldali próba keverése sem ez.`
        },
        {
          type: "single", shuffle: true,
          q: R`A VN–NY QAP p-értéke 4 szereplőn 0,75, 7 szereplőn 0,086. Mi a különbség oka?`,
          options: [
            R`7 szereplőnél a permutáció a csillagot és a háromszöget olyan szereplőkre is teheti, akik egyik lapban sem szerepelnek, így a véletlen ritkábban ad 2 közös élt.`,
            R`Több permutáció (5040 a 24 helyett) mindig kisebb p-t ad.`,
            R`7 szereplőn a lapok valójában jobban hasonlítanak egymáshoz.`,
            R`Az egyik egyoldali, a másik kétoldali p-érték.`
          ],
          answer: 0,
          hint: R`Mi változik a nulleloszlásban, ha a csúcshalmazba üres csúcsokat is beveszel?`,
          explain: R`A két p-érték két különböző kérdésre felel: ki tartozik a csúcshalmazba? 7 szereplőn a véletlen megfeleltetés gyakran „üres” szereplőkre teszi az éleket, ezért ritkább a 2 közös él (<a class="xref" href="#s108-a">10.8</a>). A permutációk száma csak a felbontást adja (a legkisebb elérhető p-t), nem tolja le magától a p-t. A lapok élei mindkét esetben ugyanazok. Mindkét érték egyoldali.`
        },
        {
          type: "multi",
          q: R`Krackhardt menedzserei: a barátság egyedül QAP $p \approx 0{,}02$ (naiv 0,0015); a főnöki viszony mellett az MRQAP-ban $b = 0{,}136$, DSP $p \approx 0{,}10$; az $R^2$ 0,063, a tenure-rel 0,100. Mi igaz? (Több jó válasz is lehet.)`,
          options: [
            R`A barátság egyedül szignifikánsnak látszik, de a főnöki viszony mellett elveszíti a hatását – részben, mert a főnököt gyakran barátnak is mondják.`,
            R`A kis $R^2$ azt jelzi, hogy a tanácskérés fő okai (pl. a szakértelem) nincsenek a modellben.`,
            R`A DSP $p \approx 0{,}10$ alapján nem mondhatjuk, hogy a barátság egyáltalán nem hat: 21 fővel kicsi a próba ereje.`,
            R`A barátság nem befolyásolja, kitől kérsz tanácsot.`,
            R`A naiv $p = 0{,}0015$ bizonyítja, hogy a barátság számít.`
          ],
          answer: [0, 1, 2],
          hint: R`Különböztesd meg: „nem mutatható ki” vs. „nincs hatás”; naiv vs. permutációs p.`,
          explain: R`Igaz az első (<a class="xref" href="#s108-b">10.8</a>): a 20 főnöki cellából 12 baráti is, így a két magyarázó összefügg. Igaz a második: az $R^2$ kicsi, de ebből nem következik, hogy „nincs hatás” – csak hogy sok minden hiányzik. Igaz a harmadik: a nem szignifikáns eredmény nem bizonyítja a hatás hiányát. Hamis a negyedik – épp ez a hiba. Hamis az ötödik: a naiv p független cellákat feltételez, hálózaton hamisan kicsi.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hét eleje és vége hálózatára: bináris $r = 0{,}224$, QAP $p = 0{,}286$. Mit mondasz a napirend stabilitásáról?`,
          options: [
            R`Nem mutatható ki: ekkora egyezés véletlenül is gyakori (vagy a korpusz túl kicsi a döntéshez).`,
            R`Stabil, mert a korreláció pozitív.`,
            R`Stabil, mert a naiv $p = 0{,}33$ helyett a QAP kisebb p-t adott.`,
            R`Bizonyítottan nem stabil: a p nagy, tehát a két hálózat független.`
          ],
          answer: 0,
          hint: R`Mit kellene látnod a „stabil” állításhoz? És mit jelent egy nagy p?`,
          explain: R`A „stabil” állításhoz nagy, QAP-szignifikáns korreláció kellene, amely több küszöbnél és súlyozásnál is megmarad. Itt $p \approx 0{,}29$: ennyi egyezés a véletlen megfeleltetésnél is gyakori. A pozitív $r$ önmagában leíró szám, nem bizonyíték. A naiv és a QAP p összevetése nem a stabilitásról szól. A „bizonyítottan független” a nagy p-t a nullhipotézis bizonyítékának olvassa – 12 cikkből erre sincs alap.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató két portál 30 szereplős együttemlítési hálózatát hasonlítja össze: $r = 0{,}52$, QAP $p \lt 0{,}001$. Az ellenőrző lista szerint mit kérdeznél tőle először?`,
          options: [
            R`Kontrollálta-e a gyakoriságot (pl. $f_i \cdot f_j$-t MRQAP-ban), hogy a hasonlóság ne csak a mindkét portálon gyakori szereplőkből jöjjön?`,
            R`Futtatott-e naiv t-próbát is, hogy megerősítse a QAP-ot?`,
            R`Miért csak 5000 permutációt futtatott, ha a $30!$ mind felsorolható?`,
            R`Miért nem a legmagasabb $r$-t adó küszöböt választotta?`
          ],
          answer: 0,
          hint: R`A hírelemzésben mi a leggyakoribb oka annak, hogy két hálózat „hasonlít”, a kapcsolatokon túl?`,
          explain: R`Ha egy szereplő mindkét portálon sokat szerepel, az élei mindkettőben erősek lesznek – a hasonlóság ilyenkor az első szintű (gyakorisági) egyezésből jön. Ezt MRQAP-kontrollal (a gyakoriságok szorzata vagy egy páros nullmodell várható súlya) kell kiszűrni (<a class="xref" href="#s108-c">10.8</a>). A naiv t-próba hálózaton hamis, nem „megerősítés”. A $30!$ permutáció nem sorolható fel, a véletlen permutáció a helyes út. A legszebb küszöb kiválasztása p-hacking.`
        },
        {
          type: "single", shuffle: true,
          q: R`Tegyük fel, hogy a VN–NY hasonlóság QAP-pal is szignifikáns lenne. Miért nem következne ebből, hogy az egyik lap átveszi a másik napirendjét?`,
          options: [
            R`Mert a két lap részben ugyanazokról az eseményekről írt: a közös ok maga az esemény, és a keresztmetszeti QAP ezt nem választja szét.`,
            R`Mert a QAP csak súlyozott hálózatokon értelmezhető.`,
            R`Mert a szignifikáns QAP éppen a függetlenséget igazolja.`,
            R`Következne: a szignifikáns hasonlóság a napirend-átvétel bizonyítéka.`
          ],
          answer: 0,
          hint: R`Keresztmetszeti adat: honnan tudnád, ki volt előbb, és van-e harmadik, közös ok?`,
          explain: R`A hasonlóságnak lehet közös oka (az elöntött pincék, a töltésbejárás, a segély eseményei), és mehet mindkét irányba. Keresztmetszeti adatból nem mondunk okságot – ehhez időbeli (késleltetett) elemzés kellene (<a class="xref" href="#s108-a">10.8</a>). A QAP bináris hálózaton is működik. A szignifikancia épp a függetlenség ellen szól, nem mellette.`
        },
        {
          type: "multi",
          q: "Melyik lépés szerepel a két hálózat összehasonlításának ellenőrző listáján? (Több jó válasz is lehet.)",
          options: [
            "Rögzítsd és indokold a csúcshalmazt.",
            "Tesztelj QAP-pal, elég permutációval, előre eldöntve az egy- vagy kétoldali próbát.",
            "Vizsgáld az érzékenységet: küszöb, ablak, csúcshalmaz, súlyozás.",
            "Nagy hálózatnál elég a naiv t-próba, mert sok a cella.",
            "Futtasd több küszöbbel, és a legszignifikánsabbat közöld."
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig a <a class="xref" href="#s108-c">10.8 ellenőrző listáját</a>: mi védi az eredményt a döntéseid véletlenjeitől?`,
          explain: R`A lista része a csúcshalmaz rögzítése (a QAP azonos csúcshalmazt feltételez), a QAP elég permutációval ($\ge 5000$), előre eldöntött oldalúsággal, és az érzékenységvizsgálat. A naiv t-próba sok cellánál is hamis – a „nagy $N$ megment” tévedés. A legszignifikánsabb beállítás kiválasztása hálózati p-hacking: a teljes térképet kell közölni.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh10-final": {
      title: "Fejezetzáró teszt – 10. Hálózatok összehasonlítása és következtetés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Két súlyozott hálózat 3 csúcson: $A$: $AB = 3$, $AC = 1$; $B$: $AB = 1$, $AC = 1$, $BC = 2$. Mennyi a súlyozott Jaccard, $J_w$?`,
          options: [R`$1/3$`, R`$2/3$`, R`$1/4$`, R`$1/2$`],
          answer: 0,
          hint: R`$J_w = \sum \min / \sum \max$ – az összes élen, amely legalább az egyikben megvan.`,
          explain: R`$\sum\min = 1 + 1 + 0 = 2$, $\sum\max = 3 + 1 + 2 = 6$, $J_w = 1/3$. A $2/3$ a bináris Jaccard (2 közös él a 3-ból) – a súlyokat elhagyja. Az $1/4 = 2/8$ az összes súly összegével oszt a $\sum\max$ helyett (<a class="xref" href="#s101-b">10.1</a>). Az $1/2 = 2/4$ csak a közös éleken számolja a $\max$-ot, a $BC$-t kihagyja.`
        },
        {
          type: "single", shuffle: true,
          q: R`5 csúcson ($A$–$E$, 10 cella) két hálózat: $\{AB, AC, BC\}$ és $\{AB, AC, DE\}$. Mennyi a $\varphi$-együttható?`,
          options: [R`$11/21 \approx 0{,}524$`, R`$0{,}5$`, R`$0{,}8$`, R`$2/3 \approx 0{,}667$`],
          answer: 0,
          hint: R`Számold meg: $a$ (mindkettőben él), $b$, $c$ (csak az egyikben), $d$ (egyikben sem). $\varphi = (ad - bc)/\sqrt{(a+b)(c+d)(a+c)(b+d)}$.`,
          explain: R`$a = 2$, $b = 1$ ($BC$), $c = 1$ ($DE$), $d = 6$. $\varphi = (12 - 1)/\sqrt{3 \cdot 7 \cdot 3 \cdot 7} = 11/21 \approx 0{,}524$. A $0{,}5$ a Jaccard ($2/4$) – az nem számolja a közös hiányokat. A $0{,}8 = (a + d)/10$ az egyezési arány, amely a ritka hálózatban a sok közös hiány miatt magas. A $2/3 = a/(a+b)$ egy feltételes arány, nem korreláció.`
        },
        {
          type: "multi",
          q: R`Független hálózatok szimulációja ($n = 20$, csúcshatással): a naiv próba 5%-on $\rho = 1$, illetve $2$ erősségű csúcshatásnál az esetek 46%, illetve 48%-ában jelez, a QAP 4,5–6%-ban. Mi igaz? (Több jó válasz is lehet.)`,
          options: [
            R`A naiv próba azért riaszt hamisan, mert egy csúcs sorának cellái együtt mozognak (sor- és oszlopautokorreláció).`,
            R`A QAP azért tartja az 5%-ot, mert a csúcsok szerkezetét megtartja, csak a megfeleltetést keveri.`,
            R`Egy csúcs egy 10 csúcsú irányítatlan hálóban 9 cellát érint a 45-ből – ezért nem független a 45 cella.`,
            R`Ha a hálózat elég nagy, a naiv próba is helyes lesz.`,
            R`A cellák egyenkénti keverése ugyanazt adja, mint a QAP.`
          ],
          answer: [0, 1, 2],
          hint: R`Mit feltételez a naiv próba, és mit keverne össze a cellánkénti permutáció?`,
          explain: R`Igaz az első három (<a class="xref" href="#s102-b">10.2</a>, <a class="xref" href="#s103">10.3</a>): a csúcshatás egy csúcs összes celláját együtt mozgatja, ezért a 45 cella nem 45 független megfigyelés. A QAP a sorokat és az oszlopokat együtt permutálja, így ez a függés a nulleloszlásban is megmarad. Hamis, hogy a „nagy $N$ megment”: a függés nem tűnik el. Hamis, hogy a cellakeverés ugyanaz: az széttöri a sorokat, és a naivhoz hasonló, túl szűk nulleloszlást ad (Krackhardtnál szórás 0,049 a QAP 0,072-je helyett).`
        },
        {
          type: "single", shuffle: true,
          q: R`Teljes felsorolású QAP 5 csúcson: a 120 permutációból 3 (az identitással együtt) ad a megfigyeltnél nem kisebb $r^*$-ot. Mennyi az egyoldali p?`,
          options: [R`$0{,}025$`, R`$\approx 0{,}017$`, R`$\approx 0{,}033$`, R`$0{,}05$`],
          answer: 0,
          hint: R`Teljes felsorolásnál a p egyszerűen arány. Benne van-e az identitás?`,
          explain: R`$p = 3/120 = 0{,}025$. A $0{,}017 = 2/120$ kihagyja az identitást – pedig az is egy permutáció, és mindig eléri a megfigyeltet. A $0{,}033 = 4/121$ a véletlen permutációk $(k+1)/(M+1)$ képletét alkalmazza a teljes felsorolásra, ahol az identitás már benne van a 3-ban. A $0{,}05$ duplázással kétoldalit csinál belőle, holott egyoldali próbát kértünk.`
        },
        {
          type: "single", shuffle: true,
          q: R`Véletlen permutációs QAP: $M = 999$ permutációból $k = 19$ éri el a megfigyelt $r$-t. Mennyi a becsült $\hat p$ és nagyjából a standard hibája?`,
          options: [
            R`$\hat p = 0{,}020$, hiba $\approx 0{,}0044$`,
            R`$\hat p = 0{,}019$, hiba $\approx 0{,}0044$`,
            R`$\hat p = 0{,}020$, hiba $\approx 0{,}014$`,
            R`$\hat p = 0{,}020$, hiba $0$ – a p pontos`
          ],
          answer: 0,
          hint: R`$\hat p = (k+1)/(M+1)$, a hiba $\approx \sqrt{p(1-p)/M}$.`,
          explain: R`$\hat p = 20/1000 = 0{,}020$, a hiba $\sqrt{0{,}02 \cdot 0{,}98/999} \approx 0{,}0044$ (<a class="xref" href="#s103-b">10.3</a>). A $0{,}019 = 19/999$ a $k/M$ – kihagyja a megfigyelt (identitás) esetet. A $0{,}014$ a 99 permutációs hiba. A „pontos” elfelejti, hogy a véletlen permutációk mintavétel: más magnál más $\hat p$ jön ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`MRQAP egyetlen bináris magyarázóval: a 30 baráti cellából 18-ban van tanácskérés, a 70 nem baráti cellából 14-ben. Mennyi a barátság együtthatója, $b_1$?`,
          options: [R`$0{,}4$`, R`$0{,}6$`, R`$3$`, R`$\approx 0{,}56$`],
          answer: 0,
          hint: R`Bináris magyarázónál az OLS két arány különbségét adja: $b_0$ a nem barátoknál, $b_0 + b_1$ a barátoknál.`,
          explain: R`$b_0 = 14/70 = 0{,}2$, $b_0 + b_1 = 18/30 = 0{,}6$, így $b_1 = 0{,}4$ (<a class="xref" href="#s104-a">10.4</a>). A $0{,}6$ a barátoktól kért tanács aránya, az $b_0 + b_1$, nem $b_1$. A 3 az arányok hányadosa – a regresszió különbséget ad, nem arányt. A $0{,}56 = 18/32$ megfordítja a feltételt: a tanácskérések közül hány baráti.`
        },
        {
          type: "single", shuffle: true,
          q: R`Krackhardt adatán a barátság + főnöki viszony MRQAP-ban a barátság $b = 0{,}136$; naiv $p = 0{,}016$, Y-permutáció $0{,}11$, DSP $0{,}10$. Mit írsz a cikkbe?`,
          options: [
            R`$b = 0{,}136$, DSP $p \approx 0{,}10$: a főnöki viszony mellett a barátság hatása 5%-on nem mutatható ki.`,
            R`$b = 0{,}136$, $p = 0{,}016$: a barátság szignifikáns.`,
            R`A permutált $b^*$-ok átlaga adja az együtthatót, a p a naiv.`,
            R`A barátság nem hat a tanácskérésre.`
          ],
          answer: 0,
          hint: R`Az MRQAP-ban az együttható a szokásos OLS, de a p-érték melyik?`,
          explain: R`Az együttható a szokásos, a p-érték permutációs; összefüggő magyarázóknál (barátság–jelent korreláció 0,19) a DSP a pontosabb (<a class="xref" href="#s104-b">10.4</a>). A naiv $p = 0{,}016$ független cellákat feltételez – hálózaton hamis. A permutált $b^*$-ok a nulleloszlást adják (átlaguk 0 körül van), nem az együtthatót. A „nem hat” a nem szignifikáns eredményből a hatás hiányát olvassa ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`Diszparitásszűrő, $\alpha = 0{,}05$. Az $u$–$v$ él súlya 6. Az $u$ élei: 6, 3, 1; a $v$ élei: 6, 1, 1, 1, 1. Megmarad-e az él?`,
          options: [
            R`Igen: a $v$ felől $\alpha_{ij} = 0{,}4^4 \approx 0{,}026 \lt 0{,}05$, és egy vég elég.`,
            R`Nem: az $u$ felől $\alpha_{ij} = 0{,}4^2 = 0{,}16$, és mindkét végről meglepőnek kell lennie.`,
            R`Igen, mert mindkét csúcsnál ez a legnagyobb súlyú él.`,
            R`Nem: a $v$ felől $\alpha_{ij} = 0{,}6^4 \approx 0{,}13$.`
          ],
          answer: 0,
          hint: R`Mindkét végről számold ki az $\alpha_{ij}$-t ($s = 10$ mindkettőnél, de a fokszám más). Mi a gerincbe kerülés szabálya?`,
          explain: R`Az $u$ felől $(1 - 0{,}6)^2 = 0{,}16$, a $v$ felől $(1 - 0{,}6)^4 \approx 0{,}0256$. Az él akkor kerül a gerincbe, ha <em>valamelyik</em> végéről nézve $\alpha_{ij} \lt \alpha$ – itt a $v$ felől igen (<a class="xref" href="#s105-b">10.5</a>). A „mindkét végről” szigorúbb szabály, nem ez a módszer. A „legnagyobb súly” a súlyt nézi, nem a meglepetést: a 7, 2, 1 csúcs 7-es éle is legnagyobb, mégis kiesik. A $0{,}6^4$ a $w/s$-t írja az $1 - w/s$ helyére.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhéten a $\mathrm{Vi}$–$\mathrm{Sz}$ él hiányzik a gyűjtésből. Ki a fő közvetítő (köztesség)?`,
          options: [
            R`holtverseny: $\mathrm{Ko}$ és $\mathrm{Po}$ (8–8)`,
            R`$\mathrm{Po}$ egyedül (8)`,
            R`$\mathrm{Ko}$ egyedül (9,5)`,
            R`$\mathrm{Vi}$ (9)`
          ],
          answer: 0,
          hint: R`A $\mathrm{Sz}$ és a $\mathrm{Kl}$ ilyenkor csak a $\mathrm{Ko}$-n át éri el a többieket. Hány pár útja megy így a $\mathrm{Ko}$-n át?`,
          explain: R`A $\mathrm{Vi}$–$\mathrm{Sz}$ nélkül a $\{\mathrm{Sz}, \mathrm{Kl}\}$ minden útja a $\mathrm{Ko}$-n megy át, így a köztessége 5-ről 8-ra nő; a $\mathrm{Po}$-é 8 marad – holtverseny (<a class="xref" href="#s106-a-el">10.6</a>). A „$\mathrm{Po}$ egyedül” azt feltételezi, hogy egy él nem írja át az első helyet. A $\mathrm{Ko}$ 9,5-e a $\mathrm{Vi}$–$\mathrm{Po}$, a $\mathrm{Vi}$ 9-e a $\mathrm{Ko}$–$\mathrm{Po}$ hiányából jön.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubban a 34-es tagnak 17, az 1-esnek 16 éle van. A fokszám a köztességnél robusztusabb. Mennyire biztos 5% véletlenül hiányzó élnél, hogy a 34-es egyedül marad az első?`,
          options: [
            R`csak kb. 60%`,
            R`kb. 97% – ennyi a fokszám $\rho$-ja`,
            R`100%: 5% hiány nem írja át a fokszám-rangsor tetejét`,
            R`kb. 5%`
          ],
          answer: 0,
          hint: R`Két élnyi előny helyett egy van. Hány él tűnik el 78-ból 5%-nál, és kit érinthet?`,
          explain: R`5%-nál kb. 4 él hiányzik; ha egy is a 34-esé (és az 1-esé nem), már holtverseny van. A szimuláció szerint csak kb. az esetek 60%-ában marad a 34-es egyedül az első (<a class="xref" href="#s106-b">10.6</a>). A 97% az átlagos rangkorreláció, nem az első hely egyezése – a rangsor egésze robusztus, egy szoros első hely nem. A 100% a „robusztusabb mérőszám” állítást egyéni állításra viszi át. Az 5% a hiány aránya, nem a valószínűség.`
        },
        {
          type: "single", shuffle: true,
          q: R`ERGM él- és háromszögtaggal: $\theta_{\text{él}} = -1$, $\theta_\Delta = 0{,}7$. Mekkora egy él feltételes esélye, ha a két csúcsnak 2 közös szomszédja van?`,
          options: [R`$\approx 0{,}599$`, R`$\approx 0{,}269$`, R`$\approx 0{,}426$`, R`$0{,}4$`],
          answer: 0,
          hint: R`A változási statisztika logitot ad; a valószínűség $e^x/(1 + e^x)$.`,
          explain: R`Logit $= -1 + 0{,}7 \cdot 2 = 0{,}4$, az esély $e^{0{,}4}/(1 + e^{0{,}4}) \approx 0{,}599$ (<a class="xref" href="#s107-b">10.7</a>). A $0{,}269$ a háromszögtag nélküli esély. A $0{,}426$ csak egy közös szomszéddal számol. A $0{,}4$ maga a logit, valószínűségként olvasva – a tipikus „$\theta$ = valószínűség” hiba.`
        },
        {
          type: "multi",
          q: R`4 csúcson melyik megfigyelt gráfra létezik az él- és háromszögtagos ERGM becslése (a várható élszám és háromszögszám = a megfigyelt)? (Több jó válasz is lehet.)`,
          options: [
            "háromszög + egy hozzá lógó él (4 él, 1 háromszög)",
            "háromszög + magányos csúcs (3 él, 1 háromszög)",
            "3 élű út (3 él, 0 háromszög)",
            "4-kör (4 él, 0 háromszög)",
            "a teljes gráf (6 él, 4 háromszög)"
          ],
          answer: [0, 1],
          hint: R`Nézd meg a <a class="xref" href="#s107-b">10.7</a> 64 gráfos táblázatát: adott élszámhoz lehetne-e kevesebb vagy több háromszög?`,
          explain: R`Becslés csak akkor van, ha a megfigyelt gráf nem „szélső” eset. A háromszög + lógó él $(1{,}275;\ -0{,}647)$-et, a háromszög + magányos csúcs $(-0{,}865;\ 1{,}469)$-et ad. A 3 élű útnál 3 élhez kevesebb háromszög nem lehet, a $\theta_\Delta \to -\infty$. Ugyanez a 4-kör: 4 élhez 0 a legkevesebb háromszög. A teljes gráf a legtöbb él és háromszög, a paraméterek $+\infty$ felé szaladnak (Python-illesztéssel ellenőrizve). Az „mindig van becslés” a tipikus hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két hírportál szereplőhálózata: $r = 0{,}45$, QAP $p \lt 0{,}001$. Ha az MRQAP-ba a gyakoriságok szorzatát ($f_i \cdot f_j$) is beveszed, a média-hálózat együtthatója 0,05-re esik, $p = 0{,}6$. Mi a következtetés?`,
          options: [
            R`A hasonlóság szinte teljesen abból jön, hogy ugyanazok a szereplők gyakoriak mindkét portálon; a kapcsolatok szintjén nem mutatható ki hasonlóság.`,
            R`A portálok napirendje bizonyítottan független.`,
            R`Az MRQAP hibás, mert a QAP szignifikáns volt; a QAP-eredményt kell közölni.`,
            R`A gyakoriság oka a hasonlóságnak, tehát az egyik portál átveszi a másik szereplőit.`
          ],
          answer: 0,
          hint: R`Mit szűr ki a gyakoriságok szorzata? Mi marad a média-hálózat együtthatójában?`,
          explain: R`A $f_i \cdot f_j$ az első szintű (gyakorisági) egyezést kontrollálja (<a class="xref" href="#s108-c">10.8</a>). Ha utána a média-hálózat már semmit sem tesz hozzá, a hasonlóság a gyakoriságból jött – a NAS-állításhoz ez kevés. A „bizonyítottan független” a nagy p-t bizonyítéknak olvassa. A két eredmény nem ellentmondás: más kérdésre felelnek. Okságra keresztmetszeti adatból nem következtetünk.`
        }
      ]
    },

}; })();
