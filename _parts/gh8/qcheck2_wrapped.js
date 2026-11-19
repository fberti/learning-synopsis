(function(){const R=String.raw; const Q={
    /* ------------------------------------------------ 8.5 */
    "gh8-85": {
      title: "Kvíz – 8.5 Címketerjesztés és spektrális kettévágás",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Súlyozott címketerjesztés. Egy csúcs saját címkéje $c$. A szomszédai címkéje és az élsúlyok: $a$ (2), $b$ (1), $b$ (1), $b$ (1). Milyen címkét vesz fel?`,
          options: [R`$b$`, R`$a$`, R`$c$`, R`véletlenül $a$-t vagy $b$-t`],
          answer: 0,
          hint: R`Súlyozott változatban mi „szavaz”: a szomszédok száma, a legnagyobb egyedi súly, vagy a címkénkénti súlyösszeg?`,
          explain: R`Súlyozva a címkénkénti súlyösszeg dönt: $a$-ra $2$, $b$-re $1 + 1 + 1 = 3$. A $b$ nyer. Az $a$ az, aki a legerősebb egyedi élt nézi – de egy él nem „ér többet” a súlyánál. A $c$-t csak akkor tartaná meg, ha a saját címkéje is a legjobbak közt lenne; itt egyetlen szomszéd sem $c$. Holtverseny sincs ($3 \gt 2$), így véletlen választásra sincs szükség.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két háromszögön (élek 12, 13, 23, 34, 45, 46, 56) a címkék a 3. lépés után: $b, b, b, d, e, f$ (az 1–6 csúcson). Most a 4-es frissít. Mekkora eséllyel veszi fel a $b$ címkét?`,
          options: [R`$1/3$`, R`$1/2$`, R`$0$`, R`$1$`],
          answer: 0,
          hint: R`Sorold fel a 4-es szomszédainak címkéit! Hány címke holtversenyes, és benne van-e köztük a 4-es saját címkéje ($d$)?`,
          explain: R`A 4-es szomszédai: 3 ($b$), 5 ($e$), 6 ($f$) – hármas holtverseny, mindhárom címke egy szavazattal. A saját $d$ címkéje nincs köztük, ezért egyenlő eséllyel választ: $1/3$. Az $1/2$ két jelöltet lát (pl. elfelejti a 6-ost). A $0$ azt hiszi, hogy a 4-es megtartja a saját címkéjét – de az csak akkor jár, ha a saját is a legjobbak közt van. Az $1$ abból jön, hogy „a $b$ a nagyobb háromszög címkéje” – a szavazás viszont csak a közvetlen szomszédokat nézi. Ezen az $1/3$-on múlik, hogy a $b$ átcsúszik-e a másik háromszögbe: a fejezet szerint 1000 futásból 41-szer egyetlen közösség lett.`
        },
        {
          type: "multi",
          q: "Melyik állítás igaz a címketerjesztésre? (Több jó válasz is lehet.)",
          options: [
            R`Ugyanazon a gráfon két futás eltérő felbontást adhat, mert a sorrend és a holtversenyek véletlenek.`,
            R`Aszinkron (egyenként, véletlen sorrendben) frissítünk, mert szinkron frissítésnél egy páros gráfon a címkék örökké oda-vissza válthatnak.`,
            R`Nincs célfüggvénye és nincs paramétere; egy kör nagyjából $O(m)$ művelet.`,
            R`A végeredménye a modularitás maximuma, ezért egy futás elég.`,
            R`Sűrű hálózatban sem fordulhat elő, hogy egyetlen címke mindent eláraszt.`
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a karateklub 100 futására: hányféle közösségszám jött ki? És mi történik egy csillagon, ha mindenki egyszerre frissít?`,
          explain: R`Az első három igaz. A karateklubon 100 futás 1–6 közösséget adott: a kimenet a véletlen sorrendtől és a holtversenyek döntéseitől függ. Szinkron frissítésnél egy csillag középpontja és levelei minden lépésben „helyet cserélnek” – ezért frissítünk egyenként. A módszer nem optimalizál semmit: nincs célfüggvény, így a modularitás maximumát sem garantálja – a negyedik állítás hamis, és egy futás eredményét közölni a tipikus hiba. Az utolsó is hamis: épp sűrű hálózatban fordul elő, hogy egy címke mindent elönt (a karateklubon néha 1 közösség jött ki).`
        },
        {
          type: "match",
          q: R`A két háromszögben ($m = 7$, fokszámok $2, 2, 3, 3, 2, 2$) párosítsd a modularitásmátrix elemeit, $B_{ij} = A_{ij} - k_i k_j/2m$, az értékükkel!`,
          pairs: [
            [R`$B_{12}$ (él, két 2-es fokú csúcs)`, "≈ 0,714"],
            [R`$B_{34}$ (a híd)`, "≈ 0,357"],
            [R`$B_{15}$ (nem él)`, "≈ −0,286"],
            [R`$B_{14}$ (nem él)`, "≈ −0,429"],
            [R`$B_{33}$ (átló)`, "≈ −0,643"]
          ],
          hint: R`$2m = 14$. Az élnél $A_{ij} = 1$, különben 0 (az átlón is). Utána csak a $k_i k_j/14$ kell.`,
          explain: R`$B_{12} = 1 - 4/14 \approx 0{,}714$; $B_{34} = 1 - 9/14 \approx 0{,}357$ – a híd két nagyobb fokszámú csúcsot köt, ezért kevésbé „meglepő” él; $B_{15} = 0 - 4/14 \approx -0{,}286$; $B_{14} = 0 - 6/14 \approx -0{,}429$; $B_{33} = 0 - 9/14 \approx -0{,}643$. A hiányzó élek negatívak: a nullmodell várna ott valamennyi élt. Gyakori hiba a nevezőben $m$-et írni $2m$ helyett – akkor minden várható érték kétszer akkora lenne.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két háromszögben az $\mathbf s = (1, 1, 1, -1, -1, -1)$ vektorra $\mathbf s^\top B\,\mathbf s = 10$. Mennyi ennek a kettévágásnak a modularitása?`,
          options: [R`$\approx 0{,}357$`, R`$\approx 0{,}714$`, R`$\approx 1{,}429$`, R`$\approx 0{,}179$`],
          answer: 0,
          hint: R`Két csoportra $Q = \tfrac{1}{c\,m}\,\mathbf s^\top B\,\mathbf s$. Mennyi a $c$? Gondolj arra, hogy $\delta(c_i, c_j) = (1 + s_i s_j)/2$.`,
          explain: R`$Q = \mathbf s^\top B\,\mathbf s/4m = 10/28 \approx 0{,}357$ – ugyanaz, mint kézzel a 8.3-ban. A $4m$ abból jön, hogy a páros alak $\tfrac{1}{2m}$-es előtagjához még a $\delta = (1 + s_i s_j)/2$ feles szorzója is hozzájön (az $1$-es tag kiesik, mert $\sum_{ij} B_{ij} = 0$). A $0{,}714 = 10/14$ a $2m$-mel oszt (a fél elmarad), az $1{,}429 = 10/7$ csak $m$-mel – ez már 1 fölött van, ami modularitásra lehetetlen. A $0{,}179 = 10/56$ egyszer túl sokat felez.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a spektrális kettévágásra? (Több jó válasz is lehet.)`,
          options: [
            R`A Laplace-mátrixnál a második legkisebb sajátértékhez tartozó vektor (a Fiedler-vektor) előjele vág.`,
            R`A modularitásmátrixnál a legnagyobb sajátértékhez tartozó sajátvektor előjele vág.`,
            R`Ha a $B$ legnagyobb sajátértéke 0 (mint a 4 csúcsú négyzetnél), a gráfot nem érdemes kettévágni.`,
            R`A Fiedler-vektor jelzi, ha nincs két csoport: ilyenkor nem ad vágást.`,
            R`A spektrális klaszterezés a csoportok számát ($k$) magától meghatározza.`
          ],
          answer: [0, 1, 2],
          hint: R`Melyik mátrixnál a konstans vektor a legkisebb, melyiknél a 0 sajátértékű? És ki adja meg a $k$-t az sklearn SpectralClustering-ben?`,
          explain: R`Az első három igaz. A Laplace legkisebb sajátértéke 0 (konstans vektor), ezért a második legkisebb kell; a modularitásmátrix $\mathbf s^\top B\mathbf s$-t maximalizálunk, ehhez a legnagyobb sajátérték tartozik – a kettőt felcserélni tipikus hiba. A négyzetnél $B = A - \tfrac12 J$ sajátértékei $0, 0, 0, -2$: nincs pozitív, nincs értelmes vágás. A negyedik hamis: a Fiedler-vektor <b>mindig</b> két részt ad, akkor is, ha nincs két csoport – a modularitásmátrix legalább jelez. Az ötödik is hamis: a $k$-t neked kell megadni.`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklubon a Fiedler-vektor 32, a modularitásmátrix vezető sajátvektora 33 tagot sorol a valódi táborába. Ki(k) van(nak) „rossz” oldalon a modularitásmátrix vágásánál?`,
          options: [R`csak a 9-es`, R`a 3-as és a 9-es`, R`a 9-es és a 10-es`, R`senki – a vágás pontosan a kettéválás`],
          answer: 0,
          hint: R`33/34 találat hány tévedést jelent? És kinek a története „mond ellent” a szerkezetnek a 8.1 szerint?`,
          explain: R`33/34 egyetlen tévedés: a 9-es, aki a barátai többsége ellenére (a közelgő fekete öves vizsgája miatt) az edzővel tartott. A „3-as és 9-es” a Fiedler-vágás (és a Girvan–Newman első kettéesése) – 32/34. A „9-es és 10-es” a Louvain $\gamma = 0{,}5$-nél. A „senki” nem lehet, hiszen 33, nem 34 a találat. A modularitásmátrix vágásának $Q$-ja kb. $0{,}37$, a valódi kettéválásé $0{,}358$ – a szerkezet szerint a 9-es tényleg az elnök oldalára illik.`
        }
      ]
    },

    /* ------------------------------------------------ 8.6 */
    "gh8-86": {
      title: "Kvíz – 8.6 Sztochasztikus blokkmodell",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Három 6 csúcsú blokk; blokkon belül $p_{\text{be}} = 0{,}5$, minden blokkpár között $p_{\text{ki}} = 0{,}1$. Hány él várható összesen?`,
          options: [R`$33{,}3$`, R`$64{,}8$`, R`$55{,}8$`, R`$27{,}9$`],
          answer: 0,
          hint: R`Hány csúcspár van egy blokkon belül, és hány két blokk között? Hány blokk és hány blokkpár van?`,
          explain: R`Egy blokkban $\binom62 = 15$ pár: $0{,}5 \cdot 15 = 7{,}5$ él; egy blokkpár között $6 \cdot 6 = 36$ pár: $0{,}1 \cdot 36 = 3{,}6$ él. Összesen $3 \cdot 7{,}5 + 3 \cdot 3{,}6 = 22{,}5 + 10{,}8 = 33{,}3$. A $64{,}8$ belül $n_r^2 = 36$ párral számol, az $55{,}8$ $n_r(n_r - 1) = 30$-cal – ez minden belső párt kétszer vesz. A $27{,}9$ fordítva hibázik: a blokkok közötti párokat felezi, pedig ott nincs dupla számolás ($n_r n_s$).`
        },
        {
          type: "match",
          q: R`Párosítsd a kétblokkos blokkmátrixot a szerkezettípussal!`,
          pairs: [
            [R`$p_{11} = 0{,}6$, $p_{12} = 0{,}05$, $p_{22} = 0{,}5$`, "asszortatív (klasszikus közösségek)"],
            [R`$p_{11} = 0{,}03$, $p_{12} = 0{,}5$, $p_{22} = 0{,}02$`, "kétrészes (diszasszortatív)"],
            [R`$p_{11} = 0{,}8$, $p_{12} = 0{,}3$, $p_{22} = 0{,}01$`, "mag–periféria"],
            [R`$p_{11} = p_{12} = p_{22} = 0{,}1$`, "Erdős–Rényi-gráf (nincs szerkezet)"]
          ],
          hint: R`Hasonlítsd össze a blokkon belüli és a blokkok közötti valószínűségeket! Mag–perifériánál három szint van: mag–mag, mag–periféria, periféria–periféria.`,
          explain: R`Asszortatív: $p_{\text{be}} \gt p_{\text{ki}}$ mindkét blokkra – a modularitás és az SBM is megtalálja. Kétrészes: a blokkok között sokkal valószínűbb az él ($p_{\text{ki}} \gt p_{\text{be}}$), mint a vásárló–termék hálózatban. Mag–periféria: $p_{11} \gt p_{12} \gt p_{22}$ – az 1-es blokk a mag. Ha minden $p$ egyenlő, a blokkoknak nincs szerepük: $G(n, p)$. Az utolsó kettőt a modularitás nem látja – ezért mondjuk, hogy az SBM blokkjai nem mindig „sűrű csomók”.`
        },
        {
          type: "single", shuffle: true,
          q: R`A $K_{2,3}$ teljes páros gráfot (2 + 3 csúcs, 6 él) a két oldala szerint bontod két csoportra. Mennyi a modularitás?`,
          options: [R`$-0{,}5$`, R`$0$`, R`$-0{,}25$`, R`$-2$`],
          answer: 0,
          hint: R`Hány belső éle van az egyes oldalaknak? Mennyi a két oldal fokszámösszege, és mennyi $2m$?`,
          explain: R`$m = 6$. Belső él egyik oldalon sincs; a fokszámösszeg mindkét oldalon $6$ (minden él egyik vége ide, a másik oda esik). $Q = 2 \cdot \big(0 - (6/12)^2\big) = -0{,}5$ – a lehető legrosszabb érték. A $-0{,}25$ csak az egyik oldalt számolja, a $0$ az „egy csoport” értéke, a $-2$ a $d_c/m$ hibával jön ($-(6/6)^2 - (6/6)^2$) – és $Q \ge -1/2$ miatt eleve lehetetlen. Az SBM-nek viszont ez tökéletes illeszkedés: $p_{\text{be}} = 0$, $p_{\text{ki}} = 1$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két blokk között 3 él fut, a lehetséges párok száma 12. Mennyi ennek a blokkpárnak a hozzájárulása a log-likelihoodhoz ($\hat p_{rs}$ = megfigyelt arány)?`,
          options: [R`$\approx -6{,}75$`, R`$\approx -4{,}16$`, R`$\approx -13{,}34$`, R`$\approx -2{,}93$`],
          answer: 0,
          hint: R`Előbb $\hat p = e_{rs}/N_{rs}$. Utána minden él $\ln\hat p$-t, minden nem-él $\ln(1 - \hat p)$-t ad – hány nem-él van?`,
          explain: R`$\hat p = 3/12 = 0{,}25$. A 3 él $3\ln 0{,}25 \approx -4{,}16$, a 9 nem-él $9\ln 0{,}75 \approx -2{,}59$; összesen $\approx -6{,}75$. A $-4{,}16$ elfelejti a nem-éleket – pedig azok is „megfigyelések”. A $-13{,}34$ felcseréli a két logaritmust ($3\ln 0{,}75 + 9\ln 0{,}25$). A $-2{,}93$ tízes alapú logaritmussal számol – a log-likelihood természetes logaritmus.`
        },
        {
          type: "single", shuffle: true,
          q: R`A két háromszögön (élek 12, 13, 23, 34, 45, 46, 56) egy kutató a legnagyobb log-likelihoodú blokkbeosztást választja, a blokkok számát nem rögzítve. Melyiket kapja?`,
          options: [
            R`mindenki külön blokkban ($\ln\mathcal L = 0$)`,
            R`$\{1, 2, 3\}$, $\{4, 5, 6\}$ ($\ln\mathcal L \approx -3{,}14$)`,
            R`egy blokk ($\ln\mathcal L \approx -10{,}36$)`,
            R`$\{1, 2\}$, $\{3, 4, 5, 6\}$ ($\ln\mathcal L \approx -8{,}32$)`
          ],
          answer: 0,
          hint: R`Mi történik a $\hat p$ értékekkel, ha minden blokkpárban egyetlen csúcspár van?`,
          explain: R`A „mindenki külön” minden párnak saját paramétert ad: $\hat p$ 0 vagy 1, minden tag $\ln 1 = 0$, így $\ln\mathcal L = 0$ – ez a legnagyobb lehetséges érték. Ez túlillesztés: a modell semmit sem tömörít. A természetes $\{1, 2, 3\}$, $\{4, 5, 6\}$ ($-3{,}14$) sokkal jobb az egy blokknál ($-10{,}36$) és a $\{1, 2\}$, $\{3, 4, 5, 6\}$-nál ($-8{,}32$), de csak rögzített blokkszám vagy büntetés (MDL / bayesi módszer) mellett nyer. A tipikus hiba azt hinni, hogy a legjobb likelihood = a legjobb felbontás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két egyforma blokk, ritka gráf, $\langle k\rangle = 4$. A kimutathatósági határon ($|c_{\text{be}} - c_{\text{ki}}| = 2\sqrt{\langle k\rangle}$, $\langle k\rangle = (c_{\text{be}} + c_{\text{ki}})/2$) mennyi a $c_{\text{be}}$ és a $c_{\text{ki}}$?`,
          options: [
            R`$c_{\text{be}} = 6$, $c_{\text{ki}} = 2$`,
            R`$c_{\text{be}} = 5$, $c_{\text{ki}} = 3$`,
            R`$c_{\text{be}} = 8$, $c_{\text{ki}} = 0$`,
            R`$c_{\text{be}} \approx 6{,}83$, $c_{\text{ki}} \approx 1{,}17$`
          ],
          answer: 0,
          hint: R`Két egyenleted van: az összeg $2\langle k\rangle$, a különbség $2\sqrt{\langle k\rangle}$. Oldd meg!`,
          explain: R`$c_{\text{be}} + c_{\text{ki}} = 8$ és $c_{\text{be}} - c_{\text{ki}} = 2\sqrt4 = 4$, így $c_{\text{be}} = 6$, $c_{\text{ki}} = 2$ (arány $1/3$). Ha $p_{\text{ki}}/p_{\text{be}} \gt 1/3$, semmilyen módszer nem talál jobban a véletlennél. Az $5$ / $3$ a 2-es szorzót hagyja el ($\sqrt{\langle k\rangle}$), a $8$ / $0$ a gyökvonást ($2\langle k\rangle$), a $6{,}83$ / $1{,}17$ az összeget veszi $\langle k\rangle$-nak ($2\sqrt8$). Figyeld meg: a határon a blokkok még jól láthatóan különböznek ($6$ vs. $2$), mégis kimutathatatlanok.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz az SBM-re és változataira? (Több jó válasz is lehet.)`,
          options: [
            R`Egyetlen blokkal ($B = 1$) az SBM éppen a $G(n, p)$.`,
            R`A sima SBM a karateklubon a hubokat (1, 33, 34) teszi egy blokkba; a fokszám-korrigált változat a két tábort találja meg.`,
            R`A $Q_\gamma$ maximalizálása egy speciális fokszám-korrigált SBM likelihoodjának maximalizálásával egyenértékű (Newman, 2016).`,
            R`Az SBM blokkjai mindig sűrű csomók: $p_{\text{be}} \gt p_{\text{ki}}$ kötelező.`,
            R`Mivel a több blokk mindig jobb likelihoodot ad, a blokkszámot a likelihood maximuma alapján érdemes választani.`
          ],
          answer: [0, 1, 2],
          hint: R`Mit jelent a „fokszám-korrigált”: mit ad meg minden csúcsnak külön? És mit csinál a likelihood, ha a blokkok száma nő?`,
          explain: R`Az első három igaz. $B = 1$-nél minden pár ugyanazzal a $p$-vel kapcsolódik: Erdős–Rényi. A sima SBM-ben egy blokkon belül mindenki várható fokszáma azonos, ezért erősen eltérő fokszámoknál a blokkok a fokszámot követik; a fokszám-korrigált változat minden csúcsnak saját „aktivitást” ad. A modularitás így egy rejtett, nagyon egyszerű generatív modell. A negyedik hamis: a blokkmátrix bármilyen lehet (mag–periféria, kétrészes). Az ötödik is hamis: a likelihood maximuma mindig a „mindenki külön” – túlillesztés; büntetés (MDL / bayesi) vagy rögzített $B$ kell.`
        }
      ]
    },

    /* ------------------------------------------------ 8.7 */
    "gh8-87": {
      title: "Kvíz – 8.7 Megbízhatóság: összevetés, stabilitás, nullmodell",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hat csúcs; A = $\{1, 2, 3\}$ · $\{4, 5, 6\}$, B = $\{1, 2, 3\}$ · $\{4\}$ · $\{5, 6\}$. Mennyi a Rand-index (az egyetértő csúcspárok aránya)?`,
          options: [R`$13/15 \approx 0{,}87$`, R`$4/15 \approx 0{,}27$`, R`$9/15 = 0{,}6$`, R`$11/15 \approx 0{,}73$`],
          answer: 0,
          hint: R`15 pár van. Egyetértés az is, ha mindkét felbontás egy csoportba teszi a párt, és az is, ha mindkettő külön. Hány pár „vitás”?`,
          explain: R`Vitás csak a $(4, 5)$ és a $(4, 6)$: A-ban együtt, B-ben külön. A többi 13 pár egyetért: 4 mindkettőben együtt ($(1, 2)$, $(1, 3)$, $(2, 3)$, $(5, 6)$), 9 mindkettőben külön. Rand $= 13/15 \approx 0{,}87$. A $4/15$ csak az „együtt” egyetértéseket számolja, a $9/15$ csak a „külön” egyetértéseket. A $11/15$ a vitás párokat kétszer vonja le. A magas Rand-index ne tévesszen meg: a legtöbb pár „külön” egyetértés, ami a véletlenben is gyakori.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanerre a párra (A = $\{1, 2, 3\}$ · $\{4, 5, 6\}$, B = $\{1, 2, 3\}$ · $\{4\}$ · $\{5, 6\}$) mennyi az ARI?`,
          options: [R`$\approx 0{,}71$`, R`$\approx 0{,}87$`, R`$\approx 0{,}48$`, R`$0{,}8$`],
          answer: 0,
          hint: R`Kell: a megfigyelt „együtt” párok száma $\sum\binom{n_{ij}}{2}$, a várható $\sum\binom{a_i}{2}\sum\binom{b_j}{2}/\binom n2$, és a legnagyobb $\tfrac12\big[\sum\binom{a_i}{2} + \sum\binom{b_j}{2}\big]$.`,
          explain: R`Közös csoportok: $\{1, 2, 3\}$ (3), $\{4\}$ (1), $\{5, 6\}$ (2): megfigyelt $3 + 0 + 1 = 4$. $\sum\binom{a_i}{2} = 3 + 3 = 6$, $\sum\binom{b_j}{2} = 3 + 0 + 1 = 4$; várható $6 \cdot 4/15 = 1{,}6$; legnagyobb $(6 + 4)/2 = 5$. $\mathrm{ARI} = (4 - 1{,}6)/(5 - 1{,}6) = 2{,}4/3{,}4 \approx 0{,}71$. A $0{,}87$ a korrigálatlan Rand-index. A $0{,}48 = 2{,}4/5$ a nevezőből elfelejti levonni a várhatót, a $0{,}8 = 4/5$ semmilyen korrekciót nem végez.`
        },
        {
          type: "single", shuffle: true,
          q: R`Két algoritmus címkéi a hat csúcson: X = (0, 0, 0, 1, 1, 1), Y = (1, 1, 1, 0, 0, 0). Mennyi a címkék szerinti „pontosság”, az NMI és az ARI?`,
          options: [
            R`pontosság $0$; NMI $1$; ARI $1$`,
            R`pontosság $0$; NMI $0$; ARI $0$`,
            R`pontosság $1$; NMI $1$; ARI $1$`,
            R`pontosság $0$; NMI $1$; ARI $0$`
          ],
          answer: 0,
          hint: R`Ugyanazt a felbontást írja le a két címkézés? Melyik mérőszám címkefüggetlen?`,
          explain: R`A két címkézés ugyanazt a felbontást adja ($\{1, 2, 3\}$ · $\{4, 5, 6\}$), csak a csoportok sorszáma fordított. A címkék szerinti pontosság mégis 0 – minden csúcs „rossz” címkét kapott. Az NMI és az ARI címkefüggetlen: mindkettő 1. Ezért kell felbontások összevetésére NMI vagy ARI, és nem „pontosság”. Az ARI nem viselkedik másképp az átszámozásnál, mint az NMI – mindkettő csak a csoportokat nézi.`
        },
        {
          type: "match",
          q: R`Párosítsd a mérőszámot az értékével! Az A felbontás $\{1, 2, 3\}$ · $\{4, 5, 6\}$.`,
          pairs: [
            [R`Rand-index: A vs. „mindenki külön”`, "0,6"],
            [R`ARI: A vs. „mindenki külön”`, "0"],
            [R`NMI: A vs. „mindenki külön”`, "≈ 0,56"],
            [R`NMI: A vs. A átszámozva`, "1"],
            [R`NMI: A vs. $\{1, 2\}$ · $\{3, 4, 5, 6\}$`, "≈ 0,48"]
          ],
          hint: R`A „mindenki külön” egyetlen párt sem tesz együvé. Melyik mérőszám korrigál a véletlenre, és melyik „jutalmazza” a sok kis csoportot?`,
          explain: R`A „mindenki külön” az A 9 „külön” párjával egyetért, a 6 „együtt” párjával nem: Rand $9/15 = 0{,}6$ – pedig semmit sem talált el. Az ARI ezt korrigálja: $0$, a véletlen szintje. Az NMI viszont $\approx 0{,}56$: a sok kis csoport „sok információt” hordoz, ezért sok csoportnál az NMI félrevezető – ilyenkor az ARI megbízhatóbb. Az átszámozás semmit sem változtat (1). Egyetlen csúcs átcsúszása hat csúcson már nagy változás: NMI $\approx 0{,}48$ (az ARI ugyanitt $\approx 0{,}32$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Négy futás egy 4 csúcsú gráfon: $\{1, 2\}$ · $\{3, 4\}$; $\{1, 2, 3\}$ · $\{4\}$; $\{1, 2\}$ · $\{3, 4\}$; $\{1, 2, 3, 4\}$. Mennyi az együttes besorolási mátrix $C_{13}$ és $C_{34}$ eleme?`,
          options: [
            R`$C_{13} = 0{,}5$, $C_{34} = 0{,}75$`,
            R`$C_{13} = 2$, $C_{34} = 3$`,
            R`$C_{13} = 0{,}25$, $C_{34} = 0{,}5$`,
            R`$C_{13} = 0{,}75$, $C_{34} = 0{,}5$`
          ],
          answer: 0,
          hint: R`$C_{ij}$ azoknak a futásoknak az <b>aránya</b>, amelyekben $i$ és $j$ egy közösségben van. Ne felejtsd el az „egy csoport” futást sem!`,
          explain: R`Az 1 és a 3 a 2. és a 4. futásban van együtt: $C_{13} = 2/4 = 0{,}5$. A 3 és a 4 az 1., 3. és 4. futásban: $C_{34} = 3/4 = 0{,}75$. A „2 és 3” a darabszám, nem az arány. A $0{,}25$ / $0{,}5$ kihagyja a 4. futást (ahol mindenki együtt van – az is együttes besorolás). A $0{,}75$ / $0{,}5$ összekeveri a két párt. A 3-as csúcs határcsúcs: hol az 1–2-vel, hol a 4-essel van – rá nem érdemes építeni ($C_{12} = 1$ viszont stabil).`
        },
        {
          type: "single", shuffle: true,
          q: R`A karateklub Louvain-$Q$-ja $0{,}420$. 200 véletlen $G(34, 78)$ gráf legjobb $Q$-ja: $0{,}354 \pm 0{,}019$. Mennyi a $z$-érték?`,
          options: [R`$\approx 3{,}5$`, R`$\approx 22$`, R`$\approx 0{,}066$`, R`$\approx 7{,}9$`],
          answer: 0,
          hint: R`$z = (\text{megfigyelt} - \text{null átlag})/\text{null szórás}$.`,
          explain: R`$z = (0{,}420 - 0{,}354)/0{,}019 \approx 3{,}5$ – van szerkezet, de a $Q$ önmagában sokkal kevésbé kiugró, mint gondolnánk. A $22 \approx 0{,}420/0{,}019$ a 0-hoz méri a $Q$-t, nem a nullmodellhez – épp ez a hiba, amitől a szakasz óv: egy véletlen gráf is 0,35 körüli $Q$-t ad. A $0{,}066$ csak a különbség, szórással nem osztva. A $7{,}9$ a fokszámtartó nullmodellhez tartozik ($0{,}298 \pm 0{,}015$) – az egy másik mérce.`
        },
        {
          type: "multi",
          q: "Melyik gyakorlat helyes egy közösségfelbontás közlésekor? (Több jó válasz is lehet.)",
          options: [
            R`A nullmodell legjobb $Q$-ját ugyanazzal az algoritmussal (és ugyanannyi futással) keresni, mint a valódi gráfét.`,
            R`Sok nullmodell-sorsolást használni (átlag, szórás, empirikus p), nem egyetlen véletlen gráfot.`,
            R`Több futást végezni, és közölni, mennyire egyeznek (NMI / ARI, konszenzus).`,
            R`$Q = 0{,}4$ fölött nullmodell nélkül is kijelenteni, hogy erős a közösségszerkezet.`,
            R`A nullmodell $Q$-ját egy gyorsabb, egyszerűbb algoritmussal keresni, hogy a sok sorsolás ne tartson sokáig.`
          ],
          answer: [0, 1, 2],
          hint: R`„Egy közösségfelbontás hipotézis, nem eredmény.” Mitől lesz két $Q$ összemérhető?`,
          explain: R`Az első három a szakasz minimuma. A negyedik hamis: egy ritka véletlen gráf is adhat ennyit – $G(34, 78)$-nál a legjobb $0{,}402$ volt, az átlag $0{,}354$, majdnem annyi, mint a karateklub valódi kettéválásáé ($0{,}358$). Az ötödik is hamis: ha a nullt gyengébb optimalizálóval keresed, annak $Q$-ja alacsonyabb lesz, és a valódi gráf „jelentősebbnek” tűnik, mint amilyen – a két szám nem összemérhető.`
        }
      ]
    },

    /* ------------------------------------------------ 8.8 */
    "gh8-88": {
      title: "Kvíz – 8.8 Alkalmazás",
      questions: [
        {
          type: "match",
          q: R`A karateklub táblázata: párosítsd a módszert azzal, hogy a valódi kettéváláshoz képest ki van „rossz” oldalon!`,
          pairs: [
            [R`Girvan–Newman, első kettéesés`, "a 3-as és a 9-es"],
            [R`modularitásmátrix (8.5)`, "csak a 9-es"],
            [R`Louvain, $\gamma = 0{,}5$`, "a 9-es és a 10-es"],
            [R`Louvain, $\gamma = 1$`, "nem két csoportot ad (4 közösség)"]
          ],
          hint: R`A pontosságok: 32/34, 33/34, 32/34 – és egy módszer, amely nem is két csoportot ad. Melyik hány csoportot talált?`,
          explain: R`A Girvan–Newman első kettéesése (15 + 19 tag) a 3-ast és a 9-est sorolja rosszul – ugyanezt adja a Fiedler-vektor is. A modularitásmátrix csak a 9-est (NMI 0,84, ARI 0,88), a Louvain $\gamma = 0{,}5$-nél a 9-est és a 10-est. A Louvain $\gamma = 1$ négy közösséget talál ($Q = 0{,}420$), a táborokon belüli köröket is szétválasztja – a kettéváláshoz mérve NMI 0,59, ARI 0,47, de ez nem „rosszabb”, csak más kérdésre felel.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az Árvízhét súlyozva ($W = 18$): $Q_\gamma(\text{két csoport}) = 0{,}778 - 0{,}5\gamma$, $Q_\gamma(\text{keretek}) = 0{,}611 - 0{,}381\gamma$. Mi a helyzet $\gamma = 1{,}5$-nél?`,
          options: [
            R`keretek $\approx 0{,}039$ > két csoport $\approx 0{,}028$`,
            R`két csoport $\approx 0{,}278$ > keretek $\approx 0{,}230$`,
            R`két csoport $\approx 0{,}417$ > keretek $\approx 0{,}345$`,
            R`mindkettő negatív, tehát a „mindenki külön” nyer`
          ],
          answer: 0,
          hint: R`Helyettesíts be: $0{,}5 \cdot 1{,}5$ és $0{,}381 \cdot 1{,}5$. Melyik egyenes csökken gyorsabban?`,
          explain: R`Két csoport: $0{,}778 - 0{,}75 = 0{,}028$; keretek: $0{,}611 - 0{,}572 \approx 0{,}039$ – a keretfelbontás nyer. A két egyenes $\gamma \approx 1{,}40$-nél metszi egymást; a kimerítő keresés szerint $1{,}40$ és $1{,}80$ között a keretfelbontás a legjobb a 877-ből, $1{,}80$ fölött a Polgármester is leválik. A $0{,}278$ / $0{,}230$ a $\gamma = 1$ értékei. A $0{,}417$ / $0{,}345$ az egész $Q$-t szorozza $1{,}5$-tel ($1{,}5 \cdot 0{,}278$ és $1{,}5 \cdot 0{,}230$) – a $\gamma$ csak a véletlen szintet szorozza, a sorrend így nem is változhatna. Mindkettő pozitív, és a $Q_\gamma$-t amúgy is a többi felbontáshoz kell mérni, nem a 0-hoz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Klikkperkoláció $k = 3$-mal az Árvízhéten (háromszögek: $\mathrm{Ko}\mathrm{Vi}\mathrm{Po}$, $\mathrm{Ko}\mathrm{Vi}\mathrm{Sz}$, $\mathrm{Ko}\mathrm{Sz}\mathrm{Kl}$, $\mathrm{Po}\mathrm{La}\text{Ön}$). Milyen közösségek jönnek ki?`,
          options: [
            R`$\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}, \mathrm{Sz}, \mathrm{Kl}\}$ és $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$`,
            R`$\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ és $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$`,
            R`egyetlen közösség mind a 7 szereplővel`,
            R`négy közösség: mind a négy háromszög külön`
          ],
          answer: 0,
          hint: R`Két háromszög akkor szomszédos, ha <b>két</b> közös csúcsuk van. Melyik háromszögpárok azok?`,
          explain: R`$\mathrm{Ko}\mathrm{Vi}\mathrm{Po}$ és $\mathrm{Ko}\mathrm{Vi}\mathrm{Sz}$ két közös csúcs ($\mathrm{Ko}$, $\mathrm{Vi}$), $\mathrm{Ko}\mathrm{Vi}\mathrm{Sz}$ és $\mathrm{Ko}\mathrm{Sz}\mathrm{Kl}$ is ($\mathrm{Ko}$, $\mathrm{Sz}$): ez a három egy lánc, közössége $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}, \mathrm{Sz}, \mathrm{Kl}\}$. A $\mathrm{Po}\mathrm{La}\text{Ön}$-nek csak egy közös csúcsa van a többivel ($\mathrm{Po}$) – az nem elég, külön közösség. A $\mathrm{Po}$ mindkettőben benne van: átfedő közösségek. A második opció a modularitás kemény felbontása (ott a $\mathrm{Po}$ csak egy helyre kerülhet). Az „egy közösség” az egy közös csúcsot is elégnek veszi, a „négy háromszög” elfelejti a láncolást.`
        },
        {
          type: "multi",
          q: R`Mit mond a fejezet a „közösség = keret” kérdésről az Árvízhéten? (Több jó válasz is lehet.)`,
          options: [
            R`Súly nélkül, $\gamma = 1$-nél a legjobb felbontás a két szál ($\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ · $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$); a keretfelbontás csak a 7.`,
            R`A keretfelbontás csak súlyozva és nagyobb nagyítással ($1{,}40 \le \gamma \le 1{,}80$) lesz a legjobb.`,
            R`A közösségkeresés keretjelölteket ad, amelyeket a szövegen kell ellenőrizni.`,
            R`Alapbeállításban a Louvain megtalálja a három keretet.`,
            R`Mivel van olyan $\gamma$, ahol a keretek nyernek, ez bizonyítja, hogy a közösségek a keretek.`
          ],
          answer: [0, 1, 2],
          hint: R`Nézd meg a „négy beállítás, négy válasz” táblázatot! És ki választotta a $\gamma$-t?`,
          explain: R`Az első három igaz. Súly nélkül a két szál nyer ($Q = 0{,}28$), a keretfelbontás ($0{,}155$) csak a 7. a 877-ből; súlyozva a 2. ($0{,}230$), és csak $1{,}40 \le \gamma \le 1{,}80$ között az első. A negyedik hamis: a Girvan–Newman, a Fiedler-vektor és a Louvain is a kétcsoportos felbontást adja alapbeállításban. Az ötödik is hamis: a $\gamma$-t mi választottuk, és tudtuk, mit keresünk – ez nem bizonyíték. Közösség ≠ keret ≠ téma.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Les Misérables súlyozott Louvain-felbontása 6 közösséget ad ($Q = 0{,}567$). Miért „nem illik” Valjean egyetlen közösségbe sem igazán?`,
          options: [
            R`Mert szinte minden szálban megjelenik (fokszáma 36, köztessége 0,57): híd, de a kemény felbontás egyetlen közösségbe kényszeríti.`,
            R`Mert kevés kapcsolata van, és a sorrend dönti el, hová kerül – tipikus instabil mellékszereplő.`,
            R`Mert a Louvain hibásan szétszakította a közösségét (ezt javítaná a Leiden).`,
            R`Mert a felbontási határ miatt az ő kis közössége beleolvadt egy nagyobba.`
          ],
          answer: 0,
          hint: R`Nézd meg a fokszámát és a köztességét! Mihez hasonlít az Árvízhéten a Polgármester helyzete?`,
          explain: R`Valjean a legnagyobb fokszámú (36) és köztességű (0,57) szereplő: szinte minden szálat összeköt, mint az Árvízhéten a Polgármester. A felbontás a főszálba teszi, de valójában híd – a kemény (nem átfedő) felbontás ezt elrejti; átfedő módszer (pl. klikkperkoláció) jobban mutatná. A második opció a Perpetue, Simplice, Magnon típusú mellékszereplőkre igaz (a 8.7 stabilitási példája), Valjeanre épp nem. A szétszakadt közösség és a felbontási határ valódi jelenségek, de nem ezt magyarázzák.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy kutató a hírkorpusza szereplőhálózatán Louvain-nal 3 közösséget talál, és „3 keretet” jelent. Melyik az, ami <b>nem</b> tartozik a fejezet szerinti közlési minimumhoz?`,
          options: [
            R`a futások közül a legnagyobb $Q$-jú felbontást közölni, a többit elhagyni`,
            R`megadni a $\gamma$-t és azt, hogy súlyozott volt-e a gráf`,
            R`több futás egyezését (NMI / ARI, konszenzus) közölni`,
            R`a $Q$-t egy nullmodell $Q$-jához mérni`,
            R`a szövegen ellenőrizni, hogy a közösségek tényleg keretek, nem csak témák vagy szereplőcsoportok`
          ],
          answer: 0,
          hint: R`A közös minimum: több módszer, több futás, a robusztusság közlése, validálás a szövegen. Melyik opció hallgatja el a robusztusságot?`,
          explain: R`A legnagyobb $Q$-jú futás önmagában nem elég: a közel azonos $Q$-jú felbontások nagyon különbözhetnek (Good, de Montjoye és Clauset, 2010), és az olvasó nem tudja, melyik csoport „biztos”. A többi mind a minimum része: paraméterek ($\gamma$, súlyok), futások egyezése, nullmodell, és végül a szöveges validálás – mert a közösség ≠ keret. Az él definíciója is döntés: együttemlítés, megszólaltatás, idézés más-más hálózatot ad.`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "gh8-final": {
      title: "Fejezetzáró teszt – 8. Közösségek keresése",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy közösség fokszámösszege $d_c = 14$, és 4 él fut ki belőle. Hány belső éle van?`,
          options: [R`$5$`, R`$10$`, R`$7$`, R`$9$`],
          answer: 0,
          hint: R`A kézfogás-lemma egy csoportra: a belső éleket hányszor, a kifelé futókat hányszor számolja a $d_c$?`,
          explain: R`$d_c = 2L_c + K_c$, így $L_c = (14 - 4)/2 = 5$. A $10$ elfelejti a felezést – a belső élek mindkét végükkel beleszámítanak a $d_c$-be. A $7 = 14/2$ a $K_c$-t hagyja ki ($d_c = 2L_c$ hiba), a $9 = (14 + 4)/2$ előjelet téveszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 15 élű gráfban egy csoportnak 6 belső éle van, fokszámösszege 12. Mennyi a többlete a véletlen szint fölött, $L_c/m - (d_c/2m)^2$?`,
          options: [R`$0{,}24$`, R`$-0{,}24$`, R`$0$`, R`$0{,}64$`],
          answer: 0,
          hint: R`Egy él egyik vége $d_c/2m$ eséllyel esik a csoportba. Mindkét végének bele kell esnie.`,
          explain: R`$6/15 - (12/30)^2 = 0{,}4 - 0{,}16 = 0{,}24$. A $-0{,}24$ a $d_c/m$ hibával jön: $(12/15)^2 = 0{,}64$ – az élvégek száma $2m$, nem $m$. A $0$ elhagyja a négyzetet ($0{,}4 - 0{,}4$), a $0{,}64$ a belső éleket kétszer számolja ($2L_c/m = 0{,}8$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Két 5 csúcsú klikket két él köt össze, különböző csúcspárok között. Mekkora egy híd köztessége, és mennyi lesz a megmaradté, ha az egyiket töröljük és újraszámolunk?`,
          options: [
            R`előtte $12{,}5$, utána $25$`,
            R`előtte $25$, utána $25$`,
            R`előtte $12{,}5$, utána $12{,}5$`,
            R`előtte $25$, utána $50$`
          ],
          answer: 0,
          hint: R`Hány csoportközi csúcspár van? A szimmetria miatt hogyan oszlanak meg a két híd között? És mi lesz, ha csak egy híd marad?`,
          explain: R`$5 \cdot 5 = 25$ csoportközi pár van; a helyzet szimmetrikus, így a két híd fele-fele arányban viszi: $12{,}5$ (a klikkeken belüli élek legfeljebb $3{,}5$-öt kapnak). Törlés után mind a 25 pár a megmaradt hídon megy: $25$. A „$12{,}5$ / $12{,}5$” az újraszámolást hagyja el – a Girvan–Newman lényege éppen az, hogy a törlés átrendezi a forgalmat. A „25 / 25” nem osztja meg a párokat a két út között, a „25 / 50” ráadásul minden párt kétszer számol ($(s, t)$ és $(t, s)$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A teljes $K_4$ gráfot ($m = 6$, minden fok 3) két párra bontod: $\{1, 2\}$ · $\{3, 4\}$. Mennyi a $Q$?`,
          options: [R`$\approx -0{,}167$`, R`$\approx -0{,}667$`, R`$\approx 0{,}333$`, R`$\approx -1{,}667$`],
          answer: 0,
          hint: R`Mindkét pár: 1 belső él, fokszámösszeg $6$. Mennyi $2m$?`,
          explain: R`$Q = 2 \cdot \big(1/6 - (6/12)^2\big) = 2 \cdot (0{,}167 - 0{,}25) \approx -0{,}167$. Negatív: egy klikkben nincs közösségszerkezet, bármely vágás a véletlen szint alá esik. A $-0{,}667$ a négyzetet hagyja el, a $0{,}333$ a véletlen szintet felejti ki (csak $\sum L_c/m$), a $-1{,}667$ a $d_c/m$ hibával jön – ez $Q \ge -1/2$ miatt eleve lehetetlen.`
        },
        {
          type: "single", shuffle: true,
          q: R`Háromszögeket fűzöl gyűrűbe. 6 háromszögnél a modularitás-maximum a háromszögeket adja, 10-nél viszont a szomszédos párokat ($0{,}650$ vs. $0{,}675$). Mi ez a jelenség?`,
          options: [
            R`felbontási határ: nagy gráfban a kis, sűrű közösségek összeolvadnak`,
            R`felbontási határ: nagy gráfban a közösségek apró darabokra esnek szét`,
            R`a Louvain mohó hibája – a pontos maximum a háromszögeket adná`,
            R`a Louvain szétszakadt közössége, amelyet a Leiden javít`
          ],
          answer: 0,
          hint: R`Két közösség összevonása akkor éri meg, ha $\ell_{12} \gt d_1 d_2/2m$. Mi történik a jobb oldallal, ha $m$ nő?`,
          explain: R`A véletlen szint nevezőjében $2m$ áll: ha a gráf nő, a két háromszög közti egyetlen él „meglepővé” válik ($1 \gt 8 \cdot 8/2m$, ha $2m \gt 64$, vagyis 8-nál több háromszög), és az összevonás növeli $Q$-t. Az irány: összeolvadás, nem szétesés – ez a tipikus tévesztés. Ez nem algoritmushiba: a párok $Q$-ja ($0{,}675$) ténylegesen nagyobb, mint a külön háromszögeké ($0{,}650$) – a modularitás maga ilyen. A Leiden a szétszakadt közösségeket javítja, a felbontási határt nem – arra a $\gamma$ való (a gyűrűn $\gamma \gt 1{,}25$-nél maradnak külön a háromszögek).`
        },
        {
          type: "single", shuffle: true,
          q: R`Louvain, $m = 10$. Az $i$ csúcs fokszáma 3, egyedül áll, és 2 éle fut a $C$ közösségbe, amelynek fokszámösszege $\Sigma_C = 8$. Mennyi a $\Delta Q$, ha $i$ átlép $C$-be?`,
          options: [R`$0{,}08$`, R`$0{,}035$`, R`$-0{,}04$`, R`$0{,}16$`],
          answer: 0,
          hint: R`$\Delta Q = k_{i,C}/m - \Sigma_C k_i/2m^2$. Vigyázz a nevezőre: $2m^2 = 200$.`,
          explain: R`$2/10 - 8 \cdot 3/200 = 0{,}2 - 0{,}12 = 0{,}08$. A $0{,}035$ a $\Sigma_C$-be az $i$ saját fokszámát is beleszámolja ($11$) – ez a „ki nem vett csúcs” hibája. A $-0{,}04$ a nevezőben $m^2$-et ír $2m^2$ helyett, a $0{,}16$ elfelejti a $k_i$-vel szorozni a véletlen tagot.`
        },
        {
          type: "single", shuffle: true,
          q: R`A Louvain felbontási paraméterrel: $Q_\gamma = \sum_c\big[L_c/m - \gamma(d_c/2m)^2\big]$. Mi történik, ha a $\gamma$-t növeled?`,
          options: [
            R`több, kisebb közösség lesz – a véletlen szint „drágább”`,
            R`kevesebb, nagyobb közösség lesz`,
            R`a felbontás nem változik, csak a $Q_\gamma$ értéke`,
            R`a közösségek garantáltan összefüggők lesznek`
          ],
          answer: 0,
          hint: R`Az összevonás feltétele $\ell_{12} \gt \gamma\,d_1 d_2/2m$. Könnyebb vagy nehezebb ezt teljesíteni nagyobb $\gamma$-val?`,
          explain: R`Nagyobb $\gamma$-val a véletlen tag nagyobb súlyt kap, az összevonás feltétele szigorúbb: csak a nagyon sűrű, kis csoportok érik meg – több, kisebb közösség. A karateklubon $\gamma = 0{,}5$: 2, $\gamma = 1$: 4, $\gamma = 2$: 7 közösség. A második opció az irányt fordítja meg; $\gamma = 0$-nál a „mindenki egy csoportban” nyer. Az összefüggőséget nem a $\gamma$, hanem a Leiden finomító lépése garantálja.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit javít a Leiden-algoritmus a Louvainhoz képest?`,
          options: [
            R`Egy finomító lépéssel garantálja, hogy minden közösség összefüggő (jól összekötött) legyen.`,
            R`Megszünteti a felbontási határt, ezért a felbontása a „valódi” közösségeket adja.`,
            R`Mindig nagyobb $Q$-t ad, mint a Louvain.`,
            R`Nem függ a sorrendtől és a $\gamma$-tól, ezért elég egyszer futtatni.`
          ],
          answer: 0,
          hint: R`Gondolj a $\mathrm h$ csúcs példájára: mi történt az első közösséggel, amikor a $\mathrm h$ átvándorolt?`,
          explain: R`A Louvain szétszakadt közösségeket is visszaadhat: ha az összetartó csúcs átvándorol, a régi közösség két szigetre esik, de már egyetlen szuperpontként kezeli. A Leiden a két fázis közé finomítást iktat, és csak a jól összekötött részeket vonja össze – így minden közösség összefüggő. A többi tévhit: a felbontási határ, a $\gamma$-függés és a sok közel optimális felbontás a Leidennél is megvan; a nagyobb $Q$ nem garantált (mindkettő heurisztika); több futás és stabilitásvizsgálat nála is kell.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 4 csúcsú négyzetben ($1$–$2$–$3$–$4$–$1$) a modularitásmátrix sajátértékei $0, 0, 0, -2$. Mit jelent ez a spektrális kettévágásra?`,
          options: [
            R`Nincs pozitív sajátérték: a négyzetet nem érdemes kettévágni.`,
            R`A legnagyobb sajátérték 0, ezért a Fiedler-vektor előjele szerint kell vágni.`,
            R`A legkisebb sajátérték ($-2$) sajátvektora adja a legjobb vágást.`,
            R`A négyzetnek két erős közössége van: $\{1, 2\}$ és $\{3, 4\}$.`
          ],
          answer: 0,
          hint: R`$Q = \tfrac{1}{4m}\mathbf s^\top B\mathbf s$. Lehet-e ez pozitív, ha $B$-nek nincs pozitív sajátértéke?`,
          explain: R`Ha $B$ legnagyobb sajátértéke 0, akkor $\mathbf s^\top B\mathbf s \le 0$ minden vágásra: egyik sem jobb az „egy közösségnél”. Tényleg: $\{1, 2\}$ · $\{3, 4\}$-re $Q = 0$, $\{1, 3\}$ · $\{2, 4\}$-re $Q = -0{,}5$. A modularitásmátrix ezt jelzi; a Fiedler-vektor viszont mindig vágna – a két mátrixot keverni tipikus hiba. A $-2$-es sajátvektor épp a legrosszabb vágást ($\{1, 3\}$ · $\{2, 4\}$, minden él a csoportok között) adja.`
        },
        {
          type: "single", shuffle: true,
          q: R`SBM két blokkal: 4 és 6 csúcs; $p_{\text{be}} = 0{,}5$ mindkét blokkban, $p_{\text{ki}} = 0{,}2$. Hány él várható összesen?`,
          options: [R`$15{,}3$`, R`$30{,}8$`, R`$25{,}8$`, R`$12{,}9$`],
          answer: 0,
          hint: R`Belül $\binom{n_r}{2}$, két blokk között $n_r n_s$ pár.`,
          explain: R`Belül $0{,}5 \cdot (\binom42 + \binom62) = 0{,}5 \cdot 21 = 10{,}5$; között $0{,}2 \cdot 4 \cdot 6 = 4{,}8$; összesen $15{,}3$. A $30{,}8$ belül $n_r^2$-tel ($16 + 36$), a $25{,}8$ $n_r(n_r - 1)$-gyel ($12 + 30$) számol. A $12{,}9$ a blokkok közötti párokat felezi – ott nincs dupla számolás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hírportál-hálózaton a Louvain alig talál szerkezetet (alacsony $Q$), az SBM viszont két blokkot: néhány portál, amelyre mindenki hivatkozik, és sok, egymással alig kapcsolódó kisebb oldal. Mi ez a szerkezet?`,
          options: [
            R`mag–periféria – a modularitás nem látja, mert a mag és a periféria között több él fut, mint a periférián belül`,
            R`asszortatív közösségek – a Louvain egyszerűen rosszul futott`,
            R`kétrészes szerkezet – a portálok között nincs él`,
            R`véletlen gráf – az SBM túlillesztett`
          ],
          answer: 0,
          hint: R`Nézd a három valószínűséget: mag–mag, mag–periféria, periféria–periféria. Melyik sorrend illik a leíráshoz?`,
          explain: R`$p_{\text{mag,mag}} \gt p_{\text{mag,per}} \gt p_{\text{per,per}}$: mag–periféria. A modularitás „sűrű belül, ritka kívül” csoportot keres, ezért a magot és a perifériát nem választja szét. Asszortatív szerkezetet a Louvain is megtalálna. A kétrészeshez a blokkokon belül szinte nem lehetne él, a mag tagjai viszont egymással is kapcsolódnak. A túlillesztés a „mindenki külön” beosztás veszélye, nem a kétblokkosé; a véletlen gráf gyanúját nullmodell döntené el.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hat csúcs; A = $\{1, 2\}$ · $\{3, 4\}$ · $\{5, 6\}$, B = $\{1, 2, 3\}$ · $\{4, 5, 6\}$. A Rand-index $10/15 \approx 0{,}67$. Mennyi az ARI?`,
          options: [R`$\approx 0{,}24$`, R`$\approx 0{,}67$`, R`$\approx 0{,}44$`, R`$\approx 0{,}18$`],
          answer: 0,
          hint: R`Megfigyelt: $\sum\binom{n_{ij}}{2}$; várható: $\sum\binom{a_i}{2}\sum\binom{b_j}{2}/\binom62$; legnagyobb: a két összeg átlaga.`,
          explain: R`Közös csoportok: $\{1, 2\}$, $\{3\}$, $\{4\}$, $\{5, 6\}$: megfigyelt $1 + 0 + 0 + 1 = 2$. $\sum\binom{a_i}{2} = 3$, $\sum\binom{b_j}{2} = 6$; várható $3 \cdot 6/15 = 1{,}2$; legnagyobb $(3 + 6)/2 = 4{,}5$. $\mathrm{ARI} = 0{,}8/3{,}3 \approx 0{,}24$. A $0{,}67$ a korrigálatlan Rand-index – a sok „külön” egyetértés felfújja. A $0{,}44 = 0{,}8/1{,}8$ a nevezőben a kisebb összeget ($3$) használja, a $0{,}18 = 0{,}8/4{,}5$ nem vonja le a várhatót a nevezőből.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy gráf Louvain-$Q$-ja $0{,}48$. A fokszámtartó nullmodell 200 sorsolásán (ugyanazzal a Louvainnal) a legjobb $Q$: $0{,}42 \pm 0{,}03$. Mit mondasz?`,
          options: [
            R`$z = 2$: van némi többlet, de a $Q$ nagy része a véletlenből is kijön`,
            R`$z = 16$: rendkívül erős közösségszerkezet`,
            R`$z \approx 1{,}14$: nincs szerkezet`,
            R`$Q = 0{,}48 \gt 0{,}3$, tehát nullmodell nélkül is erős a szerkezet`
          ],
          answer: 0,
          hint: R`$z = (Q - \text{null átlag})/\text{null szórás}$ – nem a 0-hoz és nem hányadossal mérünk.`,
          explain: R`$z = (0{,}48 - 0{,}42)/0{,}03 = 2$. A $Q$ nagy része ($0{,}42$) egy szerkezet nélküli, de ugyanilyen fokszámú véletlen gráfban is kijön; a többlet szerény. A $16 = 0{,}48/0{,}03$ a 0-hoz méri a $Q$-t, az $1{,}14 = 0{,}48/0{,}42$ hányadost számol különbség és szórás helyett. Az utolsó a „$Q = 0{,}4$, tehát erős” tévhit: ritka gráfban a véletlen is ad ekkora $Q$-t (a $G(34, 78)$-nál átlagosan $0{,}354$-et).`
        },
        {
          type: "match",
          q: R`Az Árvízhét (súly nélkül, $\gamma = 1$, mind a 877 felbontás közül): párosítsd a felbontást a modularitásával!`,
          pairs: [
            [R`$\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Sz}, \mathrm{Kl}\}$ · $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$`, "0,28 (1. hely)"],
            [R`$\{\mathrm{Ko}, \mathrm{Sz}, \mathrm{Kl}\}$ · $\{\mathrm{Vi}\}$ · $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$`, "0,215 (2. hely)"],
            [R`keretek: $\{\mathrm{Ko}, \mathrm{Vi}\}$ · $\{\mathrm{Po}, \mathrm{La}, \text{Ön}\}$ · $\{\mathrm{Sz}, \mathrm{Kl}\}$`, "0,155 (7. hely)"],
            [R`$\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}\}$ · $\{\mathrm{La}, \text{Ön}\}$ · $\{\mathrm{Sz}, \mathrm{Kl}\}$`, "0,095"],
            [R`mindenki külön`, "−0,155"]
          ],
          hint: R`$m = 10$, fokszámok: $\mathrm{Ko}$ 4, $\mathrm{Vi}$ 3, $\mathrm{Po}$ 4, $\mathrm{La}$ 2, $\text{Ön}$ 2, $\mathrm{Sz}$ 3, $\mathrm{Kl}$ 2. Egy magányos csúcs mindig negatívan járul hozzá.`,
          explain: R`Két szál: $(0{,}5 - 0{,}36) + (0{,}3 - 0{,}16) = 0{,}28$. A $\mathrm{Vi}$ leválasztása: $0{,}0975 - 0{,}0225 + 0{,}14 = 0{,}215$. Keretek: $-0{,}0225 + 0{,}14 + 0{,}0375 = 0{,}155$ – a $\{\mathrm{Ko}, \mathrm{Vi}\}$ negatív többlete húzza le. A $\mathrm{Po}$ a védekezésnél: $\{\mathrm{Ko}, \mathrm{Vi}, \mathrm{Po}\}$ ($L = 3$, $d = 11$) $0{,}3 - 0{,}3025$, plusz $0{,}1 - 0{,}04$ és $0{,}0375$: $0{,}095$. Mindenki külön: $-62/400 = -0{,}155$. Ezért a fejezet válasza: alapbeállításban nem a keretek jönnek ki, hanem a két szál – a keretek csak súlyozva és $1{,}40 \le \gamma \le 1{,}80$ mellett.`
        }
      ]
    },

}; })();
