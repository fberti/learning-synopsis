/* =========================================================
   Mesterséges intelligencia 6. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 5. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style") e.style.cssText = v;
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
  function twoCanvas(root, aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div"), R = h("div");
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspect, 380)];
  }
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
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  /* választógomb-csoport: egyszerre egy aktív (.btn.on) */
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => {
      const b = btn(txt, () => set(key));
      b.dataset.key = key;
      return b;
    });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    return { bs, paint };
  }
  /* "#3b82f6" → "rgba(59,130,246,a)" */
  function rgba(col, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col.trim());
    if (!m) return col;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  const median = a => { const b = a.slice().sort((x, y) => x - y), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
  const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(1, a.length - 1)); };

  /* mulberry32: kicsi, gyors, magból reprodukálható álvéletlen-generátor */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const gauss = rnd => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  function shuffled(arr, rnd) {
    const b = arr.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  }

  /* standard normális eloszlásfüggvény (erfc-közelítés, hiba < 1,2·10⁻⁷) */
  function erfc(x) {
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  const Phi = x => 0.5 * erfc(-x / Math.SQRT2);
  const phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);

  /* legkisebb négyzetes polinom Householder-QR-rel, a t = 2x − 1 változóban (a 3. fejezet kódja) */
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
      c[k] = A[k][k] === 0 ? 0 : s / A[k][k];
    }
    return x => { const t = 2 * x - 1; let r = 0; for (let j = n - 1; j >= 0; j--) r = r * t + c[j]; return r; };
  }
  const truth = x => Math.sin(2 * Math.PI * x);
  const SIGMA = 0.25;

  const W = {};

  /* ------------------------------------------------------------------
     6.2  confusion-threshold – két átfedő pontszám-eloszlás, küszöb, mátrix, ROC/PR
     ------------------------------------------------------------------ */
  W["confusion-threshold"] = root => {
    header(root, "Küszöb, tévesztési mátrix, ROC- és PR-görbe",
      "Az egészségesek pontszáma normális eloszlású 0 körül, a betegeké $d$ körül (mindkettő 1-es szórással). Húzd a <b>küszöböt</b>: ami fölötte van, azt a modell " +
      "betegnek mondja. Állítsd a két csoport <b>távolságát</b> (a modell jóságát) és a betegek <b>arányát</b>! Figyeld meg: a ROC-görbe és az AUC nem függ az aránytól – a precizitás igen.");
    const PIS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5];
    let d = 2, pi = 0.1, t = 1, scaled = false, right = "roc";
    const sD = slider(0, 4, 0.1, d), oD = h("b");
    const sT = slider(-3, 7, 0.05, t), oT = h("b");
    sD.addEventListener("input", () => { d = +sD.value; sync(); });
    sT.addEventListener("input", () => { t = +sT.value; sync(); });
    const gP = toggleGroup(PIS.map(p => [p, fmt(100 * p, 0) + "%"]), () => pi, v => { pi = +v; sync(); });
    const gR = toggleGroup([["roc", "ROC-görbe"], ["pr", "PR-görbe"]], () => right, v => { right = v; sync(); });
    root.append(
      h("div", { class: "controls" }, h("label", null, "küszöb: ", oT, sT), h("label", null, "távolság d: ", oD, sD)),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "betegek aránya:"), gP.bs),
      h("div", { class: "controls" }, gR.bs,
        h("label", null, checkbox(scaled, e => { scaled = e.target.checked; sync(); }), "a görbék valódi arányban (gyakorisággal szorozva)")));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const out = h("div", { class: "readout" });
    root.append(out);
    const rates = tt => ({ tpr: 1 - Phi(tt - d), fpr: 1 - Phi(tt) });
    function drawL() {
      const w0 = scaled ? 1 - pi : 1, w1 = scaled ? pi : 1;
      const xmin = -4, xmax = Math.max(4, d + 4), ymax = 0.43 * Math.max(w0, w1);
      const T = Calc.plot(cvL, { xmin, xmax, ymin: -0.02 * ymax, ymax, xname: "pontszám", yname: " ", labels: true }, []);
      const { ctx } = cvL;
      const fill = (f, col) => {
        ctx.save(); ctx.fillStyle = rgba(col, 0.28); ctx.beginPath();
        const a = Math.max(t, xmin);
        ctx.moveTo(T.tx(a), T.ty(0));
        for (let k = 0; k <= 120; k++) { const x = a + (xmax - a) * k / 120; ctx.lineTo(T.tx(x), T.ty(f(x))); }
        ctx.lineTo(T.tx(xmax), T.ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      };
      const f0 = x => w0 * phi(x), f1 = x => w1 * phi(x - d);
      fill(f0, css("--setA")); fill(f1, css("--setB"));
      const curve = (f, col) => { const pts = []; for (let k = 0; k <= 200; k++) { const x = xmin + (xmax - xmin) * k / 200; pts.push([x, f(x)]); } polyline(ctx, T, pts, col, 2.4); };
      curve(f0, css("--setA")); curve(f1, css("--setB"));
      polyline(ctx, T, [[t, -0.02 * ymax], [t, ymax]], css("--bad"), 2, [6, 4]);
      label(ctx, "egészséges", T.tx(-1.3), T.ty(f0(-1.3)) - 6, css("--setA"), "right");
      label(ctx, "beteg", T.tx(d + 1.3), T.ty(f1(d + 1.3)) - 6, css("--setB"), "left");
      label(ctx, "küszöb", T.tx(t) + 4, T.ty(0.62 * ymax), css("--bad"));
    }
    function drawR() {
      const { ctx } = cvR;
      const pts = [];
      for (let k = 0; k <= 300; k++) {
        const tt = -6 + (d + 12) * k / 300, r = rates(tt);
        if (right === "roc") pts.push([r.fpr, r.tpr]);
        else { const tp = pi * r.tpr, fp = (1 - pi) * r.fpr; if (tp + fp > 1e-12) pts.push([r.tpr, tp / (tp + fp)]); }
      }
      const r = rates(t);
      if (right === "roc") {
        const T = Calc.plot(cvR, { xmin: -0.03, xmax: 1.05, ymin: -0.03, ymax: 1.05, xstep: 0.2, ystep: 0.2, xname: "FPR", yname: "TPR (felidézés)" },
          [{ seg: [[0, 0], [1, 1]], color: "--muted", dash: [4, 4], width: 1.2 }]);
        polyline(ctx, T, pts, css("--accent"), 2.6);
        dot(ctx, T.tx(r.fpr), T.ty(r.tpr), 6, css("--bad"));
        label(ctx, `AUC = ${fmt(Phi(d / Math.SQRT2), 3)}`, T.tx(0.45), T.ty(0.12), css("--accent"));
      } else {
        const T = Calc.plot(cvR, { xmin: -0.03, xmax: 1.05, ymin: -0.03, ymax: 1.05, xstep: 0.2, ystep: 0.2, xname: "felidézés", yname: "precizitás" },
          [{ hline: pi, color: "--muted", dash: [4, 4], width: 1.2 }]);
        polyline(ctx, T, pts, css("--accent"), 2.6);
        const tp = pi * r.tpr, fp = (1 - pi) * r.fpr;
        if (tp + fp > 1e-12) dot(ctx, T.tx(r.tpr), T.ty(tp / (tp + fp)), 6, css("--bad"));
        label(ctx, `véletlen szint = ${fmt(pi, 2)}`, T.tx(0.4), T.ty(pi) - 4, css("--muted"));
      }
    }
    cvL.draw = drawL; cvR.draw = drawR;
    function sync() {
      sT.min = -3; sT.max = Math.max(4, d + 3).toFixed(1);
      oD.textContent = fmt(d, 1); oT.textContent = fmt(t, 2);
      gP.paint(); gR.paint();
      drawL(); drawR();
      const r = rates(t), N = 1000, P = pi * N, Ng = N - P;
      const TP = P * r.tpr, FN = P - TP, FP = Ng * r.fpr, TN = Ng - FP;
      const prec = TP + FP > 1e-9 ? TP / (TP + FP) : NaN, rec = r.tpr, spec = 1 - r.fpr;
      const f1 = 2 * TP / (2 * TP + FP + FN);
      const c = v => fmt(v, v < 10 ? 1 : 0);
      out.innerHTML =
        `<table style="text-align:center;margin:.1rem 0 .4rem;font-size:.9rem"><tr><th>1000 főre (várható)</th><th>jósolt beteg</th><th>jósolt egészséges</th></tr>` +
        `<tr><th>beteg (${c(P)})</th><td>TP = ${c(TP)}</td><td>FN = ${c(FN)}</td></tr>` +
        `<tr><th>egészséges (${c(Ng)})</th><td>FP = ${c(FP)}</td><td>TN = ${c(TN)}</td></tr></table>` +
        `pontosság <b>${fmt(100 * (TP + TN) / N, 1)}%</b> · felidézés <b>${fmt(rec, 3)}</b> · precizitás <b>${Number.isFinite(prec) ? fmt(prec, 3) : "–"}</b> · ` +
        `specificitás <b>${fmt(spec, 3)}</b> · F1 <b>${fmt(f1, 3)}</b> · AUC <b>${fmt(Phi(d / Math.SQRT2), 3)}</b><br>` +
        `<span class="muted">Az alapvonal („senki sem beteg”) pontossága ${fmt(100 * (1 - pi), 0)}%. ` +
        (pi <= 0.02 && rec > 0.5 ? "Ritka betegségnél még jó felidézés mellett is a riasztások nagy része hamis – nézd a PR-görbét!" :
          d < 0.3 ? "Ha a két eloszlás egybeesik, a pontszám semmit nem árul el: a ROC-görbe az átló, AUC ≈ 0,5." :
            "A küszöb csúsztatása a ROC-görbén mozgatja a pontot – a görbe maga a modellé.") + "</span>";
    }
    sync();
  };

  /* ------------------------------------------------------------------
     6.5  kfold-viz – a hajtások forgása, keverés, rétegzés, idősor
     ------------------------------------------------------------------ */
  /* 20 minta egy jellemzővel; 0 = egészséges, 1 = beteg (átfedő osztályok) */
  const KF = [1.0, 1.8, 2.4, 2.9, 3.3, 3.7, 4.1, 4.6, 5.2, 6.0].map(x => ({ x, c: 0 }))
    .concat([3.9, 4.8, 5.3, 5.8, 6.2, 6.6, 7.1, 7.5, 8.2, 9.0].map(x => ({ x, c: 1 })));
  W["kfold-viz"] = root => {
    header(root, "Keresztvalidáció: hogyan forognak a hajtások?",
      "20 minta (<span style='color:var(--setA)'>■ 0-s</span>, <span style='color:var(--setB)'>■ 1-es osztály</span>), a modell az 1D legközelebbi centroid (mint a 6.5 kézi példájában). " +
      "Minden sor egy kör: a <b>teli</b> cellák a validációs hajtás (✓/✗: eltalálta-e a modell), a <b>halvány</b> cellák a tanító rész, az <b>üres</b> cellák nem vesznek részt. " +
      "Próbáld ki: címke szerint rendezett adat, keverés nélkül, $k = 2$ – aztán kapcsold be a keverést vagy a rétegzést!");
    let order = "sorted", mode = "plain", k = 5, seed = 1;
    const gO = toggleGroup([["sorted", "címke szerint rendezett adat"], ["time", "időrendi (vegyes) adat"]], () => order, v => { order = v; sync(); });
    const gM = toggleGroup([["plain", "sorrendben (keverés nélkül)"], ["shuffle", "keverve"], ["strat", "rétegzetten"], ["time", "idősoros"]], () => mode, v => { mode = v; sync(); });
    const gK = toggleGroup([2, 4, 5, 10, 20].map(v => [v, "k = " + v]), () => k, v => { k = +v; sync(); });
    root.append(h("div", { class: "controls" }, gO.bs), h("div", { class: "controls" }, gM.bs),
      h("div", { class: "controls" }, gK.bs, btn("🎲 új keverés", () => { seed++; sync(); })));
    const grid = h("div", { style: "overflow-x:auto" });
    const out = h("div", { class: "readout" });
    root.append(grid, out);
    const timeOrder = shuffled(KF.map((_, i) => i), mulberry32(42));
    const baseOrder = () => order === "sorted" ? KF.map((_, i) => i) : timeOrder;
    const blocks = (idx, kk) => { const n = idx.length, B = []; let s = 0; for (let j = 0; j < kk; j++) { const sz = Math.floor(n / kk) + (j < n % kk ? 1 : 0); B.push(idx.slice(s, s + sz)); s += sz; } return B; };
    function rounds() {
      const idx = baseOrder(), rnd = mulberry32(seed * 7919);
      if (mode === "time") {
        const B = blocks(idx, k), R = [];
        for (let j = 1; j < k; j++) R.push({ train: [].concat(...B.slice(0, j)), val: B[j] });
        return R;
      }
      let F;
      if (mode === "plain") F = blocks(idx, k);
      else if (mode === "shuffle") F = blocks(shuffled(idx, rnd), k);
      else {
        F = Array.from({ length: k }, () => []);
        const sh = shuffled(idx, rnd);
        let j = 0;
        [0, 1].forEach(c => sh.filter(i => KF[i].c === c).forEach(i => { F[j % k].push(i); j++; }));
      }
      return F.map((val, j) => ({ train: [].concat(...F.filter((_, q) => q !== j)), val }));
    }
    /* 1D legközelebbi centroid: küszöb a két osztályátlag felezőpontja; ha egy osztály hiányzik, mindig a másikat mondja */
    function fit(train) {
      const m = [0, 1].map(c => { const g = train.filter(i => KF[i].c === c).map(i => KF[i].x); return g.length ? mean(g) : null; });
      if (m[0] == null) return () => 1;
      if (m[1] == null) return () => 0;
      const thr = (m[0] + m[1]) / 2;
      return x => (x >= thr ? 1 : 0);
    }
    function sync() {
      gO.paint(); gM.paint(); gK.paint();
      const disp = baseOrder(), R = rounds(), cS = css("--setB"), cH = css("--setA");
      grid.innerHTML = "";
      const accs = []; let oneClass = 0;
      const tbl = h("table", { style: "border-collapse:separate;border-spacing:2px;font-size:.8rem" });
      R.forEach((r, j) => {
        const f = fit(r.train), tr = new Set(r.train), va = new Set(r.val);
        if (new Set(r.train.map(i => KF[i].c)).size < 2) oneClass++;
        const ok = r.val.filter(i => f(KF[i].x) === KF[i].c).length;
        const acc = ok / r.val.length; accs.push(acc);
        const row = h("tr", null, h("td", { style: "padding-right:.4rem;white-space:nowrap" }, `${j + 1}. kör`));
        disp.forEach(i => {
          const col = KF[i].c ? cS : cH;
          let st = "width:18px;height:18px;text-align:center;border-radius:3px;color:#fff;font-weight:700;";
          let txt = "";
          if (va.has(i)) { st += `background:${col};`; txt = f(KF[i].x) === KF[i].c ? "✓" : "✗"; }
          else if (tr.has(i)) st += `background:${rgba(col, 0.25)};`;
          else st += `border:1px dashed ${css("--border")};`;
          row.append(h("td", { style: st, title: `x = ${fmt(KF[i].x, 1)}` }, txt));
        });
        row.append(h("td", { style: "padding-left:.5rem;white-space:nowrap" }, `${ok}/${r.val.length} = ${fmt(acc, 2)}`));
        tbl.append(row);
      });
      grid.append(tbl);
      let txt = `${R.length} kör · CV-pontosság: <b>${fmt(mean(accs), 3)}</b> ± ${fmt(sd(accs), 3)} (a körök szórása)`;
      if (oneClass) txt += `<br><span style="color:var(--bad)">${oneClass} körben a tanító részben csak egy osztály volt – a modell semmit nem tanulhatott.</span>`;
      if (mode === "time") txt += `<br><span class="muted">Idősoros CV: mindig a múltból tanulunk, és a következő szakaszon validálunk; a jövő (üres cellák) nem vesz részt.</span>`;
      else if (mode === "strat") txt += `<br><span class="muted">Rétegzett: minden hajtásban kb. ugyanannyi a két osztályból.</span>`;
      else if (mode === "plain" && order === "sorted") txt += `<br><span class="muted">Rendezett adat keverés nélkül: a hajtások egy-egy osztályból állnak – a becslés használhatatlan.</span>`;
      out.innerHTML = txt;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     6.6  bias-variance – sok tanító halmazra illesztett polinomok „legyezője”
     ------------------------------------------------------------------ */
  const XS10 = Array.from({ length: 10 }, (_, k) => k / 9);
  const GRID = Array.from({ length: 49 }, (_, k) => 0.02 + 0.96 * k / 48);
  W["bias-variance"] = root => {
    header(root, "Torzítás és variancia: sok tanító halmaz, sok modell",
      "Ugyanabból a világból (szaggatott: $\\sin(2\\pi x)$, zaj szórása 0,25) 200 különböző, 10 pontos tanító halmazt húzunk, és mindegyikre illesztünk egy polinomot. " +
      "Balra 20 ilyen görbe (vékony) és az összes átlaga (vastag). Jobbra a torzítás², a variancia és a várható hiba a fokszám függvényében.");
    let deg = 3, seed = 1;
    const sDg = slider(0, 9, 1, deg), oDg = h("b");
    sDg.addEventListener("input", () => { deg = +sDg.value; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "fokszám: ", oDg, sDg),
      btn("1", () => { deg = 1; sync(); }), btn("3", () => { deg = 3; sync(); }), btn("9", () => { deg = 9; sync(); }),
      btn("🎲 új halmazok", () => { seed++; compute(); sync(); })));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const out = h("div", { class: "readout" });
    root.append(out);
    let preds = [], stats = [];
    function compute() {
      const rnd = mulberry32(seed * 104729), R = 200;
      const sets = Array.from({ length: R }, () => XS10.map(x => truth(x) + SIGMA * gauss(rnd)));
      preds = []; stats = [];
      for (let d = 0; d <= 9; d++) {
        const P = sets.map(ys => { const f = polyfit(XS10, ys, d); return GRID.map(f); });
        const m = GRID.map((_, g) => mean(P.map(p => p[g])));
        const b2 = mean(GRID.map((x, g) => (m[g] - truth(x)) ** 2));
        const v = mean(GRID.map((_, g) => mean(P.map(p => (p[g] - m[g]) ** 2))));
        preds.push({ P: P.slice(0, 20), m });
        stats.push({ b2, v, tot: b2 + v + SIGMA * SIGMA });
      }
    }
    function drawL() {
      const T = Calc.plot(cvL, { xmin: -0.04, xmax: 1.04, ymin: -2, ymax: 2, xstep: 0.2, ystep: 1 },
        [{ f: truth, color: "--muted", dash: [5, 4], width: 1.6, domain: [0, 1] }]);
      const { ctx } = cvL, { P, m } = preds[deg];
      const clip = v => Math.max(-2.5, Math.min(2.5, v));
      P.forEach(p => polyline(ctx, T, GRID.map((x, g) => [x, clip(p[g])]), rgba(css("--accent"), 0.28), 1.2));
      polyline(ctx, T, GRID.map((x, g) => [x, clip(m[g])]), css("--bad"), 3);
    }
    function drawR() {
      const top = 0.6;
      const T = Calc.plot(cvR, { xmin: -0.5, xmax: 9.5, ymin: -0.02, ymax: top, xstep: 1, ystep: 0.1, xname: "fok", yname: "hiba" },
        [{ vline: deg, color: "--muted", dash: [5, 4] }, { hline: SIGMA * SIGMA, color: "--border", dash: [2, 3] }]);
      const { ctx } = cvR, cl = v => Math.min(v, top);
      const series = [["b2", css("--setA"), "torzítás²"], ["v", css("--setB"), "variancia"], ["tot", css("--bad"), "várható hiba"]];
      series.forEach(([key, col, name], s) => {
        polyline(ctx, T, stats.map((st, d) => [d, cl(st[key])]), col, 2.2);
        stats.forEach((st, d) => dot(ctx, T.tx(d), T.ty(cl(st[key])), 3.2, col, st[key] > top));
        label(ctx, "— " + name, T.tx(3.6), T.ty(top) + 16 + 15 * s, col);
      });
      label(ctx, "zaj (0,0625)", T.tx(6.2), T.ty(SIGMA * SIGMA) - 3, css("--muted"), "left", "11px system-ui, sans-serif");
    }
    cvL.draw = drawL; cvR.draw = drawR;
    function sync() {
      sDg.value = deg; oDg.textContent = deg;
      drawL(); drawR();
      const s = stats[deg], best = stats.reduce((b, st, d) => (st.tot < stats[b].tot ? d : b), 0);
      out.innerHTML = `fokszám <b>${deg}</b> · torzítás² <b>${fmt(s.b2, 3)}</b> · variancia <b>${fmt(s.v, 3)}</b> · zaj 0,063 · várható hiba <b>${fmt(s.tot, 3)}</b><br>` +
        `<span class="muted">${deg <= 1 ? "Merev modell: a görbék szinte egyformák (kis variancia), de mind mellélő (nagy torzítás)." :
          deg >= 8 ? "Túl rugalmas modell: az átlag szinte a valódi görbe (kis torzítás), de az egyes görbék vadul szórnak (nagy variancia)." :
            "Jó egyensúly: kicsi a torzítás, és még kicsi a variancia is."} A legkisebb várható hiba most a ${best}. foknál van.</span>`;
    }
    compute(); sync();
  };

  /* ------------------------------------------------------------------
     6.6  learning-curve – tanító- és validációs hiba a tanító halmaz méretének függvényében
     ------------------------------------------------------------------ */
  W["learning-curve"] = root => {
    header(root, "Tanulási görbe: segít-e a több adat?",
      "Zajos szinuszgörbe, véletlen $x$-ekkel. Minden tanítóhalmaz-méretre 60-szor tanítunk, és a tipikus (medián) tanító- és validációs hibát rajzoljuk. " +
      "Válts a modellek között: hol érnek össze a görbék, és hol a zaj szintje (szaggatott)?");
    let deg = 1;
    const NS = [12, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300];
    const gD = toggleGroup([[1, "egyenes (1. fok)"], [3, "3. fokú polinom"], [9, "9. fokú polinom"]], () => deg, v => { deg = +v; sync(); });
    root.append(h("div", { class: "controls" }, gD.bs));
    const cv = Calc.canvas(root, 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);
    const vr = mulberry32(2024);
    const VX = Array.from({ length: 400 }, () => vr()), VY = VX.map(x => truth(x) + SIGMA * gauss(vr));
    const cache = {};
    function curves(d) {
      if (cache[d]) return cache[d];
      const rnd = mulberry32(17 + d);
      const res = NS.map(n => {
        const tr = [], va = [];
        for (let r = 0; r < 60; r++) {
          const xs = Array.from({ length: n }, () => rnd()), ys = xs.map(x => truth(x) + SIGMA * gauss(rnd));
          const f = polyfit(xs, ys, d);
          tr.push(mean(xs.map((x, i) => (f(x) - ys[i]) ** 2)));
          va.push(mean(VX.map((x, i) => (f(x) - VY[i]) ** 2)));
        }
        return { n, tr: median(tr), va: median(va) };
      });
      return (cache[d] = res);
    }
    function draw() {
      const top = 0.6, C = curves(deg);
      const T = Calc.plot(cv, { xmin: 0, xmax: 310, ymin: -0.02, ymax: top, xstep: 50, ystep: 0.1, xname: "n (tanító minták)", yname: "MSE" },
        [{ hline: SIGMA * SIGMA, color: "--muted", dash: [5, 4], width: 1.3 }]);
      const { ctx } = cv, cl = v => Math.min(v, top);
      polyline(ctx, T, C.map(c => [c.n, cl(c.tr)]), css("--setB"), 2.4);
      polyline(ctx, T, C.map(c => [c.n, cl(c.va)]), css("--bad"), 2.4);
      C.forEach(c => { dot(ctx, T.tx(c.n), T.ty(cl(c.tr)), 3.5, css("--setB")); dot(ctx, T.tx(c.n), T.ty(cl(c.va)), 3.5, css("--bad"), c.va > top); });
      label(ctx, "— tanítóhiba", T.tx(170), T.ty(top) + 16, css("--setB"));
      label(ctx, "— validációs hiba", T.tx(170), T.ty(top) + 32, css("--bad"));
      label(ctx, "zaj = 0,0625", T.tx(240), T.ty(SIGMA * SIGMA) - 4, css("--muted"), "left", "11px system-ui, sans-serif");
    }
    cv.draw = draw;
    function sync() {
      gD.paint(); draw();
      const C = curves(deg), last = C[C.length - 1], first = C[0];
      const verdict = deg === 1 ? "Nagy torzítás: a két görbe hamar összeér, de 0,26 körül – messze a zaj fölött. Több adat nem segít, bonyolultabb modell kell."
        : deg === 9 ? "Nagy variancia kis adatnál: óriási rés, ami a minták számával gyorsan zárul. Itt a több adat sokat ér."
          : "Jó modellcsalád: a rés gyorsan zárul, és mindkét görbe a zaj szintjéhez tart.";
      out.innerHTML = `n = ${first.n}: tanító <b>${fmt(first.tr, 3)}</b>, validációs <b>${first.va > 9.99 ? "&gt; 10" : fmt(first.va, 3)}</b> · ` +
        `n = ${last.n}: tanító <b>${fmt(last.tr, 3)}</b>, validációs <b>${fmt(last.va, 3)}</b><br><span class="muted">${verdict}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     6.7  regularization-path – ridge és lasso a 9. fokú polinomon
     ------------------------------------------------------------------ */
  /* a 3.5 adatai: y = sin(2πx) + zaj, két tizedesre kerekítve */
  const PF = {
    xtr: Array.from({ length: 10 }, (_, k) => k / 9),
    ytr: [0.14, 0.7, 0.97, 0.29, 0.45, -0.87, -0.64, -0.83, -0.44, 0.21],
    xte: [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95],
    yte: [0.38, 0.68, 0.92, 1.19, 0.16, -0.37, -0.99, -1.13, -0.89, -0.24]
  };
  const P9 = x => { const t = 2 * x - 1, r = []; let p = 1; for (let j = 1; j <= 9; j++) { p *= t; r.push(p); } return r; };
  /* a tanító jellemzők és címkék középre igazítva (a tengelymetszet így büntetlen) */
  const RG = (() => {
    const A = PF.xtr.map(P9), p = 9, n = A.length;
    const mu = Array.from({ length: p }, (_, j) => mean(A.map(r => r[j]))), my = mean(PF.ytr);
    const Ac = A.map(r => r.map((v, j) => v - mu[j])), yc = PF.ytr.map(v => v - my);
    const G = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => Ac.reduce((s, r) => s + r[i] * r[j], 0)));
    const c = Array.from({ length: p }, (_, j) => Ac.reduce((s, r, i) => s + r[j] * yc[i], 0));
    return { Ac, yc, mu, my, G, c, p, n };
  })();
  /* ridge: (G + λI) w = c, Gauss-eliminációval, részleges főelem-kiválasztással */
  function ridgeW(lam) {
    const p = RG.p, M = RG.G.map((r, i) => r.map((v, j) => v + (i === j ? lam : 0)).concat([RG.c[i]]));
    for (let k = 0; k < p; k++) {
      let piv = k; for (let i = k + 1; i < p; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
      [M[k], M[piv]] = [M[piv], M[k]];
      for (let i = k + 1; i < p; i++) { const f = M[i][k] / M[k][k]; for (let j = k; j <= p; j++) M[i][j] -= f * M[k][j]; }
    }
    const w = Array(p).fill(0);
    for (let k = p - 1; k >= 0; k--) { let s = M[k][p]; for (let j = k + 1; j < p; j++) s -= M[k][j] * w[j]; w[k] = s / M[k][k]; }
    return w;
  }
  /* lasso: koordinátánkénti ereszkedés a  Σ(y − ŷ)² + λ Σ|w|  célfüggvényre, meleg indítással */
  function lassoW(lam, w0) {
    const { G, c, p } = RG, w = w0 ? w0.slice() : Array(p).fill(0);
    for (let it = 0; it < 20000; it++) {
      let maxd = 0;
      for (let j = 0; j < p; j++) {
        let rho = c[j]; for (let k = 0; k < p; k++) if (k !== j) rho -= G[j][k] * w[k];
        const nw = Math.sign(rho) * Math.max(Math.abs(rho) - lam / 2, 0) / G[j][j];
        maxd = Math.max(maxd, Math.abs(nw - w[j])); w[j] = nw;
      }
      if (maxd < 1e-10) break;
    }
    return w;
  }
  const predictor = w => { const b = RG.my - w.reduce((s, v, j) => s + v * RG.mu[j], 0); return x => P9(x).reduce((s, v, j) => s + v * w[j], b); };
  W["regularization-path"] = root => {
    header(root, "Regularizációs út: ridge és lasso a kilencedfokú polinomon",
      "A 3.5 tíz tanító pontja (teli) és tíz teszt pontja (üres), kilencedfokú polinom. A csúszkával a büntetés erősségét ($\\lambda$, logaritmikus skálán) állítod. " +
      "Jobbra a 9 együttható útja $\\lambda$ függvényében – figyeld, hogyan zsugorodnak (ridge), illetve nullázódnak ki egyenként (lasso)!");
    let kind = "ridge", lg = -4;
    const sL = slider(-6, 2, 0.1, lg), oL = h("b");
    sL.addEventListener("input", () => { lg = +sL.value; sync(); });
    const gK = toggleGroup([["ridge", "ridge (L2)"], ["lasso", "lasso (L1)"]], () => kind, v => { kind = v; sync(); });
    root.append(h("div", { class: "controls" }, gK.bs, h("label", null, "λ = ", oL, sL)));
    const [cvL, cvR] = twoCanvas(root, 0.8);
    const out = h("div", { class: "readout" });
    root.append(out);
    const LGS = Array.from({ length: 81 }, (_, k) => -6 + k * 0.1);
    const paths = { ridge: LGS.map(g => ridgeW(10 ** g)) };
    /* a lasso utat nagy λ-tól lefelé számoljuk, mindig az előző megoldásból indulva */
    paths.lasso = (() => { const out = Array(LGS.length); let w = null; for (let k = LGS.length - 1; k >= 0; k--) { w = lassoW(10 ** LGS[k], w); out[k] = w; } return out; })();
    const cur = () => { const k = Math.round((lg + 6) * 10); return paths[kind][Math.max(0, Math.min(80, k))]; };
    const COLS = ["--accent", "--setB", "--setC", "--bad", "--setA"];
    function drawL() {
      const f = predictor(cur());
      const T = Calc.plot(cvL, { xmin: -0.06, xmax: 1.06, ymin: -2, ymax: 2, xstep: 0.2, ystep: 1 },
        [{ f: truth, color: "--muted", dash: [5, 4], width: 1.4, domain: [0, 1] }, { f, color: "--accent", width: 2.6, domain: [0, 1] }]);
      PF.xtr.forEach((x, i) => dot(cvL.ctx, T.tx(x), T.ty(PF.ytr[i]), 5, css("--setB")));
      PF.xte.forEach((x, i) => dot(cvL.ctx, T.tx(x), T.ty(PF.yte[i]), 5, css("--bad"), true));
    }
    function drawR() {
      const Y = 6, P = paths[kind];
      const T = Calc.plot(cvR, { xmin: -6.2, xmax: 2.2, ymin: -Y, ymax: Y, xstep: 1, ystep: 2, xname: "lg λ", yname: "w" }, [{ vline: lg, color: "--muted", dash: [5, 4] }]);
      for (let j = 0; j < 9; j++) {
        const pts = LGS.map((g, k) => [g, Math.max(-Y, Math.min(Y, P[k][j]))]);
        polyline(cvR.ctx, T, pts, css(COLS[j % COLS.length]), 1.8, j >= 5 ? [5, 3] : []);
      }
      label(cvR.ctx, "a kis λ-knál a súlyok kilógnak (akár ±500)", T.tx(-6), T.ty(-Y) - 4, css("--muted"), "left", "11px system-ui, sans-serif");
    }
    cvL.draw = drawL; cvR.draw = drawR;
    function sync() {
      gK.paint(); sL.value = lg;
      const lam = 10 ** lg;
      oL.textContent = lam >= 1 ? fmt(lam, 1) : lam.toExponential(1).replace(".", ",").replace(/e([+-]\d+)/, (m, e) => "·10^" + (+e));
      drawL(); drawR();
      const w = cur(), f = predictor(w);
      const tr = mean(PF.xtr.map((x, i) => (f(x) - PF.ytr[i]) ** 2)), te = mean(PF.xte.map((x, i) => (f(x) - PF.yte[i]) ** 2));
      const nz = w.filter(v => Math.abs(v) > 1e-8).length, ss = w.reduce((s, v) => s + v * v, 0);
      out.innerHTML = `tanítóhiba <b>${fmt(tr, 3)}</b> · teszthiba <b>${fmt(te, 3)}</b> · Σw² = <b>${ss > 1000 ? fmt(ss, 0) : fmt(ss, 2)}</b> · nem nulla együttható: <b>${nz}</b> / 9<br>` +
        `<span class="muted">${te > 0.3 && tr < 0.05 ? "Túl gyenge büntetés: a görbe a zajt is követi (túlillesztés)." :
          tr > 0.12 ? "Túl erős büntetés: a görbe kiegyenesedik (alulillesztés)." : "Jó tartomány: a görbe sima, és a teszthiba kicsi."}` +
        (kind === "lasso" ? " A lasso a gyenge hatványokat pontosan 0-ra állítja." : " A ridge minden együtthatót zsugorít, de egyiket sem nullázza ki.") + "</span>";
    }
    sync();
  };

  /* ------------------------------------------------------------------
     6.8  tuning-search – rácskeresés vs véletlen keresés
     ------------------------------------------------------------------ */
  /* a pontszám szinte csak az „a” gombtól függ (keskeny csúcs a = 0,73-nál), a „b” alig számít */
  const SCORE = (a, b) => 0.70 + 0.22 * Math.exp(-(((a - 0.73) / 0.07) ** 2)) + 0.03 * b;
  W["tuning-search"] = root => {
    header(root, "Rácskeresés vagy véletlen keresés?",
      "Két hiperparaméter: a vízszintes <b>a</b> nagyon számít (keskeny, jó sáv 0,73 körül), a függőleges <b>b</b> alig. A háttér színe a (CV-)pontszám. " +
      "Ugyanannyi próbával balra a rács, jobbra a véletlen keresés. Az alsó vonalkák mutatják, az <b>a</b> hány különböző értékét próbáltuk ki.");
    let n = 9, seed = 1;
    const gN = toggleGroup([4, 9, 16, 25].map(v => [v, v + " próba"]), () => n, v => { n = +v; sync(); });
    root.append(h("div", { class: "controls" }, gN.bs, btn("🎲 új véletlen minta", () => { seed++; sync(); })));
    const [cvL, cvR] = twoCanvas(root, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const gridPts = () => { const m = Math.round(Math.sqrt(n)), v = Array.from({ length: m }, (_, i) => 0.1 + 0.8 * i / (m - 1)); return [].concat(...v.map(a => v.map(b => [a, b]))); };
    const randPts = () => { const r = mulberry32(seed * 31337); return Array.from({ length: n }, () => [r(), r()]); };
    function drawOne(cv, pts, title) {
      const T = Calc.plot(cv, { xmin: 0, xmax: 1, ymin: -0.08, ymax: 1, xstep: 0.2, ystep: 0.2, xname: "a", yname: "b", grid: false }, []);
      const { ctx } = cv, cell = 6;
      for (let px = 0; px < cv.w; px += cell) for (let py = 0; py < cv.h; py += cell) {
        const a = T.ix(px + cell / 2), b = T.iy(py + cell / 2);
        if (a < 0 || a > 1 || b < 0 || b > 1) continue;
        const s = (SCORE(a, b) - 0.70) / 0.25;
        ctx.fillStyle = rgba(css("--setC"), 0.06 + 0.5 * s); ctx.fillRect(px, py, cell, cell);
      }
      let best = 0;
      pts.forEach(([a, b], i) => { if (SCORE(a, b) > SCORE(pts[best][0], pts[best][1])) best = i; });
      pts.forEach(([a, b], i) => {
        dot(ctx, T.tx(a), T.ty(b), i === best ? 7 : 4.5, i === best ? css("--bad") : css("--accent"));
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(T.tx(a), T.ty(-0.02)); ctx.lineTo(T.tx(a), T.ty(-0.07)); ctx.stroke(); ctx.restore();
      });
      label(ctx, title, cv.w - 8, 18, css("--text"), "right", "700 13px system-ui, sans-serif");
      return SCORE(pts[best][0], pts[best][1]);
    }
    let bG = 0, bR = 0;
    cvL.draw = () => { bG = drawOne(cvL, gridPts(), "rács"); };
    cvR.draw = () => { bR = drawOne(cvR, randPts(), "véletlen"); };
    function sync() {
      gN.paint(); cvL.draw(); cvR.draw();
      const m = Math.round(Math.sqrt(n));
      out.innerHTML = `legjobb talált pontszám – rács: <b>${fmt(bG, 3)}</b> (az <b>a</b>-ból ${m} különböző érték) · véletlen: <b>${fmt(bR, 3)}</b> (${n} különböző érték) · ` +
        `az elérhető legjobb: <b>${fmt(SCORE(0.73, 1), 3)}</b><br><span class="muted">A rács a lényegtelen <b>b</b> gombra is elkölti a próbák nagy részét. ` +
        `Egy véletlen próba 10% eséllyel esik a jó (0,68–0,78) sávba; ${n} próbából legalább egy ${fmt(100 * (1 - 0.9 ** n), 0)}% eséllyel.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     6.9  bootstrap-ci – a pontosság bootstrap-eloszlása
     ------------------------------------------------------------------ */
  W["bootstrap-ci"] = root => {
    header(root, "Bootstrap: mennyire ingadozik a pontosság?",
      "A teszt halmazon a modell pontossága 80%. Húzz belőle visszatevéssel ugyanannyi mintát (egy <b>bootstrap-minta</b>), számold ki a pontosságot – és ismételd sokszor! " +
      "A hisztogram 2,5%-os és 97,5%-os pontja a 95%-os intervallum. Hasonlítsd össze különböző teszt-méreteknél!");
    let n = 10, seed = 1, B = [], last = null;
    const data = () => Array.from({ length: n }, (_, i) => (i < Math.round(0.8 * n) ? 1 : 0));
    const gN = toggleGroup([10, 50, 200, 1000].map(v => [v, "n = " + v]), () => n, v => { n = +v; B = []; last = null; sync(); });
    let rnd = mulberry32(99);
    const draw1 = () => { const d = data(), idx = Array.from({ length: n }, () => Math.floor(rnd() * n)); last = idx.map(i => d[i]); B.push(mean(last)); };
    root.append(h("div", { class: "controls" }, gN.bs),
      h("div", { class: "controls" }, btn("➕ 1 bootstrap-minta", () => { draw1(); sync(); }),
        btn("➕ 1000 minta", () => { for (let i = 0; i < 1000; i++) draw1(); sync(); }),
        btn("↺ törlés", () => { B = []; last = null; seed++; rnd = mulberry32(99 + seed); sync(); })));
    const cv = Calc.canvas(root, 0.45);
    const out = h("div", { class: "readout" });
    root.append(out);
    const pct = (a, q) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.max(0, Math.floor(q * b.length)))]; };
    function wilson(k, m, z = 1.96) { const p = k / m, c = (p + z * z / (2 * m)) / (1 + z * z / m), hw = z * Math.sqrt(p * (1 - p) / m + z * z / (4 * m * m)) / (1 + z * z / m); return [c - hw, c + hw]; }
    function draw() {
      const bins = n <= 50 ? n + 1 : 41, lo = 0.4, hi = 1.0;
      const counts = Array(bins).fill(0);
      const binOf = v => n <= 50 ? Math.round(v * n) : Math.min(bins - 1, Math.max(0, Math.round((v - lo) / (hi - lo) * (bins - 1))));
      const xOf = b => n <= 50 ? b / n : lo + (hi - lo) * b / (bins - 1);
      B.forEach(v => counts[binOf(v)]++);
      const maxC = Math.max(1, ...counts);
      const T = Calc.plot(cv, { xmin: n <= 50 ? -0.02 : lo - 0.02, xmax: 1.04, ymin: 0, ymax: maxC * 1.15, xstep: 0.1, ystep: Math.max(1, Math.ceil(maxC / 4)), xname: "pontosság", yname: "db", labels: true }, []);
      const { ctx } = cv, wpx = Math.max(2, (T.tx(xOf(1)) - T.tx(xOf(0))) * 0.8);
      ctx.save(); ctx.fillStyle = rgba(css("--accent"), 0.7);
      counts.forEach((c, b) => { if (c) ctx.fillRect(T.tx(xOf(b)) - wpx / 2, T.ty(c), wpx, T.ty(0) - T.ty(c)); });
      ctx.restore();
      if (B.length >= 40) [pct(B, 0.025), pct(B, 0.975)].forEach(v => polyline(ctx, T, [[v, 0], [v, maxC * 1.1]], css("--bad"), 2, [6, 4]));
      polyline(ctx, T, [[0.8, 0], [0.8, maxC * 1.1]], css("--setC"), 2);
    }
    cv.draw = draw;
    function sync() {
      gN.paint(); draw();
      const k = Math.round(0.8 * n), w = wilson(k, n), hw = 1.96 * Math.sqrt(0.16 / n);
      let txt = `teszt: ${n} minta, ${k} találat (80%) · bootstrap-minták: <b>${B.length}</b>`;
      if (last && n <= 10) txt += ` · az utolsó minta: ${last.map(v => (v ? "✓" : "✗")).join(" ")} → ${fmt(mean(last), 2)}`;
      if (B.length >= 40) txt += `<br>bootstrap 95%: <b>[${fmt(pct(B, 0.025), 3)}; ${fmt(pct(B, 0.975), 3)}]</b>`;
      else txt += `<br><span class="muted">Legalább 40 bootstrap-minta kell az intervallumhoz – nyomd meg az „1000 minta” gombot!</span>`;
      txt += ` · Wilson: [${fmt(w[0], 3)}; ${fmt(w[1], 3)}] · normális közelítés: [${fmt(0.8 - hw, 3)}; ${fmt(0.8 + hw, 3)}]` +
        (0.8 + hw > 1 ? ` <span style="color:var(--bad)">(1 fölé lóg!)</span>` : "");
      out.innerHTML = txt;
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
