/* =========================================================
   Analízis 2. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz és a képletek értelmezéséhez az assets/calc.js-t használja.
   ========================================================= */
(function () {
  "use strict";
  const C = window.Calc;
  const fmt = C.fmt;
  const css = C.css;
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const texNum = (x, d = 3) => fmt(x, d).replace(",", "{,}").replace(/ /g, "\\,").replace("−", "-");

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
  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* csúszka: label, min, max, step, kezdő, onInput, [formázó] */
  function slider(label, min, max, step, value, onInput, show) {
    const r = h("input", { type: "range", min, max, step, value });
    const v = h("b", null, "");
    const wrap = h("label", null, label + " ", r, " ", v);
    const upd = () => { v.textContent = show ? show(+r.value) : fmt(+r.value, 3); };
    r.addEventListener("input", () => { upd(); onInput(); });
    upd();
    return { wrap, get value() { return +r.value; }, set value(x) { r.value = x; upd(); }, el: r };
  }
  /* gombsor, amelyből egy aktív: items = [[címke, érték], …] */
  function segmented(items, value, onChange) {
    const wrap = h("div", { class: "controls", style: "gap:.3rem" });
    let cur = value;
    const bs = items.map(([label, val]) => {
      const b = btn(label, () => { cur = val; bs.forEach(x => x.classList.toggle("on", x === b)); onChange(val); });
      if (val === value) b.classList.add("on");
      return b;
    });
    wrap.append(...bs);
    return { wrap, get value() { return cur; } };
  }
  const legend = items => h("div", { class: "controls", style: "font-size:.88rem" },
    ...items.map(([label, col, dash]) => h("span", { class: "chip", style: `border-color:${css(col) || col}` },
      h("span", { style: `display:inline-block;width:18px;border-top:3px ${dash ? "dashed" : "solid"} ${css(col) || col}` }), label)));
  const PAL = ["--accent", "--setB", "--setC", "--bad", "--setA"];
  const col = c => (c && c.startsWith("--") ? css(c) : c);

  /* téglalapok kitöltése egy C.plot által visszaadott transzformációval:
     rects = [{x0, x1, y0, y1, color, alpha}] */
  function fillRects(cv, T, rects) {
    const ctx = cv.ctx;
    ctx.save();
    rects.forEach(r => {
      ctx.globalAlpha = r.alpha == null ? 0.35 : r.alpha;
      ctx.fillStyle = col(r.color || "--accent");
      const x = T.tx(r.x0), y = T.ty(Math.max(r.y0, r.y1)), w = T.tx(r.x1) - T.tx(r.x0), hh = Math.abs(T.ty(r.y0) - T.ty(r.y1));
      ctx.fillRect(x, y, w, hh);
    });
    ctx.restore();
  }
  /* sáv két vízszintes egyenes között */
  function fillBand(cv, T, y0, y1, color, alpha = 0.18) {
    const ctx = cv.ctx;
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col(color);
    ctx.fillRect(0, T.ty(y1), cv.w, T.ty(y0) - T.ty(y1));
    ctx.restore();
  }
  /* képlet beolvasása n (és opcionálisan a) változóval */
  function compile(src, vars = ["n"]) {
    try { return { f: C.parse(src, vars).f, err: null }; }
    catch (e) { return { f: null, err: e.message }; }
  }
  /* statisztika-sor: [[címke, érték-HTML], …] */
  function statRow(el, items) {
    el.innerHTML = "";
    el.className = "stat-row";
    items.forEach(([l, v]) => el.append(h("div", { class: "stat" }, h("div", { class: "l", html: l }), h("div", { class: "v", html: v }))));
    window.Synopsis && Synopsis.renderMath(el);
    return el;
  }
  /* „szép” y-tartomány pontokhoz */
  function yRange(vals, padFrac = 0.08) {
    const v = vals.filter(Number.isFinite);
    if (!v.length) return [-1, 1];
    let lo = Math.min(...v), hi = Math.max(...v);
    if (lo === hi) { lo -= 1; hi += 1; }
    const p = (hi - lo) * padFrac;
    return [Math.min(lo - p, 0 < lo && lo < (hi - lo) * 0.6 ? -p : lo - p), hi + p];
  }

  const W = {};
  /* ==================================================================
     w2.js – growth-race, series-sum, annuity-calc
     ================================================================== */
  const w2SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  const w2sup = k => String(k).split("").map(c => w2SUP[c] || c).join("");
  /* 10-es alapú logaritmusból mantissza és kitevő: x = m · 10^e, 1 ≤ m < 10 */
  function w2me(L, d = 2) {
    let e = Math.floor(L), m = +Math.pow(10, L - e).toFixed(d);
    if (m >= 10) { m = +(m / 10).toFixed(d); e += 1; }
    return [m, e];
  }
  /* szám TeX-ben, nagy/kicsi értéknél normálalakban; log10|x| megadható (túlcsordulás nélkül) */
  function w2tex(x, d = 3, L) {
    if (L == null) {
      if (!Number.isFinite(x)) return "\\infty";
      if (x === 0) return "0";
      L = Math.log10(Math.abs(x));
    }
    const s = x < 0 ? "-" : "";
    if (L >= 7 || L < -4) { const [m, e] = w2me(L); return s + texNum(m, 2) + "\\cdot10^{" + e + "}"; }
    return texNum(x, d);
  }
  /* tengelyfelirat (canvas, unicode) */
  function w2lab(x, L) {
    if (x === 0) return "0";
    if (L == null) L = Math.log10(Math.abs(x));
    if (L >= 6 || L < -3) { const [m, e] = w2me(L, 1); return (x < 0 ? "−" : "") + (m === 1 ? "" : fmt(m, 1) + "·") + "10" + w2sup(e); }
    return fmt(x, 4);
  }
  function w2step(span, px, minStep = 0) {
    const target = span / Math.max(2, px / 60);
    const p = Math.pow(10, Math.floor(Math.log10(target)));
    for (const m of [1, 2, 5, 10]) if (m * p >= target) return Math.max(minStep, m * p);
    return Math.max(minStep, 10 * p);
  }
  /* saját tengelyfeliratok (a C.plot-ot labels:false-szal hívjuk) */
  function w2axes(cv, T, v, o) {
    const ctx = cv.ctx, w = cv.w, hh = cv.h;
    ctx.save();
    ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted");
    const ay = Math.min(Math.max(0, v.ymin), v.ymax), ax = Math.min(Math.max(0, v.xmin), v.xmax);
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    const xl = o.xl || (x => fmt(x, 4));
    for (let x = Math.ceil(v.xmin / v.xstep) * v.xstep; x <= v.xmax + 1e-9; x += v.xstep) {
      if (Math.abs(x) < v.xstep / 2 || T.tx(x) > w - 16 || T.tx(x) < 10) continue;
      ctx.fillText(xl(x), T.tx(x), Math.min(hh - 14, T.ty(ay) + 3));
    }
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    const yl = o.yl || w2lab;
    for (let y = Math.ceil(v.ymin / v.ystep) * v.ystep; y <= v.ymax + 1e-9; y += v.ystep) {
      if ((!o.zeroY && Math.abs(y) < v.ystep / 2) || T.ty(y) < 12 || T.ty(y) > hh - 10) continue;
      const s = yl(Math.abs(y) < v.ystep * 1e-6 ? 0 : y), tw = ctx.measureText(s).width;
      ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card");
      ctx.fillRect(T.tx(ax) + 3, T.ty(y) - 7, tw + 4, 14);
      ctx.globalAlpha = 1; ctx.fillStyle = css("--muted");
      ctx.fillText(s, T.tx(ax) + 5, T.ty(y));
    }
    ctx.textBaseline = "bottom";
    if (o.xname) { ctx.textAlign = "right"; ctx.fillText(o.xname, w - 4, T.ty(ay) - 3); }
    if (o.yname) { ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "600 11px system-ui, sans-serif"; ctx.fillText(o.yname, T.tx(ax) + 8, 2); }
    ctx.restore();
  }
  /* töröttvonal (pontok [x, y]; nem véges y-nál megszakad) */
  function w2poly(cv, T, pts, color, width = 1.2, dash = []) {
    const ctx = cv.ctx;
    ctx.save(); ctx.strokeStyle = col(color); ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    let pen = false;
    pts.forEach(([x, y]) => {
      if (!Number.isFinite(y)) { pen = false; return; }
      if (!pen) { ctx.moveTo(T.tx(x), T.ty(y)); pen = true; } else ctx.lineTo(T.tx(x), T.ty(y));
    });
    ctx.stroke(); ctx.restore();
  }
  const w2sample = (color, dash) => h("span", { style: `display:inline-block;width:18px;height:0;border-top:3px ${dash && dash.length ? "dashed" : "solid"} ${col(color)}` });

  /* ------------------------------------------------------------------
     2.5-c  Növekedési verseny
     ------------------------------------------------------------------ */
  W["growth-race"] = root => {
    header(root, "Növekedési verseny",
      "Kapcsold be a versenyzőket, és figyeld, ki mikor előz. Logaritmikus skálán az $10^k$ szintek egyenlő távolságra vannak, így a nagyon gyors sorozatok is elférnek.");
    const NMAX = 5000;
    const lf = new Float64Array(NMAX + 1);                       // log10 n!
    for (let k = 2; k <= NMAX; k++) lf[k] = lf[k - 1] + Math.log10(k);
    const lg = Math.log10;
    const R = [
      { id: "ln", tex: "\\ln n", u: "ln n", L: n => lg(Math.log(n)), c: "--setC", d: [2, 3] },
      { id: "sqrt", tex: "\\sqrt n", u: "√n", L: n => 0.5 * lg(n), c: "--setC", d: [] },
      { id: "n", tex: "n", u: "n", L: n => lg(n), c: "--setA", d: [2, 3] },
      { id: "n2", tex: "n^2", u: "n²", L: n => 2 * lg(n), c: "--setA", d: [] },
      { id: "n10", tex: "n^{10}", u: "n¹⁰", L: n => 10 * lg(n), c: "--setA", d: [7, 4] },
      { id: "q11", tex: "1{,}1^n", u: "1,1ⁿ", L: n => n * lg(1.1), c: "--setB", d: [7, 4] },
      { id: "e2", tex: "2^n", u: "2ⁿ", L: n => n * lg(2), c: "--setB", d: [] },
      { id: "fact", tex: "n!", u: "n!", L: n => lf[n], c: "--bad", d: [] },
      { id: "nn", tex: "n^n", u: "nⁿ", L: n => n * lg(n), c: "--accent", d: [] }
    ];
    const on = new Set(["n2", "e2", "fact"]);
    let logScale = true;

    const chips = h("div", { class: "controls", style: "gap:.35rem" });
    const chipBtns = R.map((r, i) => {
      const b = btn("", () => { on.has(r.id) ? on.delete(r.id) : on.add(r.id); draw(); });
      b.style.cssText = "display:inline-flex;align-items:center;gap:.35rem;padding:.25rem .6rem";
      b.append(w2sample(r.c, r.d), h("span", { html: `$${r.tex}$` }));
      b.setAttribute("aria-pressed", "false");
      b.dataset.id = r.id;
      return b;
    });
    chips.append(...chipBtns);
    const sN = slider("$N_{\\max}$ =", 5, 60, 1, 20, () => draw(), v => fmt(v, 0));
    sN.el.style.width = "min(260px, 55vw)";
    const scale = segmented([["log-skála", true], ["lineáris skála", false]], true, v => { logScale = v; draw(); });
    const longBtn = btn("Hosszú táv: $n^{10}$ kontra $1{,}1^n$", () => {
      on.clear(); on.add("n10"); on.add("q11"); selA.value = "n10"; selB.value = "q11";
      logScale = true; scale.wrap.children[0].click(); syncMax(); sN.value = 1000; draw();
    });
    const resetBtn = btn("Alaphelyzet", () => {
      on.clear(); ["n2", "e2", "fact"].forEach(x => on.add(x)); selA.value = "n10"; selB.value = "q11";
      scale.wrap.children[0].click(); syncMax(); sN.value = 20; draw();
    });
    root.append(chips, h("div", { class: "controls" }, sN.wrap, scale.wrap), h("div", { class: "controls" }, longBtn, resetBtn));
    const cv = C.canvas(root, 0.6);
    const mkSel = v => {
      const s = h("select", { "aria-label": "versenyző" }, ...R.map(r => h("option", { value: r.id }, r.u)));
      s.value = v;
      s.addEventListener("change", () => { on.add(s.value); syncMax(); draw(); });
      return s;
    };
    const selA = mkSel("n10"), selB = mkSel("q11");
    root.append(h("div", { class: "controls" }, h("label", null, "Párbaj:", selA, "kontra", selB)));
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6" });
    root.append(out, h("p", { class: "w-sub", style: "margin:.6rem 0 0",
      html: "A rangsor: $\\ln n \\ll n^k \\ll a^n \\ll n! \\ll n^n$ – hosszú távon mindig a feljebb álló nyer." }));

    function syncMax() {
      const big = on.has("n10") || on.has("q11");
      const mx = big ? 1000 : 60;
      sN.el.max = mx;
      if (sN.value > mx) sN.value = mx; else sN.value = sN.value;
    }
    /* előzés: utolsó n ≤ 5000, ahol a (rangsorban) lassabb még ≥ */
    function overtake(slow, fast) {
      let last = 0;
      for (let n = 1; n <= NMAX; n++) {
        const a = slow.L(n), b = fast.L(n);
        if (a >= b - 1e-9 * Math.max(1, Math.abs(b))) last = n;
      }
      return last;
    }
    function draw() {
      syncMax();
      const N = sN.value;
      chipBtns.forEach((b, i) => {
        const act = on.has(R[i].id);
        b.classList.toggle("on", act); b.style.opacity = act ? "1" : "0.55"; b.setAttribute("aria-pressed", act);
      });
      const act = R.filter(r => on.has(r.id));
      const series = act.map(r => {
        const pts = [];
        for (let n = 1; n <= N; n++) pts.push([n, r.L(n)]);
        return { r, pts };
      });
      const allL = series.flatMap(s => s.pts.map(p => p[1])).filter(Number.isFinite);
      const Lmax = allL.length ? Math.max(...allL) : 1, Lmin = allL.length ? Math.min(0, ...allL) : 0;
      const F = Math.floor(Math.max(Lmax, 0));                       // lineáris skála egysége: 10^F
      const yv = L => (logScale ? L : Math.pow(10, L - F));
      // nézet
      const xmax = N * 1.13 + 0.5;
      let view;
      if (logScale) {
        const span = Math.max(1, Lmax - Lmin);
        view = { xmin: -N * 0.02, xmax, ymin: Lmin - span * 0.06, ymax: Lmax + span * 0.08 };
        view.ystep = Math.max(1, Math.round(w2step(view.ymax - view.ymin, cv.h * 0.9)));
      } else {
        const top = Math.pow(10, Lmax - F);
        view = { xmin: -N * 0.02, xmax, ymin: -top * 0.05, ymax: top * 1.1 };
        view.ystep = w2step(view.ymax - view.ymin, cv.h * 0.9);
      }
      view.xstep = w2step(N, cv.w * 0.8, 1);
      view.labels = false;
      // párbaj
      const A = R.find(r => r.id === selA.value), B = R.find(r => r.id === selB.value);
      let ov = null, msg;
      if (A === B) msg = "Válassz két különböző versenyzőt a párbajhoz.";
      else {
        const [slow, fast] = R.indexOf(A) < R.indexOf(B) ? [A, B] : [B, A];
        const last = overtake(slow, fast);
        const LA = A.L(N), LB = B.L(N), d = LA - LB;
        const ratio = `$\\dfrac{${A.tex}}{${B.tex}}$ értéke az $n = ${N}$ helyen: $${d >= -2 && d < 6 ? texNum(Math.pow(10, d), 3) : (([m, e]) => texNum(m, 2) + "\\cdot10^{" + e + "}")(w2me(d))}$`;
        if (last >= NMAX) msg = `${ratio}.<br>$n = ${fmt(NMAX, 0).replace(/ /g, "\\,")}$-ig nem fordul meg a sorrend.`;
        else if (last === 0) msg = `${ratio}.<br>Itt nincs is előzés: minden $n \\ge 1$ esetén $${fast.tex} \\gt ${slow.tex}$.`;
        else {
          ov = last + 1;
          msg = `${ratio}.<br><b>Előzés:</b> minden $n \\ge ${ov}$ esetén $${fast.tex} \\gt ${slow.tex}$ ` +
            `<span class="muted">(az utolsó $n$, ahol még $${slow.tex} \\ge ${fast.tex}$: ${last})</span>.` +
            (ov > N ? ` <span class="muted">Ez kívül esik a jelenlegi tartományon${ov > 60 ? " – próbáld a „Hosszú táv” gombot" : " – növeld az $N_{\\max}$-ot"}!</span>` : "");
        }
      }
      out.innerHTML = msg;
      window.Synopsis && Synopsis.renderMath(out);

      cv.draw = () => {
        const T = C.plot(cv, view, ov && ov <= N ? [{ vline: ov, color: "--muted", dash: [4, 4], width: 1.2 }] : []);
        w2axes(cv, T, view, {
          xl: x => fmt(x, 0),
          yl: logScale ? (k => (k === 0 ? "1" : "10" + w2sup(Math.round(k)))) : (y => (F < 6 ? w2lab(y * Math.pow(10, F)) : w2lab(y, Math.log10(Math.abs(y)) + F))),
          xname: "n", yname: logScale ? "log-skála" : "lineáris skála", zeroY: logScale
        });
        const r = N <= 25 ? 3.4 : N <= 70 ? 2.4 : N <= 200 ? 1.6 : 0;
        series.forEach(({ r: s, pts }) => {
          const P = pts.map(([x, L]) => [x, yv(L)]);
          w2poly(cv, T, P, s.c, r ? 1.1 : 2, s.d);
        });
        // pontok külön (hogy a vonalak alatt ne vesszenek el)
        if (r) {
          const ctx = cv.ctx;
          series.forEach(({ r: s, pts }) => {
            ctx.save(); ctx.fillStyle = col(s.c);
            pts.forEach(([x, L]) => {
              const y = yv(L);
              if (!Number.isFinite(y) || y > view.ymax) return;
              ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), r, 0, 2 * Math.PI); ctx.fill();
            });
            ctx.restore();
          });
        }
        // feliratok a sorozatok végén (egymástól széthúzva)
        const ctx = cv.ctx;
        const labs = series.map(({ r: s, pts }) => ({ s, y: T.ty(Math.min(view.ymax, yv(pts[pts.length - 1][1]))) }))
          .filter(o => Number.isFinite(o.y)).sort((a, b) => a.y - b.y);
        for (let i = 1; i < labs.length; i++) if (labs[i].y - labs[i - 1].y < 13) labs[i].y = labs[i - 1].y + 13;
        const over = labs.length ? labs[labs.length - 1].y - Math.min(cv.h - 8, T.ty(Math.max(view.ymin, 0)) - 7) : 0;
        if (over > 0) labs.forEach(o => (o.y -= over));
        ctx.save(); ctx.font = "600 12px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
        labs.forEach(o => { ctx.fillStyle = col(o.s.c); ctx.fillText(o.s.u, T.tx(N) + 6, Math.max(8, o.y)); });
        ctx.restore();
      };
      cv.draw();
    }
    draw();
  };

  /* ------------------------------------------------------------------
     2.6  Részletösszegek
     ------------------------------------------------------------------ */
  W["series-sum"] = root => {
    header(root, "Részletösszegek: összeadni végtelen sok számot",
      "Az oszlopok a tagok ($a_n$), a pontok a részletösszegek ($S_n = a_1 + \\cdots + a_n$). Ha a pontok egy szinthez simulnak, a sor konvergens.");
    const G = 0.5772156649015329;
    let kind = "geo";
    const seg = segmented([["mértani", "geo"], ["harmonikus", "harm"], ["$\\sum \\frac1{n^2}$", "inv2"], ["váltakozó harmonikus", "alt"], ["$\\sum \\frac1{n!}$", "fact"]],
      "geo", v => { kind = v; draw(); });
    const sa = slider("$a$ =", 0.1, 2, 0.05, 0.5, () => draw(), v => fmt(v, 2));
    const sq = slider("$q$ =", -1.2, 1.2, 0.05, 0.5, () => draw(), v => fmt(v, 2));
    const sn = slider("tagok száma $n$ =", 1, 200, 1, 10, () => draw(), v => fmt(v, 0));
    sn.el.style.width = "min(240px, 38vw)"; sn.wrap.style.whiteSpace = "nowrap";
    const geoBox = h("div", { class: "controls" }, sa.wrap, sq.wrap,
      btn("Zénón", () => { sa.value = 0.5; sq.value = 0.5; draw(); }),
      btn("$0{,}999\\ldots$", () => { sa.value = 0.9; sq.value = 0.1; draw(); }));
    const formula = h("div", { style: "margin:.4rem 0;overflow-x:auto;overflow-y:hidden" });
    root.append(seg.wrap, geoBox, h("div", { class: "controls" }, sn.wrap), formula);
    const cv = C.canvas(root, 0.55);
    const leg = legend([["tag $a_n$", "--setB"], ["részletösszeg $S_n$", "--accent"], ["határérték $S$", "--ok", true]]);
    root.append(leg);
    const stats = h("div");
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6" });
    root.append(stats, out);

    function draw() {
      const n = sn.value, a = sa.value, q = sq.value;
      geoBox.style.display = kind === "geo" ? "" : "none";
      const lf = [0];                                  // log10 k!
      for (let k = 1; k <= n; k++) lf[k] = lf[k - 1] + Math.log10(k);
      const term = {
        geo: k => a * Math.pow(q, k - 1), harm: k => 1 / k, inv2: k => 1 / (k * k),
        alt: k => (k % 2 ? 1 : -1) / k, fact: k => Math.pow(10, -lf[k])
      }[kind];
      let lim = null, ftex;
      const N3 = x => texNum(x, 4);
      if (kind === "geo") {
        if (Math.abs(q) < 1) lim = a / (1 - q);
        ftex = `\\sum_{n=1}^{\\infty} a\\,q^{n-1} = ${N3(a)} + ${q < 0 ? "(" + N3(a * q) + ")" : N3(a * q)} + ${N3(a * q * q)} + \\cdots`;
      } else if (kind === "harm") ftex = "\\sum_{n=1}^{\\infty} \\frac1n = 1 + \\frac12 + \\frac13 + \\cdots";
      else if (kind === "inv2") { lim = Math.PI * Math.PI / 6; ftex = "\\sum_{n=1}^{\\infty} \\frac1{n^2} = 1 + \\frac14 + \\frac19 + \\cdots = \\frac{\\pi^2}{6}"; }
      else if (kind === "alt") { lim = Math.LN2; ftex = "\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} = 1 - \\frac12 + \\frac13 - \\cdots = \\ln 2"; }
      else { lim = Math.E - 1; ftex = "\\sum_{n=1}^{\\infty} \\frac1{n!} = 1 + \\frac12 + \\frac16 + \\cdots = e - 1"; }
      formula.innerHTML = `$${ftex}$`;
      leg.children[2].style.display = lim == null ? "none" : "";
      window.Synopsis && Synopsis.renderMath(formula);

      const terms = [], sums = [];
      let S = 0;
      for (let k = 1; k <= n; k++) { const t = term(k); S += t; terms.push(t); sums.push(S); }
      // nézet
      const vals = [...terms, ...sums, 0];
      if (lim != null) vals.push(lim);
      let [ymin, ymax] = yRange(vals, 0.1);
      if (ymin > 0) ymin = 0;
      const view = { xmin: -n * 0.03 - 0.3, xmax: n + 0.8, ymin, ymax, labels: false };
      view.xstep = w2step(n, cv.w * 0.8, 1);
      view.ystep = w2step(ymax - ymin, cv.h * 0.9);
      const bw = Math.min(0.2, 0.5 - 0.5 / Math.max(2, cv.w / n / 2));
      cv.draw = () => {
        const layers = [];
        if (lim != null) layers.push({ hline: lim, color: "--ok", dash: [6, 4], width: 1.6 });
        const T = C.plot(cv, view, layers);
        fillRects(cv, T, terms.map((t, i) => ({ x0: i + 1 - bw, x1: i + 1 + bw, y0: 0, y1: t, color: "--setB", alpha: 0.75 })));
        w2axes(cv, T, view, { xl: x => fmt(x, 0), xname: "n" });
        const P = sums.map((s, i) => [i + 1, s]);
        // lépcső
        const st = [];
        P.forEach(([x, y], i) => { if (i) st.push([x, P[i - 1][1]]); st.push([x, y]); });
        w2poly(cv, T, st, "--accent", 1.2);
        const r = n <= 30 ? 3.6 : n <= 80 ? 2.6 : 1.8;
        const ctx = cv.ctx;
        ctx.save(); ctx.fillStyle = col("--accent");
        P.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), r, 0, 2 * Math.PI); ctx.fill(); });
        ctx.restore();
        if (lim != null) {
          ctx.save(); ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = col("--ok");
          ctx.textAlign = "right"; ctx.textBaseline = "bottom";
          const ly = T.ty(lim) - 4 < 16 ? T.ty(lim) + 18 : T.ty(lim) - 4, ls = "S = " + fmt(lim, 6), lw = ctx.measureText(ls).width;
          ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(cv.w - 12 - lw, ly - 15, lw + 8, 15);
          ctx.globalAlpha = 1; ctx.fillStyle = col("--ok");
          ctx.fillText(ls, cv.w - 8, ly);
          ctx.restore();
        }
      };
      cv.draw();
      // kijelzők
      const last = terms[n - 1];
      const aTex = kind === "fact" ? w2tex(1, 6, -lf[n]) : w2tex(last, 6);
      const sTex = Math.abs(S) >= 1e7 ? w2tex(S) : texNum(S, 6);
      const items = [[`utolsó tag $a_{${n}}$`, `$${aTex}$`], [`részletösszeg $S_{${n}}$`, `$${sTex}$`]];
      let msg = "";
      if (kind === "harm") {
        items.push(["$\\ln n + \\gamma$", `$${texNum(Math.log(n) + G, 6)}$`], ["határérték", "$\\infty$ (divergens)"]);
        msg = `$S_n \\approx \\ln n + 0{,}5772$ – a különbség $n = ${n}$-nél $${texNum(S - Math.log(n) - G, 6)}$. ` +
          "A tagok 0-hoz tartanak, az összeg mégis végtelen – csak nagyon lassan: $S_n \\gt 10$-hez kb. $12\\,367$ tag kell.";
      } else if (lim != null) {
        const d = Math.abs(S - lim);
        items.push(["határérték $S$" + (kind === "geo" ? " $= \\frac{a}{1-q}$" : ""), `$${texNum(lim, 6)}$`],
          [`eltérés $|S_{${n}} - S|$`, `$${d === 0 ? "0" : w2tex(d, 6)}$`]);
        if (kind === "geo") msg = `$|q| = ${texNum(Math.abs(q), 2)} \\lt 1$: a tagok mértani sorozata 0-hoz tart, és $S_n = a\\,\\dfrac{1 - q^n}{1 - q} \\to \\dfrac{a}{1 - q} = ${texNum(lim, 6)}$.`;
        else if (kind === "alt") msg = "A részletösszegek felváltva a határérték fölé és alá ugranak – az eltérés legfeljebb a következő tag abszolút értéke.";
        else if (kind === "inv2") msg = "A tagok elég gyorsan fogynak ($\\tfrac1{n^2}$), ezért az összeg véges – de a pontos érték, $\\tfrac{\\pi^2}{6}$, egyáltalán nem nyilvánvaló (Euler).";
        else msg = "A faktoriális nagyon gyorsan nő, így a tagok villámgyorsan eltűnnek: már 10 tag 6 tizedesre pontos.";
      } else {
        items.push(["határérték", "divergens"]);
        msg = "$|q| \\ge 1$: a tagok nem tartanak 0-hoz, a sor divergens." +
          (Math.abs(q + 1) < 1e-9 ? " (Itt $q = -1$: a részletösszegek $a, 0, a, 0, \\ldots$ – nincs határértékük.)" :
            Math.abs(q - 1) < 1e-9 ? " (Itt $q = 1$: $S_n = n\\cdot a$ a végtelenbe tart.)" : "");
      }
      statRow(stats, items);
      out.innerHTML = msg;
      window.Synopsis && Synopsis.renderMath(out);
    }
    draw();
  };

  /* ------------------------------------------------------------------
     2.7-e  Annuitás és törlesztési táblázat
     ------------------------------------------------------------------ */
  W["annuity-calc"] = root => {
    header(root, "Hiteltörlesztés: annuitás és törlesztési táblázat",
      "Minden időszakban ugyanannyit fizetsz vissza ($a$). Ebből előbb a kamat jár a még fennálló tartozás után, a maradék csökkenti a tartozást.");
    const Ft = x => fmt(x, 0) + " Ft";
    const sV = slider("hitel $V$ =", 100000, 50000000, 100000, 1000000, () => draw(), v => Ft(v));
    const sp = slider("éves kamatláb $p$ =", 0.5, 20, 0.1, 10, () => draw(), v => fmt(v, 1) + " %");
    const sn = slider("futamidő $n$ =", 1, 30, 1, 3, () => draw(), v => fmt(v, 0) + " év");
    let monthly = false;
    const per = segmented([["évi részlet", false], ["havi részlet", true]], false, v => { monthly = v; draw(); });
    root.append(h("div", { class: "controls" }, sV.wrap), h("div", { class: "controls" }, sp.wrap, sn.wrap),
      h("div", { class: "controls" }, per.wrap,
        btn("Példa: 1 M Ft, 10 %, 3 év", () => { sV.value = 1e6; sp.value = 10; sn.value = 3; if (monthly) per.wrap.children[0].click(); else draw(); }),
        btn("Lakáshitel: 20 M Ft, 6 %, 20 év, havi", () => { sV.value = 20e6; sp.value = 6; sn.value = 20; if (!monthly) per.wrap.children[1].click(); else draw(); })));
    const stats = h("div");
    const formula = h("div", { class: "readout", style: "overflow-x:auto" });
    root.append(stats, formula);
    const cv = C.canvas(root, 0.5);
    root.append(legend([["kamatrész", "--setB"], ["tőkerész", "--accent"]]));
    const cv2 = C.canvas(root, 0.28);
    root.append(legend([["fennálló tartozás (az időszak végén)", "--muted"]]));
    root.append(h("p", { class: "w-sub", style: "margin:.5rem 0" },
      "Az elején a részlet nagy része kamat, a végén szinte csak tőke – mert a kamat mindig a még fennálló tartozás után jár."));
    const tw = h("div", { class: "tw", style: "overflow-x:auto;max-height:24rem;overflow-y:auto" });
    root.append(tw);

    const mlab = v => (v === 0 ? "0" : Math.abs(v) >= 1e6 ? fmt(v / 1e6, 2) + " M" : fmt(v / 1e3, 1) + " e");
    function draw() {
      const V = sV.value, p = sp.value, years = sn.value;
      const m = monthly ? 12 : 1, N = years * m, r = p / 100 / m, q = 1 + r;
      const a = r === 0 ? V / N : V * Math.pow(q, N) * (q - 1) / (Math.pow(q, N) - 1);
      const rows = [];
      let D = V;
      for (let k = 1; k <= N; k++) {
        const i = D * r, t = a - i, D1 = k === N ? 0 : D - t;
        rows.push({ k, D0: D, i, t, D1 });
        D = D1;
      }
      const tot = N * a;
      statRow(stats, [
        [monthly ? "havi törlesztőrészlet $a$" : "évi törlesztőrészlet $a$", Ft(a)],
        [`összes befizetés (${N} · a)`, Ft(tot)],
        ["összes kamat", Ft(tot - V)],
        ["kamat a hitel %-ában", fmt((tot - V) / V * 100, 1) + " %"]
      ]);
      formula.innerHTML = `$q = 1 + \\tfrac{${texNum(p, 1)}}{${monthly ? 1200 : 100}} = ${texNum(q, monthly ? 6 : 4)}$<br>` +
        `$a = V\\,\\dfrac{q^{${N}}(q - 1)}{q^{${N}} - 1} = ${texNum(a, 2)}\\ \\text{Ft}$`;
      window.Synopsis && Synopsis.renderMath(formula);

      // oszlopdiagram
      const view = { xmin: 0, xmax: N + 0.5, ymin: -a * 0.04, ymax: a * 1.12, labels: false };
      view.xstep = w2step(N, cv.w * 0.8, 1);
      view.ystep = w2step(view.ymax, cv.h * 0.9);
      const bw = N <= 40 ? 0.36 : 0.5;
      cv.draw = () => {
        const T = C.plot(cv, view, []);
        if (N <= 40) fillRects(cv, T, rows.flatMap(o => [
          { x0: o.k - bw, x1: o.k + bw, y0: 0, y1: o.t, color: "--accent", alpha: 0.8 },
          { x0: o.k - bw, x1: o.k + bw, y0: o.t, y1: a, color: "--setB", alpha: 0.8 }
        ]));
        else {                                   // sok vékony oszlop: lépcsős területként (nincs csíkozódás)
          const ctx = cv.ctx;
          const area = (lo, hi, c) => {
            ctx.beginPath();
            rows.forEach(o => { ctx.lineTo(T.tx(o.k - 0.5), T.ty(hi(o))); ctx.lineTo(T.tx(o.k + 0.5), T.ty(hi(o))); });
            for (let j = rows.length - 1; j >= 0; j--) { const o = rows[j]; ctx.lineTo(T.tx(o.k + 0.5), T.ty(lo(o))); ctx.lineTo(T.tx(o.k - 0.5), T.ty(lo(o))); }
            ctx.closePath(); ctx.save(); ctx.globalAlpha = 0.8; ctx.fillStyle = col(c); ctx.fill(); ctx.restore();
          };
          area(() => 0, o => o.t, "--accent");
          area(o => o.t, () => a, "--setB");
        }
        w2axes(cv, T, view, { xl: x => fmt(x, 0), yl: mlab, xname: monthly ? "hónap" : "év", yname: "Ft / részlet" });
      };
      const v2 = { xmin: 0, xmax: N + 0.5, ymin: -V * 0.06, ymax: V * 1.15, labels: false };
      v2.xstep = view.xstep;
      v2.ystep = w2step(v2.ymax, cv2.h * 1.1);
      cv2.draw = () => {
        const T = C.plot(cv2, v2, []);
        w2poly(cv2, T, [[0, V], ...rows.map(o => [o.k, o.D1])], "--muted", 2.2);
        w2axes(cv2, T, v2, { xl: x => fmt(x, 0), yl: mlab, xname: monthly ? "hónap" : "év", yname: "tartozás, Ft" });
      };
      cv.draw(); cv2.draw();

      // táblázat (havinál évenként összesítve)
      let trs = rows;
      if (monthly) {
        trs = [];
        for (let y = 0; y < years; y++) {
          const g = rows.slice(y * 12, y * 12 + 12);
          trs.push({ k: y + 1, D0: g[0].D0, i: g.reduce((s, o) => s + o.i, 0), t: g.reduce((s, o) => s + o.t, 0), D1: g[11].D1 });
        }
      }
      const td = (x, b) => `<td style="text-align:right;white-space:nowrap">${b ? "<b>" + x + "</b>" : x}</td>`;
      const th = s => `<th style="text-align:right">${s}</th>`;
      tw.innerHTML = `<table style="font-size:.88rem;min-width:520px"><thead><tr><th style="text-align:left">${monthly ? "év (12 havi részlet)" : "év"}</th>` +
        th("tartozás az elején") + th("kamat") + th("tőketörlesztés") + th("tartozás a végén") + "</tr></thead><tbody>" +
        trs.map(o => `<tr><td>${o.k}.</td>${td(fmt(o.D0, 0))}${td(fmt(o.i, 0))}${td(fmt(o.t, 0))}${td(fmt(o.D1, 0))}</tr>`).join("") +
        `<tr><td><b>összesen</b></td>${td("")}${td(fmt(tot - V, 0), 1)}${td(fmt(V, 0), 1)}${td("")}</tr></tbody></table>`;
    }
    draw();
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
