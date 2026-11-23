(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 11.1 */
    "gh11-111": {
      title: "Kvíz – 11.1 A feladat",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy irányítatlan egyszerű gráfnak 8 csúcsa és 10 éle van. Hány jelölt pár van?`,
          options: [R`$18$`, R`$46$`, R`$28$`, R`$54$`],
          answer: 0,
          hint: R`Hány pár van összesen, ha a sorrend nem számít? És melyik párokat nem kell jósolni?`,
          explain: R`A párok száma $\binom82 = 28$, ebből 10 már él: $28 - 10 = 18$ jelölt. A $46 = 8 \cdot 7 - 10$ rendezett párokat számol – irányítatlan gráfban az $A$–$B$ és a $B$–$A$ ugyanaz a pár; ez csak irányított gráfban (ki kit követ) lenne helyes. A $28$ a meglévő éleket is jelöltnek veszi, pedig egy meglévő él „jóslása” nem jóslás. Az $54 = 8^2 - 10$ ráadásul a csúcsot önmagával is párosítja. Lásd a <a class="xref" href="#s111-a">11.1 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Zachary karateklubjában 34 tag és 78 él van. Hány jelölt pár van?`,
          options: [R`$483$`, R`$561$`, R`$1044$`, R`$405$`],
          answer: 0,
          hint: R`Előbb az összes pár irányítatlanul, aztán vond le, ami már él – egyszer.`,
          explain: R`$\binom{34}{2} = 561$ pár, ebből 78 él: $561 - 78 = 483$ jelölt. A párok csak 13,9%-a él. Az $561$ a meglévő éleket is jelöltnek veszi. Az $1044 = 34 \cdot 33 - 78$ rendezett párokkal számol. A $405 = 561 - 2 \cdot 78$ az éleket kétszer vonja le – mintha minden él két párt foglalna el (ez a rendezett és a rendezetlen számolás keveréke).`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhetet szerda este vágjuk ketté: a tanítógráf a hétfő–szerdai 6 cikkből áll (6 él), a hét második felének szereplőgráfja 7 élű. Hány jelölt és hány pozitív van?`,
          options: [R`15 jelölt, 4 pozitív`, R`15 jelölt, 7 pozitív`, R`11 jelölt, 4 pozitív`, R`21 jelölt, 7 pozitív`],
          answer: 0,
          hint: R`A jelölt a tanítógráf nem létező éle. A hét második felének 7 éle közül mind új?`,
          explain: R`A tanítógráfnak 6 éle van: $21 - 6 = 15$ jelölt. A hét végének 7 éléből 3 (Ko–Po, Po–La, La–Ön) már a tanítógráfban is élt – ezek visszatérő élek, nem jelöltek, így nem is pozitívak. Pozitív a maradék 4: Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön. A „7 pozitív” a visszatérő éleket is pozitívnak veszi. A „11 jelölt” a teljes hét gráfjából veszi a jelölteket ($21 - 10$) – de akkor a Ko–Sz, amelyet éppen meg kellene találni, már él volna. A „21 jelölt” a meglévő éleket is pontozná.`
        },
        {
          type: "set",
          q: R`Szerda esti vágás (tanítógráf: Ko–Vi, Ko–Po, Vi–Po, Vi–Sz, La–Ön, Po–La). Jelöld ki a pozitív párokat!`,
          items: ["Ko–Sz", "Ko–Kl", "Sz–Kl", "Po–Ön", "Ko–Po", "La–Ön", "Ko–Vi", "Vi–La"],
          answer: ["Ko–Sz", "Ko–Kl", "Sz–Kl", "Po–Ön"],
          hint: R`Egy pár akkor pozitív, ha jelölt (a tanítógráfban nem él), ÉS a vágás után él lesz. Mindkét feltételt nézd meg!`,
          explain: R`Pozitív: Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön – a tanítógráfban nem élek, a hét második felében igen. A Ko–Po és a La–Ön a hét mindkét felében megvan: a tanítógráfban él, tehát nem jelölt – a visszatérő élt pozitívnak venni tipikus hiba. A Ko–Vi a hét elején élt, a végén eltűnt: ez az élmegmaradás kérdése, nem a kapcsolat-előrejelzésé. A Vi–La jelölt, de a hét végén sem kerül egy cikkbe – negatív. Lásd a <a class="xref" href="#s111-b">11.1 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Most kedd este vágunk: a tanítógráf a hétfői és keddi cikkekből (1., 4., 7., 10.) áll, 4 éle Ko–Vi, Vi–Sz, La–Ön, Po–Vi. Szerdától vasárnapig ezek az élek jelennek meg: Ko–Vi, Ko–Po, Vi–Po, Po–La, Sz–Kl, Ko–Sz, Ko–Kl, La–Ön, Po–Ön. Hány jelölt van, hány pozitív, és mekkora a véletlen szint?`,
          options: [
            R`17 jelölt, 6 pozitív, $6/17 \approx 0{,}353$`,
            R`17 jelölt, 9 pozitív, $9/17 \approx 0{,}529$`,
            R`17 jelölt, 4 pozitív, $4/17 \approx 0{,}235$`,
            R`15 jelölt, 4 pozitív, $4/15 \approx 0{,}267$`
          ],
          answer: 0,
          hint: R`A szerdától megjelenő 9 élből húzd ki azokat, amelyek kedd este már a tanítógráfban voltak.`,
          explain: R`Jelölt: $21 - 4 = 17$. A szerdától megjelenő 9 élből 3 (Ko–Vi, Vi–Po, La–Ön) már a tanítógráfban is élt – visszatérő, nem pozitív. Pozitív a maradék 6: Ko–Po, Po–La (mindkettő szerdai), Sz–Kl, Ko–Sz, Ko–Kl, Po–Ön. A véletlen rangsor bármely helyen $6/17 \approx 0{,}353$ eséllyel mutat pozitívra. A „9 pozitív” a visszatérő éleket is beszámolja. A „4 pozitív” a szerda esti vágás pozitívjait hozza át – de a vágás helye a pozitívakat is megváltoztatja: a Ko–Po és a Po–La most még új. A „15 jelölt” a szerda esti tanítógráfé.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a feladat megfogalmazásáról? (Több jó válasz is lehet.)",
          options: [
            R`A Ko–Sz a teljes hét gráfjában él, mégis jelölt a szerda esti vágásnál – éppen ezt kell megtalálni.`,
            R`Ha a 12 cikkből véletlenül választunk 6-ot tanításra, a jóslás könnyebbnek látszik, mint amilyen élesben lesz.`,
            R`A karateklubon, amelynek nincs időbélyege, véletlen élrejtéssel próbálunk ki egy módszert – ez a hiányzó élek megtalálását méri.`,
            R`A Ko–Po pozitív, mert a hét második felében is szerepel egy cikkben.`,
            R`A véletlen rejtés és az időbeli felosztás ugyanazt méri, csak más az adat.`
          ],
          answer: [0, 1, 2],
          hint: R`Mit lát a módszer a vágás pillanatában? És mit jelent, ha a tanítóadatban a vágás utáni cikkek is ott vannak?`,
          explain: R`Igaz az első: a jelölt az, ami a tanítógráfban nem él – a jelölteket nem a teljes gráfból vesszük. Igaz a második: véletlen vágásnál a vasárnapi cikkből tanulnánk a csütörtöki jóslásához – a jövőből látunk vissza. Igaz a harmadik: statikus gráfon a véletlen rejtés a megoldás, de az a meg nem figyelt éleket keresi, nem a jövőt. Hamis a negyedik: a Ko–Po a tanítógráfban is él, tehát nem jelölt – a visszatérő él nem pozitív. Hamis az ötödik: a véletlen rejtés a hiányzó élek feladata, az időbeli felosztás a jövőé; ha van időbélyeg, az időbeli felosztás a becsületes. Lásd a <a class="xref" href="#s111-b">11.1 2. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a fogalmat a jelentésével!",
          pairs: [
            ["jelölt", "a tanítógráfban nem létező pár"],
            ["pozitív", "jelölt, amely a vágás után él lesz"],
            ["negatív", "jelölt, amely a vágás után sem jelenik meg"],
            ["tanítógráf", "a vágás előtti élekből álló gráf"],
            ["véletlen rejtés", "statikus gráfból véletlenül kivett élek"],
            ["rangsor", "a jelöltek sorrendje a pontszám szerint"]
          ],
          hint: R`Indulj a tanítógráfból: minden más fogalom ehhez képest van megadva.`,
          explain: R`A tanítógráf az, amit a módszer lát (időbeli felosztásnál a vágás előtti élek). A jelöltek a nem létező élei; ezek közül pozitív ($E^+$), ami a vágás után él lesz, negatív ($E^-$) a többi. A módszer minden jelölthöz $s(u, v)$ pontszámot ad, az eredmény a rangsor, és a felső $k$ párt jósoljuk élnek. Idő nélküli adatnál a pozitívakat véletlen rejtéssel állítjuk elő.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf csúcsainak átlagos fokszáma 6. Legalább hány csúcsnál lesz a jelöltek száma legalább 100-szorosa az élekének?`,
          options: [R`$607$`, R`$601$`, R`$304$`, R`$1213$`],
          answer: 0,
          hint: R`Az élek száma a kézfogási lemmából: $m = n \cdot 6/2$. A jelöltek száma $\binom n2 - m$. Írd fel az egyenlőtlenséget!`,
          explain: R`$m = 6n/2 = 3n$. Feltétel: $n(n-1)/2 - 3n \ge 300n$, azaz $(n-1)/2 \ge 303$, $n \ge 607$. A $601$ elfelejti levonni az éleket a párokból ($n(n-1)/2 \ge 300n$). A $304$ rendezett párokkal számol ($n(n-1) - 3n \ge 300n$). Az $1213$ a kézfogási lemmában elhagyja a felezést ($m = 6n$). A tanulság: állandó átlagos fokszámnál a jelöltek aránya $n$-nel arányosan nő – nagy gráfban a véletlen tippelés szinte sosem talál.`
        }
      ]
    },

    /* ------------------------------------------------ 11.2 */
    "gh11-112": {
      title: "Kvíz – 11.2 Szomszédsági heurisztikák",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A teljes hét gráfjában $N(\mathrm{Po}) = \{\mathrm{Ko}, \mathrm{Vi}, \mathrm{La}, \text{Ön}\}$, $N(\mathrm{Kl}) = \{\mathrm{Ko}, \mathrm{Sz}\}$. Mennyi a Po–Kl pár Jaccard-pontszáma?`,
          options: [R`$1/5 = 0{,}2$`, R`$1/6 \approx 0{,}167$`, R`$1/2 = 0{,}5$`, R`$1/4 = 0{,}25$`],
          answer: 0,
          hint: R`Számláló: a közös szomszédok. Nevező: a két szomszédság uniója – a közöset csak egyszer számold.`,
          explain: R`Közös: Ko (1). Unió: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{La}, \text{Ön}, \mathrm{Sz}\}$, azaz $4 + 2 - 1 = 5$ elem. $s_{\mathrm J} = 1/5 = 0{,}2$. Az $1/6$ az összeggel oszt ($4 + 2$) az unió helyett – a Ko-t kétszer számolja. Az $1/2$ csak a kisebbik szomszédsággal ($k_{\mathrm{Kl}} = 2$) oszt, az $1/4$ csak a Po-éval. Lásd a <a class="xref" href="#s112-b">11.2 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét $A^2$-ének Vi sora (sorrend Ko, Vi, Po, La, Ön, Sz, Kl): $(2, 3, 1, 1, 1, 1, 2)$. Melyik jelöltnek van a Vi-vel a legtöbb közös szomszédja?`,
          options: [R`Vi–Kl, 2 közös szomszéd`, R`Vi–Vi, 3 közös szomszéd`, R`Vi–Ko, 2 közös szomszéd`, R`Vi–La, 1 közös szomszéd`],
          answer: 0,
          hint: R`Melyik bejegyzések tartoznak egyáltalán jelölthöz? A főátló és a Vi meglévő szomszédai kiesnek.`,
          explain: R`$(A^2)_{uv}$ a két lépéses séták, vagyis a közös szomszédok száma. A Vi szomszédai Ko, Po, Sz – ezek nem jelöltek. A jelöltek: La (1), Ön (1), Kl (2), tehát a Vi–Kl nyer (közös szomszéd: Ko és Sz). A „Vi–Vi, 3” a főátlót olvassa pontszámnak, pedig az a Vi fokszáma (oda-vissza séták). A „Vi–Ko, 2” meglévő élt pontoz – a Ko–Vi már él, nem jelölt. A Vi–La jelölt, de csak 1 közös szomszéddal.`
        },
        {
          type: "single", shuffle: true,
          q: R`Élek: $AC$, $AD$, $BC$, $BD$, $CE$, $CF$. Mennyi az $A$–$B$ pár Adamic–Adar-pontszáma?`,
          options: [R`$\approx 2{,}164$`, R`$\approx 2{,}885$`, R`$0{,}75$`, R`$\approx 4{,}983$`],
          answer: 0,
          hint: R`Keresd meg a közös szomszédokat, és mindegyiknek a saját fokszámát. A logaritmus természetes alapú.`,
          explain: R`Közös szomszéd: $C$ ($k_C = 4$: $A$, $B$, $E$, $F$) és $D$ ($k_D = 2$). $s_{\mathrm{AA}} = 1/\ln 4 + 1/\ln 2 \approx 0{,}721 + 1{,}443 = 2{,}164$. A $2{,}885 = 2/\ln 2$ a pár saját fokszámát használja ($k_A = k_B = 2$) a közös szomszédoké helyett. A $0{,}75 = 1/4 + 1/2$ logaritmus nélkül számol – ez az erőforrás-allokáció (RA). A $4{,}983$ tízes alapú logaritmust használ: a rangsor ettől nem változna, a számérték igen. Lásd a <a class="xref" href="#s112-c">11.2 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az $X$ párnak 1 közös szomszédja van, ennek fokszáma 3. Az $Y$ párnak 3 közös szomszédja van, mindegyik 12 fokú. Melyik pár kerül előre a CN, az AA és az RA szerint?`,
          options: [
            R`CN: $Y$, AA: $Y$, RA: $X$`,
            R`CN: $Y$, AA: $X$, RA: $X$`,
            R`CN: $Y$, AA: $Y$, RA: $Y$`,
            R`CN: $X$, AA: $X$, RA: $X$`
          ],
          answer: 0,
          hint: R`Számold ki mindhármat. Melyik bünteti erősebben a nagy fokszámú közös szomszédot: az $1/\ln k$ vagy az $1/k$?`,
          explain: R`CN: $1$ vs. $3$ → $Y$. AA: $1/\ln 3 \approx 0{,}910$ vs. $3/\ln 12 \approx 1{,}207$ → $Y$. RA: $1/3 \approx 0{,}333$ vs. $3/12 = 0{,}25$ → $X$. A logaritmus lassan nő, ezért az AA enyhébben bünteti a hubot: itt a három közös szomszéd még ellensúlyozza a nagy fokszámot. Az RA élesebb, nála a szűk közös ismerős nyer. A „AA: $X$” opció azt hiszi, a két súlyozás mindig ugyanúgy dönt; a „mindhárom $Y$” elfelejti, hogy az RA-ban a fokszám nincs logaritmus alatt.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hét eleji tanítógráf fokszámai: Ko 2, Vi 3, Po 3, La 2, Ön 1, Sz 1, Kl 0 (élek: Ko–Vi, Ko–Po, Vi–Po, Vi–Sz, La–Ön, Po–La). Melyik jelölt kapja a legnagyobb PA-pontszámot?`,
          options: [R`Vi–La, 6`, R`Vi–Po, 9`, R`Ko–La, 4`, R`Po–Ön, 3`],
          answer: 0,
          hint: R`A PA a két fokszám szorzata. Ellenőrizd, hogy a legnagyobb szorzatú pár valóban jelölt-e!`,
          explain: R`A legnagyobb szorzat a Vi–Po ($3 \cdot 3 = 9$), de az már él – nem jelölt. A jelöltek közül a Vi–La: $3 \cdot 2 = 6$; utána a Ko–La ($2 \cdot 2 = 4$), majd 3-mal holtversenyben a Vi–Ön, a Po–Ön és a Po–Sz. A Vi–La a hét végén mégsem kerül egy cikkbe: a PA az aktivitást méri, nem azt, mennyire illik össze a két szereplő. A Kl minden párja 0-t kap, mert a Kl még nem szerepelt.`
        },
        {
          type: "set",
          q: R`A teljes hét gráfjában (élek: Ko–Vi, Ko–Po, Vi–Po, Vi–Sz, Sz–Kl, Ko–Sz, Ko–Kl, La–Ön, Po–La, Po–Ön) mely jelöltek kapnak CN $= 0$ pontszámot?`,
          items: ["La–Sz", "La–Kl", "Ön–Sz", "Ön–Kl", "Ko–La", "Vi–Kl", "Po–Kl"],
          answer: ["La–Sz", "La–Kl", "Ön–Sz", "Ön–Kl"],
          hint: R`Két csúcsnak akkor van közös szomszédja, ha 2 lépésben elérik egymást. A La és az Ön szomszédai: Po és egymás.`,
          explain: R`A La szomszédai Po és Ön, az Ön-éi Po és La. A Sz szomszédai Vi, Ko, Kl, a Kl-éi Ko, Sz – egyikben sincs Po, ezért a La–Sz, La–Kl, Ön–Sz, Ön–Kl párnak nincs közös szomszédja: a távolságuk 3 (pl. La–Po–Ko–Kl). A Ko–La-nak a Po (CN $= 1$), a Po–Kl-nek a Ko (CN $= 1$), a Vi–Kl-nek a Ko és a Sz (CN $= 2$) a közös szomszédja. A 2-nél távolabbi párokra egyik szomszédsági heurisztika sem mond semmit – az AA és az RA is 0. Ehhez a <a class="xref" href="#s112-c-katz">Katz-index</a> kell.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az AA rangsora nem függ a logaritmus alapjától, csak a számértéke.`,
            R`A hét eleji tanítógráfban a Kl minden jelölt párja PA $= 0$-t kap.`,
            R`$(A^2)_{uv}$ az $u$-ból $v$-be vezető két lépéses séták száma, és ez éppen a közös szomszédok száma.`,
            R`A PA azt méri, mennyire hasonlít egymásra a két csúcs szomszédsága.`,
            R`A Jaccard mindig jobb a CN-nél, mert normált.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi történik a $1/\ln k$ tagokkal, ha másik alapú logaritmust veszel? És mit használ a PA a gráfból?`,
          explain: R`Igaz az első: $\log_b k = \ln k / \ln b$, így minden tag ugyanazzal a $\ln b$ tényezővel szorzódik – a sorrend marad, a számok változnak. Igaz a második: $k_{\mathrm{Kl}} = 0$, ezért minden szorzat 0 – aki még nem szerepelt, annak a PA szerint esélye sincs. Igaz a harmadik: minden $u \to w \to v$ séta egy közös $w$ szomszédon megy át. Hamis a negyedik: a PA a közös szomszédokat egyáltalán nem nézi, két távoli hubot is összeköt – aktivitást mér, nem hasonlóságot. Hamis az ötödik: a normálás a kis fokszámú csúcsokat hozza előre (két 1 fokú csúcs, közös szomszéddal, $J = 1$), és ez gyakran zaj.`
        },
        {
          type: "match",
          q: "Párosítsd a pontszámot a számolási szabályával!",
          pairs: [
            ["közös szomszédok (CN)", "a közös szomszédok száma"],
            ["Jaccard-pontszám", "a közös szomszédok száma osztva a szomszédságok uniójával"],
            ["preferenciális kapcsolódás (PA)", "a két fokszám szorzata"],
            ["Adamic–Adar (AA)", "a közös szomszédok 1/ln k súlyainak összege"],
            ["erőforrás-allokáció (RA)", "a közös szomszédok 1/k súlyainak összege"]
          ],
          hint: R`Kettő nem súlyoz, egy oszt, egy szoroz, kettő a közös szomszéd fokszámával súlyoz – a különbség a logaritmus.`,
          explain: R`$s_{\mathrm{CN}} = |N(u) \cap N(v)|$; $s_{\mathrm J}$ ugyanez osztva $|N(u) \cup N(v)|$-vel; $s_{\mathrm{PA}} = k_u k_v$ (a közös szomszédokat nem nézi); $s_{\mathrm{AA}} = \sum_w 1/\ln k_w$ és $s_{\mathrm{RA}} = \sum_w 1/k_w$, ahol $w$ a közös szomszédokon fut, és $k_w$ a közös szomszéd fokszáma – nem a páré. Az RA élesebben bünteti a hubot, mint az AA.`
        }
      ]
    },

    /* ------------------------------------------------ 11.3 */
    "gh11-113": {
      title: "Kvíz – 11.3 Kiértékelés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A hét eleji tanítógráf AA-rangsora: 1. Po–Ön ✓ (1,443); 2–5. holtversenyben Ko–La ✗, Ko–Sz ✓, Vi–La ✗, Po–Sz ✗ (mind 0,910). Mennyi a precision@3?`,
          options: [R`$0{,}5$`, R`$\approx 0{,}667$`, R`$\approx 0{,}333$`, R`$0{,}4$`],
          answer: 0,
          hint: R`Az 1. hely biztos. A holtversenyes négyesből 2 helyet töltünk – mekkora a várható találat?`,
          explain: R`Az 1. hely (Po–Ön) találat. A 2–5. helyről 2 párt veszünk a 4-ből, és köztük 1 pozitív van: várhatóan $2 \cdot 1/4 = 0{,}5$ találat. Összesen $1{,}5$ találat 3-ból: precision@3 $= 0{,}5$. A $0{,}667$ a holtversenyt „szerencsésen” oldja fel (a Ko–Sz-t veszi előre), a $0{,}333$ szerencsétlenül – a becsületes a várható érték. A $0{,}4$ a precision@5, ott a holtversenyes csoport teljesen befér. Lásd a <a class="xref" href="#s113-a">11.3 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy módszer pontszámai: pozitívak $0{,}8$; $0{,}5$; $0{,}2$, negatívak $0{,}6$; $0{,}5$; $0{,}1$. Mennyi az AUC?`,
          options: [R`$5{,}5/9 \approx 0{,}611$`, R`$6/9 \approx 0{,}667$`, R`$5/9 \approx 0{,}556$`, R`$3{,}5/9 \approx 0{,}389$`],
          answer: 0,
          hint: R`Vess össze minden pozitívat minden negatívval (9 pár). A nagyobb pozitív 1, az egyenlő ½, a kisebb 0.`,
          explain: R`$0{,}8$: mindhárom negatívat legyőzi (3). $0{,}5$: a $0{,}1$-et legyőzi, a $0{,}5$-tel holtversenyben (½), a $0{,}6$-tól kikap → $1{,}5$. $0{,}2$: csak a $0{,}1$-et győzi le (1). Összesen $5{,}5/9 \approx 0{,}611$. A $6/9$ a holtversenyt 1-nek, az $5/9$ 0-nak számolja – a helyes a ½. A $0{,}389 = 1 - 0{,}611$ a fordított irányú összevetés (a negatív nyer). Lásd a <a class="xref" href="#s113-b">11.3 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A tanítógráf 15 jelöltjén a CN pontszámai: pozitívak Ko–Sz 1, Po–Ön 1, Ko–Kl 0, Sz–Kl 0; negatívak: három 1-es, nyolc 0-s. Mennyi a CN AUC-ja?`,
          options: [R`$27/44 \approx 0{,}614$`, R`$16/44 \approx 0{,}364$`, R`$38/44 \approx 0{,}864$`, R`$2/5 = 0{,}4$`],
          answer: 0,
          hint: R`$P \cdot N = 4 \cdot 11$ összevetés. Számold külön a győzelmeket és a holtversenyeket – itt nagyon sok a holtverseny.`,
          explain: R`Egy 1-es pozitív a 8 nullást legyőzi, a 3 egyessel holtversenyben van: $8 + 1{,}5 = 9{,}5$; kettő: 19. Egy 0-s pozitív a 8 nullással holtversenyben: 4; kettő: 8. Összesen $27/44 \approx 0{,}614$ (16 győzelem, 22 holtverseny). A $16/44$ a holtversenyt 0-nak, a $38/44$ 1-nek számolja – egész pontszámoknál ez óriási különbség. A $0{,}4$ a CN precision@5-je, nem az AUC.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy módszer AUC-ja $0{,}72$. Mit jelent ez?`,
          options: [
            R`Egy véletlen pozitív és egy véletlen negatív párt 72%-ban jó sorrendbe tesz.`,
            R`A párok 72%-át osztályozza helyesen élnek vagy nem élnek.`,
            R`A rangsor felső $k$ párjának 72%-a pozitív.`,
            R`A pozitívak 72%-át teszi a küszöb fölé.`
          ],
          answer: 0,
          hint: R`Az AUC-t párösszevetésként definiáltuk. Szerepel-e benne küszöb vagy $k$?`,
          explain: R`$\mathrm{AUC} = \frac{1}{P N}\sum\sum([s_p \gt s_q] + \tfrac12[s_p = s_q])$: annak a valószínűsége, hogy egy véletlen pozitív pontszáma nagyobb egy véletlen negatívénál. Nincs benne küszöb és $k$. A „párok 72%-át helyesen” a pontosság (accuracy) – az AUC-t pontosságnak olvasni tipikus hiba. A „felső $k$ 72%-a” a precision@k. A „pozitívak 72%-a a küszöb fölött” a TPR (recall) egyetlen küszöbnél – a ROC-görbe egy pontja, nem a görbe alatti terület.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz az AUC-ra? (Több jó válasz is lehet.)",
          options: [
            R`Ha minden pontszámot megfordítunk ($s \to -s$), az AUC $1 - \mathrm{AUC}$ lesz.`,
            R`Az AUC a negatívak számától nem függ, csak az eloszlásuktól.`,
            R`Ha minden pár pontszáma egyenlő, az AUC $0{,}5$.`,
            R`A $0{,}5$ alatti AUC azt jelenti, hogy a pontszámban nincs semmi információ.`,
            R`Ritka gráfon elég AUC-t közölni, mert az a precizitást is tükrözi.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondold végig a PA esetét ($0{,}409$). És mi történik a precizitással, ha tízszer annyi negatív van?`,
          explain: R`Igaz az első: ami nyert volt, vesztett lesz, a holtverseny marad – a PA $0{,}409$-ből $0{,}591$ lenne. Igaz a második: az AUC egy valószínűség; több negatív csak pontosabb becslést ad. Igaz a harmadik: minden összevetés ½. Hamis a negyedik: a $0{,}41$ fordítva olvasva $0{,}59$ – a módszer tud valamit, csak ellentétes irányban; ez jel, hogy a feltevésünk („a nagyok kapcsolódnak”) rossz. Hamis az ötödik: éppen mert az AUC nem érzékeny a negatívak számára, a precizitásról nem árul el semmit – ritka gráfon precision@k is kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy nagy gráfban $10\,000$ pozitív és $990\,000$ negatív pár van. Egy küszöbnél a módszer a pozitívak 60%-át és a negatívak 2%-át teszi a küszöb fölé. Mekkora a precizitás?`,
          options: [R`$\approx 0{,}233$`, R`$0{,}6$`, R`$\approx 0{,}303$`, R`$\approx 0{,}767$`],
          answer: 0,
          hint: R`Számold ki darabra a valódi és a hamis pozitívakat. A precizitás a küszöb fölötti párok közül a találatok aránya.`,
          explain: R`TP $= 0{,}6 \cdot 10\,000 = 6000$, FP $= 0{,}02 \cdot 990\,000 = 19\,800$. Precizitás $= 6000/25\,800 \approx 0{,}233$: a jóslatok több mint háromnegyede téves, pedig a ROC-görbe ezen pontja (TPR $0{,}6$, FPR $0{,}02$) jónak látszik. A $0{,}6$ a TPR (recall), nem a precizitás. A $0{,}303 = 6000/19\,800$ a hamis pozitívak számával oszt, nem az összes jóslattal. A $0{,}767$ a hamis jóslatok aránya. Lásd a <a class="xref" href="#s113-c">11.3 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon 8 rejtett tesztéllel a CN AUC-ja véletlen negatívakkal $0{,}68$, 2 távolságú (nehéz) negatívakkal $0{,}47$. Mi a fő ok?`,
          options: [
            R`A véletlen nem élek többsége távoli pár, közös szomszéd nélkül; a 2 távolságú negatívaknak maguknak is van közös szomszédjuk.`,
            R`A nehéz negatívak kevesebben vannak, és az AUC a negatívak számától függ.`,
            R`A nehéz negatívaknál a tesztélek a pontozó gráfban maradtak.`,
            R`A 8 negatív túl kevés: ugyanabból az eloszlásból vett nagyobb mintával is $0{,}68$ jönne ki.`
          ],
          answer: 0,
          hint: R`Mit tud a CN valójában? Milyen párokat tesz könnyen előre, és milyenek között kell itt döntenie?`,
          explain: R`A CN tudása nagyrészt annyi, hogy a közeli párokat a távoliak elé teszi. Véletlen negatívakkal a vizsga könnyű (a távoli párok CN-je 0), nehéz negatívakkal viszont a közeli párok között kell dönteni, és ott a CN már alig tud – sőt, a sűrű mag negatívjainak több közös szomszédja lehet, mint egy tesztélnek. A „számtól függ” tévhit: a negatívak száma itt ugyanannyi, és az AUC egyébként sem a számtól, hanem az eloszlástól függ. A szivárgás itt nem szerepel: a pozitívak mindkét vizsgában ugyanazok, a gráf is. A minta nagysága a becslés pontosságát javítaná, de a nehéz negatívak eloszlása más – ezért mindig közöld, milyen negatívakhoz mértél.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon (10% tesztél, 100 felosztás) ha a tesztélek a pontozó gráfban maradnak, melyik módszer AUC-ja ugrik meg a legjobban?`,
          options: [
            R`a 2D spektrális beágyazásé: $0{,}60 \to 0{,}82$`,
            R`a PA-é: $0{,}71 \to 0{,}85$`,
            R`a CN-é: $0{,}69 \to 0{,}70$`,
            R`az RA-é: $0{,}74 \to 0{,}75$`
          ],
          answer: 0,
          hint: R`Ki látja a teljes gráfot, és ki csak a közvetlen környezetet? A pár saját éle számít-e közös szomszédnak?`,
          explain: R`A spektrális beágyazás $+0{,}22$-t ugrik: a sajátvektorok a teljes gráfból jönnek, így a tesztél két végpontja éppen az él miatt húzódik közel. Egy szivárgó beágyazás a legjobb módszernek látszhat, holott a helyes mérésben a leggyengébb. A PA is sokat nő ($+0{,}14$), mert a tesztél a végpontjai fokszámát közvetlenül növeli. A CN ($+0{,}007$) és az RA ($+0{,}016$) alig változik: a $u$–$v$ él nem közös szomszéd, ezért ezek csak közvetve szivárognak – „a CN-t erősen torzítja a szivárgás” tévhit. Lásd a <a class="xref" href="#s113-d">11.3 4. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a szivárgásról? (Több jó válasz is lehet.)",
          options: [
            R`Ha a node2vec $p$, $q$-ját a tesztélek AUC-ja alapján választod, az is szivárgás.`,
            R`A helyes sorrend: felosztás → beágyazás a tanítógráfon → pontozás.`,
            R`Az Árvízhéten a teljes hét gráfjából pontozva a Ko–Kl PA-ja 0-ról 8-ra nő.`,
            R`A szivárgás mindig növeli az AUC-t.`,
            R`Ha a tesztéleket gondosan kivetted a gráfból, szivárgás már nem lehet.`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg az Árvízhét szivárgó Jaccard-AUC-ját. És honnan jöhet még teszt-információ a tesztéleken kívül?`,
          explain: R`Igaz az első: a hiperparaméter-választáshoz külön validációs élek kellenek. Igaz a második: ha előbb beágyazol a teljes gráfon, a séták és a sajátvektorok már látták a tesztéleket. Igaz a harmadik: a Kl fokszáma 0 helyett 2, a Ko-é 4, így $4 \cdot 2 = 8$. Hamis a negyedik: az Árvízhéten a Jaccard AUC-ja szivárgással csökken ($0{,}659 \to 0{,}648$), mert a bekerült élek az unióval a nevezőt is növelik – a szivárgás iránya sem mindig megjósolható, attól még hiba. Hamis az ötödik: egy teljes időszakból számolt csúcsjellemző („hány cikkben szerepelt”) vagy a véletlen felosztás időbeli adaton ugyanúgy a teszt információját viszi a tanításba.`
        }
      ]
    },
}; })();
