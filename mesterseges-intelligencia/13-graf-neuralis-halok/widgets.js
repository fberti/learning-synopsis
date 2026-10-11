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
     w1 – 13.1-b gráfépítő (mátrix, lista, fokszám) · 13.3 üzenetküldés
     ================================================================== */
  const w1Font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  const w1OnTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  /* canvas, amelynek magassága a szélességtől (és a tartalomtól) függ; HiDPI, téma- és méretváltáskor újrarajzol */
  function w1Canvas(parent, heightOf, maxW = 760) {
    const c = h("canvas", { style: "display:block;touch-action:none;max-width:100%" });
    parent.append(c);
    const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    o.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW), hh = Math.max(60, Math.round(heightOf(w)));
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
  /* magolt véletlen (mulberry32) */
  function w1Rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* névelő a csúcs neve elé: az A, a B, az 1, a 2, az 5 … */
  const w1Art = s => {
    s = String(s);
    if (/^\d+$/.test(s)) return s === "1" || s[0] === "5" ? "az" : "a";
    return /^[AEFILMNORSX]/.test(s) ? "az" : "a";
  };
  const w1ArtC = s => (w1Art(s) === "az" ? "Az" : "A");
  /* rögzített 3 tizedes (a szórásnál: 0,910 és nem 0,91) */
  const w1Fix = (x, d = 3) => (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d).replace("-", "−").replace(".", ",");
  const w1Key = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
  const w1Std = v => { const m = v.reduce((s, x) => s + x, 0) / v.length; return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length); };
  /* a futó példa: A bal fent, C bal lent, B középen, D és E jobbra */
  const W1EX = {
    names: ["A", "B", "C", "D", "E"],
    xy: [[0.04, 0.06], [0.4, 0.5], [0.04, 0.94], [0.7, 0.5], [0.97, 0.5]],
    edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]],
    x: [1, 0, 0, 0, 5]
  };
  const w1Cell = "padding:.18em .42em;text-align:center;font-family:var(--mono);font-size:.84rem;border:1px solid var(--border);";
  const w1Th = w1Cell + "background:var(--bg-soft);font-weight:600;white-space:nowrap;";
  const w1Tint = (v, t) => `background:color-mix(in srgb, var(${v}) ${Math.round(100 * clamp(t, 0, 1))}%, var(--card));`;

  /* ------------------------------------------------------------------
     1. Gráfépítő – szomszédsági mátrix, lista, fokszám, A² (13.1-b)
     ------------------------------------------------------------------ */
  W["graph-builder"] = root => {
    header(root, "Gráfépítő – mátrix, lista, fokszám",
      "Kattints <b>üres helyre</b>: új csúcs. Kattints egy csúcsra, majd egy <b>másikra</b>: él be/ki. Ugyanarra a csúcsra még egyszer: " +
      "kijelölés vége. A csúcsokat húzhatod is. A narancs szám a csúcs <b>sorszáma</b> – ez adja a mátrix sorrendjét.");
    const LET = "ABCDEFGH";
    let nodes, edges, order, sel = null, showA2 = false, renum = 0, renumbered = false, msg = "";
    const reset = ex => {
      nodes = ex ? W1EX.names.map((n, i) => ({ name: n, x: W1EX.xy[i][0], y: W1EX.xy[i][1] })) : [];
      edges = new Set(ex ? W1EX.edges.map(([a, b]) => w1Key(W1EX.names[a], W1EX.names[b])) : []);
      order = nodes.map(n => n.name); sel = null; renumbered = false;
      msg = ex ? "" : "Üres gráf: kattints a vászonra, és rakd össze a sajátodat!";
    };
    reset(true);

    function renumber() {
      if (order.length < 2) { msg = "Átszámozáshoz legalább 2 csúcs kell."; upd(); return; }
      const rng = w1Rng(1307 + 7919 * (++renum));
      let o;
      do {
        o = order.slice();
        for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
      } while (o.join() === order.join());
      order = o; renumbered = true; msg = ""; upd();
    }
    function delSel() {
      if (!sel) return;
      const s = sel;
      nodes = nodes.filter(n => n.name !== s);
      order = order.filter(n => n !== s);
      [...edges].forEach(k => { if (k.split("|").includes(s)) edges.delete(k); });
      sel = null; msg = `${w1ArtC(s)} ${s} csúcsot és az éleit töröltem.`; upd();
    }
    const bDel = btn("Csúcs törlése", delSel);
    const cbA2 = checkbox(false, () => { showA2 = cbA2.checked; upd(); });
    root.append(h("div", { class: "controls" },
      btn("Mintagráf", () => { reset(true); upd(); }), btn("Üres", () => { reset(false); upd(); }),
      btn("Átszámozás", renumber), bDel, h("label", null, cbA2, "teljes A² mutatása")));

    const grid = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem;align-items:flex-start" });
    const L = h("div", { style: "flex:1 1 320px;min-width:0" }), R = h("div", { style: "flex:1 1 250px;min-width:0" });
    grid.append(L, R); root.append(grid);
    const cv = w1Canvas(L, w => clamp(w * 0.74, 230, 380), 520);
    const note = h("div", { class: "muted", style: "font-size:.85rem;min-height:1.3em;margin-top:.2rem" });
    L.append(note);
    const mBox = h("div"); R.append(mBox);
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6" });
    root.append(out);

    /* geometria */
    const rad = () => (cv.w < 360 ? 15 : 17);
    const pads = () => { const r = rad(); return { l: r + 12, r: r + 12, t: r + 14, b: r + 24 }; };
    const P = n => { const p = pads(); return [p.l + n.x * (cv.w - p.l - p.r), p.t + n.y * (cv.h - p.t - p.b)]; };
    const inv = (px, py) => { const p = pads(); return [clamp((px - p.l) / (cv.w - p.l - p.r), 0, 1), clamp((py - p.t) / (cv.h - p.t - p.b), 0, 1)]; };
    const nodeAt = (px, py) => {
      let best = null, bd = 1e9;
      nodes.forEach(n => { const [x, y] = P(n), d = Math.hypot(x - px, y - py); if (d < rad() + 7 && d < bd) { bd = d; best = n.name; } });
      return best;
    };
    /* mátrixok a sorszám szerinti sorrendben */
    const mat = () => order.map(a => order.map(b => (a !== b && edges.has(w1Key(a, b)) ? 1 : 0)));
    const sq = A => A.map(r => A.map((_, j) => r.reduce((s, v, q) => s + v * A[q][j], 0)));
    const num = nm => order.indexOf(nm) + 1;
    const deg = nm => order.reduce((s, b) => s + (b !== nm && edges.has(w1Key(nm, b)) ? 1 : 0), 0);

    cv.draw = () => {
      cv.resize();
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const r = rad(), acc = css("--accent"), tx = css("--text"), mu = css("--muted"), cB = css("--setB"), cC = css("--setC"), card = css("--card");
      const pos = Object.fromEntries(nodes.map(n => [n.name, P(n)]));
      edges.forEach(k => {
        const [a, b] = k.split("|"), on = sel && (a === sel || b === sel);
        ctx.save(); ctx.strokeStyle = on ? acc : mu; ctx.lineWidth = on ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(...pos[a]); ctx.lineTo(...pos[b]); ctx.stroke(); ctx.restore();
      });
      let a2 = null;
      if (sel) a2 = sq(mat())[order.indexOf(sel)];
      nodes.forEach(n => {
        const [x, y] = pos[n.name], s = n.name === sel;
        if (s) ring(ctx, x, y, r + 5, acc, 2, [4, 3]);
        dot(ctx, x, y, r, s ? acc : card);
        ring(ctx, x, y, r, acc, 2);
        label(ctx, n.name, x, y + 1, s ? card : tx, "center", w1Font(15, 700), "middle");
        const bx = x + r * 0.78, by = y - r * 0.78;
        dot(ctx, bx, by, 8.5, cB);
        label(ctx, String(num(n.name)), bx, by + 0.5, card, "center", w1Font(10.5, 700), "middle");
        if (a2) { const v = a2[order.indexOf(n.name)]; if (v > 0) label(ctx, `${v} séta`, x, y + r + 19, cC, "center", w1Font(11.5, 700)); }
      });
      if (!nodes.length) label(ctx, "Üres gráf – kattints ide új csúcsért!", w / 2, hh / 2, mu, "center", w1Font(13, 500), "middle");
    };

    /* egér / érintés: kattintás, húzás */
    let drag = null;
    cv.c.addEventListener("pointerdown", e => {
      const [x, y] = evXY(cv, e), hit = nodeAt(x, y);
      drag = { name: hit, x0: x, y0: y, moved: false };
      try { cv.c.setPointerCapture(e.pointerId); } catch (_) { /* nincs */ }
      e.preventDefault();
    });
    cv.c.addEventListener("pointermove", e => {
      const [x, y] = evXY(cv, e);
      if (!drag) { cv.c.style.cursor = nodeAt(x, y) ? "pointer" : "crosshair"; return; }
      if (!drag.name) return;
      if (!drag.moved && Math.hypot(x - drag.x0, y - drag.y0) > 5) drag.moved = true;
      if (drag.moved) {
        const n = nodes.find(q => q.name === drag.name), [u, v] = inv(x, y);
        n.x = u; n.y = v; cv.draw();
      }
    });
    const end = e => {
      if (!drag) return;
      const d = drag; drag = null;
      if (d.moved) return;
      if (d.name) clickNode(d.name);
      else clickEmpty(d.x0, d.y0);
    };
    cv.c.addEventListener("pointerup", end);
    cv.c.addEventListener("pointercancel", () => { drag = null; });
    function clickNode(nm) {
      if (!sel) { sel = nm; msg = `Kijelölve: ${nm}. Kattints egy másik csúcsra az él be/kikapcsolásához, vagy ugyanerre a kijelölés megszüntetéséhez.`; }
      else if (sel === nm) { sel = null; msg = ""; }
      else {
        const k = w1Key(sel, nm), had = edges.has(k);
        if (had) edges.delete(k); else edges.add(k);
        msg = `${had ? "Töröltem" : "Behúztam"} ${w1Art(sel)} ${sel}–${nm} élt.`; sel = null;
      }
      upd();
    }
    function clickEmpty(px, py) {
      if (sel) { sel = null; msg = ""; upd(); return; }
      if (nodes.length >= 8) { msg = "Legfeljebb 8 csúcs lehet (a mátrix így is 64 számot tárol)."; upd(); return; }
      const nm = [...LET].find(c => !nodes.some(n => n.name === c));
      const [u, v] = inv(px, py);
      nodes.push({ name: nm, x: u, y: v }); order.push(nm);
      msg = `Új csúcs: ${nm} (sorszáma ${order.length}).`; upd();
    }

    function matHTML(M, isA2, selI) {
      const n = order.length, mx = Math.max(1, ...M.flat());
      let s = `<table style="width:auto;margin:.2rem 0;border-collapse:collapse"><tr><th style="${w1Th}">${isA2 ? "A²" : "A"}</th>`;
      order.forEach(nm => { s += `<th style="${w1Th}"><span style="color:var(--setB)">${num(nm)}</span>&thinsp;${nm}</th>`; });
      s += "</tr>";
      M.forEach((row, i) => {
        const on = i === selI;
        s += `<tr><th style="${w1Th}${on ? "background:var(--accent-soft);color:var(--accent);" : ""}"><span style="color:var(--setB)">${num(order[i])}</span>&thinsp;${order[i]}</th>`;
        row.forEach((v, j) => {
          let st = w1Cell;
          if (isA2) st += v > 0 ? w1Tint("--setC", 0.15 + 0.45 * v / mx) + "font-weight:700;" : "color:var(--muted);";
          else st += v ? w1Tint("--accent", 0.3) + "font-weight:700;color:var(--text);" : "color:var(--muted);";
          if (on) st += "outline:2px solid var(--accent);outline-offset:-2px;";
          if (i === j && isA2) st += "text-decoration:underline;";
          s += `<td style="${st}">${v}</td>`;
        });
        s += "</tr>";
      });
      if (!isA2 && selI >= 0) {
        const r2 = sq(M)[selI];
        s += `<tr><th style="${w1Th}color:var(--setC)" title="a kijelölt csúcs sora A²-ben">A²: ${order[selI]}</th>`;
        r2.forEach(v => { s += `<td style="${w1Cell}${v > 0 ? w1Tint("--setC", 0.35) + "font-weight:700;" : "color:var(--muted);"}">${v}</td>`; });
        s += "</tr>";
      }
      return s + "</table>";
    }

    function upd() {
      setDis(bDel, !sel);
      note.textContent = msg;
      cv.draw();
      const n = order.length, A = mat(), selI = sel ? order.indexOf(sel) : -1;
      if (!n) {
        mBox.innerHTML = `<p class="muted" style="font-size:.9rem;margin:.3rem 0">Nincs csúcs, nincs mátrix.</p>`;
        out.innerHTML = "Üres gráf: n = 0, |E| = 0.";
        return;
      }
      let mh = `<div class="muted" style="font-size:.85rem">Szomszédsági mátrix (sorrend = sorszám):</div><div class="tw" style="overflow-x:auto">${matHTML(A, false, selI)}</div>`;
      if (showA2) mh += `<div class="muted" style="font-size:.85rem;margin-top:.4rem">A² = A · A – kétlépéses séták száma (átló = fokszám):</div><div class="tw" style="overflow-x:auto">${matHTML(sq(A), true, selI)}</div>`;
      mBox.innerHTML = mh;

      const E = edges.size, degs = order.map(deg), sum = degs.reduce((s, v) => s + v, 0);
      const nbs = nm => order.filter(b => b !== nm && edges.has(w1Key(nm, b)));
      const L = [];
      L.push("<b>Szomszédsági lista:</b> " + order.map(nm => `<span style="white-space:nowrap">${nm}: ${nbs(nm).join(", ") || "–"}</span>`).join(" · "));
      L.push("<b>Fokszámok:</b> " + order.map((nm, i) => `${nm} ${degs[i]}`).join(", ") + ` · élek száma |E| = ${E}`);
      L.push(`<b>Ellenőrzés:</b> fokszámok összege = ${degs.join(" + ")} = ${sum} = 2 · ${E} = 2 · élek száma ${sum === 2 * E ? "✓" : "✗"} ` +
        `<span class="muted">(minden él két csúcs fokszámába számít bele)</span>`);
      L.push(`<b>Tárolás:</b> a mátrix n² = ${n}² = ${n * n} számot tárol, a lista 2|E| = 2 · ${E} = ${2 * E} bejegyzést.`);
      const sorted = degs.slice().sort((a, b) => b - a).join(", ");
      L.push(renumbered
        ? `<b>A számozás más, a gráf ugyanaz:</b> fokszámok rendezve: ${sorted}. <span class="muted">(Számozás: ${order.map(nm => `${nm} = ${num(nm)}`).sort().join(", ")}.)</span>`
        : `Fokszámok rendezve: ${sorted} – ez nem függ a számozástól. <span class="muted">Próbáld ki az Átszámozást: a mátrix megváltozik, a gráf nem.</span>`);
      if (sel) {
        const r2 = sq(A)[selI];
        const walks = order.map((t, j) => {
          const via = order.filter((m, q) => A[selI][q] && A[q][j]);
          return via.length ? `${t}: ${via.map(m => `${sel}→${m}→${t}`).join(", ")}` : null;
        }).filter(Boolean);
        L.push(`<b>Kétlépéses séták (${w1Art(sel)} ${sel} sora A²-ben):</b> (${r2.join("; ")}) – ${walks.join(" · ") || "nincs ilyen séta"}. ` +
          `<span class="muted">Az átlóelem (${r2[selI]}) a fokszám: oda-vissza séták.</span>`);
      }
      out.innerHTML = L.join("<br>");
    }
    upd();
  };

  /* ------------------------------------------------------------------
     2. Üzenetküldés lépésről lépésre (13.3)
     ------------------------------------------------------------------ */
  W["message-passing"] = root => {
    header(root, "Üzenetküldés lépésről lépésre",
      "Egy lépésben (rétegben) minden csúcs összegyűjti a szomszédai értékét: $m_v$ = összeg / átlag / maximum $N(v)$ fölött, " +
      "majd ebből számolja az új értékét. Kattints egy csúcsra: látod, honnan kap üzenetet, és mit lát $k$ réteg után.");
    const PRE = {
      ex: () => ({ names: W1EX.names.slice(), xy: W1EX.xy, edges: W1EX.edges, x: W1EX.x.slice() }),
      chain: () => ({ names: [1, 2, 3, 4, 5, 6, 7, 8].map(String), xy: [0, 1, 2, 3, 4, 5, 6, 7].map(i => [i / 7, 0.5]),
        edges: [0, 1, 2, 3, 4, 5, 6].map(i => [i, i + 1]), x: [1, 0, 0, 0, 0, 0, 0, 0] }),
      karate: () => { const K = window.KARATE13; return { names: K.xy.map((_, i) => String(i + 1)), xy: K.xy, edges: K.edges, x: K.xy.map((_, i) => (i ? 0 : 1)) }; }
    };
    const KMAX = 30;
    let pre = "ex", G, k = 0, H = [], agg = "sum", self = false, mode = "agg", wS = 0.5, wM = 1, bb = 0, sel = null;

    const AGG = vals => {
      if (!vals.length) return 0;
      if (agg === "max") return Math.max(...vals);
      const s = vals.reduce((a, b) => a + b, 0);
      return agg === "mean" ? s / vals.length : s;
    };
    const inSet = v => (self ? [...G.nb[v], v].sort((a, b) => a - b) : G.nb[v]);
    const stepOnce = hv => hv.map((hvv, v) => {
      const m = AGG(inSet(v).map(u => hv[u]));
      return mode === "agg" ? m : Math.max(0, wS * hvv + wM * m + bb);
    });
    const recompute = () => { H = [G.x.slice()]; for (let i = 0; i < k; i++) H.push(stepOnce(H[i])); };
    const load = key => {
      pre = key;
      const p = PRE[key](), n = p.names.length, nb = p.names.map(() => []);
      p.edges.forEach(([a, b]) => { nb[a].push(b); nb[b].push(a); });
      nb.forEach(l => l.sort((a, b) => a - b));
      G = Object.assign(p, { n, nb });
      k = 0; sel = null; recompute();
    };
    const bfs = s => {
      const d = new Array(G.n).fill(-1), q = [s]; d[s] = 0;
      while (q.length) { const v = q.shift(); G.nb[v].forEach(u => { if (d[u] < 0) { d[u] = d[v] + 1; q.push(u); } }); }
      return d;
    };

    /* vezérlők */
    const presets = [["ex", "Futó példa (A–E)"], ["chain", "Lánc (8 csúcs)"]];
    if (window.KARATE13) presets.push(["karate", "Karateklub (34)"]);
    const gP = toggleGroup(presets, () => pre, key => { load(key); upd(); });
    const gA = toggleGroup([["sum", "összeg"], ["mean", "átlag"], ["max", "maximum"]], () => agg, key => { agg = key; recompute(); upd(); });
    const cbSelf = checkbox(false, () => { self = cbSelf.checked; recompute(); upd(); });
    const gM = toggleGroup([["agg", "csak aggregálás: h′ = m"], ["upd", "frissítés: h′ = ReLU(w₁·h + w₂·m + b)"]], () => mode, key => { mode = key; recompute(); upd(); });
    const sS = slider(-2, 2, 0.05, wS), sM = slider(-2, 2, 0.05, wM), sB = slider(-2, 2, 0.05, bb);
    const vS = h("b", { style: "font-family:var(--mono);min-width:2.6em;display:inline-block" }), vM = vS.cloneNode(), vB = vS.cloneNode();
    sS.addEventListener("input", () => { wS = +sS.value; recompute(); upd(); });
    sM.addEventListener("input", () => { wM = +sM.value; recompute(); upd(); });
    sB.addEventListener("input", () => { bb = +sB.value; recompute(); upd(); });
    const bDef = btn("alap (0,5; 1; 0)", () => { wS = 0.5; wM = 1; bb = 0; sS.value = wS; sM.value = wM; sB.value = bb; recompute(); upd(); });
    const bStep = btn("Egy lépés ▶", () => { if (k < KMAX) { k++; H.push(stepOnce(H[k - 1])); upd(); } }, "btn primary");
    const bBack = btn("◀ Vissza", () => { if (k > 0) { k--; H.pop(); upd(); } });
    const bReset = btn("Alaphelyzet", () => { k = 0; recompute(); upd(); });
    const kV = h("b", { style: "font-family:var(--mono);font-size:1.05rem" });
    root.append(h("div", { class: "controls" }, small("minta:"), gP.bs));
    root.append(h("div", { class: "controls" }, small("aggregálás N(v) fölött:"), gA.bs,
      h("label", null, cbSelf, "önhurok (a csúcs saját értéke is benne van)")));
    root.append(h("div", { class: "controls" }, small("új érték:"), gM.bs));
    const slRow = h("div", { class: "controls" }, h("label", null, "w₁:", sS, vS), h("label", null, "w₂:", sM, vM), h("label", null, "b:", sB, vB), bDef);
    root.append(slRow);
    root.append(h("div", { class: "controls" }, bStep, bBack, bReset, h("span", null, small("rétegek száma "), kV)));

    const cvWrap = h("div", { style: "margin-top:.3rem" });
    root.append(cvWrap);
    const cv = w1Canvas(cvWrap, w => (pre === "chain" ? Math.max(118, w * 0.2) : pre === "karate" ? Math.min(560, w * (w < 520 ? 0.95 : 0.72)) : (w < 520 ? w * 0.72 : w * 0.44)));
    const legend = h("div", { class: "muted", style: "font-size:.84rem;margin-top:.25rem;line-height:1.6" });
    root.append(legend);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6" });
    root.append(out);
    const tbl = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(tbl);

    /* geometria */
    const small10 = () => G.n > 10;
    const rad = () => {
      if (pre === "karate") return cv.w < 520 ? 8 : 10;
      if (pre === "chain") return Math.min(17, (cv.w - 40) / 7 * 0.34);
      return cv.w < 520 ? 16 : 19;
    };
    const pads = () => { const r = rad(); return small10() ? { l: r + 6, r: r + 6, t: r + 6, b: r + 6 } : { l: r + 12, r: r + 12, t: r + 14, b: r + 33 }; };
    const P = v => { const p = pads(), [x, y] = G.xy[v]; return [p.l + x * (cv.w - p.l - p.r), p.t + y * (cv.h - p.t - p.b)]; };
    const range = () => {
      const all = H.flat();
      return { lo: Math.min(0, ...all), hi: Math.max(...all) };
    };
    const RING = [["--text", 3, []], ["--setB", 2.6, []], ["--setC", 2.6, [5, 3]], ["--muted", 2, [2, 3]]];

    cv.draw = () => {
      cv.resize();
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const r = rad(), tx = css("--text"), mu = css("--muted"), cB = css("--setB"), acc = css("--accent");
      const cur = H[k], { lo, hi } = range(), tOf = v => (hi > lo ? (v - lo) / (hi - lo) : 0);
      const pos = G.xy.map((_, v) => P(v)), dist = sel != null ? bfs(sel) : null;
      const inF = v => !dist || (dist[v] >= 0 && dist[v] <= k);
      /* élek */
      G.edges.forEach(([a, b]) => {
        ctx.save(); ctx.strokeStyle = mu; ctx.globalAlpha = dist && !(inF(a) && inF(b)) ? 0.22 : 0.75;
        ctx.lineWidth = small10() ? 1.2 : 2;
        ctx.beginPath(); ctx.moveTo(...pos[a]); ctx.lineTo(...pos[b]); ctx.stroke(); ctx.restore();
      });
      /* önhurok */
      if (self && !small10()) G.xy.forEach((_, v) => { const [x, y] = pos[v]; ctx.save(); ctx.globalAlpha = inF(v) ? 0.8 : 0.25; ring(ctx, x - r * 0.75, y - r * 0.75, r * 0.5, mu, 1.6); ctx.restore(); });
      /* a kijelölt csúcs bejövő üzenetei */
      if (sel != null) {
        const [x1, y1] = pos[sel];
        G.nb[sel].forEach(u => {
          const [x0, y0] = pos[u], L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, g = r + 7;
          if (L > 2 * g + 4) arrow(ctx, x0 + ux * g, y0 + uy * g, x1 - ux * g, y1 - uy * g, cB, small10() ? 1.6 : 2.4);
        });
      }
      /* csúcsok */
      for (let v = 0; v < G.n; v++) {
        const [x, y] = pos[v], t = tOf(cur[v]);
        ctx.save(); ctx.globalAlpha = inF(v) ? 1 : 0.32;
        dot(ctx, x, y, r, mix("--accent", t));
        ring(ctx, x, y, r, acc, small10() ? 1 : 1.6);
        label(ctx, G.names[v], x, y + 1, ink(t), "center", w1Font(small10() ? (r < 9 ? 8.5 : 10) : 15, 700), "middle");
        if (!small10()) label(ctx, fmt(cur[v], 3), x, y + r + 25, tx, "center", "600 12.5px " + (css("--mono") || "monospace"));
        ctx.restore();
      }
      /* látómező: gyűrűk ugrástávolság szerint */
      if (dist) for (let v = 0; v < G.n; v++) {
        const d = dist[v];
        if (d < 0 || d > k) continue;
        const [c, lw, dash] = RING[Math.min(3, d)], [x, y] = pos[v];
        ring(ctx, x, y, r + (small10() ? 3.5 : 5), css(c), small10() ? lw * 0.8 : lw, dash);
      }
    };
    cv.c.addEventListener("pointerdown", e => {
      const [px, py] = evXY(cv, e), r = rad();
      let best = null, bd = 1e9;
      for (let v = 0; v < G.n; v++) { const [x, y] = P(v), d = Math.hypot(x - px, y - py); if (d < r + 7 && d < bd) { bd = d; best = v; } }
      sel = best === sel ? null : best;
      upd();
    });
    cv.c.addEventListener("pointermove", e => {
      const [px, py] = evXY(cv, e), r = rad();
      let hit = false;
      for (let v = 0; v < G.n && !hit; v++) { const [x, y] = P(v); hit = Math.hypot(x - px, y - py) < r + 7; }
      cv.c.style.cursor = hit ? "pointer" : "default";
    });

    const hS = (nm, sup) => `h<sub>${nm}</sub>${sup || ""}`;
    const AGN = { sum: "összeg", mean: "átlag", max: "max" };
    function upd() {
      gP.paint(); gA.paint(); gM.paint();
      vS.textContent = fmt(wS, 2); vM.textContent = fmt(wM, 2); vB.textContent = fmt(bb, 2);
      [sS, sM, sB, bDef].forEach(e => setDis(e, mode !== "upd"));
      slRow.style.opacity = mode === "upd" ? "" : "0.75";
      setDis(bStep, k >= KMAX); setDis(bBack, k <= 0);
      kV.textContent = `k = ${k}`;
      cv.draw();
      const cur = H[k], { lo, hi } = range();
      const ringSw = (c, dash, txt) => `<span style="white-space:nowrap"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;border:2.5px ${dash ? "dashed" : "solid"} var(${c});vertical-align:-2px"></span> ${txt}</span>`;
      legend.innerHTML = `szín = érték: <span style="white-space:nowrap">${fmt(lo, 3)} <span style="display:inline-block;width:90px;height:11px;border:1px solid var(--border);border-radius:3px;vertical-align:-1px;background:linear-gradient(to right,var(--card),var(--accent))"></span> ${fmt(hi, 3)}</span>` +
        ` <span>(a skála az eddigi összes réteg értékeire illeszkedik)</span>` +
        (sel != null ? ` · látómező: ${ringSw("--text", false, "kijelölt")} ${ringSw("--setB", false, "1 ugrás")} ${ringSw("--setC", true, "2 ugrás")} ${ringSw("--muted", true, "3+ ugrás")} · <span style="color:var(--setB)">→</span> bejövő üzenetek` : "");
      const nz = cur.filter(v => Math.abs(v) > 1e-12).length;
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        stat(String(k), "réteg (lépés) k"),
        stat(w1Fix(w1Std(cur)), k ? `szórás (előtte ${w1Fix(w1Std(H[k - 1]))})` : "szórás (populációs)"),
        stat(`${nz} / ${G.n}`, "nem nulla értékű csúcs"),
        stat(fmt(Math.max(...cur), 3), "legnagyobb érték"));

      /* kijelölt csúcs: látómező és a következő lépés számolása */
      const L = [];
      if (sel == null) {
        L.push(`Kattints egy csúcsra: megmutatom, kiktől kap üzenetet, mit lát $k$ réteg után, és hogyan számolódik az új értéke.`);
        L.push(`Most (k = ${k}): h = (${cur.map(v => fmt(v, 3)).join("; ")}).`);
      } else {
        const nm = G.names[sel], d = bfs(sel), seen = [];
        for (let q = 0; q <= k; q++) { const at = G.names.filter((_, v) => d[v] === q); if (at.length) seen.push([q, at]); }
        const all = G.names.filter((_, v) => d[v] >= 0 && d[v] <= k);
        L.push(`<b>${w1ArtC(nm)} ${nm} csúcs k = ${k} réteg után ezeket látja:</b> ${all.join(", ")} (${all.length} csúcs${k === 0 ? " – csak önmagát" : ""}). ` +
          `<span class="muted">${seen.map(([q, at]) => `${q} ugrás: ${at.join(", ")}`).join(" · ")}</span>`);
        const S = inSet(sel), vals = S.map(u => cur[u]), m = AGG(vals);
        const mTxt = S.length
          ? `m<sub>${nm}</sub> = ${AGN[agg]}(${S.map(u => hS(G.names[u])).join(", ")}) = ${AGN[agg]}(${vals.map(v => fmt(v, 3)).join("; ")}) = <b>${fmt(m, 3)}</b>`
          : `m<sub>${nm}</sub> = 0 (nincs szomszéd)`;
        let line = `<b>Következő lépés (k = ${k} → ${k + 1}):</b> ${mTxt}`;
        if (mode === "upd") {
          const z = wS * cur[sel] + wM * m + bb;
          line += `<br>h′<sub>${nm}</sub> = ReLU(${par(wS, 2)} · ${hS(nm)} + ${par(wM, 2)} · m<sub>${nm}</sub> + ${par(bb, 2)}) = ReLU(${par(wS, 2)} · ${par(cur[sel], 3)} + ${par(wM, 2)} · ${par(m, 3)} + ${par(bb, 2)}) = ReLU(${fmt(z, 3)}) = <b>${fmt(Math.max(0, z), 3)}</b>`;
        } else line += ` → h′<sub>${nm}</sub> = m<sub>${nm}</sub>`;
        if (self) line += ` <span class="muted">(önhurok: ${hS(nm)} is a halmazban van)</span>`;
        L.push(line);
      }
      out.innerHTML = L.join("<br>");
      math(out);

      /* értéktáblázat: előző és mostani réteg */
      const row = (lab, vals, hiRow) => `<tr><th style="${w1Th}">${lab}</th>` + vals.map((v, i) => {
        const t = hi > lo ? (v - lo) / (hi - lo) : 0;
        return `<td style="${w1Cell}${w1Tint("--accent", t)}color:${t > 0.55 ? "var(--card)" : "var(--text)"};${hiRow ? "font-weight:700;" : ""}${i === sel ? "outline:2px solid var(--setB);outline-offset:-2px;" : ""}">${fmt(v, 3)}</td>`;
      }).join("") + "</tr>";
      let s = `<table style="width:auto;margin:0;border-collapse:collapse"><tr><th style="${w1Th}">csúcs</th>${G.names.map((nm, i) => `<th style="${w1Th}${i === sel ? "color:var(--setB);" : ""}">${nm}</th>`).join("")}</tr>`;
      if (k > 0) s += row(`h<sup>(${k - 1})</sup>`, H[k - 1], false);
      s += row(`h<sup>(${k})</sup>`, cur, true) + "</table>";
      tbl.innerHTML = s;
    }
    load("ex");
    upd();
  };

  /* ==================================================================
     13.4-c  gcn-karate – félig felügyelt csúcsosztályozás a karateklubon
     ================================================================== */
  /* W2-CORE-BEGIN  (tiszta JS, node-ban is futtatható: _parts/calc/w132_*.js) */
  function w2Rng(seed) {                                  // mulberry32
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* P = D^-1/2 (A + I) D^-1/2  (useGraph = false → P = I, azaz MLP) */
  function w2Prop(n, edges, useGraph) {
    const P = new Float64Array(n * n);
    if (!useGraph) { for (let i = 0; i < n; i++) P[i * n + i] = 1; return P; }
    const deg = new Float64Array(n).fill(1);
    edges.forEach(([u, v]) => { P[u * n + v] = P[v * n + u] = 1; deg[u]++; deg[v]++; });
    for (let i = 0; i < n; i++) P[i * n + i] = 1;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (P[i * n + j]) P[i * n + j] /= Math.sqrt(deg[i] * deg[j]);
    return P;
  }
  function w2GcnInit(n, hid, k, seed) {
    const rnd = w2Rng(seed);
    const glorot = (fi, fo) => { const L = Math.sqrt(6 / (fi + fo)), a = new Float64Array(fi * fo); for (let i = 0; i < a.length; i++) a[i] = (2 * rnd() - 1) * L; return a; };
    const prm = { W1: glorot(n, hid), b1: new Float64Array(hid), W2: glorot(hid, k), b2: new Float64Array(k) };
    const net = { n, hid, k, prm, m: {}, v: {}, t: 0 };
    for (const key in prm) { net.m[key] = new Float64Array(prm[key].length); net.v[key] = new Float64Array(prm[key].length); }
    return net;
  }
  /* előre: S1 = P·W1 + b1 (X = I), H1 = ReLU(S1), T = H1·W2, Z = P·T + b2 */
  function w2GcnFwd(net, P) {
    const { n, hid, k, prm: { W1, b1, W2, b2 } } = net;
    const S1 = new Float64Array(n * hid), H1 = new Float64Array(n * hid), T = new Float64Array(n * k), Z = new Float64Array(n * k);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < hid; j++) S1[i * hid + j] = b1[j];
      for (let q = 0; q < n; q++) { const p = P[i * n + q]; if (!p) continue; for (let j = 0; j < hid; j++) S1[i * hid + j] += p * W1[q * hid + j]; }
      for (let j = 0; j < hid; j++) H1[i * hid + j] = Math.max(0, S1[i * hid + j]);
      for (let c = 0; c < k; c++) { let s = 0; for (let j = 0; j < hid; j++) s += H1[i * hid + j] * W2[j * k + c]; T[i * k + c] = s; }
    }
    for (let i = 0; i < n; i++) for (let c = 0; c < k; c++) {
      let s = b2[c];
      for (let q = 0; q < n; q++) { const p = P[i * n + q]; if (p) s += p * T[q * k + c]; }
      Z[i * k + c] = s;
    }
    return { S1, H1, T, Z };
  }
  /* egy Adam-lépés a címkézett csúcsok kereszt-entrópiáján; visszaadja a lépés előtti veszteséget */
  function w2GcnStep(net, P, y, lab, lr = 0.01, wd = 5e-4) {
    const { n, hid, k, prm } = net, { W2 } = prm;
    const { S1, H1, Z } = w2GcnFwd(net, P);
    const dZ = new Float64Array(n * k);
    let loss = 0;
    lab.forEach(i => {
      const z = Array.from(Z.subarray(i * k, i * k + k)), m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0);
      loss += -Math.log(e[y[i]] / s) / lab.length;
      for (let c = 0; c < k; c++) dZ[i * k + c] = (e[c] / s - (c === y[i] ? 1 : 0)) / lab.length;
    });
    const g = { W1: new Float64Array(n * hid), b1: new Float64Array(hid), W2: new Float64Array(hid * k), b2: new Float64Array(k) };
    const dT = new Float64Array(n * k);                   // dT = Pᵀ·dZ
    for (let i = 0; i < n; i++) for (let c = 0; c < k; c++) {
      const d = dZ[i * k + c]; if (!d) continue;
      g.b2[c] += d;
      for (let q = 0; q < n; q++) { const p = P[i * n + q]; if (p) dT[q * k + c] += p * d; }
    }
    const dS1 = new Float64Array(n * hid);
    for (let i = 0; i < n; i++) for (let j = 0; j < hid; j++) {
      let dh = 0;
      for (let c = 0; c < k; c++) { dh += dT[i * k + c] * W2[j * k + c]; g.W2[j * k + c] += H1[i * hid + j] * dT[i * k + c]; }
      dS1[i * hid + j] = S1[i * hid + j] > 0 ? dh : 0;
      g.b1[j] += dS1[i * hid + j];
    }
    for (let i = 0; i < n; i++) for (let q = 0; q < n; q++) {   // dW1 = Pᵀ·dS1
      const p = P[i * n + q]; if (!p) continue;
      for (let j = 0; j < hid; j++) g.W1[q * hid + j] += p * dS1[i * hid + j];
    }
    net.t++;
    const b1c = 1 - Math.pow(0.9, net.t), b2c = 1 - Math.pow(0.999, net.t);
    for (const key in prm) {
      const p = prm[key], gr = g[key], m = net.m[key], v = net.v[key];
      for (let i = 0; i < p.length; i++) {
        const gi = gr[i] + wd * p[i];                     // mint a torch Adam weight_decay-je
        m[i] = 0.9 * m[i] + 0.1 * gi; v[i] = 0.999 * v[i] + 0.001 * gi * gi;
        p[i] -= lr * (m[i] / b1c) / (Math.sqrt(v[i] / b2c) + 1e-8);
      }
    }
    return loss;
  }
  /* W2-CORE-END */

  function w2Star(ctx, x, y, r, fill, stroke) {
    ctx.save(); ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      i ? ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)) : ctx.moveTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
  }

  W["gcn-karate"] = root => {
    const K = window.KARATE13;
    if (!K) { root.append(small("Hiányzik a graph-data.js (KARATE13).")); return; }
    header(root, "GCN a karateklubon – két címkéből 34",
      "Csak két tag csoportját ismerjük: az edzőét (1) és az elnökét (34). Egy kétrétegű GCN ebből a gráf szerkezetén keresztül tippeli meg a többi 32 tagot. " +
      "A <b>külső gyűrű</b> a valódi csoport (kék: az edző csoportja, narancs: az elnöké), a <b>kitöltés</b> a modell tippje (minél erősebb, annál biztosabb). " +
      "★ = címkézett csúcs; kattints bármelyik csúcsra, hogy címkét adj neki vagy elvedd. Váltsd át MLP-re (a gráf nélkül), és hasonlítsd össze!");
    const n = K.n, y = K.club, EPOCHS = 200, PER_FRAME = 2;
    let labeled = new Set([0, 33]), mode = "gcn", seed = 1, net, P, out, loss = NaN, raf = 0, target = 0, view = null;

    const bTrain = btn("▶ Tanítás", () => start(), "btn primary"), bStop = btn("❚❚ Állj", () => stop());
    const bStep = btn("Egy lépés", () => { stop(); step(1); draw(); });
    const bReset = btn("↻ Újrakezdés", () => { stop(); seed++; reinit(); draw(); });
    const seedTxt = small("");
    const mg = toggleGroup([["gcn", "GCN"], ["mlp", "MLP (a gráf nélkül)"]], () => mode, k => { if (k === mode) return; mode = k; const run = !!raf; stop(); reinit(); draw(); if (run) start(); });
    root.append(h("div", { class: "controls" }, bTrain, bStop, bStep, bReset, seedTxt), h("div", { class: "controls" }, small("modell:"), mg.bs));
    const [cvG, cvZ] = twoCanvas(root, 0.92, 0.92);
    const legend = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" });
    const stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(legend, stats, ro);
    legend.innerHTML = "Bal: a gráf (kattints egy csúcsra: címke be/ki). Jobb: a két kimeneti szám (logit) csúcsonként, z₀ = „edző csoportja”, z₁ = „elnök csoportja”; " +
      "a szaggatott átló a döntési határ (z₀ = z₁).";

    function reinit() {
      net = w2GcnInit(n, 16, 2, seed); P = w2Prop(n, K.edges, mode === "gcn"); loss = NaN; view = null; out = w2GcnFwd(net, P);
    }
    function step(k) {
      const lab = [...labeled];
      if (!lab.length) return;                              // nincs címke → nincs mit tanulni
      for (let i = 0; i < k; i++) loss = w2GcnStep(net, P, y, lab);
      out = w2GcnFwd(net, P);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; paintBtns(); }
    function start() {
      if (raf) return;
      target = net.t + EPOCHS;
      const tick = () => {
        step(Math.min(PER_FRAME, target - net.t)); draw();
        raf = net.t < target && labeled.size ? requestAnimationFrame(tick) : 0;
        if (!raf) paintBtns();
      };
      raf = requestAnimationFrame(tick); paintBtns();
    }
    function paintBtns() { setDis(bTrain, !!raf); setDis(bStop, !raf); }
    const prob = i => { const a = out.Z[2 * i], b = out.Z[2 * i + 1], m = Math.max(a, b); return Math.exp(b - m) / (Math.exp(a - m) + Math.exp(b - m)); };

    /* gráf */
    let geo = null;
    function nodeStyle(i) {
      const p = prob(i), t = Math.min(1, Math.abs(p - 0.5) * 2.2), col = p >= 0.5 ? "--setB" : "--setA";
      return { fill: mix(col, 0.12 + 0.88 * t), t: 0.12 + 0.88 * t, ringCol: css(y[i] ? "--setB" : "--setA"), wrong: !labeled.has(i) && (p >= 0.5 ? 1 : 0) !== y[i] };
    }
    function drawNode(ctx, x, yy, r, i, fontPx) {
      const s = nodeStyle(i);
      ring(ctx, x, yy, r + 2.2, s.ringCol, 3.2);
      dot(ctx, x, yy, r, s.fill);
      if (labeled.has(i)) ring(ctx, x, yy, r, css("--text"), 2.2);
      else ring(ctx, x, yy, r, rgba(css("--text"), 0.25), 0.8);
      label(ctx, String(i + 1), x, yy + 0.5, ink(s.t), "center", `600 ${fontPx}px system-ui, sans-serif`, "middle");
      if (labeled.has(i)) w2Star(ctx, x + r * 0.95, yy - r * 0.95, Math.max(5, r * 0.62), css("--text"), css("--card"));
      if (s.wrong) { ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.6; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.arc(x, yy, r + 6, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
    }
    function drawGraph() {
      const { ctx, w, h: H } = cvG, r = clamp(w * 0.028, 7.5, 11), pad = r + 9;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const X = i => pad + K.xy[i][0] * (w - 2 * pad), Y = i => pad + K.xy[i][1] * (H - 2 * pad);
      geo = { X, Y, r };
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.globalAlpha = 0.45; ctx.lineWidth = 1;
      ctx.beginPath(); K.edges.forEach(([u, v]) => { ctx.moveTo(X(u), Y(u)); ctx.lineTo(X(v), Y(v)); }); ctx.stroke(); ctx.restore();
      const fp = r >= 9.5 ? 10.5 : 9;
      for (let i = 0; i < n; i++) drawNode(ctx, X(i), Y(i), r, i, fp);
    }
    /* kimeneti tér (z₀, z₁) */
    function drawZ() {
      const Z = out.Z;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let i = 0; i < n; i++) { x0 = Math.min(x0, Z[2 * i]); x1 = Math.max(x1, Z[2 * i]); y0 = Math.min(y0, Z[2 * i + 1]); y1 = Math.max(y1, Z[2 * i + 1]); }
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, need = Math.max(x1 - x0, y1 - y0) / 2 + 0.08;
      const inside = view && x0 >= view.cx - view.hw && x1 <= view.cx + view.hw && y0 >= view.cy - view.hw && y1 <= view.cy + view.hw;
      if (!inside || need < view.hw * 0.45) view = { cx, cy, hw: need * 1.35 + 0.05 };
      const V = eqView(cvZ, view.cx, view.cy, view.hw, view.hw, { xname: "z₀", yname: "z₁" });
      const T = Calc.plot(cvZ, V, []);
      const ctx = cvZ.ctx, lo = Math.max(V.xmin, V.ymin), hi = Math.min(V.xmax, V.ymax);
      if (hi > lo) {
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.globalAlpha = 0.55; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(T.tx(lo), T.ty(lo)); ctx.lineTo(T.tx(hi), T.ty(hi)); ctx.stroke(); ctx.restore();
      }
      if (hi > lo) {                                        // a régiók neve az átló két üres vége mellett
        const m = (hi - lo) * 0.1, f = "600 11px system-ui, sans-serif";
        label(ctx, "↖ elnök csoportja", T.tx(hi - m) - 8, T.ty(hi - m), css("--setB"), "right", f, "bottom");
        label(ctx, "edző csoportja ↘", T.tx(lo + m) + 8, T.ty(lo + m), css("--setA"), "left", f, "top");
      }
      const r = 6.5, order = [...Array(n).keys()].sort((a, b) => labeled.has(a) - labeled.has(b));
      order.forEach(i => {
        const px = T.tx(Z[2 * i]), py = T.ty(Z[2 * i + 1]), s = nodeStyle(i);
        ring(ctx, px, py, r + 1.8, s.ringCol, 2.6);
        dot(ctx, px, py, r, s.fill);
        if (labeled.has(i)) { ring(ctx, px, py, r, css("--text"), 2); w2Star(ctx, px + 6, py - 6, 4.5, css("--text"), css("--card")); }
      });
      /* feliratok: ha sok pont esik egy helyre (pl. MLP-nél), egyetlen „N csúcs” felirat */
      const groups = [];
      order.forEach(i => {
        const px = T.tx(Z[2 * i]), py = T.ty(Z[2 * i + 1]), g = groups.find(q => Math.hypot(q.x - px, q.y - py) < 5);
        g ? g.ids.push(i) : groups.push({ x: px, y: py, ids: [i] });
      });
      groups.forEach(g => {
        const big = g.ids.length >= 4, anyWrong = g.ids.some(i => nodeStyle(i).wrong);
        if (big) { label(ctx, g.ids.length + " csúcs", g.x + r + 4, g.y - 3, anyWrong ? css("--bad") : css("--muted"), "left", "700 11px system-ui, sans-serif", "bottom"); return; }
        g.ids.forEach((i, k) => {
          const w = nodeStyle(i).wrong;
          label(ctx, String(i + 1), g.x + r + 3 + k * 14, g.y - 2, w ? css("--bad") : css("--muted"), "left", (w ? "700 " : "") + "10px system-ui, sans-serif", "bottom");
        });
      });
    }
    function draw() {
      drawGraph(); drawZ(); mg.paint(); paintBtns();
      seedTxt.textContent = "mag (seed): " + seed;
      const rest = [...Array(n).keys()].filter(i => !labeled.has(i));
      const wrong = rest.filter(i => (prob(i) >= 0.5 ? 1 : 0) !== y[i]);
      const ok = rest.length - wrong.length;
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        stat(String(net.t), "epoch"),
        stat(Number.isFinite(loss) ? fmt(loss, 3) : "–", "tanítási veszteség (CE)"),
        stat(rest.length ? `${ok}/${rest.length}` : "–", "helyes a címkézetlenek közül" + (rest.length ? ` (${pct(ok / rest.length)})` : "")),
        stat(String(labeled.size), "címkézett csúcs"));
      let txt = net.t === 0 ? "Még nem tanult: minden tipp bizonytalan (halvány). Nyomd meg a „Tanítás” gombot (" + EPOCHS + " epoch). " : "";
      if (!labeled.size) txt += "Nincs címkézett csúcs – nincs mit tanulni. Kattints legalább egy csúcsra! ";
      txt += wrong.length ? "Rosszul osztályozott: " + wrong.map(i => i + 1).join(", ") + ". " : (net.t ? "Minden címkézetlen csúcs helyes. " : "");
      if (net.t >= 100 && mode === "gcn" && wrong.length === 1 && wrong[0] === 8)
        txt += "A 9-es tag az edzővel tartott, pedig 5 kapcsolatából 3 az elnök oldalára fut – ezt a gráf alapján nem lehet kitalálni.";
      if (net.t >= 100 && mode === "gcn" && wrong.includes(2))
        txt += "A 3-as tag határeset: mindkét oldalhoz sok szál köti, ezért néhány kezdőértéknél (mag) 200 epoch után még rossz oldalon áll – tanítsd tovább! ";
      if (net.t >= 100 && mode === "mlp")
        txt += "Az MLP csak a saját one-hot jellemzőt látja: a címkézetlen csúcsokról semmit sem tud, ezért a tippje véletlen (jellemzően mind egy csoportba kerül).";
      ro.textContent = txt;
    }
    cvG.draw = drawGraph; cvZ.draw = drawZ;
    cvG.c.style.cursor = "pointer";
    cvG.c.addEventListener("pointerdown", e => {
      if (!geo) return;
      const [mx, my] = evXY(cvG, e);
      let best = -1, bd = Infinity;
      for (let i = 0; i < n; i++) { const d = Math.hypot(geo.X(i) - mx, geo.Y(i) - my); if (d < bd) { bd = d; best = i; } }
      if (best < 0 || bd > geo.r + 7) return;
      labeled.has(best) ? labeled.delete(best) : labeled.add(best);
      const run = !!raf; stop(); reinit(); draw(); if (run) start();
    });
    reinit(); draw();
  };

  /* ==================================================================
     13.5-b  gat-attention – figyelem a szomszédokra
     ================================================================== */
  const W2_NODES = ["A", "B", "C", "D", "E"], W2_NAMES = ["Anna", "Bence", "Csilla", "Dávid", "Emese"];
  const W2_EDGES = [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]];
  const W2_XY = [[0.1, 0.2], [0.4, 0.5], [0.1, 0.8], [0.66, 0.5], [0.9, 0.5]];
  const w2Leaky = v => (v >= 0 ? v : 0.2 * v);
  function w2Num(v, min, max, step, oninput) {
    const e = h("input", { type: "number", min, max, step, value: v, style: "width:4.6em" });
    e.addEventListener("input", () => { const x = parseFloat(String(e.value).replace(",", ".")); if (Number.isFinite(x)) oninput(clamp(x, min, max)); });
    return e;
  }
  function w2Slide(lab, min, max, step, val, oninput) {
    const s = slider(min, max, step, val), out = h("b", { style: "font-family:var(--mono);min-width:3.2em;display:inline-block" }, fmt(val, 1));
    s.addEventListener("input", () => { out.textContent = fmt(+s.value, 1); oninput(+s.value); });
    return { el: h("label", null, lab, s, out), set: v => { s.value = v; out.textContent = fmt(+s.value, 1); } };
  }

  W["gat-attention"] = root => {
    header(root, "Figyelem a szomszédokra (GAT)",
      "Bence (B) frissíti a jellemzőjét a szomszédaiból és saját magából (önhurok): u ∈ {A, B, C, D}. " +
      "A GAT minden szomszédnak pontszámot ad, $e_{Bu} = \\mathrm{LeakyReLU}(a_1 h_B + a_2 h_u)$ (negatívra 0,2-es meredekség, W = 1), " +
      "a súly ezek softmaxa: $\\alpha_{Bu} = \\mathrm{softmax}_u(e_{Bu})$, az új érték $h'_B = \\sum_u \\alpha_{Bu} h_u$. " +
      "Hasonlítsd össze a GCN rögzített súlyaival és a sima átlaggal! Az élek vastagsága ∝ α.");
    const hv = [1, 0, 0, 0, 5], N = [0, 1, 2, 3];
    let a1 = 0.5, a2 = 1, manual = false, eMan = [1, 0, 0, 0];
    /* GCN-súlyok: P sora B-re (önhurok, szimmetrikus normalizálás) */
    const dh = [3, 4, 3, 3, 2], gcnW = N.map(u => 1 / Math.sqrt(dh[1] * dh[u]));

    const holder = h("div");
    root.append(holder);
    const cv = Calc.canvas(holder, flatAspect(root, 0.46, 0.72), 760);
    const sA1 = w2Slide("a₁", -3, 3, 0.1, a1, v => { a1 = v; draw(); }), sA2 = w2Slide("a₂", -3, 3, 0.1, a2, v => { a2 = v; draw(); });
    const rowA = h("div", { class: "controls" }, sA1.el, sA2.el);
    const sE = N.map(u => w2Slide("e" + W2_NODES[u], -3, 3, 0.1, eMan[u], v => { eMan[u] = v; draw(); }));
    const rowE = h("div", { class: "controls", style: "display:none" }, sE.map(s => s.el));
    const cMan = checkbox(false, () => {
      manual = cMan.checked;
      if (manual) { const e = scores(); N.forEach(u => { eMan[u] = Math.round(clamp(e[u], -3, 3) * 10) / 10; sE[u].set(eMan[u]); }); }
      rowA.style.display = manual ? "none" : ""; rowE.style.display = manual ? "" : "none"; draw();
    });
    const feats = N.map(u => h("label", null, "h" + W2_NODES[u], w2Num(hv[u], -2, 6, 0.5, v => { hv[u] = v; draw(); })));
    root.append(h("div", { class: "controls" }, small("jellemzők:"), feats, h("label", null, cMan, "Kézi pontszámok")), rowA, rowE);
    const tw = h("div", { class: "tw", style: "overflow-x:auto" }), stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(tw, stats, ro);

    function scores() { return manual ? eMan.slice() : N.map(u => w2Leaky(a1 * hv[1] + a2 * hv[u])); }
    let cur = null;
    function compute() {
      const e = scores(), al = softmax(e);
      const gat = N.reduce((s, u) => s + al[u] * hv[u], 0), gcn = N.reduce((s, u) => s + gcnW[u] * hv[u], 0), mean = N.reduce((s, u) => s + hv[u], 0) / 4;
      return { e, al, gat, gcn, mean };
    }
    function drawCv() {
      if (!cur) return;
      const { ctx, w, h: H } = cv, R = clamp(w * 0.04, 15, 22), pad = R + 10;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const X = i => pad + W2_XY[i][0] * (w - 2 * pad) / 1, Y = i => pad + 14 + (W2_XY[i][1] - 0.2) / 0.6 * (H - 2 * pad - 28);
      const acc = css("--accent"), fs = w < 500 ? 11 : 12;
      W2_EDGES.forEach(([u, v]) => {
        const nb = u === 1 ? v : v === 1 ? u : -1;
        ctx.save(); ctx.lineCap = "round";
        if (nb >= 0) { ctx.strokeStyle = acc; ctx.lineWidth = 1 + 14 * cur.al[nb]; }
        else { ctx.strokeStyle = css("--border"); ctx.lineWidth = 2; }
        ctx.beginPath(); ctx.moveTo(X(u), Y(u)); ctx.lineTo(X(v), Y(v)); ctx.stroke(); ctx.restore();
        if (nb >= 0) {
          const mx = (X(u) + X(v)) / 2, my = (Y(u) + Y(v)) / 2, txt = "α = " + fmt(cur.al[nb], 3);
          ctx.save(); ctx.font = `700 ${fs}px system-ui, sans-serif`; const tw2 = ctx.measureText(txt).width; ctx.restore();
          const oy = nb === 3 ? 16 : 0, ox = nb === 3 ? 0 : 22;    // B–D alatta, hogy ne ütközzön az önhurok feliratával
          ctx.save(); ctx.fillStyle = rgba(css("--card"), 0.88); ctx.fillRect(mx + ox - tw2 / 2 - 3, my + oy - 9, tw2 + 6, 18); ctx.restore();
          label(ctx, txt, mx + ox, my + oy, acc, "center", `700 ${fs}px system-ui, sans-serif`, "middle");
        }
      });
      /* önhurok B-n */
      const bx = X(1), by = Y(1), lr = R * 0.85;
      ctx.save(); ctx.strokeStyle = acc; ctx.lineWidth = 1 + 14 * cur.al[1];
      ctx.beginPath(); ctx.arc(bx, by - R - lr * 0.7, lr, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
      label(ctx, "α = " + fmt(cur.al[1], 3), bx + lr + 10, by - R - lr * 0.7, acc, "left", `700 ${fs}px system-ui, sans-serif`, "middle");
      for (let i = 0; i < 5; i++) {
        const focus = i === 1, inN = i < 4;
        dot(ctx, X(i), Y(i), R, focus ? acc : inN ? mix("--accent", 0.18) : css("--bg-soft"));
        ring(ctx, X(i), Y(i), R, inN ? acc : css("--border"), focus ? 0 : 2);
        label(ctx, W2_NODES[i], X(i), Y(i) + 1, focus ? css("--card") : inN ? css("--text") : css("--muted"), "center", `700 ${Math.round(R * 0.8)}px system-ui, sans-serif`, "middle");
        label(ctx, "h = " + fmt(hv[i], 2), X(i), Y(i) + R + 5, inN ? css("--text") : css("--muted"), "center", `600 ${fs}px system-ui, sans-serif`, "top");
      }
    }
    function draw() {
      cur = compute();
      const { e, al } = cur;
      const th = t => h("th", { style: "white-space:nowrap" }, t), td = (t, st = "") => h("td", { style: "font-family:var(--mono);white-space:nowrap;" + st }, t);
      const sumA = al.reduce((s, v) => s + v, 0), sumG = gcnW.reduce((s, v) => s + v, 0);
      const best = argmax(al), tops = N.filter(u => al[u] > al[best] - 1e-9).map(u => W2_NODES[u]);
      tw.replaceChildren(h("table", { style: "width:auto;min-width:100%" },
        h("tr", null, th("szomszéd u"), th("h_u"), th("pontszám e_Bu"), th("α_Bu (GAT)"), th("GCN-súly"), th("átlag-súly")),
        ...N.map(u => h("tr", null, h("td", { style: "white-space:nowrap" }, W2_NODES[u] + " (" + W2_NAMES[u] + (u === 1 ? ", önhurok" : "") + ")"),
          td(fmt(hv[u], 2)), td(fmt(e[u], 2)), td(fmt(al[u], 3), u === best ? "font-weight:700;color:var(--accent)" : ""), td(fmt(gcnW[u], 3)), td(fmt(0.25, 2)))),
        h("tr", { style: "background:var(--bg-soft)" }, h("td", null, "összeg"), td(""), td(""), td(fmt(sumA, 3), "font-weight:700"), td(fmt(sumG, 3), "color:var(--bad);font-weight:700"), td("1"))));
      const stat = (v, l, hl) => h("div", { class: "stat", style: hl ? "outline:2px solid var(--accent)" : "" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(stat(fmt(cur.gat, 3), "h′_B – GAT (tanult súlyok)", true), stat(fmt(cur.gcn, 3), "h′_B – GCN (rögzített súlyok)"), stat(fmt(cur.mean, 3), "h′_B – sima átlag"));
      let txt = `A legnagyobb figyelmet ${tops.join(" és ")} kap${tops.length > 1 ? "ják" : "ja"} (α = ${fmt(al[best], 3)}). A softmax miatt a GAT-súlyok összege mindig 1; a GCN-súlyoké itt ${fmt(sumG, 3)}. `;
      if (!manual) {
        const allPos = N.every(u => a1 * hv[1] + a2 * hv[u] >= 0);
        txt += allPos ? "Mivel egyik pontszám sem negatív, az a₁·h_B tag minden szomszédnál ugyanannyi, és a softmaxban kiesik: a sorrendet csak a₂·h_u dönti el."
          : "Most van negatív pontszám is: ott a LeakyReLU 0,2-del szoroz, ezért az a₁·h_B tag már nem esik ki teljesen.";
      } else txt += "Írd át a pontszámokat: bármit adsz meg, a súlyok összege 1 marad, és a nagyobb pontszámhoz mindig nagyobb súly tartozik.";
      ro.textContent = txt;
      drawCv();
    }
    cv.draw = drawCv;
    draw();
  };

  /* ==================================================================
     13.6-b  link-predict – kapcsolat-előrejelzés (ajánlás)
     ================================================================== */
  const w2Sig = z => 1 / (1 + Math.exp(-z));
  const w2Vec = p => `(${fmt(p[0], 2)}; ${fmt(p[1], 2)})`;

  W["link-predict"] = root => {
    header(root, "Ki mit vesz? – kapcsolat-előrejelzés",
      "Három vásárló (U1–U3) és két termék (T1, T2) kétdimenziós beágyazása. Egy pár pontszáma a két vektor skaláris szorzata, " +
      "a valószínűség ennek szigmoidja: $p(u, t) = \\sigma(\\mathbf z_u \\cdot \\mathbf z_t)$. Húzd a pontokat, és figyeld, hogyan változnak a valószínűségek és az ajánlások!");
    const DEF = { U: [[1, 0], [0, 1], [1, 1]], T: [[1, -0.5], [0.5, 1]] };
    let U = DEF.U.map(p => p.slice()), T = DEF.T.map(p => p.slice()), neg = false, drag = null;
    const known = [[0, 0], [1, 1], [2, 1]];                     // U1–T1, U2–T2, U3–T2
    const isKnown = (u, t) => known.some(([a, b]) => a === u && b === t);
    const cNeg = checkbox(false, () => { neg = cNeg.checked; draw(); });
    root.append(h("div", { class: "controls" }, h("label", null, cNeg, "negatív minták (a nem vásárolt párok 0 címkével)"),
      btn("↺ Alaphelyzet", () => { U = DEF.U.map(p => p.slice()); T = DEF.T.map(p => p.slice()); draw(); })));
    const [cvE, cvB] = twoCanvas(root, 0.9, 0.9);
    const tw = h("div", { class: "tw", style: "overflow-x:auto" }), stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(tw, stats, ro);
    let TT = null;
    const pts = () => [...U.map((p, i) => ({ p, kind: "U", i })), ...T.map((p, i) => ({ p, kind: "T", i }))];
    const colU = () => css("--setA"), colT = () => css("--setB");

    function drawE() {
      const V = eqView(cvE, 0.25, 0.25, 1.95, 1.95, { xname: "1. koord.", yname: "2. koord.", xstep: 0.5, ystep: 0.5 });
      TT = Calc.plot(cvE, V, []);
      const ctx = cvE.ctx;
      pts().forEach(({ p, kind, i }) => {
        const col = kind === "U" ? colU() : colT();
        ctx.save(); ctx.globalAlpha = 0.55; arrow(ctx, TT.tx(0), TT.ty(0), TT.tx(p[0]), TT.ty(p[1]), col, 1.6); ctx.restore();
      });
      pts().forEach(({ p, kind, i }) => {
        const col = kind === "U" ? colU() : colT(), x = TT.tx(p[0]), y = TT.ty(p[1]), act = drag && drag.kind === kind && drag.i === i;
        if (kind === "U") dot(ctx, x, y, act ? 9 : 7.5, col);
        else { ctx.save(); ctx.fillStyle = col; const s = act ? 9 : 7.5; ctx.fillRect(x - s, y - s, 2 * s, 2 * s); ctx.restore(); }
        ring(ctx, x, y, act ? 11 : 0.01, css("--text"), act ? 1.5 : 0);
        const right = x < cvE.w - 40;
        label(ctx, kind + (i + 1), right ? x + 11 : x - 11, y - 7, col, right ? "left" : "right", "700 13px system-ui, sans-serif", "bottom");
      });
    }
    function drawB(pr) {
      const { ctx, w, h: H } = cvB;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const xl = w * 0.17, xr = w * 0.83, yu = i => H * (0.2 + 0.3 * i), yt = i => H * (0.32 + 0.36 * i);
      label(ctx, "vásárlók", xl, 8, css("--muted"), "center", "600 11px system-ui, sans-serif", "top");
      label(ctx, "termékek", xr, 8, css("--muted"), "center", "600 11px system-ui, sans-serif", "top");
      const fs = w < 330 ? 10.5 : 12;
      for (let u = 0; u < 3; u++) for (let t = 0; t < 2; t++) {
        const p = pr[u][t], kn = isKnown(u, t);
        ctx.save(); ctx.lineWidth = kn ? 3 : 1 + 3 * p;
        ctx.strokeStyle = kn ? css("--setC") : neg ? css("--bad") : css("--muted");
        ctx.globalAlpha = kn ? 1 : 0.35 + 0.6 * p;
        ctx.setLineDash(kn ? [] : [6, 5]);
        ctx.beginPath(); ctx.moveTo(xl, yu(u)); ctx.lineTo(xr, yt(t)); ctx.stroke(); ctx.restore();
      }
      /* címkék a vonalak mentén, a vásárló felőli harmadban (ott nem fedik egymást) */
      for (let u = 0; u < 3; u++) for (let t = 0; t < 2; t++) {
        const p = pr[u][t], kn = isKnown(u, t), f = kn ? 0.3 : u === 1 ? 0.6 : 0.25, lx = xl + (xr - xl) * f, ly = yu(u) + (yt(t) - yu(u)) * f;
        const txt = (kn ? "✓ " : neg ? "✗ " : "") + fmt(p, 3);
        ctx.save(); ctx.font = `700 ${fs}px system-ui, sans-serif`; const tw2 = ctx.measureText(txt).width;
        ctx.fillStyle = css("--card"); ctx.globalAlpha = 0.9; ctx.fillRect(lx - tw2 / 2 - 3, ly - 8, tw2 + 6, 16); ctx.restore();
        label(ctx, txt, lx, ly, kn ? css("--setC") : neg ? css("--bad") : css("--text"), "center", `700 ${fs}px system-ui, sans-serif`, "middle");
      }
      for (let u = 0; u < 3; u++) { dot(ctx, xl, yu(u), 15, colU()); label(ctx, "U" + (u + 1), xl, yu(u) + 1, "#fff", "center", "700 12px system-ui, sans-serif", "middle"); }
      for (let t = 0; t < 2; t++) {
        ctx.save(); ctx.fillStyle = colT(); ctx.fillRect(xr - 15, yt(t) - 15, 30, 30); ctx.restore();
        label(ctx, "T" + (t + 1), xr, yt(t) + 1, "#fff", "center", "700 12px system-ui, sans-serif", "middle");
      }
      label(ctx, "folytonos = vásárolt (1)  ·  szaggatott = " + (neg ? "negatív minta (0)" : "ismeretlen"), w / 2, H - 6, css("--muted"), "center", "11px system-ui, sans-serif", "bottom");
    }
    function draw() {
      const sc = U.map(u => T.map(t => dotp(u, t))), pr = sc.map(r => r.map(w2Sig));
      drawE(); drawB(pr);
      const th = t => h("th", { style: "white-space:nowrap" }, t), td = (t, st = "") => h("td", { style: "font-family:var(--mono);white-space:nowrap;" + st }, t);
      tw.replaceChildren(h("table", { style: "width:auto;min-width:100%" },
        h("tr", null, th("vásárló"), th("U·T1 → p"), th("U·T2 → p"), th("sorrend")),
        ...U.map((u, i) => {
          const ord = pr[i][0] >= pr[i][1] ? [0, 1] : [1, 0];
          return h("tr", null, h("td", { style: "white-space:nowrap" }, h("b", { style: "color:var(--setA)" }, "U" + (i + 1)), " " + w2Vec(u)),
            ...[0, 1].map(t => td(fmt(sc[i][t], 2) + " → " + fmt(pr[i][t], 3) + (isKnown(i, t) ? " ✓" : ""), isKnown(i, t) ? "color:var(--setC);font-weight:700" : "")),
            td(ord.map(t => "T" + (t + 1)).join(" > ")));
        })));
      /* bináris kereszt-entrópia */
      let Ls = 0, cnt = 0;
      for (let u = 0; u < 3; u++) for (let t = 0; t < 2; t++) {
        const kn = isKnown(u, t); if (!kn && !neg) continue;
        const p = clamp(pr[u][t], 1e-12, 1 - 1e-12);
        Ls += -(kn ? Math.log(p) : Math.log(1 - p)); cnt++;
      }
      const L = Ls / cnt;
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(stat(fmt(L, 3), neg ? "BCE-veszteség, mind a 6 pár átlaga" : "BCE-veszteség, csak a 3 vásárlás"),
        stat(T.map((t, i) => "T" + (i + 1) + " " + w2Vec(t)).join("  "), "termékvektorok"));
      ro.textContent = neg
        ? "A vásárolt párok címkéje 1, a többi 0. A veszteség akkor kicsi, ha a vásárolt párok vektora egy irányba, a többié ellentétes irányba mutat. Húzd például T1-et lefelé, U2-től távolabb."
        : "Csak pozitív párokkal a veszteséget úgy is le lehet nyomni, hogy minden vektort hosszabbra húzol – akkor minden pár valószínűsége 1 felé megy. Ezért kellenek negatív minták: kapcsold be!";
    }
    cvE.draw = drawE; cvB.draw = () => draw();
    const pick = e => {
      if (!TT) return null;
      const [mx, my] = evXY(cvE, e);
      let best = null, bd = 16;
      pts().forEach(q => { const d = Math.hypot(TT.tx(q.p[0]) - mx, TT.ty(q.p[1]) - my); if (d < bd) { bd = d; best = q; } });
      return best;
    };
    cvE.c.addEventListener("pointerdown", e => { drag = pick(e); if (drag) { cvE.c.setPointerCapture(e.pointerId); e.preventDefault(); draw(); } });
    cvE.c.addEventListener("pointermove", e => {
      if (!drag) { cvE.c.style.cursor = pick(e) ? "grab" : "default"; return; }
      const [mx, my] = evXY(cvE, e), r = v => Math.round(v * 10) / 10;
      drag.p[0] = clamp(r(TT.ix(mx)), -1.5, 2); drag.p[1] = clamp(r(TT.iy(my)), -1.5, 2);
      draw();
    });
    const end = () => { if (drag) { drag = null; draw(); } };
    cvE.c.addEventListener("pointerup", end); cvE.c.addEventListener("pointercancel", end);
    draw();
  };

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
