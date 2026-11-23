/* =========================================================
   Gráfelmélet és hálózattudomány 11. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 11.4 */
    "gh11-114": {
      title: "Kvíz – 11.4 Spektrális beágyazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy 100 csúcsú, összefüggő gráfra 5 dimenziós Laplace-sajátleképezést számolsz. Az $L$ mely sajátvektorai lesznek a $Z$ oszlopai?`,
          options: [
            R`a 2.–6. ($\mu_2, \dots, \mu_6$-hoz tartozók)`,
            R`az 1.–5. ($\mu_1, \dots, \mu_5$-höz tartozók)`,
            R`a 96.–100. (a legnagyobb sajátértékűek)`,
            R`a 2.–5. ($\mu_2, \dots, \mu_5$-höz tartozók)`
          ],
          answer: 0,
          hint: R`Melyik sajátvektor tartozik a $\mu_1 = 0$-hoz, és mit ad az a csúcsoknak? A Laplace-nál a kicsi vagy a nagy sajátértékek a „simák”?`,
          explain: R`A $d$ dimenziós beágyazás oszlopai a 2., 3., …, $(d+1)$-edik sajátvektor, itt a 2.–6. Az 1.–5. a konstans első sajátvektort is felhasználja: az minden csúcsnak ugyanazt a koordinátát adja, semmit sem különböztet meg. A 96.–100. a szomszédsági mátrix szokását viszi át a Laplace-ra – ott a legnagyobb sajátértékek a leginkább ugráló jelek, épp a szomszédokat teszik távol. A 2.–5. csak 4 oszlop: az indexet elcsúsztatja (a $\mu_1$ kimarad, de a $d$ attól még 5). Lásd a <a class="xref" href="#s114-a">11.4 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 1–2–3–4 út Laplace-mátrixának sajátértékei $0;\ 0{,}586;\ 2;\ 3{,}414$. Mennyi a 2D spektrális beágyazás energiája, $\sum_{E}\lVert \mathbf z_i - \mathbf z_j\rVert^2$?`,
          options: [R`$2{,}586$`, R`$0{,}586$`, R`$5{,}414$`, R`$6{,}000$`],
          answer: 0,
          hint: R`Az összeg koordinátánként szétesik: minden oszlop a saját sajátértékét adja hozzá. Melyik két oszlop van a 2D beágyazásban?`,
          explain: R`$\operatorname{tr}(Z^\top L Z) = \mu_2 + \mu_3 = 0{,}586 + 2 = 2{,}586$ – ez a lehető legkisebb energia a feltételek mellett. A $0{,}586$ csak az 1D beágyazás ($\mathbf u_2$) energiája. Az $5{,}414 = \mu_3 + \mu_4$ a két legnagyobb sajátértékhez tartozó vektorokat venné – az a legugrálóbb elrendezés. A $6$ az összes sajátérték összege (az $L$ nyoma, a fokszámok összege), ez a konstans vektort is beszámolja, és nem 2D.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az 1–2–3–4 út 2D beágyazása: $1 \to (0{,}653;\ 0{,}5)$, $2 \to (0{,}271;\ -0{,}5)$, $3 \to (-0{,}271;\ -0{,}5)$, $4 \to (-0{,}653;\ 0{,}5)$. A pontszám $s(u, v) = -\lVert \mathbf z_u - \mathbf z_v\rVert$. Melyik jelölt kerül a rangsor élére?`,
          options: [
            R`az 1–4 pár ($\approx 1{,}31$)`,
            R`az 1–3 és a 2–4 pár holtversenyben ($\approx 1{,}36$)`,
            R`a 2–3 pár ($\approx 0{,}54$)`,
            R`az 1–2 pár ($\approx 1{,}07$)`
          ],
          answer: 0,
          hint: R`Először írd fel a jelölteket: melyik pár nem él? Aztán számold ki a távolságukat mindkét koordinátán.`,
          explain: R`A jelöltek a nem élek: 1–3, 1–4, 2–4. Az 1–4: $\sqrt{1{,}307^2 + 0^2} \approx 1{,}31$; az 1–3 és a 2–4: $\sqrt{0{,}924^2 + 1^2} \approx 1{,}36$. A legközelebbi tehát az 1–4 – a 3. sajátvektor „visszahajtotta” a két véget, pedig a CN szerint épp az 1–3 és a 2–4 az esélyes (1 közös szomszéd), az 1–4-nek nincs közös szomszédja. A 2–3 és az 1–2 él, nem jelölt – a meglévő éleket nem rangsoroljuk. Lásd a <a class="xref" href="#s114-a-ut">kiinduló példát</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét 2D spektrális beágyazásában melyik jelölt pár van a legközelebb egymáshoz?`,
          options: [
            R`$\mathrm{Po}\text{–}\mathrm{Sz}$, $\approx 0{,}574$`,
            R`$\mathrm{Vi}\text{–}\mathrm{Kl}$, $\approx 1{,}338$`,
            R`$\mathrm{Ko}\text{–}\mathrm{La}$, $\approx 0{,}821$`,
            R`$\mathrm{La}\text{–}\text{Ön}$, $0$`
          ],
          answer: 0,
          hint: R`A La és az Ön tényleg egy pontba esik – de jelölt-e a pár? És a Vi–Kl a CN szerint esélyes, de a 2D képen hol van?`,
          explain: R`A 11 jelölt közül a $\mathrm{Po}\text{–}\mathrm{Sz}$ a legközelebbi ($0{,}574$), utána holtversenyben a $\mathrm{Ko}\text{–}\mathrm{La}$ és a $\mathrm{Ko}\text{–}\text{Ön}$ ($0{,}821$). A $\mathrm{La}\text{–}\text{Ön}$ távolsága valóban 0, de köztük él van – nem jelölt. A $\mathrm{Vi}\text{–}\mathrm{Kl}$ a CN és a Jaccard szerint az egyik legesélyesebb pár (2 közös szomszéd, $J = 2/3$), a 2D képen viszont a legtávolabbi ($1{,}338$): a 3. sajátvektor a Kl-t külön irányba húzza. Lásd a <a class="xref" href="#s114-b-arviz">11.4 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét spektrális beágyazásában a La és az Ön koordinátái pontosan egyeznek. Miért?`,
          options: [
            R`Mert szerkezetileg ekvivalensek: felcserélve őket a gráf nem változik.`,
            R`Mert ugyanannyi a fokszámuk (2–2).`,
            R`Mert él köti össze őket, és a beágyazás a szomszédokat egy pontba húzza.`,
            R`Numerikus hiba: két csúcs a pontos megoldásban sosem esik egybe.`
          ],
          answer: 0,
          hint: R`Nézd meg a szomszédságukat: $N(\mathrm{La})$ és $N(\text{Ön})$. Van-e más csúcspár, amelynek ugyanannyi a fokszáma vagy él köti össze, mégsem esik egybe?`,
          explain: R`$N(\mathrm{La}) = \{\mathrm{Po}, \text{Ön}\}$, $N(\text{Ön}) = \{\mathrm{Po}, \mathrm{La}\}$: egymáson kívül mindkettő csak a Po-val szomszédos. A cseréjük a gráfot nem változtatja meg, ezért minden (egyszeres sajátértékű) sajátvektorban egyenlő az értékük. Az azonos fokszám kevés: a Kl fokszáma is 2, mégis máshol áll. Az él sem elég: a Ko és a Vi is szomszéd, a távolságuk mégis kb. 0,49. Az egybeesés nem hiba – a gráf egyszerűen nem tudja megkülönböztetni őket.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: A–B, B–C, D–E. Mit mondhatsz a Laplace-mátrix spektrumáról és a 2D spektrális beágyazásról?`,
          options: [
            R`A 0 kétszeres sajátérték; a „második sajátvektor” nem egyértelmű, a két komponens egymáshoz viszonyított helyzete önkényes.`,
            R`A 0 egyszeres sajátérték; a 2. sajátvektor szétválasztja a két komponenst, ez a beágyazás legjobb része.`,
            R`Nincs 0 sajátérték, mert minden csúcsnak van éle.`,
            R`A 0 kétszeres sajátérték, de a sajátvektorokat a Python mindig ugyanúgy választja, így a beágyazás egyértelmű.`
          ],
          answer: 0,
          hint: R`Hány komponense van a gráfnak, és ez mit mond a 0 sajátérték multiplicitásáról?`,
          explain: R`Két komponens → két 0 sajátérték (a sajátértékek $0, 0, 1, 2, 3$). A két 0-hoz tartozó síkból bármely irány „második sajátvektor” lehet, így a komponensek egymáshoz viszonyított helye a bázisválasztás véletlene – komponensenként értelmes a beágyazás, köztük nem. A „0 egyszeres” csak összefüggő gráfra igaz. A „nincs 0 sajátérték” hibás: a konstans vektor (és komponensenként a konstans) mindig 0-hoz tartozik. Az utolsó opció a hét eleji tanítógráf csapdája: ott egy futás 0,70-es AUC-t adott, de egy másik, ugyanolyan jó bázis mást adna. Lásd a <a class="xref" href="#s114-c">11.4 3. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a spektrális beágyazásra? (Több jó válasz is lehet.)",
          options: [
            R`A 3 levelű csillag sajátértékei $0, 1, 1, 4$, ezért a 2D kép tetszőlegesen elforgatható; a távolságok ettől nem változnak.`,
            R`A beágyazás transzduktív: egy új szereplőnek csak a teljes felbontás újraszámolásával lesz koordinátája.`,
            R`Ha $\mathbf u$ sajátvektor, $-\mathbf u$ is: a kép tükrözhető, a távolságok ugyanazok.`,
            R`Egy hét eleji és egy hét végi beágyazás koordinátái közvetlenül összevethetők, mert ugyanazokról a szereplőkről szólnak.`,
            R`Az $x$ tengely a teljes héten a kormányzati és a helyi szereplőket választja el, tehát a második sajátvektor mindig egy értelmezhető ellentétet mér.`
          ],
          answer: [0, 1, 2],
          hint: R`Mi határozza meg egyértelműen a beágyazást: a tengelyek, vagy csak a pontok egymáshoz viszonyított helyzete?`,
          explain: R`Igaz az első: kétszeres sajátértéknél csak a kifeszített sík egyértelmű, a tengelyek nem. Igaz a második: a koordináták a teljes $L$ sajátvektorai, egy új sor és oszlop mindent megváltoztathat. Igaz a harmadik: az előjel önkényes. Hamis a negyedik: két futás tengelyei között előjel, sorrend és forgatás is eltérhet – csak illesztés után vagy a távolságokon keresztül vethetők össze. Hamis az ötödik: a tengelyek csak a gráf szerkezetéből jönnek; itt véletlenül egybeesnek egy értelmezhető ellentéttel, máskor nem.`
        },
        {
          type: "match",
          q: "Párosítsd a Laplace-sajátleképezés elemét a szerepével!",
          pairs: [
            [R`a $\mu_1 = 0$ sajátvektora`, "konstans, semmit nem különböztet meg"],
            [R`a Fiedler-vektor ($\mu_2$)`, "a legsimább nem konstans jel, az első koordináta"],
            [R`a legnagyobb sajátértékű vektorok`, "a leginkább ugráló jelek, szomszédokat széthúznak"],
            [R`az $\mathbf 1$-re merőlegesség`, "megakadályozza, hogy minden csúcs egy pontba essen"],
            [R`az oszlopok egymásra merőlegessége`, "nélküle minden oszlop a Fiedler-vektor lenne"]
          ],
          hint: R`Gondold végig a célfüggvényt: mit csinálna a minimum a feltételek nélkül?`,
          explain: R`A cél $\min \operatorname{tr}(Z^\top L Z)$. A konstans vektor 0 energiájú, de minden csúcsot egy pontba tesz – ezért kell az $\mathbf 1$-re merőlegesség, és ezért indul a beágyazás a 2. sajátvektortól. Az első oszlop legjobb választása a Fiedler-vektor; ha az oszlopoknak nem kellene merőlegesnek lenniük, mindegyik az lenne, és $d$ dimenzió helyett egyet kapnánk. A legnagyobb sajátértékűek a legnagyobb $\mathbf x^\top L \mathbf x$-et adják: a szomszédok között ugrálnak – a Laplace-nál a kicsik kellenek, nem a nagyok (a szomszédsági mátrixnál fordítva).`
        }
      ]
    },

    /* ------------------------------------------------ 11.5 */
    "gh11-115": {
      title: "Kvíz – 11.5 Véletlen sétás beágyazások",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány (középső, környező) tanítópárt ad egy 6 hosszú séta $\pm 2$-es ablakkal?`,
          options: [R`$18$`, R`$9$`, R`$24$`, R`$10$`],
          answer: 0,
          hint: R`Hány $j = 1$, illetve $j = 2$ távolságú szópár van egy 6 szavas mondatban? És hányszor számít egy pár?`,
          explain: R`$2\sum_{j=1}^{2}(6 - j) = 2(5 + 4) = 18$. A 9 csak az egyik irányt számolja – a skip-gram minden szópárt mindkét irányban felhasznál (mindkét csúcs egyszer középső). A $24 = 2 \cdot 2 \cdot 6$ azt feltételezi, hogy minden szónak két oldalról teljes ablaka van, pedig a séta két végén az ablak csonka. A $10 = 2 \cdot 5$ a $\pm 1$-es ablak párszáma.`
        },
        {
          type: "set",
          q: R`Az öt barát gráfja: A–B, A–C, B–C, B–D, D–E. Az „A B D E D B C” sétából $\pm 2$-es ablakkal gyűjtünk párokat. Melyik <b>nem él</b> pár kerül egy ablakba?`,
          items: ["A–D", "B–E", "C–D", "A–E", "C–E", "A–C"],
          answer: ["A–D", "B–E", "C–D"],
          hint: R`Írd fel a séta helyeit (1–7), és nézd meg az 1 és 2 hely távolságú párokat. Az A–C él-e?`,
          explain: R`A $\pm 2$-es párok: A–B, A–D, B–D, B–E, D–E, D–D, C–D, B–C. Nem él közülük az A–D, a B–E és a C–D – mind 2 lépésre van a gráfban. Az A–E és a C–E 3 lépésre van, ehhez $\pm 3$-as ablak kellene (és a sétában sem kerülnek 2-n belülre). Az A–C él, és ebben a sétában egy ablakba sem kerül (az A az 1., a C a 7. helyen áll). Éppen az ablak hozza közel a nem szomszédos, de közeli párokat – ebből lesz kapcsolat-előrejelzés. Lásd a <a class="xref" href="#s115-a-seta">11.5 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az „A B D E D B C” séta $\pm 1$-es tábláján $|C| = 12$, a csúcsonkénti párszám A 1, B 4, C 1, D 4, E 2, a D–E pár kétszer fordul elő. Mennyi a $\mathrm{PMI}(\mathrm D, \mathrm E)$?`,
          options: [R`$\approx 1{,}099$`, R`$3{,}000$`, R`$2{,}000$`, R`$\approx -1{,}386$`],
          answer: 0,
          hint: R`$\mathrm{PMI}(u, v) = \ln\dfrac{C_{uv}\,|C|}{C_u\,C_v}$. Ne felejtsd el a $|C|$-t és a logaritmust.`,
          explain: R`$\ln\dfrac{2 \cdot 12}{4 \cdot 2} = \ln 3 \approx 1{,}099$ – ugyanannyi, mint az A–B-é. A 3 a hányados logaritmus nélkül: a megfigyelt és a várható gyakoriság aránya, nem a PMI. A 2 a nyers gyakoriság $C_{\mathrm{DE}}$ – ebben a hubok mindenkivel nagy értéket kapnak, ezt vonja le a PMI. A $-1{,}386 = \ln(2/8)$ a $|C|$-vel való szorzást hagyja ki, így nem valószínűségek hányadosát számolja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanebben a táblában a B–D pár kétszer annyiszor fordul elő, mint az A–B, mégis $\mathrm{PMI}(\mathrm B, \mathrm D) \approx 0{,}405 \lt \mathrm{PMI}(\mathrm A, \mathrm B) \approx 1{,}099$. Mi az oka?`,
          options: [
            R`A B és a D „mindenhol ott van” a sétában; az A csak a B mellett fordul elő, ez erősebb jel.`,
            R`A B–D nem él, ezért a PMI büntetést ad rá.`,
            R`A PMI a ritkább párokat mindig előrébb teszi, függetlenül a csúcsok gyakoriságától.`,
            R`Elszámolás: a gyakoribb párnak nagyobb PMI jár.`
          ],
          answer: 0,
          hint: R`Mennyi lenne a két pár várható gyakorisága, ha a párok függetlenül állnának össze?`,
          explain: R`Függetlenség mellett az A–B várható gyakorisága $12 \cdot \tfrac1{12} \cdot \tfrac4{12} = \tfrac13$ (megfigyelt 1, háromszoros), a B–D-é $\tfrac43$ (megfigyelt 2, csak másfélszeres). A gyakori csúcsok sok párban szerepelnek, ezért egy-egy párjuk kevesebbet árul el – ugyanaz az ötlet, mint az Adamic–Adar-ban. A „nem él” magyarázat sem áll: a B–D az öt barát gráfjában él. A PMI nem a ritkaságot jutalmazza, hanem a várthoz mért többletet. A számolás helyes: ez a PMI lényege.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy párra $\mathrm{PMI}(u, v) = \ln 10$, és pozitív páronként $b = 5$ negatívat veszünk. Levy és Goldberg szerint nagyjából mekkora skaláris szorzatot, $\mathbf z_u \cdot \mathbf z'_v$-t tanul a skip-gram?`,
          options: [R`$\approx 0{,}693$`, R`$\approx 2{,}303$`, R`$\approx 3{,}912$`, R`$2{,}000$`],
          answer: 0,
          hint: R`Az optimum az eltolt PMI: mit kell levonni, és logaritmus alatt vagy fölött?`,
          explain: R`$\mathbf z_u \cdot \mathbf z'_v \approx \mathrm{PMI} - \ln b = \ln 10 - \ln 5 = \ln 2 \approx 0{,}693$. A $2{,}303 = \ln 10$ a negatívak eltolását felejti el. A $3{,}912 = \ln 50$ hozzáadja a $\ln b$-t levonás helyett. A $2 = 10/5$ logaritmus nélkül oszt. Lásd a <a class="xref" href="#s115-b">11.5 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az öt barát gráfján (A–B, A–C, B–C, B–D, D–E) a node2vec-séta A → B lépett. Mennyi a D-re lépés valószínűsége, ha $p = 1$, $q = 0{,}5$?`,
          options: [R`$0{,}5$`, R`$0{,}25$`, R`$\approx 0{,}333$`, R`$0{,}2$`],
          answer: 0,
          hint: R`A B szomszédai: A, C, D. Melyik a visszalépés, melyik van az A-tól 1, melyik 2 lépésre? Melyik súly $1/p$, melyik $1/q$?`,
          explain: R`Súlyok: A (vissza) $1/p = 1$, C (az A szomszédja) $1$, D (az A-tól 2 lépés) $1/q = 2$. Összeg 4, a D-re $2/4 = 0{,}5$. A $0{,}25$ a $p$ és a $q$ felcserélése ($p = 0{,}5$, $q = 1$: A 2, C 1, D 1). Az $1/3$ a DeepWalk ($p = q = 1$). A $0{,}2$ a $q$-t magát használja súlynak $1/q$ helyett (D: $0{,}5$, összeg $2{,}5$) – ez épp a $q = 2$ esete, a fordítottja.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét gráfján a séta $\mathrm{Ko} \to \mathrm{Po}$ lépett. A Po szomszédai: Ko, Vi, La, Ön. Mekkora eséllyel lép a séta a helyi szereplők egyikéhez (La vagy Ön), ha $p = 1$, $q = 2$?`,
          options: [R`$1/3$`, R`$2/3$`, R`$1/2$`, R`$1/6$`],
          answer: 0,
          hint: R`A La és az Ön a Ko-tól hány lépésre van? A Vi szomszédja-e a Ko-nak?`,
          explain: R`Ko: vissza, $1/p = 1$. Vi: a Ko szomszédja, $1$. La, Ön: a Ko-tól 2 lépés, $1/q = 0{,}5$–$0{,}5$. Összeg 3: a La vagy az Ön együtt $1/3$. Nagy $q$-val a séta a Ko környékén marad (BFS-szerű). A $2/3$ a $q = 0{,}5$ esete (ott a séta a helyi szereplők felé fordul). Az $1/2$ a DeepWalk (4 szomszéd, egyenletesen). Az $1/6$ csak a La – a kérdés a kettőt együtt kérdezi. Lásd a <a class="xref" href="#s115-c-lepes">11.5 3. lépését</a>.`
        },
        {
          type: "match",
          q: "Párosítsd a node2vec beállítását a séta viselkedésével!",
          pairs: [
            [R`$p = q = 1$`, "egyenletes séta, mint a DeepWalk"],
            [R`kis $q$ ($q \lt 1$)`, "DFS-szerű, messzire jutó séta"],
            [R`nagy $q$ ($q \gt 1$)`, "BFS-szerű, a szűk környezetben marad"],
            [R`kis $p$ ($p \lt 1$)`, "gyakran visszalép az előző csúcsra"],
            [R`nagy $p$ és kis $q$`, "a leggyorsabban jut messzire"]
          ],
          hint: R`A $p$ a visszalépés, a $q$ a távolodás súlyát osztja. Kis osztó → nagy súly.`,
          explain: R`A visszalépés súlya $1/p$, a távolodásé $1/q$. Kis $q$ → nagy távolodási súly → DFS-szerű séta (fordítva könnyű összekeverni: a kis $q$ nem BFS!). Nagy $q$ → a séta az előző csúcs környékén marad: BFS-szerű. Kis $p$ → nagy visszalépési súly. Ha a $p$ nagy (ritkán lép vissza) és a $q$ kicsi (szívesen távolodik), a séta a leggyorsabban jut messzire. $p = q = 1$-nél minden súly 1: ez a DeepWalk.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a DeepWalkra és a node2vecre? (Több jó válasz is lehet.)",
          options: [
            R`A DeepWalk lényegében a $P, P^2, \dots, P^w$ átmenetmátrixok egy logaritmusát faktorizálja (NetMF).`,
            R`Gondos összevetések szerint a jól hangolt CN, AA, RA sok gráfon versenyképes a tanult beágyazásokkal.`,
            R`A node2vec egy új szereplőnek újratanítás nélkül nem ad vektort, és a cikkek szövegét sem használja.`,
            R`BFS-szerű sétával a távoli, hasonló szerepű csúcsok (pl. két híd) megbízhatóan közel kerülnek – ezt a későbbi munkák megerősítették.`,
            R`A nyers $C_{uv}$ beágyazása jobb a PMI-nél, mert több információt őriz meg.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a „Konszenzus és vita” dobozra, és arra, mit tanul a beágyazás a hubokról, ha a gyakoriságot nem vonod le.`,
          explain: R`Igaz az első: Qiu és társai (2018) szerint a DeepWalk egy jól választott hasonlósági mátrix alacsony rangú közelítése. Igaz a második: Mara–Lijffijt–De Bie (2020) és a karateklub táblázata (RA 0,74, node2vec 0,75) is ezt mutatja. Igaz a harmadik: csúcsonként egy szabad vektor van (transzduktív); ezt oldják meg a GNN-ek. Hamis a negyedik: ez a vitatott állítás – a struc2vec-es munka megmutatta, hogy a séta a gráfban halad, így a távoli csúcsok ritkán kerülnek egy ablakba. Hamis az ötödik: a nyers gyakoriságban a hubok mindenkivel nagy értéket kapnak, a beágyazás a fokszámot tanulná meg.`
        }
      ]
    },

    /* ------------------------------------------------ 11.6 */
    "gh11-116": {
      title: "Kvíz – 11.6 Alkalmazás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A hét eleji tanítógráf 4 pozitívjából kettőt (Ko–Kl, Sz–Kl) egyik gráfos módszer sem találhat meg. Miért?`,
          options: [
            R`Mert a Kl a tanítógráfban elszigetelt: minden pontszáma 0, és minden beágyazásban önkényes helyen áll.`,
            R`Mert a Kl-nek túl nagy a fokszáma, és a hub minden pontszámot torzít.`,
            R`Mert a két pár 2-nél messzebb van, ezt csak a Katz-index látja.`,
            R`Mert a véletlen rejtés kivette őket a tanítógráfból.`
          ],
          answer: 0,
          hint: R`Hány éle van a Kl-nek hétfőtől szerdáig?`,
          explain: R`A Kl szerdáig egyetlen cikkben sem szerepelt, a fokszáma 0. A szomszédsági heurisztikák 0-t adnak (nincs közös szomszéd), a PA is 0-t, a beágyazás pedig vagy nem ad koordinátát, vagy önkényeset. A „hub” fordítva igaz: a Kl a legkevésbé aktív. A Katz-index sem segít: elszigetelt csúcshoz semmilyen hosszú út nem vezet. Itt időbeli felosztás van, nem véletlen rejtés – a Kl-es élek egy új eseményből (E5) jönnek, amelyet a gráf múltja nem tartalmaz. Lásd a <a class="xref" href="#s116-a-valasz">11.6 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ha a két Kl-es pozitívat és az összes Kl-es párt kivesszük a kiértékelésből, 9 jelölt marad: 2 pozitív (Ko–Sz, Po–Ön, mindkettő CN = 1) és 7 negatív (három 1-es, négy 0-s CN-nel). Mennyi a CN AUC-ja?`,
          options: [R`$11/14 \approx 0{,}786$`, R`$8/14 \approx 0{,}571$`, R`$14/14 = 1$`, R`$27/44 \approx 0{,}614$`],
          answer: 0,
          hint: R`$2 \cdot 7 = 14$ összevetés. Egy 1-es pozitív hány 0-s negatívat győz le, és hány 1-essel áll holtversenyben?`,
          explain: R`Pozitívonként 4 nyert (a 0-sak ellen) és 3 holtverseny ($3 \cdot \tfrac12$): $5{,}5$; kettő $11$, $11/14 \approx 0{,}786$. A $0{,}571$ a holtversenyt 0-nak, az 1 a holtversenyt 1-nek számolja. A $0{,}614$ az eredeti, Kl-lel együtt mért AUC. Az elszigetelt csúcsot kihagyva a módszer sokkal jobbnak látszik – ezért mindig közöld, mit hagytál ki.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hét eleji kiértékelésben 4 pozitív és 11 negatív van. Legfeljebb mennyit mozdíthat az AUC-n egyetlen pozitív helyének megváltozása?`,
          options: [R`$0{,}25$`, R`$\approx 0{,}023$`, R`$\approx 0{,}091$`, R`$0{,}5$`],
          answer: 0,
          hint: R`Hány összevetésben szerepel egy pozitív, és hány összevetés van összesen?`,
          explain: R`Egy pozitív 11 összevetésben szerepel a 44-ből; ha a rangsor végéről az élére kerül, mind a 11 vesztésből nyerés lesz: $11/44 = 0{,}25$. Az $1/44 \approx 0{,}023$ egyetlen összevetést számol. Az $1/11 \approx 0{,}091$ a pozitív saját 11 összevetésén belüli egyetlen változás – nem a 44-hez mért teljes elmozdulás. A $0{,}5$ a pozitívak felét (kettőt) mozgatná. Ezért a 0,61 és a 0,66 közötti különbség itt semmit sem bizonyít.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklub táblázatában (10% tesztél, 100 felosztás) melyik módszer nyeri a legtöbbet a szivárgással?`,
          options: [
            R`spektrális 8D: $0{,}537 \to 0{,}859$ ($+0{,}322$)`,
            R`spektrális 2D: $0{,}598 \to 0{,}820$ ($+0{,}222$)`,
            R`DeepWalk (PPMI, 8D): $0{,}705 \to 0{,}888$ ($+0{,}183$)`,
            R`pref. kapcsolódás: $0{,}711 \to 0{,}852$ ($+0{,}141$)`
          ],
          answer: 0,
          hint: R`Nem a legnagyobb szivárgó AUC a kérdés, hanem a legnagyobb különbség.`,
          explain: R`A spektrális 8D nyer a legtöbbet: $+0{,}322$ – a tiszta méréssel a leggyengébb, szivárgással a második legjobb lenne. A PPMI-nek a legnagyobb a szivárgó AUC-ja ($0{,}888$), de a növekedése csak $0{,}183$ – ez a tipikus félreolvasás. A spektrális 2D ($+0{,}222$) és a PA ($+0{,}141$) is sokat nyer, a CN-alapúak alig (CN $+0{,}007$), a Jaccard pedig veszít. Lásd a <a class="xref" href="#s116-b-karate">11.6 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon a node2vec AUC-ja $0{,}748 \pm 0{,}071$, az RA-é $0{,}738 \pm 0{,}111$. Mit mondhatsz?`,
          options: [
            R`A különbség (0,01) jóval kisebb a szórásnál; egy becsületes összevetés ugyanazokon a felosztásokon a páros különbséget nézné.`,
            R`A node2vec szignifikánsan jobb, mert az átlaga nagyobb.`,
            R`Az RA jobb, mert a szórása nagyobb, így néha sokkal jobb eredményt ad.`,
            R`Egyetlen, jól megválasztott felosztáson eldönthető, melyik a jobb.`
          ],
          answer: 0,
          hint: R`Mekkora a különbség a szóráshoz képest? És mit mutat a szórás egy-egy felosztásról?`,
          explain: R`$0{,}748 - 0{,}738 = 0{,}01$, a szórás $0{,}07$–$0{,}11$: egy-egy felosztáson bármelyik lehet az első. Az átlag nagyobb volta egymagában nem szignifikancia. A nagyobb szórás nem előny, hanem bizonytalanság. Egyetlen felosztásból módszert választani a tipikus hiba – sok felosztás átlaga és szórása (vagy a páros különbség) kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Miért <b>csökken</b> a Jaccard AUC-ja a karateklubon a szivárgással ($0{,}610 \to 0{,}565$)?`,
          options: [
            R`A tesztél végpontjainak szomszédságába bekerül a másik végpont: az unió nő, a közös szomszédok száma nem.`,
            R`Mert a szivárgás minden módszert egyformán ront.`,
            R`Mert a Jaccard a fokszámszorzatot nézi, és az a szivárgással csökken.`,
            R`Véletlen ingadozás: a szivárgás a Jaccardra nem hat.`
          ],
          answer: 0,
          hint: R`Ha a $u$–$v$ tesztél a pontozó gráfban van, mi kerül az $N(u)$-ba? A számlálót vagy a nevezőt növeli ez?`,
          explain: R`A szivárgó gráfban $v \in N(u)$ és $u \in N(v)$, ezek az unióba kerülnek, de egyik sem közös szomszéd. A pozitívak Jaccard-pontszáma így csökkenhet. A szivárgás nem egyformán hat: a PA-t és a beágyazásokat erősen emeli, a CN-t alig, a Jaccardot rontja – ezért nem lehet „utólag levonni”. A Jaccard a közös szomszédok arányát nézi, nem a fokszámszorzatot (az a PA).`
        },
        {
          type: "multi",
          q: "Melyik lépés tartozik egy becsületes kapcsolat-előrejelzés ellenőrző listájához? (Több jó válasz is lehet.)",
          options: [
            R`Minden fokszámot, sétát és beágyazást a felosztás után, csak a tanítógráfon számolsz.`,
            R`Időbélyeges adatnál időbeli vágást használsz, nem véletlen rejtést.`,
            R`A hiperparamétereket (pl. a dimenziót) validációs éleken hangolod.`,
            R`Ha a szivárgó és a tiszta AUC eltér, a nagyobbat közlöd, mert az mutatja a módszer lehetőségeit.`,
            R`A beágyazás dimenzióját addig növeled, amíg a teszt AUC nő.`
          ],
          answer: [0, 1, 2],
          hint: R`Melyik opció használja a teszt információját a módszer kialakítására vagy a jelentésre?`,
          explain: R`Az első három a lista része: pontozó gráf = tanítógráf, időbeli adatnál időbeli felosztás, hangolás validációs éleken. A szivárgó számot közölni hiba: szebb, de mást rangsorol (a spektrális 8D a leggyengébből a második legjobb lenne). A dimenziót a teszten hangolni szintén szivárgás – és a „több dimenzió jobb” sem igaz: a spektrálisnál a 8D rosszabb a 2D-nél. Lásd a <a class="xref" href="#s116-c-lista">11.6 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy statikus gráfból véletlenül elrejtett élekkel mérsz. Mit mond ez a mérés?`,
          options: [
            R`Azt, mennyire rekonstruálja a módszer a meg nem figyelt kapcsolatokat – időbeli kérdésre („mi jön a jövő héten?”) nem ad választ.`,
            R`Azt, hogy a módszer a jövőbeli éleket milyen jól jósolja, mert a rejtett él is „még nem látott” él.`,
            R`Azt, hogy a Kormány és a Szakértő milyen eséllyel fog ténylegesen találkozni.`,
            R`Semmit: véletlen rejtéssel mért AUC sosem értelmes.`
          ],
          answer: 0,
          hint: R`A „hiányzó él” és a „jövőbeli él” ugyanaz a feladat?`,
          explain: R`A véletlen rejtés a hiányzó élek feladatát méri: mennyire tudja a módszer kitölteni a gráf meg nem figyelt részét (pl. egy lap ki nem írt együttemlítéseit). A jövőbeli élekhez időbeli felosztás kell – a jövő a múlttól eltérhet (új téma, új szereplő). Az együttemlítés jóslása pedig a tudósítás mintázatáról szól, nem az eseményekről. A véletlen rejtés statikus gráfon (pl. a karateklubon) helyes eljárás, csak más kérdésre felel.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh11-final": {
      title: "Fejezetzáró teszt – 11. Csúcsbeágyazások és kapcsolat-előrejelzés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy hírkorpuszban 1000 szereplő van, mindegyiknek átlagosan 10 partnere (irányítatlan gráf). Hány jelölt pár van?`,
          options: [R`$494\,500$`, R`$499\,500$`, R`$989\,000$`, R`$999\,000$`],
          answer: 0,
          hint: R`Hány él van, ha minden élt két végpont „lát”? Aztán: a jelöltek a nem élek, és irányítatlanul a sorrend nem számít.`,
          explain: R`Élek: $1000 \cdot 10/2 = 5000$. Párok: $\binom{1000}{2} = 499\,500$, jelöltek: $499\,500 - 5000 = 494\,500$. A $499\,500$ a meglévő éleket is jelöltnek veszi. A $989\,000 = 1000 \cdot 999 - 10\,000$ rendezett párokkal számol, a $999\,000 = n(n-1)$ ráadásul az éleket sem vonja le. Lásd a <a class="xref" href="#s111-a">11.1 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A hét eleji tanítógráf (H–Sze) után a hét végén ezek az élek jelennek meg: Ko–Po, Po–La, La–Ön, Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön. Hány pozitív pár van?`,
          options: [R`$4$`, R`$7$`, R`$3$`, R`$15$`],
          answer: 0,
          hint: R`Pozitív az a <i>jelölt</i>, amely később él lesz. Melyik hét végi él volt már a tanítógráfban is?`,
          explain: R`A Ko–Po, a Po–La és a La–Ön már a tanítógráfban is él – nem jelölt, így nem lehet pozitív (visszatérő él). Marad 4: Ko–Sz, Ko–Kl, Sz–Kl, Po–Ön. A 7 a visszatérő éleket is pozitívnak veszi. A 3 éppen a visszatérő élek száma. A 15 a jelöltek száma, nem a pozitívaké. Lásd a <a class="xref" href="#s111-b">11.1 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf élei: A–B, A–C, B–D, C–D, C–E, C–F. Mennyi az A–D pár Adamic–Adar-pontszáma?`,
          options: [R`$\approx 2{,}164$`, R`$0{,}750$`, R`$\approx 2{,}885$`, R`$\approx 1{,}443$`],
          answer: 0,
          hint: R`Kik a közös szomszédok, és mekkora az ő fokszámuk? Az AA a közös szomszéd fokszámának logaritmusával oszt.`,
          explain: R`Közös szomszéd: B ($k = 2$) és C ($k = 4$). $\mathrm{AA} = 1/\ln 2 + 1/\ln 4 \approx 1{,}443 + 0{,}721 = 2{,}164$. A $0{,}75 = 1/2 + 1/4$ az RA (logaritmus nélkül). A $2{,}885 = 2/\ln 2$ a pár saját fokszámát ($k_A = k_D = 2$) használja a közös szomszédoké helyett. Az $1{,}443$ csak a B-t veszi figyelembe. Lásd a <a class="xref" href="#s112-c">11.2 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes héten a $\mathrm{Po}\text{–}\mathrm{Sz}$ és a $\mathrm{Vi}\text{–}\mathrm{Kl}$ párnak is 2 közös szomszédja van; a PA-juk 12, illetve 6. Melyik állítás igaz?`,
          options: [
            R`A PA az aktivitás miatt teszi előre a Po–Sz-t; a Jaccard épp fordítva rangsorol ($0{,}4$ vs. $2/3$).`,
            R`A Po–Sz kétszer olyan hasonló, mint a Vi–Kl, mert a PA-ja kétszeres.`,
            R`A Jaccard is a Po–Sz-t teszi előre, mert több szomszédja van.`,
            R`Az Adamic–Adar különbséget tesz köztük, mert a Po fokszáma 4.`
          ],
          answer: 0,
          hint: R`Mit mér a PA, és mi a Jaccard nevezője? Az AA kinek a fokszámát használja?`,
          explain: R`A PA a fokszámszorzat: aktivitást mér, nem hasonlóságot (a közös szomszédokat nem is nézi). A Jaccard a nagy uniót bünteti: Po–Sz $2/5 = 0{,}4$, Vi–Kl $2/3$ – a kis csúcsokat hozza előre. Az AA a közös szomszédok fokszámát használja, nem a párét: a Po–Sz közös szomszédai (Ko 4, Vi 3) és a Vi–Kl közös szomszédai (Ko 4, Sz 3) ugyanolyan fokúak, ezért mindkettő AA-ja $1{,}632$ (és RA-ja $0{,}583$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy módszer pontszámai: pozitívak $3, 1, 1$; negatívak $1, 0$. Mennyi az AUC?`,
          options: [R`$\approx 0{,}833$`, R`$1{,}000$`, R`$\approx 0{,}667$`, R`$\approx 0{,}167$`],
          answer: 0,
          hint: R`$3 \cdot 2 = 6$ összevetés. Mennyit ér egy holtverseny?`,
          explain: R`A 3-as pozitív mindkét negatívat legyőzi (2). Egy 1-es pozitív: az 1-essel holtverseny ($\tfrac12$), a 0-st legyőzi (1) – $1{,}5$, kettő $3$. Összesen $5/6 \approx 0{,}833$. Az 1 a holtversenyt nyerésnek, a $0{,}667$ vesztésnek számolja. A $0{,}167 = 1 - 0{,}833$ a fordított pontszám AUC-ja. Lásd a <a class="xref" href="#s113-b">11.3 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`1000 pozitív és $99\,000$ negatív pár van. Egy küszöbnél a módszer a pozitívak 90%-át és a negatívak 2%-át teszi a küszöb fölé. Mekkora a precizitás?`,
          options: [R`$\approx 0{,}31$`, R`$\approx 0{,}90$`, R`$\approx 0{,}98$`, R`$\approx 0{,}69$`],
          answer: 0,
          hint: R`Számold ki darabra a TP-t és az FP-t. A 2% kicsi arány – de miből?`,
          explain: R`TP $= 900$, FP $= 0{,}02 \cdot 99\,000 = 1980$. Precizitás $= 900/2880 \approx 0{,}31$: a jóslatok több mint kétharmada téves. A $0{,}90$ a TPR (recall), nem a precizitás. A $0{,}98$ a pontosság (helyesen osztályozott párok aránya) – a rengeteg negatív miatt ez is félrevezető. A $0{,}69$ a téves jóslatok aránya. A ROC-görbe jó pontja tehát gyenge felső polcot adhat; az AUC nem függ a negatívak számától, a precizitás igen. Lásd a <a class="xref" href="#s113-c">11.3 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik a helyes sorrend egy node2vec-es kapcsolat-előrejelzés kiértékelésénél?`,
          options: [
            R`felosztás → séták és beágyazás a tanítógráfon → pontozás és mérés a tesztéleken`,
            R`séták és beágyazás a teljes gráfon → felosztás → pontozás`,
            R`beágyazás a teljes gráfon → pontozás → a tesztélek kivétele a rangsorból`,
            R`felosztás → beágyazás a teljes gráfon (több adat) → pontozás a tesztéleken`
          ],
          answer: 0,
          hint: R`Mi a pontozó gráf, és benne lehetnek-e a tesztélek?`,
          explain: R`A pontozó gráf a tanítógráf: minden, ami a gráfból számol (fokszám, séta, beágyazás), a felosztás után jön. Ha előbb beágyazol, aztán osztasz fel, a séták a tesztéleken is átmentek – a módszer a választ olvassa ki. A „több adat” érv ugyanez a szivárgás. A tesztélek utólagos kivétele a rangsorból nem segít: a beágyazás már látta őket. A karateklubon a szivárgó PPMI-beágyazás így $0{,}705$ helyett $0{,}888$-at ad. Lásd a <a class="xref" href="#s113-d">11.3 4. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A 4 levelű csillag (középen K, levelek 1, 2, 3, 4; élek K–1, K–2, K–3, K–4) Laplace-sajátértékei $0, 1, 1, 1, 5$. Mit mondhatsz a 2D spektrális beágyazásról?`,
          options: [
            R`Nem egyértelmű: a háromszoros $\mu = 1$ sajátterének bármely két iránya jó, és két levél távolsága is a választástól függ – csak mind a hármat bevéve egyértelmű.`,
            R`Egyértelmű, csak forgatható; a levelek közötti távolságok mindig ugyanazok.`,
            R`A $\mu = 5$-höz tartozó vektor is kell, mert a K-t csak az választja el a levelektől.`,
            R`Egyértelmű: a 2. és a 3. sajátvektort a numerikus módszer mindig ugyanúgy adja.`
          ],
          answer: 0,
          hint: R`Ha a többszörös sajátérték sajátteréből csak egy részt veszel, a forgatás ugyanabban a síkban marad-e?`,
          explain: R`A $\mu = 1$ háromszoros: a sajáttere háromdimenziós. A 2D beágyazás ebből egy síkot választ, és a különböző síkok más-más távolságot adnak (Pythonnal: két levél távolsága választástól függően kb. 0,7 és 1,4 között). Ha mind a hármat beveszed, a négy levél egymástól egyformán $\approx 1{,}414$-re kerül, ez már egyértelmű. Az „egyértelmű, csak forgatható” a kétszeres sajátértékre (pl. a 3 levelű csillagra) igaz, ha az egész sajátteret beveszed. A $\mu = 5$ a legnagyobb, a legugrálóbb irány – nem kell. A numerikus módszer választása önkényes, nem tudás. Lásd a <a class="xref" href="#s114-c">11.4 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes héten a $\mathrm{Vi}\text{–}\mathrm{Kl}$ párnak 2 közös szomszédja van ($J = 2/3$), mégis a 2D spektrális beágyazásban ez a legtávolabbi jelölt ($1{,}338$). Mi a helyes következtetés?`,
          options: [
            R`A 2D beágyazás tömörít, nem minden párt tud jól elhelyezni; a pontszámot több dimenzióban kell számolni, a 2D csak szemléltetés.`,
            R`A CN és a Jaccard téved: a Vi–Kl valójában valószínűtlen pár.`,
            R`Számolási hiba: két közös szomszédú pár nem lehet távol.`,
            R`A Kl a $y$ tengelyen lent áll, mert a Kl „negatív” szereplő.`
          ],
          answer: 0,
          hint: R`Hány számmal írja le a 2D beágyazás a 7 csúcsot? És jelentenek-e valamit a tengelyek?`,
          explain: R`7 csúcsot 2 számmal leírni veszteséges: a Kl-t a 3. sajátvektor külön irányba húzza, ezért a Vi-től messze kerül. Ez a beágyazás korlátja, nem a heurisztikáké – két módszer ugyanarra a párra más-más jelet lát. A számolás helyes (Pythonnal ellenőrizve). A tengelyeknek és az előjelnek nincs önálló jelentése: a $-\mathbf u$ is sajátvektor. Lásd a <a class="xref" href="#s114-b">11.4 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány skip-gram tanítópárt ad egy 8 hosszú séta $\pm 3$-as ablakkal?`,
          options: [R`$36$`, R`$18$`, R`$48$`, R`$42$`],
          answer: 0,
          hint: R`$2\sum_{j=1}^{w}(\ell - j)$: hány $j$ távolságú szópár van egy $\ell$ hosszú mondatban?`,
          explain: R`$2(7 + 6 + 5) = 36$. A 18 csak az egyik irányt számolja. A $48 = 2 \cdot 3 \cdot 8$ minden szónak teljes ablakot ad, pedig a séta két végén csonka. A $42 = 2(8 + 7 + 6)$ eggyel elcsúsztatja az összeget: $j$ távolságú párból $\ell - j$ van, nem $\ell - j + 1$. Lásd a <a class="xref" href="#s115-a">11.5 1. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes hét gráfján a node2vec-séta $\mathrm{Vi} \to \mathrm{Ko}$ lépett. A Ko szomszédai: Vi, Po, Sz, Kl; a Vi szomszédai: Ko, Po, Sz. Mennyi a Kl-re lépés valószínűsége, ha $p = 2$, $q = 0{,}5$?`,
          options: [R`$\approx 0{,}444$`, R`$\approx 0{,}111$`, R`$0{,}250$`, R`$\approx 0{,}167$`],
          answer: 0,
          hint: R`Melyik szomszéd a visszalépés, melyik szomszédja a Vi-nek is, és melyik van a Vi-től 2 lépésre?`,
          explain: R`Vi: vissza, $1/p = 0{,}5$. Po és Sz: a Vi szomszédai, $1$–$1$. Kl: a Vi-től 2 lépés, $1/q = 2$. Összeg $4{,}5$: a Kl-re $2/4{,}5 \approx 0{,}444$. A $0{,}111$ a $p$ és a $q$ felcserélése ($p = 0{,}5$, $q = 2$). A $0{,}25$ a DeepWalk (4 szomszéd egyenletesen). A $0{,}167$ a paramétereket magukat használja súlynak ($p$, $q$ az $1/p$, $1/q$ helyett). Lásd a <a class="xref" href="#s115-c">11.5 3. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon, ha a pontozó gráf a teljes gráf (szivárgás), melyik módszer lenne a <b>második</b> legjobb?`,
          options: [
            R`a spektrális 8D ($0{,}859$)`,
            R`a pref. kapcsolódás ($0{,}852$)`,
            R`a node2vec ($0{,}851$)`,
            R`a DeepWalk (PPMI, 8D) ($0{,}888$)`
          ],
          answer: 0,
          hint: R`Rendezd a szivárgó oszlopot csökkenő sorrendbe. Vigyázz: a legnagyobb érték az első helyezetté.`,
          explain: R`Szivárgó sorrend: PPMI $0{,}888$, spektrális 8D $0{,}859$, PA $0{,}852$, node2vec $0{,}851$ … A második tehát a spektrális 8D – amely tisztán mérve $0{,}537$-tel a leggyengébb. A PPMI az első, nem a második. A PA ($0{,}852$) és a node2vec ($0{,}851$) hajszállal mögötte van; a node2vec tisztán mérve az első ($0{,}748$). A tanulság: a szivárgó számok nemcsak szebbek, hanem mást is rangsorolnak. Lásd a <a class="xref" href="#s116-b">11.6 2. lépését</a>.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hírportál azt kérdezi: „egy ma először említett politikus kivel fog együtt szerepelni?” Mit ajánlasz?`,
          options: [
            R`Csúcsjellemzőket (párt, tisztség, a cikk szövege) és egy induktív modellt, amely jellemzőkből számol vektort (pl. GNN).`,
            R`node2vec-et, mert a séták a politikust is elérik.`,
            R`Adamic–Adart, mert a ritka közös szomszéd többet ér.`,
            R`Spektrális beágyazást a teljes gráf újraszámolásával – így az új csúcsnak is lesz koordinátája.`
          ],
          answer: 0,
          hint: R`Hány éle van a politikusnak a gráfban? Mit tud a gráf egy éltelen csúcsról?`,
          explain: R`Egy éltelen csúcsról a gráf semmit sem tud: a heurisztikák 0-t adnak, a DeepWalk és a node2vec transzduktív (nincs vektora, és a séták sem érik el), a spektrális beágyazás újraszámolva is csak önkényes helyet ad egy elszigetelt csúcsnak – ahogy a Kl-nek a hét elején. Az újhoz külső információ kell: csúcsjellemzők és induktív modell. Lásd a <a class="xref" href="#s116-a">11.6 1. lépését</a>.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz? (Több jó válasz is lehet.)",
          options: [
            R`Az AUC nem függ a negatívak számától, csak az eloszlásuktól – a precizitás viszont igen.`,
            R`Nehéz (2 távolságú) negatívakkal a karateklubon a CN AUC-ja 0,68-ról 0,47-re esik.`,
            R`A node2vec-ben a kis $q$ BFS-szerű, szűk környezetet bejáró sétát ad.`,
            R`A spektrális beágyazásnál a több dimenzió mindig jobb kapcsolat-előrejelzést ad.`,
            R`A szivárgás a CN-t erősen felfelé torzítja, a beágyazásokat alig.`
          ],
          answer: [0, 1],
          hint: R`Gondold végig a 11.3 negatív mintavételét, a node2vec két paraméterét és a karateklub táblázatát.`,
          explain: R`Igaz az első: az AUC párösszevetés, a negatívak számának növelése az arányt nem változtatja (ha az eloszlás ugyanaz). Igaz a második: a CN tudása nagyrészt a közeli és a távoli párok szétválasztása; közeli negatívak között alig dönt. Hamis a harmadik: fordítva – kis $q$ → távolodás → DFS-szerű; a BFS-szerű sétához nagy $q$ kell. Hamis a negyedik: a karateklubon a spektrális 8D ($0{,}537$) rosszabb a 2D-nél ($0{,}598$). Hamis az ötödik: épp fordítva – a CN alig változik ($0{,}691 \to 0{,}698$), a beágyazások és a PA nagyot ugranak. Lásd a <a class="xref" href="#s113-c-nehez">nehéz negatívakat</a> és a <a class="xref" href="#s116-b-karate">karateklub táblázatát</a>.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
