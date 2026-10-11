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
     Közös segédek a 13.6-a / 13.7 szemléltetéseihez (w3-előtag)
     ================================================================== */
  /* fix tizedesjegyű magyar szám (a fmt levágja a záró nullákat, itt megtartjuk) */
  const w3F = (x, d = 3) => {
    const r = Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x;
    return r.toFixed(d).replace(".", ",").replace("-", "−");
  };
  const w3Vec = (v, d = 2) => "(" + v.map(a => fmt(a, d)).join("; ") + ")";
  const w3RGB = s => {
    const m = /^rgba?\(([^)]+)\)/.exec(String(s).trim());
    return m ? m[1].split(",").slice(0, 3).map(Number) : hexRGB(s);
  };
  const w3Lum = c => {
    const [r, g, b] = w3RGB(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const w3Con = (a, b) => { const x = w3Lum(a), y = w3Lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  /* olvasható felirat egy tetszőleges kitöltésen: --text vagy --card, amelyik jobban elüt */
  const w3Ink = fill => { const t = css("--text"), c = css("--card"); return w3Con(fill, t) >= w3Con(fill, c) ? t : c; };
  function w3Rng(seed) {                                       // mulberry32
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const w3Poly = (n, cx, cy, R, a0) => Array.from({ length: n }, (_, i) => [cx + R * Math.cos(a0 + 2 * Math.PI * i / n), cy + R * Math.sin(a0 + 2 * Math.PI * i / n)]);
  const w3Cycle = (n, off = 0) => Array.from({ length: n }, (_, i) => [off + i, off + (i + 1) % n]);
  const w3Sel = (opts, value, onchange) => {
    const s = h("select", { onchange: () => onchange(s.value) }, ...opts.map(([v, t]) => h("option", { value: v }, t)));
    s.value = value; return s;
  };

  /* elrendezés a canvasra: a koordinátákat a rajzterülethez skálázzuk (y lefelé nő) */
  function w3Fit(cv, xy, pad, maxS = Infinity) {
    const xs = xy.map(p => p[0]), ys = xy.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min(maxS, (cv.w - 2 * pad) / Math.max(1e-9, x1 - x0), (cv.h - 2 * pad) / Math.max(1e-9, y1 - y0));
    const ox = cv.w / 2 - s * (x0 + x1) / 2, oy = cv.h / 2 - s * (y0 + y1) / 2;
    return xy.map(([x, y]) => [ox + s * x, oy + s * y]);
  }
  /* gráf rajzolása: G = { xy, edges }; o = { fill(i), text(i), tag(i), tagCol(i), r, font, maxS, pad } */
  function w3DrawGraph(cv, G, o) {
    const { ctx } = cv, r = o.r || 16;
    ctx.clearRect(0, 0, cv.w, cv.h); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, cv.w, cv.h);
    const P = w3Fit(cv, G.xy, o.pad != null ? o.pad : r + 14, o.maxS);
    ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 2;
    G.edges.forEach(([u, v]) => { ctx.beginPath(); ctx.moveTo(P[u][0], P[u][1]); ctx.lineTo(P[v][0], P[v][1]); ctx.stroke(); });
    ctx.restore();
    P.forEach(([x, y], i) => {
      const f = o.fill(i);
      dot(ctx, x, y, r, f);
      ring(ctx, x, y, r, o.stroke ? o.stroke(i) : css("--muted"), 1.2);
      const t = o.text ? o.text(i) : "";
      if (t) label(ctx, t, x, y + 0.5, w3Ink(f), "center", o.font || "700 12px system-ui, sans-serif", "middle");
      const tg = o.tag ? o.tag(i) : "";
      if (tg) label(ctx, tg, x + r * 0.72, y - r * 0.72, o.tagCol ? o.tagCol(i) : css("--muted"), "left", "700 12px system-ui, sans-serif", "bottom");
    });
    return P;
  }
  const w3Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0", html });
  const w3Sw = (col, txt = "") => h("span", {
    style: `display:inline-flex;align-items:center;justify-content:center;min-width:1.15em;height:1.15em;border-radius:4px;background:${col};` +
      `border:1px solid var(--muted);color:${w3Ink(col)};font-size:.72rem;font-weight:700;vertical-align:middle;padding:0 .15em`
  }, txt);

  /* ==================================================================
     13.6-a  molecule-readout – gráfszintű kiolvasás (összeg / átlag / max)
     ================================================================== */
  const W3_ZZ = n => Array.from({ length: n }, (_, i) => [0.87 * i, i % 2 ? 0 : 0.5]);
  const W3_MOL = {
    metanol: { name: "metanol", f: "CH₃OH", at: "CO", e: [[0, 1]], xy: [[0, 0], [1, 0]] },
    etanol: { name: "etanol", f: "CH₃CH₂OH", at: "CCO", e: [[0, 1], [1, 2]], xy: W3_ZZ(3) },
    dme: { name: "dimetil-éter", f: "CH₃OCH₃", at: "COC", e: [[0, 1], [1, 2]], xy: W3_ZZ(3) },
    propan: { name: "propán", f: "CH₃CH₂CH₃", at: "CCC", e: [[0, 1], [1, 2]], xy: W3_ZZ(3) },
    ciklo: { name: "ciklopropán", f: "C₃H₆", at: "CCC", e: w3Cycle(3), xy: w3Poly(3, 0, 0, 0.6, -Math.PI / 2) },
    glioxal: { name: "glioxál", f: "OHC–CHO", at: "OCCO", e: [[0, 1], [1, 2], [2, 3]], xy: W3_ZZ(4) },
    benzol: { name: "benzol", f: "C₆H₆", at: "CCCCCC", e: w3Cycle(6), xy: w3Poly(6, 0, 0, 1, -Math.PI / 2) },
    ket: { name: "két ciklopropán", f: "2 × C₃H₆, egy gráfként", at: "CCCCCC", e: [...w3Cycle(3), ...w3Cycle(3, 3)],
      xy: [...w3Poly(3, 0, 0, 0.6, -Math.PI / 2), ...w3Poly(3, 1.75, 0, 0.6, -Math.PI / 2)] }
  };
  /* k réteg: h' = h + Σ_{u ∈ N(v)} h_u  (GIN, ε = 0, identitás-MLP) */
  function w3MolLayers(m, k) {
    let H = [...m.at].map(a => (a === "C" ? [1, 0] : [0, 1]));
    for (let t = 0; t < k; t++) {
      const N = H.map(v => v.slice());
      m.e.forEach(([u, v]) => { for (let i = 0; i < 2; i++) { N[u][i] += H[v][i]; N[v][i] += H[u][i]; } });
      H = N;
    }
    return H;
  }
  const W3_RO = {
    sum: { t: "összeg", op: " + ", f: H => [0, 1].map(i => H.reduce((s, v) => s + v[i], 0)) },
    mean: { t: "átlag", op: " + ", f: H => [0, 1].map(i => H.reduce((s, v) => s + v[i], 0) / H.length) },
    max: { t: "maximum", op: ", ", f: H => [0, 1].map(i => Math.max(...H.map(v => v[i]))) }
  };
  const w3Same = (a, b) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);

  W["molecule-readout"] = root => {
    header(root, "Molekulából egy vektor – kiolvasás",
      "Minden atom egy 2 hosszú one-hot vektorral indul: C = (1; 0), O = (0; 1). Egy réteg: $h_v' = h_v + \\sum_{u \\in N(v)} h_u$ " +
      "(GIN ε = 0-val, az MLP helyén identitás). A $k$ réteg után a csúcsvektorokból <b>kiolvasással</b> (összeg, átlag vagy maximum, koordinátánként) " +
      "lesz egyetlen vektor – ez írja le az egész molekulát. Válassz két molekulát, és nézd meg, megkülönbözteti-e őket a modell!");
    let L = "metanol", R = "glioxal", k = 0, ro = "sum";
    const opts = Object.entries(W3_MOL).map(([key, m]) => [key, m.name]);
    const sL = w3Sel(opts, L, v => { L = v; draw(); }), sR = w3Sel(opts, R, v => { R = v; draw(); });
    const kg = toggleGroup([[0, "k = 0"], [1, "k = 1"], [2, "k = 2"]], () => k, v => { k = +v; draw(); });
    const rg = toggleGroup(Object.entries(W3_RO).map(([key, r]) => [key, r.t]), () => ro, v => { ro = v; draw(); });
    root.append(h("div", { class: "controls" }, h("label", null, "bal:", sL), h("label", null, "jobb:", sR)),
      h("div", { class: "controls" }, small("rétegek:"), kg.bs), h("div", { class: "controls" }, small("kiolvasás:"), rg.bs));
    const [cvL, cvR, boxL, boxR] = twoCanvas(root, 0.62);
    const capL = h("div", { style: "font-weight:600;font-size:.95rem;margin-bottom:.2rem" }), capR = capL.cloneNode();
    boxL.prepend(capL); boxR.prepend(capR);
    const outL = h("div", { class: "readout", style: "margin-top:.3rem" }), outR = h("div", { class: "readout", style: "margin-top:.3rem" });
    boxL.append(outL); boxR.append(outR);
    const verdict = h("div", { class: "readout", style: "font-family:var(--font);font-size:.98rem" });
    const hint = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(verdict, hint,
      w3Note("A gráfokon csak a nehézatomok (C, O) szerepelnek: a hidrogéneket és a kötésrendet (egyes / kettős kötés) elhagyjuk. " +
        "Ezért pl. a glioxál (OHC–CHO) gráfja ugyanaz, mint az etilénglikolé (HO–CH₂–CH₂–OH). A csúcsokon az aktuális csúcsvektor áll; " +
        "<span style='color:var(--muted);font-weight:700'>■ C</span> szürke, <span style='color:var(--bad);font-weight:700'>■ O</span> piros."));

    const fillOf = a => (a === "C" ? mix("--muted", 0.32) : mix("--bad", 0.8));
    function one(cv, cap, out, key) {
      const m = W3_MOL[key], H = w3MolLayers(m, k), r = W3_RO[ro].f(H);
      cap.textContent = `${m.name} (${m.f})`;
      cv.draw = () => w3DrawGraph(cv, { xy: m.xy, edges: m.e }, {
        r: 19, maxS: 78, fill: i => fillOf(m.at[i]), text: i => H[i].map(v => fmt(v, 0)).join(";"), font: "700 11.5px system-ui, sans-serif",
        tag: i => m.at[i], tagCol: i => (m.at[i] === "C" ? css("--muted") : css("--bad"))
      });
      cv.draw();
      const terms = H.map(v => "(" + v.map(a => fmt(a, 0)).join(";") + ")").join(W3_RO[ro].op);
      const how = ro === "sum" ? terms : ro === "mean" ? `[${terms}] / ${H.length}` : `max{${terms}}`;
      out.innerHTML = `<span class="muted">${W3_RO[ro].t}:</span> ${how}<br>= <b>${w3Vec(r)}</b>`;
      return r;
    }
    function draw() {
      kg.paint(); rg.paint();
      const a = one(cvL, capL, outL, L), b = one(cvR, capR, outR, R);
      const same = w3Same(a, b);
      verdict.innerHTML = L === R ? "Mindkét oldalon ugyanaz a molekula – persze, hogy ugyanazt a vektort kapják."
        : same ? `<b style="color:var(--bad)">✗ Ugyanazt a vektort kapják – a modell nem tudja megkülönböztetni őket.</b>`
          : `<b style="color:var(--setC)">✓ A kiolvasás megkülönbözteti őket.</b>`;
      /* tipp: más k-val vagy más kiolvasással segít-e? */
      hint.innerHTML = "";
      if (L === R) return;
      const ks = [0, 1, 2, 3, 4, 5, 6], diffAt = (kk, rr) => !w3Same(W3_RO[rr].f(w3MolLayers(W3_MOL[L], kk)), W3_RO[rr].f(w3MolLayers(W3_MOL[R], kk)));
      if (!ks.some(kk => Object.keys(W3_RO).some(rr => diffAt(kk, rr)))) {
        hint.innerHTML = "💡 Itt minden csúcs C, és minden csúcs fokszáma 2: a szabály minden csúcsnak ugyanazt a vektort adja, " +
          "bármennyi réteg után, bármelyik kiolvasással. Az üzenetküldés ezt a két gráfot sosem különbözteti meg – miért? Lásd a " +
          "<a href='#s137-a'>Weisfeiler–Leman-tesztet (13.7-a)</a>.";
      } else if (same) {
        const kk = [0, 1, 2].filter(x => x !== k && diffAt(x, ro)), rr = Object.keys(W3_RO).filter(x => x !== ro && diffAt(k, x));
        const parts = [];
        if (kk.length) parts.push(`${kk.every(x => x > k) ? "több" : "más számú"} réteggel (k = ${kk.join(" vagy ")})`);
        if (rr.length) parts.push(`más kiolvasással (${rr.map(x => W3_RO[x].t).join(", ")})`);
        if (parts.length) hint.innerHTML = "💡 Próbáld " + parts.join(", vagy ") + ": úgy már különböznek.";
      }
    }
    draw();
  };

  /* ==================================================================
     13.7-a  wl-test – Weisfeiler–Leman-színfinomítás
     ================================================================== */
  const W3_RUN = { names: ["A", "B", "C", "D", "E"], edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]],
    xy: [[0, 0], [0.55, 0.5], [0, 1], [1.15, 0.5], [1.75, 0.5]] };
  /* ugyanaz a gráf átszámozva: A→4, B→2, C→5, D→1, E→3 (és tükrözött elrendezés) */
  const W3_RUN2 = (() => {
    const map = [3, 1, 4, 0, 2], xy = [], names = [];
    W3_RUN.xy.forEach(([x, y], i) => { xy[map[i]] = [1.75 - x, 1 - y]; names[map[i]] = String(map[i] + 1); });
    return { names, xy, edges: W3_RUN.edges.map(([u, v]) => [map[u], map[v]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]) };
  })();
  const W3_DEC = (() => {                       // dekalin: két hatszög, közös éllel (0–1)
    const c = 0.866;
    const xy = [[0, -0.5], [0, 0.5], [-c, -1], [-2 * c, -0.5], [-2 * c, 0.5], [-c, 1], [c, -1], [2 * c, -0.5], [2 * c, 0.5], [c, 1]];
    return { names: null, xy, edges: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 1], [0, 6], [6, 7], [7, 8], [8, 9], [9, 1]] };
  })();
  const W3_BCP = (() => {                       // biciklopentil: két ötszög, egy híddal (0–5)
    const R5 = 0.85, cx = 0.6 + R5 * Math.cos(Math.PI / 5);
    const L = w3Poly(5, -cx, 0, R5, 0), Rr = w3Poly(5, cx, 0, R5, Math.PI);
    return { names: null, xy: [...L, ...Rr], edges: [...w3Cycle(5), ...w3Cycle(5, 5), [0, 5]] };
  })();
  const W3_WLP = {
    hex: { t: "hatszög vs. két háromszög",
      G: [{ names: null, xy: w3Poly(6, 0, 0, 1, -Math.PI / 2), edges: w3Cycle(6) },
        { names: null, xy: [...w3Poly(3, -0.75, 0, 0.62, -Math.PI / 2), ...w3Poly(3, 0.75, 0, 0.62, -Math.PI / 2)], edges: [...w3Cycle(3), ...w3Cycle(3, 3)] }],
      cap: ["hatszög (C₆)", "két háromszög (2 × C₃)"],
      note: "Mindkettőben 6 csúcs és 6 él, minden csúcs fokszáma 2. Nem izomorfak: az egyik összefüggő, a másik két darabból áll." },
    path: { t: "út vs. csillag",
      G: [{ names: null, xy: [[0, 0], [1, 0], [2, 0], [3, 0]], edges: [[0, 1], [1, 2], [2, 3]] },
        { names: null, xy: [[0, 0], ...w3Poly(3, 0, 0, 1.2, -Math.PI / 2)], edges: [[0, 1], [0, 2], [0, 3]] }],
      cap: ["út 4 csúcson", "csillag (K₁,₃)"],
      note: "4 csúcs, 3 él mindkettőben – de a fokszámok mások, ezért már az első lépés szétválasztja őket." },
    relabel: { t: "a futó példa vs. átszámozva",
      G: [W3_RUN, W3_RUN2], cap: ["a futó példa (A–E)", "ugyanaz, átszámozva (1–5)"],
      note: "Ugyanaz a gráf más számozással és tükrözött elrendezéssel (A→4, B→2, C→5, D→1, E→3). Izomorfak, így a hisztogramok sosem térhetnek el." },
    dec: { t: "dekalin vs. biciklopentil",
      G: [W3_DEC, W3_BCP], cap: ["dekalin (két hatszög, közös él)", "biciklopentil (két ötszög + híd)"],
      note: "Mindkettőben 10 csúcs és 11 él, 2 hármas és 8 kettes fokszámú csúcs. Nyilvánvalóan különbözők (hatos vs. ötös gyűrűk) – vajon az 1-WL észreveszi?" },
    runpath: { t: "a futó példa vs. út",
      G: [W3_RUN, { names: ["A", "B", "C", "D", "E"], xy: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]] }],
      cap: ["a futó példa (5 él)", "út A–B–C–D–E (4 él)"],
      note: "Mindkettő 5 csúcsú, de a futó példában 5 él van (az A–B–C háromszög), az útban csak 4." }
  };
  /* paletta: 0 = semleges kezdőszín, utána élénk és halvány árnyalatok */
  const W3_PAL = [["--muted", 0.22], ["--setA", 0.9], ["--setB", 0.9], ["--setC", 0.9], ["--accent", 0.8], ["--bad", 0.75],
    ["--setA", 0.4], ["--setB", 0.42], ["--setC", 0.42], ["--accent", 0.38], ["--bad", 0.36], ["--muted", 0.75]];
  const w3Pal = i => { const [v, t] = W3_PAL[i % W3_PAL.length]; return mix(v, t); };

  /* egy WL-lépés mindkét gráfon, közös szótárral.
     A régi színosztályok közül a legnépesebb aláírás megtartja a régi színt, a többi új színt kap
     (ez is injektív „hash”: ugyanaz az aláírás mindkét gráfban ugyanazt a színt kapja). */
  function w3WLStep(Gs, cols, nextId) {
    const nb = Gs.map(G => { const a = G.xy.map(() => []); G.edges.forEach(([u, v]) => { a[u].push(v); a[v].push(u); }); return a; });
    const sig = Gs.map((G, g) => cols[g].map((c, i) => ({ own: c, ms: nb[g][i].map(j => cols[g][j]).sort((x, y) => x - y) })));
    const key = s => s.own + "|" + s.ms.join(",");
    const byOld = new Map();                                   // régi szín → Map(kulcs → {count, first, s})
    let order = 0;
    sig.forEach(arr => arr.forEach(s => {
      if (!byOld.has(s.own)) byOld.set(s.own, new Map());
      const m = byOld.get(s.own), k = key(s);
      if (!m.has(k)) m.set(k, { count: 0, first: order++, s });
      m.get(k).count++;
    }));
    const dict = new Map(), entries = [];
    let split = false;
    [...byOld.keys()].sort((a, b) => a - b).forEach(old => {
      const list = [...byOld.get(old).entries()].sort((a, b) => b[1].count - a[1].count || a[1].first - b[1].first);
      if (list.length > 1) split = true;
      list.forEach(([k, o], idx) => { const id = idx === 0 ? old : null; dict.set(k, { id, o }); });
    });
    /* új azonosítók az első előfordulás sorrendjében */
    [...dict.values()].filter(d => d.id == null).sort((a, b) => a.o.first - b.o.first).forEach(d => { d.id = nextId++; });
    dict.forEach(d => entries.push({ id: d.id, own: d.o.s.own, ms: d.o.s.ms, count: d.o.count, isNew: d.id !== d.o.s.own }));
    entries.sort((a, b) => a.own - b.own || a.id - b.id);
    const ncols = sig.map(arr => arr.map(s => dict.get(key(s)).id));
    return { cols: ncols, nextId, split, entries };
  }
  const w3Hist = cs => { const m = new Map(); cs.forEach(c => m.set(c, (m.get(c) || 0) + 1)); return m; };

  W["wl-test"] = root => {
    header(root, "Weisfeiler–Leman-színfinomítás",
      "Kezdetben minden csúcs ugyanolyan színű. Minden lépésben a csúcs új színe a <b>(saját szín, a szomszédok színeinek multihalmaza)</b> párból jön – " +
      "egy közös szótár alapján, ezért a két gráf színei összevethetők. Ha a színek hisztogramja eltér, a gráfok biztosan nem izomorfak. " +
      "Egy üzenetküldő GNN legfeljebb ennyit tud megkülönböztetni.");
    let pk = "relabel", st;
    const pg = toggleGroup(Object.entries(W3_WLP).map(([k, p]) => [k, p.t]), () => pk, k => { pk = k; reset(); });
    root.append(h("div", { class: "controls" }, pg.bs));
    const note = w3Note("");
    note.style.margin = "0 0 .4rem";
    root.append(note);
    const bStep = btn("Egy lépés", () => step(), "btn primary"), bReset = btn("Alaphelyzet", () => reset());
    const status = h("span", { style: "font-weight:600" });
    root.append(h("div", { class: "controls" }, bStep, bReset, status));
    const [cvL, cvR, boxL, boxR] = twoCanvas(root, 0.7);
    const caps = [h("div", { style: "font-weight:600;font-size:.95rem;margin-bottom:.2rem" }), h("div", { style: "font-weight:600;font-size:.95rem;margin-bottom:.2rem" })];
    boxL.prepend(caps[0]); boxR.prepend(caps[1]);
    const hist = [h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.35rem;align-items:center" }), h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.35rem;align-items:center" })];
    boxL.append(hist[0]); boxR.append(hist[1]);
    const verdict = h("div", { class: "readout", style: "font-family:var(--font);font-size:.98rem" });
    const dictBox = h("div", { style: "margin-top:.6rem;font-size:.9rem" });
    root.append(verdict, dictBox);

    function reset() {
      const P = W3_WLP[pk];
      st = { step: 0, stable: false, cols: P.G.map(G => G.xy.map(() => 0)), nextId: 1, entries: null };
      render();
    }
    function step() {
      if (st.stable) return;
      const r = w3WLStep(W3_WLP[pk].G, st.cols, st.nextId);
      st.step++; st.entries = r.entries;
      if (!r.split) st.stable = true;
      st.cols = r.cols; st.nextId = r.nextId;
      render();
    }
    function render() {
      pg.paint();
      const P = W3_WLP[pk];
      note.textContent = P.note;
      [cvL, cvR].forEach((cv, g) => {
        caps[g].textContent = P.cap[g];
        const G = P.G[g];
        cv.draw = () => w3DrawGraph(cv, G, { r: G.xy.length > 6 ? 13 : 16, maxS: 95, fill: i => w3Pal(st.cols[g][i]), text: i => (G.names ? G.names[i] : "") });
        cv.draw();
      });
      /* hisztogramok */
      const H = st.cols.map(w3Hist), ids = [...new Set([...H[0].keys(), ...H[1].keys()])].sort((a, b) => a - b);
      let diff = false;
      hist.forEach((box, g) => {
        box.replaceChildren(small("hisztogram:"));
        ids.forEach(id => {
          const n = H[g].get(id) || 0, other = H[1 - g].get(id) || 0;
          if (n !== other) diff = true;
          box.append(h("span", { class: "chip", style: n !== other ? "border-color:var(--bad);border-width:2px" : "" }, w3Sw(w3Pal(id)), "× " + n));
        });
      });
      setDis(bStep, st.stable);
      status.textContent = st.step === 0 ? "0. lépés: minden csúcs egyforma" : `${st.step}. lépés` + (st.stable ? " · stabil (a felosztás már nem finomodott)" : "");
      status.style.color = st.stable ? "var(--setC)" : "";
      verdict.innerHTML = diff
        ? `<b style="color:var(--setC)">A hisztogramok eltérnek → a gráfok biztosan nem izomorfak.</b>` + (st.step ? ` <span class="muted">(${st.step}. lépésben)</span>` : "")
        : st.stable
          ? `<b style="color:var(--bad)">A hisztogramok megegyeznek → az 1-WL (és így egy üzenetküldő GNN) nem tudja megkülönböztetni őket – attól még lehetnek különbözők!</b>` +
            (pk === "relabel" ? ` <span class="muted">Itt tényleg izomorfak: ugyanaz a gráf, csak átszámozva.</span>` : "")
          : `A hisztogramok eddig megegyeznek – <b>lépj tovább</b>, hátha a következő lépés szétválasztja őket.`;
      /* a legutóbbi lépés szótára */
      dictBox.replaceChildren();
      if (st.entries) {
        dictBox.append(h("div", { class: "muted", style: "margin-bottom:.25rem" }, `A ${st.step}. lépés szótára – (saját szín, {szomszédok színei}) → új szín:`));
        const wrap = h("div", { style: "display:flex;flex-wrap:wrap;gap:.35rem .8rem" });
        st.entries.forEach(e => wrap.append(h("span", { style: "display:inline-flex;align-items:center;gap:.15rem;white-space:nowrap" },
          "(", w3Sw(w3Pal(e.own)), "; {", ...e.ms.map(c => w3Sw(w3Pal(c))), "}) → ", w3Sw(w3Pal(e.id)),
          h("span", { class: "muted", style: "font-size:.8rem;margin-left:.15rem" }, e.isNew ? `új, ${e.count} csúcs` : `${e.count} csúcs`))));
        dictBox.append(wrap);
      }
    }
    reset();
  };

  /* ==================================================================
     13.7-b  oversmoothing – túlsimítás ismételt átlagolással
     ================================================================== */
  /* M = (A + I) sorra normálva; egy lépés: h ← (1 − α) M h + α x  (h lehet vektor-értékű is) */
  function w3Mean(n, edges) {
    const nb = Array.from({ length: n }, (_, i) => [i]);
    edges.forEach(([u, v]) => { nb[u].push(v); nb[v].push(u); });
    return nb;
  }
  function w3Smooth(nb, x, al, K) {
    const out = [x.map(v => v.slice())];
    let H = out[0];
    for (let k = 0; k < K; k++) {
      H = nb.map((N, i) => x[i].map((xi, d) => (1 - al) * N.reduce((s, j) => s + H[j][d], 0) / N.length + al * xi));
      out.push(H);
    }
    return out;
  }
  const w3Std = H => {                       // populációs szórás (skalár jellemzőre)
    const v = H.map(a => a[0]), m = v.reduce((a, b) => a + b, 0) / v.length;
    return Math.sqrt(v.reduce((s, a) => s + (a - m) * (a - m), 0) / v.length);
  };
  const w3Spread = H => {                    // átlagos távolság a súlyponttól (2-D)
    const n = H.length, c = [0, 1].map(d => H.reduce((s, a) => s + a[d], 0) / n);
    return H.reduce((s, a) => s + Math.hypot(a[0] - c[0], a[1] - c[1]), 0) / n;
  };

  W["oversmoothing"] = root => {
    header(root, "Túlsimítás – sok réteg, egyforma csúcsok",
      "Minden réteg egy önhurkos átlagolás: $h \\leftarrow M h$, ahol $M$ az $A + I$ sorra normálva (minden csúcs a saját és a szomszédai értékének átlagát veszi). " +
      "Húzd a csúszkát: hány réteg után lesz minden csúcs egyforma? Kapcsold be a kezdőpont-visszacsatolást: $h \\leftarrow (1 - \\alpha) M h + \\alpha x$.");
    const K = 30, X = [[1], [0], [0], [0], [5]], NB = w3Mean(5, W3_RUN.edges);
    let k = 1, useA = false, al = 0.1;
    const sK = slider(0, K, 1, k), oK = h("b"), cA = checkbox(useA, () => { useA = cA.checked; draw(); }), sA = slider(0, 0.5, 0.01, al), oA = h("b");
    sK.addEventListener("input", () => { k = +sK.value; draw(); });
    sA.addEventListener("input", () => { al = +sA.value; draw(); });
    root.append(h("div", { class: "controls" }, h("label", null, "rétegek száma:", sK, oK)),
      h("div", { class: "controls" }, h("label", null, cA, "maradék / kezdőpont-visszacsatolás (α)"), h("label", null, "α =", sA, oA)));
    root.append(h("div", { style: "font-weight:600;margin-top:.4rem" }, "1. rész – a futó példa, x = (1; 0; 0; 0; 5)"));
    const [cvG, cvC] = twoCanvas(root, 0.62);
    const out = h("div", { class: "readout" });
    root.append(out);

    /* 2. rész: karateklub */
    const KD = window.KARATE13;
    let cvS = null, out2 = null, KX = null, KNB = null;
    if (KD) {
      root.append(h("div", { style: "font-weight:600;margin-top:1.1rem" }, "2. rész – a karateklub, véletlen 2-D jellemzőkkel"),
        w3Note("Mind a 34 tag egy véletlen pontból indul a [−1; 1]² négyzetben (rögzített mag), a szín a klub, ahová a szakadás után került: " +
          "<b style='color:var(--setA)'>●</b> Mr. Hi (1), <b style='color:var(--setB)'>●</b> az elnök (34). Ugyanaz az átlagolás, ugyanaz a csúszka."));
      const box = h("div", { style: "max-width:520px;margin:.4rem auto 0" });
      root.append(box);
      cvS = Calc.canvas(box, 0.82, 520);
      out2 = h("div", { class: "readout" });
      root.append(out2);
      const rnd = w3Rng(13);
      KX = Array.from({ length: KD.n }, () => [2 * rnd() - 1, 2 * rnd() - 1]);
      KNB = w3Mean(KD.n, KD.edges);
    } else root.append(small("(A karateklub adatfájlja – graph-data.js – nincs betöltve.)"));

    function draw() {
      oK.textContent = k; oA.textContent = w3F(al, 2); setDis(sA, !useA);
      const plain = w3Smooth(NB, X, 0, K), withA = w3Smooth(NB, X, al, K), cur = useA ? withA : plain;
      const H = cur[k];
      cvG.draw = () => w3DrawGraph(cvG, W3_RUN, {
        r: 22, maxS: 120, pad: 30, fill: i => mix("--accent", 0.08 + 0.92 * clamp(H[i][0] / 5, 0, 1)), text: i => w3F(H[i][0], 3),
        font: "700 11px system-ui, sans-serif", tag: i => W3_RUN.names[i], tagCol: () => css("--text")
      });
      cvG.draw();
      const sp = plain.map(w3Std), sa = withA.map(w3Std);
      cvC.draw = () => {
        const T = Calc.plot(cvC, { xmin: -2.5, xmax: K + 1.5, ymin: -0.22, ymax: 2.15, xname: "rétegek", yname: "szórás", xstep: 5, ystep: 0.5 }, [
          { vline: k, color: "--muted", dash: [4, 4], width: 1.2 }]);
        polyline(cvC.ctx, T, sp.map((v, i) => [i, v]), css("--accent"), 2.2);
        if (useA) polyline(cvC.ctx, T, sa.map((v, i) => [i, v]), css("--setB"), 2.2, [6, 4]);
        dot(cvC.ctx, T.tx(k), T.ty(sp[k]), 4.5, css("--accent"));
        if (useA) dot(cvC.ctx, T.tx(k), T.ty(sa[k]), 4.5, css("--setB"));
        /* jelmagyarázat a jobb felső sarokban */
        const lx = cvC.w - 12, ctx = cvC.ctx;
        const leg = [["csak átlagolás", css("--accent"), []]].concat(useA ? [["α = " + w3F(al, 2), css("--setB"), [6, 4]]] : []);
        leg.forEach(([t, col, dash], j) => {
          const y = 16 + 18 * j;
          ctx.font = "600 12px system-ui, sans-serif";
          const tw = ctx.measureText(t).width;
          ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.setLineDash(dash);
          ctx.beginPath(); ctx.moveTo(lx - tw - 34, y); ctx.lineTo(lx - tw - 8, y); ctx.stroke(); ctx.restore();
          label(ctx, t, lx, y, col, "right", "600 12px system-ui, sans-serif", "middle");
        });
      };
      cvC.draw();
      const far = w3Smooth(NB, X, useA ? al : 0, 400)[400];
      out.innerHTML = `${k} réteg után: ` + H.map((v, i) => `${W3_RUN.names[i]} = <b>${w3F(v[0], 3)}</b>`).join(" · ") +
        `<br>szórás: <b>${w3F(w3Std(H), 3)}</b> <span class="muted">(kezdetben ${w3F(sp[0], 3)})</span>` +
        `<br><span class="muted">határérték (∞ réteg): ` + (useA && al > 0
          ? "(" + far.map(v => w3F(v[0], 3)).join("; ") + `), szórás ${w3F(w3Std(far), 3)} – a csúcsok különbözők maradnak.`
          : `minden csúcs → ${w3F(far[0][0], 3)} (= 13/15, az x fokszámmal súlyozott átlaga; önhurkos fokszámok 3, 4, 3, 3, 2) – szórás → 0.`) + "</span>";
      if (KD) drawKarate();
    }
    function drawKarate() {
      const a = useA ? al : 0, seq = w3Smooth(KNB, KX, a, k), Hk = seq[k];
      cvS.draw = () => {
        const view = eqView(cvS, 0, 0, 1.12, 1.12, { xname: "h₁", yname: "h₂", xstep: 0.5, ystep: 0.5 });
        const T = Calc.plot(cvS, view, []);
        const ctx = cvS.ctx;
        KX.forEach(([x, y], i) => dot(ctx, T.tx(x), T.ty(y), 2.6, rgba(KD.club[i] ? css("--setB") : css("--setA"), 0.28)));
        Hk.forEach(([x, y], i) => dot(ctx, T.tx(x), T.ty(y), 5, KD.club[i] ? css("--setB") : css("--setA")));
        Hk.forEach(([x, y], i) => ring(ctx, T.tx(x), T.ty(y), 5, css("--card"), 1));
        [0, 33].forEach(i => label(ctx, String(i + 1), T.tx(Hk[i][0]) + 7, T.ty(Hk[i][1]) - 3, css("--text"), "left", "700 12px system-ui, sans-serif"));
      };
      cvS.draw();
      const cen = c => [0, 1].map(d => { const m = Hk.filter((_, i) => KD.club[i] === c); return m.reduce((s, p) => s + p[d], 0) / m.length; });
      const c0 = cen(0), c1 = cen(1);
      out2.innerHTML = `${k} réteg után: átlagos távolság a súlyponttól <b>${w3F(w3Spread(Hk), 3)}</b> <span class="muted">(kezdetben ${w3F(w3Spread(KX), 3)})</span>` +
        ` · a két klub középpontjának távolsága: <b>${w3F(Math.hypot(c0[0] - c1[0], c0[1] - c1[1]), 3)}</b>` +
        `<br><span class="muted">Halvány pontok: a kiindulási helyzet. Néhány réteg után a klubok csoportokba húzódnak (ezért hasznos az átlagolás), ` +
        `sok réteg után viszont minden pont egybeolvad${useA && al > 0 ? " – hacsak a visszacsatolás nem tartja szét őket" : ""}.</span>`;
    }
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
