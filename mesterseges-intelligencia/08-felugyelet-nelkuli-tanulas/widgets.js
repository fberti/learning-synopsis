/* =========================================================
   Mesterséges intelligencia 8. fejezet – interaktív szemléltetések
   (felügyelet nélküli tanulás: k-közép, hierarchikus klaszterezés, DBSCAN,
   PCA, t-SNE/UMAP, anomáliák, ajánlórendszer)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 7. fejezet widgets.js-ének mintájára)
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
  const small = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  /* letiltott gomb: a style.css-ben nincs külön :disabled stílus, ezért itt halványítjuk */
  const setDis = (b, v) => { b.disabled = v; b.style.opacity = v ? 0.45 : ""; b.style.cursor = v ? "default" : ""; };

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* két vászon egymás mellett (keskeny képernyőn egymás alatt); min-width:0, hogy a rácscella összemehessen */
  function twoCanvas(root, aspect, aspectR = aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div", { style: "min-width:0" }), R = h("div", { style: "min-width:0" });
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspectR, 380), L, R, wrap];
  }
  /* vászon-koordináta egy egéreseményből */
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function polyline(ctx, T, pts, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, color, open = false, lw = 2) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
    ctx.restore();
  }
  function ring(ctx, x, y, r, color, lw = 2, dash = []) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.stroke(); ctx.restore();
  }
  /* középpont: rombusz, a szövegszínnel körberajzolva (világos és sötét témában is látszik) */
  function diamond(ctx, x, y, r, fill) {
    ctx.save(); ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--text"); ctx.stroke(); ctx.restore();
  }
  function cross(ctx, x, y, r, color, lw = 2) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath();
    ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x - r, y + r); ctx.lineTo(x + r, y - r); ctx.stroke(); ctx.restore();
  }
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  /* felirat a vászon jobb felső sarkában, háttérrel (hogy a térkép ne zavarja) */
  function tag(ctx, cv, txt, left = false) {
    ctx.save(); ctx.font = "700 12px system-ui, sans-serif";
    const w = ctx.measureText(txt).width + 10;
    ctx.fillStyle = rgba(css("--card"), 0.85); ctx.fillRect(left ? 30 : cv.w - w - 6, 6, w, 19);
    ctx.restore();
    label(ctx, txt, left ? 35 : cv.w - 11, 20, css("--text"), left ? "left" : "right", "700 12px system-ui, sans-serif");
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
  const hexRGB = c => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim()); if (!m) return [128, 128, 128]; const v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
  /* két szín keveréke (t = 0 → c1, t = 1 → c2) */
  function mix(c1, c2, t) {
    const a = hexRGB(c1), b = hexRGB(c2);
    return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0")).join("");
  }
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  /* keskeny (mobil) képernyőn a lapos segédgrafikonok magasabbak, hogy olvashatók maradjanak */
  const flatAspect = (root, a, aNarrow) => ((root.clientWidth || 760) < 520 ? aNarrow : a);
  /* szám rögzített tizedesjegyekkel (a táblázatban egységes szélességért), negatív szám zárójelben a szorzatokban */
  const fix = (x, d = 2) => x.toFixed(d).replace(".", ",").replace("-", "−");
  const par = (x, d = 2) => (x < 0 ? `(${fmt(x, d)})` : fmt(x, d));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const SUB = "₀₁₂₃₄₅₆₇₈₉";
  const sub = n => String(n).replace(/\d/g, d => SUB[d]);

  /* klaszterszínek: a téma halmazszínei + néhány rögzített, mindkét témában jól látható szín */
  const pal = () => [css("--setA"), css("--setB"), css("--setC"), css("--bad"), "#8b5cf6", "#ec4899", "#14b8a6", "#84cc16"];
  const cc = (P, k) => (k == null || k < 0 ? css("--muted") : P[k % P.length]);
  /* háttér-tartománytérkép: f(x, y) = a klaszter sorszáma (−1 = nincs) */
  function regionMap(cv, T, view, f, cell = 6, P = pal(), a = 0.13) {
    const { ctx, w, h: hh } = cv;
    for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
      const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2);
      if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) continue;
      const k = f(x, y);
      if (k == null || k < 0) continue;
      ctx.fillStyle = rgba(P[k % P.length], a);
      ctx.fillRect(px, py, cell, cell);
    }
  }
  /* egyenlő tengelyléptékű nézet: legalább [cx ± hx] × [cy ± hy] látszik, 1 egység mindkét irányban ugyanannyi pixel */
  function eqView(cv, cx, cy, hx, hy, extra = {}) {
    const Wd = cv.w - 8, Hd = cv.h - 8, s = Math.min(Wd / (2 * hx), Hd / (2 * hy));
    const ax = Wd / (2 * s), ay = Hd / (2 * s);
    return Object.assign({ xmin: cx - ax, xmax: cx + ax, ymin: cy - ay, ymax: cy + ay }, extra);
  }

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
  /* foltok: spec = [[cx, cy, sx, sy, n, forgatás (rad)], …] → [[x, y], …]; g = a folt sorszáma */
  function blobs(spec, seed) {
    const r = mulberry32(seed), X = [], g = [];
    spec.forEach(([cx, cy, sx, sy, n, rot = 0], k) => {
      const c = Math.cos(rot), s = Math.sin(rot);
      for (let i = 0; i < n; i++) { const a = sx * gauss(r), b = sy * gauss(r); X.push([cx + c * a - s * b, cy + s * a + c * b]); g.push(k); }
    });
    X.g = g;
    return X;
  }
  const uniform = (n, seed, box = [0.3, 9.7, 0.3, 6.7]) => { const r = mulberry32(seed); return Array.from({ length: n }, () => [box[0] + (box[1] - box[0]) * r(), box[2] + (box[3] - box[2]) * r()]); };
  /* két hold (az 5. fejezetből), a [0, 10] × [0, 7] tartományban; noise: zaj a hold „saját” egységében */
  function moons(n, seed, noise = 0.25) {
    const rnd = mulberry32(seed), out = [];
    for (let i = 0; i < n; i++) {
      const c = i % 2, t = Math.PI * rnd();
      let x = c ? 1 - Math.cos(t) : Math.cos(t), y = c ? 0.5 - Math.sin(t) : Math.sin(t);
      x += noise * gauss(rnd); y += noise * gauss(rnd);
      out.push([3.4 + 2.8 * x, 2.9 + 2.8 * y]);
    }
    return out;
  }
  const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  const dist = (a, b) => Math.sqrt(d2(a, b));
  /* standardizálás (átlag 0, szórás 1, a szórás 1/n-nel – mint az sklearn StandardScaler) */
  function standardize(X) {
    const mu = [0, 1].map(j => mean(X.map(p => p[j])));
    const sd = [0, 1].map(j => Math.sqrt(mean(X.map(p => (p[j] - mu[j]) ** 2))) || 1);
    return X.map(p => [(p[0] - mu[0]) / sd[0], (p[1] - mu[1]) / sd[1]]);
  }
  /* a fejezet futó példája: a „Lapozó” webes könyvesbolt vásárlói (vásárlás/hó, átlagos kosár ezer Ft) */
  const CUST = [["A", 2, 25], ["B", 3, 30], ["C", 2, 28], ["D", 12, 5], ["E", 15, 4], ["F", 11, 6], ["G", 3, 27], ["H", 14, 5], ["I", 7, 14], ["J", 8, 16], ["K", 6, 15]];
  const custX = () => CUST.map(c => [c[1], c[2]]);
  const custN = () => CUST.map(c => c[0]);
  /* nézet az adatok köré, margóval */
  function boundsView(X, m = 0.15, extra = {}) {
    const xs = X.map(p => p[0]), ys = X.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const dx = (x1 - x0) * m || 1, dy = (y1 - y0) * m || 1;
    return Object.assign({ xmin: x0 - dx, xmax: x1 + dx, ymin: y0 - dy, ymax: y1 + dy }, extra);
  }

  /* ------------------------------------------------------------------
     Közös mag: k-közép (Lloyd), k-means++, sziluett
     ------------------------------------------------------------------ */
  function nearest(p, C) {
    let best = 0, bd = Infinity;
    for (let j = 0; j < C.length; j++) { const d = d2(p, C[j]); if (d < bd) { bd = d; best = j; } }
    return best;
  }
  /* kezdő középpontok: "rand" = k különböző véletlen adatpont; "pp" = k-means++ (D²-arányos húzás) */
  function initCenters(X, k, how, rnd) {
    if (how === "rand") return shuffled([...X.keys()], rnd).slice(0, k).map(i => X[i].slice());
    const C = [X[Math.floor(rnd() * X.length)].slice()];
    while (C.length < k) {
      const D = X.map(p => Math.min(...C.map(c => d2(p, c)))), S = D.reduce((a, b) => a + b, 0);
      if (S <= 0) { C.push(X[Math.floor(rnd() * X.length)].slice()); continue; }
      let t = rnd() * S, i = 0;
      while (i < X.length - 1 && (t -= D[i]) > 0) i++;
      C.push(X[i].slice());
    }
    return C;
  }
  const assignAll = (X, C) => X.map(p => nearest(p, C));
  /* frissítés: minden középpont a saját pontjai átlagába; az üres klaszter középpontja helyben marad */
  function centersOf(X, lab, C) {
    const s = C.map(() => [0, 0, 0]);
    X.forEach((p, i) => { const t = s[lab[i]]; t[0] += p[0]; t[1] += p[1]; t[2]++; });
    const empty = [];
    const N = s.map((t, j) => (t[2] ? [t[0] / t[2], t[1] / t[2]] : (empty.push(j), C[j].slice())));
    return { C: N, empty };
  }
  const sseOf = (X, lab, C) => X.reduce((s, p, i) => s + d2(p, C[lab[i]]), 0);
  /* teljes Lloyd-futás egy kezdésből; hist = az SSE minden fél lépés után */
  function lloyd(X, C0, maxIt = 100) {
    let C = C0.map(c => c.slice()), lab = null, it = 0;
    const trail = C.map(c => [c.slice()]), hist = [];
    while (it < maxIt) {
      const nl = assignAll(X, C);
      if (lab && nl.every((v, i) => v === lab[i])) break;
      lab = nl; hist.push({ v: sseOf(X, lab, C), t: "a" });
      C = centersOf(X, lab, C).C; C.forEach((c, j) => trail[j].push(c.slice()));
      hist.push({ v: sseOf(X, lab, C), t: "u" }); it++;
    }
    return { C, lab, trail, hist, it, sse: sseOf(X, lab, C) };
  }
  /* a legjobb nInit futás közül (k-means++ kezdéssel, mint az sklearn) */
  function kmeansBest(X, k, nInit, seed, how = "pp") {
    const rnd = mulberry32(seed);
    let best = null;
    for (let r = 0; r < nInit; r++) { const res = lloyd(X, initCenters(X, k, how, rnd)); if (!best || res.sse < best.sse - 1e-12) best = res; }
    return best;
  }
  /* sziluett pontonként: s = (b − a) / max(a, b); egyelemű klaszter pontja: s = 0 */
  function silhouette(X, lab, k) {
    const n = X.length, cnt = Array(k).fill(0);
    lab.forEach(c => cnt[c]++);
    return X.map((p, i) => {
      const c = lab[i];
      if (cnt[c] <= 1) return 0;
      const sums = Array(k).fill(0);
      for (let j = 0; j < n; j++) if (j !== i) sums[lab[j]] += dist(p, X[j]);
      const a = sums[c] / (cnt[c] - 1);
      let b = Infinity;
      for (let q = 0; q < k; q++) if (q !== c && cnt[q] > 0) b = Math.min(b, sums[q] / cnt[q]);
      if (!Number.isFinite(b)) return 0;
      const m = Math.max(a, b);
      return m > 0 ? (b - a) / m : 0;
    });
  }

  const W = {};

  /* ------------------------------------------------------------------
     8.1  kmeans-steps – a k-közép lépésről lépésre
     ------------------------------------------------------------------ */
  const KM_DS = [["three", "három folt"], ["four", "négy folt"], ["moons", "holdak"], ["sizes", "eltérő méret"], ["own", "saját"]];
  const KM_K = { three: 3, four: 4, moons: 2, sizes: 3, own: 3 };
  function kmData(ds, seed) {
    if (ds === "three") return blobs([[2.6, 2.0, 0.65, 0.65, 20], [7.4, 2.3, 0.65, 0.65, 20], [5.0, 5.2, 0.65, 0.65, 20]], seed);
    if (ds === "four") return blobs([[1.8, 1.9, 0.42, 0.42, 15], [1.9, 5.0, 0.42, 0.42, 15], [6.5, 3.6, 0.42, 0.42, 15], [8.7, 3.4, 0.42, 0.42, 15]], seed + 100);
    if (ds === "moons") return moons(120, seed, 0.12);
    if (ds === "sizes") return blobs([[3.6, 3.5, 1.25, 1.25, 60], [8.1, 1.5, 0.3, 0.3, 12], [8.2, 5.5, 0.3, 0.3, 12]], seed + 200);
    return [];
  }
  W["kmeans-steps"] = root => {
    header(root, "A k-közép lépésről lépésre",
      "Két lépés váltakozik. <b>① Hozzárendelés:</b> minden pont a legközelebbi középponthoz (♦) kerül. <b>② Frissítés:</b> minden középpont a saját pontjai átlagába ugrik. " +
      "A háttér színe mutatja, melyik középpont van a legközelebb. A szaggatott vonal a középpontok eddigi útja. " +
      "Lent a $\\text{SSE} = \\sum_i \\lVert \\mathbf{x}_i - \\boldsymbol{\\mu}_{c(i)} \\rVert^2$ minden fél lépés után – figyeld: sosem nő!");
    const V = { xmin: -0.2, xmax: 10.2, ymin: -0.2, ymax: 7.2, xname: "x₁", yname: "x₂" };
    let ds = "three", seed = 1, k = 3, how = "rand", iseed = 1, own = [];
    let X = [], C = null, lab = null, trail = [], iter = 0, phase = "assign", hist = [], changed = null, done = false, note = "", runs = null;
    const gD = toggleGroup(KM_DS, () => ds, v => { if (ds === "own") own = X.slice(); ds = v; k = KM_K[v]; newData(); });
    const sK = slider(1, 6, 1, k), oK = h("b");
    sK.addEventListener("input", () => { k = +sK.value; restart(); });
    const gI = toggleGroup([["rand", "véletlen pontok"], ["pp", "k-means++"]], () => how, v => { how = v; restart(); });
    const bA = btn("① Hozzárendelés", () => { stepAssign(); sync(); }, "btn primary");
    const bU = btn("② Középpont-frissítés", () => { stepUpdate(); sync(); }, "btn primary");
    const bR = btn("▶ Futtatás a végéig", () => { runEnd(); sync(); });
    const bB = btn("10 újraindítás, a legjobb", () => { best10(); sync(); });
    const bN = btn("🎲 Új adat", () => { seed++; newData(); });
    root.append(h("div", { class: "controls" }, gD.bs, bN),
      h("div", { class: "controls" }, h("label", null, "k = ", oK, sK), small("kezdés:"), gI.bs, btn("↺ Új kezdés", () => { iseed++; restart(); })),
      h("div", { class: "controls" }, bA, bU, bR, bB));
    const cv = Calc.canvas(root, 0.71);
    const cvS = Calc.canvas(root, flatAspect(root, 0.3, 0.5));
    cvS.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    const rndInit = extra => mulberry32(iseed * 7919 + k * 31 + seed * 101 + extra);
    function newData() { X = ds === "own" ? own.slice() : kmData(ds, seed); restart(); }
    function clearRun() { lab = null; iter = 0; phase = "assign"; hist = []; changed = null; done = false; note = ""; runs = null; trail = C ? C.map(c => [c.slice()]) : []; }
    function restart() { C = X.length >= k ? initCenters(X, k, how, rndInit(0)) : null; clearRun(); sync(); }
    function stepAssign() {
      if (!C || done || phase !== "assign") return;
      const nl = assignAll(X, C);
      changed = lab ? nl.filter((v, i) => v !== lab[i]).length : X.length;
      if (lab && changed === 0) { done = true; note = ""; return; }
      lab = nl; hist.push({ v: sseOf(X, lab, C), t: "a" }); phase = "update"; note = "";
    }
    function stepUpdate() {
      if (!C || done || phase !== "update") return;
      const r = centersOf(X, lab, C);
      C = r.C; C.forEach((c, j) => trail[j].push(c.slice()));
      iter++; hist.push({ v: sseOf(X, lab, C), t: "u" }); phase = "assign";
      note = r.empty.length ? `Üres klaszter (${r.empty.map(j => j + 1).join(", ")}. középpont): nincs egyetlen pontja sem, ezért a középpontja helyben marad.` : "";
    }
    function runEnd() {
      let g = 0;
      while (!done && C && iter < 100 && g++ < 400) (phase === "assign" ? stepAssign : stepUpdate)();
      if (!done && iter >= 100) note = "100 iteráció után leállítottuk.";
    }
    function best10() {
      if (X.length < k) return;
      const R = [];
      for (let r = 1; r <= 10; r++) R.push(lloyd(X, initCenters(X, k, how, rndInit(1000 * r))));
      const b = R.reduce((a, c) => (c.sse < a.sse - 1e-9 ? c : a));
      C = b.C; lab = b.lab; trail = b.trail; iter = b.it; hist = b.hist.slice(); done = true; phase = "assign"; changed = 0; note = "";
      runs = R.map(r => r.sse).sort((a, b) => a - b);
    }
    let T = null;
    cv.draw = () => {
      T = Calc.plot(cv, V, []);
      const { ctx } = cv, P = pal(), r = cv.w < 500 ? 3.6 : 4.6;
      if (C) regionMap(cv, T, V, (x, y) => nearest([x, y], C), 6, P);
      trail.forEach((tr, j) => {
        if (tr.length < 2) return;
        polyline(ctx, T, tr, P[j % P.length], 1.6, [5, 4]);
        tr.slice(0, -1).forEach(c => dot(ctx, T.tx(c[0]), T.ty(c[1]), 3, P[j % P.length], true, 1.5));
      });
      X.forEach((p, i) => { dot(ctx, T.tx(p[0]), T.ty(p[1]), r + 1.3, css("--card")); dot(ctx, T.tx(p[0]), T.ty(p[1]), r, lab ? cc(P, lab[i]) : css("--muted")); });
      if (C) C.forEach((c, j) => diamond(ctx, T.tx(c[0]), T.ty(c[1]), cv.w < 500 ? 8 : 10, P[j % P.length]));
      if (ds === "own" && X.length < Math.max(k, 1))
        label(ctx, X.length ? `Még ${k - X.length} pont kell (k = ${k}).` : "Kattints a síkra: új pont. Shift + kattintás vagy jobb gomb: törlés.",
          cv.w / 2, 26, css("--muted"), "center", "600 13px system-ui, sans-serif");
    };
    cvS.draw = () => {
      const n = hist.length, top = n ? Math.max(...hist.map(o => o.v)) : 1;
      const Ts = Calc.plot(cvS, { xmin: 0, xmax: Math.max(8, n) + 0.8, ymin: 0, ymax: top * 1.15, xstep: Math.max(1, Math.ceil(Math.max(8, n) / 12)), xname: "fél lépés", yname: "SSE" }, []);
      const { ctx } = cvS;
      if (!n) { label(ctx, "Az SSE az első hozzárendelés után jelenik meg.", cvS.w / 2, cvS.h / 2, css("--muted"), "center", "12px system-ui, sans-serif", "middle"); return; }
      polyline(ctx, Ts, hist.map((o, i) => [i + 1, o.v]), css("--muted"), 1.6);
      hist.forEach((o, i) => dot(ctx, Ts.tx(i + 1), Ts.ty(o.v), 4, o.t === "a" ? css("--accent") : css("--setC")));
      const x0 = Math.max(60, cvS.w - 190);
      label(ctx, "● hozzárendelés után", x0, 18, css("--accent"), "left", "600 11px system-ui, sans-serif");
      label(ctx, "● frissítés után", x0, 33, css("--setC"), "left", "600 11px system-ui, sans-serif");
    };
    cv.c.addEventListener("contextmenu", e => { if (ds === "own") e.preventDefault(); });
    cv.c.addEventListener("pointerdown", e => {
      if (ds !== "own" || !T) return;
      const [px, py] = evXY(cv, e);
      if (e.button === 2 || e.shiftKey) {
        let bi = -1, bd = 22;
        X.forEach((p, i) => { const d = Math.hypot(T.tx(p[0]) - px, T.ty(p[1]) - py); if (d < bd) { bd = d; bi = i; } });
        if (bi < 0) return;
        X.splice(bi, 1);
      } else {
        const x = T.ix(px), y = T.iy(py);
        if (x < 0 || x > 10 || y < 0 || y > 7) return;
        X.push([x, y]);
      }
      own = X.slice();
      if (!C || C.length !== k || X.length < k) C = X.length >= k ? initCenters(X, k, how, rndInit(0)) : null;
      clearRun(); sync();
    });
    function sync() {
      gD.paint(); gI.paint(); sK.value = k; oK.textContent = k;
      setDis(bN, ds === "own");
      setDis(bA, !C || done || phase !== "assign"); setDis(bU, !C || done || phase !== "update");
      setDis(bR, !C || done); setDis(bB, !C);
      cv.draw(); cvS.draw();
      if (!C) { out.innerHTML = `<span class="muted">Legalább k = ${k} pont kell a kezdéshez.</span>`; return; }
      const sse = lab ? sseOf(X, lab, C) : NaN;
      let s = `iteráció: <b>${iter}</b> · ` + (done ? `<b>Megállt: a hozzárendelés nem változott.</b>` : `következő lépés: <b>${phase === "assign" ? "① hozzárendelés" : "② frissítés"}</b>`) +
        `<br>SSE (klaszteren belüli négyzetösszeg): <b>${lab ? fmt(sse, 2) : "–"}</b> · a legutóbbi hozzárendelésben klasztert váltott: <b>${changed == null ? "–" : changed}</b> pont`;
      if (note) s += `<br>${note}`;
      if (runs) s += `<br>10 újraindítás SSE-je (növekvő sorrendben): ${runs.map((v, i) => (i ? fmt(v, 2) : `<b>${fmt(v, 2)}</b>`)).join(" · ")}<br>` +
        `<span class="muted">${runs[9] - runs[0] > 1e-6 * Math.max(1, runs[0]) ? "A futások különböző lokális optimumba jutottak – a legkisebb SSE-jűt tartjuk meg (ezt látod)." : "Mind a 10 futás ugyanoda jutott."}</span>`;
      const hint = { four: "Négy folt: véletlen kezdéssel gyakran két középpont jut egy foltba, egy másik pedig két foltot fog össze – ez lokális optimum. Próbáld az „Új kezdés” gombot, a k-means++-t vagy a 10 újraindítást!",
        moons: "A k-közép egyenes határokkal (Voronoi-cellákkal) vág: a két holdat semmilyen kezdéssel nem választja szét.",
        sizes: "Eltérő méret: a határ félúton van két középpont között, ezért a nagy, szétterülő folt széléről pontok kerülhetnek a kicsikhez.",
        three: "Három jól elváló folt: a k-közép néhány lépésben megtalálja őket.",
        own: "Saját adat: kattintással pontot adsz hozzá; a futás ilyenkor elölről indul (a középpontok maradnak)." }[ds];
      s += `<br><span class="muted">${hint}</span>`;
      out.innerHTML = s;
    }
    newData();
  };

  /* ------------------------------------------------------------------
     8.1  elbow-plot – hány klaszter? könyök és sziluett
     ------------------------------------------------------------------ */
  const EL_DS = [["b3", "3 folt"], ["b5", "5 folt"], ["aniso", "2 elnyúlt folt"], ["noise", "egyenletes zaj"]];
  function elData(ds) {
    if (ds === "b3") return blobs([[2.5, 2.0, 0.6, 0.6, 40], [7.5, 2.3, 0.6, 0.6, 40], [5.0, 5.3, 0.6, 0.6, 40]], 11);
    if (ds === "b5") return blobs([[1.8, 1.7, 0.45, 0.45, 25], [5.0, 1.5, 0.45, 0.45, 25], [8.2, 2.0, 0.45, 0.45, 25], [3.1, 5.2, 0.45, 0.45, 25], [7.0, 5.3, 0.45, 0.45, 25]], 12);
    if (ds === "aniso") return blobs([[4.4, 4.1, 1.75, 0.28, 60, 0.6], [5.6, 2.9, 1.75, 0.28, 60, 0.6]], 13);
    return uniform(120, 14);
  }
  /* piros (s < 0) → szürke (s = 0) → zöld (s > 0) */
  const silColor = s => (s < 0 ? mix(css("--muted"), css("--bad"), Math.min(1, -s * 1.6)) : mix(css("--muted"), css("--ok"), Math.min(1, s * 1.2)));
  W["elbow-plot"] = root => {
    header(root, "Hány klaszter? – könyök és sziluett",
      "Minden $k = 1, \\dots, 8$ értékre lefut a k-közép (k-means++, 10 kezdésből a legjobb). Jobbra fent az SSE, lent az átlagos sziluett $k$ függvényében. " +
      "Kattints egy $k$-ra a görbén (vagy húzd a csúszkát), és nézd meg balra a felosztást! A ★ jelöli a legnagyobb átlagos sziluettet.");
    let ds = "b3", k = 3, perPoint = false;
    const gD = toggleGroup(EL_DS, () => ds, v => { ds = v; compute(); sync(); });
    const sK = slider(1, 8, 1, k), oK = h("b");
    sK.addEventListener("input", () => { k = +sK.value; sync(); });
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, h("label", null, "k = ", oK, sK), h("label", null, checkbox(perPoint, e => { perPoint = e.target.checked; sync(); }), "sziluett pontonként")));
    const wrap = h("div", { class: "two-canvas" }), L = h("div", { style: "min-width:0" }), R = h("div", { style: "min-width:0" });
    wrap.append(L, R); root.append(wrap);
    const cvL = Calc.canvas(L, 0.8, 380), cvE = Calc.canvas(R, 0.39, 380), cvS = Calc.canvas(R, 0.39, 380);
    cvS.c.style.marginTop = "6px";
    const out = h("div", { class: "readout" });
    root.append(out);
    const V = { xmin: -0.2, xmax: 10.2, ymin: -0.2, ymax: 7.2, xname: "x₁", yname: "x₂" };
    let X = [], res = [], bestK = 2;
    function compute() {
      X = elData(ds);
      res = [null];
      for (let kk = 1; kk <= 8; kk++) {
        const r = kmeansBest(X, kk, 10, 500 + kk);
        r.sil = kk > 1 ? silhouette(X, r.lab, kk) : X.map(() => 0);
        r.silMean = kk > 1 ? mean(r.sil) : NaN;
        res.push(r);
      }
      bestK = 2;
      for (let kk = 3; kk <= 8; kk++) if (res[kk].silMean > res[bestK].silMean) bestK = kk;
    }
    cvL.draw = () => {
      const T = Calc.plot(cvL, V, []), { ctx } = cvL, P = pal(), r = res[k], rad = cvL.w < 330 ? 3 : 3.8;
      if (!perPoint) regionMap(cvL, T, V, (x, y) => nearest([x, y], r.C), 7, P, 0.1);
      X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), rad, perPoint ? silColor(k > 1 ? r.sil[i] : 0) : cc(P, r.lab[i])));
      r.C.forEach((c, j) => diamond(ctx, T.tx(c[0]), T.ty(c[1]), 7, perPoint ? css("--card") : P[j % P.length]));
      tag(ctx, cvL, perPoint ? `k = ${k}: sziluett pontonként` : `k = ${k}`);
    };
    const pickK = (cv, e, T) => { const [px] = evXY(cv, e); k = clamp(Math.round(T.ix(px)), 1, 8); sync(); };
    let TE = null, TS = null;
    cvE.draw = () => {
      const top = res[1].sse * 1.12;
      TE = Calc.plot(cvE, { xmin: 0.3, xmax: 8.7, ymin: 0, ymax: top, xstep: 1, ystep: niceStep(top), xname: "k", yname: "SSE" }, []);
      const { ctx } = cvE;
      polyline(ctx, TE, [[k, 0], [k, top]], css("--muted"), 1.2, [4, 4]);
      polyline(ctx, TE, res.slice(1).map((r, i) => [i + 1, r.sse]), css("--accent"), 2.2);
      res.slice(1).forEach((r, i) => dot(ctx, TE.tx(i + 1), TE.ty(r.sse), i + 1 === k ? 6 : 3.5, css("--accent"), i + 1 === k));
    };
    cvS.draw = () => {
      const lo = Math.min(0, ...res.slice(2).map(r => r.silMean)) - 0.02;
      TS = Calc.plot(cvS, { xmin: 0.3, xmax: 8.7, ymin: lo, ymax: 1.05, xstep: 1, ystep: 0.2, xname: "k", yname: "átlagos sziluett" }, []);
      const { ctx } = cvS;
      polyline(ctx, TS, [[k, lo], [k, 1.05]], css("--muted"), 1.2, [4, 4]);
      polyline(ctx, TS, res.slice(2).map((r, i) => [i + 2, r.silMean]), css("--setC"), 2.2);
      res.slice(2).forEach((r, i) => dot(ctx, TS.tx(i + 2), TS.ty(r.silMean), i + 2 === k ? 6 : 3.5, css("--setC"), i + 2 === k));
      label(ctx, "★", TS.tx(bestK), TS.ty(res[bestK].silMean) - 7, css("--setB"), "center", "700 16px system-ui, sans-serif");
      if (k === 1) label(ctx, "k = 1: nincs értelmezve", TS.tx(1.2), TS.ty(0.15), css("--muted"), "left", "11px system-ui, sans-serif");
    };
    cvE.c.addEventListener("pointerdown", e => TE && pickK(cvE, e, TE));
    cvS.c.addEventListener("pointerdown", e => TS && pickK(cvS, e, TS));
    cvE.c.style.cursor = cvS.c.style.cursor = "pointer";
    function sync() {
      gD.paint(); sK.value = k; oK.textContent = k;
      cvL.draw(); cvE.draw(); cvS.draw();
      const r = res[k];
      let s = `k = <b>${k}</b> · SSE = <b>${fmt(r.sse, 1)}</b>`;
      if (k > 1) s += ` · az SSE csökkenése (k = ${k - 1} → ${k}): <b>${pct((res[k - 1].sse - r.sse) / res[k - 1].sse, 0)}</b>`;
      s += ` · átlagos sziluett: <b>${k > 1 ? fmt(r.silMean, 2) : "–"}</b>`;
      if (perPoint && k > 1) s += `<br>negatív sziluettű (valószínűleg rossz helyen lévő) pontok: <b>${r.sil.filter(v => v < 0).length}</b>`;
      const hint = {
        b3: `Az SSE k = 3-ig meredeken esik, utána alig: ott a könyök. A sziluett is k = ${bestK}-nál a legnagyobb.`,
        b5: `Öt folt: a könyök k = 5-nél van, de kevésbé éles, mint három foltnál. A sziluett k = ${bestK}-nál a legnagyobb.`,
        aniso: `Két elnyúlt folt: a k-közép kerek, hasonló méretű csoportokat keres, ezért k = 2-nél keresztbe vágja őket (nézd meg balra!). A könyök elmosódik; a sziluett k = ${bestK}-nál a legnagyobb – a szám sem menti meg a rossz alakot.`,
        noise: `Az SSE itt is folyamatosan csökken – könyök nincs, a sziluett végig alacsony (${fmt(Math.min(...res.slice(2).map(o => o.silMean)), 2)} és ${fmt(Math.max(...res.slice(2).map(o => o.silMean)), 2)} között), kiugró csúcs nélkül: nincs valódi klaszterszerkezet.`
      }[ds];
      s += `<br><span class="muted">${hint}${perPoint ? " Pontonként: zöld = jó helyen (s ≈ 1), szürke = két klaszter határán (s ≈ 0), piros = inkább a szomszéd klaszterbe illene (s &lt; 0)." : ""}</span>`;
      out.innerHTML = s;
    }
    compute(); sync();
  };
  /* „szép” rácslépés egy tartományhoz (kb. 4–6 osztás) */
  function niceStep(span, n = 5) {
    const t = span / n, p = Math.pow(10, Math.floor(Math.log10(t)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= t) return m * p;
    return 10 * p;
  }

  /* ------------------------------------------------------------------
     8.2  dendrogram – összevonó (agglomeratív) klaszterezés
     ------------------------------------------------------------------ */
  const DG_DS = [["three", "három csoport"], ["chain", "lánc"], ["dens", "eltérő sűrűség"], ["cust", "vásárlók"]];
  function dgData(ds) {
    if (ds === "three") return blobs([[2.2, 2.0, 0.5, 0.5, 6], [7.6, 2.2, 0.5, 0.5, 6], [5.0, 5.4, 0.5, 0.5, 6]], 21);
    if (ds === "chain") {
      /* két folt, köztük egy sűrű pontsor („híd”): a hídon a szomszédos pontok közelebb vannak egymáshoz, mint a foltok pontjai */
      const X = blobs([[1.8, 3.5, 0.45, 0.45, 8], [8.2, 3.5, 0.45, 0.45, 8]], 22), r = mulberry32(23);
      for (let k = 0; k < 9; k++) X.push([2.75 + 0.56 * k, 3.5 + 0.35 * Math.sin(k * 0.9) + 0.04 * gauss(r)]);
      return X;
    }
    if (ds === "dens") return blobs([[2.6, 3.6, 0.3, 0.3, 10], [7.0, 3.5, 1.15, 1.15, 9]], 24);
    return standardize(custX());
  }
  /* naiv O(n³) összevonás; merges[i] = { a, b (csúcsazonosítók), h (magasság), m (tagok), near (legközelebbi pár), def (a kapcsolást meghatározó pár) } */
  function agglomerate(X, link) {
    const n = X.length, D = X.map(p => X.map(q => dist(p, q)));
    const cen = m => [mean(m.map(i => X[i][0])), mean(m.map(i => X[i][1]))];
    let cl = X.map((p, i) => ({ id: i, m: [i] }));
    const merges = [];
    function linkD(A, B) {
      let mn = Infinity, mx = -1, s = 0, near = null, far = null;
      for (const i of A.m) for (const j of B.m) {
        const d = D[i][j]; s += d;
        if (d < mn) { mn = d; near = [i, j]; }
        if (d > mx) { mx = d; far = [i, j]; }
      }
      let v, def;
      if (link === "single") { v = mn; def = [X[near[0]], X[near[1]]]; }
      else if (link === "complete") { v = mx; def = [X[far[0]], X[far[1]]]; }
      else {
        const a = cen(A.m), b = cen(B.m);
        def = [a, b];
        v = link === "average" ? s / (A.m.length * B.m.length) : Math.sqrt(2 * A.m.length * B.m.length / (A.m.length + B.m.length) * d2(a, b));
      }
      return { v, near, def };
    }
    while (cl.length > 1) {
      let best = null, bi = 0, bj = 1;
      for (let i = 0; i < cl.length; i++) for (let j = i + 1; j < cl.length; j++) {
        const L = linkD(cl[i], cl[j]);
        if (!best || L.v < best.v - 1e-12) { best = L; bi = i; bj = j; }
      }
      const A = cl[bi], B = cl[bj], m = A.m.concat(B.m);
      merges.push({ a: A.id, b: B.id, h: best.v, m, near: best.near, def: best.def });
      cl.splice(bj, 1); cl[bi] = { id: n + merges.length - 1, m };
    }
    return merges;
  }
  W["dendrogram"] = root => {
    header(root, "Összevonás lépésről lépésre – dendrogram",
      "Kezdetben minden pont külön klaszter. Minden lépésben a két <b>legközelebbi</b> klasztert vonjuk össze – hogy mi a „legközelebbi”, azt a <b>kapcsolás</b> dönti el. " +
      "Jobbra a dendrogram: az összevonás magassága = a két klaszter távolsága. Húzd a szaggatott vágóvonalat (vagy a csúszkákat): ahány ágat elvág, annyi klaszter lesz. " +
      "Ward-kapcsolásnál a magasság az összevonás miatti SSE-növekedésből számolt távolság: $\\sqrt{2\\,\\Delta\\text{SSE}}$ (a scipy szokása).");
    let ds = "three", link = "single", m = 0, cut = 0, X = [], merges = [], names = null;
    const gD = toggleGroup(DG_DS, () => ds, v => { ds = v; compute(true); sync(); });
    const gL = toggleGroup([["single", "egyszerű (single)"], ["complete", "teljes (complete)"], ["average", "átlagos (average)"], ["ward", "Ward"]], () => link, v => { link = v; compute(false); sync(); });
    const sM = slider(0, 1, 1, 0), oM = h("b"), sC = slider(0, 1000, 1, 0), oC = h("b");
    sM.addEventListener("input", () => { setM(+sM.value); sync(); });
    sC.addEventListener("input", () => { setCut(+sC.value / 1000 * hTop()); sync(); });
    root.append(h("div", { class: "controls" }, small("adat:"), gD.bs), h("div", { class: "controls" }, small("kapcsolás:"), gL.bs),
      h("div", { class: "controls" }, h("label", null, "összevonások: ", oM, sM), h("label", null, "vágási magasság: ", oC, sC)));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const out = h("div", { class: "readout" });
    root.append(out);
    let V = null;
    const hTop = () => merges[merges.length - 1].h * 1.08;
    function compute(newData) {
      if (newData) { X = dgData(ds); names = ds === "cust" ? custN() : null; }
      merges = agglomerate(X, link);
      V = ds === "cust" ? boundsView(X, 0.12, { xname: "vásárlás/hó (std.)", yname: "kosár (std.)" }) : { xmin: -0.2, xmax: 10.2, ymin: -0.2, ymax: 7.2, xname: "x₁", yname: "x₂" };
      sM.max = X.length - 1;
      setM(newData ? 0 : Math.min(m, X.length - 1));
    }
    /* m összevonás után a vágás a m. és az (m + 1). magasság közé kerül */
    function setM(v) {
      m = v;
      const H = merges.map(o => o.h), n1 = H.length;
      cut = m === 0 ? H[0] / 2 : m >= n1 ? (H[n1 - 1] + hTop()) / 2 : (H[m - 1] + H[m]) / 2;
    }
    function setCut(c) { cut = clamp(c, 0, hTop()); m = merges.filter(o => o.h <= cut + 1e-12).length; }
    /* m összevonás utáni állapot: aktív csúcsok, színük, pontonkénti klaszter */
    function state() {
      const n = X.length, act = new Set([...Array(n).keys()]);
      for (let i = 0; i < m; i++) { act.delete(merges[i].a); act.delete(merges[i].b); act.add(n + i); }
      const members = id => (id < n ? [id] : merges[id - n].m);
      const ids = [...act].filter(id => id >= n).sort((a, b) => pos[members(a)[0]] - pos[members(b)[0]]);
      const col = {}, lab = Array(n).fill(-1);
      ids.forEach((id, c) => { col[id] = c; members(id).forEach(i => (lab[i] = c)); });
      /* a dendrogram csúcsainak színe: a vágás alatti részfák a klaszterük színét kapják */
      const nodeCol = {};
      const paint = (id, c) => { nodeCol[id] = c; if (id >= n) { paint(merges[id - n].a, c); paint(merges[id - n].b, c); } };
      ids.forEach(id => paint(id, col[id]));
      return { lab, k: act.size, nodeCol };
    }
    let pos = [];
    function leafOrder() {
      const n = X.length, order = [];
      const walk = id => (id < n ? order.push(id) : (walk(merges[id - n].a), walk(merges[id - n].b)));
      walk(2 * n - 2);
      pos = Array(n); order.forEach((id, i) => (pos[id] = i + 1));
      return order;
    }
    cvL.draw = () => {
      const T = Calc.plot(cvL, V, []), { ctx } = cvL, P = pal(), S = state(), n = X.length;
      for (let i = 0; i < m; i++) {
        const [a, b] = merges[i].near;
        polyline(ctx, T, [X[a], X[b]], cc(P, S.lab[a]), 1.6);
      }
      if (m > 0) {
        const M = merges[m - 1];
        polyline(ctx, T, M.def, css("--text"), 2.4, [6, 4]);
        if (link === "average" || link === "ward") M.def.forEach(c => cross(ctx, T.tx(c[0]), T.ty(c[1]), 5, css("--text"), 2));
      }
      X.forEach((p, i) => {
        dot(ctx, T.tx(p[0]), T.ty(p[1]), 6.5, css("--card"));
        dot(ctx, T.tx(p[0]), T.ty(p[1]), 5.2, cc(P, S.lab[i]));
        if (names) label(ctx, names[i], T.tx(p[0]) + 7, T.ty(p[1]) - 4, css("--text"), "left", "700 12px system-ui, sans-serif");
      });
      if (m > 0) {
        const M = merges[m - 1];
        M.m.forEach(i => ring(ctx, T.tx(X[i][0]), T.ty(X[i][1]), 9, css("--text"), 1.5));
        /* a legutóbbi összevonás távolsága: címke a két klaszter fölött, háttérrel */
        const mx = clamp((T.tx(M.def[0][0]) + T.tx(M.def[1][0])) / 2, 30, cvL.w - 30), my = Math.max(24, Math.min(...M.m.map(i => T.ty(X[i][1]))) - 14);
        ctx.save(); ctx.font = "700 12px system-ui, sans-serif"; const t = "d = " + fmt(M.h, 2), tw = ctx.measureText(t).width + 8;
        ctx.fillStyle = rgba(css("--card"), 0.9); ctx.fillRect(mx - tw / 2, my - 15, tw, 18); ctx.restore();
        label(ctx, t, mx, my, css("--text"), "center", "700 12px system-ui, sans-serif");
      }
      tag(ctx, cvL, `${n - m} klaszter`);
    };
    let TD = null;
    cvR.draw = () => {
      const n = X.length, top = hTop(), S = state(), P = pal();
      const xmin = -34 * (n + 0.6) / Math.max(60, cvR.w - 42);      // ~34 px hely a bal oldali skálának
      TD = Calc.plot(cvR, { xmin, xmax: n + 0.6, ymin: -top * 0.09, ymax: top, grid: false, labels: false }, []);
      const { ctx } = cvR, T = TD;
      /* függőleges skála */
      const st = niceStep(top, 4);
      for (let v = st; v < top; v += st) {
        polyline(ctx, T, [[0, v], [n + 0.6, v]], css("--border"), 1);
        label(ctx, fmt(v, 2), T.tx(0) - 4, T.ty(v), css("--muted"), "right", "11px system-ui, sans-serif", "middle");
      }
      const xOf = {}, yOf = {};
      for (let i = 0; i < n; i++) { xOf[i] = pos[i]; yOf[i] = 0; }
      merges.forEach((M, i) => {
        const id = n + i, xa = xOf[M.a], xb = xOf[M.b];
        xOf[id] = (xa + xb) / 2; yOf[id] = M.h;
        const newest = i === m - 1, below = i < m;
        const col = below ? cc(P, S.nodeCol[id]) : css("--muted");
        polyline(ctx, T, [[xa, yOf[M.a]], [xa, M.h], [xb, M.h], [xb, yOf[M.b]]], col, newest ? 3.6 : below ? 2 : 1.4);
        if (newest) dot(ctx, T.tx(xOf[id]), T.ty(M.h), 4.5, css("--text"));
      });
      for (let i = 0; i < n; i++) {
        const c = S.lab[i] >= 0 ? cc(P, S.lab[i]) : css("--muted");
        dot(ctx, T.tx(pos[i]), T.ty(0), 3, c);
        if (names) label(ctx, names[i], T.tx(pos[i]), T.ty(0) + 4, css("--text"), "center", "700 11px system-ui, sans-serif", "top");
      }
      /* vágóvonal */
      polyline(ctx, T, [[xmin, cut], [n + 0.6, cut]], css("--text"), 2, [7, 4]);
      ctx.save(); ctx.font = "700 11px system-ui, sans-serif";
      const ct = `vágás: ${fmt(cut, 2)} → ${n - m} klaszter`, cw = ctx.measureText(ct).width + 8, cy = Math.max(18, T.ty(cut) - 4);
      ctx.fillStyle = rgba(css("--card"), 0.9); ctx.fillRect(cvR.w - cw - 2, cy - 14, cw, 16); ctx.restore();
      label(ctx, ct, cvR.w - 6, cy, css("--text"), "right", "700 11px system-ui, sans-serif");
    };
    let drag = false;
    cvR.c.style.cursor = "ns-resize";
    cvR.c.addEventListener("pointerdown", e => { if (!TD) return; drag = true; cvR.c.setPointerCapture(e.pointerId); setCut(TD.iy(evXY(cvR, e)[1])); sync(); });
    cvR.c.addEventListener("pointermove", e => { if (!drag) return; setCut(TD.iy(evXY(cvR, e)[1])); sync(); });
    const end = () => { drag = false; };
    cvR.c.addEventListener("pointerup", end); cvR.c.addEventListener("pointercancel", end);
    const nameOf = idx => (names ? "{" + idx.map(i => names[i]).sort().join(", ") + "}" : `${idx.length} pont`);
    function sync() {
      gD.paint(); gL.paint();
      leafOrder();
      const n = X.length;
      sM.value = m; oM.textContent = `${m} / ${n - 1}`;
      sC.value = Math.round(cut / hTop() * 1000); oC.textContent = fmt(cut, 2);
      cvL.draw(); cvR.draw();
      let s = `összevonások: <b>${m}</b> / ${n - 1} · klaszterek száma a vágásnál: <b>${n - m}</b>`;
      if (m > 0) {
        const M = merges[m - 1], sa = M.a < n ? [M.a] : merges[M.a - n].m, sb = M.b < n ? [M.b] : merges[M.b - n].m;
        s += `<br>legutóbbi összevonás: ${nameOf(sa)} + ${nameOf(sb)}, távolság (magasság): <b>${fmt(M.h, 2)}</b>`;
      }
      if (m < n - 1) s += ` · következő összevonás: <b>${fmt(merges[m].h, 2)}</b>`;
      const hint = {
        single: "Egyszerű kapcsolás: két klaszter távolsága a legközelebbi pontpárjuk távolsága. Láncolódik: egy pontsor „hidat” ver két csoport közé (próbáld a „lánc” adaton!).",
        complete: "Teljes kapcsolás: a legtávolabbi pontpár számít. Kompakt, nagyjából azonos átmérőjű csoportokat ad.",
        average: "Átlagos kapcsolás: az összes pontpár távolságának átlaga – az egyszerű és a teljes közötti kompromisszum.",
        ward: "Ward: azt a két klasztert vonja össze, amelyek egyesítése a legkevésbé növeli az SSE-t. Hasonló méretű, gömbölyű csoportokat ad – mint a k-közép."
      }[link];
      s += `<br><span class="muted">${hint}${m > 0 ? " A pontok képén a szaggatott szakasz mutatja, mi határozta meg a legutóbbi összevonás távolságát" + (link === "single" ? " (a legközelebbi pár)." : link === "complete" ? " (a legtávolabbi pár)." : " (a két klaszter középpontja, ×)." ) : ""}</span>`;
      out.innerHTML = s;
    }
    compute(true); sync();
  };

  /* ------------------------------------------------------------------
     8.2  dbscan-explorer – sűrűség alapú klaszterezés
     ------------------------------------------------------------------ */
  const DB_DS = [["moons", "holdak + zaj"], ["rings", "körök"], ["dens", "eltérő sűrűség"], ["blobs", "foltok + zaj"]];
  const DB_DEF = { moons: [0.6, 5], rings: [0.45, 5], dens: [0.4, 5], blobs: [0.5, 5] };
  function dbData(ds) {
    if (ds === "moons") return moons(150, 31, 0.1).concat(uniform(15, 32));
    if (ds === "rings") {
      const r = mulberry32(33), X = [];
      for (let i = 0; i < 220; i++) {
        const outer = i >= 70, a = 2 * Math.PI * (outer ? (i - 70 + r()) / 150 : (i + r()) / 70), R = (outer ? 2.8 : 1.2) + 0.1 * gauss(r);
        X.push([5 + R * Math.cos(a), 3.5 + R * Math.sin(a)]);
      }
      return X;
    }
    if (ds === "dens") return blobs([[2.8, 3.5, 0.35, 0.35, 70], [7.0, 3.5, 1.1, 1.1, 40]], 34);
    return blobs([[2.2, 2.0, 0.5, 0.5, 40], [7.6, 2.3, 0.5, 0.5, 40], [5.0, 5.3, 0.5, 0.5, 40]], 35).concat(uniform(20, 36));
  }
  /* DBSCAN: minPts a pontot magát is beleszámolja (mint az sklearn). type: 2 = mag, 1 = határ, 0 = zaj */
  function dbscan(X, eps, minPts) {
    const n = X.length, e2 = eps * eps, nb = X.map(p => { const o = []; for (let j = 0; j < n; j++) if (d2(p, X[j]) <= e2) o.push(j); return o; });
    const core = nb.map(o => o.length >= minPts), lab = Array(n).fill(-1);
    let c = 0;
    for (let i = 0; i < n; i++) {
      if (!core[i] || lab[i] >= 0) continue;
      lab[i] = c; const q = [i];
      while (q.length) {
        const p = q.pop();
        if (!core[p]) continue;
        for (const j of nb[p]) if (lab[j] < 0) { lab[j] = c; q.push(j); }
      }
      c++;
    }
    const type = X.map((_, i) => (core[i] ? 2 : lab[i] >= 0 ? 1 : 0));
    return { lab, type, k: c, nb };
  }
  W["dbscan-explorer"] = root => {
    header(root, "Sűrűség alapján – DBSCAN",
      "Egy pont <b>magpont</b>, ha az $\\varepsilon$ sugarú környezetében (önmagát is beleszámolva) legalább <b>minPts</b> pont van. A szomszédos magpontok egy klaszterbe láncolódnak; " +
      "a magpont környezetébe eső többi pont <b>határpont</b> (üres karika), a maradék <b>zaj</b> (×). Vidd az egeret egy pont fölé: látod a környezetét. " +
      "Lent a k-távolság görbe (k = minPts − 1): a „könyöke” jó $\\varepsilon$-t sugall.");
    let ds = "moons", eps = 0.6, minPts = 5, cmp = false, hov = -1, X = [], R = null, KM = null;
    const gD = toggleGroup(DB_DS, () => ds, v => { ds = v; [eps, minPts] = DB_DEF[v]; X = dbData(ds); hov = -1; sync(); });
    const sE = slider(0.1, 2, 0.05, eps), oE = h("b"), sP = slider(2, 15, 1, minPts), oP = h("b");
    sE.addEventListener("input", () => { eps = +sE.value; sync(); });
    sP.addEventListener("input", () => { minPts = +sP.value; sync(); });
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, h("label", null, "ε = ", oE, sE), h("label", null, "minPts = ", oP, sP)),
      h("div", { class: "controls" }, h("label", null, checkbox(cmp, e => { cmp = e.target.checked; layout(); sync(); }), "k-közép összehasonlításként (k = a talált klaszterek száma)")));
    const wrap = h("div"), L = h("div", { style: "min-width:0" }), Rr = h("div", { style: "min-width:0" });
    wrap.append(L, Rr); root.append(wrap);
    const cvL = Calc.canvas(L, 0.71, 760), cvR = Calc.canvas(Rr, 0.71, 380);
    const cvK = Calc.canvas(root, flatAspect(root, 0.28, 0.5));
    cvK.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    function layout() {
      wrap.className = cmp ? "two-canvas" : "";
      Rr.style.display = cmp ? "" : "none";
      cvL.resize(); if (cmp) cvR.resize();
    }
    const V = { xmin: -0.2, xmax: 10.2, ymin: -0.2, ymax: 7.2, xname: "x₁", yname: "x₂" };
    let T = null;
    function drawPts(cv, T, lab, type) {
      const { ctx } = cv, P = pal(), r = cv.w < 500 ? 3.6 : 4.4;
      X.forEach((p, i) => {
        const x = T.tx(p[0]), y = T.ty(p[1]);
        if (type && type[i] === 0) cross(ctx, x, y, r * 0.8, css("--muted"), 1.6);
        else if (type && type[i] === 1) dot(ctx, x, y, r, cc(P, lab[i]), true, 1.8);
        else dot(ctx, x, y, r, cc(P, lab[i]));
      });
    }
    cvL.draw = () => {
      T = Calc.plot(cvL, V, []);
      const { ctx } = cvL;
      if (hov >= 0) {
        const p = X[hov], rx = T.tx(p[0] + eps) - T.tx(p[0]), ry = T.ty(p[1]) - T.ty(p[1] + eps);
        ctx.save(); ctx.beginPath(); ctx.ellipse(T.tx(p[0]), T.ty(p[1]), rx, ry, 0, 0, 2 * Math.PI);
        ctx.fillStyle = rgba(css("--accent"), 0.12); ctx.fill(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
      }
      drawPts(cvL, T, R.lab, R.type);
      if (hov >= 0) {
        R.nb[hov].forEach(j => j !== hov && ring(ctx, T.tx(X[j][0]), T.ty(X[j][1]), 7, css("--text"), 1.4));
        ring(ctx, T.tx(X[hov][0]), T.ty(X[hov][1]), 8, css("--accent"), 2.4);
      }
      tag(ctx, cvL, `DBSCAN: ${R.k} klaszter`);
    };
    cvR.draw = () => {
      if (!cmp || !KM) return;
      const Tr = Calc.plot(cvR, V, []);
      regionMap(cvR, Tr, V, (x, y) => nearest([x, y], KM.C), 7, pal(), 0.1);
      drawPts(cvR, Tr, KM.lab, null);
      KM.C.forEach((c, j) => diamond(cvR.ctx, Tr.tx(c[0]), Tr.ty(c[1]), 7, pal()[j % 8]));
      tag(cvR.ctx, cvR, `k-közép, k = ${KM.C.length}`);
    };
    let kd = [];
    cvK.draw = () => {
      const n = kd.length, top = Math.max(eps * 1.25, Math.min(2.2, kd[n - 1] * 1.05));
      const Tk = Calc.plot(cvK, { xmin: 0, xmax: n * 1.03, ymin: 0, ymax: top, ystep: niceStep(top, 4), xname: "pontok (rendezve)", yname: `távolság a ${minPts - 1}. szomszédig` }, []);
      const { ctx } = cvK;
      polyline(ctx, Tk, kd.map((v, i) => [i + 0.5, Math.min(v, top)]), css("--accent"), 2.2);
      polyline(ctx, Tk, [[0, eps], [n * 1.03, eps]], css("--bad"), 1.8, [6, 4]);
      label(ctx, `ε = ${fmt(eps, 2)}`, 34, Tk.ty(eps) - 4, css("--bad"), "left", "700 11px system-ui, sans-serif");
    };
    cvL.c.addEventListener("pointermove", e => {
      if (!T) return;
      const [px, py] = evXY(cvL, e);
      let bi = -1, bd = 14;
      X.forEach((p, i) => { const d = Math.hypot(T.tx(p[0]) - px, T.ty(p[1]) - py); if (d < bd) { bd = d; bi = i; } });
      if (bi !== hov) { hov = bi; cvL.draw(); readout(); }
    });
    cvL.c.addEventListener("pointerleave", () => { if (hov >= 0) { hov = -1; cvL.draw(); readout(); } });
    function readout() {
      const nc = R.type.filter(t => t === 2).length, nbd = R.type.filter(t => t === 1).length, nz = R.type.filter(t => t === 0).length;
      let s = `ε = <b>${fmt(eps, 2)}</b> · minPts = <b>${minPts}</b> · klaszterek: <b>${R.k}</b> · zajpontok: <b>${nz}</b> · magpontok: <b>${nc}</b> · határpontok: <b>${nbd}</b>` +
        `<br>a k-távolság görbén az ε-vonal fölött <b>${kd.filter(v => v > eps).length}</b> pont van: ezek nem magpontok`;
      if (hov >= 0) s += `<br>a kijelölt pont: <b>${["zaj", "határpont", "magpont"][R.type[hov]]}</b>, szomszédok száma (önmagával): <b>${R.nb[hov].length}</b>` +
        (R.type[hov] === 1 ? " – kevés, de egy magpont környezetében van" : R.type[hov] === 0 ? " – kevés, és egyetlen magpont környezetében sincs" : "");
      else s += `<br><span class="muted">Vidd az egeret (vagy koppints) egy pontra!</span>`;
      const hint = R.k === 0 ? "Egyetlen magpont sincs: az ε túl kicsi, vagy a minPts túl nagy." :
        R.k === 1 && X.length - nz > 0.9 * X.length ? "Egyetlen klaszter: az ε túl nagy – minden összefolyt." :
          ({ moons: "A DBSCAN a holdak alakját követi, és a szórt pontokat zajnak jelöli – a k-közép (kapcsold be!) egyenesen kettévágja őket.",
            rings: "Két koncentrikus kör: sűrűség alapján szétválnak, a k-közép viszont „tortaszeletekre” vágja őket.",
            dens: "Eltérő sűrűség: egyetlen ε nem jó mindkét foltra – kis ε-nál a ritka folt zajjá esik szét, nagy ε-nál a sűrű folt mellé zaj is bekerül.",
            blobs: "Foltok és zaj: a zajpontokat a k-közép kénytelen valamelyik klaszterhez sorolni, a DBSCAN kihagyja őket." })[ds];
      s += `<br><span class="muted">${hint}</span>`;
      out.innerHTML = s;
    }
    function sync() {
      gD.paint(); sE.value = eps; sP.value = minPts; oE.textContent = fmt(eps, 2); oP.textContent = minPts;
      R = dbscan(X, eps, minPts);
      kd = X.map((p, i) => { const d = X.map(q => dist(p, q)).sort((a, b) => a - b); return d[Math.min(minPts - 1, d.length - 1)]; }).sort((a, b) => a - b);
      KM = cmp ? kmeansBest(X, Math.max(2, R.k), 10, 77) : null;
      cvL.draw(); cvR.draw(); cvK.draw();
      readout();
    }
    X = dbData(ds); layout(); sync();
  };

  /* ------------------------------------------------------------------
     8.3  pca-projection – vetítés egy irányra
     ------------------------------------------------------------------ */
  const PCA_DS = [["four", "négy pont"], ["tilt", "ferde felhő"], ["round", "kerek felhő"], ["cust", "vásárlók"], ["custs", "vásárlók (std.)"]];
  function pcaData(ds) {
    let X;
    if (ds === "four") X = [[-2, -2], [-1, 1], [1, -1], [2, 2]];
    else if (ds === "tilt") X = blobs([[0, 0, 2.0, 0.55, 60, Math.PI / 6]], 41);
    else if (ds === "round") X = blobs([[0, 0, 1.3, 1.3, 60]], 42);
    else if (ds === "cust") X = custX();
    else X = standardize(custX());
    const mx = mean(X.map(p => p[0])), my = mean(X.map(p => p[1]));
    return X.map(p => [p[0] - mx, p[1] - my]);
  }
  /* kovariancia (1/n), sajátértékek, az 1. főkomponens szöge (fokban, [0; 180)) */
  function cov2(X) {
    const a = mean(X.map(p => p[0] * p[0])), b = mean(X.map(p => p[0] * p[1])), d = mean(X.map(p => p[1] * p[1]));
    const tr = a + d, disc = Math.sqrt((a - d) ** 2 / 4 + b * b);
    let ang = 0.5 * Math.atan2(2 * b, a - d) * 180 / Math.PI;
    ang = ((ang % 180) + 180) % 180;
    return { a, b, d, tr, l1: tr / 2 + disc, l2: tr / 2 - disc, ang };
  }
  W["pca-projection"] = root => {
    header(root, "Vetítés egy irányra – mennyi szórás marad?",
      "A (középre tolt) pontokat merőlegesen vetítjük az origón átmenő, $\\mathbf{u} = (\\cos\\theta;\\ \\sin\\theta)$ irányú egyenesre. " +
      "A vetületek varianciája $\\mathbf{u}^\\mathsf{T} C\\, \\mathbf{u}$; ami elvész, az a maradékok (szaggatott szakaszok) négyzetének átlaga. A kettő összege mindig az összes variancia. " +
      "Forgasd az egyenest (csúszka, vagy húzd a vásznon), és keresd meg, hol a legnagyobb a vetített variancia!");
    let ds = "four", th = 20, showRes = true, anim = null, X = [], S = null;
    const gD = toggleGroup(PCA_DS, () => ds, v => { ds = v; load(); sync(); });
    const sT = slider(0, 179, 1, th), oT = h("b");
    sT.addEventListener("input", () => { cancelAnimationFrame(anim); th = +sT.value; sync(); });
    const goPC = () => {
      cancelAnimationFrame(anim);
      const from = th, diff = ((S.ang - from + 270) % 180) - 90, t0 = performance.now();
      const step = t => { const s = Math.min(1, (t - t0) / 600), e = 1 - (1 - s) ** 3; th = ((from + diff * e) % 180 + 180) % 180; if (s >= 1) th = S.ang; sync(); if (s < 1) anim = requestAnimationFrame(step); };
      anim = requestAnimationFrame(step);
    };
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, h("label", null, "θ = ", oT, sT), btn("Keresd meg az 1. főkomponenst", goPC, "btn primary"),
        h("label", null, checkbox(showRes, e => { showRes = e.target.checked; sync(); }), "maradékok mutatása")));
    const cv = Calc.canvas(root, 0.66, 640);
    const cvV = Calc.canvas(root, flatAspect(root, 0.35, 0.6), 640);
    cvV.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    const names = () => (ds === "cust" || ds === "custs" ? custN() : null);
    function load() { X = pcaData(ds); S = cov2(X); }
    const varAt = deg => { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return S.a * c * c + 2 * S.b * c * s + S.d * s * s; };
    let T = null;
    cv.draw = () => {
      const mx = Math.max(...X.map(p => Math.abs(p[0]))) * 1.18 + 0.3, my = Math.max(...X.map(p => Math.abs(p[1]))) * 1.18 + 0.3;
      const ax = { four: ["x₁", "x₂"], tilt: ["x₁", "x₂"], round: ["x₁", "x₂"], cust: ["vásárlás/hó", "kosár (ezer Ft)"], custs: ["vásárlás/hó (std.)", "kosár (std.)"] }[ds];
      const V = eqView(cv, 0, 0, mx, my, { xname: ax[0], yname: ax[1] });
      T = Calc.plot(cv, V, []);
      const { ctx } = cv, t = th * Math.PI / 180, u = [Math.cos(t), Math.sin(t)], L = 2 * Math.hypot(V.xmax, V.ymax);
      polyline(ctx, T, [[-L * u[0], -L * u[1]], [L * u[0], L * u[1]]], css("--accent"), 2.2);
      /* a vetületek terjedelme és ±1 szórás a vonal mentén */
      const pr = X.map(p => p[0] * u[0] + p[1] * u[1]), sd = Math.sqrt(varAt(th));
      const lo = Math.min(...pr), hi = Math.max(...pr);
      polyline(ctx, T, [[lo * u[0], lo * u[1]], [hi * u[0], hi * u[1]]], rgba(css("--accent"), 0.3), 9);
      [-sd, sd].forEach(v => {
        const c = [v * u[0], v * u[1]], nx = -u[1] * 9, ny = u[0] * 9;
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.moveTo(T.tx(c[0]) - nx, T.ty(c[1]) + ny); ctx.lineTo(T.tx(c[0]) + nx, T.ty(c[1]) - ny); ctx.stroke(); ctx.restore();
      });
      if (showRes) X.forEach((p, i) => polyline(ctx, T, [p, [pr[i] * u[0], pr[i] * u[1]]], css("--bad"), 1.5, [4, 3]));
      X.forEach((p, i) => dot(ctx, T.tx(pr[i] * u[0]), T.ty(pr[i] * u[1]), 3.2, css("--accent"), true, 1.6));
      const nm = names(), r = X.length > 20 ? 4 : 5.5;
      X.forEach((p, i) => {
        dot(ctx, T.tx(p[0]), T.ty(p[1]), r, css("--setB"));
        if (nm) label(ctx, nm[i], T.tx(p[0]) + 7, T.ty(p[1]) - 3, css("--text"), "left", "700 12px system-ui, sans-serif");
      });
      tag(ctx, cv, `θ = ${fmt(th, 1)}°`);
    };
    cvV.draw = () => {
      const top = S.tr * 1.55;                                         // fent hely marad a jelmagyarázatnak
      const Tv = Calc.plot(cvV, { xmin: -4, xmax: 198, ymin: 0, ymax: top, xstep: 30, ystep: niceStep(top, 4), xname: "θ (°)", yname: "variancia" }, []);
      const { ctx } = cvV, G = Array.from({ length: 181 }, (_, d) => d);
      polyline(ctx, Tv, [[0, S.tr], [180, S.tr]], css("--muted"), 1.4, [6, 4]);
      polyline(ctx, Tv, G.map(d => [d, varAt(d)]), css("--accent"), 2.4);
      polyline(ctx, Tv, G.map(d => [d, S.tr - varAt(d)]), css("--bad"), 2.2);
      polyline(ctx, Tv, [[th, 0], [th, top]], css("--muted"), 1.2, [3, 3]);
      dot(ctx, Tv.tx(th), Tv.ty(varAt(th)), 5, css("--accent")); dot(ctx, Tv.tx(th), Tv.ty(S.tr - varAt(th)), 5, css("--bad"));
      const x0 = Math.max(70, cvV.w - 230);
      label(ctx, "— vetített variancia uᵀCu", x0, 16, css("--accent"), "left", "600 11px system-ui, sans-serif");
      label(ctx, "— maradék (elveszett) variancia", x0, 30, css("--bad"), "left", "600 11px system-ui, sans-serif");
      label(ctx, "- - összes variancia", x0, 44, css("--muted"), "left", "600 11px system-ui, sans-serif");
    };
    let drag = false;
    const fromPtr = e => { const [px, py] = evXY(cv, e), x = T.ix(px), y = T.iy(py); if (Math.hypot(x, y) < 1e-9) return; th = ((Math.atan2(y, x) * 180 / Math.PI) % 180 + 180) % 180; sync(); };
    cv.c.style.cursor = "grab";
    cv.c.addEventListener("pointerdown", e => { if (!T) return; cancelAnimationFrame(anim); drag = true; cv.c.setPointerCapture(e.pointerId); fromPtr(e); });
    cv.c.addEventListener("pointermove", e => { if (drag) fromPtr(e); });
    const end = () => { drag = false; };
    cv.c.addEventListener("pointerup", end); cv.c.addEventListener("pointercancel", end);
    function sync() {
      gD.paint(); sT.value = Math.round(th) % 180; oT.textContent = fmt(th, 1) + "°";
      cv.draw(); cvV.draw();
      const v = varAt(th), t = th * Math.PI / 180;
      const near = Math.abs(((th - S.ang + 270) % 180) - 90) < 0.5;
      let s = `u = (${fmt(Math.cos(t), 2)}; ${fmt(Math.sin(t), 2)}) · C = [[${fmt(S.a, 2)}; ${fmt(S.b, 2)}]; [${fmt(S.b, 2)}; ${fmt(S.d, 2)}]]` +
        `<br>vetített variancia: uᵀCu = <b>${fmt(v, 2)}</b> · maradék (rekonstrukciós hiba átlaga): <b>${fmt(S.tr - v, 2)}</b>` +
        `<br>összes variancia (nyom): <b>${fmt(S.tr, 2)}</b> · megmagyarázott arány: <b>${pct(v / S.tr, 1)}</b>` +
        `<br>sajátértékek: λ₁ = <b>${fmt(S.l1, 2)}</b>, λ₂ = <b>${fmt(S.l2, 2)}</b> · az 1. főkomponens szöge: <b>${fmt(S.ang, 1)}°</b> (λ₁ / nyom = ${pct(S.l1 / S.tr, 1)})`;
      const hint = near ? "Ez az 1. főkomponens: itt a legnagyobb a vetített variancia (= λ₁), és ugyanitt a legkisebb a maradék (= λ₂)." :
        ({ four: "Négy pont: a C mátrix sajátértékei 4 és 1. Próbáld ki a θ = 45°-ot és a θ = 135°-ot!",
          tilt: "Ferde felhő: a vetített variancia a felhő hossztengelye irányában a legnagyobb.",
          round: "Kerek felhő: minden irányban közel ugyanannyi a szórás – a görbe szinte lapos, az 1. főkomponens iránya itt alig mond valamit.",
          cust: `Nyers adat: a kosár (ezer Ft) varianciája (${fmt(S.d, 1)}) jóval nagyobb, mint a havi vásárlásoké (${fmt(S.a, 1)}), ezért az 1. főkomponens (${fmt(S.ang, 1)}°) közel áll a kosár tengelyéhez (90°). Nézd meg standardizálva is!`,
          custs: "Standardizálva mindkét jellemző varianciája 1 (a nyom 2), így már mindkettő számít; az 1. főkomponens a két jellemző (ellentétes előjelű) keveréke." })[ds];
      s += `<br><span class="muted">${hint}</span>`;
      out.innerHTML = s;
    }
    load(); sync();
  };

  /* ------------------------------------------------------------------
     8.4  digit-embedding – PCA, t-SNE és UMAP a kézzel írt számjegyeken
     ------------------------------------------------------------------ */
  const DIG_COL = ["#3b82f6", "#f97316", "#16a34a", "#ef4444", "#a855f7", "#b7791f", "#ec4899", "#64748b", "#84cc16", "#06b6d4"];
  const DIG_M = [["pca", "PCA"], ["tsne5", "t-SNE (perplexitás 5)"], ["tsne30", "t-SNE (perplexitás 30)"], ["tsne100", "t-SNE (perplexitás 100)"], ["tsne30b", "t-SNE (30, másik véletlen mag)"], ["umap", "UMAP"]];
  const DIG_NOTE = {
    pca: "PCA: lineáris vetítés; a 2 komponens a variancia ≈ 28%-át őrzi meg (15,1% + 13,4%). A számjegyek nagyrészt egymásra csúsznak.",
    tsne5: "Kis perplexitás: minden pont csak nagyon kevés szomszédot „néz”, ezért széttöredezett szigetek jönnek létre.",
    tsne30: "t-SNE: csak a helyi szomszédság számít – a csoportok mérete és egymástól mért távolsága nem értelmezhető.",
    tsne100: "Nagy perplexitás: több szomszédot vesz figyelembe – a csoportok tömörebbek, a térkép kevésbé töredezett. A távolságok így sem értelmezhetők.",
    tsne30b: "Ugyanaz a perplexitás, másik véletlen kezdés: a csoportok ugyanazok, de máshol, máshogy forgatva jelennek meg. A térkép elrendezése önmagában nem jelent semmit.",
    umap: "UMAP: gyorsabb, a globális szerkezetből is többet megőriz, és új pontot is el tud helyezni a kész térképen."
  };
  /* minden pont k legközelebbi (másik) pontja a síkon, távolság szerint növekvő sorrendben */
  function knnLists(P, k) {
    const n = P.length;
    return P.map((p, i) => {
      const bd = [], bi = [];
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const d = d2(p, P[j]);
        if (bd.length < k || d < bd[bd.length - 1]) {
          let t = bd.length < k ? bd.length : k - 1;
          while (t > 0 && bd[t - 1] > d) { bd[t] = bd[t - 1]; bi[t] = bi[t - 1]; t--; }
          bd[t] = d; bi[t] = j;
        }
      }
      return bi;
    });
  }
  /* 5-NN „hagyj ki egyet” pontosság: többségi szavazás, döntetlennél a legközelebbi szomszéd címkéje nyer */
  function knnAcc(P, y, k = 5) {
    const NB = knnLists(P, k);
    let ok = 0;
    NB.forEach((nb, i) => {
      const cnt = {};
      nb.forEach(j => (cnt[y[j]] = (cnt[y[j]] || 0) + 1));
      const mx = Math.max(...Object.values(cnt));
      const win = y[nb.find(j => cnt[y[j]] === mx)];
      if (win === y[i]) ok++;
    });
    return ok / P.length;
  }
  W["digit-embedding"] = root => {
    header(root, "800 kézzel írt számjegy két dimenzióban",
      "Minden pont egy 8 × 8 pixeles kép, azaz 64 jellemző. A módszerek <b>csak a pixeleket</b> látták, a számjegyet soha – a színezés utólagos. " +
      "Válts a módszerek között, és vidd az egeret (vagy koppints) egy pontra: megjelenik a kép, és bekarikázzuk az 5 legközelebbi szomszédját a térképen.");
    const D = window.DIGITS;
    if (!D || !D.y || !D.pca) { root.append(h("p", { class: "muted" }, "A számjegyek adatai (digits-data.js) nem töltődtek be, ezért ez a szemléltetés most nem működik.")); return; }
    const y = D.y, n = y.length;
    let meth = "tsne30", colorOn = true, sel = -1, hov = -1, anim = null, disp = D[meth].map(p => p.slice());
    const accC = {};
    const gM = toggleGroup(DIG_M, () => meth, v => switchTo(v));
    const lbs = [btn("mind", () => { sel = -1; sync(); })].concat(Array.from({ length: 10 }, (_, d) => {
      const b = btn([h("span", { style: `display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${DIG_COL[d]};margin-right:.3em` }), String(d)], () => { sel = sel === d ? -1 : d; sync(); });
      b.style.padding = ".25rem .55rem";
      return b;
    }));
    lbs[0].style.padding = ".25rem .55rem";
    root.append(h("div", { class: "controls" }, gM.bs),
      h("div", { class: "controls" }, h("label", null, checkbox(colorOn, e => { colorOn = e.target.checked; sync(); }), "színezés a valódi számjegy szerint")),
      h("div", { class: "controls", style: "gap:.3rem" }, small("kiemelés:"), lbs));
    const cv = Calc.canvas(root, 0.8, 640);
    const out = h("div", { class: "readout" });
    root.append(out);
    let tf = null;
    /* egyenlő léptékű transzformáció a megjelenített pontokhoz */
    function frame() {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      disp.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
      const pad = 12, s = Math.min((cv.w - 2 * pad) / (x1 - x0 || 1), (cv.h - 2 * pad) / (y1 - y0 || 1));
      const ox = (cv.w - s * (x1 - x0)) / 2, oy = (cv.h - s * (y1 - y0)) / 2;
      return { tx: x => ox + (x - x0) * s, ty: v => cv.h - oy - (v - y0) * s };
    }
    const colOf = i => (colorOn ? DIG_COL[y[i]] : css("--accent"));
    function nn5(i) { const d = disp.map((p, j) => [j === i ? Infinity : d2(p, disp[i]), j]).sort((a, b) => a[0] - b[0]); return d.slice(0, 5).map(o => o[1]); }
    cv.draw = () => {
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      tf = frame();
      const r = w < 500 ? 2.3 : 3;
      ctx.save();
      for (let i = 0; i < n; i++) {
        const f = sel >= 0 && y[i] !== sel;
        ctx.globalAlpha = f ? 0.12 : 0.85;
        ctx.fillStyle = colOf(i);
        ctx.beginPath(); ctx.arc(tf.tx(disp[i][0]), tf.ty(disp[i][1]), r, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.restore();
      if (hov >= 0) {
        const nb = nn5(hov), hx = tf.tx(disp[hov][0]), hy = tf.ty(disp[hov][1]);
        nb.forEach(j => { polyline(ctx, { tx: v => v, ty: v => v }, [[hx, hy], [tf.tx(disp[j][0]), tf.ty(disp[j][1])]], css("--text"), 1.2); ring(ctx, tf.tx(disp[j][0]), tf.ty(disp[j][1]), 6, css("--text"), 1.6); });
        dot(ctx, hx, hy, 5, colOf(hov)); ring(ctx, hx, hy, 8, css("--text"), 2.2);
        /* nagyított kép a pontoktól távolabbi sarokban */
        const S = clamp(Math.round(w * 0.18), 64, 104), c = S / 8, BW = Math.max(S, 104), left = hx > w / 2, top = hy > hh / 2;
        const bx = left ? 10 : w - BW - 10, by = top ? 10 : hh - S - 46;
        ctx.save();
        ctx.fillStyle = css("--card"); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
        ctx.fillRect(bx - 6, by - 6, BW + 12, S + 48); ctx.strokeRect(bx - 6, by - 6, BW + 12, S + 48);
        const px = D.px[hov], bg = css("--card"), ink = css("--text");
        for (let q = 0; q < 64; q++) { ctx.fillStyle = mix(bg, ink, parseInt(px[q], 16) / 15); ctx.fillRect(bx + (q % 8) * c, by + Math.floor(q / 8) * c, Math.ceil(c), Math.ceil(c)); }
        ctx.strokeStyle = css("--muted"); ctx.strokeRect(bx, by, S, S);
        ctx.restore();
        label(ctx, `valódi: ${y[hov]}`, bx, by + S + 18, colorOn ? DIG_COL[y[hov]] : css("--text"), "left", "700 13px system-ui, sans-serif");
        label(ctx, "szomsz.: " + nb.map(j => y[j]).join(" "), bx, by + S + 35, css("--text"), "left", "600 11px system-ui, sans-serif");
      }
    };
    function switchTo(v) {
      if (v === meth && !anim) return;
      cancelAnimationFrame(anim);
      const from = disp.map(p => p.slice()), to = D[v], t0 = performance.now();
      meth = v; hov = -1; sync(false);
      const step = t => {
        const s = Math.min(1, (t - t0) / 400), e = s < 0.5 ? 2 * s * s : 1 - (-2 * s + 2) ** 2 / 2;
        for (let i = 0; i < n; i++) { disp[i][0] = from[i][0] + (to[i][0] - from[i][0]) * e; disp[i][1] = from[i][1] + (to[i][1] - from[i][1]) * e; }
        cv.draw();
        anim = s < 1 ? requestAnimationFrame(step) : null;
      };
      anim = requestAnimationFrame(step);
    }
    const pick = e => {
      if (anim || !tf) return;
      const [px, py] = evXY(cv, e);
      let bi = -1, bd = 14;
      for (let i = 0; i < n; i++) { if (sel >= 0 && y[i] !== sel) continue; const d = Math.hypot(tf.tx(disp[i][0]) - px, tf.ty(disp[i][1]) - py); if (d < bd) { bd = d; bi = i; } }
      if (bi !== hov) { hov = bi; cv.draw(); readout(); }
    };
    cv.c.addEventListener("pointermove", pick);
    cv.c.addEventListener("pointerdown", pick);
    cv.c.addEventListener("pointerleave", () => { if (hov >= 0) { hov = -1; cv.draw(); readout(); } });
    function readout() {
      if (accC[meth] == null) accC[meth] = knnAcc(D[meth], y, 5);
      const name = DIG_M.find(m => m[0] === meth)[1];
      let s = `<b>${name}</b> · 5 legközelebbi szomszéd a térképen: <b>${pct(accC[meth], 1)}</b> ugyanaz a számjegy`;
      if (hov >= 0) { const nb = nn5(hov); s += `<br>kijelölt kép: valódi számjegy <b>${y[hov]}</b> · az 5 szomszéd: <b>${nb.map(j => y[j]).join(", ")}</b> (${nb.filter(j => y[j] === y[hov]).length}/5 egyezik)`; }
      if (sel >= 0) s += `<br>kiemelve: a(z) ${sel}-es számjegy (${y.filter(v => v === sel).length} kép)`;
      s += `<br><span class="muted">${DIG_NOTE[meth]}${colorOn ? "" : " Színezés nélkül látszik igazán: az algoritmus címkék nélkül is csoportokba rendezte a képeket."}</span>`;
      out.innerHTML = s;
    }
    function sync(redraw = true) {
      gM.paint();
      lbs.forEach((b, i) => b.classList.toggle("on", i - 1 === sel));
      if (redraw) cv.draw();
      readout();
    }
    sync();
  };

  /* ------------------------------------------------------------------
     8.5  anomaly-explorer – anomáliapontszámok
     ------------------------------------------------------------------ */
  const AN_DS = [["two", "két felhő + 8 anomália"], ["tilt", "ferde felhő"], ["cust", "vásárlók"]];
  function anData(ds) {
    if (ds === "two") {
      const X = blobs([[3.0, 2.5, 0.6, 0.6, 50], [7.0, 4.8, 0.7, 0.7, 50]], 51);
      const A = [[5.0, 3.7], [1.0, 6.2], [9.2, 1.0], [0.8, 0.7], [9.4, 6.5], [5.4, 6.4], [5.8, 1.0], [2.3, 5.3]];
      return { X: X.concat(A), truth: X.map(() => 0).concat(A.map(() => 1)), kC: 2, names: null, N: 8, k: 5 };
    }
    if (ds === "tilt") {
      const r = mulberry32(52), X = [];
      /* egyenletesen sűrű, keskeny sáv az átló mentén (t ∈ [−2; 2], merőleges zaj 0,2) */
      for (let i = 0; i < 140; i++) { const t = -2 + 4 * r(), o = 0.2 * gauss(r); X.push([5 + 1.9 * t - 0.565 * o, 3.5 + 1.3 * t + 0.825 * o]); }
      /* a hat anomália: mindkét jellemzőben átlagos, de messze az átlótól */
      const A = [[-1.2, 1.5], [-0.6, 1.7], [0.0, 1.6], [0.0, -1.6], [0.6, -1.7], [1.2, -1.5]].map(([t, o]) => [5 + 1.9 * t - 0.565 * o, 3.5 + 1.3 * t + 0.825 * o]);
      return { X: X.concat(A), truth: X.map(() => 0).concat(A.map(() => 1)), kC: 1, names: null, N: 6, k: 5 };
    }
    const X = standardize(custX().concat([[14, 28]]));
    return { X, truth: X.map((_, i) => (i === 11 ? 1 : 0)), kC: 3, names: custN().concat(["L"]), N: 1, k: 2 };
  }
  /* izolációs erdő: T fa, ψ-elemű részminta, véletlen jellemző és vágás, maximális mélység ⌈log₂ ψ⌉ */
  const cN = n => (n > 2 ? 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n : n === 2 ? 1 : 0);
  function isoForest(X, seed, nT = 100, psi = 64) {
    const rnd = mulberry32(seed), ps = Math.min(psi, X.length), Lmax = Math.ceil(Math.log2(ps));
    function grow(idx, d) {
      if (d >= Lmax || idx.length <= 1) return { size: idx.length };
      const j = rnd() < 0.5 ? 0 : 1;
      let mn = Infinity, mx = -Infinity;
      idx.forEach(i => { mn = Math.min(mn, X[i][j]); mx = Math.max(mx, X[i][j]); });
      if (mx <= mn) return { size: idx.length };
      const s = mn + rnd() * (mx - mn);
      return { j, s, l: grow(idx.filter(i => X[i][j] < s), d + 1), r: grow(idx.filter(i => X[i][j] >= s), d + 1) };
    }
    const trees = Array.from({ length: nT }, () => grow(shuffled([...X.keys()], rnd).slice(0, ps), 0));
    const c = cN(ps);
    return x => {
      let tot = 0;
      for (const t of trees) { let nd = t, d = 0; while (nd.l) { nd = x[nd.j] < nd.s ? nd.l : nd.r; d++; } tot += d + cN(nd.size); }
      return Math.pow(2, -(tot / nT) / c);
    };
  }
  /* távolság a k-adik legközelebbi ponttól (skip = kihagyott index, pl. a pont saját maga); a k legjobbat beszúrással tartjuk */
  function kthDist(p, X, k, skip = -1) {
    const b = [];
    for (let j = 0; j < X.length; j++) {
      if (j === skip) continue;
      const d = d2(p, X[j]);
      if (b.length === k && d >= b[k - 1]) continue;
      let t = b.length < k ? b.length : k - 1;
      while (t > 0 && b[t - 1] > d) { b[t] = b[t - 1]; t--; }
      b[t] = d;
    }
    return Math.sqrt(b[Math.min(k, b.length) - 1]);
  }
  W["anomaly-explorer"] = root => {
    header(root, "Ki lóg ki? – anomáliapontszámok",
      "Minden módszer minden pontnak (és a sík minden helyének) <b>anomáliapontszámot</b> ad: a háttér minél pirosabb, annál gyanúsabb ott egy pont. " +
      "A legnagyobb pontszámú N pontot megjelöljük (piros karika). A valódi anomáliákat csak a jelölőnégyzettel fedheted fel – előbb tippelj!");
    let ds = "two", meth = "z", N = 8, k = 5, showTruth = false, D = null, SC = null;
    const gD = toggleGroup(AN_DS, () => ds, v => { ds = v; load(); sync(); });
    const gM = toggleGroup([["z", "z-érték (jellemzőnként, a nagyobb |z|)"], ["cent", "távolság a legközelebbi k-közép középponttól"], ["knn", "k-adik szomszéd távolsága"], ["iso", "izolációs erdő"]], () => meth, v => { meth = v; sync(); });
    const sN = slider(1, 20, 1, N), oN = h("b"), sK = slider(1, 10, 1, k), oK = h("b");
    sN.addEventListener("input", () => { N = +sN.value; sync(false); });
    sK.addEventListener("input", () => { k = +sK.value; sync(); });
    const lK = h("label", null, "k = ", oK, sK);
    root.append(h("div", { class: "controls" }, small("adat:"), gD.bs), h("div", { class: "controls" }, small("módszer:"), gM.bs),
      h("div", { class: "controls" }, h("label", null, "megjelölt pontok száma N = ", oN, sN), lK,
        h("label", null, checkbox(showTruth, e => { showTruth = e.target.checked; sync(false); }), "valódi anomáliák mutatása")));
    const cv = Calc.canvas(root, 0.71);
    const out = h("div", { class: "readout" });
    root.append(out);
    let V = null;
    function load() {
      D = anData(ds); N = D.N; k = D.k;
      V = ds === "cust" ? boundsView(D.X, 0.12, { xname: "vásárlás/hó (std.)", yname: "kosár (std.)" }) : { xmin: -0.2, xmax: 10.2, ymin: -0.2, ymax: 7.2, xname: "x₁", yname: "x₂" };
    }
    /* pontszám-függvény (at) és a pontok saját pontszáma (pt) */
    function scorer() {
      const X = D.X;
      if (meth === "z") {
        const mu = [0, 1].map(j => mean(X.map(p => p[j]))), sd = [0, 1].map(j => Math.sqrt(mean(X.map(p => (p[j] - mu[j]) ** 2))));
        const at = p => Math.max(Math.abs(p[0] - mu[0]) / sd[0], Math.abs(p[1] - mu[1]) / sd[1]);
        return { at, pt: X.map(at) };
      }
      if (meth === "cent") {
        const KM = kmeansBest(X, D.kC, 10, 61), at = p => Math.min(...KM.C.map(c => dist(p, c)));
        return { at, pt: X.map(at), C: KM.C };
      }
      if (meth === "knn") return { at: p => kthDist(p, X, k), pt: X.map((p, i) => kthDist(p, X, k, i)) };
      const f = isoForest(X, 71);
      return { at: f, pt: X.map(f) };
    }
    cv.draw = () => {
      const T = Calc.plot(cv, V, []), { ctx } = cv, X = D.X, cell = 8;
      /* színskála: a pontok medián pontszáma alatt nincs szín, a legnagyobb pontszámnál a legerősebb */
      const srt = SC.pt.slice().sort((a, b) => a - b), lo = srt[Math.floor(srt.length / 2)], hi = srt[srt.length - 1], bad = css("--bad");
      for (let px = 0; px < cv.w; px += cell) for (let py = 0; py < cv.h; py += cell) {
        const t = clamp((SC.at([T.ix(px + cell / 2), T.iy(py + cell / 2)]) - lo) / (hi - lo || 1), 0, 1);
        if (t <= 0.01) continue;
        ctx.fillStyle = rgba(bad, 0.45 * Math.pow(t, 1.2)); ctx.fillRect(px, py, cell, cell);
      }
      if (SC.C) SC.C.forEach(c => diamond(ctx, T.tx(c[0]), T.ty(c[1]), 7, css("--setC")));
      const order = SC.pt.map((v, i) => i).sort((a, b) => SC.pt[b] - SC.pt[a]), rank = Array(X.length);
      order.forEach((i, r) => (rank[i] = r));
      const r0 = cv.w < 500 ? 2.8 : 3.4;
      X.forEach((p, i) => {
        const q = 1 - rank[i] / Math.max(1, X.length - 1), x = T.tx(p[0]), y = T.ty(p[1]);
        dot(ctx, x, y, r0 + 1.2 + 2.6 * q ** 3, css("--card"));
        dot(ctx, x, y, r0 + 2.6 * q ** 3, mix(css("--setA"), bad, q ** 3));
        if (rank[i] < N) ring(ctx, x, y, r0 + 6, bad, 2.4);
        if (showTruth && D.truth[i]) ring(ctx, x, y, r0 + 10, css("--text"), 1.6, [3, 3]);
        if (D.names) label(ctx, D.names[i], x + 8, y - 5, css("--text"), "left", "700 12px system-ui, sans-serif");
      });
      tag(ctx, cv, { z: "z-érték", cent: `távolság a középponttól (k = ${D.kC})`, knn: `${k}. szomszéd távolsága`, iso: "izolációs erdő" }[meth]);
    };
    function sync(rescore = true) {
      gD.paint(); gM.paint();
      sN.value = N; oN.textContent = N; sK.value = k; oK.textContent = k;
      lK.style.display = meth === "knn" ? "" : "none";
      if (rescore || !SC) SC = scorer();
      cv.draw();
      const X = D.X, order = SC.pt.map((v, i) => i).sort((a, b) => SC.pt[b] - SC.pt[a]);
      const tot = D.truth.filter(Boolean).length, hits = order.slice(0, N).filter(i => D.truth[i]).length;
      const nm = i => (D.names ? D.names[i] : `(${fmt(X[i][0], 1)}; ${fmt(X[i][1], 1)})`);
      let s = `megjelölt pontok: N = <b>${N}</b> · ebből valódi anomália: <b>${hits}</b> · precízió@${N} = <b>${pct(hits / N, 0)}</b> · felidézés = ${hits}/${tot} = <b>${pct(hits / tot, 0)}</b>` +
        `<br>legmagasabb pontszámok: ${order.slice(0, 5).map((i, r) => `${r + 1}. ${nm(i)} <b>${fmt(SC.pt[i], 2)}</b>${showTruth && D.truth[i] ? " ★" : ""}`).join(" · ")}`;
      const hint = meth === "z" && ds === "tilt" ? "Jellemzőnként minden pont átlagos – a z-érték vak arra, ami csak együtt furcsa." :
        meth === "iso" && ds === "tilt" ? "Az izolációs erdő csak a tengelyekkel párhuzamosan vág: a ferde sáv két végét könnyű levágni, az átló mellé eső pontot viszont nehéz – itt a k-adik szomszéd távolsága a nyerő." :
        meth === "cent" && ds === "tilt" ?"Egyetlen középpont: a távolság minden irányban ugyanannyit számít, ezért a hosszú felhő két vége gyanúsabbnak tűnik, mint az átlótól eltérő pontok." :
        meth === "z" && ds === "cust" ? "L jellemzőnként a szokásos tartományban van (sok vásárlás és nagy kosár külön-külön is előfordul) – csak a kettő együtt furcsa, ezt a z-érték nem látja." :
          ({ z: "z-érték: jellemzőnként méri, hány szórásnyira van a pont az átlagtól. Csak a tengelyek mentén szélső pontokat veszi észre – a gyanús tartomány téglalap alakú.",
            cent: "Távolság a legközelebbi középponttól: ami minden csoporttól messze van, gyanús. Rossz k vagy elnyúlt csoport esetén téved – és a középpontokat maguk az anomáliák is elhúzhatják.",
            knn: "k-adik szomszéd távolsága: a ritka környezetben lévő pont gyanús. Túl kis k-nál az egymás mellé eső anomáliák „megvédik” egymást.",
            iso: "Izolációs erdő: véletlen vágásokkal a kilógó pontot hamar elszigeteli – rövid út a fában → magas pontszám. Az 1-hez közeli érték gyanús; ha minden pontszám 0,5 körül van, nincs igazi kilógó pont." })[meth];
      s += `<br><span class="muted">${hint}</span>`;
      out.innerHTML = s;
    }
    load(); sync();
  };

  /* ------------------------------------------------------------------
     8.6  recommender-toy – kollaboratív szűrés és mátrixfaktorizáció
     ------------------------------------------------------------------ */
  const BOOKS = [["A néma tanú", "krimi"], ["Éjféli nyomozás", "krimi"], ["Csillagkapu", "sci-fi"], ["A Mars-kolónia", "sci-fi"], ["Nyári szerelem", "romantikus"], ["A tenger titkai", "ismeretterjesztő"]];
  const USERS = ["Anna", "Bence", "Csilla", "Dávid", "Emese"];
  const U_DAT = ["Annának", "Bencének", "Csillának", "Dávidnak", "Emesének"], U_ALL = ["Annához", "Bencéhez", "Csillához", "Dávidhoz", "Emeséhez"];
  const R0 = [[5, 4, 1, 0, 0, 0], [4, 5, 2, 1, 3, 0], [1, 2, 5, 4, 0, 4], [5, 5, 2, 2, 4, 0], [0, 1, 4, 5, 2, 5]];   // 0 = nincs értékelés
  /* hasonlóság a közösen értékelt könyveken; kevesebb mint 2 közös könyv (vagy 0 szórás) → nincs értelmezve (null) */
  function simOf(R, u, v, kind) {
    const co = R[u].map((a, i) => (a && R[v][i] ? i : -1)).filter(i => i >= 0);
    if (co.length < 2) return null;
    let a = co.map(i => R[u][i]), b = co.map(i => R[v][i]);
    if (kind === "pearson") { const ma = mean(a), mb = mean(b); a = a.map(x => x - ma); b = b.map(x => x - mb); }
    const num = a.reduce((s, x, i) => s + x * b[i], 0), den = Math.sqrt(a.reduce((s, x) => s + x * x, 0) * b.reduce((s, x) => s + x * x, 0));
    return den > 1e-12 ? num / den : null;
  }
  const userMean = r => { const v = r.filter(x => x > 0); return v.length ? mean(v) : NaN; };
  /* mátrixfaktorizáció SGD-vel: r̂ = p_u · q_i (2 rejtett tényező, eltolás nélkül) */
  function mfTrain(R, seed = 7, K = 2, lr = 0.02, lam = 0.05, epochs = 2000) {
    const rnd = mulberry32(seed);
    const P = R.map(() => Array.from({ length: K }, () => 0.3 * gauss(rnd))), Q = R[0].map(() => Array.from({ length: K }, () => 0.3 * gauss(rnd)));
    const obs = [];
    R.forEach((row, u) => row.forEach((v, i) => v && obs.push([u, i, v])));
    for (let ep = 0; ep < epochs; ep++) {
      for (const [u, i, r] of shuffled(obs, rnd)) {
        let e = r; for (let f = 0; f < K; f++) e -= P[u][f] * Q[i][f];
        for (let f = 0; f < K; f++) { const pu = P[u][f], qi = Q[i][f]; P[u][f] += lr * (e * qi - lam * pu); Q[i][f] += lr * (e * pu - lam * qi); }
      }
    }
    const pred = (u, i) => P[u].reduce((s, v, f) => s + v * Q[i][f], 0);
    const rmse = obs.length ? Math.sqrt(mean(obs.map(([u, i, r]) => (r - pred(u, i)) ** 2))) : NaN;
    return { P, Q, pred, rmse };
  }
  W["recommender-toy"] = root => {
    header(root, "Kis ajánlórendszer – kinek mit ajánljunk?",
      "Öt olvasó értékelt néhány könyvet (1–5 csillag). Kattints egy cellára az értékelés megváltoztatásához (– → 1 → … → 5 → –), egy névre a célszemély kiválasztásához. " +
      "<b>Szomszédság alapú</b> módban a célszemély üres celláit a hozzá <b>hasonló</b> olvasók értékeléseiből becsüljük (Pearsonnál a „minden szomszéd” a <b>negatív</b> hasonlóságú, ellentétes ízlésű olvasókat is beszámítja – a 8.6 képlete szerint, abszolút értékkel a nevezőben; " +
      "„a 2 leghasonlóbb”: az adott könyvet értékelők közül a két legnagyobb pozitív hasonlóságú). <b>Mátrixfaktorizáció</b>: minden olvasó és könyv kap egy 2 számból álló „rejtett” vektort, " +
      "a becslés $\\hat r_{ui} = \\mathbf{p}_u \\cdot \\mathbf{q}_i$ (eltolás nélkül; SGD, 2000 kör, tanulási ráta 0,02, λ = 0,05).");
    let R = R0.map(r => r.slice()), tu = 0, kind = "cos", nbm = "all", mode = "cf", mf = null, mfKey = "";
    const gU = toggleGroup(USERS.map((u, i) => [i, u]), () => tu, v => { tu = +v; sync(); });
    const gS = toggleGroup([["cos", "koszinusz (nyers értékelések)"], ["pearson", "Pearson (átlagra igazítva)"]], () => kind, v => { kind = v; sync(); });
    const gN = toggleGroup([["all", "minden szomszéd"], ["top2", "a 2 leghasonlóbb"]], () => nbm, v => { nbm = v; sync(); });
    const gMo = toggleGroup([["cf", "Szomszédság alapú (kollaboratív)"], ["mf", "Mátrixfaktorizáció (2 rejtett tényező)"]], () => mode, v => { mode = v; sync(); });
    const rowS = h("div", { class: "controls" }, small("hasonlóság:"), gS.bs), rowN = h("div", { class: "controls" }, small("szomszédok:"), gN.bs);
    root.append(h("div", { class: "controls" }, small("célszemély:"), gU.bs), h("div", { class: "controls" }, gMo.bs, btn("↺ Alaphelyzet", () => { R = R0.map(r => r.slice()); sync(); })), rowS, rowN);
    const tbl = h("div", { style: "overflow-x:auto;margin-top:.4rem" });
    const out = h("div", { class: "readout" });
    root.append(tbl, out);
    tbl.addEventListener("click", e => {
      const c = e.target.closest("[data-u]");
      if (c) { const u = +c.dataset.u, i = +c.dataset.i; R[u][i] = (R[u][i] + 1) % 6; sync(); return; }
      const nmc = e.target.closest("[data-user]");
      if (nmc) { tu = +nmc.dataset.user; sync(); }
    });
    function predictCF(u, i, sims) {
      let cand = USERS.map((_, v) => v).filter(v => v !== u && R[v][i] > 0 && sims[v] != null && (nbm === "all" && kind === "pearson" ? sims[v] !== 0 : sims[v] > 0))
        .map(v => ({ v, s: sims[v], r: R[v][i], mv: userMean(R[v]) }));
      if (nbm === "top2") cand = cand.sort((a, b) => b.s - a.s).slice(0, 2);
      if (!cand.length) return null;
      const S = cand.reduce((t, o) => t + Math.abs(o.s), 0), mu = userMean(R[u]);
      const raw = kind === "cos" ? cand.reduce((t, o) => t + o.s * o.r, 0) / S : mu + cand.reduce((t, o) => t + o.s * (o.r - o.mv), 0) / S;
      return { p: clamp(raw, 1, 5), raw, cand, S, mu };
    }
    function sync() {
      gU.paint(); gS.paint(); gN.paint(); gMo.paint();
      [rowS, rowN].forEach(r => { r.style.opacity = mode === "cf" ? 1 : 0.45; r.querySelectorAll("button").forEach(b => (b.disabled = mode !== "cf")); });
      const sims = USERS.map((_, v) => (v === tu ? null : simOf(R, tu, v, kind)));
      if (mode === "mf") { const key = JSON.stringify(R); if (key !== mfKey) { mf = mfTrain(R); mfKey = key; } }
      /* becslések: CF-ben csak a célszemélynek, MF-ben mindenkinek */
      const pred = R.map((row, u) => row.map((v, i) => {
        if (v) return null;
        if (mode === "mf") return { p: clamp(mf.pred(u, i), 1, 5), raw: mf.pred(u, i) };
        return u === tu ? predictCF(u, i, sims) : null;
      }));
      let best = -1;
      pred[tu].forEach((o, i) => { if (o && (best < 0 || o.p > pred[tu][best].p)) best = i; });
      const used = new Set(best >= 0 && mode === "cf" ? pred[tu][best].cand.map(o => o.v) : []);
      const th = "font-size:.78rem;font-weight:600;vertical-align:bottom;text-align:center;padding:.3rem .35rem;line-height:1.2";
      let html = `<table style="width:auto;margin:0;font-size:.92rem"><tr><th style="${th}"></th>` +
        BOOKS.map(([t, g]) => `<th style="${th};min-width:4.6rem">${t}<br><span class="muted" style="font-weight:400">${g}</span></th>`).join("") +
        (mode === "cf" ? `<th style="${th}">hasonlóság<br>${U_ALL[tu]}</th>` : "") + `</tr>`;
      R.forEach((row, u) => {
        const me = u === tu;
        html += `<tr style="${me ? "background:var(--accent-soft)" : ""}"><td data-user="${u}" style="cursor:pointer;font-weight:${me ? 700 : 600};white-space:nowrap">${me ? "▸ " : ""}${USERS[u]}</td>`;
        row.forEach((v, i) => {
          const o = pred[u][i];
          let c;
          if (v) c = `${v}<span style="color:var(--setB)">★</span>`;
          else if (o) c = `<i style="color:var(--accent);font-weight:600">≈${fix(o.p, 2)}</i>` + (me && i === best ? `<div style="font-size:.72rem;font-weight:700;color:var(--ok);white-space:nowrap">ajánlás ★</div>` : "");
          else c = `<span class="muted">–</span>`;
          html += `<td data-u="${u}" data-i="${i}" style="cursor:pointer;text-align:center;font-family:var(--mono);${me && i === best ? "outline:2px solid var(--ok);outline-offset:-2px" : ""}">${c}</td>`;
        });
        if (mode === "cf") {
          const s = sims[u];
          html += `<td style="text-align:center;font-family:var(--mono);${used.has(u) ? "font-weight:700;color:var(--accent)" : ""}">${me ? `<span class="muted" style="white-space:nowrap">ő maga</span>` : s == null ? "–" : fmt(s, 2) + (used.has(u) ? " ✓" : "")}</td>`;
        }
        html += `</tr>`;
      });
      tbl.innerHTML = html + `</table>`;
      /* kiírás */
      const empt = R[tu].filter(v => !v).length;
      let s;
      if (!empt) s = `${USERS[tu]} minden könyvet értékelt – nincs mit ajánlani. Törölj egy értékelést (kattints rá, amíg „–” nem lesz)!`;
      else if (best < 0) s = `${U_DAT[tu]} most nem tudunk ajánlani: nincs olyan (megfelelő hasonlóságú) olvasó, aki a hiányzó könyveket értékelte. ` +
        `<span class="muted">(A hasonlósághoz legalább 2 közösen értékelt könyv kell.)</span>`;
      else if (mode === "cf") {
        const o = pred[tu][best], bt = BOOKS[best][0];
        const sf = v => (v < 0 ? `(${fmt(v, 2)})` : fmt(v, 2));
        const terms = o.cand.map(c => kind === "cos" ? `${sf(c.s)}·${c.r}` : `${sf(c.s)}·(${c.r} − ${fmt(c.mv, 2)})`).join(" + ");
        const den = o.cand.map(c => fmt(Math.abs(c.s), 2)).join(" + ");
        s = `ajánlás ${U_DAT[tu]}: <b>${bt}</b> (becsült értékelés ${fmt(o.p, 2)})<br>` +
          (kind === "cos" ? `p = Σ s·r / Σ s = (${terms}) / (${den}) = <b>${fmt(o.raw, 2)}</b>` :
            `p = r̄ + Σ s·(r − r̄ᵥ) / Σ |s| = ${fmt(o.mu, 2)} + (${terms}) / (${den}) = <b>${fmt(o.raw, 2)}</b>${o.raw !== o.p ? ` → [1; 5]-re vágva: <b>${fmt(o.p, 2)}</b>` : ""}`) +
          `<br>szomszédok ennél a könyvnél: ${o.cand.map(c => USERS[c.v]).join(", ")}` +
          `<br><span class="muted">${kind === "cos" ? "Koszinusz nyers értékeléseken: két „mindenre 4–5-öt adó” olvasó akkor is hasonló, ha az ízlésük más. A Pearson előbb kivonja mindenki saját átlagát." :
            "Pearson: mindenki saját átlagához mérünk – a szigorú és a nagyvonalú értékelő is összevethető, a becslés pedig a célszemély saját átlagából indul."}</span>`;
      } else {
        const o = pred[tu][best], bt = BOOKS[best][0], p = mf.P[tu], q = mf.Q[best];
        const ft = (rows, names) => `<table style="width:auto;margin:.3rem .8rem .3rem 0;font-size:.82rem;display:inline-table;vertical-align:top"><tr><th></th><th>t₁</th><th>t₂</th></tr>` +
          rows.map((r, i) => `<tr><td style="white-space:nowrap">${names[i]}</td><td>${fix(r[0], 2)}</td><td>${fix(r[1], 2)}</td></tr>`).join("") + `</table>`;
        s = `ajánlás ${U_DAT[tu]}: <b>${bt}</b> · r̂ = p·q = ${par(p[0])}·${par(q[0])} + ${par(p[1])}·${par(q[1])} = <b>${fmt(o.raw, 2)}</b>` +
          `<br>tanító RMSE (a megadott értékeléseken): <b>${fmt(mf.rmse, 3)}</b>` +
          `<br>rejtett tényezők:<br>${ft(mf.P, USERS)}${ft(mf.Q, BOOKS.map(b => b[0]))}` +
          `<br><span class="muted">A két dimenziót az algoritmus nem nevezi el – mi értelmezhetjük őket utólag (pl. „krimi-ízlés” és „sci-fi-ízlés”). ` +
          `Itt minden üres cella kap becslést, és a [1; 5] tartományra vágjuk. Ha egy könyvet senki sem értékelt, a vektora csak a véletlen kezdést mutatja (hidegindítás).</span>`;
      }
      out.innerHTML = s;
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
