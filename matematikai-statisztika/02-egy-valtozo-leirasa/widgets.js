/* =========================================================
   Matematikai statisztika 2. fejezet – interaktív szemléltetések
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
     További segédfüggvények (2. fejezet)
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
  const WAGE = [300, 320, 340, 350, 360, 380, 390, 400, 410, 420, 430, 450, 470, 500, 520, 560, 650, 800, 1200, 2750];

  /* ------------------------------------------------------------------
     2.1  Hisztogram – osztályköz-szélesség és kezdőpont
     ------------------------------------------------------------------ */
  W["histogram-bins"] = root => {
    header(root, "Hisztogram: mennyit számít az osztályköz?",
      "Válassz adatsort, majd változtasd az osztályközök <b>szélességét</b> és a <b>kezdőpontot</b>. Figyeld, mikor tűnik el vagy jelenik meg egy csúcs, " +
      "és hasonlítsd össze az osztályközök számát a hüvelykujjszabályokkal.");
    const r = mulberry32(20261008);
    const wait = Array.from({ length: 200 }, () => +(2 + (-Math.log(1 - r())) * 9).toFixed(1));
    const height = Array.from({ length: 200 }, (_, i) => +(i < 100 ? 165 + 6 * normal(r) : 179 + 7 * normal(r)).toFixed(0));
    const SETS = {
      ing: { name: "ingázási idő, 20 hallgató (perc)", data: ING, w: 10 },
      wait: { name: "várakozási idő egy ügyfélszolgálaton, 200 hívás (perc)", data: wait, w: 5 },
      height: { name: "testmagasság, 200 egyetemista (cm)", data: height, w: 4 }
    };
    const sel = h("select", null, ...Object.entries(SETS).map(([k, s]) => h("option", { value: k }, s.name)));
    const wS = slider(1, 20, 0.5, 10), oS = slider(0, 1, 0.05, 0);
    const wOut = h("b"), oOut = h("b");
    root.append(h("div", { class: "controls" }, labelWrap("adatsor:", sel)),
      h("div", { class: "controls" }, labelWrap("szélesség:", wS, wOut), labelWrap("kezdőpont eltolása:", oS, oOut)));
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    let cur = SETS.ing;
    function setup() {
      cur = SETS[sel.value];
      const d = cur.data, R = Math.max(...d) - Math.min(...d);
      const st = R > 60 ? 1 : 0.5; wS.step = st; wS.min = Math.max(st, Math.round(R / 40 / st) * st); wS.max = Math.round(R / 2 / st) * st; wS.value = cur.w;
      oS.value = 0; draw();
    }
    function bins() {
      const d = cur.data, w = +wS.value, mn = Math.min(...d), mx = Math.max(...d);
      const start = Math.floor(mn / w) * w - (+oS.value) * w;
      const b = [];
      for (let a = start; a <= mx; a += w) b.push({ a, f: 0 });
      d.forEach(x => { const i = Math.floor((x - start) / w + 1e-9); if (b[i]) b[i].f++; });
      while (b.length && b[0].f === 0) b.shift();
      while (b.length && b[b.length - 1].f === 0) b.pop();
      return { b, w };
    }
    cv.draw = () => {
      const { ctx, w: W0, h: H } = cv; ctx.clearRect(0, 0, W0, H);
      const { b, w } = bins();
      const xmin = b[0].a, xmax = b[b.length - 1].a + w, fmax = Math.max(...b.map(t => t.f));
      const box = { x0: 44, y0: 14, x1: W0 - 12, y1: H - 34 };
      const { tx, ty } = axes(ctx, box, { xmin, xmax, ymin: 0, ymax: fmax * 1.1, xticks: rangeTicks(xmin, xmax, 8), yticks: rangeTicks(0, fmax * 1.1, 5), xlabel: "érték", ylabel: "gyakoriság", xfmt: v => String(v).replace(".", ",") });
      b.forEach(t => {
        ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.75;
        ctx.fillRect(tx(t.a), ty(t.f), tx(t.a + w) - tx(t.a), ty(0) - ty(t.f));
        ctx.globalAlpha = 1; ctx.strokeStyle = css("--card"); ctx.lineWidth = 1.5;
        ctx.strokeRect(tx(t.a), ty(t.f), tx(t.a + w) - tx(t.a), ty(0) - ty(t.f));
      });
    };
    function draw() {
      wOut.textContent = fmt(+wS.value, +wS.value % 1 ? 1 : 0);
      oOut.textContent = Math.round(+oS.value * 100) + "%";
      cv.draw();
      const { b } = bins(), n = cur.data.length;
      let k2 = 1; while (2 ** k2 < n) k2++;
      out.innerHTML = `n = <b>${n}</b> · osztályközök száma most: <b>${b.length}</b> · javaslat: $2^k \\ge n$ → <b>${k2}</b>, Sturges $1 + \\log_2 n$ ≈ <b>${fmt(1 + Math.log2(n), 1)}</b>` +
        (cur === SETS.height ? "<br>Figyeld: keskeny osztályközökkel két csúcs látszik (nők és férfiak) – széles osztályközökkel összemosódnak!" :
          cur === SETS.wait ? "<br>Jobbra ferde eloszlás: a rövid várakozás a gyakori, a hosszú farok jobbra nyúlik." :
            "<br>Csak 20 adat: a kép erősen függ a beosztástól. Próbáld ki az 5 és a 15 perces szélességet!");
      window.Synopsis && Synopsis.renderMath(out);
    }
    sel.addEventListener("change", setup);
    wS.addEventListener("input", draw); oS.addEventListener("input", draw);
    setup();
  };

  /* ------------------------------------------------------------------
     2.3  Húzd el a pontokat! – átlag és medián
     ------------------------------------------------------------------ */
  W["mean-median-drag"] = root => {
    header(root, "Húzd el a milliárdost! – átlag kontra medián",
      "A pontok egy számegyenesen vannak; <b>húzd őket</b> egérrel vagy ujjal. A <span style='color:var(--accent)'>szaggatott vonal</span> az átlag, " +
      "a <span style='color:var(--ok)'>folytonos</span> a medián. Húzz egy pontot messze jobbra, vagy adj hozzá egy szélsőséges értéket!");
    const START = [22, 30, 35, 41, 47, 55, 60];
    let pts = START.slice();
    const stats = h("div", { class: "stat-row" });
    const cv = makeCanvas(root, 0.26);
    root.append(stats);
    root.append(h("div", { class: "controls" },
      btn("＋ szélsőséges érték (98)", () => { if (pts.length < 15) { pts.push(98); upd(); } }),
      btn("＋ véletlen pont", () => { if (pts.length < 15) { pts.push(Math.round(20 + Math.random() * 45)); upd(); } }),
      btn("− utolsó pont", () => { if (pts.length > 2) { pts.pop(); upd(); } }),
      btn("↺ alaphelyzet", () => { pts = START.slice(); upd(); })));
    const box = () => ({ x0: 20, y0: 10, x1: cv.w - 20, y1: cv.h - 30 });
    let tx = v => v;
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const bx = box();
      ({ tx } = axes(ctx, bx, { xmin: 0, xmax: 100, ymin: 0, ymax: 1, xticks: rangeTicks(0, 100, 10) }));
      const m = mean(pts), me = median(pts), yc = (bx.y0 + bx.y1) / 2;
      vline(ctx, tx(me), bx.y0, bx.y1, css("--ok"));
      vline(ctx, tx(m), bx.y0, bx.y1, css("--accent"), true);
      ctx.font = "12px system-ui"; ctx.textBaseline = "top";
      ctx.fillStyle = css("--ok"); ctx.textAlign = m < me ? "left" : "right"; ctx.fillText("Me", tx(me) + (m < me ? 4 : -4), bx.y0);
      ctx.fillStyle = css("--accent"); ctx.textAlign = m < me ? "right" : "left"; ctx.fillText("x̄", tx(m) + (m < me ? -4 : 4), bx.y0);
      const seen = {};
      pts.forEach((p, i) => {
        const key = Math.round(p); seen[key] = (seen[key] || 0) + 1;
        ctx.fillStyle = i === drag ? css("--bad") : css("--text");
        ctx.beginPath(); ctx.arc(tx(p), yc + 10 - (seen[key] - 1) * 12, 7, 0, 2 * Math.PI); ctx.fill();
      });
    };
    function upd() {
      cv.draw();
      const m = mean(pts), me = median(pts);
      const s = sorted(pts), k = Math.floor(pts.length * 0.1), tr = mean(s.slice(k, s.length - k));
      stats.replaceChildren(stat("adatok száma", String(pts.length)), stat("átlag (x̄)", fmt(m, 1)), stat("medián (Me)", fmt(me, 1)),
        stat("10%-os vágott átlag", fmt(tr, 1)), stat("x̄ − Me", fmt(m - me, 1)));
    }
    let drag = -1;
    const xOf = e => { const r = cv.c.getBoundingClientRect(); return e.clientX - r.left; };
    cv.c.style.touchAction = "none"; cv.c.style.cursor = "grab";
    cv.c.addEventListener("pointerdown", e => {
      const x = xOf(e); let best = -1, bd = 14;
      pts.forEach((p, i) => { const d = Math.abs(tx(p) - x); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { drag = best; cv.c.setPointerCapture(e.pointerId); cv.c.style.cursor = "grabbing"; cv.draw(); }
    });
    cv.c.addEventListener("pointermove", e => {
      if (drag < 0) return;
      const bx = box(), v = (xOf(e) - bx.x0) / (bx.x1 - bx.x0) * 100;
      pts[drag] = Math.max(0, Math.min(100, Math.round(v))); upd();
    });
    const end = () => { drag = -1; cv.c.style.cursor = "grab"; cv.draw(); };
    cv.c.addEventListener("pointerup", end); cv.c.addEventListener("pointercancel", end);
    upd();
  };

  /* ------------------------------------------------------------------
     2.5  Boxplot-építő
     ------------------------------------------------------------------ */
  W["boxplot-builder"] = root => {
    header(root, "Boxplot-építő",
      "Írj be számokat (szóközzel vagy pontosvesszővel elválasztva, tizedesvesszővel), vagy válassz egy kész adatsort. A widget kiszámolja az ötszámos összefoglalót " +
      "(kvartilisek az $(n+1)p$ módszerrel), a kerítést és a kiugró értékeket, és lerajzolja a pontokat és a boxplotot.");
    const inp = h("input", { type: "text", style: "width:100%;max-width:640px" });
    const PRE = {
      "11 adat (2.5-a)": [2, 3, 5, 6, 7, 8, 9, 11, 12, 14, 30],
      "ingázási idő": ING,
      "bérek (2.10)": WAGE,
      "szimmetrikus": [3, 5, 6, 7, 7, 8, 8, 8, 9, 9, 10, 11, 13]
    };
    const fmtList = a => a.map(v => String(v).replace(".", ",")).join("; ");
    root.append(h("div", { class: "controls" }, inp),
      h("div", { class: "controls" }, ...Object.entries(PRE).map(([k, a]) => btn(k, () => { inp.value = fmtList(a); upd(); }))));
    const cv = makeCanvas(root, 0.3);
    const out = h("div", { class: "readout" });
    root.append(out);
    let data = [];
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      if (data.length < 3) return;
      const mn = Math.min(...data), mx = Math.max(...data), pad = (mx - mn) * 0.05 || 1;
      const bx = { x0: 20, y0: 8, x1: w - 20, y1: H - 30 };
      const { tx } = axes(ctx, bx, { xmin: mn - pad, xmax: mx + pad, ymin: 0, ymax: 1, xticks: rangeTicks(mn - pad, mx + pad, 8), xfmt: v => String(v).replace(".", ",") });
      const q1 = quant(data, 0.25), me = quant(data, 0.5), q3 = quant(data, 0.75), iqr = q3 - q1;
      const lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
      const inside = data.filter(v => v >= lo && v <= hi), wl = Math.min(...inside), wh = Math.max(...inside);
      const yDots = bx.y0 + (bx.y1 - bx.y0) * 0.3, yBox = bx.y0 + (bx.y1 - bx.y0) * 0.72, bh = (bx.y1 - bx.y0) * 0.3;
      const seen = {};
      sorted(data).forEach(v => {
        const k = Math.round(tx(v) / 6); seen[k] = (seen[k] || 0) + 1;
        ctx.fillStyle = v < lo || v > hi ? css("--bad") : css("--accent");
        ctx.beginPath(); ctx.arc(tx(v), yDots + 8 - (seen[k] - 1) * 7, 3.5, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.5;
      ctx.fillStyle = css("--accent-soft");
      ctx.fillRect(tx(q1), yBox - bh / 2, tx(q3) - tx(q1), bh); ctx.strokeRect(tx(q1), yBox - bh / 2, tx(q3) - tx(q1), bh);
      ctx.beginPath();
      ctx.moveTo(tx(wl), yBox); ctx.lineTo(tx(q1), yBox); ctx.moveTo(tx(q3), yBox); ctx.lineTo(tx(wh), yBox);
      ctx.moveTo(tx(wl), yBox - bh / 4); ctx.lineTo(tx(wl), yBox + bh / 4); ctx.moveTo(tx(wh), yBox - bh / 4); ctx.lineTo(tx(wh), yBox + bh / 4);
      ctx.stroke();
      vline(ctx, tx(me), yBox - bh / 2, yBox + bh / 2, css("--ok"));
      data.filter(v => v < lo || v > hi).forEach(v => { ctx.strokeStyle = css("--bad"); ctx.beginPath(); ctx.arc(tx(v), yBox, 4.5, 0, 2 * Math.PI); ctx.stroke(); });
      [[lo, "alsó kerítés"], [hi, "felső kerítés"]].forEach(([v, l]) => {
        if (v < mn - pad || v > mx + pad) return;
        ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(tx(v), bx.y0); ctx.lineTo(tx(v), bx.y1); ctx.stroke(); ctx.restore();
        ctx.fillStyle = css("--bad"); ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(l, tx(v), bx.y0);
      });
    };
    function upd() {
      data = inp.value.replace(/,\s+/g, " ").split(/[;\s]+/).map(t => parseFloat(t.replace(",", "."))).filter(v => isFinite(v));
      if (data.length < 3) { out.textContent = "Legalább 3 számot adj meg!"; cv.draw(); return; }
      if (data.length > 400) data = data.slice(0, 400);
      cv.draw();
      const q1 = quant(data, 0.25), me = quant(data, 0.5), q3 = quant(data, 0.75), iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
      const outl = sorted(data).filter(v => v < lo || v > hi);
      const d = v => fmt(v, Number.isInteger(v) ? 0 : 2);
      out.innerHTML = `n = <b>${data.length}</b> · min = <b>${d(Math.min(...data))}</b> · Q₁ = <b>${d(q1)}</b> · Me = <b>${d(me)}</b> · Q₃ = <b>${d(q3)}</b> · max = <b>${d(Math.max(...data))}</b><br>` +
        `IQR = <b>${d(iqr)}</b> · kerítés: [${d(lo)}; ${d(hi)}] · kiugró értékek: <b>${outl.length ? outl.map(d).join("; ") : "nincs"}</b> · átlag = ${d(mean(data))}`;
    }
    inp.addEventListener("input", upd);
    inp.value = fmtList(PRE["11 adat (2.5-a)"]); upd();
  };

  /* ------------------------------------------------------------------
     2.6  Szórásbecslő játék
     ------------------------------------------------------------------ */
  W["sd-guess"] = root => {
    header(root, "Becsüld meg a szórást!",
      "30 adat egy számegyenesen. Állítsd a csúszkát arra, amennyinek a szórást gondolod (a sáv: átlag ± tipp), majd nézd meg a valódit. " +
      "Segítség: egy harang alakú adatsorban az adatok kb. kétharmada esik az átlag ± 1 szórás sávba.");
    const g = slider(1, 30, 0.5, 10), gOut = h("b");
    const cv = makeCanvas(root, 0.24);
    const out = h("div", { class: "readout" });
    let data = [], shown = false, rounds = 0, tot = 0;
    const reveal = btn("Mutasd a valódit!", () => {
      if (shown) return; shown = true; rounds++;
      const s = psd(data), err = Math.abs(+g.value - s) / s; tot += err;
      out.innerHTML = `Valódi szórás: <b>${fmt(s, 1)}</b> · tipped: ${fmt(+g.value, 1)} · eltérés: <b>${Math.round(err * 100)}%</b>` +
        `<br>Eddig ${rounds} kör, átlagos eltérés: <b>${Math.round(tot / rounds * 100)}%</b>` +
        `<br>Az átlag ± 1 szórás sávba esik ${data.filter(v => Math.abs(v - mean(data)) <= s).length} adat a 30-ból.`;
      cv.draw();
    }, "btn primary");
    root.append(h("div", { class: "controls" }, labelWrap("tipp a szórásra:", g, gOut), reveal, btn("Új adatsor", fresh)));
    root.append(out);
    function fresh() {
      const r = Math.random, mu = 30 + r() * 40, s = 3 + r() * 17;
      const skew = r() < 0.3;
      data = Array.from({ length: 30 }, () => {
        const v = skew ? mu - s + s * (-Math.log(1 - r())) : mu + s * normal(r);
        return Math.max(0, Math.min(100, Math.round(v)));
      });
      shown = false; out.innerHTML = "Állítsd be a tippedet, aztán kattints a „Mutasd a valódit!” gombra."; cv.draw();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      if (!data.length) return;
      gOut.textContent = fmt(+g.value, 1);
      const bx = { x0: 20, y0: 8, x1: w - 20, y1: H - 28 };
      const { tx } = axes(ctx, bx, { xmin: 0, xmax: 100, ymin: 0, ymax: 1, xticks: rangeTicks(0, 100, 10) });
      const m = mean(data), yc = bx.y1 - 14;
      const band = (s, col, y0, y1) => { ctx.fillStyle = col; ctx.globalAlpha = 0.18; ctx.fillRect(tx(m - s), y0, tx(m + s) - tx(m - s), y1 - y0); ctx.globalAlpha = 1; };
      band(+g.value, css("--accent"), bx.y0, bx.y1);
      if (shown) { const s = psd(data); band(s, css("--ok"), bx.y0 + 6, bx.y1 - 6); vline(ctx, tx(m - s), bx.y0, bx.y1, css("--ok")); vline(ctx, tx(m + s), bx.y0, bx.y1, css("--ok")); }
      vline(ctx, tx(m), bx.y0, bx.y1, css("--muted"), true);
      const seen = {};
      sorted(data).forEach(v => { seen[v] = (seen[v] || 0) + 1; ctx.fillStyle = css("--text"); ctx.beginPath(); ctx.arc(tx(v), yc - (seen[v] - 1) * 8, 3.5, 0, 2 * Math.PI); ctx.fill(); });
    };
    g.addEventListener("input", () => cv.draw());
    fresh();
  };

  /* ------------------------------------------------------------------
     2.7  z-értékek összehasonlítása
     ------------------------------------------------------------------ */
  W["zscore-compare"] = root => {
    header(root, "Ki a kiemelkedőbb? – z-értékek",
      "Két dolgozat, két évfolyam. Állítsd be az átlagot, a szórást és a diák pontszámát mindkettőnél. A görbe egy harang alakú (normális) eloszlást mutat; " +
      "a satírozott rész az évfolyam azon hányada, amely gyengébben teljesített – ez csak normális eloszlásnál pontos!");
    const mk = (name, mu, s, x) => {
      const m = slider(30, 90, 1, mu), d = slider(2, 20, 0.5, s), v = slider(0, 100, 1, x);
      const mo = h("b"), dout = h("b"), vo = h("b");
      const row = h("div", { class: "controls" }, h("b", null, name), labelWrap("átlag:", m, mo), labelWrap("szórás:", d, dout), labelWrap("pontszám:", v, vo));
      return { m, d, v, mo, dout, vo, row, name };
    };
    const A = mk("Matek –", 70, 10, 85), B = mk("Töri –", 60, 5, 70);
    root.append(A.row, B.row);
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const panel = (T, y0, y1, col) => {
        const mu = +T.m.value, s = +T.d.value, x = +T.v.value;
        const bx = { x0: 30, y0, x1: w - 12, y1 };
        const pdf = t => Math.exp(-0.5 * ((t - mu) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
        const ymax = pdf(mu) * 1.15;
        const { tx, ty } = axes(ctx, bx, { xmin: 0, xmax: 100, ymin: 0, ymax, xticks: rangeTicks(0, 100, 10) });
        ctx.fillStyle = col; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(tx(0), ty(0));
        for (let t = 0; t <= Math.min(100, x); t += 0.25) ctx.lineTo(tx(t), ty(pdf(t)));
        ctx.lineTo(tx(Math.min(100, x)), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
        for (let t = 0; t <= 100; t += 0.25) { const X = tx(t), Y = ty(pdf(t)); t ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
        vline(ctx, tx(mu), y0, y1, css("--muted"), true);
        vline(ctx, tx(x), y0, y1, css("--bad"));
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(T.name.replace(" –", "") + `: z = ${fmt((x - mu) / s, 2)}`, bx.x0 + 6, y0 + 2);
      };
      const mid = H / 2;
      panel(A, 10, mid - 26, css("--setA"));
      panel(B, mid + 8, H - 26, css("--setB"));
    };
    function upd() {
      [A, B].forEach(T => { T.mo.textContent = T.m.value; T.dout.textContent = fmt(+T.d.value, 1); T.vo.textContent = T.v.value; });
      cv.draw();
      const za = (+A.v.value - +A.m.value) / +A.d.value, zb = (+B.v.value - +B.m.value) / +B.d.value;
      const win = Math.abs(za - zb) < 0.005 ? "egyformán kiemelkedőek" : za > zb ? "a <b>matek</b>-eredmény a kiemelkedőbb" : "a <b>töri</b>-eredmény a kiemelkedőbb";
      out.innerHTML = `Matek: z = <b>${fmt(za, 2)}</b> (normálisnál kb. ${Math.round(Phi(za) * 100)}% gyengébb) · ` +
        `Töri: z = <b>${fmt(zb, 2)}</b> (kb. ${Math.round(Phi(zb) * 100)}% gyengébb)<br>→ A saját évfolyamán belül ${win}.`;
    }
    [A, B].forEach(T => [T.m, T.d, T.v].forEach(s => s.addEventListener("input", upd)));
    upd();
  };

  /* ------------------------------------------------------------------
     2.9  Variancia-felbontás három csoportra
     ------------------------------------------------------------------ */
  W["variance-decomp"] = root => {
    header(root, "Teljes = belső + külső variancia",
      "Három csoport, csoportonként 8 adat. Az egyik csúszka a <b>csoportátlagok távolságát</b>, a másik a <b>csoporton belüli szóródást</b> állítja. " +
      "Figyeld, hogyan oszlik meg a teljes variancia a két rész között, és mikor magyaráz sokat a csoportosítás!");
    const OFF = [-1.6, -1, -0.6, -0.2, 0.2, 0.6, 1, 1.6];
    const k0 = Math.sqrt(OFF.reduce((s, x) => s + x * x, 0) / OFF.length);
    const sep = slider(0, 25, 0.5, 12), wit = slider(0, 12, 0.5, 5);
    const sOut = h("b"), wOut = h("b");
    root.append(h("div", { class: "controls" }, labelWrap("csoportátlagok távolsága:", sep, sOut), labelWrap("csoporton belüli szórás:", wit, wOut)));
    const cv = makeCanvas(root, 0.4);
    const out = h("div", { class: "readout" });
    root.append(out);
    const COLS = ["--setA", "--setB", "--setC"];
    const groups = () => [-1, 0, 1].map(g => OFF.map(o => 50 + g * +sep.value + o / k0 * +wit.value));
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const G = groups(), all = G.flat(), M = mean(all), n = all.length;
      const bx = { x0: 70, y0: 8, x1: w - 14, y1: H * 0.62 };
      const { tx } = axes(ctx, bx, { xmin: 0, xmax: 100, ymin: 0, ymax: 1, xticks: rangeTicks(0, 100, 10) });
      vline(ctx, tx(M), bx.y0, bx.y1, css("--muted"), true);
      G.forEach((g, j) => {
        const y = bx.y0 + (j + 0.6) * (bx.y1 - bx.y0) / 3.3;
        ctx.fillStyle = css(COLS[j]); ctx.font = "12px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(`${j + 1}. csoport`, bx.x0 - 6, y);
        g.forEach(v => { ctx.beginPath(); ctx.arc(tx(v), y, 4.5, 0, 2 * Math.PI); ctx.fill(); });
        const mj = mean(g); ctx.strokeStyle = css(COLS[j]); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(tx(mj), y - 11); ctx.lineTo(tx(mj), y + 11); ctx.stroke();
      });
      const Wv = G.reduce((s, g) => s + g.length * psd(g) ** 2, 0) / n;
      const Bv = G.reduce((s, g) => s + g.length * (mean(g) - M) ** 2, 0) / n;
      const T = Wv + Bv, by = H * 0.75, bh = H * 0.13, L = bx.x0, Rr = w - 14;
      if (T > 1e-9) {
        const xm = L + (Rr - L) * Wv / T;
        ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.35; ctx.fillRect(L, by, xm - L, bh);
        ctx.fillStyle = css("--bad"); ctx.globalAlpha = 0.35; ctx.fillRect(xm, by, Rr - xm, bh); ctx.globalAlpha = 1;
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (xm - L > 60) ctx.fillText("belső " + Math.round(Wv / T * 100) + "%", (L + xm) / 2, by + bh / 2);
        if (Rr - xm > 60) ctx.fillText("külső " + Math.round(Bv / T * 100) + "%", (xm + Rr) / 2, by + bh / 2);
      }
      ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.font = "12px system-ui"; ctx.fillText("teljes:", L - 6, by + bh / 2);
    };
    function upd() {
      sOut.textContent = fmt(+sep.value, 1); wOut.textContent = fmt(+wit.value, 1);
      cv.draw();
      const G = groups(), all = G.flat(), M = mean(all), n = all.length;
      const Wv = G.reduce((s, g) => s + g.length * psd(g) ** 2, 0) / n, Bv = G.reduce((s, g) => s + g.length * (mean(g) - M) ** 2, 0) / n;
      const Tv = psd(all) ** 2;
      out.innerHTML = `teljes variancia: <b>${fmt(Tv, 1)}</b> = belső <b>${fmt(Wv, 1)}</b> + külső <b>${fmt(Bv, 1)}</b>` +
        ` · a csoportosítás által „magyarázott” rész: $H^2$ = <b>${Tv > 1e-9 ? fmt(Bv / Tv, 2) : "–"}</b>`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    sep.addEventListener("input", upd); wit.addEventListener("input", upd);
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
