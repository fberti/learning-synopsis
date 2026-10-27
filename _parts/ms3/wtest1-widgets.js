/* =========================================================
   Matematikai statisztika 3. fejezet – interaktív szemléltetések
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
      const w = Math.min(maxW, parent.clientWidth || maxW);
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
     w1 – közös segédek (w1-előtaggal)
     ------------------------------------------------------------------ */
  const w1Clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  /* Stat-doboz, amelynek csak az értékét frissítjük (a címke KaTeX-e egyszer renderelődik) */
  const w1Stat = (row, label) => { const s = stat(label, ""); s.querySelector(".l").innerHTML = label; row.append(s); return s.querySelector(".v"); };
  /* Legkisebb négyzetes egyenes: y = a + b x */
  const w1Fit = (x, y) => { const b = pcov(x, y) / (psd(x) ** 2); return { a: mean(y) - b * mean(x), b }; };
  /* Egyenes berajzolása a dobozra vágva */
  function w1Line(ctx, box, tx, ty, a, b, xmin, xmax, color, width = 2) {
    if (!isFinite(a) || !isFinite(b)) return;
    ctx.save(); ctx.beginPath(); ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0); ctx.clip();
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(tx(xmin), ty(a + b * xmin)); ctx.lineTo(tx(xmax), ty(a + b * xmax)); ctx.stroke();
    ctx.restore();
  }
  const w1Dot = (ctx, x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); };
  /* Vászon, amelynek a magasság/szélesség aránya keskeny képernyőn nagyobb (a makeCanvas resize-át cseréljük le) */
  function w1Canvas(parent, aspect, narrowAspect, maxW = 760) {
    const cv = makeCanvas(parent, aspect, maxW), base = cv.resize;
    cv.resize = () => {
      base();
      const a = cv.w < 500 ? narrowAspect : aspect, hh = Math.round(cv.w * a), dpr = window.devicePixelRatio || 1;
      cv.c.height = Math.round(hh * dpr); cv.c.style.height = hh + "px"; cv.h = hh;
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    cv.resize();
    return cv;
  }
  const w1Note = txt => h("p", { class: "muted", style: "font-size:.82rem;margin:.5rem 0 0" }, txt);

  /* ------------------------------------------------------------------
     3.4 / 3.5  Húzd a pontokat: kovariancia és korreláció élőben
     ------------------------------------------------------------------ */
  W["scatter-drag"] = root => {
    header(root, "Húzd a pontokat: kovariancia és korreláció élőben",
      "Öt diák tanulási ideje ($x$) és dolgozatpontja ($y$). <b>Húzd</b> a pontokat egérrel vagy ujjal; üres helyre kattintva <b>új pontot</b> teszel le. " +
      "A szaggatott vonalak az átlagok ($x = \\bar x$, $y = \\bar y$). Minden ponthoz tartozik egy téglalap az átlagponttól a pontig: " +
      "<span style='color:var(--setA);font-weight:600'>kék</span>, ha $(x_i-\\bar x)(y_i-\\bar y) > 0$, <span style='color:var(--setB);font-weight:600'>narancs</span>, ha negatív. " +
      "A kovariancia $C$ ezeknek az előjeles területeknek az átlaga.");
    const START = [[1, 52], [2, 56], [3, 62], [4, 62], [5, 68]];
    const XMAX = 10, YMIN = 30, YMAX = 100, NMAX = 25;
    let pts = START.map(p => p.slice()), unit = 1, drag = -1;
    const uH = btn("óra", () => setUnit(1)), uM = btn("perc", () => setUnit(60));
    const rectCb = h("input", { type: "checkbox", checked: "" });
    rectCb.addEventListener("change", () => cv.draw());
    root.append(h("div", { class: "controls" },
      h("label", null, "x mértékegysége:"), uH, uM, h("label", null, rectCb, "téglalapok mutatása")));
    const addBtn = btn("＋ kiugró pont (9; 35)", () => { if (pts.length < NMAX) { pts.push([9, 35]); upd(); } });
    root.append(h("div", { class: "controls" },
      btn("− utolsó pont", () => { if (pts.length > 2) { pts.pop(); upd(); } }), addBtn,
      btn("↺ alaphelyzet", () => { pts = START.map(p => p.slice()); upd(); })));
    const cvWrap = h("div"); root.append(cvWrap); // padding nélküli szülő: a clientWidth így a valódi szélesség
    const cv = w1Canvas(cvWrap, 0.62, 0.9);
    const stats = h("div", { class: "stat-row" });
    const out = h("div", { class: "readout" });
    root.append(stats, out);
    const S = {
      n: w1Stat(stats, "$n$ (pontok száma)"), mx: w1Stat(stats, "$\\bar x$"), my: w1Stat(stats, "$\\bar y$"),
      C: w1Stat(stats, "$C$ (kovariancia)"), sx: w1Stat(stats, "$\\sigma_x$"), sy: w1Stat(stats, "$\\sigma_y$"),
      r: w1Stat(stats, "$r$ (Pearson)"), rho: w1Stat(stats, "$\\rho$ (Spearman)"), K: w1Stat(stats, "$K_r$ (előjel-korreláció)")
    };
    function setUnit(u) { unit = u; uH.classList.toggle("on", u === 1); uM.classList.toggle("on", u === 60); upd(); }

    const box = () => ({ x0: 46, y0: 18, x1: cv.w - 14, y1: cv.h - 38 });
    let tx = v => v, ty = v => v;
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const bx = box();
      ({ tx, ty } = axes(ctx, bx, {
        xmin: 0, xmax: XMAX, ymin: YMIN, ymax: YMAX,
        xticks: rangeTicks(0, XMAX, w < 450 ? 5 : 10), yticks: rangeTicks(YMIN, YMAX, 7),
        xlabel: unit === 1 ? "x: tanulási idő (óra)" : "x: tanulási idő (perc)", ylabel: "y: dolgozatpont",
        xfmt: v => String(v * unit)
      }));
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), mx = mean(xs), my = mean(ys);
      const X = tx(mx), Y = ty(my);
      if (rectCb.checked) pts.forEach(([x, y]) => {
        const pr = (x - mx) * (y - my);
        if (Math.abs(pr) < 1e-12) return;
        const col = css(pr > 0 ? "--setA" : "--setB");
        ctx.fillStyle = col; ctx.globalAlpha = 0.16; ctx.fillRect(Math.min(X, tx(x)), Math.min(Y, ty(y)), Math.abs(tx(x) - X), Math.abs(ty(y) - Y));
        ctx.globalAlpha = 0.7; ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(Math.min(X, tx(x)), Math.min(Y, ty(y)), Math.abs(tx(x) - X), Math.abs(ty(y) - Y));
        ctx.globalAlpha = 1;
      });
      /* negyedek előjele a doboz sarkaiban */
      ctx.font = "bold 18px system-ui, sans-serif"; ctx.globalAlpha = 0.8;
      [[bx.x1 - 8, bx.y0 + 4, "right", "top", "+", "--setA"], [bx.x0 + 8, bx.y0 + 4, "left", "top", "−", "--setB"],
       [bx.x0 + 8, bx.y1 - 4, "left", "bottom", "+", "--setA"], [bx.x1 - 8, bx.y1 - 4, "right", "bottom", "−", "--setB"]]
        .forEach(([x, y, al, bl, t, c]) => { ctx.fillStyle = css(c); ctx.textAlign = al; ctx.textBaseline = bl; ctx.fillText(t, x, y); });
      ctx.globalAlpha = 1;
      /* átlagvonalak */
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(X, bx.y0); ctx.lineTo(X, bx.y1); ctx.moveTo(bx.x0, Y); ctx.lineTo(bx.x1, Y); ctx.stroke(); ctx.restore();
      ctx.fillStyle = css("--muted"); ctx.font = "italic 13px system-ui, sans-serif";
      ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("x̄", X + 4, bx.y0 + 2);
      ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("ȳ", bx.x1 - 22, Y - 2);
      /* pontok */
      pts.forEach(([x, y], i) => {
        w1Dot(ctx, tx(x), ty(y), 6.5, css(i === drag ? "--accent" : "--text"));
        if (i === drag) {
          ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif";
          ctx.textAlign = tx(x) > bx.x1 - 90 ? "right" : "left"; ctx.textBaseline = "bottom";
          ctx.fillText(`(${fmt(x * unit, unit === 1 ? 1 : 0)}; ${fmt(y, 0)})`, tx(x) + (ctx.textAlign === "left" ? 10 : -10), ty(y) - 8);
        }
      });
    };
    function upd() {
      cv.draw();
      const xs = pts.map(p => p[0] * unit), ys = pts.map(p => p[1]), mx = mean(xs), my = mean(ys);
      let p = 0, q = 0, z = 0;
      xs.forEach((x, i) => { const pr = (x - mx) * (ys[i] - my); if (Math.abs(pr) < 1e-9) z++; else if (pr > 0) p++; else q++; });
      S.n.textContent = pts.length; S.mx.textContent = fmt(mx, 2); S.my.textContent = fmt(my, 2);
      S.C.textContent = fmt(pcov(xs, ys), 2); S.sx.textContent = fmt(psd(xs), 3); S.sy.textContent = fmt(psd(ys), 3);
      S.r.textContent = fmt(pearson(xs, ys), 3); S.rho.textContent = fmt(spearman(xs, ys), 3);
      S.K.textContent = p + q ? fmt((p - q) / (p + q), 3) : "–";
      addBtn.disabled = pts.length >= NMAX;
      out.innerHTML = `Előjel-korreláció: <i>p</i> = <b>${p}</b> pont a kék (+), <i>q</i> = <b>${q}</b> a narancs (−) negyedekben` +
        (z ? `, ${z} pont egy átlagvonalon fekszik (nem számít)` : "") + ` → <i>K<sub>r</sub></i> = (<i>p</i> − <i>q</i>)/(<i>p</i> + <i>q</i>).<br>` +
        (unit === 60 ? "Percben minden <i>x</i> 60-szoros: <i>C</i> és <i>σ<sub>x</sub></i> 60-szorosára nő, <i>r</i> és <i>ρ</i> nem változik."
          : "Válts percre: a kovariancia függ a mértékegységtől, a korrelációs együttható nem.") +
        (pts.length >= NMAX ? ` (Elérted a ${NMAX} pontos korlátot.)` : "");
    }
    /* húzás és új pont */
    const pos = e => { const r = cv.c.getBoundingClientRect(); return [(e.clientX - r.left) * cv.w / r.width, (e.clientY - r.top) * cv.h / r.height]; };
    const toData = (px, py) => {
      const b = box();
      return [w1Clamp(Math.round((px - b.x0) / (b.x1 - b.x0) * XMAX * 10) / 10, 0, XMAX),
              w1Clamp(Math.round(YMIN + (b.y1 - py) / (b.y1 - b.y0) * (YMAX - YMIN)), YMIN, YMAX)];
    };
    cv.c.style.touchAction = "none"; cv.c.style.cursor = "crosshair";
    cv.c.addEventListener("pointerdown", e => {
      const [px, py] = pos(e), b = box();
      let best = -1, bd = e.pointerType === "touch" ? 22 : 14;
      pts.forEach(([x, y], i) => { const d = Math.hypot(tx(x) - px, ty(y) - py); if (d < bd) { bd = d; best = i; } });
      if (best < 0) {
        if (px < b.x0 - 6 || px > b.x1 + 6 || py < b.y0 - 6 || py > b.y1 + 6 || pts.length >= NMAX) return;
        pts.push(toData(px, py)); best = pts.length - 1;
      }
      drag = best; cv.c.setPointerCapture(e.pointerId); cv.c.style.cursor = "grabbing"; upd();
    });
    cv.c.addEventListener("pointermove", e => {
      if (drag < 0) return;
      pts[drag] = toData(...pos(e)); upd();
    });
    const end = () => { if (drag < 0) return; drag = -1; cv.c.style.cursor = "crosshair"; cv.draw(); };
    cv.c.addEventListener("pointerup", end); cv.c.addEventListener("pointercancel", end);
    setUnit(1);
  };

  /* ------------------------------------------------------------------
     3.5  Találd ki a korrelációt!
     ------------------------------------------------------------------ */
  W["guess-r"] = root => {
    header(root, "Találd ki a korrelációt!",
      "50 pont, tengelyfeliratok nélkül – csak a felhő alakja számít. Állítsd a csúszkát arra az $r$ értékre, amit leolvasol, és kattints a " +
      "„Tippelek” gombra. Egy sorozat 5 kör; körönként a pontszámod $100 - 100\\cdot|\\text{tipp} - r|$ (legalább 0).");
    const N = 50, ROUNDS = 5;
    const wrap = h("div", { style: "max-width:440px;margin:0 auto" });
    root.append(wrap);
    const cv = makeCanvas(wrap, 0.8, 440);
    const g = slider(-1, 1, 0.05, 0), gOut = h("b", { style: "display:inline-block;min-width:3.2em;font-family:var(--mono)" });
    g.style.width = "min(12rem, 38vw)";
    const tipBtn = btn("Tippelek", reveal, "btn primary"), nextBtn = btn("Új kör", next), seriesBtn = btn("Új sorozat", newSeries);
    root.append(h("div", { class: "controls", style: "justify-content:center" }, h("label", { style: "white-space:nowrap" }, "tipped: r =", g, gOut), tipBtn, nextBtn, seriesBtn));
    const out = h("div", { class: "readout" }), hist = h("div", { class: "stat-row" });
    root.append(out, hist);
    let xs = [], ys = [], plan = [], res = [], shown = false;

    const pick = kind => {
      const R = Math.random;
      if (kind === 0) return (2 * R() - 1) * 0.12;                         // 0 közeli
      if (kind === 1) return (R() < 0.5 ? -1 : 1) * (0.9 + 0.09 * R());   // nagyon erős
      return 2 * R() - 1;                                                  // egyenletes
    };
    function newSeries() {
      plan = [0, 1, 2, 2, 2];
      for (let i = plan.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [plan[i], plan[j]] = [plan[j], plan[i]]; }
      res = []; hist.replaceChildren(); next();
    }
    function next() {
      if (res.length >= ROUNDS) return;
      const rho = pick(plan[res.length]), c = Math.sqrt(1 - rho * rho), R = Math.random;
      xs = []; ys = [];
      for (let i = 0; i < N; i++) { const x = normal(R); xs.push(x); ys.push(rho * x + c * normal(R)); }
      shown = false; tipBtn.disabled = false; nextBtn.disabled = true;
      out.innerHTML = `<b>${res.length + 1}. kör</b> / ${ROUNDS}. Állítsd be a tippedet, aztán „Tippelek”.`;
      cv.draw();
    }
    function reveal() {
      if (shown) return;
      shown = true;
      const r = pearson(xs, ys), gv = +g.value, e = Math.abs(gv - r), sc = Math.max(0, Math.round(100 - 100 * e));
      res.push({ gv, r, e, sc });
      tipBtn.disabled = true; nextBtn.disabled = res.length >= ROUNDS;
      hist.append(stat(`${res.length}. kör: tipp ${fmt(gv, 2)}, r = ${fmt(r, 2)}`, `${sc} p`));
      let txt = `${res.length}. kör: a minta valódi korrelációja <b>r = ${fmt(r, 3)}</b> · tipped: ${fmt(gv, 2)} · eltérés: <b>${fmt(e, 2)}</b> · pont: <b>${sc}</b>`;
      if (res.length >= ROUNDS) {
        const avg = mean(res.map(o => o.e)), tot = res.reduce((s, o) => s + o.sc, 0);
        const ev = avg < 0.1 ? "mesteri!" : avg < 0.2 ? "nagyon jó." : avg < 0.3 ? "jó – a közepes erősségű kapcsolatoknál könnyű tévedni."
          : "érdemes még gyakorolni: nézd meg újra a 3.5 szakasz mintafelhőit.";
        txt += `<br>Vége a sorozatnak. Átlagos eltérés: <b>${fmt(avg, 2)}</b>, összesen <b>${tot}</b> / ${ROUNDS * 100} pont – ${ev} Kezdj „Új sorozat”-ot!`;
      }
      out.innerHTML = txt;
      cv.draw();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      gOut.textContent = fmt(+g.value, 2);
      const bx = { x0: 6, y0: 6, x1: w - 6, y1: H - 6 };
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1.5; ctx.strokeRect(bx.x0, bx.y0, bx.x1 - bx.x0, bx.y1 - bx.y0);
      if (!xs.length) return;
      const ext = a => { const lo = Math.min(...a), hi = Math.max(...a), p = (hi - lo) * 0.08 || 1; return [lo - p, hi + p]; };
      const [x0, x1] = ext(xs), [y0, y1] = ext(ys);
      const tx = v => bx.x0 + (v - x0) / (x1 - x0) * (bx.x1 - bx.x0), ty = v => bx.y1 - (v - y0) / (y1 - y0) * (bx.y1 - bx.y0);
      ctx.globalAlpha = 0.85;
      xs.forEach((x, i) => w1Dot(ctx, tx(x), ty(ys[i]), 4.5, css("--accent")));
      ctx.globalAlpha = 1;
      if (shown) {
        const { a, b } = w1Fit(xs, ys);
        w1Line(ctx, bx, tx, ty, a, b, x0, x1, css("--setB"), 2.5);
        ctx.fillStyle = css("--text"); ctx.font = "bold 14px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(`r = ${fmt(pearson(xs, ys), 2)}`, bx.x0 + 8, bx.y0 + 6);
      }
    };
    g.addEventListener("input", () => { gOut.textContent = fmt(+g.value, 2); });
    newSeries();
  };

  /* ------------------------------------------------------------------
     3.5  Anscombe-kvartett
     ------------------------------------------------------------------ */
  W["anscombe"] = root => {
    header(root, "Anscombe-kvartett: ugyanazok a számok, négy különböző kép",
      "Négy adatsor, egyenként 11 ponttal. Az átlagok, a szórások, a korrelációs együttható és az illesztett egyenes szinte hajszálra egyezik – " +
      "a pontdiagramok mégis teljesen mást mutatnak. Nézd meg őket egyenként és egymás mellett!");
    const X = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
    const SETS = [
      { n: "I", x: X, y: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68], hl: -1,
        t: "<b>I.</b> Lineáris kapcsolat + véletlen szóródás. Ez az az eset, amire az <i>r</i> és az egyenes „készült”: itt jól leírják az adatokat." },
      { n: "II", x: X, y: [9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74], hl: -1,
        t: "<b>II.</b> Tökéletes, zaj nélküli kapcsolat – de görbe (parabola), nem egyenes. Az <i>r</i> = 0,816 alábecsüli a kapcsolatot, az egyenes rossz modell." },
      { n: "III", x: X, y: [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73], hl: 2,
        t: "<b>III.</b> Majdnem tökéletes egyenes + <span style='color:var(--bad)'>egyetlen kiugró pont</span>, ami elhúzza az egyenest és lerontja <i>r</i>-t (nélküle <i>r</i> ≈ 1). A rangkorreláció (ρ = 0,991) alig érzékeny rá." },
      { n: "IV", x: [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], y: [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89], hl: 7,
        t: "<b>IV.</b> Tíz pontnál <i>x</i> ugyanaz (8) – ott <i>x</i> semmit nem mond <i>y</i>-ról. A „kapcsolatot” <span style='color:var(--bad)'>egyetlen pont</span> teremti: nélküle <i>r</i> nem is értelmezhető." }
    ];
    let view = 4;
    const vBtns = SETS.map((s, k) => btn(s.n + ".", () => setView(k))).concat(btn("mind a négy", () => setView(4)));
    root.append(h("div", { class: "controls" }, h("label", null, "adatsor:"), ...vBtns));
    const single = h("div"), grid = h("div", { class: "two-canvas" });
    root.append(single, grid);
    const cvS = makeCanvas(single, 0.6);
    const cells = SETS.map(() => { const d = h("div"); grid.append(d); return d; });
    const cvG = cells.map(d => makeCanvas(d, 0.72, 420));
    const out = h("div", { class: "readout" });
    root.append(out);

    /* statisztika-táblázat */
    const ST = SETS.map(s => {
      const f = w1Fit(s.x, s.y);
      return { mx: mean(s.x), my: mean(s.y), sx: psd(s.x), sy: psd(s.y), r: pearson(s.x, s.y), a: f.a, b: f.b, rho: spearman(s.x, s.y) };
    });
    const ROWS = [["$\\bar x$", o => fmt(o.mx, 2)], ["$\\bar y$", o => fmt(o.my, 2)], ["$\\sigma_x$", o => fmt(o.sx, 3)],
      ["$\\sigma_y$", o => fmt(o.sy, 3)], ["$r$ (Pearson)", o => fmt(o.r, 3)], ["egyenes: $y =$", o => `${fmt(o.a, 2)} + ${fmt(o.b, 3)}x`],
      ["$\\rho$ (Spearman)", o => fmt(o.rho, 3)]];
    const cols = [];
    const tbl = h("table", { style: "width:auto;margin:.6rem 0 0;font-size:.88rem" },
      h("tr", null, h("th", null, ""), ...SETS.map((s, k) => { const c = h("th", { style: "text-align:center" }, s.n + "."); (cols[k] = [c]); return c; })),
      ...ROWS.map(([lab, f]) => h("tr", null, h("th", { html: lab, style: "white-space:nowrap" }),
        ...ST.map((o, k) => { const c = h("td", { style: "text-align:center;font-family:var(--mono);white-space:nowrap" }, f(o)); cols[k].push(c); return c; }))));
    root.append(h("div", { class: "tw", style: "overflow-x:auto" }, tbl),
      w1Note("Forrás: F. J. Anscombe (1973): Graphs in Statistical Analysis. The American Statistician 27(1), 17–21. (σ: n-es nevezővel.)"));

    function panel(cv, k, small) {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const s = SETS[k], o = ST[k];
      const bx = { x0: 30, y0: 10, x1: w - 10, y1: H - (small ? 24 : 38) };
      const { tx, ty } = axes(ctx, bx, {
        xmin: 2, xmax: 20, ymin: 2, ymax: 14,
        xticks: rangeTicks(2, 20, w < 330 ? 5 : 9), yticks: rangeTicks(2, 14, 6), xlabel: small ? "" : "x", ylabel: ""
      });
      w1Line(ctx, bx, tx, ty, o.a, o.b, 2, 20, css("--accent"), 2);
      s.x.forEach((x, i) => {
        if (i === s.hl) { ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tx(x), ty(s.y[i]), 9, 0, 2 * Math.PI); ctx.stroke(); }
        w1Dot(ctx, tx(x), ty(s.y[i]), small ? 4 : 5, css(i === s.hl ? "--bad" : "--setA"));
      });
      ctx.fillStyle = css("--text"); ctx.font = "bold 14px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(s.n + ".", bx.x0 + 8, bx.y0 + 4);
      ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = css("--muted");
      ctx.fillText(`r = ${fmt(o.r, 3)} · ρ = ${fmt(o.rho, 3)}`, bx.x0 + 34, bx.y0 + 6);
    }
    cvS.draw = () => view < 4 && panel(cvS, view, false);
    cvG.forEach((cv, k) => { cv.draw = () => view === 4 && panel(cv, k, true); });

    function setView(v) {
      view = v;
      vBtns.forEach((b, k) => b.classList.toggle("on", k === v));
      single.style.display = v < 4 ? "" : "none"; grid.style.display = v < 4 ? "none" : "";
      if (v < 4) { cvS.resize(); cvS.draw(); } else cvG.forEach(cv => { cv.resize(); cv.draw(); });
      cols.forEach((cs, k) => cs.forEach(c => { c.style.background = k === v ? "var(--accent-soft)" : ""; }));
      out.innerHTML = "<b>Mit látsz?</b> " + (v < 4 ? SETS[v].t :
        "A táblázat szerint a négy adatsor „ugyanaz” (r ≈ 0,82, y ≈ 3 + 0,5x), a képek szerint egyáltalán nem. " +
        "Az <i>r</i> csak a <b>lineáris</b> kapcsolat erősségét méri, és egyetlen pont is erősen befolyásolja – ezért mindig rajzold fel a pontdiagramot!");
    }
    setView(4);
  };

  /* ------------------------------------------------------------------
     3.6  Monoton, de nem egyenes – Pearson kontra Spearman
     ------------------------------------------------------------------ */
  W["rank-vs-pearson"] = root => {
    header(root, "Monoton, de nem egyenes – Pearson kontra Spearman",
      "Tíz pont: $x = 1, 2, \\dots, 10$ és $y = f(x)$. Bal oldalt az eredeti pontok, jobb oldalt a <b>rangjaik</b>. " +
      "A Spearman-féle $\\rho$ nem más, mint a rangpárok Pearson-féle $r$-je: azt méri, mennyire <b>monoton</b> a kapcsolat, nem azt, mennyire egyenes.");
    const FUN = {
      lin: ["lineáris: y = x", x => x], cub: ["köbös: y = x³", x => x ** 3], exp: ["exponenciális: y = 2ˣ", x => 2 ** x],
      sqrt: ["gyök: y = √x", x => Math.sqrt(x)], par: ["parabola: y = (x − 5,5)² (nem monoton)", x => (x - 5.5) ** 2],
      step: ["lépcső: y = 0 (x ≤ 5), 1 (x > 5)", x => (x <= 5 ? 0 : 1)]
    };
    const sel = h("select", { style: "max-width:100%" }, ...Object.entries(FUN).map(([k, [l]]) => h("option", { value: k }, l)));
    const nz = slider(0, 30, 1, 0), nzOut = h("b", { style: "display:inline-block;min-width:2.6em" });
    const outCb = h("input", { type: "checkbox" });
    let seed = 7;
    root.append(h("div", { class: "controls" }, h("label", null, "függvény:"), sel),
      h("div", { class: "controls" }, labelWrap("zaj szórása (a terjedelem %-ában):", nz, nzOut),
        btn("új zaj", () => { seed = 1 + Math.floor(Math.random() * 1e9); upd(); }),
        h("label", null, outCb, "kiugró pont (az utolsó pont mélyre kerül)")));
    const two = h("div", { class: "two-canvas" });
    const cap = t => h("div", { class: "muted", style: "font-size:.85rem;margin-bottom:.2rem" }, t);
    const cL = h("div", null, cap("Eredeti pontok (x; y) – Pearson r"));
    const cR = h("div", null, cap("Rangok (rang x; rang y) – ezek r-je = Spearman ρ"));
    two.append(cL, cR); root.append(two);
    const cvL = makeCanvas(cL, 0.78, 420), cvR = makeCanvas(cR, 0.78, 420);
    const stats = h("div", { class: "stat-row" }), out = h("div", { class: "readout" });
    root.append(stats, out);
    const SR = w1Stat(stats, "Pearson-féle $r$"), SP = w1Stat(stats, "Spearman-féle $\\rho$");
    const XS = Array.from({ length: 10 }, (_, i) => i + 1);

    function data() {
      const f = FUN[sel.value][1], fy = XS.map(f), lo = Math.min(...fy), rg = Math.max(...fy) - lo;
      const rnd = mulberry32(seed), z = XS.map(() => normal(rnd)), s = +nz.value / 100 * rg;
      const ys = fy.map((v, i) => v + s * z[i]);
      if (outCb.checked) ys[9] = lo - 2 * rg;
      return ys;
    }
    function plot(cv, xs, ys, rank) {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      let ymin = 0, ymax = 11;
      if (!rank) { const lo = Math.min(...ys), hi = Math.max(...ys), p = (hi - lo) * 0.08 || 0.5; ymin = lo - p; ymax = hi + p; }
      const yt = rank ? (w < 330 ? [2, 4, 6, 8, 10] : XS) : rangeTicks(ymin, ymax, 6);
      const wide = Math.max(...yt.map(v => String(v).length));
      const bx = { x0: 14 + 7 * wide, y0: 16, x1: w - 10, y1: H - 36 };
      const { tx, ty } = axes(ctx, bx, {
        xmin: 0, xmax: 11, ymin, ymax, xticks: w < 330 ? [2, 4, 6, 8, 10] : XS, yticks: yt,
        xlabel: rank ? "rang(x)" : "x", ylabel: rank ? "rang(y)" : "y"
      });
      const { a, b } = w1Fit(xs, ys);
      ctx.globalAlpha = 0.6; w1Line(ctx, bx, tx, ty, a, b, 0, 11, css("--muted"), 1.5); ctx.globalAlpha = 1;
      xs.forEach((x, i) => w1Dot(ctx, tx(x), ty(ys[i]), 5.5, css(outCb.checked && i === 9 ? "--bad" : rank ? "--setB" : "--setA")));
    }
    function upd() {
      nzOut.textContent = nz.value + "%";
      const ys = data(), rx = ranks(XS), ry = ranks(ys);
      cvL.draw = () => plot(cvL, XS, ys, false); cvR.draw = () => plot(cvR, rx, ry, true);
      cvL.draw(); cvR.draw();
      const r = pearson(XS, ys), rho = spearman(XS, ys);
      SR.textContent = fmt(r, 3); SP.textContent = fmt(rho, 3);
      const k = sel.value, clean = +nz.value === 0 && !outCb.checked;
      const BASE = {
        lin: "Egyenes: a pontok és a rangok is egy egyenesen vannak, <i>r</i> = <i>ρ</i> = 1.",
        cub: "Szigorúan monoton növekvő, de nem egyenes: a rangok tökéletes egyenest adnak (<i>ρ</i> = 1), az eredeti pontok nem (<i>r</i> &lt; 1).",
        exp: "Szigorúan monoton növekvő, de nagyon görbe: <i>ρ</i> = 1, míg <i>r</i> csak kb. 0,8 – a nagy értékek „elhúzzák” az egyenest.",
        sqrt: "Monoton növekvő és csak enyhén görbe: <i>ρ</i> = 1, <i>r</i> is közel 1.",
        par: "Nem monoton: előbb csökken, aztán nő. A két ág kioltja egymást, <i>r</i> = <i>ρ</i> = 0 – pedig <i>x</i> egyértelműen meghatározza <i>y</i>-t! Nem monoton kapcsolatot egyik együttható sem lát.",
        step: "Csak két különböző <i>y</i>-érték: sok a kötés, a rangok átlagrangok (3 és 8). Monoton (nem csökkenő), mégis <i>ρ</i> &lt; 1, mert a kötések miatt a rangok sem esnek egy egyenesre."
      };
      let txt = clean ? BASE[k] : "";
      if (+nz.value > 0) txt += (txt ? " " : "") + "Zajjal a pontok sorrendje is összekeveredhet, ezért <i>ρ</i> is 1 alá eshet.";
      if (outCb.checked) txt += (txt ? " " : "") + "<b>Kiugró pont:</b> <i>r</i> drasztikusan megváltozik (akár előjelet vált), <i>ρ</i> kevésbé – a rangok között a kiugró pont csak „a legkisebb” lesz, akármilyen messze van.";
      out.innerHTML = txt;
    }
    sel.addEventListener("change", upd); nz.addEventListener("input", upd); outCb.addEventListener("change", upd);
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
