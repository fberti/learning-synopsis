# Synopsis

Interaktív, statikus tanulási oldal (GitHub Pages-kompatibilis, nincs build lépés).

## Szerkezet

```
synopsis/
├── index.html                      ← főoldal (tartalomjegyzék)
├── .nojekyll                       ← GitHub Pages: Jekyll kikapcsolása
├── assets/
│   ├── style.css                   ← közös stílus (világos/sötét téma)
│   ├── common.js                   ← téma, KaTeX, tartalomjegyzék, haladás mentése
│   ├── quiz.js                     ← általános kvízmotor
│   └── calc.js                     ← analízis: képletértelmező (eval nélkül) és függvényrajzoló
├── valoszinusegszamitas/
│   ├── index.html                  ← a témakör fejezetlistája
│   ├── 01-esemenyek-es-valoszinuseg/
│   │   ├── index.html              ← a fejezet szövege
│   │   ├── widgets.js              ← interaktív szemléltetések
│   │   └── quizzes.js              ← a fejezet kvízei
│   ├── 02-felteteles-valoszinuseg-es-fuggetlenseg/
│   │   └── (ugyanígy)
│   ├── 03-valoszinusegi-valtozok/
│   │   └── (ugyanígy)
│   ├── 04-nevezetes-eloszlasok/
│   │   └── (ugyanígy)
│   └── 05-nagy-szamok-torvenye/
│       └── (ugyanígy)
├── matematikai-statisztika/
│   ├── index.html                  ← a témakör fejezetlistája
│   ├── TERV.md                     ← a 14 fejezet részletes kidolgozási terve
│   └── 01-adatok-populacio-minta/  ← index.html, widgets.js, quizzes.js
├── analizis/
│   ├── index.html                  ← a témakör fejezetlistája
│   ├── TERV.md                     ← a 11 fejezet részletes kidolgozási terve
│   └── 01-fuggvenyek-es-modellek/  ← index.html, widgets.js (a calc.js-re épül), quizzes.js
└── mesterseges-intelligencia/
    ├── index.html                  ← a témakör fejezetlistája és tanulási útvonalai
    ├── TERV.md                     ← a 24 fejezet részletes kidolgozási terve
    ├── 01-mi-a-mesterseges-intelligencia/  ← index.html, widgets.js, quizzes.js
    ├── 02-matematikai-eszkoztar/   ← index.html, widgets.js (a calc.js-re épül), quizzes.js
    ├── 03-tanulas-anatomiaja/      ← index.html, widgets.js (a calc.js-re épül), quizzes.js
    ├── 04-adatok-es-jellemzok/     ← index.html, widgets.js (a calc.js-re épül), quizzes.js
    ├── 05-osztalyozas/             ← index.html, widgets.js (a calc.js-re épül), quizzes.js
    └── 06-modellertekeles/         ← index.html, widgets.js (a calc.js-re épül), quizzes.js
```

## Közzététel GitHub Pages-en

1. Tedd a `synopsis` mappa tartalmát egy GitHub-repóba (a gyökérbe vagy a `/docs` mappába).
2. A repó *Settings → Pages* menüjében válaszd a megfelelő branch-et és mappát.

Helyi megtekintés: `python3 -m http.server` a `synopsis` mappában, majd <http://localhost:8000>.

## Új fejezet hozzáadása

1. Hozz létre egy új mappát, pl. `matematikai-statisztika/01-adatok-populacio-minta/`, az 1. fejezet mintájára.
2. Szemléltetés: `<div class="widget" data-widget="név"></div>` + a `widgets.js`-ben `W["név"] = root => {...}`.
3. Kvíz: `<div class="quiz" data-quiz="azonosító"></div>` + a `quizzes.js`-ben a kérdések
   (típusok: `single`, `multi`, `match`, `set` – lásd `assets/quiz.js`; a `numeric` elavult, ne használd).
   A kvíz automatikusan lenyílóban jelenik meg; minden kérdéshez kell `hint` és `explain`.
4. Frissítsd a témakör `index.html`-jét és a főoldal `data-progress` listáját az új kvízazonosítókkal.

Matematika: KaTeX, `$...$` (sorközi) és `$$...$$` (kiemelt) jelöléssel.

## Tananyagírási útmutató

A részletes útmutató a [`CLAUDE.md`](CLAUDE.md) és vele azonos tartalommal az [`AGENTS.md`](AGENTS.md) fájlban van (ezeket az AI-asszisztensek automatikusan beolvassák).
Mintapélda: `valoszinusegszamitas/01-esemenyek-es-valoszinuseg/` – **1.4.2 Kombinatorika** szakasz.
Röviden:

**Felépítés** (minden fejezetre / szakaszra)
1. Motiváló kérdés → útiterv (számozott lépések, horgonylinkekkel).
2. Lépések az egyszerűtől a bonyolultig; minden új fogalom az előző korlátjából nő ki,
   az előismeret (jelölés, technika) külön lépés.
3. Minden lépésen belül: kis, kézzel felsorolható eset → szabály / képlet „miért?”-tel →
   2–3 egylépéses kidolgozott példa → buktató-doboz → kb. 5 gyakorló feladat csukott lenyíló mögött, feladatonként lenyíló, részletes megoldással.
4. Alkalmazás külön részben, az összes eszköz után.
5. Összefoglalás + döntési táblázat → ellenőrző kvíz.

**Elvek**
- Előbb a konkrét eset, aztán a képlet.
- Szembeállító párok (ugyanaz a feladat egy paraméterben eltérve), egymás mellett.
- Egy példa = egy új gondolat; trükkös feladat csak a gyakorlás végén / az alkalmazásban.
- Forráskönyv követése nem kötelező, de a felépítés mindig ezeket az elveket kövesse; ami a forrásból
  hiányzik, de a magyar tananyagban benne van, azt „Kiegészítés”-ként jelöld.
- Magyar terminológia; eltérő angol elnevezésnél tip-doboz a megfeleléssel.
- Minden számeredményt Pythonnal ellenőrizni.

**Lenyílók**
- Gyakorló blokkok és kvízek mindig csukott lenyíló mögött (`details.box.practice`, illetve a kvízmotor); a kidolgozott példák maradhatnak nyitva.

**Kvízek**
- Mindig lenyíló mögött, alapból csukva – kivétel nélkül (a motor intézi; kvízt csak `data-quiz` + `quizzes.js` formában adj hozzá).
- Minden kérdésnek van `hint`-je (ötlet a megoldáshoz, a választ nem árulja el) és `explain`-je.
- Gépelés nélkül megoldható: `single`, `multi`, `match` vagy `set` – ami a kérdéshez illik.
- A rossz válaszok kézzel írva, tipikus hibákból.
