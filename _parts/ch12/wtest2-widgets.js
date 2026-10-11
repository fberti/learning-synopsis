/* =========================================================
   Mesterséges intelligencia 12. fejezet – interaktív szemléltetések
   (szövegből számok, beágyazások, rekurrens hálók, figyelem, önfigyelem,
   pozíciókódolás, Transformer-blokk, filmkritika-kísérlet)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); adatok: glove-data.js (GLOVE12), real-attention.js (REAL12), review-models.js (REVIEW12).
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
     w2 – figyelem a fordításban, Q–K–V kézzel, pozíciókódolás, huBERT
     ================================================================== */

  /* ------------------------------------------------------------------
     w2Heat – újrahasznosítható hőtérkép (canvas)
       o = { data: [[v|null]], rowLabels, colLabels, rowStyle(i), colStyle(j) → {color, bold},
             scale: v → [colVar, t]  (alap: --accent, t = (v − lo)/(hi − lo)),  range: [lo, hi],
             digits, showVals (true), minCell, maxCell, cellH (szám vagy cell → szám), maxW,
             selRow, markRowMax, onHover(r, c) / onHover(null), onClick(r, c) }
     ------------------------------------------------------------------ */
  function w2Heat(parent, o) {
    const wrap = h("div", { style: "overflow-x:auto;max-width:100%;margin:.4rem 0" });
    const c = h("canvas", { style: "display:block;touch-action:manipulation" });
    wrap.append(c); parent.append(wrap);
    const ctx = c.getContext("2d");
    const st = Object.assign({ digits: 2, showVals: true, minCell: 4, maxCell: 56, maxW: 760, range: [0, 1], markRowMax: false }, o);
    let G = null, hov = null;
    const FONT = "11px system-ui, sans-serif", FONTB = "600 11px system-ui, sans-serif";
    const tOf = v => {
      if (st.scale) return st.scale(v);
      const [lo, hi] = st.range;
      return ["--accent", clamp((v - lo) / ((hi - lo) || 1), 0, 1)];
    };
    function layout() {
      const R = st.data.length, C = R ? st.data[0].length : 0;
      const avail = Math.min(st.maxW, Math.max(220, parent.clientWidth || 600));
      ctx.font = FONTB;
      const rl = st.rowLabels || [], cl = st.colLabels || [];
      const lw = rl.length ? Math.ceil(Math.max(...rl.map(s => ctx.measureText(s).width))) + 8 : 2;
      const cw = cl.length ? Math.ceil(Math.max(...cl.map(s => ctx.measureText(s).width))) : 0;
      let cell = Math.floor(clamp((avail - lw - 4 - (cl.length ? Math.min(cw * 0.5, 40) : 0)) / Math.max(1, C), st.minCell, st.maxCell));
      const cellH = Math.max(3, Math.round(typeof st.cellH === "function" ? st.cellH(cell) : (st.cellH || cell)));
      const rot = cl.length && cw + 6 > cell;
      const top = !cl.length ? 3 : rot ? Math.ceil(cw * 0.87) + 10 : 18;
      const padR = rot ? Math.ceil(cw * 0.5) + 4 : 4;
      const kc = !cl.length ? 1 : rot ? Math.max(1, Math.ceil(13 / (cell * 0.87))) : Math.max(1, Math.ceil((cw + 6) / cell));
      const kr = Math.max(1, Math.ceil(13 / cellH));
      G = { R, C, lw, cell, cellH, rot, top, padR, kc, kr, W: lw + C * cell + padR, H: top + R * cellH + 3 };
    }
    function draw() {
      if (!G) layout();
      const dpr = window.devicePixelRatio || 1, { R, C, lw, cell, cellH, top } = G;
      c.width = Math.round(G.W * dpr); c.height = Math.round(G.H * dpr);
      c.style.width = G.W + "px"; c.style.height = G.H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, G.W, G.H);
      const txt = css("--text"), mut = css("--muted"), brd = css("--border"), soft = css("--bg-soft");
      const showV = st.showVals && cell >= 34 && cellH >= 18;
      for (let r = 0; r < R; r++) {
        let mx = -1;
        if (st.markRowMax) st.data[r].forEach((v, j) => { if (v != null && (mx < 0 || v > st.data[r][mx])) mx = j; });
        for (let j = 0; j < C; j++) {
          const v = st.data[r][j], x = lw + j * cell, y = top + r * cellH;
          if (v == null) {
            ctx.fillStyle = soft; ctx.fillRect(x, y, cell, cellH);
            ctx.save(); ctx.beginPath(); ctx.rect(x, y, cell, cellH); ctx.clip();
            ctx.strokeStyle = brd; ctx.lineWidth = 1;
            for (let k = -cellH; k < cell; k += 6) { ctx.beginPath(); ctx.moveTo(x + k, y + cellH); ctx.lineTo(x + k + cellH, y); ctx.stroke(); }
            ctx.restore();
            continue;
          }
          const [cv, t] = tOf(v);
          ctx.fillStyle = mix(cv, t); ctx.fillRect(x, y, cell, cellH);
          if (showV) label(ctx, st.fmtVal ? st.fmtVal(v) : fmt(v, st.digits), x + cell / 2, y + cellH / 2, ink(t), "center", "11px system-ui, sans-serif", "middle");
          if (j === mx) { ctx.save(); ctx.strokeStyle = txt; ctx.lineWidth = 1.6; ctx.strokeRect(x + 1.5, y + 1.5, cell - 3, cellH - 3); ctx.restore(); }
        }
      }
      if (cell >= 10 && cellH >= 10) {               // vékony rács
        ctx.strokeStyle = css("--card"); ctx.lineWidth = 1; ctx.beginPath();
        for (let j = 1; j < C; j++) { ctx.moveTo(lw + j * cell + 0.5, top); ctx.lineTo(lw + j * cell + 0.5, top + R * cellH); }
        for (let r = 1; r < R; r++) { ctx.moveTo(lw, top + r * cellH + 0.5); ctx.lineTo(lw + C * cell, top + r * cellH + 0.5); }
        ctx.stroke();
      }
      if (st.selRow != null && st.selRow >= 0 && st.selRow < R) {
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2;
        ctx.strokeRect(lw - 1, top + st.selRow * cellH - 1, C * cell + 2, cellH + 2); ctx.restore();
      }
      if (hov) {
        ctx.save(); ctx.strokeStyle = txt; ctx.lineWidth = 2;
        ctx.strokeRect(lw + hov[1] * cell + 1, top + hov[0] * cellH + 1, cell - 2, cellH - 2); ctx.restore();
      }
      // feliratok
      const rl = st.rowLabels || [], cl = st.colLabels || [];
      rl.forEach((s, r) => {
        const on = hov && hov[0] === r;
        if (r % G.kr && !on) return;
        const sty = (st.rowStyle && st.rowStyle(r)) || {};
        label(ctx, s, lw - 5, top + r * cellH + cellH / 2, on ? css("--accent") : (sty.color || txt), "right", sty.bold || on ? FONTB : FONT, "middle");
      });
      cl.forEach((s, j) => {
        const on = hov && hov[1] === j;
        if (j % G.kc && !on) return;
        const sty = (st.colStyle && st.colStyle(j)) || {};
        const col = on ? css("--accent") : (sty.color || txt), f = sty.bold || on ? FONTB : FONT, x = lw + j * cell + cell / 2;
        if (G.rot) {
          ctx.save(); ctx.translate(x + 2, top - 5); ctx.rotate(-Math.PI / 3);
          label(ctx, s, 0, 0, col, "left", f, "middle"); ctx.restore();
        } else label(ctx, s, x, top - 4, col, "center", f, "bottom");
      });
      void mut;
    }
    const hit = e => {
      const r0 = c.getBoundingClientRect(), x = e.clientX - r0.left, y = e.clientY - r0.top;
      const j = Math.floor((x - G.lw) / G.cell), r = Math.floor((y - G.top) / G.cellH);
      return r >= 0 && r < G.R && j >= 0 && j < G.C ? [r, j] : null;
    };
    const move = e => {
      const p = hit(e);
      if (String(p) === String(hov)) return;
      hov = p; draw(); st.onHover && st.onHover(p ? p[0] : null, p ? p[1] : null);
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerdown", move);
    c.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && hov) { hov = null; draw(); st.onHover && st.onHover(null, null); } });
    c.addEventListener("click", e => { const p = hit(e); if (p && st.onClick) st.onClick(p[0], p[1]); });
    const redraw = () => { layout(); draw(); };
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(redraw, 160); });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return {
      set(p) { Object.assign(st, p); if (hov && (hov[0] >= st.data.length || hov[1] >= (st.data[0] || []).length)) hov = null; redraw(); },
      get hover() { return hov; },
      redraw
    };
  }

  /* kis segédek */
  const w2Note = (html, extra = "") => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0" + extra, html });
  const w2Src = txt => h("p", { class: "muted", style: "font-size:.8rem;margin:.5rem 0 0" }, "Forrás: " + txt);
  const w2Sel = (opts, val, onch) => {
    const s = h("select", { onchange: () => onch(s.value) });
    opts.forEach(([v, t]) => s.append(h("option", { value: v }, t)));
    s.value = val; return s;
  };
  const w2Lab = (txt, ...kids) => h("label", null, txt, ...kids);
  const w2Esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w2F = (x, d) => (Object.is(+x.toFixed(d), -0) ? 0 : x).toFixed(d).replace(".", ",").replace("-", "−");
  const w2Mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  /* SentencePiece-token megjelenítése: „▁” = szó eleje; szó belseji darab elé „·” */
  const w2Piece = t => {
    if (t === "</s>") return { s: "</s>", inner: false, special: true };
    if (t.startsWith("▁")) return { s: t.slice(1), inner: false };
    return /[\p{L}\p{N}]/u.test(t) ? { s: "·" + t, inner: true } : { s: t, inner: false };
  };
  /* WordPiece (BERT): „##” = szó belseji darab */
  const w2WP = t => (t.startsWith("##") ? { s: "·" + t.slice(2), inner: true } : { s: t, inner: false, special: /^\[(CLS|SEP)\]$/.test(t) });

  /* ------------------------------------------------------------------
     12.4-c  translation-attention – valódi keresztfigyelem (opus-mt-hu-en)
     ------------------------------------------------------------------ */
  W["translation-attention"] = root => {
    const D = window.REAL12 && window.REAL12.mt;
    if (!D) { root.append(small("Hiányzik a real-attention.js adatfájl.")); return; }
    header(root, "Figyelem fordítás közben: hova néz a modell?",
      "Egy valódi magyar → angol fordítómodell <b>keresztfigyelme</b>, miközben a saját fordítását írja, szóról szóra. <b>Sor</b> = az épp leírt angol szó " +
      "(az első sor a ⟨kezdés⟩ jel): a modell ennek feldolgozásakor ennyire figyel a forrásmondat egyes <b>magyar</b> tokenjeire (oszlopok), mielőtt a következő szót választja. Egy sor összege 1. " +
      "A keretes cella a sor legnagyobb súlya. A „·” jelű darab egy szó belseje: a tokenizáló a ritkább szavakat darabokra vágja. Vidd az egeret (koppints) egy cellára!");
    const keys = Object.keys(D);
    let sent = keys[0], layer = 2, view = "avg", hideEos = false;
    const selS = w2Sel(keys.map(k => [k, k]), sent, v => { sent = v; sync(); });
    selS.style.cssText = "max-width:100%;min-width:0";
    const gL = toggleGroup([0, 1, 2, 3, 4, 5].map(i => [String(i), String(i + 1)]), () => layer, k => { layer = +k; if (view !== "avg" && !D[sent].heads[String(layer)]) view = "avg"; sync(); });
    const gV = toggleGroup([["avg", "8 fej átlaga"], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => [String(i), (i + 1) + ". fej"])], () => view, k => { view = k; sync(); });
    const cb = checkbox(false, () => { hideEos = cb.checked; sync(); });
    const trans = h("div", { class: "readout", style: "margin-top:.2rem;font-family:inherit" });
    root.append(h("div", { class: "controls" }, small("mondat:"), selS),
      trans,
      h("div", { class: "controls" }, small("dekóderréteg:"), gL.bs, small("(a 3. rétegben a legtisztább a szóigazítás)")),
      h("div", { class: "controls" }, small("nézet:"), gV.bs),
      h("div", { class: "controls" }, h("label", null, cb, "a </s> oszlop elrejtése (sorok újranormálva)")));
    const headNote = w2Note("", ";margin-top:-.2rem");
    root.append(headNote);
    const box = h("div");
    root.append(h("div", { class: "muted", style: "font-size:.84rem;margin-top:.5rem" }, "sorok: az épp leírt angol token (a dekóder bemenete) · oszlopok: magyar tokenek (amire figyel)"), box);
    const out = h("div", { class: "readout" });
    root.append(out);
    let M = null, src = [], tgt = [];
    const hm = w2Heat(box, {
      data: [[0]], markRowMax: true, digits: 2, maxCell: 54, cellH: c => Math.min(c, 34),
      rowStyle: r => (tgt[r] && (tgt[r].inner || tgt[r].special) ? { color: css("--muted") } : null),
      colStyle: j => (src[j] && (src[j].inner || src[j].special) ? { color: css("--muted") } : null),
      onHover: (r, c) => readout(r, c)
    });
    const pairLink = (k, txt) => {
      const a = h("a", { href: "#", onclick: e => { e.preventDefault(); sent = k; selS.value = k; sync(); } }, txt);
      return a;
    };
    const pair = h("div", { class: "box tip", style: "margin:.7rem 0 0;font-size:.9rem" });
    const k1 = "Lehullott a levél a fáról.", k2 = "Lehullott egy sárga levél a fáról.";
    if (D[k1] && D[k2]) {
      pair.append(h("b", null, "Figyeld ezt a párt! "),
        pairLink(k1, "„Lehullott a levél a fáról.”"), " → „", D[k1].translation, "” ",
        h("span", { style: "color:var(--bad);font-weight:600" }, "(hibás: letter = levél mint küldemény!)"), " · ",
        pairLink(k2, "„Lehullott egy sárga levél a fáról.”"), " → „", D[k2].translation, "” ",
        h("span", { style: "color:var(--setC);font-weight:600" }, "(jó)"), ". ",
        "Ugyanaz a „levél” szó, de a „sárga” elég kontextus ahhoz, hogy a modell a falevelet válassza. Nézd meg a „letter” és a „leaf” sorát: ",
        h("span", { html: "mindkettő a „levél” oszlopra néz – a figyelem azt mutatja, <i>honnan</i> veszi az információt, azt nem, hogy jól dönt-e." }));
      root.append(pair);
    }
    root.append(w2Note("<b>Miért olyan sötét a </s> oszlop?</b> Sok fej a mondatvégi <code>&lt;/s&gt;</code> tokenre „teszi le” a súlya nagy részét, ha éppen " +
      "nincs mit keresnie – ez egyfajta <b>figyelemnyelő</b> (angolul <i>attention sink</i>). Rejtsd el az oszlopot: a maradék súlyokat soronként újra 1-re normálva " +
      "sokkal jobban látszik, melyik angol szó melyik magyar szóhoz igazodik."));
    root.append(w2Src(window.REAL12.src.mt));

    function sync() {
      const d = D[sent], hasHeads = !!d.heads[String(layer)];
      if (!hasHeads) view = "avg";
      gL.paint(); gV.paint();
      gV.bs.forEach(b => b.dataset.key !== "avg" && setDis(b, !hasHeads));
      headNote.innerHTML = hasHeads ? "Ebben a rétegben az egyes fejeket is megnézheted: mindegyik másra figyel." :
        "Az egyes fejek külön csak a 3. és a 4. rétegben érhetők el; itt a 8 fej átlagát látod.";
      let A = view === "avg" ? d.avg[layer] : d.heads[String(layer)][+view];
      src = d.src.map(w2Piece); tgt = [{ s: "⟨kezdés⟩", inner: false, special: true }, ...d.tgt.slice(0, -1).map(w2Piece)];
      let srcShown = src;
      if (hideEos) {
        const e = d.src.indexOf("</s>");
        A = A.map(row => { const r = row.filter((_, j) => j !== e), s = r.reduce((a, b) => a + b, 0) || 1; return r.map(v => v / s); });
        srcShown = src.filter((_, j) => j !== e);
      }
      M = A;
      src = srcShown;
      const mx = Math.max(...A.flat());
      hm.set({ data: A, rowLabels: tgt.map(t => t.s), colLabels: src.map(t => t.s), range: [0, mx] });
      trans.innerHTML = `<span class="muted">magyar:</span> ${w2Esc(sent)}<br><span class="muted">a modell fordítása:</span> <b style="color:var(--text)">${w2Esc(d.translation)}</b>`;
      readout(null, null);
    }
    function readout(r, c) {
      const qs = s => `„${w2Esc(s)}”`;
      if (r == null) {
        const pairs = M.map((row, i) => { const j = argmax(row); return `${qs(tgt[i].s)}→${qs(src[j].s)}`; });
        out.innerHTML = `<span class="muted">soronként a legerősebb kapcsolat:</span> ${pairs.join(" · ")}` +
          `<br><span class="muted">színskála: háttérszín = 0 … legerősebb szín = ${fmt(Math.max(...M.flat()), 2)} (a mátrix legnagyobb súlya)</span>`;
        return;
      }
      const v = M[r][c], j = argmax(M[r]);
      const nxt = window.REAL12.mt[sent].tgt[r], prev = r ? `a(z) ${qs(tgt[r].s)} leírása után` : "a kezdéskor";
      out.innerHTML = `${prev} (a következő token: ${qs(w2Piece(nxt).s)}) ennyit figyel a(z) ${qs(src[c].s)} tokenre: <b>${fmt(v, 3)}</b> (a sor ${pct(v, 1)}-a)` +
        `<br><span class="muted">ennek a sornak a legnagyobb súlya: ${qs(src[j].s)} – ${fmt(M[r][j], 3)}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     12.5-a/b, 12.6-b  qkv-calculator – önfigyelem kézzel, három tokenre
     ------------------------------------------------------------------ */
  const W2_QKV_S = {
    A: { toks: ["fa", "levél", "hullik"], X: [[2, 0], [1, 1], [1, 0]] },
    B: { toks: ["posta", "levél", "érkezik"], X: [[0, 2], [1, 1], [0, 1]] }
  };
  const w2I = () => [[1, 0], [0, 1]];
  const w2MatMul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
  function w2Attn(X, WQ, WK, WV, scale, causal) {
    const Q = w2MatMul(X, WQ), K = w2MatMul(X, WK), V = w2MatMul(X, WV), d = WK[0].length;
    const S = Q.map(q => K.map(k => dotp(q, k)));
    const Ss = S.map(r => r.map(v => (scale ? v / Math.sqrt(d) : v)));
    const Sm = Ss.map((r, i) => r.map((v, j) => (causal && j > i ? -Infinity : v)));
    const A = Sm.map(r => softmax(r));
    const O = w2MatMul(A, V);
    return { Q, K, V, S, Ss, Sm, A, O };
  }
  const w2TOKC = ["--setA", "--accent", "--setC"];

  W["qkv-calculator"] = root => {
    header(root, "Önfigyelem kézzel: Q, K, V három tokenre",
      "Három token, mindegyik egy kétdimenziós vektor (az $X$ sorai). A $W_Q, W_K, W_V$ mátrixokkal kapjuk a kérdés- (Q), kulcs- (K) és értékvektorokat (V); " +
      "a pontszám $QK^{\\mathsf T}$, ezt $\\sqrt d$-vel osztjuk, soronként softmaxoljuk, végül a súlyokkal átlagoljuk a V sorait: " +
      "$O = \\operatorname{softmax}\\!\\big(QK^{\\mathsf T}/\\sqrt d\\big)\\,V$. <b>Kattints egy sorra</b> (egy tokenre), és lent végigkövetheted a számolását. Írd át a számokat is!");
    const state = { s: "A", X: { A: W2_QKV_S.A.X.map(r => r.slice()), B: W2_QKV_S.B.X.map(r => r.slice()) },
      WQ: w2I(), WK: w2I(), WV: w2I(), scale: true, causal: false, sel: 1 };
    const gS = toggleGroup([["A", "A: fa · levél · hullik"], ["B", "B: posta · levél · érkezik"]], () => state.s, k => { state.s = k; buildInputs(); sync(); });
    const cS = checkbox(true, () => { state.scale = cS.checked; sync(); });
    const cM = checkbox(false, () => { state.causal = cM.checked; sync(); });
    const setW = (q, k, v) => { state.WQ = q; state.WK = k; state.WV = v; buildInputs(); sync(); };
    root.append(h("div", { class: "controls" }, small("mondat:"), gS.bs),
      h("div", { class: "controls" }, h("label", null, cS, "÷ √d skálázás (d = 2)"), h("label", null, cM, "kauzális maszk (csak visszafelé nézhet)")),
      h("div", { class: "controls" }, small("súlymátrixok:"),
        btn("egységmátrix", () => setW(w2I(), w2I(), w2I())),
        btn("más W-k", () => setW([[1, 0], [0, 0.5]], [[1, 1], [0, 1]], w2I())),
        btn("alapértékek", () => { state.X[state.s] = W2_QKV_S[state.s].X.map(r => r.slice()); state.scale = true; state.causal = false; cS.checked = true; cM.checked = false; setW(w2I(), w2I(), w2I()); })));
    const inBox = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem 1.2rem;align-items:flex-start;margin:.3rem 0" });
    const stepBox = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem 1.1rem;align-items:flex-start;margin:.6rem 0" });
    const out = h("div", { class: "readout" });
    const cvWrap = h("div", { style: "max-width:440px;margin:.6rem auto 0" });
    const legend = h("div", { class: "muted", style: "font-size:.84rem;text-align:center" });
    const stats = h("div", { class: "stat-row" });
    root.append(inBox, stepBox, out, cvWrap, legend, stats);
    const cv = Calc.canvas(cvWrap, 0.8, 440);
    cv.draw = () => drawPlot();
    const TD = "padding:.15rem .4rem;text-align:right;font-family:var(--mono);font-size:.84rem;border:1px solid var(--border);white-space:nowrap";
    const TH = "padding:.15rem .4rem;font-size:.78rem;color:var(--muted);font-weight:600;text-align:left;white-space:nowrap";
    const toks = () => W2_QKV_S[state.s].toks;
    const num = (val, onset) => {
      const i = h("input", { type: "number", step: "0.5", value: String(val), style: "width:4.2em;padding:.15rem .3rem;font-size:.88rem" });
      i.addEventListener("input", () => { const v = parseFloat(String(i.value).replace(",", ".")); if (Number.isFinite(v)) { onset(v); sync(); } });
      return i;
    };
    const titled = (title, el) => h("div", { style: "min-width:0" }, h("div", { style: "font-size:.85rem;font-weight:600;margin-bottom:.2rem", html: title }), el);
    function buildInputs() {
      gS.paint();
      const X = state.X[state.s], tk = toks();
      const tx = h("table", { style: "margin:0;border-collapse:collapse" },
        h("tr", null, h("th", { style: TH }), h("th", { style: TH }, "x₁"), h("th", { style: TH }, "x₂")),
        ...X.map((r, i) => h("tr", null, h("th", { style: TH + `;color:var(${w2TOKC[i]})` }, tk[i]),
          ...r.map((v, j) => h("td", { style: "padding:.1rem" }, num(v, nv => { X[i][j] = nv; }))))));
      const wTab = (key) => h("table", { style: "margin:0;border-collapse:collapse" },
        ...state[key].map((r, i) => h("tr", null, ...r.map((v, j) => h("td", { style: "padding:.1rem" }, num(v, nv => { state[key][i][j] = nv; }))))));
      inBox.replaceChildren(titled("bemenet $X$ (soronként egy token)", tx), titled("$W_Q$", wTab("WQ")), titled("$W_K$", wTab("WK")), titled("$W_V$", wTab("WV")));
      math(inBox);
    }
    /* egy lépés táblázata; kattintható sorok */
    function stepTable(title, M, cols, opt = {}) {
      const tk = toks();
      const trs = M.map((r, i) => {
        const tr = h("tr", { style: "cursor:pointer" + (opt.rowSel !== false && i === state.sel ? ";outline:2px solid var(--accent);outline-offset:-1px" : "") },
          h("th", { style: TH + `;color:var(${w2TOKC[i]})` }, tk[i]),
          ...r.map((v, j) => {
            const masked = v === -Infinity || (opt.mask && opt.mask(i, j));
            let bg = "", col = "";
            if (opt.shade && !masked) { const t = clamp(v, 0, 1); bg = `;background:${mix("--accent", t)}`; col = `;color:${ink(t)}`; }
            if (masked) { bg = ";background:var(--bg-soft)"; col = ";color:var(--muted)"; }
            const txt = masked ? (opt.maskTxt || "−∞") : fmt(v, opt.d == null ? 3 : opt.d);
            return h("td", { style: TD + bg + col + (masked ? ";font-size:.76rem" : "") }, txt);
          }));
        tr.addEventListener("click", () => { state.sel = i; sync(); });
        return tr;
      });
      const tbl = h("table", { style: "margin:0;border-collapse:collapse" },
        h("tr", null, h("th", { style: TH }), ...cols.map(c => h("th", { style: TH + ";text-align:center" }, c))), ...trs);
      return titled(title, h("div", { class: "tw", style: "overflow-x:auto" }, tbl));
    }
    let R = null;
    const vecTxt = v => `(${fmt(v[0], 3)}; ${fmt(v[1], 3)})`;
    function sync() {
      const X = state.X[state.s];
      R = w2Attn(X, state.WQ, state.WK, state.WV, state.scale, state.causal);
      const tk = toks(), d2 = ["1", "2"], kc = tk.map(t => "k·" + t);
      const masked = (i, j) => state.causal && j > i;
      stepBox.replaceChildren(
        stepTable("1. $Q = XW_Q$", R.Q, d2),
        stepTable("$K = XW_K$", R.K, d2, { rowSel: false }),
        stepTable("$V = XW_V$", R.V, d2, { rowSel: false }),
        stepTable("2. pontszám $QK^{\\mathsf T}$", R.S, tk),
        stepTable(state.scale ? "3. skálázva: $\\div\\sqrt2$" : "3. skálázás nélkül", R.Sm, tk),
        stepTable("4. softmax-súlyok", R.A, tk, { shade: true, mask: masked, maskTxt: "−∞ → 0" }),
        stepTable("5. kimenet $O$ = súlyok · $V$", R.O, d2));
      math(stepBox);
      void kc;
      const i = state.sel, w = R.A[i], o = R.O[i];
      const sc = R.S[i].map((v, j) => (masked(i, j) ? `<span class="muted">${tk[j]}: maszk</span>` : `${tk[j]}: ${fmt(v, 3)}`)).join(" · ");
      const ss = R.Sm[i].map(v => (v === -Infinity ? "−∞" : fmt(v, 3))).join("; ");
      out.innerHTML = `<b>${tk[i]}</b> kérdése: q = ${vecTxt(R.Q[i])} · pontszámok q·k: ${sc}` +
        `<br>${state.scale ? "÷ √2" : "skálázás nélkül"}${state.causal ? " + maszk" : ""}: (${ss}) → softmax: (${w.map(v => fmt(v, 3)).join("; ")})` +
        `<br><b>${tk[i]}</b>: ${w.map((v, j) => `${fmt(v, 3)} · ${tk[j]}`).join(" + ")} = <b>${vecTxt(o)}</b>` +
        `<br><span class="muted">(a jobb oldalon a tokenek V-vektorai szerepelnek; most v<sub>${tk[0]}</sub> = ${vecTxt(R.V[0])} stb.)</span>`;
      // a „levél” kimenete mindkét mondatban
      const RA = w2Attn(state.X.A, state.WQ, state.WK, state.WV, state.scale, state.causal);
      const RB = w2Attn(state.X.B, state.WQ, state.WK, state.WV, state.scale, state.causal);
      const cIn = cosine(state.X.A[1], state.X.B[1]), cOut = cosine(RA.O[1], RB.O[1]);
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        stat(w2F(cIn, 3), "cos(levél A, levél B) – a bemenetek"),
        stat(w2F(cOut, 3), "cos(levél′ A, levél′ B) – a figyelem után"));
      legend.innerHTML = `teli nyíl: bemenet (X sora) · karika: kimenet (O sora) · szaggatott: elmozdulás · halvány karika: a másik mondat „levél′”-e`;
      drawPlot(RA, RB);
    }
    function drawPlot() {
      if (!R) return;
      const X = state.X[state.s], O = R.O, oth = state.s === "A" ? "B" : "A";
      const Ro = w2Attn(state.X[oth], state.WQ, state.WK, state.WV, state.scale, state.causal);
      const ghost = Ro.O[1];
      const pts = [[0, 0], ...X, ...O, ghost];
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const view = eqView(cv, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.6, (y1 - y0) / 2 + 0.6, { xname: "1. koord.", yname: "2. koord." });
      const T = Calc.plot(cv, view, []);
      const { ctx } = cv, tk = toks(), mut = css("--muted");
      const [gx, gy] = [T.tx(ghost[0]), T.ty(ghost[1])];
      ring(ctx, gx, gy, 6, rgba(css("--accent"), 0.45), 2, [3, 3]);
      label(ctx, `levél′ (${oth})`, gx + 8, gy + 14, mut, "left", "11px system-ui, sans-serif");
      X.forEach((x, i) => {
        const col = css(w2TOKC[i]), on = i === state.sel;
        arrow(ctx, T.tx(0), T.ty(0), T.tx(x[0]), T.ty(x[1]), on ? col : rgba(col, 0.55), on ? 2.6 : 1.8);
      });
      X.forEach((x, i) => {
        const col = css(w2TOKC[i]), on = i === state.sel, o = O[i];
        ctx.save(); ctx.setLineDash([4, 3]);
        arrow(ctx, T.tx(x[0]), T.ty(x[1]), T.tx(o[0]), T.ty(o[1]), on ? col : rgba(col, 0.45), on ? 1.6 : 1);
        ctx.restore();
        dot(ctx, T.tx(o[0]), T.ty(o[1]), on ? 6.5 : 5, col, true, on ? 3 : 2);
      });
      // feliratok: a bemenetnél fölé; a kimeneteknél jobbra, egymás alá tolva, ha ütköznének
      X.forEach((x, i) => {
        const col = css(w2TOKC[i]), on = i === state.sel;
        label(ctx, tk[i], T.tx(x[0]) + 6, T.ty(x[1]) - 4, col, "left", (on ? "700 " : "600 ") + "12px system-ui, sans-serif");
      });
      const placed = X.map((x, i) => { ctx.save(); ctx.font = "700 12px system-ui, sans-serif"; const wd = ctx.measureText(tk[i]).width; ctx.restore(); return [T.tx(x[0]) + 6, T.ty(x[1]) - 11, wd]; });
      O.map((o, i) => [i, T.tx(o[0]), T.ty(o[1])]).sort((a, b) => a[2] - b[2]).forEach(([i, px, py]) => {
        const col = css(w2TOKC[i]), on = i === state.sel, f = (on ? "700 " : "600 ") + "11px system-ui, sans-serif";
        ctx.save(); ctx.font = f; const wd = ctx.measureText(tk[i] + "′").width; ctx.restore();
        let lx = px + 10, ly = py + 4;
        for (let k = 0; k < 6; k++) {
          const hitL = placed.find(b => lx < b[0] + b[2] + 4 && b[0] < lx + wd + 4 && Math.abs(ly - b[1]) < 13);
          if (!hitL) break;
          ly = hitL[1] + 13;
        }
        placed.push([lx, ly, wd]);
        if (Math.abs(ly - py - 4) > 2) polyline(ctx, { tx: v => v, ty: v => v }, [[px + 5, py], [lx - 1, ly - 4]], rgba(col, 0.6), 1);
        label(ctx, tk[i] + "′", lx, ly, col, "left", f, "middle");
      });
    }
    buildInputs();
    sync();
    new MutationObserver(() => sync()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  };

  /* ------------------------------------------------------------------
     12.5-c  positional-encoding – szinuszos pozíciókódolás
     ------------------------------------------------------------------ */
  const w2PE = (pos, k, d) => { const i = Math.floor(k / 2), a = pos / Math.pow(10000, (2 * i) / d); return k % 2 ? Math.cos(a) : Math.sin(a); };
  W["positional-encoding"] = root => {
    header(root, "Szinuszos pozíciókódolás",
      "Minden pozíció kap egy $d$ hosszú vektort: $PE(pos, 2i) = \\sin\\!\\big(pos/10000^{2i/d}\\big)$, $PE(pos, 2i+1) = \\cos\\!\\big(pos/10000^{2i/d}\\big)$. " +
      "A hőtérkép egy sora egy pozíció vektora (<b style='color:var(--setA)'>kék</b> = −1, háttérszín = 0, <b style='color:var(--setB)'>narancs</b> = +1). " +
      "Vidd az egeret egy cellára; kattints egy sorra, és lent látod, mennyire hasonlít ez a pozíció a többihez.");
    let n = 32, d = 16, p = 5;
    const sN = slider(8, 64, 1, n), sD = slider(4, 64, 2, d), oN = h("b"), oD = h("b");
    sN.addEventListener("input", () => { n = +sN.value; p = Math.min(p, n - 1); sync(); });
    sD.addEventListener("input", () => { d = +sD.value; sync(); });
    root.append(h("div", { class: "controls" }, w2Lab("pozíciók száma n:", sN, oN), w2Lab("dimenzió d:", sD, oD)));
    const box = h("div");
    root.append(h("div", { class: "muted", style: "font-size:.84rem" }, "sorok: pozíció 0 … n − 1 · oszlopok: dimenzió 0 … d − 1 (páros: sin, páratlan: cos)"), box);
    const out = h("div", { class: "readout" });
    root.append(out);
    const hm = w2Heat(box, {
      data: [[0]], showVals: false, minCell: 4, maxCell: 30, cellH: c => clamp(Math.min(c, 330 / n), 4, 22),
      scale: v => [v < 0 ? "--setA" : "--setB", Math.abs(v)],
      onHover: (r, c) => readout(r, c),
      onClick: r => { p = r; sP.value = p; sync(); }
    });
    root.append(w2Note("Az első dimenziók <b>gyorsan ketyegnek, mint a másodpercmutató</b> (szomszédos pozíciók is eltérnek), az utolsók <b>lassan, mint az óramutató</b> " +
      "(csak távoli pozíciókat különböztetnek meg). Együtt minden pozíciónak egyedi „órája” van."));
    // második panel: koszinusz-hasonlóság
    const sP = slider(0, n - 1, 1, p), oP = h("b");
    sP.addEventListener("input", () => { p = +sP.value; sync(); });
    root.append(h("div", { class: "controls", style: "margin-top:1rem" }, w2Lab("kiválasztott pozíció p:", sP, oP)));
    const cvBox = h("div");
    root.append(cvBox);
    const cv = Calc.canvas(cvBox, flatAspect(root, 0.42, 0.62), 760);
    const out2 = h("div", { class: "readout" });
    root.append(out2);
    // fix táblázat (d = 4)
    const fixed = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.8rem" });
    const TD = "padding:.2rem .5rem;font-family:var(--mono);font-size:.84rem;text-align:right;border-bottom:1px solid var(--border);white-space:nowrap";
    const th = t => h("th", { style: "padding:.2rem .5rem;font-size:.8rem;text-align:right;white-space:nowrap" }, t);
    fixed.append(h("div", { style: "font-size:.88rem;font-weight:600;margin-bottom:.2rem" }, "Kézzel is ellenőrizhető: d = 4, pozíciók 0–3"),
      h("table", { style: "margin:0;border-collapse:collapse" },
        h("tr", null, th("pos"), th("sin(pos)"), th("cos(pos)"), th("sin(pos/100)"), th("cos(pos/100)")),
        ...[0, 1, 2, 3].map(q => h("tr", null, h("td", { style: TD + ";font-weight:700" }, String(q)),
          ...[0, 1, 2, 3].map(k => h("td", { style: TD }, w2F(w2PE(q, k, 4), 4)))))));
    root.append(fixed, w2Note("d = 4 esetén $i = 0$-ra $10000^{0} = 1$, $i = 1$-re $10000^{2/4} = 100$ – innen a két „óra”: $\\sin(pos)$ és $\\sin(pos/100)$."));
    let P = null;
    function sync() {
      oN.textContent = n; oD.textContent = d; sP.max = n - 1; sP.value = p; oP.textContent = p;
      P = Array.from({ length: n }, (_, q) => Array.from({ length: d }, (_, k) => w2PE(q, k, d)));
      hm.set({ data: P, rowLabels: P.map((_, q) => String(q)), colLabels: Array.from({ length: d }, (_, k) => String(k)), selRow: p });
      const hv = hm.hover; readout(hv ? hv[0] : null, hv ? hv[1] : null);
      drawCos();
    }
    function readout(r, c) {
      if (r == null) { out.innerHTML = `<span class="muted">Vidd az egeret egy cellára!</span> Kiválasztott sor: p = ${p} (keretben).`; return; }
      const i = Math.floor(c / 2), den = Math.pow(10000, (2 * i) / d), a = r / den, f = c % 2 ? "cos" : "sin";
      out.innerHTML = `PE(${r}, ${c}) = ${f}(${r} / 10000<sup>${2 * i}/${d}</sup>) = ${f}(${r} / ${fmt(den, den < 10 ? 3 : 1)}) = ${f}(${fmt(a, 4)}) = <b>${fmt(P[r][c], 4)}</b>` +
        `<br><span class="muted">${c}. dimenzió (i = ${i}): periódus 2π·${fmt(den, den < 10 ? 3 : 1)} ≈ ${fmt(2 * Math.PI * den, 1)} pozíció</span>`;
    }
    function drawCos() {
      const cs = P.map(v => cosine(P[p], v));
      const lo = Math.min(0, Math.floor(Math.min(...cs) * 10) / 10 - 0.1);
      const T = Calc.plot(cv, { xmin: -1.5, xmax: n - 0.5, ymin: lo, ymax: 1.12, xname: "q", yname: "cos(PE(p), PE(q))" }, [
        { vline: p, color: "--muted", dash: [4, 4], width: 1.2 },
        { f: x => { const k = clamp(Math.floor(x), 0, n - 2), t = x - k; return cs[k] * (1 - t) + cs[k + 1] * t; }, domain: [0, n - 1], color: "--accent", width: 1.8 },
        { points: cs.map((v, q) => [q, v]), color: "--accent", r: n > 40 ? 2.5 : 3.5 },
        { points: [[p, 1]], color: "--setB", r: 5.5 }
      ]);
      void T;
      const near = p + 1 < n ? cs[p + 1] : cs[p - 1], far = cs.reduce((m, v) => Math.min(m, v), 1);
      out2.innerHTML = `p = ${p}: cos(PE(p), PE(p ± 1)) = <b>${fmt(near, 3)}</b> · legkisebb érték: ${fmt(far, 3)}` +
        `<br><span class="muted">A görbe alakja csak a q − p távolságtól függ: mozgasd p-t, és a minta vele együtt csúszik.</span>`;
    }
    cv.draw = drawCos;
    sync();
  };

  /* ------------------------------------------------------------------
     12.8-b  hubert-context – a „levél” kontextuális vektorai és a figyelem
     ------------------------------------------------------------------ */
  W["hubert-context"] = root => {
    const RD = window.REAL12;
    if (!RD) { root.append(small("Hiányzik a real-attention.js adatfájl.")); return; }
    header(root, "A huBERT belülről: ugyanaz a szó, más jelentés",
      "Hat mondat, mindben szerepel a „levél”: az első háromban <b style='color:var(--setC)'>🍂 falevél</b>, a többiben <b style='color:var(--setB)'>✉️ küldemény</b>. " +
      "A magyar huBERT modell minden rétege után kivettük a „levél” vektorát, és páronként kiszámoltuk a koszinusz-hasonlóságukat. " +
      "A 0. réteg a beágyazási réteg (még nincs kontextus).");
    const sens = i => (i < 3 ? "🍂" : "✉️");
    const senseCol = i => css(i < 3 ? "--setC" : "--setB");
    const shortName = s => { const w = s.replace(/\.$/, "").split(" "); return w.length > 3 ? w.slice(0, 3).join(" ") + "…" : w.join(" "); };
    // (a) rész
    let L = 4;
    const sL = slider(0, 12, 1, L), oL = h("b");
    sL.addEventListener("input", () => { L = +sL.value; syncA(); });
    root.append(h("div", { style: "font-weight:700;margin-top:.6rem" }, "a) Hasonlóság rétegről rétegre"),
      h("div", { class: "controls" }, w2Lab("réteg:", sL, oL)));
    const legendS = h("ol", { style: "font-size:.85rem;margin:.2rem 0 .3rem;padding-left:1.4rem;columns:2 16rem" },
      ...RD.levelSent.map((s, i) => h("li", null, h("span", { style: `color:var(${i < 3 ? "--setC" : "--setB"})` }, sens(i) + " "), s)));
    root.append(legendS);
    const boxA = h("div");
    root.append(boxA);
    const hmA = w2Heat(boxA, {
      data: [[0]], digits: 2, range: [0.7, 1], maxCell: 52, maxW: 460, cellH: c => Math.min(c, 36),
      rowLabels: RD.levelSent.map((s, i) => `${sens(i)} ${i + 1}. ${shortName(s)}`), colLabels: RD.levelSent.map((_, i) => `${sens(i)} ${i + 1}`),
      rowStyle: i => ({ color: senseCol(i) }), colStyle: j => ({ color: senseCol(j) }),
      onHover: (r, c) => readA(r, c)
    });
    const outA = h("div", { class: "readout" });
    const statsA = h("div", { class: "stat-row" });
    root.append(outA, statsA);
    const avgs = RD.levelCos.map(M => {
      const s = [], dd = [];
      for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) ((i < 3) === (j < 3) ? s : dd).push(M[i][j]);
      return [w2Mean(s), w2Mean(dd)];
    });
    root.append(h("div", { class: "muted", style: "font-size:.84rem;margin-top:.7rem" },
      h("b", { style: "color:var(--accent)" }, "● azonos jelentés"), " · ", h("b", { style: "color:var(--setB)" }, "● eltérő jelentés"), " – átlagos koszinusz rétegenként"));
    const cvBox = h("div");
    root.append(cvBox);
    const cvA = Calc.canvas(cvBox, flatAspect(root, 0.4, 0.62), 760);
    root.append(w2Note("<b>Vigyázz az abszolút értékekkel!</b> A BERT-vektorok általában is elég hasonlók egymáshoz (a vektorok egy szűk kúpban állnak – ez az " +
      "<i>anizotrópia</i>), ezért a 0,8 itt nem „kicsi”. A két átlag <b>különbségét</b> nézd: a 0. rétegben (kontextus nélkül) nincs különbség, a középső rétegekben a legnagyobb."));
    function readA(r, c) {
      const M = RD.levelCos[L];
      if (r == null) { outA.innerHTML = `<span class="muted">Vidd az egeret egy cellára! Színskála: 0,7 (háttérszín) … 1 (legerősebb szín).</span>`; return; }
      const same = (r < 3) === (c < 3);
      outA.innerHTML = `${L}. réteg · cos(${sens(r)} ${r + 1}., ${sens(c)} ${c + 1}.) = <b>${fmt(M[r][c], 3)}</b> · ${r === c ? "önmagával" : same ? "azonos jelentés" : "eltérő jelentés"}` +
        `<br><span class="muted">„${w2Esc(RD.levelSent[r])}” ↔ „${w2Esc(RD.levelSent[c])}”</span>`;
    }
    function syncA() {
      oL.textContent = L === 0 ? "0 (beágyazás)" : String(L);
      hmA.set({ data: RD.levelCos[L] });
      readA(null);
      const [a, b] = avgs[L];
      const stat = (v, l, col) => h("div", { class: "stat" }, h("div", { class: "v", style: `color:${col}` }, v), h("div", { class: "l" }, l));
      statsA.replaceChildren(stat(w2F(a, 3), "azonos jelentés (6 pár átlaga)", "var(--accent)"),
        stat(w2F(b, 3), "eltérő jelentés (9 pár átlaga)", "var(--setB)"),
        stat(w2F(a - b, 3), "különbség", "var(--text)"));
      drawA();
    }
    function drawA() {
      const lin = k => x => { const i = clamp(Math.floor(x), 0, 11), t = x - i; return avgs[i][k] * (1 - t) + avgs[i + 1][k] * t; };
      Calc.plot(cvA, { xmin: -0.8, xmax: 13.4, ymin: 0.78, ymax: 1.0, xstep: 1, ystep: 0.05, xname: "réteg", yname: "átlagos cos" }, [
        { vline: L, color: "--muted", dash: [4, 4], width: 1.2 },
        { f: lin(0), domain: [0, 12], color: "--accent", width: 2 },
        { f: lin(1), domain: [0, 12], color: "--setB", width: 2 },
        { points: avgs.map((v, i) => [i, v[0]]), color: "--accent", r: 3 },
        { points: avgs.map((v, i) => [i, v[1]]), color: "--setB", r: 3 },
        { points: [[L, avgs[L][0]]], color: "--accent", r: 6 },
        { points: [[L, avgs[L][1]]], color: "--setB", r: 6 }
      ]);
    }
    cvA.draw = drawA;

    // (b) rész – figyelemfelfedező
    const HB = RD.hubert, keys = Object.keys(HB);
    let s = keys[0], bl = 0, hd = "avg";
    root.append(h("div", { style: "font-weight:700;margin-top:1.4rem" }, "b) Kire figyel egy token?"));
    root.append(h("p", { class: "w-sub", style: "margin:.1rem 0 .3rem" },
      "Válassz mondatot, réteget és fejet. A sor a kérdező token (query), az oszlop az, amire figyel (key); egy sor összege 1. A „·” egy szó belseji WordPiece-darab, " +
      "a [CLS] és a [SEP] a BERT speciális tokenjei."));
    const selS = w2Sel(keys.map(k => [k, k]), s, v => { s = v; syncB(); });
    selS.style.cssText = "max-width:100%;min-width:0";
    const selL = w2Sel(Array.from({ length: 12 }, (_, i) => [String(i), String(i + 1)]), "0", v => { bl = +v; syncB(); });
    const selH = w2Sel([["avg", "fejek átlaga"], ...Array.from({ length: 12 }, (_, i) => [String(i), (i + 1) + ". fej"])], "avg", v => { hd = v; syncB(); });
    root.append(h("div", { class: "controls" }, small("mondat:"), selS),
      h("div", { class: "controls" }, w2Lab("réteg:", selL), w2Lab("fej:", selH)));
    const boxB = h("div");
    root.append(boxB);
    let MB = null, tB = [];
    const hmB = w2Heat(boxB, {
      data: [[0]], digits: 2, maxCell: 46, markRowMax: true, cellH: c => Math.min(c, 32),
      rowStyle: r => (tB[r] && (tB[r].inner || tB[r].special) ? { color: css("--muted") } : null),
      colStyle: j => (tB[j] && (tB[j].inner || tB[j].special) ? { color: css("--muted") } : null),
      onHover: (r, c) => readB(r, c)
    });
    const outB = h("div", { class: "readout" });
    root.append(outB);
    root.append(h("div", { class: "box warn", style: "margin:.7rem 0 0;font-size:.9rem" },
      h("b", null, "A figyelmi súly nem magyarázat: "), "azt mutatja, honnan keverünk, nem azt, miért dönt így a modell. ",
      "Sok fej ráadásul egyszerűen a [SEP]-re vagy a [CLS]-re „parkol”, ha nincs dolga (figyelemnyelő), és a súlyok csak a V-vektorok keverési arányai – a V-k nagysága is számít."));
    root.append(w2Src(RD.src.hubert));
    function syncB() {
      const o = HB[s];
      tB = o.tokens.map(w2WP);
      const n = o.tokens.length;
      MB = hd === "avg"
        ? Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => w2Mean(o.att[bl].map(H => H[i][j]))))
        : o.att[bl][+hd];
      hmB.set({ data: MB, rowLabels: tB.map(t => t.s), colLabels: tB.map(t => t.s), range: [0, Math.max(...MB.flat())] });
      readB(null);
    }
    function readB(r, c) {
      const q = t => `„${w2Esc(t.s)}”`;
      if (r == null) {
        outB.innerHTML = `<span class="muted">Vidd az egeret egy cellára!</span> ${bl + 1}. réteg, ${hd === "avg" ? "12 fej átlaga" : (+hd + 1) + ". fej"} · ` +
          `<span class="muted">színskála: háttérszín = 0 … legerősebb szín = ${fmt(Math.max(...MB.flat()), 2)}; a keretes cella a sor maximuma</span>`;
        return;
      }
      const j = argmax(MB[r]);
      outB.innerHTML = `${q(tB[r])} → ${q(tB[c])}: <b>${fmt(MB[r][c], 3)}</b> (a sor ${pct(MB[r][c], 1)}-a)` +
        `<br><span class="muted">${q(tB[r])} legjobban erre figyel: ${q(tB[j])} – ${fmt(MB[r][j], 3)}</span>`;
    }
    syncA();
    syncB();
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
