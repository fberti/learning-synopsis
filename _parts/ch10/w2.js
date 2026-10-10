
  /* ==================================================================
     10.5–10.9 – optimalizálók, jelterjedés, regularizáció, számjegytanítás
     (közös segédfüggvények w2_ előtaggal)
     ================================================================== */
  const W2_SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const w2_sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => W2_SUP[d]);
  const w2_pow10 = k => (k === 0 ? "1" : k === 1 ? "10" : "10" + w2_sup(k));
  /* szám tudományos alakban, ha nagyon kicsi vagy nagy: 3,4·10⁻⁵ */
  function w2_sci(x, d = 3) {
    if (!Number.isFinite(x)) return "—";
    const a = Math.abs(x);
    if (a === 0) return "0";
    if (a >= 0.001 && a < 1e5) return fmt(x, a >= 100 ? 1 : a >= 0.1 ? d : 2 - Math.floor(Math.log10(a)));
    let e = Math.floor(Math.log10(a)), m = x / 10 ** e;
    if (Math.abs(+m.toFixed(2)) >= 10) { e++; m /= 10; }
    return fmt(m, 2) + "·10" + w2_sup(e);
  }
  /* animációs ciklus (a 9. fejezet mintájára): csak látható widgetnél fut */
  function w2_anim(root, frame) {
    let on = false, vis = true, id = 0;
    const loop = () => { id = 0; if (!on || !vis) return; frame(); if (on) id = requestAnimationFrame(loop); };
    const kick = () => { if (on && vis && !id) id = requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; kick(); }).observe(root);
    return { start() { on = true; kick(); }, stop() { on = false; }, get running() { return on; } };
  }
  function w2_nice(span, n) {
    const t = span / Math.max(1, n), p = 10 ** Math.floor(Math.log10(t));
    for (const m of [1, 2, 5, 10]) if (m * p >= t - 1e-12) return m * p;
    return 10 * p;
  }
  /* grafikon-keret bal/alsó tengellyel, ráccsal, feliratokkal.
     V: { xmin, xmax, ymin, ymax, log (y-ban lg-értékek), xname, yname, yfmt, xint (egész x-jelölők) } */
  function w2_frame(cv, V) {
    const { ctx, w, h: hh } = cv, ml = V.log ? 38 : 40, mr = 10, mt = 18, mb = 20;
    const tx = x => ml + (x - V.xmin) / (V.xmax - V.xmin) * (w - ml - mr);
    const ty = y => hh - mb - (y - V.ymin) / (V.ymax - V.ymin) * (hh - mt - mb);
    ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
    let xs = w2_nice(V.xmax - V.xmin, Math.max(2, Math.floor((w - ml - mr) / 55)));
    if (V.xint) xs = Math.max(1, Math.round(xs));
    const ny = Math.max(2, Math.floor((hh - mt - mb) / 26));
    const ys = V.log ? Math.max(1, Math.ceil((V.ymax - V.ymin) / ny)) : w2_nice(V.ymax - V.ymin, ny);
    ctx.save();
    ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
    const X0 = Math.ceil(V.xmin / xs - 1e-9) * xs, Y0 = Math.ceil(V.ymin / ys - 1e-9) * ys;
    for (let x = X0; x <= V.xmax + 1e-9; x += xs) { ctx.moveTo(tx(x), mt); ctx.lineTo(tx(x), hh - mb); }
    for (let y = Y0; y <= V.ymax + 1e-9; y += ys) { ctx.moveTo(ml, ty(y)); ctx.lineTo(w - mr, ty(y)); }
    ctx.stroke();
    ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.moveTo(ml, mt - 6); ctx.lineTo(ml, hh - mb); ctx.lineTo(w - mr, hh - mb); ctx.stroke();
    ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted");
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let x = X0; x <= V.xmax + 1e-9; x += xs) if (tx(x) < w - mr - 8) ctx.fillText(fmt(x, 3), tx(x), hh - mb + 3);
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let y = Y0; y <= V.ymax + 1e-9; y += ys)
      ctx.fillText(V.log ? w2_pow10(Math.round(y)) : V.yfmt ? V.yfmt(y) : fmt(y, 3), ml - 4, ty(y));
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    if (V.yname) ctx.fillText(V.yname, ml + 5, 2);
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    if (V.xname) ctx.fillText(V.xname, w - mr, hh - mb - 3);
    ctx.restore();
    const clip = () => { ctx.beginPath(); ctx.rect(ml, mt - 6, w - ml - mr + 2, hh - mt - mb + 6); ctx.clip(); };
    return { tx, ty, clip, ml, mt, mb, mr };
  }
  /* jelmagyarázat a grafikon jobb felső sarkában: [[szöveg, szín, szaggatott?], …] */
  function w2_legend(cv, items, top = 4) {
    const { ctx, w } = cv;
    ctx.save(); ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "middle";
    let x = w - 10;
    for (let i = items.length - 1; i >= 0; i--) {
      const [t, c, dash] = items[i], tw = ctx.measureText(t).width;
      x -= tw; ctx.fillStyle = c; ctx.textAlign = "left"; ctx.fillText(t, x, top + 7);
      ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash(dash ? [4, 3] : []);
      ctx.beginPath(); ctx.moveTo(x - 20, top + 7); ctx.lineTo(x - 4, top + 7); ctx.stroke();
      x -= 30;
    }
    ctx.restore();
  }
  /* veszteség és pontosság egyetlen menetben (ugyanaz, mint net.loss és net.accuracy) */
  function w2_eval(net, X, Y) {
    let s = 0, ok = 0;
    for (let n = 0; n < X.length; n++) {
      const o = net.predict(X[n]);
      s += net.lossOf(o, net.target(Y[n], o.length));
      const c = net.out === "softmax" ? o.indexOf(Math.max(...o)) : (o[0] > 0.5 ? 1 : 0);
      if (c === Y[n]) ok++;
    }
    return [s / Math.max(1, X.length), ok / Math.max(1, X.length)];
  }
  const w2_lab = (txt, ...kids) => h("label", null, txt, ...kids);
  /* rögzített tizedesjegyszám (a záró nullák megmaradnak): 0,040 · 98,0% */
  const w2_fx = (x, d = 3) => { const t = x.toFixed(d); return (/^-0\.?0*$/.test(t) ? t.slice(1) : t).replace(".", ",").replace("-", "−"); };
  const w2_pc = (a, d = 1) => w2_fx(100 * a, d) + "%";

  /* ------------------------------------------------------------------
     10.5  optimizer-race – GD, momentum, RMSProp és Adam versenye 2D felületeken
     ------------------------------------------------------------------ */
  const OR_SURF = {
    bowl: {
      name: "hosszúkás tál", f: (x, y) => x * x + 3 * y * y, g: (x, y) => [2 * x, 6 * y],
      p0: [2, 1], min: [0, 0], view: [0, 0, 2.4, 1.4], eta: [0.1, 0.1], lv: [-2, 1.4], per: 3, formula: "L = x² + 3y²"
    },
    valley: {
      name: "keskeny völgy", f: (x, y) => 0.5 * (x * x + 25 * y * y), g: (x, y) => [x, 25 * y],
      p0: [-4, 1], min: [0, 0], view: [-1.2, 0, 3.4, 1.3], eta: [0.07, 0.1], lv: [-2, 2], per: 3, formula: "L = ½(x² + 25y²)"
    },
    rosen: {
      name: "Rosenbrock-völgy", f: (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2,
      g: (x, y) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)],
      p0: [-1.5, 2], min: [1, 1], view: [0, 1, 2, 2], eta: [0.001, 0.1], lv: [-1.5, 3.4], per: 2.5, formula: "L = (1 − x)² + 100(y − x²)²"
    }
  };
  const OR_M = [["gd", "GD", "--setA"], ["mom", "momentum", "--setB"], ["rms", "RMSProp", "--setC"], ["adam", "Adam", "--accent"]];
  /* η-értékek: 1–2–3–5–7-es lépcső 10⁻⁴ … 1 között (logaritmikus csúszka) */
  const OR_ETAS = (() => { const a = []; for (let e = -4; e < 0; e++) for (const m of [1, 2, 3, 5, 7]) a.push(+(m * 10 ** e).toPrecision(2)); a.push(1); return a; })();
  const OR_NMAX = 500;
  function or_contours(cv, T, f, levels, color) {
    const { ctx, w, h: hh } = cv, cell = 5, nx = Math.ceil(w / cell) + 1, ny = Math.ceil(hh / cell) + 1;
    const G = new Float64Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) G[j * nx + i] = Math.log10(Math.max(1e-300, f(T.ix(i * cell), T.iy(j * cell))));
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
    for (const lv of levels) {
      ctx.beginPath();
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = G[j * nx + i], b = G[j * nx + i + 1], c = G[(j + 1) * nx + i + 1], d = G[(j + 1) * nx + i];
        const x0 = i * cell, y0 = j * cell, e = [];
        const t = (p, q) => (lv - p) / (q - p);
        if ((a > lv) !== (b > lv)) e.push([x0 + cell * t(a, b), y0]);
        if ((b > lv) !== (c > lv)) e.push([x0 + cell, y0 + cell * t(b, c)]);
        if ((d > lv) !== (c > lv)) e.push([x0 + cell * t(d, c), y0 + cell]);
        if ((a > lv) !== (d > lv)) e.push([x0, y0 + cell * t(a, d)]);
        for (let k = 0; k + 1 < e.length; k += 2) { ctx.moveTo(e[k][0], e[k][1]); ctx.lineTo(e[k + 1][0], e[k + 1][1]); }
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  W["optimizer-race"] = root => {
    header(root, "Optimalizálók versenye a veszteségfelületen",
      "Négy módszer indul ugyanonnan a minimum felé: sima gradiens módszer (GD), momentum ($v \\leftarrow \\beta v + g$, $w \\leftarrow w - \\eta v$), " +
      "RMSProp ($s \\leftarrow \\rho s + (1-\\rho) g^2$, $w \\leftarrow w - \\eta\\, g/(\\sqrt{s}+\\varepsilon)$, $\\rho = 0{,}9$) és Adam ($\\beta_1 = 0{,}9$, $\\beta_2 = 0{,}999$). " +
      "Bal oldalt a szintvonalak (logaritmikus lépcsőkkel) és az utak, jobb oldalt a veszteség lépésenként, logaritmikus skálán. " +
      "Az RMSProp és az Adam lépésmérete nagyjából η, a gradiens nagyságától függetlenül – ezért kapnak külön η-t.");
    let surf = "bowl", eta = OR_SURF.bowl.eta.slice(), beta = 0.9, n = 0;
    const show = { gd: true, mom: true, rms: true, adam: true };
    let M = {};
    const gS = toggleGroup(Object.keys(OR_SURF).map(k => [k, OR_SURF[k].name]), () => surf, v => { surf = v; eta = OR_SURF[v].eta.slice(); beta = 0.9; reset(); });
    const cbs = OR_M.map(([k, name, col]) => {
      const c = checkbox(true, () => { show[k] = c.checked; draw(); });
      return [k, c, h("label", null, c, h("span", { style: `color:var(${col});font-weight:700` }, name))];
    });
    const sE = [0, 1].map(i => { const s = slider(0, OR_ETAS.length - 1, 1, 0); s.addEventListener("input", () => { eta[i] = OR_ETAS[+s.value]; reset(); }); return s; });
    const oE = [h("b"), h("b")];
    const gB = toggleGroup([["0.5", "0,5"], ["0.9", "0,9"], ["0.99", "0,99"]], () => String(beta), v => { beta = +v; reset(); });
    const bP = btn("▶ Indítás", () => { if (anim.running) anim.stop(); else { if (n >= OR_NMAX) reset(); anim.start(); } sync(); }, "btn primary");
    const bS = btn("1 lépés", () => { anim.stop(); if (n < OR_NMAX) stepAll(); sync(); });
    const bR = btn("↺ Újra", () => { anim.stop(); reset(); });
    const bX = btn("📖 A szöveg példája (10.5)", () => {
      anim.stop(); surf = "bowl"; eta = [0.1, OR_SURF.bowl.eta[1]]; beta = 0.5;
      Object.assign(show, { gd: true, mom: true, rms: false, adam: false });
      cbs.forEach(([k, c]) => (c.checked = show[k]));
      reset(false); for (let i = 0; i < 3; i++) stepAll(); sync();
    });
    root.append(h("div", { class: "controls" }, small("felület:"), gS.bs),
      h("div", { class: "controls" }, small("módszerek:"), cbs.map(c => c[2])),
      h("div", { class: "controls" }, w2_lab("η (GD, momentum): ", sE[0], oE[0]), w2_lab("η (RMSProp, Adam): ", sE[1], oE[1])),
      h("div", { class: "controls" }, small("β (momentum):"), gB.bs),
      h("div", { class: "controls" }, bP, bS, bR, bX));
    const [cv, cvL] = twoCanvas(root, 0.82, 0.82);
    const out = h("div", { class: "readout" });
    root.append(out);
    function mk() { const S = OR_SURF[surf]; return { p: S.p0.slice(), v: [0, 0], s: [0, 0], t: 0, path: [S.p0.slice()], loss: [S.f(...S.p0)], dead: 0 }; }
    function reset(doSync = true) {
      n = 0; M = {}; OR_M.forEach(([k]) => (M[k] = mk()));
      if (doSync) sync();
    }
    function stepOne(k) {
      const S = OR_SURF[surf], m = M[k];
      if (m.dead) return;
      const g = S.g(m.p[0], m.p[1]), lr = k === "gd" || k === "mom" ? eta[0] : eta[1];
      m.t++;
      for (let i = 0; i < 2; i++) {
        if (k === "gd") m.p[i] -= lr * g[i];
        else if (k === "mom") { m.v[i] = beta * m.v[i] + g[i]; m.p[i] -= lr * m.v[i]; }
        else if (k === "rms") { m.s[i] = 0.9 * m.s[i] + 0.1 * g[i] * g[i]; m.p[i] -= lr * g[i] / (Math.sqrt(m.s[i]) + 1e-8); }
        else {
          m.v[i] = 0.9 * m.v[i] + 0.1 * g[i]; m.s[i] = 0.999 * m.s[i] + 0.001 * g[i] * g[i];
          m.p[i] -= lr * (m.v[i] / (1 - 0.9 ** m.t)) / (Math.sqrt(m.s[i] / (1 - 0.999 ** m.t)) + 1e-8);
        }
      }
      const L = S.f(m.p[0], m.p[1]);
      if (!Number.isFinite(L) || L > 1e9 || Math.abs(m.p[0]) > 1e4 || Math.abs(m.p[1]) > 1e4) { m.dead = m.t; return; }
      m.path.push(m.p.slice()); m.loss.push(L);
    }
    function stepAll() { OR_M.forEach(([k]) => stepOne(k)); n++; }
    const anim = w2_anim(root, () => {
      for (let i = 0; i < 2 && n < OR_NMAX; i++) stepAll();
      if (n >= OR_NMAX) anim.stop();
      sync();
    });
    function draw() {
      const S = OR_SURF[surf], [cx, cy, hx, hy] = S.view;
      const V = eqView(cv, cx, cy, hx, hy, { xname: "x", yname: "y" });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      const levels = [];
      for (let k = Math.ceil(S.lv[0] * S.per); k <= S.lv[1] * S.per; k++) levels.push(k / S.per);
      or_contours(cv, T, S.f, levels, rgba(css("--muted"), 0.42));
      const [mx, my] = [T.tx(S.min[0]), T.ty(S.min[1])], tc = css("--text");
      ctx.save(); ctx.strokeStyle = tc; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mx - 5, my - 5); ctx.lineTo(mx + 5, my + 5); ctx.moveTo(mx + 5, my - 5); ctx.lineTo(mx - 5, my + 5); ctx.stroke(); ctx.restore();
      label(ctx, "minimum", mx + 7, my - 4, css("--muted"), "left", "600 11px system-ui, sans-serif");
      dot(ctx, T.tx(S.p0[0]), T.ty(S.p0[1]), 5, tc, true, 2);
      label(ctx, "start", T.tx(S.p0[0]) + 7, T.ty(S.p0[1]) - 4, css("--muted"), "left", "600 11px system-ui, sans-serif");
      OR_M.forEach(([k, , cvar]) => {
        if (!show[k]) return;
        const m = M[k], col = css(cvar);
        polyline(ctx, T, m.path, col, 2);
        if (m.path.length < 80) m.path.forEach(([x, y]) => dot(ctx, T.tx(x), T.ty(y), 2.6, col));
        const [x, y] = m.path[m.path.length - 1];
        dot(ctx, T.tx(x), T.ty(y), 6, css("--card")); dot(ctx, T.tx(x), T.ty(y), 4.5, col);
      });
      label(ctx, S.formula, 8, cv.h - 6, css("--text"), "left", "600 12px system-ui, sans-serif");
      /* veszteség lépésenként, logaritmikus y */
      const vis = OR_M.filter(([k]) => show[k]).map(([k]) => M[k]);
      const lg = v => Math.log10(Math.max(1e-12, v));
      let lo = 0, hi = 1;
      if (vis.length) { const all = vis.flatMap(m => m.loss.map(lg)); lo = Math.floor(Math.min(...all)); hi = Math.ceil(Math.max(...all)); }
      if (hi - lo < 2) lo = hi - 2;
      const T2 = w2_frame(cvL, { xmin: 0, xmax: Math.max(10, Math.ceil(n / 10) * 10), ymin: lo, ymax: hi, log: true, xname: "lépés", yname: "L (log)", xint: true });
      cvL.ctx.save(); T2.clip();
      OR_M.forEach(([k, , cvar]) => {
        if (!show[k]) return;
        const m = M[k], col = css(cvar);
        polyline(cvL.ctx, T2, m.loss.map((v, i) => [i, lg(v)]), col, 2);
        if (m.loss.length < 30) m.loss.forEach((v, i) => dot(cvL.ctx, T2.tx(i), T2.ty(lg(v)), 2.6, col));
        if (m.dead) { const i = m.loss.length - 1; label(cvL.ctx, "✕ szétszállt", T2.tx(i) + 4, T2.ty(lg(m.loss[i])) - 2, col, "left", "700 11px system-ui, sans-serif"); }
      });
      cvL.ctx.restore();
    }
    cv.draw = cvL.draw = () => draw();
    const pt = p => `(${fmt(p[0], 3)}; ${fmt(p[1], 3)})`;
    function sync() {
      gS.paint(); gB.paint();
      [0, 1].forEach(i => { sE[i].value = OR_ETAS.indexOf(eta[i]); oE[i].textContent = fmt(eta[i], 4); });
      bP.textContent = anim.running ? "⏸ Szünet" : "▶ Indítás";
      draw();
      const lines = OR_M.filter(([k]) => show[k]).map(([k, name, cvar]) => {
        const m = M[k], L = m.loss[m.loss.length - 1];
        const head = `<span style="color:var(${cvar});font-weight:700">${name}</span>: `;
        if (m.dead) return head + `<b>szétszállt</b> a(z) ${m.dead}. lépésben (túl nagy η)`;
        const path = n <= 5 ? m.path.map(pt).join(" → ") + " · " : `hely: ${pt(m.p)} · `;
        return head + path + `L = <b>${w2_sci(L)}</b>`;
      });
      out.innerHTML = `lépés: <b>${n}</b> / ${OR_NMAX} · ${OR_SURF[surf].name}, minimum: L = 0` +
        (show.mom ? ` · momentum β = ${fmt(beta, 2)}` : "") + "<br>" + (lines.length ? lines.join("<br>") : "Kapcsolj be legalább egy módszert!");
    }
    reset();
  };

  /* ------------------------------------------------------------------
     10.6  deep-signal – a jel és a gradiens nagysága egy mély hálóban
     ------------------------------------------------------------------ */
  const DS_INIT = [["0.5", "túl kicsi (c = 0,5)"], ["1", "Xavier/LeCun (c = 1)"], [String(Math.SQRT2), "He (c = √2)"], ["2", "túl nagy (c = 2)"]];
  const DS_B = 200, DS_LMAX = 50;
  W["deep-signal"] = root => {
    header(root, "Jel és gradiens egy mély hálóban",
      "Egy $L$ rétegű, $n$ széles teljesen összekötött háló (torzítás nélkül), a súlyok $\\mathcal N(0,\\ \\sigma^2)$ eloszlásúak, $\\sigma = c/\\sqrt{n}$. " +
      "Bemenet: 200 véletlen (standard normális) vektor. <b>Bal oldalt</b> az aktivációk szórása rétegenként (előre irányuló menet), " +
      "<b>jobb oldalt</b> a veszteség gradiensének szórása az egyes rétegek $z$-jére (visszafelé, a kimenetre adott véletlen gradiensből indulva). " +
      "Mindkét tengely függőlegesen logaritmikus: az egyenes vonal rétegenként azonos szorzót jelent.");
    let act = "relu", c = 1, L = 20, n = 100, ln = false, seed = 1;
    let res = null, wCache = { n: 0, Wg: [] };
    const gA = toggleGroup([["tanh", "tanh"], ["relu", "ReLU"]], () => act, v => { act = v; schedule(); });
    const gI = toggleGroup(DS_INIT, () => String(c), v => { c = +v; schedule(); });
    const sC = slider(0.2, 3, 0.01, c), oC = h("b"), sL = slider(1, DS_LMAX, 1, L), oL = h("b"), sN = slider(20, 200, 10, n), oN = h("b");
    sC.addEventListener("input", () => { c = +sC.value; schedule(); });
    /* a mélység és a szélesség drága: húzás közben csak a feliratot frissítjük, elengedéskor számolunk */
    sL.addEventListener("input", () => { L = +sL.value; syncCtl(); });
    sN.addEventListener("input", () => { n = +sN.value; syncCtl(); });
    sL.addEventListener("change", () => { L = +sL.value; schedule(); });
    sN.addEventListener("change", () => { n = +sN.value; schedule(); });
    const cLN = checkbox(false, () => { ln = cLN.checked; schedule(); });
    root.append(h("div", { class: "controls" }, small("aktiváció:"), gA.bs),
      h("div", { class: "controls" }, small("kezdősúlyok:"), gI.bs),
      h("div", { class: "controls" }, w2_lab("c: ", sC, oC), w2_lab("mélység L: ", sL, oL), w2_lab("szélesség n: ", sN, oN)),
      h("div", { class: "controls" }, h("label", null, cLN, "rétegnormalizálás (minden minta z-jét 0 átlagúra és 1 szórásúra igazítjuk)"),
        btn("🎲 Új minta", () => { seed++; schedule(); })));
    const [cvA, cvG] = twoCanvas(root, 0.78, 0.78);
    const out = h("div", { class: "readout" });
    root.append(out);
    /* standard normális súlyok rétegenként: rétegenként egy 200 × 200-as készlet, ennek bal felső n × n-es
       része a súlymátrix (gyorsítótárazva; c csak skáláz) */
    const pool = [];
    function weights(l) {
      while (pool.length <= l) {
        const r = ML.rng(7000 + pool.length), P = new Float64Array(200 * 200);
        for (let i = 0; i < P.length; i++) P[i] = ML.gauss(r);
        pool.push(P);
      }
      if (wCache.n !== n) wCache = { n, Wg: [] };
      while (wCache.Wg.length <= l) {
        const P = pool[wCache.Wg.length], M = new Float64Array(n * n);
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) M[j * n + i] = P[j * 200 + i];
        wCache.Wg.push(M);
      }
      return wCache.Wg[l];
    }
    function std(a) { let s = 0, q = 0; for (let i = 0; i < a.length; i++) { s += a[i]; q += a[i] * a[i]; } const m = s / a.length; return Math.sqrt(Math.max(0, q / a.length - m * m)); }
    function compute() {
      const B = DS_B, s = c / Math.sqrt(n), relu = act === "relu";
      const r = ML.rng(seed), X = new Float64Array(n * B);
      for (let i = 0; i < X.length; i++) X[i] = ML.gauss(r);
      const As = [X], Zh = [], sig = [], aStd = [std(X)];
      let a = X;
      for (let l = 0; l < L; l++) {
        const M = weights(l), z = new Float64Array(n * B);
        for (let j = 0; j < n; j++) {
          const zr = j * B;
          for (let i = 0; i < n; i++) { const w = s * M[j * n + i]; if (w === 0) continue; const ar = i * B; for (let b = 0; b < B; b++) z[zr + b] += w * a[ar + b]; }
        }
        let sg = null;
        if (ln) {                                   /* minden minta (oszlop) z-jét normalizáljuk */
          sg = new Float64Array(B);
          for (let b = 0; b < B; b++) {
            let m = 0, q = 0;
            for (let j = 0; j < n; j++) m += z[j * B + b];
            m /= n;
            for (let j = 0; j < n; j++) { const d = z[j * B + b] - m; q += d * d; }
            const sd = Math.sqrt(q / n + 1e-300);
            sg[b] = sd;
            for (let j = 0; j < n; j++) z[j * B + b] = (z[j * B + b] - m) / sd;
          }
        }
        const an = new Float64Array(n * B);
        for (let k = 0; k < an.length; k++) an[k] = relu ? (z[k] > 0 ? z[k] : 0) : Math.tanh(z[k]);
        Zh.push(z); sig.push(sg); As.push(an); aStd.push(std(an)); a = an;
      }
      /* visszafelé: g = ∂/∂a_L véletlen; δ_l = g ⊙ f'(ẑ) (rétegnormánál még a normalizálás deriváltja), g ← σ·Wᵀδ */
      const r2 = ML.rng(seed + 1);
      let g = new Float64Array(n * B);
      for (let i = 0; i < g.length; i++) g[i] = ML.gauss(r2);
      const gStd = new Array(L + 1).fill(NaN);
      for (let l = L - 1; l >= 0; l--) {
        const z = Zh[l], an = As[l + 1], d = new Float64Array(n * B);
        for (let k = 0; k < d.length; k++) d[k] = g[k] * (relu ? (z[k] > 0 ? 1 : 0) : 1 - an[k] * an[k]);
        if (ln) {
          const sg = sig[l];
          for (let b = 0; b < B; b++) {
            let m1 = 0, m2 = 0;
            for (let j = 0; j < n; j++) { m1 += d[j * B + b]; m2 += d[j * B + b] * z[j * B + b]; }
            m1 /= n; m2 /= n;
            for (let j = 0; j < n; j++) d[j * B + b] = (d[j * B + b] - m1 - z[j * B + b] * m2) / sg[b];
          }
        }
        gStd[l + 1] = std(d);
        if (l === 0) break;
        const M = weights(l), gn = new Float64Array(n * B);
        for (let j = 0; j < n; j++) {
          const dr = j * B;
          for (let i = 0; i < n; i++) { const w = s * M[j * n + i]; if (w === 0) continue; const gr = i * B; for (let b = 0; b < B; b++) gn[gr + b] += w * d[dr + b]; }
        }
        g = gn;
      }
      res = { aStd, gStd, L, c, act, ln, n };
    }
    let pend = 0;
    function schedule() { syncCtl(); if (!pend) pend = requestAnimationFrame(() => { pend = 0; compute(); sync(); }); }
    const lg = v => (v > 0 ? Math.log10(v) : -300);
    function plotLog(cv, pts, col, yname, xmin) {
      const ys = pts.map(p => p[1]).filter(Number.isFinite);
      let lo = Math.floor(Math.min(-1, ...ys) - 0.05), hi = Math.ceil(Math.max(1, ...ys) + 0.05);
      lo = Math.max(lo, -300);
      const T = w2_frame(cv, { xmin, xmax: Math.max(xmin + 2, res.L), ymin: lo, ymax: hi, log: true, xname: "réteg", yname, xint: true });
      const { ctx } = cv;
      ctx.save(); T.clip();
      polyline(ctx, T, [[xmin, 0], [res.L, 0]], css("--muted"), 1.2, [5, 4]);
      polyline(ctx, T, pts, col, 2.4);
      if (pts.length <= 60) pts.forEach(([x, y]) => dot(ctx, T.tx(x), T.ty(y), 3, col));
      ctx.restore();
    }
    function draw() {
      if (!res) return;
      plotLog(cvA, res.aStd.map((v, l) => [l, lg(v)]), css("--accent"), "aktivációk szórása", 0);
      plotLog(cvG, res.gStd.slice(1).map((v, l) => [l + 1, lg(v)]), css("--setB"), "gradiens szórása (∂/∂z)", 1);
    }
    cvA.draw = cvG.draw = () => draw();
    function syncCtl() {
      gA.paint(); gI.paint(); sC.value = c; oC.textContent = fmt(c, 2) + ` (σ = ${fmt(c / Math.sqrt(n), 3)})`;
      sL.value = L; oL.textContent = String(L); sN.value = n; oN.textContent = String(n); cLN.checked = ln;
    }
    function sync() {
      syncCtl(); draw();
      const { aStd, gStd } = res, aL = aStd[res.L], g1 = gStd[1], gL = gStd[res.L];
      const fac = Math.pow(aL / aStd[0], 1 / res.L);
      const bad = v => !(v > 1e-30 && v < 1e30);
      out.innerHTML = `aktivációk szórása – bemenet: <b>${w2_sci(aStd[0])}</b>, ${res.L}. (utolsó) réteg: <b>${w2_sci(aL)}</b> · rétegenként átlagosan <b>×${w2_sci(fac)}</b>` +
        `<br>gradiens szórása – ${res.L}. réteg: <b>${w2_sci(gL)}</b>, 1. réteg: <b>${w2_sci(g1)}</b> · arány (1. / ${res.L}.): <b>${w2_sci(g1 / gL)}</b>` +
        (bad(aL) || bad(g1) ? `<br><span class="muted">A jel ${aL < 1 || g1 < 1 ? "gyakorlatilag eltűnt" : "elszállt"} – ezzel a kezdéssel a háló nem tanítható.</span>` : "");
    }
    schedule();
  };

  /* ------------------------------------------------------------------
     10.7  train-monitor – túltanulás, L2, dropout, korai leállítás
     ------------------------------------------------------------------ */
  const TM_EMAX = 600, TM_PAT = 30, TM_NOISE = 0.25, TM_N = 30;
  W["train-monitor"] = root => {
    header(root, "Túltanulás élőben: tanító és validációs veszteség",
      `Kevés (${TM_N}), zajos tanítópont, nagy háló (2–32–32–1, ReLU, Adam, η = 0,01, 10-es kötegek). ` +
      "Bal oldalt a döntési térkép: telt pontok a tanítóadatok, halvány pontok a 300 validációs pont. " +
      "Jobb oldalt a két veszteség epochonként; a zöld függőleges vonal a legkisebb validációs veszteség helye. " +
      "Próbáld ki regularizáció nélkül, aztán L2-büntetéssel ($\\lambda$), dropouttal, illetve korai leállítással (türelem: 30 epoch).");
    let l2 = 0, dropout = 0, early = false, seed = 2;
    let tr, va, net, rnd, epoch, hist, best, stopped, last;
    const gL = toggleGroup([["0", "0"], ["0.001", "0,001"], ["0.01", "0,01"], ["0.03", "0,03"]], () => String(l2), v => { l2 = +v; anim.stop(); reset(); });
    const gD = toggleGroup([["0", "0"], ["0.2", "0,2"], ["0.5", "0,5"]], () => String(dropout), v => { dropout = +v; anim.stop(); reset(); });
    const cE = checkbox(false, () => { early = cE.checked; anim.stop(); reset(); });
    const bP = btn("▶ Tanítás", () => { if (anim.running) anim.stop(); else { if (stopped) reset(); anim.start(); } sync(); }, "btn primary");
    root.append(h("div", { class: "controls" }, small("L2-büntetés λ:"), gL.bs),
      h("div", { class: "controls" }, small("dropout p:"), gD.bs),
      h("div", { class: "controls" }, h("label", null, cE, `korai leállítás (türelem: ${TM_PAT} epoch)`)),
      h("div", { class: "controls" }, bP, btn("↺ Újra", () => { anim.stop(); reset(); }), btn("🎲 Új adat", () => { anim.stop(); seed++; newData(); })));
    const [cv, cvL] = twoCanvas(root, 0.82, 0.82);
    const out = h("div", { class: "readout" });
    root.append(out);
    const copyW = () => ({ W: net.W.map(M => M.map(r => r.slice())), b: net.b.map(v => v.slice()) });
    function newData() {
      tr = ML.data.moons(TM_N, seed, TM_NOISE); va = ML.data.moons(300, seed + 5000, TM_NOISE);
      reset();
    }
    function reset() {
      net = new ML.MLP([2, 32, 32, 1], { act: "relu", out: "sigmoid", seed: 1 }); rnd = ML.rng(seed + 100);
      epoch = 0; stopped = "";
      const et = w2_eval(net, tr.X, tr.y), ev = w2_eval(net, va.X, va.y);
      hist = [[et[0], ev[0]]]; last = { et, ev };
      best = { lv: ev[0], e: 0, ...copyW() };
      sync();
    }
    function trainEpoch() {
      net.epoch(tr.X, tr.y, { batch: 10, lr: 0.01, opt: "adam", l2, dropout, rnd });
      epoch++;
      const lt = net.loss(tr.X, tr.y), lv = net.loss(va.X, va.y);
      hist.push([lt, lv]);
      if (lv < best.lv) best = { lv, e: epoch, ...copyW() };
      if (early && epoch - best.e >= TM_PAT) {
        net.W = best.W.map(M => M.map(r => r.slice())); net.b = best.b.map(v => v.slice());
        stopped = "early";
      } else if (epoch >= TM_EMAX) stopped = "max";
    }
    const anim = w2_anim(root, () => {
      for (let k = 0; k < 4 && !stopped; k++) trainEpoch();
      if (stopped) anim.stop();
      last = { et: w2_eval(net, tr.X, tr.y), ev: w2_eval(net, va.X, va.y) };
      sync();
    });
    function draw() {
      const V = eqView(cv, 0, 0, 1.05, 0.92, { xname: "x₁", yname: "x₂", labels: false });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      decisionMap(cv, T, V, (p, q) => net.predict([p, q])[0], 5, 0.24);
      const r = cv.w < 300 ? 3.2 : 4.2;
      va.X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), r * 0.55, rgba(va.y[i] ? C1() : C0(), 0.7)));
      tr.X.forEach((p, i) => { dot(ctx, T.tx(p[0]), T.ty(p[1]), r + 1.3, css("--card")); dot(ctx, T.tx(p[0]), T.ty(p[1]), r, tr.y[i] ? C1() : C0()); });
      /* veszteséggörbék */
      const top = Math.max(0.8, ...hist.map(v => Math.min(2, Math.max(v[0], v[1]))));
      const xmax = Math.max(100, Math.ceil(epoch / 100) * 100);
      const T2 = w2_frame(cvL, { xmin: 0, xmax, ymin: 0, ymax: top * 1.05, xname: "epoch", yname: "veszteség", xint: true });
      const c2 = cvL.ctx, step = Math.max(1, Math.floor(hist.length / 400));
      c2.save(); T2.clip();
      if (best.e > 0) {
        polyline(c2, T2, [[best.e, 0], [best.e, top * 1.05]], css("--setC"), 1.6, [5, 4]);
        label(c2, `legjobb: ${best.e}.`, T2.tx(best.e) + 4, T2.mt + 22, css("--setC"), "left", "600 11px system-ui, sans-serif");
      }
      const pts = j => hist.map((v, i) => [i, v[j]]).filter((_, i) => i % step === 0 || i === hist.length - 1);
      polyline(c2, T2, pts(0), css("--accent"), 2);
      polyline(c2, T2, pts(1), css("--setB"), 2.2, [6, 3]);
      if (hist.length === 1) { dot(c2, T2.tx(0), T2.ty(hist[0][0]), 3.5, css("--accent")); dot(c2, T2.tx(0), T2.ty(hist[0][1]), 3.5, css("--setB")); }
      c2.restore();
      w2_legend(cvL, [["tanító", css("--accent")], ["validációs", css("--setB"), true]]);
    }
    cv.draw = cvL.draw = () => draw();
    function sync() {
      gL.paint(); gD.paint(); cE.checked = early;
      bP.textContent = anim.running ? "⏸ Leállítás" : "▶ Tanítás";
      draw();
      const { et, ev } = last;
      const st = stopped === "early" ? `<br><b>Korai leállítás</b> a(z) ${epoch}. epochban: ${TM_PAT} epoch óta nem javult a validációs veszteség – visszaállítottuk a(z) ${best.e}. epoch súlyait (a fenti értékek már ezekre vonatkoznak).`
        : stopped === "max" ? `<br><span class="muted">Elértük a ${TM_EMAX} epochot.</span>` : "";
      out.innerHTML = `epoch: <b>${epoch}</b> · veszteség – tanító: <b>${w2_fx(et[0], 3)}</b>, validációs: <b>${w2_fx(ev[0], 3)}</b>` +
        ` · legjobb validációs: <b>${w2_fx(best.lv, 3)}</b> (${best.e}. epoch)` +
        `<br>pontosság – tanító: <b>${w2_pc(et[1], 0)}</b>, validációs: <b>${w2_pc(ev[1], 1)}</b>` + st;
    }
    newData();
  };

  /* ------------------------------------------------------------------
     10.9  digit-trainer – 64–h–10-es háló tanítása a böngészőben (digits)
     ------------------------------------------------------------------ */
  const DT_OPT = [["sgd", "SGD", 0.1], ["momentum", "momentum", 0.05], ["rmsprop", "RMSProp", 0.003], ["adam", "Adam", 0.01]];
  const DT_INIT = [["auto", "He (alap)"], ["zero", "nulla"], ["1", "túl nagy (σ = 1)"]];
  let dt_cache = null;
  function dt_data() {
    if (dt_cache) return dt_cache;
    const D = window.DIGITS10;
    const dec = p => {
      const X = [];
      for (let i = 0; i < p.n; i++) { const r = new Array(64); for (let j = 0; j < 64; j++) r[j] = (p.X.charCodeAt(i * 64 + j) - 97) / 16; X.push(r); }
      return { X, y: [...p.y].map(Number) };
    };
    dt_cache = { train: dec(D.train), val: dec(D.val), test: dec(D.test) };
    return dt_cache;
  }
  W["digit-trainer"] = root => {
    header(root, "Tanítsd be te: számjegyfelismerő a böngészőben",
      "Egy 64–h–10-es hálót (ReLU rejtett réteg, softmax kimenet, keresztentrópia) tanítunk 1047 kézzel írt 8 × 8-as számjegyen; " +
      "300 kép a validáció, 450 a teszt. Állítsd be az optimalizálót, a köteg méretét, a regularizációt és a kezdősúlyokat, majd indítsd. " +
      "Bal oldalt a veszteség, jobb oldalt a pontosság epochonként; a zöld vonal a legkisebb validációs veszteség epochja. A végén a teszt pontosság.");
    if (!window.DIGITS10) { root.append(h("p", { class: "muted" }, "Az adatok nem töltődtek be (digits-data.js).")); return; }
    const D = dt_data();
    let hid = 16, opt = "adam", mult = 1, batch = 32, dropout = 0, l2 = 0, init = "auto", ntrain = 1047, epochs = 30, seed = 1;
    let net, rnd, T, epoch, hist, done, testAcc, wrong, lr;
    const re = () => { anim.stop(); build(); };
    const gH = toggleGroup([["4", "4"], ["16", "16"], ["64", "64"]], () => String(hid), v => { hid = +v; re(); });
    const gO = toggleGroup(DT_OPT.map(([k, n, e]) => [k, `${n} (η = ${fmt(e, 3)})`]), () => opt, v => { opt = v; re(); });
    const gM = toggleGroup([["0.1", "×0,1"], ["1", "×1"], ["10", "×10"]], () => String(mult), v => { mult = +v; re(); });
    const gB = toggleGroup([["1", "1"], ["8", "8"], ["16", "16"], ["32", "32"], ["128", "128"], ["1047", "teljes"]], () => String(batch), v => { batch = +v; re(); });
    const gD = toggleGroup([["0", "0"], ["0.2", "0,2"], ["0.5", "0,5"]], () => String(dropout), v => { dropout = +v; re(); });
    const gL = toggleGroup([["0", "0"], ["0.001", "0,001"], ["0.01", "0,01"]], () => String(l2), v => { l2 = +v; re(); });
    const gI = toggleGroup(DT_INIT, () => String(init), v => { init = v === "1" ? 1 : v; re(); });
    const gN = toggleGroup([["100", "100"], ["200", "200"], ["1047", "mind (1047)"]], () => String(ntrain), v => { ntrain = +v; re(); });
    const sE = slider(10, 150, 10, epochs), oE = h("b"), oS = h("b");
    sE.addEventListener("input", () => { epochs = +sE.value; if (epoch < epochs) done = false; else if (!done) finish(); sync(); });
    const bP = btn("▶ Tanítás", () => { if (anim.running) anim.stop(); else { if (done) build(); anim.start(); } sync(); }, "btn primary");
    const bO = btn("Túltanulás-kísérlet", () => {
      hid = 64; ntrain = 100; opt = "adam"; mult = 1; batch = 16; dropout = 0; l2 = 0; init = "auto"; epochs = 150; re();
    });
    const bA = btn("Alapbeállítás", () => {
      hid = 16; ntrain = 1047; opt = "adam"; mult = 1; batch = 32; dropout = 0; l2 = 0; init = "auto"; epochs = 30; seed = 1; re();
    });
    root.append(
      h("div", { class: "controls" }, small("optimalizáló:"), gO.bs),
      h("div", { class: "controls" }, small("η szorzója:"), gM.bs, small("köteg:"), gB.bs),
      h("div", { class: "controls" }, small("rejtett neuronok h:"), gH.bs, small("tanítóképek:"), gN.bs),
      h("div", { class: "controls" }, small("dropout:"), gD.bs, small("L2 λ:"), gL.bs),
      h("div", { class: "controls" }, small("kezdősúlyok:"), gI.bs),
      h("div", { class: "controls" }, w2_lab("epochok: ", sE, oE), h("span", { style: "display:inline-flex;gap:.4rem;align-items:center" }, small("mag:"), btn("−", () => { if (seed > 1) { seed--; re(); } }), oS, btn("+", () => { seed++; re(); }))),
      h("div", { class: "controls" }, bP, btn("↺ Újra", re), bO, bA));
    const [cvL, cvA] = twoCanvas(root, 0.78, 0.78);
    const boxM = h("div", { style: "display:none;margin-top:.5rem" });
    root.append(boxM);
    boxM.append(h("div", { class: "muted", style: "font-size:.88rem;margin-bottom:.25rem" }, "Néhány tévesztett tesztkép (valódi → tipp):"));
    const cvM = Calc.canvas(boxM, 0.16, 760);
    const out = h("div", { class: "readout" });
    root.append(out);
    function build() {
      T = ntrain < 1047 ? { X: D.train.X.slice(0, ntrain), y: D.train.y.slice(0, ntrain) } : D.train;
      lr = DT_OPT.find(o => o[0] === opt)[2] * mult;
      net = new ML.MLP([64, hid, 10], { act: "relu", out: "softmax", seed, init });
      rnd = ML.rng(seed + 100);
      epoch = 0; done = false; testAcc = null; wrong = [];
      hist = [[...w2_eval(net, T.X, T.y), ...w2_eval(net, D.val.X, D.val.y)]];
      boxM.style.display = "none";
      sync();
    }
    function finish() {
      done = true;
      testAcc = w2_eval(net, D.test.X, D.test.y)[1];
      const bad = [];
      D.test.X.forEach((x, i) => { const o = net.predict(x), p = o.indexOf(Math.max(...o)); if (p !== D.test.y[i]) bad.push([i, p]); });
      wrong = ML.shuffle(bad, ML.rng(seed + 3)).slice(0, 8);
    }
    const anim = w2_anim(root, () => {
      const t0 = performance.now();
      while (epoch < epochs) {
        net.epoch(T.X, T.y, { batch, lr, opt, l2, dropout, rnd });
        epoch++;
        hist.push([...w2_eval(net, T.X, T.y), ...w2_eval(net, D.val.X, D.val.y)]);
        if (performance.now() - t0 >= 25) break;
      }
      if (epoch >= epochs) { finish(); anim.stop(); }
      sync();
    });
    const bestE = () => hist.reduce((b, v, i) => (v[2] < hist[b][2] ? i : b), 0);
    const ink = () => hexRGB(css("--text")), bgc = () => hexRGB(css("--card"));
    function draw() {
      const xmax = Math.max(epochs, epoch), be = bestE(), step = Math.max(1, Math.floor(hist.length / 300));
      const top = Math.max(0.5, ...hist.map(v => Math.min(3, Math.max(v[0], v[2]))));
      const sel = j => hist.map((v, i) => [i, v[j]]).filter((_, i) => i % step === 0 || i === hist.length - 1);
      const T1 = w2_frame(cvL, { xmin: 0, xmax, ymin: 0, ymax: top * 1.05, xname: "epoch", yname: "veszteség", xint: true });
      const c1 = cvL.ctx;
      c1.save(); T1.clip();
      if (be > 0) polyline(c1, T1, [[be, 0], [be, top * 1.05]], css("--setC"), 1.6, [5, 4]);
      polyline(c1, T1, sel(0), css("--accent"), 2);
      polyline(c1, T1, sel(2), css("--setB"), 2.2, [6, 3]);
      if (hist.length === 1) { dot(c1, T1.tx(0), T1.ty(hist[0][0]), 3.5, css("--accent")); dot(c1, T1.tx(0), T1.ty(hist[0][2]), 3.5, css("--setB")); }
      c1.restore();
      w2_legend(cvL, [["tanító", css("--accent")], ["validációs", css("--setB"), true]]);
      const T2 = w2_frame(cvA, { xmin: 0, xmax, ymin: 0, ymax: 1, xname: "epoch", yname: "pontosság", xint: true, yfmt: y => fmt(100 * y, 0) + "%" });
      const c2 = cvA.ctx;
      c2.save(); T2.clip();
      if (be > 0) polyline(c2, T2, [[be, 0], [be, 1]], css("--setC"), 1.6, [5, 4]);
      polyline(c2, T2, sel(1), rgba(css("--accent"), 0.5), 1.8);
      polyline(c2, T2, sel(3), css("--setB"), 2.4);
      c2.restore();
      w2_legend(cvA, [["tanító", rgba(css("--accent"), 0.6)], ["validációs", css("--setB")]], cvA.h - 52);
    }
    cvL.draw = cvA.draw = () => draw();
    cvM.draw = () => {
      if (!wrong.length) return;
      const { ctx, w, h: hh } = cvM, cell = w / 8, sz = Math.min(cell - 10, hh - 20), px = sz / 8, a = ink(), b = bgc();
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      wrong.forEach(([i, p], k) => {
        const x0 = k * cell + (cell - sz) / 2, x = D.test.X[i];
        for (let q = 0; q < 64; q++) {
          const t = x[q];
          ctx.fillStyle = `rgb(${b.map((v, j) => Math.round(v + (a[j] - v) * t)).join(",")})`;
          ctx.fillRect(x0 + (q % 8) * px, 2 + Math.floor(q / 8) * px, px + 0.5, px + 0.5);
        }
        ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(x0, 2, sz, sz); ctx.restore();
        label(ctx, `${D.test.y[i]} → ${p}`, x0 + sz / 2, 2 + sz + 15, css("--text"), "center", "700 12px system-ui, sans-serif");
      });
    };
    function sync() {
      gH.paint(); gO.paint(); gM.paint(); gB.paint(); gD.paint(); gL.paint(); gI.paint(); gN.paint();
      sE.value = epochs; oE.textContent = String(epochs); oS.textContent = String(seed);
      bP.textContent = anim.running ? "⏸ Leállítás" : "▶ Tanítás";
      draw();
      const v = hist[epoch], be = bestE();
      if (done && wrong.length) { const was = boxM.style.display; boxM.style.display = ""; if (was === "none") cvM.resize(); cvM.draw(); }
      else boxM.style.display = "none";
      out.innerHTML = `epoch: <b>${epoch}</b> / ${epochs} · η = ${fmt(lr, 4)} · köteg: ${batch >= T.X.length ? "teljes (" + T.X.length + ")" : batch} · paraméterek: ${net.nParams}` +
        `<br>veszteség – tanító: <b>${w2_fx(v[0], 3)}</b>, validációs: <b>${w2_fx(v[2], 3)}</b> · pontosság – tanító: <b>${w2_pc(v[1], 1)}</b>, validációs: <b>${w2_pc(v[3], 1)}</b>` +
        (epoch > 0 ? `<br>legkisebb validációs veszteség: <b>${w2_fx(hist[be][2], 3)}</b> (${be}. epoch, ott a validációs pontosság ${w2_pc(hist[be][3], 1)})` : "") +
        (done ? `<br>kész · <b>teszt pontosság</b> (450 kép): <b>${w2_pc(testAcc, 1)}</b>` : "");
    }
    build();
  };
