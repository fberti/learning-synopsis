
  /* ==================================================================
     w1: bias-variance (6.1-c), likelihood (6.2-b), ci-coverage (6.3-b)
     ================================================================== */
  const w1Box = (cv, l = 44, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Msg = (ctx, cv, txt) => { ctx.fillStyle = css("--muted"); ctx.font = "13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, cv.w / 2, cv.h / 2); };

  /* ------------------------------------------------------------------
     bias-variance – becslések versenye: torzítás, szórás, MSE
     ------------------------------------------------------------------ */
  W["bias-variance"] = root => {
    header(root, "Becslések versenye – torzítás, szóródás, MSE",
      "Sok mintát veszünk, és mindegyikből több becslést számolunk ugyanarra a paraméterre. Minden pötty egy minta becslése; a függőleges vonal a valódi érték. Az a jó becslés, amelyiknek a pöttyei <b>átlagosan közel</b> vannak hozzá (kicsi MSE).");
    const rnd = S.mulberry32(11);
    const POP = {
      norm: { name: "normális", draw: r => 50 + 10 * S.rnorm(r), mu: 50, s2: 100 },
      unif: { name: "egyenletes", draw: r => 50 + 10 * Math.sqrt(12) * (r() - 0.5), mu: 50, s2: 100 },
      heavy: { name: "vastag farkú (t₃)", draw: r => { const z = S.rnorm(r), c = S.rchi2(r, 3); return 50 + 10 / Math.sqrt(3) * z / Math.sqrt(c / 3); }, mu: 50, s2: 100 }
    };
    const EST = {
      mu: [
        ["átlag", a => mean(a)], ["medián", a => S.median(a)], ["első adat $x_1$", a => a[0]],
        ["$(\\min+\\max)/2$", a => (Math.min(...a) + Math.max(...a)) / 2], ["zsugorított: $0{,}8\\,\\bar x + 0{,}2 \\cdot 40$", a => 0.8 * mean(a) + 8]
      ],
      s2: [
        ["$s^2$ ($n-1$-es)", a => S.variance(a, 1)], ["$\\hat\\sigma^2_n$ ($n$-es)", a => S.variance(a, 0)],
        ["$\\frac{1}{n+1}\\sum(x_i-\\bar x)^2$", a => S.variance(a, 0) * a.length / (a.length + 1)]
      ]
    };
    let pop = "norm", target = "mu", n = 5, res = null;
    const segT = segmented([["mu", "a várható érték ($\\mu = 50$) becslése"], ["s2", "a szórásnégyzet ($\\sigma^2 = 100$) becslése"]], target, v => { target = v; run(); });
    const segP = segmented(Object.entries(POP).map(([k, o]) => [k, o.name]), pop, v => { pop = v; run(); });
    const segN = segmented([2, 3, 5, 10, 30, 100].map(v => [v, "n = " + v]), n, v => { n = +v; run(); });
    root.append(h("div", { class: "controls" }, segT.el), h("div", { class: "controls" }, h("span", { class: "muted" }, "Sokaság:"), segP.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintanagyság:"), segN.el, btn("Új 1000 minta", () => run())));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(260, w * 0.5));
    const tblWrap = h("div", { class: "tw", style: "overflow-x:auto" }); root.append(tblWrap);
    const note = h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0" }); root.append(note);
    function run() {
      const P = POP[pop], ests = EST[target], R = 1000, theta = target === "mu" ? P.mu : P.s2;
      const vals = ests.map(() => []), a = new Array(n);
      for (let r = 0; r < R; r++) {
        for (let i = 0; i < n; i++) a[i] = P.draw(rnd);
        ests.forEach(([, f], j) => vals[j].push(f(a)));
      }
      res = ests.map(([name], j) => {
        const v = vals[j], m = mean(v), d2 = S.variance(v, 0);
        return { name, v, m, bias: m - theta, d2, mse: (m - theta) ** 2 + d2 };
      });
      draw(theta);
    }
    function draw(theta) {
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const k = res.length, box = w1Box(cv, 16, 16, 12, 30);
        let lo, hi;
        if (target === "mu") { lo = 20; hi = 80; } else { lo = 0; hi = n <= 3 ? 500 : n <= 5 ? 350 : n <= 10 ? 260 : 200; }
        const tx = v => box.x0 + (v - lo) / (hi - lo) * (box.x1 - box.x0);
        const rowH = (box.y1 - box.y0) / k;
        ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
        rangeTicks(lo, hi, 6).forEach(t => { ctx.fillText(fmt(t, 0), tx(t), box.y1 + 6); ctx.strokeStyle = css("--border"); ctx.beginPath(); ctx.moveTo(tx(t), box.y0); ctx.lineTo(tx(t), box.y1); ctx.stroke(); });
        const best = res.reduce((b, r, i) => (r.mse < res[b].mse ? i : b), 0);
        const prand = S.mulberry32(3);
        res.forEach((r, j) => {
          const yc = box.y0 + rowH * (j + 0.5);
          ctx.fillStyle = j === best ? css("--setC") : css("--setA"); ctx.globalAlpha = 0.28;
          r.v.forEach(v => { if (v < lo || v > hi) return; ctx.beginPath(); ctx.arc(tx(v), yc + (prand() - 0.5) * rowH * 0.6, 2, 0, 2 * Math.PI); ctx.fill(); });
          ctx.globalAlpha = 1;
          if (r.m >= lo && r.m <= hi) { ctx.strokeStyle = css("--setB"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx(r.m), yc - rowH * 0.38); ctx.lineTo(tx(r.m), yc + rowH * 0.38); ctx.stroke(); }
          ctx.fillStyle = css("--text"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "12px system-ui, sans-serif";
          ctx.fillText(String(j + 1) + ".", box.x0 + 2, yc - rowH / 2 + 2);
        });
        vline(ctx, tx(theta), box.y0, box.y1, css("--text"), true);
      };
      cv.draw();
      const best = res.reduce((b, r, i) => (r.mse < res[b].mse ? i : b), 0);
      const tbl = h("table", null, h("tr", null, ...["#", "becslés", "várható érték", "torzítás", "szórásnégyzet", "MSE"].map(t => h("th", null, t))),
        ...res.map((r, j) => h("tr", j === best ? { style: "background:var(--accent-soft)" } : null,
          h("td", null, String(j + 1)), h("td", { html: r.name }), h("td", null, fmt(r.m, 2)), h("td", null, fmt(r.bias, 2)), h("td", null, fmt(r.d2, 2)), h("td", null, h("b", null, fmt(r.mse, 2))))));
      tblWrap.replaceChildren(tbl);
      note.innerHTML = keyRow([["egy minta becslése", "--setA", "box"], ["a legkisebb MSE-jű becslés", "--setC", "box"], ["a becslések átlaga", "--setB"], ["valódi érték", "--text", "dash"]]).outerHTML +
        (target === "mu" ? "Figyeld meg: normális sokaságnál az átlag nyer; egyenletesnél a $(\\min+\\max)/2$; vastag farkúnál a medián. A zsugorított becslés torzított, de kis $n$-nél mégis nyerhet – ez a torzítás–variancia átváltás."
          : "Az $s^2$ torzítatlan, mégis nagyobb az MSE-je, mint a torzított változatoké: a kisebb szórás többet ér, mint amennyit a torzítás ront. Nagy $n$-nél a három szinte egyforma.");
      window.Synopsis && Synopsis.renderMath(root);
    }
    run();
  };

  /* ------------------------------------------------------------------
     likelihood – érmedobás: likelihood- és log-likelihood-görbe
     ------------------------------------------------------------------ */
  W["likelihood"] = root => {
    header(root, "A likelihood-függvény – melyik p magyarázza legjobban az adatot?",
      "Állítsd be, hány dobásból hány fej jött (vagy dobj!). A görbe minden $p$-hez megmutatja, mennyire valószínű a megfigyelt sorozat. A csúcs a maximum likelihood becslés. Húzd a $p$ csúszkát, és hasonlítsd össze az értékeket!");
    let n = 10, k = 7, p = 0.5, logMode = false;
    const rnd = S.mulberry32(21);
    const rowN = sliderRow("dobások száma $n$ =", 1, 100, 1, n, v => String(v), v => { n = v; if (k > n) { k = n; rowK.input.value = k; rowK.out.textContent = k; } rowK.input.max = n; update(); });
    const rowK = sliderRow("fejek száma $k$ =", 0, n, 1, k, v => String(v), v => { k = v; update(); });
    const rowP = sliderRow("vizsgált $p$ =", 0.01, 0.99, 0.01, p, v => fmt(v, 2), v => { p = v; update(); });
    const segL = segmented([["L", "likelihood $L(p)$"], ["log", "log-likelihood $\\ln L(p)$"]], "L", v => { logMode = v === "log"; update(); });
    root.append(h("div", { class: "controls" }, rowN.wrap), h("div", { class: "controls" }, rowK.wrap), h("div", { class: "controls" }, rowP.wrap),
      h("div", { class: "controls" }, segL.el, btn("🪙 +10 dobás szabályos érmével", () => {
        for (let i = 0; i < 10 && n < 100; i++) { n++; if (rnd() < 0.5) k++; }
        rowN.input.value = n; rowN.out.textContent = n; rowK.input.max = n; rowK.input.value = k; rowK.out.textContent = k; update();
      }), btn("Vissza: 7 / 10", () => { n = 10; k = 7; rowN.input.value = 10; rowN.out.textContent = 10; rowK.input.max = 10; rowK.input.value = 7; rowK.out.textContent = 7; update(); })));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(220, w * 0.42));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const lnL = q => (k ? k * Math.log(q) : 0) + (n - k ? (n - k) * Math.log(1 - q) : 0);
    function update() {
      const ph = k / n;
      const ymaxL = Math.exp(lnL(Math.min(0.999999, Math.max(1e-6, ph))));
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 56, 16, 20, 34);
        let fn, ymin, ymax;
        if (logMode) { fn = q => lnL(q); ymax = lnL(Math.min(0.999, Math.max(0.001, ph))); ymin = ymax - Math.max(6, n * 0.25); }
        else { fn = q => Math.exp(lnL(q)); ymin = 0; ymax = ymaxL * 1.15; }
        const yt = rangeTicks(ymin, ymax, 4);
        const yfmt = v => (logMode ? fmt(v, 1) : v === 0 ? "0" : v.toExponential(1).replace(".", ","));
        const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 1, ymin, ymax, xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [], xfmt: v => fmt(v, 1), xlabel: "p", ylabel: logMode ? "ln L(p)" : "L(p)" });
        ctx.fillStyle = css("--muted"); ctx.font = "10px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        yt.forEach(v => { if (v >= ymin && v <= ymax) ctx.fillText(yfmt(v), box.x0 - 4, ty(v)); });
        ctx.save(); ctx.beginPath(); ctx.rect(box.x0, box.y0 - 2, box.x1 - box.x0, box.y1 - box.y0 + 2); ctx.clip();
        curve(ctx, tx, ty, q => Math.max(ymin - 1, fn(q)), 0.001, 0.999, css("--accent"), 2.5);
        ctx.restore();
        vline(ctx, tx(ph), box.y0, box.y1, css("--setC"), true);
        vline(ctx, tx(p), box.y0, box.y1, css("--setB"), false);
        const yp = fn(p);
        if (yp >= ymin) { ctx.fillStyle = css("--setB"); ctx.beginPath(); ctx.arc(tx(p), ty(yp), 5, 0, 2 * Math.PI); ctx.fill(); }
        ctx.fillStyle = css("--setC"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = tx(ph) > box.x1 - 80 ? "right" : "left"; ctx.textBaseline = "top";
        ctx.fillText("p̂ = " + fmt(ph, 2), tx(ph) + (ctx.textAlign === "left" ? 5 : -5), box.y0);
      };
      cv.draw();
      const Lp = Math.exp(lnL(p)), Lh = Math.exp(lnL(Math.min(0.999999, Math.max(1e-6, ph))));
      const sci = v => (v >= 1e-3 ? fmt(v, 5) : v.toExponential(2).replace(".", ","));
      statRow(statEl, [
        ["$L(p) = p^{" + k + "}(1-p)^{" + (n - k) + "}$", "p = " + fmt(p, 2) + ": " + sci(Lp)],
        ["ML becslés $\\hat p = k/n$", fmt(ph, 3)],
        ["$L(\\hat p)$", sci(Lh)],
        ["$L(p)/L(\\hat p)$", fmt(Lp / Lh, 3)]
      ]);
    }
    update();
  };

  /* ------------------------------------------------------------------
     ci-coverage – 100 minta, 100 intervallum
     ------------------------------------------------------------------ */
  W["ci-coverage"] = root => {
    header(root, "Száz minta, száz intervallum – mit jelent a 95%?",
      "A valódi $\\mu$-t itt ismerjük (függőleges vonal). Minden sor egy minta konfidencia-intervalluma. Azok, amelyek <b>nem fedik le</b> a $\\mu$-t, kiemelve. Figyeld a lefedési arányt – és próbáld ki a <b>hibás</b> módszert is (kis mintán $s$-sel, de $z$-vel)!");
    const rnd = S.mulberry32(7);
    const POPC = {
      norm: { name: "normális", draw: r => 100 + 15 * S.rnorm(r), mu: 100, sigma: 15 },
      exp: { name: "ferde (exponenciális)", draw: r => 85 + S.rexp(r, 15), mu: 100, sigma: 15 }
    };
    let pop = "norm", n = 10, level = 0.95, method = "t", list = [], hit = 0, tot = 0, wsum = 0;
    const reset = () => { list = []; hit = 0; tot = 0; wsum = 0; };
    const segP = segmented(Object.entries(POPC).map(([k, o]) => [k, o.name]), pop, v => { pop = v; reset(); add(100); });
    const segN = segmented([5, 10, 30, 100].map(v => [v, "n = " + v]), n, v => { n = +v; reset(); add(100); });
    const segL = segmented([[0.8, "80%"], [0.9, "90%"], [0.95, "95%"], [0.99, "99%"]], level, v => { level = +v; reset(); add(100); });
    const segM = segmented([["z", "$z$, $\\sigma$ ismert"], ["t", "$t$, $s$-sel"], ["bad", "hibás: $z$, de $s$-sel"]], method, v => { method = v; reset(); add(100); });
    root.append(h("div", { class: "controls" }, h("span", { class: "muted" }, "Sokaság ($\\mu = 100$, $\\sigma = 15$):"), segP.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Mintanagyság:"), segN.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Szint:"), segL.el),
      h("div", { class: "controls" }, h("span", { class: "muted" }, "Módszer:"), segM.el),
      h("div", { class: "controls" }, btn("1 minta", () => add(1)), btn("+100 minta", () => add(100)), btn("+1000 minta", () => add(1000)), btn("Ürít", () => { reset(); draw(); })));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(320, w * 0.62));
    root.append(keyRow([["lefedi a $\\mu$-t", "--setA"], ["nem fedi le", "--bad"], ["minta átlaga", "--text", "box"], ["valódi $\\mu$", "--text", "dash"]]));
    const statEl = h("div", { class: "stat-row" }); root.append(statEl);
    const note = h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0" }); root.append(note);
    function add(k) {
      const P = POPC[pop], a = new Array(n);
      for (let r = 0; r < k; r++) {
        for (let i = 0; i < n; i++) a[i] = P.draw(rnd);
        const m = mean(a), s = S.sd(a);
        const iv = method === "z" ? CI.meanZ(m, P.sigma, n, level) : method === "t" ? CI.meanT(m, s, n, level) : CI.meanZ(m, s, n, level);
        const ok = iv[0] <= P.mu && P.mu <= iv[1];
        tot++; if (ok) hit++; wsum += iv[1] - iv[0];
        list.push({ m, lo: iv[0], hi: iv[1], ok });
      }
      if (list.length > 100) list = list.slice(-100);
      draw();
    }
    function draw() {
      const P = POPC[pop];
      cv.draw = () => {
        const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
        const box = w1Box(cv, 16, 16, 10, 30);
        const half = Math.max(8, 4.6 * 15 / Math.sqrt(n));
        const lo = 100 - half, hi = 100 + half;
        const tx = v => box.x0 + (v - lo) / (hi - lo) * (box.x1 - box.x0);
        ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
        rangeTicks(lo, hi, 6).forEach(t => { ctx.fillText(fmt(t, 0), tx(t), box.y1 + 6); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx(t), box.y0); ctx.lineTo(tx(t), box.y1); ctx.stroke(); });
        if (!list.length) { w1Msg(ctx, cv, "Kattints a „+100 minta” gombra!"); return; }
        const rowH = (box.y1 - box.y0) / 100;
        list.forEach((r, i) => {
          const y = box.y0 + rowH * (i + 0.5);
          ctx.strokeStyle = r.ok ? css("--setA") : css("--bad"); ctx.lineWidth = r.ok ? 1.6 : 2.4;
          ctx.beginPath(); ctx.moveTo(Math.max(box.x0, tx(r.lo)), y); ctx.lineTo(Math.min(box.x1, tx(r.hi)), y); ctx.stroke();
          ctx.fillStyle = css("--text"); ctx.fillRect(tx(r.m) - 1, y - 1, 2, 2);
        });
        vline(ctx, tx(P.mu), box.y0, box.y1, css("--text"), true);
      };
      cv.draw();
      const lastHit = list.filter(r => r.ok).length;
      statRow(statEl, [
        ["az utolsó " + list.length + "-ból lefedi", lastHit + " / " + list.length],
        ["összesen (" + groupDigits(tot) + " minta)", tot ? pct(hit / tot, 1) : "–"],
        ["névleges szint", pct(level, 0)],
        ["átlagos szélesség", tot ? fmt(wsum / tot, 2) : "–"]
      ]);
      note.innerHTML = method === "bad"
        ? (n <= 10 ? "A $t$-kvantilis helyett $z$-t használva kis mintán a lefedettség jóval a névleges alatt marad (95%-os szintnél $n = 5$-nél kb. 88%, $n = 10$-nél kb. 92%)." : "Nagy mintán a $z$ és a $t$ már alig különbözik, ezért a „hibás” módszer is közel jár a névleges szinthez.")
        : pop === "exp" && n <= 10 ? "Ferde sokaságnál kis mintán a $t$-intervallum sem tartja pontosan a szintet – a CHT még nem „dolgozott”. Növeld az $n$-et!"
        : "Az egyes sávok ugrálnak, a $\\mu$ áll. Hosszú távon a sávok kb. " + pct(level, 0) + "-a fedi le – ez a megbízhatósági szint jelentése.";
      window.Synopsis && Synopsis.renderMath(note);
    }
    add(100);
  };

