  /* ==================================================================
     2. ágens: latent-map, gan-1d, gan-epochs, gen-compare
     ================================================================== */
  /* rögzített tizedesjegyek (a fmt levágja a záró nullákat) */
  const w2Fix = (x, d) => { const s = Math.abs(x).toFixed(d).replace(".", ","); return (x < 0 && +s.replace(",", ".") !== 0 ? "−" : "") + s; };
  const w2Pct = (a, d = 0) => w2Fix(100 * a, d) + "%";
  /* kis számok: 0,0123 vagy 8,9·10⁻⁵ */
  const w2Sci = x => {
    if (!Number.isFinite(x)) return "–";
    if (x === 0 || Math.abs(x) >= 0.001) return w2Fix(x, Math.abs(x) >= 0.1 ? 2 : 4);
    const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e, sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    return w2Fix(m, 1) + "·10⁻" + String(-e).split("").map(c => sup[+c]).join("");
  };
  const w2Swatch = col => h("span", { style: `display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${col};vertical-align:-.05em;margin-right:.25em;flex:none` });
  /* animáció: csak ha fut és látszik */
  function w2Anim(root, frame) {
    let on = false, vis = true, id = 0;
    const loop = () => { id = 0; if (!on || !vis) return; frame(); if (on) id = requestAnimationFrame(loop); };
    const kick = () => { if (on && vis && !id) id = requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; kick(); }).observe(root);
    return { start() { on = true; kick(); }, stop() { on = false; }, get running() { return on; } };
  }
  /* számjegyrács: imgs (0…16), cols oszlop, a cellák bal felső sarka (x0, y0), cellaméret s, rés g */
  function w2Grid(ctx, imgs, cols, x0, y0, s, g, opts = {}) {
    imgs.forEach((v, i) => drawDigit(ctx, x0 + (i % cols) * (s + g), y0 + Math.floor(i / cols) * (s + g), s, v, opts));
  }
  const w2Data = () => window.GEN14;
  /* felirat háttérszínű körvonallal (pontfelhő fölött is olvasható) */
  function w2Halo(ctx, txt, x, y, color, font = "700 12px system-ui, sans-serif") {
    ctx.save(); ctx.font = font; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeStyle = css("--card"); ctx.strokeText(txt, x, y);
    ctx.fillStyle = color; ctx.fillText(txt, x, y); ctx.restore();
  }
  /* képek átlagos páronkénti euklideszi távolsága (sokféleség) */
  const w2Div = I => { let t = 0, n = 0; for (let i = 0; i < I.length; i++) for (let j = i + 1; j < I.length; j++) { let d = 0; for (let k = 0; k < 64; k++) d += (I[i][k] - I[j][k]) ** 2; t += Math.sqrt(d); n++; } return t / n; };
  const w2NoData = root => root.append(small("(A 14. fejezet adatfájlja – gen-data.js – nincs betöltve.)"));

  /* ==================================================================
     14.3-c, 14.4-c  latent-map – a látens tér térképe
     ================================================================== */
  W["latent-map"] = root => {
    header(root, "A látens tér térképe",
      "Minden pont egy tanítókép kódja ($\\mathbf z \\in \\mathbb R^2$), a színe a számjegy. Húzd a célkeresztet: jobbra a dekódoló rajza ebből a kódból. " +
      "Hasonlítsd össze az autoenkódert és a VAE-t: hol van a kódfelhő, és mit rajzol a dekódoló egy $\\mathcal N(0, I)$-ből sorsolt kódból?");
    const G = w2Data();
    if (!G || !G.latent) return w2NoData(root);
    const LT = G.latent;
    let mode = "ae", z = [0, 0], rand = null, randSeed = 0, ia = 1, ib = 7, T = null;
    const tg = toggleGroup([["ae", "autoenkóder"], ["vae", "VAE"]], () => mode, k => { mode = k; rand = null; z = [0, 0]; draw(); });
    const bRand = btn("Véletlen kód 𝒩(0, I)-ből", () => {
      randSeed++;
      const r = rng(1000 + randSeed);
      rand = Array.from({ length: 16 }, () => [gauss(r), gauss(r)]);
      z = rand[0].slice(); draw();
    });
    const bOrig = btn("Célkereszt az origóba", () => { z = [0, 0]; draw(); });
    root.append(h("div", { class: "controls" }, ...tg.bs, bRand, bOrig));
    const [cvS, cvD, Lc] = twoCanvas(root, 0.9, 0.56);
    const leg = h("div", { style: "display:flex;flex-wrap:wrap;gap:.2rem .7rem;font-size:.85rem;justify-content:center;margin-top:.3rem" },
      DIGIT_COLORS.map((c, i) => h("span", { style: "display:inline-flex;align-items:center" }, w2Swatch(c), String(i))));
    Lc.append(leg);
    const out = h("div", { class: "readout" });
    root.append(out);
    /* interpoláció */
    const mkSel = v => { const s = h("select", null, ...Array.from({ length: 10 }, (_, i) => h("option", { value: i }, i + "-es"))); s.value = v; return s; };
    const sA = mkSel(ia), sB = mkSel(ib);
    sA.addEventListener("change", () => { ia = +sA.value; draw(); });
    sB.addEventListener("change", () => { ib = +sB.value; draw(); });
    root.append(h("div", { style: "font-weight:600;margin-top:.9rem" }, "Interpoláció két tesztkép között"),
      h("div", { class: "controls" }, h("label", null, "A:", sA), h("label", null, "B:", sB),
        small("7 lépés: t = 0, 1/6, …, 1. A kódokat a térképen a vonal mutatja.")));
    const ibox = h("div", { style: "max-width:600px" });
    root.append(ibox);
    const cvI = Calc.canvas(ibox, flatAspect(root, 0.33, 0.42), 600);

    const M = () => LT[mode];
    const dec = zz => mlpForward(M().dec, zz).map(v => v * 16);
    function viewOf() {
      const P = M().z;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      P.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
      const R = mode === "vae" ? 2.1 : 1.05;
      x0 = Math.min(x0, -R); x1 = Math.max(x1, R); y0 = Math.min(y0, -R); y1 = Math.max(y1, R);
      const mx = 0.06 * (x1 - x0), my = 0.06 * (y1 - y0);
      return eqView(cvS, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + mx, (y1 - y0) / 2 + my, { xname: "z₁", yname: "z₂" });
    }
    function drawS() {
      const V = viewOf();
      T = Calc.plot(cvS, V, []);
      const ctx = cvS.ctx, P = M().z, lab = LT.label;
      const sc = (T.tx(1) - T.tx(0));
      if (mode === "vae") {
        ring(ctx, T.tx(0), T.ty(0), sc, css("--text"), 1.5, [5, 4]);
        ring(ctx, T.tx(0), T.ty(0), 2 * sc, css("--muted"), 1.3, [5, 4]);

      } else {
        ring(ctx, T.tx(0), T.ty(0), sc, rgba(css("--muted"), 0.8), 1.3, [3, 3]);

      }
      P.forEach(([a, b], i) => dot(ctx, T.tx(a), T.ty(b), 2.4, rgba(DIGIT_COLORS[lab[i]], 0.85)));
      /* interpolációs vonal */
      const zA = M().test[ia], zB = M().test[ib];
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(T.tx(zA[0]), T.ty(zA[1])); ctx.lineTo(T.tx(zB[0]), T.ty(zB[1])); ctx.stroke(); ctx.restore();
      for (let k = 0; k <= 6; k++) { const t = k / 6; dot(ctx, T.tx(zA[0] + t * (zB[0] - zA[0])), T.ty(zA[1] + t * (zB[1] - zA[1])), 3, css("--text"), true, 1.5); }
      w2Halo(ctx, "A", T.tx(zA[0]) + 6, T.ty(zA[1]) - 4, css("--text"));
      w2Halo(ctx, "B", T.tx(zB[0]) + 6, T.ty(zB[1]) - 4, css("--text"));
      if (mode === "vae") {
        w2Halo(ctx, "1σ", T.tx(0) + sc * 0.72 + 3, T.ty(0) - sc * 0.72, css("--text"));
        w2Halo(ctx, "2σ", T.tx(0) + sc * 1.42 + 3, T.ty(0) - sc * 1.42, css("--muted"));
      } else w2Halo(ctx, "egységkör", T.tx(0) + sc * 0.72 + 3, T.ty(0) - sc * 0.72, css("--muted"), "600 11px system-ui, sans-serif");
      /* véletlen kódok */
      if (rand) rand.forEach(([a, b]) => {
        const x = T.tx(a), y = T.ty(b);
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 4, y - 4); ctx.stroke(); ctx.restore();
      });
      /* célkereszt */
      const cx = T.tx(z[0]), cy = T.ty(z[1]);
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 14, cy); ctx.lineTo(cx - 4, cy); ctx.moveTo(cx + 4, cy); ctx.lineTo(cx + 14, cy);
      ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy - 4); ctx.moveTo(cx, cy + 4); ctx.lineTo(cx, cy + 14); ctx.stroke(); ctx.restore();
      ring(ctx, cx, cy, 9, css("--accent"), 2);
    }
    function drawD() {
      const { ctx, w, h: hh } = cvD;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const s = Math.min(hh - 26, w / 2 - 12);
      label(ctx, "dekódolt kép", 6, 16, css("--muted"), "left", "600 12px system-ui, sans-serif");
      drawDigit(ctx, 6, 22, s, dec(z), { frameVar: "--accent", frameW: 2 });
      const gx = w / 2 + 6;
      if (rand) {
        label(ctx, "16 kód 𝒩(0, I)-ből", gx, 16, css("--muted"), "left", "600 12px system-ui, sans-serif");
        const g = 3, c = (s - 3 * g) / 4;
        w2Grid(ctx, rand.map(dec), 4, gx, 22, c, g);
      } else {
        label(ctx, "Nyomd meg:", gx, 22 + s / 2 - 8, css("--muted"), "left", "600 12px system-ui, sans-serif");
        label(ctx, "„Véletlen kód”", gx, 22 + s / 2 + 10, css("--muted"), "left", "600 12px system-ui, sans-serif");
      }
    }
    function drawI() {
      const { ctx, w, h: hh } = cvI;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const g = 6, s = Math.min((w - 6 * g - 2) / 7, (hh - 2 * 18 - 8) / 2), x0 = 1;
      const zA = M().test[ia], zB = M().test[ib], xA = LT.testOrig[ia], xB = LT.testOrig[ib];
      label(ctx, "keverés a kódban: d((1 − t)·z_A + t·z_B)", x0, 15, css("--accent"), "left", "600 12px system-ui, sans-serif");
      const y2 = 18 + s + 8;
      label(ctx, "keverés a pixelekben: (1 − t)·x_A + t·x_B", x0, y2 + 15, css("--muted"), "left", "600 12px system-ui, sans-serif");
      for (let k = 0; k <= 6; k++) {
        const t = k / 6, x = x0 + k * (s + g);
        drawDigit(ctx, x, 18, s, dec([zA[0] + t * (zB[0] - zA[0]), zA[1] + t * (zB[1] - zA[1])]), { frameVar: "--accent" });
        drawDigit(ctx, x, y2 + 18, s, xA.map((v, i) => (1 - t) * v + t * xB[i]));
      }
    }
    function readout() {
      const P = M().z, lab = LT.label;
      let bi = 0, bd = Infinity;
      P.forEach(([a, b], i) => { const d = Math.hypot(a - z[0], b - z[1]); if (d < bd) { bd = d; bi = i; } });
      const r = Math.hypot(z[0], z[1]);
      out.innerHTML = `z = (${w2Fix(z[0], 2)}; ${w2Fix(z[1], 2)}) · legközelebbi tanítókód: <b>${lab[bi]}</b>-es számjegy, ${w2Fix(bd, 2)} távolságra` +
        `<br><span class="muted">` + (mode === "vae"
          ? `A prior szerint a kódok ${w2Pct(1 - Math.exp(-r * r / 2))}-a esik ennél (|z| = ${w2Fix(r, 2)}) közelebb az origóhoz. A VAE kódfelhője kitölti a 𝒩(0, I) körét, ezért a sorsolt kód szinte mindig a felhőbe esik.`
          : `Az autoenkóder kódjai a (${w2Fix(Math.min(...P.map(p => p[0])), 1)} … ${w2Fix(Math.max(...P.map(p => p[0])), 1)}) × (${w2Fix(Math.min(...P.map(p => p[1])), 1)} … ${w2Fix(Math.max(...P.map(p => p[1])), 1)}) téglalapban szóródnak, ` +
            `nem az egységkörben: egy 𝒩(0, I)-ből sorsolt kód a felhő szélére vagy egy lyukba esik.`) + "</span>";
    }
    function draw() { tg.paint(); cvS.draw = drawS; cvD.draw = drawD; cvI.draw = drawI; drawS(); drawD(); drawI(); readout(); }
    /* húzás */
    let drag = false;
    const setZ = e => { if (!T) return; const [px, py] = evXY(cvS, e); z = [T.ix(px), T.iy(py)]; drawS(); drawD(); readout(); };
    cvS.c.style.cursor = "crosshair";
    cvS.c.addEventListener("pointerdown", e => { drag = true; cvS.c.setPointerCapture(e.pointerId); setZ(e); });
    cvS.c.addEventListener("pointermove", e => { if (drag) setZ(e); });
    const end = () => { drag = false; };
    cvS.c.addEventListener("pointerup", end); cvS.c.addEventListener("pointercancel", end);
    draw();
  };

  /* ==================================================================
     14.5-b/c  gan-1d – hamisító és detektív egy egyenesen
     ================================================================== */
