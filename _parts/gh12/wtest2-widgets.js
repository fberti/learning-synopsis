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
     w2: 12.4–12.5 widgetjei (transe-2d, kg-patterns, temporal-stream)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const fm = (x, d = 2) => fmt(x, d).replace("-", "−");
    const dot2 = c => `<span style="display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const line2 = (c, dash) => `<span style="display:inline-block;width:1.4em;height:0;border-top:2.5px ${dash ? "dashed" : "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const OK = "✓", NO = "✗";
    const range = (min, max, step, value, label, oninput, width = "8rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:40vw`, oninput });
    const svgEl = (Wd, Ht, label) => {
      const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("viewBox", `0 0 ${Wd} ${Ht}`); s.setAttribute("role", "img"); s.setAttribute("aria-label", label);
      s.style.cssText = `width:100%;max-width:${Wd}px;display:block;touch-action:none;user-select:none`;
      return s;
    };
    const tblHTML = (head, rows, cls = "") =>
      `<table class="${cls}" style="width:auto;margin:.3rem 0;font-size:.86rem"><thead><tr>${head.map(x => `<th style="padding:.2em .45em">${x}</th>`).join("")}</tr></thead>` +
      `<tbody>${rows.map(r => `<tr${r.attr ? " " + r.attr : ""}${r.st ? ` style="${r.st}"` : ""}>${(r.c || r).map(x => `<td style="padding:.2em .45em;text-align:center">${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    /* koordinátasík: [lo; hi]² → SVG-pixel */
    function plane(lo, hi, size, pad = 22) {
      const S = (size - 2 * pad) / (hi - lo);
      return { lo, hi, size, pad, S, X: x => pad + (x - lo) * S, Y: y => size - pad - (y - lo) * S };
    }
    function gridSVG(P) {
      let s = "";
      for (let k = P.lo; k <= P.hi; k++) {
        const ax = k === 0;
        s += `<line x1="${P.X(k)}" y1="${P.Y(P.lo)}" x2="${P.X(k)}" y2="${P.Y(P.hi)}" style="stroke:var(${ax ? "--muted" : "--border"});stroke-width:${ax ? 1.2 : 0.8}"/>`;
        s += `<line x1="${P.X(P.lo)}" y1="${P.Y(k)}" x2="${P.X(P.hi)}" y2="${P.Y(k)}" style="stroke:var(${ax ? "--muted" : "--border"});stroke-width:${ax ? 1.2 : 0.8}"/>`;
        s += `<text x="${P.X(k)}" y="${P.Y(P.lo) + 13}" text-anchor="middle" style="fill:var(--muted);font-size:9.5px">${k < 0 ? "−" + -k : k}</text>`;
        s += `<text x="${P.X(P.lo) - 5}" y="${P.Y(k) + 3}" text-anchor="end" style="fill:var(--muted);font-size:9.5px">${k < 0 ? "−" + -k : k}</text>`;
      }
      return s;
    }
    /* nyíl (x1,y1) → (x2,y2) */
    function arrowSVG(x1, y1, x2, y2, col, { w = 2.4, dash = "", op = 1, hs = 8 } = {}) {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      if (L < 1) return "";
      const ux = dx / L, uy = dy / L, bx = x2 - ux * hs, by = y2 - uy * hs;
      return `<g style="opacity:${op}"><line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" style="stroke:${sv(col)};stroke-width:${w}${dash ? ";stroke-dasharray:" + dash : ""}"/>` +
        `<path d="M${x2} ${y2}L${bx - uy * hs * 0.5} ${by + ux * hs * 0.5}L${bx + uy * hs * 0.5} ${by - ux * hs * 0.5}Z" style="fill:${sv(col)}"/></g>`;
    }
    const labelSVG = (x, y, txt, { anchor = "start", fs = 11, col = "--text" } = {}) =>
      `<text x="${x}" y="${y}" text-anchor="${anchor}" style="fill:${sv(col)};font-size:${fs}px;font-weight:600;paint-order:stroke;stroke:var(--card);stroke-width:3px;pointer-events:none">${esc(txt)}</text>`;
    /* pontok feliratai: az egybeeső pontok egy közös feliratot kapnak */
    function pointLabels(pts, Wd, fs = 11) {
      const groups = new Map();
      pts.forEach(p => { const k = Math.round(p.x / 6) + "," + Math.round(p.y / 6); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(p); });
      let s = "";
      groups.forEach(g => {
        const p = g[0], lab = g.map(q => q.label).join(" = "), tw = 0.58 * fs * lab.length, left = p.x + 9 + tw > Wd - 2;
        s += labelSVG(left ? p.x - 9 : p.x + 9, p.y - 7, lab, { anchor: left ? "end" : "start", fs });
      });
      return s;
    }
    /* SVG-pont az eseményből */
    function svgPt(svg, ev) {
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    /* húzás: a [data-drag] elemek; onMove(kulcs, svgX, svgY) */
    function dragSVG(svg, onMove, onEnd = () => {}) {
      let key = null;
      svg.addEventListener("pointerdown", ev => {
        const t = ev.target.closest("[data-drag]"); if (!t) return;
        key = t.dataset.drag; svg.setPointerCapture(ev.pointerId); ev.preventDefault();
        const p = svgPt(svg, ev); onMove(key, p.x, p.y);
      });
      svg.addEventListener("pointermove", ev => { if (key == null) return; const p = svgPt(svg, ev); onMove(key, p.x, p.y); });
      const end = () => { if (key != null) { key = null; onEnd(); } };
      svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    }
    /* láthatóság figyelése (animáció csak látható widgeten) */
    function watchVisible(root, cb) {
      let vis = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es.some(e => e.isIntersecting); cb(vis); }).observe(root);
      return () => vis;
    }
    const v2 = {
      add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
      norm: a => Math.hypot(a[0], a[1])
    };
    const round = (x, d = 4) => +x.toFixed(d);

    /* ------------------------------------------------------------------
       12.4  transe-2d – TransE a síkon
       ------------------------------------------------------------------ */
    W["transe-2d"] = root => {
      header(root, "TransE a síkon: a reláció egy eltolás",
        "Minden entitás egy pont, minden reláció egy vektor. A $(h, r, t)$ hármas annál „igazabb”, minél közelebb van " +
        "$\\mathbf h + \\mathbf r$ a $\\mathbf t$-hez: a pontszám $-\\lVert \\mathbf h + \\mathbf r - \\mathbf t\\rVert$. " +
        "Húzd az entitásokat és a reláció nyilának végét (◆) – vagy tanítsd a modellt.");
      math(root.querySelector(".w-sub"));
      const T3 = D.triples;
      const arvT = [["Szakértő", "bírálja", "Kormány"], ["Polgármester", "köszönetet mond", "Kormány"], ["Polgármester", "fórumot tart", "Lakók"],
        ["Önkéntesek", "gyűjtést indít", "Lakók"], ["Polgármester", "köszönti", "Önkéntesek"]].filter(t => T3.some(u => u[0] === t[0] && u[1] === t[1] && u[2] === t[2]));
      const arvE = [...new Set(arvT.flatMap(t => [t[0], t[2]]))], arvR = [...new Set(arvT.map(t => t[1]))];
      const PRE = {
        cap: { name: "fővárosok", ents: [["Budapest", 1, 1], ["Bécs", 1, 3], ["Prága", 1, 5], ["Magyarország", 4, 2], ["Ausztria", 4, 4], ["Csehország", 4, 6]],
          rels: [["fővárosa", 3, 1]], tr: [[0, 0, 3], [1, 0, 4], [2, 0, 5]], q: [2, 0] },
        one: { name: "1–N: városai", ents: [["Magyarország", 1, 3], ["Budapest", 4, 4], ["Debrecen", 4, 2]], rels: [["városa", 3, 0]], tr: [[0, 0, 1], [0, 0, 2]], q: [0, 0] },
        sym: { name: "szimmetrikus: házastársa", ents: [["Anna", 1, 1], ["Béla", 4, 3]], rels: [["házastársa", 3, 2]], tr: [[0, 0, 1], [1, 0, 0]], q: [0, 0] },
        arv: { name: "Árvízhét", ents: arvE.map(n => [n, 0, 0]), rels: arvR.map(r => [r, 0, 0]),
          tr: arvT.map(t => [arvE.indexOf(t[0]), arvR.indexOf(t[1]), arvE.indexOf(t[2])]), q: [arvE.indexOf("Szakértő"), arvR.indexOf("bírálja")], seed: 12 }
      };
      let key = "cap", E, R, TR, sel = 0, showAll = true, negs = [], loss = null, steps = 0, running = false, raf = 0, Rg = rng(7), seedN = 100;
      let gamma = 1, lr = 0.05, l2 = true, qh = 0, qr = 0, stopAt = 0, lastMove = Infinity;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["cap", "fővárosok"], ["one", "1–N: városai"], ["sym", "szimmetrikus: házastársa"], ["arv", "Árvízhét"]], key, v => { key = v; load(); });
      const c2 = h("div", { class: "controls" });
      const bTrain = btn("▶ Tanítás", () => (running ? stop() : start()));
      const b1 = btn("1 lépés", () => { stop(); trainStep(); render(); });
      const bRnd = btn("újrakezdés véletlen helyzetből", () => { stop(); randomize(seedN++); render(); });
      const bReset = btn("alaphelyzet", () => { stop(); load(); });
      c2.append(bTrain, b1, bRnd, bReset);
      const c3 = h("div", { class: "controls" });
      const gLab = h("b", { style: "font-family:var(--mono)" }, "1"), lLab = h("b", { style: "font-family:var(--mono)" }, "0,05");
      const gR = range(0.5, 3, 0.25, gamma, "margó", () => { gamma = +gR.value; gLab.textContent = fmt(gamma); });
      const lR = range(0.01, 0.2, 0.01, lr, "tanulási ráta", () => { lr = +lR.value; lLab.textContent = fmt(lr); });
      const cbAll = h("input", { type: "checkbox", checked: "" });
      cbAll.addEventListener("change", () => { showAll = cbAll.checked; render(); });
      const cbL2 = h("input", { type: "checkbox", checked: "" });
      cbL2.addEventListener("change", () => { l2 = cbL2.checked; });
      c3.append(h("label", null, "margó γ = ", gLab, " ", gR), h("label", null, "tanulási ráta ", lLab, " ", lR),
        h("label", null, cbAll, "a reláció a többi fejből is (szaggatva)"),
        h("label", { title: "lépésenként r ← (1 − 0,1·ráta)·r" }, cbL2, "a relációvektorok kis L2-büntetése"));
      root.append(c1, c2, c3);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), side = h("div");
      grid.append(box, side); root.append(grid);
      const P = plane(-1, 7, 380, 24);
      const svg = svgEl(P.size, P.size, "TransE-sík"); box.append(svg);
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      box.append(legend);
      legend.innerHTML = `${dot2("--setA")}entitás · ${line2("--setB")}reláció ($\\mathbf h \\to \\mathbf h + \\mathbf r$; ◆ húzható) · ` +
        `${line2("--setC", true)}hiba $\\mathbf h + \\mathbf r - \\mathbf t$ · ${line2("--muted", true)}negatív hármas`;
      math(legend);
      const tbox = h("div", { class: "readout" }), qbox = h("div", { class: "readout" }), info = h("div", { class: "readout" });
      side.append(tbox, qbox);
      root.append(info, h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A TransE egy relációt egy eltolásnak tanul. Ami nem eltolás (szimmetrikus, 1–N), azt csak úgy tudja, hogy összenyomja a pontokat."));
      const qH = h("select", { "aria-label": "fej" }), qR = h("select", { "aria-label": "reláció" });
      qH.addEventListener("change", () => { qh = +qH.value; render(); });
      qR.addEventListener("change", () => { qr = +qR.value; render(); });
      const qHead = h("div", { class: "controls", style: "margin:.2rem 0" }, h("b", null, "Lekérdezés: "), "(", qH, ", ", qR, ", ?)");
      const qOut = h("div");
      qbox.append(qHead, qOut);
      tbox.addEventListener("click", ev => { const t = ev.target.closest("tr[data-t]"); if (!t) return; sel = +t.dataset.t; render(); });

      function load() {
        stop();
        const p = PRE[key];
        E = p.ents.map(([n, x, y]) => ({ n, p: [x, y] })); R = p.rels.map(([n, x, y]) => ({ n, v: [x, y] }));
        TR = p.tr.map(t => t.slice()); sel = 0; negs = []; loss = null; steps = 0; Rg = rng(7);
        if (p.seed) randomize(p.seed);
        [qh, qr] = p.q;
        qH.innerHTML = E.map((e, i) => `<option value="${i}">${esc(e.n)}</option>`).join(""); qH.value = qh;
        qR.innerHTML = R.map((r, i) => `<option value="${i}">${esc(r.n)}</option>`).join(""); qR.value = qr;
        render();
      }
      function randomize(seed) {
        const G = rng(seed);
        E.forEach(e => { e.p = [round(0.3 + 5.4 * G(), 2), round(0.3 + 5.4 * G(), 2)]; });
        R.forEach(r => { r.v = [round(4 * G() - 2, 2), round(4 * G() - 2, 2)]; });
        negs = []; loss = null; steps = 0; Rg = rng(seed + 1);
      }
      const resid = ([hh, r, t]) => v2.sub(v2.add(E[hh].p, R[r].v), E[t].p);
      const dist3 = t => v2.norm(resid(t));
      const clamp = x => Math.max(-1, Math.min(7, x));
      function trainStep() {
        const pos = new Set(TR.map(t => t.join(","))), n = E.length;
        const pick = ex => { let j = Math.floor(Rg() * (n - 1)); if (j >= ex) j++; return j; };
        negs = []; let L = 0, mv = 0;
        const before = E.map(e => e.p.slice()).concat(R.map(r => r.v.slice()));
        TR.forEach(([hh, r, t]) => {
          let ng = null;
          for (let k = 0; k < 20 && !ng; k++) { const c = Rg() < 0.5 ? [hh, r, pick(t)] : [pick(hh), r, t]; if (!pos.has(c.join(","))) ng = c; }
          if (!ng) return;
          negs.push(ng);
          const dp = resid([hh, r, t]), dn = resid(ng), a = v2.norm(dp), b = v2.norm(dn), l = gamma + a - b;
          if (l <= 0) return;
          L += l;
          const up = a > 1e-9 ? [dp[0] / a, dp[1] / a] : [0, 0], un = b > 1e-9 ? [dn[0] / b, dn[1] / b] : [0, 0];
          for (let i = 0; i < 2; i++) {
            E[hh].p[i] -= lr * up[i]; R[r].v[i] -= lr * up[i]; E[t].p[i] += lr * up[i];
            E[ng[0]].p[i] += lr * un[i]; R[r].v[i] += lr * un[i]; E[ng[2]].p[i] -= lr * un[i];
          }
        });
        if (l2) R.forEach(r => { r.v = r.v.map(x => x * (1 - 0.1 * lr)); });
        E.forEach(e => { e.p = e.p.map(clamp); });
        E.map(e => e.p).concat(R.map(r => r.v)).forEach((p, i) => { mv = Math.max(mv, Math.abs(p[0] - before[i][0]), Math.abs(p[1] - before[i][1])); });
        lastMove = mv; loss = L / TR.length; steps++;
      }
      const isVis = watchVisible(root, v => { if (!v && running) { cancelAnimationFrame(raf); raf = 0; } else if (v && running && !raf) raf = requestAnimationFrame(frame); });
      function frame() {
        raf = 0;
        if (!running) return;
        for (let k = 0; k < 3; k++) trainStep();
        render();
        if (steps >= stopAt || (loss === 0 && lastMove < 2e-4)) { stop(); return; }
        if (isVis()) raf = requestAnimationFrame(frame);
      }
      function start() { running = true; stopAt = steps + 2500; bTrain.textContent = "⏸ Állj"; if (!raf) raf = requestAnimationFrame(frame); }
      function stop() { running = false; bTrain.textContent = "▶ Tanítás"; if (raf) cancelAnimationFrame(raf); raf = 0; render && E && render(); }

      dragSVG(svg, (k, x, y) => {
        const wx = Math.max(-1, Math.min(7, P.lo + (x - P.pad) / P.S)), wy = Math.max(-1, Math.min(7, P.lo + (P.size - P.pad - y) / P.S));
        const snap = v => Math.round(v * 4) / 4;
        if (k === "r") { const t = TR[sel]; R[t[1]].v = [snap(wx) - E[t[0]].p[0], snap(wy) - E[t[0]].p[1]].map(v => round(v, 2)); }
        else E[+k].p = [snap(wx), snap(wy)];
        render();
      });

      function render() {
        if (!E) return;
        const X = P.X, Y = P.Y;
        let s = `<rect x="0" y="0" width="${P.size}" height="${P.size}" style="fill:var(--card)"/>` + gridSVG(P);
        /* negatívak (szürkén) */
        negs.forEach(([hh, r, t]) => {
          const a = E[hh].p, b = v2.add(a, R[r].v), c = E[t].p;
          s += arrowSVG(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), "--muted", { w: 1.4, dash: "4 3", op: 0.55, hs: 6 });
          s += `<line x1="${X(b[0])}" y1="${Y(b[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(--muted);stroke-width:1.2;stroke-dasharray:1 3;opacity:.7"/>`;
        });
        /* pozitív hármasok */
        TR.forEach((t, i) => {
          if (i !== sel && !showAll) return;
          const a = E[t[0]].p, b = v2.add(a, R[t[1]].v), c = E[t[2]].p, on = i === sel;
          s += `<line x1="${X(b[0])}" y1="${Y(b[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(--setC);stroke-width:${on ? 2 : 1.3};stroke-dasharray:2 3"/>`;
          s += arrowSVG(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), "--setB", { w: on ? 2.8 : 1.6, dash: on ? "" : "6 4", op: on ? 1 : 0.75 });
        });
        const pts = E.map((e, i) => ({ x: X(e.p[0]), y: Y(e.p[1]), label: e.n, i }));
        const st = TR[sel], inv = new Set([st[0], st[2]]);
        pts.forEach(p => {
          s += `<circle cx="${p.x}" cy="${p.y}" r="${inv.has(p.i) ? 7 : 6}" style="fill:var(--setA);stroke:${inv.has(p.i) ? "var(--text)" : "var(--card)"};stroke-width:${inv.has(p.i) ? 2 : 1.3}"/>`;
          s += `<circle data-drag="${p.i}" cx="${p.x}" cy="${p.y}" r="14" style="fill:transparent;cursor:grab"/>`;
        });
        s += pointLabels(pts, P.size);
        /* fogantyú */
        const tip = v2.add(E[st[0]].p, R[st[1]].v), tx = X(tip[0]), ty = Y(tip[1]);
        s += `<path d="M${tx} ${ty - 7}L${tx + 7} ${ty}L${tx} ${ty + 7}L${tx - 7} ${ty}Z" style="fill:var(--setB);stroke:var(--text);stroke-width:1.3"/>`;
        s += `<circle data-drag="r" cx="${tx}" cy="${ty}" r="15" style="fill:transparent;cursor:grab"/>`;
        s += labelSVG(tx + 9, ty + 15, "h + r", { fs: 10, col: "--muted" });
        svg.innerHTML = s;
        /* hármasok */
        const rows = TR.map((t, i) => ({ attr: `data-t="${i}"`, st: "cursor:pointer" + (i === sel ? ";background:color-mix(in srgb, var(--accent) 16%, transparent);font-weight:600" : ""),
          c: [`(${esc(E[t[0]].n)}, ${esc(R[t[1]].n)}, ${esc(E[t[2]].n)})`, fm(-dist3(t))] }));
        tbox.innerHTML = `<b>Pozitív hármasok</b> (kattints egy sorra: az ő nyila húzható)<div class="tw">${tblHTML(["hármas", "pontszám"], rows)}</div>` +
          (negs.length ? `<span class="muted">Negatívak az utolsó lépésben: ${negs.map(t => `(${esc(E[t[0]].n)}, ${esc(R[t[1]].n)}, ${esc(E[t[2]].n)}) ${fm(-dist3(t))}`).join("; ")}</span>` : "");
        /* lekérdezés */
        const truth = new Set(TR.filter(t => t[0] === qh && t[1] === qr).map(t => t[2]));
        const rank = E.map((e, i) => ({ i, d: dist3([qh, qr, i]) })).filter(o => o.i !== qh).sort((a, b) => a.d - b.d || a.i - b.i);
        const qrows = rank.map((o, k) => ({ st: truth.has(o.i) ? "background:color-mix(in srgb, var(--setC) 20%, transparent);font-weight:600" : "",
          c: [k + 1 + ".", esc(E[o.i].n) + (truth.has(o.i) ? " ✓" : ""), fm(o.d)] }));
        const tr0 = rank.findIndex(o => truth.has(o.i));
        qOut.innerHTML = `<div class="tw">${tblHTML(["hely", "farok", "távolság"], qrows)}</div>` +
          (truth.size ? `A valódi farok (✓) helyezése: <b>${tr0 + 1}.</b>` : `<span class="muted">Ehhez a fej–reláció párhoz nincs ismert farok.</span>`) +
          ` <span class="muted">(a fejet magát kihagyjuk)</span>`;
        /* kiírás */
        let x = `Lépések: <b>${steps}</b> · átlagos veszteség (az utolsó lépés negatívjain): <b>${loss == null ? "–" : fm(loss, 3)}</b>`;
        x += ` · $\\max(0,\\ \\gamma + d^+ - d^-)$, $\\gamma = ${fmt(gamma).replace(",", "{,}")}$`;
        let extra = {};
        if (key === "one") { const d = v2.norm(v2.sub(E[1].p, E[2].p)); extra.bpdb = round(d); x += `<br>Budapest és Debrecen távolsága: <b>${fm(d)}</b> – mindkettőnek közel kell lennie a $\\mathbf h + \\mathbf r$ ponthoz, ezért egymáshoz is.`; }
        if (key === "sym") { const d = v2.norm(v2.sub(E[0].p, E[1].p)), r = v2.norm(R[0].v); extra.ab = round(d); extra.r = round(r);
          x += `<br>Anna és Béla távolsága: <b>${fm(d)}</b>, $\\lVert\\mathbf r\\rVert = $ <b>${fm(r)}</b>. Mindkét irány csak $\\mathbf r = 0$ és Anna = Béla mellett lehet tökéletes.`; }
        if (key === "cap") { const r = R[0].v; x += `<br>$\\mathbf r_{\\text{fővárosa}} = (${fmM(r[0])};\\ ${fmM(r[1])})$`; }
        info.innerHTML = x;
        if (!running) math(info);
        else if (steps % 30 < 3) math(info);
        root.dataset.te = JSON.stringify({ key, steps, loss: loss == null ? null : round(loss), E: E.map(e => [e.n, round(e.p[0]), round(e.p[1])]), R: R.map(r => [r.n, round(r.v[0]), round(r.v[1])]),
          scores: TR.map(t => round(-dist3(t))), q: [E[qh].n, R[qr].n], rank: rank.map(o => [E[o.i].n, round(o.d)]), truthRank: tr0 + 1, negs: negs.length, ...extra });
      }
      const fmM = (x, d = 2) => fm(x, d).replace(",", "{,}");
      load();
    };

    /* ------------------------------------------------------------------
       12.4  kg-patterns – TransE / DistMult / RotatE relációmintákon
       ------------------------------------------------------------------ */
    W["kg-patterns"] = root => {
      header(root, "Relációminták: TransE, DistMult, RotatE",
        "Ugyanaz a mintázat, három modell. TransE: $\\mathbf h + \\mathbf r \\approx \\mathbf t$ (a síkon). " +
        "DistMult: pontszám $\\sum_i h_i r_i t_i$ (nagyobb = igazabb). RotatE: az entitás egy pont az egységkörön, a reláció egy $\\varphi$ szögű forgatás, " +
        "$d = \\lvert \\mathbf h \\circ \\mathbf r - \\mathbf t\\rvert$. Húzd a pontokat, állítsd a csúszkákat – és nézd, melyik modell tudja kifejezni a mintát.");
      math(root.querySelector(".w-sub"));
      /* sorok: [fej, reláció, farok, igaz?] (entitás- és relációindexek) */
      const PAT = {
        sym: { lab: "szimmetrikus", desc: "<b>házastársa</b>: ha (Anna, házastársa, Béla) igaz, akkor (Béla, házastársa, Anna) is.",
          ents: ["Anna", "Béla"], rels: ["házastársa"], rows: [[0, 0, 1, 1], [1, 0, 0, 1]],
          T: { e: [[1, 1], [4, 3]], r: [[3, 2]] }, Dm: { e: [[1, 2], [2, 1]], r: [[1, 1]] }, Ro: { e: [0, 180], r: [90] },
          v: { T: [NO, "Csak $\\mathbf r = 0$-val: akkor viszont Anna = Béla, a két pont összeesik."],
            Dm: [OK, "A képlet szimmetrikus $h$-ban és $t$-ben: a két irány pontszáma mindig egyenlő."],
            Ro: [OK, "A $180°$-os forgatás kétszer alkalmazva visszaforgat: $\\varphi = 180°$."] } },
        anti: { lab: "antiszimmetrikus", desc: "<b>bírálja</b>: (Szakértő, bírálja, Kormány) igaz, a fordítottja nem.",
          ents: ["Sz", "Ko"], rels: ["bírálja"], rows: [[0, 0, 1, 1], [1, 0, 0, 0]],
          T: { e: [[1, 2], [4, 3]], r: [[3, 1]] }, Dm: { e: [[1, 2], [2, 1]], r: [[1, 1]] }, Ro: { e: [0, 90], r: [90] },
          v: { T: [OK, "Ha $\\mathbf h + \\mathbf r = \\mathbf t$, akkor $\\mathbf t + \\mathbf r = \\mathbf h + 2\\mathbf r \\ne \\mathbf h$ (ha $\\mathbf r \\ne 0$)."],
            Dm: [NO, "A két irány pontszáma mindig egyenlő – a modell nem tudja, ki bírál kit."],
            Ro: [OK, "$\\varphi = 90°$-nál a visszafelé forgatás nem talál: a forgatás iránya számít."] } },
        inv: { lab: "inverz", desc: "<b>szülője ↔ gyermeke</b>: (Pisti, szülője, Anna) pontosan akkor, ha (Anna, gyermeke, Pisti).",
          ents: ["Pisti", "Anna"], rels: ["szülője", "gyermeke"], rows: [[0, 0, 1, 1], [1, 1, 0, 1], [1, 0, 0, 0]],
          T: { e: [[1, 1], [4, 3]], r: [[3, 2], [-3, -2]] }, Dm: { e: [[1, 2], [2, 1]], r: [[1, 1], [1, 1]] }, Ro: { e: [0, 90], r: [90, -90] },
          v: { T: [OK, "$\\mathbf r_{\\text{gyermeke}} = -\\mathbf r_{\\text{szülője}}$: visszatolás."],
            Dm: [NO, "Csak ha a reláció szimmetrikus: (Anna, szülője, Pisti) ugyanazt a pontszámot kapja, mint (Pisti, szülője, Anna)."],
            Ro: [OK, "$\\varphi_{\\text{gyermeke}} = -\\varphi_{\\text{szülője}}$: visszaforgat."] } },
        comp: { lab: "összetett", desc: "<b>anyja ∘ férje = apja</b>: Pisti anyja Anna, Anna férje Béla ⇒ Pisti apja Béla.",
          ents: ["Pisti", "Anna", "Béla"], rels: ["anyja", "férje", "apja"], rows: [[0, 0, 1, 1], [1, 1, 2, 1], [0, 2, 2, 1], [1, 0, 0, 0]],
          T: { e: [[1, 1], [3, 4], [6, 3]], r: [[2, 3], [3, -1], [5, 2]] }, Dm: { e: [[1, 2], [2, 1], [1, 1]], r: [[1, 1], [1, 1], [1, 1]] },
          Ro: { e: [0, 90, 210], r: [90, 120, 210] },
          v: { T: [OK, "$\\mathbf r_{\\text{apja}} = \\mathbf r_{\\text{anyja}} + \\mathbf r_{\\text{férje}}$: két eltolás egymás után."],
            Dm: [NO, "Minden relációja szimmetrikus, és a szorzat nem „láncol”: az irányt és a közbülső entitást nem tudja összefűzni."],
            Ro: [OK, "$\\varphi_{\\text{apja}} = \\varphi_{\\text{anyja}} + \\varphi_{\\text{férje}}$: két forgatás egymás után."] } },
        oneN: { lab: "1–N", desc: "<b>városa</b>: (Magyarország, városa, Budapest) és (Magyarország, városa, Debrecen) is igaz.",
          ents: ["Mo", "Bp", "Db"], rels: ["városa"], rows: [[0, 0, 1, 1], [0, 0, 2, 1], [1, 0, 0, 0]],
          T: { e: [[1, 3], [4, 4], [4, 2]], r: [[3, 0]] }, Dm: { e: [[2, 2], [2, 1], [1, 2]], r: [[1, 1]] }, Ro: { e: [0, 90, 135], r: [90] },
          v: { T: [NO, "$\\mathbf h + \\mathbf r$ egyetlen pont: a két farok csak úgy lehet tökéletes, ha összeesik."],
            Dm: ["részben", "A farkaknak nem kell egybeesniük, elég, ha a pontszámuk ugyanakkora (Mo = (2, 2) mellett Bp = (2, 1) és Db = (1, 2) is 6-ot kap) – kicsit jobban bírja."],
            Ro: [NO, "$\\mathbf h \\circ \\mathbf r$ egyetlen pont a körön: a farkakat ugyanúgy összenyomja."] } }
      };
      let key = "anti", st;
      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, Object.entries(PAT).map(([k, p]) => [k, p.lab]), key, v => { key = v; load(); });
      const desc = h("p", { style: "margin:.3rem 0" });
      root.append(c1, desc);
      const panels = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15.5rem),1fr));gap:.8rem;align-items:start" });
      root.append(panels);
      const mk = title => {
        const p = h("div", { style: "border:1px solid var(--border);border-radius:8px;padding:.5rem;background:var(--card);min-width:0" });
        const fig = h("div"), ctl = h("div", { style: "font-size:.85rem" }), tab = h("div", { class: "tw" }), live = h("div", { style: "font-size:.85rem;margin:.2rem 0" }),
          ver = h("div", { style: "font-size:.88rem;margin-top:.35rem;padding-top:.35rem;border-top:1px solid var(--border)" });
        p.append(h("div", { style: "font-weight:700;margin-bottom:.2rem" }, title), fig, ctl, tab, live, ver); panels.append(p);
        return { p, fig, ctl, tab, live, ver };
      };
      const pT = mk("TransE"), pD = mk("DistMult"), pR = mk("RotatE");
      root.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.4rem 0 0" },
        "A ✓ / ✗ a szakirodalmi összevetést követi: ki tudja-e fejezni a modell ezt a mintát pontosan (minden igaz hármasnak tökéletes, a hamisnak rossz pontszámmal)."));
      /* TransE-sík */
      const PT = plane(-1, 7, 260, 20), svgT = svgEl(PT.size, PT.size, "TransE"); pT.fig.append(svgT);
      dragSVG(svgT, (k, x, y) => {
        const wx = Math.round(4 * Math.max(-1, Math.min(7, PT.lo + (x - PT.pad) / PT.S))) / 4, wy = Math.round(4 * Math.max(-1, Math.min(7, PT.lo + (PT.size - PT.pad - y) / PT.S))) / 4;
        if (k[0] === "r") { const ri = +k.slice(1), row = PAT[key].rows.find(r => r[1] === ri); st.T.r[ri] = [wx - st.T.e[row[0]][0], wy - st.T.e[row[0]][1]]; }
        else st.T.e[+k] = [wx, wy];
        render();
      });
      /* RotatE-kör */
      const RS = 230, RC = RS / 2, RR = 82, svgR = svgEl(RS, RS, "RotatE"); pR.fig.append(svgR);
      const ang = a => [RC + RR * Math.cos(a * Math.PI / 180), RC - RR * Math.sin(a * Math.PI / 180)];
      dragSVG(svgR, (k, x, y) => {
        let a = Math.atan2(RC - y, x - RC) * 180 / Math.PI; a = Math.round(a / 15) * 15; if (a < 0) a += 360; if (a >= 360) a -= 360;
        st.Ro.e[+k] = a; render();
      });
      const nrm = a => { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; };
      const rotD = (h_, r, t) => 2 * Math.abs(Math.sin((h_ + r - t) * Math.PI / 360));
      const dm = (a, r, b) => a[0] * r[0] * b[0] + a[1] * r[1] * b[1];
      const clone = o => JSON.parse(JSON.stringify(o));

      function load() {
        const p = PAT[key];
        st = { T: clone(p.T), Dm: clone(p.Dm), Ro: clone(p.Ro) };
        desc.innerHTML = p.desc;
        /* DistMult-csúszkák: az entitások és az első reláció */
        pD.ctl.innerHTML = "";
        const vecs = p.ents.map((n, i) => [n, "e", i]).concat(p.rels.map((n, i) => [n, "r", i]));
        vecs.forEach(([n, tp, i]) => {
          const row = h("div", { style: "display:grid;grid-template-columns:minmax(3.2em,auto) 2.3em minmax(0,1fr) 2.3em minmax(0,1fr);align-items:center;gap:.2rem;margin:.05rem 0" });
          row.append(h("span", { style: "font-weight:600;white-space:nowrap" }, (tp === "r" ? "r " : "") + n));
          [0, 1].forEach(j => {
            const lab = h("b", { style: "font-family:var(--mono);text-align:right" });
            const arr = () => (tp === "e" ? st.Dm.e : st.Dm.r)[i];
            const sl = range(-2, 2, 0.5, arr()[j], `${n} ${j + 1}. koordináta`, () => { arr()[j] = +sl.value; render(); }, "100%");
            sl.style.maxWidth = "100%"; sl.style.minWidth = "0";
            sl.dataset.v = `${tp}${i}-${j}`;
            row.append(lab, sl); lab.dataset.v = `${tp}${i}-${j}`;
          });
          pD.ctl.append(row);
        });
        /* RotatE-csúszkák a relációkra */
        pR.ctl.innerHTML = "";
        p.rels.forEach((n, i) => {
          const lab = h("b", { style: "font-family:var(--mono);text-align:right" });
          const sl = range(-180, 180, 15, st.Ro.r[i], `${n} szöge`, () => { st.Ro.r[i] = +sl.value; render(); }, "100%");
          sl.style.maxWidth = "100%"; sl.style.minWidth = "0";
          lab.dataset.v = "phi" + i;
          pR.ctl.append(h("div", { style: "display:grid;grid-template-columns:auto 3.2em minmax(0,1fr);align-items:center;gap:.3rem" }, h("span", { style: "white-space:nowrap" }, `φ ${n}`), lab, sl));
        });
        ["T", "Dm", "Ro"].forEach((m, k) => { const [ok, why] = p.v[m], P_ = [pT, pD, pR][k];
          P_.ver.innerHTML = `<b style="font-size:1.05rem">${ok === OK ? "✓ igen" : ok === NO ? "✗ nem" : "◐ részben"}</b> – ${why}`; math(P_.ver); });
        render();
      }
      const trip = (p, r) => `(${p.ents[r[0]]}, ${p.rels[r[1]]}, ${p.ents[r[2]]})`;
      const rowTbl = (p, sc, best) => tblHTML(["hármas", "", best],
        p.rows.map((r, i) => ({ st: r[3] ? "" : "color:var(--muted)", c: [trip(p, r), r[3] ? "igaz" : "hamis", sc[i]] })));
      function render() {
        const p = PAT[key];
        /* --- TransE --- */
        const X = PT.X, Y = PT.Y;
        let s = `<rect width="${PT.size}" height="${PT.size}" style="fill:var(--card)"/>` + gridSVG(PT);
        const tE = st.T.e, tR = st.T.r, seenR = new Set();
        p.rows.forEach(r => {
          const a = tE[r[0]], b = v2.add(a, tR[r[1]]), c = tE[r[2]];
          s += `<line x1="${X(b[0])}" y1="${Y(b[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(${r[3] ? "--setC" : "--muted"});stroke-width:1.5;stroke-dasharray:2 3"/>`;
          s += arrowSVG(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), r[3] ? "--setB" : "--muted", { w: r[3] ? 2.4 : 1.4, dash: r[3] ? "" : "5 3", op: r[3] ? 1 : 0.7, hs: 7 });
        });
        const pts = tE.map((e, i) => ({ x: X(e[0]), y: Y(e[1]), label: p.ents[i], i }));
        pts.forEach(q => { s += `<circle cx="${q.x}" cy="${q.y}" r="5.5" style="fill:var(--setA);stroke:var(--card);stroke-width:1.2"/><circle data-drag="${q.i}" cx="${q.x}" cy="${q.y}" r="13" style="fill:transparent;cursor:grab"/>`; });
        p.rows.forEach(r => {
          if (!r[3] || seenR.has(r[1])) return; seenR.add(r[1]);
          const b = v2.add(tE[r[0]], tR[r[1]]), bx = X(b[0]), by = Y(b[1]);
          s += `<path d="M${bx} ${by - 6}L${bx + 6} ${by}L${bx} ${by + 6}L${bx - 6} ${by}Z" style="fill:var(--setB);stroke:var(--text);stroke-width:1.1"/><circle data-drag="r${r[1]}" cx="${bx}" cy="${by}" r="13" style="fill:transparent;cursor:grab"/>`;
          s += labelSVG(bx + 8, by + 13, p.rels[r[1]], { fs: 9.5, col: "--muted" });
        });
        s += pointLabels(pts, PT.size, 10.5);
        svgT.innerHTML = s;
        const tSc = p.rows.map(r => -v2.norm(v2.sub(v2.add(tE[r[0]], tR[r[1]]), tE[r[2]])));
        pT.tab.innerHTML = rowTbl(p, tSc.map(x => fm(x)), "$-\\lVert\\mathbf h+\\mathbf r-\\mathbf t\\rVert$");
        let lt = p.rels.map((n, i) => `$\\mathbf r_{\\text{${n}}} = (${fmM(tR[i][0])};\\ ${fmM(tR[i][1])})$`).join(", ");
        if (key === "inv") lt += `; $\\mathbf r_1 + \\mathbf r_2 = (${fmM(tR[0][0] + tR[1][0])};\\ ${fmM(tR[0][1] + tR[1][1])})$`;
        if (key === "comp") lt += `; $\\mathbf r_{\\text{anyja}} + \\mathbf r_{\\text{férje}} - \\mathbf r_{\\text{apja}} = (${fmM(tR[0][0] + tR[1][0] - tR[2][0])};\\ ${fmM(tR[0][1] + tR[1][1] - tR[2][1])})$`;
        if (key === "oneN") lt += `; Bp–Db távolság: ${fm(v2.norm(v2.sub(tE[1], tE[2])))}`;
        pT.live.innerHTML = lt;
        /* --- DistMult --- */
        const dE = st.Dm.e, dR = st.Dm.r;
        pD.ctl.querySelectorAll("b[data-v]").forEach(b => { const [tp, j] = b.dataset.v.split("-"), arr = tp[0] === "e" ? dE : dR; b.textContent = fm(arr[+tp.slice(1)][+j], 1); });
        const dSc = p.rows.map(r => dm(dE[r[0]], dR[r[1]], dE[r[2]]));
        pD.tab.innerHTML = rowTbl(p, dSc.map(x => fm(x)), "$\\sum_i h_i r_i t_i$");
        const r0 = p.rows[0], f = dm(dE[r0[0]], dR[r0[1]], dE[r0[2]]), b = dm(dE[r0[2]], dR[r0[1]], dE[r0[0]]);
        const vec = (n, v) => `${n} = (${fm(v[0], 1)}; ${fm(v[1], 1)})`;
        pD.fig.innerHTML = `<div style="font-family:var(--mono);font-size:.82rem;margin:.2rem 0">${p.ents.map((n, i) => vec(n, dE[i])).join(" · ")}<br>${p.rels.map((n, i) => vec("r " + n, dR[i])).join(" · ")}</div>`;
        pD.live.innerHTML = `${trip(p, r0)}: <b>${fm(f)}</b>, megfordítva ${trip(p, [r0[2], r0[1], r0[0]])}: <b>${fm(b)}</b> – ` +
          (Math.abs(f - b) < 1e-9 ? "<b>mindig egyenlő</b> (bármit állítasz)." : "eltér?!");
        /* --- RotatE --- */
        const oE = st.Ro.e, oR = st.Ro.r;
        pR.ctl.querySelectorAll("b[data-v]").forEach(bb => { bb.textContent = oR[+bb.dataset.v.slice(3)] + "°"; });
        let r_ = `<rect width="${RS}" height="${RS}" style="fill:var(--card)"/>`;
        r_ += `<line x1="${RC - RR - 14}" y1="${RC}" x2="${RC + RR + 14}" y2="${RC}" style="stroke:var(--border)"/><line x1="${RC}" y1="${RC - RR - 14}" x2="${RC}" y2="${RC + RR + 14}" style="stroke:var(--border)"/>`;
        r_ += `<circle cx="${RC}" cy="${RC}" r="${RR}" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>`;
        r_ += `<text x="${RC + RR + 14}" y="${RC + 12}" style="fill:var(--muted);font-size:9px" text-anchor="end">Re</text><text x="${RC - 4}" y="${RC - RR - 6}" style="fill:var(--muted);font-size:9px" text-anchor="end">Im</text>`;
        const arc = (a1, a2, col, rad, dash, op) => {
          const d = a2 - a1; if (Math.abs(d) < 1) return "";
          const [x1, y1] = [RC + rad * Math.cos(a1 * Math.PI / 180), RC - rad * Math.sin(a1 * Math.PI / 180)], [x2, y2] = [RC + rad * Math.cos(a2 * Math.PI / 180), RC - rad * Math.sin(a2 * Math.PI / 180)];
          const large = Math.abs(d) > 180 ? 1 : 0, sweep = d > 0 ? 0 : 1;
          const tA = (a2 - Math.sign(d) * 10) * Math.PI / 180, hx = RC + rad * Math.cos(tA), hy = RC - rad * Math.sin(tA);
          const ux = x2 - hx, uy = y2 - hy, L = Math.hypot(ux, uy) || 1;
          return `<g style="opacity:${op}"><path d="M${x1} ${y1}A${rad} ${rad} 0 ${large} ${sweep} ${x2} ${y2}" style="fill:none;stroke:${sv(col)};stroke-width:2.2${dash ? ";stroke-dasharray:" + dash : ""}"/>` +
            `<path d="M${x2} ${y2}L${x2 - ux / L * 7 - uy / L * 3.5} ${y2 - uy / L * 7 + ux / L * 3.5}L${x2 - ux / L * 7 + uy / L * 3.5} ${y2 - uy / L * 7 - ux / L * 3.5}Z" style="fill:${sv(col)}"/></g>`;
        };
        p.rows.forEach((r, i) => {
          const a = oE[r[0]], phi = oR[r[1]], [hx, hy] = ang(a + phi);
          r_ += arc(a, a + phi, r[3] ? "--setB" : "--muted", RR - 12 - 9 * i, r[3] ? "" : "4 3", r[3] ? 0.95 : 0.7);
          r_ += `<circle cx="${hx}" cy="${hy}" r="5" style="fill:none;stroke:${r[3] ? "var(--setB)" : "var(--muted)"};stroke-width:2"/>`;
        });
        const rp = oE.map((a, i) => { const [x, y] = ang(a); return { x, y, label: p.ents[i], i }; });
        rp.forEach(q => { r_ += `<circle cx="${q.x}" cy="${q.y}" r="5.5" style="fill:var(--setA);stroke:var(--card);stroke-width:1.2"/><circle data-drag="${q.i}" cx="${q.x}" cy="${q.y}" r="13" style="fill:transparent;cursor:grab"/>`; });
        r_ += pointLabels(rp, RS, 10.5);
        svgR.innerHTML = r_;
        const oSc = p.rows.map(r => -rotD(oE[r[0]], oR[r[1]], oE[r[2]]));
        pR.tab.innerHTML = rowTbl(p, oSc.map(x => fm(x)), "$-\\lvert\\mathbf h\\circ\\mathbf r-\\mathbf t\\rvert$");
        let lr_ = p.ents.map((n, i) => `${n}: ${oE[i]}°`).join(", ");
        if (key === "inv") lr_ += ` · φ₁ + φ₂ = ${nrm(oR[0] + oR[1])}°` + (nrm(oR[0] + oR[1]) === 0 ? " → visszaforgat" : "");
        if (key === "comp") lr_ += ` · φ(anyja) + φ(férje) = ${nrm(oR[0] + oR[1])}°, φ(apja) = ${nrm(oR[2])}°`;
        if (key === "sym") lr_ += ` · 2φ = ${nrm(2 * oR[0])}°` + (nrm(2 * oR[0]) === 0 ? " → a két irány ugyanaz" : "");
        pR.live.innerHTML = lr_ + `<br><span class="muted">○ = $\\mathbf h \\circ \\mathbf r$ (a forgatott fej); a pontok a körön húzhatók (15°-onként).</span>`;
        [pT.tab, pT.live, pD.tab, pR.tab, pR.live].forEach(e => math(e));
        root.dataset.kg = JSON.stringify({ key, T: tSc.map(x => round(x)), Dm: dSc.map(x => round(x)), Ro: oSc.map(x => round(x)) });
      }
      const fmM = (x, d = 2) => fm(x, d).replace(",", "{,}");
      load();
    };

    /* ------------------------------------------------------------------
       12.5  temporal-stream – az Árvízhét eseményfolyamként
       ------------------------------------------------------------------ */
    W["temporal-stream"] = root => {
      header(root, "Időbeli gráf: az Árvízhét eseményfolyamként",
        "Minden cikk minden említett szereplőpárja egy esemény $(u, v, t)$ a cikk napján. " +
        "A csúcsmemória minden nap végén: $s_v \\leftarrow \\lambda\\, s_v + k_v$, ahol $k_v$ a $v$-t érintő aznapi események száma. " +
        "A teszt napjain jósolunk: az <b>EdgeBank</b> 1-et ad, ha a pár valaha előfordult a nap előtt; a <b>memória-szorzat</b> $s_u \\cdot s_v$ (az előző nap végén).");
      math(root.querySelector(".w-sub"));
      const DAYS = D.days, NDAY = DAYS.length, IDS = ARV_IDS, n = IDS.length;
      const EV = [];
      D.articles.slice().sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.id - b.id).forEach(a => {
        const m = a.mentions.map(id => IDS.indexOf(id));
        for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) EV.push({ u: m[i], v: m[j], d: DAYS.indexOf(a.day), art: a.id });
      });
      const PAIRS = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) PAIRS.push([i, j]);
      let day = 3, cut = 2, lam = 0.5, mode = "stream", negMode = "easy", playing = false, timer = 0;
      const pn = (u, v) => `${IDS[u]}–${IDS[v]}`;

      /* vezérlők */
      const c1 = h("div", { class: "controls" });
      const bPlay = btn("▶ lejátszás", () => (playing ? pause() : play()));
      const bPrev = btn("◀ 1 nap vissza", () => { pause(); setDay(day - 1); }), bNext = btn("1 nap előre ▶", () => { pause(); setDay(day + 1); });
      const dLab = h("b", { style: "min-width:4.5em;display:inline-block" });
      const dR = range(0, NDAY - 1, 1, day, "nap", () => { pause(); setDay(+dR.value); }, "9rem");
      c1.append(bPlay, bPrev, bNext, dR, dLab);
      const c2 = h("div", { class: "controls" });
      toggleGroup(c2, [["snap", "pillanatfelvétel"], ["stream", "folyam"]], mode, v => { mode = v; render(); });
      const cutSel = h("select", { "aria-label": "vágás" }, ...DAYS.slice(0, -1).map((d, i) => h("option", { value: i }, `${d} után`)));
      cutSel.value = cut; cutSel.addEventListener("change", () => { cut = +cutSel.value; recompute(); });
      const lLab = h("b", { style: "font-family:var(--mono);min-width:2.4em;display:inline-block" }, "0,5");
      const lR = range(0, 1, 0.05, lam, "λ", () => { lam = +lR.value; lLab.textContent = fmt(lam); recompute(); });
      c2.append(h("label", null, "vágás: ", cutSel), h("label", null, "λ = ", lLab, " ", lR));
      root.append(c1, c2);
      const TW = root.clientWidth < 560 ? 380 : 720, tl = svgEl(TW, 120, "idővonal"); tl.style.touchAction = "manipulation"; tl.style.maxWidth = "100%";
      root.append(h("div", { style: "margin:.3rem 0" }, tl));
      tl.addEventListener("click", ev => { const t = ev.target.closest("[data-day]"); if (t) { pause(); setDay(+t.dataset.day); } });
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const gbox = h("div"), mbox = h("div");
      grid.append(gbox, mbox); root.append(grid);
      const gLeg = h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0" });
      const memSvg = svgEl(330, 7 * 30 + 26, "csúcsmemória"); memSvg.style.touchAction = "manipulation";
      mbox.append(h("div", { style: "font-weight:600;font-size:.92rem" }, "Csúcsmemória a nap végén"), memSvg);
      const memNote = h("p", { class: "muted", style: "font-size:.82rem;margin:.2rem 0 0" });
      mbox.append(memNote);
      const pred = h("div", { class: "readout" }), c3 = h("div", { class: "controls" }), aucBox = h("div", { class: "readout" });
      root.append(pred, c3, aucBox);
      c3.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "negatívák:"));
      toggleGroup(c3, [["easy", "könnyű: soha nem látott párok"], ["hist", "történeti: látott, de ma nem előforduló párok"], ["all", "minden ma nem előforduló pár"]], negMode, v => { negMode = v; renderAUC(); });
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Az EdgeBank semmit nem tanul, csak emlékszik. Könnyű negatívákkal mégis jónak látszik – történeti negatívákkal kiderül, hogy az új párokról semmit nem tud."));

      const ASP = 0.62, nodePos = GK.normalize(IDS.map(i => ACTOR_POS[i]), ASP);
      const view = new GK.View(gbox, { aspect: ASP, radius: root.clientWidth < 560 ? 14 : 16, showWeights: true, draggable: false,
        nodes: IDS.map((id, i) => ({ label: id, x: nodePos[i][0], y: nodePos[i][1] })), edges: [] });
      gbox.append(gLeg);

      let MEM, SEEN, RES;
      /* memória: MEM[d][v] a d. nap végén; SEEN[d]: a d. nap előtt látott párok */
      function recompute() {
        MEM = []; SEEN = []; let s = new Array(n).fill(0); const seen = new Set();
        for (let d = 0; d < NDAY; d++) {
          SEEN.push(new Set(seen));
          const cnt = new Array(n).fill(0);
          EV.filter(e => e.d === d).forEach(e => { cnt[e.u]++; cnt[e.v]++; seen.add(pairKey(e.u, e.v)); });
          s = s.map((x, v) => lam * x + cnt[v]); MEM.push(s.slice());
        }
        /* teszt: a vágás utáni napok */
        RES = { days: [], pos: [], neg: { easy: [], hist: [], all: [] } };
        for (let d = cut + 1; d < NDAY; d++) {
          const today = EV.filter(e => e.d === d), tk = new Set(today.map(e => pairKey(e.u, e.v))), prev = MEM[d - 1];
          const rows = today.map(e => ({ e, eb: SEEN[d].has(pairKey(e.u, e.v)) ? 1 : 0, mem: prev[e.u] * prev[e.v] }));
          rows.forEach(r => RES.pos.push(r));
          PAIRS.forEach(([u, v]) => {
            const k = pairKey(u, v); if (tk.has(k)) return;
            const o = { u, v, d, eb: SEEN[d].has(k) ? 1 : 0, mem: prev[u] * prev[v] };
            RES.neg[o.eb ? "hist" : "easy"].push(o); RES.neg.all.push(o);
          });
          RES.days.push({ d, rows });
        }
        render(); renderPred(); renderAUC();
      }
      function setDay(d) { day = Math.max(0, Math.min(NDAY - 1, d)); render(); renderPred(); }
      const isVis = watchVisible(root, v => { if (!v && playing) pause(); });
      function play() {
        if (day >= NDAY - 1) setDay(0);
        playing = true; bPlay.textContent = "⏸ megállítás";
        timer = setInterval(() => { if (!isVis() || day >= NDAY - 1) { pause(); return; } setDay(day + 1); if (day >= NDAY - 1) pause(); }, 1100);
      }
      function pause() { playing = false; bPlay.textContent = "▶ lejátszás"; clearInterval(timer); }

      function render() {
        if (!MEM) return;
        dR.value = day; dLab.textContent = D.dayNames[DAYS[day]];
        /* idővonal */
        const cw = TW / NDAY, dx = TW < 500 ? 11 : 17, dr = TW < 500 ? 8 : 9;
        let s = `<rect x="${(cut + 1) * cw}" y="0" width="${TW - (cut + 1) * cw}" height="120" style="fill:var(--setB);opacity:.13"/>`;
        s += `<line x1="${(cut + 1) * cw}" y1="2" x2="${(cut + 1) * cw}" y2="118" style="stroke:var(--setB);stroke-width:2;stroke-dasharray:5 3"/>`;
        s += `<text x="${(cut + 1) * cw - 6}" y="13" text-anchor="end" style="fill:var(--muted);font-size:11px">tanítás ◀</text><text x="${(cut + 1) * cw + 6}" y="13" style="fill:var(--muted);font-size:11px">▶ teszt</text>`;
        for (let d = 0; d < NDAY; d++) {
          const x0 = d * cw, on = d === day, evs = EV.filter(e => e.d === d);
          s += `<rect data-day="${d}" x="${x0 + 2}" y="18" width="${cw - 4}" height="100" rx="6" style="fill:${on ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent"};stroke:${on ? "var(--accent)" : "var(--border)"};stroke-width:${on ? 2 : 1};cursor:pointer"/>`;
          s += `<text x="${x0 + cw / 2}" y="112" text-anchor="middle" style="fill:var(--text);font-size:12px;font-weight:${on ? 700 : 500};pointer-events:none">${DAYS[d]}</text>`;
          evs.forEach((e, k) => {
            const col = k % 2, row = Math.floor(k / 2), cx = x0 + cw / 2 + (col ? dx : -dx) * (evs.length > 1 ? 1 : 0), cy = 34 + row * 22;
            s += `<g style="pointer-events:none"><circle cx="${cx}" cy="${cy}" r="${dr}" style="fill:${d <= day ? "var(--accent)" : "var(--card)"};stroke:var(--accent);stroke-width:1.5"><title>${pn(e.u, e.v)} (${e.art}. cikk)</title></circle>` +
              `<text x="${cx}" y="${cy + 3.5}" text-anchor="middle" style="fill:${d <= day ? "#fff" : "var(--text)"};font-size:9.5px;font-weight:700">${e.art}</text></g>`;
          });
        }
        tl.innerHTML = s;
        /* gráf */
        const today = EV.filter(e => e.d === day), last = new Map(), cntToday = new Map();
        EV.filter(e => e.d <= day).forEach(e => last.set(pairKey(e.u, e.v), e.d));
        today.forEach(e => { const k = pairKey(e.u, e.v); cntToday.set(k, (cntToday.get(k) || 0) + 1); });
        let edges = [];
        if (mode === "snap") edges = [...cntToday.keys()].map(k => { const [a, b] = k.split("-").map(Number); return { a, b, w: 1, color: "--accent", width: 3.5, label: today.filter(e => pairKey(e.u, e.v) === k).map(e => e.art).join(",") }; });
        else edges = [...last.entries()].map(([k, d]) => { const [a, b] = k.split("-").map(Number), on = d === day;
          return { a, b, w: 1, color: on ? "--accent" : "--muted", width: on ? 3.5 : 2, alpha: on ? 1 : Math.max(0.15, Math.pow(0.6, day - d)), label: DAYS[d] }; });
        view.setGraph(view.nodes, edges);
        view.hl = new Set(today.flatMap(e => [e.u, e.v])); view.draw();
        gLeg.innerHTML = mode === "snap"
          ? `${line2("--accent")}az aznapi események (a szám: a cikk) – minden más eltűnik`
          : `${line2("--accent")}aznapi esemény · ${line2("--muted")}korábbi pár (a felirat: a legutóbbi nap; minél régebbi, annál halványabb)`;
        /* memóriasávok */
        const mx = Math.max(1, ...MEM.flat()), BW = 190, inc = new Array(n).fill(0);
        today.forEach(e => { inc[e.u]++; inc[e.v]++; });
        let m = "";
        IDS.forEach((id, v) => {
          const y = 8 + v * 30, val = MEM[day][v], w = BW * val / mx;
          m += `<text x="34" y="${y + 15}" text-anchor="end" style="fill:var(--text);font-size:12px;font-weight:600">${id}</text>`;
          m += `<rect x="40" y="${y + 3}" width="${BW}" height="16" rx="3" style="fill:var(--border);opacity:.45"/>`;
          m += `<rect x="40" y="${y + 3}" width="${w}" height="16" rx="3" style="fill:${inc[v] ? "var(--accent)" : "var(--setA)"}"/>`;
          m += `<text x="${44 + BW}" y="${y + 15}" style="fill:var(--text);font-size:11.5px;font-family:var(--mono)">${fm(val, 4)}${inc[v] ? ` (+${inc[v]})` : ""}</text>`;
        });
        memSvg.innerHTML = m;
        memNote.innerHTML = `${D.dayNames[DAYS[day]]} végén. A (+k): aznapi események; előbb ×λ, aztán +k. A sáv hossza a hét legnagyobb értékéhez mérve.`;
        root.dataset.ts = JSON.stringify({ day: DAYS[day], mode, lam, cut: DAYS[cut], edges: edges.length,
          mem: Object.fromEntries(IDS.map((id, v) => [id, MEM.map(r => round(r[v], 6))])) });
      }
      function renderPred() {
        if (!RES) return;
        const tot = RES.pos.length, hit = RES.pos.filter(r => r.eb).length;
        let s = `<b>Jóslás a teszt napjain</b> (${DAYS[cut + 1]}–${DAYS[NDAY - 1]}): ✓, ha az EdgeBank 1-et adott (a pár előfordult a nap előtt).`;
        const rows = [];
        RES.days.forEach(({ d, rows: rr }) => rr.forEach((r, k) => rows.push({ st: d === day ? "background:color-mix(in srgb, var(--accent) 14%, transparent)" : "",
          c: [k === 0 ? `<b>${DAYS[d]}</b>` : "", pn(r.e.u, r.e.v), `${r.e.art}.`, r.eb ? "✓ 1" : "✗ 0", fm(r.mem, 3)] })));
        s += `<div class="tw">${tblHTML(["nap", "esemény", "cikk", "EdgeBank", "$s_u \\cdot s_v$"], rows)}</div>`;
        s += `EdgeBank-találat: <b>${hit} / ${tot}</b> (${RES.days.map(o => `${DAYS[o.d]} ${o.rows.filter(r => r.eb).length}/${o.rows.length}`).join(", ")}).`;
        pred.innerHTML = s; math(pred);
      }
      function renderAUC() {
        if (!RES) return;
        const res = {};
        ["easy", "hist", "all"].forEach(k => {
          const N = RES.neg[k];
          res[k] = { n: N.length, eb: aucPairs(RES.pos.map(r => r.eb), N.map(o => o.eb)), mem: aucPairs(RES.pos.map(r => r.mem), N.map(o => o.mem)) };
        });
        const r = res[negMode], f3 = x => (isFinite(x) ? fmt(x, 3) : "– (nincs negatív)");
        aucBox.innerHTML = `<b>AUC</b> (az összes teszt-pozitív × a választott negatívák, ${RES.pos.length} × ${r.n}; holtverseny ½):` +
          `<div class="tw">${tblHTML(["módszer", "AUC"], [["EdgeBank", `<b>${f3(r.eb)}</b>`], ["memória-szorzat $s_u \\cdot s_v$", `<b>${f3(r.mem)}</b>`]])}</div>` +
          `<span class="muted">Mind a három negatívkészlettel: ${[["easy", "könnyű"], ["hist", "történeti"], ["all", "minden"]].map(([k, l]) => `${l} (${res[k].n}): EdgeBank ${f3(res[k].eb)}, memória ${f3(res[k].mem)}`).join(" · ")}.</span>`;
        math(aucBox);
        root.dataset.auc = JSON.stringify({ negMode, lam, cut: DAYS[cut], P: RES.pos.length, hits: RES.pos.filter(x => x.eb).length,
          res: Object.fromEntries(Object.entries(res).map(([k, o]) => [k, { n: o.n, eb: round(o.eb), mem: round(o.mem) }])) });
      }
      recompute();
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
