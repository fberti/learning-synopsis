
  /* ==================================================================
     10.1–10.4 widgetek: loss-compare, batch-size-noise, backprop-stepper, compute-graph
     ================================================================== */

  /* közös kis segédek (w1 előtaggal, hogy ne ütközzenek) */
  const w1Sig = z => 1 / (1 + Math.exp(-z));
  const w1F4 = x => (x < 0 ? "−" : "") + Math.abs(x).toFixed(4).replace(".", ",");   // fix 4 tizedes
  const w1N = x => fmt(x, 4);                                                          // legfeljebb 4 tizedes
  const w1Vec = v => "(" + v.map(w1N).join("; ") + ")";
  const w1Mat = M => "[" + M.map(r => "[" + r.map(w1N).join("; ") + "]").join("; ") + "]";
  /* felirat „glóriával” (kártyaszínű körvonal), hogy vonalakon is olvasható legyen */
  function w1Text(ctx, txt, x, y, color, align = "center", base = "middle", font = "600 12px system-ui, sans-serif") {
    ctx.save(); ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.lineWidth = 4; ctx.strokeStyle = css("--card"); ctx.lineJoin = "round"; ctx.strokeText(txt, x, y);
    ctx.fillStyle = color; ctx.fillText(txt, x, y); ctx.restore();
  }
  /* többsoros címke kerekített keretben: lines = [[szöveg, szín, betű?], …], (x, y) = a keret közepe */
  function w1Tag(ctx, lines, x, y, fs = 12, border = null) {
    if (!lines.length) return;
    ctx.save();
    const fonts = lines.map(l => l[2] || `600 ${fs}px system-ui, sans-serif`);
    const ws = lines.map((l, i) => { ctx.font = fonts[i]; return ctx.measureText(l[0]).width; });
    const lh = fs + 3, bw = Math.max(...ws) + 10, bh = lines.length * lh + 4;
    const x0 = clamp(x - bw / 2, 1, ctx.canvas.clientWidth - bw - 1);
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y - bh / 2, bw, bh, 5) : ctx.rect(x0, y - bh / 2, bw, bh);
    ctx.fillStyle = css("--card"); ctx.fill();
    ctx.strokeStyle = border || css("--border"); ctx.lineWidth = 1; ctx.stroke();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    lines.forEach((l, i) => { ctx.font = fonts[i]; ctx.fillStyle = l[1]; ctx.fillText(l[0], x0 + bw / 2, y - bh / 2 + 2 + lh * (i + 0.5)); });
    ctx.restore();
  }
  function w1RoundRect(ctx, x, y, w, hh, r, fill, stroke, lw = 2) {
    ctx.save(); ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, hh, r) : ctx.rect(x, y, w, hh);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.restore();
  }

  /* ------------------------------------------------------------------
     10.1  loss-compare – miért a logaritmus? négyzetes hiba vs. keresztentrópia
     ------------------------------------------------------------------ */
  const lcLoss = { mse: (p, y) => 0.5 * (p - y) ** 2, ce: (p, y) => -(y * Math.log(p) + (1 - y) * Math.log(1 - p)) };
  const lcGrad = { mse: (p, y) => (p - y) * p * (1 - p), ce: (p, y) => p - y };
  W["loss-compare"] = root => {
    header(root, "Négyzetes hiba vagy keresztentrópia?",
      "Egyetlen szigmoid kimenet: $p = \\sigma(z)$, a címke $y$. <b>Bal oldalt</b> a két veszteség $z$ függvényében, " +
      "<b>jobb oldalt</b> a gradiensük nagysága, $\\lvert\\partial L/\\partial z\\rvert$ – ekkora „lökést” kap a tanulás. " +
      "Négyzetes hiba: $L = \\tfrac12(p-y)^2$, $\\ \\partial L/\\partial z = (p-y)\\,p(1-p)$. " +
      "Keresztentrópia: $L = -[y\\ln p + (1-y)\\ln(1-p)]$, $\\ \\partial L/\\partial z = p - y$. " +
      "Figyeld: a négyzetes hiba gradiense éppen akkor tűnik el, amikor a modell <b>magabiztosan téved</b>.");
    let z = -4, y = 1;
    const sZ = slider(-6, 6, 0.1, z), oZ = h("b");
    sZ.addEventListener("input", () => { z = +sZ.value; sync(); });
    const gY = toggleGroup([["1", "y = 1"], ["0", "y = 0"]], () => String(y), v => { y = +v; sync(); });
    const PRE = [["magabiztosan téved", -4], ["bizonytalan", 0], ["jól dönt", 2]];
    const zOf = v => (y ? v : -v) || 0;
    const bP = PRE.map(([, v]) => btn("", () => { z = zOf(v); sync(); }));
    root.append(h("div", { class: "controls" }, small("címke:"), gY.bs, h("label", null, "z = ", sZ, oZ)),
      h("div", { class: "controls" }, small("beállítás:"), bP));
    const [cvL, cvR] = twoCanvas(root, 0.85, 0.85);
    const out = h("div", { class: "readout" });
    root.append(out);
    const legend = (cv, x0, items) => items.forEach(([t, c], i) => {
      const yy = 16 + 17 * i, { ctx } = cv, left = x0 < cv.w / 2;
      ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath();
      const a = left ? x0 : x0 - 18; ctx.moveTo(a, yy); ctx.lineTo(a + 18, yy); ctx.stroke(); ctx.restore();
      w1Text(ctx, t, left ? x0 + 23 : x0 - 23, yy, c, left ? "left" : "right");
    });
    const curves = (cv, V, F) => {
      const cM = css("--setB"), cC = css("--accent"), p = w1Sig(z);
      const T = Calc.plot(cv, V, [{ f: t => F.mse(w1Sig(t)), color: cM }, { f: t => F.ce(w1Sig(t)), color: cC }]);
      const { ctx } = cv;
      polyline(ctx, T, [[z, V.ymin], [z, V.ymax]], css("--muted"), 1.2, [4, 3]);
      [[F.mse(p), cM], [F.ce(p), cC]].forEach(([v, c]) => { if (v <= V.ymax) { dot(ctx, T.tx(z), T.ty(v), 6.5, css("--card")); dot(ctx, T.tx(z), T.ty(v), 5, c); } });
      legend(cv, y ? cv.w - 10 : 10, [["négyzetes hiba", cM], ["keresztentrópia", cC]]);
      return T;
    };
    cvL.draw = () => curves(cvL, { xmin: -6, xmax: 6, ymin: -0.45, ymax: 6.6, xstep: 2, ystep: 1, xname: "z", yname: "L" },
      { mse: p => lcLoss.mse(p, y), ce: p => lcLoss.ce(p, y) });
    cvR.draw = () => curves(cvR, { xmin: -6, xmax: 6, ymin: -0.08, ymax: 1.15, xstep: 2, ystep: 0.25, xname: "z", yname: "|∂L/∂z|" },
      { mse: p => Math.abs(lcGrad.mse(p, y)), ce: p => Math.abs(lcGrad.ce(p, y)) });
    function sync() {
      gY.paint(); sZ.value = z; oZ.textContent = fmt(z, 1);
      bP.forEach((b, i) => { b.textContent = `${PRE[i][0]} (z = ${fmt(zOf(PRE[i][1]), 0)})`; b.classList.toggle("on", Math.abs(z - zOf(PRE[i][1])) < 1e-9); });
      cvL.draw(); cvR.draw();
      const p = w1Sig(z), gm = lcGrad.mse(p, y), gc = lcGrad.ce(p, y);
      const wrong = (p >= 0.5 ? 1 : 0) !== y, conf = Math.abs(z) >= 2;
      let s = `p = σ(${fmt(z, 1)}) = <b>${fmt(p, 3)}</b> · y = ${y}` +
        `<br><span style="color:var(--setB)">■</span> négyzetes hiba: L = <b>${fmt(lcLoss.mse(p, y), 3)}</b>, ∂L/∂z = <b>${fmt(gm, 4)}</b>` +
        `<br><span style="color:var(--accent)">■</span> keresztentrópia: L = <b>${fmt(lcLoss.ce(p, y), 3)}</b>, ∂L/∂z = <b>${fmt(gc, 4)}</b>` +
        `<br>a keresztentrópia gradiense <b>${fmt(gc / gm, 1)}</b>-szor akkora`;
      const note = wrong && conf
        ? "A modell magabiztosan téved – a négyzetes hiba gradiense mégis alig nagyobb nullánál: a szigmoid lapos szakaszán a p(1 − p) tényező „lenyeli” a hibát. A keresztentrópiánál ez a tényező kiesik: a gradiens p − y, arányos a tévedéssel."
        : wrong || Math.abs(z) < 1 ? "Bizonytalan döntés: itt mindkét gradiens számottevő, de a keresztentrópiáé így is többszörös."
          : "Jól dönt: mindkét gradiens kicsi – itt ez így helyes, nincs mit javítani.";
      out.innerHTML = s + `<br><span class="muted">${note}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     10.2  batch-size-noise – mini-köteg: zajos, de olcsó gradiens
     ------------------------------------------------------------------ */
  const BS_N = 200, BS_LIST = [1, 4, 16, 64, 200], BS_ETA = 0.1, BS_EP = 5, BS_P0 = [-0.5, -1.5], BS_ARR = 0.15;
  const BS_COL = { 1: "--bad", 4: "--setB", 16: "--setC", 64: "--setA", 200: "--accent" };
  function bsData() {
    const r = ML.rng(10), X = [], Y = [];
    for (let i = 0; i < BS_N; i++) { const x = 2 * r() - 1; X.push(x); Y.push(2 * x + 1 + 0.5 * ML.gauss(r)); }
    const m = f => X.reduce((s, x, i) => s + f(x, Y[i]), 0) / BS_N;
    const S = { mx: m(x => x), mxx: m(x => x * x), my: m((x, y) => y), mxy: m((x, y) => x * y), myy: m((x, y) => y * y) };
    const det = S.mxx - S.mx * S.mx;
    S.opt = [(S.mxy - S.mx * S.my) / det, (S.mxx * S.my - S.mx * S.mxy) / det];
    return { X, Y, S };
  }
  W["batch-size-noise"] = root => {
    header(root, "Kötegméret: zajos, de olcsó gradiens",
      "Lineáris regresszió 200 zajos pontra ($y \\approx 2x + 1$), a veszteség az átlagos négyzetes hiba, a paraméterek $(w, b)$. " +
      "<b>Bal oldalt</b> a veszteség szintvonalai, a jelenlegi pont, a teljes gradiens iránya (vastag nyíl, $-\\nabla L$) és 30 véletlen " +
      "<b>mini-köteg</b> becslése (vékony nyilak). Minél nagyobb a köteg ($B$), annál kisebb a felhő: a szórás kb. $\\sigma/\\sqrt B$. " +
      "A pontot el is húzhatod. <b>Jobb oldalt</b> tanítás SGD-vel ($\\eta = 0{,}1$, 5 epoch) – kis $B$: sok, zajos lépés epochonként; teljes köteg: epochonként 1 lépés.");
    const D = bsData(), { X, Y, S } = D;
    let B = 16, P = BS_P0.slice(), cseed = 1;
    const runs = new Map();
    const loss = (w, b) => w * w * S.mxx + b * b + S.myy + 2 * w * b * S.mx - 2 * w * S.mxy - 2 * b * S.my;
    const fullG = (w, b) => [2 * (w * S.mxx + b * S.mx - S.mxy), 2 * (w * S.mx + b - S.my)];
    const gi = (i, w, b) => { const r = w * X[i] + b - Y[i]; return [2 * r * X[i], 2 * r]; };
    const batchG = (idx, w, b) => { let gw = 0, gb = 0; idx.forEach(i => { const g = gi(i, w, b); gw += g[0]; gb += g[1]; }); return [gw / idx.length, gb / idx.length]; };
    const sample = (k, rnd) => {           // k elem visszatevés nélkül (részleges keverés)
      const a = X.map((_, i) => i);
      for (let i = 0; i < k; i++) { const j = i + Math.floor(rnd() * (BS_N - i)); [a[i], a[j]] = [a[j], a[i]]; }
      return a.slice(0, k);
    };
    const gB = toggleGroup(BS_LIST.map(b => [String(b), b === BS_N ? "200 (teljes)" : String(b)]), () => String(B), v => { B = +v; sync(); });
    const bT = btn("▶ Tanítás 5 epochon át", () => { train(); sync(); }, "btn primary");
    root.append(h("div", { class: "controls" }, small("kötegméret B:"), gB.bs),
      h("div", { class: "controls" }, bT, btn("Törlés", () => { runs.clear(); sync(); }),
        btn("🎲 Új kötegek", () => { cseed++; sync(); }), btn("Kezdőpont vissza", () => { P = BS_P0.slice(); runs.clear(); sync(); })));
    const [cvL, cvR] = twoCanvas(root, 1, 0.85);
    const out = h("div", { class: "readout" });
    root.append(out);
    function train() {
      const rnd = ML.rng(500 + B);
      let w = P[0], b = P[1], n = 0;
      const curve = [[0, loss(w, b)]], path = [[w, b]];
      for (let e = 0; e < BS_EP; e++) {
        const idx = ML.shuffle(X.map((_, i) => i), rnd);
        for (let s = 0; s < BS_N; s += B) {
          const bi = idx.slice(s, s + B), g = batchG(bi, w, b);
          w -= BS_ETA * g[0]; b -= BS_ETA * g[1]; n += bi.length;
          curve.push([n / BS_N, loss(w, b)]); path.push([w, b]);
        }
      }
      runs.set(B, { curve, path, steps: path.length - 1 });
    }
    /* szórás: mért (400 köteg) és elméleti σ/√B */
    function spread(Bk) {
      const [w, b] = P, g = fullG(w, b);
      let s2 = 0;
      for (let i = 0; i < BS_N; i++) { const q = gi(i, w, b); s2 += (q[0] - g[0]) ** 2 + (q[1] - g[1]) ** 2; }
      const sig = Math.sqrt(s2 / BS_N);
      const rnd = ML.rng(77 + Bk), K = 400;
      let m2 = 0;
      for (let k = 0; k < K; k++) { const q = batchG(sample(Bk, rnd), w, b); m2 += (q[0] - g[0]) ** 2 + (q[1] - g[1]) ** 2; }
      return { meas: Math.sqrt(m2 / K), theo: sig / Math.sqrt(Bk), sig };
    }
    let TL = null;
    cvL.draw = () => {
      const V = eqView(cvL, 1.5, 0.5, 2.5, 2.5, { xname: "w", yname: "b" });
      const T = TL = Calc.plot(cvL, V, []), { ctx } = cvL;
      /* szintvonalak: L = L* + c ellipszisek (a veszteség másodfokú) */
      const a = S.mxx, bb = S.mx, phi = 0.5 * Math.atan2(2 * bb, a - 1);
      const l1 = (a + 1) / 2 + Math.hypot((a - 1) / 2, bb), l2 = (a + 1) / 2 - Math.hypot((a - 1) / 2, bb);
      const u1 = [Math.cos(phi), Math.sin(phi)], u2 = [-Math.sin(phi), Math.cos(phi)], [ow, ob] = S.opt;
      const cc = css("--muted");
      [0.05, 0.25, 0.6, 1.2, 2, 3, 4.5, 6.5, 9, 12, 16, 21].forEach(c => {
        const r1 = Math.sqrt(c / l1), r2 = Math.sqrt(c / l2), pts = [];
        for (let k = 0; k <= 120; k++) {
          const t = 2 * Math.PI * k / 120, A1 = r1 * Math.cos(t), A2 = r2 * Math.sin(t);
          pts.push([ow + A1 * u1[0] + A2 * u2[0], ob + A1 * u1[1] + A2 * u2[1]]);
        }
        polyline(ctx, T, pts, rgba(cc, 0.45), 1);
      });
      label(ctx, "×", T.tx(ow), T.ty(ob), css("--text"), "center", "700 15px system-ui, sans-serif", "middle");
      label(ctx, "minimum", T.tx(ow) + 8, T.ty(ob) - 6, css("--muted"), "left", "11px system-ui, sans-serif");
      /* korábbi futások útja */
      runs.forEach((r, k) => polyline(ctx, T, r.path, rgba(css(BS_COL[k]), 0.85), k === 1 ? 1 : 1.8));
      /* mini-köteg nyilak */
      const [w, b] = P, g = fullG(w, b), rnd = ML.rng(1000 * cseed + B), col = css(BS_COL[B]);
      const x0 = T.tx(w), y0 = T.ty(b);
      for (let k = 0; k < 30; k++) {
        const q = batchG(sample(B, rnd), w, b);
        arrow(ctx, x0, y0, T.tx(w - BS_ARR * q[0]), T.ty(b - BS_ARR * q[1]), rgba(col, 0.42), 1.3);
      }
      arrow(ctx, x0, y0, T.tx(w - BS_ARR * g[0]), T.ty(b - BS_ARR * g[1]), css("--text"), 3);
      dot(ctx, x0, y0, 7, css("--card")); dot(ctx, x0, y0, 5.5, css("--text"));
    };
    /* veszteség–epoch görbe logaritmikus skálán */
    cvR.draw = () => {
      const L0 = 0.15, L1 = 15, ly = v => Math.log10(Math.max(v, L0) / L0);
      const V = { xmin: -0.3, xmax: 5.4, ymin: -0.34, ymax: ly(L1), grid: false, labels: false };
      const T = Calc.plot(cvR, V, []), { ctx, w } = cvR, mu = css("--muted");
      [0.25, 0.5, 1, 2, 5, 10].forEach(v => {
        polyline(ctx, T, [[0, ly(v)], [V.xmax, ly(v)]], css("--border"), 1);
        label(ctx, fmt(v, 2), T.tx(0) + 4, T.ty(ly(v)) - 1, mu, "left", "11px system-ui, sans-serif");
      });
      for (let e = 1; e <= BS_EP; e++) {
        polyline(ctx, T, [[e, 0], [e, V.ymax]], css("--border"), 1);
        label(ctx, String(e), T.tx(e), T.ty(0) + 3, mu, "center", "11px system-ui, sans-serif", "top");
      }
      label(ctx, "veszteség (log skála)", T.tx(0) + 6, 3, mu, "left", "11px system-ui, sans-serif", "top");
      label(ctx, "epoch = feldolgozott minták / 200", w - 6, cvR.h - 3, mu, "right", "11px system-ui, sans-serif");
      polyline(ctx, T, [[0, ly(loss(...S.opt))], [V.xmax, ly(loss(...S.opt))]], mu, 1.2, [5, 4]);
      runs.forEach((r, k) => polyline(ctx, T, r.curve.map(([x, v]) => [x, ly(v)]), css(BS_COL[k]), k === 1 ? 1.2 : 2.2));
      let i = 0;
      BS_LIST.forEach(k => {
        if (!runs.has(k)) return;
        const yy = 30 + 16 * i++, x1 = w - 60;
        ctx.save(); ctx.strokeStyle = css(BS_COL[k]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x1 + 16, yy); ctx.stroke(); ctx.restore();
        w1Text(ctx, `B = ${k}`, x1 + 20, yy, css(BS_COL[k]), "left");
      });
      if (!runs.size) label(ctx, "Nyomd meg a „Tanítás” gombot!", w / 2, cvR.h / 2, mu, "center", "12px system-ui, sans-serif", "middle");
    };
    let drag = false;
    const pick = e => {
      if (!TL) return;
      const [px, py] = evXY(cvL, e);
      P = [clamp(Math.round(TL.ix(px) * 20) / 20, -1, 4), clamp(Math.round(TL.iy(py) * 20) / 20, -2, 3)];
      runs.clear(); sync();
    };
    cvL.c.addEventListener("pointerdown", e => { drag = true; cvL.c.setPointerCapture(e.pointerId); pick(e); });
    cvL.c.addEventListener("pointermove", e => drag && pick(e));
    cvL.c.addEventListener("pointerup", () => { drag = false; });
    function sync() {
      gB.paint(); bT.textContent = `▶ Tanítás 5 epochon át (B = ${B})`;
      cvL.draw(); cvR.draw();
      const [w, b] = P, g = fullG(w, b);
      const rows = BS_LIST.map(k => {
        const sp = spread(k), on = k === B ? ` style="background:var(--accent-soft)"` : "";
        return `<tr${on}><td>${k}</td><td>${Math.ceil(BS_N / k)}</td><td>${fmt(sp.meas, 2)}</td><td>${fmt(sp.theo, 2)}</td></tr>`;
      }).join("");
      let s = `pont: (w; b) = (<b>${fmt(w, 2)}</b>; <b>${fmt(b, 2)}</b>) · veszteség: <b>${fmt(loss(w, b), 3)}</b>` +
        `<br>teljes gradiens: ∇L = (${fmt(g[0], 2)}; ${fmt(g[1], 2)}), |∇L| = <b>${fmt(Math.hypot(...g), 2)}</b> · egy minta gradiensének szórása: σ = <b>${fmt(spread(1).sig, 2)}</b>` +
        `<table style="font-size:.84rem;width:auto;margin:.4rem 0"><tr><th>B</th><th>lépés / epoch</th><th>mért szórás</th><th>σ/√B</th></tr>${rows}</table>` +
        `<span class="muted">Mért szórás: 400 véletlen köteg gradiensének átlagos eltérése a teljes gradienstől. Négyszer nagyobb köteg → fele akkora zaj. ` +
        `B = 64-nél és 200-nál a mért érték kisebb az elméletinél, mert egy kötegben minden pont csak egyszer szerepel – a teljes kötegnek már nincs zaja.</span>`;
      if (runs.size) s += `<br><span class="muted">Jobb oldali ábra, szaggatott vonal: a legkisebb elérhető veszteség (${fmt(loss(...S.opt), 3)}).</span><br>5 epoch után: ` + BS_LIST.filter(k => runs.has(k)).map(k => { const r = runs.get(k); return `B = ${k}: L = <b>${fmt(r.curve[r.curve.length - 1][1], 3)}</b> (${r.steps} lépés)`; }).join(" · ");
      out.innerHTML = s;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     10.3  backprop-stepper – a kézzel számolt 2–2–1-es háló lépésenként
     ------------------------------------------------------------------ */
  const BP_X = [1, 2];
  const bpInit = () => ({ W1: [[0.5, 0.25], [-1, 1]], b1: [0, 0.5], W2: [1, -1], b2: 0.5 });
  function bpFwd(P, y) {
    const z1 = P.W1.map((r, j) => r[0] * BP_X[0] + r[1] * BP_X[1] + P.b1[j]), hv = z1.map(v => Math.max(0, v));
    const z2 = P.W2[0] * hv[0] + P.W2[1] * hv[1] + P.b2, yh = w1Sig(z2);
    return { z1, h: hv, z2, yh, L: -(y ? Math.log(yh) : Math.log(1 - yh)) };
  }
  function bpBwd(P, F, y) {
    const d2 = F.yh - y, back = P.W2.map(v => v * d2), rp = F.z1.map(v => (v > 0 ? 1 : 0)), d1 = back.map((v, j) => v * rp[j]);
    return { d2, gW2: F.h.map(v => d2 * v), gb2: d2, back, rp, d1, gW1: d1.map(d => BP_X.map(x => d * x)), gb1: d1.slice() };
  }
  const bpUpd = (P, G, eta) => ({
    W1: P.W1.map((r, j) => r.map((v, i) => v - eta * G.gW1[j][i])), b1: P.b1.map((v, j) => v - eta * G.gb1[j]),
    W2: P.W2.map((v, j) => v - eta * G.gW2[j]), b2: P.b2 - eta * G.gb2
  });
  W["backprop-stepper"] = root => {
    header(root, "Visszaterjesztés lépésről lépésre",
      "A fejezet kézzel számolt 2–2–1-es hálója: bemenet $\\mathbf x = (1;\\ 2)$, rejtett réteg ReLU-val, kimenet szigmoiddal, veszteség: bináris keresztentrópia. " +
      "Kattints sorban: <b>1. Előre</b> (értékek, kékkel), <b>2. Vissza</b> rétegenként (gradiensek, pirossal), <b>3. Frissítés</b> ($w \\leftarrow w - \\eta\\,\\partial L/\\partial w$, zölddel). " +
      "Utána újra „Előre”: csökkent a veszteség?");
    let P = bpInit(), y = 1, eta = 0.1, st = 0, F = null, G = null, hist = [];
    const gE = toggleGroup([["0.1", "η = 0,1"], ["0.5", "η = 0,5"]], () => String(eta), v => { eta = +v; sync(); });
    const gY = toggleGroup([["1", "y = 1"], ["0", "y = 0"]], () => String(y), v => { y = +v; reset(); });
    const bF = btn("1. Előre", () => { adv(); sync(); }, "btn primary");
    const bB = btn("2. Vissza", () => { adv(); sync(); }, "btn primary");
    const bU = btn("3. Frissítés", () => { adv(); sync(); }, "btn primary");
    const bAll = btn("⏩ Teljes lépés", () => { let g = 0; do adv(); while (st !== 1 && g++ < 9); sync(); });
    root.append(h("div", { class: "controls" }, bF, bB, bU),
      h("div", { class: "controls" }, bAll, btn("↺ Újrakezdés", reset), small("tanulási ráta:"), gE.bs, small("címke:"), gY.bs));
    const cv = Calc.canvas(root, flatAspect(root, 0.56, 1.15));
    const out = h("div", { class: "readout" }), tab = h("div", { style: "overflow-x:auto" });
    root.append(out, tab);
    const Pn = () => bpUpd(P, G, eta);
    function adv() {
      if (st === 0 || st === 5) { if (st === 5) P = Pn(); F = bpFwd(P, y); G = null; hist.push(F.L); st = 1; }
      else if (st <= 3) { if (st === 1) G = bpBwd(P, F, y); st++; }
      else if (st === 4) st = 5;
    }
    function reset() { P = bpInit(); st = 0; F = G = null; hist = []; sync(); }
    cv.draw = () => {
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const narrow = w < 520, fs = narrow ? 11 : 12, r = clamp(w * 0.034, 15, 22);
      const cF = css("--accent"), cB = css("--bad"), cU = css("--ok"), cT = css("--text"), cM = css("--muted");
      const xi = Math.max(r + 4, w * 0.07), xh = w * 0.42, xo = w * (narrow ? 0.66 : 0.7);
      const yt = hh * (narrow ? 0.24 : 0.3), yb = hh * (narrow ? 0.78 : 0.72), ym = (yt + yb) / 2;
      const In = [[xi, yt], [xi, yb]], Hd = [[xh, yt], [xh, yb]], O = [xo, ym];
      const upd = st === 5 ? Pn() : null;
      const wTxt = (old, nw) => (nw == null ? w1N(old) : `${w1N(old)} → ${w1N(nw)}`);
      const edge = (a, b, t, lines, hot) => {
        ctx.save(); ctx.strokeStyle = hot ? cB : rgba(cM, 0.7); ctx.lineWidth = hot ? 2 : 1.4;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
        w1Tag(ctx, lines, a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), fs, hot ? cB : null);
      };
      const wl = (old, nw, g, showG) => {
        const L = [[wTxt(old, nw), nw == null ? cT : cU]];
        if (showG) L.push([`∂ ${w1N(g)}`, cB]);
        return L;
      };
      /* élek: W1 (i → j) és W2 (j → kimenet) */
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++)
        edge(In[i], Hd[j], i === j ? 0.5 : 0.3, wl(P.W1[j][i], upd && upd.W1[j][i], G && G.gW1[j][i], st >= 4), st === 4);
      for (let j = 0; j < 2; j++) edge(Hd[j], O, narrow ? 0.4 : 0.5, wl(P.W2[j], upd && upd.W2[j], G && G.gW2[j], st >= 2), st === 2);
      /* veszteségdoboz */
      const lt = [["L = " + (F ? w1F4(F.L) : "?"), F ? cF : cM, `700 ${fs + 1}px system-ui, sans-serif`], [`y = ${y}`, cT]];
      ctx.save(); ctx.font = `700 ${fs + 1}px system-ui, sans-serif`; const lw = ctx.measureText(lt[0][0]).width + 12; ctx.restore();
      const lx = Math.max(O[0] + r + 14, w - lw - 4);
      ctx.save(); ctx.strokeStyle = rgba(cM, 0.7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(O[0] + r, ym); ctx.lineTo(lx, ym); ctx.stroke(); ctx.restore();
      w1Tag(ctx, lt, lx + lw / 2, ym, fs);
      /* csomópontok */
      const node = (p, name, col) => {
        dot(ctx, p[0], p[1], r, css("--card")); ring(ctx, p[0], p[1], r, col, 2.2);
        label(ctx, name, p[0], p[1] + 1, cT, "center", `700 ${fs + 2}px system-ui, sans-serif`, "middle");
      };
      const block = (p, lines, up) => {
        const lh = fs + 4;
        lines.forEach((l, k) => w1Text(ctx, l[0], p[0], up ? p[1] - r - 8 - lh * (lines.length - 1 - k) : p[1] + r + 9 + lh * k, l[1], "center", "middle", `600 ${fs}px system-ui, sans-serif`));
      };
      In.forEach((p, i) => { node(p, "x" + sub(i + 1), cM); block(p, [[`x${sub(i + 1)} = ${BP_X[i]}`, cF]], i === 0); });
      Hd.forEach((p, j) => {
        node(p, "h" + sub(j + 1), st === 3 ? cB : cF);
        const L = [[`b = ${wTxt(P.b1[j], upd && upd.b1[j])}`, upd ? cU : cT]];
        if (F) L.push([`z = ${w1N(F.z1[j])} · h = ${w1N(F.h[j])}`, cF]);
        if (st >= 3) L.push([`δ = ${w1N(G.back[j])}·${G.rp[j]} = ${w1N(G.d1[j])}`, cB]);
        block(p, j === 0 ? L.reverse() : L, j === 0);
      });
      node(O, "ŷ", st === 2 ? cB : css("--setB"));
      block(O, [[`b = ${wTxt(P.b2, upd && upd.b2)}`, upd ? cU : cT]].concat(F ? [[`z = ${w1N(F.z2)} · ŷ = ${w1F4(F.yh)}`, cF]] : []).reverse(), true);
      if (st >= 2) block(O, [[`δ = ŷ − y = ${w1N(G.d2)}`, cB]], false);
    };
    function explain() {
      const yy = y ? "" : "1 − ";
      if (st === 0) return "Kezdés: a súlyok a rajzon, a bemenet x = (1; 2), a címke y = " + y + ". Nyomd meg az „1. Előre” gombot!";
      if (st === 1) {
        let s = `<b>Előre:</b> z₁ = W₁x + b₁ = ${w1Vec(F.z1)}, h = ReLU(z₁) = ${w1Vec(F.h)}, z₂ = W₂·h + b₂ = ${w1N(F.z2)}, ŷ = σ(z₂) = ${w1F4(F.yh)}, ` +
          `L = −ln(${yy}ŷ) = <b>${w1F4(F.L)}</b>.`;
        if (hist.length > 1) s += ` A veszteség az előző lépés óta: ${w1F4(hist[hist.length - 2])} → ${w1F4(F.L)}.`;
        return s;
      }
      if (st === 2) return `<b>Vissza – kimeneti réteg:</b> δ₂ = ŷ − y = ${w1N(G.d2)} (szigmoid + keresztentrópia: ennyi az egész). ` +
        `∂L/∂W₂ = δ₂·h = ${w1Vec(G.gW2)}, ∂L/∂b₂ = δ₂ = ${w1N(G.gb2)}.`;
      if (st === 3) {
        let s = `<b>Vissza – rejtett réteg:</b> a hiba a súlyokon át megy vissza: W₂ᵀδ₂ = ${w1Vec(G.back)}; ReLU′(z₁) = ${w1Vec(G.rp)} → ` +
          `δ₁ = ${w1Vec(G.d1)} (elemenként szorozva). ∂L/∂b₁ = δ₁.`;
        if (G.rp.includes(0)) s += ` <b>Figyelem:</b> ahol z ≤ 0, ott ReLU′ = 0 – azon a neuronon most nem jut át gradiens, a súlyai nem változnak.`;
        return s;
      }
      if (st === 4) return `<b>Vissza – első réteg súlyai:</b> ∂L/∂W₁ = δ₁xᵀ = ${w1Mat(G.gW1)} – minden súly gradiense = (a neuron δ-ja) × (a bemenet, amit a súly szoroz).`;
      return `<b>Frissítés:</b> minden paraméterre w ← w − η·∂L/∂w, η = ${fmt(eta, 1)}. Az új értékek zölddel. Az „1. Előre” megmutatja, csökkent-e a veszteség.`;
    }
    function sync() {
      gE.paint(); gY.paint();
      setDis(bF, !(st === 0 || st === 5)); setDis(bB, !(st >= 1 && st <= 3)); setDis(bU, st !== 4);
      bB.textContent = st >= 1 && st <= 3 ? `2. Vissza (${st}/3)` : "2. Vissza";
      cv.draw();
      out.innerHTML = explain() + (hist.length ? `<br>veszteség az egyes előre menetekben: <b>${hist.map(w1F4).join(" → ")}</b>` : "");
      const upd = st === 5 ? Pn() : null;
      const R = [["w¹₁₁", P.W1[0][0], G && G.gW1[0][0], upd && upd.W1[0][0], 4], ["w¹₁₂", P.W1[0][1], G && G.gW1[0][1], upd && upd.W1[0][1], 4],
        ["w¹₂₁", P.W1[1][0], G && G.gW1[1][0], upd && upd.W1[1][0], 4], ["w¹₂₂", P.W1[1][1], G && G.gW1[1][1], upd && upd.W1[1][1], 4],
        ["b¹₁", P.b1[0], G && G.gb1[0], upd && upd.b1[0], 3], ["b¹₂", P.b1[1], G && G.gb1[1], upd && upd.b1[1], 3],
        ["w²₁", P.W2[0], G && G.gW2[0], upd && upd.W2[0], 2], ["w²₂", P.W2[1], G && G.gW2[1], upd && upd.W2[1], 2], ["b²", P.b2, G && G.gb2, upd && upd.b2, 2]];
      const dash = `<span class="muted">–</span>`;
      tab.innerHTML = `<table style="font-size:.84rem;width:auto;margin:.6rem 0 0;font-family:var(--mono)"><tr><th>paraméter</th><th>érték</th><th>gradiens ∂L/∂·</th><th>új érték</th></tr>` +
        R.map(([n, v, g, nv, need]) => `<tr><td>${n}</td><td>${w1N(v)}</td><td style="color:var(--bad)">${st >= need && g != null ? w1N(g) : dash}</td>` +
          `<td style="color:var(--ok);font-weight:600">${nv != null ? w1N(nv) : dash}</td></tr>`).join("") + `</table>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     10.4  compute-graph – számítási gráf: előre értékek, vissza gradiensek
     ------------------------------------------------------------------ */
  const CG_PRE = {
    a: { name: "(a) (x + y)·z", nodes: [
      { id: "x", v: 1, c: 0, r: 0.12 }, { id: "y", v: 2, c: 0, r: 0.48 }, { id: "z", v: -3, c: 0, r: 0.88 },
      { id: "q", op: "add", in: ["x", "y"], c: 1, r: 0.3 }, { id: "f", op: "mul", in: ["q", "z"], c: 2, r: 0.55 }] },
    b: { name: "(b) x·y + x", nodes: [
      { id: "x", v: 3, c: 0, r: 0.2 }, { id: "y", v: 2, c: 0, r: 0.85 },
      { id: "m", op: "mul", in: ["x", "y"], c: 1, r: 0.7 }, { id: "f", op: "add", in: ["m", "x"], c: 2, r: 0.42 }] },
    c: { name: "(c) σ(w·x + b)", nodes: [
      { id: "w", v: 0.5, c: 0, r: 0.1 }, { id: "x", v: 2, c: 0, r: 0.45 }, { id: "b", v: -1, c: 0, r: 0.88 },
      { id: "u", op: "mul", in: ["w", "x"], c: 1, r: 0.28 }, { id: "z", op: "add", in: ["u", "b"], c: 2, r: 0.55 }, { id: "a", op: "sig", in: ["z"], c: 3, r: 0.55 }] },
    d: { name: "(d) max(x, y)·z", nodes: [
      { id: "x", v: 4, c: 0, r: 0.12 }, { id: "y", v: 1, c: 0, r: 0.48 }, { id: "z", v: 2, c: 0, r: 0.88 },
      { id: "m", op: "max", in: ["x", "y"], c: 1, r: 0.3 }, { id: "f", op: "mul", in: ["m", "z"], c: 2, r: 0.55 }] }
  };
  const CG_SYM = { add: "+", mul: "·", max: "max", sig: "σ" };
  const CG_NAME = { add: "összeadás", mul: "szorzás", max: "max", sig: "szigmoid" };
  W["compute-graph"] = root => {
    header(root, "Számítási gráf: előre értékek, vissza gradiensek",
      "A kifejezést elemi lépésekre (csomópontokra) bontjuk. <b>Előre</b> a bemenetektől a kimenet felé számoljuk az értékeket (kék, az élek fölött), " +
      "<b>vissza</b> a kimenettől indulva a gradienseket (piros, az élek alatt): minden csomópont a kapott gradienst megszorozza a saját helyi deriváltjával, " +
      "és továbbadja a bemeneteinek (láncszabály). A bemenetek értékét át is írhatod.");
    let key = "a", N = [], fstep = 0, bstep = 0;
    const leafBox = h("div", { class: "controls" });
    const gP = toggleGroup(Object.entries(CG_PRE).map(([k, o]) => [k, o.name]), () => key, k => { key = k; load(); });
    const bF = btn("▶ Előre lépés", () => { if (fstep < nOps()) fstep++; sync(); }, "btn primary");
    const bB = btn("◀ Vissza lépés", () => { if (bstep < nOps() + 1) bstep++; sync(); }, "btn primary");
    root.append(h("div", { class: "controls" }, gP.bs), leafBox,
      h("div", { class: "controls" }, bF, bB, btn("⏭ Mind", () => { fstep = nOps(); bstep = nOps() + 1; sync(); }), btn("↺ Újra", () => { fstep = bstep = 0; sync(); })));
    const cv = Calc.canvas(root, flatAspect(root, 0.46, 0.85));
    const out = h("div", { class: "readout" });
    const rules = h("div", { style: "border:1px solid var(--border);border-radius:8px;padding:.45rem .75rem;margin-top:.6rem;font-size:.9rem;background:var(--bg-soft)",
      html: "<b>Kapuszabályok – a gradiens útja visszafelé</b><br>" +
        "• <b>összeadás</b> – továbbadja: mindkét bemenet ugyanazt a gradienst kapja;<br>" +
        "• <b>szorzás</b> – felcseréli: az egyik bemenet gradiense = a <i>másik</i> bemenet értéke × a kapott gradiens;<br>" +
        "• <b>max</b> – a nagyobbhoz irányítja: a nagyobb bemenet mindent megkap, a kisebb 0-t;<br>" +
        "• <b>elágazás</b> – összeadódik: ha egy érték több helyre is megy, a visszajövő gradiensek összeadódnak." });
    root.append(out, rules);
    const ops = () => N.filter(n => n.op), nOps = () => ops().length, outN = () => N[N.length - 1];
    function load() {
      N = CG_PRE[key].nodes.map(n => Object.assign({}, n)); fstep = bstep = 0;
      leafBox.replaceChildren(small("bemenetek:"), ...N.filter(n => !n.op).map(n => {
        const inp = h("input", { type: "number", min: -5, max: 5, step: 0.5, value: n.v, style: "width:4.6em" });
        inp.addEventListener("input", () => { const v = parseFloat(String(inp.value).replace(",", ".")); if (Number.isFinite(v)) { n.v = clamp(v, -5, 5); sync(); } });
        return h("label", null, `${n.id} =`, inp);
      }));
      sync();
    }
    /* teljes számítás; a megjelenítést a lépésszámlálók szabják meg */
    function compute() {
      const V = {}, by = {};
      N.forEach(n => {
        by[n.id] = n;
        if (!n.op) V[n.id] = n.v;
        else {
          const a = n.in.map(k => V[k]);
          V[n.id] = n.op === "add" ? a[0] + a[1] : n.op === "mul" ? a[0] * a[1] : n.op === "max" ? Math.max(a[0], a[1]) : w1Sig(a[0]);
        }
      });
      const loc = n => {
        const a = n.in.map(k => V[k]);
        return n.op === "add" ? [1, 1] : n.op === "mul" ? [a[1], a[0]] : n.op === "max" ? (a[0] >= a[1] ? [1, 0] : [0, 1]) : [V[n.id] * (1 - V[n.id])];
      };
      /* visszafelé: E[src>dst] = az élen visszajövő gradiens; Gr = összeg; contrib = a részösszegek sorrendben */
      const Gr = {}, E = {}, contrib = {}, rev = ops().slice().reverse();
      N.forEach(n => { Gr[n.id] = 0; contrib[n.id] = []; });
      let msg = "";
      if (bstep >= 1) { Gr[outN().id] = 1; }
      rev.forEach((n, k) => {
        if (bstep < k + 2) return;
        const d = loc(n), g = Gr[n.id];
        n.in.forEach((s, i) => { const e = d[i] * g; E[s + ">" + n.id] = e; Gr[s] += e; contrib[s].push(e); });
      });
      return { V, by, loc, Gr, E, contrib, rev };
    }
    const fo = () => outN().id;
    function stepMsg(R) {
      const { V, loc, Gr, contrib, rev } = R, o = fo(), opsL = ops();
      const dd = s => `∂${o}/∂${s}`;
      if (bstep >= 1) {
        if (bstep === 1) return `<b>Vissza, kezdés:</b> ${dd(o)} = 1 – a kimenet önmagára nézve 1-es gradienssel indul.`;
        const n = rev[bstep - 2], d = loc(n), g = Gr[n.id], [a, b] = n.in;
        let s = `<b>Vissza – ${CG_NAME[n.op]}</b> (${n.id} = ${expr(n)}), a kapott gradiens ${dd(n.id)} = ${fmt(g, 4)}. `;
        const pv = v => par(v, 4);
        if (n.op === "add") s += `Összeadás: a helyi derivált mindkét bemenetre 1, a gradiens változatlanul továbbmegy: → ${a}: ${fmt(g, 4)}, → ${b}: ${fmt(g, 4)}.`;
        if (n.op === "mul") s += `Szorzás: a gradiens a <i>másik</i> bemenet értékével szorzódik: → ${a}: ${b}·${pv(g)} = ${pv(V[b])}·${pv(g)} = ${fmt(d[0] * g, 4)}; → ${b}: ${a}·${pv(g)} = ${pv(V[a])}·${pv(g)} = ${fmt(d[1] * g, 4)}.`;
        if (n.op === "max") { const w = d[0] ? a : b, l = d[0] ? b : a; s += `Max: a gradiens csak a nagyobb bemenethez jut (${w} = ${fmt(V[w], 4)}): → ${w}: ${fmt(g, 4)}; → ${l}: 0.`; }
        if (n.op === "sig") s += `Szigmoid: a helyi derivált σ(${a})·(1 − σ(${a})) = ${fmt(V[n.id], 4)}·${fmt(1 - V[n.id], 4)} = ${fmt(d[0], 4)}, így → ${a}: ${fmt(d[0], 4)}·${pv(g)} = ${fmt(d[0] * g, 4)}.`;
        const fan = n.in.filter(s2 => contrib[s2].length > 1);
        fan.forEach(s2 => { s += ` <b>Elágazás:</b> ${s2} két helyre is ment, a gradiensek összeadódnak: ${contrib[s2].map(v => fmt(v, 4)).join(" + ")} = ${fmt(Gr[s2], 4)}.`; });
        if (bstep === nOps() + 1) s += `<br>Kész: ` + N.filter(m => !m.op).map(m => `${dd(m.id)} = <b>${fmt(Gr[m.id], 4)}</b>`).join(" · ");
        return s;
      }
      if (fstep === 0) return "Kezdés: csak a bemenetek értéke ismert. Nyomd meg az „Előre lépés” gombot!";
      const n = opsL[fstep - 1];
      let s = `<b>Előre:</b> ${n.id} = ${expr(n)} = ${expr(n, V)} = <b>${fmt(V[n.id], 4)}</b>`;
      if (fstep === nOps()) s += `. Az előre menet kész – most jöhet a „Vissza lépés”.`;
      return s;
    }
    function expr(n, V) {
      const a = n.in.map(k => (V ? (V[k] < 0 ? `(${fmt(V[k], 4)})` : fmt(V[k], 4)) : k));
      return n.op === "add" ? `${a[0]} + ${a[1]}` : n.op === "mul" ? `${a[0]}·${a[1]}` : n.op === "max" ? `max(${a[0]}, ${a[1]})` : `σ(${a[0]})`;
    }
    cv.draw = () => {
      const { ctx, w, h: hh } = cv, R = compute(), { V, Gr, E, contrib } = R;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const narrow = w < 520, fs = narrow ? 11 : 12, rad = narrow ? 15 : 18;
      const cF = css("--accent"), cB = css("--bad"), cT = css("--text"), cM = css("--muted");
      const maxC = Math.max(...N.map(n => n.c)), padL = narrow ? 26 : 34, padR = narrow ? 62 : 84;
      const pos = n => [padL + n.c * (w - padL - padR) / maxC, 22 + n.r * (hh - 50)];
      const opIdx = id => ops().findIndex(m => m.id === id);
      const shownV = n => !n.op || opIdx(n.id) < fstep;
      const curF = bstep === 0 && fstep > 0 ? ops()[fstep - 1].id : null;
      const curB = bstep >= 2 ? R.rev[bstep - 2].id : bstep === 1 ? fo() : null;
      const ext = n => (n.op ? rad : narrow ? 13 : 15);
      /* élek */
      N.filter(n => n.op).forEach(n => n.in.forEach(s => {
        const a = pos(R.by[s]), b = pos(n), L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
        const p0 = [a[0] + ux * ext(R.by[s]), a[1] + uy * ext(R.by[s])], p1 = [b[0] - ux * rad, b[1] - uy * rad];
        const hotB = curB === n.id, hotF = curF === n.id;
        arrow(ctx, p0[0], p0[1], p1[0], p1[1], hotB ? cB : hotF ? cF : rgba(cM, 0.8), hotB || hotF ? 2.4 : 1.5);
        const t = R.by[s].op ? 0.5 : 0.55, mx = p0[0] + t * (p1[0] - p0[0]), my = p0[1] + t * (p1[1] - p0[1]);
        if (shownV(R.by[s])) w1Text(ctx, fmt(V[s], 3), mx, my - 3, cF, "center", "bottom", `700 ${fs}px system-ui, sans-serif`);
        const e = E[s + ">" + n.id];
        if (e != null) w1Text(ctx, fmt(e, 3), mx, my + 3, cB, "center", "top", `700 ${fs}px system-ui, sans-serif`);
      }));
      /* kimeneti csonk */
      const o = outN(), po = pos(o), xe = w - 6;
      arrow(ctx, po[0] + rad, po[1], xe, po[1], rgba(cM, 0.8), 1.5);
      const mo = (po[0] + rad + xe) / 2;
      if (shownV(o)) w1Text(ctx, `${o.id} = ${fmt(V[o.id], 3)}`, mo, po[1] - 3, cF, "center", "bottom", `700 ${fs}px system-ui, sans-serif`);
      if (bstep >= 1) w1Text(ctx, "1", mo, po[1] + 3, cB, "center", "top", `700 ${fs}px system-ui, sans-serif`);
      /* csomópontok */
      N.forEach(n => {
        const [x, yy] = pos(n);
        if (!n.op) {
          const bw = narrow ? 26 : 30;
          w1RoundRect(ctx, x - bw / 2, yy - bw / 2 + 2, bw, bw - 4, 6, css("--bg-soft"), cT, 1.6);
          label(ctx, n.id, x, yy + 1, cT, "center", `700 ${fs + 2}px system-ui, sans-serif`, "middle");
          if (contrib[n.id].length && bstep >= 2) {
            const c = contrib[n.id];
            const txt = (c.length > 1 ? `${c.map(v => fmt(v, 3)).join(" + ")} = ` : "") + fmt(Gr[n.id], 3);
            w1Text(ctx, txt, x - bw / 2, yy + bw / 2 + 3, cB, "left", "top", `700 ${fs}px system-ui, sans-serif`);
          }
        } else {
          const hot = curB === n.id ? cB : curF === n.id ? cF : cT;
          dot(ctx, x, yy, rad, css("--card")); ring(ctx, x, yy, rad, hot, hot === cT ? 1.8 : 3);
          label(ctx, CG_SYM[n.op], x, yy + 1, cT, "center", n.op === "max" ? `700 ${fs}px system-ui, sans-serif` : `700 ${fs + 6}px system-ui, sans-serif`, "middle");
          w1Text(ctx, n.id, x, yy - rad - 3, cM, "center", "bottom", `italic 600 ${fs + 1}px system-ui, sans-serif`);
        }
      });
    };
    function sync() {
      gP.paint();
      setDis(bF, fstep >= nOps()); setDis(bB, fstep < nOps() || bstep > nOps());
      cv.draw();
      const R = compute();
      out.innerHTML = stepMsg(R) + `<br><span class="muted">előre: ${fstep}/${nOps()} csomópont · vissza: ${Math.max(0, bstep - 1)}/${nOps()} csomópont</span>`;
    }
    load();
  };
