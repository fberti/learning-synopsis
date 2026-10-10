/* =========================================================
   Mesterséges intelligencia 9. fejezet – interaktív szemléltetések
   (neurális hálózatok: neuron, perceptron, rejtett réteg, aktivációk,
   univerzális közelítés, paraméterszám, játszótér, számjegyfelismerő)
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

  /* ------------------------------------------------------------------
     9.1  neuron-lab – egy neuron: súlyok, torzítás, aktiváció
     ------------------------------------------------------------------ */
  const NL_ACT = [["step", "lépcső"], ["sigmoid", "szigmoid"], ["relu", "ReLU"], ["tanh", "tanh"]];
  const NL_PRE = {
    and: { w1: 1, w2: 1, b: -1.5, act: "step", name: "ÉS" },
    or: { w1: 1, w2: 1, b: -0.5, act: "step", name: "VAGY" },
    not: { w1: -1, w2: 0, b: 0.5, act: "step", name: "NEM x₁" },
    nand: { w1: -1, w2: -1, b: 1.5, act: "step", name: "NEM-ÉS" },
    ex: { w1: 0.5, w2: -1, b: 1, act: "sigmoid", name: "példa", x: [1, 2] }
  };
  W["neuron-lab"] = root => {
    header(root, "Egy neuron közelről",
      "A neuron kiszámolja a $z = w_1x_1 + w_2x_2 + b$ súlyozott összeget, majd átengedi egy $\\varphi$ aktivációs függvényen: $a = \\varphi(z)$. " +
      "<b>Bal oldalt</b> a bemenetek síkja: a háttér színe a kimenet (sötétebb = nagyobb), a szaggatott vonal a $z = 0$ egyenes, a nyíl a $\\mathbf w = (w_1, w_2)$ súlyvektor. " +
      "A nagy pont a bemenet – húzd el! <b>Jobb oldalt</b> az aktivációs függvény, rajta a mostani $z$ és $a$.");
    let w1 = 0.5, w2 = -1, b = 1, act = "sigmoid", x = [1, 2], pre = "ex";
    const sl = {};
    const mk = (key, lab, min, max, step) => {
      const s = slider(min, max, step, 0), o = h("b");
      s.addEventListener("input", () => { set(key, +s.value); pre = null; sync(); });
      sl[key] = { s, o };
      return h("label", null, lab, s, o);
    };
    const set = (k, v) => { if (k === "w1") w1 = v; else if (k === "w2") w2 = v; else if (k === "b") b = v; else if (k === "x1") x[0] = v; else x[1] = v; };
    const gA = toggleGroup(NL_ACT, () => act, v => { act = v; pre = null; sync(); });
    const gP = toggleGroup(Object.entries(NL_PRE).map(([k, o]) => [k, o.name]), () => pre, k => {
      const o = NL_PRE[k]; w1 = o.w1; w2 = o.w2; b = o.b; act = o.act; if (o.x) x = o.x.slice(); pre = k; sync();
    });
    root.append(h("div", { class: "controls" }, small("aktiváció:"), gA.bs),
      h("div", { class: "controls" }, mk("w1", "w₁ =", -3, 3, 0.1), mk("w2", "w₂ =", -3, 3, 0.1), mk("b", "b =", -3, 3, 0.1)),
      h("div", { class: "controls" }, mk("x1", "x₁ =", -2, 2, 0.1), mk("x2", "x₂ =", -2, 2, 0.1)),
      h("div", { class: "controls" }, small("beállítás:"), gP.bs));
    const [cvL, cvR] = twoCanvas(root, 1, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const f = z => A()[act].f(z);
    let TL = null, VL = null;
    cvL.draw = () => {
      VL = eqView(cvL, 0.3, 0.3, 2.3, 2.3, { xname: "x₁", yname: "x₂" });
      TL = Calc.plot(cvL, VL, []);
      const { ctx, w, h: hh } = cvL, c = hexRGB(css("--accent")), cb = hexRGB(css("--bad")), cell = 6;
      const rng = act === "relu" ? Math.max(1, ...[[VL.xmin, VL.ymin], [VL.xmin, VL.ymax], [VL.xmax, VL.ymin], [VL.xmax, VL.ymax]].map(([p, q]) => f(w1 * p + w2 * q + b))) : 1;
      for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
        const a = f(w1 * TL.ix(px + cell / 2) + w2 * TL.iy(py + cell / 2) + b);
        const t = act === "tanh" ? a : a / rng, col = t >= 0 ? c : cb;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.42 * Math.min(1, Math.abs(t))})`;
        ctx.fillRect(px, py, cell, cell);
      }
      const L = lineFrom(w1, w2, b, VL);
      if (L) polyline(ctx, TL, L, css("--text"), 1.6, [6, 4]);
      arrow(ctx, TL.tx(0), TL.ty(0), TL.tx(w1 * 0.5), TL.ty(w2 * 0.5), css("--setC"), 2.4);
      label(ctx, "w (fele)", TL.tx(w1 * 0.5) + 6, TL.ty(w2 * 0.5) - 2, css("--setC"));
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([p, q]) => {
        const a = f(w1 * p + w2 * q + b);
        dot(ctx, TL.tx(p), TL.ty(q), 4.5, css("--muted"), true, 1.6);
        if (act === "step") label(ctx, String(a), TL.tx(p) + 6, TL.ty(q) - 4, css("--text"), "left", "700 12px system-ui, sans-serif");
      });
      dot(ctx, TL.tx(x[0]), TL.ty(x[1]), 8, css("--card"));
      dot(ctx, TL.tx(x[0]), TL.ty(x[1]), 6.5, css("--setB"));
    };
    cvR.draw = () => {
      const V = act === "relu" ? { xmin: -6, xmax: 6, ymin: -1, ymax: 6, xname: "z", yname: "a = φ(z)" }
        : act === "tanh" ? { xmin: -6, xmax: 6, ymin: -1.3, ymax: 1.3, xname: "z", yname: "a = φ(z)" }
          : { xmin: -6, xmax: 6, ymin: -0.25, ymax: 1.25, xname: "z", yname: "a = φ(z)" };
      const z = w1 * x[0] + w2 * x[1] + b, a = f(z);
      const T = Calc.plot(cvR, V, act === "step"
        ? [{ seg: [[-6, 0], [0, 0]], color: "--accent", width: 2.6 }, { seg: [[0, 1], [6, 1]], color: "--accent", width: 2.6 }]
        : [{ f, color: "--accent" }]);
      const { ctx } = cvR;
      if (act === "step") { dot(ctx, T.tx(0), T.ty(0), 4, css("--accent")); dot(ctx, T.tx(0), T.ty(1), 4, css("--accent"), true); }
      const zc = clamp(z, V.xmin, V.xmax);
      polyline(ctx, T, [[zc, 0], [zc, clamp(a, V.ymin, V.ymax)]], css("--setB"), 1.4, [4, 3]);
      dot(ctx, T.tx(zc), T.ty(clamp(a, V.ymin, V.ymax)), 6, css("--setB"));
      label(ctx, `z = ${fmt(z, 2)}`, T.tx(zc), T.ty(0) + 16, css("--setB"), "center", "700 12px system-ui, sans-serif", "top");
    };
    let drag = false;
    const pick = e => {
      if (!TL) return;
      const [px, py] = evXY(cvL, e);
      x = [clamp(Math.round(TL.ix(px) * 10) / 10, -2, 2), clamp(Math.round(TL.iy(py) * 10) / 10, -2, 2)];
      pre = pre && NL_PRE[pre].x ? null : pre; sync();
    };
    cvL.c.addEventListener("pointerdown", e => { drag = true; cvL.c.setPointerCapture(e.pointerId); pick(e); });
    cvL.c.addEventListener("pointermove", e => drag && pick(e));
    cvL.c.addEventListener("pointerup", () => { drag = false; });
    function sync() {
      gA.paint(); gP.paint();
      for (const [k, v] of [["w1", w1], ["w2", w2], ["b", b], ["x1", x[0]], ["x2", x[1]]]) { sl[k].s.value = v; sl[k].o.textContent = fmt(v, 1); }
      cvL.draw(); cvR.draw();
      const z = w1 * x[0] + w2 * x[1] + b, a = f(z);
      let s = `z = w₁x₁ + w₂x₂ + b = ${par(w1, 1)}·${par(x[0], 1)} + ${par(w2, 1)}·${par(x[1], 1)} + ${par(b, 1)} = <b>${fmt(z, 2)}</b>` +
        `<br>a = ${A()[act].name}(${fmt(z, 2)}) = <b>${fmt(a, 4)}</b>`;
      if (act === "step") {
        const tt = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([p, q]) => `(${p}, ${q}) → ${f(w1 * p + w2 * q + b)}`).join(" · ");
        s += `<br>a négy sarokpont kimenete: ${tt}`;
      }
      s += `<br><span class="muted">A $z = 0$ egyenes két oldalán a súlyozott összeg előjele más. A súlyvektor arra mutat, amerre $z$ a leggyorsabban nő; a torzítás $b$ az egyenest tolja el, nem forgatja.</span>`;
      out.innerHTML = s; math(out);
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.2  perceptron-train – a perceptron tanulási szabálya lépésenként
     ------------------------------------------------------------------ */
  const PC_DS = [["or", "VAGY"], ["and", "ÉS"], ["xor", "XOR"], ["cloud", "felhő (szétválasztható)"], ["overlap", "átfedő felhő"]];
  function pcData(ds) {
    const X4 = [[0, 0], [0, 1], [1, 0], [1, 1]];
    if (ds === "or") return { X: X4, y: [0, 1, 1, 1] };
    if (ds === "and") return { X: X4, y: [0, 0, 0, 1] };
    if (ds === "xor") return { X: X4, y: [0, 1, 1, 0] };
    const r = ML.rng(ds === "cloud" ? 7 : 8), X = [], y = [];
    const sep = ds === "cloud" ? 0.55 : 0.18;
    while (X.length < 24) {
      const c = X.length % 2, a = (c ? sep : -sep) + 0.32 * ML.gauss(r), b = (c ? sep * 0.6 : -sep * 0.6) + 0.32 * ML.gauss(r);
      if (ds === "cloud" && (c ? 1 : -1) * (a + 0.6 * b) < 0.12) continue;   // margó a szétválaszthatósághoz
      X.push([clamp(a, -1.25, 1.25), clamp(b, -1.25, 1.25)]); y.push(c);
    }
    return { X, y };
  }
  W["perceptron-train"] = root => {
    header(root, "A perceptron tanul",
      "A perceptron sorban végigmegy a mintákon. Ha a jóslata ($\\hat y = 1$, ha $z \\gt 0$, különben 0) eltér a címkétől, módosít: " +
      "$\\mathbf w \\leftarrow \\mathbf w + \\eta\\,(y - \\hat y)\\,\\mathbf x$, $\\ b \\leftarrow b + \\eta\\,(y - \\hat y)$. Kezdés: minden súly 0. " +
      "Telt pont: 1-es címke; üres pont: 0-s. A színes háttér az, ahol a perceptron 1-et mond. Egy <b>epoch</b> = egy kör az összes mintán.");
    let ds = "or", eta = 1, rev = false, D = pcData(ds), w = [0, 0], b = 0, ptr = 0, ep = 1, errsEp = 0, epErrs = [], log = [], done = false, seen = new Map(), cyc = null, lastI = -1, nUpd = 0;
    const gD = toggleGroup(PC_DS, () => ds, v => { ds = v; D = pcData(ds); reset(); });
    const sE = slider(0.1, 1, 0.1, eta), oE = h("b");
    sE.addEventListener("input", () => { eta = +sE.value; reset(); });
    const cR = checkbox(rev, () => { rev = cR.checked; reset(); });
    const b1 = btn("1 minta", () => { stepOne(); sync(); }, "btn primary");
    const bE = btn("1 epoch", () => { const e0 = ep; let g = 0; while (!done && ep === e0 && g++ < 999) stepOne(); sync(); }, "btn primary");
    const bR = btn("▶ amíg hibátlan (legfeljebb 50 epoch)", () => { let g = 0; while (!done && ep <= 50 && g++ < 99999) stepOne(); sync(); });
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, h("label", null, "η = ", sE, oE), h("label", null, cR, "fordított mintasorrend"), btn("↺ Elölről", reset)),
      h("div", { class: "controls" }, b1, bE, bR));
    const [cv, cvB] = twoCanvas(root, 1, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const order = () => { const idx = D.X.map((_, i) => i); return rev ? idx.reverse() : idx; };
    function reset() { w = [0, 0]; b = 0; ptr = 0; ep = 1; errsEp = 0; epErrs = []; log = []; done = false; seen = new Map(); cyc = null; lastI = -1; nUpd = 0; sync(); }
    function stepOne() {
      if (done) return;
      const idx = order(), i = idx[ptr], [x1, x2] = D.X[i], y = D.y[i];
      const z = w[0] * x1 + w[1] * x2 + b, yh = z > 0 ? 1 : 0, d = y - yh;
      if (d) { w = [w[0] + eta * d * x1, w[1] + eta * d * x2]; b += eta * d; errsEp++; nUpd++; }
      log.push({ ep, x: D.X[i], y, z, yh, d, w: w.slice(), b });
      if (log.length > 60) log.shift();
      lastI = i; ptr++;
      if (ptr === idx.length) {
        epErrs.push(errsEp);
        if (errsEp === 0) done = true;
        else {
          const key = [w[0], w[1], b].map(v => v.toFixed(6)).join("|");
          if (seen.has(key) && !cyc) cyc = { from: seen.get(key), to: ep };
          if (!seen.has(key)) seen.set(key, ep);
        }
        ptr = 0; ep++; errsEp = 0;
      }
    }
    const logic = () => ["or", "and", "xor"].includes(ds);
    cv.draw = () => {
      const V = logic() ? eqView(cv, 0.5, 0.5, 0.95, 0.95, { xname: "x₁", yname: "x₂" }) : eqView(cv, 0, 0, 1.35, 1.35, { xname: "x₁", yname: "x₂" });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      decisionMap(cv, T, V, (p, q) => (w[0] * p + w[1] * q + b > 0 ? 0.85 : 0.15), 6, 0.3);
      const L = lineFrom(w[0], w[1], b, V);
      if (L && (w[0] || w[1])) polyline(ctx, T, L, css("--text"), 2);
      D.X.forEach((p, i) => {
        const col = D.y[i] ? C1() : C0(), r = logic() ? 7 : 5;
        dot(ctx, T.tx(p[0]), T.ty(p[1]), r, col, !D.y[i], 2.4);
        if (i === lastI) ring(ctx, T.tx(p[0]), T.ty(p[1]), r + 5, css("--text"), 2, [3, 2]);
      });
    };
    cvB.draw = () => {
      const n = epErrs.length, top = Math.max(2, ...epErrs, D.X.length / 2);
      const T = Calc.plot(cvB, { xmin: 0, xmax: Math.max(8, n) + 1, ymin: 0, ymax: top * 1.15, xstep: Math.max(1, Math.ceil(Math.max(8, n) / 10)), ystep: Math.max(1, Math.ceil(top / 6)), xname: "epoch", yname: "hibák száma" }, []);
      const { ctx } = cvB, bw = Math.max(3, (T.tx(1) - T.tx(0)) * 0.6);
      epErrs.forEach((e, i) => { ctx.fillStyle = e ? css("--bad") : css("--ok"); ctx.fillRect(T.tx(i + 1) - bw / 2, T.ty(e), bw, T.ty(0) - T.ty(e)); });
      if (!n) label(ctx, "Az epochonkénti hibaszám itt jelenik meg.", cvB.w / 2, cvB.h / 2, css("--muted"), "center", "12px system-ui, sans-serif", "middle");
    };
    function sync() {
      gD.paint(); sE.value = eta; oE.textContent = fmt(eta, 1); cR.checked = rev;
      [b1, bE, bR].forEach(x => setDis(x, done));
      cv.draw(); cvB.draw();
      const last = log.slice(-6);
      const row = o => `<tr><td>${o.ep}</td><td>(${fmt(o.x[0], 2)}; ${fmt(o.x[1], 2)})</td><td>${o.y}</td><td>${fmt(o.z, 2)}</td><td>${o.yh}</td>` +
        `<td>${o.d ? `<b>frissít</b> → w = (${fmt(o.w[0], 2)}; ${fmt(o.w[1], 2)}), b = ${fmt(o.b, 2)}` : "helyes, marad"}</td></tr>`;
      let s = `epoch: <b>${done ? ep - 1 : ep}</b> · w = (<b>${fmt(w[0], 2)}</b>; <b>${fmt(w[1], 2)}</b>), b = <b>${fmt(b, 2)}</b>`;
      if (last.length) s += `<table style="font-size:.82rem;margin:.4rem 0;width:auto"><tr><th>epoch</th><th>x</th><th>y</th><th>z</th><th>ŷ</th><th>lépés</th></tr>${last.map(row).join("")}</table>`;
      if (done) s += `<b style="color:var(--ok)">Egy teljes epoch hiba nélkül – a perceptron megállt.</b> Frissítések összesen: ${nUpd}.`;
      else if (cyc) s += `<b style="color:var(--bad)">Ciklus:</b> a ${cyc.to}. epoch végén ugyanott tartanak a súlyok, mint a ${cyc.from}. végén – innen minden kör ugyanígy ismétlődik, a perceptron sosem áll meg.`;
      else if (ep > 50) s += `50 epoch után sem hibátlan.`;
      if (ds === "xor") s += `<br><span class="muted">A XOR nem választható szét egy egyenessel (5.6), ezért a szabály örökké javítgat.</span>`;
      if (ds === "overlap") s += `<br><span class="muted">Átfedő felhő: nincs hibátlan egyenes, a vonal ide-oda ugrál, a hibaszám nem megy le nullára.</span>`;
      out.innerHTML = s;
    }
    sync();
  };

  /* animáció, amely csak akkor fut, ha a widget látszik (IntersectionObserver) */
  function animator(root, frame) {
    let on = false, vis = true, id = 0;
    const loop = () => { id = 0; if (!on || !vis) return; frame(); id = requestAnimationFrame(loop); };
    const kick = () => { if (on && vis && !id) id = requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; kick(); }).observe(root);
    return { start() { on = true; kick(); }, stop() { on = false; }, get running() { return on; } };
  }

  /* ------------------------------------------------------------------
     9.3  hidden-space – mit csinál a rejtett réteg? (2–2–1 háló)
     ------------------------------------------------------------------ */
  const HS_DS = [["xor4", "XOR (4 pont)"], ["xorN", "zajos XOR (80 pont)"], ["disc", "korong (80 pont)"]];
  function hsData(ds) {
    if (ds === "xor4") return { X: [[0, 0], [1, 0], [0, 1], [1, 1]], y: [0, 1, 1, 0] };
    const r = ML.rng(ds === "xorN" ? 21 : 22), X = [], y = [];
    for (let i = 0; i < 80; i++) {
      if (ds === "xorN") { const a = i % 4, cx = a & 1, cy = a >> 1; X.push([cx + 0.13 * ML.gauss(r), cy + 0.13 * ML.gauss(r)]); y.push(cx ^ cy); }
      else { const p = [-0.1 + 1.2 * r(), -0.1 + 1.2 * r()]; X.push(p); y.push(Math.hypot(p[0] - 0.5, p[1] - 0.5) < 0.36 ? 1 : 0); }
    }
    return { X, y };
  }
  W["hidden-space"] = root => {
    header(root, "A rejtett réteg átrendezi a teret",
      "Egy 2–2–1-es háló: két rejtett neuron ($h_1$, $h_2$) és egy kimeneti neuron. <b>Bal oldalt</b> a bemenetek síkja: a két színes vonal a két rejtett neuron $z = 0$ egyenese, a háttér a háló döntése. " +
      "<b>Jobb oldalt</b> ugyanezek a pontok a <b>rejtett térben</b>, a $(h_1, h_2)$ koordinátákkal – itt a kimeneti neuron már egyetlen egyenessel (vastag vonal) dönt. " +
      "Indítsd el a tanítást, és figyeld, hogyan „húzza szét” a rejtett réteg a pontokat! (A tanítás módszere a 10. fejezet témája – most csak nézd.)");
    let ds = "xor4", D = hsData(ds), act = "step", seed = 1, epochs = 0, loss = NaN;
    const net = new ML.MLP([2, 2, 1], { act: "sigmoid", out: "sigmoid", seed: 1 });
    const hand = () => { net.act = "step"; net.W = [[[1, 1], [1, 1]], [[1, -1]]]; net.b = [[-0.5, -1.5], [-0.5]]; act = "step"; epochs = 0; loss = NaN; resetOpt(); };
    const resetOpt = () => { net.t = 0; net.mW = net.W.map(M => M.map(r => r.map(() => 0))); net.vW = net.W.map(M => M.map(r => r.map(() => 0))); net.mb = net.b.map(v => v.map(() => 0)); net.vb = net.b.map(v => v.map(() => 0)); };
    const randInit = () => { if (act === "step") act = "sigmoid"; net.act = act; net.init(seed); epochs = 0; loss = NaN; };
    hand();
    const gD = toggleGroup(HS_DS, () => ds, v => { ds = v; D = hsData(ds); sync(); });
    const gA = toggleGroup([["step", "lépcső (kézi)"], ["sigmoid", "szigmoid"], ["tanh", "tanh"]], () => act, v => {
      anim.stop(); if (v === "step") hand(); else { act = v; net.act = v; net.init(seed); epochs = 0; loss = NaN; } sync();
    });
    const bT = btn("▶ Tanítás", () => {
      if (anim.running) { anim.stop(); sync(); return; }
      if (act === "step") { act = "sigmoid"; net.act = "sigmoid"; resetOpt(); }
      anim.start(); sync();
    }, "btn primary");
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, small("rejtett aktiváció:"), gA.bs),
      h("div", { class: "controls" }, bT, btn("🎲 Új véletlen kezdés", () => { seed++; anim.stop(); randInit(); sync(); }), btn("Kézi XOR-súlyok", () => { anim.stop(); hand(); sync(); })));
    const [cvL, cvR] = twoCanvas(root, 1, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const anim = animator(root, () => {
      const rnd = ML.rng(epochs + 1);
      for (let k = 0; k < 2; k++) { loss = net.epoch(D.X, D.y, { batch: ds === "xor4" ? 4 : 10, lr: 0.03, opt: "adam", rnd }); epochs++; }
      if (epochs >= 4000) anim.stop();
      sync();
    });
    const hid = x => net.forwardAll(x).A[1];
    const outP = x => { const o = net.predict(x)[0]; return act === "step" ? (net.W[1][0][0] * hid(x)[0] + net.W[1][0][1] * hid(x)[1] + net.b[1][0] > 0 ? 1 : 0) : o; };
    const HC = () => [css("--setC"), "#8b5cf6"];
    cvL.draw = () => {
      const V = eqView(cvL, 0.5, 0.5, 0.78, 0.78, { xname: "x₁", yname: "x₂" });
      const T = Calc.plot(cvL, V, []), { ctx } = cvL;
      decisionMap(cvL, T, V, (p, q) => outP([p, q]), 6, 0.3);
      net.W[0].forEach((row, j) => { const L = lineFrom(row[0], row[1], net.b[0][j], V); if (L) polyline(ctx, T, L, HC()[j], 2.2, [6, 3]); });
      label(ctx, "— h₁ = 0", 8, 18, HC()[0], "left"); label(ctx, "— h₂ = 0", 8, 34, HC()[1], "left");
      D.X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), ds === "xor4" ? 7 : 4.5, D.y[i] ? C1() : C0(), !D.y[i], 2.2));
    };
    cvR.draw = () => {
      const lo = act === "tanh" ? -1.15 : -0.15, hi = 1.15;
      const V = eqView(cvR, (lo + hi) / 2, (lo + hi) / 2, (hi - lo) / 2, (hi - lo) / 2, { xname: "h₁", yname: "h₂" });
      const T = Calc.plot(cvR, V, []), { ctx } = cvR;
      const v = net.W[1][0], c = net.b[1][0];
      decisionMap(cvR, T, V, (p, q) => (act === "step" ? (v[0] * p + v[1] * q + c > 0 ? 1 : 0) : ML.sigmoid(v[0] * p + v[1] * q + c)), 6, 0.3);
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.setLineDash([3, 3]); ctx.strokeRect(T.tx(act === "tanh" ? -1 : 0), T.ty(1), T.tx(1) - T.tx(act === "tanh" ? -1 : 0), T.ty(act === "tanh" ? -1 : 0) - T.ty(1)); ctx.restore();
      const L = lineFrom(v[0], v[1], c, V);
      if (L) polyline(ctx, T, L, css("--text"), 2.2);
      const cnt = new Map();
      D.X.forEach((p, i) => {
        const [a, b] = hid(p), key = a.toFixed(3) + "," + b.toFixed(3);
        cnt.set(key, (cnt.get(key) || 0) + 1);
        dot(ctx, T.tx(a), T.ty(b), ds === "xor4" ? 7 : 4.5, D.y[i] ? C1() : C0(), !D.y[i], 2.2);
      });
      if (ds === "xor4") cnt.forEach((n, key) => { if (n > 1) { const [a, b] = key.split(",").map(Number); label(ctx, `×${n}`, T.tx(a) + 10, T.ty(b) - 6, css("--text"), "left", "700 12px system-ui, sans-serif"); } });
    };
    function sync() {
      gD.paint(); gA.paint();
      bT.textContent = anim.running ? "⏸ Szünet" : "▶ Tanítás";
      cvL.draw(); cvR.draw();
      const acc = D.X.reduce((s, p, i) => s + ((outP(p) > 0.5 ? 1 : 0) === D.y[i] ? 1 : 0), 0) / D.X.length;
      const Wt = net.W[0], bb = net.b[0], v = net.W[1][0], c = net.b[1][0];
      const sg = x => (x < 0 ? " − " : " + ") + fmt(Math.abs(x), 2);
      let s = `h₁ = ${A()[act].name}(${fmt(Wt[0][0], 2)}·x₁${sg(Wt[0][1])}·x₂${sg(bb[0])}) · h₂ = ${A()[act].name}(${fmt(Wt[1][0], 2)}·x₁${sg(Wt[1][1])}·x₂${sg(bb[1])})` +
        `<br>kimenet: ${act === "step" ? "lépcső" : "szigmoid"}(${fmt(v[0], 2)}·h₁${sg(v[1])}·h₂${sg(c)})` +
        `<br>helyesen osztályozott: <b>${pct(acc, 0)}</b>` + (epochs ? ` · epoch: <b>${epochs}</b> · veszteség: <b>${fmt(loss, 4)}</b>` : "");
      if (act === "step") s += `<br><span class="muted">Kézi súlyok: h₁ = VAGY, h₂ = ÉS. A rejtett térben (1; 0) és (0; 1) ugyanoda kerül, és a négy pont már egy egyenessel szétválik: „VAGY, de nem ÉS”.</span>`;
      else if (ds === "disc") s += `<br><span class="muted">Korong: két egyenes legfeljebb egy „csíkot” vagy „sarkot” tud kivágni – egy körhöz legalább három rejtett neuron kellene (próbáld ki a 9.7 játszóterén).</span>`;
      else s += `<br><span class="muted">Ha a tanulás beragad (a pontosság nem nő), próbálj új véletlen kezdést – két rejtett neuronnal a XOR-nak rossz helyi minimumai is vannak.</span>`;
      out.innerHTML = s;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.4  activation-gallery – aktivációs függvények és a deriváltjuk
     ------------------------------------------------------------------ */
  const AG = [["step", "lépcső"], ["sigmoid", "szigmoid"], ["tanh", "tanh"], ["relu", "ReLU"], ["leaky", "szivárgó ReLU"], ["gelu", "GELU"]];
  const AG_INFO = {
    step: ["{0, 1}", "0 (a 0-ban nem deriválható)", "0", "nem", "nagyon olcsó", "a gradiens mindenhol 0 – gradiens módszerrel nem tanítható"],
    sigmoid: ["(0; 1)", "0,25", "0,25", "nem", "exponenciális", "telítődik: nagy |z|-nél a derivált ≈ 0"],
    tanh: ["(−1; 1)", "1", "1", "igen", "exponenciális", "telítődik, de nulla középpontú"],
    relu: ["[0; ∞)", "nincs (balról 0, jobbról 1)", "1", "nem", "nagyon olcsó (max)", "z &lt; 0-ra a derivált 0: „halott” neuron lehet"],
    leaky: ["(−∞; ∞)", "nincs (0,01 vagy 1)", "1", "majdnem", "nagyon olcsó", "negatív oldalon is van kis gradiens"],
    gelu: ["kb. [−0,17; ∞)", "0,5", "≈ 1,13", "majdnem", "drágább (Φ)", "sima ReLU – a Transformerek kedvence"]
  };
  W["activation-gallery"] = root => {
    header(root, "Aktivációs függvények – és ami a tanításhoz kell: a derivált",
      "Folytonos vonal: $\\varphi(z)$; szaggatott: a deriváltja, $\\varphi'(z)$. Lent egy $L$ rétegű „lánc”: minden rétegben egyetlen neuron, $a_\\ell = \\varphi(w\\,a_{\\ell-1})$. " +
      "Az oszlopok azt mutatják, mennyire érzékeny az $\\ell$-edik réteg kimenete a bemenetre: $\\lvert\\partial a_\\ell/\\partial x\\rvert = \\prod_k \\lvert w\\,\\varphi'(z_k)\\rvert$ (logaritmikus skála). " +
      "Ez a szorzat dönti el, eljut-e a tanító jel a háló elejére (10. fejezet).");
    let act = "sigmoid", L = 10, wv = 1, x0 = 0.5;
    const g = toggleGroup(AG, () => act, v => { act = v; sync(); });
    const sL = slider(1, 30, 1, L), oL = h("b"), sW = slider(0.5, 3, 0.1, wv), oW = h("b"), sX = slider(-2, 2, 0.1, x0), oX = h("b");
    sL.addEventListener("input", () => { L = +sL.value; sync(); });
    sW.addEventListener("input", () => { wv = +sW.value; sync(); });
    sX.addEventListener("input", () => { x0 = +sX.value; sync(); });
    root.append(h("div", { class: "controls" }, g.bs));
    const cv = Calc.canvas(root, flatAspect(root, 0.42, 0.7));
    const info = h("div", { class: "readout" });
    root.append(info, h("div", { class: "controls" }, h("label", null, "rétegek: L = ", sL, oL), h("label", null, "súly: w = ", sW, oW), h("label", null, "bemenet: x = ", sX, oX)));
    const cvB = Calc.canvas(root, flatAspect(root, 0.32, 0.55));
    const out = h("div", { class: "readout" });
    root.append(out);
    cv.draw = () => {
      const F = A()[act];
      const ymin = act === "tanh" ? -1.3 : act === "relu" || act === "leaky" || act === "gelu" ? -1.2 : -0.3, ymax = act === "relu" || act === "leaky" || act === "gelu" ? 3.5 : 1.3;
      const layers = act === "step"
        ? [{ seg: [[-5, 0], [0, 0]], color: "--accent", width: 2.6 }, { seg: [[0, 1], [5, 1]], color: "--accent", width: 2.6 }, { seg: [[-5, 0], [5, 0]], color: "--setB", dash: [6, 4], width: 2 }]
        : [{ f: F.f, color: "--accent" }, { f: F.df, color: "--setB", dash: [6, 4], width: 2 }];
      Calc.plot(cv, { xmin: -5, xmax: 5, ymin, ymax, xname: "z", yname: "" }, layers);
      label(cv.ctx, `— ${F.name}: φ(z)`, 10, 18, css("--accent")); label(cv.ctx, "- - derivált: φ′(z)", 10, 34, css("--setB"));
    };
    cvB.draw = () => {
      const F = A()[act]; let a = x0, gp = 1; const G = [];
      for (let l = 0; l < L; l++) { const z = wv * a; gp *= wv * F.df(z); a = F.f(z); G.push(Math.abs(gp)); }
      const lg = G.map(v => (v > 0 ? Math.log10(v) : -Infinity));
      const fin = lg.filter(Number.isFinite), lo = Math.min(-3, ...fin.map(v => Math.floor(v))), hi = Math.max(1, ...fin.map(v => Math.ceil(v)));
      const T = Calc.plot(cvB, { xmin: 0, xmax: L + 1, ymin: Math.max(lo, -16) - 0.5, ymax: Math.min(hi, 16) + 0.5, xstep: Math.max(1, Math.ceil(L / 15)), ystep: Math.max(1, Math.ceil((hi - lo) / 8)), xname: "réteg ℓ", yname: "log₁₀ |∂aℓ/∂x|" }, []);
      const { ctx } = cvB, bw = Math.max(3, (T.tx(1) - T.tx(0)) * 0.6);
      lg.forEach((v, i) => {
        if (!Number.isFinite(v)) { label(ctx, "0", T.tx(i + 1), T.ty(0) - 3, css("--bad"), "center"); return; }
        const vv = clamp(v, -16, 16);
        ctx.fillStyle = v < -3 ? css("--bad") : v > 3 ? css("--setB") : css("--ok");
        ctx.fillRect(T.tx(i + 1) - bw / 2, Math.min(T.ty(0), T.ty(vv)), bw, Math.abs(T.ty(0) - T.ty(vv)));
      });
      cvB.G = G; cvB.a = a;
    };
    function sync() {
      g.paint(); sL.value = L; oL.textContent = L; sW.value = wv; oW.textContent = fmt(wv, 1); sX.value = x0; oX.textContent = fmt(x0, 1);
      cv.draw(); cvB.draw();
      const I = AG_INFO[act];
      info.innerHTML = `értékkészlet: <b>${I[0]}</b> · derivált a 0-ban: <b>${I[1]}</b> · legnagyobb derivált: <b>${I[2]}</b> · nulla középpontú: <b>${I[3]}</b> · számítás: <b>${I[4]}</b><br><span class="muted">${I[5]}</span>`;
      const gL = cvB.G[L - 1];
      const sci = v => (v === 0 ? "0" : v >= 1e-3 && v < 1e4 ? fmt(v, 4) : v.toExponential(2).replace(".", ",").replace(/e([+-]\d+)/, (m, e) => "·10^" + (+e)));
      let s = `|∂a_L/∂x| = <b>${sci(gL)}</b> (L = ${L}) · a_L = ${fmt(cvB.a, 4)}`;
      if (act === "step") s += `<br><span class="muted">A lépcső deriváltja mindenhol 0: a bemenet kis változása semmit sem változtat – a gradiens módszer nem kap jelet.</span>`;
      else if (gL < 1e-3) s += `<br><span class="muted">Eltűnő gradiens: a szorzat tényezői 1-nél kisebbek, ezért a jel rétegről rétegre zsugorodik.</span>`;
      else if (gL > 1e3) s += `<br><span class="muted">Robbanó gradiens: a tényezők 1-nél nagyobbak, a jel rétegről rétegre nő.</span>`;
      else s += `<br><span class="muted">A jel nagyjából megmarad.</span>`;
      if ((act === "relu" || act === "leaky") && x0 > 0) s += `<span class="muted"> Pozitív tartományban a ReLU deriváltja 1, így a szorzat éppen $w^L$ – $w = 1$-nél tökéletes, másutt eltűnik vagy robban: a ReLU <em>enyhíti</em> a gondot, nem oldja meg.</span>`;
      if (act === "relu" && x0 < 0) s += `<span class="muted"> Negatív bemenetnél a ReLU kimenete és deriváltja is 0 – a jel elhal.</span>`;
      out.innerHTML = s; math(out);
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.5  relu-sum – ReLU-darabok összege; mélység: hajtogatás
     ------------------------------------------------------------------ */
  const RS_T = {
    sq: { name: "x²", f: x => x * x, a: 0, b: 2 },
    sin: { name: "sin x", f: Math.sin, a: 0, b: 2 * Math.PI },
    bump: { name: "harang", f: x => Math.exp(-x * x), a: -3, b: 3 },
    step: { name: "lépcső (ugrik!)", f: x => (x > 0 ? 1 : 0), a: -1, b: 1 },
    own: { name: "saját képlet", f: null, a: -2, b: 2 }
  };
  W["relu-sum"] = root => {
    header(root, "ReLU-darabokból bármilyen görbe",
      "<b>Szélesség:</b> egyetlen rejtett réteg $n$ ReLU-neuronnal. Minden neuron egy „zsanér” ($c_k\\,\\mathrm{ReLU}(x - t_k)$, vékony vonalak); az összegük egy törött vonal (vastag), amely a $t_k$ pontokban egyezik a célfüggvénnyel (szaggatott). " +
      "<b>Mélység:</b> ugyanaz a két neuron rétegről rétegre ismételve – minden réteg „összehajtja” a szakaszt, és megduplázza a darabok számát.");
    let mode = "width", tg = "sq", n = 2, showT = true, L = 1, own = "x^3 - 2x", ownF = x => x * x * x - 2 * x;
    const gM = toggleGroup([["width", "szélesség: darabok összege"], ["depth", "mélység: hajtogatás"]], () => mode, v => { mode = v; sync(); });
    const gT = toggleGroup(Object.entries(RS_T).map(([k, o]) => [k, o.name]), () => tg, v => { tg = v; sync(); });
    const sN = slider(1, 30, 1, n), oN = h("b"), sL = slider(1, 8, 1, L), oL = h("b");
    sN.addEventListener("input", () => { n = +sN.value; sync(); });
    sL.addEventListener("input", () => { L = +sL.value; sync(); });
    const cT = checkbox(showT, () => { showT = cT.checked; sync(); });
    const inp = h("input", { type: "text", value: own, style: "width:11rem;font-family:var(--mono)" });
    inp.addEventListener("input", () => { try { const f = Calc.parse(inp.value, ["x"]).f; f(0.3); ownF = f; own = inp.value; inp.style.borderColor = ""; } catch (e) { inp.style.borderColor = css("--bad"); } sync(); });
    const rowW = h("div", { class: "controls" }, gT.bs), rowW2 = h("div", { class: "controls" }, h("label", null, "rejtett neuronok: n = ", sN, oN), h("label", null, cT, "a darabok külön is"), h("label", null, "f(x) = ", inp));
    const rowD = h("div", { class: "controls" }, h("label", null, "rétegek: L = ", sL, oL));
    root.append(h("div", { class: "controls" }, gM.bs), rowW, rowW2, rowD);
    const cv = Calc.canvas(root, flatAspect(root, 0.55, 0.8));
    const out = h("div", { class: "readout" });
    root.append(out);
    const relu = z => (z > 0 ? z : 0);
    function build() {
      const T = RS_T[tg], f = tg === "own" ? ownF : T.f, a = T.a, b = T.b;
      const t = Array.from({ length: n + 1 }, (_, k) => a + (b - a) * k / n), y = t.map(f);
      const s = t.slice(0, -1).map((_, k) => (y[k + 1] - y[k]) / (t[k + 1] - t[k]));
      const c = s.map((v, k) => (k ? v - s[k - 1] : v));
      const g = x => y[0] + c.reduce((acc, ck, k) => acc + ck * relu(x - t[k]), 0);
      let err = 0;
      for (let i = 0; i <= 2000; i++) { const x = a + (b - a) * i / 2000, e = Math.abs(g(x) - f(x)); if (Number.isFinite(e)) err = Math.max(err, e); }
      if (tg === "step") err = Math.max(err, Math.abs(g(0)), Math.abs(1 - g(0)));   // az ugrás két oldali határértéke 0 és 1
      return { f, a, b, t, y, c, g, err };
    }
    const Tm = x => 2 * relu(x) - 4 * relu(x - 0.5);
    cv.draw = () => render();
    function sync() {
      gM.paint(); gT.paint(); sN.value = n; oN.textContent = n; sL.value = L; oL.textContent = L; cT.checked = showT;
      [rowW, rowW2].forEach(e => (e.style.display = mode === "width" ? "" : "none")); rowD.style.display = mode === "depth" ? "" : "none";
      inp.parentNode.style.display = tg === "own" ? "" : "none";
      render();
    }
    function render() {
      if (mode === "width") {
        const B = build(), xs = [], ys = [];
        for (let i = 0; i <= 400; i++) { const x = B.a + (B.b - B.a) * i / 400; xs.push(x); ys.push(B.f(x), B.g(x)); }
        const fin = ys.filter(Number.isFinite), lo = Math.min(...fin), hi = Math.max(...fin), pad = 0.12 * (hi - lo || 1);
        const V = { xmin: B.a - 0.04 * (B.b - B.a), xmax: B.b + 0.04 * (B.b - B.a), ymin: Math.min(lo - pad, 0 - pad), ymax: hi + pad, xname: "x", yname: "" };
        const layers = [];
        if (showT && n <= 30) B.c.forEach((ck, k) => layers.push({ f: x => ck * relu(x - B.t[k]), color: rgba(css("--muted"), 0.55), width: 1.2, domain: [B.a, B.b] }));
        layers.push({ f: B.f, color: "--setB", dash: [6, 4], width: 2.2, domain: [B.a, B.b] }, { f: B.g, color: "--accent", width: 2.8, domain: [B.a, B.b] }, { points: B.t.map((t, k) => [t, B.y[k]]), color: "--accent", r: 3.5 });
        Calc.plot(cv, V, layers);
        const terms = B.c.slice(0, 4).map((ck, k) => `${k ? (ck < 0 ? " − " : " + ") : ""}${fmt(k ? Math.abs(ck) : ck, 2)}·ReLU(x ${B.t[k] < 0 ? "+ " + fmt(-B.t[k], 2) : "− " + fmt(B.t[k], 2)})`).join("") + (n > 4 ? " + …" : "");
        out.innerHTML = `g(x) = ${fmt(B.y[0], 2)} + ${terms}` +
          `<br>rejtett neuronok: <b>${n}</b> · a legnagyobb eltérés a tartományon: <b>${fmt(B.err, 4)}</b>` +
          `<br><span class="muted">${tg === "step" ? "Az ugrásnál a hiba sosem csökken 0,5 alá: a tétel csak folytonos függvényre ígér tetszőleges pontosságot." : tg === "sq" ? "x²-nél a hiba pontosan 1/n² (n = 2: 0,25; n = 10: 0,01) – kétszer annyi neuron, negyedannyi hiba." : "Minél több a neuron, annál sűrűbbek a töréspontok, és annál kisebb a hiba."}</span>`;
      } else {
        const layers = [{ f: x => { let y = x; for (let l = 0; l < L; l++) y = Tm(y); return y; }, color: "--accent", width: 2.2, domain: [0, 1] }];
        Calc.plot(cv, { xmin: -0.03, xmax: 1.03, ymin: -0.15, ymax: 1.2, xstep: 0.25, ystep: 0.5, xname: "x", yname: "" }, layers);
        out.innerHTML = `T(x) = 2·ReLU(x) − 4·ReLU(x − 0,5), és a háló ${L} rétege: T(T(…T(x)…)) · rejtett neuronok: <b>${2 * L}</b> · lineáris darabok: <b>${2 ** L}</b>` +
          `<br>Egyetlen rejtett réteggel ugyanehhez legalább <b>${2 ** L - 1}</b> neuron kellene (minden ReLU-neuron legfeljebb egy töréspontot ad).` +
          `<br><span class="muted">A mélység szorozza a darabokat, a szélesség csak összeadja őket.</span>`;
      }
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.6  param-counter – paraméterek rétegenként
     ------------------------------------------------------------------ */
  const PCN = [["2, 2, 1", "XOR 2–2–1"], ["2, 8, 8, 1", "holdak 2–8–8–1"], ["64, 16, 10", "számjegy 64–16–10"], ["784, 128, 10", "MNIST 784–128–10"], ["784, 100, 100, 10", "784–100–100–10"], ["784, 1000, 1000, 10", "784–1000–1000–10"]];
  W["param-counter"] = root => {
    header(root, "Paraméterszámláló",
      "Add meg a rétegek méretét a bemenettől a kimenetig (vesszővel elválasztva). Egy $n_{\\text{be}} \\to n_{\\text{ki}}$ teljesen összekötött rétegben $n_{\\text{ki}} \\times n_{\\text{be}}$ súly és $n_{\\text{ki}}$ torzítás van. " +
      "A rajz legfeljebb 10 neuront mutat rétegenként.");
    let src = "784, 128, 10", bias = true, bytes = 4;
    const inp = h("input", { type: "text", value: src, style: "width:14rem;font-family:var(--mono)" });
    inp.addEventListener("input", () => { src = inp.value; sync(); });
    const g = toggleGroup(PCN, () => src, v => { src = v; inp.value = v; sync(); });
    const cB = checkbox(bias, () => { bias = cB.checked; sync(); });
    const gB = toggleGroup([["4", "32 bites szám (4 bájt)"], ["2", "16 bites (2 bájt)"]], () => String(bytes), v => { bytes = +v; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "rétegek: ", inp), h("label", null, cB, "torzítással")),
      h("div", { class: "controls" }, g.bs), h("div", { class: "controls" }, small("tárolás:"), gB.bs));
    const cv = Calc.canvas(root, flatAspect(root, 0.36, 0.6));
    const out = h("div", { class: "readout" });
    root.append(out);
    const parse = () => { const v = src.split(/[,;\s–-]+/).filter(Boolean).map(Number); return v.length >= 2 && v.every(k => Number.isInteger(k) && k > 0 && k <= 1e6) ? v : null; };
    const big = n => fmt(n, 0);
    cv.draw = () => {
      const S = parse(), { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      if (!S) return;
      const nL = S.length, xs = S.map((_, l) => 30 + (w - 60) * (nL === 1 ? 0.5 : l / (nL - 1)));
      const shown = S.map(n => Math.min(n, 10)), ys = shown.map(k => Array.from({ length: k }, (_, i) => 22 + (hh - 54) * (k === 1 ? 0.5 : i / (k - 1))));
      ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.35); ctx.lineWidth = 0.8;
      for (let l = 0; l < nL - 1; l++) for (const ya of ys[l]) for (const yb of ys[l + 1]) { ctx.beginPath(); ctx.moveTo(xs[l], ya); ctx.lineTo(xs[l + 1], yb); ctx.stroke(); }
      ctx.restore();
      S.forEach((n, l) => {
        ys[l].forEach((y, i) => {
          const gap = n > 10 && i === 4;
          if (gap) { label(ctx, "⋮", xs[l], y + 4, css("--muted"), "center", "700 14px system-ui, sans-serif", "middle"); return; }
          dot(ctx, xs[l], y, 6, l === 0 ? css("--muted") : l === nL - 1 ? css("--setB") : css("--accent"));
        });
        label(ctx, big(n), xs[l], hh - 8, css("--text"), "center", "700 12px system-ui, sans-serif");
      });
    };
    function sync() {
      g.paint(); gB.paint(); cB.checked = bias;
      cv.draw();
      const S = parse();
      if (!S) { out.innerHTML = `<span class="muted">Legalább két pozitív egész szám kell (pl. 784, 128, 10).</span>`; return; }
      let tw = 0, tb = 0;
      const rows = S.slice(1).map((n, l) => { const wn = S[l] * n, bn = bias ? n : 0; tw += wn; tb += bn; return `<tr><td>${l + 1}. (${l === S.length - 2 ? "kimeneti" : "rejtett"})</td><td>${big(n)} × ${big(S[l])}</td><td>${big(wn)}</td><td>${big(bn)}</td><td><b>${big(wn + bn)}</b></td></tr>`; }).join("");
      const tot = tw + tb, mem = tot * bytes;
      const memS = mem >= 1e9 ? fmt(mem / 1e9, 2) + " GB" : mem >= 1e6 ? fmt(mem / 1e6, 2) + " MB" : fmt(mem / 1e3, 1) + " kB";
      out.innerHTML = `<table style="font-size:.84rem;width:auto;margin:.2rem 0"><tr><th>réteg</th><th>W alakja</th><th>súlyok</th><th>torzítások</th><th>összesen</th></tr>${rows}` +
        `<tr><td colspan="2"><b>háló</b></td><td>${big(tw)}</td><td>${big(tb)}</td><td><b>${big(tot)}</b></td></tr></table>` +
        `paraméterek: <b>${big(tot)}</b> · tárolás: <b>${memS}</b> · szorzás-összeadás mintánként: <b>${big(tw)}</b>` +
        (bias && tot ? ` · a torzítások aránya: <b>${pct(tb / tot, 2)}</b>` : "") +
        `<br><span class="muted">Rejtett rétegek: ${S.length - 2} · a bemeneti „réteg” nem számol, csak továbbadja a számokat – ezért nincs paramétere.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.7  nn-playground – a neurális háló játszótere
     ------------------------------------------------------------------ */
  const PG_DS = [["xor", "XOR"], ["circles", "körök"], ["moons", "holdak"], ["spiral", "spirál"], ["blobs", "két felhő"]];
  const PG_ACT = [["tanh", "tanh"], ["relu", "ReLU"], ["sigmoid", "szigmoid"], ["linear", "lineáris"]];
  const PG_LR = [0.003, 0.01, 0.03, 0.1];
  W["nn-playground"] = root => {
    header(root, "A neurális háló játszótere",
      "Válassz adatot, rakd össze a hálót (rétegek és neuronok a <b>+</b>/<b>−</b> gombokkal), és indítsd el a tanítást. Minden kis négyzet egy neuron „látványa”: " +
      "milyen értéket ad a sík egyes pontjain (narancs = pozitív, kék = negatív). A nagy ábra a háló kimenete: telt pont a tanító, üres pont a teszt adat. " +
      "A tanítás (mini-köteges Adam, 10-es kötegekkel) részleteit a 10. fejezet mutatja meg.");
    let ds = "circles", noise = 0.1, dseed = 1, act = "tanh", lr = 0.03, hidden = [4, 2], seed = 1, showTest = true;
    let net, tr, te, epoch = 0, hist = [], rnd = ML.rng(1);
    const gD = toggleGroup(PG_DS, () => ds, v => { ds = v; newData(); });
    const gA = toggleGroup(PG_ACT, () => act, v => { act = v; rebuild(); });
    const gL = toggleGroup(PG_LR.map(v => [String(v), fmt(v, 3)]), () => String(lr), v => { lr = +v; sync(); });
    const sN = slider(0, 0.5, 0.05, noise), oN = h("b");
    sN.addEventListener("input", () => { noise = +sN.value; newData(); });
    const cT = checkbox(showTest, () => { showTest = cT.checked; draw(); });
    const bP = btn("▶ Tanítás", () => { anim.running ? anim.stop() : anim.start(); sync(); }, "btn primary");
    const bS = btn("1 epoch", () => { anim.stop(); trainEpoch(); sync(); });
    root.append(h("div", { class: "controls" }, small("adat:"), gD.bs, btn("🎲 Új minta", () => { dseed++; newData(); })),
      h("div", { class: "controls" }, h("label", null, "zaj: ", sN, oN), h("label", null, cT, "tesztpontok")),
      h("div", { class: "controls" }, small("aktiváció:"), gA.bs),
      h("div", { class: "controls" }, small("tanulási ráta:"), gL.bs),
      h("div", { class: "controls" }, bP, bS, btn("↺ Új kezdés", () => { seed++; rebuild(); })));
    const netRow = h("div", { style: "display:flex;flex-wrap:wrap;gap:.6rem;align-items:flex-start;padding:.2rem 0" });
    const outBox = h("div", { style: "flex:1 1 260px;min-width:220px;max-width:380px" });
    const layerBox = h("div", { style: "display:flex;gap:.45rem;align-items:flex-start;overflow-x:auto;max-width:100%" });
    netRow.append(layerBox, outBox); root.append(netRow);
    const cv = Calc.canvas(outBox, 1, 380);
    const cvH = Calc.canvas(root, flatAspect(root, 0.26, 0.45));
    cvH.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    const G = 22;
    let tiles = [];                // tiles[l][j] = { c (canvas), ctx }
    function buildLayers() {
      layerBox.innerHTML = ""; tiles = [];
      const colIn = h("div", { style: "display:flex;flex-direction:column;gap:4px;align-items:center" }, h("div", { class: "muted", style: "font-size:.78rem;height:3.2rem;display:flex;align-items:flex-end" }, "bemenet"));
      tiles.push([0, 1].map(j => { const c = h("canvas", { width: G, height: G, title: j ? "x₂" : "x₁", style: "width:40px;height:40px;border-radius:4px;border:1px solid var(--border);image-rendering:auto" }); colIn.append(c, h("div", { class: "muted", style: "font-size:.72rem;margin-top:-3px" }, j ? "x₂" : "x₁")); return { c, ctx: c.getContext("2d") }; }));
      layerBox.append(colIn);
      hidden.forEach((n, l) => {
        const col = h("div", { style: "display:flex;flex-direction:column;gap:4px;align-items:center" });
        const ctr = h("div", { style: "display:flex;gap:2px;align-items:center;height:1.6rem" },
          btn("−", () => { if (hidden[l] > 1) { hidden[l]--; rebuild(); } }, "btn"), btn("+", () => { if (hidden[l] < 8) { hidden[l]++; rebuild(); } }, "btn"));
        ctr.querySelectorAll("button").forEach(b => { b.style.padding = "0 .45rem"; b.style.minWidth = "1.6rem"; });
        col.append(ctr, h("div", { class: "muted", style: "font-size:.74rem;height:1.5rem" }, `${n} neuron`));
        tiles.push(Array.from({ length: n }, () => { const c = h("canvas", { width: G, height: G, style: "width:40px;height:40px;border-radius:4px;border:1px solid var(--border)" }); col.append(c); return { c, ctx: c.getContext("2d") }; }));
        layerBox.append(col);
      });
      const lc = h("div", { style: "display:flex;flex-direction:column;gap:4px;align-items:center" },
        h("div", { class: "muted", style: "font-size:.78rem" }, "rejtett rétegek"),
        h("div", { style: "display:flex;gap:2px" }, btn("−", () => { if (hidden.length) { hidden.pop(); rebuild(); } }), btn("+", () => { if (hidden.length < 4) { hidden.push(hidden.length ? hidden[hidden.length - 1] : 3); rebuild(); } })),
        h("div", { class: "muted", style: "font-size:.78rem" }, `${hidden.length} db`));
      lc.querySelectorAll("button").forEach(b => { b.style.padding = "0 .5rem"; });
      layerBox.append(lc);
    }
    function newData() {
      const all = ML.data[ds](300, 1000 * dseed + ds.length, noise);
      const idx = ML.shuffle(all.X.map((_, i) => i), ML.rng(dseed + 7));
      const pick = ids => ({ X: ids.map(i => all.X[i]), y: ids.map(i => all.y[i]) });
      tr = pick(idx.slice(0, 150)); te = pick(idx.slice(150));
      rebuild(false);
    }
    function rebuild(layers = true) {
      net = new ML.MLP([2, ...hidden, 1], { act, out: "sigmoid", seed });
      epoch = 0; hist = []; rnd = ML.rng(seed * 13 + 1);
      if (layers || !tiles.length) buildLayers();
      sync();
    }
    function trainEpoch() {
      net.epoch(tr.X, tr.y, { batch: 10, lr, opt: "adam", rnd });
      epoch++;
      hist.push([net.loss(tr.X, tr.y), net.loss(te.X, te.y)]);
      if (hist.length > 4000) hist = hist.filter((_, i) => i % 2 === 0);
    }
    const anim = animator(root, () => { trainEpoch(); if (epoch >= 3000) anim.stop(); sync(); });
    /* minden neuron kimenete egy G × G-s rácson (a rács a [−1,1]² négyzet) */
    function tileMaps() {
      const L = hidden.length, maps = tiles.map(col => col.map(() => new Float32Array(G * G)));
      for (let r = 0; r < G; r++) for (let c = 0; c < G; c++) {
        const x = [-1 + 2 * (c + 0.5) / G, 1 - 2 * (r + 0.5) / G], { A } = net.forwardAll(x);
        maps[0][0][r * G + c] = x[0]; maps[0][1][r * G + c] = x[1];
        for (let l = 0; l < L; l++) for (let j = 0; j < hidden[l]; j++) maps[l + 1][j][r * G + c] = act === "sigmoid" ? 2 * A[l + 1][j] - 1 : A[l + 1][j];
      }
      const c1 = hexRGB(C1()), c0 = hexRGB(C0()), bg = hexRGB(css("--card"));
      tiles.forEach((col, l) => col.forEach((t, j) => {
        const m = maps[l][j]; let mx = 1e-9; for (const v of m) mx = Math.max(mx, Math.abs(v));
        const sc = act === "tanh" || act === "sigmoid" || l === 0 ? 1 : mx;
        const img = t.ctx.createImageData(G, G);
        for (let k = 0; k < G * G; k++) {
          const v = clamp(m[k] / sc, -1, 1), cc = v >= 0 ? c1 : c0, a = Math.abs(v);
          img.data[4 * k] = bg[0] + (cc[0] - bg[0]) * a; img.data[4 * k + 1] = bg[1] + (cc[1] - bg[1]) * a; img.data[4 * k + 2] = bg[2] + (cc[2] - bg[2]) * a; img.data[4 * k + 3] = 255;
        }
        t.ctx.putImageData(img, 0, 0);
      }));
    }
    function draw() {
      const V = eqView(cv, 0, 0, 1.05, 1.05, { xname: "x₁", yname: "x₂", labels: false });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      decisionMap(cv, T, V, (p, q) => net.predict([p, q])[0], 5, 0.5);
      const r = cv.w < 300 ? 2.6 : 3.2;
      if (showTest) te.X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), r, te.y[i] ? C1() : C0(), true, 1.4));
      tr.X.forEach((p, i) => { dot(ctx, T.tx(p[0]), T.ty(p[1]), r + 1, css("--card")); dot(ctx, T.tx(p[0]), T.ty(p[1]), r, tr.y[i] ? C1() : C0()); });
      tileMaps();
      const n = hist.length, top = n ? Math.max(0.1, ...hist.map(v => Math.max(v[0], v[1]))) : 1;
      const Th = Calc.plot(cvH, { xmin: 0, xmax: Math.max(50, epoch) * 1.02, ymin: 0, ymax: Math.min(1.2, top * 1.1), xname: "epoch", yname: "veszteség" }, []);
      if (n > 1) {
        const step = Math.max(1, Math.floor(n / 400)), ex = i => (i + 1) * epoch / n;
        polyline(cvH.ctx, Th, hist.filter((_, i) => i % step === 0).map((v, k) => [ex(k * step), v[0]]), css("--accent"), 2);
        polyline(cvH.ctx, Th, hist.filter((_, i) => i % step === 0).map((v, k) => [ex(k * step), v[1]]), css("--setB"), 2, [5, 3]);
      }
      label(cvH.ctx, "— tanító", Math.max(60, cvH.w - 170), 18, css("--accent")); label(cvH.ctx, "- - teszt", Math.max(60, cvH.w - 90), 18, css("--setB"));
    }
    cv.draw = cvH.draw = () => draw();
    function sync() {
      gD.paint(); gA.paint(); gL.paint(); sN.value = noise; oN.textContent = fmt(noise, 2); cT.checked = showTest;
      bP.textContent = anim.running ? "⏸ Szünet" : "▶ Tanítás";
      draw();
      const lt = hist.length ? hist[hist.length - 1] : [net.loss(tr.X, tr.y), net.loss(te.X, te.y)];
      out.innerHTML = `háló: <b>${[2, ...hidden, 1].join("–")}</b> · paraméterek: <b>${net.nParams}</b> · epoch: <b>${epoch}</b>` +
        `<br>veszteség – tanító: <b>${fmt(lt[0], 3)}</b>, teszt: <b>${fmt(lt[1], 3)}</b> · pontosság – tanító: <b>${pct(net.accuracy(tr.X, tr.y), 0)}</b>, teszt: <b>${pct(net.accuracy(te.X, te.y), 0)}</b>`;
    }
    newData();
  };

  /* ------------------------------------------------------------------
     9.7  digit-mlp – kézzel írt számjegy felismerése egy 64–16–10-es hálóval
     (a súlyok a digit-net.js-ben; tanítás: scikit-learn MLPClassifier, 8×8-as digits)
     ------------------------------------------------------------------ */
  W["digit-mlp"] = root => {
    const N = window.DIGIT_NET;
    header(root, "Számjegyfelismerő: 64 bemenet, 16 rejtett neuron, 10 kimenet",
      "Rajzolj egy számjegyet a bal oldali mezőbe (egérrel vagy ujjal), vagy tölts be egy mintát a teszt adatból. A rajzot a program középre igazítja és 8 × 8-as képpé kicsinyíti (minden mező 0–16) – " +
      "ezt kapja a háló (jobb felső sarok). <b>Középen</b> a 16 rejtett neuron: a kis kép a neuron 64 súlya (narancs = pozitív, kék = negatív), alatta a kimenete (ReLU). " +
      "<b>Lent</b> a softmax-kimenet: a tíz számjegy valószínűsége.");
    if (!N) { root.append(h("p", { class: "muted" }, "A háló súlyai nem töltődtek be (digit-net.js).")); return; }
    const fwd = v => {
      const x = v.map(t => t / 16), hh = N.W1.map((row, j) => Math.max(0, row.reduce((s, w, i) => s + w * x[i], N.b1[j])));
      const z = N.W2.map((row, k) => row.reduce((s, w, j) => s + w * hh[j], N.b2[k]));
      return { h: hh, z, p: ML.softmax(z) };
    };
    const S = N.test.X.map((v, i) => ({ v, y: N.test.y[i], pred: (() => { const p = fwd(v).p; return p.indexOf(Math.max(...p)); })() }));
    const wrong = S.map((s, i) => (s.pred !== s.y ? i : -1)).filter(i => i >= 0);
    let B = new Uint8Array(32 * 32), V = S[N.ex].v.slice(), mode = "sample", cur = N.ex, wi = -1, last = null, drawing = false;
    const info = h("span", { class: "muted", style: "font-size:.9rem" });
    root.append(h("div", { class: "controls" },
      btn("🧽 Törlés", () => { B.fill(0); V = new Array(64).fill(0); mode = "draw"; info.textContent = ""; sync(); }),
      btn("Következő minta", () => { cur = (cur + 1) % S.length; load(cur); }),
      btn("🎲 Véletlen minta", () => { cur = Math.floor(Math.random() * S.length); load(cur); }),
      btn("🔍 Egy tévesztés", () => { if (!wrong.length) return; wi = (wi + 1) % wrong.length; cur = wrong[wi]; load(cur); }), info));
    const [cvD, cvH] = twoCanvas(root, 1, 1);
    const cvO = Calc.canvas(root, flatAspect(root, 0.24, 0.42));
    cvO.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    function load(i) { V = S[i].v.slice(); mode = "sample"; B.fill(0); info.textContent = `teszt minta · valódi címke: ${S[i].y}`; sync(); }
    /* a rajz befoglaló téglalapját a 32 × 32-es mezőbe nagyítjuk (magasság ≈ 30), középre tesszük, majd 4 × 4-es blokkonként összeszámoljuk */
    function downsample() {
      let x0 = 32, x1 = -1, y0 = 32, y1 = -1;
      for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) if (B[r * 32 + c]) { x0 = Math.min(x0, c); x1 = Math.max(x1, c); y0 = Math.min(y0, r); y1 = Math.max(y1, r); }
      const out = new Array(64).fill(0);
      if (x1 < 0) return out;
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, s = Math.min(30 / bh, 26 / bw, 4);
      const cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2;
      for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) {
        const sx = Math.floor(cx + (c + 0.5 - 16) / s), sy = Math.floor(cy + (r + 0.5 - 16) / s);
        if (sx >= 0 && sx < 32 && sy >= 0 && sy < 32 && B[sy * 32 + sx]) out[(r >> 2) * 8 + (c >> 2)]++;
      }
      return out;
    }
    const cellD = () => cvD.w / 32;
    function paint(px, py) {
      const cx = px / cellD(), cy = py / cellD(), R = 1.55;
      for (let r = Math.floor(cy - R); r <= Math.ceil(cy + R); r++) for (let c = Math.floor(cx - R); c <= Math.ceil(cx + R); c++)
        if (r >= 0 && r < 32 && c >= 0 && c < 32 && Math.hypot(c + 0.5 - cx, r + 0.5 - cy) <= R) B[r * 32 + c] = 1;
    }
    cvD.c.addEventListener("pointerdown", e => {
      if (mode === "sample") { B.fill(0); mode = "draw"; info.textContent = ""; }
      drawing = true; cvD.c.setPointerCapture(e.pointerId); last = evXY(cvD, e); paint(...last); V = downsample(); sync();
    });
    cvD.c.addEventListener("pointermove", e => {
      if (!drawing) return;
      const p = evXY(cvD, e), d = Math.hypot(p[0] - last[0], p[1] - last[1]), k = Math.max(1, Math.ceil(d / (cellD() * 0.5)));
      for (let i = 1; i <= k; i++) paint(last[0] + (p[0] - last[0]) * i / k, last[1] + (p[1] - last[1]) * i / k);
      last = p; V = downsample(); sync();
    });
    const end = () => { drawing = false; };
    cvD.c.addEventListener("pointerup", end); cvD.c.addEventListener("pointercancel", end);
    const ink = () => hexRGB(css("--text")), bgc = () => hexRGB(css("--card"));
    const shade = t => { const a = ink(), b = bgc(); return `rgb(${b.map((v, i) => Math.round(v + (a[i] - v) * t)).join(",")})`; };
    function grid8(ctx, x0, y0, size, vals) {
      const c = size / 8;
      for (let k = 0; k < 64; k++) { ctx.fillStyle = shade(vals[k] / 16); ctx.fillRect(x0 + (k % 8) * c, y0 + Math.floor(k / 8) * c, c + 0.5, c + 0.5); }
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(x0, y0, size, size); ctx.restore();
    }
    cvD.draw = () => {
      const { ctx, w } = cvD;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      if (mode === "sample") grid8(ctx, 0, 0, w, V);
      else {
        const c = w / 32; ctx.fillStyle = shade(1);
        for (let k = 0; k < 1024; k++) if (B[k]) ctx.fillRect((k % 32) * c, Math.floor(k / 32) * c, c + 0.5, c + 0.5);
        ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.25);
        for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * w / 8, 0); ctx.lineTo(i * w / 8, w); ctx.moveTo(0, i * w / 8); ctx.lineTo(w, i * w / 8); ctx.stroke(); }
        ctx.restore();
        const s = Math.round(w * 0.27);
        ctx.fillStyle = css("--card"); ctx.fillRect(w - s - 10, 4, s + 6, s + 20);
        grid8(ctx, w - s - 7, 20, s, V);
        label(ctx, "a háló ezt látja", w - s / 2 - 7, 17, css("--muted"), "center", "600 10px system-ui, sans-serif");
        if (!B.some(Boolean)) label(ctx, "Rajzolj ide egy számjegyet!", w / 2, w / 2, css("--muted"), "center", "600 14px system-ui, sans-serif", "middle");
      }
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(0.5, 0.5, w - 1, w - 1); ctx.restore();
    };
    let F = fwd(V);
    cvH.draw = () => {
      const { ctx, w } = cvH;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      const gap = 8, cell = (w - 5 * gap) / 4, ts = cell - 14, c1 = hexRGB(C1()), c0 = hexRGB(C0()), bg = bgc();
      const mxh = Math.max(1e-9, ...F.h);
      N.W1.forEach((row, j) => {
        const gx = gap + (j % 4) * (cell + gap), gy = gap + Math.floor(j / 4) * (cell + gap), mx = Math.max(...row.map(Math.abs)), px = ts / 8;
        row.forEach((wv, k) => { const t = clamp(wv / mx, -1, 1), cc = t >= 0 ? c1 : c0, a = Math.abs(t); ctx.fillStyle = `rgb(${bg.map((v, i) => Math.round(v + (cc[i] - v) * a)).join(",")})`; ctx.fillRect(gx + (k % 8) * px, gy + Math.floor(k / 8) * px, px + 0.5, px + 0.5); });
        const act = F.h[j] / mxh;
        ctx.save(); ctx.lineWidth = 1 + 3 * act; ctx.strokeStyle = act > 0 ? rgba(css("--accent"), 0.25 + 0.75 * act) : css("--border"); ctx.strokeRect(gx - 1, gy - 1, ts + 2, ts + 2); ctx.restore();
        ctx.fillStyle = css("--bg-soft"); ctx.fillRect(gx, gy + ts + 4, ts, 7);
        ctx.fillStyle = css("--accent"); ctx.fillRect(gx, gy + ts + 4, ts * act, 7);
      });
    };
    cvO.draw = () => {
      const { ctx, w, h: hh } = cvO, bw = (w - 20) / 10, k0 = F.p.indexOf(Math.max(...F.p));
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      F.p.forEach((p, k) => {
        const x = 10 + k * bw, H = (hh - 36) * p;
        ctx.fillStyle = k === k0 ? css("--setB") : rgba(css("--accent"), 0.55); ctx.fillRect(x + 4, hh - 20 - H, bw - 8, H);
        label(ctx, String(k), x + bw / 2, hh - 4, css("--text"), "center", "700 13px system-ui, sans-serif");
        if (p >= 0.01) label(ctx, pct(p, 0), x + bw / 2, hh - 23 - H, css("--muted"), "center", "600 11px system-ui, sans-serif");
      });
    };
    function sync() {
      F = fwd(V);
      cvD.draw(); cvH.draw(); cvO.draw();
      const empty = V.every(v => v === 0), k0 = F.p.indexOf(Math.max(...F.p)), act = F.h.filter(v => v > 0).length;
      const top = F.p.map((p, k) => [p, k]).sort((a, b) => b[0] - a[0]).slice(0, 3);
      out.innerHTML = (empty ? `<span class="muted">Üres kép: a háló ilyenkor is mond valamit – a torzítások döntenek.</span><br>` : "") +
        `jóslat: <b>${k0}</b> (${pct(F.p[k0], 1)}) · a három legvalószínűbb: ${top.map(([p, k]) => `${k}: ${pct(p, 1)}`).join(" · ")} · aktív rejtett neuron: <b>${act}</b> / 16` +
        `<br>paraméterek: 64·16 + 16 + 16·10 + 10 = <b>1210</b> · pontosság a 450 teszt képen: <b>${pct(N.acc, 1)}</b> (rejtett réteg nélkül, softmax-regresszióval: ${pct(N.accLR, 1)})`;
    }
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
