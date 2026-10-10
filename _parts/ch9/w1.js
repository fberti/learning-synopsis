
  /* ------------------------------------------------------------------
     9.1  neuron-lab – egy neuron: súlyok, torzítás, aktiváció
     ------------------------------------------------------------------ */
  const NL_ACT = [["step", "lépcső"], ["sigmoid", "szigmoid"], ["relu", "ReLU"], ["tanh", "tanh"]];
  const NL_PRE = {
    and: { w1: 1, w2: 1, b: -1.5, act: "step", name: "ÉS" },
    or: { w1: 1, w2: 1, b: -0.5, act: "step", name: "VAGY" },
    not: { w1: -1, w2: 0, b: 0.5, act: "step", name: "NEM x₁" },
    nand: { w1: -1, w2: -1, b: 1.5, act: "step", name: "NEM-ÉS" },
    ex: { w1: 0.5, w2: -1, b: 1, act: "sigmoid", name: "példa", x: [1, 2] }
  };
  W["neuron-lab"] = root => {
    header(root, "Egy neuron közelről",
      "A neuron kiszámolja a $z = w_1x_1 + w_2x_2 + b$ súlyozott összeget, majd átengedi egy $\\varphi$ aktivációs függvényen: $a = \\varphi(z)$. " +
      "<b>Bal oldalt</b> a bemenetek síkja: a háttér színe a kimenet (sötétebb = nagyobb), a szaggatott vonal a $z = 0$ egyenes, a nyíl a $\\mathbf w = (w_1, w_2)$ súlyvektor. " +
      "A nagy pont a bemenet – húzd el! <b>Jobb oldalt</b> az aktivációs függvény, rajta a mostani $z$ és $a$.");
    let w1 = 0.5, w2 = -1, b = 1, act = "sigmoid", x = [1, 2], pre = "ex";
    const sl = {};
    const mk = (key, lab, min, max, step) => {
      const s = slider(min, max, step, 0), o = h("b");
      s.addEventListener("input", () => { set(key, +s.value); pre = null; sync(); });
      sl[key] = { s, o };
      return h("label", null, lab, s, o);
    };
    const set = (k, v) => { if (k === "w1") w1 = v; else if (k === "w2") w2 = v; else if (k === "b") b = v; else if (k === "x1") x[0] = v; else x[1] = v; };
    const gA = toggleGroup(NL_ACT, () => act, v => { act = v; pre = null; sync(); });
    const gP = toggleGroup(Object.entries(NL_PRE).map(([k, o]) => [k, o.name]), () => pre, k => {
      const o = NL_PRE[k]; w1 = o.w1; w2 = o.w2; b = o.b; act = o.act; if (o.x) x = o.x.slice(); pre = k; sync();
    });
    root.append(h("div", { class: "controls" }, small("aktiváció:"), gA.bs),
      h("div", { class: "controls" }, mk("w1", "w₁ =", -3, 3, 0.1), mk("w2", "w₂ =", -3, 3, 0.1), mk("b", "b =", -3, 3, 0.1)),
      h("div", { class: "controls" }, mk("x1", "x₁ =", -2, 2, 0.1), mk("x2", "x₂ =", -2, 2, 0.1)),
      h("div", { class: "controls" }, small("beállítás:"), gP.bs));
    const [cvL, cvR] = twoCanvas(root, 1, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const f = z => A()[act].f(z);
    let TL = null, VL = null;
    cvL.draw = () => {
      VL = eqView(cvL, 0.3, 0.3, 2.3, 2.3, { xname: "x₁", yname: "x₂" });
      TL = Calc.plot(cvL, VL, []);
      const { ctx, w, h: hh } = cvL, c = hexRGB(css("--accent")), cb = hexRGB(css("--bad")), cell = 6;
      const rng = act === "relu" ? Math.max(1, ...[[VL.xmin, VL.ymin], [VL.xmin, VL.ymax], [VL.xmax, VL.ymin], [VL.xmax, VL.ymax]].map(([p, q]) => f(w1 * p + w2 * q + b))) : 1;
      for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
        const a = f(w1 * TL.ix(px + cell / 2) + w2 * TL.iy(py + cell / 2) + b);
        const t = act === "tanh" ? a : a / rng, col = t >= 0 ? c : cb;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.42 * Math.min(1, Math.abs(t))})`;
        ctx.fillRect(px, py, cell, cell);
      }
      const L = lineFrom(w1, w2, b, VL);
      if (L) polyline(ctx, TL, L, css("--text"), 1.6, [6, 4]);
      arrow(ctx, TL.tx(0), TL.ty(0), TL.tx(w1 * 0.5), TL.ty(w2 * 0.5), css("--setC"), 2.4);
      label(ctx, "w (fele)", TL.tx(w1 * 0.5) + 6, TL.ty(w2 * 0.5) - 2, css("--setC"));
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([p, q]) => {
        const a = f(w1 * p + w2 * q + b);
        dot(ctx, TL.tx(p), TL.ty(q), 4.5, css("--muted"), true, 1.6);
        if (act === "step") label(ctx, String(a), TL.tx(p) + 6, TL.ty(q) - 4, css("--text"), "left", "700 12px system-ui, sans-serif");
      });
      dot(ctx, TL.tx(x[0]), TL.ty(x[1]), 8, css("--card"));
      dot(ctx, TL.tx(x[0]), TL.ty(x[1]), 6.5, css("--setB"));
    };
    cvR.draw = () => {
      const V = act === "relu" ? { xmin: -6, xmax: 6, ymin: -1, ymax: 6, xname: "z", yname: "a = φ(z)" }
        : act === "tanh" ? { xmin: -6, xmax: 6, ymin: -1.3, ymax: 1.3, xname: "z", yname: "a = φ(z)" }
          : { xmin: -6, xmax: 6, ymin: -0.25, ymax: 1.25, xname: "z", yname: "a = φ(z)" };
      const z = w1 * x[0] + w2 * x[1] + b, a = f(z);
      const T = Calc.plot(cvR, V, act === "step"
        ? [{ seg: [[-6, 0], [0, 0]], color: "--accent", width: 2.6 }, { seg: [[0, 1], [6, 1]], color: "--accent", width: 2.6 }]
        : [{ f, color: "--accent" }]);
      const { ctx } = cvR;
      if (act === "step") { dot(ctx, T.tx(0), T.ty(0), 4, css("--accent")); dot(ctx, T.tx(0), T.ty(1), 4, css("--accent"), true); }
      const zc = clamp(z, V.xmin, V.xmax);
      polyline(ctx, T, [[zc, 0], [zc, clamp(a, V.ymin, V.ymax)]], css("--setB"), 1.4, [4, 3]);
      dot(ctx, T.tx(zc), T.ty(clamp(a, V.ymin, V.ymax)), 6, css("--setB"));
      label(ctx, `z = ${fmt(z, 2)}`, T.tx(zc), T.ty(0) + 16, css("--setB"), "center", "700 12px system-ui, sans-serif", "top");
    };
    let drag = false;
    const pick = e => {
      if (!TL) return;
      const [px, py] = evXY(cvL, e);
      x = [clamp(Math.round(TL.ix(px) * 10) / 10, -2, 2), clamp(Math.round(TL.iy(py) * 10) / 10, -2, 2)];
      pre = pre && NL_PRE[pre].x ? null : pre; sync();
    };
    cvL.c.addEventListener("pointerdown", e => { drag = true; cvL.c.setPointerCapture(e.pointerId); pick(e); });
    cvL.c.addEventListener("pointermove", e => drag && pick(e));
    cvL.c.addEventListener("pointerup", () => { drag = false; });
    function sync() {
      gA.paint(); gP.paint();
      for (const [k, v] of [["w1", w1], ["w2", w2], ["b", b], ["x1", x[0]], ["x2", x[1]]]) { sl[k].s.value = v; sl[k].o.textContent = fmt(v, 1); }
      cvL.draw(); cvR.draw();
      const z = w1 * x[0] + w2 * x[1] + b, a = f(z);
      let s = `z = w₁x₁ + w₂x₂ + b = ${par(w1, 1)}·${par(x[0], 1)} + ${par(w2, 1)}·${par(x[1], 1)} + ${par(b, 1)} = <b>${fmt(z, 2)}</b>` +
        `<br>a = ${A()[act].name}(${fmt(z, 2)}) = <b>${fmt(a, 4)}</b>`;
      if (act === "step") {
        const tt = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([p, q]) => `(${p}, ${q}) → ${f(w1 * p + w2 * q + b)}`).join(" · ");
        s += `<br>a négy sarokpont kimenete: ${tt}`;
      }
      s += `<br><span class="muted">A $z = 0$ egyenes két oldalán a súlyozott összeg előjele más. A súlyvektor arra mutat, amerre $z$ a leggyorsabban nő; a torzítás $b$ az egyenest tolja el, nem forgatja.</span>`;
      out.innerHTML = s; math(out);
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.2  perceptron-train – a perceptron tanulási szabálya lépésenként
     ------------------------------------------------------------------ */
  const PC_DS = [["or", "VAGY"], ["and", "ÉS"], ["xor", "XOR"], ["cloud", "felhő (szétválasztható)"], ["overlap", "átfedő felhő"]];
  function pcData(ds) {
    const X4 = [[0, 0], [0, 1], [1, 0], [1, 1]];
    if (ds === "or") return { X: X4, y: [0, 1, 1, 1] };
    if (ds === "and") return { X: X4, y: [0, 0, 0, 1] };
    if (ds === "xor") return { X: X4, y: [0, 1, 1, 0] };
    const r = ML.rng(ds === "cloud" ? 7 : 8), X = [], y = [];
    const sep = ds === "cloud" ? 0.55 : 0.18;
    while (X.length < 24) {
      const c = X.length % 2, a = (c ? sep : -sep) + 0.32 * ML.gauss(r), b = (c ? sep * 0.6 : -sep * 0.6) + 0.32 * ML.gauss(r);
      if (ds === "cloud" && (c ? 1 : -1) * (a + 0.6 * b) < 0.12) continue;   // margó a szétválaszthatósághoz
      X.push([clamp(a, -1.25, 1.25), clamp(b, -1.25, 1.25)]); y.push(c);
    }
    return { X, y };
  }
  W["perceptron-train"] = root => {
    header(root, "A perceptron tanul",
      "A perceptron sorban végigmegy a mintákon. Ha a jóslata ($\\hat y = 1$, ha $z \\gt 0$, különben 0) eltér a címkétől, módosít: " +
      "$\\mathbf w \\leftarrow \\mathbf w + \\eta\\,(y - \\hat y)\\,\\mathbf x$, $\\ b \\leftarrow b + \\eta\\,(y - \\hat y)$. Kezdés: minden súly 0. " +
      "Telt pont: 1-es címke; üres pont: 0-s. A színes háttér az, ahol a perceptron 1-et mond. Egy <b>epoch</b> = egy kör az összes mintán.");
    let ds = "or", eta = 1, rev = false, D = pcData(ds), w = [0, 0], b = 0, ptr = 0, ep = 1, errsEp = 0, epErrs = [], log = [], done = false, seen = new Map(), cyc = null, lastI = -1, nUpd = 0;
    const gD = toggleGroup(PC_DS, () => ds, v => { ds = v; D = pcData(ds); reset(); });
    const sE = slider(0.1, 1, 0.1, eta), oE = h("b");
    sE.addEventListener("input", () => { eta = +sE.value; reset(); });
    const cR = checkbox(rev, () => { rev = cR.checked; reset(); });
    const b1 = btn("1 minta", () => { stepOne(); sync(); }, "btn primary");
    const bE = btn("1 epoch", () => { const e0 = ep; let g = 0; while (!done && ep === e0 && g++ < 999) stepOne(); sync(); }, "btn primary");
    const bR = btn("▶ amíg hibátlan (legfeljebb 50 epoch)", () => { let g = 0; while (!done && ep <= 50 && g++ < 99999) stepOne(); sync(); });
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, h("label", null, "η = ", sE, oE), h("label", null, cR, "fordított mintasorrend"), btn("↺ Elölről", reset)),
      h("div", { class: "controls" }, b1, bE, bR));
    const [cv, cvB] = twoCanvas(root, 1, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const order = () => { const idx = D.X.map((_, i) => i); return rev ? idx.reverse() : idx; };
    function reset() { w = [0, 0]; b = 0; ptr = 0; ep = 1; errsEp = 0; epErrs = []; log = []; done = false; seen = new Map(); cyc = null; lastI = -1; nUpd = 0; sync(); }
    function stepOne() {
      if (done) return;
      const idx = order(), i = idx[ptr], [x1, x2] = D.X[i], y = D.y[i];
      const z = w[0] * x1 + w[1] * x2 + b, yh = z > 0 ? 1 : 0, d = y - yh;
      if (d) { w = [w[0] + eta * d * x1, w[1] + eta * d * x2]; b += eta * d; errsEp++; nUpd++; }
      log.push({ ep, x: D.X[i], y, z, yh, d, w: w.slice(), b });
      if (log.length > 60) log.shift();
      lastI = i; ptr++;
      if (ptr === idx.length) {
        epErrs.push(errsEp);
        if (errsEp === 0) done = true;
        else {
          const key = [w[0], w[1], b].map(v => v.toFixed(6)).join("|");
          if (seen.has(key) && !cyc) cyc = { from: seen.get(key), to: ep };
          if (!seen.has(key)) seen.set(key, ep);
        }
        ptr = 0; ep++; errsEp = 0;
      }
    }
    const logic = () => ["or", "and", "xor"].includes(ds);
    cv.draw = () => {
      const V = logic() ? eqView(cv, 0.5, 0.5, 0.95, 0.95, { xname: "x₁", yname: "x₂" }) : eqView(cv, 0, 0, 1.35, 1.35, { xname: "x₁", yname: "x₂" });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      decisionMap(cv, T, V, (p, q) => (w[0] * p + w[1] * q + b > 0 ? 0.85 : 0.15), 6, 0.3);
      const L = lineFrom(w[0], w[1], b, V);
      if (L && (w[0] || w[1])) polyline(ctx, T, L, css("--text"), 2);
      D.X.forEach((p, i) => {
        const col = D.y[i] ? C1() : C0(), r = logic() ? 7 : 5;
        dot(ctx, T.tx(p[0]), T.ty(p[1]), r, col, !D.y[i], 2.4);
        if (i === lastI) ring(ctx, T.tx(p[0]), T.ty(p[1]), r + 5, css("--text"), 2, [3, 2]);
      });
    };
    cvB.draw = () => {
      const n = epErrs.length, top = Math.max(2, ...epErrs, D.X.length / 2);
      const T = Calc.plot(cvB, { xmin: 0, xmax: Math.max(8, n) + 1, ymin: 0, ymax: top * 1.15, xstep: Math.max(1, Math.ceil(Math.max(8, n) / 10)), ystep: Math.max(1, Math.ceil(top / 6)), xname: "epoch", yname: "hibák száma" }, []);
      const { ctx } = cvB, bw = Math.max(3, (T.tx(1) - T.tx(0)) * 0.6);
      epErrs.forEach((e, i) => { ctx.fillStyle = e ? css("--bad") : css("--ok"); ctx.fillRect(T.tx(i + 1) - bw / 2, T.ty(e), bw, T.ty(0) - T.ty(e)); });
      if (!n) label(ctx, "Az epochonkénti hibaszám itt jelenik meg.", cvB.w / 2, cvB.h / 2, css("--muted"), "center", "12px system-ui, sans-serif", "middle");
    };
    function sync() {
      gD.paint(); sE.value = eta; oE.textContent = fmt(eta, 1); cR.checked = rev;
      [b1, bE, bR].forEach(x => setDis(x, done));
      cv.draw(); cvB.draw();
      const last = log.slice(-6);
      const row = o => `<tr><td>${o.ep}</td><td>(${fmt(o.x[0], 2)}; ${fmt(o.x[1], 2)})</td><td>${o.y}</td><td>${fmt(o.z, 2)}</td><td>${o.yh}</td>` +
        `<td>${o.d ? `<b>frissít</b> → w = (${fmt(o.w[0], 2)}; ${fmt(o.w[1], 2)}), b = ${fmt(o.b, 2)}` : "helyes, marad"}</td></tr>`;
      let s = `epoch: <b>${done ? ep - 1 : ep}</b> · w = (<b>${fmt(w[0], 2)}</b>; <b>${fmt(w[1], 2)}</b>), b = <b>${fmt(b, 2)}</b>`;
      if (last.length) s += `<table style="font-size:.82rem;margin:.4rem 0;width:auto"><tr><th>epoch</th><th>x</th><th>y</th><th>z</th><th>ŷ</th><th>lépés</th></tr>${last.map(row).join("")}</table>`;
      if (done) s += `<b style="color:var(--ok)">Egy teljes epoch hiba nélkül – a perceptron megállt.</b> Frissítések összesen: ${nUpd}.`;
      else if (cyc) s += `<b style="color:var(--bad)">Ciklus:</b> a ${cyc.to}. epoch végén ugyanott tartanak a súlyok, mint a ${cyc.from}. végén – innen minden kör ugyanígy ismétlődik, a perceptron sosem áll meg.`;
      else if (ep > 50) s += `50 epoch után sem hibátlan.`;
      if (ds === "xor") s += `<br><span class="muted">A XOR nem választható szét egy egyenessel (5.6), ezért a szabály örökké javítgat.</span>`;
      if (ds === "overlap") s += `<br><span class="muted">Átfedő felhő: nincs hibátlan egyenes, a vonal ide-oda ugrál, a hibaszám nem megy le nullára.</span>`;
      out.innerHTML = s;
    }
    sync();
  };
