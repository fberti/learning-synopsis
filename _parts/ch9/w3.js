
  /* ------------------------------------------------------------------
     9.6  param-counter – paraméterek rétegenként
     ------------------------------------------------------------------ */
  const PCN = [["2, 2, 1", "XOR 2–2–1"], ["2, 8, 8, 1", "holdak 2–8–8–1"], ["64, 16, 10", "számjegy 64–16–10"], ["784, 128, 10", "MNIST 784–128–10"], ["784, 100, 100, 10", "784–100–100–10"], ["784, 1000, 1000, 10", "784–1000–1000–10"]];
  W["param-counter"] = root => {
    header(root, "Paraméterszámláló",
      "Add meg a rétegek méretét a bemenettől a kimenetig (vesszővel elválasztva). Egy $n_{\\text{be}} \\to n_{\\text{ki}}$ teljesen összekötött rétegben $n_{\\text{ki}} \\times n_{\\text{be}}$ súly és $n_{\\text{ki}}$ torzítás van. " +
      "A rajz legfeljebb 10 neuront mutat rétegenként.");
    let src = "784, 128, 10", bias = true, bytes = 4;
    const inp = h("input", { type: "text", value: src, style: "width:14rem;font-family:var(--mono)" });
    inp.addEventListener("input", () => { src = inp.value; sync(); });
    const g = toggleGroup(PCN, () => src, v => { src = v; inp.value = v; sync(); });
    const cB = checkbox(bias, () => { bias = cB.checked; sync(); });
    const gB = toggleGroup([["4", "32 bites szám (4 bájt)"], ["2", "16 bites (2 bájt)"]], () => String(bytes), v => { bytes = +v; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "rétegek: ", inp), h("label", null, cB, "torzítással")),
      h("div", { class: "controls" }, g.bs), h("div", { class: "controls" }, small("tárolás:"), gB.bs));
    const cv = Calc.canvas(root, flatAspect(root, 0.36, 0.6));
    const out = h("div", { class: "readout" });
    root.append(out);
    const parse = () => { const v = src.split(/[,;\s–-]+/).filter(Boolean).map(Number); return v.length >= 2 && v.every(k => Number.isInteger(k) && k > 0 && k <= 1e6) ? v : null; };
    const big = n => fmt(n, 0);
    cv.draw = () => {
      const S = parse(), { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      if (!S) return;
      const nL = S.length, xs = S.map((_, l) => 30 + (w - 60) * (nL === 1 ? 0.5 : l / (nL - 1)));
      const shown = S.map(n => Math.min(n, 10)), ys = shown.map(k => Array.from({ length: k }, (_, i) => 22 + (hh - 54) * (k === 1 ? 0.5 : i / (k - 1))));
      ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.35); ctx.lineWidth = 0.8;
      for (let l = 0; l < nL - 1; l++) for (const ya of ys[l]) for (const yb of ys[l + 1]) { ctx.beginPath(); ctx.moveTo(xs[l], ya); ctx.lineTo(xs[l + 1], yb); ctx.stroke(); }
      ctx.restore();
      S.forEach((n, l) => {
        ys[l].forEach((y, i) => {
          const gap = n > 10 && i === 4;
          if (gap) { label(ctx, "⋮", xs[l], y + 4, css("--muted"), "center", "700 14px system-ui, sans-serif", "middle"); return; }
          dot(ctx, xs[l], y, 6, l === 0 ? css("--muted") : l === nL - 1 ? css("--setB") : css("--accent"));
        });
        label(ctx, big(n), xs[l], hh - 8, css("--text"), "center", "700 12px system-ui, sans-serif");
      });
    };
    function sync() {
      g.paint(); gB.paint(); cB.checked = bias;
      cv.draw();
      const S = parse();
      if (!S) { out.innerHTML = `<span class="muted">Legalább két pozitív egész szám kell (pl. 784, 128, 10).</span>`; return; }
      let tw = 0, tb = 0;
      const rows = S.slice(1).map((n, l) => { const wn = S[l] * n, bn = bias ? n : 0; tw += wn; tb += bn; return `<tr><td>${l + 1}. (${l === S.length - 2 ? "kimeneti" : "rejtett"})</td><td>${big(n)} × ${big(S[l])}</td><td>${big(wn)}</td><td>${big(bn)}</td><td><b>${big(wn + bn)}</b></td></tr>`; }).join("");
      const tot = tw + tb, mem = tot * bytes;
      const memS = mem >= 1e9 ? fmt(mem / 1e9, 2) + " GB" : mem >= 1e6 ? fmt(mem / 1e6, 2) + " MB" : fmt(mem / 1e3, 1) + " kB";
      out.innerHTML = `<table style="font-size:.84rem;width:auto;margin:.2rem 0"><tr><th>réteg</th><th>W alakja</th><th>súlyok</th><th>torzítások</th><th>összesen</th></tr>${rows}` +
        `<tr><td colspan="2"><b>háló</b></td><td>${big(tw)}</td><td>${big(tb)}</td><td><b>${big(tot)}</b></td></tr></table>` +
        `paraméterek: <b>${big(tot)}</b> · tárolás: <b>${memS}</b> · szorzás-összeadás mintánként: <b>${big(tw)}</b>` +
        (bias && tot ? ` · a torzítások aránya: <b>${pct(tb / tot, 2)}</b>` : "") +
        `<br><span class="muted">Rejtett rétegek: ${S.length - 2} · a bemeneti „réteg” nem számol, csak továbbadja a számokat – ezért nincs paramétere.</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     9.7  nn-playground – a neurális háló játszótere
     ------------------------------------------------------------------ */
  const PG_DS = [["xor", "XOR"], ["circles", "körök"], ["moons", "holdak"], ["spiral", "spirál"], ["blobs", "két felhő"]];
  const PG_ACT = [["tanh", "tanh"], ["relu", "ReLU"], ["sigmoid", "szigmoid"], ["linear", "lineáris"]];
  const PG_LR = [0.003, 0.01, 0.03, 0.1];
  W["nn-playground"] = root => {
    header(root, "A neurális háló játszótere",
      "Válassz adatot, rakd össze a hálót (rétegek és neuronok a <b>+</b>/<b>−</b> gombokkal), és indítsd el a tanítást. Minden kis négyzet egy neuron „látványa”: " +
      "milyen értéket ad a sík egyes pontjain (narancs = pozitív, kék = negatív). A nagy ábra a háló kimenete: telt pont a tanító, üres pont a teszt adat. " +
      "A tanítás (mini-köteges Adam, 10-es kötegekkel) részleteit a 10. fejezet mutatja meg.");
    let ds = "circles", noise = 0.1, dseed = 1, act = "tanh", lr = 0.03, hidden = [4, 2], seed = 1, showTest = true;
    let net, tr, te, epoch = 0, hist = [], rnd = ML.rng(1);
    const gD = toggleGroup(PG_DS, () => ds, v => { ds = v; newData(); });
    const gA = toggleGroup(PG_ACT, () => act, v => { act = v; rebuild(); });
    const gL = toggleGroup(PG_LR.map(v => [String(v), fmt(v, 3)]), () => String(lr), v => { lr = +v; sync(); });
    const sN = slider(0, 0.5, 0.05, noise), oN = h("b");
    sN.addEventListener("input", () => { noise = +sN.value; newData(); });
    const cT = checkbox(showTest, () => { showTest = cT.checked; draw(); });
    const bP = btn("▶ Tanítás", () => { anim.running ? anim.stop() : anim.start(); sync(); }, "btn primary");
    const bS = btn("1 epoch", () => { anim.stop(); trainEpoch(); sync(); });
    root.append(h("div", { class: "controls" }, small("adat:"), gD.bs, btn("🎲 Új minta", () => { dseed++; newData(); })),
      h("div", { class: "controls" }, h("label", null, "zaj: ", sN, oN), h("label", null, cT, "tesztpontok")),
      h("div", { class: "controls" }, small("aktiváció:"), gA.bs),
      h("div", { class: "controls" }, small("tanulási ráta:"), gL.bs),
      h("div", { class: "controls" }, bP, bS, btn("↺ Új kezdés", () => { seed++; rebuild(); })));
    const netRow = h("div", { style: "display:flex;flex-wrap:wrap;gap:.6rem;align-items:flex-start;padding:.2rem 0" });
    const outBox = h("div", { style: "flex:1 1 260px;min-width:220px;max-width:380px" });
    const layerBox = h("div", { style: "display:flex;gap:.45rem;align-items:flex-start;overflow-x:auto;max-width:100%" });
    netRow.append(layerBox, outBox); root.append(netRow);
    const cv = Calc.canvas(outBox, 1, 380);
    const cvH = Calc.canvas(root, flatAspect(root, 0.26, 0.45));
    cvH.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    const G = 22;
    let tiles = [];                // tiles[l][j] = { c (canvas), ctx }
    function buildLayers() {
      layerBox.innerHTML = ""; tiles = [];
      const colIn = h("div", { style: "display:flex;flex-direction:column;gap:4px;align-items:center" }, h("div", { class: "muted", style: "font-size:.78rem;height:3.2rem;display:flex;align-items:flex-end" }, "bemenet"));
      tiles.push([0, 1].map(j => { const c = h("canvas", { width: G, height: G, title: j ? "x₂" : "x₁", style: "width:40px;height:40px;border-radius:4px;border:1px solid var(--border);image-rendering:auto" }); colIn.append(c, h("div", { class: "muted", style: "font-size:.72rem;margin-top:-3px" }, j ? "x₂" : "x₁")); return { c, ctx: c.getContext("2d") }; }));
      layerBox.append(colIn);
      hidden.forEach((n, l) => {
        const col = h("div", { style: "display:flex;flex-direction:column;gap:4px;align-items:center" });
        const ctr = h("div", { style: "display:flex;gap:2px;align-items:center;height:1.6rem" },
          btn("−", () => { if (hidden[l] > 1) { hidden[l]--; rebuild(); } }, "btn"), btn("+", () => { if (hidden[l] < 8) { hidden[l]++; rebuild(); } }, "btn"));
        ctr.querySelectorAll("button").forEach(b => { b.style.padding = "0 .45rem"; b.style.minWidth = "1.6rem"; });
        col.append(ctr, h("div", { class: "muted", style: "font-size:.74rem;height:1.5rem" }, `${n} neuron`));
        tiles.push(Array.from({ length: n }, () => { const c = h("canvas", { width: G, height: G, style: "width:40px;height:40px;border-radius:4px;border:1px solid var(--border)" }); col.append(c); return { c, ctx: c.getContext("2d") }; }));
        layerBox.append(col);
      });
      const lc = h("div", { style: "display:flex;flex-direction:column;gap:4px;align-items:center" },
        h("div", { class: "muted", style: "font-size:.78rem" }, "rejtett rétegek"),
        h("div", { style: "display:flex;gap:2px" }, btn("−", () => { if (hidden.length) { hidden.pop(); rebuild(); } }), btn("+", () => { if (hidden.length < 4) { hidden.push(hidden.length ? hidden[hidden.length - 1] : 3); rebuild(); } })),
        h("div", { class: "muted", style: "font-size:.78rem" }, `${hidden.length} db`));
      lc.querySelectorAll("button").forEach(b => { b.style.padding = "0 .5rem"; });
      layerBox.append(lc);
    }
    function newData() {
      const all = ML.data[ds](300, 1000 * dseed + ds.length, noise);
      const idx = ML.shuffle(all.X.map((_, i) => i), ML.rng(dseed + 7));
      const pick = ids => ({ X: ids.map(i => all.X[i]), y: ids.map(i => all.y[i]) });
      tr = pick(idx.slice(0, 150)); te = pick(idx.slice(150));
      rebuild(false);
    }
    function rebuild(layers = true) {
      net = new ML.MLP([2, ...hidden, 1], { act, out: "sigmoid", seed });
      epoch = 0; hist = []; rnd = ML.rng(seed * 13 + 1);
      if (layers || !tiles.length) buildLayers();
      sync();
    }
    function trainEpoch() {
      net.epoch(tr.X, tr.y, { batch: 10, lr, opt: "adam", rnd });
      epoch++;
      hist.push([net.loss(tr.X, tr.y), net.loss(te.X, te.y)]);
      if (hist.length > 4000) hist = hist.filter((_, i) => i % 2 === 0);
    }
    const anim = animator(root, () => { trainEpoch(); if (epoch >= 3000) anim.stop(); sync(); });
    /* minden neuron kimenete egy G × G-s rácson (a rács a [−1,1]² négyzet) */
    function tileMaps() {
      const L = hidden.length, maps = tiles.map(col => col.map(() => new Float32Array(G * G)));
      for (let r = 0; r < G; r++) for (let c = 0; c < G; c++) {
        const x = [-1 + 2 * (c + 0.5) / G, 1 - 2 * (r + 0.5) / G], { A } = net.forwardAll(x);
        maps[0][0][r * G + c] = x[0]; maps[0][1][r * G + c] = x[1];
        for (let l = 0; l < L; l++) for (let j = 0; j < hidden[l]; j++) maps[l + 1][j][r * G + c] = act === "sigmoid" ? 2 * A[l + 1][j] - 1 : A[l + 1][j];
      }
      const c1 = hexRGB(C1()), c0 = hexRGB(C0()), bg = hexRGB(css("--card"));
      tiles.forEach((col, l) => col.forEach((t, j) => {
        const m = maps[l][j]; let mx = 1e-9; for (const v of m) mx = Math.max(mx, Math.abs(v));
        const sc = act === "tanh" || act === "sigmoid" || l === 0 ? 1 : mx;
        const img = t.ctx.createImageData(G, G);
        for (let k = 0; k < G * G; k++) {
          const v = clamp(m[k] / sc, -1, 1), cc = v >= 0 ? c1 : c0, a = Math.abs(v);
          img.data[4 * k] = bg[0] + (cc[0] - bg[0]) * a; img.data[4 * k + 1] = bg[1] + (cc[1] - bg[1]) * a; img.data[4 * k + 2] = bg[2] + (cc[2] - bg[2]) * a; img.data[4 * k + 3] = 255;
        }
        t.ctx.putImageData(img, 0, 0);
      }));
    }
    function draw() {
      const V = eqView(cv, 0, 0, 1.05, 1.05, { xname: "x₁", yname: "x₂", labels: false });
      const T = Calc.plot(cv, V, []), { ctx } = cv;
      decisionMap(cv, T, V, (p, q) => net.predict([p, q])[0], 5, 0.5);
      const r = cv.w < 300 ? 2.6 : 3.2;
      if (showTest) te.X.forEach((p, i) => dot(ctx, T.tx(p[0]), T.ty(p[1]), r, te.y[i] ? C1() : C0(), true, 1.4));
      tr.X.forEach((p, i) => { dot(ctx, T.tx(p[0]), T.ty(p[1]), r + 1, css("--card")); dot(ctx, T.tx(p[0]), T.ty(p[1]), r, tr.y[i] ? C1() : C0()); });
      tileMaps();
      const n = hist.length, top = n ? Math.max(0.1, ...hist.map(v => Math.max(v[0], v[1]))) : 1;
      const Th = Calc.plot(cvH, { xmin: 0, xmax: Math.max(50, epoch) * 1.02, ymin: 0, ymax: Math.min(1.2, top * 1.1), xname: "epoch", yname: "veszteség" }, []);
      if (n > 1) {
        const step = Math.max(1, Math.floor(n / 400)), ex = i => (i + 1) * epoch / n;
        polyline(cvH.ctx, Th, hist.filter((_, i) => i % step === 0).map((v, k) => [ex(k * step), v[0]]), css("--accent"), 2);
        polyline(cvH.ctx, Th, hist.filter((_, i) => i % step === 0).map((v, k) => [ex(k * step), v[1]]), css("--setB"), 2, [5, 3]);
      }
      label(cvH.ctx, "— tanító", Math.max(60, cvH.w - 170), 18, css("--accent")); label(cvH.ctx, "- - teszt", Math.max(60, cvH.w - 90), 18, css("--setB"));
    }
    cv.draw = cvH.draw = () => draw();
    function sync() {
      gD.paint(); gA.paint(); gL.paint(); sN.value = noise; oN.textContent = fmt(noise, 2); cT.checked = showTest;
      bP.textContent = anim.running ? "⏸ Szünet" : "▶ Tanítás";
      draw();
      const lt = hist.length ? hist[hist.length - 1] : [net.loss(tr.X, tr.y), net.loss(te.X, te.y)];
      out.innerHTML = `háló: <b>${[2, ...hidden, 1].join("–")}</b> · paraméterek: <b>${net.nParams}</b> · epoch: <b>${epoch}</b>` +
        `<br>veszteség – tanító: <b>${fmt(lt[0], 3)}</b>, teszt: <b>${fmt(lt[1], 3)}</b> · pontosság – tanító: <b>${pct(net.accuracy(tr.X, tr.y), 0)}</b>, teszt: <b>${pct(net.accuracy(te.X, te.y), 0)}</b>`;
    }
    newData();
  };
