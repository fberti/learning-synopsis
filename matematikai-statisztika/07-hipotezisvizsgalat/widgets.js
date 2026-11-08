/* =========================================================
   Matematikai statisztika 7. fejezet – interaktív szemléltetések
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
     w1: tea-tasting (7.1-a), p-value-machine (7.3-a), errors-power (7.4-c)
     ================================================================== */
  const w1Box = (cv, l = 44, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Choose = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const w1P = p => (p >= 0.0001 ? fmt(p, 4) : p.toExponential(1).replace(".", ","));

  /* ------------------------------------------------------------------
     tea-tasting – a teát kóstoló hölgy
     ------------------------------------------------------------------ */
  W["tea-tasting"] = root => {
    header(root, "Kóstold meg! – a teát kóstoló hölgy kísérlete",
      "A gép titokban, véletlen sorrendben elkészíti a csészéket: a felük „tej előbb” (T), a felük „tea előbb”. Te nem látod, melyik melyik. Válaszd ki azokat, amelyeket T-nek gondolsz, aztán fedd fel őket! A gép kiszámolja, mennyire meglepő az eredményed, ha csak tippeltél.");
    const rnd = S.mulberry32(1935);
    let N = 8, truth = [], pick = new Set(), revealed = false, sims = [];
    const segN = segmented([4, 6, 8, 10, 12].map(v => [v, v + " csésze"]), N, v => { N = +v; newRound(); });
    const cupsEl = h("div", { style: "display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin:.7rem 0" });
    const msg = h("div", { class: "readout" });
    const revealBtn = btn("Felfedem", () => { if (pick.size === N / 2) { revealed = true; render(); } });
    root.append(h("div", { class: "controls" }, segN.el),
      cupsEl,
      h("div", { class: "controls" }, revealBtn, btn("Új kör", () => newRound()), btn("🎲 A gép tippel 1000-szer", () => simulate(1000)), btn("Ürít", () => { sims = []; render(); })),
      msg);
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(190, w * 0.32));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    function shuffleTruth() {
      const m = N / 2, a = Array(N).fill(false); for (let i = 0; i < m; i++) a[i] = true;
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
    function newRound() { truth = shuffleTruth(); pick = new Set(); revealed = false; sims = []; render(); }
    const exact = () => { const m = N / 2, tot = w1Choose(N, m); return Array.from({ length: m + 1 }, (_, k) => w1Choose(m, k) * w1Choose(m, m - k) / tot); };
    const pval = k => exact().slice(k).reduce((s, x) => s + x, 0);
    function simulate(R) {
      const m = N / 2;
      for (let r = 0; r < R; r++) {
        const idx = [...Array(N).keys()];
        for (let i = 0; i < m; i++) { const j = i + Math.floor(rnd() * (N - i)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        let k = 0; for (let i = 0; i < m; i++) if (truth[idx[i]]) k++;
        sims.push(k);
      }
      render();
    }
    function render() {
      const m = N / 2;
      cupsEl.replaceChildren(...truth.map((t, i) => {
        const on = pick.has(i);
        let bg = "var(--bg-soft)", bd = "var(--border)", lab = "?";
        if (on) { bg = "var(--accent-soft)"; bd = "var(--accent)"; }
        if (revealed) { lab = t ? "T" : "tea"; if (on) bd = t ? "var(--ok)" : "var(--bad)"; }
        const b = h("button", { type: "button", class: "btn", style: `min-width:3.6rem;height:3.6rem;border-radius:0 0 1.2rem 1.2rem;border:2px solid ${bd};background:${bg};font-weight:600`,
          onclick: () => { if (revealed) return; if (on) pick.delete(i); else if (pick.size < m) pick.add(i); render(); } }, "☕ " + lab);
        return b;
      }));
      revealBtn.disabled = pick.size !== m || revealed;
      if (!revealed) msg.innerHTML = `Válassz ki <b>${m}</b> csészét, amelyet „tej előbb”-nek gondolsz (eddig: ${pick.size}).`;
      else {
        const k = [...pick].filter(i => truth[i]).length, p = pval(k);
        msg.innerHTML = `Eltaláltál <b>${k}</b> T-csészét a ${m}-ből. Ha csak tippeltél volna, legalább ennyi találat esélye: <b>p = ${w1P(p)}</b>` +
          (p <= 0.05 ? " – 5%-os szinten szignifikáns: nehéz a véletlennel magyarázni." : " – ez tippeléssel is gyakran előfordul, nem szignifikáns.");
      }
      const ex = exact();
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 40, 14, 22, 34);
        const cnt = Array(m + 1).fill(0); sims.forEach(k => cnt[k]++);
        const emp = cnt.map(c => (sims.length ? c / sims.length : 0));
        const ymax = Math.max(...ex, ...emp) * 1.18;
        const { tx, ty } = axes(ctx, box, { xmin: -0.6, xmax: m + 0.6, ymin: 0, ymax, xticks: [...Array(m + 1).keys()], yticks: rangeTicks(0, ymax, 4), xfmt: v => String(v), xlabel: "eltalált T-csészék", ylabel: "valószínűség" });
        const bw = Math.min(46, (box.x1 - box.x0) / (m + 1) * 0.36);
        const kObs = revealed ? [...pick].filter(i => truth[i]).length : -1;
        ex.forEach((p, k) => {
          ctx.fillStyle = k >= kObs && kObs >= 0 ? css("--bad") : css("--setA"); ctx.globalAlpha = 0.8;
          ctx.fillRect(tx(k) - bw, ty(p), bw, ty(0) - ty(p));
          if (sims.length) { ctx.fillStyle = css("--setB"); ctx.fillRect(tx(k), ty(emp[k]), bw, ty(0) - ty(emp[k])); }
          ctx.globalAlpha = 1; ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(w1Choose(m, k) * w1Choose(m, m - k) + "/" + w1Choose(N, m), tx(k) - bw / 2, ty(p) - 2);
        });
      };
      cv.draw();
      statRow(statEl, [
        ["lehetséges választások", "$\\binom{" + N + "}{" + m + "}$ = " + w1Choose(N, m)],
        ["P(mind talál | tippel)", w1P(1 / w1Choose(N, m))],
        ["gépi tippelések", groupDigits(sims.length)],
        ["ebből mind talált", sims.length ? pct(sims.filter(k => k === m).length / sims.length, 2) : "–"]
      ]);
    }
    root.append(keyRow([["pontos eloszlás (ha csak tippel)", "--setA", "box"], ["a gép tippjei", "--setB", "box"], ["a te eredményed és a szélsőségesebbek (p-érték)", "--bad", "box"]]));
    newRound();
  };

  /* ------------------------------------------------------------------
     p-value-machine – p-érték: terület a H0-eloszlás szélén
     ------------------------------------------------------------------ */
  W["p-value-machine"] = root => {
    header(root, "p-érték-gép – mennyi a terület a szélén?",
      "A görbe a próbastatisztika eloszlása <b>ha $H_0$ igaz</b>. Húzd a megfigyelt értéket: az árnyékolt terület a p-érték. A szaggatott vonalak a választott $\\alpha$-hoz tartozó kritikus értékek.");
    let dist = "z", df = 9, obs = 2, side = "two", alpha = 0.05;
    const segD = segmented([["z", "standard normális"], ["t", "Student t"]], dist, v => { dist = v; dfRow.wrap.style.display = v === "t" ? "" : "none"; update(); });
    const dfRow = sliderRow("szabadságfok =", 1, 60, 1, df, v => String(v), v => { df = v; update(); });
    dfRow.wrap.style.display = "none";
    const obsRow = sliderRow("megfigyelt érték =", -4, 4, 0.01, obs, v => fmt(v, 2), v => { obs = v; update(); });
    const segS = segmented([["two", "kétoldali"], ["right", "jobboldali ($H_1$: nagyobb)"], ["left", "baloldali ($H_1$: kisebb)"]], side, v => { side = v; update(); });
    const segA = segmented([[0.1, "α = 10%"], [0.05, "α = 5%"], [0.01, "α = 1%"]], alpha, v => { alpha = +v; update(); });
    root.append(h("div", { class: "controls" }, segD.el, dfRow.wrap), h("div", { class: "controls" }, obsRow.wrap), h("div", { class: "controls" }, segS.el), h("div", { class: "controls" }, segA.el));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(220, w * 0.4));
    root.append(keyRow([["$H_0$ melletti eloszlás", "--accent"], ["p-érték (terület)", "--setB", "box"], ["kritikus érték(ek)", "--bad", "dash"], ["megfigyelt érték", "--text"]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const out = h("div", { class: "readout" }); root.append(out);
    const pdf = x => (dist === "z" ? S.normal.pdf(x) : S.t.pdf(x, df)), cdf = x => (dist === "z" ? S.normal.cdf(x) : S.t.cdf(x, df));
    const inv = p => (dist === "z" ? S.normal.inv(p) : S.t.inv(p, df));
    function update() {
      const p = side === "two" ? 2 * (1 - cdf(Math.abs(obs))) : side === "right" ? 1 - cdf(obs) : cdf(obs);
      const crit = side === "two" ? [inv(1 - alpha / 2)] : [inv(1 - alpha)];
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 20, 14, 14, 30);
        const ymax = pdf(0) * 1.12;
        const { tx, ty } = axes(ctx, box, { xmin: -4.5, xmax: 4.5, ymin: 0, ymax, xticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4], yticks: [], xfmt: v => String(v) });
        const shade = (a, b) => { ctx.beginPath(); ctx.moveTo(tx(a), ty(0)); for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; ctx.lineTo(tx(x), ty(pdf(x))); } ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); };
        ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.5;
        const a = Math.abs(obs);
        if (side === "two") { shade(a, 4.5); shade(-4.5, -a); } else if (side === "right") shade(obs, 4.5); else shade(-4.5, obs);
        ctx.globalAlpha = 1;
        curve(ctx, tx, ty, pdf, -4.5, 4.5, css("--accent"), 2.5);
        const c = crit[0];
        if (side === "two") { vline(ctx, tx(c), box.y0, box.y1, css("--bad"), true); vline(ctx, tx(-c), box.y0, box.y1, css("--bad"), true); }
        else vline(ctx, tx(side === "right" ? c : -c), box.y0, box.y1, css("--bad"), true);
        vline(ctx, tx(obs), box.y0, box.y1, css("--text"), false);
      };
      cv.draw();
      const cTxt = side === "two" ? "±" + fmt(crit[0], 3) : (side === "right" ? "" : "−") + fmt(crit[0], 3);
      statRow(statEl, [["p-érték", w1P(p)], ["kritikus érték", cTxt], ["$\\alpha$", pct(alpha, 0)]]);
      out.innerHTML = p <= alpha
        ? `$p = ${w1P(p).replace(",", "{,}")} \\le \\alpha$: a megfigyelt érték a kritikus tartományban van – <b>$H_0$-t ${pct(alpha, 0)}-os szinten elvetjük</b>.`
        : `$p = ${w1P(p).replace(",", "{,}")} \\gt \\alpha$: <b>$H_0$-t nem vetjük el</b> – az eredmény $H_0$ mellett nem elég meglepő.`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    update();
  };

  /* ------------------------------------------------------------------
     errors-power – α, β és próbaerő két eltolt eloszlással
     ------------------------------------------------------------------ */
  W["errors-power"] = root => {
    header(root, "Hibák és próbaerő – két haranggörbe",
      "Jobboldali próba: $H_0$: $\\mu = 100$. A bal görbe a mintaátlag eloszlása, ha $H_0$ igaz; a jobb, ha valójában $\\mu = 100 + \\delta$. Ha $\\bar x$ a kritikus érték fölé esik, elvetjük $H_0$-t. Figyeld, hogyan változik a három terület a csúszkákkal!");
    let delta = 5, sigma = 15, n = 25, alpha = 0.05;
    const rD = sliderRow("valódi hatás $\\delta$ =", 0, 15, 0.5, delta, v => fmt(v, 1), v => { delta = v; update(); });
    const rS = sliderRow("szórás $\\sigma$ (zaj) =", 5, 30, 1, sigma, v => String(v), v => { sigma = v; update(); });
    const rN = sliderRow("mintanagyság $n$ =", 1, 200, 1, n, v => String(v), v => { n = v; update(); });
    const segA = segmented([[0.1, "α = 10%"], [0.05, "α = 5%"], [0.01, "α = 1%"]], alpha, v => { alpha = +v; update(); });
    root.append(h("div", { class: "controls" }, rD.wrap), h("div", { class: "controls" }, rS.wrap), h("div", { class: "controls" }, rN.wrap), h("div", { class: "controls" }, segA.el));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(230, w * 0.42));
    root.append(keyRow([["$\\bar X$ eloszlása, ha $H_0$ igaz", "--setA"], ["ha $H_1$ igaz", "--setB"], ["$\\alpha$ (elsőfajú hiba)", "--bad", "box"], ["$\\beta$ (másodfajú hiba)", "--muted", "box"], ["erő", "--ok", "box"]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    function update() {
      const se = sigma / Math.sqrt(n), zc = S.normal.inv(1 - alpha), xc = 100 + zc * se, mu1 = 100 + delta;
      const beta = S.normal.cdf(xc, mu1, se), power = 1 - beta;
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 20, 14, 14, 30);
        const lo = 100 - 4 * se, hi = Math.max(mu1 + 4 * se, 100 + 4 * se);
        const ymax = S.normal.pdf(0, 0, se) * 1.15;
        const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax, xticks: rangeTicks(lo, hi, 7), yticks: [], xfmt: v => fmt(v, Math.abs(hi - lo) < 8 ? 1 : 0) });
        const shade = (f, a, b, col, al) => { if (b <= a) return; ctx.fillStyle = col; ctx.globalAlpha = al; ctx.beginPath(); ctx.moveTo(tx(a), ty(0)); for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; ctx.lineTo(tx(x), ty(f(x))); } ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
        const f0 = x => S.normal.pdf(x, 100, se), f1 = x => S.normal.pdf(x, mu1, se);
        shade(f1, lo, Math.min(xc, hi), css("--muted"), 0.35);
        shade(f1, xc, hi, css("--ok"), 0.3);
        shade(f0, xc, hi, css("--bad"), 0.55);
        curve(ctx, tx, ty, f0, lo, hi, css("--setA"), 2.5);
        if (delta > 0) curve(ctx, tx, ty, f1, lo, hi, css("--setB"), 2.5);
        vline(ctx, tx(xc), box.y0, box.y1, css("--text"), true);
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText("kritikus érték " + fmt(xc, 2), Math.min(tx(xc) + 4, box.x1 - 120), box.y0);
      };
      cv.draw();
      statRow(statEl, [
        ["$\\mathrm{SE} = \\sigma/\\sqrt n$", fmt(se, 2)],
        ["kritikus érték", fmt(xc, 2)],
        ["$\\alpha$", pct(alpha, 0)],
        ["$\\beta$", fmt(delta > 0 ? beta : 1 - alpha, 3)],
        ["erő $1-\\beta$", delta > 0 ? fmt(power, 3) : "= α"],
        ["Cohen-féle $d = \\delta/\\sigma$", fmt(delta / sigma, 2)]
      ]);
    }
    update();
  };

  /* ==================================================================
     w2: binom-test (7.2-a), p-dance (7.3-c), permutation-test (7.6-b),
         p-hacking (7.7-a)
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
  const w2Math = (el, html) => { if (el.innerHTML !== html) { el.innerHTML = html; window.Synopsis && Synopsis.renderMath(el); } };
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
  function w2Tag(ctx, s, x, y, color, align = "left") {
    const tw = ctx.measureText(s).width, X = align === "right" ? x - tw : align === "center" ? x - tw / 2 : x;
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
  /* p-érték négy tizedesre (a binomiális példa formátuma), 0,0001 alatt „< 0,0001” */
  const w2P4 = p => (p >= 0.99995 ? "1" : p < 0.0001 ? "< 0,0001" : fmt(p, 4));
  /* „p = …” vagy „p < …” */
  const w2PEq = (p, f = w2P) => { const s = f(p); return s[0] === "<" ? "p " + s : "p = " + s; };
  /* névelő: a / az */
  const w2Az = w => (/^[aáeéiíoóöőuúüű]/i.test(w) ? "az" : "a");
  /* kétmintás t-próba egyenlő szórással: {t, df, p (kétoldali)} */
  function w2TTest(x, y) {
    const n1 = x.length, n2 = y.length;
    let a = 0, b = 0; for (const v of x) a += v; for (const v of y) b += v;
    const m1 = a / n1, m2 = b / n2;
    let s1 = 0, s2 = 0; for (const v of x) s1 += (v - m1) ** 2; for (const v of y) s2 += (v - m2) ** 2;
    const df = n1 + n2 - 2, sp2 = (s1 + s2) / df, t = (m1 - m2) / Math.sqrt(sp2 * (1 / n1 + 1 / n2));
    return { t, df, p: Math.min(1, 2 * S.t.cdf(-Math.abs(t), df)) };
  }
  /* egy kétcsoportos kísérlet N(0,1) vs. N(d,1), csoportonként n fő → kétoldali p */
  function w2Exp(n, d, rnd, buf) {
    const x = buf[0], y = buf[1];
    for (let i = 0; i < n; i++) { x[i] = S.rnorm(rnd); y[i] = d + S.rnorm(rnd); }
    return w2TTest(y.subarray(0, n), x.subarray(0, n)).p;
  }
  const w2Buf = n => [new Float64Array(n), new Float64Array(n)];
  /* logaritmikus p-tengely feliratai */
  const w2PTicks = [0.0001, 0.001, 0.01, 0.05, 0.1, 1];
  const w2PLab = v => (v === 1 ? "1" : w2Num(v, 4));

  /* ------------------------------------------------------------------
     7.2-a  Cinkelt-e az érme? – kritikus tartomány
     ------------------------------------------------------------------ */
  W["binom-test"] = root => {
    header(root, "Cinkelt-e az érme? – kritikus tartomány",
      w2R`$H_0$: az érme szabályos ($p = 0{,}5$). Dobj $n$-szer, és számold meg a fejeket ($X$). Ha $X$ a kritikus tartományba esik, $H_0$-t elvetjük.`);
    let n = 100, alpha = 0.05, side = "two", k = 60, seed = 72, rnd = S.mulberry32(seed), runs = 0, rej = 0;
    const ACC = { 10: "10-et", 20: "20-at", 50: "50-et", 100: "100-at" };
    const nSeg = segmented([10, 20, 50, 100].map(v => [v, String(v)]), n, v => {
      const old = n; n = +v; k = Math.round(k * n / old); kR.input.max = n; kR.input.value = k; kR.out.textContent = k;
      throwB.textContent = `Dobj ${ACC[n]} egy szabályos érmével`; tally(true); upd();
    });
    const aSeg = segmented([[0.1, "10%"], [0.05, "5%"], [0.01, "1%"]], alpha, v => { alpha = +v; tally(true); upd(); });
    const sSeg = segmented([["two", w2R`kétoldali ($p \ne 0{,}5$)`], ["right", w2R`jobboldali ($p \gt 0{,}5$)`], ["left", w2R`baloldali ($p \lt 0{,}5$)`]], side,
      v => { side = v; tally(true); upd(); });
    const kR = sliderRow("megfigyelt fejek száma: $k =$", 0, n, 1, k, v => v, v => { k = v; upd(); });
    const throwB = btn(`Dobj ${ACC[n]} egy szabályos érmével`, () => toss(1), "btn primary");
    root.append(w2Ctl(w2Lab("dobások száma $n$:"), nSeg.el), w2Ctl(w2Lab("szignifikanciaszint $\\alpha$:"), aSeg.el),
      w2Ctl(w2Lab("$H_1$:"), sSeg.el), w2Ctl(kR.wrap),
      w2Ctl(throwB, btn("+1 000 sorozat", () => toss(1000)), btn("Újra", () => { seed++; rnd = S.mulberry32(seed); tally(true); upd(); })));
    const cv = tallCanvas(root, w => w2Clamp(w * 0.42, 230, 300));
    root.append(keyRow([["kritikus tartomány ($H_0$-t elvetjük)", "--bad", "box"], ["elfogadási tartomány", "--setA", "box"],
      ["megfigyelt $k$", "--text", "line"], ["legalább ilyen szélsőséges értékek (ezek adják a p-értéket)", "--setB", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["kritikus tartomány", "tényleges elsőfajú hiba", "névleges $\\alpha$", "p-érték"]);
    const dec = h("div", { class: "readout" }); root.append(dec);
    const tal = w2Note(""); root.append(tal);

    /* pontos farokvalószínűségek: L[i] = P(X ≤ i), U[i] = P(X ≥ i) (mindkettő a saját végéről összegezve) */
    function tails() {
      const pm = []; for (let i = 0; i <= n; i++) pm.push(S.binom.pmf(i, n, 0.5));
      const L = [], U = new Array(n + 2).fill(0);
      pm.reduce((s, v, i) => (L[i] = s + v), 0);
      for (let i = n; i >= 0; i--) U[i] = U[i + 1] + pm[i];
      return { pm, L, U };
    }
    /* kritikus tartomány: X ≤ lo és/vagy X ≥ hi, a farok(ok) valószínűsége legfeljebb α (kétoldalinál α/2 farkanként) */
    function crit(T) {
      const a = side === "two" ? alpha / 2 : alpha, eps = 1e-12;
      let lo = -1, hi = n + 1;
      if (side !== "right") while (lo + 1 <= n && T.L[lo + 1] <= a + eps) lo++;
      if (side !== "left") while (hi - 1 >= 0 && T.U[hi - 1] <= a + eps) hi--;
      const size = (lo >= 0 ? T.L[lo] : 0) + (hi <= n ? T.U[hi] : 0);
      return { lo, hi, size };
    }
    const inCrit = (c, x) => x <= c.lo || x >= c.hi;
    function pval(T, x) {
      if (side === "right") return T.U[x];
      if (side === "left") return T.L[x];
      return Math.min(1, 2 * Math.min(T.U[x], T.L[x]));
    }
    /* a p-értékbe számító értékek (legalább olyan szélsőségesek, mint k) */
    function extreme(x) {
      if (side === "right") return i => i >= x;
      if (side === "left") return i => i <= x;
      const dd = Math.abs(x - n / 2); return i => Math.abs(i - n / 2) >= dd - 1e-9;
    }
    function toss(m) {
      const T = tails(), c = crit(T);
      for (let j = 0; j < m; j++) {
        let s = 0; for (let i = 0; i < n; i++) if (rnd() < 0.5) s++;
        k = s; runs++; if (inCrit(c, s)) rej++;
      }
      kR.input.value = k; kR.out.textContent = k;
      upd();
    }
    function tally(reset) { if (reset) { runs = 0; rej = 0; } }
    const aTxt = () => w2Num(100 * alpha, 0) + "%";
    function critTex(c) {
      const parts = [];
      if (c.lo >= 0) parts.push(`$X \\le ${c.lo}$`);
      if (c.hi <= n) parts.push(`$X \\ge ${c.hi}$`);
      return parts.length ? parts.join(" vagy ") : "üres";
    }
    function upd() {
      const T = tails(), c = crit(T), p = pval(T, k), rejK = inCrit(c, k);
      setS([critTex(c), pct(c.size, 2), aTxt(), w2P4(p)]);
      const cmp = p < 0.0001 ? "<" : p <= alpha ? "≤" : ">";
      w2Math(dec, `<b>${w2PEq(p, w2P4)} ${cmp} α = ${w2Num(alpha, 2)}</b> → <span style="color:var(${rejK ? "--bad" : "--ok"});font-weight:600">$H_0$-t ${aTxt()}-on ${rejK ? "elvetjük" : "nem vetjük el"}</span>`
        + ` (a $k = ${k}$ ${rejK ? "" : "nem "}esik a kritikus tartományba).`);
      tal.innerHTML = runs
        ? `Szabályos érmével eddig ${groupDigits(runs)} sorozat, ebből ${groupDigits(rej)}-szor vetettük el tévesen $H_0$-t: ${pct(rej / runs, 2)} (a tényleges elsőfajú hiba ${pct(c.size, 2)}).`
        : "Diszkrét eloszlásnál a kritikus tartomány valószínűsége általában kisebb a névleges α-nál: ennyi a tényleges elsőfajú hiba.";
      window.Synopsis && Synopsis.renderMath(tal);
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, T = tails(), c = crit(T), ext = extreme(k);
      ctx.clearRect(0, 0, w, H);
      const sdv = Math.sqrt(n) / 2;
      const xlo = Math.min(k, Math.max(0, Math.floor(n / 2 - 5 * sdv))), xhi = Math.max(k, Math.min(n, Math.ceil(n / 2 + 5 * sdv)));
      const ym = Math.max(...T.pm) * 1.15;
      const box = { x0: 44, y0: 22, x1: w - 10, y1: H - 40 };
      const yt = rangeTicks(0, ym, 4).filter(v => v > 0 && v < ym);
      const { tx, ty } = w2Axes(ctx, box, { xmin: xlo - 0.6, xmax: xhi + 0.6, ymin: 0, ymax: ym, yticks: yt, yfmt: v => w2Num(v, 3), ylabel: "P(X = x)" });
      const bw = Math.max(1, (tx(1) - tx(0)) * 0.78);
      const cA = css("--setA"), cBad = css("--bad"), cB = css("--setB");
      ctx.save();
      for (let i = xlo; i <= xhi; i++) {
        ctx.globalAlpha = inCrit(c, i) ? 0.85 : 0.6; ctx.fillStyle = inCrit(c, i) ? cBad : cA;
        const y = ty(T.pm[i]); ctx.fillRect(tx(i) - bw / 2, y, bw, ty(0) - y);
      }
      ctx.restore();
      // a p-értékbe számító értékek: sáv a tengely alatt
      ctx.save(); ctx.fillStyle = cB;
      for (let i = xlo; i <= xhi; i++) if (ext(i)) ctx.fillRect(tx(i - 0.5), box.y1 + 2, tx(i + 0.5) - tx(i - 0.5) + 0.3, 5);
      ctx.restore();
      // x-feliratok
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textBaseline = "top";
      const step = rangeTicks(xlo, xhi, w < 500 ? 6 : 12).filter(v => Number.isInteger(v));
      step.forEach(v => w2TextIn(ctx, String(v), tx(v), box.y1 + 11, box.x0, box.x1));
      ctx.textAlign = "right"; ctx.fillText("fejek száma x", box.x1, box.y1 + 25);
      // megfigyelt k
      vline(ctx, tx(k), box.y0 - 4, box.y1, css("--text"));
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, "k = " + k, tx(k), box.y0 - 6, 2, w - 2);
      // a farkak valószínűsége
      w2Font(ctx, 10, true);
      if (c.lo >= xlo) w2Tag(ctx, pct(T.L[c.lo], 2), tx(c.lo) - 2, ty(0) - 34 - (w < 500 ? 0 : 0), cBad, "right");
      if (c.hi <= xhi) w2Tag(ctx, pct(T.U[c.hi], 2), tx(c.hi) + 2, ty(0) - 34, cBad, "left");
    };
    upd();
  };

  /* ------------------------------------------------------------------
     7.3-c  A táncoló p-érték
     ------------------------------------------------------------------ */
  W["p-dance"] = root => {
    header(root, "A táncoló p-érték",
      w2R`Két csoport, csoportonként $n$ fő; a kezelt csoport átlaga $d$ szórásnyival nagyobb. Minden ismétlés új mintát vesz, és kétmintás $t$-próbát számol (kétoldali p-érték).`);
    const SEED0 = 73;
    let n = 32, d = 0.5, seed = SEED0, rnd, ps = [], buf = w2Buf(128);
    const nSeg = segmented([16, 32, 64, 128].map(v => [v, String(v)]), n, v => { n = +v; reset(); });
    const dSeg = segmented([0, 0.2, 0.5, 0.8].map(v => [v, w2Num(v, 1)]), d, v => { d = +v; reset(); });
    root.append(w2Ctl(w2Lab("csoportlétszám $n$:"), nSeg.el), w2Ctl(w2Lab("valódi hatás $d$:"), dSeg.el),
      w2Ctl(btn("1 ismétlés", () => run(1), "btn primary"), btn("+25", () => run(25)), btn("+1 000", () => run(1000)),
        btn("Ürít", () => { seed++; rnd = S.mulberry32(seed); ps = []; draw(); })));
    const cv = tallCanvas(root, w => (w < 500 ? 330 : 350));
    root.append(keyRow([["p < 0,05", "--ok", "box"], ["p ≥ 0,05", "--muted", "box"], ["α = 0,05", "--bad", "dash"],
      ["10–50–90%-os percentilis (az összes ismétlésből)", "--accent", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["ismétlések", "p < 0,05 (szimulált erő)", "elméleti erő (normális közelítés)", "a p-értékek 10–50–90%-os percentilise"]);
    root.append(w2Note("Ugyanaz a kísérlet, ugyanaz a valódi hatás – a p-érték mégis 0,001 és 0,5 között ugrál. Az ábrán az utolsó 25 ismétlés látszik, a legújabb legalul; a tengely logaritmikus."));

    const power = () => { const m = d * Math.sqrt(n / 2); return 1 - Phi(1.96 - m) + Phi(-1.96 - m); };
    function reset() { seed = SEED0; rnd = S.mulberry32(seed); ps = []; run(25); }
    function run(m) { for (let j = 0; j < m; j++) ps.push(w2Exp(n, d, rnd, buf)); draw(); }
    function draw() {
      const N = ps.length, hit = ps.filter(p => p < 0.05).length;
      setS.label(1, d === 0 ? "p < 0,05 (elsőfajú hiba)" : "p < 0,05 (szimulált erő)");
      setS.label(2, d === 0 ? "elméleti arány (= α)" : "elméleti erő (normális közelítés)");
      setS([groupDigits(N), N ? `${groupDigits(hit)} / ${groupDigits(N)} = ${pct(hit / N, 1)}` : "–", pct(power(), 1),
        N >= 2 ? [0.1, 0.5, 0.9].map(q => w2P(quant(ps, q))).join(" · ") : "–"]);
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h;
      ctx.clearRect(0, 0, w, H);
      const lg = Math.log10, LO = -4;
      const box = { x0: 30, y0: 30, x1: w - 14, y1: H - 34 };
      const { tx } = axes(ctx, box, { xmin: LO, xmax: 0, ymin: 0, ymax: 1, xticks: w2PTicks.filter(v => w >= 500 || v !== 0.1).map(lg), xfmt: v => w2PLab(10 ** v), xlabel: "p-érték" });
      const X = p => tx(Math.max(LO, lg(Math.max(p, 1e-300))));
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      w2PTicks.forEach(v => { ctx.beginPath(); ctx.moveTo(tx(lg(v)), box.y0); ctx.lineTo(tx(lg(v)), box.y1); ctx.stroke(); });
      ctx.restore();
      vline(ctx, tx(lg(0.05)), box.y0 - 2, box.y1, css("--bad"), true);
      const show = ps.slice(-25), R = 25, rowH = (box.y1 - box.y0 - 6) / R, y0 = box.y0 + 3, off = R - show.length;
      const yOf = i => y0 + (off + i + 0.5) * rowH;
      // összekötő vonal (a „tánc”)
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.globalAlpha = 0.45; ctx.lineWidth = 1; ctx.beginPath();
      show.forEach((p, i) => (i ? ctx.lineTo(X(p), yOf(i)) : ctx.moveTo(X(p), yOf(i))));
      ctx.stroke(); ctx.restore();
      const cOk = css("--ok"), cMu = css("--muted");
      w2Font(ctx, 9); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      const first = ps.length - show.length;
      show.forEach((p, i) => {
        const x = X(p), y = yOf(i);
        w2Dot(ctx, x, y, p < 0.05 ? 4.5 : 4, p < 0.05 ? cOk : cMu);
        if (p < 10 ** LO) { ctx.fillStyle = cOk; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x - 5, y - 3.5); ctx.lineTo(x - 5, y + 3.5); ctx.fill(); }
        if ((first + i + 1) % 5 === 0 || i === show.length - 1) { ctx.fillStyle = cMu; ctx.textAlign = "right"; ctx.fillText(String(first + i + 1), box.x0 - 4, y); }
      });
      if (show.length) {
        const p = show[show.length - 1], x = X(p), y = yOf(show.length - 1), right = x < (box.x0 + box.x1) / 2;
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
        w2Font(ctx, 11, true); w2Tag(ctx, w2PEq(p), x + (right ? 12 : -12), y, css("--text"), right ? "left" : "right");
      } else {
        ctx.fillStyle = cMu; w2Font(ctx, 12); w2TextIn(ctx, "Indíts egy ismétlést!", (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2, box.x0, box.x1);
      }
      // percentilisek az összes ismétlésből
      ctx.fillStyle = css("--muted"); w2Font(ctx, 10); ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("#", 4, box.y0 - 12);
      if (ps.length >= 2) {
        const cA = css("--accent"); w2Font(ctx, 10, true);
        const qs = [0.1, 0.5, 0.9].map(q => [q, X(quant(ps, q))]);
        qs.forEach(([q, x], j) => {
          ctx.fillStyle = cA; ctx.beginPath(); ctx.moveTo(x, box.y0 - 2); ctx.lineTo(x - 5, box.y0 - 10); ctx.lineTo(x + 5, box.y0 - 10); ctx.fill();
          ctx.textBaseline = "bottom";
          const prev = j ? qs[j - 1][1] : -1e9;
          w2TextIn(ctx, Math.round(100 * q) + "%", x, box.y0 - (x - prev < 24 ? 21 : 11), box.x0 - 20, box.x1);
        });
      }
    };
    reset();
  };

  /* ------------------------------------------------------------------
     7.6-b  Permutációs próba
     ------------------------------------------------------------------ */
  W["permutation-test"] = root => {
    header(root, "Permutációs próba: keverjük össze a címkéket!",
      w2R`Ha $H_0$ igaz (a módszer nem számít), a címkék („A” és „B”) felcserélhetők. Keverd össze őket véletlenül, és nézd meg, milyen gyakran jön ki legalább akkora különbség, mint a valódi.`);
    const SETS = {
      small: { A: [7, 9, 11], B: [3, 5, 4], nA: "új módszer", nB: "régi módszer" },
      big: { A: [72, 75, 78, 80, 81, 83, 85, 90], B: [65, 68, 70, 72, 74, 76, 79, 82], nA: "A", nB: "B" }
    };
    const SEED0 = 76;
    let key = "small", seed = SEED0, rnd, D, lab, prevLab, sim, exact, view = "sim", last = null;
    const dSeg = segmented([["small", "kicsi (3 + 3)"], ["big", "nagyobb (8 + 8)"]], key, v => { key = v; seed = SEED0; init(); });
    const shB = btn("1 keverés", () => shuffle(1), "btn primary");
    const exB = btn("", () => doExact());
    root.append(w2Ctl(w2Lab("adatok:"), dSeg.el),
      w2Ctl(shB, btn("+1 000 keverés", () => shuffle(1000)), exB, btn("Ürít", () => { seed++; init(); })));
    const rows = h("div", { style: "margin:.6rem 0 .2rem;display:grid;grid-template-columns:auto 1fr auto;gap:.35rem .6rem;align-items:center" });
    root.append(rows);
    root.append(keyRow([["eredetileg A", "--setA", "box"], ["eredetileg B", "--setB", "box"]]));
    const diffEl = h("div", { class: "readout" }); root.append(diffEl);
    const cv = tallCanvas(root, w => w2Clamp(w * 0.4, 220, 290));
    root.append(keyRow([["különbségek a keverésekből", "--muted", "box"], ["legalább akkora, mint a megfigyelt (egyoldali p)", "--bad", "box"],
      ["a kétoldali p-hez még ezek is", "--bad", "dash"], ["megfigyelt különbség", "--text", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["megfigyelt különbség", "keverések", "egyoldali p (≥ megfigyelt)", "kétoldali p (|különbség| ≥ |megfigyelt|)"]);
    const tNote = w2Note(""); root.append(tNote);

    const sumOf = (vals, lb, g) => vals.reduce((s, v, i) => s + (lb[i] === g ? v : 0), 0);
    /* a különbség csak az A-csoport összegétől függ: d(sA) = sA/nA − (T − sA)/nB */
    const diffOf = sA => sA / D.nA - (D.T - sA) / D.nB;
    function init() {
      const s = SETS[key];
      D = { vals: [...s.A, ...s.B], orig: [...s.A.map(() => 0), ...s.B.map(() => 1)], nA: s.A.length, nB: s.B.length, names: [s.nA, s.nB] };
      D.T = D.vals.reduce((a, b) => a + b, 0);
      D.sObs = s.A.reduce((a, b) => a + b, 0);
      D.obs = diffOf(D.sObs);
      const sv = D.vals.slice().sort((a, b) => a - b);
      D.sMin = sv.slice(0, D.nA).reduce((a, b) => a + b, 0); D.sMax = sv.slice(-D.nA).reduce((a, b) => a + b, 0);
      D.nPart = Math.round(Math.exp(S.gammaln(D.nA + D.nB + 1) - S.gammaln(D.nA + 1) - S.gammaln(D.nB + 1)));
      exB.textContent = key === "small" ? `Mind a ${D.nPart} felsorolása` : `Pontos (${groupDigits(D.nPart)} felosztás)`;
      rnd = S.mulberry32(seed); lab = D.orig.slice(); prevLab = null; last = null;
      sim = { counts: new Map(), N: 0 }; exact = null; view = "sim";
      const t = w2TTest(SETS[key].A, SETS[key].B), p1 = S.t.cdf(-Math.abs(t.t), t.df);
      tNote.innerHTML = `Összevetésül a kétmintás $t$-próba (egyenlő szórással, $t = ${fmt(t.t, 2).replace(",", "{,}")}$, $\\mathrm{df} = ${t.df}$): egyoldali p = ${fmt(p1, 4)}, kétoldali p = ${fmt(2 * p1, 4)}. A permutációs próba nem tételez fel normalitást.`;
      window.Synopsis && Synopsis.renderMath(tNote);
      renderRows(); upd();
    }
    function shuffle(m) {
      if (view === "exact") view = "sim";
      const N = D.vals.length, idx = new Int32Array(N);
      prevLab = lab.slice();
      for (let r = 0; r < m; r++) {
        for (let i = 0; i < N; i++) idx[i] = i;
        for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
        let sA = 0; for (let i = 0; i < D.nA; i++) sA += D.vals[idx[i]];
        sim.counts.set(sA, (sim.counts.get(sA) || 0) + 1); sim.N++;
        if (r === m - 1) { lab = new Array(N).fill(1); for (let i = 0; i < D.nA; i++) lab[idx[i]] = 0; last = sA; }
      }
      renderRows(); upd();
    }
    function doExact() {
      if (!exact) {
        const counts = new Map(), v = D.vals, N = v.length, nA = D.nA;
        const rec = (start, left, s) => {
          if (!left) { counts.set(s, (counts.get(s) || 0) + 1); return; }
          for (let i = start; i <= N - left; i++) rec(i + 1, left - 1, s + v[i]);
        };
        rec(0, nA, 0);
        exact = { counts, N: D.nPart };
      }
      view = "exact"; upd();
    }
    function renderRows() {
      const mk = g => {
        const idx = D.vals.map((v, i) => i).filter(i => lab[i] === g).sort((a, b) => D.vals[a] - D.vals[b]);
        const chips = h("div", { style: "display:flex;flex-wrap:wrap;gap:.25rem" }, ...idx.map(i => {
          const moved = prevLab && prevLab[i] !== lab[i], c = D.orig[i] ? "--setB" : "--setA";
          const e = h("span", { style: `display:inline-flex;align-items:center;justify-content:center;min-width:1.85rem;height:1.85rem;padding:0 .2rem;border-radius:999px;`
            + `font:600 .85rem var(--mono);background:color-mix(in srgb, var(${c}) 28%, var(--card));border:2px solid var(${c});color:var(--text);`
            + (moved ? "box-shadow:0 0 0 2px var(--accent)" : "") }, String(D.vals[i]));
          if (moved && e.animate) e.animate([{ transform: "scale(.4)", opacity: 0.2 }, { transform: "scale(1)", opacity: 1 }], { duration: 380, easing: "ease-out" });
          return e;
        }));
        const m = mean(idx.map(i => D.vals[i]));
        return [h("span", { style: "font-size:.88rem;font-weight:600;color:var(--muted)" }, (g ? "B" : "A") + (key === "small" ? ` (${D.names[g]})` : "")),
          chips, h("span", { style: "font:.85rem var(--mono);color:var(--muted);white-space:nowrap" }, "átlag " + fmt(m, 2))];
      };
      rows.replaceChildren(...mk(0), ...mk(1));
    }
    const dTxt = x => w2F(x, 2);
    /* p-értékek a kiválasztott nézetből */
    function pv(V) {
      let one = 0, two = 0;
      for (const [sA, c] of V.counts) {
        if (sA >= D.sObs) one += c;
        if (Math.abs(diffOf(sA)) >= Math.abs(D.obs) - 1e-9) two += c;
      }
      return { one, two };
    }
    function upd() {
      const V = view === "exact" ? exact : sim, P = pv(V);
      const isOrig = lab.every((g, i) => g === D.orig[i]);
      let txt = `megfigyelt különbség: $\\bar x_A - \\bar x_B = ${fmt(D.obs, 2).replace(",", "{,}")}$`;
      if (view === "exact") txt += ` · pontos eloszlás: mind a ${groupDigits(D.nPart)} felosztás`;
      else if (last != null && !isOrig) txt += ` · utolsó keverés: <b>${dTxt(diffOf(last))}</b>`;
      w2Math(diffEl, txt);
      setS.label(1, view === "exact" ? "felosztások (pontos)" : "keverések");
      const pS = (c, N) => (N ? `${fmt(c / N, 4)}` + (view === "exact" ? ` = ${groupDigits(c)} / ${groupDigits(N)}` : "") : "–");
      setS([dTxt(D.obs), groupDigits(V.N), pS(P.one, V.N), pS(P.two, V.N)]);
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, V = view === "exact" ? exact : sim;
      ctx.clearRect(0, 0, w, H);
      const xlo = diffOf(D.sMin), xhi = diffOf(D.sMax), step = 1 / D.nA + 1 / D.nB, pad = step * 1.2;
      let ym = 1; for (const c of V.counts.values()) ym = Math.max(ym, c);
      ym *= 1.15;
      const box = { x0: 44, y0: 22, x1: w - 10, y1: H - 36 };
      const yt = rangeTicks(0, ym, 4).filter(v => v > 0 && v < ym && Number.isInteger(v));
      const { tx, ty } = w2Axes(ctx, box, { xmin: xlo - pad, xmax: xhi + pad, ymin: 0, ymax: ym, yticks: yt, yfmt: v => groupDigits(v),
        xticks: rangeTicks(xlo, xhi, w < 500 ? 6 : 10), xfmt: v => w2Num(v, 2), xlabel: "átlagok különbsége (A − B)", ylabel: "db" });
      const bw = Math.max(1.5, (tx(step) - tx(0)) * 0.82), cBad = css("--bad"), cMu = css("--muted");
      for (const [sA, c] of V.counts) {
        const x = diffOf(sA), oneS = sA >= D.sObs, twoS = !oneS && Math.abs(x) >= Math.abs(D.obs) - 1e-9;
        ctx.save(); ctx.globalAlpha = oneS ? 0.85 : twoS ? 0.35 : 0.55; ctx.fillStyle = oneS || twoS ? cBad : cMu;
        const y = ty(c); ctx.fillRect(tx(x) - bw / 2, y, bw, ty(0) - y); ctx.restore();
        if (twoS) { ctx.save(); ctx.strokeStyle = cBad; ctx.setLineDash([3, 2]); ctx.lineWidth = 1; ctx.strokeRect(tx(x) - bw / 2 + 0.5, y + 0.5, bw - 1, ty(0) - y - 1); ctx.restore(); }
      }
      vline(ctx, tx(D.obs), box.y0 - 4, box.y1, css("--text"));
      vline(ctx, tx(-D.obs), box.y0 + 8, box.y1, cBad, true);
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, "megfigyelt: " + dTxt(D.obs), tx(D.obs), box.y0 - 6, 2, w - 2);
      if (view === "sim" && last != null && sim.N) {
        const x = tx(diffOf(last)); ctx.fillStyle = css("--accent");
        ctx.beginPath(); ctx.moveTo(x, box.y1 - 1); ctx.lineTo(x - 5, box.y1 + 8); ctx.lineTo(x + 5, box.y1 + 8); ctx.fill();
      }
      if (!V.N) { ctx.fillStyle = cMu; w2Font(ctx, 12); w2TextIn(ctx, "Keverj, vagy kérd a pontos eloszlást!", (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2, box.x0, box.x1); }
    };
    init();
  };

  /* ------------------------------------------------------------------
     7.7-a  20 kísérlet, egyik sem hat – mégis találat
     ------------------------------------------------------------------ */
  W["p-hacking"] = root => {
    header(root, "20 kísérlet, egyik sem hat – mégis találat",
      w2R`Egy kutató 20 ízű zselécukrot vizsgál: hat-e a pattanásokra? Valójában <b>egyik sem hat</b>: minden kísérletben két 30 fős csoport, mindkettő $N(0;1)$, kétmintás $t$-próba.`);
    const FL = ["citrom", "eper", "menta", "málna", "narancs", "ananász", "banán", "kókusz", "vanília", "csoki",
      "karamell", "meggy", "barack", "szőlő", "alma", "körte", "áfonya", "mangó", "kivi", "dinnye"];
    const K = 20, NG = 30, SEED0 = 77;
    let seed = SEED0, rnd, studies = [], bonf = false, buf = w2Buf(NG);
    const thr = () => (bonf ? 0.05 / K : 0.05);
    const bSeg = segmented([["0", w2R`nincs korrekció ($\alpha = 0{,}05$)`], ["1", w2R`Bonferroni ($0{,}05/20 = 0{,}0025$)`]], "0", v => { bonf = v === "1"; upd(); });
    root.append(w2Ctl(btn("Új kutatás", () => run(1), "btn primary"), btn("+100 kutatás", () => run(100)), btn("Újra", () => { seed++; reset(); })),
      w2Ctl(w2Lab("küszöb:"), bSeg.el));
    const head = h("div", { class: "readout", style: "min-height:1.4em" }); root.append(head);
    const cv = tallCanvas(root, w => (w < 500 ? 290 : 310));
    root.append(keyRow([["találat (p a küszöb alatt)", "--bad", "box"], ["nem szignifikáns", "--muted", "box"], ["küszöb", "--bad", "dash"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["találat ebben a kutatásban", "kutatások", "kutatások legalább 1 találattal", "ugyanez elméletileg", "találatok átlagos száma"]);
    root.append(w2Note("Ha elég sok mindent kipróbálsz, a véletlen is „felfedez” valamit. Az oszlop annál magasabb, minél kisebb a p-érték (logaritmikus tengely)."));

    function run(m) { for (let j = 0; j < m; j++) { const a = new Float64Array(K); for (let i = 0; i < K; i++) a[i] = w2Exp(NG, 0, rnd, buf); studies.push(a); } upd(); }
    function reset() { rnd = S.mulberry32(seed); studies = []; run(1); }
    function upd() {
      const t = thr(), cur = studies[studies.length - 1], hits = [];
      cur.forEach((p, i) => p < t && hits.push(i));
      let any = 0, tot = 0;
      for (const s of studies) { let c = 0; for (const p of s) if (p < t) c++; tot += c; if (c) any++; }
      const N = studies.length;
      head.innerHTML = hits.length
        ? hits.map(i => `<b style="color:var(--bad)">TALÁLAT!</b> – ${w2Az(FL[i])} ${FL[i]} íz hat (${w2PEq(cur[i])})`).join("<br>")
        : "Ebben a kutatásban egyik íz sem lépte át a küszöböt.";
      setS([String(hits.length), groupDigits(N), N ? `${groupDigits(any)} / ${groupDigits(N)} = ${pct(any / N, 1)}` : "–",
        pct(1 - (1 - t) ** K, 1), w2F(tot / N, 2) + ` (elm. ${w2Num(K * t, 2)})`]);
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, cur = studies[studies.length - 1], t = thr();
      ctx.clearRect(0, 0, w, H);
      const narrow = w < 500, YM = 4;
      const box = { x0: 46, y0: 16, x1: w - 8, y1: H - (narrow ? 58 : 64) };
      const yT = [1, 0.1, 0.01, 0.001, 0.0001];
      const { ty } = w2Axes(ctx, box, { xmin: 0, xmax: K, ymin: 0, ymax: YM, yticks: yT.map(v => -Math.log10(v)), yfmt: v => w2PLab(10 ** -v), ylabel: "p-érték" });
      const cw = (box.x1 - box.x0) / K, bw = cw * 0.66, cBad = css("--bad"), cMu = css("--muted");
      cur.forEach((p, i) => {
        const v = Math.min(YM, -Math.log10(p)), hit = p < t, x = box.x0 + (i + 0.5) * cw;
        ctx.save(); ctx.globalAlpha = hit ? 0.85 : 0.5; ctx.fillStyle = hit ? cBad : cMu;
        ctx.fillRect(x - bw / 2, ty(v), bw, ty(0) - ty(v)); ctx.restore();
        if (hit) { ctx.fillStyle = cBad; w2Font(ctx, narrow ? 9 : 10, true); ctx.textBaseline = "bottom"; w2TextIn(ctx, w2P(p), x, ty(v) - 2, box.x0, box.x1); }
        ctx.save(); ctx.translate(x, box.y1 + 5); ctx.rotate(-Math.PI / 2.6);
        ctx.fillStyle = hit ? cBad : css("--muted"); w2Font(ctx, narrow ? 9.5 : 11, hit); ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(FL[i], 0, 0); ctx.restore();
      });
      const yt = ty(-Math.log10(t));
      ctx.save(); ctx.strokeStyle = cBad; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(box.x0, yt); ctx.lineTo(box.x1, yt); ctx.stroke(); ctx.restore();
      ctx.fillStyle = cBad; w2Font(ctx, 10, true);
      w2Tag(ctx, bonf ? "küszöb: 0,0025 (Bonferroni)" : "küszöb: α = 0,05", box.x1 - 2, yt - 9, cBad, "right");
    };
    reset();
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
