
  /* ==================================================================
     w1: tea-tasting (7.1-a), p-value-machine (7.3-a), errors-power (7.4-c)
     ================================================================== */
  const w1Box = (cv, l = 44, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Choose = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const w1P = p => (p >= 0.0001 ? fmt(p, 4) : p.toExponential(1).replace(".", ","));

  /* ------------------------------------------------------------------
     tea-tasting – a teát kóstoló hölgy
     ------------------------------------------------------------------ */
  W["tea-tasting"] = root => {
    header(root, "Kóstold meg! – a teát kóstoló hölgy kísérlete",
      "A gép titokban, véletlen sorrendben elkészíti a csészéket: a felük „tej előbb” (T), a felük „tea előbb”. Te nem látod, melyik melyik. Válaszd ki azokat, amelyeket T-nek gondolsz, aztán fedd fel őket! A gép kiszámolja, mennyire meglepő az eredményed, ha csak tippeltél.");
    const rnd = S.mulberry32(1935);
    let N = 8, truth = [], pick = new Set(), revealed = false, sims = [];
    const segN = segmented([4, 6, 8, 10, 12].map(v => [v, v + " csésze"]), N, v => { N = +v; newRound(); });
    const cupsEl = h("div", { style: "display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin:.7rem 0" });
    const msg = h("div", { class: "readout" });
    const revealBtn = btn("Felfedem", () => { if (pick.size === N / 2) { revealed = true; render(); } });
    root.append(h("div", { class: "controls" }, segN.el),
      cupsEl,
      h("div", { class: "controls" }, revealBtn, btn("Új kör", () => newRound()), btn("🎲 A gép tippel 1000-szer", () => simulate(1000)), btn("Ürít", () => { sims = []; render(); })),
      msg);
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(190, w * 0.32));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    function shuffleTruth() {
      const m = N / 2, a = Array(N).fill(false); for (let i = 0; i < m; i++) a[i] = true;
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
    function newRound() { truth = shuffleTruth(); pick = new Set(); revealed = false; sims = []; render(); }
    const exact = () => { const m = N / 2, tot = w1Choose(N, m); return Array.from({ length: m + 1 }, (_, k) => w1Choose(m, k) * w1Choose(m, m - k) / tot); };
    const pval = k => exact().slice(k).reduce((s, x) => s + x, 0);
    function simulate(R) {
      const m = N / 2;
      for (let r = 0; r < R; r++) {
        const idx = [...Array(N).keys()];
        for (let i = 0; i < m; i++) { const j = i + Math.floor(rnd() * (N - i)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        let k = 0; for (let i = 0; i < m; i++) if (truth[idx[i]]) k++;
        sims.push(k);
      }
      render();
    }
    function render() {
      const m = N / 2;
      cupsEl.replaceChildren(...truth.map((t, i) => {
        const on = pick.has(i);
        let bg = "var(--bg-soft)", bd = "var(--border)", lab = "?";
        if (on) { bg = "var(--accent-soft)"; bd = "var(--accent)"; }
        if (revealed) { lab = t ? "T" : "tea"; if (on) bd = t ? "var(--ok)" : "var(--bad)"; }
        const b = h("button", { type: "button", class: "btn", style: `min-width:3.6rem;height:3.6rem;border-radius:0 0 1.2rem 1.2rem;border:2px solid ${bd};background:${bg};font-weight:600`,
          onclick: () => { if (revealed) return; if (on) pick.delete(i); else if (pick.size < m) pick.add(i); render(); } }, "☕ " + lab);
        return b;
      }));
      revealBtn.disabled = pick.size !== m || revealed;
      if (!revealed) msg.innerHTML = `Válassz ki <b>${m}</b> csészét, amelyet „tej előbb”-nek gondolsz (eddig: ${pick.size}).`;
      else {
        const k = [...pick].filter(i => truth[i]).length, p = pval(k);
        msg.innerHTML = `Eltaláltál <b>${k}</b> T-csészét a ${m}-ből. Ha csak tippeltél volna, legalább ennyi találat esélye: <b>p = ${w1P(p)}</b>` +
          (p <= 0.05 ? " – 5%-os szinten szignifikáns: nehéz a véletlennel magyarázni." : " – ez tippeléssel is gyakran előfordul, nem szignifikáns.");
      }
      const ex = exact();
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 40, 14, 22, 34);
        const cnt = Array(m + 1).fill(0); sims.forEach(k => cnt[k]++);
        const emp = cnt.map(c => (sims.length ? c / sims.length : 0));
        const ymax = Math.max(...ex, ...emp) * 1.18;
        const { tx, ty } = axes(ctx, box, { xmin: -0.6, xmax: m + 0.6, ymin: 0, ymax, xticks: [...Array(m + 1).keys()], yticks: rangeTicks(0, ymax, 4), xfmt: v => String(v), xlabel: "eltalált T-csészék", ylabel: "valószínűség" });
        const bw = Math.min(46, (box.x1 - box.x0) / (m + 1) * 0.36);
        const kObs = revealed ? [...pick].filter(i => truth[i]).length : -1;
        ex.forEach((p, k) => {
          ctx.fillStyle = k >= kObs && kObs >= 0 ? css("--bad") : css("--setA"); ctx.globalAlpha = 0.8;
          ctx.fillRect(tx(k) - bw, ty(p), bw, ty(0) - ty(p));
          if (sims.length) { ctx.fillStyle = css("--setB"); ctx.fillRect(tx(k), ty(emp[k]), bw, ty(0) - ty(emp[k])); }
          ctx.globalAlpha = 1; ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(w1Choose(m, k) * w1Choose(m, m - k) + "/" + w1Choose(N, m), tx(k) - bw / 2, ty(p) - 2);
        });
      };
      cv.draw();
      statRow(statEl, [
        ["lehetséges választások", "$\\binom{" + N + "}{" + m + "}$ = " + w1Choose(N, m)],
        ["P(mind talál | tippel)", w1P(1 / w1Choose(N, m))],
        ["gépi tippelések", groupDigits(sims.length)],
        ["ebből mind talált", sims.length ? pct(sims.filter(k => k === m).length / sims.length, 2) : "–"]
      ]);
    }
    root.append(keyRow([["pontos eloszlás (ha csak tippel)", "--setA", "box"], ["a gép tippjei", "--setB", "box"], ["a te eredményed és a szélsőségesebbek (p-érték)", "--bad", "box"]]));
    newRound();
  };

  /* ------------------------------------------------------------------
     p-value-machine – p-érték: terület a H0-eloszlás szélén
     ------------------------------------------------------------------ */
  W["p-value-machine"] = root => {
    header(root, "p-érték-gép – mennyi a terület a szélén?",
      "A görbe a próbastatisztika eloszlása <b>ha $H_0$ igaz</b>. Húzd a megfigyelt értéket: az árnyékolt terület a p-érték. A szaggatott vonalak a választott $\\alpha$-hoz tartozó kritikus értékek.");
    let dist = "z", df = 9, obs = 2, side = "two", alpha = 0.05;
    const segD = segmented([["z", "standard normális"], ["t", "Student t"]], dist, v => { dist = v; dfRow.wrap.style.display = v === "t" ? "" : "none"; update(); });
    const dfRow = sliderRow("szabadságfok =", 1, 60, 1, df, v => String(v), v => { df = v; update(); });
    dfRow.wrap.style.display = "none";
    const obsRow = sliderRow("megfigyelt érték =", -4, 4, 0.01, obs, v => fmt(v, 2), v => { obs = v; update(); });
    const segS = segmented([["two", "kétoldali"], ["right", "jobboldali ($H_1$: nagyobb)"], ["left", "baloldali ($H_1$: kisebb)"]], side, v => { side = v; update(); });
    const segA = segmented([[0.1, "α = 10%"], [0.05, "α = 5%"], [0.01, "α = 1%"]], alpha, v => { alpha = +v; update(); });
    root.append(h("div", { class: "controls" }, segD.el, dfRow.wrap), h("div", { class: "controls" }, obsRow.wrap), h("div", { class: "controls" }, segS.el), h("div", { class: "controls" }, segA.el));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(220, w * 0.4));
    root.append(keyRow([["$H_0$ melletti eloszlás", "--accent"], ["p-érték (terület)", "--setB", "box"], ["kritikus érték(ek)", "--bad", "dash"], ["megfigyelt érték", "--text"]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const out = h("div", { class: "readout" }); root.append(out);
    const pdf = x => (dist === "z" ? S.normal.pdf(x) : S.t.pdf(x, df)), cdf = x => (dist === "z" ? S.normal.cdf(x) : S.t.cdf(x, df));
    const inv = p => (dist === "z" ? S.normal.inv(p) : S.t.inv(p, df));
    function update() {
      const p = side === "two" ? 2 * (1 - cdf(Math.abs(obs))) : side === "right" ? 1 - cdf(obs) : cdf(obs);
      const crit = side === "two" ? [inv(1 - alpha / 2)] : [inv(1 - alpha)];
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 20, 14, 14, 30);
        const ymax = pdf(0) * 1.12;
        const { tx, ty } = axes(ctx, box, { xmin: -4.5, xmax: 4.5, ymin: 0, ymax, xticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4], yticks: [], xfmt: v => String(v) });
        const shade = (a, b) => { ctx.beginPath(); ctx.moveTo(tx(a), ty(0)); for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; ctx.lineTo(tx(x), ty(pdf(x))); } ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); };
        ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.5;
        const a = Math.abs(obs);
        if (side === "two") { shade(a, 4.5); shade(-4.5, -a); } else if (side === "right") shade(obs, 4.5); else shade(-4.5, obs);
        ctx.globalAlpha = 1;
        curve(ctx, tx, ty, pdf, -4.5, 4.5, css("--accent"), 2.5);
        const c = crit[0];
        if (side === "two") { vline(ctx, tx(c), box.y0, box.y1, css("--bad"), true); vline(ctx, tx(-c), box.y0, box.y1, css("--bad"), true); }
        else vline(ctx, tx(side === "right" ? c : -c), box.y0, box.y1, css("--bad"), true);
        vline(ctx, tx(obs), box.y0, box.y1, css("--text"), false);
      };
      cv.draw();
      const cTxt = side === "two" ? "±" + fmt(crit[0], 3) : (side === "right" ? "" : "−") + fmt(crit[0], 3);
      statRow(statEl, [["p-érték", w1P(p)], ["kritikus érték", cTxt], ["$\\alpha$", pct(alpha, 0)]]);
      out.innerHTML = p <= alpha
        ? `$p = ${w1P(p).replace(",", "{,}")} \\le \\alpha$: a megfigyelt érték a kritikus tartományban van – <b>$H_0$-t ${pct(alpha, 0)}-os szinten elvetjük</b>.`
        : `$p = ${w1P(p).replace(",", "{,}")} \\gt \\alpha$: <b>$H_0$-t nem vetjük el</b> – az eredmény $H_0$ mellett nem elég meglepő.`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    update();
  };

  /* ------------------------------------------------------------------
     errors-power – α, β és próbaerő két eltolt eloszlással
     ------------------------------------------------------------------ */
  W["errors-power"] = root => {
    header(root, "Hibák és próbaerő – két haranggörbe",
      "Jobboldali próba: $H_0$: $\\mu = 100$. A bal görbe a mintaátlag eloszlása, ha $H_0$ igaz; a jobb, ha valójában $\\mu = 100 + \\delta$. Ha $\\bar x$ a kritikus érték fölé esik, elvetjük $H_0$-t. Figyeld, hogyan változik a három terület a csúszkákkal!");
    let delta = 5, sigma = 15, n = 25, alpha = 0.05;
    const rD = sliderRow("valódi hatás $\\delta$ =", 0, 15, 0.5, delta, v => fmt(v, 1), v => { delta = v; update(); });
    const rS = sliderRow("szórás $\\sigma$ (zaj) =", 5, 30, 1, sigma, v => String(v), v => { sigma = v; update(); });
    const rN = sliderRow("mintanagyság $n$ =", 1, 200, 1, n, v => String(v), v => { n = v; update(); });
    const segA = segmented([[0.1, "α = 10%"], [0.05, "α = 5%"], [0.01, "α = 1%"]], alpha, v => { alpha = +v; update(); });
    root.append(h("div", { class: "controls" }, rD.wrap), h("div", { class: "controls" }, rS.wrap), h("div", { class: "controls" }, rN.wrap), h("div", { class: "controls" }, segA.el));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(230, w * 0.42));
    root.append(keyRow([["$\\bar X$ eloszlása, ha $H_0$ igaz", "--setA"], ["ha $H_1$ igaz", "--setB"], ["$\\alpha$ (elsőfajú hiba)", "--bad", "box"], ["$\\beta$ (másodfajú hiba)", "--muted", "box"], ["erő", "--ok", "box"]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    function update() {
      const se = sigma / Math.sqrt(n), zc = S.normal.inv(1 - alpha), xc = 100 + zc * se, mu1 = 100 + delta;
      const beta = S.normal.cdf(xc, mu1, se), power = 1 - beta;
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 20, 14, 14, 30);
        const lo = 100 - 4 * se, hi = Math.max(mu1 + 4 * se, 100 + 4 * se);
        const ymax = S.normal.pdf(0, 0, se) * 1.15;
        const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax, xticks: rangeTicks(lo, hi, 7), yticks: [], xfmt: v => fmt(v, Math.abs(hi - lo) < 8 ? 1 : 0) });
        const shade = (f, a, b, col, al) => { if (b <= a) return; ctx.fillStyle = col; ctx.globalAlpha = al; ctx.beginPath(); ctx.moveTo(tx(a), ty(0)); for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; ctx.lineTo(tx(x), ty(f(x))); } ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
        const f0 = x => S.normal.pdf(x, 100, se), f1 = x => S.normal.pdf(x, mu1, se);
        shade(f1, lo, Math.min(xc, hi), css("--muted"), 0.35);
        shade(f1, xc, hi, css("--ok"), 0.3);
        shade(f0, xc, hi, css("--bad"), 0.55);
        curve(ctx, tx, ty, f0, lo, hi, css("--setA"), 2.5);
        if (delta > 0) curve(ctx, tx, ty, f1, lo, hi, css("--setB"), 2.5);
        vline(ctx, tx(xc), box.y0, box.y1, css("--text"), true);
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText("kritikus érték " + fmt(xc, 2), Math.min(tx(xc) + 4, box.x1 - 120), box.y0);
      };
      cv.draw();
      statRow(statEl, [
        ["$\\mathrm{SE} = \\sigma/\\sqrt n$", fmt(se, 2)],
        ["kritikus érték", fmt(xc, 2)],
        ["$\\alpha$", pct(alpha, 0)],
        ["$\\beta$", fmt(delta > 0 ? beta : 1 - alpha, 3)],
        ["erő $1-\\beta$", delta > 0 ? fmt(power, 3) : "= α"],
        ["Cohen-féle $d = \\delta/\\sigma$", fmt(delta / sigma, 2)]
      ]);
    }
    update();
  };

