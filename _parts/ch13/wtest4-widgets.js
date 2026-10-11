/* =========================================================
   Mesterséges intelligencia 13. fejezet – interaktív szemléltetések
   (gráfok, üzenetküldés, GCN, GAT, kiolvasás, kapcsolat-előrejelzés,
   WL-teszt, túlsimítás, Cora és MUTAG)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); adatok: graph-data.js (KARATE13), cora-data.js (CORA13), mutag-data.js (MUTAG13).
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

  const W = {};
  /* ==================================================================
     13.11-a  cora-explorer – Cora: szózsák vs. GCN rejtett réteg
     ================================================================== */
  /* két CSS-szín keveréke (a 7. témaszínhez) */
  function w4Blend(a, b, t) {
    const A = hexRGB(css(a)), B = hexRGB(css(b));
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
  }
  /* 7 témaszín: az --setA-t a zöld felé toljuk, hogy elváljon az --accent indigójától; a 7. a lila (--accent + --bad) */
  const w4ClassCols = () => [w4Blend("--setA", "--setC", 0.4), css("--setB"), css("--setC"), css("--accent"), css("--bad"), w4Blend("--accent", "--bad", 0.55), css("--muted")];
  const w4Swatch = (col, round = true) => h("span", { style: `display:inline-block;width:.8em;height:.8em;border-radius:${round ? "50%" : "2px"};background:${col};vertical-align:-.05em;margin-right:.3em;flex:none` });
  const w4Stat = (v, l, st = "") => h("div", { class: "stat", style: st }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
  /* rögzített tizedesjegyek (a fmt levágja a záró nullákat: 83,0% → 83%) */
  const w4Fix = (x, d) => { const s = Math.abs(x).toFixed(d).replace(".", ","); return (x < 0 && +s.replace(",", ".") !== 0 ? "−" : "") + s; };
  const w4Pct = (a, d = 1) => w4Fix(100 * a, d) + "%";
  const w4Ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  W["cora-explorer"] = root => {
    const C = window.CORA13;
    if (!C) { root.append(small("Hiányzik a cora-data.js (CORA13).")); return; }
    header(root, "Cora: 2708 cikk, 7 téma – mit ad hozzá a gráf?",
      "Minden pont egy tudományos cikk, a színe a valódi témája; két cikk között él van, ha az egyik hivatkozik a másikra. " +
      "Csak <b>140</b> cikk témáját ismeri a modell (fekete karika), és <b>1000</b> tesztcikken mérjük. " +
      "Válts a két térkép között: bal gomb = a cikkek szózsák-jellemzője (ezt kapja az MLP), jobb gomb = a GCN rejtett rétege, amelybe már a szomszédok is belekeveredtek. " +
      "Kattints (koppints) egy pontra a szomszédaiért!");
    const n = C.n, y = C.y, K = C.classes.length;
    const nb = Array.from({ length: n }, () => []);
    C.edges.forEach(([u, v]) => { nb[u].push(v); nb[v].push(u); });
    const deg = nb.map(a => a.length);
    const isTest = new Uint8Array(n), isTrain = new Uint8Array(n);
    C.test.forEach(i => (isTest[i] = 1)); C.train.forEach(i => (isTrain[i] = 1));
    const PRED = { MLP: C.predMLP, GCN: C.predGCN };
    const accOf = (p, ids) => ids.filter(i => p[i] === y[i]).length / ids.length;
    const acc = { MLP: accOf(C.predMLP, C.test), GCN: accOf(C.predGCN, C.test) };
    ["MLP", "GCN"].forEach(k => { if (Math.abs(acc[k] - C.acc[k]) > 5e-4) console.warn("cora-explorer: eltérő pontosság", k, acc[k], C.acc[k]); });
    const degGroups = [["1", d => d === 1], ["2–3", d => d >= 2 && d <= 3], ["≥ 4", d => d >= 4]].map(([lab, f]) => {
      const ids = C.test.filter(i => f(deg[i]));
      return { lab, n: ids.length, MLP: accOf(C.predMLP, ids), GCN: accOf(C.predGCN, ids) };
    });
    const cnt = new Array(K).fill(0); y.forEach(c => cnt[c]++);
    const byClass = Array.from({ length: K }, () => []); for (let i = 0; i < n; i++) byClass[y[i]].push(i);
    const XY = { raw: C.xyRaw, gcn: C.xyGCN };

    let map = "raw", testOnly = false, hl = "none", sel = -1, raf = 0, geo = null;
    const cur = new Float32Array(2 * n);
    const setPos = key => XY[key].forEach(([a, b], i) => { cur[2 * i] = a; cur[2 * i + 1] = b; });
    setPos("raw");

    const mg = toggleGroup([["raw", "Szózsák (MLP bemenete)"], ["gcn", "GCN rejtett rétege"]], () => map, k => { if (k !== map) { map = k; animate(); } });
    const hg = toggleGroup([["none", "nincs"], ["MLP", "MLP hibái"], ["GCN", "GCN hibái"]], () => hl, k => { hl = k; update(); });
    const cTest = checkbox(false, () => { testOnly = cTest.checked; if (sel >= 0 && testOnly && !isTest[sel]) sel = -1; update(); });
    root.append(h("div", { class: "controls" }, small("térkép:"), mg.bs),
      h("div", { class: "controls" }, h("label", null, cTest, "csak a tesztcsúcsok"), small("kiemelés:"), hg.bs));
    const holder = h("div");
    root.append(holder);
    const cv = Calc.canvas(holder, flatAspect(root, 0.7, 1.0), 760);
    const legend = h("div", { style: "display:flex;flex-wrap:wrap;gap:.2rem .9rem;font-size:.84rem;margin:.45rem 0 0;line-height:1.5" });
    root.append(legend);
    const grid = h("div", { class: "two-canvas", style: "margin-top:.6rem" });
    const panel = h("div", { class: "readout", style: "margin-top:0;font-family:var(--font);font-size:.9rem;min-width:0" });
    const chartBox = h("div", { style: "min-width:0" });
    grid.append(panel, chartBox); root.append(grid);
    chartBox.append(h("div", { style: "font-size:.85rem;font-weight:600;margin-bottom:.2rem" }, "Teszt-pontosság a csúcs fokszáma szerint"));
    const cvB = Calc.canvas(chartBox, 0.62, 400);
    const stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(stats, ro);
    root.append(h("p", { class: "muted", style: "font-size:.8rem;margin:.5rem 0 0", html:
      "Forrás: " + C.src + ". A t-SNE csak a <i>közeli</i> szomszédságokat őrzi meg: a foltok távolsága és mérete nem értelmezhető " +
      "(<a href=\"../08-felugyelet-nelkuli-tanulas/#s84-b\">8.4-b</a>)." }));

    /* jelmagyarázat */
    function paintLegend() {
      const cols = w4ClassCols();
      legend.replaceChildren(...C.classes.map((nm, c) => h("span", { style: "display:inline-flex;align-items:center;white-space:nowrap" }, w4Swatch(cols[c]), nm, h("span", { class: "muted" }, " (" + cnt[c] + ")"))),
        h("span", { style: "display:inline-flex;align-items:center;white-space:nowrap" },
          h("span", { style: "display:inline-block;width:.7em;height:.7em;border-radius:50%;border:1.6px solid var(--text);margin-right:.3em" }), "tanítócsúcs (" + C.train.length + ")"));
    }

    function drawMap() {
      const { ctx, w, h: H } = cv, cols = w4ClassCols();
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const pad = 9, X = i => pad + cur[2 * i] * (w - 2 * pad), Y = i => pad + (1 - cur[2 * i + 1]) * (H - 2 * pad);
      const r = clamp(w / 270, 1.6, 2.8);
      geo = { X, Y, r };
      const vis = i => !testOnly || isTest[i];
      const P = hl === "none" ? null : PRED[hl];
      const wrong = i => P && isTest[i] && P[i] !== y[i];
      const faded = i => (P ? !wrong(i) : false) || (sel >= 0 && i !== sel && !nb[sel].includes(i));
      /* 1. halvány pontok, 2. erős pontok – osztályonként egy-egy útvonal */
      for (const pass of [0, 1]) {
        for (let c = 0; c < K; c++) {
          ctx.save(); ctx.fillStyle = cols[c];
          ctx.globalAlpha = pass ? (P ? 1 : 0.85) : (P ? 0.14 : 0.28);
          ctx.beginPath();
          byClass[c].forEach(i => {
            if (!vis(i) || (faded(i) ? 1 : 0) === pass) return;
            const x = X(i), yy = Y(i);
            ctx.moveTo(x + r, yy); ctx.arc(x, yy, r, 0, 2 * Math.PI);
          });
          ctx.fill(); ctx.restore();
        }
      }
      /* tanítócsúcsok karikája */
      if (!P && !testOnly) {
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.3; ctx.globalAlpha = sel >= 0 ? 0.3 : 0.9; ctx.beginPath();
        C.train.forEach(i => { ctx.moveTo(X(i) + r + 1.6, Y(i)); ctx.arc(X(i), Y(i), r + 1.6, 0, 2 * Math.PI); });
        ctx.stroke(); ctx.restore();
      }
      /* hibás tesztcsúcsok piros gyűrűje */
      if (P) {
        ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.3; ctx.globalAlpha = sel >= 0 ? 0.35 : 1; ctx.beginPath();
        C.test.forEach(i => { if (!wrong(i)) return; ctx.moveTo(X(i) + r + 1.8, Y(i)); ctx.arc(X(i), Y(i), r + 1.8, 0, 2 * Math.PI); });
        ctx.stroke(); ctx.restore();
      }
      /* kiválasztott csúcs: élek a szomszédokhoz */
      if (sel >= 0) {
        const sx = X(sel), sy = Y(sel);
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.globalAlpha = 0.65; ctx.lineWidth = 1.2; ctx.beginPath();
        nb[sel].forEach(u => { ctx.moveTo(sx, sy); ctx.lineTo(X(u), Y(u)); }); ctx.stroke(); ctx.restore();
        nb[sel].forEach(u => { dot(ctx, X(u), Y(u), r + 1.6, cols[y[u]]); ring(ctx, X(u), Y(u), r + 1.6, css("--text"), 1.2); });
        ring(ctx, sx, sy, r + 6.5, css("--card"), 3);
        dot(ctx, sx, sy, r + 4.5, cols[y[sel]]); ring(ctx, sx, sy, r + 4.5, css("--text"), 2.2);
      }
      label(ctx, map === "raw" ? "szózsák (t-SNE)" : "GCN rejtett réteg (t-SNE)", w - 8, H - 6, css("--muted"), "right", "600 11px system-ui, sans-serif", "bottom");
    }

    function drawBars() {
      const { ctx, w, h: H } = cvB;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const L = 34, R = 6, T = 22, B = 34, ph = H - T - B, pw = w - L - R;
      const yv = v => T + ph * (1 - v);
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
      [0, 0.25, 0.5, 0.75, 1].forEach(v => { ctx.moveTo(L, yv(v)); ctx.lineTo(w - R, yv(v)); }); ctx.stroke(); ctx.restore();
      [0, 0.5, 1].forEach(v => label(ctx, Math.round(100 * v) + "%", L - 4, yv(v), css("--muted"), "right", "10px system-ui, sans-serif", "middle"));
      const cM = css("--muted"), cG = css("--accent"), gw = pw / 3, bw = Math.min(34, gw * 0.32), fs = w < 330 ? 9.5 : 10.5;
      degGroups.forEach((g, k) => {
        const cx = L + gw * (k + 0.5);
        [["MLP", cM, -1], ["GCN", cG, 1]].forEach(([key, col, s]) => {
          const x0 = cx + (s < 0 ? -bw - 2 : 2), v = g[key];
          ctx.fillStyle = col; ctx.fillRect(x0, yv(v), bw, yv(0) - yv(v));
          label(ctx, w4Fix(100 * v, 1), x0 + bw / 2, yv(v) - 2, col, "center", `700 ${fs}px system-ui, sans-serif`, "bottom");
        });
        label(ctx, "fokszám " + g.lab, cx, H - B + 5, css("--text"), "center", "600 11px system-ui, sans-serif", "top");
        label(ctx, "(" + g.n + " csúcs)", cx, H - B + 19, css("--muted"), "center", "10px system-ui, sans-serif", "top");
      });
      ctx.fillStyle = cM; ctx.fillRect(L + 2, 5, 10, 10); label(ctx, "MLP", L + 16, 10, css("--text"), "left", "600 11px system-ui, sans-serif", "middle");
      ctx.fillStyle = cG; ctx.fillRect(L + 56, 5, 10, 10); label(ctx, "GCN", L + 70, 10, css("--text"), "left", "600 11px system-ui, sans-serif", "middle");
    }

    function paintPanel() {
      const cols = w4ClassCols();
      if (sel < 0) {
        panel.replaceChildren(h("div", { style: "font-weight:600;margin-bottom:.3rem" }, "Kiválasztott cikk"),
          h("div", { class: "muted" }, "Kattints (koppints) egy pontra: megmutatom a szomszédait, a valódi témáját és a két modell tippjét."));
        return;
      }
      const i = sel, same = nb[i].filter(u => y[u] === y[i]).length;
      const cls = c => h("span", null, w4Swatch(cols[c]), C.classes[c]);
      const pr = key => { const p = PRED[key][i], ok = p === y[i]; return h("span", null, cls(p), " ", h("b", { style: `color:var(${ok ? "--ok" : "--bad"})` }, ok ? "✓" : "✗")); };
      const row = (k, v) => h("tr", null, h("td", { class: "muted", style: "padding:.1rem .5rem .1rem 0;vertical-align:top;width:38%" }, k), h("td", { style: "padding:.1rem 0;overflow-wrap:anywhere" }, v));
      const nbCnt = new Array(K).fill(0); nb[i].forEach(u => nbCnt[y[u]]++);
      const nbList = nbCnt.map((c, k) => [c, k]).filter(([c]) => c).sort((a, b) => b[0] - a[0])
        .map(([c, k]) => h("div", null, w4Swatch(cols[k]), C.classes[k] + " " + c));
      const role = isTrain[i] ? "tanítócsúcs (a modell látta a címkéjét)" : isTest[i] ? "tesztcsúcs" : "se nem tanító-, se nem tesztcsúcs";
      panel.replaceChildren(h("div", { style: "font-weight:600;margin-bottom:.3rem" }, "Kiválasztott cikk: #" + i),
        h("table", { style: "border-collapse:collapse;font-size:.88rem;width:100%;margin:0" },
          row("valódi téma", cls(y[i])), row("MLP tippje", pr("MLP")), row("GCN tippje", pr("GCN")),
          row("fokszám", String(deg[i])), row("azonos témájú szomszéd", `${same}/${deg[i]} (${pct(same / deg[i], 0)})`),
          row("szerep", role), row("szomszédok témái", h("span", null, nbList))));
    }

    function update() {
      mg.paint(); hg.paint(); drawMap(); paintPanel();
      stats.replaceChildren(
        w4Stat(w4Pct(acc.MLP), "MLP teszt-pontosság (csak a szózsák)", "border-left:4px solid var(--muted)"),
        w4Stat(w4Pct(acc.GCN), "GCN teszt-pontosság (szózsák + gráf)", "border-left:4px solid var(--accent)"),
        w4Stat(C.train.length + " / " + C.test.length, "címkézett / tesztcsúcs"));
      let txt = map === "raw"
        ? "Szózsák-térkép: a hasonló szavakat használó cikkek kerülnek egymás mellé. A témák erősen átfednek, ezért az MLP a tesztcikkek csaknem felét eltéveszti. "
        : "GCN-térkép: minden cikk jellemzőjébe a szomszédaié is belekeveredett, így a témák szinte különálló szigetekbe rendeződnek. ";
      if (hl !== "none") {
        const other = hl === "MLP" ? "GCN" : "MLP";
        const errs = C.test.filter(i => PRED[hl][i] !== y[i]), fixed = errs.filter(i => PRED[other][i] === y[i]).length;
        txt += `${hl} hibái: ${errs.length} hibás a ${C.test.length} tesztcikkből (piros gyűrű); ezek közül a(z) ${other} ${fixed}-t eltalál.`;
      } else txt += "Kapcsold be a „GCN hibái” kiemelést: a hibák főleg a témák határán és a kevés szomszédú cikkeknél vannak.";
      ro.textContent = txt;
    }
    function animate() {
      if (raf) cancelAnimationFrame(raf);
      const from = Float32Array.from(cur), to = XY[map], t0 = performance.now();
      mg.paint();
      const tick = now => {
        const t = Math.min(1, (now - t0) / 600), e = w4Ease(t);
        for (let i = 0; i < n; i++) { cur[2 * i] = from[2 * i] + (to[i][0] - from[2 * i]) * e; cur[2 * i + 1] = from[2 * i + 1] + (to[i][1] - from[2 * i + 1]) * e; }
        drawMap();
        raf = t < 1 ? requestAnimationFrame(tick) : 0;
        if (!raf) update();
      };
      raf = requestAnimationFrame(tick);
    }
    cv.draw = drawMap; cvB.draw = drawBars;
    cv.c.style.cursor = "pointer"; cv.c.style.webkitTapHighlightColor = "transparent";
    cv.c.addEventListener("pointerdown", e => {
      if (!geo) return;
      const [mx, my] = evXY(cv, e);
      let best = -1, bd = Infinity;
      for (let i = 0; i < n; i++) {
        if (testOnly && !isTest[i]) continue;
        const d = Math.hypot(geo.X(i) - mx, geo.Y(i) - my);
        if (d < bd) { bd = d; best = i; }
      }
      sel = best >= 0 && bd <= Math.max(10, 3.5 * geo.r) ? (best === sel ? -1 : best) : -1;
      update();
    });
    paintLegend(); drawBars(); update();
    new MutationObserver(paintLegend).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    root.w4 = { acc, degGroups, select: i => { sel = i; update(); }, pos: i => (geo ? [geo.X(i), geo.Y(i)] : null) };
  };

  /* ==================================================================
     13.11-b  mutag-lab – MUTAG: atomzsák, MLP a mátrixon, GIN
     ================================================================== */
  /* W4-CORE-BEGIN  (tiszta JS, node-ban is futtatható: _parts/calc/w134_gin.js) */
  function w4Lin(Wm, b, x) {                              // y = x·Wᵀ + b  (Wm: [ki][be])
    const o = new Array(b.length);
    for (let r = 0; r < b.length; r++) { let s = b[r]; const row = Wm[r]; for (let c = 0; c < x.length; c++) s += row[c] * x[c]; o[r] = s; }
    return o;
  }
  const w4Relu = a => a.map(v => (v > 0 ? v : 0));
  /* GIN (összeg-aggregálás, összeg-kiolvasás minden réteg után), P(mutagén) */
  function w4GinProb(Wt, atoms, edges, nTypes = 7) {
    const n = atoms.length, L = Wt.eps.length, nbr = Array.from({ length: n }, () => []);
    edges.forEach(([u, v]) => { nbr[u].push(v); nbr[v].push(u); });
    let hs = atoms.map(a => { const v = new Array(nTypes).fill(0); v[a] = 1; return v; });
    const z = [];
    for (let l = 0; l < L; l++) {
      const e = Wt.eps[l], old = hs;
      hs = old.map((hv, v) => {
        const x = hv.map((q, k) => (1 + e) * q + nbr[v].reduce((s, u) => s + old[u][k], 0));
        const a = w4Relu(w4Lin(Wt[`mlps.${l}.0.weight`], Wt[`mlps.${l}.0.bias`], x));
        return w4Relu(w4Lin(Wt[`mlps.${l}.2.weight`], Wt[`mlps.${l}.2.bias`], a));
      });
      const pooled = new Array(hs[0].length).fill(0);
      hs.forEach(hv => hv.forEach((q, k) => (pooled[k] += q)));
      z.push(...pooled);
    }
    const lg = w4Lin(Wt["out.3.weight"], Wt["out.3.bias"], w4Relu(w4Lin(Wt["out.0.weight"], Wt["out.0.bias"], z)));
    const m = Math.max(lg[0], lg[1]), e0 = Math.exp(lg[0] - m), e1 = Math.exp(lg[1] - m);
    return e1 / (e0 + e1);
  }
  /* W4-CORE-END */

  const W4_ATOM_COL = ["--muted", "--setA", "--bad", "--setC", "--accent", "--setC", "--accent"];   // C N O F I Cl Br
  const W4_CYCLE = [0, 1, 2, 5];                                                               // C → N → O → Cl → C

  W["mutag-lab"] = root => {
    const M = window.MUTAG13;
    if (!M) { root.append(small("Hiányzik a mutag-data.js (MUTAG13).")); return; }
    header(root, "MUTAG: mutagén-e a molekula?",
      "188 kis molekula; a feladat: okoz-e génmutációt (baktériumteszt alapján). Az atomok a csúcsok, a kötések az élek. " +
      "Három modellt hasonlítunk: <b>atomzsák</b> (csak megszámolja az atomfajtákat, logisztikus regresszió), <b>MLP</b> a kilapított szomszédsági mátrixon " +
      "és <b>GIN</b>. Az első három szám keresztvalidált: a modell sosem látta ezt a molekulát. Nyomd meg az „Átszámozás” gombot, és kattints egy atomra, hogy kicseréld!");
    const mols = M.mols, N = mols.length, Wt = M.weights;
    /* a molekulánkénti számok 3 tizedesre kerekítettek: a 145. molekula GIN-értéke 0,5 (valójában kicsit fölötte) → ≥ 0,5 = mutagén */
    const isPos = p => p >= 0.5, ok = (p, yy) => isPos(p) === (yy === 1);
    const FILT = {
      all: ["mind", () => true],
      gin: ["a GIN téved", m => !ok(m.gin, m.y)],
      perm: ["az MLP téved az átszámozás után", m => ok(m.mlp, m.y) && m.mlpPerm.some(p => !ok(p, m.y))],
      mut: ["mutagén", m => m.y === 1],
      non: ["nem mutagén", m => m.y === 0]
    };
    const lists = {}; for (const k in FILT) lists[k] = mols.map((m, i) => (FILT[k][1](m) ? i : -1)).filter(i => i >= 0);
    let idx = 0, filt = "all", perm = 0, atoms = mols[0].atoms.slice(), geo = null;

    const bPrev = btn("◀", () => go(-1)), bNext = btn("▶", () => go(1));
    const num = h("input", { type: "number", min: 1, max: N, step: 1, value: 1, style: "width:4.4em", "aria-label": "molekula sorszáma" });
    num.addEventListener("change", () => {
      const v = Math.round(+num.value);
      if (!(v >= 1 && v <= N)) { num.value = idx + 1; return; }
      if (v - 1 === idx) return;                          // ugyanaz a molekula: a szerkesztés megmarad
      if (!lists[filt].includes(v - 1)) filt = "all";
      setMol(v - 1);
    });
    const sl = slider(1, N, 1, 1); sl.style.flex = "1 1 140px"; sl.style.minWidth = "120px";
    sl.addEventListener("input", () => setMol(lists[filt][+sl.value - 1]));
    const pos = small("");
    const sel = h("select", { "aria-label": "szűrő", style: "max-width:100%;min-width:0" }, ...Object.keys(FILT).map(k => h("option", { value: k }, `${FILT[k][0]} (${lists[k].length})`)));
    sel.addEventListener("change", () => { filt = sel.value; const L = lists[filt]; setMol(L.includes(idx) ? idx : L[0]); });
    const bPerm = btn("🔀 Átszámozás", () => { perm = (perm + 1) % 6; draw(); });
    const permTxt = h("span", { style: "font-size:.9rem;font-family:var(--mono)" });
    const bReset = btn("↺ Visszaállítás", () => { atoms = mols[idx].atoms.slice(); draw(); });
    root.append(h("div", { class: "controls" }, small("molekula:"), bPrev, num, bNext, sl, pos),
      h("div", { class: "controls" }, small("szűrő:"), sel),
      h("div", { class: "controls" }, bPerm, permTxt, bReset));
    const grid = h("div", { class: "two-canvas" }), L = h("div", { style: "min-width:0" }), Rt = h("div", { style: "min-width:0" });
    grid.append(L, Rt); root.append(grid);
    const cv = Calc.canvas(L, 0.8, 420);
    const molInfo = h("div", { class: "muted", style: "font-size:.82rem;margin-top:.25rem;line-height:1.5" });
    L.append(molInfo);
    const panel = h("div", { style: "font-size:.9rem" });
    Rt.append(panel);
    const stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(stats, ro);
    const maj = Math.max(...[0, 1].map(c => mols.filter(m => m.y === c).length)) / N;
    /* keresztvalidált pontosság a molekulánkénti számokból (egyezik a MUTAG13.acc-cal) */
    const cvAcc = f => mols.filter(m => ok(f(m), m.y)).length / N;
    const A4 = { lr: cvAcc(m => m.lr), mlp: cvAcc(m => m.mlp), gin: cvAcc(m => m.gin),
      mlpPerm: [0, 1, 2, 3, 4].reduce((s, j) => s + cvAcc(m => m.mlpPerm[j]), 0) / 5 };
    for (const k in A4) if (Math.abs(A4[k] - M.acc[k]) > 5e-4) console.warn("mutag-lab: eltérő pontosság", k, A4[k], M.acc[k]);
    stats.append(
      w4Stat(w4Pct(A4.lr), "atomzsák + logisztikus regresszió"),
      w4Stat(w4Pct(A4.mlp) + " → " + w4Pct(A4.mlpPerm), "MLP a mátrixon → átszámozva"),
      w4Stat(w4Pct(A4.gin), "GIN"),
      w4Stat(w4Pct(maj), "a leggyakoribb osztály mindig („mutagén”)"));
    root.append(h("p", { class: "muted", style: "font-size:.8rem;margin:.5rem 0 0" },
      "Pontosság 10-szeres keresztvalidációval, mind a 188 molekulán. Forrás: " + M.src + ". " +
      `Az élő GIN (3 réteg, 16 dimenzió) mind a 188 molekulán tanult, a tanítóhalmazon ${w4Pct(M.acc.liveTrain)}-os; a böngésző maga számolja ki.`));

    const edited = () => atoms.some((a, i) => a !== mols[idx].atoms[i]);
    function go(d) {
      const Lst = lists[filt], k = Lst.indexOf(idx);
      setMol(Lst[((k < 0 ? 0 : k + d) % Lst.length + Lst.length) % Lst.length]);
    }
    function setMol(i) {
      idx = i; atoms = mols[i].atoms.slice();
      /* a „MLP téved az átszámozás után” szűrőben rögtön az első rossz átszámozást mutatjuk */
      perm = filt === "perm" ? 1 + Math.max(0, mols[i].mlpPerm.findIndex(p => !ok(p, mols[i].y))) : 0;
      draw();
    }
    /* a megjelenített (esetleg átszámozott) gráf → élő GIN */
    function liveProb() {
      const m = mols[idx];
      if (!perm) return w4GinProb(Wt, atoms, m.edges);
      const p = m.perms[perm - 1], a2 = new Array(atoms.length);
      atoms.forEach((a, i) => (a2[p[i]] = a));
      return w4GinProb(Wt, a2, m.edges.map(([u, v]) => [p[u], p[v]]));
    }

    function drawMol() {
      const m = mols[idx], xy = m.xy, { ctx, w, h: H } = cv, n = atoms.length;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      xy.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
      const bl = m.edges.map(([u, v]) => Math.hypot(xy[u][0] - xy[v][0], xy[u][1] - xy[v][1])).sort((a, b) => a - b);
      const Lb = bl[bl.length >> 1] || 0.25;
      const pad = clamp(w * 0.07, 22, 34);
      const s = Math.min((w - 2 * pad) / Math.max(x1 - x0, 1e-6), (H - 2 * pad) / Math.max(y1 - y0, 1e-6), 64 / Lb);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const X = i => w / 2 + (xy[i][0] - cx) * s, Y = i => H / 2 - (xy[i][1] - cy) * s;
      const r = clamp(0.3 * Lb * s, 7.5, 14);
      geo = { X, Y, r, n };
      const nbr = Array.from({ length: n }, () => []), aro = Array.from({ length: n }, () => []);
      m.edges.forEach(([u, v], k) => { nbr[u].push(v); nbr[v].push(u); if (m.bonds[k] === 0) { aro[u].push(v); aro[v].push(u); } });
      const tc = css("--text");
      /* kötések */
      m.edges.forEach(([u, v], k) => {
        const ax = X(u), ay = Y(u), bx = X(v), by = Y(v), len = Math.hypot(bx - ax, by - ay) || 1;
        const nx = -(by - ay) / len, ny = (bx - ax) / len, t = m.bonds[k];
        const seg = (o, f0, f1, dash = []) => {
          ctx.save(); ctx.strokeStyle = tc; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.75; ctx.setLineDash(dash);
          ctx.beginPath(); ctx.moveTo(ax + (bx - ax) * f0 + nx * o, ay + (by - ay) * f0 + ny * o); ctx.lineTo(ax + (bx - ax) * f1 + nx * o, ay + (by - ay) * f1 + ny * o);
          ctx.stroke(); ctx.restore();
        };
        if (t === 1) seg(0, 0, 1);
        else if (t === 2) { seg(-2.6, 0, 1); seg(2.6, 0, 1); }
        else if (t === 3) { seg(-3.6, 0, 1); seg(0, 0, 1); seg(3.6, 0, 1); }
        else {                                            // aromás: folytonos + szaggatott belső vonal a gyűrű felé
          seg(0, 0, 1);
          const oth = [...aro[u].filter(q => q !== v), ...aro[v].filter(q => q !== u)];
          let side = 1;
          if (oth.length) {
            const px = oth.reduce((a, q) => a + X(q), 0) / oth.length - (ax + bx) / 2, py = oth.reduce((a, q) => a + Y(q), 0) / oth.length - (ay + by) / 2;
            side = px * nx + py * ny >= 0 ? 1 : -1;
          }
          const f = Math.min(0.4, (r * 0.85) / len);
          seg(side * 4.5, f, 1 - f, [3.5, 3]);
        }
      });
      /* atomok */
      const orig = mols[idx].atoms, numCol = perm ? css("--accent") : css("--muted"), fs = Math.round(clamp(r * 1.05, 9, 14));
      for (let i = 0; i < n; i++) {
        const x = X(i), yy = Y(i), a = atoms[i];
        dot(ctx, x, yy, r, css(W4_ATOM_COL[a]));
        ring(ctx, x, yy, r, css("--card"), 1.5);
        if (a !== orig[i]) ring(ctx, x, yy, r + 3.5, tc, 1.6, [3, 2]);
        label(ctx, M.atomNames[a], x, yy + 0.5, css("--card"), "center", `700 ${M.atomNames[a].length > 1 ? fs - 2 : fs}px system-ui, sans-serif`, "middle");
        /* sorszám: a szomszédok átlagos irányával ellentétes oldalon */
        let dx = 0, dy = 0;
        nbr[i].forEach(q => { const L2 = Math.hypot(X(q) - x, Y(q) - yy) || 1; dx += (X(q) - x) / L2; dy += (Y(q) - yy) / L2; });
        let dl = Math.hypot(dx, dy);
        if (dl < 0.3) { dx = 0.7; dy = -0.7; dl = 1; }
        const num1 = perm ? m.perms[perm - 1][i] + 1 : i + 1, off = r + 7;
        const nx2 = x - (dx / dl) * off, ny2 = yy - (dy / dl) * off, nf = `${perm ? 700 : 600} 10px system-ui, sans-serif`;
        ctx.save(); ctx.font = nf; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 3; ctx.lineJoin = "round";
        ctx.strokeStyle = css("--card"); ctx.strokeText(String(num1), nx2, ny2); ctx.restore();
        label(ctx, String(num1), nx2, ny2, numCol, "center", nf, "middle");
      }
    }

    function bar(name, p, yy, opt = {}) {
      const pos = isPos(p), good = pos === (yy === 1), col = pos ? "var(--bad)" : "var(--setC)";
      return h("div", { style: "margin:.45rem 0;" + (opt.grey ? "opacity:.38" : "") },
        h("div", { style: "display:flex;justify-content:space-between;gap:.5rem;font-size:.84rem" },
          h("span", { html: name }),
          h("span", { style: "font-family:var(--mono);white-space:nowrap" }, w4Fix(p, 3) + " ",
            opt.noMark ? "" : h("b", { style: `color:var(${good ? "--ok" : "--bad"})` }, good ? "✓" : "✗"))),
        h("div", { style: "position:relative;height:12px;background:var(--bg-soft);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin-top:.15rem" },
          h("div", { style: `position:absolute;left:0;top:0;bottom:0;width:${(100 * p).toFixed(1)}%;background:${col}` }),
          h("div", { style: "position:absolute;left:50%;top:-2px;bottom:-2px;border-left:1.5px dashed var(--text);opacity:.6" })));
    }

    function draw() {
      const m = mols[idx], Lst = lists[filt], k = Lst.indexOf(idx), ed = edited();
      sel.value = filt; num.value = idx + 1;
      sl.max = Lst.length; sl.value = k + 1;
      pos.textContent = `${k + 1}./${Lst.length}` + (filt === "all" ? "" : " a szűrőben");
      permTxt.textContent = perm ? `számozás: ${perm}. átszámozás (5-ből)` : "számozás: eredeti";
      setDis(bReset, !ed);
      drawMol();
      const cnt = {}; atoms.forEach(a => (cnt[M.atomNames[a]] = (cnt[M.atomNames[a]] || 0) + 1));
      molInfo.innerHTML = `${atoms.length} atom, ${m.edges.length} kötés · ` + Object.entries(cnt).map(([a, c]) => `${a}: ${c}`).join(", ") +
        "<br>a kötés: egy vonal = egyszeres, kettő = kettős, folytonos + szaggatott = aromás · a kis számok az atomok sorszámai";
      const mlpP = perm ? m.mlpPerm[perm - 1] : m.mlp, live = liveProb();
      panel.replaceChildren(
        h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;margin-bottom:.2rem" },
          h("b", null, `${idx + 1}. molekula`),
          h("span", { class: "chip", style: `border-color:var(${m.y ? "--bad" : "--setC"});color:var(${m.y ? "--bad" : "--setC"})` }, m.y ? "valójában: mutagén" : "valójában: nem mutagén")),
        h("div", { class: "muted", style: "font-size:.82rem" }, "P(mutagén); a szaggatott vonal a 0,5-ös küszöb"),
        ed ? h("div", { style: "font-size:.82rem;color:var(--bad);font-weight:600;margin-top:.3rem" }, "módosított molekula – a keresztvalidált számok az eredetire vonatkoznak") : "",
        bar("atomzsák + logisztikus regresszió", m.lr, m.y, { grey: ed }),
        bar("MLP a szomszédsági mátrixon" + (perm ? ` <b style="color:var(--accent)">(${perm}. átszámozás)</b>` : ""), mlpP, m.y, { grey: ed }),
        bar("GIN", m.gin, m.y, { grey: ed }),
        h("div", { style: "border-top:1px solid var(--border);margin-top:.5rem;padding-top:.15rem" },
          bar("élő GIN, mind a 188 molekulán tanítva – <b>ezt szerkesztheted</b>", live, m.y, { noMark: ed })),
        h("div", { style: "font-size:.82rem;margin-top:.35rem" }, "A GIN és az atomzsák nem függ a számozástól – az MLP igen."));
      let txt = perm
        ? `Átszámozás után ugyanaz a molekula: az MLP bemenete (a mátrix) mégis más, ezért a tippje ${w4Fix(m.mlp, 3)} → ${w4Fix(mlpP, 3)}. A GIN ugyanazt adja (élő GIN: ${w4Fix(live, 3)}).`
        : "Kattints egy atomra: C → N → O → Cl → C. Az élő GIN azonnal újraszámol. ";
      if (!perm && ed) txt = `Módosított molekula: az élő GIN szerint P(mutagén) = ${w4Fix(live, 3)}. A „Visszaállítás” gomb visszahozza az eredetit.`;
      ro.textContent = txt;
    }
    cv.draw = drawMol;
    cv.c.style.cursor = "pointer"; cv.c.style.webkitTapHighlightColor = "transparent";
    cv.c.addEventListener("pointerdown", e => {
      if (!geo) return;
      const [mx, my] = evXY(cv, e);
      let best = -1, bd = Infinity;
      for (let i = 0; i < geo.n; i++) { const d = Math.hypot(geo.X(i) - mx, geo.Y(i) - my); if (d < bd) { bd = d; best = i; } }
      if (best < 0 || bd > geo.r + 6) return;
      e.preventDefault();
      const k = W4_CYCLE.indexOf(atoms[best]);
      atoms[best] = k < 0 ? 0 : W4_CYCLE[(k + 1) % W4_CYCLE.length];
      draw();
    });
    root.w4 = { acc: A4, live: () => liveProb(), setMol, atomPos: i => (geo ? [geo.X(i), geo.Y(i)] : null) };
    draw();
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
