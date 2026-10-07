<!-- Az AGENTS.md a CLAUDE.md tartalmát tükrözi (Codex, Cursor és más ágensek ezt olvassák).
     Ha az egyiket módosítod, a másikat is frissítsd! -->

# Synopsis – tananyagírási útmutató

Ez a mappa egy interaktív, statikus tanulási oldal (lásd `README.md`: szerkezet, közzététel, új fejezet hozzáadása).
Minden új vagy átírt tananyagnak az alábbi sémát kell követnie. A mintapélda:
`valoszinusegszamitas/01-esemenyek-es-valoszinuseg/index.html` – **1.4.2 Kombinatorika** szakasz.

## Felépítés – minden fejezetre / szakaszra

1. **Motiváció:** egy konkrét kérdés, amire a szakasz végén választ adunk.
2. **Útiterv:** számozott lista a lépésekről, horgonylinkekkel (`#sXXX-a`, `#sXXX-b`, …).
3. **Lépések az egyszerűtől a bonyolultig.** Minden új fogalom az előző korlátjából következzen
   („eddig X volt, de mi van, ha…?”). Az előismeretet (jelölés, számolási technika) külön lépésként
   vezesd be, mielőtt használod.
4. **Minden lépésen belül:**
   1. kis, kézzel végigszámolható eset – ha lehet, teljes felsorolással;
   2. ebből általánosítva a szabály / képlet (`box def`) egy rövid „miért?”-tel;
   3. 2–3 kidolgozott példa (`box example`), mindegyik egylépéses, kis számokkal, egyetlen új ötlettel;
   4. buktató-doboz (`box warn`) a tipikus hibákra, ott, ahol elkövethetők;
   5. gyakorló blokk (`details.box.practice`, **csukva**): kb. 5 feladat csak az épp tanult szabályra,
      enyhén nehezedve, feladatonként lenyíló, részletes megoldással.
5. **Alkalmazás** külön részben, miután minden eszköz megvan.
6. **Összefoglalás** + döntési táblázat („melyik módszer mikor?”).
7. **Ellenőrző / fejezetvégi kvíz** (lásd lent).

## Elvek

- **Előbb a konkrét eset, aztán a képlet** – soha fordítva.
- **Szembeállító párok:** ugyanaz a feladat egyetlen paraméterben eltérve (pl. ismétléssel / ismétlés
  nélkül), egymás mellett (`<div class="two-col">`).
- **Egy példa = egy új gondolat.** Trükkös, többlépéses feladat csak a gyakorló blokkok végén vagy az
  alkalmazás részben.
- **Hüvelykujjszabályok kiemelve** (pl. „az »és« szorzást jelent”).
- **Forráskönyv:** szoros követése nem kötelező – példákat, sorrendet át lehet venni belőle, de a
  felépítés mindig a fenti elveket kövesse. Ha a forrás kimarad valamiből, amit a magyar tananyag
  tartalmaz, egészítsd ki, és jelöld („Kiegészítés”).
- **Terminológia:** magyar elnevezések és jelölések. Ha az angol szakirodalom eltér
  (pl. ${}_nP_r$ = variáció), egy `box tip` mondja meg a megfelelést.
- **Stílus:** rövid mondatok, tegező hangnem, magyar tizedesvessző (KaTeX-ben `0{,}5`), ezres
  tagolás `\,`-vel.
- **Ellenőrzés:** minden numerikus eredményt (példák, gyakorló feladatok, kvízválaszok és rossz
  válaszok) Pythonnal ellenőrizni kell.

## Lenyílók – mi legyen csukva?

- **Gyakorló blokkok és kvízek: mindig csukott lenyíló mögött, kivétel nélkül.** Betöltéskor egyik sem lehet nyitva
  (`<details>` `open` nélkül). Ez vonatkozik a lépésenkénti gyakorló blokkokra, a „Vegyes gyakorló feladatok” részre és
  minden kvízre. A blokkon belül a megoldások továbbra is feladatonként külön lenyílóban vannak.
- **Kidolgozott példák maradhatnak nyitva** (a megoldásuk lehet lenyílóban); definíció, tétel, buktató is látható.

## Kvízek

- **Mindig lenyíló mögött, alapból csukva – kivétel nélkül.** A kvíz (kérdések, válaszok, tippek, megoldások) sosem
  látszik azonnal; az olvasó maga nyitja ki. Ezt a kvízmotor (`assets/quiz.js`) intézi, ezért kvízt **csak**
  `<div class="quiz" data-quiz="…">` + `quizzes.js` formában adj hozzá – kvízkérdést ne írj közvetlenül a HTML-be,
  és ne tedd a kvízt nyitott (`open`) `<details>`-be. Ha mégis kézzel kell kvízt írni (más oldal, Markdown jegyzet),
  az is csukott lenyílóba kerüljön (`<details>` `open` nélkül, illetve Obsidianban `> [!question]-` callout).
  Ellenőrzéskor nézd meg böngészőben, hogy betöltéskor egyik kvíz sincs nyitva.
- **Minden kérdésnek legyen `hint`-je:** ötlet a megoldás elindításához (melyik szabály, mire figyelj),
  de ne árulja el a választ. Megjelenése: lenyitható „💡 Tipp”.
- **Minden kérdésnek legyen `explain`-je:** részletes magyarázat, lehetőleg a tipikus hibára is kitérve.
- **Gépelés nélkül megoldható** legyen: `single`, `multi`, `match`, `set` – bármelyik, ami a kérdéshez illik.
  **`numeric` típust ne használj** (a motor ugyan átalakítja, de a rossz válaszokat ott gép generálja).
- **Rossz válaszok:** kézzel írva, tipikus hibákból (elfelejtett tag, ellentett esemény, sorrend / ismétlés
  összekeverése, feltétel megfordítása stb.). Legyenek hihetők és egymástól különbözők.
  Számválaszoknál: `type: "single", shuffle: true`, 4 opció, egységes formátumban.

```js
{
  type: "single", shuffle: true,
  q: "Hányféleképpen választható ki 12 dobozból 3 bevizsgálásra?",
  options: ["220", "1320", "36", "1728"],   // helyes + tipikus hibák (V, 12·3, 12³)
  answer: 0,
  hint: "Számít-e, milyen sorrendben választjuk ki a dobozokat?",
  explain: R`A sorrend nem számít: $\binom{12}{3} = 220$. Az 1320 a variáció ($V_{12}^3$).`
}
```

## Technikai emlékeztető

- Megoldások mindig `<details><summary>Megoldás</summary>…</details>` mögött.
- Dobozok: `def` (definíció / képlet), `thm` (tétel), `example` (kidolgozott példa), `warn` (buktató),
  `tip` (összefoglaló, hüvelykujjszabály, terminológia).
- Gyakorló blokk – mindig csukva:
  ```html
  <details class="box practice">
    <summary>✏️ Gyakorlás – a lépés neve</summary>
    <ol>
      <li>Feladat…
        <details><summary>Megoldás</summary>…</details></li>
    </ol>
  </details>
  ```
  A „Vegyes gyakorló feladatok” rész ugyanígy, egyetlen `details.box.practice`-ban.
- Widget (`data-widget`) csak ott, ahol a fogalom már megvan, és a kísérletezés tényleg segít.
- Új kvízazonosítót vedd fel a témakör `index.html`-jébe és a főoldal `data-progress` listájába.
