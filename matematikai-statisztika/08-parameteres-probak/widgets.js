/* =========================================================
   Matematikai statisztika 8. fejezet – interaktív szemléltetések
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
     w1: qq-plot (8.3-c), paired-vs-indep (8.4-b), t-test-lab (8.5-a), test-wizard (8.9-c)
     ================================================================== */
  const w1Box = (cv, l = 46, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Minus = s => String(s).replace(/^-/, "−");
  const w1F = (x, d = 2) => w1Minus(fmt(x, d));
  const w1P = p => (!isFinite(p) ? "–" : p >= 0.0001 ? fmt(p, p >= 0.1 ? 2 : p >= 0.01 ? 3 : 4) : "< 0,0001");
  const w1Dot = (ctx, x, y, r, color, alpha = 1) => { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); };
  const w1Var = a => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
  /* két minta t-próbája: pooled = true → közös szórás, különben Welch */
  function w1TTest(a, b, pooled) {
    const n1 = a.length, n2 = b.length, m1 = mean(a), m2 = mean(b), v1 = w1Var(a), v2 = w1Var(b);
    let se, df;
    if (pooled) { const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2); se = Math.sqrt(sp2 * (1 / n1 + 1 / n2)); df = n1 + n2 - 2; }
    else { const q1 = v1 / n1, q2 = v2 / n2; se = Math.sqrt(q1 + q2); df = (q1 + q2) ** 2 / (q1 * q1 / (n1 - 1) + q2 * q2 / (n2 - 1)); }
    const t = (m1 - m2) / se, p = 2 * (1 - S.t.cdf(Math.abs(t), df)), tc = S.t.inv(0.975, df);
    return { n1, n2, m1, m2, v1, v2, se, df, t, p, lo: m1 - m2 - tc * se, hi: m1 - m2 + tc * se, tc };
  }
  /* egymintás t-próba (μ0 = 0) a különbségekre */
  function w1TOne(d) {
    const n = d.length, m = mean(d), s = Math.sqrt(w1Var(d)), se = s / Math.sqrt(n), t = m / se, df = n - 1;
    return { n, m, s, se, t, df, p: 2 * (1 - S.t.cdf(Math.abs(t), df)) };
  }
  /* adatsor pontosan adott átlaggal és (korrigált) szórással */
  function w1Exact(a, m, s) { const m0 = mean(a), s0 = Math.sqrt(w1Var(a)); return a.map(x => m + (x - m0) / s0 * s); }
  const w1Parse = str => str.split(/[\s;]+/).map(t => t.replace(",", ".")).filter(t => t !== "").map(Number).filter(isFinite);
  const w1Num = x => { const r = Math.round(x * 100) / 100; return String(r).replace(".", ","); };

  /* ------------------------------------------------------------------
     qq-plot – QQ-ábra: normális-e az adat?
     ------------------------------------------------------------------ */
  W["qq-plot"] = root => {
    header(root, "QQ-ábra – normális-e az adat?",
      "Válassz egy eloszlást és mintanagyságot! A pontok: a rendezett adatok a standard normális kvantilisek függvényében. Ha az adat normális, a pontok közel vannak a szaggatott egyeneshez ($\\bar x + s\\cdot z$). Nyomd meg többször az „Új minta” gombot: kis mintánál a normális adat QQ-ábrája is meglepően görbe lehet.");
    const ZSAK = [492, 497, 493, 499, 494];
    const DISTS = {
      zsak: { name: "öt zacskó (8.3-a)", fixed: true, gen: () => ZSAK.slice(), shape: "A 8.3-a öt zacskója. Öt pontból szinte semmi sem dönthető el." },
      norm: { name: "normális", gen: (n, r) => Array.from({ length: n }, () => 500 + 10 * S.rnorm(r)), shape: "Normális sokaság: a pontok az egyenes körül szóródnak, rendszeres görbület nélkül." },
      exp: { name: "jobbra ferde", gen: (n, r) => Array.from({ length: n }, () => S.rexp(r, 10)), shape: "Jobbra ferde (exponenciális): a pontok felfelé görbülő ívet alkotnak – a jobb vég az egyenes fölé szökik, a bal vég „lapos”." },
      t3: { name: "vastag farkú", gen: (n, r) => Array.from({ length: n }, () => { const z = S.rnorm(r); let c = 0; for (let k = 0; k < 3; k++) c += S.rnorm(r) ** 2; return 500 + 5 * z / Math.sqrt(c / 3); }), shape: "Vastag farkú ($t_3$): a két vég kifelé hajlik – bal alul az egyenes alá, jobb felül fölé. Több szélsőérték, mint normálisnál." },
      unif: { name: "egyenletes", gen: (n, r) => Array.from({ length: n }, () => 480 + 40 * r()), shape: "Egyenletes: a két vég befelé hajlik (S alak) – rövidebbek a farkak, mint normálisnál." },
      out: { name: "egy kiugró értékkel", gen: (n, r) => { const a = Array.from({ length: n }, () => 500 + 10 * S.rnorm(r)); a[0] = 500 + 10 * (4.5 + r()); return a; }, shape: "Normális adat egyetlen kiugró értékkel: egy pont messze az egyenestől. Nézd meg, mi okozza – mérési hiba vagy valódi érték?" }
    };
    let dist = "zsak", n = 5, seed = 2024, data = ZSAK.slice();
    const rnd = () => S.mulberry32(seed);
    const segD = segmented(Object.entries(DISTS).map(([k, v]) => [k, v.name]), dist, v => { dist = v; if (v === "zsak") segN.set(5, false); regen(); });
    const segN = segmented([5, 10, 30, 100].map(v => [v, "n = " + v]), n, v => { n = +v; if (dist === "zsak") { dist = "norm"; segD.set("norm", false); } regen(); });
    root.append(h("div", { class: "controls" }, segD.el), h("div", { class: "controls" }, segN.el, btn("🎲 Új minta", () => { seed++; regen(); })));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(240, Math.min(420, w * 0.62)));
    root.append(keyRow([["rendezett adat", "--setA", "box"], ["$\\bar x + s\\cdot z$ (normális referencia)", "--muted", "dash"]]));
    const statEl = h("div", { class: "stat-row" }), msg = h("p", { class: "w-sub", style: "margin:.4rem 0 0" });
    root.append(statEl, msg);
    function regen() {
      data = dist === "zsak" ? ZSAK.slice() : DISTS[dist].gen(n, rnd());
      draw(); cv.draw = draw;
    }
    function draw() {
      const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
      const s = sorted(data), N = s.length, z = s.map((_, i) => S.normal.inv((i + 0.5) / N));
      const m = mean(s), sd = Math.sqrt(w1Var(s));
      const zmax = Math.max(2.6, Math.abs(z[0]) + 0.2);
      let ylo = Math.min(s[0], m - sd * zmax), yhi = Math.max(s[N - 1], m + sd * zmax);
      const pad = (yhi - ylo) * 0.05; ylo -= pad; yhi += pad;
      const box = w1Box(cv, 52, 14, 20, 36);
      const { tx, ty } = axes(ctx, box, { xmin: -zmax, xmax: zmax, ymin: ylo, ymax: yhi, xticks: rangeTicks(-zmax, zmax, 6), yticks: rangeTicks(ylo, yhi, 5), xfmt: v => w1Minus(String(v).replace(".", ",")), xlabel: "standard normális kvantilis z", ylabel: "rendezett adat" });
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tx(-zmax), ty(m - sd * zmax)); ctx.lineTo(tx(zmax), ty(m + sd * zmax)); ctx.stroke(); ctx.restore();
      const r = N <= 10 ? 5 : N <= 30 ? 4 : 3;
      s.forEach((y, i) => w1Dot(ctx, tx(z[i]), ty(y), r, css("--setA"), 0.85));
      const rr = pearson(z, s);
      statRow(statEl, [["$n$", String(N)], ["$\\bar x$", w1F(m, 1)], ["$s$", w1F(sd, 2)], ["a QQ-pontok korrelációja", w1F(rr, 3)]]);
      msg.innerHTML = DISTS[dist].shape + (N <= 10 && dist !== "zsak" ? " <b>Kis minta:</b> ennyi pontból az alakot alig lehet megítélni." : "");
      window.Synopsis && Synopsis.renderMath(msg);
    }
    cv.draw = draw; draw();
  };

  /* ------------------------------------------------------------------
     paired-vs-indep – ugyanaz az adat párosan és függetlenként
     ------------------------------------------------------------------ */
  W["paired-vs-indep"] = root => {
    header(root, "Páros vagy független? – ugyanaz az adat kétféleképpen",
      "A 8.4-a hat dolgozója. A bal oldalon minden dolgozó két mérését vonal köti össze; a jobb oldalon csak a különbségek. Húzd az első csúszkát: nő vagy csökken a dolgozók <em>egymás közti</em> különbsége, a javulások változatlanok. A páros próba ezt észre sem veszi – a független próbát elnyomja.");
    const NAMES = ["Anna", "Bence", "Csilla", "Dani", "Emese", "Feri"];
    const B0 = [52, 61, 70, 45, 80, 66], D0 = [3, 5, -1, 4, 2, 5];
    let k = 1, shift = 0;
    const mB = mean(B0);
    const sK = sliderRow("Személyek közti szóródás:", 0, 2, 0.05, k, v => "×" + fmt(v, 2), v => { k = v; draw(); });
    const sS = sliderRow("Átlagos javulás:", -2, 6, 0.5, 3, v => w1F(v, 1) + " pont", v => { shift = v - 3; draw(); });
    root.append(h("div", { class: "controls" }, sK.wrap), h("div", { class: "controls" }, sS.wrap, btn("Alaphelyzet", () => { k = 1; shift = 0; sK.input.value = 1; sK.out.textContent = "×1,00"; sS.input.value = 3; sS.out.textContent = "3,0 pont"; draw(); })));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(250, Math.min(360, w * 0.5)));
    root.append(keyRow([["előtte", "--setA", "box"], ["utána", "--setB", "box"], ["különbség (utána − előtte)", "--accent", "box"]]));
    const statEl = h("div", { class: "stat-row" }), msg = h("div", { class: "readout" });
    root.append(statEl, msg);
    function draw() {
      const before = B0.map(b => mB + k * (b - mB)), diffs = D0.map(d => d + shift), after = before.map((b, i) => b + diffs[i]);
      const pr = w1TOne(diffs), ind = w1TTest(after, before, true), r = pearson(before, after);
      const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
      const split = Math.round(cv.w * 0.6);
      const all = before.concat(after), lo = Math.min(20, ...all) - 2, hi = Math.max(105, ...all) + 2;
      const boxL = { x0: 44, y0: 20, x1: split - 18, y1: cv.h - 34 };
      const L = axes(ctx, boxL, { xmin: 0, xmax: 3, ymin: lo, ymax: hi, xticks: [], yticks: rangeTicks(lo, hi, 5), ylabel: "pontszám" });
      ctx.fillStyle = css("--muted"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("előtte", L.tx(1), boxL.y1 + 6); ctx.fillText("utána", L.tx(2), boxL.y1 + 6);
      before.forEach((b, i) => {
        ctx.strokeStyle = css("--border"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L.tx(1), L.ty(b)); ctx.lineTo(L.tx(2), L.ty(after[i])); ctx.stroke();
        w1Dot(ctx, L.tx(1), L.ty(b), 5, css("--setA")); w1Dot(ctx, L.tx(2), L.ty(after[i]), 5, css("--setB"));
        if (cv.w > 420) { ctx.fillStyle = css("--muted"); ctx.font = "10px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(NAMES[i], L.tx(1) - 9, L.ty(b)); }
      });
      const dlo = Math.min(-6, ...diffs) - 1, dhi = Math.max(10, ...diffs) + 1;
      const boxR = { x0: split + 30, y0: 20, x1: cv.w - 12, y1: cv.h - 34 };
      const R = axes(ctx, boxR, { xmin: 0, xmax: 2, ymin: dlo, ymax: dhi, xticks: [], yticks: rangeTicks(dlo, dhi, 5), ylabel: "különbség" });
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(boxR.x0, R.ty(0)); ctx.lineTo(boxR.x1, R.ty(0)); ctx.stroke(); ctx.restore();
      diffs.forEach((d, i) => w1Dot(ctx, R.tx(0.7 + 0.12 * i), R.ty(d), 5, css("--accent"), 0.85));
      ctx.fillStyle = css("--text"); ctx.fillRect(R.tx(0.55), R.ty(pr.m) - 1, R.tx(1.45) - R.tx(0.55), 2.5);
      ctx.fillStyle = css("--muted"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("utána − előtte", R.tx(1), boxR.y1 + 6);
      statRow(statEl, [["páros: $t$ ($df = 5$)", w1F(pr.t, 2)], ["páros: p", w1P(pr.p)], ["független: $t$ ($df = 10$)", w1F(ind.t, 2)], ["független: p", w1P(ind.p)],
        ["$s_d$ / független SE", w1F(pr.s, 2) + " / " + w1F(ind.se, 2)], ["korreláció $r$", w1F(r, 3)]]);
      const sigP = pr.p <= 0.05, sigI = ind.p <= 0.05;
      msg.innerHTML = `Páros elemzés: <b>${sigP ? "szignifikáns" : "nem szignifikáns"}</b> (p = ${w1P(pr.p)}). Független elemzés: <b>${sigI ? "szignifikáns" : "nem szignifikáns"}</b> (p = ${w1P(ind.p)}).` +
        (k > 0.3 && sigP && !sigI ? " A személyek közti különbség „elnyeli” a javulást – csak a páros próba látja." : k <= 0.3 ? " Ha a dolgozók szinte egyformák, a párosítás már alig nyer valamit." : "");
    }
    cv.draw = draw; draw();
  };

  /* ------------------------------------------------------------------
     t-test-lab – kétmintás t- és Welch-próba saját adatokkal
     ------------------------------------------------------------------ */
  W["t-test-lab"] = root => {
    header(root, "t-próba labor – két független csoport",
      "Írd be (vagy válaszd ki) a két csoport adatait, szóközzel vagy pontosvesszővel elválasztva (tizedesvessző is jó). A gép kiszámolja a t-próbát közös szórással vagy Welch szerint, a p-értéket és a különbség 95%-os konfidencia-intervallumát. Alul a $t$-eloszlás a megfigyelt $t$-vel: a kiemelt farkak területe a p-érték.");
    const rndBase = S.mulberry32(85);
    const fifty = (() => { const r = S.mulberry32(5); return [w1Exact(Array.from({ length: 5 }, () => S.rnorm(r)), 56, 10), w1Exact(Array.from({ length: 20 }, () => S.rnorm(r)), 50, 3)]; })();
    const PRESETS = {
      s33: ["3 + 3 dolgozó (8.5-a)", [7, 9, 11], [3, 5, 4]],
      s88: ["8 + 8 dolgozó", [72, 75, 78, 80, 81, 83, 85, 90], [65, 68, 70, 72, 74, 76, 79, 82]],
      s520: ["5 vs 20, eltérő szórás (8.5-c)", fifty[0].map(x => Math.round(x * 10) / 10), fifty[1].map(x => Math.round(x * 10) / 10)]
    };
    let pooled = true;
    const ta = h("input", { type: "text", style: "width:100%;font:inherit" }), tb = h("input", { type: "text", style: "width:100%;font:inherit" });
    const setData = (a, b) => { ta.value = a.map(w1Num).join("; "); tb.value = b.map(w1Num).join("; "); draw(); };
    const segP = segmented(Object.entries(PRESETS).map(([k, v]) => [k, v[0]]), "s33", v => setData(PRESETS[v][1], PRESETS[v][2]));
    const segM = segmented([["pool", "közös szórás"], ["welch", "Welch"]], "pool", v => { pooled = v === "pool"; draw(); });
    const randBtn = btn("🎲 Véletlen csoportok (10 + 10, valódi különbség 1 szórásnyi)", () => {
      const a = Array.from({ length: 10 }, () => 60 + 10 * S.rnorm(rndBase)).map(x => Math.round(x)), b = Array.from({ length: 10 }, () => 50 + 10 * S.rnorm(rndBase)).map(x => Math.round(x));
      segP.set("", false); setData(a, b);
    });
    ta.addEventListener("input", () => { segP.set("", false); draw(); }); tb.addEventListener("input", () => { segP.set("", false); draw(); });
    root.append(h("div", { class: "controls" }, segP.el),
      h("label", { style: "display:block;margin:.4rem 0" }, h("span", { style: "color:var(--setA);font-weight:600" }, "1. csoport: "), ta),
      h("label", { style: "display:block;margin:.4rem 0" }, h("span", { style: "color:var(--setB);font-weight:600" }, "2. csoport: "), tb),
      h("div", { class: "controls" }, segM.el, randBtn));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(300, Math.min(400, w * 0.55)));
    const statEl = h("div", { class: "stat-row" }), msg = h("div", { class: "readout" });
    root.append(statEl, msg);
    function draw() {
      const a = w1Parse(ta.value), b = w1Parse(tb.value);
      const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
      if (a.length < 2 || b.length < 2) { statEl.replaceChildren(); msg.textContent = "Mindkét csoportba legalább 2 számot írj."; return; }
      const R = w1TTest(a, b, pooled);
      if (!isFinite(R.t)) { statEl.replaceChildren(); msg.textContent = "A két csoport szórása nem lehet egyszerre 0."; return; }
      /* felső panel: pöttyök */
      const topH = Math.round(cv.h * 0.42);
      const all = a.concat(b), lo0 = Math.min(...all), hi0 = Math.max(...all), pad = (hi0 - lo0 || 1) * 0.08;
      const boxT = { x0: 70, y0: 10, x1: cv.w - 14, y1: topH - 22 };
      const T = axes(ctx, boxT, { xmin: lo0 - pad, xmax: hi0 + pad, ymin: 0, ymax: 2, xticks: rangeTicks(lo0 - pad, hi0 + pad, 6), yticks: [], xfmt: v => w1Minus(String(v).replace(".", ",")) });
      [[a, "--setA", 1.45, "1. csoport"], [b, "--setB", 0.55, "2. csoport"]].forEach(([arr, col, yy, lab]) => {
        const cnt = {};
        arr.forEach(x => { const key = Math.round(x * 4); cnt[key] = (cnt[key] || 0) + 1; w1Dot(ctx, T.tx(x), T.ty(yy) - (cnt[key] - 1) * 7, 4.5, css(col), 0.8); });
        const m = mean(arr); ctx.fillStyle = css("--text"); ctx.fillRect(T.tx(m) - 1, T.ty(yy) - 14, 2.5, 22);
        ctx.fillStyle = css(col); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(lab, boxT.x0 - 6, T.ty(yy));
      });
      /* alsó panel: t-eloszlás */
      const boxB = { x0: 46, y0: topH + 12, x1: cv.w - 14, y1: cv.h - 32 };
      const tm = Math.max(4.5, Math.min(12, Math.abs(R.t) + 1));
      const ymax = S.t.pdf(0, R.df) * 1.15;
      const B = axes(ctx, boxB, { xmin: -tm, xmax: tm, ymin: 0, ymax, xticks: rangeTicks(-tm, tm, 8), yticks: [], xfmt: v => w1Minus(String(v).replace(".", ",")), xlabel: "t" });
      const at = Math.abs(R.t);
      ctx.save(); ctx.fillStyle = css("--bad"); ctx.globalAlpha = 0.45;
      [[-tm, -at], [at, tm]].forEach(([u, v]) => { if (v <= u) return; ctx.beginPath(); ctx.moveTo(B.tx(u), B.ty(0)); for (let i = 0; i <= 80; i++) { const x = u + (v - u) * i / 80; ctx.lineTo(B.tx(x), B.ty(S.t.pdf(x, R.df))); } ctx.lineTo(B.tx(v), B.ty(0)); ctx.closePath(); ctx.fill(); });
      ctx.restore();
      curve(ctx, B.tx, B.ty, x => S.t.pdf(x, R.df), -tm, tm, css("--accent"), 2);
      vline(ctx, B.tx(R.t), boxB.y0, boxB.y1, css("--text"));
      [-R.tc, R.tc].forEach(c => vline(ctx, B.tx(c), boxB.y0 + 10, boxB.y1, css("--muted"), true));
      ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = R.t > 0 ? "right" : "left"; ctx.textBaseline = "top";
      ctx.fillText("megfigyelt t = " + w1F(R.t, 2), B.tx(R.t) + (R.t > 0 ? -5 : 5), boxB.y0);
      statRow(statEl, [["átlagok", w1F(R.m1, 2) + " / " + w1F(R.m2, 2)], ["szórások $s$", w1F(Math.sqrt(R.v1), 2) + " / " + w1F(Math.sqrt(R.v2), 2)],
        ["SE", w1F(R.se, 3)], ["$t$", w1F(R.t, 2)], ["$df$", pooled ? String(R.df) : w1F(R.df, 1)], ["p (kétoldali)", w1P(R.p)],
        ["95%-os KI a különbségre", "[" + w1F(R.lo, 2) + "; " + w1F(R.hi, 2) + "]"]]);
      const other = w1TTest(a, b, !pooled);
      msg.innerHTML = `${pooled ? "Közös szórásos" : "Welch-féle"} t-próba: <b>${R.p <= 0.05 ? "5%-on elvetjük $H_0$-t" : "5%-on nem vetjük el $H_0$-t"}</b> (kritikus érték ±${fmt(R.tc, 3)}). ` +
        `Összevetésül ${pooled ? "Welch" : "közös szórással"}: $t$ = ${w1F(other.t, 2)}, p = ${w1P(other.p)}.` +
        (Math.abs(Math.log10(R.p / other.p)) > 0.5 ? " <b>A két módszer itt lényegesen eltér – nézd meg a szórásokat és a csoportméreteket!</b>" : "");
      window.Synopsis && Synopsis.renderMath(msg);
    }
    cv.draw = draw;
    setData(PRESETS.s33[1], PRESETS.s33[2]);
  };

  /* ------------------------------------------------------------------
     test-wizard – melyik próbát mikor?
     ------------------------------------------------------------------ */
  W["test-wizard"] = root => {
    header(root, "Próbaválasztó varázsló",
      "Válaszolj a kérdésekre – a varázsló megmondja, melyik próba illik a feladathoz, a próbastatisztikával és azzal, hol tanultuk.");
    const RES = {
      u1: ["Egymintás u-próba", "$z = \\dfrac{\\bar x - \\mu_0}{\\sigma/\\sqrt n} \\sim N(0,1)$", "#s81", "8.1", "Pl. a régi töltőgép: $\\sigma = 10$ g ismert, 25 zacskó átlaga 496 g."],
      t1: ["Egymintás t-próba", "$t = \\dfrac{\\bar x - \\mu_0}{s/\\sqrt n} \\sim t_{n-1}$", "#s83", "8.3", "Pl. az új gép öt zacskója: a szórást a mintából becsüljük."],
      tp: ["Páros t-próba", "$t = \\dfrac{\\bar d}{s_d/\\sqrt n} \\sim t_{n-1}$ a különbségekre", "#s84", "8.4", "Pl. ugyanaz a 6 dolgozó a betanítás előtt és után."],
      u2: ["Kétmintás u-próba", "$z = \\dfrac{\\bar x_1 - \\bar x_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}} \\sim N(0,1)$", "#s82", "8.2", "Pl. két régóta ismert szórású gép átlagos töltése."],
      welch: ["Welch-próba (kétmintás t, eltérő szórások)", "$t = \\dfrac{\\bar x_1 - \\bar x_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$, Welch-féle $df$", "#s85-b", "8.5", "Ha a szórások egyformák és a csoportméretek is, a közös szórásos t-próba ($df = n_1 + n_2 - 2$) is jó – de kétség esetén Welch."],
      chi: ["χ²-próba a szórásra", "$\\chi^2 = \\dfrac{(n-1)s^2}{\\sigma_0^2} \\sim \\chi^2_{n-1}$", "#s86-a", "8.6", "Csak normális adatra! Pl. a joghurtok szórása vs. az előírt 4 ml."],
      F: ["F-próba két szórásra", "$F = s_1^2/s_2^2$ (a nagyobb felül) $\\sim F_{n_1-1,\\,n_2-1}$", "#s86-b", "8.6", "Csak normális adatra! Pl. két gép pontossága."],
      lev: ["Levene-próba (vagy bootstrap)", "a csoportközéptől mért abszolút eltérések összehasonlítása", "#s86-c", "8.6", "Nem normális adatnál az F- és a χ²-próba megbízhatatlan – nagy mintán is."],
      p1: ["Egy arány z-próbája", "$z = \\dfrac{\\hat p - p_0}{\\sqrt{p_0(1-p_0)/n}}$", "#s87-a", "8.7", "Pl. 42 dohányzó a 400-ból, $p_0 = 0{,}15$."],
      binom: ["Pontos binomiális próba", "$P(X \\ge k \\mid n, p_0)$ közvetlenül a binomiális eloszlásból", "#s87-a", "8.7 / 7.2", "Ritka eseménynél ($np_0 \\lt 10$), pl. a 70 csavarból 3 selejtes."],
      p2: ["Két arány z-próbája", "$z = \\dfrac{\\hat p_1 - \\hat p_2}{\\sqrt{\\hat p(1-\\hat p)(1/n_1 + 1/n_2)}}$, összevont $\\hat p$", "#s87-b", "8.7", "Pl. A/B-teszt: 20/200 vs 34/200. Ne nézz bele menet közben!"],
      fisher: ["Fisher egzakt próbája", "pontos (permutációs) próba a 2×2-es táblára", "#s87-b", "9. fejezet", "Ha valamelyik csoportban 10-nél kevesebb „igen” vagy „nem” van."],
      anova: ["Varianciaanalízis (ANOVA)", "$F = \\dfrac{\\text{csoportok közti szórásnégyzet}}{\\text{csoporton belüli szórásnégyzet}}$", "#s89-c", "10. fejezet", "Három vagy több csoport átlaga – a páronkénti t-próbák többszörös tesztelést jelentenének."],
      np: ["Nemparaméteres vagy permutációs próba", "rangokon alapuló próbák, permutáció, bootstrap", "../07-hipotezisvizsgalat/#s76", "9. fejezet / 7.6", "Kis minta, erősen ferde adat vagy kiugró értékek esetén a t-próba félrevezethet."]
    };
    const Q = {
      start: ["Milyen az adat?", [["mért érték (súly, idő, pontszám…)", "what"], ["igen/nem kimenet (arány)", "pn"]]],
      pn: ["Hány mintád van?", [["egy minta, egy adott $p_0$-hoz hasonlítom", "pcond1"], ["két független csoport (pl. A/B-teszt)", "pcond2"]]],
      pcond1: ["Teljesül-e: $np_0 \\ge 10$ és $n(1-p_0) \\ge 10$?", [["igen", "=p1"], ["nem (ritka esemény vagy kis minta)", "=binom"]]],
      pcond2: ["Mindkét csoportban legalább 10 „igen” és 10 „nem” van?", [["igen", "=p2"], ["nem", "=fisher"]]],
      what: ["Mire kíváncsi a kérdés?", [["az átlagra (várható értékre)", "design"], ["a szórásra, pontosságra", "sdn"]]],
      sdn: ["Hány szórásról van szó?", [["egy, egy előírt $\\sigma_0$-hoz", "sdnorm1"], ["két csoport szórása", "sdnorm2"]]],
      sdnorm1: ["Normális-e az adat (egyenes QQ-ábra)?", [["igen", "=chi"], ["nem / kétes", "=lev"]]],
      sdnorm2: ["Normális-e mindkét csoport adata?", [["igen", "=F"], ["nem / kétes", "=lev"]]],
      design: ["Milyen a vizsgálati terv?", [["egy minta, egy adott $\\mu_0$-hoz", "shape1"], ["két mérés ugyanazon egységeken (előtte–utána, párok)", "shapeP"], ["két független csoport", "shape2"], ["három vagy több csoport", "=anova"]]],
      shape1: ["Kis minta ($n \\lt 30$) erősen ferde adattal vagy kiugró értékkel?", [["nem", "sig1"], ["igen", "=np"]]],
      shapeP: ["Kevés pár, és a különbségek erősen ferdék vagy kiugrók?", [["nem", "=tp"], ["igen", "=np"]]],
      shape2: ["Kis csoportok erősen ferde adattal vagy kiugró értékkel?", [["nem", "sig2"], ["igen", "=np"]]],
      sig1: ["Ismert a sokaság szórása (pl. évek óta mért gép, szabványos teszt)?", [["igen", "=u1"], ["nem, a mintából becslem", "=t1"]]],
      sig2: ["Ismertek a két sokaság szórásai?", [["igen", "=u2"], ["nem, a mintákból becslem", "=welch"]]]
    };
    let path = [];
    const crumbs = h("div", { class: "muted", style: "font-size:.88rem;margin:.3rem 0" });
    const body = h("div");
    root.append(crumbs, body);
    function go(node) {
      body.replaceChildren();
      crumbs.innerHTML = path.length ? path.map(p => p[1]).join(" → ") : "";
      if (node.startsWith("=")) {
        const [name, formula, href, where, note] = RES[node.slice(1)];
        body.append(h("div", { class: "box tip", style: "margin:.5rem 0" },
          h("span", { class: "box-title" }, "✅ " + name),
          h("div", { html: formula, style: "margin:.3rem 0" }),
          h("div", { html: note, style: "margin:.3rem 0" }),
          h("div", { html: `Hol tanultuk: <a href="${href}">${where}</a>` })));
      } else {
        const [q, opts] = Q[node];
        body.append(h("p", { style: "font-weight:600;margin:.4rem 0", html: q }),
          h("div", { class: "controls", style: "flex-direction:column;align-items:stretch;gap:.35rem" },
            ...opts.map(([lab, nxt]) => { const b = btn("", () => { path.push([node, lab]); go(nxt); }); b.innerHTML = lab; b.style.textAlign = "left"; return b; })));
      }
      const ctl = h("div", { class: "controls", style: "margin-top:.4rem" });
      if (path.length) ctl.append(btn("← Vissza", () => { const [prev] = path.pop(); go(prev); }), btn("Újrakezdem", () => { path = []; go("start"); }));
      body.append(ctl);
      window.Synopsis && Synopsis.renderMath(root);
    }
    go("start");
  };

  /* ==================================================================
     w2: welch-sim (8.5-c), f-test-sim (8.6-c), ab-test (8.7-c),
         power-planner (8.8-b)
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
  /* vezérlősor; a beágyazott gombsorok (segmented) saját margója nélkül */
  const w2Ctl = (...kids) => { kids.forEach(k => k && k.classList && k.classList.contains("controls") && (k.style.margin = "0")); return h("div", { class: "controls" }, ...kids); };
  const w2Lab = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const w2Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.6rem 0 0", html });
  /* kijelzősor egyszer felépítve (KaTeX-címkékkel), utána csak az értékek frissülnek */
  function w2Stats(el, labels) {
    statRow(el, labels.map(l => [l, "–"]));
    const vs = [...el.querySelectorAll(".v")], ls = [...el.querySelectorAll(".l")];
    const set = vals => vals.forEach((v, i) => { if (vs[i] && vs[i].innerHTML !== String(v)) { vs[i].innerHTML = v; if (/\$/.test(v)) window.Synopsis && Synopsis.renderMath(vs[i]); } });
    set.label = (i, l) => { if (ls[i] && ls[i].dataset.src !== l) { ls[i].dataset.src = l; ls[i].innerHTML = l; window.Synopsis && Synopsis.renderMath(ls[i]); } };
    return set;
  }
  const w2Math = (el, html) => { if (el.dataset.src !== html) { el.dataset.src = html; el.innerHTML = html; window.Synopsis && Synopsis.renderMath(el); } };
  const w2Clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const w2Font = (ctx, px, bold) => { ctx.font = `${bold ? "600 " : ""}${px}px system-ui, sans-serif`; };
  /* szöveg x köré középre, de a [lo, hi] sávon belül tartva */
  function w2TextIn(ctx, s, x, y, lo, hi) {
    const tw = ctx.measureText(s).width;
    ctx.textAlign = "left";
    ctx.fillText(s, Math.max(lo, Math.min(hi - tw, x - tw / 2)), y);
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
  /* címke kis háttérrel (hogy a rács fölött is olvasható legyen) */
  function w2Tag(ctx, s, x, y, color, align = "left", lo = -1e9, hi = 1e9) {
    const tw = ctx.measureText(s).width;
    let X = align === "right" ? x - tw : align === "center" ? x - tw / 2 : x;
    X = Math.max(lo, Math.min(hi - tw, X));
    ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(X - 2, y - 7, tw + 4, 14); ctx.restore();
    ctx.fillStyle = color; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, X, y);
  }
  /* p-érték kiírása: kb. két értékes jegy (0,46; 0,049; 0,0014), nagyon kicsinél „< 0,000001” */
  const w2P = p => {
    if (!isFinite(p)) return "–";
    if (p >= 0.995) return "1";
    if (p < 1e-6) return "< 0,000001";
    return fmt(p, w2Clamp(1 - Math.floor(Math.log10(p)), 2, 6));
  };
  const w2PEq = p => { const s = w2P(p); return s[0] === "<" ? "p " + s : "p = " + s; };
  const w2Hline = (ctx, x0, x1, y, color, dash = true, lw = 2) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  };
  const w2Pct = (x, d = 1) => (isFinite(x) ? pct(x, d) : "–");
  /* „arány (k / N)” kijelzőszöveg */
  const w2Rate = (k, N, d = 1) => (N ? `${pct(k / N, d)} <span style="font-size:.8em;color:var(--muted)">(${groupDigits(k)} / ${groupDigits(N)})</span>` : "–");
  /* darabolt futtatás: add(m) m ismétlést sorba állít, kötegenként (chunk) requestAnimationFrame-mel számol,
     cancel() eldobja a hátralévőt. Futás közben root.dataset.busy = "1" (a tesztek ezt figyelik). */
  function w2Queue(root, chunk, step, after) {
    let left = 0, token = 0;
    const loop = my => {
      if (my !== token) return;
      const m = Math.min(chunk, left); step(m); left -= m; after();
      if (left > 0) requestAnimationFrame(() => loop(my)); else delete root.dataset.busy;
    };
    return {
      add(m) { const idle = left === 0; left += m; if (idle) { root.dataset.busy = "1"; loop(token); } },
      cancel() { token++; left = 0; delete root.dataset.busy; }
    };
  }
  /* „téves elvetés” oszlopok: items = [{label, k, N, color}], vonal α-nál, ±2 SE bizonytalanság */
  function w2RateBars(ctx, box, items, alpha, narrow) {
    const top = Math.max(alpha * 2, ...items.map(it => { if (!it.N) return 0; const r = it.k / it.N; return r + (it.N >= 30 ? 2 * Math.sqrt(r * (1 - r) / it.N) : 0); }));
    const ymax = top <= 0.1 ? 0.1 : top <= 0.2 ? 0.2 : top <= 0.4 ? 0.4 : top <= 0.6 ? 0.6 : 1;
    const yt = rangeTicks(0, ymax, 4).filter(v => v <= ymax + 1e-9);
    const { ty } = w2Axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks: yt, yfmt: v => w2Num(100 * v, 1) + "%" });
    const cw = (box.x1 - box.x0) / items.length, bw = Math.min(70, cw * 0.5);
    items.forEach((it, i) => {
      const xc = box.x0 + (i + 0.5) * cw;
      ctx.fillStyle = css("--muted"); w2Font(ctx, narrow ? 10.5 : 11.5, true); ctx.textBaseline = "top";
      w2TextIn(ctx, it.label, xc, box.y1 + 6, box.x0, box.x1);
      if (!it.N) return;
      const r = it.k / it.N, y = ty(r);
      ctx.save(); ctx.globalAlpha = 0.75; ctx.fillStyle = css(it.color); ctx.fillRect(xc - bw / 2, y, bw, box.y1 - y); ctx.restore();
      if (it.N >= 30) {
        const se = Math.sqrt(r * (1 - r) / it.N), ya = ty(Math.min(ymax, r + 2 * se)), yb = ty(Math.max(0, r - 2 * se));
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(xc, ya); ctx.lineTo(xc, yb); ctx.moveTo(xc - 5, ya); ctx.lineTo(xc + 5, ya); ctx.moveTo(xc - 5, yb); ctx.lineTo(xc + 5, yb); ctx.stroke(); ctx.restore();
      }
      ctx.fillStyle = css("--text"); w2Font(ctx, 13, true); ctx.textBaseline = "bottom";
      const yl = it.N >= 30 ? ty(Math.min(ymax, r + 2 * Math.sqrt(r * (1 - r) / it.N))) : y;
      w2TextIn(ctx, pct(r, 1), xc, Math.max(box.y0 + 12, yl - 3), box.x0, box.x1);
    });
    const ya = ty(alpha);
    w2Hline(ctx, box.x0, box.x1, ya, css("--bad"));
    ctx.fillStyle = css("--bad"); w2Font(ctx, 10.5, true);
    w2Tag(ctx, `α = ${w2Num(100 * alpha, 1)}%`, box.x1 - 2, ya - 9, css("--bad"), "right");
  }

  /* ------------------------------------------------------------------
     8.5-c  Közös szórás vagy Welch? – szimuláció igaz H0 mellett
     ------------------------------------------------------------------ */
  W["welch-sim"] = root => {
    header(root, "Közös szórás vagy Welch? – szimuláció igaz H₀ mellett",
      w2R`Két normális csoport, <b>azonos várható értékkel</b> ($H_0$ igaz), de esetleg eltérő szórással. Minden kísérletben mindkét kétmintás $t$-próbát elvégezzük ($\alpha = 5\%$, kétoldali). Ami elvetés, az mind téves.`);
    const PRE = {
      eq: [10, 1, 10, 1, "egyforma"], sd: [10, 3, 10, 1, "eltérő szórás, egyforma n"],
      small: [5, 10, 20, 3, "kis csoport nagy szórással"], big: [20, 10, 5, 3, "nagy csoport nagy szórással"]
    };
    const SEED0 = 85, ALPHA = 0.05, NMAX = 40;
    let [n1, s1, n2, s2] = PRE.small, seed = SEED0, rnd, N = 0, rejP = 0, rejW = 0, last = null;
    const bx = new Float64Array(NMAX), by = new Float64Array(NMAX);
    const pSeg = segmented(Object.entries(PRE).map(([k, v]) => [k, v[4]]), "small", k => { [n1, s1, n2, s2] = PRE[k]; sync(); seed = SEED0; reset(); });
    const mk = (lab, min, max, step, val, show, set) => sliderRow(lab, min, max, step, val, show, v => { set(v); matchPreset(); seed = SEED0; reset(); });
    const sShow = v => w2Num(v, 1);
    const r1 = mk("$n_1 =$", 2, NMAX, 1, n1, String, v => (n1 = v)), q1 = mk("$\\sigma_1 =$", 0.5, 10, 0.5, s1, sShow, v => (s1 = v));
    const r2 = mk("$n_2 =$", 2, NMAX, 1, n2, String, v => (n2 = v)), q2 = mk("$\\sigma_2 =$", 0.5, 10, 0.5, s2, sShow, v => (s2 = v));
    function sync() { [[r1, n1, String], [q1, s1, sShow], [r2, n2, String], [q2, s2, sShow]].forEach(([r, v, f]) => { r.input.value = v; r.out.textContent = f(v); }); }
    function matchPreset() { const k = Object.keys(PRE).find(k => PRE[k][0] === n1 && PRE[k][1] === s1 && PRE[k][2] === n2 && PRE[k][3] === s2); pSeg.set(k || "", false); }
    const Q = w2Queue(root, 2000, m => { for (let j = 0; j < m; j++) one(); keepLast(); }, upd);
    root.append(w2Ctl(w2Lab("előbeállítás:"), pSeg.el),
      h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, r1.wrap, q1.wrap),
      h("div", { class: "controls", style: "gap:.4rem 1.4rem;margin-top:0" }, r2.wrap, q2.wrap),
      w2Ctl(btn("1 kísérlet", () => Q.add(1), "btn primary"), btn("+1 000", () => Q.add(1000)), btn("+10 000", () => Q.add(10000)),
        btn("Újra", () => { seed++; reset(); })));
    const cv = tallCanvas(root, w => (w < 560 ? 380 : 260));
    root.append(keyRow([["1. csoport", "--setA", "box"], ["2. csoport", "--setB", "box"], ["közös várható érték", "--muted", "dash"],
      ["téves elvetések aránya ± 2 SE", "--text", "line"], ["névleges α = 5%", "--bad", "dash"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["kísérletek", "téves elvetés – közös szórással", "téves elvetés – Welch"]);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    root.append(w2Note("Ha a kisebb csoport szórása nagyobb, a közös szórásos próba sokszor riaszt tévesen; Welch szinte mindig tartja az 5%-ot. "
      + "Ha a nagyobb csoport szórása nagyobb, a közös szórásos próba túl óvatos: ritkán riaszt, de egy valódi különbséget is nehezebben vesz észre."));

    function one() {
      let a = 0, b = 0;
      for (let i = 0; i < n1; i++) { bx[i] = s1 * S.rnorm(rnd); a += bx[i]; }
      for (let i = 0; i < n2; i++) { by[i] = s2 * S.rnorm(rnd); b += by[i]; }
      const m1 = a / n1, m2 = b / n2;
      let ss1 = 0, ss2 = 0;
      for (let i = 0; i < n1; i++) ss1 += (bx[i] - m1) ** 2;
      for (let i = 0; i < n2; i++) ss2 += (by[i] - m2) ** 2;
      const dfP = n1 + n2 - 2, sp2 = (ss1 + ss2) / dfP, tP = (m1 - m2) / Math.sqrt(sp2 * (1 / n1 + 1 / n2));
      const u1 = ss1 / (n1 - 1) / n1, u2 = ss2 / (n2 - 1) / n2, tW = (m1 - m2) / Math.sqrt(u1 + u2);
      const dfW = (u1 + u2) ** 2 / (u1 * u1 / (n1 - 1) + u2 * u2 / (n2 - 1));
      const pP = Math.min(1, 2 * S.t.cdf(-Math.abs(tP), dfP)), pW = Math.min(1, 2 * S.t.cdf(-Math.abs(tW), dfW));
      N++; if (pP < ALPHA) rejP++; if (pW < ALPHA) rejW++;
      last = { m1, m2, sd1: Math.sqrt(ss1 / (n1 - 1)), sd2: Math.sqrt(ss2 / (n2 - 1)), tP, dfP, pP, tW, dfW, pW };
    }
    function keepLast() { if (last) { last.x = Array.from(bx.subarray(0, n1)); last.y = Array.from(by.subarray(0, n2)); } }
    function reset() { Q.cancel(); rnd = S.mulberry32(seed); N = rejP = rejW = 0; last = null; Q.add(1000); }
    const verdict = p => (p < ALPHA ? `<b style="color:var(--bad)">H₀-t elvetjük (tévesen!)</b>` : `<span style="color:var(--ok);font-weight:600">nem vetjük el</span>`);
    function upd() {
      setS([groupDigits(N), w2Rate(rejP, N), w2Rate(rejW, N)]);
      if (last) {
        const L = last;
        w2Math(ro, `<b>Az utolsó kísérlet</b>: x̄₁ = ${w2F(L.m1, 2)}, s₁ = ${w2F(L.sd1, 2)} · x̄₂ = ${w2F(L.m2, 2)}, s₂ = ${w2F(L.sd2, 2)}<br>`
          + `közös szórással: t = ${w2F(L.tP, 2)}, df = ${L.dfP}, ${w2PEq(L.pP)} → ${verdict(L.pP)}<br>`
          + `Welch: t = ${w2F(L.tW, 2)}, df = ${w2Num(L.dfW, 1)}, ${w2PEq(L.pW)} → ${verdict(L.pW)}`);
      }
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const dBox = narrow ? { x0: 8, y0: 6, x1: w - 8, y1: 150 } : { x0: 8, y0: 6, x1: w * 0.56, y1: H - 8 };
      const bBox = narrow ? { x0: 46, y0: 180, x1: w - 10, y1: H - 26 } : { x0: w * 0.56 + 52, y0: 22, x1: w - 10, y1: H - 26 };
      // bal / felső panel: az utolsó kísérlet adatai
      const L = 3.3 * Math.max(s1, s2), X = v => dBox.x0 + 6 + (w2Clamp(v, -L, L) + L) / (2 * L) * (dBox.x1 - dBox.x0 - 12);
      const rowsY = narrow ? [dBox.y0 + 36, dBox.y0 + 96] : [dBox.y0 + (dBox.y1 - dBox.y0) * 0.3, dBox.y0 + (dBox.y1 - dBox.y0) * 0.66];
      const axY = narrow ? dBox.y1 - 14 : dBox.y1 - 22;
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(dBox.x0, axY); ctx.lineTo(dBox.x1, axY); ctx.stroke(); ctx.restore();
      ctx.fillStyle = css("--muted"); w2Font(ctx, 10.5); ctx.textBaseline = "top";
      rangeTicks(-L, L, 6).forEach(v => { w2TextIn(ctx, w2Num(v, 1), X(v), axY + 4, dBox.x0, dBox.x1); });
      vline(ctx, X(0), dBox.y0 + 14, axY, css("--muted"), true);
      const groups = [[last && last.x, last && last.m1, "--setA", `1. csoport: n₁ = ${n1}, σ₁ = ${w2Num(s1, 1)}`, "x̄₁"],
        [last && last.y, last && last.m2, "--setB", `2. csoport: n₂ = ${n2}, σ₂ = ${w2Num(s2, 1)}`, "x̄₂"]];
      groups.forEach(([xs, m, c, lab, ml], g) => {
        const y = rowsY[g], col = css(c);
        ctx.fillStyle = css("--muted"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom"; ctx.textAlign = "left";
        ctx.fillText(lab, dBox.x0 + 2, y - 13);
        if (!xs) return;
        ctx.save(); ctx.globalAlpha = 0.7;
        xs.forEach((v, i) => w2Dot(ctx, X(v), y + ((i % 3) - 1) * 4, 3.5, col));
        ctx.restore();
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(m), y - 11); ctx.lineTo(X(m), y + 11); ctx.stroke(); ctx.restore();
        ctx.fillStyle = col; w2Font(ctx, 10.5, true); ctx.textBaseline = "top"; w2TextIn(ctx, ml, X(m), y + 12, dBox.x0, dBox.x1);
      });
      // jobb / alsó panel: téves elvetések aránya
      w2RateBars(ctx, bBox, [{ label: "közös szórással", k: rejP, N, color: "--setC" }, { label: "Welch", k: rejW, N, color: "--accent" }], ALPHA, narrow);
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText("téves elvetések aránya", bBox.x0 - 40, bBox.y0 - 6);
    };
    reset();
  };

  /* ------------------------------------------------------------------
     8.6-c  Az F-próba érzékeny a normalitásra
     ------------------------------------------------------------------ */
  W["f-test-sim"] = root => {
    header(root, "Az F-próba érzékeny a normalitásra",
      w2R`Két csoport <b>ugyanabból</b> az eloszlásból (a szórások egyenlők, $H_0$ igaz), csoportonként $n$ elem. Kétoldali $F$-próba, $\alpha = 5\%$: $F = s_1^2/s_2^2$, és $H_0$-t elvetjük, ha $F$ valamelyik kritikus értéken kívül esik.`);
    const DISTS = {
      norm: { name: "normális", draw: r => S.rnorm(r), pdf: x => S.normal.pdf(x), mu: 0, sd: 1, lo: -4, hi: 4 },
      t5: { name: "csúcsos (t₅)", draw: r => S.rnorm(r) / Math.sqrt(S.rchi2(r, 5) / 5), pdf: x => S.t.pdf(x, 5), mu: 0, sd: Math.sqrt(5 / 3), lo: -5.5, hi: 5.5 },
      exp: { name: "ferde (exponenciális)", draw: r => S.rexp(r, 1), pdf: x => (x < 0 ? 0 : Math.exp(-x)), mu: 1, sd: 1, lo: -1.5, hi: 5.5 },
      unif: { name: "egyenletes", draw: r => r(), pdf: x => (x >= 0 && x <= 1 ? 1 : 0), mu: 0.5, sd: Math.sqrt(1 / 12), lo: -0.35, hi: 1.35 }
    };
    const SEED0 = 86, NMAX = 100;
    let n = 25, dist = "norm", seed = SEED0, rnd, logs = [], lo = 0, hi = 0, crit;
    const bx = new Float64Array(NMAX), by = new Float64Array(NMAX);
    const nSeg = segmented([10, 25, 100].map(v => [v, String(v)]), n, v => { n = +v; reset(); });
    const dSeg = segmented(Object.entries(DISTS).map(([k, d]) => [k, d.name]), dist, v => { dist = v; reset(); });
    const Q = w2Queue(root, 500, m => { for (let j = 0; j < m; j++) one(); }, upd);
    root.append(w2Ctl(w2Lab("csoportonként $n$ ="), nSeg.el), w2Ctl(w2Lab("eloszlás:"), dSeg.el),
      w2Ctl(btn("+1 000", () => Q.add(1000), "btn primary"), btn("+10 000", () => Q.add(10000)), btn("Újra", () => { seed++; reset(); })));
    const cvS = tallCanvas(root, w => (w < 560 ? 105 : 115));
    root.append(keyRow([["az eloszlás sűrűségfüggvénye", "--setB", "box"], ["normális, azonos átlaggal és szórással", "--muted", "dash"]]));
    const cv = tallCanvas(root, w => (w < 560 ? 260 : 290));
    root.append(keyRow([["szimulált F-értékek", "--setA", "box"], ["elvetés (a kritikus értékeken kívül)", "--bad", "box"],
      ["elméleti $F_{n-1,\\,n-1}$ sűrűség (normális esetben)", "--text", "line"], ["kritikus értékek", "--bad", "dash"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["ismétlések", "téves elvetés (névleges 5%)", "F az alsó krit. alatt (névl. 2,5%)", "F a felső krit. fölött (névl. 2,5%)", "kritikus értékek"]);
    root.append(w2Note("Nagyobb mintával nem javul, sőt romlik: a hiba nem a minta kicsiségéből, hanem a nem normális alakból jön. "
      + "(Az átlagok $t$-próbájánál fordítva: ott a centrális határeloszlás-tétel nagy mintán segít.) A vízszintes tengely logaritmikus."));

    function setup() {
      crit = [S.f.inv(0.025, n - 1, n - 1), S.f.inv(0.975, n - 1, n - 1)];
    }
    function one() {
      const D = DISTS[dist];
      let a = 0, b = 0;
      for (let i = 0; i < n; i++) { bx[i] = D.draw(rnd); a += bx[i]; by[i] = D.draw(rnd); b += by[i]; }
      a /= n; b /= n;
      let v1 = 0, v2 = 0;
      for (let i = 0; i < n; i++) { v1 += (bx[i] - a) ** 2; v2 += (by[i] - b) ** 2; }
      const F = v1 / v2;
      logs.push(Math.log10(F));
      if (F < crit[0]) lo++; else if (F > crit[1]) hi++;
    }
    function reset() { Q.cancel(); setup(); rnd = S.mulberry32(seed); logs = []; lo = hi = 0; cvS.draw(); Q.add(1000); }
    function upd() {
      const N = logs.length;
      setS([groupDigits(N), w2Rate(lo + hi, N), w2Rate(lo, N), w2Rate(hi, N), `${w2Num(crit[0], 2)} és ${w2Num(crit[1], 2)}`]);
      cv.draw();
    }
    cvS.draw = () => {
      const ctx = cvS.ctx, w = cvS.w, H = cvS.h, D = DISTS[dist];
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 10, y0: 18, x1: w - 10, y1: H - 18 };
      const pdfN = x => S.normal.pdf(x, D.mu, D.sd);
      let ym = 0; for (let i = 0; i <= 200; i++) { const x = D.lo + (D.hi - D.lo) * i / 200; ym = Math.max(ym, D.pdf(x), pdfN(x)); }
      ym *= 1.08;
      const { tx, ty } = axes(ctx, box, { xmin: D.lo, xmax: D.hi, ymin: 0, ymax: ym, xticks: [], xlabel: "" });
      // kitöltött sűrűség
      ctx.save(); ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(tx(D.lo), ty(0));
      for (let i = 0; i <= 300; i++) { const x = D.lo + (D.hi - D.lo) * i / 300; ctx.lineTo(tx(x), ty(D.pdf(x))); }
      ctx.lineTo(tx(D.hi), ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      if (dist !== "norm") curve(ctx, tx, ty, pdfN, D.lo, D.hi, css("--muted"), 1.5, [5, 4]);
      curve(ctx, tx, ty, D.pdf, D.lo, D.hi, css("--setB"), 2);
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11, true); ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(D.name, box.x0 + 4, 2);
    };
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560, N = logs.length, df = n - 1;
      ctx.clearRect(0, 0, w, H);
      const Lr = 1.8 * Math.log10(crit[1]), K = narrow ? 30 : 44, bwid = 2 * Lr / K;
      const counts = new Array(K).fill(0); let out = 0;
      for (const v of logs) { const i = Math.floor((v + Lr) / bwid); if (i >= 0 && i < K) counts[i]++; else out++; }
      const g = y => { const F = 10 ** y; return S.f.pdf(F, df, df) * F * Math.LN10; };
      let ym = 0; for (let i = 0; i <= 200; i++) ym = Math.max(ym, g(-Lr + 2 * Lr * i / 200));
      const dens = counts.map(c => (N ? c / (N * bwid) : 0));
      ym = Math.max(ym, ...dens) * 1.12;
      const box = { x0: 14, y0: 26, x1: w - 12, y1: H - 36 };
      const cand = [0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1, 1.25, 1.5, 2, 3, 5, 10].filter(F => Math.abs(Math.log10(F)) <= Lr * 0.97);
      let ticks = cand;
      if (ticks.length > (narrow ? 7 : 11)) ticks = ticks.filter(F => [0.1, 0.2, 0.5, 1, 2, 5, 10].includes(F));
      if (ticks.length > (narrow ? 7 : 11)) ticks = ticks.filter(F => [0.1, 0.5, 1, 2, 10].includes(F));
      const { tx, ty } = axes(ctx, box, { xmin: -Lr, xmax: Lr, ymin: 0, ymax: ym, xticks: ticks.map(Math.log10), xfmt: v => w2Num(10 ** v, 2), xlabel: "F = s₁² / s₂²" });
      const cBad = css("--bad"), cA = css("--setA"), l0 = Math.log10(crit[0]), l1 = Math.log10(crit[1]);
      counts.forEach((c, i) => {
        if (!c) return;
        const a = -Lr + i * bwid, mid = a + bwid / 2, rej = mid < l0 || mid > l1;
        ctx.save(); ctx.globalAlpha = rej ? 0.8 : 0.5; ctx.fillStyle = rej ? cBad : cA;
        const y = ty(dens[i]); ctx.fillRect(tx(a) + 0.5, y, tx(a + bwid) - tx(a) - 1, box.y1 - y); ctx.restore();
      });
      curve(ctx, tx, ty, g, -Lr, Lr, css("--text"), 2);
      vline(ctx, tx(l0), box.y0 - 6, box.y1, cBad, true); vline(ctx, tx(l1), box.y0 - 6, box.y1, cBad, true);
      w2Font(ctx, 10.5, true); ctx.textBaseline = "bottom"; ctx.fillStyle = cBad;
      ctx.textAlign = "right"; ctx.fillText(w2Num(crit[0], 2), tx(l0) - 4, box.y0 - 8);
      ctx.textAlign = "left"; ctx.fillText(w2Num(crit[1], 2), tx(l1) + 4, box.y0 - 8);
      if (N) {
        w2Font(ctx, 11, true);
        w2Tag(ctx, pct(lo / N, 1), tx(l0) - 6, box.y0 + 14, cBad, "right", box.x0, box.x1);
        w2Tag(ctx, pct(hi / N, 1), tx(l1) + 6, box.y0 + 14, cBad, "left", box.x0, box.x1);
      } else { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "Indíts egy szimulációt!", w / 2, H / 2, 0, w); }
      if (out) { ctx.fillStyle = css("--muted"); w2Font(ctx, 10); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(`${pct(out / N, 1)} az ábrán kívül`, box.x0 + 2, box.y1 + 20); }
    };
    reset();
  };

  /* ------------------------------------------------------------------
     8.7-c  A/B-teszt élőben – és a belenézés csapdája
     ------------------------------------------------------------------ */
  W["ab-test"] = root => {
    header(root, "A/B-teszt élőben – és a belenézés csapdája",
      w2R`Egy webshop két oldalváltozatot próbál ki. Minden látogató véletlenül kerül az A vagy a B változatra, és a valódi vásárlási arány $p_A$, illetve $p_B$. Két arány $z$-próbája (közös aránnyal, kétoldali) minden 100 látogató után.`);
    const SEED0 = 87, STEP = 100, END = 2000, LOOKS = END / STEP;
    let pA = 10, pB = 10, seed = SEED0, rnd, n = 0, kA = 0, kB = 0, path = [], timer = null;
    let simRnd, simN = 0, simEver = 0, simEnd = 0, perLook, firstAt;
    const binom = (m, p, r) => { let k = 0; for (let i = 0; i < m; i++) if (r() < p) k++; return k; };
    function ztest(ka, kb, na, nb) {
      const ph = (ka + kb) / (na + nb), se = Math.sqrt(ph * (1 - ph) * (1 / na + 1 / nb));
      if (!(se > 0)) return { z: 0, p: 1 };
      const z = (kb / nb - ka / na) / se;
      return { z, p: Math.min(1, 2 * S.normal.cdf(-Math.abs(z))) };
    }
    const show = v => v + "%";
    const rA = sliderRow("$p_A =$", 1, 30, 1, pA, show, v => { pA = v; preset(); resetAll(); });
    const rB = sliderRow("$p_B =$", 1, 30, 1, pB, show, v => { pB = v; preset(); resetAll(); });
    const setP = (a, b) => { pA = a; pB = b; rA.input.value = a; rA.out.textContent = show(a); rB.input.value = b; rB.out.textContent = show(b); preset(); resetAll(); };
    const pSeg = segmented([["0", "nincs különbség: 10% / 10%"], ["1", "B valóban jobb: 15%"]], "0", v => (v === "1" ? setP(10, 15) : setP(10, 10)));
    const preset = () => pSeg.set(pA === 10 && pB === 10 ? "0" : pA === 10 && pB === 15 ? "1" : "", false);
    const runB = btn("Futtasd 2000-ig", () => runTo());
    root.append(h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, rA.wrap, rB.wrap), w2Ctl(pSeg.el),
      w2Ctl(btn("+100 látogató változatonként", () => { stop(); add(); }, "btn primary"), runB, btn("Újra", () => { seed++; resetLive(); })));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["látogatók / változat ($n$)", "vásárlók (A / B)", "$\\hat p_A$", "$\\hat p_B$", "különbség $\\hat p_B - \\hat p_A$", "$z$", "p (kétoldali)"]);
    const ro = h("div", { class: "readout" }); root.append(ro);
    const cv = tallCanvas(root, w => (w < 560 ? 250 : 270));
    root.append(keyRow([["a p-érték útja", "--accent", "line"], ["p < 0,05", "--bad", "box"], ["α = 0,05", "--bad", "dash"]]));
    root.append(w2Note("Ha addig nézed, amíg szignifikáns nem lesz, egyszer szinte biztosan az lesz – akkor is, ha nincs különbség. A függőleges tengely logaritmikus."));

    // 2. rész: sok A/B-teszt
    root.append(h("p", { style: "font-weight:700;margin:1.1rem 0 .2rem" }, "Sok A/B-teszt: belenézés 100-asával 2000-ig"),
      w2Note(w2R`Minden szimulált kísérletben 20-szor nézünk bele ($n = 100, 200, \dots, 2000$). Mennyi a valószínűsége, hogy <b>valamikor</b> p &lt; 0,05 lesz – és mennyi, hogy a végén, az egyetlen, előre tervezett próbánál? (A fenti $p_A$, $p_B$ értékekkel; ha egyenlők, minden elvetés téves.)`));
    const SQ = w2Queue(root, 200, m => { for (let j = 0; j < m; j++) simOne(); }, updSim);
    root.append(w2Ctl(btn("Szimuláld 1000-szer", () => SQ.add(1000), "btn primary"), btn("Ürít", () => { resetSim(true); })));
    const cv2 = tallCanvas(root, w => (w < 560 ? 230 : 240));
    root.append(keyRow([["eddig valamikor p < 0,05", "--bad", "line"], ["épp ennél a belenézésnél p < 0,05", "--accent", "line"], ["α = 5%", "--muted", "dash"]]));
    const s2El = h("div", { class: "stat-row" }); root.append(s2El);
    const setS2 = w2Stats(s2El, ["szimulált kísérletek", "valamikor p < 0,05 (20 belenézésből)", "csak a végén p < 0,05 (1 próba)"]);

    function add() {
      if (!rnd) rnd = S.mulberry32(seed);
      kA += binom(STEP, pA / 100, rnd); kB += binom(STEP, pB / 100, rnd); n += STEP;
      const t = ztest(kA, kB, n, n); path.push({ n, p: t.p, z: t.z });
      upd();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } runB.disabled = false; delete root.dataset.anim; }
    function runTo() {
      stop(); if (n >= END) return;
      root.dataset.anim = "1"; runB.disabled = true;
      timer = setInterval(() => { add(); if (n >= END) stop(); }, 110);
    }
    function resetLive() { stop(); rnd = S.mulberry32(seed); n = kA = kB = 0; path = []; upd(); }
    function resetSim(newSeed) {
      SQ.cancel(); if (newSeed) simSeed++; simRnd = S.mulberry32(simSeed); simN = simEver = simEnd = 0;
      perLook = new Array(LOOKS).fill(0); firstAt = new Array(LOOKS).fill(0); updSim();
    }
    let simSeed = 1087;
    function resetAll() { seed = SEED0; resetLive(); simSeed = 1087; resetSim(false); }
    function simOne() {
      let a = 0, b = 0, ever = false, pa = pA / 100, pb = pB / 100;
      for (let j = 0; j < LOOKS; j++) {
        a += binom(STEP, pa, simRnd); b += binom(STEP, pb, simRnd);
        const m = (j + 1) * STEP, p = ztest(a, b, m, m).p;
        if (p < 0.05) { perLook[j]++; if (!ever) { ever = true; firstAt[j]++; } if (j === LOOKS - 1) simEnd++; }
      }
      simN++; if (ever) simEver++;
    }
    const first = () => path.find(q => q.p < 0.05);
    function upd() {
      const t = n ? ztest(kA, kB, n, n) : null;
      setS([groupDigits(n), n ? `${kA} / ${kB}` : "–", n ? w2Pct(kA / n, 1) : "–", n ? w2Pct(kB / n, 1) : "–",
        n ? w2Minus(fmt(100 * (kB - kA) / n, 1)) + " százalékpont" : "–", t ? w2F(t.z, 2) : "–", t ? w2P(t.p) : "–"]);
      const f = first();
      let s;
      if (!n) s = "Még nincs látogató. Indítsd el a tesztet!";
      else {
        const rej = t.p < 0.05;
        s = `n = ${groupDigits(n)} látogató / változat: z = ${w2F(t.z, 2)}, ${w2PEq(t.p)} → `
          + (rej ? `<b style="color:var(--bad)">5%-on H₀-t elvetjük</b>` : `<span style="color:var(--ok);font-weight:600">5%-on H₀-t nem vetjük el</span>`);
        if (f && f.n !== n && !rej) s += `<br>Közben n = ${groupDigits(f.n)}-nál ${w2PEq(f.p)} volt – ott leállva „szignifikáns különbséget” hirdettünk volna${pA === pB ? ", pedig nincs" : ""}.`;
      }
      ro.innerHTML = s;
      cv.draw();
    }
    function updSim() {
      setS2([groupDigits(simN), w2Rate(simEver, simN), w2Rate(simEnd, simN)]);
      cv2.draw();
    }
    const LG = Math.log10;
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const xmax = Math.max(END, n), ymin = Math.min(-4, Math.floor(Math.min(0, ...path.map(q => LG(Math.max(q.p, 1e-12)))))) ;
      const box = { x0: 52, y0: 24, x1: w - (narrow ? 22 : 16), y1: H - 36 };
      const st = ymin < -6 ? 2 : 1, yt = st > 1 ? [1, 0.05] : [1, 0.1, 0.05, 0.01];
      for (let k = st > 1 ? 2 : 3; k <= -ymin; k += st) yt.push(10 ** -k);
      const ty = v => box.y0 + (0 - v) / (0 - ymin) * (box.y1 - box.y0);
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1; w2Font(ctx, 11); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      yt.forEach(v => { const y = ty(LG(v)); ctx.beginPath(); ctx.moveTo(box.x0, y); ctx.lineTo(box.x1, y); ctx.stroke(); ctx.fillText((v >= 1e-4 ? w2Num(v, 4) : "10" + String(Math.round(LG(v))).replace(/./g, ch => "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(ch)])), box.x0 - 5, y); });
      ctx.restore();
      const xt = rangeTicks(0, xmax, narrow ? 4 : 8);
      const { tx } = axes(ctx, { ...box }, { xmin: 0, xmax, ymin: 0, ymax: 1, xticks: xt, xfmt: v => groupDigits(v), xlabel: "látogatók / változat (n)" });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("p-érték", 4, 0);
      const y05 = ty(LG(0.05));
      w2Hline(ctx, box.x0, box.x1, y05, css("--bad"));
      // sáv a 0,05 alatt
      ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = css("--bad"); ctx.fillRect(box.x0, y05, box.x1 - box.x0, box.y1 - y05); ctx.restore();
      const Y = p => ty(Math.max(ymin, LG(Math.max(p, 1e-12))));
      if (path.length) {
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(tx(0), ty(0));
        path.forEach(q => ctx.lineTo(tx(q.n), Y(q.p))); ctx.stroke(); ctx.restore();
        path.forEach(q => w2Dot(ctx, tx(q.n), Y(q.p), q.p < 0.05 ? 4 : 2.8, css(q.p < 0.05 ? "--bad" : "--accent")));
        const f = first();
        if (f) {
          const x = tx(f.n), y = Y(f.p);
          ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 8, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
          ctx.fillStyle = css("--text"); w2Font(ctx, narrow ? 10.5 : 11.5, true); ctx.textBaseline = "middle";
          const ly = Math.min(box.y1 - 9, y + 20);
          const lab = narrow ? "Itt leállt volna egy türelmetlen elemző" : "↑ Itt leállt volna egy türelmetlen elemző";
          w2Tag(ctx, lab, x - 14, ly, css("--text"), "left", box.x0 + 2, box.x1 - 2);
        }
      } else { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "Kattints: +100 látogató, vagy Futtasd 2000-ig!", (box.x0 + box.x1) / 2, (box.y0 + y05) / 2, box.x0, box.x1); }
      ctx.fillStyle = css("--bad"); w2Font(ctx, 10.5, true);
      w2Tag(ctx, "α = 0,05", box.x1 - 2, y05 - 9, css("--bad"), "right");
    };
    cv2.draw = () => {
      const ctx = cv2.ctx, w = cv2.w, H = cv2.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const cum = []; firstAt.reduce((s, c, i) => (cum[i] = s + c), 0);
      const top = simN ? Math.max(...cum.map(c => c / simN), ...perLook.map(c => c / simN)) : 0;
      const ymax = top <= 0.1 ? 0.1 : top <= 0.3 ? 0.3 : top <= 0.5 ? 0.5 : 1;
      const box = { x0: 46, y0: 18, x1: w - 16, y1: H - 36 };
      const xt = narrow ? [1, 5, 10, 15, 20] : [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      const { tx, ty } = w2Axes(ctx, box, { xmin: 0.5, xmax: LOOKS + 0.5, ymin: 0, ymax, yticks: rangeTicks(0, ymax, 4), yfmt: v => w2Num(100 * v, 1) + "%",
        xticks: xt, xfmt: v => String(v), xlabel: narrow ? "belenézés (×100 látogató)" : "belenézések száma (×100 látogató / változat)" });
      w2Hline(ctx, box.x0, box.x1, ty(0.05), css("--muted"), true, 1.5);
      if (!simN) { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "Szimuláld 1000-szer!", (box.x0 + box.x1) / 2, box.y0 + (box.y1 - box.y0) * 0.3, box.x0, box.x1); return; }
      const line = (arr, c) => {
        ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = 2.2; ctx.beginPath();
        arr.forEach((v, i) => (i ? ctx.lineTo(tx(i + 1), ty(v / simN)) : ctx.moveTo(tx(i + 1), ty(v / simN)))); ctx.stroke(); ctx.restore();
        arr.forEach((v, i) => w2Dot(ctx, tx(i + 1), ty(v / simN), 2.6, css(c)));
      };
      line(perLook, "--accent"); line(cum, "--bad");
      w2Font(ctx, 11.5, true);
      const e = cum[LOOKS - 1] / simN, en = perLook[LOOKS - 1] / simN;
      w2Tag(ctx, "valamikor: " + pct(e, 1), tx(LOOKS) - 6, ty(e) - 11, css("--bad"), "right", box.x0 + 2, box.x1);
      w2Tag(ctx, "a végén: " + pct(en, 1), tx(LOOKS) - 6, ty(en) + (ty(en) + 14 < box.y1 ? 12 : -12), css("--accent"), "right");
    };
    resetAll();
  };

  /* ------------------------------------------------------------------
     8.8-b  Erő- és mintanagyság-tervező két csoporthoz
     ------------------------------------------------------------------ */
  W["power-planner"] = root => {
    header(root, "Erő- és mintanagyság-tervező két csoporthoz",
      w2R`Add meg, mekkora különbséget akarsz észrevenni, milyen szinten ($\alpha$), és mekkora eséllyel (kívánt erő $1-\beta$). A tervező megmondja a csoportonként szükséges létszámot (kétoldali próba, normális közelítés).`);
    let mode = "mean", D = 3, sig = 12, p1 = 10, p2 = 15, alpha = 0.05, pw = 0.8;
    const plan = { mean: 100, prop: 400 };
    let req = null, xmax = 4;
    const mSeg = segmented([["mean", "átlagok"], ["prop", "arányok"]], mode, v => { mode = v; upd(); });
    const rD = sliderRow("érdekes különbség $\\Delta =$", 0.5, 20, 0.5, D, v => w2Num(v, 1), v => { D = v; upd(); });
    const rS = sliderRow("szórás $\\sigma =$", 1, 40, 1, sig, String, v => { sig = v; upd(); });
    const rP1 = sliderRow("$p_1 =$", 1, 60, 1, p1, v => v + "%", v => { p1 = v; upd(); });
    const rP2 = sliderRow("$p_2 =$", 1, 60, 1, p2, v => v + "%", v => { p2 = v; upd(); });
    const aSeg = segmented([[0.1, "10%"], [0.05, "5%"], [0.01, "1%"]], alpha, v => { alpha = +v; upd(); });
    const wSeg = segmented([[0.7, "70%"], [0.8, "80%"], [0.9, "90%"], [0.95, "95%"]], pw, v => { pw = +v; upd(); });
    const rN = sliderRow("tervezett $n$ / csoport:", 2, 500, 1, plan.mean, v => groupDigits(v), v => { plan[mode] = v; upd(); });
    const gMean = h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, rD.wrap, rS.wrap);
    const gProp = h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, rP1.wrap, rP2.wrap);
    root.append(w2Ctl(w2Lab("mit hasonlítasz össze?"), mSeg.el), gMean, gProp,
      w2Ctl(w2Lab("$\\alpha$:"), aSeg.el, w2Lab("kívánt erő:"), wSeg.el));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["szükséges $n$ / csoport", "összesen (2 csoport)", "$d = \\Delta/\\sigma$", "erő a tervezett $n$-nél"]);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    const cv = tallCanvas(root, w => (w < 560 ? 250 : 280));
    cv.c.style.touchAction = "pan-y"; cv.c.style.cursor = "ew-resize";
    root.append(keyRow([["erő a csoportlétszám függvényében", "--accent", "line"], ["kívánt erő", "--ok", "dash"], ["szükséges n", "--muted", "dash"], ["tervezett n (húzd!)", "--text", "box"]]));
    root.append(w2Ctl(rN.wrap));
    root.append(w2Note("Az erőbe mindkét farkat beszámítjuk (a másik irányú elvetés esélye itt elhanyagolható). "
      + "Kerekített $z$-kkel (1,96 és 0,84) számolva néha eggyel kisebb $n$ jön ki – például 250,9 → 251 –, ez nem hiba."));

    const z = q => S.normal.inv(q);
    function calc() {
      const za = z(1 - alpha / 2), zb = z(pw);
      if (mode === "mean") {
        const raw = 2 * sig * sig * (za + zb) ** 2 / (D * D);
        const power = m => { const k = D / (sig * Math.sqrt(2 / m)); return S.normal.cdf(k - za) + S.normal.cdf(-k - za); };
        return { za, zb, raw, power };
      }
      const a = p1 / 100, b = p2 / 100, pb = (a + b) / 2, Dp = Math.abs(a - b);
      const A = za * Math.sqrt(2 * pb * (1 - pb)), B = Math.sqrt(a * (1 - a) + b * (1 - b));
      const raw = Dp > 0 ? (A + zb * B) ** 2 / (Dp * Dp) : Infinity;
      const power = m => S.normal.cdf((Dp * Math.sqrt(m) - A) / B) + S.normal.cdf((-Dp * Math.sqrt(m) - A) / B);
      return { za, zb, raw, power, pb };
    }
    const tn = x => texNum(x, x < 10 ? 2 : 1);
    function upd() {
      gMean.style.display = mode === "mean" ? "" : "none"; gProp.style.display = mode === "prop" ? "" : "none";
      req = calc();
      const ok = isFinite(req.raw), nReq = ok ? Math.max(2, Math.ceil(req.raw - 1e-9)) : null;
      req.n = nReq;
      xmax = ok ? Math.max(4, 2 * nReq) : 1000;
      rN.input.max = xmax; rN.input.disabled = !ok;
      plan[mode] = w2Clamp(plan[mode], 2, xmax);
      rN.input.value = plan[mode]; rN.out.textContent = groupDigits(plan[mode]);
      const np = plan[mode], pwr = req.power(np);
      setS.label(2, mode === "mean" ? "$d = \\Delta/\\sigma$" : "különbség $|p_1 - p_2|$");
      setS([ok ? groupDigits(nReq) : "–", ok ? groupDigits(2 * nReq) : "–",
        mode === "mean" ? w2Num(D / sig, 3) : w2Num(Math.abs(p1 - p2), 0) + " százalékpont", pct(pwr, 1)]);
      const zs = `$z_{1-\\alpha/2} = ${texNum(req.za, 3)}$, $z_{1-\\beta} = ${texNum(req.zb, 3)}$`;
      if (mode === "mean")
        w2Math(ro, `${zs}<br>$n = \\dfrac{2\\sigma^2\\,(z_{1-\\alpha/2} + z_{1-\\beta})^2}{\\Delta^2} = \\dfrac{2\\cdot ${w2Num(sig, 1)}^2\\cdot(${texNum(req.za, 3)} + ${texNum(req.zb, 3)})^2}{${texNum(D, D % 1 ? 1 : 0)}^2} = ${tn(req.raw)} \\;\\Rightarrow\\; ${texNum(nReq, 0)}$ fő / csoport`);
      else if (ok)
        w2Math(ro, `${zs}, $\\bar p = ${texNum(req.pb, 3)}$<br>$n = \\dfrac{\\big(z_{1-\\alpha/2}\\sqrt{2\\bar p(1-\\bar p)} + z_{1-\\beta}\\sqrt{p_1(1-p_1)+p_2(1-p_2)}\\big)^2}{(p_1-p_2)^2} = ${tn(req.raw)} \\;\\Rightarrow\\; ${texNum(nReq, 0)}$ / csoport`);
      else w2Math(ro, "$p_1 = p_2$: nincs kimutatandó különbség, ehhez semmilyen létszám nem elég.");
      cv.draw();
    }
    const box = () => ({ x0: 46, y0: 18, x1: cv.w - 16, y1: cv.h - 36 });
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560, B = box();
      ctx.clearRect(0, 0, w, H);
      const { tx, ty } = w2Axes(ctx, B, { xmin: 0, xmax, ymin: 0, ymax: 1, yticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yfmt: v => w2Num(100 * v, 0) + "%",
        xticks: rangeTicks(0, xmax, narrow ? 4 : 8).filter(v => Number.isInteger(v)), xfmt: v => groupDigits(v), xlabel: "n / csoport", ylabel: "" });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("erő", 4, 0);
      if (!req.n) { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "p₁ = p₂: nincs mit kimutatni", (B.x0 + B.x1) / 2, (B.y0 + B.y1) / 2, B.x0, B.x1); return; }
      w2Hline(ctx, B.x0, B.x1, ty(pw), css("--ok"));
      vline(ctx, tx(req.n), B.y0, B.y1, css("--muted"), true);
      const pf = m => (m <= 0 ? alpha : req.power(m));
      curve(ctx, tx, ty, pf, 0, xmax, css("--accent"), 2.5);
      w2Font(ctx, 10.5, true);
      w2Tag(ctx, `kívánt erő: ${w2Num(100 * pw, 0)}%`, B.x0 + 4, ty(pw) - 10, css("--ok"), "left");
      w2Tag(ctx, `szükséges: ${groupDigits(req.n)}`, tx(req.n) + 5, B.y1 - 12, css("--muted"), "left", B.x0, B.x1);
      const np = plan[mode], pv = req.power(np), x = tx(np), y = ty(pv);
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.globalAlpha = 0.5; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, B.y1); ctx.lineTo(x, y); ctx.lineTo(B.x0, y); ctx.stroke(); ctx.restore();
      w2Dot(ctx, x, y, 7, css("--text")); w2Dot(ctx, x, y, 3.5, css("--card"));
      w2Font(ctx, 11.5, true);
      const right = x < (B.x0 + B.x1) * 0.6;
      w2Tag(ctx, `n = ${groupDigits(np)} → erő ${pct(pv, 1)}`, x + (right ? 12 : -12), y + (pv > 0.85 ? 16 : -14), css("--text"), right ? "left" : "right", B.x0, B.x1);
    };
    /* húzás a vásznon: a tervezett n */
    let drag = false;
    const setFromX = e => {
      if (!req.n) return;
      const r = cv.c.getBoundingClientRect(), B = box(), xx = e.clientX - r.left;
      plan[mode] = w2Clamp(Math.round((xx - B.x0) / (B.x1 - B.x0) * xmax), 2, xmax); upd();
    };
    cv.c.addEventListener("pointerdown", e => { drag = true; try { cv.c.setPointerCapture(e.pointerId); } catch (_) { } setFromX(e); });
    cv.c.addEventListener("pointermove", e => drag && setFromX(e));
    ["pointerup", "pointercancel"].forEach(t => cv.c.addEventListener(t, () => (drag = false)));
    upd();
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
