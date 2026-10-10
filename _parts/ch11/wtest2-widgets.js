/* =========================================================
   Mesterséges intelligencia 11. fejezet – interaktív szemléltetések
   (konvolúciós hálók: eltolás és MLP, konvolúció, pooling, recepciós mező,
   architektúrák, IoU, ViT-foltok, számjegyfelismerő CNN)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); a hálók: cnn-nets.js (window.CNN11).
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
  const SUBS = "₀₁₂₃₄₅₆₇₈₉", sub = n => String(n).replace(/\d/g, d => SUBS[d]);


  /* ------------------------------------------------------------------
     Konvolúciós segédfüggvények (11. fejezet)
     Térképek: Float32Array, soronként (index = r·W + c). Keresztkorreláció, mint a PyTorch-ban.
     ------------------------------------------------------------------ */
  /* egy csatorna × egy 3×3-as (vagy k×k-s) kernel, kitöltés p, lépésköz s → { out, H, W } */
  function conv1(x, H, Wd, k, K = 3, p = 1, s = 1, bias = 0) {
    const Ho = Math.floor((H + 2 * p - K) / s) + 1, Wo = Math.floor((Wd + 2 * p - K) / s) + 1, out = new Float32Array(Math.max(0, Ho * Wo));
    for (let r = 0; r < Ho; r++) for (let c = 0; c < Wo; c++) {
      let sum = bias;
      for (let a = 0; a < K; a++) { const rr = r * s + a - p; if (rr < 0 || rr >= H) continue;
        for (let b = 0; b < K; b++) { const cc = c * s + b - p; if (cc < 0 || cc >= Wd) continue; sum += k[a * K + b] * x[rr * Wd + cc]; } }
      out[r * Wo + c] = sum;
    }
    return { out, H: Ho, W: Wo };
  }
  /* többcsatornás réteg: xs = [Cin térkép], ks = [Cout][Cin][9] (Cin = 1 esetén [Cout][9] is jó), 3×3, kitöltés 1 */
  function convLayer(xs, H, Wd, ks, bs, relu = true) {
    return ks.map((kc, o) => {
      const acc = new Float32Array(H * Wd).fill(bs[o]);
      const kk = Array.isArray(kc[0]) ? kc : [kc];
      kk.forEach((k, i) => { const r = conv1(xs[i], H, Wd, k, 3, 1, 1, 0).out; for (let j = 0; j < acc.length; j++) acc[j] += r[j]; });
      if (relu) for (let j = 0; j < acc.length; j++) if (acc[j] < 0) acc[j] = 0;
      return acc;
    });
  }
  /* 2×2-es pooling, lépésköz 2 (max vagy átlag) */
  function pool2(x, H, Wd, mode = "max") {
    const Ho = Math.floor(H / 2), Wo = Math.floor(Wd / 2), out = new Float32Array(Ho * Wo);
    for (let r = 0; r < Ho; r++) for (let c = 0; c < Wo; c++) {
      const v = [x[2 * r * Wd + 2 * c], x[2 * r * Wd + 2 * c + 1], x[(2 * r + 1) * Wd + 2 * c], x[(2 * r + 1) * Wd + 2 * c + 1]];
      out[r * Wo + c] = mode === "max" ? Math.max(...v) : (v[0] + v[1] + v[2] + v[3]) / 4;
    }
    return out;
  }
  const softmax = z => { const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); };
  const argmax = a => a.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  /* a tesztképek (8×8, 0–16) és címkék */
  let TEST = null;
  function testSet() {
    if (TEST) return TEST;
    const D = window.CNN11 && window.CNN11.test;
    if (!D) return null;
    const X = [], y = [];
    for (let i = 0; i < D.n; i++) { const v = new Array(64); for (let j = 0; j < 64; j++) v[j] = D.X.charCodeAt(i * 64 + j) - 97; X.push(v); y.push(+D.y[i]); }
    return (TEST = { X, y });
  }
  /* 8×8-as kép (0–16) a 16×16-os lapra, (4 + dx, 4 + dy) eltolással; értékek 0–1. A lapról lelógó rész elvész. */
  const BOARD = 16;
  function place(v64, dx = 0, dy = 0) {
    const out = new Float32Array(BOARD * BOARD);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const rr = r + 4 + dy, cc = c + 4 + dx;
      if (rr >= 0 && rr < BOARD && cc >= 0 && cc < BOARD) out[rr * BOARD + cc] = v64[r * 8 + c] / 16;
    }
    return out;
  }
  /* egy háló előre menete a 16×16-os lapon (x: 256 szám, 0–1) */
  function forwardNet(net, x) {
    if (net.kind === "mlp") {
      const hdn = net.W1.map((row, j) => Math.max(0, row.reduce((s, w, i) => s + w * x[i], net.b1[j])));
      const z = net.W2.map((row, k) => row.reduce((s, w, j) => s + w * hdn[j], net.b2[k]));
      return { h: hdn, z, p: softmax(z) };
    }
    const a1 = convLayer([x], BOARD, BOARD, net.k1, net.b1);           // 8 × (16×16)
    let src = a1, S = BOARD;
    if (net.pool) { src = a1.map(m => pool2(m, BOARD, BOARD)); S = BOARD / 2; }  // 8 × (8×8)
    const a2 = convLayer(src, S, S, net.k2, net.b2);                   // 32 × (S×S)
    const g = a2.map(m => { let mx = -Infinity, at = 0; m.forEach((v, i) => { if (v > mx) { mx = v; at = i; } }); return { v: mx, at }; });
    const z = net.W.map((row, k) => row.reduce((s, w, j) => s + w * g[j].v, net.b[k]));
    return { a1, p1: net.pool ? src : null, S, a2, g, z, p: softmax(z) };
  }
  /* szürkeárnyalatos / előjeles térkép kirajzolása egy téglalapba */
  function drawMap(ctx, m, H, Wd, x0, y0, cell, opt = {}) {
    const signed = opt.signed, mx = opt.max || Math.max(1e-9, ...Array.from(m, v => Math.abs(v)));
    const pos = hexRGB(css(opt.pos || "--setB")), neg = hexRGB(css(opt.neg || "--setA")), bg = hexRGB(css("--card")), fg = hexRGB(css("--text"));
    for (let r = 0; r < H; r++) for (let c = 0; c < Wd; c++) {
      const v = m[r * Wd + c], t = clamp(Math.abs(v) / mx, 0, 1);
      const col = signed ? (v >= 0 ? pos : neg) : fg;
      ctx.fillStyle = `rgb(${bg.map((b, i) => Math.round(b + (col[i] - b) * t)).join(",")})`;
      ctx.fillRect(x0 + c * cell, y0 + r * cell, Math.ceil(cell), Math.ceil(cell));
    }
    if (opt.frame !== false) { ctx.save(); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.strokeRect(x0 - 0.5, y0 - 0.5, Wd * cell + 1, H * cell + 1); ctx.restore(); }
  }
  /* az exportokhoz (node-os ellenőrzés) */
  window.__W11 = { conv1, convLayer, pool2, forwardNet, place, testSet, softmax, argmax };

  const W = {};

  /* ------------------------------------------------------------------
     Közös segédek a 11. fejezet 5–8. widgetjéhez (w2_ előtaggal, hogy ne ütközzenek)
     ------------------------------------------------------------------ */
  const w2_int = n => fmt(n, 0).replace(/ /g, " ");            // ezres tagolás keskeny szóközzel
  const w2_sgn = v => (v < 0 ? "−" + -v : String(v));
  /* Calc.canvas, de a magasság a szélesség függvénye (átméretezéskor és témaváltáskor is) */
  function w2_cv(parent, hFn, maxW = 760) {
    const cv = Calc.canvas(parent, 0.5, maxW);
    cv.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW), hh = Math.max(1, Math.round(hFn(w)));
      const dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cv.w = w; cv.h = hh;
    };
    cv.resize();
    return cv;
  }
  /* felirat, amely szükség esetén kisebb betűvel fér el a megadott szélességben */
  function w2_fit(ctx, txt, x, y, maxW, color, align = "left", size = 12, weight = 600) {
    ctx.save(); let s = size;
    for (; s > 8; s -= 0.5) { ctx.font = `${weight} ${s}px system-ui, sans-serif`; if (ctx.measureText(txt).width <= maxW) break; }
    ctx.restore();
    label(ctx, txt, x, y, color, align, `${weight} ${s}px system-ui, sans-serif`);
  }
  const w2_pad = (style = "") => h("div", { style: "min-width:0;" + style });

  /* ------------------------------------------------------------------
     11.4  cnn-shapes – architektúrák: kimeneti alak és paraméterszám rétegenként
     ------------------------------------------------------------------ */
  const w2_conv = (k, c, s = 1, p = 0) => ({ t: "conv", k, c, s, p });
  const w2_pool = (k = 2, s = 2, avg = false) => ({ t: "pool", k, s, p: 0, avg });
  const w2_fc = n => ({ t: "fc", n });
  const w2_vgg = (n, c) => Array.from({ length: n }, () => w2_conv(3, c, 1, 1));
  const W2_ARCH = {
    ours: { name: "a mi CNN-ünk", n: 16, c: 1, min: 4, max: 64, quick: [16, 32],
      L: [w2_conv(3, 8, 1, 1), w2_pool(), w2_conv(3, 32, 1, 1), { t: "gmax" }, w2_fc(10)],
      note: "a 11.9-es CNN-B (pooling-gal) · összehasonlításul az MLP 256–16–10: 256·16 + 16 + 16·10 + 10 = 4 282 paraméter – kisebb bemenetre is több" },
    lenet: { name: "LeNet-5", n: 32, c: 1, min: 20, max: 96, quick: [28, 32],
      L: [w2_conv(5, 6), w2_pool(2, 2, true), w2_conv(5, 16), w2_pool(2, 2, true), w2_conv(5, 120), w2_fc(84), w2_fc(10)],
      note: "modern számolás: a C3 minden csatornát lát, a pooling paraméter nélküli · az eredeti LeNet-5 ritkított C3-mal és tanítható alminta-rétegekkel kb. 60 000 paraméter" },
    alex: { name: "AlexNet", n: 227, c: 3, min: 160, max: 320, quick: [224, 227],
      L: [w2_conv(11, 96, 4), w2_pool(3, 2), w2_conv(5, 256, 1, 2), w2_pool(3, 2), w2_conv(3, 384, 1, 1), w2_conv(3, 384, 1, 1),
        w2_conv(3, 256, 1, 1), w2_pool(3, 2), w2_fc(4096), w2_fc(4096), w2_fc(1000)],
      note: "egy GPU-s, csoportosítás nélküli változat · a cikk 224 × 224-et ír, de azzal az első réteg kimenete nem egész – próbáld ki a 224-et" },
    vgg: { name: "VGG-16", n: 224, c: 3, min: 32, max: 512, quick: [32, 224, 448],
      L: [...w2_vgg(2, 64), w2_pool(), ...w2_vgg(2, 128), w2_pool(), ...w2_vgg(3, 256), w2_pool(), ...w2_vgg(3, 512), w2_pool(),
        ...w2_vgg(3, 512), w2_pool(), w2_fc(4096), w2_fc(4096), w2_fc(1000)],
      note: "13 konvolúciós (mind 3 × 3, p1) + 3 FC-réteg = 16 tanítható réteg · a konvolúció nem függ a kép méretétől, az első FC-réteg igen" },
  };
  function w2_shapes(A, n) {
    let H = n, C = A.c, dead = 0;
    const rows = A.L.map((l, i) => {
      const r = { l, Hin: H, Cin: C, P: 0, exact: true };
      if (dead) { r.dead = true; return r; }
      if (l.t === "conv" || l.t === "pool") {
        r.num = H + 2 * l.p - l.k; r.exact = r.num >= 0 && r.num % l.s === 0;
        H = Math.floor(r.num / l.s) + 1;
        if (r.num < 0 || H < 1) { r.dead = true; dead = i + 1; return r; }
        if (l.t === "conv") { r.P = l.c * (l.k * l.k * C + 1); C = l.c; }
      } else if (l.t === "gmax") H = 1;
      else { r.nin = H * H * C; r.P = r.nin * l.n + l.n; H = 1; C = l.n; }
      r.H = H; r.C = C; r.flat = l.t === "fc" || l.t === "gmax";
      return r;
    });
    const tot = rows.reduce((s, r) => s + r.P, 0), fcP = rows.filter(r => r.l.t === "fc").reduce((s, r) => s + r.P, 0);
    return { rows, tot, fcP, dead };
  }
  const w2_type = l => l.t === "conv" ? `konv ${l.k}×${l.k}, ${w2_int(l.c)}` + (l.s > 1 ? `\u00a0/\u00a0s${l.s}` : "") + (l.p ? `\u00a0/\u00a0p${l.p}` : "")
    : l.t === "pool" ? `${l.avg ? "átlag" : "max"}-pool ${l.k}×${l.k}` + (l.s !== l.k ? `\u00a0/\u00a0s${l.s}` : "")
    : l.t === "gmax" ? "globális max" : `FC ${w2_int(l.n)}`;

  W["cnn-shapes"] = root => {
    header(root, "Rétegről rétegre: kimeneti alak és paraméterszám",
      "Válassz egy hálót! A táblázat rétegenként mutatja a kimenet alakját (magasság × szélesség × csatorna) és a paraméterek számát; a csík a teljes paraméterszámból vett részesedés " +
      "(<b style='color:var(--accent)'>konvolúció</b>, <b style='color:var(--setB)'>teljesen összekötött, FC</b>). Vidd az egeret egy sorra (vagy koppints rá): lent látod a számolást. " +
      "Kimeneti méret: $\\lfloor (n + 2p - k)/s \\rfloor + 1$; paraméterek: konvolúció $C_\\text{ki}\\cdot(k\\cdot k\\cdot C_\\text{be} + 1)$, FC $n_\\text{be}\\cdot n_\\text{ki} + n_\\text{ki}$, pooling 0. " +
      "Állítsd a bemenet méretét is: mit csinál az FC-réteg paraméterszáma?");
    let key = "ours", n = W2_ARCH.ours.n, pinned = 1, hover = null;
    const g = toggleGroup(Object.entries(W2_ARCH).map(([k, A]) => [k, A.name]), () => key, k => { key = k; n = W2_ARCH[k].n; pinned = 1; hover = null; setup(); });
    const sN = slider(4, 64, 1, n), oN = h("b"), quick = h("span", { style: "display:inline-flex;gap:.4rem;flex-wrap:wrap" });
    sN.style.maxWidth = "150px";
    sN.addEventListener("input", () => { n = +sN.value; sync(); });
    const step = d => { const A = W2_ARCH[key]; n = clamp(n + d, A.min, A.max); sync(); };
    root.append(h("div", { class: "controls" }, g.bs),
      h("div", { class: "controls" }, small("bemenet oldalhossza n:"),
        h("span", { style: "display:inline-flex;align-items:center;gap:.4rem;white-space:nowrap" }, btn("−", () => step(-1)), sN, btn("+", () => step(1))), oN, quick));
    const tw = h("div", { style: "overflow-x:auto;margin-top:.4rem" }), out = h("div", { class: "readout" });
    root.append(tw, out);
    function setup() {
      const A = W2_ARCH[key];
      sN.min = A.min; sN.max = A.max;
      quick.replaceChildren(...A.quick.map(q => { const b = btn(String(q), () => { n = q; sync(); }); b.dataset.q = q; return b; }));
      sync();
    }
    const TD = "padding:.22rem .4rem;vertical-align:top;border-bottom:1px solid var(--border)";
    let R = null, trs = [];
    const selOf = () => (hover != null ? hover : pinned);
    function sync() {
      const A = W2_ARCH[key];
      R = w2_shapes(A, n);
      g.paint(); sN.value = n; oN.textContent = `${n} × ${n} × ${A.c}`;
      quick.querySelectorAll("button").forEach(b => b.classList.toggle("on", +b.dataset.q === n));
      const tb = h("tbody");
      const row = (i, cells) => {
        const tr = h("tr", { style: "cursor:pointer" }, cells);
        tr.addEventListener("mouseenter", () => { hover = i; showSel(); });
        tr.addEventListener("click", () => { pinned = i; hover = null; showSel(); });
        return tr;
      };
      trs = [row(0, [h("td", { style: TD + ";color:var(--muted)" }, "0"), h("td", { style: TD }, "bemenet"),
        h("td", { style: TD + ";white-space:nowrap" }, `${n}×${n}×${A.c}`), h("td", { style: TD + ";color:var(--muted)" }, "—")])];
      R.rows.forEach((r, j) => {
        const i = j + 1, col = r.l.t === "fc" ? "var(--setB)" : "var(--accent)", sh = R.tot ? r.P / R.tot : 0;
        const outTxt = r.dead ? "—" : r.flat ? w2_int(r.C) : `${r.H}×${r.H}×${r.C}`;
        const pc = r.dead ? h("td", { style: TD + ";color:var(--muted)" }, "—") : h("td", { style: TD + ";min-width:7.5rem" },
          h("div", { style: "font-family:var(--mono);white-space:nowrap" }, r.P ? w2_int(r.P) : "0"),
          r.P ? h("div", { style: "display:flex;align-items:center;gap:.35rem" },
            h("div", { style: "flex:1;height:7px;background:var(--bg-soft);border-radius:4px;overflow:hidden;min-width:2.5rem" },
              h("div", { style: `height:100%;width:${(100 * sh).toFixed(2)}%;background:${col}` })),
            h("span", { style: "font-size:.78rem;color:var(--muted);white-space:nowrap" }, sh < 0.0005 ? "<0,1%" : pct(sh, 1))) : null);
        trs.push(row(i, [h("td", { style: TD + ";color:var(--muted)" }, String(i)), h("td", { style: TD }, w2_type(r.l)),
          h("td", { style: TD + ";white-space:nowrap" + (r.exact ? "" : ";color:var(--bad)") }, outTxt + (r.exact || r.dead ? "" : " ⚠")), pc]));
      });
      tb.append(...trs);
      const th = t => h("th", { style: "padding:.25rem .4rem;text-align:left;font-size:.8rem" }, t);
      const tbl = h("table", { style: "margin:0;font-size:.84rem;width:100%" },
        h("thead", null, h("tr", null, th("#"), th("réteg"), th("kimenet"), th("paraméter · arány"))), tb,
        h("tfoot", null, h("tr", null, h("td", { style: TD }), h("td", { style: TD + ";font-weight:700" }, "összesen"), h("td", { style: TD }),
          h("td", { style: TD + ";font-family:var(--mono);font-weight:700;white-space:nowrap" }, R.dead ? "—" : w2_int(R.tot)))));
      tbl.addEventListener("mouseleave", () => { hover = null; showSel(); });
      tw.replaceChildren(tbl);
      showSel();
    }
    /* a kiválasztott sor kiemelése és számolása (a táblázatot nem építi újra) */
    function showSel() {
      const A = W2_ARCH[key], sel = Math.min(selOf(), R.rows.length);
      trs.forEach((tr, i) => { tr.style.background = i === sel ? "color-mix(in srgb, var(--accent) 13%, var(--card))" : ""; });
      let L1;
      if (sel === 0) L1 = `bemenet: ${n} × ${n} × ${A.c} = <b>${w2_int(n * n * A.c)}</b> szám`;
      else {
        const r = R.rows[sel - 1], l = r.l, head = `${sel}. réteg (${w2_type(l)}): `;
        if (r.dead) L1 = head + `<span style="color:var(--bad)">⚠ a térkép elfogyott: a bemenet túl kicsi ehhez a hálóhoz</span>`;
        else if (l.t === "conv" || l.t === "pool") {
          L1 = head + `⌊(${r.Hin} + ${2 * l.p} − ${l.k})/${l.s}⌋ + 1 = ` + (r.exact ? "" : `⌊${fmt(r.num / l.s, 2)}⌋ + 1 = `) +
            `<b>${r.H}</b> → ${r.H} × ${r.H} × ${r.C} · paraméterek: ` +
            (l.t === "conv" ? `${l.c}·(${l.k}·${l.k}·${r.Cin} + 1) = <b>${w2_int(r.P)}</b>` : "0 (a pooling csak kiválaszt / átlagol, nem tanul)");
          if (!r.exact) L1 += `<br><span style="color:var(--bad)">⚠ (${r.Hin}${l.p ? " + " + 2 * l.p : ""} − ${l.k})/${l.s} + 1 = ${fmt(r.num / l.s + 1, 2)} nem egész: lefelé kerekítünk, ` +
            `az utolsó ${r.num % l.s} sort és oszlopot a ${l.t === "conv" ? "szűrő" : "pooling-ablak"} nem éri el.</span>`;
        } else if (l.t === "gmax") L1 = head + `minden csatornából a legnagyobb érték: ${r.Hin} × ${r.Hin} × ${r.Cin} → <b>${r.C}</b> szám · paraméterek: 0`;
        else L1 = head + `bemenet: ${r.Hin > 1 ? `${r.Hin}·${r.Hin}·${r.Cin} = ` : ""}${w2_int(r.nin)} szám · paraméterek: ${w2_int(r.nin)}·${w2_int(l.n)} + ${w2_int(l.n)} = <b>${w2_int(r.P)}</b>`;
      }
      const L2 = R.dead ? `<span style="color:var(--bad)">⚠ n = ${n} esetén a háló nem működik: a(z) ${R.dead}. rétegnél a térkép elfogyott.</span>`
        : `összesen: <b>${w2_int(R.tot)}</b> paraméter · konvolúciós: ${w2_int(R.tot - R.fcP)} (${pct((R.tot - R.fcP) / R.tot, 1)}) · FC: ${w2_int(R.fcP)} (${pct(R.fcP / R.tot, 1)})`;
      const bad = R.rows.filter(r => !r.exact && !r.dead).length, selR = sel ? R.rows[sel - 1] : null;
      out.innerHTML = L1 + "<br>" + L2 + (bad && (!selR || selR.exact) ? `<br><span style="color:var(--bad)">⚠ ${bad} rétegnél nem egész a kimeneti méret – nézd meg a ⚠-tel jelölt sort.</span>` : "") +
        `<br><span class="muted">${A.note}</span>`;
    }
    setup();
  };

  /* ------------------------------------------------------------------
     11.6  iou-viz – metszet / unió két dobozra
     ------------------------------------------------------------------ */
  W["iou-viz"] = root => {
    header(root, "IoU: mennyire fedi a jósolt doboz a valódit?",
      "Két tengelyirányú doboz a 10 × 10-es rácson: a <b style='color:var(--setA)'>valódi</b> (A) és a <b style='color:var(--setB)'>jósolt</b> (B). " +
      "Fogd meg a dobozt a belsejénél, és húzd el, vagy méretezd a sarkainál (ujjal is megy) – a csúcsok rácspontra ugranak. A sraffozott rész a metszet. " +
      "$\\text{IoU} = |A \\cap B| \\,/\\, |A \\cup B|$, $\\text{Dice} = 2\\,|A \\cap B| \\,/\\, (|A| + |B|)$. A jóslat <b>találat</b>, ha az IoU eléri a küszöböt. " +
      "A koordináták (x; y), az y lefelé nő, mint a képeken.");
    let A = [1, 1, 5, 5], B = [2, 1, 6, 5], thr = 0.5, drag = null;
    const set = (a, b) => { A = a.slice(); B = b.slice(); sync(); };
    const gT = toggleGroup([["0.5", "0,5"], ["0.75", "0,75"]], () => String(thr), v => { thr = +v; sync(); });
    root.append(h("div", { class: "controls" },
      btn("1. példa", () => set([0, 0, 4, 4], [2, 2, 6, 6])), btn("2. példa", () => set([1, 1, 5, 5], [2, 1, 6, 5])),
      btn("Pontos találat", () => set(A, A)), btn("Nincs átfedés", () => set([1, 1, 5, 5], [6, 5, 9, 9]))),
      h("div", { class: "controls" }, small("küszöb:"), gT.bs));
    const wrap = h("div", { style: "max-width:440px;margin:0 auto" });
    root.append(wrap);
    const cv = Calc.canvas(wrap, 1, 440), out = h("div", { class: "readout" });
    root.append(out);
    let G = { ox: 26, oy: 24, s: 30 };
    const geo = () => { const ox = 26, oy = 24, s = Math.min(cv.w - ox - 10, cv.h - oy - 10) / 10; return (G = { ox, oy, s }); };
    const area = b => (b[2] - b[0]) * (b[3] - b[1]);
    const inter = () => { const w = Math.max(0, Math.min(A[2], B[2]) - Math.max(A[0], B[0])), hh = Math.max(0, Math.min(A[3], B[3]) - Math.max(A[1], B[1])); return { w, h: hh, I: w * hh }; };
    cv.draw = () => {
      const { ctx, w } = cv, { ox, oy, s } = geo(), X = x => ox + x * s, Y = y => oy + y * s;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, cv.h);
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(X(i), Y(0)); ctx.lineTo(X(i), Y(10)); ctx.moveTo(X(0), Y(i)); ctx.lineTo(X(10), Y(i)); ctx.stroke(); }
      ctx.restore();
      for (let i = 0; i <= 10; i++) {
        label(ctx, String(i), X(i), oy - 6, css("--muted"), "center", "600 11px system-ui, sans-serif");
        label(ctx, String(i), ox - 7, Y(i), css("--muted"), "right", "600 11px system-ui, sans-serif", "middle");
      }
      const box = (b, v, dash) => {
        const c = css(v);
        ctx.save(); ctx.fillStyle = rgba(c, 0.16); ctx.fillRect(X(b[0]), Y(b[1]), (b[2] - b[0]) * s, (b[3] - b[1]) * s);
        ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.setLineDash(dash); ctx.strokeRect(X(b[0]), Y(b[1]), (b[2] - b[0]) * s, (b[3] - b[1]) * s); ctx.restore();
      };
      box(A, "--setA", []); box(B, "--setB", [7, 4]);
      const it = inter();
      if (it.I > 0) {
        const x0 = X(Math.max(A[0], B[0])), y0 = Y(Math.max(A[1], B[1])), ww = it.w * s, hh = it.h * s;
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, ww, hh); ctx.clip();
        ctx.fillStyle = rgba(css("--accent"), 0.22); ctx.fillRect(x0, y0, ww, hh);
        ctx.strokeStyle = rgba(css("--accent"), 0.75); ctx.lineWidth = 1.5;
        for (let d = -hh; d < ww; d += 8) { ctx.beginPath(); ctx.moveTo(x0 + d, y0 + hh); ctx.lineTo(x0 + d + hh, y0); ctx.stroke(); }
        ctx.restore();
        ctx.save(); ctx.font = "700 12px system-ui, sans-serif"; const tw = ctx.measureText(`metszet: ${it.I}`).width; ctx.restore();
        ctx.fillStyle = rgba(css("--card"), 0.88); ctx.fillRect(x0 + ww / 2 - tw / 2 - 4, y0 + hh / 2 - 9, tw + 8, 18);
        label(ctx, `metszet: ${it.I}`, x0 + ww / 2, y0 + hh / 2, css("--text"), "center", "700 12px system-ui, sans-serif", "middle");
      }
      /* feliratok a dobozon kívül (A fölött, B alatt), ha van hely; háttérrel, hogy a vonalakon is olvasható legyen */
      const tag = (b, txt, v, below) => {
        const out = below ? b[3] < 10 : b[1] > 0, y = below ? (out ? Y(b[3]) + 3 : Y(b[3]) - 17) : (out ? Y(b[1]) - 17 : Y(b[1]) + 3);
        ctx.save(); ctx.font = "700 12px system-ui, sans-serif"; const tw = ctx.measureText(txt).width;
        ctx.fillStyle = rgba(css("--card"), 0.85); ctx.fillRect(X(b[0]) + 2, y, tw + 6, 15); ctx.restore();
        label(ctx, txt, X(b[0]) + 5, y + 1, css(v), "left", "700 12px system-ui, sans-serif", "top");
      };
      tag(A, "A valódi", "--setA", false); tag(B, "B jósolt", "--setB", true);
      const hs = 4;
      [[A, "--setA"], [B, "--setB"]].forEach(([b, v]) => [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]].forEach(([x, y]) => {
        ctx.fillStyle = css(v); ctx.fillRect(X(x) - hs, Y(y) - hs, 2 * hs, 2 * hs);
        ctx.strokeStyle = css("--card"); ctx.lineWidth = 1; ctx.strokeRect(X(x) - hs, Y(y) - hs, 2 * hs, 2 * hs);
      }));
    };
    const toG = (px, py) => [(px - G.ox) / G.s, (py - G.oy) / G.s];
    function hit(px, py) {
      const tol = Math.max(11, G.s * 0.32);
      for (const [who, b] of [["B", B], ["A", A]]) {
        const cs = [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]];
        for (let c = 0; c < 4; c++) if (Math.hypot(G.ox + cs[c][0] * G.s - px, G.oy + cs[c][1] * G.s - py) <= tol) return { who, c };
      }
      const [gx, gy] = toG(px, py);
      for (const [who, b] of [["B", B], ["A", A]]) if (gx > b[0] && gx < b[2] && gy > b[1] && gy < b[3]) return { who, c: -1 };
      return null;
    }
    const curs = ht => !ht ? "default" : ht.c < 0 ? "grab" : (ht.c === 0 || ht.c === 3 ? "nwse-resize" : "nesw-resize");
    cv.c.addEventListener("pointerdown", e => {
      const [px, py] = evXY(cv, e), ht = hit(px, py);
      if (!ht) return;
      e.preventDefault(); cv.c.setPointerCapture(e.pointerId);
      drag = { ...ht, g0: toG(px, py), b0: (ht.who === "A" ? A : B).slice() };
      if (ht.c < 0) cv.c.style.cursor = "grabbing";
    });
    cv.c.addEventListener("pointermove", e => {
      const [px, py] = evXY(cv, e);
      if (!drag) { cv.c.style.cursor = curs(hit(px, py)); return; }
      const [gx, gy] = toG(px, py), b0 = drag.b0, b = b0.slice();
      if (drag.c < 0) {
        const dx = clamp(Math.round(gx - drag.g0[0]), -b0[0], 10 - b0[2]), dy = clamp(Math.round(gy - drag.g0[1]), -b0[1], 10 - b0[3]);
        b[0] += dx; b[2] += dx; b[1] += dy; b[3] += dy;
      } else {
        const X = clamp(Math.round(gx), 0, 10), Y = clamp(Math.round(gy), 0, 10);
        if (drag.c === 0 || drag.c === 2) b[0] = Math.min(X, b0[2] - 1); else b[2] = Math.max(X, b0[0] + 1);
        if (drag.c === 0 || drag.c === 1) b[1] = Math.min(Y, b0[3] - 1); else b[3] = Math.max(Y, b0[1] + 1);
      }
      if (drag.who === "A") A = b; else B = b;
      sync();
    });
    const end = () => { if (drag && drag.c < 0) cv.c.style.cursor = "grab"; drag = null; };
    cv.c.addEventListener("pointerup", end); cv.c.addEventListener("pointercancel", end);
    function sync() {
      gT.paint(); cv.draw();
      const a = area(A), b = area(B), it = inter(), U = a + b - it.I, iou = it.I / U, dice = 2 * it.I / (a + b), ok = iou >= thr - 1e-12;
      const bx = (bb, nm, v) => `<span style="color:var(${v})">■</span> ${nm}: (${bb[0]}; ${bb[1]})–(${bb[2]}; ${bb[3]}), ${bb[2] - bb[0]} × ${bb[3] - bb[1]} = ${area(bb)}`;
      out.innerHTML = bx(A, "valódi A", "--setA") + " · " + bx(B, "jósolt B", "--setB") + "<br>" +
        `metszet: ${it.I ? `${it.w} × ${it.h} = ${it.I}` : "0 (nincs átfedés)"} · unió: ${a} + ${b} − ${it.I} = ${U} · ` +
        `IoU = ${it.I}/${U} = <b>${fmt(iou, 3)}</b> · Dice = 2·${it.I}/(${a} + ${b}) = <b>${fmt(dice, 3)}</b> · ` +
        `küszöb ${fmt(thr, 2)} → ${ok ? `<span style="color:var(--ok)">✅ találat</span>` : `<span style="color:var(--bad)">❌ nem találat</span>`}`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     11.7  vit-patches – a kép foltokra vágva, tokensorozatként
     ------------------------------------------------------------------ */
  W["vit-patches"] = root => {
    header(root, "Vision Transformer: a kép foltok sorozata",
      "A ViT nem csúsztat szűrőt: a képet $P \\times P$-s <b>foltokra</b> vágja, minden foltot kilapít egy számvektorrá, és ezeket – soronként, balról jobbra – " +
      "egy szöveg szavaihoz hasonló <b>tokensorozatként</b> kapja meg. Elé kerül még egy külön [CLS] token, a végső döntés ebből születik. " +
      "Válts foltméretet, és figyeld, hogyan nő a tokenek és a figyelmi párok száma (minden token minden tokenre figyel: $N^2$ pár). Vidd az egeret egy foltra!");
    const T = testSet();
    if (!T) { root.append(h("p", { class: "muted" }, "A tesztképek nem töltődtek be (cnn-nets.js).")); return; }
    let idx = 7, P = 4, PV = 16, hov = -1;
    const gP = toggleGroup([["2", "P = 2"], ["4", "P = 4"], ["8", "P = 8"]], () => String(P), v => { P = +v; hov = -1; cvR.resize(); sync(); });
    const gV = toggleGroup([32, 16, 14, 8].map(p => [String(p), `P = ${p}`]), () => String(PV), v => { PV = +v; sync(); });
    root.append(h("div", { class: "controls" }, small("foltméret:"), gP.bs, btn("🎲 Másik kép", () => { idx = (idx + 1 + Math.floor(Math.random() * (T.X.length - 1))) % T.X.length; sync(); })));
    const wrap = h("div", { class: "two-canvas" }), L = w2_pad(), R = w2_pad();
    wrap.append(L, R); root.append(wrap);
    const cap = t => h("div", { class: "muted", style: "font-size:.85rem;margin-bottom:.25rem" }, t);
    L.append(cap("a kép (16 × 16) a foltrácsal"));
    const capR = cap(""); R.append(capR);
    const cvL = Calc.canvas(L, 1, 380);
    const lay = w => { const N = (16 / P) ** 2 + 1, cols = Math.ceil(Math.sqrt(N)), rows = Math.ceil(N / cols), gap = 6, t = Math.min(64, (w - gap * (cols + 1)) / cols); return { N, cols, rows, gap, t, cellH: t + 16, H: rows * (t + 16 + gap) + gap }; };
    const cvR = w2_cv(R, w => lay(w).H, 380);
    root.append(h("div", { class: "controls" }, small("Egy valódi ViT (224 × 224 × 3-as kép), foltméret:"), gV.bs));
    const out = h("div", { class: "readout" });
    root.append(out);
    let x = null;
    const ink = (ctx, v, x0, y0, sz) => drawMap(ctx, v, 16, 16, x0, y0, sz / 16, { max: 1 });
    cvL.draw = () => {
      const { ctx, w } = cvL, n = 16 / P, cell = w / 16;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      ink(ctx, x, 0, 0, w);
      ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.18); ctx.lineWidth = 1;
      for (let i = 1; i < 16; i++) { ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, w); ctx.moveTo(0, i * cell); ctx.lineTo(w, i * cell); ctx.stroke(); }
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2;
      for (let i = 0; i <= n; i++) { const q = Math.min(w - 1, Math.max(1, i * P * cell)); ctx.beginPath(); ctx.moveTo(q, 0); ctx.lineTo(q, w); ctx.moveTo(0, q); ctx.lineTo(w, q); ctx.stroke(); }
      ctx.restore();
      const fs = P === 2 ? 10 : 12;
      for (let k = 0; k < n * n; k++) {
        const px = (k % n) * P * cell, py = Math.floor(k / n) * P * cell;
        if (k === hov) { ctx.save(); ctx.fillStyle = rgba(css("--setB"), 0.28); ctx.fillRect(px, py, P * cell, P * cell); ctx.strokeStyle = css("--setB"); ctx.lineWidth = 3; ctx.strokeRect(px + 1.5, py + 1.5, P * cell - 3, P * cell - 3); ctx.restore(); }
        label(ctx, String(k + 1), px + 3, py + 2, css("--accent"), "left", `700 ${fs}px system-ui, sans-serif`, "top");
      }
    };
    cvR.draw = () => {
      const { ctx, w } = cvR, Ly = lay(w), n = 16 / P;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, cvR.h);
      const x0 = (w - (Ly.cols * Ly.t + (Ly.cols - 1) * Ly.gap)) / 2;
      for (let k = 0; k < Ly.N; k++) {
        const cx = x0 + (k % Ly.cols) * (Ly.t + Ly.gap), cy = Ly.gap + Math.floor(k / Ly.cols) * (Ly.cellH + Ly.gap);
        if (k === 0) {
          ctx.save(); ctx.fillStyle = css("--accent-soft"); ctx.fillRect(cx, cy, Ly.t, Ly.t); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.5; ctx.strokeRect(cx + 0.5, cy + 0.5, Ly.t - 1, Ly.t - 1); ctx.restore();
          w2_fit(ctx, "[CLS]", cx + Ly.t / 2, cy + Ly.t / 2 + 6, Ly.t - 4, css("--accent"), "center", 13, 700);
          label(ctx, "0", cx + Ly.t / 2, cy + Ly.t + 14, css("--muted"), "center", "600 10px system-ui, sans-serif");
          continue;
        }
        const pi = k - 1, pr = Math.floor(pi / n) * P, pc = (pi % n) * P, sub = new Float32Array(P * P);
        for (let r = 0; r < P; r++) for (let c = 0; c < P; c++) sub[r * P + c] = x[(pr + r) * 16 + pc + c];
        drawMap(ctx, sub, P, P, cx, cy, Ly.t / P, { max: 1 });
        if (pi === hov) { ctx.save(); ctx.strokeStyle = css("--setB"); ctx.lineWidth = 3; ctx.strokeRect(cx - 1.5, cy - 1.5, Ly.t + 3, Ly.t + 3); ctx.restore(); }
        label(ctx, String(k), cx + Ly.t / 2, cy + Ly.t + 14, pi === hov ? css("--setB") : css("--muted"), "center", "600 10px system-ui, sans-serif");
      }
    };
    const setHov = v => { if (v !== hov) { hov = v; cvL.draw(); cvR.draw(); } };
    cvL.c.addEventListener("pointermove", e => { const [px, py] = evXY(cvL, e), n = 16 / P, s = cvL.w / n; const c = Math.floor(px / s), r = Math.floor(py / s); setHov(c >= 0 && c < n && r >= 0 && r < n ? r * n + c : -1); });
    cvR.c.addEventListener("pointermove", e => {
      const [px, py] = evXY(cvR, e), Ly = lay(cvR.w), x0 = (cvR.w - (Ly.cols * Ly.t + (Ly.cols - 1) * Ly.gap)) / 2;
      const c = Math.floor((px - x0) / (Ly.t + Ly.gap)), r = Math.floor((py - Ly.gap) / (Ly.cellH + Ly.gap)), k = r * Ly.cols + c;
      setHov(c >= 0 && c < Ly.cols && k >= 1 && k < Ly.N ? k - 1 : -1);
    });
    [cvL, cvR].forEach(cv => cv.c.addEventListener("pointerleave", () => setHov(-1)));
    function sync() {
      gP.paint(); gV.paint();
      x = place(T.X[idx], 0, 0);
      const n = 16 / P, N = n * n, Nt = N + 1;
      capR.textContent = `tokensorozat: [CLS] + ${N} folt, soronként balról jobbra`;
      cvL.draw(); cvR.draw();
      const m = 224 / PV, M = m * m, d = PV * PV * 3, Mt = M + 1;
      out.innerHTML = `foltméret P = ${P} → 16/${P} = ${n} → ${n} × ${n} = <b>${N}</b> folt · foltonként ${P} · ${P} · 1 = <b>${P * P}</b> szám · ` +
        `tokenek a [CLS]-sel: <b>${Nt}</b> · figyelmi párok: ${Nt}² = <b>${w2_int(Nt * Nt)}</b>` +
        `<br>Egy valódi ViT (224 × 224 × 3): P = ${PV} → 224/${PV} = ${m} → ${m} × ${m} = <b>${M}</b> folt · foltonként ${PV}·${PV}·3 = <b>${w2_int(d)}</b> szám · ` +
        `tokenek: <b>${Mt}</b> · figyelmi párok: ${Mt}² = <b>${w2_int(Mt * Mt)}</b> · foltbeágyazás (${w2_int(d)} → 768): ${w2_int(d)}·768 + 768 = <b>${w2_int(d * 768 + 768)}</b> paraméter` +
        `<br><span class="muted">kép: ${idx + 1}. teszt, címke ${T.y[idx]}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     11.9  digit-cnn – MLP és CNN-ek az eltolt számjegyeken
     ------------------------------------------------------------------ */
  W["digit-cnn"] = root => {
    header(root, "Számjegyfelismerés eltolva: MLP vagy konvolúciós háló?",
      "A 8 × 8-as tesztszámjegy egy 16 × 16-os lapra kerül; a nyilakkal eltolhatod. Négy előre tanított háló közül választhatsz – mindet csak <b>középre tett</b> számjegyeken tanítottuk " +
      "(kivéve a bővítéses változatot, amely ±2 pixellel eltolt képeket is látott). Fent a bemenet; alatta a konvolúciós hálónál az első réteg 8 szűrője " +
      "(<b style='color:var(--setB)'>narancs</b> = pozitív, <b style='color:var(--setA)'>kék</b> = negatív súly) a kimenetükkel, a második réteg 32 térképe (○ = a maximum helye), " +
      "a 32 globális maximum, végül a 10 valószínűség. Jobbra lent: a háló pontossága a 450 tesztképen minden eltolásnál (piros = rossz, zöld = jó; kattints egy mezőre). " +
      "<b>Próbáld ki:</b> told el a képet 1 pixellel jobbra, és hasonlítsd össze a CNN-A-t és a CNN-B-t. Rajzolj saját számjegyet is, és told a lap széle felé!");
    const D = window.CNN11, T = testSet();
    if (!D || !T) { root.append(h("p", { class: "muted" }, "A hálók nem töltődtek be (cnn-nets.js).")); return; }
    const NAMES = { mlp: "MLP (256–16–10)", cnnA: "CNN-A (pooling nélkül)", cnnB: "CNN-B (2×2 pooling)", cnnBaug: "CNN-B + eltolásos bővítés" };
    const SHORT = { mlp: "MLP", cnnA: "CNN-A", cnnB: "CNN-B", cnnBaug: "CNN-B + bővítés" };
    const cnt = a => (Array.isArray(a) ? a.reduce((s, v) => s + cnt(v), 0) : 1);
    const nPar = k => { const N = D.nets[k]; return N.kind === "mlp" ? cnt([N.W1, N.b1, N.W2, N.b2]) : cnt([N.k1, N.b1, N.k2, N.b2, N.W, N.b]); };
    let key = "cnnA", idx = 7, dx = 0, dy = 0, mode = "sample", V = T.X[idx].slice(), B = new Uint8Array(1024), drawing = false, last = null, F = null, x = null;
    const wrongs = {};
    let searching = false;
    const net = () => D.nets[key];
    const gN = toggleGroup(Object.entries(NAMES), () => key, k => { const pk = net().kind, pp = net().pool; key = k; if (net().kind !== pk || net().pool !== pp) relayout(); sync(); });
    const info = h("span", { class: "muted", style: "font-size:.9rem" });
    const bL = btn("←", () => shift(-1, 0)), bR = btn("→", () => shift(1, 0)), bU = btn("↑", () => shift(0, -1)), bD = btn("↓", () => shift(0, 1));
    [bL, bR, bU, bD].forEach(b => b.style.minWidth = "2.4rem");
    const oS = h("b");
    root.append(h("div", { class: "controls" }, small("háló:"), gN.bs),
      h("div", { class: "controls" },
        btn("Következő", () => load((idx + 1) % T.X.length)), btn("🎲 Véletlen", () => load(Math.floor(Math.random() * T.X.length))),
        btn("🔍 Egy tévesztés", findWrong), btn("🧽 Törlés (rajzolás)", () => { B.fill(0); V = new Array(64).fill(0); mode = "draw"; sync(); }), info),
      h("div", { class: "controls" }, small("eltolás:"), bL, bR, bU, bD, btn("Középre", () => { dx = dy = 0; sync(); }), oS));
    /* 1. sor: rajzlap | a 16 × 16-os lap */
    const top = h("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:.8rem;max-width:620px;margin:0 auto" });
    const cL = w2_pad(), cR = w2_pad(), cap = t => h("div", { class: "muted", style: "font-size:.85rem;margin-bottom:.25rem" }, t);
    const capL = cap(""), capR = cap("");
    cL.append(capL); cR.append(capR); top.append(cL, cR); root.append(top);
    const cvD = Calc.canvas(cL, 1, 300), cvB = Calc.canvas(cR, 1, 300);
    /* 2. a rétegek (CNN) vagy a rejtett réteg (MLP) */
    const mid = w2_pad("margin-top:.8rem");
    root.append(mid);
    function layout(w) {
      const pool = !!net().pool, cols = w >= 520 ? 8 : 4, rows = 8 / cols, gap = 10, th = 22;
      const tile = Math.min(76, (w - gap * (cols - 1)) / cols), ks = Math.round(Math.min(tile * 0.42, 30));
      const x0 = (w - (cols * tile + (cols - 1) * gap)) / 2, blockH = ks + 5 + tile + (pool ? 6 + tile / 2 : 0) + gap;
      const y1 = th, y2 = y1 + rows * blockH + th + 4, g2 = 6, t2 = Math.min(62, (w - 7 * g2) / 8), x2 = (w - (8 * t2 + 7 * g2)) / 2;
      const y3 = y2 + 4 * (t2 + g2) + th + 2, barH = 54;
      return { pool, cols, gap, tile, ks, x0, blockH, y1, y2, g2, t2, x2, y3, barH, H: y3 + barH + 6 };
    }
    const cvF = w2_cv(mid, w => layout(w).H), cvM = w2_cv(mid, () => 150);
    /* 3. softmax | pontosságtérkép */
    const [cvO, cvG] = twoCanvas(root, 0.66, 1.08);
    cvO.c.parentNode.style.marginTop = cvG.c.parentNode.style.marginTop = ".6rem";
    const out = h("div", { class: "readout" });
    root.append(out);

    function relayout() {
      const mlp = net().kind === "mlp";
      cvF.c.style.display = mlp ? "none" : ""; cvM.c.style.display = mlp ? "" : "none";
      (mlp ? cvM : cvF).resize();
    }
    function shift(ddx, ddy) { dx = clamp(dx + ddx, -4, 4); dy = clamp(dy + ddy, -4, 4); sync(); }
    function load(i) { idx = i; V = T.X[i].slice(); mode = "sample"; B.fill(0); sync(); }
    function findWrong() {
      if (searching) return;
      const k = `${key}|${dx}|${dy}`, go = list => {
        searching = false;
        if (!list.length) { info.textContent = `${SHORT[key]}: ennél az eltolásnál nincs tévesztés.`; return; }
        const nx = list.find(i => mode !== "sample" || i > idx);
        load(nx != null ? nx : list[0]);
      };
      if (wrongs[k]) return go(wrongs[k]);
      searching = true; info.textContent = "keresés…";
      const N = net(), list = [], ddx = dx, ddy = dy;
      let i = 0;
      (function chunk() {
        for (const e = Math.min(T.X.length, i + 40); i < e; i++) if (argmax(forwardNet(N, place(T.X[i], ddx, ddy)).p) !== T.y[i]) list.push(i);
        if (i < T.X.length) { info.textContent = `keresés… ${i} / ${T.X.length}`; setTimeout(chunk, 0); }
        else { wrongs[k] = list; go(list); }
      })();
    }
    /* rajzolás (mint a 9. fejezetben): 32 × 32-es rács → befoglaló téglalap → középre → 8 × 8, mezőnként 0–16 */
    function downsample() {
      let x0 = 32, x1 = -1, y0 = 32, y1 = -1;
      for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) if (B[r * 32 + c]) { x0 = Math.min(x0, c); x1 = Math.max(x1, c); y0 = Math.min(y0, r); y1 = Math.max(y1, r); }
      const o = new Array(64).fill(0);
      if (x1 < 0) return o;
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, s = Math.min(30 / bh, 26 / bw, 4), cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2;
      for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) {
        const sx = Math.floor(cx + (c + 0.5 - 16) / s), sy = Math.floor(cy + (r + 0.5 - 16) / s);
        if (sx >= 0 && sx < 32 && sy >= 0 && sy < 32 && B[sy * 32 + sx]) o[(r >> 2) * 8 + (c >> 2)]++;
      }
      return o;
    }
    const cellD = () => cvD.w / 32;
    function paint(px, py) {
      const cx = px / cellD(), cy = py / cellD(), R = 1.55;
      for (let r = Math.floor(cy - R); r <= Math.ceil(cy + R); r++) for (let c = Math.floor(cx - R); c <= Math.ceil(cx + R); c++)
        if (r >= 0 && r < 32 && c >= 0 && c < 32 && Math.hypot(c + 0.5 - cx, r + 0.5 - cy) <= R) B[r * 32 + c] = 1;
    }
    let pend = 0;
    const schedule = () => { if (!pend) pend = requestAnimationFrame(() => { pend = 0; sync(); }); };
    cvD.c.addEventListener("pointerdown", e => {
      if (mode === "sample") { B.fill(0); mode = "draw"; }
      drawing = true; cvD.c.setPointerCapture(e.pointerId); last = evXY(cvD, e); paint(...last); V = downsample(); schedule();
    });
    cvD.c.addEventListener("pointermove", e => {
      if (!drawing) return;
      const p = evXY(cvD, e), d = Math.hypot(p[0] - last[0], p[1] - last[1]), k = Math.max(1, Math.ceil(d / (cellD() * 0.5)));
      for (let i = 1; i <= k; i++) paint(last[0] + (p[0] - last[0]) * i / k, last[1] + (p[1] - last[1]) * i / k);
      last = p; V = downsample(); schedule();
    });
    const end = () => { drawing = false; };
    cvD.c.addEventListener("pointerup", end); cvD.c.addEventListener("pointercancel", end);
    const shade = t => { const a = hexRGB(css("--text")), b = hexRGB(css("--card")); return `rgb(${b.map((v, i) => Math.round(v + (a[i] - v) * t)).join(",")})`; };
    cvD.draw = () => {
      const { ctx, w } = cvD;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      if (mode === "sample") {
        const c = w / 8;
        for (let k = 0; k < 64; k++) { ctx.fillStyle = shade(V[k] / 16); ctx.fillRect((k % 8) * c, Math.floor(k / 8) * c, c + 0.5, c + 0.5); }
        ctx.fillStyle = rgba(css("--card"), 0.85); ctx.fillRect(0, w - 22, w, 22);
        label(ctx, "koppints ide, és rajzolj!", w / 2, w - 6, css("--muted"), "center", "600 11px system-ui, sans-serif");
      } else {
        const c = w / 32; ctx.fillStyle = shade(1);
        for (let k = 0; k < 1024; k++) if (B[k]) ctx.fillRect((k % 32) * c, Math.floor(k / 32) * c, c + 0.5, c + 0.5);
        ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.25);
        for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * w / 8, 0); ctx.lineTo(i * w / 8, w); ctx.moveTo(0, i * w / 8); ctx.lineTo(w, i * w / 8); ctx.stroke(); }
        ctx.restore();
        if (!B.some(Boolean)) label(ctx, "Rajzolj ide egy számjegyet!", w / 2, w / 2, css("--muted"), "center", "600 13px system-ui, sans-serif", "middle");
      }
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(0.5, 0.5, w - 1, w - 1); ctx.restore();
    };
    cvB.draw = () => {
      const { ctx, w } = cvB, c = w / 16;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      drawMap(ctx, x, 16, 16, 0, 0, c, { max: 1, frame: false });
      ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.18); ctx.lineWidth = 1;
      for (let i = 1; i < 16; i++) { ctx.beginPath(); ctx.moveTo(i * c, 0); ctx.lineTo(i * c, w); ctx.moveTo(0, i * c); ctx.lineTo(w, i * c); ctx.stroke(); }
      ctx.strokeStyle = rgba(css("--muted"), 0.6); ctx.setLineDash([4, 4]); ctx.strokeRect(4 * c, 4 * c, 8 * c, 8 * c);
      ctx.setLineDash([]); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.strokeRect((4 + dx) * c, (4 + dy) * c, 8 * c, 8 * c);
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, w - 1, w - 1);
      ctx.restore();
    };
    cvF.draw = () => {
      if (!F || !F.a1) return;
      const { ctx, w } = cvF, Ly = layout(w), N = net(), mu = css("--muted");
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, cvF.h);
      const nar = w < 520;
      w2_fit(ctx, Ly.pool ? (nar ? "1. konv.: 8 szűrő → 16 × 16 → max-pool 8 × 8" : "1. konvolúció: 8 szűrő (3 × 3) → 8 térkép (16 × 16, ReLU) → 2 × 2-es max-pooling (8 × 8)")
        : (nar ? "1. konv.: 8 szűrő (3 × 3) → 8 térkép (16 × 16)" : "1. konvolúció: 8 szűrő (3 × 3) → 8 térkép (16 × 16, ReLU)"), 0, Ly.y1 - 6, w, mu);
      const kmx = Math.max(...N.k1.flat().map(Math.abs)), m1 = Math.max(1e-9, ...F.a1.map(m => Math.max(...m)));
      for (let j = 0; j < 8; j++) {
        const bx = Ly.x0 + (j % Ly.cols) * (Ly.tile + Ly.gap), by = Ly.y1 + Math.floor(j / Ly.cols) * Ly.blockH;
        drawMap(ctx, N.k1[j], 3, 3, bx + (Ly.tile - Ly.ks) / 2, by, Ly.ks / 3, { signed: true, max: kmx });
        drawMap(ctx, F.a1[j], 16, 16, bx, by + Ly.ks + 5, Ly.tile / 16, { signed: true, max: m1 });
        if (Ly.pool) drawMap(ctx, F.p1[j], 8, 8, bx + Ly.tile / 4, by + Ly.ks + 5 + Ly.tile + 6, Ly.tile / 16, { signed: true, max: m1 });
      }
      const S = F.S, m2 = Math.max(1e-9, ...F.g.map(g => g.v)), cell = Ly.t2 / S;
      w2_fit(ctx, nar ? `2. konv.: 32 térkép (${S} × ${S}) · ○ = maximum` : `2. konvolúció: 32 térkép (${S} × ${S}, ReLU) · ○ = a térkép legnagyobb értékének helye`, 0, Ly.y2 - 6, w, mu);
      for (let j = 0; j < 32; j++) {
        const tx = Ly.x2 + (j % 8) * (Ly.t2 + Ly.g2), ty = Ly.y2 + Math.floor(j / 8) * (Ly.t2 + Ly.g2);
        /* térképenkénti skála (de legalább a legerősebb térkép negyede), hogy a gyenge térképek mintázata is látsszon */
        drawMap(ctx, F.a2[j], S, S, tx, ty, cell, { signed: true, max: Math.max(F.g[j].v, 0.25 * m2) });
        if (F.g[j].v > 0.05 * m2) { const r = Math.floor(F.g[j].at / S), c = F.g[j].at % S; ring(ctx, tx + (c + 0.5) * cell, ty + (r + 0.5) * cell, Math.max(3.5, cell * 0.8), css("--accent"), 1.5); }
      }
      w2_fit(ctx, nar ? "globális max: 32 szám → FC → 10 kimenet" : "globális max: térképenként 1 szám (32) → FC-réteg → 10 kimenet", 0, Ly.y3 - 6, w, mu);
      const bw = (8 * Ly.t2 + 7 * Ly.g2) / 32;
      ctx.fillStyle = css("--bg-soft"); ctx.fillRect(Ly.x2, Ly.y3, 32 * bw, Ly.barH);
      F.g.forEach((g, j) => { const hh = Ly.barH * g.v / m2; ctx.fillStyle = css("--setB"); ctx.fillRect(Ly.x2 + j * bw + 1, Ly.y3 + Ly.barH - hh, Math.max(1, bw - 2), hh); });
    };
    cvM.draw = () => {
      if (!F || !F.h) return;
      const { ctx, w, h: hh } = cvM, mu = css("--muted"), mx = Math.max(1e-9, ...F.h), top = 26, bot = 18, bw = w / 16;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      w2_fit(ctx, w < 520 ? "rejtett réteg: 16 ReLU-neuron (mind a 256 pixelt látja)" : "rejtett réteg: 16 ReLU-neuron – mindegyik mind a 256 pixelt látja, pixelenként külön súllyal", 0, top - 8, w, mu);
      ctx.fillStyle = css("--bg-soft"); ctx.fillRect(0, top, w, hh - top - bot);
      F.h.forEach((v, j) => {
        const H = (hh - top - bot) * v / mx;
        ctx.fillStyle = css("--accent"); ctx.fillRect(j * bw + 3, hh - bot - H, bw - 6, H);
        label(ctx, String(j + 1), j * bw + bw / 2, hh - 3, mu, "center", "600 10px system-ui, sans-serif");
      });
    };
    cvO.draw = () => {
      if (!F) return;
      const { ctx, w, h: hh } = cvO, bw = (w - 12) / 10, k0 = argmax(F.p), yt = mode === "sample" ? T.y[idx] : -1, top = 22, bot = 34;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      w2_fit(ctx, "kimenet: a 10 számjegy valószínűsége (softmax)", 0, 15, w, css("--muted"));
      F.p.forEach((p, k) => {
        const x0 = 6 + k * bw, H = (hh - top - bot - 14) * p;
        ctx.fillStyle = k === k0 ? css("--setB") : rgba(css("--accent"), 0.55); ctx.fillRect(x0 + 3, hh - bot - H, bw - 6, Math.max(1, H));
        label(ctx, String(k), x0 + bw / 2, hh - 17, k === k0 ? css("--text") : css("--muted"), "center", "700 13px system-ui, sans-serif");
        if (p >= 0.01) label(ctx, pct(p, 0), x0 + bw / 2, hh - bot - H - 2, css("--muted"), "center", "600 10px system-ui, sans-serif");
        if (k === yt) label(ctx, "▲ valódi", x0 + bw / 2, hh - 2, css("--ok"), "center", "700 10px system-ui, sans-serif");
      });
    };
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    function heat(acc) {
      const t = clamp((acc - 0.1) / 0.9, 0, 1), bad = hexRGB(css("--bad")), mid = hexRGB(css("--setB")), ok = hexRGB(css("--ok"));
      return t < 0.5 ? mix(bad, mid, t / 0.5) : mix(mid, ok, (t - 0.5) / 0.5);
    }
    let GG = null;
    cvG.draw = () => {
      const { ctx, w, h: hh } = cvG, G = net().grid, ox = 24, oy = 50, s = Math.min(w - ox - 4, hh - oy - 4) / 9;
      GG = { ox, oy, s };
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      w2_fit(ctx, `pontosság eltolásonként, % (${SHORT[key]}, 450 tesztkép)`, 0, 15, w, css("--muted"));
      w2_fit(ctx, "vízszintesen dx (→), függőlegesen dy (↓) · kattints egy mezőre", 0, 31, w, css("--muted"), "left", 11, 500);
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        const acc = G[r][c] / 450, col = heat(acc), X = ox + c * s, Y = oy + r * s;
        ctx.fillStyle = `rgb(${col.join(",")})`; ctx.fillRect(X + 0.5, Y + 0.5, s - 1, s - 1);
        if (s >= 24) { const lum = 0.299 * col[0] + 0.587 * col[1] + 0.114 * col[2]; label(ctx, String(Math.round(100 * acc)), X + s / 2, Y + s / 2, lum > 150 ? "#111" : "#fff", "center", `600 ${s >= 34 ? 11 : 9}px system-ui, sans-serif`, "middle"); }
      }
      for (let i = 0; i < 9; i++) {
        label(ctx, w2_sgn(i - 4), ox + (i + 0.5) * s, oy - 3, css("--muted"), "center", "600 10px system-ui, sans-serif");
        label(ctx, w2_sgn(i - 4), ox - 5, oy + (i + 0.5) * s, css("--muted"), "right", "600 10px system-ui, sans-serif", "middle");
      }
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 3; ctx.strokeRect(ox + (dx + 4) * s + 1.5, oy + (dy + 4) * s + 1.5, s - 3, s - 3); ctx.restore();
    };
    cvG.c.addEventListener("click", e => {
      if (!GG) return;
      const [px, py] = evXY(cvG, e), c = Math.floor((px - GG.ox) / GG.s), r = Math.floor((py - GG.oy) / GG.s);
      if (c >= 0 && c < 9 && r >= 0 && r < 9) { dx = c - 4; dy = r - 4; sync(); }
    });
    function sync() {
      gN.paint();
      x = place(V, dx, dy); F = forwardNet(net(), x);
      [[bL, dx <= -4], [bR, dx >= 4], [bU, dy <= -4], [bD, dy >= 4]].forEach(([b, v]) => setDis(b, v));
      oS.textContent = `(${w2_sgn(dx)}; ${w2_sgn(dy)})`;
      capL.textContent = mode === "sample" ? `${idx + 1}. tesztkép (8 × 8)` : "saját rajz (32 × 32 → 8 × 8)";
      capR.textContent = `bemenet: 16 × 16-os lap`;
      if (!searching) info.textContent = mode === "sample" ? `valódi címke: ${T.y[idx]}` : "saját rajz";
      cvD.draw(); cvB.draw(); (net().kind === "mlp" ? cvM : cvF).draw(); cvO.draw(); cvG.draw();
      const k0 = argmax(F.p), yt = mode === "sample" ? T.y[idx] : null, ok = net().grid[dy + 4][dx + 4], empty = V.every(v => v === 0);
      const pred = `<b style="color:${yt == null || yt === k0 ? "var(--accent)" : "var(--bad)"}">${k0}</b> (${pct(F.p[k0], 1)})`;
      out.innerHTML = (empty ? `<span class="muted">Üres lap: a háló ilyenkor is mond valamit – a torzítások döntenek.</span><br>` : "") +
        `háló: ${SHORT[key]} · eltolás (${w2_sgn(dx)}; ${w2_sgn(dy)}) · jóslat: ${pred} · valódi: ${yt == null ? "– (saját rajz)" : `<b>${yt}</b>`} · ` +
        `pontosság ennél az eltolásnál (450 tesztkép): <b>${ok}</b> (${pct(ok / 450, 1)})` +
        `<br>paraméterek: <b>${w2_int(nPar(key))}</b> ` + (key === "mlp" ? `(a CNN-eké: ${w2_int(nPar("cnnA"))})` : `(az MLP-é: ${w2_int(nPar("mlp"))})`);
    }
    relayout();
    sync();
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
