
  /* animáció, amely csak akkor fut, ha a widget látszik (IntersectionObserver) */
  function animator(root, frame) {
    let on = false, vis = true, id = 0;
    const loop = () => { id = 0; if (!on || !vis) return; frame(); id = requestAnimationFrame(loop); };
    const kick = () => { if (on && vis && !id) id = requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; kick(); }).observe(root);
    return { start() { on = true; kick(); }, stop() { on = false; }, get running() { return on; } };
  }

  /* ------------------------------------------------------------------
     9.3  hidden-space – mit csinál a rejtett réteg? (2–2–1 háló)
     ------------------------------------------------------------------ */
  const HS_DS = [["xor4", "XOR (4 pont)"], ["xorN", "zajos XOR (80 pont)"], ["disc", "korong (80 pont)"]];
  function hsData(ds) {
    if (ds === "xor4") return { X: [[0, 0], [1, 0], [0, 1], [1, 1]], y: [0, 1, 1, 0] };
    const r = ML.rng(ds === "xorN" ? 21 : 22), X = [], y = [];
    for (let i = 0; i < 80; i++) {
      if (ds === "xorN") { const a = i % 4, cx = a & 1, cy = a >> 1; X.push([cx + 0.13 * ML.gauss(r), cy + 0.13 * ML.gauss(r)]); y.push(cx ^ cy); }
      else { const p = [-0.1 + 1.2 * r(), -0.1 + 1.2 * r()]; X.push(p); y.push(Math.hypot(p[0] - 0.5, p[1] - 0.5) < 0.36 ? 1 : 0); }
    }
    return { X, y };
  }
  W["hidden-space"] = root => {
    header(root, "A rejtett réteg átrendezi a teret",
      "Egy 2–2–1-es háló: két rejtett neuron ($h_1$, $h_2$) és egy kimeneti neuron. <b>Bal oldalt</b> a bemenetek síkja: a két színes vonal a két rejtett neuron $z = 0$ egyenese, a háttér a háló döntése. " +
      "<b>Jobb oldalt</b> ugyanezek a pontok a <b>rejtett térben</b>, a $(h_1, h_2)$ koordinátákkal – itt a kimeneti neuron már egyetlen egyenessel (vastag vonal) dönt. " +
      "Indítsd el a tanítást, és figyeld, hogyan „húzza szét” a rejtett réteg a pontokat! (A tanítás módszere a 10. fejezet témája – most csak nézd.)");
    let ds = "xor4", D = hsData(ds), act = "step", seed = 1, epochs = 0, loss = NaN;
    const net = new ML.MLP([2, 2, 1], { act: "sigmoid", out: "sigmoid", seed: 1 });
    const hand = () => { net.act = "step"; net.W = [[[1, 1], [1, 1]], [[1, -1]]]; net.b = [[-0.5, -1.5], [-0.5]]; act = "step"; epochs = 0; loss = NaN; resetOpt(); };
    const resetOpt = () => { net.t = 0; net.mW = net.W.map(M => M.map(r => r.map(() => 0))); net.vW = net.W.map(M => M.map(r => r.map(() => 0))); net.mb = net.b.map(v => v.map(() => 0)); net.vb = net.b.map(v => v.map(() => 0)); };
    const randInit = () => { if (act === "step") act = "sigmoid"; net.act = act; net.init(seed); epochs = 0; loss = NaN; };
    hand();
    const gD = toggleGroup(HS_DS, () => ds, v => { ds = v; D = hsData(ds); sync(); });
    const gA = toggleGroup([["step", "lépcső (kézi)"], ["sigmoid", "szigmoid"], ["tanh", "tanh"]], () => act, v => {
      anim.stop(); if (v === "step") hand(); else { act = v; net.act = v; net.init(seed); epochs = 0; loss = NaN; } sync();
    });
    const bT = btn("▶ Tanítás", () => {
      if (anim.running) { anim.stop(); sync(); return; }
      if (act === "step") { act = "sigmoid"; net.act = "sigmoid"; resetOpt(); }
      anim.start(); sync();
    }, "btn primary");
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, small("rejtett aktiváció:"), gA.bs),
      h("div", { class: "controls" }, bT, btn("🎲 Új véletlen kezdés", () => { seed++; anim.stop(); randInit(); sync(); }), btn("Kézi XOR-súlyok", () => { anim.stop(); hand(); sync(); })));
    const [cvL, cvR] = twoCanvas(root, 1, 1);
    const out = h("div", { class: "readout" });
    root.append(out);
    const anim = animator(root, () => {
      const rnd = ML.rng(epochs + 1);
      for (let k = 0; k < 2; k++) { loss = net.epoch(D.X, D.y, { batch: ds === "xor4" ? 4 : 10, lr: 0.03, opt: "adam", rnd }); epochs++; }
      if (epochs >= 4000) anim.stop();
      sync();
    });
    const hid = x => net.forwardAll(x).A[1];
    const outP = x => { const o = net.predict(x)[0]; return act === "step" ? (net.W[1][0][0] * hid(x)[0] + net.W[1][0][1] * hid(x)[1] + net.b[1][0] > 0 ? 1 : 0) : o; };
    const HC = () => [css("--setC"), "#8b5cf6"];
    cvL.draw = () => {
      const V = eqView(cvL, 0.5, 0.5, 0.78, 0.78, { xname: "x₁", yname: "x₂" });
      const T = Calc.plot(cvL, V, []), { ctx } = cvL;
      decisionMap(cvL, T, V, (p, q) => outP([p, q]), 6, 0.3);
      net.W[0].forEach((row, j) => { const L = lineFrom(row[0], row[1], net.b[0][j], V); if (L) polyline(ctx, T, L, HC()[j], 2.2, [6, 3]); });
      label(ctx, "— h₁ = 0", 8, 18, HC()[0], "left"); label(ctx, "— h₂ = 0", 8, 34, HC()[1], "left");
      D.X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), ds === "xor4" ? 7 : 4.5, D.y[i] ? C1() : C0(), !D.y[i], 2.2));
    };
    cvR.draw = () => {
      const lo = act === "tanh" ? -1.15 : -0.15, hi = 1.15;
      const V = eqView(cvR, (lo + hi) / 2, (lo + hi) / 2, (hi - lo) / 2, (hi - lo) / 2, { xname: "h₁", yname: "h₂" });
      const T = Calc.plot(cvR, V, []), { ctx } = cvR;
      const v = net.W[1][0], c = net.b[1][0];
      decisionMap(cvR, T, V, (p, q) => (act === "step" ? (v[0] * p + v[1] * q + c > 0 ? 1 : 0) : ML.sigmoid(v[0] * p + v[1] * q + c)), 6, 0.3);
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.setLineDash([3, 3]); ctx.strokeRect(T.tx(act === "tanh" ? -1 : 0), T.ty(1), T.tx(1) - T.tx(act === "tanh" ? -1 : 0), T.ty(act === "tanh" ? -1 : 0) - T.ty(1)); ctx.restore();
      const L = lineFrom(v[0], v[1], c, V);
      if (L) polyline(ctx, T, L, css("--text"), 2.2);
      const cnt = new Map();
      D.X.forEach((p, i) => {
        const [a, b] = hid(p), key = a.toFixed(3) + "," + b.toFixed(3);
        cnt.set(key, (cnt.get(key) || 0) + 1);
        dot(ctx, T.tx(a), T.ty(b), ds === "xor4" ? 7 : 4.5, D.y[i] ? C1() : C0(), !D.y[i], 2.2);
      });
      if (ds === "xor4") cnt.forEach((n, key) => { if (n > 1) { const [a, b] = key.split(",").map(Number); label(ctx, `×${n}`, T.tx(a) + 10, T.ty(b) - 6, css("--text"), "left", "700 12px system-ui, sans-serif"); } });
    };
    function sync() {
      gD.paint(); gA.paint();
      bT.textContent = anim.running ? "⏸ Szünet" : "▶ Tanítás";
      cvL.draw(); cvR.draw();
      const acc = D.X.reduce((s, p, i) => s + ((outP(p) > 0.5 ? 1 : 0) === D.y[i] ? 1 : 0), 0) / D.X.length;
      const Wt = net.W[0], bb = net.b[0], v = net.W[1][0], c = net.b[1][0];
      const sg = x => (x < 0 ? " − " : " + ") + fmt(Math.abs(x), 2);
      let s = `h₁ = ${A()[act].name}(${fmt(Wt[0][0], 2)}·x₁${sg(Wt[0][1])}·x₂${sg(bb[0])}) · h₂ = ${A()[act].name}(${fmt(Wt[1][0], 2)}·x₁${sg(Wt[1][1])}·x₂${sg(bb[1])})` +
        `<br>kimenet: ${act === "step" ? "lépcső" : "szigmoid"}(${fmt(v[0], 2)}·h₁${sg(v[1])}·h₂${sg(c)})` +
        `<br>helyesen osztályozott: <b>${pct(acc, 0)}</b>` + (epochs ? ` · epoch: <b>${epochs}</b> · veszteség: <b>${fmt(loss, 4)}</b>` : "");
      if (act === "step") s += `<br><span class="muted">Kézi súlyok: h₁ = VAGY, h₂ = ÉS. A rejtett térben (1; 0) és (0; 1) ugyanoda kerül, és a négy pont már egy egyenessel szétválik: „VAGY, de nem ÉS”.</span>`;
      else if (ds === "disc") s += `<br><span class="muted">Korong: két egyenes legfeljebb egy „csíkot” vagy „sarkot” tud kivágni – egy körhöz legalább három rejtett neuron kellene (próbáld ki a 9.7 játszóterén).</span>`;
      else s += `<br><span class="muted">Ha a tanulás beragad (a pontosság nem nő), próbálj új véletlen kezdést – két rejtett neuronnal a XOR-nak rossz helyi minimumai is vannak.</span>`;
      out.innerHTML = s;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.4  activation-gallery – aktivációs függvények és a deriváltjuk
     ------------------------------------------------------------------ */
  const AG = [["step", "lépcső"], ["sigmoid", "szigmoid"], ["tanh", "tanh"], ["relu", "ReLU"], ["leaky", "szivárgó ReLU"], ["gelu", "GELU"]];
  const AG_INFO = {
    step: ["{0, 1}", "0 (a 0-ban nem deriválható)", "0", "nem", "nagyon olcsó", "a gradiens mindenhol 0 – gradiens módszerrel nem tanítható"],
    sigmoid: ["(0; 1)", "0,25", "0,25", "nem", "exponenciális", "telítődik: nagy |z|-nél a derivált ≈ 0"],
    tanh: ["(−1; 1)", "1", "1", "igen", "exponenciális", "telítődik, de nulla középpontú"],
    relu: ["[0; ∞)", "nincs (balról 0, jobbról 1)", "1", "nem", "nagyon olcsó (max)", "z &lt; 0-ra a derivált 0: „halott” neuron lehet"],
    leaky: ["(−∞; ∞)", "nincs (0,01 vagy 1)", "1", "majdnem", "nagyon olcsó", "negatív oldalon is van kis gradiens"],
    gelu: ["kb. [−0,17; ∞)", "0,5", "≈ 1,13", "majdnem", "drágább (Φ)", "sima ReLU – a Transformerek kedvence"]
  };
  W["activation-gallery"] = root => {
    header(root, "Aktivációs függvények – és ami a tanításhoz kell: a derivált",
      "Folytonos vonal: $\\varphi(z)$; szaggatott: a deriváltja, $\\varphi'(z)$. Lent egy $L$ rétegű „lánc”: minden rétegben egyetlen neuron, $a_\\ell = \\varphi(w\\,a_{\\ell-1})$. " +
      "Az oszlopok azt mutatják, mennyire érzékeny az $\\ell$-edik réteg kimenete a bemenetre: $\\lvert\\partial a_\\ell/\\partial x\\rvert = \\prod_k \\lvert w\\,\\varphi'(z_k)\\rvert$ (logaritmikus skála). " +
      "Ez a szorzat dönti el, eljut-e a tanító jel a háló elejére (10. fejezet).");
    let act = "sigmoid", L = 10, wv = 1, x0 = 0.5;
    const g = toggleGroup(AG, () => act, v => { act = v; sync(); });
    const sL = slider(1, 30, 1, L), oL = h("b"), sW = slider(0.5, 3, 0.1, wv), oW = h("b"), sX = slider(-2, 2, 0.1, x0), oX = h("b");
    sL.addEventListener("input", () => { L = +sL.value; sync(); });
    sW.addEventListener("input", () => { wv = +sW.value; sync(); });
    sX.addEventListener("input", () => { x0 = +sX.value; sync(); });
    root.append(h("div", { class: "controls" }, g.bs));
    const cv = Calc.canvas(root, flatAspect(root, 0.42, 0.7));
    const info = h("div", { class: "readout" });
    root.append(info, h("div", { class: "controls" }, h("label", null, "rétegek: L = ", sL, oL), h("label", null, "súly: w = ", sW, oW), h("label", null, "bemenet: x = ", sX, oX)));
    const cvB = Calc.canvas(root, flatAspect(root, 0.32, 0.55));
    const out = h("div", { class: "readout" });
    root.append(out);
    cv.draw = () => {
      const F = A()[act];
      const ymin = act === "tanh" ? -1.3 : act === "relu" || act === "leaky" || act === "gelu" ? -1.2 : -0.3, ymax = act === "relu" || act === "leaky" || act === "gelu" ? 3.5 : 1.3;
      const layers = act === "step"
        ? [{ seg: [[-5, 0], [0, 0]], color: "--accent", width: 2.6 }, { seg: [[0, 1], [5, 1]], color: "--accent", width: 2.6 }, { seg: [[-5, 0], [5, 0]], color: "--setB", dash: [6, 4], width: 2 }]
        : [{ f: F.f, color: "--accent" }, { f: F.df, color: "--setB", dash: [6, 4], width: 2 }];
      Calc.plot(cv, { xmin: -5, xmax: 5, ymin, ymax, xname: "z", yname: "" }, layers);
      label(cv.ctx, `— ${F.name}: φ(z)`, 10, 18, css("--accent")); label(cv.ctx, "- - derivált: φ′(z)", 10, 34, css("--setB"));
    };
    cvB.draw = () => {
      const F = A()[act]; let a = x0, gp = 1; const G = [];
      for (let l = 0; l < L; l++) { const z = wv * a; gp *= wv * F.df(z); a = F.f(z); G.push(Math.abs(gp)); }
      const lg = G.map(v => (v > 0 ? Math.log10(v) : -Infinity));
      const fin = lg.filter(Number.isFinite), lo = Math.min(-3, ...fin.map(v => Math.floor(v))), hi = Math.max(1, ...fin.map(v => Math.ceil(v)));
      const T = Calc.plot(cvB, { xmin: 0, xmax: L + 1, ymin: Math.max(lo, -16) - 0.5, ymax: Math.min(hi, 16) + 0.5, xstep: Math.max(1, Math.ceil(L / 15)), ystep: Math.max(1, Math.ceil((hi - lo) / 8)), xname: "réteg ℓ", yname: "log₁₀ |∂aℓ/∂x|" }, []);
      const { ctx } = cvB, bw = Math.max(3, (T.tx(1) - T.tx(0)) * 0.6);
      lg.forEach((v, i) => {
        if (!Number.isFinite(v)) { label(ctx, "0", T.tx(i + 1), T.ty(0) - 3, css("--bad"), "center"); return; }
        const vv = clamp(v, -16, 16);
        ctx.fillStyle = v < -3 ? css("--bad") : v > 3 ? css("--setB") : css("--ok");
        ctx.fillRect(T.tx(i + 1) - bw / 2, Math.min(T.ty(0), T.ty(vv)), bw, Math.abs(T.ty(0) - T.ty(vv)));
      });
      cvB.G = G; cvB.a = a;
    };
    function sync() {
      g.paint(); sL.value = L; oL.textContent = L; sW.value = wv; oW.textContent = fmt(wv, 1); sX.value = x0; oX.textContent = fmt(x0, 1);
      cv.draw(); cvB.draw();
      const I = AG_INFO[act];
      info.innerHTML = `értékkészlet: <b>${I[0]}</b> · derivált a 0-ban: <b>${I[1]}</b> · legnagyobb derivált: <b>${I[2]}</b> · nulla középpontú: <b>${I[3]}</b> · számítás: <b>${I[4]}</b><br><span class="muted">${I[5]}</span>`;
      const gL = cvB.G[L - 1];
      const sci = v => (v === 0 ? "0" : v >= 1e-3 && v < 1e4 ? fmt(v, 4) : v.toExponential(2).replace(".", ",").replace(/e([+-]\d+)/, (m, e) => "·10^" + (+e)));
      let s = `|∂a_L/∂x| = <b>${sci(gL)}</b> (L = ${L}) · a_L = ${fmt(cvB.a, 4)}`;
      if (act === "step") s += `<br><span class="muted">A lépcső deriváltja mindenhol 0: a bemenet kis változása semmit sem változtat – a gradiens módszer nem kap jelet.</span>`;
      else if (gL < 1e-3) s += `<br><span class="muted">Eltűnő gradiens: a szorzat tényezői 1-nél kisebbek, ezért a jel rétegről rétegre zsugorodik.</span>`;
      else if (gL > 1e3) s += `<br><span class="muted">Robbanó gradiens: a tényezők 1-nél nagyobbak, a jel rétegről rétegre nő.</span>`;
      else s += `<br><span class="muted">A jel nagyjából megmarad.</span>`;
      if ((act === "relu" || act === "leaky") && x0 > 0) s += `<span class="muted"> Pozitív tartományban a ReLU deriváltja 1, így a szorzat éppen $w^L$ – $w = 1$-nél tökéletes, másutt eltűnik vagy robban: a ReLU <em>enyhíti</em> a gondot, nem oldja meg.</span>`;
      if (act === "relu" && x0 < 0) s += `<span class="muted"> Negatív bemenetnél a ReLU kimenete és deriváltja is 0 – a jel elhal.</span>`;
      out.innerHTML = s; math(out);
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.5  relu-sum – ReLU-darabok összege; mélység: hajtogatás
     ------------------------------------------------------------------ */
  const RS_T = {
    sq: { name: "x²", f: x => x * x, a: 0, b: 2 },
    sin: { name: "sin x", f: Math.sin, a: 0, b: 2 * Math.PI },
    bump: { name: "harang", f: x => Math.exp(-x * x), a: -3, b: 3 },
    step: { name: "lépcső (ugrik!)", f: x => (x > 0 ? 1 : 0), a: -1, b: 1 },
    own: { name: "saját képlet", f: null, a: -2, b: 2 }
  };
  W["relu-sum"] = root => {
    header(root, "ReLU-darabokból bármilyen görbe",
      "<b>Szélesség:</b> egyetlen rejtett réteg $n$ ReLU-neuronnal. Minden neuron egy „zsanér” ($c_k\\,\\mathrm{ReLU}(x - t_k)$, vékony vonalak); az összegük egy törött vonal (vastag), amely a $t_k$ pontokban egyezik a célfüggvénnyel (szaggatott). " +
      "<b>Mélység:</b> ugyanaz a két neuron rétegről rétegre ismételve – minden réteg „összehajtja” a szakaszt, és megduplázza a darabok számát.");
    let mode = "width", tg = "sq", n = 2, showT = true, L = 1, own = "x^3 - 2x", ownF = x => x * x * x - 2 * x;
    const gM = toggleGroup([["width", "szélesség: darabok összege"], ["depth", "mélység: hajtogatás"]], () => mode, v => { mode = v; sync(); });
    const gT = toggleGroup(Object.entries(RS_T).map(([k, o]) => [k, o.name]), () => tg, v => { tg = v; sync(); });
    const sN = slider(1, 30, 1, n), oN = h("b"), sL = slider(1, 8, 1, L), oL = h("b");
    sN.addEventListener("input", () => { n = +sN.value; sync(); });
    sL.addEventListener("input", () => { L = +sL.value; sync(); });
    const cT = checkbox(showT, () => { showT = cT.checked; sync(); });
    const inp = h("input", { type: "text", value: own, style: "width:11rem;font-family:var(--mono)" });
    inp.addEventListener("input", () => { try { const f = Calc.parse(inp.value, ["x"]).f; f(0.3); ownF = f; own = inp.value; inp.style.borderColor = ""; } catch (e) { inp.style.borderColor = css("--bad"); } sync(); });
    const rowW = h("div", { class: "controls" }, gT.bs), rowW2 = h("div", { class: "controls" }, h("label", null, "rejtett neuronok: n = ", sN, oN), h("label", null, cT, "a darabok külön is"), h("label", null, "f(x) = ", inp));
    const rowD = h("div", { class: "controls" }, h("label", null, "rétegek: L = ", sL, oL));
    root.append(h("div", { class: "controls" }, gM.bs), rowW, rowW2, rowD);
    const cv = Calc.canvas(root, flatAspect(root, 0.55, 0.8));
    const out = h("div", { class: "readout" });
    root.append(out);
    const relu = z => (z > 0 ? z : 0);
    function build() {
      const T = RS_T[tg], f = tg === "own" ? ownF : T.f, a = T.a, b = T.b;
      const t = Array.from({ length: n + 1 }, (_, k) => a + (b - a) * k / n), y = t.map(f);
      const s = t.slice(0, -1).map((_, k) => (y[k + 1] - y[k]) / (t[k + 1] - t[k]));
      const c = s.map((v, k) => (k ? v - s[k - 1] : v));
      const g = x => y[0] + c.reduce((acc, ck, k) => acc + ck * relu(x - t[k]), 0);
      let err = 0;
      for (let i = 0; i <= 2000; i++) { const x = a + (b - a) * i / 2000, e = Math.abs(g(x) - f(x)); if (Number.isFinite(e)) err = Math.max(err, e); }
      if (tg === "step") err = Math.max(err, Math.abs(g(0)), Math.abs(1 - g(0)));   // az ugrás két oldali határértéke 0 és 1
      return { f, a, b, t, y, c, g, err };
    }
    const Tm = x => 2 * relu(x) - 4 * relu(x - 0.5);
    cv.draw = () => render();
    function sync() {
      gM.paint(); gT.paint(); sN.value = n; oN.textContent = n; sL.value = L; oL.textContent = L; cT.checked = showT;
      [rowW, rowW2].forEach(e => (e.style.display = mode === "width" ? "" : "none")); rowD.style.display = mode === "depth" ? "" : "none";
      inp.parentNode.style.display = tg === "own" ? "" : "none";
      render();
    }
    function render() {
      if (mode === "width") {
        const B = build(), xs = [], ys = [];
        for (let i = 0; i <= 400; i++) { const x = B.a + (B.b - B.a) * i / 400; xs.push(x); ys.push(B.f(x), B.g(x)); }
        const fin = ys.filter(Number.isFinite), lo = Math.min(...fin), hi = Math.max(...fin), pad = 0.12 * (hi - lo || 1);
        const V = { xmin: B.a - 0.04 * (B.b - B.a), xmax: B.b + 0.04 * (B.b - B.a), ymin: Math.min(lo - pad, 0 - pad), ymax: hi + pad, xname: "x", yname: "" };
        const layers = [];
        if (showT && n <= 30) B.c.forEach((ck, k) => layers.push({ f: x => ck * relu(x - B.t[k]), color: rgba(css("--muted"), 0.55), width: 1.2, domain: [B.a, B.b] }));
        layers.push({ f: B.f, color: "--setB", dash: [6, 4], width: 2.2, domain: [B.a, B.b] }, { f: B.g, color: "--accent", width: 2.8, domain: [B.a, B.b] }, { points: B.t.map((t, k) => [t, B.y[k]]), color: "--accent", r: 3.5 });
        Calc.plot(cv, V, layers);
        const terms = B.c.slice(0, 4).map((ck, k) => `${k ? (ck < 0 ? " − " : " + ") : ""}${fmt(k ? Math.abs(ck) : ck, 2)}·ReLU(x ${B.t[k] < 0 ? "+ " + fmt(-B.t[k], 2) : "− " + fmt(B.t[k], 2)})`).join("") + (n > 4 ? " + …" : "");
        out.innerHTML = `g(x) = ${fmt(B.y[0], 2)} + ${terms}` +
          `<br>rejtett neuronok: <b>${n}</b> · a legnagyobb eltérés a tartományon: <b>${fmt(B.err, 4)}</b>` +
          `<br><span class="muted">${tg === "step" ? "Az ugrásnál a hiba sosem csökken 0,5 alá: a tétel csak folytonos függvényre ígér tetszőleges pontosságot." : tg === "sq" ? "x²-nél a hiba pontosan 1/n² (n = 2: 0,25; n = 10: 0,01) – kétszer annyi neuron, negyedannyi hiba." : "Minél több a neuron, annál sűrűbbek a töréspontok, és annál kisebb a hiba."}</span>`;
      } else {
        const layers = [{ f: x => { let y = x; for (let l = 0; l < L; l++) y = Tm(y); return y; }, color: "--accent", width: 2.2, domain: [0, 1] }];
        Calc.plot(cv, { xmin: -0.03, xmax: 1.03, ymin: -0.15, ymax: 1.2, xstep: 0.25, ystep: 0.5, xname: "x", yname: "" }, layers);
        out.innerHTML = `T(x) = 2·ReLU(x) − 4·ReLU(x − 0,5), és a háló ${L} rétege: T(T(…T(x)…)) · rejtett neuronok: <b>${2 * L}</b> · lineáris darabok: <b>${2 ** L}</b>` +
          `<br>Egyetlen rejtett réteggel ugyanehhez legalább <b>${2 ** L - 1}</b> neuron kellene (minden ReLU-neuron legfeljebb egy töréspontot ad).` +
          `<br><span class="muted">A mélység szorozza a darabokat, a szélesség csak összeadja őket.</span>`;
      }
    }
    sync();
  };
