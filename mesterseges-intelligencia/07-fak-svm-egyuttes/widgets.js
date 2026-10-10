/* =========================================================
   Mesterséges intelligencia 7. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 5–6. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));
  const pct = (a, d = 1) => fmt(100 * a, d) + "%";

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style") e.style.cssText = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const btn = (label, onclick, cls = "btn") => h("button", { class: cls, type: "button", onclick }, label);
  const slider = (min, max, step, value) => h("input", { type: "range", min, max, step, value });
  const checkbox = (checked, onchange) => { const c = h("input", { type: "checkbox", onchange }); c.checked = checked; return c; };
  const math = el => window.Synopsis && Synopsis.renderMath(el);

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  function twoCanvas(root, aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div"), R = h("div");
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspect, 380)];
  }
  /* vászon-koordináta egy egéreseményből */
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function polyline(ctx, T, pts, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, color, open = false) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
    ctx.restore();
  }
  /* négyzet = 1-es osztály („eső”, „+”), kör = 0-s osztály */
  function square(ctx, x, y, r, color, open = false) {
    ctx.save();
    if (open) { ctx.fillStyle = css("--card"); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(x - r, y - r, 2 * r, 2 * r); }
    else { ctx.fillStyle = color; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
    ctx.restore();
  }
  const mark = (ctx, T, x, y, c, r = 4.5, open = false) =>
    (c ? square(ctx, T.tx(x), T.ty(y), r * 0.85, css("--setB"), open) : dot(ctx, T.tx(x), T.ty(y), r, css("--setA"), open));
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  /* felirat a vászon jobb felső sarkában, háttérrel (hogy a térkép ne zavarja) */
  function tag(ctx, cv, txt) {
    ctx.save(); ctx.font = "700 12px system-ui, sans-serif";
    const w = ctx.measureText(txt).width + 10;
    ctx.fillStyle = rgba(css("--card"), 0.85); ctx.fillRect(cv.w - w - 6, 6, w, 19);
    ctx.restore();
    label(ctx, txt, cv.w - 11, 20, css("--text"), "right", "700 12px system-ui, sans-serif");
  }
  /* választógomb-csoport: egyszerre egy aktív (.btn.on) */
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => {
      const b = btn(txt, () => set(key));
      b.dataset.key = key;
      return b;
    });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    return { bs, paint };
  }
  /* "#3b82f6" → "rgba(59,130,246,a)" */
  function rgba(col, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col.trim());
    if (!m) return col;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  /* döntési térkép: p(x, y) = az 1-es osztály valószínűsége (vagy szavazati aránya) */
  function decisionMap(cv, T, view, p, cell = 6) {
    const { ctx, w, h: hh } = cv;
    const c1 = css("--setB"), c0 = css("--setA");
    for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
      const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2);
      if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) continue;
      const v = p(x, y);
      if (!Number.isFinite(v)) continue;
      const a = 0.07 + 0.30 * Math.min(1, Math.abs(v - 0.5) * 2);
      ctx.fillStyle = rgba(v >= 0.5 ? c1 : c0, a);
      ctx.fillRect(px, py, cell, cell);
    }
  }
  const sigma = z => 1 / (1 + Math.exp(-z));
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  /* névelő egy szám elé (1–999): „az 1.”, „az 5.”, „az 50.”, „az 500.”, különben „a” */
  const az = n => (/^(1|5|5\d|5\d\d)$/.test(String(n)) ? "az " : "a ") + n;

  /* mulberry32: kicsi, gyors, magból reprodukálható álvéletlen-generátor */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const gauss = rnd => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  function shuffled(arr, rnd) {
    const b = arr.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  }
  /* két hold zajjal (az 5. fejezetből), a [0, 10] × [0, 7] tartományban */
  function moons(n, seed) {
    const rnd = mulberry32(seed), out = [];
    for (let i = 0; i < n; i++) {
      const c = i % 2, t = Math.PI * rnd();
      let x = c ? 1 - Math.cos(t) : Math.cos(t), y = c ? 0.5 - Math.sin(t) : Math.sin(t);
      x += 0.25 * gauss(rnd); y += 0.25 * gauss(rnd);
      out.push({ x: 3.4 + 2.8 * x, y: 2.9 + 2.8 * y, c });
    }
    return out;
  }
  const accOf = (pts, p) => pts.filter(q => (p(q.x, q.y) >= 0.5 ? 1 : 0) === q.c).length / pts.length;

  /* ------------------------------------------------------------------
     Közös ML-mag: CART-fa, bootstrap, erdő, boosting, logisztikus regresszió, kNN, SVM (SMO)
     ------------------------------------------------------------------ */
  /* szennyezettség a súlyösszegből (w) és az 1-es osztály súlyából (w1) */
  const giniOf = (w, w1) => { if (w <= 0) return 0; const p = w1 / w; return 2 * p * (1 - p); };   // = 1 − p² − (1 − p)²
  const entOf = (w, w1) => { if (w <= 0) return 0; const p = w1 / w; return p <= 0 || p >= 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)); };

  /* Egy jellemző összes lehetséges vágása egy csomópontban: x_j < t, t = két szomszédos különböző érték felezőpontja.
     cost = a két rész összsúllyal szorzott szennyezettsége (regressziónál a négyzetes hibák összege, SSE). */
  function splitScan(X, y, wt, idx, j, task = "clf", imp = giniOf, minLeaf = 1) {
    const o = idx.filter(i => wt[i] > 0).sort((a, b) => X[a][j] - X[b][j]);
    let W0 = 0, S0 = 0, SS0 = 0;
    for (const i of o) { W0 += wt[i]; S0 += wt[i] * y[i]; SS0 += wt[i] * y[i] * y[i]; }
    const out = [];
    let wl = 0, sl = 0, ssl = 0;
    for (let k = 0; k < o.length - 1; k++) {
      const i = o[k]; wl += wt[i]; sl += wt[i] * y[i]; ssl += wt[i] * y[i] * y[i];
      const a = X[i][j], b = X[o[k + 1]][j];
      if (b <= a) continue;
      const wr = W0 - wl, sr = S0 - sl;
      if (wl < minLeaf || wr < minLeaf) continue;
      const cost = task === "reg" ? (ssl - sl * sl / wl) + (SS0 - ssl - sr * sr / wr) : wl * imp(wl, sl) + wr * imp(wr, sr);
      out.push({ j, t: (a + b) / 2, cost, wl, sl, wr, sr });
    }
    return out;
  }
  /* CART: mohó, bináris vágások. Csomópont: { leaf, value (p₁ vagy átlag), n, idx, depth, j, t, left, right }.
     weights: mintasúlyok (a bootstrap-ismétlések száma; 0 = nincs a mintában). maxFeatures: vágásonként ennyi
     véletlen jellemzőt nézünk (mint az sklearn: ha ezek közt nincs érvényes vágás, a többit is megnézzük). */
  function buildTree(X, y, opt = {}) {
    const { maxDepth = Infinity, minLeaf = 1, criterion = "gini", maxFeatures = 0, rnd = Math.random, task = "clf" } = opt;
    const wt = opt.weights || y.map(() => 1), d = X[0].length;
    const imp = criterion === "entropy" ? entOf : giniOf;
    function grow(idx, depth) {
      let w = 0, s = 0, ss = 0;
      for (const i of idx) { w += wt[i]; s += wt[i] * y[i]; ss += wt[i] * y[i] * y[i]; }
      const node = { leaf: true, value: s / w, n: w, idx, depth };
      const nodeImp = task === "reg" ? ss - s * s / w : w * imp(w, s);
      if (depth >= maxDepth || w < 2 * minLeaf || nodeImp <= 1e-12) return node;
      const feats = maxFeatures && maxFeatures < d ? shuffled([...Array(d).keys()], rnd) : [...Array(d).keys()];
      let best = null;
      for (let f = 0; f < feats.length; f++) {
        if (maxFeatures && f >= maxFeatures && best) break;
        for (const c of splitScan(X, y, wt, idx, feats[f], task, imp, minLeaf)) if (!best || c.cost < best.cost - 1e-12) best = c;
      }
      if (!best) return node;
      const L = [], R = [];
      idx.forEach(i => (X[i][best.j] < best.t ? L : R).push(i));
      return Object.assign(node, { leaf: false, j: best.j, t: best.t, left: grow(L, depth + 1), right: grow(R, depth + 1) });
    }
    return grow(X.map((_, i) => i).filter(i => wt[i] > 0), 0);
  }
  function predictTree(node, x) { while (!node.leaf) node = x[node.j] < node.t ? node.left : node.right; return node.value; }
  const treeDepth = n => (n.leaf ? 0 : 1 + Math.max(treeDepth(n.left), treeDepth(n.right)));
  /* a levelek a téglalapjukkal együtt; box = [x₀, x₁, y₀, y₁] */
  function leavesOf(node, box, out = []) {
    if (node.leaf) { out.push({ node, box }); return out; }
    const b1 = box.slice(), b2 = box.slice();
    if (node.j === 0) { b1[1] = node.t; b2[0] = node.t; } else { b1[3] = node.t; b2[2] = node.t; }
    leavesOf(node.left, b1, out); leavesOf(node.right, b2, out);
    return out;
  }

  /* bootstrap: n húzás visszatevéssel → hányszor került be az egyes pont (w), és ki maradt ki (oob) */
  function bootstrap(n, rnd) {
    const w = Array(n).fill(0);
    for (let k = 0; k < n; k++) w[Math.floor(rnd() * n)]++;
    return { w, oob: w.map(v => v === 0) };
  }
  /* bagging / véletlen erdő: B fa, mindegyik a saját bootstrap-mintáján; maxFeatures = 1 → véletlen erdő (2 jellemzőből) */
  function randomForest(X, y, { B = 100, maxDepth = Infinity, maxFeatures = 0, seed = 1, bag = true } = {}) {
    const rnd = mulberry32(seed);
    return Array.from({ length: B }, () => {
      const bs = bag ? bootstrap(X.length, rnd) : { w: X.map(() => 1), oob: X.map(() => false) };
      return { tree: buildTree(X, y, { maxDepth, maxFeatures, rnd, weights: bs.w }), w: bs.w, oob: bs.oob };
    });
  }
  /* szavazati arány (minden fa egy szavazat) */
  const forestVote = (F, x, B = F.length) => { let s = 0; for (let b = 0; b < B; b++) s += predictTree(F[b].tree, x) >= 0.5 ? 1 : 0; return s / B; };

  /* Gradiens boosting. F₀ = konstans; minden lépésben egy regressziós fát illesztünk a maradékokra (a negatív gradiensre),
     és η-szorosát hozzáadjuk.  loss = "sq": négyzetes veszteség, maradék = y − F.
     loss = "log": logisztikus veszteség, maradék = y − p, ahol p = σ(F); a levélértéket egy Newton-lépés adja:
     Σ(y − p) / Σ p(1 − p) a levél pontjain (ahogy az sklearn GradientBoostingClassifier is). */
  function gradientBoost(X, y, { M = 100, eta = 0.1, maxDepth = 2, loss = "sq" } = {}) {
    const m0 = mean(y), F0 = loss === "log" ? Math.log(m0 / (1 - m0)) : m0;
    const F = y.map(() => F0), trees = [];
    for (let m = 0; m < M; m++) {
      const p = loss === "log" ? F.map(sigma) : F;
      const r = y.map((v, i) => v - p[i]);
      const tree = buildTree(X, r, { task: "reg", maxDepth });
      if (loss === "log") leavesOf(tree, [0, 0, 0, 0]).forEach(({ node }) => {
        let num = 0, den = 0;
        node.idx.forEach(i => { num += r[i]; den += p[i] * (1 - p[i]); });
        node.value = num / Math.max(den, 1e-9);
      });
      trees.push(tree);
      X.forEach((x, i) => { F[i] += eta * predictTree(tree, x); });
    }
    return { F0, eta, trees };
  }
  const gbPredict = (g, x, M = g.trees.length) => { let f = g.F0; for (let m = 0; m < M; m++) f += g.eta * predictTree(g.trees[m], x); return f; };

  /* jellemzők standardizálása (átlag 0, szórás 1) a tanító halmaz alapján */
  function standardize(X) {
    const d = X[0].length, mu = [], sd = [];
    for (let j = 0; j < d; j++) {
      const c = X.map(x => x[j]), m = mean(c);
      mu.push(m); sd.push(Math.sqrt(mean(c.map(v => (v - m) ** 2))) || 1);
    }
    const f = x => x.map((v, j) => (v - mu[j]) / sd[j]);
    return { f, Z: X.map(f) };
  }
  /* logisztikus regresszió 2D-ben, Newton-módszerrel, kis L2-büntetéssel (λ = 0,01) */
  function fitLogReg(X, y, lam = 1e-2) {
    let w = [0, 0, 0];
    for (let it = 0; it < 25; it++) {
      const g = w.map(v => lam * v), H = [[lam, 0, 0], [0, lam, 0], [0, 0, lam]];
      X.forEach((x, i) => {
        const z = [1, x[0], x[1]], p = sigma(w[0] + w[1] * x[0] + w[2] * x[1]), s = p * (1 - p);
        for (let a = 0; a < 3; a++) { g[a] += (p - y[i]) * z[a]; for (let b = 0; b < 3; b++) H[a][b] += s * z[a] * z[b]; }
      });
      const st = solve3(H, g);
      w = w.map((v, a) => v - st[a]);
    }
    return x => sigma(w[0] + w[1] * x[0] + w[2] * x[1]);
  }
  function solve3(A, b) {                              // Gauss-elimináció, 3 × 3
    const M = A.map((r, i) => r.concat([b[i]]));
    for (let k = 0; k < 3; k++) {
      let p = k; for (let i = k + 1; i < 3; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
      [M[k], M[p]] = [M[p], M[k]];
      for (let i = k + 1; i < 3; i++) { const f = M[i][k] / M[k][k]; for (let j = k; j < 4; j++) M[i][j] -= f * M[k][j]; }
    }
    const x = [0, 0, 0];
    for (let k = 2; k >= 0; k--) { let s = M[k][3]; for (let j = k + 1; j < 3; j++) s -= M[k][j] * x[j]; x[k] = s / M[k][k]; }
    return x;
  }
  /* kNN: a k legközelebbi tanító pont 1-es aránya */
  function knnPredict(X, y, x, k) {
    const d = X.map((p, i) => [(p[0] - x[0]) ** 2 + (p[1] - x[1]) ** 2, y[i]]).sort((a, b) => a[0] - b[0]);
    let s = 0; for (let i = 0; i < k; i++) s += d[i][1];
    return s / k;
  }

  /* SVM a duális feladaton: min ½αᵀQα − Σα,  0 ≤ α ≤ C,  Σyα = 0,  Q_ij = y_i y_j K(x_i, x_j).
     Platt-féle SMO: mindig két α-t optimalizálunk együtt; a párt a libsvm módján választjuk
     (a leginkább sértő i, mellé a célfüggvényt legjobban csökkentő j). Teljes kernelmátrix → kis n-re (≤ 100). */
  function svmSMO(X, y, C, kernel = { type: "linear" }, eps = 1e-5, maxIter = 100000) {
    const n = X.length;
    const K = kernel.type === "rbf" ? (a, b) => Math.exp(-kernel.gamma * ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)) : (a, b) => a[0] * b[0] + a[1] * b[1];
    const Q = X.map((a, i) => X.map((b, j) => y[i] * y[j] * K(a, b)));
    const al = Array(n).fill(0), G = Array(n).fill(-1);          // G = Qα − 1 (a célfüggvény gradiense)
    const upB = i => al[i] >= C, loB = i => al[i] <= 0;
    for (let it = 0; it < maxIter; it++) {
      let Gmax = -Infinity, i = -1;
      for (let t = 0; t < n; t++) {
        if (y[t] === 1) { if (!upB(t) && -G[t] >= Gmax) { Gmax = -G[t]; i = t; } }
        else if (!loB(t) && G[t] >= Gmax) { Gmax = G[t]; i = t; }
      }
      if (i < 0) break;
      let Gmax2 = -Infinity, j = -1, best = Infinity;
      for (let t = 0; t < n; t++) {
        let gd, qc;
        if (y[t] === 1) { if (loB(t)) continue; gd = Gmax + G[t]; Gmax2 = Math.max(Gmax2, G[t]); qc = Q[i][i] + Q[t][t] - 2 * y[i] * Q[i][t]; }
        else { if (upB(t)) continue; gd = Gmax - G[t]; Gmax2 = Math.max(Gmax2, -G[t]); qc = Q[i][i] + Q[t][t] + 2 * y[i] * Q[i][t]; }
        if (gd > 0) { const od = -gd * gd / (qc > 0 ? qc : 1e-12); if (od <= best) { best = od; j = t; } }
      }
      if (Gmax + Gmax2 < eps || j < 0) break;
      const oi = al[i], oj = al[j];
      if (y[i] !== y[j]) {
        const qc = Math.max(Q[i][i] + Q[j][j] + 2 * Q[i][j], 1e-12), delta = (-G[i] - G[j]) / qc, diff = al[i] - al[j];
        al[i] += delta; al[j] += delta;
        if (diff > 0) { if (al[j] < 0) { al[j] = 0; al[i] = diff; } } else if (al[i] < 0) { al[i] = 0; al[j] = -diff; }
        if (diff > 0) { if (al[i] > C) { al[i] = C; al[j] = C - diff; } } else if (al[j] > C) { al[j] = C; al[i] = C + diff; }
      } else {
        const qc = Math.max(Q[i][i] + Q[j][j] - 2 * Q[i][j], 1e-12), delta = (G[i] - G[j]) / qc, sum = al[i] + al[j];
        al[i] -= delta; al[j] += delta;
        if (sum > C) { if (al[i] > C) { al[i] = C; al[j] = sum - C; } } else if (al[j] < 0) { al[j] = 0; al[i] = sum; }
        if (sum > C) { if (al[j] > C) { al[j] = C; al[i] = sum - C; } } else if (al[i] < 0) { al[i] = 0; al[j] = sum; }
      }
      const di = al[i] - oi, dj = al[j] - oj;
      for (let t = 0; t < n; t++) G[t] += Q[i][t] * di + Q[j][t] * dj;
    }
    /* eltolás: a szabad (0 < α < C) szupportvektorokon y·G átlaga; ha nincs ilyen, a megengedett sáv közepe */
    let ub = Infinity, lb = -Infinity, sf = 0, nf = 0;
    for (let i = 0; i < n; i++) {
      const yG = y[i] * G[i];
      if (upB(i)) { if (y[i] === -1) ub = Math.min(ub, yG); else lb = Math.max(lb, yG); }
      else if (loB(i)) { if (y[i] === 1) ub = Math.min(ub, yG); else lb = Math.max(lb, yG); }
      else { nf++; sf += yG; }
    }
    const b = -(nf ? sf / nf : (ub + lb) / 2);
    const sv = al.map((a, i) => i).filter(i => al[i] > 1e-8);
    let f, w = null;
    if (kernel.type === "linear") {
      w = [0, 0]; sv.forEach(i => { w[0] += al[i] * y[i] * X[i][0]; w[1] += al[i] * y[i] * X[i][1]; });
      f = x => w[0] * x[0] + w[1] * x[1] + b;
    } else f = x => sv.reduce((s, i) => s + al[i] * y[i] * K(X[i], x), b);
    return { alpha: al, b, w, sv, f };
  }

  const W = {};

  /* ------------------------------------------------------------------
     7.1  split-picker – melyik kérdés a jobb? (Gini, entrópia, információnyereség)
     ------------------------------------------------------------------ */
  /* A fejezet tíz reggele: ég, esőt mond-e az előrejelzés, erős-e a szél, páratartalom (%), esett-e (1 = igen) */
  const DAYS = [
    ["R1", "tiszta", 0, 0, 45, 0], ["R2", "tiszta", 0, 1, 55, 0], ["R3", "tiszta", 1, 0, 78, 0], ["R4", "felhős", 1, 1, 85, 1],
    ["R5", "felhős", 0, 0, 62, 0], ["R6", "felhős", 1, 0, 74, 1], ["R7", "borult", 1, 0, 90, 1], ["R8", "borult", 1, 1, 92, 1],
    ["R9", "borult", 0, 1, 88, 0], ["R10", "felhős", 0, 1, 70, 0]
  ].map(([n, sky, fc, wind, hum, c]) => ({ n, sky, fc, wind, hum, c }));
  const HUM_T = [50, 58.5, 66, 72, 76, 81.5, 86.5, 89, 91];
  const yn = [["igen", true], ["nem", false]];
  const QSTN = {
    fc: { name: "Esőt mond az előrejelzés?", br: [["eső", d => !!d.fc], ["nincs eső", d => !d.fc]] },
    sky: { name: "Milyen az ég?", br: ["tiszta", "felhős", "borult"].map(s => [s, d => d.sky === s]) },
    clear: { name: "Tiszta az ég?", br: yn.map(([l, v]) => [l, d => (d.sky === "tiszta") === v]) },
    wind: { name: "Erős a szél?", br: yn.map(([l, v]) => [l, d => !!d.wind === v]) }
  };
  const humQ = t => ({ name: `Páratartalom < ${fmt(t, 1)}%?`, br: [[`< ${fmt(t, 1)}`, d => d.hum < t], [`≥ ${fmt(t, 1)}`, d => d.hum >= t]] });
  /* egy kérdés kiértékelése a napok egy részhalmazán */
  function evalQ(days, Q) {
    const n = days.length;
    const parts = Q.br.map(([lab, f]) => {
      const ds = days.filter(f), k = ds.filter(d => d.c).length;
      return { lab, ds, yes: k, no: ds.length - k, g: giniOf(ds.length, k), H: entOf(ds.length, k) };
    }).filter(p => p.ds.length);
    const k = days.filter(d => d.c).length;
    const g0 = giniOf(n, k), H0 = entOf(n, k);
    const G = parts.reduce((s, p) => s + p.ds.length / n * p.g, 0), H = parts.reduce((s, p) => s + p.ds.length / n * p.H, 0);
    return { parts, g0, H0, G, H, dG: g0 - G, IG: H0 - H };
  }
  /* a páratartalom legjobb küszöbe egy részhalmazon (a Gini-csökkenés szerint) */
  function bestHum(days) {
    const v = [...new Set(days.map(d => d.hum))].sort((a, b) => a - b);
    let best = null;
    for (let i = 0; i + 1 < v.length; i++) { const t = (v[i] + v[i + 1]) / 2, e = evalQ(days, humQ(t)); if (!best || e.dG > best.e.dG + 1e-12) best = { t, e }; }
    return best;
  }
  W["split-picker"] = root => {
    header(root, "Melyik kérdés a jobb?",
      "A tíz reggel adataiból kérdezz egyet, és nézd meg, mennyire „tiszták” az ágak (<span class='chip b'>R</span> = esett, <span class='chip a'>R</span> = nem esett). " +
      "A jobb kérdés jobban csökkenti a szennyezettséget: kisebb a súlyozott Gini-index $\\sum \\frac{n_k}{n} G_k$, nagyobb az információnyereség.");
    let q = "fc", ti = 3, br2 = null, q2 = "clear";
    const keys = [["fc", "Esőt mond az előrejelzés?"], ["sky", "Milyen az ég?"], ["clear", "Tiszta az ég?"], ["wind", "Erős a szél?"], ["hum", "Páratartalom < t?"]];
    const gQ = toggleGroup(keys, () => q, v => { q = v; br2 = null; sync(); });
    const sT = slider(0, HUM_T.length - 1, 1, ti), oT = h("b");
    sT.addEventListener("input", () => { ti = +sT.value; br2 = null; sync(); });
    const lT = h("label", null, "t = ", oT, sT);
    root.append(h("div", { class: "controls" }, gQ.bs, lT));
    const view = h("div"), out = h("div", { class: "readout" }), rank = h("div", { style: "overflow-x:auto;margin-top:.6rem" }), lvl2 = h("div");
    root.append(view, out, rank, lvl2);
    const qOf = k => (k === "hum" ? humQ(HUM_T[ti]) : QSTN[k]);
    const chips = ds => ds.map(d => `<span class="chip ${d.c ? "b" : "a"}" style="margin:1px">${d.n}</span>`).join("");
    const box = "border:1px solid var(--border);border-radius:10px;padding:.45rem .6rem;background:var(--bg-soft);";
    function tree(days, Q, e, title) {
      return `<div style="${box}text-align:center;max-width:30rem;margin:0 auto">${title}: ${days.length} nap · ${e.parts.reduce((s, p) => s + p.yes, 0)} igen / ` +
        `${e.parts.reduce((s, p) => s + p.no, 0)} nem · Gini ${fmt(e.g0, 3)} · H ${fmt(e.H0, 3)} bit</div>` +
        `<div style="text-align:center;margin:.3rem 0;font-weight:600">↓ ${Q.name}</div>` +
        `<div style="display:flex;flex-wrap:wrap;gap:.5rem">` + e.parts.map(p =>
          `<div style="${box}flex:1 1 9rem"><div style="font-weight:700">${p.lab}</div><div style="margin:.25rem 0">${chips(p.ds)}</div>` +
          `<div style="font-size:.85rem">igen ${p.yes} / nem ${p.no}<br>Gini ${fmt(p.g, 3)} · H ${fmt(p.H, 3)}</div></div>`).join("") + `</div>`;
    }
    const nums = e => `súlyozott Gini <b>${fmt(e.G, 3)}</b> · Gini-csökkenés <b>${fmt(e.dG, 3)}</b> · súlyozott entrópia <b>${fmt(e.H, 3)}</b> bit · információnyereség <b>${fmt(e.IG, 3)}</b> bit`;
    function sync() {
      gQ.paint(); sT.value = ti; oT.textContent = fmt(HUM_T[ti], 1);
      lT.style.opacity = q === "hum" ? 1 : 0.45; sT.disabled = q !== "hum";
      const Q = qOf(q), e = evalQ(DAYS, Q);
      view.innerHTML = tree(DAYS, Q, e, "gyökér");
      out.innerHTML = nums(e) + (e.dG < 1e-9 ? `<br><span class="muted">Ez a kérdés semmit nem árul el: minden ágban ugyanaz az arány, mint a gyökérben.</span>` :
        e.parts.some(p => p.g === 0) ? `<br><span class="muted">A tiszta (Gini = 0) ágakból levél lesz; a vegyes ágakat tovább lehet vágni.</span>` : "");
      /* ranglista: minden kérdés, a páratartalom a legjobb küszöbével */
      const bh = bestHum(DAYS);
      const rows = Object.keys(QSTN).map(k => ({ k, name: QSTN[k].name, e: evalQ(DAYS, QSTN[k]) }))
        .concat([{ k: "hum", name: `Páratartalom < ${fmt(bh.t, 1)}%? (legjobb t)`, e: bh.e }]).sort((a, b) => b.e.dG - a.e.dG);
      rank.innerHTML = `<table style="font-size:.85rem;margin:0"><tr><th>#</th><th>kérdés</th><th>súlyozott Gini</th><th>Gini-csökk.</th><th>inf. nyer.</th></tr>` +
        rows.map((r, i) => `<tr style="${r.k === q ? "background:var(--accent-soft);font-weight:600" : ""}"><td>${i + 1}.</td><td>${r.name}</td>` +
          `<td>${fmt(r.e.G, 3)}</td><td>${fmt(r.e.dG, 3)}</td><td>${fmt(r.e.IG, 3)}</td></tr>`).join("") + `</table>`;
      /* második szint: egy vegyes ág tovább vágása */
      const mixed = e.parts.filter(p => p.g > 0);
      lvl2.innerHTML = "";
      if (!mixed.length) return;
      if (!br2 || !mixed.some(p => p.lab === br2)) br2 = mixed.slice().sort((a, b) => b.ds.length - a.ds.length)[0].lab;
      const P = mixed.find(p => p.lab === br2), others = keys.filter(([k]) => k !== q);
      if (!others.some(([k]) => k === q2)) q2 = others[0][0];
      const bh2 = bestHum(P.ds);
      const Q2 = q2 === "hum" ? (bh2 ? humQ(bh2.t) : null) : QSTN[q2];
      const gB = toggleGroup(mixed.map(p => [p.lab, `↳ ${/^[aeiouáéíóöőúüű]/i.test(p.lab) ? "az" : "a"} „${p.lab}” ágat tovább vágom`]), () => br2, v => { br2 = v; sync(); });
      const g2 = toggleGroup(others.map(([k, t]) => [k, k === "hum" ? "Páratartalom < (legjobb t)?" : t]), () => q2, v => { q2 = v; sync(); });
      gB.paint(); g2.paint();
      lvl2.append(h("div", { class: "controls", style: "margin-top:1rem" }, gB.bs), h("div", { class: "controls" }, g2.bs));
      if (!Q2) { lvl2.append(h("p", { class: "muted" }, "Ebben az ágban nincs két különböző páratartalom.")); return; }
      const e2 = evalQ(P.ds, Q2);
      lvl2.append(h("div", { html: tree(P.ds, Q2, e2, `„${P.lab}” ág`) }),
        h("div", { class: "readout", html: "ezen az ágon: " + nums(e2) + (e2.G < 1e-9 ? `<br><span class="muted">Tökéletes vágás: minden új ág tiszta.</span>` : "") }));
    }
    sync();
  };

  /* ------------------------------------------------------------------
     7.1 / 7.2  tree-builder – döntési fa a síkon, kézzel és automatikusan
     ------------------------------------------------------------------ */
  /* „esős napok”: x₁ = páratartalom (%), x₂ = légnyomás (hPa); p(eső) = σ(0,15·(pára − 75) − 0,25·(nyomás − 1013)) */
  function rainData(n, seed) {
    const r = mulberry32(seed), X = [], y = [];
    for (let i = 0; i < n; i++) {
      const a = Math.round(400 + 600 * r()) / 10, b = Math.round(9950 + 400 * r()) / 10;
      X.push([a, b]); y.push(r() < sigma(0.15 * (a - 75) - 0.25 * (b - 1013)) ? 1 : 0);
    }
    return { X, y };
  }
  const RAIN = { tr: rainData(60, 7), te: rainData(400, 1007) };
  const RNAME = ["páratartalom", "légnyomás"], RUNIT = ["%", " hPa"];
  W["tree-builder"] = root => {
    header(root, "Döntési fa a síkon: vágj magad, vagy hagyd a gépre!",
      "60 tanító nap (teli jel; <span style='color:var(--setB)'>■ esett</span>, <span style='color:var(--setA)'>● nem esett</span>) a páratartalom ($x_1$) és a légnyomás ($x_2$) síkján. " +
      "Minden vágás egy tengelyekkel párhuzamos egyenes, minden levél egy téglalap. <b>Kézi módban</b> kattints egy levélre, válassz jellemzőt és küszöböt, majd vágj. " +
      "<b>Automatikus módban</b> a mélységet állítod – figyeld a tanító- és a tesztpontosságot!");
    const { tr, te } = RAIN, V = { xmin: 40, xmax: 100, ymin: 995, ymax: 1035, xname: "páratartalom (%)", yname: "légnyomás (hPa)" };
    const ones = tr.y.map(() => 1);
    let mode = "hand", showTest = false;
    let depth = 3, crit = "gini", minLeaf = 1;                          // automatikus mód
    const mkRoot = () => ({ leaf: true, idx: tr.X.map((_, i) => i), depth: 0, n: tr.X.length, value: mean(tr.y) });
    let hand = mkRoot(), hist = [], sel = "", fj = 0, fk = -1;           // kézi mód: fa, visszavonási verem, kiválasztott levél útja (L/R)
    const gMode = toggleGroup([["hand", "✋ Kézi építés"], ["auto", "⚙ Automatikus"]], () => mode, v => { mode = v; sync(); });
    const gJ = toggleGroup([[0, "vágás x₁ (pára) szerint"], [1, "vágás x₂ (nyomás) szerint"]], () => fj, v => { fj = +v; fk = -1; sync(); });
    const sK = slider(0, 1, 1, 0), oK = h("b");
    sK.addEventListener("input", () => { fk = +sK.value; sync(); });
    const bCut = btn("✂ Vágás", () => doCut(), "btn primary");
    const rowHand = h("div", null,
      h("div", { class: "controls" }, gJ.bs, h("label", null, "küszöb: ", oK, sK)),
      h("div", { class: "controls" }, bCut, btn("↶ Visszavonás", () => { if (hist.length) { const s = hist.pop(); hand = s.t; sel = s.sel; fk = -1; sync(); } }),
        btn("↺ Újra", () => { hand = mkRoot(); hist = []; sel = ""; fk = -1; sync(); })));
    const sD = slider(1, 13, 1, depth), oD = h("b");
    sD.addEventListener("input", () => { depth = +sD.value; sync(); });
    const gC = toggleGroup([["gini", "Gini"], ["entropy", "entrópia"]], () => crit, v => { crit = v; sync(); });
    const gL = toggleGroup([[1, "min. levél 1"], [5, "5"], [10, "10"]], () => minLeaf, v => { minLeaf = +v; sync(); });
    const rowAuto = h("div", { class: "controls" }, h("label", null, "max. mélység: ", oD, sD), gC.bs, gL.bs);
    root.append(h("div", { class: "controls" }, gMode.bs, h("label", null, checkbox(showTest, e => { showTest = e.target.checked; sync(); }), "tesztpontok (400, üres jel)")),
      rowHand, rowAuto);
    const cv = Calc.canvas(root, 0.6);
    const out = h("div", { class: "readout" });
    const wrap = h("div", { class: "two-canvas", style: "margin-top:.6rem" }), cL = h("div");
    const rules = h("div", { style: "white-space:pre;font-family:var(--mono);font-size:.78rem;overflow-x:auto;background:var(--bg-soft);border-radius:8px;padding:.5rem .6rem;line-height:1.45" });
    wrap.append(cL, rules); root.append(out, wrap);
    const cvC = Calc.canvas(cL, 0.62, 380);
    const nodeAt = path => { let n = hand; for (const ch of path) n = ch === "L" ? n.left : n.right; return n; };
    const cands = () => { const L = nodeAt(sel); return L && L.leaf ? splitScan(tr.X, tr.y, ones, L.idx, fj) : []; };
    function doCut() {
      const C = cands(); if (!C.length) return;
      const c = C[Math.max(0, Math.min(C.length - 1, fk))], L = nodeAt(sel);
      hist.push({ t: structuredClone(hand), sel });
      const part = side => { const idx = L.idx.filter(i => (tr.X[i][fj] < c.t) === side); return { leaf: true, idx, depth: L.depth + 1, n: idx.length, value: mean(idx.map(i => tr.y[i])) }; };
      Object.assign(L, { leaf: false, j: fj, t: c.t, left: part(true), right: part(false) });
      const a = L.left, b = L.right;                                   // a szennyezettebb (nagyobb) gyerek lesz a következő kiválasztott
      sel += giniOf(a.n, a.value * a.n) * a.n >= giniOf(b.n, b.value * b.n) * b.n ? "L" : "R";
      fk = -1; sync();
    }
    const curTree = () => (mode === "hand" ? hand : buildTree(tr.X, tr.y, { maxDepth: depth === 13 ? Infinity : depth, criterion: crit, minLeaf }));
    const accT = (t, D) => D.X.filter((x, i) => (predictTree(t, x) >= 0.5 ? 1 : 0) === D.y[i]).length / D.X.length;
    let curve = null, curveKey = "";
    function curveData() {
      const key = crit + minLeaf;
      if (key !== curveKey) {
        curve = Array.from({ length: 12 }, (_, k) => { const t = buildTree(tr.X, tr.y, { maxDepth: k + 1, criterion: crit, minLeaf }); return [accT(t, tr), accT(t, te)]; });
        curveKey = key;
      }
      return curve;
    }
    let T = null, tree = null;
    function draw() {
      T = Calc.plot(cv, V, []);
      const { ctx } = cv, c1 = css("--setB"), c0 = css("--setA");
      leavesOf(tree, [V.xmin, V.xmax, V.ymin, V.ymax]).forEach(({ node, box }) => {
        const x0 = T.tx(box[0]), x1 = T.tx(box[1]), y0 = T.ty(box[3]), y1 = T.ty(box[2]);
        ctx.fillStyle = rgba(node.value >= 0.5 ? c1 : c0, 0.08 + 0.32 * Math.abs(2 * node.value - 1));
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      });
      if (mode === "hand") {
        const S = leavesOf(hand, [V.xmin, V.xmax, V.ymin, V.ymax]).find(o => o.node === nodeAt(sel));
        if (S) {
          const b = S.box;
          ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 3; ctx.strokeRect(T.tx(b[0]) + 1.5, T.ty(b[3]) + 1.5, T.tx(b[1]) - T.tx(b[0]) - 3, T.ty(b[2]) - T.ty(b[3]) - 3); ctx.restore();
          const C = cands();
          if (C.length) {
            const t = C[fk].t;
            polyline(ctx, T, fj === 0 ? [[t, b[2]], [t, b[3]]] : [[b[0], t], [b[1], t]], css("--bad"), 2.2, [6, 4]);
          }
        }
      }
      if (showTest) { ctx.save(); ctx.globalAlpha = 0.6; te.X.forEach((x, i) => mark(ctx, T, x[0], x[1], te.y[i], 2.2, true)); ctx.restore(); }
      const r = cv.w < 500 ? 3.8 : 5;                  // keskeny (mobil) vásznon kisebb jelek
      tr.X.forEach((x, i) => { dot(ctx, T.tx(x[0]), T.ty(x[1]), r + 2, css("--card")); mark(ctx, T, x[0], x[1], tr.y[i], r); });
    }
    function drawCurve() {
      const C = curveData();
      const Tc = Calc.plot(cvC, { xmin: 0.3, xmax: 12.7, ymin: 0.5, ymax: 1.04, xstep: 1, ystep: 0.1, xname: " ", yname: "pontosság" }, []);
      const { ctx } = cvC;
      polyline(ctx, Tc, C.map((a, k) => [k + 1, a[0]]), css("--accent"), 2.2);
      polyline(ctx, Tc, C.map((a, k) => [k + 1, a[1]]), css("--bad"), 2.2);
      C.forEach((a, k) => { dot(ctx, Tc.tx(k + 1), Tc.ty(a[0]), 3, css("--accent")); dot(ctx, Tc.tx(k + 1), Tc.ty(a[1]), 3, css("--bad")); });
      const d = Math.max(1, Math.min(12, treeDepth(tree)));
      if (treeDepth(tree) > 0) {
        polyline(ctx, Tc, [[d, 0.5], [d, 1.04]], css("--muted"), 1.2, [4, 4]);
        dot(ctx, Tc.tx(d), Tc.ty(accT(tree, tr)), 6, css("--accent"), true); dot(ctx, Tc.tx(d), Tc.ty(accT(tree, te)), 6, css("--bad"), true);
      }
      label(ctx, "— tanító", Tc.tx(6.5), Tc.ty(0.62), css("--accent"));
      label(ctx, "— teszt", Tc.tx(6.5), Tc.ty(0.62) + 15, css("--bad"));
      label(ctx, mode === "hand" ? "○ a te fád" : "○ a mostani fa", Tc.tx(9.2), Tc.ty(0.62), css("--muted"), "left", "11px system-ui, sans-serif");
      label(ctx, "vízszintesen: a fa mélysége", Tc.tx(6.5), Tc.ty(0.62) + 30, css("--muted"), "left", "11px system-ui, sans-serif");
    }
    cv.draw = draw; cvC.draw = drawCurve;
    cv.c.addEventListener("pointerdown", e => {
      if (mode !== "hand" || !T) return;
      const [px, py] = evXY(cv, e), x = [T.ix(px), T.iy(py)];
      if (x[0] < V.xmin || x[0] > V.xmax || x[1] < V.ymin || x[1] > V.ymax) return;
      let n = hand, p = "";
      while (!n.leaf) { const l = x[n.j] < n.t; p += l ? "L" : "R"; n = l ? n.left : n.right; }
      sel = p; fk = -1; sync();
    });
    function ruleLines(n, ind = "", out = []) {
      if (out.length > 14) return out;
      if (n.leaf) { const k = Math.round(n.value * n.n); out.push(`${ind}→ ${n.value >= 0.5 ? "esik" : "nem esik"}  (${k} esős / ${n.n} nap)`); return out; }
      out.push(`${ind}ha ${RNAME[n.j]} < ${fmt(n.t, 1)}${RUNIT[n.j]}:`);
      ruleLines(n.left, ind + "   ", out);
      out.push(`${ind}különben:`);
      ruleLines(n.right, ind + "   ", out);
      return out;
    }
    function sync() {
      gMode.paint(); gC.paint(); gL.paint(); gJ.paint();
      rowHand.style.display = mode === "hand" ? "" : "none";
      rowAuto.style.display = mode === "auto" ? "" : "none";
      sD.value = depth; oD.textContent = depth === 13 ? "korlát nélkül" : String(depth);
      tree = curTree();
      let extra = "";
      if (mode === "hand") {
        const L = nodeAt(sel), C = cands();
        if (fk < 0 || fk >= C.length) fk = C.length >> 1;
        sK.max = Math.max(0, C.length - 1); sK.value = Math.max(0, fk); sK.disabled = C.length < 2; bCut.disabled = !C.length;
        const k1 = Math.round(L.value * L.n), g = giniOf(L.n, k1);
        extra = `<br>kiválasztott levél: ${L.n} pont (esős ${k1} / nem ${L.n - k1}), Gini ${fmt(g, 3)}`;
        if (C.length) {
          const c = C[fk], best = [0, 1].flatMap(j => splitScan(tr.X, tr.y, ones, L.idx, j)).reduce((a, b) => (b.cost < a.cost - 1e-12 ? b : a));
          oK.textContent = fmt(c.t, 1) + RUNIT[fj];
          extra += `<br>vágás ${RNAME[fj]} < ${fmt(c.t, 1)}${RUNIT[fj]}: bal ${c.wl} (${c.sl} esős), jobb ${c.wr} (${c.sr} esős) · súlyozott Gini <b>${fmt(c.cost / L.n, 3)}</b> · ` +
            `csökkenés <b>${fmt(g - c.cost / L.n, 3)}</b><br><span class="muted">a legjobb vágás ebben a levélben: ${RNAME[best.j]} < ${fmt(best.t, 1)}${RUNIT[best.j]} (csökkenés ${fmt(g - best.cost / L.n, 3)})</span>`;
        } else { oK.textContent = "–"; extra += ` · <span class="muted">ez a levél tiszta (vagy nem vágható) – válassz másikat!</span>`; }
      }
      draw(); drawCurve();
      const lines = ruleLines(tree);
      rules.textContent = (lines.length > 12 ? lines.slice(0, 12).concat(["   … (a többi szabály nem fér ki)"]) : lines).join("\n");
      const at = accT(tree, tr), ae = accT(tree, te);
      out.innerHTML = `levelek: <b>${leavesOf(tree, [0, 0, 0, 0]).length}</b> · mélység: <b>${treeDepth(tree)}</b> · tanítópontosság <b>${pct(at)}</b> · tesztpontosság <b>${pct(ae)}</b>` + extra +
        (mode === "auto" && at === 1 ? `<br><span class="muted">A tanítópontosság 100%: a fa minden tanító pontot „bemagolt” – a teszten viszont nem ez a legjobb.</span>` : "");
    }
    sync();
  };

  /* ------------------------------------------------------------------
     7.3  forest-vote – sok fa szavaz (bagging, véletlen erdő, OOB)
     ------------------------------------------------------------------ */
  W["forest-vote"] = root => {
    header(root, "Sok fa szavaz: bagging és véletlen erdő",
      "Zajos „holdak”: 80 tanító és 400 teszt pont. Minden fa a saját <b>bootstrap-mintáján</b> tanul (visszatevéses húzás). Balra egy kiválasztott fa: " +
      "teli jel = bekerült a mintájába, üres jel = kimaradt (<b>OOB</b>). Jobbra az együttes: a szín erőssége a szavazati arány. Lent: pontosság a fák számának függvényében.");
    let B = 50, mode = "rf", deep = true, seed = 3, cur = 1;
    const MODES = [["one", "egy fa"], ["bag", "bagging (minden jellemző)"], ["rf", "véletlen erdő (vágásonként 1 véletlen jellemző)"]];
    const gM = toggleGroup(MODES, () => mode, v => { mode = v; fit(); sync(); });
    const gD = toggleGroup([["full", "teljes mélységű fák"], ["3", "mélység 3"]], () => (deep ? "full" : "3"), v => { deep = v === "full"; fit(); sync(); });
    const sB = slider(1, 200, 1, B), oB = h("b"), sI = slider(1, B, 1, cur), oI = h("b");
    sB.addEventListener("input", () => { B = +sB.value; cur = Math.min(cur, B); sync(); });
    sI.addEventListener("input", () => { cur = +sI.value; sync(); });
    root.append(h("div", { class: "controls" }, gM.bs), h("div", { class: "controls" }, gD.bs, btn("🎲 Új adat", () => { seed++; data(); fit(); sync(); })),
      h("div", { class: "controls" }, h("label", null, "fák száma B = ", oB, sB), h("label", null, "megjelenített fa: ", oI, sI)));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const cvA = Calc.canvas(root, 0.36);
    const out = h("div", { class: "readout" });
    root.append(out);
    const V = { xmin: -0.3, xmax: 10.3, ymin: -0.3, ymax: 7.2, xname: "x₁", yname: "x₂" };
    let tr, te, X, y, F, S;
    function data() { tr = moons(80, seed); te = moons(400, seed + 500); X = tr.map(p => [p.x, p.y]); y = tr.map(p => p.c); }
    function fit() {
      const maxDepth = deep ? Infinity : 3;
      F = mode === "one" ? randomForest(X, y, { B: 1, bag: false, maxDepth }) :
        randomForest(X, y, { B: 200, maxDepth, maxFeatures: mode === "rf" ? 1 : 0, seed: 1000 + seed });
      /* minden fa szavazata a teszt- és tanító pontokon, majd a kumulált görbék */
      const PT = F.map(m => te.map(p => (predictTree(m.tree, [p.x, p.y]) >= 0.5 ? 1 : 0)));
      const PR = F.map(m => X.map(x => (predictTree(m.tree, x) >= 0.5 ? 1 : 0)));
      const votes = te.map(() => 0), oV = X.map(() => 0), oN = X.map(() => 0);
      S = { ens: [], oob: [], tree: [] };
      F.forEach((m, b) => {
        PT[b].forEach((v, i) => (votes[i] += v));
        S.ens.push(te.filter((p, i) => (votes[i] / (b + 1) >= 0.5 ? 1 : 0) === p.c).length / te.length);
        S.tree.push(te.filter((p, i) => PT[b][i] === p.c).length / te.length);
        m.oob.forEach((o, i) => { if (o) { oV[i] += PR[b][i]; oN[i]++; } });
        const ids = oN.map((k, i) => i).filter(i => oN[i] > 0);
        S.oob.push(ids.length ? ids.filter(i => (oV[i] / oN[i] >= 0.5 ? 1 : 0) === y[i]).length / ids.length : NaN);
      });
    }
    const nB = () => (mode === "one" ? 1 : B);
    cvL.draw = () => {
      const T = Calc.plot(cvL, V, []), { ctx } = cvL, m = F[cur - 1];
      decisionMap(cvL, T, V, (a, b) => predictTree(m.tree, [a, b]), 6);
      tr.forEach((p, i) => mark(ctx, T, p.x, p.y, p.c, 4, m.oob[i]));
      tag(ctx, cvL, mode === "one" ? "egy fa (az összes ponton)" : `${az(cur)}. fa`);
    };
    cvR.draw = () => {
      const T = Calc.plot(cvR, V, []), { ctx } = cvR, b = nB();
      decisionMap(cvR, T, V, (u, v) => forestVote(F, [u, v], b), 7);
      tr.forEach(p => mark(ctx, T, p.x, p.y, p.c, 4));
      tag(ctx, cvR, mode === "one" ? "„együttes” = 1 fa" : `együttes, B = ${b}`);
    };
    cvA.draw = () => {
      const b = nB(), lo = Math.min(0.7, ...S.tree.slice(0, b), ...S.oob.slice(0, b).filter(Number.isFinite)) - 0.02;
      const T = Calc.plot(cvA, { xmin: 0, xmax: Math.max(10, b) * 1.12, ymin: lo, ymax: 1.0, ystep: 0.05, xname: "fák száma", yname: "pontosság" }, []);
      const { ctx } = cvA, mt = mean(S.tree.slice(0, b));
      polyline(ctx, T, [[1, mt], [b, mt]], css("--muted"), 1.6, [6, 4]);
      polyline(ctx, T, S.oob.slice(0, b).map((v, k) => [k + 1, v]).filter(p => Number.isFinite(p[1])), css("--setC"), 2);
      polyline(ctx, T, S.ens.slice(0, b).map((v, k) => [k + 1, v]), css("--accent"), 2.4);
      if (b === 1) dot(ctx, T.tx(1), T.ty(S.ens[0]), 4, css("--accent"));
      const x0 = T.tx(Math.max(10, b) * 0.5), y0 = cvA.h - 22;
      label(ctx, "— együttes (teszt)", x0, y0 - 30, css("--accent"));
      label(ctx, "— OOB-becslés", x0, y0 - 15, css("--setC"));
      label(ctx, "- - egy fa átlagosan (teszt)", x0, y0, css("--muted"));
    };
    function sync() {
      gM.paint(); gD.paint();
      const one = mode === "one";
      sB.disabled = one; sI.disabled = one;
      if (one) cur = 1;
      sB.value = B; sI.max = nB(); sI.value = cur; oB.textContent = nB(); oI.textContent = cur;
      cvL.draw(); cvR.draw(); cvA.draw();
      const b = nB(), m = F[cur - 1], oobFrac = m.oob.filter(Boolean).length / m.oob.length;
      out.innerHTML = `${one ? "az egy fa" : `${az(cur)}. fa`}: teszt <b>${pct(S.tree[cur - 1])}</b>` +
        (one ? "" : ` · OOB ${az(cur)}. fánál: <b>${m.oob.filter(Boolean).length}/${m.oob.length}</b> pont (${pct(oobFrac)}; várható ≈ 36,8%)`) +
        `<br>együttes (${b} fa): teszt <b>${pct(S.ens[b - 1])}</b>` + (one ? "" : ` · OOB-pontosság <b>${Number.isFinite(S.oob[b - 1]) ? pct(S.oob[b - 1]) : "–"}</b> · egy fa átlagosan <b>${pct(mean(S.tree.slice(0, b)))}</b>`) +
        `<br><span class="muted">${one ? "Egyetlen teljes fa minden zajos pontot külön szigettel követ (nagy variancia). Válts baggingre!" :
          mode === "bag" ? "A fák átlaga simább határt ad. A véletlen erdő a fákat még jobban „szétkorrelálja”." :
            "Vágásonként csak egy véletlen jellemző: az egyes fák gyengébbek, de jobban különböznek – a szavazásuk annál többet ér."}</span>`;
    }
    data(); fit(); sync();
  };

  /* ------------------------------------------------------------------
     7.4  boosting-steps – gradiens boosting lépésről lépésre (1D regresszió)
     ------------------------------------------------------------------ */
  W["boosting-steps"] = root => {
    header(root, "Gradiens boosting lépésről lépésre",
      "Zajos szinusz (szaggatott: $\\sin(2\\pi x)$), 30 tanító pont. Kezdetben $F_0$ = a $y$-ok átlaga. Minden lépésben egy kis fa ($h_M$) illeszkedik a " +
      "<b>maradékokra</b> ($y - F_{M-1}$), és $F_M = F_{M-1} + \\eta\\, h_M$. Nyomd a „+1 fa” gombot, és figyeld, hogyan fogynak a maradékok!");
    let M = 0, eta = 1, depth = 1, showRes = true;
    const gen = (n, seed) => { const r = mulberry32(seed), xs = Array.from({ length: n }, () => r()).sort((a, b) => a - b); return { xs, ys: xs.map(x => Math.sin(2 * Math.PI * x) + 0.3 * gauss(r)) }; };
    const tr = gen(30, 5), te = gen(200, 55), X = tr.xs.map(x => [x]);
    const MAXM = 300;
    let G, mse;
    function fit() {
      G = gradientBoost(X, tr.ys, { M: MAXM, eta, maxDepth: depth });
      const Ftr = tr.xs.map(() => G.F0), Fte = te.xs.map(() => G.F0);
      const ms = (F, D) => mean(F.map((f, i) => (f - D.ys[i]) ** 2));
      mse = { tr: [ms(Ftr, tr)], te: [ms(Fte, te)] };
      G.trees.forEach(t => {
        tr.xs.forEach((x, i) => (Ftr[i] += eta * predictTree(t, [x])));
        te.xs.forEach((x, i) => (Fte[i] += eta * predictTree(t, [x])));
        mse.tr.push(ms(Ftr, tr)); mse.te.push(ms(Fte, te));
      });
    }
    const set = m => { M = Math.max(0, Math.min(MAXM, m)); sync(); };
    const sM = slider(0, MAXM, 1, M), oM = h("b");
    sM.addEventListener("input", () => set(+sM.value));
    const gE = toggleGroup([[1, "η = 1"], [0.3, "η = 0,3"], [0.1, "η = 0,1"]], () => eta, v => { eta = +v; fit(); sync(); });
    const gD = toggleGroup([[1, "tönk (mélység 1)"], [2, "mélység 2"], [3, "mélység 3"]], () => depth, v => { depth = +v; fit(); sync(); });
    root.append(h("div", { class: "controls" }, btn("+1 fa", () => set(M + 1), "btn primary"), btn("+10 fa", () => set(M + 10)), btn("↺", () => set(0)),
      h("label", null, "M = ", oM, sM)),
      h("div", { class: "controls" }, gE.bs, gD.bs, h("label", null, checkbox(showRes, e => { showRes = e.target.checked; sync(); }), "maradékok")));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const cvE = Calc.canvas(root, 0.32);
    const out = h("div", { class: "readout" });
    root.append(out);
    const GX = Array.from({ length: 401 }, (_, k) => k / 400);
    cvL.draw = () => {
      const T = Calc.plot(cvL, { xmin: -0.03, xmax: 1.03, ymin: -2, ymax: 2, xstep: 0.2, ystep: 1 },
        [{ f: x => Math.sin(2 * Math.PI * x), color: "--muted", dash: [5, 4], width: 1.4, domain: [0, 1] }]);
      const { ctx } = cvL;
      if (showRes) tr.xs.forEach((x, i) => polyline(ctx, T, [[x, gbPredict(G, [x], M)], [x, tr.ys[i]]], css("--bad"), 1.4));
      polyline(ctx, T, GX.map(x => [x, gbPredict(G, [x], M)]), css("--accent"), 2.6);
      tr.xs.forEach((x, i) => dot(ctx, T.tx(x), T.ty(tr.ys[i]), 4, css("--setB")));
      tag(ctx, cvL, `F${sub(M)}(x)`);
    };
    cvR.draw = () => {
      const r = tr.xs.map((x, i) => tr.ys[i] - gbPredict(G, [x], Math.max(0, M - 1)));
      const Y = Math.max(0.3, ...r.map(Math.abs)) * 1.2;
      const T = Calc.plot(cvR, { xmin: -0.03, xmax: 1.03, ymin: -Y, ymax: Y, xstep: 0.2, yname: "maradék" }, []);
      const { ctx } = cvR;
      if (M > 0) {
        const t = G.trees[M - 1];
        polyline(ctx, T, GX.map(x => [x, predictTree(t, [x])]), css("--accent"), 2.6);
        if (eta < 1) polyline(ctx, T, GX.map(x => [x, eta * predictTree(t, [x])]), css("--accent"), 1.4, [5, 4]);
      }
      tr.xs.forEach((x, i) => dot(ctx, T.tx(x), T.ty(r[i]), 4, css("--bad")));
      tag(ctx, cvR, M > 0 ? `h${sub(M)} illesztése az y − F${sub(M - 1)} maradékokra` + (eta < 1 ? " (szaggatott: η·h)" : "") : "még nincs fa: maradék = y − F₀");
    };
    cvE.draw = () => {
      const top = 0.4, cl = v => Math.min(v, top), best = mse.te.indexOf(Math.min(...mse.te));   // M = 0-nál ~0,6–0,7: levágjuk
      const T = Calc.plot(cvE, { xmin: -5, xmax: MAXM + 40, ymin: 0, ymax: top, xstep: 50, ystep: 0.1, xname: "M (fák)", yname: "MSE" },
        [{ vline: M, color: "--muted", dash: [4, 4] }, { hline: 0.09, color: "--border", dash: [2, 3] }]);
      const { ctx } = cvE;
      polyline(ctx, T, mse.tr.map((v, m) => [m, cl(v)]), css("--accent"), 2.2);
      polyline(ctx, T, mse.te.map((v, m) => [m, cl(v)]), css("--bad"), 2.2);
      label(ctx, "zaj (0,09)", T.tx(MAXM - 10), T.ty(0.09) - 3, css("--muted"), "right", "11px system-ui, sans-serif");
      dot(ctx, T.tx(best), T.ty(mse.te[best]), 5, css("--bad"), true);
      label(ctx, "— tanító-MSE", T.tx(190), T.ty(top) + 16, css("--accent"));
      label(ctx, "— teszt-MSE (○ a legjobb)", T.tx(190), T.ty(top) + 31, css("--bad"));
    };
    const SUB = "₀₁₂₃₄₅₆₇₈₉";
    function sub(n) { return String(n).replace(/\d/g, d => SUB[d]); }
    function sync() {
      gE.paint(); gD.paint(); sM.value = M; oM.textContent = M;
      cvL.draw(); cvR.draw(); cvE.draw();
      const best = mse.te.indexOf(Math.min(...mse.te));
      out.innerHTML = `M = <b>${M}</b> · η = <b>${fmt(eta, 1)}</b> · fa mélysége ${depth} · tanító-MSE <b>${fmt(mse.tr[M], 4)}</b> · teszt-MSE <b>${fmt(mse.te[M], 4)}</b><br>` +
        `a legjobb teszt-MSE: <b>${fmt(mse.te[best], 4)}</b> az M = <b>${best}</b>. lépésnél (a zaj szintje 0,09)<br><span class="muted">` +
        (M === 0 ? "F₀ egy vízszintes egyenes: a tanító y-ok átlaga. A maradékok (piros szakaszok) mutatják, mennyit téved." :
          M > best + 30 && mse.te[M] > mse.te[best] * 1.1 ? "A tanítóhiba tovább csökken, de a teszthiba már nő: a fák a zajt tanulják (túlillesztés)." :
            eta < 1 ? "Kis η: lassabban, kisebb lépésekben javul – több fa kell, de a teszthiba-görbe laposabb és tűrőbb." :
              "Minden új fa a még megmaradt hibát javítja ki – a maradékok egyre kisebbek.") + "</span>";
    }
    fit(); sync();
  };

  /* ------------------------------------------------------------------
     Közös kontúrrajzoló (marching squares) az SVM-hez: f = level szintvonala
     ------------------------------------------------------------------ */
  function gridVals(cv, T, f, step) {
    const nx = Math.ceil(cv.w / step) + 1, ny = Math.ceil(cv.h / step) + 1, G = [];
    for (let i = 0; i < nx; i++) { const col = []; for (let j = 0; j < ny; j++) col.push(f([T.ix(i * step), T.iy(j * step)])); G.push(col); }
    return { G, step };
  }
  function contour(ctx, { G, step }, level, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash); ctx.beginPath();
    for (let i = 0; i + 1 < G.length; i++) for (let j = 0; j + 1 < G[0].length; j++) {
      const v = [G[i][j], G[i + 1][j], G[i + 1][j + 1], G[i][j + 1]].map(a => a - level);
      const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
      for (let e = 0; e < 4; e++) {
        const a = v[e], b = v[(e + 1) % 4];
        if ((a > 0) !== (b > 0)) { const t = a / (a - b), p = P[e], q = P[(e + 1) % 4]; pts.push([(p[0] + t * (q[0] - p[0])) * step, (p[1] + t * (q[1] - p[1])) * step]); }
      }
      if (pts.length >= 2) { ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); }
      if (pts.length === 4) { ctx.moveTo(...pts[2]); ctx.lineTo(...pts[3]); }
    }
    ctx.stroke(); ctx.restore();
  }

  /* ------------------------------------------------------------------
     7.6  svm-margin – a legszélesebb utca (lineáris és RBF-kernel)
     ------------------------------------------------------------------ */
  const SVM_PRESETS = {
    ex: { name: "kidolgozott példa", C: 1000, k: "lin", pts: [[1, 1, 0], [1, 3, 0], [3, 1, 1], [4, 3, 1]] },
    sep: { name: "szétválasztható", C: 1000, k: "lin", pts: [[1, 1.2, 0], [1.6, 2.6, 0], [0.8, 3.6, 0], [2.4, 4.2, 0], [2.2, 1.6, 0], [1.4, 4.8, 0],
      [4.4, 1, 1], [5.2, 2.2, 1], [4.2, 2.6, 1], [6, 3.4, 1], [5.4, 4.6, 1], [6.4, 1.4, 1]] },
    ovl: { name: "átfedő", C: 1, k: "lin", pts: [[1, 1.2, 0], [1.6, 2.6, 0], [0.8, 3.6, 0], [2.4, 4.2, 0], [2.2, 1.6, 0], [1.4, 4.8, 0], [3, 3, 0], [4.6, 2, 0],
      [4.4, 1, 1], [5.2, 2.2, 1], [4.2, 3.4, 1], [6, 3.4, 1], [5.4, 4.6, 1], [6.4, 1.4, 1], [3.2, 1.8, 1], [2.2, 3.2, 1]] },
    ring: { name: "kör", C: 10, k: "rbf", g: 1, pts: (() => {
      const P = [], r = mulberry32(21);
      for (let k = 0; k < 7; k++) { const a = 2 * Math.PI * k / 7 + 0.3, R = 0.35 + 0.55 * r(); P.push([3.5 + R * Math.cos(a), 2.75 + R * Math.sin(a), 1]); }
      for (let k = 0; k < 12; k++) { const a = 2 * Math.PI * k / 12, R = 2.1 + 0.4 * r(); P.push([3.5 + R * Math.cos(a), 2.75 + R * Math.sin(a), 0]); }
      return P.map(p => [+p[0].toFixed(2), +p[1].toFixed(2), p[2]]);
    })() }
  };
  W["svm-margin"] = root => {
    header(root, "SVM: a legszélesebb utca",
      "A <span style='color:var(--setB)'>■ pozitív</span> és a <span style='color:var(--setA)'>● negatív</span> pontokat egy olyan határ választja el, amely körül a lehető legszélesebb üres „utca” van. " +
      "Folytonos vonal: $f(\\mathbf{x}) = 0$; szaggatott (RBF-nél vékony): $f = \\pm 1$. Bekarikázva a <b>szupportvektorok</b>; piros keret: a margót megsértő pont ($y\\,f < 1$). " +
      "Húzd a pontokat, vagy kattints üres helyre egy új pontért!");
    let tool = "pos", kern = "lin", lgC = 3, lgG = 0, pts = [], model = null;
    const gT = toggleGroup([["pos", "+ pont"], ["neg", "− pont"], ["del", "törlés"]], () => tool, v => { tool = v; gT.paint(); });
    const gK = toggleGroup([["lin", "lineáris"], ["rbf", "RBF-kernel"]], () => kern, v => { kern = v; sync(); });
    const sC = slider(-2, 3, 0.1, lgC), oC = h("b"), sG = slider(-1, 1, 0.05, lgG), oG = h("b");
    sC.addEventListener("input", () => { lgC = +sC.value; sync(); });
    sG.addEventListener("input", () => { lgG = +sG.value; sync(); });
    const lG = h("label", null, "γ = ", oG, sG);
    const load = k => { const P = SVM_PRESETS[k]; pts = P.pts.map(([x, y, c]) => ({ x, y, c })); kern = P.k; lgC = Math.log10(P.C); lgG = Math.log10(P.g || 1); sC.value = lgC; sG.value = lgG; sync(); };
    const small = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
    root.append(h("div", { class: "controls" }, small("minta:"), Object.keys(SVM_PRESETS).map(k => btn(SVM_PRESETS[k].name, () => load(k)))),
      h("div", { class: "controls" }, small("kattintás:"), gT.bs, small("· kernel:"), gK.bs),
      h("div", { class: "controls" }, h("label", null, "C = ", oC, sC), lG));
    const cv = Calc.canvas(root, 0.8, 560);
    cv.c.style.cursor = "crosshair";
    const out = h("div", { class: "readout" });
    root.append(out);
    const V = { xmin: -0.25, xmax: 7.25, ymin: -0.25, ymax: 5.75, xname: "x₁", yname: "x₂" };
    const C = () => 10 ** lgC, gam = () => 10 ** lgG;
    const showNum = v => (v >= 100 ? fmt(v, 0) : v >= 1 ? fmt(v, 2) : fmt(v, 3));
    /* szupportvektor: α > 0, vagy a margón / azon belül fekszik (y·f ≤ 1). Az utóbbi kell, mert a duális megoldás nem
       egyértelmű: a kidolgozott példában az (1; 3) pont pontosan a margón van, de α = 0 is lehet (az sklearn 3 SV-t ad). */
    const isSV = i => model.alpha[i] > 1e-6 || (pts[i].c ? 1 : -1) * model.f([pts[i].x, pts[i].y]) <= 1 + 1e-3;
    function fit() {
      const ok = pts.some(p => p.c) && pts.some(p => !p.c);
      model = ok ? svmSMO(pts.map(p => [p.x, p.y]), pts.map(p => (p.c ? 1 : -1)), C(), kern === "rbf" ? { type: "rbf", gamma: gam() } : { type: "linear" }) : null;
    }
    let T = null;
    cv.draw = () => {
      T = Calc.plot(cv, V, []);
      const { ctx } = cv;
      if (model) {
        decisionMap(cv, T, V, (a, b) => sigma(1.5 * model.f([a, b])), 6);
        if (kern === "lin") {                           // egyenesek: w₁x₁ + w₂x₂ + b = szint
          const [w1, w2] = model.w, b = model.b;
          const line = lv => Math.abs(w2) > Math.abs(w1) ? [[V.xmin, (lv - b - w1 * V.xmin) / w2], [V.xmax, (lv - b - w1 * V.xmax) / w2]]
            : [[(lv - b - w2 * V.ymin) / w1, V.ymin], [(lv - b - w2 * V.ymax) / w1, V.ymax]];
          if (w1 || w2) {
            polyline(ctx, T, line(0), css("--text"), 2.4);
            polyline(ctx, T, line(1), css("--setB"), 2, [7, 5]);
            polyline(ctx, T, line(-1), css("--setA"), 2, [7, 5]);
          }
        } else {                                        // RBF: szintvonalak (a ±1 vékonyabban, mert a szaggatás itt nem látszana)
          const Gv = gridVals(cv, T, model.f, 4);
          contour(ctx, Gv, 0, css("--text"), 2.4);
          contour(ctx, Gv, 1, rgba(css("--setB"), 0.9), 1.3);
          contour(ctx, Gv, -1, rgba(css("--setA"), 0.9), 1.3);
        }
      }
      pts.forEach((p, i) => {
        mark(ctx, T, p.x, p.y, p.c, 6);
        if (!model) return;
        const m = (p.c ? 1 : -1) * model.f([p.x, p.y]);
        ctx.save();
        if (isSV(i)) { ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(T.tx(p.x), T.ty(p.y), 11, 0, 2 * Math.PI); ctx.stroke(); }
        if (m < 1 - 1e-3) { ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2.5; ctx.strokeRect(T.tx(p.x) - 8.5, T.ty(p.y) - 8.5, 17, 17); }
        ctx.restore();
      });
    };
    let drag = -1;
    cv.c.addEventListener("pointerdown", e => {
      if (!T) return;
      const [px, py] = evXY(cv, e);
      let k = -1, bd = 14;
      pts.forEach((p, i) => { const d = Math.hypot(T.tx(p.x) - px, T.ty(p.y) - py); if (d < bd) { bd = d; k = i; } });
      if (tool === "del") { if (k >= 0) { pts.splice(k, 1); sync(); } return; }
      if (k >= 0) { drag = k; cv.c.setPointerCapture(e.pointerId); return; }
      const x = T.ix(px), y = T.iy(py);
      if (x < V.xmin || x > V.xmax || y < V.ymin || y > V.ymax) return;
      pts.push({ x, y, c: tool === "pos" ? 1 : 0 }); sync();
    });
    cv.c.addEventListener("pointermove", e => {
      if (drag < 0) return;
      const [px, py] = evXY(cv, e);
      pts[drag].x = Math.max(0, Math.min(7, T.ix(px))); pts[drag].y = Math.max(0, Math.min(5.5, T.iy(py)));
      sync();
    });
    const end = () => { drag = -1; };
    cv.c.addEventListener("pointerup", end); cv.c.addEventListener("pointercancel", end);
    function sync() {
      gT.paint(); gK.paint();
      sG.disabled = kern !== "rbf"; lG.style.opacity = kern === "rbf" ? 1 : 0.45;
      oC.textContent = showNum(C()); oG.textContent = showNum(gam());
      fit(); cv.draw();
      if (!model) { out.innerHTML = `<span class="muted">Mindkét osztályból kell legalább egy pont.</span>`; return; }
      const m = pts.map(p => (p.c ? 1 : -1) * model.f([p.x, p.y]));
      const errs = m.filter(v => v < 0).length, xi = m.reduce((s, v) => s + Math.max(0, 1 - v), 0), nsv = pts.filter((_, i) => isSV(i)).length;
      let txt;
      if (kern === "lin") {
        const [w1, w2] = model.w, nw = Math.hypot(w1, w2);
        txt = `w = (<b>${fmt(w1, 2)}</b>; <b>${fmt(w2, 2)}</b>) · b = <b>${fmt(model.b, 2)}</b> · utcaszélesség 2/‖w‖ = <b>${fmt(2 / nw, 2)}</b><br>` +
          `szupportvektorok: <b>${nsv}</b> · tanítóhiba: <b>${errs}</b> · Σξ = <b>${fmt(xi, 2)}</b> · ½‖w‖² + C·Σξ = <b>${fmt(nw * nw / 2 + C() * xi, 2)}</b>`;
      } else txt = `szupportvektorok: <b>${nsv}</b> / ${pts.length} · tanítóhiba: <b>${errs}</b> · Σξ = <b>${fmt(xi, 2)}</b>`;
      txt += `<br><span class="muted">${kern === "rbf" ? (gam() > 3 ? "Nagy γ: minden pont csak a közvetlen környezetére hat – a határ „buborékos”, könnyen túlillesztett." :
        "Az RBF-kernellel a határ görbülhet: a kör alakú mintát is szétválasztja.") :
        C() >= 100 ? (errs || xi > 1e-3 ? "Nagy C, de a pontok nem választhatók szét egy egyenessel: a határ mindenáron a hibák ellen küzd." : "Nagy C ≈ kemény margó: az utcában egyetlen pont sincs, a határt csak a szupportvektorok tartják.") :
          "Kis C = puha margó: szélesebb utca, cserébe néhány pont belóghat vagy a rossz oldalra kerülhet."}</span>`;
      out.innerHTML = txt;
    }
    load("ex");
  };

  /* ------------------------------------------------------------------
     7.6  kernel-lift – 1D pontok felemelése a (x; x²) síkba
     ------------------------------------------------------------------ */
  W["kernel-lift"] = root => {
    header(root, "Az emelés: egy új jellemzővel egyenes is elég",
      "Hét pont az $x$ tengelyen. Egyetlen küszöb nem választja szét őket, mert a pozitívak középen vannak. Húzd az <b>emelés</b> csúszkát: minden pont $x^2$ magasra emelkedik. " +
      "Az $(x;\\,x^2)$ síkon már egy vízszintes egyenes is elválasztja őket.");
    let s = 0, preset = "in", anim = null;
    const XS = [-3, -2, -1, 0, 1, 2, 3];
    const lab = x => (preset === "in" ? Math.abs(x) <= 1 : Math.abs(x) >= 2) ? 1 : 0;
    const sS = slider(0, 1, 0.01, s), oS = h("b");
    sS.addEventListener("input", () => { s = +sS.value; cancelAnimationFrame(anim); sync(); });
    const gP = toggleGroup([["in", "+ ha |x| ≤ 1"], ["out", "+ ha |x| ≥ 2"]], () => preset, v => { preset = v; sync(); });
    const play = () => {
      cancelAnimationFrame(anim);
      const t0 = performance.now();
      const step = t => { s = Math.min(1, (t - t0) / 1500); sync(); if (s < 1) anim = requestAnimationFrame(step); };
      anim = requestAnimationFrame(step);
    };
    root.append(h("div", { class: "controls" }, gP.bs, h("label", null, "emelés s = ", oS, sS), btn("▶ emeld fel", play)));
    const cv = Calc.canvas(root, 0.55, 640);
    const out = h("div", { class: "readout" });
    root.append(out);
    cv.draw = () => {
      const T = Calc.plot(cv, { xmin: -3.6, xmax: 3.6, ymin: -0.8, ymax: 10, xstep: 1, ystep: 2, xname: "x", yname: s > 0 ? "x²" : " " }, []);
      const { ctx } = cv, done = s >= 0.99;
      if (s > 0) polyline(ctx, T, Array.from({ length: 121 }, (_, k) => { const x = -3.3 + 6.6 * k / 120; return [x, s * x * x]; }), css("--muted"), 1.2, [4, 4]);
      if (done) {
        const r = Math.sqrt(2.5), y0 = T.ty(0);
        ctx.save(); ctx.fillStyle = rgba(css(preset === "in" ? "--setB" : "--setA"), 0.25); ctx.fillRect(T.tx(-r), y0 - 7, T.tx(r) - T.tx(-r), 14); ctx.restore();
        polyline(ctx, T, [[-r, 0], [-r, 2.5]], css("--muted"), 1, [2, 3]); polyline(ctx, T, [[r, 0], [r, 2.5]], css("--muted"), 1, [2, 3]);
        polyline(ctx, T, [[-3.6, 2.5], [3.6, 2.5]], css("--accent"), 2.4);
        label(ctx, "x₂ = 2,5", T.tx(3.5), T.ty(2.5) - 4, css("--accent"), "right");
        label(ctx, "az (x; x²) térben egy egyenes elválasztja őket", T.tx(-3.5), T.ty(9.4), css("--accent"), "left", "600 13px system-ui, sans-serif");
        label(ctx, "|x| < √2,5 ≈ 1,58", T.tx(0), y0 + 22, css("--text"), "center", "600 12px system-ui, sans-serif");
      }
      XS.forEach(x => {
        if (s > 0) polyline(ctx, T, [[x, 0], [x, s * x * x]], css("--border"), 1.2);
        mark(ctx, T, x, s * x * x, lab(x), 7);
      });
    };
    function sync() {
      gP.paint(); sS.value = s; oS.textContent = fmt(s, 2);
      cv.draw();
      const inside = preset === "in";
      out.innerHTML = s < 0.99
        ? `pontok: ${XS.map(x => `(${fmt(x, 0)}; ${fmt(s * x * x, 2)})`).join(" ")}<br><span class="muted">${s === 0 ? "Az x tengelyen egyetlen küszöb sem jó: a " + (inside ? "pozitívak középen" : "negatívak középen") + " vannak, két oldalukon a másik osztály." : "Emeld tovább, egészen s = 1-ig!"}</span>`
        : `jellemzők: (x; x²) · elválasztó egyenes: x₂ = 2,5 · pozitív, ha x² ${inside ? "&lt;" : "&gt;"} 2,5<br><span class="muted">Visszavetítve az x tengelyre: ${inside ? "|x| &lt; 1,58 → pozitív" : "|x| &gt; 1,58 → pozitív"}. Az egyenes a magasabb dimenzióban „görbe” határ lett az eredetiben.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     7.7  classifier-zoo – ugyanaz az adat, hat modell
     ------------------------------------------------------------------ */
  function zooData(kind, n, seed) {
    if (kind === "moons") return moons(n, seed);
    const r = mulberry32(seed), out = [];
    for (let i = 0; i < n; i++) {
      let c = i % 2, x, y;
      if (kind === "circles") {
        if (c) { x = 5 + 0.7 * gauss(r); y = 3.5 + 0.7 * gauss(r); }
        else { const a = 2 * Math.PI * r(), R = 2.6 + 0.3 * gauss(r); x = 5 + R * Math.cos(a); y = 3.5 + R * Math.sin(a); }
      } else if (kind === "xor") {
        const s = r() < 0.5, cx = (c ? s : !s) ? 2.8 : 7.2, cy = s ? 2 : 5;
        x = cx + 0.9 * gauss(r); y = cy + 0.75 * gauss(r);
      } else {                                                          // átlós határ, kis zajjal
        x = 0.5 + 9 * r(); y = 0.5 + 6 * r();
        c = 0.7 * (x - 5) - (y - 3.5) + 0.35 * gauss(r) > 0 ? 1 : 0;
      }
      out.push({ x, y, c });
    }
    return out;
  }
  /* a hat modell: mindegyik (X, y) → p(x) ∈ [0; 1]; a kNN, a log. regresszió és az SVM standardizált jellemzőkön tanul */
  const ZOO = [
    ["kNN (k = 5)", (X, y) => { const S = standardize(X); return x => knnPredict(S.Z, y, S.f(x), 5); }],
    ["logisztikus regresszió", (X, y) => { const S = standardize(X), f = fitLogReg(S.Z, y); return x => f(S.f(x)); }],
    ["döntési fa (mélység ≤ 6)", (X, y) => { const t = buildTree(X, y, { maxDepth: 6 }); return x => predictTree(t, x); }],
    ["véletlen erdő (60 fa)", (X, y) => { const F = randomForest(X, y, { B: 60, maxFeatures: 1, seed: 77 }); return x => forestVote(F, x); }],
    ["gradiens boosting (100 fa)", (X, y) => { const g = gradientBoost(X, y, { M: 100, eta: 0.1, maxDepth: 2, loss: "log" }); return x => sigma(gbPredict(g, x)); }],
    ["SVM, RBF-kernel (C = 1, γ = 1)", (X, y) => { const S = standardize(X), m = svmSMO(S.Z, y.map(v => (v ? 1 : -1)), 1, { type: "rbf", gamma: 1 }); return x => sigma(2 * m.f(S.f(x))); }]
  ];
  W["classifier-zoo"] = root => {
    header(root, "Ugyanaz az adat, hat modell",
      "Válassz adatkészletet: mind a hat modell ugyanazon a 100 tanító ponton tanul, és ugyanazon a 400 teszt ponton mérjük. Figyeld a határok <b>alakját</b>: " +
      "a fák lépcsőznek, a logisztikus regresszió egyenest húz, a kNN és az SVM simán görbül.");
    const DS = [["moons", "holdak"], ["circles", "körök"], ["xor", "XOR (négy csoport)"], ["diag", "átlós határ"]];
    let ds = "moons", seed = 1;
    const gD = toggleGroup(DS, () => ds, v => { ds = v; sync(); });
    root.append(h("div", { class: "controls" }, gD.bs, btn("🎲 Új adat", () => { seed++; sync(); })));
    const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.8rem" });
    const out = h("div", { class: "readout" });
    root.append(grid, out);
    const V = { xmin: -0.3, xmax: 10.3, ymin: -0.3, ymax: 7.2 };
    const panels = ZOO.map(([name]) => {
      const p = h("div"), acc = h("div", { style: "font-family:var(--mono);font-size:.85rem;margin-top:.2rem" });
      p.append(h("div", { style: "font-weight:600;font-size:.9rem;margin-bottom:.2rem" }, name));
      grid.append(p);
      const cv = Calc.canvas(p, 0.72, 420);
      p.append(acc);
      return { cv, acc, f: null };
    });
    let tr = [], te = [];
    function drawPanel(P) {
      const T = Calc.plot(P.cv, { ...V, labels: false, grid: false }, []);
      decisionMap(P.cv, T, V, (a, b) => P.f([a, b]), 7);
      tr.forEach(p => mark(P.cv.ctx, T, p.x, p.y, p.c, 3.2));
    }
    function sync() {
      const t0 = performance.now();
      gD.paint();
      tr = zooData(ds, 100, seed * 101 + 1); te = zooData(ds, 400, seed * 101 + 50);
      const X = tr.map(p => [p.x, p.y]), y = tr.map(p => p.c);
      const res = panels.map((P, k) => {
        P.f = ZOO[k][1](X, y);
        P.cv.draw = () => drawPanel(P);
        P.cv.draw();
        const a = accOf(te, (u, v) => P.f([u, v])), at = accOf(tr, (u, v) => P.f([u, v]));
        P.acc.innerHTML = `teszt <b>${pct(a)}</b> · <span class="muted">tanító ${pct(at)}</span>`;
        return { name: ZOO[k][0], a };
      });
      const ms = performance.now() - t0;
      root.dataset.ms = ms.toFixed(0);
      const best = res.slice().sort((a, b) => b.a - a.a), worst = best[best.length - 1];
      out.innerHTML = `legjobb ezen az adaton: <b>${best[0].name}</b> (${pct(best[0].a)}) · leggyengébb: <b>${worst.name}</b> (${pct(worst.a)})<br><span class="muted">` +
        ({ moons: "A holdakon minden nemlineáris modell jó; az egyenes (log. regresszió) a két hold összefonódását nem tudja követni.",
          circles: "Kör alakú határ: egy egyenes semmit nem ér, a fák lépcsőkből rakják össze a kört, az RBF-kernel természetesen rajzolja.",
          xor: "XOR: egyetlen egyenes nem választja szét. Az első vágás itt alig javít – a mohó fa mégis megtalálja a második szinten.",
          diag: "Átlós egyenes határ: itt a legegyszerűbb, lineáris modell a nyerő; a fák az átlót csak lépcsőzve közelítik." })[ds] + "</span>";
    }
    sync();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
     ------------------------------------------------------------------ */
  function init() {
    document.querySelectorAll(".widget[data-widget]").forEach(root => {
      const f = W[root.dataset.widget];
      if (!f) return;
      try { f(root); math(root); }
      catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
