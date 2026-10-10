/* =========================================================
   Mesterséges intelligencia 4. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
    /* ------------------------------------------------ 4.1 */
    "ai4-41": {
      title: "Kvíz – 4.1 Az adat típusai és minősége",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Milyen típusú a „ruhaméret” (S, M, L, XL) változó?",
          options: ["ordinális kategóriás", "nominális kategóriás", "diszkrét numerikus", "folytonos numerikus"],
          answer: 0,
          hint: "Sorba rendezhetők-e az értékek? És van-e értelme a különbségüknek („L − S”)?",
          explain: "Az értékek sorba rendezhetők (S < M < L < XL), de a lépcsők nagysága nem értelmezett, és nem számok: ordinális kategória. Nominális akkor lenne, ha nem volna sorrend."
        },
        {
          type: "match",
          q: "Párosítsd a piszkos táblázat (és két másik) oszlopát a típusával!",
          pairs: [
            ["irányítószám", "nominális kategóriás"],
            ["állapot", "ordinális kategóriás"],
            ["szobák száma", "diszkrét numerikus"],
            ["alapterület", "folytonos numerikus"],
            ["elkelt-e 30 napon belül", "bináris"]
          ],
          hint: "Csak egyezést lehet nézni, sorrendet is, vagy számolni is lehet vele? Hány értéke lehet?",
          explain: "Az irányítószám számjegyekből áll, de kategória (nincs értelme a különbségének). Az állapotnak van sorrendje. A szobák száma megszámlálható, az alapterület bármilyen valós szám lehet. A kétértékű kategória bináris."
        },
        {
          type: "single", shuffle: true,
          q: "Hány számból áll egy 32 × 32 pixeles színes (RGB) kép?",
          options: ["3072", "1024", "96", "32 768"],
          answer: 0,
          hint: "Pixelenként hány szám van egy színes képen?",
          explain: R`$32\cdot32\cdot3 = 3072$. Az 1024 a színcsatornákat felejti el, a 96 csak $32\cdot3$, a 32 768 pedig $32^3$.`
        },
        {
          type: "multi",
          q: "Melyik sor jelez hibát a piszkos táblázat adatprofiljában?",
          options: [
            "m²: maximum 650 egy háromszobás lakásnál",
            "fűtés: 6 különböző érték, pedig 4 fűtéstípus van",
            "ár: maximum 68 000 000 (a többi millió Ft-ban)",
            "építés éve: 1961 és 2019 között",
            "szobák: 1 és 4 között"
          ],
          answer: [0, 1, 2],
          hint: "Melyik érték lóg ki a józan tartományból, és hol több az írásmód, mint a valódi kategória?",
          explain: "A 650 m² elírás (65), a 6 írásmód a „gáz”, „Gáz”, „gáz ” miatt van, a 68 000 000 forintban, nem millióban szerepel. Az építési évek és a szobaszámok hihetők."
        },
        {
          type: "single", shuffle: true,
          q: "A New York-i taxis borravaló-modell (RWML 6) gyanúsan jó volt, és a fizetési módon múlt. Mi volt az oka?",
          options: [
            "A készpénzes borravalót a sofőrök nem rögzítették, így minden készpénzes út „borravaló nélkülinek” látszott.",
            "A kártyás utasok szinte sosem adnak borravalót.",
            "A modell túlillesztett a kevés adat miatt.",
            "A fizetési mód csak az út után derül ki, ezért a jövőből jön."
          ],
          answer: 0,
          hint: "Az adat a valóságot írta le, vagy a rögzítés módját?",
          explain: "A hiba a címke mérésében volt: készpénzes borravaló nem került az adatba. A kártyás utasok több mint 95%-a adott borravalót – épp fordítva. A fizetési mód az út végén ismert, nem jövőbeli adat; a baj a hamis címke volt."
        },
        {
          type: "single", shuffle: true,
          q: "Egy 6 hosszú idősorból 2 napos csúszóablakkal (2 nap → következő nap) hány tanító minta lesz?",
          options: ["4", "6", "5", "3"],
          answer: 0,
          hint: "Az első két értéknek nincs elég előzménye. Általában: $n - k$.",
          explain: R`$6 - 2 = 4$ minta: az első jósolható érték a 3., az utolsó a 6. Az 5 az $n - 1$ (egynapos ablaké), a 6 minden értéket címkének venne.`
        }
      ]
    },

    /* ------------------------------------------------ 4.2 */
    "ai4-42": {
      title: "Kvíz – 4.2 Adattisztítás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Ismert életkorok: 22, 25, 28, 30, 35, 90. Mivel pótolsz mediánnal?",
          options: ["29", "38,33", "28", "30"],
          answer: 0,
          hint: "Páros számú adatnál a medián a két középső átlaga.",
          explain: R`A két középső: 28 és 30, átlaguk 29. A 38,33 az átlag (a 90 felhúzza), a 28 és a 30 csak az egyik középső érték.`
        },
        {
          type: "single", shuffle: true,
          q: "Sok hiányzó értéket pótolsz az oszlop átlagával. Mi történik az oszlop szórásával?",
          options: ["csökken", "nő", "nem változik", "pontosan nulla lesz"],
          answer: 0,
          hint: "Hová kerülnek a pótolt értékek az eloszláshoz képest?",
          explain: "A pótolt értékek mind az átlagba kerülnek, ahol az eltérésük 0 – így az átlagos négyzetes eltérés csökken. Nulla csak akkor lenne, ha minden érték pótolt volna."
        },
        {
          type: "match",
          q: "Párosítsd a hiány okát a típusával!",
          pairs: [
            ["a szenzor véletlenszerűen kihagy egy-egy mérést", "teljesen véletlen (MCAR)"],
            ["a magas jövedelműek nem adják meg a jövedelmüket", "az értéktől függő (MNAR)"],
            ["az egyik (ismert) ügyfélcsoport ritkábban adja meg a korát", "más változótól függő (MAR)"]
          ],
          hint: "Mitől függ, hogy hiányzik-e az érték: semmitől, egy másik (ismert) oszloptól, vagy magától a hiányzó értéktől?",
          explain: "MCAR: nincs mintázat. MAR: a hiány egy megfigyelt változótól függ. MNAR: a hiány oka maga a (nem látott) érték – ilyenkor a hiány is információ, érdemes hiányzásjelzőt felvenni."
        },
        {
          type: "single", shuffle: true,
          q: R`Adatok: 10, 12, 13, 15, 16, 18, 60 ($Q_1 = 12$, $Q_3 = 18$). Hol vannak az IQR-szabály kerítései?`,
          options: ["3 és 27", "6 és 24", "12 és 18", "0 és 30"],
          answer: 0,
          hint: R`Kerítés: $Q_1 - 1{,}5\cdot\text{IQR}$ és $Q_3 + 1{,}5\cdot\text{IQR}$.`,
          explain: R`$\text{IQR} = 6$, $1{,}5\cdot6 = 9$: $12 - 9 = 3$ és $18 + 9 = 27$. A 6 és 24 csak $1\cdot\text{IQR}$-t, a 0 és 30 $2\cdot\text{IQR}$-t használ, a 12 és 18 maguk a kvartilisek. A 60 kiugró.`
        },
        {
          type: "single", shuffle: true,
          q: "Öt oszlopban egymástól függetlenül 4–4% hiányzik. A sorok hány százaléka teljes?",
          options: ["kb. 81,5%", "80%", "96%", "kb. 20%"],
          answer: 0,
          hint: "Egy sor akkor teljes, ha mind az öt cellája megvan – „és” → szorzás.",
          explain: R`$0{,}96^5 \approx 0{,}815$. A 80% az $1 - 5\cdot0{,}04$ közelítés, a 96% egyetlen oszlopé, a 20% körüli érték a hiányos sorok aránya (18,5%), nem a teljeseké.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a duplikált sorokra?",
          options: [
            "a tanító–teszt felosztás előtt kell kiszűrni őket",
            "ha az egyik példány a tanító, a másik a teszt halmazba kerül, a teszthiba túl optimista",
            "a duplikált sor a tanításban kétszeres súllyal számít",
            "minden teljesen egyező sor biztosan hiba"
          ],
          answer: [0, 1, 2],
          hint: "Gondolj a panelház két egyforma lakására is.",
          explain: "Az első három igaz. Az utolsó nem: két valóban egyforma eset (két ugyanolyan lakás, két azonos rendelés) is lehet – azonosító, cím, időpont alapján kell dönteni."
        }
      ]
    },

    /* ------------------------------------------------ 4.3 */
    "ai4-43": {
      title: "Kvíz – 4.3 Kategóriás változók kódolása",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hány oszlop lesz egy 5 kategóriás változóból $k - 1$ oszlopos one-hot kódolással?`,
          options: ["4", "5", "1", "10"],
          answer: 0,
          hint: "Az egyik kategória az alapkategória – csupa nulla sor.",
          explain: R`$5 - 1 = 4$. A teljes one-hot 5 oszlopot ad, a címkekódolás 1-et.`
        },
        {
          type: "single", shuffle: true,
          q: "Miért hibás a fűtéstípus (gáz = 0, távfűtés = 1, elektromos = 2, hőszivattyú = 3) címkekódolása egy lineáris modellben?",
          options: [
            "Kitalált sorrendet és egyenlő lépcsőket sugall: a modell egyetlen súllyal szorozza a kódot.",
            "Túl sok oszlopot hoz létre.",
            "A lineáris modell egész számokkal nem tud számolni.",
            "Nem hibás, mert a kódok különbözők."
          ],
          answer: 0,
          hint: "Mit jelentene a modell szerint, hogy a hőszivattyú kódja a távfűtésének háromszorosa?",
          explain: "A lineáris modellnél a hőszivattyú hatása a távfűtésének háromszorosa lenne, az elektromos a kettő „között” – ezek kitalált összefüggések. A címkekódolás egyetlen oszlopot ad, és az egész számokkal sincs gond."
        },
        {
          type: "single", shuffle: true,
          q: R`Célváltozó-alapú kódolás simítással: a C kerületben 1 eladás van (90 M Ft), a teljes átlag 57,67, $m = 2$. Mennyi a C kódja?`,
          options: ["kb. 68,44", "90", "57,67", "kb. 73,83"],
          answer: 0,
          hint: R`$\dfrac{n\cdot\bar y_c + m\cdot\bar y}{n + m}$.`,
          explain: R`$(1\cdot90 + 2\cdot57{,}67)/3 \approx 68{,}44$. A 90 a simítatlan kód (maga a címke!), az 57,67 a teljes átlag, a 73,83 a kettő sima átlaga ($m = 1$-nek felelne meg).`
        },
        {
          type: "multi",
          q: "Melyik kódolás jó az „állapot” (felújítandó / átlagos / felújított) változóra egy lineáris modellben?",
          options: [
            "címkekódolás a valódi sorrendben (0, 1, 2)",
            "one-hot kódolás (k − 1 oszloppal)",
            "címkekódolás ábécérendben",
            "célváltozó-alapú kódolás a teljes adaton számolva"
          ],
          answer: [0, 1],
          hint: "Ordinális változó. Mi rontja el a sorrendet, és mi szivárogtat?",
          explain: "A sorrendet tartó címkekódolás egy súlyt ad (egyenlő lépcsők), a one-hot kategóriánként külön súlyt – mindkettő értelmes. Az ábécérend (átlagos, felújítandó, felújított) összekeveri a sorrendet; a teljes adaton számolt célváltozó-kód szivárgás."
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a legjobb kódolással!",
          pairs: [
            ["4 fűtéstípus, lineáris modell", "one-hot kódolás"],
            ["3000 település, lineáris modell", "ritkák összevonása vagy simított célváltozó-kód"],
            ["ruhaméret (S, M, L, XL)", "címkekódolás a valódi sorrendben"],
            ["autómárka egy döntési fában", "egyszerű címkekódolás is elég"]
          ],
          hint: "Hány kategória van, van-e sorrend, és milyen a modell?",
          explain: "Kevés nominális kategóriánál one-hot; nagyon soknál a one-hot felrobbanna. Ordinálisnál sorszám. A fák a kódokat vágásokkal szétválogatják, nekik a címkekódolás is jó."
        }
      ]
    },

    /* ------------------------------------------------ 4.4 */
    "ai4-44": {
      title: "Kvíz – 4.4 Skálázás és transzformációk",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Alapterületek: 40, 45, 50, 55, 60, 65, 400 (medián 55, IQR 20). Mennyi a 400 robusztus skálázott értéke?",
          options: ["17,25", "2,44", "1", "8,63"],
          answer: 0,
          hint: R`$(x - \text{medián})/\text{IQR}$.`,
          explain: R`$(400 - 55)/20 = 17{,}25$. A 2,44 a standardizált érték (a kiugró felfújta a szórást), az 1 a min–max érték, a 8,63 kétszeres IQR-rel osztana.`
        },
        {
          type: "multi",
          q: "Melyik modellnél kell (vagy erősen ajánlott) a jellemzők skálázása?",
          options: ["legközelebbi szomszéd", "gradiens módszerrel tanított neurális háló", "Lasso regresszió", "véletlen erdő"],
          answer: [0, 1, 2],
          hint: "Melyik számol távolságot, gradienst vagy a súlyok nagyságát büntető tagot – és melyik csak sorrendet néz?",
          explain: "A távolság, a gradiens módszer és a súlybüntetés léptékfüggő. A véletlen erdő fái csak „nagyobb-e mint” kérdéseket tesznek fel – nekik a skálázás mindegy."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy modell $\log_{10}$(ár)-at jósol, és 1,7-et mond. Mennyi a becsült ár?`,
          options: ["kb. 50,1 M Ft", "1,7 M Ft", "kb. 5,47 M Ft", "17 M Ft"],
          answer: 0,
          hint: "A log-transzformált címkét vissza kell alakítani.",
          explain: R`$10^{1{,}7} \approx 50{,}1$. Az 1,7 a transzformált érték, az 5,47 az $e^{1{,}7}$ (rossz alap), a 17 a $10\cdot1{,}7$.`
        },
        {
          type: "single", shuffle: true,
          q: "Életkorok: 18, 22, 25, 31, 38, 45, 52, 67. Három egyenlő szélességű sávnál hány érték kerül az első sávba?",
          options: ["4", "2", "3", "5"],
          answer: 0,
          hint: R`Sávszélesség: $(67 - 18)/3$. Hol az első határ?`,
          explain: R`Szélesség $\approx 16{,}33$, az első sáv $[18;\ 34{,}33)$: 18, 22, 25, 31 – négy érték. (A sávok darabszáma 4, 2, 2.)`
        },
        {
          type: "single", shuffle: true,
          q: "A tanító alapterületek 20 és 80 m² között voltak (min–max skálázás). Mennyi egy új, 95 m²-es lakás skálázott értéke?",
          options: ["1,25", "1", "0,95", "1,1875"],
          answer: 0,
          hint: "A képlet a tanító halmaz min és max értékével számol – és nincs benne levágás.",
          explain: R`$(95 - 20)/(80 - 20) = 75/60 = 1{,}25$. Új adatnál a min–max érték kiléphet a $[0;\ 1]$-ből. Az 1 a levágott érték, a 0,95 és az 1,1875 rossz osztás.`
        },
        {
          type: "single", shuffle: true,
          q: "Melyik változtatja meg egy jellemző eloszlásának alakját (pl. ferde → közel szimmetrikus)?",
          options: ["log-transzformáció", "standardizálás", "min–max skálázás", "robusztus skálázás"],
          answer: 0,
          hint: "Melyik nem csak eltolás és nyújtás?",
          explain: "A standardizálás, a min–max és a robusztus skálázás is lineáris (eltol és nyújt) – a hisztogram alakja ugyanaz marad. A logaritmus nemlineáris: a nagy értékeket összenyomja."
        }
      ]
    },

    /* ------------------------------------------------ 4.5 */
    "ai4-45": {
      title: "Kvíz – 4.5 Jellemzőképzés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Az órát ciklikusan kódoljuk: $(\sin\frac{2\pi h}{24}, \cos\frac{2\pi h}{24})$. Mekkora a 23 óra és az 1 óra képének távolsága?`,
          options: ["kb. 0,518", "22", "2", "0"],
          answer: 0,
          hint: "Két óra különbség a körön – ugyanannyi, mint 11 és 13 óra között.",
          explain: R`A két pont a kör $\frac2{24}$ részére van egymástól: $2\sin\frac{\pi}{12} \approx 0{,}518$. A 22 a nyers különbség (amit épp el akartunk kerülni), a 2 a 0 és 12 óra (átellenes pontok) távolsága.`
        },
        {
          type: "single", shuffle: true,
          q: "A ház 1975-ben épült, a hirdetés 2026-os. Melyik a jobb jellemző, és mennyi az értéke?",
          options: ["a kor: 51 év", "az építés éve: 1975", "a kor: 49 év", "a hirdetés éve: 2026"],
          answer: 0,
          hint: "Melyik jelenti jövőre is ugyanazt?",
          explain: R`A kor ($2026 - 1975 = 51$) az árra ható mennyiség, és nem függ attól, melyik évben jósolunk. Az évszám önmagában a jövőben sosem látott értéket kap.`
        },
        {
          type: "multi",
          q: "Melyik új jellemző használható egy lakásár-modellben a hirdetés pillanatában?",
          options: ["a ház kora", "szobánkénti alapterület (m²/szoba)", "a hét napja, amikor meghirdették", "négyzetméterár (eladási ár / m²)", "hány nap alatt kelt el"],
          answer: [0, 1, 2],
          hint: "Ismert-e az érték, amikor a modellnek jósolnia kell?",
          explain: "A kor, a m²/szoba és a meghirdetés napja a hirdetéskor ismert. A négyzetméterár a címkéből jön, az eladási idő csak az eladás után derül ki – mindkettő szivárgás."
        },
        {
          type: "single", shuffle: true,
          q: "Szókincs: (erkélyes, felújított, lakás, panel, világos). Mi a szózsák-vektora ennek: „világos panel lakás, világos konyhával”?",
          options: ["(0, 0, 1, 1, 2)", "(0, 0, 1, 1, 1)", "(1, 0, 1, 1, 2)", "(0, 0, 1, 1, 2, 1)"],
          answer: 0,
          hint: "Számold meg a szókincs minden szavát; a szókincsen kívüli szó kimarad.",
          explain: "A „világos” kétszer, a „panel” és a „lakás” egyszer szerepel, a „konyhával” nincs a szókincsben, így nem kap oszlopot. A (0, 0, 1, 1, 1) a gyakoriságot 0/1-re vágja, a hatelemű vektor új oszlopot nyitna."
        },
        {
          type: "single", shuffle: true,
          q: R`$\hat y = 0{,}7\cdot m^2 + 0{,}2\cdot(m^2\cdot\text{felújított}) + 5$. Mennyivel becsül többet egy felújított 100 m²-es lakásra, mint egy nem felújítottra?`,
          options: ["20 M Ft", "0,2 M Ft", "12 M Ft", "70 M Ft"],
          answer: 0,
          hint: "A kölcsönhatás tagja csak a felújított lakásnál nem nulla – és arányos a m²-rel.",
          explain: R`$0{,}2\cdot100 = 20$. A 0,2 a súly maga, a 12 a 60 m²-es lakásra jönne ki, a 70 a $0{,}7\cdot100$ tag.`
        },
        {
          type: "single", shuffle: true,
          q: "Mi a szózsák legfőbb korlátja?",
          options: [
            "Elveszik a szavak sorrendje: „nem felújított, de világos” és „felújított, de nem világos” ugyanaz.",
            "Csak angol szövegen működik.",
            "Minden szöveg ugyanolyan hosszú vektort kap, ezért nem lehet összehasonlítani őket.",
            "A gyakori szavakat nem tudja megszámolni."
          ],
          answer: 0,
          hint: "Mi történik, ha a mondat szavait egy zsákba szórod?",
          explain: "A szózsák csak a szavak gyakoriságát tartja meg. A rögzített hosszú vektor épp az előnye (így kerülhet modellbe); a nyelvtől független (magyarban a szótövezés segít)."
        }
      ]
    },

    /* ------------------------------------------------ 4.6 */
    "ai4-46": {
      title: "Kvíz – 4.6 Jellemzőkiválasztás és a dimenzió átka",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`XOR-adat: $(x_1, x_2) = (0,0), (0,1), (1,0), (1,1)$, címke 0, 1, 1, 0. Mit mond egy korreláción alapuló szűrő módszer?`,
          options: [
            "Mindkét jellemző korrelációja 0, ezért mindkettőt eldobná – pedig együtt tökéletesen meghatározzák a címkét.",
            "Mindkettő korrelációja 1, ezért mindkettőt megtartja.",
            "Az egyiket megtartja, a másikat redundánsnak jelöli.",
            "A szűrő ilyen adaton nem számolható."
          ],
          answer: 0,
          hint: "Ha $x_1 = 0$, a címke 0 vagy 1; ha $x_1 = 1$, szintén. Mennyit árul el $x_1$ egyedül?",
          explain: R`Egyenként egyik jellemző sem árul el semmit (korreláció 0), együtt viszont $y = x_1 + x_2 - 2x_1x_2$. Ez a szűrő módszerek gyengéje: nem látják a jellemzők együttműködését.`
        },
        {
          type: "single", shuffle: true,
          q: "Legfeljebb hány modellt tanít az előrelépéses kiválasztás 10 jellemzőnél?",
          options: ["55", "1023", "10", "100"],
          answer: 0,
          hint: R`Az 1. lépésben 10 jelölt, a 2.-ban 9, …`,
          explain: R`$10 + 9 + \dots + 1 = 55$. Az 1023 a teljes keresés ($2^{10} - 1$), a 10 csak az első lépés, a 100 a $10^2$.`
        },
        {
          type: "single", shuffle: true,
          q: "Mekkora oldalú kocka fogja be az egyenletesen szórt adat 10%-át 10 dimenzióban?",
          options: ["kb. 0,79", "0,1", "0,01", "0,5"],
          answer: 0,
          hint: R`A kocka térfogata $a^d$; ennek kell 0,1-nek lennie.`,
          explain: R`$a = 0{,}1^{1/10} \approx 0{,}79$ – oldalanként a tartomány közel 80%-a. A 0,1 egy dimenzióban lenne igaz.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a Lasso regresszióra?",
          options: [
            "a felesleges súlyokat pontosan nullára húzhatja",
            "a jellemzőket előtte skálázni kell",
            "a büntetés erősségét (λ) validációs halmazon érdemes választani",
            "csak döntési fákkal használható"
          ],
          answer: [0, 1, 2],
          hint: "Beágyazott módszer: a kiválasztás a tanítás része.",
          explain: R`A $\lambda\sum|w_j|$ büntetés nullára húz egyes súlyokat (kiválaszt), a súlyok nagysága léptékfüggő (skálázás kell), és a $\lambda$ hiperparaméter. Lineáris modell, nem fa.`
        },
        {
          type: "single", shuffle: true,
          q: "Tengelyenként 10 részre osztott rács, 1000 egyenletesen szórt minta, 6 dimenzió. Átlagosan hány minta jut egy cellára?",
          options: ["0,001", "1", "100", "166,7"],
          answer: 0,
          hint: R`Hány cella van $d$ dimenzióban?`,
          explain: R`$10^6$ cella, $1000/10^6 = 0{,}001$. Az 1 három dimenzióra igaz, a 166,7 az $1000/6$ – mintha a cellák száma csak a dimenzióval arányosan nőne, nem exponenciálisan.`
        },
        {
          type: "single", shuffle: true,
          q: "Véletlen pontok az egységkockában: hogyan változik a legközelebbi és a legtávolabbi pont távolságának aránya a dimenzió növelésével?",
          options: ["1-hez közelít", "0-hoz közelít", "nem változik", "minden határon túl nő"],
          answer: 0,
          hint: "Lásd a „dimenzió átka” szemléltetést: $d = 2$-nél kb. 0,02, $d = 1000$-nél?",
          explain: "A távolságok kiegyenlítődnek: a legközelebbi is szinte ugyanolyan messze van, mint a legtávolabbi (a kísérletben 0,02 → 0,33 → 0,73 → 0,91). Ezért veszíti el értelmét a „legközelebbi szomszéd” sok dimenzióban. Az arány legfeljebb 1 lehet."
        }
      ]
    },

    /* ------------------------------------------------ 4.7 */
    "ai4-47": {
      title: "Kvíz – 4.7 Adatszivárgás",
      questions: [
        {
          type: "single", shuffle: true,
          q: "Miért szivárgás az „illeték” oszlop a lakásár-modellben?",
          options: [
            "Mert az ár átszámítása (ár = 25 · illeték), és csak az adásvétel után keletkezik.",
            "Mert nagyon erősen korrelál az árral.",
            "Mert hiányzó értékek vannak benne.",
            "Mert pénzben van megadva, mint a címke."
          ],
          answer: 0,
          hint: "Az aranyszabály: ismert-e az érték a jóslás pillanatában?",
          explain: "A meghirdetéskor illeték még nincs – és ha lenne, maga az ár volna. Az erős korreláció önmagában nem szivárgás (a kért ár is erősen korrelál, mégis szabályos jellemző)."
        },
        {
          type: "single", shuffle: true,
          q: "Tanító értékek: 10, 20, 30 (átlag 20, szórás ≈ 8,16); teszt érték: 100. Mennyi a teszt pont helyesen standardizált értéke?",
          options: ["kb. 9,80", "kb. 1,70", "4", "8"],
          answer: 0,
          hint: "A skálázó számai csak a tanító halmazból jöhetnek.",
          explain: R`$(100 - 20)/8{,}16 \approx 9{,}80$. Az 1,70 a teljes adat (tanító + teszt) átlagával és szórásával jön ki – ez a szivárgás. A 8 a szórás helyett 10-zel osztana.`
        },
        {
          type: "multi",
          q: "Melyik okoz szivárgást?",
          options: [
            "a skálázó illesztése a teljes adaton, felosztás előtt",
            "a ritka osztály túlmintavételezése felosztás előtt",
            "egy idősor véletlenszerű felosztása, ha a jövőre jósolunk",
            "a kódtábla felépítése a tanító halmazon",
            "duplikátumszűrés a felosztás előtt"
          ],
          answer: [0, 1, 2],
          hint: "Melyiknél jut a teszt (vagy a jövő) információja a tanításba?",
          explain: "Az első háromnál a teszt halmaz vagy a jövő beleszól a tanításba. A tanító halmazon épített kódtábla és a felosztás előtti duplikátumszűrés épp a helyes eljárás."
        },
        {
          type: "single", shuffle: true,
          q: "Az adatban 50 duplikált pár van, véletlen 80–20%-os felosztás. Várhatóan hány pár „szivárog” (egyik tag a tanító, másik a teszt halmazban)?",
          options: ["16", "10", "8", "40"],
          answer: 0,
          hint: "Egy pár kétféleképpen szakadhat szét: tanító–teszt vagy teszt–tanító.",
          explain: R`$50\cdot2\cdot0{,}8\cdot0{,}2 = 16$. A 8 a kétféle sorrend közül csak az egyiket számolja, a 10 az 50 pár 20%-a, a 40 a 80%-a.`
        },
        {
          type: "match",
          q: "Párosítsd a helyzetet a megfelelő felosztással!",
          pairs: [
            ["jövőbeli eladásokat jósolunk", "időrendi felosztás"],
            ["új betegekre jósolunk, betegenként több felvétel van", "csoportos (betegenkénti) felosztás"],
            ["a pozitív osztály 0,1%", "rétegzett felosztás"],
            ["egymástól független, hasonló minták", "véletlen felosztás"]
          ],
          hint: "A tesztnek azt a helyzetet kell utánoznia, amelyben a modellt használni fogod.",
          explain: "A jövőre időrendben, új csoportra csoportosan, ritka osztálynál rétegzetten osztunk (hogy a tesztben is legyen belőle). Független mintáknál a véletlen felosztás rendben van."
        }
      ]
    },

    /* ------------------------------------------------ 4.8 */
    "ai4-48": {
      title: "Kvíz – 4.8 Címkék, mintavétel, kiegyensúlyozatlanság",
      questions: [
        {
          type: "single", shuffle: true,
          q: "10 000 tranzakcióból 10 csalás. Mennyi a „mindig: nem csalás” modell pontossága?",
          options: ["99,9%", "0,1%", "50%", "99%"],
          answer: 0,
          hint: "Hány döntése helyes?",
          explain: R`9990 helyes döntés: $9990/10\,000 = 99{,}9\%$ – miközben egyetlen csalást sem talál. A 0,1% a csalások aránya.`
        },
        {
          type: "single", shuffle: true,
          q: R`10 000 minta, 100 pozitív. Mennyi a pozitív osztály súlya a $w_c = n/(k\,n_c)$ szabállyal ($k = 2$)?`,
          options: ["50", "100", "0,01", "99"],
          answer: 0,
          hint: R`$n = 10\,000$, $k = 2$, $n_c = 100$.`,
          explain: R`$10\,000/(2\cdot100) = 50$. A 100 a $k$-t felejti el, a 99 a két osztály méretének aránya, a 0,01 a pozitívok aránya.`
        },
        {
          type: "single", shuffle: true,
          q: "Három független annotátor, mindegyik 80%-ban helyes. Mennyi a többségi szavazat pontossága?",
          options: ["89,6%", "80%", "51,2%", "99,2%"],
          answer: 0,
          hint: "A többség akkor jó, ha legalább ketten jók: hárman vagy pontosan ketten.",
          explain: R`$0{,}8^3 + 3\cdot0{,}8^2\cdot0{,}2 = 0{,}512 + 0{,}384 = 0{,}896$. Az 51,2% csak a „mind a három jó” eset, a 99,2% az „legalább egy jó” ($1 - 0{,}2^3$).`
        },
        {
          type: "multi",
          q: "Melyik helyes eljárás ritka osztálynál?",
          options: [
            "rétegzett tanító–teszt felosztás",
            "túl- vagy alulmintavételezés csak a tanító halmazon",
            "a teszt halmaz megtartása az eredeti arányban",
            "a teszt halmaz túlmintavételezése 50–50%-ra",
            "túlmintavételezés a felosztás előtt"
          ],
          answer: [0, 1, 2],
          hint: "A tesztnek az éles helyzetet kell utánoznia, és semmi nem szivároghat bele.",
          explain: "A rétegzés biztosítja, hogy a tesztben is legyen ritka eset; az újramintavételezés csak a tanítást segíti. A teszt átalakítása torzítja az értékelést, a felosztás előtti túlmintavételezés pedig ugyanazt a mintát mindkét halmazba juttathatja."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik átalakítás NEM címkemegőrző egy kézzel írt számjegyeket felismerő modell adatbővítésénél?",
          options: ["180°-os forgatás", "1–2 pixeles eltolás", "enyhe elmosás", "a fényerő kis változtatása"],
          answer: 0,
          hint: "Melyik változtathatja meg, hogy melyik számjegyet látjuk?",
          explain: "A 6-os fejjel lefelé 9-es lesz (és a 9-ből 6). A kis eltolás, az elmosás és a fényerő nem változtat a számjegyen."
        },
        {
          type: "single", shuffle: true,
          q: "A „figyelő” csalásmodell 30 tranzakciót jelöl, ebből 8 valódi csalás; összesen 10 csalás volt. Mennyi a felidézése?",
          options: ["80%", "kb. 26,7%", "99,76%", "0,08%"],
          answer: 0,
          hint: "A felidézés: a valódi csalások hányad részét találta meg?",
          explain: R`$8/10 = 80\%$. A 26,7% a precizitás ($8/30$, a riasztások hányad része valódi), a 99,76% a pontosság.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ai4-final": {
      title: "Fejezetzáró teszt – 4. Adatok és jellemzők",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`A piszkos adaton (650 m², duplikátum) tanított egyenes: $\hat y = 0{,}0054\cdot m^2 + 51{,}2$ – szinte vízszintes. Mi az oka?`,
          options: [
            "Az elírt 650 m² kiugró érték: az egyenesnek őt is „ki kell szolgálnia”, ezért a meredekség majdnem 0 lett.",
            "A duplikált sor miatt a modell túlillesztett.",
            "A lakásárak valójában nem függnek az alapterülettől.",
            "A gradiens módszer túl kis tanulási rátával futott."
          ],
          answer: 0,
          hint: "Melyik ponthoz képest „lóg” az összes többi?",
          explain: "Egyetlen 650 m²-es pont 52 M Ft-tal „azt mondja”, hogy a m² alig számít. Tisztítás után a meredekség 0,796. A duplikátum csak egy sort duplázott, a zárt képletnél tanulási ráta nincs."
        },
        {
          type: "single", shuffle: true,
          q: "A piszkos táblázatban (márc. 2–21.) a jövőbeli hirdetések árát akarjuk becsülni. Melyik a helyes felosztás?",
          options: [
            "márc. 2–16. tanító, márc. 19. és 21. teszt",
            "véletlenszerűen választott 2 lakás teszt",
            "a 2 legdrágább lakás teszt",
            "márc. 19. és 21. tanító, a többi teszt"
          ],
          answer: 0,
          hint: "A teszt utánozza a használat helyzetét: a múltból tanulunk, a jövőre jósolunk.",
          explain: "Időrendi felosztás: a korábbiakon tanítunk, a későbbieken tesztelünk. A véletlen felosztás a „jövőt” is a tanításba keverhetné, a címke szerinti válogatás torzít, a fordított sorrend a jövőből jósolná a múltat."
        },
        {
          type: "single", shuffle: true,
          q: "A tanító alapterületek: 38, 45, 52, 65, 74, 90. Mivel pótolod a 8. lakás hiányzó alapterületét (mediánnal)?",
          options: ["58,5", "60,67", "52", "65"],
          answer: 0,
          hint: "Páros számú adat – a két középső átlaga.",
          explain: R`$(52 + 65)/2 = 58{,}5$. A 60,67 az átlag, az 52 és a 65 csak egy-egy középső érték.`
        },
        {
          type: "multi",
          q: "Melyik lépést kell CSAK a tanító halmazon illeszteni (és a tesztre változatlanul alkalmazni)?",
          options: [
            "a pótló érték (medián, módusz) kiszámítása",
            "a skálázó átlaga és szórása",
            "a célváltozó-alapú kód",
            "a ritka osztály túlmintavételezése",
            "a duplikátumok kiszűrése"
          ],
          answer: [0, 1, 2, 3],
          hint: "Melyik „tanul” valamit az adatból? És melyik történik a felosztás előtt?",
          explain: "A pótlás, a skálázás, a kódolás és az újramintavételezés mind az adatból tanul – csak a tanító halmazból tehetik. A duplikátumszűrés a felosztás előtt, a teljes adaton történik."
        },
        {
          type: "single", shuffle: true,
          q: "20 000 tranzakció, ebből 40 csalás. Mennyi a semmittevő („mindig: nem csalás”) modell pontossága?",
          options: ["99,8%", "0,2%", "99,98%", "98%"],
          answer: 0,
          hint: "A helyes döntések száma a nem csalások száma.",
          explain: R`$19\,960/20\,000 = 99{,}8\%$. A 0,2% a csalások aránya; 99,98% 4 csalásnál, 98% 400 csalásnál jönne ki.`
        },
        {
          type: "single", shuffle: true,
          q: "Hat lakás 40–65 m² között és egy 400 m²-es kastély. Melyik skálázás „nyomja össze” leginkább a hat lakást?",
          options: ["min–max skálázás", "robusztus skálázás (medián, IQR)", "egyik sem, mind ugyanaz", "a skálázás nélküli nyers adat"],
          answer: 0,
          hint: "Melyik épül közvetlenül a legnagyobb értékre?",
          explain: R`A min–max a $[\min;\ \max]$ tartományra épül, így a hat lakás a $[0;\ 0{,}07]$ sávba szorul. A robusztus skála a mediánt és az IQR-t használja – rájuk a kastély alig hat.`
        },
        {
          type: "single", shuffle: true,
          q: "Egy modell 99,7%-os pontosságot ér el a teszten, és szinte csak egyetlen jellemzőn múlik („a vevő által fizetett illeték”). Mi az első teendő?",
          options: [
            "szivárgásnyomozás: ismert-e ez a jellemző a jóslás pillanatában?",
            "több adat gyűjtése, hogy még jobb legyen",
            "a modell azonnali telepítése",
            "a jellemző standardizálása"
          ],
          answer: 0,
          hint: "Gyanúsan jó eredmény + egy domináns jellemző = ?",
          explain: "Ez a szivárgás két klasszikus gyanújele. Az illeték az adásvétel után keletkezik és az ár átszámítása – törölni kell. A skálázás nem old meg semmit."
        },
        {
          type: "match",
          q: "Párosítsd a hibát a teendővel!",
          pairs: [
            ["„gáz”, „Gáz”, „gáz ” ugyanarra", "egységesítés (kisbetű, szóközvágás)"],
            ["egy sor kétszer szerepel", "duplikátumszűrés a felosztás előtt"],
            ["650 m² egy 3 szobás lakásnál", "kiugróérték-vizsgálat, elírás javítása"],
            ["a fűtés szóval van megadva", "one-hot kódolás"],
            ["az illeték az ár 4%-a", "a szivárgó oszlop törlése"]
          ],
          hint: "Melyik szakasz eszköze kell az egyes hibákhoz?",
          explain: "Írásmód → egységesítés (4.2); duplikátum → szűrés (4.2, 4.7); elírás → IQR-szabály és javítás (4.2); nominális kategória → one-hot (4.3); a címke átszámítása → törlés (4.7)."
        },
        {
          type: "single", shuffle: true,
          q: R`Egy modell $\log_{10}$(ár)-at jósol: 1,9. Mennyi a becsült ár?`,
          options: ["kb. 79,4 M Ft", "1,9 M Ft", "19 M Ft", "kb. 6,69 M Ft"],
          answer: 0,
          hint: "Vissza kell alakítani a logaritmusból.",
          explain: R`$10^{1{,}9} \approx 79{,}4$. A 19 a $10\cdot1{,}9$, a 6,69 az $e^{1{,}9}$ (rossz alap).`
        },
        {
          type: "single", shuffle: true,
          q: R`Célváltozó-alapú kódolás: egy kategóriának 1 mintája van (címke 100), a teljes átlag 50, $m = 4$. Mennyi a simított kód?`,
          options: ["60", "100", "50", "75"],
          answer: 0,
          hint: R`$\dfrac{n\cdot\bar y_c + m\cdot\bar y}{n + m}$, $n = 1$.`,
          explain: R`$(100 + 4\cdot50)/5 = 60$. A 100 a simítatlan kód, az 50 a teljes átlag, a 75 a kettő sima átlaga ($m = 1$).`
        },
        {
          type: "single", shuffle: true,
          q: "Egy adatkészletben 300 minta és 2000 jellemző van. Melyik modell szenved a legjobban a dimenzió átkától?",
          options: ["legközelebbi szomszéd", "döntési fa", "a konstans (átlag) modell", "egyik sem, a jellemzők száma mindegy"],
          answer: 0,
          hint: "Melyik épít a pontok közti távolságra?",
          explain: "Sok dimenzióban a távolságok kiegyenlítődnek, így a legközelebbi szomszéd szinte véletlen. A fa egyenként vág jellemzők mentén, a konstans modell nem is néz jellemzőt."
        },
        {
          type: "single", shuffle: true,
          q: "Melyik a jó kódolás egy „emelet: földszint / alacsony / magas / legfelső” változóra, ha a földszint és a legfelső emelet is olcsóbb, a közepes drágább?",
          options: [
            "one-hot kódolás: minden kategória saját súlyt kap",
            "címkekódolás 0, 1, 2, 3 sorrendben",
            "standardizálás",
            "log-transzformáció"
          ],
          answer: 0,
          hint: "Monoton-e a hatás? Egy súly tud-e fel-, aztán lefelé menni?",
          explain: "A hatás nem monoton (fel, majd le), ezt egyetlen súly egyenlő lépcsőkkel nem tudja követni. One-hot kódolással minden kategória külön hatást kap. Kategóriát standardizálni vagy logaritmálni értelmetlen."
        }
      ]
    }
  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
