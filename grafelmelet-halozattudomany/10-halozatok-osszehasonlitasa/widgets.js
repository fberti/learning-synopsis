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
  /* ==================================================================
     w1: 10.1–10.4 widgetjei (overlap-compare, naive-vs-qap, qap-lab, mrqap-lab)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");                 // KaTeX-be
    const pct = (x, d = 0) => fmt(100 * x, d) + " %";
    const big = x => { const s = String(Math.round(x)); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s; };
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dash = (c, dashed) => `<span style="display:inline-block;width:1.6em;height:0;border-top:3px ${dashed ? "dashed" : "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const sq = c => `<span style="display:inline-block;width:.85em;height:.85em;border-radius:2px;background:${sv(c)};vertical-align:-.08em;margin-right:.25em"></span>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    /* p-érték kiírása: 0 permutációs találat → „< 1/runs” */
    const pTxt = (p, runs = 0) => (runs && p === 0 ? "< " + fmt(1 / runs, 4) : p < 0.001 ? "< 0,001" : fmt(p, 3));
    /* láthatóság: fn(true/false) */
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
    /* koordináta-rendszer a vásznon → { X, Y } */
    function frame(o, { x0 = 0, x1 = 1, y0 = 0, y1 = 1, xt = [], yt = [], xl = "", yl = "", fx = v => fmt(v, 2), fy = v => fmt(v, 2), pad = {} }) {
      const ctx = o.ctx, Wd = o.w, Ht = o.h, P = Object.assign({ l: 52, r: 12, t: 12, b: 36 }, pad);
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
    /* szép osztásközök [lo; hi]-ra */
    function ticks(lo, hi, k = 5) {
      const span = hi - lo || 1, raw = span / k, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
      const st = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p, out = [];
      for (let v = Math.ceil(lo / st) * st; v <= hi + 1e-9; v += st) out.push(Math.abs(v) < 1e-12 ? 0 : +v.toFixed(10));
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
    /* színek gyors keveréshez (rajzolásonként egyszer olvassuk ki) */
    const lerpC = (a, b, t) => `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(",")})`;
    const normal = R => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R());     // Box–Muller
    /* a HIBÁS permutációs próba: a főátlón kívüli cellák vektorát egyenként keverjük (Fisher–Yates) */
    function shuffleVec(v, R) { const a = v.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    /* cellavektor vissza mátrixba (ugyanaz a cellasorrend, mint az offdiag-ban) */
    function vecToMat(v, n, directed) {
      const M = zeros(n); let k = 0;
      for (let i = 0; i < n; i++) for (let j = directed ? 0 : i + 1; j < n; j++) if (i !== j) { M[i][j] = v[k++]; if (!directed) M[j][i] = M[i][j]; }
      return M;
    }
    const bin = M => M.map(r => r.map(v => (v > 0 ? 1 : 0)));
    const inv = P => { const q = new Array(P.length); P.forEach((v, i) => (q[v] = i)); return q; };

    /* ------------------------------------------------------------------
       10.1  overlap-compare – két részkorpusz hálózatának élátfedése
       ------------------------------------------------------------------ */
    W["overlap-compare"] = root => {
      header(root, "Két hálózat élátfedése: Jaccard-index",
        "Az Árvízhét szereplő-együttemlítési hálózata <b>részkorpuszokon</b>: két szereplő között él van, ha egy cikkben együtt szerepelnek, a súly a közös cikkek száma. " +
        "Válaszd ki a két oldalt! Mindkét rajzon ugyanott van a 7 szereplő, a vonalvastagság a súly. A közös élek kiemelve, a csak az egyik oldalon meglévők szaggatottan.");
      const narrow = root.clientWidth < 560;
      const DAY1 = ["H", "K", "Sze"];
      const SRC = [
        ["RH", "Reggeli Hírlap", a => a.paper === "RH"], ["EK", "Esti Krónika", a => a.paper === "EK"],
        ["NY", "Nyitott Szó", a => a.paper === "NY"], ["VN", "Vidéki Napló", a => a.paper === "VN"],
        ["first", "hét eleje (H–Sze)", a => DAY1.includes(a.day)], ["second", "hét vége (Cs–V)", a => !DAY1.includes(a.day)],
        ["all", "mind a 12 cikk", () => true]];
      const short = { RH: "RH", EK: "EK", NY: "NY", VN: "VN", first: "H–Sze", second: "Cs–V", all: "mind" };
      const M = {}; SRC.forEach(([k, , f]) => { M[k] = arvizMatrix(f); });
      let L = "VN", Rt = "NY";

      const c1 = h("div", { class: "controls" });
      const mkSel = (val, on) => {
        const s = h("select", { "aria-label": "részkorpusz", onchange: () => on(s.value) }, ...SRC.map(([k, l]) => h("option", { value: k }, l)));
        s.value = val; return s;
      };
      const sL = mkSel(L, v => { L = v; update(); }), sR = mkSel(Rt, v => { Rt = v; update(); });
      c1.append(h("label", null, "bal:", sL), h("label", null, "jobb:", sR),
        btn("⇄ csere", () => { [L, Rt] = [Rt, L]; sL.value = L; sR.value = Rt; update(); }));
      root.append(c1);

      const grid = h("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:.6rem" });
      const boxL = h("div"), boxR = h("div");
      const capL = h("div", { class: "muted", style: "font-size:.88rem;text-align:center;font-weight:600" }), capR = capL.cloneNode();
      boxL.append(capL); boxR.append(capR); grid.append(boxL, boxR);
      root.append(grid);
      const asp = 0.8, g0 = preset("arviz", asp);
      const nodesSmall = g0.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y }));
      const vL = new GK.View(boxL, { aspect: asp, radius: narrow ? 10 : 14, draggable: false, maxW: 360 });
      const vR = new GK.View(boxR, { aspect: asp, radius: narrow ? 10 : 14, draggable: false, maxW: 360 });
      const two = h("div", { class: "two-col", style: "margin-top:.6rem;align-items:start" }), boxO = h("div"), side = h("div");
      two.append(boxO, side); root.append(two);
      boxO.append(h("div", { class: "muted", style: "font-size:.88rem;text-align:center;font-weight:600" }, "egymásra téve"));
      const vO = new GK.View(boxO, { aspect: asp, radius: narrow ? 12 : 13, draggable: false, maxW: 420 });
      boxO.append(h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html:
        `${dash("--accent")}közös ${dash("--setA", true)}csak bal ${dash("--setB", true)}csak jobb` }));
      const ro = h("div", { class: "readout" }), etab = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      side.append(ro, etab);
      root.append(h("p", { class: "muted", style: "margin:.8rem 0 .2rem;font-size:.9rem" }, "A négy lap páronként (cellában a Jaccard-index; kattints egy cellára):"));
      const jtab = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(jtab);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A Jaccard azt mondja meg, mennyi a közös – azt nem, hogy ez sok-e. Ehhez nullmodell kell (10.3)."));

      const wid = w => 1.4 + 1.5 * w;
      function update() {
        const A = M[L], B = M[Rt], ids = ARV_IDS, n = ids.length, J = jaccard(A, B);
        const nameOf = k => SRC.find(s => s[0] === k)[1];
        capL.textContent = "bal: " + nameOf(L); capR.textContent = "jobb: " + nameOf(Rt);
        const mk = (X, Y) => {
          const E = [];
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (X[i][j] > 0) {
            const both = Y[i][j] > 0;
            E.push({ a: i, b: j, w: X[i][j], color: both ? "--accent" : "--muted", dash: both ? null : [6, 4], width: wid(X[i][j]), alpha: both ? 1 : 0.85 });
          }
          return E;
        };
        vL.setGraph(nodesSmall, mk(A, B)); vR.setGraph(nodesSmall, mk(B, A));
        const EO = [], rows = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const a = A[i][j], b = B[i][j];
          if (!a && !b) continue;
          const c = a && b ? "--accent" : a ? "--setA" : "--setB";
          EO.push({ a: i, b: j, w: Math.max(a, b), color: c, dash: a && b ? null : [6, 4], width: wid(Math.max(a, b)) });
          rows.push([ids[i] + "–" + ids[j], a, b, c]);
        }
        vO.setGraph(narrow ? nodesSmall : g0.nodes, EO);
        ro.innerHTML = `közös élek: <b>${J.both}</b> · unió: <b>${J.any}</b><br>$J = \\dfrac{|E_1 \\cap E_2|}{|E_1 \\cup E_2|} = \\dfrac{${J.both}}{${J.any}} = ${fmM(J.J, 3)}$` +
          `<br>$J_w = \\dfrac{\\sum \\min}{\\sum \\max} = \\dfrac{${J.wMin}}{${J.wMax}} = ${fmM(J.Jw, 3)}$`;
        etab.innerHTML = `<table class="tbl" style="font-size:.85rem"><thead><tr><th>él</th><th>bal</th><th>jobb</th><th>min</th><th>max</th></tr></thead><tbody>` +
          rows.map(([e, a, b, c]) => `<tr><td>${sq(c)}${e}</td><td>${a}</td><td>${b}</td><td>${Math.min(a, b)}</td><td>${Math.max(a, b)}</td></tr>`).join("") +
          `<tr style="font-weight:600"><td>összesen</td><td></td><td></td><td>${J.wMin}</td><td>${J.wMax}</td></tr></tbody></table>`;
        const P4 = ["RH", "EK", "NY", "VN"];
        let t = `<table class="tbl" style="font-size:.85rem;text-align:center"><thead><tr><th></th>${P4.map(p => `<th>${p}</th>`).join("")}</tr></thead><tbody>`;
        P4.forEach(p => {
          t += `<tr><th>${p}</th>` + P4.map(q => {
            const j = jaccard(M[p], M[q]), sel = (p === L && q === Rt) || (p === Rt && q === L);
            const st = sel ? "background:var(--accent-soft);font-weight:700;color:var(--accent);" : p === q ? "color:var(--muted);" : "";
            return `<td data-p="${p}" data-q="${q}" style="cursor:pointer;text-align:center;${st}">${fmt(j.J, 2)}<br><span class="muted" style="font-size:.75rem">${j.both}/${j.any}</span></td>`;
          }).join("") + "</tr>";
        });
        jtab.innerHTML = t + "</tbody></table>";
        root.dataset.ov = JSON.stringify({ L, R: Rt, both: J.both, any: J.any, J: +J.J.toFixed(4), wMin: J.wMin, wMax: J.wMax, Jw: +J.Jw.toFixed(4) });
        math(ro);
      }
      jtab.addEventListener("click", ev => {
        const td = ev.target.closest("td[data-p]"); if (!td || td.dataset.p === td.dataset.q) return;
        L = td.dataset.p; Rt = td.dataset.q; sL.value = L; sR.value = Rt; update();
      });
      update();
    };

    /* ------------------------------------------------------------------
       10.2  naive-vs-qap – két független hálózat, csúcshatással
       ------------------------------------------------------------------ */
    W["naive-vs-qap"] = root => {
      header(root, "Miért rossz a naiv p-érték?",
        "Két <b>egymástól független</b> véletlen súlyozott hálózat $n$ csúcson: $X_{ij} = \\rho\\,(u_i + u_j) + \\varepsilon_{ij}$, $Y_{ij} = \\rho\\,(v_i + v_j) + \\eta_{ij}$ " +
        "(minden tag független standard normális, $\\varepsilon_{ij} = \\varepsilon_{ji}$). A $\\rho$ a <b>csúcshatás</b>: van, aki minden hálózatban aktív (pl. egy sokat nyilatkozó szereplő), " +
        "ezért egy csúcs sorának cellái együtt mozognak. A két hálózat között semmi kapcsolat nincs – egy jó próba az esetek 5%-ában téved.");
      math(root.querySelector(".w-sub"));
      let n = 20, rho = 1, seed = 1, stop = null;
      const hist = [];
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "n ="));
      toggleGroup(c1, [[10, "10"], [20, "20"], [40, "40"]], n, v => { n = v; cancel(); one(); });
      const rOut = h("b", { style: "font-family:var(--mono);min-width:2.2em" }, fmt(rho, 1));
      const rSl = h("input", { type: "range", min: 0, max: 2, step: 0.1, value: rho, "aria-label": "ρ", style: "width:9rem;max-width:40vw",
        oninput: () => { rho = +rSl.value; rOut.textContent = fmt(rho, 1); }, onchange: () => { cancel(); one(); } });
      c1.append(h("label", null, "csúcshatás ρ =", rSl, rOut));
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      c2.append(btn("1 kísérlet", () => { seed++; one(); }, "btn primary"), btn("200 kísérlet", () => many()), prog);
      root.append(c1, c2);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const hm = canvasBox(left, 0.56, 480), sc = canvasBox(right, 0.78, 420);
      left.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0", html:
        `${sq("--setA")}negatív ${sq("--setB")}pozitív cella · a csúcsok sorai csíkosak, ha ρ nagy` }));
      const ro = h("div", { class: "readout" });
      root.append(ro);
      const simBox = h("div", { style: "display:none;margin-top:.6rem" }), simTwo = h("div", { class: "two-col", style: "align-items:start" });
      const barBox = h("div"), tabBox = h("div", { class: "tw", style: "overflow-x:auto" });
      simTwo.append(barBox, tabBox); simBox.append(simTwo); root.append(simBox);
      const bars = canvasBox(barBox, 0.7, 380);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Ha a csúcsoknak saját »aktivitásuk« van, két teljesen független hálózat is gyakran »szignifikánsan« korrelál a naiv próbával – a QAP tartja az 5%-ot."));

      function gen(R) {
        const u = [], v = []; for (let i = 0; i < n; i++) { u.push(normal(R)); v.push(normal(R)); }
        const X = zeros(n), Y = zeros(n);
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          X[i][j] = X[j][i] = rho * (u[i] + u[j]) + Math.SQRT1_2 * normal(R);   // zaj szórásnégyzete 0,5 (mint (E + Eᵀ)/2)
          Y[i][j] = Y[j][i] = rho * (v[i] + v[j]) + Math.SQRT1_2 * normal(R);
        }
        return { X, Y };
      }
      /* egy kísérlet: r, naiv p, QAP p (kétoldali, (k+1)/(runs+1)) */
      function test(X, Y, runs, R) {
        const a = offdiag(X), r = pearson(a, offdiag(Y)), N = a.length;
        let c = 0; for (let k = 0; k < runs; k++) if (Math.abs(pearson(a, offdiag(Y, false, randPerm(n, R)))) >= Math.abs(r) - 1e-12) c++;
        return { r, naive: naiveCorrP(r, N), qap: (c + 1) / (runs + 1), N };
      }
      let last = null;
      function one() {
        const R = rng(seed * 7919 + 17), g = gen(R), t = test(g.X, g.Y, 199, R);
        last = { g, t }; drawOne();
        ro.innerHTML = `$r = ${fmM(t.r, 3)}$ (${t.N} cellapár) · naiv p = <b>${pTxt(t.naive)}</b>${t.naive < 0.05 ? " (»szignifikáns«)" : ""} · ` +
          `QAP p = <b>${fmt(t.qap, 3)}</b> (199 permutáció)${t.qap < 0.05 ? " (»szignifikáns«)" : ""}`;
        math(ro);
        root.dataset.one = JSON.stringify({ n, rho, r: +t.r.toFixed(4), naive: +t.naive.toFixed(5), qap: +t.qap.toFixed(4) });
      }
      function drawOne() {
        if (!last) return;
        const { X, Y } = last.g, o = hm, ctx = o.ctx;
        ctx.clearRect(0, 0, o.w, o.h);
        const card = rgbOf("--card"), A = rgbOf("--setA"), Bc = rgbOf("--setB");
        let mx = 0; X.forEach((r, i) => r.forEach((v, j) => { if (i !== j) mx = Math.max(mx, Math.abs(v), Math.abs(Y[i][j])); }));
        const gap = 14, top = 20, S = Math.min((o.w - gap) / 2, o.h - top - 2), cs = S / n;
        [[X, "X"], [Y, "Y"]].forEach(([Mx, nm], k) => {
          const x0 = k * (S + gap);
          ctx.fillStyle = GK.css("--text"); ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(nm + " mátrix", x0 + S / 2, top - 4);
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            const v = Mx[i][j], t = Math.min(1, Math.abs(v) / mx);
            ctx.fillStyle = i === j ? GK.css("--border") : lerpC(card, v >= 0 ? Bc : A, 0.1 + 0.9 * t);
            ctx.fillRect(x0 + j * cs, top + i * cs, Math.ceil(cs), Math.ceil(cs));
          }
          ctx.strokeStyle = GK.css("--border"); ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, top + 0.5, S - 1, S - 1);
        });
        const a = offdiag(X), b = offdiag(Y);
        const lo = Math.min(...a, ...b), hi = Math.max(...a, ...b), pad = 0.05 * (hi - lo);
        const F = frame(sc, { x0: lo - pad, x1: hi + pad, y0: lo - pad, y1: hi + pad, xt: ticks(lo, hi, 4), yt: ticks(lo, hi, 4), xl: "X cella", yl: "Y cella", fx: v => fmt(v, 1), fy: v => fmt(v, 1), pad: { l: 40 } });
        const c2 = sc.ctx; c2.fillStyle = GK.css("--accent"); c2.globalAlpha = n >= 40 ? 0.35 : 0.55;
        for (let i = 0; i < a.length; i++) { c2.beginPath(); c2.arc(F.X(a[i]), F.Y(b[i]), n >= 40 ? 2 : 2.8, 0, 2 * Math.PI); c2.fill(); }
        c2.globalAlpha = 1;
      }
      hm.onResize = drawOne; sc.onResize = drawOne;
      function cancel() { if (stop) { stop(); stop = null; prog.textContent = ""; } }
      let simRes = null;
      function many() {
        cancel();
        const RUNS = 200, R = rng(seed * 104729 + n * 31 + Math.round(rho * 10)), nn = n, rr = rho;
        let cn = 0, cq = 0;
        simRes = { n: nn, rho: rr, done: 0, naive: 0, qap: 0 };
        simBox.style.display = "";
        stop = chunked(RUNS, nn >= 40 ? 2 : nn >= 20 ? 6 : 20, () => {
          const g = gen(R), t = test(g.X, g.Y, 199, R);
          if (t.naive < 0.05) cn++; if (t.qap < 0.05) cq++;
        }, k => {
          simRes = { n: nn, rho: rr, done: k, naive: cn / k, qap: cq / k };
          prog.innerHTML = `<progress max="${RUNS}" value="${k}" style="vertical-align:middle;width:7rem"></progress> ${k} / ${RUNS} kísérlet`;
          drawBars();
        }, () => {
          stop = null; seed++;
          hist.unshift(simRes); if (hist.length > 8) hist.pop();
          drawTab();
          root.dataset.sim = JSON.stringify({ n: nn, rho: rr, naive: simRes.naive, qap: simRes.qap, runs: RUNS });
        });
      }
      function drawBars() {
        if (!simRes) return;
        const ym = Math.max(0.6, simRes.naive + 0.05, simRes.qap + 0.05);
        const F = frame(bars, { x0: 0, x1: 2, y0: 0, y1: ym, yt: ticks(0, ym, 5), fy: v => fmt(100 * v, 0) + "%", yl: "p < 0,05 aránya", pad: { l: 52, t: 22 } });
        const ctx = bars.ctx;
        [[simRes.naive, "naiv t-próba", "--setB"], [simRes.qap, "QAP", "--setC"]].forEach(([v, l, c], i) => {
          const x = F.X(i + 0.2), w = F.X(0.6) - F.X(0);
          ctx.fillStyle = GK.css(c); ctx.fillRect(x, F.Y(v), w, F.Y(0) - F.Y(v));
          ctx.fillStyle = GK.css("--text"); ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center";
          ctx.textBaseline = "bottom"; ctx.fillText(pct(v, 1), x + w / 2, F.Y(v) - 3);
          ctx.textBaseline = "top"; ctx.font = "12px system-ui, sans-serif"; ctx.fillText(l, x + w / 2, F.Y(0) + 6);
        });
        ctx.strokeStyle = GK.css("--accent"); ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(F.X(0), F.Y(0.05)); ctx.lineTo(F.X(2), F.Y(0.05)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = GK.css("--accent"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
        ctx.fillText("elvárt: 5%", F.X(2) - 2, F.Y(0.05) - 2);
        ctx.fillStyle = GK.css("--muted"); ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(`n = ${simRes.n}, ρ = ${fmt(simRes.rho, 1)} · ${simRes.done} kísérlet`, F.X(0) + 4, 4);
      }
      function drawTab() {
        tabBox.innerHTML = `<p class="muted" style="font-size:.86rem;margin:0 0 .3rem">Eddigi 200-as sorozatok (hányszor lett p &lt; 0,05):</p>` +
          `<table class="tbl" style="font-size:.85rem"><thead><tr><th>n</th><th>ρ</th><th>naiv</th><th>QAP</th></tr></thead><tbody>` +
          hist.map(s => `<tr><td>${s.n}</td><td>${fmt(s.rho, 1)}</td><td>${pct(s.naive, 1)}</td><td>${pct(s.qap, 1)}</td></tr>`).join("") + "</tbody></table>";
      }
      bars.onResize = drawBars;
      one();
    };

    /* ------------------------------------------------------------------
       10.3  qap-lab – a QAP-próba lépésről lépésre
       ------------------------------------------------------------------ */
    W["qap-lab"] = root => {
      header(root, "QAP-labor: permutáld a csúcsokat!",
        "A jobb oldali mátrix <b>sorait és oszlopait együtt</b> keverjük: a hálózat szerkezete megmarad, csak a csúcsok neve cserélődik. " +
        "Minden permutáció után újra kiszámoljuk a két mátrix (főátlón kívüli) celláinak korrelációját, $r^*$-ot. " +
        "Ha a megfigyelt $r$ ritkán fordul elő a permutáltak között, akkor a két hálózat egyezése nem a véletlen műve.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const IDS4 = ["Po", "Vi", "La", "Ön"], DAY1 = ["H", "K", "Sze"], K = krackData();
      const PAIRS = [["a", "VN vs. NY, 4 szereplő"], ["b", "VN vs. NY, 7 szereplő"], ["c", "hét eleje vs. hét vége"],
        ["d", "Krackhardt: tanácskérés vs. barátság"], ["e", "Krackhardt: tanácskérés vs. kinek jelent"]];
      let key = "a", weighted = false, cells = false, twoSided = false;
      let cur = null, rs = [], exact = false, lastR = null, pos = null, animT = null, vis = true, R = rng(11);

      function load() {
        const kl = Array.from({ length: 21 }, (_, i) => String(i + 1));
        if (key === "a") return { A: bin(arvizMatrix(a => a.paper === "VN", IDS4)), B: bin(arvizMatrix(a => a.paper === "NY", IDS4)), labels: IDS4, directed: false, nA: "Vidéki Napló", nB: "Nyitott Szó" };
        if (key === "b") return { A: bin(arvizMatrix(a => a.paper === "VN")), B: bin(arvizMatrix(a => a.paper === "NY")), labels: ARV_IDS, directed: false, nA: "Vidéki Napló", nB: "Nyitott Szó" };
        if (key === "c") {
          const F = arvizMatrix(a => DAY1.includes(a.day)), S = arvizMatrix(a => !DAY1.includes(a.day));
          return { A: weighted ? F : bin(F), B: weighted ? S : bin(S), labels: ARV_IDS, directed: false, nA: "hét eleje", nB: "hét vége" };
        }
        return { A: K.advice, B: key === "d" ? K.friendship : K.reports, labels: kl, directed: true, nA: "tanácskérés", nB: key === "d" ? "barátság" : "kinek jelent" };
      }

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" });
      const sel = h("select", { "aria-label": "melyik pár", style: "max-width:calc(100vw - 7rem)", onchange: () => { key = sel.value; reset(true); } }, ...PAIRS.map(([k, l]) => h("option", { value: k }, l)));
      const cbW = h("input", { type: "checkbox", onchange: () => { weighted = cbW.checked; reset(true); } });
      const lbW = h("label", null, cbW, "súlyozott");
      c1.append(h("label", null, "pár:", sel), lbW);
      const bExact = btn("Mind az n!", () => runExact());
      c2.append(btn("Permutálj", () => permOne(), "btn primary"), btn("×100", () => permMany(100)), btn("×1000", () => permMany(1000)), bExact,
        btn("Újra", () => reset(false)));
      const cb2 = h("input", { type: "checkbox", onchange: () => { twoSided = cb2.checked; refresh(); } });
      const cbCell = h("input", { type: "checkbox", onchange: () => { cells = cbCell.checked; reset(false); } });
      c3.append(h("label", null, cb2, "kétoldali (|r*| ≥ |r|)"), h("label", null, cbCell, "hibás: a cellákat egyenként keverd"));
      root.append(c1, c2, c3);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const mc = canvasBox(left, 0.56, 560), hc = canvasBox(right, 0.72, 520);
      const legM = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legM);
      right.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0", html:
        `${sq("--setB")}legalább olyan szélsőséges, mint a megfigyelt ${sq("--muted")}a többi · ${dash("--accent")}megfigyelt $r$` }));
      math(right);
      const warn = h("div", { class: "readout", style: "display:none;font-family:inherit;border-left:4px solid var(--setB)" });
      const ro = h("div", { class: "readout" });
      root.append(ro, warn);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A QAP a hálózat szerkezetét megtartja, csak a csúcsok nevét keveri össze – így azt kérdezi: ugyanez a két szerkezet véletlenül egymásra téve is ennyire egyezne?"));
      watchVis(root, v => { vis = v; if (!v && animT) finishAnim(); });

      const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
      function rStar(P) { return pearson(cur.a, offdiag(cur.B, cur.directed, P)); }
      function rCell() { const v = shuffleVec(cur.b, R); return { v, r: pearson(cur.a, v) }; }
      function reset(newData) {
        if (newData) {
          cur = load(); cur.n = cur.A.length; cur.a = offdiag(cur.A, cur.directed); cur.b = offdiag(cur.B, cur.directed); cur.r = pearson(cur.a, cur.b);
          cur.N = cur.a.length; cur.naive = naiveCorrP(cur.r, cur.N);
          cur.maxA = Math.max(1, ...cur.A.flat()); cur.maxB = Math.max(1, ...cur.B.flat());
        }
        lbW.style.display = key === "c" ? "" : "none";
        bExact.style.display = cur.n <= 8 && !cells ? "" : "none";
        cur.Bdisp = null;
        bExact.textContent = `Mind a ${cur.n}! = ${big(fact(cur.n))}`;
        rs = []; exact = false; lastR = null; finishAnim();
        pos = { from: null, to: [...Array(cur.n).keys()], cur: [...Array(cur.n).keys()] };
        legM.innerHTML = cur.n <= 8
          ? `${sq("--setA")}${sq("--setB")}van él (szám: súly) · keretezve: a két mátrix ugyanazon cellája is él · szürke: főátló`
          : `${sq("--setA")}${sq("--setB")}van él · keretezve: mindkét mátrixban él · szürke: főátló · sor: aki kérdez / akitől indul az él`;
        refresh(); drawMats();
      }
      /* animáció: a B csúcsainak megjelenítési helye (sor; QAP-nál oszlop is) */
      function setPerm(P, animate) {
        const to = inv(P);
        if (animate && vis) {
          pos.from = pos.cur.slice(); pos.to = to; const t0 = performance.now(), ms = 650;
          const step = t => {
            const u = Math.min(1, (t - t0) / ms), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
            pos.cur = pos.from.map((f, i) => f + (pos.to[i] - f) * e);
            drawMats(u < 1);
            animT = u < 1 ? requestAnimationFrame(step) : null;
          };
          if (animT) cancelAnimationFrame(animT);
          animT = requestAnimationFrame(step);
        } else { finishAnim(); pos.to = to; pos.cur = to.slice(); drawMats(); }
      }
      function finishAnim() { if (animT) { cancelAnimationFrame(animT); animT = null; } if (pos) pos.cur = pos.to.slice(); }
      function startSample() { if (exact) { rs = []; exact = false; } }
      function permOne() {
        startSample();
        if (cells) { const c = rCell(); lastR = c.r; rs.push(c.r); cur.Bdisp = vecToMat(c.v, cur.n, cur.directed); refresh(); drawMats(); return; }
        const P = randPerm(cur.n, R); lastR = rStar(P); rs.push(lastR); setPerm(P, true); refresh();
      }
      function permMany(k) {
        startSample(); let P;
        if (cells) { let c; for (let i = 0; i < k; i++) { c = rCell(); rs.push(c.r); } lastR = c.r; cur.Bdisp = vecToMat(c.v, cur.n, cur.directed); refresh(); drawMats(); return; }
        for (let i = 0; i < k; i++) { P = randPerm(cur.n, R); rs.push(rStar(P)); }
        lastR = rs[rs.length - 1]; setPerm(P, false); refresh();
      }
      function runExact() {
        if (cells) return;
        rs = []; let lastP = null;
        forEachPerm(cur.n, P => { rs.push(rStar(P)); lastP = P; });
        exact = true; lastR = null; setPerm([...Array(cur.n).keys()], false); refresh();
      }
      function stats() {
        const eps = 1e-9, r = cur.r, m = rs.length;
        const ge = rs.filter(x => (twoSided ? Math.abs(x) >= Math.abs(r) - eps : x >= r - eps)).length;
        const ms = m ? meanSd(rs) : { mean: NaN, sd: NaN };
        return { m, ge, p: m ? ge / m : NaN, mean: ms.mean, sd: ms.sd };
      }
      function refresh() {
        const s = stats();
        ro.innerHTML = `megfigyelt $r = ${fmM(cur.r, 3)}$ (${cur.N} cella${cur.directed ? ", irányított" : ""}) · naiv p = ${pTxt(cur.naive)} (t-próba)` +
          (lastR != null ? `<br>utolsó permutáció: $r^* = ${fmM(lastR, 3)}$` : "") +
          `<br>permutációk: <b>${big(s.m)}</b>${exact ? ` (mind a ${cur.n}!)` : ""}` +
          (s.m ? ` · ${twoSided ? "$|r^*| \\ge |r|$" : "$r^* \\ge r$"}: <b>${big(s.ge)}</b> → ${cells ? "»p«" : "p"} = <b>${fmt(s.p, 4)}</b> (${twoSided ? "kétoldali" : "egyoldali"})` +
            `<br>$r^*$ átlaga ${fmt(Math.abs(s.mean) < 5e-4 ? 0 : s.mean, 3)}, szórása <b>${fmt(s.sd, 3)}</b>` : " – nyomd meg a »Permutálj« gombot!");
        math(ro);
        warn.style.display = cells ? "" : "none";
        warn.innerHTML = cells ? "<b>Ez nem QAP:</b> a cellák függetlenségét feltételezi, ezért a nulleloszlás túl szűk, a p-érték túl kicsi. " +
          "A cellák egyenkénti keverése szétszedi a mátrix szerkezetét: eltűnik, hogy egy csúcs sorának cellái együtt mozognak (van, aki mindenkitől kér tanácsot). " +
          "Hasonlítsd össze a szórást a helyes QAP-éval – a Krackhardt tanácskérés–barátság páron ≈ 0,049 a ≈ 0,072 helyett." : "";
        drawHist();
        root.dataset.qap = JSON.stringify({ key, weighted, cells, twoSided, r: +cur.r.toFixed(4), naive: +cur.naive.toFixed(5), runs: s.m, ge: s.ge, p: +(+s.p).toFixed(5), mean: +(+s.mean).toFixed(4), sd: +(+s.sd).toFixed(4), exact });
      }
      function drawMats(anim = false) {
        if (!cur) return;
        const o = mc, ctx = o.ctx, n = cur.n, big_ = n > 8;
        ctx.clearRect(0, 0, o.w, o.h);
        const card = rgbOf("--card"), cA = rgbOf("--setA"), cB = rgbOf("--setB"), text = GK.css("--text"), muted = GK.css("--muted"), border = GK.css("--border"), acc = GK.css("--accent");
        const gap = 12, lab = big_ ? 15 : 22, top = 18 + lab;
        const S = Math.max(40, Math.min((o.w - gap - 2 * lab) / 2, o.h - top - 4)), cs = S / n;
        const fs = big_ ? Math.max(7, Math.min(9, cs * 0.9)) : 12;
        const ident = i => i, showB = cells && cur.Bdisp ? cur.Bdisp : cur.B;
        const rowPos = cells ? ident : (u => pos.cur[u]), colPos = cells ? ident : (v => pos.cur[v]);
        const permuted = cells ? !!cur.Bdisp : pos.cur.some((p, i) => Math.abs(p - i) > 1e-9);
        [[cur.A, cur.nA, cA, ident, ident, cur.maxA], [showB, cur.nB + (permuted ? (cells ? " (cellák keverve)" : " (permutálva)") : ""), cB, rowPos, colPos, cur.maxB]].forEach(([M, nm, col, rp, cp, mx], k) => {
          const x0 = lab + k * (S + gap + lab);
          ctx.fillStyle = text; ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.fillText(nm, x0 + S / 2, 0, S + lab);
          ctx.font = `${fs}px system-ui, sans-serif`; ctx.fillStyle = muted;
          for (let u = 0; u < n; u++) {                     // címkék
            ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(cur.labels[u], x0 - 3, top + (rp(u) + 0.5) * cs);
            if (cs >= 12 || (k === 0 && (u === 0 || (u + 1) % 5 === 0))) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(cur.labels[u], x0 + (cp(u) + 0.5) * cs, top - 2); }
          }
          for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) {
            const val = M[u][v], x = x0 + cp(v) * cs, y = top + rp(u) * cs;
            ctx.fillStyle = u === v ? border : val > 0 ? lerpC(card, col, 0.35 + 0.65 * val / mx) : lerpC(card, col, 0.04);
            ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
            if (!big_) {
              ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
              if (u !== v) { ctx.fillStyle = val > 0 ? text : muted; ctx.font = `${val > 0 ? "600 " : ""}${Math.min(14, cs * 0.45)}px system-ui, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(val), x + cs / 2, y + cs / 2 + 0.5); }
            }
          }
          ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, top + 0.5, S - 1, S - 1);
          if (k === 1 && !anim) {                           // egyezések kerete
            ctx.strokeStyle = acc; ctx.lineWidth = big_ ? 1.2 : 2.5;
            for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) {
              if (u === v || !(M[u][v] > 0)) continue;
              const i = Math.round(rp(u)), j = Math.round(cp(v));
              if (i !== j && cur.A[i][j] > 0) ctx.strokeRect(x0 + j * cs + 1.5, top + i * cs + 1.5, cs - 3, cs - 3);
            }
          }
        });
      }
      function drawHist() {
        const o = hc, r = cur.r, eps = 1e-9, ext = x => (twoSided ? Math.abs(x) >= Math.abs(r) - eps : x >= r - eps);
        const muted = GK.css("--muted"), hot = GK.css("--setB"), acc = GK.css("--accent");
        if (!rs.length) {
          const F = frame(o, { x0: -1, x1: 1, y0: 0, y1: 1, xt: [-1, -0.5, 0, 0.5, 1], xl: "permutált korreláció r*", pad: { l: 14 } });
          vline(F, r, 1); return;
        }
        const cnt = new Map(); rs.forEach(x => { const k = Math.round(x * 1e6) / 1e6; cnt.set(k, (cnt.get(k) || 0) + 1); });
        const discrete = cnt.size <= 15;
        let lo = Math.min(r, ...rs), hi = Math.max(r, ...rs);
        if (discrete) { lo = Math.min(lo, -0.2); hi = Math.max(hi, 0.2); }
        const pad = 0.08 * (hi - lo || 1); lo -= pad; hi += pad;
        if (discrete) {
          const ym = Math.max(...cnt.values()) * 1.18;
          const F = frame(o, { x0: lo, x1: hi, y0: 0, y1: ym, xt: ticks(lo, hi, 5), yt: ticks(0, ym, 4).filter(v => Number.isInteger(v)), fy: v => big(v), xl: "permutált korreláció r*", yl: "darab", pad: { l: 46, t: 14 } });
          const ctx = o.ctx;
          [...cnt.entries()].forEach(([v, c]) => {
            ctx.strokeStyle = ext(v) ? hot : muted; ctx.lineWidth = 7; ctx.lineCap = "butt";
            ctx.beginPath(); ctx.moveTo(F.X(v), F.Y(0)); ctx.lineTo(F.X(v), F.Y(c)); ctx.stroke();
            ctx.fillStyle = GK.css("--text"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.fillText(big(c), F.X(v), F.Y(c) - 3);
          });
          vline(F, r, ym);
        } else {
          const NB = 32, bw = (hi - lo) / NB, hcnt = new Array(NB).fill(0), hhot = new Array(NB).fill(0);
          rs.forEach(x => { const b = Math.min(NB - 1, Math.max(0, Math.floor((x - lo) / bw))); hcnt[b]++; if (ext(x)) hhot[b]++; });
          const ym = Math.max(...hcnt) * 1.12;
          const F = frame(o, { x0: lo, x1: hi, y0: 0, y1: ym, xt: ticks(lo, hi, 5), yt: ticks(0, ym, 4).filter(v => Number.isInteger(v)), fy: v => big(v), xl: "permutált korreláció r*", yl: "darab", pad: { l: 46, t: 14 } });
          const ctx = o.ctx;
          hcnt.forEach((c, b) => {
            if (!c) return;
            const x = F.X(lo + b * bw) + 0.5, w = Math.max(1, F.X(lo + (b + 1) * bw) - F.X(lo + b * bw) - 1);
            ctx.fillStyle = muted; ctx.globalAlpha = 0.7; ctx.fillRect(x, F.Y(c - hhot[b]), w, F.Y(0) - F.Y(c - hhot[b]));
            ctx.globalAlpha = 1; ctx.fillStyle = hot; ctx.fillRect(x, F.Y(c), w, F.Y(c - hhot[b]) - F.Y(c));
          });
          vline(F, r, ym);
        }
      }
      function vline(F, r, ym) {
        const ctx = hc.ctx, acc = GK.css("--accent");
        const lines = twoSided && Math.abs(r) > 1e-9 ? [r, -r] : [r];
        lines.forEach((v, i) => {
          ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.setLineDash(i ? [5, 4] : []);
          ctx.beginPath(); ctx.moveTo(F.X(v), F.Y(0)); ctx.lineTo(F.X(v), F.Y(ym)); ctx.stroke(); ctx.setLineDash([]);
        });
        ctx.fillStyle = acc; ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "top";
        const xr = F.X(r), right = xr > hc.w * 0.7;
        ctx.textAlign = right ? "right" : "left"; ctx.fillText("r = " + fmt(r, 3), xr + (right ? -4 : 4), F.Y(ym) + 1);
      }
      mc.onResize = () => drawMats(); hc.onResize = () => cur && drawHist();
      reset(true);
    };

    /* ------------------------------------------------------------------
       10.4  mrqap-lab – többszörös regresszió hálózatokon, permutációs p-értékkel
       ------------------------------------------------------------------ */
    W["mrqap-lab"] = root => {
      header(root, "MRQAP: kitől kérnek tanácsot a menedzserek?",
        "Krackhardt 21 menedzsere. Függő változó: $Y_{ij} = 1$, ha $i$ tanácsot kér $j$-től (420 rendezett pár). " +
        "Pipáld be a magyarázó hálózatokat, és nézd meg, mi történik a barátság együtthatójával és p-értékével! " +
        "A naiv OLS úgy tesz, mintha a 420 cella független volna; a <b>Y-permutáció</b> a függő mátrix csúcsait keveri, a <b>DSP</b> (kettős szemi-parciális) " +
        "az adott magyarázót a többiekre regresszálja, és a maradék mátrixot permutálja.");
      math(root.querySelector(".w-sub"));
      const K = krackData(), n = K.n;
      const TEN = zeros(n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) TEN[i][j] = K.att.tenure[j];
      const VARS = [["fr", "barátság", K.friendship], ["rep", "kinek jelent", K.reports], ["same", "azonos részleg", K.sameDept],
        ["ten", "a megkérdezett ideje a cégnél (év)", TEN]];
      const y = offdiag(K.advice, true), xv = {}; VARS.forEach(([k, , M]) => (xv[k] = offdiag(M, true)));
      const on = { fr: true, rep: false, same: false, ten: false };
      let method = "dsp", runs = 500, seed = 1, stop = null, res = null;

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "magyarázók:"));
      VARS.forEach(([k, l]) => {
        const cb = h("input", { type: "checkbox", onchange: () => { on[k] = cb.checked; if (!VARS.some(v => on[v[0]])) { on[k] = true; cb.checked = true; } compute(); } });
        cb.checked = on[k]; c1.append(h("label", null, cb, l));
      });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "p-érték:"));
      toggleGroup(c2, [["ols", "naiv OLS"], ["y", "Y-permutáció"], ["dsp", "DSP"]], method, v => { method = v; compute(); });
      c3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "permutációk:"));
      toggleGroup(c3, [[500, "500"], [2000, "2000"]], runs, v => { runs = v; compute(); });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      c3.append(btn("Újra (más véletlen)", () => { seed++; compute(); }), prog);
      root.append(c1, c2, c3);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const tab = h("div", { class: "tw", style: "overflow-x:auto" }), ro = h("div", { class: "readout" });
      left.append(tab, ro);
      const capT = h("p", { class: "muted", style: "font-size:.84rem;margin:0 0 .2rem", html:
        `A permutált $t^*$ eloszlása változónként ${sq("--muted")}; ${dash("--accent")}megfigyelt $t$, ${dash("--accent", true)}$-t$ (a kétoldali p a két vonalon kívüli rész)` });
      right.append(capT); math(capT);
      const tc = canvasBox(right, 0.5, 520);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Egyenként a barátság is »szignifikáns«, de ha a főnöki viszonyt is beveszed, elveszíti a hatását: a tanácsot inkább a főnöködtől kéred, és a főnöködet gyakran barátnak is mondod."));

      function compute() {
        if (stop) { stop(); stop = null; }
        const keys = VARS.map(v => v[0]).filter(k => on[k]), xs = keys.map(k => xv[k]), Kn = xs.length;
        const fit = ols(y, xs), naiveP = fit.t.map(t => tTwoSided(t, fit.df));
        res = { keys, fit, naiveP, cnt: new Array(Kn).fill(0), tstar: keys.map(() => []), done: 0, total: method === "ols" ? 0 : runs, method };
        prog.textContent = "";
        if (method === "ols") { render(); return; }
        const R = rng(seed * 7919 + runs + (method === "y" ? 1 : 2)), eps = 1e-9;
        let E = null;
        if (method === "dsp") {
          E = xs.map((x, k) => {
            const others = xs.filter((_, j) => j !== k), f = ols(x, others);
            const e = x.map((v, i) => v - f.b[0] - others.reduce((s, o, j) => s + f.b[j + 1] * o[i], 0));
            const M = zeros(n); let idx = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) M[i][j] = e[idx++];
            return { M, others };
          });
        }
        const r0 = res;
        render();
        stop = chunked(runs, method === "y" ? 60 : Math.max(10, Math.round(60 / Kn)), () => {
          const P = randPerm(n, R);
          if (method === "y") {
            const f = ols(offdiag(K.advice, true, P), xs);
            for (let k = 0; k < Kn; k++) { r0.tstar[k].push(f.t[k + 1]); if (Math.abs(f.t[k + 1]) >= Math.abs(fit.t[k + 1]) - eps) r0.cnt[k]++; }
          } else {
            for (let k = 0; k < Kn; k++) {
              const f = ols(y, [offdiag(E[k].M, true, P), ...E[k].others]);
              r0.tstar[k].push(f.t[1]); if (Math.abs(f.t[1]) >= Math.abs(fit.t[k + 1]) - eps) r0.cnt[k]++;
            }
          }
        }, k => {
          r0.done = k;
          prog.innerHTML = k < runs ? `<progress max="${runs}" value="${k}" style="vertical-align:middle;width:7rem"></progress> ${big(k)} / ${big(runs)}` : `kész: ${big(runs)} permutáció`;
          render();
        }, () => { stop = null; });
      }
      function render() {
        const r = res, f = r.fit, perm = r.method !== "ols", fin = !perm || r.done === r.total;
        const nameOf = k => VARS.find(v => v[0] === k)[1];
        const pP = k => (r.done ? r.cnt[k] / r.done : NaN);
        let t = `<table class="tbl" style="font-size:.86rem;white-space:nowrap"><thead><tr><th>változó</th><th>$b$</th><th>$t$</th><th>naiv p</th>${perm ? `<th>${r.method === "y" ? "Y-perm." : "DSP"} p</th>` : ""}</tr></thead><tbody>`;
        t += `<tr><td>tengelymetszet</td><td>${fmt(f.b[0], 3)}</td><td>${fmt(f.t[0], 2)}</td><td>${pTxt(r.naiveP[0])}</td>${perm ? "<td>–</td>" : ""}</tr>`;
        r.keys.forEach((k, i) => {
          const sig = perm ? pP(i) < 0.05 : r.naiveP[i + 1] < 0.05;
          t += `<tr${sig && fin ? ' style="font-weight:600"' : ""}><td>${nameOf(k)}</td><td>${fmt(f.b[i + 1], 3)}</td><td>${fmt(f.t[i + 1], 2)}</td><td>${pTxt(r.naiveP[i + 1])}</td>` +
            (perm ? `<td>${r.done ? pTxt(pP(i), r.done) : "…"}</td>` : "") + "</tr>";
        });
        tab.innerHTML = t + "</tbody></table>";
        ro.innerHTML = `$R^2 = ${fmM(f.r2, 3)}$ · $N = ${y.length}$ cella` + (perm ? ` · ${big(r.done)} / ${big(r.total)} permutáció` : "") +
          `<br><span style="font-family:inherit">félkövér: p &lt; 0,05${perm ? " (a permutációs p szerint)" : " (a naiv p szerint – óvatosan!)"}</span>`;
        math(tab); math(ro);
        drawT();
        root.dataset.mrqap = JSON.stringify({ keys: r.keys, method: r.method, b: f.b.map(v => +v.toFixed(4)), naiveP: r.naiveP.map(v => +v.toFixed(5)),
          permP: r.keys.map((_, i) => (r.done ? +(r.cnt[i] / r.done).toFixed(4) : null)), r2: +f.r2.toFixed(4), done: r.done, total: r.total });
      }
      function drawT() {
        const r = res, o = tc, Kn = r.keys.length, rowH = 62;
        const asp = Math.max(0.3, (Kn * rowH + 34) / Math.max(200, o.w));
        if (Math.abs(asp - o.aspect) > 1e-3) { o.aspect = asp; o.onResize = null; o.resize(); o.onResize = drawT; }
        const ctx = o.ctx, Wd = o.w; ctx.clearRect(0, 0, Wd, o.h);
        const muted = GK.css("--muted"), acc = GK.css("--accent"), text = GK.css("--text"), border = GK.css("--border");
        let M = 3; r.keys.forEach((_, i) => { M = Math.max(M, Math.abs(r.fit.t[i + 1]) * 1.1); r.tstar[i].forEach(v => { M = Math.max(M, Math.abs(v)); }); });
        M = Math.min(M, 20);
        const l = 10, rr = 10, X = v => l + (Math.max(-M, Math.min(M, v)) + M) / (2 * M) * (Wd - l - rr);
        r.keys.forEach((k, i) => {
          const y0 = i * rowH, base = y0 + rowH - 8;
          ctx.fillStyle = text; ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
          ctx.fillText(VARS.find(v => v[0] === k)[1], l, y0 + 2, Wd - 20);
          ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(l, base + 0.5); ctx.lineTo(Wd - rr, base + 0.5); ctx.stroke();
          const ts = r.tstar[i];
          if (ts.length) {
            const NB = 40, cnt = new Array(NB).fill(0); ts.forEach(v => { cnt[Math.min(NB - 1, Math.max(0, Math.floor((v + M) / (2 * M) * NB)))]++; });
            const mx = Math.max(...cnt), bw = (Wd - l - rr) / NB, hgt = rowH - 26;
            ctx.fillStyle = muted; ctx.globalAlpha = 0.75;
            cnt.forEach((c, b) => { if (c) ctx.fillRect(l + b * bw + 0.5, base - c / mx * hgt, Math.max(1, bw - 1), c / mx * hgt); });
            ctx.globalAlpha = 1;
          }
          const tv = r.fit.t[i + 1];
          [tv, -tv].forEach((v, j) => {
            ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.setLineDash(j ? [4, 3] : []);
            ctx.beginPath(); ctx.moveTo(X(v), y0 + 18); ctx.lineTo(X(v), base); ctx.stroke(); ctx.setLineDash([]);
          });
          ctx.fillStyle = acc; ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "top";
          const xr = X(tv), rt = xr > Wd * 0.75; ctx.textAlign = rt ? "right" : "left";
          ctx.fillText("t = " + fmt(tv, 2) + (Math.abs(tv) > M ? " →" : ""), xr + (rt ? -4 : 4), y0 + 18);
        });
        ctx.fillStyle = muted; ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "top";
        ticks(-M, M, 6).forEach(v => { ctx.textAlign = "center"; ctx.fillText(fmt(v, 0), X(v), Kn * rowH + 2); });
        ctx.textAlign = "center"; ctx.fillText(r.method === "ols" ? "(naiv OLS: nincs permutáció)" : "t-érték", Wd / 2, Kn * rowH + 16);
      }
      tc.onResize = () => res && drawT();
      compute();
    };
  }

  /* ==================================================================
     w2: 10.5–10.7 widgetjei (backbone-filter, missing-data, sensitivity-grid, ergm-toy)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = (c, dash = false) => dash
      ? `<span style="display:inline-block;width:1.3em;height:0;border-top:2.5px dashed ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`
      : `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const svgEl = (Wd, Ht, inner, label, extra = "") =>
      `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;touch-action:manipulation" role="img" aria-label="${label}" ${extra}>${inner}</svg>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const pct = (x, d = 0) => fmt(100 * x, d) + "%";
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");
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
    const range = (min, max, step, value, label, oninput, width = "9rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:42vw`, oninput });
    const mono = txt => h("b", { style: "font-family:var(--mono);min-width:3.2em;display:inline-block" }, txt);
    const argmax = v => { let b = 0; for (let i = 1; i < v.length; i++) if (v[i] > v[b]) b = i; return b; };
    const tbl = (head, rows, cls = "") =>
      `<table class="${cls}" style="width:auto;margin:.3rem 0;font-size:.88rem"><thead><tr>${head.map(x => `<th style="padding:.2em .5em">${x}</th>`).join("")}</tr></thead>` +
      `<tbody>${rows.map(r => `<tr${r.cls ? ` class="${r.cls}"` : ""}${r.st ? ` style="${r.st}"` : ""}>${(r.c || r).map(x => `<td style="padding:.2em .5em;text-align:center">${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    /* sajátvektor-centralitás (hatványiteráció az A + I mátrixszal; maximum 1-re normálva) */
    function eigC(n, edges) {
      const L = nbrs(n, edges); let x = new Array(n).fill(1);
      for (let it = 0; it < 300; it++) {
        const y = x.map((v, i) => v + L[i].reduce((s, j) => s + x[j], 0));
        const mx = Math.max(...y) || 1, z = y.map(v => v / mx);
        const d = z.reduce((s, v, i) => s + Math.abs(v - x[i]), 0); x = z;
        if (d < 1e-10) break;
      }
      return x;
    }
    /* stabil sorrend: indexek csökkenő kulcs szerint (holtversenyben az eredeti sorrend) */
    const orderBy = (n, key) => [...Array(n).keys()].sort((i, j) => key(j) - key(i) || i - j);

    /* ------------------------------------------------------------------
       10.5  backbone-filter – globális küszöb vs. diszparitásszűrő
       ------------------------------------------------------------------ */
    W["backbone-filter"] = root => {
      header(root, "Hálózati gerinc: globális küszöb vagy diszparitásszűrő?",
        "A <b>globális küszöb</b> minden $w \\ge t$ súlyú élt megtart. A <b>diszparitásszűrő</b> csúcsonként dönt: az $i$ felől " +
        "$\\alpha_{ij} = (1 - w_{ij}/s_i)^{k_i - 1}$ annak az esélye, hogy egy véletlen súlyelosztásban ekkora rész jutna erre az élre; " +
        "az él megmarad, ha valamelyik végéről $\\alpha_{ij} \\lt \\alpha$. Kattints egy élre vagy csúcsra a részletekért.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let net = "lesmis", mode = "disp", t = 3, alpha = 0.2, cmp = false, selE = -1, selN = -1;
      const starW = [10, 1, 1, 1];
      let G, n, DS, maxW, totW;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["arviz", "Árvízhét"], ["lesmis", "Les Misérables"], ["star", "kis csillag"]], net, v => { net = v; build(); });
      const c2 = h("div", { class: "controls" });
      const paintMode = toggleGroup(c2, [["global", "globális küszöb"], ["disp", "diszparitásszűrő"]], mode, v => { mode = v; update(); });
      const bCmp = btn("Összevetés: ugyanannyi él a másik módszerrel", () => { cmp = !cmp; update(); });
      c2.append(bCmp);
      const c3 = h("div", { class: "controls" });
      const tOut = mono("3"), aOut = mono("0,200");
      const tSl = range(1, 31, 1, t, "súlyküszöb", () => { t = +tSl.value; tOut.textContent = "≥ " + t; update(); });
      /* α logaritmikus skálán: 0,01 … 0,6 */
      const a2v = a => Math.round(100 * Math.log(a / 0.01) / Math.log(60)), v2a = v => 0.01 * Math.pow(60, v / 100);
      const aSl = range(0, 100, 1, a2v(alpha), "szignifikanciaszint (alfa)", () => { alpha = v2a(+aSl.value); update(); });
      const tLab = h("label", null, "küszöb $t$:", tSl, tOut), aLab = h("label", null, "$\\alpha$:", aSl, aOut);
      const aBtns = h("span", { style: "display:inline-flex;gap:.3rem;flex-wrap:wrap" },
        ...[0.05, 0.1, 0.2, 0.3].map(a => btn(fmt(a, 2), () => { alpha = a; aSl.value = a2v(a); update(); })));
      c3.append(tLab, aLab, aBtns);
      math(c3);
      const c4 = h("div", { class: "controls" });
      const selInfo = h("span", { style: "font-size:.9rem" });
      const wEdit = h("span", { style: "display:inline-flex;gap:.3rem" },
        btn("súly −1", () => editW(-1)), btn("súly +1", () => editW(1)));
      c4.append(selInfo, wEdit);
      root.append(c1, c2, c3);
      const box = h("div");
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" });
      const cmpBox = h("div", { class: "readout", style: "display:none" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A globális küszöb a nagyokat tartja meg; a diszparitásszűrő mindenkinél a saját legfontosabb kapcsolatait – ezért marad meg a kisebb szereplők szerkezete is.");
      root.append(box, c4, legend, info, cmpBox, tw, lesson);
      const view = new GK.View(box, { aspect: 0.62, radius: 6, draggable: false,
        onEdgeClick: i => { selE = selE === i ? -1 : i; selN = -1; update(); },
        onNodeClick: i => { selN = selN === i ? -1 : i; selE = -1; update(); } });

      const nm = i => (net === "lesmis" ? G.nodes[i].name : G.nodes[i].sub || G.nodes[i].label);
      function build() {
        selE = selN = -1;
        if (net === "lesmis") { G = lesmisGraph(0.62); view.o.aspect = 0.62; view.o.radius = narrow ? 4 : 5.5; view.o.edgeHitTol = 5; }
        else if (net === "arviz") { G = preset("arviz", 0.5); view.o.aspect = 0.5; view.o.radius = narrow ? 12 : 15; view.o.edgeHitTol = 9; }
        else {
          const P = GK.normalize([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]], 0.5);
          G = { nodes: ["K", "1", "2", "3", "4"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1], sub: i ? "levél " + l : "középső" })),
            edges: starW.map((w, i) => ({ a: 0, b: i + 1, w })) };
          view.o.aspect = 0.5; view.o.radius = narrow ? 12 : 15; view.o.edgeHitTol = 10;
        }
        n = G.nodes.length;
        view.setGraph(G.nodes, G.edges); view.resize();
        recalc();
        tSl.max = Math.max(...G.edges.map(e => e.w));
        t = net === "lesmis" ? 3 : 2; tSl.value = t; tOut.textContent = "≥ " + t;
        update();
      }
      function recalc() {
        DS = disparity(n, G.edges);
        maxW = Math.max(...G.edges.map(e => e.w)); totW = G.edges.reduce((s, e) => s + e.w, 0);
      }
      function editW(dv) {
        if (net !== "star" || selE < 0) return;
        starW[selE] = Math.max(1, Math.min(20, starW[selE] + dv));
        G.edges[selE].w = starW[selE];
        recalc(); tSl.max = maxW; update();
      }
      /* megtartott élek indexhalmaza: a mód szerint, vagy (ugyanannyi él) a másik módszer rangsorával */
      const keepBy = m => (m === "disp" ? G.edges.map((_, i) => i).filter(i => DS[i].alpha < alpha) : G.edges.map((_, i) => i).filter(i => G.edges[i].w >= t));
      const topM = (m, M) => (m === "global"
        ? orderBy(G.edges.length, i => G.edges[i].w).slice(0, M)
        : orderBy(G.edges.length, i => -DS[i].alpha).slice(0, M));
      function summary(K) {
        const S = new Set(K), nodes = new Set();
        K.forEach(i => { nodes.add(G.edges[i].a); nodes.add(G.edges[i].b); });
        const V = [...nodes].sort((a, b) => a - b), idx = new Map(V.map((v, k) => [v, k]));
        const comps = V.length ? components(V.length, K.map(i => ({ a: idx.get(G.edges[i].a), b: idx.get(G.edges[i].b) }))).sizes.length : 0;
        return { S, nodes, m: K.length, v: V.length, comps, ws: K.reduce((s, i) => s + G.edges[i].w, 0) / totW };
      }
      function update() {
        paintMode(mode);
        tLab.style.display = mode === "global" ? "" : "none";
        aLab.style.display = aBtns.style.display = mode === "disp" ? "" : "none";
        aOut.textContent = fmt(alpha, 3);
        bCmp.classList.toggle("on", cmp);
        const K = keepBy(mode), A = summary(K);
        const other = mode === "disp" ? "global" : "disp";
        const B = cmp ? summary(topM(other, K.length)) : null;
        const wid = w => (net === "lesmis" ? 0.9 + 4.2 * Math.sqrt(w / maxW) : 1.5 + 5 * w / maxW);
        const faded = mixColor("--card", "--muted", 0.35);
        const edges = G.edges.map((e, i) => {
          const inA = A.S.has(i), inB = B && B.S.has(i), o = { a: e.a, b: e.b, w: e.w, label: net === "lesmis" ? "" : String(e.w) };
          if (B) {
            if (inA && inB) Object.assign(o, { color: "--setC", width: wid(e.w) });
            else if (inA) Object.assign(o, { color: "--setA", width: wid(e.w) });
            else if (inB) Object.assign(o, { color: "--setB", width: wid(e.w), dash: [5, 3] });
            else Object.assign(o, { color: "--border", width: 0.8, alpha: 0.6 });
          } else if (inA) Object.assign(o, { color: "--setA", width: wid(e.w) });
          else Object.assign(o, { color: "--border", width: net === "lesmis" ? 0.7 : 1.2, alpha: 0.7, dash: net === "lesmis" ? null : [4, 4] });
          if (i === selE) Object.assign(o, { color: "--accent", width: Math.max(3, (o.width || 1) + 1.5), alpha: 1, dash: null });
          return o;
        });
        const nodes = G.nodes.map((nd, i) => {
          const inA = A.nodes.has(i), inB = B && B.nodes.has(i);
          let color = inA ? "--setA" : faded, ink = inA ? null : "--muted";
          if (B) { color = inA && inB ? "--setC" : inA ? "--setA" : inB ? "--setB" : faded; ink = inA || inB ? null : "--muted"; }
          const o = Object.assign({}, nd, { color, ink });
          if (net === "lesmis") o.sub = i === selN || (selE >= 0 && (G.edges[selE].a === i || G.edges[selE].b === i)) ? nd.name : "";
          return o;
        });
        view.o.showWeights = net !== "lesmis";
        view.hl = new Set(selN >= 0 ? [selN] : []);
        view.setGraph(nodes, edges);
        legend.innerHTML = B
          ? `${sw("--setC")}mindkettőben ${sw("--setA")}csak ${mode === "disp" ? "a diszparitásszűrőben" : "a küszöbben"} ${sw("--setB", true)}csak ${mode === "disp" ? "a küszöbben" : "a diszparitásszűrőben"} ${sw("--border", true)}kiesik`
          : `${sw("--setA")}megmaradó él / csúcs (vastagság = súly) ${sw("--border", true)}kieső él, halvány csúcs: nincs megmaradó éle`;
        /* kiírás */
        const cond = mode === "disp" ? `$\\alpha_{ij} \\lt ${fmM(alpha, 3)}$` : `$w \\ge ${t}$`;
        let s = `${cond}: megmarad <b>${A.m}</b> / ${G.edges.length} él, <b>${A.v}</b> / ${n} csúcs (amelynek van megmaradó éle), ` +
          `<b>${A.comps}</b> komponens, a teljes súly <b>${pct(A.ws, 1)}</b>-a.`;
        if (mode === "disp") {
          const drop = G.edges.map((_, i) => i).filter(i => !A.S.has(i));
          if (drop.length) { const j = orderBy(drop.length, k => G.edges[drop[k]].w)[0], e = G.edges[drop[j]]; s += `<br>A legnagyobb kieső súly: ${nm(e.a)} – ${nm(e.b)} ($w = ${e.w}$).`; }
          const amin = Math.min(...DS.map(d => d.alpha));
          if (!A.m) s += `<br>Egy él sem marad: a legkisebb $\\alpha_{ij}$ itt ${fmt(amin, 3)}. Kis fokszámnál a szűrő nem tud „szignifikáns” lenni – kevés élre nem lehet nagyon egyenlőtlenül elosztani a súlyt.`;
        }
        if (selE >= 0) {
          const e = G.edges[selE], d = DS[selE];
          s += `<br><br><b>${nm(e.a)} – ${nm(e.b)}</b>: $w = ${e.w}$; ${nm(e.a)} felől $\\alpha = ${fmM(d.alphaA, 3)}$, ${nm(e.b)} felől $\\alpha = ${fmM(d.alphaB, 3)}$ → ` +
            `$\\alpha_{ij} = ${fmM(d.alpha, 3)}$ (${A.S.has(selE) ? "megmarad" : "kiesik"}).`;
        } else if (selN >= 0) {
          const inc = G.edges.map((e, i) => i).filter(i => G.edges[i].a === selN || G.edges[i].b === selN);
          const sN = inc.reduce((q, i) => q + G.edges[i].w, 0), kept = inc.filter(i => A.S.has(i)).length;
          s += `<br><br><b>${nm(selN)}</b>: fokszám $k = ${inc.length}$, erősség $s = ${sN}$; megmaradó éle: ${kept}.`;
        }
        info.innerHTML = s; math(info);
        selInfo.textContent = net === "star" ? (selE >= 0 ? `kijelölt él: K – ${selE + 1}, súly ${G.edges[selE].w}` : "Kattints egy élre a súlya módosításához:") : "";
        c4.style.display = net === "star" ? "" : "none";
        wEdit.style.display = selE >= 0 ? "" : "none";
        /* összevetés */
        cmpBox.style.display = B ? "" : "none";
        let res = { mode, net, m: A.m, v: A.v, comps: A.comps, ws: +A.ws.toFixed(4) };
        if (B) {
          const onlyA = [...A.nodes].filter(i => !B.nodes.has(i)), onlyB = [...B.nodes].filter(i => !A.nodes.has(i));
          const list = L => (L.length ? L.map(nm).join(", ") : "–");
          const otherName = other === "global" ? `a ${A.m} legnagyobb súlyú él (holtversenyben az adatsorrend dönt)` : `a ${A.m} legkisebb $\\alpha$-jú él`;
          cmpBox.innerHTML = `Ugyanannyi él a másik módszerrel – ${otherName}: <b>${B.v}</b> csúcs, <b>${B.comps}</b> komponens, a súly <b>${pct(B.ws, 1)}</b>-a.<br>` +
            `Csak ${mode === "disp" ? "a diszparitásszűrőben" : "a küszöbben"} marad (${onlyA.length}): ${list(onlyA)}<br>` +
            `Csak ${mode === "disp" ? "a küszöbben" : "a diszparitásszűrőben"} marad (${onlyB.length}): ${list(onlyB)}`;
          math(cmpBox);
          res.cmp = { v: B.v, comps: B.comps, ws: +B.ws.toFixed(4), onlyA: onlyA.map(nm), onlyB: onlyB.map(nm) };
        }
        if (mode === "disp") { const drop = G.edges.map((_, i) => i).filter(i => !A.S.has(i)); if (drop.length) { const e = G.edges[drop[orderBy(drop.length, k => G.edges[drop[k]].w)[0]]]; res.maxDrop = [nm(e.a), nm(e.b), e.w]; } }
        root.dataset.result = JSON.stringify(res);
        /* éltáblázat a kis gráfokra */
        if (net !== "lesmis") {
          const ord = orderBy(G.edges.length, i => -DS[i].alpha);
          tw.innerHTML = tbl(["él", "$w$", "$\\alpha$ az 1. vég felől", "$\\alpha$ a 2. vég felől", "$\\alpha_{ij}$ (kisebb)", mode === "disp" ? "marad?" : "$w \\ge t$?"],
            ord.map(i => {
              const e = G.edges[i], d = DS[i];
              return { c: [`${G.nodes[e.a].label} – ${G.nodes[e.b].label}`, e.w, fmt(d.alphaA, 3), fmt(d.alphaB, 3), `<b>${fmt(d.alpha, 3)}</b>`, A.S.has(i) ? "✓" : "–"],
                st: i === selE ? "background:var(--accent-soft)" : "" };
            }));
          math(tw);
        } else tw.innerHTML = "";
        root.dataset.alphas = JSON.stringify(DS.map(d => +d.alpha.toFixed(4)));
      }
      onTheme(update);
      build();
    };

    /* ------------------------------------------------------------------
       10.6  missing-data – hiányzó élek / csúcsok és a centralitás-rangsor
       ------------------------------------------------------------------ */
    W["missing-data"] = root => {
      header(root, "Hiányzó adat: mennyire bízhatsz a rangsorban?",
        "Töröld véletlenszerűen az élek (vagy a csúcsok) egy $f$ részét, számold újra a centralitást, és vesd össze a rangsort az eredetivel " +
        "(Spearman-féle $\\rho$: 1 = ugyanaz a sorrend). Csúcsok hiányánál csak a megmaradt csúcsok rangsorát hasonlítjuk.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let net = "karate", what = "edges", f = 0.2, meas = "btw", seed = 1, G, n, base = {}, sample = null, delE = -1, stopper = null;
      const MEAS = { deg: ["fokszám", (n, E) => degreeC(n, E)], btw: ["köztesség", (n, E) => betweennessC(n, E)], eig: ["sajátvektor", eigC] };
      const MCOL = { deg: "--setA", btw: "--setB", eig: "--setC" };

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["karate", "karateklub"], ["arviz", "Árvízhét"], ["krack", "Krackhardt: barátság"]], net, v => { net = v; build(); });
      const c2 = h("div", { class: "controls" });
      toggleGroup(c2, [["edges", "élek hiányoznak"], ["nodes", "csúcsok hiányoznak"]], what, v => { what = v; sample = null; delE = -1; newSample(); });
      const fOut = mono("20%");
      const fSl = range(0, 50, 5, 20, "hiányzó arány", () => { f = +fSl.value / 100; fOut.textContent = pct(f); newSample(); });
      c2.append(h("label", null, "hiányzik:", fSl, fOut));
      const c3 = h("div", { class: "controls" });
      toggleGroup(c3, Object.entries(MEAS).map(([k, v]) => [k, v[0]]), meas, v => { meas = v; render(); });
      c3.append(btn("1 minta", () => newSample(), "btn primary"), btn("100 minta", () => many()),
        btn("Görbe: 6 arány × 100 minta", () => curve()));
      const prog = h("span", { class: "muted", style: "font-size:.85rem" });
      c3.append(prog);
      root.append(c1, c2, c3);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), side = h("div");
      grid.append(box, side); root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" }), manyBox = h("div", { class: "readout", style: "display:none" });
      const curveBox = h("div", { style: "margin-top:.5rem" });
      const arvBox = h("div", { style: "margin-top:.6rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Kevés hiány a rangsor elejét alig rontja, de egyetlen híd-él is átírhatja, ki a „legfontosabb közvetítő” – a köztesség érzékenyebb, mint a fokszám.");
      box.append(legend);
      root.append(info, manyBox, curveBox, arvBox, lesson);
      const view = new GK.View(box, { aspect: 0.62, radius: 9, draggable: false,
        onEdgeClick: i => { if (net !== "arviz") return; delE = delE === i ? -1 : i; render(); } });
      box.prepend(view.c);

      const lab = i => G.nodes[i].label;
      function build() {
        if (stopper) { stopper(); stopper = null; prog.textContent = ""; }
        if (net === "karate") { G = preset("karate", 0.62); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); view.o.aspect = 0.62; view.o.radius = narrow ? 7 : 8; }
        else if (net === "arviz") { G = preset("arviz", 0.5); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); view.o.aspect = 0.5; view.o.radius = narrow ? 12 : 14; }
        else {
          const K = krackData(), E = [];
          for (let i = 0; i < K.n; i++) for (let j = i + 1; j < K.n; j++) if (K.friendship[i][j] || K.friendship[j][i]) E.push({ a: i, b: j, w: 1 });
          const P = GK.forceLayout(K.n, E.map(e => [e.a, e.b]), { seed: 3, aspect: 0.62 });
          G = { nodes: P.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1] })), edges: E };
          view.o.aspect = 0.62; view.o.radius = narrow ? 9 : 11;
        }
        n = G.nodes.length;
        Object.keys(MEAS).forEach(k => (base[k] = MEAS[k][1](n, G.edges)));
        view.setGraph(G.nodes, G.edges); view.resize();
        sample = null; delE = -1; manyBox.style.display = "none"; curveBox.innerHTML = "";
        root.dataset.base = JSON.stringify({ n, m: G.edges.length, btw: base.btw.map(x => +x.toFixed(3)) });
        newSample();
      }
      /* egy hiányos minta: { keepE (élindexek) | keepN (csúcsindexek), cent: { deg, btw, eig } (a megmaradt csúcsokra) } */
      function draw1(R) {
        if (what === "edges") {
          const M = G.edges.length, k = Math.round(M * (1 - f)), p = randPerm(M, R), keepE = p.slice(0, k).sort((a, b) => a - b);
          const E = keepE.map(i => G.edges[i]), cent = {};
          Object.keys(MEAS).forEach(q => (cent[q] = MEAS[q][1](n, E)));
          return { keepE, keepN: [...Array(n).keys()], cent };
        }
        const k = Math.round(n * (1 - f)), keepN = randPerm(n, R).slice(0, k).sort((a, b) => a - b), idx = new Map(keepN.map((v, t) => [v, t]));
        const E = G.edges.filter(e => idx.has(e.a) && idx.has(e.b)).map(e => ({ a: idx.get(e.a), b: idx.get(e.b), w: 1 })), cent = {};
        Object.keys(MEAS).forEach(q => (cent[q] = MEAS[q][1](k, E)));
        return { keepN, cent, keepE: G.edges.map((e, i) => i).filter(i => idx.has(G.edges[i].a) && idx.has(G.edges[i].b)) };
      }
      /* összevetés az eredetivel: ρ és „ugyanaz-e az első” (holtversenyben a kisebb sorszámú számít elsőnek) */
      function score(S, q) {
        const b0 = S.keepN.map(i => base[q][i]), b1 = S.cent[q];
        return { rho: spearman(b0, b1), same: argmax(b0) === argmax(b1) };
      }
      function newSample() {
        if (stopper) { stopper(); stopper = null; prog.textContent = ""; }
        delE = -1;
        sample = draw1(rng(seed++));
        render();
      }
      function render() {
        const S = sample, q = meas, faded = mixColor("--card", "--muted", 0.3);
        let nodes, edges;
        if (delE >= 0) {
          nodes = G.nodes.map(nd => Object.assign({}, nd, { color: null }));
          edges = G.edges.map((e, i) => (i === delE ? { ...e, color: "--setB", dash: [5, 4], width: 2.5 } : { ...e, color: "--muted" }));
          legend.innerHTML = `${sw("--setB", true)}a törölt él (kattints rá még egyszer a visszaállításhoz)`;
        } else {
          const inN = new Set(S.keepN), inE = new Set(S.keepE), sc = new Map(S.keepN.map((v, t) => [v, S.cent[q][t]]));
          const mx = Math.max(...S.cent[q]) || 1;
          nodes = G.nodes.map((nd, i) => inN.has(i)
            ? Object.assign({}, nd, { color: mixColor("--card", MCOL[q], 0.25 + 0.75 * sc.get(i) / mx), ink: sc.get(i) / mx > 0.5 ? null : "--text" })
            : Object.assign({}, nd, { color: faded, ink: "--muted" }));
          edges = G.edges.map((e, i) => (inE.has(i) ? { ...e, color: "--muted" } : { ...e, color: "--border", dash: [4, 4], alpha: 0.8 }));
          legend.innerHTML = `${sw("--border", true)}${what === "edges" ? "hiányzó él" : "hiányzó csúcs és élei (halvány)"} · a csúcs színe: ${MEAS[q][0]} a hiányos gráfon`;
        }
        view.setGraph(nodes, edges);
        /* rangsorok */
        const sc = score(S, q), b0 = S.keepN.map(i => base[q][i]), b1 = S.cent[q];
        const o0 = orderBy(b0.length, t => b0[t]).slice(0, 5), o1 = orderBy(b1.length, t => b1[t]).slice(0, 5);
        const d = q === "btw" ? 1 : q === "eig" ? 2 : 0;
        side.innerHTML = `<div class="tw" style="overflow-x:auto">${tbl(["hely", "eredeti", "hiányos"],
          o0.map((_, r) => [r + 1 + ".", `${lab(S.keepN[o0[r]])} <span class="muted">(${fmt(b0[o0[r]], d)})</span>`, `${lab(S.keepN[o1[r]])} <span class="muted">(${fmt(b1[o1[r]], d)})</span>`]))}</div>` +
          `<p class="muted" style="font-size:.85rem;margin:.2rem 0">${what === "nodes" ? "Az eredeti oszlop is csak a megmaradt csúcsokat rangsorolja." : "Mind a " + n + " csúcs rangsora."}</p>`;
        info.innerHTML = `${what === "edges" ? `törölve ${G.edges.length - S.keepE.length} / ${G.edges.length} él` : `törölve ${n - S.keepN.length} / ${n} csúcs`} (${pct(f)}) · ` +
          `${MEAS[q][0]}: Spearman <b>ρ = ${fmt(sc.rho, 3)}</b> · az első helyezett ${sc.same ? "<b>ugyanaz</b>" : "<b>más</b>"}`;
        root.dataset.sample = JSON.stringify({ rho: +sc.rho.toFixed(4), same: sc.same });
        renderArv();
      }
      function many() {
        if (stopper) stopper();
        const R = rng(1000 + seed++), acc = {}; Object.keys(MEAS).forEach(q => (acc[q] = { r: [], s: 0 }));
        const T = 100;
        stopper = chunked(T, 10, () => { const S = draw1(R); Object.keys(MEAS).forEach(q => { const s = score(S, q); acc[q].r.push(s.rho); acc[q].s += s.same; }); },
          i => (prog.textContent = `${i} / ${T} minta…`),
          () => {
            stopper = null; prog.textContent = "";
            const out = {};
            manyBox.style.display = "";
            manyBox.innerHTML = `${T} minta, ${what === "edges" ? "élek" : "csúcsok"} ${pct(f)}-a hiányzik:<br>` + Object.keys(MEAS).map(q => {
              const ms = meanSd(acc[q].r); out[q] = { rho: +ms.mean.toFixed(3), same: acc[q].s / T };
              return `${sw(MCOL[q])}${MEAS[q][0]}: átlagos ρ = <b>${fmt(ms.mean, 3)}</b> (szórás ${fmt(ms.sd, 3)}), az első helyezett egyezik: <b>${pct(acc[q].s / T)}</b>`;
            }).join("<br>");
            root.dataset.many = JSON.stringify(out);
          });
      }
      function curve() {
        if (stopper) stopper();
        const FS = [0, 0.05, 0.1, 0.2, 0.3, 0.5], T = 100, R = rng(5000 + seed++), f0 = f, res = FS.map(() => { const o = {}; Object.keys(MEAS).forEach(q => (o[q] = { r: 0, s: 0 })); return o; });
        stopper = chunked(FS.length * T, 20, i => {
          const k = Math.floor(i / T); f = FS[k];
          const S = draw1(R); Object.keys(MEAS).forEach(q => { const s = score(S, q); res[k][q].r += s.rho / T; res[k][q].s += s.same / T; });
          f = f0;
        }, i => (prog.textContent = `görbe: ${i} / ${FS.length * T}…`), () => {
          stopper = null; prog.textContent = ""; f = f0;
          const L = 40, Rm = 10, Tp = 22, B = 30, Wd = 330, Ht = 210, X = x => L + x / 0.5 * (Wd - L - Rm);
          const panel = (key, title, ymin) => {
            const Y = y => Tp + (1 - (y - ymin) / (1 - ymin)) * (Ht - Tp - B);
            let g = `<text x="${L}" y="14" font-size="12" font-weight="600" fill="${sv("--text")}">${title}</text>`;
            for (let j = 0, J = Math.round((1 - ymin) / 0.1) > 5 ? Math.round((1 - ymin) / 0.2) : Math.round((1 - ymin) / 0.1); j <= J; j++) { const y = ymin + j * (1 - ymin) / J; g += `<line x1="${L}" y1="${Y(y)}" x2="${Wd - Rm}" y2="${Y(y)}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${L - 4}" y="${Y(y) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(key === "s" ? 100 * y : y, key === "s" ? 0 : 2)}${key === "s" ? "%" : ""}</text>`; }
            FS.forEach(x => g += `<text x="${X(x)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${pct(x)}</text>`);
            g += `<text x="${(L + Wd) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">hiányzó arány f</text>`;
            Object.keys(MEAS).forEach((q, qi) => {
              const pts = FS.map((x, k) => `${X(x)},${Y(Math.max(ymin, res[k][q][key]))}`);
              g += `<polyline points="${pts.join(" ")}" fill="none" stroke="${sv(MCOL[q])}" stroke-width="2.2" ${qi === 2 ? 'stroke-dasharray="5 3"' : ""}/>` +
                pts.map(p => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="${sv(MCOL[q])}"/>`).join("");
            });
            return svgEl(Wd, Ht, g, title);
          };
          const minR = Math.min(...res.map(o => Math.min(...Object.values(o).map(v => v.r))));
          const minS = Math.min(...res.map(o => Math.min(...Object.values(o).map(v => v.s))));
          curveBox.innerHTML = `<div class="two-col">${panel("r", "átlagos Spearman ρ", Math.max(-1, Math.min(0.8, Math.floor(minR * 5) / 5)))}${panel("s", "az első helyezett egyezik", Math.min(0.8, Math.floor(minS * 5) / 5))}</div>` +
            `<p class="muted" style="font-size:.86rem;margin:.2rem 0">${Object.keys(MEAS).map(q => sw(MCOL[q]) + MEAS[q][0]).join(" ")} · ${what === "edges" ? "élek" : "csúcsok"} hiányoznak, pontonként ${T} minta</p>` +
            `<div class="tw" style="overflow-x:auto">${tbl(["$f$", ...Object.keys(MEAS).map(q => MEAS[q][0] + " ρ"), ...Object.keys(MEAS).map(q => MEAS[q][0] + ": 1. egyezik")],
              FS.map((x, k) => [pct(x), ...Object.keys(MEAS).map(q => fmt(res[k][q].r, 3)), ...Object.keys(MEAS).map(q => pct(res[k][q].s))]))}</div>`;
          math(curveBox);
          root.dataset.curve = JSON.stringify(FS.map((x, k) => [x, ...Object.keys(MEAS).map(q => +res[k][q].r.toFixed(3)), ...Object.keys(MEAS).map(q => +res[k][q].s.toFixed(2))]));
        });
      }
      /* Árvízhét: egyetlen él törlése → köztesség előtte / utána */
      function renderArv() {
        if (net !== "arviz") { arvBox.innerHTML = ""; return; }
        const b0 = base.btw;
        let s = `<p style="margin:.2rem 0;font-size:.92rem"><b>Egy él törlése:</b> kattints a gráfon egy élre – a táblázat a köztességet (nem normálva) mutatja előtte és utána.</p>`;
        if (delE < 0) {
          const o = orderBy(n, i => b0[i]);
          s += `<div class="tw" style="overflow-x:auto">${tbl(["szereplő", ...o.map(i => lab(i))], [["köztesség", ...o.map(i => fmt(b0[i], 1))]])}</div>`;
        } else {
          const E = G.edges.filter((_, i) => i !== delE), b1 = betweennessC(n, E), o = orderBy(n, i => b1[i]), e = G.edges[delE];
          const t0 = argmax(b0), t1 = argmax(b1), tie1 = o.filter(i => Math.abs(b1[i] - b1[o[0]]) < 1e-9);
          s += `<div class="tw" style="overflow-x:auto">${tbl(["szereplő", "előtte", "utána", "változás"],
            o.map(i => ({ c: [`${lab(i)} <span class="muted">(${actorName(lab(i))})</span>`, fmt(b0[i], 1), `<b>${fmt(b1[i], 1)}</b>`, (b1[i] - b0[i] > 1e-9 ? "+" : "") + fmt(b1[i] - b0[i], 1)],
              st: tie1.includes(i) ? "background:var(--accent-soft)" : "" })))}</div>` +
            `<div class="readout">${lab(e.a)} – ${lab(e.b)} törölve: ` +
            (tie1.length > 1 ? `holtverseny az élen: ${tie1.map(lab).join(" = ")} (${fmt(b1[o[0]], 1)})` : `az első: <b>${lab(t1)}</b> (${fmt(b1[t1], 1)})${t1 !== t0 ? " – megváltozott, ki a legfontosabb közvetítő!" : " – nem változott"}`) +
            ` · Spearman ρ = ${fmt(spearman(b0, b1), 3)}</div>`;
          root.dataset.del = JSON.stringify({ edge: [lab(e.a), lab(e.b)], btw: Object.fromEntries(G.nodes.map((nd, i) => [nd.label, +b1[i].toFixed(2)])) });
        }
        arvBox.innerHTML = s;
      }
      root._delEdge = (a, b) => { delE = G.edges.findIndex(e => (lab(e.a) === a && lab(e.b) === b) || (lab(e.a) === b && lab(e.b) === a)); render(); };
      onTheme(render);
      build();
    };

    /* ------------------------------------------------------------------
       10.6  sensitivity-grid – küszöb × felbontás robusztussági térkép
       ------------------------------------------------------------------ */
    W["sensitivity-grid"] = root => {
      header(root, "Érzékenységvizsgálat: küszöb × felbontás",
        "Les Misérables, súlyozott Louvain. Két elemzői döntés: melyik éleket tartod meg ($w \\ge t$), és milyen felbontással ($\\gamma$) keresel közösségeket. " +
        "Cellánként 5 futás, a legnagyobb modularitású felbontás számít; az NMI az alapesethez ($t = 1$, $\\gamma = 1$) méri a hasonlóságot. Kattints egy cellára!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const TS = [1, 2, 3, 5], GS = [0.5, 1, 1.5, 2], RUNS = 5;
      const G = lesmisGraph(0.62), n = G.nodes.length;
      let seed0 = 1, cells = null, baseLab = null, sel = [0, 1], stopper = null;
      const c1 = h("div", { class: "controls" });
      const prog = h("span", { class: "muted", style: "font-size:.85rem" });
      c1.append(btn("Újraszámolás más véletlen magokkal", () => { seed0 += 100; run(); }), prog);
      root.append(c1);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" }), box = h("div");
      grid.append(tw, box); root.append(grid);
      const info = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Ha egy állítás csak egy cellában igaz, az a beállítás eredménye, nem a hálózaté. A küszöb itt sokkal többet változtat, mint a felbontás.");
      root.append(info, lesson);
      const view = new GK.View(box, { aspect: 0.62, radius: narrow ? 4 : 5.5, draggable: false, maxW: 420 });

      const edgesAt = t => G.edges.filter(e => e.w >= t);
      function best(t, g) {
        const E = edgesAt(t); let b = null; const all = [];
        for (let r = 0; r < RUNS; r++) {
          const L = louvain(n, E, { gamma: g, weighted: true, R: rng(seed0 + r) });
          all.push(L.lab);
          if (!b || L.Q > b.Q + 1e-12) b = L;
        }
        return { lab: b.lab, Q: b.Q, all };
      }
      const kNon = lab => { const c = new Map(); lab.forEach(x => c.set(x, (c.get(x) || 0) + 1)); return [...c.values()].filter(v => v > 1).length; };
      function run() {
        if (stopper) stopper();
        cells = TS.map(() => GS.map(() => null)); baseLab = null;
        const jobs = [[0, 1], ...TS.flatMap((_, i) => GS.map((_, j) => [i, j])).filter(([i, j]) => !(i === 0 && j === 1))];
        draw();
        stopper = chunked(jobs.length, 1, k => {
          const [i, j] = jobs[k], B = best(TS[i], GS[j]);
          if (!baseLab) baseLab = B.lab;
          const nm = B.all.map(l => nmi(baseLab, l)), ms = meanSd(nm);
          cells[i][j] = { lab: B.lab, Q: B.Q, k: kNon(B.lab), nmi: nmi(baseLab, B.lab), mean: ms.mean, sd: ms.sd, iso: n - new Set(edgesAt(TS[i]).flatMap(e => [e.a, e.b])).size };
        }, k => { prog.textContent = k < jobs.length ? `${k} / ${jobs.length} cella…` : ""; draw(); }, () => {
          stopper = null; prog.textContent = ""; draw();
          root.dataset.result = JSON.stringify(cells.map(r => r.map(c => [c.k, +c.nmi.toFixed(3)])));
        });
      }
      function draw() {
        const cell = (i, j) => {
          const c = cells[i][j], on = sel[0] === i && sel[1] === j;
          if (!c) return `<td style="padding:.3em .5em;min-width:4.6em;text-align:center;color:var(--muted)">…</td>`;
          const bg = mixColor("--card", "--setA", 0.08 + 0.62 * c.nmi);
          return `<td data-c="${i},${j}" style="cursor:pointer;padding:.3em .5em;min-width:4.6em;text-align:center;background:${bg};${on ? "outline:3px solid var(--accent);outline-offset:-3px" : ""}">` +
            `<b>${c.k}</b> közösség<br><span style="font-family:var(--mono)">${fmt(c.nmi, 2)}</span><br><span class="muted" style="font-size:.78rem">átl. ${fmt(c.mean, 2)} ± ${fmt(c.sd, 2)}</span></td>`;
        };
        const done = cells.every(r => r.every(Boolean));
        const rowM = i => (cells[i].every(Boolean) ? fmt(meanSd(cells[i].map(c => c.nmi)).mean, 2) : "…");
        const colM = j => (cells.every(r => r[j]) ? fmt(meanSd(cells.map(r => r[j].nmi)).mean, 2) : "…");
        tw.innerHTML = `<table style="width:auto;margin:0;font-size:.86rem"><thead><tr><th style="padding:.3em">$t$ \\ $\\gamma$</th>${GS.map(g => `<th style="padding:.3em">${fmt(g, 1)}</th>`).join("")}<th class="muted" style="padding:.3em">átlag NMI</th></tr></thead><tbody>` +
          TS.map((t, i) => `<tr><th style="padding:.3em">$w \\ge ${t}$</th>${GS.map((_, j) => cell(i, j)).join("")}<td class="muted" style="text-align:center;font-family:var(--mono)">${rowM(i)}</td></tr>`).join("") +
          `<tr><th class="muted" style="padding:.3em">átlag</th>${GS.map((_, j) => `<td class="muted" style="text-align:center;font-family:var(--mono)">${colM(j)}</td>`).join("")}<td></td></tr></tbody></table>` +
          `<p class="muted" style="font-size:.82rem;margin:.3rem 0">Cellánként: a (nem egyelemű) közösségek száma, a legjobb futás NMI-je az alapesettel, alatta az 5 futás átlaga ± szórása. Minél sötétebb, annál hasonlóbb.</p>`;
        math(tw);
        tw.querySelectorAll("td[data-c]").forEach(td => td.addEventListener("click", () => { sel = td.dataset.c.split(",").map(Number); draw(); }));
        const c = cells[sel[0]][sel[1]];
        if (!c) { info.textContent = "számolás…"; return; }
        /* közösségek nagyság szerint sorszámozva, a magányos csúcsok halványak */
        const cnt = new Map(); c.lab.forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
        const order = [...cnt.keys()].filter(x => cnt.get(x) > 1).sort((a, b) => cnt.get(b) - cnt.get(a) || a - b), rk = new Map(order.map((x, i) => [x, i]));
        const faded = mixColor("--card", "--muted", 0.3), t = TS[sel[0]];
        view.setGraph(G.nodes.map((nd, i) => Object.assign({}, nd, { color: rk.has(c.lab[i]) ? commColor(rk.get(c.lab[i])) : faded })),
          G.edges.map(e => (e.w >= t ? { ...e, color: "--muted", width: 0.6 + 2.2 * Math.sqrt(e.w / 31) } : { ...e, color: "--border", width: 0.5, alpha: 0.35 })));
        const str = new Array(n).fill(0); edgesAt(t).forEach(e => { str[e.a] += e.w; str[e.b] += e.w; });
        const top = order.slice(0, 4).map((x, i) => {
          const mem = [...Array(n).keys()].filter(v => c.lab[v] === x).sort((a, b) => str[b] - str[a]);
          return `${sw(commColor(i))}${cnt.get(x)} fő: ${mem.slice(0, 3).map(v => G.nodes[v].name).join(", ")}${mem.length > 3 ? ", …" : ""}`;
        });
        info.innerHTML = `$w \\ge ${t}$, $\\gamma = ${fmM(GS[sel[1]], 1)}$: ${edgesAt(t).length} él, ${c.iso} csúcs elszigetelődik (halvány) · <b>${c.k}</b> közösség · $Q = ${fmM(c.Q, 3)}$ · NMI = <b>${fmt(c.nmi, 3)}</b><br>` +
          top.join("<br>") + (order.length > 4 ? `<br>… és még ${order.length - 4} közösség` : "") + (done ? "" : "<br><span class=\"muted\">(számolás folyamatban…)</span>");
        math(info);
      }
      onTheme(draw);
      run();
    };

    /* ------------------------------------------------------------------
       10.7  ergm-toy – ERGM kis gráfokon, teljes felsorolással
       ------------------------------------------------------------------ */
    W["ergm-toy"] = root => {
      header(root, "ERGM kicsiben: minden gráf valószínűsége",
        "$P(G) \\propto \\exp(\\theta_{\\text{él}} \\cdot \\text{élszám} + \\theta_\\Delta \\cdot \\text{háromszögszám})$. Kis csúcsszámon az összes gráfot fel tudjuk sorolni " +
        "(4 csúcson 64, 5-ön 1024, 6-on 32 768), így minden pontosan kiszámolható – nincs szükség szimulációra.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let n = 4, te = -1, tt = 0, ts = 0, adv = false;
      const ENUM = {}, CLS = {};
      const getE = k => ENUM[k] || (ENUM[k] = ergmEnum(k));

      const c1 = h("div", { class: "controls" });
      const paintN = toggleGroup(c1, [[4, "4 csúcs"], [5, "5 csúcs"], [6, "6 csúcs"]], n, v => { n = v; update(); });
      const advB = btn("haladó: 2-csillag", () => { adv = !adv; advB.classList.toggle("on", adv); if (!adv) { ts = 0; sSl.value = 0; sOut.textContent = fmt(0, 2); } sLab.style.display = adv ? "" : "none"; update(); });
      c1.append(advB);
      const c2 = h("div", { class: "controls" });
      const eOut = mono(fmt(te, 2)), tOut = mono(fmt(tt, 2)), sOut = mono("0");
      const eSl = range(-3, 3, 0.05, te, "élparaméter", () => { te = +eSl.value; update(); });
      const tSl = range(-2, 3, 0.05, tt, "háromszög-paraméter", () => { tt = +tSl.value; update(); });
      const sSl = range(-1, 1, 0.05, 0, "2-csillag-paraméter", () => { ts = +sSl.value; update(); });
      const sLab = h("label", { style: "display:none" }, "$\\theta_{2\\text{cs}}$", sSl, sOut);
      c2.append(h("label", null, "$\\theta_{\\text{él}}$", eSl, eOut), h("label", null, "$\\theta_\\Delta$", tSl, tOut), sLab);
      math(c2);
      const c3 = h("div", { class: "controls" });
      c3.append(h("span", { class: "muted", style: "font-size:.85rem" }, "Kipróbálnád?"),
        ...[[[-1, 0], "(−1; 0)"], [[0, 0], "(0; 0)"], [[-1, 2], "(−1; 2)"], [[-1, 0.5], "(−1; 0,5)"], [[-1, 1], "(−1; 1)"], [[-1.5, 1.2], "(−1,5; 1,2)"]]
          .map(([th, l]) => btn(l, () => setTheta(th[0], th[1]))));
      root.append(c1, c2, c3);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const distBox = h("div"), topBox = h("div");
      grid.append(distBox, topBox); root.append(grid);
      const info = h("div", { class: "readout" });
      const chBox = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.4rem" });
      root.append(info, chBox);
      /* illesztés */
      const fitWrap = h("div", { style: "margin-top:.9rem;border-top:1px solid var(--border);padding-top:.6rem" });
      fitWrap.append(h("div", { style: "font-weight:700;margin-bottom:.2rem" }, "Illesztés: melyik θ adja vissza a megfigyelt gráfot?"),
        h("p", { class: "muted", style: "font-size:.88rem;margin:0 0 .3rem", html: "A maximum-likelihood becslésnél a <b>várható</b> élszám és háromszögszám egyenlő a <b>megfigyelttel</b>. " +
          "Válassz egy 4 csúcsú gráfot, vagy kattints a csúcspárokra (a szaggatott vonalakra) az élek ki-be kapcsolásához." }));
      const f1 = h("div", { class: "controls" }), f2 = h("div", { class: "controls" });
      const OBS = { paw: [[0, 1], [0, 2], [1, 2], [2, 3]], triIso: [[0, 1], [0, 2], [1, 2]], path: [[0, 1], [1, 2], [2, 3]], star: [[0, 1], [0, 2], [0, 3]] };
      let obs = new Set(OBS.paw.map(([a, b]) => a + "-" + b)), fitModel = "et";
      const paintObs = toggleGroup(f1, [["paw", "háromszög + függő él"], ["triIso", "háromszög + magányos csúcs"], ["path", "3 élű út"], ["star", "csillag"]], "paw",
        v => { obs = new Set(OBS[v].map(([a, b]) => a + "-" + b)); fit(); });
      toggleGroup(f2, [["e", "csak élparaméter"], ["et", "él + háromszög"]], fitModel, v => { fitModel = v; fit(); });
      const fitGrid = h("div", { class: "two-col", style: "align-items:center" });
      const obsBox = h("div", { style: "max-width:220px" }), fitOut = h("div", { class: "readout", style: "margin-top:0" });
      fitGrid.append(obsBox, fitOut);
      const applyB = btn("Beállítás a csúszkákra (4 csúcs)", () => { if (lastFit) { n = 4; paintN(4); setTheta(lastFit[0], lastFit[1]); } });
      const f3 = h("div", { class: "controls" }); f3.append(applyB);
      fitWrap.append(f1, f2, fitGrid, f3);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Az ERGM-ben a paraméter azt mondja meg, mennyivel valószínűbb egy él, ha háromszöget zár – de a háromszög-tag könnyen „elszabadul”: ezért használnak a gyakorlatban szelídebb tagokat (GWESP).");
      root.append(fitWrap, lesson);
      let lastFit = null;

      function setTheta(a, b) {
        te = a; tt = b; eSl.value = a; tSl.value = b; update();
      }
      /* izomorfiaosztályok: minden gráfra a kanonikus (legkisebb) kód az összes csúcspermutáció közül; 6 csúcson darabolva */
      function classes(k, done) {
        if (CLS[k] && CLS[k].ready) return CLS[k];
        if (CLS[k]) return null;
        const E = getE(k), m = E.pairs.length, pid = zeros(k); E.pairs.forEach(([i, j], q) => (pid[i][j] = pid[j][i] = q));
        const maps = []; forEachPerm(k, p => maps.push(E.pairs.map(([i, j]) => 1 << pid[p[i]][p[j]])));
        const canon = new Int32Array(E.count), st = CLS[k] = { ready: false };
        const job = g => {
          let best = g;
          for (const mp of maps) { let c = 0; for (let q = 0; q < m; q++) if (g >> q & 1) c |= mp[q]; if (c < best) best = c; }
          canon[g] = best;
        };
        const fin = () => {
          const M = new Map();
          for (let g = 0; g < E.count; g++) { const c = canon[g]; if (!M.has(c)) M.set(c, { rep: c, size: 0 }); M.get(c).size++; }
          st.list = [...M.values()]; st.ready = true; done();
        };
        if (E.count <= 1024) { for (let g = 0; g < E.count; g++) job(g); fin(); return st; }
        chunked(E.count, 1024, job, i => (topBox.innerHTML = `<p class="muted">izomorfiaosztályok számolása… ${Math.round(100 * i / E.count)}%</p>`), fin);
        return null;
      }
      const smallG = (k, g, Wd = 92) => {
        const P = [...Array(k).keys()].map(i => [Wd / 2 + Wd * 0.36 * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / k), Wd / 2 + Wd * 0.36 * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / k)]);
        const E = getE(k); let s = "";
        E.pairs.forEach(([i, j], q) => { if (g >> q & 1) s += `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}" stroke="${sv("--setA")}" stroke-width="2.2"/>`; });
        P.forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="5.5" fill="${sv("--card")}" stroke="${sv("--text")}" stroke-width="1.5"/>`));
        return svgEl(Wd, Wd, s, "gráf");
      };
      function update() {
        eOut.textContent = fmt(te, 2); tOut.textContent = fmt(tt, 2); sOut.textContent = fmt(ts, 2);
        const E = getE(n), p = ergmDist(E, [te, tt, ts]), m = E.pairs.length;
        const pe = new Array(m + 1).fill(0); let Ee = 0, Et = 0;
        for (let g = 0; g < E.count; g++) { pe[E.edges[g]] += p[g]; Ee += p[g] * E.edges[g]; Et += p[g] * E.tri[g]; }
        /* (a) élszám-eloszlás */
        const L = 34, Rm = 6, Tp = 16, B = 30, Wd = 360, Ht = 200, mx = Math.max(...pe), ymax = Math.max(0.1, Math.ceil(mx * 10) / 10);
        const bw = (Wd - L - Rm) / (m + 1), Y = v => Tp + (1 - v / ymax) * (Ht - Tp - B);
        let g = "";
        for (let st = ymax <= 0.2 ? 0.05 : 0.1, j = 0; j <= Math.round(ymax / st); j++) { const v = j * st; g += `<line x1="${L}" y1="${Y(v)}" x2="${Wd - Rm}" y2="${Y(v)}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${L - 4}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(v, 2)}</text>`; }
        pe.forEach((v, k) => {
          const x = L + k * bw;
          g += `<rect x="${x + 1}" y="${Y(v)}" width="${bw - 2}" height="${Y(0) - Y(v)}" fill="${sv("--setA")}" rx="1.5"><title>${k} él: ${fmt(v, 3)}</title></rect>` +
            `<text x="${x + bw / 2}" y="${Ht - B + 13}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${k}</text>`;
          if (m <= 10 || v >= 0.08) g += `<text x="${x + bw / 2}" y="${Y(v) - 3}" text-anchor="middle" font-size="${m <= 6 ? 10 : 8.5}" fill="${sv("--text")}">${fmt(v, m <= 6 ? 3 : 2)}</text>`;
        });
        const ex = L + (Ee + 0.5) * bw;
        g += `<line x1="${ex}" y1="${Tp - 4}" x2="${ex}" y2="${Y(0)}" stroke="${sv("--setB")}" stroke-width="1.8" stroke-dasharray="4 3"/>` +
          `<text x="${Wd / 2}" y="${Ht - 4}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">élszám (szaggatott: a várható érték)</text>`;
        distBox.innerHTML = `<div style="font-weight:600;font-size:.9rem">Az élszám eloszlása (${n} csúcs)</div>` + svgEl(Wd, Ht, g, "az élszám eloszlása");
        /* kétpúpú-e? (két számottevő helyi maximum, köztük mély völgy) */
        const peaks = pe.map((v, k) => k).filter(k => pe[k] >= 0.03 && (k === 0 || pe[k] > pe[k - 1]) && (k === m || pe[k] >= pe[k + 1]));
        let bimodal = false;
        for (let a = 0; a < peaks.length; a++) for (let b = a + 1; b < peaks.length; b++) {
          const valley = Math.min(...pe.slice(peaks[a], peaks[b] + 1));
          if (valley < 0.5 * Math.min(pe[peaks[a]], pe[peaks[b]]) && peaks[b] - peaks[a] >= 3) bimodal = true;
        }
        const pFull = p[E.count - 1], pEmpty = p[0];
        let s = `várható élszám <b>${fmt(Ee, 2)}</b> (a ${m} lehetségesből) · várható háromszögszám <b>${fmt(Et, 3)}</b> · P(üres) = ${fmt(pEmpty, 3)} · P(teljes) = ${fmt(pFull, 3)}`;
        if (bimodal) s += `<br><b>Degeneráció:</b> az eloszlás kétpúpú – a modell vagy majdnem üres, vagy majdnem teljes gráfot ad, a megfigyelthez hasonló „közepes” gráf ritka.`;
        else if (pFull >= 0.15 && n >= 5) s += `<br><b>Elszabadulás:</b> a valószínűség a teljes gráf felé tolódik (P(${m} él) = ${fmt(pFull, 3)}) – egy kis paraméterváltozás is nagyot mozdít a várható élszámon.`;
        info.innerHTML = s;
        root.dataset.result = JSON.stringify({ n, th: [te, tt, ts], Ee: +Ee.toFixed(3), Et: +Et.toFixed(3), pe: pe.map(v => +v.toFixed(3)), pFull: +pFull.toFixed(3), pEmpty: +pEmpty.toFixed(3), bimodal });
        /* (c) a 4 legvalószínűbb izomorfiaosztály */
        const C = classes(n, () => update());
        if (C) {
          const top = C.list.map(c => ({ ...c, P: c.size * p[c.rep] })).sort((a, b) => b.P - a.P).slice(0, 4);
          topBox.innerHTML = `<div style="font-weight:600;font-size:.9rem">A 4 legvalószínűbb gráf (izomorfiaosztályonként, ${C.list.length} osztály)</div>` +
            `<div style="display:grid;grid-template-columns:repeat(${narrow ? 2 : 4},minmax(0,1fr));gap:.3rem;margin-top:.3rem">` +
            top.map(c => `<div style="text-align:center;font-size:.8rem">${smallG(n, c.rep)}<b>${fmt(c.P, 3)}</b><br><span class="muted">${E.edges[c.rep]} él, ${E.tri[c.rep]} △<br>${c.size} címkézés × ${fmt(p[c.rep], 4)}</span></div>`).join("") + `</div>`;
          root.dataset.top = JSON.stringify(top.map(c => [+c.P.toFixed(3), E.edges[c.rep], E.tri[c.rep], c.size]));
        }
        /* (d) változási statisztika */
        const rows = [];
        for (let c = 0; c <= n - 2; c++) { const z = te + tt * c; rows.push([c, fmt(z, 2), `<b>${fmt(1 / (1 + Math.exp(-z)), 3)}</b>`]); }
        chBox.innerHTML = `<p style="margin:.3rem 0 .1rem;font-size:.9rem"><b>Változási statisztika:</b> ha egy csúcspár közt $c$ közös szomszéd van, az él behúzása $1$ éllel és $c$ háromszöggel növeli a statisztikákat, ezért ` +
          `$P(\\text{él} \\mid \\text{a többi}) = 1/(1 + e^{-(\\theta_{\\text{él}} + \\theta_\\Delta c)})$` + (ts ? ` (a 2-csillag-tag ehhez még $\\theta_{2\\text{cs}}(k_i + k_j)$-t ad, itt nem szerepel)` : "") + `.</p>` +
          tbl(["közös szomszéd $c$", "$\\theta_{\\text{él}} + \\theta_\\Delta c$", "$P(\\text{él} \\mid \\text{a többi})$"], rows);
        math(chBox);
      }
      /* ---- illesztés 4 csúcson ---- */
      const E4 = getE(4);
      const obsMask = () => E4.pairs.reduce((s, [a, b], q) => s | (obs.has(a + "-" + b) ? 1 << q : 0), 0);
      function drawObs() {
        const S = 200, P = [[100, 22], [24, 176], [176, 176], [100, 118]];   // síkba rajzolva: a 4. csúcs középen, nincs élkereszteződés
        let s = "";
        E4.pairs.forEach(([a, b], q) => {
          const on = obs.has(a + "-" + b);
          s += `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${on ? sv("--setA") : sv("--border")}" stroke-width="${on ? 4 : 1.6}" ${on ? "" : 'stroke-dasharray="5 4"'}/>` +
            `<line data-p="${a}-${b}" x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="transparent" stroke-width="18" style="cursor:pointer"/>`;
        });
        P.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="14" fill="${sv("--card")}" stroke="${sv("--text")}" stroke-width="2"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="600" fill="${sv("--text")}">${i + 1}</text>`));
        obsBox.innerHTML = svgEl(S, S, s, "a megfigyelt gráf (kattintással szerkeszthető)");
        obsBox.querySelectorAll("line[data-p]").forEach(l => l.addEventListener("click", () => { const k = l.dataset.p; obs.has(k) ? obs.delete(k) : obs.add(k); paintObs(null); fit(); }));
      }
      /* a (él, háromszög) statisztika-pontok konvex burka – ha a megfigyelt pont a burok határán van, nincs véges MLE */
      function hull(pts) {
        const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        const lo = [], up = [];
        for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
        for (const p of P.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
        return lo.slice(0, -1).concat(up.slice(0, -1));          // az óramutatóval ellentétes körüljárás
      }
      function fit() {
        drawObs();
        const g = obsMask(), me = E4.edges[g], mt = E4.tri[g];
        let s = `megfigyelt: <b>${me}</b> él, <b>${mt}</b> háromszög<br>`;
        const moments = th => { const p = ergmDist(E4, [th[0], th[1]]); let e = 0, t = 0, ee = 0, et = 0, tt2 = 0; for (let k = 0; k < E4.count; k++) { const a = E4.edges[k], b = E4.tri[k]; e += p[k] * a; t += p[k] * b; ee += p[k] * a * a; et += p[k] * a * b; tt2 += p[k] * b * b; } return { e, t, vee: ee - e * e, vet: et - e * t, vtt: tt2 - t * t }; };
        lastFit = null;
        let res = { obs: [me, mt], model: fitModel };
        if (fitModel === "e") {
          if (me === 0 || me === 6) { s += `A becslés <b>nem létezik</b>: ${me === 0 ? "üres gráfra $\\theta_{\\text{él}} \\to -\\infty$" : "teljes gráfra $\\theta_{\\text{él}} \\to +\\infty$"}.`; res.none = true; }
          else {
            const th = Math.log(me / (6 - me)), M = moments([th, 0]); lastFit = [th, 0];
            s += `$\\hat\\theta_{\\text{él}} = \\ln\\frac{${me}}{${6 - me}} = ${fmM(th, 3)}$ → várható élszám ${fmt(M.e, 3)}, várható háromszögszám <b>${fmt(M.t, 3)}</b> (megfigyelt: ${mt}).` +
              (Math.abs(M.t - mt) > 0.05 ? ` A csak élparaméteres modell ${M.t > mt ? "több" : "kevesebb"} háromszöget vár, mint amennyi van.` : "");
            res.th = [+th.toFixed(4), 0]; res.Et = +M.t.toFixed(4);
          }
        } else {
          const pts = [], seen = new Set();
          for (let k = 0; k < E4.count; k++) { const key = E4.edges[k] + "," + E4.tri[k]; if (!seen.has(key)) { seen.add(key); pts.push([E4.edges[k], E4.tri[k]]); } }
          const H = hull(pts); let normal = null;
          for (let i = 0; i < H.length; i++) {
            const a = H[i], b = H[(i + 1) % H.length], dx = b[0] - a[0], dy = b[1] - a[1];
            const cr = dx * (mt - a[1]) - dy * (me - a[0]), dot = (me - a[0]) * dx + (mt - a[1]) * dy;
            if (Math.abs(cr) < 1e-9 && dot >= -1e-9 && dot <= dx * dx + dy * dy + 1e-9) {
              const nv = [dy, -dx], L = Math.hypot(...nv);                     // kifelé mutató normális (pozitív körüljárásnál)
              normal = normal ? [normal[0] + nv[0] / L, normal[1] + nv[1] / L] : [nv[0] / L, nv[1] / L];
            }
          }
          if (normal) {
            const dir = (v, name) => (Math.abs(v) < 1e-9 ? "" : `${name} a ${v > 0 ? "+∞" : "−∞"} felé`);
            const parts = [dir(normal[1], "a háromszög-paraméter"), dir(normal[0], "az élparaméter")].filter(Boolean);
            s += `A becslés <b>nem létezik</b> – ${parts.join(", ")} szalad. A megfigyelt (élszám, háromszögszám) pont a lehetséges pontok konvex burkának a szélén van: ` +
              (mt === 0 && me > 0 && me < 6 ? `${me} élhez 0-nál kevesebb háromszög nem lehet, ezért a likelihood mindig nő, ha $\\theta_\\Delta$-t tovább csökkented.` : "a likelihood ebben az irányban a végtelenségig nő.");
            res.none = true; res.dir = normal.map(v => +v.toFixed(3));
          } else {
            let th = [0, 0];
            for (let it = 0; it < 100; it++) {
              const M = moments(th), gE = me - M.e, gT = mt - M.t, det = M.vee * M.vtt - M.vet * M.vet;
              if (Math.hypot(gE, gT) < 1e-11 || det <= 1e-14) break;
              let dE = (M.vtt * gE - M.vet * gT) / det, dT = (M.vee * gT - M.vet * gE) / det;
              const st = Math.max(1, Math.hypot(dE, dT) / 2); th = [th[0] + dE / st, th[1] + dT / st];
            }
            const M = moments(th); lastFit = th;
            s += `$\\hat\\theta = (${fmM(th[0], 3)};\\ ${fmM(th[1], 3)})$ → várható élszám ${fmt(M.e, 3)}, várható háromszögszám ${fmt(M.t, 3)} – pontosan a megfigyelt.` +
              `<br>${th[1] > 0 ? "Pozitív $\\theta_\\Delta$: a háromszöget záró él valószínűbb." : "Negatív $\\theta_\\Delta$: a modell kevesebb háromszöget „akar”, mint amennyit az élszám magától hozna."}`;
            res.th = th.map(v => +v.toFixed(4)); res.E = [+M.e.toFixed(4), +M.t.toFixed(4)];
          }
        }
        applyB.disabled = !lastFit;
        fitOut.innerHTML = s; math(fitOut);
        root.dataset.fit = JSON.stringify(res);
      }
      onTheme(() => { update(); drawObs(); });
      update(); fit();
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
