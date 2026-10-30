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
