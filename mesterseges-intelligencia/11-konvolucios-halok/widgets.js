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
