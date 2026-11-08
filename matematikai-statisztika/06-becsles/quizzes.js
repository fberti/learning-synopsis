/* =========================================================
   Matematikai statisztika 6. fejezet – kvízek
   (a kérdéstípusok leírását lásd: assets/quiz.js)
   Minden számot Pythonnal ellenőriztünk.
   ========================================================= */
(function () {
  const R = String.raw;

  const QUIZZES = {
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

    /* ------------------------------------------------ 6.5 */
    "ms6-65": {
      title: "Kvíz – 6.5 Konfidencia-intervallum a szórásra",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Normális sokaságból $n = 10$ elemű mintát veszünk, $s = 3$. Mi a 95%-os KI a <b>szórásra</b>, $\sigma$-ra? ($\chi^2_{9}$: 2,700 és 19,023)`,
          options: ["[2,06; 5,48]", "[4,26; 30,00]", "[2,18; 5,77]", "[1,19; 3,16]"],
          answer: 0,
          hint: R`A képletben $(n-1)s^2$ áll, és a végén gyököt kell vonni. Melyik kvantilis adja az alsó határt?`,
          explain: R`$(n-1)s^2 = 9 \cdot 9 = 81$. $\sigma^2 \in [81/19{,}023;\ 81/2{,}700] = [4{,}26;\ 30{,}00]$, gyököt vonva $\sigma \in [2{,}06;\ 5{,}48]$. A [4,26; 30,00] a <b>szórásnégyzet</b> intervalluma – szórásként közölni gyökvonás nélkül tipikus hiba. A [2,18; 5,77] $n = 10$-zel szoroz $n - 1 = 9$ helyett. Az [1,19; 3,16] $s^2$ helyett $s$-sel számol ($9 \cdot 3 = 27$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A szórásnégyzet KI-jénél melyik kvantilissel osztva kapjuk az <b>alsó</b> határt?`,
          options: [
            R`A nagyobbikkal, $\chi^2_{n-1;\,1-\alpha/2}$-vel`,
            R`A kisebbikkel, $\chi^2_{n-1;\,\alpha/2}$-vel`,
            R`A $z_{1-\alpha/2}$-vel, mint az átlagnál`,
            R`A $t_{n-1;\,1-\alpha/2}$-vel, mert $\sigma$ ismeretlen`
          ],
          answer: 0,
          hint: R`A $\sigma^2$ a törtnek a nevezőjében áll: $(n-1)s^2/\sigma^2$. Mi történik az egyenlőtlenséggel, ha reciprokot veszel?`,
          explain: R`$\chi^2_{\alpha/2} \lt (n-1)s^2/\sigma^2 \lt \chi^2_{1-\alpha/2}$. A reciprok megfordítja az egyenlőtlenségeket, ezért $\sigma^2 \gt (n-1)s^2/\chi^2_{1-\alpha/2}$: a <b>nagyobb</b> kvantilis adja az alsó határt. Ha a kisebbikkel osztasz, a „határok” helyet cserélnek (az alsó nagyobb lesz a felsőnél). A $z$ és a $t$ az átlag intervallumához kell; a szórásnál a $\chi^2$-tétel (5.5-a) az eszköz.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $n = 15$, $s = 10$. Mi a <b>90%-os</b> KI $\sigma$-ra? ($\chi^2_{14}$ 5%-os és 95%-os kvantilise: 6,571 és 23,685)`,
          options: ["[7,69; 14,60]", "[7,32; 15,77]", "[7,96; 15,11]", "[59,11; 213,06]"],
          answer: 0,
          hint: R`90%-hoz a két szélen 5–5% marad ki. Számold ki $(n-1)s^2$-et, oszd el a két kvantilissel, és ne felejts el gyököt vonni!`,
          explain: R`$(n-1)s^2 = 14 \cdot 100 = 1400$. $\sigma^2 \in [1400/23{,}685;\ 1400/6{,}571] = [59{,}11;\ 213{,}06]$, gyökvonás után $\sigma \in [7{,}69;\ 14{,}60]$. A [7,32; 15,77] a 95%-os kvantilisekkel (5,629 és 26,119) készült – az a szélesebb, 95%-os sáv. A [7,96; 15,11] $n = 15$-tel szoroz $n - 1$ helyett. A [59,11; 213,06] a szórásnégyzet intervalluma, gyökvonás nélkül.`
        },
        {
          type: "multi",
          q: R`A konzervek szórásának 95%-os KI-je [9,71; 20,92] g, a pontbecslés $s = 13{,}27$ g. Melyik állítás igaz? (Több jó válasz is lehet.)`,
          options: [
            R`Az $s$ nem a sáv közepén van: a közép 15,3, az $s$ ettől balra esik.`,
            R`Az aszimmetria oka, hogy a $\chi^2$-eloszlás jobbra ferde.`,
            R`A sáv felírható $13{,}27 \pm \Delta$ alakban, csak a $\Delta$-t kell kiszámolni.`,
            R`A szélesség hibás számolásra utal: egy helyes KI-nek a pontbecslésre szimmetrikusnak kell lennie.`,
            R`A szórás KI-jét a szórásnégyzet KI-jének két határából gyökvonással kapjuk.`
          ],
          answer: [0, 1, 4],
          hint: R`Számold ki a sáv közepét, és gondold végig, milyen alakú a $\chi^2$-eloszlás.`,
          explain: R`Igaz az első, a második és az ötödik. $(9{,}71 + 20{,}92)/2 \approx 15{,}3 \gt 13{,}27$. A $\chi^2$ jobbra ferde: a felső határnál a kicsi (bal oldali) kvantilissel osztunk, ami messzebb tolja a határt. A szórás sávját a $\sigma^2$-sáv határainak gyökéből kapjuk. <b>Hamis</b>, hogy van „$s \pm \Delta$” alak – ez a tipikus hiba. Hamis az is, hogy egy KI-nek mindig szimmetrikusnak kell lennie: csak a $z$- és a $t$-intervallum ilyen.`
        },
        {
          type: "single", shuffle: true,
          q: R`A gyártó szerint a konzervtöltő gép szórása $\sigma = 10$ g. A minta alapján a 95%-os KI $\sigma$-ra [9,71; 20,92], a 90%-os [10,20; 19,36]. Mi a helyes következtetés?`,
          options: [
            "A 95%-os sáv még tartalmazza a 10-et, a 90%-os már nem: az adat inkább nagyobb szórásra utal, de 15 konzerv kevés – érdemes több adatot gyűjteni.",
            "Mindkét szinten ellentmond a gyártónak, hiszen a pontbecslés 13,27 > 10.",
            "A 95%-os sáv bizonyítja, hogy a gyártónak igaza van: a szórás pontosan 10.",
            "A két sáv ellentmond egymásnak, ezért valamelyik számolás hibás."
          ],
          answer: 0,
          hint: "Melyik sávban van benne a 10? És mi a viszony a 90%-os és a 95%-os sáv között?",
          explain: R`A 90%-os sáv mindig szűkebb a 95%-osnál (kisebb megbízhatósághoz keskenyebb „háló” kell), ezért nincs ellentmondás, ha a 10 az egyikbe belefér, a másikba nem. A 95%-os szinten a 10 épphogy benne van: az adat <b>összeegyeztethető</b> vele, de nem bizonyítja. A pontbecslés egymagában (13,27 > 10) semmit sem dönt el, hiszen a mintából számolt $s$ ingadozik. A 15 elemű minta a szórásról kevés információt hordoz: a sáv több mint kétszeres tartományt fog át.`
        },
        {
          type: "match",
          q: R`15 elemű mintákból „95%-os” $\chi^2$-intervallumot szerkesztettünk $\sigma$-ra, sokféle sokaságból (szimuláció). Párosítsd a sokaságot a tényleges lefedettséggel!`,
          pairs: [
            ["normális", "kb. 95% – annyi, amennyit ígér"],
            ["ferde (exponenciális)", "kb. 74% – túl ritkán fed le"],
            ["egyenletes", "kb. 99,5% – feleslegesen széles"]
          ],
          hint: R`A $\chi^2$-tétel melyik sokaságra pontos? Egy hosszú farkú sokaságban gyakoriak a nagy eltérések – ez hogyan hat az $s$ ingadozására?`,
          explain: R`A $(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$ tétel <b>csak normális sokaságra</b> igaz, ott a lefedettség 95,0%. Ferde, hosszú farkú (exponenciális) sokaságnál az $s^2$ sokkal jobban ingadozik, a sáv túl szűk: a „95%-os” intervallum csak 74,3%-ban fedi le a szórást. Az egyenletes sokaságnál fordítva: 99,5% – ez sem jó, a sáv feleslegesen széles, a „95%” itt sem igaz. A hiba nagy $n$-nél sem tűnik el.`
        },
        {
          type: "set",
          q: R`Melyik esetben használnád nyugodtan a szórás $\chi^2$-intervallumát? (Jelöld meg mindet!)`,
          items: [
            "nagyjából normális, kiugró érték nélküli töltősúlyok",
            "200 háztartás erősen ferde jövedelmei",
            "ügyfélszolgálati várakozási idők (exponenciális jellegűek)",
            "felnőtt férfiak testmagassága (jó közelítéssel normális)",
            "1000 elemű, erősen ferde minta – a nagy n miatt"
          ],
          answer: [
            "nagyjából normális, kiugró érték nélküli töltősúlyok",
            "felnőtt férfiak testmagassága (jó közelítéssel normális)"
          ],
          hint: "Csak egyetlen feltétel számít – és ezt a mintanagyság nem helyettesíti.",
          explain: R`A $\chi^2$-intervallum feltétele a <b>normális sokaság</b>: ez a töltősúlyokra és a testmagasságra jó közelítéssel teljesül. Ferde adatoknál (jövedelem, várakozási idő) a lefedettség messze 95% alatt lehet. A tipikus hiba az átlag intervallumából áthozott gondolat, hogy „nagy mintán a CHT megment”: az $s^2$ eloszlása a sokaság csúcsosságától függ, és ez nagy $n$-nél sem tűnik el. Ilyenkor bootstrap (6.7) a jobb választás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány szabadságfokú $\chi^2$-eloszlás kvantilisei kellenek egy 25 elemű minta szórásának KI-jéhez?`,
          options: ["24", "25", "23", "26"],
          answer: 0,
          hint: R`Nézd meg a tételt: $(n-1)s^2/\sigma^2 \sim \chi^2_{?}$.`,
          explain: R`$(n-1)s^2/\sigma^2 \sim \chi^2_{n-1}$, tehát $25 - 1 = 24$ szabadságfok – ugyanannyi, mint az $s^2$ nevezője. A 25 a tipikus „szabadságfok = $n$” hiba. A 23 és a 26 mellé lő: egy paramétert ($\mu$-t) becsültünk az $\bar x$-szel, ezért pontosan egy szabadságfok vész el.`
        }
      ]
    },

    /* ------------------------------------------------ 6.6 */
    "ms6-66": {
      title: "Kvíz – 6.6 Mintanagyság tervezése",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 12$, és a várható érték 95%-os hibahatára legfeljebb $\Delta = 2$ lehet. Legalább mekkora minta kell?`,
          options: ["139", "138", "12", "98"],
          answer: 0,
          hint: R`$n \ge (z\sigma/\Delta)^2$ – és gondold végig, merre kell kerekíteni.`,
          explain: R`$(1{,}96 \cdot 12/2)^2 = 11{,}76^2 \approx 138{,}3$ → felfelé kerekítve <b>139</b>. A 138 lefelé kerekít: azzal a hibahatár kicsit nagyobb lenne az előírtnál. A 12 a $z\sigma/\Delta = 11{,}76$ kerekítése – a négyzetre emelés maradt el. A 98 a 90%-os $z = 1{,}645$-tel számol ($9{,}87^2 \approx 97{,}4$).`
        },
        {
          type: "single", shuffle: true,
          q: R`A KI <b>teljes szélessége</b> legfeljebb 4 g lehet (95%, $\sigma = 10$ g). Hány elem kell?`,
          options: ["97", "25", "385", "96"],
          answer: 0,
          hint: R`A képletben a hibahatár, $\Delta$ szerepel. Hogyan aránylik a hibahatár a teljes szélességhez?`,
          explain: R`A szélesség $2\Delta$, tehát $\Delta = 2$: $(1{,}96 \cdot 10/2)^2 = 9{,}8^2 = 96{,}04$ → <b>97</b>. A 25 a szélességet vette hibahatárnak ($\Delta = 4$: $4{,}9^2 \approx 24{,}0$). A 385 $\Delta = 1$-gyel számol (a szélesség negyedével). A 96 lefelé kerekít – 96,04-nél ez már kevés.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 10$, $\Delta = 2$, 95%. A sokaság csak $N = 400$ elemű, visszatevés nélkül húzunk. Legalább mekkora minta kell?`,
          options: ["78", "97", "77", "73"],
          answer: 0,
          hint: R`Előbb számold ki a végtelen sokaságra vonatkozó $n_0$-t, aztán használd az $n = n_0/(1 + n_0/N)$ korrekciót!`,
          explain: R`$n_0 = (1{,}96 \cdot 10/2)^2 = 96{,}04$. $n = 96{,}04/(1 + 96{,}04/400) = 96{,}04/1{,}2401 \approx 77{,}4$ → <b>78</b>. A 97 a korrekció nélküli érték: itt a kiválasztási arány kb. 20%, ezért érdemes korrigálni. A 77 lefelé kerekít. A 73 a rossz $n_0(1 - n_0/N) \approx 73{,}0$ képletből jön – a helyes korrekció osztás, nem szorzás.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy felméréshez ± 4 százalékpontos hibahatár kell (95%). Az arányról semmit sem tudunk. Hány főt kérdezzünk?`,
          options: ["601", "600", "423", "25"],
          answer: 0,
          hint: R`Ha $p$ ismeretlen, a legrosszabb esettel számolj: melyik $p$-nél legnagyobb $p(1-p)$? A $\Delta$-t tizedes törtként írd be!`,
          explain: R`$p = 0{,}5$-tel: $n = 1{,}96^2 \cdot 0{,}25/0{,}04^2 = 600{,}25$ → <b>601</b>. A 600 lefelé kerekít. A 423 a 90%-os $z = 1{,}645$-tel számol. A 25 a $\Delta$ négyzetre emelését hagyja el ($0{,}9604/0{,}04 \approx 24{,}0$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy korábbi felmérés szerint az arány kb. 20%. Legalább hány fő kell a ± 3 százalékpontos (95%) hibahatárhoz?`,
          options: ["683", "1068", "682", "854"],
          answer: 0,
          hint: R`Most van előzetes becslésünk $p$-re: írd be a $z^2 p(1-p)/\Delta^2$ képletbe!`,
          explain: R`$1{,}96^2 \cdot 0{,}2 \cdot 0{,}8/0{,}03^2 \approx 683{,}0$ → <b>683</b> (682,95, tehát a 682 kevés). Az 1068 a $p = 0{,}5$-ös legrosszabb eset – elég volna, de a feltett kérdés a <b>legkisebb</b> elég mintára vonatkozik, és ha $p$ messze van 0,5-től, kisebb minta is elég. A 854 elhagyja az $(1-p)$ tényezőt.`
        },
        {
          type: "single", shuffle: true,
          q: R`Hány fő kell egy <b>99%-os</b>, ± 2 százalékpontos hibahatárú felméréshez, ha $p$-ről semmit sem tudunk? ($z = 2{,}576$)`,
          options: ["4148", "2401", "4147", "1610"],
          answer: 0,
          hint: R`Ugyanaz a képlet, mint 95%-nál, csak a $z$ más. Ne felejtsd el a $z$-t is négyzetre emelni!`,
          explain: R`$2{,}576^2 \cdot 0{,}25/0{,}02^2 \approx 4147{,}4$ → <b>4148</b>. A 2401 a 95%-os ($z = 1{,}96$) érték. A 4147 lefelé kerekít. Az 1610 a $z$ négyzetre emelését hagyja el ($2{,}576 \cdot 0{,}25/0{,}0004$).`
        },
        {
          type: "multi",
          q: R`Melyik állítás igaz a közvélemény-kutatások mintanagyságáról? (Több jó válasz is lehet.)`,
          options: [
            "A ± 3 százalékponthoz Magyarországon (8 millió felnőtt) és az USA-ban (260 millió) is kb. 1068 fő kell.",
            "Egy 5000 fős városban a ± 3 százalékponthoz kevesebb, kb. 880 fő is elég.",
            "Az USA-ban kb. 30-szor akkora minta kell, mert a sokaság 30-szor nagyobb.",
            "A hibahatár felezéséhez kétszeres minta kell.",
            R`Ha $p$ ismeretlen, a $p = 0{,}5$ adja a legkisebb szükséges mintát.`
          ],
          answer: [0, 1],
          hint: R`Nézd meg a véges sokasági korrekciót: mikor számít a sokaság mérete? És a $\Delta$ hogyan szerepel a képletben?`,
          explain: R`Igaz az első kettő. $n_0 \approx 1067{,}1$, és $n_0/(1 + n_0/N)$ 8 milliónál és 260 milliónál is gyakorlatilag ugyanennyi – a sokaság mérete nem számít, amíg a minta a töredéke. Egy 5000 fős városban viszont a kiválasztási arány nagy, a korrekció 879,4 → 880-at ad. <b>Hamis</b> a „nagyobb sokasághoz arányosan nagyobb minta”. Hamis a kétszeres minta is: a $\Delta$ négyzetesen áll a nevezőben, a felezéshez <b>négyszeres</b> minta kell. A $p = 0{,}5$ a <b>legnagyobb</b> $p(1-p)$-t, tehát a legnagyobb mintát adja – ezért biztonságos.`
        },
        {
          type: "match",
          q: R`Hüvelykujjszabály (95%, $p$ ismeretlen): párosítsd a hibahatárt a szükséges mintanagysággal!`,
          pairs: [
            ["± 5 százalékpont", "385 fő"],
            ["± 3 százalékpont", "1068 fő"],
            ["± 2 százalékpont", "2401 fő"],
            ["± 1 százalékpont", "9604 fő"]
          ],
          hint: R`$n = 1{,}96^2/(4\Delta^2)$. A ± 3-hoz tartozó szám a fejezet kérdéséből ismerős; a többit a négyzetes összefüggés adja.`,
          explain: R`$1{,}96^2 \cdot 0{,}25/\Delta^2$: ± 5 → 384,2 → 385; ± 3 → 1067,1 → 1068; ± 2 → 2401; ± 1 → 9604. Figyeld meg: a ± 2-ről ± 1-re (felezés) négyszeres minta, a ± 3-ról ± 1-re kilencszeres. Ezért áll meg a legtöbb felmérés 1000 fő körül – a pontosság gyorsan drágul.`
        }
      ]
    },

    /* ------------------------------------------------ 6.7 */
    "ms6-67": {
      title: "Kvíz – 6.7 Bootstrap-konfidenciaintervallum",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Hogyan készül egy bootstrap-minta egy 15 elemű eredeti mintából?`,
          options: [
            "15 elemet húzunk az eredeti mintából, visszatevéssel.",
            "15 elemet húzunk az eredeti mintából, visszatevés nélkül.",
            "15 új elemet veszünk a sokaságból.",
            "Az eredeti minta felét (7–8 elemet) húzzuk ki, visszatevés nélkül."
          ],
          answer: 0,
          hint: "Mi lenne, ha visszatevés nélkül húznánk mind a 15 elemet? Mennyiben különbözne az eredetitől?",
          explain: R`A bootstrap-minta az eredeti mintából <b>visszatevéssel</b> húzott, ugyanakkora ($n$ elemű) minta: egyes adatok többször, mások egyszer sem jönnek ki. Visszatevés nélkül 15 elemet húzva mindig ugyanazt a mintát kapnánk (más sorrendben), így minden statisztika ugyanannyi lenne – nincs ingadozás. Új minta a sokaságból épp az, amire nincs lehetőségünk; a bootstrap ezt helyettesíti. A fele minta más mintanagyság, más standard hiba.`
        },
        {
          type: "single", shuffle: true,
          q: R`2000 bootstrap-átlagot sorba rendeztünk. Melyik két sorszámú érték adja a 95%-os percentilis-intervallum határait?`,
          options: [
            "az 50. és az 1950.",
            "a 25. és a 975.",
            "a 100. és az 1900.",
            "az 50. és a 950."
          ],
          answer: 0,
          hint: "95%-hoz a 2,5%-os és a 97,5%-os percentilis kell. Mennyi a 2000 2,5%-a?",
          explain: R`$0{,}025 \cdot 2000 = 50$ és $0{,}975 \cdot 2000 = 1950$. A 25. és a 975. 1000 bootstrap-értékhez illene. A 100. és az 1900. az 5%-os és a 95%-os percentilis, vagyis a <b>90%-os</b> intervallum. Az 50. és a 950. vegyes hiba: alul 2000-rel, felül 1000-rel számol.`
        },
        {
          type: "multi",
          q: R`Melyik igaz a bootstrap-percentilis-intervallumra? (Több jó válasz is lehet.)`,
          options: [
            "Nem kell hozzá normális sokaság.",
            "Olyan statisztikára is ad KI-t, amelyre nincs egyszerű képlet (medián, korreláció).",
            "6–8 elemű mintán is megbízható, hiszen akárhány bootstrap-mintát vehetünk.",
            "Kijavítja a torzított (nem reprezentatív) mintavétel hibáját.",
            "A minta maximumára is jól működik."
          ],
          answer: [0, 1],
          hint: R`A bootstrap csak azt „látja”, ami az eredeti mintában benne van. Mi következik ebből kis mintánál, torzított mintánál és a maximumnál?`,
          explain: R`Igaz az első kettő: a bootstrap képlet és normalitás nélkül, a minta tényleges alakjából dolgozik, ezért mediánra, korrelációra is jó. <b>Hamis</b>, hogy kis mintán megbízható: a bootstrap-minták számának növelése nem pótolja a kevés eredeti adatot – kis mintán a sáv túl szűk (20–30 elem alatt óvatosan). Torzított mintát sem javít: ha a minta nem tükrözi a sokaságot, az újraminták sem. A maximumra rossz, mert az újraminták maximuma sosem haladja meg az eredeti maximumot.`
        },
        {
          type: "single", shuffle: true,
          q: R`A konzervek szórására a $\chi^2$-intervallum [9,71; 20,92], a bootstrap-percentilis-intervallum kb. [9,0; 15,9]. Mi a helyes értékelés, ha a töltősúly normális?`,
          options: [
            R`A $\chi^2$-intervallum a megbízható; a bootstrap 15 adatból alábecsüli a bizonytalanságot, ezért túl szűk.`,
            "A bootstrap a jobb, mert szűkebb, tehát pontosabb.",
            R`A $\chi^2$-intervallum hibás, mert nem szimmetrikus a 13,27-re.`,
            "A két módszer ugyanazt adja, az eltérés csak kerekítés."
          ],
          answer: 0,
          hint: "Normális sokaságnál melyik módszer pontos? És mit „lát” a bootstrap 15 adatból a ritka, nagy eltérésekből?",
          explain: R`Normális sokaságnál a $\chi^2$-intervallum pontos. A bootstrap újraminták szórása sosem lehet nagyobb, mint amit a 15 adat „megenged”, a ritka nagy eltéréseket nem látja – kis mintán a bootstrap-sáv túl optimista. A szűkebb sáv csak akkor jobb, ha közben tartja a megbízhatóságot; itt nem tartja. Az aszimmetria nem hiba, a $\chi^2$ jobbra ferdeségéből jön. A különbség (a felső határ 20,9 vs. 15,9) messze nem kerekítés.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ingázási idők (12 adat, jobbra ferde, egy 61 perces kiugró értékkel): $t$-KI [17,7; 35,6], bootstrap-KI kb. [19,9; 35,0]. Miért aszimmetrikus a bootstrap-sáv az átlag (26,7) körül?`,
          options: [
            "A ferde adatban kis átlagokhoz nincs „honnan” jönni, nagyokhoz (a 61-es többszöri kihúzásával) van – a bootstrap a minta tényleges alakját követi.",
            "Mert a bootstrap-mintákat visszatevés nélkül húzzuk.",
            "A bootstrap mindig aszimmetrikus, az adatok alakjától függetlenül.",
            R`Mert a $t$-kvantilis helyett $z$-t használ.`
          ],
          answer: 0,
          hint: R`A $t$-KI képlete eleve $\bar x \pm \Delta$ alakú. A bootstrap-eloszlás alakját mi határozza meg?`,
          explain: R`A $t$-intervallum a képlete miatt szimmetrikus. A bootstrap-eloszlás a minta alakját tükrözi: ferde adatnál ferde a bootstrap-eloszlás is. A nagy átlagokat a kiugró 61-es többszöri kihúzása adja, kis átlagokhoz nincs ilyen szélső érték – ezért balra rövidebb a sáv. A bootstrap visszatevéssel húz, nem visszatevés nélkül. Szimmetrikus adatnál a bootstrap-sáv is közel szimmetrikus. A bootstrap-percentilis-intervallum egyáltalán nem használ $z$- vagy $t$-kvantilist.`
        },
        {
          type: "set",
          q: R`Melyik esetben a bootstrap-percentilis-intervallum a jó választás? (Jelöld meg mindet!)`,
          items: [
            "80 háztartás jövedelmének mediánja",
            "30 pontpár korrelációs együtthatója",
            "200 elemű, nagyjából szimmetrikus minta átlaga",
            "50 elemű minta maximuma",
            "6 elemű minta szórása"
          ],
          answer: [
            "80 háztartás jövedelmének mediánja",
            "30 pontpár korrelációs együtthatója"
          ],
          hint: "Van-e megbízható képlet? Ha nincs: elég nagy-e a minta, és nem szélsőértékről van-e szó?",
          explain: R`A mediánra és a korrelációra nincs egyszerű képlet, a minták elég nagyok: ide bootstrap kell (a korrelációnál pontpárokat húzunk visszatevéssel). A 200 elemű szimmetrikus minta átlagára a $t$-intervallum pontos – a bootstrap ugyanazt adná, de nincs rá szükség. A maximumra a bootstrap rossz: az újraminták maximuma sosem lépi túl az eredetit. 6 elemnél a bootstrap erősen alábecsüli a bizonytalanságot; normális sokaságnál ott a $\chi^2$-intervallum a jobb.`
        },
        {
          type: "single", shuffle: true,
          q: R`Ugyanarra a várható értékre a $t$-KI [12; 20], a bootstrap-KI [13; 26]. Mit gyanítasz?`,
          options: [
            R`Erősen jobbra ferde adatot nagy kiugró értékekkel – a $t$-intervallum itt kevésbé megbízható, nézd meg a hisztogramot.`,
            "A bootstrap biztosan hibás, mert eltér a képlettől – a t-KI-t kell elfogadni.",
            "Balra ferde adatot, sok kis kiugró értékkel.",
            "Nincs mit gyanítani: a két módszer mindig ennyire eltér."
          ],
          answer: 0,
          hint: "Merre nyúlik el a bootstrap-sáv a t-sávhoz képest? És mit mond a hüvelykujjszabály, ha a két módszer nagyon eltér?",
          explain: R`A bootstrap-sáv jobbra elnyúlik (felső határ 26 vs. 20): ez jobbra ferde, nagy kiugró értékeket tartalmazó adatra utal. A hüvelykujjszabály szerint, ha a képlet és a bootstrap nagyon eltér, az <b>jelzés</b>: nézd meg alaposabban az adatokat. Nem a bootstrap a „hibás” – ferde adatnál épp a $t$-intervallum szimmetriája gyanús. Balra ferde adatnál a sáv balra nyúlna el. Ha a feltételek teljesülnek, a két módszer nagyon hasonlót ad (a konzerveknél [390,65; 405,35] vs. [391,6; 404,6]).`
        }
      ]
    },

    /* ------------------------------------------------ fejezetzáró */
    "ms6-final": {
      title: "Fejezetzáró teszt – 6. Becslés",
      questions: [
        {
          type: "single", shuffle: true,
          q: R`Egy $\theta$ paraméterre két becslés van. Az A torzítatlan, szórásnégyzete 10. A B torzítása $-2$, szórásnégyzete 5. Mennyi a B átlagos négyzetes hibája (MSE)?`,
          options: ["9", "3", "5", "7"],
          answer: 0,
          hint: R`$\mathrm{MSE} = b^2 + D^2$. Figyelj a torzítás előjelére és a négyzetre!`,
          explain: R`$\mathrm{MSE}(B) = (-2)^2 + 5 = 9 \lt 10 = \mathrm{MSE}(A)$: a torzított B a jobb. A 3 a $b + D^2$ hibás képletből jön ($-2 + 5$), a 7 az $|b| + D^2$-ből – mindkettő elfelejti a négyzetet. Az 5 csak a szórásnégyzet: torzított becslésnél ez kevés, az MSE a torzítást is bünteti.`
        },
        {
          type: "multi",
          q: R`Melyik becslés <b>konzisztens</b> a mellé írt paraméterre? (Több jó válasz is lehet.)`,
          options: [
            R`$\bar X$ a $\mu$-re`,
            R`$\hat\sigma^2_n$ (az $n$-es nevezőjű szórásnégyzet) a $\sigma^2$-re`,
            R`$\bar X + \frac1n$ a $\mu$-re`,
            R`$X_1$ (az első megfigyelés) a $\mu$-re`,
            R`$\frac{X_1 + X_n}{2}$ a $\mu$-re`
          ],
          answer: [0, 1, 2],
          hint: R`Elég feltétel: aszimptotikusan torzítatlan, és a szórásnégyzete 0-hoz tart. Melyiknek csökken a szórásnégyzete $n$-nel?`,
          explain: R`$\bar X$: torzítatlan, $D^2 = \sigma^2/n \to 0$ – konzisztens. $\hat\sigma^2_n$: torzított, de aszimptotikusan torzítatlan ($\frac{n-1}{n} \to 1$), szórásnégyzete 0-hoz tart – konzisztens. $\bar X + \frac1n$: a torzítás $\frac1n \to 0$ – konzisztens. Az $X_1$ torzítatlan, de a szórásnégyzete $\sigma^2$ marad, akármekkora a minta – <b>nem</b> konzisztens (a tipikus hiba: torzítatlan = jó). Az $\frac{X_1 + X_n}{2}$ szórásnégyzete mindig $\sigma^2/2$ – szintén nem.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egyenletes eloszlás a $[0; \theta]$ szakaszon, minta: 1, 3, 11. Mi a $\theta$ <b>maximum likelihood</b> becslése?`,
          options: ["11", "10", "5", "14,67"],
          answer: 0,
          hint: R`A likelihood $\theta^{-3}$, ha $\theta$ legalább akkora, mint minden adat, különben 0. Hol a legnagyobb?`,
          explain: R`$L(\theta) = \theta^{-3}$, ha $\theta \ge 11$, különben 0. A $\theta^{-3}$ csökken, ezért a legkisebb megengedett érték a maximum: $\hat\theta = \max = 11$. A 10 a momentum-becslés ($2\bar x = 2 \cdot 5$) – kisebb a megfigyelt 11-nél, tehát lehetetlen. Az 5 a mintaátlag, az a $\theta/2$-t becsüli. A 14,67 $= \frac{n+1}{n}\max$ a torzításra javított becslés – torzítatlan, de nem az ML (az ML nem mindig torzítatlan).`
        },
        {
          type: "single", shuffle: true,
          q: R`10 dobásból 7 fej: $L(0{,}7) = 0{,}00222$ a legnagyobb likelihood. Mit jelent ez helyesen?`,
          options: [
            R`A $p = 0{,}7$ mellett a legvalószínűbb, hogy épp ez a sorozat jön ki.`,
            R`A $p$ értéke 0,222% valószínűséggel 0,7.`,
            R`A $p = 0{,}7$ a $p$ legvalószínűbb értéke.`,
            R`A $p$ biztosan 0,7, hiszen az ML becslés torzítatlan.`
          ],
          answer: 0,
          hint: R`A likelihood a megfigyelt adat valószínűsége a paraméter függvényében. Van-e a $p$-nek valószínűsége a klasszikus statisztikában?`,
          explain: R`A likelihood <b>az adat</b> valószínűsége egy adott $p$ mellett: $L(p) = p^7(1-p)^3$. A $p$ rögzített (csak ismeretlen) szám, nincs valószínűsége – ezért pontatlan a „$p$ legvalószínűbb értéke”, és hamis a „0,222% valószínűséggel 0,7”. Az ML becslés sem „biztos” érték, csak egy becslés; és az ML nem mindig torzítatlan (pl. a normális eloszlás $\hat\sigma^2_n$-e).`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaságból $n = 16$, $\bar x = 40$, $s = 6$. Mi a 95%-os KI a várható értékre? ($t_{15;\,0{,}975} = 2{,}131$)`,
          options: ["[36,80; 43,20]", "[37,06; 42,94]", "[27,21; 52,79]", "[37,53; 42,47]"],
          answer: 0,
          hint: R`A $\sigma$-t a mintából becsüljük. Mekkora a becsült standard hiba?`,
          explain: R`$s/\sqrt n = 6/4 = 1{,}5$; $\Delta = 2{,}131 \cdot 1{,}5 \approx 3{,}20$; KI: $[36{,}80;\ 43{,}20]$. A [37,06; 42,94] $z = 1{,}96$-tal számol – kis mintánál, ismeretlen $\sigma$ mellett túl szűk. A [27,21; 52,79] elhagyja a $\sqrt n$-t ($2{,}131 \cdot 6$): az az adatok szóródása, nem az átlagé. A [37,53; 42,47] az $1{,}645$-öt használja, ami a 90%-os $z$.`
        },
        {
          type: "multi",
          q: R`A konzervek várható töltősúlyára a 95%-os KI [392,94; 403,06] g. Melyik megfogalmazás helyes? (Több jó válasz is lehet.)`,
          options: [
            "Az eljárás a lehetséges minták kb. 95%-ában olyan sávot ad, amely lefedi a valódi várható értéket.",
            "A 400 g benne van a sávban, így az adat összeegyeztethető a gyártó állításával.",
            "A konzervek 95%-a 392,94 és 403,06 g közötti.",
            "Egy újabb 15 konzerves minta átlaga 95% eséllyel a sávba esik.",
            "A 99%-os KI ugyanebből a mintából szűkebb, tehát pontosabb lenne."
          ],
          answer: [0, 1],
          hint: R`Mi a véletlen: a $\mu$ vagy a sáv? És a KI az egyes konzervekről vagy az átlagról szól?`,
          explain: R`Az első kettő helyes: a 95% az <b>eljárás</b> tulajdonsága, és a sávon belüli 400 összeegyeztethető az adattal. Az egyes konzervek kb. $\pm 19{,}6$ g-on belül szóródnak, a KI csak az átlagról szól. Egy új átlag nem 95%-ban, hanem csak kb. 83%-ban esik a sávba, mert a sáv közepe maga is ingadozik. A 99%-os KI <b>szélesebb</b> (megbízhatóbb, de kevésbé pontos).`
        },
        {
          type: "single", shuffle: true,
          q: R`900 megkérdezettből 360 támogat egy javaslatot. Mi a 95%-os Wald-intervallum?`,
          options: ["[36,8%; 43,2%]", "[37,3%; 42,7%]", "[38,7%; 41,3%]", "[35,8%; 44,2%]"],
          answer: 0,
          hint: R`$\hat p = 0{,}4$. A hibahatár $1{,}96\sqrt{\hat p(1-\hat p)/n}$ – és százalékpontban kell hozzáadni.`,
          explain: R`$\mathrm{SE} = \sqrt{0{,}4 \cdot 0{,}6/900} \approx 0{,}0163$; $\Delta = 1{,}96 \cdot 0{,}0163 \approx 0{,}032$ – azaz 3,2 <b>százalékpont</b>: [36,8%; 43,2%]. A [37,3%; 42,7%] a 90%-os $z = 1{,}645$-tel készült, a [35,8%; 44,2%] a 99%-os $2{,}576$-tal. A [38,7%; 41,3%] a százalék–százalékpont keverése: a 40%-nak vette a 3,2%-át (1,28 pont).`
        },
        {
          type: "single", shuffle: true,
          q: R`30 tesztből egyik sem volt hibás. Kb. mennyi a hibaarány 95%-os felső határa?`,
          options: ["10%", "0%", "3,3%", "5%"],
          answer: 0,
          hint: "0 esemény esetén a Wald használhatatlan. Van egy egyszerű szabály a felső határra.",
          explain: R`A „3-as szabály”: 0 esemény $n$ próbából → a 95%-os felső határ kb. $3/n = 3/30 = 10\%$. A 0% a Wald-intervallum ([0; 0]) – azt állítaná, hogy biztosan nincs hiba, ami butaság. A 3,3% $= 1/30$ azt az arányt adja, mintha egy hibát láttunk volna – felső határnak túl optimista. Az 5% az $\alpha$-t keveri össze a felső határral.`
        },
        {
          type: "single", shuffle: true,
          q: R`Normális sokaság, $n = 20$, $s = 4$. Mi a 95%-os KI $\sigma$-ra? ($\chi^2_{19}$: 8,907 és 32,852)`,
          options: ["[3,04; 5,84]", "[9,25; 34,13]", "[3,12; 5,99]", "[1,52; 2,92]"],
          answer: 0,
          hint: R`$(n-1)s^2$-et oszd a két kvantilissel – a nagyobbikkal az alsó határhoz –, aztán vonj gyököt.`,
          explain: R`$19 \cdot 16 = 304$; $\sigma^2 \in [304/32{,}852;\ 304/8{,}907] = [9{,}25;\ 34{,}13]$; $\sigma \in [3{,}04;\ 5{,}84]$. A [9,25; 34,13] a szórásnégyzet sávja, gyökvonás nélkül. A [3,12; 5,99] $n = 20$-szal szoroz $n - 1$ helyett. Az [1,52; 2,92] $s^2$ helyett $s$-sel számol. Vedd észre: a sáv aszimmetrikus a 4-re.`
        },
        {
          type: "single", shuffle: true,
          q: R`$\sigma = 8$. Legalább mekkora minta kell, hogy a <b>99%-os</b> KI teljes szélessége legfeljebb 4 legyen? ($z = 2{,}576$)`,
          options: ["107", "106", "27", "62"],
          answer: 0,
          hint: R`A teljes szélesség $2\Delta$. Utána $n \ge (z\sigma/\Delta)^2$, felfelé kerekítve.`,
          explain: R`$\Delta = 2$: $(2{,}576 \cdot 8/2)^2 = 10{,}304^2 \approx 106{,}2$ → <b>107</b>. A 106 lefelé kerekít. A 27 a szélességet vette hibahatárnak ($\Delta = 4$: $\approx 26{,}5$). A 62 a 95%-os $z = 1{,}96$-tal számol ($\approx 61{,}5$).`
        },
        {
          type: "single", shuffle: true,
          q: R`Melyik állítás igaz a bootstrap-percentilis-intervallumra?`,
          options: [
            "Kis mintán általában túl szűk: a névlegesnél ritkábban fedi le a paramétert.",
            "Kis mintán is megbízható, mert akárhány bootstrap-mintát vehetünk.",
            "Mindig szélesebb a képletes intervallumnál, ezért biztonságosabb.",
            "Csak normális sokaságra használható, mint a szórás χ²-intervalluma."
          ],
          answer: 0,
          hint: R`A bootstrap az eredeti mintát újramintázza. Mit nem lát egy kis minta a sokaságból?`,
          explain: R`A bootstrap-intervallum kis mintán túl optimista: az újraminták nem tartalmazhatnak olyan nagy eltérést, ami az eredeti mintában nincs (a konzervek szórásánál [9,0; 15,9] a $\chi^2$-sáv [9,71; 20,92]-jével szemben). Több bootstrap-minta csak a percentilisek számolási hibáját csökkenti, az eredeti adatok kevésségét nem pótolja. Nem mindig szélesebb – inkább szűkebb. Normális sokaságot pedig épp nem igényel: ez az egyik nagy előnye.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy 1000 fős felmérésben a Zöld Út 31% ([28,1%; 33,9%]), egy másik párt 27% ([24,2%; 29,8%]). Mi a helyes következtetés?`,
          options: [
            "Ebből nem dönthető el, hogy a Zöld Út vezet: a különbség hibahatára kb. ± 4,7 százalékpont, a 4 pontos előny belefér.",
            "A sávok átfednek, tehát biztosan nincs különbség a két párt között.",
            "A Zöld Út biztosan vezet, hiszen 31 > 27.",
            "A különbség hibahatára a két hibahatár összege, kb. ± 5,6 százalékpont, ezért a sávokat kell összevetni."
          ],
          answer: 0,
          hint: "Az átfedés vagy a pontbecslések sorrendje dönt – vagy a különbségre kell külön intervallum?",
          explain: R`A helyes eljárás: a <b>különbségre</b> számolj intervallumot. Két arány egy mintából: a különbség hibahatára kb. ± 4,7 százalékpont, a 4 pontos előny belefér – a minta alapján nem biztos, hogy a Zöld Út vezet. Az átfedésből <b>nem</b> következik, hogy nincs különbség (a különbség hibahatára kisebb, mint a két hibahatár összege, így a ± 5,6 is téves). A 31 > 27 pedig figyelmen kívül hagyja a mintavételi ingadozást.`
        },
        {
          type: "single", shuffle: true,
          q: R`Egy hír: „52% támogatja, ± 2,5 százalékpont (95%)”. Kb. mekkora volt a minta?`,
          options: ["kb. 1530 fő", "kb. 1080 fő", "kb. 5670 fő", "kb. 40 fő"],
          answer: 0,
          hint: R`Fejezd ki $n$-et a $\Delta = 1{,}96\sqrt{\hat p(1-\hat p)/n}$ képletből! A $\Delta$ százalékpont: tizedes törtként 0,025.`,
          explain: R`$n = 1{,}96^2 \cdot 0{,}52 \cdot 0{,}48/0{,}025^2 \approx 1534$ – kb. 1530 fő. A kb. 1080 a 90%-os $z = 1{,}645$-tel számol. A kb. 5670 a százalék–százalékpont keverése: a 52% 2,5%-át (1,3 pont) vette hibahatárnak. A kb. 40 a $\Delta$ négyzetre emelését hagyja el.`
        },
        {
          type: "match",
          q: R`Melyik intervallum kell? Párosítsd a helyzetet a módszerrel!`,
          pairs: [
            [R`átlag, a gép szórása ismert ($\sigma = 10$ g)`, "z-intervallum"],
            ["átlag, 12 elemű normális minta, a szórást a mintából számoljuk", "t-intervallum, n − 1 szabadságfok"],
            ["arány, 25 betegből 1 mellékhatás", "Wilson vagy „plusz négy”"],
            ["egy gép szórása, normális töltősúlyok", "khi-négyzet-intervallum"],
            ["60 lakás árának mediánja", "bootstrap-percentilis-intervallum"]
          ],
          hint: "Mit becsülsz (átlag, arány, szórás, más)? Ismert-e a szórás? Elég sok-e az „igen”?",
          explain: R`Átlag, ismert $\sigma$ → $z$. Átlag, $s$ a mintából → $t_{n-1}$ (kis mintánál normális sokaság kell). Arány kevés „igennel” ($n\hat p = 1 \lt 10$) → a Wald nem megbízható, Wilson vagy „plusz négy”. Szórás normális sokaságból → $\chi^2$-intervallum (aszimmetrikus). Mediánra nincs egyszerű képlet → bootstrap-percentilis. A tipikus csere a $z$ ↔ $t$: ha a szórást a mintából számoljuk, a $t$-kvantilis kell.`
        }
      ]
    },

  };

  window.Quiz && window.Quiz.mountAll(QUIZZES);
})();
