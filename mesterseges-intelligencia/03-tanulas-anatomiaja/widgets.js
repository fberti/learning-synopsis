/* =========================================================
   Mesterséges intelligencia 3. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 2. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));

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
  const checkbox = (checked, onchange) => { const c = h("input", { type: "checkbox", onchange }); c.checked = checked; return c; };
  const math = el => window.Synopsis && Synopsis.renderMath(el);

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* vászon-koordináta egy egéreseményből */
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  /* két vászon egymás mellett (keskeny kijelzőn egymás alatt) */
  function twoCanvas(root, aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div"), R = h("div");
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspect, 380)];
  }
  /* törött vonal adatkoordinátákban */
  function polyline(ctx, T, pts, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, color, open = false) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
    ctx.restore();
  }

  /* ------------------------------------------------------------------
     Közös számolás: egyváltozós lineáris regresszió
     ------------------------------------------------------------------ */
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  const mse = (X, Y, w, b) => mean(X.map((x, i) => (w * x + b - Y[i]) ** 2));
  const mae = (X, Y, w, b) => mean(X.map((x, i) => Math.abs(w * x + b - Y[i])));
  function lsq(X, Y) {
    const mx = mean(X), my = mean(Y);
    let sxy = 0, sxx = 0;
    X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; });
    const w = sxx > 0 ? sxy / sxx : 0;
    return [w, my - w * mx];
  }
  function grad(X, Y, w, b) {
    let gw = 0, gb = 0;
    X.forEach((x, i) => { const e = w * x + b - Y[i]; gw += e * x; gb += e; });
    return [2 * gw / X.length, 2 * gb / X.length];
  }

  /* A futó példa: öt lakás */
  const FLAT_X = [20, 40, 50, 60, 80], FLAT_Y = [21, 35, 44, 51, 69];

  const W = {};

  /* ------------------------------------------------------------------
     3.3  fit-a-line – egyenes kézzel, hibanégyzetekkel
     ------------------------------------------------------------------ */
  W["fit-a-line"] = root => {
    header(root, "Illessz egyenest – és nézd a hibák négyzetét!",
      "Állítsd a csúszkákkal a súlyt ($w$) és az eltolást ($b$). A piros szakaszok a hibák, a halvány négyzetek a hibák <b>négyzetei</b> – " +
      "az MSE ezek területének átlaga. A pontokat <b>húzhatod</b> is. Próbáld meg kézzel minél kisebbre vinni az MSE-t, aztán nézd meg a legjobbat!");
    let pts = FLAT_X.map((x, i) => [x, FLAT_Y[i]]), w = 0.7, b = 10, showSq = true, drag = -1;
    const sw = slider(0, 1.6, 0.01, w), lw = h("b"), sb = slider(-30, 40, 0.1, b), lb = h("b");
    sw.addEventListener("input", () => { w = +sw.value; sync(); });
    sb.addEventListener("input", () => { b = +sb.value; sync(); });
    root.append(
      h("div", { class: "controls" }, h("label", null, "w =", sw, lw), h("label", null, "b =", sb, lb)),
      h("div", { class: "controls" },
        btn("⭐ Legjobb egyenes", () => { [w, b] = lsq(pts.map(p => p[0]), pts.map(p => p[1])); sync(); }, "btn primary"),
        btn("A: (0,7; 10)", () => { w = 0.7; b = 10; sync(); }),
        btn("B: (1; −5)", () => { w = 1; b = -5; sync(); }),
        btn("C: (0; 44)", () => { w = 0; b = 44; sync(); }),
        btn("➕ Kiugró pont (70 m², 30 M)", () => { if (pts.length < 6) pts.push([70, 30]); sync(); }),
        btn("↺ Az öt lakás", () => { pts = FLAT_X.map((x, i) => [x, FLAT_Y[i]]); sync(); }),
        h("label", null, checkbox(showSq, e => { showSq = e.target.checked; draw(); }), "négyzetek")));
    const cv = Calc.canvas(root, 0.6);
    const out = h("div", { class: "readout" });
    root.append(out);
    const view = { xmin: -4, xmax: 100, ymin: -6, ymax: 90, xstep: 20, ystep: 20, xname: "m²", yname: "ár (M Ft)" };
    let T = null;
    function draw() {
      T = Calc.plot(cv, view, [{ f: x => w * x + b, color: "--accent", width: 2.6 }]);
      const { ctx } = cv;
      pts.forEach(([x, y]) => {
        const py = T.ty(y), pq = T.ty(w * x + b), s = Math.abs(pq - py);
        if (showSq && s > 0.5) {
          ctx.save(); ctx.fillStyle = css("--bad"); ctx.globalAlpha = 0.13;
          ctx.fillRect(T.tx(x), Math.min(py, pq), s, s);
          ctx.globalAlpha = 0.5; ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1;
          ctx.strokeRect(T.tx(x), Math.min(py, pq), s, s); ctx.restore();
        }
        ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(T.tx(x), py); ctx.lineTo(T.tx(x), pq); ctx.stroke(); ctx.restore();
      });
      pts.forEach(([x, y], i) => dot(ctx, T.tx(x), T.ty(y), i === drag ? 7 : 5.5, css("--setB")));
    }
    cv.draw = draw;
    function sync() {
      sw.value = w; sb.value = b; lw.textContent = fmt(w, 3); lb.textContent = fmt(b, 2);
      const X = pts.map(p => p[0]), Y = pts.map(p => p[1]);
      const e = X.map((x, i) => w * x + b - Y[i]);
      const m = mse(X, Y, w, b), [bw, bb] = lsq(X, Y), best = mse(X, Y, bw, bb);
      out.innerHTML = `modell: <b>ŷ = ${fmt(w, 3)}·x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b), 2)}</b><br>` +
        `hibák (ŷ − y): ${e.map(v => fmt(v, 1)).join("; ")} · átlaguk: ${fmt(mean(e), 2)}<br>` +
        `MSE = <b>${fmt(m, 2)}</b> · RMSE = ${fmt(Math.sqrt(m), 2)} M Ft · MAE = ${fmt(mae(X, Y, w, b), 2)} M Ft<br>` +
        `<span class="muted">a legjobb egyenes (legkisebb négyzetek): ŷ = ${fmt(bw, 3)}·x ${bb < 0 ? "−" : "+"} ${fmt(Math.abs(bb), 2)}, MSE = ${fmt(best, 2)}` +
        (m - best < 0.01 ? " – megtaláltad! 🎉" : "") + `</span>`;
      draw();
    }
    const near = (px, py) => {
      let k = -1, dmin = 14;
      pts.forEach(([x, y], i) => { const d = Math.hypot(T.tx(x) - px, T.ty(y) - py); if (d < dmin) { dmin = d; k = i; } });
      return k;
    };
    cv.c.addEventListener("pointerdown", e => {
      if (!T) return;
      const [px, py] = evXY(cv, e);
      drag = near(px, py);
      if (drag >= 0) { cv.c.setPointerCapture(e.pointerId); draw(); }
    });
    cv.c.addEventListener("pointermove", e => {
      if (drag < 0 || !T) return;
      const [px, py] = evXY(cv, e);
      pts[drag] = [Math.max(0, Math.min(98, Math.round(T.ix(px)))), Math.max(0, Math.min(88, Math.round(T.iy(py))))];
      sync();
    });
    const end = () => { if (drag >= 0) { drag = -1; draw(); } };
    cv.c.addEventListener("pointerup", end);
    cv.c.addEventListener("pointercancel", end);
    sync();
  };

  /* ------------------------------------------------------------------
     3.3 / 3.4 / 3.6  loss-landscape – a veszteségfelület és a gradiens módszer útja
     data-preset: "raw" (lakások, nyers m²) · "small" (kis adat) · "std" (lakások, standardizált)
     ------------------------------------------------------------------ */
  const LL = {
    small: {
      name: "kis adat: (1; 2), (2; 5), (3; 5)", X: [1, 2, 3], Y: [2, 5, 5], wn: "w", bn: "b", xn: "x", yn: "y",
      view: { xmin: -0.6, xmax: 3, ymin: -1.6, ymax: 3.2 }, data: { xmin: -0.3, xmax: 4, ymin: -1, ymax: 8 },
      eta: [0.005, 0.2, 0.005, 0.05], d0: 0.06, speed: 1, max: 300, digits: 3
    },
    raw: {
      name: "lakások – nyers m²", X: FLAT_X, Y: FLAT_Y, wn: "w", bn: "b", xn: "m²", yn: "ár",
      view: { xmin: -0.1, xmax: 1.7, ymin: -40, ymax: 50 }, data: { xmin: -4, xmax: 100, ymin: -6, ymax: 90 },
      eta: [0.00001, 0.00036, 0.00001, 0.0003], d0: 0.5, speed: 150, max: 40000, digits: 5
    },
    std: {
      name: "lakások – standardizált m² (z)", X: FLAT_X.map(x => (x - 50) / 20), Y: FLAT_Y, wn: "a", bn: "c", xn: "z", yn: "ár",
      view: { xmin: -10, xmax: 60, ymin: -6, ymax: 53.5 }, data: { xmin: -2, xmax: 2, ymin: -6, ymax: 90 },   // egyenlő lépték (0,85-ös vászon): kerek tál kereknek látszik
      eta: [0.01, 1.1, 0.01, 0.1], d0: 1, speed: 1, max: 300, digits: 2
    }
  };
  W["loss-landscape"] = root => {
    let key = LL[root.dataset.preset] ? root.dataset.preset : "small";
    header(root, "A veszteségfelület – és a gradiens módszer útja rajta",
      "Bal oldalt a $(w, b)$ paramétersík: minden pont egy egyenes, a szintvonalak az azonos MSE-jű pontokat kötik össze, a ★ a tál alja. " +
      "<b>Kattints</b> a síkra egy beállítás kiválasztásához – jobb oldalt megjelenik a hozzá tartozó egyenes. Aztán lépj a gradiens módszerrel! " +
      "Hasonlítsd össze a három adatkészletet: a nyers négyzetméteres völgy keskeny és hosszú, a standardizált kerek.");
    let P, A, opt, Lmin, eig, eta, start = [0, 0], path = [], timer = null;
    const sel = h("select");
    Object.entries(LL).forEach(([k, v]) => sel.append(h("option", { value: k }, v.name)));
    sel.onchange = () => { stop(); key = sel.value; setup(); reset(); };
    const se = slider(0, 1, 0.001, 0), le = h("b");
    se.addEventListener("input", () => { eta = +se.value; stop(); reset(); });
    const bRun = btn("▶ Futtatás", () => run());
    root.append(h("div", { class: "controls" }, h("label", null, "adat:", sel), h("label", null, "η =", se, le)),
      h("div", { class: "controls" }, btn("➜ Egy lépés", () => { stop(); step(1); }, "btn primary"), bRun,
        btn("↺ Újra (0; 0)-ból", () => { stop(); start = [0, 0]; reset(); }),
        btn("⭐ Ugrás a minimumba", () => { stop(); start = opt.slice(); reset(); })));
    const [cvL, cvR] = twoCanvas(root, 0.85);
    const out = h("div", { class: "readout" });
    root.append(out);
    let TL = null;
    function setup() {
      P = LL[key];
      const n = P.X.length, sx = P.X.reduce((s, x) => s + x, 0), sxx = P.X.reduce((s, x) => s + x * x, 0);
      A = [[sxx / n, sx / n], [sx / n, 1]];                       // L − Lmin = dᵀ A d
      opt = lsq(P.X, P.Y); Lmin = mse(P.X, P.Y, ...opt);
      const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] ** 2, disc = Math.sqrt(tr * tr / 4 - det);
      const m1 = tr / 2 + disc, m2 = tr / 2 - disc;
      const v1 = Math.abs(A[0][1]) > 1e-12 ? [m1 - A[1][1], A[0][1]] : [1, 0], n1 = Math.hypot(...v1);
      const u1 = [v1[0] / n1, v1[1] / n1], u2 = [-u1[1], u1[0]];
      eig = { m1, m2, u1, u2 };
      se.min = P.eta[0]; se.max = P.eta[1]; se.step = P.eta[2]; eta = P.eta[3];
      sel.value = key;
    }
    const Lf = ([w, b]) => mse(P.X, P.Y, w, b);
    function drawL() {
      const v = Object.assign({ xname: P.wn, yname: P.bn }, P.view);
      TL = Calc.plot(cvL, v, []);
      const { ctx } = cvL, { tx, ty } = TL;
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.2;
      for (let k = 0; k < 16; k++) {
        const dl = P.d0 * Math.pow(2, k), r1 = Math.sqrt(dl / eig.m1), r2 = Math.sqrt(dl / eig.m2);
        ctx.globalAlpha = Math.max(0.2, 0.9 - k * 0.05);
        ctx.beginPath();
        for (let j = 0; j <= 240; j++) {
          const t = 2 * Math.PI * j / 240, c = Math.cos(t), s = Math.sin(t);
          const w = opt[0] + r1 * c * eig.u1[0] + r2 * s * eig.u2[0], b = opt[1] + r1 * c * eig.u1[1] + r2 * s * eig.u2[1];
          j ? ctx.lineTo(tx(w), ty(b)) : ctx.moveTo(tx(w), ty(b));
        }
        ctx.stroke();
      }
      ctx.restore();
      // csillag a minimumban
      ctx.save(); ctx.fillStyle = css("--setB"); ctx.font = "700 18px system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("★", tx(opt[0]), ty(opt[1])); ctx.restore();
      // az út (sok lépésnél ritkítva)
      const ok = p => Math.abs(p[0]) < 1e6 && Math.abs(p[1]) < 1e6;
      const vis = path.filter(ok), stride = Math.max(1, Math.ceil(vis.length / 1500));
      const thin = vis.filter((_, i) => i % stride === 0 || i === vis.length - 1);
      polyline(ctx, TL, thin, css("--bad"), 1.6);
      if (thin.length < 80) thin.forEach(([w, b]) => dot(ctx, tx(w), ty(b), 3, css("--bad")));
      const cur = path[path.length - 1];
      if (ok(cur)) dot(ctx, tx(cur[0]), ty(cur[1]), 6, css("--setB"));
    }
    function drawR() {
      const cur = path[path.length - 1], good = Math.abs(cur[0]) < 1e6 && Math.abs(cur[1]) < 1e6;
      const v = Object.assign({ xname: P.xn, yname: P.yn }, P.data);
      const layers = [{ f: x => opt[0] * x + opt[1], color: "--muted", dash: [5, 4], width: 1.5 }];
      if (good) layers.push({ f: x => cur[0] * x + cur[1], color: "--accent", width: 2.6 });
      const T = Calc.plot(cvR, v, layers);
      P.X.forEach((x, i) => dot(cvR.ctx, T.tx(x), T.ty(P.Y[i]), 5, css("--setB")));
    }
    function draw() { drawL(); drawR(); }
    cvL.draw = drawL; cvR.draw = drawR;
    function info() {
      se.value = eta; le.textContent = fmt(eta, P.digits);
      const cur = path[path.length - 1], k = path.length - 1;
      const big = !(Math.abs(cur[0]) < 1e6 && Math.abs(cur[1]) < 1e6);
      const L = big ? Infinity : Lf(cur), g = big ? [NaN, NaN] : grad(P.X, P.Y, ...cur);
      const etaMax = 1 / eig.m1, slow = 1 - 2 * eta * eig.m2;
      let note;
      if (big || eta >= etaMax) note = `💥 η túl nagy: ennél az adatnál a határ η &lt; ${fmt(etaMax, P.digits + 1)}.`;
      else if (k > 0 && L - Lmin < 1e-4 * Math.max(1, Lmin)) note = `✅ Célba ért: ${k} lépés.`;
      else note = `Stabil (η &lt; ${fmt(etaMax, P.digits + 1)}). A völgy lapos irányában a távolság lépésenként ${fmt(slow, 5)}-szorosára csökken` +
        (slow > 0.999 ? " – ez nagyon lassú." : ".");
      out.innerHTML = `lépés: <b>${k}</b> · ${P.wn} = <b>${big ? "∞" : fmt(cur[0], 4)}</b> · ${P.bn} = <b>${big ? "∞" : fmt(cur[1], 3)}</b> · ` +
        `MSE = <b>${big ? "∞" : fmt(L, 3)}</b> · gradiens = (${big ? "–" : fmt(g[0], 3) + "; " + fmt(g[1], 3)})<br>` +
        `<span class="muted">a tál alja: ${P.wn} = ${fmt(opt[0], 3)}, ${P.bn} = ${fmt(opt[1], 3)}, MSE = ${fmt(Lmin, 3)} · ${note}</span>`;
      return big;
    }
    function reset() { path = [start.slice()]; draw(); info(); }
    function step(nSteps) {
      let p = path[path.length - 1];
      for (let i = 0; i < nSteps; i++) {
        if (!(Math.abs(p[0]) < 1e6 && Math.abs(p[1]) < 1e6)) break;
        const g = grad(P.X, P.Y, ...p);
        p = [p[0] - eta * g[0], p[1] - eta * g[1]];
        path.push(p);
        if (Lf(p) - Lmin < 1e-4 * Math.max(1, Lmin)) break;
      }
      draw();
      const big = info(), L = big ? Infinity : Lf(path[path.length - 1]);
      return big || L - Lmin < 1e-4 * Math.max(1, Lmin) || path.length > P.max;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bRun.textContent = "▶ Futtatás"; } }
    function run() {
      if (timer) return stop();
      bRun.textContent = "⏸ Állj!";
      timer = setInterval(() => { if (step(P.speed)) stop(); }, 60);
    }
    cvL.c.addEventListener("pointerdown", e => {
      if (!TL) return;
      const [px, py] = evXY(cvL, e);
      stop();
      start = [TL.ix(px), TL.iy(py)];
      reset();
    });
    setup(); reset();
  };

  /* ------------------------------------------------------------------
     3.4  best-constant – a legjobb konstans: átlag (MSE) és medián (MAE)
     ------------------------------------------------------------------ */
  W["best-constant"] = root => {
    header(root, "Melyik szám a legjobb tipp mindenkire?",
      "A konstans modell ($\\hat y = c$) mindenkinek ugyanazt mondja. Mozgasd $c$-t, és figyeld a két veszteséget! " +
      "Az MSE alja az <b>átlagnál</b>, a MAE alja a <b>mediánnál</b> van. Adj hozzá kiugró értéket, és nézd, melyik mozdul el!");
    const SETS = { "2; 4; 9": [2, 4, 9], "2; 4; 9; 45 (kiugró)": [2, 4, 9, 45], "lakásárak": FLAT_Y.slice() };
    let ys = SETS["2; 4; 9"].slice(), c = 3;
    const inp = h("input", { type: "text", value: "2; 4; 9", size: 22 });
    const err = h("span", { class: "muted" });
    inp.addEventListener("change", () => {
      const v = inp.value.split(/[;\s]+/).filter(Boolean).map(s => +s.replace(",", "."));
      if (v.length < 1 || v.length > 12 || v.some(x => !Number.isFinite(x))) { err.textContent = "1–12 számot adj meg, pontosvesszővel elválasztva."; return; }
      err.textContent = ""; ys = v; c = Math.round(mean(ys)); fit(); sync();
    });
    const sc = slider(0, 10, 0.1, c), lc = h("b");
    sc.addEventListener("input", () => { c = +sc.value; sync(); });
    const ctr = h("div", { class: "controls" });
    Object.entries(SETS).forEach(([k, v]) => ctr.append(btn(k, () => { ys = v.slice(); inp.value = k.replace(" (kiugró)", ""); c = ys[0]; fit(); sync(); })));
    root.append(ctr, h("div", { class: "controls" }, h("label", null, "címkék:", inp), err),
      h("div", { class: "controls" }, h("label", null, "c =", sc, lc),
        btn("→ átlag", () => { c = mean(ys); sync(); }), btn("→ medián", () => { c = med(ys); sync(); })));
    const [cv1, cv2] = twoCanvas(root, 0.75);
    const out = h("div", { class: "readout" });
    root.append(out);
    const med = a => { const s = a.slice().sort((p, q) => p - q), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
    const Lmse = v => mean(ys.map(y => (v - y) ** 2)), Lmae = v => mean(ys.map(y => Math.abs(v - y)));
    let lo = 0, hi = 10;
    function fit() {
      const mn = Math.min(...ys), mx = Math.max(...ys), pad = Math.max(1, (mx - mn) * 0.15);
      lo = mn - pad; hi = mx + pad;
      sc.min = lo.toFixed(1); sc.max = hi.toFixed(1); sc.step = ((hi - lo) / 400).toPrecision(2);
    }
    function panel(cv, f, name, mark, markName, col) {
      const top = Math.max(f(lo), f(hi)) * 1.08;
      const T = Calc.plot(cv, { xmin: lo, xmax: hi, ymin: -top * 0.08, ymax: top, xname: "c", yname: name },
        [{ f, color: col, width: 2.6 }, { vline: mark, color: "--muted", dash: [5, 4] }]);
      const { ctx } = cv;
      ys.forEach(y => dot(ctx, T.tx(y), T.ty(0), 4.5, css("--setB")));
      dot(ctx, T.tx(c), T.ty(f(c)), 6, css("--bad"));
      ctx.save(); ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textBaseline = "top";
      ctx.fillText(markName, Math.min(cv.w - 70, T.tx(mark) + 5), 18); ctx.restore();
    }
    cv1.draw = () => panel(cv1, Lmse, "MSE(c)", mean(ys), "átlag", "--accent");
    cv2.draw = () => panel(cv2, Lmae, "MAE(c)", med(ys), "medián", "--setC");
    function sync() {
      sc.value = c; lc.textContent = fmt(c, 2);
      cv1.draw(); cv2.draw();
      out.innerHTML = `címkék: ${ys.map(y => fmt(y, 2)).join("; ")} · átlag = <b>${fmt(mean(ys), 3)}</b> · medián = <b>${fmt(med(ys), 3)}</b><br>` +
        `c = ${fmt(c, 2)}: MSE = <b>${fmt(Lmse(c), 3)}</b> (legkisebb: ${fmt(Lmse(mean(ys)), 3)}) · ` +
        `MAE = <b>${fmt(Lmae(c), 3)}</b> (legkisebb: ${fmt(Lmae(med(ys)), 3)})`;
    }
    fit(); sync();
  };

  /* ------------------------------------------------------------------
     3.4  learning-rate-lab – három tanulási ráta egymás mellett
     ------------------------------------------------------------------ */
  W["learning-rate-lab"] = root => {
    header(root, "Tanulásiráta-labor: ugyanaz a feladat, három lépésköz",
      "A kis adaton – $(1;\\,2)$, $(2;\\,5)$, $(3;\\,5)$ – $(0;\\,0)$-ból indítjuk a gradiens módszert három különböző $\\eta$-val, és a veszteséget rajzoljuk " +
      "a lépésszám függvényében. A szaggatott vonal a legkisebb elérhető MSE (0,5). Keresd meg, hol kezd szétszállni!");
    const X = [1, 2, 3], Y = [2, 5, 5];
    const COLS = ["--setC", "--accent", "--bad"];
    let etas = [0.01, 0.1, 0.19], K = 40;
    const sl = etas.map((e, i) => {
      const s = slider(0.005, 0.25, 0.005, e);
      s.addEventListener("input", () => { etas[i] = +s.value; sync(); });
      return s;
    });
    const ls = etas.map(() => h("b"));
    const sk = slider(10, 120, 5, K), lk = h("b");
    sk.addEventListener("input", () => { K = +sk.value; sync(); });
    const sw = i => h("span", { style: `display:inline-block;width:12px;height:12px;border-radius:3px;background:var(${COLS[i]})` });
    root.append(h("div", { class: "controls" }, ...etas.map((_, i) => h("label", null, sw(i), `η${i + 1} =`, sl[i], ls[i]))),
      h("div", { class: "controls" }, h("label", null, "lépések:", sk, lk),
        btn("alapbeállítás (0,01 / 0,1 / 0,19)", () => { etas = [0.01, 0.1, 0.19]; sync(); })));
    const cv = Calc.canvas(root, 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);
    function runGD(eta) {
      let w = 0, b = 0;
      const L = [mse(X, Y, w, b)];
      for (let k = 0; k < K; k++) {
        const g = grad(X, Y, w, b);
        w -= eta * g[0]; b -= eta * g[1];
        L.push(mse(X, Y, w, b));
      }
      return { L, w, b };
    }
    function draw() {
      const T = Calc.plot(cv, { xmin: -K * 0.03, xmax: K * 1.02, ymin: -1, ymax: 20, xname: "lépés", yname: "MSE" },
        [{ hline: 0.5, color: "--muted", dash: [5, 4] }]);
      etas.forEach((eta, i) => {
        const { L } = runGD(eta);
        polyline(cv.ctx, T, L.map((v, k) => [k, Math.min(v, 30)]), css(COLS[i]), 2.4);
      });
    }
    cv.draw = draw;
    function sync() {
      etas.forEach((e, i) => { sl[i].value = e; ls[i].textContent = fmt(e, 3); });
      sk.value = K; lk.textContent = K;
      draw();
      out.innerHTML = etas.map((eta, i) => {
        const { L, w, b } = runGD(eta), last = L[L.length - 1];
        const hit = L.findIndex(v => v < 0.51);
        const div = !Number.isFinite(last) || last > L[0];
        return `<span style="color:var(${COLS[i]})">■</span> η = ${fmt(eta, 3)}: ` +
          (div ? `<b>💥 szétszáll</b> (MSE ${K} lépés után: ${Number.isFinite(last) ? fmt(last, 1) : "∞"})`
            : `MSE ${K} lépés után: <b>${fmt(last, 4)}</b> · (w; b) = (${fmt(w, 3)}; ${fmt(b, 3)}) · ` +
              (hit >= 0 ? `0,51 alá: ${hit}. lépésben` : `még nem ment 0,51 alá`));
      }).join("<br>") + `<br><span class="muted">Ennél az adatnál a stabilitás határa η ≈ 0,180.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     3.5  polyfit-overfit – polinomillesztés: alul- és túlillesztés
     ------------------------------------------------------------------ */
  /* Adat: y = sin(2πx) + zaj (σ = 0,25), két decimálisra kerekítve – a szövegbeli táblázat ugyanebből készült. */
  const PF = {
    xtr: Array.from({ length: 10 }, (_, k) => k / 9),
    ytr: [0.14, 0.7, 0.97, 0.29, 0.45, -0.87, -0.64, -0.83, -0.44, 0.21],
    xte: [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95],
    yte: [0.38, 0.68, 0.92, 1.19, 0.16, -0.37, -0.99, -1.13, -0.89, -0.24]
  };
  /* legkisebb négyzetek Householder-QR-rel, a t = 2x − 1 változóban (stabil a 9. fokig is) */
  function polyfit(xs, ys, deg) {
    const m = xs.length, n = deg + 1;
    const A = xs.map(x => { const t = 2 * x - 1; return Array.from({ length: n }, (_, j) => Math.pow(t, j)); });
    const y = ys.slice();
    for (let k = 0; k < n; k++) {
      let norm = 0;
      for (let i = k; i < m; i++) norm += A[i][k] ** 2;
      norm = Math.sqrt(norm);
      if (norm === 0) continue;
      const alpha = A[k][k] > 0 ? -norm : norm;
      const v = Array(m).fill(0);
      v[k] = A[k][k] - alpha;
      for (let i = k + 1; i < m; i++) v[i] = A[i][k];
      const vv = v.reduce((s, q) => s + q * q, 0);
      if (vv === 0) continue;
      for (let j = k; j < n; j++) {
        let s = 0; for (let i = k; i < m; i++) s += v[i] * A[i][j];
        const f = 2 * s / vv; for (let i = k; i < m; i++) A[i][j] -= f * v[i];
      }
      let s = 0; for (let i = k; i < m; i++) s += v[i] * y[i];
      const f = 2 * s / vv; for (let i = k; i < m; i++) y[i] -= f * v[i];
    }
    const c = Array(n).fill(0);
    for (let k = n - 1; k >= 0; k--) {
      let s = y[k]; for (let j = k + 1; j < n; j++) s -= A[k][j] * c[j];
      c[k] = s / A[k][k];
    }
    return x => { const t = 2 * x - 1; let r = 0; for (let j = n - 1; j >= 0; j--) r = r * t + c[j]; return r; };
  }
  W["polyfit-overfit"] = root => {
    header(root, "Polinomillesztés: kevés, éppen jó, túl sok",
      "10 tanító pont (teli) és 10 teszt pont (üres) ugyanabból a zajos, hullámzó összefüggésből. A csúszkával a polinom fokszámát állítod; az illesztés " +
      "mindig csak a <b>tanító</b> pontokat látja. Jobb oldalt a tanító- és a teszthiba a fokszám függvényében.");
    let deg = 1, showTest = true, showTrue = false;
    const sd = slider(0, 9, 1, deg), ld = h("b");
    sd.addEventListener("input", () => { deg = +sd.value; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "fokszám:", sd, ld),
      btn("1", () => { deg = 1; sync(); }), btn("3", () => { deg = 3; sync(); }), btn("9", () => { deg = 9; sync(); }),
      h("label", null, checkbox(showTest, e => { showTest = e.target.checked; sync(); }), "teszt pontok"),
      h("label", null, checkbox(showTrue, e => { showTrue = e.target.checked; sync(); }), "a valódi összefüggés")));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const out = h("div", { class: "readout" });
    root.append(out);
    const fits = [], TR = [], TE = [];
    for (let d = 0; d <= 9; d++) {
      const f = polyfit(PF.xtr, PF.ytr, d);
      fits.push(f);
      TR.push(mean(PF.xtr.map((x, i) => (f(x) - PF.ytr[i]) ** 2)));
      TE.push(mean(PF.xte.map((x, i) => (f(x) - PF.yte[i]) ** 2)));
    }
    function drawL() {
      const layers = [];
      if (showTrue) layers.push({ f: x => Math.sin(2 * Math.PI * x), color: "--muted", dash: [5, 4], width: 1.5, domain: [0, 1] });
      layers.push({ f: fits[deg], color: "--accent", width: 2.6, domain: [0, 1] });
      const T = Calc.plot(cvL, { xmin: -0.06, xmax: 1.06, ymin: -2, ymax: 2, xstep: 0.2, ystep: 1 }, layers);
      PF.xtr.forEach((x, i) => dot(cvL.ctx, T.tx(x), T.ty(PF.ytr[i]), 5, css("--setB")));
      if (showTest) PF.xte.forEach((x, i) => dot(cvL.ctx, T.tx(x), T.ty(PF.yte[i]), 5, css("--bad"), true));
    }
    function drawR() {
      const top = 0.7;
      const T = Calc.plot(cvR, { xmin: -0.6, xmax: 9.6, ymin: -0.05, ymax: top, xstep: 1, ystep: 0.1, xname: "fok", yname: "MSE" },
        [{ vline: deg, color: "--muted", dash: [5, 4] }]);
      const { ctx } = cvR;
      polyline(ctx, T, TR.map((v, d) => [d, v]), css("--setB"), 2.2);
      polyline(ctx, T, TE.map((v, d) => [d, Math.min(v, top)]), css("--bad"), 2.2);
      TR.forEach((v, d) => dot(ctx, T.tx(d), T.ty(v), 3.5, css("--setB")));
      TE.forEach((v, d) => dot(ctx, T.tx(d), T.ty(Math.min(v, top)), 3.5, css("--bad"), v > top));
      ctx.save(); ctx.font = "600 12px system-ui, sans-serif"; ctx.textBaseline = "top";
      TE.forEach((v, d) => { if (v > top) { ctx.fillStyle = css("--bad"); ctx.textAlign = "right"; ctx.fillText(`↑ ${fmt(v, 2)}`, T.tx(d) - 4, T.ty(top) + 2); } });
      ctx.textAlign = "left";
      ctx.fillStyle = css("--setB"); ctx.fillText("— tanítóhiba", T.tx(1.2), T.ty(top) + 2);
      ctx.fillStyle = css("--bad"); ctx.fillText("— teszthiba", T.tx(1.2), T.ty(top) + 18);
      ctx.restore();
    }
    cvL.draw = drawL; cvR.draw = drawR;
    function sync() {
      sd.value = deg; ld.textContent = deg;
      drawL(); drawR();
      const verdict = deg <= 2 ? "alulillesztés: a görbe túl merev, mindkét hiba nagy"
        : deg >= 8 ? "túlillesztés: a görbe a zajt is követi, a teszthiba megugrik"
        : "jó tartomány: mindkét hiba kicsi";
      out.innerHTML = `fokszám: <b>${deg}</b> · paraméterek: ${deg + 1} · tanítóhiba: <b>${fmt(TR[deg], 3)}</b> · teszthiba: <b>${fmt(TE[deg], 3)}</b><br>` +
        `<span class="muted">${verdict}. A legkisebb teszthiba a ${TE.indexOf(Math.min(...TE))}. foknál van.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
     ------------------------------------------------------------------ */
  function init() {
    document.querySelectorAll(".widget[data-widget]").forEach(root => {
      const f = W[root.dataset.widget];
      if (!f) return;
      try { f(root); math(root); }
      catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
