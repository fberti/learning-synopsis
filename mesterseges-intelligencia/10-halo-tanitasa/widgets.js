/* =========================================================
   Mesterséges intelligencia 10. fejezet – interaktív szemléltetések
   (a háló tanítása: veszteség, köteg, visszaterjesztés, számítási gráf,
   optimalizálók, inicializálás, regularizáció, számjegyfelismerő tanítása)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); tanítás: assets/ml.js (ML.MLP).
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

  const W = {};

  /* ==================================================================
     10.1–10.4 widgetek: loss-compare, batch-size-noise, backprop-stepper, compute-graph
     ================================================================== */

  /* közös kis segédek (w1 előtaggal, hogy ne ütközzenek) */
  const w1Sig = z => 1 / (1 + Math.exp(-z));
  const w1F4 = x => (x < 0 ? "−" : "") + Math.abs(x).toFixed(4).replace(".", ",");   // fix 4 tizedes
  const w1N = x => fmt(x, 4);                                                          // legfeljebb 4 tizedes
  const w1Vec = v => "(" + v.map(w1N).join("; ") + ")";
  const w1Mat = M => "[" + M.map(r => "[" + r.map(w1N).join("; ") + "]").join("; ") + "]";
  /* felirat „glóriával” (kártyaszínű körvonal), hogy vonalakon is olvasható legyen */
  function w1Text(ctx, txt, x, y, color, align = "center", base = "middle", font = "600 12px system-ui, sans-serif") {
    ctx.save(); ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.lineWidth = 4; ctx.strokeStyle = css("--card"); ctx.lineJoin = "round"; ctx.strokeText(txt, x, y);
    ctx.fillStyle = color; ctx.fillText(txt, x, y); ctx.restore();
  }
  /* többsoros címke kerekített keretben: lines = [[szöveg, szín, betű?], …], (x, y) = a keret közepe */
  function w1Tag(ctx, lines, x, y, fs = 12, border = null) {
    if (!lines.length) return;
    ctx.save();
    const fonts = lines.map(l => l[2] || `600 ${fs}px system-ui, sans-serif`);
    const ws = lines.map((l, i) => { ctx.font = fonts[i]; return ctx.measureText(l[0]).width; });
    const lh = fs + 3, bw = Math.max(...ws) + 10, bh = lines.length * lh + 4;
    const x0 = clamp(x - bw / 2, 1, ctx.canvas.clientWidth - bw - 1);
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y - bh / 2, bw, bh, 5) : ctx.rect(x0, y - bh / 2, bw, bh);
    ctx.fillStyle = css("--card"); ctx.fill();
    ctx.strokeStyle = border || css("--border"); ctx.lineWidth = 1; ctx.stroke();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    lines.forEach((l, i) => { ctx.font = fonts[i]; ctx.fillStyle = l[1]; ctx.fillText(l[0], x0 + bw / 2, y - bh / 2 + 2 + lh * (i + 0.5)); });
    ctx.restore();
  }
  function w1RoundRect(ctx, x, y, w, hh, r, fill, stroke, lw = 2) {
    ctx.save(); ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, hh, r) : ctx.rect(x, y, w, hh);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.restore();
  }

  /* ------------------------------------------------------------------
     10.1  loss-compare – miért a logaritmus? négyzetes hiba vs. keresztentrópia
     ------------------------------------------------------------------ */
  const lcLoss = { mse: (p, y) => 0.5 * (p - y) ** 2, ce: (p, y) => -(y * Math.log(p) + (1 - y) * Math.log(1 - p)) };
  const lcGrad = { mse: (p, y) => (p - y) * p * (1 - p), ce: (p, y) => p - y };
  W["loss-compare"] = root => {
    header(root, "Négyzetes hiba vagy keresztentrópia?",
      "Egyetlen szigmoid kimenet: $p = \\sigma(z)$, a címke $y$. <b>Bal oldalt</b> a két veszteség $z$ függvényében, " +
      "<b>jobb oldalt</b> a gradiensük nagysága, $\\lvert\\partial L/\\partial z\\rvert$ – ekkora „lökést” kap a tanulás. " +
      "Négyzetes hiba: $L = \\tfrac12(p-y)^2$, $\\ \\partial L/\\partial z = (p-y)\\,p(1-p)$. " +
      "Keresztentrópia: $L = -[y\\ln p + (1-y)\\ln(1-p)]$, $\\ \\partial L/\\partial z = p - y$. " +
      "Figyeld: a négyzetes hiba gradiense éppen akkor tűnik el, amikor a modell <b>magabiztosan téved</b>.");
    let z = -4, y = 1;
    const sZ = slider(-6, 6, 0.1, z), oZ = h("b");
    sZ.addEventListener("input", () => { z = +sZ.value; sync(); });
    const gY = toggleGroup([["1", "y = 1"], ["0", "y = 0"]], () => String(y), v => { y = +v; sync(); });
    const PRE = [["magabiztosan téved", -4], ["bizonytalan", 0], ["jól dönt", 2]];
    const zOf = v => (y ? v : -v) || 0;
    const bP = PRE.map(([, v]) => btn("", () => { z = zOf(v); sync(); }));
    root.append(h("div", { class: "controls" }, small("címke:"), gY.bs, h("label", null, "z = ", sZ, oZ)),
      h("div", { class: "controls" }, small("beállítás:"), bP));
    const [cvL, cvR] = twoCanvas(root, 0.85, 0.85);
    const out = h("div", { class: "readout" });
    root.append(out);
    const legend = (cv, x0, items) => items.forEach(([t, c], i) => {
      const yy = 16 + 17 * i, { ctx } = cv, left = x0 < cv.w / 2;
      ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath();
      const a = left ? x0 : x0 - 18; ctx.moveTo(a, yy); ctx.lineTo(a + 18, yy); ctx.stroke(); ctx.restore();
      w1Text(ctx, t, left ? x0 + 23 : x0 - 23, yy, c, left ? "left" : "right");
    });
    const curves = (cv, V, F) => {
      const cM = css("--setB"), cC = css("--accent"), p = w1Sig(z);
      const T = Calc.plot(cv, V, [{ f: t => F.mse(w1Sig(t)), color: cM }, { f: t => F.ce(w1Sig(t)), color: cC }]);
      const { ctx } = cv;
      polyline(ctx, T, [[z, V.ymin], [z, V.ymax]], css("--muted"), 1.2, [4, 3]);
      [[F.mse(p), cM], [F.ce(p), cC]].forEach(([v, c]) => { if (v <= V.ymax) { dot(ctx, T.tx(z), T.ty(v), 6.5, css("--card")); dot(ctx, T.tx(z), T.ty(v), 5, c); } });
      legend(cv, y ? cv.w - 10 : 10, [["négyzetes hiba", cM], ["keresztentrópia", cC]]);
      return T;
    };
    cvL.draw = () => curves(cvL, { xmin: -6, xmax: 6, ymin: -0.45, ymax: 6.6, xstep: 2, ystep: 1, xname: "z", yname: "L" },
      { mse: p => lcLoss.mse(p, y), ce: p => lcLoss.ce(p, y) });
    cvR.draw = () => curves(cvR, { xmin: -6, xmax: 6, ymin: -0.08, ymax: 1.15, xstep: 2, ystep: 0.25, xname: "z", yname: "|∂L/∂z|" },
      { mse: p => Math.abs(lcGrad.mse(p, y)), ce: p => Math.abs(lcGrad.ce(p, y)) });
    function sync() {
      gY.paint(); sZ.value = z; oZ.textContent = fmt(z, 1);
      bP.forEach((b, i) => { b.textContent = `${PRE[i][0]} (z = ${fmt(zOf(PRE[i][1]), 0)})`; b.classList.toggle("on", Math.abs(z - zOf(PRE[i][1])) < 1e-9); });
      cvL.draw(); cvR.draw();
      const p = w1Sig(z), gm = lcGrad.mse(p, y), gc = lcGrad.ce(p, y);
      const wrong = (p >= 0.5 ? 1 : 0) !== y, conf = Math.abs(z) >= 2;
      let s = `p = σ(${fmt(z, 1)}) = <b>${fmt(p, 3)}</b> · y = ${y}` +
        `<br><span style="color:var(--setB)">■</span> négyzetes hiba: L = <b>${fmt(lcLoss.mse(p, y), 3)}</b>, ∂L/∂z = <b>${fmt(gm, 4)}</b>` +
        `<br><span style="color:var(--accent)">■</span> keresztentrópia: L = <b>${fmt(lcLoss.ce(p, y), 3)}</b>, ∂L/∂z = <b>${fmt(gc, 4)}</b>` +
        `<br>a keresztentrópia gradiense <b>${fmt(gc / gm, 1)}</b>-szor akkora`;
      const note = wrong && conf
        ? "A modell magabiztosan téved – a négyzetes hiba gradiense mégis alig nagyobb nullánál: a szigmoid lapos szakaszán a p(1 − p) tényező „lenyeli” a hibát. A keresztentrópiánál ez a tényező kiesik: a gradiens p − y, arányos a tévedéssel."
        : wrong || Math.abs(z) < 1 ? "Bizonytalan döntés: itt mindkét gradiens számottevő, de a keresztentrópiáé így is többszörös."
          : "Jól dönt: mindkét gradiens kicsi – itt ez így helyes, nincs mit javítani.";
      out.innerHTML = s + `<br><span class="muted">${note}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     10.2  batch-size-noise – mini-köteg: zajos, de olcsó gradiens
     ------------------------------------------------------------------ */
  const BS_N = 200, BS_LIST = [1, 4, 16, 64, 200], BS_ETA = 0.1, BS_EP = 5, BS_P0 = [-0.5, -1.5], BS_ARR = 0.15;
  const BS_COL = { 1: "--bad", 4: "--setB", 16: "--setC", 64: "--setA", 200: "--accent" };
  function bsData() {
    const r = ML.rng(10), X = [], Y = [];
    for (let i = 0; i < BS_N; i++) { const x = 2 * r() - 1; X.push(x); Y.push(2 * x + 1 + 0.5 * ML.gauss(r)); }
    const m = f => X.reduce((s, x, i) => s + f(x, Y[i]), 0) / BS_N;
    const S = { mx: m(x => x), mxx: m(x => x * x), my: m((x, y) => y), mxy: m((x, y) => x * y), myy: m((x, y) => y * y) };
    const det = S.mxx - S.mx * S.mx;
    S.opt = [(S.mxy - S.mx * S.my) / det, (S.mxx * S.my - S.mx * S.mxy) / det];
    return { X, Y, S };
  }
  W["batch-size-noise"] = root => {
    header(root, "Kötegméret: zajos, de olcsó gradiens",
      "Lineáris regresszió 200 zajos pontra ($y \\approx 2x + 1$), a veszteség az átlagos négyzetes hiba, a paraméterek $(w, b)$. " +
      "<b>Bal oldalt</b> a veszteség szintvonalai, a jelenlegi pont, a teljes gradiens iránya (vastag nyíl, $-\\nabla L$) és 30 véletlen " +
      "<b>mini-köteg</b> becslése (vékony nyilak). Minél nagyobb a köteg ($B$), annál kisebb a felhő: a szórás kb. $\\sigma/\\sqrt B$. " +
      "A pontot el is húzhatod. <b>Jobb oldalt</b> tanítás SGD-vel ($\\eta = 0{,}1$, 5 epoch) – kis $B$: sok, zajos lépés epochonként; teljes köteg: epochonként 1 lépés.");
    const D = bsData(), { X, Y, S } = D;
    let B = 16, P = BS_P0.slice(), cseed = 1;
    const runs = new Map();
    const loss = (w, b) => w * w * S.mxx + b * b + S.myy + 2 * w * b * S.mx - 2 * w * S.mxy - 2 * b * S.my;
    const fullG = (w, b) => [2 * (w * S.mxx + b * S.mx - S.mxy), 2 * (w * S.mx + b - S.my)];
    const gi = (i, w, b) => { const r = w * X[i] + b - Y[i]; return [2 * r * X[i], 2 * r]; };
    const batchG = (idx, w, b) => { let gw = 0, gb = 0; idx.forEach(i => { const g = gi(i, w, b); gw += g[0]; gb += g[1]; }); return [gw / idx.length, gb / idx.length]; };
    const sample = (k, rnd) => {           // k elem visszatevés nélkül (részleges keverés)
      const a = X.map((_, i) => i);
      for (let i = 0; i < k; i++) { const j = i + Math.floor(rnd() * (BS_N - i)); [a[i], a[j]] = [a[j], a[i]]; }
      return a.slice(0, k);
    };
    const gB = toggleGroup(BS_LIST.map(b => [String(b), b === BS_N ? "200 (teljes)" : String(b)]), () => String(B), v => { B = +v; sync(); });
    const bT = btn("▶ Tanítás 5 epochon át", () => { train(); sync(); }, "btn primary");
    root.append(h("div", { class: "controls" }, small("kötegméret B:"), gB.bs),
      h("div", { class: "controls" }, bT, btn("Törlés", () => { runs.clear(); sync(); }),
        btn("🎲 Új kötegek", () => { cseed++; sync(); }), btn("Kezdőpont vissza", () => { P = BS_P0.slice(); runs.clear(); sync(); })));
    const [cvL, cvR] = twoCanvas(root, 1, 0.85);
    const out = h("div", { class: "readout" });
    root.append(out);
    function train() {
      const rnd = ML.rng(500 + B);
      let w = P[0], b = P[1], n = 0;
      const curve = [[0, loss(w, b)]], path = [[w, b]];
      for (let e = 0; e < BS_EP; e++) {
        const idx = ML.shuffle(X.map((_, i) => i), rnd);
        for (let s = 0; s < BS_N; s += B) {
          const bi = idx.slice(s, s + B), g = batchG(bi, w, b);
          w -= BS_ETA * g[0]; b -= BS_ETA * g[1]; n += bi.length;
          curve.push([n / BS_N, loss(w, b)]); path.push([w, b]);
        }
      }
      runs.set(B, { curve, path, steps: path.length - 1 });
    }
    /* szórás: mért (400 köteg) és elméleti σ/√B */
    function spread(Bk) {
      const [w, b] = P, g = fullG(w, b);
      let s2 = 0;
      for (let i = 0; i < BS_N; i++) { const q = gi(i, w, b); s2 += (q[0] - g[0]) ** 2 + (q[1] - g[1]) ** 2; }
      const sig = Math.sqrt(s2 / BS_N);
      const rnd = ML.rng(77 + Bk), K = 400;
      let m2 = 0;
      for (let k = 0; k < K; k++) { const q = batchG(sample(Bk, rnd), w, b); m2 += (q[0] - g[0]) ** 2 + (q[1] - g[1]) ** 2; }
      return { meas: Math.sqrt(m2 / K), theo: sig / Math.sqrt(Bk), sig };
    }
    let TL = null;
    cvL.draw = () => {
      const V = eqView(cvL, 1.5, 0.5, 2.5, 2.5, { xname: "w", yname: "b" });
      const T = TL = Calc.plot(cvL, V, []), { ctx } = cvL;
      /* szintvonalak: L = L* + c ellipszisek (a veszteség másodfokú) */
      const a = S.mxx, bb = S.mx, phi = 0.5 * Math.atan2(2 * bb, a - 1);
      const l1 = (a + 1) / 2 + Math.hypot((a - 1) / 2, bb), l2 = (a + 1) / 2 - Math.hypot((a - 1) / 2, bb);
      const u1 = [Math.cos(phi), Math.sin(phi)], u2 = [-Math.sin(phi), Math.cos(phi)], [ow, ob] = S.opt;
      const cc = css("--muted");
      [0.05, 0.25, 0.6, 1.2, 2, 3, 4.5, 6.5, 9, 12, 16, 21].forEach(c => {
        const r1 = Math.sqrt(c / l1), r2 = Math.sqrt(c / l2), pts = [];
        for (let k = 0; k <= 120; k++) {
          const t = 2 * Math.PI * k / 120, A1 = r1 * Math.cos(t), A2 = r2 * Math.sin(t);
          pts.push([ow + A1 * u1[0] + A2 * u2[0], ob + A1 * u1[1] + A2 * u2[1]]);
        }
        polyline(ctx, T, pts, rgba(cc, 0.45), 1);
      });
      label(ctx, "×", T.tx(ow), T.ty(ob), css("--text"), "center", "700 15px system-ui, sans-serif", "middle");
      label(ctx, "minimum", T.tx(ow) + 8, T.ty(ob) - 6, css("--muted"), "left", "11px system-ui, sans-serif");
      /* korábbi futások útja */
      runs.forEach((r, k) => polyline(ctx, T, r.path, rgba(css(BS_COL[k]), 0.85), k === 1 ? 1 : 1.8));
      /* mini-köteg nyilak */
      const [w, b] = P, g = fullG(w, b), rnd = ML.rng(1000 * cseed + B), col = css(BS_COL[B]);
      const x0 = T.tx(w), y0 = T.ty(b);
      for (let k = 0; k < 30; k++) {
        const q = batchG(sample(B, rnd), w, b);
        arrow(ctx, x0, y0, T.tx(w - BS_ARR * q[0]), T.ty(b - BS_ARR * q[1]), rgba(col, 0.42), 1.3);
      }
      arrow(ctx, x0, y0, T.tx(w - BS_ARR * g[0]), T.ty(b - BS_ARR * g[1]), css("--text"), 3);
      dot(ctx, x0, y0, 7, css("--card")); dot(ctx, x0, y0, 5.5, css("--text"));
    };
    /* veszteség–epoch görbe logaritmikus skálán */
    cvR.draw = () => {
      const L0 = 0.15, L1 = 15, ly = v => Math.log10(Math.max(v, L0) / L0);
      const V = { xmin: -0.3, xmax: 5.4, ymin: -0.34, ymax: ly(L1), grid: false, labels: false };
      const T = Calc.plot(cvR, V, []), { ctx, w } = cvR, mu = css("--muted");
      [0.25, 0.5, 1, 2, 5, 10].forEach(v => {
        polyline(ctx, T, [[0, ly(v)], [V.xmax, ly(v)]], css("--border"), 1);
        label(ctx, fmt(v, 2), T.tx(0) + 4, T.ty(ly(v)) - 1, mu, "left", "11px system-ui, sans-serif");
      });
      for (let e = 1; e <= BS_EP; e++) {
        polyline(ctx, T, [[e, 0], [e, V.ymax]], css("--border"), 1);
        label(ctx, String(e), T.tx(e), T.ty(0) + 3, mu, "center", "11px system-ui, sans-serif", "top");
      }
      label(ctx, "veszteség (log skála)", T.tx(0) + 6, 3, mu, "left", "11px system-ui, sans-serif", "top");
      label(ctx, "epoch = feldolgozott minták / 200", w - 6, cvR.h - 3, mu, "right", "11px system-ui, sans-serif");
      polyline(ctx, T, [[0, ly(loss(...S.opt))], [V.xmax, ly(loss(...S.opt))]], mu, 1.2, [5, 4]);
      runs.forEach((r, k) => polyline(ctx, T, r.curve.map(([x, v]) => [x, ly(v)]), css(BS_COL[k]), k === 1 ? 1.2 : 2.2));
      let i = 0;
      BS_LIST.forEach(k => {
        if (!runs.has(k)) return;
        const yy = 30 + 16 * i++, x1 = w - 60;
        ctx.save(); ctx.strokeStyle = css(BS_COL[k]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x1 + 16, yy); ctx.stroke(); ctx.restore();
        w1Text(ctx, `B = ${k}`, x1 + 20, yy, css(BS_COL[k]), "left");
      });
      if (!runs.size) label(ctx, "Nyomd meg a „Tanítás” gombot!", w / 2, cvR.h / 2, mu, "center", "12px system-ui, sans-serif", "middle");
    };
    let drag = false;
    const pick = e => {
      if (!TL) return;
      const [px, py] = evXY(cvL, e);
      P = [clamp(Math.round(TL.ix(px) * 20) / 20, -1, 4), clamp(Math.round(TL.iy(py) * 20) / 20, -2, 3)];
      runs.clear(); sync();
    };
    cvL.c.addEventListener("pointerdown", e => { drag = true; cvL.c.setPointerCapture(e.pointerId); pick(e); });
    cvL.c.addEventListener("pointermove", e => drag && pick(e));
    cvL.c.addEventListener("pointerup", () => { drag = false; });
    function sync() {
      gB.paint(); bT.textContent = `▶ Tanítás 5 epochon át (B = ${B})`;
      cvL.draw(); cvR.draw();
      const [w, b] = P, g = fullG(w, b);
      const rows = BS_LIST.map(k => {
        const sp = spread(k), on = k === B ? ` style="background:var(--accent-soft)"` : "";
        return `<tr${on}><td>${k}</td><td>${Math.ceil(BS_N / k)}</td><td>${fmt(sp.meas, 2)}</td><td>${fmt(sp.theo, 2)}</td></tr>`;
      }).join("");
      let s = `pont: (w; b) = (<b>${fmt(w, 2)}</b>; <b>${fmt(b, 2)}</b>) · veszteség: <b>${fmt(loss(w, b), 3)}</b>` +
        `<br>teljes gradiens: ∇L = (${fmt(g[0], 2)}; ${fmt(g[1], 2)}), |∇L| = <b>${fmt(Math.hypot(...g), 2)}</b> · egy minta gradiensének szórása: σ = <b>${fmt(spread(1).sig, 2)}</b>` +
        `<table style="font-size:.84rem;width:auto;margin:.4rem 0"><tr><th>B</th><th>lépés / epoch</th><th>mért szórás</th><th>σ/√B</th></tr>${rows}</table>` +
        `<span class="muted">Mért szórás: 400 véletlen köteg gradiensének átlagos eltérése a teljes gradienstől. Négyszer nagyobb köteg → fele akkora zaj. ` +
        `B = 64-nél és 200-nál a mért érték kisebb az elméletinél, mert egy kötegben minden pont csak egyszer szerepel – a teljes kötegnek már nincs zaja.</span>`;
      if (runs.size) s += `<br><span class="muted">Jobb oldali ábra, szaggatott vonal: a legkisebb elérhető veszteség (${fmt(loss(...S.opt), 3)}).</span><br>5 epoch után: ` + BS_LIST.filter(k => runs.has(k)).map(k => { const r = runs.get(k); return `B = ${k}: L = <b>${fmt(r.curve[r.curve.length - 1][1], 3)}</b> (${r.steps} lépés)`; }).join(" · ");
      out.innerHTML = s;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     10.3  backprop-stepper – a kézzel számolt 2–2–1-es háló lépésenként
     ------------------------------------------------------------------ */
  const BP_X = [1, 2];
  const bpInit = () => ({ W1: [[0.5, 0.25], [-1, 1]], b1: [0, 0.5], W2: [1, -1], b2: 0.5 });
  function bpFwd(P, y) {
    const z1 = P.W1.map((r, j) => r[0] * BP_X[0] + r[1] * BP_X[1] + P.b1[j]), hv = z1.map(v => Math.max(0, v));
    const z2 = P.W2[0] * hv[0] + P.W2[1] * hv[1] + P.b2, yh = w1Sig(z2);
    return { z1, h: hv, z2, yh, L: -(y ? Math.log(yh) : Math.log(1 - yh)) };
  }
  function bpBwd(P, F, y) {
    const d2 = F.yh - y, back = P.W2.map(v => v * d2), rp = F.z1.map(v => (v > 0 ? 1 : 0)), d1 = back.map((v, j) => v * rp[j]);
    return { d2, gW2: F.h.map(v => d2 * v), gb2: d2, back, rp, d1, gW1: d1.map(d => BP_X.map(x => d * x)), gb1: d1.slice() };
  }
  const bpUpd = (P, G, eta) => ({
    W1: P.W1.map((r, j) => r.map((v, i) => v - eta * G.gW1[j][i])), b1: P.b1.map((v, j) => v - eta * G.gb1[j]),
    W2: P.W2.map((v, j) => v - eta * G.gW2[j]), b2: P.b2 - eta * G.gb2
  });
  W["backprop-stepper"] = root => {
    header(root, "Visszaterjesztés lépésről lépésre",
      "A fejezet kézzel számolt 2–2–1-es hálója: bemenet $\\mathbf x = (1;\\ 2)$, rejtett réteg ReLU-val, kimenet szigmoiddal, veszteség: bináris keresztentrópia. " +
      "Kattints sorban: <b>1. Előre</b> (értékek, kékkel), <b>2. Vissza</b> rétegenként (gradiensek, pirossal), <b>3. Frissítés</b> ($w \\leftarrow w - \\eta\\,\\partial L/\\partial w$, zölddel). " +
      "Utána újra „Előre”: csökkent a veszteség?");
    let P = bpInit(), y = 1, eta = 0.1, st = 0, F = null, G = null, hist = [];
    const gE = toggleGroup([["0.1", "η = 0,1"], ["0.5", "η = 0,5"]], () => String(eta), v => { eta = +v; sync(); });
    const gY = toggleGroup([["1", "y = 1"], ["0", "y = 0"]], () => String(y), v => { y = +v; reset(); });
    const bF = btn("1. Előre", () => { adv(); sync(); }, "btn primary");
    const bB = btn("2. Vissza", () => { adv(); sync(); }, "btn primary");
    const bU = btn("3. Frissítés", () => { adv(); sync(); }, "btn primary");
    const bAll = btn("⏩ Teljes lépés", () => { let g = 0; do adv(); while (st !== 1 && g++ < 9); sync(); });
    root.append(h("div", { class: "controls" }, bF, bB, bU),
      h("div", { class: "controls" }, bAll, btn("↺ Újrakezdés", reset), small("tanulási ráta:"), gE.bs, small("címke:"), gY.bs));
    const cv = Calc.canvas(root, flatAspect(root, 0.56, 1.15));
    const out = h("div", { class: "readout" }), tab = h("div", { style: "overflow-x:auto" });
    root.append(out, tab);
    const Pn = () => bpUpd(P, G, eta);
    function adv() {
      if (st === 0 || st === 5) { if (st === 5) P = Pn(); F = bpFwd(P, y); G = null; hist.push(F.L); st = 1; }
      else if (st <= 3) { if (st === 1) G = bpBwd(P, F, y); st++; }
      else if (st === 4) st = 5;
    }
    function reset() { P = bpInit(); st = 0; F = G = null; hist = []; sync(); }
    cv.draw = () => {
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const narrow = w < 520, fs = narrow ? 11 : 12, r = clamp(w * 0.034, 15, 22);
      const cF = css("--accent"), cB = css("--bad"), cU = css("--ok"), cT = css("--text"), cM = css("--muted");
      const xi = Math.max(r + 4, w * 0.07), xh = w * 0.42, xo = w * (narrow ? 0.66 : 0.7);
      const yt = hh * (narrow ? 0.24 : 0.3), yb = hh * (narrow ? 0.78 : 0.72), ym = (yt + yb) / 2;
      const In = [[xi, yt], [xi, yb]], Hd = [[xh, yt], [xh, yb]], O = [xo, ym];
      const upd = st === 5 ? Pn() : null;
      const wTxt = (old, nw) => (nw == null ? w1N(old) : `${w1N(old)} → ${w1N(nw)}`);
      const edge = (a, b, t, lines, hot) => {
        ctx.save(); ctx.strokeStyle = hot ? cB : rgba(cM, 0.7); ctx.lineWidth = hot ? 2 : 1.4;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
        w1Tag(ctx, lines, a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), fs, hot ? cB : null);
      };
      const wl = (old, nw, g, showG) => {
        const L = [[wTxt(old, nw), nw == null ? cT : cU]];
        if (showG) L.push([`∂ ${w1N(g)}`, cB]);
        return L;
      };
      /* élek: W1 (i → j) és W2 (j → kimenet) */
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++)
        edge(In[i], Hd[j], i === j ? 0.5 : 0.3, wl(P.W1[j][i], upd && upd.W1[j][i], G && G.gW1[j][i], st >= 4), st === 4);
      for (let j = 0; j < 2; j++) edge(Hd[j], O, narrow ? 0.4 : 0.5, wl(P.W2[j], upd && upd.W2[j], G && G.gW2[j], st >= 2), st === 2);
      /* veszteségdoboz */
      const lt = [["L = " + (F ? w1F4(F.L) : "?"), F ? cF : cM, `700 ${fs + 1}px system-ui, sans-serif`], [`y = ${y}`, cT]];
      ctx.save(); ctx.font = `700 ${fs + 1}px system-ui, sans-serif`; const lw = ctx.measureText(lt[0][0]).width + 12; ctx.restore();
      const lx = Math.max(O[0] + r + 14, w - lw - 4);
      ctx.save(); ctx.strokeStyle = rgba(cM, 0.7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(O[0] + r, ym); ctx.lineTo(lx, ym); ctx.stroke(); ctx.restore();
      w1Tag(ctx, lt, lx + lw / 2, ym, fs);
      /* csomópontok */
      const node = (p, name, col) => {
        dot(ctx, p[0], p[1], r, css("--card")); ring(ctx, p[0], p[1], r, col, 2.2);
        label(ctx, name, p[0], p[1] + 1, cT, "center", `700 ${fs + 2}px system-ui, sans-serif`, "middle");
      };
      const block = (p, lines, up) => {
        const lh = fs + 4;
        lines.forEach((l, k) => w1Text(ctx, l[0], p[0], up ? p[1] - r - 8 - lh * (lines.length - 1 - k) : p[1] + r + 9 + lh * k, l[1], "center", "middle", `600 ${fs}px system-ui, sans-serif`));
      };
      In.forEach((p, i) => { node(p, "x" + sub(i + 1), cM); block(p, [[`x${sub(i + 1)} = ${BP_X[i]}`, cF]], i === 0); });
      Hd.forEach((p, j) => {
        node(p, "h" + sub(j + 1), st === 3 ? cB : cF);
        const L = [[`b = ${wTxt(P.b1[j], upd && upd.b1[j])}`, upd ? cU : cT]];
        if (F) L.push([`z = ${w1N(F.z1[j])} · h = ${w1N(F.h[j])}`, cF]);
        if (st >= 3) L.push([`δ = ${w1N(G.back[j])}·${G.rp[j]} = ${w1N(G.d1[j])}`, cB]);
        block(p, j === 0 ? L.reverse() : L, j === 0);
      });
      node(O, "ŷ", st === 2 ? cB : css("--setB"));
      block(O, [[`b = ${wTxt(P.b2, upd && upd.b2)}`, upd ? cU : cT]].concat(F ? [[`z = ${w1N(F.z2)} · ŷ = ${w1F4(F.yh)}`, cF]] : []).reverse(), true);
      if (st >= 2) block(O, [[`δ = ŷ − y = ${w1N(G.d2)}`, cB]], false);
    };
    function explain() {
      const yy = y ? "" : "1 − ";
      if (st === 0) return "Kezdés: a súlyok a rajzon, a bemenet x = (1; 2), a címke y = " + y + ". Nyomd meg az „1. Előre” gombot!";
      if (st === 1) {
        let s = `<b>Előre:</b> z₁ = W₁x + b₁ = ${w1Vec(F.z1)}, h = ReLU(z₁) = ${w1Vec(F.h)}, z₂ = W₂·h + b₂ = ${w1N(F.z2)}, ŷ = σ(z₂) = ${w1F4(F.yh)}, ` +
          `L = −ln(${yy}ŷ) = <b>${w1F4(F.L)}</b>.`;
        if (hist.length > 1) s += ` A veszteség az előző lépés óta: ${w1F4(hist[hist.length - 2])} → ${w1F4(F.L)}.`;
        return s;
      }
      if (st === 2) return `<b>Vissza – kimeneti réteg:</b> δ₂ = ŷ − y = ${w1N(G.d2)} (szigmoid + keresztentrópia: ennyi az egész). ` +
        `∂L/∂W₂ = δ₂·h = ${w1Vec(G.gW2)}, ∂L/∂b₂ = δ₂ = ${w1N(G.gb2)}.`;
      if (st === 3) {
        let s = `<b>Vissza – rejtett réteg:</b> a hiba a súlyokon át megy vissza: W₂ᵀδ₂ = ${w1Vec(G.back)}; ReLU′(z₁) = ${w1Vec(G.rp)} → ` +
          `δ₁ = ${w1Vec(G.d1)} (elemenként szorozva). ∂L/∂b₁ = δ₁.`;
        if (G.rp.includes(0)) s += ` <b>Figyelem:</b> ahol z ≤ 0, ott ReLU′ = 0 – azon a neuronon most nem jut át gradiens, a súlyai nem változnak.`;
        return s;
      }
      if (st === 4) return `<b>Vissza – első réteg súlyai:</b> ∂L/∂W₁ = δ₁xᵀ = ${w1Mat(G.gW1)} – minden súly gradiense = (a neuron δ-ja) × (a bemenet, amit a súly szoroz).`;
      return `<b>Frissítés:</b> minden paraméterre w ← w − η·∂L/∂w, η = ${fmt(eta, 1)}. Az új értékek zölddel. Az „1. Előre” megmutatja, csökkent-e a veszteség.`;
    }
    function sync() {
      gE.paint(); gY.paint();
      setDis(bF, !(st === 0 || st === 5)); setDis(bB, !(st >= 1 && st <= 3)); setDis(bU, st !== 4);
      bB.textContent = st >= 1 && st <= 3 ? `2. Vissza (${st}/3)` : "2. Vissza";
      cv.draw();
      out.innerHTML = explain() + (hist.length ? `<br>veszteség az egyes előre menetekben: <b>${hist.map(w1F4).join(" → ")}</b>` : "");
      const upd = st === 5 ? Pn() : null;
      const R = [["w¹₁₁", P.W1[0][0], G && G.gW1[0][0], upd && upd.W1[0][0], 4], ["w¹₁₂", P.W1[0][1], G && G.gW1[0][1], upd && upd.W1[0][1], 4],
        ["w¹₂₁", P.W1[1][0], G && G.gW1[1][0], upd && upd.W1[1][0], 4], ["w¹₂₂", P.W1[1][1], G && G.gW1[1][1], upd && upd.W1[1][1], 4],
        ["b¹₁", P.b1[0], G && G.gb1[0], upd && upd.b1[0], 3], ["b¹₂", P.b1[1], G && G.gb1[1], upd && upd.b1[1], 3],
        ["w²₁", P.W2[0], G && G.gW2[0], upd && upd.W2[0], 2], ["w²₂", P.W2[1], G && G.gW2[1], upd && upd.W2[1], 2], ["b²", P.b2, G && G.gb2, upd && upd.b2, 2]];
      const dash = `<span class="muted">–</span>`;
      tab.innerHTML = `<table style="font-size:.84rem;width:auto;margin:.6rem 0 0;font-family:var(--mono)"><tr><th>paraméter</th><th>érték</th><th>gradiens ∂L/∂·</th><th>új érték</th></tr>` +
        R.map(([n, v, g, nv, need]) => `<tr><td>${n}</td><td>${w1N(v)}</td><td style="color:var(--bad)">${st >= need && g != null ? w1N(g) : dash}</td>` +
          `<td style="color:var(--ok);font-weight:600">${nv != null ? w1N(nv) : dash}</td></tr>`).join("") + `</table>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     10.4  compute-graph – számítási gráf: előre értékek, vissza gradiensek
     ------------------------------------------------------------------ */
  const CG_PRE = {
    a: { name: "(a) (x + y)·z", nodes: [
      { id: "x", v: 1, c: 0, r: 0.12 }, { id: "y", v: 2, c: 0, r: 0.48 }, { id: "z", v: -3, c: 0, r: 0.88 },
      { id: "q", op: "add", in: ["x", "y"], c: 1, r: 0.3 }, { id: "f", op: "mul", in: ["q", "z"], c: 2, r: 0.55 }] },
    b: { name: "(b) x·y + x", nodes: [
      { id: "x", v: 3, c: 0, r: 0.2 }, { id: "y", v: 2, c: 0, r: 0.85 },
      { id: "m", op: "mul", in: ["x", "y"], c: 1, r: 0.7 }, { id: "f", op: "add", in: ["m", "x"], c: 2, r: 0.42 }] },
    c: { name: "(c) σ(w·x + b)", nodes: [
      { id: "w", v: 0.5, c: 0, r: 0.1 }, { id: "x", v: 2, c: 0, r: 0.45 }, { id: "b", v: -1, c: 0, r: 0.88 },
      { id: "u", op: "mul", in: ["w", "x"], c: 1, r: 0.28 }, { id: "z", op: "add", in: ["u", "b"], c: 2, r: 0.55 }, { id: "a", op: "sig", in: ["z"], c: 3, r: 0.55 }] },
    d: { name: "(d) max(x, y)·z", nodes: [
      { id: "x", v: 4, c: 0, r: 0.12 }, { id: "y", v: 1, c: 0, r: 0.48 }, { id: "z", v: 2, c: 0, r: 0.88 },
      { id: "m", op: "max", in: ["x", "y"], c: 1, r: 0.3 }, { id: "f", op: "mul", in: ["m", "z"], c: 2, r: 0.55 }] }
  };
  const CG_SYM = { add: "+", mul: "·", max: "max", sig: "σ" };
  const CG_NAME = { add: "összeadás", mul: "szorzás", max: "max", sig: "szigmoid" };
  W["compute-graph"] = root => {
    header(root, "Számítási gráf: előre értékek, vissza gradiensek",
      "A kifejezést elemi lépésekre (csomópontokra) bontjuk. <b>Előre</b> a bemenetektől a kimenet felé számoljuk az értékeket (kék, az élek fölött), " +
      "<b>vissza</b> a kimenettől indulva a gradienseket (piros, az élek alatt): minden csomópont a kapott gradienst megszorozza a saját helyi deriváltjával, " +
      "és továbbadja a bemeneteinek (láncszabály). A bemenetek értékét át is írhatod.");
    let key = "a", N = [], fstep = 0, bstep = 0;
    const leafBox = h("div", { class: "controls" });
    const gP = toggleGroup(Object.entries(CG_PRE).map(([k, o]) => [k, o.name]), () => key, k => { key = k; load(); });
    const bF = btn("▶ Előre lépés", () => { if (fstep < nOps()) fstep++; sync(); }, "btn primary");
    const bB = btn("◀ Vissza lépés", () => { if (bstep < nOps() + 1) bstep++; sync(); }, "btn primary");
    root.append(h("div", { class: "controls" }, gP.bs), leafBox,
      h("div", { class: "controls" }, bF, bB, btn("⏭ Mind", () => { fstep = nOps(); bstep = nOps() + 1; sync(); }), btn("↺ Újra", () => { fstep = bstep = 0; sync(); })));
    const cv = Calc.canvas(root, flatAspect(root, 0.46, 0.85));
    const out = h("div", { class: "readout" });
    const rules = h("div", { style: "border:1px solid var(--border);border-radius:8px;padding:.45rem .75rem;margin-top:.6rem;font-size:.9rem;background:var(--bg-soft)",
      html: "<b>Kapuszabályok – a gradiens útja visszafelé</b><br>" +
        "• <b>összeadás</b> – továbbadja: mindkét bemenet ugyanazt a gradienst kapja;<br>" +
        "• <b>szorzás</b> – felcseréli: az egyik bemenet gradiense = a <i>másik</i> bemenet értéke × a kapott gradiens;<br>" +
        "• <b>max</b> – a nagyobbhoz irányítja: a nagyobb bemenet mindent megkap, a kisebb 0-t;<br>" +
        "• <b>elágazás</b> – összeadódik: ha egy érték több helyre is megy, a visszajövő gradiensek összeadódnak." });
    root.append(out, rules);
    const ops = () => N.filter(n => n.op), nOps = () => ops().length, outN = () => N[N.length - 1];
    function load() {
      N = CG_PRE[key].nodes.map(n => Object.assign({}, n)); fstep = bstep = 0;
      leafBox.replaceChildren(small("bemenetek:"), ...N.filter(n => !n.op).map(n => {
        const inp = h("input", { type: "number", min: -5, max: 5, step: 0.5, value: n.v, style: "width:4.6em" });
        inp.addEventListener("input", () => { const v = parseFloat(String(inp.value).replace(",", ".")); if (Number.isFinite(v)) { n.v = clamp(v, -5, 5); sync(); } });
        return h("label", null, `${n.id} =`, inp);
      }));
      sync();
    }
    /* teljes számítás; a megjelenítést a lépésszámlálók szabják meg */
    function compute() {
      const V = {}, by = {};
      N.forEach(n => {
        by[n.id] = n;
        if (!n.op) V[n.id] = n.v;
        else {
          const a = n.in.map(k => V[k]);
          V[n.id] = n.op === "add" ? a[0] + a[1] : n.op === "mul" ? a[0] * a[1] : n.op === "max" ? Math.max(a[0], a[1]) : w1Sig(a[0]);
        }
      });
      const loc = n => {
        const a = n.in.map(k => V[k]);
        return n.op === "add" ? [1, 1] : n.op === "mul" ? [a[1], a[0]] : n.op === "max" ? (a[0] >= a[1] ? [1, 0] : [0, 1]) : [V[n.id] * (1 - V[n.id])];
      };
      /* visszafelé: E[src>dst] = az élen visszajövő gradiens; Gr = összeg; contrib = a részösszegek sorrendben */
      const Gr = {}, E = {}, contrib = {}, rev = ops().slice().reverse();
      N.forEach(n => { Gr[n.id] = 0; contrib[n.id] = []; });
      let msg = "";
      if (bstep >= 1) { Gr[outN().id] = 1; }
      rev.forEach((n, k) => {
        if (bstep < k + 2) return;
        const d = loc(n), g = Gr[n.id];
        n.in.forEach((s, i) => { const e = d[i] * g; E[s + ">" + n.id] = e; Gr[s] += e; contrib[s].push(e); });
      });
      return { V, by, loc, Gr, E, contrib, rev };
    }
    const fo = () => outN().id;
    function stepMsg(R) {
      const { V, loc, Gr, contrib, rev } = R, o = fo(), opsL = ops();
      const dd = s => `∂${o}/∂${s}`;
      if (bstep >= 1) {
        if (bstep === 1) return `<b>Vissza, kezdés:</b> ${dd(o)} = 1 – a kimenet önmagára nézve 1-es gradienssel indul.`;
        const n = rev[bstep - 2], d = loc(n), g = Gr[n.id], [a, b] = n.in;
        let s = `<b>Vissza – ${CG_NAME[n.op]}</b> (${n.id} = ${expr(n)}), a kapott gradiens ${dd(n.id)} = ${fmt(g, 4)}. `;
        const pv = v => par(v, 4);
        if (n.op === "add") s += `Összeadás: a helyi derivált mindkét bemenetre 1, a gradiens változatlanul továbbmegy: → ${a}: ${fmt(g, 4)}, → ${b}: ${fmt(g, 4)}.`;
        if (n.op === "mul") s += `Szorzás: a gradiens a <i>másik</i> bemenet értékével szorzódik: → ${a}: ${b}·${pv(g)} = ${pv(V[b])}·${pv(g)} = ${fmt(d[0] * g, 4)}; → ${b}: ${a}·${pv(g)} = ${pv(V[a])}·${pv(g)} = ${fmt(d[1] * g, 4)}.`;
        if (n.op === "max") { const w = d[0] ? a : b, l = d[0] ? b : a; s += `Max: a gradiens csak a nagyobb bemenethez jut (${w} = ${fmt(V[w], 4)}): → ${w}: ${fmt(g, 4)}; → ${l}: 0.`; }
        if (n.op === "sig") s += `Szigmoid: a helyi derivált σ(${a})·(1 − σ(${a})) = ${fmt(V[n.id], 4)}·${fmt(1 - V[n.id], 4)} = ${fmt(d[0], 4)}, így → ${a}: ${fmt(d[0], 4)}·${pv(g)} = ${fmt(d[0] * g, 4)}.`;
        const fan = n.in.filter(s2 => contrib[s2].length > 1);
        fan.forEach(s2 => { s += ` <b>Elágazás:</b> ${s2} két helyre is ment, a gradiensek összeadódnak: ${contrib[s2].map(v => fmt(v, 4)).join(" + ")} = ${fmt(Gr[s2], 4)}.`; });
        if (bstep === nOps() + 1) s += `<br>Kész: ` + N.filter(m => !m.op).map(m => `${dd(m.id)} = <b>${fmt(Gr[m.id], 4)}</b>`).join(" · ");
        return s;
      }
      if (fstep === 0) return "Kezdés: csak a bemenetek értéke ismert. Nyomd meg az „Előre lépés” gombot!";
      const n = opsL[fstep - 1];
      let s = `<b>Előre:</b> ${n.id} = ${expr(n)} = ${expr(n, V)} = <b>${fmt(V[n.id], 4)}</b>`;
      if (fstep === nOps()) s += `. Az előre menet kész – most jöhet a „Vissza lépés”.`;
      return s;
    }
    function expr(n, V) {
      const a = n.in.map(k => (V ? (V[k] < 0 ? `(${fmt(V[k], 4)})` : fmt(V[k], 4)) : k));
      return n.op === "add" ? `${a[0]} + ${a[1]}` : n.op === "mul" ? `${a[0]}·${a[1]}` : n.op === "max" ? `max(${a[0]}, ${a[1]})` : `σ(${a[0]})`;
    }
    cv.draw = () => {
      const { ctx, w, h: hh } = cv, R = compute(), { V, Gr, E, contrib } = R;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const narrow = w < 520, fs = narrow ? 11 : 12, rad = narrow ? 15 : 18;
      const cF = css("--accent"), cB = css("--bad"), cT = css("--text"), cM = css("--muted");
      const maxC = Math.max(...N.map(n => n.c)), padL = narrow ? 26 : 34, padR = narrow ? 62 : 84;
      const pos = n => [padL + n.c * (w - padL - padR) / maxC, 22 + n.r * (hh - 50)];
      const opIdx = id => ops().findIndex(m => m.id === id);
      const shownV = n => !n.op || opIdx(n.id) < fstep;
      const curF = bstep === 0 && fstep > 0 ? ops()[fstep - 1].id : null;
      const curB = bstep >= 2 ? R.rev[bstep - 2].id : bstep === 1 ? fo() : null;
      const ext = n => (n.op ? rad : narrow ? 13 : 15);
      /* élek */
      N.filter(n => n.op).forEach(n => n.in.forEach(s => {
        const a = pos(R.by[s]), b = pos(n), L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
        const p0 = [a[0] + ux * ext(R.by[s]), a[1] + uy * ext(R.by[s])], p1 = [b[0] - ux * rad, b[1] - uy * rad];
        const hotB = curB === n.id, hotF = curF === n.id;
        arrow(ctx, p0[0], p0[1], p1[0], p1[1], hotB ? cB : hotF ? cF : rgba(cM, 0.8), hotB || hotF ? 2.4 : 1.5);
        const t = R.by[s].op ? 0.5 : 0.55, mx = p0[0] + t * (p1[0] - p0[0]), my = p0[1] + t * (p1[1] - p0[1]);
        if (shownV(R.by[s])) w1Text(ctx, fmt(V[s], 3), mx, my - 3, cF, "center", "bottom", `700 ${fs}px system-ui, sans-serif`);
        const e = E[s + ">" + n.id];
        if (e != null) w1Text(ctx, fmt(e, 3), mx, my + 3, cB, "center", "top", `700 ${fs}px system-ui, sans-serif`);
      }));
      /* kimeneti csonk */
      const o = outN(), po = pos(o), xe = w - 6;
      arrow(ctx, po[0] + rad, po[1], xe, po[1], rgba(cM, 0.8), 1.5);
      const mo = (po[0] + rad + xe) / 2;
      if (shownV(o)) w1Text(ctx, `${o.id} = ${fmt(V[o.id], 3)}`, mo, po[1] - 3, cF, "center", "bottom", `700 ${fs}px system-ui, sans-serif`);
      if (bstep >= 1) w1Text(ctx, "1", mo, po[1] + 3, cB, "center", "top", `700 ${fs}px system-ui, sans-serif`);
      /* csomópontok */
      N.forEach(n => {
        const [x, yy] = pos(n);
        if (!n.op) {
          const bw = narrow ? 26 : 30;
          w1RoundRect(ctx, x - bw / 2, yy - bw / 2 + 2, bw, bw - 4, 6, css("--bg-soft"), cT, 1.6);
          label(ctx, n.id, x, yy + 1, cT, "center", `700 ${fs + 2}px system-ui, sans-serif`, "middle");
          if (contrib[n.id].length && bstep >= 2) {
            const c = contrib[n.id];
            const txt = (c.length > 1 ? `${c.map(v => fmt(v, 3)).join(" + ")} = ` : "") + fmt(Gr[n.id], 3);
            w1Text(ctx, txt, x - bw / 2, yy + bw / 2 + 3, cB, "left", "top", `700 ${fs}px system-ui, sans-serif`);
          }
        } else {
          const hot = curB === n.id ? cB : curF === n.id ? cF : cT;
          dot(ctx, x, yy, rad, css("--card")); ring(ctx, x, yy, rad, hot, hot === cT ? 1.8 : 3);
          label(ctx, CG_SYM[n.op], x, yy + 1, cT, "center", n.op === "max" ? `700 ${fs}px system-ui, sans-serif` : `700 ${fs + 6}px system-ui, sans-serif`, "middle");
          w1Text(ctx, n.id, x, yy - rad - 3, cM, "center", "bottom", `italic 600 ${fs + 1}px system-ui, sans-serif`);
        }
      });
    };
    function sync() {
      gP.paint();
      setDis(bF, fstep >= nOps()); setDis(bB, fstep < nOps() || bstep > nOps());
      cv.draw();
      const R = compute();
      out.innerHTML = stepMsg(R) + `<br><span class="muted">előre: ${fstep}/${nOps()} csomópont · vissza: ${Math.max(0, bstep - 1)}/${nOps()} csomópont</span>`;
    }
    load();
  };

  /* ==================================================================
     10.5–10.9 – optimalizálók, jelterjedés, regularizáció, számjegytanítás
     (közös segédfüggvények w2_ előtaggal)
     ================================================================== */
  const W2_SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const w2_sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => W2_SUP[d]);
  const w2_pow10 = k => (k === 0 ? "1" : k === 1 ? "10" : "10" + w2_sup(k));
  /* szám tudományos alakban, ha nagyon kicsi vagy nagy: 3,4·10⁻⁵ */
  function w2_sci(x, d = 3) {
    if (!Number.isFinite(x)) return "—";
    const a = Math.abs(x);
    if (a === 0) return "0";
    if (a >= 0.001 && a < 1e5) return fmt(x, a >= 100 ? 1 : a >= 0.1 ? d : 2 - Math.floor(Math.log10(a)));
    let e = Math.floor(Math.log10(a)), m = x / 10 ** e;
    if (Math.abs(+m.toFixed(2)) >= 10) { e++; m /= 10; }
    return fmt(m, 2) + "·10" + w2_sup(e);
  }
  /* animációs ciklus (a 9. fejezet mintájára): csak látható widgetnél fut */
  function w2_anim(root, frame) {
    let on = false, vis = true, id = 0;
    const loop = () => { id = 0; if (!on || !vis) return; frame(); if (on) id = requestAnimationFrame(loop); };
    const kick = () => { if (on && vis && !id) id = requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; kick(); }).observe(root);
    return { start() { on = true; kick(); }, stop() { on = false; }, get running() { return on; } };
  }
  function w2_nice(span, n) {
    const t = span / Math.max(1, n), p = 10 ** Math.floor(Math.log10(t));
    for (const m of [1, 2, 5, 10]) if (m * p >= t - 1e-12) return m * p;
    return 10 * p;
  }
  /* grafikon-keret bal/alsó tengellyel, ráccsal, feliratokkal.
     V: { xmin, xmax, ymin, ymax, log (y-ban lg-értékek), xname, yname, yfmt, xint (egész x-jelölők) } */
  function w2_frame(cv, V) {
    const { ctx, w, h: hh } = cv, ml = V.log ? 38 : 40, mr = 10, mt = 18, mb = 20;
    const tx = x => ml + (x - V.xmin) / (V.xmax - V.xmin) * (w - ml - mr);
    const ty = y => hh - mb - (y - V.ymin) / (V.ymax - V.ymin) * (hh - mt - mb);
    ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
    let xs = w2_nice(V.xmax - V.xmin, Math.max(2, Math.floor((w - ml - mr) / 55)));
    if (V.xint) xs = Math.max(1, Math.round(xs));
    const ny = Math.max(2, Math.floor((hh - mt - mb) / 26));
    const ys = V.log ? Math.max(1, Math.ceil((V.ymax - V.ymin) / ny)) : w2_nice(V.ymax - V.ymin, ny);
    ctx.save();
    ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
    const X0 = Math.ceil(V.xmin / xs - 1e-9) * xs, Y0 = Math.ceil(V.ymin / ys - 1e-9) * ys;
    for (let x = X0; x <= V.xmax + 1e-9; x += xs) { ctx.moveTo(tx(x), mt); ctx.lineTo(tx(x), hh - mb); }
    for (let y = Y0; y <= V.ymax + 1e-9; y += ys) { ctx.moveTo(ml, ty(y)); ctx.lineTo(w - mr, ty(y)); }
    ctx.stroke();
    ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.moveTo(ml, mt - 6); ctx.lineTo(ml, hh - mb); ctx.lineTo(w - mr, hh - mb); ctx.stroke();
    ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted");
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let x = X0; x <= V.xmax + 1e-9; x += xs) if (tx(x) < w - mr - 8) ctx.fillText(fmt(x, 3), tx(x), hh - mb + 3);
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let y = Y0; y <= V.ymax + 1e-9; y += ys)
      ctx.fillText(V.log ? w2_pow10(Math.round(y)) : V.yfmt ? V.yfmt(y) : fmt(y, 3), ml - 4, ty(y));
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    if (V.yname) ctx.fillText(V.yname, ml + 5, 2);
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    if (V.xname) ctx.fillText(V.xname, w - mr, hh - mb - 3);
    ctx.restore();
    const clip = () => { ctx.beginPath(); ctx.rect(ml, mt - 6, w - ml - mr + 2, hh - mt - mb + 6); ctx.clip(); };
    return { tx, ty, clip, ml, mt, mb, mr };
  }
  /* jelmagyarázat a grafikon jobb felső sarkában: [[szöveg, szín, szaggatott?], …] */
  function w2_legend(cv, items, top = 4) {
    const { ctx, w } = cv;
    ctx.save(); ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "middle";
    let x = w - 10;
    for (let i = items.length - 1; i >= 0; i--) {
      const [t, c, dash] = items[i], tw = ctx.measureText(t).width;
      x -= tw; ctx.fillStyle = c; ctx.textAlign = "left"; ctx.fillText(t, x, top + 7);
      ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash(dash ? [4, 3] : []);
      ctx.beginPath(); ctx.moveTo(x - 20, top + 7); ctx.lineTo(x - 4, top + 7); ctx.stroke();
      x -= 30;
    }
    ctx.restore();
  }
  /* veszteség és pontosság egyetlen menetben (ugyanaz, mint net.loss és net.accuracy) */
  function w2_eval(net, X, Y) {
    let s = 0, ok = 0;
    for (let n = 0; n < X.length; n++) {
      const o = net.predict(X[n]);
      s += net.lossOf(o, net.target(Y[n], o.length));
      const c = net.out === "softmax" ? o.indexOf(Math.max(...o)) : (o[0] > 0.5 ? 1 : 0);
      if (c === Y[n]) ok++;
    }
    return [s / Math.max(1, X.length), ok / Math.max(1, X.length)];
  }
  const w2_lab = (txt, ...kids) => h("label", null, txt, ...kids);
  /* rögzített tizedesjegyszám (a záró nullák megmaradnak): 0,040 · 98,0% */
  const w2_fx = (x, d = 3) => { const t = x.toFixed(d); return (/^-0\.?0*$/.test(t) ? t.slice(1) : t).replace(".", ",").replace("-", "−"); };
  const w2_pc = (a, d = 1) => w2_fx(100 * a, d) + "%";

  /* ------------------------------------------------------------------
     10.5  optimizer-race – GD, momentum, RMSProp és Adam versenye 2D felületeken
     ------------------------------------------------------------------ */
  const OR_SURF = {
    bowl: {
      name: "hosszúkás tál", f: (x, y) => x * x + 3 * y * y, g: (x, y) => [2 * x, 6 * y],
      p0: [2, 1], min: [0, 0], view: [0, 0, 2.4, 1.4], eta: [0.1, 0.1], lv: [-2, 1.4], per: 3, formula: "L = x² + 3y²"
    },
    valley: {
      name: "keskeny völgy", f: (x, y) => 0.5 * (x * x + 25 * y * y), g: (x, y) => [x, 25 * y],
      p0: [-4, 1], min: [0, 0], view: [-1.2, 0, 3.4, 1.3], eta: [0.07, 0.1], lv: [-2, 2], per: 3, formula: "L = ½(x² + 25y²)"
    },
    rosen: {
      name: "Rosenbrock-völgy", f: (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2,
      g: (x, y) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)],
      p0: [-1.5, 2], min: [1, 1], view: [0, 1, 2, 2], eta: [0.001, 0.1], lv: [-1.5, 3.4], per: 2.5, formula: "L = (1 − x)² + 100(y − x²)²"
    }
  };
  const OR_M = [["gd", "GD", "--setA"], ["mom", "momentum", "--setB"], ["rms", "RMSProp", "--setC"], ["adam", "Adam", "--accent"]];
  /* η-értékek: 1–2–3–5–7-es lépcső 10⁻⁴ … 1 között (logaritmikus csúszka) */
  const OR_ETAS = (() => { const a = []; for (let e = -4; e < 0; e++) for (const m of [1, 2, 3, 5, 7]) a.push(+(m * 10 ** e).toPrecision(2)); a.push(1); return a; })();
  const OR_NMAX = 500;
  function or_contours(cv, T, f, levels, color) {
    const { ctx, w, h: hh } = cv, cell = 5, nx = Math.ceil(w / cell) + 1, ny = Math.ceil(hh / cell) + 1;
    const G = new Float64Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) G[j * nx + i] = Math.log10(Math.max(1e-300, f(T.ix(i * cell), T.iy(j * cell))));
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
    for (const lv of levels) {
      ctx.beginPath();
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = G[j * nx + i], b = G[j * nx + i + 1], c = G[(j + 1) * nx + i + 1], d = G[(j + 1) * nx + i];
        const x0 = i * cell, y0 = j * cell, e = [];
        const t = (p, q) => (lv - p) / (q - p);
        if ((a > lv) !== (b > lv)) e.push([x0 + cell * t(a, b), y0]);
        if ((b > lv) !== (c > lv)) e.push([x0 + cell, y0 + cell * t(b, c)]);
        if ((d > lv) !== (c > lv)) e.push([x0 + cell * t(d, c), y0 + cell]);
        if ((a > lv) !== (d > lv)) e.push([x0, y0 + cell * t(a, d)]);
        for (let k = 0; k + 1 < e.length; k += 2) { ctx.moveTo(e[k][0], e[k][1]); ctx.lineTo(e[k + 1][0], e[k + 1][1]); }
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  W["optimizer-race"] = root => {
    header(root, "Optimalizálók versenye a veszteségfelületen",
      "Négy módszer indul ugyanonnan a minimum felé: sima gradiens módszer (GD), momentum ($v \\leftarrow \\beta v + g$, $w \\leftarrow w - \\eta v$), " +
      "RMSProp ($s \\leftarrow \\rho s + (1-\\rho) g^2$, $w \\leftarrow w - \\eta\\, g/(\\sqrt{s}+\\varepsilon)$, $\\rho = 0{,}9$) és Adam ($\\beta_1 = 0{,}9$, $\\beta_2 = 0{,}999$). " +
      "Bal oldalt a szintvonalak (logaritmikus lépcsőkkel) és az utak, jobb oldalt a veszteség lépésenként, logaritmikus skálán. " +
      "Az RMSProp és az Adam lépésmérete nagyjából η, a gradiens nagyságától függetlenül – ezért kapnak külön η-t.");
    let surf = "bowl", eta = OR_SURF.bowl.eta.slice(), beta = 0.9, n = 0;
    const show = { gd: true, mom: true, rms: true, adam: true };
    let M = {};
    const gS = toggleGroup(Object.keys(OR_SURF).map(k => [k, OR_SURF[k].name]), () => surf, v => { surf = v; eta = OR_SURF[v].eta.slice(); beta = 0.9; reset(); });
    const cbs = OR_M.map(([k, name, col]) => {
      const c = checkbox(true, () => { show[k] = c.checked; draw(); });
      return [k, c, h("label", null, c, h("span", { style: `color:var(${col});font-weight:700` }, name))];
    });
    const sE = [0, 1].map(i => { const s = slider(0, OR_ETAS.length - 1, 1, 0); s.addEventListener("input", () => { eta[i] = OR_ETAS[+s.value]; reset(); }); return s; });
    const oE = [h("b"), h("b")];
    const gB = toggleGroup([["0.5", "0,5"], ["0.9", "0,9"], ["0.99", "0,99"]], () => String(beta), v => { beta = +v; reset(); });
    const bP = btn("▶ Indítás", () => { if (anim.running) anim.stop(); else { if (n >= OR_NMAX) reset(); anim.start(); } sync(); }, "btn primary");
    const bS = btn("1 lépés", () => { anim.stop(); if (n < OR_NMAX) stepAll(); sync(); });
    const bR = btn("↺ Újra", () => { anim.stop(); reset(); });
    const bX = btn("📖 A szöveg példája (10.5)", () => {
      anim.stop(); surf = "bowl"; eta = [0.1, OR_SURF.bowl.eta[1]]; beta = 0.5;
      Object.assign(show, { gd: true, mom: true, rms: false, adam: false });
      cbs.forEach(([k, c]) => (c.checked = show[k]));
      reset(false); for (let i = 0; i < 3; i++) stepAll(); sync();
    });
    root.append(h("div", { class: "controls" }, small("felület:"), gS.bs),
      h("div", { class: "controls" }, small("módszerek:"), cbs.map(c => c[2])),
      h("div", { class: "controls" }, w2_lab("η (GD, momentum): ", sE[0], oE[0]), w2_lab("η (RMSProp, Adam): ", sE[1], oE[1])),
      h("div", { class: "controls" }, small("β (momentum):"), gB.bs),
      h("div", { class: "controls" }, bP, bS, bR, bX));
    const [cv, cvL] = twoCanvas(root, 0.82, 0.82);
    const out = h("div", { class: "readout" });
    root.append(out);
    function mk() { const S = OR_SURF[surf]; return { p: S.p0.slice(), v: [0, 0], s: [0, 0], t: 0, path: [S.p0.slice()], loss: [S.f(...S.p0)], dead: 0 }; }
    function reset(doSync = true) {
      n = 0; M = {}; OR_M.forEach(([k]) => (M[k] = mk()));
      if (doSync) sync();
    }
    function stepOne(k) {
      const S = OR_SURF[surf], m = M[k];
      if (m.dead) return;
      const g = S.g(m.p[0], m.p[1]), lr = k === "gd" || k === "mom" ? eta[0] : eta[1];
      m.t++;
      for (let i = 0; i < 2; i++) {
        if (k === "gd") m.p[i] -= lr * g[i];
        else if (k === "mom") { m.v[i] = beta * m.v[i] + g[i]; m.p[i] -= lr * m.v[i]; }
        else if (k === "rms") { m.s[i] = 0.9 * m.s[i] + 0.1 * g[i] * g[i]; m.p[i] -= lr * g[i] / (Math.sqrt(m.s[i]) + 1e-8); }
        else {
          m.v[i] = 0.9 * m.v[i] + 0.1 * g[i]; m.s[i] = 0.999 * m.s[i] + 0.001 * g[i] * g[i];
          m.p[i] -= lr * (m.v[i] / (1 - 0.9 ** m.t)) / (Math.sqrt(m.s[i] / (1 - 0.999 ** m.t)) + 1e-8);
        }
      }
      const L = S.f(m.p[0], m.p[1]);
      if (!Number.isFinite(L) || L > 1e9 || Math.abs(m.p[0]) > 1e4 || Math.abs(m.p[1]) > 1e4) { m.dead = m.t; return; }
      m.path.push(m.p.slice()); m.loss.push(L);
    }
    function stepAll() { OR_M.forEach(([k]) => stepOne(k)); n++; }
    const anim = w2_anim(root, () => {
      for (let i = 0; i < 2 && n < OR_NMAX; i++) stepAll();
      if (n >= OR_NMAX) anim.stop();
      sync();
    });
    function draw() {
      const S = OR_SURF[surf], [cx, cy, hx, hy] = S.view;
      const V = eqView(cv, cx, cy, hx, hy, { xname: "x", yname: "y" });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      const levels = [];
      for (let k = Math.ceil(S.lv[0] * S.per); k <= S.lv[1] * S.per; k++) levels.push(k / S.per);
      or_contours(cv, T, S.f, levels, rgba(css("--muted"), 0.42));
      const [mx, my] = [T.tx(S.min[0]), T.ty(S.min[1])], tc = css("--text");
      ctx.save(); ctx.strokeStyle = tc; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mx - 5, my - 5); ctx.lineTo(mx + 5, my + 5); ctx.moveTo(mx + 5, my - 5); ctx.lineTo(mx - 5, my + 5); ctx.stroke(); ctx.restore();
      label(ctx, "minimum", mx + 7, my - 4, css("--muted"), "left", "600 11px system-ui, sans-serif");
      dot(ctx, T.tx(S.p0[0]), T.ty(S.p0[1]), 5, tc, true, 2);
      label(ctx, "start", T.tx(S.p0[0]) + 7, T.ty(S.p0[1]) - 4, css("--muted"), "left", "600 11px system-ui, sans-serif");
      OR_M.forEach(([k, , cvar]) => {
        if (!show[k]) return;
        const m = M[k], col = css(cvar);
        polyline(ctx, T, m.path, col, 2);
        if (m.path.length < 80) m.path.forEach(([x, y]) => dot(ctx, T.tx(x), T.ty(y), 2.6, col));
        const [x, y] = m.path[m.path.length - 1];
        dot(ctx, T.tx(x), T.ty(y), 6, css("--card")); dot(ctx, T.tx(x), T.ty(y), 4.5, col);
      });
      label(ctx, S.formula, 8, cv.h - 6, css("--text"), "left", "600 12px system-ui, sans-serif");
      /* veszteség lépésenként, logaritmikus y */
      const vis = OR_M.filter(([k]) => show[k]).map(([k]) => M[k]);
      const lg = v => Math.log10(Math.max(1e-12, v));
      let lo = 0, hi = 1;
      if (vis.length) { const all = vis.flatMap(m => m.loss.map(lg)); lo = Math.floor(Math.min(...all)); hi = Math.ceil(Math.max(...all)); }
      if (hi - lo < 2) lo = hi - 2;
      const T2 = w2_frame(cvL, { xmin: 0, xmax: Math.max(10, Math.ceil(n / 10) * 10), ymin: lo, ymax: hi, log: true, xname: "lépés", yname: "L (log)", xint: true });
      cvL.ctx.save(); T2.clip();
      OR_M.forEach(([k, , cvar]) => {
        if (!show[k]) return;
        const m = M[k], col = css(cvar);
        polyline(cvL.ctx, T2, m.loss.map((v, i) => [i, lg(v)]), col, 2);
        if (m.loss.length < 30) m.loss.forEach((v, i) => dot(cvL.ctx, T2.tx(i), T2.ty(lg(v)), 2.6, col));
        if (m.dead) { const i = m.loss.length - 1; label(cvL.ctx, "✕ szétszállt", T2.tx(i) + 4, T2.ty(lg(m.loss[i])) - 2, col, "left", "700 11px system-ui, sans-serif"); }
      });
      cvL.ctx.restore();
    }
    cv.draw = cvL.draw = () => draw();
    const pt = p => `(${fmt(p[0], 3)}; ${fmt(p[1], 3)})`;
    function sync() {
      gS.paint(); gB.paint();
      [0, 1].forEach(i => { sE[i].value = OR_ETAS.indexOf(eta[i]); oE[i].textContent = fmt(eta[i], 4); });
      bP.textContent = anim.running ? "⏸ Szünet" : "▶ Indítás";
      draw();
      const lines = OR_M.filter(([k]) => show[k]).map(([k, name, cvar]) => {
        const m = M[k], L = m.loss[m.loss.length - 1];
        const head = `<span style="color:var(${cvar});font-weight:700">${name}</span>: `;
        if (m.dead) return head + `<b>szétszállt</b> a(z) ${m.dead}. lépésben (túl nagy η)`;
        const path = n <= 5 ? m.path.map(pt).join(" → ") + " · " : `hely: ${pt(m.p)} · `;
        return head + path + `L = <b>${w2_sci(L)}</b>`;
      });
      out.innerHTML = `lépés: <b>${n}</b> / ${OR_NMAX} · ${OR_SURF[surf].name}, minimum: L = 0` +
        (show.mom ? ` · momentum β = ${fmt(beta, 2)}` : "") + "<br>" + (lines.length ? lines.join("<br>") : "Kapcsolj be legalább egy módszert!");
    }
    reset();
  };

  /* ------------------------------------------------------------------
     10.6  deep-signal – a jel és a gradiens nagysága egy mély hálóban
     ------------------------------------------------------------------ */
  const DS_INIT = [["0.5", "túl kicsi (c = 0,5)"], ["1", "Xavier/LeCun (c = 1)"], [String(Math.SQRT2), "He (c = √2)"], ["2", "túl nagy (c = 2)"]];
  const DS_B = 200, DS_LMAX = 50;
  W["deep-signal"] = root => {
    header(root, "Jel és gradiens egy mély hálóban",
      "Egy $L$ rétegű, $n$ széles teljesen összekötött háló (torzítás nélkül), a súlyok $\\mathcal N(0,\\ \\sigma^2)$ eloszlásúak, $\\sigma = c/\\sqrt{n}$. " +
      "Bemenet: 200 véletlen (standard normális) vektor. <b>Bal oldalt</b> az aktivációk szórása rétegenként (előre irányuló menet), " +
      "<b>jobb oldalt</b> a veszteség gradiensének szórása az egyes rétegek $z$-jére (visszafelé, a kimenetre adott véletlen gradiensből indulva). " +
      "Mindkét tengely függőlegesen logaritmikus: az egyenes vonal rétegenként azonos szorzót jelent.");
    let act = "relu", c = 1, L = 20, n = 100, ln = false, seed = 1;
    let res = null, wCache = { n: 0, Wg: [] };
    const gA = toggleGroup([["tanh", "tanh"], ["relu", "ReLU"]], () => act, v => { act = v; schedule(); });
    const gI = toggleGroup(DS_INIT, () => String(c), v => { c = +v; schedule(); });
    const sC = slider(0.2, 3, 0.01, c), oC = h("b"), sL = slider(1, DS_LMAX, 1, L), oL = h("b"), sN = slider(20, 200, 10, n), oN = h("b");
    sC.addEventListener("input", () => { c = +sC.value; schedule(); });
    /* a mélység és a szélesség drága: húzás közben csak a feliratot frissítjük, elengedéskor számolunk */
    sL.addEventListener("input", () => { L = +sL.value; syncCtl(); });
    sN.addEventListener("input", () => { n = +sN.value; syncCtl(); });
    sL.addEventListener("change", () => { L = +sL.value; schedule(); });
    sN.addEventListener("change", () => { n = +sN.value; schedule(); });
    const cLN = checkbox(false, () => { ln = cLN.checked; schedule(); });
    root.append(h("div", { class: "controls" }, small("aktiváció:"), gA.bs),
      h("div", { class: "controls" }, small("kezdősúlyok:"), gI.bs),
      h("div", { class: "controls" }, w2_lab("c: ", sC, oC), w2_lab("mélység L: ", sL, oL), w2_lab("szélesség n: ", sN, oN)),
      h("div", { class: "controls" }, h("label", null, cLN, "rétegnormalizálás (minden minta z-jét 0 átlagúra és 1 szórásúra igazítjuk)"),
        btn("🎲 Új minta", () => { seed++; schedule(); })));
    const [cvA, cvG] = twoCanvas(root, 0.78, 0.78);
    const out = h("div", { class: "readout" });
    root.append(out);
    /* standard normális súlyok rétegenként: rétegenként egy 200 × 200-as készlet, ennek bal felső n × n-es
       része a súlymátrix (gyorsítótárazva; c csak skáláz) */
    const pool = [];
    function weights(l) {
      while (pool.length <= l) {
        const r = ML.rng(7000 + pool.length), P = new Float64Array(200 * 200);
        for (let i = 0; i < P.length; i++) P[i] = ML.gauss(r);
        pool.push(P);
      }
      if (wCache.n !== n) wCache = { n, Wg: [] };
      while (wCache.Wg.length <= l) {
        const P = pool[wCache.Wg.length], M = new Float64Array(n * n);
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) M[j * n + i] = P[j * 200 + i];
        wCache.Wg.push(M);
      }
      return wCache.Wg[l];
    }
    function std(a) { let s = 0, q = 0; for (let i = 0; i < a.length; i++) { s += a[i]; q += a[i] * a[i]; } const m = s / a.length; return Math.sqrt(Math.max(0, q / a.length - m * m)); }
    function compute() {
      const B = DS_B, s = c / Math.sqrt(n), relu = act === "relu";
      const r = ML.rng(seed), X = new Float64Array(n * B);
      for (let i = 0; i < X.length; i++) X[i] = ML.gauss(r);
      const As = [X], Zh = [], sig = [], aStd = [std(X)];
      let a = X;
      for (let l = 0; l < L; l++) {
        const M = weights(l), z = new Float64Array(n * B);
        for (let j = 0; j < n; j++) {
          const zr = j * B;
          for (let i = 0; i < n; i++) { const w = s * M[j * n + i]; if (w === 0) continue; const ar = i * B; for (let b = 0; b < B; b++) z[zr + b] += w * a[ar + b]; }
        }
        let sg = null;
        if (ln) {                                   /* minden minta (oszlop) z-jét normalizáljuk */
          sg = new Float64Array(B);
          for (let b = 0; b < B; b++) {
            let m = 0, q = 0;
            for (let j = 0; j < n; j++) m += z[j * B + b];
            m /= n;
            for (let j = 0; j < n; j++) { const d = z[j * B + b] - m; q += d * d; }
            const sd = Math.sqrt(q / n + 1e-300);
            sg[b] = sd;
            for (let j = 0; j < n; j++) z[j * B + b] = (z[j * B + b] - m) / sd;
          }
        }
        const an = new Float64Array(n * B);
        for (let k = 0; k < an.length; k++) an[k] = relu ? (z[k] > 0 ? z[k] : 0) : Math.tanh(z[k]);
        Zh.push(z); sig.push(sg); As.push(an); aStd.push(std(an)); a = an;
      }
      /* visszafelé: g = ∂/∂a_L véletlen; δ_l = g ⊙ f'(ẑ) (rétegnormánál még a normalizálás deriváltja), g ← σ·Wᵀδ */
      const r2 = ML.rng(seed + 1);
      let g = new Float64Array(n * B);
      for (let i = 0; i < g.length; i++) g[i] = ML.gauss(r2);
      const gStd = new Array(L + 1).fill(NaN);
      for (let l = L - 1; l >= 0; l--) {
        const z = Zh[l], an = As[l + 1], d = new Float64Array(n * B);
        for (let k = 0; k < d.length; k++) d[k] = g[k] * (relu ? (z[k] > 0 ? 1 : 0) : 1 - an[k] * an[k]);
        if (ln) {
          const sg = sig[l];
          for (let b = 0; b < B; b++) {
            let m1 = 0, m2 = 0;
            for (let j = 0; j < n; j++) { m1 += d[j * B + b]; m2 += d[j * B + b] * z[j * B + b]; }
            m1 /= n; m2 /= n;
            for (let j = 0; j < n; j++) d[j * B + b] = (d[j * B + b] - m1 - z[j * B + b] * m2) / sg[b];
          }
        }
        gStd[l + 1] = std(d);
        if (l === 0) break;
        const M = weights(l), gn = new Float64Array(n * B);
        for (let j = 0; j < n; j++) {
          const dr = j * B;
          for (let i = 0; i < n; i++) { const w = s * M[j * n + i]; if (w === 0) continue; const gr = i * B; for (let b = 0; b < B; b++) gn[gr + b] += w * d[dr + b]; }
        }
        g = gn;
      }
      res = { aStd, gStd, L, c, act, ln, n };
    }
    let pend = 0;
    function schedule() { syncCtl(); if (!pend) pend = requestAnimationFrame(() => { pend = 0; compute(); sync(); }); }
    const lg = v => (v > 0 ? Math.log10(v) : -300);
    function plotLog(cv, pts, col, yname, xmin) {
      const ys = pts.map(p => p[1]).filter(Number.isFinite);
      let lo = Math.floor(Math.min(-1, ...ys) - 0.05), hi = Math.ceil(Math.max(1, ...ys) + 0.05);
      lo = Math.max(lo, -300);
      const T = w2_frame(cv, { xmin, xmax: Math.max(xmin + 2, res.L), ymin: lo, ymax: hi, log: true, xname: "réteg", yname, xint: true });
      const { ctx } = cv;
      ctx.save(); T.clip();
      polyline(ctx, T, [[xmin, 0], [res.L, 0]], css("--muted"), 1.2, [5, 4]);
      polyline(ctx, T, pts, col, 2.4);
      if (pts.length <= 60) pts.forEach(([x, y]) => dot(ctx, T.tx(x), T.ty(y), 3, col));
      ctx.restore();
    }
    function draw() {
      if (!res) return;
      plotLog(cvA, res.aStd.map((v, l) => [l, lg(v)]), css("--accent"), "aktivációk szórása", 0);
      plotLog(cvG, res.gStd.slice(1).map((v, l) => [l + 1, lg(v)]), css("--setB"), "gradiens szórása (∂/∂z)", 1);
    }
    cvA.draw = cvG.draw = () => draw();
    function syncCtl() {
      gA.paint(); gI.paint(); sC.value = c; oC.textContent = fmt(c, 2) + ` (σ = ${fmt(c / Math.sqrt(n), 3)})`;
      sL.value = L; oL.textContent = String(L); sN.value = n; oN.textContent = String(n); cLN.checked = ln;
    }
    function sync() {
      syncCtl(); draw();
      const { aStd, gStd } = res, aL = aStd[res.L], g1 = gStd[1], gL = gStd[res.L];
      const fac = Math.pow(aL / aStd[0], 1 / res.L);
      const bad = v => !(v > 1e-30 && v < 1e30);
      out.innerHTML = `aktivációk szórása – bemenet: <b>${w2_sci(aStd[0])}</b>, ${res.L}. (utolsó) réteg: <b>${w2_sci(aL)}</b> · rétegenként átlagosan <b>×${w2_sci(fac)}</b>` +
        `<br>gradiens szórása – ${res.L}. réteg: <b>${w2_sci(gL)}</b>, 1. réteg: <b>${w2_sci(g1)}</b> · arány (1. / ${res.L}.): <b>${w2_sci(g1 / gL)}</b>` +
        (bad(aL) || bad(g1) ? `<br><span class="muted">A jel ${aL < 1 || g1 < 1 ? "gyakorlatilag eltűnt" : "elszállt"} – ezzel a kezdéssel a háló nem tanítható.</span>` : "");
    }
    schedule();
  };

  /* ------------------------------------------------------------------
     10.7  train-monitor – túltanulás, L2, dropout, korai leállítás
     ------------------------------------------------------------------ */
  const TM_EMAX = 600, TM_PAT = 30, TM_NOISE = 0.25, TM_N = 30;
  W["train-monitor"] = root => {
    header(root, "Túltanulás élőben: tanító és validációs veszteség",
      `Kevés (${TM_N}), zajos tanítópont, nagy háló (2–32–32–1, ReLU, Adam, η = 0,01, 10-es kötegek). ` +
      "Bal oldalt a döntési térkép: telt pontok a tanítóadatok, halvány pontok a 300 validációs pont. " +
      "Jobb oldalt a két veszteség epochonként; a zöld függőleges vonal a legkisebb validációs veszteség helye. " +
      "Próbáld ki regularizáció nélkül, aztán L2-büntetéssel ($\\lambda$), dropouttal, illetve korai leállítással (türelem: 30 epoch).");
    let l2 = 0, dropout = 0, early = false, seed = 2;
    let tr, va, net, rnd, epoch, hist, best, stopped, last;
    const gL = toggleGroup([["0", "0"], ["0.001", "0,001"], ["0.01", "0,01"], ["0.03", "0,03"]], () => String(l2), v => { l2 = +v; anim.stop(); reset(); });
    const gD = toggleGroup([["0", "0"], ["0.2", "0,2"], ["0.5", "0,5"]], () => String(dropout), v => { dropout = +v; anim.stop(); reset(); });
    const cE = checkbox(false, () => { early = cE.checked; anim.stop(); reset(); });
    const bP = btn("▶ Tanítás", () => { if (anim.running) anim.stop(); else { if (stopped) reset(); anim.start(); } sync(); }, "btn primary");
    root.append(h("div", { class: "controls" }, small("L2-büntetés λ:"), gL.bs),
      h("div", { class: "controls" }, small("dropout p:"), gD.bs),
      h("div", { class: "controls" }, h("label", null, cE, `korai leállítás (türelem: ${TM_PAT} epoch)`)),
      h("div", { class: "controls" }, bP, btn("↺ Újra", () => { anim.stop(); reset(); }), btn("🎲 Új adat", () => { anim.stop(); seed++; newData(); })));
    const [cv, cvL] = twoCanvas(root, 0.82, 0.82);
    const out = h("div", { class: "readout" });
    root.append(out);
    const copyW = () => ({ W: net.W.map(M => M.map(r => r.slice())), b: net.b.map(v => v.slice()) });
    function newData() {
      tr = ML.data.moons(TM_N, seed, TM_NOISE); va = ML.data.moons(300, seed + 5000, TM_NOISE);
      reset();
    }
    function reset() {
      net = new ML.MLP([2, 32, 32, 1], { act: "relu", out: "sigmoid", seed: 1 }); rnd = ML.rng(seed + 100);
      epoch = 0; stopped = "";
      const et = w2_eval(net, tr.X, tr.y), ev = w2_eval(net, va.X, va.y);
      hist = [[et[0], ev[0]]]; last = { et, ev };
      best = { lv: ev[0], e: 0, ...copyW() };
      sync();
    }
    function trainEpoch() {
      net.epoch(tr.X, tr.y, { batch: 10, lr: 0.01, opt: "adam", l2, dropout, rnd });
      epoch++;
      const lt = net.loss(tr.X, tr.y), lv = net.loss(va.X, va.y);
      hist.push([lt, lv]);
      if (lv < best.lv) best = { lv, e: epoch, ...copyW() };
      if (early && epoch - best.e >= TM_PAT) {
        net.W = best.W.map(M => M.map(r => r.slice())); net.b = best.b.map(v => v.slice());
        stopped = "early";
      } else if (epoch >= TM_EMAX) stopped = "max";
    }
    const anim = w2_anim(root, () => {
      for (let k = 0; k < 4 && !stopped; k++) trainEpoch();
      if (stopped) anim.stop();
      last = { et: w2_eval(net, tr.X, tr.y), ev: w2_eval(net, va.X, va.y) };
      sync();
    });
    function draw() {
      const V = eqView(cv, 0, 0, 1.05, 0.92, { xname: "x₁", yname: "x₂", labels: false });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      decisionMap(cv, T, V, (p, q) => net.predict([p, q])[0], 5, 0.24);
      const r = cv.w < 300 ? 3.2 : 4.2;
      va.X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), r * 0.55, rgba(va.y[i] ? C1() : C0(), 0.7)));
      tr.X.forEach((p, i) => { dot(ctx, T.tx(p[0]), T.ty(p[1]), r + 1.3, css("--card")); dot(ctx, T.tx(p[0]), T.ty(p[1]), r, tr.y[i] ? C1() : C0()); });
      /* veszteséggörbék */
      const top = Math.max(0.8, ...hist.map(v => Math.min(2, Math.max(v[0], v[1]))));
      const xmax = Math.max(100, Math.ceil(epoch / 100) * 100);
      const T2 = w2_frame(cvL, { xmin: 0, xmax, ymin: 0, ymax: top * 1.05, xname: "epoch", yname: "veszteség", xint: true });
      const c2 = cvL.ctx, step = Math.max(1, Math.floor(hist.length / 400));
      c2.save(); T2.clip();
      if (best.e > 0) {
        polyline(c2, T2, [[best.e, 0], [best.e, top * 1.05]], css("--setC"), 1.6, [5, 4]);
        label(c2, `legjobb: ${best.e}.`, T2.tx(best.e) + 4, T2.mt + 22, css("--setC"), "left", "600 11px system-ui, sans-serif");
      }
      const pts = j => hist.map((v, i) => [i, v[j]]).filter((_, i) => i % step === 0 || i === hist.length - 1);
      polyline(c2, T2, pts(0), css("--accent"), 2);
      polyline(c2, T2, pts(1), css("--setB"), 2.2, [6, 3]);
      if (hist.length === 1) { dot(c2, T2.tx(0), T2.ty(hist[0][0]), 3.5, css("--accent")); dot(c2, T2.tx(0), T2.ty(hist[0][1]), 3.5, css("--setB")); }
      c2.restore();
      w2_legend(cvL, [["tanító", css("--accent")], ["validációs", css("--setB"), true]]);
    }
    cv.draw = cvL.draw = () => draw();
    function sync() {
      gL.paint(); gD.paint(); cE.checked = early;
      bP.textContent = anim.running ? "⏸ Leállítás" : "▶ Tanítás";
      draw();
      const { et, ev } = last;
      const st = stopped === "early" ? `<br><b>Korai leállítás</b> a(z) ${epoch}. epochban: ${TM_PAT} epoch óta nem javult a validációs veszteség – visszaállítottuk a(z) ${best.e}. epoch súlyait (a fenti értékek már ezekre vonatkoznak).`
        : stopped === "max" ? `<br><span class="muted">Elértük a ${TM_EMAX} epochot.</span>` : "";
      out.innerHTML = `epoch: <b>${epoch}</b> · veszteség – tanító: <b>${w2_fx(et[0], 3)}</b>, validációs: <b>${w2_fx(ev[0], 3)}</b>` +
        ` · legjobb validációs: <b>${w2_fx(best.lv, 3)}</b> (${best.e}. epoch)` +
        `<br>pontosság – tanító: <b>${w2_pc(et[1], 0)}</b>, validációs: <b>${w2_pc(ev[1], 1)}</b>` + st;
    }
    newData();
  };

  /* ------------------------------------------------------------------
     10.9  digit-trainer – 64–h–10-es háló tanítása a böngészőben (digits)
     ------------------------------------------------------------------ */
  const DT_OPT = [["sgd", "SGD", 0.1], ["momentum", "momentum", 0.05], ["rmsprop", "RMSProp", 0.003], ["adam", "Adam", 0.01]];
  const DT_INIT = [["auto", "He (alap)"], ["zero", "nulla"], ["1", "túl nagy (σ = 1)"]];
  let dt_cache = null;
  function dt_data() {
    if (dt_cache) return dt_cache;
    const D = window.DIGITS10;
    const dec = p => {
      const X = [];
      for (let i = 0; i < p.n; i++) { const r = new Array(64); for (let j = 0; j < 64; j++) r[j] = (p.X.charCodeAt(i * 64 + j) - 97) / 16; X.push(r); }
      return { X, y: [...p.y].map(Number) };
    };
    dt_cache = { train: dec(D.train), val: dec(D.val), test: dec(D.test) };
    return dt_cache;
  }
  W["digit-trainer"] = root => {
    header(root, "Tanítsd be te: számjegyfelismerő a böngészőben",
      "Egy 64–h–10-es hálót (ReLU rejtett réteg, softmax kimenet, keresztentrópia) tanítunk 1047 kézzel írt 8 × 8-as számjegyen; " +
      "300 kép a validáció, 450 a teszt. Állítsd be az optimalizálót, a köteg méretét, a regularizációt és a kezdősúlyokat, majd indítsd. " +
      "Bal oldalt a veszteség, jobb oldalt a pontosság epochonként; a zöld vonal a legkisebb validációs veszteség epochja. A végén a teszt pontosság.");
    if (!window.DIGITS10) { root.append(h("p", { class: "muted" }, "Az adatok nem töltődtek be (digits-data.js).")); return; }
    const D = dt_data();
    let hid = 16, opt = "adam", mult = 1, batch = 32, dropout = 0, l2 = 0, init = "auto", ntrain = 1047, epochs = 30, seed = 1;
    let net, rnd, T, epoch, hist, done, testAcc, wrong, lr;
    const re = () => { anim.stop(); build(); };
    const gH = toggleGroup([["4", "4"], ["16", "16"], ["64", "64"]], () => String(hid), v => { hid = +v; re(); });
    const gO = toggleGroup(DT_OPT.map(([k, n, e]) => [k, `${n} (η = ${fmt(e, 3)})`]), () => opt, v => { opt = v; re(); });
    const gM = toggleGroup([["0.1", "×0,1"], ["1", "×1"], ["10", "×10"]], () => String(mult), v => { mult = +v; re(); });
    const gB = toggleGroup([["1", "1"], ["8", "8"], ["16", "16"], ["32", "32"], ["128", "128"], ["1047", "teljes"]], () => String(batch), v => { batch = +v; re(); });
    const gD = toggleGroup([["0", "0"], ["0.2", "0,2"], ["0.5", "0,5"]], () => String(dropout), v => { dropout = +v; re(); });
    const gL = toggleGroup([["0", "0"], ["0.001", "0,001"], ["0.01", "0,01"]], () => String(l2), v => { l2 = +v; re(); });
    const gI = toggleGroup(DT_INIT, () => String(init), v => { init = v === "1" ? 1 : v; re(); });
    const gN = toggleGroup([["100", "100"], ["200", "200"], ["1047", "mind (1047)"]], () => String(ntrain), v => { ntrain = +v; re(); });
    const sE = slider(10, 150, 10, epochs), oE = h("b"), oS = h("b");
    sE.addEventListener("input", () => { epochs = +sE.value; if (epoch < epochs) done = false; else if (!done) finish(); sync(); });
    const bP = btn("▶ Tanítás", () => { if (anim.running) anim.stop(); else { if (done) build(); anim.start(); } sync(); }, "btn primary");
    const bO = btn("Túltanulás-kísérlet", () => {
      hid = 64; ntrain = 100; opt = "adam"; mult = 1; batch = 16; dropout = 0; l2 = 0; init = "auto"; epochs = 150; re();
    });
    const bA = btn("Alapbeállítás", () => {
      hid = 16; ntrain = 1047; opt = "adam"; mult = 1; batch = 32; dropout = 0; l2 = 0; init = "auto"; epochs = 30; seed = 1; re();
    });
    root.append(
      h("div", { class: "controls" }, small("optimalizáló:"), gO.bs),
      h("div", { class: "controls" }, small("η szorzója:"), gM.bs, small("köteg:"), gB.bs),
      h("div", { class: "controls" }, small("rejtett neuronok h:"), gH.bs, small("tanítóképek:"), gN.bs),
      h("div", { class: "controls" }, small("dropout:"), gD.bs, small("L2 λ:"), gL.bs),
      h("div", { class: "controls" }, small("kezdősúlyok:"), gI.bs),
      h("div", { class: "controls" }, w2_lab("epochok: ", sE, oE), h("span", { style: "display:inline-flex;gap:.4rem;align-items:center" }, small("mag:"), btn("−", () => { if (seed > 1) { seed--; re(); } }), oS, btn("+", () => { seed++; re(); }))),
      h("div", { class: "controls" }, bP, btn("↺ Újra", re), bO, bA));
    const [cvL, cvA] = twoCanvas(root, 0.78, 0.78);
    const boxM = h("div", { style: "display:none;margin-top:.5rem" });
    root.append(boxM);
    boxM.append(h("div", { class: "muted", style: "font-size:.88rem;margin-bottom:.25rem" }, "Néhány tévesztett tesztkép (valódi → tipp):"));
    const cvM = Calc.canvas(boxM, 0.16, 760);
    const out = h("div", { class: "readout" });
    root.append(out);
    function build() {
      T = ntrain < 1047 ? { X: D.train.X.slice(0, ntrain), y: D.train.y.slice(0, ntrain) } : D.train;
      lr = DT_OPT.find(o => o[0] === opt)[2] * mult;
      net = new ML.MLP([64, hid, 10], { act: "relu", out: "softmax", seed, init });
      rnd = ML.rng(seed + 100);
      epoch = 0; done = false; testAcc = null; wrong = [];
      hist = [[...w2_eval(net, T.X, T.y), ...w2_eval(net, D.val.X, D.val.y)]];
      boxM.style.display = "none";
      sync();
    }
    function finish() {
      done = true;
      testAcc = w2_eval(net, D.test.X, D.test.y)[1];
      const bad = [];
      D.test.X.forEach((x, i) => { const o = net.predict(x), p = o.indexOf(Math.max(...o)); if (p !== D.test.y[i]) bad.push([i, p]); });
      wrong = ML.shuffle(bad, ML.rng(seed + 3)).slice(0, 8);
    }
    const anim = w2_anim(root, () => {
      const t0 = performance.now();
      while (epoch < epochs) {
        net.epoch(T.X, T.y, { batch, lr, opt, l2, dropout, rnd });
        epoch++;
        hist.push([...w2_eval(net, T.X, T.y), ...w2_eval(net, D.val.X, D.val.y)]);
        if (performance.now() - t0 >= 25) break;
      }
      if (epoch >= epochs) { finish(); anim.stop(); }
      sync();
    });
    const bestE = () => hist.reduce((b, v, i) => (v[2] < hist[b][2] ? i : b), 0);
    const ink = () => hexRGB(css("--text")), bgc = () => hexRGB(css("--card"));
    function draw() {
      const xmax = Math.max(epochs, epoch), be = bestE(), step = Math.max(1, Math.floor(hist.length / 300));
      const top = Math.max(0.5, ...hist.map(v => Math.min(3, Math.max(v[0], v[2]))));
      const sel = j => hist.map((v, i) => [i, v[j]]).filter((_, i) => i % step === 0 || i === hist.length - 1);
      const T1 = w2_frame(cvL, { xmin: 0, xmax, ymin: 0, ymax: top * 1.05, xname: "epoch", yname: "veszteség", xint: true });
      const c1 = cvL.ctx;
      c1.save(); T1.clip();
      if (be > 0) polyline(c1, T1, [[be, 0], [be, top * 1.05]], css("--setC"), 1.6, [5, 4]);
      polyline(c1, T1, sel(0), css("--accent"), 2);
      polyline(c1, T1, sel(2), css("--setB"), 2.2, [6, 3]);
      if (hist.length === 1) { dot(c1, T1.tx(0), T1.ty(hist[0][0]), 3.5, css("--accent")); dot(c1, T1.tx(0), T1.ty(hist[0][2]), 3.5, css("--setB")); }
      c1.restore();
      w2_legend(cvL, [["tanító", css("--accent")], ["validációs", css("--setB"), true]]);
      const T2 = w2_frame(cvA, { xmin: 0, xmax, ymin: 0, ymax: 1, xname: "epoch", yname: "pontosság", xint: true, yfmt: y => fmt(100 * y, 0) + "%" });
      const c2 = cvA.ctx;
      c2.save(); T2.clip();
      if (be > 0) polyline(c2, T2, [[be, 0], [be, 1]], css("--setC"), 1.6, [5, 4]);
      polyline(c2, T2, sel(1), rgba(css("--accent"), 0.5), 1.8);
      polyline(c2, T2, sel(3), css("--setB"), 2.4);
      c2.restore();
      w2_legend(cvA, [["tanító", rgba(css("--accent"), 0.6)], ["validációs", css("--setB")]], cvA.h - 52);
    }
    cvL.draw = cvA.draw = () => draw();
    cvM.draw = () => {
      if (!wrong.length) return;
      const { ctx, w, h: hh } = cvM, cell = w / 8, sz = Math.min(cell - 10, hh - 20), px = sz / 8, a = ink(), b = bgc();
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      wrong.forEach(([i, p], k) => {
        const x0 = k * cell + (cell - sz) / 2, x = D.test.X[i];
        for (let q = 0; q < 64; q++) {
          const t = x[q];
          ctx.fillStyle = `rgb(${b.map((v, j) => Math.round(v + (a[j] - v) * t)).join(",")})`;
          ctx.fillRect(x0 + (q % 8) * px, 2 + Math.floor(q / 8) * px, px + 0.5, px + 0.5);
        }
        ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(x0, 2, sz, sz); ctx.restore();
        label(ctx, `${D.test.y[i]} → ${p}`, x0 + sz / 2, 2 + sz + 15, css("--text"), "center", "700 12px system-ui, sans-serif");
      });
    };
    function sync() {
      gH.paint(); gO.paint(); gM.paint(); gB.paint(); gD.paint(); gL.paint(); gI.paint(); gN.paint();
      sE.value = epochs; oE.textContent = String(epochs); oS.textContent = String(seed);
      bP.textContent = anim.running ? "⏸ Leállítás" : "▶ Tanítás";
      draw();
      const v = hist[epoch], be = bestE();
      if (done && wrong.length) { const was = boxM.style.display; boxM.style.display = ""; if (was === "none") cvM.resize(); cvM.draw(); }
      else boxM.style.display = "none";
      out.innerHTML = `epoch: <b>${epoch}</b> / ${epochs} · η = ${fmt(lr, 4)} · köteg: ${batch >= T.X.length ? "teljes (" + T.X.length + ")" : batch} · paraméterek: ${net.nParams}` +
        `<br>veszteség – tanító: <b>${w2_fx(v[0], 3)}</b>, validációs: <b>${w2_fx(v[2], 3)}</b> · pontosság – tanító: <b>${w2_pc(v[1], 1)}</b>, validációs: <b>${w2_pc(v[3], 1)}</b>` +
        (epoch > 0 ? `<br>legkisebb validációs veszteség: <b>${w2_fx(hist[be][2], 3)}</b> (${be}. epoch, ott a validációs pontosság ${w2_pc(hist[be][3], 1)})` : "") +
        (done ? `<br>kész · <b>teszt pontosság</b> (450 kép): <b>${w2_pc(testAcc, 1)}</b>` : "");
    }
    build();
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
