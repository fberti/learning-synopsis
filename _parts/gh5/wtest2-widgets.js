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
  /* ==================================================================
     w2: 5.7, 5.5, 5.6 widgetjei (centrality-explorer, pagerank-surfer, hits-steps)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
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
    /* komponensek száma (irányítatlanul) */
    function compCount(n, edges) {
      const p = [...Array(n).keys()], f = x => (p[x] === x ? x : (p[x] = f(p[x])));
      edges.forEach(e => { p[f(e.a)] = f(e.b); });
      return new Set([...Array(n).keys()].map(f)).size;
    }
    /* átlagolt rangok (csökkenő sorrend; holtverseny: a helyek átlaga) */
    function avgRanks(v, eps = 1e-9) {
      const o = [...v.keys()].sort((i, j) => v[j] - v[i]), r = new Array(v.length);
      for (let k = 0; k < o.length;) {
        let l = k; while (l + 1 < o.length && Math.abs(v[o[l + 1]] - v[o[k]]) < eps) l++;
        for (let t = k; t <= l; t++) r[o[t]] = (k + l) / 2 + 1;
        k = l + 1;
      }
      return r;
    }
    function pearson(x, y) {
      const n = x.length, mx = x.reduce((s, t) => s + t, 0) / n, my = y.reduce((s, t) => s + t, 0) / n;
      let sxy = 0, sxx = 0, syy = 0;
      for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
      return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
    }
    const MINUS = "−";
    /* keskeny képernyőn sűrűbb táblázatcellák */
    const tight = el => { if (window.innerWidth < 560) el.querySelectorAll("td, th").forEach(c => (c.style.padding = ".3em .45em")); };
    const fmtS = (x, d = 2) => fmt(x, d).replace("-", MINUS);
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");               // KaTeX-be: tizedesvessző szóköz nélkül

    /* ------------------------------------------------------------------
       5.7  centrality-explorer – melyik centralitás kit tart fontosnak?
       ------------------------------------------------------------------ */
    W["centrality-explorer"] = root => {
      header(root, "Centralitás-labor: ki a legfontosabb?",
        "Válassz mértéket: a csúcs színe annál erősebb, minél nagyobb az értéke (a csúcs mellett 2 tizedesre). " +
        "Szerkeszd a gráfot: üres helyre kattintva új csúcs, két csúcsra kattintva él be/ki, élre kattintva törlés, húzással mozgatás. " +
        "A „Verseny” mód két mértéket állít egymás mellé.");
      const MEAS = [["deg", "fokszám"], ["clo", "közelségi"], ["harm", "harmonikus"], ["btw", "köztesség"], ["eig", "sajátvektor"], ["pr", "PageRank"]];
      const NAME = { deg: "fokszám", clo: "közelség", harm: "harmonikus", btw: "köztesség", eig: "sajátvektor", pr: "PageRank" };
      const FORM = {
        deg: "fokszám-centralitás: $C_D(v) = \\dfrac{d(v)}{n-1}$",
        clo: "közelségi centralitás: $C_C(v) = \\dfrac{n-1}{\\sum_u d(v,u)}$",
        harm: "harmonikus centralitás: $C_H(v) = \\dfrac{1}{n-1}\\sum_{u\\ne v} \\dfrac{1}{d(v,u)}$",
        btw: "köztesség (normalizált): $C_B(v) = \\dfrac{1}{\\binom{n-1}{2}}\\sum_{s\\lt t} \\dfrac{\\sigma_{st}(v)}{\\sigma_{st}}$",
        eig: "sajátvektor-centralitás: $A\\mathbf x = \\lambda_1\\mathbf x$, a legnagyobb érték 1",
        pr: "PageRank ($\\alpha = 0{,}85$): $p_i = \\dfrac{1-\\alpha}{n} + \\alpha\\sum_{j\\to i} \\dfrac{p_j}{d_j}$"
      };
      const wide = root.clientWidth >= 720, narrow = root.clientWidth < 560, aspect0 = narrow ? 0.62 : 0.55, aspect = wide ? 0.78 : aspect0;
      let view = null;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" }), ctr3 = h("div", { class: "controls" });
      root.append(ctr, ctr2, ctr3);
      let key = "kite", m1 = "deg", m2 = "btw", race = false, n = 0, V = {};
      const grid = h("div");
      /* széles képernyőn a táblázat a gráf mellett; Verseny módban (széles táblázat) alatta */
      function setGrid() {
        const two = wide && !race;
        grid.style.cssText = two ? "display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:1rem;align-items:start" : "";
        const na = two ? 0.78 : aspect0;
        if (view && view.o.aspect !== na) {                  // az elrendezés arányait megtartjuk
          const old = view.o.aspect;
          if (view.nodes.length > 1) GK.normalize(view.nodes.map(nd => [nd.x, nd.y * old]), na).forEach((q, i) => { view.nodes[i].x = q[0]; view.nodes[i].y = q[1]; });
          view.o.aspect = na;
        }
        if (view) view.resize();
      }
      const box = h("div"), side = h("div");
      grid.append(box, side);
      const winners = h("div", { class: "readout" }), info = h("div", { class: "readout" });
      root.append(grid, winners, info);
      view = new GK.View(box, { aspect, editable: true, maxNodes: 14, radius: narrow ? 15 : 16, nodes: [], edges: [],
        onChange: () => compute(), onMove: () => {} });

      setGrid();
      toggleGroup(ctr, [["kite", "sárkány"], ["arviz", "Árvízhét"], ["bowtie", "csokornyakkendő"], ["path5", "5 csúcsú út"], ["karate", "karateklub"], ["empty", "üres"]], key, v => { key = v; load(); });
      ctr2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "mérték:"));
      toggleGroup(ctr2, MEAS, m1, v => { m1 = v; paint(); });
      const rc = checkbox("Verseny: összevetés ezzel →", v => { race = v; ctr3b.style.display = v ? "" : "none"; setGrid(); paint(); });
      const ctr3b = h("span", { style: "display:none" });
      toggleGroup(ctr3b, MEAS, m2, v => { m2 = v; paint(); });
      ctr3.append(rc.lab, ctr3b, btn("Elrendezés", () => { view.layout(3); }));

      function load() {
        let G;
        if (key === "empty") G = { nodes: [], edges: [] };
        else G = preset(key, view.o.aspect);
        const edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));        // súlyozatlanul
        const nodes = G.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.03 + nd.x * 0.88 : nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub }));
        view.o.editable = key !== "karate";
        view.o.radius = key === "karate" ? (narrow ? 10 : 11) : (narrow ? 15 : 16);
        view.o.maxNodes = Math.max(14, nodes.length);
        view.setGraph(nodes, edges);
        compute();
      }
      function compute() {
        n = view.nodes.length;
        const E = view.edges.filter(e => e.a !== e.b), d = degreeC(n, E);
        if (!n) V = {};
        else V = {
          deg: d.map(x => x / Math.max(1, n - 1)),
          clo: closenessC(n, E),
          harm: harmonicC(n, E, true),
          btw: betweennessC(n, E, { norm: true }),
          eig: E.length ? eigenC(n, E).vec : new Array(n).fill(0),
          pr: pagerankC(n, E, { alpha: 0.85 })
        };
        V.comp = n ? compCount(n, E) : 0;
        V.E = E;
        paint();
      }
      const win = v => { const m = Math.max(...v); return m > 1e-9 ? [...v.keys()].filter(i => Math.abs(v[i] - m) < 1e-9) : []; };
      const labs = ix => ix.map(i => view.nodes[i].label).join(", ") || "–";
      function paint() {
        const many = n > 14;
        if (n) {
          const v = V[m1], mx = Math.max(...v, 1e-12), top = new Set(ranks(v).order.slice(0, 5));
          view.nodes.forEach((nd, i) => {
            const t = v[i] / mx;
            nd.color = mixColor("--card", "--accent", 0.06 + 0.84 * t); nd.ink = inkOf(nd.color);
            nd.badge = !many || top.has(i) ? fmt(v[i], 2) : null;
          });
          view.hl = new Set(win(v));
        } else view.hl = new Set();
        view.draw();
        /* rangsortáblázat */
        side.innerHTML = "";
        if (!n) {
          side.append(h("p", { class: "muted" }, "Üres gráf: kattints a vászonra új csúcsokért, majd két csúcsra egy élért."));
        } else {
          const v1 = V[m1], R1 = ranks(v1), w1 = new Set(win(v1));
          const tb = h("table", { style: "margin:.3rem 0;font-size:.9rem;width:auto;min-width:100%" });
          let head = `<tr><th>csúcs</th><th>${NAME[m1]}</th><th>hely</th>`;
          let v2, R2, w2;
          if (race) { v2 = V[m2]; R2 = ranks(v2); w2 = new Set(win(v2)); head += `<th>${NAME[m2]}</th><th>hely</th><th>változás</th>`; }
          tb.innerHTML = "<thead>" + head + "</tr></thead>";
          const body = h("tbody");
          R1.order.forEach(i => {
            const nd = view.nodes[i];
            const tdS = on => on ? " style=\"background:var(--accent-soft);color:var(--accent);font-weight:700\"" : "";
            let row = `<td${tdS(w1.has(i))}>${nd.label}${nd.sub && !narrow ? ` <span class="muted" style="font-size:.8em">${nd.sub}</span>` : ""}</td>` +
              `<td${tdS(w1.has(i))}><span style="font-family:var(--mono)">${fmt(v1[i], 3)}</span></td><td>${R1.rank[i]}.</td>`;
            if (m1 === "btw" && !race && n > 2) row = row.replace(`${fmt(v1[i], 3)}</span>`, `${fmt(v1[i], 3)}</span> <span class="muted" style="font-size:.8em">(nyersen ${fmt(v1[i] * (n - 1) * (n - 2) / 2, 2)})</span>`);
            if (race) {
              const dr = R1.rank[i] - R2.rank[i];
              const ch = dr > 0 ? `<span style="color:var(--setA);font-weight:700">▲${dr}</span>` : dr < 0 ? `<span style="color:var(--bad);font-weight:700">▼${-dr}</span>` : `<span class="muted">=</span>`;
              row += `<td${tdS(w2.has(i))}><span style="font-family:var(--mono)">${fmt(v2[i], 3)}</span></td><td>${R2.rank[i]}.</td><td>${ch}</td>`;
            }
            body.append(h("tr", { html: row }));
          });
          tb.append(body);
          tight(tb);
          const tw = h("div", { class: "tw", style: "overflow-x:auto" + (many ? ";max-height:24rem;overflow-y:auto" : "") }, tb);
          side.append(tw);
          if (race) side.append(h("div", { class: "muted", style: "font-size:.8rem" },
            `▲k: a(z) ${NAME[m2]} szerint k hellyel előrébb van, ▼k: hátrébb. A gráf színe: ${NAME[m1]}.`));
        }
        /* győztesek */
        winners.innerHTML = n ? "<b>Győztesek</b> – " + MEAS.map(([k, l]) => `${l}: <b>${labs(win(V[k]))}</b>`).join(" · ") : "Győztesek: –";
        /* magyarázat */
        let s = FORM[m1];
        if (race) s += "<br>" + FORM[m2];
        const ms = race ? [m1, m2] : [m1];
        if (n && V.comp > 1) {
          s += `<br><span style="color:var(--bad)">A gráf ${V.comp} komponensből áll.</span>`;
          if (ms.includes("clo")) s += `<br><b style="color:var(--bad)">A gráf nem összefüggő: a közelségi centralitás itt nem értelmes (0) – válaszd a harmonikust!</b>`;
          if (ms.includes("eig")) s += `<br><b style="color:var(--bad)">Nem összefüggő gráfon a sajátvektor csak a legerősebb komponensben ad nem nulla értéket.</b>`;
        }
        if (race && n >= 2) {
          const a1 = avgRanks(V[m1]), a2 = avgRanks(V[m2]);
          const ties = new Set(a1).size < n || new Set(a2).size < n;
          const rho = pearson(a1, a2);
          if (!ties) {
            const D2 = a1.reduce((t, r, i) => t + (r - a2[i]) ** 2, 0);
            s += `<br>Spearman-féle rangkorreláció: $\\rho = 1 - \\dfrac{6\\sum d_i^2}{n(n^2-1)} = 1 - \\dfrac{6\\cdot ${D2}}{${n}\\cdot ${n * n - 1}} = ${fmM(1 - 6 * D2 / (n * (n * n - 1)), 3)}$`;
          } else s += `<br>Spearman-féle rangkorreláció (holtverseny miatt az átlagolt rangok korrelációja): $\\rho = ${isFinite(rho) ? fmM(rho, 3) : "\\text{nincs értelmezve (minden érték egyenlő)}"}$`;
          if (isFinite(rho)) s += rho > 0.9 ? " – a két mérték szinte ugyanazt a sorrendet adja." : rho > 0.5 ? " – hasonló, de nem azonos sorrend." : " – a két mérték mást tart fontosnak.";
        }
        if (key === "kite" && n === 10 && V.E.length === 18) s += "<br>Krackhardt sárkánya: a fokszám D-t, a közelség F-et és G-t, a köztesség H-t tartja a legfontosabbnak – a „fontos” jelentése a kérdésen múlik.";
        info.innerHTML = s;
        math(info);
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       5.5  pagerank-surfer – iteráció lépésenként és a véletlen szörföző
       ------------------------------------------------------------------ */
    W["pagerank-surfer"] = root => {
      header(root, "PageRank: lépésenként és szörfözve",
        "(a) mód: a $\\mathbf p_t$ vektor iterációja $1/n$-ből. (b) mód: egy olvasó (<b style=\"color:var(--bad)\">piros pötty</b>) $\\alpha$ eséllyel " +
        "egy véletlen kimenő linken megy tovább, $1-\\alpha$ eséllyel (és zsákutcából mindig) egy véletlen csúcsra teleportál (szaggatott ív). Kattints egy csúcsra a képletéért!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.75 : 0.48;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" }), ctr3 = h("div", { class: "controls" });
      root.append(ctr, ctr2, ctr3);
      let key = "pr4", alpha = 0.85, noCA = false, leak = false, mode = "steps", G, n = 0, out = [], hist = [], lim = [], selN = -1;
      let cnt = [], steps = 0, tele = 0, cur = 0, prev = 0, lastTele = false, anim = null, timer = null;
      toggleGroup(ctr, [["pr4", "PageRank-minta"], ["papersU", "lapok hivatkozásai"], ["hits5", "összesítők és tudósítók"], ["arviz", "Árvízhét"]], key, v => { key = v; selN = -1; load(); });
      const aVal = h("b", { style: "font-family:var(--mono);min-width:2.6em" });
      const aSl = h("input", { type: "range", min: 0, max: 1, step: 0.05, value: alpha, "aria-label": "alfa", style: "width:9rem",
        oninput: () => { alpha = +aSl.value; rebuild(); } });
      ctr2.append(h("label", null, "α =", aSl, aVal));
      const ca = checkbox("C → A él törlése (C zsákutca lesz)", v => { noCA = v; load(); });
      ctr2.append(ca.lab);
      ctr3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "zsákutca:"));
      toggleGroup(ctr3, [[false, "egyenletes szétosztás"], [true, "nincs kezelve (elszivárog)"]], leak, v => { leak = v; rebuild(); });
      const ctrM = h("div", { class: "controls" });
      root.append(ctrM);
      toggleGroup(ctrM, [["steps", "(a) Lépésről lépésre"], ["surf", "(b) Szörföző"]], mode, v => { mode = v; stop(); panels(); paint(); });

      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, draggable: false, nodes: [], edges: [],
        onNodeClick: i => { selN = selN === i ? -1 : i; paint(); },
        onDraw: (ctx, v) => {
          if (mode !== "surf" || !n) return;
          const r = v.o.radius, P = i => [v.nodes[i].x * v.w - r * 0.8, v.nodes[i].y * v.h - r * 0.8];
          let [x, y] = P(cur);
          if (anim && lastTele) {                                // teleportálás: szaggatott ív + villanás
            const [x0, y0] = P(prev), mx = (x0 + x) / 2, my = (y0 + y) / 2 - 0.25 * Math.hypot(x - x0, y - y0) - 18;
            ctx.save(); ctx.globalAlpha = 1 - 0.7 * anim.t; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.strokeStyle = GK.css("--bad");
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x, y); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath(); ctx.arc(x, y, 7 + 14 * anim.t, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
          } else if (anim) { const [x0, y0] = P(prev), t = anim.t; x = x0 + (x - x0) * t; y = y0 + (y - y0) * t; }
          ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
          ctx.fillStyle = GK.css("--bad"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = GK.css("--card"); ctx.stroke();
        } });
      /* (a) panel */
      const pa = h("div"), paC = h("div", { class: "controls" }), paT = h("div", { class: "tw", style: "overflow-x:auto" });
      paC.append(btn("Lépés", () => { stepP(1); paint(); }, "btn primary"), btn("+10 lépés", () => { stepP(10); paint(); }), btn("Nullázás", () => { hist = [hist[0]]; paint(); }));
      pa.append(paC, paT);
      /* (b) panel */
      const pb = h("div"), pbC = h("div", { class: "controls" }), bars = h("div", { style: "margin-top:.5rem" });
      const playB = btn("▶ Indít", () => (timer ? stop() : start()), "btn primary");
      const sp = h("input", { type: "range", min: 1, max: 5, step: 1, value: 3, "aria-label": "sebesség", oninput: () => { if (timer) { stop(); start(); } } });
      pbC.append(playB, h("label", null, "sebesség", sp), btn("Lépés", () => { stop(); surf(true); paint(); }),
        btn("+1000 lépés", () => { stop(); for (let k = 0; k < 1000; k++) surf(false); anim = null; paint(); }),
        btn("Nullázás", () => { stop(); resetSurf(); paint(); }));
      pb.append(pbC, bars);
      const info = h("div", { class: "readout" }), formula = h("div", { class: "readout" });
      root.append(pa, pb, info, formula);
      function panels() { pa.style.display = mode === "steps" ? "" : "none"; pb.style.display = mode === "surf" ? "" : "none"; }

      /* egy iterációs lépés: q_i = (1−α)/n + α Σ_{j→i} p_j/k_j  (+ α·zsákutca/n, ha egyenletesen osztjuk szét) */
      function iter(p) {
        const q = new Array(n).fill((1 - alpha) / n);
        let dang = 0;
        for (let j = 0; j < n; j++) { if (!out[j].length) dang += p[j]; else out[j].forEach(i => (q[i] += alpha * p[j] / out[j].length)); }
        if (!leak) for (let i = 0; i < n; i++) q[i] += alpha * dang / n;
        return q;
      }
      function stepP(k) { for (let t = 0; t < k; t++) hist.push(iter(hist[hist.length - 1])); }
      function load() {
        stop();
        G = preset(key, aspect);
        if (key === "hits5") G.nodes[3].x += 0.12;            // T2 ne essen a T3 → T1 élre
        if (key === "pr4" && noCA) { const C = 2, A = 0; G.edges = G.edges.filter(e => !(e.a === C && e.b === A)); }
        n = G.nodes.length;
        out = Array.from({ length: n }, () => []);
        G.edges.forEach(e => { if (e.a === e.b) return; out[e.a].push(e.b); if (!G.directed) out[e.b].push(e.a); });
        ca.lab.style.display = key === "pr4" ? "" : "none";
        view.o.directed = !!G.directed;
        view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.04 + nd.x * 0.88 : nd.x, y: nd.sub && !G.directed ? liftY(nd.y) : nd.y, sub: G.directed ? null : nd.sub })),
          G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        rebuild();
      }
      /* α vagy a zsákutca-kezelés változott: elölről */
      function rebuild() {
        stop();
        aVal.textContent = fmt(alpha, 2);
        hist = [new Array(n).fill(1 / n)];
        let p = hist[0];
        for (let t = 0; t < 3000; t++) p = iter(p);
        lim = p;
        resetSurf();
        panels(); paint();
      }
      /* PageRank, amihez a szörföző tart (ő a zsákutcából mindig teleportál) */
      function surfLimit() { return pagerankC(n, G.edges, { directed: !!G.directed, alpha }); }
      let surfP = [];
      function resetSurf() {
        cnt = new Array(n).fill(0); steps = 0; tele = 0; anim = null; lastTele = false;
        cur = prev = Math.floor(Math.random() * n);
        surfP = surfLimit();
      }
      function surf(animate) {
        prev = cur;
        const o = out[cur];
        if (!o.length || Math.random() >= alpha) { cur = Math.floor(Math.random() * n); lastTele = true; tele++; }
        else { cur = o[Math.floor(Math.random() * o.length)]; lastTele = false; }
        cnt[cur]++; steps++;
        if (animate) {
          const dur = Math.min(320, 0.75 * (DELAY[+sp.value] || 320)), t0 = performance.now();
          anim = { t: 0 };
          const tick = now => {
            if (!anim) return;
            anim.t = Math.min(1, (now - t0) / dur);
            view.draw();
            if (anim.t < 1) requestAnimationFrame(tick); else { anim = null; view.draw(); }
          };
          requestAnimationFrame(tick);
        } else anim = null;
      }
      const DELAY = [0, 800, 400, 160, 50, 16];
      function start() {
        const s = +sp.value, d = DELAY[s], per = s === 5 ? 5 : 1;
        timer = setInterval(() => { for (let k = 0; k < per; k++) surf(d >= 160 && per === 1); paint(); }, d);
        playB.textContent = "⏸ Megállít";
      }
      function stop() { if (timer) clearInterval(timer); timer = null; playB.textContent = "▶ Indít"; }
      autoStop(root, stop);

      const L = i => G.nodes[i].label, tl = i => texLab(L(i));
      function paint() {
        const t = hist.length - 1, p = hist[t];
        const f = cnt.map(c => (steps ? c / steps : 0));
        const val = mode === "steps" ? p : f, mx = Math.max(...val, 1e-12);
        view.nodes.forEach((nd, i) => {
          const on = mode === "steps" || steps > 0;
          nd.color = on ? mixColor("--card", "--accent", 0.06 + 0.8 * val[i] / mx) : null;
          nd.ink = on ? inkOf(nd.color) : null;
          nd.badge = mode === "steps" ? fmt(p[i], 3) : (steps ? fmt(100 * f[i], 1) + "%" : null);
        });
        view.hl = new Set(selN >= 0 ? [selN] : []);
        view.edges.forEach(e => { e.color = selN >= 0 && (G.directed ? e.b === selN : (e.a === selN || e.b === selN)) ? "--accent" : null; e.width = e.color ? 3 : null; });
        view.draw();
        const sum = p.reduce((s, x) => s + x, 0);
        let s = "";
        if (mode === "steps") {
          /* táblázat: az utolsó néhány lépés + a határérték */
          const from = Math.max(0, t - 7);
          let tb = `<table style="margin:.3rem 0;font-size:.88rem;font-family:var(--mono);width:auto;min-width:100%"><thead><tr><th>t</th>${G.nodes.map(nd => `<th>${nd.label}</th>`).join("")}<th>Σ</th></tr></thead><tbody>`;
          if (from > 0) tb += `<tr><td colspan="${n + 2}" class="muted">… (${from} korábbi lépés)</td></tr>`;
          for (let k = from; k <= t; k++) {
            const r = hist[k], S = r.reduce((a, x) => a + x, 0), last = k === t ? " style=\"font-weight:700\"" : "";
            tb += `<tr${last}><td>${k}</td>${r.map(x => `<td>${fmt(x, 3)}</td>`).join("")}<td>${fmt(S, 3)}</td></tr>`;
          }
          const LS = lim.reduce((a, x) => a + x, 0);
          tb += `<tr style="color:var(--accent)"><td>∞</td>${lim.map(x => `<td>${fmt(x, 3)}</td>`).join("")}<td>${fmt(LS, 3)}</td></tr></tbody></table>`;
          paT.innerHTML = tb;
          tight(paT);
          s += `t = <b>${t}</b> · összeg: <b>${fmt(sum, 3)}</b>` + (Math.abs(sum - 1) > 1e-6 ? ` <span style="color:var(--bad)">(kevesebb mint 1: a zsákutcába jutó súly elszivárog)</span>` : "");
          s += `<br>Az utolsó sor (∞) a határérték: ezt adja a PageRank.`;
        } else {
          /* oszlopdiagram: gyakoriság és (halványan) PageRank */
          const scale = Math.max(...f, ...surfP, 0.05) * 1.12;
          bars.innerHTML = "";
          G.nodes.forEach((nd, i) => {
            const band = h("div", { style: `position:absolute;left:0;top:0;bottom:0;width:${100 * surfP[i] / scale}%;background:var(--setB);opacity:.25;border-radius:4px` });
            const line = h("div", { style: `position:absolute;top:-3px;bottom:-3px;left:calc(${100 * surfP[i] / scale}% - 1px);width:2px;background:var(--setB)` });
            const fill = h("div", { style: `position:absolute;left:0;top:3px;bottom:3px;width:${100 * f[i] / scale}%;background:var(--accent);border-radius:3px` });
            bars.append(h("div", { style: "display:grid;grid-template-columns:2.4em 1fr 7.6em;gap:.5rem;align-items:center;margin:.22rem 0" },
              h("div", { style: "font-weight:600" }, nd.label), h("div", { style: "position:relative;height:18px;background:var(--bg-soft);border-radius:4px" }, band, fill, line),
              h("div", { style: "font-family:var(--mono);font-size:.82rem;white-space:nowrap;text-align:right" }, `${fmt(f[i], 3)} · p ${fmt(surfP[i], 3)}`)));
          });
          bars.append(h("div", { class: "muted", style: "font-size:.8rem" }, "teli sáv: látogatási gyakoriság · halvány narancs sáv: PageRank"));
          const dev = 0.5 * f.reduce((a, x, i) => a + Math.abs(x - surfP[i]), 0);
          s += `Lépés: <b>${steps}</b> · teleportálás: ${tele}${steps ? ` (${fmt(100 * tele / steps, 1)}%)` : ""} · most: ${L(cur)}`;
          if (steps) s += `<br>Eltérés a PageRanktől: ½·Σ|fᵢ − pᵢ| = <b>${fmt(dev, 3)}</b>`;
          if (leak) s += `<br>A szörföző zsákutcából mindig teleportál – ő az egyenletes szétosztást követi.`;
        }
        /* figyelmeztetések */
        const indeg = new Array(n).fill(0);
        out.forEach(l => l.forEach(i => indeg[i]++));
        const dead = [...Array(n).keys()].filter(i => !out[i].length);
        if (dead.length) s += `<br>Zsákutca (nincs kimenő él): ${dead.map(L).join(", ")} – ` + (leak ? "a súlya elvész." : "a súlyát egyenletesen szétosztjuk.");
        if (alpha === 1) {
          const zero = [...Array(n).keys()].filter(i => indeg[i] === 0 && (leak || !dead.length));
          zero.forEach(i => { s += `<br><span style="color:var(--bad)">${L(i)}-be nem vezet él: teleportálás nélkül a súlya 0 lesz.</span>`; });
        }
        if (alpha === 0) s += `<br>α = 0: csak teleportálás – minden csúcs 1/n-et kap.`;
        if (key === "arviz") s += `<br>Irányítatlan gráf: minden él két irányú. Ekkor a PageRank közel van a $d_i/2m$-hez (Po, Ko: 0,2).`;
        info.innerHTML = s;
        math(info);
        /* képlet a kiválasztott csúcsra (p_t → p_{t+1}) */
        if (selN >= 0) {
          const i = selN, src = [...Array(n).keys()].filter(j => out[j].includes(i));
          const cur_ = mode === "steps" ? p : surfP;
          const tsub = mode === "steps" ? `^{(${t + 1})}` : "", tsrc = mode === "steps" ? `^{(${t})}` : "";
          const terms = src.map(j => `\\frac{p_{${tl(j)}}${tsrc}}{${out[j].length}}`), nums = src.map(j => `\\frac{${fmM(cur_[j], 3)}}{${out[j].length}}`);
          let sumIn = src.reduce((a, j) => a + cur_[j] / out[j].length, 0);
          const dang = leak ? 0 : dead.reduce((a, j) => a + cur_[j], 0);
          let tex = `p_{${tl(i)}}${tsub} = \\frac{1-\\alpha}{n} + \\alpha\\Big(${terms.join(" + ") || "0"}\\Big)`;
          let num = `${fmM((1 - alpha) / n, 4)} + ${fmM(alpha, 2)}\\cdot\\big(${nums.join(" + ") || "0"}\\big)`;
          if (dang > 0) { tex += ` + \\alpha\\,\\frac{\\text{zsákutcák}}{n}`; num += ` + ${fmM(alpha, 2)}\\cdot\\frac{${fmM(dang, 3)}}{${n}}`; }
          const res = (1 - alpha) / n + alpha * sumIn + alpha * dang / n;
          formula.style.display = "";
          formula.innerHTML = `$${tex}$<br>$= ${num} = ${fmM(res, 3)}$` +
            (mode === "steps" ? "" : `<br><span class="muted">A határértékbe helyettesítve önmagát adja vissza (fixpont).</span>`);
          math(formula);
        } else formula.style.display = "none";
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       5.6  hits-steps – HITS: tekintélyek és hubok lépésenként
       ------------------------------------------------------------------ */
    W["hits-steps"] = root => {
      header(root, "HITS lépésenként: tekintélyek és hubok",
        "Kezdetben minden hub-érték 1. Egy lépés: $\\mathbf a = A^\\top\\mathbf h$ (minden csúcs összeadja a rá mutatók hub-értékét), normálás (max = 1), " +
        "majd $\\mathbf h = A\\mathbf a$ (minden csúcs összeadja azok tekintélyét, akikre mutat), normálás. Kattints egy csúcsra az összegéért!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.75 : 0.45;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" }), ctr3 = h("div", { class: "controls" });
      root.append(ctr, ctr2, ctr3);
      let key = "hits5", edit = false, colorBy = "a", n = 0, E = [], H = [], selN = -1, conv = false;
      toggleGroup(ctr, [["hits5", "összesítők és tudósítók"], ["papersU", "lapok hivatkozásai"], ["pr4", "PageRank-minta"]], key, v => { key = v; load(); });
      const ed = checkbox("szerkesztés (csúcs → csúcs: él be/ki, élre: törlés, üres helyre: új csúcs)", v => { edit = v; view.o.editable = v; view.sel = -1; selN = -1; paint(); });
      ctr.append(ed.lab);
      ctr2.append(btn("Lépés", () => { step(); paint(); }, "btn primary"), btn("Konvergenciáig", () => { for (let k = 0; k < 500 && !conv; k++) step(); paint(); }),
        btn("Nullázás", () => { reset(); paint(); }));
      ctr3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "színezés:"));
      toggleGroup(ctr3, [["a", "tekintély (a)"], ["h", "hub (h)"]], colorBy, v => { colorBy = v; paint(); });
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect, directed: true, editable: false, maxNodes: 10, radius: narrow ? 15 : 17, nodes: [], edges: [],
        onNodeClick: i => {
          if (edit) {
            if (view.sel < 0) view.sel = i;
            else if (view.sel === i) view.sel = -1;
            else {
              const j = E.findIndex(e => e.a === view.sel && e.b === i);
              if (j >= 0) E.splice(j, 1); else E.push({ a: view.sel, b: i, w: 1 });
              view.sel = -1; changed(); return;
            }
            paint(); return;
          }
          selN = selN === i ? -1 : i; paint();
        },
        onChange: () => { E = view.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); changed(); } });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" }), info = h("div", { class: "readout" });
      root.append(tw, info);

      function load() {
        const G = preset(key, aspect);
        if (key === "hits5") G.nodes[3].x += 0.12;            // T2 ne essen a T3 → T1 élre
        E = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.04 + nd.x * 0.9 : nd.x, y: nd.y })), E);
        selN = -1;
        reset(); paint();
      }
      function changed() { selN = -1; reset(); paint(); }
      function reset() {
        n = view.nodes.length;
        H = [{ a: null, h: new Array(n).fill(1) }];
        conv = false;
      }
      function step() {
        if (conv || !n) return;
        const hp = H[H.length - 1].h, ra = new Array(n).fill(0), rh = new Array(n).fill(0);
        E.forEach(e => (ra[e.b] += hp[e.a]));
        const ma = Math.max(...ra), a = ra.map(x => (ma > 1e-12 ? x / ma : 0));
        E.forEach(e => (rh[e.a] += a[e.b]));
        const mh = Math.max(...rh), hh = rh.map(x => (mh > 1e-12 ? x / mh : 0));
        const prevA = H[H.length - 1].a;
        const diff = hh.reduce((t, x, i) => t + Math.abs(x - hp[i]), 0) + (prevA ? a.reduce((t, x, i) => t + Math.abs(x - prevA[i]), 0) : 1);
        H.push({ a, h: hh, ra, rh, hp });
        if (diff < 1e-10) conv = true;
      }
      const L = i => view.nodes[i].label, tl = i => texLab(L(i));
      function paint() {
        view.edges = E.map(e => ({ a: e.a, b: e.b, w: 1 }));
        const t = H.length - 1, S = H[t], cur = colorBy === "a" ? S.a : S.h, base = colorBy === "a" ? "--setB" : "--setA";
        view.nodes.forEach((nd, i) => {
          const v = cur ? cur[i] : null;
          nd.color = v == null ? null : mixColor("--card", base, 0.06 + 0.84 * v); nd.ink = v == null ? null : inkOf(nd.color);
          nd.badge = v == null ? null : fmt(v, 3);
        });
        view.hl = new Set(selN >= 0 ? [selN] : []);
        if (selN >= 0) view.edges.forEach(e => { if (colorBy === "a" ? e.b === selN : e.a === selN) { e.color = base; e.width = 3.5; } });
        view.draw();
        const indeg = new Array(n).fill(0), outdeg = new Array(n).fill(0);
        E.forEach(e => { indeg[e.b]++; outdeg[e.a]++; });
        /* táblázat */
        const raw = t >= 1;
        let tb = `<table style="margin:.4rem 0;font-size:.88rem;width:auto;min-width:100%"><thead><tr><th>csúcs</th><th>befok</th><th>kifok</th>` +
          (raw ? `<th>nyers Aᵀh</th>` : "") + `<th style="color:var(--setB)">a</th>` + (raw ? `<th>nyers Aa</th>` : "") + `<th style="color:var(--setA)">h</th></tr></thead><tbody>`;
        const ma = S.a ? Math.max(...S.a) : 0, mh = Math.max(...S.h);
        for (let i = 0; i < n; i++) {
          const ta = S.a && S.a[i] > 1e-9 && Math.abs(S.a[i] - ma) < 1e-9, th = S.h[i] > 1e-9 && Math.abs(S.h[i] - mh) < 1e-9;
          const hi = c => ` style="font-family:var(--mono);font-weight:700;color:var(${c})"`, mono = ` style="font-family:var(--mono)"`;
          tb += `<tr${i === selN ? ' style="background:var(--accent-soft)"' : ""}><td><b>${L(i)}</b></td><td>${indeg[i]}</td><td>${outdeg[i]}</td>` +
            (raw ? `<td${mono}>${fmt(S.ra[i], 3)}</td>` : "") + `<td${ta ? hi("--setB") : mono}>${S.a ? fmt(S.a[i], 3) : "–"}</td>` +
            (raw ? `<td${mono}>${fmt(S.rh[i], 3)}</td>` : "") + `<td${th ? hi("--setA") : mono}>${fmt(S.h[i], 3)}</td></tr>`;
        }
        tw.innerHTML = tb + "</tbody></table>";
        tight(tw);
        /* kiírás */
        let s = `Lépés: <b>${t}</b>` + (conv ? " · <b>konvergált</b>" : "") + (t === 0 ? " · kezdés: minden h = 1, a még nincs kiszámolva." : "");
        if (t === 1 && n) {
          const ra = new Array(n).fill(0), rh = new Array(n).fill(0);
          E.forEach(e => (ra[e.b] += 1)); E.forEach(e => (rh[e.a] += ra[e.b]));
          s += `<br>Nyers egészekkel: a = Aᵀ·1 = (${ra.join("; ")}), h = A·a = (${rh.join("; ")}) – max-ra normálva ugyanaz az arány.`;
        }
        if (selN >= 0 && t >= 1) {
          const i = selN;
          if (colorBy === "a") {
            const src = E.filter(e => e.b === i).map(e => e.a), ma_ = Math.max(...S.ra);
            s += `<br>$a_{${tl(i)}} = ${src.map(j => `h_{${tl(j)}}`).join(" + ") || "0"} = ${src.map(j => fmM(S.hp[j], 3)).join(" + ") || "0"} = ${fmM(S.ra[i], 3)}$` +
              (src.length ? `, normálva: $${fmM(S.ra[i], 3)} / ${fmM(ma_, 3)} = ${fmM(S.a[i], 3)}$` : "");
          } else {
            const dst = E.filter(e => e.a === i).map(e => e.b), mh_ = Math.max(...S.rh);
            s += `<br>$h_{${tl(i)}} = ${dst.map(j => `a_{${tl(j)}}`).join(" + ") || "0"} = ${dst.map(j => fmM(S.a[j], 3)).join(" + ") || "0"} = ${fmM(S.rh[i], 3)}$` +
              (dst.length ? `, normálva: $${fmM(S.rh[i], 3)} / ${fmM(mh_, 3)} = ${fmM(S.h[i], 3)}$` : "");
          }
        } else if (selN >= 0) s += "<br>Előbb lépj egyet: a kattintott csúcs összege a lépés után látszik.";
        else s += colorBy === "a" ? "<br>Kattints egy csúcsra: kiemelem a bejövő éleit, és kiírom a tekintély-összegét." : "<br>Kattints egy csúcsra: kiemelem a kimenő éleit, és kiírom a hub-összegét.";
        if (edit) s += "<br>Szerkesztés: kattints két csúcsra (előbb a kiinduló, aztán a cél) – él be/ki.";
        if (conv) s += "<br><b>A legjobb hubok a sok jó tekintélyre mutató oldalak (összesítők), a legjobb tekintélyek a sok jó hub által hivatkozottak (eredeti tudósítók).</b>";
        info.innerHTML = s;
        math(info);
      }
      onTheme(paint);
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
