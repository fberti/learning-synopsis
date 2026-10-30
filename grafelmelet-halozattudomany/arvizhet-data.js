/* =========================================================
   Árvízhét – a Gráfelmélet és hálózattudomány témakör futó példája
   Kitalált mini hírkorpusz: 4 lap, 12 cikk, 7 szereplő / fogalom, egy hét.
   AZ ADATOK RÖGZÍTETTEK – a későbbi fejezetek számai erre épülnek, ne módosítsd!
   (Ellenőrzés: _parts/gh1/arviz.py)
   ========================================================= */
window.ARVIZHET = {
  papers: [
    { id: "RH", name: "Reggeli Hírlap", color: "--setA" },
    { id: "EK", name: "Esti Krónika", color: "--setB" },
    { id: "NY", name: "Nyitott Szó", color: "--setC" },
    { id: "VN", name: "Vidéki Napló", color: "#a855f7" }
  ],
  actors: [
    { id: "Ko", name: "Kormány" },
    { id: "Vi", name: "Vízügy" },
    { id: "Po", name: "Polgármester" },
    { id: "La", name: "Lakók" },
    { id: "Ön", name: "Önkéntesek" },
    { id: "Sz", name: "Szakértő" },
    { id: "Kl", name: "Klímaváltozás" }
  ],
  days: ["H", "K", "Sze", "Cs", "P", "Szo", "V"],
  dayNames: { H: "hétfő", K: "kedd", Sze: "szerda", Cs: "csütörtök", P: "péntek", Szo: "szombat", V: "vasárnap" },
  frames: { vedekezes: "védekezés", hiany: "felkészülési hiány", veszteseg: "lakossági veszteség" },
  /* mentions: említett szereplők; speakers: megszólaltatott szereplők; frame: fő keret */
  articles: [
    { id: 1,  paper: "RH", day: "H",   title: "Teljes készültség: a kormány a gátakhoz vezényli az erőket",               mentions: ["Ko", "Vi"],       speakers: ["Ko"],       frame: "vedekezes" },
    { id: 2,  paper: "RH", day: "Sze", title: "A vízügy szerint tart a gát – a polgármester köszönetet mondott a kormánynak", mentions: ["Ko", "Vi", "Po"], speakers: ["Vi"],       frame: "vedekezes" },
    { id: 3,  paper: "RH", day: "P",   title: "Kormányzati gyorssegély érkezik a polgármesteri hivatalokba",            mentions: ["Ko", "Po"],       speakers: ["Ko"],       frame: "vedekezes" },
    { id: 4,  paper: "EK", day: "H",   title: "Szakértő: a vízügy évek óta jelezte a gát gyengeségeit",                 mentions: ["Vi", "Sz"],       speakers: ["Sz"],       frame: "hiany" },
    { id: 5,  paper: "EK", day: "Cs",  title: "Klímaváltozás és elmaradt beruházások – szakértő bírálja a kormányt",   mentions: ["Sz", "Kl", "Ko"], speakers: ["Sz"],       frame: "hiany" },
    { id: 6,  paper: "EK", day: "Szo", title: "Egyre gyakoribbak lesznek az ilyen árvizek, figyelmeztet a klímakutató", mentions: ["Sz", "Kl"],       speakers: ["Sz"],       frame: "hiany" },
    { id: 7,  paper: "NY", day: "K",   title: "Elöntött pincék – a lakók és az önkéntesek éjjel is homokzsákoznak",    mentions: ["La", "Ön"],       speakers: ["La"],       frame: "veszteseg" },
    { id: 8,  paper: "NY", day: "Cs",  title: "A polgármester a lakókkal és az önkéntesekkel együtt pakolta a zsákokat", mentions: ["La", "Po", "Ön"], speakers: ["La", "Po"], frame: "veszteseg" },
    { id: 9,  paper: "NY", day: "V",   title: "Mi lesz a károsult lakókkal? Az önkéntesek gyűjtést indítottak",        mentions: ["La", "Ön"],       speakers: ["Ön"],       frame: "veszteseg" },
    { id: 10, paper: "VN", day: "K",   title: "A polgármester a vízügy szakembereivel bejárta a töltést",               mentions: ["Po", "Vi"],       speakers: ["Po"],       frame: "vedekezes" },
    { id: 11, paper: "VN", day: "Sze", title: "Lakossági fórumot tartott a polgármester",                               mentions: ["Po", "La"],       speakers: ["La"],       frame: "veszteseg" },
    { id: 12, paper: "VN", day: "Szo", title: "Önkénteseket köszöntött a polgármester",                                 mentions: ["Ön", "Po"],       speakers: ["Ön"],       frame: "veszteseg" }
  ]
};

