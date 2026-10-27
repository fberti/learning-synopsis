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


  /* ==================================================================
     w2 – közös segédek (w2-előtaggal)
     ================================================================== */
  /* CSS-szín → [r, g, b] (a vászon fillStyle-normalizálásával), és két szín keveréke */
  const w2Ctx = document.createElement("canvas").getContext("2d");
  function w2Rgb(col) {
    w2Ctx.fillStyle = "#000"; w2Ctx.fillStyle = col;
    const s = w2Ctx.fillStyle;
    if (s[0] === "#") return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
    const m = s.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [128, 128, 128];
  }
  const w2Mix = (a, b, t) => { const A = w2Rgb(a), B = w2Rgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
  const w2Pct = (x, d = 1) => (isFinite(x) ? fmt(100 * x, d) + "%" : "–");
  const w2Ctl = (...kids) => h("div", { class: "controls" }, ...kids);
  const w2Seg = (labels, onPick) => { // gombcsoport egy kiválasztottal (.btn.on)
    const bs = labels.map((l, i) => btn(l, () => pick(i)));
    function pick(i, silent) { bs.forEach((b, j) => b.classList.toggle("on", i === j)); if (!silent) onPick(i); }
    return { bs, pick };
  };

  /* Csoportosított oszlopdiagram: groups = [{ label, vals: [{ v, col }], low: [szöveg oszloponként] }] */
  function w2Bars(ctx, bx, groups, { ymax = 100, yticks = [0, 20, 40, 60, 80, 100], ylabel = "", top = v => Math.round(v) + "%" } = {}) {
    const { ty } = axes(ctx, bx, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks, ylabel });
    const gw = (bx.x1 - bx.x0) / groups.length, gap = 3;
    groups.forEach((g, gi) => {
      const k = g.vals.length, cx = bx.x0 + gw * (gi + 0.5);
      const bw = Math.min(48, (gw * 0.82 - (k - 1) * gap) / k), left = cx - (k * bw + (k - 1) * gap) / 2;
      g.vals.forEach((b, j) => {
        if (b.v == null || !isFinite(b.v)) return;
        const x = left + j * (bw + gap);
        ctx.fillStyle = css(b.col); ctx.fillRect(x, ty(b.v), bw, ty(0) - ty(b.v));
        ctx.fillStyle = css("--text"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        if (bw >= 26) { ctx.font = "11px system-ui, sans-serif"; ctx.fillText(top(b.v), x + bw / 2, ty(b.v) - 2); }
        else if (bw >= 11) { ctx.font = "9px system-ui, sans-serif"; ctx.fillText(String(Math.round(b.v)), x + bw / 2, ty(b.v) - 1); }
      });
      ctx.textBaseline = "top"; ctx.textAlign = "center";
      let y = bx.y1 + 4;
      if (g.low) {
        ctx.font = "10px system-ui, sans-serif";
        const fits = g.low.every(s => ctx.measureText(s).width <= bw + gap);
        if (fits) { g.low.forEach((s, j) => { ctx.fillStyle = css(g.vals[j].col); ctx.fillText(s, left + j * (bw + gap) + bw / 2, y); }); y += 13; }
        else g.low.forEach((s, j) => { ctx.fillStyle = css(g.vals[j].col); ctx.fillText(s, cx, y); y += 12; });
      }
      ctx.font = "600 11px system-ui, sans-serif"; ctx.fillStyle = css("--text");
      ctx.fillText(g.label, cx, y + 1);
    });
    return ty;
  }
  function w2Legend(ctx, x, y, items) { // items: [[szöveg, színváltozó]]
    ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    items.forEach(([t, c]) => {
      ctx.fillStyle = css(c); ctx.fillRect(x, y - 5, 10, 10);
      ctx.fillStyle = css("--text"); ctx.fillText(t, x + 14, y);
      x += 22 + ctx.measureText(t).width;
    });
  }
  /* legkisebb négyzetes egyenes (ha értelmezhető) */
  const w2Fit = (x, y) => { const sx = psd(x); if (!(sx > 0)) return null; const b = pcov(x, y) / sx ** 2; return { b, a: mean(y) - b * mean(x) }; };
  /* makeCanvas, de a magasság max(minH, aspect · szélesség) – vagy hFn(szélesség), ha meg van adva */
  function w2Canvas(parent, aspect, minH = 0, maxW = 760, hFn = null) {
    const cv = makeCanvas(parent, aspect, maxW);
    cv.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW);
      const hh = Math.round(hFn ? hFn(w) : Math.max(minH, w * aspect));
      const dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv.w = w; cv.h = hh;
    };
    cv.resize();
    return cv;
  }
  const w2Prose = "font-family:var(--font)";

  /* ------------------------------------------------------------------
     3.2  Kontingencia-tábla: megfigyelt kontra várt
     ------------------------------------------------------------------ */
  W["contingency-assoc"] = root => {
    header(root, "Kontingencia-tábla: megfigyelt kontra várt",
      "Írd át a cellákat, vagy válassz kész táblát. A cella színe azt mutatja, hogy a megfigyelt gyakoriság <b>több</b> (▲, kék) vagy " +
      "<b>kevesebb</b> (▼, narancs), mint amennyi függetlenség esetén várható: $f^*_{ij} = f_{i\\cdot}\\, f_{\\cdot j}/N$. " +
      "Az alsó ábra a sorszázalékokat mutatja: ha a sávok egyformák, a két ismérv független.");
    const PRE = [
      { name: "Dohányzás × nem (200 fő)", rows: ["Férfi", "Nő"], cols: ["dohányzik", "nem dohányzik"], t: [[30, 70], [20, 80]] },
      { name: "Iparág × bírság (NGA, 50 cég)", rows: ["Textilipar", "Élelmiszeripar"], cols: ["fizetett", "nem fizetett"], t: [[18, 2], [5, 25]],
        note: "Tankönyvi példa: Némethné Gál Andrea: Általános statisztika (2000) – 50 cég környezetszennyezési bírsága." },
      { name: "Végzettség × olvasás (300 fő)", rows: ["alapfokú", "középfokú", "felsőfokú"], cols: ["soha", "néha", "rendszeresen"], t: [[40, 45, 15], [30, 50, 20], [10, 40, 50]] },
      { name: "Független tábla", rows: ["A", "B"], cols: ["igen", "nem"], t: [[20, 30], [40, 60]] }
    ];
    const SIZES = [[2, 2], [2, 3], [3, 3]];
    const DEF_R = ["1. sor", "2. sor", "3. sor"], DEF_C = ["1. oszlop", "2. oszlop", "3. oszlop"];
    const COLS = ["--setA", "--setB", "--setC"];
    let rows, cols, t, note = "", msg = "";

    const sel = h("select", null, ...PRE.map((p, i) => h("option", { value: i }, p.name)));
    sel.addEventListener("change", () => load(+sel.value));
    const size = w2Seg(SIZES.map(([b, c]) => `${b}×${c}`), i => resize(...SIZES[i]));
    root.append(w2Ctl(labelWrap("tábla:", sel)),
      w2Ctl(h("span", { class: "muted", style: "font-size:.92rem" }, "méret:"), ...size.bs,
        btn("minden cella × 2", () => {
          const before = calc().chi;
          t = t.map(r => r.map(v => v * 2));
          const after = calc().chi;
          msg = isFinite(before) && isFinite(after)
            ? `Minden cella duplázva: a $\\chi^2$ ${fmt(before, 2)} → ${fmt(after, 2)} (kétszeresére nőtt), de $V$ és $Q$ nem változott. ` +
              "A $\\chi^2$ a minta nagyságától is függ, ezért a kapcsolat erősségét a $V$ (vagy 2×2-nél a $Q$) méri."
            : "";
          build();
        })));
    const tw = h("div", { class: "two-col" });
    const obsBox = h("div", { class: "tw", style: "overflow-x:auto" }), expBox = h("div", { class: "tw", style: "overflow-x:auto" });
    tw.append(h("div", null, h("div", { class: "muted", style: "font-size:.88rem" }, "Megfigyelt gyakoriságok ($f_{ij}$) – szerkeszthető"), obsBox),
      h("div", null, h("div", { class: "muted", style: "font-size:.88rem" }, "Várt gyakoriságok függetlenség esetén ($f^*_{ij}$)"), expBox));
    root.append(tw);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    root.append(h("div", { class: "muted", style: "font-size:.88rem;margin-top:.8rem" }, "Sorszázalékok (feltételes eloszlások) és az összesített megoszlás:"));
    const cv = w2Canvas(root, 0, 0, 760, () => 34 + ((t ? t.length : 2) + 1) * 30);
    const out = h("div", { class: "readout" }), noteEl = h("p", { class: "muted", style: "font-size:.85rem;margin:.4rem 0 0" });
    root.append(out, noteEl);

    function calc() {
      const b = t.length, c = t[0].length;
      const R = t.map(r => r.reduce((s, v) => s + v, 0)), C = t[0].map((_, j) => t.reduce((s, r) => s + r[j], 0));
      const N = R.reduce((s, v) => s + v, 0);
      const E = t.map((r, i) => r.map((_, j) => (N > 0 ? R[i] * C[j] / N : NaN)));
      const ok = N > 0 && R.every(v => v > 0) && C.every(v => v > 0);
      let chi = NaN;
      if (ok) { chi = 0; t.forEach((r, i) => r.forEach((v, j) => { chi += (v - E[i][j]) ** 2 / E[i][j]; })); }
      const V = ok ? Math.sqrt(chi / (N * Math.min(b - 1, c - 1))) : NaN;
      let Q = NaN;
      if (b === 2 && c === 2) { const ad = t[0][0] * t[1][1], bc = t[0][1] * t[1][0]; Q = ad + bc > 0 ? (ad - bc) / (ad + bc) : NaN; }
      return { b, c, R, C, N, E, chi, V, Q };
    }

    const cellStyle = z => {
      if (!isFinite(z) || Math.abs(z) < 0.05) return "";
      const p = Math.round(Math.min(1, Math.abs(z) / 3) * 45) + 6;
      return `background:color-mix(in srgb, var(${z > 0 ? "--setA" : "--setB"}) ${p}%, var(--card))`;
    };
    const th = (txt, extra = "") => h("th", { style: "white-space:nowrap;font-size:.85rem;padding:.3em .45em;" + extra }, txt);
    const tdS = "padding:.3em .45em;white-space:nowrap;";

    function build() {
      const K = calc();
      /* megfigyelt tábla */
      const tb = h("table", { style: "width:auto;margin:.3rem 0" });
      tb.append(h("tr", null, th(""), ...cols.map(c => th(c)), th("Σ", "color:var(--muted)")));
      t.forEach((r, i) => {
        const tr = h("tr", null, th(rows[i], "text-align:left"));
        r.forEach((v, j) => {
          const z = isFinite(K.E[i][j]) && K.E[i][j] > 0 ? (v - K.E[i][j]) / Math.sqrt(K.E[i][j]) : NaN;
          const inp = h("input", { type: "number", min: 0, step: 1, value: v, style: "width:4.3em;padding:.2rem .3rem", "aria-label": `${rows[i]} – ${cols[j]}` });
          const mark = h("span", { class: "w2mark", style: "display:inline-block;width:1em;margin-left:.2em;font-size:.8rem;color:var(--muted)" },
            isFinite(z) && Math.abs(z) >= 0.05 ? (z > 0 ? "▲" : "▼") : "");
          inp.addEventListener("input", () => {
            const nv = Math.max(0, Math.floor(+inp.value || 0));
            t[i][j] = nv; msg = ""; refresh();
          });
          inp.addEventListener("change", () => { inp.value = t[i][j]; });
          tr.append(h("td", { style: tdS + cellStyle(z), "data-cell": `${i}-${j}` }, inp, mark));
        });
        tr.append(h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)", "data-rsum": i }, String(K.R[i])));
        tb.append(tr);
      });
      tb.append(h("tr", null, th("Σ", "text-align:left;color:var(--muted)"),
        ...K.C.map((v, j) => h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)", "data-csum": j }, String(v))),
        h("td", { style: tdS + "font-family:var(--mono);font-weight:700", "data-n": "" }, String(K.N))));
      obsBox.replaceChildren(tb);
      cv.resize();
      refresh();
    }

    function refresh() {
      const K = calc();
      /* megfigyelt tábla: színek, jelek, peremek frissítése (a beviteli mezőket nem építjük újra, hogy a fókusz megmaradjon) */
      t.forEach((r, i) => r.forEach((v, j) => {
        const td = obsBox.querySelector(`[data-cell="${i}-${j}"]`);
        if (!td) return;
        const z = isFinite(K.E[i][j]) && K.E[i][j] > 0 ? (v - K.E[i][j]) / Math.sqrt(K.E[i][j]) : NaN;
        td.setAttribute("style", tdS + cellStyle(z));
        td.querySelector(".w2mark").textContent = isFinite(z) && Math.abs(z) >= 0.05 ? (z > 0 ? "▲" : "▼") : "";
        const inp = td.querySelector("input");
        if (document.activeElement !== inp) inp.value = v;
      }));
      K.R.forEach((v, i) => { const e = obsBox.querySelector(`[data-rsum="${i}"]`); if (e) e.textContent = v; });
      K.C.forEach((v, j) => { const e = obsBox.querySelector(`[data-csum="${j}"]`); if (e) e.textContent = v; });
      const nEl = obsBox.querySelector("[data-n]"); if (nEl) nEl.textContent = K.N;
      /* várt tábla */
      const te = h("table", { style: "width:auto;margin:.3rem 0" });
      te.append(h("tr", null, th(""), ...cols.map(c => th(c)), th("Σ", "color:var(--muted)")));
      K.E.forEach((r, i) => te.append(h("tr", null, th(rows[i], "text-align:left"),
        ...r.map(v => h("td", { style: tdS + "font-family:var(--mono)" }, fmt(v, 1))),
        h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)" }, String(K.R[i])))));
      te.append(h("tr", null, th("Σ", "text-align:left;color:var(--muted)"),
        ...K.C.map(v => h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)" }, String(v))),
        h("td", { style: tdS + "font-family:var(--mono);font-weight:700" }, String(K.N))));
      expBox.replaceChildren(te);
      /* kijelzők */
      const strength = !isFinite(K.V) ? "–" : K.V < 0.0005 ? "független" : K.V < 0.4 ? "gyenge" : K.V <= 0.6 ? "közepes" : "szoros";
      const st = [stat("$N$", String(K.N)), stat("$\\chi^2$", fmt(K.chi, 2)), stat("Cramér-féle $V$", fmt(K.V, 3))];
      if (K.b === 2 && K.c === 2) st.push(stat("Yule-féle $Q$", fmt(K.Q, 3)));
      st.push(stat("kapcsolat", strength));
      stats.replaceChildren(...st);
      let txt = "";
      if (!(K.N > 0)) txt = "A tábla üres – írj be gyakoriságokat!";
      else if (!isFinite(K.chi)) txt = "Van üres sor vagy oszlop (0 perem): ott a várt gyakoriság 0, így a $\\chi^2$ és a $V$ nem értelmezhető (–).";
      else txt = `$\\chi^2 = \\sum (f - f^*)^2/f^* = ${fmt(K.chi, 2).replace(",", "{,}")}$<br>` +
        `$V = \\sqrt{\\chi^2/(N\\cdot ${Math.min(K.b - 1, K.c - 1)})} = ${fmt(K.V, 3).replace(",", "{,}")}$` +
        (K.b === 2 && K.c === 2 && isFinite(K.Q) ? `<br>$Q = (ad - bc)/(ad + bc) = ${fmt(K.Q, 3).replace(",", "{,}")}$` : "") +
        ` → <b>${strength}</b> kapcsolat.`;
      out.innerHTML = txt + (msg ? "<br>" + msg : "");
      noteEl.textContent = note;
      window.Synopsis && Synopsis.renderMath(stats);
      window.Synopsis && Synopsis.renderMath(out);
      cv.draw();
    }

    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const K = calc();
      const lab = [...rows, "összesen"], data = [...t, K.C];
      ctx.font = "12px system-ui, sans-serif";
      const lw = Math.min(w * 0.3, Math.max(...lab.map(s => ctx.measureText(s).width)) + 10);
      const x0 = lw, x1 = w - 8, top = 24, rowH = 30;
      /* jelmagyarázat */
      let lx = x0;
      ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      cols.forEach((c, j) => {
        ctx.fillStyle = css(COLS[j]); ctx.fillRect(lx, 7, 10, 10);
        ctx.fillStyle = css("--text"); ctx.fillText(c, lx + 14, 12);
        lx += 24 + ctx.measureText(c).width;
      });
      data.forEach((r, i) => {
        const y = top + i * rowH + (i === data.length - 1 ? 4 : 0), bh = rowH - 7, s = r.reduce((a, v) => a + v, 0);
        ctx.font = (i === data.length - 1 ? "600 " : "") + "12px system-ui, sans-serif";
        ctx.fillStyle = css("--text"); ctx.textAlign = "right"; ctx.fillText(lab[i], x0 - 8, y + bh / 2);
        if (!(s > 0)) { ctx.fillStyle = css("--muted"); ctx.textAlign = "left"; ctx.fillText("–", x0 + 4, y + bh / 2); return; }
        let x = x0;
        r.forEach((v, j) => {
          const ww = (x1 - x0) * v / s;
          ctx.fillStyle = css(COLS[j]); ctx.globalAlpha = i === data.length - 1 ? 1 : 0.85;
          ctx.fillRect(x, y, ww, bh); ctx.globalAlpha = 1;
          ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center";
          const lbl = Math.round(100 * v / s) + "%";
          if (ww > ctx.measureText(lbl).width + 6) { ctx.fillStyle = "#fff"; ctx.fillText(lbl, x + ww / 2, y + bh / 2 + 0.5); }
          x += ww;
        });
        if (i === data.length - 1) { ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.2; ctx.strokeRect(x0, y, x1 - x0, bh); }
      });
    };

    function resize(b, c) {
      t = Array.from({ length: b }, (_, i) => Array.from({ length: c }, (_, j) => (t[i] && t[i][j] != null ? t[i][j] : 10)));
      rows = Array.from({ length: b }, (_, i) => rows[i] || DEF_R[i]);
      cols = Array.from({ length: c }, (_, j) => cols[j] || DEF_C[j]);
      note = ""; msg = ""; build();
    }
    function load(k) {
      const p = PRE[k];
      t = p.t.map(r => r.slice()); rows = p.rows.slice(); cols = p.cols.slice(); note = p.note || ""; msg = "";
      size.pick(SIZES.findIndex(([b, c]) => b === t.length && c === t[0].length), true);
      build();
    }
    load(0);
  };

  /* ------------------------------------------------------------------
     3.7  Simpson-paradoxon: felvételi két szakra + Berkeley 1973
     ------------------------------------------------------------------ */
  W["simpson-slider"] = root => {
    header(root, "Simpson-paradoxon: felvételi két szakra",
      "1000 férfi és 1000 nő jelentkezik két szakra. A felvételi arány rögzített: a <b>könnyű</b> szakon férfi 60%, nő 65%; " +
      "a <b>nehéz</b> szakon férfi 20%, nő 25% – a nők <b>mindkét</b> szakon jobbak. A csúszkákkal azt állítod, ki hova jelentkezik. " +
      "Figyeld az „összesen” oszlopokat!");
    const tabs = w2Seg(["Szimulált: két szak", "Berkeley, 1973 (valódi adatok)"], i => setTab(i));
    root.append(w2Ctl(...tabs.bs));
    const pS = h("div"), pB = h("div");
    root.append(pS, pB);

    /* --- szimulált --- */
    const RATE = { m: [0.6, 0.2], f: [0.65, 0.25] }, NN = 1000;
    const sf = slider(0, 100, 1, 80), sm = slider(0, 100, 1, 20), sfO = h("b"), smO = h("b");
    pS.append(w2Ctl(labelWrap("a nők hány %-a jelentkezik a nehéz szakra:", sf, sfO)),
      w2Ctl(labelWrap("a férfiak hány %-a:", sm, smO)));
    const cv = w2Canvas(pS, 0.5, 280);
    const stS = h("div", { class: "stat-row" }), msgS = h("div", { class: "readout" });
    pS.append(stS, msgS);
    const simData = () => {
      const g = (s, pHard) => {
        const nH = Math.round(NN * pHard), nE = NN - nH;
        const aE = Math.round(nE * RATE[s][0]), aH = Math.round(nH * RATE[s][1]);
        return [{ a: aE, n: nE }, { a: aH, n: nH }, { a: aE + aH, n: NN }];
      };
      return { m: g("m", +sm.value / 100), f: g("f", +sf.value / 100) };
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const d = simData();
      const groups = ["könnyű szak", "nehéz szak", "összesen"].map((label, g) => ({
        label,
        vals: [{ v: d.m[g].n ? 100 * d.m[g].a / d.m[g].n : NaN, col: "--setA" }, { v: d.f[g].n ? 100 * d.f[g].a / d.f[g].n : NaN, col: "--setB" }],
        low: [`${d.m[g].a}/${d.m[g].n}`, `${d.f[g].a}/${d.f[g].n}`]
      }));
      const bx = { x0: 34, y0: 30, x1: w - 8, y1: H - 50 };
      w2Bars(ctx, bx, groups, { ylabel: "felvételi arány (%)" });
      w2Legend(ctx, w - 110, 12, [["férfi", "--setA"], ["nő", "--setB"]]);
      /* az „összesen” csoport kiemelése */
      const gw = (bx.x1 - bx.x0) / 3;
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx.x0 + 2 * gw, bx.y0); ctx.lineTo(bx.x0 + 2 * gw, bx.y1); ctx.stroke(); ctx.restore();
    };
    function updS() {
      sfO.textContent = sf.value + "%"; smO.textContent = sm.value + "%";
      cv.draw();
      const d = simData(), m = d.m[2].a / NN, f = d.f[2].a / NN;
      stS.replaceChildren(stat("férfiak összesen", `${w2Pct(m)} (${d.m[2].a}/${NN})`), stat("nők összesen", `${w2Pct(f)} (${d.f[2].a}/${NN})`));
      const base = "Miért? A nehéz szakon mindenkinek kicsi az esélye. Aki oda jelentkezik, annak az összesített aránya lemegy – " +
        "a <b>szak</b> itt a zavaró (háttér)változó, amely a nemmel és a felvétellel is összefügg.";
      if (m > f + 1e-12) {
        msgS.style.cssText = w2Prose + ";background:var(--bad-soft);border-left:4px solid var(--bad)";
        msgS.innerHTML = "<b style='color:var(--bad)'>Simpson-paradoxon: szakonként a nők jobbak, összesítve a férfiak!</b><br>" + base;
      } else {
        msgS.style.cssText = w2Prose;
        msgS.innerHTML = (Math.abs(m - f) < 1e-12 ? "Összesítve egyforma a két arány. " : "Nincs paradoxon: összesítve is a nők aránya nagyobb. ") +
          "Próbáld ki: küldd a nők többségét a nehéz szakra, a férfiakat a könnyűre!";
      }
    }
    sf.addEventListener("input", updS); sm.addEventListener("input", updS);

    /* --- Berkeley, 1973 --- */
    const BK = { // [felvett, jelentkező]
      m: { A: [512, 825], B: [353, 560], C: [120, 325], D: [138, 417], E: [53, 191], F: [22, 373] },
      f: { A: [89, 108], B: [17, 25], C: [202, 593], D: [131, 375], E: [94, 393], F: [24, 341] }
    };
    const DEP = Object.keys(BK.m);
    const tot = s => DEP.reduce((a, k) => [a[0] + BK[s][k][0], a[1] + BK[s][k][1]], [0, 0]);
    const TM = tot("m"), TF = tot("f");
    pB.append(h("p", { class: "muted", style: "font-size:.9rem;margin:.2rem 0" },
      "A Kaliforniai Egyetem (Berkeley) hat legnagyobb szakja, 1973 ősz. Fent a felvételi arányok, lent az, hogy a férfi, illetve a női jelentkezők hány %-a jelentkezett az adott szakra."));
    const cvB = w2Canvas(pB, 0.78, 470);
    const stB = h("div", { class: "stat-row" });
    pB.append(stB);
    const tbl = h("table", { style: "width:auto;font-size:.85rem;margin:.6rem 0" });
    tbl.append(h("tr", null, ...["szak", "férfi: felvett/jelentk.", "arány", "nő: felvett/jelentk.", "arány", "jobb"].map(s => h("th", { style: "padding:.25em .45em;white-space:nowrap" }, s))));
    const tdc = (s, extra = "") => h("td", { style: "padding:.25em .45em;white-space:nowrap;font-family:var(--mono);" + extra }, s);
    [...DEP, "Σ"].forEach(k => {
      const [ma, mn] = k === "Σ" ? TM : BK.m[k], [fa, fn] = k === "Σ" ? TF : BK.f[k];
      const better = fa / fn > ma / mn ? "nő" : "férfi";
      tbl.append(h("tr", k === "Σ" ? { style: "font-weight:700" } : null, tdc(k === "Σ" ? "összesen" : k), tdc(`${ma}/${mn}`), tdc(w2Pct(ma / mn), "color:var(--setA)"),
        tdc(`${fa}/${fn}`), tdc(w2Pct(fa / fn), "color:var(--setB)"), tdc(better, better === "nő" ? "color:var(--setB)" : "color:var(--setA)")));
    });
    pB.append(h("div", { class: "tw", style: "overflow-x:auto" }, tbl));
    pB.append(h("div", { class: "readout", style: w2Prose },
      "Összesítve a férfiak aránya jóval nagyobb (44,5% kontra 30,4%), pedig a hat szakból négyen (A, B, D, F) a nők aránya a nagyobb, " +
      "a másik kettőn (C, E) is csak kicsi a különbség. A magyarázat: a nők főleg a sok jelentkezőt elutasító C–F szakokra jelentkeztek, " +
      "a férfiak nagy része a könnyebb A és B szakra."));
    pB.append(h("p", { class: "muted", style: "font-size:.8rem;margin:.4rem 0 0" },
      "Forrás: Bickel, P. J., Hammel, E. A., O'Connell, J. W. (1975): Sex Bias in Graduate Admissions: Data from Berkeley. Science 187, 398–404; " +
      "az R „UCBAdmissions” adatkészlete."));
    cvB.draw = () => {
      const { ctx, w, h: H } = cvB; ctx.clearRect(0, 0, w, H);
      const g1 = [...DEP, "össz."].map(k => {
        const [ma, mn] = k === "össz." ? TM : BK.m[k], [fa, fn] = k === "össz." ? TF : BK.f[k];
        return { label: k, vals: [{ v: 100 * ma / mn, col: "--setA" }, { v: 100 * fa / fn, col: "--setB" }] };
      });
      const mid = Math.round(H * 0.56);
      const b1 = { x0: 34, y0: 30, x1: w - 8, y1: mid - 22 };
      w2Bars(ctx, b1, g1, { ylabel: "felvételi arány (%)" });
      w2Legend(ctx, w - 110, 12, [["férfi", "--setA"], ["nő", "--setB"]]);
      const gw = (b1.x1 - b1.x0) / g1.length;
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(b1.x0 + 6 * gw, b1.y0); ctx.lineTo(b1.x0 + 6 * gw, b1.y1); ctx.stroke(); ctx.restore();
      const g2 = DEP.map(k => ({ label: k, vals: [{ v: 100 * BK.m[k][1] / TM[1], col: "--setA" }, { v: 100 * BK.f[k][1] / TF[1], col: "--setB" }] }));
      const b2 = { x0: 34, y0: mid + 22, x1: b1.x0 + 6 * gw, y1: H - 22 };
      w2Bars(ctx, b2, g2, { ymax: 40, yticks: [0, 10, 20, 30, 40], ylabel: "a jelentkezők hány %-a jelentkezett ide" });
    };
    stB.append(stat("férfiak összesen", `${w2Pct(TM[0] / TM[1])} (${TM[0]}/${TM[1]})`), stat("nők összesen", `${w2Pct(TF[0] / TF[1])} (${TF[0]}/${TF[1]})`));

    function setTab(i) {
      pS.style.display = i ? "none" : ""; pB.style.display = i ? "" : "none";
      const c = i ? cvB : cv; c.resize(); c.draw();
    }
    tabs.pick(0, true); setTab(0); updS();
  };

  /* ------------------------------------------------------------------
     3.7  Látszólagos korreláció: két független véletlen bolyongás
     ------------------------------------------------------------------ */
  W["spurious"] = root => {
    header(root, "Két független véletlen bolyongás",
      "Két egymástól <b>teljesen független</b> sorozatot generálunk. „Véletlen bolyongásnál” minden lépés az előző értékhez ad egy véletlen számot " +
      "($x_t = x_{t-1} + \\varepsilon_t$), így a sorozat hosszan elkóborol – trendel. „Független zajnál” minden érték új: $x_t = \\varepsilon_t$. " +
      "Nézd meg, mekkora $r$ jön ki a kettő között!");
    let type = 0, X = [], Y = [], sim = null;
    const rnd = mulberry32(23), rndSim = mulberry32(777); // a 23-as mag első párja látványosan korrelál (r ≈ 0,85)
    const types = w2Seg(["véletlen bolyongás (trendelő)", "független zaj"], i => { type = i; newPair(); });
    const nS = slider(20, 200, 10, 50), nO = h("b");
    root.append(w2Ctl(...types.bs),
      w2Ctl(labelWrap("hossz $n$:", nS, nO), btn("Új pár", () => newPair(), "btn primary"), btn("1000 pár szimulálása", () => simulate())));
    const cvT = w2Canvas(root, 0.3, 170);
    const grid = h("div", { class: "two-col", style: "margin-top:.6rem" }), c1 = h("div"), c2 = h("div");
    grid.append(c1, c2); root.append(grid);
    const cvS = makeCanvas(c1, 0.82, 420), cvH = makeCanvas(c2, 0.82, 420);
    const stats = h("div", { class: "stat-row" }), out = h("div", { class: "readout" });
    root.append(stats, out,
      h("p", { style: "margin:.6rem 0 0;font-size:.95rem" }, h("b", null, "Tanulság: "),
        "A két sorozatnak semmi köze egymáshoz – mégis gyakran „erősen korrelál”, mert mindkettő trendel."));

    const series = (n, tp, r) => { let s = 0; return Array.from({ length: n }, () => { const e = normal(r); s = tp ? e : s + e; return s; }); };
    const z = a => { const m = mean(a), s = psd(a) || 1; return a.map(v => (v - m) / s); };

    function newPair() {
      const n = +nS.value;
      X = series(n, type, rnd); Y = series(n, type, rnd);
      upd();
    }
    function simulate() {
      const n = +nS.value, res = [[], []];
      for (let tp = 0; tp < 2; tp++) for (let k = 0; k < 1000; k++) res[tp].push(pearson(series(n, tp, rndSim), series(n, tp, rndSim)));
      sim = { n, res, share: res.map(a => a.filter(r => Math.abs(r) > 0.5).length / a.length) };
      upd();
    }
    function upd() {
      nO.textContent = nS.value;
      cvT.draw(); cvS.draw(); cvH.draw();
      const r = pearson(X, Y);
      const st = [stat("$r$ (ez a pár)", fmt(r, 2))];
      if (sim) st.push(stat("$|r| > 0{,}5$ – bolyongás", w2Pct(sim.share[0])), stat("$|r| > 0{,}5$ – zaj", w2Pct(sim.share[1])));
      stats.replaceChildren(...st);
      out.innerHTML = `n = <b>${X.length}</b>, ${type ? "független zaj" : "véletlen bolyongás"}: r = <b>${fmt(r, 2)}</b>` +
        (Math.abs(r) > 0.5 ? " – „erős” kapcsolatnak látszik, pedig a két sorozat független!" : "") +
        (sim ? `<br>1000 független pár (n = ${sim.n}): |r| > 0,5 a bolyongásoknál az esetek <b>${w2Pct(sim.share[0])}</b>-ában, ` +
          `a független zajnál <b>${w2Pct(sim.share[1])}</b>-ában.` : "<br>Kattints az „1000 pár szimulálása” gombra: milyen gyakori a nagy |r|?");
      window.Synopsis && Synopsis.renderMath(stats);
    }
    nS.addEventListener("input", () => { newPair(); if (sim) simulate(); });

    cvT.draw = () => {
      const { ctx, w, h: H } = cvT; ctx.clearRect(0, 0, w, H);
      if (!X.length) return;
      const zx = z(X), zy = z(Y), n = X.length;
      const M = Math.max(2.5, ...zx.map(Math.abs), ...zy.map(Math.abs));
      const bx = { x0: 30, y0: 22, x1: w - 8, y1: H - 36 };
      const { tx, ty } = axes(ctx, bx, { xmin: 1, xmax: n, ymin: -M, ymax: M, xticks: rangeTicks(1, n, 8).filter(v => v >= 1), yticks: [-2, 0, 2], xlabel: "idő (t)" });
      [[zx, "--setA"], [zy, "--setB"]].forEach(([a, c]) => {
        ctx.strokeStyle = css(c); ctx.lineWidth = 2; ctx.beginPath();
        a.forEach((v, i) => (i ? ctx.lineTo(tx(i + 1), ty(v)) : ctx.moveTo(tx(i + 1), ty(v))));
        ctx.stroke();
      });
      w2Legend(ctx, bx.x0 + 4, 10, [["x (standardizálva)", "--setA"], ["y (standardizálva)", "--setB"]]);
    };
    cvS.draw = () => {
      const { ctx, w, h: H } = cvS; ctx.clearRect(0, 0, w, H);
      if (!X.length) return;
      const zx = z(X), zy = z(Y), M = Math.max(2.5, ...zx.map(Math.abs), ...zy.map(Math.abs)) * 1.05;
      const bx = { x0: 28, y0: 22, x1: w - 10, y1: H - 36 };
      const { tx, ty } = axes(ctx, bx, { xmin: -M, xmax: M, ymin: -M, ymax: M, xticks: [-2, 0, 2], yticks: [-2, 0, 2], xlabel: "x", ylabel: "y", xfmt: v => String(v) });
      ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.75;
      zx.forEach((v, i) => { ctx.beginPath(); ctx.arc(tx(v), ty(zy[i]), 3.2, 0, 2 * Math.PI); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = css("--text"); ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText("r = " + fmt(pearson(X, Y), 2), bx.x1 - 4, 4);
      ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = css("--muted"); ctx.fillText("pontdiagram", bx.x0 + 22, 6);
    };
    cvH.draw = () => {
      const { ctx, w, h: H } = cvH; ctx.clearRect(0, 0, w, H);
      const bx = { x0: 34, y0: 22, x1: w - 10, y1: H - 36 };
      const B = 40, cnt = [new Array(B).fill(0), new Array(B).fill(0)];
      if (sim) sim.res.forEach((a, tp) => a.forEach(r => { if (isFinite(r)) cnt[tp][Math.min(B - 1, Math.max(0, Math.floor((r + 1) / 2 * B)))]++; }));
      const ymax = sim ? Math.max(10, ...cnt[0], ...cnt[1]) * 1.08 : 100;
      /* |r| > 0,5 tartományok */
      const tx0 = v => bx.x0 + (v + 1) / 2 * (bx.x1 - bx.x0);
      ctx.fillStyle = css("--bad-soft");
      ctx.fillRect(tx0(-1), bx.y0, tx0(-0.5) - tx0(-1), bx.y1 - bx.y0); ctx.fillRect(tx0(0.5), bx.y0, tx0(1) - tx0(0.5), bx.y1 - bx.y0);
      const { tx, ty } = axes(ctx, bx, { xmin: -1, xmax: 1, ymin: 0, ymax, xticks: [-1, -0.5, 0, 0.5, 1], yticks: sim ? rangeTicks(0, ymax, 4) : [], xlabel: "r", xfmt: v => String(v).replace(".", ",") });
      if (sim) {
        [[0, "--accent", 0.55], [1, "--setC", 0.6]].forEach(([tp, c, al]) => {
          ctx.fillStyle = css(c); ctx.globalAlpha = al;
          cnt[tp].forEach((k, i) => { const a = -1 + 2 * i / B, b = a + 2 / B; if (k) ctx.fillRect(tx(a) + 0.5, ty(k), tx(b) - tx(a) - 1, ty(0) - ty(k)); });
        });
        ctx.globalAlpha = 1;
        w2Legend(ctx, bx.x0 + 4, 10, [["bolyongás", "--accent"], ["zaj", "--setC"]]);
        ctx.font = "10px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.textBaseline = "top";
        ctx.fillText(`1000 pár, n = ${sim.n}`, bx.x1 - 2, bx.y0 + 2);
      } else {
        ctx.fillStyle = css("--muted"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("Az r-ek hisztogramja itt jelenik meg", (bx.x0 + bx.x1) / 2, (bx.y0 + bx.y1) / 2 - 9);
        ctx.fillText("(„1000 pár szimulálása”)", (bx.x0 + bx.x1) / 2, (bx.y0 + bx.y1) / 2 + 9);
      }
      if (X.length) { const r = pearson(X, Y); if (isFinite(r)) vline(ctx, tx(r), bx.y0, bx.y1, css("--bad"), true); }
    };
    types.pick(0, true);
    newPair();
  };

  /* ------------------------------------------------------------------
     3.7  Zavaró változó: fagyi, fulladás, hőmérséklet
     ------------------------------------------------------------------ */
  W["confounder"] = root => {
    header(root, "Fagyi és fulladás: a hőmérséklet a háttérben",
      "Szimulált adatok: 10 év heti adatai (520 hét). $T$ a heti középhőmérséklet (°C), $F$ a fagylalteladás (ezer gombóc), $D$ a vízi balesetek száma. " +
      "$F$ és $D$ is a hőmérséklettől függ, de <b>egymástól nem</b>: adott $T$ mellett függetlenek. A pont színe a hőmérséklet (kék = hideg, narancs = meleg). " +
      "Mozgasd a hőmérséklet-sávot!");
    /* adatok, rögzített maggal */
    const rnd = mulberry32(31337), N = 520, T = [], F = [], D = [], J = [];
    for (let k = 0; k < N; k++) {
      const t = 11 - 11 * Math.cos(2 * Math.PI * k / 52) + 3 * normal(rnd);
      T.push(t);
      F.push(Math.max(0, 5 + 2 * t + 5 * normal(rnd)));
      D.push(poisson(0.3 * Math.max(0, t - 10), rnd));
      J.push((rnd() - 0.5) * 0.5);
    }
    const rFD = pearson(F, D), rTF = pearson(T, F), rTD = pearson(T, D);
    const tMin = Math.floor(Math.min(...T)), tMax = Math.ceil(Math.max(...T)), fMax = Math.ceil(Math.max(...F) / 10) * 10, dMax = Math.max(...D);
    const cS = slider(0, 26, 0.5, 20), wS = slider(2, 8, 0.5, 3), cO = h("b"), wO = h("b");
    const only = h("input", { type: "checkbox" });
    root.append(w2Ctl(labelWrap("hőmérséklet-sáv közepe:", cS, cO), labelWrap("szélessége:", wS, wO), labelWrap("", only, "csak a sáv")));
    const cvM = w2Canvas(root, 0.55, 290);
    const grid = h("div", { class: "two-col", style: "margin-top:.4rem" }), c1 = h("div"), c2 = h("div");
    grid.append(c1, c2); root.append(grid);
    const cvF = makeCanvas(c1, 0.7, 420), cvD = makeCanvas(c2, 0.7, 420);
    const stats = h("div", { class: "stat-row" }), out = h("div", { class: "readout" });
    root.append(stats, out,
      h("p", { style: "margin:.6rem 0 0;font-size:.95rem" }, h("b", null, "Tanulság: "),
        "Azonos hőmérséklet mellett a fagyi nem jelzi előre a fulladást – a kapcsolatot a közös ok (a meleg) okozza."));

    const band = () => { const c = +cS.value, hw = +wS.value / 2; return { lo: c - hw, hi: c + hw }; };
    const inBand = () => { const { lo, hi } = band(); return T.map((t, i) => (t >= lo && t <= hi ? i : -1)).filter(i => i >= 0); };
    const colT = t => w2Mix(css("--setA"), css("--setB"), Math.max(0, Math.min(1, (t - 2) / 22)));

    function scatter(cv, xs, ys, { xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel, bandX }) {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const bx = { x0: 32, y0: 20, x1: w - 10, y1: H - 36 };
      const { lo, hi } = band();
      const { tx, ty } = axes(ctx, bx, { xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel });
      if (bandX) { ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.13; ctx.fillRect(tx(Math.max(lo, xmin)), bx.y0, tx(Math.min(hi, xmax)) - tx(Math.max(lo, xmin)), bx.y1 - bx.y0); ctx.globalAlpha = 1; }
      const draw = inside => xs.forEach((x, i) => {
        const ib = T[i] >= lo && T[i] <= hi;
        if (ib !== inside || (!ib && only.checked)) return;
        ctx.globalAlpha = ib ? 0.9 : 0.14; ctx.fillStyle = colT(T[i]);
        ctx.beginPath(); ctx.arc(tx(x), ty(ys[i]), ib ? 3.2 : 2.6, 0, 2 * Math.PI); ctx.fill();
      });
      draw(false); draw(true); ctx.globalAlpha = 1;
      return { ctx, tx, ty, bx };
    }
    cvM.draw = () => {
      const DJ = D.map((d, i) => d + J[i]);
      const { ctx, tx, ty, bx } = scatter(cvM, F, DJ, { xmin: 0, xmax: fMax, ymin: -0.6, ymax: dMax + 0.6, xticks: rangeTicks(0, fMax, 8), yticks: rangeTicks(0, dMax, 6),
        xlabel: "F: fagylalteladás (ezer gombóc)", ylabel: "D: vízi balesetek száma (hetente)" });
      /* illesztett egyenesek: összes pont (szaggatott) és a sáv pontjai */
      const line = (fit, col, dash) => {
        if (!fit) return;
        ctx.save(); if (dash) ctx.setLineDash([6, 5]); ctx.strokeStyle = col; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tx(0), ty(fit.a)); ctx.lineTo(tx(fMax), ty(fit.a + fit.b * fMax)); ctx.stroke(); ctx.restore();
      };
      ctx.save(); ctx.beginPath(); ctx.rect(bx.x0, bx.y0, bx.x1 - bx.x0, bx.y1 - bx.y0); ctx.clip();
      line(w2Fit(F, D), css("--muted"), true);
      const I = inBand();
      if (I.length >= 3) { /* a sáv egyenese csak a sáv pontjainak F-tartományában */
        const fx = I.map(i => F[i]), fit = w2Fit(fx, I.map(i => D[i]));
        if (fit) {
          const a = Math.min(...fx), b = Math.max(...fx);
          ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(tx(a), ty(fit.a + fit.b * a)); ctx.lineTo(tx(b), ty(fit.a + fit.b * b)); ctx.stroke();
        }
      }
      ctx.restore();
      /* színskála */
      const gx = bx.x1 - 150, gy = bx.y0 + 4;
      for (let k = 0; k <= 60; k++) { ctx.fillStyle = colT(2 + 22 * k / 60); ctx.fillRect(gx + 30 + k, gy, 1.2, 8); }
      ctx.font = "10px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.fillStyle = css("--muted");
      ctx.textAlign = "right"; ctx.fillText("hideg", gx + 27, gy + 4); ctx.textAlign = "left"; ctx.fillText("meleg", gx + 94, gy + 4);
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx + 30, gy + 20); ctx.lineTo(gx + 50, gy + 20); ctx.stroke(); ctx.restore();
      ctx.fillText("összes pont", gx + 55, gy + 20);
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx + 30, gy + 34); ctx.lineTo(gx + 50, gy + 34); ctx.stroke();
      ctx.fillStyle = css("--muted"); ctx.fillText("csak a sáv", gx + 55, gy + 34);
    };
    cvF.draw = () => {
      const { ctx, bx } = scatter(cvF, T, F, { xmin: tMin, xmax: tMax, ymin: 0, ymax: fMax, xticks: rangeTicks(tMin, tMax, 6), yticks: rangeTicks(0, fMax, 4),
        xlabel: "T (°C)", ylabel: "F", bandX: true });
      ctx.fillStyle = css("--text"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(`T–F: r = ${fmt(rTF, 2)}`, bx.x1 - 2, 2);
    };
    cvD.draw = () => {
      const { ctx, bx } = scatter(cvD, T, D.map((d, i) => d + J[i]), { xmin: tMin, xmax: tMax, ymin: -0.6, ymax: dMax + 0.6, xticks: rangeTicks(tMin, tMax, 6), yticks: rangeTicks(0, dMax, 4),
        xlabel: "T (°C)", ylabel: "D", bandX: true });
      ctx.fillStyle = css("--text"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(`T–D: r = ${fmt(rTD, 2)}`, bx.x1 - 2, 2);
    };
    function upd() {
      const { lo, hi } = band();
      cO.textContent = fmt(+cS.value, 1) + " °C"; wO.textContent = fmt(+wS.value, 1) + " °C";
      cvM.draw(); cvF.draw(); cvD.draw();
      const I = inBand(), rb = I.length >= 3 ? pearson(I.map(i => F[i]), I.map(i => D[i])) : NaN;
      stats.replaceChildren(stat("$r(F, D)$ – összes pont", fmt(rFD, 2)), stat("$r(T, F)$", fmt(rTF, 2)), stat("$r(T, D)$", fmt(rTD, 2)),
        stat("$r(F, D)$ – a sávban", fmt(rb, 2)), stat("pontok a sávban", String(I.length)));
      const why = I.length < 3 ? "túl kevés pont" : !isFinite(rb) ? "a sávban D mindig ugyanannyi (hidegben 0) – r nem értelmezhető" : "";
      out.innerHTML = `Sáv: ${fmt(lo, 1)} … ${fmt(hi, 1)} °C, <b>${I.length}</b> hét. ` +
        `Összes ponton r(F, D) = <b>${fmt(rFD, 2)}</b>, a sávon belül r(F, D) = <b>${fmt(rb, 2)}</b>` + (why ? ` (${why})` : "") + ".";
      window.Synopsis && Synopsis.renderMath(stats);
    }
    [cS, wS].forEach(s => s.addEventListener("input", upd));
    only.addEventListener("change", upd);
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
