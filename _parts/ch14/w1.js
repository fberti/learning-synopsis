
  /* ==================================================================
     w1 – 14.1-b/14.2-b rajzológép (2 × 2) · 14.2-c pixelenként rajzoló gép ·
          14.3-b szűk keresztmetszet · 14.4-b a KL ára
     ================================================================== */
  const w1Font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  const w1OnTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  /* canvas, amelynek magassága a szélességtől függ; HiDPI, téma- és méretváltáskor újrarajzol (a draw maga hívja a resize-t) */
  function w1Canvas(parent, heightOf, maxW = 760) {
    const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
    parent.append(c);
    const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    o.resize = () => {
      const w = Math.max(60, Math.min(maxW, parent.clientWidth || maxW)), hh = Math.max(40, Math.round(heightOf(w)));
      const dpr = window.devicePixelRatio || 1;
      if (o.w !== w || o.h !== hh || c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
        c.style.width = w + "px"; c.style.height = hh + "px";
      }
      o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.w = w; o.h = hh;
    };
    o.resize();
    let t;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => o.draw && o.draw(), 160); });
    w1OnTheme(() => o.draw && o.draw());
    return o;
  }
  /* rögzített tizedesjegyek, „felfelé kerekítve a felénél” (a 4 tizedesre kerekített adatoknál: 0,0225 → 0,023) */
  const w1Fix = (x, d = 3) => {
    const m = Math.pow(10, d), r = Math.round(x * m + Math.sign(x) * 1e-6) / m;
    return (Math.abs(r) < 0.5 / m ? 0 : r).toFixed(d).replace("-", "−").replace(".", ",");
  };
  /* a widget láthatósága (animáció leállításához) */
  function w1Visible(root, cb) {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { threshold: 0.05 }).observe(root);
  }
  /* „papír” és „tinta” a fekete-fehér képekhez: mindkét témában világos papír, sötét tinta (a --card és a --text közül) */
  function w1Paper() {
    const c = hexRGB(css("--card")), t = hexRGB(css("--text")), lum = v => 0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2];
    return lum(c) >= lum(t) ? [c, t] : [t, c];
  }
  const w1RGB = v => `rgb(${v.join(",")})`;
  /* 2 × 2-es ikon: v = "1100" kód vagy négy 0…1 érték (1 = fekete) */
  function w1Icon(ctx, x, y, s, v, opts = {}) {
    const vals = typeof v === "string" ? [...v].map(Number) : v, c = s / 2;
    const [bg, fg] = w1Paper();
    vals.forEach((t, i) => {
      t = clamp(t, 0, 1);
      ctx.fillStyle = `rgb(${bg.map((b, k) => Math.round(b + (fg[k] - b) * t)).join(",")})`;
      ctx.fillRect(x + (i % 2) * c, y + Math.floor(i / 2) * c, Math.ceil(c), Math.ceil(c));
    });
    ctx.save();
    ctx.strokeStyle = css(opts.frame || "--muted"); ctx.lineWidth = opts.lw || 1;
    ctx.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
    if (opts.grid !== false) {
      ctx.strokeStyle = rgba(css("--muted"), 0.45); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + c, y + 1); ctx.lineTo(x + c, y + s - 1); ctx.moveTo(x + 1, y + c); ctx.lineTo(x + s - 1, y + c); ctx.stroke();
    }
    ctx.restore();
  }
  /* a fejezet futó példája */
  const W1_SEEN = ["1100", "0011", "1010", "0101", "1001"];
  const W1_CNT = { "1100": 3, "0011": 2, "1010": 2, "0101": 2, "1001": 1 };
  const W1_ALL = Array.from({ length: 16 }, (_, i) => i.toString(2).padStart(4, "0"));
  const W1_ORDER = [...W1_SEEN, ...W1_ALL.filter(c => !W1_SEEN.includes(c))];
  const W1_DATA = W1_SEEN.flatMap(c => Array(W1_CNT[c]).fill(c));
  const W1_PIX = ["bal fent", "jobb fent", "bal lent", "jobb lent"];
  const w1Prod = (code, pix) => {
    const x = [...code].map(Number);
    let p = 1;
    for (let i = 0; i < 4; i++) { const q = pix(i, x); p *= x[i] ? q : 1 - q; }
    return p;
  };
  const W1_MODELS = {
    table: { kind: "strip", params: 15, name: "táblázat", prob: c => (W1_CNT[c] || 0) / 10 },
    indep: { kind: "coins", params: 4, name: "független pixelek", pix: i => [0.6, 0.5, 0.4, 0.5][i] },
    markov: {
      kind: "coins", params: 7, name: "Markov",
      pix: (i, x) => (i === 0 ? 0.6 : i === 1 ? 0.5 : i === 2 ? (x[1] ? 0 : 0.8) : 0.5),
      cond: (i, x) => (i === 0 ? "" : ` | ${W1_PIX[i - 1]} ${x[i - 1] ? "fekete" : "fehér"}`)
    },
    laplace: { kind: "strip", params: 15, name: "Laplace-simított", prob: c => ((W1_CNT[c] || 0) + 1) / 26 }
  };
  Object.values(W1_MODELS).forEach(M => {
    if (!M.prob) M.prob = c => w1Prod(c, M.pix);
    M.nll = -W1_DATA.reduce((s, c) => s + Math.log2(M.prob(c)), 0) / W1_DATA.length;
    M.support = W1_ALL.filter(c => M.prob(c) > 1e-12).length;
  });

  /* ------------------------------------------------------------------
     sample-machine – rajzológép a 2 × 2-es világban (14.1-b, 14.2-b)
     ------------------------------------------------------------------ */
  W["sample-machine"] = root => {
    header(root, "Rajzológép a 2 × 2-es világban",
      "Válassz modellt, és húzz mintákat! Az oszlopok a 16 kép valószínűségei a modellben, mellettük a húzott minták gyakorisága. " +
      "Keretben a tíz gyerekrajzban szereplő öt kép (alattuk: hányan rajzolták).");
    let model = "table", seed = 1, rnd = rng(seed), counts = new Array(16).fill(0), N = 0, last = null;
    const M = () => W1_MODELS[model];
    const tg = toggleGroup([["table", "táblázat"], ["indep", "független pixelek"], ["markov", "Markov"], ["laplace", "Laplace-simított"]],
      () => model, k => { model = k; reset(); });
    root.append(h("div", { class: "controls" }, small("modell:"), tg.bs));
    const cvWrap = h("div", { style: "min-width:0" });
    root.append(cvWrap);
    const cv = w1Canvas(cvWrap, w => clamp(w * 0.36, 210, 280));
    const legend = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" });
    root.append(legend);

    const pLeft = h("div", { style: "flex:1 1 280px;min-width:0" }), pRight = h("div", { style: "flex:0 0 96px;text-align:center" });
    root.append(h("div", { style: "display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;margin-top:.7rem;padding:.5rem .7rem;border:1px solid var(--border);border-radius:10px" }, pLeft, pRight));
    const stripWrap = h("div", { style: "min-width:0" }), coinBox = h("div", { class: "tw", style: "overflow-x:auto" });
    const lastTxt = h("div", { style: "font-size:.9rem;margin-top:.25rem" });
    pLeft.append(stripWrap, coinBox, lastTxt);
    const cvS = w1Canvas(stripWrap, () => 62, 640);
    const resWrap = h("div", { style: "width:96px" }), resCap = h("div", { class: "muted", style: "font-size:.8rem" });
    pRight.append(resWrap, resCap);
    const cvR = w1Canvas(resWrap, () => 76, 96);

    const b1 = btn("1 minta", () => { last = sampleOne(); add(last.code); draw(); }, "btn primary");
    const b100 = btn("100 minta", () => { for (let i = 0; i < 100; i++) { last = sampleOne(); add(last.code); } draw(); });
    const b1000 = btn("1000 minta", () => { for (let i = 0; i < 1000; i++) { last = sampleOne(); add(last.code); } draw(); });
    const seedTxt = small("");
    root.append(h("div", { class: "controls" }, b1, b100, b1000,
      btn("Törlés", () => reset()), btn("Új mag", () => { seed++; reset(); }), seedTxt));
    const stats = h("div", { class: "stat-row" });
    root.append(stats);

    function reset() { rnd = rng(seed); counts.fill(0); N = 0; last = null; draw(); }
    function add(code) { counts[W1_ORDER.indexOf(code)]++; N++; }
    function sampleOne() {
      const m = M();
      if (m.kind === "strip") {
        const u = rnd();
        let acc = 0, code = W1_ORDER[W1_ORDER.length - 1];
        for (const c of W1_ORDER) { const p = m.prob(c); if (p > 0 && u < acc + p) { code = c; break; } acc += p; }
        return { code, u };
      }
      const x = [], us = [], ps = [], conds = [];
      for (let i = 0; i < 4; i++) {
        const p = m.pix(i, x), u = rnd();
        conds.push(m.cond ? m.cond(i, x) : "");
        ps.push(p); us.push(u); x.push(u < p ? 1 : 0);
      }
      return { code: x.join(""), us, ps, conds };
    }

    function drawBars() {
      cv.resize();
      const { ctx, w, h: H } = cv, m = M();
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const L = 32, R = 4, top = 14, gw = (w - L - R) / 16, s = clamp(Math.floor(gw - 6), 10, 24);
      const bottom = H - (s + 34), ph = bottom - top;
      const P = W1_ORDER.map(c => m.prob(c)), F = counts.map(c => (N ? c / N : 0));
      const ymax = Math.max(0.35, ...F.map(f => f * 1.05));
      const ty = v => bottom - (v / ymax) * ph;
      const step = ymax > 0.7 ? 0.2 : 0.1;
      ctx.font = w1Font(10, 400); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let v = 0; v <= ymax + 1e-9; v += step) {
        ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, ty(v) + 0.5); ctx.lineTo(w - R, ty(v) + 0.5); ctx.stroke();
        ctx.fillStyle = css("--muted"); ctx.fillText(fmt(v, 1), L - 4, ty(v));
      }
      /* elválasztó a látott és a nem látott képek között */
      const xs = L + 5 * gw;
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(xs, top - 6); ctx.lineTo(xs, H - 4); ctx.stroke(); ctx.restore();
      label(ctx, "a 10 rajzban", L + 2, top - 2, css("--muted"), "left", w1Font(10, 600));
      label(ctx, "egyik gyerek sem rajzolta", xs + 4, top - 2, css("--muted"), "left", w1Font(10, 600));
      const cA = css("--setA"), cB = css("--setB"), bw = Math.max(2, (gw - 4) / 2 - 0.5);
      W1_ORDER.forEach((c, k) => {
        const x0 = L + k * gw + 2;
        if (P[k] > 0) { ctx.fillStyle = cA; ctx.fillRect(x0, ty(P[k]), bw, bottom - ty(P[k])); }
        if (N) { ctx.fillStyle = cB; ctx.fillRect(x0 + bw + 1, ty(F[k]), bw, bottom - ty(F[k])); }
        if (P[k] === 0) label(ctx, "0", x0 + bw / 2, bottom - 2, css("--muted"), "center", w1Font(9, 600));
        if (gw >= 40 && P[k] > 0) label(ctx, fmt(P[k], 2), x0 + bw / 2, ty(P[k]) - 2, css("--muted"), "center", w1Font(9, 600));
        const ix = L + k * gw + (gw - s) / 2, iy = bottom + 6, seen = k < 5, isLast = last && last.code === c;
        w1Icon(ctx, ix, iy, s, c, { frame: seen ? "--accent" : "--muted", lw: seen ? 2 : 1 });
        if (seen) label(ctx, "×" + W1_CNT[c], ix + s / 2, iy + s + 13, css("--accent"), "center", w1Font(10, 700));
        if (isLast) {
          ctx.save(); ctx.fillStyle = css("--bad");
          const ax = ix + s / 2, ay = iy + s + (seen ? 16 : 4);
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 5, ay + 8); ctx.lineTo(ax + 5, ay + 8); ctx.closePath(); ctx.fill(); ctx.restore();
        }
      });
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(L, bottom + 0.5); ctx.lineTo(w - R, bottom + 0.5); ctx.stroke();
    }

    function drawStrip() {
      const m = M();
      stripWrap.style.display = m.kind === "strip" ? "" : "none";
      coinBox.style.display = m.kind === "coins" ? "" : "none";
      if (m.kind !== "strip") return;
      cvS.resize();
      const { ctx, w, h: H } = cvS, L = 8, R = 8, y0 = 18, bh = 24, tx = u => L + u * (w - L - R);
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      let acc = 0;
      const ticks = [0];
      W1_ORDER.forEach((c, k) => {
        const p = m.prob(c);
        if (p <= 0) return;
        const a = tx(acc), b = tx(acc + p);
        ctx.fillStyle = mix(k < 5 ? "--setA" : "--muted", k % 2 ? 0.22 : 0.42);
        ctx.fillRect(a, y0, b - a, bh);
        ctx.strokeStyle = css("--card"); ctx.lineWidth = 1; ctx.strokeRect(a + 0.5, y0 + 0.5, b - a - 1, bh - 1);
        const s = Math.min(bh - 6, b - a - 6);
        if (s >= 9) w1Icon(ctx, (a + b) / 2 - s / 2, y0 + (bh - s) / 2, s, c, { grid: false });
        acc += p; ticks.push(acc);
      });
      ctx.font = w1Font(10, 400); ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      const tk = model === "table" ? ticks : [0, 0.5, 1];
      tk.forEach(u => {
        ctx.fillRect(tx(u) - 0.5, y0 + bh, 1, 4);
        ctx.fillText(fmt(u, 2), clamp(tx(u), 10, w - 10), y0 + bh + 5);
      });
      if (last && last.u != null) {
        const x = tx(last.u);
        ctx.save(); ctx.fillStyle = css("--bad"); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y0 - 1); ctx.lineTo(x - 5, y0 - 9); ctx.lineTo(x + 5, y0 - 9); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + bh); ctx.stroke(); ctx.restore();
        label(ctx, "u = " + w1Fix(last.u, 2), clamp(x + 8, 30, w - 40), y0 - 4, css("--bad"), x > w - 70 ? "right" : "left", w1Font(11, 700));
      } else label(ctx, "a [0; 1) szakasz felosztása", L, y0 - 4, css("--muted"), "left", w1Font(11, 600));
    }

    function drawCoins() {
      const m = M();
      if (m.kind !== "coins") return;
      const head = `<tr><th>pixel</th><th>p(fekete${model === "markov" ? " | előző" : ""})</th><th>u</th><th>u &lt; p?</th></tr>`;
      const rows = [0, 1, 2, 3].map(i => {
        if (!last || !last.us) return `<tr><td>${i + 1}. ${W1_PIX[i]}</td><td>${model === "indep" ? fmt(m.pix(i), 1) : "?"}</td><td>–</td><td>–</td></tr>`;
        const p = last.ps[i], u = last.us[i], b = u < p;
        return `<tr><td>${i + 1}. ${W1_PIX[i]}</td><td>${fmt(p, 1)}${last.conds[i] ? `<span class="muted" style="font-size:.8rem"> (${last.conds[i].slice(3)})</span>` : ""}</td>` +
          `<td>${w1Fix(u, 2)}</td><td><b>${b ? "igen → fekete" : "nem → fehér"}</b></td></tr>`;
      }).join("");
      coinBox.innerHTML = `<table class="pix-table" style="font-size:.85rem;font-family:inherit">${head}${rows}</table>`;
    }

    function drawRes() {
      cvR.resize();
      const { ctx, w, h: H } = cvR;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const s = 64, x = (w - s) / 2;
      if (last) w1Icon(ctx, x, 4, s, last.code, { frame: W1_SEEN.includes(last.code) ? "--accent" : "--bad", lw: 2 });
      else { ctx.save(); ctx.strokeStyle = css("--border"); ctx.setLineDash([4, 3]); ctx.strokeRect(x + 0.5, 4.5, s - 1, s - 1); ctx.restore(); label(ctx, "?", w / 2, 4 + s / 2, css("--muted"), "center", w1Font(22, 700), "middle"); }
      resCap.innerHTML = last ? `<code>${last.code}</code><br>${W1_SEEN.includes(last.code) ? "látott kép" : "<b>új kép!</b>"}` : "a minta";
    }

    function draw() {
      tg.paint();
      const m = M();
      drawBars(); drawStrip(); drawCoins(); drawRes();
      legend.innerHTML = `<span style="color:var(--setA)">■</span> a modell valószínűsége &nbsp; <span style="color:var(--setB)">■</span> a húzott minták gyakorisága` +
        (N ? ` (${N} minta)` : "") + ` &nbsp; <span style="color:var(--bad)">▲</span> az utolsó minta`;
      if (!last) lastTxt.innerHTML = m.kind === "strip"
        ? "Egyetlen egyenletes <i>u</i> dönt: azt a képet kapod, amelyiknek a szakaszába esik."
        : (model === "indep" ? "Pixelenként külön pénzfeldobás: a pixel fekete, ha <i>u</i> &lt; <i>p</i>."
          : "Pixelenként pénzfeldobás, de a <i>p</i> az előző pixeltől függ: a pixel fekete, ha <i>u</i> &lt; <i>p</i>.");
      else if (m.kind === "strip") {
        let acc = 0, a = 0;
        for (const c of W1_ORDER) { const p = m.prob(c); if (c === last.code) { a = acc; break; } acc += p; }
        lastTxt.innerHTML = `<i>u</i> = ${w1Fix(last.u, 3)} a [${fmt(a, 3)}; ${fmt(a + m.prob(last.code), 3)}) szakaszba esik → <code>${last.code}</code>`;
      } else lastTxt.innerHTML = `A négy döntés együtt: <code>${last.code}</code>, valószínűsége a modellben ${fmt(m.prob(last.code), 3)}.`;
      seedTxt.textContent = "mag: " + seed;
      const fresh = W1_ORDER.slice(5).reduce((s, c, k) => s + counts[k + 5], 0), freshKinds = counts.slice(5).filter(c => c > 0).length;
      const st = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        st(fmt(m.nll, 2) + " bit", "NLL a 10 rajzon"),
        st(String(m.params), "paraméter"),
        st(m.support + " / 16", "rajzolható kép"),
        st(N ? `${fresh} (${pct(fresh / N, 1)})` : "–", N ? `új kép a ${N} mintában · ${freshKinds} féle` : "új kép a mintákban"));
    }
    cv.draw = draw; cvS.draw = draw; cvR.draw = draw;
    draw();
  };

  /* ------------------------------------------------------------------
     pixel-ar – pixelenként rajzoló gép (14.2-c), GEN14.ar
     ------------------------------------------------------------------ */
  const w1ArZ = (x, i) => { const A = GEN14.ar, Wi = A.W[i]; let z = A.b[i]; for (let j = 0; j < i; j++) if (x[j] === 1) z += Wi[j]; return z; };
  const w1ArP = (x, i, T) => sigm(w1ArZ(x, i) / T);
  /* a kép meglepetése (bit) az eredeti (T = 1) modellben, a láncszabály szerint, az első n pixelen */
  function w1ArBits(x, n = 64) {
    let s = 0;
    for (let i = 0; i < n; i++) { const p = clamp(w1ArP(x, i, 1), 1e-12, 1 - 1e-12); s -= Math.log2(x[i] === 1 ? p : 1 - p); }
    return s;
  }
  function w1ArComplete(x0, keep, T, rnd) {
    const x = x0.slice();
    for (let i = keep * 8; i < 64; i++) x[i] = rnd() < w1ArP(x, i, T) ? 1 : 0;
    return x;
  }
  /* bináris 8 × 8-as kép: 1 = fekete, 0 = fehér, −1 = még üres */
  function w1Bin(ctx, x0, y0, S, x, opts = {}) {
    const c = S / 8, [pp, ii] = w1Paper(), P = w1RGB(pp), I = w1RGB(ii), E = css("--bg-soft");
    for (let i = 0; i < 64; i++) {
      const v = x[i], px = x0 + (i % 8) * c, py = y0 + Math.floor(i / 8) * c;
      ctx.fillStyle = v === 1 ? I : v === 0 ? P : E;
      ctx.fillRect(px, py, Math.ceil(c), Math.ceil(c));
    }
    if (opts.grid) {
      ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.28); ctx.lineWidth = 1; ctx.beginPath();
      for (let k = 1; k < 8; k++) { ctx.moveTo(x0 + k * c + 0.5, y0); ctx.lineTo(x0 + k * c + 0.5, y0 + S); ctx.moveTo(x0, y0 + k * c + 0.5); ctx.lineTo(x0 + S, y0 + k * c + 0.5); }
      ctx.stroke(); ctx.restore();
    }
    if (opts.keep != null && opts.keep > 0 && opts.keep < 8) {
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(x0 - 3, y0 + opts.keep * c); ctx.lineTo(x0 + S + 3, y0 + opts.keep * c); ctx.stroke(); ctx.restore();
    }
    ctx.save(); ctx.strokeStyle = css(opts.frame || "--border"); ctx.lineWidth = opts.lw || 1;
    ctx.strokeRect(x0 + 0.5, y0 + 0.5, S - 1, S - 1); ctx.restore();
  }

  W["pixel-ar"] = root => {
    const A = GEN14.ar;
    header(root, "Pixelenként rajzoló gép",
      "Egy logisztikus autoregresszív modell 8 × 8-as fekete-fehér számjegyeken: minden pixelnél σ(z/T) adja a fekete valószínűségét, " +
      "ahol z a már megrajzolt pixelekből jön (soronként, balról jobbra).");
    let mode = "draw", T = 1, speed = 12, seed = 1, nDraw = 0, running = false, visible = true, raf = 0, lastTs = 0, accT = 0;
    let cur = null;           /* { x, u, i } */
    let sel = 0, keep = 4, inp = A.test[0].slice(), compSeed = 1;
    const tg = toggleGroup([["draw", "Rajzolás"], ["complete", "Kiegészítés"]], () => mode, k => { mode = k; stop(); layout(); draw(); });
    root.append(h("div", { class: "controls" }, tg.bs));

    const sT = slider(0.25, 2, 0.05, 1), tLab = h("b", null, "1");
    sT.oninput = () => { T = +sT.value; tLab.textContent = fmt(T, 2); draw(); };
    const sV = slider(1, 64, 1, speed), vLab = h("b", null, String(speed));
    sV.oninput = () => { speed = +sV.value; vLab.textContent = String(speed); };
    const bGo = btn("▶ Rajzolj!", () => { newImage(); start(); }, "btn primary");
    const bPause = btn("⏸ Szünet", () => { if (running) stop(); else if (cur && cur.i < 64) start(); draw(); });
    const bStep = btn("1 pixel", () => { stop(); if (!cur || cur.i >= 64) newImage(); stepPix(); draw(); });
    const bDone = btn("Kész", () => { stop(); if (!cur) newImage(); while (cur.i < 64) stepPix(); draw(); });
    const rowT = h("div", { class: "controls" }, h("label", null, "hőmérséklet T", sT, tLab));
    const rowDraw = h("div", { class: "controls" }, bGo, bPause, bStep, bDone, h("label", null, "sebesség (pixel/s)", sV, vLab));
    root.append(rowT, rowDraw);

    /* kiegészítés: tesztkép-választó + megtartott sorok */
    const pickWrap = h("div", { style: "min-width:0;margin:.3rem 0" });
    const sK = slider(0, 8, 1, keep), kLab = h("b", null, String(keep));
    sK.oninput = () => { keep = +sK.value; kLab.textContent = String(keep); draw(); };
    const rowComp = h("div", { class: "controls" }, h("label", null, "megtartott sorok felülről", sK, kLab),
      btn("Új minták", () => { compSeed++; draw(); }), btn("Eredeti visszaállítása", () => { inp = A.test[sel].slice(); draw(); }));
    root.append(pickWrap, rowComp);
    const cvP = w1Canvas(pickWrap, w => (w < 520 ? 2 : 1) * (Math.min(46, (w < 520 ? w / 10 : w / 20)) + 14) + 4);

    const mainWrap = h("div", { style: "min-width:0" });
    root.append(mainWrap);
    const cv = w1Canvas(mainWrap, w => {
      if (mode === "draw") return w < 560 ? Math.min(w, 300) + 8 : Math.min(320, w * 0.42) + 8;
      const g = w1CompGeom(w); return g.H;
    });
    const info = h("div", { class: "readout" }), stats = h("div", { class: "stat-row" });
    root.append(info, stats);

    function w1CompGeom(w) {
      const narrow = w < 560, gap = 10, lab = 30;
      const S = narrow ? Math.min(w * 0.6, 230) : Math.min(230, w * 0.34);
      const rw = narrow ? w : w - S - 24, cols = 4, s = Math.min(92, (rw - (cols - 1) * gap) / cols);
      const gridH = 2 * (s + lab) + 4;
      const H = narrow ? S + 34 + gridH : Math.max(S + 34, gridH + 18);
      return { narrow, gap, lab, S, s, cols, H, rx: narrow ? (w - (cols * s + (cols - 1) * gap)) / 2 : S + 24, ry: narrow ? S + 34 : 18, ix: narrow ? (w - S) / 2 : 0, iy: 18 };
    }

    function newImage() {
      nDraw++;
      const r = rng(seed * 7919 + nDraw);
      cur = { x: new Array(64).fill(-1), u: Array.from({ length: 64 }, () => r()), i: 0 };
    }
    function stepPix() {
      if (!cur || cur.i >= 64) return;
      const i = cur.i, p = w1ArP(cur.x, i, T);
      cur.x[i] = cur.u[i] < p ? 1 : 0; cur.i++;
    }
    function loop(ts) {
      if (!running) return;
      if (!visible) { raf = 0; return; }
      const dt = lastTs ? Math.min(0.25, (ts - lastTs) / 1000) : 0; lastTs = ts;
      accT += dt * speed;
      let changed = false;
      while (accT >= 1 && cur.i < 64) { accT -= 1; stepPix(); changed = true; }
      if (cur.i >= 64) running = false;
      if (changed || !running) draw();
      if (running) raf = requestAnimationFrame(loop);
      else raf = 0;
    }
    function start() { running = true; lastTs = 0; accT = 0.999; if (!raf) raf = requestAnimationFrame(loop); paintBtns(); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; paintBtns(); }
    function paintBtns() { bPause.textContent = running ? "⏸ Szünet" : "▶ Folytatás"; setDis(bPause, !running && !(cur && cur.i < 64)); }
    w1Visible(root, v => { visible = v; if (v && running && !raf) { lastTs = 0; raf = requestAnimationFrame(loop); } });

    function layout() {
      tg.paint();
      rowDraw.style.display = mode === "draw" ? "" : "none";
      pickWrap.style.display = rowComp.style.display = mode === "complete" ? "" : "none";
    }

    function drawPicker() {
      cvP.resize();
      const { ctx, w, h: H } = cvP, rows = w < 520 ? 2 : 1, per = 20 / rows, s = Math.min(46, w / per - 6), cw = w / per;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      A.test.forEach((img, k) => {
        const r = Math.floor(k / per), c = k % per, x = c * cw + (cw - s) / 2, y = r * (s + 14) + 2;
        w1Bin(ctx, x, y, s, img, { frame: k === sel ? "--accent" : "--border", lw: k === sel ? 3 : 1 });
        label(ctx, String(A.testLabel[k]), x + s / 2, y + s + 12, css(k === sel ? "--accent" : "--muted"), "center", w1Font(11, k === sel ? 700 : 500));
      });
      cvP.geo = { rows, per, s, cw };
    }
    cvP.c.addEventListener("pointerdown", e => {
      const g = cvP.geo; if (!g) return;
      const [mx, my] = evXY(cvP, e), c = Math.floor(mx / g.cw), r = Math.floor(my / (g.s + 14)), k = r * g.per + c;
      if (c >= 0 && c < g.per && r >= 0 && r < g.rows && k < 20) { sel = k; inp = A.test[k].slice(); draw(); }
    });
    cv.c.addEventListener("pointerdown", e => {
      if (mode !== "complete") return;
      const g = w1CompGeom(cv.w), [mx, my] = evXY(cv, e), c = g.S / 8;
      const col = Math.floor((mx - g.ix) / c), row = Math.floor((my - g.iy) / c);
      if (col < 0 || col > 7 || row < 0 || row > 7) return;
      if (row < keep) { inp[row * 8 + col] = 1 - inp[row * 8 + col]; draw(); }
    });

    function drawMain() {
      cv.resize();
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      if (mode === "draw") {
        const S = (w < 560 ? Math.min(w, 300) : Math.min(320, w * 0.42)), x0 = (w - S) / 2, y0 = 4, c = S / 8;
        const x = cur ? cur.x : new Array(64).fill(-1);
        w1Bin(ctx, x0, y0, S, x, { grid: true, frame: "--muted" });
        if (cur && cur.i < 64) {
          const i = cur.i, p = w1ArP(cur.x, i, T), px = x0 + (i % 8) * c, py = y0 + Math.floor(i / 8) * c;
          ctx.fillStyle = mix("--accent", 0.15 + 0.6 * p); ctx.fillRect(px, py, c, c);
          ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 3; ctx.strokeRect(px + 1.5, py + 1.5, c - 3, c - 3); ctx.restore();
          label(ctx, fmt(p, 2), px + c / 2, py + c / 2, ink(0.15 + 0.6 * p), "center", w1Font(Math.max(10, Math.round(c * 0.3)), 700), "middle");
        }
        if (!cur) label(ctx, "Nyomd meg: „▶ Rajzolj!”", w / 2, y0 + S / 2, css("--muted"), "center", w1Font(14, 600), "middle");
        return;
      }
      const g = w1CompGeom(w);
      label(ctx, "a megtartott rész (kattints: pixel át)", g.ix + g.S / 2, g.iy - 4, css("--muted"), "center", w1Font(11, 600));
      const show = inp.map((v, i) => (i < keep * 8 ? v : -1));
      w1Bin(ctx, g.ix, g.iy, g.S, show, { grid: true, frame: "--muted", keep });
      if (keep < 8) label(ctx, "?", g.ix + g.S / 2, g.iy + (keep * g.S / 8 + g.S) / 2, css("--muted"), "center", w1Font(Math.round(g.S / 6), 700), "middle");
      const outs = comps();
      const items = [{ x: A.test[sel], cap: "eredeti", orig: true }, ...outs.map((x, k) => ({ x, cap: `${k + 1}. minta` }))];
      items.forEach((it, k) => {
        const r = Math.floor(k / g.cols), c = k % g.cols, x = g.rx + c * (g.s + g.gap), y = g.ry + r * (g.s + g.lab);
        w1Bin(ctx, x, y, g.s, it.x, { keep, frame: it.orig ? "--setC" : "--border", lw: it.orig ? 3 : 1 });
        label(ctx, it.cap, x + g.s / 2, y + g.s + 13, css(it.orig ? "--text" : "--muted"), "center", w1Font(11, it.orig ? 700 : 500));
        label(ctx, fmt(w1ArBits(it.x), 1) + " bit", x + g.s / 2, y + g.s + 26, css("--muted"), "center", w1Font(10, 500));
      });
      cv.outs = outs;
    }
    function comps() {
      const r = rng(compSeed * 104729 + sel * 31 + 7);
      return Array.from({ length: 6 }, () => w1ArComplete(inp, keep, T, r));
    }

    function draw() {
      layout(); paintBtns();
      if (mode === "complete") drawPicker();
      drawMain();
      const st = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      if (mode === "draw") {
        if (!cur) info.innerHTML = `A modell a 450 tesztképen átlagosan <b>${fmt(A.nll.ar, 1)} bit</b> meglepetést ad képenként (független pixelek: ${fmt(A.nll.indep, 1)}, egyenletes: ${A.nll.uniform}).`;
        else if (cur.i < 64) {
          const i = cur.i, z = w1ArZ(cur.x, i), p = sigm(z / T);
          info.innerHTML = `${i + 1}. pixel (${Math.floor(i / 8) + 1}. sor, ${i % 8 + 1}. oszlop): z = ${fmt(z, 2)}, ` +
            `p(fekete) = σ(z/T) = <b>${fmt(p, 3)}</b>, a húzott u = ${w1Fix(cur.u[i], 2)} → ${cur.u[i] < p ? "fekete" : "fehér"} lesz`;
        } else info.innerHTML = `Kész a kép. A „▶ Rajzolj!” újat kezd (mag ${seed}, ${nDraw}. kép).`;
        const n = cur ? cur.i : 0, ink1 = cur ? cur.x.slice(0, n).filter(v => v === 1).length : 0;
        stats.replaceChildren(
          st(cur ? fmt(w1ArBits(cur.x, n), 1) + " bit" : "–", n < 64 ? `meglepetés eddig (${n} pixel, T = 1 modell)` : "a kép meglepetése (T = 1 modell)"),
          st(n ? pct(ink1 / 64, 0) : "–", `tinta aránya (${ink1} / 64 fekete)`),
          st("mag " + seed, nDraw ? `${nDraw}. kép` : "még nincs kép"));
      } else {
        const outs = cv.outs || [], bits = outs.map(x => w1ArBits(x)), inks = outs.map(x => x.filter(v => v === 1).length / 64);
        const orig = A.test[sel], edited = inp.some((v, i) => i < keep * 8 && v !== orig[i]);
        info.innerHTML = `Megmarad ${keep * 8} pixel, ${64 - keep * 8} pixelt a modell rajzol (T = ${fmt(T, 2)}). ` +
          `<b>eredeti</b>: a tesztkép valódi folytatása (címke: ${A.testLabel[sel]})` + (edited ? "; a megtartott részt átírtad." : ".") +
          ` A képek alatt: a teljes kép meglepetése (T = 1 modell).`;
        const mean = a => a.reduce((s, v) => s + v, 0) / (a.length || 1);
        stats.replaceChildren(
          st(fmt(w1ArBits(orig), 1) + " bit", "az eredeti meglepetése"),
          st(fmt(mean(bits), 1) + " bit", "a 6 kiegészítés átlaga"),
          st(pct(orig.filter(v => v === 1).length / 64, 0) + " / " + pct(mean(inks), 0), "tinta: eredeti / kiegészítések"));
      }
    }
    cv.draw = draw; cvP.draw = draw;
    layout(); draw();
    /* „Új mag” a vezérlősorba */
    rowDraw.insertBefore(btn("Új mag", () => { stop(); seed++; nDraw = 0; cur = null; draw(); }), rowDraw.children[4]);
  };

  /* ------------------------------------------------------------------
     ae-bottleneck – szűk keresztmetszet: mély AE és PCA (14.3-b), GEN14.ae
     ------------------------------------------------------------------ */
  const w1Mse = (a, b) => a.reduce((s, v, i) => s + ((v - b[i]) / 16) ** 2, 0) / a.length;
  W["ae-bottleneck"] = root => {
    const D = GEN14.ae, ks = D.ks;
    header(root, "Szűk keresztmetszet",
      "Egy tesztszámjegy rekonstrukciója k számos kódból: felül a mély autoenkóder (64 → 128 → k → 128 → 64), alul a PCA (az első k főkomponens). " +
      "Kattints egy számjegyre, illetve egy oszlopra (vagy húzd a csúszkát)!");
    let sel = 3, ki = 2;
    const pickWrap = h("div", { style: "min-width:0;margin:.3rem 0" });
    const sK = slider(0, ks.length - 1, 1, ki), kLab = h("b", null, "");
    sK.oninput = () => { ki = +sK.value; draw(); };
    root.append(pickWrap, h("div", { class: "controls" }, h("label", null, "a kód mérete", sK, kLab)));
    const cvP = w1Canvas(pickWrap, w => Math.min(50, w / 10 - 6) + 18);
    const gWrap = h("div", { style: "min-width:0" });
    root.append(gWrap);
    const cvG = w1Canvas(gWrap, w => { const s = w1GS(w); return 18 + 2 * (s + 34) + 8; });
    const bigWrap = h("div", { style: "min-width:0;margin-top:.4rem" });
    root.append(bigWrap);
    const cvB = w1Canvas(bigWrap, w => Math.min(130, (w - 40) / 3) + 40, 520);
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(tw);

    function w1GS(w) { const L = w < 520 ? 0 : 0; return Math.min(80, (w - L - 7 * 6) / 7); }
    function drawPicker() {
      cvP.resize();
      const { ctx, w, h: H } = cvP, s = Math.min(50, w / 10 - 6), cw = w / 10;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      D.orig.forEach((img, k) => {
        const x = k * cw + (cw - s) / 2;
        drawDigit(ctx, x, 2, s, img, { frameVar: k === sel ? "--accent" : "--border", frameW: k === sel ? 3 : 1 });
        label(ctx, String(D.label[k]), x + s / 2, s + 16, css(k === sel ? "--accent" : "--muted"), "center", w1Font(11, k === sel ? 700 : 500));
      });
      cvP.geo = { cw };
    }
    cvP.c.addEventListener("pointerdown", e => { const [mx] = evXY(cvP, e), k = Math.floor(mx / cvP.geo.cw); if (k >= 0 && k < 10) { sel = k; draw(); } });

    function drawGrid() {
      cvG.resize();
      const { ctx, w, h: H } = cvG, s = w1GS(w), gap = (w - 7 * s) / 7, colX = c => gap / 2 + c * (s + gap);
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const rowY = r => 18 + r * (s + 34) + 14;
      /* kiemelt oszlop */
      const hx = colX(ki + 1) - gap / 2 + 2;
      ctx.fillStyle = css("--accent-soft"); ctx.fillRect(hx, 2, s + gap - 4, H - 4);
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.5; ctx.strokeRect(hx + 0.5, 2.5, s + gap - 5, H - 5); ctx.restore();
      label(ctx, "eredeti", colX(0) + s / 2, 14, css("--text"), "center", w1Font(11, 700));
      ks.forEach((k, j) => label(ctx, "k = " + k, colX(j + 1) + s / 2, 14, css(j === ki ? "--accent" : "--muted"), "center", w1Font(11, 700)));
      const o = D.orig[sel];
      [["mély AE", D.ae], ["PCA", D.pca]].forEach(([nm, src], r) => {
        const y = rowY(r);
        label(ctx, nm + (w > 520 ? " (a kép alatt: a hibája)" : ""), 2 + colX(1) - gap / 2 + 4, y - 3, css("--muted"), "left", w1Font(10, 600));
        ks.forEach((k, j) => {
          const rec = src[k][sel], x = colX(j + 1);
          drawDigit(ctx, x, y, s, rec, { frameVar: j === ki ? "--accent" : "--border" });
          label(ctx, w1Fix(w1Mse(o, rec), 3), x + s / 2, y + s + 13, css(j === ki ? "--text" : "--muted"), "center", w1Font(10, j === ki ? 700 : 500));
        });
      });
      const oy = (rowY(0) + rowY(1)) / 2;
      drawDigit(ctx, colX(0), oy, s, o, { frameVar: "--muted" });
      cvG.geo = { colX, s, gap };
    }
    cvG.c.addEventListener("pointerdown", e => {
      const g = cvG.geo; if (!g) return;
      const [mx] = evXY(cvG, e), c = Math.floor(mx / (g.s + g.gap));
      if (c >= 1 && c <= ks.length) { ki = c - 1; sK.value = ki; draw(); }
    });

    function drawBig() {
      cvB.resize();
      const { ctx, w, h: H } = cvB, s = Math.min(130, (w - 40) / 3), gap = (w - 3 * s) / 4, k = ks[ki], o = D.orig[sel];
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      [["eredeti", o, null], [`mély AE, k = ${k}`, D.ae[k][sel], "--setA"], [`PCA, k = ${k}`, D.pca[k][sel], "--setB"]].forEach(([nm, img, fr], j) => {
        const x = gap + j * (s + gap);
        drawDigit(ctx, x, 16, s, img, { frameVar: fr || "--muted", frameW: fr ? 3 : 1 });
        label(ctx, nm, x + s / 2, 13, css("--text"), "center", w1Font(11, 700));
        if (j) label(ctx, "hiba " + w1Fix(w1Mse(o, img), 3), x + s / 2, 16 + s + 16, css("--muted"), "center", w1Font(11, 600));
      });
    }

    function drawTable() {
      const cell = "padding:.18em .3em;text-align:center;border:1px solid var(--border);";
      const hi = j => (j === ki ? "background:var(--accent-soft);font-weight:700;" : "");
      const row = (nm, m) => `<tr><th style="${cell}text-align:left;white-space:nowrap">${nm}</th>` +
        ks.map((k, j) => `<td style="${cell}${hi(j)}">${w1Fix(m[k], 3)}</td>`).join("") + "</tr>";
      tw.innerHTML = `<table class="pix-table" style="border-collapse:collapse;font-size:.8rem;font-family:inherit">` +
        `<caption style="caption-side:top;text-align:left;font-family:inherit;font-size:.85rem;color:var(--muted);padding-bottom:.2rem">Átlagos hiba a 450 tesztképen</caption>` +
        `<tr><th style="${cell}text-align:left">k</th>${ks.map((k, j) => `<th style="${cell}${hi(j)}">${k}</th>`).join("")}</tr>` +
        row("PCA", D.msePCA) + row("mély AE", D.mseAE) + "</table>" +
        `<p class="muted" style="font-size:.82rem;margin:.3rem 0 0">Hiba: pixelenkénti átlagos négyzetes eltérés 0–1 skálán (0 = fehér, 1 = a legsötétebb).</p>`;
    }

    function draw() {
      kLab.textContent = "k = " + ks[ki];
      drawPicker(); drawGrid(); drawBig(); drawTable();
    }
    cvP.draw = draw; cvG.draw = draw; cvB.draw = draw;
    draw();
  };

  /* ------------------------------------------------------------------
     kl-explorer – mennyibe kerül a felhő? (14.4-b)
     ------------------------------------------------------------------ */
  const w1Npdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  const w1KL = (m, s) => [m * m / 2, 0.5 * (s * s - 1 - Math.log(s * s))];
  W["kl-explorer"] = root => {
    header(root, "Mennyibe kerül a felhő?",
      "A kódoló egy kép kódját $\\mathcal N(\\mu, \\sigma^2)$ felhőként adja meg; a KL-tag azt méri, mennyire tér el ez a priortól, $\\mathcal N(0, 1)$-től. " +
      "Húzd a csúszkákat, vagy válassz egy példát!");
    let mu = 1, sg = 0.5;
    const sM = slider(-3, 3, 0.05, mu), sS = slider(0.05, 3, 0.05, sg), mLab = h("b"), sLab = h("b");
    sM.oninput = () => { mu = +sM.value; draw(); };
    sS.oninput = () => { sg = +sS.value; draw(); };
    root.append(h("div", { class: "controls" }, h("label", null, "μ", sM, mLab), h("label", null, "σ", sS, sLab)));
    const presets = [[0, 1], [1, 0.5], [2, 0.5], [0, 0.1], [0, 2]];
    const pb = presets.map(([m, s]) => btn(`(${fmt(m, 1)}; ${fmt(s, 1)})`, () => { mu = m; sg = s; sM.value = m; sS.value = s; draw(); }));
    root.append(h("div", { class: "controls" }, small("példák (μ; σ):"), pb));
    const [cvA, cvV, , R] = twoCanvas(root, 0.68, 0.86);
    const capV = h("p", { class: "muted", style: "font-size:.82rem;margin:.25rem 0 0" });
    R.append(capV);
    const ro = h("div", { class: "readout" }), bar = h("div", { style: "display:flex;height:14px;border-radius:4px;overflow:hidden;background:var(--bg-soft);margin-top:.4rem" });
    const stats = h("div", { class: "stat-row" });
    root.append(ro, stats);
    ro.after(bar);

    function curve(ctx, T, f, a, b, color, width, dash, fill) {
      const pts = [];
      for (let i = 0; i <= 400; i++) { const x = a + (b - a) * i / 400; pts.push([x, f(x)]); }
      if (fill) {
        ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(T.tx(a), T.ty(0));
        pts.forEach(([x, y]) => ctx.lineTo(T.tx(x), T.ty(y))); ctx.lineTo(T.tx(b), T.ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      polyline(ctx, T, pts, color, width, dash);
    }
    function drawKL() {
      cvA.resize();
      const peak = Math.max(w1Npdf(0, 0, 1), w1Npdf(mu, mu, sg));
      const view = { xmin: -5, xmax: 5, ymin: -0.03 * peak * 1.15, ymax: peak * 1.15, xstep: 1, ystep: peak > 2 ? 1 : peak > 1 ? 0.5 : 0.1, xname: "z", yname: "" };
      const T = Calc.plot(cvA, view, []), ctx = cvA.ctx;
      curve(ctx, T, x => w1Npdf(x, mu, sg), -5, 5, css("--setA"), 2.5, [], rgba(css("--setA"), 0.28));
      curve(ctx, T, x => w1Npdf(x, 0, 1), -5, 5, css("--text"), 2, [6, 4]);
      label(ctx, "prior N(0, 1)", T.tx(-4.8), T.ty(view.ymax) + 14, css("--text"), "left", w1Font(11, 600));
      label(ctx, "felhő N(μ, σ²)", T.tx(-4.8), T.ty(view.ymax) + 30, css("--setA"), "left", w1Font(11, 700));
      /* μ jelölése: a hely-tag */
      if (Math.abs(mu) > 0.02) {
        const y = T.ty(0) - 8;
        arrow(ctx, T.tx(0), y, T.tx(mu), y, css("--setB"), 2.5);
      }
    }
    function drawVAE() {
      cvV.resize();
      const w = cvV.w, s = sg, peak = w1Npdf(1, 1, s), top = peak * 1.15, iconS = clamp(w * 0.055, 14, 22);
      const r = (iconS + 32) / (cvV.h - 8), ymin = -r * top / (1 - r);
      const view = { xmin: -3, xmax: 3, ymin, ymax: top, xstep: 1, ystep: top > 2 ? 1 : top > 1 ? 0.5 : 0.2, xname: "z", yname: "", labels: true };
      const T = Calc.plot(cvV, view, []), ctx = cvV.ctx;
      const f1 = x => w1Npdf(x, 1, s), f2 = x => w1Npdf(x, -1, s);
      /* közös terület */
      ctx.save(); ctx.fillStyle = rgba(css("--accent"), 0.35); ctx.beginPath(); ctx.moveTo(T.tx(-3), T.ty(0));
      for (let i = 0; i <= 400; i++) { const x = -3 + 6 * i / 400; ctx.lineTo(T.tx(x), T.ty(Math.min(f1(x), f2(x)))); }
      ctx.lineTo(T.tx(3), T.ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      curve(ctx, T, f1, -3, 3, css("--setA"), 2.5, []);
      curve(ctx, T, f2, -3, 3, css("--setB"), 2.5, []);
      label(ctx, "alsó csík (μ = −1)", T.tx(-2.95), T.ty(top) + 14, css("--setB"), "left", w1Font(11, 700));
      label(ctx, "felső csík (μ = 1)", T.tx(2.95), T.ty(top) + 14, css("--setA"), "right", w1Font(11, 700));
      /* a dekódoló képei a tengely mentén */
      [-2, -1, -0.5, 0, 0.5, 1, 2].forEach(z => {
        const v = [0.5, 0.5, -0.5, -0.5].map(d => clamp(0.5 + z * d, 0, 1)), x = T.tx(z), y = T.ty(0) + 20;
        ctx.fillStyle = css("--muted"); ctx.fillRect(x - 0.5, T.ty(0), 1, 18);
        w1Icon(ctx, x - iconS / 2, y, iconS, v, { grid: false });
      });
      label(ctx, "d(z):", 4, T.ty(0) + 20 + iconS / 2, css("--muted"), "left", w1Font(10, 600), "middle");
    }
    function overlap(s) {
      let a = 0; const n = 4000, lo = -10, hi = 10, dx = (hi - lo) / n;
      for (let i = 0; i <= n; i++) { const x = lo + i * dx, v = Math.min(w1Npdf(x, 1, s), w1Npdf(x, -1, s)); a += (i === 0 || i === n ? 0.5 : 1) * v * dx; }
      return a;
    }
    function draw() {
      mLab.textContent = fmt(mu, 2); sLab.textContent = fmt(sg, 2);
      pb.forEach((b, i) => b.classList.toggle("on", Math.abs(presets[i][0] - mu) < 1e-9 && Math.abs(presets[i][1] - sg) < 1e-9));
      drawKL(); drawVAE();
      const [a, b] = w1KL(mu, sg), kl = a + b, sw = c => `<span style="color:var(${c})">■</span>`;
      ro.innerHTML = `KL = ½(μ² + σ² − 1 − ln σ²) = ${sw("--setB")} μ²/2 + ${sw("--setC")} ½(σ² − 1 − ln σ²) = ` +
        `${fmt(a, 3)} + ${fmt(b, 3)} = <b>${fmt(kl, 2)}</b> nat`;
      const sc = Math.max(3, kl);
      bar.innerHTML = `<div title="hely" style="width:${100 * a / sc}%;background:var(--setB)"></div><div title="szélesség" style="width:${100 * b / sc}%;background:var(--setC)"></div>`;
      const ov = overlap(sg), [, bv] = w1KL(1, sg);
      const st = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l", html: l }));
      stats.replaceChildren(
        st(fmt(kl, 2), "KL (nat)"),
        st(fmt(a, 2), `${sw("--setB")} „hely”: μ²/2`),
        st(fmt(b, 2), `${sw("--setC")} „szélesség”`),
        st(pct(ov, 1), `a két csíkfelhő átfedése (σ = ${fmt(sg, 2)})`),
        st(fmt(0.5 + bv, 2), "egy csíkfelhő KL-je (μ = ±1)"));
      capV.innerHTML = `A második rajz: a 2 × 2-es világ 1D-s VAE-je, mindkét felhő szórása σ. Kitöltve a két görbe közös területe; alul, mit rajzol a dekódoló ` +
        `d(z) = 0,5 + z·(0,5; 0,5; −0,5; −0,5) a z = −2; −1; −0,5; 0; 0,5; 1; 2 pontokban.`;
    }
    cvA.draw = draw; cvV.draw = draw;
    draw();
  };