/*GANCORE-BEGIN*/
  /* --- 1D GAN: kis MLP kézzel írt visszaterjesztéssel és Adammal --- */
  function w2Gauss(rnd) { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); }
  function w2Net(sizes, act, rnd) {
    const L = [];
    for (let l = 0; l + 1 < sizes.length; l++) {
      const nin = sizes[l], nout = sizes[l + 1];
      const sd = Math.sqrt((act === "tanh" ? 1 : 2) / nin);
      const Wt = new Float64Array(nin * nout), b = new Float64Array(nout);
      for (let i = 0; i < Wt.length; i++) Wt[i] = sd * w2Gauss(rnd);
      L.push({ nin, nout, W: Wt, b, gW: new Float64Array(Wt.length), gb: new Float64Array(nout),
        mW: new Float64Array(Wt.length), vW: new Float64Array(Wt.length), mb: new Float64Array(nout), vb: new Float64Array(nout) });
    }
    return { L, act, t: 0 };
  }
  const w2Act = (a, z) => (a === "tanh" ? Math.tanh(z) : (z > 0 ? z : 0.2 * z));
  const w2dAct = (a, z) => (a === "tanh" ? 1 - Math.tanh(z) ** 2 : (z > 0 ? 1 : 0.2));
  /* előreszámolás egy batchen (x: n×1); a kimenet lineáris (a D-nél ez a logit) */
  function w2Fwd(net, x) {
    const n = x.length, cache = [x];
    let a = x;
    net.L.forEach((Ly, li) => {
      const z = new Float64Array(n * Ly.nout), last = li === net.L.length - 1;
      for (let s = 0; s < n; s++) for (let j = 0; j < Ly.nout; j++) {
        let v = Ly.b[j];
        for (let i = 0; i < Ly.nin; i++) v += Ly.W[j * Ly.nin + i] * a[s * Ly.nin + i];
        z[s * Ly.nout + j] = v;
      }
      cache.push(z);
      if (!last) { const o = new Float64Array(z.length); for (let k = 0; k < z.length; k++) o[k] = w2Act(net.act, z[k]); a = o; cache.push(o); }
      else a = z;
    });
    return { out: a, cache };
  }
  /* visszaterjesztés: g = dL/d(kimenet); accum: a paraméter-gradiensek gyűjtése; visszaadja dL/d(bemenet) */
  function w2Bwd(net, c, g, accum) {
    const n = g.length;
    let d = g;
    for (let li = net.L.length - 1; li >= 0; li--) {
      const Ly = net.L[li], last = li === net.L.length - 1;
      const z = c.cache[1 + 2 * li], ain = li === 0 ? c.cache[0] : c.cache[2 * li];
      const dz = new Float64Array(n * Ly.nout);
      for (let k = 0; k < dz.length; k++) dz[k] = last ? d[k] : d[k] * w2dAct(net.act, z[k]);
      if (accum) for (let s = 0; s < n; s++) for (let j = 0; j < Ly.nout; j++) {
        const q = dz[s * Ly.nout + j];
        Ly.gb[j] += q;
        for (let i = 0; i < Ly.nin; i++) Ly.gW[j * Ly.nin + i] += q * ain[s * Ly.nin + i];
      }
      const da = new Float64Array(n * Ly.nin);
      for (let s = 0; s < n; s++) for (let i = 0; i < Ly.nin; i++) {
        let v = 0;
        for (let j = 0; j < Ly.nout; j++) v += Ly.W[j * Ly.nin + i] * dz[s * Ly.nout + j];
        da[s * Ly.nin + i] = v;
      }
      d = da;
    }
    return d;
  }
  function w2Zero(net) { net.L.forEach(Ly => { Ly.gW.fill(0); Ly.gb.fill(0); }); }
  function w2Adam(net, lr, b1 = 0.5, b2 = 0.999, eps = 1e-8) {
    net.t++;
    const c1 = 1 - b1 ** net.t, c2 = 1 - b2 ** net.t;
    const up = (p, g, m, v) => { for (let k = 0; k < p.length; k++) { m[k] = b1 * m[k] + (1 - b1) * g[k]; v[k] = b2 * v[k] + (1 - b2) * g[k] * g[k]; p[k] -= lr * (m[k] / c1) / (Math.sqrt(v[k] / c2) + eps); } };
    net.L.forEach(Ly => { up(Ly.W, Ly.gW, Ly.mW, Ly.vW); up(Ly.b, Ly.gb, Ly.mb, Ly.vb); });
  }
  const w2Sp = s => (s > 0 ? s + Math.log1p(Math.exp(-s)) : Math.log1p(Math.exp(s)));   /* softplus(s) = −ln σ(−s) */
  const W2_DATA = {
    one: { name: "egy csúcs", comp: [[1, 2, 0.5]] },
    two: { name: "két csúcs", comp: [[0.5, -2, 0.4], [0.5, 2, 0.4]] },
    three: { name: "három csúcs", comp: [[1 / 3, -3, 0.35], [1 / 3, 0, 0.35], [1 / 3, 3, 0.35]] }
  };
  function w2Real(kind, rnd, n) {
    const C = W2_DATA[kind].comp, x = new Float64Array(n);
    for (let s = 0; s < n; s++) {
      let u = rnd(), k = 0;
      while (k < C.length - 1 && u > C[k][0]) { u -= C[k][0]; k++; }
      x[s] = C[k][1] + C[k][2] * w2Gauss(rnd);
    }
    return x;
  }
  /* GAN-állapot: o = { data, loss: "ns" | "mm", lr, dSteps, act, seed, batch } */
  function w2GanNew(o) {
    const rnd = rng(o.seed);
    const S = Object.assign({ rnd, step: 0, G: w2Net([1, 16, 16, 1], o.act, rnd), D: w2Net([1, 16, 16, 1], o.act, rnd), hist: [] }, o);
    if (o.far) S.G.L[S.G.L.length - 1].b[0] -= 4;      /* a hamisító messziről indul: G(z) − 4 */
    return S;
  }
  /* egy G-lépés (előtte dSteps D-lépés); hist: [D vesztesége, G vesztesége, |dL_G/dx| átlaga] */
  function w2GanStep(S) {
    const n = S.batch, rnd = S.rnd;
    let lD = 0, lG = 0, gx = 0;
    for (let k = 0; k < S.dSteps; k++) {
      const xr = w2Real(S.data, rnd, n), z = new Float64Array(n);
      for (let s = 0; s < n; s++) z[s] = w2Gauss(rnd);
      const xf = w2Fwd(S.G, z).out;
      w2Zero(S.D);
      const cr = w2Fwd(S.D, xr), cf = w2Fwd(S.D, xf);
      const gr = new Float64Array(n), gf = new Float64Array(n);
      lD = 0;
      for (let s = 0; s < n; s++) {
        const a = cr.out[s], b = cf.out[s];
        lD += w2Sp(-a) + w2Sp(b);                       /* −ln D(x) − ln(1 − D(G(z))) */
        gr[s] = -sigm(-a) / n; gf[s] = sigm(b) / n;
      }
      lD /= n;
      w2Bwd(S.D, cr, gr, true); w2Bwd(S.D, cf, gf, true);
      w2Adam(S.D, S.lr * (S.dMul || 1));
    }
    const z = new Float64Array(n);
    for (let s = 0; s < n; s++) z[s] = w2Gauss(rnd);
    const cg = w2Fwd(S.G, z), cd = w2Fwd(S.D, cg.out);
    const g = new Float64Array(n);
    for (let s = 0; s < n; s++) {
      const b = cd.out[s];
      if (S.loss === "ns") { lG += w2Sp(-b); g[s] = -sigm(-b) / n; }   /* −ln D(G(z)) */
      else { lG += -w2Sp(b); g[s] = -sigm(b) / n; }                    /* ln(1 − D(G(z))) */
    }
    lG /= n;
    w2Zero(S.G);
    const dx = w2Bwd(S.D, cd, g, false);
    for (let s = 0; s < n; s++) gx += Math.abs(dx[s]);
    w2Bwd(S.G, cg, dx, true);
    w2Adam(S.G, S.lr);
    S.step++;
    S.hist.push([lD, lG, gx]);
    return [lD, lG, gx];
  }
