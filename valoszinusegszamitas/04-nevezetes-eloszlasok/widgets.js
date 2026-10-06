/* =========================================================
   4. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 1–3. fejezet mintájára)
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
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "" }) {
    const { x0, y0, x1, y1 } = box;
    const tx = v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => { ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke(); ctx.fillText(String(v).replace(".", ","), x0 - 5, ty(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(String(v).replace(".", ",").replace("-", "−"), tx(v), y1 + 5));
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

  /* ---------- Eloszlásfüggvények ---------- */
  const LF = [0];
  const lfact = n => { for (let i = LF.length; i <= n; i++) LF[i] = LF[i - 1] + Math.log(i); return LF[n]; };
  const lC = (n, k) => (k < 0 || k > n ? -Infinity : lfact(n) - lfact(k) - lfact(n - k));
  const binom = (k, n, p) => (k < 0 || k > n ? 0 : p === 0 ? (k === 0 ? 1 : 0) : p === 1 ? (k === n ? 1 : 0) : Math.exp(lC(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)));
  const hyper = (k, N, M, n) => Math.exp(lC(M, k) + lC(N - M, n - k) - lC(N, n)) || 0;
  const pois = (k, l) => Math.exp(-l + k * Math.log(l) - lfact(k));
  // erf: Abramowitz–Stegun 7.1.26 (hiba < 1,5·10⁻⁷)
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const PhiInv = p => { let lo = -10, hi = 10; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; Phi(m) < p ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  const randn = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };

  /* Oszlopdiagram egész értékekre */
  function bars(cv, ks, series, { hiFn = null, overlay = null, xlabel = "k", maxBars = 60 } = {}) {
    const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
    const ymax = Math.max(0.02, ...series.flatMap(s => s.ps)) * 1.15;
    const box = { x0: 46, y0: 14, x1: w - 10, y1: H - 26 };
    const lo = ks[0] - 0.5, hi = ks[ks.length - 1] + 0.5;
    const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax, yticks: niceTicks(ymax, 4), xticks: rangeTicks(Math.ceil(lo), Math.floor(hi), 12).filter(Number.isInteger), xlabel });
    const slot = tx(1) - tx(0), m = series.length, bw = Math.max(1, slot * 0.8 / m);
    series.forEach((s, j) => ks.forEach((k, i) => {
      const x = tx(k) - slot * 0.4 + j * bw;
      ctx.fillStyle = css(hiFn && hiFn(k) && j === 0 ? "--setB" : s.color); ctx.globalAlpha = 0.85;
      ctx.fillRect(x, ty(s.ps[i]), Math.max(1, bw - (m > 1 ? 1 : 0)), box.y1 - ty(s.ps[i])); ctx.globalAlpha = 1;
    }));
    if (overlay) curve(ctx, tx, ty, overlay, lo, hi, css("--bad"), 2);
    if (m > 1) {
      ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      let x = box.x1 - 10;
      series.slice().reverse().forEach(s => { const tw = ctx.measureText(s.label).width; x -= tw + 22; ctx.fillStyle = css(s.color); ctx.fillRect(x, 8, 12, 12); ctx.fillStyle = css("--text"); ctx.fillText(s.label, x + 16, 14); });
    }
    return { tx, ty, box };
  }

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     4.2.1  Galton-deszka
     ------------------------------------------------------------------ */
  W["galton"] = root => {
    header(root, "Galton-deszka", "Minden golyó $n$ soron esik át; minden szögnél $p$ valószínűséggel jobbra, $1-p$ valószínűséggel balra pattan – egymástól függetlenül. A golyó végső helye a jobbra pattanások száma, azaz egy $(n, p)$ paraméterű <b>binomiális</b> változó. A piros körvonal az elméleti eloszlás.");
    const rn = slider(1, 16, 1, 10), rp = slider(0.05, 0.95, 0.05, 0.5), ln = h("b"), lp = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "sorok száma n =", rn, ln), h("label", null, "p =", rp, lp)),
      h("div", { class: "controls" }, btn("⚪ Ejts egy golyót", () => drop(1, true), "btn primary"), ...[10, 100, 1000].map(k => btn(`+${k}`, () => drop(k))), btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.62, 640);
    const out = h("div", { class: "readout" });
    root.append(out);
    let counts = [], total = 0, anim = null;
    function reset() { counts = new Array(+rn.value + 1).fill(0); total = 0; anim = null; upd(); }
    function path() { const n = +rn.value, p = +rp.value, steps = []; let k = 0; for (let i = 0; i < n; i++) { const r = Math.random() < p; steps.push(r); k += r; } return { steps, k }; }
    function drop(m, animate) {
      if (animate) {
        if (anim) return;
        const P = path(); anim = { P, t: 0 };
        const tick = () => {
          anim.t += 0.06;
          if (anim.t >= +rn.value + 1) { counts[P.k]++; total++; anim = null; upd(); return; }
          cv.draw(); requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick); return;
      }
      for (let i = 0; i < m; i++) { counts[path().k]++; total++; }
      upd();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const n = +rn.value, p = +rp.value, top = 18, boardH = H * 0.48, dx = Math.min(30, (w - 40) / (n + 2)), dy = boardH / (n + 1), cx = w / 2;
      const pegX = (i, j) => cx + (j - i / 2) * dx;
      ctx.fillStyle = css("--muted");
      for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { ctx.beginPath(); ctx.arc(pegX(i, j), top + (i + 1) * dy, 3, 0, 7); ctx.fill(); }
      // tárolók
      const baseY = H - 22, binTop = top + (n + 1) * dy + 6;
      const maxC = Math.max(1, ...counts), expMax = Math.max(...Array.from({ length: n + 1 }, (_, k) => binom(k, n, p)));
      const scale = (baseY - binTop) / Math.max(maxC / Math.max(total, 1), expMax) / 1.05;
      for (let k = 0; k <= n; k++) {
        const x = cx + (k - n / 2) * dx;
        const rel = total ? counts[k] / total : 0;
        ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.8; ctx.fillRect(x - dx * 0.4, baseY - rel * scale, dx * 0.8, rel * scale); ctx.globalAlpha = 1;
        ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.5; ctx.strokeRect(x - dx * 0.4, baseY - binom(k, n, p) * scale, dx * 0.8, binom(k, n, p) * scale);
        ctx.fillStyle = css("--text"); ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(k, x, baseY + 4);
      }
      ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(cx - (n / 2 + 1) * dx, baseY); ctx.lineTo(cx + (n / 2 + 1) * dx, baseY); ctx.stroke();
      if (anim) {
        const t = anim.t, i = Math.min(Math.floor(t), n), frac = t - Math.floor(t);
        // a golyó az i-edik szögsorban a pegX(i, R(i)) pontban van, ahol R(i) az első i pattanásból a jobbra pattanások száma
        const R = j => anim.P.steps.slice(0, j).reduce((a, b) => a + b, 0);
        const x0 = i === 0 ? cx : pegX(i - 1, R(i - 1)), y0 = top + i * dy;
        const x1 = pegX(i, R(i)), y1 = top + (i + 1) * dy;
        ctx.fillStyle = css("--setB"); ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac - 6, 6, 0, 7); ctx.fill();
      }
    };
    function upd() {
      ln.textContent = rn.value; lp.textContent = fmt(+rp.value, 2);
      if (counts.length !== +rn.value + 1) { counts = new Array(+rn.value + 1).fill(0); total = 0; }
      cv.draw();
      const n = +rn.value, p = +rp.value;
      const mean = total ? counts.reduce((a, c, k) => a + c * k, 0) / total : NaN;
      out.innerHTML = `Leejtett golyók: <b>${total}</b> · átlagos helyzet: <b>${fmt(mean, 2)}</b> · elméleti várható érték: ${tex(`np = ${num(n * p, 2)}`)}, szórás: ${tex(`\\sqrt{np(1-p)} = ${num(Math.sqrt(n * p * (1 - p)), 2)}`)}`;
    }
    rn.oninput = reset; rp.oninput = reset;
    reset();
  };

  /* ------------------------------------------------------------------
     4.2.1 / 4.4  Binomiális eloszlás – és normális közelítése
     ------------------------------------------------------------------ */
  const BIN_PRESETS = [
    ["6 érme (fejek)", 6, 0.5, 3, 3], ["V.4.2: csapat", 4, 2 / 3, 3, 4], ["V.4.4: lövész", 7, 0.25, 2, 7],
    ["100 érme, 45–55 fej", 100, 0.5, 45, 55], ["Selejt: 100 db, 2%", 100, 0.02, 3, 3]
  ];
  W["binom-explorer"] = root => {
    header(root, "Binomiális eloszlás", "Állítsd be $n$-et és $p$-t, és egy $[a; b]$ tartományt: kiszámoljuk $P(a \\le X \\le b)$-t. Bekapcsolhatod a <b>normális közelítést</b> is (4.4).");
    const rn = slider(1, 150, 1, 10), rp = slider(0, 1, "any", 0.5), ia = h("input", { type: "number", value: 3, min: 0 }), ib = h("input", { type: "number", value: 6, min: 0 });
    const ln = h("b"), lp = h("b"), nApprox = h("input", { type: "checkbox" });
    root.append(h("div", { class: "controls" }, "Példák: ", ...BIN_PRESETS.map(([l, n, p, a, b]) => btn(l, () => { rn.value = n; rp.value = p; ia.value = a; ib.value = b; upd(); }))),
      h("div", { class: "controls" }, h("label", null, "n =", rn, ln), h("label", null, "p =", rp, lp)),
      h("div", { class: "controls" }, h("label", null, "a =", ia), h("label", null, "b =", ib), h("label", null, nApprox, "normális közelítés")));
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    function upd() {
      const n = +rn.value, p = +rp.value; ln.textContent = n; lp.textContent = fmt(p, 2);
      const a = Math.max(0, Math.min(n, Math.round(+ia.value || 0))), b = Math.max(a, Math.min(n, Math.round(+ib.value || 0)));
      const m = n * p, sd = Math.sqrt(n * p * (1 - p));
      const lo = n > 40 ? Math.max(0, Math.floor(m - 5 * sd - 2)) : 0, hi = n > 40 ? Math.min(n, Math.ceil(m + 5 * sd + 2)) : n;
      const ks = []; for (let k = lo; k <= hi; k++) ks.push(k);
      const ps = ks.map(k => binom(k, n, p));
      cv.draw = () => bars(cv, ks, [{ ps, color: "--accent" }], { hiFn: k => k >= a && k <= b, overlay: nApprox.checked && sd > 0 ? x => phi((x - m) / sd) / sd : null });
      cv.draw();
      let P = 0; for (let k = a; k <= b; k++) P += binom(k, n, p);
      const mode = Math.floor((n + 1) * p);
      let s = tex(`P(${a} \\le X \\le ${b}) = \\sum_{k=${a}}^{${b}} \\binom{${n}}{k}\\,${num(p, 2)}^k\\,${num(1 - p, 2)}^{${n}-k} = ${num(P, 4)}`) +
        `<br>${tex(`E(X) = np = ${num(m, 2)}`)} · ${tex(`D(X) = \\sqrt{npq} = ${num(sd, 3)}`)} · leggyakoribb érték (módusz): ${tex(`\\lfloor (n+1)p \\rfloor = ${Math.min(mode, n)}`)}`;
      if (nApprox.checked && sd > 0) {
        const cc = Phi((b + 0.5 - m) / sd) - Phi((a - 0.5 - m) / sd), raw = Phi((b - m) / sd) - Phi((a - m) / sd);
        s += `<br>Normális közelítés folytonossági korrekcióval: ${tex(`\\Phi\\!\\left(\\tfrac{${b}+0{,}5-${num(m, 1)}}{${num(sd, 2)}}\\right) - \\Phi\\!\\left(\\tfrac{${a}-0{,}5-${num(m, 1)}}{${num(sd, 2)}}\\right) \\approx ${num(cc, 4)}`)} · korrekció nélkül: ${tex(num(raw, 4))}` +
          ` · ${n * p * (1 - p) >= 9 ? "✅ npq ≥ 9: a közelítés jól használható" : "⚠️ npq < 9: a közelítés pontatlan lehet"}`;
      }
      out.innerHTML = s;
    }
    [rn, rp, ia, ib].forEach(e => (e.oninput = upd)); nApprox.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     4.2.3  Hipergeometrikus eloszlás – lottó, kártya, minőségellenőrzés
     ------------------------------------------------------------------ */
  const HY_PRESETS = [["Ötöslottó (90/5)", 90, 5, 5], ["Hatoslottó (45/6)", 45, 6, 6], ["Piros lapok (32/8/8)", 32, 8, 8], ["Alma (V.4.12)", 100, 5, 4], ["Csavarok (20/6/3)", 20, 6, 3]];
  W["hypergeo"] = root => {
    header(root, "Hipergeometrikus eloszlás", "$N$ elem, köztük $M$ „megjelölt” (nyerőszám, piros lap, selejt). Visszatevés nélkül kiveszünk $n$-et; $X$ a megjelöltek száma a mintában. Összehasonlításul: a visszatevéses (binomiális) eset, $p = M/N$.");
    const iN = h("input", { type: "number", min: 2, max: 500, value: 90 }), iM = h("input", { type: "number", min: 0, value: 5 }), iN2 = h("input", { type: "number", min: 1, value: 5 });
    const cmp = h("input", { type: "checkbox", checked: "" });
    root.append(h("div", { class: "controls" }, "Példák: ", ...HY_PRESETS.map(([l, N, M, n]) => btn(l, () => { iN.value = N; iM.value = M; iN2.value = n; upd(); }))),
      h("div", { class: "controls" }, h("label", null, "N =", iN), h("label", null, "M =", iM), h("label", null, "n =", iN2), h("label", null, cmp, "binomiális összehasonlítás")));
    const cv = makeCanvas(root, 0.38);
    const tbl = h("div", { class: "dist-table" });
    const out = h("div", { class: "readout" });
    root.append(tbl, out);
    function upd() {
      const N = Math.max(2, Math.min(500, Math.round(+iN.value || 2))), M = Math.max(0, Math.min(N, Math.round(+iM.value || 0))), n = Math.max(1, Math.min(N, Math.round(+iN2.value || 1)));
      const lo = Math.max(0, n - (N - M)), hi = Math.min(n, M);
      const ks = []; for (let k = 0; k <= n; k++) ks.push(k);
      const ph = ks.map(k => (k < lo || k > hi ? 0 : hyper(k, N, M, n))), pb = ks.map(k => binom(k, n, M / N));
      const series = [{ ps: ph, color: "--setA", label: "visszatevés nélkül" }].concat(cmp.checked ? [{ ps: pb, color: "--setB", label: "visszatevéssel" }] : []);
      cv.draw = () => bars(cv, ks, series, {});
      cv.draw();
      tbl.innerHTML = `<table><tr><th>k</th>${ks.map(k => `<td>${k}</td>`).join("")}</tr><tr><th>P(X = k)</th>${ph.map(v => `<td>${v > 0 && v < 1e-4 ? v.toExponential(2).replace(".", ",") : fmt(v, 4)}</td>`).join("")}</tr>` +
        `<tr><th>esély</th>${ph.map(v => `<td>${v > 0 ? "1 : " + (1 / v < 10 ? fmt(1 / v, 1) : groupDigits(Math.round(1 / v))) : "–"}</td>`).join("")}</tr></table>`;
      const p = M / N, E = n * p, Vh = n * p * (1 - p) * (N - n) / (N - 1), Vb = n * p * (1 - p);
      out.innerHTML = tex(`P(X = k) = \\frac{\\binom{${M}}{k}\\binom{${N - M}}{${n}-k}}{\\binom{${N}}{${n}}}`) + " &nbsp;·&nbsp; " +
        tex(`E(X) = n\\tfrac{M}{N} = ${num(E, 3)}`) + " · " + tex(`D(X) = \\sqrt{n\\tfrac MN\\left(1-\\tfrac MN\\right)\\tfrac{N-n}{N-1}} = ${num(Math.sqrt(Vh), 3)}`) +
        (cmp.checked ? ` · binomiálisnál ${tex(`D = ${num(Math.sqrt(Vb), 3)}`)}` : "");
    }
    [iN, iM, iN2].forEach(e => (e.oninput = upd)); cmp.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     4.2.4  A Poisson-eloszlás mint a binomiális határesete
     ------------------------------------------------------------------ */
  const NS = [5, 10, 20, 50, 100, 300, 1000, 10000];
  W["poisson-limit"] = root => {
    header(root, "A ritka események törvénye", "Rögzítsük $\\lambda = np$-t, és növeljük $n$-et (közben $p = \\lambda/n$ csökken). A binomiális eloszlás egyre jobban hasonlít a $\\lambda$ paraméterű <b>Poisson-eloszlásra</b>.");
    const rl = slider(0.1, 10, 0.1, 2), rn = slider(0, NS.length - 1, 1, 2), ll = h("b"), ln = h("b");
    root.append(h("div", { class: "controls" }, "Példák: ", btn("Sajtóhibák (λ = 0,6; n = 300)", () => { rl.value = 0.6; rn.value = 5; upd(); }), btn("V.4.6: selejt (λ = 2; n = 100)", () => { rl.value = 2; rn.value = 4; upd(); })),
      h("div", { class: "controls" }, h("label", null, "λ =", rl, ll), h("label", null, "n =", rn, ln)));
    const cv = makeCanvas(root, 0.4);
    const out = h("div", { class: "readout" });
    root.append(out);
    function upd() {
      const l = +rl.value, n = NS[+rn.value], p = l / n; ll.textContent = fmt(l, 1); ln.textContent = n;
      const K = Math.max(6, Math.ceil(l + 4 * Math.sqrt(l) + 2));
      const ks = []; for (let k = 0; k <= K; k++) ks.push(k);
      const pb = ks.map(k => (p <= 1 ? binom(k, n, p) : 0)), pp = ks.map(k => pois(k, l));
      cv.draw = () => bars(cv, ks, [{ ps: pb, color: "--setA", label: `binomiális (n = ${n}, p = ${fmt(p, 4)})` }, { ps: pp, color: "--setB", label: `Poisson (λ = ${fmt(l, 1)})` }], {});
      cv.draw();
      const md = Math.max(...ks.map((k, i) => Math.abs(pb[i] - pp[i])));
      out.innerHTML = (p > 1 ? "⚠️ Itt $p = \\lambda/n > 1$ – növeld $n$-et! " : "") + `Legnagyobb eltérés a két eloszlás között: <b>${fmt(md, 5)}</b>.<br>` +
        tex(`P(X = k) = \\frac{\\lambda^k}{k!}e^{-\\lambda}`) + ` · pl. ${tex(`P(X = 0) = e^{-${num(l, 1)}} = ${num(pp[0], 4)}`)}, ${tex(`P(X = 1) = ${num(pp[1], 4)}`)}, ${tex(`P(X \\ge 2) = ${num(1 - pp[0] - pp[1], 4)}`)}`;
      render(out);
    }
    rl.oninput = rn.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     4.2.4 / 4.3.2  Poisson-folyamat: darabszámok és várakozási idők
     ------------------------------------------------------------------ */
  W["poisson-process"] = root => {
    header(root, "Véletlen beérkezések (Poisson-folyamat)", "Hívások egy telefonközpontba, vásárlók egy pénztárhoz, bomlások egy Geiger-számlálóban: átlagosan $\\lambda$ esemény egységnyi idő alatt, egymástól függetlenül. Fent az idővonal első 30 egysége; lent balra az egységnyi időközökbe eső <b>darabszámok</b> (Poisson-eloszlás), jobbra az egymást követő események közti <b>várakozási idők</b> (exponenciális eloszlás).");
    const rl = slider(0.5, 8, 0.5, 3), ll = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "λ (esemény / időegység) =", rl, ll), btn("🔁 Új szimuláció", sim, "btn primary")));
    const cvT = makeCanvas(root, 0.1);
    const row = h("div", { class: "two-canvas" });
    const left = h("div"), right = h("div");
    row.append(left, right); root.append(row);
    const cvA = makeCanvas(left, 0.7, 380), cvB = makeCanvas(right, 0.7, 380);
    const out = h("div", { class: "readout" });
    root.append(out);
    const T = 600;
    let arr = [], counts = [], gaps = [];
    function sim() {
      const l = +rl.value; arr = []; let t = 0;
      while (true) { t += -Math.log(1 - Math.random()) / l; if (t > T) break; arr.push(t); }
      counts = new Array(T).fill(0); arr.forEach(x => counts[Math.floor(x)]++);
      gaps = arr.slice(1).map((x, i) => x - arr[i]);
      draw(); stats();
    }
    function draw() { cvT.draw(); cvA.draw(); cvB.draw(); }
    cvT.draw = () => {
      const { ctx, w, h: H } = cvT; ctx.clearRect(0, 0, w, H);
      const x0 = 10, x1 = w - 10, X = t => x0 + t / 30 * (x1 - x0), y = H / 2;
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      for (let i = 0; i <= 30; i++) { ctx.beginPath(); ctx.moveTo(X(i), y - 6); ctx.lineTo(X(i), y + 6); ctx.stroke(); }
      ctx.fillStyle = css("--accent"); arr.filter(t => t < 30).forEach(t => { ctx.beginPath(); ctx.arc(X(t), y, 3.5, 0, 7); ctx.fill(); });
    };
    cvA.draw = () => {
      const l = +rl.value, K = Math.ceil(l + 4 * Math.sqrt(l) + 1), ks = []; for (let k = 0; k <= K; k++) ks.push(k);
      const emp = ks.map(k => counts.filter(c => c === k).length / T);
      bars(cvA, ks, [{ ps: emp, color: "--setA", label: "szimuláció" }, { ps: ks.map(k => pois(k, l)), color: "--setB", label: "Poisson" }], { xlabel: "darab / időegység" });
    };
    cvB.draw = () => {
      const { ctx, w, h: H } = cvB; ctx.clearRect(0, 0, w, H);
      const l = +rl.value, xmax = 4 / l, nb = 24, wd = xmax / nb;
      const cnt = new Array(nb).fill(0); gaps.forEach(g => { const i = Math.floor(g / wd); if (i < nb) cnt[i]++; });
      const dens = cnt.map(c => (gaps.length ? c / gaps.length / wd : 0));
      const ymax = Math.max(l, ...dens) * 1.1;
      const box = { x0: 40, y0: 14, x1: w - 10, y1: H - 26 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax, ymin: 0, ymax, yticks: niceTicks(ymax, 4), xticks: rangeTicks(0, xmax, 5), xlabel: "várakozási idő" });
      dens.forEach((d, i) => { ctx.fillStyle = css("--setA"); ctx.globalAlpha = 0.6; ctx.fillRect(tx(i * wd), ty(d), tx(wd) - tx(0) - 1, box.y1 - ty(d)); ctx.globalAlpha = 1; });
      curve(ctx, tx, ty, x => l * Math.exp(-l * x), 0, xmax, css("--bad"));
    };
    function stats() {
      const l = +rl.value, mc = counts.reduce((a, b) => a + b, 0) / T, vc = counts.reduce((a, c) => a + (c - mc) ** 2, 0) / T, mg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      ll.textContent = fmt(l, 1);
      out.innerHTML = `${T} időegység alatt <b>${arr.length}</b> esemény. Darabszám/időegység: átlag <b>${fmt(mc, 3)}</b>, szórásnégyzet <b>${fmt(vc, 3)}</b> (Poisson: mindkettő ${tex(`\\lambda = ${num(l, 1)}`)}). ` +
        `Átlagos várakozási idő: <b>${fmt(mg, 3)}</b> (exponenciális: ${tex(`1/\\lambda = ${num(1 / l, 3)}`)}).`;
    }
    rl.oninput = sim;
    sim();
  };

  /* ------------------------------------------------------------------
     4.3.2  Exponenciális eloszlás és az örökifjúság
     ------------------------------------------------------------------ */
  const EXP_PRESETS = [["Alkatrész (μ = 500 óra)", 500, 1000, 2000], ["Képcső V.4.7 (μ = 800 óra)", 800, 1600, 3200], ["Szén-14 (felezési idő 5730 év)", 5730 / Math.LN2, 5730, 10000]];
  W["exp-memoryless"] = root => {
    header(root, "Exponenciális eloszlás – az „örökifjú” élettartam", "Az alkatrész már $t$ ideje működik. Mekkora eséllyel működik még további $s$ ideig? Az exponenciális eloszlásnál a válasz <b>nem függ</b> $t$-től: a két kiemelt terület aránya mindig ugyanaz.");
    const rm = slider(50, 10000, 10, 500), rt = slider(0, 1, 0.01, 0.3), rs = slider(0.01, 1, 0.01, 0.4);
    const lm = h("b"), lt = h("b"), ls = h("b");
    root.append(h("div", { class: "controls" }, "Példák: ", ...EXP_PRESETS.map(([l, m, t, s]) => btn(l, () => { rm.value = m; rt.value = t / (6 * m); rs.value = Math.min(1, s / (6 * m)); upd(); }))),
      h("div", { class: "controls" }, h("label", null, "várható élettartam μ = 1/λ =", rm, lm)),
      h("div", { class: "controls" }, h("label", null, "eddig eltelt t =", rt, lt), h("label", null, "további s =", rs, ls)));
    const cv = makeCanvas(root, 0.4);
    const out = h("div", { class: "readout" });
    root.append(out);
    const vals = () => { const m = +rm.value, xmax = 6 * m; return { m, l: 1 / m, xmax, t: +rt.value * xmax, s: +rs.value * xmax }; };
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const { m, l, xmax, t, s } = vals();
      const box = { x0: 60, y0: 14, x1: w - 12, y1: H - 26 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax, ymin: 0, ymax: l * 1.1, yticks: niceTicks(l * 1.1, 3), xticks: rangeTicks(0, xmax, 6) });
      const shade = (a, b, col, alpha) => { ctx.fillStyle = col; ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(tx(a), ty(0)); for (let i = 0; i <= 120; i++) { const x = a + (Math.min(b, xmax) - a) * i / 120; ctx.lineTo(tx(x), ty(l * Math.exp(-l * x))); } ctx.lineTo(tx(Math.min(b, xmax)), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
      shade(t, xmax, css("--setA"), 0.25);
      shade(t + s, xmax, css("--setB"), 0.55);
      curve(ctx, tx, ty, x => l * Math.exp(-l * x), 0, xmax, css("--accent"));
      const med = m * Math.LN2;
      [[m, "μ", "--bad"], [med, "medián", "--setC"]].forEach(([x, lab, c], i) => { ctx.strokeStyle = css(c); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(tx(x), box.y0); ctx.lineTo(tx(x), box.y1); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = css(c); ctx.font = "bold 11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(lab, tx(x) + 3, box.y0 + 14 * i); });
    };
    function upd() {
      const { m, l, t, s } = vals();
      lm.textContent = groupDigits(Math.round(m)); lt.textContent = groupDigits(Math.round(t)); ls.textContent = groupDigits(Math.round(s));
      cv.draw();
      const ps = Math.exp(-l * s), pts = Math.exp(-l * (t + s)), pt = Math.exp(-l * t);
      out.innerHTML = tex(`P(X \\gt t + s \\mid X \\gt t) = \\frac{P(X \\gt ${Math.round(t + s)})}{P(X \\gt ${Math.round(t)})} = \\frac{${num(pts, 4)}}{${num(pt, 4)}} = ${num(pts / pt, 4)}`) +
        ` &nbsp;=&nbsp; ` + tex(`P(X \\gt ${Math.round(s)}) = e^{-\\lambda s} = ${num(ps, 4)}`) +
        `<br>` + tex(`\\text{medián} = \\mu\\ln 2 = ${groupDigits(Math.round(m * Math.LN2))}`) + ` · ` + tex(`P(X \\lt \\mu) = 1 - e^{-1} \\approx 0{,}632`) + ` – a „várható élettartamot” a darabok 63%-a nem éri meg!`;
    }
    [rm, rt, rs].forEach(r => (r.oninput = upd));
    upd();
  };

  /* ------------------------------------------------------------------
     4.3.3  Normális eloszlás – kalkulátor
     ------------------------------------------------------------------ */
  const N_PRESETS = [
    ["Standard N(0, 1)", 0, 1, "ab", -1, 1, 0.975], ["Korongok", 0.75, 0.06, "ab", 0.6, 0.84, 0.5], ["Júliusi hőmérséklet", 26, 4, "ab", 28, 34, 0.5],
    ["Magasság (V.4.10)", 170, 16, "gt", 190, 190, 0.5], ["Átmérő (V.4.13)", 8, 0.1, "ab", 7.68, 8.32, 0.5], ["IQ: felső 2%", 100, 15, "q", 0, 0, 0.98]
  ];
  W["normal-calc"] = root => {
    header(root, "Normális eloszlás – kalkulátor", "Add meg a várható értéket és a szórást, aztán válaszd ki, mit keresel. A számítás lépései: standardizálás ($z = \\frac{x - m}{\\sigma}$), majd a $\\Phi$ standard normális eloszlásfüggvény.");
    const im = h("input", { type: "number", step: "any", value: 0 }), is = h("input", { type: "number", step: "any", value: 1, min: 0 });
    const mode = h("select");
    [["ab", "P(a < X < b)"], ["lt", "P(X < b)"], ["gt", "P(X > a)"], ["q", "kvantilis: x, amelyre P(X < x) = p"]].forEach(([v, l]) => mode.append(h("option", { value: v }, l)));
    const ia = h("input", { type: "number", step: "any", value: -1 }), ib = h("input", { type: "number", step: "any", value: 1 }), ip = h("input", { type: "number", step: "any", value: 0.975, min: 0.0001, max: 0.9999 });
    const la = h("label", null, "a =", ia), lb = h("label", null, "b =", ib), lp = h("label", null, "p =", ip);
    root.append(h("div", { class: "controls" }, "Példák: ", ...N_PRESETS.map(([l, m, s, md, a, b, p]) => btn(l, () => { im.value = m; is.value = s; mode.value = md; ia.value = a; ib.value = b; ip.value = p; upd(); }))),
      h("div", { class: "controls" }, h("label", null, "m =", im), h("label", null, "σ =", is), mode, la, lb, lp));
    const cv = makeCanvas(root, 0.4);
    const out = h("div", { class: "readout" });
    root.append(out);
    let st = null;
    cv.draw = () => {
      if (!st) return;
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const { m, s, lo, hi } = st;
      const f = x => phi((x - m) / s) / s;
      const box = { x0: 50, y0: 14, x1: w - 12, y1: H - 40 };
      const xl = m - 4 * s, xh = m + 4 * s;
      const { tx, ty } = axes(ctx, box, { xmin: xl, xmax: xh, ymin: 0, ymax: f(m) * 1.1, yticks: [], xticks: [-3, -2, -1, 0, 1, 2, 3].map(k => +(m + k * s).toPrecision(6)) });
      ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.5; ctx.beginPath();
      const a = Math.max(lo, xl), b = Math.min(hi, xh);
      if (b > a) { ctx.moveTo(tx(a), ty(0)); for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200; ctx.lineTo(tx(x), ty(f(x))); } ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); }
      ctx.globalAlpha = 1;
      curve(ctx, tx, ty, f, xl, xh, css("--accent"));
      ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      [-3, -2, -1, 0, 1, 2, 3].forEach(k => ctx.fillText(`z = ${k}`.replace("-", "−"), tx(m + k * s), box.y1 + 20));
    };
    function upd() {
      const m = +im.value || 0, s = Math.max(1e-9, +is.value || 1), md = mode.value;
      la.style.display = md === "ab" || md === "gt" ? "" : "none"; lb.style.display = md === "ab" || md === "lt" ? "" : "none"; lp.style.display = md === "q" ? "" : "none";
      const a = +ia.value, b = +ib.value, p = Math.min(0.9999, Math.max(0.0001, +ip.value || 0.5));
      const sh = x => String(+(+x).toPrecision(6)).replace(".", "{,}").replace("-", "-");
      const z = x => (x - m) / s, zs = x => `\\tfrac{${sh(x)} - ${sh(m)}}{${sh(s)}} = ${num(z(x), 3)}`;
      let txt;
      if (md === "ab") {
        const P = Phi(z(b)) - Phi(z(a)); st = { m, s, lo: Math.min(a, b), hi: Math.max(a, b) };
        txt = tex(`z_a = ${zs(a)},\\quad z_b = ${zs(b)}`) + "<br>" + tex(`P(a \\lt X \\lt b) = \\Phi(${num(z(b), 2)}) - \\Phi(${num(z(a), 2)}) = ${num(Phi(z(b)), 4)} - ${num(Phi(z(a)), 4)} = ${num(P, 4)}`);
      } else if (md === "lt") {
        st = { m, s, lo: -Infinity, hi: b };
        txt = tex(`P(X \\lt ${sh(b)}) = \\Phi\\left(${zs(b)}\\right) = ${num(Phi(z(b)), 4)}`);
      } else if (md === "gt") {
        st = { m, s, lo: a, hi: Infinity };
        txt = tex(`P(X \\gt ${sh(a)}) = 1 - \\Phi\\left(${zs(a)}\\right) = ${num(1 - Phi(z(a)), 4)}`);
      } else {
        const zq = PhiInv(p), x = m + zq * s; st = { m, s, lo: -Infinity, hi: x };
        txt = tex(`\\Phi(z) = ${num(p, 4)} \\Rightarrow z = ${num(zq, 3)},\\qquad x = m + z\\sigma = ${sh(m)} + ${num(zq, 3)}\\cdot${sh(s)} = ${num(x, 3)}`);
      }
      out.innerHTML = txt;
      cv.draw();
    }
    [im, is, ia, ib, ip].forEach(e => (e.oninput = upd)); mode.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     4.3.3  A Φ(x) függvény táblázata
     ------------------------------------------------------------------ */
  W["phi-table"] = root => {
    header(root, "A standard normális eloszlásfüggvény táblázata", "$\\Phi(x) = P(X^* \\lt x)$, ahol $X^* \\sim N(0, 1)$. A sor az egész és az első tizedesjegy, az oszlop a második tizedesjegy. Negatív $x$-re: $\\Phi(-x) = 1 - \\Phi(x)$. Írj be egy számot, és megkeressük!");
    const ix = h("input", { type: "number", step: 0.01, value: 1.96, style: "width:6em" });
    const res = h("span", { class: "muted" });
    root.append(h("div", { class: "controls" }, h("label", null, "x =", ix), res));
    const wrap = h("div", { class: "phi-wrap" });
    let html = "<table class='phi'><tr><th>x</th>" + Array.from({ length: 10 }, (_, j) => `<th>,0${j}</th>`).join("") + "</tr>";
    for (let i = 0; i <= 34; i++) {
      html += `<tr><th>${(i / 10).toFixed(1).replace(".", ",")}</th>`;
      for (let j = 0; j < 10; j++) html += `<td data-x="${(i / 10 + j / 100).toFixed(2)}">${Phi(i / 10 + j / 100).toFixed(4).replace("0.", ",")}</td>`;
      html += "</tr>";
    }
    wrap.innerHTML = html + "</table>";
    root.append(wrap);
    function upd() {
      const x = +ix.value; if (!isFinite(x)) return;
      const ax = Math.min(3.49, Math.abs(Math.round(x * 100) / 100));
      wrap.querySelectorAll("td.on").forEach(td => td.classList.remove("on"));
      const td = wrap.querySelector(`td[data-x="${ax.toFixed(2)}"]`);
      if (td) { td.classList.add("on"); const tr = td.parentElement; wrap.scrollTop = tr.offsetTop - wrap.clientHeight / 2; }
      res.innerHTML = x >= 0 ? tex(`\\Phi(${num(x, 2)}) = ${num(Phi(x), 4)}`) : tex(`\\Phi(${num(x, 2)}) = 1 - \\Phi(${num(-x, 2)}) = 1 - ${num(Phi(-x), 4)} = ${num(Phi(x), 4)}`);
    }
    ix.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     4.4  Centrális határeloszlás-tétel
     ------------------------------------------------------------------ */
  const BASES = [
    { name: "kockadobás", m: 3.5, s: Math.sqrt(35 / 12), gen: () => 1 + Math.floor(Math.random() * 6), lattice: 1 },
    { name: "egyenletes a [0; 1]-en", m: 0.5, s: Math.sqrt(1 / 12), gen: () => Math.random() },
    { name: "exponenciális (λ = 1) – erősen ferde", m: 1, s: 1, gen: () => -Math.log(1 - Math.random()) },
    { name: "érme, P(fej) = 0,1 (Bernoulli)", m: 0.1, s: Math.sqrt(0.09), gen: () => (Math.random() < 0.1 ? 1 : 0), lattice: 1 },
    { name: "U alakú: 0 vagy 10, fele-fele", m: 5, s: 5, gen: () => (Math.random() < 0.5 ? 0 : 10), lattice: 10 }
  ];
  W["clt-sum"] = root => {
    header(root, "Centrális határeloszlás-tétel", "Összeadunk $n$ független, azonos eloszlású változót, és az összeget standardizáljuk: $Z_n = \\frac{X_1 + \\dots + X_n - nm}{\\sigma\\sqrt n}$. Bármilyen is az eredeti eloszlás, $n$ növelésével a hisztogram a standard normális görbéhez (piros) simul.");
    const sel = h("select"); BASES.forEach((b, i) => sel.append(h("option", { value: i }, b.name)));
    const rn = slider(1, 60, 1, 1), ln = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "Alapeloszlás: ", sel), h("label", null, "n =", rn, ln)),
      h("div", { class: "controls" }, btn("Szimulálj 20 000 összeget", sim, "btn primary")));
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    let Z = [];
    function sim() {
      const B = BASES[+sel.value], n = +rn.value; Z = [];
      for (let t = 0; t < 20000; t++) { let S = 0; for (let i = 0; i < n; i++) S += B.gen(); Z.push((S - n * B.m) / (B.s * Math.sqrt(n))); }
      cv.draw(); stats();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const B = BASES[+sel.value], n = +rn.value;
      // diszkrét alapeloszlásnál az oszlopszélesség a rácsállandóhoz igazodik, különben „fésűs” lenne a hisztogram
      const step = B.lattice ? B.lattice / (B.s * Math.sqrt(n)) : 0.2;
      const wd = B.lattice ? step * Math.max(1, Math.round(0.2 / step)) : 0.2;
      const off = B.lattice ? ((0 - n * B.m) / (B.s * Math.sqrt(n))) - wd / 2 : -4;
      const nb = Math.ceil(8 / wd) + 2, start = off - Math.ceil((off + 4) / wd) * wd;
      const cnt = new Array(nb).fill(0); Z.forEach(z => { const i = Math.floor((z - start) / wd); if (i >= 0 && i < nb) cnt[i]++; });
      const dens = cnt.map(c => (Z.length ? c / Z.length / wd : 0));
      const ymax = Math.max(0.45, ...dens) * 1.08;
      const box = { x0: 40, y0: 14, x1: w - 10, y1: H - 26 };
      const { tx, ty } = axes(ctx, box, { xmin: -4, xmax: 4, ymin: 0, ymax, yticks: niceTicks(ymax, 4), xticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4], xlabel: "Zₙ" });
      dens.forEach((d, i) => { const a = start + i * wd; if (a + wd < -4 || a > 4) return; ctx.fillStyle = css("--setA"); ctx.globalAlpha = 0.6; ctx.fillRect(tx(Math.max(-4, a)), ty(d), tx(Math.min(4, a + wd)) - tx(Math.max(-4, a)) - 1, box.y1 - ty(d)); ctx.globalAlpha = 1; });
      curve(ctx, tx, ty, phi, -4, 4, css("--bad"));
    };
    function stats() {
      ln.textContent = rn.value;
      const N = Z.length, m = Z.reduce((a, b) => a + b, 0) / N, v = Z.reduce((a, z) => a + (z - m) ** 2, 0) / N, g = Z.reduce((a, z) => a + (z - m) ** 3, 0) / N / Math.pow(v, 1.5);
      const inside = Z.filter(z => Math.abs(z) < 1.96).length / N;
      out.innerHTML = `Átlag: <b>${fmt(m, 3)}</b> · szórás: <b>${fmt(Math.sqrt(v), 3)}</b> · ferdeség: <b>${fmt(g, 3)}</b> · ${tex("P(|Z_n| \\lt 1{,}96)")} ≈ <b>${fmt(inside, 3)}</b> (normálisnál 0,950)`;
    }
    sel.onchange = sim; rn.oninput = () => { ln.textContent = rn.value; sim(); };
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
