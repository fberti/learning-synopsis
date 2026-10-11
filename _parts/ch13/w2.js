
  /* ==================================================================
     13.4-c  gcn-karate – félig felügyelt csúcsosztályozás a karateklubon
     ================================================================== */
  /* W2-CORE-BEGIN  (tiszta JS, node-ban is futtatható: _parts/calc/w132_*.js) */
  function w2Rng(seed) {                                  // mulberry32
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* P = D^-1/2 (A + I) D^-1/2  (useGraph = false → P = I, azaz MLP) */
  function w2Prop(n, edges, useGraph) {
    const P = new Float64Array(n * n);
    if (!useGraph) { for (let i = 0; i < n; i++) P[i * n + i] = 1; return P; }
    const deg = new Float64Array(n).fill(1);
    edges.forEach(([u, v]) => { P[u * n + v] = P[v * n + u] = 1; deg[u]++; deg[v]++; });
    for (let i = 0; i < n; i++) P[i * n + i] = 1;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (P[i * n + j]) P[i * n + j] /= Math.sqrt(deg[i] * deg[j]);
    return P;
  }
  function w2GcnInit(n, hid, k, seed) {
    const rnd = w2Rng(seed);
    const glorot = (fi, fo) => { const L = Math.sqrt(6 / (fi + fo)), a = new Float64Array(fi * fo); for (let i = 0; i < a.length; i++) a[i] = (2 * rnd() - 1) * L; return a; };
    const prm = { W1: glorot(n, hid), b1: new Float64Array(hid), W2: glorot(hid, k), b2: new Float64Array(k) };
    const net = { n, hid, k, prm, m: {}, v: {}, t: 0 };
    for (const key in prm) { net.m[key] = new Float64Array(prm[key].length); net.v[key] = new Float64Array(prm[key].length); }
    return net;
  }
  /* előre: S1 = P·W1 + b1 (X = I), H1 = ReLU(S1), T = H1·W2, Z = P·T + b2 */
  function w2GcnFwd(net, P) {
    const { n, hid, k, prm: { W1, b1, W2, b2 } } = net;
    const S1 = new Float64Array(n * hid), H1 = new Float64Array(n * hid), T = new Float64Array(n * k), Z = new Float64Array(n * k);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < hid; j++) S1[i * hid + j] = b1[j];
      for (let q = 0; q < n; q++) { const p = P[i * n + q]; if (!p) continue; for (let j = 0; j < hid; j++) S1[i * hid + j] += p * W1[q * hid + j]; }
      for (let j = 0; j < hid; j++) H1[i * hid + j] = Math.max(0, S1[i * hid + j]);
      for (let c = 0; c < k; c++) { let s = 0; for (let j = 0; j < hid; j++) s += H1[i * hid + j] * W2[j * k + c]; T[i * k + c] = s; }
    }
    for (let i = 0; i < n; i++) for (let c = 0; c < k; c++) {
      let s = b2[c];
      for (let q = 0; q < n; q++) { const p = P[i * n + q]; if (p) s += p * T[q * k + c]; }
      Z[i * k + c] = s;
    }
    return { S1, H1, T, Z };
  }
  /* egy Adam-lépés a címkézett csúcsok kereszt-entrópiáján; visszaadja a lépés előtti veszteséget */
  function w2GcnStep(net, P, y, lab, lr = 0.01, wd = 5e-4) {
    const { n, hid, k, prm } = net, { W2 } = prm;
    const { S1, H1, Z } = w2GcnFwd(net, P);
    const dZ = new Float64Array(n * k);
    let loss = 0;
    lab.forEach(i => {
      const z = Array.from(Z.subarray(i * k, i * k + k)), m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0);
      loss += -Math.log(e[y[i]] / s) / lab.length;
      for (let c = 0; c < k; c++) dZ[i * k + c] = (e[c] / s - (c === y[i] ? 1 : 0)) / lab.length;
    });
    const g = { W1: new Float64Array(n * hid), b1: new Float64Array(hid), W2: new Float64Array(hid * k), b2: new Float64Array(k) };
    const dT = new Float64Array(n * k);                   // dT = Pᵀ·dZ
    for (let i = 0; i < n; i++) for (let c = 0; c < k; c++) {
      const d = dZ[i * k + c]; if (!d) continue;
      g.b2[c] += d;
      for (let q = 0; q < n; q++) { const p = P[i * n + q]; if (p) dT[q * k + c] += p * d; }
    }
    const dS1 = new Float64Array(n * hid);
    for (let i = 0; i < n; i++) for (let j = 0; j < hid; j++) {
      let dh = 0;
      for (let c = 0; c < k; c++) { dh += dT[i * k + c] * W2[j * k + c]; g.W2[j * k + c] += H1[i * hid + j] * dT[i * k + c]; }
      dS1[i * hid + j] = S1[i * hid + j] > 0 ? dh : 0;
      g.b1[j] += dS1[i * hid + j];
    }
    for (let i = 0; i < n; i++) for (let q = 0; q < n; q++) {   // dW1 = Pᵀ·dS1
      const p = P[i * n + q]; if (!p) continue;
      for (let j = 0; j < hid; j++) g.W1[q * hid + j] += p * dS1[i * hid + j];
    }
    net.t++;
    const b1c = 1 - Math.pow(0.9, net.t), b2c = 1 - Math.pow(0.999, net.t);
    for (const key in prm) {
      const p = prm[key], gr = g[key], m = net.m[key], v = net.v[key];
      for (let i = 0; i < p.length; i++) {
        const gi = gr[i] + wd * p[i];                     // mint a torch Adam weight_decay-je
        m[i] = 0.9 * m[i] + 0.1 * gi; v[i] = 0.999 * v[i] + 0.001 * gi * gi;
        p[i] -= lr * (m[i] / b1c) / (Math.sqrt(v[i] / b2c) + 1e-8);
      }
    }
    return loss;
  }
  /* W2-CORE-END */

  function w2Star(ctx, x, y, r, fill, stroke) {
    ctx.save(); ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      i ? ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)) : ctx.moveTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
  }

  W["gcn-karate"] = root => {
    const K = window.KARATE13;
    if (!K) { root.append(small("Hiányzik a graph-data.js (KARATE13).")); return; }
    header(root, "GCN a karateklubon – két címkéből 34",
      "Csak két tag csoportját ismerjük: az edzőét (1) és az elnökét (34). Egy kétrétegű GCN ebből a gráf szerkezetén keresztül tippeli meg a többi 32 tagot. " +
      "A <b>külső gyűrű</b> a valódi csoport (kék: az edző csoportja, narancs: az elnöké), a <b>kitöltés</b> a modell tippje (minél erősebb, annál biztosabb). " +
      "★ = címkézett csúcs; kattints bármelyik csúcsra, hogy címkét adj neki vagy elvedd. Váltsd át MLP-re (a gráf nélkül), és hasonlítsd össze!");
    const n = K.n, y = K.club, EPOCHS = 200, PER_FRAME = 2;
    let labeled = new Set([0, 33]), mode = "gcn", seed = 1, net, P, out, loss = NaN, raf = 0, target = 0, view = null;

    const bTrain = btn("▶ Tanítás", () => start(), "btn primary"), bStop = btn("❚❚ Állj", () => stop());
    const bStep = btn("Egy lépés", () => { stop(); step(1); draw(); });
    const bReset = btn("↻ Újrakezdés", () => { stop(); seed++; reinit(); draw(); });
    const seedTxt = small("");
    const mg = toggleGroup([["gcn", "GCN"], ["mlp", "MLP (a gráf nélkül)"]], () => mode, k => { if (k === mode) return; mode = k; const run = !!raf; stop(); reinit(); draw(); if (run) start(); });
    root.append(h("div", { class: "controls" }, bTrain, bStop, bStep, bReset, seedTxt), h("div", { class: "controls" }, small("modell:"), mg.bs));
    const [cvG, cvZ] = twoCanvas(root, 0.92, 0.92);
    const legend = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" });
    const stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(legend, stats, ro);
    legend.innerHTML = "Bal: a gráf (kattints egy csúcsra: címke be/ki). Jobb: a két kimeneti szám (logit) csúcsonként, z₀ = „edző csoportja”, z₁ = „elnök csoportja”; " +
      "a szaggatott átló a döntési határ (z₀ = z₁).";

    function reinit() {
      net = w2GcnInit(n, 16, 2, seed); P = w2Prop(n, K.edges, mode === "gcn"); loss = NaN; view = null; out = w2GcnFwd(net, P);
    }
    function step(k) {
      const lab = [...labeled];
      if (!lab.length) return;                              // nincs címke → nincs mit tanulni
      for (let i = 0; i < k; i++) loss = w2GcnStep(net, P, y, lab);
      out = w2GcnFwd(net, P);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; paintBtns(); }
    function start() {
      if (raf) return;
      target = net.t + EPOCHS;
      const tick = () => {
        step(Math.min(PER_FRAME, target - net.t)); draw();
        raf = net.t < target && labeled.size ? requestAnimationFrame(tick) : 0;
        if (!raf) paintBtns();
      };
      raf = requestAnimationFrame(tick); paintBtns();
    }
    function paintBtns() { setDis(bTrain, !!raf); setDis(bStop, !raf); }
    const prob = i => { const a = out.Z[2 * i], b = out.Z[2 * i + 1], m = Math.max(a, b); return Math.exp(b - m) / (Math.exp(a - m) + Math.exp(b - m)); };

    /* gráf */
    let geo = null;
    function nodeStyle(i) {
      const p = prob(i), t = Math.min(1, Math.abs(p - 0.5) * 2.2), col = p >= 0.5 ? "--setB" : "--setA";
      return { fill: mix(col, 0.12 + 0.88 * t), t: 0.12 + 0.88 * t, ringCol: css(y[i] ? "--setB" : "--setA"), wrong: !labeled.has(i) && (p >= 0.5 ? 1 : 0) !== y[i] };
    }
    function drawNode(ctx, x, yy, r, i, fontPx) {
      const s = nodeStyle(i);
      ring(ctx, x, yy, r + 2.2, s.ringCol, 3.2);
      dot(ctx, x, yy, r, s.fill);
      if (labeled.has(i)) ring(ctx, x, yy, r, css("--text"), 2.2);
      else ring(ctx, x, yy, r, rgba(css("--text"), 0.25), 0.8);
      label(ctx, String(i + 1), x, yy + 0.5, ink(s.t), "center", `600 ${fontPx}px system-ui, sans-serif`, "middle");
      if (labeled.has(i)) w2Star(ctx, x + r * 0.95, yy - r * 0.95, Math.max(5, r * 0.62), css("--text"), css("--card"));
      if (s.wrong) { ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.6; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.arc(x, yy, r + 6, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
    }
    function drawGraph() {
      const { ctx, w, h: H } = cvG, r = clamp(w * 0.028, 7.5, 11), pad = r + 9;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const X = i => pad + K.xy[i][0] * (w - 2 * pad), Y = i => pad + K.xy[i][1] * (H - 2 * pad);
      geo = { X, Y, r };
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.globalAlpha = 0.45; ctx.lineWidth = 1;
      ctx.beginPath(); K.edges.forEach(([u, v]) => { ctx.moveTo(X(u), Y(u)); ctx.lineTo(X(v), Y(v)); }); ctx.stroke(); ctx.restore();
      const fp = r >= 9.5 ? 10.5 : 9;
      for (let i = 0; i < n; i++) drawNode(ctx, X(i), Y(i), r, i, fp);
    }
    /* kimeneti tér (z₀, z₁) */
    function drawZ() {
      const Z = out.Z;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let i = 0; i < n; i++) { x0 = Math.min(x0, Z[2 * i]); x1 = Math.max(x1, Z[2 * i]); y0 = Math.min(y0, Z[2 * i + 1]); y1 = Math.max(y1, Z[2 * i + 1]); }
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, need = Math.max(x1 - x0, y1 - y0) / 2 + 0.08;
      const inside = view && x0 >= view.cx - view.hw && x1 <= view.cx + view.hw && y0 >= view.cy - view.hw && y1 <= view.cy + view.hw;
      if (!inside || need < view.hw * 0.45) view = { cx, cy, hw: need * 1.35 + 0.05 };
      const V = eqView(cvZ, view.cx, view.cy, view.hw, view.hw, { xname: "z₀", yname: "z₁" });
      const T = Calc.plot(cvZ, V, []);
      const ctx = cvZ.ctx, lo = Math.max(V.xmin, V.ymin), hi = Math.min(V.xmax, V.ymax);
      if (hi > lo) {
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.globalAlpha = 0.55; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(T.tx(lo), T.ty(lo)); ctx.lineTo(T.tx(hi), T.ty(hi)); ctx.stroke(); ctx.restore();
      }
      if (hi > lo) {                                        // a régiók neve az átló két üres vége mellett
        const m = (hi - lo) * 0.1, f = "600 11px system-ui, sans-serif";
        label(ctx, "↖ elnök csoportja", T.tx(hi - m) - 8, T.ty(hi - m), css("--setB"), "right", f, "bottom");
        label(ctx, "edző csoportja ↘", T.tx(lo + m) + 8, T.ty(lo + m), css("--setA"), "left", f, "top");
      }
      const r = 6.5, order = [...Array(n).keys()].sort((a, b) => labeled.has(a) - labeled.has(b));
      order.forEach(i => {
        const px = T.tx(Z[2 * i]), py = T.ty(Z[2 * i + 1]), s = nodeStyle(i);
        ring(ctx, px, py, r + 1.8, s.ringCol, 2.6);
        dot(ctx, px, py, r, s.fill);
        if (labeled.has(i)) { ring(ctx, px, py, r, css("--text"), 2); w2Star(ctx, px + 6, py - 6, 4.5, css("--text"), css("--card")); }
      });
      /* feliratok: ha sok pont esik egy helyre (pl. MLP-nél), egyetlen „N csúcs” felirat */
      const groups = [];
      order.forEach(i => {
        const px = T.tx(Z[2 * i]), py = T.ty(Z[2 * i + 1]), g = groups.find(q => Math.hypot(q.x - px, q.y - py) < 5);
        g ? g.ids.push(i) : groups.push({ x: px, y: py, ids: [i] });
      });
      groups.forEach(g => {
        const big = g.ids.length >= 4, anyWrong = g.ids.some(i => nodeStyle(i).wrong);
        if (big) { label(ctx, g.ids.length + " csúcs", g.x + r + 4, g.y - 3, anyWrong ? css("--bad") : css("--muted"), "left", "700 11px system-ui, sans-serif", "bottom"); return; }
        g.ids.forEach((i, k) => {
          const w = nodeStyle(i).wrong;
          label(ctx, String(i + 1), g.x + r + 3 + k * 14, g.y - 2, w ? css("--bad") : css("--muted"), "left", (w ? "700 " : "") + "10px system-ui, sans-serif", "bottom");
        });
      });
    }
    function draw() {
      drawGraph(); drawZ(); mg.paint(); paintBtns();
      seedTxt.textContent = "mag (seed): " + seed;
      const rest = [...Array(n).keys()].filter(i => !labeled.has(i));
      const wrong = rest.filter(i => (prob(i) >= 0.5 ? 1 : 0) !== y[i]);
      const ok = rest.length - wrong.length;
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        stat(String(net.t), "epoch"),
        stat(Number.isFinite(loss) ? fmt(loss, 3) : "–", "tanítási veszteség (CE)"),
        stat(rest.length ? `${ok}/${rest.length}` : "–", "helyes a címkézetlenek közül" + (rest.length ? ` (${pct(ok / rest.length)})` : "")),
        stat(String(labeled.size), "címkézett csúcs"));
      let txt = net.t === 0 ? "Még nem tanult: minden tipp bizonytalan (halvány). Nyomd meg a „Tanítás” gombot (" + EPOCHS + " epoch). " : "";
      if (!labeled.size) txt += "Nincs címkézett csúcs – nincs mit tanulni. Kattints legalább egy csúcsra! ";
      txt += wrong.length ? "Rosszul osztályozott: " + wrong.map(i => i + 1).join(", ") + ". " : (net.t ? "Minden címkézetlen csúcs helyes. " : "");
      if (net.t >= 100 && mode === "gcn" && wrong.length === 1 && wrong[0] === 8)
        txt += "A 9-es tag az edzővel tartott, pedig 5 kapcsolatából 3 az elnök oldalára fut – ezt a gráf alapján nem lehet kitalálni.";
      if (net.t >= 100 && mode === "gcn" && wrong.includes(2))
        txt += "A 3-as tag határeset: mindkét oldalhoz sok szál köti, ezért néhány kezdőértéknél (mag) 200 epoch után még rossz oldalon áll – tanítsd tovább! ";
      if (net.t >= 100 && mode === "mlp")
        txt += "Az MLP csak a saját one-hot jellemzőt látja: a címkézetlen csúcsokról semmit sem tud, ezért a tippje véletlen (jellemzően mind egy csoportba kerül).";
      ro.textContent = txt;
    }
    cvG.draw = drawGraph; cvZ.draw = drawZ;
    cvG.c.style.cursor = "pointer";
    cvG.c.addEventListener("pointerdown", e => {
      if (!geo) return;
      const [mx, my] = evXY(cvG, e);
      let best = -1, bd = Infinity;
      for (let i = 0; i < n; i++) { const d = Math.hypot(geo.X(i) - mx, geo.Y(i) - my); if (d < bd) { bd = d; best = i; } }
      if (best < 0 || bd > geo.r + 7) return;
      labeled.has(best) ? labeled.delete(best) : labeled.add(best);
      const run = !!raf; stop(); reinit(); draw(); if (run) start();
    });
    reinit(); draw();
  };

  /* ==================================================================
     13.5-b  gat-attention – figyelem a szomszédokra
     ================================================================== */
  const W2_NODES = ["A", "B", "C", "D", "E"], W2_NAMES = ["Anna", "Bence", "Csilla", "Dávid", "Emese"];
  const W2_EDGES = [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]];
  const W2_XY = [[0.1, 0.2], [0.4, 0.5], [0.1, 0.8], [0.66, 0.5], [0.9, 0.5]];
  const w2Leaky = v => (v >= 0 ? v : 0.2 * v);
  function w2Num(v, min, max, step, oninput) {
    const e = h("input", { type: "number", min, max, step, value: v, style: "width:4.6em" });
    e.addEventListener("input", () => { const x = parseFloat(String(e.value).replace(",", ".")); if (Number.isFinite(x)) oninput(clamp(x, min, max)); });
    return e;
  }
  function w2Slide(lab, min, max, step, val, oninput) {
    const s = slider(min, max, step, val), out = h("b", { style: "font-family:var(--mono);min-width:3.2em;display:inline-block" }, fmt(val, 1));
    s.addEventListener("input", () => { out.textContent = fmt(+s.value, 1); oninput(+s.value); });
    return { el: h("label", null, lab, s, out), set: v => { s.value = v; out.textContent = fmt(+s.value, 1); } };
  }

  W["gat-attention"] = root => {
    header(root, "Figyelem a szomszédokra (GAT)",
      "Bence (B) frissíti a jellemzőjét a szomszédaiból és saját magából (önhurok): u ∈ {A, B, C, D}. " +
      "A GAT minden szomszédnak pontszámot ad, $e_{Bu} = \\mathrm{LeakyReLU}(a_1 h_B + a_2 h_u)$ (negatívra 0,2-es meredekség, W = 1), " +
      "a súly ezek softmaxa: $\\alpha_{Bu} = \\mathrm{softmax}_u(e_{Bu})$, az új érték $h'_B = \\sum_u \\alpha_{Bu} h_u$. " +
      "Hasonlítsd össze a GCN rögzített súlyaival és a sima átlaggal! Az élek vastagsága ∝ α.");
    const hv = [1, 0, 0, 0, 5], N = [0, 1, 2, 3];
    let a1 = 0.5, a2 = 1, manual = false, eMan = [1, 0, 0, 0];
    /* GCN-súlyok: P sora B-re (önhurok, szimmetrikus normalizálás) */
    const dh = [3, 4, 3, 3, 2], gcnW = N.map(u => 1 / Math.sqrt(dh[1] * dh[u]));

    const holder = h("div");
    root.append(holder);
    const cv = Calc.canvas(holder, flatAspect(root, 0.46, 0.72), 760);
    const sA1 = w2Slide("a₁", -3, 3, 0.1, a1, v => { a1 = v; draw(); }), sA2 = w2Slide("a₂", -3, 3, 0.1, a2, v => { a2 = v; draw(); });
    const rowA = h("div", { class: "controls" }, sA1.el, sA2.el);
    const sE = N.map(u => w2Slide("e" + W2_NODES[u], -3, 3, 0.1, eMan[u], v => { eMan[u] = v; draw(); }));
    const rowE = h("div", { class: "controls", style: "display:none" }, sE.map(s => s.el));
    const cMan = checkbox(false, () => {
      manual = cMan.checked;
      if (manual) { const e = scores(); N.forEach(u => { eMan[u] = Math.round(clamp(e[u], -3, 3) * 10) / 10; sE[u].set(eMan[u]); }); }
      rowA.style.display = manual ? "none" : ""; rowE.style.display = manual ? "" : "none"; draw();
    });
    const feats = N.map(u => h("label", null, "h" + W2_NODES[u], w2Num(hv[u], -2, 6, 0.5, v => { hv[u] = v; draw(); })));
    root.append(h("div", { class: "controls" }, small("jellemzők:"), feats, h("label", null, cMan, "Kézi pontszámok")), rowA, rowE);
    const tw = h("div", { class: "tw", style: "overflow-x:auto" }), stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(tw, stats, ro);

    function scores() { return manual ? eMan.slice() : N.map(u => w2Leaky(a1 * hv[1] + a2 * hv[u])); }
    let cur = null;
    function compute() {
      const e = scores(), al = softmax(e);
      const gat = N.reduce((s, u) => s + al[u] * hv[u], 0), gcn = N.reduce((s, u) => s + gcnW[u] * hv[u], 0), mean = N.reduce((s, u) => s + hv[u], 0) / 4;
      return { e, al, gat, gcn, mean };
    }
    function drawCv() {
      if (!cur) return;
      const { ctx, w, h: H } = cv, R = clamp(w * 0.04, 15, 22), pad = R + 10;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const X = i => pad + W2_XY[i][0] * (w - 2 * pad) / 1, Y = i => pad + 14 + (W2_XY[i][1] - 0.2) / 0.6 * (H - 2 * pad - 28);
      const acc = css("--accent"), fs = w < 500 ? 11 : 12;
      W2_EDGES.forEach(([u, v]) => {
        const nb = u === 1 ? v : v === 1 ? u : -1;
        ctx.save(); ctx.lineCap = "round";
        if (nb >= 0) { ctx.strokeStyle = acc; ctx.lineWidth = 1 + 14 * cur.al[nb]; }
        else { ctx.strokeStyle = css("--border"); ctx.lineWidth = 2; }
        ctx.beginPath(); ctx.moveTo(X(u), Y(u)); ctx.lineTo(X(v), Y(v)); ctx.stroke(); ctx.restore();
        if (nb >= 0) {
          const mx = (X(u) + X(v)) / 2, my = (Y(u) + Y(v)) / 2, txt = "α = " + fmt(cur.al[nb], 3);
          ctx.save(); ctx.font = `700 ${fs}px system-ui, sans-serif`; const tw2 = ctx.measureText(txt).width; ctx.restore();
          const oy = nb === 3 ? 16 : 0, ox = nb === 3 ? 0 : 22;    // B–D alatta, hogy ne ütközzön az önhurok feliratával
          ctx.save(); ctx.fillStyle = rgba(css("--card"), 0.88); ctx.fillRect(mx + ox - tw2 / 2 - 3, my + oy - 9, tw2 + 6, 18); ctx.restore();
          label(ctx, txt, mx + ox, my + oy, acc, "center", `700 ${fs}px system-ui, sans-serif`, "middle");
        }
      });
      /* önhurok B-n */
      const bx = X(1), by = Y(1), lr = R * 0.85;
      ctx.save(); ctx.strokeStyle = acc; ctx.lineWidth = 1 + 14 * cur.al[1];
      ctx.beginPath(); ctx.arc(bx, by - R - lr * 0.7, lr, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
      label(ctx, "α = " + fmt(cur.al[1], 3), bx + lr + 10, by - R - lr * 0.7, acc, "left", `700 ${fs}px system-ui, sans-serif`, "middle");
      for (let i = 0; i < 5; i++) {
        const focus = i === 1, inN = i < 4;
        dot(ctx, X(i), Y(i), R, focus ? acc : inN ? mix("--accent", 0.18) : css("--bg-soft"));
        ring(ctx, X(i), Y(i), R, inN ? acc : css("--border"), focus ? 0 : 2);
        label(ctx, W2_NODES[i], X(i), Y(i) + 1, focus ? css("--card") : inN ? css("--text") : css("--muted"), "center", `700 ${Math.round(R * 0.8)}px system-ui, sans-serif`, "middle");
        label(ctx, "h = " + fmt(hv[i], 2), X(i), Y(i) + R + 5, inN ? css("--text") : css("--muted"), "center", `600 ${fs}px system-ui, sans-serif`, "top");
      }
    }
    function draw() {
      cur = compute();
      const { e, al } = cur;
      const th = t => h("th", { style: "white-space:nowrap" }, t), td = (t, st = "") => h("td", { style: "font-family:var(--mono);white-space:nowrap;" + st }, t);
      const sumA = al.reduce((s, v) => s + v, 0), sumG = gcnW.reduce((s, v) => s + v, 0);
      const best = argmax(al), tops = N.filter(u => al[u] > al[best] - 1e-9).map(u => W2_NODES[u]);
      tw.replaceChildren(h("table", { style: "width:auto;min-width:100%" },
        h("tr", null, th("szomszéd u"), th("h_u"), th("pontszám e_Bu"), th("α_Bu (GAT)"), th("GCN-súly"), th("átlag-súly")),
        ...N.map(u => h("tr", null, h("td", { style: "white-space:nowrap" }, W2_NODES[u] + " (" + W2_NAMES[u] + (u === 1 ? ", önhurok" : "") + ")"),
          td(fmt(hv[u], 2)), td(fmt(e[u], 2)), td(fmt(al[u], 3), u === best ? "font-weight:700;color:var(--accent)" : ""), td(fmt(gcnW[u], 3)), td(fmt(0.25, 2)))),
        h("tr", { style: "background:var(--bg-soft)" }, h("td", null, "összeg"), td(""), td(""), td(fmt(sumA, 3), "font-weight:700"), td(fmt(sumG, 3), "color:var(--bad);font-weight:700"), td("1"))));
      const stat = (v, l, hl) => h("div", { class: "stat", style: hl ? "outline:2px solid var(--accent)" : "" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(stat(fmt(cur.gat, 3), "h′_B – GAT (tanult súlyok)", true), stat(fmt(cur.gcn, 3), "h′_B – GCN (rögzített súlyok)"), stat(fmt(cur.mean, 3), "h′_B – sima átlag"));
      let txt = `A legnagyobb figyelmet ${tops.join(" és ")} kap${tops.length > 1 ? "ják" : "ja"} (α = ${fmt(al[best], 3)}). A softmax miatt a GAT-súlyok összege mindig 1; a GCN-súlyoké itt ${fmt(sumG, 3)}. `;
      if (!manual) {
        const allPos = N.every(u => a1 * hv[1] + a2 * hv[u] >= 0);
        txt += allPos ? "Mivel egyik pontszám sem negatív, az a₁·h_B tag minden szomszédnál ugyanannyi, és a softmaxban kiesik: a sorrendet csak a₂·h_u dönti el."
          : "Most van negatív pontszám is: ott a LeakyReLU 0,2-del szoroz, ezért az a₁·h_B tag már nem esik ki teljesen.";
      } else txt += "Írd át a pontszámokat: bármit adsz meg, a súlyok összege 1 marad, és a nagyobb pontszámhoz mindig nagyobb súly tartozik.";
      ro.textContent = txt;
      drawCv();
    }
    cv.draw = drawCv;
    draw();
  };

  /* ==================================================================
     13.6-b  link-predict – kapcsolat-előrejelzés (ajánlás)
     ================================================================== */
  const w2Sig = z => 1 / (1 + Math.exp(-z));
  const w2Vec = p => `(${fmt(p[0], 2)}; ${fmt(p[1], 2)})`;

  W["link-predict"] = root => {
    header(root, "Ki mit vesz? – kapcsolat-előrejelzés",
      "Három vásárló (U1–U3) és két termék (T1, T2) kétdimenziós beágyazása. Egy pár pontszáma a két vektor skaláris szorzata, " +
      "a valószínűség ennek szigmoidja: $p(u, t) = \\sigma(\\mathbf z_u \\cdot \\mathbf z_t)$. Húzd a pontokat, és figyeld, hogyan változnak a valószínűségek és az ajánlások!");
    const DEF = { U: [[1, 0], [0, 1], [1, 1]], T: [[1, -0.5], [0.5, 1]] };
    let U = DEF.U.map(p => p.slice()), T = DEF.T.map(p => p.slice()), neg = false, drag = null;
    const known = [[0, 0], [1, 1], [2, 1]];                     // U1–T1, U2–T2, U3–T2
    const isKnown = (u, t) => known.some(([a, b]) => a === u && b === t);
    const cNeg = checkbox(false, () => { neg = cNeg.checked; draw(); });
    root.append(h("div", { class: "controls" }, h("label", null, cNeg, "negatív minták (a nem vásárolt párok 0 címkével)"),
      btn("↺ Alaphelyzet", () => { U = DEF.U.map(p => p.slice()); T = DEF.T.map(p => p.slice()); draw(); })));
    const [cvE, cvB] = twoCanvas(root, 0.9, 0.9);
    const tw = h("div", { class: "tw", style: "overflow-x:auto" }), stats = h("div", { class: "stat-row" }), ro = h("div", { class: "readout" });
    root.append(tw, stats, ro);
    let TT = null;
    const pts = () => [...U.map((p, i) => ({ p, kind: "U", i })), ...T.map((p, i) => ({ p, kind: "T", i }))];
    const colU = () => css("--setA"), colT = () => css("--setB");

    function drawE() {
      const V = eqView(cvE, 0.25, 0.25, 1.95, 1.95, { xname: "1. koord.", yname: "2. koord.", xstep: 0.5, ystep: 0.5 });
      TT = Calc.plot(cvE, V, []);
      const ctx = cvE.ctx;
      pts().forEach(({ p, kind, i }) => {
        const col = kind === "U" ? colU() : colT();
        ctx.save(); ctx.globalAlpha = 0.55; arrow(ctx, TT.tx(0), TT.ty(0), TT.tx(p[0]), TT.ty(p[1]), col, 1.6); ctx.restore();
      });
      pts().forEach(({ p, kind, i }) => {
        const col = kind === "U" ? colU() : colT(), x = TT.tx(p[0]), y = TT.ty(p[1]), act = drag && drag.kind === kind && drag.i === i;
        if (kind === "U") dot(ctx, x, y, act ? 9 : 7.5, col);
        else { ctx.save(); ctx.fillStyle = col; const s = act ? 9 : 7.5; ctx.fillRect(x - s, y - s, 2 * s, 2 * s); ctx.restore(); }
        ring(ctx, x, y, act ? 11 : 0.01, css("--text"), act ? 1.5 : 0);
        const right = x < cvE.w - 40;
        label(ctx, kind + (i + 1), right ? x + 11 : x - 11, y - 7, col, right ? "left" : "right", "700 13px system-ui, sans-serif", "bottom");
      });
    }
    function drawB(pr) {
      const { ctx, w, h: H } = cvB;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const xl = w * 0.17, xr = w * 0.83, yu = i => H * (0.2 + 0.3 * i), yt = i => H * (0.32 + 0.36 * i);
      label(ctx, "vásárlók", xl, 8, css("--muted"), "center", "600 11px system-ui, sans-serif", "top");
      label(ctx, "termékek", xr, 8, css("--muted"), "center", "600 11px system-ui, sans-serif", "top");
      const fs = w < 330 ? 10.5 : 12;
      for (let u = 0; u < 3; u++) for (let t = 0; t < 2; t++) {
        const p = pr[u][t], kn = isKnown(u, t);
        ctx.save(); ctx.lineWidth = kn ? 3 : 1 + 3 * p;
        ctx.strokeStyle = kn ? css("--setC") : neg ? css("--bad") : css("--muted");
        ctx.globalAlpha = kn ? 1 : 0.35 + 0.6 * p;
        ctx.setLineDash(kn ? [] : [6, 5]);
        ctx.beginPath(); ctx.moveTo(xl, yu(u)); ctx.lineTo(xr, yt(t)); ctx.stroke(); ctx.restore();
      }
      /* címkék a vonalak mentén, a vásárló felőli harmadban (ott nem fedik egymást) */
      for (let u = 0; u < 3; u++) for (let t = 0; t < 2; t++) {
        const p = pr[u][t], kn = isKnown(u, t), f = kn ? 0.3 : u === 1 ? 0.6 : 0.25, lx = xl + (xr - xl) * f, ly = yu(u) + (yt(t) - yu(u)) * f;
        const txt = (kn ? "✓ " : neg ? "✗ " : "") + fmt(p, 3);
        ctx.save(); ctx.font = `700 ${fs}px system-ui, sans-serif`; const tw2 = ctx.measureText(txt).width;
        ctx.fillStyle = css("--card"); ctx.globalAlpha = 0.9; ctx.fillRect(lx - tw2 / 2 - 3, ly - 8, tw2 + 6, 16); ctx.restore();
        label(ctx, txt, lx, ly, kn ? css("--setC") : neg ? css("--bad") : css("--text"), "center", `700 ${fs}px system-ui, sans-serif`, "middle");
      }
      for (let u = 0; u < 3; u++) { dot(ctx, xl, yu(u), 15, colU()); label(ctx, "U" + (u + 1), xl, yu(u) + 1, "#fff", "center", "700 12px system-ui, sans-serif", "middle"); }
      for (let t = 0; t < 2; t++) {
        ctx.save(); ctx.fillStyle = colT(); ctx.fillRect(xr - 15, yt(t) - 15, 30, 30); ctx.restore();
        label(ctx, "T" + (t + 1), xr, yt(t) + 1, "#fff", "center", "700 12px system-ui, sans-serif", "middle");
      }
      label(ctx, "folytonos = vásárolt (1)  ·  szaggatott = " + (neg ? "negatív minta (0)" : "ismeretlen"), w / 2, H - 6, css("--muted"), "center", "11px system-ui, sans-serif", "bottom");
    }
    function draw() {
      const sc = U.map(u => T.map(t => dotp(u, t))), pr = sc.map(r => r.map(w2Sig));
      drawE(); drawB(pr);
      const th = t => h("th", { style: "white-space:nowrap" }, t), td = (t, st = "") => h("td", { style: "font-family:var(--mono);white-space:nowrap;" + st }, t);
      tw.replaceChildren(h("table", { style: "width:auto;min-width:100%" },
        h("tr", null, th("vásárló"), th("U·T1 → p"), th("U·T2 → p"), th("sorrend")),
        ...U.map((u, i) => {
          const ord = pr[i][0] >= pr[i][1] ? [0, 1] : [1, 0];
          return h("tr", null, h("td", { style: "white-space:nowrap" }, h("b", { style: "color:var(--setA)" }, "U" + (i + 1)), " " + w2Vec(u)),
            ...[0, 1].map(t => td(fmt(sc[i][t], 2) + " → " + fmt(pr[i][t], 3) + (isKnown(i, t) ? " ✓" : ""), isKnown(i, t) ? "color:var(--setC);font-weight:700" : "")),
            td(ord.map(t => "T" + (t + 1)).join(" > ")));
        })));
      /* bináris kereszt-entrópia */
      let Ls = 0, cnt = 0;
      for (let u = 0; u < 3; u++) for (let t = 0; t < 2; t++) {
        const kn = isKnown(u, t); if (!kn && !neg) continue;
        const p = clamp(pr[u][t], 1e-12, 1 - 1e-12);
        Ls += -(kn ? Math.log(p) : Math.log(1 - p)); cnt++;
      }
      const L = Ls / cnt;
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(stat(fmt(L, 3), neg ? "BCE-veszteség, mind a 6 pár átlaga" : "BCE-veszteség, csak a 3 vásárlás"),
        stat(T.map((t, i) => "T" + (i + 1) + " " + w2Vec(t)).join("  "), "termékvektorok"));
      ro.textContent = neg
        ? "A vásárolt párok címkéje 1, a többi 0. A veszteség akkor kicsi, ha a vásárolt párok vektora egy irányba, a többié ellentétes irányba mutat. Húzd például T1-et lefelé, U2-től távolabb."
        : "Csak pozitív párokkal a veszteséget úgy is le lehet nyomni, hogy minden vektort hosszabbra húzol – akkor minden pár valószínűsége 1 felé megy. Ezért kellenek negatív minták: kapcsold be!";
    }
    cvE.draw = drawE; cvB.draw = () => draw();
    const pick = e => {
      if (!TT) return null;
      const [mx, my] = evXY(cvE, e);
      let best = null, bd = 16;
      pts().forEach(q => { const d = Math.hypot(TT.tx(q.p[0]) - mx, TT.ty(q.p[1]) - my); if (d < bd) { bd = d; best = q; } });
      return best;
    };
    cvE.c.addEventListener("pointerdown", e => { drag = pick(e); if (drag) { cvE.c.setPointerCapture(e.pointerId); e.preventDefault(); draw(); } });
    cvE.c.addEventListener("pointermove", e => {
      if (!drag) { cvE.c.style.cursor = pick(e) ? "grab" : "default"; return; }
      const [mx, my] = evXY(cvE, e), r = v => Math.round(v * 10) / 10;
      drag.p[0] = clamp(r(TT.ix(mx)), -1.5, 2); drag.p[1] = clamp(r(TT.iy(my)), -1.5, 2);
      draw();
    });
    const end = () => { if (drag) { drag = null; draw(); } };
    cvE.c.addEventListener("pointerup", end); cvE.c.addEventListener("pointercancel", end);
    draw();
  };