/*GANCORE-END*/
  const W2_LR = [0.0005, 0.001, 0.002, 0.003, 0.005, 0.01];

  W["gan-1d"] = root => {
    header(root, "Hamisító és detektív egy egyenesen",
      "Egy kis GAN tanul élőben. A generátor (hamisító) egy $z \\sim \\mathcal N(0, 1)$ számból egy $x = G(z)$ számot készít; a diszkriminátor (detektív) " +
      "minden $x$-re megmondja, mennyire hiszi valódinak: $D(x) \\in [0; 1]$. Indítsd el, és figyeld, hogyan húzódik a generált hisztogram a valódira, " +
      "miközben $D(x)$ a 0,5 felé simul. Két csúcsnál próbálj több magot: megtalálja-e mindkettőt?");
    const st = { data: "one", loss: "ns", lrI: 3, dSteps: 2, speed: 5, seed: 1, act: "leaky", far: false };
    let S = null;
    const tgD = toggleGroup(Object.entries(W2_DATA).map(([k, v]) => [k, v.name]), () => st.data, k => { st.data = k; reset(); });
    const tgL = toggleGroup([["ns", "nem telítődő: −ln D(G(z))"], ["mm", "minimax: ln(1 − D(G(z)))"]], () => st.loss, k => { st.loss = k; reset(); });
    const sLr = slider(0, W2_LR.length - 1, 1, st.lrI), oLr = h("b"), sDs = slider(1, 5, 1, st.dSteps), oDs = h("b"), sSp = slider(1, 50, 1, st.speed), oSp = h("b");
    sLr.addEventListener("input", () => { st.lrI = +sLr.value; S.lr = W2_LR[st.lrI]; paintCtl(); });
    sDs.addEventListener("input", () => { st.dSteps = +sDs.value; S.dSteps = st.dSteps; paintCtl(); });
    sSp.addEventListener("input", () => { st.speed = +sSp.value; paintCtl(); });
    const bRun = btn("▶ Indítás", () => { if (anim.running) { anim.stop(); } else anim.start(); paintCtl(); }, "btn primary");
    const bStep = btn("1 lépés", () => { w2GanStep(S); drawAll(); });
    const bReset = btn("Újrakezdés", () => reset());
    const bSeed = btn("Új mag", () => { st.seed++; reset(); });
    const oSeed = h("b");
    const cFar = checkbox(st.far, () => { st.far = cFar.checked; reset(); });
    root.append(h("div", { class: "controls" }, small("valódi adat:"), ...tgD.bs),
      h("div", { class: "controls" }, small("G vesztesége:"), ...tgL.bs),
      h("div", { class: "controls" }, h("label", null, cFar, "a hamisító messziről indul (G kimenete − 4)")),
      h("div", { class: "controls" }, h("label", null, "tanulási ráta:", sLr, oLr), h("label", null, "D lépései G-lépésenként:", sDs, oDs),
        h("label", null, "lépés / képkocka:", sSp, oSp)),
      h("div", { class: "controls" }, bRun, bStep, bReset, bSeed, h("span", { class: "muted", style: "font-size:.92rem" }, "mag: ", oSeed)));
    const box = h("div", { style: "max-width:760px" });
    root.append(box);
    const cv = Calc.canvas(box, flatAspect(root, 0.42, 0.7), 760);
    const cvL = Calc.canvas(box, flatAspect(root, 0.2, 0.36), 760);
    const out = h("div", { class: "readout" });
    root.append(out);

    const ZE = (() => { const r = rng(999); return Float64Array.from({ length: 2000 }, () => w2Gauss(r)); })();
    let real = null, realX = null, gen = null;
    const XMIN = -7, XMAX = 7, NB = 112, BW = (XMAX - XMIN) / NB;
    const hist = x => { const c = new Float64Array(NB); x.forEach(v => { const k = Math.floor((v - XMIN) / BW); if (k >= 0 && k < NB) c[k]++; }); return c.map(v => v / (x.length * BW)); };
    const dens = x => W2_DATA[st.data].comp.reduce((s, [p, m, sd]) => s + p * Math.exp(-((x - m) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)), 0);
    function reset() {
      S = w2GanNew({ data: st.data, loss: st.loss, lr: W2_LR[st.lrI], dSteps: st.dSteps, act: st.act, seed: st.seed, batch: 64, far: st.far });
      realX = w2Real(st.data, rng(777), 4000); real = hist(realX);
      drawAll(); paintCtl();
    }
    function paintCtl() {
      tgD.paint(); tgL.paint();
      oLr.textContent = fmt(W2_LR[st.lrI], 4); oDs.textContent = st.dSteps; oSp.textContent = st.speed; oSeed.textContent = st.seed;
      bRun.textContent = anim && anim.running ? "⏸ Szünet" : "▶ Indítás";
    }
    function drawMain() {
      const { ctx, w, h: hh } = cv;
      const ymax = 1.5 * Math.max(...Array.from({ length: 200 }, (_, i) => dens(XMIN + i * (XMAX - XMIN) / 199)));
      const ml = 6, mr = 30, mt = 22, mb = 20;
      const tx = x => ml + (x - XMIN) / (XMAX - XMIN) * (w - ml - mr), ty = y => hh - mb - y / ymax * (hh - mt - mb);
      const tD = d => hh - mb - d * (hh - mt - mb);
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      /* tengely */
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
      for (let x = XMIN; x <= XMAX; x++) { ctx.moveTo(tx(x), mt); ctx.lineTo(tx(x), hh - mb); }
      ctx.stroke();
      ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(ml, hh - mb); ctx.lineTo(w - mr, hh - mb); ctx.moveTo(w - mr, mt); ctx.lineTo(w - mr, hh - mb); ctx.stroke();
      for (let x = XMIN; x <= XMAX; x++) label(ctx, fmt(x, 0), tx(x), hh - mb + 3, css("--muted"), "center", "11px system-ui, sans-serif", "top");
      [0, 0.5, 1].forEach(d => label(ctx, fmt(d, 1), w - mr + 4, tD(d), css("--accent"), "left", "11px system-ui, sans-serif", "middle"));
      label(ctx, "D(x)", w - 2, mt - 6, css("--accent"), "right", "600 11px system-ui, sans-serif", "bottom");
      /* hisztogramok */
      const bar = (c, col, a) => {
        ctx.fillStyle = rgba(col, a);
        c.forEach((v, k) => { if (v <= 0) return; const y = ty(Math.min(v, ymax)); ctx.fillRect(tx(XMIN + k * BW), y, tx(XMIN + (k + 1) * BW) - tx(XMIN + k * BW) - 0.5, hh - mb - y); });
      };
      bar(real, css("--setA"), 0.38);
      const gh = hist(gen);
      bar(gh, css("--setB"), 0.55);
      /* túlcsorduló oszlop jelzése */
      gh.forEach((v, k) => { if (v > ymax) label(ctx, "▲", tx(XMIN + (k + 0.5) * BW), mt + 2, css("--setB"), "center", "10px system-ui, sans-serif", "top"); });
      /* a képen kívül eső generált minták */
      const lo = gen.filter(v => v < XMIN).length / gen.length, hi = gen.filter(v => v >= XMAX).length / gen.length;
      if (lo >= 0.005) label(ctx, "◀ " + w2Pct(lo), ml + 2, hh - mb - 6, css("--setB"), "left", "700 12px system-ui, sans-serif", "bottom");
      if (hi >= 0.005) label(ctx, w2Pct(hi) + " ▶", w - mr - 2, hh - mb - 6, css("--setB"), "right", "700 12px system-ui, sans-serif", "bottom");
      /* D(x) */
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ml, tD(0.5)); ctx.lineTo(w - mr, tD(0.5)); ctx.stroke(); ctx.restore();
      const xs = Float64Array.from({ length: 201 }, (_, i) => XMIN + i * (XMAX - XMIN) / 200);
      const dv = w2Fwd(S.D, xs).out;
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.4; ctx.beginPath();
      xs.forEach((x, i) => { const y = tD(sigm(dv[i])); i ? ctx.lineTo(tx(x), y) : ctx.moveTo(tx(x), y); });
      ctx.stroke(); ctx.restore();
      /* jelmagyarázat */
      ctx.font = "600 12px system-ui, sans-serif";
      let lx = ml + 4;
      [["valódi", css("--setA"), 0.6], ["generált", css("--setB"), 0.75]].forEach(([t, c, a]) => {
        ctx.fillStyle = rgba(c, a); ctx.fillRect(lx, 6, 12, 10); lx += 16;
        label(ctx, t, lx, 11, css("--text"), "left", "600 12px system-ui, sans-serif", "middle"); lx += ctx.measureText(t).width + 12;
      });
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(lx, 11); ctx.lineTo(lx + 14, 11); ctx.stroke(); ctx.restore();
      label(ctx, "D(x): a detektív tippje", lx + 18, 11, css("--text"), "left", "600 12px system-ui, sans-serif", "middle");
    }
    function drawLoss() {
      const { ctx, w, h: hh } = cvL;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const Hs = S.hist, n = Hs.length, N = Math.max(500, n);
      const ml = 34, mr = 8, mt = 18, mb = 16;
      const mm = st.loss === "mm";
      const y0 = mm ? -2 : 0, y1 = mm ? 2 : 3;
      const tx = i => ml + i / N * (w - ml - mr), ty = y => hh - mb - (clamp(y, y0, y1) - y0) / (y1 - y0) * (hh - mt - mb);
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath();
      for (let y = y0; y <= y1; y++) { ctx.moveTo(ml, ty(y)); ctx.lineTo(w - mr, ty(y)); }
      ctx.stroke();
      for (let y = y0; y <= y1; y++) label(ctx, fmt(y, 0), ml - 4, ty(y), css("--muted"), "right", "11px system-ui, sans-serif", "middle");
      label(ctx, "lépés: " + n, w - mr, hh - 2, css("--muted"), "right", "11px system-ui, sans-serif", "bottom");
      /* egyensúlyi szintek: D: 2 ln 2, G: ln 2 (ns) / −ln 2 (mm) */
      ctx.save(); ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      [[2 * Math.LN2, "--setC"], [mm ? -Math.LN2 : Math.LN2, "--setB"]].forEach(([y, c]) => { ctx.strokeStyle = rgba(css(c), 0.8); ctx.beginPath(); ctx.moveTo(ml, ty(y)); ctx.lineTo(w - mr, ty(y)); ctx.stroke(); });
      ctx.restore();
      [[0, "--setC"], [1, "--setB"]].forEach(([k, c]) => {
        if (!n) return;
        const step = Math.max(1, Math.floor(n / (w - ml - mr)));
        let e = Hs[0][k];
        ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = 1.8; ctx.beginPath();
        for (let i = 0; i < n; i++) { e = 0.95 * e + 0.05 * Hs[i][k]; if (i % step === 0 || i === n - 1) { i ? ctx.lineTo(tx(i), ty(e)) : ctx.moveTo(tx(i), ty(e)); } }
        ctx.stroke(); ctx.restore();
      });
      ctx.font = "600 12px system-ui, sans-serif";
      let lx = ml + 4;
      [["D vesztesége", "--setC"], ["G vesztesége", "--setB"], [w < 520 ? "- - egyensúly" : "szaggatott: egyensúly (D = ½)", "--muted"]].forEach(([t, c]) => {
        label(ctx, t, lx, 10, css(c), "left", "600 12px system-ui, sans-serif", "middle"); lx += ctx.measureText(t).width + 14;
      });
    }
    function readout() {
      const x = gen, n = x.length, m = x.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / n);
      const C = W2_DATA[st.data].comp;
      const rm = C.reduce((s, [p, mu]) => s + p * mu, 0), rsd = Math.sqrt(C.reduce((s, [p, mu, sg]) => s + p * (sg * sg + mu * mu), 0) - rm * rm);
      const last = S.hist.slice(-50), avg = k => (last.length ? last.reduce((s, v) => s + v[k], 0) / last.length : NaN);
      let s = `lépés: <b>${S.step}</b> · generált minták: átlag <b>${w2Fix(m, 2)}</b>, szórás <b>${w2Fix(sd, 2)}</b> ` +
        `<span class="muted">(valódi: ${w2Fix(rm, 2)} és ${w2Fix(rsd, 2)})</span>`;
      if (C.length > 1) {
        const names = C.length === 2 ? ["bal", "jobb"] : ["bal", "középső", "jobb"];
        const fr = C.map(([, mu]) => x.filter(v => Math.abs(v - mu) < 1).length / n);
        s += `<br>a generált minták a ${names.map((nm, i) => `${nm} csúcs (${fmt(C[i][1], 0)}) közelében: <b>${w2Pct(fr[i])}</b>`).join(", ")} <span class="muted">(±1-en belül; valódi: ${w2Pct(C[0][0])} mindegyik)</span>`;
        const miss = names.filter((_, i) => fr[i] < 0.03);
        if (S.step > 0 && miss.length) s += `<br><b style="color:var(--bad)">Módusösszeomlás:</b> a ${miss.join(" és a ")} csúcsot a generátor kihagyja.`;
      }
      const dAvg = xs => { const o = w2Fwd(S.D, xs).out; return o.reduce((a, v) => a + sigm(v), 0) / o.length; };
      s += `<br>a detektív átlagos tippje: D(valódi) ≈ <b>${w2Fix(dAvg(realX), 2)}</b>, D(generált) ≈ <b>${w2Fix(dAvg(x), 3)}</b> <span class="muted">(egyensúlyban mindkettő 0,5)</span>`;
      if (S.step > 0) s += `<br><span class="muted">az utolsó 50 lépés átlaga: D vesztesége ${w2Fix(avg(0), 3)} (egyensúly: 2 ln 2 ≈ 1,386), ` +
        `a G-nek jutó gradiens |∂L_G/∂x| ≈ ${w2Sci(avg(2))}</span>`;
      out.innerHTML = s;
    }
    function drawAll() {
      gen = w2Fwd(S.G, ZE).out;
      cv.draw = drawMain; cvL.draw = drawLoss;
      drawMain(); drawLoss(); readout();
    }
    const anim = w2Anim(root, () => { for (let k = 0; k < st.speed; k++) w2GanStep(S); drawAll(); });
    reset();
  };

  /* ==================================================================
     14.5-c  gan-epochs – egy GAN tanulása a számjegyeken
     ================================================================== */
  W["gan-epochs"] = root => {
    header(root, "Egy GAN tanulása a számjegyeken",
      "Egy kis (teljesen összekötött) GAN a 8 × 8-as számjegyeken. Mindig ugyanazt a 16 zajvektort adjuk a generátornak – húzd a csúszkát, és nézd, hogyan lesz a zajból számjegy – és mikor lesz a 16 képből 16 különböző.");
    const G = w2Data();
    if (!G || !G.ganEpochs) return w2NoData(root);
    const keys = Object.keys(G.ganEpochs).map(Number).sort((a, b) => a - b);
    let k = 0;
    const divReal = G.compare ? w2Div(G.compare[0].samples.slice(0, 16)) : NaN;
    const s = slider(0, keys.length - 1, 1, k), o = h("b");
    s.addEventListener("input", () => { k = +s.value; draw(); });
    root.append(h("div", { class: "controls" }, h("label", null, "epoch:", s, o),
      btn("◀", () => { k = Math.max(0, k - 1); s.value = k; draw(); }), btn("▶", () => { k = Math.min(keys.length - 1, k + 1); s.value = k; draw(); })));
    const box = h("div", { style: "max-width:340px" });
    root.append(box);
    const cv = Calc.canvas(box, 1, 340);
    const out = h("div", { class: "readout" });
    root.append(out);
    function draw() {
      o.textContent = keys[k];
      cv.draw = () => {
        const { ctx, w, h: hh } = cv;
        ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
        const g = 4, c = (Math.min(w, hh) - 3 * g - 2) / 4;
        w2Grid(ctx, G.ganEpochs[keys[k]], 4, 1, 1, c, g);
      };
      cv.draw();
      const e = keys[k], dv = w2Div(G.ganEpochs[e]);
      out.innerHTML = `ugyanaz a 16 zajvektor, <b>${e}</b> epoch után · a 16 kép átlagos páronkénti távolsága: <b>${w2Fix(dv, 1)}</b> ` +
        `<span class="muted">(16 valódi tesztképnél ${w2Fix(divReal, 1)})</span>` +
        `<br><span class="muted">${e <= 1 ? "Szürke zaj: a generátor még semmit sem tanult." :
          e <= 50 ? "Kirajzolódik egy alak – de a 16 különböző zajvektorból szinte ugyanaz a kép lesz: ez a módusösszeomlás. A detektív egy ideig elfogadja, aztán megtanulja leleplezni." :
            e <= 100 ? "A képek elkezdenek különbözni: a generátor kitör az egyetlen módusból." :
              "A képek többsége felismerhető, különböző számjegy; egy-egy zajvektor képe később is átalakul (a tanítás nem áll meg egy nyugalmi pontban)."}</span>`;
    }
    draw();
  };

  /* ==================================================================
     14.9-a/b  gen-compare – hét forrás, egy füzet
     ================================================================== */
  W["gen-compare"] = root => {
    header(root, "Hét forrás, egy füzet",
      "Hét „rajzoló” 450-450 számjegyképe ugyanazokkal a mérőszámokkal. Válassz forrást, és kattints egy mintára: mellette a hozzá legközelebbi tanítókép. " +
      "A táblázat soraira is kattinthatsz. A „Melyik az igazi?” játékban tippeld meg, melyik rács valódi!");
    const G = w2Data();
    if (!G || !G.compare) return w2NoData(root);
    const CM = G.compare;
    let sel = CM.findIndex(c => c.name === "GAN"), pick = 0, game = false;
    if (sel < 0) sel = 0;
    const tg = toggleGroup(CM.map((c, i) => [i, c.name]), () => sel, i => { sel = +i; pick = 0; draw(); });
    const bGame = btn("Melyik az igazi?", () => { game = !game; if (game) newRound(); draw(); });
    root.append(h("div", { class: "controls" }, ...tg.bs), h("div", { class: "controls" }, bGame));
    /* böngésző-nézet */
    const view = h("div");
    const [cvG, cvN, , Rn] = twoCanvas(view, 0.66, 0.56);
    const outN = h("div", { class: "readout" });
    Rn.append(outN);
    /* táblázat */
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.8rem" });
    view.append(tw);
    root.append(view);
    /* játék-nézet */
    const gv = h("div", { style: "display:none" });
    const gGrid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.7rem;margin-top:.4rem" });
    const gOut = h("div", { class: "readout" });
    let round = 0, score = 0, played = 0, cand = [], guessed = -1;
    const cCopy = checkbox(false, () => { newRound(); drawGame(); });
    gv.append(h("div", { class: "controls" }, btn("Új kör", () => { newRound(); drawGame(); }),
      h("label", null, cCopy, "a „másoló” is játszhat")), gGrid, gOut);
    root.append(gv);
    const gCv = [], gCap = [];
    for (let j = 0; j < 4; j++) {
      const cell = h("div", { style: "min-width:0;cursor:pointer" });
      gGrid.append(cell);
      const c = Calc.canvas(cell, 1, 220);
      c.c.style.cursor = "pointer"; c.c.style.touchAction = "manipulation";
      const cap = h("div", { style: "text-align:center;font-size:.9rem;margin-top:.2rem;min-height:1.3em" });
      cell.append(cap);
      c.c.addEventListener("click", () => guess(j));
      gCv.push(c); gCap.push(cap);
    }
    function newRound() {
      round++; guessed = -1;
      const r = rng(4242 + round);
      const pool = CM.map((c, i) => i).filter(i => i !== 0 && (cCopy.checked || CM[i].name !== "másoló"));
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const ids = [0, ...pool.slice(0, 3)];
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      cand = ids.map(i => {
        const idx = Array.from({ length: 40 }, (_, k) => k);
        for (let a = 39; a > 0; a--) { const b = Math.floor(r() * (a + 1)); [idx[a], idx[b]] = [idx[b], idx[a]]; }
        return { i, imgs: idx.slice(0, 16).map(k => CM[i].samples[k]) };
      });
    }
    function guess(j) {
      if (guessed >= 0 || !cand.length) return;
      guessed = j; played++;
      if (cand[j].i === 0) score++;
      drawGame();
    }
    function drawGame() {
      cand.forEach((cd, j) => {
        const c = gCv[j];
        c.draw = () => {
          const { ctx, w, h: hh } = c;
          ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
          const g = 3, s = (Math.min(w, hh) - 3 * g - 6) / 4;
          const rev = guessed >= 0, ok = cd.i === 0;
          w2Grid(ctx, cd.imgs, 4, 3, 3, s, g);
          if (rev && (ok || j === guessed)) {
            ctx.save(); ctx.strokeStyle = css(ok ? "--setC" : "--bad"); ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, w - 3, hh - 3); ctx.restore();
          }
        };
        c.draw();
        gCap[j].innerHTML = guessed >= 0 ? (cd.i === 0 ? `<b style="color:var(--setC)">✔ ${CM[0].name}</b>` : `<span class="${j === guessed ? "" : "muted"}">${CM[cd.i].name}</span>`) : `${j + 1}. rács`;
      });
      gOut.innerHTML = guessed < 0 ? "Kattints arra a rácsra, amelyik szerinted valódi tesztképekből áll!" :
        (cand[guessed].i === 0 ? "<b>Eltaláltad!</b> " : `Nem ez volt – ez a(z) <b>${CM[cand[guessed].i].name}</b> modell mintája. `) +
        `Pontszám: <b>${score} / ${played}</b>. <span class="muted">Mi árulta el a modelleket? Homály (VAE), zajos szélek (Gauss, GAN), csak fekete-fehér pixel (autoregresszív).</span>`;
    }
    const isCopy = d => d < 1e-9;
    function drawBrowse() {
      const C = CM[sel];
      const layout = () => { const g = 3, s = Math.min((cvG.w - 7 * g - 2) / 8, (cvG.h - 4 * g - 2) / 5); return { g, s }; };
      cvG.draw = () => {
        const { ctx, w, h: hh } = cvG;
        ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
        const { g, s } = layout();
        C.samples.forEach((v, i) => {
          const x = 1 + (i % 8) * (s + g), y = 1 + Math.floor(i / 8) * (s + g);
          drawDigit(ctx, x, y, s, v, i === pick ? { frameVar: "--accent", frameW: 3 } : (isCopy(C.nnDist[i]) ? { frameVar: "--bad", frameW: 2 } : {}));
        });
      };
      cvG.c.onclick = e => {
        const [px, py] = evXY(cvG, e), { g, s } = layout();
        const c = Math.floor((px - 1) / (s + g)), r = Math.floor((py - 1) / (s + g));
        if (c >= 0 && c < 8 && r >= 0 && r < 5) { pick = r * 8 + c; drawBrowse(); }
      };
      cvG.c.style.cursor = "pointer"; cvG.c.style.touchAction = "manipulation";
      cvN.draw = () => {
        const { ctx, w, h: hh } = cvN;
        ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
        const s = Math.min((w - 24) / 2, hh - 24);
        label(ctx, "a minta", 4, 15, css("--muted"), "left", "600 12px system-ui, sans-serif");
        label(ctx, "legközelebbi tanítókép", w / 2 + 4, 15, css("--muted"), "left", "600 12px system-ui, sans-serif");
        drawDigit(ctx, 4, 20, s, C.samples[pick], { frameVar: "--accent", frameW: 2 });
        drawDigit(ctx, w / 2 + 4, 20, s, C.nn[pick], { frameVar: isCopy(C.nnDist[pick]) ? "--bad" : "--border", frameW: 2 });
      };
      cvG.draw(); cvN.draw();
      const d = C.nnDist[pick];
      outN.innerHTML = `${pick + 1}. minta · távolság a legközelebbi tanítóképtől: <b>${w2Fix(d, 1)}</b>` +
        (isCopy(d) ? ` – <b style="color:var(--bad)">pontos másolat!</b>` : "") +
        `<br><span class="muted">(euklideszi távolság a 64 pixelen, 0–16-os skálán; a valódi tesztképeknél a legközelebbi tanítókép medián távolsága ${w2Fix(CM[0].nnMed, 1)})</span>`;
    }
    function drawTable() {
      const mxH = C => Math.max(...C.hist);
      const th = (t, tip) => h("th", { style: "padding:.25rem .45rem;text-align:center;font-size:.82rem;vertical-align:bottom", title: tip || "" }, t);
      const rows = CM.map((C, i) => {
        const bars = h("div", { style: "display:flex;align-items:flex-end;gap:1px;height:22px;width:72px;margin:auto" },
          C.hist.map((v, k) => h("div", { title: `${k}: ${v}`, style: `flex:1;height:${Math.max(1, Math.round(22 * v / mxH(C)))}px;background:${DIGIT_COLORS[k]}` })));
        const td = (t, st = "") => h("td", { style: "padding:.25rem .45rem;text-align:center;white-space:nowrap;" + st }, t);
        const tr = h("tr", { style: `cursor:pointer;${i === sel ? "background:var(--accent-soft);font-weight:600" : ""}`, onclick: () => { sel = i; pick = 0; draw(); } },
          td(C.name + (C.binary ? " *" : ""), "text-align:left"),
          td(w2Fix(Math.abs(C.fid) < 0.05 ? 0 : C.fid, 1)), td(w2Pct(C.sure, 0)), td(w2Fix(C.prec, 2)), td(w2Fix(C.rec, 2)),
          td(w2Fix(C.nnMed, 1)), td(String(C.copies), C.copies ? "color:var(--bad);font-weight:700" : ""), h("td", { style: "padding:.25rem .45rem" }, bars));
        return tr;
      });
      tw.replaceChildren(h("table", { style: "font-size:.88rem;border-collapse:collapse;min-width:600px;width:100%" },
        h("tr", { style: "border-bottom:1px solid var(--border)" }, th("forrás"), th("FID ↓", "Fréchet-távolság: kisebb a jobb"), th("biztosan felismert ↑", "az osztályozó 90% felett biztos"),
          th("pontosság ↑", "precision: a minták hány %-a esik a valódi képek közé"), th("felidézés ↑", "recall: a valódi képek hány %-át fedik le a minták"),
          th("legközelebbi tanítókép (medián)"), th("másolatok"), th("osztályok (0–9)")), ...rows),
        h("p", { class: "muted", style: "font-size:.85rem;margin:.4rem 0 0" },
          "* autoregresszív: fekete-fehér képek – a mérőszámok fekete-fehér referenciához mérve, a többivel csak óvatosan vethető össze. " +
          "Pontosság és felidézés: 0–1. A másolat: a minta pixelre pontosan egy tanítókép."));
    }
    function draw() {
      tg.paint();
      bGame.classList.toggle("on", game);
      bGame.textContent = game ? "← Vissza a böngészéshez" : "Melyik az igazi?";
      view.style.display = game ? "none" : ""; gv.style.display = game ? "" : "none";
      tg.bs.forEach(b => setDis(b, game));
      if (game) { gCv.forEach(c => c.resize()); drawGame(); }
      else { cvG.resize(); cvN.resize(); drawBrowse(); drawTable(); }
    }
    draw();
  };
