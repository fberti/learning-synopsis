
  /* ==================================================================
     w1: sample-enum (5.1-b), sqrt-n (5.2-c), sampling-dist (5.3-c)
     ================================================================== */
  const w1Clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const w1Box = (cv, l = 44, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Key = items => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem 1rem;font-size:.85rem;margin:.35rem 0;color:var(--muted)" },
    ...items.map(([t, c, dash]) => h("span", { style: "display:inline-flex;align-items:center;gap:.35rem" },
      h("span", { style: dash ? `display:inline-block;width:18px;height:0;border-top:2.5px dashed var(${c})`
        : `display:inline-block;width:18px;height:3px;background:var(${c});border-radius:2px` }), t)));
  /* tört kiírása (pl. 13/25) – csak kijelzéshez */
  const w1Frac = (k, n) => { const g = (a, b) => (b ? g(b, a % b) : a), d = g(k, n); return `${k / d}/${n / d}`; };

  /* ------------------------------------------------------------------
     sample-enum – az 5 fős sportoló sokaság összes mintája
     ------------------------------------------------------------------ */
  W["sample-enum"] = root => {
    header(root, "Az összes lehetséges minta – mintavételi eloszlás felsorolással",
      "Sokaság: Anna 2, Bence 4, Csilla 6, Dani 8, Emese 10 óra ($\\mu = 6$, $\\sigma^2 = 8$). Válaszd ki a mintanagyságot, a mintavétel módját és a statisztikát: a program felsorolja <b>az összes</b> lehetséges mintát.");
    const STATS = {
      mean:  { name: "átlag", f: a => mean(a), par: 6, parName: "$\\mu = 6$", d: 2 },
      max:   { name: "maximum", f: a => Math.max(...a), par: 10, parName: "sokasági max. = 10", d: 2 },
      min:   { name: "minimum", f: a => Math.min(...a), par: 2, parName: "sokasági min. = 2", d: 2 },
      s2:    { name: "$s^2$", f: a => (a.length > 1 ? S.variance(a, 1) : NaN), par: 8, parName: "$\\sigma^2 = 8$", d: 2 },
      range: { name: "terjedelem", f: a => Math.max(...a) - Math.min(...a), par: 8, parName: "sokasági terj. = 8", d: 2 }
    };
    let n = 2, mode = "wo", st = "mean", picked = -1;
    const segN = segmented([[1, "n = 1"], [2, "n = 2"], [3, "n = 3"], [4, "n = 4"]], n, v => { n = +v; picked = -1; update(); });
    const segM = segmented([["wo", "visszatevés nélkül"], ["wr", "visszatevéssel"]], mode, v => { mode = v; picked = -1; update(); });
    const segS = segmented(Object.entries(STATS).map(([k, o]) => [k, o.name]), st, v => { st = v; update(); });
    const drawBtn = btn("🎲 Húzz egy mintát", () => { picked = Math.floor(rnd() * samples.length); update(); });
    const rnd = S.mulberry32(2024);
    root.append(h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintanagyság:"), segN.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintavétel:"), segM.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Statisztika:"), segS.el, drawBtn));
    const cvWrap = h("div"); root.append(cvWrap);
    const cv = makeCanvas(cvWrap, 0.42);
    root.append(w1Key([["a statisztika várható értéke (az összes minta átlaga)", "--accent"], ["a paraméter (a sokaság megfelelő jellemzője)", "--muted", true]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const pickEl = h("div", { class: "readout" }); root.append(pickEl);
    const listWrap = h("details", { style: "margin-top:.5rem" }, h("summary", null, "Az összes minta listája"));
    const listEl = h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.4rem;max-height:14rem;overflow:auto" });
    listWrap.append(listEl); root.append(listWrap);

    let samples = [];
    function enumerate() {
      const idx = [];
      if (mode === "wr") {
        const rec = (pre) => { if (pre.length === n) { idx.push(pre); return; } for (let i = 0; i < 5; i++) rec([...pre, i]); };
        rec([]);
      } else {
        const rec = (pre, start) => { if (pre.length === n) { idx.push(pre); return; } for (let i = start; i < 5; i++) rec([...pre, i], i + 1); };
        rec([], 0);
      }
      return idx.map(ix => ({ ix, vals: ix.map(i => SPORT[i][1]) }));
    }
    function update() {
      samples = enumerate();
      const o = STATS[st];
      samples.forEach(s => (s.v = o.f(s.vals)));
      const valid = samples.filter(s => isFinite(s.v));
      const E = valid.length ? mean(valid.map(s => s.v)) : NaN;
      const V = valid.length ? valid.reduce((a, s) => a + (s.v - E) ** 2, 0) / valid.length : NaN;
      /* gyakoriságok */
      const freq = new Map();
      valid.forEach(s => { const k = Math.round(s.v * 1e6) / 1e6; freq.set(k, (freq.get(k) || 0) + 1); });
      const keys = [...freq.keys()].sort((a, b) => a - b);
      const maxF = Math.max(1, ...freq.values());
      const xmin = st === "s2" ? 0 : st === "range" ? 0 : 2, xmax = st === "s2" ? 32 : st === "range" ? 8 : 10;
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        if (!valid.length) { ctx.fillStyle = css("--muted"); ctx.font = "13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText("1 elemű mintából nem számolható s² (n − 1 = 0).", cv.w / 2, cv.h / 2); return; }
        const box = w1Box(cv, 40, 16, 22, 34);
        const xt = st === "s2" ? [0, 4, 8, 12, 16, 20, 24, 28, 32] : [xmin, ...rangeTicks(xmin, xmax, 8).filter(v => v > xmin)];
        const ymax = maxF / valid.length * 1.15;
        const yt = rangeTicks(0, ymax, 4);
        const { tx, ty } = axes(ctx, box, { xmin: xmin - (xmax - xmin) * 0.04, xmax: xmax + (xmax - xmin) * 0.04, ymin: 0, ymax, xticks: xt, yticks: yt, xfmt: v => fmt(v, 0), ylabel: "valószínűség" });
        const bw = Math.max(4, Math.min(28, (box.x1 - box.x0) / (keys.length * 1.8 + 2)));
        keys.forEach(k => {
          const p = freq.get(k) / valid.length;
          const isPicked = picked >= 0 && Math.abs(samples[picked].v - k) < 1e-6;
          ctx.fillStyle = isPicked ? css("--setB") : css("--setA");
          ctx.globalAlpha = 0.8;
          ctx.fillRect(tx(k) - bw / 2, ty(p), bw, ty(0) - ty(p));
          ctx.globalAlpha = 1;
          if (valid.length <= 125 && keys.length <= 14) {
            ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.fillText(String(freq.get(k)), tx(k), ty(p) - 2);
          }
        });
        vline(ctx, tx(o.par), box.y0, box.y1, css("--muted"), true);
        vline(ctx, tx(E), box.y0, box.y1, css("--accent"), false);
      };
      cv.draw();
      statRow(statEl, [
        ["minták száma", String(samples.length)],
        ["$E$(" + o.name + ")", fmt(E, 3)],
        ["$D$(" + o.name + ")", fmt(Math.sqrt(V), 3)],
        ["paraméter", o.parName],
        ["átlagosan eltalálja?", Math.abs(E - o.par) < 1e-9 ? "✔ igen (torzítatlan)" : "✘ nem"]
      ]);
      if (st === "mean") {
        const within = valid.filter(s => Math.abs(s.v - 6) <= 1 + 1e-9).length;
        pickEl.innerHTML = `Legfeljebb 1 órát téved ($5 \\le \\bar x \\le 7$): <b>${within}</b> minta a ${samples.length}-ből ($${w1Frac(within, samples.length)} = ${fmt(within / samples.length, 2).replace(",", "{,}")}$). ` +
          `Képlettel: $D^2(\\bar X) = ${mode === "wr" ? "\\sigma^2/n" : "\\frac{\\sigma^2}{n}\\cdot\\frac{N-n}{N-1}"} = ${fmt(mode === "wr" ? 8 / n : 8 / n * (5 - n) / 4, 3).replace(",", "{,}")}$.`;
      } else pickEl.innerHTML = "";
      if (picked >= 0) {
        const s = samples[picked];
        pickEl.innerHTML = `Kihúzott minta: <b>${s.ix.map(i => SPORT[i][0]).join(", ")}</b> (${s.vals.join(", ")}) → ${o.name} = <b>${fmt(s.v, 2)}</b>. ` + pickEl.innerHTML;
      }
      listEl.replaceChildren(...samples.slice(0, 625).map((s, i) => h("span", { class: "chip" + (i === picked ? " b" : ""), style: "font-weight:500" },
        s.vals.join("·") + " → " + (isFinite(s.v) ? fmt(s.v, 2) : "–"))));
      window.Synopsis && Synopsis.renderMath(root);
    }
    update();
  };

  /* ------------------------------------------------------------------
     sqrt-n – a standard hiba a mintanagyság függvényében
     ------------------------------------------------------------------ */
  W["sqrt-n"] = root => {
    header(root, "A $\\sqrt n$-törvény – mennyi adat kell a fele hibához?",
      "A görbe a standard hibát mutatja ($\\mathrm{SE} = \\sigma/\\sqrt n$); a vízszintes tengely <b>logaritmikus</b>. Húzd a mintanagyságot, és nézd meg, mekkora minta kell a feleakkora hibához.");
    let sigma = 10, n = 100, target = 0.5;
    const rowS = sliderRow("Sokasági szórás $\\sigma$ =", 1, 30, 1, sigma, v => fmt(v, 0), v => { sigma = v; update(); });
    const rowN = sliderRow("Mintanagyság $n$ =", 0, 4, 0.01, Math.log10(n), v => groupDigits(Math.round(10 ** v)), v => { n = Math.round(10 ** v); update(); });
    const tBox = numBox(target, { min: 0.01, max: 100, step: 0.1, width: "5rem" }, v => { target = v; update(); });
    root.append(h("div", { class: "controls" }, rowS.wrap), h("div", { class: "controls" }, rowN.wrap),
      h("div", { class: "controls" }, labelWrap("Kívánt standard hiba: ", tBox)));
    const cvWrap = h("div"); root.append(cvWrap);
    const cv = makeCanvas(cvWrap, 0.45);
    root.append(w1Key([["$\\mathrm{SE} = \\sigma/\\sqrt n$", "--accent"], ["a választott $n$ és a $4n$", "--setB"], ["kívánt SE", "--muted", true]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    function update() {
      const se = sigma / Math.sqrt(n), se4 = sigma / Math.sqrt(4 * n), need = Math.ceil((sigma / target) ** 2 - 1e-9);
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 44, 16, 22, 36);
        const ymax = sigma * 1.05;
        const lx = v => Math.log10(v);
        const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 4, ymin: 0, ymax, xticks: [0, 1, 2, 3, 4], yticks: rangeTicks(0, ymax, 5),
          xfmt: v => groupDigits(10 ** v), xlabel: "n (log. skála)", ylabel: "SE" });
        curve(ctx, tx, v => ty(v), x => sigma / Math.sqrt(10 ** x), 0, 4, css("--accent"), 2.5);
        /* kívánt SE */
        if (target < ymax) {
          ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(box.x0, ty(target)); ctx.lineTo(box.x1, ty(target)); ctx.stroke(); ctx.restore();
        }
        const pt = (nn, lab) => {
          if (nn > 10000) return;
          const X = tx(lx(nn)), Y = ty(sigma / Math.sqrt(nn));
          ctx.fillStyle = css("--setB"); ctx.beginPath(); ctx.arc(X, Y, 5, 0, 2 * Math.PI); ctx.fill();
          ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif"; ctx.textBaseline = "bottom";
          ctx.textAlign = X > box.x1 - 90 ? "right" : "left";
          ctx.fillText(lab, X + (ctx.textAlign === "left" ? 7 : -7), Y - 4);
        };
        pt(n, `n = ${groupDigits(n)}: SE = ${fmt(se, 2)}`);
        pt(4 * n, `4n: SE = ${fmt(se4, 2)}`);
      };
      cv.draw();
      statRow(statEl, [
        ["$\\mathrm{SE}$ ennél az $n$-nél", fmt(se, 3)],
        ["$2n$ esetén", fmt(sigma / Math.sqrt(2 * n), 3) + " (−29%)"],
        ["$4n$ esetén", fmt(se4, 3) + " (fele)"],
        ["kívánt SE-hez kell", "$n \\ge " + groupDigits(need).replace(/ /g, "\\,") + "$"]
      ]);
    }
    update();
  };

  /* ------------------------------------------------------------------
     sampling-dist – a központi szimuláció: sok minta, a statisztika eloszlása
     ------------------------------------------------------------------ */
  W["sampling-dist"] = root => {
    header(root, "Mintavételi eloszlás szimulációval – ugrál a mintaátlag?",
      "Válassz sokaságot és mintanagyságot, majd vegyél sok mintát. Felül a <b>sokaság</b> (az adatok eloszlása), alul a mintákból számolt <b>statisztika eloszlása</b>. Az átlagnál a vonal a CHT szerinti $N(\\mu, \\sigma/\\sqrt n)$ görbe.");
    const rnd = S.mulberry32(5);
    let pop = "exp", n = 5, st = "mean", stats = [], last = null, showCurve = true;
    const STATF = {
      mean: { name: "átlag", f: a => mean(a) },
      median: { name: "medián", f: a => S.median(a) },
      sd: { name: "szórás (s)", f: a => (a.length > 1 ? S.sd(a) : NaN) },
      max: { name: "maximum", f: a => Math.max(...a) }
    };
    const segP = segmented(Object.entries(POPS).map(([k, o]) => [k, o.name]), pop, v => { pop = v; reset(); });
    const segN = segmented([1, 2, 5, 10, 30, 100].map(v => [v, "n = " + v]), n, v => { n = +v; reset(); });
    const segS = segmented(Object.entries(STATF).map(([k, o]) => [k, o.name]), st, v => { st = v; reset(); });
    const cb = h("input", { type: "checkbox", checked: "" });
    cb.addEventListener("change", () => { showCurve = cb.checked; drawAll(); });
    root.append(h("div", { class: "controls" }, h("span", { class: "muted" }, "Sokaság:"), segP.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintanagyság:"), segN.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Statisztika:"), segS.el),
      h("div", { class: "controls" }, btn("1 minta", () => add(1)), btn("+100 minta", () => add(100)), btn("+10 000 minta", () => add(10000)),
        btn("Ürít", () => reset()), h("label", null, cb, " normálgörbe")));
    const w1 = h("div"), w2 = h("div");
    root.append(h("div", { class: "muted", style: "font-size:.85rem;margin-top:.3rem" }, "A sokaság (és az utolsó minta pöttyei):"), w1,
      h("div", { class: "muted", style: "font-size:.85rem;margin-top:.3rem" }, "A statisztika mintavételi eloszlása:"), w2);
    const cvP = w2Canvas(w1, w => Math.max(110, w * 0.22)), cvS = w2Canvas(w2, w => Math.max(210, w * 0.4));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const note = h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0" }); root.append(note);

    function range() {
      const P = POPS[pop];
      if (st === "sd") return [0, P.sigma * 2.5];
      if (pop === "exp" && st === "max") return [0, 24];
      return [P.lo, P.hi];
    }
    function add(k) {
      const P = POPS[pop], f = STATF[st].f, a = new Array(n);
      for (let r = 0; r < k; r++) {
        for (let i = 0; i < n; i++) a[i] = P.draw(rnd);
        const v = f(a);
        if (isFinite(v)) stats.push(v);
        if (r === k - 1) last = a.slice();
      }
      drawAll();
    }
    function reset() { stats = []; last = null; drawAll(); }
    function drawPop() {
      const P = POPS[pop], ctx = cvP.ctx; ctx.clearRect(0, 0, cvP.w, cvP.h);
      const box = w1Box(cvP, 40, 16, 10, 26);
      let ymax;
      if (P.discrete) ymax = 1 / P.discrete.length * (pop === "coin" ? 0.7 / 0.5 : 1) * 1.25;
      else { ymax = 0; for (let i = 0; i <= 200; i++) ymax = Math.max(ymax, P.pdf(P.lo + (P.hi - P.lo) * i / 200)); ymax *= 1.2; }
      const { tx, ty } = axes(ctx, box, { xmin: P.lo, xmax: P.hi, ymin: 0, ymax, xticks: rangeTicks(P.lo, P.hi, 8).filter(v => v >= P.lo && v <= P.hi), yticks: [], xfmt: v => fmt(v, Number.isInteger(v) ? 0 : 1) });
      ctx.fillStyle = css("--setC"); ctx.globalAlpha = 0.35;
      if (P.discrete) {
        const probs = pop === "coin" ? [0.7, 0.3] : P.discrete.map(() => 1 / 6);
        P.discrete.forEach((v, i) => { const bw = (box.x1 - box.x0) / (P.hi - P.lo) * 0.6; ctx.fillRect(tx(v) - bw / 2, ty(probs[i]), bw, ty(0) - ty(probs[i])); });
      } else {
        ctx.beginPath(); ctx.moveTo(tx(P.lo), ty(0));
        for (let i = 0; i <= 200; i++) { const x = P.lo + (P.hi - P.lo) * i / 200; ctx.lineTo(tx(x), ty(P.pdf(x))); }
        ctx.lineTo(tx(P.hi), ty(0)); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      vline(ctx, tx(P.mu), box.y0, box.y1, css("--muted"), true);
      if (last) {
        ctx.fillStyle = css("--setB");
        last.slice(0, 100).forEach((v, i) => { if (v < P.lo || v > P.hi) return; ctx.beginPath(); ctx.arc(tx(v), box.y1 - 6 - (i % 4) * 7, 3.5, 0, 2 * Math.PI); ctx.fill(); });
        const v = STATF[st].f(last);
        if (isFinite(v) && v >= P.lo && v <= P.hi) vline(ctx, tx(v), box.y0, box.y1, css("--setB"), false);
      }
    }
    function drawStat() {
      const P = POPS[pop], ctx = cvS.ctx; ctx.clearRect(0, 0, cvS.w, cvS.h);
      const [lo, hi] = range();
      const box = w1Box(cvS, 44, 16, 18, 30);
      const k = P.discrete && st !== "mean" && st !== "sd" ? Math.round(hi - lo) : 60;
      const H = histo(stats, lo, hi, k);
      const N = Math.max(1, stats.length);
      const dens = H.counts.map(c => c / N / H.w);
      const m = stats.length ? mean(stats) : NaN, s = stats.length > 1 ? S.sd(stats) : NaN;
      const se = P.sigma / Math.sqrt(n);
      let ymax = Math.max(0.0001, ...dens);
      if (showCurve && st === "mean") ymax = Math.max(ymax, S.normal.pdf(P.mu, P.mu, se) * (P.discrete && n < 5 ? 0 : 1));
      if (showCurve && st !== "mean" && stats.length > 30 && s > 0) ymax = Math.max(ymax, S.normal.pdf(m, m, s));
      ymax *= 1.12;
      const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax, xticks: rangeTicks(lo, hi, 8).filter(v => v >= lo && v <= hi), yticks: [], xfmt: v => fmt(v, Number.isInteger(v) ? 0 : 1) });
      ctx.fillStyle = css("--setA"); ctx.globalAlpha = 0.75;
      const bw = (box.x1 - box.x0) / k;
      H.counts.forEach((c, i) => { if (!c) return; const y = ty(dens[i]); ctx.fillRect(box.x0 + i * bw + 0.5, y, Math.max(1, bw - 1), ty(0) - y); });
      ctx.globalAlpha = 1;
      if (showCurve && stats.length) {
        if (st === "mean") curve(ctx, tx, ty, x => S.normal.pdf(x, P.mu, se), lo, hi, css("--accent"), 2.2);
        else if (stats.length > 30 && s > 0) curve(ctx, tx, ty, x => S.normal.pdf(x, m, s), lo, hi, css("--accent"), 2, [5, 4]);
      }
      const parV = st === "mean" ? P.mu : st === "sd" ? P.sigma : null;
      if (parV != null) vline(ctx, tx(parV), box.y0, box.y1, css("--muted"), true);
      if (!stats.length) { ctx.fillStyle = css("--muted"); ctx.font = "13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Még nincs minta – kattints a gombokra!", (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2); }
    }
    function skew(a) { if (a.length < 3) return NaN; const m = mean(a), s = Math.sqrt(a.reduce((t, x) => t + (x - m) ** 2, 0) / a.length); return s > 0 ? a.reduce((t, x) => t + ((x - m) / s) ** 3, 0) / a.length : NaN; }
    function drawAll() {
      cvP.draw = drawPop; cvS.draw = drawStat; drawPop(); drawStat();
      const P = POPS[pop], m = stats.length ? mean(stats) : NaN, s = stats.length > 1 ? S.sd(stats) : NaN;
      const items = [["minták száma", groupDigits(stats.length)], [STATF[st].name + "ok átlaga", fmt(m, 3)], [STATF[st].name + "ok szórása (szimulált SE)", fmt(s, 3)]];
      if (st === "mean") items.push(["elméleti $\\mathrm{SE} = \\sigma/\\sqrt n$", fmt(P.sigma / Math.sqrt(n), 3)], ["$\\mu$", fmt(P.mu, 3)]);
      items.push(["ferdeség", fmt(skew(stats), 2)]);
      statRow(statEl, items);
      note.innerHTML = st === "mean"
        ? (pop === "exp" && n < 30 ? "A sokaság erősen ferde: kis $n$-nél az átlagok eloszlása is ferde. Növeld az $n$-et 30-ra és 100-ra!"
          : pop === "bimod" && n === 1 ? "$n = 1$-nél a „mintaátlag” egyetlen adat: az eloszlása maga a sokaság. Már $n = 5$-nél egycsúcsú lesz!"
          : "Figyeld: a hisztogram középe mindig $\\mu$, szélessége $\\sigma/\\sqrt n$, és $n$ növelésével egyre jobban illeszkedik a normálgörbére.")
        : st === "max" ? "A maximum eloszlása nem a sokasági maximum körül van, és ferdébb is – a CHT csak átlagra (összegre) szól."
        : st === "median" ? "A medián eloszlása is közel normális lesz nagy $n$-nél, de ferde sokaságnál nem a $\\mu$ körül, hanem a sokasági medián körül."
        : "A szórás eloszlása kis $n$-nél jobbra ferde, és átlagosan kicsit kisebb, mint $\\sigma$ (a szaggatott vonal).";
      window.Synopsis && Synopsis.renderMath(note);
    }
    add(100);
  };

