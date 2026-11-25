/* =========================================================
   Gráfelmélet és hálózattudomány 12. fejezet – interaktív szemléltetések
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
     w1: 12.2, 12.3, 12.7 widgetjei (relation-message, hetero-graph-explorer, metapath-vote)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const lineSw = (c, kind = "solid", wd = 3) => `<span style="display:inline-block;width:1.7em;height:0;border-top:${wd}px ${kind} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const sq = c => `<span style="display:inline-block;width:.85em;height:.85em;border-radius:2px;background:${sv(c)};vertical-align:-.08em;margin-right:.25em"></span>`;
    const fmM = (x, d = 3) => fmt(x, d).replace(",", "{,}");                    // KaTeX-be
    const fmP = (x, d = 3) => (x < 0 ? `(${fmM(x, d)})` : fmM(x, d));          // negatív szorzó zárójelben
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const IDS = D.actors.map(a => a.id);
    const muted = (t, st = "") => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0;" + st, html: t });
    /* csúszka felirattal és értékkel; tex: a felirat (KaTeX), aria: sima szöveg */
    function slider(parent, tex, aria, min, max, step, val, on, d = 2) {
      const out = h("b", { style: "font-family:var(--mono);min-width:2.8em;display:inline-block;text-align:right" }, fmt(val, d));
      const inp = h("input", { type: "range", min, max, step, value: val, "aria-label": aria, style: "width:7rem;max-width:30vw" });
      inp.addEventListener("input", () => { out.textContent = fmt(+inp.value, d); on(+inp.value); });
      const lab = h("label", null, h("span", { html: tex }), inp, out);
      parent.append(lab); math(lab);
      return { lab, inp, set(v) { inp.value = v; out.textContent = fmt(v, d); } };
    }
    const onTheme = f => new MutationObserver(f).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const tblH = (head, rows, st = "") => `<table style="width:auto;margin:.3rem 0;font-size:.86rem;white-space:nowrap;${st}"><thead><tr>${head.map(x => `<th style="padding:.2em .45em">${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
    const td = (x, st = "") => `<td style="padding:.2em .45em;text-align:center;${st}">${x}</td>`;

    /* ---------- az Árvízhét heterogén gráfja ---------- */
    const FR_IDS = ["vedekezes", "hiany", "veszteseg"];
    const FR_SHORT = { vedekezes: "véd.", hiany: "hiány", veszteseg: "veszt." };
    const FR_COL = { vedekezes: "--setA", hiany: "--setB", veszteseg: "--setC" };
    const PAP = D.papers.map(p => p.id), EVS = D.events.map(e => e.id);
    const ART = D.articles;                                                      // 1 … 12 (index = id − 1)
    const evOf = a => D.events.findIndex(e => e.articles.includes(a.id));
    /* típusok: L lap, C cikk, S szereplő, K keret, E esemény */
    const HT = {
      L: { name: "lap", plural: "lapok", n: 4, lab: i => PAP[i], tex: "L" },
      C: { name: "cikk", plural: "cikkek", n: 12, lab: i => "C" + (i + 1), tex: "C" },
      S: { name: "szereplő", plural: "szereplők", n: 7, lab: i => IDS[i], tex: "Sz" },
      K: { name: "keret", plural: "keretek", n: 3, lab: i => FR_SHORT[FR_IDS[i]], tex: "K" },
      E: { name: "esemény", plural: "események", n: 6, lab: i => EVS[i], tex: "E" }
    };
    const TSHORT = { L: "L", C: "C", S: "Sz", K: "K", E: "E" };
    /* cikk × másik típus incidencia (12 × n) */
    const INC = {
      L: ART.map(a => PAP.map(p => (a.paper === p ? 1 : 0))),
      S: ART.map(a => IDS.map(s => (a.mentions.includes(s) ? 1 : 0))),
      K: ART.map(a => FR_IDS.map(f => (a.frame === f ? 1 : 0))),
      E: ART.map(a => EVS.map((_, k) => (evOf(a) === k ? 1 : 0)))
    };
    const ETYPE = { L: "közli", S: "említi", K: "keretezi", E: "része" };      // a C–X él neve
    const T = M => M[0].map((_, j) => M.map(r => r[j]));
    const mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
    /* két típus közti szomszédsági mátrix (az egyik mindig C) */
    const adjT = (X, Y) => (X === "C" ? INC[Y] : T(INC[X]));
    const mpMatrix = seq => { let M = adjT(seq[0], seq[1]); for (let i = 1; i < seq.length - 1; i++) M = mul(M, adjT(seq[i], seq[i + 1])); return M; };
    /* az összes út a metaútvonal mentén a → b (csúcsindexek típusonként) */
    function mpPaths(seq, a, b) {
      const out = [];
      const go = (k, path) => {
        if (k === seq.length - 1) { if (path[k] === b) out.push(path.slice()); return; }
        const A = adjT(seq[k], seq[k + 1]);
        A[path[k]].forEach((v, j) => { if (v) { path.push(j); go(k + 1, path); path.pop(); } });
      };
      go(0, [a]);
      return out;
    }
    const MATNAME = { LC: "A_{LC}", CL: "A_{CL}", CS: "A_{CS}", SC: "A_{CS}^{\\top}", CK: "A_{CK}", KC: "A_{CK}^{\\top}", CE: "A_{CE}", EC: "A_{CE}^{\\top}" };
    const mpTex = seq => seq.slice(0, -1).map((x, i) => MATNAME[x + seq[i + 1]]).join("");
    const mpName = seq => seq.map(x => TSHORT[x]).join("–");

    /* ------------------------------------------------------------------
       12.2  relation-message – R-GCN: éltípusonként külön súly
       ------------------------------------------------------------------ */
    W["relation-message"] = root => {
      header(root, "Relációs üzenetküldés: számít, milyen az él",
        "Szereplők az Árvízhétből, két éltípussal: <b>+ támogat</b> és <b>− bírál</b>. Minden csúcsnak egyetlen jellemzője van, $x_v$ – alapból csak a kormányé 1 („a kormány oldala”). " +
        "Egy réteg: $h_v' = w_0 x_v + \\sum_r w_r \\cdot \\text{átlag}_{u \\in N_r(v)}\\, x_u$. <b>Kattints egy csúcsra</b>: látod a beérkező üzeneteit. Az $x$ értékét a táblázat gombjával váltod.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let all7 = false, mode = "rgcn", relu = false, sel = "Sz";
      const x = Object.fromEntries(IDS.map(id => [id, id === "Ko" ? 1 : 0]));
      const w = { w0: 1, wp: 1, wm: -1, wi: 0 };

      const c1 = h("div", { class: "controls" });
      const paintM = toggleGroup(c1, [["hom", "homogén (egy súly: $w_+$ minden élre)"], ["rgcn", "R-GCN (típusonként)"], ["dir", "R-GCN, irányított"]], mode, v => { mode = v; update(); });
      math(c1);
      const c2 = h("div", { class: "controls" });
      const S0 = slider(c2, "$w_0$", "w0 (saját)", -2, 2, 0.5, w.w0, v => { w.w0 = v; update(); }, 1);
      const Sp = slider(c2, "$w_+$", "w+ (támogat)", -2, 2, 0.5, w.wp, v => { w.wp = v; update(); }, 1);
      const Sm = slider(c2, "$w_-$", "w− (bírál)", -2, 2, 0.5, w.wm, v => { w.wm = v; update(); }, 1);
      const Si = slider(c2, "$w_{-^{-1}}$", "w− inverz (bírálták)", -2, 2, 0.5, w.wi, v => { w.wi = v; update(); }, 1);
      const c3 = h("div", { class: "controls" });
      const cbR = h("input", { type: "checkbox", onchange: () => { relu = cbR.checked; update(); } });
      c3.append(h("label", null, cbR, "ReLU a végén"));
      const b7 = btn("mind a 7 szereplő", () => { all7 = !all7; b7.textContent = all7 ? "csak 4 szereplő" : "mind a 7 szereplő"; update(); });
      c3.append(b7, btn("alapállapot", () => {
        Object.assign(w, { w0: 1, wp: 1, wm: -1, wi: 0 }); [S0, Sp, Sm, Si].forEach((s, i) => s.set([1, 1, -1, 0][i]));
        IDS.forEach(id => { x[id] = id === "Ko" ? 1 : 0; }); relu = false; cbR.checked = false; sel = "Sz"; all7 = false; b7.textContent = "mind a 7 szereplő"; mode = "rgcn"; paintM(mode); update();
      }));
      root.append(c1, c2, c3);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const asp = narrow ? 0.62 : 0.6;
      const view = new GK.View(left, { aspect: asp, radius: narrow ? 15 : 17, draggable: false, maxW: 460, showWeights: true,
        onNodeClick: i => { sel = cur[i]; update(); } });
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legend);
      const ro = h("div", { class: "readout", style: "margin-top:0" });
      right.append(ro);
      const tw = h("div", { class: "tw", style: "overflow-x:auto" });
      const par = h("div", { class: "readout" });
      root.append(tw, par);
      root.append(muted("<b>Tanulság:</b> Homogén üzenetküldéssel a bíráló szakértő ugyanúgy »a kormány oldalán« áll, mint a támogató polgármester – az éltípus nélkül a modell nem tudja, mit jelent a kapcsolat."));

      let cur = [];
      /* N_r(v) típusonként, a módtól függően; eredmény: { v: [{ r, w, N }] } */
      function nbhd(ids, md) {
        const rel = D.relations.filter(r => ids.includes(r.a) && ids.includes(r.b));
        const out = Object.fromEntries(ids.map(v => [v, []]));
        const types = md === "hom" ? [["all", w.wp]] : md === "rgcn" ? [["+", w.wp], ["-", w.wm]] : [["+", w.wp], ["-", w.wm], ["-inv", w.wi]];
        ids.forEach(v => types.forEach(([r, wr]) => {
          let N;
          if (r === "all") N = rel.filter(e => e.a === v || e.b === v).map(e => (e.a === v ? e.b : e.a));
          else if (r === "+" || (r === "-" && md === "rgcn")) { const sg = r === "+" ? 1 : -1; N = rel.filter(e => e.sign === sg && (e.a === v || e.b === v)).map(e => (e.a === v ? e.b : e.a)); }
          else if (r === "-") N = rel.filter(e => e.sign < 0 && e.b === v).map(e => e.a);          // aki őt bírálja (Sz → Ko: Ko kapja)
          else N = rel.filter(e => e.sign < 0 && e.a === v).map(e => e.b);                         // akit ő bírál (inverz: Sz kapja)
          out[v].push({ r, w: wr, N });
        }));
        return out;
      }
      const avg = N => (N.length ? N.reduce((s, u) => s + x[u], 0) / N.length : 0);
      function layer(ids, md) {
        const NB = nbhd(ids, md), H = {};
        ids.forEach(v => { const z = w.w0 * x[v] + NB[v].reduce((s, p) => s + p.w * avg(p.N), 0); H[v] = relu ? Math.max(0, z) : z; });
        return { H, NB };
      }
      const RT = { all: "", "+": "+", "-": "-", "-inv": "-^{-1}" };
      const RNAME = { all: "minden szomszéd", "+": "támogat", "-": "bírál – a bírált kapja", "-inv": "bírálták – a bíráló kapja" };
      const setT = N => (N.length ? `\\{${N.map(texLab).join(", ")}\\}` : "\\emptyset");
      const wT = r => (r === "all" ? "w_+" : `w_{${RT[r]}}`);

      function update() {
        const ids = all7 ? IDS.slice() : ["Ko", "Vi", "Po", "Sz"];
        if (!ids.includes(sel)) sel = "Sz";
        cur = ids;
        Si.lab.style.opacity = mode === "dir" ? 1 : 0.45; Si.inp.disabled = mode !== "dir";
        Sm.lab.style.opacity = mode === "hom" ? 0.45 : 1; Sm.inp.disabled = mode === "hom";
        const L = { hom: layer(ids, "hom"), rgcn: layer(ids, "rgcn"), dir: layer(ids, "dir") }, Hc = L[mode].H;
        // gráf
        const P = GK.normalize(ids.map(i => ACTOR_POS[i]), asp);
        const mx = Math.max(1, ...ids.map(v => Math.abs(Hc[v])));
        const nodes = ids.map((id, k) => ({ label: id, x: P[k][0], y: P[k][1], color: divColor(Hc[id], mx), ink: "--text",
          sub: narrow ? `h′=${fmt(Hc[id], 2)}` : `x=${x[id]} → h′=${fmt(Hc[id], 2)}` }));
        const rel = D.relations.filter(r => ids.includes(r.a) && ids.includes(r.b));
        const edges = rel.map(r => (mode === "hom"
          ? { a: ids.indexOf(r.a), b: ids.indexOf(r.b), w: 1, color: "--muted", width: 2.5, label: "" }
          : { a: ids.indexOf(r.a), b: ids.indexOf(r.b), w: 1, color: r.sign > 0 ? "--setC" : "#ef4444", width: 2.5, dash: r.sign < 0 ? [7, 5] : null,
              label: r.sign > 0 ? "+" : "−", dir: mode === "dir" && r.sign < 0 }));
        view.setGraph(nodes, edges);
        view.hl = new Set([ids.indexOf(sel)]);
        view.hlE = new Set(rel.filter(r => r.a === sel || r.b === sel).map(r => GK.edgeKey(ids.indexOf(r.a), ids.indexOf(r.b))));
        view.dim = false; view.draw();
        legend.innerHTML = (mode === "hom"
          ? `${lineSw("--muted")}él (a homogén modell nem látja a típusát)`
          : `${lineSw("--setC")}+ támogat · ${lineSw("#ef4444", "dashed")}− bírál${mode === "dir" ? " (nyíl: ki kit bírál)" : ""}`) +
          ` · a csúcs színe: $h'$ előjele és nagysága (${sq(divColor(-mx, mx))}negatív, ${sq(divColor(mx, mx))}pozitív)`;
        math(legend);
        // kiírás a kijelölt csúcsra
        const NB = L[mode].NB[sel], tv = texLab(sel);
        let s = `<b>${actorName(sel)}</b> (${sel}) beérkező üzenetei – ${mode === "hom" ? "homogén" : mode === "rgcn" ? "R-GCN" : "R-GCN, irányított"}<br>`;
        NB.forEach(p => { s += `$N_{${RT[p.r] || "\\,"}}(${tv}) = ${setT(p.N)}$ <span class="muted">(${RNAME[p.r]})</span><br>`; });
        const sym = `w_0 x_{${tv}}` + NB.map(p => ` + ${wT(p.r)} \\cdot \\text{átlag}_{N_{${RT[p.r] || "\\,"}}}`).join("");
        const num = `${fmP(w.w0, 1)} \\cdot ${x[sel]}` + NB.map(p => ` + ${fmP(p.w, 1)} \\cdot \\text{átlag}(${p.N.length ? p.N.map(u => x[u]).join(", ") : "\\emptyset"})`).join("");
        const z = w.w0 * x[sel] + NB.reduce((t, p) => t + p.w * avg(p.N), 0);
        const eq = Math.abs(z - +z.toFixed(3)) < 1e-12 ? "=" : "\\approx";
        s += `$h'_{${tv}} = ${relu ? "\\mathrm{ReLU}\\big(" : ""}${sym}${relu ? "\\big)" : ""}$<br>`;
        s += `$\\phantom{h'_{${tv}}} = ${relu ? "\\mathrm{ReLU}\\big(" : ""}${num}${relu ? "\\big)" : ""} ${relu ? "= \\mathrm{ReLU}(" + fmM(z) + ")" : ""} ${eq} ${fmM(relu ? Math.max(0, z) : z)}$`;
        if (NB.some(p => !p.N.length)) s += `<br><span class="muted">Üres szomszédság: az átlag 0.</span>`;
        ro.innerHTML = s;
        math(ro);
        // táblázat
        const colSt = m => (m === mode ? "font-weight:700;color:var(--accent)" : "color:var(--muted)");
        const head = ["csúcs", "$x$", `<span style="${colSt("hom")}">$h'$ homogén</span>`, `<span style="${colSt("rgcn")}">$h'$ R-GCN</span>`, `<span style="${colSt("dir")}">$h'$ irányított</span>`];
        const rows = ids.map(v => `<tr data-v="${v}" style="cursor:pointer;${v === sel ? "background:var(--accent-soft)" : ""}">` +
          td(`<b>${v}</b> <span class="muted">${actorName(v)}</span>`, "text-align:left") +
          td(`<button class="btn" type="button" data-x="${v}" style="padding:.1em .6em;min-width:2.4em" aria-label="${v}: x váltása">${x[v]}</button>`) +
          ["hom", "rgcn", "dir"].map(m => td(fmt(L[m].H[v], 3), colSt(m))).join("") + "</tr>");
        tw.innerHTML = tblH(head, rows);
        math(tw);
        const R = mode === "hom" ? 1 : mode === "rgcn" ? 2 : 3;
        const ws = mode === "hom" ? "w_0, w_+" : mode === "rgcn" ? "w_0, w_+, w_-" : "w_0, w_+, w_-, w_{-^{-1}}";
        par.innerHTML = `ennek a rétegnek $R + 1 = ${R + 1}$ súlya van ($${ws}$)` +
          (mode === "hom" ? " – egyetlen éltípus ($R = 1$)" : mode === "rgcn" ? " – két éltípus ($R = 2$)" : " – a bírál irányított: a fordítottja külön típus ($R = 3$)") +
          `<br><span class="muted">Valódi R-GCN-ben minden $w$ egy $d \\times d$ mátrix ($W_0, W_r$) – a paraméterszám $(R + 1)\\,d^2$.</span>`;
        math(par);
        const pick = m => Object.fromEntries(ids.map(v => [v, +L[m].H[v].toFixed(4)]));
        root.dataset.rm = JSON.stringify({ mode, ids, sel, relu, w, x: Object.fromEntries(ids.map(v => [v, x[v]])), hom: pick("hom"), rgcn: pick("rgcn"), dir: pick("dir"), params: R + 1 });
      }
      tw.addEventListener("click", ev => {
        const b = ev.target.closest("button[data-x]");
        if (b) { const v = b.dataset.x; x[v] = 1 - x[v]; sel = v; update(); return; }
        const tr = ev.target.closest("tr[data-v]"); if (tr) { sel = tr.dataset.v; update(); }
      });
      onTheme(() => update());
      update();
    };

    /* ------------------------------------------------------------------
       12.3  hetero-graph-explorer – heterogén gráf, séma, metaútvonalak
       ------------------------------------------------------------------ */
    const HSTYLE = {
      L: { shape: "pill", fill: "--setA" }, C: { shape: "circle", fill: "--card" }, S: { shape: "circle", fill: "--setB" },
      K: { shape: "diamond", fill: "--setC" }, E: { shape: "hex", fill: "#a855f7" }
    };
    /* SVG-alakzat egy csúcshoz (x, y középpont, r méret) */
    function shapeSVG(shape, x, y, r, st) {
      if (shape === "circle") return `<circle cx="${x}" cy="${y}" r="${r}" style="${st}"/>`;
      if (shape === "pill") return `<rect x="${x - r * 1.45}" y="${y - r * 0.85}" width="${r * 2.9}" height="${r * 1.7}" rx="${r * 0.5}" style="${st}"/>`;
      if (shape === "diamond") return `<polygon points="${x},${y - r * 1.15} ${x + r * 1.15},${y} ${x},${y + r * 1.15} ${x - r * 1.15},${y}" style="${st}"/>`;
      const p = [...Array(6).keys()].map(k => { const t = Math.PI / 6 + k * Math.PI / 3; return `${(x + r * 1.08 * Math.cos(t)).toFixed(1)},${(y + r * 1.08 * Math.sin(t)).toFixed(1)}`; });
      return `<polygon points="${p.join(" ")}" style="${st}"/>`;
    }
    const inkOf = t => (t === "C" ? "var(--text)" : "#fff");
    const legendShape = t => `<svg width="22" height="16" viewBox="0 0 22 16" style="vertical-align:-.25em;margin-right:.2em">${shapeSVG(HSTYLE[t].shape, 11, 8, t === "L" ? 5.2 : 6.2, `fill:${sv(HSTYLE[t].fill)};stroke:var(--text);stroke-width:1`)}</svg>`;

    W["hetero-graph-explorer"] = root => {
      header(root, "Az Árvízhét heterogén gráfja és a metaútvonalak",
        "Öt csúcstípus (lap, cikk, szereplő, keret, esemény) és négy éltípus. Egy <b>metaútvonal</b> típusok sorozata – pl. lap–cikk–szereplő–cikk–lap –, " +
        "és belőle <b>homogén gráf</b> lesz: két lap szomszédos, ha van köztük ilyen út; az élsúly az utak száma. Válassz metaútvonalat, és kattints a mátrix egy cellájára vagy a homogén gráf egy élére: kiemelődnek az utak.");
      const narrow = root.clientWidth < 560;
      const vis = { L: true, C: true, S: true, K: true, E: true };
      const MPS = [
        { k: "LSL", seq: ["L", "C", "S", "C", "L"], txt: "lapok közös szereplőn át", def: [0, 3], ex: [0, 1, 2, 10, 3] },
        { k: "LEL", seq: ["L", "C", "E", "C", "L"], txt: "lapok közös eseményen át", def: [0, 3], ex: [0, 1, 2, 10, 3] },
        { k: "LKL", seq: ["L", "C", "K", "C", "L"], txt: "lapok közös kereten át", def: [0, 3], ex: [0, 0, 0, 9, 3] },
        { k: "SCS", seq: ["S", "C", "S"], txt: "szereplők együttemlítése – az 1. fejezet szereplőgráfja", def: [0, 5], ex: [0, 4, 5] },
        { k: "CSC", seq: ["C", "S", "C"], txt: "cikkek közös szereplőn át", def: [1, 10], ex: [1, 2, 10] },
        { k: "CLC", seq: ["C", "L", "C"], txt: "ugyanaz a lap", def: [0, 1], ex: [0, 0, 1] },
        { k: "CEC", seq: ["C", "E", "C"], txt: "ugyanaz az esemény", def: [1, 10], ex: [1, 2, 10] }
      ];
      let mp = MPS[0], pair = mp.def.slice(), exIdx = 0;

      const c1 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "típusok:"));
      Object.keys(HT).forEach(t => {
        const cb = h("input", { type: "checkbox", "data-t": t, onchange: () => { vis[t] = cb.checked; draw(); } });
        cb.checked = true;
        c1.append(h("label", null, cb, h("span", { html: legendShape(t) }), HT[t].name));
      });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "metaútvonal:"));
      toggleGroup(c2, MPS.map(m => [m.k, mpName(m.seq)]), mp.k, v => { mp = MPS.find(m => m.k === v); pair = mp.def.slice(); exIdx = -1; draw(); });
      root.append(c1, c2);

      const hetBox = h("div", { style: "margin:.3rem 0" });
      const cnt = h("div", { class: "readout" });
      root.append(hetBox, cnt);
      const two = h("div", { class: "two-col", style: "align-items:start;margin-top:.6rem" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const schemaBox = h("div"), homBox = h("div"), homLeg = h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0" });
      left.append(schemaBox, homBox, homLeg);
      const ro = h("div", { class: "readout", style: "margin-top:0" }), tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      right.append(ro, tw);
      root.append(muted("<b>Egy metaútvonal = egy jelentés.</b> Ugyanaz a heterogén gráf hétféle homogén gráfot ad – a modellnek (vagy neked) kell eldöntenie, melyik számít."));

      /* elrendezés: oszlopok – lapok | cikkek | szereplők | keretek + események */
      const Wd = narrow ? 360 : 760, Ht = narrow ? 470 : 410, top = narrow ? 22 : 22, bot = Ht - 22;
      const colX = narrow ? { L: 28, C: 118, S: 218, KE: 300 } : { L: 70, C: 270, S: 480, KE: 670 };
      const R0 = narrow ? 10.5 : 12;
      const yAt = (k, n) => top + (n === 1 ? 0.5 : k / (n - 1)) * (bot - top);
      const SORD = ["Ko", "Vi", "Sz", "Kl", "Po", "La", "Ön"];
      const POS = {
        C: ART.map((_, i) => [colX.C, yAt(i, 12)]),
        L: PAP.map((_, i) => [colX.L, yAt(3 * i + 1, 12)]),
        S: IDS.map(id => [colX.S, top + (SORD.indexOf(id) + 0.5) / 7 * (bot - top)]),
        K: FR_IDS.map((_, i) => [colX.KE, top + (i + 0.5) / 9.6 * (bot - top)]),
        E: EVS.map((_, i) => [colX.KE, top + (i + 3.6 + 0.5) / 9.6 * (bot - top)])
      };
      const ALLE = [];                                       // { t: "L"|"S"|"K"|"E", c: cikk, j: másik index }
      ["L", "S", "K", "E"].forEach(t => INC[t].forEach((row, c) => row.forEach((v, j) => { if (v) ALLE.push({ t, c, j }); })));

      const pathNodes = (seq, path) => path.map((v, k) => seq[k] + v);
      function hetSVG(paths, ex) {
        const hlN = new Set(), hlE = new Set(), exN = new Set(), exE = new Set();
        const eKey = (t, c, j) => t + ":" + c + ":" + j;
        const addP = (p, NS, ES) => {
          pathNodes(mp.seq, p).forEach(x => NS.add(x));
          for (let k = 0; k < mp.seq.length - 1; k++) {
            const [X, Y] = [mp.seq[k], mp.seq[k + 1]];
            ES.add(X === "C" ? eKey(Y, p[k], p[k + 1]) : eKey(X, p[k + 1], p[k]));
          }
        };
        paths.forEach(p => addP(p, hlN, hlE));
        if (ex) addP(ex, exN, exE);
        const any = hlN.size > 0;
        let s = "";
        ALLE.forEach(e => {
          if (!vis.C || !vis[e.t]) return;
          const [x1, y1] = POS.C[e.c], [x2, y2] = POS[e.t][e.j], k = eKey(e.t, e.c, e.j);
          const st = exE.has(k) ? "stroke:var(--accent);stroke-width:3.6" : hlE.has(k) ? "stroke:var(--accent);stroke-width:1.8;stroke-opacity:.75"
            : `stroke:var(--muted);stroke-width:1;stroke-opacity:${any ? 0.18 : 0.45}`;
          s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="${st}"/>`;
        });
        Object.keys(HT).forEach(t => {
          if (!vis[t]) return;
          POS[t].forEach(([x, y], i) => {
            const id = t + i, on = hlN.has(id), exOn = exN.has(id);
            const st = `fill:${sv(HSTYLE[t].fill)};stroke:${exOn || on ? "var(--accent)" : "var(--text)"};stroke-width:${exOn ? 3.2 : on ? 2.4 : 1.2};opacity:${any && !on ? 0.6 : 1}`;
            s += `<g data-n="${id}">` + shapeSVG(HSTYLE[t].shape, x, y, t === "L" ? R0 * 0.95 : R0, st);
            const lab = HT[t].lab(i);
            if (t === "K") s += `<text x="${x + R0 * 1.4}" y="${y + 0.5}" style="fill:var(--text);font-size:${narrow ? 10 : 11}px;font-weight:600;dominant-baseline:middle;opacity:${any && !on ? 0.5 : 1}">${esc(lab)}</text>`;
            else s += `<text x="${x}" y="${y + 0.5}" text-anchor="middle" style="fill:${inkOf(t)};font-size:${lab.length > 2 ? (narrow ? 8.5 : 9.5) : narrow ? 10 : 11}px;font-weight:600;dominant-baseline:middle;opacity:${any && !on ? 0.6 : 1}">${esc(lab)}</text>`;
            s += "</g>";
          });
        });
        // oszlopfejlécek
        const heads = [["L", colX.L], ["C", colX.C], ["S", colX.S]];
        let hd = heads.map(([t, x]) => `<text x="${x}" y="10" text-anchor="middle" style="fill:var(--muted);font-size:10px">${HT[t].plural}</text>`).join("");
        hd += `<text x="${colX.KE}" y="10" text-anchor="middle" style="fill:var(--muted);font-size:10px">${narrow ? "K + E" : "keretek, események"}</text>`;
        return `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;margin:auto" role="img" aria-label="az Árvízhét heterogén gráfja">${hd}${s}</svg>`;
      }
      function schemaSVG() {
        const P = { L: [40, 78], C: [140, 78], S: [250, 26], K: [262, 78], E: [250, 130] };
        const onE = new Set(); for (let k = 0; k < mp.seq.length - 1; k++) onE.add([mp.seq[k], mp.seq[k + 1]].sort().join(""));
        let s = "";
        ["L", "S", "K", "E"].forEach(t => {
          const on = onE.has(["C", t].sort().join("")), [x1, y1] = P.C, [x2, y2] = P[t];
          s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${on ? "var(--accent)" : "var(--muted)"};stroke-width:${on ? 3.5 : 1.5};${vis[t] && vis.C ? "" : "stroke-dasharray:3 4;"}"/>`;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (t === "L" ? -7 : t === "S" ? -6 : t === "E" ? 12 : -6);
          s += `<text x="${mx + (t === "L" ? 0 : t === "K" ? 0 : -4)}" y="${my}" text-anchor="middle" style="fill:${on ? "var(--accent)" : "var(--muted)"};font-size:10.5px;${on ? "font-weight:700" : ""}">${ETYPE[t]}</text>`;
        });
        const inMp = new Set(mp.seq);
        Object.keys(P).forEach(t => {
          const [x, y] = P[t], on = inMp.has(t);
          s += shapeSVG(HSTYLE[t].shape, x, y, t === "L" ? 12 : 14, `fill:${sv(HSTYLE[t].fill)};stroke:${on ? "var(--accent)" : "var(--text)"};stroke-width:${on ? 3 : 1.2};opacity:${vis[t] ? 1 : 0.4}`);
          s += `<text x="${x}" y="${y + 0.5}" text-anchor="middle" style="fill:${inkOf(t)};font-size:11px;font-weight:700;dominant-baseline:middle">${TSHORT[t]}</text>`;
        });
        return `<div class="muted" style="font-size:.84rem">hálózati séma (típusok és éltípusok) – kiemelve a metaútvonal:</div>` +
          `<svg viewBox="0 0 300 150" style="width:100%;max-width:300px;display:block;margin:.1rem auto .4rem" role="img" aria-label="hálózati séma">${s}</svg>`;
      }
      /* a kapott homogén gráf: a kezdőtípus csúcsai, élsúly = utak száma */
      function homSVG(M, t) {
        const n = HT[t].n, Wd2 = 320, Ht2 = t === "C" ? 300 : t === "L" ? 220 : 230;
        let P;
        if (t === "S") P = GK.normalize(IDS.map(i => ACTOR_POS[i]), Ht2 / Wd2).map(p => [p[0] * Wd2, p[1] * Ht2]);
        else if (t === "L") P = [[70, 55], [250, 55], [70, 165], [250, 165]];
        else P = GK.circleLayout(12).map(p => [Wd2 / 2 + (p[0] - 0.5) * Wd2 * 0.95, Ht2 / 2 + (p[1] - 0.5) * Ht2 * 0.95]);
        const mx = Math.max(1, ...M.flatMap((r, i) => r.filter((_, j) => j !== i)));
        let s = "", lb = "";
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          if (!M[i][j]) continue;
          const on = (pair[0] === i && pair[1] === j) || (pair[0] === j && pair[1] === i);
          const [x1, y1] = P[i], [x2, y2] = P[j];
          s += `<line data-i="${i}" data-j="${j}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="cursor:pointer;stroke:${on ? "var(--accent)" : "var(--muted)"};stroke-width:${(on ? 1.5 : 0) + 1.2 + 3 * M[i][j] / mx};stroke-opacity:${on ? 1 : 0.6}"/>`;
          s += `<line data-i="${i}" data-j="${j}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="cursor:pointer;stroke:transparent;stroke-width:14"/>`;
          if (t !== "C" || M[i][j] > 1 || on) {
            const f = t === "C" ? 0.5 : 0.5, mxx = x1 + (x2 - x1) * f, myy = y1 + (y2 - y1) * f;
            lb += `<g data-i="${i}" data-j="${j}" style="cursor:pointer"><circle cx="${mxx}" cy="${myy}" r="8.5" style="fill:var(--card);stroke:${on ? "var(--accent)" : "var(--border)"}"/>` +
              `<text x="${mxx}" y="${myy + 0.5}" text-anchor="middle" style="fill:var(--text);font-size:10.5px;font-weight:600;dominant-baseline:middle">${M[i][j]}</text></g>`;
          }
        }
        let nd = "";
        for (let i = 0; i < n; i++) {
          const [x, y] = P[i], on = pair.includes(i);
          nd += shapeSVG(HSTYLE[t].shape, x, y, t === "L" ? 12 : 13, `fill:${sv(HSTYLE[t].fill)};stroke:${on ? "var(--accent)" : "var(--text)"};stroke-width:${on ? 3 : 1.2}`);
          const lab = HT[t].lab(i);
          nd += `<text x="${x}" y="${y + 0.5}" text-anchor="middle" style="fill:${inkOf(t)};font-size:${lab.length > 2 ? 9.5 : 11}px;font-weight:600;dominant-baseline:middle">${esc(lab)}</text>`;
        }
        return `<div class="muted" style="font-size:.84rem;margin-top:.3rem">a kapott homogén gráf (${HT[t].plural}; az élen: az utak száma):</div>` +
          `<svg class="hom" viewBox="0 0 ${Wd2} ${Ht2}" style="width:100%;max-width:${Wd2}px;display:block;margin:auto;touch-action:manipulation" role="img" aria-label="homogén gráf">${s}${lb}${nd}</svg>`;
      }
      function counts() {
        const nT = Object.fromEntries(Object.keys(HT).map(t => [t, vis[t] ? HT[t].n : 0]));
        const eT = Object.fromEntries(["L", "S", "K", "E"].map(t => [t, vis.C && vis[t] ? ALLE.filter(e => e.t === t).length : 0]));
        return { nT, eT, n: Object.values(nT).reduce((a, b) => a + b, 0), m: Object.values(eT).reduce((a, b) => a + b, 0) };
      }
      function draw() {
        const t0 = mp.seq[0], M = mpMatrix(mp.seq), n = M.length;
        const paths = mpPaths(mp.seq, pair[0], pair[1]);
        if (exIdx < 0) {                                       // alapértelmezett példa-út
          const e = mp.ex; exIdx = Math.max(0, paths.findIndex(p => p.every((v, k) => v === e[k])));
        }
        if (exIdx >= paths.length) exIdx = 0;
        hetBox.innerHTML = hetSVG(paths, paths[exIdx]);
        const C = counts();
        cnt.innerHTML = `csúcsok: ${Object.keys(HT).map(t => `${TSHORT[t]} ${C.nT[t]}`).join(" · ")} = <b>${C.n}</b><br>` +
          `élek: ${["L", "S", "K", "E"].map(t => `C–${TSHORT[t]} <span class="muted">(${ETYPE[t]})</span> ${C.eT[t]}`).join(" · ")} = <b>${C.m}</b>` +
          (mp.seq.some(t => !vis[t]) ? `<br><span class="muted">A metaútvonal egyes típusai most rejtve vannak – a mátrix és a homogén gráf a teljes gráfból számol.</span>` : "");
        schemaBox.innerHTML = schemaSVG();
        homBox.innerHTML = homSVG(M, t0);
        homLeg.innerHTML = `Kattints egy élre (vagy a mátrix egy cellájára): az adott pár útjai kiemelődnek fent.`;
        // mátrix
        const lab = i => HT[t0].lab(i);
        const rows = M.map((r, i) => `<tr><th style="padding:.2em .45em">${esc(lab(i))}</th>` + r.map((v, j) => {
          const on = pair[0] === i && pair[1] === j, dg = i === j;
          return `<td data-i="${i}" data-j="${j}" style="padding:.2em .45em;text-align:center;cursor:pointer;${dg ? "color:var(--muted);opacity:.6;font-style:italic;" : ""}${on ? "background:var(--accent-soft);outline:2px solid var(--accent);font-weight:700;" : ""}${!v && !dg ? "color:var(--muted);" : ""}">${v}</td>`;
        }).join("") + "</tr>");
        tw.innerHTML = `<div style="font-size:.86rem">$${mpTex(mp.seq)}$ <span class="muted">(sorrend: ${[...Array(n).keys()].map(lab).join(", ")})</span></div>` +
          tblH(["", ...[...Array(n).keys()].map(lab)], rows) +
          `<div class="muted" style="font-size:.82rem">A főátló (dőlt, halvány): oda-vissza utak, nem szomszédság.</div>`;
        // kiírás
        let pairs = 0, tot = 0;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (M[i][j]) { pairs++; tot += M[i][j]; }
        const [a, b] = pair, la = lab(a), lb_ = lab(b);
        let s = `<b>${mpName(mp.seq)}</b>: ${mp.txt}<br>` +
          `homogén gráf: ${n} csúcs, <b>${pairs}</b> szomszédos pár (főátlón kívül), összesen ${tot} út<br>`;
        s += `${la} – ${lb_}: <b>${M[a][b]}</b> út${a === b ? " (főátló: oda-vissza)" : ""}`;
        if (paths.length) {
          const show = paths.slice(0, 12).map((p, k) => {
            const txt = p.map((v, q) => HT[mp.seq[q]].lab(v)).join(" – ");
            return `<button type="button" class="btn${k === exIdx ? " on" : ""}" data-p="${k}" style="padding:.05em .45em;margin:.1em .15em;font-size:.82rem">${esc(txt)}</button>`;
          }).join("");
          s += `<br><span class="muted" style="font-size:.85rem">az utak (kattints egyre – ez lesz vastagon kiemelve):</span><br>${show}${paths.length > 12 ? ` <span class="muted">… és még ${paths.length - 12}</span>` : ""}`;
        }
        ro.innerHTML = s;
        math(tw);
        root.dataset.hg = JSON.stringify({ mp: mpName(mp.seq), vis, nodes: C.n, edges: C.m, nT: C.nT, eT: C.eT, M, pairs, tot,
          pair: [la, lb_], nPaths: paths.length, ex: paths[exIdx] ? paths[exIdx].map((v, q) => HT[mp.seq[q]].lab(v)).join("–") : null });
      }
      const pickPair = (i, j) => { pair = [i, j]; exIdx = -1; draw(); };
      tw.addEventListener("click", ev => { const c = ev.target.closest("td[data-i]"); if (c) pickPair(+c.dataset.i, +c.dataset.j); });
      homBox.addEventListener("click", ev => { const c = ev.target.closest("[data-i]"); if (c) pickPair(+c.dataset.i, +c.dataset.j); });
      ro.addEventListener("click", ev => { const b = ev.target.closest("button[data-p]"); if (b) { exIdx = +b.dataset.p; draw(); } });
      exIdx = -1;
      draw();
    };

    /* ------------------------------------------------------------------
       12.7  metapath-vote – keretjóslás metaútvonal-szavazással
       ------------------------------------------------------------------ */
    W["metapath-vote"] = root => {
      header(root, "Keretjóslás metaútvonal-szavazással",
        "Melyik keretben ír egy cikk? Minden cikk a <b>szomszédai</b> kereteire szavaz – háromféle metaútvonal szerint, mindegyik a saját $\\beta$ súlyával: " +
        "$\\text{pont}(c, f) = \\sum_\\Phi \\beta_\\Phi \\sum_{d \\ne c} M^\\Phi_{cd}\\,[y_d = f]$. A cikk <b>önmagára nem szavaz</b> (kihagyásos ellenőrzés). Kattints egy cikkre: látod a szavazatait.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const KEYS = ["L", "S", "E"];
      const MPN = { L: "C–L–C", S: "C–Sz–C", E: "C–E–C" }, MPT = { L: "ugyanaz a lap", S: "közös szereplők száma", E: "ugyanaz az esemény" };
      const DASH = { L: null, S: [7, 5], E: [2, 4] }, KIND = { L: "solid", S: "dashed", E: "dotted" };
      const y = ART.map(a => a.frame);
      const Mf = { L: (c, d) => (ART[c].paper === ART[d].paper ? 1 : 0), S: (c, d) => ART[c].mentions.filter(s => ART[d].mentions.includes(s)).length, E: (c, d) => (evOf(ART[c]) === evOf(ART[d]) ? 1 : 0) };
      let beta = { L: 1, S: 1, E: 0 }, mode = "loo", sel = 9;
      const nw = { S: new Set(["Ko", "Kl"]), paper: "" };

      const c0 = h("div", { class: "controls" });
      toggleGroup(c0, [["loo", "a 12 cikk (mindegyik a többiek alapján)"], ["new", "új cikk"]], mode, v => { mode = v; update(); });
      const c1 = h("div", { class: "controls" });
      const SL = {};
      KEYS.forEach(k => { SL[k] = slider(c1, `$\\beta_{\\text{${MPN[k]}}}$`, "béta " + MPN[k], 0, 2, 0.25, beta[k], v => { beta[k] = v; update(); }, 2); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "előbeállítás:"));
      [["csak lap", [1, 0, 0]], ["csak szereplő", [0, 1, 0]], ["csak esemény", [0, 0, 1]], ["lap + szereplő", [1, 1, 0]], ["mind egyformán", [1, 1, 1]]].forEach(([l, v]) =>
        c2.append(btn(l, () => { KEYS.forEach((k, i) => { beta[k] = v[i]; SL[k].set(v[i]); }); update(); })));
      const cN = h("div", { class: "controls" });
      cN.append(h("span", { class: "muted", style: "font-size:.92rem" }, "az új cikk említi:"));
      IDS.forEach(id => {
        const cb = h("input", { type: "checkbox", "data-a": id, onchange: () => { if (cb.checked) nw.S.add(id); else nw.S.delete(id); update(); } });
        cb.checked = nw.S.has(id);
        cN.append(h("label", { title: actorName(id) }, cb, id));
      });
      const selP = h("select", { "aria-label": "melyik lap közli", onchange: () => { nw.paper = selP.value; update(); } });
      selP.append(h("option", { value: "" }, "ismeretlen lap"), ...D.papers.map(p => h("option", { value: p.id }, p.id + " – " + p.name)));
      cN.append(h("label", null, "lap:", selP));
      root.append(c0, c1, c2, cN);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const asp = narrow ? 0.9 : 0.86;
      const base = GK.normalize(GK.circleLayout(12, -Math.PI / 2 + Math.PI / 12), asp);
      const view = new GK.View(left, { aspect: asp, radius: narrow ? 13 : 14, draggable: false, maxW: 420, showWeights: true,
        onNodeClick: i => { if (i < 12) { sel = sel === i ? -1 : i; update(); } } });
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legend);
      const ro = h("div", { class: "readout", style: "margin-top:0" });
      right.append(ro);
      const sum = h("div", { class: "readout" }), tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(sum, tw);
      root.append(muted("<b>Tanulság:</b> Az esemény-metaútvonal heterofil: egy eseményről több keretben írnak. Egyforma súllyal rontja a jóslatot – a HAN ezért tanul metaútvonal-súlyt."));

      const near = (a, b) => Math.abs(a - b) < 1e-9;
      /* szavazás: nb[k] = [{ d, m }] (a szomszédok és súlyuk metaútvonalanként) → pontszámok, jóslat */
      function vote(nb, truth) {
        const sc = Object.fromEntries(FR_IDS.map(f => [f, 0]));
        KEYS.forEach(k => nb[k].forEach(({ d, m }) => { sc[y[d]] += beta[k] * m; }));
        const best = Math.max(...FR_IDS.map(f => sc[f]));
        if (best <= 1e-12) return { sc, win: [], pt: 0 };
        const win = FR_IDS.filter(f => near(sc[f], best));
        return { sc, win, pt: truth && win.includes(truth) ? 1 / win.length : 0 };
      }
      const nbOf = c => Object.fromEntries(KEYS.map(k => [k, ART.map((_, d) => ({ d, m: d === c ? 0 : Mf[k](c, d) })).filter(o => o.m > 0)]));
      const nbNew = () => ({
        L: nw.paper ? ART.map((a, d) => ({ d, m: a.paper === nw.paper ? 1 : 0 })).filter(o => o.m) : [],
        S: ART.map((a, d) => ({ d, m: a.mentions.filter(s => nw.S.has(s)).length })).filter(o => o.m),
        E: []
      });
      const predTxt = r => (!r.win.length ? "nincs szomszéd" : r.win.length === 1 ? FR_SHORT[r.win[0]] : `döntetlen (${r.win.map(f => FR_SHORT[f]).join("/")})`);
      const mark = r => (r.pt === 1 ? '<b style="color:var(--ok)">✓</b>' : r.pt > 0 ? `<b style="color:var(--setB)">${r.pt === 0.5 ? "½" : fmt(r.pt, 2)}</b>` : '<b style="color:var(--bad)">✗</b>');
      const markTxt = r => (r.pt === 1 ? "✓" : r.pt > 0 ? (r.pt === 0.5 ? "½" : fmt(r.pt, 2)) : "✗");
      function homophily(k) {
        let p = 0, s = 0;
        for (let c = 0; c < 12; c++) for (let d = c + 1; d < 12; d++) if (Mf[k](c, d)) { p++; if (y[c] === y[d]) s++; }
        return { p, s };
      }
      const HOMO = Object.fromEntries(KEYS.map(k => [k, homophily(k)]));
      function breakdown(nb, r, title) {
        let s = `<b>${title}</b><br>`;
        KEYS.forEach(k => {
          const by = FR_IDS.map(f => nb[k].filter(o => y[o.d] === f));
          const parts = FR_IDS.map((f, i) => `${FR_SHORT[f]} ${by[i].reduce((t, o) => t + o.m, 0)}`).join(" · ");
          const who = nb[k].length ? nb[k].map(o => `C${o.d + 1}${o.m > 1 ? "×" + o.m : ""}`).join(", ") : "–";
          s += `<span style="opacity:${beta[k] ? 1 : 0.5}">${lineSw("--muted", KIND[k], 2)}${MPN[k]} ($\\beta = ${fmM(beta[k], 2)}$): ${parts} <span class="muted">[${who}]</span></span><br>`;
        });
        s += "pontszám: " + FR_IDS.map(f => `${FR_SHORT[f]} <b>${fmt(r.sc[f], 2)}</b>`).join(" · ") + `<br>jóslat: <b>${predTxt(r)}</b>`;
        return s;
      }
      function update() {
        const isNew = mode === "new";
        cN.style.display = isNew ? "" : "none";
        tw.style.display = isNew ? "none" : "";
        const res = ART.map((_, c) => vote(nbOf(c), y[c]));
        const exp = res.reduce((t, r) => t + r.pt, 0);
        const NB = isNew ? nbNew() : null, rN = isNew ? vote(NB, null) : null;
        // gráf
        const nodes = ART.map((a, i) => ({ label: String(a.id), x: base[i][0], y: base[i][1], color: FR_COL[a.frame], sub: a.paper, badge: isNew ? null : markTxt(res[i]) }));
        const E = [];
        const focus = isNew ? 12 : sel;
        KEYS.forEach(k => {
          if (!beta[k]) return;
          for (let c = 0; c < 12; c++) for (let d = c + 1; d < 12; d++) {
            const m = Mf[k](c, d); if (!m) continue;
            const on = focus === c || focus === d;
            E.push({ a: c, b: d, w: m, dash: DASH[k], color: on ? "--accent" : "--muted", width: on ? 2.4 : 1.4, alpha: focus >= 0 && !on ? 0.22 : 0.85, label: on && k === "S" && m > 1 ? String(m) : "" });
          }
        });
        if (isNew) {
          nodes.push({ label: "új", x: 0.5, y: 0.5, color: "--accent", sub: nw.paper || "?" });
          KEYS.forEach(k => { if (beta[k]) NB[k].forEach(({ d, m }) => E.push({ a: 12, b: d, w: m, dash: DASH[k], color: "--accent", width: 2.2, alpha: 0.9, label: k === "S" && m > 1 ? String(m) : "" })); });
        }
        view.setGraph(nodes, E);
        view.hl = new Set(focus >= 0 && focus < 12 ? [focus] : []); view.dim = false; view.draw();
        legend.innerHTML = FR_IDS.map(f => `${sq(FR_COL[f])}${D.frames[f]}`).join(" · ") + "<br>" +
          KEYS.map(k => `${lineSw("--muted", KIND[k], 2)}${MPN[k]}`).join(" · ") + (isNew ? "" : " · a csúcs mellett: ✓ / ½ / ✗") +
          `<br><span class="muted">csak a $\\beta > 0$ metaútvonalak élei látszanak; a csúcs alatt a lap</span>`;
        math(legend);
        // kiírás
        if (isNew) {
          ro.innerHTML = breakdown(NB, rN, `új cikk: ${nw.S.size ? [...nw.S].join(", ") : "nem említ senkit"} · ${nw.paper || "ismeretlen lap"}`) +
            `<br><span class="muted">Most mind a 12 cikk szavaz. Az új cikknek még nincs eseménye, a C–E–C itt nem ad szavazatot.</span>`;
        } else if (sel >= 0) {
          ro.innerHTML = breakdown(nbOf(sel), res[sel], `C${sel + 1} (${ART[sel].paper}) – valódi keret: ${D.frames[y[sel]]}`) + ` ${mark(res[sel])}`;
        } else ro.innerHTML = "Kattints egy cikkre a gráfon vagy a táblázatban!";
        math(ro);
        const maj = Math.max(...FR_IDS.map(f => y.filter(v => v === f).length));
        sum.innerHTML = (isNew ? "" : `várható találat: <b>${fmt(exp, 2)} / 12</b> · összevetésként a többségi alapvonal: ${maj} / 12 (mindenre „lakossági veszteség”)<br>`) +
          "élhomofília (a szomszédos cikkpárok közül azonos keretű): " +
          KEYS.map(k => `${MPN[k]} ${HOMO[k].s}/${HOMO[k].p} = <b>${fmt(100 * HOMO[k].s / HOMO[k].p, 0)}%</b>`).join(" · ");
        if (!isNew) {
          const head = ["cikk", "lap", "valódi keret", ...FR_IDS.map(f => FR_SHORT[f]), "jóslat", ""];
          const rows = res.map((r, c) => {
            const best = Math.max(...FR_IDS.map(f => r.sc[f]));
            return `<tr data-c="${c}" style="cursor:pointer;${c === sel ? "background:var(--accent-soft)" : ""}">` + td(`C${c + 1}`) + td(ART[c].paper) +
              td(`${sq(FR_COL[y[c]])}${FR_SHORT[y[c]]}`, "text-align:left") +
              FR_IDS.map(f => td(fmt(r.sc[f], 2), best > 0 && near(r.sc[f], best) ? "font-weight:700" : "color:var(--muted)")).join("") +
              td(predTxt(r)) + td(mark(r)) + "</tr>";
          });
          tw.innerHTML = tblH(head, rows);
        }
        root.dataset.mv = JSON.stringify({ mode, beta, exp: +exp.toFixed(4), wrong: res.map((r, c) => (r.pt < 1 ? `C${c + 1}:${predTxt(r)}:${fmt(r.pt, 2)}` : null)).filter(Boolean),
          homo: Object.fromEntries(KEYS.map(k => [MPN[k], [HOMO[k].s, HOMO[k].p]])), sel: sel >= 0 ? sel + 1 : null,
          nw: isNew ? { S: [...nw.S], paper: nw.paper, sc: Object.fromEntries(FR_IDS.map(f => [f, +rN.sc[f].toFixed(4)])), pred: predTxt(rN) } : null });
      }
      tw.addEventListener("click", ev => { const tr = ev.target.closest("tr[data-c]"); if (tr) { sel = +tr.dataset.c; update(); } });
      update();
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
