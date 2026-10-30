/* =========================================================
   Gráfelmélet és hálózattudomány 5. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET),
   a karateklub: ../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js (KARATE13),
   a politikai blogok: polblogs-data.js (POLBLOGS)
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
    path4: { name: "4 csúcsú út", labels: ["1", "2", "3", "4"], edges: "1-2,2-3,3-4", pos: [[0, 0], [1, 0], [2, 0], [3, 0]] },
    barat: { name: "barátsággráf", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,B-C,C-D", pos: [[0, 0], [0, 1], [1, 0.5], [2.1, 0.5]] },
    paw: { name: "csillag + él", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,A-D,B-C", pos: [[1, 0.9], [0.2, 0], [1.8, 0], [1, 1.8]] },
    star: { name: "csillag", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,A-D", pos: [[1, 0.9], [0.2, 0], [1.8, 0], [1, 1.8]] },
    twoTri: { name: "két háromszög + híd", labels: ["1", "2", "3", "4", "5", "6"], edges: "1-2,1-3,2-3,3-4,4-5,4-6,5-6",
      pos: [[0, 0], [0, 1.2], [1, 0.6], [2.2, 0.6], [3.2, 0], [3.2, 1.2]] },
    path5: { name: "5 csúcsú út", labels: ["1", "2", "3", "4", "5"], edges: "1-2,2-3,3-4,4-5", pos: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
    bowtie: { name: "csokornyakkendő", labels: ["A", "B", "C", "D", "E"], edges: "A-B,A-C,B-C,C-D,C-E,D-E",
      pos: [[0, 0], [0, 1.2], [1, 0.6], [2, 0], [2, 1.2]] },
    c4: { name: "4 hosszú kör", labels: ["1", "2", "3", "4"], edges: "1-2,2-3,3-4,4-1", pos: [[0, 0], [1, 0], [1, 1], [0, 1]] },
    /* Krackhardt „sárkánya” (1990): a négy klasszikus centralitás négy különböző győztest ad */
    kite: { name: "sárkány", labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      edges: "A-B,A-C,A-D,A-F,B-D,B-E,B-G,C-D,C-F,D-E,D-F,D-G,E-G,F-G,F-H,G-H,H-I,I-J",
      pos: [[1, 0], [1, 2], [0, 0.4], [1.3, 1], [0, 1.6], [2.1, 0.4], [2.1, 1.6], [3, 1], [4, 1], [5, 1]] },
    /* irányított mintagráfok: élek „a>b” alakban */
    pr4: { name: "PageRank-minta", labels: ["A", "B", "C", "D"], edges: "A>B,A>C,B>C,C>A,D>C", directed: true,
      pos: [[0, 0], [2, 0], [1, 1.3], [2.4, 1.6]] },
    hits5: { name: "összesítők és tudósítók", labels: ["H1", "H2", "T1", "T2", "T3"], edges: "H1>T1,H1>T2,H1>T3,H2>T1,H2>T2,T3>T1", directed: true,
      pos: [[0, 0.3], [0, 1.5], [2, 0], [2, 1], [2, 2]] }
  };
  function preset(key, aspect = 0.5) {
    if (key === "arviz") {
      const ids = D.actors.map(a => a.id), P = GK.normalize(ids.map(i => ACTOR_POS[i]), aspect), w = {};
      D.articles.forEach(a => {
        const m = a.mentions;
        for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
          const x = ids.indexOf(m[i]), y = ids.indexOf(m[j]), k = Math.min(x, y) + "-" + Math.max(x, y);
          w[k] = (w[k] || 0) + 1;
        }
      });
      return { name: "Árvízhét", nodes: ids.map((id, k) => ({ label: id, x: P[k][0], y: P[k][1], sub: actorName(id) })),
        edges: Object.entries(w).map(([k, v]) => { const [a, b] = k.split("-").map(Number); return { a, b, w: v }; }), weighted: true };
    }
    if (key === "papers") {
      const ids = D.papers.map(p => p.id), art = id => D.articles.find(a => a.id === id).paper, w = {};
      D.citations.forEach(([x, y]) => { const a = art(x), b = art(y); if (a !== b) { const k = a + ">" + b; w[k] = (w[k] || 0) + 1; } });
      const P = GK.normalize([[0, 0], [1.4, 0], [1.4, 1.1], [0, 1.1]], aspect);
      return { name: "lapok hivatkozásai", directed: true, weighted: true,
        nodes: D.papers.map((p, i) => ({ label: p.id, x: P[i][0], y: P[i][1], color: p.color, sub: p.name })),
        edges: Object.entries(w).map(([k, v]) => { const [a, b] = k.split(">"); return { a: ids.indexOf(a), b: ids.indexOf(b), w: v }; }) };
    }
    if (key === "karate") {
      const K = window.KARATE13, P = GK.normalize(K.xy, aspect);
      return { name: "karateklub", club: K.club.slice(),
        nodes: P.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1] })), edges: K.edges.map(([a, b]) => ({ a, b, w: 1 })) };
    }
    if (key === "papersU") {                         // a lapok hivatkozásai súly nélkül (minden pár egy él)
      const G = preset("papers", aspect);
      G.weighted = false; G.edges.forEach(e => (e.w = 1));
      return G;
    }
    const S = PRESETS[key], P = GK.normalize(S.pos, aspect), sep = S.directed ? ">" : "-";
    return { name: S.name, directed: !!S.directed, nodes: S.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })),
      edges: S.edges.split(",").map(t => { const [a, b] = t.split(sep); return { a: S.labels.indexOf(a), b: S.labels.indexOf(b), w: 1 }; }) };
  }

  /* ---------- lineáris algebra kis gráfokra ---------- */
  /* szomszédsági mátrix (súlyozva, ha weighted; irányítva, ha directed) */
  function adjM(n, edges, { weighted = false, directed = false } = {}) {
    const A = Array.from({ length: n }, () => new Array(n).fill(0));
    edges.forEach(e => { const w = weighted ? e.w : 1; A[e.a][e.b] += w; if (!directed && e.a !== e.b) A[e.b][e.a] += w; });
    return A;
  }
  const rowSums = A => A.map(r => r.reduce((s, x) => s + x, 0));
  const matVec = (A, x) => A.map(r => r.reduce((s, a, j) => s + a * x[j], 0));
  const vecMat = (x, A) => A[0].map((_, j) => x.reduce((s, xi, i) => s + xi * A[i][j], 0));   // sorvektor · mátrix
  function lapM(A) { const d = rowSums(A); return A.map((r, i) => r.map((a, j) => (i === j ? d[i] : 0) - a)); }
  function transM(A) { const d = rowSums(A); return A.map((r, i) => r.map(a => (d[i] ? a / d[i] : 0))); }
  /* szimmetrikus mátrix sajátfelbontása (Jacobi-forgatások); növekvő sajátértékek, vecs[k] a k-adik sajátvektor */
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
  /* Fiedler-vektor (a Laplace-mátrix második legkisebb sajátértékéhez); az előjelet úgy rögzítjük, hogy az első nem nulla elem pozitív legyen */
  function fiedler(n, edges, weighted = false) {
    const E = eigSym(lapM(adjM(n, edges, { weighted })));
    const v = E.vecs[1] || new Array(n).fill(0), f = v.find(x => Math.abs(x) > 1e-9) || 1;
    return { lambda2: E.vals[1], vec: v.map(x => x * Math.sign(f)), vals: E.vals };
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
  /* sajátvektor-centralitás (irányítatlan): a legnagyobb sajátértékhez tartozó, pozitívra fordított, max = 1-re normált vektor */
  function eigenC(n, edges, weighted = false) {
    const E = eigSym(adjM(n, edges, { weighted })), v = E.vecs[n - 1] || [];
    const s = v.reduce((t, x) => t + x, 0) < 0 ? -1 : 1, m = Math.max(1e-12, ...v.map(x => Math.abs(x)));
    return { vec: v.map(x => Math.abs(x) < 1e-12 ? 0 : s * x / m), lambda: E.vals[n - 1] };
  }
  /* PageRank: p_i = (1 − α)/n + α Σ_{j→i} p_j / kimenő(j); a zsákutca (kifok 0) súlyát egyenletesen szétosztja.
     Irányítatlan gráfon minden él két irányú. steps: ha megadod, ennyi lépést tesz 1/n-ből, és a köztes állapotokat is visszaadja. */
  function pagerankC(n, edges, { directed = false, alpha = 0.85, weighted = false, steps = null, tol = 1e-12 } = {}) {
    const out = Array.from({ length: n }, () => []);
    edges.forEach(e => { if (e.a === e.b) return; const w = weighted ? e.w : 1; out[e.a].push([e.b, w]); if (!directed) out[e.b].push([e.a, w]); });
    const tot = out.map(l => l.reduce((t, [, w]) => t + w, 0));
    let p = new Array(n).fill(1 / n);
    const hist = [p.slice()], N = steps == null ? 1000 : steps;
    for (let it = 0; it < N; it++) {
      const q = new Array(n).fill((1 - alpha) / n);
      let dang = 0;
      for (let j = 0; j < n; j++) { if (!tot[j]) dang += p[j]; else out[j].forEach(([i, w]) => (q[i] += alpha * p[j] * w / tot[j])); }
      for (let i = 0; i < n; i++) q[i] += alpha * dang / n;
      const diff = q.reduce((t, x, i) => t + Math.abs(x - p[i]), 0);
      p = q; hist.push(p.slice());
      if (steps == null && diff < tol) break;
    }
    return steps == null ? p : { p, hist };
  }
  /* HITS: a = Aᵀh, h = Aa, mindkettő max = 1-re normálva; steps lépés (alapból konvergenciáig) */
  function hitsC(n, edges, { steps = null } = {}) {
    let h = new Array(n).fill(1), a = new Array(n).fill(0);
    const hist = [{ a: a.slice(), h: h.slice() }], N = steps == null ? 500 : steps;
    for (let it = 0; it < N; it++) {
      const a2 = new Array(n).fill(0), h2 = new Array(n).fill(0);
      edges.forEach(e => (a2[e.b] += h[e.a]));
      const ma = Math.max(1e-12, ...a2); a = a2.map(x => x / ma);
      edges.forEach(e => (h2[e.a] += a[e.b]));
      const mh = Math.max(1e-12, ...h2), hn = h2.map(x => x / mh);
      const diff = hn.reduce((t, x, i) => t + Math.abs(x - h[i]), 0);
      h = hn; hist.push({ a: a.slice(), h: h.slice() });
      if (steps == null && diff < 1e-12) break;
    }
    return { a, h, hist };
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
