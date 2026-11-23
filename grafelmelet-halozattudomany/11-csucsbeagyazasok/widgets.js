/* =========================================================
   Gráfelmélet és hálózattudomány 11. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET),
   a karateklub: ../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js (KARATE13),
   a Les Misérables: ../08-kozossegek/lesmis-data.js (LESMIS), a politikai blogok: ../05-centralitas/polblogs-data.js (POLBLOGS),
   Krackhardt menedzserei: krack-data.js (KRACK)
   ========================================================= */
(function () {
  "use strict";
  const GK = window.GraphKit, D = window.ARVIZHET;
  const fmt = (x, d = 2) => (isFinite(x) ? (+x.toFixed(d)).toString().replace(".", ",") : "–");

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const btn = (label, onclick, cls = "btn") => h("button", { class: cls, type: "button", onclick }, label);
  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* gombcsoport, amelyből egy aktív */
  function toggleGroup(parent, items, cur, onpick) {
    const bs = items.map(([v, l]) => btn(l, () => { onpick(v); paint(v); }));
    const paint = v => bs.forEach((b, i) => b.classList.toggle("on", items[i][0] === v));
    paint(cur);
    parent.append(...bs);
    return paint;
  }
  const math = el => window.Synopsis && Synopsis.renderMath && window.renderMathInElement && Synopsis.renderMath(el);

  /* az Árvízhét szereplőinek rögzített elrendezése (ugyanaz, mint a szöveg ábráin) */
  const ACTOR_POS = { Kl: [0.6, 0], Sz: [0, 0.5], Ko: [1.3, 0.5], Vi: [0.65, 1], Po: [1.6, 1.3], La: [2.4, 1], "Ön": [2.3, 1.9] };
  const actorName = id => D.actors.find(a => a.id === id).name;

  /* ---------- mintagráfok ----------
     preset(név, aspect) → { name, nodes: [{label,x,y,sub?,color?}], edges: [{a,b,w}], directed?, weighted?, club? }
     nevek: path4, path5, c4, barat, paw, star, bowtie, twoTri, kite, arviz (súlyozott: w = közös cikkek), karate;
     irányítottak: papers (súlyozott), papersU (súly nélkül), pr4, hits5 */
  const PRESETS = {
    barat: { name: "barátsággráf", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,B-C,C-D", pos: [[0, 0], [0, 1], [1, 0.5], [2.1, 0.5]] },
    star: { name: "csillag", labels: ["K", "1", "2", "3", "4"], edges: "K-1,K-2,K-3,K-4", pos: [[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]] },
    k4: { name: "teljes gráf (K₄)", labels: ["1", "2", "3", "4"], edges: "1-2,1-3,1-4,2-3,2-4,3-4", pos: [[0, 0], [1.2, 0], [1.2, 1.2], [0, 1.2]] },
    path4: { name: "4 csúcsú út", labels: ["1", "2", "3", "4"], edges: "1-2,2-3,3-4", pos: [[0, 0], [1, 0], [2, 0], [3, 0]] },
    bowtie: { name: "csokornyakkendő", labels: ["A", "B", "C", "D", "E"], edges: "A-B,A-C,B-C,C-D,C-E,D-E",
      pos: [[0, 0], [0, 1.2], [1, 0.6], [2, 0], [2, 1.2]] },
    twoTri: { name: "két háromszög + híd", labels: ["1", "2", "3", "4", "5", "6"], edges: "1-2,1-3,2-3,3-4,4-5,4-6,5-6",
      pos: [[0, 0], [0, 1.2], [1, 0.6], [2.2, 0.6], [3.2, 0], [3.2, 1.2]] },
    /* két háromszög két „létrafokkal”: a 6.2 homofília-példája (csoportok: {1,2,3} / {4,5,6} → r = 1/2; {1,3,4} / {2,5,6} → r = 0) */
    ladder: { name: "két háromszög + két fok", labels: ["1", "2", "3", "4", "5", "6"], edges: "1-2,2-3,1-3,4-5,5-6,4-6,1-4,2-5",
      pos: [[0, 0], [0, 1.2], [-0.8, 0.6], [1.6, 0], [1.6, 1.2], [2.4, 0.6]] },
    /* Krackhardt „sárkánya” (1990) */
    kite: { name: "sárkány", labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      edges: "A-B,A-C,A-D,A-F,B-D,B-E,B-G,C-D,C-F,D-E,D-F,D-G,E-G,F-G,F-H,G-H,H-I,I-J",
      pos: [[1, 0], [1, 2], [0, 0.4], [1.3, 1], [0, 1.6], [2.1, 0.4], [2.1, 1.6], [3, 1], [4, 1], [5, 1]] },
    /* előjeles mintagráfok: él „a-b:+” vagy „a-b:-” */
    sK4bal: { name: "K₄, két tábor", labels: ["A", "B", "C", "D"], edges: "A-B:+,C-D:+,A-C:-,A-D:-,B-C:-,B-D:-", pos: [[0, 0], [0, 1.2], [1.6, 0], [1.6, 1.2]] },
    sK4unb: { name: "K₄, egy feszült él", labels: ["A", "B", "C", "D"], edges: "A-B:+,C-D:-,A-C:-,A-D:-,B-C:-,B-D:-", pos: [[0, 0], [0, 1.2], [1.6, 0], [1.6, 1.2]] },
    s5: { name: "5 szereplő, két tábor", labels: ["A", "B", "C", "D", "E"], edges: "A-B:+,B-C:-,C-D:+,D-A:-,A-E:+,E-C:-",
      pos: [[0, 0.6], [1, 0], [2, 0.6], [1, 1.2], [1, 0.6]] },
    s5unb: { name: "5 szereplő, kör egy negatívval", labels: ["A", "B", "C", "D", "E"], edges: "A-B:+,B-C:+,C-D:+,D-E:+,E-A:-",
      pos: [[1, 0], [2, 0.7], [1.6, 1.8], [0.4, 1.8], [0, 0.7]] }
  };
  /* preset(név, aspect) → { name, nodes: [{label, x, y, sub?}], edges: [{a, b, w, s?}], weighted?, signed?, club? }
     nevek: barat, star, k4, path4, bowtie, twoTri, ladder, kite, arviz (súlyozott: w = közös cikkek), karate (club; weighted: w = Zachary-súly),
     arvizS (az Árvízhét előjeles gráfja, 3.3), sK4bal, sK4unb, s5, s5unb (előjelesek: e.s = ±1) */
  function preset(key, aspect = 0.5) {
    if (key === "arviz" || key === "arvizS") {
      const ids = D.actors.map(a => a.id), P = GK.normalize(ids.map(i => ACTOR_POS[i]), aspect);
      const nodes = ids.map((id, k) => ({ label: id, x: P[k][0], y: P[k][1], sub: actorName(id) }));
      if (key === "arvizS")
        return { name: "Árvízhét – előjeles viszonyok", signed: true, nodes,
          edges: D.relations.map(r => ({ a: ids.indexOf(r.a), b: ids.indexOf(r.b), w: 1, s: r.sign, article: r.article })) };
      const w = {};
      D.articles.forEach(a => {
        const m = a.mentions;
        for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
          const x = ids.indexOf(m[i]), y = ids.indexOf(m[j]), k = Math.min(x, y) + "-" + Math.max(x, y);
          w[k] = (w[k] || 0) + 1;
        }
      });
      return { name: "Árvízhét", nodes, weighted: true,
        edges: Object.entries(w).map(([k, v]) => { const [a, b] = k.split("-").map(Number); return { a, b, w: v }; }) };
    }
    if (key === "karate") {
      const K = window.KARATE13, P = GK.normalize(K.xy, aspect), Wt = window.KARATE_W;
      return { name: "karateklub", club: K.club.slice(), weighted: !!Wt,
        nodes: P.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1] })), edges: K.edges.map(([a, b], i) => ({ a, b, w: Wt ? Wt[i] : 1 })) };
    }
    const S = PRESETS[key], P = GK.normalize(S.pos, aspect);
    let signed = false;
    const edges = S.edges.split(",").map(t => {
      const [ab, sg] = t.split(":"), [a, b] = ab.split("-"), e = { a: S.labels.indexOf(a), b: S.labels.indexOf(b), w: 1 };
      if (sg) { e.s = sg === "-" ? -1 : 1; signed = true; }
      return e;
    });
    return { name: S.name, signed, nodes: S.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges };
  }

  /* értékből szín: kék (negatív) – szürke (0) – narancs (pozitív), |x| ≤ max */
  const _cx = document.createElement("canvas").getContext("2d");
  function rgbOf(c) {                                  // bármilyen CSS-szín (vagy --változó) → [r, g, b]
    _cx.fillStyle = "#000"; _cx.fillStyle = c.startsWith("--") ? GK.css(c) : c;
    const s = _cx.fillStyle;
    if (s[0] === "#") return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
    return s.match(/[\d.]+/g).slice(0, 3).map(Number);
  }
  function mixColor(c1, c2, t) {                       // t = 0 → c1, t = 1 → c2
    const a = rgbOf(c1), b = rgbOf(c2);
    return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(",")})`;
  }
  function divColor(x, max) {
    const t = Math.max(-1, Math.min(1, max ? x / max : 0));
    return mixColor("--card", t >= 0 ? "--setB" : "--setA", 0.15 + 0.75 * Math.abs(t));
  }

  /* ---------- centralitások (n csúcs, élek [{a, b, w}]) ----------
     Mind tömböt ad vissza, csúcsonként egy számot. directed: az él a → b. */
  function nbrs(n, edges, directed = false) {         // kimenő szomszédok listája
    const L = Array.from({ length: n }, () => []);
    edges.forEach(e => { if (e.a === e.b) return; L[e.a].push(e.b); if (!directed) L[e.b].push(e.a); });
    return L;
  }
  function bfsDist(n, L, s) {                          // távolságok s-ből (Infinity: nem elérhető)
    const d = new Array(n).fill(Infinity); d[s] = 0;
    const q = [s];
    for (let k = 0; k < q.length; k++) { const u = q[k]; L[u].forEach(v => { if (d[v] === Infinity) { d[v] = d[u] + 1; q.push(v); } }); }
    return d;
  }
  /* fokszám: nyers (súlyozva: erősség); irányítva: mode = "in" | "out" */
  function degreeC(n, edges, { directed = false, mode = "in", weighted = false } = {}) {
    const d = new Array(n).fill(0);
    edges.forEach(e => {
      const w = weighted ? e.w : 1;
      if (!directed) { d[e.a] += w; d[e.b] += w; } else d[mode === "in" ? e.b : e.a] += w;
    });
    return d;
  }
  const farness = (n, edges) => { const L = nbrs(n, edges); return [...Array(n).keys()].map(s => bfsDist(n, L, s).reduce((t, x) => t + x, 0)); };
  /* közelségi centralitás: (n − 1) / távolságösszeg; nem összefüggő gráfon Infinity-összeg → 0 */
  const closenessC = (n, edges) => farness(n, edges).map(f => (isFinite(f) && f > 0 ? (n - 1) / f : 0));
  /* harmonikus centralitás: Σ 1/d (az elérhetetlen csúcs 0-t ad); norm: osztva (n − 1)-gyel */
  function harmonicC(n, edges, norm = false) {
    const L = nbrs(n, edges);
    return [...Array(n).keys()].map(s => bfsDist(n, L, s).reduce((t, x) => t + (x > 0 && isFinite(x) ? 1 / x : 0), 0) / (norm ? Math.max(1, n - 1) : 1));
  }
  /* köztesség (Brandes): irányítatlan gráfon a csúcspárokat egyszer számolja; norm: osztva a párok számával,
     amelyeknek v nem végpontja: (n − 1)(n − 2)/2 (irányítva (n − 1)(n − 2)) */
  function betweennessC(n, edges, { directed = false, norm = false } = {}) {
    const L = nbrs(n, edges, directed), C = new Array(n).fill(0);
    for (let s = 0; s < n; s++) {
      const S = [], P = Array.from({ length: n }, () => []), sig = new Array(n).fill(0), d = new Array(n).fill(-1);
      sig[s] = 1; d[s] = 0;
      const q = [s];
      for (let k = 0; k < q.length; k++) {
        const v = q[k]; S.push(v);
        L[v].forEach(w => {
          if (d[w] < 0) { d[w] = d[v] + 1; q.push(w); }
          if (d[w] === d[v] + 1) { sig[w] += sig[v]; P[w].push(v); }
        });
      }
      const del = new Array(n).fill(0);
      while (S.length) { const w = S.pop(); P[w].forEach(v => (del[v] += sig[v] / sig[w] * (1 + del[w]))); if (w !== s) C[w] += del[w]; }
    }
    const half = directed ? 1 : 0.5, pairs = (n - 1) * (n - 2) * half;
    return C.map(c => c * half / (norm ? (pairs || 1) : 1));
  }
  /* az s–t legrövidebb utak listája (kis gráfokra; legfeljebb max darab) */
  function shortestPaths(n, edges, s, t, { directed = false, max = 200 } = {}) {
    const L = nbrs(n, edges, directed), ds = bfsDist(n, L, s), out = [];
    if (!isFinite(ds[t])) return out;
    const Lr = directed ? nbrs(n, edges.map(e => ({ a: e.b, b: e.a })), true) : L, dt = bfsDist(n, Lr, t);
    (function go(v, path) {
      if (out.length >= max) return;
      if (v === t) { out.push(path.slice()); return; }
      L[v].forEach(w => { if (ds[w] === ds[v] + 1 && dt[w] === dt[v] - 1) { path.push(w); go(w, path); path.pop(); } });
    })(s, [s]);
    return out;
  }

  /* ---------- helyi szerkezet (6. fejezet) ---------- */
  /* szomszédhalmazok (irányítatlanul; a hurkot és a többszörös élt figyelmen kívül hagyja) */
  function nbrSets(n, edges) {
    const S = Array.from({ length: n }, () => new Set());
    edges.forEach(e => { if (e.a !== e.b) { S[e.a].add(e.b); S[e.b].add(e.a); } });
    return S;
  }
  /* háromszögek: { list: [[i, j, k], …] (i < j < k), per: csúcsonkénti darabszám T_i } */
  function triangles(n, edges) {
    const S = nbrSets(n, edges), list = [], per = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (const j of S[i]) if (j > i) for (const k of S[j]) if (k > j && S[i].has(k)) { list.push([i, j, k]); per[i]++; per[j]++; per[k]++; }
    return { list, per };
  }
  /* helyi klaszterezettség: C_i = T_i / (k_i alatt 2); k_i < 2 esetén 0 (a networkx szokása) */
  function clusteringC(n, edges) {
    const S = nbrSets(n, edges), T = triangles(n, edges).per;
    return S.map((s, i) => (s.size < 2 ? 0 : T[i] / (s.size * (s.size - 1) / 2)));
  }
  /* globális mutatók: { avg (átlagos C_i), trans (tranzitivitás = 3·háromszög / összefüggő hármas), tri, triples, wedges (nyitott hármasok) } */
  function clusteringStats(n, edges) {
    const S = nbrSets(n, edges), C = clusteringC(n, edges), tri = triangles(n, edges).list.length;
    const triples = S.reduce((t, s) => t + s.size * (s.size - 1) / 2, 0);
    return { avg: n ? C.reduce((a, b) => a + b, 0) / n : 0, trans: triples ? 3 * tri / triples : 0, tri, triples, wedges: triples - 3 * tri };
  }
  /* szomszédsági átfedés (Easley–Kleinberg): O_ij = |N(i) ∩ N(j)| / |N(i) ∪ N(j) \ {i, j}|; élenként egy szám (0: helyi híd) */
  function overlapE(n, edges) {
    const S = nbrSets(n, edges);
    return edges.map(e => {
      let common = 0; const un = new Set();
      S[e.a].forEach(x => { if (x !== e.b) { un.add(x); if (S[e.b].has(x)) common++; } });
      S[e.b].forEach(x => { if (x !== e.a) un.add(x); });
      return un.size ? common / un.size : 0;
    });
  }
  /* kategóriás asszortativitás (Newman 2003): grp[i] = a csúcs csoportja (tetszőleges címke).
     → { r, within (a csoporton belüli élek aránya), sumA2 (Σ a_i², a véletlen várt aránya), e (keveredési mátrix, objektum), a, cats } */
  function attrAssort(n, edges, grp) {
    const cats = [...new Set(grp)], m = edges.length, e = {}, a = {};
    cats.forEach(c => { a[c] = 0; e[c] = {}; cats.forEach(d => (e[c][d] = 0)); });
    edges.forEach(x => { const p = grp[x.a], q = grp[x.b]; e[p][q] += 1 / (2 * m); e[q][p] += 1 / (2 * m); });
    cats.forEach(c => cats.forEach(d => (a[c] += e[c][d])));
    const within = cats.reduce((t, c) => t + e[c][c], 0), sumA2 = cats.reduce((t, c) => t + a[c] * a[c], 0);
    return { r: m && sumA2 < 1 - 1e-12 ? (within - sumA2) / (1 - sumA2) : NaN, within, sumA2, e, a, cats };
  }
  /* fokszám-asszortativitás: az élvégek fokszámainak Pearson-korrelációja (minden él mindkét irányban); NaN, ha minden fok egyenlő */
  function degAssort(n, edges) {
    const d = new Array(n).fill(0); edges.forEach(e => { d[e.a]++; d[e.b]++; });
    const xs = [], ys = [];
    edges.forEach(e => { xs.push(d[e.a]); ys.push(d[e.b]); xs.push(d[e.b]); ys.push(d[e.a]); });
    const N = xs.length; if (!N) return { r: NaN, xs, ys, deg: d };
    const mx = xs.reduce((s, x) => s + x, 0) / N, my = ys.reduce((s, x) => s + x, 0) / N;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < N; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    return { r: sxx > 1e-12 ? sxy / Math.sqrt(sxx * syy) : NaN, xs, ys, deg: d };
  }
  /* komponensek: { comp: csúcsonkénti komponensszám, sizes: méretek csökkenő sorrendben } */
  function components(n, edges) {
    const L = nbrs(n, edges), comp = new Array(n).fill(-1), sizes = [];
    for (let s = 0; s < n; s++) {
      if (comp[s] >= 0) continue;
      const q = [s]; comp[s] = sizes.length;
      for (let k = 0; k < q.length; k++) L[q[k]].forEach(v => { if (comp[v] < 0) { comp[v] = sizes.length; q.push(v); } });
      sizes.push(q.length);
    }
    return { comp, sizes: sizes.slice().sort((x, y) => y - x) };
  }
  /* ---------- előjeles gráfok (e.s = ±1) ---------- */
  /* előjeles háromszögek: [{ t: [i, j, k], signs: [s_ij, s_jk, s_ik], prod, type: "+++" | "++-" | "+--" | "---" }] */
  function signedTriangles(n, edges) {
    const sg = {}; edges.forEach(e => (sg[GK.edgeKey(e.a, e.b)] = e.s));
    return triangles(n, edges).list.map(([i, j, k]) => {
      const s = [sg[GK.edgeKey(i, j)], sg[GK.edgeKey(j, k)], sg[GK.edgeKey(i, k)]], neg = s.filter(x => x < 0).length;
      return { t: [i, j, k], signs: s, prod: s[0] * s[1] * s[2], type: "+".repeat(3 - neg) + "-".repeat(neg) };
    });
  }
  /* egyensúly-ellenőrzés szélességi bejárással: a + él ugyanabba, a − él a másik táborba visz.
     → { balanced, camp: csúcsonként 0 / 1 (izolált csúcs: 0), conflict: az első ellentmondó él indexe vagy −1 } */
  function balanceCheck(n, edges) {
    const L = Array.from({ length: n }, () => []);
    edges.forEach((e, i) => { L[e.a].push([e.b, e.s, i]); L[e.b].push([e.a, e.s, i]); });
    const camp = new Array(n).fill(-1); let conflict = -1;
    for (let s = 0; s < n; s++) {
      if (camp[s] >= 0) continue;
      camp[s] = 0; const q = [s];
      for (let k = 0; k < q.length; k++) {
        const u = q[k];
        L[u].forEach(([v, sg, i]) => {
          const want = sg > 0 ? camp[u] : 1 - camp[u];
          if (camp[v] < 0) { camp[v] = want; q.push(v); } else if (camp[v] !== want && conflict < 0) conflict = i;
        });
      }
    }
    return { balanced: conflict < 0, camp, conflict };
  }
  /* frusztrációs index kis gráfra: a legkevesebb előjelváltás, amely után a gráf kiegyensúlyozott (teljes keresés a táborbeosztásokon, n ≤ 16)
     → { k, camp: egy optimális beosztás, bad: a „rossz” élek indexei } */
  function frustration(n, edges) {
    let best = { k: Infinity, camp: null, bad: [] };
    for (let mask = 0; mask < 1 << Math.max(0, n - 1); mask++) {
      const camp = [...Array(n).keys()].map(i => (i === n - 1 ? 0 : (mask >> i) & 1));
      const bad = [];
      edges.forEach((e, i) => { if ((camp[e.a] === camp[e.b]) !== (e.s > 0)) bad.push(i); });
      if (bad.length < best.k) best = { k: bad.length, camp, bad };
    }
    return best;
  }
  /* ---------- véletlen és nullmodell ---------- */
  function rng(seed = 1) {                              // mulberry32
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  /* G(n, m): m különböző él egyenletesen véletlenül */
  function gnm(n, m, R = Math.random) {
    const all = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) all.push([i, j]);
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    return all.slice(0, Math.min(m, all.length)).map(([a, b]) => ({ a, b, w: 1 }));
  }
  /* fokszámtartó átkötés (kettős élcsere): a–b, c–d → a–d, c–b, ha nem lesz hurok vagy többszörös él; swaps kísérlet */
  function rewire(n, edges, swaps, R = Math.random) {
    const E = edges.map(e => [e.a, e.b]), has = new Set(E.map(([a, b]) => GK.edgeKey(a, b)));
    for (let t = 0; t < swaps; t++) {
      const i = Math.floor(R() * E.length), j = Math.floor(R() * E.length);
      if (i === j) continue;
      let [a, b] = E[i], [c, d] = E[j];
      if (R() < 0.5) [c, d] = [d, c];
      if (a === d || c === b || a === c || b === d) continue;
      const k1 = GK.edgeKey(a, d), k2 = GK.edgeKey(c, b);
      if (has.has(k1) || has.has(k2)) continue;
      has.delete(GK.edgeKey(a, b)); has.delete(GK.edgeKey(c, d)); has.add(k1); has.add(k2);
      E[i] = [a, d]; E[j] = [c, b];
    }
    return E.map(([a, b]) => ({ a, b, w: 1 }));
  }
  /* ---------- hálózatmodellek (7. fejezet) ---------- */
  /* G(n, p): minden pár p valószínűséggel él (geometriai ugrásokkal, ritka gráfon is gyors: O(n + m)) */
  function gnp(n, p, R = Math.random) {
    const E = [];
    if (p <= 0) return E;
    if (p >= 1) { for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) E.push({ a: i, b: j, w: 1 }); return E; }
    const lq = Math.log(1 - p);
    let v = 1, w = -1;
    while (v < n) {
      w += 1 + Math.floor(Math.log(1 - R()) / lq);
      while (w >= v && v < n) { w -= v; v++; }
      if (v < n) E.push({ a: w, b: v, w: 1 });
    }
    return E;
  }
  /* gyűrűrács: n csúcs körben, mindegyik a k/2-2 legközelebbi szomszédjával (k páros) */
  function ringLattice(n, k) {
    const E = [];
    for (let i = 0; i < n; i++) for (let j = 1; j <= k / 2; j++) E.push({ a: i, b: (i + j) % n, w: 1 });
    return E;
  }
  /* Watts–Strogatz: a gyűrűrács minden élének „távoli” végét p valószínűséggel véletlen csúcsra kötjük át
     (hurok és többszörös él nélkül) → { edges, rewired: az átkötött élek indexei } */
  function wattsStrogatz(n, k, p, R = Math.random) {
    const E = ringLattice(n, k), has = new Set(E.map(e => GK.edgeKey(e.a, e.b))), rewired = [];
    E.forEach((e, i) => {
      if (R() >= p) return;
      for (let t = 0; t < 50; t++) {
        const c = Math.floor(R() * n);
        if (c === e.a || has.has(GK.edgeKey(e.a, c))) continue;
        has.delete(GK.edgeKey(e.a, e.b)); e.b = c; has.add(GK.edgeKey(e.a, c)); rewired.push(i); break;
      }
    });
    return { edges: E, rewired };
  }
  /* Barabási–Albert: m0 = m + 1 csúcsú teljes gráfból indul, minden új csúcs m élt köt a fokszámmal arányos
     valószínűséggel (különböző csúcsokhoz). → { edges, born: hányadik lépésben jött az él (0: kezdő) } */
  function barabasiAlbert(n, m, R = Math.random) {
    const E = [], stubs = [], m0 = m + 1;
    for (let i = 0; i < m0; i++) for (let j = i + 1; j < m0; j++) { E.push({ a: i, b: j, w: 1 }); stubs.push(i, j); }
    for (let v = m0; v < n; v++) {
      const T = new Set();
      while (T.size < Math.min(m, v)) T.add(stubs[Math.floor(R() * stubs.length)]);
      T.forEach(t => { E.push({ a: t, b: v, w: 1 }); stubs.push(t, v); });
    }
    return E;
  }
  /* átlagos legrövidebb út (az óriáskomponensen, ha nem összefüggő) – szélességi bejárás minden csúcsból;
     samples: legfeljebb ennyi kiinduló csúcs (nagy gráfra becslés) → { L, giant, diam } */
  function avgPath(n, edges, samples = Infinity, R = Math.random) {
    const L = nbrs(n, edges), comp = components(n, edges);
    const sizes = {}; comp.comp.forEach(c => (sizes[c] = (sizes[c] || 0) + 1));
    const gid = +Object.keys(sizes).reduce((a, b) => (sizes[a] >= sizes[b] ? a : b));
    const V = [...Array(n).keys()].filter(i => comp.comp[i] === gid);
    let src = V;
    if (V.length > samples) { src = V.slice(); for (let i = src.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [src[i], src[j]] = [src[j], src[i]]; } src = src.slice(0, samples); }
    let s = 0, c = 0, diam = 0;
    src.forEach(u => { const d = bfsDist(n, L, u); V.forEach(v => { if (v !== u) { s += d[v]; c++; if (d[v] > diam) diam = d[v]; } }); });
    return { L: c ? s / c : 0, giant: V.length, diam };
  }
  /* félélek véletlen párosítása (konfigurációs modell, hurok és többszörös él megengedett)
     deg: fokszámsorozat (összege páros) → { edges: [{a, b}], stubs: [[csúcs, félél-sorszám], …], pairs: [[i, j], …] a félélek indexei, loops, multi } */
  function stubMatch(deg, R = Math.random) {
    const stubs = []; deg.forEach((k, v) => { for (let t = 0; t < k; t++) stubs.push([v, t]); });
    const idx = [...stubs.keys()];
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const pairs = [], edges = [], seen = {};
    let loops = 0, multi = 0;
    for (let i = 0; i + 1 < idx.length; i += 2) {
      const p = idx[i], q = idx[i + 1], a = stubs[p][0], b = stubs[q][0];
      pairs.push([p, q]); edges.push({ a, b, w: 1 });
      if (a === b) loops++;
      const k = GK.edgeKey(a, b); seen[k] = (seen[k] || 0) + 1; if (seen[k] === 2) multi++;
    }
    return { edges, stubs, pairs, loops, multi };
  }
  /* páros (cikk–szereplő) nullmodell: „curveball”-cserék. rows: soronként a szereplők indexeinek tömbje.
     A sorok mérete (cikkenkénti szereplőszám) és az oszlopösszegek (szereplőnkénti cikkszám) változatlanok. */
  function curveball(rows, steps, R = Math.random) {
    const S = rows.map(r => new Set(r));
    for (let t = 0; t < steps; t++) {
      const i = Math.floor(R() * S.length); let j = Math.floor(R() * (S.length - 1)); if (j >= i) j++;
      const A = S[i], B = S[j], ab = [...A].filter(x => !B.has(x)), ba = [...B].filter(x => !A.has(x));
      if (!ab.length || !ba.length) continue;
      const pool = ab.concat(ba);
      for (let u = pool.length - 1; u > 0; u--) { const v = Math.floor(R() * (u + 1)); [pool[u], pool[v]] = [pool[v], pool[u]]; }
      ab.forEach(x => A.delete(x)); ba.forEach(x => B.delete(x));
      pool.slice(0, ab.length).forEach(x => A.add(x)); pool.slice(ab.length).forEach(x => B.add(x));
    }
    return S.map(s => [...s].sort((x, y) => x - y));
  }
  /* egymódusú vetület: soronként (cikkenként) minden pár +1 → { W: n×n súlymátrix, edges: [{a, b, w}] } */
  function project(rows, n) {
    const W = Array.from({ length: n }, () => new Array(n).fill(0));
    rows.forEach(r => { for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { W[r[i]][r[j]]++; W[r[j]][r[i]]++; } });
    const edges = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (W[i][j]) edges.push({ a: i, b: j, w: W[i][j] });
    return { W, edges };
  }
  /* az Árvízhét cikk–szereplő sorai (a szereplők indexe a D.actors sorrendjében: Ko, Vi, Po, La, Ön, Sz, Kl) */
  const ARTICLE_ROWS = D.articles.map(a => a.mentions.map(id => D.actors.findIndex(x => x.id === id)).sort((x, y) => x - y));
  /* hipergeometrikus P(X = j): N cikkből a, illetve b darab, véletlen helyen – a közös cikkek száma */
  function binom(n, k) { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  const hyperPmf = (N, a, b, j) => binom(a, j) * binom(N - a, b - j) / binom(N, b);
  /* fokszámeloszlás: { k: [fokszámok növekvőben], cnt, pk (arány), ccdf: P(K ≥ k) } */
  function degreeDist(deg) {
    const c = {}; deg.forEach(k => (c[k] = (c[k] || 0) + 1));
    const ks = Object.keys(c).map(Number).sort((x, y) => x - y), n = deg.length;
    let tail = n; const ccdf = [];
    ks.forEach(k => { ccdf.push(tail / n); tail -= c[k]; });
    return { k: ks, cnt: ks.map(k => c[k]), pk: ks.map(k => c[k] / n), ccdf };
  }
  /* átlag és szórás (n-nel osztva) */
  function meanSd(xs) { const m = xs.reduce((s, x) => s + x, 0) / (xs.length || 1); return { mean: m, sd: Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length || 1)) }; }

  /* rangsor: indexek csökkenő érték szerint; holtversenyben azonos helyezés („1., 1., 3.”) */
  function ranks(vals, eps = 1e-9) {
    const ord = [...vals.keys()].sort((i, j) => vals[j] - vals[i]), r = new Array(vals.length);
    ord.forEach((i, k) => { r[i] = k > 0 && Math.abs(vals[i] - vals[ord[k - 1]]) < eps ? r[ord[k - 1]] : k + 1; });
    return { order: ord, rank: r };
  }
  /* KaTeX-címke egy szereplőnek / csúcsnak */
  const texLab = l => (l === "Ön" ? "\\text{Ön}" : /^[A-Z][a-z]$/.test(l) ? `\\mathrm{${l}}` : l);

  
  /* ---------- közösségek (8. fejezet) ----------
     Partíció = címketömb: lab[i] = az i csúcs közösségének azonosítója (tetszőleges egész). */

  /* közösségszínek: az első három a témaszínek, utána rögzített árnyalatok (a sorszám mod 10) */
  const COMM_COLORS = ["--setA", "--setB", "--setC", "#a855f7", "#ef4444", "#14b8a6", "#eab308", "#ec4899", "#64748b", "#84cc16"];
  const commColor = c => COMM_COLORS[((c % COMM_COLORS.length) + COMM_COLORS.length) % COMM_COLORS.length];
  /* címkék 0, 1, 2, … sorszámra, az első előfordulás sorrendjében */
  function relabel(lab) { const map = new Map(); return lab.map(x => { if (!map.has(x)) map.set(x, map.size); return map.get(x); }); }
  const nComm = lab => new Set(lab).size;

  /* modularitás: Q = Σ_c [ L_c/m − γ (d_c / 2m)² ]
     L_c: a c közösség belső éleinek (súlyának) összege, d_c: a csúcsai fokszámának (erősségének) összege.
     → { Q, m, parts: [{ c, nodes, Lc, dc, inTerm: L_c/m, expTerm: γ(d_c/2m)², term }], deg } */
  function modularity(n, edges, lab, { gamma = 1, weighted = false } = {}) {
    const deg = new Array(n).fill(0); let m = 0;
    const P = new Map(), part = c => { if (!P.has(c)) P.set(c, { c, nodes: [], Lc: 0, dc: 0 }); return P.get(c); };
    for (let i = 0; i < n; i++) part(lab[i]).nodes.push(i);
    edges.forEach(e => {
      const w = weighted ? (e.w == null ? 1 : e.w) : 1;
      m += w; deg[e.a] += w; deg[e.b] += w;
      if (lab[e.a] === lab[e.b]) part(lab[e.a]).Lc += w;
    });
    for (let i = 0; i < n; i++) part(lab[i]).dc += deg[i];
    let Q = 0;
    const parts = [...P.values()].map(p => {
      p.inTerm = m ? p.Lc / m : 0; p.expTerm = m ? gamma * (p.dc / (2 * m)) ** 2 : 0; p.term = p.inTerm - p.expTerm; Q += p.term; return p;
    });
    return { Q, m, parts, deg };
  }

  /* élköztesség (Brandes; irányítatlan, minden csúcspárt egyszer számol): élenként egy szám, az edges sorrendjében.
     Egy él köztessége: hány legrövidebb út (törtrészekkel) halad át rajta az összes csúcspár között. */
  function edgeBetweenness(n, edges) {
    const L = Array.from({ length: n }, () => []);
    edges.forEach((e, k) => { if (e.a !== e.b) { L[e.a].push([e.b, k]); L[e.b].push([e.a, k]); } });
    const C = new Array(edges.length).fill(0);
    for (let s = 0; s < n; s++) {
      const S = [], P = Array.from({ length: n }, () => []), sig = new Array(n).fill(0), d = new Array(n).fill(-1);
      sig[s] = 1; d[s] = 0;
      const q = [s];
      for (let t = 0; t < q.length; t++) {
        const v = q[t]; S.push(v);
        L[v].forEach(([w, k]) => {
          if (d[w] < 0) { d[w] = d[v] + 1; q.push(w); }
          if (d[w] === d[v] + 1) { sig[w] += sig[v]; P[w].push([v, k]); }
        });
      }
      const del = new Array(n).fill(0);
      while (S.length) {
        const w = S.pop();
        P[w].forEach(([v, k]) => { const c = sig[v] / sig[w] * (1 + del[w]); C[k] += c; del[v] += c; });
      }
    }
    return C.map(x => x / 2);
  }

  /* Girvan–Newman: mindig a legnagyobb köztességű élt töröljük (holtversenyben a legkisebb indexűt), és újraszámolunk.
     → lépések: [{ removed: él indexe (az eredeti edges-ben), eb: a törlés előtti köztességek (eredeti indexek szerint, törölt: null),
                   lab: a komponensek a törlés UTÁN, k: komponensszám, Q: az eredeti gráfon mért modularitás }]
     A 0. lépés (removed: null) a kiinduló állapot. */
  function girvanNewman(n, edges) {
    const alive = edges.map(() => true), steps = [];
    const compLab = () => components(n, edges.filter((_, i) => alive[i])).comp;
    let lab = compLab();
    steps.push({ removed: null, eb: null, lab: relabel(lab), k: nComm(lab), Q: modularity(n, edges, lab).Q });
    while (alive.some(Boolean)) {
      const idx = edges.map((_, i) => i).filter(i => alive[i]);
      const eb0 = edgeBetweenness(n, idx.map(i => edges[i])), eb = edges.map(() => null);
      idx.forEach((i, t) => (eb[i] = eb0[t]));
      let best = idx[0];
      idx.forEach(i => { if (eb[i] > eb[best] + 1e-9) best = i; });
      alive[best] = false;
      lab = compLab();
      steps.push({ removed: best, eb, lab: relabel(lab), k: nComm(lab), Q: modularity(n, edges, lab).Q });
    }
    return steps;
  }

  /* Louvain (Blondel és mtsai, 2008). 1. fázis: csúcsonként (véletlen sorrendben) átrakjuk abba a szomszédos közösségbe,
     ahol a legnagyobb a modularitásnövekmény (ha pozitív); addig ismételjük, amíg van javító lépés.
     2. fázis: a közösségekből egy-egy szuperpont lesz (a belső élekből hurok), és újrakezdjük.
     opts: { gamma = 1, weighted = false, R = Math.random, maxLevels = 20 }
     → { lab (az eredeti csúcsok végső címkéi, relabel-elve), Q, levels: [{ lab: az eredeti csúcsok címkéi a szint után, Q, k,
          moves: [{ node: szuperpont, from, to, dQ }] (az 1. fázis lépései az adott szinten; a csúcsok a szint saját sorszámai) ,
          members: szuperpontonként az eredeti csúcsok listája (a szint ELEJÉN) }] } */
  function louvain(n, edges, { gamma = 1, weighted = false, R = Math.random, maxLevels = 20 } = {}) {
    // munkagráf: súlyozott szomszédsági lista, hurok súlya külön (self)
    let N = n, adj = Array.from({ length: n }, () => new Map()), self = new Array(n).fill(0), members = [...Array(n).keys()].map(i => [i]);
    let m2 = 0;
    edges.forEach(e => {
      const w = weighted ? (e.w == null ? 1 : e.w) : 1;
      if (e.a === e.b) { self[e.a] += 2 * w; m2 += 2 * w; return; }
      adj[e.a].set(e.b, (adj[e.a].get(e.b) || 0) + w); adj[e.b].set(e.a, (adj[e.b].get(e.a) || 0) + w); m2 += 2 * w;
    });
    const levels = [];
    let orig = [...Array(n).keys()];                      // orig[i] = az i eredeti csúcs aktuális szuperpontja
    if (m2 === 0) return { lab: orig.slice(), Q: 0, levels };
    for (let lev = 0; lev < maxLevels; lev++) {
      const k = new Array(N).fill(0);
      for (let i = 0; i < N; i++) { k[i] = self[i]; adj[i].forEach(w => (k[i] += w)); }
      const com = [...Array(N).keys()], tot = k.slice(), moves = [];
      let improved = false, moved = true, guard = 0;
      while (moved && guard++ < 100) {
        moved = false;
        const order = [...Array(N).keys()];
        for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        for (const i of order) {
          const ci = com[i], wTo = new Map();
          adj[i].forEach((w, j) => wTo.set(com[j], (wTo.get(com[j]) || 0) + w));
          tot[ci] -= k[i];                                // i kivétele a saját közösségéből
          const gain = c => (wTo.get(c) || 0) - gamma * tot[c] * k[i] / m2;   // (2m-mel szorzott ΔQ)/2 alak
          const g0 = gain(ci);
          let best = ci, bg = g0;
          wTo.forEach((_, c) => { const g = gain(c); if (g > bg + 1e-12) { best = c; bg = g; } });
          tot[best] += k[i];
          if (best !== ci) {
            com[i] = best; moved = improved = true;
            moves.push({ node: i, from: ci, to: best, dQ: 2 * (bg - g0) / m2 });
          }
        }
      }
      const rl = relabel(com);
      orig = orig.map(s => rl[s]);
      const Q = modularity(n, edges, orig, { gamma, weighted }).Q;
      levels.push({ lab: orig.slice(), Q, k: nComm(orig), moves, members: members.map(x => x.slice()) });
      if (!improved) break;
      // 2. fázis: összevonás
      const K = nComm(rl), adj2 = Array.from({ length: K }, () => new Map()), self2 = new Array(K).fill(0), mem2 = Array.from({ length: K }, () => []);
      for (let i = 0; i < N; i++) {
        mem2[rl[i]].push(...members[i]);
        self2[rl[i]] += self[i];
        adj[i].forEach((w, j) => {
          const a = rl[i], b = rl[j];
          if (a === b) self2[a] += w;                     // mindkét irányból jön → 2w összesen
          else adj2[a].set(b, (adj2[a].get(b) || 0) + w);
        });
      }
      N = K; adj = adj2; self = self2; members = mem2;
      if (N === 1) break;
    }
    const last = levels[levels.length - 1];
    return { lab: last.lab.slice(), Q: last.Q, levels };
  }

  /* összefüggő-e minden közösség? (a Louvain hibája: szétszakadt közösség) → a nem összefüggő közösségek címkéi */
  function disconnectedComms(n, edges, lab) {
    const bad = [];
    [...new Set(lab)].forEach(c => {
      const V = [...Array(n).keys()].filter(i => lab[i] === c), idx = new Map(V.map((v, t) => [v, t]));
      const E = edges.filter(e => lab[e.a] === c && lab[e.b] === c).map(e => ({ a: idx.get(e.a), b: idx.get(e.b) }));
      if (components(V.length, E).sizes.length > 1) bad.push(c);
    });
    return bad;
  }

  /* címketerjesztés (Raghavan–Albert–Kumara, 2007), aszinkron: véletlen sorrendben minden csúcs átveszi a szomszédai
     közt leggyakoribb címkét (holtversenyben véletlenül választ, de ha a sajátja is a legjobbak közt van, megtartja).
     Megáll, ha egy teljes kör alatt senki sem vált. → { lab, rounds, history: [címketömb körönként] } */
  function labelProp(n, edges, { R = Math.random, maxRounds = 100, weighted = false } = {}) {
    const L = Array.from({ length: n }, () => []);
    edges.forEach(e => { if (e.a !== e.b) { const w = weighted ? (e.w == null ? 1 : e.w) : 1; L[e.a].push([e.b, w]); L[e.b].push([e.a, w]); } });
    const lab = [...Array(n).keys()], history = [lab.slice()];
    let rounds = 0;
    for (; rounds < maxRounds; rounds++) {
      const order = [...Array(n).keys()];
      for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      let changed = false;
      for (const i of order) {
        if (!L[i].length) continue;
        const cnt = new Map(); L[i].forEach(([j, w]) => cnt.set(lab[j], (cnt.get(lab[j]) || 0) + w));
        const mx = Math.max(...cnt.values()), top = [...cnt.keys()].filter(c => cnt.get(c) >= mx - 1e-12);
        if (top.includes(lab[i])) continue;
        lab[i] = top[Math.floor(R() * top.length)]; changed = true;
      }
      history.push(lab.slice());
      if (!changed) break;
    }
    return { lab: relabel(lab), rounds: rounds + 1, history };
  }

  /* két partíció összevetése */
  function contingency(a, b) {
    const A = relabel(a), B = relabel(b), ka = nComm(A), kb = nComm(B);
    const T = Array.from({ length: ka }, () => new Array(kb).fill(0));
    A.forEach((x, i) => T[x][B[i]]++);
    return T;
  }
  const _ent = cnts => { const N = cnts.reduce((s, x) => s + x, 0); return -cnts.reduce((s, x) => s + (x ? x / N * Math.log(x / N) : 0), 0); };
  /* normalizált kölcsönös információ (az entrópiák számtani közepével normálva, mint a scikit-learn alapbeállítása);
     ha mindkét partíció egyetlen csoport: 1 */
  function nmi(a, b) {
    const T = contingency(a, b), N = a.length;
    const ra = T.map(r => r.reduce((s, x) => s + x, 0)), cb = T[0].map((_, j) => T.reduce((s, r) => s + r[j], 0));
    const Ha = _ent(ra), Hb = _ent(cb);
    if (Ha === 0 && Hb === 0) return 1;
    let I = 0;
    T.forEach((r, i) => r.forEach((x, j) => { if (x) I += x / N * Math.log(x * N / (ra[i] * cb[j])); }));
    const den = (Ha + Hb) / 2;
    return den > 0 ? Math.max(0, I / den) : 0;
  }
  /* korrigált Rand-index (Hubert–Arabie) */
  function ari(a, b) {
    const T = contingency(a, b), N = a.length, c2 = x => x * (x - 1) / 2;
    const ra = T.map(r => r.reduce((s, x) => s + x, 0)), cb = T[0].map((_, j) => T.reduce((s, r) => s + r[j], 0));
    const sij = T.reduce((s, r) => s + r.reduce((t, x) => t + c2(x), 0), 0), sa = ra.reduce((s, x) => s + c2(x), 0), sb = cb.reduce((s, x) => s + c2(x), 0);
    const exp = sa * sb / c2(N), mx = (sa + sb) / 2;
    return Math.abs(mx - exp) < 1e-12 ? 1 : (sij - exp) / (mx - exp);
  }
  /* páronkénti egyezés (Rand-index számlálója): hány csúcspárról „ért egyet” a két partíció (együtt–együtt vagy külön–külön) */
  function pairAgreement(a, b) {
    let agree = 0, tot = 0;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) { tot++; if ((a[i] === a[j]) === (b[i] === b[j])) agree++; }
    return { agree, tot };
  }

  /* sztochasztikus blokkmodell: sizes = blokkméretek, P = blokkok közti élvalószínűségek (szimmetrikus mátrix)
     → { n, edges, block: csúcsonkénti blokk } */
  function sbm(sizes, P, R = Math.random) {
    const block = []; sizes.forEach((s, b) => { for (let t = 0; t < s; t++) block.push(b); });
    const n = block.length, edges = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (R() < P[block[i]][block[j]]) edges.push({ a: i, b: j, w: 1 });
    return { n, edges, block };
  }
  /* várható élszámok blokkpáronként: belül p·(s alatt 2), két blokk között p·s_r·s_s */
  function sbmExpected(sizes, P) {
    return sizes.map((s, r) => sizes.map((t, q) => (r === q ? P[r][r] * s * (s - 1) / 2 : P[r][q] * s * t)));
  }

  /* szimmetrikus mátrix sajátértékei és -vektorai (Jacobi-forgatások; kis n-re) → { vals: növekvő, vecs: [vektor, …] } */
  function eigSym(M) {
    const n = M.length, A = M.map(r => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
      if (off < 1e-20) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-15) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    const idx = [...Array(n).keys()].sort((i, j) => A[i][i] - A[j][j]);
    return { vals: idx.map(i => A[i][i]), vecs: idx.map(i => V.map(r => r[i])) };
  }
  /* spektrális kettévágás: mode "fiedler" (L = D − A második sajátvektora) vagy "modmat" (B = A − kkᵀ/2m vezető sajátvektora);
     a címke az előjel (0 / 1) → { lab, vec, val } */
  function spectralSplit(n, edges, mode = "fiedler") {
    const A = Array.from({ length: n }, () => new Array(n).fill(0)), k = new Array(n).fill(0);
    edges.forEach(e => { if (e.a !== e.b) { A[e.a][e.b] += 1; A[e.b][e.a] += 1; k[e.a]++; k[e.b]++; } });
    const m2 = k.reduce((s, x) => s + x, 0) || 1;
    const M = mode === "fiedler" ? A.map((r, i) => r.map((x, j) => (i === j ? k[i] : 0) - x)) : A.map((r, i) => r.map((x, j) => x - k[i] * k[j] / m2));
    const E = eigSym(M), v0 = mode === "fiedler" ? E.vecs[1] : E.vecs[n - 1], val = mode === "fiedler" ? E.vals[1] : E.vals[n - 1];
    const f = v0.find(x => Math.abs(x) > 1e-9) || 1, vec = v0.map(x => x * Math.sign(f));
    return { lab: vec.map(x => (x >= 0 ? 0 : 1)), vec, val };
  }

  /* további mintagráfok a fejezethez */
  /* gyűrű háromszögekből: nc darab háromszög, a szomszédosak egy-egy éllel összekötve (felbontási határ) */
  function ringOfCliques(nc, l = 3) {
    const E = [];
    for (let c = 0; c < nc; c++) {
      for (let i = 0; i < l; i++) for (let j = i + 1; j < l; j++) E.push({ a: c * l + i, b: c * l + j, w: 1 });
      E.push({ a: c * l + l - 1, b: ((c + 1) % nc) * l, w: 1 });
    }
    return E;
  }
  /* Les Misérables (LESMIS): { name, nodes, edges (w = közös fejezetek), weighted } */
  function lesmisGraph(aspect = 0.6) {
    const M = window.LESMIS, P = GK.normalize(M.xy, aspect);
    return { name: "Les Misérables", weighted: true, nodes: P.map((p, i) => ({ label: "", name: M.names[i], x: p[0], y: p[1] })),
      edges: M.edges.map(([a, b, w]) => ({ a, b, w })) };
  }


  /* =====================================================================
     9. fejezet – terjedési segédfüggvények (ellenőrzés: _parts/gh9/wtest0.js)
     ===================================================================== */
  /* fokszám-statisztika: <k>, <k²>, κ = <k²>/<k> − 1 (átlagos többletfokszám), T_c = 1/κ */
  function degStats(n, edges) {
    const k = new Array(n).fill(0);
    edges.forEach(e => { if (e.a !== e.b) { k[e.a]++; k[e.b]++; } });
    const k1 = k.reduce((s, x) => s + x, 0) / (n || 1), k2 = k.reduce((s, x) => s + x * x, 0) / (n || 1);
    const kappa = k1 > 0 ? k2 / k1 - 1 : 0;
    return { k, k1, k2, ratio: k1 > 0 ? k2 / k1 : 0, kappa, Tc: kappa > 0 ? 1 / kappa : Infinity, kmax: Math.max(0, ...k) };
  }
  /* átvitel (transmissibility) diszkrét időben: lépésenként β eséllyel ad át, utána γ eséllyel gyógyul → T = β / (β + γ − βγ) */
  const transmissibility = (beta, gamma) => (beta + gamma - beta * gamma > 0 ? beta / (beta + gamma - beta * gamma) : 0);

  /* SI / SIS / SIR diszkrét időben. Egy lépés: (1) minden fertőző minden fogékony szomszédját β eséllyel megfertőzi
     (a lépés eleji állapot alapján, szinkron); (2) minden, a lépés elején fertőző γ eséllyel gyógyul (SIR: R, SIS: újra S).
     → { counts: [{S, I, R}], state (végső: 0 S, 1 I, 2 R), tInf (fertőződés ideje, −1), parent (ki fertőzte, −1), frames (állapotok lépésenként, ha keepFrames) } */
  function simulateSIR(n, edges, { model = "SIR", beta = 0.3, gamma = 0.2, seeds = [0], R = Math.random, maxT = 200, keepFrames = false } = {}) {
    const L = nbrs(n, edges), st = new Array(n).fill(0), tInf = new Array(n).fill(-1), parent = new Array(n).fill(-1);
    seeds.forEach(s => { st[s] = 1; tInf[s] = 0; });
    const cnt = () => { let S = 0, I = 0, Rr = 0; st.forEach(x => (x === 0 ? S++ : x === 1 ? I++ : Rr++)); return { S, I, R: Rr }; };
    const counts = [cnt()], frames = keepFrames ? [st.slice()] : null;
    for (let t = 1; t <= maxT; t++) {
      const inf = [];
      for (let i = 0; i < n; i++) if (st[i] === 1) inf.push(i);
      if (!inf.length) break;
      const nw = [];
      inf.forEach(i => L[i].forEach(j => { if (st[j] === 0 && tInf[j] !== t && R() < beta) { tInf[j] = t; parent[j] = i; nw.push(j); } }));
      if (model !== "SI") inf.forEach(i => { if (R() < gamma) st[i] = model === "SIS" ? 0 : 2; });
      nw.forEach(j => { st[j] = 1; });
      counts.push(cnt());
      if (keepFrames) frames.push(st.slice());
      if (model === "SI" && counts[t].S === 0) break;
    }
    return { counts, state: st, tInf, parent, frames };
  }
  /* keverő populáció (átlagtér) ugyanazzal a lépéssel: minden fertőző k véletlen kontaktusa, i(t) arányok
     egy fogékony k véletlen kontaktusa közül mindegyik i eséllyel fertőző, és β eséllyel ad át: P(fertőződik) = 1 − (1 − β·i)^k */
  function meanField(n, k, { model = "SIR", beta = 0.3, gamma = 0.2, i0 = 1, maxT = 200 } = {}) {
    let s = 1 - i0 / n, i = i0 / n, r = 0; const out = [{ S: s * n, I: i * n, R: 0 }];
    for (let t = 1; t <= maxT; t++) {
      const newI = s * (1 - Math.pow(1 - beta * i, k)), rec = model === "SI" ? 0 : gamma * i;
      s -= newI; i += newI - rec; if (model === "SIS") s += rec; else r += rec;
      out.push({ S: s * n, I: i * n, R: r * n });
      if (i * n < 1e-3) break;
    }
    return out;
  }
  /* független kaszkád: minden frissen aktivált csúcs minden inaktív szomszédját egyszer, p eséllyel aktiválja
     (p lehet élenkénti tömb is) → { active (sorrendben), time, parent } */
  function icCascade(n, edges, seeds, p, R = Math.random, directed = false) {
    const L = Array.from({ length: n }, () => []);
    edges.forEach((e, idx) => { if (e.a === e.b) return; L[e.a].push([e.b, idx]); if (!directed) L[e.b].push([e.a, idx]); });
    const time = new Array(n).fill(-1), parent = new Array(n).fill(-1), active = [];
    let front = [];
    seeds.forEach(s => { if (time[s] < 0) { time[s] = 0; active.push(s); front.push(s); } });
    for (let t = 1; front.length; t++) {
      const nx = [];
      front.forEach(i => L[i].forEach(([j, idx]) => {
        if (time[j] >= 0) return;
        const pe = Array.isArray(p) ? p[idx] : p;
        if (R() < pe) { time[j] = t; parent[j] = i; active.push(j); nx.push(j); }
      }));
      front = nx;
    }
    return { active, time, parent };
  }
  /* pontos várható terjedés (független kaszkád = élperkoláció): az élhalmaz összes részhalmazán (m ≤ 20) */
  function icExact(n, edges, seeds, p) {
    const m = edges.length;
    if (m > 20) throw new Error("icExact: túl sok él");
    let tot = 0;
    for (let mask = 0; mask < (1 << m); mask++) {
      let pr = 1; const par = [...Array(n).keys()];
      const f = x => (par[x] === x ? x : (par[x] = f(par[x])));
      for (let i = 0; i < m; i++) {
        const pe = Array.isArray(p) ? p[i] : p;
        if ((mask >> i) & 1) { pr *= pe; par[f(edges[i].a)] = f(edges[i].b); } else pr *= 1 - pe;
      }
      if (pr === 0) continue;
      const roots = new Set(seeds.map(f));
      let c = 0; for (let v = 0; v < n; v++) if (roots.has(f(v))) c++;
      tot += pr * c;
    }
    return tot;
  }
  /* Monte-Carlo várható terjedés */
  function icMC(n, edges, seeds, p, runs = 500, R = Math.random) {
    let s = 0; for (let r = 0; r < runs; r++) s += icCascade(n, edges, seeds, p, R).active.length;
    return s / runs;
  }
  /* mohó kezdőpont-választás (Kempe–Kleinberg–Tardos): spread(S) függvénnyel; → [{node, gain, total}] */
  function greedySeeds(n, k, spread) {
    const S = [], out = []; let cur = 0;
    for (let t = 0; t < k; t++) {
      let best = -1, bv = -Infinity;
      for (let v = 0; v < n; v++) { if (S.includes(v)) continue; const val = spread([...S, v]); if (val > bv + 1e-12) { bv = val; best = v; } }
      S.push(best); out.push({ node: best, gain: bv - cur, total: bv }); cur = bv;
    }
    return out;
  }
  /* küszöbmodell: egy inaktív csúcs aktiválódik, ha az aktív szomszédok száma ≥ theta (frac: aránya ≥ theta);
     theta lehet csúcsonkénti tömb is → { active: Set, time, history: [aktívak száma körönként] } */
  function thresholdCascade(n, edges, seeds, theta, { frac = false, maxRounds = 1000 } = {}) {
    const L = nbrs(n, edges), time = new Array(n).fill(-1);
    seeds.forEach(s => { time[s] = 0; });
    const history = [seeds.length];
    for (let r = 1; r <= maxRounds; r++) {
      const nw = [];
      for (let v = 0; v < n; v++) {
        if (time[v] >= 0) continue;
        const a = L[v].reduce((s, u) => s + (time[u] >= 0 && time[u] < r ? 1 : 0), 0);
        const th = Array.isArray(theta) ? theta[v] : theta;
        if (L[v].length && (frac ? a / L[v].length : a) >= th - 1e-12) nw.push(v);
      }
      if (!nw.length) break;
      nw.forEach(v => { time[v] = r; });
      history.push(history[history.length - 1] + nw.length);
    }
    return { active: new Set([...Array(n).keys()].filter(v => time[v] >= 0)), time, history };
  }
  /* Granovetter-tömeg: küszöbök listája (hány lázadó kell ahhoz, hogy ő is beálljon) → lépésenkénti létszám */
  function granovetter(th) {
    const hist = [0]; let act = 0;
    for (;;) { const nw = th.filter(t => t <= act).length; if (nw === act) break; act = nw; hist.push(act); }
    return hist;
  }
  /* kaszkádfa mérőszámai: parent[v] (−1: gyökér vagy nem része) és a fa csúcsai → { size, depth, breadth, sv (strukturális virálisság = átlagos páronkénti távolság), levels } */
  function treeMetrics(nodes, parent) {
    const set = new Set(nodes), ch = new Map(); let root = -1;
    nodes.forEach(v => { const p = parent[v]; if (p < 0 || !set.has(p)) root = v; else { if (!ch.has(p)) ch.set(p, []); ch.get(p).push(v); } });
    const n = nodes.length, depthOf = new Map([[root, 0]]), order = [root];
    for (let i = 0; i < order.length; i++) (ch.get(order[i]) || []).forEach(c => { depthOf.set(c, depthOf.get(order[i]) + 1); order.push(c); });
    const levels = []; depthOf.forEach(d => { levels[d] = (levels[d] || 0) + 1; });
    /* Wiener-index fában: Σ_élek s·(n − s), s = a részfa mérete */
    const sub = new Map(); let W = 0;
    for (let i = order.length - 1; i >= 0; i--) { const v = order[i]; const s = 1 + (ch.get(v) || []).reduce((t, c) => t + sub.get(c), 0); sub.set(v, s); if (v !== root) W += s * (n - s); }
    return { size: n, root, depth: levels.length - 1, breadth: Math.max(0, ...levels.slice(1)), levels, sv: n > 1 ? W / (n * (n - 1) / 2) : 0, wiener: W };
  }
  /* Borel-eloszlás: Poisson(R) utódszámú elágazó folyamat teljes mérete, P(N = s) */
  const borel = (R, s) => Math.exp(-R * s + (s - 1) * Math.log(R * s) - lgamma(s + 1));
  function lgamma(x) { let s = 0; for (let i = 2; i < x; i++) s += Math.log(i); return s; }   // egész x-re: ln((x−1)!)
  /* DeGroot: x(t+1) = W x(t), W = (A + I) sorai normálva (önmagát és a szomszédait egyformán súlyozza) → lépések */
  function degroot(n, edges, x0, steps = 30, selfW = 1) {
    const L = nbrs(n, edges), out = [x0.slice()]; let x = x0.slice();
    for (let t = 0; t < steps; t++) { x = x.map((xi, i) => (selfW * xi + L[i].reduce((s, j) => s + x[j], 0)) / (selfW + L[i].length)); out.push(x); }
    return out;
  }
  /* Hegselmann–Krause: mindenki az ε-on belüli véleményűek (magát is beleértve) átlagára vált; nw: opcionális szomszédlista (hálózaton) */
  function hkStep(x, eps, L = null) {
    return x.map((xi, i) => {
      let s = xi, c = 1; const cand = L ? L[i] : x.map((_, j) => j).filter(j => j !== i);
      cand.forEach(j => { if (Math.abs(x[j] - xi) <= eps + 1e-12) { s += x[j]; c++; } });
      return s / c;
    });
  }
  /* Deffuant: egy véletlen pár (vagy él), ha |x_i − x_j| < ε, mindketten μ-vel közelednek */
  function deffuantStep(x, eps, mu, R = Math.random, edges = null) {
    let i, j;
    if (edges && edges.length) { const e = edges[Math.floor(R() * edges.length)]; i = e.a; j = e.b; }
    else { i = Math.floor(R() * x.length); j = Math.floor(R() * x.length); if (i === j) return false; }
    const d = x[j] - x[i];
    if (Math.abs(d) >= eps) return false;
    x[i] += mu * d; x[j] -= mu * d; return true;
  }
  /* véleménycsoportok: rendezett értékek, rés > gap → új csoport → [{center, size}] */
  function opinionClusters(x, gap = 0.02) {
    const s = x.slice().sort((a, b) => a - b), out = [];
    s.forEach((v, i) => { if (!i || v - s[i - 1] > gap) out.push({ sum: 0, size: 0 }); const c = out[out.length - 1]; c.sum += v; c.size++; });
    return out.map(c => ({ center: c.sum / c.size, size: c.size }));
  }
  /* politikai blogok irányítatlanul (5. fejezet adata): { n, edges, lean, xy } */
  function polblogsGraph(aspect = 0.6) {
    const B = window.POLBLOGS; if (!B) return null;
    const seen = new Set(), E = [];
    for (let i = 0; i < B.edges.length; i += 2) {
      const a = B.edges[i], b = B.edges[i + 1]; if (a === b) continue;
      const k = GK.edgeKey(a, b); if (seen.has(k)) continue; seen.add(k); E.push({ a, b, w: 1 });
    }
    const P = GK.normalize(B.xy, aspect);
    return { name: "politikai blogok", n: B.n, lean: B.lean, nodes: P.map((p, i) => ({ label: "", name: B.names[i], x: p[0], y: p[1] })), edges: E };
  }
  /* fertőzési állapot színei */
  const SIR_COLORS = { S: "--muted", I: "--setB", R: "--setA" };


  /* =====================================================================
     10. fejezet – összehasonlítás és következtetés (ellenőrzés: _parts/gh10/wtest0.js)
     ===================================================================== */
  /* üres n×n mátrix; élekből mátrix (irányítatlanul szimmetrikus; w = súly vagy 1) */
  const zeros = n => Array.from({ length: n }, () => new Array(n).fill(0));
  function toMatrix(n, edges, { directed = false, weighted = true } = {}) {
    const M = zeros(n);
    edges.forEach(e => { const w = weighted ? (e.w ?? 1) : 1; M[e.a][e.b] += w; if (!directed) M[e.b][e.a] += w; });
    return M;
  }
  /* Árvízhét: szereplő-együttemlítési mátrix (7×7, sorrend Ko, Vi, Po, La, Ön, Sz, Kl) egy cikkszűrővel,
     pl. arvizMatrix(a => a.paper === "VN"), arvizMatrix(a => ["H","K","Sze"].includes(a.day)) */
  const ARV_IDS = D.actors.map(a => a.id);
  function arvizMatrix(filter = () => true, ids = ARV_IDS) {
    const M = zeros(ids.length);
    D.articles.filter(filter).forEach(a => {
      const m = a.mentions.filter(x => ids.includes(x));
      for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
        const x = ids.indexOf(m[i]), y = ids.indexOf(m[j]); M[x][y]++; M[y][x]++;
      }
    });
    return M;
  }
  /* főátlón kívüli cellák vektora (irányítatlan: i < j, n(n−1)/2 cella; irányított: i ≠ j, n(n−1) cella) – opcionális P permutációval: M[P[i]][P[j]] */
  function offdiag(M, directed = false, P = null) {
    const n = M.length, v = [];
    for (let i = 0; i < n; i++) for (let j = directed ? 0 : i + 1; j < n; j++) if (i !== j) v.push(P ? M[P[i]][P[j]] : M[i][j]);
    return v;
  }
  function pearson(x, y) {
    const n = x.length; let mx = 0, my = 0;
    for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; }
    mx /= n; my /= n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
    return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
  }
  const matCorr = (A, B, directed = false, P = null) => pearson(offdiag(A, directed), offdiag(B, directed, P));
  /* élhalmazok Jaccard-indexe (bináris) és súlyozott változata (Σ min / Σ max) két mátrixra */
  function jaccard(A, B, directed = false) {
    const a = offdiag(A, directed), b = offdiag(B, directed); let both = 0, any = 0, mn = 0, mx = 0;
    for (let i = 0; i < a.length; i++) { const x = a[i] > 0, y = b[i] > 0; if (x && y) both++; if (x || y) any++; mn += Math.min(a[i], b[i]); mx += Math.max(a[i], b[i]); }
    return { both, any, J: any ? both / any : 0, wMin: mn, wMax: mx, Jw: mx ? mn / mx : 0 };
  }
  /* a t-eloszlás kétoldali p-értéke (naiv korrelációs próba: t = r √(N−2) / √(1−r²)) – szabályos nem teljes béta-függvénnyel */
  function betacf(a, b, x) {
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let hh = d;
    for (let m = 1; m <= 200; m++) {
      const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; hh *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d;
      const del = d * c; hh *= del; if (Math.abs(del - 1) < 1e-12) break;
    }
    return hh;
  }
  function lnGamma(z) {
    const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let x = z, y = z, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015;
    for (let j = 0; j < 6; j++) s += g[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  function ibeta(a, b, x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  const tTwoSided = (t, df) => ibeta(df / 2, 0.5, df / (df + t * t));
  function naiveCorrP(r, N) { if (Math.abs(r) >= 1) return 0; const t = r * Math.sqrt((N - 2) / (1 - r * r)); return tTwoSided(t, N - 2); }
  /* véletlen permutáció (Fisher–Yates) és az összes permutáció bejárása (kis n-re) */
  function randPerm(n, R = Math.random) { const p = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p; }
  function forEachPerm(n, f) {                          // Heap-algoritmus, f(p) minden permutációra (n! darab)
    const p = [...Array(n).keys()], c = new Array(n).fill(0); f(p.slice()); let i = 0;
    while (i < n) { if (c[i] < i) { const j = i % 2 ? c[i] : 0; [p[j], p[i]] = [p[i], p[j]]; f(p.slice()); c[i]++; i = 0; } else { c[i] = 0; i++; } }
  }
  /* QAP-korreláció: a B sorait és oszlopait EGYÜTT permutáljuk. exact: mind az n! permutáció (n ≤ 8);
     különben runs véletlen permutáció. → { r, rs (a permutált korrelációk), pGe (egyoldali: r* ≥ r), pAbs (kétoldali: |r*| ≥ |r|), runs } */
  function qap(A, B, { directed = false, exact = false, runs = 1000, R = Math.random } = {}) {
    const a = offdiag(A, directed), r = pearson(a, offdiag(B, directed)), rs = [], eps = 1e-12;
    const one = P => rs.push(pearson(a, offdiag(B, directed, P)));
    if (exact) forEachPerm(A.length, one); else for (let k = 0; k < runs; k++) one(randPerm(A.length, R));
    const pGe = rs.filter(x => x >= r - eps).length / rs.length, pAbs = rs.filter(x => Math.abs(x) >= Math.abs(r) - eps).length / rs.length;
    return { r, rs, pGe, pAbs, runs: rs.length };
  }
  /* legkisebb négyzetek: y ~ 1 + X[0] + X[1] + … → { b, t, se, r2, df } (normálegyenletek Gauss-eliminációval) */
  function ols(y, Xs) {
    const N = y.length, p = Xs.length + 1, col = j => (j === 0 ? null : Xs[j - 1]);
    const XtX = zeros(p), Xty = new Array(p).fill(0);
    for (let i = 0; i < N; i++) {
      const row = [1]; for (let j = 1; j < p; j++) row.push(col(j)[i]);
      for (let a = 0; a < p; a++) { Xty[a] += row[a] * y[i]; for (let b = 0; b < p; b++) XtX[a][b] += row[a] * row[b]; }
    }
    const inv = invert(XtX); if (!inv) return null;
    const b = inv.map(r => r.reduce((s, v, k) => s + v * Xty[k], 0));
    let sse = 0, my = y.reduce((s, v) => s + v, 0) / N, sst = 0;
    for (let i = 0; i < N; i++) { let f = b[0]; for (let j = 1; j < p; j++) f += b[j] * col(j)[i]; sse += (y[i] - f) ** 2; sst += (y[i] - my) ** 2; }
    const df = N - p, s2 = sse / df, se = inv.map((r, k) => Math.sqrt(s2 * r[k]));
    return { b, se, t: b.map((v, k) => v / se[k]), r2: sst > 0 ? 1 - sse / sst : 0, df };
  }
  function invert(M) {
    const n = M.length, A = M.map((r, i) => [...r, ...[...Array(n)].map((_, j) => (i === j ? 1 : 0))]);
    for (let c = 0; c < n; c++) {
      let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      if (Math.abs(A[piv][c]) < 1e-12) return null; [A[c], A[piv]] = [A[piv], A[c]];
      const d = A[c][c]; for (let k = 0; k < 2 * n; k++) A[c][k] /= d;
      for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c]; if (f) for (let k = 0; k < 2 * n; k++) A[r][k] -= f * A[c][k]; }
    }
    return A.map(r => r.slice(n));
  }
  /* MRQAP: Y ~ X1 + … (mátrixok). method "y" = Y-permutáció, "dsp" = kettős szemi-parciális (Dekker–Krackhardt–Snijders, 2007).
     A p-érték kétoldali a t-statisztikára: |t*| ≥ |t|. → { fit (naiv ols), naiveP, permP, runs } (a tengelymetszetre nincs permP) */
  function mrqap(Y, Xs, { directed = true, method = "dsp", runs = 1000, R = Math.random, onProgress = null } = {}) {
    const n = Y.length, y = offdiag(Y, directed), xs = Xs.map(X => offdiag(X, directed));
    const fit = ols(y, xs), K = xs.length, cnt = new Array(K).fill(0), eps = 1e-9;
    const naiveP = fit.t.map(t => tTwoSided(t, fit.df));
    if (method === "y") {
      for (let r = 0; r < runs; r++) { const P = randPerm(n, R), f = ols(offdiag(Y, directed, P), xs); for (let k = 0; k < K; k++) if (Math.abs(f.t[k + 1]) >= Math.abs(fit.t[k + 1]) - eps) cnt[k]++; }
    } else {
      for (let k = 0; k < K; k++) {
        const others = xs.filter((_, j) => j !== k), fk = ols(xs[k], others);
        const e = xs[k].map((v, i) => v - fk.b[0] - others.reduce((s, o, j) => s + fk.b[j + 1] * o[i], 0));
        const E = zeros(n); let idx = 0;                // a maradék vektor vissza mátrixba (ugyanaz a cellasorrend)
        for (let i = 0; i < n; i++) for (let j = directed ? 0 : i + 1; j < n; j++) if (i !== j) { E[i][j] = e[idx++]; if (!directed) E[j][i] = E[i][j]; }
        for (let r = 0; r < runs; r++) { const f = ols(y, [offdiag(E, directed, randPerm(n, R)), ...others]); if (Math.abs(f.t[1]) >= Math.abs(fit.t[k + 1]) - eps) cnt[k]++; }
      }
    }
    return { fit, naiveP, permP: cnt.map(c => c / runs), runs };
  }
  /* diszparitásszűrő (Serrano–Boguñá–Vespignani, 2009): az i felől α_ij = (1 − w_ij/s_i)^(k_i − 1) (k_i = 1: α = 1);
     az él α-ja a két vég közül a kisebb. → élenként { a, b, w, alpha, alphaA, alphaB } */
  function disparity(n, edges) {
    const k = new Array(n).fill(0), s = new Array(n).fill(0);
    edges.forEach(e => { k[e.a]++; k[e.b]++; s[e.a] += e.w; s[e.b] += e.w; });
    const al = (x, w) => (k[x] > 1 ? Math.pow(1 - w / s[x], k[x] - 1) : 1);
    return edges.map(e => { const A = al(e.a, e.w), B = al(e.b, e.w); return { a: e.a, b: e.b, w: e.w, alphaA: A, alphaB: B, alpha: Math.min(A, B) }; });
  }
  /* Spearman-féle rangkorreláció (átlagrangokkal a holtversenyeknél; a ranks() a 5. fejezetből) */
  function spearman(x, y) { return pearson(avgRanks(x), avgRanks(y)); }
  function avgRanks(v) {
    const idx = v.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]), r = new Array(v.length);
    for (let i = 0; i < idx.length;) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1; i = j + 1; }
    return r;
  }
  /* ERGM kis gráfokon, teljes felsorolással: n ≤ 6 csúcs (2^(n(n−1)/2) gráf). Statisztikák: élek, háromszögek, 2-csillagok.
     ergmEnum(n) → { pairs, stats: Int16Array-ek (edges, tri, star2), count }; ergmDist(E, θ) → valószínűségek (θ = [θ_él, θ_háromszög, θ_2csillag]) */
  function ergmEnum(n) {
    const pairs = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
    const m = pairs.length, N = 1 << m, edges = new Int16Array(N), tri = new Int16Array(N), star2 = new Int16Array(N);
    const pid = zeros(n); pairs.forEach(([i, j], k) => { pid[i][j] = pid[j][i] = k; });
    const tris = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) tris.push([pid[a][b], pid[a][c], pid[b][c]]);
    for (let g = 0; g < N; g++) {
      let e = 0; const k = new Array(n).fill(0);
      for (let q = 0; q < m; q++) if (g >> q & 1) { e++; k[pairs[q][0]]++; k[pairs[q][1]]++; }
      let t = 0; for (const [x, y, z] of tris) if ((g >> x & 1) && (g >> y & 1) && (g >> z & 1)) t++;
      edges[g] = e; tri[g] = t; star2[g] = k.reduce((s, d) => s + d * (d - 1) / 2, 0);
    }
    return { n, pairs, edges, tri, star2, count: N };
  }
  function ergmDist(E, th) {
    const [te = 0, tt = 0, ts = 0] = th, N = E.count, z = new Float64Array(N); let mx = -Infinity;
    for (let g = 0; g < N; g++) { z[g] = te * E.edges[g] + tt * E.tri[g] + ts * E.star2[g]; if (z[g] > mx) mx = z[g]; }
    let S = 0; for (let g = 0; g < N; g++) { z[g] = Math.exp(z[g] - mx); S += z[g]; }
    for (let g = 0; g < N; g++) z[g] /= S;
    return z;
  }
  /* Krackhardt-adatok mátrixként: { n, advice, friendship, reports (irányított 0/1, a[i][j] = i → j), sameDept, att } */
  function krackData() {
    const K = window.KRACK; if (!K) return null;
    const n = K.n, mk = rows => rows.map(r => r.split("").map(Number));
    const sameDept = zeros(n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && K.dept[i] === K.dept[j]) sameDept[i][j] = 1;
    return { n, advice: mk(K.advice), friendship: mk(K.friendship), reports: mk(K.reports), sameDept, att: { age: K.age, tenure: K.tenure, level: K.level, dept: K.dept } };
  }


  /* =====================================================================
     11. fejezet – kapcsolat-előrejelzés és csúcsbeágyazás (ellenőrzés: _parts/gh11/wtest0.js)
     Élek: [{a, b, w?}], irányítatlan, a súlyt itt nem használjuk (bináris gráf).
     ===================================================================== */
  /* mátrixból éllista (i < j, w = cellaérték) */
  function edgesFromMatrix(M) {
    const E = []; for (let i = 0; i < M.length; i++) for (let j = i + 1; j < M.length; j++) if (M[i][j]) E.push({ a: i, b: j, w: M[i][j] });
    return E;
  }
  /* Árvízhét-gráf egy cikkszűrővel: { n: 7, edges } – pl. arvizGraph(a => ["H","K","Sze"].includes(a.day)) (a tanítógráf) */
  const ARV_FIRST = a => ["H", "K", "Sze"].includes(a.day), ARV_SECOND = a => !["H", "K", "Sze"].includes(a.day);
  function arvizGraph(filter = () => true) { return { n: 7, edges: edgesFromMatrix(arvizMatrix(filter)) }; }
  /* a karateklub (34 csúcs, 78 él; 0-tól számozva, a feliratok 1-től) */
  function karateGraph() { const K = window.KARATE13; return { n: K.n, edges: K.edges.map(([a, b]) => ({ a, b, w: 1 })) }; }
  const pairKey = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
  function edgeSet(edges) { return new Set(edges.map(e => pairKey(e.a, e.b))); }
  /* nem létező párok (i < j) – a jelöltek */
  function nonEdges(n, edges) {
    const S = edgeSet(edges), out = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (!S.has(i + "-" + j)) out.push([i, j]);
    return out;
  }
  /* szomszédsági heurisztikák: linkScorer(n, edges)(u, v) → { CN, J, AA, RA, PA, common: [w…] }
     CN = |N(u) ∩ N(v)| = (A²)_uv; J = CN / |N(u) ∪ N(v)|; AA = Σ 1/ln k_w; RA = Σ 1/k_w; PA = k_u · k_v */
  const LINK_METHODS = [["CN", "közös szomszédok"], ["J", "Jaccard"], ["AA", "Adamic–Adar"], ["RA", "erőforrás-allokáció"], ["PA", "preferenciális kapcsolódás"]];
  function linkScorer(n, edges) {
    const N = Array.from({ length: n }, () => new Set());
    edges.forEach(e => { if (e.a !== e.b) { N[e.a].add(e.b); N[e.b].add(e.a); } });
    return (u, v) => {
      const common = [...N[u]].filter(w => N[v].has(w) && w !== u && w !== v), uni = new Set([...N[u], ...N[v]]);
      return { CN: common.length, J: uni.size ? common.length / uni.size : 0,
        AA: common.reduce((s, w) => s + (N[w].size > 1 ? 1 / Math.log(N[w].size) : 0), 0),
        RA: common.reduce((s, w) => s + 1 / N[w].size, 0), PA: N[u].size * N[v].size, common };
    };
  }
  /* AUC = P(véletlen pozitív pontszáma > véletlen negatívé), holtverseny 1/2 */
  function aucPairs(pos, neg) {
    let s = 0; for (const p of pos) for (const q of neg) s += p > q ? 1 : p === q ? 0.5 : 0;
    return pos.length && neg.length ? s / (pos.length * neg.length) : NaN;
  }
  /* ROC-görbe pontjai [{s, y}]-ból (y: true = pozitív); holtversenynél ferde szakasz → [{fpr, tpr, s}] (0,0)-tól (1,1)-ig */
  function rocPoints(scored) {
    const P = scored.filter(x => x.y).length, N = scored.length - P, srt = scored.slice().sort((x, z) => z.s - x.s);
    const pts = [{ fpr: 0, tpr: 0, s: Infinity }]; let tp = 0, fp = 0;
    for (let i = 0; i < srt.length;) {
      let j = i; while (j < srt.length && srt[j].s === srt[i].s) { srt[j].y ? tp++ : fp++; j++; }
      pts.push({ fpr: N ? fp / N : 0, tpr: P ? tp / P : 0, s: srt[i].s }); i = j;
    }
    return pts;
  }
  /* precision@k és recall@k, holtversenynél a véletlen sorrend várható értékével */
  function precisionAtK(scored, k) {
    const srt = scored.slice().sort((x, z) => z.s - x.s), P = scored.filter(x => x.y).length;
    let hits = 0, taken = 0;
    for (let i = 0; i < srt.length && taken < k;) {
      let j = i, pos = 0; while (j < srt.length && srt[j].s === srt[i].s) { if (srt[j].y) pos++; j++; }
      const g = j - i, take = Math.min(g, k - taken); hits += pos * take / g; taken += take; i = j;
    }
    return { prec: k ? hits / k : NaN, rec: P ? hits / P : NaN, hits };
  }
  /* véletlen élfelosztás: a tesztélek kivétele után minden csúcs foka ≥ 1 és a gráf összefüggő marad (ha az eredeti az volt)
     → { train, test } (élek) */
  function holdoutSplit(n, edges, frac, R, { keepConnected = true } = {}) {
    const E = edges.slice(); for (let i = E.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [E[i], E[j]] = [E[j], E[i]]; }
    const want = Math.round(frac * edges.length), test = [], removed = new Set();
    const deg = new Array(n).fill(0); edges.forEach(e => { deg[e.a]++; deg[e.b]++; });
    for (const e of E) {
      if (test.length >= want) break;
      if (deg[e.a] < 2 || deg[e.b] < 2) continue;
      removed.add(e); const rest = edges.filter(x => !removed.has(x));
      if (keepConnected && components(n, rest).sizes.length > 1) { removed.delete(e); continue; }
      deg[e.a]--; deg[e.b]--; test.push(e);
    }
    return { train: edges.filter(x => !removed.has(x)), test };
  }
  /* Laplace-sajátleképezés: L = D − A 2., 3., … sajátvektora mint koordináta → { Z: [[…dim]], vals } (előjel: az első nem 0 elem pozitív) */
  function laplacianEmbed(n, edges, dim = 2) {
    const A = toMatrix(n, edges, { weighted: false }), L = A.map((r, i) => r.map((x, j) => (i === j ? r.reduce((s, y) => s + y, 0) : 0) - x));
    const E = eigSym(L), cols = E.vecs.slice(1, 1 + dim).map(v => { const f = v.find(x => Math.abs(x) > 1e-9) || 1; return v.map(x => x * Math.sign(f)); });
    return { Z: Array.from({ length: n }, (_, i) => cols.map(c => c[i])), vals: E.vals };
  }
  const dist = (x, y) => Math.sqrt(x.reduce((s, xi, i) => s + (xi - y[i]) ** 2, 0));
  const dot = (x, y) => x.reduce((s, xi, i) => s + xi * y[i], 0);
  const cosine = (x, y) => { const d = Math.sqrt(dot(x, x) * dot(y, y)); return d ? dot(x, y) / d : 0; };
  /* node2vec-séták (p = 1, q = 1: DeepWalk). Az u → v lépés után a következő x súlya: 1/p, ha x = u (visszalépés);
     1, ha x szomszédja u-nak; 1/q, ha messzebb van. → séták tömbje (csúcsindexek); num menet, minden csúcsból egy séta menetenként */
  function randomWalks(n, edges, { num = 10, length = 10, p = 1, q = 1, R = rng(1) } = {}) {
    const L = nbrs(n, edges), S = L.map(l => new Set(l)), out = [];
    for (let r = 0; r < num; r++) {
      const order = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      for (const s of order) {
        const w = [s];
        while (w.length < length && L[w[w.length - 1]].length) {
          const cur = w[w.length - 1], nb = L[cur];
          if (w.length === 1) { w.push(nb[Math.floor(R() * nb.length)]); continue; }
          const prev = w[w.length - 2], ws = nb.map(x => (x === prev ? 1 / p : S[prev].has(x) ? 1 : 1 / q));
          let t = R() * ws.reduce((a, b) => a + b, 0), k = 0; while (k < nb.length - 1 && (t -= ws[k]) > 0) k++;
          w.push(nb[k]);
        }
        out.push(w);
      }
    }
    return out;
  }
  /* node2vec egylépéses átmenet-valószínűségei: előző csúcs prev, aktuális cur → [{x, w, p}] */
  function n2vStep(n, edges, prev, cur, p = 1, q = 1) {
    const L = nbrs(n, edges), S = new Set(L[prev]), ws = L[cur].map(x => ({ x, w: x === prev ? 1 / p : S.has(x) ? 1 : 1 / q }));
    const T = ws.reduce((s, o) => s + o.w, 0); return ws.map(o => ({ ...o, p: o.w / T }));
  }
  /* skip-gram (középső, környező) párok egy sétából ±window ablakkal */
  function skipPairs(walk, window = 1) {
    const out = []; walk.forEach((c, i) => { for (let j = Math.max(0, i - window); j <= Math.min(walk.length - 1, i + window); j++) if (j !== i) out.push([c, walk[j]]); });
    return out;
  }
  /* együttelőfordulási mátrix a sétákból (szimmetrikus) */
  function walkCooc(n, walks, window = 2) {
    const C = zeros(n); walks.forEach(w => skipPairs(w, window).forEach(([a, b]) => { C[a][b]++; })); return C;
  }
  /* PPMI-mátrix, majd a legnagyobb |sajátértékű| dim irány: Z = u·√|λ| (= a Python SVD-vel azonos beágyazás) */
  function ppmi(C, k = 1) {
    const n = C.length, r = C.map(x => x.reduce((a, b) => a + b, 0)), S = r.reduce((a, b) => a + b, 0);
    return C.map((row, i) => row.map((c, j) => (c > 0 ? Math.max(0, Math.log(c * S / (r[i] * r[j])) - Math.log(k)) : 0)));
  }
  function ppmiEmbed(C, dim = 2) {
    const E = eigSym(ppmi(C)), idx = E.vals.map((v, i) => i).sort((i, j) => Math.abs(E.vals[j]) - Math.abs(E.vals[i])).slice(0, dim);
    const cols = idx.map(i => { const v = E.vecs[i], f = v.find(x => Math.abs(x) > 1e-9) || 1, s = Math.sqrt(Math.abs(E.vals[i])); return v.map(x => x * Math.sign(f) * s); });
    return C.map((_, i) => cols.map(c => c[i]));
  }
  /* skip-gram negatív mintavétellel (word2vec SGNS) a sétákon → beágyazás (n × dim); kis gráfokra */
  function sgnsEmbed(n, walks, { dim = 16, window = 5, neg = 5, epochs = 1, lr = 0.025, R = rng(1) } = {}) {
    const Win = Array.from({ length: n }, () => Array.from({ length: dim }, () => (R() - 0.5) / dim)), Wout = zeros(n).map(r => r.slice(0, dim).fill(0));
    for (let i = 0; i < n; i++) Wout[i] = new Array(dim).fill(0);
    const cnt = new Array(n).fill(0); walks.forEach(w => w.forEach(x => cnt[x]++));
    const pw = cnt.map(c => Math.pow(c, 0.75)), Z = pw.reduce((a, b) => a + b, 0), cum = []; let acc = 0; pw.forEach((x, i) => { acc += x; cum[i] = acc / Z; });
    const draw = () => { const t = R(); let lo = 0, hi = n - 1; while (lo < hi) { const m = (lo + hi) >> 1; cum[m] < t ? lo = m + 1 : hi = m; } return lo; };
    const pairs = []; walks.forEach(w => skipPairs(w, window).forEach(p => pairs.push(p)));
    const T = epochs * pairs.length; let t = 0;
    const sig = x => 1 / (1 + Math.exp(-x));
    for (let ep = 0; ep < epochs; ep++) {
      for (let i = pairs.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [pairs[i], pairs[j]] = [pairs[j], pairs[i]]; }
      for (const [c, o] of pairs) {
        const a = lr * Math.max(1e-4, 1 - t / T); t++;
        const v = Win[c], grad = new Array(dim).fill(0);
        for (let k = 0; k <= neg; k++) {
          const tg = k === 0 ? o : draw(), lab = k === 0 ? 1 : 0, u = Wout[tg], g = (lab - sig(dot(u, v))) * a;
          for (let d = 0; d < dim; d++) { grad[d] += g * u[d]; u[d] += g * v[d]; }
        }
        for (let d = 0; d < dim; d++) v[d] += grad[d];
      }
    }
    return Win;
  }

  const W = {};
  /* ==================================================================
     w1: 11.2–11.3 widgetjei (link-heuristics, auc-builder, leakage-demo)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const fmM = (x, d = 3) => fmt(x, d).replace(",", "{,}");                 // KaTeX-be
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dash = (c, kind) => `<span style="display:inline-block;width:1.7em;height:0;border-top:3px ${kind || "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const sq = (c, op = 1) => `<span style="display:inline-block;width:.85em;height:.85em;border-radius:2px;background:${sv(c)};opacity:${op};vertical-align:-.08em;margin-right:.25em"></span>`;
    const IDS = D.actors.map(a => a.id);
    const f3 = x => (isFinite(x) ? x.toFixed(3).replace(".", ",") : "–");                // AUC-k: mindig 3 tizedes
    const eqA = x => (Math.abs(x - +x.toFixed(3)) < 1e-12 ? "=" : "\\approx");
    const SNS = "http://www.w3.org/2000/svg";
    function S(tag, attrs, parent) {
      const e = document.createElementNS(SNS, tag);
      if (attrs) for (const [k, v] of Object.entries(attrs)) { if (k === "text") e.textContent = v; else e.setAttribute(k, v); }
      if (parent) parent.append(e);
      return e;
    }
    /* holtversenyes helyezések egy csökkenően rendezett értéksorra: ["1.", "2–5.", …] */
    function rankStr(vals) {
      const out = [];
      for (let i = 0; i < vals.length;) {
        let j = i; while (j < vals.length && Math.abs(vals[j] - vals[i]) < 1e-9) j++;
        for (let k = i; k < j; k++) out[k] = j - i > 1 ? `${i + 1}–${j}.` : `${i + 1}.`;
        i = j;
      }
      return out;
    }
    /* darabolt futtatás: job(i), i = 0 … total−1; onProg(kész), onDone(); visszatér: leállító függvény */
    function chunked(total, per, job, onProg, onDone) {
      let i = 0, dead = false;
      const tick = () => {
        if (dead) return;
        const end = Math.min(total, i + per);
        for (; i < end; i++) job(i);
        onProg(i);
        if (i < total) setTimeout(tick, 0); else onDone && onDone();
      };
      setTimeout(tick, 0);
      return () => { dead = true; };
    }
    /* az Árvízhét időbeli felosztása: tanítógráf (H–Sze), jelöltek, pozitívak (Cs–V új élei) */
    function arvizSplit() {
      const G1 = arvizGraph(ARV_FIRST), GF = arvizGraph(), S2 = edgeSet(arvizGraph(ARV_SECOND).edges);
      const cand = nonEdges(7, G1.edges), y = cand.map(([a, b]) => S2.has(pairKey(a, b)));
      return { G1, GF, cand, y, test: cand.filter((_, i) => y[i]).map(([a, b]) => ({ a, b, w: 1 })) };
    }
    const pn = (a, b, lab = IDS) => lab[a] + "–" + lab[b];
    const tbl = (head, rows) => `<table style="width:auto;margin:.3rem 0;font-size:.86rem;white-space:nowrap"><thead><tr>${head.map(x => `<th style="padding:.2em .5em">${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;

    /* ------------------------------------------------------------------
       11.2  link-heuristics – szomszédsági pontszámok az Árvízhéten
       ------------------------------------------------------------------ */
    W["link-heuristics"] = root => {
      header(root, "Szomszédsági pontszámok: ki jelenik meg legközelebb együtt?",
        "Az Árvízhét szereplőgráfja (két szereplő között él van, ha egy cikkben együtt szerepelnek). <b>Kattints két szereplőre</b> egymás után: " +
        "kiemelődnek a közös szomszédaik, és látod mind az öt pontszámot behelyettesítve. Alatta az összes <b>jelölt pár</b> (még nem él) rangsora.");
      const n = 7, narrow = root.clientWidth < 560, asp = narrow ? 0.72 : 0.62;
      const G = { first: arvizGraph(ARV_FIRST), all: arvizGraph() };
      const AS = arvizSplit(), NEWK = new Set(AS.test.map(e => pairKey(e.a, e.b)));
      let mode = "first", meth = "AA", sel = [2, 4], showNew = false;

      const c1 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "gráf:"));
      toggleGroup(c1, [["first", "hét eleje (H–Sze)"], ["all", "az egész hét"]], mode, v => { mode = v; update(); });
      root.append(c1);
      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const nodes0 = preset("arviz", asp).nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y }));     // a teljes nevek a kiírásban
      const view = new GK.View(left, { aspect: asp, radius: narrow ? 13 : 15, draggable: false, maxW: 440,
        onNodeClick: i => { if (sel.length >= 2) sel = [i]; else if (sel[0] === i) sel = []; else sel.push(i); update(); } });
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legend);
      const ro = h("div", { class: "readout", style: "margin-top:0" });
      right.append(ro);

      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "rangsor:"));
      toggleGroup(c2, LINK_METHODS.map(([k]) => [k, k]), meth, v => { meth = v; update(); });
      const mName = h("span", { class: "muted", style: "font-size:.88rem" });
      c2.append(mName);
      const cb = h("input", { type: "checkbox", onchange: () => { showNew = cb.checked; update(); } });
      const cbL = h("label", null, cb, "mutasd, mi történt a hét végén");
      const c3 = h("div", { class: "controls" }); c3.append(cbL);
      root.append(c2, c3);
      const sum = h("div", { class: "readout", style: "display:none" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(sum, tw);
      root.append(h("p", { class: "muted", style: "margin:.5rem 0 0;font-size:.88rem" },
        "Tipp: a táblázat egy sorára kattintva a pár kijelölődik a gráfon. A Kl a hét elején egyetlen cikkben sem szerepel másokkal – minden párjának minden pontszáma 0."));

      const FORM = { CN: "|N(u) \\cap N(v)|", J: "\\dfrac{|N(u) \\cap N(v)|}{|N(u) \\cup N(v)|}", AA: "\\sum_{w} \\dfrac{1}{\\ln k_w}", RA: "\\sum_{w} \\dfrac{1}{k_w}", PA: "k_u \\cdot k_v" };
      const setT = L => (L.length ? `\\{${L.map(i => texLab(IDS[i])).join(", ")}\\}` : "\\emptyset");

      function readout(g, sc, Nb) {
        if (!sel.length) return "Kattints két szereplőre (vagy a táblázat egy sorára)!";
        const [u, v] = sel;
        if (sel.length === 1) return `$N(${texLab(IDS[u])}) = ${setT(Nb[u])}$, $k = ${Nb[u].length}$<br>Most kattints a pár másik tagjára!`;
        const isE = Nb[u].includes(v), r = sc(u, v), C = r.common, U = new Set([...Nb[u], ...Nb[v]]);
        const tu = texLab(IDS[u]), tv = texLab(IDS[v]);
        let s = `<b>${actorName(IDS[u])} – ${actorName(IDS[v])}</b>` + (isE ? ` · <b>ez már él – nem jelölt</b>` : "") + "<br>";
        s += `$N(${tu}) = ${setT(Nb[u])}$, $N(${tv}) = ${setT(Nb[v])}$<br>`;
        s += "közös szomszédok: " + (C.length ? C.map(w => `${IDS[w]} ($k = ${Nb[w].length}$)`).join(", ") : "nincs") + "<br>";
        const aa = C.length ? C.map(w => `\\tfrac{1}{\\ln ${Nb[w].length}}`).join(" + ") : "0", ra = C.length ? C.map(w => `\\tfrac{1}{${Nb[w].length}}`).join(" + ") : "0";
        s += `$\\mathrm{CN} = ${FORM.CN} = ${r.CN}$<br>`;
        s += `$\\mathrm{J} = \\tfrac{${r.CN}}{${U.size}} ${U.size ? eqA(r.J) + " " + fmM(r.J) : "\\to 0"}$<br>`;
        s += `$\\mathrm{AA} = ${aa}${C.length ? " " + eqA(r.AA) + " " + fmM(r.AA) : ""}$<br>`;
        s += `$\\mathrm{RA} = ${ra}${C.length ? " " + eqA(r.RA) + " " + fmM(r.RA) : ""}$<br>`;
        s += `$\\mathrm{PA} = ${Nb[u].length} \\cdot ${Nb[v].length} = ${r.PA}$`;
        if (!C.length && !isE) s += `<br><span class="muted">Nincs közös szomszéd: CN, J, AA, RA mind 0.</span>`;
        return s;
      }
      function update() {
        if (mode === "all") { showNew = false; cb.checked = false; }
        cb.disabled = mode === "all"; cbL.style.opacity = mode === "all" ? 0.5 : 1;
        const g = G[mode], sc = linkScorer(n, g.edges), Nb = nbrs(n, g.edges);
        const cands = nonEdges(n, g.edges).map(([a, b]) => ({ a, b, ...sc(a, b), y: mode === "first" && NEWK.has(pairKey(a, b)) }));
        const srt = cands.slice().sort((x, z) => z[meth] - x[meth]), rk = rankStr(srt.map(c => c[meth]));
        const nm = LINK_METHODS.find(m => m[0] === meth)[1]; mName.innerHTML = `${nm}: $${FORM[meth]}$`;
        // gráf
        const E = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        const extra = showNew ? AS.test.map(e => ({ a: e.a, b: e.b, w: 1, color: "--setC", dash: [7, 5], width: 2.5 })) : [];
        if (sel.length === 2 && !Nb[sel[0]].includes(sel[1])) {
          const k = pairKey(sel[0], sel[1]), x = extra.find(e => pairKey(e.a, e.b) === k);
          if (x) { x.color = "--accent"; x.width = 3.5; } else extra.push({ a: sel[0], b: sel[1], w: 1, color: "--accent", dash: [2, 5], width: 2.5 });
        }
        view.setGraph(nodes0.map((nd, i) => ({ ...nd, badge: Nb[i].length })), E.concat(extra));
        view.hl = new Set(sel); view.hlE = new Set();
        if (sel.length === 2) sc(sel[0], sel[1]).common.forEach(w => { view.hl.add(w); view.hlE.add(GK.edgeKey(sel[0], w)); view.hlE.add(GK.edgeKey(sel[1], w)); });
        view.dim = sel.length === 2; view.draw();
        legend.innerHTML = `a csúcs melletti szám: fokszám · ${dash("--accent", "dotted")}a kijelölt pár` +
          (sel.length === 2 ? " · kiemelve a közös szomszédok és az oda vezető élek" : "") + (showNew ? ` · ${dash("--setC", "dashed")}a hét végén megjelent új él` : "");
        ro.innerHTML = readout(g, sc, Nb);
        // táblázat
        const selK = sel.length === 2 ? pairKey(sel[0], sel[1]) : "";
        const head = ["hely", "pár", ...LINK_METHODS.map(([k]) => (k === meth ? `<span style="color:var(--accent)">${k} ▼</span>` : k))].concat(showNew ? ["hét vége"] : []);
        const rows = srt.map((c, i) => {
          const on = pairKey(c.a, c.b) === selK;
          return `<tr data-a="${c.a}" data-b="${c.b}" style="cursor:pointer;${on ? "background:var(--accent-soft);font-weight:700" : ""}"><td>${rk[i]}</td><td>${pn(c.a, c.b)}</td>` +
            LINK_METHODS.map(([k]) => `<td style="text-align:right;${k === meth ? "font-weight:700" : "color:var(--muted)"}">${k === "CN" || k === "PA" ? c[k] : fmt(c[k], 3)}</td>`).join("") +
            (showNew ? `<td style="text-align:center">${c.y ? '<b style="color:var(--setC)">✓ új él</b>' : '<span class="muted">–</span>'}</td>` : "") + "</tr>";
        });
        tw.innerHTML = tbl(head, rows) + `<div class="muted" style="font-size:.82rem">${cands.length} jelölt pár (${n} csúcs, ${g.edges.length} él: ${n * (n - 1) / 2} − ${g.edges.length} = ${cands.length})</div>`;
        // a hét vége
        let p5 = null;
        if (showNew) {
          p5 = precisionAtK(cands.map(c => ({ s: c[meth], y: c.y })), 5);
          const tie = srt.length > 5 && Math.abs(srt[4][meth] - srt[5][meth]) < 1e-9;
          const grp = tie ? srt.filter(c => Math.abs(c[meth] - srt[4][meth]) < 1e-9).length : 0;
          sum.style.display = "";
          sum.innerHTML = `a hét végén ${AS.test.length} új él jelent meg: ${AS.test.map(e => pn(e.a, e.b)).join(", ")} · ` +
            `${meth === "AA" || meth === "RA" ? "az" : "a"} ${meth}-rangsor top 5-jében <b>${fmt(p5.hits, 2)}</b> találat${tie ? " (várható érték)" : ""}<br>` +
            `precision@5 = ${fmt(p5.hits, 2)}/5 = <b>${fmt(p5.prec, 3)}</b> · recall@5 = ${fmt(p5.hits, 2)}/${AS.test.length} = <b>${fmt(p5.rec, 3)}</b>` +
            (tie ? `<br><span class="muted">Holtverseny az 5. helyen: ${grp} pár ugyanannyi pontot kapott, ezekből véletlenszerűen kerül be a top 5-be – a találatszám ezért várható érték.</span>` :
              `<br><span class="muted">Véletlen sorrendnél a várható precision ${AS.test.length}/${cands.length} ≈ ${fmt(AS.test.length / cands.length, 3)} lenne.</span>`);
        } else sum.style.display = "none";
        const sp = sel.length === 2 ? sc(sel[0], sel[1]) : null;
        root.dataset.lh = JSON.stringify({ mode, meth, sel: sel.map(i => IDS[i]), sc: sp && { CN: sp.CN, J: +sp.J.toFixed(4), AA: +sp.AA.toFixed(4), RA: +sp.RA.toFixed(4), PA: sp.PA },
          top: pn(srt[0].a, srt[0].b), topS: +srt[0][meth].toFixed(4), p5: p5 && { hits: +p5.hits.toFixed(4), prec: +p5.prec.toFixed(4), rec: +p5.rec.toFixed(4) } });
        math(ro); math(mName);
      }
      tw.addEventListener("click", ev => {
        const tr = ev.target.closest("tr[data-a]"); if (!tr) return;
        sel = [+tr.dataset.a, +tr.dataset.b]; update();
      });
      update();
    };

    /* ------------------------------------------------------------------
       11.3  auc-builder – ROC-görbe küszöbről küszöbre, AUC párösszehasonlítással
       ------------------------------------------------------------------ */
    W["auc-builder"] = root => {
      header(root, "ROC-görbe és AUC lépésről lépésre",
        "A küszöböt a legnagyobb pontszámtól lefelé léptetjük: ami a küszöbön van vagy fölötte, azt <b>élnek jósoljuk</b>. " +
        "Minden küszöb egy pont a ROC-görbén: $(\\text{FPR}, \\text{TPR})$. A végén az AUC – és hogy miért ugyanaz, mint a nyert pár-összehasonlítások aránya.");
      math(root.querySelector(".w-sub"));
      const AS = arvizSplit();
      let src = "hand", meth = "CN", k = 0, items = [], thr = [], pts = [];
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "adat:"));
      toggleGroup(c1, [["hand", "kézi példa (3 + 3 pár)"], ["arviz", "Árvízhét H–Sze → Cs–V"]], src, v => { src = v; k = 0; build(); });
      const mBox = h("span", { style: "display:inline-flex;flex-wrap:wrap;gap:.4rem;align-items:center" });
      mBox.append(h("span", { class: "muted", style: "font-size:.92rem" }, "pontszám:"));
      toggleGroup(mBox, LINK_METHODS.map(([m]) => [m, m]), meth, v => { meth = v; k = 0; build(); });
      c1.append(mBox);
      c2.append(btn("◀ vissza", () => { if (k > 0) { k--; draw(); } }), btn("következő küszöb ▶", () => { if (k < thr.length) { k++; draw(); } }, "btn primary"),
        btn("mind", () => { k = thr.length; draw(); }), btn("elölről", () => { k = 0; draw(); }));
      root.append(c1, c2);
      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const list = h("div", { class: "tw", style: "overflow-x:auto" });
      left.append(list);
      const svg = S("svg", { viewBox: "0 0 320 300", style: "width:100%;max-width:380px;display:block;margin:auto", role: "img", "aria-label": "ROC-görbe" });
      right.append(svg);
      right.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0", html: `${dash("--accent")}ROC-görbe · ${dash("--muted", "dashed")}véletlen találgatás (AUC = 0,5)` }));
      const ro = h("div", { class: "readout" }), grid = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      root.append(ro, grid);

      function build() {
        mBox.style.display = src === "arviz" ? "inline-flex" : "none";
        if (src === "hand") items = [["P1", 0.9, true], ["P2", 0.6, true], ["P3", 0.3, true], ["N1", 0.7, false], ["N2", 0.3, false], ["N3", 0.1, false]].map(([name, s, y]) => ({ name, s, y }));
        else { const sc = linkScorer(7, AS.G1.edges); items = AS.cand.map(([a, b], i) => ({ name: pn(a, b), s: sc(a, b)[meth], y: AS.y[i] })); }
        items.sort((x, z) => z.s - x.s || (z.y - x.y));
        thr = [...new Set(items.map(x => x.s))].sort((x, z) => z - x);
        pts = rocPoints(items.map(x => ({ s: x.s, y: x.y })));
        draw();
      }
      const fs = x => (src === "hand" ? fmt(x, 1) : fmt(x, 3));
      function draw() {
        const P = items.filter(x => x.y).length, N = items.length - P, t = k ? thr[k - 1] : Infinity, done = k === thr.length;
        const pred = items.filter(x => x.s >= t), TP = pred.filter(x => x.y).length, FP = pred.length - TP;
        // rangsor
        const rows = items.map(x => {
          const on = x.s >= t, cur = k && Math.abs(x.s - t) < 1e-12;
          return `<tr style="${on ? "background:var(--accent-soft);" : ""}${cur ? "font-weight:700;" : ""}"><td>${x.name}</td><td style="text-align:right">${fs(x.s)}</td>` +
            `<td>${x.y ? '<span style="color:var(--setC)">✓ pozitív</span>' : '<span style="color:var(--setB)">✗ negatív</span>'}</td>` +
            `<td>${on ? "<b>él</b>" : '<span class="muted">–</span>'}</td></tr>`;
        });
        list.innerHTML = tbl(["pár", "pont", "valóság", "jóslat"], rows) +
          `<div class="muted" style="font-size:.82rem">${P} pozitív, ${N} negatív pár · a kiemelt sorok a küszöbön vagy fölötte vannak, a félkövérek most léptek át</div>`;
        // ROC
        svg.innerHTML = "";
        const L = 40, T = 12, Wd = 268, Ht = 248, X = v => L + v * Wd, Y = v => T + (1 - v) * Ht;
        [0, 0.25, 0.5, 0.75, 1].forEach(v => {
          S("line", { x1: X(v), y1: T, x2: X(v), y2: T + Ht, style: "stroke:var(--border);stroke-width:1" }, svg);
          S("line", { x1: L, y1: Y(v), x2: L + Wd, y2: Y(v), style: "stroke:var(--border);stroke-width:1" }, svg);
          S("text", { x: X(v), y: T + Ht + 14, "text-anchor": "middle", style: "fill:var(--muted);font-size:11px", text: fmt(v, 2) }, svg);
          S("text", { x: L - 5, y: Y(v) + 4, "text-anchor": "end", style: "fill:var(--muted);font-size:11px", text: fmt(v, 2) }, svg);
        });
        S("text", { x: L + Wd / 2, y: T + Ht + 30, "text-anchor": "middle", style: "fill:var(--text);font-size:12px", text: "FPR (téves riasztás aránya)" }, svg);
        S("text", { x: 12, y: T + Ht / 2, "text-anchor": "middle", transform: `rotate(-90 12 ${T + Ht / 2})`, style: "fill:var(--text);font-size:12px", text: "TPR (találati arány)" }, svg);
        S("line", { x1: X(0), y1: Y(0), x2: X(1), y2: Y(1), style: "stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 4" }, svg);
        const shown = pts.slice(0, k + 1);
        if (done) S("polygon", { points: shown.map(p => `${X(p.fpr)},${Y(p.tpr)}`).join(" ") + ` ${X(1)},${Y(0)} ${X(0)},${Y(0)}`, style: "fill:var(--accent);opacity:.13" }, svg);
        S("polyline", { points: shown.map(p => `${X(p.fpr)},${Y(p.tpr)}`).join(" "), style: "fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round" }, svg);
        shown.forEach((p, i) => S("circle", { cx: X(p.fpr), cy: Y(p.tpr), r: i === k ? 6 : 3.5, style: `fill:${i === k ? "var(--accent)" : "var(--card)"};stroke:var(--accent);stroke-width:2` }, svg));
        const cp = pts[k];
        S("text", { x: Math.min(X(cp.fpr) + 9, L + Wd - 70), y: Math.max(Y(cp.tpr) - 9, T + 12), style: "fill:var(--text);font-size:11px;font-weight:600", text: `(${fmt(cp.fpr, 2)}; ${fmt(cp.tpr, 2)})` }, svg);
        // kiírás
        let s = k === 0 ? `küszöb a legnagyobb pontszám fölött: semmit sem jósolunk élnek (${k}/${thr.length}. küszöb)` :
          `küszöb: pont ≥ <b>${fs(t)}</b> (${k}/${thr.length}.) → ${pred.length} párt jósolunk élnek`;
        s += `<br>TP = ${TP}, FP = ${FP} · TPR = ${TP}/${P} = <b>${fmt(TP / P, 3)}</b> · FPR = ${FP}/${N} = <b>${fmt(FP / N, 3)}</b> · precision = ${pred.length ? `${TP}/${pred.length} = <b>${fmt(TP / pred.length, 3)}</b>` : "– (nincs jóslat)"}`;
        if (k > 0 && pts[k].fpr > pts[k - 1].fpr && pts[k].tpr > pts[k - 1].tpr) s += `<br><span class="muted">Holtverseny: ezen a küszöbön pozitív és negatív pár is átlépett – a görbe ferdén megy.</span>`;
        const Pp = items.filter(x => x.y), Nn = items.filter(x => !x.y);
        let wins = 0, ties = 0; Pp.forEach(p => Nn.forEach(q => { if (p.s > q.s + 1e-12) wins++; else if (Math.abs(p.s - q.s) < 1e-12) ties++; }));
        const auc = (wins + ties / 2) / (P * N);
        if (done) {
          s += `<br>AUC = (nyert + ½ · döntetlen) / (P · N) = (${wins} + ½ · ${ties}) / ${P * N} = <b>${fmt(wins + ties / 2, 1)}/${P * N} = ${f3(auc)}</b>` +
            `<br><span class="muted">A satírozott terület a görbe alatt pontosan ennyi: a ROC-görbe minden vízszintes lépése egy negatív, minden függőleges egy pozitív pár.</span>`;
          grid.innerHTML = `<p class="muted" style="font-size:.86rem;margin:.2rem 0">Minden (pozitív, negatív) pár: ✓ a pozitív kapott több pontot, ½ döntetlen, ✗ a negatív kapott többet.</p>` +
            tbl(["pozitív \\ negatív", ...Nn.map(q => `${q.name}<br><span class="muted" style="font-weight:400">${fs(q.s)}</span>`)],
              Pp.map(p => `<tr><th style="text-align:left;padding:.2em .5em">${p.name} <span class="muted" style="font-weight:400">${fs(p.s)}</span></th>` + Nn.map(q => {
                const r = p.s > q.s + 1e-12 ? ["✓", "--setC"] : Math.abs(p.s - q.s) < 1e-12 ? ["½", "--muted"] : ["✗", "--setB"];
                return `<td style="text-align:center;font-weight:700;color:var(${r[1]});background:color-mix(in srgb, var(${r[1]}) 12%, var(--card))">${r[0]}</td>`;
              }).join("") + "</tr>"));
        } else { s += `<br><span class="muted">Lépj végig a küszöbökön (vagy „mind”) – a végén jön az AUC.</span>`; grid.innerHTML = ""; }
        ro.innerHTML = s;
        root.dataset.auc = JSON.stringify({ src, meth, k, K: thr.length, TP, FP, wins, ties, PN: P * N, auc: +auc.toFixed(4), done });
      }
      build();
    };

    /* ------------------------------------------------------------------
       11.3  leakage-demo – mi történik, ha a tesztélek a pontozó gráfban maradnak?
       ------------------------------------------------------------------ */
    W["leakage-demo"] = root => {
      header(root, "Szivárgás: a tesztélek a pontozó gráfban",
        "A tesztéleket (a jósolandó párokat) a pontozás előtt <b>ki kell venni</b> a gráfból. Ha bent maradnak, a módszer „belelát” a válaszba, és az AUC hamisan nagy lesz. " +
        "Kapcsold be a szivárgást, és nézd, melyik módszer mennyit „nyer” vele!");
      const narrow = root.clientWidth < 560, AS = arvizSplit(), K = karateGraph(), KN = nonEdges(34, K.edges);
      let data = "arviz", leak = false, seed = 1, avg = null, stop = null, cur = null;
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "a tesztélek a pontozó gráfban:"));
      toggleGroup(c1, [[false, "nem (helyes)"], [true, "igen (szivárgás)"]], leak, v => { leak = v; render(); });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "adat:"));
      toggleGroup(c2, [["arviz", "Árvízhét H–Sze → Cs–V"], ["karate", "karateklub, 10% tesztél"]], data, v => { data = v; cancel(); avg = null; compute(); });
      const kBox = h("span", { style: "display:inline-flex;flex-wrap:wrap;gap:.4rem;align-items:center" });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      kBox.append(btn("új felosztás", () => { cancel(); seed++; avg = null; compute(); }), btn("20 felosztás átlaga", () => runAvg()), prog);
      c2.append(kBox);
      root.append(c1, c2);
      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const gbox = h("div"); left.append(gbox);
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" }); left.append(legend);
      const svg = S("svg", { viewBox: "0 0 400 260", style: "width:100%;max-width:440px;display:block;margin:auto", role: "img", "aria-label": "AUC módszerenként" });
      right.append(svg);
      right.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0", html: `${sq("--setA")}helyes (felső sáv) · ${sq("--setB")}szivárgó (alsó sáv) · a kiválasztott állapot élénk, a másik halvány` }));
      const ro = h("div", { class: "readout" }), tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(ro, tw);
      root.append(h("div", { style: "margin-top:.6rem;font-size:.9rem", html:
        "<b>Miért nő?</b> <b>PA:</b> a tesztél mindkét végpontja fokát eggyel növeli – a pozitív párok pontja így <i>mindig</i> nő, a negatívaké csak ritkán. " +
        "<b>CN:</b> egy él nem közös szomszéd – a tesztél $(u, v)$ maga nem változtat $u$ és $v$ közös szomszédain; a pozitív pár CN-je csak akkor nő, ha <i>más</i> tesztélek zárnak vele háromszöget " +
        "(az Árvízhéten a Ko–Sz, Ko–Kl, Sz–Kl épp ilyen). Közben néhány negatív pár is kap egy új közös szomszédot ($v$ új közös szomszédja $u$-nak és $v$ régi szomszédainak), ezért a CN AUC-ja a karateklubon átlagban alig mozdul. " +
        "<b>AA, RA:</b> ugyanígy a közös szomszédokon múlik. " +
        "<b>Jaccard:</b> a tesztél a nevezőt (az uniót) is növeli, ezért akár csökkenhet is. <b>Spektrális:</b> a tesztél a beágyazásban egymás felé húzza a két végpontját." }));
      math(root.lastChild);

      const asp = narrow ? 0.85 : 0.72;
      const view = new GK.View(gbox, { aspect: asp, radius: 13, draggable: false, maxW: 440 });
      const arvNodes = preset("arviz", asp).nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y }));
      const karNodes = () => preset("karate", asp).nodes;

      /* egy felosztás kiértékelése: { m: [helyes, szivárgó] } */
      function evalSplit(n, train, full, pos, neg, spec) {
        const out = {}, s0 = linkScorer(n, train), s1 = linkScorer(n, full);
        LINK_METHODS.forEach(([m]) => {
          out[m] = [s0, s1].map(sc => aucPairs(pos.map(([a, b]) => sc(a, b)[m]), neg.map(([a, b]) => sc(a, b)[m])));
        });
        if (spec) out.SP = [train, full].map(E => { const Z = laplacianEmbed(n, E, 2).Z; return aucPairs(pos.map(([a, b]) => -dist(Z[a], Z[b])), neg.map(([a, b]) => -dist(Z[a], Z[b]))); });
        return out;
      }
      function karSplit(sd) {
        const { train, test } = holdoutSplit(34, K.edges, 0.1, rng(sd * 7919 + 3));
        return { train, test, res: evalSplit(34, train, K.edges, test.map(e => [e.a, e.b]), KN, true) };
      }
      function compute() {
        kBox.style.display = data === "karate" ? "inline-flex" : "none";
        if (data === "arviz") {
          const pos = AS.cand.filter((_, i) => AS.y[i]), neg = AS.cand.filter((_, i) => !AS.y[i]);
          cur = { n: 7, train: AS.G1.edges, test: AS.test, res: evalSplit(7, AS.G1.edges, AS.GF.edges, pos, neg, false), npos: pos.length, nneg: neg.length };
        } else { const r = karSplit(seed); cur = { n: 34, ...r, npos: r.test.length, nneg: KN.length }; }
        prog.textContent = "";
        render();
      }
      function cancel() { if (stop) { stop(); stop = null; } }
      function runAvg() {
        cancel(); const acc = {}, R = 20;
        stop = chunked(R, 1, i => {
          const r = karSplit(1000 + i).res;
          Object.entries(r).forEach(([m, v]) => { (acc[m] = acc[m] || [[], []]); acc[m][0].push(v[0]); acc[m][1].push(v[1]); });
        }, d => { prog.textContent = `számolás: ${d}/${R} felosztás`; }, () => {
          stop = null; avg = { R, ms: acc }; prog.textContent = `kész: ${R} felosztás átlaga`; render();
        });
      }
      const MN = { CN: "CN", J: "Jaccard", AA: "AA", RA: "RA", PA: "PA", SP: "spektrális (2D)" };
      function render() {
        // gráf
        const trainE = cur.train.map(e => ({ a: e.a, b: e.b, w: 1, color: "--muted", width: data === "karate" ? 1.3 : 2 }));
        const testE = cur.test.map(e => ({ a: e.a, b: e.b, w: 1, color: "--setB", width: 3, dash: leak ? null : [6, 4], alpha: leak ? 0.55 : 1 }));
        view.o.radius = data === "karate" ? (narrow ? 8 : 10) : (narrow ? 13 : 15);
        view.setGraph(data === "arviz" ? arvNodes : karNodes(), trainE.concat(testE));
        legend.innerHTML = `${dash("--muted")}pontozó (tanító) él · ` + (leak ? `${dash("--setB")}<span style="opacity:.7">tesztél – <b>benne van</b> a pontozó gráfban</span>` : `${dash("--setB", "dashed")}tesztél – kivéve, ezt kell megjósolni`) +
          ` · ${cur.test.length} tesztél, ${cur.nneg} negatív pár`;
        // értékek
        const ms = Object.keys(cur.res), val = {};
        ms.forEach(m => { val[m] = avg ? [0, 1].map(j => meanSd(avg.ms[m][j])) : [0, 1].map(j => ({ mean: cur.res[m][j], sd: 0 })); });
        // oszlopdiagram
        svg.innerHTML = "";
        const L = narrow ? 92 : 100, Rr = 40, top = 20, rowH = 36, VW = narrow ? 330 : 400, Wd = VW - L - Rr, Ht = ms.length * rowH;
        svg.setAttribute("viewBox", `0 0 ${VW} ${top + Ht + 34}`);
        const X = v => L + v * Wd;
        [0, 0.25, 0.5, 0.75, 1].forEach(v => {
          S("line", { x1: X(v), y1: top, x2: X(v), y2: top + Ht, style: "stroke:var(--border);stroke-width:1" }, svg);
          S("text", { x: X(v), y: top + Ht + 14, "text-anchor": "middle", style: "fill:var(--muted);font-size:11px", text: fmt(v, 2) }, svg);
        });
        S("text", { x: X(0.5), y: top + Ht + 28, "text-anchor": "middle", style: "fill:var(--text);font-size:12px", text: "AUC" }, svg);
        ms.forEach((m, i) => {
          const y0 = top + i * rowH + 5;
          S("text", { x: L - 6, y: y0 + 15, "text-anchor": "end", style: "fill:var(--text);font-size:12px;font-weight:600", text: MN[m] }, svg);
          [0, 1].forEach(j => {
            const on = (j === 1) === leak, v = val[m][j].mean, y = y0 + j * 13;
            S("rect", { x: X(0), y, width: Math.max(0, X(v) - X(0)), height: 11, rx: 2, style: `fill:var(${j ? "--setB" : "--setA"});opacity:${on ? 1 : 0.3}` }, svg);
            if (on) S("rect", { x: X(0), y: y - 1, width: Math.max(0, X(v) - X(0)), height: 13, rx: 2, style: "fill:none;stroke:var(--text);stroke-width:1" }, svg);
            S("text", { x: X(v) + 4, y: y + 10, style: `fill:var(--text);font-size:10.5px;opacity:${on ? 1 : 0.6};${on ? "font-weight:700" : ""}`, text: f3(v) }, svg);
          });
        });
        S("line", { x1: X(0.5), y1: top - 4, x2: X(0.5), y2: top + Ht, style: "stroke:var(--text);stroke-width:1.5;stroke-dasharray:4 3" }, svg);
        S("text", { x: X(0.5), y: top - 8, "text-anchor": "middle", style: "fill:var(--muted);font-size:10px", text: "véletlen" }, svg);
        // táblázat + kiírás
        const f = o => f3(o.mean) + (avg ? ` ± ${f3(o.sd)}` : "");
        tw.innerHTML = tbl(["módszer", leak ? "helyes" : "<b>helyes</b>", leak ? "<b>szivárgó</b>" : "szivárgó", "különbség"],
          ms.map(m => `<tr><td>${MN[m]}</td><td style="text-align:right;${leak ? "color:var(--muted)" : "font-weight:700"}">${f(val[m][0])}</td>` +
            `<td style="text-align:right;${leak ? "font-weight:700" : "color:var(--muted)"}">${f(val[m][1])}</td>` +
            `<td style="text-align:right">${val[m][1].mean - val[m][0].mean >= 0 ? "+" : "−"}${f3(Math.abs(val[m][1].mean - val[m][0].mean))}</td></tr>`));
        ro.innerHTML = (data === "arviz" ? `Árvízhét: pontozó gráf = ${leak ? "<b>az egész hét</b> (benne a 4 tesztél)" : "a hét eleje (H–Sze)"}; ${cur.npos} pozitív, ${cur.nneg} negatív jelölt pár.` :
          `Karateklub: ${cur.test.length} tesztél (10%), negatívak: mind a ${KN.length} eredeti nem él; pontozó gráf: ${leak ? "<b>a teljes gráf</b>" : "a tanítógráf (a tesztélek nélkül)"}. ` +
          (avg ? `<b>${avg.R} felosztás átlaga ± szórás</b> (a gráfon az utolsó egyedi felosztás).` : `${seed}. felosztás – a „20 felosztás átlaga” megmutatja, mi nem a véletlen műve.`));
        const out = {}; ms.forEach(m => { out[m] = [+val[m][0].mean.toFixed(4), +val[m][1].mean.toFixed(4)]; });
        root.dataset.leak = JSON.stringify({ data, leak, avg: avg ? avg.R : 0, ntest: cur.test.length, auc: out });
      }
      compute();
    };
  }
  /* ==================================================================
     w2: 11.4–11.6 widgetjei (spectral-embed, random-walk-corpus, link-pred-lab)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = (c, dash = false) => dash
      ? `<span style="display:inline-block;width:1.3em;height:0;border-top:2.5px dashed ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`
      : `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const svgEl = (Wd, Ht, inner, label, extra = "") =>
      `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;touch-action:manipulation" role="img" aria-label="${label}" ${extra}>${inner}</svg>`;
    const pct = (x, d = 0) => fmt(100 * x, d) + "%";
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    /* darabolt futtatás: job(i), i = 0 … total − 1, kötegenként „per” darab → leállító függvény */
    function chunked(total, per, job, onProg, onDone) {
      let i = 0, dead = false;
      const tick = () => {
        if (dead) return;
        const end = Math.min(total, i + per);
        for (; i < end; i++) job(i);
        onProg(i);
        if (i < total) setTimeout(tick, 0); else onDone();
      };
      setTimeout(tick, 0);
      return () => { dead = true; };
    }
    const range = (min, max, step, value, label, oninput, width = "8rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:38vw`, oninput });
    const mono = txt => h("b", { style: "font-family:var(--mono);min-width:2.6em;display:inline-block" }, txt);
    const tbl = (head, rows) =>
      `<table style="width:auto;margin:.3rem 0;font-size:.86rem"><thead><tr>${head.map(x => `<th style="padding:.2em .45em">${x}</th>`).join("")}</tr></thead>` +
      `<tbody>${rows.map(r => `<tr${r.st ? ` style="${r.st}"` : ""}>${(r.c || r).map(x => `<td style="padding:.2em .45em;text-align:center">${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const CLUB_COL = ["--setA", "--setB"], CLUB_SYM = ["●", "▲"], CLUB_NAME = ["az edző klubja (1)", "az elnök klubja (34)"];
    const OK = "✓", NO = "✗";

    /* a fejezet kis gráfjai: { name, nodes, edges (w = 1), club? } – "five": öt barát (A–E) */
    const FIVE = { labels: ["A", "B", "C", "D", "E"], edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]], pos: [[0, 0], [1, 0.6], [0, 1.2], [2.1, 0.6], [3.2, 0.6]] };
    function graphOf(key, aspect) {
      const bin = E => E.map(e => ({ a: e.a, b: e.b, w: 1 }));
      if (key === "five") {
        const P = GK.normalize(FIVE.pos, aspect);
        return { name: "öt barát", nodes: FIVE.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges: FIVE.edges.map(([a, b]) => ({ a, b, w: 1 })) };
      }
      if (key === "arviz") { const g = preset("arviz", aspect); return { name: "Árvízhét (egész hét)", nodes: g.nodes, edges: bin(arvizGraph().edges) }; }
      if (key === "karate") { const g = preset("karate", aspect); return { name: "karateklub", nodes: g.nodes, club: g.club, edges: bin(g.edges) }; }
      if (key === "lesmis") { const g = lesmisGraph(aspect); return { name: "Les Misérables", nodes: g.nodes, edges: bin(g.edges) }; }
      const g = preset(key, aspect); return { name: g.name, nodes: g.nodes, edges: bin(g.edges) };
    }
    /* SVG-szórásdiagram: pts [{x, y, label, color, sym?}], edges [{a, b}], pairs [[i, j]] (szaggatott „jóslat”), hl: kiemelt index */
    function scatterSVG({ pts, edges = [], pairs = [], hl = -1, xLab = "", yLab = "", Wd = 380, Ht = 320, r = 6, fs = 11, aria = "beágyazás" }) {
      const pad = 26, xs = pts.map(p => p.x), ys = pts.map(p => p.y);
      const mx = Math.max(1e-9, ...xs.map(Math.abs)) * 1.12, my = Math.max(1e-9, ...ys.map(Math.abs)) * 1.12;
      const X = x => pad + (x + mx) / (2 * mx) * (Wd - 2 * pad), Y = y => Ht - pad - (y + my) / (2 * my) * (Ht - 2 * pad);
      let s = `<line x1="${X(0)}" y1="${pad - 8}" x2="${X(0)}" y2="${Ht - pad + 8}" style="stroke:var(--border);stroke-dasharray:3 3"/>` +
        `<line x1="${pad - 8}" y1="${Y(0)}" x2="${Wd - pad + 8}" y2="${Y(0)}" style="stroke:var(--border);stroke-dasharray:3 3"/>`;
      s += `<text x="${Wd - pad + 6}" y="${Math.min(Ht - 4, Y(0) + 15)}" text-anchor="end" style="fill:var(--muted);font-size:11px">${esc(xLab)} →</text>`;
      s += `<text x="${X(0) + 5}" y="${pad - 12}" style="fill:var(--muted);font-size:11px">↑ ${esc(yLab)}</text>`;
      edges.forEach(e => { s += `<line x1="${X(pts[e.a].x)}" y1="${Y(pts[e.a].y)}" x2="${X(pts[e.b].x)}" y2="${Y(pts[e.b].y)}" style="stroke:var(--muted);stroke-opacity:.35;stroke-width:1.2"/>`; });
      pairs.forEach(([i, j]) => { s += `<line x1="${X(pts[i].x)}" y1="${Y(pts[i].y)}" x2="${X(pts[j].x)}" y2="${Y(pts[j].y)}" style="stroke:var(--setC);stroke-width:2.2;stroke-dasharray:5 3"/>`; });
      /* az egybeeső (vagy nagyon közeli) pontok felirata egyben */
      const groups = new Map();
      pts.forEach((p, i) => {
        const k = Math.round(X(p.x) / 3) + "," + Math.round(Y(p.y) / 3);
        if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i);
      });
      pts.forEach((p, i) => {
        const on = i === hl, rr = on ? r + 2 : r;
        if (p.sym === "▲") s += `<path data-i="${i}" d="M${X(p.x)} ${Y(p.y) - rr * 1.15}L${X(p.x) + rr} ${Y(p.y) + rr * 0.75}L${X(p.x) - rr} ${Y(p.y) + rr * 0.75}Z" style="fill:${sv(p.color)};stroke:${on ? "var(--text)" : "var(--card)"};stroke-width:${on ? 2.5 : 1.2};cursor:pointer"/>`;
        else s += `<circle data-i="${i}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${rr}" style="fill:${sv(p.color)};stroke:${on ? "var(--text)" : "var(--card)"};stroke-width:${on ? 2.5 : 1.2};cursor:pointer"/>`;
      });
      groups.forEach(g => {
        const p = pts[g[0]], lab = g.map(i => pts[i].label).join(", ");
        const tw = 0.6 * fs * lab.length, left = X(p.x) + r + 3 + tw > Wd - 2;
        s += `<text x="${left ? X(p.x) - r - 3 : X(p.x) + r + 3}" y="${Y(p.y) - r + 1}" text-anchor="${left ? "end" : "start"}" style="fill:var(--text);font-size:${fs}px;font-weight:600;paint-order:stroke;stroke:var(--card);stroke-width:3px;pointer-events:none">${esc(lab)}</text>`;
      });
      return svgEl(Wd, Ht, s, aria);
    }
    /* két csúcs „ikrek”-e: ugyanazok a szomszédaik (egymást nem számítva) */
    const twins = (L, u, v) => { const a = L[u].filter(x => x !== v).sort((x, y) => x - y), b = L[v].filter(x => x !== u).sort((x, y) => x - y); return a.length === b.length && a.every((x, i) => x === b[i]); };

    /* ------------------------------------------------------------------
       11.4  spectral-embed – Laplace-sajátleképezés
       ------------------------------------------------------------------ */
    W["spectral-embed"] = root => {
      header(root, "Spektrális beágyazás: a Laplace-mátrix sajátvektorai mint koordináták",
        "Az $L = D - A$ Laplace-mátrix 2. sajátvektora adja a csúcsok $x$, a 3. (vagy a 4.) az $y$ koordinátáját. " +
        "Ami a beágyazásban közel kerül egymáshoz, de még nem szomszédos, az a jóslat: közöttük valószínű az új él. " +
        "A kis gráfoknál két csúcsra egymás után kattintva az él be- vagy kikapcsol, élre kattintva törlődik – a beágyazás azonnal frissül.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let key = "path4", yAx = 3, showE = true, focus = -1, lastSel = -2, G, n, emb, pred = [];
      const ASP = { path4: 0.32, five: 0.45, arviz: 0.5, karate: 0.62 }, RAD = { path4: 15, five: 15, arviz: 14, karate: 8 };

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["path4", "4 csúcsú út"], ["five", "öt barát (A–E)"], ["arviz", "Árvízhét (egész hét)"], ["karate", "karateklub"]], key, v => { key = v; build(); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "y tengely:"));
      toggleGroup(c2, [[3, "3. sajátvektor"], [4, "4. sajátvektor"]], yAx, v => { yAx = v; render(); });
      const cbE = h("input", { type: "checkbox", checked: "" });
      cbE.addEventListener("change", () => { showE = cbE.checked; render(); });
      const bReset = btn("eredeti élek", () => build());
      c2.append(h("label", null, cbE, "a gráf élei a beágyazásban"), bReset);
      root.append(c1, c2);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), side = h("div");
      grid.append(box, side); root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" }), predBox = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A Laplace-sajátleképezés úgy rendez, hogy a szomszédok közel legyenek – a közös szomszédokkal rendelkező, „azonos helyzetű” csúcsok egymás mellé (vagy egymásra) kerülnek.");
      root.append(info, predBox, lesson);
      const view = new GK.View(box, { aspect: 0.32, radius: 15, editable: true, maxNodes: 4,
        onChange: v => { G.edges = v.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); focus = -1; recompute(); },
        onDraw: (ctx, v) => {
          if (!G || !emb) return;
          /* a jóslat (legközelebbi nem szomszédos párok) szaggatva a gráfon is */
          const r = v.o.radius;
          ctx.save(); ctx.strokeStyle = GK.css("--setC"); ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]); ctx.globalAlpha = 0.9;
          pred.slice(0, 5).forEach(o => {
            const [x1, y1] = v.px(v.nodes[o.i]), [x2, y2] = v.px(v.nodes[o.j]), d = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / d, uy = (y2 - y1) / d;
            if (d < 2 * r + 4) return;
            ctx.beginPath(); ctx.moveTo(x1 + ux * (r + 2), y1 + uy * (r + 2)); ctx.lineTo(x2 - ux * (r + 2), y2 - uy * (r + 2)); ctx.stroke();
          });
          ctx.restore();
          const s = v.o.editable ? v.sel : focus;
          if (s !== lastSel) { lastSel = s; drawScatter(); }
        } });
      box.append(legend);
      side.addEventListener("click", ev => {
        const t = ev.target.closest("[data-i]"); if (!t) return;
        const i = +t.dataset.i; focus = focus === i ? -1 : i;
        view.hl = new Set(focus >= 0 ? [focus] : []); lastSel = -2; view.draw(); render();
      });
      const lab = i => G.nodes[i].label;

      function build() {
        G = graphOf(key, ASP[key]); n = G.nodes.length; focus = -1; emb = null;
        const editable = key !== "karate";
        Object.assign(view.o, { aspect: ASP[key], radius: narrow ? Math.round(RAD[key] * 0.85) : RAD[key], editable, maxNodes: n,
          onNodeClick: editable ? null : i => { focus = focus === i ? -1 : i; view.hl = new Set(focus >= 0 ? [focus] : []); lastSel = -2; view.draw(); render(); } });
        view.hl = new Set();
        const nodes = G.nodes.map((nd, i) => (G.club ? Object.assign({}, nd, { color: CLUB_COL[G.club[i]] }) : nd));
        view.setGraph(nodes, G.edges); view.resize();
        bReset.style.display = editable ? "" : "none";
        recompute();
      }
      function recompute() {
        emb = laplacianEmbed(n, G.edges, Math.min(3, n - 1));
        render();
      }
      const coord = i => [emb.Z[i][0], emb.Z[i][yAx - 2] != null ? emb.Z[i][yAx - 2] : 0];
      function drawScatter() {
        const sel = view.o.editable ? view.sel : focus;
        const pts = G.nodes.map((nd, i) => { const [x, y] = coord(i); return { x, y, label: nd.label, color: G.club ? CLUB_COL[G.club[i]] : "--accent", sym: G.club ? CLUB_SYM[G.club[i]] : null }; });
        side.innerHTML = scatterSVG({ pts, edges: showE ? G.edges : [], pairs: pred.slice(0, 5).map(o => [o.i, o.j]), hl: sel,
          xLab: "2. sajátvektor", yLab: yAx + ". sajátvektor", r: key === "karate" ? 5 : 6.5, fs: key === "karate" ? 9.5 : 12, aria: "spektrális beágyazás" }) +
          `<p class="muted" style="font-size:.82rem;margin:.2rem 0 0">Kattints egy pontra: a gráfon is kiemelődik.</p>`;
      }
      function render() {
        const L = nbrs(n, G.edges), S = edgeSet(G.edges), vals = emb.vals;
        /* nem szomszédos párok távolság szerint */
        const cand = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (!S.has(i + "-" + j)) cand.push({ i, j, d: dist(coord(i), coord(j)) });
        cand.sort((a, b) => a.d - b.d || a.i - b.i || a.j - b.j);
        pred = cand;
        view.draw(); drawScatter();
        const eps = 1e-6;
        legend.innerHTML = (G.club ? `${sw(CLUB_COL[0])}${CLUB_NAME[0]} ${sw(CLUB_COL[1])}${CLUB_NAME[1]} (▲ a beágyazásban) · ` : "") +
          `${sw("--setC", true)}a beágyazásban legközelebbi 5 nem szomszédos pár (jóslat)`;
        const mu = [1, 2, 3].filter(k => k < n).map(k => `$\\mu_${k + 1} = ${fmM(Math.abs(vals[k]) < 1e-9 ? 0 : vals[k], 3)}$`).join(", ");
        let s = `Sajátértékek: $\\mu_1 = 0$, ${mu}.`;
        const comps = components(n, G.edges).sizes.length;
        if (vals[1] < eps) s += `<br>⚠ A gráf nem összefüggő (${comps} komponens): $\\mu_2 = 0$. Ilyenkor a „sajátvektorok” a komponenseket választják szét, a komponensen belüli szerkezetet nem mutatják.`;
        const used = [1, yAx - 1].filter(k => k < n);
        const mult = used.filter(k => vals[k] > eps && ((k > 1 && Math.abs(vals[k] - vals[k - 1]) < eps) || (k + 1 < n && Math.abs(vals[k] - vals[k + 1]) < eps)));
        if (mult.length) s += `<br>⚠ Többszörös sajátérték (${[...new Set(mult)].map(k => `$\\mu_${k + 1}$`).join(", ")}): a tengelyek ilyenkor nem egyértelműek – a sajátaltéren belül bármely elforgatás ugyanolyan jó.`;
        /* egybeeső csúcsok */
        const same = cand.filter(o => o.d < eps), sameAdj = [];
        for (const e of G.edges) if (dist(coord(e.a), coord(e.b)) < eps) sameAdj.push({ i: Math.min(e.a, e.b), j: Math.max(e.a, e.b) });
        /* egybeeső csoportok (unió–holmi), egy sor csoportonként */
        const par = [...Array(n).keys()], fd = x => (par[x] === x ? x : (par[x] = fd(par[x])));
        [...same, ...sameAdj].forEach(o => { par[fd(o.j)] = fd(o.i); });
        const grp = new Map();
        for (let i = 0; i < n; i++) { const r = fd(i); if (!grp.has(r)) grp.set(r, []); grp.get(r).push(i); }
        [...grp.values()].filter(g => g.length > 1).forEach(g => {
          const tw = g.every(a => g.every(b => a === b || twins(L, a, b)));
          const names = g.length === 2 ? `${lab(g[0])} és ${lab(g[1])}` : g.slice(0, -1).map(lab).join(", ") + " és " + lab(g[g.length - 1]);
          s += `<br>• <b>${names} ugyanott van</b> – ` + (tw ? "ugyanazok a szomszédaik." : "ebben a két koordinátában egybeesnek.");
        });
        const sel = view.o.editable ? view.sel : focus;
        if (sel >= 0) { const [x, y] = coord(sel); s += `<br>${lab(sel)}: $(${fmM(x, 3)};\\ ${fmM(y, 3)})$, szomszédai: ${L[sel].map(lab).join(", ") || "nincs"}.`; }
        info.innerHTML = s; math(info);
        /* jóslat */
        if (!cand.length) predBox.innerHTML = "Minden pár szomszédos – nincs jelölt.";
        else {
          const rows = cand.slice(0, 5).map((o, k) => [k + 1 + ".", `${lab(o.i)} – ${lab(o.j)}`, fmt(o.d, 3)].concat(G.club ? [G.club[o.i] === G.club[o.j] ? OK + " igen" : NO + " nem"] : []));
          const far = cand[cand.length - 1];
          predBox.innerHTML = `<b>Jóslat:</b> a legközelebbi nem szomszédos párok (távolság a beágyazásban)` +
            `<div class="tw" style="overflow-x:auto">${tbl(["#", "pár", "távolság"].concat(G.club ? ["egy klub?"] : []), rows)}</div>` +
            `A legtávolabbi nem szomszédos pár: ${lab(far.i)} – ${lab(far.j)} (${fmt(far.d, 3)}).`;
        }
        root.dataset.result = JSON.stringify({ key, yAx, m: G.edges.length, vals: vals.slice(0, 4).map(x => +x.toFixed(4)),
          Z: G.nodes.map((_, i) => coord(i).map(x => +x.toFixed(4))), near: cand.slice(0, 5).map(o => [lab(o.i), lab(o.j), +o.d.toFixed(4)]),
          far: cand.length ? [lab(cand[cand.length - 1].i), lab(cand[cand.length - 1].j), +cand[cand.length - 1].d.toFixed(4)] : null,
          same: [...same, ...sameAdj].map(o => [lab(o.i), lab(o.j), twins(L, o.i, o.j)]), mult: mult.length > 0, disc: vals[1] < eps });
      }
      build();
    };

    /* ------------------------------------------------------------------
       11.5  random-walk-corpus – séták = mondatok, csúcsok = szavak
       ------------------------------------------------------------------ */
    W["random-walk-corpus"] = root => {
      header(root, "Véletlen séták mint szöveg: DeepWalk és node2vec",
        "Minden csúcsból indíts néhány véletlen sétát: a séták a „mondatok”, a csúcsok a „szavak”. Egy $\\pm w$ szélességű ablakon belül álló két szó egy " +
        "(középső, környező) pár; a párok gyakoriságából PPMI-mátrix, abból beágyazás lesz. A node2vec két paramétere a lépést torzítja: " +
        "visszalépés súlya $1/p$, a korábbi csúcs szomszédjáé $1$, a távolodásé $1/q$.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let key = "five", p = 1, q = 1, len = 10, num = 10, win = 2, seed = 1, sortBy = "count", st = { prev: 0, cur: 1 }, exI = 3;
      let G, n, L, walks, C, PM, Z;
      const ASP = { five: 0.42, arviz: 0.5, karate: 0.62 }, RAD = { five: 15, arviz: 14, karate: 8 };

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["five", "öt barát (A–E)"], ["arviz", "Árvízhét (egész hét)"], ["karate", "karateklub"]], key, v => { key = v; build(); });
      /* p és q logaritmikus skálán: 2^v, v ∈ [−2; 2] */
      const pOut = mono("1"), qOut = mono("1");
      const pSl = range(-2, 2, 0.25, 0, "p (visszalépés)", () => { p = Math.pow(2, +pSl.value); pOut.textContent = fmt(p, 2); gen(); });
      const qSl = range(-2, 2, 0.25, 0, "q (távolodás)", () => { q = Math.pow(2, +qSl.value); qOut.textContent = fmt(q, 2); gen(); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("label", null, "$p$:", pSl, pOut), h("label", null, "$q$:", qSl, qOut),
        btn("p = q = 1 (DeepWalk)", () => { pSl.value = qSl.value = 0; p = q = 1; pOut.textContent = qOut.textContent = "1"; gen(); }));
      math(c2);
      const lOut = mono("10"), nOut = mono("10"), wOut = mono("2");
      const lSl = range(5, 40, 1, len, "sétahossz", () => { len = +lSl.value; lOut.textContent = len; gen(); }, "6rem");
      const nSl = range(1, 20, 1, num, "séta csúcsonként", () => { num = +nSl.value; nOut.textContent = num; gen(); }, "6rem");
      const wSl = range(1, 5, 1, win, "ablak", () => { win = +wSl.value; wOut.textContent = win; count(); }, "5rem");
      const c3 = h("div", { class: "controls" });
      c3.append(h("label", null, "sétahossz:", lSl, lOut), h("label", null, "séta / csúcs:", nSl, nOut), h("label", null, "ablak ±", wSl, wOut),
        btn("Séták generálása", () => gen(), "btn primary"), btn("új mag", () => { seed++; gen(); }));
      root.append(c1, c2, c3);

      /* felül: gráf + „egy lépés közelről” */
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), stepBox = h("div");
      grid.append(box, stepBox); root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const view = new GK.View(box, { aspect: 0.42, radius: 15, draggable: false, edgeHitTol: 10,
        onEdgeClick: i => { const e = G.edges[i]; st = st.prev === e.a && st.cur === e.b ? { prev: e.b, cur: e.a } : { prev: e.a, cur: e.b }; drawStep(); },
        onNodeClick: i => { if (L[st.cur].includes(i)) { st = { prev: st.cur, cur: i }; drawStep(); } } });
      box.append(legend);
      const stepHead = h("div", { style: "font-weight:600;margin-bottom:.3rem" }, "Egy lépés közelről");
      const sel = h("select", { "aria-label": "az utolsó lépés (előző → aktuális)", style: "max-width:100%" });
      sel.addEventListener("change", () => { const [a, b] = sel.value.split(">").map(Number); st = { prev: a, cur: b }; drawStep(); });
      const stepSvg = h("div"), stepTxt = h("div", { class: "readout" });
      stepBox.append(stepHead, h("div", { class: "controls", style: "margin:.2rem 0" }, h("label", null, "a séta utolsó lépése:", sel)), stepSvg, stepTxt);

      /* három panel */
      const panels = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;margin-top:.8rem;align-items:start" });
      const pCorp = h("div"), pPairs = h("div"), pEmb = h("div");
      panels.append(pCorp, pPairs, pEmb); root.append(panels);
      const corpTxt = h("div", { class: "readout", style: "white-space:normal;word-break:break-word;line-height:1.5" });
      const winBox = h("div", { class: "readout" });
      pCorp.append(h("div", { style: "font-weight:600" }, "1. A korpusz"), corpTxt, h("div", { style: "font-weight:600;margin-top:.6rem" }, "Ablak egy sétán"), winBox);
      const sortC = h("div", { class: "controls", style: "margin:.2rem 0" });
      sortC.append(h("span", { style: "font-size:.9rem;color:var(--muted)" }, "rendezés:"));
      toggleGroup(sortC, [["count", "darabszám"], ["ppmi", "PPMI"]], sortBy, v => { sortBy = v; drawPairs(); });
      const pairTw = h("div", { class: "tw", style: "overflow-x:auto" }), pairNote = h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0" });
      pPairs.append(h("div", { style: "font-weight:600" }, "2. A leggyakoribb párok"), sortC, pairTw, pairNote);
      const embSvg = h("div"), embTxt = h("div", { class: "readout" });
      pEmb.append(h("div", { style: "font-weight:600" }, "3. 2D beágyazás (PPMI)"), embSvg, embTxt);
      const lesson = h("p", { style: "margin:.6rem 0 0;font-weight:600" },
        "Ami a sétákban gyakran áll egymás közelében, az a beágyazásban is közel kerül. A kis q messzire visz (mélységi bejárás: a séta végigjárja a közösséget), a nagy q a közvetlen környéken tart (szélességi bejárás: a csúcs helyi szerepe számít).");
      root.append(lesson);
      winBox.addEventListener("click", ev => { const t = ev.target.closest("[data-w]"); if (!t) return; exI = +t.dataset.w; drawWin(); });

      const lab = i => G.nodes[i].label;
      function build() {
        G = graphOf(key, ASP[key]); n = G.nodes.length; L = nbrs(n, G.edges);
        Object.assign(view.o, { aspect: ASP[key], radius: narrow ? Math.round(RAD[key] * 0.85) : RAD[key] });
        view.setGraph(G.nodes, G.edges); view.resize();
        st = { prev: G.edges[0].a, cur: G.edges[0].b };
        sel.innerHTML = G.edges.flatMap(e => [[e.a, e.b], [e.b, e.a]]).map(([a, b]) => `<option value="${a}>${b}">${esc(lab(a))} → ${esc(lab(b))}</option>`).join("");
        exI = 3;
        gen();
      }
      function gen() {
        walks = randomWalks(n, G.edges, { num, length: len, p, q, R: rng(1000 * seed + 7) });
        count(); drawStep();
      }
      function count() {
        C = walkCooc(n, walks, win); PM = ppmi(C); Z = ppmiEmbed(C, 2);
        drawCorpus(); drawWin(); drawPairs(); drawEmb();
      }
      function drawCorpus() {
        const words = walks.reduce((s, w) => s + w.length, 0), pairs = walks.reduce((s, w) => s + skipPairs(w, win).length, 0);
        const show = walks.slice(0, 8).map(w => `<div>${w.map(lab).join(" ")}</div>`).join("");
        corpTxt.innerHTML = `${show}<div class="muted" style="margin-top:.3rem">…</div>` +
          `<div style="margin-top:.3rem">${walks.length} séta (${num} menet × ${n} kezdőcsúcs), <b>${words.toLocaleString("hu-HU")}</b> szó, ±${win} ablakkal <b>${pairs.toLocaleString("hu-HU")}</b> pár.</div>`;
        root.dataset.corpus = JSON.stringify({ walks: walks.length, words, pairs });
      }
      /* mintaséta: az öt barátnál a szöveg „A B D E D B C” sétája, máskor az első séta (legfeljebb 12 szó) */
      function drawWin() {
        const ex = key === "five" ? [0, 1, 3, 4, 3, 1, 2] : walks[0].slice(0, 12);
        if (exI >= ex.length) exI = Math.min(3, ex.length - 1);
        const chips = ex.map((x, i) => {
          const inW = Math.abs(i - exI) <= win && i !== exI, me = i === exI;
          return `<button type="button" class="btn${me ? " on" : ""}" data-w="${i}" style="padding:.1em .5em;margin:.1em;${inW ? "outline:2px dashed var(--setC);outline-offset:1px" : ""}">${esc(lab(x))}</button>`;
        }).join("");
        const mine = skipPairs(ex, win).filter((_, k) => true), my = [];
        for (let j = Math.max(0, exI - win); j <= Math.min(ex.length - 1, exI + win); j++) if (j !== exI) my.push(`(${lab(ex[exI])}, ${lab(ex[j])})`);
        winBox.innerHTML = `<div style="font-family:var(--sans,inherit)">${chips}</div>` +
          `<div style="margin-top:.3rem">${key === "five" ? "A szöveg mintasétája" : "Az 1. séta eleje"}: kattints egy szóra. ±${win} ablakkal a kijelölt szó párjai: ${my.join(", ")}.</div>` +
          `<div>Az egész séta (${ex.length} szó) ±1-es ablakkal <b>${skipPairs(ex, 1).length}</b>, ±${win}-es ablakkal <b>${mine.length}</b> párt ad.</div>`;
        root.dataset.win = JSON.stringify({ ex: ex.map(lab).join(" "), w1: skipPairs(ex, 1).length, w: win, nw: mine.length });
      }
      function drawPairs() {
        const S = edgeSet(G.edges), P = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (C[i][j] > 0) P.push({ i, j, c: C[i][j], m: PM[i][j] });
        P.sort((a, b) => (sortBy === "count" ? b.c - a.c || b.m - a.m : b.m - a.m || b.c - a.c) || a.i - b.i || a.j - b.j);
        const top = P.slice(0, 8);
        pairTw.innerHTML = tbl(["pár", "db", "PPMI", "szomszéd?"], top.map(o => [`${lab(o.i)} – ${lab(o.j)}`, o.c.toLocaleString("hu-HU"), fmt(o.m, 2), S.has(o.i + "-" + o.j) ? OK + " igen" : NO + " nem"]));
        const nAdj = top.filter(o => S.has(o.i + "-" + o.j)).length;
        pairNote.textContent = sortBy === "count"
          ? `A top 8-ból ${nAdj} szomszédos pár. A nyers darabszám a nagy fokszámú csúcsokat favorizálja – a PPMI ezt kiszűri (a várthoz méri).`
          : `A top 8-ból ${nAdj} szomszédos pár. PPMI = max(0, ln(P(i, j) / (P(i)·P(j)))) – mennyivel gyakoribb a pár, mint véletlenül.`;
        root.dataset.pairs = JSON.stringify(top.map(o => [lab(o.i), lab(o.j), o.c, +o.m.toFixed(3)]));
      }
      function drawEmb() {
        const pts = G.nodes.map((nd, i) => ({ x: Z[i][0], y: Z[i][1], label: nd.label, color: G.club ? CLUB_COL[G.club[i]] : "--accent", sym: G.club ? CLUB_SYM[G.club[i]] : null }));
        embSvg.innerHTML = scatterSVG({ pts, edges: G.edges, xLab: "1. irány", yLab: "2. irány", Wd: 300, Ht: 270, r: key === "karate" ? 4.5 : 6.5, fs: key === "karate" ? 9 : 12, aria: "PPMI-beágyazás" });
        let s = "A séták PPMI-mátrixának két legnagyobb sajátiránya. A gráf élei halványan.";
        if (G.club) {
          let same = 0;
          for (let i = 0; i < n; i++) {
            let b = -1, bd = Infinity;
            for (let j = 0; j < n; j++) if (j !== i) { const d = dist(Z[i], Z[j]); if (d < bd) { bd = d; b = j; } }
            if (G.club[b] === G.club[i]) same++;
          }
          s = `${sw(CLUB_COL[0])}● ${CLUB_NAME[0]}, ${sw(CLUB_COL[1])}▲ ${CLUB_NAME[1]}<br>A beágyazásban a legközelebbi szomszéd az esetek <b>${pct(same / n)}</b>-ában ugyanabból a klubból való (${same} / ${n}).`;
          root.dataset.knn = String(same / n);
        }
        embTxt.innerHTML = s;
      }
      function drawStep() {
        if (!L[st.prev].includes(st.cur)) st = { prev: G.edges[0].a, cur: G.edges[0].b };
        sel.value = st.prev + ">" + st.cur;
        const P = n2vStep(n, G.edges, st.prev, st.cur, p, q), Sp = new Set(L[st.prev]);
        const kind = x => (x === st.prev ? "back" : Sp.has(x) ? "stay" : "out");
        const KC = { back: "--setB", stay: "--setA", out: "--setC" }, KS = { back: "↩", stay: "↔", out: "→" };
        const KW = { back: "1/p", stay: "1", out: "1/q" }, KN = { back: "vissza", stay: "az előző szomszédja", out: "távolodik" };
        /* gráf: a lépés nyíllal, a jelöltek a típusuk szerint */
        const pm = new Map(P.map(o => [o.x, o]));
        const nodes = G.nodes.map((nd, i) => {
          const o = Object.assign({}, nd);
          if (i === st.cur) Object.assign(o, { color: "--accent" });
          else if (pm.has(i)) Object.assign(o, { color: KC[kind(i)], badge: KS[kind(i)] });
          else if (G.club) Object.assign(o, { color: null });
          return o;
        });
        const edges = G.edges.map(e => {
          if ((e.a === st.prev && e.b === st.cur) || (e.b === st.prev && e.a === st.cur)) return { a: st.prev, b: st.cur, w: 1, color: "--accent", width: 3.5, dir: true };
          if (e.a === st.cur || e.b === st.cur) return { ...e, color: KC[kind(e.a === st.cur ? e.b : e.a)], width: 2.5 };
          return { ...e, color: "--border", width: 1.2 };
        });
        view.setGraph(nodes, edges);
        legend.innerHTML = `Kattints egy élre (még egyszer: fordított irány), vagy egy kiemelt szomszédra a továbblépéshez. ` +
          `${sw("--accent")}aktuális csúcs · ${sw(KC.back)}↩ vissza ($1/p$) ${sw(KC.stay)}↔ az előző szomszédja ($1$) ${sw(KC.out)}→ távolodik ($1/q$)`;
        math(legend);
        /* oszlopok */
        const rowH = 30, Wd = 330, Ht = 18 + rowH * P.length, x0 = 62, bw = Wd - x0 - 110;
        let s = "";
        P.forEach((o, k) => {
          const y = 8 + k * rowH, t = kind(o.x);
          s += `<text x="${x0 - 8}" y="${y + 15}" text-anchor="end" style="fill:var(--text);font-size:12px;font-weight:600">${KS[t]} ${esc(lab(o.x))}</text>` +
            `<rect x="${x0}" y="${y + 3}" width="${Math.max(1, bw * o.p)}" height="${rowH - 10}" rx="3" style="fill:${sv(KC[t])}"/>` +
            `<text x="${x0 + bw * o.p + 5}" y="${y + 15}" style="fill:var(--text);font-size:11.5px">${fmt(o.p, 3)} (${KW[t]} = ${fmt(o.w, 2)})</text>`;
        });
        stepSvg.innerHTML = svgEl(Wd, Ht, s, "node2vec lépésvalószínűségek");
        const T = P.reduce((a, o) => a + o.w, 0);
        stepTxt.innerHTML = `A séta most ${lab(st.prev)} → ${lab(st.cur)}; a következő csúcs ${lab(st.cur)} szomszédai közül: ` +
          P.map(o => `${lab(o.x)}: ${KN[kind(o.x)]}, súly ${KW[kind(o.x)]} = ${fmt(o.w, 2)}`).join("; ") +
          `. Összeg ${fmt(T, 3)}, a valószínűség = súly / összeg.` +
          (p === 1 && q === 1 ? " ($p = q = 1$: minden szomszéd egyformán valószínű – ez a DeepWalk.)" : "");
        math(stepTxt);
        root.dataset.step = JSON.stringify({ prev: lab(st.prev), cur: lab(st.cur), p, q, P: P.map(o => [lab(o.x), +o.p.toFixed(4)]) });
      }
      build();
    };

    /* ------------------------------------------------------------------
       11.6  link-pred-lab – minden módszer egy kísérletben
       ------------------------------------------------------------------ */
    W["link-pred-lab"] = root => {
      header(root, "Kapcsolat-előrejelzési labor",
        "Véletlenszerűen kiveszünk néhány élt (ezek a <b>tesztélek</b>, a pozitívak), a maradék a tanítógráf. Minden módszer ezen pontozza a párokat; " +
        "az AUC annak a valószínűsége, hogy egy tesztél több pontot kap egy negatív (nem él) párnál, a precision@k pedig a top $k$ jóslat találati aránya ($k$ = a tesztélek száma).");
      math(root.querySelector(".w-sub"));
      const METH = [["CN", "közös szomszédok (CN)"], ["J", "Jaccard (J)"], ["AA", "Adamic–Adar (AA)"], ["RA", "erőforrás-allokáció (RA)"], ["PA", "pref. kapcsolódás (PA)"],
        ["spec", "spektrális 2D"], ["ppmi", "PPMI-séta 8D"], ["sgns", "node2vec / SGNS 16D"]];
      const HEUR = ["CN", "J", "AA", "RA", "PA"], EMB = new Set(["spec", "ppmi", "sgns"]);
      let data = "karate", frac = 0.1, splits = 10, negMode = "all", leak = false, seedBase = 1, stop = null, deb = null, started = false;
      const on = new Set(METH.map(m => m[0]));
      let G, n, last = null;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["karate", "karateklub"], ["lesmis", "Les Misérables"]], data, v => { data = v; load(); schedule(); });
      const fOut = mono("10%");
      const fSl = range(5, 30, 5, 10, "tesztélek aránya", () => { frac = +fSl.value / 100; fOut.textContent = pct(frac); schedule(); });
      c1.append(h("label", null, "tesztél:", fSl, fOut));
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "felosztás:"));
      toggleGroup(c2, [[1, "1"], [10, "10"], [30, "30"]], splits, v => { splits = v; schedule(); });
      c2.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "negatívak:"));
      toggleGroup(c2, [["all", "minden nem él"], ["rand", "véletlen, ugyanannyi"], ["hard", "nehéz: 2 távolságú párok"]], negMode, v => { negMode = v; schedule(); });
      const cbLeak = h("input", { type: "checkbox" });
      cbLeak.addEventListener("change", () => { leak = cbLeak.checked; schedule(); });
      const c3 = h("div", { class: "controls" });
      c3.append(h("label", null, cbLeak, "szivárgás (a pontozó gráf a teljes gráf)"));
      const c4 = h("div", { class: "controls", style: "gap:.3rem .8rem" });
      METH.forEach(([k, l]) => {
        const cb = h("input", { type: "checkbox", checked: "" });
        cb.addEventListener("change", () => { cb.checked ? on.add(k) : on.delete(k); schedule(); });
        c4.append(h("label", null, cb, l));
      });
      const c5 = h("div", { class: "controls" });
      const prog = h("progress", { max: "1", value: "0", style: "width:9rem;display:none" }), progT = h("span", { class: "muted", style: "font-size:.86rem" });
      c5.append(btn("Futtatás", () => run(), "btn primary"), btn("új felosztások", () => { seedBase++; run(); }), prog, progT);
      root.append(c1, c2, c3, c4, c5);
      const info = h("div", { class: "readout" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" }), chart = h("div", { style: "margin-top:.4rem" });
      const lesson = h("div", { style: "margin:.5rem 0 0" });
      root.append(info, tw, chart, lesson);
      lesson.innerHTML = `<p style="margin:.3rem 0;font-weight:600">Próbáld ki:</p><ul style="margin:.2rem 0 0 1.1rem;padding:0;font-size:.92rem">` +
        `<li><b>szivárgás</b>: a PA, a spektrális és a séta-alapú módszerek „megugranak” – a tesztél a fokszámban és a sétákban is benne van; a CN alig mozdul (egy él nem közös szomszéd).</li>` +
        `<li><b>nehéz negatívak</b>: ha minden negatívnak van közös szomszédja, a CN szinte használhatatlan – a feladat nehézsége a negatívak megválasztásán is múlik.</li>` +
        `<li><b>1 felosztás</b>: a szórás nagy – egy szám egyetlen véletlen felosztásból keveset mond.</li></ul>`;

      function load() {
        const g = data === "karate" ? karateGraph() : { n: window.LESMIS.names.length, edges: window.LESMIS.edges.map(([a, b]) => ({ a, b, w: 1 })) };
        G = g; n = g.n;
      }
      function schedule() { if (!started) return; clearTimeout(deb); deb = setTimeout(run, 250); }
      function run() {
        started = true; clearTimeout(deb);
        if (stop) stop();
        const meths = METH.map(m => m[0]).filter(k => on.has(k));
        const acc = {}; meths.forEach(k => (acc[k] = { auc: [], pk: [] }));
        const full = nonEdges(n, G.edges);
        const steps = ["split"].concat(meths.some(k => HEUR.includes(k)) ? ["heur"] : [], on.has("spec") ? ["spec"] : [],
          on.has("ppmi") || on.has("sgns") ? ["walk"] : [], on.has("sgns") ? ["sgns"] : []);
        const cfg = { data, frac, splits, negMode, leak, seedBase };
        let ctx = null;
        const rec = (k, f) => {
          const sp = ctx.pos.map(([a, b]) => f(a, b)), sn = ctx.neg.map(([a, b]) => f(a, b));
          acc[k].auc.push(aucPairs(sp, sn));
          acc[k].pk.push(precisionAtK(sp.map(s => ({ s, y: true })).concat(sn.map(s => ({ s, y: false }))), ctx.pos.length).prec);
        };
        const total = splits * steps.length;
        prog.style.display = ""; prog.max = String(total); prog.value = "0";
        info.innerHTML = "Számolás…";
        const t0 = performance.now();
        stop = chunked(total, 1, i => {
          const r = Math.floor(i / steps.length), s = steps[i % steps.length];
          if (s === "split") {
            const R = rng(7919 * seedBase + 104729 * r + (data === "karate" ? 1 : 2));
            const { train, test } = holdoutSplit(n, G.edges, frac, R);
            const scoreE = leak ? G.edges : train;
            let neg;
            if (negMode === "all") neg = full;
            else if (negMode === "rand") { const P = randPerm(full.length, R); neg = P.slice(0, test.length).map(k => full[k]); }
            else { const sc = linkScorer(n, train); neg = full.filter(([a, b]) => sc(a, b).CN > 0); }
            ctx = { R, train, test, scoreE, neg, pos: test.map(e => [e.a, e.b]) };
          } else if (s === "heur") {
            const sc = linkScorer(n, ctx.scoreE), cache = new Map(), get = (a, b) => { const k = a * n + b; if (!cache.has(k)) cache.set(k, sc(a, b)); return cache.get(k); };
            HEUR.filter(k => on.has(k)).forEach(k => rec(k, (a, b) => get(a, b)[k]));
          } else if (s === "spec") {
            const Zs = laplacianEmbed(n, ctx.scoreE, 2).Z; rec("spec", (a, b) => -dist(Zs[a], Zs[b]));
          } else if (s === "walk") {
            ctx.walks = randomWalks(n, ctx.scoreE, { num: 10, length: 20, R: ctx.R });
            if (on.has("ppmi")) { const Zp = ppmiEmbed(walkCooc(n, ctx.walks, 5), 8); rec("ppmi", (a, b) => dot(Zp[a], Zp[b])); }
          } else if (s === "sgns") {
            const Zn = sgnsEmbed(n, ctx.walks, { dim: 16, window: 5, R: ctx.R }); rec("sgns", (a, b) => cosine(Zn[a], Zn[b]));
          }
          ctx.k = ctx.pos.length; ctx.nNeg = ctx.neg.length;
          last = { k: ctx.pos.length, nNeg: ctx.neg.length };
        }, i => {
          prog.value = String(i);
          const r = Math.min(splits, Math.floor(i / steps.length) + 1);
          progT.textContent = i < total ? `${r}. / ${splits} felosztás…` : "";
        }, () => {
          stop = null; prog.style.display = "none";
          show(acc, meths, cfg, performance.now() - t0);
        });
      }
      function show(acc, meths, cfg, ms) {
        const res = meths.map(k => { const a = meanSd(acc[k].auc), p = meanSd(acc[k].pk); return { k, name: METH.find(m => m[0] === k)[1], auc: a.mean, sd: a.sd, pk: p.mean }; });
        const best = res.length ? res.reduce((b, x) => (x.auc > b.auc ? x : b)) : null;
        const negTxt = { all: "minden nem él", rand: "véletlen, ugyanannyi", hard: "nehéz (2 távolságú párok a tanítógráfban)" }[cfg.negMode];
        info.innerHTML = `${cfg.data === "karate" ? "Karateklub" : "Les Misérables"}: ${n} csúcs, ${G.edges.length} él · ${cfg.splits} felosztás · ` +
          `tesztél: <b>${last ? last.k : "–"}</b> / felosztás (${pct(cfg.frac)}) · negatív pár: <b>${last ? last.nNeg.toLocaleString("hu-HU") : "–"}</b> (${negTxt})` +
          (cfg.leak ? ` · <b>⚠ szivárgás</b>: a pontozó gráf a teljes gráf` : "") +
          (best ? `<br>A legjobb AUC: <b>★ ${best.name}</b> (${fmt(best.auc, 3)}). Futásidő: ${fmt(ms / 1000, 1)} s.` : "<br>Válassz legalább egy módszert.");
        tw.innerHTML = res.length ? tbl(["módszer", "AUC (átlag ± szórás)", `precision@k`],
          res.map(x => ({ c: [(x === best ? "★ " : "") + x.name, `${fmt(x.auc, 3)} ± ${fmt(x.sd, 3)}`, fmt(x.pk, 3)], st: x === best ? "font-weight:700;color:var(--accent)" : "" }))) : "";
        /* oszlopdiagram */
        const rowH = 26, x0 = 150, Wd = 520, bw = Wd - x0 - 60, Ht = 30 + rowH * res.length;
        const X = v => x0 + bw * v;
        let s = "";
        [0, 0.25, 0.5, 0.75, 1].forEach(t => {
          s += `<line x1="${X(t)}" y1="14" x2="${X(t)}" y2="${Ht - 6}" style="stroke:var(--border);stroke-width:${t === 0.5 ? 0 : 1}"/>` +
            `<text x="${X(t)}" y="10" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">${fmt(t, 2)}</text>`;
        });
        res.forEach((x, k) => {
          const y = 18 + k * rowH, col = EMB.has(x.k) ? "--setC" : "--setA", isB = x === best;
          s += `<text x="${x0 - 6}" y="${y + 13}" text-anchor="end" style="fill:var(--text);font-size:11.5px;${isB ? "font-weight:700" : ""}">${isB ? "★ " : ""}${esc(x.name)}</text>` +
            `<rect x="${x0}" y="${y + 2}" width="${Math.max(0, bw * x.auc)}" height="${rowH - 8}" rx="2" style="fill:${sv(col)};${isB ? "stroke:var(--accent);stroke-width:2.5" : "opacity:.85"}"/>` +
            `<line x1="${X(Math.max(0, x.auc - x.sd))}" y1="${y + rowH / 2 - 1}" x2="${X(Math.min(1, x.auc + x.sd))}" y2="${y + rowH / 2 - 1}" style="stroke:var(--text);stroke-width:1.3"/>` +
            `<text x="${X(Math.min(1, x.auc + x.sd)) + 5}" y="${y + 13}" style="fill:var(--text);font-size:11px">${fmt(x.auc, 2)}</text>`;
        });
        s += `<line x1="${X(0.5)}" y1="14" x2="${X(0.5)}" y2="${Ht - 6}" style="stroke:var(--text);stroke-width:1.5;stroke-dasharray:5 3"/>` +
          `<text x="${X(0.5) + 4}" y="${Ht - 8}" style="fill:var(--muted);font-size:10.5px">véletlen</text>`;
        chart.innerHTML = res.length ? svgEl(Wd, Ht, s, "AUC módszerenként") +
          `<p class="muted" style="font-size:.84rem;margin:.2rem 0 0">${sw("--setA")}szomszédsági heurisztika ${sw("--setC")}beágyazás · a vízszintes vonal: ± szórás a felosztások között · szaggatott: AUC = 0,5 (véletlen)</p>` : "";
        math(info);
        root.dataset.result = JSON.stringify({ cfg, k: last && last.k, nNeg: last && last.nNeg, res: res.map(x => [x.k, +x.auc.toFixed(4), +x.sd.toFixed(4), +x.pk.toFixed(4)]) });
      }
      load();
      info.textContent = "A kísérlet akkor indul, amikor a szemléltetés láthatóvá válik (vagy nyomd meg a „Futtatás” gombot).";
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !started) { io.disconnect(); run(); } });
        io.observe(root);
      } else run();
    };
  }
  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
