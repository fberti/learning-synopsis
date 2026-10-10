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
     w1: közös apróságok (eltolás, konvolúció, pooling, receptív mező)
     ------------------------------------------------------------------ */
  const w1Font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  /* cella kitöltése: háttér (--card) → szín, t ∈ [0, 1] erősséggel */
  function w1Mix(colVar, t) {
    const bg = hexRGB(css("--card")), c = hexRGB(css(colVar));
    t = clamp(t, 0, 1);
    return `rgb(${bg.map((b, i) => Math.round(b + (c[i] - b) * t)).join(",")})`;
  }
  /* olvasható szövegszín egy kitöltött cellán */
  const w1Ink = t => (t > 0.55 ? css("--card") : css("--text"));
  /* cellakoordináta egy rácson (vagy null) */
  function w1Hit(cv, e, x0, y0, cell, rows, cols) {
    const [x, y] = evXY(cv, e), c = Math.floor((x - x0) / cell), r = Math.floor((y - y0) / cell);
    return r >= 0 && r < rows && c >= 0 && c < cols ? [r, c] : null;
  }
  /* egy rácsvonalháló */
  function w1Grid(ctx, x0, y0, cell, rows, cols, color, lw = 1) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath();
    for (let r = 0; r <= rows; r++) { ctx.moveTo(x0, y0 + r * cell); ctx.lineTo(x0 + cols * cell, y0 + r * cell); }
    for (let c = 0; c <= cols; c++) { ctx.moveTo(x0 + c * cell, y0); ctx.lineTo(x0 + c * cell, y0 + rows * cell); }
    ctx.stroke(); ctx.restore();
  }
  function w1Rect(ctx, x, y, w, hh, color, lw = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.strokeRect(x, y, w, hh); ctx.restore();
  }
  const w1Sgn = v => fmt(v, 0);

  /* ------------------------------------------------------------------
     11.1  Eltolt számjegy és az MLP (shift-lab)
     ------------------------------------------------------------------ */
  W["shift-lab"] = root => {
    header(root, "Eltolt számjegy: mit lát az MLP?",
      "A háló egy 256–16–10-es MLP, és <b>csak a lap közepére tett</b> számjegyeken tanult (szaggatott keret). " +
      "Minden bemeneti súlya egyetlen, rögzített pixelhez tartozik. Ha a számjegy elmozdul, a vonásai „idegen” súlyokra esnek – a háló mást lát. " +
      "Told el a képet a nyilakkal, és figyeld a valószínűségeket meg a pontossági térképet (kattintással is választhatsz eltolást).");
    const T = testSet(), net = window.CNN11 && window.CNN11.nets && window.CNN11.nets.mlp;
    if (!T || !net) { root.append(small("Hiányzik a cnn-nets.js.")); return; }
    const N = T.X.length;
    let idx = 302, dx = 0, dy = 0, geo = null;
    const bMove = [["←", -1, 0], ["→", 1, 0], ["↑", 0, -1], ["↓", 0, 1]].map(([t, a, b]) =>
      btn(t, () => { dx = clamp(dx + a, -4, 4); dy = clamp(dy + b, -4, 4); sync(); }));
    bMove.forEach(b => { b.style.minWidth = "2.4rem"; });
    root.append(h("div", { class: "controls" }, small("eltolás:"), bMove, btn("Középre", () => { dx = dy = 0; sync(); })),
      h("div", { class: "controls" }, small("kép:"),
        btn("🎲 Másik kép", () => { let j; do j = Math.floor(Math.random() * N); while (j === idx); idx = j; sync(); }),
        btn("Következő", () => { idx = (idx + 1) % N; sync(); })));
    const [cvB, cvP] = twoCanvas(root, 1.04, 1.26);
    const out = h("div", { class: "readout" });
    root.append(out);
    const run = () => forwardNet(net, place(T.X[idx], dx, dy));

    cvB.draw = () => {
      const { ctx, w, h: hh } = cvB;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const top = 22, bot = 22, cell = Math.floor(Math.min(w - 8, hh - top - bot) / 16);
      const x0 = Math.round((w - 16 * cell) / 2), y0 = top + Math.round((hh - top - bot - 16 * cell) / 2);
      label(ctx, "a bemenet: 16×16 = 256 pixel", w / 2, top - 6, css("--text"), "center", w1Font(12));
      drawMap(ctx, place(T.X[idx], dx, dy), 16, 16, x0, y0, cell, { max: 1 });
      w1Grid(ctx, x0, y0, cell, 16, 16, rgba(css("--muted"), 0.28));
      w1Rect(ctx, x0 + 4 * cell, y0 + 4 * cell, 8 * cell, 8 * cell, css("--muted"), 2, [6, 4]);
      if (dx || dy) w1Rect(ctx, x0 + (4 + dx) * cell, y0 + (4 + dy) * cell, 8 * cell, 8 * cell, css("--accent"), 2.2);
      const ly = y0 + 16 * cell + 15, fs = w < 330 ? 10 : 11;
      label(ctx, "▭ szaggatott: itt tanult", x0, ly, css("--muted"), "left", w1Font(fs));
      label(ctx, "▭ most itt van", x0 + 16 * cell, ly, css("--accent"), "right", w1Font(fs));
    };

    cvP.draw = () => {
      const { ctx, w, h: hh } = cvP, R = run(), p = R.p, pr = argmax(p), y = T.y[idx];
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const cT = css("--text"), cM = css("--muted"), cOk = css("--ok"), cBad = css("--bad");
      /* oszlopdiagram */
      const bTop = 20, bH = Math.round(hh * 0.27), slot = (w - 16) / 10, bw = Math.min(26, slot * 0.62);
      label(ctx, "a háló valószínűségei (softmax)", w / 2, 14, cT, "center", w1Font(12));
      const base = bTop + 14 + bH;
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.beginPath(); ctx.moveTo(8, base + 0.5); ctx.lineTo(w - 8, base + 0.5); ctx.stroke(); ctx.restore();
      for (let k = 0; k < 10; k++) {
        const cx = 8 + slot * (k + 0.5), bh = Math.max(1, p[k] * bH);
        const col = k === pr ? (pr === y ? cOk : cBad) : rgba(cM, 0.55);
        ctx.fillStyle = col; ctx.fillRect(cx - bw / 2, base - bh, bw, bh);
        if (k === y && k !== pr) w1Rect(ctx, cx - bw / 2, base - bH, bw, bH, cOk, 1.5, [4, 3]);
        if (p[k] >= 0.01) label(ctx, fmt(100 * p[k], 0) + "%", cx, base - bh - 3, k === pr ? col : cM, "center", w1Font(10));
        label(ctx, String(k), cx, base + 15, k === y ? cOk : cT, "center", w1Font(13, k === y || k === pr ? 800 : 500));
        if (k === y) label(ctx, "valódi", cx, base + 27, cOk, "center", w1Font(9));
      }
      /* pontossági térkép */
      const hy0 = base + 66, legW = 38, axL = 26;
      const cell = Math.floor(Math.min((w - axL - legW - 12) / 9, (hh - hy0 - 26) / 9));
      const gx0 = Math.round(axL + (w - axL - legW - 9 * cell) / 2), gy0 = hy0;
      label(ctx, "helyes válaszok aránya eltolásonként", w / 2, hy0 - 22, cT, "center", w1Font(12));
      label(ctx, "(450 tesztkép)", w / 2, hy0 - 8, cM, "center", w1Font(10, 500));
      const fsC = clamp(cell * 0.38, 8, 12);
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        const a = net.grid[r][c] / 450;
        ctx.fillStyle = w1Mix("--accent", a); ctx.fillRect(gx0 + c * cell, gy0 + r * cell, cell, cell);
        if (cell >= 18) label(ctx, fmt(100 * a, 0), gx0 + (c + 0.5) * cell, gy0 + (r + 0.5) * cell + 1, w1Ink(a), "center", w1Font(fsC, 500), "middle");
      }
      w1Grid(ctx, gx0, gy0, cell, 9, 9, rgba(cM, 0.25));
      w1Rect(ctx, gx0 + (dx + 4) * cell - 1, gy0 + (dy + 4) * cell - 1, cell + 2, cell + 2, css("--bad"), 2.6);
      for (let i = 0; i < 9; i++) {
        const t = w1Sgn(i - 4), f = w1Font(10, i === 4 ? 700 : 500);
        label(ctx, t, gx0 + (i + 0.5) * cell, gy0 + 9 * cell + 12, i === dx + 4 ? cT : cM, "center", f);
        label(ctx, t, gx0 - 4, gy0 + (i + 0.5) * cell + 1, i === dy + 4 ? cT : cM, "right", f, "middle");
      }
      label(ctx, "dx →", gx0 + 9 * cell, gy0 + 9 * cell + 24, cT, "right", w1Font(11));
      label(ctx, "dy ↓", gx0 - 4, gy0 - 4, cT, "right", w1Font(11));
      /* színskála */
      const lx = gx0 + 9 * cell + 10, lh = 9 * cell;
      for (let i = 0; i < lh; i++) { ctx.fillStyle = w1Mix("--accent", 1 - i / lh); ctx.fillRect(lx, gy0 + i, 10, 1); }
      w1Rect(ctx, lx - 0.5, gy0 - 0.5, 11, lh + 1, css("--border"), 1);
      label(ctx, "100%", lx + 13, gy0 + 4, cM, "left", w1Font(9, 500), "middle");
      label(ctx, "0%", lx + 13, gy0 + lh - 3, cM, "left", w1Font(9, 500), "middle");
      geo = { gx0, gy0, cell };
    };
    cvP.c.addEventListener("pointerdown", e => {
      if (!geo) return;
      const hit = w1Hit(cvP, e, geo.gx0, geo.gy0, geo.cell, 9, 9);
      if (hit) { dy = hit[0] - 4; dx = hit[1] - 4; sync(); }
    });

    function sync() {
      setDis(bMove[0], dx <= -4); setDis(bMove[1], dx >= 4); setDis(bMove[2], dy <= -4); setDis(bMove[3], dy >= 4);
      cvB.draw(); cvP.draw();
      const p = run().p, pr = argmax(p), y = T.y[idx], ok = pr === y, g = net.grid[dy + 4][dx + 4];
      const p0 = forwardNet(net, place(T.X[idx], 0, 0)).p, ok0 = argmax(p0) === y;
      const col = ok ? "var(--ok)" : "var(--bad)";
      let note;
      if (!dx && !dy) note = ok ? "Középen – ahol tanult – felismeri. Most told el 1 pixellel!" : "Ezt a képet már középen sem ismeri fel – válassz másikat.";
      else if (ok0 && !ok) note = "Középen még felismerte – ennyi eltolás elég, hogy elrontsa. A számjegy ugyanaz, csak más pixeleken van.";
      else if (ok) note = "Ezt még felismeri, de nézd a térképet: átlagosan már jóval gyengébb, mint középen.";
      else note = "Középen sem ismerte fel, eltolva sem.";
      out.innerHTML = `eltolás: (${w1Sgn(dx)}; ${w1Sgn(dy)}) · jóslat: <b style="color:${col}">${pr}</b> (${pct(p[pr])}) · valódi címke: ${y}` +
        ` · a 450 tesztképből ennél az eltolásnál helyes: <b>${g}</b> (${pct(g / 450)})` +
        `<br><span class="muted">tesztkép #${idx} · középen helyes: ${net.grid[4][4]} (${pct(net.grid[4][4] / 450)}). ${note}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     11.2  Konvolúció kézzel (convolution-lab)
     ------------------------------------------------------------------ */
  W["convolution-lab"] = root => {
    header(root, "Konvolúció lépésről lépésre",
      "A 3×3-as kernelt végigcsúsztatjuk a bemeneten; minden helyzetben a 9 szorzat összege adja a kimenet egy celláját " +
      "(keresztkorreláció, mint a PyTorch-ban – a kernelt nem tükrözzük). " +
      "<b>Vidd az egeret egy kimeneti cella fölé</b> (vagy koppints rá): látod, melyik ablakból számoltuk. " +
      "A bemenetre kattintva vagy húzva rajzolhatsz. A számjegy pixelei 0–1 közé skálázva (÷16), két tizedesre kerekítve.");
    const T = testSet();
    const PRE = {
      T: { name: "T betű (5×5)", m: [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]] },
      digit: { name: "számjegy (8×8)", m: null },
      diag: { name: "átló (6×6)", m: Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => (r === c ? 1 : 0))) },
    };
    if (T) PRE.digit.m = Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => Math.round(T.X[20][r * 8 + c] / 16 * 100) / 100));
    else delete PRE.digit;
    const KPRE = [
      ["vert", "függőleges él", ["-1", "0", "1", "-1", "0", "1", "-1", "0", "1"]],
      ["horz", "vízszintes él", ["1", "1", "1", "0", "0", "0", "-1", "-1", "-1"]],
      ["sobel", "Sobel", ["-1", "-2", "-1", "0", "0", "0", "1", "2", "1"]],
      ["blur", "elmosás", Array(9).fill("1/9")],
      ["sharp", "élesítés", ["0", "-1", "0", "-1", "5", "-1", "0", "-1", "0"]],
      ["id", "identitás", ["0", "0", "0", "0", "1", "0", "0", "0", "0"]],
    ];
    let pre = "T", X = PRE.T.m.map(r => r.slice()), kp = "vert", Ktxt = KPRE[0][2].slice(), p = 0, s = 1, relu = false;
    let sel = [0, 0], hov = null, paintV = null, gIn = null, gOut = null;
    const parseK = t => {
      const u = String(t).trim().replace(/−/g, "-").replace(/,/g, ".");
      const m = /^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/.exec(u);
      if (m) return +m[2] ? +m[1] / +m[2] : NaN;
      return u === "" || u === "-" ? NaN : Number(u);
    };
    const kOK = () => Ktxt.every(t => Number.isFinite(parseK(t)));
    const K = () => Ktxt.map(t => { const v = parseK(t); return Number.isFinite(v) ? v : 0; });
    const kShow = i => {
      const t = Ktxt[i].trim().replace(/-/g, "−"), v = parseK(Ktxt[i]);
      if (!Number.isFinite(v)) return "?";
      return /\//.test(t) ? `(${t})` : par(v, 2);
    };
    const n = () => X.length;
    const conv = () => {
      const N = n(), flat = Float32Array.from(X.flat()), r = conv1(flat, N, N, K(), 3, p, s, 0);
      if (relu) for (let j = 0; j < r.out.length; j++) r.out[j] = Math.max(0, r.out[j]);
      return r;
    };
    /* vezérlők */
    const isBlank = () => X.every(r => r.every(v => !v));
    const gIn_ = toggleGroup(Object.entries(PRE).map(([k, v]) => [k, v.name]).concat([["empty", "üres"]]), () => (isBlank() ? "empty" : pre), k => {
      if (k === "empty") X = X.map(r => r.map(() => 0));   // a méret marad
      else { pre = k; X = PRE[k].m.map(r => r.slice()); }
      sync();
    });
    const inputs = Ktxt.map((t, i) => {
      const e = h("input", { type: "text", inputmode: "decimal", value: t, "aria-label": `kernel ${Math.floor(i / 3) + 1}. sor ${i % 3 + 1}. oszlop`,
        style: "width:3.2em;text-align:center;font:inherit;font-family:var(--mono);font-size:.9rem;padding:.2rem;border:1px solid var(--border);border-radius:6px;background:var(--card);color:var(--text)" });
      e.addEventListener("input", () => { Ktxt[i] = e.value; kp = null; sync(false); });
      return e;
    });
    const kGrid = h("div", { style: "display:grid;grid-template-columns:repeat(3,auto);gap:3px" }, inputs);
    const gK = toggleGroup(KPRE.map(([k, t]) => [k, t]), () => kp, k => { kp = k; Ktxt = KPRE.find(q => q[0] === k)[2].slice(); sync(); });
    const gP = toggleGroup([["0", "p = 0"], ["1", "p = 1"]], () => String(p), v => { p = +v; sync(); });
    const gS = toggleGroup([["1", "s = 1"], ["2", "s = 2"]], () => String(s), v => { s = +v; sync(); });
    const cR = checkbox(relu, () => { relu = cR.checked; sync(); });
    root.append(h("div", { class: "controls" }, small("bemenet:"), gIn_.bs),
      h("div", { class: "controls", style: "align-items:flex-start" }, h("div", null, small("kernel:"), kGrid),
        h("div", { class: "controls", style: "margin:0;flex:1;min-width:12rem" }, gK.bs)),
      h("div", { class: "controls" }, small("kitöltés:"), gP.bs, small("lépésköz:"), gS.bs, h("label", null, cR, "ReLU a kimenetre")));
    const [cvI, cvO] = twoCanvas(root, 1.08, flatAspect(root, 1.08, 0.86));
    const out = h("div", { class: "readout" });
    root.append(out);
    /* közös cellaméret: a bemenet (n + 2) cellányi helyet kap, hogy a kitöltés is elférjen */
    const cellOf = cv => Math.floor(Math.min(cv.w - 4, cv.h - 26) / (n() + 2));
    const cur = () => hov || sel;
    const valTxt = v => fmt(v, 2);

    cvI.draw = () => {
      const { ctx, w, h: hh } = cvI, N = n(), cell = cellOf(cvI), fs = clamp(cell * 0.34, 9, 15);
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const ox = Math.round((w - (N + 2) * cell) / 2), oy = 24;
      const x0 = ox + cell, y0 = oy + cell;
      gIn = { x0, y0, cell };
      label(ctx, `bemenet (${N}×${N})${p ? " + kitöltés" : ""}`, w / 2, 16, css("--text"), "center", w1Font(12));
      const mx = Math.max(1, ...X.flat());
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const v = X[r][c], t = v / mx;
        ctx.fillStyle = w1Mix("--text", t * 0.85); ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
        label(ctx, valTxt(v), x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 1, v ? w1Ink(t * 0.85) : rgba(css("--muted"), 0.8), "center", w1Font(fs, 500), "middle");
      }
      w1Grid(ctx, x0, y0, cell, N, N, rgba(css("--muted"), 0.35));
      if (p) {
        ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.6); ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        for (let r = -1; r <= N; r++) for (let c = -1; c <= N; c++) {
          if (r >= 0 && r < N && c >= 0 && c < N) continue;
          ctx.strokeRect(x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4);
          label(ctx, "0", x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 1, rgba(css("--muted"), 0.8), "center", w1Font(fs, 500), "middle");
        }
        ctx.restore();
      }
      w1Rect(ctx, x0 - 0.5, y0 - 0.5, N * cell + 1, N * cell + 1, css("--border"), 1);
      const o = conv(), q = cur();
      if (q && q[0] < o.H && q[1] < o.W) {
        const r0 = q[0] * s - p, c0 = q[1] * s - p, k = K(), cA = css("--accent");
        ctx.fillStyle = rgba(cA, 0.13); ctx.fillRect(x0 + c0 * cell, y0 + r0 * cell, 3 * cell, 3 * cell);
        w1Rect(ctx, x0 + c0 * cell, y0 + r0 * cell, 3 * cell, 3 * cell, cA, 3);
        if (cell >= 30) {
          const f = w1Font(clamp(cell * 0.22, 8, 11), 700);
          ctx.save(); ctx.font = f;
          for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
            const t = "×" + fmt(k[a * 3 + b], 2), xx = x0 + (c0 + b) * cell + 2, yy = y0 + (r0 + a) * cell + 2;
            ctx.fillStyle = rgba(css("--card"), 0.85); ctx.fillRect(xx, yy, ctx.measureText(t).width + 3, clamp(cell * 0.22, 8, 11) + 3);
            label(ctx, t, xx + 1.5, yy + 1, cA, "left", f, "top");
          }
          ctx.restore();
        }
      }
    };
    cvO.draw = () => {
      const { ctx, w, h: hh } = cvO, o = conv();
      const cell = Math.max(8, Math.min(cellOf(cvI), Math.floor((hh - 50) / o.H), Math.floor((w - 4) / o.W))), fs = clamp(cell * 0.34, 9, 15);
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const x0 = Math.round((w - o.W * cell) / 2), y0 = 24 + Math.max(0, Math.round((hh - 50 - o.H * cell) / 2));
      gOut = { x0, y0, cell, H: o.H, W: o.W };
      label(ctx, `kimenet (${o.H}×${o.W})${relu ? ", ReLU után" : ""}`, w / 2, 16, css("--text"), "center", w1Font(12));
      const mx = Math.max(1e-9, ...Array.from(o.out, Math.abs));
      for (let r = 0; r < o.H; r++) for (let c = 0; c < o.W; c++) {
        const v = o.out[r * o.W + c], t = Math.abs(v) / mx * 0.9;
        ctx.fillStyle = w1Mix(v >= 0 ? "--setB" : "--setA", t); ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
        label(ctx, fmt(v, 2), x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 1, w1Ink(t), "center", w1Font(Math.min(fs, cell / 3.4 + 2), 600), "middle");
      }
      w1Grid(ctx, x0, y0, cell, o.H, o.W, rgba(css("--muted"), 0.35));
      w1Rect(ctx, x0 - 0.5, y0 - 0.5, o.W * cell + 1, o.H * cell + 1, css("--border"), 1);
      const q = cur();
      if (q && q[0] < o.H && q[1] < o.W) w1Rect(ctx, x0 + q[1] * cell, y0 + q[0] * cell, cell, cell, css("--accent"), 3);
      label(ctx, "■ pozitív", x0, y0 + o.H * cell + 16, css("--setB"), "left", w1Font(11));
      label(ctx, "negatív ■", x0 + o.W * cell, y0 + o.H * cell + 16, css("--setA"), "right", w1Font(11));
    };
    /* rajzolás a bemeneten */
    const cyc = v => (pre === "digit" ? (v < 0.25 ? 0.5 : v < 0.75 ? 1 : 0) : v >= 0.5 ? 0 : 1);
    cvI.c.addEventListener("pointerdown", e => {
      if (!gIn) return;
      const hit = w1Hit(cvI, e, gIn.x0, gIn.y0, gIn.cell, n(), n());
      if (!hit) return;
      paintV = cyc(X[hit[0]][hit[1]]); X[hit[0]][hit[1]] = paintV;
      cvI.c.setPointerCapture(e.pointerId); sync(false);
    });
    cvI.c.addEventListener("pointermove", e => {
      if (paintV == null || !gIn) return;
      const hit = w1Hit(cvI, e, gIn.x0, gIn.y0, gIn.cell, n(), n());
      if (hit && X[hit[0]][hit[1]] !== paintV) { X[hit[0]][hit[1]] = paintV; sync(false); }
    });
    const endPaint = () => { paintV = null; };
    cvI.c.addEventListener("pointerup", endPaint); cvI.c.addEventListener("pointercancel", endPaint);
    const outHit = e => (gOut ? w1Hit(cvO, e, gOut.x0, gOut.y0, gOut.cell, gOut.H, gOut.W) : null);
    cvO.c.addEventListener("pointermove", e => { const q = outHit(e); if (String(q) !== String(hov)) { hov = q; sync(false); } });
    cvO.c.addEventListener("pointerleave", () => { if (hov) { hov = null; sync(false); } });
    cvO.c.addEventListener("pointerdown", e => { const q = outHit(e); if (q) { sel = q; hov = null; sync(false); } });

    function sync(fromPreset = true) {
      gIn_.paint(); gK.paint(); gP.paint(); gS.paint();
      if (fromPreset) inputs.forEach((e, i) => { e.value = Ktxt[i]; });
      inputs.forEach((e, i) => { e.style.borderColor = Number.isFinite(parseK(Ktxt[i])) ? "var(--border)" : "var(--bad)"; });
      const o = conv();
      sel = [Math.min(sel[0], o.H - 1), Math.min(sel[1], o.W - 1)];
      if (hov && (hov[0] >= o.H || hov[1] >= o.W)) hov = null;
      cvI.draw(); cvO.draw();
      const N = n(), q = cur(), k = K(), terms = [];
      let sum = 0;
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
        const rr = q[0] * s - p + a, cc = q[1] * s - p + b, inside = rr >= 0 && rr < N && cc >= 0 && cc < N, v = inside ? X[rr][cc] : 0;
        terms.push(`${kShow(a * 3 + b)}·${valTxt(v)}`); sum += k[a * 3 + b] * v;
      }
      let line = `y[${q[0]};${q[1]}] = ${terms.join(" + ")} = <b>${fmt(sum, 2)}</b>`;
      if (relu) line += ` → ReLU: <b>${fmt(Math.max(0, sum), 2)}</b>`;
      const size = `kimeneti méret: ⌊(n + 2p − k)/s⌋ + 1 = ⌊(${N} + ${2 * p} − 3)/${s}⌋ + 1 = <b>${o.H}</b>` +
        `<span class="muted"> → ${o.H}×${o.W}-es kimenet</span>`;
      const warn = kOK() ? "" : `<br><span style="color:var(--bad)">Érvénytelen kernelérték (piros keret) – ott 0-val számolok. Írhatsz törtet is, pl. 1/9.</span>`;
      out.innerHTML = line + "<br>" + size + warn +
        `<br><span class="muted">${hov ? "A" : "Vidd az egeret egy kimeneti cellára (vagy koppints rá). A"} kiemelt ablak a bemeneten: ` +
        `${q[0] * s - p + 1}–${q[0] * s - p + 3}. sor, ${q[1] * s - p + 1}–${q[1] * s - p + 3}. oszlop${p ? " (a 0. és az n + 1. a kitöltés)" : ""}.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     11.3  Pooling (pooling-viz)
     ------------------------------------------------------------------ */
  W["pooling-viz"] = root => {
    header(root, "Pooling: max és átlag, eltolással",
      "<b>A)</b> A 2×2-es, 2-es lépésközű pooling a térképet nem átfedő 2×2-es ablakokra bontja, és mindegyikből egyetlen számot tart meg: " +
      "a maximumot vagy az átlagot. Kattints egy cellára: az értéke 1-gyel nő (9 után 0). " +
      "<b>B)</b> Mozgasd a fényes jellemzőt: mikor változik a pooling kimenete, és mikor nem?");
    const DEF = [[1, 3, 0, 2], [5, 0, 1, 1], [0, 2, 4, 0], [1, 1, 0, 7]];
    let M = DEF.map(r => r.slice()), mode = "max", gA = null;
    const WCOL = ["--setA", "--setB", "--setC", "--accent"], WNAME = ["bal felső", "jobb felső", "bal alsó", "jobb alsó"];
    const gM = toggleGroup([["max", "max"], ["avg", "átlag"]], () => mode, v => { mode = v; syncA(); });
    root.append(h("div", { class: "w-sub", style: "margin:.4rem 0 0;font-weight:600;color:var(--text)" }, "A) 2×2-es pooling, lépésköz 2"),
      h("div", { class: "controls" }, small("mód:"), gM.bs,
        btn("🎲 Véletlen", () => { M = M.map(r => r.map(() => Math.floor(Math.random() * 10))); syncA(); }),
        btn("Alaphelyzet", () => { M = DEF.map(r => r.slice()); syncA(); })));
    const cvA = Calc.canvas(root, flatAspect(root, 0.34, 0.62), 620);
    const outA = h("div", { class: "readout" });
    root.append(outA);
    const win = (wr, wc) => [M[2 * wr][2 * wc], M[2 * wr][2 * wc + 1], M[2 * wr + 1][2 * wc], M[2 * wr + 1][2 * wc + 1]];
    const poolA = (wr, wc) => { const v = win(wr, wc); return mode === "max" ? Math.max(...v) : (v[0] + v[1] + v[2] + v[3]) / 4; };
    cvA.draw = () => {
      const { ctx, w, h: hh } = cvA, cT = css("--text");
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const cell = Math.floor(Math.min(56, (w - 12) / 7.6, (hh - 26) / 4)), gap = 1.6 * cell;
      const x0 = Math.round((w - 6 * cell - gap) / 2), y0 = 22, ox = x0 + 4 * cell + gap, oy = y0 + cell;
      gA = { x0, y0, cell };
      const fs = clamp(cell * 0.36, 11, 18);
      label(ctx, "bemenet (4×4)", x0 + 2 * cell, 15, cT, "center", w1Font(12));
      label(ctx, `kimenet (2×2), ${mode === "max" ? "max" : "átlag"}`, ox + cell, oy - 8, cT, "center", w1Font(12));
      for (let wr = 0; wr < 2; wr++) for (let wc = 0; wc < 2; wc++) {
        const k = wr * 2 + wc, col = css(WCOL[k]), v = win(wr, wc), mx = Math.max(...v), at = v.indexOf(mx);
        ctx.fillStyle = rgba(col, 0.2); ctx.fillRect(x0 + 2 * wc * cell, y0 + 2 * wr * cell, 2 * cell, 2 * cell);
        for (let i = 0; i < 4; i++) {
          const r = 2 * wr + (i >> 1), c = 2 * wc + (i & 1), win_ = mode === "max" && i === at;
          if (win_) { ctx.fillStyle = rgba(col, 0.55); ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell); w1Rect(ctx, x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4, col, 2.5); }
          label(ctx, String(M[r][c]), x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 1, cT, "center", w1Font(fs, win_ ? 800 : 500), "middle");
        }
        ctx.fillStyle = rgba(col, 0.35); ctx.fillRect(ox + wc * cell, oy + wr * cell, cell, cell);
        label(ctx, fmt(poolA(wr, wc), 2), ox + (wc + 0.5) * cell, oy + (wr + 0.5) * cell + 1, cT, "center", w1Font(fs * (mode === "avg" ? 0.82 : 1), 700), "middle");
      }
      w1Grid(ctx, x0, y0, cell, 4, 4, rgba(css("--muted"), 0.35));
      w1Grid(ctx, x0, y0, 2 * cell, 2, 2, css("--muted"), 2);
      w1Grid(ctx, ox, oy, cell, 2, 2, css("--muted"), 2);
      arrow(ctx, x0 + 4 * cell + gap * 0.18, oy + cell, ox - gap * 0.18, oy + cell, css("--muted"), 2);
    };
    cvA.c.addEventListener("pointerdown", e => {
      if (!gA) return;
      const hit = w1Hit(cvA, e, gA.x0, gA.y0, gA.cell, 4, 4);
      if (hit) { M[hit[0]][hit[1]] = (M[hit[0]][hit[1]] + 1) % 10; syncA(); }
    });
    function syncA() {
      gM.paint(); cvA.draw();
      outA.innerHTML = [0, 1, 2, 3].map(k => {
        const v = win(k >> 1, k & 1), res = `<b>${fmt(poolA(k >> 1, k & 1), 2)}</b>`;
        const body = mode === "max" ? `max(${v.join("; ")}) = ${res}` : `(${v.join(" + ")})/4 = ${res}`;
        return `<span style="color:var(${WCOL[k]})">■</span> ${WNAME[k]}: ${body}`;
      }).join("<br>") + `<br><span class="muted">${mode === "max"
        ? "A max-pooling csak azt őrzi meg, hogy az ablakban van-e erős jel – azt nem, hogy pontosan hol."
        : "Az átlag-pooling simít: minden érték beleszámít, egy erős jel így „felhígul”."}</span>`;
    }
    syncA();

    /* B rész: eltolás és pooling */
    const BG = Array.from({ length: 64 }, (_, i) => [0, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1][(i * 7 + (i >> 3) * 3) % 11]);
    let fr = 2, fc = 2, last = null, prevPool = null;
    const mapB = () => { const m = Float32Array.from(BG); m[fr * 8 + fc] = 9; return m; };
    const mv = [["←", 0, -1], ["→", 0, 1], ["↑", -1, 0], ["↓", 1, 0]].map(([t, a, b]) => {
      const e = btn(t, () => {
        const nr = fr + a, nc = fc + b;
        if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return;
        prevPool = { pool: pool2(mapB(), 8, 8), r: fr, c: fc }; fr = nr; fc = nc; last = t; syncB();
      });
      e.style.minWidth = "2.4rem"; return e;
    });
    root.append(h("div", { class: "w-sub", style: "margin:1.1rem 0 0;font-weight:600;color:var(--text)" }, "B) Eltolás és pooling"),
      h("div", { class: "controls" }, small("a 9-es mozgatása:"), mv,
        btn("Alaphelyzet", () => { fr = fc = 2; last = prevPool = null; syncB(); })));
    const cvB = Calc.canvas(root, flatAspect(root, 0.38, 0.66), 680);
    const outB = h("div", { class: "readout" });
    root.append(outB);
    cvB.draw = () => {
      const { ctx, w, h: hh } = cvB, cT = css("--text"), cM = css("--muted"), cA = css("--accent");
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const narrow = w < 520;
      const cell = Math.floor(Math.min(32, (w - 10) / 15.6, (hh - (narrow ? 56 : 30)) / 8)), gap = 1.3 * cell;
      const tot = 8 * cell + gap + 4 * cell + gap + cell, x0 = Math.round((w - tot) / 2), y0 = narrow ? 40 : 22;
      const px = x0 + 8 * cell + gap, py = y0 + 2 * cell, gx = px + 4 * cell + gap, gy = y0 + 3.5 * cell;
      const m = mapB(), P = pool2(m, 8, 8), fs = clamp(cell * 0.42, 9, 15);
      label(ctx, "térkép (8×8)", x0 + 4 * cell, y0 - 7, cT, "center", w1Font(narrow ? 11 : 12));
      label(ctx, narrow ? "2×2 max" : "2×2 max-pool (4×4)", px + 2 * cell, py - 7, cT, "center", w1Font(narrow ? 11 : 12));
      label(ctx, narrow ? "glob." : "globális", gx + cell / 2, gy - (narrow ? 7 : 20), cT, "center", w1Font(narrow ? 11 : 12));
      if (!narrow) label(ctx, "max", gx + cell / 2, gy - 6, cT, "center", w1Font(12));
      /* a 9-es ablaka */
      ctx.fillStyle = rgba(cA, 0.14); ctx.fillRect(x0 + (fc & ~1) * cell, y0 + (fr & ~1) * cell, 2 * cell, 2 * cell);
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const v = m[r * 8 + c], hot = v === 9;
        if (hot) { ctx.fillStyle = w1Mix("--setB", 0.85); ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell); }
        label(ctx, String(v), x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 1, hot ? w1Ink(0.85) : v ? cT : rgba(cM, 0.7), "center", w1Font(fs, hot ? 800 : 500), "middle");
      }
      if (prevPool) w1Rect(ctx, x0 + prevPool.c * cell + 2, y0 + prevPool.r * cell + 2, cell - 4, cell - 4, cM, 1.5, [3, 3]);
      w1Grid(ctx, x0, y0, cell, 8, 8, rgba(cM, 0.3));
      w1Grid(ctx, x0, y0, 2 * cell, 4, 4, cM, 1.8);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const v = P[r * 4 + c], hot = v === 9;
        if (hot) { ctx.fillStyle = w1Mix("--setB", 0.85); ctx.fillRect(px + c * cell, py + r * cell, cell, cell); }
        label(ctx, String(v), px + (c + 0.5) * cell, py + (r + 0.5) * cell + 1, hot ? w1Ink(0.85) : cT, "center", w1Font(fs, hot ? 800 : 500), "middle");
      }
      if (prevPool) {
        const pr = prevPool.r >> 1, pc = prevPool.c >> 1;
        if (pr !== fr >> 1 || pc !== fc >> 1) w1Rect(ctx, px + pc * cell + 2, py + pr * cell + 2, cell - 4, cell - 4, cM, 1.5, [3, 3]);
      }
      w1Grid(ctx, px, py, cell, 4, 4, cM, 1.4);
      ctx.fillStyle = w1Mix("--setB", 0.85); ctx.fillRect(gx, gy, cell, cell);
      w1Rect(ctx, gx, gy, cell, cell, cM, 1.4);
      label(ctx, String(Math.max(...m)), gx + cell / 2, gy + cell / 2 + 1, w1Ink(0.85), "center", w1Font(fs, 800), "middle");
      arrow(ctx, x0 + 8 * cell + gap * 0.15, y0 + 4 * cell, px - gap * 0.15, y0 + 4 * cell, cM, 2);
      arrow(ctx, px + 4 * cell + gap * 0.15, y0 + 4 * cell, gx - gap * 0.15, y0 + 4 * cell, cM, 2);
    };
    function syncB() {
      setDis(mv[0], fc <= 0); setDis(mv[1], fc >= 7); setDis(mv[2], fr <= 0); setDis(mv[3], fr >= 7);
      cvB.draw();
      const P = pool2(mapB(), 8, 8);
      let msg;
      if (!prevPool) msg = "Mozgasd a 9-es jellemzőt a nyilakkal! A vastag vonalak a 2×2-es ablakok határai.";
      else {
        const same = prevPool.pool.every((v, i) => v === P[i]);
        msg = same ? "1 pixelt mozdult, de ugyanabban a 2×2-es ablakban maradt → a pooling kimenete <b>nem változott</b>."
          : "1 pixelt mozdult, és átlépett a szomszéd ablakba → a pooling kimenete is <b>eltolódott</b>.";
      }
      outB.innerHTML = `a 9-es helye: ${fr + 1}. sor, ${fc + 1}. oszlop → ablak: ${(fr >> 1) + 1}. sor, ${(fc >> 1) + 1}. oszlop<br>` + msg +
        `<br>a globális maximum mindig ugyanaz: <b>9</b>` +
        `<br><span class="muted">A 2×2-es pooling tehát csak részben tűri az eltolást (attól függ, hol van az ablakhatár); a globális pooling teljesen érzéketlen rá – cserébe a helyet teljesen elfelejti.</span>`;
    }
    syncB();
  };

  /* ------------------------------------------------------------------
     11.3  Receptív mező (receptive-field)
     ------------------------------------------------------------------ */
  W["receptive-field"] = root => {
    header(root, "Receptív mező: meddig lát egy neuron?",
      "Egydimenziós metszet: alul a bemenet, fölötte a rétegek. Minden cella a közvetlenül alatta lévő ablakból számol " +
      "(konvolúció: „same” kitöltéssel, a méret marad; 2×2-es pooling: a méret feleződik). " +
      "<b>Vidd az egeret egy cellára</b> (vagy koppints rá): kiemeljük, mely cellákon múlik – lent narancssárgával a bemeneti receptív mezeje.");
    const C3 = { t: "conv", k: 3, s: 1 }, C5 = { t: "conv", k: 5, s: 1 }, C3s = { t: "conv", k: 3, s: 2 }, PL = { t: "pool", k: 2, s: 2 };
    const PRE = [
      ["egy 3×3", [C3]], ["két 3×3", [C3, C3]], ["három 3×3", [C3, C3, C3]],
      ["a mi CNN-ünk: 3×3 → 2×2 pool → 3×3", [C3, PL, C3]],
      ["VGG eleje: 3×3, 3×3, pool, 3×3, 3×3, pool", [C3, C3, PL, C3, C3, PL]],
      ["5×5", [C5]],
    ];
    const MAXL = 7;
    let L = PRE[1][1].slice(), preI = 1, sel = null, hov = null, geo = null;
    const bPre = PRE.map(([t, ls], i) => btn(t, () => { L = ls.slice(); preI = i; sel = null; sync(); }));
    const add = ly => () => { if (L.length < MAXL && sizes(L.concat([ly])).every(v => v >= 1)) { L.push(ly); preI = -1; sel = null; sync(); } };
    const bAdd = [btn("+ 3×3 konv", add(C3)), btn("+ 5×5 konv", add(C5)), btn("+ 3×3 konv, s = 2", add(C3s)), btn("+ 2×2 pool", add(PL))];
    const bDel = btn("− utolsó réteg", () => { if (L.length > 1) { L.pop(); preI = -1; sel = null; sync(); } });
    root.append(h("div", { class: "controls" }, small("minta:"), bPre),
      h("div", { class: "controls" }, bAdd, bDel));
    const wrap = h("div", { style: "min-width:0" });
    root.append(wrap);
    /* saját magasság: a rétegek számához igazodik */
    const cv = Calc.canvas(wrap, 0.5, 760);
    const ROW = 46;
    cv.resize = () => {
      const w = Math.min(760, wrap.clientWidth || 760), hh = (L.length + 1) * ROW + 14, dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cv.w = w; cv.h = hh;
    };
    const out = h("div", { class: "readout" }), tab = h("div", { style: "overflow-x:auto" });
    root.append(out, tab);
    const NIN = () => ((cv.w || wrap.clientWidth || 760) >= 560 ? 32 : 24);
    function sizes(ls) {
      const r = [NIN()];
      ls.forEach(l => r.push(l.t === "pool" ? Math.floor(r[r.length - 1] / 2) : Math.ceil(r[r.length - 1] / l.s)));
      return r;
    }
    /* rétegenként: méret, ugrás j, első cella középpontja (bemeneti egységben), receptív mező r */
    function stats() {
      const n = sizes(L), S = [{ n: n[0], j: 1, a: 0.5, r: 1 }];
      L.forEach((l, i) => {
        const P = S[i], pad = l.t === "pool" ? 0 : (l.k - 1) / 2, off = (l.k - 1) / 2 - pad;
        S.push({ n: n[i + 1], j: P.j * l.s, a: P.a + off * P.j, r: P.r + (l.k - 1) * P.j, pad });
      });
      return S;
    }
    /* függőségek: a (ℓ, i) cellától lefelé; pads: a kitöltésbe eső pozíciók rétegenként */
    function deps(S, lv, i) {
      const D = Array.from({ length: L.length + 1 }, () => new Set()), pads = Array.from({ length: L.length + 1 }, () => new Set());
      D[lv].add(i);
      for (let l = lv; l >= 1; l--) {
        const ly = L[l - 1], pad = S[l].pad;
        D[l].forEach(c => { for (let t = 0; t < ly.k; t++) { const q = c * ly.s - pad + t; if (q >= 0 && q < S[l - 1].n) D[l - 1].add(q); else pads[l - 1].add(q); } });
      }
      return { D, pads };
    }
    const curQ = S => {
      const ok = q => q && q[0] <= L.length && q[1] < S[q[0]].n;
      if (!ok(hov)) hov = null;
      if (!ok(sel)) sel = null;
      return hov || sel || [L.length, Math.floor(S[L.length].n / 2)];
    };
    const lname = l => (l.t === "pool" ? "2×2 pool" : `${l.k}×${l.k} konv${l.s > 1 ? ", s = 2" : ""}`);
    cv.draw = () => {
      const { ctx, w, h: hh } = cv, S = stats(), N = S[0].n, cT = css("--text"), cM = css("--muted"), cA = css("--accent"), cO = css("--setB");
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const u = (w - 12) / N, x0 = 6, rh = 16, yOf = l => hh - 8 - rh - l * ROW;
      const q = curQ(S);
      const { D, pads } = deps(S, q[0], q[1]);
      const box = (l, i) => { const c = S[l].a + i * S[l].j, half = S[l].j / 2; return [x0 + (c - half) * u + 1, x0 + (c + half) * u - 1]; };
      /* összekötő vonalak */
      ctx.save(); ctx.strokeStyle = rgba(cA, 0.45); ctx.lineWidth = 1;
      for (let l = q[0]; l >= 1; l--) {
        const ly = L[l - 1], pad = S[l].pad;
        D[l].forEach(c => {
          const [a, b] = box(l, c), xm = (a + b) / 2;
          for (let t = 0; t < ly.k; t++) {
            const qq = c * ly.s - pad + t, [a2, b2] = box(l - 1, qq);
            ctx.beginPath(); ctx.moveTo(xm, yOf(l) + rh); ctx.lineTo((a2 + b2) / 2, yOf(l - 1)); ctx.stroke();
          }
        });
      }
      ctx.restore();
      const fs = w < 520 ? 10 : 11;
      for (let l = 0; l <= L.length; l++) {
        const y = yOf(l), st = S[l];
        for (let i = 0; i < st.n; i++) {
          const [a, b] = box(l, i), on = D[l].has(i), me = l === q[0] && i === q[1];
          ctx.fillStyle = me ? cA : on ? (l === 0 ? cO : rgba(cA, 0.35)) : css("--bg-soft");
          ctx.fillRect(a, y, b - a, rh);
          ctx.strokeStyle = on ? (l === 0 ? cO : cA) : css("--border"); ctx.lineWidth = 1; ctx.strokeRect(a + 0.5, y + 0.5, b - a - 1, rh - 1);
        }
        pads[l].forEach(i => { const [a, b] = box(l, i); w1Rect(ctx, a + 0.5, y + 0.5, b - a - 1, rh - 1, cM, 1, [2, 2]); });
        const name = l === 0 ? `bemenet (${st.n} cella)` : `${l}. ${lname(L[l - 1])} (${st.n})`;
        label(ctx, name, x0, y - 3, l === q[0] ? cA : cT, "left", w1Font(fs, l === q[0] ? 700 : 600));
        label(ctx, `r = ${st.r}, j = ${st.j}`, w - 6, y - 3, cM, "right", w1Font(fs, 500));
      }
      geo = { S, u, x0, rh, yOf };
    };
    const hit = e => {
      if (!geo) return null;
      const [x, y] = evXY(cv, e);
      for (let l = 0; l <= L.length; l++) {
        const yy = geo.yOf(l);
        if (y < yy - 4 || y > yy + geo.rh + 4) continue;
        const st = geo.S[l], i = Math.round(((x - geo.x0) / geo.u - st.a) / st.j);
        return i >= 0 && i < st.n ? [l, i] : null;
      }
      return null;
    };
    cv.c.addEventListener("pointermove", e => { const q = hit(e); if (String(q) !== String(hov)) { hov = q; sync(false); } });
    cv.c.addEventListener("pointerleave", () => { if (hov) { hov = null; sync(false); } });
    cv.c.addEventListener("pointerdown", e => { const q = hit(e); if (q) { sel = q; hov = null; sync(false); } });

    function sync(layout = true) {
      bPre.forEach((b, i) => b.classList.toggle("on", i === preI));
      bAdd.forEach((b, i) => { const ly = [C3, C5, C3s, PL][i]; setDis(b, L.length >= MAXL || !sizes(L.concat([ly])).every(v => v >= 1)); });
      setDis(bDel, L.length <= 1);
      if (layout) cv.resize();
      cv.draw();
      const S = stats(), q = curQ(S), { D } = deps(S, q[0], q[1]);
      const ins = [...D[0]].sort((a, b) => a - b), conv = L.filter(l => l.t === "conv");
      const where = q[0] === 0 ? "ez maga a bemenet" : `a bemenet ${ins[0] + 1}–${ins[ins.length - 1] + 1}. cellájától függ: <b>${ins.length}</b> cella`;
      const clip = q[0] > 0 && ins.length < S[q[0]].r ? ` <span class="muted">(a szélén a kitöltés nullái miatt kevesebb, mint r = ${S[q[0]].r})</span>` : "";
      const wsum = conv.length ? conv.map(l => l.k * l.k).join(" + ") + (conv.length > 1 ? ` = ${conv.reduce((s, l) => s + l.k * l.k, 0)}` : "") : "–";
      out.innerHTML = `kiválasztva: ${q[0] === 0 ? "bemenet" : q[0] + ". réteg"}, ${q[1] + 1}. cella → ${where}${clip}` +
        `<br>a legfelső réteg receptív mezeje: <b>r = ${S[L.length].r}</b> · konvolúciós súlyok csatornapáronként: ${wsum}` +
        `<br><span class="muted">képlet rétegenként: r ← r + (k − 1)·j, j ← j·s (kezdetben r = 1, j = 1). ` +
        `Két 3×3: 18 súly, egy 5×5: 25 súly – a receptív mező mindkettőnél 5, de a két 3×3 kevesebb súlyból áll, és közéjük még egy ReLU is belefér.</span>`;
      const rows = [`<tr><td>bemenet</td><td>–</td><td>–</td><td>${S[0].n}</td><td>1</td><td>1</td><td>–</td></tr>`].concat(L.map((l, i) => {
        const st = S[i + 1];
        return `<tr${q[0] === i + 1 ? ' style="color:var(--accent);font-weight:600"' : ""}><td>${i + 1}. ${lname(l)}</td><td>${l.k}</td><td>${l.s}</td><td>${st.n}</td>` +
          `<td><b>${st.r}</b></td><td>${st.j}</td><td>${l.t === "conv" ? l.k * l.k : "–"}</td></tr>`;
      }));
      tab.innerHTML = `<table style="font-size:.84rem;width:auto;margin:.6rem 0 0;font-family:var(--mono)"><tr><th>réteg</th><th>k</th><th>s</th><th>méret</th><th>r</th><th>j</th><th>súly</th></tr>` +
        rows.join("") + `</table><p class="muted" style="font-size:.84rem;margin:.3rem 0 0">r: receptív mező (bemeneti cella), j: ugrás (a lépésközök szorzata), súly: egy k×k-s kernel súlyainak száma csatornapáronként.</p>`;
    }
    sync();
    addEventListener("resize", () => setTimeout(() => sync(), 200));
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
