/* =========================================================
   Gráfelmélet és hálózattudomány 10. fejezet – interaktív szemléltetések
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

  const W = {};
