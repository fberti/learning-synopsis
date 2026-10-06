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
│   └── quiz.js                     ← általános kvízmotor
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
│   └── 04-nevezetes-eloszlasok/
│       └── (ugyanígy)
└── matematikai-statisztika/
    ├── index.html                  ← a témakör fejezetlistája
    └── TERV.md                     ← a 14 fejezet részletes kidolgozási terve
```

## Közzététel GitHub Pages-en

1. Tedd a `synopsis` mappa tartalmát egy GitHub-repóba (a gyökérbe vagy a `/docs` mappába).
2. A repó *Settings → Pages* menüjében válaszd a megfelelő branch-et és mappát.

Helyi megtekintés: `python3 -m http.server` a `synopsis` mappában, majd <http://localhost:8000>.

## Új fejezet hozzáadása

1. Hozz létre egy új mappát, pl. `valoszinusegszamitas/05-nagy-szamok-torvenye/`, az 1. fejezet mintájára.
2. Szemléltetés: `<div class="widget" data-widget="név"></div>` + a `widgets.js`-ben `W["név"] = root => {...}`.
3. Kvíz: `<div class="quiz" data-quiz="azonosító"></div>` + a `quizzes.js`-ben a kérdések
   (típusok: `single`, `multi`, `numeric`, `match`, `set` – lásd `assets/quiz.js`).
4. Frissítsd a témakör `index.html`-jét és a főoldal `data-progress` listáját az új kvízazonosítókkal.

Matematika: KaTeX, `$...$` (sorközi) és `$$...$$` (kiemelt) jelöléssel.
