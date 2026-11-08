/* =========================================================
   Matematikai statisztika 5. fejezet – interaktív szemléltetések
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


  /* ==================================================================
     w1: sample-enum (5.1-b), sqrt-n (5.2-c), sampling-dist (5.3-c)
     ================================================================== */
  const w1Clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const w1Box = (cv, l = 44, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Key = items => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem 1rem;font-size:.85rem;margin:.35rem 0;color:var(--muted)" },
    ...items.map(([t, c, dash]) => h("span", { style: "display:inline-flex;align-items:center;gap:.35rem" },
      h("span", { style: dash ? `display:inline-block;width:18px;height:0;border-top:2.5px dashed var(${c})`
        : `display:inline-block;width:18px;height:3px;background:var(${c});border-radius:2px` }), t)));
  /* tört kiírása (pl. 13/25) – csak kijelzéshez */
  const w1Frac = (k, n) => { const g = (a, b) => (b ? g(b, a % b) : a), d = g(k, n); return `${k / d}/${n / d}`; };

  /* ------------------------------------------------------------------
     sample-enum – az 5 fős sportoló sokaság összes mintája
     ------------------------------------------------------------------ */
  W["sample-enum"] = root => {
    header(root, "Az összes lehetséges minta – mintavételi eloszlás felsorolással",
      "Sokaság: Anna 2, Bence 4, Csilla 6, Dani 8, Emese 10 óra ($\\mu = 6$, $\\sigma^2 = 8$). Válaszd ki a mintanagyságot, a mintavétel módját és a statisztikát: a program felsorolja <b>az összes</b> lehetséges mintát.");
    const STATS = {
      mean:  { name: "átlag", f: a => mean(a), par: 6, parName: "$\\mu = 6$", d: 2 },
      max:   { name: "maximum", f: a => Math.max(...a), par: 10, parName: "sokasági max. = 10", d: 2 },
      min:   { name: "minimum", f: a => Math.min(...a), par: 2, parName: "sokasági min. = 2", d: 2 },
      s2:    { name: "$s^2$", f: a => (a.length > 1 ? S.variance(a, 1) : NaN), par: 8, parName: "$\\sigma^2 = 8$", d: 2 },
      range: { name: "terjedelem", f: a => Math.max(...a) - Math.min(...a), par: 8, parName: "sokasági terj. = 8", d: 2 }
    };
    let n = 2, mode = "wo", st = "mean", picked = -1;
    const segN = segmented([[1, "n = 1"], [2, "n = 2"], [3, "n = 3"], [4, "n = 4"]], n, v => { n = +v; picked = -1; update(); });
    const segM = segmented([["wo", "visszatevés nélkül"], ["wr", "visszatevéssel"]], mode, v => { mode = v; picked = -1; update(); });
    const segS = segmented(Object.entries(STATS).map(([k, o]) => [k, o.name]), st, v => { st = v; update(); });
    const drawBtn = btn("🎲 Húzz egy mintát", () => { picked = Math.floor(rnd() * samples.length); update(); });
    const rnd = S.mulberry32(2024);
    root.append(h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintanagyság:"), segN.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintavétel:"), segM.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Statisztika:"), segS.el, drawBtn));
    const cvWrap = h("div"); root.append(cvWrap);
    const cv = makeCanvas(cvWrap, 0.42);
    root.append(w1Key([["a statisztika várható értéke (az összes minta átlaga)", "--accent"], ["a paraméter (a sokaság megfelelő jellemzője)", "--muted", true]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const pickEl = h("div", { class: "readout" }); root.append(pickEl);
    const listWrap = h("details", { style: "margin-top:.5rem" }, h("summary", null, "Az összes minta listája"));
    const listEl = h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.4rem;max-height:14rem;overflow:auto" });
    listWrap.append(listEl); root.append(listWrap);

    let samples = [];
    function enumerate() {
      const idx = [];
      if (mode === "wr") {
        const rec = (pre) => { if (pre.length === n) { idx.push(pre); return; } for (let i = 0; i < 5; i++) rec([...pre, i]); };
        rec([]);
      } else {
        const rec = (pre, start) => { if (pre.length === n) { idx.push(pre); return; } for (let i = start; i < 5; i++) rec([...pre, i], i + 1); };
        rec([], 0);
      }
      return idx.map(ix => ({ ix, vals: ix.map(i => SPORT[i][1]) }));
    }
    function update() {
      samples = enumerate();
      const o = STATS[st];
      samples.forEach(s => (s.v = o.f(s.vals)));
      const valid = samples.filter(s => isFinite(s.v));
      const E = valid.length ? mean(valid.map(s => s.v)) : NaN;
      const V = valid.length ? valid.reduce((a, s) => a + (s.v - E) ** 2, 0) / valid.length : NaN;
      /* gyakoriságok */
      const freq = new Map();
      valid.forEach(s => { const k = Math.round(s.v * 1e6) / 1e6; freq.set(k, (freq.get(k) || 0) + 1); });
      const keys = [...freq.keys()].sort((a, b) => a - b);
      const maxF = Math.max(1, ...freq.values());
      const xmin = st === "s2" ? 0 : st === "range" ? 0 : 2, xmax = st === "s2" ? 32 : st === "range" ? 8 : 10;
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        if (!valid.length) { ctx.fillStyle = css("--muted"); ctx.font = "13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText("1 elemű mintából nem számolható s² (n − 1 = 0).", cv.w / 2, cv.h / 2); return; }
        const box = w1Box(cv, 40, 16, 22, 34);
        const xt = st === "s2" ? [0, 4, 8, 12, 16, 20, 24, 28, 32] : [xmin, ...rangeTicks(xmin, xmax, 8).filter(v => v > xmin)];
        const ymax = maxF / valid.length * 1.15;
        const yt = rangeTicks(0, ymax, 4);
        const { tx, ty } = axes(ctx, box, { xmin: xmin - (xmax - xmin) * 0.04, xmax: xmax + (xmax - xmin) * 0.04, ymin: 0, ymax, xticks: xt, yticks: yt, xfmt: v => fmt(v, 0), ylabel: "valószínűség" });
        const bw = Math.max(4, Math.min(28, (box.x1 - box.x0) / (keys.length * 1.8 + 2)));
        keys.forEach(k => {
          const p = freq.get(k) / valid.length;
          const isPicked = picked >= 0 && Math.abs(samples[picked].v - k) < 1e-6;
          ctx.fillStyle = isPicked ? css("--setB") : css("--setA");
          ctx.globalAlpha = 0.8;
          ctx.fillRect(tx(k) - bw / 2, ty(p), bw, ty(0) - ty(p));
          ctx.globalAlpha = 1;
          if (valid.length <= 125 && keys.length <= 14) {
            ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.fillText(String(freq.get(k)), tx(k), ty(p) - 2);
          }
        });
        vline(ctx, tx(o.par), box.y0, box.y1, css("--muted"), true);
        vline(ctx, tx(E), box.y0, box.y1, css("--accent"), false);
      };
      cv.draw();
      statRow(statEl, [
        ["minták száma", String(samples.length)],
        ["$E$(" + o.name + ")", fmt(E, 3)],
        ["$D$(" + o.name + ")", fmt(Math.sqrt(V), 3)],
        ["paraméter", o.parName],
        ["átlagosan eltalálja?", Math.abs(E - o.par) < 1e-9 ? "✔ igen (torzítatlan)" : "✘ nem"]
      ]);
      if (st === "mean") {
        const within = valid.filter(s => Math.abs(s.v - 6) <= 1 + 1e-9).length;
        pickEl.innerHTML = `Legfeljebb 1 órát téved ($5 \\le \\bar x \\le 7$): <b>${within}</b> minta a ${samples.length}-ből ($${w1Frac(within, samples.length)} = ${fmt(within / samples.length, 2).replace(",", "{,}")}$). ` +
          `Képlettel: $D^2(\\bar X) = ${mode === "wr" ? "\\sigma^2/n" : "\\frac{\\sigma^2}{n}\\cdot\\frac{N-n}{N-1}"} = ${fmt(mode === "wr" ? 8 / n : 8 / n * (5 - n) / 4, 3).replace(",", "{,}")}$.`;
      } else pickEl.innerHTML = "";
      if (picked >= 0) {
        const s = samples[picked];
        pickEl.innerHTML = `Kihúzott minta: <b>${s.ix.map(i => SPORT[i][0]).join(", ")}</b> (${s.vals.join(", ")}) → ${o.name} = <b>${fmt(s.v, 2)}</b>. ` + pickEl.innerHTML;
      }
      listEl.replaceChildren(...samples.slice(0, 625).map((s, i) => h("span", { class: "chip" + (i === picked ? " b" : ""), style: "font-weight:500" },
        s.vals.join("·") + " → " + (isFinite(s.v) ? fmt(s.v, 2) : "–"))));
      window.Synopsis && Synopsis.renderMath(root);
    }
    update();
  };

  /* ------------------------------------------------------------------
     sqrt-n – a standard hiba a mintanagyság függvényében
     ------------------------------------------------------------------ */
  W["sqrt-n"] = root => {
    header(root, "A $\\sqrt n$-törvény – mennyi adat kell a fele hibához?",
      "A görbe a standard hibát mutatja ($\\mathrm{SE} = \\sigma/\\sqrt n$); a vízszintes tengely <b>logaritmikus</b>. Húzd a mintanagyságot, és nézd meg, mekkora minta kell a feleakkora hibához.");
    let sigma = 10, n = 100, target = 0.5;
    const rowS = sliderRow("Sokasági szórás $\\sigma$ =", 1, 30, 1, sigma, v => fmt(v, 0), v => { sigma = v; update(); });
    const rowN = sliderRow("Mintanagyság $n$ =", 0, 4, 0.01, Math.log10(n), v => groupDigits(Math.round(10 ** v)), v => { n = Math.round(10 ** v); update(); });
    const tBox = numBox(target, { min: 0.01, max: 100, step: 0.1, width: "5rem" }, v => { target = v; update(); });
    root.append(h("div", { class: "controls" }, rowS.wrap), h("div", { class: "controls" }, rowN.wrap),
      h("div", { class: "controls" }, labelWrap("Kívánt standard hiba: ", tBox)));
    const cvWrap = h("div"); root.append(cvWrap);
    const cv = makeCanvas(cvWrap, 0.45);
    root.append(w1Key([["$\\mathrm{SE} = \\sigma/\\sqrt n$", "--accent"], ["a választott $n$ és a $4n$", "--setB"], ["kívánt SE", "--muted", true]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    function update() {
      const se = sigma / Math.sqrt(n), se4 = sigma / Math.sqrt(4 * n), need = Math.ceil((sigma / target) ** 2 - 1e-9);
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 44, 16, 22, 36);
        const ymax = sigma * 1.05;
        const lx = v => Math.log10(v);
        const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 4, ymin: 0, ymax, xticks: [0, 1, 2, 3, 4], yticks: rangeTicks(0, ymax, 5),
          xfmt: v => groupDigits(10 ** v), xlabel: "n (log. skála)", ylabel: "SE" });
        curve(ctx, tx, v => ty(v), x => sigma / Math.sqrt(10 ** x), 0, 4, css("--accent"), 2.5);
        /* kívánt SE */
        if (target < ymax) {
          ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(box.x0, ty(target)); ctx.lineTo(box.x1, ty(target)); ctx.stroke(); ctx.restore();
        }
        const pt = (nn, lab) => {
          if (nn > 10000) return;
          const X = tx(lx(nn)), Y = ty(sigma / Math.sqrt(nn));
          ctx.fillStyle = css("--setB"); ctx.beginPath(); ctx.arc(X, Y, 5, 0, 2 * Math.PI); ctx.fill();
          ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif"; ctx.textBaseline = "bottom";
          ctx.textAlign = X > box.x1 - 90 ? "right" : "left";
          ctx.fillText(lab, X + (ctx.textAlign === "left" ? 7 : -7), Y - 4);
        };
        pt(n, `n = ${groupDigits(n)}: SE = ${fmt(se, 2)}`);
        pt(4 * n, `4n: SE = ${fmt(se4, 2)}`);
      };
      cv.draw();
      statRow(statEl, [
        ["$\\mathrm{SE}$ ennél az $n$-nél", fmt(se, 3)],
        ["$2n$ esetén", fmt(sigma / Math.sqrt(2 * n), 3) + " (−29%)"],
        ["$4n$ esetén", fmt(se4, 3) + " (fele)"],
        ["kívánt SE-hez kell", "$n \\ge " + groupDigits(need).replace(/ /g, "\\,") + "$"]
      ]);
    }
    update();
  };

  /* ------------------------------------------------------------------
     sampling-dist – a központi szimuláció: sok minta, a statisztika eloszlása
     ------------------------------------------------------------------ */
  W["sampling-dist"] = root => {
    header(root, "Mintavételi eloszlás szimulációval – ugrál a mintaátlag?",
      "Válassz sokaságot és mintanagyságot, majd vegyél sok mintát. Felül a <b>sokaság</b> (az adatok eloszlása), alul a mintákból számolt <b>statisztika eloszlása</b>. Az átlagnál a vonal a CHT szerinti $N(\\mu, \\sigma/\\sqrt n)$ görbe.");
    const rnd = S.mulberry32(5);
    let pop = "exp", n = 5, st = "mean", stats = [], last = null, showCurve = true;
    const STATF = {
      mean: { name: "átlag", f: a => mean(a) },
      median: { name: "medián", f: a => S.median(a) },
      sd: { name: "szórás (s)", f: a => (a.length > 1 ? S.sd(a) : NaN) },
      max: { name: "maximum", f: a => Math.max(...a) }
    };
    const segP = segmented(Object.entries(POPS).map(([k, o]) => [k, o.name]), pop, v => { pop = v; reset(); });
    const segN = segmented([1, 2, 5, 10, 30, 100].map(v => [v, "n = " + v]), n, v => { n = +v; reset(); });
    const segS = segmented(Object.entries(STATF).map(([k, o]) => [k, o.name]), st, v => { st = v; reset(); });
    const cb = h("input", { type: "checkbox", checked: "" });
    cb.addEventListener("change", () => { showCurve = cb.checked; drawAll(); });
    root.append(h("div", { class: "controls" }, h("span", { class: "muted" }, "Sokaság:"), segP.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintanagyság:"), segN.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Statisztika:"), segS.el),
      h("div", { class: "controls" }, btn("1 minta", () => add(1)), btn("+100 minta", () => add(100)), btn("+10 000 minta", () => add(10000)),
        btn("Ürít", () => reset()), h("label", null, cb, " normálgörbe")));
    const w1 = h("div"), w2 = h("div");
    root.append(h("div", { class: "muted", style: "font-size:.85rem;margin-top:.3rem" }, "A sokaság (és az utolsó minta pöttyei):"), w1,
      h("div", { class: "muted", style: "font-size:.85rem;margin-top:.3rem" }, "A statisztika mintavételi eloszlása:"), w2);
    const cvP = w2Canvas(w1, w => Math.max(110, w * 0.22)), cvS = w2Canvas(w2, w => Math.max(210, w * 0.4));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const note = h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0" }); root.append(note);

    function range() {
      const P = POPS[pop];
      if (st === "sd") return [0, P.sigma * 2.5];
      if (pop === "exp" && st === "max") return [0, 24];
      return [P.lo, P.hi];
    }
    function add(k) {
      const P = POPS[pop], f = STATF[st].f, a = new Array(n);
      for (let r = 0; r < k; r++) {
        for (let i = 0; i < n; i++) a[i] = P.draw(rnd);
        const v = f(a);
        if (isFinite(v)) stats.push(v);
        if (r === k - 1) last = a.slice();
      }
      drawAll();
    }
    function reset() { stats = []; last = null; drawAll(); }
    function drawPop() {
      const P = POPS[pop], ctx = cvP.ctx; ctx.clearRect(0, 0, cvP.w, cvP.h);
      const box = w1Box(cvP, 40, 16, 10, 26);
      let ymax;
      if (P.discrete) ymax = 1 / P.discrete.length * (pop === "coin" ? 0.7 / 0.5 : 1) * 1.25;
      else { ymax = 0; for (let i = 0; i <= 200; i++) ymax = Math.max(ymax, P.pdf(P.lo + (P.hi - P.lo) * i / 200)); ymax *= 1.2; }
      const { tx, ty } = axes(ctx, box, { xmin: P.lo, xmax: P.hi, ymin: 0, ymax, xticks: rangeTicks(P.lo, P.hi, 8).filter(v => v >= P.lo && v <= P.hi), yticks: [], xfmt: v => fmt(v, Number.isInteger(v) ? 0 : 1) });
      ctx.fillStyle = css("--setC"); ctx.globalAlpha = 0.35;
      if (P.discrete) {
        const probs = pop === "coin" ? [0.7, 0.3] : P.discrete.map(() => 1 / 6);
        P.discrete.forEach((v, i) => { const bw = (box.x1 - box.x0) / (P.hi - P.lo) * 0.6; ctx.fillRect(tx(v) - bw / 2, ty(probs[i]), bw, ty(0) - ty(probs[i])); });
      } else {
        ctx.beginPath(); ctx.moveTo(tx(P.lo), ty(0));
        for (let i = 0; i <= 200; i++) { const x = P.lo + (P.hi - P.lo) * i / 200; ctx.lineTo(tx(x), ty(P.pdf(x))); }
        ctx.lineTo(tx(P.hi), ty(0)); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      vline(ctx, tx(P.mu), box.y0, box.y1, css("--muted"), true);
      if (last) {
        ctx.fillStyle = css("--setB");
        last.slice(0, 100).forEach((v, i) => { if (v < P.lo || v > P.hi) return; ctx.beginPath(); ctx.arc(tx(v), box.y1 - 6 - (i % 4) * 7, 3.5, 0, 2 * Math.PI); ctx.fill(); });
        const v = STATF[st].f(last);
        if (isFinite(v) && v >= P.lo && v <= P.hi) vline(ctx, tx(v), box.y0, box.y1, css("--setB"), false);
      }
    }
    function drawStat() {
      const P = POPS[pop], ctx = cvS.ctx; ctx.clearRect(0, 0, cvS.w, cvS.h);
      const [lo, hi] = range();
      const box = w1Box(cvS, 44, 16, 18, 30);
      const k = P.discrete && st !== "mean" && st !== "sd" ? Math.round(hi - lo) : 60;
      const H = histo(stats, lo, hi, k);
      const N = Math.max(1, stats.length);
      const dens = H.counts.map(c => c / N / H.w);
      const m = stats.length ? mean(stats) : NaN, s = stats.length > 1 ? S.sd(stats) : NaN;
      const se = P.sigma / Math.sqrt(n);
      let ymax = Math.max(0.0001, ...dens);
      if (showCurve && st === "mean") ymax = Math.max(ymax, S.normal.pdf(P.mu, P.mu, se) * (P.discrete && n < 5 ? 0 : 1));
      if (showCurve && st !== "mean" && stats.length > 30 && s > 0) ymax = Math.max(ymax, S.normal.pdf(m, m, s));
      ymax *= 1.12;
      const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax, xticks: rangeTicks(lo, hi, 8).filter(v => v >= lo && v <= hi), yticks: [], xfmt: v => fmt(v, Number.isInteger(v) ? 0 : 1) });
      ctx.fillStyle = css("--setA"); ctx.globalAlpha = 0.75;
      const bw = (box.x1 - box.x0) / k;
      H.counts.forEach((c, i) => { if (!c) return; const y = ty(dens[i]); ctx.fillRect(box.x0 + i * bw + 0.5, y, Math.max(1, bw - 1), ty(0) - y); });
      ctx.globalAlpha = 1;
      if (showCurve && stats.length) {
        if (st === "mean") curve(ctx, tx, ty, x => S.normal.pdf(x, P.mu, se), lo, hi, css("--accent"), 2.2);
        else if (stats.length > 30 && s > 0) curve(ctx, tx, ty, x => S.normal.pdf(x, m, s), lo, hi, css("--accent"), 2, [5, 4]);
      }
      const parV = st === "mean" ? P.mu : st === "sd" ? P.sigma : null;
      if (parV != null) vline(ctx, tx(parV), box.y0, box.y1, css("--muted"), true);
      if (!stats.length) { ctx.fillStyle = css("--muted"); ctx.font = "13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Még nincs minta – kattints a gombokra!", (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2); }
    }
    function skew(a) { if (a.length < 3) return NaN; const m = mean(a), s = Math.sqrt(a.reduce((t, x) => t + (x - m) ** 2, 0) / a.length); return s > 0 ? a.reduce((t, x) => t + ((x - m) / s) ** 3, 0) / a.length : NaN; }
    function drawAll() {
      cvP.draw = drawPop; cvS.draw = drawStat; drawPop(); drawStat();
      const P = POPS[pop], m = stats.length ? mean(stats) : NaN, s = stats.length > 1 ? S.sd(stats) : NaN;
      const items = [["minták száma", groupDigits(stats.length)], [STATF[st].name + "ok átlaga", fmt(m, 3)], [STATF[st].name + "ok szórása (szimulált SE)", fmt(s, 3)]];
      if (st === "mean") items.push(["elméleti $\\mathrm{SE} = \\sigma/\\sqrt n$", fmt(P.sigma / Math.sqrt(n), 3)], ["$\\mu$", fmt(P.mu, 3)]);
      items.push(["ferdeség", fmt(skew(stats), 2)]);
      statRow(statEl, items);
      note.innerHTML = st === "mean"
        ? (pop === "exp" && n < 30 ? "A sokaság erősen ferde: kis $n$-nél az átlagok eloszlása is ferde. Növeld az $n$-et 30-ra és 100-ra!"
          : pop === "bimod" && n === 1 ? "$n = 1$-nél a „mintaátlag” egyetlen adat: az eloszlása maga a sokaság. Már $n = 5$-nél egycsúcsú lesz!"
          : "Figyeld: a hisztogram középe mindig $\\mu$, szélessége $\\sigma/\\sqrt n$, és $n$ növelésével egyre jobban illeszkedik a normálgörbére.")
        : st === "max" ? "A maximum eloszlása nem a sokasági maximum körül van, és ferdébb is – a CHT csak átlagra (összegre) szól."
        : st === "median" ? "A medián eloszlása is közel normális lesz nagy $n$-nél, de ferde sokaságnál nem a $\\mu$ körül, hanem a sokasági medián körül."
        : "A szórás eloszlása kis $n$-nél jobbra ferde, és átlagosan kicsit kisebb, mint $\\sigma$ (a szaggatott vonal).";
      window.Synopsis && Synopsis.renderMath(note);
    }
    add(100);
  };


  /* ==================================================================
     w2: galton-board (5.3-a), poll-sim (5.4-c), t-vs-normal (5.5-b),
         dist-calc (5.5-c után), bootstrap (5.6-b), regression-mean (5.7-b)
     ================================================================== */

  /* --- w2 saját segédei --- */
  const w2R = String.raw;
  const w2Minus = s => s.replace(/^-/, "−");
  const w2F = (x, d = 1) => w2Minus(fmt(x, d));
  /* legfeljebb maxd tizedes, a záró nullák nélkül: 5 → "5", 0,975 → "0,975" */
  const w2Num = (x, maxd = 3) => {
    if (!isFinite(x)) return "–";
    let s = fmt(x, maxd);
    if (s.includes(",")) s = s.replace(/0+$/, "").replace(/,$/, "");
    return w2Minus(s);
  };
  /* szám KaTeX-be: tizedesvessző {,}-vel, mínusz „-” */
  const w2K = s => String(s).replace(/−/g, "-").replace(/,/g, "{,}");
  /* valószínűség 4 tizedesre; nagyon kicsinél normálalak (KaTeX) */
  const w2P = p => {
    if (!(p >= 1e-4) && p > 0) { const e = Math.floor(Math.log10(p)); return fmt(p / 10 ** e, 1) + w2R`\cdot 10^{${e}}`; }
    return fmt(p, 4);
  };
  const w2Ctl = (...kids) => h("div", { class: "controls" }, ...kids);
  /* HTML jelmagyarázat: items = [[szöveg, színváltozó, "line" | "dash" | undefined]] */
  const w2Key = items => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem 1rem;font-size:.85rem;margin:.35rem 0;color:var(--muted)" },
    ...items.map(([t, c, kind]) => h("span", { style: "display:inline-flex;align-items:center;gap:.35rem" },
      h("span", { style: kind === "dash"
        ? `display:inline-block;width:18px;height:0;border-top:2.5px dashed var(${c})`
        : `display:inline-block;width:${kind ? 18 : 11}px;height:${kind ? 3 : 11}px;background:var(${c});border-radius:2px${kind ? "" : ";opacity:.75"}` }), t)));
  const w2Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.6rem 0 0", html });
  /* kijelzősor egyszer felépítve (KaTeX-címkékkel), utána csak az értékek frissülnek */
  function w2Stats(el, labels) {
    statRow(el, labels.map(l => [l, "–"]));
    const vs = [...el.querySelectorAll(".v")];
    return vals => vals.forEach((v, i) => { if (vs[i] && vs[i].innerHTML !== String(v)) vs[i].innerHTML = v; });
  }
  /* vászon, amelynek magassága a szélesség függvénye: hFn(w) */
  function w2Canvas(parent, hFn, maxW = 760) {
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
  const w2Clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const w2Font = (ctx, px, bold) => { ctx.font = `${bold ? "600 " : ""}${px}px system-ui, sans-serif`; };
  /* szöveg x köré középre, de a [lo, hi] sávon belül tartva */
  function w2TextIn(ctx, s, x, y, lo, hi) {
    const tw = ctx.measureText(s).width;
    ctx.textAlign = "left";
    ctx.fillText(s, Math.max(lo, Math.min(hi - tw, x - tw / 2)), y);
  }
  /* terület a görbe alatt [a, b]-n (ycap fölött levágva) */
  function w2Area(ctx, tx, ty, fn, a, b, color, alpha, ycap = Infinity) {
    if (!(b > a)) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(tx(a), ty(0));
    const N = 200;
    for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N, y = fn(x); ctx.lineTo(tx(x), ty(Math.min(isFinite(y) ? y : ycap, ycap))); }
    ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function w2Placeholder(cv, txt) {
    const ctx = cv.ctx; ctx.fillStyle = css("--muted"); w2Font(ctx, 13);
    ctx.textBaseline = "middle"; w2TextIn(ctx, txt, cv.w / 2, cv.h / 2, 6, cv.w - 6);
  }
  const w2Dot = (ctx, x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); };
  /* százalékos tengelyfelirat a lépésköz szerinti tizedessel */
  const w2PctFmt = step => v => pct(v, step < 0.0099 ? 1 : 0);

  /* ------------------------------------------------------------------
     5.3-a  Galton-deszka
     ------------------------------------------------------------------ */
  W["galton-board"] = root => {
    header(root, "Galton-deszka: sok kis véletlen lökés összege",
      "Minden szögnél ½–½ eséllyel pattan a golyó balra vagy jobbra. Ahányszor jobbra ment, annyiadik tárolóba esik (0-tól számozva).");
    let n = 10, counts = [], N = 0, balls = [], queue = 0, rate = 30, acc = 0, raf = 0, last = 0;
    const rnd = S.mulberry32(1894);
    const rowsR = sliderRow("Sorok száma $n$:", 1, 20, 1, n, v => v, v => { n = v; clear(); });
    const instChk = h("input", { type: "checkbox" });
    const ovChk = h("input", { type: "checkbox" }); ovChk.checked = true;
    ovChk.addEventListener("change", () => cv.draw());
    root.append(
      w2Ctl(rowsR.wrap),
      w2Ctl(btn("1 golyó", () => drop(1), "btn primary"), btn("100 golyó", () => drop(100)), btn("1000 golyó", () => drop(1000)), btn("Ürít", clear)),
      w2Ctl(labelWrap("", instChk, "azonnal (animáció nélkül)"), labelWrap("", ovChk, "elméleti görbék")));
    const cv = w2Canvas(root, w => w2Clamp(w * 0.68, 330, 500));
    root.append(w2Key([["golyók a tárolókban", "--setA"], ["binomiális várt gyakoriság", "--setB", "line"],
      [w2R`normálgörbe $N\big(n/2,\ \sqrt{n}/2\big)$`, "--accent", "line"], ["guruló golyó", "--accent"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["golyók száma", w2R`átlagos tároló $\bar x$`, w2R`elméleti átlag $n/2$`, w2R`mintabeli szórás $s$`, w2R`elméleti szórás $\sqrt{n}/2$`]);
    const note = w2Note(""); root.append(note);

    function geom() {
      const w = cv.w, H = cv.h, bw = Math.min(56, (w - 12) / (n + 1)), cx = w / 2;
      const pegTop = 26, pegBot = H * 0.42, dy = n > 1 ? (pegBot - pegTop) / (n - 1) : 0;
      const binTop = H * 0.47, binBot = H - 20;
      return { w, H, bw, cx, left: cx - (n + 1) / 2 * bw, pegTop, dy, binTop, binBot,
        pr: w2Clamp(bw * 0.11, 1.5, 3.5), br: w2Clamp(bw * 0.27, 2.2, 6.5) };
    }
    const pmf = k => S.binom.pmf(k, n, 0.5);
    function maxC() {
      let m = Math.max(1, ...counts);
      if (ovChk.checked && N > 0) m = Math.max(m, N * pmf(Math.floor(n / 2)), N * S.normal.pdf(n / 2, n / 2, Math.sqrt(n) / 2));
      return m * 1.08;
    }
    function ballPos(b, g, mc) {
      const t = b.t, xr = r => g.cx + (b.ks[r] - r / 2) * g.bw;
      const yr = r => (r < n ? g.pegTop + r * g.dy - g.pr - g.br : g.binTop);
      if (t < 0) return [g.cx, 4 + (yr(0) - 4) * (t + 0.6) / 0.6];
      if (t < n) {
        const r = Math.floor(t), f = t - r, hop = Math.min(g.dy || 30, 30) * 0.45;
        return [xr(r) + (xr(r + 1) - xr(r)) * f, yr(r) + (yr(r + 1) - yr(r)) * f - Math.sin(Math.PI * f) * hop];
      }
      const top = g.binBot - counts[b.k] / mc * (g.binBot - g.binTop) - g.br;
      return [xr(n), g.binTop + (t - n) * (top - g.binTop)];
    }
    cv.draw = () => {
      const ctx = cv.ctx, g = geom(), mc = maxC();
      ctx.clearRect(0, 0, g.w, g.H);
      // szögek
      ctx.fillStyle = css("--muted");
      for (let r = 0; r < n; r++) for (let j = 0; j <= r; j++) {
        ctx.beginPath(); ctx.arc(g.cx + (j - r / 2) * g.bw, g.pegTop + r * g.dy, g.pr, 0, 2 * Math.PI); ctx.fill();
      }
      // tárolók
      const bh = g.binBot - g.binTop;
      ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = css("--setA");
      counts.forEach((c, k) => { const hh = c / mc * bh; if (c) ctx.fillRect(g.left + k * g.bw + 1, g.binBot - hh, g.bw - 2, hh); });
      ctx.restore();
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      for (let k = 0; k <= n + 1; k++) { const x = g.left + k * g.bw; ctx.beginPath(); ctx.moveTo(x, g.binTop); ctx.lineTo(x, g.binBot); ctx.stroke(); }
      ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(g.left, g.binBot); ctx.lineTo(g.left + (n + 1) * g.bw, g.binBot); ctx.stroke();
      // elméleti görbék
      if (ovChk.checked && N > 0) {
        const tx = v => g.left + (v + 0.5) * g.bw, ty = c => g.binBot - c / mc * bh;
        curve(ctx, tx, ty, v => N * S.normal.pdf(v, n / 2, Math.sqrt(n) / 2), -0.5, n + 0.5, css("--accent"), 2);
        ctx.strokeStyle = css("--setB"); ctx.lineWidth = 3;
        for (let k = 0; k <= n; k++) { const y = ty(N * pmf(k)); ctx.beginPath(); ctx.moveTo(g.left + k * g.bw + g.bw * 0.18, y); ctx.lineTo(g.left + (k + 0.82) * g.bw, y); ctx.stroke(); }
      }
      // tároló-sorszámok
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "center"; ctx.textBaseline = "top";
      const step = g.bw < 17 ? 2 : 1;
      for (let k = 0; k <= n; k += step) ctx.fillText(k, g.left + (k + 0.5) * g.bw, g.binBot + 4);
      // golyók
      const bc = css("--accent");
      balls.forEach(b => { const [x, y] = ballPos(b, g, mc); w2Dot(ctx, x, y, g.br, bc); });
    };
    function upd() {
      let m = NaN, s = NaN;
      if (N > 0) {
        m = counts.reduce((a, c, k) => a + c * k, 0) / N;
        if (N > 1) s = Math.sqrt(counts.reduce((a, c, k) => a + c * (k - m) ** 2, 0) / (N - 1));
      }
      setS([groupDigits(N), N ? w2F(m, 2) : "–", w2Num(n / 2, 1), N > 1 ? w2F(s, 3) : "–", w2F(Math.sqrt(n) / 2, 3)]);
    }
    function newBall() {
      const ks = [0]; let k = 0;
      for (let r = 0; r < n; r++) { if (rnd() < 0.5) k++; ks.push(k); }
      return { ks, k, t: -0.6, v: rate >= 300 ? 30 : rate >= 60 ? 20 : 11 };
    }
    function drop(m) {
      if (instChk.checked) {
        for (let i = 0; i < m; i++) { const b = newBall(); counts[b.k]++; N++; }
        cv.draw(); upd(); return;
      }
      rate = Math.max(queue > 0 ? rate : 0, m >= 1000 ? 400 : m >= 100 ? 70 : 30);
      queue += m; acc = Math.max(acc, 1);
      if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
    }
    function loop(ts) {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
      acc += rate * dt;
      while (acc >= 1 && queue > 0) { balls.push(newBall()); queue--; acc--; }
      if (!queue) acc = 0;
      const keep = [];
      for (const b of balls) { b.t += b.v * dt; if (b.t >= n + 1) { counts[b.k]++; N++; } else keep.push(b); }
      balls = keep;
      cv.draw(); upd();
      raf = queue > 0 || balls.length ? requestAnimationFrame(loop) : 0;
    }
    function clear() {
      cancelAnimationFrame(raf); raf = 0; balls = []; queue = 0; acc = 0;
      counts = new Array(n + 1).fill(0); N = 0;
      note.textContent = `Minden golyó helye ${n} db független ±½ lépés összege – ezért harang.`;
      cv.draw(); upd();
    }
    clear();
    // betöltéskor 100 golyó, rögzített maggal
    const ic = instChk.checked; instChk.checked = true; drop(100); instChk.checked = ic;
  };

  /* ------------------------------------------------------------------
     5.4-c  Száz közvélemény-kutatás
     ------------------------------------------------------------------ */
  W["poll-sim"] = root => {
    header(root, "Száz közvélemény-kutatás",
      w2R`Minden felmérés $n$ véletlenszerűen kiválasztott embert kérdez meg; a sokaságban az „igen” aránya $p$. Minden felmérés kap egy $\hat p \pm 2\,\mathrm{SE}$ sávot – vajon hány találja el $p$-t?`);
    let p = 0.4, n = 1000, polls = [], rnd;
    const SEED = 4242;
    const pR = sliderRow("valódi arány $p$:", 0.01, 0.99, 0.01, p, v => fmt(v, 2), v => { p = v; reset(); });
    const nSeg = segmented([50, 100, 400, 1000, 2500].map(v => [v, groupDigits(v)]), n, v => { n = +v; reset(); });
    root.append(w2Ctl(pR.wrap), w2Ctl(h("span", { class: "muted", style: "font-size:.92rem" }, "mintanagyság $n$:"), nSeg.el),
      w2Ctl(btn("1 felmérés", () => run(1), "btn primary"), btn("100 felmérés", () => run(100)), btn("Ürít", () => { polls = []; draw(); })));
    const cv = w2Canvas(root, w => w2Clamp(w * 0.42, 230, 300) + w2Clamp(w * 0.16, 90, 120) + 54);
    root.append(w2Key([[w2R`$\hat p \pm 2\,\mathrm{SE}$ lefedi $p$-t`, "--setA", "line"], ["nem fedi le", "--bad", "line"], ["valódi $p$", "--text", "line"],
      [w2R`$N\big(p,\ \sqrt{p(1-p)/n}\big)$`, "--accent", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, [w2R`elméleti $\mathrm{SE} = \sqrt{p(1-p)/n}$`, w2R`a sáv: $\pm 2\,\mathrm{SE}$`, w2R`a szimulált $\hat p$-k szórása`, "lefedi $p$-t"]);
    const cond = h("div", { class: "readout" }); root.append(cond);
    root.append(w2Note("A sáv egy mintából készül, mégis kb. 95%-uk eltalálja a valódi arányt – ez lesz a 6. fejezet konfidencia-intervalluma."));

    function run(m) {
      for (let j = 0; j < m; j++) {
        let k = 0; for (let i = 0; i < n; i++) if (rnd() < p) k++;
        const ph = k / n, se = Math.sqrt(ph * (1 - ph) / n);
        polls.push({ ph, se, hit: ph - 2 * se <= p && p <= ph + 2 * se });
      }
      draw();
    }
    function reset() { rnd = S.mulberry32(SEED); polls = []; run(100); }
    const pp = v => fmt(100 * v, 2) + " <small>százalékpont</small>";
    function draw() {
      const ctx = cv.ctx, w = cv.w, H = cv.h;
      ctx.clearRect(0, 0, w, H);
      const se0 = Math.sqrt(p * (1 - p) / n);
      const lo = Math.max(-0.6 / n, p - 5 * se0), hi = Math.min(1 + 0.6 / n, p + 5 * se0);
      const h1 = w2Clamp(w * 0.42, 230, 300), h2 = w2Clamp(w * 0.16, 90, 120);
      const x0 = 12, x1 = w - 12, top1 = 14, bot1 = top1 + h1 - 14, top2 = bot1 + 16, bot2 = top2 + h2;
      const ticks = rangeTicks(lo, hi, w < 500 ? 5 : 8).filter(v => v >= 0 && v <= 1), tstep = ticks.length > 1 ? ticks[1] - ticks[0] : 0.01;
      const { tx, ty } = axes(ctx, { x0, y0: top2, x1, y1: bot2 }, { xmin: lo, xmax: hi, ymin: 0, ymax: 1, xticks: ticks, xfmt: w2PctFmt(tstep), xlabel: "" });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText("p̂", x1, bot2 + 20);
      // 1. ábra: utolsó 100 felmérés
      const show = polls.slice(-100), rowH = (bot1 - top1) / 100;
      ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, bot2); ctx.clip();
      const cA = css("--setA"), cB = css("--bad");
      show.forEach((q, i) => {
        const y = top1 + (i + 0.5) * rowH, col = q.hit ? cA : cB;
        ctx.strokeStyle = col; ctx.lineWidth = q.hit ? 1.4 : 2;
        ctx.beginPath(); ctx.moveTo(tx(q.ph - 2 * q.se), y); ctx.lineTo(tx(q.ph + 2 * q.se), y); ctx.stroke();
        w2Dot(ctx, tx(q.ph), y, Math.min(2.4, rowH * 0.9 + 0.6), col);
      });
      // 2. ábra: hisztogram
      if (polls.length) {
        const kb = Math.max(1, Math.round((hi - lo) / 26 * n)), wb = kb / n, e0 = (Math.floor(lo * n) - 0.5) / n;
        const K = Math.ceil((hi - e0) / wb), hs = histo(polls.map(q => q.ph), e0, e0 + K * wb, K);
        const pdfMax = polls.length * wb * S.normal.pdf(p, p, se0);
        const ym = Math.max(...hs.counts, pdfMax) * 1.1;
        const ty2 = c => bot2 - c / ym * (bot2 - top2);
        ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = css("--setA");
        hs.counts.forEach((c, i) => { if (c) { const a = tx(e0 + i * wb), b = tx(e0 + (i + 1) * wb); ctx.fillRect(a + 0.5, ty2(c), Math.max(1, b - a - 1), bot2 - ty2(c)); } });
        ctx.restore();
        curve(ctx, tx, ty2, x => polls.length * wb * S.normal.pdf(x, p, se0), lo, hi, css("--accent"), 2);
      }
      ctx.restore();
      // valódi p
      vline(ctx, tx(p), top1 - 4, bot2, css("--text"));
      ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      w2TextIn(ctx, "p = " + pct(p, 0), tx(p), top1 - 3, 2, w - 2);
      w2Font(ctx, 10); ctx.textBaseline = "top"; ctx.textAlign = "left";
      const tag = (s, x, y) => { const tw = ctx.measureText(s).width; ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(x - 2, y - 1, tw + 4, 13); ctx.restore(); ctx.fillStyle = css("--muted"); ctx.fillText(s, x, y); };
      tag(polls.length ? `utolsó ${Math.min(100, polls.length)} felmérés` : "nincs felmérés – nyomd meg a gombot", x0 + 2, top1);
      if (polls.length) tag(`az összes ${groupDigits(polls.length)} p̂ hisztogramja`, x0 + 2, top2 + 1);
      // kijelzők
      const hits = polls.filter(q => q.hit).length;
      setS([pp(se0), "±" + pp(2 * se0), polls.length > 1 ? pp(S.sd(polls.map(q => q.ph))) : "–",
        polls.length ? `${groupDigits(hits)} / ${groupDigits(polls.length)}` : "–"]);
      const a = n * p, b = n * (1 - p), ok = a >= 10 - 1e-9 && b >= 10 - 1e-9;
      cond.innerHTML = `$np = ${w2K(w2Num(a, 1))}$, $n(1-p) = ${w2K(w2Num(b, 1))}$ → ` +
        (ok ? `<b style="color:var(--ok)">✔ mindkettő ≥ 10, a normális közelítés jó</b>` : `<b style="color:var(--bad)">✘ ${a < 10 ? "np" : "n(1 − p)"} &lt; 10: a normális közelítés gyenge</b>`);
      window.Synopsis && Synopsis.renderMath(cond);
    }
    cv.draw = draw;
    reset();
  };

  /* ------------------------------------------------------------------
     5.5-b  A t-eloszlás és a normális eloszlás
     ------------------------------------------------------------------ */
  W["t-vs-normal"] = root => {
    header(root, "A t-eloszlás és a normális eloszlás",
      "Ha a szórást a mintából becsüljük, a standardizált átlag t-eloszlású. Kis szabadságfoknál a farka vastagabb – nagy df-nél szinte normális.");
    let df = 4, inf = false;
    const rnd = S.mulberry32(1908);
    const dfR = sliderRow("szabadságfok (df):", 1, 60, 1, df, v => v, v => { df = v; inf = false; infB.classList.remove("on"); upd(); });
    const infB = btn("∞", () => { inf = !inf; infB.classList.toggle("on", inf); dfR.out.textContent = inf ? "∞" : df; upd(); });
    infB.title = "végtelen szabadságfok = standard normális";
    root.append(w2Ctl(dfR.wrap, infB));
    const cv = w2Canvas(root, w => w2Clamp(w * 0.45, 220, 320));
    root.append(w2Key([["standard normális", "--muted", "dash"], ["$t_{df}$-sűrűség", "--accent", "line"], ["$|x| > 2$ terület a t-görbe alatt", "--accent"],
      [w2R`$\pm t_{df;\,0{,}975}$`, "--setB", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["$P(|T| > 2)$", "$P(|Z| > 2)$", w2R`$t_{df;\,0{,}975}$`, w2R`$z_{0{,}975}$`]);
    const gB = btn("Gosset kísérlete: 2000 minta", gosset, "btn primary");
    const gWrap = h("div", { style: "display:none" });
    root.append(w2Ctl(gB), gWrap);
    const gTxt = h("p", { class: "w-sub", style: "margin:.2rem 0 .3rem" });
    gWrap.append(gTxt);
    const gc = w2Canvas(gWrap, w => w2Clamp(w * 0.36, 180, 260));
    const gOut = h("div", { class: "readout" }); gWrap.append(gOut);
    let gData = null;

    const tpdf = x => (inf ? S.normal.pdf(x) : S.t.pdf(x, df));
    const tq = () => (inf ? S.normal.inv(0.975) : S.t.inv(0.975, df));
    function plotDens(c, extra) {
      const ctx = c.ctx; ctx.clearRect(0, 0, c.w, c.h);
      const box = { x0: 34, y0: 14, x1: c.w - 10, y1: c.h - 34 };
      const ymax = extra ? extra.ymax : 0.45;
      const { tx, ty } = axes(ctx, box, { xmin: -5, xmax: 5, ymin: 0, ymax, xticks: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], xfmt: v => w2Minus(String(v)),
        yticks: rangeTicks(0, ymax, 4).filter(v => v < ymax), xlabel: "x" });
      if (extra) extra.bars(ctx, tx, ty);
      else { w2Area(ctx, tx, ty, tpdf, -5, -2, css("--accent"), 0.32); w2Area(ctx, tx, ty, tpdf, 2, 5, css("--accent"), 0.32); }
      curve(ctx, tx, ty, x => S.normal.pdf(x), -5, 5, css("--muted"), 2, [6, 5]);
      curve(ctx, tx, ty, tpdf, -5, 5, css("--accent"), 2.5);
      return { ctx, tx, ty, box };
    }
    cv.draw = () => {
      const { ctx, tx, box } = plotDens(cv), q = tq();
      ctx.fillStyle = css("--setB"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom";
      if (q <= 5) {
        [-q, q].forEach(v => vline(ctx, tx(v), box.y0 + 10, box.y1, css("--setB"), true));
        w2TextIn(ctx, "±" + w2F(q, 3), tx(q), box.y0 + 8, box.x0, box.x1);
      } else {
        ctx.textAlign = "right"; ctx.fillText(`±${w2F(q, 3)}: kívül esik →`, box.x1, box.y0 + 8);
      }
    };
    function upd() {
      const pT = inf ? 2 * (1 - S.normal.cdf(2)) : 2 * (1 - S.t.cdf(2, df));
      setS([w2F(pT, 3), w2F(2 * (1 - S.normal.cdf(2)), 3), w2F(tq(), 3), w2F(S.normal.inv(0.975), 3)]);
      gB.disabled = inf; gB.title = inf ? "végtelen df-nél nincs véges minta – válassz df-et a csúszkán" : "";
      if (gData && (gData.df !== df || inf)) { gWrap.style.display = "none"; gData = null; }
      cv.draw();
    }
    function gosset() {
      if (inf) return;
      const n = df + 1, T = [], Z = [];
      for (let r = 0; r < 2000; r++) {
        const x = []; for (let i = 0; i < n; i++) x.push(S.rnorm(rnd));
        const m = S.mean(x), s = S.sd(x);
        T.push(m / (s / Math.sqrt(n))); Z.push(m * Math.sqrt(n));
      }
      gData = { df, n, T, Z };
      gWrap.style.display = "";
      gc.resize(); gc.draw();
    }
    gc.draw = () => {
      if (!gData) return;
      const hs = histo(gData.T, -5, 5, 40), dens = hs.counts.map(c => c / (gData.T.length * hs.w));
      const ymax = Math.max(0.42, ...dens) * 1.08;
      plotDens(gc, { ymax, bars: (ctx, tx, ty) => {
        ctx.save(); ctx.globalAlpha = 0.5;
        dens.forEach((d, i) => { const a = -5 + i * hs.w; ctx.fillStyle = css(Math.abs(a + hs.w / 2) > 2 ? "--setB" : "--setA"); ctx.fillRect(tx(a) + 0.5, ty(d), tx(a + hs.w) - tx(a) - 1, ty(0) - ty(d)); });
        ctx.restore();
      } });
      const fT = gData.T.filter(v => Math.abs(v) > 2).length / gData.T.length, fZ = gData.Z.filter(v => Math.abs(v) > 2).length / gData.Z.length;
      const out = gData.T.filter(v => Math.abs(v) > 5).length;
      gTxt.innerHTML = `2000-szer vettünk $n = ${gData.n}$ elemű mintát $N(0,\\ 1)$-ből, és mindegyikből kiszámoltuk $T = \\bar x / (s/\\sqrt n)$-t. ` +
        `Az oszlopok a $T$-k hisztogramja (sűrűségre skálázva; $|T| > 2$: másik színnel).`;
      gOut.innerHTML = `$|T| > 2$: <b>${pct(fT, 1)}</b> (elméleti ${pct(2 * (1 - S.t.cdf(2, gData.df)), 1)}) · ` +
        `ha az igazi $\\sigma = 1$-gyel osztunk, $|Z| > 2$: <b>${pct(fZ, 1)}</b> (elméleti 4,6%)` + (out ? ` · ${out} db $T$ a $[-5;\\ 5]$ sávon kívül esett` : "");
      window.Synopsis && (Synopsis.renderMath(gTxt), Synopsis.renderMath(gOut));
    };
    upd();
  };

  /* ------------------------------------------------------------------
     5.5-c után  Eloszlás-kalkulátor
     ------------------------------------------------------------------ */
  W["dist-calc"] = root => {
    header(root, "Eloszlás-kalkulátor (tábla helyett)",
      "Válaszd ki az eloszlást és a paramétereit, aztán add meg a területet (valószínűséget) – vagy fordítva, a határt.");
    const st = { dist: "norm", m: 0, s: 1, df: 9, k: 9, d1: 5, d2: 10, mode: "q", dir: "left", p: 0.975, x: 1.96 };
    const K = (x, d) => w2K(w2F(x, d));
    const D = {
      norm: {
        pdf: x => S.normal.pdf(x, st.m, st.s), cdf: x => S.normal.cdf(x, st.m, st.s), inv: p => S.normal.inv(p, st.m, st.s), sym: true,
        std: () => st.m === 0 && st.s === 1,
        rv: () => (D.norm.std() ? "Z" : "X"),
        q: L => (D.norm.std() ? `z_{${L}}` : `x_{${L}}`),
        law: () => (D.norm.std() ? w2R`Z \sim N(0,\ 1)` : w2R`X \sim N(${w2K(w2Num(st.m, 4))},\ ${w2K(w2Num(st.s, 4))})`),
        range: () => [st.m - 4 * st.s, st.m + 4 * st.s]
      },
      t: {
        pdf: x => S.t.pdf(x, st.df), cdf: x => S.t.cdf(x, st.df), inv: p => S.t.inv(p, st.df), sym: true,
        rv: () => "T", q: L => w2R`t_{${w2K(w2Num(st.df, 2))};\,${L}}`, law: () => w2R`T \sim t_{${w2K(w2Num(st.df, 2))}}`,
        range: () => { const L = Math.max(4, Math.min(8, S.t.inv(0.995, st.df))); return [-L, L]; }
      },
      chi2: {
        pdf: x => S.chi2.pdf(x, st.k), cdf: x => S.chi2.cdf(x, st.k), inv: p => S.chi2.inv(p, st.k),
        rv: () => w2R`\chi^2`, q: L => w2R`\chi^2_{${w2K(w2Num(st.k, 2))};\,${L}}`, law: () => w2R`\chi^2 \sim \chi^2_{${w2K(w2Num(st.k, 2))}}`,
        range: () => [0, S.chi2.inv(0.999, st.k)]
      },
      f: {
        pdf: x => S.f.pdf(x, st.d1, st.d2), cdf: x => S.f.cdf(x, st.d1, st.d2), inv: p => S.f.inv(p, st.d1, st.d2),
        rv: () => "F", q: L => w2R`F_{${w2K(w2Num(st.d1, 2))},\,${w2K(w2Num(st.d2, 2))};\,${L}}`,
        law: () => w2R`F \sim F_{${w2K(w2Num(st.d1, 2))},\,${w2K(w2Num(st.d2, 2))}}`,
        range: () => [0, Math.min(S.f.inv(0.995, st.d1, st.d2), 4 * S.f.inv(0.9, st.d1, st.d2))]
      }
    };
    const distSeg = segmented([["norm", "Normális"], ["t", "Student t"], ["chi2", "Khi-négyzet"], ["f", "F"]], st.dist, v => { st.dist = v; buildParams(); calc(); });
    const modeSeg = segmented([["q", "Terület → határ (kvantilis)"], ["p", "Határ → terület"]], st.mode, v => {
      const r = calc(true);
      if (v === "p" && r) st.x = +(st.dir === "two" ? r.b : r.x).toFixed(3);
      if (v === "q" && r) st.p = +r.P.toFixed(4);
      st.mode = v; buildInput(); calc();
    });
    const dirSeg = segmented([["left", "bal farok $P(X < x)$"], ["right", "jobb farok $P(X > x)$"], ["two", "két oldal (egyenlő farkak)"]], st.dir, v => { st.dir = v; buildInput(); calc(); });
    const params = h("div", { class: "controls" }), inRow = h("div", { class: "controls" });
    root.append(distSeg.el, params, modeSeg.el, dirSeg.el, inRow);
    const res = h("div", { class: "formula-out", style: "font-size:1.25rem;overflow-x:auto" });
    const sub = h("div", { class: "readout", style: "font-family:var(--font)" });
    root.append(res, sub);
    const cv = w2Canvas(root, w => w2Clamp(w * 0.42, 210, 300));

    function lab(txt, el) { return h("label", null, h("span", { html: txt }), el); }
    function buildParams() {
      const P = [];
      if (st.dist === "norm") P.push(lab("$m$ =", numBox(st.m, { min: -1e9, max: 1e9, step: "any" }, v => { st.m = v; calc(); })),
        lab(w2R`$\sigma$ =`, numBox(st.s, { min: 1e-9, max: 1e9, step: "any" }, v => { st.s = v; calc(); })));
      if (st.dist === "t") P.push(lab("szabadságfok (df) =", numBox(st.df, { min: 1, max: 1000, step: 1 }, v => { st.df = v; calc(); })));
      if (st.dist === "chi2") P.push(lab("szabadságfok $k$ =", numBox(st.k, { min: 1, max: 200, step: 1 }, v => { st.k = v; calc(); })));
      if (st.dist === "f") P.push(lab("$d_1$ =", numBox(st.d1, { min: 1, max: 1000, step: 1 }, v => { st.d1 = v; calc(); })),
        lab("$d_2$ =", numBox(st.d2, { min: 1, max: 1000, step: 1 }, v => { st.d2 = v; calc(); })));
      params.replaceChildren(...P);
      window.Synopsis && Synopsis.renderMath(params);
    }
    function buildInput() {
      let el;
      if (st.mode === "q") {
        const t = { left: "terület: $P(X < x)$ =", right: "terület: $P(X > x)$ =", two: "terület: $P(a < X < b)$ =" }[st.dir];
        el = lab(t, numBox(st.p, { min: 1e-12, max: 1 - 1e-12, step: 0.001, width: "6.5rem" }, v => { st.p = v; calc(); }));
      } else {
        el = lab(st.dir === "two" ? "az egyik határ $x$ =" : "határ: $x$ =", numBox(st.x, { min: -1e9, max: 1e9, step: 0.01, width: "6.5rem" }, v => { st.x = v; calc(); }));
      }
      inRow.replaceChildren(el);
      window.Synopsis && Synopsis.renderMath(inRow);
    }
    let shade = null; // {a, b, P, lines: [x…]}
    /* kiszámolja az eredményt; quiet: csak visszaadja (módváltáshoz) */
    function calc(quiet) {
      const d = D[st.dist], rv = d.rv();
      const lvl = v => w2K(w2Num(v, 6));
      let r;
      if (st.mode === "q") {
        const p = st.p;
        if (!(p > 0 && p < 1)) r = null;
        else if (st.dir === "left") { const x = d.inv(p); r = { x, P: p, a: -Infinity, b: x, lines: [x],
          big: `$${d.q(lvl(p))} = ${K(x, 3)}$`, small: `$P(${rv} < ${K(x, 3)}) = ${lvl(p)}$` }; }
        else if (st.dir === "right") { const x = d.inv(1 - p); r = { x, P: p, a: x, b: Infinity, lines: [x],
          big: `$${d.q(lvl(1 - p))} = ${K(x, 3)}$`, small: `$P(${rv} > ${K(x, 3)}) = ${lvl(p)}$ &nbsp;(a kvantilis indexe mindig a <i>bal</i> oldali terület: $1 - ${lvl(p)} = ${lvl(1 - p)}$)` }; }
        else {
          const lo = (1 - p) / 2, hi = (1 + p) / 2, b = d.inv(hi), a = d.sym ? 2 * (st.dist === "norm" ? st.m : 0) - b : d.inv(lo);
          r = { x: b, a, b, P: p, lines: [a, b],
            big: `$${d.q(lvl(lo))} = ${K(a, 3)}$ &nbsp;és&nbsp; $${d.q(lvl(hi))} = ${K(b, 3)}$`,
            small: `$P(${K(a, 3)} < ${rv} < ${K(b, 3)}) = ${lvl(p)}$; mindkét farokban $${lvl(lo)}$` };
        }
      } else {
        const x = st.x, c = d.cdf(x), K = (v, dd) => w2K(w2Num(v, v === x ? 4 : dd));
        if (st.dir === "left") r = { x, P: c, a: -Infinity, b: x, lines: [x], big: `$P(${rv} < ${K(x, 3)}) = ${w2K(w2P(c))}$`,
          small: `a másik farok: $P(${rv} > ${K(x, 3)}) = ${w2K(w2P(1 - c))}$` };
        else if (st.dir === "right") r = { x, P: 1 - c, a: x, b: Infinity, lines: [x], big: `$P(${rv} > ${K(x, 3)}) = ${w2K(w2P(1 - c))}$`,
          small: `a másik farok: $P(${rv} < ${K(x, 3)}) = ${w2K(w2P(c))}$` };
        else {
          const tail = Math.min(c, 1 - c), mid = d.sym ? (st.dist === "norm" ? st.m : 0) : null;
          const other = d.sym ? 2 * mid - x : d.inv(1 - c);
          const a = Math.min(x, other), b = Math.max(x, other);
          r = { x, a, b, P: 1 - 2 * tail, lines: [a, b], big: `$P(${K(a, 3)} < ${rv} < ${K(b, 3)}) = ${w2K(w2P(1 - 2 * tail))}$`,
            small: `a két farok együtt: $${w2K(w2P(2 * tail))}$ (mindkettőben $${w2K(w2P(tail))}$) – ez a kétoldali $p$-érték` };
        }
      }
      if (quiet) return r;
      shade = r;
      if (!r) { res.innerHTML = "–"; sub.textContent = "A valószínűség 0 és 1 között legyen (a határokat nem beleértve)."; }
      else { res.innerHTML = r.big; sub.innerHTML = `$${d.law()}$ &nbsp;·&nbsp; ${r.small}`; }
      window.Synopsis && (Synopsis.renderMath(res), Synopsis.renderMath(sub));
      cv.draw();
      return r;
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, d = D[st.dist];
      ctx.clearRect(0, 0, w, H);
      let [lo, hi] = d.range();
      const fin = shade ? shade.lines.filter(isFinite) : [];
      if (fin.length) {
        const span = hi - lo, mn = Math.min(...fin), mx = Math.max(...fin);
        if (mx > hi) hi = Math.min(mx + 0.12 * (mx - lo), lo + 60 * span);
        if (mn < lo && st.dist !== "chi2" && st.dist !== "f") lo = Math.max(mn - 0.12 * (hi - mn), hi - 60 * span);
      }
      if (d.sym) { const c = st.dist === "norm" ? st.m : 0, L = Math.max(c - lo, hi - c); lo = c - L; hi = c + L; }
      let ym = 0;
      for (let i = 3; i <= 300; i++) { const y = d.pdf(lo + (hi - lo) * i / 300); if (isFinite(y) && y > ym) ym = y; }
      ym *= 1.15;
      const box = { x0: 10, y0: 26, x1: w - 10, y1: H - 34 };
      const ticks = rangeTicks(lo, hi, w < 500 ? 5 : 9);
      const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax: ym, xticks: ticks, xfmt: v => w2Num(v, 3), xlabel: "x" });
      if (shade) {
        const a = Math.max(lo, shade.a), b = Math.min(hi, shade.b);
        w2Area(ctx, tx, ty, d.pdf, a, b, css("--accent"), 0.28, ym);
      }
      ctx.save(); ctx.beginPath(); ctx.rect(0, box.y0 - 6, w, box.y1 - box.y0 + 6); ctx.clip();
      curve(ctx, tx, ty, d.pdf, lo, hi, css("--accent"), 2.5);
      ctx.restore();
      if (!shade) return;
      const fin2 = shade.lines.filter(v => isFinite(v) && v >= lo && v <= hi);
      ctx.fillStyle = css("--text"); w2Font(ctx, 12, true); ctx.textBaseline = "bottom";
      fin2.forEach((v, i) => {
        vline(ctx, tx(v), box.y0, box.y1, css("--text"));
        const s = st.mode === "p" && v === st.x ? w2Num(v, 4) : w2F(v, 3), tw = ctx.measureText(s).width;
        let X = tx(v) - tw / 2;
        if (fin2.length === 2) X = i === 0 ? tx(v) - tw - 4 : tx(v) + 4;
        ctx.textAlign = "left"; ctx.fillText(s, w2Clamp(X, 2, w - tw - 2), box.y0 - 4);
      });
      // a terület felirata a satírozott részben
      const a = Math.max(lo, shade.a), b = Math.min(hi, shade.b);
      if (tx(b) - tx(a) > 12) {
        let xm = d.inv((d.cdf(a) + d.cdf(b)) / 2);
        if (!(xm > a && xm < b)) xm = (a + b) / 2;
        const yv = Math.min(d.pdf(xm), ym), hpx = ty(0) - ty(yv);
        const s = w2P(shade.P).replace(/\\cdot 10\^\{(-?\d+)\}/, "·10^$1");
        ctx.fillStyle = css("--accent"); w2Font(ctx, 12, true); ctx.textBaseline = "middle";
        if (hpx > 44 && tx(b) - tx(a) > 46) w2TextIn(ctx, s, tx(xm), ty(0) - hpx * 0.4, tx(a) + 2, tx(b) - 2);
        else { ctx.textBaseline = "bottom"; w2TextIn(ctx, s, tx(xm), Math.min(ty(yv) - 8, ty(0) - 14), box.x0, box.x1); }
      }
    };
    buildParams(); buildInput(); calc();
  };

  /* ------------------------------------------------------------------
     5.6-b  Bootstrap
     ------------------------------------------------------------------ */
  W["bootstrap"] = root => {
    header(root, "Bootstrap: újramintavétel a saját mintából",
      "Húzz a mintából visszatevéssel ugyanannyi elemet, és számold ki rá a statisztikát. Sokszor ismételve kiderül, mennyire ingadozik a statisztika.");
    const ING12 = [12, 15, 17, 18, 20, 22, 23, 25, 28, 34, 45, 61], SMALL = [2, 4, 9];
    const STATS = {
      mean: { name: "átlag", f: S.mean, sym: w2R`\bar x` },
      median: { name: "medián", f: S.median, sym: "\\mathrm{Me}" },
      sd: { name: "szórás", f: a => S.sd(a), sym: "s" }
    };
    let data = ING12.slice(), stat = "mean", boots = [], exact = false, anim = null, lastRes = null;
    const rnd = S.mulberry32(6), rndData = S.mulberry32(31);
    const dataSeg = segmented([["ing", "Ingázási idő (12 érték)"], ["small", "Kis minta: 2, 4, 9"]], "ing", v => { data = v === "small" ? SMALL.slice() : ING12.slice(); clear(); });
    const newB = btn("Új minta", () => { data = Array.from({ length: 12 }, () => Math.round(10 + S.rexp(rndData, 15))).sort((a, b) => a - b); dataSeg.set("rand"); clear(); });
    const statSeg = segmented([["mean", "átlag"], ["median", "medián"], ["sd", "szórás ($s$)"]], stat, v => { stat = v; finish(); draw(); });
    const allB = btn("Mind a 27 felsorolása", () => { finish(); enumerate(); });
    root.append(w2Ctl(dataSeg.el, newB), w2Ctl(h("span", { class: "muted", style: "font-size:.92rem" }, "statisztika:"), statSeg.el));
    const dataTxt = h("div", { class: "w-sub", style: "margin:.2rem 0 0" });
    root.append(dataTxt);
    const cvN = w2Canvas(root, w => (w < 500 ? 86 : 92));
    const resTxt = h("div", { class: "readout", style: "min-height:2.6em" });
    root.append(resTxt,
      w2Ctl(btn("1 bootstrap-minta", one, "btn primary"), btn("+100", () => { finish(); add(100); }), btn("+1000", () => { finish(); add(1000); }),
        btn("Ürít", () => { finish(); clear(); }), allB));
    const cvH = w2Canvas(root, w => w2Clamp(w * 0.36, 190, 260));
    root.append(w2Key([["bootstrap-statisztikák", "--setA"], ["az eredeti minta statisztikája", "--text", "line"], ["2,5% és 97,5% percentilis", "--setB", "dash"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    root.append(w2Note("Nem kell új mintát venni: a minta maga játssza a sokaság szerepét."));

    const sf = a => STATS[stat].f(a);
    const fd = v => w2F(v, 2);
    function clear() {
      finish(true); boots = []; exact = false; lastRes = null;
      allB.style.display = data.length === 3 ? "" : "none";
      dataTxt.innerHTML = `Eredeti minta ($n = ${data.length}$): ${data.join("; ")}`;
      window.Synopsis && Synopsis.renderMath(dataTxt);
      resTxt.textContent = "Nyomd meg az „1 bootstrap-minta” gombot: látni fogod, melyik elemet hányszor húztuk ki.";
      draw();
    }
    function drawIdx() { return Array.from({ length: data.length }, () => Math.floor(rnd() * data.length)); }
    function add(m) { if (exact) { boots = []; exact = false; } for (let i = 0; i < m; i++) boots.push(drawIdx()); lastRes = boots[boots.length - 1]; showRes(lastRes, lastRes.length); draw(); }
    function enumerate() {
      boots = []; exact = true;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) boots.push([i, j, k]);
      lastRes = null;
      resTxt.innerHTML = "Mind a $3^3 = 27$ sorrendezett újraminta egyformán valószínű – ez a bootstrap-eloszlás <b>pontosan</b>, szimuláció nélkül.";
      window.Synopsis && Synopsis.renderMath(resTxt);
      draw();
    }
    function showRes(idx, upto) {
      const vals = idx.slice(0, upto).map(i => data[i]);
      const done = upto === idx.length;
      resTxt.innerHTML = `Újraminta: ${vals.map(v => `<b>${v}</b>`).join("; ")}${done ? "" : " …"}` +
        (done ? ` &nbsp;→&nbsp; ${STATS[stat].name} = <b>${fd(sf(vals))}</b>` : "");
    }
    function one() {
      finish();
      if (exact) { boots = []; exact = false; }
      const idx = drawIdx(), dt = data.length <= 4 ? 380 : 140;
      anim = { idx, step: 0, timer: 0 };
      const tick = () => {
        anim.step++; showRes(idx, anim.step); drawN();
        if (anim.step < idx.length) anim.timer = setTimeout(tick, dt);
        else { anim.timer = setTimeout(() => finish(), dt); }
      };
      lastRes = idx; tick();
    }
    /* futó animáció lezárása (cancel: eldobja) */
    function finish(cancel) {
      if (!anim) return;
      clearTimeout(anim.timer);
      const a = anim; anim = null;
      if (!cancel) { boots.push(a.idx); lastRes = a.idx; showRes(a.idx, a.idx.length); }
      draw();
    }
    function draw() { drawN(); drawH(); }
    function drawN() {
      const ctx = cvN.ctx, w = cvN.w, H = cvN.h;
      ctx.clearRect(0, 0, w, H);
      const mn = Math.min(...data), mx = Math.max(...data), pad = Math.max(1, (mx - mn) * 0.06);
      const ticks = rangeTicks(mn - pad, mx + pad, w < 500 ? 5 : 8);
      const { tx } = axes(ctx, { x0: 12, y0: 4, x1: w - 12, y1: H - 26 }, { xmin: mn - pad, xmax: mx + pad, xticks: ticks, ymin: 0, ymax: 1, xfmt: v => w2Num(v, 2) });
      const idx = anim ? anim.idx.slice(0, anim.step) : lastRes || [];
      const cur = anim ? anim.idx[anim.step - 1] : -1;
      const cnt = new Array(data.length).fill(0); idx.forEach(i => cnt[i]++);
      const seen = {}, base = H - 26 - 9, placed = [];
      data.forEach((v, i) => {
        const lvl = seen[v] = (seen[v] || 0) + 1, x = tx(v), y = base - (lvl - 1) * 13;
        const on = cnt[i] > 0;
        w2Dot(ctx, x, y, i === cur ? 7.5 : 5.5, css(on ? (i === cur ? "--setB" : "--accent") : "--muted"));
        if (!on) { ctx.save(); ctx.globalAlpha = 0.45; w2Dot(ctx, x, y, 5.5, css("--card")); ctx.restore(); }
        if (cnt[i] > 0) {
          ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          let lv = 0; while (lv < 3 && placed.some(([px, pl]) => pl === lv && Math.abs(px - x) < 17)) lv++;
          placed.push([x, lv]);
          ctx.fillText("×" + cnt[i], x, y - 8 - lv * 11);
        }
      });
    }
    function drawH() {
      const ctx = cvH.ctx, w = cvH.w, H = cvH.h;
      ctx.clearRect(0, 0, w, H);
      const orig = sf(data), vals = boots.map(b => sf(b.map(i => data[i]))), R = vals.length;
      const items = [[`eredeti ${STATS[stat].name} $${STATS[stat].sym}$`, fd(orig)], ["ismétlések $R$", exact ? "27 (mind)" : groupDigits(R)]];
      let se = NaN, lo95 = NaN, hi95 = NaN;
      if (R > 1) {
        se = exact ? S.sd(vals, 0) : S.sd(vals);
        const sv = vals.slice().sort((a, b) => a - b);
        lo95 = quant(sv, 0.025); hi95 = quant(sv, 0.975);
      }
      items.push(["bootstrap SE (a statisztikák szórása)", R > 1 ? w2F(se, exact ? 3 : 2) : "–"]);
      if (stat === "mean") items.push([w2R`képlettel: $s/\sqrt{n}$`, w2F(S.sd(data) / Math.sqrt(data.length), exact ? 3 : 2)]);
      items.push(["95%-os percentilis-intervallum", R > 1 ? `[${fd(lo95)}; ${fd(hi95)}]` : "–"]);
      statRow(sEl, items);
      if (!R) { w2Placeholder(cvH, "Még nincs bootstrap-minta."); return; }
      // osztályozás: kevés különböző érték → oszlop értékenként
      const key = v => Math.round(v * 1e6) / 1e6, freq = new Map();
      vals.forEach(v => freq.set(key(v), (freq.get(key(v)) || 0) + 1));
      const distinct = [...freq.keys()].sort((a, b) => a - b);
      let xmin = Math.min(orig, ...distinct), xmax = Math.max(orig, ...distinct);
      if (xmax - xmin < 1e-9) { xmin -= 1; xmax += 1; }
      const pad = (xmax - xmin) * 0.06; xmin -= pad; xmax += pad;
      const discrete = distinct.length <= 30;
      let bars;
      if (discrete) {
        let gap = Infinity; for (let i = 1; i < distinct.length; i++) gap = Math.min(gap, distinct[i] - distinct[i - 1]);
        const bw = Math.min(isFinite(gap) ? gap * 0.8 : (xmax - xmin) * 0.05, (xmax - xmin) * 0.05);
        bars = distinct.map(v => [v - bw / 2, v + bw / 2, freq.get(v), v]);
      } else {
        const hs = histo(vals, xmin, xmax, 32);
        bars = hs.counts.map((c, i) => [xmin + i * hs.w, xmin + (i + 1) * hs.w, c]);
      }
      const ym = Math.max(...bars.map(b => b[2])) * (exact ? 1.25 : 1.12);
      const box = { x0: 36, y0: 14, x1: w - 10, y1: H - 34 };
      const { tx, ty } = axes(ctx, box, { xmin, xmax, ymin: 0, ymax: ym, xticks: rangeTicks(xmin, xmax, w < 500 ? 5 : 8), xfmt: v => w2Num(v, 2),
        yticks: rangeTicks(0, ym, 4).filter(v => v < ym && Number.isInteger(v)), ylabel: exact ? "db (a 27-ből)" : "db", xlabel: STATS[stat].name });
      ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = css("--setA");
      bars.forEach(([a, b, c]) => { if (c) ctx.fillRect(tx(a) + 0.5, ty(c), Math.max(1.5, tx(b) - tx(a) - 1), ty(0) - ty(c)); });
      ctx.restore();
      if (exact) {
        ctx.fillStyle = css("--text"); w2Font(ctx, 11, true); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        let lastX = -1e9;
        bars.forEach(([a, b, c, v]) => { const x = tx(v); if (x - lastX > 30) { ctx.fillText(`${c}/27`, x, ty(c) - 2); lastX = x; } });
      }
      vline(ctx, tx(orig), box.y0, box.y1, css("--text"));
      if (R > 1) [lo95, hi95].forEach(v => vline(ctx, tx(v), box.y0, box.y1, css("--setB"), true));
    }
    cvN.draw = drawN; cvH.draw = drawH;
    clear();
  };

  /* ------------------------------------------------------------------
     5.7-b  Regresszió a középhez
     ------------------------------------------------------------------ */
  W["regression-mean"] = root => {
    header(root, "Regresszió a középhez: tehetség + szerencse",
      w2R`200 kitalált játékos: mindegyiknek van egy állandó tehetsége ($T$), és fordulónként más-más szerencséje ($L_1$, $L_2$). Pontszám: $X_i = T + L_i$.`);
    let sT = 10, sL = 10, seed = 1, zT, z1, z2;
    const tR = sliderRow(w2R`tehetség szórása $\sigma_T$:`, 0, 20, 1, sT, v => v, v => { sT = v; cv.draw(); });
    const lR = sliderRow(w2R`szerencse szórása $\sigma_L$:`, 0, 20, 1, sL, v => v, v => { sL = v; cv.draw(); });
    root.append(w2Ctl(tR.wrap), w2Ctl(lR.wrap), w2Ctl(btn("Új szezon", () => { seed++; gen(); cv.draw(); }, "btn primary")));
    const wide = w => w >= 560;
    const cv = w2Canvas(root, w => (wide(w) ? Math.min(w * 0.6, 430) : w + 200));
    root.append(w2Key([["felső 10% (1. forduló szerint)", "--setB"], ["alsó 10%", "--setA"], ["többiek", "--muted"], ["$y = x$ (ha nem lenne szerencse)", "--muted", "dash"],
      [w2R`előrejelzés: $50 + r\,(x_1 - 50)$`, "--accent", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["$r$ (mintabeli)", w2R`elméleti $r = \dfrac{\sigma_T^2}{\sigma_T^2+\sigma_L^2}$`, "felső 10%: 1. → 2. forduló", "alsó 10%: 1. → 2. forduló",
      w2R`előrejelzés $50 + r\,(\bar x_1 - 50)$`]);
    root.append(w2Note("Minél nagyobb a szerencse szerepe, annál erősebb a visszahúzás – senki sem „romlott el”, csak a szerencse nem ismétlődik."));

    function gen() {
      const r = S.mulberry32(9000 + seed);
      zT = []; z1 = []; z2 = [];
      for (let i = 0; i < 200; i++) { zT.push(S.rnorm(r)); z1.push(S.rnorm(r)); z2.push(S.rnorm(r)); }
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h;
      ctx.clearRect(0, 0, w, H);
      const X1 = zT.map((t, i) => 50 + sT * t + sL * z1[i]), X2 = zT.map((t, i) => 50 + sT * t + sL * z2[i]);
      const order = X1.map((v, i) => i).sort((a, b) => X1[a] - X1[b]);
      const bot = order.slice(0, 20), top = order.slice(-20), grp = new Array(200).fill(0);
      bot.forEach(i => (grp[i] = -1)); top.forEach(i => (grp[i] = 1));
      const tot = Math.sqrt(sT * sT + sL * sL), Rg = Math.max(10, Math.ceil(3.3 * tot / 10) * 10);
      const lo = 50 - Rg, hi = 50 + Rg;
      const rho = tot > 0 ? sT * sT / (tot * tot) : NaN, rs = pearson(X1, X2);
      const m = (a, idx) => S.mean(idx.map(i => a[i]));
      const T1 = m(X1, top), T2 = m(X2, top), B1 = m(X1, bot), B2 = m(X2, bot);
      // elrendezés
      const side = wide(w) ? Math.min(H, w * 0.6) : w;
      const sb = { x0: 36, y0: 24, x1: side - 10, y1: side - 34 };
      const ticks = rangeTicks(lo, hi, side < 400 ? 5 : 6);
      const { tx, ty } = axes(ctx, sb, { xmin: lo, xmax: hi, ymin: lo, ymax: hi, xticks: ticks, yticks: ticks, xlabel: "1. forduló (x₁)", ylabel: "2. forduló (x₂)" });
      ctx.save(); ctx.beginPath(); ctx.rect(sb.x0, sb.y0, sb.x1 - sb.x0, sb.y1 - sb.y0); ctx.clip();
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(tx(lo), ty(lo)); ctx.lineTo(tx(hi), ty(hi)); ctx.stroke(); ctx.restore();
      if (isFinite(rho)) { ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx(lo), ty(50 + rho * (lo - 50))); ctx.lineTo(tx(hi), ty(50 + rho * (hi - 50))); ctx.stroke(); }
      const pr = side < 400 ? 2.4 : 2.9, cM = css("--muted"), cA = css("--setA"), cB = css("--setB");
      ctx.save(); ctx.globalAlpha = 0.45; X1.forEach((x, i) => grp[i] === 0 && w2Dot(ctx, tx(x), ty(X2[i]), pr, cM)); ctx.restore();
      X1.forEach((x, i) => grp[i] !== 0 && w2Dot(ctx, tx(x), ty(X2[i]), pr + 0.6, grp[i] > 0 ? cB : cA));
      // csoportátlagok
      [[T1, T2, cB], [B1, B2, cA]].forEach(([a, b, c]) => {
        ctx.strokeStyle = css("--text"); ctx.lineWidth = 2; w2Dot(ctx, tx(a), ty(b), 6, c);
        ctx.beginPath(); ctx.arc(tx(a), ty(b), 6, 0, 2 * Math.PI); ctx.stroke();
      });
      ctx.restore();
      // lejtődiagram
      const sl = wide(w) ? { x0: side + 34, y0: 24, x1: w - 14, y1: side - 34 } : { x0: 36, y0: side + 16, x1: w - 10, y1: H - 26 };
      const syt = v => sl.y1 - (v - lo) / (hi - lo) * (sl.y1 - sl.y0);
      const c1 = sl.x0 + (sl.x1 - sl.x0) * 0.22, c2 = sl.x0 + (sl.x1 - sl.x0) * 0.78;
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("1. forduló", c1, sl.y1 + 6); ctx.fillText("2. forduló", c2, sl.y1 + 6);
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sl.x0, syt(50)); ctx.lineTo(sl.x1, syt(50)); ctx.stroke(); ctx.restore();
      ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("átlag: 50", sl.x0, syt(50) - 2);
      // feliratok szétválasztása, ha túl közel esnének
      const lab = (u, v) => { let p = syt(u), q = syt(v); if (Math.abs(p - q) < 14) { const m = (p + q) / 2, sg = p <= q ? -1 : 1; p = m + sg * 7; q = m - sg * 7; } return [p, q]; };
      const [ly1T, ly1B] = lab(T1, B1), [ly2T, ly2B] = lab(T2, B2);
      [[T1, T2, cB, ly1T, ly2T], [B1, B2, cA, ly1B, ly2B]].forEach(([a, b, c, la, lb]) => {
        ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c1, syt(a)); ctx.lineTo(c2, syt(b)); ctx.stroke();
        w2Dot(ctx, c1, syt(a), 5, c); w2Dot(ctx, c2, syt(b), 5, c);
        if (isFinite(rho)) { const pv = 50 + rho * (a - 50); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c2, syt(pv), 8, 0, 2 * Math.PI); ctx.stroke(); }
        ctx.fillStyle = css("--text"); w2Font(ctx, 12, true); ctx.textBaseline = "middle";
        ctx.textAlign = "right"; ctx.fillText(w2F(a, 1), c1 - 9, la);
        ctx.textAlign = "left"; ctx.fillText(w2F(b, 1), c2 + 11, lb);
      });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 10); ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("○ = előrejelzés", (c1 + c2) / 2, sl.y0);
      const ar = (a, b) => `${w2F(a, 1)} → ${w2F(b, 1)}`;
      setS([isFinite(rs) ? w2F(rs, 3) : "–", isFinite(rho) ? w2F(rho, 3) : "–", ar(T1, T2), ar(B1, B2),
        isFinite(rho) ? `${w2F(50 + rho * (T1 - 50), 1)} és ${w2F(50 + rho * (B1 - 50), 1)}` : "–"]);
    };
    gen(); cv.draw();
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
