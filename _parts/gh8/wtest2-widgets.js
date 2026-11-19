/* =========================================================
   Gráfelmélet és hálózattudomány 8. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET),
   a karateklub: ../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js (KARATE13),
   a Les Misérables szereplőhálózata: lesmis-data.js (LESMIS)
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

  const W = {};
  /* ==================================================================
     w2: 8.4, 8.6, 8.7 widgetjei (louvain-steps, sbm-generator, stability-check)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmtS = (x, d = 3) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmtP = (x, d = 3) => (x > 0.5 * Math.pow(10, -d) ? "+" : "") + fmtS(x, d);
    const pct = x => Math.round(100 * x) + "%";
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = c => `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.2em"></span>`;
    const median = xs => { const s = xs.slice().sort((a, b) => a - b), k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
    /* saját vászon (sok kis cellához) */
    function canvasBox(parent, aspect, maxW = 760) {
      const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
      parent.append(c);
      const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, aspect, maxW, onResize: null };
      o.resize = () => {
        const w = Math.min(o.maxW, parent.clientWidth || 320), hh = Math.round(w * o.aspect), dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); c.style.width = w + "px"; c.style.height = hh + "px";
        o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); o.w = w; o.h = hh;
        if (o.onResize) o.onResize();
      };
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(o.resize, 150); });
      new MutationObserver(() => o.onResize && o.onResize()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      o.resize();
      return o;
    }
    /* darabolt futtatás: job(i) i = 0 … total−1, kötegenként „per” darab; onProg(kész), onDone() */
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
    /* együttes-besorolási mátrix → konszenzus: C > 0,5 komponensei */
    function consensusOf(n, C) {
      const E = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (C[i][j] > 0.5) E.push({ a: i, b: j });
      const comp = components(n, E).comp;
      /* sorszám a méret szerint csökkenően */
      const sz = new Map(); comp.forEach(c => sz.set(c, (sz.get(c) || 0) + 1));
      const ord = [...sz.keys()].sort((a, b) => sz.get(b) - sz.get(a) || comp.indexOf(a) - comp.indexOf(b));
      return comp.map(c => ord.indexOf(c));
    }
    /* a csúcs stabilitása: azokkal a társaival, akikkel valaha egy közösségbe került, vagy a konszenzusban egy közösségben van,
       a futások hányad részében „ért egyet” a konszenzussal (együtt, ha egy konszenzus-közösség; külön, ha nem) */
    function stabilityOf(n, C, cons) {
      return [...Array(n).keys()].map(i => {
        let s = 0, c = 0;
        for (let j = 0; j < n; j++) {
          if (j === i) continue;
          const same = cons[i] === cons[j];
          if (!same && C[i][j] === 0) continue;
          s += same ? C[i][j] : 1 - C[i][j]; c++;
        }
        return c ? s / c : 1;
      });
    }
    /* két címkézés illesztése: a b-címkék színe az a-címkék közül a legnagyobb átfedésű (mohón); a maradék új színt kap */
    function matchColors(a, b, K) {
      const A = relabel(a), B = relabel(b), T = contingency(A, B), pairs = [];
      T.forEach((r, i) => r.forEach((x, j) => x && pairs.push([x, i, j])));
      pairs.sort((p, q) => q[0] - p[0]);
      const map = new Map(), used = new Set();
      pairs.forEach(([, i, j]) => { if (!map.has(j) && !used.has(i)) { map.set(j, i); used.add(i); } });
      let nx = Math.max(K, nComm(A));
      for (let j = 0; j < T[0].length; j++) if (!map.has(j)) map.set(j, nx++);
      return B.map(x => map.get(x));
    }

    /* ------------------------------------------------------------------
       Louvain lépésről lépésre – a w0 louvain() pontos mása, állapotgépként
       (ugyanannyi és ugyanolyan sorrendű R()-hívás → ugyanaz a partíció)
       ------------------------------------------------------------------ */
    function lvStepper(n, edges, gamma, R) {
      const S = { level: 0, phase: "move", totalMoves: 0, levelMoves: 0 };
      let N = n, adj = Array.from({ length: n }, () => new Map()), self = new Array(n).fill(0), members = [...Array(n).keys()].map(i => [i]);
      let m2 = 0;
      edges.forEach(e => {
        const w = 1;
        if (e.a === e.b) { self[e.a] += 2 * w; m2 += 2 * w; return; }
        adj[e.a].set(e.b, (adj[e.a].get(e.b) || 0) + w); adj[e.b].set(e.a, (adj[e.b].get(e.a) || 0) + w); m2 += 2 * w;
      });
      S.m2 = m2;
      let orig = [...Array(n).keys()], ccol = [...Array(n).keys()], ccolNext = ccol;
      let k, com, tot, order, pos, moved, improved, rounds, rl;
      function startRound() {
        order = [...Array(N).keys()];
        for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        pos = 0; moved = false; rounds++;
      }
      function initLevel() {
        k = new Array(N).fill(0);
        for (let i = 0; i < N; i++) { k[i] = self[i]; adj[i].forEach(w => (k[i] += w)); }
        com = [...Array(N).keys()]; tot = k.slice(); improved = false; rounds = 0; S.levelMoves = 0;
        startRound();
      }
      function endPhase() {
        rl = relabel(com);
        orig = orig.map(s => rl[s]);
        ccolNext = new Array(nComm(rl));
        for (let i = 0; i < N; i++) ccolNext[rl[i]] = ccol[com[i]];
        S.phase = improved ? "merge" : "done";
      }
      /* a c közösség eredeti csúcsai (a „skip” szuperpont nélkül) */
      S.membersOf = (c, skip = -1) => { const out = []; for (let s = 0; s < N; s++) if (s !== skip && com[s] === c) out.push(...members[s]); return out.sort((x, y) => x - y); };
      S.step = () => {
        if (S.phase !== "move") return null;
        const i = order[pos], ci = com[i], wTo = new Map();
        adj[i].forEach((w, j) => wTo.set(com[j], (wTo.get(com[j]) || 0) + w));
        tot[ci] -= k[i];
        const gain = c => (wTo.get(c) || 0) - gamma * tot[c] * k[i] / m2;
        const g0 = gain(ci);
        let best = ci, bg = g0;
        const rows = [{ c: ci, w: wTo.get(ci) || 0, tot: tot[ci], dQ: 2 * g0 / m2, stay: true, mem: S.membersOf(ci, i) }];
        wTo.forEach((_, c) => {
          const g = gain(c);
          if (c !== ci) rows.push({ c, w: wTo.get(c), tot: tot[c], dQ: 2 * g / m2, stay: false, mem: S.membersOf(c, i) });
          if (g > bg + 1e-12) { best = c; bg = g; }
        });
        tot[best] += k[i];
        const rec = { node: i, ci, best, rows, ki: k[i], gain: 2 * (bg - g0) / m2, moved: best !== ci, level: S.level, round: rounds, pos: pos + 1, N,
          self: members[i].slice(), col: c => ccol[c] };
        if (best !== ci) { com[i] = best; moved = improved = true; S.totalMoves++; S.levelMoves++; }
        pos++;
        if (pos === N) { if (moved && rounds < 100) startRound(); else endPhase(); }
        return rec;
      };
      S.merge = () => {
        if (S.phase !== "merge") return;
        const K = nComm(rl), adj2 = Array.from({ length: K }, () => new Map()), self2 = new Array(K).fill(0), mem2 = Array.from({ length: K }, () => []);
        for (let i = 0; i < N; i++) {
          mem2[rl[i]].push(...members[i]);
          self2[rl[i]] += self[i];
          adj[i].forEach((w, j) => {
            const a = rl[i], b = rl[j];
            if (a === b) self2[a] += w;
            else adj2[a].set(b, (adj2[a].get(b) || 0) + w);
          });
        }
        N = K; adj = adj2; self = self2; members = mem2; ccol = ccolNext;
        if (N === 1) { S.phase = "done"; return; }
        S.level++; S.phase = "move"; initLevel();
      };
      /* lekérdezések */
      S.N = () => N;
      S.members = () => members;
      S.adj = () => adj;
      S.self = () => self;
      S.rounds = () => rounds;
      S.pos = () => pos;
      S.superCom = s => (S.phase === "move" ? com[s] : rl[s]);
      S.colOfLabel = c => (S.phase === "move" ? ccol[c] : ccolNext[c]);
      S.labOrig = () => (S.phase === "move" ? orig.map(s => com[s]) : orig.slice());
      S.superOf = () => orig.slice();                    // eredeti csúcs → aktuális szuperpont (csak „move” fázisban értelmes)
      initLevel();
      return S;
    }

    function threeCliques(aspect) {
      const labels = [], pos = [], edges = [];
      ["A", "B", "C"].forEach((L, t) => {
        const x0 = 2 * t;
        [[0, 0.5], [0.6, 0], [0.6, 1], [1.2, 0.5]].forEach(([x, y], i) => { labels.push(L + (i + 1)); pos.push([x0 + x, y]); });
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push({ a: 4 * t + i, b: 4 * t + j, w: 1 });
      });
      edges.push({ a: 3, b: 4, w: 1 }, { a: 7, b: 8, w: 1 });
      const P = GK.normalize(pos, aspect);
      return { name: "három klikk", nodes: labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges };
    }

    W["louvain-steps"] = root => {
      header(root, "Louvain lépésről lépésre",
        "1. fázis: a csúcsokat véletlen sorrendben sorra vesszük, és mindegyiket oda tesszük, ahol a legnagyobb a modularitásnövekmény: " +
        "$\\Delta Q = \\dfrac{k_{i,C}}{m} - \\gamma\\,\\dfrac{\\Sigma_{\\text{tot}}(C)\\,k_i}{2m^2}$ " +
        "($k_{i,C}$: az i élei a C-be, $\\Sigma_{\\text{tot}}(C)$: C fokszámösszege i nélkül). Ha a saját közössége (a „marad” sor) a legjobb, marad. " +
        "Ha egy teljes körben senki sem mozdult, jöhet a 2. fázis: a közösségekből szuperpontok lesznek, és minden kezdődik elölről.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const DATA = {
        twoTri: { name: "két háromszög + híd", asp: narrow ? 0.62 : 0.4, r: 15, make: a => preset("twoTri", a) },
        three: { name: "három klikk", asp: narrow ? 0.45 : 0.3, r: 14, make: a => threeCliques(a) },
        arviz: { name: "Árvízhét", asp: narrow ? 0.85 : 0.5, r: 15,
          make: a => { const g = preset("arviz", a); g.edges = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); return g; } },
        karate: { name: "karateklub", asp: narrow ? 0.95 : 0.62, r: narrow ? 9 : 11,
          make: a => { const g = preset("karate", a); g.edges = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); return g; } }
      };
      let key = "twoTri", seed = 1, gamma = 1, G, S, rec = null, showOrig = false, chkDisc = false, busy = false;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, Object.entries(DATA).map(([k, d]) => [k, d.name]), key, v => { key = v; seed = 1; seedOut.textContent = seed; build(); });
      const c2 = h("div", { class: "controls" });
      const bStep = btn("Következő lépés", () => act("step"), "btn primary"), bPhase = btn("Fázis végéig", () => act("phase")),
        bMerge = btn("Összevonás (2. fázis)", () => act("merge")), bAll = btn("Végig", () => act("all")), bReset = btn("Újra", () => reset());
      c2.append(bStep, bPhase, bMerge, bAll, bReset);
      const c3 = h("div", { class: "controls" });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      const gOut = h("b", { style: "font-family:var(--mono);min-width:2.2em" }, "1,0");
      const gSl = h("input", { type: "range", min: 0.2, max: 3, step: 0.1, value: 1, "aria-label": "felbontási paraméter", style: "width:10rem;max-width:45vw",
        oninput: () => { gamma = +gSl.value; gOut.textContent = fmt(gamma, 1).includes(",") ? fmt(gamma, 1) : fmt(gamma, 1) + ",0"; reset(); } });
      const cbOrig = h("input", { type: "checkbox", onchange: () => { showOrig = cbOrig.checked; render(); } });
      const cbDisc = h("input", { type: "checkbox", onchange: () => { chkDisc = cbDisc.checked; renderInfo(); } });
      c3.append(h("label", null, "sorrend (mag):", seedOut), btn("Új sorrend", () => { seed++; seedOut.textContent = seed; reset(); }),
        h("label", null, "γ =", gSl, gOut),
        h("label", null, cbOrig, "eredeti csúcsokkal"), h("label", null, cbDisc, "Szétszakadt közösség?"));
      root.append(c1, c2, c3);
      const box = h("div");
      root.append(box);
      const legend = h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" });
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A Louvain mohó: minden csúcs oda megy, ahol most a legjobb – gyors, de a sorrendtől függ, és a végeredmény helyi optimum.");
      root.append(legend, info, tbl, lesson);

      let superMode = false, superSize = [], superSelf = [], hlSuper = -1;
      const view = new GK.View(box, {
        aspect: DATA[key].asp, radius: DATA[key].r, showWeights: false,
        onDraw: (ctx, v) => {
          if (!superMode) return;
          const text = GK.css("--text"), card = GK.css("--card"), accent = GK.css("--accent"), muted = GK.css("--muted");
          const r0 = Math.min(v.w, 700) / 46;
          v.nodes.forEach((nd, i) => {
            const [x, y] = v.px(nd), R_ = Math.max(v.o.radius + 1, Math.min(r0 * Math.sqrt(superSize[i]), v.h / 5)), col = GK.color(nd.fill);
            if (superSelf[i] > 0) {                           // hurok: a belső élek
              ctx.strokeStyle = muted; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.arc(x, y - R_ - 7, 9, 0, 2 * Math.PI); ctx.stroke();
              const lab = fmt(superSelf[i], 1);
              ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
              ctx.fillStyle = card; ctx.beginPath(); ctx.arc(x, y - R_ - 16, 3.6 * lab.length + 4, 0, 2 * Math.PI); ctx.fill();
              ctx.fillStyle = text; ctx.fillText(lab, x, y - R_ - 16);
            }
            ctx.beginPath(); ctx.arc(x, y, R_, 0, 2 * Math.PI);
            ctx.fillStyle = col; ctx.fill();
            ctx.lineWidth = i === hlSuper ? 4 : 1.5; ctx.strokeStyle = i === hlSuper ? accent : text; ctx.stroke();
            if (i === hlSuper) { ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(x, y, R_ + 5, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]); }
            ctx.fillStyle = "#fff"; ctx.font = "700 13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(String(superSize[i]), x, y + 0.5);
          });
        }
      });

      const nameOf = mem => {
        if (!mem.length) return "– (egyedül)";
        const L = mem.map(i => G.nodes[i].label);
        return "{" + (L.length <= 4 ? L.join(", ") : L.slice(0, 3).join(", ") + ", … (" + L.length + ")") + "}";
      };
      function build() {
        const d = DATA[key];
        view.o.aspect = d.asp; view.o.radius = d.r;
        G = d.make(d.asp);
        G.P0 = G.nodes.map(nd => [nd.x, nd.y]);
        view.resize();
        reset();
      }
      function reset() {
        if (busy) return;
        S = lvStepper(G.nodes.length, G.edges, gamma, rng(seed));
        const ref = louvain(G.nodes.length, G.edges, { R: rng(seed), gamma });
        S.ref = ref;
        rec = null; superMode = null;
        render();
      }
      /* a megjelenített gráf: eredeti vagy szuperpontos */
      function render() {
        const wantSuper = S.level >= 1 && !showOrig;
        const n = G.nodes.length, lab = S.labOrig();
        if (wantSuper !== superMode) {
          superMode = wantSuper;
          if (wantSuper) setSuperGraph(); else view.setGraph(G.nodes.map((nd, i) => Object.assign({}, nd, { x: G.P0[i][0], y: G.P0[i][1] })), G.edges);
          view.o.showWeights = wantSuper;
        } else if (wantSuper) setSuperGraph(true);
        view.hl = new Set(); view.hlE = new Set(); view.dim = false; hlSuper = -1;
        if (superMode) {
          const N = S.N();
          for (let s = 0; s < N; s++) view.nodes[s].fill = commColor(S.colOfLabel(S.superCom(s)));
          view.nodes.forEach(nd => (nd.color = nd.fill));
          if (rec && rec.level === S.level) {
            hlSuper = rec.node;
            S.adj()[rec.node].forEach((_, j) => view.hlE.add(GK.edgeKey(rec.node, j)));
            view.hl = new Set([rec.node]);
          }
        } else {
          for (let i = 0; i < n; i++) view.nodes[i].color = commColor(S.colOfLabel(lab[i]));
          if (rec) {
            const mine = new Set(rec.self);
            view.hl = mine;
            G.edges.forEach(e => { if (mine.has(e.a) !== mine.has(e.b)) view.hlE.add(GK.edgeKey(e.a, e.b)); });
          }
        }
        view.draw();
        legend.innerHTML = superMode
          ? "Szuperpontok: a méret ∝ √(tagok száma), a körben a tagok száma, a hurkon a belső élek száma, az éleken a közösségek közti élek száma. A szín: a közösség."
          : "A szín: a csúcs aktuális közössége. Kiemelve: a most vizsgált csúcs" + (S.level >= 1 ? " (szuperpont tagjai)" : "") + " és a szomszédai felé futó élek.";
        renderInfo(); renderTable();
        const mv = S.phase === "move";
        bStep.disabled = !mv; bPhase.disabled = !mv; bMerge.disabled = S.phase !== "merge"; bAll.disabled = S.phase === "done";
        bMerge.classList.toggle("primary", S.phase === "merge"); bStep.classList.toggle("primary", mv);
      }
      function setSuperGraph(keepPos) {
        const N = S.N(), mem = S.members(), adj = S.adj(), self = S.self();
        superSize = mem.map(m => m.length); superSelf = self.map(x => x / 2);
        const nodes = mem.map((m, s) => {
          const cx = m.reduce((t, i) => t + G.P0[i][0], 0) / m.length, cy = m.reduce((t, i) => t + G.P0[i][1], 0) / m.length;
          const old = keepPos && view.nodes[s];
          return { label: "", x: old ? old.x : cx, y: old ? old.y : cy };
        });
        if (!keepPos) separate(nodes, superSize);
        const edges = [];
        for (let a = 0; a < N; a++) adj[a].forEach((w, b) => { if (a < b) edges.push({ a, b, w, label: fmt(w, 1) }); });
        if (keepPos) { view.nodes = view.nodes.slice(0, N); view.edges = edges.map(e => Object.assign({ w: 1 }, e)); }
        else view.setGraph(nodes, edges);
      }
      /* a szuperpontok ne fedjék egymást: egyszerű taszítás a sugarak szerint (képpontban számolva) */
      function separate(nodes, size) {
        const Wd = view.w, Ht = view.h, r0 = Math.min(Wd, 700) / 46, gap = 26;
        const R_ = size.map(z => Math.max(view.o.radius + 1, Math.min(r0 * Math.sqrt(z), Ht / 5)));
        const P = nodes.map(nd => [nd.x * Wd, nd.y * Ht]);
        for (let it = 0; it < 200; it++) {
          let moved = false;
          for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
            let dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], d = Math.hypot(dx, dy);
            const need = R_[i] + R_[j] + gap;
            if (d >= need) continue;
            if (d < 1e-6) { dx = 1; dy = 0.3; d = Math.hypot(dx, dy); }
            const push = (need - d) / 2 * 0.6;
            P[i][0] -= dx / d * push; P[i][1] -= dy / d * push; P[j][0] += dx / d * push; P[j][1] += dy / d * push; moved = true;
          }
          P.forEach((p, i) => { p[0] = Math.max(R_[i] + 4, Math.min(Wd - R_[i] - 4, p[0])); p[1] = Math.max(R_[i] + 22, Math.min(Ht - R_[i] - 4, p[1])); });
          if (!moved) break;
        }
        P.forEach((p, i) => { nodes[i].x = p[0] / Wd; nodes[i].y = p[1] / Ht; });
      }
      function renderInfo() {
        const lab = S.labOrig(), n = G.nodes.length;
        const Q = modularity(n, G.edges, lab).Q, Qg = modularity(n, G.edges, lab, { gamma }).Q;
        const lines = [];
        const where = S.phase === "move" ? `${S.level + 1}. szint · ${S.rounds()}. kör · ${S.pos()}/${S.N()} ${S.level ? "szuperpont" : "csúcs"} megvizsgálva`
          : S.phase === "merge" ? `${S.level + 1}. szint · az 1. fázis véget ért (egy teljes körben senki sem mozdult)`
          : `${S.level + 1}. szint`;
        lines.push(where);
        lines.push(`Q = <b>${fmtS(Q)}</b>` + (Math.abs(gamma - 1) > 1e-9 ? ` · Q<sub>γ</sub> = <b>${fmtS(Qg)}</b>` : "") +
          ` · közösségek: <b>${nComm(lab)}</b> · áthelyezések eddig: <b>${S.totalMoves}</b>`);
        if (rec) {
          const nm = rec.self.length === 1 ? G.nodes[rec.self[0]].label : "szuperpont " + nameOf(rec.self);
          const tgt = rec.rows.find(r => r.c === rec.best);
          lines.push(rec.moved ? `Utolsó lépés: ${nm} → ${nameOf(tgt.mem)} (Q nő ${fmtS(rec.gain)}-del)` : `Utolsó lépés: ${nm} marad (nincs pozitív nyereség)`);
        }
        if (S.phase === "merge") lines.push("Jöhet az összevonás (2. fázis).");
        if (S.phase === "done") {
          lines.push("<b>Kész – nincs több javító lépés.</b>");
          const ok = Math.abs(S.ref.Q - Qg) < 1e-12 && S.ref.lab.every((x, i) => x === relabel(lab)[i]);
          root.dataset.check = ok ? "ok" : "diff";
          root.dataset.result = JSON.stringify({ Q: +Q.toFixed(4), Qg: +Qg.toFixed(4), k: nComm(lab), refQ: +S.ref.Q.toFixed(4), lab: relabel(lab) });
          if (chkDisc) {
            const bad = disconnectedComms(n, G.edges, lab);
            lines.push(bad.length ? bad.map(c => `A(z) ${nameOf([...Array(n).keys()].filter(i => lab[i] === c))} közösség nem összefüggő – ezt javítja a Leiden.`).join(" ")
              : "Minden közösség összefüggő.");
          }
        } else {
          delete root.dataset.check;
          if (chkDisc) lines.push("(Az összefüggőséget a végén ellenőrzöm.)");
        }
        info.innerHTML = lines.join("<br>");
      }
      function renderTable() {
        tbl.innerHTML = "";
        if (!rec || S.phase === "done" && !rec) return;
        const nm = rec.self.length === 1 ? G.nodes[rec.self[0]].label : nameOf(rec.self);
        const m = S.m2 / 2;
        const t = h("table", { style: "width:auto;min-width:min(100%,420px)" });
        t.append(h("tr", null, h("th", null, "célközösség"), h("th", { html: "$k_{i,C}$" }), h("th", { html: "$\\Sigma_{\\text{tot}}$" }),
          h("th", { html: "$\\Delta Q$" }), h("th", null, "a maradáshoz képest")));
        const stay = rec.rows[0].dQ;
        rec.rows.forEach(r => {
          const win = r.c === rec.best, col = commColor(rec.col(r.c));
          const tr = h("tr", { style: win ? "background:color-mix(in srgb, var(--accent) 16%, var(--card));font-weight:600" : "" },
            h("td", { html: sw(col) + (r.stay ? "marad: " : "") + nameOf(r.mem) }),
            h("td", { style: "font-family:var(--mono)" }, fmt(r.w, 2)), h("td", { style: "font-family:var(--mono)" }, fmt(r.tot, 2)),
            h("td", { style: "font-family:var(--mono)" }, fmtS(r.dQ)), h("td", { style: "font-family:var(--mono)" }, r.stay ? "0" : fmtP(r.dQ - stay)));
          t.append(tr);
        });
        const cap = h("p", { style: "margin:.6rem 0 .2rem;font-size:.92rem", html:
          `A vizsgált ${rec.self.length === 1 ? "csúcs" : "szuperpont"}: <b>${nm}</b>, $k_i = ${fmt(rec.ki, 2).replace(",", "{,}")}$, $m = ${fmt(m, 2).replace(",", "{,}")}$` +
          (Math.abs(gamma - 1) > 1e-9 ? `, $\\gamma = ${fmt(gamma, 1).replace(",", "{,}")}$` : "") +
          ` → ${rec.moved ? "átkerül a kiemelt közösségbe." : "marad (egyik csere sem javít)."}` });
        tbl.append(cap, t);
        math(tbl);
      }
      function act(what) {
        if (busy) return;
        if (what === "step") rec = S.step() || rec;
        else if (what === "phase") { while (S.phase === "move") rec = S.step(); }
        else if (what === "merge") return doMerge();
        else if (what === "all") {
          while (S.phase !== "done") { if (S.phase === "move") S.step(); else S.merge(); }
          rec = null;
        }
        render();
      }
      /* összevonás: a tagok a közösség súlypontjába csúsznak, majd szuperpontok lesznek */
      function doMerge() {
        busy = true;
        const lab = S.labOrig();
        const cen = new Map();
        lab.forEach((c, i) => { const p = cen.get(c) || [0, 0, 0]; p[0] += G.P0[i][0]; p[1] += G.P0[i][1]; p[2]++; cen.set(c, p); });
        let targets;
        if (superMode) {
          const mem = S.members();
          targets = view.nodes.map((_, s) => { const c = cen.get(lab[mem[s][0]]); return [c[0] / c[2], c[1] / c[2]]; });
        } else targets = lab.map(c => { const p = cen.get(c); return [p[0] / p[2], p[1] / p[2]]; });
        view.animateTo(targets, 650);
        setTimeout(() => { busy = false; S.merge(); rec = null; superMode = null; render(); }, 720);
      }
      build();
    };

    /* ------------------------------------------------------------------
       8.7: stabilitás – együttes-besorolási mátrix sok futásból
       ------------------------------------------------------------------ */
    W["stability-check"] = root => {
      header(root, "Mennyire stabil a felbontás?",
        "Ugyanazt az algoritmust sokszor lefuttatom, más-más véletlen sorrenddel. Az <b>együttes-besorolási mátrix</b> $C_{ij}$ eleme: " +
        "a futások hány százalékában került i és j egy közösségbe. A <b>konszenzus</b>: azok kerülnek egy csoportba, akik a futások több mint felében együtt voltak " +
        "($C_{ij} > 0{,}5$, láncolva). A csúcs <b>stabilitása</b>: a társaival (akikkel valaha együtt volt, vagy a konszenzusban együtt van) a futások hány százalékában ért egyet a konszenzussal.");
      math(root.querySelector(".w-sub"));
      const K = preset("karate", 0.62), LM = lesmisGraph(0.62);
      let ds = "karate", method = "louvain", runs = 20, gseed = 1, res = null, cancel = null;
      const DS = {
        karate: () => ({ n: 34, edges: K.edges.map(e => ({ a: e.a, b: e.b, w: 1 })), weighted: false, names: K.nodes.map(x => x.label), xy: K.nodes.map(x => [x.x, x.y]), club: K.club }),
        lesmis: () => ({ n: 77, edges: LM.edges, weighted: true, names: LM.nodes.map(x => x.name), xy: LM.nodes.map(x => [x.x, x.y]) }),
        random: () => {
          const E = gnm(34, 78, rng(gseed * 101 + 7)), P = GK.forceLayout(34, E.map(e => [e.a, e.b]), { seed: 3, aspect: 0.62 });
          return { n: 34, edges: E, weighted: false, names: [...Array(34).keys()].map(i => "v" + (i + 1)), xy: P };
        }
      };
      let G = DS[ds]();
      const c1 = h("div", { class: "controls" });
      const bNewG = btn("Új véletlen gráf", () => { gseed++; G = DS.random(); run(); });
      toggleGroup(c1, [["karate", "karateklub"], ["lesmis", "Les Misérables"], ["random", "véletlen G(34, 78)"]], ds, v => {
        ds = v; G = DS[v](); bNewG.style.display = v === "random" ? "" : "none"; run(); });
      c1.append(bNewG); bNewG.style.display = "none";
      const c2 = h("div", { class: "controls" });
      toggleGroup(c2, [["louvain", "Louvain"], ["lpa", "címketerjesztés"]], method, v => { method = v; run(); });
      c2.append(h("span", { class: "muted", style: "font-size:.9rem" }, "futások:"));
      toggleGroup(c2, [[10, "10"], [20, "20"], [50, "50"]], runs, v => { runs = v; run(); });
      const bRun = btn("Futtatás", () => run(), "btn primary");
      c2.append(bRun);
      root.append(c1, c2);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const left = h("div"), right = h("div");
      grid.append(left, right);
      root.append(grid);
      left.append(h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, "(a) Együttes-besorolási mátrix"));
      const hmBox = h("div");
      left.append(hmBox);
      const hmNote = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" });
      const pairOut = h("div", { style: "font-family:var(--mono);font-size:.85rem;min-height:1.3em;overflow-wrap:anywhere" });
      left.append(hmNote, pairOut);
      right.append(h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, "(b) Konszenzus a gráfon (halvány = instabil)"));
      const gBox = h("div");
      right.append(gBox);
      const weak = h("p", { style: "font-size:.88rem;margin:.3rem 0 0;overflow-wrap:anywhere" });
      right.append(weak);
      const info = h("div", { class: "readout" });
      const histBox = h("div", { style: "margin-top:.4rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Egy futás egy vélemény. Ami minden futásban együtt van, arra lehet építeni; a halvány csúcsok a határon állnak.");
      root.append(h("div", { style: "font-weight:600;font-size:.92rem;margin-top:.6rem" }, "(c) Összegzés"), info, histBox, lesson);

      const hm = canvasBox(hmBox, 1, 380);
      const view = new GK.View(gBox, { aspect: 0.62, radius: 6, maxW: 420 });
      const draw0 = view.draw.bind(view);
      view.draw = () => { recolor(); draw0(); };
      function recolor() {
        if (!res || !view.nodes.length) return;
        view.nodes.forEach((nd, i) => {
          const t = Math.max(0, Math.min(1, (res.stab[i] - 0.5) / 0.5));
          nd.color = mixColor("--card", commColor(res.cons[i]), 0.12 + 0.88 * t);
          nd.ink = t > 0.5 ? null : "--text";
        });
      }
      function setGraph() {
        const big = G.n > 40;
        view.o.radius = big ? 5 : (root.clientWidth < 560 ? 8 : 9);
        view.setGraph(G.xy.map((p, i) => ({ label: big ? "" : (ds === "karate" ? G.names[i] : String(i + 1)), x: p[0], y: p[1] })), G.edges);
        view.o.weightWidth = false;
      }
      function run() {
        if (cancel) cancel();
        const n = G.n, C = Array.from({ length: n }, () => new Float64Array(n)), labs = [], Qs = [];
        res = null; delete root.dataset.summary; setGraph(); drawHM(); pairOut.textContent = "";
        bRun.disabled = true;
        cancel = chunked(runs, method === "louvain" && n > 40 ? 2 : 5, r => {
          const R = rng(r + 1);
          const lab = method === "louvain" ? louvain(n, G.edges, { R, weighted: G.weighted }).lab : labelProp(n, G.edges, { R, weighted: G.weighted }).lab;
          labs.push(lab); Qs.push(modularity(n, G.edges, lab, { weighted: G.weighted }).Q);
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (lab[i] === lab[j]) { C[i][j]++; C[j][i]++; }
        }, done => { info.innerHTML = `Futás: ${done}/${runs}…`; }, () => {
          cancel = null; bRun.disabled = false;
          for (let i = 0; i < n; i++) { C[i][i] = runs; for (let j = 0; j < n; j++) C[i][j] /= runs; }
          const cons = consensusOf(n, C), stab = stabilityOf(n, C, cons);
          const order = [...Array(n).keys()].sort((a, b) => cons[a] - cons[b] || stab[b] - stab[a] || a - b);
          res = { C, labs, Qs, cons, stab, order };
          drawHM(); view.draw(); summarize();
        });
      }
      function drawHM() {
        const ctx = hm.ctx, Wd = hm.w, n = G.n;
        ctx.clearRect(0, 0, Wd, hm.h);
        if (!res) return;
        const club = ds === "karate", pad = club ? 8 : 0, cs = (Wd - pad) / n;
        const cells = {};
        for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
          const v = res.C[res.order[a]][res.order[b]], key = Math.round(v * 20);
          ctx.fillStyle = cells[key] || (cells[key] = mixColor("--card", "--accent", key / 20));
          ctx.fillRect(pad + b * cs, pad + a * cs, cs + 0.5, cs + 0.5);
        }
        /* a konszenzus-közösségek határa */
        ctx.strokeStyle = GK.css("--text"); ctx.lineWidth = 1.2;
        let s = 0;
        for (let a = 1; a <= n; a++) {
          if (a === n || res.cons[res.order[a]] !== res.cons[res.order[a - 1]]) {
            ctx.strokeRect(pad + s * cs, pad + s * cs, (a - s) * cs, (a - s) * cs); s = a;
          }
        }
        if (club) {                                        // a valódi kettéválás sávja
          const dark = GK.css("--text"), light = GK.css("--border");
          res.order.forEach((v, a) => {
            ctx.fillStyle = G.club[v] === 0 ? dark : light;
            ctx.fillRect(pad + a * cs, 0, cs + 0.3, pad - 2); ctx.fillRect(0, pad + a * cs, pad - 2, cs + 0.3);
          });
        }
      }
      hm.onResize = () => drawHM();
      const pick = ev => {
        if (!res) return;
        const r = hm.c.getBoundingClientRect(), pad = ds === "karate" ? 8 : 0, cs = (hm.w - pad) / G.n;
        const b = Math.floor((ev.clientX - r.left - pad) / cs), a = Math.floor((ev.clientY - r.top - pad) / cs);
        if (a < 0 || b < 0 || a >= G.n || b >= G.n) return;
        const i = res.order[a], j = res.order[b];
        pairOut.textContent = `${G.names[i]} – ${G.names[j]}: ${pct(res.C[i][j])} (${Math.round(res.C[i][j] * runs)}/${runs} futás)`;
        view.hl = new Set([i, j]); view.dim = true; view.draw();
      };
      hm.c.addEventListener("pointerdown", pick);
      hm.c.addEventListener("pointermove", ev => { if (ev.buttons || ev.pointerType === "mouse") pick(ev); });
      hm.c.addEventListener("pointerleave", () => { view.hl = new Set(); view.dim = false; view.draw(); });
      function summarize() {
        const { Qs, labs, cons, stab } = res, n = G.n;
        const ks = labs.map(nComm), kc = new Map();
        ks.forEach(k => kc.set(k, (kc.get(k) || 0) + 1));
        let sN = 0, cN = 0;
        for (let a = 0; a < labs.length; a++) for (let b = a + 1; b < labs.length; b++) { sN += nmi(labs[a], labs[b]); cN++; }
        const lines = [];
        lines.push(`Q: min <b>${fmt(Math.min(...Qs), 3)}</b> · medián <b>${fmt(median(Qs), 3)}</b> · átlag <b>${fmt(meanSd(Qs).mean, 3)}</b> · max <b>${fmt(Math.max(...Qs), 3)}</b>`);
        lines.push("közösségszám: " + [...kc.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([k, c]) => `<b>${k}</b> → ${runs}-ból ${c}-szor`).join(" · "));
        lines.push(`a futások páronkénti átlagos NMI-je: <b>${fmt(cN ? sN / cN : 1, 3)}</b>`);
        const Qc = modularity(n, G.edges, cons, { weighted: G.weighted }).Q;
        lines.push(`konszenzus: <b>${nComm(cons)}</b> közösség, Q = <b>${fmt(Qc, 3)}</b>`);
        if (ds === "karate") {
          const nm = labs.map(l => nmi(G.club, l)), ar = labs.map(l => ari(G.club, l));
          lines.push(`a valódi kettéváláshoz képest: átlagos NMI <b>${fmt(meanSd(nm).mean, 3)}</b>, ARI <b>${fmt(meanSd(ar).mean, 3)}</b>`);
          lines.push(`a valódi kettéválás modularitása: <b>${fmt(modularity(34, G.edges, G.club).Q, 3)}</b>`);
        }
        if (ds === "random") {
          const best = Qs.slice().sort((a, b) => b - a).slice(0, 5);
          lines.push(`Ez <b>véletlen</b> gráf, mégis Q ≈ <b>${fmt(meanSd(best).mean, 2)}</b> (a legjobb 5 futás átlaga) – ` +
            `a valódi kettéválás modularitása a karateklubon 0,358. A magas Q önmagában nem bizonyíték!`);
        }
        info.innerHTML = lines.join("<br>");
        /* Q-hisztogram */
        const lo = Math.min(...Qs), hi = Math.max(...Qs), B = 12, span = hi - lo, cnt = new Array(B).fill(0);
        Qs.forEach(q => cnt[span < 1e-9 ? B - 1 : Math.min(B - 1, Math.floor((q - lo) / span * B))]++);
        const Wd = 360, Ht = 90, L = 8, bw = (Wd - 2 * L) / B, mx = Math.max(...cnt);
        let g = "";
        cnt.forEach((c, b) => { if (c) { const hh = (Ht - 30) * c / mx; g += `<rect x="${L + b * bw + 1}" y="${Ht - 18 - hh}" width="${bw - 2}" height="${hh}" fill="var(--accent)" opacity=".75"><title>${c}</title></rect>`; } });
        g += `<line x1="${L}" y1="${Ht - 18}" x2="${Wd - L}" y2="${Ht - 18}" stroke="var(--border)"/>`;
        g += `<text x="${L}" y="${Ht - 4}" font-size="10.5" fill="var(--muted)">${span < 1e-9 ? "minden futás: Q = " + fmt(lo, 3) : fmt(lo, 3)}</text>`;
        if (span >= 1e-9) g += `<text x="${Wd - L}" y="${Ht - 4}" font-size="10.5" fill="var(--muted)" text-anchor="end">${fmt(hi, 3)}</text>`;
        g += `<text x="${Wd / 2}" y="10" font-size="10.5" fill="var(--muted)" text-anchor="middle">a Q-értékek eloszlása (${runs} futás)</text>`;
        histBox.innerHTML = `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block" role="img" aria-label="Q hisztogram">${g}</svg>`;
        /* a legkevésbé stabil csúcsok */
        const ws = [...Array(n).keys()].sort((a, b) => stab[a] - stab[b] || a - b).slice(0, 5);
        weak.innerHTML = "A legkevésbé stabil csúcsok: " + ws.map(i => `${sw(commColor(cons[i]))}<b>${G.names[i]}</b> (${pct(stab[i])})`).join(", ") + ".";
        hmNote.innerHTML = "A csúcsok a konszenzus-közösségek szerint rendezve (keretben), azon belül a stabilitás szerint; erősebb színű cella = gyakrabban együtt. " +
          (ds === "karate" ? "A szélső sáv a valódi kettéválás: erős sáv = Mr. Hi csoportja, halvány = az elnöké. " : "") + "Koppints egy cellára!";
        root.dataset.summary = JSON.stringify({ Qmin: Math.min(...Qs), Qmax: Math.max(...Qs), Qmean: meanSd(Qs).mean, ks: [...kc.entries()], nmi: cN ? sN / cN : 1 });
      }
      run();
    };

    /* ------------------------------------------------------------------
       8.6: sztochasztikus blokkmodell
       ------------------------------------------------------------------ */
    W["sbm-generator"] = root => {
      header(root, "Sztochasztikus blokkmodell (SBM)",
        "A csúcsok blokkokba tartoznak; két csúcs között $p_{rs}$ eséllyel van él, ahol r és s a két csúcs blokkja. " +
        "Állítsd be a blokkmátrixot, és nézd meg, mit talál a Louvain! A töltés a <b>valódi blokk</b>, a gyűrű a <b>Louvain közössége</b> " +
        "(a legjobban illeszkedő blokk színével – ahol a gyűrű és a töltés színe egyezik, ott eltalálta).");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.9 : 0.55;
      let K = 2, sizes = [15, 15, 15], P = [[0.5, 0.05, 0.05], [0.05, 0.5, 0.05], [0.05, 0.05, 0.5]], seed = 1, shuffled = false, Gs = null, lv = null, perm = null;
      const c1 = h("div", { class: "controls" });
      const paintK = toggleGroup(c1, [[2, "2 blokk"], [3, "3 blokk"]], K, v => { K = v; buildCtrl(); gen(); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.9rem" }, "előbeállítás:"));
      const setAll = (pin, pout) => { for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) P[r][s] = r === s ? pin : pout; };
      const PRE = {
        comm: () => { setAll(0.5, 0.05); },
        cp: () => { K = 2; sizes[0] = 8; sizes[1] = 22; P[0][0] = 0.8; P[0][1] = P[1][0] = 0.3; P[1][1] = 0.02; },
        bip: () => { K = 2; sizes[0] = sizes[1] = 15; setAll(0.02, 0.3); },
        none: () => { setAll(0.15, 0.15); }
      };
      [["comm", "közösségek"], ["cp", "mag–periféria"], ["bip", "kétrészes"], ["none", "nincs szerkezet"]].forEach(([k, l]) =>
        c2.append(btn(l, () => { PRE[k](); paintK(K); buildCtrl(); gen(); })));
      const sizeBox = h("div", { class: "controls" });
      const matBox = h("div", { class: "tw", style: "overflow-x:auto" });
      const c3 = h("div", { class: "controls" });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      c3.append(h("label", null, "minta:", seedOut), btn("Új minta", () => { seed++; seedOut.textContent = seed; gen(); }, "btn primary"));
      root.append(c1, c2, sizeBox, matBox, c3);
      const gBox = h("div");
      const legend = h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0 0" });
      root.append(gBox, legend);
      const grid = h("div", { class: "two-col", style: "align-items:start;margin-top:.5rem" });
      const left = h("div"), right = h("div");
      grid.append(left, right); root.append(grid);
      const ordCtl = h("div", { class: "controls", style: "margin:.2rem 0" });
      ordCtl.append(h("span", { style: "font-weight:600;font-size:.92rem" }, "Szomszédsági mátrix:"));
      toggleGroup(ordCtl, [[false, "blokkok szerint"], [true, "véletlen sorrend"]], shuffled, v => { shuffled = v; drawMat(); });
      left.append(ordCtl);
      const mBox = h("div");
      left.append(mBox);
      const tblBox = h("div", { class: "tw", style: "overflow-x:auto" });
      const info = h("div", { class: "readout" });
      right.append(tblBox, info);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Az SBM nem azt kérdezi, hol sűrű a gráf, hanem azt, kik viselkednek egyformán: kivel és milyen eséllyel kapcsolódnak.");
      root.append(lesson);
      /* kimutathatóság */
      const det = h("div", { style: "margin-top:.9rem;border-top:1px solid var(--border);padding-top:.6rem" });
      root.append(det);
      const detHead = h("p", { style: "margin:.2rem 0", html:
        "<b>Kimutathatóság.</b> Két egyenlő blokk ($n = 2\\times 50$), rögzített átlagos fokszám ($\\langle k\\rangle = 6$), " +
        "és egyre kevésbé különbözik a blokkon belüli és a blokkok közti esély: $\\epsilon = p_{\\text{ki}}/p_{\\text{be}}$. " +
        "Ritka gráfban van egy határ, ahol túl ezen semmilyen módszer nem találja meg a blokkokat (Decelle és mtsai, 2011): " +
        "$|c_{\\text{be}} - c_{\\text{ki}}| > 2\\sqrt{\\langle k\\rangle}$, ahol $c = p \\cdot n$. Itt ez $\\epsilon^* = \\dfrac{6-\\sqrt6}{6+\\sqrt6} \\approx 0{,}42$." });
      const detCtl = h("div", { class: "controls" });
      const detOut = h("span", { class: "muted", style: "font-size:.9rem" });
      const bDet = btn("Görbe számolása (21 × 5 minta)", () => runDet());
      detCtl.append(bDet, detOut);
      const detSvg = h("div");
      det.append(detHead, detCtl, detSvg);
      math(det);

      const view = new GK.View(gBox, {
        aspect, radius: narrow ? 5 : 6,
        onDraw: (ctx, v) => {
          if (!lv) return;
          v.nodes.forEach((nd, i) => {
            const [x, y] = v.px(nd);
            ctx.beginPath(); ctx.arc(x, y, v.o.radius + 3.2, 0, 2 * Math.PI);
            ctx.lineWidth = 2.6; ctx.strokeStyle = GK.color(commColor(lv.col[i])); ctx.stroke();
          });
        }
      });
      const mat = canvasBox(mBox, 1, 320);
      mat.onResize = () => drawMat();

      function buildCtrl() {
        sizeBox.innerHTML = "";
        for (let b = 0; b < K; b++) {
          const out = h("b", { style: "font-family:var(--mono);min-width:1.4em" }, String(sizes[b]));
          const sl = h("input", { type: "range", min: 5, max: 30, step: 1, value: sizes[b], "aria-label": `${b + 1}. blokk mérete`, style: "width:7rem",
            oninput: () => { sizes[b] = +sl.value; out.textContent = sl.value; gen(); } });
          sizeBox.append(h("label", { html: `${sw(commColor(b))}${b + 1}. blokk:` }, sl, out));
        }
        matBox.innerHTML = "";
        const t = h("table", { style: "width:auto" });
        t.append(h("tr", null, h("th", { html: "$p_{rs}$" }), ...[...Array(K).keys()].map(s => h("th", { html: `${sw(commColor(s))}${s + 1}.` }))));
        const outs = [];
        for (let r = 0; r < K; r++) {
          const tr = h("tr", null, h("th", { html: `${sw(commColor(r))}${r + 1}.` }));
          for (let s = 0; s < K; s++) {
            const o = h("b", { style: "font-family:var(--mono);display:inline-block;min-width:2.6em" }, fmt(P[r][s], 2));
            outs.push([r, s, o]);
            const td = h("td", { style: "white-space:nowrap" });
            if (s >= r) {
              const sl = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: P[r][s], "aria-label": `p ${r + 1}–${s + 1}`, style: `width:${narrow ? 3.6 : 5.5}rem;vertical-align:middle`,
                oninput: () => { P[r][s] = P[s][r] = +sl.value; outs.forEach(([a, b, el]) => (el.textContent = fmt(P[a][b], 2))); gen(); } });
              td.append(sl, " ", o);
            } else { td.append(o); td.style.color = "var(--muted)"; td.title = "szimmetrikus"; }
            tr.append(td);
          }
          t.append(tr);
        }
        matBox.append(t);
        math(matBox);
      }
      function gen() {
        const sz = sizes.slice(0, K), PP = P.slice(0, K).map(r => r.slice(0, K));
        Gs = sbm(sz, PP, rng(seed * 7919 + 13));
        const n = Gs.n;
        /* elrendezéshez a kis komponenseket (izolált csúcsokat) egy-egy láthatatlan éllel a legnagyobbhoz kötöm */
        const LE = Gs.edges.map(e => [e.a, e.b]), cc = components(n, Gs.edges).comp, csz = new Map();
        cc.forEach(c => csz.set(c, (csz.get(c) || 0) + 1));
        const bigC = [...csz.keys()].sort((a, b) => csz.get(b) - csz.get(a))[0], bigV = [...Array(n).keys()].filter(i => cc[i] === bigC), seen = new Set([bigC]);
        for (let i = 0; i < n; i++) if (!seen.has(cc[i])) { seen.add(cc[i]); LE.push([i, bigV[(i * 7) % bigV.length]]); }
        const L = GK.forceLayout(n, LE, { seed: 7, aspect, iters: 300 });
        const lres = louvain(n, Gs.edges, { R: rng(seed) });
        lv = { lab: lres.lab, Q: lres.Q, col: matchColors(Gs.block, lres.lab, K), nmi: nmi(Gs.block, lres.lab), k: nComm(lres.lab) };
        view.setGraph(L.map((p, i) => ({ label: "", x: p[0], y: p[1], color: commColor(Gs.block[i]) })), Gs.edges);
        const R = rng(seed + 99);
        perm = [...Array(n).keys()];
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
        drawMat(); renderTable();
        legend.innerHTML = "Töltés: valódi blokk (" + [...Array(K).keys()].map(b => `${sw(commColor(b))}${b + 1}.`).join(" ") + "); gyűrű: a Louvain közössége.";
      }
      function drawMat() {
        const ctx = mat.ctx, Wd = mat.w;
        ctx.clearRect(0, 0, Wd, mat.h);
        if (!Gs) return;
        const n = Gs.n, cs = Wd / n, ord = shuffled ? perm : [...Array(n).keys()], at = new Array(n);
        ord.forEach((v, a) => (at[v] = a));
        ctx.fillStyle = mixColor("--card", "--muted", 0.08); ctx.fillRect(0, 0, Wd, Wd);
        ctx.fillStyle = GK.css("--text");
        Gs.edges.forEach(e => {
          const a = at[e.a], b = at[e.b];
          ctx.fillRect(b * cs, a * cs, Math.max(1, cs), Math.max(1, cs)); ctx.fillRect(a * cs, b * cs, Math.max(1, cs), Math.max(1, cs));
        });
        if (!shuffled) {
          ctx.strokeStyle = GK.css("--accent"); ctx.lineWidth = 1;
          let s = 0;
          sizes.slice(0, K).forEach((z, b) => {
            if (b) { ctx.beginPath(); ctx.moveTo(s * cs, 0); ctx.lineTo(s * cs, Wd); ctx.moveTo(0, s * cs); ctx.lineTo(Wd, s * cs); ctx.stroke(); }
            s += z;
          });
        }
        ctx.strokeStyle = GK.css("--border"); ctx.strokeRect(0.5, 0.5, Wd - 1, Wd - 1);
      }
      function renderTable() {
        const sz = sizes.slice(0, K), Ex = sbmExpected(sz, P), act = Array.from({ length: K }, () => new Array(K).fill(0));
        Gs.edges.forEach(e => { const r = Math.min(Gs.block[e.a], Gs.block[e.b]), s = Math.max(Gs.block[e.a], Gs.block[e.b]); act[r][s]++; });
        const t = h("table", { style: "width:auto" });
        t.append(h("tr", null, h("th", null, "blokkpár"), h("th", null, "p"), h("th", null, "várható él"), h("th", null, "kapott él")));
        for (let r = 0; r < K; r++) for (let s = r; s < K; s++)
          t.append(h("tr", null, h("td", { html: `${sw(commColor(r))}${r + 1}–${sw(commColor(s))}${s + 1}` }), h("td", { style: "font-family:var(--mono)" }, fmt(P[r][s], 2)),
            h("td", { style: "font-family:var(--mono)" }, fmt(Ex[r][s], 1)), h("td", { style: "font-family:var(--mono)" }, String(act[r][s]))));
        tblBox.innerHTML = ""; tblBox.append(t);
        info.innerHTML = `n = <b>${Gs.n}</b> csúcs, <b>${Gs.edges.length}</b> él<br>` +
          `Louvain: <b>${lv.k}</b> közösség, Q = <b>${fmt(lv.Q, 3)}</b><br>NMI a valódi blokkokhoz: <b>${fmt(lv.nmi, 2)}</b>` +
          (lv.nmi < 0.3 ? "<br>A Louvain itt <b>nem</b> a valódi blokkokat találja: a modularitás csak az „egymás közt sűrű” csoportokat keresi." : "");
        root.dataset.result = JSON.stringify({ n: Gs.n, m: Gs.edges.length, k: lv.k, Q: lv.Q, nmi: lv.nmi, exp: Ex, act });
      }
      /* kimutathatósági görbe (darabolva) */
      let detCancel = null;
      const EPS = [...Array(21).keys()].map(i => i / 20), REP = 5, EST = (6 - Math.sqrt(6)) / (6 + Math.sqrt(6));
      function runDet() {
        if (detCancel) detCancel();
        const blk = [...Array(100).keys()].map(i => (i < 50 ? 0 : 1)), acc = EPS.map(() => ({ l: 0, s: 0 }));
        bDet.disabled = true;
        detCancel = chunked(EPS.length * REP, 3, t => {
          const e = EPS[Math.floor(t / REP)], r = t % REP, pin = 6 / (49 + 50 * e), pout = e * pin;
          const G2 = sbm([50, 50], [[pin, pout], [pout, pin]], rng(5000 + 97 * t));
          acc[Math.floor(t / REP)].l += nmi(blk, louvain(100, G2.edges, { R: rng(r + 1) }).lab) / REP;
          acc[Math.floor(t / REP)].s += nmi(blk, spectralSplit(100, G2.edges, "modmat").lab) / REP;
        }, d => { detOut.textContent = `számolom: ${d}/${EPS.length * REP} minta`; drawDet(acc, Math.floor(d / REP)); },
        () => { detCancel = null; bDet.disabled = false; detOut.textContent = "kész (minden pont 5 minta átlaga). A Louvain már ε = 0-nál is több darabra vágja a blokkokat, ezért indul 1 alatt; a spektrális kettévágás eleve két részt keres.";
          root.dataset.det = JSON.stringify(acc.map((a, i) => [EPS[i], +a.l.toFixed(3), +a.s.toFixed(3)])); });
      }
      function drawDet(acc, upto) {
        const Wd = 520, Ht = 240, L = 40, Rm = 12, T = 12, B = 36;
        const X = e => L + e * (Wd - L - Rm), Y = v => Ht - B - v * (Ht - T - B);
        let g = `<rect x="${L}" y="${T}" width="${Wd - L - Rm}" height="${Ht - T - B}" fill="none" stroke="var(--border)"/>`;
        for (let v = 0; v <= 1.001; v += 0.25) g += `<line x1="${L}" y1="${Y(v)}" x2="${Wd - Rm}" y2="${Y(v)}" stroke="var(--border)" stroke-width=".6"/><text x="${L - 5}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10.5" fill="var(--muted)">${fmt(v, 2)}</text>`;
        for (let e = 0; e <= 1.001; e += 0.2) g += `<text x="${X(e)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${fmt(e, 1)}</text>`;
        g += `<text x="${(L + Wd - Rm) / 2}" y="${Ht - 6}" text-anchor="middle" font-size="11" fill="var(--muted)">ε = p_ki / p_be</text>`;
        g += `<text x="12" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="var(--muted)" transform="rotate(-90 12 ${(T + Ht - B) / 2})">NMI</text>`;
        g += `<line x1="${X(EST)}" y1="${T}" x2="${X(EST)}" y2="${Ht - B}" stroke="var(--text)" stroke-dasharray="5 4"/><text x="${X(EST) + 4}" y="${T + 12}" font-size="10.5" fill="var(--text)">ε* ≈ 0,42</text>`;
        const line = (k, col, dash) => {
          const pts = acc.slice(0, upto).map((a, i) => [X(EPS[i]), Y(a[k])]);
          if (!pts.length) return "";
          return `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="2" ${dash ? 'stroke-dasharray="4 3"' : ""}/>` +
            pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.8" fill="${col}"/>`).join("");
        };
        g += line("s", "var(--muted)", true) + line("l", "var(--accent)", false);
        g += `<g font-size="10.5"><line x1="${Wd - Rm - 190}" y1="${T + 30}" x2="${Wd - Rm - 172}" y2="${T + 30}" stroke="var(--accent)" stroke-width="2"/><text x="${Wd - Rm - 168}" y="${T + 33}" fill="var(--text)">Louvain</text>` +
          `<line x1="${Wd - Rm - 190}" y1="${T + 46}" x2="${Wd - Rm - 172}" y2="${T + 46}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/><text x="${Wd - Rm - 168}" y="${T + 49}" fill="var(--text)">spektrális kettévágás</text></g>`;
        detSvg.innerHTML = `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block" role="img" aria-label="kimutathatósági görbe">${g}</svg>`;
      }
      drawDet(EPS.map(() => ({ l: 0, s: 0 })), 0);
      buildCtrl(); gen();
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
