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
