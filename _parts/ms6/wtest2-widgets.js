/* =========================================================
   Matematikai statisztika 6. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a valószínűségszámítás-fejezetek mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 1) => (isFinite(x) ? (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(".", ",").replace(/^-(0,0*)$/, "$1") : "–");
  const groupDigits = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const btn = (label, onclick, cls = "btn") => h("button", { class: cls, type: "button", onclick }, label);
  const slider = (min, max, step, value) => h("input", { type: "range", min, max, step, value });

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }

  /* Canvas HiDPI-kezeléssel; a rajzoló függvényt téma- és méretváltáskor újrahívjuk */
  const redrawers = [];
  function makeCanvas(parent, aspect, maxW = 760) {
    const c = h("canvas");
    parent.append(c);
    const obj = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    obj.resize = () => {
      const st = getComputedStyle(parent), inner = parent.clientWidth - (parseFloat(st.paddingLeft) || 0) - (parseFloat(st.paddingRight) || 0);
      const w = Math.min(maxW, inner > 0 ? inner : maxW);
      const hh = Math.round(w * aspect);
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      c.style.width = w + "px"; c.style.height = hh + "px";
      obj.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      obj.w = w; obj.h = hh;
    };
    obj.resize();
    redrawers.push(() => { obj.resize(); obj.draw && obj.draw(); });
    return obj;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => redrawers.forEach(f => f()), 150); });
  new MutationObserver(() => redrawers.forEach(f => f())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const rangeTicks = (lo, hi, n = 8) => {
    const raw = (hi - lo) / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * p).find(s => (hi - lo) / s <= n);
    const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-12; v += step) t.push(+v.toPrecision(10));
    return t;
  };
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", xfmt = String }) {
    const { x0, y0, x1, y1 } = box;
    const tx = v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => { ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke(); ctx.fillText(String(v).replace(".", ","), x0 - 5, ty(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(xfmt(v), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 2); }
    return { tx, ty };
  }
  function vline(ctx, x, y0, y1, color, dash) {
    ctx.save(); if (dash) ctx.setLineDash([6, 5]); ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
  }

  /* Véletlenszám-generátorok: rögzített maggal (mulberry32) és normális (Box–Muller) */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const normal = rnd => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  const poisson = (lam, rnd) => { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
  function sampleIdx(N, n, rnd) { // n különböző index 0..N-1 közül (részleges Fisher–Yates)
    const a = [...Array(N).keys()];
    for (let i = 0; i < n; i++) { const j = i + Math.floor(rnd() * (N - i)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
  }
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     További segédfüggvények (2–3. fejezet)
     ------------------------------------------------------------------ */
  const sorted = a => a.slice().sort((x, y) => x - y);
  const median = a => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const psd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); };
  /* p-edrendű kvantilis: hely (n+1)p, lineáris interpolációval (a tananyag definíciója) */
  function quant(a, p) {
    const s = sorted(a), n = s.length, pos = (n + 1) * p, k = Math.floor(pos), t = pos - k;
    if (k < 1) return s[0];
    if (k >= n) return s[n - 1];
    return s[k - 1] + t * (s[k] - s[k - 1]);
  }
  const erf = x => { // Abramowitz–Stegun 7.1.26
    const s = Math.sign(x); x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  };
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  const stat = (l, v) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
  const labelWrap = (txt, el, out) => h("label", null, txt, el, out || "");

  const ING = [5, 8, 12, 14, 15, 18, 20, 21, 22, 25, 25, 28, 30, 32, 35, 38, 42, 45, 55, 70];
  /* Két változó: kovariancia, Pearson-féle r, rangok (átlagrang kötéseknél), Spearman-féle ρ */
  const pcov = (x, y) => { const mx = mean(x), my = mean(y); return x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / x.length; };
  const pearson = (x, y) => { const c = pcov(x, y), sx = psd(x), sy = psd(y); return sx > 0 && sy > 0 ? c / (sx * sy) : NaN; };
  function ranks(a) {
    const idx = a.map((v, i) => i).sort((i, j) => a[i] - a[j]), r = new Array(a.length);
    for (let k = 0; k < idx.length;) {
      let m = k; while (m + 1 < idx.length && a[idx[m + 1]] === a[idx[k]]) m++;
      for (let t = k; t <= m; t++) r[idx[t]] = (k + m) / 2 + 1;
      k = m + 1;
    }
    return r;
  }
  const spearman = (x, y) => pearson(ranks(x), ranks(y));


  /* ------------------------------------------------------------------
     5. fejezet: mintavételi eloszlások (eloszlásfüggvények: assets/stat.js → window.Stat)
     ------------------------------------------------------------------ */
  const S = window.Stat;
  const sum = a => a.reduce((s, x) => s + x, 0);
  const pct = (x, d = 1) => fmt(100 * x, d) + "%";
  /* Szám-beviteli mező (type=number), onChange(érték) hívással */
  function numBox(value, { min = 0, max = 1e9, step = 1, width = "5.2rem" } = {}, onChange) {
    const el = h("input", { type: "number", min, max, step, value, style: `width:${width}` });
    el.addEventListener("input", () => { const v = parseFloat(el.value); if (isFinite(v) && v >= min && v <= max) onChange(v); });
    return el;
  }
  function statRow(el, items) { el.replaceChildren(...items.map(([l, v]) => stat(l, v))); window.Synopsis && Synopsis.renderMath(el); }
  /* Gombsor (egy választható): opts = [[érték, felirat], …]; visszaad {el, get, set} */
  function segmented(opts, value, onChange) {
    const el = h("div", { class: "controls", style: "gap:.3rem;flex-wrap:wrap" });
    let cur = value;
    const bs = opts.map(([v, l]) => { const b = btn(l, () => set(v, true)); b.dataset.v = v; return b; });
    function set(v, fire) { cur = v; bs.forEach(b => b.classList.toggle("on", b.dataset.v === String(v))); if (fire) onChange(v); }
    el.append(...bs); set(value, false);
    return { el, get: () => cur, set };
  }
  /* Hisztogram adott [lo, hi) tartományon, k osztállyal → {counts, lo, hi, w} */
  function histo(a, lo, hi, k) {
    const counts = new Array(k).fill(0), w = (hi - lo) / k;
    for (const x of a) { let i = Math.floor((x - lo) / w); if (i === k && x === hi) i = k - 1; if (i >= 0 && i < k) counts[i]++; }
    return { counts, lo, hi, w };
  }
  /* Sokasági eloszlások a szimulációkhoz: draw(rnd) → szám; mu, sigma pontos */
  const POPS = {
    unif:  { name: "egyenletes (0–10)", draw: r => 10 * r(), mu: 5, sigma: 10 / Math.sqrt(12), lo: 0, hi: 10, pdf: x => (x >= 0 && x <= 10 ? 0.1 : 0) },
    exp:   { name: "ferde (exponenciális, átlag 2)", draw: r => S.rexp(r, 2), mu: 2, sigma: 2, lo: 0, hi: 12, pdf: x => (x < 0 ? 0 : Math.exp(-x / 2) / 2) },
    bimod: { name: "kétcsúcsú", draw: r => (r() < 0.5 ? 2.5 : 7.5) + 0.8 * S.rnorm(r), mu: 5, sigma: Math.sqrt(0.64 + 6.25), lo: 0, hi: 10,
             pdf: x => 0.5 * S.normal.pdf(x, 2.5, 0.8) + 0.5 * S.normal.pdf(x, 7.5, 0.8) },
    dice:  { name: "kockadobás (1–6)", draw: r => 1 + Math.floor(6 * r()), mu: 3.5, sigma: Math.sqrt(35 / 12), lo: 0.5, hi: 6.5, discrete: [1, 2, 3, 4, 5, 6] },
    coin:  { name: "0–1 (p = 0,3)", draw: r => (r() < 0.3 ? 1 : 0), mu: 0.3, sigma: Math.sqrt(0.21), lo: -0.5, hi: 1.5, discrete: [0, 1] }
  };
  /* Sportoló sokaság az 1. fejezetből (Anna 2, Bence 4, Csilla 6, Dani 8, Emese 10 óra): μ = 6, σ² = 8 */
  const SPORT = [["Anna", 2], ["Bence", 4], ["Csilla", 6], ["Dani", 8], ["Emese", 10]];
  /* Vonalas sűrűséggörbe rajzolása a {tx, ty} transzformációval */
  function curve(ctx, tx, ty, fn, x0, x1, color, width = 2, dash) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); const N = 240;
    for (let i = 0; i <= N; i++) { const x = x0 + (x1 - x0) * i / N, y = fn(x); const X = tx(x), Y = ty(Math.min(y, 1e6)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.stroke(); ctx.restore();
  }
  /* „csúszka + kiírt érték” egy sorban: visszaad {wrap, input, out} */
  function sliderRow(label, min, max, step, value, show, onInput) {
    const input = slider(min, max, step, value), out = h("b", null, show(+value));
    input.addEventListener("input", () => { out.textContent = show(+input.value); onInput(+input.value); });
    return { wrap: labelWrap(label + " ", input, out), input, out };
  }

  /* ------------------------------------------------------------------
     6. fejezet: további közös segédek
     ------------------------------------------------------------------ */
  /* vászon, amelynek magassága a szélesség függvénye: hFn(w). FIGYELEM: állítsd be a cv.draw-t,
     különben méret- vagy témaváltáskor a vászon üres marad. */
  function tallCanvas(parent, hFn, maxW = 760) {
    const cv = makeCanvas(parent, 0.5, maxW);
    cv.resize = () => {
      const st = getComputedStyle(parent), inner = parent.clientWidth - (parseFloat(st.paddingLeft) || 0) - (parseFloat(st.paddingRight) || 0);
      const w = Math.min(maxW, inner > 0 ? inner : maxW), hh = Math.round(hFn(w)), dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv.w = w; cv.h = hh;
    };
    cv.resize();
    return cv;
  }
  /* HTML jelmagyarázat: items = [[szöveg (KaTeX is lehet), színváltozó, "line" | "dash" | "box"]] */
  const keyRow = items => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem 1rem;font-size:.85rem;margin:.35rem 0;color:var(--muted)" },
    ...items.map(([t, c, kind = "line"]) => h("span", { style: "display:inline-flex;align-items:center;gap:.35rem" },
      h("span", { style: kind === "dash" ? `display:inline-block;width:18px;height:0;border-top:2.5px dashed var(${c})`
        : kind === "box" ? `display:inline-block;width:11px;height:11px;background:var(${c});border-radius:2px;opacity:.75`
        : `display:inline-block;width:18px;height:3px;background:var(${c});border-radius:2px` }), h("span", { html: t }))));
  /* szám KaTeX-be: tizedesvessző {,}, ezres tagolás \, */
  const texNum = (x, d = 2) => fmt(x, d).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,").replace(",", "{,}");
  /* konfidencia-intervallumok (a tananyag képletei) */
  const CI = {
    meanZ: (xbar, sigma, n, level) => { const z = S.normal.inv(1 - (1 - level) / 2), d = z * sigma / Math.sqrt(n); return [xbar - d, xbar + d, d, z]; },
    meanT: (xbar, s, n, level) => { const t = S.t.inv(1 - (1 - level) / 2, n - 1), d = t * s / Math.sqrt(n); return [xbar - d, xbar + d, d, t]; },
    wald: (k, n, level) => { const z = S.normal.inv(1 - (1 - level) / 2), p = k / n, d = z * Math.sqrt(p * (1 - p) / n); return [p - d, p + d, d, z]; },
    wilson: (k, n, level) => { const z = S.normal.inv(1 - (1 - level) / 2), p = k / n, z2 = z * z, c = (p + z2 / (2 * n)) / (1 + z2 / n),
      hw = z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n)) / (1 + z2 / n); return [c - hw, c + hw, hw, z]; },
    varChi: (s2, n, level) => { const a = 1 - level, lo = S.chi2.inv(a / 2, n - 1), hi = S.chi2.inv(1 - a / 2, n - 1); return [(n - 1) * s2 / hi, (n - 1) * s2 / lo, lo, hi]; }
  };
  /* a futó példa: NGA zöldborsó-konzervek töltősúlya (g), n = 15, átlag 398, s = 13,27 */
  const KONZERV = [401, 392, 387, 400, 408, 390, 415, 383, 395, 406, 418, 420, 381, 395, 379];
  const INGAZAS = [12, 15, 17, 18, 20, 22, 23, 25, 28, 34, 45, 61];

  /* ==================================================================
     w2: ci-width (6.3-d), proportion-ci (6.4-b), sigma-ci (6.5),
         n-planner (6.6), boot-ci (6.7)
     ================================================================== */

  /* --- w2 saját segédei --- */
  const w2R = String.raw;
  const w2Minus = s => String(s).replace(/^-/, "−");
  const w2F = (x, d = 1) => w2Minus(fmt(x, d));
  /* legfeljebb maxd tizedes, a záró nullák nélkül: 5 → "5", 0,975 → "0,975" */
  const w2Num = (x, maxd = 3) => {
    if (!isFinite(x)) return "–";
    let s = fmt(x, maxd);
    if (s.includes(",")) s = s.replace(/0+$/, "").replace(/,$/, "");
    return w2Minus(s);
  };
  /* szám KaTeX-be: tizedesvessző {,}, ezres tagolás \, , mínusz „-” */
  const w2K = s => String(s).replace(/−/g, "-").replace(/\d+(,\d+)?/g, m => { const [a, b] = m.split(","); return a.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") + (b ? "{,}" + b : ""); });
  /* vezérlősor; a beágyazott gombsorok (segmented) saját margója nélkül */
  const w2Ctl = (...kids) => { kids.forEach(k => k && k.classList && k.classList.contains("controls") && (k.style.margin = "0")); return h("div", { class: "controls" }, ...kids); };
  const w2R2 = x => Math.round(x * 100) / 100;
  const w2Lab = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const w2Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.6rem 0 0", html });
  const w2Sec = t => h("div", { style: "font-weight:600;margin:1rem 0 .2rem;font-size:.98rem" }, t);
  /* kijelzősor egyszer felépítve (KaTeX-címkékkel), utána csak az értékek frissülnek */
  function w2Stats(el, labels) {
    statRow(el, labels.map(l => [l, "–"]));
    const vs = [...el.querySelectorAll(".v")];
    return vals => vals.forEach((v, i) => { if (vs[i] && vs[i].innerHTML !== String(v)) vs[i].innerHTML = v; });
  }
  const w2Math = (el, html) => { if (el.innerHTML !== html) { el.innerHTML = html; window.Synopsis && Synopsis.renderMath(el); } };
  const w2Clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const w2Font = (ctx, px, bold) => { ctx.font = `${bold ? "600 " : ""}${px}px system-ui, sans-serif`; };
  /* szöveg x köré középre, de a [lo, hi] sávon belül tartva */
  function w2TextIn(ctx, s, x, y, lo, hi) {
    const tw = ctx.measureText(s).width;
    ctx.textAlign = "left";
    ctx.fillText(s, Math.max(lo, Math.min(hi - tw, x - tw / 2)), y);
  }
  /* terület a görbe alatt [a, b]-n */
  function w2Area(ctx, tx, ty, fn, a, b, color, alpha) {
    if (!(b > a)) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(tx(a), ty(0));
    const N = 160;
    for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N, y = fn(x); ctx.lineTo(tx(x), ty(isFinite(y) ? y : 0)); }
    ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  const w2Dot = (ctx, x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); };
  /* tengely saját y-feliratokkal (yfmt), a rácsvonalak a tengely alatt */
  function w2Axes(ctx, box, o) {
    const yt = o.yticks || [], ty = v => box.y1 - (v - o.ymin) / (o.ymax - o.ymin) * (box.y1 - box.y0);
    ctx.save(); ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1; w2Font(ctx, 11);
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach(v => { const y = ty(v); ctx.beginPath(); ctx.moveTo(box.x0, y); ctx.lineTo(box.x1, y); ctx.stroke(); ctx.fillText((o.yfmt || String)(v), box.x0 - 5, y); });
    ctx.restore();
    return axes(ctx, box, { ...o, yticks: [] });
  }
  /* vízszintes intervallum-sáv [a, b] az y magasságban; a [lo, hi] tartományon kívüli részt levágja és nyíllal jelzi */
  function w2Bar(ctx, xa, xb, y, th, color, { lo = -Infinity, hi = Infinity, alpha = 1, caps = true } = {}) {
    const a = Math.max(lo, xa), b = Math.min(hi, xb);
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.strokeStyle = color;
    if (b > a) ctx.fillRect(a, y - th / 2, b - a, th);
    ctx.lineWidth = 2;
    const arrow = (x, dir) => { ctx.beginPath(); ctx.moveTo(x + dir * 7, y); ctx.lineTo(x, y - th / 2 - 3); ctx.lineTo(x, y + th / 2 + 3); ctx.closePath(); ctx.fill(); };
    if (xa < lo) arrow(lo, -1); else if (caps && xa <= hi) { ctx.beginPath(); ctx.moveTo(a, y - th / 2 - 3); ctx.lineTo(a, y + th / 2 + 3); ctx.stroke(); }
    if (xb > hi) arrow(hi, 1); else if (caps && xb >= lo) { ctx.beginPath(); ctx.moveTo(b, y - th / 2 - 3); ctx.lineTo(b, y + th / 2 + 3); ctx.stroke(); }
    ctx.restore();
  }
  /* címke kis háttérrel (hogy a rács fölött is olvasható legyen) */
  function w2Tag(ctx, s, x, y, color, align = "left") {
    const tw = ctx.measureText(s).width, X = align === "right" ? x - tw : align === "center" ? x - tw / 2 : x;
    ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(X - 2, y - 7, tw + 4, 14); ctx.restore();
    ctx.fillStyle = color; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, X, y);
  }
  /* megbízhatósági szintek és a hozzájuk tartozó feliratok */
  const w2LvTxt = L => w2Num(100 * L, 1) + "%";
  const w2LvSeg = (levels, value, onChange) => segmented(levels.map(L => [L, w2LvTxt(L)]), value, v => onChange(+v));
  const w2Q = L => 1 - (1 - L) / 2;                         // 1 − α/2
  const w2Z = L => S.normal.inv(w2Q(L));
  const w2Iv = (a, b, d = 2) => `[${w2F(a, d)}; ${w2F(b, d)}]`;
  /* vászon pointer-figyeléssel (egér + érintés; függőleges görgetés megmarad) */
  function w2Pointer(cv, onX) {
    cv.c.style.touchAction = "pan-y";
    const f = e => { const r = cv.c.getBoundingClientRect(); onX(e.clientX - r.left, e.clientY - r.top); };
    cv.c.addEventListener("pointerdown", f);
    cv.c.addEventListener("pointermove", e => { if (e.pointerType === "mouse" || e.buttons) f(e); });
  }

  /* ------------------------------------------------------------------
     6.3-d  Mitől széles egy intervallum?
     ------------------------------------------------------------------ */
  W["ci-width"] = root => {
    header(root, "Mitől széles egy intervallum?",
      w2R`A konzervpélda pontbecslése $\bar x = 398$ g. Az intervallum $\bar x \pm \Delta$; nézd meg, hogyan változik a hibahatár $\Delta$ a szórással, a mintanagysággal és a megbízhatósági szinttel.`);
    let sigma = 10, n = 15, level = 0.95, mode = "z";
    const XB = 398, NMIN = 2, NMAX = 400, POS = 1000;
    const n2pos = v => Math.round(POS * Math.log(v / NMIN) / Math.log(NMAX / NMIN));
    const pos2n = p => w2Clamp(Math.round(NMIN * Math.pow(NMAX / NMIN, p / POS)), NMIN, NMAX);
    const sR = sliderRow("szórás $\\sigma$:", 1, 40, 1, sigma, v => v + " g", v => { sigma = v; upd(); });
    const nR = sliderRow("mintanagyság $n$:", 0, POS, 1, n2pos(n), p => pos2n(p), p => { n = pos2n(p); upd(); });
    const setN = v => { n = w2Clamp(v, NMIN, NMAX); nR.input.value = n2pos(n); nR.out.textContent = n; upd(); };
    const mB = btn("−", () => setN(n - 1)), pB = btn("+", () => setN(n + 1));
    mB.title = "n eggyel kisebb"; pB.title = "n eggyel nagyobb";
    const lvSeg = w2LvSeg([0.8, 0.9, 0.95, 0.99, 0.999], level, v => { level = v; upd(); });
    const mSeg = segmented([["z", w2R`$\sigma$ ismert ($z$)`], ["t", w2R`$\sigma$ ismeretlen ($t$, $s = \sigma$-val)`]], mode, v => { mode = v; upd(); });
    root.append(w2Ctl(sR.wrap), w2Ctl(nR.wrap, mB, pB), w2Ctl(w2Lab("megbízhatósági szint:"), lvSeg.el), w2Ctl(mSeg.el));
    const form = h("div", { class: "formula-out", style: "overflow-x:auto" }); root.append(form);
    const cv = tallCanvas(root, w => (w < 500 ? 158 : 168));
    root.append(keyRow([[w2R`$\bar x \pm \Delta$ a választott szinten`, "--accent", "box"], ["összehasonlítás: 90%, 95%, 99%", "--accent", "line"], [w2R`pontbecslés $\bar x = 398$`, "--text", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, [w2R`hibahatár $\Delta$`, "intervallum (g)", w2R`szélesség $2\Delta$`, "kvantilis"]);
    const what = h("div", { class: "readout" }); root.append(what);
    root.append(w2Note(w2R`Négyszer akkora minta kell a fele akkora hibához – $\Delta$ csak $\sqrt n$-nel csökken.`));

    const quant = (L, m) => (mode === "z" ? w2Z(L) : S.t.inv(w2Q(L), m - 1));
    const delta = (L, m) => quant(L, m) * sigma / Math.sqrt(m);
    function upd() {
      const q = quant(level, n), d = q * sigma / Math.sqrt(n), qs = w2K(w2Num(w2Q(level), 4));
      const sym = mode === "z" ? `z_{${qs}}` : `t_{${n - 1};\\,${qs}}`;
      w2Math(form, `$\\Delta = ${sym}\\cdot\\dfrac{${mode === "z" ? "\\sigma" : "s"}}{\\sqrt n} = ${w2K(fmt(q, 3))}\\cdot\\dfrac{${sigma}}{\\sqrt{${n}}} = ${w2K(fmt(d, 2))}$`);
      setS([fmt(d, 2) + " g", w2Iv(XB - d, XB + d), fmt(2 * d, 2) + " g"]);
      w2Math(sEl.querySelectorAll(".v")[3], `$${sym} = ${w2K(fmt(q, 3))}$`);
      const d2 = delta(level, 2 * n), d4 = delta(level, 4 * n);
      const r2 = d2 / d, r4 = d4 / d;
      w2Math(what, `<b>Mi lenne, ha…</b><br>kétszeres $n$ (${2 * n}): $\\Delta = ${w2K(fmt(d2, 2))}$ (× ${fmt(r2, 3)})` +
        `<br>négyszeres $n$ (${4 * n}): $\\Delta = ${w2K(fmt(d4, 2))}$ (× ${fmt(r4, 3)}${Math.abs(r4 - 0.5) < 5e-4 ? " – a fele" : ""})` +
        (mode === "t" ? `<br><small>A $t$-módban a szorzó kisebb, mint $0{,}707$ ill. $0{,}5$: nagyobb $n$-nél a $t$-kvantilis is csökken.</small>` : ""));
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, L = w < 500 ? 42 : 50;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: L, y0: 6, x1: w - 12, y1: H - 34 };
      const { tx } = axes(ctx, box, { xmin: 370, xmax: 430, ymin: 0, ymax: 1, xticks: rangeTicks(370, 430, w < 500 ? 6 : 12), xlabel: "g" });
      const d = delta(level, n), yM = 40, th = 16;
      // összehasonlító sávok
      const rows = [0.9, 0.95, 0.99].map((Lv, i) => [Lv, 74 + i * 18]);
      rows.forEach(([Lv, y]) => {
        const dd = delta(Lv, n);
        w2Bar(ctx, tx(XB - dd), tx(XB + dd), y, 7, css("--accent"), { lo: box.x0, hi: box.x1, alpha: 0.32 });
        ctx.fillStyle = css(Lv === level ? "--text" : "--muted"); w2Font(ctx, 11, Lv === level);
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(w2LvTxt(Lv), L - 6, y);
      });
      // választott szint
      w2Bar(ctx, tx(XB - d), tx(XB + d), yM, th, css("--accent"), { lo: box.x0, hi: box.x1, alpha: 0.8 });
      ctx.fillStyle = css("--text"); w2Font(ctx, 12, true); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(w2LvTxt(level), L - 6, yM);
      vline(ctx, tx(XB), yM - th / 2 - 4, box.y1, css("--text"));
      w2Dot(ctx, tx(XB), yM, 4, css("--text"));
      // végpontok
      w2Font(ctx, 11, true); ctx.fillStyle = css("--text"); ctx.textBaseline = "bottom";
      const sl = w2F(XB - d, 2), sh = w2F(XB + d, 2), wl = ctx.measureText(sl).width, wh = ctx.measureText(sh).width;
      let xl = w2Clamp(tx(XB - d), box.x0, box.x1), xh = w2Clamp(tx(XB + d), box.x0, box.x1);
      xl = Math.max(box.x0, Math.min(xl - wl / 2, tx(XB) - wl - 8)); xh = Math.min(box.x1 - wh, Math.max(xh - wh / 2, tx(XB) + 8));
      ctx.textAlign = "left"; ctx.fillText(sl, xl, yM - th / 2 - 4); ctx.fillText(sh, xh, yM - th / 2 - 4);
    };
    upd();
  };

  /* ------------------------------------------------------------------
     6.4-b  Wald vagy Wilson? – mikor hazudik a 95%
     ------------------------------------------------------------------ */
  W["proportion-ci"] = root => {
    header(root, "Wald vagy Wilson? – mikor hazudik a 95%",
      w2R`Arány becslése: $k$ „igen” $n$ válaszból, $\hat p = k/n$. A Wald-intervallum $\hat p \pm z\sqrt{\hat p(1-\hat p)/n}$; a Wilson-intervallum a középpontot is $\tfrac12$ felé húzza.`);
    let k = 7, n = 10, level = 0.95, nCov = 20, pSel = 0.1;
    const lvSeg = w2LvSeg([0.9, 0.95, 0.99], level, v => { level = v; covCache = null; upd(); drawCov(); });
    root.append(w2Ctl(w2Lab("megbízhatósági szint (mindkét részhez):"), lvSeg.el));
    /* (a) kalkulátor */
    root.append(w2Sec("(a) Kalkulátor"));
    const kBox = numBox(k, { min: 0, max: 5000, step: 1 }, () => readIn());
    const nBox = numBox(n, { min: 1, max: 5000, step: 1 }, () => readIn());
    const preset = (kk, nn, lab) => btn(lab, () => { kBox.value = kk; nBox.value = nn; readIn(); });
    root.append(w2Ctl(labelWrap("$k$ =", kBox), labelWrap("$n$ =", nBox)),
      w2Ctl(w2Lab("példák:"), preset(0, 20, "0 / 20"), preset(7, 10, "7 / 10"), preset(176, 800, "176 / 800 (rádió)"), preset(310, 1000, "310 / 1000 (közvélemény-kutatás)")));
    const cvA = tallCanvas(root, () => 106);
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, [w2R`$\hat p = k/n$`, "Wald-intervallum", "Wilson-intervallum"]);
    const warn = h("div", { class: "readout" }); root.append(warn);
    /* (b) lefedettség */
    root.append(w2Sec("(b) Pontos lefedettség – milyen gyakran találja el az intervallum a valódi p-t?"));
    const nSeg = segmented([10, 20, 50, 100, 1000].map(v => [v, groupDigits(v)]), nCov, v => { nCov = +v; covCache = null; drawCov(); });
    const pR = sliderRow("valódi $p$:", 0.01, 0.99, 0.01, pSel, v => fmt(v, 2), v => { pSel = v; drawCov(); });
    root.append(w2Ctl(w2Lab("mintanagyság $n$:"), nSeg.el), w2Ctl(pR.wrap));
    const cvB = tallCanvas(root, w => w2Clamp(w * 0.5, 220, 300));
    root.append(keyRow([["Wald", "--setB", "line"], ["Wilson", "--setA", "line"], ["névleges szint", "--text", "dash"]]));
    const cEl = h("div", { class: "stat-row" }); root.append(cEl);
    const setC = w2Stats(cEl, ["valódi $p$", "Wald lefedettsége", "Wilson lefedettsége"]);
    root.append(w2Note(w2R`A Wald kis $n$-nél és szélső $p$-nél jóval 95% alatt fed le; a Wilson közel tartja a névleges szintet. (A görbe binomiális összegzéssel, pontosan számolt: $\sum_k P(X=k)$ azokra a $k$-kra, amelyek intervalluma tartalmazza $p$-t.)`));

    function readIn() {
      const kk = parseFloat(kBox.value), nn = parseFloat(nBox.value);
      if (!(Number.isInteger(nn) && nn >= 1 && nn <= 5000)) return showErr("$n$ egész szám legyen 1 és 5000 között.");
      if (!(Number.isInteger(kk) && kk >= 0 && kk <= nn)) return showErr("$k$ egész szám legyen 0 és $n$ között.");
      k = kk; n = nn; upd();
    }
    function showErr(t) { w2Math(warn, `<b style="color:var(--bad)">${t}</b>`); }
    const f3 = v => w2F(v, 3);
    function upd() {
      const wa = CI.wald(k, n, level), wi = CI.wilson(k, n, level), ph = k / n;
      const wlo = Math.max(0, wa[0]), whi = Math.min(1, wa[1]);
      setS([f3(ph), `[${f3(wlo)}; ${f3(whi)}]`, `[${f3(wi[0])}; ${f3(wi[1])}]`]);
      const msg = [];
      if (wa[2] < 1e-12) msg.push(`<b style="color:var(--bad)">Wald: nulla szélességű – értelmetlen.</b> $\\hat p = ${w2K(w2Num(ph))}$ mellett $\\hat p(1-\\hat p) = 0$, így a képlet szerint nincs bizonytalanság. A Wilson-intervallum ilyenkor is használható.`);
      if (wa[0] < -1e-12) msg.push(`<b style="color:var(--bad)">Wald: a képlet szerinti alsó határ ${f3(wa[0])}</b> – a 0 alá lógó rész értelmetlen (arány nem lehet negatív), ezért 0-nál levágtuk.`);
      if (wa[1] > 1 + 1e-12) msg.push(`<b style="color:var(--bad)">Wald: a képlet szerinti felső határ ${f3(wa[1])}</b> – az 1 fölé lógó rész értelmetlen, ezért 1-nél levágtuk.`);
      if (!msg.length) {
        const np = Math.min(k, n - k);
        msg.push(np >= 10 ? `Nagy minta: $n\\hat p = ${k}$ és $n(1-\\hat p) = ${n - k}$ is legalább 10, a két intervallum alig tér el.`
          : `Kis szám: $\\min(k,\\ n-k) = ${np} < 10$ – itt a Wald- és a Wilson-intervallum már érezhetően eltér.`);
      }
      w2Math(warn, msg.join("<br>"));
      cvA.draw();
    }
    cvA.draw = () => {
      const ctx = cvA.ctx, w = cvA.w, H = cvA.h, L = w < 500 ? 48 : 56;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: L, y0: 6, x1: w - 10, y1: H - 26 };
      const { tx } = axes(ctx, box, { xmin: -0.08, xmax: 1.08, ymin: 0, ymax: 1, xticks: rangeTicks(0, 1, w < 500 ? 5 : 10), xfmt: v => w2Num(v, 1), xlabel: "" });
      // lehetetlen tartomány
      ctx.save(); ctx.globalAlpha = 0.13; ctx.fillStyle = css("--muted");
      ctx.fillRect(tx(-0.08), box.y0, tx(0) - tx(-0.08), box.y1 - box.y0); ctx.fillRect(tx(1), box.y0, tx(1.08) - tx(1), box.y1 - box.y0); ctx.restore();
      const wa = CI.wald(k, n, level), wi = CI.wilson(k, n, level), ph = k / n;
      vline(ctx, tx(ph), box.y0, box.y1, css("--text"), true);
      [["Wald", wa, "--setB", 26], ["Wilson", wi, "--setA", 54]].forEach(([nm, iv, c, y]) => {
        ctx.fillStyle = css("--text"); w2Font(ctx, 12, true); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(nm, L - 6, y);
        if (iv[1] - iv[0] < 1e-12) {
          ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(tx(iv[0]), y, 6, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
          ctx.fillStyle = css("--bad"); w2Font(ctx, 11, true); ctx.textAlign = "left"; ctx.fillText("nulla szélességű!", Math.min(tx(iv[0]) + 12, box.x1 - 100), y);
          return;
        }
        // a [0; 1]-en kívüli (értelmetlen) rész szaggatottan
        if (iv[0] < 0 || iv[1] > 1) {
          ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 3; ctx.setLineDash([4, 3]); ctx.beginPath();
          if (iv[0] < 0) { ctx.moveTo(Math.max(box.x0, tx(iv[0])), y); ctx.lineTo(tx(0), y); }
          if (iv[1] > 1) { ctx.moveTo(tx(1), y); ctx.lineTo(Math.min(box.x1, tx(iv[1])), y); }
          ctx.stroke(); ctx.restore();
        }
        w2Bar(ctx, tx(Math.max(0, iv[0])), tx(Math.min(1, iv[1])), y, 12, css(c), { alpha: 0.85 });
      });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textBaseline = "bottom";
      w2TextIn(ctx, "p̂", tx(ph) + 8, box.y1 - 1, box.x0, box.x1);
    };

    /* pontos lefedettség */
    let covCache = null;
    function ivs(nn, kind) {
      const lo = new Float64Array(nn + 1), hi = new Float64Array(nn + 1);
      for (let kk = 0; kk <= nn; kk++) { const iv = CI[kind](kk, nn, level); lo[kk] = iv[0]; hi[kk] = iv[1]; }
      return { lo, hi };
    }
    function coverage(nn, p, iv) {
      let s = 0;
      for (let kk = 0; kk <= nn; kk++) if (iv.lo[kk] <= p + 1e-12 && p - 1e-12 <= iv.hi[kk]) s += S.binom.pmf(kk, nn, p);
      return s;
    }
    const PG = Array.from({ length: 200 }, (_, i) => 0.01 + 0.98 * i / 199);
    function getCov() {
      if (covCache) return covCache;
      const IW = ivs(nCov, "wald"), IL = ivs(nCov, "wilson");
      covCache = { IW, IL, wald: PG.map(p => coverage(nCov, p, IW)), wil: PG.map(p => coverage(nCov, p, IL)) };
      return covCache;
    }
    let geoB = null;
    function drawCov() {
      const ctx = cvB.ctx, w = cvB.w, H = cvB.h, C = getCov();
      ctx.clearRect(0, 0, w, H);
      const mn = Math.min(...C.wald, ...C.wil), ymin = Math.min(0.8, Math.floor(mn * 10) / 10);
      const box = { x0: 42, y0: 14, x1: w - 10, y1: H - 34 };
      const yt = rangeTicks(ymin, 1, 5).filter(v => v >= ymin - 1e-9);
      const { tx, ty } = w2Axes(ctx, box, { xmin: 0, xmax: 1, ymin, ymax: 1, xticks: rangeTicks(0, 1, w < 500 ? 5 : 10), xfmt: v => w2Num(v, 1), yticks: yt, yfmt: v => pct(v, 0), xlabel: "valódi p", ylabel: "lefedettség" });
      geoB = { tx, box };
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(box.x0, ty(level)); ctx.lineTo(box.x1, ty(level)); ctx.stroke(); ctx.restore();
      const line = (arr, c, wd) => {
        ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = wd; ctx.lineJoin = "round"; ctx.beginPath();
        arr.forEach((v, i) => { const X = tx(PG[i]), Y = ty(v); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.restore();
      };
      line(C.wald, "--setB", 1.8); line(C.wil, "--setA", 1.8);
      // kiválasztott p
      const cw = coverage(nCov, pSel, C.IW), cl = coverage(nCov, pSel, C.IL);
      vline(ctx, tx(pSel), box.y0, box.y1, css("--muted"));
      w2Dot(ctx, tx(pSel), ty(Math.max(ymin, cw)), 4.5, css("--setB"));
      w2Dot(ctx, tx(pSel), ty(Math.max(ymin, cl)), 4.5, css("--setA"));
      if (w < 500) { setC([fmt(pSel, 2), pct(cw, 1), pct(cl, 1)]); return; }
      w2Font(ctx, 11, true);
      const right = tx(pSel) < (box.x0 + box.x1) / 2;
      let yW = ty(Math.max(ymin, cw)), yL = ty(Math.max(ymin, cl));
      if (Math.abs(yW - yL) < 15) { if (yW >= yL) { yW = yL + 15; } else { yL = yW + 15; } }
      const X = tx(pSel) + (right ? 8 : -8), al = right ? "left" : "right";
      w2Tag(ctx, pct(cw, 1), X, w2Clamp(yW, box.y0 + 6, box.y1 - 6), css("--setB"), al);
      w2Tag(ctx, pct(cl, 1), X, w2Clamp(yL, box.y0 + 6, box.y1 - 6), css("--setA"), al);
      setC([fmt(pSel, 2), pct(cw, 1), pct(cl, 1)]);
    }
    cvB.draw = drawCov;
    w2Pointer(cvB, x => {
      if (!geoB) return;
      const { box } = geoB, p = w2Clamp(Math.round(((x - box.x0) / (box.x1 - box.x0)) * 100) / 100, 0.01, 0.99);
      if (p !== pSel) { pSel = p; pR.input.value = p; pR.out.textContent = fmt(p, 2); drawCov(); }
    });
    upd(); drawCov();
  };

  /* ------------------------------------------------------------------
     6.5  Szórás-intervallum és a normalitás
     ------------------------------------------------------------------ */
  W["sigma-ci"] = root => {
    header(root, "Szórás-intervallum és a normalitás",
      w2R`Normális sokaságból vett mintánál $\dfrac{(n-1)s^2}{\sigma^2}$ khi-négyzet eloszlású $n-1$ szabadságfokkal. A két farok levágásából kapjuk $\sigma^2$, gyökvonással $\sigma$ intervallumát.`);
    let level = 0.95;
    const n = KONZERV.length, s = S.sd(KONZERV), s2 = s * s, df = n - 1;
    const lvSeg = w2LvSeg([0.9, 0.95, 0.99], level, v => { level = v; updA(); drawSim(); });
    root.append(w2Ctl(w2Lab("megbízhatósági szint (mindkét részhez):"), lvSeg.el));
    root.append(w2Sec(`(a) A konzervek (n = ${n}, s = ${fmt(s, 2)} g)`));
    const cvA = tallCanvas(root, w => w2Clamp(w * 0.34, 170, 230));
    root.append(keyRow([[w2R`$\chi^2_{${df}}$-sűrűség`, "--accent", "line"], ["levágott farkak (együtt α)", "--setB", "box"]]));
    const cvS = tallCanvas(root, () => 100);
    root.append(keyRow([[w2R`intervallum $\sigma$-ra`, "--accent", "box"], ["pontbecslés $s$", "--text", "line"]]));
    const form = h("div", { class: "formula-out", style: "overflow-x:auto;font-size:1rem" }); root.append(form);
    const aEl = h("div", { class: "stat-row" }); root.append(aEl);
    const setA = w2Stats(aEl, ["khi-négyzet-kvantilisek", w2R`intervallum $\sigma^2$-re`, w2R`intervallum $\sigma$-ra (g)`, w2R`$s$-től lefelé / felfelé`]);
    root.append(w2Note(w2R`Figyeld meg: a <b>nagyobb</b> kvantilis adja az <b>alsó</b> határt (mert osztunk vele), és a pontbecslés nincs középen – a khi-négyzet eloszlás ferde.`));

    function updA() {
      const iv = CI.varChi(s2, n, level), a = 1 - level;
      const qa = w2K(w2Num(a / 2, 4)), qb = w2K(w2Num(1 - a / 2, 4));
      w2Math(form, `$\\sigma^2 \\in \\left[\\dfrac{${df}\\cdot ${w2K(fmt(s2, 2))}}{\\chi^2_{${df};\\,${qb}}};\\ \\dfrac{${df}\\cdot ${w2K(fmt(s2, 2))}}{\\chi^2_{${df};\\,${qa}}}\\right] = \\left[\\dfrac{${w2K(fmt(df * s2, 1))}}{${w2K(fmt(iv[3], 3))}};\\ \\dfrac{${w2K(fmt(df * s2, 1))}}{${w2K(fmt(iv[2], 3))}}\\right] = [${w2K(fmt(iv[0], 1))};\\ ${w2K(fmt(iv[1], 1))}]$`);
      setA([`${fmt(iv[2], 3)} és ${fmt(iv[3], 3)}`, w2Iv(iv[0], iv[1], 1), w2Iv(Math.sqrt(iv[0]), Math.sqrt(iv[1]), 2),
        `−${fmt(w2R2(s) - w2R2(Math.sqrt(iv[0])), 2)} / +${fmt(w2R2(Math.sqrt(iv[1])) - w2R2(s), 2)}`]);
      cvA.draw(); cvS.draw();
    }
    cvA.draw = () => {
      const ctx = cvA.ctx, w = cvA.w, H = cvA.h, iv = CI.varChi(s2, n, level);
      ctx.clearRect(0, 0, w, H);
      const xmax = 40, pdf = x => S.chi2.pdf(x, df), ym = 0.09;
      const box = { x0: 40, y0: 18, x1: w - 10, y1: H - 32 };
      const { tx, ty } = w2Axes(ctx, box, { xmin: 0, xmax, ymin: 0, ymax: ym, xticks: rangeTicks(0, xmax, w < 500 ? 5 : 8), yticks: [0.02, 0.04, 0.06, 0.08], yfmt: v => w2Num(v, 2), xlabel: "χ²" });
      w2Area(ctx, tx, ty, pdf, 0, iv[2], css("--setB"), 0.55);
      w2Area(ctx, tx, ty, pdf, iv[3], xmax, css("--setB"), 0.55);
      w2Area(ctx, tx, ty, pdf, iv[2], iv[3], css("--accent"), 0.1);
      curve(ctx, tx, ty, pdf, 0, xmax, css("--accent"), 2.2);
      [iv[2], iv[3]].forEach(v => vline(ctx, tx(v), box.y0 + 4, box.y1, css("--setB"), true));
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, w2F(iv[2], 3), tx(iv[2]), box.y0 + 2, box.x0, box.x1);
      w2TextIn(ctx, w2F(iv[3], 3), tx(iv[3]), box.y0 + 2, box.x0, box.x1);
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11);
      const at = pct((1 - level) / 2, 1);
      w2TextIn(ctx, at, tx(iv[2] / 2), ty(0) - 4, box.x0, box.x1);
      w2TextIn(ctx, at, tx(iv[3] + 3.5), ty(0) - 4, box.x0, box.x1);
      w2TextIn(ctx, w2LvTxt(level), tx((iv[2] + iv[3]) / 2), ty(0.02), box.x0, box.x1);
    };
    cvS.draw = () => {
      const ctx = cvS.ctx, w = cvS.w, H = cvS.h, iv = CI.varChi(s2, n, level), lo = Math.sqrt(iv[0]), hi = Math.sqrt(iv[1]);
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 12, y0: 4, x1: w - 12, y1: H - 34 };
      const { tx } = axes(ctx, box, { xmin: 0, xmax: 30, ymin: 0, ymax: 1, xticks: rangeTicks(0, 30, w < 500 ? 6 : 10), xlabel: "σ (g)" });
      const y = 38;
      w2Bar(ctx, tx(lo), tx(hi), y, 14, css("--accent"), { alpha: 0.8 });
      vline(ctx, tx(s), y - 14, y + 14, css("--text"));
      w2Dot(ctx, tx(s), y, 4, css("--text"));
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, w2F(lo, 2), tx(lo) - 14, y - 9, box.x0, box.x1);
      w2TextIn(ctx, w2F(hi, 2), tx(hi) + 14, y - 9, box.x0, box.x1);
      w2TextIn(ctx, "s = " + w2F(s, 2), tx(s), y - 16, box.x0, box.x1);
      // távolságok
      ctx.fillStyle = css("--muted"); w2Font(ctx, 10); ctx.textBaseline = "top";
      w2TextIn(ctx, "−" + fmt(w2R2(s) - w2R2(lo), 2), (tx(lo) + tx(s)) / 2, y + 10, box.x0, box.x1);
      w2TextIn(ctx, "+" + fmt(w2R2(hi) - w2R2(s), 2), (tx(s) + tx(hi)) / 2, y + 10, box.x0, box.x1);
    };

    /* (b) lefedettség-szimuláció; minden sokaság szórása σ = 1 */
    root.append(w2Sec("(b) Lefedettség – és ha a sokaság nem normális?"));
    const POPS6 = {
      norm: { draw: r => S.rnorm(r) },
      exp: { draw: r => S.rexp(r, 1) },
      unif: { draw: r => Math.sqrt(12) * r() }
    };
    let pop = "norm", nn = 15, s2s = [], rnd, seed = 615;
    const popSeg = segmented([["norm", "normális"], ["exp", "ferde (exponenciális)"], ["unif", "egyenletes"]], pop, v => { pop = v; reset(); });
    const nSeg = segmented([10, 15, 30, 100].map(v => [v, String(v)]), nn, v => { nn = +v; reset(); });
    root.append(w2Ctl(w2Lab("sokaság:"), popSeg.el), w2Ctl(w2Lab("mintanagyság $n$:"), nSeg.el),
      w2Ctl(btn("100 minta", () => run(100), "btn primary"), btn("+1 000 minta", () => run(1000)), btn("Újra", () => { seed++; reset(); })));
    root.append(h("p", { class: "w-sub", style: "margin:.2rem 0" }, "Mindhárom sokaság szórása σ = 1; mindegyik minta kap egy khi-négyzet-intervallumot σ-ra."));
    const cvC = tallCanvas(root, w => w2Clamp(w * 0.5, 240, 320));
    root.append(keyRow([["lefedi σ-t", "--setA", "line"], ["nem fedi le", "--bad", "line"], ["valódi σ = 1", "--text", "line"]]));
    const bEl = h("div", { class: "stat-row" }); root.append(bEl);
    const setB = w2Stats(bEl, ["minták száma", "lefedi σ-t", "lefedési arány", "névleges szint"]);
    root.append(w2Note(w2R`A khi-négyzet-intervallum csak normális sokaságnál tartja a 95%-ot – nagy $n$ sem segít rajta. Ferde (csúcsos) sokaságnál túl ritkán, lapos sokaságnál túl gyakran fed le.`));

    function run(m) {
      const f = POPS6[pop].draw;
      for (let j = 0; j < m; j++) {
        let a = 0, b = 0;
        for (let i = 0; i < nn; i++) { const x = f(rnd); a += x; b += x * x; }
        s2s.push((b - a * a / nn) / (nn - 1));
      }
      drawSim();
    }
    function reset() { rnd = S.mulberry32(seed); s2s = []; run(100); }
    function drawSim() {
      const ctx = cvC.ctx, w = cvC.w, H = cvC.h, a = 1 - level;
      const qlo = S.chi2.inv(a / 2, nn - 1), qhi = S.chi2.inv(1 - a / 2, nn - 1);
      const iv = v => [Math.sqrt((nn - 1) * v / qhi), Math.sqrt((nn - 1) * v / qlo)];
      ctx.clearRect(0, 0, w, H);
      const xmax = nn <= 10 ? 3.5 : nn <= 15 ? 3 : nn <= 30 ? 2.5 : 2;
      const box = { x0: 12, y0: 16, x1: w - 12, y1: H - 34 };
      const { tx } = axes(ctx, box, { xmin: 0, xmax, ymin: 0, ymax: 1, xticks: rangeTicks(0, xmax, w < 500 ? 5 : 7), xfmt: v => w2Num(v, 1), xlabel: "σ" });
      const show = s2s.slice(-100), rowH = (box.y1 - box.y0 - 4) / 100;
      const cA = css("--setA"), cB = css("--bad");
      show.forEach((v, i) => {
        const [lo, hi] = iv(v), hit = lo <= 1 && 1 <= hi, y = box.y0 + 2 + (i + 0.5) * rowH;
        w2Bar(ctx, tx(lo), tx(hi), y, hit ? 1.4 : 2, hit ? cA : cB, { lo: box.x0, hi: box.x1, caps: false });
      });
      vline(ctx, tx(1), box.y0 - 4, box.y1, css("--text"));
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, "σ = 1", tx(1), box.y0 - 3, 2, w - 2);
      w2Font(ctx, 10); w2Tag(ctx, `utolsó ${show.length} minta`, box.x1 - 2, box.y0 + 8, css("--muted"), "right");
      let hits = 0;
      for (const v of s2s) { const [lo, hi] = iv(v); if (lo <= 1 && 1 <= hi) hits++; }
      const N = s2s.length;
      setB([groupDigits(N), `${groupDigits(hits)} / ${groupDigits(N)}`, N ? pct(hits / N, 1) : "–", w2LvTxt(level)]);
    }
    cvC.draw = drawSim;
    updA(); reset();
  };

  /* ------------------------------------------------------------------
     6.6  Mintanagyság-tervező
     ------------------------------------------------------------------ */
  W["n-planner"] = root => {
    header(root, "Mintanagyság-tervező",
      w2R`Mekkora minta kell, hogy a hibahatár legfeljebb $\Delta$ legyen? A képletből $n$-et kifejezve, és <b>mindig felfelé kerekítve</b>.`);
    let mode = "mean", sigma = 10, dMean = 2.5, p = 0.5, dPp = 3, level = 0.95, N = Infinity;
    const mSeg = segmented([["mean", "átlag"], ["prop", "arány"]], mode, v => { mode = v; show(); upd(); });
    const sBox = numBox(sigma, { min: 0.0001, max: 1e6, step: "any" }, v => { sigma = v; upd(); });
    const dmBox = numBox(dMean, { min: 0.0001, max: 1e6, step: "any" }, v => { dMean = v; upd(); });
    const pBox = numBox(p, { min: 0, max: 1, step: 0.01 }, v => { p = v; upd(); });
    const dpBox = numBox(dPp, { min: 0.01, max: 50, step: "any" }, v => { dPp = v; upd(); });
    const NBox = h("input", { type: "number", min: 1, step: 1, placeholder: "∞", style: "width:7rem" });
    NBox.addEventListener("input", () => { const v = parseFloat(NBox.value); N = NBox.value.trim() === "" ? Infinity : v >= 1 ? v : N; upd(); });
    const lvSeg = w2LvSeg([0.9, 0.95, 0.99], level, v => { level = v; upd(); });
    const meanRow = w2Ctl(labelWrap("szórás $\\sigma$ =", sBox), labelWrap("hibahatár $\\Delta$ =", dmBox));
    const propRow = w2Ctl(labelWrap("becsült $p$ =", pBox), btn("nem tudom → 0,5", () => { pBox.value = 0.5; p = 0.5; upd(); }),
      labelWrap("hibahatár $\\Delta$ =", dpBox, " százalékpont"));
    root.append(w2Ctl(w2Lab("mit becsülsz?"), mSeg.el), meanRow, propRow,
      w2Ctl(w2Lab("megbízhatósági szint:"), lvSeg.el), w2Ctl(labelWrap("sokaság mérete $N$ =", NBox, " (üres = végtelen)")));
    const form = h("div", { class: "formula-out", style: "overflow-x:auto;font-size:1.05rem" }); root.append(form);
    const big = h("div", { style: "text-align:center;font-size:2.1rem;font-weight:700;font-family:var(--mono);margin:.5rem 0 .2rem;color:var(--accent)" }); root.append(big);
    const cv = tallCanvas(root, w => w2Clamp(w * 0.42, 210, 280));
    root.append(keyRow([["szükséges $n$", "--accent", "line"], ["végtelen sokaságnál ($n_0$)", "--muted", "dash"], ["a te beállításod", "--setB", "box"], ["fele akkora hibahatár", "--setC", "box"]]));
    root.append(w2Note(w2R`A képletben $z$ három tizedesre kerekítve látszik ($1{,}645$; $1{,}960$; $2{,}576$), de a számolás a pontos kvantilissel megy – ezért eshet a kerekített képlettel számolt értéktől egy hajszállal el. Mindkét tengely logaritmikus: a fele hibához négyszeres minta kell.`));
    function show() { meanRow.style.display = mode === "mean" ? "" : "none"; propRow.style.display = mode === "prop" ? "" : "none"; }
    const zr = () => w2Z(level);
    const ceilN = x => Math.ceil(+x.toFixed(6));
    /* n0 a Δ függvényében (Δ: átlagnál g, aránynál százalékpont) */
    const n0Of = d => { const z = zr(); return mode === "mean" ? (z * sigma / d) ** 2 : z * z * p * (1 - p) / (d / 100) ** 2; };
    const fin = n0 => (isFinite(N) ? n0 / (1 + n0 / N) : n0);
    function upd() {
      const z = zr(), zs = w2K(fmt(z, 3)), d = mode === "mean" ? dMean : dPp, n0 = n0Of(d);
      if (mode === "prop" && !(p > 0 && p < 1)) {
        w2Math(form, "$p = 0$ vagy $p = 1$ mellett nincs mit becsülni – adj meg 0 és 1 közötti $p$-t (ha nem tudod: 0,5)."); big.textContent = "–"; cv.draw(); return;
      }
      let tex = mode === "mean"
        ? `n_0 &= \\left(\\dfrac{z\\,\\sigma}{\\Delta}\\right)^2 \\\\[2pt] &= \\left(\\dfrac{${zs}\\cdot ${w2K(w2Num(sigma, 4))}}{${w2K(w2Num(d, 4))}}\\right)^2 = ${w2K(fmt(n0, 2))}`
        : `n_0 &= \\dfrac{z^2\\,p(1-p)}{\\Delta^2} \\\\[2pt] &= \\dfrac{${zs}^2\\cdot ${w2K(w2Num(p, 4))}\\cdot ${w2K(w2Num(1 - p, 4))}}{${w2K(w2Num(d / 100, 5))}^2} = ${w2K(fmt(n0, 2))}`;
      let nn = n0;
      if (isFinite(N)) { nn = fin(n0); tex += `\\\\[8pt] n &= \\dfrac{n_0}{1 + n_0/N} \\\\[2pt] &= \\dfrac{${w2K(fmt(n0, 2))}}{1 + ${w2K(fmt(n0, 2))}/${w2K(w2Num(N, 0))}} = ${w2K(fmt(nn, 2))}`; }
      w2Math(form, `$$\\begin{aligned}${tex}\\end{aligned}$$`);
      big.textContent = "n = " + groupDigits(ceilN(nn));
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h;
      ctx.clearRect(0, 0, w, H);
      const d = mode === "mean" ? dMean : dPp;
      if (mode === "prop" && !(p > 0 && p < 1)) return;
      const lg = Math.log10, dlo = d / 4, dhi = d * 4;
      const nAt = x => Math.max(1e-9, fin(n0Of(x)));
      const ys = [n0Of(dlo), n0Of(dhi), nAt(dlo), nAt(dhi)];
      let ylo = Math.floor(lg(Math.max(0.5, Math.min(...ys)))), yhi = Math.ceil(lg(Math.max(...ys)) + 0.05);
      if (yhi - ylo < 2) yhi = ylo + 2;
      const box = { x0: w < 500 ? 50 : 58, y0: 14, x1: w - 12, y1: H - 34 };
      const nice = (a, b) => { const out = []; for (let e = Math.floor(lg(a)) - 1; e <= Math.ceil(lg(b)); e++) [1, 2, 5].forEach(m => { const v = m * 10 ** e; if (v >= a * 0.999 && v <= b * 1.001) out.push(v); }); return out; };
      const xt = nice(dlo, dhi), yt = [];
      for (let e = ylo; e <= yhi; e++) yt.push(e);
      const { tx, ty } = w2Axes(ctx, box, { xmin: lg(dlo), xmax: lg(dhi), ymin: ylo, ymax: yhi, xticks: xt.map(lg), xfmt: v => w2Num(10 ** v, 3),
        yticks: yt, yfmt: e => groupDigits(Math.round(10 ** e)), xlabel: mode === "mean" ? "Δ" : "Δ (százalékpont)", ylabel: "n" });
      const fL = (f, c, wd, dash) => curve(ctx, tx, ty, u => lg(f(10 ** u)), lg(dlo), lg(dhi), css(c), wd, dash);
      if (isFinite(N)) {
        fL(x => n0Of(x), "--muted", 1.6, [6, 5]);
        ctx.save(); ctx.strokeStyle = css("--muted"); ctx.globalAlpha = 0.6; ctx.setLineDash([2, 4]); ctx.beginPath();
        const yN = ty(lg(N)); if (yN > box.y0) { ctx.moveTo(box.x0, yN); ctx.lineTo(box.x1, yN); ctx.stroke(); }
        ctx.restore();
        ctx.fillStyle = css("--muted"); w2Font(ctx, 10);
        if (ty(lg(N)) > box.y0 + 8) { ctx.textBaseline = "bottom"; ctx.textAlign = "right"; ctx.fillText("N = " + groupDigits(N), box.x1 - 2, ty(lg(N)) - 2); }
      }
      fL(nAt, "--accent", 2.4);
      const pt = (x, c, lab, below) => {
        const v = nAt(x), X = tx(lg(x)), Y = ty(lg(v));
        w2Dot(ctx, X, Y, 5.5, css(c));
        w2Font(ctx, 11, true);
        w2Tag(ctx, lab, X + (X > (box.x0 + box.x1) / 2 ? -9 : 9), w2Clamp(Y + (below ? 14 : -14), box.y0 + 7, box.y1 - 7), css("--text"), X > (box.x0 + box.x1) / 2 ? "right" : "left");
      };
      pt(d / 2, "--setC", `Δ = ${w2Num(d / 2, 3)} → n = ${groupDigits(ceilN(nAt(d / 2)))}`, false);
      pt(d, "--setB", `Δ = ${w2Num(d, 3)} → n = ${groupDigits(ceilN(nAt(d)))}`, true);
    };
    show(); upd();
  };

  /* ------------------------------------------------------------------
     6.7  Bootstrap-konfidenciaintervallum
     ------------------------------------------------------------------ */
  W["boot-ci"] = root => {
    header(root, "Bootstrap-konfidenciaintervallum",
      "Húzz a mintából visszatevéssel ugyanannyi elemet, és számold ki a statisztikát. Sok ismétlés után a középső 95% a percentilis-intervallum.");
    const DATA = { konz: { a: KONZERV, unit: "g", name: "konzervek" }, ing: { a: INGAZAS, unit: "perc", name: "ingázás" } };
    const STATS = { mean: { name: "átlag", sym: w2R`\bar x` }, median: { name: "medián", sym: w2R`\mathrm{Me}` }, sd: { name: "szórás", sym: "s" } };
    const SEED0 = 67;
    let dk = "konz", st = "mean", seed = SEED0, rnd, B = { mean: [], median: [], sd: [] };
    const dSeg = segmented([["konz", `konzervek (${KONZERV.length})`], ["ing", `ingázás (${INGAZAS.length})`]], dk, v => { dk = v; regen(B.mean.length); });
    const sSeg = segmented([["mean", "átlag"], ["median", "medián"], ["sd", "szórás"]], st, v => { st = v; draw(); });
    const rSeg = segmented([[1000, "R = 1 000"], [10000, "R = 10 000"]], 1000, v => regen(+v));
    root.append(w2Ctl(w2Lab("adat:"), dSeg.el), w2Ctl(w2Lab("statisztika:"), sSeg.el),
      w2Ctl(rSeg.el, btn("+1 000", () => add(1000), "btn primary"), btn("Újra", () => { seed++; regen(B.mean.length); })));
    const dataTxt = h("div", { class: "w-sub", style: "margin:.2rem 0 0;font-size:.88rem" }); root.append(dataTxt);
    const cv = tallCanvas(root, w => w2Clamp(w * 0.42, 230, 300));
    const key = h("div"); root.append(key);
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const note = w2Note(""); root.append(note);

    const data = () => DATA[dk].a;
    function add(m) {
      const a = data(), n = a.length, x = new Float64Array(n);
      for (let r = 0; r < m; r++) {
        let sm = 0;
        for (let i = 0; i < n; i++) { x[i] = a[Math.floor(rnd() * n)]; sm += x[i]; }
        const mu = sm / n; let ss = 0;
        for (let i = 0; i < n; i++) ss += (x[i] - mu) ** 2;
        x.sort();
        B.mean.push(mu); B.sd.push(Math.sqrt(ss / (n - 1)));
        B.median.push(n % 2 ? x[(n - 1) / 2] : (x[n / 2 - 1] + x[n / 2]) / 2);
      }
      rSeg.set(B.mean.length === 1000 ? 1000 : B.mean.length === 10000 ? 10000 : -1);
      draw();
    }
    function regen(R) {
      rnd = S.mulberry32(seed); B = { mean: [], median: [], sd: [] };
      const a = data();
      dataTxt.innerHTML = `Eredeti minta ($n = ${a.length}$, ${DATA[dk].unit}): ${a.join("; ")}`;
      window.Synopsis && Synopsis.renderMath(dataTxt);
      add(R);
    }
    function draw() {
      const a = data(), n = a.length, unit = DATA[dk].unit, vals = B[st], R = vals.length;
      const orig = st === "mean" ? S.mean(a) : st === "median" ? S.median(a) : S.sd(a);
      const sv = Float64Array.from(vals).sort(), lo = quant(sv, 0.025), hi = quant(sv, 0.975), se = S.sd(vals);
      let cmp = null;
      if (st === "mean") { const t = CI.meanT(orig, S.sd(a), n, 0.95); cmp = { iv: t, name: "t-intervallum", tex: "$t$-KI" }; }
      if (st === "sd") { const c = CI.varChi(S.sd(a) ** 2, n, 0.95); cmp = { iv: [Math.sqrt(c[0]), Math.sqrt(c[1])], name: "khi-négyzet-intervallum", tex: "$\\chi^2$-KI" }; }
      const sym = STATS[st].sym, f2 = v => w2F(v, 2);
      const items = [[`eredeti ${STATS[st].name} $${sym}$`, f2(orig)], ["ismétlések $R$", groupDigits(R)], ["bootstrap SE", f2(se)],
        ["95%-os percentilis-KI", `[${f2(lo)}; ${f2(hi)}]`], [`$${sym}$-tól lefelé / felfelé`, `−${fmt(w2R2(orig) - w2R2(lo), 2)} / +${fmt(w2R2(hi) - w2R2(orig), 2)}`]];
      if (cmp) items.splice(4, 0, [`95%-os ${cmp.tex}`, `[${f2(cmp.iv[0])}; ${f2(cmp.iv[1])}]`]);
      statRow(sEl, items);
      const k = [["bootstrap-statisztikák", "--setA", "box"], [`eredeti $${sym}$`, "--text", "line"], ["percentilis-KI (2,5% és 97,5%)", "--setB", "box"]];
      if (cmp) k.push([cmp.name, "--setC", "box"]);
      key.replaceChildren(keyRow(k)); window.Synopsis && Synopsis.renderMath(key);
      const dLo = fmt(w2R2(orig) - w2R2(lo), 2), dHi = fmt(w2R2(hi) - w2R2(orig), 2), asym = (hi - orig) / Math.max(1e-9, orig - lo);
      let txt = st === "mean" ? w2R`Átlagnál a percentilis-KI hasonlít a $t$-intervallumra, de nem igényel képletet.`
        : st === "median" ? "A mediánra nincs egyszerű képlet – a bootstrap ilyenkor is működik. A hisztogram tüskés, mert a medián csak kevés értéket vehet fel."
        : w2R`Kis mintán a bootstrap-intervallum szűkebb a khi-négyzet-intervallumnál (az utóbbi pedig csak normális sokaságnál megbízható): 15 adat kevés a szórás ingadozásának hű leírásához.`;
      if (asym > 1.15 || asym < 1 / 1.15) txt += ` Az intervallum aszimmetrikus: ${asym > 1 ? "jobbra" : "balra"} hosszabb (${asym > 1 ? "+" + dHi + " vs. −" + dLo : "−" + dLo + " vs. +" + dHi}) – a statisztika bootstrap-eloszlása ferde, és ezt a percentilis-KI magától követi.`;
      note.innerHTML = txt; window.Synopsis && Synopsis.renderMath(note);
      plot(sv, orig, lo, hi, cmp, unit);
    }
    function plot(sv, orig, lo, hi, cmp, unit) {
      const ctx = cv.ctx, w = cv.w, H = cv.h;
      ctx.clearRect(0, 0, w, H);
      let xmin = Math.min(sv[0], orig, cmp ? cmp.iv[0] : Infinity), xmax = Math.max(sv[sv.length - 1], orig, cmp ? cmp.iv[1] : -Infinity);
      const pad = (xmax - xmin) * 0.05 || 1; xmin -= pad; xmax += pad;
      const bottom = cmp ? 52 : 30;
      // osztályozás: kevés különböző érték → oszlop értékenként
      const freq = new Map();
      for (const v of sv) { const kk = Math.round(v * 1e6) / 1e6; freq.set(kk, (freq.get(kk) || 0) + 1); }
      const distinct = [...freq.keys()].sort((a, b) => a - b);
      let bars;
      if (distinct.length <= 40) {
        let gap = Infinity; for (let i = 1; i < distinct.length; i++) gap = Math.min(gap, distinct[i] - distinct[i - 1]);
        const bw = Math.min(isFinite(gap) ? gap * 0.8 : (xmax - xmin) * 0.03, (xmax - xmin) * 0.03);
        bars = distinct.map(v => [v - bw / 2, v + bw / 2, freq.get(v)]);
      } else {
        const hs = histo(sv, xmin, xmax, w < 500 ? 30 : 44);
        bars = hs.counts.map((c, i) => [xmin + i * hs.w, xmin + (i + 1) * hs.w, c]);
      }
      const ym = Math.max(...bars.map(b => b[2])) * 1.12;
      const ya = H - 34, box = { x0: 44, y0: 16, x1: w - 10, y1: ya - bottom };
      const yt = rangeTicks(0, ym, 4).filter(v => v < ym && Number.isInteger(v));
      const { tx, ty } = w2Axes(ctx, box, { xmin, xmax, ymin: 0, ymax: ym, xticks: [], yticks: yt, yfmt: v => groupDigits(v), ylabel: "db" });
      // percentilis-sáv
      ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = css("--setB"); ctx.fillRect(tx(lo), box.y0, tx(hi) - tx(lo), box.y1 - box.y0); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.65; ctx.fillStyle = css("--setA");
      bars.forEach(([a, b, c]) => { if (c) ctx.fillRect(tx(a) + 0.5, ty(c), Math.max(1.5, tx(b) - tx(a) - 1), ty(0) - ty(c)); });
      ctx.restore();
      [lo, hi].forEach(v => vline(ctx, tx(v), box.y0, box.y1, css("--setB"), true));
      vline(ctx, tx(orig), box.y0, ya, css("--text"));
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, w2F(orig, 2), tx(orig), box.y0 - 2, box.x0, box.x1);
      // alsó sávok
      const yP = box.y1 + 14;
      w2Bar(ctx, tx(lo), tx(hi), yP, 9, css("--setB"), { alpha: 0.85 });
      if (cmp) w2Bar(ctx, tx(cmp.iv[0]), tx(cmp.iv[1]), yP + 20, 9, css("--setC"), { alpha: 0.85 });
      w2Font(ctx, 10, true); ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText("perc.", box.x0 - 5, yP); if (cmp) ctx.fillText(st === "mean" ? "t" : "χ²", box.x0 - 5, yP + 20);
      // x-tengely legalul
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(box.x0, ya); ctx.lineTo(box.x1, ya); ctx.stroke();
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "center"; ctx.textBaseline = "top";
      rangeTicks(xmin, xmax, w < 500 ? 5 : 9).forEach(v => { ctx.fillText(w2Num(v, 2), tx(v), ya + 5); ctx.beginPath(); ctx.moveTo(tx(v), ya); ctx.lineTo(tx(v), ya + 3); ctx.stroke(); });
      ctx.textAlign = "right"; ctx.fillText(STATS[st].name + " (" + unit + ")", box.x1, ya + 20);
    }
    cv.draw = draw;
    regen(1000);
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); window.Synopsis && Synopsis.renderMath(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
