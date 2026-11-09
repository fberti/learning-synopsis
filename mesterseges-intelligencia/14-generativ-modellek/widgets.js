/* =========================================================
   Mesterséges intelligencia 14. fejezet – interaktív szemléltetések
   (mintavétel, autoregresszív modell, autoenkóder, VAE, GAN, diffúzió,
   osztályozómentes irányítás, generatív modellek összevetése)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); adatok: gen-data.js (GEN14).
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 8. fejezet widgets.js-ének mintájára)
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
  const setDis = (b, v) => { b.disabled = v; b.style.opacity = v ? 0.45 : ""; b.style.cursor = v ? "default" : ""; };

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  function twoCanvas(root, aspect, aspectR = aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div", { style: "min-width:0" }), R = h("div", { style: "min-width:0" });
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspectR, 380), L, R, wrap];
  }
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
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  function arrow(ctx, x0, y0, x1, y1, color, lw = 2) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 2) return;
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - 7 * Math.cos(a), y1 - 7 * Math.sin(a)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4)); ctx.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => { const b = btn(txt, () => set(key)); b.dataset.key = key; return b; });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    return { bs, paint };
  }
  function rgba(col, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col.trim());
    if (!m) return col;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  const hexRGB = c => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim()); if (!m) return [128, 128, 128]; const v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
  const flatAspect = (root, a, aNarrow) => ((root.clientWidth || 760) < 520 ? aNarrow : a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const par = (x, d = 2) => (x < 0 ? `(${fmt(x, d)})` : fmt(x, d));
  /* egyenlő tengelyléptékű nézet */
  function eqView(cv, cx, cy, hx, hy, extra = {}) {
    const Wd = cv.w - 8, Hd = cv.h - 8, s = Math.min(Wd / (2 * hx), Hd / (2 * hy));
    const ax = Wd / (2 * s), ay = Hd / (2 * s);
    return Object.assign({ xmin: cx - ax, xmax: cx + ax, ymin: cy - ay, ymax: cy + ay }, extra);
  }
  /* az osztályok színei (az 5. fejezet konvenciója): 1 = narancs (--setB), 0 = kék (--setA) */
  const C1 = () => css("--setB"), C0 = () => css("--setA");
  /* döntési térkép: p(x, y) ∈ [0, 1] → kék … narancs, a bizonyosság szerinti erősséggel */
  function decisionMap(cv, T, view, p, cell = 6, alpha = 0.34) {
    const { ctx, w, h: hh } = cv, c1 = C1(), c0 = C0();
    for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
      const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2);
      if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) continue;
      const v = p(x, y);
      if (!Number.isFinite(v)) continue;
      const a = 0.05 + alpha * Math.min(1, Math.abs(v - 0.5) * 2);
      ctx.fillStyle = rgba(v >= 0.5 ? c1 : c0, a);
      ctx.fillRect(px, py, cell, cell);
    }
  }
  /* egyenes a w1·x + w2·y + b = 0 alakból, a nézetre vágva */
  function lineFrom(w1, w2, b, V) {
    if (Math.abs(w2) > 1e-9 && Math.abs(w2) >= Math.abs(w1) * 0.02) {
      const y = x => -(w1 * x + b) / w2;
      return [[V.xmin, y(V.xmin)], [V.xmax, y(V.xmax)]];
    }
    if (Math.abs(w1) > 1e-9) { const x = -b / w1; return [[x, V.ymin], [x, V.ymax]]; }
    return null;
  }
  const A = () => window.ML.act;

  const softmax = z => { const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); };
  const argmax = a => a.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const dotp = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const norm = a => Math.sqrt(dotp(a, a));
  const cosine = (a, b) => dotp(a, b) / (norm(a) * norm(b) || 1);
  /* cella kitöltése: háttér (--card) → szín, t ∈ [0, 1] erősséggel */
  function mix(colVar, t) {
    const bg = hexRGB(css("--card")), c = hexRGB(css(colVar));
    t = clamp(t, 0, 1);
    return `rgb(${bg.map((b, i) => Math.round(b + (c[i] - b) * t)).join(",")})`;
  }
  /* olvasható szövegszín egy kitöltött cellán */
  const ink = t => (t > 0.55 ? css("--card") : css("--text"));


  /* ---------- 14. fejezet: közös segédek ---------- */
  /* mulberry32 magolt álvéletlen + standard normális (Box–Muller) */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const gauss = rnd => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  const sigm = z => 1 / (1 + Math.exp(-z));
  /* 8×8-as számjegy rajzolása: v[64] 0…16 (0 = háttér, 16 = tinta); a tinta színe --text, a háttér --card */
  function drawDigit(ctx, x, y, size, v, opts = {}) {
    const bg = hexRGB(css("--card")), fg = hexRGB(css(opts.inkVar || "--text")), c = size / 8, mx = opts.max || 16;
    for (let i = 0; i < 64; i++) {
      const t = clamp(v[i] / mx, 0, 1);
      ctx.fillStyle = `rgb(${bg.map((b, k) => Math.round(b + (fg[k] - b) * t)).join(",")})`;
      ctx.fillRect(x + (i % 8) * c, y + Math.floor(i / 8) * c, Math.ceil(c), Math.ceil(c));
    }
    ctx.save(); ctx.strokeStyle = css(opts.frameVar || "--border"); ctx.lineWidth = opts.frameW || 1;
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1); ctx.restore();
  }
  /* MLP előreszámolás a gen-data.js formátumában: layers = [{W: [ki][be], b: [ki]}, …];
     a rejtett rétegeken ReLU, a kimeneten out ("sigmoid" | "linear") */
  function mlpForward(layers, x, out = "sigmoid") {
    let a = x;
    layers.forEach((L, li) => {
      const z = L.W.map((row, j) => row.reduce((s, w, i) => s + w * a[i], L.b[j]));
      a = li < layers.length - 1 ? z.map(v => (v > 0 ? v : 0)) : (out === "sigmoid" ? z.map(sigm) : z);
    });
    return a;
  }
  /* a 10 számjegy-osztály színe (kategoriális, mindkét témában olvasható) */
  const DIGIT_COLORS = ["#4e79a7", "#f28e2b", "#59a14f", "#e15759", "#76b7b2", "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#7f7f7f"];

  const W = {};

  /* ==================================================================
     w1 – 14.1-b/14.2-b rajzológép (2 × 2) · 14.2-c pixelenként rajzoló gép ·
          14.3-b szűk keresztmetszet · 14.4-b a KL ára
     ================================================================== */
  const w1Font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  const w1OnTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  /* canvas, amelynek magassága a szélességtől függ; HiDPI, téma- és méretváltáskor újrarajzol (a draw maga hívja a resize-t) */
  function w1Canvas(parent, heightOf, maxW = 760) {
    const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
    parent.append(c);
    const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    o.resize = () => {
      const w = Math.max(60, Math.min(maxW, parent.clientWidth || maxW)), hh = Math.max(40, Math.round(heightOf(w)));
      const dpr = window.devicePixelRatio || 1;
      if (o.w !== w || o.h !== hh || c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
        c.style.width = w + "px"; c.style.height = hh + "px";
      }
      o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.w = w; o.h = hh;
    };
    o.resize();
    let t;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => o.draw && o.draw(), 160); });
    w1OnTheme(() => o.draw && o.draw());
    return o;
  }
  /* rögzített tizedesjegyek, „felfelé kerekítve a felénél” (a 4 tizedesre kerekített adatoknál: 0,0225 → 0,023) */
  const w1Fix = (x, d = 3) => {
    const m = Math.pow(10, d), r = Math.round(x * m + Math.sign(x) * 1e-6) / m;
    return (Math.abs(r) < 0.5 / m ? 0 : r).toFixed(d).replace("-", "−").replace(".", ",");
  };
  /* a widget láthatósága (animáció leállításához) */
  function w1Visible(root, cb) {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { threshold: 0.05 }).observe(root);
  }
  /* „papír” és „tinta” a fekete-fehér képekhez: mindkét témában világos papír, sötét tinta (a --card és a --text közül) */
  function w1Paper() {
    const c = hexRGB(css("--card")), t = hexRGB(css("--text")), lum = v => 0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2];
    return lum(c) >= lum(t) ? [c, t] : [t, c];
  }
  const w1RGB = v => `rgb(${v.join(",")})`;
  /* 2 × 2-es ikon: v = "1100" kód vagy négy 0…1 érték (1 = fekete) */
  function w1Icon(ctx, x, y, s, v, opts = {}) {
    const vals = typeof v === "string" ? [...v].map(Number) : v, c = s / 2;
    const [bg, fg] = w1Paper();
    vals.forEach((t, i) => {
      t = clamp(t, 0, 1);
      ctx.fillStyle = `rgb(${bg.map((b, k) => Math.round(b + (fg[k] - b) * t)).join(",")})`;
      ctx.fillRect(x + (i % 2) * c, y + Math.floor(i / 2) * c, Math.ceil(c), Math.ceil(c));
    });
    ctx.save();
    ctx.strokeStyle = css(opts.frame || "--muted"); ctx.lineWidth = opts.lw || 1;
    ctx.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
    if (opts.grid !== false) {
      ctx.strokeStyle = rgba(css("--muted"), 0.45); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + c, y + 1); ctx.lineTo(x + c, y + s - 1); ctx.moveTo(x + 1, y + c); ctx.lineTo(x + s - 1, y + c); ctx.stroke();
    }
    ctx.restore();
  }
  /* a fejezet futó példája */
  const W1_SEEN = ["1100", "0011", "1010", "0101", "1001"];
  const W1_CNT = { "1100": 3, "0011": 2, "1010": 2, "0101": 2, "1001": 1 };
  const W1_ALL = Array.from({ length: 16 }, (_, i) => i.toString(2).padStart(4, "0"));
  const W1_ORDER = [...W1_SEEN, ...W1_ALL.filter(c => !W1_SEEN.includes(c))];
  const W1_DATA = W1_SEEN.flatMap(c => Array(W1_CNT[c]).fill(c));
  const W1_PIX = ["bal fent", "jobb fent", "bal lent", "jobb lent"];
  const w1Prod = (code, pix) => {
    const x = [...code].map(Number);
    let p = 1;
    for (let i = 0; i < 4; i++) { const q = pix(i, x); p *= x[i] ? q : 1 - q; }
    return p;
  };
  const W1_MODELS = {
    table: { kind: "strip", params: 15, name: "táblázat", prob: c => (W1_CNT[c] || 0) / 10 },
    indep: { kind: "coins", params: 4, name: "független pixelek", pix: i => [0.6, 0.5, 0.4, 0.5][i] },
    markov: {
      kind: "coins", params: 7, name: "Markov",
      pix: (i, x) => (i === 0 ? 0.6 : i === 1 ? 0.5 : i === 2 ? (x[1] ? 0 : 0.8) : 0.5),
      cond: (i, x) => (i === 0 ? "" : ` | ${W1_PIX[i - 1]} ${x[i - 1] ? "fekete" : "fehér"}`)
    },
    laplace: { kind: "strip", params: 15, name: "Laplace-simított", prob: c => ((W1_CNT[c] || 0) + 1) / 26 }
  };
  Object.values(W1_MODELS).forEach(M => {
    if (!M.prob) M.prob = c => w1Prod(c, M.pix);
    M.nll = -W1_DATA.reduce((s, c) => s + Math.log2(M.prob(c)), 0) / W1_DATA.length;
    M.support = W1_ALL.filter(c => M.prob(c) > 1e-12).length;
  });

  /* ------------------------------------------------------------------
     sample-machine – rajzológép a 2 × 2-es világban (14.1-b, 14.2-b)
     ------------------------------------------------------------------ */
  W["sample-machine"] = root => {
    header(root, "Rajzológép a 2 × 2-es világban",
      "Válassz modellt, és húzz mintákat! Az oszlopok a 16 kép valószínűségei a modellben, mellettük a húzott minták gyakorisága. " +
      "Keretben a tíz gyerekrajzban szereplő öt kép (alattuk: hányan rajzolták).");
    let model = "table", seed = 1, rnd = rng(seed), counts = new Array(16).fill(0), N = 0, last = null;
    const M = () => W1_MODELS[model];
    const tg = toggleGroup([["table", "táblázat"], ["indep", "független pixelek"], ["markov", "Markov"], ["laplace", "Laplace-simított"]],
      () => model, k => { model = k; reset(); });
    root.append(h("div", { class: "controls" }, small("modell:"), tg.bs));
    const cvWrap = h("div", { style: "min-width:0" });
    root.append(cvWrap);
    const cv = w1Canvas(cvWrap, w => clamp(w * 0.36, 210, 280));
    const legend = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" });
    root.append(legend);

    const pLeft = h("div", { style: "flex:1 1 280px;min-width:0" }), pRight = h("div", { style: "flex:0 0 96px;text-align:center" });
    root.append(h("div", { style: "display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;margin-top:.7rem;padding:.5rem .7rem;border:1px solid var(--border);border-radius:10px" }, pLeft, pRight));
    const stripWrap = h("div", { style: "min-width:0" }), coinBox = h("div", { class: "tw", style: "overflow-x:auto" });
    const lastTxt = h("div", { style: "font-size:.9rem;margin-top:.25rem" });
    pLeft.append(stripWrap, coinBox, lastTxt);
    const cvS = w1Canvas(stripWrap, () => 62, 640);
    const resWrap = h("div", { style: "width:96px" }), resCap = h("div", { class: "muted", style: "font-size:.8rem" });
    pRight.append(resWrap, resCap);
    const cvR = w1Canvas(resWrap, () => 76, 96);

    const b1 = btn("1 minta", () => { last = sampleOne(); add(last.code); draw(); }, "btn primary");
    const b100 = btn("100 minta", () => { for (let i = 0; i < 100; i++) { last = sampleOne(); add(last.code); } draw(); });
    const b1000 = btn("1000 minta", () => { for (let i = 0; i < 1000; i++) { last = sampleOne(); add(last.code); } draw(); });
    const seedTxt = small("");
    root.append(h("div", { class: "controls" }, b1, b100, b1000,
      btn("Törlés", () => reset()), btn("Új mag", () => { seed++; reset(); }), seedTxt));
    const stats = h("div", { class: "stat-row" });
    root.append(stats);

    function reset() { rnd = rng(seed); counts.fill(0); N = 0; last = null; draw(); }
    function add(code) { counts[W1_ORDER.indexOf(code)]++; N++; }
    function sampleOne() {
      const m = M();
      if (m.kind === "strip") {
        const u = rnd();
        let acc = 0, code = W1_ORDER[W1_ORDER.length - 1];
        for (const c of W1_ORDER) { const p = m.prob(c); if (p > 0 && u < acc + p) { code = c; break; } acc += p; }
        return { code, u };
      }
      const x = [], us = [], ps = [], conds = [];
      for (let i = 0; i < 4; i++) {
        const p = m.pix(i, x), u = rnd();
        conds.push(m.cond ? m.cond(i, x) : "");
        ps.push(p); us.push(u); x.push(u < p ? 1 : 0);
      }
      return { code: x.join(""), us, ps, conds };
    }

    function drawBars() {
      cv.resize();
      const { ctx, w, h: H } = cv, m = M();
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const L = 32, R = 4, top = 14, gw = (w - L - R) / 16, s = clamp(Math.floor(gw - 6), 10, 24);
      const bottom = H - (s + 34), ph = bottom - top;
      const P = W1_ORDER.map(c => m.prob(c)), F = counts.map(c => (N ? c / N : 0));
      const ymax = Math.max(0.35, ...F.map(f => f * 1.05));
      const ty = v => bottom - (v / ymax) * ph;
      const step = ymax > 0.7 ? 0.2 : 0.1;
      ctx.font = w1Font(10, 400); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let v = 0; v <= ymax + 1e-9; v += step) {
        ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, ty(v) + 0.5); ctx.lineTo(w - R, ty(v) + 0.5); ctx.stroke();
        ctx.fillStyle = css("--muted"); ctx.fillText(fmt(v, 1), L - 4, ty(v));
      }
      /* elválasztó a látott és a nem látott képek között */
      const xs = L + 5 * gw;
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(xs, top - 6); ctx.lineTo(xs, H - 4); ctx.stroke(); ctx.restore();
      label(ctx, "a 10 rajzban", L + 2, top - 2, css("--muted"), "left", w1Font(10, 600));
      label(ctx, "egyik gyerek sem rajzolta", xs + 4, top - 2, css("--muted"), "left", w1Font(10, 600));
      const cA = css("--setA"), cB = css("--setB"), bw = Math.max(2, (gw - 4) / 2 - 0.5);
      W1_ORDER.forEach((c, k) => {
        const x0 = L + k * gw + 2;
        if (P[k] > 0) { ctx.fillStyle = cA; ctx.fillRect(x0, ty(P[k]), bw, bottom - ty(P[k])); }
        if (N) { ctx.fillStyle = cB; ctx.fillRect(x0 + bw + 1, ty(F[k]), bw, bottom - ty(F[k])); }
        if (P[k] === 0) label(ctx, "0", x0 + bw / 2, bottom - 2, css("--muted"), "center", w1Font(9, 600));
        if (gw >= 40 && P[k] > 0) label(ctx, fmt(P[k], 2), x0 + bw / 2, ty(P[k]) - 2, css("--muted"), "center", w1Font(9, 600));
        const ix = L + k * gw + (gw - s) / 2, iy = bottom + 6, seen = k < 5, isLast = last && last.code === c;
        w1Icon(ctx, ix, iy, s, c, { frame: seen ? "--accent" : "--muted", lw: seen ? 2 : 1 });
        if (seen) label(ctx, "×" + W1_CNT[c], ix + s / 2, iy + s + 13, css("--accent"), "center", w1Font(10, 700));
        if (isLast) {
          ctx.save(); ctx.fillStyle = css("--bad");
          const ax = ix + s / 2, ay = iy + s + (seen ? 16 : 4);
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 5, ay + 8); ctx.lineTo(ax + 5, ay + 8); ctx.closePath(); ctx.fill(); ctx.restore();
        }
      });
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(L, bottom + 0.5); ctx.lineTo(w - R, bottom + 0.5); ctx.stroke();
    }

    function drawStrip() {
      const m = M();
      stripWrap.style.display = m.kind === "strip" ? "" : "none";
      coinBox.style.display = m.kind === "coins" ? "" : "none";
      if (m.kind !== "strip") return;
      cvS.resize();
      const { ctx, w, h: H } = cvS, L = 8, R = 8, y0 = 18, bh = 24, tx = u => L + u * (w - L - R);
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      let acc = 0;
      const ticks = [0];
      W1_ORDER.forEach((c, k) => {
        const p = m.prob(c);
        if (p <= 0) return;
        const a = tx(acc), b = tx(acc + p);
        ctx.fillStyle = mix(k < 5 ? "--setA" : "--muted", k % 2 ? 0.22 : 0.42);
        ctx.fillRect(a, y0, b - a, bh);
        ctx.strokeStyle = css("--card"); ctx.lineWidth = 1; ctx.strokeRect(a + 0.5, y0 + 0.5, b - a - 1, bh - 1);
        const s = Math.min(bh - 6, b - a - 6);
        if (s >= 9) w1Icon(ctx, (a + b) / 2 - s / 2, y0 + (bh - s) / 2, s, c, { grid: false });
        acc += p; ticks.push(acc);
      });
      ctx.font = w1Font(10, 400); ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      const tk = model === "table" ? ticks : [0, 0.5, 1];
      tk.forEach(u => {
        ctx.fillRect(tx(u) - 0.5, y0 + bh, 1, 4);
        ctx.fillText(fmt(u, 2), clamp(tx(u), 10, w - 10), y0 + bh + 5);
      });
      if (last && last.u != null) {
        const x = tx(last.u);
        ctx.save(); ctx.fillStyle = css("--bad"); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y0 - 1); ctx.lineTo(x - 5, y0 - 9); ctx.lineTo(x + 5, y0 - 9); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + bh); ctx.stroke(); ctx.restore();
        label(ctx, "u = " + w1Fix(last.u, 2), clamp(x + 8, 30, w - 40), y0 - 4, css("--bad"), x > w - 70 ? "right" : "left", w1Font(11, 700));
      } else label(ctx, "a [0; 1) szakasz felosztása", L, y0 - 4, css("--muted"), "left", w1Font(11, 600));
    }

    function drawCoins() {
      const m = M();
      if (m.kind !== "coins") return;
      const head = `<tr><th>pixel</th><th>p(fekete${model === "markov" ? " | előző" : ""})</th><th>u</th><th>u &lt; p?</th></tr>`;
      const rows = [0, 1, 2, 3].map(i => {
        if (!last || !last.us) return `<tr><td>${i + 1}. ${W1_PIX[i]}</td><td>${model === "indep" ? fmt(m.pix(i), 1) : "?"}</td><td>–</td><td>–</td></tr>`;
        const p = last.ps[i], u = last.us[i], b = u < p;
        return `<tr><td>${i + 1}. ${W1_PIX[i]}</td><td>${fmt(p, 1)}${last.conds[i] ? `<span class="muted" style="font-size:.8rem"> (${last.conds[i].slice(3)})</span>` : ""}</td>` +
          `<td>${w1Fix(u, 2)}</td><td><b>${b ? "igen → fekete" : "nem → fehér"}</b></td></tr>`;
      }).join("");
      coinBox.innerHTML = `<table class="pix-table" style="font-size:.85rem;font-family:inherit">${head}${rows}</table>`;
    }

    function drawRes() {
      cvR.resize();
      const { ctx, w, h: H } = cvR;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const s = 64, x = (w - s) / 2;
      if (last) w1Icon(ctx, x, 4, s, last.code, { frame: W1_SEEN.includes(last.code) ? "--accent" : "--bad", lw: 2 });
      else { ctx.save(); ctx.strokeStyle = css("--border"); ctx.setLineDash([4, 3]); ctx.strokeRect(x + 0.5, 4.5, s - 1, s - 1); ctx.restore(); label(ctx, "?", w / 2, 4 + s / 2, css("--muted"), "center", w1Font(22, 700), "middle"); }
      resCap.innerHTML = last ? `<code>${last.code}</code><br>${W1_SEEN.includes(last.code) ? "látott kép" : "<b>új kép!</b>"}` : "a minta";
    }

    function draw() {
      tg.paint();
      const m = M();
      drawBars(); drawStrip(); drawCoins(); drawRes();
      legend.innerHTML = `<span style="color:var(--setA)">■</span> a modell valószínűsége &nbsp; <span style="color:var(--setB)">■</span> a húzott minták gyakorisága` +
        (N ? ` (${N} minta)` : "") + ` &nbsp; <span style="color:var(--bad)">▲</span> az utolsó minta`;
      if (!last) lastTxt.innerHTML = m.kind === "strip"
        ? "Egyetlen egyenletes <i>u</i> dönt: azt a képet kapod, amelyiknek a szakaszába esik."
        : (model === "indep" ? "Pixelenként külön pénzfeldobás: a pixel fekete, ha <i>u</i> &lt; <i>p</i>."
          : "Pixelenként pénzfeldobás, de a <i>p</i> az előző pixeltől függ: a pixel fekete, ha <i>u</i> &lt; <i>p</i>.");
      else if (m.kind === "strip") {
        let acc = 0, a = 0;
        for (const c of W1_ORDER) { const p = m.prob(c); if (c === last.code) { a = acc; break; } acc += p; }
        lastTxt.innerHTML = `<i>u</i> = ${w1Fix(last.u, 3)} a [${fmt(a, 3)}; ${fmt(a + m.prob(last.code), 3)}) szakaszba esik → <code>${last.code}</code>`;
      } else lastTxt.innerHTML = `A négy döntés együtt: <code>${last.code}</code>, valószínűsége a modellben ${fmt(m.prob(last.code), 3)}.`;
      seedTxt.textContent = "mag: " + seed;
      const fresh = W1_ORDER.slice(5).reduce((s, c, k) => s + counts[k + 5], 0), freshKinds = counts.slice(5).filter(c => c > 0).length;
      const st = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        st(fmt(m.nll, 2) + " bit", "NLL a 10 rajzon"),
        st(String(m.params), "paraméter"),
        st(m.support + " / 16", "rajzolható kép"),
        st(N ? `${fresh} (${pct(fresh / N, 1)})` : "–", N ? `új kép a ${N} mintában · ${freshKinds} féle` : "új kép a mintákban"));
    }
    cv.draw = draw; cvS.draw = draw; cvR.draw = draw;
    draw();
  };

  /* ------------------------------------------------------------------
     pixel-ar – pixelenként rajzoló gép (14.2-c), GEN14.ar
     ------------------------------------------------------------------ */
  const w1ArZ = (x, i) => { const A = GEN14.ar, Wi = A.W[i]; let z = A.b[i]; for (let j = 0; j < i; j++) if (x[j] === 1) z += Wi[j]; return z; };
  const w1ArP = (x, i, T) => sigm(w1ArZ(x, i) / T);
  /* a kép meglepetése (bit) az eredeti (T = 1) modellben, a láncszabály szerint, az első n pixelen */
  function w1ArBits(x, n = 64) {
    let s = 0;
    for (let i = 0; i < n; i++) { const p = clamp(w1ArP(x, i, 1), 1e-12, 1 - 1e-12); s -= Math.log2(x[i] === 1 ? p : 1 - p); }
    return s;
  }
  function w1ArComplete(x0, keep, T, rnd) {
    const x = x0.slice();
    for (let i = keep * 8; i < 64; i++) x[i] = rnd() < w1ArP(x, i, T) ? 1 : 0;
    return x;
  }
  /* bináris 8 × 8-as kép: 1 = fekete, 0 = fehér, −1 = még üres */
  function w1Bin(ctx, x0, y0, S, x, opts = {}) {
    const c = S / 8, [pp, ii] = w1Paper(), P = w1RGB(pp), I = w1RGB(ii), E = css("--bg-soft");
    for (let i = 0; i < 64; i++) {
      const v = x[i], px = x0 + (i % 8) * c, py = y0 + Math.floor(i / 8) * c;
      ctx.fillStyle = v === 1 ? I : v === 0 ? P : E;
      ctx.fillRect(px, py, Math.ceil(c), Math.ceil(c));
    }
    if (opts.grid) {
      ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.28); ctx.lineWidth = 1; ctx.beginPath();
      for (let k = 1; k < 8; k++) { ctx.moveTo(x0 + k * c + 0.5, y0); ctx.lineTo(x0 + k * c + 0.5, y0 + S); ctx.moveTo(x0, y0 + k * c + 0.5); ctx.lineTo(x0 + S, y0 + k * c + 0.5); }
      ctx.stroke(); ctx.restore();
    }
    if (opts.keep != null && opts.keep > 0 && opts.keep < 8) {
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(x0 - 3, y0 + opts.keep * c); ctx.lineTo(x0 + S + 3, y0 + opts.keep * c); ctx.stroke(); ctx.restore();
    }
    ctx.save(); ctx.strokeStyle = css(opts.frame || "--border"); ctx.lineWidth = opts.lw || 1;
    ctx.strokeRect(x0 + 0.5, y0 + 0.5, S - 1, S - 1); ctx.restore();
  }

  W["pixel-ar"] = root => {
    const A = GEN14.ar;
    header(root, "Pixelenként rajzoló gép",
      "Egy logisztikus autoregresszív modell 8 × 8-as fekete-fehér számjegyeken: minden pixelnél σ(z/T) adja a fekete valószínűségét, " +
      "ahol z a már megrajzolt pixelekből jön (soronként, balról jobbra).");
    let mode = "draw", T = 1, speed = 12, seed = 1, nDraw = 0, running = false, visible = true, raf = 0, lastTs = 0, accT = 0;
    let cur = null;           /* { x, u, i } */
    let sel = 0, keep = 4, inp = A.test[0].slice(), compSeed = 1;
    const tg = toggleGroup([["draw", "Rajzolás"], ["complete", "Kiegészítés"]], () => mode, k => { mode = k; stop(); layout(); draw(); });
    root.append(h("div", { class: "controls" }, tg.bs));

    const sT = slider(0.25, 2, 0.05, 1), tLab = h("b", null, "1");
    sT.oninput = () => { T = +sT.value; tLab.textContent = fmt(T, 2); draw(); };
    const sV = slider(1, 64, 1, speed), vLab = h("b", null, String(speed));
    sV.oninput = () => { speed = +sV.value; vLab.textContent = String(speed); };
    const bGo = btn("▶ Rajzolj!", () => { newImage(); start(); }, "btn primary");
    const bPause = btn("⏸ Szünet", () => { if (running) stop(); else if (cur && cur.i < 64) start(); draw(); });
    const bStep = btn("1 pixel", () => { stop(); if (!cur || cur.i >= 64) newImage(); stepPix(); draw(); });
    const bDone = btn("Kész", () => { stop(); if (!cur) newImage(); while (cur.i < 64) stepPix(); draw(); });
    const rowT = h("div", { class: "controls" }, h("label", null, "hőmérséklet T", sT, tLab));
    const rowDraw = h("div", { class: "controls" }, bGo, bPause, bStep, bDone, h("label", null, "sebesség (pixel/s)", sV, vLab));
    root.append(rowT, rowDraw);

    /* kiegészítés: tesztkép-választó + megtartott sorok */
    const pickWrap = h("div", { style: "min-width:0;margin:.3rem 0" });
    const sK = slider(0, 8, 1, keep), kLab = h("b", null, String(keep));
    sK.oninput = () => { keep = +sK.value; kLab.textContent = String(keep); draw(); };
    const rowComp = h("div", { class: "controls" }, h("label", null, "megtartott sorok felülről", sK, kLab),
      btn("Új minták", () => { compSeed++; draw(); }), btn("Eredeti visszaállítása", () => { inp = A.test[sel].slice(); draw(); }));
    root.append(pickWrap, rowComp);
    const cvP = w1Canvas(pickWrap, w => (w < 520 ? 2 : 1) * (Math.min(46, (w < 520 ? w / 10 : w / 20)) + 14) + 4);

    const mainWrap = h("div", { style: "min-width:0" });
    root.append(mainWrap);
    const cv = w1Canvas(mainWrap, w => {
      if (mode === "draw") return w < 560 ? Math.min(w, 300) + 8 : Math.min(320, w * 0.42) + 8;
      const g = w1CompGeom(w); return g.H;
    });
    const info = h("div", { class: "readout" }), stats = h("div", { class: "stat-row" });
    root.append(info, stats);

    function w1CompGeom(w) {
      const narrow = w < 560, gap = 10, lab = 30;
      const S = narrow ? Math.min(w * 0.6, 230) : Math.min(230, w * 0.34);
      const rw = narrow ? w : w - S - 24, cols = 4, s = Math.min(92, (rw - (cols - 1) * gap) / cols);
      const gridH = 2 * (s + lab) + 4;
      const H = narrow ? S + 34 + gridH : Math.max(S + 34, gridH + 18);
      return { narrow, gap, lab, S, s, cols, H, rx: narrow ? (w - (cols * s + (cols - 1) * gap)) / 2 : S + 24, ry: narrow ? S + 34 : 18, ix: narrow ? (w - S) / 2 : 0, iy: 18 };
    }

    function newImage() {
      nDraw++;
      const r = rng(seed * 7919 + nDraw);
      cur = { x: new Array(64).fill(-1), u: Array.from({ length: 64 }, () => r()), i: 0 };
    }
    function stepPix() {
      if (!cur || cur.i >= 64) return;
      const i = cur.i, p = w1ArP(cur.x, i, T);
      cur.x[i] = cur.u[i] < p ? 1 : 0; cur.i++;
    }
    function loop(ts) {
      if (!running) return;
      if (!visible) { raf = 0; return; }
      const dt = lastTs ? Math.min(0.25, (ts - lastTs) / 1000) : 0; lastTs = ts;
      accT += dt * speed;
      let changed = false;
      while (accT >= 1 && cur.i < 64) { accT -= 1; stepPix(); changed = true; }
      if (cur.i >= 64) running = false;
      if (changed || !running) draw();
      if (running) raf = requestAnimationFrame(loop);
      else raf = 0;
    }
    function start() { running = true; lastTs = 0; accT = 0.999; if (!raf) raf = requestAnimationFrame(loop); paintBtns(); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; paintBtns(); }
    function paintBtns() { bPause.textContent = running ? "⏸ Szünet" : "▶ Folytatás"; setDis(bPause, !running && !(cur && cur.i < 64)); }
    w1Visible(root, v => { visible = v; if (v && running && !raf) { lastTs = 0; raf = requestAnimationFrame(loop); } });

    function layout() {
      tg.paint();
      rowDraw.style.display = mode === "draw" ? "" : "none";
      pickWrap.style.display = rowComp.style.display = mode === "complete" ? "" : "none";
    }

    function drawPicker() {
      cvP.resize();
      const { ctx, w, h: H } = cvP, rows = w < 520 ? 2 : 1, per = 20 / rows, s = Math.min(46, w / per - 6), cw = w / per;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      A.test.forEach((img, k) => {
        const r = Math.floor(k / per), c = k % per, x = c * cw + (cw - s) / 2, y = r * (s + 14) + 2;
        w1Bin(ctx, x, y, s, img, { frame: k === sel ? "--accent" : "--border", lw: k === sel ? 3 : 1 });
        label(ctx, String(A.testLabel[k]), x + s / 2, y + s + 12, css(k === sel ? "--accent" : "--muted"), "center", w1Font(11, k === sel ? 700 : 500));
      });
      cvP.geo = { rows, per, s, cw };
    }
    cvP.c.addEventListener("pointerdown", e => {
      const g = cvP.geo; if (!g) return;
      const [mx, my] = evXY(cvP, e), c = Math.floor(mx / g.cw), r = Math.floor(my / (g.s + 14)), k = r * g.per + c;
      if (c >= 0 && c < g.per && r >= 0 && r < g.rows && k < 20) { sel = k; inp = A.test[k].slice(); draw(); }
    });
    cv.c.addEventListener("pointerdown", e => {
      if (mode !== "complete") return;
      const g = w1CompGeom(cv.w), [mx, my] = evXY(cv, e), c = g.S / 8;
      const col = Math.floor((mx - g.ix) / c), row = Math.floor((my - g.iy) / c);
      if (col < 0 || col > 7 || row < 0 || row > 7) return;
      if (row < keep) { inp[row * 8 + col] = 1 - inp[row * 8 + col]; draw(); }
    });

    function drawMain() {
      cv.resize();
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      if (mode === "draw") {
        const S = (w < 560 ? Math.min(w, 300) : Math.min(320, w * 0.42)), x0 = (w - S) / 2, y0 = 4, c = S / 8;
        const x = cur ? cur.x : new Array(64).fill(-1);
        w1Bin(ctx, x0, y0, S, x, { grid: true, frame: "--muted" });
        if (cur && cur.i < 64) {
          const i = cur.i, p = w1ArP(cur.x, i, T), px = x0 + (i % 8) * c, py = y0 + Math.floor(i / 8) * c;
          ctx.fillStyle = mix("--accent", 0.15 + 0.6 * p); ctx.fillRect(px, py, c, c);
          ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 3; ctx.strokeRect(px + 1.5, py + 1.5, c - 3, c - 3); ctx.restore();
          label(ctx, fmt(p, 2), px + c / 2, py + c / 2, ink(0.15 + 0.6 * p), "center", w1Font(Math.max(10, Math.round(c * 0.3)), 700), "middle");
        }
        if (!cur) label(ctx, "Nyomd meg: „▶ Rajzolj!”", w / 2, y0 + S / 2, css("--muted"), "center", w1Font(14, 600), "middle");
        return;
      }
      const g = w1CompGeom(w);
      label(ctx, "a megtartott rész (kattints: pixel át)", g.ix + g.S / 2, g.iy - 4, css("--muted"), "center", w1Font(11, 600));
      const show = inp.map((v, i) => (i < keep * 8 ? v : -1));
      w1Bin(ctx, g.ix, g.iy, g.S, show, { grid: true, frame: "--muted", keep });
      if (keep < 8) label(ctx, "?", g.ix + g.S / 2, g.iy + (keep * g.S / 8 + g.S) / 2, css("--muted"), "center", w1Font(Math.round(g.S / 6), 700), "middle");
      const outs = comps();
      const items = [{ x: A.test[sel], cap: "eredeti", orig: true }, ...outs.map((x, k) => ({ x, cap: `${k + 1}. minta` }))];
      items.forEach((it, k) => {
        const r = Math.floor(k / g.cols), c = k % g.cols, x = g.rx + c * (g.s + g.gap), y = g.ry + r * (g.s + g.lab);
        w1Bin(ctx, x, y, g.s, it.x, { keep, frame: it.orig ? "--setC" : "--border", lw: it.orig ? 3 : 1 });
        label(ctx, it.cap, x + g.s / 2, y + g.s + 13, css(it.orig ? "--text" : "--muted"), "center", w1Font(11, it.orig ? 700 : 500));
        label(ctx, fmt(w1ArBits(it.x), 1) + " bit", x + g.s / 2, y + g.s + 26, css("--muted"), "center", w1Font(10, 500));
      });
      cv.outs = outs;
    }
    function comps() {
      const r = rng(compSeed * 104729 + sel * 31 + 7);
      return Array.from({ length: 6 }, () => w1ArComplete(inp, keep, T, r));
    }

    function draw() {
      layout(); paintBtns();
      if (mode === "complete") drawPicker();
      drawMain();
      const st = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      if (mode === "draw") {
        if (!cur) info.innerHTML = `A modell a 450 tesztképen átlagosan <b>${fmt(A.nll.ar, 1)} bit</b> meglepetést ad képenként (független pixelek: ${fmt(A.nll.indep, 1)}, egyenletes: ${A.nll.uniform}).`;
        else if (cur.i < 64) {
          const i = cur.i, z = w1ArZ(cur.x, i), p = sigm(z / T);
          info.innerHTML = `${i + 1}. pixel (${Math.floor(i / 8) + 1}. sor, ${i % 8 + 1}. oszlop): z = ${fmt(z, 2)}, ` +
            `p(fekete) = σ(z/T) = <b>${fmt(p, 3)}</b>, a húzott u = ${w1Fix(cur.u[i], 2)} → ${cur.u[i] < p ? "fekete" : "fehér"} lesz`;
        } else info.innerHTML = `Kész a kép. A „▶ Rajzolj!” újat kezd (mag ${seed}, ${nDraw}. kép).`;
        const n = cur ? cur.i : 0, ink1 = cur ? cur.x.slice(0, n).filter(v => v === 1).length : 0;
        stats.replaceChildren(
          st(cur ? fmt(w1ArBits(cur.x, n), 1) + " bit" : "–", n < 64 ? `meglepetés eddig (${n} pixel, T = 1 modell)` : "a kép meglepetése (T = 1 modell)"),
          st(n ? pct(ink1 / 64, 0) : "–", `tinta aránya (${ink1} / 64 fekete)`),
          st("mag " + seed, nDraw ? `${nDraw}. kép` : "még nincs kép"));
      } else {
        const outs = cv.outs || [], bits = outs.map(x => w1ArBits(x)), inks = outs.map(x => x.filter(v => v === 1).length / 64);
        const orig = A.test[sel], edited = inp.some((v, i) => i < keep * 8 && v !== orig[i]);
        info.innerHTML = `Megmarad ${keep * 8} pixel, ${64 - keep * 8} pixelt a modell rajzol (T = ${fmt(T, 2)}). ` +
          `<b>eredeti</b>: a tesztkép valódi folytatása (címke: ${A.testLabel[sel]})` + (edited ? "; a megtartott részt átírtad." : ".") +
          ` A képek alatt: a teljes kép meglepetése (T = 1 modell).`;
        const mean = a => a.reduce((s, v) => s + v, 0) / (a.length || 1);
        stats.replaceChildren(
          st(fmt(w1ArBits(orig), 1) + " bit", "az eredeti meglepetése"),
          st(fmt(mean(bits), 1) + " bit", "a 6 kiegészítés átlaga"),
          st(pct(orig.filter(v => v === 1).length / 64, 0) + " / " + pct(mean(inks), 0), "tinta: eredeti / kiegészítések"));
      }
    }
    cv.draw = draw; cvP.draw = draw;
    layout(); draw();
    /* „Új mag” a vezérlősorba */
    rowDraw.insertBefore(btn("Új mag", () => { stop(); seed++; nDraw = 0; cur = null; draw(); }), rowDraw.children[4]);
  };

  /* ------------------------------------------------------------------
     ae-bottleneck – szűk keresztmetszet: mély AE és PCA (14.3-b), GEN14.ae
     ------------------------------------------------------------------ */
  const w1Mse = (a, b) => a.reduce((s, v, i) => s + ((v - b[i]) / 16) ** 2, 0) / a.length;
  W["ae-bottleneck"] = root => {
    const D = GEN14.ae, ks = D.ks;
    header(root, "Szűk keresztmetszet",
      "Egy tesztszámjegy rekonstrukciója k számos kódból: felül a mély autoenkóder (64 → 128 → k → 128 → 64), alul a PCA (az első k főkomponens). " +
      "Kattints egy számjegyre, illetve egy oszlopra (vagy húzd a csúszkát)!");
    let sel = 3, ki = 2;
    const pickWrap = h("div", { style: "min-width:0;margin:.3rem 0" });
    const sK = slider(0, ks.length - 1, 1, ki), kLab = h("b", null, "");
    sK.oninput = () => { ki = +sK.value; draw(); };
    root.append(pickWrap, h("div", { class: "controls" }, h("label", null, "a kód mérete", sK, kLab)));
    const cvP = w1Canvas(pickWrap, w => Math.min(50, w / 10 - 6) + 18);
    const gWrap = h("div", { style: "min-width:0" });
    root.append(gWrap);
    const cvG = w1Canvas(gWrap, w => { const s = w1GS(w); return 18 + 2 * (s + 34) + 8; });
    const bigWrap = h("div", { style: "min-width:0;margin-top:.4rem" });
    root.append(bigWrap);
    const cvB = w1Canvas(bigWrap, w => Math.min(130, (w - 40) / 3) + 40, 520);
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(tw);

    function w1GS(w) { const L = w < 520 ? 0 : 0; return Math.min(80, (w - L - 7 * 6) / 7); }
    function drawPicker() {
      cvP.resize();
      const { ctx, w, h: H } = cvP, s = Math.min(50, w / 10 - 6), cw = w / 10;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      D.orig.forEach((img, k) => {
        const x = k * cw + (cw - s) / 2;
        drawDigit(ctx, x, 2, s, img, { frameVar: k === sel ? "--accent" : "--border", frameW: k === sel ? 3 : 1 });
        label(ctx, String(D.label[k]), x + s / 2, s + 16, css(k === sel ? "--accent" : "--muted"), "center", w1Font(11, k === sel ? 700 : 500));
      });
      cvP.geo = { cw };
    }
    cvP.c.addEventListener("pointerdown", e => { const [mx] = evXY(cvP, e), k = Math.floor(mx / cvP.geo.cw); if (k >= 0 && k < 10) { sel = k; draw(); } });

    function drawGrid() {
      cvG.resize();
      const { ctx, w, h: H } = cvG, s = w1GS(w), gap = (w - 7 * s) / 7, colX = c => gap / 2 + c * (s + gap);
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const rowY = r => 18 + r * (s + 34) + 14;
      /* kiemelt oszlop */
      const hx = colX(ki + 1) - gap / 2 + 2;
      ctx.fillStyle = css("--accent-soft"); ctx.fillRect(hx, 2, s + gap - 4, H - 4);
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.5; ctx.strokeRect(hx + 0.5, 2.5, s + gap - 5, H - 5); ctx.restore();
      label(ctx, "eredeti", colX(0) + s / 2, 14, css("--text"), "center", w1Font(11, 700));
      ks.forEach((k, j) => label(ctx, "k = " + k, colX(j + 1) + s / 2, 14, css(j === ki ? "--accent" : "--muted"), "center", w1Font(11, 700)));
      const o = D.orig[sel];
      [["mély AE", D.ae], ["PCA", D.pca]].forEach(([nm, src], r) => {
        const y = rowY(r);
        label(ctx, nm + (w > 520 ? " (a kép alatt: a hibája)" : ""), 2 + colX(1) - gap / 2 + 4, y - 3, css("--muted"), "left", w1Font(10, 600));
        ks.forEach((k, j) => {
          const rec = src[k][sel], x = colX(j + 1);
          drawDigit(ctx, x, y, s, rec, { frameVar: j === ki ? "--accent" : "--border" });
          label(ctx, w1Fix(w1Mse(o, rec), 3), x + s / 2, y + s + 13, css(j === ki ? "--text" : "--muted"), "center", w1Font(10, j === ki ? 700 : 500));
        });
      });
      const oy = (rowY(0) + rowY(1)) / 2;
      drawDigit(ctx, colX(0), oy, s, o, { frameVar: "--muted" });
      cvG.geo = { colX, s, gap };
    }
    cvG.c.addEventListener("pointerdown", e => {
      const g = cvG.geo; if (!g) return;
      const [mx] = evXY(cvG, e), c = Math.floor(mx / (g.s + g.gap));
      if (c >= 1 && c <= ks.length) { ki = c - 1; sK.value = ki; draw(); }
    });

    function drawBig() {
      cvB.resize();
      const { ctx, w, h: H } = cvB, s = Math.min(130, (w - 40) / 3), gap = (w - 3 * s) / 4, k = ks[ki], o = D.orig[sel];
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      [["eredeti", o, null], [`mély AE, k = ${k}`, D.ae[k][sel], "--setA"], [`PCA, k = ${k}`, D.pca[k][sel], "--setB"]].forEach(([nm, img, fr], j) => {
        const x = gap + j * (s + gap);
        drawDigit(ctx, x, 16, s, img, { frameVar: fr || "--muted", frameW: fr ? 3 : 1 });
        label(ctx, nm, x + s / 2, 13, css("--text"), "center", w1Font(11, 700));
        if (j) label(ctx, "hiba " + w1Fix(w1Mse(o, img), 3), x + s / 2, 16 + s + 16, css("--muted"), "center", w1Font(11, 600));
      });
    }

    function drawTable() {
      const cell = "padding:.18em .3em;text-align:center;border:1px solid var(--border);";
      const hi = j => (j === ki ? "background:var(--accent-soft);font-weight:700;" : "");
      const row = (nm, m) => `<tr><th style="${cell}text-align:left;white-space:nowrap">${nm}</th>` +
        ks.map((k, j) => `<td style="${cell}${hi(j)}">${w1Fix(m[k], 3)}</td>`).join("") + "</tr>";
      tw.innerHTML = `<table class="pix-table" style="border-collapse:collapse;font-size:.8rem;font-family:inherit">` +
        `<caption style="caption-side:top;text-align:left;font-family:inherit;font-size:.85rem;color:var(--muted);padding-bottom:.2rem">Átlagos hiba a 450 tesztképen</caption>` +
        `<tr><th style="${cell}text-align:left">k</th>${ks.map((k, j) => `<th style="${cell}${hi(j)}">${k}</th>`).join("")}</tr>` +
        row("PCA", D.msePCA) + row("mély AE", D.mseAE) + "</table>" +
        `<p class="muted" style="font-size:.82rem;margin:.3rem 0 0">Hiba: pixelenkénti átlagos négyzetes eltérés 0–1 skálán (0 = fehér, 1 = a legsötétebb).</p>`;
    }

    function draw() {
      kLab.textContent = "k = " + ks[ki];
      drawPicker(); drawGrid(); drawBig(); drawTable();
    }
    cvP.draw = draw; cvG.draw = draw; cvB.draw = draw;
    draw();
  };

  /* ------------------------------------------------------------------
     kl-explorer – mennyibe kerül a felhő? (14.4-b)
     ------------------------------------------------------------------ */
  const w1Npdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  const w1KL = (m, s) => [m * m / 2, 0.5 * (s * s - 1 - Math.log(s * s))];
  W["kl-explorer"] = root => {
    header(root, "Mennyibe kerül a felhő?",
      "A kódoló egy kép kódját $\\mathcal N(\\mu, \\sigma^2)$ felhőként adja meg; a KL-tag azt méri, mennyire tér el ez a priortól, $\\mathcal N(0, 1)$-től. " +
      "Húzd a csúszkákat, vagy válassz egy példát!");
    let mu = 1, sg = 0.5;
    const sM = slider(-3, 3, 0.05, mu), sS = slider(0.05, 3, 0.05, sg), mLab = h("b"), sLab = h("b");
    sM.oninput = () => { mu = +sM.value; draw(); };
    sS.oninput = () => { sg = +sS.value; draw(); };
    root.append(h("div", { class: "controls" }, h("label", null, "μ", sM, mLab), h("label", null, "σ", sS, sLab)));
    const presets = [[0, 1], [1, 0.5], [2, 0.5], [0, 0.1], [0, 2]];
    const pb = presets.map(([m, s]) => btn(`(${fmt(m, 1)}; ${fmt(s, 1)})`, () => { mu = m; sg = s; sM.value = m; sS.value = s; draw(); }));
    root.append(h("div", { class: "controls" }, small("példák (μ; σ):"), pb));
    const [cvA, cvV, , R] = twoCanvas(root, 0.68, 0.86);
    const capV = h("p", { class: "muted", style: "font-size:.82rem;margin:.25rem 0 0" });
    R.append(capV);
    const ro = h("div", { class: "readout" }), bar = h("div", { style: "display:flex;height:14px;border-radius:4px;overflow:hidden;background:var(--bg-soft);margin-top:.4rem" });
    const stats = h("div", { class: "stat-row" });
    root.append(ro, stats);
    ro.after(bar);

    function curve(ctx, T, f, a, b, color, width, dash, fill) {
      const pts = [];
      for (let i = 0; i <= 400; i++) { const x = a + (b - a) * i / 400; pts.push([x, f(x)]); }
      if (fill) {
        ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(T.tx(a), T.ty(0));
        pts.forEach(([x, y]) => ctx.lineTo(T.tx(x), T.ty(y))); ctx.lineTo(T.tx(b), T.ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      polyline(ctx, T, pts, color, width, dash);
    }
    function drawKL() {
      cvA.resize();
      const peak = Math.max(w1Npdf(0, 0, 1), w1Npdf(mu, mu, sg));
      const view = { xmin: -5, xmax: 5, ymin: -0.03 * peak * 1.15, ymax: peak * 1.15, xstep: 1, ystep: peak > 2 ? 1 : peak > 1 ? 0.5 : 0.1, xname: "z", yname: "" };
      const T = Calc.plot(cvA, view, []), ctx = cvA.ctx;
      curve(ctx, T, x => w1Npdf(x, mu, sg), -5, 5, css("--setA"), 2.5, [], rgba(css("--setA"), 0.28));
      curve(ctx, T, x => w1Npdf(x, 0, 1), -5, 5, css("--text"), 2, [6, 4]);
      label(ctx, "prior N(0, 1)", T.tx(-4.8), T.ty(view.ymax) + 14, css("--text"), "left", w1Font(11, 600));
      label(ctx, "felhő N(μ, σ²)", T.tx(-4.8), T.ty(view.ymax) + 30, css("--setA"), "left", w1Font(11, 700));
      /* μ jelölése: a hely-tag */
      if (Math.abs(mu) > 0.02) {
        const y = T.ty(0) - 8;
        arrow(ctx, T.tx(0), y, T.tx(mu), y, css("--setB"), 2.5);
      }
    }
    function drawVAE() {
      cvV.resize();
      const w = cvV.w, s = sg, peak = w1Npdf(1, 1, s), top = peak * 1.15, iconS = clamp(w * 0.055, 14, 22);
      const r = (iconS + 32) / (cvV.h - 8), ymin = -r * top / (1 - r);
      const view = { xmin: -3, xmax: 3, ymin, ymax: top, xstep: 1, ystep: top > 2 ? 1 : top > 1 ? 0.5 : 0.2, xname: "z", yname: "", labels: true };
      const T = Calc.plot(cvV, view, []), ctx = cvV.ctx;
      const f1 = x => w1Npdf(x, 1, s), f2 = x => w1Npdf(x, -1, s);
      /* közös terület */
      ctx.save(); ctx.fillStyle = rgba(css("--accent"), 0.35); ctx.beginPath(); ctx.moveTo(T.tx(-3), T.ty(0));
      for (let i = 0; i <= 400; i++) { const x = -3 + 6 * i / 400; ctx.lineTo(T.tx(x), T.ty(Math.min(f1(x), f2(x)))); }
      ctx.lineTo(T.tx(3), T.ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      curve(ctx, T, f1, -3, 3, css("--setA"), 2.5, []);
      curve(ctx, T, f2, -3, 3, css("--setB"), 2.5, []);
      label(ctx, "alsó csík (μ = −1)", T.tx(-2.95), T.ty(top) + 14, css("--setB"), "left", w1Font(11, 700));
      label(ctx, "felső csík (μ = 1)", T.tx(2.95), T.ty(top) + 14, css("--setA"), "right", w1Font(11, 700));
      /* a dekódoló képei a tengely mentén */
      [-2, -1, -0.5, 0, 0.5, 1, 2].forEach(z => {
        const v = [0.5, 0.5, -0.5, -0.5].map(d => clamp(0.5 + z * d, 0, 1)), x = T.tx(z), y = T.ty(0) + 20;
        ctx.fillStyle = css("--muted"); ctx.fillRect(x - 0.5, T.ty(0), 1, 18);
        w1Icon(ctx, x - iconS / 2, y, iconS, v, { grid: false });
      });
      label(ctx, "d(z):", 4, T.ty(0) + 20 + iconS / 2, css("--muted"), "left", w1Font(10, 600), "middle");
    }
    function overlap(s) {
      let a = 0; const n = 4000, lo = -10, hi = 10, dx = (hi - lo) / n;
      for (let i = 0; i <= n; i++) { const x = lo + i * dx, v = Math.min(w1Npdf(x, 1, s), w1Npdf(x, -1, s)); a += (i === 0 || i === n ? 0.5 : 1) * v * dx; }
      return a;
    }
    function draw() {
      mLab.textContent = fmt(mu, 2); sLab.textContent = fmt(sg, 2);
      pb.forEach((b, i) => b.classList.toggle("on", Math.abs(presets[i][0] - mu) < 1e-9 && Math.abs(presets[i][1] - sg) < 1e-9));
      drawKL(); drawVAE();
      const [a, b] = w1KL(mu, sg), kl = a + b, sw = c => `<span style="color:var(${c})">■</span>`;
      ro.innerHTML = `KL = ½(μ² + σ² − 1 − ln σ²) = ${sw("--setB")} μ²/2 + ${sw("--setC")} ½(σ² − 1 − ln σ²) = ` +
        `${fmt(a, 3)} + ${fmt(b, 3)} = <b>${fmt(kl, 2)}</b> nat`;
      const sc = Math.max(3, kl);
      bar.innerHTML = `<div title="hely" style="width:${100 * a / sc}%;background:var(--setB)"></div><div title="szélesség" style="width:${100 * b / sc}%;background:var(--setC)"></div>`;
      const ov = overlap(sg), [, bv] = w1KL(1, sg);
      const st = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l", html: l }));
      stats.replaceChildren(
        st(fmt(kl, 2), "KL (nat)"),
        st(fmt(a, 2), `${sw("--setB")} „hely”: μ²/2`),
        st(fmt(b, 2), `${sw("--setC")} „szélesség”`),
        st(pct(ov, 1), `a két csíkfelhő átfedése (σ = ${fmt(sg, 2)})`),
        st(fmt(0.5 + bv, 2), "egy csíkfelhő KL-je (μ = ±1)"));
      capV.innerHTML = `A második rajz: a 2 × 2-es világ 1D-s VAE-je, mindkét felhő szórása σ. Kitöltve a két görbe közös területe; alul, mit rajzol a dekódoló ` +
        `d(z) = 0,5 + z·(0,5; 0,5; −0,5; −0,5) a z = −2; −1; −0,5; 0; 0,5; 1; 2 pontokban.`;
    }
    cvA.draw = draw; cvV.draw = draw;
    draw();
  };
  /* ==================================================================
     2. ágens: latent-map, gan-1d, gan-epochs, gen-compare
     ================================================================== */
  /* rögzített tizedesjegyek (a fmt levágja a záró nullákat) */
  const w2Fix = (x, d) => { const s = Math.abs(x).toFixed(d).replace(".", ","); return (x < 0 && +s.replace(",", ".") !== 0 ? "−" : "") + s; };
  const w2Pct = (a, d = 0) => w2Fix(100 * a, d) + "%";
  /* kis számok: 0,0123 vagy 8,9·10⁻⁵ */
  const w2Sci = x => {
    if (!Number.isFinite(x)) return "–";
    if (x === 0 || Math.abs(x) >= 0.001) return w2Fix(x, Math.abs(x) >= 0.1 ? 2 : 4);
    const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e, sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    return w2Fix(m, 1) + "·10⁻" + String(-e).split("").map(c => sup[+c]).join("");
  };
  const w2Swatch = col => h("span", { style: `display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${col};vertical-align:-.05em;margin-right:.25em;flex:none` });
  /* animáció: csak ha fut és látszik */
  function w2Anim(root, frame) {
    let on = false, vis = true, id = 0;
    const loop = () => { id = 0; if (!on || !vis) return; frame(); if (on) id = requestAnimationFrame(loop); };
    const kick = () => { if (on && vis && !id) id = requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; kick(); }).observe(root);
    return { start() { on = true; kick(); }, stop() { on = false; }, get running() { return on; } };
  }
  /* számjegyrács: imgs (0…16), cols oszlop, a cellák bal felső sarka (x0, y0), cellaméret s, rés g */
  function w2Grid(ctx, imgs, cols, x0, y0, s, g, opts = {}) {
    imgs.forEach((v, i) => drawDigit(ctx, x0 + (i % cols) * (s + g), y0 + Math.floor(i / cols) * (s + g), s, v, opts));
  }
  const w2Data = () => window.GEN14;
  /* felirat háttérszínű körvonallal (pontfelhő fölött is olvasható) */
  function w2Halo(ctx, txt, x, y, color, font = "700 12px system-ui, sans-serif") {
    ctx.save(); ctx.font = font; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeStyle = css("--card"); ctx.strokeText(txt, x, y);
    ctx.fillStyle = color; ctx.fillText(txt, x, y); ctx.restore();
  }
  /* képek átlagos páronkénti euklideszi távolsága (sokféleség) */
  const w2Div = I => { let t = 0, n = 0; for (let i = 0; i < I.length; i++) for (let j = i + 1; j < I.length; j++) { let d = 0; for (let k = 0; k < 64; k++) d += (I[i][k] - I[j][k]) ** 2; t += Math.sqrt(d); n++; } return t / n; };
  const w2NoData = root => root.append(small("(A 14. fejezet adatfájlja – gen-data.js – nincs betöltve.)"));

  /* ==================================================================
     14.3-c, 14.4-c  latent-map – a látens tér térképe
     ================================================================== */
  W["latent-map"] = root => {
    header(root, "A látens tér térképe",
      "Minden pont egy tanítókép kódja ($\\mathbf z \\in \\mathbb R^2$), a színe a számjegy. Húzd a célkeresztet: jobbra a dekódoló rajza ebből a kódból. " +
      "Hasonlítsd össze az autoenkódert és a VAE-t: hol van a kódfelhő, és mit rajzol a dekódoló egy $\\mathcal N(0, I)$-ből sorsolt kódból?");
    const G = w2Data();
    if (!G || !G.latent) return w2NoData(root);
    const LT = G.latent;
    let mode = "ae", z = [0, 0], rand = null, randSeed = 0, ia = 1, ib = 7, T = null;
    const tg = toggleGroup([["ae", "autoenkóder"], ["vae", "VAE"]], () => mode, k => { mode = k; rand = null; z = [0, 0]; draw(); });
    const bRand = btn("Véletlen kód 𝒩(0, I)-ből", () => {
      randSeed++;
      const r = rng(1000 + randSeed);
      rand = Array.from({ length: 16 }, () => [gauss(r), gauss(r)]);
      z = rand[0].slice(); draw();
    });
    const bOrig = btn("Célkereszt az origóba", () => { z = [0, 0]; draw(); });
    root.append(h("div", { class: "controls" }, ...tg.bs, bRand, bOrig));
    const [cvS, cvD, Lc] = twoCanvas(root, 0.9, 0.56);
    const leg = h("div", { style: "display:flex;flex-wrap:wrap;gap:.2rem .7rem;font-size:.85rem;justify-content:center;margin-top:.3rem" },
      DIGIT_COLORS.map((c, i) => h("span", { style: "display:inline-flex;align-items:center" }, w2Swatch(c), String(i))));
    Lc.append(leg);
    const out = h("div", { class: "readout" });
    root.append(out);
    /* interpoláció */
    const mkSel = v => { const s = h("select", null, ...Array.from({ length: 10 }, (_, i) => h("option", { value: i }, i + "-es"))); s.value = v; return s; };
    const sA = mkSel(ia), sB = mkSel(ib);
    sA.addEventListener("change", () => { ia = +sA.value; draw(); });
    sB.addEventListener("change", () => { ib = +sB.value; draw(); });
    root.append(h("div", { style: "font-weight:600;margin-top:.9rem" }, "Interpoláció két tesztkép között"),
      h("div", { class: "controls" }, h("label", null, "A:", sA), h("label", null, "B:", sB),
        small("7 lépés: t = 0, 1/6, …, 1. A kódokat a térképen a vonal mutatja.")));
    const ibox = h("div", { style: "max-width:600px" });
    root.append(ibox);
    const cvI = Calc.canvas(ibox, flatAspect(root, 0.33, 0.42), 600);

    const M = () => LT[mode];
    const dec = zz => mlpForward(M().dec, zz).map(v => v * 16);
    function viewOf() {
      const P = M().z;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      P.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
      const R = mode === "vae" ? 2.1 : 1.05;
      x0 = Math.min(x0, -R); x1 = Math.max(x1, R); y0 = Math.min(y0, -R); y1 = Math.max(y1, R);
      const mx = 0.06 * (x1 - x0), my = 0.06 * (y1 - y0);
      return eqView(cvS, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + mx, (y1 - y0) / 2 + my, { xname: "z₁", yname: "z₂" });
    }
    function drawS() {
      const V = viewOf();
      T = Calc.plot(cvS, V, []);
      const ctx = cvS.ctx, P = M().z, lab = LT.label;
      const sc = (T.tx(1) - T.tx(0));
      if (mode === "vae") {
        ring(ctx, T.tx(0), T.ty(0), sc, css("--text"), 1.5, [5, 4]);
        ring(ctx, T.tx(0), T.ty(0), 2 * sc, css("--muted"), 1.3, [5, 4]);

      } else {
        ring(ctx, T.tx(0), T.ty(0), sc, rgba(css("--muted"), 0.8), 1.3, [3, 3]);

      }
      P.forEach(([a, b], i) => dot(ctx, T.tx(a), T.ty(b), 2.4, rgba(DIGIT_COLORS[lab[i]], 0.85)));
      /* interpolációs vonal */
      const zA = M().test[ia], zB = M().test[ib];
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(T.tx(zA[0]), T.ty(zA[1])); ctx.lineTo(T.tx(zB[0]), T.ty(zB[1])); ctx.stroke(); ctx.restore();
      for (let k = 0; k <= 6; k++) { const t = k / 6; dot(ctx, T.tx(zA[0] + t * (zB[0] - zA[0])), T.ty(zA[1] + t * (zB[1] - zA[1])), 3, css("--text"), true, 1.5); }
      w2Halo(ctx, "A", T.tx(zA[0]) + 6, T.ty(zA[1]) - 4, css("--text"));
      w2Halo(ctx, "B", T.tx(zB[0]) + 6, T.ty(zB[1]) - 4, css("--text"));
      if (mode === "vae") {
        w2Halo(ctx, "1σ", T.tx(0) + sc * 0.72 + 3, T.ty(0) - sc * 0.72, css("--text"));
        w2Halo(ctx, "2σ", T.tx(0) + sc * 1.42 + 3, T.ty(0) - sc * 1.42, css("--muted"));
      } else w2Halo(ctx, "egységkör", T.tx(0) + sc * 0.72 + 3, T.ty(0) - sc * 0.72, css("--muted"), "600 11px system-ui, sans-serif");
      /* véletlen kódok */
      if (rand) rand.forEach(([a, b]) => {
        const x = T.tx(a), y = T.ty(b);
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 4, y - 4); ctx.stroke(); ctx.restore();
      });
      /* célkereszt */
      const cx = T.tx(z[0]), cy = T.ty(z[1]);
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 14, cy); ctx.lineTo(cx - 4, cy); ctx.moveTo(cx + 4, cy); ctx.lineTo(cx + 14, cy);
      ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy - 4); ctx.moveTo(cx, cy + 4); ctx.lineTo(cx, cy + 14); ctx.stroke(); ctx.restore();
      ring(ctx, cx, cy, 9, css("--accent"), 2);
    }
    function drawD() {
      const { ctx, w, h: hh } = cvD;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const s = Math.min(hh - 26, w / 2 - 12);
      label(ctx, "dekódolt kép", 6, 16, css("--muted"), "left", "600 12px system-ui, sans-serif");
      drawDigit(ctx, 6, 22, s, dec(z), { frameVar: "--accent", frameW: 2 });
      const gx = w / 2 + 6;
      if (rand) {
        label(ctx, "16 kód 𝒩(0, I)-ből", gx, 16, css("--muted"), "left", "600 12px system-ui, sans-serif");
        const g = 3, c = (s - 3 * g) / 4;
        w2Grid(ctx, rand.map(dec), 4, gx, 22, c, g);
      } else {
        label(ctx, "Nyomd meg:", gx, 22 + s / 2 - 8, css("--muted"), "left", "600 12px system-ui, sans-serif");
        label(ctx, "„Véletlen kód”", gx, 22 + s / 2 + 10, css("--muted"), "left", "600 12px system-ui, sans-serif");
      }
    }
    function drawI() {
      const { ctx, w, h: hh } = cvI;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const g = 6, s = Math.min((w - 6 * g - 2) / 7, (hh - 2 * 18 - 8) / 2), x0 = 1;
      const zA = M().test[ia], zB = M().test[ib], xA = LT.testOrig[ia], xB = LT.testOrig[ib];
      label(ctx, "keverés a kódban: d((1 − t)·z_A + t·z_B)", x0, 15, css("--accent"), "left", "600 12px system-ui, sans-serif");
      const y2 = 18 + s + 8;
      label(ctx, "keverés a pixelekben: (1 − t)·x_A + t·x_B", x0, y2 + 15, css("--muted"), "left", "600 12px system-ui, sans-serif");
      for (let k = 0; k <= 6; k++) {
        const t = k / 6, x = x0 + k * (s + g);
        drawDigit(ctx, x, 18, s, dec([zA[0] + t * (zB[0] - zA[0]), zA[1] + t * (zB[1] - zA[1])]), { frameVar: "--accent" });
        drawDigit(ctx, x, y2 + 18, s, xA.map((v, i) => (1 - t) * v + t * xB[i]));
      }
    }
    function readout() {
      const P = M().z, lab = LT.label;
      let bi = 0, bd = Infinity;
      P.forEach(([a, b], i) => { const d = Math.hypot(a - z[0], b - z[1]); if (d < bd) { bd = d; bi = i; } });
      const r = Math.hypot(z[0], z[1]);
      out.innerHTML = `z = (${w2Fix(z[0], 2)}; ${w2Fix(z[1], 2)}) · legközelebbi tanítókód: <b>${lab[bi]}</b>-es számjegy, ${w2Fix(bd, 2)} távolságra` +
        `<br><span class="muted">` + (mode === "vae"
          ? `A prior szerint a kódok ${w2Pct(1 - Math.exp(-r * r / 2))}-a esik ennél (|z| = ${w2Fix(r, 2)}) közelebb az origóhoz. A VAE kódfelhője kitölti a 𝒩(0, I) körét, ezért a sorsolt kód szinte mindig a felhőbe esik.`
          : `Az autoenkóder kódjai a (${w2Fix(Math.min(...P.map(p => p[0])), 1)} … ${w2Fix(Math.max(...P.map(p => p[0])), 1)}) × (${w2Fix(Math.min(...P.map(p => p[1])), 1)} … ${w2Fix(Math.max(...P.map(p => p[1])), 1)}) téglalapban szóródnak, ` +
            `nem az egységkörben: egy 𝒩(0, I)-ből sorsolt kód a felhő szélére vagy egy lyukba esik.`) + "</span>";
    }
    function draw() { tg.paint(); cvS.draw = drawS; cvD.draw = drawD; cvI.draw = drawI; drawS(); drawD(); drawI(); readout(); }
    /* húzás */
    let drag = false;
    const setZ = e => { if (!T) return; const [px, py] = evXY(cvS, e); z = [T.ix(px), T.iy(py)]; drawS(); drawD(); readout(); };
    cvS.c.style.cursor = "crosshair";
    cvS.c.addEventListener("pointerdown", e => { drag = true; cvS.c.setPointerCapture(e.pointerId); setZ(e); });
    cvS.c.addEventListener("pointermove", e => { if (drag) setZ(e); });
    const end = () => { drag = false; };
    cvS.c.addEventListener("pointerup", end); cvS.c.addEventListener("pointercancel", end);
    draw();
  };

  /* ==================================================================
     14.5-b/c  gan-1d – hamisító és detektív egy egyenesen
     ================================================================== */
