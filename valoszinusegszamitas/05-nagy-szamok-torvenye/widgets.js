/* =========================================================
   5. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 1–4. fejezet mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 4) => (isFinite(x) ? (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(".", ",").replace(/^-(0,0*)$/, "$1") : "–");
  const pct = (x, d = 1) => fmt(x * 100, d) + "%";
  const num = (x, d = 4) => fmt(x, d).replace(",", "{,}"); // tizedesvessző KaTeX-ben
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const render = el => window.Synopsis && Synopsis.renderMath(el);
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
      const w = Math.min(maxW, parent.clientWidth || maxW);
      const hh = Math.round(w * aspect);
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      c.style.width = w + "px"; c.style.height = hh + "px";
      obj.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      obj.w = w; obj.h = hh; obj.dpr = dpr;
    };
    obj.resize();
    redrawers.push(() => { obj.resize(); obj.draw && obj.draw(); });
    return obj;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => redrawers.forEach(f => f()), 150); });
  new MutationObserver(() => redrawers.forEach(f => f())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const niceTicks = (max, n = 4) => {
    const raw = max / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * p).find(s => max / s <= n);
    const t = []; for (let v = 0; v <= max + 1e-12; v += step) t.push(+v.toPrecision(10));
    return t;
  };
  const rangeTicks = (lo, hi, n = 8) => {
    const raw = (hi - lo) / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * p).find(s => (hi - lo) / s <= n);
    const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-12; v += step) t.push(+v.toPrecision(10));
    return t;
  };
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", xlog = false }) {
    const { x0, y0, x1, y1 } = box;
    const tx = xlog ? v => x0 + (Math.log10(v) - Math.log10(xmin)) / (Math.log10(xmax) - Math.log10(xmin)) * (x1 - x0)
                    : v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => { ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke(); ctx.fillText(String(v).replace(".", ",").replace("-", "−"), x0 - 5, ty(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(groupDigits(String(v).replace(".", ",").replace("-", "−")), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 4); }
    return { tx, ty };
  }
  function curve(ctx, tx, ty, f, lo, hi, color, width = 2.2, N = 300) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lo + (hi - lo) * i / N; i ? ctx.lineTo(tx(x), ty(f(x))) : ctx.moveTo(tx(x), ty(f(x))); }
    ctx.stroke();
  }
  function dashed(ctx, x0, y0, x1, y1, color) {
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
  }
  const logTicks = max => { const t = []; for (let v = 1; v <= max; v *= 10) t.push(v); return t; };

  /* ---------- Eloszlásfüggvények ---------- */
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const PhiInv = p => { let lo = -10, hi = 10; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; Phi(m) < p ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  const randn = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
  const LF = [0];
  const lfact = n => { for (let i = LF.length; i <= n; i++) LF[i] = LF[i - 1] + Math.log(i); return LF[n]; };
  const binom = (k, n, p) => Math.exp(lfact(n) - lfact(k) - lfact(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p));

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     5.1  Markov-egyenlőtlenség – a korlát és a valóság
     ------------------------------------------------------------------ */
  const MK = [
    { name: "exponenciális, E(X) = 8 (Obádovics példája)", m: 8, s: 8, tail: c => Math.exp(-c / 8), cmax: 60, f: x => (x >= 0 ? Math.exp(-x / 8) / 8 : 0), c0: 52 },
    { name: "egyenletes a [0; 16]-on", m: 8, s: 16 / Math.sqrt(12), tail: c => Math.min(1, Math.max(0, (16 - c) / 16)), cmax: 20, f: x => (x >= 0 && x <= 16 ? 1 / 16 : 0), c0: 12 },
    { name: "kockadobás", m: 3.5, s: Math.sqrt(35 / 12), tail: c => [1, 2, 3, 4, 5, 6].filter(x => x >= c).length / 6, cmax: 7, xs: [1, 2, 3, 4, 5, 6], ps: [1, 1, 1, 1, 1, 1].map(v => v / 6), c0: 6 },
    { name: "„éles” eset: 0 vagy 10, P(X = 10) = 0,2", m: 2, s: 4, tail: c => (c <= 0 ? 1 : c <= 10 ? 0.2 : 0), cmax: 12, xs: [0, 10], ps: [0.8, 0.2], c0: 10 }
  ];
  W["markov"] = root => {
    header(root, "Markov és Csebisev: mennyire jók a korlátok?", "Nemnegatív $X$-re a Markov-egyenlőtlenség: $P(X \\ge c) \\le \\tfrac{E(X)}{c}$. Ha a szórást is ismerjük és $c \\gt E(X)$, a Csebisev-egyenlőtlenség is ad korlátot: $P(X \\ge c) \\le \\tfrac{D^2(X)}{(c - E(X))^2}$. Hasonlítsd össze a <b>valódi</b> valószínűséggel!");
    const sel = h("select"); MK.forEach((d, i) => sel.append(h("option", { value: i }, d.name)));
    const rc = slider(0.1, 60, "any", 52), lc = h("b");
    root.append(h("div", { class: "controls" }, sel), h("div", { class: "controls" }, h("label", null, "c =", rc, lc)));
    const cv = makeCanvas(root, 0.36);
    const barsEl = h("div", { class: "bound-bars" });
    const out = h("div", { class: "readout" });
    root.append(barsEl, out);
    const D = () => MK[+sel.value];
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const d = D(), c = +rc.value, box = { x0: 44, y0: 12, x1: w - 10, y1: H - 24 };
      if (d.xs) {
        const { tx, ty } = axes(ctx, box, { xmin: -0.5, xmax: d.cmax, ymin: 0, ymax: Math.max(...d.ps) * 1.2, yticks: niceTicks(Math.max(...d.ps) * 1.2, 3), xticks: rangeTicks(0, d.cmax, 10).filter(Number.isInteger) });
        d.xs.forEach((x, i) => { ctx.strokeStyle = css(x >= c ? "--setB" : "--accent"); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(tx(x), ty(0)); ctx.lineTo(tx(x), ty(d.ps[i])); ctx.stroke(); });
        dashed(ctx, tx(c), box.y0, tx(c), box.y1, css("--bad")); dashed(ctx, tx(d.m), box.y0, tx(d.m), box.y1, css("--setC"));
      } else {
        let fm = 0; for (let i = 0; i <= 200; i++) fm = Math.max(fm, d.f(d.cmax * i / 200));
        const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: d.cmax, ymin: 0, ymax: fm * 1.15, yticks: niceTicks(fm * 1.15, 3), xticks: rangeTicks(0, d.cmax, 8) });
        ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(tx(c), ty(0));
        for (let i = 0; i <= 150; i++) { const x = c + (d.cmax - c) * i / 150; ctx.lineTo(tx(x), ty(d.f(x))); }
        ctx.lineTo(tx(d.cmax), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        curve(ctx, tx, ty, d.f, 0, d.cmax, css("--accent"));
        dashed(ctx, tx(c), box.y0, tx(c), box.y1, css("--bad")); dashed(ctx, tx(d.m), box.y0, tx(d.m), box.y1, css("--setC"));
      }
    };
    function bar(label, v, col) {
      const w = Math.max(0, Math.min(1, v));
      return `<div class="bb-row"><span class="bb-l">${label}</span><span class="bb-track"><span style="width:${w * 100}%;background:var(${col})"></span></span><b>${v > 1 ? "> 1 (semmitmondó)" : fmt(v, 4)}</b></div>`;
    }
    function upd() {
      const d = D(); rc.max = d.cmax; const c = Math.min(+rc.value, d.cmax); lc.textContent = fmt(c, 2);
      const exact = d.tail(c), mk = d.m / c, ch = c > d.m ? d.s * d.s / (c - d.m) ** 2 : NaN;
      barsEl.innerHTML = bar("valódi P(X ≥ c)", exact, "--setB") + bar("Markov-korlát E(X)/c", mk, "--setA") + (isFinite(ch) ? bar("Csebisev-korlát D²/(c − E)²", ch, "--setC") : `<div class="bb-row muted">Csebisev-korlát csak c &gt; E(X) esetén.</div>`);
      out.innerHTML = tex(`E(X) = ${num(d.m, 2)},\\ D(X) = ${num(d.s, 2)}`) + ` · A korlát mindig ≥ a valódi érték – de lehet, hogy sokszorosa. ` +
        (d.name.startsWith("„éles") ? "Ennél az eloszlásnál c = 10-nél a Markov-korlát pontosan egyenlő a valódi valószínűséggel: a korlát <b>nem javítható</b>." : "");
      cv.draw();
    }
    sel.onchange = () => { const d = D(); rc.max = d.cmax; rc.value = d.c0; upd(); };
    rc.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     5.1  Csebisev-egyenlőtlenség különböző eloszlásokra
     ------------------------------------------------------------------ */
  const CH = [
    { name: "normális", m: 0, s: 1, tail: k => 2 * (1 - Phi(k)), f: x => phi(x), lo: -4, hi: 4 },
    { name: "egyenletes a [0; 1]-en", m: 0.5, s: 1 / Math.sqrt(12), tail: k => Math.max(0, 1 - 2 * k / Math.sqrt(12)), f: x => (x >= 0 && x <= 1 ? 1 : 0), lo: -0.3, hi: 1.3 },
    { name: "exponenciális (λ = 1)", m: 1, s: 1, tail: k => Math.exp(-(1 + k)) + (k < 1 ? 1 - Math.exp(-(1 - k)) : 0), f: x => (x >= 0 ? Math.exp(-x) : 0), lo: -0.5, hi: 6 },
    { name: "kockadobás", m: 3.5, s: Math.sqrt(35 / 12), xs: [1, 2, 3, 4, 5, 6], ps: Array(6).fill(1 / 6), lo: 0, hi: 7 },
    { name: "„éles” eset: −2, 0, 2 (P(±2) = 1/8)", m: 0, s: 1, xs: [-2, 0, 2], ps: [1 / 8, 3 / 4, 1 / 8], lo: -3, hi: 3 }
  ];
  W["chebyshev"] = root => {
    header(root, "Csebisev-egyenlőtlenség", "Mekkora eséllyel tér el $X$ a várható értékétől legalább $k$ szórásnyira? Csebisev szerint <b>bármely</b> eloszlásra legfeljebb $\\tfrac{1}{k^2}$. A kiemelt rész a valódi valószínűség.");
    const sel = h("select"); CH.forEach((d, i) => sel.append(h("option", { value: i }, d.name)));
    const rk = slider(1, 5, 0.05, 2), lk = h("b");
    root.append(h("div", { class: "controls" }, sel, h("label", null, "k =", rk, lk)));
    const cv = makeCanvas(root, 0.36);
    const out = h("div", { class: "readout" });
    root.append(out);
    const D = () => CH[+sel.value];
    const exact = (d, k) => (d.xs ? d.xs.reduce((a, x, i) => a + (Math.abs(x - d.m) >= k * d.s - 1e-12 ? d.ps[i] : 0), 0) : d.tail(k));
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const d = D(), k = +rk.value, a = d.m - k * d.s, b = d.m + k * d.s, box = { x0: 44, y0: 12, x1: w - 10, y1: H - 24 };
      if (d.xs) {
        const ym = Math.max(...d.ps) * 1.15;
        const { tx, ty } = axes(ctx, box, { xmin: d.lo, xmax: d.hi, ymin: 0, ymax: ym, yticks: niceTicks(ym, 3), xticks: rangeTicks(d.lo, d.hi, 8).filter(Number.isInteger) });
        d.xs.forEach((x, i) => { ctx.strokeStyle = css(Math.abs(x - d.m) >= k * d.s - 1e-12 ? "--setB" : "--accent"); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(tx(x), ty(0)); ctx.lineTo(tx(x), ty(d.ps[i])); ctx.stroke(); });
        [a, b].forEach(x => dashed(ctx, tx(x), box.y0, tx(x), box.y1, css("--bad")));
      } else {
        let fm = 0; for (let i = 0; i <= 200; i++) fm = Math.max(fm, d.f(d.lo + (d.hi - d.lo) * i / 200));
        const { tx, ty } = axes(ctx, box, { xmin: d.lo, xmax: d.hi, ymin: 0, ymax: fm * 1.15, yticks: niceTicks(fm * 1.15, 3), xticks: rangeTicks(d.lo, d.hi, 8) });
        const shade = (u, v) => { if (v <= u) return; ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.moveTo(tx(u), ty(0)); for (let i = 0; i <= 100; i++) { const x = u + (v - u) * i / 100; ctx.lineTo(tx(x), ty(d.f(x))); } ctx.lineTo(tx(v), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
        shade(d.lo, Math.min(a, d.hi)); shade(Math.max(b, d.lo), d.hi);
        curve(ctx, tx, ty, d.f, d.lo, d.hi, css("--accent"));
        [a, b].forEach(x => { if (x > d.lo && x < d.hi) dashed(ctx, tx(x), box.y0, tx(x), box.y1, css("--bad")); });
      }
    };
    function upd() {
      const d = D(), k = +rk.value; lk.textContent = fmt(k, 2);
      const e = exact(d, k), bnd = 1 / (k * k);
      out.innerHTML = tex(`P\\big(|X - E(X)| \\ge ${num(k, 2)}\\,D(X)\\big) = ${num(e, 4)} \\;\\le\\; \\frac{1}{k^2} = ${num(bnd, 4)}`) +
        ` · a korlát a valódi érték ${e > 1e-9 ? `<b>${fmt(bnd / e, 1)}-szorosa</b>` : "<b>végtelenszerese</b> (a valódi valószínűség 0)"}.` +
        `<br><small>Összevetés a normális eloszlás „68–95–99,7” szabályával: Csebisev csak annyit garantál, hogy 2 szóráson belül <em>legalább</em> 75%, 3 szóráson belül <em>legalább</em> 88,9% esik – bármilyen eloszlásnál.</small>`;
      cv.draw();
    }
    sel.onchange = rk.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     5.2  A nagy számok törvénye – sok átlag-pálya egyszerre
     ------------------------------------------------------------------ */
  const LLN = [
    { name: "pénzfeldobás (fej = 1)", m: 0.5, s: 0.5, eps: 0.05, gen: () => (Math.random() < 0.5 ? 1 : 0) },
    { name: "kockadobás", m: 3.5, s: Math.sqrt(35 / 12), eps: 0.2, gen: () => 1 + Math.floor(Math.random() * 6) },
    { name: "exponenciális várakozási idő (E = 1)", m: 1, s: 1, eps: 0.1, gen: () => -Math.log(1 - Math.random()) }
  ];
  W["lln-paths"] = root => {
    header(root, "A nagy számok törvénye – 40 kísérletsorozat egyszerre", "Mindegyik színes vonal egy-egy hosszú kísérletsorozat <b>futó átlaga</b>. A zöld sáv a várható érték $\\pm\\varepsilon$ környezete. A törvény azt mondja: bármilyen kicsi $\\varepsilon$-ra, ha $n$ elég nagy, a sávon kívül eső sorozatok aránya 0-hoz tart.");
    const sel = h("select"); LLN.forEach((d, i) => sel.append(h("option", { value: i }, d.name)));
    const re = slider(0.01, 1, 0.01, 0.05), le = h("b");
    const rn = slider(0, 1, 0.001, 0.5), ln = h("b");
    root.append(h("div", { class: "controls" }, sel, btn("🔁 Új sorozatok", sim, "btn primary")),
      h("div", { class: "controls" }, h("label", null, "ε =", re, le), h("label", null, "vizsgált n =", rn, ln)));
    const cv = makeCanvas(root, 0.46);
    const out = h("div", { class: "readout" });
    root.append(out);
    const P = 40, N = 10000;
    let paths = [];
    function sim() {
      const d = LLN[+sel.value]; paths = [];
      for (let j = 0; j < P; j++) { const a = new Float32Array(N); let s = 0; for (let i = 0; i < N; i++) { s += d.gen(); a[i] = s / (i + 1); } paths.push(a); }
      upd();
    }
    const nAt = () => Math.max(1, Math.round(Math.pow(10, +rn.value * 4)));
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const d = LLN[+sel.value], eps = +re.value, n = nAt();
      const span = Math.max(2.2 * d.s, eps * 1.6), box = { x0: 44, y0: 12, x1: w - 12, y1: H - 30 };
      const { tx, ty } = axes(ctx, box, { xmin: 1, xmax: N, ymin: d.m - span, ymax: d.m + span, xlog: true, xticks: logTicks(N), yticks: rangeTicks(d.m - span, d.m + span, 6), xlabel: "n (kísérletek száma)" });
      ctx.fillStyle = css("--setC"); ctx.globalAlpha = 0.18; ctx.fillRect(box.x0, ty(d.m + eps), box.x1 - box.x0, ty(d.m - eps) - ty(d.m + eps)); ctx.globalAlpha = 1;
      ctx.save(); ctx.beginPath(); ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0); ctx.clip();
      paths.forEach((a, j) => {
        ctx.strokeStyle = `hsla(${(j * 37) % 360}, 65%, 55%, .55)`; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = 0; i < N; i += i < 100 ? 1 : i < 1000 ? 5 : 25) { const x = tx(i + 1), y = ty(a[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      });
      ctx.restore();
      dashed(ctx, tx(n), box.y0, tx(n), box.y1, css("--text"));
    };
    function upd() {
      const d = LLN[+sel.value], eps = +re.value, n = nAt();
      le.textContent = fmt(eps, 2); ln.textContent = groupDigits(n);
      cv.draw();
      if (!paths.length) return;
      const outside = paths.filter(a => Math.abs(a[n - 1] - d.m) >= eps).length / P;
      const cheb = Math.min(1, d.s * d.s / (n * eps * eps)), clt = 2 * (1 - Phi(eps * Math.sqrt(n) / d.s));
      out.innerHTML = `n = ${groupDigits(n)}-nél a 40 sorozatból <b>${Math.round(outside * P)}</b> van a sávon kívül (${pct(outside, 0)}). ` +
        `Csebisev-korlát: ${tex(`\\frac{D^2(X)}{n\\varepsilon^2} = ${num(cheb, 3)}`)} · normális közelítés (4.4): ${tex(`2\\left(1 - \\Phi\\!\\left(\\tfrac{\\varepsilon\\sqrt n}{\\sigma}\\right)\\right) \\approx ${num(clt, 3)}`)}`;
    }
    sel.onchange = () => { re.value = LLN[+sel.value].eps; sim(); }; re.oninput = upd; rn.oninput = upd;
    sim();
  };

  /* ------------------------------------------------------------------
     5.2  „Kiegyenlítődik-e?” – abszolút és relatív eltérés
     ------------------------------------------------------------------ */
  W["law-of-averages"] = root => {
    header(root, "Kiegyenlítődnek-e a fejek és az írások?", "Egy érmét $n$-szer feldobunk. Fent a fejek számának eltérése az $n/2$-től (<b>abszolút</b> eltérés), lent a fejek arányának eltérése az $1/2$-től (<b>relatív</b> eltérés). Mindkét tengely logaritmikus. A szaggatott vonal a „tipikus” nagyság.");
    root.append(h("div", { class: "controls" }, btn("🪙 Új sorozat (100 000 dobás)", sim, "btn primary")));
    const cv1 = makeCanvas(root, 0.3), cv2 = makeCanvas(root, 0.3);
    const out = h("div", { class: "readout" });
    root.append(out);
    const N = 100000;
    let dev = null;
    function sim() { dev = new Float64Array(N); let H = 0; for (let i = 0; i < N; i++) { H += Math.random() < 0.5; dev[i] = H - (i + 1) / 2; } draw(); }
    function panel(cv, f, ref, ylab, ymin, ymax) {
      const { ctx, w, h: Hh } = cv; ctx.clearRect(0, 0, w, Hh);
      const box = { x0: 52, y0: 12, x1: w - 12, y1: Hh - 26 };
      const ly = v => Math.log10(Math.max(v, ymin));
      const yt = []; for (let e = Math.ceil(Math.log10(ymin)); e <= Math.log10(ymax); e++) yt.push(e);
      const { tx, ty } = axes(ctx, box, { xmin: 1, xmax: N, ymin: Math.log10(ymin), ymax: Math.log10(ymax), xlog: true, xticks: logTicks(N), ylabel: ylab });
      ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      yt.forEach(e => { ctx.strokeStyle = css("--border"); ctx.beginPath(); ctx.moveTo(box.x0, ty(e)); ctx.lineTo(box.x1, ty(e)); ctx.stroke(); ctx.fillText(String(10 ** e).replace(".", ","), box.x0 - 5, ty(e)); });
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 0; i < N; i += i < 1000 ? 1 : 20) { const x = tx(i + 1), y = ty(ly(f(i))); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.8; ctx.beginPath();
      for (let k = 0; k <= 200; k++) { const n = Math.pow(10, 5 * k / 200); k ? ctx.lineTo(tx(n), ty(ly(ref(n)))) : ctx.moveTo(tx(n), ty(ly(ref(n)))); }
      ctx.stroke(); ctx.restore();
    }
    function draw() {
      if (!dev) return;
      cv1.draw = () => panel(cv1, i => Math.abs(dev[i]), n => 0.5 * Math.sqrt(n), "|fejek − n/2|", 0.1, 1000);
      cv2.draw = () => panel(cv2, i => Math.abs(dev[i]) / (i + 1), n => 0.5 / Math.sqrt(n), "|fejek/n − 1/2|", 1e-5, 1);
      cv1.draw(); cv2.draw();
      const pick = [100, 1000, 10000, 100000];
      out.innerHTML = pick.map(n => `n = ${groupDigits(n)}: eltérés <b>${fmt(dev[n - 1], 0)}</b> fej, arányban <b>${fmt(Math.abs(dev[n - 1]) / n, 4)}</b>`).join("<br>") +
        `<br><small>Az abszolút eltérés tipikusan $\\tfrac{\\sqrt n}{2}$-vel <b>nő</b>, a relatív eltérés $\\tfrac{1}{2\\sqrt n}$-nel <b>csökken</b>. A törvény az arányokról szól, nem a darabszámokról – a fejek és írások száma nem „egyenlítődik ki”.</small>`;
      render(out);
    }
    sim();
  };

  /* ------------------------------------------------------------------
     5.3  Mintanagyság: Csebisev vagy normális közelítés?
     ------------------------------------------------------------------ */
  const SS_PRESETS = [["Kocka – hatos (Obádovics)", 1 / 6, 0.15, 0.75], ["Gumikesztyű (V.5.3)", 0.1, 0.02, 0.95], ["Közvélemény-kutatás", 0.5, 0.03, 0.95]];
  W["sample-size"] = root => {
    header(root, "Hány kísérlet kell?", "Azt szeretnénk, hogy egy $p$ valószínűségű esemény $k/n$ relatív gyakorisága legalább $1 - \\delta$ valószínűséggel $\\varepsilon$-nál közelebb legyen $p$-hez. Csebisev szerint elég $n \\ge \\tfrac{pq}{\\varepsilon^2\\delta}$; a normális közelítéssel (4.4) $n \\ge \\left(\\tfrac{z}{\\varepsilon}\\right)^2 pq$, ahol $\\Phi(z) = 1 - \\tfrac\\delta2$.");
    const ip = h("input", { type: "number", step: "any", min: 0.001, max: 0.999, value: 0.1 }), ie = h("input", { type: "number", step: "any", min: 0.001, value: 0.02 }), ic = h("input", { type: "number", step: "any", min: 0.5, max: 0.999, value: 0.95 });
    root.append(h("div", { class: "controls" }, "Példák: ", ...SS_PRESETS.map(([l, p, e, c]) => btn(l, () => { ip.value = +p.toFixed(6); ie.value = e; ic.value = c; upd(); }))),
      h("div", { class: "controls" }, h("label", null, "p =", ip), h("label", null, "ε =", ie), h("label", null, "megbízhatóság 1 − δ =", ic)),
      h("div", { class: "controls" }, btn("🎲 Ellenőrzés szimulációval (2000 kísérletsorozat mindkét n-nel)", sim, "btn primary")));
    const out = h("div", { class: "readout" });
    const simOut = h("div", { class: "stat-row" });
    root.append(out, simOut);
    let nC = 0, nN = 0;
    const vals = () => { const p = Math.min(0.999, Math.max(0.001, +ip.value || 0.5)), e = Math.max(0.001, +ie.value || 0.05), c = Math.min(0.999, Math.max(0.5, +ic.value || 0.95)); return { p, e, c, d: 1 - c }; };
    function upd() {
      const { p, e, c, d } = vals(), q = 1 - p, z = PhiInv(1 - d / 2);
      nC = Math.ceil(p * q / (e * e * d) - 1e-9); nN = Math.ceil((z / e) ** 2 * p * q - 1e-9);
      out.innerHTML = `Csebisev: ${tex(`n \\ge \\frac{${num(p * q, 4)}}{${num(e, 3)}^2\\cdot ${num(d, 3)}} = ${num(p * q / (e * e * d), 1)}`)} → <b>${groupDigits(nC)}</b> &nbsp;·&nbsp; ` +
        `normális közelítés: ${tex(`n \\ge \\left(\\frac{${num(z, 3)}}{${num(e, 3)}}\\right)^2\\cdot ${num(p * q, 4)} = ${num((z / e) ** 2 * p * q, 1)}`)} → <b>${groupDigits(nN)}</b>` +
        `<br><small>A Csebisev-féle szám <em>biztosan</em> elég (bármilyen eloszlásnál), de pazarló: itt a normális közelítéshez képest kb. ${fmt(nC / nN, 1)}-szer több kísérletet kér.</small>`;
      simOut.innerHTML = "";
    }
    function sim() {
      const { p, e } = vals(), T = 2000;
      // gyors binomiális mintavétel: előre kiszámolt eloszlásfüggvénnyel
      const sampler = n => { const F = new Float64Array(n + 1); let s = 0; for (let j = 0; j <= n; j++) { s += binom(j, n, p); F[j] = s; }
        return () => { const u = Math.random(); let lo = 0, hi = n; while (lo < hi) { const mid = (lo + hi) >> 1; F[mid] < u ? (lo = mid + 1) : (hi = mid); } return lo; }; };
      const res = [nC, nN].map(n => { const draw = sampler(n); let ok = 0; for (let t = 0; t < T; t++) ok += Math.abs(draw() / n - p) < e; return ok / T; });
      simOut.innerHTML = [[`n = ${groupDigits(nC)} (Csebisev)`, res[0]], [`n = ${groupDigits(nN)} (normális)`, res[1]]]
        .map(([l, v]) => `<div class="stat"><div class="v">${pct(v, 1)}</div><div class="l">${l}: ennyi sorozatban volt |k/n − p| &lt; ε</div></div>`).join("");
    }
    [ip, ie, ic].forEach(e => (e.oninput = upd));
    upd();
  };

  /* ------------------------------------------------------------------
     5.3  Buffon tűje – π becslése véletlen tűkkel
     ------------------------------------------------------------------ */
  W["buffon"] = root => {
    header(root, "Buffon tűje", "Párhuzamos egyenesek ($d$ távolságra) közé $\\ell \\le d$ hosszú tűket ejtünk. Annak valószínűsége, hogy egy tű metsz egy egyenest, $\\tfrac{2\\ell}{\\pi d}$ (Buffon, 1777). A nagy számok törvénye szerint a metsző tűk aránya ehhez tart – így <b>π-t</b> becsülhetjük: $\\pi \\approx \\tfrac{2\\ell n}{d\\,k}$.");
    const rl = slider(0.2, 1, 0.05, 1), ll = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "ℓ / d =", rl, ll)),
      h("div", { class: "controls" }, ...[1, 10, 100, 1000, 10000, 100000].map(k => btn(`+${groupDigits(k)}`, () => drop(k), k === 100 ? "btn primary" : "btn")), btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.5, 640);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    let n = 0, k = 0, shown = [];
    function reset() { n = 0; k = 0; shown = []; upd(); }
    function drop(m) {
      const L = +rl.value; // d = 1
      for (let i = 0; i < m; i++) {
        const y = Math.random() * 6, x = Math.random() * 10, th = Math.random() * Math.PI;
        const dy = L / 2 * Math.sin(th), dx = L / 2 * Math.cos(th);
        const hit = Math.floor(y - dy) !== Math.floor(y + dy);
        n++; k += hit;
        if (shown.length < 400) shown.push([x - dx, y - dy, x + dx, y + dy, hit]);
      }
      upd();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const sx = w / 10, sy = H / 6;
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.5;
      for (let j = 0; j <= 6; j++) { ctx.beginPath(); ctx.moveTo(0, j * sy); ctx.lineTo(w, j * sy); ctx.stroke(); }
      shown.forEach(([x0, y0, x1, y1, hit]) => { ctx.strokeStyle = css(hit ? "--bad" : "--setC"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 * sx, H - y0 * sy); ctx.lineTo(x1 * sx, H - y1 * sy); ctx.stroke(); });
    };
    function upd() {
      ll.textContent = fmt(+rl.value, 2);
      cv.draw();
      const L = +rl.value, est = k ? 2 * L * n / k : NaN;
      stats.innerHTML = [["ledobott tűk (n)", groupDigits(n)], ["metsző tűk (k)", groupDigits(k)], ["k / n", n ? fmt(k / n, 4) : "–"], ["elméleti: 2ℓ/(πd)", fmt(2 * L / Math.PI, 4)], ["π becslése", fmt(est, 4)], ["eltérés π-től", k ? fmt(Math.abs(est - Math.PI), 4) : "–"]]
        .map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("") +
        (n > shown.length ? `<div class="muted" style="font-size:.85rem;align-self:center">(csak az első ${shown.length} tűt rajzoljuk ki)</div>` : "");
    }
    rl.oninput = reset;
    reset(); drop(100);
  };

  /* ------------------------------------------------------------------
     5.3  Kaszinó: a nagy számok törvénye a bank oldalán
     ------------------------------------------------------------------ */
  W["casino"] = root => {
    header(root, "Miért nyer mindig a kaszinó?", "300 játékos mindegyike $n$-szer tesz 1000 Ft-ot a pirosra (rulett, 37 mező). A hisztogram a játékosok végső egyenlegét mutatja. Egy-egy játékos lehet szerencsés – de a kaszinó <b>összes</b> tétre jutó nyeresége a nagy számok törvénye szerint egyre pontosabban $\\tfrac{1}{37} \\approx 2{,}7\\%$.");
    const rn = slider(0, 3, 0.01, 2), ln = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "fogadások száma játékosonként n =", rn, ln), btn("🎰 Új este", sim, "btn primary")));
    const cv = makeCanvas(root, 0.4);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    const P = 300, p = 18 / 37;
    let res = [];
    const nVal = () => Math.max(1, Math.round(Math.pow(10, +rn.value + 0.0)));
    function sim() {
      const n = nVal(); res = [];
      for (let j = 0; j < P; j++) { let s = 0; for (let i = 0; i < n; i++) s += Math.random() < p ? 1000 : -1000; res.push(s); }
      upd();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      if (!res.length) return;
      // az egyenlegek 2000 Ft-os rácson vannak: az oszlopok a rácshoz igazodnak, különben „fésűs” lenne a hisztogram
      const lo = Math.min(...res), hi = Math.max(...res), step = 2000, wd = step * Math.max(1, Math.ceil((hi - lo) / (30 * step))), start = lo - step / 2;
      const nb = Math.floor((hi - start) / wd);
      const cnt = new Array(nb + 1).fill(0); res.forEach(v => cnt[Math.floor((v - start) / wd)]++);
      const box = { x0: 40, y0: 12, x1: w - 12, y1: H - 26 };
      const { tx, ty } = axes(ctx, box, { xmin: start, xmax: start + (nb + 1) * wd, ymin: 0, ymax: Math.max(...cnt) * 1.15, yticks: niceTicks(Math.max(...cnt) * 1.15, 4), xticks: rangeTicks(start, start + (nb + 1) * wd, 6), xlabel: "egyenleg (Ft)" });
      cnt.forEach((c, i) => { const a = start + i * wd; ctx.fillStyle = css(a + step / 2 > 0 ? "--ok" : a + wd > 0 ? "--muted" : "--bad"); ctx.globalAlpha = 0.7; ctx.fillRect(tx(a), ty(c), tx(a + wd) - tx(a) - 1, box.y1 - ty(c)); ctx.globalAlpha = 1; });
      if (0 > start && 0 < start + (nb + 1) * wd) dashed(ctx, tx(0), box.y0, tx(0), box.y1, css("--text"));
    };
    function upd() {
      const n = nVal(); ln.textContent = groupDigits(n);
      cv.draw();
      if (!res.length) return;
      const ahead = res.filter(v => v > 0).length / P, house = -res.reduce((a, b) => a + b, 0) / (P * n * 1000);
      stats.innerHTML = [["nyereségben lévő játékosok", pct(ahead, 0)], ["legjobb játékos", groupDigits(Math.max(...res)) + " Ft"], ["legrosszabb játékos", groupDigits(Math.min(...res)) + " Ft"], ["kaszinó nyeresége a tétek %-ában", pct(house, 2)], ["elméleti", "2,70%"]]
        .map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
    }
    rn.oninput = sim;
    sim();
  };

  /* ------------------------------------------------------------------
     5.2  Ellenpélda: a Cauchy-eloszlás
     ------------------------------------------------------------------ */
  W["cauchy"] = root => {
    header(root, "Amikor a törvény nem működik: a Cauchy-eloszlás", "Két sorozat futó átlaga: <span style='color:var(--setA)'>standard normális</span> és <span style='color:var(--setB)'>Cauchy-eloszlású</span> számoké (ez utóbbi pl. egy véletlen irányba világító lámpa fényfoltja a falon). Mindkettő szimmetrikus a 0-ra – de a Cauchy-eloszlásnak <b>nincs várható értéke</b>, és az átlaga soha nem nyugszik meg.");
    root.append(h("div", { class: "controls" }, btn("🔁 Új sorozatok", sim, "btn primary")));
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    const N = 100000;
    let A = null, B = null;
    function sim() {
      A = new Float32Array(N); B = new Float32Array(N); let sa = 0, sb = 0;
      for (let i = 0; i < N; i++) { sa += randn(); sb += Math.tan(Math.PI * (Math.random() - 0.5)); A[i] = sa / (i + 1); B[i] = sb / (i + 1); }
      cv.draw();
      out.innerHTML = [1000, 10000, 100000].map(n => `n = ${groupDigits(n)}: normális átlag <b>${fmt(A[n - 1], 3)}</b>, Cauchy-átlag <b>${fmt(B[n - 1], 3)}</b>`).join("<br>") +
        `<br><small>Meglepő tény: $n$ független Cauchy-változó átlaga <em>ugyanolyan</em> Cauchy-eloszlású, mint egyetlen változó – az átlagolás semmit nem javít. A nagy számok törvényének feltétele (létező várható érték) tehát nem formalitás.</small>`;
      render(out);
    }
    cv.draw = () => {
      if (!A) return;
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const box = { x0: 40, y0: 12, x1: w - 12, y1: H - 30 };
      const { tx, ty } = axes(ctx, box, { xmin: 1, xmax: N, ymin: -3, ymax: 3, xlog: true, xticks: logTicks(N), yticks: [-3, -2, -1, 0, 1, 2, 3], xlabel: "n" });
      ctx.save(); ctx.beginPath(); ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0); ctx.clip();
      [[A, "--setA"], [B, "--setB"]].forEach(([a, c]) => { ctx.strokeStyle = css(c); ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < N; i += i < 1000 ? 1 : 10) { const x = tx(i + 1), y = ty(Math.max(-5, Math.min(5, a[i]))); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); });
      ctx.restore();
    };
    sim();
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
