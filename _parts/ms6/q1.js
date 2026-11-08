    /* ------------------------------------------------ 6.1 */
    "ms6-61": {
      title: "Kvíz – 6.1 Pontbecslés és jó tulajdonságai",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Független, azonos eloszlású minta, $\sigma^2 = 30$, $n = 6$. Mennyi az $n$-es nevezőjű $\hat\sigma^2_n$ várható értéke?`,
          options: ["25", "30", "36", "24"],
          answer: 0,
          hint: R`A korrigálatlan szórásnégyzet átlagosan a $\sigma^2$ hányad részét adja? A szorzóban $n$ és $n-1$ szerepel.`,
          explain: R`$E(\hat\sigma^2_n) = \frac{n-1}{n}\sigma^2 = \frac56 \cdot 30 = 25$; a torzítás $25 - 30 = -5$ (alábecsül). A 30 azt hinné, hogy $\hat\sigma^2_n$ torzítatlan – ez az $s^2$-re igaz, nem rá. A 36 $= \frac{n}{n-1}\sigma^2$ fordított irányú szorzó. A 24 $= \frac45 \cdot 30$: $n = 5$-tel számol, vagyis a $\frac{n-1}{n}$ helyett $\frac{n-2}{n-1}$-et használ.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`Az $x_1$ (az első adat) torzítatlan becslése $\mu$-nek.`,
            R`$s^2$ torzítatlan becslése $\sigma^2$-nek.`,
            R`$\frac{X_1 + X_2}{2}$ torzítatlan becslése $\mu$-nek.`,
            R`Mivel $s^2$ torzítatlan $\sigma^2$-re, $s$ is torzítatlan $\sigma$-ra.`,
            R`Egy torzítatlan becslés minden mintában pontosan eltalálja a paramétert.`
          ],
          answer: [0, 1, 2],
          hint: R`Torzítatlan: $E(\hat\theta) = \theta$ – csak <em>átlagosan</em> kell jó helyre céloznia. És öröklődik-e ez a tulajdonság egy gyökvonáson át?`,
          explain: R`$E(X_1) = \mu$, $E(s^2) = \sigma^2$, $E\big(\frac{X_1 + X_2}{2}\big) = \mu$ – az első három igaz. <b>Hamis</b>, hogy $s$ torzítatlan: a gyökvonás nem lineáris, a sportolók 2 elemű mintáin $E(s) \approx 2{,}26$, míg $\sigma \approx 2{,}83$. <b>Hamis</b> az utolsó is („torzítatlan = pontos”): az $x_1$ is torzítatlan, mégis annyit ugrál, mint egy egyed ($D^2 = \sigma^2$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Az A becslés torzítatlan, szórásnégyzete 10. A B becslés torzítása 3, szórásnégyzete 4. Melyik a jobb az átlagos négyzetes hiba (MSE) szerint?`,
          options: [
            R`A, mert $\mathrm{MSE}(A) = 10 \lt \mathrm{MSE}(B) = 13$`,
            R`B, mert $\mathrm{MSE}(B) = 7 \lt \mathrm{MSE}(A) = 10$`,
            R`B, mert a szórásnégyzete kisebb ($4 \lt 10$)`,
            R`A, mert torzítatlan becslés mindig jobb a torzítottnál`
          ],
          answer: 0,
          hint: R`$\mathrm{MSE} = b^2 + D^2$. Figyelj a négyzetre!`,
          explain: R`$\mathrm{MSE}(A) = 0^2 + 10 = 10$, $\mathrm{MSE}(B) = 3^2 + 4 = 13$, tehát most az A nyer. A 7 a $b + D^2$ hiba (elfelejtett négyzet). A szórásnégyzet önmagában torzított becslésnél nem dönt – különben a „mindig 5-öt mondok” állandó (szórásnégyzet 0) lenne a legjobb. És az sem igaz, hogy a torzítatlan mindig jobb: a gyakorló feladatban (torzítás 2, szórásnégyzet 4, MSE 8) a torzított nyert a 9-es szórásnégyzetű torzítatlan ellen.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy „becslés” mindig 5-öt mond, akármi a minta. Mennyi az MSE-je, ha a valódi érték $\theta = 8$?`,
          options: ["9", "0", "3", "−3"],
          answer: 0,
          hint: R`Mennyi az állandó szórásnégyzete, és mennyi a torzítása? Utána: $\mathrm{MSE} = b^2 + D^2$.`,
          explain: R`Szórásnégyzet 0, torzítás $5 - 8 = -3$, így $\mathrm{MSE} = (-3)^2 + 0 = 9$. A 0 csak a szórásnégyzet – ezért hiba torzított becslést szórásnégyzettel mérni. A 3 és a $-3$ a torzítás négyzet nélkül; az MSE négyzetes, sosem negatív.`
        },
        {
          type: "match",
          q: R`Párosítsd a becslést a tulajdonságaival (független minta, $\mu$ illetve $\sigma^2$ becslése)!`,
          pairs: [
            [R`$\bar X$ a $\mu$-re`, "torzítatlan és konzisztens"],
            [R`$x_1$ a $\mu$-re`, "torzítatlan, de nem konzisztens"],
            [R`$\hat\sigma^2_n$ a $\sigma^2$-re`, "torzított, de konzisztens"],
            [R`„mindig 5” a $\mu$-re`, "szórásnégyzete 0, de (általában) torzított"]
          ],
          hint: R`Konzisztencia elégséges feltétele: aszimptotikusan torzítatlan, és a szórásnégyzete 0-hoz tart. Melyiknek csökken a szórásnégyzete $n$-nel?`,
          explain: R`$\bar X$: $E = \mu$, $D^2 = \sigma^2/n \to 0$ – torzítatlan és konzisztens. $x_1$: torzítatlan, de a szórásnégyzete $\sigma^2$ marad, akármekkora a minta – nem konzisztens. $\hat\sigma^2_n$: $E = \frac{n-1}{n}\sigma^2$, torzított, de $\frac{n-1}{n} \to 1$ és a szórásnégyzete is 0-hoz tart – konzisztens. Az állandó nem ugrál, de csak akkor talál, ha $\mu$ véletlenül épp 5.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hányszor hatásosabb egy 16 elemű minta átlaga, mint ugyanannak a mintának az első adata ($x_1$)?`,
          options: ["16-szor", "4-szer", "15-ször", "egyformák, mert mindkettő torzítatlan"],
          answer: 0,
          hint: R`Hatásosság: a szórásnégyzeteket hasonlítjuk össze. Mennyi $D^2(x_1)$ és $D^2(\bar x)$?`,
          explain: R`$D^2(x_1) / D^2(\bar x) = \sigma^2 / (\sigma^2/16) = 16$. A 4-szer a <b>szórások</b> aránya ($\sqrt{16}$) – a hatásosságot szórásnégyzettel mérjük. A 15 az $n - 1$-et keveri ide. Az, hogy mindkettő torzítatlan, épp azt jelenti, hogy a szórásnégyzet dönt közöttük – nem azt, hogy egyformák.`
        },
        {
          type: "single", shuffle: true,
          q: R`A sportolók (2, 4, 6, 8, 10; egyenletes sokaság) 3 elemű mintáin négy torzítatlan becslést hasonlítottunk össze a $\mu$-re. Melyiknek volt a legkisebb a szórásnégyzete?`,
          options: [R`$(\min + \max)/2$`, R`$\bar x$`, "a medián", R`$x_1$`],
          answer: 0,
          hint: "Ez a szakasz „meglepetése”: egyenletes eloszlásnál mit árul el a két szélső érték a közepéről?",
          explain: R`A szórásnégyzetek: $(\min + \max)/2$: 2,34; $\bar x$: 2,67; medián: 5,31; $x_1$: 8. Egyenletes sokaságnál a két szélső érték sokat elárul a közepéről, ezért a középpont győz. <b>Normális</b> sokaságnál viszont az átlag a leghatásosabb, vastag farkúnál a medián – nincs „mindig legjobb” becslés. Az $x_1$ a legrosszabb: annyit ugrál, mint egy egyed ($\sigma^2 = 8$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy becslés MSE-je 13, szórásnégyzete 9. Mit tudunk a torzításáról?`,
          options: [R`$b = 2$ vagy $b = -2$`, R`$b = 4$`, R`$b = 2$, biztosan pozitív`, R`$b = \sqrt{13} - 3 \approx 0{,}61$`],
          answer: 0,
          hint: R`Rendezd át: $b^2 = \mathrm{MSE} - D^2$. Mit veszítünk a négyzetre emeléssel?`,
          explain: R`$b^2 = 13 - 9 = 4$, tehát $|b| = 2$ – az irány (alá- vagy túlbecsül) az MSE-ből nem derül ki. A 4 a $b^2$, nem a $b$ (vagy a négyzet nélküli $\mathrm{MSE} = b + D^2$ hibás képletből jön). A $\sqrt{13} - 3$ a gyököket vonja ki külön-külön, mintha $\sqrt{\mathrm{MSE}} = |b| + D$ volna – ez nem igaz.`
        }
      ]
    },

    /* ------------------------------------------------ 6.2 */
    "ms6-62": {
      title: "Kvíz – 6.2 Becslési módszerek",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Buszvárás (exponenciális eloszlás): 2, 4, 6, 8 perc. Mi a $\lambda$ momentum-becslése?`,
          options: ["0,2", "5", "0,05", "0,15"],
          answer: 0,
          hint: R`Az exponenciális eloszlás várható értéke $1/\lambda$. Ezt tedd egyenlővé a mintaátlaggal!`,
          explain: R`$\bar x = 20/4 = 5$, és $1/\hat\lambda = 5$, tehát $\hat\lambda = 0{,}2$ (percenként). Az 5 maga az átlag – elmaradt a reciprok. A 0,05 $= 1/20$ az összeg reciproka (az átlag helyett). A 0,15 $= 3/20$ az $n-1$-es nevezővel számolt „átlag” reciproka – az átlagnál nincs korrekció.`
        },
        {
          type: "single", shuffle: true,
          q: R`Az adatok egy $[0; \theta]$ szakaszon egyenletesek. Minta: 2, 3, 4, 11. Mit ad a momentumok módszere?`,
          options: [
            R`$\hat\theta = 10$ – de ez ellentmond az adatoknak, mert van 11-es`,
            R`$\hat\theta = 10$, és ez rendben is van`,
            R`$\hat\theta = 5$, a mintaátlag`,
            R`$\hat\theta = 11$, a minta maximuma`
          ],
          answer: 0,
          hint: R`$E(X) = \theta/2$. Számold ki $\hat\theta$-t, és vesd össze a legnagyobb megfigyelt értékkel!`,
          explain: R`$\bar x = 20/4 = 5$, $\hat\theta = 2\bar x = 10$. De a mintában van 11, tehát $\theta \ge 11$ biztosan – a becslés lehetetlen. A momentumok módszere egyszerű, de néha ellentmond az adatoknak. Az 5 elfelejti a 2-es szorzót ($E(X) = \theta/2$). A $\hat\theta = \max = 11$ a <b>maximum likelihood</b> becslés, nem a momentum-becslés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Óránkénti hibaüzenetek száma (Poisson-eloszlás): 3, 1, 4, 0, 2. Mi a $\lambda$ maximum likelihood becslése?`,
          options: ["2", "2,5", "10", "0,5"],
          answer: 0,
          hint: R`A Poisson-példában $\ell'(\lambda) = -n + \frac{\sum x_i}{\lambda}$. Hol nulla?`,
          explain: R`$\ell'(\lambda) = -5 + 10/\lambda = 0 \iff \hat\lambda = 2 = \bar x$ – itt egyezik a momentum-becsléssel. A 2,5 $= 10/4$ az $n-1$-es nevező (átlagnál nincs ilyen). A 10 az összeg. A 0,5 $= 1/\bar x$ az exponenciális eloszlás képletét keveri ide (ott $E(X) = 1/\lambda$, a Poissonnál $E(X) = \lambda$).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a likelihood-függvényről és az ML becslésről? (Több jó válasz is lehet.)`,
          options: [
            R`Független megfigyeléseknél $L(\theta)$ az egyes valószínűségek (sűrűségek) szorzata.`,
            R`A log-likelihood $\ell(\theta) = \ln L(\theta)$ ugyanott veszi fel a maximumát, mint $L$.`,
            R`Normális mintánál a $\sigma^2$ ML becslése az $n$-es nevezőjű, torzított szórásnégyzet.`,
            R`10 dobás, 7 fej esetén $L(0{,}7) = 0{,}00222$ azt jelenti, hogy 0,00222 a valószínűsége annak, hogy $p = 0{,}7$.`,
            R`Az ML becslés mindig torzítatlan.`
          ],
          answer: [0, 1, 2],
          hint: R`Kinek a valószínűsége az $L(\theta)$: az adaté vagy a paraméteré? És mit mond a tétel a normális eloszlás $\hat\sigma^2$-éről?`,
          explain: R`Az első három igaz: a likelihood a valószínűségek <b>szorzata</b> (a logaritmusa lesz összeg); a $\ln$ szigorúan növő, ezért a maximumhely nem változik; normális mintára $\hat\sigma^2 = \frac1n\sum(x_i - \bar x)^2$. <b>Hamis</b>: az $L(0{,}7)$ a megfigyelt <em>adat</em> valószínűsége $p = 0{,}7$ mellett – a $p$ rögzített szám, a klasszikus statisztikában nincs valószínűsége. <b>Hamis</b>: az ML nem mindig torzítatlan (épp a $\hat\sigma^2$, vagy az egyenletes eloszlás $\max$-a a példa); nagy mintánál viszont aszimptotikusan torzítatlan.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy érmével 10-szer dobtunk, a likelihood $L(p) = p^4(1-p)^6$. Melyik $p$ maximalizálja?`,
          options: ["0,4", "0,6", "0,5", "0,67"],
          answer: 0,
          hint: R`Általános érme: $n$ dobásból $k$ fej esetén $\hat p = ?$ Melyik kitevő tartozik a fejekhez?`,
          explain: R`A $p$ kitevője a fejek száma: $k = 4$, $n = 10$, $\hat p = 4/10 = 0{,}4$ (deriválással: $\frac4p - \frac{6}{1-p} = 0 \iff p = 0{,}4$). A 0,6 a fejet és az írást cseréli fel. A 0,5 a „szabályos érme” előfeltevés – nem az adatból jön. A 0,67 $= 4/6$ a fejek és írások <em>aránya</em>, nem a fejek részaránya.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális eloszlású minta: 2, 4, 6, 8. Mi a $\sigma^2$ maximum likelihood becslése?`,
          options: ["5", "6,67", "2,24", "20"],
          answer: 0,
          hint: R`Az ML a normális eloszlásnál melyik nevezőt használja: $n$-et vagy $n-1$-et?`,
          explain: R`$\bar x = 5$, $\sum (x_i - 5)^2 = 9 + 1 + 1 + 9 = 20$, az ML becslés $20/4 = 5$ (torzított). A 6,67 $= 20/3$ a torzítatlan $s^2$ – az nem az ML becslés. A 2,24 $= \sqrt5$ a szórás, nem a szórásnégyzet. A 20 az eltérésnégyzet-összeg, osztás nélkül.`
        },
        {
          type: "single", shuffle: true,
          q: R`Adatok: 1, 2, 4, 5, 13. Melyik $c$ minimalizálja az <b>abszolút</b> eltérések összegét, $\sum |x_i - c|$-t?`,
          options: ["4", "5", "7", "6"],
          answer: 0,
          hint: R`A négyzetes hibát az átlag minimalizálja. Melyik helyzeti középérték tartozik az abszolút eltérésekhez?`,
          explain: R`Az abszolút eltérések összegét a <b>medián</b> minimalizálja: $c = 4$ (összeg 15). Az 5 az átlag – az a $\sum (x_i - c)^2$ minimumhelye (az abszolút eltérések összege ott 16). A 7 a $(\min + \max)/2$, a 6 a terjedelem fele. A 13-as kiugró érték az átlagot magához húzza, a mediánt nem: más hibamérték → más „legjobb” becslés.`
        },
        {
          type: "match",
          q: R`Párosítsd a becslési módszert a lényegével!`,
          pairs: [
            ["momentumok módszere", "az elméleti momentumokat a mintabeliekkel tesszük egyenlővé"],
            ["maximum likelihood", "az a paraméter, amely mellett a megfigyelt adat a legvalószínűbb"],
            ["legkisebb négyzetek", "az eltérésnégyzetek összegét minimalizáljuk"],
            ["abszolút eltérések minimalizálása", "egy konstans illesztésénél a mediánt adja"]
          ],
          hint: "Egyenlet, maximum, minimum – melyik módszer melyik műveletre épül?",
          explain: R`A <b>momentumok módszere</b> egyenleteket ír fel ($E(X) = \bar x$, …). A <b>maximum likelihood</b> a megfigyelt minta valószínűségét maximalizálja a paraméter szerint. A <b>legkisebb négyzetek</b> a $\sum(x_i - c)^2$-et minimalizálja (konstansnál ez $\bar x$, regresszióban egy egyenes). Ha négyzet helyett abszolút értéket veszünk, a medián adódik. Normális hibáknál a legkisebb négyzetek és az ML ugyanazt adja.`
        }
      ]
    },

    /* ------------------------------------------------ 6.3 */
    "ms6-63": {
      title: "Kvíz – 6.3 Konfidencia-intervallum a várható értékre",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $\sigma = 12$ ismert, $n = 36$, $\bar x = 80$. Mi a 95%-os konfidencia-intervallum a $\mu$-re?`,
          options: [R`$[76{,}08;\ 83{,}92]$`, R`$[76{,}71;\ 83{,}29]$`, R`$[56{,}48;\ 103{,}52]$`, R`$[79{,}35;\ 80{,}65]$`],
          answer: 0,
          hint: R`$\bar x \pm z_{1-\alpha/2}\,\sigma/\sqrt n$. Mennyi a standard hiba, és melyik $z$ tartozik a kétoldali 95%-hoz?`,
          explain: R`$\mathrm{SE} = 12/\sqrt{36} = 2$, $\Delta = 1{,}96 \cdot 2 = 3{,}92$, KI: $[76{,}08;\ 83{,}92]$. A $[76{,}71;\ 83{,}29]$ az 1,645-tel számol – az a 90%-os kétoldali (vagy 95%-os egyoldali) kvantilis. Az $[56{,}48;\ 103{,}52]$ elhagyja a $\sqrt n$-t ($1{,}96 \cdot 12$): ez az egyedi adatok szóródása, nem az átlagé. A $[79{,}35;\ 80{,}65]$ $\sqrt n$ helyett $n$-nel oszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik $z_{1-\alpha/2}$ kell a <b>95%-os</b> (kétoldali) konfidencia-intervallumhoz?`,
          options: ["1,960", "1,645", "2,576", "0,975"],
          answer: 0,
          hint: R`A kimaradó 5% a két szélen egyenlően oszlik meg. Melyik $z$-re $\Phi(z) = 0{,}975$?`,
          explain: R`$\Phi(z) = 1 - 0{,}05/2 = 0{,}975 \Rightarrow z = 1{,}960$. Az 1,645-re $\Phi = 0{,}95$: a teljes 5% egy oldalra kerülne – ez a 90%-os kétoldali kvantilis. A 2,576 a 99%-oshoz tartozik. A 0,975 maga a valószínűség ($\Phi(z)$ értéke), nem a kvantilis.`
        },
        {
          type: "multi",
          q: R`A konzervekre a 95%-os KI $[392{,}94;\ 403{,}06]$ g. Melyik értelmezés helyes? (Több jó válasz is lehet.)`,
          options: [
            "Ha sokszor vennénk mintát és így szerkesztenénk sávot, a sávok kb. 95%-a lefedné a valódi várható értéket.",
            R`A $\mu$ rögzített szám; a sáv a véletlen, mintáról mintára változik.`,
            R`A mintavétel után 95% a valószínűsége, hogy $\mu$ 392,94 és 403,06 között van.`,
            "A konzervek 95%-ának töltősúlya 392,94 és 403,06 g közé esik.",
            "Egy újabb 15 elemű minta átlaga 95% eséllyel esik ebbe a sávba."
          ],
          answer: [0, 1],
          hint: "Mi a véletlen és mi nem? A 95% az eljárásra vonatkozik, vagy a konkrét sávra? És a KI miről szól: az egyedekről vagy a várható értékről?",
          explain: R`A 95% az <b>eljárás</b> tulajdonsága: a sávok kb. 95%-a fedi le $\mu$-t. A $\mu$ rögzített, a sáv véletlen. A konkrét sáv vagy lefedi $\mu$-t, vagy nem – ezért „95%-os megbízhatóságról” beszélünk, nem valószínűségről (a forrás is a pontatlan „valószínűséggel” fordulatot használja). A konzervek egyedi súlyai $\pm 19{,}6$ g-on belül szóródnak, a KI csak $\pm 5$ g – az az átlagról szól. Egy új átlag sem 95%-ban esik bele: a sáv közepe is ingadozik, ezért csak kb. 83%-ban.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $\sigma$ ismeretlen. $n = 16$, $\bar x = 50$, $s = 8$. Mi a 95%-os KI? ($t_{15;\,0{,}975} = 2{,}131$)`,
          options: [R`$[45{,}74;\ 54{,}26]$`, R`$[46{,}08;\ 53{,}92]$`, R`$[32{,}95;\ 67{,}05]$`, R`$[48{,}93;\ 51{,}07]$`],
          answer: 0,
          hint: R`$\bar x \pm t_{n-1;\,1-\alpha/2}\,s/\sqrt n$. Mennyi $s/\sqrt n$?`,
          explain: R`$s/\sqrt n = 8/4 = 2$, $\Delta = 2{,}131 \cdot 2 \approx 4{,}26$, KI: $[45{,}74;\ 54{,}26]$. A $[46{,}08;\ 53{,}92]$ $z = 1{,}96$-tal számol – kis mintánál, ismeretlen $\sigma$ mellett ez túl szűk sáv, ritkábban fed le a névlegesnél. A $[32{,}95;\ 67{,}05]$ elfelejti a $\sqrt n$-t ($2{,}131 \cdot 8$). A $[48{,}93;\ 51{,}07]$ $\sqrt n$ helyett $n$-nel oszt.`
        },
        {
          type: "single", shuffle: true,
          q: R`A konzerveknél a $t$-KI ($\pm 7{,}35$) szélesebb, mint a $\sigma = 10$-zel számolt $z$-KI ($\pm 5{,}06$). Melyik ok <b>nem véletlen</b>, vagyis minden mintánál fennáll?`,
          options: [
            R`A $t_{14;\,0{,}975} = 2{,}145$ nagyobb, mint $z = 1{,}96$.`,
            R`Az $s = 13{,}27$ nagyobb, mint $\sigma = 10$.`,
            R`A $t$-KI a mintaátlag helyett a mediánra épül.`,
            R`A $t$-KI-nél $n - 1 = 14$ adattal számolunk, eggyel kevesebbel.`
          ],
          answer: 0,
          hint: "Két ok volt: a kvantilis és a szórás. Melyik függ a konkrét mintától?",
          explain: R`A $t$-kvantilis minden véges $n$-re nagyobb 1,96-nál: így fizetjük meg a $\sigma$ becslésének bizonytalanságát – ez <b>nem véletlen</b>. Az $s \gt \sigma$ viszont <b>véletlen</b>: másik mintánál $s$ kisebb is lehetne 10-nél. A $t$-KI is az átlagra épül. Az $n - 1$ a <b>szabadságfok</b>, nem az adatok száma: mind a 15 adatot felhasználjuk.`
        },
        {
          type: "single", shuffle: true,
          q: R`A konzervek hibahatára $n = 15$-tel 5,06 g ($\sigma = 10$, 95%). Hány konzerv kellene, hogy a hibahatár a <b>negyedére</b> csökkenjen?`,
          options: ["240", "60", "30", "3,75"],
          answer: 0,
          hint: R`$\Delta \sim 1/\sqrt n$. Hányszorosára kell nőnie $\sqrt n$-nek, és ehhez hányszorosára $n$-nek?`,
          explain: R`$\sqrt n$-nek 4-szeresére kell nőnie, tehát $n$-nek 16-szorosára: $15 \cdot 16 = 240$ (ellenőrzés: $1{,}96 \cdot 10/\sqrt{240} \approx 1{,}27$). A 60 a négyszeres minta – az csak a <b>felére</b> viszi a hibahatárt (a táblázat 2,53-a). A 30 a kétszeres minta: $\sqrt 2$-ed részére csökkent. A 3,75 a fordított irány: kisebb mintával a hibahatár nőne.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanazon a mintán 90% helyett 99%-os $z$-intervallumot számolunk. Hányszorosára változik a hibahatár?`,
          options: ["kb. 1,57-szeresére nő", "kb. 1,31-szeresére nő", "kb. 1,10-szeresére nő", "kb. 0,64-szeresére csökken"],
          answer: 0,
          hint: R`A hibahatárban csak a $z$ változik: 90%-hoz 1,645, 99%-hoz 2,576 tartozik.`,
          explain: R`$2{,}576/1{,}645 \approx 1{,}57$ – a nagyobb megbízhatóság szélesebb sávval jár. Az 1,31 $= 2{,}576/1{,}96$ a 95% → 99% váltás. Az 1,10 $= 0{,}99/0{,}90$ a szinteket osztja el a kvantilisek helyett. A 0,64-szeres csökkenés a fordított hányados: azt hinné, hogy a 99%-os KI szűkebb – pedig a megbízhatóság és a pontosság egymás rovására megy.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 10$, $n = 25$, és a $z$-intervallum teljes szélessége 10,3. Milyen megbízhatósági szintű?`,
          options: ["99%", "95%", "90%", "97%"],
          answer: 0,
          hint: R`A szélesség a hibahatár kétszerese. $\Delta = z \cdot \mathrm{SE}$ – fejezd ki $z$-t!`,
          explain: R`$\Delta = 10{,}3/2 = 5{,}15$, $\mathrm{SE} = 10/5 = 2$, $z = 5{,}15/2 \approx 2{,}576$ → 99%. Ha a teljes szélességet vennéd hibahatárnak, $z = 5{,}15$ jönne ki, ami egyik szokásos szinthez sem tartozik. A 95%-hoz $\Delta = 3{,}92$, a 90%-hoz $3{,}29$, a 97%-hoz ($z = 2{,}17$) $4{,}34$ tartozna.`
        }
      ]
    },

    /* ------------------------------------------------ 6.4 */
    "ms6-64": {
      title: "Kvíz – 6.4 Konfidencia-intervallum arányra",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`400 megkérdezettből 160 mond igent. Mi a 95%-os Wald-intervallum a sokasági arányra?`,
          options: [R`$[35{,}2\%;\ 44{,}8\%]$`, R`$[36{,}0\%;\ 44{,}0\%]$`, R`$[37{,}6\%;\ 42{,}4\%]$`, R`$[30{,}4\%;\ 49{,}6\%]$`],
          answer: 0,
          hint: R`$\hat p \pm 1{,}96\sqrt{\hat p(1-\hat p)/n}$. Előbb a standard hibát számold ki!`,
          explain: R`$\hat p = 0{,}4$, $\mathrm{SE} = \sqrt{0{,}24/400} \approx 0{,}0245$, $\Delta = 1{,}96 \cdot 0{,}0245 \approx 0{,}048$: KI $[35{,}2\%;\ 44{,}8\%]$, azaz $\pm 4{,}8$ százalékpont. A $[36{,}0\%;\ 44{,}0\%]$ az 1,645-tel számol (90%). A $[37{,}6\%;\ 42{,}4\%]$ a standard hibát veszi hibahatárnak (lemaradt az 1,96). A $[30{,}4\%;\ 49{,}6\%]$ a teljes szélességet ($2\Delta$) teszi mindkét oldalra.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy felmérés szerint egy párt támogatottsága 31%, a hibahatár $\pm 3$ <b>százalékpont</b>. Mi a konfidencia-intervallum?`,
          options: [R`$[28\%;\ 34\%]$`, R`$[30{,}07\%;\ 31{,}93\%]$`, R`$[29{,}5\%;\ 32{,}5\%]$`, R`$[25\%;\ 37\%]$`],
          answer: 0,
          hint: R`A százalékpont a százalékértékek különbsége – egyszerűen hozzáadjuk, illetve levonjuk.`,
          explain: R`$31\% \pm 3$ százalékpont $= [28\%;\ 34\%]$. A $[30{,}07\%;\ 31{,}93\%]$ a 31% 3%-át ($0{,}93$ pontot) veszi – ez a százalék ↔ százalékpont összekeverése. A $[29{,}5\%;\ 32{,}5\%]$ a 3-at a teljes szélességnek nézi (hibahatár ↔ szélesség). A $[25\%;\ 37\%]$ kétszeres hibahatárral számol.`
        },
        {
          type: "single", shuffle: true,
          q: R`60 betegből <b>egyiknél sem</b> volt mellékhatás. A „3-as szabály” szerint kb. mennyi a mellékhatás arányának 95%-os felső határa?`,
          options: ["5%", "0%", "1,7%", "15%"],
          answer: 0,
          hint: R`Ha $n$ próbából 0 esemény, a felső határ kb. $3/n$.`,
          explain: R`$3/60 = 0{,}05$, vagyis kb. 5%. A 0% a Wald-intervallum $[0;\ 0]$-ja ($\hat p = 0$, a standard hiba is 0) – ez azt állítaná, hogy biztosan senkinek sincs mellékhatása. Az 1,7% $= 1/60$ elfelejti a 3-as szorzót. A 15% $= 3/20$ a szakasz 20 betegére vonatkozó érték.`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik mintánál teljesül a Wald-intervallum feltétele ($n\hat p \ge 10$ és $n(1-\hat p) \ge 10$)?`,
          options: ["50 főből 12 igen", "200 főből 6 igen", "30 főből 25 igen", "15 főből 7 igen"],
          answer: 0,
          hint: "Számold meg mindegyiknél az igenek ÉS a nemek számát!",
          explain: R`50 főből 12 igen és 38 nem – mindkettő legalább 10 ✔. 200 főből csak 6 igen: a nagy $n$ nem segít, ha kevés az „igen”. 30 főből 25 igen, de csak 5 nem – a másik feltétel bukik. 15 főből 7 igen és 8 nem: egyik sem éri el a 10-et. Ilyenkor Wilson- vagy „plusz négy” intervallum kell.`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a Wald- és a Wilson-intervallumról? (Több jó válasz is lehet.)`,
          options: [
            R`Ha 0 a sikerek száma, a Wald-intervallum nulla szélességű.`,
            R`A Wald-intervallum kilóghat a $[0;\ 1]$ szakaszból.`,
            R`Kis $n$-nél a „95%-os” Wald-sávok a valóságban jóval ritkábban fedik le $p$-t (pl. $n = 20$, $p = 0{,}1$: 87,6%).`,
            R`A Wilson-intervallum közepe mindig pontosan $\hat p$.`,
            "1000 fős, 31%-os mintánál a Wilson-intervallum lényegesen szélesebb a Waldnál."
          ],
          answer: [0, 1, 2],
          hint: R`Gondolj a 0/20 és az 1/20 példára! Merre húzódik a Wilson közepe? És mi történik nagy mintánál?`,
          explain: R`Igaz: 0/20-nál a Wald $[0;\ 0]$; 1/20-nál $[-0{,}046;\ 0{,}146]$, negatív alsó határral; és a lefedettsége $n = 20$, $p = 0{,}1$ esetén csak 87,6%, mert a standard hibát a bizonytalan $\hat p$-ből számolja. <b>Hamis</b>: a Wilson közepe kicsit 0,5 felé húzódik ($z = 2$-nél épp a „plusz négy” $\tilde p = \frac{k+2}{n+4}$). <b>Hamis</b>: nagy mintánál a kettő gyakorlatilag azonos (Wald $[28{,}1\%;\ 33{,}9\%]$, Wilson $[28{,}2\%;\ 33{,}9\%]$).`
        },
        {
          type: "single", shuffle: true,
          q: R`16 próbából 3 siker. Mi a 95%-os „plusz négy” (Agresti–Coull) intervallum?`,
          options: [R`$[0{,}060;\ 0{,}440]$`, R`$[-0{,}004;\ 0{,}379]$`, R`$[0{,}038;\ 0{,}462]$`, R`$[0{,}071;\ 0{,}485]$`],
          answer: 0,
          hint: R`Adj a mintához 2 „igent” és 2 „nemet”: $\tilde p = \frac{k+2}{n+4}$, és számolj Wald-intervallumot $n + 4$ elemmel.`,
          explain: R`$\tilde p = 5/20 = 0{,}25$, $\Delta = 1{,}96\sqrt{0{,}25 \cdot 0{,}75/20} \approx 0{,}190$: KI $\approx [0{,}060;\ 0{,}440]$. A $[-0{,}004;\ 0{,}379]$ a sima Wald $\hat p = 3/16$-ra – negatív alsó határral. A $[0{,}038;\ 0{,}462]$ $\tilde p$-t jól számolja, de a gyök alatt $n + 4$ helyett $n = 16$-tal oszt. A $[0{,}071;\ 0{,}485]$ csak 2 „igent” ad hozzá: $\frac{5}{18}$ és $n = 18$.`
        },
        {
          type: "single", shuffle: true,
          q: R`Mit jelent, hogy egy „95%-os” intervallum-módszer lefedettsége egy helyzetben 87,6%?`,
          options: [
            R`Sok ismétlésnél a sávoknak csak 87,6%-a tartalmazná $p$-t: a módszer többet ígér, mint amit teljesít.`,
            R`A kapott sáv 87,6% valószínűséggel tartalmazza $p$-t, ezért 87,6%-os KI-nek kell nevezni.`,
            R`Az adatok 87,6%-a esik a sávba.`,
            R`A sáv 87,6%-kal szélesebb a kelleténél.`
          ],
          answer: 0,
          hint: "A megbízhatósági szint az eljárásról szól: ha sokszor ismételnénk…",
          explain: R`A lefedettség az eljárás tulajdonsága: a sokszor ismételt mintákból szerkesztett sávok hányad része fedi le a valódi $p$-t. 87,6% $\lt$ 95%: a Wald itt túl szűk sávot ad. Egy konkrét sávra nem mondunk valószínűséget (vagy lefedi $p$-t, vagy nem). A KI a sokasági arányról szól, nem az adatok eloszlásáról. A lefedettség nem szélesség: épp hogy túl <em>szűk</em> a sáv.`
        },
        {
          type: "single", shuffle: true,
          q: R`97%-os kétoldali intervallumhoz a $z$-t a $\Phi(z) = ?$ egyenletből kapjuk (ez adja a rádiós példa 2,17-ét).`,
          options: ["0,985", "0,97", "0,94", "0,015"],
          answer: 0,
          hint: R`A kimaradó 3% a két szélen egyenlően oszlik meg.`,
          explain: R`$\Phi(z) = 1 - 0{,}03/2 = 0{,}985 \Rightarrow z \approx 2{,}17$. A 0,97 a teljes 3%-ot egy oldalra teszi (ez az egyoldali 97%-os kvantilis lenne). A 0,94 kétszer vonja le a 3%-ot. A 0,015 a bal oldali farok – ahhoz $-2{,}17$ tartozna.`
        }
      ]
    },