/*GANCORE-BEGIN*/
  /* --- 1D GAN: kis MLP kézzel írt visszaterjesztéssel és Adammal --- */
  function w2Gauss(rnd) { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); }
  function w2Net(sizes, act, rnd) {
    const L = [];
    for (let l = 0; l + 1 < sizes.length; l++) {
      const nin = sizes[l], nout = sizes[l + 1];
      const sd = Math.sqrt((act === "tanh" ? 1 : 2) / nin);
      const Wt = new Float64Array(nin * nout), b = new Float64Array(nout);
      for (let i = 0; i < Wt.length; i++) Wt[i] = sd * w2Gauss(rnd);
      L.push({ nin, nout, W: Wt, b, gW: new Float64Array(Wt.length), gb: new Float64Array(nout),
        mW: new Float64Array(Wt.length), vW: new Float64Array(Wt.length), mb: new Float64Array(nout), vb: new Float64Array(nout) });
    }
    return { L, act, t: 0 };
  }
  const w2Act = (a, z) => (a === "tanh" ? Math.tanh(z) : (z > 0 ? z : 0.2 * z));
  const w2dAct = (a, z) => (a === "tanh" ? 1 - Math.tanh(z) ** 2 : (z > 0 ? 1 : 0.2));
  /* előreszámolás egy batchen (x: n×1); a kimenet lineáris (a D-nél ez a logit) */
  function w2Fwd(net, x) {
    const n = x.length, cache = [x];
    let a = x;
    net.L.forEach((Ly, li) => {
      const z = new Float64Array(n * Ly.nout), last = li === net.L.length - 1;
      for (let s = 0; s < n; s++) for (let j = 0; j < Ly.nout; j++) {
        let v = Ly.b[j];
        for (let i = 0; i < Ly.nin; i++) v += Ly.W[j * Ly.nin + i] * a[s * Ly.nin + i];
        z[s * Ly.nout + j] = v;
      }
      cache.push(z);
      if (!last) { const o = new Float64Array(z.length); for (let k = 0; k < z.length; k++) o[k] = w2Act(net.act, z[k]); a = o; cache.push(o); }
      else a = z;
    });
    return { out: a, cache };
  }
  /* visszaterjesztés: g = dL/d(kimenet); accum: a paraméter-gradiensek gyűjtése; visszaadja dL/d(bemenet) */
  function w2Bwd(net, c, g, accum) {
    const n = g.length;
    let d = g;
    for (let li = net.L.length - 1; li >= 0; li--) {
      const Ly = net.L[li], last = li === net.L.length - 1;
      const z = c.cache[1 + 2 * li], ain = li === 0 ? c.cache[0] : c.cache[2 * li];
      const dz = new Float64Array(n * Ly.nout);
      for (let k = 0; k < dz.length; k++) dz[k] = last ? d[k] : d[k] * w2dAct(net.act, z[k]);
      if (accum) for (let s = 0; s < n; s++) for (let j = 0; j < Ly.nout; j++) {
        const q = dz[s * Ly.nout + j];
        Ly.gb[j] += q;
        for (let i = 0; i < Ly.nin; i++) Ly.gW[j * Ly.nin + i] += q * ain[s * Ly.nin + i];
      }
      const da = new Float64Array(n * Ly.nin);
      for (let s = 0; s < n; s++) for (let i = 0; i < Ly.nin; i++) {
        let v = 0;
        for (let j = 0; j < Ly.nout; j++) v += Ly.W[j * Ly.nin + i] * dz[s * Ly.nout + j];
        da[s * Ly.nin + i] = v;
      }
      d = da;
    }
    return d;
  }
  function w2Zero(net) { net.L.forEach(Ly => { Ly.gW.fill(0); Ly.gb.fill(0); }); }
  function w2Adam(net, lr, b1 = 0.5, b2 = 0.999, eps = 1e-8) {
    net.t++;
    const c1 = 1 - b1 ** net.t, c2 = 1 - b2 ** net.t;
    const up = (p, g, m, v) => { for (let k = 0; k < p.length; k++) { m[k] = b1 * m[k] + (1 - b1) * g[k]; v[k] = b2 * v[k] + (1 - b2) * g[k] * g[k]; p[k] -= lr * (m[k] / c1) / (Math.sqrt(v[k] / c2) + eps); } };
    net.L.forEach(Ly => { up(Ly.W, Ly.gW, Ly.mW, Ly.vW); up(Ly.b, Ly.gb, Ly.mb, Ly.vb); });
  }
  const w2Sp = s => (s > 0 ? s + Math.log1p(Math.exp(-s)) : Math.log1p(Math.exp(s)));   /* softplus(s) = −ln σ(−s) */
  const W2_DATA = {
    one: { name: "egy csúcs", comp: [[1, 2, 0.5]] },
    two: { name: "két csúcs", comp: [[0.5, -2, 0.4], [0.5, 2, 0.4]] },
    three: { name: "három csúcs", comp: [[1 / 3, -3, 0.35], [1 / 3, 0, 0.35], [1 / 3, 3, 0.35]] }
  };
  function w2Real(kind, rnd, n) {
    const C = W2_DATA[kind].comp, x = new Float64Array(n);
    for (let s = 0; s < n; s++) {
      let u = rnd(), k = 0;
      while (k < C.length - 1 && u > C[k][0]) { u -= C[k][0]; k++; }
      x[s] = C[k][1] + C[k][2] * w2Gauss(rnd);
    }
    return x;
  }
  /* GAN-állapot: o = { data, loss: "ns" | "mm", lr, dSteps, act, seed, batch } */
  function w2GanNew(o) {
    const rnd = rng(o.seed);
    const S = Object.assign({ rnd, step: 0, G: w2Net([1, 16, 16, 1], o.act, rnd), D: w2Net([1, 16, 16, 1], o.act, rnd), hist: [] }, o);
    if (o.far) S.G.L[S.G.L.length - 1].b[0] -= 4;      /* a hamisító messziről indul: G(z) − 4 */
    return S;
  }
  /* egy G-lépés (előtte dSteps D-lépés); hist: [D vesztesége, G vesztesége, |dL_G/dx| átlaga] */
  function w2GanStep(S) {
    const n = S.batch, rnd = S.rnd;
    let lD = 0, lG = 0, gx = 0;
    for (let k = 0; k < S.dSteps; k++) {
      const xr = w2Real(S.data, rnd, n), z = new Float64Array(n);
      for (let s = 0; s < n; s++) z[s] = w2Gauss(rnd);
      const xf = w2Fwd(S.G, z).out;
      w2Zero(S.D);
      const cr = w2Fwd(S.D, xr), cf = w2Fwd(S.D, xf);
      const gr = new Float64Array(n), gf = new Float64Array(n);
      lD = 0;
      for (let s = 0; s < n; s++) {
        const a = cr.out[s], b = cf.out[s];
        lD += w2Sp(-a) + w2Sp(b);                       /* −ln D(x) − ln(1 − D(G(z))) */
        gr[s] = -sigm(-a) / n; gf[s] = sigm(b) / n;
      }
      lD /= n;
      w2Bwd(S.D, cr, gr, true); w2Bwd(S.D, cf, gf, true);
      w2Adam(S.D, S.lr * (S.dMul || 1));
    }
    const z = new Float64Array(n);
    for (let s = 0; s < n; s++) z[s] = w2Gauss(rnd);
    const cg = w2Fwd(S.G, z), cd = w2Fwd(S.D, cg.out);
    const g = new Float64Array(n);
    for (let s = 0; s < n; s++) {
      const b = cd.out[s];
      if (S.loss === "ns") { lG += w2Sp(-b); g[s] = -sigm(-b) / n; }   /* −ln D(G(z)) */
      else { lG += -w2Sp(b); g[s] = -sigm(b) / n; }                    /* ln(1 − D(G(z))) */
    }
    lG /= n;
    w2Zero(S.G);
    const dx = w2Bwd(S.D, cd, g, false);
    for (let s = 0; s < n; s++) gx += Math.abs(dx[s]);
    w2Bwd(S.G, cg, dx, true);
    w2Adam(S.G, S.lr);
    S.step++;
    S.hist.push([lD, lG, gx]);
    return [lD, lG, gx];
  }
