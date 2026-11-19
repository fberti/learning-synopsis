/* =========================================================
   Gráfelmélet és hálózattudomány 9. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET),
   a karateklub: ../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js (KARATE13),
   a Les Misérables: ../08-kozossegek/lesmis-data.js (LESMIS), a politikai blogok: ../05-centralitas/polblogs-data.js (POLBLOGS)
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

  const W = {};
  /* ==================================================================
     w1: 9.1, 9.2, 9.6 widgetjei (sir-network, epidemic-threshold, opinion-dynamics)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");                 // KaTeX-be
    const pct = (x, d = 0) => fmt(100 * x, d) + " %";
    /* egész szám ezres tagolással (5 jegytől, nem törő szóközzel) */
    const big = x => { const s = String(Math.round(x)); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s; };
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dot = c => `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const dash = (c, dashed) => `<span style="display:inline-block;width:1.6em;height:0;border-top:2.5px ${dashed ? "dashed" : "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    /* láthatóság: fn(true/false) – a widget a képernyőn van-e (és a lap nem rejtett) */
    function watchVis(root, fn) {
      let inView = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; fn(inView && !document.hidden); })).observe(root);
      document.addEventListener("visibilitychange", () => fn(inView && !document.hidden));
    }
    /* saját vászon (diagramokhoz) */
    function canvasBox(parent, aspect, maxW = 760) {
      const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
      parent.append(c);
      const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, aspect, onResize: null };
      o.resize = () => {
        const w = Math.min(maxW, parent.clientWidth || 340), hh = Math.round(w * o.aspect), dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); c.style.width = w + "px"; c.style.height = hh + "px";
        o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); o.w = w; o.h = hh;
        if (o.onResize) o.onResize();
      };
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(o.resize, 150); });
      onTheme(() => o.onResize && o.onResize());
      o.resize();
      return o;
    }
    /* koordináta-rendszer a vásznon → { X, Y } leképezések */
    function frame(o, { x0 = 0, x1 = 1, y0 = 0, y1 = 1, xt = [], yt = [], xl = "", yl = "", fx = v => fmt(v, 2), fy = v => fmt(v, 2), pad = {} }) {
      const ctx = o.ctx, Wd = o.w, Ht = o.h, P = Object.assign({ l: 58, r: 12, t: 12, b: 36 }, pad);
      ctx.clearRect(0, 0, Wd, Ht);
      const X = v => P.l + (v - x0) / (x1 - x0 || 1) * (Wd - P.l - P.r), Y = v => Ht - P.b - (v - y0) / (y1 - y0 || 1) * (Ht - P.t - P.b);
      const muted = GK.css("--muted"), border = GK.css("--border"), text = GK.css("--text");
      ctx.lineWidth = 1; ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = muted; ctx.setLineDash([]);
      yt.forEach(v => {
        ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(P.l, Y(v)); ctx.lineTo(Wd - P.r, Y(v)); ctx.stroke();
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(fy(v), P.l - 5, Y(v));
      });
      xt.forEach(v => {
        ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(X(v), Ht - P.b); ctx.lineTo(X(v), Ht - P.b + 4); ctx.stroke();
        ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(fx(v), X(v), Ht - P.b + 6);
      });
      ctx.strokeStyle = text; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(P.l, P.t); ctx.lineTo(P.l, Ht - P.b); ctx.lineTo(Wd - P.r, Ht - P.b); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = text; ctx.font = "12px system-ui, sans-serif";
      if (xl) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(xl, P.l + (Wd - P.l - P.r) / 2, Ht - 2); }
      if (yl) { ctx.save(); ctx.translate(11, P.t + (Ht - P.t - P.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(yl, 0, 0); ctx.restore(); }
      return { X, Y, P };
    }
    function poly(ctx, pts, col, w = 2, dsh = null, alpha = 1) {
      if (pts.length < 1) return;
      ctx.strokeStyle = GK.color(col); ctx.lineWidth = w; ctx.globalAlpha = alpha; ctx.setLineDash(dsh || []);
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    /* darabolt futtatás: job(i), i = 0 … total−1, kötegenként per darab; onProg(kész), onDone(); visszatér: leállító függvény */
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
    /* union–find a komponensmérettel */
    function makeUF(n) {
      const p = new Int32Array(n), s = new Int32Array(n).fill(1);
      for (let i = 0; i < n; i++) p[i] = i;
      const f = x => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
      return { f, s, union(a, b) { a = f(a); b = f(b); if (a === b) return; if (s[a] < s[b]) [a, b] = [b, a]; p[b] = a; s[a] += s[b]; } };
    }
    /* G(n, m) elutasításos mintavétellel (ritka gráfra gyors) */
    function sparseGnm(n, m, R) {
      const seen = new Set(), E = [];
      while (E.length < m) {
        const a = Math.floor(R() * n), b = Math.floor(R() * n);
        if (a === b) continue;
        const k = a < b ? a * n + b : b * n + a;
        if (seen.has(k)) continue;
        seen.add(k); E.push({ a, b, w: 1 });
      }
      return E;
    }
    /* k különböző véletlen elem 0 … n−1 közül */
    function pickK(n, k, R) {
      const s = new Set(); k = Math.min(k, n);
      while (s.size < k) s.add(Math.floor(R() * n));
      return [...s];
    }
    /* élperkoláció: minden él T eséllyel marad → { exp: Σ s²/(n·nAct) (várható kitörés egy véletlen nem beoltott kezdőből, n-hez képest), giant: legnagyobb/n } */
    function percolate(n, E, T, R, removed = null, nAct = n) {
      const uf = makeUF(n);
      for (let i = 0; i < E.length; i++) if (R() < T) uf.union(E[i].a, E[i].b);
      let s2 = 0, mx = 0;
      for (let v = 0; v < n; v++) if (uf.f(v) === v && !(removed && removed[v])) { const s = uf.s[v]; s2 += s * s; if (s > mx) mx = s; }
      return { exp: s2 / (n * nAct), giant: mx / n };
    }
    /* immunizálás: a csúcsok f részének kiválasztása (rand / hub / acq) → Uint8Array jelölés */
    function immunize(n, E, f, how, R) {
      const k = Math.round(f * n), out = new Uint8Array(n);
      if (k <= 0) return out;
      if (how === "rand") pickK(n, k, R).forEach(v => (out[v] = 1));
      else if (how === "hub") {
        const d = degStats(n, E).k, ord = [...Array(n).keys()].sort((a, b) => d[b] - d[a] || a - b);
        ord.slice(0, k).forEach(v => (out[v] = 1));
      } else {
        const L = nbrs(n, E); let c = 0, guard = 0;
        while (c < k && guard++ < 100 * n) {
          const v = Math.floor(R() * n); if (!L[v].length) continue;
          const u = L[v][Math.floor(R() * L[v].length)];
          if (!out[u]) { out[u] = 1; c++; }
        }
      }
      return out;
    }
    /* a beoltás utáni gráf statisztikája: a maradék csúcsokon */
    function remStats(n, E, removed) {
      const idx = new Int32Array(n).fill(-1); let m = 0;
      for (let v = 0; v < n; v++) if (!removed[v]) idx[v] = m++;
      const E2 = E.filter(e => !removed[e.a] && !removed[e.b]).map(e => ({ a: idx[e.a], b: idx[e.b] }));
      const d0 = degStats(n, E).k; let sd = 0, c = 0;
      for (let v = 0; v < n; v++) if (removed[v]) { sd += d0[v]; c++; }
      return Object.assign(degStats(m, E2), { nRem: m, E: E.filter(e => !removed[e.a] && !removed[e.b]), immK: c ? sd / c : NaN });
    }
    /* az erőirányított elrendezésben a magányos csúcsok messzire szállnak: behúzzuk őket a többiek peremére */
    function tidyLayout(P, asp) {
      const Q = P.map(p => [p[0], p[1] * asp]), n = Q.length;
      const cx = Q.reduce((s, p) => s + p[0], 0) / n, cy = Q.reduce((s, p) => s + p[1], 0) / n;
      const d = Q.map(p => Math.hypot(p[0] - cx, p[1] - cy)), lim = 1.08 * d.slice().sort((a, b) => a - b)[Math.floor(0.9 * (n - 1))];
      return GK.normalize(Q.map((p, i) => (d[i] > lim ? [cx + (p[0] - cx) * lim / d[i], cy + (p[1] - cy) * lim / d[i]] : p)), asp);
    }
    /* a teszteléshez (node) – nincs mellékhatása */
    const _A = { sparseGnm, percolate, immunize, remStats, makeUF };
    void _A;

    /* ------------------------------------------------------------------
       9.1  sir-network – SI / SIS / SIR egy választható hálózaton
       ------------------------------------------------------------------ */
    W["sir-network"] = root => {
      header(root, "Járvány a hálózaton: SI, SIS, SIR",
        "Diszkrét időben: minden lépésben minden fertőző minden fogékony szomszédját $\\beta$ eséllyel megfertőzi, aztán $\\gamma$ eséllyel meggyógyul " +
        "(SIS: újra fogékony lesz, SIR: védett lesz; SI: sosem gyógyul). <b>Kattints egy csúcsra</b>: onnan indul a járvány. " +
        "A szaggatott görbe a <b>keverő populáció</b>: ugyanannyi ember, ugyanannyi kontaktus, de mindenki bárkivel találkozhat.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const NETS = [["ring", "rács"], ["ws", "kisvilág"], ["er", "véletlen (ER)"], ["ba", "skálafüggetlen (BA)"], ["arviz", "Árvízhét"], ["karate", "karateklub"]];
      let key = "er", n = 200, gseed = 1, model = "SIR", beta = 0.15, gamma = 0.2, seeds = [], run = 1, showMF = true;
      let N = 0, E = [], L = [], st0 = null, frames = [], t = 0, playing = false, vis = true, timer = 0, stopHist = null, histRes = null, pickR = rng(1);

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" }),
        c4 = h("div", { class: "controls" }), c5 = h("div", { class: "controls" });
      toggleGroup(c1, NETS, key, v => { key = v; buildGraph(); });
      const nOut = h("b", { style: "font-family:var(--mono);min-width:2.2em" }, String(n));
      const nSl = h("input", { type: "range", min: 50, max: 400, step: 10, value: n, "aria-label": "csúcsok száma", style: "width:9rem;max-width:40vw",
        oninput: () => { n = +nSl.value; nOut.textContent = n; }, onchange: () => buildGraph() });
      const nLab = h("label", null, "n =", nSl, nOut);
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      c2.append(nLab, h("label", null, "minta:", seedOut), btn("Új gráf", () => { gseed++; seedOut.textContent = gseed; buildGraph(); }));
      toggleGroup(c3, [["SI", "SI"], ["SIS", "SIS"], ["SIR", "SIR"]], model, v => { model = v; gSl.disabled = v === "SI"; newRun(); });
      const bOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(beta, 2)), gOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(gamma, 2));
      const bSl = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: beta, "aria-label": "β", style: "width:8rem;max-width:36vw",
        oninput: () => { beta = +bSl.value; bOut.textContent = fmt(beta, 2); newRun(); } });
      const gSl = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: gamma, "aria-label": "γ", style: "width:8rem;max-width:36vw",
        oninput: () => { gamma = +gSl.value; gOut.textContent = fmt(gamma, 2); newRun(); } });
      c3.append(h("label", null, "β =", bSl, bOut), h("label", null, "γ =", gSl, gOut));
      c4.append(btn("1 fertőzött", () => { seeds = pickK(N, 1, pickR); newRun(); }), btn("5 véletlen fertőzött", () => { seeds = pickK(N, 5, pickR); newRun(); }),
        h("span", { class: "muted", style: "font-size:.88rem" }, "vagy kattints egy csúcsra"));
      const playB = btn("▶ Lejátszás", () => (playing ? pause() : play()), "btn primary");
      const cbMF = h("input", { type: "checkbox", checked: "", onchange: () => { showMF = cbMF.checked; drawChart(); } });
      c5.append(playB, btn("Lépés", () => { pause(); stepOnce(); }), btn("Újra", () => { pause(); run++; newRun(); }), h("label", null, cbMF, "keverő populáció"));
      root.append(c1, c2, c3, c4, c5);

      const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
      cols.append(left, right); root.append(cols);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html:
        `${dot(SIR_COLORS.S)}fogékony ${dot(SIR_COLORS.I)}fertőző ${dot(SIR_COLORS.R)}gyógyult · kiemelt él: ki kit fertőzött meg` });
      const chartBox = h("div");
      const legend2 = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html:
        `${dash(SIR_COLORS.S)}S ${dash(SIR_COLORS.I)}I ${dash(SIR_COLORS.R)}R (a hálózaton) · ${dash("--text", true)} keverő populáció` });
      const ro = h("div", { class: "readout" }), ro2 = h("div", { class: "readout", style: "font-family:inherit" });
      right.append(chartBox, legend2, ro, ro2);

      const view = new GK.View(left, { aspect: narrow ? 0.9 : 0.95, radius: 4, draggable: false });
      left.append(legend);
      const chart = canvasBox(chartBox, narrow ? 0.7 : 0.75, 520);
      chart.onResize = () => drawChart();

      /* kattintás: a legközelebbi csúcs (kis csúcsoknál is könnyen eltalálható) */
      view.c.addEventListener("pointerup", ev => {
        const r = view.c.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
        let best = -1, bd = Math.max(view.o.radius + 5, 14);
        view.nodes.forEach((nd, i) => { const [nx, ny] = view.px(nd), d = Math.hypot(nx - x, ny - y); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { pause(); seeds = [best]; newRun(); }
      });

      /* hist (100 futás) */
      const hc = h("div", { class: "controls" });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      hc.append(btn("100 futás átlaga", () => runHist()), prog);
      const histBox = h("div", { style: "display:none" });
      const hro = h("div", { class: "readout" });
      root.append(hc, histBox);
      const hchart = canvasBox(histBox, narrow ? 0.62 : 0.38, 760);
      hchart.onResize = () => drawHist();
      histBox.append(hro);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Ugyanaz a β és γ más hálózaton más járványt ad: a keverő populáció a legrosszabb eset, a rács a legszelídebb."));

      function buildGraph() {
        pause();
        const big_ = !["arviz", "karate"].includes(key);
        nSl.disabled = !big_; nLab.style.opacity = big_ ? 1 : 0.5;
        const asp = view.o.aspect, R = rng(gseed * 101 + 7);
        pickR = rng(gseed * 977 + 13);
        let nodes;
        if (key === "arviz") {
          const g = preset("arviz", asp); N = g.nodes.length; E = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
          nodes = g.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })); view.o.radius = 15;
          seeds = [g.nodes.findIndex(nd => nd.label === "Kl")];
        } else if (key === "karate") {
          const g = preset("karate", asp); N = g.nodes.length; E = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
          nodes = g.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })); view.o.radius = narrow ? 8 : 10;
          seeds = [0];
        } else {
          N = n;
          if (key === "ring") E = ringLattice(n, 4);
          else if (key === "ws") E = wattsStrogatz(n, 4, 0.1, R).edges;
          else if (key === "er") E = sparseGnm(n, 2 * n, R);
          else E = barabasiAlbert(n, 2, R);
          const P = key === "ring" || key === "ws" ? GK.normalize(GK.circleLayout(n), asp)
            : tidyLayout(GK.forceLayout(n, E.map(e => [e.a, e.b]), { seed: gseed, iters: n > 250 ? 160 : 260, aspect: asp }), asp);
          nodes = P.map(p => ({ label: "", x: p[0], y: p[1] }));
          view.o.radius = n <= 100 ? 5 : n <= 250 ? 4 : 3;
          seeds = pickK(N, 1, pickR);
        }
        L = nbrs(N, E);
        view.setGraph(nodes, E);
        renderStatic();
        newRun();
      }
      /* egy futás (ugyanaz a lépés, mint a w0 simulateSIR-je) */
      function simulate(R, keep) {
        const st = new Int8Array(N), par = new Int32Array(N).fill(-1), ever = new Uint8Array(N), mark = new Int32Array(N).fill(-1);
        seeds.forEach(s => { st[s] = 1; ever[s] = 1; });
        let nEver = new Set(seeds).size;
        const cnt = () => { let S = 0, I = 0, Rr = 0; for (let i = 0; i < N; i++) st[i] === 0 ? S++ : st[i] === 1 ? I++ : Rr++; return { S, I, R: Rr, ever: nEver }; };
        const out = keep ? [{ c: cnt(), st: st.slice(), par: par.slice() }] : null;
        const maxT = model === "SIS" ? 150 : 400;
        for (let t_ = 1; t_ <= maxT; t_++) {
          const inf = [];
          for (let i = 0; i < N; i++) if (st[i] === 1) inf.push(i);
          if (!inf.length) break;
          if (model === "SI" && !inf.some(i => L[i].some(j => st[j] === 0))) break;
          if (beta === 0 && model === "SI") break;
          const nw = [];
          inf.forEach(i => L[i].forEach(j => { if (st[j] === 0 && mark[j] !== t_ && R() < beta) { mark[j] = t_; par[j] = i; nw.push(j); } }));
          if (model !== "SI") inf.forEach(i => { if (R() < gamma) st[i] = model === "SIS" ? 0 : 2; });
          nw.forEach(j => { st[j] = 1; if (!ever[j]) { ever[j] = 1; nEver++; } });
          if (keep) out.push({ c: cnt(), st: st.slice(), par: par.slice() });
        }
        return keep ? out : nEver;
      }
      function newRun() {
        if (stopHist) { stopHist(); stopHist = null; }
        if (histRes) { histRes = null; histBox.style.display = "none"; prog.textContent = ""; }
        frames = simulate(rng(run * 7919 + gseed * 31 + 3), true);
        mf = mfCurve();
        delete root.dataset.hist;
        t = 0;
        renderStatic();
        show();
      }
      function show() {
        const F = frames[t], hlE = new Set();
        view.nodes.forEach((nd, i) => { nd.color = F.st[i] === 0 ? SIR_COLORS.S : F.st[i] === 1 ? SIR_COLORS.I : SIR_COLORS.R; });
        for (let j = 0; j < N; j++) if (F.par[j] >= 0 && (model === "SIS" ? F.st[j] === 1 : F.st[j] !== 0)) hlE.add(GK.edgeKey(F.par[j], j));
        view.hlE = hlE; view.hl = new Set(seeds); view.dim = false;
        view.edges.forEach(e => {
          const on = hlE.has(GK.edgeKey(e.a, e.b));
          e.color = on ? "--accent" : null; e.width = on ? (N > 50 ? 2 : 3) : (N > 50 ? 0.8 : 1.6); e.alpha = on ? 1 : (N > 50 ? 0.45 : 0.8);
        });
        view.draw();
        const c = F.c, end = t === frames.length - 1;
        ro.innerHTML = `lépés: <b>${t}</b>${end ? " (vége)" : ""} · S = ${c.S} · I = <b>${c.I}</b>` + (model === "SIR" ? ` · R = ${c.R}` : "") +
          `<br>összesen megfertőzött: <b>${c.ever}</b> / ${N} (${pct(c.ever / N)})`;
        root.dataset.counts = frames.slice(0, t + 1).map(f => f.c.I).join(",");
        root.dataset.ever = frames.slice(0, t + 1).map(f => f.c.ever).join(",");
        playB.disabled = end; if (end) pause();
        drawChart();
      }
      function stepOnce() { if (t < frames.length - 1) { t++; show(); } }
      function tick() { if (!playing) return; if (t >= frames.length - 1) { pause(); return; } stepOnce(); }
      function sched() { clearInterval(timer); timer = 0; if (playing && vis) timer = setInterval(tick, N > 50 ? 180 : 600); }
      function play() { if (t >= frames.length - 1) { t = 0; } playing = true; playB.textContent = "❚❚ Szünet"; sched(); }
      function pause() { playing = false; playB.textContent = "▶ Lejátszás"; sched(); }
      watchVis(root, v => { vis = v; sched(); });

      let mf = null;
      function mfCurve() {
        const ds = degStats(N, E);
        return meanField(N, ds.k1, { model, beta, gamma: model === "SI" ? 0 : gamma, i0: new Set(seeds).size, maxT: model === "SIS" ? 150 : 400 });
      }
      const xMax = () => Math.max(10, frames.length - 1, showMF && mf ? mf.length - 1 : 0);
      function drawChart() {
        if (!chart.w || !frames.length) return;
        const xm = xMax(), step = xm <= 20 ? 2 : xm <= 50 ? 10 : xm <= 120 ? 20 : xm <= 250 ? 50 : 100;
        const xt = []; for (let v = 0; v <= xm; v += step) xt.push(v);
        const fr = frame(chart, { x1: xm, xt, yt: [0, 0.25, 0.5, 0.75, 1], xl: "lépés", yl: "a csúcsok aránya", fy: v => pct(v) });
        const ctx = chart.ctx;
        const keys = model === "SIR" ? ["S", "I", "R"] : ["S", "I"];
        if (showMF) {
          keys.forEach(k => poly(ctx, mf.map((o, i) => [fr.X(i), fr.Y(o[k] / N)]), SIR_COLORS[k], 1.8, [6, 4], 0.85));
          root.dataset.mf = JSON.stringify(mf[mf.length - 1] ? { S: mf[mf.length - 1].S / N, I: mf[mf.length - 1].I / N, R: mf[mf.length - 1].R / N, T: mf.length - 1 } : {});
        }
        keys.forEach(k => poly(ctx, frames.slice(0, t + 1).map((f, i) => [fr.X(i), fr.Y(f.c[k] / N)]), SIR_COLORS[k], 2.6));
        ctx.strokeStyle = GK.css("--accent"); ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(fr.X(t), fr.P.t); ctx.lineTo(fr.X(t), chart.h - fr.P.b); ctx.stroke(); ctx.globalAlpha = 1;
      }
      function renderStatic() {
        const ds = degStats(N, E), T = transmissibility(beta, model === "SI" ? 0 : gamma);
        ro2.innerHTML = `Átvitel: $T = \\dfrac{\\beta}{\\beta + \\gamma - \\beta\\gamma} = ${fmM(T, 3)}$` + (model === "SI" ? " (SI: $\\gamma = 0$, így $T = 1$)" : "") +
          `<br>$\\langle k\\rangle = ${fmM(ds.k1, 2)}$, $\\kappa = \\dfrac{\\langle k^2\\rangle}{\\langle k\\rangle} - 1 = ${fmM(ds.kappa, 2)}$` +
          `<br>A hálózaton $R_0 = T\\kappa = ${fmM(T * ds.kappa, 2)}$; a keverő populációban $R_0 = T\\langle k\\rangle = ${fmM(T * ds.k1, 2)}$.`;
        root.dataset.stat = JSON.stringify({ T, k1: ds.k1, kappa: ds.kappa });
        math(ro2);
      }

      function runHist() {
        if (stopHist) stopHist();
        pause();
        const RUNS = 100, res = [];
        histRes = res; histBox.style.display = ""; hchart.resize();
        stopHist = chunked(RUNS, N > 250 ? 4 : 10, i => res.push(simulate(rng(50000 + i * 17 + gseed * 7 + run * 1013), false) / N),
          k => { prog.innerHTML = `<progress max="${RUNS}" value="${k}" style="vertical-align:middle;width:7rem"></progress> ${k} / ${RUNS} futás`; drawHist(); },
          () => { stopHist = null; prog.textContent = `kész: ${RUNS} futás (${model}, β = ${fmt(beta, 2)}` + (model === "SI" ? "" : `, γ = ${fmt(gamma, 2)}`) + ")"; });
      }
      function drawHist() {
        const res = histRes;
        if (!res || !hchart.w) return;
        const bins = new Array(20).fill(0);
        res.forEach(x => bins[Math.min(19, Math.floor(x * 20))]++);
        const y0 = Math.max(5, ...bins), st = y0 <= 10 ? 2 : y0 <= 30 ? 5 : y0 <= 60 ? 10 : 20, ymax = Math.ceil(y0 / st) * st, yt = [];
        for (let v = 0; v <= ymax; v += st) yt.push(v);
        const fr = frame(hchart, { x1: 1, y1: ymax, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt, xl: "a valaha megfertőzöttek aránya", yl: "futások", fx: v => pct(v), fy: v => String(v) });
        const ctx = hchart.ctx;
        ctx.fillStyle = GK.css("--setB");
        bins.forEach((b, i) => { if (b) ctx.fillRect(fr.X(i / 20) + 1, fr.Y(b), fr.X(1 / 20) - fr.X(0) - 2, fr.Y(0) - fr.Y(b)); });
        const mean = res.reduce((s, x) => s + x, 0) / (res.length || 1), low = res.filter(x => x < 0.1).length / (res.length || 1);
        poly(ctx, [[fr.X(mean), fr.P.t], [fr.X(mean), hchart.h - fr.P.b]], "--accent", 2, [5, 4]);
        ctx.fillStyle = GK.css("--accent"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = mean > 0.7 ? "right" : "left"; ctx.textBaseline = "top";
        ctx.fillText("átlag", fr.X(mean) + (mean > 0.7 ? -4 : 4), fr.P.t + 2);
        const big_ = res.filter(x => x >= 0.1), bm = big_.length ? big_.reduce((s, x) => s + x, 0) / big_.length : NaN;
        hro.innerHTML = `${res.length} futás · átlag: <b>${pct(mean, 1)}</b> · a futások <b>${pct(low)}</b>-a halt el 10 % alatt` +
          (big_.length ? ` · a nagy járványok átlaga: ${pct(bm, 1)}` : "");
        root.dataset.hist = JSON.stringify({ runs: res.length, mean, low, bigMean: bm });
      }
      buildGraph();
    };

    /* ------------------------------------------------------------------
       9.2  epidemic-threshold – a járványküszöb: ER vs. BA, immunizálás
       ------------------------------------------------------------------ */
    W["epidemic-threshold"] = root => {
      header(root, "Járványküszöb: véletlen és skálafüggetlen hálózat",
        "Mindkét hálózatban átlagosan 4 kapcsolata van mindenkinek, de a BA-hálózatban vannak <b>hubok</b>. A kitörés akkor nagy, ha $R_0 = T\\kappa > 1$, " +
        "azaz $T > T_c = 1/\\kappa$, ahol $\\kappa = \\langle k^2\\rangle/\\langle k\\rangle - 1$. A görbe <b>élperkolációval</b> készül " +
        "(ez a SIR $\\gamma = 1$, $\\beta = T$ esete): minden él $T$ eséllyel „ad át”, és a kezdőcsúcs komponense fertőződik meg.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const Ts = []; for (let i = 0; i <= 30; i++) Ts.push(i / 50);
      const NC = { er: "--setA", ba: "--setB", ring: "--setC" }, NN = { er: "ER", ba: "BA", ring: "rács" };
      let n = 1000, gseed = 1, showRing = false, metric = "exp", f = 0.1, G = {}, stats = {}, curves = {}, stopC = null, stopI = null, imm = null, icurves = {}, vis = false, started = false;

      const c1 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "csúcsok száma:"));
      toggleGroup(c1, [[300, "300"], [1000, "1000"], [3000, "3000"]], n, v => { n = v; build(); });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      const cbRing = h("input", { type: "checkbox", onchange: () => { showRing = cbRing.checked; renderTable(); startCurves(); } });
      c1.append(h("label", null, "minta:", seedOut), btn("Új minta", () => { gseed++; seedOut.textContent = gseed; build(); }), h("label", null, cbRing, "rács is"));
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "függőleges tengely:"));
      toggleGroup(c2, [["exp", "várható kitörés"], ["giant", "óriáskomponens"]], metric, v => { metric = v; drawCurves(); drawImm(); });
      root.append(c1, c2);
      const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
      cols.append(left, right); root.append(cols);
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" }), sizeBox = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.6rem" });
      left.append(tbl, sizeBox);
      const chartBox = h("div"), prog = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      right.append(chartBox, prog);
      const chart = canvasBox(chartBox, narrow ? 0.8 : 0.85, 520);
      chart.onResize = () => drawCurves();

      /* immunizálás */
      root.append(h("div", { class: "w-title", style: "margin-top:1rem" }, "Immunizálás a BA-hálózaton"));
      root.append(h("p", { class: "w-sub", html: "A csúcsok $f$ részét beoltjuk (kivesszük a hálózatból). <b>Véletlen</b>: bárkit; <b>hubok</b>: a legnagyobb fokszámúakat " +
        "(ehhez ismerni kell a hálózatot); <b>ismerős-immunizálás</b>: egy véletlen ember egy véletlen ismerősét – a barátság-paradoxon miatt ő átlagosan " +
        "népszerűbb, és nem kell hozzá a teljes hálózat (Cohen, Havlin és ben-Avraham, 2003)." }));
      math(root.querySelectorAll(".w-sub")[1]);
      const c3 = h("div", { class: "controls" });
      const fOut = h("b", { style: "font-family:var(--mono);min-width:3em" }, "10 %");
      const fSl = h("input", { type: "range", min: 0, max: 0.3, step: 0.01, value: f, "aria-label": "beoltottak aránya", style: "width:11rem;max-width:50vw",
        oninput: () => { f = +fSl.value; fOut.textContent = pct(f); }, onchange: () => startImm() });
      c3.append(h("label", null, "f =", fSl, fOut));
      root.append(c3);
      const cols2 = h("div", { class: "two-col" }), l2 = h("div"), r2 = h("div");
      cols2.append(l2, r2); root.append(cols2);
      const itbl = h("div", { class: "tw", style: "overflow-x:auto" });
      l2.append(itbl);
      const ichartBox = h("div"), iprog = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      r2.append(ichartBox, iprog);
      const ichart = canvasBox(ichartBox, narrow ? 0.8 : 0.85, 520);
      ichart.onResize = () => drawImm();
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A hubok miatt a skálafüggetlen hálózatban szinte nincs küszöb – de ha a hubokat oltod be, hirtelen lesz."));

      const nets = () => (showRing ? ["er", "ba", "ring"] : ["er", "ba"]);
      function build() {
        const R = rng(gseed * 13 + 5);
        G.er = sparseGnm(n, 2 * n, R); G.ba = barabasiAlbert(n, 2, R); G.ring = ringLattice(n, 4);
        ["er", "ba", "ring"].forEach(k => (stats[k] = degStats(n, G[k])));
        root.dataset.stats = JSON.stringify(Object.fromEntries(["er", "ba", "ring"].map(k => [k, { k1: stats[k].k1, k2: stats[k].k2, kappa: stats[k].kappa, Tc: stats[k].Tc, kmax: stats[k].kmax }])));
        renderTable();
        curves = {}; icurves = {}; imm = null;
        if (started) { startCurves(); startImm(); }
        else { drawCurves(); drawImm(); }
      }
      function renderTable() {
        const ks = nets();
        tbl.innerHTML = `<table><tr><th></th>${ks.map(k => `<th>${dot(NC[k])}${NN[k]}</th>`).join("")}</tr>` +
          `<tr><td>$\\langle k\\rangle$</td>${ks.map(k => `<td>${fmt(stats[k].k1, 2)}</td>`).join("")}</tr>` +
          `<tr><td>$\\langle k^2\\rangle$</td>${ks.map(k => `<td>${fmt(stats[k].k2, 1)}</td>`).join("")}</tr>` +
          `<tr><td>$\\kappa = \\langle k^2\\rangle/\\langle k\\rangle - 1$</td>${ks.map(k => `<td>${fmt(stats[k].kappa, 2)}</td>`).join("")}</tr>` +
          `<tr><td>$T_c = 1/\\kappa$</td>${ks.map(k => `<td><b>${fmt(stats[k].Tc, 3)}</b></td>`).join("")}</tr>` +
          `<tr><td>legnagyobb fokszám</td>${ks.map(k => `<td>${stats[k].kmax}</td>`).join("")}</tr></table>` +
          (showRing ? `<p class="muted" style="font-size:.86rem;margin:.3rem 0 0">A rácsban a $T_c = 1/\\kappa$ képlet nem érvényes: tele van rövid körökkel, és egy dimenzióban az óriáskomponenshez $T \\to 1$ kellene.</p>` : "");
        math(tbl);
      }
      /* méretfüggés: T_c ER-ben és BA-ban különböző n-re (egy-egy minta) */
      function sizeTable() {
        const NS = [300, 1000, 3000, 10000, 100000], rows = [];
        sizeBox.innerHTML = "";
        chunked(NS.length, 1, i => {
          const R = rng(4242 + i), m = NS[i];
          rows.push([m, degStats(m, sparseGnm(m, 2 * m, R)).Tc, degStats(m, barabasiAlbert(m, 2, R)).Tc]);
        }, () => {
          sizeBox.innerHTML = `<table><tr><th>$n$</th><th>${dot(NC.er)}$T_c$ (ER)</th><th>${dot(NC.ba)}$T_c$ (BA)</th></tr>` +
            rows.map(r => `<tr><td>${big(r[0])}</td><td>${fmt(r[1], 3)}</td><td>${fmt(r[2], 3)}</td></tr>`).join("") + `</table>` +
            `<p style="font-size:.9rem;margin:.3rem 0 0"><b>A BA-hálózat küszöbe a mérettel csökken, az ER-é nem.</b> ` +
            `<span class="muted">(Skálafüggetlen hálózatban $\\langle k^2\\rangle$ a legnagyobb hubbal együtt nő, így $T_c \\to 0$.)</span></p>`;
          root.dataset.sizes = JSON.stringify(rows);
          math(sizeBox);
        });
      }
      const SAMPLES = () => (n <= 1000 ? 12 : 6);
      function startCurves() {
        if (stopC) stopC();
        const ks = nets(), S = SAMPLES(), jobs = [];
        ks.forEach(k => { if (!curves[k]) curves[k] = Ts.map(() => ({ exp: 0, giant: 0, c: 0 })); });
        for (let s = 0; s < S; s++) ks.forEach(k => Ts.forEach((_, j) => { if (curves[k][j].c <= s) jobs.push([k, j, s]); }));
        if (!jobs.length) { drawCurves(); return; }
        stopC = chunked(jobs.length, Math.max(4, Math.round(60000 / n)), i => {
          const [k, j, s] = jobs[i], r = percolate(n, G[k], Ts[j], rng(s * 7919 + j * 31 + gseed * 3 + 1)), c = curves[k][j];
          c.exp += r.exp; c.giant += r.giant; c.c++;
        }, done => { prog.textContent = `számolás: ${done} / ${jobs.length} perkoláció…`; drawCurves(); },
        () => { stopC = null; prog.innerHTML = `Pontonként ${S} perkolált minta átlaga. Szaggatott függőleges: $T_c = 1/\\kappa$.`; math(prog); drawCurves();
          root.dataset.curves = JSON.stringify(Object.fromEntries(Object.entries(curves).map(([k, a]) => [k, a.map(c => +(c[metric] / (c.c || 1)).toFixed(4))]))); });
      }
      function drawCurveSet(o, sets, lines) {
        if (!o.w) return;
        const fr = frame(o, { x1: 0.6, xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], yt: [0, 0.25, 0.5, 0.75, 1], xl: "T (átvitel)",
          yl: metric === "exp" ? "várható kitörés (arány)" : "óriáskomponens (arány)", fx: v => fmt(v, 1), fy: v => pct(v) });
        const ctx = o.ctx;
        lines.forEach(([Tc, col]) => { if (isFinite(Tc) && Tc <= 0.6) poly(ctx, [[fr.X(Tc), fr.P.t], [fr.X(Tc), o.h - fr.P.b]], col, 1.6, [5, 4], 0.9); });
        sets.forEach(([arr, col, dsh]) => {
          if (!arr) return;
          const pts = []; arr.forEach((c, j) => { if (c.c) pts.push([fr.X(Ts[j]), fr.Y(c[metric] / c.c)]); });
          poly(ctx, pts, col, 2.4, dsh);
          ctx.fillStyle = GK.color(col); pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 2 * Math.PI); ctx.fill(); });
        });
      }
      function drawCurves() {
        const ks = nets();
        drawCurveSet(chart, ks.map(k => [curves[k], NC[k]]), ks.filter(k => k !== "ring").map(k => [stats[k] && stats[k].Tc, NC[k]]));
      }
      const STRAT = [["rand", "véletlen", "--setA"], ["hub", "hubok", "--setB"], ["acq", "ismerős", "--setC"]];
      function startImm() {
        if (stopI) stopI();
        const R = rng(gseed * 31 + Math.round(f * 1000) * 7 + 11);
        imm = {};
        STRAT.forEach(([k]) => { const rem = immunize(n, G.ba, f, k, R); imm[k] = { rem, st: remStats(n, G.ba, rem) }; });
        imm.none = { rem: new Uint8Array(n), st: Object.assign(stats.ba, { nRem: n, E: G.ba, immK: NaN }) };
        renderImm();
        icurves = {};
        const keys = ["none", "rand", "hub", "acq"], S = SAMPLES(), jobs = [];
        keys.forEach(k => (icurves[k] = Ts.map(() => ({ exp: 0, giant: 0, c: 0 }))));
        for (let s = 0; s < S; s++) keys.forEach(k => Ts.forEach((_, j) => jobs.push([k, j, s])));
        stopI = chunked(jobs.length, Math.max(4, Math.round(60000 / n)), i => {
          const [k, j, s] = jobs[i], I = imm[k], r = percolate(n, I.st.E, Ts[j], rng(s * 104729 + j * 37 + gseed * 5 + 2), I.rem, I.st.nRem), c = icurves[k][j];
          c.exp += r.exp; c.giant += r.giant; c.c++;
        }, done => { iprog.textContent = `számolás: ${done} / ${jobs.length} perkoláció…`; drawImm(); },
        () => { stopI = null; iprog.innerHTML = `${dot("--muted")}beoltás nélkül (szaggatott) · ${STRAT.map(([, l, c]) => dot(c) + l).join(" · ")}. A kitörés mérete az összes csúcshoz viszonyítva.`; drawImm(); });
      }
      function renderImm() {
        const rows = STRAT.map(([k, l, c]) => [k, l, c, imm[k].st]);
        itbl.innerHTML = `<table><tr><th>stratégia</th><th>beoltottak átl. fokszáma</th><th>$\\kappa$ utána</th><th>$T_c$ utána</th></tr>` +
          `<tr><td style="white-space:nowrap">${dot("--muted")}nincs</td><td>–</td><td>${fmt(stats.ba.kappa, 2)}</td><td>${fmt(stats.ba.Tc, 3)}</td></tr>` +
          rows.map(([, l, c, s]) => `<tr><td style="white-space:nowrap">${dot(c)}${l}</td><td>${fmt(s.immK, 1)}</td><td>${fmt(s.kappa, 2)}</td><td><b>${s.kappa <= 1 ? "> 1" : fmt(s.Tc, 3)}</b></td></tr>`).join("") +
          `</table><p class="muted" style="font-size:.86rem;margin:.3rem 0 0">BA-hálózat, $n = ${big(n)}$, beoltva ${Math.round(f * n)} csúcs (${pct(f)}).` +
          (rows.some(r => r[3].kappa <= 1) ? " Ha $\\kappa \\le 1$, akkor $T_c > 1$: semmilyen átvitelnél nincs nagy járvány." : "") + `</p>`;
        root.dataset.imm = JSON.stringify(Object.fromEntries(STRAT.map(([k]) => [k, { immK: imm[k].st.immK, kappa: imm[k].st.kappa, Tc: imm[k].st.Tc }])));
        math(itbl);
      }
      function drawImm() {
        if (!imm) { if (ichart.w) frame(ichart, { x1: 0.6, xt: [0, 0.2, 0.4, 0.6], yt: [0, 0.5, 1], fx: v => fmt(v, 1), fy: v => pct(v) }); return; }
        drawCurveSet(ichart, [[icurves.none, "--muted", [6, 4]], ...STRAT.map(([k, , c]) => [icurves[k], c])],
          [[stats.ba.Tc, "--muted"], ...STRAT.map(([k, , c]) => [imm[k].st.Tc, c])]);
      }
      function startAll() { if (started) return; started = true; startCurves(); startImm(); sizeTable(); }
      build();
      watchVis(root, v => { vis = v; if (v) startAll(); });
      if (!("IntersectionObserver" in window)) startAll();
    };

    /* ------------------------------------------------------------------
       9.6  opinion-dynamics – DeGroot, korlátos bizalom, visszhangkamra
       ------------------------------------------------------------------ */
    W["opinion-dynamics"] = root => {
      header(root, "Véleménydinamika: konszenzus, csoportok, visszhangkamrák",
        "Három modell, egyre szigorúbb „kire hallgatok?” szabállyal. <b>DeGroot</b>: mindenki a saját és a szomszédai véleményének átlagát veszi át. " +
        "<b>Korlátos bizalom</b>: csak azokra hallgatsz, akiknek a véleménye legfeljebb $\\varepsilon$-nal tér el a tiédtől. " +
        "<b>Visszhangkamra</b>: ráadásul a nagyon eltérő ismerőseidtől el is fordulsz, és hasonló véleményűt keresel helyettük.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let mode = "dg", vis = true;
      const tabs = h("div", { class: "controls" });
      root.append(tabs);
      const P = { dg: h("div"), bc: h("div", { style: "display:none" }), ec: h("div", { style: "display:none" }) };
      root.append(P.dg, P.bc, P.ec);
      const onMode = [];
      toggleGroup(tabs, [["dg", "DeGroot"], ["bc", "Korlátos bizalom"], ["ec", "Visszhangkamra"]], mode, v => {
        mode = v; Object.entries(P).forEach(([k, el]) => (el.style.display = k === v ? "" : "none"));
        onMode.forEach(fn => fn());
      });
      root.append(h("p", { style: "margin:.6rem 0 0;font-weight:600" },
        "Ha mindenkire hallgatsz, konszenzus lesz; ha csak a hozzád hasonlókra, csoportok; ha a kapcsolataidat is átválogatod, külön hálózatok."));
      const opCol = x => mixColor("--setA", "--setB", Math.max(0, Math.min(1, x)));
      const sd = xs => meanSd(xs).sd;

      /* ---------------- (a) DeGroot ---------------- */
      {
        const box = P.dg;
        const path3 = asp => { const p = GK.normalize([[0, 0], [1, 0], [2, 0]], asp); return { nodes: ["A", "B", "C"].map((l, i) => ({ label: l, x: p[i][0], y: p[i][1] })), edges: [{ a: 0, b: 1, w: 1 }, { a: 1, b: 2, w: 1 }] }; };
        const GR = {
          path: { name: "út (3 csúcs)", asp: 0.32, r: 16, make: path3, x0: n => [7, 0, 0] },
          star: { name: "csillag", asp: 0.75, r: 15, make: a => preset("star", a), x0: n => [10, 0, 0, 0, 0] },
          arviz: { name: "Árvízhét", asp: 0.8, r: 15, make: a => preset("arviz", a), x0: n => [0, 0, 5, 10, 10, 0, 0] },
          karate: { name: "karateklub", asp: 0.95, r: 11, make: a => preset("karate", a), x0: n => [...Array(n).keys()].map(i => (i === 0 ? 0 : i === 33 ? 10 : 5)) }
        };
        let key = "star", G, x0, traj, t = 0, playing = false, timer = 0;
        const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
        toggleGroup(c1, Object.entries(GR).map(([k, g]) => [k, g.name]), key, v => { key = v; build(); });
        const playB = btn("▶ Lejátszás", () => (playing ? pause() : play()), "btn primary");
        c2.append(btn("Lépés", () => { pause(); step(); }), playB, btn("Vissza az elejére", () => { pause(); t = 0; traj = [x0.slice()]; show(); }),
          btn("Mind 0", () => { x0 = x0.map(() => 0); restart(); }), btn("Véletlen", () => { x0 = x0.map(() => [0, 5, 10][Math.floor(Math.random() * 3)]); restart(); }));
        box.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0", html:
          "Kattints egy csúcsra: a kezdővéleménye 0 → 5 → 10 → 0 körben változik. A lépés: $x_i(t+1) = \\dfrac{x_i(t) + \\sum_{j \\sim i} x_j(t)}{k_i + 1}$." }), c1, c2);
        math(box.querySelector("p"));
        const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
        cols.append(left, right); box.append(cols);
        const view = new GK.View(left, { aspect: GR[key].asp, radius: GR[key].r, draggable: false,
          onNodeClick: i => { if (t > 0) { t = 0; } x0[i] = x0[i] >= 10 ? 0 : x0[i] >= 5 ? 10 : 5; restart(); } });
        left.append(h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html: `${dot("--setA")}0 … ${dot("--setB")}10 (a csúcs színe a vélemény)` }));
        box._view = view;                                   // teszteléshez
        const chBox = h("div"), ro = h("div", { class: "readout" });
        right.append(chBox, ro);
        const chart = canvasBox(chBox, narrow ? 0.6 : 0.62, 520);
        chart.onResize = () => drawChart();
        function build() {
          const g = GR[key];
          view.o.aspect = g.asp; view.o.radius = g.r;
          G = g.make(g.asp); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
          x0 = g.x0(G.nodes.length);
          view.resize();
          view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })), G.edges);
          restart();
        }
        function restart() { pause(); t = 0; traj = [x0.slice()]; show(); }
        function step() {
          if (t >= 200) return;
          if (traj.length <= t + 1) traj.push(degroot(G.nodes.length, G.edges, traj[t], 1)[1]);
          t++; show();
        }
        function show() {
          const x = traj[t], n = G.nodes.length, small = n <= 7;
          view.nodes.forEach((nd, i) => {
            nd.color = opCol(x[i] / 10);
            if (small) { nd.label = G.nodes[i].label; nd.sub = fmt(x[i], 2); }
            else { nd.label = fmt(x[i], x[i] >= 9.95 || Math.abs(x[i] - Math.round(x[i])) < 0.05 ? 0 : 1); nd.sub = null; }
          });
          view.draw();
          const k = degStats(n, G.edges).k, tot = k.reduce((s, v) => s + v + 1, 0);
          const pred = x0.reduce((s, v, i) => s + (k[i] + 1) / tot * v, 0), s_ = sd(x);
          ro.innerHTML = `lépés: <b>${t}</b> · szórás: <b>${fmt(s_, 3)}</b>` +
            (small ? `<br>vélemények: ${x.map((v, i) => G.nodes[i].label + " = " + fmt(v, 2)).join(", ")}` : `<br>vélemények: ${fmt(Math.min(...x), 2)} … ${fmt(Math.max(...x), 2)}`) +
            `<br>jósolt konszenzus: $\\sum_i \\pi_i x_i(0) = ${fmM(pred, 3)}$, ahol $\\pi_i = \\dfrac{k_i + 1}{\\sum_j (k_j + 1)}$ <span class="muted">(a fokszám + 1 a súly)</span>`;
          math(ro);
          root.dataset.dg = JSON.stringify({ t, pred, sd: s_, x });
          drawChart();
        }
        function drawChart() {
          if (!chart.w || !traj) return;
          const xm = Math.max(10, t), stp = xm <= 20 ? 2 : xm <= 50 ? 10 : 20, xt = [];
          for (let v = 0; v <= xm; v += stp) xt.push(v);
          const fr = frame(chart, { x1: xm, y1: 10, xt, yt: [0, 2.5, 5, 7.5, 10], xl: "lépés", yl: "vélemény", fx: v => String(v), fy: v => fmt(v, 1) });
          const n = G.nodes.length;
          for (let i = 0; i < n; i++) poly(chart.ctx, traj.slice(0, t + 1).map((x, s) => [fr.X(s), fr.Y(x[i])]), opCol(x0[i] / 10), n > 10 ? 1.2 : 2.2, null, n > 10 ? 0.7 : 1);
          const k = degStats(n, G.edges).k, tot = k.reduce((s, v) => s + v + 1, 0), pred = x0.reduce((s, v, i) => s + (k[i] + 1) / tot * v, 0);
          poly(chart.ctx, [[fr.X(0), fr.Y(pred)], [fr.X(xm), fr.Y(pred)]], "--text", 1.2, [5, 4], 0.7);
        }
        function sched() { clearInterval(timer); timer = 0; if (playing && vis && mode === "dg") timer = setInterval(() => { if (t >= 60) pause(); else step(); }, 450); }
        function play() { playing = true; playB.textContent = "❚❚ Szünet"; sched(); }
        function pause() { playing = false; playB.textContent = "▶ Lejátszás"; sched(); }
        onMode.push(() => { sched(); if (mode === "dg") { view.resize(); chart.resize(); } });
        watchVis(root, v => { vis = v; sched(); });
        build();
      }

      /* ---------------- (b) korlátos bizalom ---------------- */
      {
        const box = P.bc;
        let N = 100, model = "hk", eps = 0.15, mu = 0.5, seed = 2, small = false, res = null;
        box.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0", html:
          "Keverő populáció, a kezdővélemények egyenletesen szórtak $[0; 1]$-en. <b>HK</b> (Hegselmann–Krause): minden lépésben mindenki átveszi a tőle legfeljebb $\\varepsilon$-ra lévők " +
          "(magát is beleértve) átlagát. <b>Deffuant</b>: véletlen párok találkoznak; ha a véleményük $\\varepsilon$-nál közelebb van, mindketten $\\mu = 0{,}5$ arányban közelednek " +
          "(egy időegység = $N$ találkozás)." }));
        math(box.querySelector("p"));
        const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
        c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "modell:"));
        const paintM = toggleGroup(c1, [["hk", "HK"], ["df", "Deffuant"]], model, v => { model = v; small = false; paintS(); go(); });
        c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "ágensek:"));
        const paintN = toggleGroup(c1, [[100, "N = 100"], [200, "N = 200"]], N, v => { N = v; small = false; paintS(); go(); });
        const eOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(eps, 2));
        const eSl = h("input", { type: "range", min: 0.02, max: 0.5, step: 0.01, value: eps, "aria-label": "ε", style: "width:11rem;max-width:50vw",
          oninput: () => { eps = +eSl.value; eOut.textContent = fmt(eps, 2); go(); } });
        const seedOut = h("b", { style: "font-family:var(--mono)" }, "2");
        const smallB = btn("Kis példa: 5 ágens (HK)", () => { small = !small; if (small) { model = "hk"; paintM("hk"); } paintS(); go(); });
        const paintS = () => smallB.classList.toggle("on", small);
        c2.append(h("label", null, "ε =", eSl, eOut), h("label", null, "minta:", seedOut), btn("Új minta", () => { seed++; seedOut.textContent = seed; small = false; paintS(); go(); }), smallB);
        box.append(c1, c2);
        const chBox = h("div"), ro = h("div", { class: "readout" });
        box.append(chBox, ro);
        const chart = canvasBox(chBox, narrow ? 0.75 : 0.45, 760);
        chart.onResize = () => draw();
        let pend = 0;
        function go() { cancelAnimationFrame(pend); pend = requestAnimationFrame(compute); }
        function compute() {
          const R = rng(seed * 7 + 1);
          let x = small ? [0, 0.2, 0.4, 0.8, 1] : Array.from({ length: N }, () => R());
          const traj = [x.slice()];
          if (model === "hk" || small) {
            for (let s = 0; s < 100; s++) {
              const nx = hkStep(x, eps), ch = Math.max(...nx.map((v, i) => Math.abs(v - x[i])));
              x = nx; traj.push(x.slice());
              if (ch < 1e-9) break;
            }
            /* az utolsó (változatlan) lépés nem kell, ha volt mozgás */
            if (traj.length > 1 && Math.max(...traj[traj.length - 1].map((v, i) => Math.abs(v - traj[traj.length - 2][i]))) < 1e-9) traj.pop();
          } else {
            const Rd = rng(seed * 31 + 5), SW = 200;
            for (let s = 0; s < SW; s++) { for (let k = 0; k < x.length; k++) deffuantStep(x, eps, mu, Rd); traj.push(x.slice()); }
          }
          const cl = opinionClusters(x, 0.02), bigC = cl.filter(c => c.size >= 0.05 * x.length);
          res = { traj, cl, bigC, steps: traj.length - 1 };
          root.dataset.bc = JSON.stringify({ model: small ? "hk5" : model, N: x.length, eps, k: cl.length, big: bigC.length, steps: res.steps, final: small ? x : undefined });
          draw();
          const nL = x.length;
          let txt = `${small ? "5 ágens, HK" : (model === "hk" ? "HK" : "Deffuant")} · ε = ${fmt(eps, 2)} · ` +
            (model === "hk" || small ? `megállt <b>${res.steps}</b> lépés után` : `${res.steps} időegység`) +
            `<br>csoportok: <b>${cl.length}</b>` + (small ? "" : ` (ebből legalább 5 %-os: <b>${bigC.length}</b>)`) +
            `: ${cl.slice(0, 12).map(c => fmt(c.center, 2) + " (" + c.size + ")").join(", ")}${cl.length > 12 ? ", …" : ""}`;
          if (small) txt += `<br>` + traj.map((r, s) => `t = ${s}: (${r.map(v => fmt(v, 3)).join("; ")})`).join("<br>");
          else if (model === "df") txt += `<br><span class="muted">Ökölszabály: kb. $\\lfloor 1/(2\\varepsilon) \\rfloor = ${Math.floor(1 / (2 * eps) + 1e-9)}$ nagy csoport.</span>`;
          ro.innerHTML = txt;
          if (model === "df" && !small) math(ro);
          void nL;
        }
        function draw() {
          if (!res || !chart.w) return;
          const xm = Math.max(small ? 4 : 10, res.steps), stp = xm <= 10 ? 1 : xm <= 20 ? 2 : xm <= 50 ? 10 : xm <= 100 ? 20 : 50, xt = [];
          for (let v = 0; v <= xm; v += stp) xt.push(v);
          const fr = frame(chart, { x1: xm, xt, yt: [0, 0.25, 0.5, 0.75, 1], xl: model === "hk" || small ? "lépés" : "idő (N találkozás)", yl: "vélemény",
            fx: v => String(v), fy: v => fmt(v, 2), pad: { r: 46 } });
          const ctx = chart.ctx, n = res.traj[0].length, every = Math.max(1, Math.floor(res.traj.length / 200));
          for (let i = 0; i < n; i++) {
            const pts = [];
            for (let s = 0; s < res.traj.length; s += every) pts.push([fr.X(s), fr.Y(res.traj[s][i])]);
            pts.push([fr.X(res.steps), fr.Y(res.traj[res.steps][i])]);
            poly(ctx, pts, opCol(res.traj[0][i]), small ? 2.4 : 1, null, small ? 1 : 0.45);
          }
          /* a végső csoportok a jobb szélen */
          const text = GK.css("--text"), card = GK.css("--card");
          res.cl.forEach(c => {
            const y = fr.Y(c.center), r = Math.max(3, Math.min(16, 2.2 * Math.sqrt(c.size * (small ? 8 : 100 / n))));
            const x = chart.w - fr.P.r + 4 + r;
            ctx.fillStyle = opCol(c.center); ctx.strokeStyle = text; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(Math.min(x, chart.w - r - 1), y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
            if (c.size >= (small ? 1 : 3) && r >= 7) { ctx.fillStyle = "#fff"; ctx.font = "600 10px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(c.size), Math.min(x, chart.w - r - 1), y + 0.5); }
          });
          void card;
        }
        onMode.push(() => { if (mode === "bc") { chart.resize(); if (!res) go(); } });
      }

      /* ---------------- (c) visszhangkamra ---------------- */
      {
        const box = P.ec, n = 100, M = 300, mu = 0.5;
        let eps = 0.2, q = 0, seed = 1, x, E, adj, R, t = 0, playing = false, timer = 0, hist = [];
        box.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0", html:
          "Véletlen gráf: $n = 100$, $\\langle k\\rangle = 6$. Egy lépésben 300-szor kiválasztunk egy véletlen élt. Ha a két vég véleménye $\\varepsilon$-nál közelebb van, " +
          "közelednek (Deffuant, $\\mu = 0{,}5$). Ha nem, akkor $q$ eséllyel az egyik fél <b>elvágja</b> az élt, és egy hozzá $\\varepsilon$-on belüli véleményű csúcshoz köt át (homofil újrahuzalozás)." }));
        math(box.querySelector("p"));
        const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
        const eOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(eps, 2)), qOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(q, 2));
        const eSl = h("input", { type: "range", min: 0.05, max: 0.5, step: 0.01, value: eps, "aria-label": "ε", style: "width:9rem;max-width:40vw",
          oninput: () => { eps = +eSl.value; eOut.textContent = fmt(eps, 2); } });
        const qSl = h("input", { type: "range", min: 0, max: 1, step: 0.05, value: q, "aria-label": "q", style: "width:9rem;max-width:40vw",
          oninput: () => { q = +qSl.value; qOut.textContent = fmt(q, 2); } });
        c1.append(h("label", null, "ε =", eSl, eOut), h("label", null, "újrahuzalozás q =", qSl, qOut));
        const playB = btn("▶ Lejátszás", () => (playing ? pause() : play()), "btn primary");
        c2.append(btn("Lépés", () => { pause(); sweep(); relayout(true); show(); }), playB,
          btn("+100 lépés", () => { pause(); for (let i = 0; i < 100; i++) sweep(); relayout(); show(); }),
          btn("Újra", () => { pause(); seed++; init(); }));
        box.append(c1, c2);
        const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
        cols.append(left, right); box.append(cols);
        const view = new GK.View(left, { aspect: narrow ? 0.9 : 0.85, radius: 5, draggable: false });
        left.append(h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html: `a csúcs színe a véleménye: ${dot("--setA")}0 … ${dot("--setB")}1` }));
        const chBox = h("div"), ro = h("div", { class: "readout" });
        right.append(chBox, ro);
        const chart = canvasBox(chBox, narrow ? 0.6 : 0.7, 520);
        chart.onResize = () => drawChart();
        const key = (a, b) => (a < b ? a * n + b : b * n + a);
        function init() {
          R = rng(seed * 97 + 3);
          x = Array.from({ length: n }, () => R());
          E = sparseGnm(n, M, R).map(e => [e.a, e.b]);
          adj = new Set(E.map(([a, b]) => key(a, b)));
          t = 0; hist = [];
          const P0 = tidyLayout(GK.forceLayout(n, E, { seed, iters: 300, aspect: view.o.aspect }), view.o.aspect);
          view.setGraph(P0.map(p => ({ label: "", x: p[0], y: p[1] })), E.map(([a, b]) => ({ a, b, w: 1 })));
          record(); show();
        }
        function sweep() {
          for (let s = 0; s < M; s++) {
            const ei = Math.floor(R() * E.length), [i, j] = E[ei], d = x[j] - x[i];
            if (Math.abs(d) < eps) { x[i] += mu * d; x[j] -= mu * d; continue; }
            if (q <= 0 || R() >= q) continue;
            const [u, v] = R() < 0.5 ? [i, j] : [j, i];
            for (let tr = 0; tr < 40; tr++) {
              const w = Math.floor(R() * n);
              if (w === u || w === v || adj.has(key(u, w)) || Math.abs(x[w] - x[u]) >= eps) continue;
              adj.delete(key(u, v)); adj.add(key(u, w)); E[ei] = [u, w]; break;
            }
          }
          t++; record();
        }
        function measure() {
          const dist = E.reduce((s, [a, b]) => s + Math.abs(x[a] - x[b]), 0) / E.length;
          const cs = components(n, E.map(([a, b]) => ({ a, b }))).sizes, cl = opinionClusters(x, 0.05);
          return { t, dist, comps: cs.length, compsBig: cs.filter(s => s >= 5).length, giant: cs[0], cl: cl.length, clBig: cl.filter(c => c.size >= 5).length };
        }
        function record() { hist.push(measure()); }
        function relayout(soft) {
          const init_ = view.nodes.map(nd => [nd.x, nd.y]);
          const P1 = tidyLayout(GK.forceLayout(n, E, { seed, iters: soft ? 40 : 150, aspect: view.o.aspect, init: init_ }), view.o.aspect);
          view.setGraph(view.nodes, E.map(([a, b]) => ({ a, b, w: 1 })));
          view.animateTo(P1, soft ? 250 : 600);
        }
        function show() {
          view.nodes.forEach((nd, i) => (nd.color = opCol(x[i])));
          view.edges.forEach(e => { const far = Math.abs(x[e.a] - x[e.b]) >= eps; e.alpha = far ? 0.35 : 0.8; e.width = 1.2; e.dash = far ? [3, 3] : null; });
          view.draw();
          const m = hist[hist.length - 1];
          ro.innerHTML = `lépés: <b>${t}</b><br>véleménytávolság az élek mentén (átlag): <b>${fmt(m.dist, 3)}</b> <span class="muted">(kezdetben ≈ ${fmt(hist[0].dist, 2)})</span>` +
            `<br>komponensek: <b>${m.comps}</b> (legalább 5 csúcsú: <b>${m.compsBig}</b>, a legnagyobb: ${m.giant} csúcs)` +
            `<br>véleménycsoportok (legalább 5 fős): <b>${m.clBig}</b>`;
          root.dataset.ec = JSON.stringify({ t, eps, q, dist: m.dist, comps: m.comps, compsBig: m.compsBig, giant: m.giant, clBig: m.clBig });
          drawChart();
        }
        function drawChart() {
          if (!chart.w || !hist.length) return;
          const xm = Math.max(20, t), stp = xm <= 20 ? 5 : xm <= 50 ? 10 : xm <= 120 ? 20 : xm <= 300 ? 50 : 100, xt = [];
          for (let v = 0; v <= xm; v += stp) xt.push(v);
          const fr = frame(chart, { x1: xm, y1: 0.4, xt, yt: [0, 0.1, 0.2, 0.3, 0.4], xl: "lépés", yl: "átl. távolság az élek mentén", fx: v => String(v), fy: v => fmt(v, 1), pad: { r: 34 } });
          poly(chart.ctx, hist.map(m => [fr.X(m.t), fr.Y(Math.min(0.4, m.dist))]), "--accent", 2.4);
          /* komponensek száma a jobb tengelyen (0–20) */
          const Y2 = v => fr.Y(0.4 * Math.min(v, 20) / 20);
          poly(chart.ctx, hist.map(m => [fr.X(m.t), Y2(m.compsBig)]), "--setC", 2, [5, 3]);
          const ctx = chart.ctx; ctx.fillStyle = GK.css("--setC"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
          [0, 5, 10, 15, 20].forEach(v => ctx.fillText(String(v), chart.w - fr.P.r + 5, Y2(v)));
        }
        const leg = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html: `${dash("--accent")}véleménytávolság (bal tengely) · ${dash("--setC", true)}legalább 5 csúcsú komponensek száma (jobb tengely)` });
        right.insertBefore(leg, ro);
        let since = 0;
        function sched() {
          clearInterval(timer); timer = 0;
          if (playing && vis && mode === "ec") timer = setInterval(() => {
            sweep(); since++;
            if (since >= 10) { since = 0; relayout(true); }
            show();
            if (t >= 1000) pause();
          }, 120);
        }
        function play() { playing = true; playB.textContent = "❚❚ Szünet"; sched(); }
        function pause() { playing = false; playB.textContent = "▶ Lejátszás"; sched(); }
        onMode.push(() => { sched(); if (mode === "ec") { view.resize(); chart.resize(); } });
        watchVis(root, v => { vis = v; sched(); });
        init();
      }
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
