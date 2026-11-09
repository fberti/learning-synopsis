/* =========================================================
   Gráfelmélet és hálózattudomány 7. fejezet – interaktív szemléltetések
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

  const W = {};
  /* ==================================================================
     w1: 7.4 és 7.6 widgetjei (stub-matching, null-model-lab)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmS = (x, d = 2) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmK = (x, d = 2) => fmS(x, d).replace(",", "{,}").replace(MINUS, "-");      // KaTeX-be
    const grp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");                     // ezres tagolás
    const grpK = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");                 // ezres tagolás KaTeX-ben
    const sv = c => `var(${c})`;
    const svgEl = (W_, H_, inner, label) =>
      `<svg viewBox="0 0 ${W_} ${H_}" style="width:100%;max-width:${W_}px;display:block" role="img" aria-label="${label}">${inner}</svg>`;
    const dfact = k => { let r = 1; for (let i = k; i > 1; i -= 2) r *= i; return r; };   // k!!
    const liftY = y => 0.07 + (y - 0.08) * 0.9;
    const actorIds = D.actors.map(a => a.id);

    /* hisztogram SVG-ben: pmf = [[érték, arány], …]; obs: megfigyelt érték (függőleges vonal) */
    function histSVG(pmf, obs, { narrow = false, xlabel = "", exact = false } = {}) {
      const vals = pmf.map(p => p[0]).concat(obs), lo = Math.min(...vals), hi = Math.max(...vals);
      const cnt = new Array(hi - lo + 1).fill(0); pmf.forEach(([v, f]) => (cnt[v - lo] += f));
      const Wd = narrow ? 340 : 560, Ht = 200, Lm = 40, Rm = 12, T = 24, B = 34, cmax = Math.max(...cnt) || 1;
      const bw = (Wd - Lm - Rm) / (hi - lo + 1), X = v => Lm + (v - lo + 0.5) * bw, Y = c => Ht - B - c / cmax * (Ht - T - B);
      let g = "";
      cnt.forEach((c, i) => {
        if (!c) return;
        const v = lo + i, hit = v === obs;
        g += `<rect x="${X(v) - bw * 0.42}" y="${Y(c)}" width="${bw * 0.84}" height="${Ht - B - Y(c)}" fill="${sv(hit ? "--setB" : "--setA")}" fill-opacity="0.8"><title>${v}: ${fmt(100 * c, 1)}%</title></rect>`;
      });
      const xs = Math.max(1, Math.ceil((hi - lo + 1) / (narrow ? 9 : 14)));
      for (let v = lo; v <= hi; v += xs) g += `<text x="${X(v)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${v}</text>`;
      g += `<line x1="${Lm}" y1="${Ht - B}" x2="${Wd - Rm}" y2="${Ht - B}" stroke="${sv("--border")}"/>`;
      [0, 0.5, 1].forEach(t => g += `<text x="${Lm - 5}" y="${Y(t * cmax) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(100 * t * cmax, 0)}%</text>`);
      g += `<line x1="${X(obs)}" y1="${T - 10}" x2="${X(obs)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="2.5"/>` +
        `<text x="${Math.min(X(obs) + 5, Wd - Rm - 80)}" y="${T - 2}" font-size="11" font-weight="600" fill="${sv("--bad")}">megfigyelt: ${obs}</text>` +
        `<text x="${(Lm + Wd - Rm) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">${xlabel}${exact ? " (pontos eloszlás)" : ""}</text>`;
      return svgEl(Wd, Ht, g, "hisztogram: " + xlabel);
    }

    /* ------------------------------------------------------------------
       7.4  stub-matching – félélek párosítása és élcsere
       ------------------------------------------------------------------ */
    W["stub-matching"] = root => {
      header(root, "Konfigurációs modell: félélek és élcsere",
        "(a) Minden csúcs annyi <b>félélet</b> kap, amennyi a fokszáma; ezeket véletlenül párosítjuk. Figyeld a hurkokat és a többszörös éleket! Két csúcsra kattintva a várható élszámukat is látod. " +
        "(b) Az <b>élcsere</b> két él végeit cseréli meg: a fokszámok maradnak, a szerkezet változik.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.78 : 0.48;
      const tabs = h("div", { class: "controls" }); root.append(tabs);
      const pa = h("div"), pb = h("div"); root.append(pa, pb); pb.style.display = "none";
      toggleGroup(tabs, [["a", "(a) Félélek párosítása"], ["b", "(b) Élcsere"]], "a", v => {
        pa.style.display = v === "a" ? "" : "none"; pb.style.display = v === "b" ? "" : "none"; (v === "a" ? va : vb).resize();
      });

      /* ---------- (a) ---------- */
      const SEQ = {
        s211: { name: "(2, 1, 1)", labels: ["a", "b", "c"], deg: [2, 1, 1], pos: [[1, 0], [0, 1], [2, 1]] },
        s1111: { name: "(1, 1, 1, 1)", labels: ["A", "B", "C", "D"], deg: [1, 1, 1, 1], pos: [[0, 0], [1.4, 0], [1.4, 1], [0, 1]] },
        s22: { name: "(2, 2)", labels: ["a", "b"], deg: [2, 2], pos: [[0, 0], [1.6, 0]] },
        s3111: { name: "(3, 1, 1, 1)", labels: ["K", "1", "2", "3"], deg: [3, 1, 1, 1], pos: [[1, 0.7], [0, 0], [2, 0], [1, 1.6]] },
        arviz: { name: "Árvízhét" }
      };
      const ca = h("div", { class: "controls" }); pa.append(ca);
      let key = "s211", deg = [], match = null, pick = [], R = rng(7), simTok = 0;
      toggleGroup(ca, Object.entries(SEQ).map(([k, s]) => [k, s.name]), key, v => { key = v; load(); });
      const boxA = h("div"); pa.append(boxA);
      const va = new GK.View(boxA, { aspect, radius: narrow ? 14 : 16, nodes: [], edges: [], multiGap: 14,
        onNodeClick: i => { pick = pick.length >= 2 || pick.includes(i) ? [i] : pick.concat(i); va.hl = new Set(pick); va.draw(); simPair(); },
        onDraw: (ctx, v) => {                                        // a párosítatlan félélek: rövid „csonkok”
          if (match) return;
          const r = v.o.radius;
          ctx.strokeStyle = GK.css("--accent"); ctx.lineWidth = 2.5; ctx.lineCap = "round";
          v.nodes.forEach((nd, i) => {
            const [x, y] = v.px(nd), k = deg[i];
            for (let t = 0; t < k; t++) {
              const a = -Math.PI / 2 + (t - (k - 1) / 2) * 0.7;
              ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r + 2), y + Math.sin(a) * (r + 2)); ctx.lineTo(x + Math.cos(a) * (r + 13), y + Math.sin(a) * (r + 13)); ctx.stroke();
            }
          });
          ctx.lineCap = "butt";
        } });
      const ca2 = h("div", { class: "controls" }); pa.append(ca2);
      ca2.append(btn("Párosítás", () => { match = stubMatch(deg, R); draw(); }, "btn primary"),
        btn("Szétszed", () => { match = null; draw(); }),
        btn("2000 párosítás", () => runMany()));
      const infoA = h("div", { class: "readout" }), infoS = h("div", { class: "readout" }); pa.append(infoA, infoS);

      function load() {
        match = null; pick = []; simTok++;
        let labels, pos;
        if (key === "arviz") {
          const order = ["Ko", "Vi", "Po", "La", "Ön", "Sz", "Kl"];
          const dg = degreeC(7, preset("arviz").edges);                        // a D.actors sorrendjében
          labels = order; deg = order.map(id => dg[actorIds.indexOf(id)]); pos = order.map(id => ACTOR_POS[id]);
          pick = [0, 2];                                                       // Ko–Po
        } else { const s = SEQ[key]; labels = s.labels; deg = s.deg.slice(); pos = s.pos; }
        const P = GK.normalize(pos, aspect);
        va.setGraph(labels.map((l, i) => ({ label: l, x: P[i][0], y: key === "arviz" ? liftY(P[i][1]) * 0.85 + 0.1 : 0.12 + P[i][1] * 0.8 })), []);
        va.hl = new Set(pick);
        draw(); infoS.innerHTML = "A „2000 párosítás” gomb megmutatja, milyen gyakori az egyszerű gráf, és mennyi a kiválasztott pár átlagos élszáma.";
        if (pick.length === 2) simPair();
      }
      function draw() {
        va.nodes.forEach((nd, i) => (nd.badge = deg[i]));
        if (match) {
          va.edges = match.edges.map(e => ({ a: e.a, b: e.b, w: 1, color: e.a === e.b ? "--bad" : null }));
          const cnt = {}; match.edges.forEach(e => { const k = GK.edgeKey(e.a, e.b); cnt[k] = (cnt[k] || 0) + 1; });
          va.edges.forEach(e => { if (e.a !== e.b && cnt[GK.edgeKey(e.a, e.b)] > 1) e.color = "--setB"; });
        } else va.edges = [];
        va.draw();
        const m2 = deg.reduce((s, k) => s + k, 0);
        let s = `Fokszámok: (${deg.join(", ")}) · félélek: $2m = ${m2}$ · lehetséges párosítások: $(2m - 1)!! = ${grpK(dfact(m2 - 1))}$`;
        if (match) {
          const simple = !match.loops && !match.multi;
          s += `<br>Ez a párosítás: hurok <b>${match.loops}</b>, többszörös élpár <b>${match.multi}</b> → ` +
            (simple ? "<b>egyszerű gráf</b> ✔" : "<b>nem egyszerű</b> (hurok: piros, többszörös él: narancs)");
        } else s += "<br><span class=\"muted\">A rövid vonások a még párosítatlan félélek.</span>";
        infoA.innerHTML = s; math(infoA);
      }
      function simPair() {
        if (pick.length !== 2) return;
        const [i, j] = pick, m2 = deg.reduce((s, k) => s + k, 0), lab = l => texLab(va.nodes[l].label);
        infoS.innerHTML = `Kiválasztott pár: $${lab(i)}$–$${lab(j)}$ · várható élszám: $\\dfrac{k_i k_j}{2m - 1} = \\dfrac{${deg[i]} \\cdot ${deg[j]}}{${m2 - 1}} = ${fmK(deg[i] * deg[j] / (m2 - 1), 3)}$` +
          ` <span class="muted">(közelítés: $k_i k_j/2m = ${fmK(deg[i] * deg[j] / m2, 3)}$)</span>`;
        math(infoS);
      }
      function runMany() {
        const tok = ++simTok, N = 2000; let done = 0, simple = 0, loops = 0, pair = 0;
        const RR = rng(11 + done);
        const step = () => {
          if (tok !== simTok) return;
          const t0 = performance.now();
          while (done < N && performance.now() - t0 < 20) {
            const M = stubMatch(deg, RR); done++;
            if (!M.loops && !M.multi) simple++;
            loops += M.loops;
            if (pick.length === 2) pair += M.edges.filter(e => GK.edgeKey(e.a, e.b) === GK.edgeKey(pick[0], pick[1])).length;
          }
          const m2 = deg.reduce((s, k) => s + k, 0);
          let s = `${grp(done)} párosítás: egyszerű gráf <b>${fmt(100 * simple / done, 1)}%</b> · átlagos hurokszám <b>${fmt(loops / done, 2)}</b>` +
            ` <span class="muted">(elmélet: $\\sum_i \\binom{k_i}{2}/(2m - 1) = ${fmK(deg.reduce((t, k) => t + k * (k - 1) / 2, 0) / (m2 - 1), 2)}$)</span>`;
          if (pick.length === 2) s += `<br>A kiválasztott pár átlagos élszáma: <b>${fmt(pair / done, 3)}</b> <span class="muted">(képlet: ${fmt(deg[pick[0]] * deg[pick[1]] / (m2 - 1), 3)})</span>`;
          infoS.innerHTML = s; math(infoS);
          if (done < N) setTimeout(step, 0);
        };
        step();
      }

      /* ---------- (b) ---------- */
      const cb = h("div", { class: "controls" }); pb.append(cb);
      let keyB = "twoTri", RB = rng(3), last = null;
      toggleGroup(cb, [["twoTri", "két háromszög"], ["arviz", "Árvízhét"], ["star", "csillag"]], keyB, v => { keyB = v; loadB(); });
      const boxB = h("div"); pb.append(boxB);
      const vb = new GK.View(boxB, { aspect, radius: narrow ? 14 : 16, nodes: [], edges: [] });
      const cb2 = h("div", { class: "controls" }); pb.append(cb2);
      cb2.append(btn("Egy csere", () => swapOnce(true), "btn primary"), btn("100 csere", () => { for (let t = 0; t < 100; t++) swapOnce(false); last = null; drawB("100 cserekísérlet után."); }),
        btn("Vissza az eredetihez", () => loadB()));
      const infoB = h("div", { class: "readout" }); pb.append(infoB);
      let deg0 = [];
      function loadB() {
        let G;
        if (keyB === "twoTri") {
          const P = GK.normalize([[0, 0], [0, 1.2], [1, 0.6], [2, 0.6], [3, 0], [3, 1.2]], aspect);
          G = { nodes: ["1", "2", "3", "4", "5", "6"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })),
            edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]].map(([a, b]) => ({ a, b, w: 1 })) };
        } else if (keyB === "arviz") {
          const A = preset("arviz", aspect); G = { nodes: A.nodes.map(nd => ({ label: nd.label, x: nd.x, y: liftY(nd.y) })), edges: A.edges.map(e => ({ a: e.a, b: e.b, w: 1 })) };
        } else { const S = preset("star", aspect); G = { nodes: S.nodes, edges: S.edges }; }
        vb.setGraph(G.nodes, G.edges);
        deg0 = degreeC(G.nodes.length, G.edges); last = null;
        drawB("Kiinduló gráf.");
      }
      function swapOnce(show) {
        const E = vb.edges, m = E.length; if (m < 2) return;
        const i = Math.floor(RB() * m); let j = Math.floor(RB() * (m - 1)); if (j >= i) j++;
        let [a, b] = [E[i].a, E[i].b], [c, d] = [E[j].a, E[j].b];
        if (RB() < 0.5) [c, d] = [d, c];
        const has = (x, y) => E.some(e => GK.edgeKey(e.a, e.b) === GK.edgeKey(x, y));
        let why = "";
        if (a === d || c === b) why = "hurok lenne";
        else if (has(a, d) || has(c, b)) why = "többszörös él lenne";
        const L = l => vb.nodes[l].label;
        if (!why) { E[i] = { a, b: d, w: 1 }; E[j] = { a: c, b, w: 1 }; }
        if (show) {
          last = { old: [[a, b], [c, d]], neu: [[a, d], [c, b]], ok: !why };
          drawB(why ? `Kísérlet: ${L(a)}–${L(b)} és ${L(c)}–${L(d)} → ${L(a)}–${L(d)} és ${L(c)}–${L(b)}: <b>elvetve</b> (${why}).`
                    : `Csere: ${L(a)}–${L(b)} és ${L(c)}–${L(d)} → <b>${L(a)}–${L(d)}</b> és <b>${L(c)}–${L(b)}</b>.`);
        }
      }
      function drawB(msg) {
        vb.hlE = new Set();
        vb.edges.forEach(e => (e.dash = null));
        if (last && last.ok) last.neu.forEach(([x, y]) => vb.hlE.add(GK.edgeKey(x, y)));
        const n = vb.nodes.length, dg = degreeC(n, vb.edges), T = triangles(n, vb.edges), comp = components(n, vb.edges);
        vb.nodes.forEach((nd, i) => (nd.badge = dg[i]));
        vb.draw();
        if (last && !last.ok) {                                         // az elvetett új élek szaggatottan
          const ctx = vb.ctx; ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = GK.css("--bad"); ctx.lineWidth = 2;
          last.neu.forEach(([x, y]) => { const [x1, y1] = vb.px(vb.nodes[x]), [x2, y2] = vb.px(vb.nodes[y]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
          ctx.restore();
        }
        const same = dg.every((k, i) => k === deg0[i]);
        infoB.innerHTML = `${msg}<br>Fokszámok: (${dg.join(", ")}) ${same ? "– <b>változatlanok</b> ✔" : ""} · háromszögek: <b>${T.list.length}</b> · komponensek: <b>${comp.sizes.length}</b>` +
          (keyB === "star" ? "<br><span class=\"muted\">A csillagon minden csere hurkot adna – ez az egyetlen egyszerű gráf ezzel a fokszámsorozattal.</span>" : "");
      }
      load(); loadB();
    };

    /* ------------------------------------------------------------------
       7.6  null-model-lab – az Árvízhét három nullmodellel
       ------------------------------------------------------------------ */
    W["null-model-lab"] = root => {
      header(root, "Nullmodell-labor: sok ez – mihez képest?",
        "Válassz egy mérőszámot és egy nullmodellt, és sorsolj 1000 véletlen változatot. A hisztogram a nullmodell eloszlása, a piros vonal a megfigyelt érték. " +
        "Szereplőpárt az élre (vagy két csúcsra) kattintva választhatsz.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.48;
      const A = preset("arviz", aspect);
      const OBS = project(ARTICLE_ROWS, 7);
      const cS = h("div", { class: "controls" }), cN = h("div", { class: "controls" });
      root.append(cS);
      let stat = "pair", nul = "bip", pair = [3, 4], samples = null, tok = 0, seed = 1;
      const STATS = [["pair", "egy pár közös cikkei"], ["tri", "háromszögek száma"], ["edges", "különböző párok (élek) száma"]];
      const NULLS = { gnm: "G(n, m)", conf: "fokszámtartó élcsere", hyp: "hipergeometrikus (csak a két szereplő gyakorisága)", bip: "páros: cikk–szereplő csere" };
      const paintS = toggleGroup(cS, STATS, stat, v => { stat = v; fixNull(); reset(); });
      const grid = h("div", { class: narrow ? "" : "two-col" }), left = h("div"), right = h("div");
      grid.append(left, right); root.append(grid);
      left.append(h("div", { class: "muted", style: "font-size:.88rem;margin:.1rem 0" }, "megfigyelt gráf (szám: közös cikkek)"));
      right.append(h("div", { class: "muted", style: "font-size:.88rem;margin:.1rem 0" }, "a legutóbbi véletlen változat"));
      const bL = h("div"), bR = h("div"); left.append(bL); right.append(bR);
      const vo = { aspect, radius: narrow ? 13 : 14, showWeights: true, maxW: narrow ? 760 : 380 };
      const vL = new GK.View(bL, Object.assign({}, vo, { nodes: A.nodes.map(nd => ({ label: nd.label, x: nd.x, y: liftY(nd.y) })), edges: A.edges.map(e => ({ ...e })),
        onEdgeClick: i => { const e = vL.edges[i]; pair = [e.a, e.b]; if (stat !== "pair") { stat = "pair"; paintS(stat); fixNull(); } reset(); },
        onNodeClick: i => { if (pair.length === 2 || pair.includes(i)) pair = [i]; else pair = pair.concat(i); if (pair.length === 2) { if (stat !== "pair") { stat = "pair"; paintS(stat); fixNull(); } reset(); } else { mark(); } } }));
      const vR = new GK.View(bR, Object.assign({}, vo, { nodes: A.nodes.map(nd => ({ label: nd.label, x: nd.x, y: liftY(nd.y) })), edges: [] }));
      root.append(cN);
      const nullBtns = {};
      Object.entries(NULLS).forEach(([k, l]) => { nullBtns[k] = btn(l, () => { nul = k; paintN(); reset(); }); cN.append(nullBtns[k]); });
      const paintN = () => Object.entries(nullBtns).forEach(([k, b]) => { b.classList.toggle("on", k === nul); b.disabled = !allowed(k); });
      const allowed = k => (stat === "pair" ? k === "hyp" || k === "bip" : k !== "hyp");
      function fixNull() { if (!allowed(nul)) nul = stat === "pair" ? "bip" : "conf"; paintN(); }
      const cR = h("div", { class: "controls" }); root.append(cR);
      const runB = btn("1000 véletlen változat", () => run(), "btn primary"), prog = h("span", { class: "muted", style: "font-size:.9rem;font-family:var(--mono)" });
      cR.append(runB, prog);
      const hist = h("div"), info = h("div", { class: "readout" });
      root.append(hist, info);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" }); root.append(lesson);

      const labOf = i => texLab(actorIds[i]);
      function observed() {
        if (stat === "pair") return OBS.W[pair[0]][pair[1]];
        if (stat === "tri") return triangles(7, OBS.edges).list.length;
        return OBS.edges.length;
      }
      function statOf(edges, Wm) {
        if (stat === "pair") return Wm ? Wm[pair[0]][pair[1]] : 0;
        if (stat === "tri") return triangles(7, edges).list.length;
        return edges.length;
      }
      function mark() {
        vL.hlE = new Set(stat === "pair" && pair.length === 2 ? [GK.edgeKey(pair[0], pair[1])] : []);
        vL.hl = new Set(stat === "pair" ? pair : []);
        vL.draw();
      }
      function reset() { tok++; samples = null; prog.textContent = ""; runB.disabled = false; mark(); paint(); }
      function freq(i) { return ARTICLE_ROWS.filter(r => r.includes(i)).length; }
      function exactHyp() {
        const N = ARTICLE_ROWS.length, a = freq(pair[0]), b = freq(pair[1]), out = [];
        for (let j = 0; j <= Math.min(a, b); j++) out.push([j, hyperPmf(N, a, b, j)]);
        return out;
      }
      function run() {
        if (stat === "pair" && pair.length !== 2) { info.innerHTML = "Előbb válassz egy szereplőpárt (élre vagy két csúcsra kattintva)."; return; }
        if (nul === "hyp") { samples = { exact: exactHyp() }; vR.setGraph(vR.nodes, []); paint(); return; }
        const t = ++tok, R = rng(100 * seed++ + Object.keys(NULLS).indexOf(nul)), N = 1000, out = [];
        const E0 = OBS.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        let lastG = null;
        runB.disabled = true;
        const step = () => {
          if (t !== tok) return;
          const t0 = performance.now();
          while (out.length < N && performance.now() - t0 < 25) {
            let edges, Wm = null;
            if (nul === "gnm") edges = gnm(7, E0.length, R);
            else if (nul === "conf") edges = rewire(7, E0, 100, R);
            else { const P = project(curveball(ARTICLE_ROWS, 60, R), 7); edges = P.edges; Wm = P.W; }
            out.push(statOf(edges, Wm)); lastG = edges;
          }
          prog.textContent = `${out.length} / ${N}`;
          if (out.length < N) setTimeout(step, 0);
          else {
            const c = {}; out.forEach(x => (c[x] = (c[x] || 0) + 1));
            samples = { raw: out, pmf: Object.entries(c).map(([v, k]) => [+v, k / N]).sort((x, y) => x[0] - y[0]) };
            vR.setGraph(vR.nodes, lastG.map(e => ({ a: e.a, b: e.b, w: e.w || 1 })));
            runB.disabled = false; prog.textContent = "kész";
            paint();
          }
        };
        prog.textContent = `0 / ${N}`;
        setTimeout(step, 0);
      }
      function paint() {
        const obs = observed();
        const what = stat === "pair" ? `a $${labOf(pair[0])}$–$${labOf(pair[1] ?? pair[0])}$ pár közös cikkei` : stat === "tri" ? "a háromszögek száma" : "a különböző szereplőpárok (élek) száma";
        const keeps = { gnm: "7 csúcs és 10 él", conf: "minden szereplő fokszáma a vetületben", hyp: "a két szereplő cikkszáma (12 cikkből)", bip: "minden cikk szereplőszáma és minden szereplő cikkszáma" }[nul];
        lesson.textContent = "";
        if (!samples) {
          hist.innerHTML = "";
          info.innerHTML = `Mérőszám: ${what} · megfigyelt: <b>${obs}</b><br>Nullmodell: <b>${NULLS[nul]}</b> – megtartja: ${keeps}. Nyomd meg a gombot!`;
          math(info); return;
        }
        const pmf = samples.exact || samples.pmf;
        const mu = pmf.reduce((s, [v, f]) => s + v * f, 0), sd = Math.sqrt(pmf.reduce((s, [v, f]) => s + (v - mu) ** 2 * f, 0));
        const ge = pmf.filter(([v]) => v >= obs).reduce((s, [, f]) => s + f, 0), le = pmf.filter(([v]) => v <= obs).reduce((s, [, f]) => s + f, 0);
        const N = samples.raw ? samples.raw.length : 0;
        const pGe = samples.exact ? ge : (1 + Math.round(ge * N)) / (1 + N), pLe = samples.exact ? le : (1 + Math.round(le * N)) / (1 + N);
        const z = sd > 1e-12 ? (obs - mu) / sd : NaN;
        hist.innerHTML = histSVG(pmf, obs, { narrow, exact: !!samples.exact, xlabel: stat === "pair" ? "közös cikkek száma" : stat === "tri" ? "háromszögek száma" : "különböző párok száma" });
        info.innerHTML = `Mérőszám: ${what} · megfigyelt: <b>${obs}</b> · nullmodell: <b>${NULLS[nul]}</b> (megtartja: ${keeps})` +
          `<br>átlag $\\bar x_0 = ${fmK(mu, 2)}$ · szórás $s_0 = ${fmK(sd, 2)}$ · $z = ${isFinite(z) ? fmK(z, 2) : "\\text{--}"}$` +
          `<br>${samples.exact ? "pontos" : "empirikus"} $p$: legalább ${obs}: $${fmK(pGe, 3)}$ · legfeljebb ${obs}: $${fmK(pLe, 3)}$` +
          (samples.exact ? "" : ` <span class="muted">($(1 + \\#)/(1 + N)$, $N = ${N}$)</span>`);
        math(info);
        if (stat === "tri" && nul === "bip") lesson.textContent = "A cikkek szerkezetéből több háromszög jönne: a valódi szereplők a saját köreikben maradnak.";
        else if (stat === "tri") lesson.textContent = "A vetületen futó nullmodell nem tudja, hogy a háromszereplős cikkek „gyári” háromszögeket adnak.";
        else if (stat === "pair" && nul === "bip" && pGe < 0.05) lesson.textContent = "Ehhez a nullmodellhez képest meglepő – de 21 pár közül egy-kettő véletlenül is ilyen lehet (többszörös tesztelés).";
        else if (stat === "pair" && nul === "hyp") lesson.textContent = "A hipergeometrikus modell nem tudja, hogy a cikkek kicsik – a páros nullmodellben ugyanez meglepőbb.";
      }
      fixNull(); mark(); paint();
    };
  }
  /* ==================================================================
     w2: 7.1–7.3 widgetjei (er-giant, watts-strogatz, ba-growth, degree-tail)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmtS = (x, d = 2) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmM = (x, d = 2) => fmtS(x, d).replace(",", "{,}").replace(MINUS, "-");   // KaTeX-be
    /* egész szám ezres tagolással (5 jegytől, nem törő szóközzel) */
    const big = x => { const s = String(Math.round(x)); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s; };
    /* valószínűség két értékes jeggyel: 0,0001 · 0,00013 · 0,032 · 0,32 · 1 */
    const fmtP = p => (p <= 0 ? "0" : p >= 1 ? "1" : fmt(p, Math.max(1, 1 - Math.floor(Math.log10(p) + 1e-9))));
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    /* láthatóság figyelése: fn(true / false) – a widget a képernyőn van-e (és a lap nem rejtett) */
    function watchVis(root, fn) {
      let inView = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; fn(inView && !document.hidden); })).observe(root);
      document.addEventListener("visibilitychange", () => fn(inView && !document.hidden));
    }
    const svgEl = (W_, H_, inner, label) =>
      `<svg viewBox="0 0 ${W_} ${H_}" style="width:100%;max-width:${W_}px;display:block;touch-action:manipulation" role="img" aria-label="${label}">${inner}</svg>`;
    const sv = c => `var(${c})`;
    /* címkeszín a háttér világossága szerint */
    function inkOf(c) {
      c = String(c);
      const m = c[0] === "#" ? [1, 3, 5].map(i => parseInt(c.length === 4 ? c[(i + 1) / 2].repeat(2) : c.slice(i, i + 2), 16)) : c.match(/[\d.]+/g);
      if (!m) return "#ffffff";
      const [r, g, b] = m.slice(0, 3).map(Number), L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return L > 0.6 ? "#1b1f27" : "#ffffff";
    }
    const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
    const decLab = e => (e >= -3 ? fmt(Math.pow(10, e), 3) : "10" + String(e).split("").map(c => SUP[c]).join(""));
    /* saját vászon (sok kis csúcshoz gyorsabb, mint a View) */
    function canvasBox(parent, aspect, maxW = 760) {
      const c = h("canvas", { style: "display:block;touch-action:manipulation" });
      parent.append(c);
      const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, aspect, onResize: null };
      o.resize = () => {
        const w = Math.min(maxW, parent.clientWidth || 340), hh = Math.round(w * o.aspect), dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); c.style.width = w + "px"; c.style.height = hh + "px";
        o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); o.w = w; o.h = hh;
        if (o.onResize) o.onResize();
      };
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(o.resize, 150); });
      o.resize();
      return o;
    }
    /* union–find a komponensmérettel */
    function makeUF(n) {
      const p = new Int32Array(n), s = new Int32Array(n).fill(1);
      for (let i = 0; i < n; i++) p[i] = i;
      const f = x => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
      return { f, s, union(a, b) { a = f(a); b = f(b); if (a === b) return s[a]; if (s[a] < s[b]) [a, b] = [b, a]; p[b] = a; s[a] += s[b]; return s[a]; } };
    }
    /* G(n, m) elutasításos mintavétellel (ritka gráfra gyors) */
    function sparseGnm(n, m, R) {
      const seen = new Set(), E = [];
      while (E.length < m) {
        const a = Math.floor(R() * n), b = Math.floor(R() * n);
        if (a === b) continue;
        const k = a < b ? a * n + b : b * n + a;
        if (seen.has(k)) continue;
        seen.add(k); E.push({ a: Math.min(a, b), b: Math.max(a, b), w: 1 });
      }
      return E;
    }
    /* a politikai blogok irányítatlanul: a kölcsönös linkpár egy él, hurok nincs */
    let PBU = null;
    function polblogsU() {
      if (PBU) return PBU;
      const P = window.POLBLOGS, seen = new Set(), E = [];
      for (let i = 0; i < P.edges.length; i += 2) {
        const a = P.edges[i], b = P.edges[i + 1];
        if (a === b) continue;
        const k = GK.edgeKey(a, b);
        if (!seen.has(k)) { seen.add(k); E.push({ a, b, w: 1 }); }
      }
      return (PBU = { n: P.n, edges: E });
    }
    /* legkisebb négyzetes egyenes: y = icpt + slope · x */
    function lsFit(xs, ys) {
      const n = xs.length; if (n < 2) return { slope: NaN, icpt: NaN };
      const mx = xs.reduce((s, x) => s + x, 0) / n, my = ys.reduce((s, x) => s + x, 0) / n;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
      const slope = sxx ? sxy / sxx : NaN;
      return { slope, icpt: my - slope * mx };
    }
    /* az óriáskomponens elméleti aránya: S = 1 − e^{−cS} (fixpont-iterációval; c ≤ 1-nél 0) */
    function giantS(c) {
      if (c <= 1) return 0;
      let S = 1;
      for (let t = 0; t < 2000; t++) { const S2 = 1 - Math.exp(-c * S); if (Math.abs(S2 - S) < 1e-12) return S2; S = S2; }
      return S;
    }
    /* erőirányított szimuláció egy lépése (P: [x0, y0, x1, y1, …], V: sebesség, E: [[a, b], …])
       o: { rep, spr, len, g, gy (függőleges gravitációs szorzó), w, hgt (a doboz), alpha } */
    function forceTick(P, V, n, E, o) {
      const F = new Float64Array(2 * n), rep = o.rep;
      for (let i = 0; i < n; i++) {
        const xi = P[2 * i], yi = P[2 * i + 1];
        for (let j = i + 1; j < n; j++) {
          let dx = xi - P[2 * j], dy = yi - P[2 * j + 1], d2 = dx * dx + dy * dy;
          if (d2 < 1e-9) { dx = 1e-4 * ((i * 7 + j * 13) % 11 - 5); dy = 1e-4 * ((i * 3 + j) % 7 - 3); d2 = dx * dx + dy * dy + 1e-12; }
          const f = rep / d2;
          F[2 * i] += dx * f; F[2 * i + 1] += dy * f; F[2 * j] -= dx * f; F[2 * j + 1] -= dy * f;
        }
      }
      for (const [a, b] of E) {
        const dx = P[2 * b] - P[2 * a], dy = P[2 * b + 1] - P[2 * a + 1], d = Math.sqrt(dx * dx + dy * dy) || 1e-6;
        const f = o.spr * (d - o.len) / d;
        F[2 * a] += dx * f; F[2 * a + 1] += dy * f; F[2 * b] -= dx * f; F[2 * b + 1] -= dy * f;
      }
      const cx = o.w / 2, cy = o.hgt / 2, mg = 0.02, vmax = 0.03;
      for (let i = 0; i < n; i++) {
        F[2 * i] += o.g * (cx - P[2 * i]); F[2 * i + 1] += o.g * o.gy * (cy - P[2 * i + 1]);
        let vx = (V[2 * i] + F[2 * i] * o.alpha) * 0.55, vy = (V[2 * i + 1] + F[2 * i + 1] * o.alpha) * 0.55;
        const sp = Math.hypot(vx, vy); if (sp > vmax) { vx *= vmax / sp; vy *= vmax / sp; }
        V[2 * i] = vx; V[2 * i + 1] = vy;
        P[2 * i] = Math.min(o.w - mg, Math.max(mg, P[2 * i] + vx));
        P[2 * i + 1] = Math.min(o.hgt - mg, Math.max(mg, P[2 * i + 1] + vy));
      }
    }
    /* log–log tengelyek SVG-ben: x ∈ [x0, x1], y ∈ [y0, y1] (pozitív értékek) */
    function logAxes(Wd, Ht, x0, x1, y0, y1, { L = 46, R = 12, T = 12, B = 34, xlab = "", ylab = "" } = {}) {
      const lx0 = Math.log10(x0), lx1 = Math.log10(x1), ly0 = Math.log10(y0), ly1 = Math.log10(y1);
      const X = x => L + (Math.log10(x) - lx0) / (lx1 - lx0) * (Wd - L - R), Y = y => Ht - B - (Math.log10(y) - ly0) / (ly1 - ly0) * (Ht - T - B);
      let g = "";
      for (let e = Math.ceil(lx0 - 1e-9); e <= lx1 + 1e-9; e++) {
        const x = X(Math.pow(10, e));
        g += `<line x1="${x}" y1="${T}" x2="${x}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.7"/>` +
          `<text x="${x}" y="${Ht - B + 14}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${big(Math.pow(10, e))}</text>`;
        for (let t = 2; t <= 9; t++) { const v = t * Math.pow(10, e); if (v > x0 && v < x1) g += `<line x1="${X(v)}" y1="${Ht - B}" x2="${X(v)}" y2="${Ht - B + 3}" stroke="${sv("--muted")}" stroke-width="0.6"/>`; }
      }
      for (let e = Math.ceil(ly0 - 1e-9); e <= ly1 + 1e-9; e++) {
        const y = Y(Math.pow(10, e));
        g += `<line x1="${L}" y1="${y}" x2="${Wd - R}" y2="${y}" stroke="${sv("--border")}" stroke-width="0.7"/>` +
          `<text x="${L - 5}" y="${y + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--muted")}">${decLab(e)}</text>`;
      }
      g += `<rect x="${L}" y="${T}" width="${Wd - L - R}" height="${Ht - T - B}" fill="none" stroke="${sv("--border")}"/>` +
        `<text x="${(L + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">${xlab}</text>` +
        `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">${ylab}</text>`;
      return { X, Y, g, L, R, T, B, inX: x => x >= x0 * 0.999 && x <= x1 * 1.001, inY: y => y >= y0 * 0.999 && y <= y1 * 1.001 };
    }
    /* egyenes a log–log síkon: y = y_a · (x / x_a)^s, a dobozra vágva */
    function powLine(A, xa, ya, s, xs, xe) {
      const pts = [];
      for (let t = 0; t <= 40; t++) {
        const x = xs * Math.pow(xe / xs, t / 40), y = ya * Math.pow(x / xa, s);
        if (A.inY(y)) pts.push(A.X(x).toFixed(1) + "," + A.Y(y).toFixed(1));
      }
      return pts.join(" ");
    }

    /* ------------------------------------------------------------------
       7.1  er-giant – az óriáskomponens megszületése G(n, p)-ben
       ------------------------------------------------------------------ */
    W["er-giant"] = root => {
      header(root, "Az óriáskomponens születése: G(n, p), n = 200",
        "Minden csúcspárhoz egyszer kisorsoltam egy $u_{ij}\\in[0;1)$ számot; az él akkor van bent, ha $u_{ij} < p$, ahol $p = \\langle k\\rangle/(n-1)$. " +
        "Így a csúszka jobbra húzva csak <b>hozzáad</b> éleket – figyeld, hogyan nőnek össze a szigetek. " +
        "<span style=\"color:var(--accent)\">●</span> a legnagyobb komponens, <span style=\"color:var(--setB)\">●</span> a második, szürke a többi, halvány az izolált csúcs.");
      math(root.querySelector(".w-sub"));
      const n = 200, NP = n * (n - 1) / 2, narrow = root.clientWidth < 560, aspect = narrow ? 0.95 : 0.55;
      let seed = 1, kbar = 0.5, SA, SB, SU, curve = [], st = null;
      const ctr = h("div", { class: "controls" });
      const kVal = h("b", { style: "font-family:var(--mono);min-width:2.4em" });
      const sl = h("input", { type: "range", min: 0, max: 5, step: 0.1, value: kbar, "aria-label": "átlagos fokszám", style: "width:13rem;max-width:52vw",
        oninput: () => setK(+sl.value) });
      ctr.append(h("label", null, "⟨k⟩ =", sl, kVal), btn("Új sorsolás", () => { seed++; resample(); }));
      root.append(ctr);
      const box = h("div");
      root.append(box);
      const cv = canvasBox(box, aspect);
      const chart = h("div", { style: "margin-top:.4rem;cursor:pointer" });
      const info = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "⟨k⟩ = 1-nél a véletlen gráf hirtelen »összeáll«: átlagosan egy szomszéd elég ahhoz, hogy a szigetek egy óriáskomponenssé nőjenek.");
      root.append(chart, info, lesson);
      /* a szimuláció állapota (világkoordináták: [0;1] × [0;aspect]) */
      const P = new Float64Array(2 * n), V = new Float64Array(2 * n);
      let alpha = 0, raf = 0, vis = true;

      function sample() {
        const R = rng(seed * 7919 + 1), u = new Float64Array(NP), a = new Int16Array(NP), b = new Int16Array(NP);
        let t = 0;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { a[t] = i; b[t] = j; u[t] = R(); t++; }
        const idx = Array.from({ length: NP }, (_, i) => i).sort((x, y) => u[x] - u[y]);
        SA = Int16Array.from(idx, i => a[i]); SB = Int16Array.from(idx, i => b[i]); SU = Float64Array.from(idx, i => u[i]);
        /* a teljes görbe ugyanazokból az u-kból: ⟨k⟩ = 0 … 5, 0,025-ös lépéssel */
        const uf = makeUF(n); let best = 1, e = 0;
        curve = [];
        for (let g = 0; g <= 200; g++) {
          const th = g * 0.025 / (n - 1);
          while (e < NP && SU[e] < th) { best = Math.max(best, uf.union(SA[e], SB[e])); e++; }
          curve.push([g * 0.025, best / n]);
        }
        /* új kezdő elrendezés */
        for (let i = 0; i < n; i++) { P[2 * i] = 0.05 + 0.9 * R(); P[2 * i + 1] = aspect * (0.05 + 0.9 * R()); V[2 * i] = V[2 * i + 1] = 0; }
      }
      const mOf = p => { let lo = 0, hi = NP; while (lo < hi) { const md = (lo + hi) >> 1; if (SU[md] < p) lo = md + 1; else hi = md; } return lo; };
      function compute() {
        const p = kbar / (n - 1), m = mOf(p), uf = makeUF(n), E = [];
        for (let e = 0; e < m; e++) { uf.union(SA[e], SB[e]); E.push([SA[e], SB[e]]); }
        const root_ = Array.from({ length: n }, (_, i) => uf.f(i)), size = root_.map(r => uf.s[r]);
        const roots = [...new Set(root_)].sort((x, y) => uf.s[y] - uf.s[x] || x - y);
        st = { p, m, E, root: root_, size, r1: roots[0], r2: roots.length > 1 ? roots[1] : -1,
          s1: uf.s[roots[0]], s2: roots.length > 1 ? uf.s[roots[1]] : 0, iso: size.filter(s => s === 1).length };
      }
      const simOpts = () => ({ rep: 0.17 * 0.05 / n, spr: 0.12, len: 0.022, g: 0.05, gy: 1 / aspect, w: 1, hgt: aspect, alpha });
      function tick() { forceTick(P, V, n, st.E, simOpts()); alpha *= 0.985; }
      function frame() {
        raf = 0;
        if (!vis) return;
        tick(); tick(); draw();
        if (alpha > 0.02) raf = requestAnimationFrame(frame);
      }
      const kick = () => { if (!raf && vis && alpha > 0.02) raf = requestAnimationFrame(frame); };
      function draw() {
        const ctx = cv.ctx, Wd = cv.w, Ht = cv.h, sc = Wd;   // világ → képpont
        ctx.clearRect(0, 0, Wd, Ht);
        if (!st) return;
        const cGi = GK.css("--accent"), c2 = GK.css("--setB"), cOt = mixColor("--card", "--muted", 0.8), cIs = mixColor("--card", "--muted", 0.38);
        const eGi = mixColor("--card", "--accent", 0.55), eOt = mixColor("--card", "--muted", 0.55);
        const r = Wd < 500 ? 2.7 : 3.3;
        ctx.lineWidth = 1;
        st.E.forEach(([a, b]) => {
          ctx.strokeStyle = st.root[a] === st.r1 && st.s1 > 1 ? eGi : eOt;
          ctx.beginPath(); ctx.moveTo(P[2 * a] * sc, P[2 * a + 1] * sc); ctx.lineTo(P[2 * b] * sc, P[2 * b + 1] * sc); ctx.stroke();
        });
        for (let i = 0; i < n; i++) {
          const rt = st.root[i];
          ctx.fillStyle = st.size[i] === 1 ? cIs : rt === st.r1 ? cGi : rt === st.r2 ? c2 : cOt;
          ctx.beginPath(); ctx.arc(P[2 * i] * sc, P[2 * i + 1] * sc, st.size[i] === 1 ? r * 0.8 : r, 0, 2 * Math.PI); ctx.fill();
        }
      }
      cv.onResize = draw;
      function plot() {
        const Wd = narrow ? 360 : 600, Ht = narrow ? 230 : 240, L = 40, R = 14, T = 12, B = 34;
        const X = k => L + k / 5 * (Wd - L - R), Y = s => Ht - B - s * (Ht - T - B);
        let g = "";
        for (let k = 0; k <= 5; k++) g += `<line x1="${X(k)}" y1="${T}" x2="${X(k)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${X(k)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${k}</text>`;
        for (let s = 0; s <= 1.001; s += 0.25) g += `<line x1="${L}" y1="${Y(s)}" x2="${Wd - R}" y2="${Y(s)}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${L - 5}" y="${Y(s) + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--muted")}">${fmt(s, 2)}</text>`;
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">⟨k⟩ (átlagos fokszám)</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">arány (n-hez képest)</text>`;
        /* kritikus pont */
        g += `<line x1="${X(1)}" y1="${T}" x2="${X(1)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="1.3" stroke-dasharray="5 4"/>` +
          `<text x="${X(1) + 4}" y="${T + 11}" font-size="10.5" fill="${sv("--bad")}">kritikus pont</text>`;
        /* izolált csúcsok aránya: e^{−⟨k⟩} */
        const iso = [], th = [];
        for (let t = 0; t <= 250; t++) { const k = t / 50; iso.push(X(k).toFixed(1) + "," + Y(Math.exp(-k)).toFixed(1)); th.push(X(k).toFixed(1) + "," + Y(giantS(k)).toFixed(1)); }
        g += `<polyline points="${iso.join(" ")}" fill="none" stroke="${sv("--muted")}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
        g += `<polyline points="${th.join(" ")}" fill="none" stroke="${sv("--setC")}" stroke-width="2.4"/>`;
        g += `<polyline points="${curve.map(([k, s]) => X(k).toFixed(1) + "," + Y(s).toFixed(1)).join(" ")}" fill="none" stroke="${sv("--accent")}" stroke-width="1.6" stroke-opacity="0.85"/>`;
        g += `<line x1="${X(kbar)}" y1="${T}" x2="${X(kbar)}" y2="${Ht - B}" stroke="${sv("--accent")}" stroke-width="0.8" stroke-opacity="0.5"/>` +
          `<circle cx="${X(kbar)}" cy="${Y(st.s1 / n)}" r="5.5" fill="${sv("--accent")}" stroke="${sv("--card")}" stroke-width="2"/>`;
        const lx = Wd - R - 6;
        g += `<text x="${lx}" y="${Y(0.5) + 4}" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--setC")}">— elmélet: S = 1 − e^(−⟨k⟩S)</text>` +
          `<text x="${lx}" y="${Y(0.5) + 19}" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--accent")}">— ez a sorsolás (n = 200)</text>` +
          `<text x="${lx}" y="${Y(0.5) + 34}" text-anchor="end" font-size="11" fill="${sv("--muted")}">- - izolált csúcsok: e^(−⟨k⟩)</text>`;
        chart.innerHTML = svgEl(Wd, Ht, g, "a legnagyobb komponens aránya az átlagos fokszám függvényében") +
          `<div class="muted" style="font-size:.8rem">Az ábrára kattintva / húzva is állíthatod ⟨k⟩-t. A teljes összefüggéshez ⟨k⟩ ≈ ln n ≈ 5,3 kell – ez már túl van az ábra jobb szélén.</div>`;
        chart._X = { Wd, L, R };
      }
      /* kattintás / húzás a görbén */
      let dragging = false;
      const fromEvent = ev => {
        const s = chart.querySelector("svg"); if (!s) return;
        const rc = s.getBoundingClientRect(), { Wd, L, R } = chart._X, x = (ev.clientX - rc.left) / rc.width * Wd;
        const k = Math.round(Math.max(0, Math.min(5, (x - L) / (Wd - L - R) * 5)) * 10) / 10;
        if (k !== kbar) { sl.value = k; setK(k); }
      };
      chart.addEventListener("pointerdown", ev => { if (ev.target.closest("svg")) { dragging = true; fromEvent(ev); } });
      addEventListener("pointermove", ev => { if (dragging) fromEvent(ev); });
      addEventListener("pointerup", () => (dragging = false));
      function readout() {
        const p = st.p, S = st.s1 / n, Sth = giantS(kbar);
        let s = `$\\langle k\\rangle = ${fmM(kbar, 1)}$ · $p = ${fmM(p, 5)}$ · élek: <b>${st.m}</b> (várható: $p\\binom{n}{2} = ${fmM(p * NP, 1)}$)` +
          `<br>legnagyobb komponens: <b>${st.s1}</b> csúcs ($S = ${fmM(S, 3)}$; elmélet $${fmM(Sth, 3)}$) · második legnagyobb: <b>${st.s2}</b>` +
          `<br>izolált csúcs: <b>${st.iso}</b> (elmélet: $n e^{-\\langle k\\rangle} = ${fmM(n * Math.exp(-kbar), 1)}$)`;
        if (kbar < 0.85) s += "<br><b>⟨k⟩ &lt; 1: csak kis szigetek</b> – a legnagyobb komponens is elenyésző része a gráfnak.";
        else if (kbar <= 1.15) s += "<br><b>⟨k⟩ ≈ 1: kritikus pont – a szigetek összeérnek.</b> Itt a legnagyobb a sorsolások közti szórás.";
        else s += `<br><b>⟨k⟩ &gt; 1: van óriáskomponens</b> – a csúcsok ${fmt(100 * S, 0)}%-a egy komponensben.`;
        info.innerHTML = s;
        math(info);
      }
      function setK(k) {
        kbar = k; kVal.textContent = fmt(k, 1);
        compute(); plot(); readout();
        alpha = Math.max(alpha, 0.5); draw(); kick();
      }
      /* új sorsolás: új u-k, új kezdő elrendezés, előre elrendezve */
      function resample() { sample(); setK(kbar); alpha = 1; for (let t = 0; t < 160; t++) tick(); draw(); kick(); }
      resample();
      watchVis(root, v => { vis = v; if (v) kick(); });
      onTheme(() => { draw(); });
    };

    /* ------------------------------------------------------------------
       7.2  watts-strogatz – átkötés: C(p)/C(0) és L(p)/L(0)
       ------------------------------------------------------------------ */
    W["watts-strogatz"] = root => {
      header(root, "Watts–Strogatz: néhány hosszú ugrás",
        "Gyűrűrács: $n = 20$ csúcs körben, mindegyik a $k = 4$ legközelebbi szomszédjával. Minden élt $p$ valószínűséggel átkötünk egy véletlen csúcshoz. " +
        "Élenként egyszer sorsoltam egy $u_e$ számot és az új végpontok sorrendjét: az él akkor kötődik át, ha $u_e < p$ – így a csúszka jobbra csak <b>több</b> átkötést hoz. " +
        "Az ábra ugyanezt nagyban mutatja ($n = 1000$, $k = 10$): a klaszterezettség és az átlagos úthossz a $p = 0$ értékhez viszonyítva, logaritmikus $p$-tengelyen.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const PS = [0, ...Array.from({ length: 41 }, (_, i) => Math.pow(10, -4 + i / 10))];
      let pi = 0, seedS = 1;
      const ctr = h("div", { class: "controls" });
      const pVal = h("b", { style: "font-family:var(--mono);min-width:4.2em" });
      const sl = h("input", { type: "range", min: 0, max: PS.length - 1, step: 1, value: pi, "aria-label": "átkötési valószínűség", style: "width:13rem;max-width:52vw",
        oninput: () => { pi = +sl.value; update(); } });
      ctr.append(h("label", null, "p =", sl, pVal), btn("Új sorsolás", () => { seedS++; sampleS(); update(); }));
      root.append(ctr);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const left = h("div"), right = h("div");
      grid.append(left, right);
      root.append(grid);
      const boxS = h("div");
      const infoS = h("div", { class: "readout" });
      left.append(boxS, infoS);
      const chart = h("div"), prog = h("div", { class: "muted", style: "font-size:.85rem" }), infoB = h("div", { class: "readout" });
      const tblBox = h("details", { style: "margin-top:.4rem;font-size:.9rem" });
      right.append(chart, prog, infoB, tblBox);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Néhány hosszú ugrás (p ≈ 0,01) az utakat ötödére rövidíti, a háromszögekhez alig nyúl: ez a kisvilág.");
      root.append(lesson);

      /* ---------- kis gráf ---------- */
      const n = 20, k = 4, base = ringLattice(n, k);
      let U = [], CAND = [];
      function sampleS() {
        const R = rng(seedS * 31 + 5);
        U = base.map(() => R());
        CAND = base.map(() => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; });
      }
      function buildS(p) {
        const E = base.map(e => ({ a: e.a, b: e.b, w: 1 })), has = new Set(E.map(e => GK.edgeKey(e.a, e.b))), rew = new Set();
        E.forEach((e, i) => {
          if (U[i] >= p) return;
          for (const c of CAND[i]) {
            if (c === e.a || has.has(GK.edgeKey(e.a, c))) continue;
            has.delete(GK.edgeKey(e.a, e.b)); e.b = c; has.add(GK.edgeKey(e.a, c)); rew.add(i); break;
          }
        });
        return { E, rew };
      }
      const nodes = GK.circleLayout(n).map(([x, y]) => ({ label: "", x, y }));
      const view = new GK.View(boxS, { aspect: 1, radius: narrow ? 6 : 7, draggable: false, nodes, edges: [] });
      const S0 = (() => { const E = ringLattice(n, k); return { C: clusteringStats(n, E).avg, L: avgPath(n, E).L }; })();

      /* ---------- nagy görbe (n = 1000, k = 10), darabolva ---------- */
      const NB = 1000, KB = 10, RUNS = 3, PB = [1e-4, 2e-4, 5e-4, 1e-3, 2e-3, 5e-3, 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 1];
      const ring = ringLattice(NB, KB), C0 = clusteringStats(NB, ring).avg, L0 = avgPath(NB, ring, 60, rng(1)).L;
      const res = PB.map(() => ({ C: [], L: [] }));
      /* kis p-nél kevés a hosszú ugrás, nagy a sorsolások közti szórás: ott 2 × RUNS sorsolás */
      const TASKS = [];
      for (let r = 0; r < 2 * RUNS; r++) PB.forEach((p, j) => { if (r < RUNS || p <= 0.005) TASKS.push([j, r]); });
      let started = false, done = 0;
      const total = TASKS.length;
      function startCurve() {
        if (started) return;
        started = true;
        let t = 0;
        const step = () => {
          const t0 = performance.now();
          while (t < total && performance.now() - t0 < 30) {
            const [j, r] = TASKS[t], R = rng(1000 + 97 * r + j);
            const { edges } = wattsStrogatz(NB, KB, PB[j], R);
            res[j].C.push(clusteringStats(NB, edges).avg / C0);
            res[j].L.push(avgPath(NB, edges, 60, R).L / L0);
            t++;
          }
          done = t;
          plot(); readB();
          if (t < total) setTimeout(step, 0);
        };
        setTimeout(step, 0);
      }
      const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
      function plot() {
        const Wd = narrow ? 360 : 400, Ht = narrow ? 250 : 280, L = 38, R = 12, T = 12, B = 34;
        const X = p => L + (Math.log10(p) + 4) / 4 * (Wd - L - R), Y = y => Ht - B - y / 1.05 * (Ht - T - B);
        let g = "";
        for (let e = -4; e <= 0; e++) g += `<line x1="${X(10 ** e)}" y1="${T}" x2="${X(10 ** e)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.6"/>` +
          `<text x="${X(10 ** e)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${fmtP(10 ** e)}</text>`;
        for (let y = 0; y <= 1.001; y += 0.2) g += `<line x1="${L}" y1="${Y(y)}" x2="${Wd - R}" y2="${Y(y)}" stroke="${sv("--border")}" stroke-width="0.6"/>` +
          `<text x="${L - 5}" y="${Y(y) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(y, 1)}</text>`;
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">p (átkötési valószínűség, log-skála)</text>`;
        const series = (key, col, shape) => {
          const pts = PB.map((p, j) => (res[j][key].length ? [X(p), Y(mean(res[j][key]))] : null)).filter(Boolean);
          let s = `<polyline points="${pts.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ")}" fill="none" stroke="${sv(col)}" stroke-width="2"/>`;
          pts.forEach(([x, y]) => (s += shape === "o" ? `<circle cx="${x}" cy="${y}" r="3.6" fill="${sv(col)}"/>` : `<rect x="${x - 3.4}" y="${y - 3.4}" width="6.8" height="6.8" fill="${sv(col)}"/>`));
          return s;
        };
        g += series("C", "--accent", "o") + series("L", "--setB", "s");
        const p = PS[pi], xp = p > 0 ? X(Math.max(1e-4, p)) : L;
        g += `<line x1="${xp}" y1="${T}" x2="${xp}" y2="${Ht - B}" stroke="${sv("--text")}" stroke-width="1.2" stroke-dasharray="4 3"/>` +
          `<text x="${Math.min(xp + 4, Wd - R - 60)}" y="${Ht - B - 6}" font-size="10.5" fill="${sv("--text")}">p = ${fmtP(p)}</text>`;
        g += `<text x="${L + 6}" y="${Y(0.32)}" font-size="11" font-weight="600" fill="${sv("--accent")}">● C(p)/C(0)</text>` +
          `<text x="${L + 6}" y="${Y(0.32) + 15}" font-size="11" font-weight="600" fill="${sv("--setB")}">■ L(p)/L(0)</text>`;
        chart.innerHTML = svgEl(Wd, Ht, g, "Watts–Strogatz-ábra: klaszterezettség és úthossz az átkötési valószínűség függvényében");
        prog.textContent = done < total ? `számolás: ${done} / ${total} gráf (n = 1000, k = 10)…` : `pontonként ${RUNS} (p ≤ 0,005-nél ${2 * RUNS}) sorsolás átlaga; L: 60 kiinduló csúcsból becsülve.`;
        /* számtáblázat */
        tblBox.innerHTML = `<summary>Számértékek (n = 1000, k = 10)</summary><div class="tw"><table><tr><th>p</th><th>C/C(0)</th><th>L/L(0)</th></tr>` +
          PB.map((p, j) => `<tr><td>${fmtP(p)}</td><td>${res[j].C.length ? fmt(mean(res[j].C), 3) : "…"}</td><td>${res[j].L.length ? fmt(mean(res[j].L), 3) : "…"}</td></tr>`).join("") +
          `</table></div>`;
      }
      /* log-lineáris interpoláció a kiszámolt pontok között */
      function interp(key, p) {
        if (p <= PB[0]) return 1 + (res[0][key].length ? (mean(res[0][key]) - 1) * Math.max(0, p / PB[0]) : 0);
        for (let j = 1; j < PB.length; j++) if (p <= PB[j] * 1.0001) {
          if (!res[j][key].length || !res[j - 1][key].length) return NaN;
          const t = (Math.log10(p) - Math.log10(PB[j - 1])) / (Math.log10(PB[j]) - Math.log10(PB[j - 1]));
          return mean(res[j - 1][key]) + t * (mean(res[j][key]) - mean(res[j - 1][key]));
        }
        return NaN;
      }
      function readB() {
        const p = PS[pi], c = interp("C", p), l = interp("L", p);
        infoB.innerHTML = `Nagyban: $C(0) = ${fmM(C0, 3)}$, $L(0) = ${fmM(L0, 2)}$` +
          `<br>$p = ${fmtP(p).replace(",", "{,}")}$: $C/C(0) \\approx ${isFinite(c) ? fmM(c, 2) : "\\dots"}$, $L/L(0) \\approx ${isFinite(l) ? fmM(l, 2) : "\\dots"}$`;
        math(infoB);
      }
      function update() {
        const p = PS[pi];
        pVal.textContent = fmtP(p);
        const { E, rew } = buildS(p);
        view.setGraph(nodes, E.map((e, i) => ({ a: e.a, b: e.b, w: 1, color: rew.has(i) ? "--accent" : null, width: rew.has(i) ? 2.6 : 1.6 })));
        const C = clusteringStats(n, E).avg, A = avgPath(n, E);
        infoS.innerHTML = `Kis gráf: átkötött élek: <b>${rew.size}</b> / ${E.length}` +
          `<br>$C = ${fmM(C, 3)}$ ($C/C(0) = ${fmM(C / S0.C, 2)}$)` +
          `<br>$L = ${fmM(A.L, 2)}$ ($L/L(0) = ${fmM(A.L / S0.L, 2)}$)` + (A.giant < n ? ` · az óriáskomponensen (${A.giant} csúcs)` : "");
        math(infoS);
        plot(); readB();
      }
      sampleS();
      update();
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) startCurve(); })).observe(root);
      else startCurve();
    };

    /* ------------------------------------------------------------------
       7.3  ba-growth – Barabási–Albert: növekedés + preferenciális kapcsolódás
       ------------------------------------------------------------------ */
    W["ba-growth"] = root => {
      header(root, "Barabási–Albert: a gazdag gazdagabb lesz",
        "Teljes gráfból indulunk (legalább háromszögből), és lépésenként jön egy új csúcs $m$ éllel. <b>Preferenciálisan</b> az $i$-edik régi csúcsot " +
        "$\\Pi_i = k_i/\\sum_j k_j$ eséllyel választja; <b>egyenletesen</b> minden régi csúcsot ugyanakkora eséllyel. A csúcs mérete a fokszámmal nő, " +
        "a színe (preferenciálisan) azt mutatja, mekkora eséllyel kapja a következő élt. <span style=\"color:var(--setB)\">●</span> a legújabb csúcs és élei.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.9 : 0.55, MAXDRAW = 200;
      let m = 1, mode = "pref", seed = 1, R, n, deg, E, stubs, newV = -1, newE = new Set(), P, V, alpha = 0, raf = 0, vis = true, timer = 0, speed = 250;
      let drawSet = null;   // n > 200: a legnagyobb 50 csúcs
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" }), ctr3 = h("div", { class: "controls" });
      root.append(ctr, ctr2, ctr3);
      ctr.append(h("span", { class: "muted", style: "font-size:.92rem" }, "új élek csúcsonként:"));
      toggleGroup(ctr, [[1, "m = 1"], [2, "m = 2"], [3, "m = 3"]], m, v => { m = v; reset(); });
      ctr.append(h("span", { class: "muted", style: "font-size:.92rem" }, "kapcsolódás:"));
      toggleGroup(ctr, [["pref", "preferenciális"], ["unif", "egyenletes"]], mode, v => { mode = v; reset(); });
      const playB = btn("▶ Lejátszás", () => (timer ? stop() : play()));
      ctr2.append(btn("Lépés", () => { stop(); if (n < MAXDRAW) { grow(); after(); } }), playB,
        btn("Ugrás 200-ig", () => { stop(); while (n < MAXDRAW) grow(); after(true); }),
        btn("1000 csúcsig", () => { stop(); while (n < 1000) grow(); after(true); }),
        btn("Újra", () => { stop(); seed++; reset(); }));
      ctr3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "sebesség:"));
      toggleGroup(ctr3, [[700, "lassú"], [250, "közepes"], [60, "gyors"]], speed, v => { speed = v; if (timer) { stop(); play(); } });
      const box = h("div");
      root.append(box);
      const cv = canvasBox(box, aspect);
      const info = h("div", { class: "readout" });
      const chart = h("div", { style: "margin-top:.4rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A korán jöttek és a már népszerűek kapják az új éleket – ebből lesznek a hubok. Egyenletes kapcsolódással hubok nincsenek.");
      root.append(info, chart, lesson);

      function reset() {
        R = rng(seed * 104729 + m * 17 + (mode === "pref" ? 0 : 5));
        const m0 = Math.max(3, m + 1);
        n = m0; deg = new Array(m0).fill(m0 - 1); E = []; stubs = [];
        for (let i = 0; i < m0; i++) for (let j = i + 1; j < m0; j++) { E.push([i, j]); stubs.push(i, j); }
        P = []; V = [];
        for (let i = 0; i < m0; i++) { const t = 2 * Math.PI * i / m0 - Math.PI / 2; P.push(0.5 + 0.12 * Math.cos(t), aspect / 2 + 0.12 * Math.sin(t)); V.push(0, 0); }
        newV = -1; newE = new Set(); drawSet = null;
        after(true);
      }
      function grow() {
        const T = new Set(), want = Math.min(m, n);
        while (T.size < want) T.add(mode === "pref" ? stubs[Math.floor(R() * stubs.length)] : Math.floor(R() * n));
        const v = n++;
        deg.push(0); newE = new Set();
        let sx = 0, sy = 0;
        T.forEach(t => { E.push([t, v]); stubs.push(t, v); deg[t]++; deg[v]++; newE.add(E.length - 1); sx += P[2 * t]; sy += P[2 * t + 1]; });
        const a = R() * 2 * Math.PI, d = 0.03;
        P.push(sx / T.size + d * Math.cos(a), sy / T.size + d * Math.sin(a)); V.push(0, 0);
        newV = v;
      }
      const simOpts = N => ({ rep: 0.15 * 0.05 / Math.max(N, 8), spr: 0.1, len: Math.min(0.2, 0.55 * Math.sqrt(aspect / Math.max(N, 4))), g: 0.05, gy: 1 / aspect, w: 1, hgt: aspect, alpha });
      function tick() {
        if (drawSet) forceTick(drawSet.P, drawSet.V, drawSet.ids.length, drawSet.E, simOpts(drawSet.ids.length));
        else forceTick(P, V, n, E, simOpts(n));
        alpha *= 0.985;
      }
      function frame() {
        raf = 0;
        if (!vis) return;
        tick(); tick(); draw();
        if (alpha > 0.02) raf = requestAnimationFrame(frame);
      }
      const kick = () => { if (!raf && vis && alpha > 0.02) raf = requestAnimationFrame(frame); };
      /* lépés utáni frissítés; jump: sok új csúcs egyszerre → hosszabb elrendezés */
      function after(jump = false) {
        if (n > MAXDRAW) {
          /* a legnagyobb 50 csúcs és a köztük futó élek */
          const ids = [...Array(n).keys()].sort((a, b) => deg[b] - deg[a] || a - b).slice(0, 50), pos = new Map(ids.map((v, i) => [v, i]));
          const E2 = E.filter(([a, b]) => pos.has(a) && pos.has(b)).map(([a, b]) => [pos.get(a), pos.get(b)]);
          const Rl = rng(5), P2 = new Float64Array(100), V2 = new Float64Array(100);
          ids.forEach((v, i) => { P2[2 * i] = 0.1 + 0.8 * Rl(); P2[2 * i + 1] = aspect * (0.1 + 0.8 * Rl()); });
          drawSet = { ids, E: E2, P: P2, V: V2 };
          alpha = 1; for (let t = 0; t < 250; t++) tick();
          alpha = 0;
        } else {
          drawSet = null;
          alpha = Math.max(alpha, jump ? 1 : 0.35);
          if (jump) for (let t = 0; t < 200; t++) tick();
        }
        draw(); readout(); plot(); kick();
      }
      function play() {
        if (n >= MAXDRAW) return;
        playB.textContent = "⏸ Szünet";
        timer = setInterval(() => { if (n >= MAXDRAW) { stop(); return; } grow(); after(); }, speed);
      }
      function stop() { if (timer) clearInterval(timer); timer = 0; playB.textContent = "▶ Lejátszás"; }
      const sumK = () => 2 * E.length;
      function draw() {
        const ctx = cv.ctx, Wd = cv.w, Ht = cv.h, sc = Wd;
        ctx.clearRect(0, 0, Wd, Ht);
        const ds = drawSet, N = ds ? ds.ids.length : n, X = i => (ds ? ds.P : P)[2 * i] * sc, Y = i => (ds ? ds.P : P)[2 * i + 1] * sc;
        const vOf = i => (ds ? ds.ids[i] : i), EE = ds ? ds.E : E;
        const sK = sumK(), pi = v => (mode === "pref" ? deg[v] / sK : 1 / n), pmax = mode === "pref" ? Math.max(...deg) / sK : 1 / n;
        const zoom = N <= 12 ? 3.2 : N <= 40 ? 1.6 : 1, small = Wd < 500 ? 0.8 : 1;
        const rad = v => small * zoom * (1.8 + 1.5 * Math.sqrt(deg[v]));
        const eCol = mixColor("--card", "--muted", ds ? 0.45 : 0.6), cNew = GK.css("--setB"), text = GK.css("--text");
        ctx.lineWidth = N > 60 ? 0.8 : 1.2;
        EE.forEach(([a, b], i) => {
          if (!ds && newE.has(i)) return;
          ctx.strokeStyle = eCol; ctx.beginPath(); ctx.moveTo(X(a), Y(a)); ctx.lineTo(X(b), Y(b)); ctx.stroke();
        });
        if (!ds) { ctx.strokeStyle = cNew; ctx.lineWidth = 2.6; newE.forEach(i => { const [a, b] = E[i]; ctx.beginPath(); ctx.moveTo(X(a), Y(a)); ctx.lineTo(X(b), Y(b)); ctx.stroke(); }); }
        const card = GK.css("--card"), ink = [];
        for (let i = 0; i < N; i++) {
          const v = vOf(i), r = rad(v);
          const fc = v === newV && !ds ? cNew : mixColor("--card", "--accent", mode === "pref" ? 0.25 + 0.75 * pi(v) / pmax : 0.6);
          ink[i] = inkOf(fc); ctx.fillStyle = fc;
          ctx.strokeStyle = card; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(X(i), Y(i), r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
        }
        /* kevés csúcsnál: sorszám + választási esély */
        if (N <= 12) {
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          for (let i = 0; i < N; i++) {
            const v = vOf(i), r = rad(v);
            ctx.font = `600 ${Math.round(r * 0.95)}px system-ui, sans-serif`; ctx.fillStyle = ink[i];
            ctx.fillText(String(v + 1), X(i), Y(i) + 0.5);
            ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = text;
            ctx.fillText(mode === "pref" ? `${deg[v]}/${sK}` : `1/${n}`, X(i), Y(i) - r - 9);
          }
        }
        if (ds) {
          ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = GK.css("--muted");
          ctx.fillText(`n = ${n}: a rajzon csak a legnagyobb fokszámú 50 csúcs és a köztük futó élek`, 8, Ht - 8);
        }
      }
      cv.onResize = draw;
      /* azonos csúcs- és élszámú G(n, m) – rögzített maggal, hogy ne villogjon */
      function gnmDeg() {
        const Eg = sparseGnm(n, E.length, rng(n * 31 + m)), d = new Array(n).fill(0);
        Eg.forEach(e => { d[e.a]++; d[e.b]++; });
        return d;
      }
      let dG = [];
      function readout() {
        dG = gnmDeg();
        const kmax = Math.max(...deg), avg = sumK() / n, sK = sumK();
        let s = `n = <b>${n}</b> · élek: <b>${big(E.length)}</b> · $\\langle k\\rangle = ${fmM(avg, 2)}$ ($\\approx 2m = ${2 * m}$) · max $k$ = <b>${kmax}</b>` +
          ` · a legrégebbi csúcs (1.) fokszáma: <b>${deg[0]}</b>` +
          `<br><span style="color:var(--muted)">azonos méretű $G(n, m)$: max $k$ = ${Math.max(...dG)}</span>`;
        if (n <= 12) {
          s += `<br>A következő csúcs választási esélyei ` + (mode === "pref" ? "($\\Pi_i = k_i/\\sum_j k_j$): " : "(egyenletes, $1/n$): ") +
            [...Array(n).keys()].map(i => `${i + 1}: ${mode === "pref" ? deg[i] + "/" + sK : "1/" + n}`).join(", ");
        }
        if (mode === "pref" && n >= 300) {
          const th = q => 2 * m * (m + 1) / (q * (q + 1) * (q + 2)), fr = q => deg.filter(x => x === q).length / n;
          s += `<br>$k = ${m}, ${m + 1}, ${m + 2}$ aránya: ${[m, m + 1, m + 2].map(q => fmt(fr(q), 2)).join(" / ")} (elmélet $p_k = \\frac{2m(m+1)}{k(k+1)(k+2)}$: ${[m, m + 1, m + 2].map(q => fmt(th(q), 2)).join(" / ")})`;
        }
        info.innerHTML = s;
        math(info);
      }
      /* CCDF log–log: P(K ≥ k) */
      function plot() {
        const Wd = narrow ? 360 : 560, Ht = narrow ? 250 : 270;
        const D = degreeDist(deg), DG = degreeDist(dG.filter(x => x > 0)), nG = dG.length;
        const kmax = Math.max(10, ...deg) * 1.4, ymin = Math.pow(10, Math.floor(Math.log10(1 / n) + 1e-6));
        const A = logAxes(Wd, Ht, 1, kmax, ymin, 1, { xlab: "k (fokszám)", ylab: "P(K ≥ k)" });
        let g = A.g;
        const zf = dG.filter(x => x > 0).length / nG;   // a 0 fokúak nélkül a CCDF-et az n-hez arányosítjuk
        g += `<polyline points="${powLine(A, m, 1, -2, m, kmax)}" fill="none" stroke="${sv("--bad")}" stroke-width="1.4" stroke-dasharray="6 4"/>`;
        DG.k.forEach((k, i) => (g += `<circle cx="${A.X(k)}" cy="${A.Y(DG.ccdf[i] * zf)}" r="2.8" fill="${sv("--muted")}" fill-opacity="0.75"/>`));
        D.k.forEach((k, i) => (g += `<circle cx="${A.X(k)}" cy="${A.Y(D.ccdf[i])}" r="3.2" fill="${sv("--accent")}"/>`));
        const lx = Wd - 18;
        g += `<text x="${lx}" y="26" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--accent")}">● ${mode === "pref" ? "preferenciális" : "egyenletes"} növekedés</text>` +
          `<text x="${lx}" y="41" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--muted")}">● G(n, m), ugyanennyi csúcs és él</text>` +
          `<text x="${lx}" y="56" text-anchor="end" font-size="11" fill="${sv("--bad")}">- - meredekség −2 (pₖ ∝ k⁻³)</text>`;
        chart.innerHTML = svgEl(Wd, Ht, g, "a fokszámeloszlás komplementer eloszlásfüggvénye log–log skálán") +
          `<div class="muted" style="font-size:.8rem">Komplementer eloszlásfüggvény (CCDF): a legalább $k$ fokú csúcsok aránya. Hatványfüggvényes $p_k \\propto k^{-\\gamma}$ esetén egyenes, $1-\\gamma$ meredekséggel.</div>`;
        math(chart);
      }
      reset();
      watchVis(root, v => { vis = v; if (v) kick(); else stop(); });
      onTheme(() => { draw(); });
    };

    /* ------------------------------------------------------------------
       7.3  degree-tail – hogyan (ne) illesszünk hatványfüggvényt
       ------------------------------------------------------------------ */
    W["degree-tail"] = root => {
      header(root, "Nehéz farok: hogyan (ne) illesszünk hatványfüggvényt?",
        "Ugyanaz a fokszámsorozat háromféle log–log ábrán, és mindegyikre egy egyenes. A <b>maximum likelihood</b> becslés nem ábrára illeszt: " +
        "$\\hat\\gamma = 1 + n_{\\text{farok}}\\Big[\\sum_{k_i \\ge k_{\\min}} \\ln\\dfrac{k_i}{k_{\\min} - 1/2}\\Big]^{-1}$, csak a $k \\ge k_{\\min}$ csúcsokból. Húzd a $k_{\\min}$-t, és figyeld, mennyire vándorol a becslés!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const DS = {
        pb: { name: "politikai blogok", kmin: 29, get: () => { const P = polblogsU(); return { n: P.n, edges: P.edges }; } },
        karate: { name: "karateklub", kmin: 3, get: () => ({ n: window.KARATE13.n || 34, edges: window.KARATE13.edges.map(([a, b]) => ({ a, b, w: 1 })) }) },
        ba: { name: "Barabási–Albert (n = 1000, m = 2)", kmin: 3, get: () => ({ n: 1000, edges: barabasiAlbert(1000, 2, rng(9)) }) },
        er: { name: "Erdős–Rényi (mint a blogok)", kmin: 20, get: () => ({ n: 1222, edges: sparseGnm(1222, polblogsU().edges.length, rng(1959)) }) }
      };
      const cache = {};
      let key = "pb", view = "ccdf", D, kmin, KS = [];
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" }), ctr3 = h("div", { class: "controls" });
      root.append(ctr, ctr2, ctr3);
      ctr.append(h("span", { class: "muted", style: "font-size:.92rem" }, "adat:"));
      toggleGroup(ctr, [["pb", "politikai blogok"], ["karate", "karateklub"], ["ba", "Barabási–Albert"], ["er", "Erdős–Rényi"]], key, v => { key = v; load(); });
      ctr2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "ábra:"));
      toggleGroup(ctr2, [["raw", "(a) nyers hisztogram"], ["bin", "(b) logaritmikus binek"], ["ccdf", "(c) CCDF"]], view, v => { view = v; paint(); });
      const kVal = h("b", { style: "font-family:var(--mono);min-width:2.2em" });
      const sl = h("input", { type: "range", min: 0, max: 1, step: 1, value: 0, "aria-label": "k_min", style: "width:13rem;max-width:52vw",
        oninput: () => { kmin = KS[+sl.value]; paint(); } });
      ctr3.append(h("label", null, "ML-becslés, kₘᵢₙ =", sl, kVal));
      const chart = h("div", { style: "margin-top:.3rem" }), mini = h("div", { style: "margin-top:.4rem" });
      const info = h("div", { class: "readout" }), tbl = h("div", { class: "tw", style: "margin-top:.5rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A nyers hisztogramra húzott egyenes félrevezet; és ha a becsült kitevő a kₘᵢₙ-nel folyamatosan vándorol, az eloszlás nem tiszta hatványfüggvény – csak nehéz farkú.");
      root.append(chart, mini, info, tbl, lesson);

      function stats(G) {
        const deg = degreeC(G.n, G.edges), n = G.n, srt = deg.slice().sort((a, b) => a - b);
        const k1 = deg.reduce((s, x) => s + x, 0) / n, k2 = deg.reduce((s, x) => s + x * x, 0) / n;
        const med = n % 2 ? srt[(n - 1) / 2] : (srt[n / 2 - 1] + srt[n / 2]) / 2;
        const pos = deg.filter(k => k > 0), dd = degreeDist(pos);
        /* a 0 fokú csúcsokat a log-ábrákon nem lehet ábrázolni; az arányok n-hez viszonyítva */
        const f = pos.length / n;
        dd.pk = dd.pk.map(x => x * f); dd.ccdf = dd.ccdf.map(x => x * f);
        /* logaritmikus binek: [2^{j/2}; 2^{(j+1)/2}) – az egész k-k száma a binszélesség */
        const bins = [];
        for (let j = 0; Math.pow(2, j / 2) <= srt[n - 1]; j++) {
          const lo = Math.ceil(Math.pow(2, j / 2) - 1e-9), hi = Math.ceil(Math.pow(2, (j + 1) / 2) - 1e-9) - 1;
          if (hi < lo) continue;
          const c = pos.filter(k => k >= lo && k <= hi).length;
          if (c) bins.push({ x: Math.sqrt(lo * hi), d: c / (n * (hi - lo + 1)), lo, hi, c });
        }
        const lx = dd.k.map(Math.log10);
        return { n, m: G.edges.length, deg, k1, k2, med, kmax: srt[n - 1], dd, bins, hub100: deg.filter(k => k >= 100).length,
          raw: lsFit(lx, dd.pk.map(Math.log10)), cc: lsFit(lx, dd.ccdf.map(Math.log10)),
          lb: lsFit(bins.map(b => Math.log10(b.x)), bins.map(b => Math.log10(b.d))) };
      }
      const ml = km => { const t = D.deg.filter(k => k >= km); return { g: 1 + t.length / t.reduce((s, k) => s + Math.log(k / (km - 0.5)), 0), nt: t.length }; };
      function load() {
        if (!cache[key]) cache[key] = stats(DS[key].get());
        D = cache[key];
        KS = D.dd.k.filter(k => k <= 150 && D.deg.filter(x => x >= k).length >= 5);
        sl.max = KS.length - 1;
        const want = DS[key].kmin;
        let i = KS.findIndex(k => k >= want); if (i < 0) i = 0;
        sl.value = i; kmin = KS[i];
        paint();
      }
      function paint() {
        kVal.textContent = kmin;
        const M = ml(kmin), Wd = narrow ? 360 : 600, Ht = narrow ? 270 : 320, dd = D.dd;
        const xmax = Math.pow(10, Math.ceil(Math.log10(D.kmax * 1.15))) > D.kmax * 3 ? D.kmax * 1.6 : Math.pow(10, Math.ceil(Math.log10(D.kmax * 1.15)));
        let ys = view === "raw" ? dd.pk : view === "bin" ? D.bins.map(b => b.d) : dd.ccdf;
        const ymin = Math.pow(10, Math.floor(Math.log10(Math.min(...ys)) - 0.15));
        const ylab = view === "raw" ? "pₖ (a k fokú csúcsok aránya)" : view === "bin" ? "sűrűség (binenként / binszélesség)" : "P(K ≥ k)";
        const A = logAxes(Wd, Ht, 1, xmax, ymin, 1, { xlab: "k (fokszám)", ylab });
        let g = A.g;
        /* kₘᵢₙ */
        g += `<line x1="${A.X(kmin)}" y1="${A.T}" x2="${A.X(kmin)}" y2="${Ht - A.B}" stroke="${sv("--setB")}" stroke-width="1.2" stroke-dasharray="4 3"/>` +
          `<text x="${A.X(kmin) + 4}" y="${Ht - A.B - 6}" font-size="10.5" fill="${sv("--setB")}">kₘᵢₙ = ${kmin}</text>`;
        let leg = [];
        const lsLine = (fit, xs, xe) => `<polyline points="${powLine(A, 1, Math.pow(10, fit.icpt), fit.slope, xs, xe)}" fill="none" stroke="${sv("--bad")}" stroke-width="1.8" stroke-dasharray="7 4"/>`;
        if (view === "raw") {
          dd.k.forEach((k, i) => (g += `<circle cx="${A.X(k)}" cy="${A.Y(dd.pk[i])}" r="2.7" fill="${sv("--setA")}" fill-opacity="0.8"/>`));
          g += lsLine(D.raw, 1, D.kmax);
          leg = [["--setA", "● minden előforduló k"], ["--bad", `- - LS-egyenes: meredekség ${fmtS(D.raw.slope, 2)}`]];
        } else if (view === "bin") {
          D.bins.forEach(b => (g += `<circle cx="${A.X(b.x)}" cy="${A.Y(b.d)}" r="4" fill="${sv("--setA")}"><title>k = ${b.lo}–${b.hi}: ${b.c} csúcs</title></circle>`));
          g += `<polyline points="${D.bins.map(b => A.X(b.x).toFixed(1) + "," + A.Y(b.d).toFixed(1)).join(" ")}" fill="none" stroke="${sv("--setA")}" stroke-width="1.2"/>`;
          g += lsLine(D.lb, 1, D.kmax);
          leg = [["--setA", "● binenként (határok: 2^(j/2))"], ["--bad", `- - LS-egyenes: meredekség ${fmtS(D.lb.slope, 2)}`]];
        } else {
          dd.k.forEach((k, i) => (g += `<circle cx="${A.X(k)}" cy="${A.Y(dd.ccdf[i])}" r="${k >= kmin ? 3.1 : 2.6}" fill="${sv(k >= kmin ? "--accent" : "--setA")}" fill-opacity="${k >= kmin ? 0.95 : 0.45}"/>`));
          g += lsLine(D.cc, 1, D.kmax);
          const i0 = dd.k.indexOf(kmin);
          g += `<polyline points="${powLine(A, kmin, dd.ccdf[i0], 1 - M.g, kmin, xmax)}" fill="none" stroke="${sv("--setB")}" stroke-width="2.4"/>`;
          leg = [["--accent", "● a farok (k ≥ kₘᵢₙ)"], ["--bad", `- - LS az összes k-n: ${fmtS(D.cc.slope, 2)} → γ ≈ ${fmt(1 - D.cc.slope, 2)}`], ["--setB", `— ML: meredekség 1 − γ̂ = ${fmtS(1 - M.g, 2)}`]];
        }
        chart.innerHTML = svgEl(Wd, Ht, g, "fokszámeloszlás log–log skálán") +
          `<div style="font-size:.82rem;font-weight:600;display:flex;flex-wrap:wrap;gap:.1rem 1rem">` + leg.map(([c, t]) => `<span style="color:var(${c})">${t}</span>`).join("") + `</div>`;
        /* γ̂ a kₘᵢₙ függvényében */
        const Wm = narrow ? 360 : 600, Hm = 120, Lm = 46, Rm = 12, Tm = 10, Bm = 28;
        const G = KS.map(k => ml(k).g), span0 = Math.max(0.5, Math.max(...G) - Math.min(...G));
        const ystep = [0.5, 1, 2, 5, 10].find(t => span0 / t <= 4) || 20;
        const gmin = Math.floor(Math.min(...G) / ystep) * ystep, gmax = Math.max(gmin + ystep, Math.ceil(Math.max(...G) / ystep) * ystep);
        const lk0 = Math.log10(KS[0]), lk1 = Math.log10(Math.max(KS[KS.length - 1], KS[0] * 2));
        const Xm = k => Lm + (Math.log10(k) - lk0) / (lk1 - lk0) * (Wm - Lm - Rm), Ym = y => Hm - Bm - (y - gmin) / (gmax - gmin) * (Hm - Tm - Bm);
        let gm = "";
        for (let y = gmin; y <= gmax + 1e-9; y += ystep) gm += `<line x1="${Lm}" y1="${Ym(y)}" x2="${Wm - Rm}" y2="${Ym(y)}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${Lm - 5}" y="${Ym(y) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(y, 1)}</text>`;
        [1, 2, 5, 10, 20, 50, 100, 200].filter(t => t >= KS[0] && t <= KS[KS.length - 1]).forEach(t => (gm += `<text x="${Xm(t)}" y="${Hm - Bm + 13}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>`));
        gm += `<polyline points="${KS.map((k, i) => Xm(k).toFixed(1) + "," + Ym(G[i]).toFixed(1)).join(" ")}" fill="none" stroke="${sv("--setB")}" stroke-width="2"/>` +
          `<circle cx="${Xm(kmin)}" cy="${Ym(M.g)}" r="5" fill="${sv("--setB")}" stroke="${sv("--card")}" stroke-width="2"/>` +
          `<text x="${(Lm + Wm - Rm) / 2}" y="${Hm - 3}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">kₘᵢₙ (log-skála)</text>` +
          `<text x="${Lm + 6}" y="${Tm + 11}" font-size="10.5" font-weight="600" fill="${sv("--setB")}">γ̂ (ML) a kₘᵢₙ függvényében</text>`;
        mini.innerHTML = svgEl(Wm, Hm, gm, "a maximum likelihood becslés a k_min függvényében");
        /* kiírás */
        info.innerHTML = `${DS[key].name}: $n = ${D.n}$, $m = ${big(D.m).replace(" ", "\\,")}$, $\\langle k\\rangle = ${fmM(D.k1, 2)}$, medián ${fmt(D.med, 1)}, max $k$ = <b>${D.kmax}</b>` +
          (D.hub100 ? `, legalább 100 éle ${D.hub100} csúcsnak van` : "") +
          `<br>barátság-paradoxon: egy véletlen él végén álló csúcs átlagos fokszáma $\\langle k^2\\rangle/\\langle k\\rangle = ${fmM(D.k2 / D.k1, 2)}$ ` +
          (D.k2 / D.k1 > 1.2 * D.k1 ? ` – jóval nagyobb, mint $\\langle k\\rangle$: a barátaidnak átlagosan több barátjuk van, mint neked.` : ` – alig nagyobb, mint $\\langle k\\rangle$: a fokszámok közel egyformák.`);
        math(info);
        const ccT = lsFit(D.dd.k.filter(k => k >= kmin).map(Math.log10), D.dd.ccdf.filter((_, i) => D.dd.k[i] >= kmin).map(Math.log10));
        tbl.innerHTML = `<table><tr><th>módszer</th><th>meredekség</th><th>becsült γ</th></tr>` +
          `<tr><td>(a) nyers hisztogram, LS</td><td>${fmtS(D.raw.slope, 2)}</td><td>${fmtS(-D.raw.slope, 2)}</td></tr>` +
          `<tr><td>(b) logaritmikus binek, LS</td><td>${fmtS(D.lb.slope, 2)}</td><td>${fmtS(-D.lb.slope, 2)}</td></tr>` +
          `<tr><td>(c) CCDF, LS az összes k-n</td><td>${fmtS(D.cc.slope, 2)}</td><td>${fmt(1 - D.cc.slope, 2)}</td></tr>` +
          `<tr><td>(c) CCDF, LS a k ≥ ${kmin} részen</td><td>${isFinite(ccT.slope) ? fmtS(ccT.slope, 2) : "–"}</td><td>${isFinite(ccT.slope) ? fmt(1 - ccT.slope, 2) : "–"}</td></tr>` +
          `<tr><td><b>ML, k ≥ ${kmin}</b> (farok: ${M.nt} csúcs)</td><td>–</td><td><b>${fmt(M.g, 2)}</b></td></tr></table>`;
        if (narrow) tbl.querySelectorAll("td, th").forEach(c => (c.style.padding = ".3em .45em"));
      }
      load();
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