/*GANCORE-END*/
  const W2_LR = [0.0005, 0.001, 0.002, 0.003, 0.005, 0.01];

  W["gan-1d"] = root => {
    header(root, "Hamisító és detektív egy egyenesen",
      "Egy kis GAN tanul élőben. A generátor (hamisító) egy $z \\sim \\mathcal N(0, 1)$ számból egy $x = G(z)$ számot készít; a diszkriminátor (detektív) " +
      "minden $x$-re megmondja, mennyire hiszi valódinak: $D(x) \\in [0; 1]$. Indítsd el, és figyeld, hogyan húzódik a generált hisztogram a valódira, " +
      "miközben $D(x)$ a 0,5 felé simul. Két csúcsnál próbálj több magot: megtalálja-e mindkettőt?");
    const st = { data: "one", loss: "ns", lrI: 3, dSteps: 2, speed: 5, seed: 1, act: "leaky", far: false };
    let S = null;
    const tgD = toggleGroup(Object.entries(W2_DATA).map(([k, v]) => [k, v.name]), () => st.data, k => { st.data = k; reset(); });
    const tgL = toggleGroup([["ns", "nem telítődő: −ln D(G(z))"], ["mm", "minimax: ln(1 − D(G(z)))"]], () => st.loss, k => { st.loss = k; reset(); });
    const sLr = slider(0, W2_LR.length - 1, 1, st.lrI), oLr = h("b"), sDs = slider(1, 5, 1, st.dSteps), oDs = h("b"), sSp = slider(1, 50, 1, st.speed), oSp = h("b");
    sLr.addEventListener("input", () => { st.lrI = +sLr.value; S.lr = W2_LR[st.lrI]; paintCtl(); });
    sDs.addEventListener("input", () => { st.dSteps = +sDs.value; S.dSteps = st.dSteps; paintCtl(); });
    sSp.addEventListener("input", () => { st.speed = +sSp.value; paintCtl(); });
    const bRun = btn("▶ Indítás", () => { if (anim.running) { anim.stop(); } else anim.start(); paintCtl(); }, "btn primary");
    const bStep = btn("1 lépés", () => { w2GanStep(S); drawAll(); });
    const bReset = btn("Újrakezdés", () => reset());
    const bSeed = btn("Új mag", () => { st.seed++; reset(); });
    const oSeed = h("b");
    const cFar = checkbox(st.far, () => { st.far = cFar.checked; reset(); });
    root.append(h("div", { class: "controls" }, small("valódi adat:"), ...tgD.bs),
      h("div", { class: "controls" }, small("G vesztesége:"), ...tgL.bs),
      h("div", { class: "controls" }, h("label", null, cFar, "a hamisító messziről indul (G kimenete − 4)")),
      h("div", { class: "controls" }, h("label", null, "tanulási ráta:", sLr, oLr), h("label", null, "D lépései G-lépésenként:", sDs, oDs),
        h("label", null, "lépés / képkocka:", sSp, oSp)),
      h("div", { class: "controls" }, bRun, bStep, bReset, bSeed, h("span", { class: "muted", style: "font-size:.92rem" }, "mag: ", oSeed)));
    const box = h("div", { style: "max-width:760px" });
    root.append(box);
    const cv = Calc.canvas(box, flatAspect(root, 0.42, 0.7), 760);
    const cvL = Calc.canvas(box, flatAspect(root, 0.2, 0.36), 760);
    const out = h("div", { class: "readout" });
    root.append(out);

    const ZE = (() => { const r = rng(999); return Float64Array.from({ length: 2000 }, () => w2Gauss(r)); })();
    let real = null, realX = null, gen = null;
    const XMIN = -7, XMAX = 7, NB = 112, BW = (XMAX - XMIN) / NB;
    const hist = x => { const c = new Float64Array(NB); x.forEach(v => { const k = Math.floor((v - XMIN) / BW); if (k >= 0 && k < NB) c[k]++; }); return c.map(v => v / (x.length * BW)); };
    const dens = x => W2_DATA[st.data].comp.reduce((s, [p, m, sd]) => s + p * Math.exp(-((x - m) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)), 0);
    function reset() {
      S = w2GanNew({ data: st.data, loss: st.loss, lr: W2_LR[st.lrI], dSteps: st.dSteps, act: st.act, seed: st.seed, batch: 64, far: st.far });
      realX = w2Real(st.data, rng(777), 4000); real = hist(realX);
      drawAll(); paintCtl();
    }
    function paintCtl() {
      tgD.paint(); tgL.paint();
      oLr.textContent = fmt(W2_LR[st.lrI], 4); oDs.textContent = st.dSteps; oSp.textContent = st.speed; oSeed.textContent = st.seed;
      bRun.textContent = anim && anim.running ? "⏸ Szünet" : "▶ Indítás";
    }
    function drawMain() {
      const { ctx, w, h: hh } = cv;
      const ymax = 1.5 * Math.max(...Array.from({ length: 200 }, (_, i) => dens(XMIN + i * (XMAX - XMIN) / 199)));
      const ml = 6, mr = 30, mt = 22, mb = 20;
      const tx = x => ml + (x - XMIN) / (XMAX - XMIN) * (w - ml - mr), ty = y => hh - mb - y / ymax * (hh - mt - mb);
      const tD = d => hh - mb - d * (hh - mt - mb);
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      /* tengely */
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
      for (let x = XMIN; x <= XMAX; x++) { ctx.moveTo(tx(x), mt); ctx.lineTo(tx(x), hh - mb); }
      ctx.stroke();
      ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(ml, hh - mb); ctx.lineTo(w - mr, hh - mb); ctx.moveTo(w - mr, mt); ctx.lineTo(w - mr, hh - mb); ctx.stroke();
      for (let x = XMIN; x <= XMAX; x++) label(ctx, fmt(x, 0), tx(x), hh - mb + 3, css("--muted"), "center", "11px system-ui, sans-serif", "top");
      [0, 0.5, 1].forEach(d => label(ctx, fmt(d, 1), w - mr + 4, tD(d), css("--accent"), "left", "11px system-ui, sans-serif", "middle"));
      label(ctx, "D(x)", w - 2, mt - 6, css("--accent"), "right", "600 11px system-ui, sans-serif", "bottom");
      /* hisztogramok */
      const bar = (c, col, a) => {
        ctx.fillStyle = rgba(col, a);
        c.forEach((v, k) => { if (v <= 0) return; const y = ty(Math.min(v, ymax)); ctx.fillRect(tx(XMIN + k * BW), y, tx(XMIN + (k + 1) * BW) - tx(XMIN + k * BW) - 0.5, hh - mb - y); });
      };
      bar(real, css("--setA"), 0.38);
      const gh = hist(gen);
      bar(gh, css("--setB"), 0.55);
      /* túlcsorduló oszlop jelzése */
      gh.forEach((v, k) => { if (v > ymax) label(ctx, "▲", tx(XMIN + (k + 0.5) * BW), mt + 2, css("--setB"), "center", "10px system-ui, sans-serif", "top"); });
      /* a képen kívül eső generált minták */
      const lo = gen.filter(v => v < XMIN).length / gen.length, hi = gen.filter(v => v >= XMAX).length / gen.length;
      if (lo >= 0.005) label(ctx, "◀ " + w2Pct(lo), ml + 2, hh - mb - 6, css("--setB"), "left", "700 12px system-ui, sans-serif", "bottom");
      if (hi >= 0.005) label(ctx, w2Pct(hi) + " ▶", w - mr - 2, hh - mb - 6, css("--setB"), "right", "700 12px system-ui, sans-serif", "bottom");
      /* D(x) */
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ml, tD(0.5)); ctx.lineTo(w - mr, tD(0.5)); ctx.stroke(); ctx.restore();
      const xs = Float64Array.from({ length: 201 }, (_, i) => XMIN + i * (XMAX - XMIN) / 200);
      const dv = w2Fwd(S.D, xs).out;
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.4; ctx.beginPath();
      xs.forEach((x, i) => { const y = tD(sigm(dv[i])); i ? ctx.lineTo(tx(x), y) : ctx.moveTo(tx(x), y); });
      ctx.stroke(); ctx.restore();
      /* jelmagyarázat */
      ctx.font = "600 12px system-ui, sans-serif";
      let lx = ml + 4;
      [["valódi", css("--setA"), 0.6], ["generált", css("--setB"), 0.75]].forEach(([t, c, a]) => {
        ctx.fillStyle = rgba(c, a); ctx.fillRect(lx, 6, 12, 10); lx += 16;
        label(ctx, t, lx, 11, css("--text"), "left", "600 12px system-ui, sans-serif", "middle"); lx += ctx.measureText(t).width + 12;
      });
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(lx, 11); ctx.lineTo(lx + 14, 11); ctx.stroke(); ctx.restore();
      label(ctx, "D(x): a detektív tippje", lx + 18, 11, css("--text"), "left", "600 12px system-ui, sans-serif", "middle");
    }
    function drawLoss() {
      const { ctx, w, h: hh } = cvL;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const Hs = S.hist, n = Hs.length, N = Math.max(500, n);
      const ml = 34, mr = 8, mt = 18, mb = 16;
      const mm = st.loss === "mm";
      const y0 = mm ? -2 : 0, y1 = mm ? 2 : 3;
      const tx = i => ml + i / N * (w - ml - mr), ty = y => hh - mb - (clamp(y, y0, y1) - y0) / (y1 - y0) * (hh - mt - mb);
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
      for (let y = y0; y <= y1; y++) { ctx.moveTo(ml, ty(y)); ctx.lineTo(w - mr, ty(y)); }
      ctx.stroke();
      for (let y = y0; y <= y1; y++) label(ctx, fmt(y, 0), ml - 4, ty(y), css("--muted"), "right", "11px system-ui, sans-serif", "middle");
      label(ctx, "lépés: " + n, w - mr, hh - 2, css("--muted"), "right", "11px system-ui, sans-serif", "bottom");
      /* egyensúlyi szintek: D: 2 ln 2, G: ln 2 (ns) / −ln 2 (mm) */
      ctx.save(); ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      [[2 * Math.LN2, "--setC"], [mm ? -Math.LN2 : Math.LN2, "--setB"]].forEach(([y, c]) => { ctx.strokeStyle = rgba(css(c), 0.8); ctx.beginPath(); ctx.moveTo(ml, ty(y)); ctx.lineTo(w - mr, ty(y)); ctx.stroke(); });
      ctx.restore();
      [[0, "--setC"], [1, "--setB"]].forEach(([k, c]) => {
        if (!n) return;
        const step = Math.max(1, Math.floor(n / (w - ml - mr)));
        let e = Hs[0][k];
        ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = 1.8; ctx.beginPath();
        for (let i = 0; i < n; i++) { e = 0.95 * e + 0.05 * Hs[i][k]; if (i % step === 0 || i === n - 1) { i ? ctx.lineTo(tx(i), ty(e)) : ctx.moveTo(tx(i), ty(e)); } }
        ctx.stroke(); ctx.restore();
      });
      ctx.font = "600 12px system-ui, sans-serif";
      let lx = ml + 4;
      [["D vesztesége", "--setC"], ["G vesztesége", "--setB"], [w < 520 ? "- - egyensúly" : "szaggatott: egyensúly (D = ½)", "--muted"]].forEach(([t, c]) => {
        label(ctx, t, lx, 10, css(c), "left", "600 12px system-ui, sans-serif", "middle"); lx += ctx.measureText(t).width + 14;
      });
    }
    function readout() {
      const x = gen, n = x.length, m = x.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / n);
      const C = W2_DATA[st.data].comp;
      const rm = C.reduce((s, [p, mu]) => s + p * mu, 0), rsd = Math.sqrt(C.reduce((s, [p, mu, sg]) => s + p * (sg * sg + mu * mu), 0) - rm * rm);
      const last = S.hist.slice(-50), avg = k => (last.length ? last.reduce((s, v) => s + v[k], 0) / last.length : NaN);
      let s = `lépés: <b>${S.step}</b> · generált minták: átlag <b>${w2Fix(m, 2)}</b>, szórás <b>${w2Fix(sd, 2)}</b> ` +
        `<span class="muted">(valódi: ${w2Fix(rm, 2)} és ${w2Fix(rsd, 2)})</span>`;
      if (C.length > 1) {
        const names = C.length === 2 ? ["bal", "jobb"] : ["bal", "középső", "jobb"];
        const fr = C.map(([, mu]) => x.filter(v => Math.abs(v - mu) < 1).length / n);
        s += `<br>a generált minták a ${names.map((nm, i) => `${nm} csúcs (${fmt(C[i][1], 0)}) közelében: <b>${w2Pct(fr[i])}</b>`).join(", ")} <span class="muted">(±1-en belül; valódi: ${w2Pct(C[0][0])} mindegyik)</span>`;
        const miss = names.filter((_, i) => fr[i] < 0.03);
        if (S.step > 0 && miss.length) s += `<br><b style="color:var(--bad)">Módusösszeomlás:</b> a ${miss.join(" és a ")} csúcsot a generátor kihagyja.`;
      }
      const dAvg = xs => { const o = w2Fwd(S.D, xs).out; return o.reduce((a, v) => a + sigm(v), 0) / o.length; };
      s += `<br>a detektív átlagos tippje: D(valódi) ≈ <b>${w2Fix(dAvg(realX), 2)}</b>, D(generált) ≈ <b>${w2Fix(dAvg(x), 3)}</b> <span class="muted">(egyensúlyban mindkettő 0,5)</span>`;
      if (S.step > 0) s += `<br><span class="muted">az utolsó 50 lépés átlaga: D vesztesége ${w2Fix(avg(0), 3)} (egyensúly: 2 ln 2 ≈ 1,386), ` +
        `a G-nek jutó gradiens |∂L_G/∂x| ≈ ${w2Sci(avg(2))}</span>`;
      out.innerHTML = s;
    }
    function drawAll() {
      gen = w2Fwd(S.G, ZE).out;
      cv.draw = drawMain; cvL.draw = drawLoss;
      drawMain(); drawLoss(); readout();
    }
    const anim = w2Anim(root, () => { for (let k = 0; k < st.speed; k++) w2GanStep(S); drawAll(); });
    reset();
  };

  /* ==================================================================
     14.5-c  gan-epochs – egy GAN tanulása a számjegyeken
     ================================================================== */
  W["gan-epochs"] = root => {
    header(root, "Egy GAN tanulása a számjegyeken",
      "Egy kis (teljesen összekötött) GAN a 8 × 8-as számjegyeken. Mindig ugyanazt a 16 zajvektort adjuk a generátornak – húzd a csúszkát, és nézd, hogyan lesz a zajból számjegy – és mikor lesz a 16 képből 16 különböző.");
    const G = w2Data();
    if (!G || !G.ganEpochs) return w2NoData(root);
    const keys = Object.keys(G.ganEpochs).map(Number).sort((a, b) => a - b);
    let k = 0;
    const divReal = G.compare ? w2Div(G.compare[0].samples.slice(0, 16)) : NaN;
    const s = slider(0, keys.length - 1, 1, k), o = h("b");
    s.addEventListener("input", () => { k = +s.value; draw(); });
    root.append(h("div", { class: "controls" }, h("label", null, "epoch:", s, o),
      btn("◀", () => { k = Math.max(0, k - 1); s.value = k; draw(); }), btn("▶", () => { k = Math.min(keys.length - 1, k + 1); s.value = k; draw(); })));
    const box = h("div", { style: "max-width:340px" });
    root.append(box);
    const cv = Calc.canvas(box, 1, 340);
    const out = h("div", { class: "readout" });
    root.append(out);
    function draw() {
      o.textContent = keys[k];
      cv.draw = () => {
        const { ctx, w, h: hh } = cv;
        ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
        const g = 4, c = (Math.min(w, hh) - 3 * g - 2) / 4;
        w2Grid(ctx, G.ganEpochs[keys[k]], 4, 1, 1, c, g);
      };
      cv.draw();
      const e = keys[k], dv = w2Div(G.ganEpochs[e]);
      out.innerHTML = `ugyanaz a 16 zajvektor, <b>${e}</b> epoch után · a 16 kép átlagos páronkénti távolsága: <b>${w2Fix(dv, 1)}</b> ` +
        `<span class="muted">(16 valódi tesztképnél ${w2Fix(divReal, 1)})</span>` +
        `<br><span class="muted">${e <= 1 ? "Szürke zaj: a generátor még semmit sem tanult." :
          e <= 50 ? "Kirajzolódik egy alak – de a 16 különböző zajvektorból szinte ugyanaz a kép lesz: ez a módusösszeomlás. A detektív egy ideig elfogadja, aztán megtanulja leleplezni." :
            e <= 100 ? "A képek elkezdenek különbözni: a generátor kitör az egyetlen módusból." :
              "A képek többsége felismerhető, különböző számjegy; egy-egy zajvektor képe később is átalakul (a tanítás nem áll meg egy nyugalmi pontban)."}</span>`;
    }
    draw();
  };

  /* ==================================================================
     14.9-a/b  gen-compare – hét forrás, egy füzet
     ================================================================== */
  W["gen-compare"] = root => {
    header(root, "Hét forrás, egy füzet",
      "Hét „rajzoló” 450-450 számjegyképe ugyanazokkal a mérőszámokkal. Válassz forrást, és kattints egy mintára: mellette a hozzá legközelebbi tanítókép. " +
      "A táblázat soraira is kattinthatsz. A „Melyik az igazi?” játékban tippeld meg, melyik rács valódi!");
    const G = w2Data();
    if (!G || !G.compare) return w2NoData(root);
    const CM = G.compare;
    let sel = CM.findIndex(c => c.name === "GAN"), pick = 0, game = false;
    if (sel < 0) sel = 0;
    const tg = toggleGroup(CM.map((c, i) => [i, c.name]), () => sel, i => { sel = +i; pick = 0; draw(); });
    const bGame = btn("Melyik az igazi?", () => { game = !game; if (game) newRound(); draw(); });
    root.append(h("div", { class: "controls" }, ...tg.bs), h("div", { class: "controls" }, bGame));
    /* böngésző-nézet */
    const view = h("div");
    const [cvG, cvN, , Rn] = twoCanvas(view, 0.66, 0.56);
    const outN = h("div", { class: "readout" });
    Rn.append(outN);
    /* táblázat */
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.8rem" });
    view.append(tw);
    root.append(view);
    /* játék-nézet */
    const gv = h("div", { style: "display:none" });
    const gGrid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.7rem;margin-top:.4rem" });
    const gOut = h("div", { class: "readout" });
    let round = 0, score = 0, played = 0, cand = [], guessed = -1;
    const cCopy = checkbox(false, () => { newRound(); drawGame(); });
    gv.append(h("div", { class: "controls" }, btn("Új kör", () => { newRound(); drawGame(); }),
      h("label", null, cCopy, "a „másoló” is játszhat")), gGrid, gOut);
    root.append(gv);
    const gCv = [], gCap = [];
    for (let j = 0; j < 4; j++) {
      const cell = h("div", { style: "min-width:0;cursor:pointer" });
      gGrid.append(cell);
      const c = Calc.canvas(cell, 1, 220);
      c.c.style.cursor = "pointer"; c.c.style.touchAction = "manipulation";
      const cap = h("div", { style: "text-align:center;font-size:.9rem;margin-top:.2rem;min-height:1.3em" });
      cell.append(cap);
      c.c.addEventListener("click", () => guess(j));
      gCv.push(c); gCap.push(cap);
    }
    function newRound() {
      round++; guessed = -1;
      const r = rng(4242 + round);
      const pool = CM.map((c, i) => i).filter(i => i !== 0 && (cCopy.checked || CM[i].name !== "másoló"));
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const ids = [0, ...pool.slice(0, 3)];
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      cand = ids.map(i => {
        const idx = Array.from({ length: 40 }, (_, k) => k);
        for (let a = 39; a > 0; a--) { const b = Math.floor(r() * (a + 1)); [idx[a], idx[b]] = [idx[b], idx[a]]; }
        return { i, imgs: idx.slice(0, 16).map(k => CM[i].samples[k]) };
      });
    }
    function guess(j) {
      if (guessed >= 0 || !cand.length) return;
      guessed = j; played++;
      if (cand[j].i === 0) score++;
      drawGame();
    }
    function drawGame() {
      cand.forEach((cd, j) => {
        const c = gCv[j];
        c.draw = () => {
          const { ctx, w, h: hh } = c;
          ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
          const g = 3, s = (Math.min(w, hh) - 3 * g - 6) / 4;
          const rev = guessed >= 0, ok = cd.i === 0;
          w2Grid(ctx, cd.imgs, 4, 3, 3, s, g);
          if (rev && (ok || j === guessed)) {
            ctx.save(); ctx.strokeStyle = css(ok ? "--setC" : "--bad"); ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, w - 3, hh - 3); ctx.restore();
          }
        };
        c.draw();
        gCap[j].innerHTML = guessed >= 0 ? (cd.i === 0 ? `<b style="color:var(--setC)">✔ ${CM[0].name}</b>` : `<span class="${j === guessed ? "" : "muted"}">${CM[cd.i].name}</span>`) : `${j + 1}. rács`;
      });
      gOut.innerHTML = guessed < 0 ? "Kattints arra a rácsra, amelyik szerinted valódi tesztképekből áll!" :
        (cand[guessed].i === 0 ? "<b>Eltaláltad!</b> " : `Nem ez volt – ez a(z) <b>${CM[cand[guessed].i].name}</b> modell mintája. `) +
        `Pontszám: <b>${score} / ${played}</b>. <span class="muted">Mi árulta el a modelleket? Homály (VAE), zajos szélek (Gauss, GAN), csak fekete-fehér pixel (autoregresszív).</span>`;
    }
    const isCopy = d => d < 1e-9;
    function drawBrowse() {
      const C = CM[sel];
      const layout = () => { const g = 3, s = Math.min((cvG.w - 7 * g - 2) / 8, (cvG.h - 4 * g - 2) / 5); return { g, s }; };
      cvG.draw = () => {
        const { ctx, w, h: hh } = cvG;
        ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
        const { g, s } = layout();
        C.samples.forEach((v, i) => {
          const x = 1 + (i % 8) * (s + g), y = 1 + Math.floor(i / 8) * (s + g);
          drawDigit(ctx, x, y, s, v, i === pick ? { frameVar: "--accent", frameW: 3 } : (isCopy(C.nnDist[i]) ? { frameVar: "--bad", frameW: 2 } : {}));
        });
      };
      cvG.c.onclick = e => {
        const [px, py] = evXY(cvG, e), { g, s } = layout();
        const c = Math.floor((px - 1) / (s + g)), r = Math.floor((py - 1) / (s + g));
        if (c >= 0 && c < 8 && r >= 0 && r < 5) { pick = r * 8 + c; drawBrowse(); }
      };
      cvG.c.style.cursor = "pointer"; cvG.c.style.touchAction = "manipulation";
      cvN.draw = () => {
        const { ctx, w, h: hh } = cvN;
        ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
        const s = Math.min((w - 24) / 2, hh - 24);
        label(ctx, "a minta", 4, 15, css("--muted"), "left", "600 12px system-ui, sans-serif");
        label(ctx, "legközelebbi tanítókép", w / 2 + 4, 15, css("--muted"), "left", "600 12px system-ui, sans-serif");
        drawDigit(ctx, 4, 20, s, C.samples[pick], { frameVar: "--accent", frameW: 2 });
        drawDigit(ctx, w / 2 + 4, 20, s, C.nn[pick], { frameVar: isCopy(C.nnDist[pick]) ? "--bad" : "--border", frameW: 2 });
      };
      cvG.draw(); cvN.draw();
      const d = C.nnDist[pick];
      outN.innerHTML = `${pick + 1}. minta · távolság a legközelebbi tanítóképtől: <b>${w2Fix(d, 1)}</b>` +
        (isCopy(d) ? ` – <b style="color:var(--bad)">pontos másolat!</b>` : "") +
        `<br><span class="muted">(euklideszi távolság a 64 pixelen, 0–16-os skálán; a valódi tesztképeknél a legközelebbi tanítókép medián távolsága ${w2Fix(CM[0].nnMed, 1)})</span>`;
    }
    function drawTable() {
      const mxH = C => Math.max(...C.hist);
      const th = (t, tip) => h("th", { style: "padding:.25rem .45rem;text-align:center;font-size:.82rem;vertical-align:bottom", title: tip || "" }, t);
      const rows = CM.map((C, i) => {
        const bars = h("div", { style: "display:flex;align-items:flex-end;gap:1px;height:22px;width:72px;margin:auto" },
          C.hist.map((v, k) => h("div", { title: `${k}: ${v}`, style: `flex:1;height:${Math.max(1, Math.round(22 * v / mxH(C)))}px;background:${DIGIT_COLORS[k]}` })));
        const td = (t, st = "") => h("td", { style: "padding:.25rem .45rem;text-align:center;white-space:nowrap;" + st }, t);
        const tr = h("tr", { style: `cursor:pointer;${i === sel ? "background:var(--accent-soft);font-weight:600" : ""}`, onclick: () => { sel = i; pick = 0; draw(); } },
          td(C.name + (C.binary ? " *" : ""), "text-align:left"),
          td(w2Fix(Math.abs(C.fid) < 0.05 ? 0 : C.fid, 1)), td(w2Pct(C.sure, 0)), td(w2Fix(C.prec, 2)), td(w2Fix(C.rec, 2)),
          td(w2Fix(C.nnMed, 1)), td(String(C.copies), C.copies ? "color:var(--bad);font-weight:700" : ""), h("td", { style: "padding:.25rem .45rem" }, bars));
        return tr;
      });
      tw.replaceChildren(h("table", { style: "font-size:.88rem;border-collapse:collapse;min-width:600px;width:100%" },
        h("tr", { style: "border-bottom:1px solid var(--border)" }, th("forrás"), th("FID ↓", "Fréchet-távolság: kisebb a jobb"), th("biztosan felismert ↑", "az osztályozó 90% felett biztos"),
          th("pontosság ↑", "precision: a minták hány %-a esik a valódi képek közé"), th("felidézés ↑", "recall: a valódi képek hány %-át fedik le a minták"),
          th("legközelebbi tanítókép (medián)"), th("másolatok"), th("osztályok (0–9)")), ...rows),
        h("p", { class: "muted", style: "font-size:.85rem;margin:.4rem 0 0" },
          "* autoregresszív: fekete-fehér képek – a mérőszámok fekete-fehér referenciához mérve, a többivel csak óvatosan vethető össze. " +
          "Pontosság és felidézés: 0–1. A másolat: a minta pixelre pontosan egy tanítókép."));
    }
    function draw() {
      tg.paint();
      bGame.classList.toggle("on", game);
      bGame.textContent = game ? "← Vissza a böngészéshez" : "Melyik az igazi?";
      view.style.display = game ? "none" : ""; gv.style.display = game ? "" : "none";
      tg.bs.forEach(b => setDis(b, game));
      if (game) { gCv.forEach(c => c.resize()); drawGame(); }
      else { cvG.resize(); cvN.resize(); drawBrowse(); drawTable(); }
    }
    draw();
  };

  /* ==================================================================
     14.6–14.8  Diffúzió: közös segédek (w3-előtag)
     ================================================================== */
  /* fix tizedesjegyű magyar szám (a fmt levágja a záró nullákat, itt megtartjuk) */
  const w3F = (x, d = 3) => {
    const r = Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x;
    return r.toFixed(d).replace(".", ",").replace("-", "−");
  };
  /* kis tudományos alak nagyon kis számokra: 3,7·10⁻⁵ */
  const W3_SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const w3Sci = (x, d = 3) => {
    if (x === 0 || Math.abs(x) >= 0.001) return w3F(x, d);
    const e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    return w3F(m, 1) + "·10" + String(e).split("").map(c => W3_SUP[c]).join("");
  };
  const w3Sw = (colVar, txt, round = true) => h("span", { style: "display:inline-flex;align-items:center;gap:.3rem;margin-right:.8rem;white-space:nowrap" },
    h("span", { style: `display:inline-block;width:.8em;height:.8em;border-radius:${round ? "50%" : "3px"};background:var(${colVar})` }), txt);
  const w3Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0", html });
  function w3Stat(label) {
    const v = h("div", { class: "v" }, "–"), l = h("div", { class: "l" }, label);
    return { el: h("div", { class: "stat" }, v, l), v };
  }
  /* animáció csak látható widgetben: a hívó a visible() értékét figyeli */
  function w3Visible(root, onChange) {
    let vis = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(es => { vis = es[0].isIntersecting; onChange && onChange(vis); }).observe(root);
    }
    return () => vis;
  }
  /* pont–pont kattintás: a legközelebbi index (képpontban), ha r-en belül */
  function w3Pick(T, pts, px, py, r = 18) {
    let bi = -1, bd = r * r;
    pts.forEach(([x, y], i) => { const d = (T.tx(x) - px) ** 2 + (T.ty(y) - py) ** 2; if (d < bd) { bd = d; bi = i; } });
    return bi;
  }

  /* koszinuszos zajütemezés: ᾱ_t = f(t)/f(0), f(t) = cos²(((t/T) + s)/(1 + s) · π/2), s = 0,008 */
  /* (t lehet tört is: 1000 lépésnél a 0…T időt sűrűbben mintavételezzük) */
  function w3CosSched(T, s = 0.008) {
    const f = t => Math.cos(((t / T) + s) / (1 + s) * Math.PI / 2) ** 2, f0 = f(0);
    return t => f(t) / f0;
  }
  /* egyenletesen ritkított időpontok: T, …, 0 (n lépés; ha n osztója T-nek, egészek) */
  const w3Times = (T, n) => Array.from({ length: n + 1 }, (_, k) => (k === n ? 0 : T * (n - k) / n));

  /* A pontos (ideális) zajtalanító egy Gauss-keverékre.
     Komponensek: mu[k] = [x, y], h2[k] = szórásnégyzet, lw[k] = ln(súly).
     q_t(x) = Σ π_k N(x; √ᾱ μ_k, (ᾱ h_k² + 1 − ᾱ) I)
     x̂_0 = E[x_0 | x_t] = Σ w_k m_k,  m_k = μ_k + (h_k² √ᾱ / v_k)(x_t − √ᾱ μ_k),  v_k = ᾱ h_k² + 1 − ᾱ,
     w_k ∝ π_k exp(−‖x_t − √ᾱ μ_k‖² / (2 v_k)) / v_k.   idx: a felhasznált komponensek (null = mind). */
  function w3X0(x, y, ab, mix, idx, wbuf) {
    const sa = Math.sqrt(ab), { mu, h2, lw } = mix, K = idx ? idx.length : mu.length;
    let mx = -Infinity;
    for (let j = 0; j < K; j++) {
      const k = idx ? idx[j] : j, v = ab * h2[k] + 1 - ab, dx = x - sa * mu[k][0], dy = y - sa * mu[k][1];
      const l = lw[k] - (dx * dx + dy * dy) / (2 * v) - Math.log(v);
      wbuf[j] = l; if (l > mx) mx = l;
    }
    let S = 0, ox = 0, oy = 0;
    for (let j = 0; j < K; j++) {
      const k = idx ? idx[j] : j, v = ab * h2[k] + 1 - ab, g = h2[k] * sa / v, e = Math.exp(wbuf[j] - mx);
      S += e;
      ox += e * (mu[k][0] + g * (x - sa * mu[k][0]));
      oy += e * (mu[k][1] + g * (y - sa * mu[k][1]));
    }
    return [ox / S, oy / S];
  }
  /* Egy visszafelé lépés t → t' (ᾱ, ᾱ'): DDIM (eta = 0) vagy DDPM (eta = 1, σ_t a brief képlete szerint).
     A háló kimenete itt x̂_0; ε̂ = (x_t − √ᾱ x̂_0)/√(1 − ᾱ). */
  function w3Step(x, x0, ab, ab1, eta, z) {
    const eps = (x - Math.sqrt(ab) * x0) / Math.sqrt(1 - ab);
    const s2 = eta ? (1 - ab1) / (1 - ab) * (1 - ab / ab1) : 0;
    const c = Math.sqrt(Math.max(0, 1 - ab1 - s2));
    return Math.sqrt(ab1) * x0 + c * eps + (eta ? Math.sqrt(s2) * z : 0);
  }

  /* ---------- tanítóadatok a síkon (60 pont, [−1; 1]²) ---------- */
  const W3_SHAPES = {
    spiral: { t: "spirál", seed: 141, make: (rnd, out) => {
      for (let i = 0; i < 60; i++) {
        const u = i / 59, th = 0.6 * Math.PI + 3.4 * Math.PI * u, r = 0.12 + 0.83 * u;
        out.push([r * Math.cos(th) + 0.015 * gauss(rnd), r * Math.sin(th) + 0.015 * gauss(rnd)]);
      }
    } },
    moons: { t: "két félhold", seed: 142, make: (rnd, out) => {
      for (let i = 0; i < 60; i++) {
        const th = Math.PI * (i % 30) / 29;
        const [x, y] = i < 30 ? [Math.cos(th), Math.sin(th)] : [1 - Math.cos(th), 0.5 - Math.sin(th)];
        out.push([(x - 0.5) * 0.62 + 0.02 * gauss(rnd), (y - 0.25) * 0.62 + 0.02 * gauss(rnd)]);
      }
    } },
    smile: { t: "mosoly", seed: 143, make: (rnd, out) => {
      const j = () => 0.01 * gauss(rnd);
      for (let k = 0; k < 28; k++) { const a = 2 * Math.PI * k / 28; out.push([0.92 * Math.cos(a) + j(), 0.92 * Math.sin(a) + j()]); }
      for (const ex of [-0.33, 0.33]) for (let k = 0; k < 6; k++) { const a = 2 * Math.PI * k / 6; out.push([ex + 0.07 * Math.cos(a) + j(), 0.3 + 0.07 * Math.sin(a) + j()]); }
      for (let k = 0; k < 20; k++) { const a = (205 + 130 * k / 19) * Math.PI / 180; out.push([0.5 * Math.cos(a) + j(), 0.05 + 0.5 * Math.sin(a) + j()]); }
    } }
  };
  const w3ShapeData = key => {
    const S = W3_SHAPES[key], rnd = rng(S.seed), out = [];
    S.make(rnd, out);
    return out.map(([x, y]) => [clamp(x, -1, 1), clamp(y, -1, 1)]);
  };

  /* Teljes visszafelé futás (minden pont, minden lépés) előre kiszámolva.
     x0fn(x, y, ab) → [x̂_0x, x̂_0y]; visszaadja { ts, X: [lépés] → Float64Array(2N) (x, y felváltva), X0: ugyanígy } */
  function w3Run(start, ts, abar, x0fn, eta, seed) {
    const n = ts.length - 1, N = start.length, zr = rng(seed), X = [Float64Array.from(start.flat())], X0 = [];
    for (let k = 0; k < n; k++) {
      const ab = abar(ts[k]), ab1 = abar(ts[k + 1]), cur = X[k], nx = new Float64Array(2 * N), p0 = new Float64Array(2 * N);
      for (let i = 0; i < N; i++) {
        const x = cur[2 * i], y = cur[2 * i + 1], q = x0fn(x, y, ab, i);
        const z1 = eta ? gauss(zr) : 0, z2 = eta ? gauss(zr) : 0;
        p0[2 * i] = q[0]; p0[2 * i + 1] = q[1];
        nx[2 * i] = w3Step(x, q[0], ab, ab1, eta, z1); nx[2 * i + 1] = w3Step(y, q[1], ab, ab1, eta, z2);
      }
      X.push(nx); X0.push(p0);
    }
    return { ts, X, X0 };
  }
  const w3Pairs = F => Array.from({ length: F.length / 2 }, (_, i) => [F[2 * i], F[2 * i + 1]]);
  const w3Median = a => { const s = a.slice().sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  /* a végső minták legközelebbi tanítópontja */
  function w3NN(samples, data) {
    return samples.map(([x, y]) => {
      let bd = Infinity, bi = 0;
      data.forEach(([a, b], i) => { const d = (x - a) ** 2 + (y - b) ** 2; if (d < bd) { bd = d; bi = i; } });
      return { d: Math.sqrt(bd), i: bi };
    });
  }
  const W3_T = 50, W3_AB = w3CosSched(W3_T), W3_ABAR = Array.from({ length: W3_T + 1 }, (_, t) => W3_AB(t));

  /* ==================================================================
     14.6-a/c, 14.8-b  diffusion-2d – Diffúzió a síkon
     ================================================================== */
  W["diffusion-2d"] = root => {
    header(root, "Diffúzió a síkon",
      "60 tanítópont a síkon. <b>Előre:</b> minden pontot lépésenként zajjal keverünk, amíg el nem tűnik a forma. " +
      "<b>Visszafelé:</b> 300 tiszta zajpontból indulunk, és a zajtalanító lépésről lépésre visszavezeti őket. " +
      "Itt nincs betanított háló: a <b>pontos</b> zajtalanítót használjuk, amely tudja, hol vannak a tanítópontok " +
      "(mindegyiket egy $h$ szórású kis Gauss-felhőnek tekinti).");
    let shape = "spiral", tab = "fwd", tF = 20, sel = 7, fSeed = 7;
    let hw = 0.05, nSteps = 50, eta = 0, bSeed = 1, showX0 = false, k = 0, sSel = 0;
    let data = w3ShapeData(shape), eps = [], run = null, final = null, nn = null, stats = null;
    const mkEps = () => { const r = rng(fSeed); eps = data.map(() => [gauss(r), gauss(r)]); };
    mkEps();

    const shG = toggleGroup(Object.entries(W3_SHAPES).map(([key, S]) => [key, S.t]), () => shape, v => {
      shape = v; data = w3ShapeData(shape); mkEps(); recompute(); draw();
    });
    const tabG = toggleGroup([["fwd", "Előre: zajosítás"], ["bwd", "Visszafelé: mintavétel"]], () => tab, v => {
      tab = v; if (tab === "bwd" && !played) { played = true; play(true); } draw();
    });
    root.append(h("div", { class: "controls" }, small("tanítóadat:"), shG.bs), h("div", { class: "controls" }, tabG.bs));

    /* --- előre fül vezérlői --- */
    const tS = slider(0, W3_T, 1, tF), tLab = h("b", null, "");
    tS.oninput = () => { tF = +tS.value; draw(); };
    const fwdBox = h("div", null,
      h("div", { class: "controls" }, h("label", null, "lépés t:", tS, tLab), btn("Új zaj", () => { fSeed++; mkEps(); draw(); })));

    /* --- visszafelé fül vezérlői --- */
    const hS = slider(0, 0.2, 0.005, hw), hLab = h("b", null, "");
    const applyH = () => { hw = +hS.value; recompute(); k = nSteps; stop(); draw(); };
    hS.oninput = () => { if (nSteps <= 50) applyH(); else hLab.textContent = w3F(+hS.value, 3); };
    hS.onchange = applyH;
    const nG = toggleGroup([[5, "5"], [10, "10"], [25, "25"], [50, "50"], [1000, "1000"]], () => nSteps, v => { nSteps = +v; recompute(); k = nSteps; stop(); draw(); });
    const mG = toggleGroup([[0, "DDIM (determinisztikus)"], [1, "DDPM (sztochasztikus)"]], () => eta, v => { eta = +v; recompute(); k = nSteps; stop(); draw(); });
    const kS = slider(0, nSteps, 1, 0);
    kS.oninput = () => { stop(); k = +kS.value; frac = 0; draw(); };
    const playB = btn("▶ Lejátszás", () => (playing ? stop() : play(k >= nSteps)));
    const x0C = checkbox(showX0, () => { showX0 = x0C.checked; draw(); });
    const bwdBox = h("div", { style: "display:none" },
      h("div", { class: "controls" }, small("lépések:"), nG.bs),
      h("div", { class: "controls" }, small("mód:"), mG.bs),
      h("div", { class: "controls" }, h("label", null, "simítás h:", hS, hLab),
        h("label", null, x0C, "x̂₀ tippek")),
      h("div", { class: "controls" }, playB, h("label", { style: "flex:1;min-width:180px" }, "lépés:", kS),
        btn("Új mag", () => { bSeed++; recompute(); play(true); })));
    root.append(fwdBox, bwdBox);

    const [cvA, cvB, boxA, boxB] = twoCanvas(root, 1, 1);
    const capA = h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }), capB = capA.cloneNode();
    boxA.prepend(capA); boxB.prepend(capB);
    const legend = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.4rem" });
    const ro = h("div", { class: "readout" });
    const st = [w3Stat("másolat (< 0,01 egy tanítóponttól)"), w3Stat("medián távolság a legközelebbi tanítóponttól"), w3Stat("lépések · mód")];
    const statRow = h("div", { class: "stat-row" }, st.map(s => s.el));
    const note = w3Note("");
    root.append(legend, ro, statRow, note);

    function recompute() {
      const r = rng(bSeed * 7919 + 13), start = Array.from({ length: 300 }, () => [gauss(r), gauss(r)]);
      const mix = { mu: data, h2: data.map(() => hw * hw), lw: data.map(() => 0) }, wb = new Float64Array(data.length);
      run = w3Run(start, w3Times(W3_T, nSteps), W3_AB, (x, y, ab) => w3X0(x, y, ab, mix, null, wb), eta, bSeed * 104729 + 1);
      final = w3Pairs(run.X[nSteps]); nn = w3NN(final, data);
      const ds = nn.map(o => o.d);
      stats = { copy: ds.filter(d => d < 0.01).length / ds.length, med: w3Median(ds) };
      root.__w3 = { data, start, final, ts: run.ts, stats, h: hw, nSteps, eta };
      kS.max = nSteps;
    }

    /* --- animáció --- */
    let playing = false, played = false, frac = 0, last = 0, raf = 0;
    const visible = w3Visible(root, v => { if (v && playing && !raf) raf = requestAnimationFrame(tick); });
    function play(fromStart) {
      if (fromStart) { k = 0; frac = 0; }
      playing = true; playB.textContent = "⏸ Szünet"; last = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function stop() { playing = false; playB.textContent = "▶ Lejátszás"; frac = 0; }
    function tick(now) {
      raf = 0;
      if (!playing || !visible()) return;
      const dt = last ? Math.min(100, now - last) : 16; last = now;
      const per = nSteps <= 50 ? Math.max(70, 3500 / nSteps) : 5000 / nSteps;   // egy lépés ideje (ms)
      frac += dt / per;
      while (frac >= 1 && k < nSteps) { frac -= 1; k++; }
      if (k >= nSteps) { k = nSteps; frac = 0; stop(); }
      draw();
      if (playing) raf = requestAnimationFrame(tick);
    }

    const view = cv => eqView(cv, 0, 0, 2.7, 2.7, { xname: "", yname: "" });
    const zoomV = cv => eqView(cv, 0, 0, 1.15, 1.15, { xname: "", yname: "" });
    const pt = (ctx, T, x, y, r, col) => { ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), r, 0, 2 * Math.PI); ctx.fillStyle = col; ctx.fill(); };
    const inV = (V, x, y) => x > V.xmin && x < V.xmax && y > V.ymin && y < V.ymax;

    function drawFwd() {
      const ab = W3_ABAR[tF], sa = Math.sqrt(ab), sb = Math.sqrt(1 - ab);
      const Xt = data.map((p, i) => [sa * p[0] + sb * eps[i][0], sa * p[1] + sb * eps[i][1]]);
      [[cvA, view], [cvB, zoomV]].forEach(([cv, vf]) => {
        cv.draw = () => {
          const V = vf(cv), T = Calc.plot(cv, V, []), { ctx } = cv;
          ring(ctx, T.tx(0), T.ty(0), T.tx(1) - T.tx(0), css("--muted"), 1.4, [5, 4]);
          ring(ctx, T.tx(0), T.ty(0), T.tx(2) - T.tx(0), css("--border"), 1.2, [5, 4]);
          data.forEach(([x, y]) => pt(ctx, T, x, y, 2.4, rgba(css("--muted"), 0.45)));
          const path = []; for (let s = 0; s <= tF; s++) { const a = Math.sqrt(W3_ABAR[s]), b = Math.sqrt(1 - W3_ABAR[s]); path.push([a * data[sel][0] + b * eps[sel][0], a * data[sel][1] + b * eps[sel][1]]); }
          polyline(ctx, T, path, css("--setB"), 2);
          Xt.forEach(([x, y]) => inV(V, x, y) && pt(ctx, T, x, y, 3.2, css("--setA")));
          dot(ctx, T.tx(Xt[sel][0]), T.ty(Xt[sel][1]), 5.5, css("--setB"));
          ring(ctx, T.tx(data[sel][0]), T.ty(data[sel][1]), 5, css("--setB"), 2);
          cv.T = T;
          cv.pts = Xt;
        };
        cv.draw();
      });
      capA.textContent = "az egész sík"; capB.textContent = "közelről (a tanítóadat környéke)";
      tLab.textContent = `${tF} / ${W3_T}`;
      ro.innerHTML = `t = <b>${tF}</b> &nbsp; ᾱ<sub>t</sub> = <b>${w3Sci(ab, 3)}</b> &nbsp; √ᾱ<sub>t</sub> = <b>${w3F(sa, 3)}</b> (ennyi marad a jelből) &nbsp; ` +
        `√(1 − ᾱ<sub>t</sub>) = <b>${w3F(sb, 3)}</b> (ennyi a zaj)`;
      legend.replaceChildren(w3Sw("--muted", "eredeti pont (x₀)"), w3Sw("--setA", "zajos pont (xₜ)"), w3Sw("--setB", "egy kijelölt pont útja"),
        h("span", { style: "white-space:nowrap" }, "szaggatott kör: a standard normális 1σ és 2σ köre"));
      statRow.style.display = "none";
      note.innerHTML = "Minden pont saját, rögzített zajjal: $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\varepsilon$. " +
        "Koszinuszos ütemezés, $T = 50$: a forma eleinte lassan oszlik, a végén $\\bar\\alpha_{50} \\approx 0$, és csak a zaj marad – egy " +
        "standard normális felhő. Kattints egy pontra, hogy az útját kövesd.";
      math(note);
    }

    function drawBwd() {
      const n = nSteps, kk = Math.min(k, n), fr = kk < n ? frac : 0;
      const A = run.X[kk], B = run.X[Math.min(n, kk + 1)];
      const cur = Array.from({ length: A.length / 2 }, (_, i) => [A[2 * i] + (B[2 * i] - A[2 * i]) * fr, A[2 * i + 1] + (B[2 * i + 1] - A[2 * i + 1]) * fr]);
      const x0s = kk < n ? w3Pairs(run.X0[kk]) : null, done = kk >= n;
      const path = []; for (let j = 0; j <= kk; j++) path.push([run.X[j][2 * sSel], run.X[j][2 * sSel + 1]]); if (fr) path.push(cur[sSel]);
      [[cvA, view], [cvB, zoomV]].forEach(([cv, vf]) => {
        cv.draw = () => {
          const V = vf(cv), T = Calc.plot(cv, V, []), { ctx } = cv;
          ring(ctx, T.tx(0), T.ty(0), T.tx(1) - T.tx(0), css("--border"), 1.2, [5, 4]);
          if (showX0 && x0s) x0s.forEach(([x, y]) => inV(V, x, y) && pt(ctx, T, x, y, 2.4, rgba(css("--setC"), 0.55)));
          data.forEach(([x, y]) => ring(ctx, T.tx(x), T.ty(y), 3.6, css("--setA"), 1.6));
          cur.forEach(([x, y]) => inV(V, x, y) && pt(ctx, T, x, y, 2.4, rgba(css("--setB"), 0.85)));
          polyline(ctx, T, path, css("--text"), 1.6);
          const [sx, sy] = cur[sSel];
          if (inV(V, sx, sy)) { dot(ctx, T.tx(sx), T.ty(sy), 5, css("--text")); ring(ctx, T.tx(sx), T.ty(sy), 5, css("--card"), 1.5); }
          if (showX0 && x0s) { const [qx, qy] = x0s[sSel]; ring(ctx, T.tx(qx), T.ty(qy), 5, css("--setC"), 2.2); }
          cv.T = T; cv.pts = cur;
        };
        cv.draw();
      });
      capA.textContent = "az egész sík"; capB.textContent = "közelről, a tanítópontokkal";
      const t = run.ts[kk], ab = W3_AB(t);
      hLab.textContent = w3F(hw, 3); kS.value = kk;
      ro.innerHTML = `lépés <b>${kk} / ${n}</b> &nbsp; t = <b>${Number.isInteger(t) ? t : w3F(t, 2)}</b> &nbsp; ᾱ<sub>t</sub> = <b>${w3Sci(ab, 3)}</b>` +
        (done ? " &nbsp; – kész, ezek a minták." : "");
      legend.replaceChildren(w3Sw("--setA", "tanítópont"), w3Sw("--setB", "minta (xₜ)"),
        w3Sw("--text", "egy kijelölt minta útja"), ...(showX0 && x0s ? [w3Sw("--setC", "x̂₀: a zajtalanító tippje a végeredményre")] : []));
      statRow.style.display = "";
      st[0].v.textContent = pct(stats.copy, 1);
      st[1].v.textContent = w3F(stats.med, 3);
      st[2].v.textContent = `${n} · ${eta ? "DDPM" : "DDIM"}`;
      const s = nn[sSel];
      note.innerHTML = `A végső mintákra számolva (mag: ${bSeed}). A kijelölt minta végül ${w3F(s.d, 3)} távolságra kerül a legközelebbi tanítóponttól` +
        (s.d < 0.01 ? " – <b>gyakorlatilag lemásolta</b>." : ".") + " Kattints egy mintára, hogy az útját kövesd. " +
        (hw < 0.0125 ? "Kis $h$-nál a zajtalanító a véges tanítóhalmazt tanulta meg tökéletesen – és ezért szinte csak a tanítópontokat tudja visszaadni. " +
          `Az utolsó lépés előtt még $\\sqrt{1-\\bar\\alpha_t}$ = ${w3F(Math.sqrt(1 - W3_AB(run.ts[n - 1])), 3)} zaj van a képen` +
          (n < 1000 ? " – ez összemérhető a szomszédos tanítópontok távolságával, ezért az utolsó tipp még két-három szomszéd átlaga lehet. Próbáld 1000 lépéssel: ott a minták gyakorlatilag mind tanítópontok."
            : " – ez már jóval kisebb a pontok távolságánál, így a minták gyakorlatilag mind tanítópontok.")
          : hw > 0.12 ? "Nagy $h$-nál a minták szétkenődnek a formán, és el is maszatolódnak róla."
            : "Közepes $h$-nál a minták a forma mentén szóródnak: újak, de a formát követik.");
      math(note);
    }

    function draw() {
      shG.paint(); tabG.paint(); nG.paint(); mG.paint();
      fwdBox.style.display = tab === "fwd" ? "" : "none";
      bwdBox.style.display = tab === "bwd" ? "" : "none";
      (tab === "fwd" ? drawFwd : drawBwd)();
    }
    [cvA, cvB].forEach(cv => cv.c.addEventListener("pointerdown", e => {
      if (!cv.T) return;
      const [px, py] = evXY(cv, e), i = w3Pick(cv.T, cv.pts, px, py);
      if (i < 0) return;
      if (tab === "fwd") sel = i; else sSel = i;
      draw();
    }));
    recompute(); k = 0; draw();
  };

  /* ==================================================================
     14.6-c  diffusion-digits – Egy diffúziós modell munka közben
     ================================================================== */
  /* lineáris ütemezés: β_t = 1e−4 … 0,02 (t = 0 … 999), ᾱ_t = Π_{s ≤ t}(1 − β_s) */
  const W3_LIN = (() => { const a = []; let p = 1; for (let t = 0; t < 1000; t++) { p *= 1 - (1e-4 + (0.02 - 1e-4) * t / 999); a.push(p); } return a; })();

  W["diffusion-digits"] = root => {
    const D = window.GEN14.ddpm, AE = window.GEN14.ae;
    header(root, "Egy diffúziós modell munka közben",
      "Fent egy valódi számjegyet zajosítunk; lent egy betanított, 1000 lépéses diffúziós modell nyolc mintavételének pillanatképei. " +
      "Kapcsold át, mit mutasson: a zajos képet, amit a háló bemenetként kap, vagy a háló <b>tippjét a tiszta képre</b> ($\\hat x_0$).");
    /* --- zajosítás --- */
    let dig = 3, t = 300, seed = 5, mode = "x";
    let eps = [];
    const mkEps = () => { const r = rng(seed); eps = Array.from({ length: 64 }, () => gauss(r)); };
    mkEps();
    const digG = toggleGroup(AE.label.map((l, i) => [i, String(l)]), () => dig, v => { dig = +v; draw(); });
    const tS = slider(0, 999, 1, t), tLab = h("b", null, "");
    tS.oninput = () => { t = +tS.value; draw(); };
    root.append(h("div", { class: "controls" }, small("számjegy:"), digG.bs),
      h("div", { class: "controls" }, h("label", { style: "flex:1;min-width:200px" }, "lépés t:", tS, tLab), btn("Új zaj", () => { seed++; mkEps(); draw(); })));
    const top = h("div", { style: "display:flex;gap:1rem;align-items:center;flex-wrap:wrap" });
    const cvTopBox = h("div", { style: "width:240px;max-width:100%" });
    const roTop = h("div", { class: "readout", style: "flex:1;min-width:200px;margin-top:0" });
    top.append(cvTopBox, roTop); root.append(top);
    const cvT = Calc.canvas(cvTopBox, 0.5, 240);

    /* --- a minták rácsa --- */
    const mG = toggleGroup([["x", "xₜ (amit a háló kap)"], ["x0", "x̂₀ (a háló tippje a tiszta képre)"]], () => mode, v => { mode = v; draw(); });
    root.append(h("div", { class: "controls", style: "margin-top:1rem" }, small("a rácsban:"), mG.bs));
    const gridBox = h("div", { style: "min-width:0" }); root.append(gridBox);
    const cvG = Calc.canvas(gridBox, 0.68, 760);
    const note = w3Note("");
    root.append(note);

    const toImg = x => x.map(v => clamp((v + 1) / 2 * 16, 0, 16));      // −1…1 → 0…16
    function draw() {
      digG.paint(); mG.paint();
      const ab = W3_LIN[t], sa = Math.sqrt(ab), sb = Math.sqrt(1 - ab);
      const x0 = AE.orig[dig].map(v => v / 16 * 2 - 1), xt = x0.map((v, i) => sa * v + sb * eps[i]);
      tLab.textContent = String(t);
      cvT.draw = () => {
        const { ctx, w, h: H } = cvT, s = Math.min(H - 18, (w - 12) / 2);
        ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
        drawDigit(ctx, 0, 16, s, AE.orig[dig]);
        drawDigit(ctx, s + 12, 16, s, toImg(xt));
        label(ctx, "x₀ (eredeti)", s / 2, 13, css("--muted"), "center", "600 11px system-ui, sans-serif");
        label(ctx, `xₜ, t = ${t}`, s * 1.5 + 12, 13, css("--muted"), "center", "600 11px system-ui, sans-serif");
      };
      cvT.draw();
      const snr = ab / (1 - ab);
      roTop.innerHTML = `ᾱ<sub>t</sub> = <b>${w3Sci(ab, 4)}</b><br>√ᾱ<sub>t</sub> = <b>${w3F(sa, 3)}</b> · jel, √(1 − ᾱ<sub>t</sub>) = <b>${w3F(sb, 3)}</b> · zaj<br>` +
        `jel/zaj arány ᾱ/(1 − ᾱ) = <b>${snr >= 100 ? fmt(snr, 0) : w3Sci(snr, 3)}</b>`;

      const near = D.t.reduce((bi, v, i) => (Math.abs(v - t) < Math.abs(D.t[bi] - t) ? i : bi), 0);
      cvG.draw = () => {
        const { ctx, w } = cvG, cols = 13, rows = 8, head = 30, gap = w < 520 ? 2 : 4;
        const s = Math.floor(Math.min((w - gap * (cols - 1)) / cols, 52));
        const W0 = cols * s + (cols - 1) * gap, ox = Math.floor((w - W0) / 2);
        const Hn = head + rows * (s + gap) + 4;
        if (Math.abs(cvG.h - Hn) > 1) { cvG.c.style.height = Hn + "px"; const dpr = window.devicePixelRatio || 1; cvG.c.height = Math.round(Hn * dpr); cvG.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cvG.h = Hn; }
        ctx.clearRect(0, 0, w, cvG.h); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, cvG.h);
        const fs = s < 30 ? 9.5 : 11;
        label(ctx, "t =", ox, 12, css("--muted"), "left", `600 ${fs}px system-ui, sans-serif`);
        for (let c = 0; c < cols; c++) {
          const x = ox + c * (s + gap);
          if (c === near) { ctx.fillStyle = css("--accent-soft"); ctx.fillRect(x - gap / 2, head - 13, s + gap, rows * (s + gap) + 13); }
          label(ctx, String(D.t[c]), x + s / 2, head - 2, c === near ? css("--accent") : css("--muted"), "center", `600 ${fs}px system-ui, sans-serif`);
          for (let r = 0; r < rows; r++) {
            const v = mode === "x" ? toImg(D.x[c][r]) : D.x0[c][r];
            drawDigit(ctx, x, head + r * (s + gap), s, v);
          }
        }
      };
      cvG.draw();
      note.innerHTML = (mode === "x"
        ? "Balról jobbra halad a mintavétel: tiszta zajból ($t = 999$) lépésenként tisztul a kép. Figyeld meg, hogy sokáig alig látszik valami, aztán $t \\approx 300$–$100$ között hirtelen összeáll a számjegy."
        : "A háló minden lépésben megtippeli a tiszta képet: $\\hat x_0 = (x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\hat\\varepsilon)/\\sqrt{\\bar\\alpha_t}$. " +
          "A legelején ($t = 999$–$800$) ez még zajos, csupa szélsőséges pixel: itt $\\sqrt{\\bar\\alpha_t}$ parányi (0,006–0,04), és a visszaszámolás a háló kis hibáját is óriásira nagyítja. " +
          "$t \\approx 600$–$500$ körül a tipp szinte minden sorban ugyanaz a homályos „átlagkép” – a zajból még nem tudható, mi lesz. Ahogy fogy a zaj, a tipp élesedik, a sorok szétválnak, és eldől, melyik számjegy lesz.") +
        " A kiemelt oszlop a fenti csúszkához legközelebbi lépés.";
      math(note);
    }
    draw();
  };

  /* ==================================================================
     14.7-b  cfg-2d – Az irányítás erőssége (osztályozómentes irányítás)
     ================================================================== */
  const W3_CFG = (() => {
    const A = [[-0.7, 0.35], [-0.55, -0.45], [-0.05, 0.15]], B = A.map(([x, y]) => [-x, -y]);
    const hs = [0.2, 0.2, 0.22], mu = [...A, ...B], h2 = [...hs, ...hs].map(v => v * v);
    return { mix: { mu, h2, lw: mu.map(() => Math.log(1 / 6)) }, cls: [[0, 1, 2], [3, 4, 5]], hs: [...hs, ...hs] };
  })();
  /* p(c | x) a tiszta adatra */
  function w3Post(x, y, c) {
    const { mu, h2 } = W3_CFG.mix;
    let pc = 0, pa = 0;
    mu.forEach(([a, b], k) => { const p = Math.exp(-((x - a) ** 2 + (y - b) ** 2) / (2 * h2[k])) / h2[k]; pa += p; if (W3_CFG.cls[c].includes(k)) pc += p; });
    return pa > 0 ? pc / pa : 0.5;
  }
  /* a c osztály adatának szórása (RMS távolság az átlagtól), pontosan */
  function w3ClassSpread(c) {
    const ks = W3_CFG.cls[c], { mu, h2 } = W3_CFG.mix, m = [0, 1].map(d => ks.reduce((s, k) => s + mu[k][d], 0) / ks.length);
    return Math.sqrt(ks.reduce((s, k) => s + (mu[k][0] - m[0]) ** 2 + (mu[k][1] - m[1]) ** 2 + 2 * h2[k], 0) / ks.length);
  }
  /* irányított mintavétel: x̃_0 = x̂_0ᵘ + s(x̂_0ᶜ − x̂_0ᵘ) (ez ugyanaz, mint ε̃ = ε̂_u + s(ε̂_c − ε̂_u)) */
  function w3CfgRun(c, s, start, nSteps = 25) {
    const wb = new Float64Array(6), { mix, cls } = W3_CFG;
    return w3Run(start, w3Times(W3_T, nSteps), W3_AB, (x, y, ab) => {
      const u = w3X0(x, y, ab, mix, null, wb), q = w3X0(x, y, ab, mix, cls[c], wb);
      return [u[0] + s * (q[0] - u[0]), u[1] + s * (q[1] - u[1])];
    }, 0, 0);
  }
  function w3CfgStats(c, S) {
    const n = S.length, m = [0, 1].map(d => S.reduce((a, p) => a + p[d], 0) / n);
    const spread = Math.sqrt(S.reduce((a, p) => a + (p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2, 0) / n);
    const sure = S.filter(([x, y]) => w3Post(x, y, c) > 0.9).length / n;
    const { cls, hs } = W3_CFG;
    const out = S.filter(([x, y]) => cls[c].every(k => Math.hypot(x - W3_CFG.mix.mu[k][0], y - W3_CFG.mix.mu[k][1]) > 3 * hs[k])).length / n;
    /* melyik felhőhöz tartozik a minta (a 6 közül a legnagyobb felelősségű)? cls[c][2] a c osztály középső, átfedő felhője */
    const { mu, h2 } = W3_CFG.mix;
    const mid = S.filter(([x, y]) => argmax(mu.map((m, k) => -((x - m[0]) ** 2 + (y - m[1]) ** 2) / (2 * h2[k]) - Math.log(h2[k]))) === cls[c][2]).length / n;
    return { sure, spread, out, mid, mean: m };
  }

  W["cfg-2d"] = root => {
    header(root, "Az irányítás erőssége",
      "Két osztály a síkon: <b>A</b> és <b>B</b>, mindkettő három kis Gauss-felhő keveréke, középen átfedéssel. A pontos zajtalanítónak két változata van: " +
      "a feltétel nélküli (minden felhőt lát, $\\hat\\varepsilon_u$) és a feltételes (csak a választott osztályét, $\\hat\\varepsilon_c$). " +
      "Az irányított becslés: $\\tilde\\varepsilon = \\hat\\varepsilon_u + s\\,(\\hat\\varepsilon_c - \\hat\\varepsilon_u)$. 300 minta, DDIM, 25 lépés.");
    let c = 0, s = 3, seed = 1, start = [];
    const mkStart = () => { const r = rng(seed * 7919 + 13); start = Array.from({ length: 300 }, () => [gauss(r), gauss(r)]); };
    mkStart();
    /* a tanítóadat illusztrációja: 150–150 pont a keverékből (rögzített mag) */
    const cloud = (() => {
      const r = rng(2024), out = [];
      for (let cc = 0; cc < 2; cc++) for (let i = 0; i < 150; i++) {
        const k = W3_CFG.cls[cc][i % 3], hh = W3_CFG.hs[k];
        out.push([W3_CFG.mix.mu[k][0] + hh * gauss(r), W3_CFG.mix.mu[k][1] + hh * gauss(r), cc]);
      }
      return out;
    })();
    const cG = toggleGroup([[0, "A osztály"], [1, "B osztály"]], () => c, v => { c = +v; curve = null; update(); });
    const sS = slider(0, 8, 0.25, s), sLab = h("b", null, "");
    sS.oninput = () => { s = +sS.value; update(); };
    const presets = [0, 1, 3, 7.5].map(v => btn(`s = ${fmt(v, 1)}`, () => { s = v; sS.value = v; update(); }));
    root.append(h("div", { class: "controls" }, small("feltétel:"), cG.bs, btn("Új mag", () => { seed++; mkStart(); curve = null; update(); })),
      h("div", { class: "controls" }, h("label", { style: "flex:1;min-width:200px" }, "irányítás s:", sS, sLab)),
      h("div", { class: "controls" }, small("jelölt értékek:"), presets));
    const [cvA, cvB, , boxB] = twoCanvas(root, 1, 0.8);
    const capB = h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, "Hogyan függ s-től? (az összes s egyszerre)");
    boxB.prepend(capB);
    const legend = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.4rem" });
    const st = [w3Stat(""), w3Stat("a saját középső (átfedő) felhőjénél; az adatban 23,7%"), w3Stat("a minták szórása (sokféleség)"), w3Stat("kilóg az adatból")];
    const note = w3Note("");
    root.append(legend, h("div", { class: "stat-row" }, st.map(x => x.el)), note);

    let curve = null;                                          // s ↦ statisztikák, 0 … 8
    const sGrid = Array.from({ length: 33 }, (_, i) => i * 0.25);
    function update() {
      cG.paint();
      sLab.textContent = fmt(s, 2);
      presets.forEach((b, i) => b.classList.toggle("on", Math.abs(s - [0, 1, 3, 7.5][i]) < 1e-9));
      const run = w3CfgRun(c, s, start), S = w3Pairs(run.X[run.X.length - 1]), R = w3CfgStats(c, S);
      root.__w3 = { c, s, seed, start, S, R };
      if (!curve) curve = sGrid.map(v => { const r = w3CfgRun(c, v, start); return w3CfgStats(c, w3Pairs(r.X[r.X.length - 1])); });
      const ref = w3ClassSpread(c), cn = c ? "B" : "A", cv = c ? "--setB" : "--setA";
      cvA.draw = () => {
        const V = eqView(cvA, 0, 0, 1.6, 1.6, { xname: "", yname: "" }), T = Calc.plot(cvA, V, []), { ctx } = cvA;
        /* „biztos” területek: p(c | x) > 0,9 */
        const cell = 5;
        for (let px = 0; px < cvA.w; px += cell) for (let py = 0; py < cvA.h; py += cell) {
          const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2), pA = w3Post(x, y, 0);
          if (pA > 0.9) { ctx.fillStyle = rgba(css("--setA"), 0.13); ctx.fillRect(px, py, cell, cell); }
          else if (pA < 0.1) { ctx.fillStyle = rgba(css("--setB"), 0.13); ctx.fillRect(px, py, cell, cell); }
        }
        cloud.forEach(([x, y, cc]) => { ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 2.2, 0, 2 * Math.PI); ctx.fillStyle = rgba(css(cc ? "--setB" : "--setA"), 0.5); ctx.fill(); });
        S.forEach(([x, y]) => { if (x < V.xmin || x > V.xmax || y < V.ymin || y > V.ymax) return; dot(ctx, T.tx(x), T.ty(y), 3, css("--text")); });
        dot(ctx, T.tx(R.mean[0]), T.ty(R.mean[1]), 6, css(cv)); ring(ctx, T.tx(R.mean[0]), T.ty(R.mean[1]), 6, css("--text"), 2);
        label(ctx, "A", T.tx(-1.35), T.ty(1.3), css("--setA"), "center", "700 15px system-ui, sans-serif", "middle");
        label(ctx, "B", T.tx(1.35), T.ty(1.3), css("--setB"), "center", "700 15px system-ui, sans-serif", "middle");
      };
      cvA.draw();
      cvB.draw = () => {
        const V = { xmin: -0.5, xmax: 8.6, ymin: -0.08, ymax: 1.12, xstep: 1, ystep: 0.25, xname: "s", yname: "" };
        const sc = 1 / (2 * ref);                                // szórás → 0…1 skála (a = 2·adat-szórás)
        const T = Calc.plot(cvB, V, [
          { hline: 1, color: "--border" }
        ]), { ctx } = cvB;
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].sure]), css(cv), 2.4);
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].spread * sc]), css("--setC"), 2.4);
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].out]), css("--bad"), 2, [6, 4]);
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].mid]), css("--accent"), 2, [2, 3]);
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(T.tx(s), T.ty(-0.05)); ctx.lineTo(T.tx(s), T.ty(1.1)); ctx.stroke(); ctx.restore();
        dot(ctx, T.tx(s), T.ty(R.sure), 4.5, css(cv)); dot(ctx, T.tx(s), T.ty(R.spread * sc), 4.5, css("--setC")); dot(ctx, T.tx(s), T.ty(R.out), 4, css("--bad")); dot(ctx, T.tx(s), T.ty(R.mid), 4, css("--accent"));
        polyline(ctx, T, [[-0.5, ref * sc], [8.6, ref * sc]], css("--setC"), 1, [2, 4]);
        label(ctx, "az adat szórása", T.tx(8.5), T.ty(ref * sc) - 3, css("--setC"), "right", "600 11px system-ui, sans-serif");
      };
      cvB.draw();
      legend.replaceChildren(w3Sw("--setA", "A tanítópontjai"), w3Sw("--setB", "B tanítópontjai"), w3Sw("--text", `minta („${cn}” feltétellel)`), w3Sw(cv, "a minták átlaga"),
        h("br"), w3Sw("--setA", "„biztos A” terület", false), w3Sw("--setB", "„biztos B” terület", false),
        h("span", { style: "white-space:nowrap" }, `· jobb oldalt: `), w3Sw(cv, "biztos arány"), w3Sw("--accent", "középső felhőből"), w3Sw("--setC", "szórás (½ = az adaté)"), w3Sw("--bad", "kilóg"));
      st[0].el.lastChild.textContent = `a minták a „biztos ${cn}” területen (p(${cn} | x) > 0,9)`;
      st[0].v.textContent = pct(R.sure, 1);
      st[1].v.textContent = pct(R.mid, 1);
      st[2].v.textContent = `${w3F(R.spread, 2)} (adat: ${w3F(ref, 2)})`;
      st[3].v.textContent = pct(R.out, 1);
      note.innerHTML = (s === 0 ? "$s = 0$: a feltételt figyelmen kívül hagyjuk – feltétel nélküli minták, mindkét osztályból."
        : Math.abs(s - 1) < 1e-9 ? `$s = 1$: pontosan a feltételes eloszlás, $p(x \\mid ${cn})$ – a minták nagyjából az adatot követik: a középső, átfedő felhőbe is jut belőlük, és a szórásuk közel van az adatéhoz.`
          : s < 1 ? "$0 < s < 1$: a feltétel csak gyengén hat, a másik osztályból is kerülnek minták."
            : s <= 4 ? `$s > 1$: a minták a másik osztálytól <b>távolodnak</b> – egyre több esik a „biztos ${cn}” területre, de eltűnik a középső, átfedő felhő, és csökken a sokféleség.`
              : "Nagy $s$: a becslés „túllő” – a minták kevés helyre tömörülnek, és egy részük már kilóg az adatból (minden felhőtől 3 szórásnál messzebb).") +
        " „Kilóg”: minden saját felhő középpontjától 3 szórásnál messzebb.";
      math(note);
    }
    update();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t és az ml.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
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
