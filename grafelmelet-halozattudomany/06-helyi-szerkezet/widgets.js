/* =========================================================
   Gráfelmélet és hálózattudomány 6. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET),
   a karateklub: ../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js (KARATE13),
   élsúlyai: karate-weights.js (KARATE_W), a politikai blogok: ../05-centralitas/polblogs-data.js (POLBLOGS)
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
  /* rangsor: indexek csökkenő érték szerint; holtversenyben azonos helyezés („1., 1., 3.”) */
  function ranks(vals, eps = 1e-9) {
    const ord = [...vals.keys()].sort((i, j) => vals[j] - vals[i]), r = new Array(vals.length);
    ord.forEach((i, k) => { r[i] = k > 0 && Math.abs(vals[i] - vals[ord[k - 1]]) < eps ? r[ord[k - 1]] : k + 1; });
    return { order: ord, rank: r };
  }
  /* KaTeX-címke egy szereplőnek / csúcsnak */
  const texLab = l => (l === "Ön" ? "\\text{Ön}" : /^[A-Z][a-z]$/.test(l) ? `\\mathrm{${l}}` : l);

  const W = {};
  /* ==================================================================
     w1.js – triangle-counter (6.1), homophily-slider (6.2), balance-game (6.4)
     ================================================================== */
  {
    const frac = (p, q) => (q ? `\\tfrac{${p}}{${q}}` : "\\text{--}");

    /* ---------------------------------------------------------- 6.1 */
    W["triangle-counter"] = root => {
      header(root, "Háromszögszámláló: ismerik-e egymást a szomszédaid?",
        "Kattints egy csúcsra: kiemelődnek a szomszédai és a köztük futó élek (zöld), és kiszámoljuk a $C_i$-t. Szerkesztés módban rajzolhatsz is: üres helyre kattintva új csúcs, két csúcsra kattintva él, élre kattintva törlés.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.5;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      const box = h("div"), out = h("div", { class: "readout" }), sum = h("div", { class: "readout" });
      root.append(box, out, sum);
      let key = "arviz", mode = "look", sel = -1, badges = true;
      const view = new GK.View(box, { aspect, radius: narrow ? 14 : 16, maxNodes: 14, nodes: [], edges: [],
        onChange: () => { sel = -1; paint(); } });
      root._view = view;
      const look = i => { sel = sel === i ? -1 : i; paint(); };
      function load(k) {
        key = k; sel = -1;
        const G = preset(k, aspect);
        view.setGraph(G.nodes.map(n => ({ label: n.label, x: n.x, y: n.y })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        if (k === "karate" && mode === "edit") setMode("look");
        paint();
      }
      function setMode(m) {
        mode = m; paintMode && paintMode(m);
        view.o.editable = m === "edit" && key !== "karate";
        view.o.onNodeClick = m === "look" ? look : null;
        view.sel = -1; sel = -1; paint();
      }
      toggleGroup(ctr, [["arviz", "Árvízhét"], ["barat", "barátsággráf"], ["bowtie", "csokornyakkendő"], ["twoTri", "két háromszög + híd"], ["star", "csillag"], ["kite", "sárkány"], ["karate", "karateklub"]], key, load);
      const paintMode = toggleGroup(ctr2, [["look", "🔍 csúcs vizsgálata"], ["edit", "✏️ szerkesztés"]], mode, setMode);
      const cb = h("input", { type: "checkbox", checked: "", onchange: () => { badges = cb.checked; paint(); } });
      ctr2.append(h("label", null, cb, " $C_i$ a csúcsok mellett"), btn("Üres lap", () => { key = "empty"; view.setGraph([], []); setMode("edit"); }));

      function paint() {
        const n = view.nodes.length, E = view.edges, S = nbrSets(n, E), C = clusteringC(n, E), T = triangles(n, E).per;
        const lab = i => texLab(String(view.nodes[i].label));
        view.nodes.forEach((v, i) => {
          v.color = mixColor("--card", "--setB", 0.12 + 0.7 * C[i]);
          v.ink = C[i] > 0.6 ? "#fff" : null;
          v.badge = badges && n <= 20 ? fmt(C[i], 2) : null;
        });
        view.hl = new Set(); view.hlE = new Set(); view.dim = false;
        E.forEach(e => { delete e.color; delete e.width; delete e.alpha; });
        if (sel >= 0 && sel < n) {
          const Nb = [...S[sel]].sort((x, y) => x - y);
          view.hl = new Set([sel, ...Nb]); view.dim = true;
          E.forEach(e => {
            if (e.a === sel || e.b === sel) { e.color = "--accent"; e.width = 3; }
            else if (S[sel].has(e.a) && S[sel].has(e.b)) { e.color = "--ok"; e.width = 4.5; }
            else e.alpha = 0.18;
          });
          const pairs = [], closed = [];
          for (let x = 0; x < Nb.length; x++) for (let y = x + 1; y < Nb.length; y++) {
            const p = `${lab(Nb[x])}\\text{--}${lab(Nb[y])}`;
            pairs.push(p); if (S[Nb[x]].has(Nb[y])) closed.push(p);
          }
          const k = Nb.length, P = k * (k - 1) / 2;
          out.innerHTML = `<b>${view.nodes[sel].label}</b> szomszédai: ${Nb.length ? "$" + Nb.map(lab).join(",\\ ") + "$" : "nincs"} ($k = ${k}$). ` +
            (k < 2 ? `Kevesebb mint 2 szomszéd: nincs pár, a szokás szerint $C = 0$.`
              : `Szomszédpárok: $\\binom{${k}}{2} = ${P}$. Összekötve: ${closed.length ? "$" + closed.join(",\\ ") + "$" : "egyik sem"} ($T = ${T[sel]}$).<br>` +
                `$C_{${lab(sel)}} = ${frac(T[sel], P)} = ${fmt(C[sel], 3)}$` + (P - closed.length ? ` · nyitott párok: ${P - closed.length}` : ""));
        } else out.innerHTML = mode === "look" ? "Kattints egy csúcsra!" : "Szerkesztés: rajzolj, aztán válts vissza vizsgálatra.";
        const st = clusteringStats(n, E);
        const sumC = C.reduce((a, b) => a + b, 0);
        sum.innerHTML = `Háromszögek: <b>${st.tri}</b> · összefüggő hármasok: <b>${st.triples}</b> (ebből nyitott ${st.wedges}) · ` +
          `$\\bar C = ${n ? fmt(sumC, 3) + "/" + n + " = " + fmt(st.avg, 3) : "\\text{--}"}$ · ` +
          `$C_\\Delta = 3 \\cdot ${st.tri}/${st.triples || 0} = ${st.triples ? fmt(st.trans, 3) : "\\text{--}"}$` +
          (n && st.triples ? (Math.abs(st.avg - st.trans) < 0.005 ? " – a kettő itt egyenlő." : st.avg > st.trans ? " – az átlag a nagyobb: a kis fokú, zárt környezetű csúcsok húzzák fel." : " – a globális a nagyobb: a nagy fokú csúcsok környéke sűrűbb.") : "");
        view.draw(); math(out); math(sum);
      }
      setMode("look"); load("arviz"); math(ctr2); math(root.querySelector(".w-sub"));
    };

    /* ---------------------------------------------------------- 6.2 */
    W["homophily-slider"] = root => {
      header(root, "Homofília-labor: hány él fut a csoportokon belül – és mennyi futna véletlenül?",
        "Két csoport (kék és narancs). <b>Véletlen gráf</b> módban a csúszkák adják meg, mekkora eséllyel köt össze él két azonos, illetve két különböző csoportú csúcsot. " +
        "<b>Kis gráfok</b> módban egy csúcsra kattintva átteheted a másik csoportba. Az $r$ élőben frissül.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.5;
      const ctr = h("div", { class: "controls" }), ctrA = h("div", { class: "controls" }), ctrB = h("div", { class: "controls" });
      root.append(ctr, ctrA, ctrB);
      const box = h("div"), out = h("div", { class: "readout" }), bars = h("div");
      root.append(box, bars, out);
      let mode = "rand", seed = 7, n1 = 12, n2 = 12, pin = 0.35, pout = 0.08, grp = [], smallKey = "ladder";
      const view = new GK.View(box, { aspect, radius: narrow ? 9 : 11, nodes: [], edges: [], draggable: true,
        onNodeClick: i => { if (mode !== "small") return; grp[i] = 1 - grp[i]; paint(); } });
      root._view = view;
      function slider(label, min, max, step, val, on, f = v => v) {
        const s = h("input", { type: "range", min, max, step, value: val, style: "width:7.5rem" }), v = h("b", { style: "font-family:var(--mono);min-width:3em" }, f(val));
        s.oninput = () => { v.textContent = f(+s.value); on(+s.value); };
        return { lab: h("label", null, label, " ", s, v), s, v };
      }
      const pct = v => fmt(v, 2);
      const sIn = slider("p(belül)", 0, 1, 0.01, pin, v => { pin = v; build(); }, pct);
      const sOut = slider("p(között)", 0, 1, 0.01, pout, v => { pout = v; build(); }, pct);
      const sN1 = slider("kék", 2, 20, 1, n1, v => { n1 = v; build(); }, String);
      const sN2 = slider("narancs", 2, 20, 1, n2, v => { n2 = v; build(); }, String);
      const setS = (o, v) => { o.s.value = v; o.v.textContent = o.s.step === "1" ? String(v) : pct(v); };
      ctrA.append(sN1.lab, sN2.lab, sIn.lab, sOut.lab, btn("🎲 új sorsolás", () => { seed++; build(); }));
      const presets = h("div", { class: "controls" });
      ctrA.after(presets);
      [["semleges: p(belül) = p(között)", [12, 12, 0.2, 0.2]], ["erős homofília", [12, 12, 0.4, 0.03]], ["heterofília", [12, 12, 0.03, 0.35]], ["nagy + kicsi csoport, semleges", [20, 4, 0.2, 0.2]]]
        .forEach(([l, [a, b, c, d]]) => presets.append(btn(l, () => { n1 = a; n2 = b; pin = c; pout = d; setS(sN1, a); setS(sN2, b); setS(sIn, c); setS(sOut, d); build(); })));
      const smallItems = [["ladder", "létra (6.2 példája)"], ["twoTri", "két háromszög + híd"], ["arviz", "Árvízhét"], ["karate", "karateklub"]];
      toggleGroup(ctrB, smallItems, smallKey, k => { smallKey = k; build(); });
      ctrB.append(btn("eredeti beosztás", () => build()));
      toggleGroup(ctr, [["rand", "🎲 véletlen gráf"], ["small", "👆 kis gráfok"]], mode, m => { mode = m; build(); });

      function build() {
        ctrA.style.display = presets.style.display = mode === "rand" ? "" : "none";
        ctrB.style.display = mode === "small" ? "" : "none";
        if (mode === "rand") {
          const R = rng(seed * 7919 + 1), n = n1 + n2, nodes = [], edges = [];
          grp = [];
          const ring = (cnt, cx, g) => { for (let i = 0; i < cnt; i++) { const t = 2 * Math.PI * i / cnt, rr = 0.17 + 0.05 * R(); nodes.push({ label: "", x: cx + rr * Math.cos(t) * (narrow ? 0.9 : 0.55), y: 0.5 + rr * Math.sin(t) * 1.25 }); grp.push(g); } };
          ring(n1, narrow ? 0.27 : 0.3, 0); ring(n2, narrow ? 0.73 : 0.7, 1);
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (R() < (grp[i] === grp[j] ? pin : pout)) edges.push({ a: i, b: j, w: 1 });
          view.o.radius = narrow ? 8 : 10;
          view.setGraph(nodes, edges);
        } else {
          const G = preset(smallKey, aspect);
          const init = { ladder: [0, 0, 0, 1, 1, 1], twoTri: [0, 0, 0, 1, 1, 1] };
          grp = smallKey === "karate" ? G.club.slice() : smallKey === "arviz" ? G.nodes.map(v => (v.label === "La" || v.label === "Ön" ? 1 : 0)) : init[smallKey].slice();
          view.o.radius = smallKey === "karate" ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
          view.setGraph(G.nodes.map(v => ({ label: v.label, x: v.x, y: v.y })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        }
        paint();
      }
      function paint() {
        const n = view.nodes.length, E = view.edges;
        view.nodes.forEach((v, i) => { v.color = grp[i] ? "--setB" : "--setA"; v.ink = "#fff"; });
        E.forEach(e => { e.color = grp[e.a] === grp[e.b] ? null : "--muted"; e.dash = grp[e.a] === grp[e.b] ? null : [4, 4]; e.alpha = grp[e.a] === grp[e.b] ? 0.85 : 0.6; });
        view.draw();
        const A = attrAssort(n, E, grp.map(g => (g ? "narancs" : "kék")));
        const m = E.length, inside = E.filter(e => grp[e.a] === grp[e.b]).length;
        const ap = A.a["kék"] || 0, ak = A.a["narancs"] || 0;
        const word = !m ? "" : !isFinite(A.r) ? "Az $r$ itt nem értelmezhető (minden élvég egy csoportban van)." :
          A.r > 0.3 ? "Erős homofília: jóval több a belső él, mint véletlenül." : A.r > 0.05 ? "Enyhe homofília." :
          A.r > -0.05 ? "Semleges: annyi belső él, amennyi véletlenül is lenne." : "Heterofília: a különbözők kapcsolódnak inkább.";
        out.innerHTML = m ? `Élek: <b>${m}</b>, ebből csoporton belül <b>${inside}</b> → belső arány $\\sum e_{gg} = ${fmt(A.within, 3)}$.<br>` +
          `Élvégek: kék $a = ${fmt(ap, 3)}$, narancs $a = ${fmt(ak, 3)}$ → véletlen szint $\\sum a_g^2 = ${fmt(ap, 3)}^2 + ${fmt(ak, 3)}^2 = ${fmt(A.sumA2, 3)}$.<br>` +
          `$r = \\dfrac{${fmt(A.within, 3)} - ${fmt(A.sumA2, 3)}}{1 - ${fmt(A.sumA2, 3)}}$ = <b>${isFinite(A.r) ? fmt(A.r, 3) : "–"}</b>. ${word}` : "Nincs él.";
        /* két sáv: megfigyelt belső arány és véletlen szint */
        const bar = (label, v, col) => h("div", { style: "display:flex;align-items:center;gap:.5rem;margin:.15rem 0;font-size:.85rem" },
          h("span", { style: "min-width:8.5em" }, label),
          h("div", { style: "flex:1;max-width:320px;height:12px;border:1px solid var(--border);border-radius:6px;overflow:hidden;background:var(--card)" },
            h("div", { style: `width:${(100 * v).toFixed(1)}%;height:100%;background:var(${col})` })),
          h("b", { style: "font-family:var(--mono);min-width:3.5em" }, fmt(v, 2)));
        bars.replaceChildren(bar("belső arány", m ? A.within : 0, "--accent"), bar("véletlen szint", m ? A.sumA2 : 0, "--muted"));
        math(out);
      }
      build(); math(root.querySelector(".w-sub"));
    };

    /* ---------------------------------------------------------- 6.4 */
    W["balance-game"] = root => {
      header(root, "Egyensúlyjáték: feszült háromszögek és két tábor",
        "Zöld él: támogat ($+$), piros szaggatott: bírál ($-$). A <b>kiegyensúlyozatlan</b> háromszögek pirosan, a kiegyensúlyozottak halványzölden árnyalva. " +
        "<b>Előjelváltás</b> módban egy élre kattintva megfordítod az előjelét; <b>tábor</b> módban egy csúcsra kattintva átteszed a másik táborba – próbáld meg úgy beosztani a szereplőket, hogy minden $+$ él táboron belül, minden $-$ él táborok között fusson!");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.48;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      const box = h("div"), out = h("div", { class: "readout" }), task = h("div", { class: "readout" });
      root.append(box, out, task);
      let key = "arvizS", mode = "camp", camp = [];
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, maxNodes: 10, nodes: [], edges: [],
        onChange: v => { v.edges.forEach(e => { if (e.s == null) e.s = 1; }); camp = v.nodes.map((_, i) => camp[i] || 0); paint(); },
        onDraw: (ctx, v) => {
          const n = v.nodes.length;
          ctx.save(); ctx.globalCompositeOperation = "destination-over";
          signedTriangles(n, v.edges).forEach(T => {
            ctx.beginPath();
            T.t.forEach((i, q) => { const [x, y] = v.px(v.nodes[i]); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            ctx.closePath();
            ctx.fillStyle = mixColor("--card", T.prod > 0 ? "--ok" : "--bad", T.prod > 0 ? 0.18 : 0.38);
            ctx.fill();
          });
          ctx.restore();
        } });
      root._view = view;
      function load(k) {
        key = k;
        if (k === "empty") view.setGraph([], []);
        else { const G = preset(k, aspect); view.setGraph(G.nodes.map(v => ({ label: v.label, x: v.x, y: v.y })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1, s: e.s }))); }
        camp = view.nodes.map(() => 0);
        if (k === "empty") setMode("edit"); else paint();
      }
      function setMode(m) {
        mode = m; paintMode(m);
        view.o.editable = m === "edit";
        view.o.onEdgeClick = m === "sign" ? i => { view.edges[i].s = -view.edges[i].s; paint(); } : null;
        view.o.onNodeClick = m === "camp" ? i => { camp[i] = 1 - camp[i]; paint(); } : null;
        view.sel = -1; paint();
      }
      toggleGroup(ctr, [["arvizS", "Árvízhét"], ["sK4bal", "K₄: két tábor"], ["sK4unb", "K₄: egy feszült él"], ["s5", "öt szereplő"], ["s5unb", "kör egy mínusszal"], ["empty", "üres lap"]], key, load);
      const paintMode = toggleGroup(ctr2, [["camp", "👥 tábor"], ["sign", "± előjelváltás"], ["edit", "✏️ élek szerkesztése"]], mode, setMode);
      ctr2.append(btn("💡 egy legjobb beosztás", () => { const F = frustration(view.nodes.length, view.edges); if (F.camp) camp = F.camp.slice(); paint(); }),
        btn("táborok nullázása", () => { camp = view.nodes.map(() => 0); paint(); }));

      function paint() {
        const n = view.nodes.length, E = view.edges;
        E.forEach(e => { if (e.s == null) e.s = 1; });
        const bad = new Set();
        E.forEach((e, i) => { if ((camp[e.a] === camp[e.b]) !== (e.s > 0)) bad.add(i); });
        E.forEach((e, i) => { e.color = e.s > 0 ? "--ok" : "--bad"; e.dash = e.s > 0 ? null : [7, 5]; e.width = bad.has(i) && mode === "camp" ? 5 : 3; e.label = bad.has(i) && mode === "camp" ? "✘" : ""; });
        view.o.showWeights = mode === "camp";
        view.nodes.forEach((v, i) => { v.color = camp[i] ? "--setB" : "--setA"; v.ink = "#fff"; });
        view.draw();
        const tri = signedTriangles(n, E), cnt = { "+++": 0, "+--": 0, "++-": 0, "---": 0 };
        tri.forEach(t => cnt[t.type]++);
        const balT = cnt["+++"] + cnt["+--"], B = balanceCheck(n, E), F = n <= 14 ? frustration(n, E) : null;
        /* gyenge egyensúly: a + élek komponensein belül nincs − él */
        const P = components(n, E.filter(e => e.s > 0)), weak = E.every(e => e.s > 0 || P.comp[e.a] !== P.comp[e.b]);
        const deg = new Array(n).fill(0); E.forEach(e => { deg[e.a]++; deg[e.b]++; });
        const ncamp = new Set(P.comp.filter((_, i) => deg[i] > 0)).size;   // az él nélküli csúcs (pl. Kl) nem számít külön tábornak
        out.innerHTML = `Háromszögek: +++ ${cnt["+++"]} · +−− ${cnt["+--"]} · ++− <b>${cnt["++-"]}</b> · −−− <b>${cnt["---"]}</b>` +
          (tri.length ? ` → kiegyensúlyozott: ${balT}/${tri.length}` : " (nincs háromszög)") + "<br>" +
          (B.balanced ? "✔ A gráf <b>kiegyensúlyozott</b>: minden kör előjelszorzata $+$, két táborra bontható."
            : `✘ A gráf <b>nem kiegyensúlyozott</b>${tri.some(t => t.prod < 0) ? "" : " – pedig egyetlen feszült háromszöge sincs: egy hosszabb körben van páratlan számú mínusz"}. ` +
              (F ? `Frusztrációs index: <b>${F.k}</b> (ennyi előjelet kell legalább megfordítani).` : "")) +
          `<br>Gyenge egyensúly (Davis): ${weak ? `✔ igen – ${ncamp} tábor (a $+$ élek komponensei)` : "✘ nem – van olyan kör, amelyben pontosan egy mínusz van"}.`;
        const nb = bad.size;
        task.innerHTML = mode !== "camp" ? "Válts <b>tábor</b> módba, és oszd két táborra a szereplőket!" :
          !E.length ? "Nincs él." :
          nb === 0 ? "🎉 Tökéletes beosztás: minden $+$ él táboron belül, minden $-$ él a táborok között fut." :
          `A beosztásod ${nb} élt „sért” (✘: $+$ él a táborok között vagy $-$ él táboron belül).` + (F && nb === F.k ? " Ennél jobb nem lehet: ez a frusztrációs index." : F ? ` A legjobb lehetséges: ${F.k}.` : "");
        math(out); math(task);
      }
      setMode("camp"); load("arvizS"); math(root.querySelector(".w-sub"));
    };
  }
  /* ==================================================================
     w2: 6.2, 6.3, 6.5, 6.6 widgetjei (degree-assort, weak-ties, motif-census, arvizhet-week)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmtS = (x, d = 2) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmM = (x, d = 2) => fmtS(x, d).replace(",", "{,}").replace(MINUS, "-");   // KaTeX-be
    /* címkeszín a háttér világossága szerint */
    function inkOf(c) {
      const m = String(c).match(/[\d.]+/g);
      if (!m) return null;
      const [r, g, b] = m.slice(0, 3).map(Number), L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return L > 0.6 ? "#1b1f27" : "#ffffff";
    }
    /* témaváltáskor újrarajzolás (a mixColor színek újraszámolása) */
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const checkbox = (label, onchange, checked = false) => {
      const inp = h("input", { type: "checkbox" });
      inp.checked = checked;
      inp.addEventListener("change", () => onchange(inp.checked));
      return { lab: h("label", null, inp, label), inp };
    };
    /* ha a widget kikerül a képből, vagy a lap rejtett: stop() */
    function autoStop(root, stop) {
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) stop(); })).observe(root);
      document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
    }
    /* a csúcsok alatti név (sub) ne lógjon le a vászonról */
    const liftY = y => 0.07 + (y - 0.08) * 0.9;
    /* keskeny képernyőn sűrűbb táblázatcellák */
    const tight = el => { if (window.innerWidth < 560) el.querySelectorAll("td, th").forEach(c => (c.style.padding = ".3em .45em")); };
    function pearson(x, y) {
      const n = x.length; if (!n) return NaN;
      const mx = x.reduce((s, t) => s + t, 0) / n, my = y.reduce((s, t) => s + t, 0) / n;
      let sxy = 0, sxx = 0, syy = 0;
      for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
      return sxx > 1e-12 && syy > 1e-12 ? sxy / Math.sqrt(sxx * syy) : NaN;
    }
    /* átlagolt rangok (növekvő; holtverseny: a helyek átlaga) → Spearman = a rangok Pearson-korrelációja */
    function avgRanks(v, eps = 1e-9) {
      const o = [...v.keys()].sort((i, j) => v[i] - v[j]), r = new Array(v.length);
      for (let k = 0; k < o.length;) {
        let l = k; while (l + 1 < o.length && Math.abs(v[o[l + 1]] - v[o[k]]) < eps) l++;
        for (let t = k; t <= l; t++) r[o[t]] = (k + l) / 2 + 1;
        k = l + 1;
      }
      return r;
    }
    const spearman = (x, y) => pearson(avgRanks(x), avgRanks(y));
    const mean = a => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
    const sdev = a => { const m = mean(a); return a.length ? Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length) : NaN; };
    /* a legnagyobb komponens mérete (union-find) */
    function giant(n, edges) {
      const p = [...Array(n).keys()], f = x => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
      edges.forEach(e => { const a = f(e.a), b = f(e.b); if (a !== b) p[a] = b; });
      const c = {}; let best = 0;
      for (let i = 0; i < n; i++) { const r = f(i); c[r] = (c[r] || 0) + 1; if (c[r] > best) best = c[r]; }
      return best;
    }
    /* SVG-segéd: szövegből elem */
    const svgEl = (W_, H_, inner, label) =>
      `<svg viewBox="0 0 ${W_} ${H_}" style="width:100%;max-width:${W_}px;display:block;touch-action:manipulation" role="img" aria-label="${label}">${inner}</svg>`;
    const sv = c => `var(${c})`;

    /* ------------------------------------------------------------------
       6.2  degree-assort – a fokszám-asszortativitás szórásdiagramon
       ------------------------------------------------------------------ */
    W["degree-assort"] = root => {
      header(root, "Fokszám-asszortativitás: kihez kapcsolódnak a nagy fokú csúcsok?",
        "Minden él <b>mindkét irányban</b> egy pont a diagramon: $(k_u, k_v)$, a két végpont fokszáma. Az $r$ ezeknek a pontoknak a Pearson-korrelációja. " +
        "Kattints (koppints) egy pontra: kiemelem a gráfon az éleket, amelyek adják. A kis gráfokat szerkesztheted: üres helyre kattintva új csúcs, két csúcsra él be/ki, élre törlés.");
      math(root.querySelector(".w-sub"));
      const wide = root.clientWidth >= 720, narrow = root.clientWidth < 560;
      const aspect = wide ? 0.8 : narrow ? 0.7 : 0.55;
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      let key = "star", selPt = null, PB = null, st = null;
      toggleGroup(ctr, [["star", "csillag"], ["path4", "4 csúcsú út"], ["kite", "sárkány"], ["k4", "K₄"], ["cyc", "kör"], ["arviz", "Árvízhét"],
        ["karate", "karateklub"], ["polblogs", "politikai blogok"]], key, v => { key = v; load(); });
      const grid = h("div", { style: wide ? "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;align-items:start" : "" });
      const box = h("div"), plot = h("div", { style: "margin-top:.3rem" });
      grid.append(box, plot);
      const info = h("div", { class: "readout" });
      root.append(grid, info);
      const view = new GK.View(box, { aspect, editable: true, maxNodes: 12, radius: narrow ? 14 : 16, nodes: [], edges: [],
        onChange: () => { selPt = null; compute(); } });

      function load() {
        selPt = null;
        box.style.display = key === "polblogs" ? "none" : "";
        if (key === "polblogs") { compute(); return; }
        let G;
        if (key === "cyc") {
          const k = 6;
          G = { nodes: Array.from({ length: k }, (_, i) => ({ label: String(i + 1), x: 0.5 + 0.36 * Math.sin(2 * Math.PI * i / k) * (aspect < 0.8 ? aspect / 0.8 : 1), y: 0.5 - 0.4 * Math.cos(2 * Math.PI * i / k) })),
            edges: Array.from({ length: k }, (_, i) => ({ a: i, b: (i + 1) % k, w: 1 })) };
        } else G = preset(key, aspect);
        const nodes = G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub }));
        view.o.editable = key !== "karate";
        view.o.radius = key === "karate" ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
        view.o.maxNodes = Math.max(12, nodes.length);
        view.setGraph(nodes, G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        compute();
      }
      /* a politikai blogok irányítatlanul: a kölcsönös linkpár egy él */
      function polblogs() {
        if (PB) return PB;
        const P = window.POLBLOGS, seen = new Set(), E = [];
        for (let i = 0; i < P.edges.length; i += 2) {
          const a = P.edges[i], b = P.edges[i + 1];
          if (a === b) continue;
          const k = GK.edgeKey(a, b);
          if (!seen.has(k)) { seen.add(k); E.push({ a, b, w: 1 }); }
        }
        return (PB = { n: P.n, edges: E });
      }
      function compute() {
        if (key === "polblogs") { const P = polblogs(); st = degAssort(P.n, P.edges); st.m = P.edges.length; st.n = P.n; }
        else { const E = view.edges.filter(e => e.a !== e.b); st = degAssort(view.nodes.length, E); st.m = E.length; st.n = view.nodes.length; }
        paint();
      }
      function paint() {
        /* gráf: a kiválasztott pont élei kiemelve, a csúcsok mellett a fokszám */
        if (key !== "polblogs") {
          view.nodes.forEach((nd, i) => { nd.badge = key === "karate" ? null : st.deg[i]; });
          view.hlE = new Set(); view.hl = new Set();
          if (selPt) view.edges.forEach(e => {
            const p = st.deg[e.a], q = st.deg[e.b];
            if ((p === selPt[0] && q === selPt[1]) || (p === selPt[1] && q === selPt[0])) { view.hlE.add(GK.edgeKey(e.a, e.b)); view.hl.add(e.a); view.hl.add(e.b); }
          });
          view.dim = !!selPt;
          view.draw();
        }
        plot.innerHTML = key === "polblogs" ? heat() : scatter();
        plot.querySelectorAll("[data-pt]").forEach(c => c.addEventListener("click", () => {
          const [x, y] = c.dataset.pt.split(",").map(Number);
          selPt = selPt && selPt[0] === x && selPt[1] === y ? null : [x, y];
          paint();
        }));
        /* kiírás */
        const r = st.r;
        let s = `$r = ${isFinite(r) ? fmM(r, 2) : "\\text{--}"}$ · ${st.m} él → ${2 * st.m} pont`;
        if (!st.m) s += "<br>Nincs él: nincs mit korreláltatni.";
        else if (!isFinite(r)) s += "<br><b>Nem értelmezhető:</b> minden fokszám egyenlő, a pontok egyetlen helyre esnek (a nevező 0).";
        else if (r < -0.05) s += "<br><b>Negatív:</b> a nagy fokú csúcsok kis fokúakhoz kapcsolódnak – <b>diszasszortatív</b>.";
        else if (r > 0.05) s += "<br><b>Pozitív:</b> hasonló fokúak kapcsolódnak – <b>asszortatív</b>.";
        else s += "<br><b>Közel 0:</b> a végpontok fokszáma alig függ össze.";
        if (selPt && key !== "polblogs") {
          const cnt = view.hlE.size;
          s += `<br>A $(${selPt[0]}, ${selPt[1]})$ pont: ${cnt} él, amelynek egyik végén ${selPt[0]}, a másikon ${selPt[1]} fokú csúcs áll` +
            (selPt[0] === selPt[1] ? " (mindkét irányban ugyanez a pont)." : ` (ugyanezek az élek adják a $(${selPt[1]}, ${selPt[0]})$ pontot is).`);
        }
        if (key === "polblogs") s += `<br>${st.n} blog, a kölcsönös linkpár egy él. A sok linket kapó nagy blogokra főleg kis blogok mutatnak – a szociális hálókkal ellentétben a web diszasszortatív.`;
        if (key === "karate") s += "<br>A két vezető (1 és 34) sok kis fokú taghoz kapcsolódik: erősen diszasszortatív.";
        info.innerHTML = s;
        math(info);
      }
      /* szórásdiagram kis gráfra: a pont mérete a darabszám, regressziós egyenes */
      function scatter() {
        const Wd = 340, Ht = 300, L = 38, R = 14, T = 14, B = 34;
        if (!st.m) return svgEl(Wd, Ht, `<text x="${Wd / 2}" y="${Ht / 2}" text-anchor="middle" fill="${sv("--muted")}" font-size="13">nincs él</text>`, "üres szórásdiagram");
        const kmax = Math.max(...st.xs), lo = 0, hi = kmax + 1;
        const X = x => L + (x - lo) / (hi - lo) * (Wd - L - R), Y = y => Ht - B - (y - lo) / (hi - lo) * (Ht - T - B);
        const step = hi > 12 ? (hi > 24 ? 5 : 2) : 1;
        let g = "";
        for (let t = 0; t <= hi; t += step) {
          g += `<line x1="${X(t)}" y1="${T}" x2="${X(t)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.6"/>` +
            `<line x1="${L}" y1="${Y(t)}" x2="${Wd - R}" y2="${Y(t)}" stroke="${sv("--border")}" stroke-width="0.6"/>` +
            `<text x="${X(t)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>` +
            `<text x="${L - 6}" y="${Y(t) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${t}</text>`;
        }
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kᵤ (az egyik végpont fokszáma)</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">kᵥ (a másik végponté)</text>`;
        /* regressziós egyenes: a két tengely szórása egyenlő, így a meredekség éppen r */
        if (isFinite(st.r)) {
          const mx = mean(st.xs), x0 = Math.min(...st.xs) - 0.4, x1 = kmax + 0.4, y = x => mx + st.r * (x - mx);
          g += `<line x1="${X(x0)}" y1="${Y(y(x0))}" x2="${X(x1)}" y2="${Y(y(x1))}" stroke="${sv("--bad")}" stroke-width="2" stroke-dasharray="6 4"/>`;
        }
        const cnt = {};
        st.xs.forEach((x, i) => { const k = x + "," + st.ys[i]; cnt[k] = (cnt[k] || 0) + 1; });
        const maxC = Math.max(...Object.values(cnt)), rad = c => 4 + 9 * Math.sqrt(c / maxC);
        Object.entries(cnt).forEach(([k, c]) => {
          const [x, y] = k.split(",").map(Number), on = selPt && selPt[0] === x && selPt[1] === y;
          const pr = rad(c);
          g += `<g data-pt="${k}" style="cursor:pointer"><circle cx="${X(x)}" cy="${Y(y)}" r="${Math.max(pr, 11)}" fill="transparent"/>` +
            `<circle cx="${X(x)}" cy="${Y(y)}" r="${pr}" fill="${sv(on ? "--accent" : "--setA")}" fill-opacity="${on ? 0.95 : 0.6}" stroke="${sv(on ? "--accent" : "--setA")}" stroke-width="1.2"/>` +
            (c > 1 ? `<text x="${X(x) + pr + 2}" y="${Y(y) - pr + 2}" font-size="10" font-weight="600" fill="${sv("--text")}" stroke="${sv("--card")}" stroke-width="2.5" paint-order="stroke">${c}×</text>` : "") +
            `<title>(${x}, ${y}): ${c} pont</title></g>`;
        });
        g += `<text x="${Wd - R}" y="${T + 10}" text-anchor="end" font-size="10.5" fill="${sv("--bad")}">regressziós egyenes (meredeksége r)</text>`;
        return svgEl(Wd, Ht, g, "szórásdiagram: az élvégek fokszámai");
      }
      /* hőtérkép nagy gráfra: logaritmikus rekeszek, a szín a darabszám logaritmusa */
      function heat() {
        const Wd = 340, Ht = 310, L = 40, R = 14, T = 14, B = 36;
        const kmax = Math.max(...st.xs), lmax = Math.log10(kmax * 1.05), NB = 14;
        const bin = k => Math.min(NB - 1, Math.floor(Math.log10(k) / lmax * NB));
        const X = lk => L + lk / lmax * (Wd - L - R), Y = lk => Ht - B - lk / lmax * (Ht - T - B);
        const C = Array.from({ length: NB }, () => new Array(NB).fill(0)), sumY = new Array(NB).fill(0), nY = new Array(NB).fill(0);
        st.xs.forEach((x, i) => { const bx = bin(x); C[bx][bin(st.ys[i])]++; sumY[bx] += st.ys[i]; nY[bx]++; });
        const cmax = Math.log(1 + Math.max(...C.flat()));
        let g = "";
        for (let a = 0; a < NB; a++) for (let b = 0; b < NB; b++) if (C[a][b]) {
          const x0 = X(a * lmax / NB), x1 = X((a + 1) * lmax / NB), y0 = Y((b + 1) * lmax / NB), y1 = Y(b * lmax / NB);
          g += `<rect x="${x0}" y="${y0}" width="${x1 - x0 + 0.3}" height="${y1 - y0 + 0.3}" fill="${mixColor("--card", "--accent", 0.12 + 0.88 * Math.log(1 + C[a][b]) / cmax)}"><title>${C[a][b]} pont</title></rect>`;
        }
        [1, 2, 5, 10, 20, 50, 100, 200].filter(t => Math.log10(t) <= lmax).forEach(t => {
          const l = Math.log10(t);
          g += `<line x1="${X(l)}" y1="${T}" x2="${X(l)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.5"/>` +
            `<line x1="${L}" y1="${Y(l)}" x2="${Wd - R}" y2="${Y(l)}" stroke="${sv("--border")}" stroke-width="0.5"/>` +
            `<text x="${X(l)}" y="${Ht - B + 13}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>` +
            `<text x="${L - 5}" y="${Y(l) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${t}</text>`;
        });
        /* a szomszédok átlagos fokszáma rekeszenként */
        const pts = [];
        for (let a = 0; a < NB; a++) if (nY[a]) pts.push([X((a + 0.5) * lmax / NB), Y(Math.log10(sumY[a] / nY[a]))]);
        g += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${sv("--setB")}" stroke-width="2.2"/>` +
          pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${sv("--setB")}"/>`).join("");
        /* a regressziós egyenes log-skálán görbe */
        const mx = mean(st.xs), cur = [];
        for (let t = 0; t <= 60; t++) { const k = Math.pow(10, t / 60 * lmax), y = mx + st.r * (k - mx); if (y >= 1) cur.push([X(Math.log10(k)), Y(Math.log10(y))]); }
        g += `<polyline points="${cur.map(p => p.join(",")).join(" ")}" fill="none" stroke="${sv("--bad")}" stroke-width="1.8" stroke-dasharray="6 4"/>`;
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 5}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kᵤ (log-skála)</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">kᵥ (log-skála)</text>`;
        const leg = `<div class="muted" style="font-size:.8rem;margin-top:.2rem">sötétebb cella: több pont (log-skálán) · <span style="color:var(--setB)">●—</span> a szomszédok átlagos fokszáma · ` +
          `<span style="color:var(--bad)">- -</span> regressziós egyenes (log-skálán görbe)</div>`;
        return svgEl(Wd, Ht, g, "hőtérkép: a politikai blogok élvégeinek fokszámai") + leg;
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       6.3  weak-ties – gyenge kötések: súly, átfedés, eltávolítás
       ------------------------------------------------------------------ */
    W["weak-ties"] = root => {
      header(root, "Gyenge kötések: súly, átfedés és a háló szétesése",
        "Az élvastagság a súly (karateklub: hány helyzetben találkozott a két tag; Árvízhét: közös cikkek). A szín a súlyt vagy a szomszédsági átfedést mutatja: " +
        "$O_{ij} = \\dfrac{|N(i)\\cap N(j)|}{|N(i)\\cup N(j)\\setminus\\{i,j\\}|}$. Szaggatott: <b>helyi híd</b> ($O = 0$). Kattints egy élre az adataiért!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 1 : 0.6;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let key = "karate", colorBy = "w", order = "weak", k = 0, selE = -1, G, n = 0, E = [], O = [], seq = [], curves = {}, seed = 1;
      toggleGroup(ctr, [["karate", "karateklub (súlyozott)"], ["arviz", "Árvízhét"]], key, v => { key = v; load(); });
      ctr2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "élszín:"));
      toggleGroup(ctr2, [["w", "súly szerint"], ["o", "átfedés szerint"]], colorBy, v => { colorBy = v; paint(); });
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect, radius: 12, draggable: false, nodes: [], edges: [],
        onEdgeClick: i => { selE = selE === view.edges[i].id ? -1 : view.edges[i].id; paint(); } });
      const legend = h("div", { class: "muted", style: "font-size:.8rem;margin-top:.2rem" });
      const info = h("div", { class: "readout" });
      root.append(legend, info);
      /* eltávolítási kísérlet */
      root.append(h("div", { style: "font-weight:700;margin-top:1rem" }, "Eltávolítási kísérlet (Onnela és mtsai, 2007, kicsiben)"));
      const ctr3 = h("div", { class: "controls" }), ctr4 = h("div", { class: "controls" });
      root.append(ctr3, ctr4);
      ctr3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "sorrend:"));
      toggleGroup(ctr3, [["weak", "a gyengéket előbb"], ["strong", "az erőseket előbb"], ["overlap", "a kis átfedésűeket előbb"], ["random", "véletlen sorrend"]], order,
        v => { order = v; seq = makeSeq(order, rng(seed)); paint(); });
      const kVal = h("b", { style: "font-family:var(--mono);min-width:2.2em" });
      const kSl = h("input", { type: "range", min: 0, max: 78, step: 1, value: 0, "aria-label": "kivett élek száma", style: "width:11rem;max-width:55vw",
        oninput: () => { k = +kSl.value; paint(); } });
      ctr4.append(h("label", null, "kivett élek:", kSl, kVal), btn("Új sorsolás", () => { seed++; seq = makeSeq(order, rng(seed)); paint(); }));
      const chart = h("div", { style: "margin-top:.3rem" }), info2 = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" }, "A gyenge kötések eltávolítása hamarabb szétszedi a hálózatot: ezek kötik össze a csoportokat.");
      root.append(chart, info2, lesson);

      /* eltávolítási sorrend: élindexek; holtversenyben véletlen sorrend */
      function makeSeq(ord, R) {
        const tie = E.map(() => R()), idx = [...E.keys()];
        const val = i => (ord === "weak" ? E[i].w : ord === "strong" ? -E[i].w : ord === "overlap" ? Math.round(O[i] * 1e9) : 0);
        return idx.sort((i, j) => val(i) - val(j) || tie[i] - tie[j]);
      }
      /* az óriáskomponens mérete 0, 1, …, m kivett élnél */
      function curveOf(s) {
        const out = [];
        for (let t = 0; t <= E.length; t++) { const gone = new Set(s.slice(0, t)); out.push(giant(n, E.filter((_, i) => !gone.has(i)))); }
        return out;
      }
      function avgCurve(ord, runs = 50) {
        const R = rng(2007), acc = new Array(E.length + 1).fill(0);
        for (let r = 0; r < runs; r++) curveOf(makeSeq(ord, R)).forEach((g, t) => (acc[t] += g / runs));
        return acc;
      }
      function load() {
        G = preset(key, aspect);
        n = G.nodes.length;
        E = G.edges.map((e, i) => ({ a: e.a, b: e.b, w: e.w, id: i }));
        O = overlapE(n, E);
        const kar = key === "karate";
        view.o.radius = kar ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
        view.o.showWeights = !kar;
        view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.03 + nd.x * 0.94 : nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub })), []);
        kSl.max = E.length; k = Math.min(k, E.length); kSl.value = k;
        selE = -1; seed = 1;
        seq = makeSeq(order, rng(seed));
        curves = { weak: avgCurve("weak"), strong: avgCurve("strong"), overlap: avgCurve("overlap"), random: avgCurve("random") };
        stats();
        paint();
      }
      let statHTML = "";
      function stats() {
        const w = E.map(e => e.w), rho = spearman(w, O), pr = pearson(w, O);
        const bridges = O.filter(o => o === 0).length;
        let s = `Súly és átfedés: Spearman-féle rangkorreláció $\\rho = ${fmM(rho, 2)}$ (Pearson ${fmtS(pr, 2)})` +
          (rho > 0.2 ? " – az erős kötések körül több a közös ismerős." : ".");
        if (key === "karate") {
          const club = G.club, cross = E.map((e, i) => i).filter(i => club[E[i].a] !== club[E[i].b]), inn = E.map((e, i) => i).filter(i => club[E[i].a] === club[E[i].b]);
          const mw = ix => mean(ix.map(i => E[i].w)), mo = ix => mean(ix.map(i => O[i]));
          s += `<br>A két klub közti ${cross.length} él átlagos súlya <b>${fmt(mw(cross), 2)}</b>, a klubon belüli ${inn.length} élé <b>${fmt(mw(inn), 2)}</b>.` +
            `<br>Átlagos átfedés: <b>${fmt(mo(cross), 3)}</b> (klubok közti) vs. <b>${fmt(mo(inn), 3)}</b> (klubon belüli).`;
        }
        s += `<br>Helyi híd ($O = 0$): <b>${bridges}</b> él` + (bridges ? " (szaggatott)." : " – itt minden élnek van közös szomszédja.");
        statHTML = s;
      }
      const L = i => view.nodes[i].label;
      function paint() {
        const kar = key === "karate";
        kVal.textContent = k;
        const gone = new Set(seq.slice(0, k)), rest = E.filter((_, i) => !gone.has(i));
        const comp = components(n, rest), sz = {};
        comp.comp.forEach(c => (sz[c] = (sz[c] || 0) + 1));
        const big = Math.max(...Object.values(sz)), bigC = +Object.keys(sz).find(c => sz[c] === big);
        const maxW = Math.max(...E.map(e => e.w));
        view.nodes.forEach((nd, i) => {
          const inG = comp.comp[i] === bigC;
          nd.color = !inG ? mixColor("--card", "--muted", 0.55) : kar ? mixColor("--card", G.club[i] ? "--setB" : "--setA", 0.38) : null;
          nd.ink = nd.color ? inkOf(nd.color) : null;
        });
        view.edges = rest.map(e => {
          const i = e.id, t = colorBy === "w" ? (maxW > 1 ? (e.w - 1) / (maxW - 1) : 1) : O[i];
          const on = i === selE;
          return { a: e.a, b: e.b, w: e.w, id: i, width: (kar ? 0.9 + 0.75 * e.w : 1.5 + 1.6 * e.w) + (on ? 1.5 : 0),
            color: on ? "--bad" : mixColor("--border", colorBy === "w" ? "--accent" : "--setC", 0.2 + 0.8 * t),
            dash: O[i] === 0 ? [6, 4] : null, label: kar ? null : (colorBy === "w" ? String(e.w) : fmt(O[i], 2)) };
        });
        view.hl = new Set(selE >= 0 && !gone.has(selE) ? [E[selE].a, E[selE].b] : []);
        view.draw();
        legend.innerHTML = (colorBy === "w" ? `élszín: <span style="color:var(--accent)">sötétebb = nagyobb súly</span>` : `élszín: <span style="color:var(--setC)">sötétebb = nagyobb átfedés</span>`) +
          (kar ? ` · csúcsok: <span style="color:var(--setA)">●</span> Mr. Hi klubja, <span style="color:var(--setB)">●</span> az elnök (John A.) klubja` : "") +
          (k ? " · szürke csúcs: leszakadt az óriáskomponensről" : "");
        let s = statHTML;
        if (selE >= 0) {
          const e = E[selE], S = nbrSets(n, E), cm = [...S[e.a]].filter(x => x !== e.b && S[e.b].has(x));
          const un = new Set([...S[e.a], ...S[e.b]]); un.delete(e.a); un.delete(e.b);
          s += `<br><b>${L(e.a)}–${L(e.b)}</b>: súly ${e.w}, közös szomszéd ${cm.length} (${cm.map(L).join(", ") || "nincs"}), ` +
            `$O = ${cm.length}/${un.size} = ${fmM(O[selE], 2)}$` + (O[selE] === 0 ? " – helyi híd" : "") +
            (kar && G.club[e.a] !== G.club[e.b] ? " · a két klub között fut" : "") + (gone.has(selE) ? " · <i>már kivetted</i>" : "");
        }
        info.innerHTML = s;
        math(info);
        chart.innerHTML = lineChart(big);
        const ON = { weak: "a gyengéket előbb", strong: "az erőseket előbb", overlap: "a kis átfedésűeket előbb", random: "véletlen sorrend" };
        info2.innerHTML = `Sorrend: <b>${ON[order]}</b> · kivett élek: <b>${k}</b> / ${E.length} · óriáskomponens: <b>${big}</b> csúcs · komponensek: ${comp.sizes.length}` +
          `<br>Átlag 50 sorsolásból ${k} kivett élnél: gyengéket előbb ${fmt(curves.weak[k], 1)}, erőseket előbb ${fmt(curves.strong[k], 1)}` +
          (order === "overlap" || order === "random" ? `, ${ON[order]} ${fmt(curves[order][k], 1)}` : "") + ".";
      }
      function lineChart(cur) {
        const Wd = narrow ? 360 : 560, Ht = narrow ? 240 : 250, Lm = 40, R = 12, T = 12, B = 34, m = E.length;
        const X = t => Lm + t / m * (Wd - Lm - R), Y = y => Ht - B - y / n * (Ht - T - B);
        let g = "";
        const xstep = m > 40 ? 10 : m > 15 ? 5 : 1, ystep = n > 20 ? 5 : 1;
        for (let t = 0; t <= m; t += xstep) g += `<line x1="${X(t)}" y1="${T}" x2="${X(t)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${X(t)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>`;
        for (let y = 0; y <= n; y += ystep) g += `<line x1="${Lm}" y1="${Y(y)}" x2="${Wd - R}" y2="${Y(y)}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${Lm - 5}" y="${Y(y) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${y}</text>`;
        g += `<text x="${(Lm + Wd - R) / 2}" y="${Ht - 5}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kivett élek száma</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">óriáskomponens (csúcs)</text>`;
        const line = (c, col, dash, name) => `<polyline data-curve="${name}" data-v="${c.map(v => v.toFixed(2)).join(" ")}" points="${c.map((v, t) => X(t) + "," + Y(v)).join(" ")}" fill="none" stroke="${sv(col)}" stroke-width="2.4"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
        g += line(curves.weak, "--setA", "", "weak") + line(curves.strong, "--setB", "", "strong");
        if (order === "overlap") g += line(curves.overlap, "--setC", "6 4", "overlap");
        if (order === "random") g += line(curves.random, "--muted", "6 4", "random");
        g += `<line x1="${X(k)}" y1="${T}" x2="${X(k)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="1" stroke-dasharray="3 3"/>` +
          `<circle cx="${X(k)}" cy="${Y(cur)}" r="5.5" fill="${sv("--bad")}" stroke="${sv("--card")}" stroke-width="2"/>`;
        const lx = Wd - R - 6;
        g += `<text x="${lx}" y="${T + 14}" text-anchor="end" font-size="11" fill="${sv("--setA")}" font-weight="600">— a gyengéket előbb</text>` +
          `<text x="${lx}" y="${T + 29}" text-anchor="end" font-size="11" fill="${sv("--setB")}" font-weight="600">— az erőseket előbb</text>` +
          (order === "overlap" ? `<text x="${lx}" y="${T + 44}" text-anchor="end" font-size="11" fill="${sv("--setC")}" font-weight="600">- - a kis átfedésűeket előbb</text>` : "") +
          (order === "random" ? `<text x="${lx}" y="${T + 44}" text-anchor="end" font-size="11" fill="${sv("--muted")}" font-weight="600">- - véletlen sorrend</text>` : "") +
          `<text x="${lx}" y="${T + (order === "overlap" || order === "random" ? 59 : 44)}" text-anchor="end" font-size="11" fill="${sv("--bad")}">● a mostani sorsolás</text>`;
        return svgEl(Wd, Ht, g, "az óriáskomponens mérete a kivett élek függvényében") +
          `<div class="muted" style="font-size:.8rem">a görbék 50 véletlen holtverseny-feloldás átlagai (rögzített maggal)</div>`;
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       6.5  motif-census – háromszögek a nullmodellhez képest; előrecsatolt hurok
       ------------------------------------------------------------------ */
    W["motif-census"] = root => {
      header(root, "Motívumok: sok-e a háromszög – és mihez képest?",
        "(a) Számold meg a háromszögeket, és vesd össze 500 véletlen gráffal: a nullmodell vagy csak a csúcs- és élszámot tartja meg ($G(n, m)$), " +
        "vagy minden csúcs fokszámát is (fokszámtartó átkötés). (b) Irányított gráfban az <b>előrecsatolt hurok</b> ($a\\to b$, $b\\to c$, $a\\to c$) a jellegzetes háromszereplős minta.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const ctrT = h("div", { class: "controls" });
      root.append(ctrT);
      const pa = h("div"), pb = h("div");
      root.append(pa, pb);
      toggleGroup(ctrT, [["u", "(a) Irányítatlan: háromszögek"], ["d", "(b) Irányított: előrecsatolt hurok"]], "u", v => {
        pa.style.display = v === "u" ? "" : "none"; pb.style.display = v === "d" ? "" : "none";
        (v === "u" ? va : vb).resize();
      });
      pb.style.display = "none";

      /* ---------- (a) ---------- */
      const aspectA = narrow ? 0.8 : 0.5;
      const cA = h("div", { class: "controls" }), cA2 = h("div", { class: "controls" });
      pa.append(cA);
      let keyA = "arviz", nullM = "gnm", obs = null, samples = null, runTok = 0, seedA = 1;
      toggleGroup(cA, [["arviz", "Árvízhét"], ["karate", "karateklub"], ["kite", "sárkány"], ["bowtie", "csokornyakkendő"], ["empty", "saját (üres)"]], keyA, v => { keyA = v; loadA(); });
      const boxA = h("div");
      const infoA = h("div", { class: "readout" });
      pa.append(boxA, infoA, cA2);
      const va = new GK.View(boxA, { aspect: aspectA, editable: true, maxNodes: 12, radius: narrow ? 14 : 16, nodes: [], edges: [],
        onChange: () => { invalidate(); countA(); } });
      cA2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "nullmodell:"));
      toggleGroup(cA2, [["gnm", "véletlen gráf G(n, m)"], ["rew", "fokszámtartó átkötés"]], nullM, v => { nullM = v; invalidate(); paintHist(); });
      const runB = btn("500 véletlen gráf", () => runNull(), "btn primary"), prog = h("span", { class: "muted", style: "font-size:.9rem;font-family:var(--mono)" });
      cA2.append(runB, prog);
      const hist = h("div"), infoH = h("div", { class: "readout" });
      const lessonA = h("p", { style: "margin:.5rem 0 0;font-weight:600;display:none" },
        "Ugyanaz a háromszögszám az egyik nullmodellhez képest kiugró, a másikhoz képest alig – a »sok« mindig valamihez képest sok.");
      pa.append(hist, infoH, lessonA);
      const done = { gnm: false, rew: false };

      function loadA() {
        let G = keyA === "empty" ? { nodes: [], edges: [] } : preset(keyA, aspectA);
        va.o.editable = keyA !== "karate";
        va.o.radius = keyA === "karate" ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
        va.o.maxNodes = Math.max(12, G.nodes.length);
        va.setGraph(G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        done.gnm = done.rew = false;
        invalidate(); countA();
      }
      function invalidate() { runTok++; samples = null; prog.textContent = ""; runB.disabled = false; paintHist(); }
      function countA() {
        const n = va.nodes.length, E = va.edges.filter(e => e.a !== e.b), T = triangles(n, E), S = clusteringStats(n, E);
        obs = { n, m: E.length, tri: S.tri, wedges: S.wedges, triples: S.triples, trans: S.trans, list: T.list };
        va.hlE = new Set(); T.list.forEach(([i, j, k]) => [[i, j], [j, k], [i, k]].forEach(([x, y]) => va.hlE.add(GK.edgeKey(x, y))));
        va.nodes.forEach((nd, i) => (nd.badge = keyA === "karate" ? null : T.per[i] || null));
        va.draw();
        infoA.innerHTML = `$n = ${n}$, $m = ${obs.m}$ · háromszög: <b>${obs.tri}</b> · nyitott hármas (ék): <b>${obs.wedges}</b> · ` +
          `tranzitivitás: $\\dfrac{3\\cdot ${obs.tri}}{3\\cdot ${obs.tri} + ${obs.wedges}} = ${obs.triples ? fmM(obs.trans, 3) : "\\text{--}"}$` +
          `<br><span class="muted">Kiemelve: a háromszögek élei; a szám a csúcs mellett: hány háromszögben van.</span>`;
        math(infoA);
      }
      function runNull() {
        if (!obs || obs.m < 2) { infoH.innerHTML = "Ehhez legalább 2 él kell."; return; }
        const tok = ++runTok, R = rng(1000 * seedA++ + (nullM === "gnm" ? 1 : 2)), n = obs.n, m = obs.m;
        const E = va.edges.filter(e => e.a !== e.b).map(e => ({ a: e.a, b: e.b, w: 1 })), N = 500, out = [];
        runB.disabled = true;
        const batch = () => {
          if (tok !== runTok) return;
          const t0 = performance.now();
          while (out.length < N && performance.now() - t0 < 25) {
            const G = nullM === "gnm" ? gnm(n, m, R) : rewire(n, E, 10 * m, R);
            out.push(triangles(n, G).list.length);
          }
          prog.textContent = `${out.length} / ${N}`;
          if (out.length < N) setTimeout(batch, 0);
          else { samples = out; done[nullM] = true; runB.disabled = false; prog.textContent = "kész: 500 / 500"; paintHist(); }
        };
        prog.textContent = `0 / ${N}`;
        setTimeout(batch, 0);
      }
      function paintHist() {
        lessonA.style.display = done.gnm && done.rew && (keyA === "arviz" || keyA === "karate") ? "" : "none";
        if (!samples) {
          hist.innerHTML = "";
          infoH.innerHTML = `Nullmodell: <b>${nullM === "gnm" ? "véletlen gráf G(n, m)" : "fokszámtartó átkötés (10·m élcsere-kísérlet)"}</b>. ` +
            "Nyomd meg az „500 véletlen gráf” gombot!";
          return;
        }
        const mu = mean(samples), sd = sdev(samples), z = sd > 0 ? (obs.tri - mu) / sd : NaN, p = samples.filter(x => x >= obs.tri).length / samples.length;
        const lo = Math.min(...samples, obs.tri), hi = Math.max(...samples, obs.tri);
        const cnt = new Array(hi - lo + 1).fill(0); samples.forEach(x => cnt[x - lo]++);
        const Wd = narrow ? 360 : 560, Ht = 210, Lm = 38, R = 12, T = 22, B = 32, cmax = Math.max(...cnt);
        const X = v => Lm + (v - lo + 0.5) / (hi - lo + 1) * (Wd - Lm - R), bw = (Wd - Lm - R) / (hi - lo + 1), Y = c => Ht - B - c / cmax * (Ht - T - B);
        let g = "";
        cnt.forEach((c, i) => { if (c) g += `<rect x="${X(lo + i) - bw * 0.42}" y="${Y(c)}" width="${bw * 0.84}" height="${Ht - B - Y(c)}" fill="${sv("--setA")}" fill-opacity="0.75"><title>${lo + i} háromszög: ${c} gráf</title></rect>`; });
        const xstep = Math.max(1, Math.ceil((hi - lo + 1) / 14));
        for (let v = lo; v <= hi; v += xstep) g += `<text x="${X(v)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${v}</text>`;
        g += `<line x1="${Lm}" y1="${Ht - B}" x2="${Wd - R}" y2="${Ht - B}" stroke="${sv("--border")}"/>`;
        for (let c = 0; c <= cmax; c += Math.max(1, Math.ceil(cmax / 4 / 10) * 10)) g += `<text x="${Lm - 5}" y="${Y(c) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${c}</text>`;
        g += `<line x1="${X(obs.tri)}" y1="${T - 8}" x2="${X(obs.tri)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="2.5"/>` +
          `<text x="${Math.min(X(obs.tri) + 5, Wd - R - 60)}" y="${T - 10 + 10}" font-size="11" font-weight="600" fill="${sv("--bad")}">megfigyelt: ${obs.tri}</text>` +
          `<text x="${(Lm + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">háromszögek száma a véletlen gráfban</text>`;
        hist.innerHTML = svgEl(Wd, Ht, g, "hisztogram: háromszögek a véletlen gráfokban");
        infoH.innerHTML = `Nullmodell: <b>${nullM === "gnm" ? "G(n, m)" : "fokszámtartó átkötés"}</b>, 500 gráf · átlag: <b>${fmt(mu, 2)}</b> · szórás: <b>${fmt(sd, 2)}</b>` +
          `<br>$z = \\dfrac{${obs.tri} - ${fmM(mu, 2)}}{${fmM(sd, 2)}} = ${isFinite(z) ? fmM(z, 2) : "\\text{--}"}$ · legalább ${obs.tri} háromszög: ${fmt(100 * p, 1)}% (empirikus $p = ${fmM(p, 3)}$)` +
          `<br>` + (!isFinite(z) ? "A nullmodell mindig ugyanannyi háromszöget ad: nincs szórás." :
            z > 2 ? "<b>Kiugró:</b> ennyi háromszög ebben a nullmodellben ritka." : z > 1 ? "Valamivel több a vártnál, de nem kiugró." : "Nem kiugró: a véletlen gráfokban is gyakori ennyi háromszög.");
        math(infoH);
      }

      /* ---------- (b) ---------- */
      const aspectB = narrow ? 0.75 : 0.42;
      const cB = h("div", { class: "controls" });
      pb.append(cB);
      let keyB = "papers", selF = -1, FFL = [], CYC = [];
      toggleGroup(cB, [["papers", "lapok átvételei"], ["papers2", "+ NY→RH"], ["cyc", "kör"], ["empty", "üres"]], keyB, v => { keyB = v; loadB(); });
      pb.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.2rem 0" },
        "Szerkesztés: kattints előbb a kiinduló, aztán a cél csúcsra (él be/ki); élre kattintva törlés; üres helyre kattintva új csúcs."));
      const boxB = h("div"), infoB = h("div", { class: "readout" });
      pb.append(boxB, infoB);
      const vb = new GK.View(boxB, { aspect: aspectB, directed: true, editable: true, maxNodes: 8, radius: narrow ? 15 : 17, nodes: [], edges: [],
        onNodeClick: i => {
          if (vb.sel < 0) vb.sel = i;
          else if (vb.sel === i) vb.sel = -1;
          else {
            const j = vb.edges.findIndex(e => e.a === vb.sel && e.b === i);
            if (j >= 0) vb.edges.splice(j, 1); else vb.edges.push({ a: vb.sel, b: i, w: 1 });
            vb.sel = -1; selF = -1; countB(); return;
          }
          vb.draw();
        },
        onChange: () => { selF = -1; countB(); } });
      function loadB() {
        let nodes, edges;
        if (keyB === "papers" || keyB === "papers2") {
          const P = GK.normalize([[0, 0], [1.4, 0], [1.4, 1.1], [0, 1.1]], aspectB), ids = D.papers.map(p => p.id);
          nodes = D.papers.map((p, i) => ({ label: p.id, x: narrow ? 0.06 + P[i][0] * 0.88 : P[i][0], y: liftY(P[i][1]), color: p.color, sub: p.name }));
          const s = "EK>RH,NY>EK,VN>RH,VN>NY" + (keyB === "papers2" ? ",NY>RH" : "");
          edges = s.split(",").map(t => { const [a, b] = t.split(">"); return { a: ids.indexOf(a), b: ids.indexOf(b), w: 1 }; });
        } else if (keyB === "cyc") {
          const P = GK.normalize([[0.5, 0], [1, 0.9], [0, 0.9]], aspectB);
          nodes = ["A", "B", "C"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] }));
          edges = [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 0 }];
        } else { nodes = []; edges = []; }
        vb.setGraph(nodes, edges);
        selF = -1; countB();
      }
      function countB() {
        const n = vb.nodes.length, has = new Set(vb.edges.filter(e => e.a !== e.b).map(e => e.a + ">" + e.b)), A = (x, y) => has.has(x + ">" + y);
        FFL = []; CYC = [];
        for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++) {
          if (a === b || b === c || a === c) continue;
          if (A(a, b) && A(b, c) && A(a, c)) FFL.push([a, b, c]);
          if (a < b && a < c && A(a, b) && A(b, c) && A(c, a)) CYC.push([a, b, c]);
        }
        paintB();
      }
      const LB = i => vb.nodes[i].label;
      function paintB() {
        const f = selF >= 0 ? FFL[selF] : null, on = new Set();
        if (f) [[f[0], f[1]], [f[1], f[2]], [f[0], f[2]]].forEach(([x, y]) => on.add(x + ">" + y));
        vb.edges.forEach(e => { const o = on.has(e.a + ">" + e.b); e.color = o ? "--bad" : null; e.width = o ? 4 : null; });
        vb.hl = new Set(f || []); vb.dim = !!f;
        vb.draw();
        infoB.innerHTML = "";
        infoB.append(h("div", { html: `Előrecsatolt hurok (FFL): <b>${FFL.length}</b> · irányított 3-kör: <b>${CYC.length}</b>` }));
        if (FFL.length) {
          const row = h("div", { class: "controls", style: "margin:.4rem 0 .1rem" });
          row.append(h("span", { class: "muted" }, "Kattints egy hurokra:"));
          FFL.forEach(([a, b, c], i) => row.append(btn(`${LB(a)}→${LB(b)}→${LB(c)} és ${LB(a)}→${LB(c)}`, () => { selF = selF === i ? -1 : i; paintB(); }, "btn" + (i === selF ? " on" : ""))));
          infoB.append(row);
        }
        if (CYC.length) infoB.append(h("div", null, "3-kör: " + CYC.map(([a, b, c]) => `${LB(a)}→${LB(b)}→${LB(c)}→${LB(a)}`).join(", ")));
        let s = "";
        if (f) s = `${LB(f[0])} kétféleképpen hat ${LB(f[2])}-re: közvetlenül és ${LB(f[1])}-n keresztül.`;
        else if (keyB === "papers" && !FFL.length && vb.edges.length === 4) s = "Az átvételek láncot alkotnak, de egyik lap sem veszi át egyszerre a forrást és a forrás forrását: nincs előrecsatolt hurok.";
        else if (keyB === "cyc" && CYC.length === 1 && !FFL.length) s = "A kör nem előrecsatolt hurok: itt nincs „kezdő” csúcs, amely mindkét úton hatna.";
        if (s) infoB.append(h("div", { class: "muted", style: "margin-top:.2rem" }, s));
      }

      onTheme(() => { va.draw(); vb.draw(); paintHist(); paintB(); });
      loadA(); loadB();
    };

    /* ------------------------------------------------------------------
       6.6  arvizhet-week – az Árvízhét együttemlítési gráfja napról napra
       ------------------------------------------------------------------ */
    W["arvizhet-week"] = root => {
      header(root, "Árvízhét napról napra: honnan jönnek a háromszögek?",
        "Egy cikk minden szereplőpárja él; a súly az eddigi közös cikkek száma. Az aznap megjelent új élek kiemelve; ha egy új él <b>triadikus zárás</b> " +
        "(a két végpontnak az előző nap végén már volt közös szomszédja), a közös szomszéd is kiemelve.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.5;
      const ids = D.actors.map(a => a.id), days = D.days, ix = id => ids.indexOf(id);
      const ON_ = { Ko: "a Kormányon", Vi: "a Vízügyön", Po: "a Polgármesteren", La: "a Lakókon", "Ön": "az Önkénteseken", Sz: "a Szakértőn", Kl: "a Klímaváltozáson" };
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let t = 0, colorTri = true, timer = null;
      const dVal = h("b", { style: "font-family:var(--mono);min-width:7.5em" });
      const sl = h("input", { type: "range", min: 0, max: days.length - 1, step: 1, value: 0, "aria-label": "nap", style: "width:10rem;max-width:50vw",
        oninput: () => { stop(); t = +sl.value; paint(); } });
      const playB = btn("▶ Lejátszás", () => (timer ? stop() : start()), "btn primary");
      ctr.append(h("label", null, "nap:", sl, dVal), playB);
      const tc = checkbox("háromszögek színezése: gyári vs. összerakott", v => { colorTri = v; paint(); }, true);
      ctr2.append(tc.lab);
      const box = h("div");
      root.append(box);
      /* napi állapotok előre: élek (súly, cikkek), új élek, zárás */
      const S = [];
      {
        const w = {}, arts = {};
        days.forEach((d, di) => {
          const prev = nbrSets(ids.length, Object.keys(w).map(k => { const [a, b] = k.split("-").map(Number); return { a, b }; }));
          const nw = [], inc = [];
          D.articles.filter(a => a.day === d).sort((x, y) => x.id - y.id).forEach(a => {
            const m = a.mentions;
            for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
              const x = ix(m[i]), y = ix(m[j]), k = GK.edgeKey(x, y);
              if (!(k in w)) {
                w[k] = 0; arts[k] = [];
                nw.push({ a: x, b: y, k, art: a.id, common: [...prev[x]].filter(z => prev[y].has(z)) });
              } else if (!nw.some(e => e.k === k) && !inc.includes(k)) inc.push(k);
              w[k]++; arts[k].push(a.id);
            }
          });
          const edges = Object.keys(w).map(k => { const [a, b] = k.split("-").map(Number); return { a, b, w: w[k], k, arts: arts[k].slice() }; });
          const st = clusteringStats(ids.length, edges), tri = triangles(ids.length, edges).list;
          const upto = D.articles.filter(a => days.indexOf(a.day) <= di);
          const tris = tri.map(([i, j, k]) => {
            const f = upto.filter(a => [i, j, k].every(v => a.mentions.includes(ids[v]))).map(a => a.id);
            return { t: [i, j, k], factory: f, parts: [[i, j], [j, k], [i, k]].map(([x, y]) => edges.find(e => e.k === GK.edgeKey(x, y))) };
          });
          S.push({ edges, nw, inc: inc.map(k => ({ k, w: w[k] })), st, tris });
        });
      }
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, draggable: false, showWeights: true, nodes: [], edges: [],
        onDraw: (ctx, v) => {
          if (!colorTri) return;
          ctx.save();
          ctx.globalCompositeOperation = "destination-over";          // a már megrajzolt élek és csúcsok mögé
          S[t].tris.forEach(T => {
            ctx.beginPath();
            T.t.forEach((i, q) => { const [x, y] = v.px(v.nodes[i]); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            ctx.closePath();
            ctx.fillStyle = mixColor("--card", T.factory.length ? "--setB" : "--setA", 0.42);
            ctx.fill();
          });
          ctx.restore();
        } });
      const G0 = preset("arviz", aspect);
      view.setGraph(G0.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.04 + nd.x * 0.92 : nd.x, y: liftY(nd.y), sub: nd.sub })), []);
      const legend = h("div", { class: "muted", style: "font-size:.8rem;margin-top:.2rem" });
      const info = h("div", { class: "readout" }), tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(legend, info, tw);

      const L = i => ids[i], pair = e => `${L(e.a)}–${L(e.b)}`;
      const ord = n => n + ".";
      function triText(T) {
        const nm = T.t.map(L).join("–");
        if (T.factory.length) return `${nm} (<b style="color:var(--setB)">gyári</b>: ${T.factory.map(ord).join("/")} cikk)`;
        const parts = T.parts.slice().sort((x, y) => x.arts[0] - y.arts[0]).map(e => e.arts.map(ord).join("/"));
        return `${nm} (<b style="color:var(--setA)">összerakott</b>: ${parts.slice(0, -1).join(", ")} és ${parts[parts.length - 1]} cikk)`;
      }
      function paint() {
        const s = S[t], d = days[t];
        sl.value = t;
        dVal.textContent = `${d} (${D.dayNames[d]})`;
        const fresh = new Set(s.nw.map(e => e.k)), closers = new Set();
        s.nw.forEach(e => e.common.forEach(c => closers.add(c)));
        view.edges = s.edges.map(e => ({ a: e.a, b: e.b, w: e.w, color: fresh.has(e.k) ? "--accent" : null, width: fresh.has(e.k) ? 2.2 + 1.4 * e.w : 1.4 + 1.2 * e.w }));
        view.hl = closers;
        view.nodes.forEach((nd, i) => {
          nd.color = closers.has(i) ? mixColor("--card", "--accent", 0.25) : null; nd.ink = null;
        });
        view.draw();
        legend.innerHTML = `<span style="color:var(--accent);font-weight:700">━</span> aznap új él · kiemelt csúcs: a zárást adó közös szomszéd · az élen a súly` +
          (colorTri ? ` · <span style="color:var(--setB)">■</span> gyári háromszög (egy cikkben mind a három) · <span style="color:var(--setA)">■</span> összerakott (különböző cikkekből)` : "");
        let r = `<b>${d}:</b> `;
        if (s.nw.length) r += s.nw.map(e => e.common.length ? `${pair(e)} – <b>zárás</b> ${e.common.map(c => ON_[L(c)]).join(" és ")} át` : `${pair(e)}`).join("; ");
        else r += "nincs új él – csak a súlyok nőnek";
        if (s.inc.length) r += `<br>Erősödő élek: ${s.inc.map(x => { const [a, b] = x.k.split("-").map(Number); return `${L(a)}–${L(b)} (${x.w})`; }).join(", ")}`;
        r += `<br>Élszám: <b>${s.edges.length}</b> · háromszög: <b>${s.st.tri}</b> · átlagos klaszterezettség: <b>${fmt(s.st.avg, 2)}</b> · tranzitivitás: <b>${fmt(s.st.trans, 3)}</b>`;
        if (s.tris.length) r += `<br>Háromszögek: ${s.tris.map(triText).join("; ")}`;
        const nf = s.tris.filter(T => T.factory.length).length;
        if (s.tris.length >= 2 && nf) r += `<br><b>${s.tris.length} háromszögből ${nf} egyetlen cikkből jön: az együttemlítési gráf klaszterezettségét a háromszereplős cikkek felfújják.</b>`;
        info.innerHTML = r;
        /* táblázat naponként */
        let tb = `<table style="margin:.4rem 0;font-size:.86rem;width:auto;min-width:100%"><thead><tr><th>nap</th><th>új élek</th><th>m</th><th>${narrow ? "△" : "háromszög"}</th><th>átl. C</th><th>${narrow ? "tranz." : "tranzitivitás"}</th></tr></thead><tbody>`;
        S.forEach((x, i) => {
          const st = i === t ? ' style="background:var(--accent-soft);font-weight:700"' : i > t ? ' style="opacity:.45"' : "";
          tb += `<tr${st}><td>${days[i]}</td><td>${x.nw.length ? x.nw.map(e => `<span style="white-space:nowrap">${pair(e)}${e.common.length ? "*" : ""}</span>`).join(", ") : "–"}</td><td>${x.edges.length}</td><td>${x.st.tri}</td>` +
            `<td style="font-family:var(--mono)">${fmt(x.st.avg, 2)}</td><td style="font-family:var(--mono)">${x.st.triples ? fmt(x.st.trans, 3) : "–"}</td></tr>`;
        });
        tw.innerHTML = tb + `</tbody></table><div class="muted" style="font-size:.8rem">* triadikus zárás${narrow ? " · △: háromszögek száma" : ""} · átl. C: mind a 7 csúcs átlaga (a 2-nél kisebb fokú csúcs 0)</div>`;
        tight(tw);
      }
      function start() {
        if (t >= days.length - 1) t = 0;
        paint();
        playB.textContent = "⏸ Megállít";
        timer = setInterval(() => { if (t >= days.length - 1) { stop(); return; } t++; paint(); }, 1300);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; playB.textContent = "▶ Lejátszás"; }
      autoStop(root, stop);
      onTheme(paint);
      paint();
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
