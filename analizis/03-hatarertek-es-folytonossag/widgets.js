/* =========================================================
   Analízis 3. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz és a képletek értelmezéséhez az assets/calc.js-t használja.
   ========================================================= */
(function () {
  "use strict";
  const C = window.Calc;
  const fmt = C.fmt;
  const css = C.css;
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const texNum = (x, d = 3) => fmt(x, d).replace(",", "{,}").replace(/[\s\u202f\u00a0]/g, "\\,").replace("−", "-");

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
     w1.js – limit-zoom, epsilon-delta, sinx-over-x
     ================================================================== */
  /* sokszög kitöltése a C.plot transzformációjával */
  function w1poly(cv, T, pts, color, alpha = 0.3, stroke) {
    const ctx = cv.ctx;
    ctx.save();
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.closePath();
    ctx.globalAlpha = alpha; ctx.fillStyle = col(color); ctx.fill();
    if (stroke) { ctx.globalAlpha = 1; ctx.strokeStyle = col(color); ctx.lineWidth = 1.6; ctx.stroke(); }
    ctx.restore();
  }
  /* y-tartomány minták alapján, a kilógó (aszimptotikus) értékek levágásával */
  function w1yr(vals, pad = 0.12) {
    const v = vals.filter(Number.isFinite).sort((a, b) => a - b);
    if (!v.length) return [-1, 1];
    let lo = v[Math.floor(v.length * 0.03)], hi = v[Math.ceil(v.length * 0.97) - 1];
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    const p = (hi - lo) * pad;
    return [lo - p, hi + p];
  }
  /* szám rövid alakban: nagyon kicsi h-ra normál alak */
  const w1sci = x => {
    if (x === 0) return "0";
    const k = Math.round(Math.log10(Math.abs(x)));
    if (Math.abs(x - Math.pow(10, k)) < 1e-12 * Math.abs(x) && k <= -4) return "10^" + k;
    return fmt(x, 8);
  };

  /* ------------------------------------------------------------------
     3.1  Ráközelítés a határértékre
     ------------------------------------------------------------------ */
  W["limit-zoom"] = root => {
    header(root, "Ráközelítés – mit csinál a függvény a pont körül?",
      "Válassz függvényt, aztán a csúszkával vidd egyre közelebb a két mérőpontot ($a - h$ és $a + h$) az $a$-hoz. A „ráközelítés” kapcsolóval " +
      "a nézet is velük együtt szűkül. Saját képletet is megadhatsz ($x$ változóval).");
    const P = [
      { l: "(x²−1)/(x−1), a = 1", f: x => (x * x - 1) / (x - 1), a: 1, src: "(x^2-1)/(x-1)" },
      { l: "sin x / x, a = 0", f: x => Math.sin(x) / x, a: 0, src: "sin(x)/x" },
      { l: "(2ˣ−1)/x, a = 0", f: x => (Math.pow(2, x) - 1) / x, a: 0, src: "(2^x-1)/x" },
      { l: "(√(x+9)−3)/x, a = 0", f: x => (Math.sqrt(x + 9) - 3) / x, a: 0, src: "(sqrt(x+9)-3)/x" },
      { l: "g: x+1, de g(1) = 5", f: x => (x === 1 ? 5 : x + 1), a: 1, src: null },
      { l: "sgn x, a = 0", f: x => Math.sign(x), a: 0, src: "sgn(x)" },
      { l: "sin(π/x), a = 0", f: x => Math.sin(Math.PI / x), a: 0, src: "sin(pi/x)" },
      { l: "1/x², a = 0", f: x => 1 / (x * x), a: 0, src: "1/x^2" }
    ];
    let cur = P[0], fn = cur.f, a = cur.a;
    const inp = h("input", { type: "text", value: cur.src, style: "width:12rem;font-family:var(--mono)" });
    const ain = h("input", { type: "text", value: "1", style: "width:4rem;font-family:var(--mono)" });
    const err = h("span", { class: "muted" });
    const bs = P.map(p => {
      const b = btn(p.l, () => {
        cur = p; fn = p.f; a = p.a; inp.value = p.src || "(beépített)"; ain.value = String(p.a);
        bs.forEach(x => x.classList.toggle("on", x === b)); err.textContent = "";
        draw();
      });
      return b;
    });
    bs[0].classList.add("on");
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...bs));
    const apply = () => {
      const c = compile(inp.value, ["x"]);
      const ca = compile(ain.value, ["x"]);
      if (c.err || ca.err) { err.textContent = "⚠ " + (c.err || ca.err); return; }
      err.textContent = ""; fn = c.f; a = ca.f(0); cur = { l: "saját", f: fn, a, src: inp.value };
      bs.forEach(b => b.classList.remove("on"));
      draw();
    };
    root.append(h("div", { class: "controls" },
      h("label", null, "f(x) = ", inp), h("label", null, "a = ", ain), btn("Rajzold", apply), err));
    inp.addEventListener("keydown", e => { if (e.key === "Enter") apply(); });
    ain.addEventListener("keydown", e => { if (e.key === "Enter") apply(); });
    const K = slider("távolság: h = 10^−k, k =", 0, 6, 0.1, 0.5, () => draw(), v => fmt(v, 1));
    let zoom = true;
    const zb = btn("ráközelítés: be", () => { zoom = !zoom; zb.textContent = "ráközelítés: " + (zoom ? "be" : "ki"); zb.classList.toggle("on", zoom); draw(); }, "btn on");
    root.append(h("div", { class: "controls" }, K.wrap, zb));
    const cv = C.canvas(root, 0.55, 760);
    root.append(legend([["f grafikonja", "--accent"], ["mérőpont balról", "--setB"], ["mérőpont jobbról", "--setC"]]));
    const out = h("div", { class: "stat-row" });
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    const note = h("p", { class: "w-sub", style: "margin:.3rem 0 0" });
    root.append(out, note, tw);

    function draw() {
      const hh = Math.pow(10, -K.value);
      const half = zoom ? Math.max(4 * hh, 1e-7) : 3;
      const x0 = a - half, x1 = a + half;
      const samp = [];
      for (let k = 0; k <= 400; k++) { const x = x0 + (x1 - x0) * k / 400; if (Math.abs(x - a) > half * 1e-6) samp.push(fn(x)); }
      const L = fn(a - hh), Rr = fn(a + hh);
      let [lo, hi] = w1yr([...samp, L, Rr]);
      const fa = fn(a);
      // a határérték becslése: nagyon közeli pontok
      // több, „szabálytalan” távolságban is megnézzük (a sin(π/x) a kerek helyeken becsapna)
      const sc = Math.max(Math.abs(a), 1);
      const offs = [1.234e-6, 3.17e-7, 7.31e-8, 1.913e-7].map(t => t * sc);
      const vals = offs.flatMap(t => [fn(a - t), fn(a + t)]);
      const l1 = vals[0], r1 = vals[1];
      const agree = vals.every(Number.isFinite) && Math.max(...vals) - Math.min(...vals) < 1e-4 * Math.max(1, Math.abs(l1));
      const lim = agree ? (vals[6] + vals[7]) / 2 : NaN;
      cv.draw = () => {
        const T = C.plot(cv, { xmin: x0, xmax: x1, ymin: lo, ymax: hi, xname: "x", yname: "y" }, [
          { vline: a, color: "--border", dash: [4, 4] },
          { f: x => (x === a ? NaN : fn(x)), color: "--accent" },
          { seg: [[a - hh, lo], [a - hh, L]], color: "--setB", dash: [3, 3] },
          { seg: [[a + hh, lo], [a + hh, Rr]], color: "--setC", dash: [3, 3] },
          { points: [[a - hh, L]], color: "--setB" },
          { points: [[a + hh, Rr]], color: "--setC" },
          agree ? { points: [[a, lim]], color: "--accent", open: true, r: 5 } : { text: "" },
          Number.isFinite(fa) && !(agree && Math.abs(fa - lim) < 1e-9) ? { points: [[a, fa]], color: "--bad", r: 5 } : { text: "" }
        ]);
        return T;
      };
      cv.draw();
      const fv = v => (Number.isFinite(v) ? fmt(v, 6) : "nincs értelmezve");
      statRow(out, [[`$f(a - h)$`, fv(L)], [`$f(a + h)$`, fv(Rr)], [`$f(a)$`, fv(fa)], ["$h$", w1sci(hh)]]);
      note.innerHTML = agree
        ? `A két oldal ugyanoda közelít: $\\lim\\limits_{x\\to a} f(x) \\approx ${texNum(lim, 6)}$` +
          (Number.isFinite(fa) ? (Math.abs(fa - lim) < 1e-9 ? " – és ez éppen $f(a)$." : ` – de $f(a) = ${texNum(fa, 4)}$: a határérték nem a helyettesítési érték!`) : " – pedig $f(a)$ nincs is értelmezve (üres karika).")
        : (Number.isFinite(l1) && Number.isFinite(r1) && Math.abs(l1) < 1e6 && Math.abs(r1) < 1e6
          ? "A két oldal nem ugyanoda tart (vagy a függvény leng): ilyenkor a határérték nem létezik. Próbálj ki több $k$-t!"
          : "Az értékek a pont közelében minden határon túl nőnek: végtelen határérték (3.3).");
      Synopsis.renderMath && Synopsis.renderMath(note);
      tw.innerHTML = "";
      const ks = [1, 2, 3, 4, 5];
      const fmtX = (k, s) => fmt(a + s * Math.pow(10, -k), 6);
      tw.append(h("table", { style: "font-size:.85rem" },
        h("tr", null, h("th", null, "x"), ...ks.map(k => h("td", null, fmtX(k, -1))), h("td", { style: "background:var(--bg-soft)" }, "a"), ...ks.slice().reverse().map(k => h("td", null, fmtX(k, 1)))),
        h("tr", null, h("th", null, "f(x)"), ...ks.map(k => h("td", null, fv(fn(a - Math.pow(10, -k))))), h("td", { style: "background:var(--bg-soft)" }, fv(fa)),
          ...ks.slice().reverse().map(k => h("td", null, fv(fn(a + Math.pow(10, -k))))))));
      tw.append(h("p", { class: "w-sub", style: "margin:.2rem 0 0" }, "A táblázat az a ± 0,1; 0,01; …; 0,000 01 helyeken számol."));
    }
    draw();
  };

  /* ------------------------------------------------------------------
     3.2  Az ε–δ játék
     ------------------------------------------------------------------ */
  W["epsilon-delta"] = root => {
    header(root, "Az $\\varepsilon$–$\\delta$ játék – találsz-e elég kis ablakot?",
      "Az „ellenfél” megad egy $\\varepsilon$ hibahatárt (vízszintes sáv $A$ körül). Te egy $\\delta$-t választasz (függőleges ablak $a$ körül). " +
      "Akkor nyertél, ha az ablakban <b>minden</b> pont (az $a$-t kivéve) a sávban marad. A gép meg is keresi a legnagyobb jó $\\delta$-t.");
    const P = [
      { l: "3x − 1, a = 2", f: x => 3 * x - 1, a: 2, A: 5, tex: "3x - 1", span: 1.5 },
      { l: "x², a = 3", f: x => x * x, a: 3, A: 9, tex: "x^2", span: 1.5 },
      { l: "√x, a = 4", f: x => Math.sqrt(x), a: 4, A: 2, tex: "\\sqrt{x}", span: 3 },
      { l: "sin x / x, a = 0", f: x => Math.sin(x) / x, a: 0, A: 1, tex: "\\tfrac{\\sin x}{x}", span: 3 },
      { l: "sgn x, a = 0, A = 1", f: x => Math.sign(x), a: 0, A: 1, tex: "\\operatorname{sgn} x", span: 1.5 },
      { l: "x sin(1/x), a = 0", f: x => x * Math.sin(1 / x), a: 0, A: 0, tex: "x\\sin\\tfrac1x", span: 0.6 }
    ];
    let cur = P[0];
    const seg = segmented(P.map((p, i) => [p.l, i]), 0, i => { cur = P[i]; D.value = Math.log10(0.1); draw(); });
    root.append(seg.wrap);
    const EPS = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.01];
    let eps = 0.1;
    const es = segmented(EPS.map(e => ["ε = " + fmt(e, 2), e]), eps, v => { eps = v; draw(); });
    const D = slider("δ =", -4, 0.3, 0.01, Math.log10(0.1), () => draw(), v => fmt(Math.pow(10, v), 4));
    root.append(h("div", { class: "controls" }, h("span", null, "ellenfél: "), es.wrap));
    const best = btn("Legnagyobb jó δ", () => { const d = bestDelta(); if (d > 0) { D.value = Math.log10(d * 0.999); draw(); } });
    root.append(h("div", { class: "controls" }, D.wrap, best));
    const cv = C.canvas(root, 0.55, 760);
    root.append(legend([["f grafikonja", "--accent"], ["ε-sáv: A ± ε", "--ok"], ["δ-ablak: a ± δ", "--setB"], ["sávon kívüli pont", "--bad"]]));
    const out = h("div", { class: "stat-row" });
    const msg = h("p", { class: "w-sub", style: "margin:.3rem 0 0;font-weight:600" });
    root.append(out, msg);

    function samples(d) {
      const xs = [];
      const n = 1500;
      for (let k = 1; k <= n; k++) {
        const t = k / n, u = d * (0.4 * t + 0.6 * t * t * t);   // sűrűbben a középpont körül
        xs.push(cur.a - u, cur.a + u, cur.a - d * t, cur.a + d * t);
      }
      return xs.filter(x => x !== cur.a);
    }
    function worst(d) {
      let wx = null, wv = -1;
      for (const x of samples(d * 0.999999)) {
        const y = cur.f(x);
        if (!Number.isFinite(y)) continue;
        const e = Math.abs(y - cur.A);
        if (e > wv) { wv = e; wx = x; }
      }
      return { wx, wv };
    }
    function bestDelta() {
      if (worst(1e-6).wv >= eps) return 0;
      let lo = 1e-6, hi = cur.span * 2;
      if (worst(hi).wv < eps) return hi;
      for (let i = 0; i < 50; i++) { const m = Math.sqrt(lo * hi); if (worst(m).wv < eps) lo = m; else hi = m; }
      return lo;
    }
    function draw() {
      const d = Math.pow(10, D.value);
      const a = cur.a, A = cur.A;
      const half = Math.max(cur.span, 2.5 * d);
      const x0 = a - half, x1 = a + half;
      const ys = []; for (let k = 0; k <= 300; k++) { const x = x0 + (x1 - x0) * k / 300; if (x !== a) ys.push(cur.f(x)); }
      let [lo, hi] = w1yr([...ys, A - 1.4 * eps, A + 1.4 * eps]);
      const w = worst(d), ok = w.wv < eps;
      const bad = [];
      if (!ok) for (const x of samples(d).filter((_, i) => i % 6 === 0)) { const y = cur.f(x); if (Math.abs(y - A) >= eps) bad.push([x, y]); }
      // a C.plot mindig letörli a vásznat – ezért a rétegeket egyben rajzoljuk újra
      cv.draw = () => {
        const v = { xmin: x0, xmax: x1, ymin: lo, ymax: hi, xname: "x", yname: "y" };
        let T = C.plot(cv, v, []);
        fillBand(cv, T, A - eps, A + eps, "--ok", 0.16);
        fillRects(cv, T, [{ x0: a - d, x1: a + d, y0: lo, y1: hi, color: "--setB", alpha: 0.13 }]);
        const ctx = cv.ctx;
        const line = (yv, c, dash) => { ctx.save(); ctx.strokeStyle = col(c); ctx.setLineDash(dash); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0, T.ty(yv)); ctx.lineTo(cv.w, T.ty(yv)); ctx.stroke(); ctx.restore(); };
        const vl = (xv, c) => { ctx.save(); ctx.strokeStyle = col(c); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(T.tx(xv), 0); ctx.lineTo(T.tx(xv), cv.h); ctx.stroke(); ctx.restore(); };
        line(A + eps, "--ok", [5, 4]); line(A - eps, "--ok", [5, 4]); line(A, "--ok", [1, 3]);
        vl(a - d, "--setB"); vl(a + d, "--setB");
        // görbe sűrűn (a x·sin(1/x) miatt)
        const ctx2 = cv.ctx, n = 4000;
        ctx2.save(); ctx2.strokeStyle = col("--accent"); ctx2.lineWidth = 2; ctx2.beginPath();
        let pen = false;
        for (let k = 0; k <= n; k++) {
          const x = x0 + (x1 - x0) * k / n; const y = x === a ? NaN : cur.f(x);
          if (!Number.isFinite(y) || Math.abs(x - a) < (x1 - x0) * 1e-5) { pen = false; continue; }
          const yy = Math.max(lo - (hi - lo), Math.min(hi + (hi - lo), y));
          if (pen && cur.l.startsWith("sgn") && Math.sign(x - a) !== Math.sign(x - (x1 - x0) / n - a)) pen = false;
          if (!pen) { ctx2.moveTo(T.tx(x), T.ty(yy)); pen = true; } else ctx2.lineTo(T.tx(x), T.ty(yy));
        }
        ctx2.stroke(); ctx2.restore();
        // lyuk a-ban, ha a függvény ott nincs értelmezve; sgn esetén f(0) = 0
        const fa = cur.f(a);
        const dot = (x, y, open, c) => { ctx.save(); ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 4.5, 0, 2 * Math.PI); ctx.lineWidth = 2; ctx.strokeStyle = col(c);
          if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.stroke(); } else { ctx.fillStyle = col(c); ctx.fill(); } ctx.restore(); };
        if (cur.l.startsWith("sgn")) { dot(a, -1, true, "--accent"); dot(a, 1, true, "--accent"); dot(a, 0, false, "--accent"); }
        else dot(a, A, !Number.isFinite(fa), "--accent");
        bad.slice(0, 400).forEach(([x, y]) => { if (y >= lo && y <= hi) { ctx.save(); ctx.fillStyle = col("--bad"); ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 2.6, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); } });
        return T;
      };
      cv.draw();
      const bd = bestDelta();
      statRow(out, [["függvény", `$${cur.tex}$, $a = ${texNum(a, 2)}$, $A = ${texNum(A, 2)}$`], ["$\\varepsilon$", fmt(eps, 2)], ["$\\delta$", fmt(d, 4)],
        ["legnagyobb jó $\\delta$", bd > 0 ? (bd >= cur.span * 2 ? "bármekkora" : "≈ " + fmt(bd, 4)) : "nincs"],
        ["legnagyobb eltérés az ablakban", Number.isFinite(w.wv) ? fmt(w.wv, 4) : "–"]]);
      msg.style.color = ok ? css("--ok") : css("--bad");
      msg.innerHTML = ok ? "✔ Nyertél: az ablakban minden érték a sávban van." :
        (bd > 0 ? `✘ Az ablak túl széles: pl. $x = ${texNum(w.wx, 4)}$-nél $|f(x) - A| = ${texNum(w.wv, 4)} \\ge \\varepsilon$. Szűkítsd a $\\delta$-t!`
          : "✘ Nincs jó $\\delta$: akármilyen kicsi az ablak, a 0 bal oldalán $f(x) = -1$, ami $\\varepsilon \\lt 2$ esetén kilóg a sávból. A határérték nem 1 (sőt nem is létezik).");
      Synopsis.renderMath && Synopsis.renderMath(msg);
    }
    draw();
  };

  /* ------------------------------------------------------------------
     3.4  sin x / x – a geometriai bizonyítás
     ------------------------------------------------------------------ */
  W["sinx-over-x"] = root => {
    header(root, "Miért tart sin x / x az 1-hez? – három terület az egységkörben",
      "Állítsd a szöget! A kis háromszög ($\\tfrac12\\sin x$) a körcikkben ($\\tfrac12 x$) van, az pedig a nagy háromszögben ($\\tfrac12\\tan x$). " +
      "Ebből $\\cos x \\lt \\tfrac{\\sin x}{x} \\lt 1$, és ha $x \\to 0$, a két „rendőr” összeszorítja a középsőt.");
    const X = slider("szög: x =", 0.02, 1.25, 0.01, 0.9, () => draw(), v => fmt(v, 2) + " rad (" + fmt(v * 180 / Math.PI, 1) + "°)");
    root.append(h("div", { class: "controls" }, X.wrap, btn("animáció: x → 0", () => anim())));
    const row = h("div", { class: "two-col", style: "align-items:start" });
    const left = h("div"), right = h("div");
    row.append(left, right); root.append(row);
    const cv = C.canvas(left, 0.9, 420);
    const cv2 = C.canvas(right, 0.9, 420);
    root.append(legend([["kis háromszög: ½ sin x", "--setA"], ["körcikk: ½ x", "--accent"], ["nagy háromszög: ½ tan x", "--setB"]]));
    const out = h("div", { class: "stat-row" });
    root.append(out);
    let timer = null;
    function anim() {
      clearInterval(timer);
      timer = setInterval(() => { const v = X.value * 0.94; if (v <= 0.03) { X.value = 0.02; clearInterval(timer); } else X.value = v; draw(); }, 60);
    }
    X.el.addEventListener("input", () => clearInterval(timer));
    function draw() {
      const x = X.value, s = Math.sin(x), c = Math.cos(x), t = Math.tan(x);
      const ymax = Math.max(1.15, t + 0.12), aspect = 0.9;
      const ys = ymax + 0.12, xs = ys / aspect;
      const v = { xmin: -0.12, xmax: -0.12 + xs, ymin: -0.12, ymax, labels: false, xname: "", yname: "" };
      cv.draw = () => {
        const T = C.plot(cv, v, []);
        const arc = [[0, 0]]; for (let k = 0; k <= 60; k++) arc.push([Math.cos(x * k / 60), Math.sin(x * k / 60)]);
        w1poly(cv, T, [[0, 0], [1, 0], [1, t]], "--setB", 0.22, true);
        w1poly(cv, T, arc, "--accent", 0.3, true);
        w1poly(cv, T, [[0, 0], [1, 0], [c, s]], "--setA", 0.45, true);
        const ctx = cv.ctx;
        ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath();
        for (let k = 0; k <= 100; k++) { const u = Math.PI / 2 * k / 100; const px = T.tx(Math.cos(u)), py = T.ty(Math.sin(u)); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = col("--text"); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(T.tx(c), T.ty(s)); ctx.lineTo(T.tx(c), T.ty(0)); ctx.stroke();
        ctx.restore();
        const lab = (px, py, txt, cc, al = "left") => { ctx.save(); ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = col(cc); ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.fillText(txt, T.tx(px), T.ty(py)); ctx.restore(); };
        lab(c - 0.02, s / 2, "sin x", "--text", "right");
        lab(1.03, t / 2, "tan x", "--setB");
        lab(0.5, -0.06, "1", "--muted", "center");
        lab(0.16 * Math.cos(x / 2), 0.16 * Math.sin(x / 2), "x", "--accent");
        return T;
      };
      cv.draw();
      cv2.draw = () => C.plot(cv2, { xmin: -1.4, xmax: 1.4, ymin: 0, ymax: 1.25, xname: "x", yname: "" }, [
        { f: Math.cos, color: "--muted", dash: [5, 4] },
        { hline: 1, color: "--muted", dash: [5, 4] },
        { f: u => (u === 0 ? NaN : Math.sin(u) / u), color: "--accent" },
        { points: [[0, 1]], color: "--accent", open: true },
        { seg: [[x, c], [x, 1]], color: "--setC", width: 2.5 },
        { points: [[x, s / x]], color: "--setC" },
        { text: "1", at: [-1.35, 1.02], color: "--muted" },
        { text: "cos x", at: [-1.35, Math.cos(1.35) + 0.03], color: "--muted" },
        { text: "sin x / x", at: [0.55, Math.sin(0.55) / 0.55 + 0.05], color: "--accent" }
      ]);
      cv2.draw();
      statRow(out, [["$\\tfrac12\\sin x$", fmt(s / 2, 5)], ["$\\tfrac12 x$", fmt(x / 2, 5)], ["$\\tfrac12\\tan x$", fmt(t / 2, 5)],
        ["$\\cos x \\lt \\tfrac{\\sin x}{x} \\lt 1$", `${fmt(c, 5)} &lt; <b>${fmt(s / x, 5)}</b> &lt; 1`]]);
    }
    draw();
  };
  /* ==================================================================
     w2.js – asymptote-explorer, continuity-types, bisection, thermo-volume
     ================================================================== */
  /* fix tizedesjegyű szám (a záró nullák megmaradnak), magyar formában */
  function w2fix(x, d) {
    if (!Number.isFinite(x)) return "nincs értelmezve";
    let s = Math.abs(x).toFixed(d);
    const neg = x < 0 && /[1-9]/.test(s);
    let [ip, fp] = s.split(".");
    ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + ip + (fp ? "," + fp : "");
  }
  const w2tfix = (x, d) => w2fix(x, d).replace(",", "{,}").replace(/ /g, "\\,").replace("−", "-");
  /* görbe sűrű mintavétellel (C.plot legfeljebb ~2 pont/px-et vesz) */
  function w2curve(cv, T, v, f, a, b, n, color, width = 2.2, dash = []) {
    const ctx = cv.ctx, span = v.ymax - v.ymin;
    ctx.save(); ctx.strokeStyle = col(color); ctx.lineWidth = width; ctx.setLineDash(dash); ctx.lineJoin = "round";
    ctx.beginPath();
    let pen = false;
    for (let k = 0; k <= n; k++) {
      const x = a + (b - a) * k / n, y = f(x);
      if (!Number.isFinite(y)) { pen = false; continue; }
      const yy = Math.max(v.ymin - 3 * span, Math.min(v.ymax + 3 * span, y));
      if (!pen) { ctx.moveTo(T.tx(x), T.ty(yy)); pen = true; } else ctx.lineTo(T.tx(x), T.ty(yy));
    }
    ctx.stroke(); ctx.restore();
  }
  /* jelmagyarázat: [címke, szín, "line" | "dash" | "band"] */
  const w2legend = items => h("div", { class: "controls", style: "font-size:.88rem" },
    ...items.map(([label, c, kind]) => h("span", { class: "chip", style: `border-color:${col(c)}` },
      kind === "none" ? null : h("span", { style: kind === "band" ? `display:inline-block;width:16px;height:12px;border-radius:2px;background:${col(c)};opacity:.4`
        : `display:inline-block;width:18px;border-top:3px ${kind === "dash" ? "dashed" : "solid"} ${col(c)}` }), h("span", { html: label }))));
  /* szöveg a vásznon, halvány háttérrel */
  function w2label(cv, T, x, y, s, color, align = "center", font = "700 13px system-ui, sans-serif") {
    const ctx = cv.ctx;
    ctx.save(); ctx.font = font; ctx.textAlign = align; ctx.textBaseline = "middle";
    const w = ctx.measureText(s).width, px = T.tx(x), py = T.ty(y);
    const x0 = align === "center" ? px - w / 2 : align === "right" ? px - w : px;
    ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(x0 - 3, py - 8, w + 6, 16);
    ctx.globalAlpha = 1; ctx.fillStyle = col(color); ctx.fillText(s, px, py);
    ctx.restore();
  }

  /* ------------------------------------------------------------------
     Polinomok (együtthatók csökkenő fokszám szerint)
     ------------------------------------------------------------------ */
  const w2ev = (p, x) => p.reduce((r, c) => r * x + c, 0);
  function w2div1(p, r) {                       // p = (x − r)·q + maradék
    const o = [p[0]];
    for (let i = 1; i < p.length; i++) o.push(p[i] + o[i - 1] * r);
    return { q: o.slice(0, -1), rem: o[o.length - 1] };
  }
  function w2divmod(p, d) {
    const r = p.slice(), q = [];
    while (r.length >= d.length) {
      const k = r[0] / d[0]; q.push(k);
      for (let i = 0; i < d.length; i++) r[i] -= k * d[i];
      r.shift();
    }
    return { q, r };
  }
  function w2trim(p) { let i = 0; while (i < p.length - 1 && Math.abs(p[i]) < 1e-12) i++; return p.slice(i); }
  /* összes (komplex) gyök Durand–Kerner-módszerrel */
  function w2dk(p) {
    const n = p.length - 1;
    if (n < 1) return [];
    const a = p.map(c => c / p[0]);
    const R = 1 + Math.max(...a.slice(1).map(Math.abs));
    let z = [];
    for (let k = 0; k < n; k++) { const t = 2 * Math.PI * k / n + 0.4; z.push([R * 0.9 * Math.cos(t), R * 0.9 * Math.sin(t)]); }
    const mul = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]];
    const dv = (u, v) => { const d = v[0] * v[0] + v[1] * v[1]; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; };
    for (let it = 0; it < 3000; it++) {
      let move = 0;
      z = z.map((zk, k) => {
        let P = [1, 0];
        for (let i = 1; i <= n; i++) { P = mul(P, zk); P[0] += a[i]; }
        let D = [1, 0];
        z.forEach((zj, j) => { if (j !== k) D = mul(D, [zk[0] - zj[0], zk[1] - zj[1]]); });
        if (D[0] === 0 && D[1] === 0) D = [1e-12, 0];
        const s = dv(P, D);
        move = Math.max(move, Math.hypot(s[0], s[1]));
        return [zk[0] - s[0], zk[1] - s[1]];
      });
      if (move < 1e-15 * R) break;
    }
    return z;
  }
  /* valós gyökök multiplicitással: a közeli gyököket (többszörös gyök) összevonjuk */
  function w2realRoots(p) {
    const z = w2dk(p), used = z.map(() => false), out = [];
    z.forEach((zk, k) => {
      if (used[k]) return;
      const cl = [];
      z.forEach((zj, j) => { if (!used[j] && Math.hypot(zj[0] - zk[0], zj[1] - zk[1]) < 5e-4 * (1 + Math.hypot(zk[0], zk[1]))) { used[j] = true; cl.push(zj); } });
      const re = cl.reduce((s, c) => s + c[0], 0) / cl.length, im = cl.reduce((s, c) => s + c[1], 0) / cl.length;
      // egyszeres gyöknél szigorú, többszörösnél (a DK ott csak lassan, szétszórva konvergál) engedékenyebb a „valós” döntés
      if (Math.abs(im) < (cl.length > 1 ? 1e-4 : 1e-7) * (1 + Math.abs(re))) {
        let r = re;
        // finomítás Newton-módszerrel az (m − 1)-edik deriválton (ott r egyszeres gyök)
        let D = p.slice();
        for (let j = 1; j < cl.length; j++) D = D.slice(0, -1).map((c, i) => c * (D.length - 1 - i));
        const D1 = D.slice(0, -1).map((c, i) => c * (D.length - 1 - i));
        for (let it = 0; it < 30 && D1.length; it++) { const d1 = w2ev(D1, r); if (!d1) break; const st = w2ev(D, r) / d1; r -= st; if (Math.abs(st) < 1e-16) break; }
        if (!Number.isFinite(r) || Math.abs(r - re) > 1e-3 * (1 + Math.abs(re))) r = re;
        for (let d = 1; d <= 12; d++) { const k2 = Math.round(r * d); if (Math.abs(r - k2 / d) < 1e-7) { r = k2 / d; break; } }
        out.push({ r, m: cl.length });
      }
    });
    return out.sort((u, v) => u.r - v.r);
  }
  function w2parseCoefs(s) {
    const toks = String(s).trim().split(/[\s,;]+/).filter(Boolean);
    if (!toks.length) return { err: "üres mező" };
    const c = [];
    for (const t of toks) {
      let v;
      if (/^[+-]?\d*\.?\d+\/\d*\.?\d+$/.test(t)) { const [u, w] = t.split("/"); v = +u / +w; }
      else v = Number(t);
      if (!Number.isFinite(v)) return { err: `„${t}” nem szám (tizedespontot használj, az együtthatókat vessző választja el)` };
      c.push(v);
    }
    const p = w2trim(c);
    if (p.length > 5) return { err: "legfeljebb 4. fokú polinomot adj meg (legfeljebb 5 együttható)" };
    return { p, zero: p.length === 1 && p[0] === 0 };
  }
  /* polinom TeX-ben */
  function w2polyTex(p) {
    const n = p.length - 1;
    let s = "";
    p.forEach((c, i) => {
      if (Math.abs(c) < 1e-12) return;
      const k = n - i, a = Math.abs(c);
      const cs = (a === 1 && k > 0) ? "" : texNum(a, 4);
      const xs = k === 0 ? "" : k === 1 ? "x" : `x^{${k}}`;
      s += (s ? (c < 0 ? " - " : " + ") : (c < 0 ? "-" : "")) + cs + xs;
    });
    return s || "0";
  }
  const w2lin = (m, b) => {
    const ms = Math.abs(m - 1) < 1e-12 ? "" : Math.abs(m + 1) < 1e-12 ? "-" : texNum(m, 4);
    return `y = ${ms}x` + (Math.abs(b) < 1e-12 ? "" : (b < 0 ? " - " : " + ") + texNum(Math.abs(b), 4));
  };

  /* ------------------------------------------------------------------
     3.3-d  Racionális törtfüggvény: aszimptoták és lyukak
     ------------------------------------------------------------------ */
  W["asymptote-explorer"] = root => {
    header(root, "Racionális törtfüggvény: aszimptoták és lyukak",
      "Add meg a számláló és a nevező együtthatóit csökkenő fokszám szerint, vesszővel elválasztva (pl. <code>1, 0, -1</code> = $x^2 - 1$; legfeljebb 4. fok), vagy válassz egy mintát.");
    const PRE = [
      ["1, 0, -1", "1, -1", "\\frac{x^2-1}{x-1}"],
      ["1, 1", "1, -1", "\\frac{x+1}{x-1}"],
      ["2, 0, -1", "1, 0, -4", "\\frac{2x^2-1}{x^2-4}"],
      ["1, 0", "1, 0, 1", "\\frac{x}{x^2+1}"],
      ["1, 0, 1", "1, 0", "\\frac{x^2+1}{x}"],
      ["1, -3, 2", "1, 0, -1", "\\frac{x^2-3x+2}{x^2-1}"],
      ["1, 0, 0, 0", "1, 0, -1", "\\frac{x^3}{x^2-1}"]
    ];
    const pres = h("div", { class: "controls", style: "gap:.3rem" });
    const preBtns = PRE.map(([a, b, t], i) => {
      const bt = h("button", { class: "btn", type: "button", style: "padding:.15rem .5rem", "aria-label": "minta " + (i + 1), html: tex(t) });
      bt.addEventListener("click", () => { inP.value = a; inQ.value = b; preBtns.forEach(x => x.classList.toggle("on", x === bt)); calc(); });
      return bt;
    });
    pres.append(...preBtns);
    const inP = h("input", { type: "text", value: PRE[5][0], style: "width:min(11rem,62vw);font-family:var(--mono)", "aria-label": "számláló együtthatói" });
    const inQ = h("input", { type: "text", value: PRE[5][1], style: "width:min(11rem,62vw);font-family:var(--mono)", "aria-label": "nevező együtthatói" });
    [inP, inQ].forEach(e => e.addEventListener("input", () => { preBtns.forEach(x => x.classList.remove("on")); calc(); }));
    preBtns[5].classList.add("on");
    const sX = slider("nézet: $x$ =", 4, 40, 1, 5, () => calc(), v => "±" + fmt(v, 0));
    sX.el.style.width = "min(200px, 45vw)";
    root.append(pres,
      h("div", { class: "controls" }, h("label", null, "számláló:", inP), h("label", null, "nevező:", inQ)),
      h("div", { class: "controls" }, sX.wrap));
    const cv = C.canvas(root, 0.62);
    root.append(w2legend([["$f$ grafikonja", "--accent"], ["függőleges aszimptota", "--bad", "dash"], ["vízszintes / ferde aszimptota", "--ok", "dash"], ["○ lyuk", "--accent", "none"]]));
    const st = h("div");
    const msg = h("div", { class: "readout", style: "font-family:var(--font);overflow-wrap:anywhere" });
    root.append(st, msg, h("p", { class: "w-sub", style: "margin:.6rem 0 0",
      html: "Lyuk ott van, ahol a számláló és a nevező is 0, és az egyszerűsítés eltünteti a zérushelyet; függőleges aszimptota ott, ahol egyszerűsítés után is 0 a nevező." }));

    function analyse(p0, q0) {
      let p = p0.slice(), q = q0.slice();
      const roots = w2realRoots(q0), holes = [], vert = [];
      const scale = (P, r) => P.reduce((s, c, i) => s + Math.abs(c) * Math.pow(Math.max(1, Math.abs(r)), P.length - 1 - i), 0);
      const pZero = p.length === 1 && p[0] === 0;
      const mulr = (P, r) => { const o = [...P, 0]; for (let i = 1; i < o.length; i++) o[i] -= r * P[i - 1]; return o; };
      roots.forEach(o => {
        const { r, m } = o;
        for (let i = 0; i < m; i++) q = w2div1(q, r).q;
        let k = 0;
        if (pZero) k = m;
        else while (k < m && p.length > 1 && Math.abs(w2ev(p, r)) < 1e-9 * scale(p, r)) { p = w2div1(p, r).q; k++; }
        for (let i = 0; i < m - k; i++) q = mulr(q, r);          // a meg nem szűnt (x − r) tényezők vissza
        o.k = k;
      });
      const cancelled = roots.some(o => o.k > 0) && !pZero;
      roots.forEach(o => {
        if (o.k === o.m) holes.push({ r: o.r, val: w2ev(p, o.r) / w2ev(q, o.r) });
        else {
          const g = x => w2ev(p, x) / w2ev(q, x), hh = 1e-6 * Math.max(1, Math.abs(o.r));
          vert.push({ r: o.r, L: Math.sign(g(o.r - hh)), R: Math.sign(g(o.r + hh)) });
        }
      });
      return { p, q, holes, vert, cancelled };
    }
    function calc() {
      const A = w2parseCoefs(inP.value), B = w2parseCoefs(inQ.value);
      let err = A.err ? "Számláló: " + A.err : B.err ? "Nevező: " + B.err : B.zero ? "A nevező nem lehet azonosan 0 – adj meg legalább egy nem nulla együtthatót." : "";
      if (err) {
        st.innerHTML = "";
        msg.innerHTML = "⚠️ " + err; msg.style.color = css("--bad");
        cv.draw = () => C.plot(cv, { xmin: -sX.value, xmax: sX.value, ymin: -5, ymax: 5 }, []);
        cv.draw();
        return;
      }
      msg.style.color = "";
      const p0 = A.p, q0 = B.p;
      const { p, q, holes, vert, cancelled } = analyse(p0, q0);
      const g = x => w2ev(p, x) / w2ev(q, x);
      const dp = p.length - 1, dq = q.length - 1, lp = p[0], lq = q[0];
      const pZero = A.zero;
      // végtelenbeli viselkedés
      let asy = null, behTex;
      if (pZero || dp < dq) { asy = { m: 0, b: 0 }; behTex = "vízszintes: $y = 0$"; }
      else if (dp === dq) { asy = { m: 0, b: lp / lq }; behTex = `vízszintes: $y = ${texNum(lp / lq, 4)}$` + (dq === 0 ? " (a lyuktól eltekintve $f$ állandó)" : ""); }
      else if (dq === 0 && dp === 1) {
        behTex = `nincs külön aszimptota: a lyuktól eltekintve $f(x) = ${w2lin(lp / lq, p[1] / lq).slice(4)}$ maga egy egyenes`;
      } else if (dp === dq + 1) {
        const Q = w2divmod(p, q).q;
        asy = { m: Q[0], b: Q[1] };
        behTex = `ferde: $${w2lin(Q[0], Q[1])}$`;
      } else {
        const sP = Math.sign(lp / lq), sM = sP * ((dp - dq) % 2 ? -1 : 1);
        const inf = s => (s > 0 ? "+\\infty" : "-\\infty");
        behTex = `nincs: $x \\to +\\infty$: $${inf(sP)}$, $x \\to -\\infty$: $${inf(sM)}$`;
      }
      const ftex = `f(x) = \\dfrac{${w2polyTex(p0)}}{${w2polyTex(q0)}}`;
      const simp = cancelled ? ` = ${q.length === 1 ? w2polyTex(p.map(c => c / q[0])) : `\\dfrac{${w2polyTex(p)}}{${w2polyTex(q)}}`}` +
        (holes.length ? `\\ (x \\ne ${holes.map(o => texNum(o.r, 4)).join(", ")})` : "") : "";
      const inf = s => (s > 0 ? "+\\infty" : "-\\infty");
      statRow(st, [
        ["függvény", `<span style="font-size:1.05rem">${tex(ftex + simp)}</span>`],
        ["lyuk", holes.length ? holes.map(o => `$x = ${texNum(o.r, 4)}$, a határérték: $${texNum(o.val, 4)}$`).join("<br>") : "nincs"],
        ["függőleges aszimptota", vert.length ? vert.map(o => `<span style="white-space:nowrap">$x = ${texNum(o.r, 4)}$:</span> <span style="white-space:nowrap">$x \\to ${texNum(o.r, 4)}-$: $${inf(o.L)}$,</span> <span style="white-space:nowrap">$x \\to ${texNum(o.r, 4)}+$: $${inf(o.R)}$</span>`).join("<br>") : "nincs"],
        ["viselkedés $\\pm\\infty$-ben", behTex]
      ]);
      st.querySelectorAll(".v").forEach(e => { e.style.fontSize = "1rem"; e.style.fontWeight = "400"; e.style.fontFamily = "var(--font)"; e.style.overflowWrap = "anywhere"; });
      st.querySelectorAll(".stat").forEach(e => { e.style.flex = "1 1 14rem"; e.style.minWidth = "0"; });
      st.firstChild.style.flexBasis = "100%";
      msg.innerHTML = pZero ? "A számláló azonosan 0: ahol $f$ értelmezve van, ott $f(x) = 0$." :
        (vert.length || holes.length) ? `A nevező valós gyökei: ${[...holes, ...vert].map(o => o.r).sort((a, b) => a - b).map(r => "$" + texNum(r, 4) + "$").join(", ")}.` :
        "A nevezőnek nincs valós gyöke, így $f$ mindenütt értelmezve van: nincs lyuk és függőleges aszimptota.";
      window.Synopsis && Synopsis.renderMath(msg);

      // nézet
      const X = sX.value;
      const sing = [...vert.map(o => o.r)];
      const ys = [];
      for (let k = 0; k <= 1000; k++) {
        const x = -X + 2 * X * k / 1000;
        if (sing.some(r => Math.abs(x - r) < 0.03 * X)) continue;
        const y = g(x); if (Number.isFinite(y)) ys.push(y);
      }
      ys.sort((a, b) => a - b);
      const qt = t => ys.length ? ys[Math.min(ys.length - 1, Math.floor(t * (ys.length - 1)))] : 0;
      let lo = qt(0.05), hi = qt(0.95);
      [0, ...holes.map(o => o.val), ...(asy && asy.m === 0 ? [asy.b] : [])].forEach(y => { lo = Math.min(lo, y); hi = Math.max(hi, y); });
      const span = Math.max(hi - lo, 2);
      const view = { xmin: -X, xmax: X, ymin: lo - span * 0.45, ymax: hi + span * 0.45 };
      // görbedarabok a függőleges aszimptoták között
      const cuts = [-X, ...sing.filter(r => r > -X && r < X), X];
      cv.draw = () => {
        const L = [];
        vert.forEach(o => L.push({ vline: o.r, color: "--bad", dash: [6, 4], width: 1.6 }));
        if (asy && asy.m === 0) L.push({ hline: asy.b, color: "--ok", dash: [6, 4], width: 1.6 });
        else if (asy) L.push({ f: x => asy.m * x + asy.b, color: "--ok", dash: [6, 4], width: 1.6 });
        const eps = 1e-7 * X;
        for (let i = 0; i + 1 < cuts.length; i++) L.push({ f: g, color: "--accent", domain: [cuts[i] + (i ? eps : 0), cuts[i + 1] - (i + 2 < cuts.length ? eps : 0)] });
        L.push({ points: holes.map(o => [o.r, o.val]), color: "--accent", open: true, r: 5 });
        C.plot(cv, view, L);
      };
      cv.draw();
    }
    calc();
  };

  /* ------------------------------------------------------------------
     3.5-b  Szakadásvadász: sorold be!
     ------------------------------------------------------------------ */
  W["continuity-types"] = root => {
    header(root, "Szakadásvadász: sorold be!",
      "Nézd meg a grafikont az $a$ pont körül (halvány függőleges vonal), és döntsd el, milyen ott a függvény. Teli karika: a függvényérték; üres karika: „hiányzó” pont.");
    const TYPES = [["cont", "folytonos"], ["rem", "megszüntethető szakadás"], ["jump", "ugrás"], ["inf", "végtelen szakadás"], ["osc", "oszcilláló"]];
    const NAME = Object.fromEntries(TYPES);
    const sinv = x => Math.sin(1 / x);
    const B = [
      { t: "f(x) = \\operatorname{sgn} x", a: 0, v: [-2, 2, -1.7, 1.7], type: "jump",
        P: [[() => -1, -2, 0], [() => 1, 0, 2]], fill: [[0, 0]], open: [[0, -1], [0, 1]],
        why: "$\\lim\\limits_{x\\to 0-} \\operatorname{sgn} x = -1$, $\\lim\\limits_{x\\to 0+} \\operatorname{sgn} x = 1$, $f(0) = 0$: a két oldal véges, de különböző → <b>ugrás</b>." },
      { t: "f(x) = \\dfrac{x^2 - 1}{x - 1}", a: 1, v: [-1, 3, -0.6, 4.4], type: "rem",
        P: [[x => x + 1, -1, 3]], fill: [], open: [[1, 2]],
        why: "Ha $x \\ne 1$, akkor $\\frac{x^2-1}{x-1} = x + 1$, így $\\lim\\limits_{x\\to 1} f(x) = 2$ mindkét oldalról, de $f(1)$ nincs értelmezve → <b>megszüntethető</b>: legyen $f(1) := 2$." },
      { t: "g(x) = \\begin{cases} x + 1, & x \\ne 1 \\\\ 3, & x = 1 \\end{cases}", a: 1, v: [-1, 3, -0.6, 4.4], type: "rem",
        P: [[x => x + 1, -1, 3]], fill: [[1, 3]], open: [[1, 2]],
        why: "$\\lim\\limits_{x\\to 1} g(x) = 2$ (mindkét oldalról), de $g(1) = 3$ → <b>megszüntethető</b>: $g(1)$-et 2-re átírva folytonos lesz." },
      { t: "f(x) = \\begin{cases} \\frac1x, & x \\ne 0 \\\\ 0, & x = 0 \\end{cases}", a: 0, v: [-2, 2, -6, 6], type: "inf",
        P: [[x => 1 / x, -2, -1e-4], [x => 1 / x, 1e-4, 2]], fill: [[0, 0]], open: [],
        why: "$\\lim\\limits_{x\\to 0-} \\frac1x = -\\infty$, $\\lim\\limits_{x\\to 0+} \\frac1x = +\\infty$ → <b>végtelen szakadás</b>. Az $f(0) := 0$ megadás ezen nem segít." },
      { t: "f(x) = \\dfrac{1}{x^2}", a: 0, v: [-2, 2, -1, 8], type: "inf",
        P: [[x => 1 / (x * x), -2, -1e-4], [x => 1 / (x * x), 1e-4, 2]], fill: [], open: [],
        why: "$\\lim\\limits_{x\\to 0-} \\frac1{x^2} = \\lim\\limits_{x\\to 0+} \\frac1{x^2} = +\\infty$ → <b>végtelen szakadás</b>. Hiába egyezik a két oldal: a határérték nem véges, így $f(0)$ semmilyen megadása nem segít." },
      { t: "f(x) = \\sin\\dfrac1x", a: 0, v: [-0.5, 0.5, -1.6, 1.6], type: "osc",
        P: [[sinv, -0.5, -1e-6, 6000], [sinv, 1e-6, 0.5, 6000]], fill: [], open: [],
        why: "Az $x_n = \\frac{1}{2n\\pi} \\to 0+$ mentén $\\sin\\frac1{x_n} = 0$, az $x_n = \\frac{1}{\\pi/2 + 2n\\pi} \\to 0+$ mentén $1$ → a jobb oldali határérték sem létezik (balról ugyanígy) → <b>oszcilláló</b>." },
      { t: "f(x) = |x|", a: 0, v: [-2, 2, -0.8, 2.4], type: "cont",
        P: [[Math.abs, -2, 2]], fill: [[0, 0]], open: [],
        why: "$\\lim\\limits_{x\\to 0-} |x| = \\lim\\limits_{x\\to 0+} |x| = 0 = f(0)$ → <b>folytonos</b>. A csúcs nem szakadás (legfeljebb a deriválhatóság romlik el)." },
      { t: "f(x) = \\lfloor x \\rfloor \\ \\text{(egészrész)}", a: 2, v: [-0.5, 4.5, -1.5, 4.5], type: "jump",
        P: [-1, 0, 1, 2, 3, 4].map(k => [() => k, k, k + 1]), fill: [-1, 0, 1, 2, 3, 4].map(k => [k, k]), open: [-1, 0, 1, 2, 3, 4].map(k => [k + 1, k]),
        why: "$\\lim\\limits_{x\\to 2-} \\lfloor x \\rfloor = 1$, $\\lim\\limits_{x\\to 2+} \\lfloor x \\rfloor = 2$, $f(2) = 2$: a két oldal véges, de különböző → <b>ugrás</b>. (Jobbról folytonos, hiszen $f(2)$ a jobb oldali határértékkel egyezik.)" },
      { t: "f(x) = \\dfrac{\\sin x}{x}", a: 0, v: [-10, 10, -0.5, 1.4], type: "rem",
        P: [[x => Math.sin(x) / x, -10, 10]], fill: [], open: [[0, 1]],
        why: "$\\lim\\limits_{x\\to 0} \\frac{\\sin x}{x} = 1$, de $f(0)$ nincs értelmezve ($\\frac00$) → <b>megszüntethető</b>: legyen $f(0) := 1$." },
      { t: "f(x) = \\begin{cases} x^2, & x \\lt 1 \\\\ 2x - 1, & x \\ge 1 \\end{cases}", a: 1, v: [-1, 3, -0.6, 5.4], type: "cont",
        P: [[x => x * x, -1, 1], [x => 2 * x - 1, 1, 3]], fill: [[1, 1]], open: [],
        why: "Bal: $\\lim\\limits_{x\\to 1-} x^2 = 1$; jobb: $\\lim\\limits_{x\\to 1+} (2x - 1) = 1$; és $f(1) = 1$ → <b>folytonos</b> (a két darab „összeér”)." },
      { t: "f(x) = \\begin{cases} x + 1, & x \\lt 1 \\\\ x^2, & x \\ge 1 \\end{cases}", a: 1, v: [-1, 3, -0.6, 5.4], type: "jump",
        P: [[x => x + 1, -1, 1], [x => x * x, 1, 3]], fill: [[1, 1]], open: [[1, 2]],
        why: "Bal: $\\lim\\limits_{x\\to 1-} (x + 1) = 2$; jobb: $\\lim\\limits_{x\\to 1+} x^2 = 1 = f(1)$: véges, de különböző → <b>ugrás</b>." },
      { t: "f(x) = e^{1/x}", a: 0, v: [-2, 2, -1, 8], type: "inf",
        P: [[x => Math.exp(1 / x), -2, -1e-4], [x => Math.exp(1 / x), 1e-3, 2]], fill: [], open: [[0, 0]],
        why: "$\\lim\\limits_{x\\to 0-} e^{1/x} = 0$ (véges!), de $\\lim\\limits_{x\\to 0+} e^{1/x} = +\\infty$ → <b>végtelen szakadás</b>: elég, ha az egyik oldal végtelen." },
      { t: "f(x) = x \\sin\\dfrac1x", a: 0, v: [-0.5, 0.5, -0.45, 0.45], type: "rem",
        P: [[x => x * sinv(x), -0.5, -1e-6, 6000], [x => x * sinv(x), 1e-6, 0.5, 6000]], fill: [], open: [[0, 0]], squeeze: true,
        why: "$-|x| \\le x\\sin\\frac1x \\le |x|$ és $\\pm|x| \\to 0$, így a rendőrelv szerint $\\lim\\limits_{x\\to 0} x\\sin\\frac1x = 0$; $f(0)$ nincs értelmezve → <b>megszüntethető</b>: legyen $f(0) := 0$." }
    ];
    let order = [], pos = 0, score = 0, done = 0, answered = false;
    const qEl = h("div", { style: "font-size:1.1rem;margin:.3rem 0;overflow-wrap:anywhere" });
    const prog = h("div", { class: "muted", style: "font-size:.9rem" });
    root.append(h("div", { class: "controls", style: "justify-content:space-between" }, qEl, prog));
    const cv = C.canvas(root, 0.55);
    const btns = TYPES.map(([id, label]) => btn(label, () => answer(id)));
    root.append(h("div", { class: "controls", style: "gap:.35rem" }, ...btns));
    const fb = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6;overflow-wrap:anywhere;min-height:2.4em" });
    const next = btn("Következő →", () => { if (pos >= order.length) newRound(); else pos++; show(); }, "btn primary");
    root.append(fb, h("div", { class: "controls" }, next));
    const tbl = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.6rem", html:
      `<table style="font-size:.88rem"><thead><tr><th>típus</th><th>egyoldali határértékek</th><th>$f(a)$</th><th>folytonossá tehető $f(a)$ átírásával?</th></tr></thead><tbody>
      <tr><td>folytonos</td><td>mindkettő létezik, véges, egyenlő</td><td>értelmezve, és egyenlő velük</td><td>– (nincs szakadás)</td></tr>
      <tr><td>megszüntethető (elsőfajú)</td><td>mindkettő létezik, véges, egyenlő</td><td>nincs értelmezve vagy más</td><td>igen</td></tr>
      <tr><td>ugrás (elsőfajú)</td><td>mindkettő véges, de különböző</td><td>bármi</td><td>nem</td></tr>
      <tr><td>végtelen (másodfajú)</td><td>legalább az egyik $\\pm\\infty$</td><td>bármi</td><td>nem</td></tr>
      <tr><td>oszcilláló (másodfajú)</td><td>legalább az egyik nem létezik (se véges, se $\\pm\\infty$)</td><td>bármi</td><td>nem</td></tr>
      </tbody></table>` });
    root.append(tbl);

    function newRound() {
      order = B.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      pos = 0; score = 0; done = 0;
    }
    function draw(task) {
      cv.draw = () => {
        const [xmin, xmax, ymin, ymax] = task.v;
        const v = { xmin, xmax, ymin, ymax };
        const T = C.plot(cv, v, [{ vline: task.a, color: "--muted", dash: [3, 4], width: 1 }]);
        if (answered && task.squeeze) {
          w2curve(cv, T, v, x => Math.abs(x), xmin, xmax, 200, "--muted", 1.3, [5, 4]);
          w2curve(cv, T, v, x => -Math.abs(x), xmin, xmax, 200, "--muted", 1.3, [5, 4]);
        }
        task.P.forEach(([f, a, b, n]) => {
          const a2 = Math.max(a, xmin), b2 = Math.min(b, xmax);
          if (b2 > a2) w2curve(cv, T, v, f, a2, b2, n || Math.max(300, Math.round((T.tx(b2) - T.tx(a2)) * 2)), "--accent", 2.4);
        });
        const ctx = cv.ctx;
        const dot = (x, y, open) => {
          if (x < xmin || x > xmax) return;
          ctx.save(); ctx.strokeStyle = ctx.fillStyle = css("--accent"); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 5, 0, 2 * Math.PI);
          if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.stroke(); } else ctx.fill();
          ctx.restore();
        };
        task.open.forEach(([x, y]) => dot(x, y, true));
        task.fill.forEach(([x, y]) => dot(x, y, false));
        w2label(cv, T, task.a, ymin + (ymax - ymin) * 0.06, "a = " + fmt(task.a, 0), "--muted", "left", "600 12px system-ui, sans-serif");
      };
      cv.draw();
    }
    function show() {
      if (pos >= order.length) {
        qEl.innerHTML = "Kör vége!";
        prog.textContent = `Pont: ${score}/${done}`;
        fb.innerHTML = `Eredmény: <b>${score}/${done}</b>. ` + (score === done ? "Hibátlan! 🎉" : "Nézd át még egyszer a lenti táblázatot, és próbáld újra.");
        fb.style.color = "";
        btns.forEach(b => { b.disabled = true; b.classList.remove("on"); b.style.borderColor = ""; });
        next.textContent = "Új kör ↻";
        next.disabled = false; next.style.opacity = "";
        cv.draw = () => C.plot(cv, { xmin: -2, xmax: 2, ymin: -1, ymax: 1 }, []);
        cv.draw();
        return;
      }
      next.textContent = "Következő →";
      answered = false;
      const task = B[order[pos]];
      qEl.innerHTML = tex(task.t) + ` &nbsp;<span class="muted" style="font-size:.95rem">az ${tex("a = " + task.a)} pontban</span>`;
      prog.textContent = `Feladat ${pos + 1}/${order.length} · Pont: ${score}/${done}`;
      fb.innerHTML = "Melyik típus? Kattints egy gombra.";
      fb.style.color = css("--muted");
      btns.forEach(b => { b.disabled = false; b.classList.remove("on"); b.style.borderColor = ""; b.style.color = ""; });
      next.disabled = true; next.style.opacity = ".45";
      draw(task);
    }
    function answer(id) {
      if (answered) return;
      answered = true;
      const task = B[order[pos]], good = id === task.type;
      done++; if (good) score++;
      btns.forEach((b, i) => {
        b.disabled = true;
        if (TYPES[i][0] === task.type) { b.style.borderColor = css("--ok"); b.style.color = css("--ok"); b.classList.add("on"); }
        else if (TYPES[i][0] === id) { b.style.borderColor = css("--bad"); b.style.color = css("--bad"); }
      });
      fb.style.color = "";
      fb.innerHTML = (good ? `<b style="color:var(--ok)">✔ Helyes!</b> ` : `<b style="color:var(--bad)">✘ Nem – ez ${NAME[task.type]}.</b> `) + task.why;
      window.Synopsis && Synopsis.renderMath(fb);
      prog.textContent = `Feladat ${pos + 1}/${order.length} · Pont: ${score}/${done}`;
      next.disabled = false; next.style.opacity = "";
      if (pos + 1 >= order.length) next.textContent = "Eredmény →";
      draw(task);
    }
    newRound(); show();
    root._w2ct = { B, answer: id => answer(id), state: () => ({ pos, score, done, task: B[order[pos]] }) };
  };

  /* ------------------------------------------------------------------
     3.6-b  Intervallumfelezés lépésről lépésre
     ------------------------------------------------------------------ */
  W["bisection"] = root => {
    header(root, "Intervallumfelezés lépésről lépésre",
      "Ha $f$ folytonos az $[a; b]$-n, és $f(a)$, $f(b)$ ellentétes előjelű, akkor Bolzano tétele szerint van közöttük zérushely. Felezd az intervallumot, és mindig azt a felét tartsd meg, ahol az előjel vált!");
    const PRE = [
      ["x^3 - x - 1", "1", "2", "x^3 - x - 1"],
      ["cos(x) - x", "0", "pi/2", "\\cos x - x"],
      ["x^2 - 2", "1", "2", "x^2 - 2"],
      ["exp(x) - 3x", "0", "1", "e^x - 3x"]
    ];
    const inF = h("input", { type: "text", value: PRE[0][0], style: "width:min(12rem,60vw);font-family:var(--mono)", "aria-label": "f(x)" });
    const inA = h("input", { type: "text", value: "1", style: "width:4.5rem;font-family:var(--mono)", "aria-label": "a" });
    const inB = h("input", { type: "text", value: "2", style: "width:4.5rem;font-family:var(--mono)", "aria-label": "b" });
    const preBtns = PRE.map(([f, a, b, t]) => {
      const bt = h("button", { class: "btn", type: "button", html: tex(t) });
      bt.addEventListener("click", () => { inF.value = f; inA.value = a; inB.value = b; preBtns.forEach(x => x.classList.toggle("on", x === bt)); reset(); });
      return bt;
    });
    preBtns[0].classList.add("on");
    [inF, inA, inB].forEach(e => e.addEventListener("input", () => { preBtns.forEach(x => x.classList.remove("on")); reset(); }));
    const bStep = btn("Következő lépés", () => step(1), "btn primary");
    const b10 = btn("10 lépés", () => step(10));
    const bRe = btn("Újra", () => reset());
    let zoom = false;
    const bZoom = btn("🔍 ráközelítés", () => { zoom = !zoom; bZoom.classList.toggle("on", zoom); render(); });
    const selE = h("select", { "aria-label": "pontosság" }, ...[["0.1", "0,1"], ["0.01", "0,01"], ["0.001", "0,001"], ["0.000001", "0,000 001"]].map(([v, l]) => h("option", { value: v }, l)));
    selE.value = "0.001";
    selE.addEventListener("change", () => render());
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...preBtns),
      h("div", { class: "controls" }, h("label", null, "$f(x) =$", inF), h("label", null, "$a =$", inA), h("label", null, "$b =$", inB)),
      h("div", { class: "controls" }, bStep, b10, bRe, bZoom));
    const cv = C.canvas(root, 0.55);
    root.append(w2legend([["$f$ grafikonja", "--accent"], ["aktuális intervallum $[a_k; b_k]$", "--accent", "band"], ["$f \\lt 0$ (−)", "--setA", "line"], ["$f \\gt 0$ (+)", "--setB", "line"]]));
    const st = h("div");
    const msg = h("div", { class: "readout", style: "font-family:var(--font);overflow-wrap:anywhere" });
    const tw = h("div", { class: "tw", style: "overflow-x:auto;max-height:22rem;overflow-y:auto;margin-top:.6rem" });
    root.append(st, h("div", { class: "controls" }, h("label", null, "pontosság:", selE)), msg, tw);

    let F = null, A0, B0, a, b, rows = [], exact = null, bad = "";
    function num(s) {
      try { const v = C.parse(s, []).f({}); return Number.isFinite(v) ? v : NaN; } catch (e) { return NaN; }
    }
    function reset() {
      rows = []; exact = null; bad = "";
      const cf = compile(inF.value, ["x"]);
      A0 = num(inA.value); B0 = num(inB.value);
      F = cf.f;
      if (cf.err) bad = "Nem értem a képletet: " + cf.err + ".";
      else if (!Number.isFinite(A0) || !Number.isFinite(B0)) bad = "Az $a$ és a $b$ legyen szám (pl. <code>0</code>, <code>pi/2</code>).";
      else if (A0 >= B0) bad = "Kell, hogy $a \\lt b$ legyen.";
      else if (!Number.isFinite(F(A0)) || !Number.isFinite(F(B0))) bad = "$f$ nincs értelmezve valamelyik végpontban.";
      a = A0; b = B0;
      if (!bad) {
        if (F(a) === 0) exact = a;
        else if (F(b) === 0) exact = b;
        else if (F(a) * F(b) > 0) bad = "Bolzano tétele itt nem garantál zérushelyet: $f(a)$ és $f(b)$ azonos előjelű.";
      }
      render();
    }
    function step(n) {
      if (bad || exact != null) return;
      for (let i = 0; i < n && rows.length < 50; i++) {
        const m = (a + b) / 2, fm = F(m);
        if (!Number.isFinite(fm)) { bad = `$f$ nincs értelmezve az $m = ${texNum(m, 6)}$ pontban – folytonos-e $f$ az intervallumon?`; break; }
        const row = { k: rows.length + 1, a, b, m, fm };
        if (fm === 0) { exact = m; row.na = m; row.nb = m; rows.push(row); break; }
        if (F(a) * fm < 0) b = m; else a = m;
        row.na = a; row.nb = b;
        rows.push(row);
        if (b - a <= 4 * Number.EPSILON * Math.max(1, Math.abs(a))) break;
      }
      render();
    }
    function dec(len) { return Math.min(12, Math.max(4, Math.ceil(-Math.log10(len)) + 1)); }
    function render() {
      const eps = +selE.value;
      bStep.disabled = b10.disabled = !!bad || exact != null || rows.length >= 50;
      const len = b - a, d = dec(len || 1e-12), k = rows.length;
      if (!F) { st.innerHTML = ""; msg.innerHTML = "⚠️ " + bad; msg.style.color = css("--bad"); }
      else {
        const need = Number.isFinite(A0) && Number.isFinite(B0) && B0 > A0 ? Math.floor(Math.log2((B0 - A0) / eps) + 1e-12) + 1 : NaN;
        const items = [];
        if (exact != null) items.push(["zérushely", `$x = ${w2tfix(exact, dec(1e-6))}$ (pontosan)`]);
        else if (!bad) {
          items.push([`becslés: $\\frac{a_{${k}} + b_{${k}}}{2}$`, `$${w2tfix((a + b) / 2, d)}$`]);
          items.push([`hibakorlát: $\\frac{b_{${k}} - a_{${k}}}{2}$`, `$${w2tfix(len / 2, d)}$`]);
          items.push(["aktuális intervallum", `$[${w2tfix(a, d)};\\ ${w2tfix(b, d)}]$`]);
        }
        if (Number.isFinite(need)) items.push([`lépésszám ${fmt(eps, 6)} pontossághoz`, `$${Math.max(0, need)}$`]);
        statRow(st, items);
        st.querySelectorAll(".v").forEach(e => { e.style.fontSize = "1.05rem"; e.style.overflowWrap = "anywhere"; });
        const nd = Number.isFinite(need) ? `Hány lépés kell $h = ${texNum(eps, 6)}$ pontossághoz? $\\frac{b - a}{2^n} \\lt h \\iff n \\gt \\log_2\\frac{b - a}{h} = \\log_2 \\frac{${texNum(B0 - A0, 4)}}{${texNum(eps, 6)}} \\approx ${texNum(Math.log2((B0 - A0) / eps), 2)}$, tehát $n = ${Math.max(0, need)}$ lépés kell` +
          (k ? ` – most ${k} lépésnél tartasz, az intervallum hossza ${tex(w2tfix(len, d))}${len < eps ? " ✔" : ""}.` : ".") : "";
        msg.innerHTML = bad ? "⚠️ " + bad : exact != null && !rows.length ? `Telitalálat: a végpont maga zérushely, $f(${w2tfix(exact, 4)}) = 0$.` :
          exact != null ? `Telitalálat: $f(m_{${k}}) = 0$, megvan a zérushely.` :
          (k ? "" : `$f(a) = ${texNum(F(a), 6)}$, $f(b) = ${texNum(F(b), 6)}$: ellentétes előjelűek, mehet a felezés! `) + nd;
        msg.style.color = bad ? css("--bad") : "";
        window.Synopsis && Synopsis.renderMath(msg);
      }
      // táblázat
      if (rows.length) {
        const dd = r => dec(r.b - r.a) + 1;
        tw.innerHTML = `<table style="font-size:.85rem;white-space:nowrap"><thead><tr><th>$k$</th><th>$a_{k-1}$</th><th>$b_{k-1}$</th><th>$m_k$</th><th>$f(m_k)$</th><th>új intervallum $[a_k; b_k]$</th><th>hossza</th></tr></thead><tbody>` +
          rows.map(r => `<tr><td>${r.k}</td><td>${w2fix(r.a, dd(r))}</td><td>${w2fix(r.b, dd(r))}</td><td>${w2fix(r.m, dd(r))}</td>` +
            `<td style="color:var(${r.fm > 0 ? "--setB" : r.fm < 0 ? "--setA" : "--ok"})">${r.fm > 0 ? "+" : r.fm < 0 ? "−" : "0"} &nbsp;(${w2fix(r.fm, 6)})</td>` +
            `<td>[${w2fix(r.na, dd(r))}; ${w2fix(r.nb, dd(r))}]</td><td>${w2fix(r.nb - r.na, dd(r))}</td></tr>`).join("") + "</tbody></table>";
        window.Synopsis && Synopsis.renderMath(tw);
        tw.scrollTop = tw.scrollHeight;
      } else tw.innerHTML = "";
      // ábra
      cv.draw = () => {
        if (!F || !Number.isFinite(A0) || !Number.isFinite(B0) || B0 <= A0) { C.plot(cv, { xmin: -1, xmax: 1, ymin: -1, ymax: 1 }, []); return; }
        const z = zoom && rows.length ? [a, b] : [A0, B0];
        const pad = (z[1] - z[0]) * 0.15 || 1e-9;
        const xmin = z[0] - pad, xmax = z[1] + pad;
        const ys = [];
        for (let i = 0; i <= 300; i++) { const y = F(xmin + (xmax - xmin) * i / 300); if (Number.isFinite(y)) ys.push(y); }
        let [ylo, yhi] = yRange(ys.concat([0]), 0.12);
        const view = { xmin, xmax, ymin: ylo, ymax: yhi };
        const T = C.plot(cv, view, []);
        if (!bad) fillRects(cv, T, [{ x0: a, x1: b, y0: ylo, y1: yhi, color: "--accent", alpha: 0.13 }]);
        const ctx = cv.ctx;
        w2curve(cv, T, view, F, xmin, xmax, 900, "--accent", 2.4);
        const yAx = Math.min(Math.max(0, ylo), yhi);
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]);
        [a, b].forEach(x => { ctx.beginPath(); ctx.moveTo(T.tx(x), T.ty(ylo)); ctx.lineTo(T.tx(x), T.ty(yhi)); ctx.stroke(); });
        ctx.restore();
        if (rows.length > 1 && !zoom) rows.slice(0, -1).forEach(r => { ctx.save(); ctx.fillStyle = css("--muted"); ctx.beginPath(); ctx.arc(T.tx(r.m), T.ty(yAx), 2.5, 0, 7); ctx.fill(); ctx.restore(); });
        if (Number.isFinite(F(a)) && Number.isFinite(F(b))) {
          const off = (yhi - ylo) * 0.07;
          const sg = x => { const v = F(x); return v > 0 ? "+" : v < 0 ? "−" : "0"; };
          [a, b].forEach(x => {
            const s = sg(x), c = s === "+" ? "--setB" : s === "−" ? "--setA" : "--ok";
            const fy = F(x);
            if (Number.isFinite(fy) && fy >= ylo && fy <= yhi) {
              ctx.save(); ctx.fillStyle = css(c); ctx.beginPath(); ctx.arc(T.tx(x), T.ty(fy), 4.5, 0, 7); ctx.fill(); ctx.restore();
            }
            w2label(cv, T, x, yAx + (s === "+" ? off : -off), s, c, "center", "800 16px system-ui, sans-serif");
          });
          const m = exact != null ? exact : (a + b) / 2;
          if (bad) return;
          ctx.save(); ctx.fillStyle = css(exact != null ? "--ok" : "--text"); ctx.strokeStyle = css("--card"); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(T.tx(m), T.ty(yAx), 5, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
          w2label(cv, T, m, yAx - off * 2.2, exact != null ? "gyök" : "m", exact != null ? "--ok" : "--text", "center", "700 12px system-ui, sans-serif");
        }
      };
      cv.draw();
    }
    reset();
    root._w2bis = { state: () => ({ a, b, rows, exact, bad }) };
  };

  /* ------------------------------------------------------------------
     3.7-a  Hőmérő és térfogat: mennyire pontosan kell mérni?
     ------------------------------------------------------------------ */
  W["thermo-volume"] = root => {
    header(root, "Hőmérő és térfogat: mennyire pontosan kell mérni?",
      "1 kg víz térfogata a hőmérséklet függvényében. A hőmérőnk $\\delta$ pontosságú: a valódi $T_0$ helyett bármit mutathat a $[T_0 - \\delta; T_0 + \\delta]$ sávban. Elég-e ez ahhoz, hogy a térfogatot $\\varepsilon$ pontossággal megadjuk?");
    const ICE = 1091, K = 0.0075;
    const V = T => (T < 0 ? ICE : 1000 + K * (T - 4) * (T - 4));
    const Vw = T => 1000 + K * (T - 4) * (T - 4);
    /* a sávban felvett legkisebb és legnagyobb V */
    function range(T0, d) {
      const lo = T0 - d, hi = T0 + d, vals = [];
      if (lo < 0) vals.push(ICE);
      if (hi >= 0) { const a = Math.max(0, lo); vals.push(Vw(a), Vw(hi)); if (a <= 4 && 4 <= hi) vals.push(1000); }
      return [Math.min(...vals), Math.max(...vals)];
    }
    const worst = (T0, d) => { const [m, M] = range(T0, d), v = V(T0); return Math.max(M - v, v - m); };
    /* legnagyobb jó δ: null, ha nincs */
    function dstar(T0, eps) {
      if (Math.abs(T0) < 1e-9) return null;
      if (T0 < 0) return { d: -T0, why: "ice" };
      const werr = d => { const v = Vw(T0), vals = [Vw(T0 - d), Vw(T0 + d)]; if (T0 - d <= 4 && 4 <= T0 + d) vals.push(1000); return Math.max(...vals.map(x => Math.abs(x - v))); };
      let lo = 0, hi = 40;
      for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (werr(m) < eps) lo = m; else hi = m; }
      return lo >= T0 ? { d: T0, why: "jump", dw: lo } : { d: lo, why: "water" };
    }
    const sT = slider("valódi hőm. $T_0$ =", -5, 25, 0.1, 20, () => draw(), v => fmt(v, 1) + " °C");
    const sD = slider("hőmérő: $\\delta$ =", 0.01, 2, 0.01, 0.5, () => draw(), v => "±" + w2fix(v, 2) + " °C");
    [sT, sD].forEach(s => (s.el.style.width = "min(220px, 38vw)"));
    const selE = h("select", { "aria-label": "megengedett térfogathiba" }, ...[["0.01", "0,01"], ["0.1", "0,1"], ["1", "1"], ["10", "10"]].map(([v, l]) => h("option", { value: v }, l + " cm³")));
    selE.value = "0.1";
    selE.addEventListener("change", () => draw());
    root.append(h("div", { class: "controls" }, sT.wrap), h("div", { class: "controls" }, sD.wrap, h("label", null, "megengedett hiba $\\varepsilon$ =", selE)));
    const verdict = h("div", { style: "font-weight:700;font-size:1.05rem;margin:.4rem 0" });
    root.append(verdict);
    const cap1 = h("div", { class: "muted", style: "font-size:.85rem;margin-top:.3rem" }, "Teljes nézet (−5 … 25 °C):");
    root.append(cap1);
    const cv1 = C.canvas(root, 0.45);
    root.append(h("div", { class: "muted", style: "font-size:.85rem;margin-top:.5rem" }, "Nagyító: a $T_0$ környéke"));
    const cv2 = C.canvas(root, 0.45);
    root.append(w2legend([["$V(T)$", "--accent"], ["hőmérő-sáv $[T_0 - \\delta; T_0 + \\delta]$", "--setB", "band"], ["a sávon felvett $V$-értékek", "--accent", "band"], ["célsáv $V(T_0) \\pm \\varepsilon$", "--ok", "dash"]]));
    const st = h("div");
    const msg = h("div", { class: "readout", style: "font-family:var(--font);overflow-wrap:anywhere;line-height:1.6" });
    const note = h("details", { style: "margin-top:.6rem;font-size:.88rem" },
      h("summary", { class: "muted", style: "cursor:pointer" }, "ⓘ Mennyire pontos a modell?"),
      h("p", { html: "Egyszerűsített modell: jég ($T \\lt 0$): $V = 1091\\ \\text{cm}^3$; víz ($T \\ge 0$): $V = 1000 + 0{,}0075\\,(T - 4)^2\\ \\text{cm}^3$. A valódi értékek: jég 0 °C-on ≈ 1090,9 cm³, víz 0 °C-on ≈ 1000,16, 4 °C-on 1000,00, 20 °C-on 1001,80 cm³ – a modell ezeket kb. 0,1 cm³-re közelíti. A $T = 0$ pontot a víz ágához számoljuk: $V(0) = 1000{,}12$." }));
    root.append(st, msg, note);

    function draw() {
      const T0 = sT.value, d = sD.value, eps = +selE.value, V0 = V(T0);
      const [vm, vM] = range(T0, d), w = worst(T0, d), good = w < eps;
      verdict.innerHTML = good ? "✔ Elég pontos a hőmérő." : "✘ Nem elég pontos a hőmérő.";
      verdict.style.color = css(good ? "--ok" : "--bad");
      const ds = dstar(T0, eps);
      const wd = w >= 1 ? 2 : w >= 0.01 ? 4 : 6;
      statRow(st, [
        ["$V(T_0)$", w2fix(V0, 2) + " cm³"],
        ["legnagyobb hiba a sávon", w2fix(w, wd) + " cm³"],
        ["legnagyobb jó $\\delta^*$", ds ? w2fix(ds.d, 4) + " °C" : "nincs"]
      ]);
      st.querySelectorAll(".v").forEach(e => (e.style.fontSize = "1.1rem"));
      const epsT = texNum(eps, 2);
      let m = `A sávban $V$ a $[${w2tfix(vm, 4)};\\ ${w2tfix(vM, 4)}]$ tartományba esik, így a legrosszabb eset $\\max |V(T) - V(T_0)| = ${w2tfix(w, wd)} ${good ? "\\lt" : "\\ge"} \\varepsilon = ${epsT}$.<br>`;
      if (!ds) m += `<b>$T_0 = 0$ °C-nál nincs ilyen $\\delta$</b> – itt a függvény nem folytonos: bármilyen pontos hőmérő mellett lehet, hogy jég ($1091$ cm³), lehet, hogy víz ($1000{,}12$ cm³), a hiba legalább $90{,}88$ cm³.`;
      else if (ds.why === "ice") m += `Jég ágon a térfogat állandó, ezért csak az számít, hogy a sáv ne érje el a 0 °C-ot: $\\delta \\lt |T_0| = ${w2tfix(-T0, 1)}$ °C (a $\\delta^*$ itt felső határ, el nem érhető).`;
      else if (ds.why === "jump") m += `A víz ágon $\\delta \\approx ${w2tfix(ds.dw, 4)}$ °C is elég volna, de a sáv nem nyúlhat 0 °C alá (ott ugrik $V$), ezért $\\delta^* = T_0 = ${w2tfix(T0, 1)}$ °C.`;
      else m += `$\\delta \\lt \\delta^* \\approx ${w2tfix(ds.d, 4)}$ °C esetén elég pontos a hőmérő` + (Math.abs(T0 - 4) > 1e-9 ? ` (a parabola meredekebb oldala, a 4 °C-tól távolabbi irány korlátoz).` : ".");
      msg.innerHTML = m;
      window.Synopsis && Synopsis.renderMath(msg);

      const layersV = view => {
        const L = [];
        if (view.xmin < 0) L.push({ f: () => ICE, domain: [view.xmin, 0], color: "--accent" });
        if (view.xmax >= 0) L.push({ f: Vw, domain: [Math.max(0, view.xmin), view.xmax], color: "--accent" });
        L.push({ points: [[0, ICE]], color: "--accent", open: true });
        L.push({ points: [[0, Vw(0)]], color: "--accent" });
        return L;
      };
      const paint = (cv, view, yname) => {
        view.xname = "T"; view.yname = yname;
        const T = C.plot(cv, view, []);
        fillRects(cv, T, [{ x0: T0 - d, x1: T0 + d, y0: view.ymin, y1: view.ymax, color: "--setB", alpha: 0.16 }]);
        fillBand(cv, T, Math.max(view.ymin, vm), Math.min(view.ymax, vM), "--accent", 0.2);
        // a görbe, a pontok, a célsáv a sávok fölé (újra a C.plot-tal, átlátszó háttér nélkül nem megy, ezért kézzel)
        layersV(view).forEach(L => {
          if (L.f) w2curve(cv, T, view, L.f, L.domain[0], L.domain[1], 600, "--accent", 2.4);
          else L.points.forEach(([x, y]) => {
            if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) return;
            const ctx = cv.ctx; ctx.save(); ctx.strokeStyle = ctx.fillStyle = css("--accent"); ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 4.5, 0, 7);
            if (L.open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.stroke(); } else ctx.fill();
            ctx.restore();
          });
        });
        const ctx = cv.ctx;
        ctx.save(); ctx.strokeStyle = css("--ok"); ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]);
        [V0 - eps, V0 + eps].forEach(y => { if (y >= view.ymin && y <= view.ymax) { ctx.beginPath(); ctx.moveTo(0, T.ty(y)); ctx.lineTo(cv.w, T.ty(y)); ctx.stroke(); } });
        ctx.restore();
        ctx.save(); ctx.fillStyle = css("--text"); ctx.strokeStyle = css("--card"); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(T.tx(T0), T.ty(V0), 4, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
        return T;
      };
      cv1.draw = () => {
        const T = paint(cv1, { xmin: -5, xmax: 25, ymin: 995, ymax: 1095, ystep: 10, xstep: 5 }, "V (cm³)");
        w2label(cv1, T, -4.8, 1083, "jég", "--muted", "left", "600 12px system-ui, sans-serif");
        w2label(cv1, T, 14, 1000 + K * 100 + 8, "víz", "--muted", "center", "600 12px system-ui, sans-serif");
      };
      cv2.draw = () => {
        const hw = Math.max(2.5 * d, 0.3);
        const xmin = T0 - hw, xmax = T0 + hw;
        let lo = Math.min(vm, V0 - eps), hi = Math.max(vM, V0 + eps);
        // a görbe a nagyító szélén is látsszon (de jég–víz ugrásnál ne nyúljunk el feleslegesen)
        const span = Math.max(hi - lo, 2 * eps, 1e-3);
        const view = { xmin, xmax, ymin: lo - span * 0.35, ymax: hi + span * 0.35 };
        paint(cv2, view, "V (cm³)");
      };
      cv1.draw(); cv2.draw();
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