/* ---------------------------------------------------------
   Bővítés a 3. fejezethez (2026-10-30) – szintén rögzített adat.
   events:    az Árvízhét 6 eseménye és a róluk szóló cikkek
   citations: cikk → cikk hivatkozások (mindig korábbi vagy azonos napi cikkre)
   relations: előjeles viszonyok szereplők között (+ támogató / − bíráló), a forráscikkel
   triples:   tudásgráf-hármasok (alany, állítmány, tárgy), a forráscikkel
   (Ellenőrzés: _parts/gh3/check.py)
   --------------------------------------------------------- */
Object.assign(window.ARVIZHET, {
  events: [
    { id: "E1", title: "Készültség a gátakon",                  days: "H",      articles: [1, 4] },
    { id: "E2", title: "Elöntött pincék, töltésbejárás",        days: "K",      articles: [7, 10] },
    { id: "E3", title: "Tart a gát – lakossági fórum",          days: "Sze",    articles: [2, 11] },
    { id: "E4", title: "Közös homokzsákolás",                    days: "Cs",     articles: [8] },
    { id: "E5", title: "Vita a beruházásokról és a klímáról",   days: "Cs–Szo", articles: [5, 6] },
    { id: "E6", title: "Segély és gyűjtés",                      days: "P–V",    articles: [3, 9, 12] }
  ],
  citations: [[3, 2], [4, 1], [5, 2], [5, 4], [6, 5], [8, 7], [9, 5], [9, 8], [10, 1], [11, 7], [11, 10], [12, 8]],
  relations: [
    { a: "Ko", b: "Vi", sign: +1, article: 1, text: "a kormány és a vízügy együtt irányítja a védekezést" },
    { a: "Sz", b: "Vi", sign: +1, article: 4, text: "a szakértő egyetértőleg idézi a vízügy figyelmeztetéseit" },
    { a: "Po", b: "Ko", sign: +1, article: 2, text: "a polgármester köszönetet mond a kormánynak" },
    { a: "Vi", b: "Po", sign: +1, article: 2, text: "a vízügy és a polgármester közösen nyilatkozik" },
    { a: "Sz", b: "Ko", sign: -1, article: 5, text: "a szakértő bírálja a kormányt" },
    { a: "La", b: "Ön", sign: +1, article: 7, text: "a lakók és az önkéntesek együtt homokzsákoznak" },
    { a: "Po", b: "La", sign: +1, article: 8, text: "a polgármester a lakókkal együtt dolgozik" },
    { a: "Po", b: "Ön", sign: +1, article: 8, text: "a polgármester az önkéntesekkel együtt dolgozik" }
  ],
  triples: [
    ["Kormány", "vezényel", "Védekezők", 1],
    ["Polgármester", "köszönetet mond", "Kormány", 2],
    ["Vízügy", "kijelenti, hogy tart", "Gát", 2],
    ["Kormány", "segélyt küld", "Polgármester", 3],
    ["Szakértő", "idézi", "Vízügy", 4],
    ["Vízügy", "figyelmeztetett", "Gát", 4],
    ["Szakértő", "bírálja", "Kormány", 5],
    ["Klímaváltozás", "gyakoribbá teszi", "Árvíz", 6],
    ["Önkéntesek", "gyűjtést indít", "Lakók", 9],
    ["Polgármester", "bejárja", "Gát", 10],
    ["Polgármester", "fórumot tart", "Lakók", 11],
    ["Polgármester", "köszönti", "Önkéntesek", 12]
  ]
});
