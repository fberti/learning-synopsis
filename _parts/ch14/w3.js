
  /* ==================================================================
     14.6–14.8  Diffúzió: közös segédek (w3-előtag)
     ================================================================== */
  /* fix tizedesjegyű magyar szám (a fmt levágja a záró nullákat, itt megtartjuk) */
  const w3F = (x, d = 3) => {
    const r = Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x;
    return r.toFixed(d).replace(".", ",").replace("-", "−");
  };
  /* kis tudományos alak nagyon kis számokra: 3,7·10⁻⁵ */
  const W3_SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const w3Sci = (x, d = 3) => {
    if (x === 0 || Math.abs(x) >= 0.001) return w3F(x, d);
    const e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    return w3F(m, 1) + "·10" + String(e).split("").map(c => W3_SUP[c]).join("");
  };
  const w3Sw = (colVar, txt, round = true) => h("span", { style: "display:inline-flex;align-items:center;gap:.3rem;margin-right:.8rem;white-space:nowrap" },
    h("span", { style: `display:inline-block;width:.8em;height:.8em;border-radius:${round ? "50%" : "3px"};background:var(${colVar})` }), txt);
  const w3Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0", html });
  function w3Stat(label) {
    const v = h("div", { class: "v" }, "–"), l = h("div", { class: "l" }, label);
    return { el: h("div", { class: "stat" }, v, l), v };
  }
  /* animáció csak látható widgetben: a hívó a visible() értékét figyeli */
  function w3Visible(root, onChange) {
    let vis = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(es => { vis = es[0].isIntersecting; onChange && onChange(vis); }).observe(root);
    }
    return () => vis;
  }
  /* pont–pont kattintás: a legközelebbi index (képpontban), ha r-en belül */
  function w3Pick(T, pts, px, py, r = 18) {
    let bi = -1, bd = r * r;
    pts.forEach(([x, y], i) => { const d = (T.tx(x) - px) ** 2 + (T.ty(y) - py) ** 2; if (d < bd) { bd = d; bi = i; } });
    return bi;
  }

  /* koszinuszos zajütemezés: ᾱ_t = f(t)/f(0), f(t) = cos²(((t/T) + s)/(1 + s) · π/2), s = 0,008 */
  /* (t lehet tört is: 1000 lépésnél a 0…T időt sűrűbben mintavételezzük) */
  function w3CosSched(T, s = 0.008) {
    const f = t => Math.cos(((t / T) + s) / (1 + s) * Math.PI / 2) ** 2, f0 = f(0);
    return t => f(t) / f0;
  }
  /* egyenletesen ritkított időpontok: T, …, 0 (n lépés; ha n osztója T-nek, egészek) */
  const w3Times = (T, n) => Array.from({ length: n + 1 }, (_, k) => (k === n ? 0 : T * (n - k) / n));

  /* A pontos (ideális) zajtalanító egy Gauss-keverékre.
     Komponensek: mu[k] = [x, y], h2[k] = szórásnégyzet, lw[k] = ln(súly).
     q_t(x) = Σ π_k N(x; √ᾱ μ_k, (ᾱ h_k² + 1 − ᾱ) I)
     x̂_0 = E[x_0 | x_t] = Σ w_k m_k,  m_k = μ_k + (h_k² √ᾱ / v_k)(x_t − √ᾱ μ_k),  v_k = ᾱ h_k² + 1 − ᾱ,
     w_k ∝ π_k exp(−‖x_t − √ᾱ μ_k‖² / (2 v_k)) / v_k.   idx: a felhasznált komponensek (null = mind). */
  function w3X0(x, y, ab, mix, idx, wbuf) {
    const sa = Math.sqrt(ab), { mu, h2, lw } = mix, K = idx ? idx.length : mu.length;
    let mx = -Infinity;
    for (let j = 0; j < K; j++) {
      const k = idx ? idx[j] : j, v = ab * h2[k] + 1 - ab, dx = x - sa * mu[k][0], dy = y - sa * mu[k][1];
      const l = lw[k] - (dx * dx + dy * dy) / (2 * v) - Math.log(v);
      wbuf[j] = l; if (l > mx) mx = l;
    }
    let S = 0, ox = 0, oy = 0;
    for (let j = 0; j < K; j++) {
      const k = idx ? idx[j] : j, v = ab * h2[k] + 1 - ab, g = h2[k] * sa / v, e = Math.exp(wbuf[j] - mx);
      S += e;
      ox += e * (mu[k][0] + g * (x - sa * mu[k][0]));
      oy += e * (mu[k][1] + g * (y - sa * mu[k][1]));
    }
    return [ox / S, oy / S];
  }
  /* Egy visszafelé lépés t → t' (ᾱ, ᾱ'): DDIM (eta = 0) vagy DDPM (eta = 1, σ_t a brief képlete szerint).
     A háló kimenete itt x̂_0; ε̂ = (x_t − √ᾱ x̂_0)/√(1 − ᾱ). */
  function w3Step(x, x0, ab, ab1, eta, z) {
    const eps = (x - Math.sqrt(ab) * x0) / Math.sqrt(1 - ab);
    const s2 = eta ? (1 - ab1) / (1 - ab) * (1 - ab / ab1) : 0;
    const c = Math.sqrt(Math.max(0, 1 - ab1 - s2));
    return Math.sqrt(ab1) * x0 + c * eps + (eta ? Math.sqrt(s2) * z : 0);
  }

  /* ---------- tanítóadatok a síkon (60 pont, [−1; 1]²) ---------- */
  const W3_SHAPES = {
    spiral: { t: "spirál", seed: 141, make: (rnd, out) => {
      for (let i = 0; i < 60; i++) {
        const u = i / 59, th = 0.6 * Math.PI + 3.4 * Math.PI * u, r = 0.12 + 0.83 * u;
        out.push([r * Math.cos(th) + 0.015 * gauss(rnd), r * Math.sin(th) + 0.015 * gauss(rnd)]);
      }
    } },
    moons: { t: "két félhold", seed: 142, make: (rnd, out) => {
      for (let i = 0; i < 60; i++) {
        const th = Math.PI * (i % 30) / 29;
        const [x, y] = i < 30 ? [Math.cos(th), Math.sin(th)] : [1 - Math.cos(th), 0.5 - Math.sin(th)];
        out.push([(x - 0.5) * 0.62 + 0.02 * gauss(rnd), (y - 0.25) * 0.62 + 0.02 * gauss(rnd)]);
      }
    } },
    smile: { t: "mosoly", seed: 143, make: (rnd, out) => {
      const j = () => 0.01 * gauss(rnd);
      for (let k = 0; k < 28; k++) { const a = 2 * Math.PI * k / 28; out.push([0.92 * Math.cos(a) + j(), 0.92 * Math.sin(a) + j()]); }
      for (const ex of [-0.33, 0.33]) for (let k = 0; k < 6; k++) { const a = 2 * Math.PI * k / 6; out.push([ex + 0.07 * Math.cos(a) + j(), 0.3 + 0.07 * Math.sin(a) + j()]); }
      for (let k = 0; k < 20; k++) { const a = (205 + 130 * k / 19) * Math.PI / 180; out.push([0.5 * Math.cos(a) + j(), 0.05 + 0.5 * Math.sin(a) + j()]); }
    } }
  };
  const w3ShapeData = key => {
    const S = W3_SHAPES[key], rnd = rng(S.seed), out = [];
    S.make(rnd, out);
    return out.map(([x, y]) => [clamp(x, -1, 1), clamp(y, -1, 1)]);
  };

  /* Teljes visszafelé futás (minden pont, minden lépés) előre kiszámolva.
     x0fn(x, y, ab) → [x̂_0x, x̂_0y]; visszaadja { ts, X: [lépés] → Float64Array(2N) (x, y felváltva), X0: ugyanígy } */
  function w3Run(start, ts, abar, x0fn, eta, seed) {
    const n = ts.length - 1, N = start.length, zr = rng(seed), X = [Float64Array.from(start.flat())], X0 = [];
    for (let k = 0; k < n; k++) {
      const ab = abar(ts[k]), ab1 = abar(ts[k + 1]), cur = X[k], nx = new Float64Array(2 * N), p0 = new Float64Array(2 * N);
      for (let i = 0; i < N; i++) {
        const x = cur[2 * i], y = cur[2 * i + 1], q = x0fn(x, y, ab, i);
        const z1 = eta ? gauss(zr) : 0, z2 = eta ? gauss(zr) : 0;
        p0[2 * i] = q[0]; p0[2 * i + 1] = q[1];
        nx[2 * i] = w3Step(x, q[0], ab, ab1, eta, z1); nx[2 * i + 1] = w3Step(y, q[1], ab, ab1, eta, z2);
      }
      X.push(nx); X0.push(p0);
    }
    return { ts, X, X0 };
  }
  const w3Pairs = F => Array.from({ length: F.length / 2 }, (_, i) => [F[2 * i], F[2 * i + 1]]);
  const w3Median = a => { const s = a.slice().sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  /* a végső minták legközelebbi tanítópontja */
  function w3NN(samples, data) {
    return samples.map(([x, y]) => {
      let bd = Infinity, bi = 0;
      data.forEach(([a, b], i) => { const d = (x - a) ** 2 + (y - b) ** 2; if (d < bd) { bd = d; bi = i; } });
      return { d: Math.sqrt(bd), i: bi };
    });
  }
  const W3_T = 50, W3_AB = w3CosSched(W3_T), W3_ABAR = Array.from({ length: W3_T + 1 }, (_, t) => W3_AB(t));

  /* ==================================================================
     14.6-a/c, 14.8-b  diffusion-2d – Diffúzió a síkon
     ================================================================== */
  W["diffusion-2d"] = root => {
    header(root, "Diffúzió a síkon",
      "60 tanítópont a síkon. <b>Előre:</b> minden pontot lépésenként zajjal keverünk, amíg el nem tűnik a forma. " +
      "<b>Visszafelé:</b> 300 tiszta zajpontból indulunk, és a zajtalanító lépésről lépésre visszavezeti őket. " +
      "Itt nincs betanított háló: a <b>pontos</b> zajtalanítót használjuk, amely tudja, hol vannak a tanítópontok " +
      "(mindegyiket egy $h$ szórású kis Gauss-felhőnek tekinti).");
    let shape = "spiral", tab = "fwd", tF = 20, sel = 7, fSeed = 7;
    let hw = 0.05, nSteps = 50, eta = 0, bSeed = 1, showX0 = false, k = 0, sSel = 0;
    let data = w3ShapeData(shape), eps = [], run = null, final = null, nn = null, stats = null;
    const mkEps = () => { const r = rng(fSeed); eps = data.map(() => [gauss(r), gauss(r)]); };
    mkEps();

    const shG = toggleGroup(Object.entries(W3_SHAPES).map(([key, S]) => [key, S.t]), () => shape, v => {
      shape = v; data = w3ShapeData(shape); mkEps(); recompute(); draw();
    });
    const tabG = toggleGroup([["fwd", "Előre: zajosítás"], ["bwd", "Visszafelé: mintavétel"]], () => tab, v => {
      tab = v; if (tab === "bwd" && !played) { played = true; play(true); } draw();
    });
    root.append(h("div", { class: "controls" }, small("tanítóadat:"), shG.bs), h("div", { class: "controls" }, tabG.bs));

    /* --- előre fül vezérlői --- */
    const tS = slider(0, W3_T, 1, tF), tLab = h("b", null, "");
    tS.oninput = () => { tF = +tS.value; draw(); };
    const fwdBox = h("div", null,
      h("div", { class: "controls" }, h("label", null, "lépés t:", tS, tLab), btn("Új zaj", () => { fSeed++; mkEps(); draw(); })));

    /* --- visszafelé fül vezérlői --- */
    const hS = slider(0, 0.2, 0.005, hw), hLab = h("b", null, "");
    const applyH = () => { hw = +hS.value; recompute(); k = nSteps; stop(); draw(); };
    hS.oninput = () => { if (nSteps <= 50) applyH(); else hLab.textContent = w3F(+hS.value, 3); };
    hS.onchange = applyH;
    const nG = toggleGroup([[5, "5"], [10, "10"], [25, "25"], [50, "50"], [1000, "1000"]], () => nSteps, v => { nSteps = +v; recompute(); k = nSteps; stop(); draw(); });
    const mG = toggleGroup([[0, "DDIM (determinisztikus)"], [1, "DDPM (sztochasztikus)"]], () => eta, v => { eta = +v; recompute(); k = nSteps; stop(); draw(); });
    const kS = slider(0, nSteps, 1, 0);
    kS.oninput = () => { stop(); k = +kS.value; frac = 0; draw(); };
    const playB = btn("▶ Lejátszás", () => (playing ? stop() : play(k >= nSteps)));
    const x0C = checkbox(showX0, () => { showX0 = x0C.checked; draw(); });
    const bwdBox = h("div", { style: "display:none" },
      h("div", { class: "controls" }, small("lépések:"), nG.bs),
      h("div", { class: "controls" }, small("mód:"), mG.bs),
      h("div", { class: "controls" }, h("label", null, "simítás h:", hS, hLab),
        h("label", null, x0C, "x̂₀ tippek")),
      h("div", { class: "controls" }, playB, h("label", { style: "flex:1;min-width:180px" }, "lépés:", kS),
        btn("Új mag", () => { bSeed++; recompute(); play(true); })));
    root.append(fwdBox, bwdBox);

    const [cvA, cvB, boxA, boxB] = twoCanvas(root, 1, 1);
    const capA = h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }), capB = capA.cloneNode();
    boxA.prepend(capA); boxB.prepend(capB);
    const legend = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.4rem" });
    const ro = h("div", { class: "readout" });
    const st = [w3Stat("másolat (< 0,01 egy tanítóponttól)"), w3Stat("medián távolság a legközelebbi tanítóponttól"), w3Stat("lépések · mód")];
    const statRow = h("div", { class: "stat-row" }, st.map(s => s.el));
    const note = w3Note("");
    root.append(legend, ro, statRow, note);

    function recompute() {
      const r = rng(bSeed * 7919 + 13), start = Array.from({ length: 300 }, () => [gauss(r), gauss(r)]);
      const mix = { mu: data, h2: data.map(() => hw * hw), lw: data.map(() => 0) }, wb = new Float64Array(data.length);
      run = w3Run(start, w3Times(W3_T, nSteps), W3_AB, (x, y, ab) => w3X0(x, y, ab, mix, null, wb), eta, bSeed * 104729 + 1);
      final = w3Pairs(run.X[nSteps]); nn = w3NN(final, data);
      const ds = nn.map(o => o.d);
      stats = { copy: ds.filter(d => d < 0.01).length / ds.length, med: w3Median(ds) };
      root.__w3 = { data, start, final, ts: run.ts, stats, h: hw, nSteps, eta };
      kS.max = nSteps;
    }

    /* --- animáció --- */
    let playing = false, played = false, frac = 0, last = 0, raf = 0;
    const visible = w3Visible(root, v => { if (v && playing && !raf) raf = requestAnimationFrame(tick); });
    function play(fromStart) {
      if (fromStart) { k = 0; frac = 0; }
      playing = true; playB.textContent = "⏸ Szünet"; last = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function stop() { playing = false; playB.textContent = "▶ Lejátszás"; frac = 0; }
    function tick(now) {
      raf = 0;
      if (!playing || !visible()) return;
      const dt = last ? Math.min(100, now - last) : 16; last = now;
      const per = nSteps <= 50 ? Math.max(70, 3500 / nSteps) : 5000 / nSteps;   // egy lépés ideje (ms)
      frac += dt / per;
      while (frac >= 1 && k < nSteps) { frac -= 1; k++; }
      if (k >= nSteps) { k = nSteps; frac = 0; stop(); }
      draw();
      if (playing) raf = requestAnimationFrame(tick);
    }

    const view = cv => eqView(cv, 0, 0, 2.7, 2.7, { xname: "", yname: "" });
    const zoomV = cv => eqView(cv, 0, 0, 1.15, 1.15, { xname: "", yname: "" });
    const pt = (ctx, T, x, y, r, col) => { ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), r, 0, 2 * Math.PI); ctx.fillStyle = col; ctx.fill(); };
    const inV = (V, x, y) => x > V.xmin && x < V.xmax && y > V.ymin && y < V.ymax;

    function drawFwd() {
      const ab = W3_ABAR[tF], sa = Math.sqrt(ab), sb = Math.sqrt(1 - ab);
      const Xt = data.map((p, i) => [sa * p[0] + sb * eps[i][0], sa * p[1] + sb * eps[i][1]]);
      [[cvA, view], [cvB, zoomV]].forEach(([cv, vf]) => {
        cv.draw = () => {
          const V = vf(cv), T = Calc.plot(cv, V, []), { ctx } = cv;
          ring(ctx, T.tx(0), T.ty(0), T.tx(1) - T.tx(0), css("--muted"), 1.4, [5, 4]);
          ring(ctx, T.tx(0), T.ty(0), T.tx(2) - T.tx(0), css("--border"), 1.2, [5, 4]);
          data.forEach(([x, y]) => pt(ctx, T, x, y, 2.4, rgba(css("--muted"), 0.45)));
          const path = []; for (let s = 0; s <= tF; s++) { const a = Math.sqrt(W3_ABAR[s]), b = Math.sqrt(1 - W3_ABAR[s]); path.push([a * data[sel][0] + b * eps[sel][0], a * data[sel][1] + b * eps[sel][1]]); }
          polyline(ctx, T, path, css("--setB"), 2);
          Xt.forEach(([x, y]) => inV(V, x, y) && pt(ctx, T, x, y, 3.2, css("--setA")));
          dot(ctx, T.tx(Xt[sel][0]), T.ty(Xt[sel][1]), 5.5, css("--setB"));
          ring(ctx, T.tx(data[sel][0]), T.ty(data[sel][1]), 5, css("--setB"), 2);
          cv.T = T;
          cv.pts = Xt;
        };
        cv.draw();
      });
      capA.textContent = "az egész sík"; capB.textContent = "közelről (a tanítóadat környéke)";
      tLab.textContent = `${tF} / ${W3_T}`;
      ro.innerHTML = `t = <b>${tF}</b> &nbsp; ᾱ<sub>t</sub> = <b>${w3Sci(ab, 3)}</b> &nbsp; √ᾱ<sub>t</sub> = <b>${w3F(sa, 3)}</b> (ennyi marad a jelből) &nbsp; ` +
        `√(1 − ᾱ<sub>t</sub>) = <b>${w3F(sb, 3)}</b> (ennyi a zaj)`;
      legend.replaceChildren(w3Sw("--muted", "eredeti pont (x₀)"), w3Sw("--setA", "zajos pont (xₜ)"), w3Sw("--setB", "egy kijelölt pont útja"),
        h("span", { style: "white-space:nowrap" }, "szaggatott kör: a standard normális 1σ és 2σ köre"));
      statRow.style.display = "none";
      note.innerHTML = "Minden pont saját, rögzített zajjal: $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\varepsilon$. " +
        "Koszinuszos ütemezés, $T = 50$: a forma eleinte lassan oszlik, a végén $\\bar\\alpha_{50} \\approx 0$, és csak a zaj marad – egy " +
        "standard normális felhő. Kattints egy pontra, hogy az útját kövesd.";
      math(note);
    }

    function drawBwd() {
      const n = nSteps, kk = Math.min(k, n), fr = kk < n ? frac : 0;
      const A = run.X[kk], B = run.X[Math.min(n, kk + 1)];
      const cur = Array.from({ length: A.length / 2 }, (_, i) => [A[2 * i] + (B[2 * i] - A[2 * i]) * fr, A[2 * i + 1] + (B[2 * i + 1] - A[2 * i + 1]) * fr]);
      const x0s = kk < n ? w3Pairs(run.X0[kk]) : null, done = kk >= n;
      const path = []; for (let j = 0; j <= kk; j++) path.push([run.X[j][2 * sSel], run.X[j][2 * sSel + 1]]); if (fr) path.push(cur[sSel]);
      [[cvA, view], [cvB, zoomV]].forEach(([cv, vf]) => {
        cv.draw = () => {
          const V = vf(cv), T = Calc.plot(cv, V, []), { ctx } = cv;
          ring(ctx, T.tx(0), T.ty(0), T.tx(1) - T.tx(0), css("--border"), 1.2, [5, 4]);
          if (showX0 && x0s) x0s.forEach(([x, y]) => inV(V, x, y) && pt(ctx, T, x, y, 2.4, rgba(css("--setC"), 0.55)));
          data.forEach(([x, y]) => ring(ctx, T.tx(x), T.ty(y), 3.6, css("--setA"), 1.6));
          cur.forEach(([x, y]) => inV(V, x, y) && pt(ctx, T, x, y, 2.4, rgba(css("--setB"), 0.85)));
          polyline(ctx, T, path, css("--text"), 1.6);
          const [sx, sy] = cur[sSel];
          if (inV(V, sx, sy)) { dot(ctx, T.tx(sx), T.ty(sy), 5, css("--text")); ring(ctx, T.tx(sx), T.ty(sy), 5, css("--card"), 1.5); }
          if (showX0 && x0s) { const [qx, qy] = x0s[sSel]; ring(ctx, T.tx(qx), T.ty(qy), 5, css("--setC"), 2.2); }
          cv.T = T; cv.pts = cur;
        };
        cv.draw();
      });
      capA.textContent = "az egész sík"; capB.textContent = "közelről, a tanítópontokkal";
      const t = run.ts[kk], ab = W3_AB(t);
      hLab.textContent = w3F(hw, 3); kS.value = kk;
      ro.innerHTML = `lépés <b>${kk} / ${n}</b> &nbsp; t = <b>${Number.isInteger(t) ? t : w3F(t, 2)}</b> &nbsp; ᾱ<sub>t</sub> = <b>${w3Sci(ab, 3)}</b>` +
        (done ? " &nbsp; – kész, ezek a minták." : "");
      legend.replaceChildren(w3Sw("--setA", "tanítópont"), w3Sw("--setB", "minta (xₜ)"),
        w3Sw("--text", "egy kijelölt minta útja"), ...(showX0 && x0s ? [w3Sw("--setC", "x̂₀: a zajtalanító tippje a végeredményre")] : []));
      statRow.style.display = "";
      st[0].v.textContent = pct(stats.copy, 1);
      st[1].v.textContent = w3F(stats.med, 3);
      st[2].v.textContent = `${n} · ${eta ? "DDPM" : "DDIM"}`;
      const s = nn[sSel];
      note.innerHTML = `A végső mintákra számolva (mag: ${bSeed}). A kijelölt minta végül ${w3F(s.d, 3)} távolságra kerül a legközelebbi tanítóponttól` +
        (s.d < 0.01 ? " – <b>gyakorlatilag lemásolta</b>." : ".") + " Kattints egy mintára, hogy az útját kövesd. " +
        (hw < 0.0125 ? "Kis $h$-nál a zajtalanító a véges tanítóhalmazt tanulta meg tökéletesen – és ezért szinte csak a tanítópontokat tudja visszaadni. " +
          `Az utolsó lépés előtt még $\\sqrt{1-\\bar\\alpha_t}$ = ${w3F(Math.sqrt(1 - W3_AB(run.ts[n - 1])), 3)} zaj van a képen` +
          (n < 1000 ? " – ez összemérhető a szomszédos tanítópontok távolságával, ezért az utolsó tipp még két-három szomszéd átlaga lehet. Próbáld 1000 lépéssel: ott a minták gyakorlatilag mind tanítópontok."
            : " – ez már jóval kisebb a pontok távolságánál, így a minták gyakorlatilag mind tanítópontok.")
          : hw > 0.12 ? "Nagy $h$-nál a minták szétkenődnek a formán, és el is maszatolódnak róla."
            : "Közepes $h$-nál a minták a forma mentén szóródnak: újak, de a formát követik.");
      math(note);
    }

    function draw() {
      shG.paint(); tabG.paint(); nG.paint(); mG.paint();
      fwdBox.style.display = tab === "fwd" ? "" : "none";
      bwdBox.style.display = tab === "bwd" ? "" : "none";
      (tab === "fwd" ? drawFwd : drawBwd)();
    }
    [cvA, cvB].forEach(cv => cv.c.addEventListener("pointerdown", e => {
      if (!cv.T) return;
      const [px, py] = evXY(cv, e), i = w3Pick(cv.T, cv.pts, px, py);
      if (i < 0) return;
      if (tab === "fwd") sel = i; else sSel = i;
      draw();
    }));
    recompute(); k = 0; draw();
  };

  /* ==================================================================
     14.6-c  diffusion-digits – Egy diffúziós modell munka közben
     ================================================================== */
  /* lineáris ütemezés: β_t = 1e−4 … 0,02 (t = 0 … 999), ᾱ_t = Π_{s ≤ t}(1 − β_s) */
  const W3_LIN = (() => { const a = []; let p = 1; for (let t = 0; t < 1000; t++) { p *= 1 - (1e-4 + (0.02 - 1e-4) * t / 999); a.push(p); } return a; })();

  W["diffusion-digits"] = root => {
    const D = window.GEN14.ddpm, AE = window.GEN14.ae;
    header(root, "Egy diffúziós modell munka közben",
      "Fent egy valódi számjegyet zajosítunk; lent egy betanított, 1000 lépéses diffúziós modell nyolc mintavételének pillanatképei. " +
      "Kapcsold át, mit mutasson: a zajos képet, amit a háló bemenetként kap, vagy a háló <b>tippjét a tiszta képre</b> ($\\hat x_0$).");
    /* --- zajosítás --- */
    let dig = 3, t = 300, seed = 5, mode = "x";
    let eps = [];
    const mkEps = () => { const r = rng(seed); eps = Array.from({ length: 64 }, () => gauss(r)); };
    mkEps();
    const digG = toggleGroup(AE.label.map((l, i) => [i, String(l)]), () => dig, v => { dig = +v; draw(); });
    const tS = slider(0, 999, 1, t), tLab = h("b", null, "");
    tS.oninput = () => { t = +tS.value; draw(); };
    root.append(h("div", { class: "controls" }, small("számjegy:"), digG.bs),
      h("div", { class: "controls" }, h("label", { style: "flex:1;min-width:200px" }, "lépés t:", tS, tLab), btn("Új zaj", () => { seed++; mkEps(); draw(); })));
    const top = h("div", { style: "display:flex;gap:1rem;align-items:center;flex-wrap:wrap" });
    const cvTopBox = h("div", { style: "width:240px;max-width:100%" });
    const roTop = h("div", { class: "readout", style: "flex:1;min-width:200px;margin-top:0" });
    top.append(cvTopBox, roTop); root.append(top);
    const cvT = Calc.canvas(cvTopBox, 0.5, 240);

    /* --- a minták rácsa --- */
    const mG = toggleGroup([["x", "xₜ (amit a háló kap)"], ["x0", "x̂₀ (a háló tippje a tiszta képre)"]], () => mode, v => { mode = v; draw(); });
    root.append(h("div", { class: "controls", style: "margin-top:1rem" }, small("a rácsban:"), mG.bs));
    const gridBox = h("div", { style: "min-width:0" }); root.append(gridBox);
    const cvG = Calc.canvas(gridBox, 0.68, 760);
    const note = w3Note("");
    root.append(note);

    const toImg = x => x.map(v => clamp((v + 1) / 2 * 16, 0, 16));      // −1…1 → 0…16
    function draw() {
      digG.paint(); mG.paint();
      const ab = W3_LIN[t], sa = Math.sqrt(ab), sb = Math.sqrt(1 - ab);
      const x0 = AE.orig[dig].map(v => v / 16 * 2 - 1), xt = x0.map((v, i) => sa * v + sb * eps[i]);
      tLab.textContent = String(t);
      cvT.draw = () => {
        const { ctx, w, h: H } = cvT, s = Math.min(H - 18, (w - 12) / 2);
        ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
        drawDigit(ctx, 0, 16, s, AE.orig[dig]);
        drawDigit(ctx, s + 12, 16, s, toImg(xt));
        label(ctx, "x₀ (eredeti)", s / 2, 13, css("--muted"), "center", "600 11px system-ui, sans-serif");
        label(ctx, `xₜ, t = ${t}`, s * 1.5 + 12, 13, css("--muted"), "center", "600 11px system-ui, sans-serif");
      };
      cvT.draw();
      const snr = ab / (1 - ab);
      roTop.innerHTML = `ᾱ<sub>t</sub> = <b>${w3Sci(ab, 4)}</b><br>√ᾱ<sub>t</sub> = <b>${w3F(sa, 3)}</b> · jel, √(1 − ᾱ<sub>t</sub>) = <b>${w3F(sb, 3)}</b> · zaj<br>` +
        `jel/zaj arány ᾱ/(1 − ᾱ) = <b>${snr >= 100 ? fmt(snr, 0) : w3Sci(snr, 3)}</b>`;

      const near = D.t.reduce((bi, v, i) => (Math.abs(v - t) < Math.abs(D.t[bi] - t) ? i : bi), 0);
      cvG.draw = () => {
        const { ctx, w } = cvG, cols = 13, rows = 8, head = 30, gap = w < 520 ? 2 : 4;
        const s = Math.floor(Math.min((w - gap * (cols - 1)) / cols, 52));
        const W0 = cols * s + (cols - 1) * gap, ox = Math.floor((w - W0) / 2);
        const Hn = head + rows * (s + gap) + 4;
        if (Math.abs(cvG.h - Hn) > 1) { cvG.c.style.height = Hn + "px"; const dpr = window.devicePixelRatio || 1; cvG.c.height = Math.round(Hn * dpr); cvG.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cvG.h = Hn; }
        ctx.clearRect(0, 0, w, cvG.h); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, cvG.h);
        const fs = s < 30 ? 9.5 : 11;
        label(ctx, "t =", ox, 12, css("--muted"), "left", `600 ${fs}px system-ui, sans-serif`);
        for (let c = 0; c < cols; c++) {
          const x = ox + c * (s + gap);
          if (c === near) { ctx.fillStyle = css("--accent-soft"); ctx.fillRect(x - gap / 2, head - 13, s + gap, rows * (s + gap) + 13); }
          label(ctx, String(D.t[c]), x + s / 2, head - 2, c === near ? css("--accent") : css("--muted"), "center", `600 ${fs}px system-ui, sans-serif`);
          for (let r = 0; r < rows; r++) {
            const v = mode === "x" ? toImg(D.x[c][r]) : D.x0[c][r];
            drawDigit(ctx, x, head + r * (s + gap), s, v);
          }
        }
      };
      cvG.draw();
      note.innerHTML = (mode === "x"
        ? "Balról jobbra halad a mintavétel: tiszta zajból ($t = 999$) lépésenként tisztul a kép. Figyeld meg, hogy sokáig alig látszik valami, aztán $t \\approx 300$–$100$ között hirtelen összeáll a számjegy."
        : "A háló minden lépésben megtippeli a tiszta képet: $\\hat x_0 = (x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\hat\\varepsilon)/\\sqrt{\\bar\\alpha_t}$. " +
          "A legelején ($t = 999$–$800$) ez még zajos, csupa szélsőséges pixel: itt $\\sqrt{\\bar\\alpha_t}$ parányi (0,006–0,04), és a visszaszámolás a háló kis hibáját is óriásira nagyítja. " +
          "$t \\approx 600$–$500$ körül a tipp szinte minden sorban ugyanaz a homályos „átlagkép” – a zajból még nem tudható, mi lesz. Ahogy fogy a zaj, a tipp élesedik, a sorok szétválnak, és eldől, melyik számjegy lesz.") +
        " A kiemelt oszlop a fenti csúszkához legközelebbi lépés.";
      math(note);
    }
    draw();
  };

  /* ==================================================================
     14.7-b  cfg-2d – Az irányítás erőssége (osztályozómentes irányítás)
     ================================================================== */
  const W3_CFG = (() => {
    const A = [[-0.7, 0.35], [-0.55, -0.45], [-0.05, 0.15]], B = A.map(([x, y]) => [-x, -y]);
    const hs = [0.2, 0.2, 0.22], mu = [...A, ...B], h2 = [...hs, ...hs].map(v => v * v);
    return { mix: { mu, h2, lw: mu.map(() => Math.log(1 / 6)) }, cls: [[0, 1, 2], [3, 4, 5]], hs: [...hs, ...hs] };
  })();
  /* p(c | x) a tiszta adatra */
  function w3Post(x, y, c) {
    const { mu, h2 } = W3_CFG.mix;
    let pc = 0, pa = 0;
    mu.forEach(([a, b], k) => { const p = Math.exp(-((x - a) ** 2 + (y - b) ** 2) / (2 * h2[k])) / h2[k]; pa += p; if (W3_CFG.cls[c].includes(k)) pc += p; });
    return pa > 0 ? pc / pa : 0.5;
  }
  /* a c osztály adatának szórása (RMS távolság az átlagtól), pontosan */
  function w3ClassSpread(c) {
    const ks = W3_CFG.cls[c], { mu, h2 } = W3_CFG.mix, m = [0, 1].map(d => ks.reduce((s, k) => s + mu[k][d], 0) / ks.length);
    return Math.sqrt(ks.reduce((s, k) => s + (mu[k][0] - m[0]) ** 2 + (mu[k][1] - m[1]) ** 2 + 2 * h2[k], 0) / ks.length);
  }
  /* irányított mintavétel: x̃_0 = x̂_0ᵘ + s(x̂_0ᶜ − x̂_0ᵘ) (ez ugyanaz, mint ε̃ = ε̂_u + s(ε̂_c − ε̂_u)) */
  function w3CfgRun(c, s, start, nSteps = 25) {
    const wb = new Float64Array(6), { mix, cls } = W3_CFG;
    return w3Run(start, w3Times(W3_T, nSteps), W3_AB, (x, y, ab) => {
      const u = w3X0(x, y, ab, mix, null, wb), q = w3X0(x, y, ab, mix, cls[c], wb);
      return [u[0] + s * (q[0] - u[0]), u[1] + s * (q[1] - u[1])];
    }, 0, 0);
  }
  function w3CfgStats(c, S) {
    const n = S.length, m = [0, 1].map(d => S.reduce((a, p) => a + p[d], 0) / n);
    const spread = Math.sqrt(S.reduce((a, p) => a + (p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2, 0) / n);
    const sure = S.filter(([x, y]) => w3Post(x, y, c) > 0.9).length / n;
    const { cls, hs } = W3_CFG;
    const out = S.filter(([x, y]) => cls[c].every(k => Math.hypot(x - W3_CFG.mix.mu[k][0], y - W3_CFG.mix.mu[k][1]) > 3 * hs[k])).length / n;
    /* melyik felhőhöz tartozik a minta (a 6 közül a legnagyobb felelősségű)? cls[c][2] a c osztály középső, átfedő felhője */
    const { mu, h2 } = W3_CFG.mix;
    const mid = S.filter(([x, y]) => argmax(mu.map((m, k) => -((x - m[0]) ** 2 + (y - m[1]) ** 2) / (2 * h2[k]) - Math.log(h2[k]))) === cls[c][2]).length / n;
    return { sure, spread, out, mid, mean: m };
  }

  W["cfg-2d"] = root => {
    header(root, "Az irányítás erőssége",
      "Két osztály a síkon: <b>A</b> és <b>B</b>, mindkettő három kis Gauss-felhő keveréke, középen átfedéssel. A pontos zajtalanítónak két változata van: " +
      "a feltétel nélküli (minden felhőt lát, $\\hat\\varepsilon_u$) és a feltételes (csak a választott osztályét, $\\hat\\varepsilon_c$). " +
      "Az irányított becslés: $\\tilde\\varepsilon = \\hat\\varepsilon_u + s\\,(\\hat\\varepsilon_c - \\hat\\varepsilon_u)$. 300 minta, DDIM, 25 lépés.");
    let c = 0, s = 3, seed = 1, start = [];
    const mkStart = () => { const r = rng(seed * 7919 + 13); start = Array.from({ length: 300 }, () => [gauss(r), gauss(r)]); };
    mkStart();
    /* a tanítóadat illusztrációja: 150–150 pont a keverékből (rögzített mag) */
    const cloud = (() => {
      const r = rng(2024), out = [];
      for (let cc = 0; cc < 2; cc++) for (let i = 0; i < 150; i++) {
        const k = W3_CFG.cls[cc][i % 3], hh = W3_CFG.hs[k];
        out.push([W3_CFG.mix.mu[k][0] + hh * gauss(r), W3_CFG.mix.mu[k][1] + hh * gauss(r), cc]);
      }
      return out;
    })();
    const cG = toggleGroup([[0, "A osztály"], [1, "B osztály"]], () => c, v => { c = +v; curve = null; update(); });
    const sS = slider(0, 8, 0.25, s), sLab = h("b", null, "");
    sS.oninput = () => { s = +sS.value; update(); };
    const presets = [0, 1, 3, 7.5].map(v => btn(`s = ${fmt(v, 1)}`, () => { s = v; sS.value = v; update(); }));
    root.append(h("div", { class: "controls" }, small("feltétel:"), cG.bs, btn("Új mag", () => { seed++; mkStart(); curve = null; update(); })),
      h("div", { class: "controls" }, h("label", { style: "flex:1;min-width:200px" }, "irányítás s:", sS, sLab)),
      h("div", { class: "controls" }, small("jelölt értékek:"), presets));
    const [cvA, cvB, , boxB] = twoCanvas(root, 1, 0.8);
    const capB = h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, "Hogyan függ s-től? (az összes s egyszerre)");
    boxB.prepend(capB);
    const legend = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.4rem" });
    const st = [w3Stat(""), w3Stat("a saját középső (átfedő) felhőjénél; az adatban 23,7%"), w3Stat("a minták szórása (sokféleség)"), w3Stat("kilóg az adatból")];
    const note = w3Note("");
    root.append(legend, h("div", { class: "stat-row" }, st.map(x => x.el)), note);

    let curve = null;                                          // s ↦ statisztikák, 0 … 8
    const sGrid = Array.from({ length: 33 }, (_, i) => i * 0.25);
    function update() {
      cG.paint();
      sLab.textContent = fmt(s, 2);
      presets.forEach((b, i) => b.classList.toggle("on", Math.abs(s - [0, 1, 3, 7.5][i]) < 1e-9));
      const run = w3CfgRun(c, s, start), S = w3Pairs(run.X[run.X.length - 1]), R = w3CfgStats(c, S);
      root.__w3 = { c, s, seed, start, S, R };
      if (!curve) curve = sGrid.map(v => { const r = w3CfgRun(c, v, start); return w3CfgStats(c, w3Pairs(r.X[r.X.length - 1])); });
      const ref = w3ClassSpread(c), cn = c ? "B" : "A", cv = c ? "--setB" : "--setA";
      cvA.draw = () => {
        const V = eqView(cvA, 0, 0, 1.6, 1.6, { xname: "", yname: "" }), T = Calc.plot(cvA, V, []), { ctx } = cvA;
        /* „biztos” területek: p(c | x) > 0,9 */
        const cell = 5;
        for (let px = 0; px < cvA.w; px += cell) for (let py = 0; py < cvA.h; py += cell) {
          const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2), pA = w3Post(x, y, 0);
          if (pA > 0.9) { ctx.fillStyle = rgba(css("--setA"), 0.13); ctx.fillRect(px, py, cell, cell); }
          else if (pA < 0.1) { ctx.fillStyle = rgba(css("--setB"), 0.13); ctx.fillRect(px, py, cell, cell); }
        }
        cloud.forEach(([x, y, cc]) => { ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 2.2, 0, 2 * Math.PI); ctx.fillStyle = rgba(css(cc ? "--setB" : "--setA"), 0.5); ctx.fill(); });
        S.forEach(([x, y]) => { if (x < V.xmin || x > V.xmax || y < V.ymin || y > V.ymax) return; dot(ctx, T.tx(x), T.ty(y), 3, css("--text")); });
        dot(ctx, T.tx(R.mean[0]), T.ty(R.mean[1]), 6, css(cv)); ring(ctx, T.tx(R.mean[0]), T.ty(R.mean[1]), 6, css("--text"), 2);
        label(ctx, "A", T.tx(-1.35), T.ty(1.3), css("--setA"), "center", "700 15px system-ui, sans-serif", "middle");
        label(ctx, "B", T.tx(1.35), T.ty(1.3), css("--setB"), "center", "700 15px system-ui, sans-serif", "middle");
      };
      cvA.draw();
      cvB.draw = () => {
        const V = { xmin: -0.5, xmax: 8.6, ymin: -0.08, ymax: 1.12, xstep: 1, ystep: 0.25, xname: "s", yname: "" };
        const sc = 1 / (2 * ref);                                // szórás → 0…1 skála (a = 2·adat-szórás)
        const T = Calc.plot(cvB, V, [
          { hline: 1, color: "--border" }
        ]), { ctx } = cvB;
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].sure]), css(cv), 2.4);
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].spread * sc]), css("--setC"), 2.4);
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].out]), css("--bad"), 2, [6, 4]);
        polyline(ctx, T, sGrid.map((v, i) => [v, curve[i].mid]), css("--accent"), 2, [2, 3]);
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(T.tx(s), T.ty(-0.05)); ctx.lineTo(T.tx(s), T.ty(1.1)); ctx.stroke(); ctx.restore();
        dot(ctx, T.tx(s), T.ty(R.sure), 4.5, css(cv)); dot(ctx, T.tx(s), T.ty(R.spread * sc), 4.5, css("--setC")); dot(ctx, T.tx(s), T.ty(R.out), 4, css("--bad")); dot(ctx, T.tx(s), T.ty(R.mid), 4, css("--accent"));
        polyline(ctx, T, [[-0.5, ref * sc], [8.6, ref * sc]], css("--setC"), 1, [2, 4]);
        label(ctx, "az adat szórása", T.tx(8.5), T.ty(ref * sc) - 3, css("--setC"), "right", "600 11px system-ui, sans-serif");
      };
      cvB.draw();
      legend.replaceChildren(w3Sw("--setA", "A tanítópontjai"), w3Sw("--setB", "B tanítópontjai"), w3Sw("--text", `minta („${cn}” feltétellel)`), w3Sw(cv, "a minták átlaga"),
        h("br"), w3Sw("--setA", "„biztos A” terület", false), w3Sw("--setB", "„biztos B” terület", false),
        h("span", { style: "white-space:nowrap" }, `· jobb oldalt: `), w3Sw(cv, "biztos arány"), w3Sw("--accent", "középső felhőből"), w3Sw("--setC", "szórás (½ = az adaté)"), w3Sw("--bad", "kilóg"));
      st[0].el.lastChild.textContent = `a minták a „biztos ${cn}” területen (p(${cn} | x) > 0,9)`;
      st[0].v.textContent = pct(R.sure, 1);
      st[1].v.textContent = pct(R.mid, 1);
      st[2].v.textContent = `${w3F(R.spread, 2)} (adat: ${w3F(ref, 2)})`;
      st[3].v.textContent = pct(R.out, 1);
      note.innerHTML = (s === 0 ? "$s = 0$: a feltételt figyelmen kívül hagyjuk – feltétel nélküli minták, mindkét osztályból."
        : Math.abs(s - 1) < 1e-9 ? `$s = 1$: pontosan a feltételes eloszlás, $p(x \\mid ${cn})$ – a minták nagyjából az adatot követik: a középső, átfedő felhőbe is jut belőlük, és a szórásuk közel van az adatéhoz.`
          : s < 1 ? "$0 < s < 1$: a feltétel csak gyengén hat, a másik osztályból is kerülnek minták."
            : s <= 4 ? `$s > 1$: a minták a másik osztálytól <b>távolodnak</b> – egyre több esik a „biztos ${cn}” területre, de eltűnik a középső, átfedő felhő, és csökken a sokféleség.`
              : "Nagy $s$: a becslés „túllő” – a minták kevés helyre tömörülnek, és egy részük már kilóg az adatból (minden felhőtől 3 szórásnál messzebb).") +
        " „Kilóg”: minden saját felhő középpontjától 3 szórásnál messzebb.";
      math(note);
    }
    update();
  };
