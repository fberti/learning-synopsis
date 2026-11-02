
  /* ==================================================================
     w1: chain-base (4.3), basket-index (4.4), composition-effect (4.6)
     ================================================================== */

  /* Kis segéd: gombsor (egy aktív), onPick(index) */
  function w1Seg(labels, active, onPick) {
    const wrap = h("div", { class: "controls", style: "margin:.3rem 0" });
    const bs = labels.map((l, i) => btn(l, () => { bs.forEach(b => b.classList.remove("on")); bs[i].classList.add("on"); onPick(i); }));
    if (active >= 0) bs[active].classList.add("on");
    wrap.append(...bs);
    wrap.setOn = i => { bs.forEach(b => b.classList.remove("on")); if (i >= 0) bs[i].classList.add("on"); };
    return wrap;
  }
  const w1Ft = x => groupDigits(Math.round(x));

  /* ------------------------------------------------------------------
     chain-base – bázis- és láncviszonyszámok egy szerkeszthető idősoron
     ------------------------------------------------------------------ */
  W["chain-base"] = root => {
    header(root, "Bázis és lánc – szerkeszthető idősor",
      "Írd át az értékeket, és válassz bázisévet! Figyeld: a láncviszonyszámok nem függnek a bázistól, " +
      "a láncok szorzata pedig mindig kiadja a bázisviszonyszámot.");
    const PRE = [
      { name: "Kávézó (millió Ft)", years: [2021, 2022, 2023, 2024, 2025], y: [40, 50, 45, 54, 54] },
      { name: "Házasságkötések (NGA)", years: [1989, 1990, 1991, 1992, 1993], y: [12263, 11941, 10975, 10118, 9409] },
      { name: "Állandó +10%", years: [1, 2, 3, 4, 5], y: [200, 220, 242, 266.2, 292.82] }
    ];
    let S, base = 0;
    const preBar = w1Seg(PRE.map(p => p.name), 0, i => load(i));
    const baseBar = h("div", { class: "controls", style: "margin:.3rem 0" });
    const tblWrap = h("div", { class: "tw", style: "overflow-x:auto" });
    root.append(preBar, h("div", { class: "w-sub", html: "Bázisév (= 100%):" }), baseBar, tblWrap);
    const cv = makeCanvas(root, innerWidth < 560 ? 0.75 : 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);

    function load(i) {
      S = { years: PRE[i].years.slice(), y: PRE[i].y.slice() }; base = 0;
      baseBar.replaceChildren(w1Seg(S.years.map(String), 0, k => { base = k; upd(); }));
      buildTable(); upd();
    }
    let cells;
    function buildTable() {
      const t = h("table");
      t.append(h("tr", null, h("th", null, "év"), h("th", null, "érték"), h("th", null, "bázis"), h("th", null, "lánc"), h("th", null, "láncok szorzata")));
      cells = S.y.map((v, i) => {
        const inp = numBox(v, { min: 0.01, max: 1e7, step: "any", width: "5.6rem" }, val => { S.y[i] = val; upd(); });
        const r = { b: h("td"), l: h("td"), p: h("td") };
        t.append(h("tr", null, h("td", null, String(S.years[i])), h("td", null, inp), r.b, r.l, r.p));
        return r;
      });
      tblWrap.replaceChildren(t);
    }
    const bas = () => S.y.map(v => v / S.y[base]);
    const chain = () => S.y.map((v, i) => (i ? v / S.y[i - 1] : NaN));
    /* láncok szorzata a bázistól t-ig (t < bázis esetén a reciprok) */
    function chainProd(t) {
      const l = chain(); let p = 1;
      if (t > base) for (let k = base + 1; k <= t; k++) p *= l[k];
      if (t < base) { for (let k = t + 1; k <= base; k++) p *= l[k]; p = 1 / p; }
      return p;
    }
    cv.draw = () => {
      if (!S) return;
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const b = bas().map(x => 100 * x), l = chain().map(x => 100 * x), n = S.y.length;
      const vals = b.concat(l.filter(isFinite), [100]);
      let lo = Math.min(...vals), hi = Math.max(...vals);
      const pad = Math.max(5, (hi - lo) * 0.15); lo = Math.max(0, Math.floor((lo - pad) / 10) * 10); hi = Math.ceil((hi + pad) / 10) * 10;
      const bx = { x0: 44, y0: 22, x1: w - 10, y1: H - 28 };
      const { tx, ty } = axes(ctx, bx, { xmin: -0.5, xmax: n - 0.5, ymin: lo, ymax: hi, xticks: [...Array(n).keys()],
        yticks: rangeTicks(lo, hi, 6), xfmt: i => String(S.years[i]) });
      const bw = Math.min(46, (tx(1) - tx(0)) * 0.42);
      // bázis: oszlopok a 100%-os vonaltól
      b.forEach((v, i) => {
        ctx.fillStyle = css("--accent"); ctx.globalAlpha = i === base ? 0.85 : 0.45;
        const y0 = ty(100), y1 = ty(v);
        ctx.fillRect(tx(i) - bw / 2, Math.min(y0, y1), bw, Math.max(1.5, Math.abs(y1 - y0)));
        ctx.globalAlpha = 1;
      });
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(bx.x0, ty(100)); ctx.lineTo(bx.x1, ty(100)); ctx.stroke(); ctx.restore();
      // lánc: pontok összekötve
      ctx.strokeStyle = css("--setB"); ctx.fillStyle = css("--setB"); ctx.lineWidth = 2;
      ctx.beginPath(); let st = false;
      l.forEach((v, i) => { if (!isFinite(v)) return; const X = tx(i), Y = ty(v); st ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); st = true; });
      ctx.stroke();
      l.forEach((v, i) => { if (!isFinite(v)) return; ctx.beginPath(); ctx.arc(tx(i), ty(v), 4.5, 0, 2 * Math.PI); ctx.fill(); });
      // jelmagyarázat
      ctx.font = "12px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.6; ctx.fillRect(bx.x0 + 8, 6, 14, 10); ctx.globalAlpha = 1;
      ctx.fillStyle = css("--text"); ctx.fillText("bázisviszonyszám", bx.x0 + 26, 11);
      ctx.fillStyle = css("--setB"); ctx.beginPath(); ctx.arc(bx.x0 + 150, 11, 4.5, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = css("--text"); ctx.fillText("láncviszonyszám", bx.x0 + 160, 11);
    };
    function upd() {
      const b = bas(), l = chain(), n = S.y.length;
      cells.forEach((c, i) => {
        c.b.textContent = pct(b[i], 1); c.b.style.fontWeight = i === base ? "700" : "";
        c.l.textContent = i ? pct(l[i], 1) : "–";
        c.p.textContent = i === base ? "1" : fmt(chainProd(i), 4) + (Math.abs(chainProd(i) - b[i]) < 1e-9 ? " ✔" : "");
      });
      cv.draw();
      const tot = S.y[n - 1] / S.y[0], g = Math.pow(tot, 1 / (n - 1));
      const arith = mean(l.slice(1).map(x => x - 1));
      out.innerHTML = `${S.years[0]} → ${S.years[n - 1]}: összesen <b>${pct(tot, 1)}</b> (${tot >= 1 ? "+" : "−"}${fmt(Math.abs(tot - 1) * 100, 1)}%) · ` +
        `átlagos ütem (mértani): $\\sqrt[${n - 1}]{${fmt(tot, 4).replace(",", "{,}")}}$ = <b>${pct(g, 2)}</b>, vagyis évi ${g >= 1 ? "+" : "−"}${fmt(Math.abs(g - 1) * 100, 2)}% · ` +
        `a láncszázalékok számtani átlaga: ${arith >= 0 ? "+" : "−"}${fmt(Math.abs(arith) * 100, 2)}% <span class="muted">(ez túlbecsül)</span>`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    load(0);
  };

  /* ------------------------------------------------------------------
     basket-index – Panni kosara: érték-, ár- és volumenindexek, indexkör
     ------------------------------------------------------------------ */
  W["basket-index"] = root => {
    header(root, "Panni kosara – Laspeyres, Paasche, Fisher élőben",
      "Írd át az árakat és a mennyiségeket! Próbáld ki: mi történik, ha a kávé még drágább lesz, és Panni még kevesebbet vesz belőle? " +
      "Mikor egyezik meg a Laspeyres- és a Paasche-index?");
    const PRE = [
      { name: "Panni", items: [["kenyér", 10, 600, 10, 600], ["tej", 15, 400, 23, 400], ["kávé", 2, 2000, 1, 2600], ["alma", 8, 500, 12, 600]] },
      { name: "Csak az árak változnak", items: [["kenyér", 10, 600, 10, 600], ["tej", 15, 400, 15, 400], ["kávé", 2, 2000, 2, 2600], ["alma", 8, 500, 8, 600]] },
      { name: "Erős helyettesítés", items: [["kenyér", 10, 600, 10, 600], ["tej", 15, 400, 30, 400], ["kávé", 2, 2000, 0, 4000], ["alma", 8, 500, 12, 600]] },
      { name: "NGA 8.2 (A–D cikk)", items: [["A", 1000, 10, 1200, 11], ["B", 800, 5, 600, 6], ["C", 2000, 4, 4000, 4], ["D", 700, 3, 1000, 3.5]] }
    ];
    let D;
    const preBar = w1Seg(PRE.map(p => p.name), 0, i => load(i));
    const tblWrap = h("div", { class: "tw", style: "overflow-x:auto" });
    const sums = h("div", { class: "stat-row" });
    root.append(preBar, tblWrap, sums);
    const cv = makeCanvas(root, innerWidth < 560 ? 0.95 : 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);

    function load(i) { D = PRE[i].items.map(r => r.slice()); buildTable(); upd(); }
    let rowCells;
    function buildTable() {
      const t = h("table");
      t.append(h("tr", null, h("th", null, "termék"), h("th", { html: "$q_0$" }), h("th", { html: "$p_0$" }), h("th", { html: "$q_1$" }), h("th", { html: "$p_1$" }),
        h("th", { html: "$i_p$" }), h("th", { html: "$i_q$" })));
      rowCells = D.map((r, i) => {
        const box = (k, opt) => numBox(r[k], opt, v => { D[i][k] = v; upd(); });
        const c = { ip: h("td"), iq: h("td") };
        t.append(h("tr", null, h("td", null, r[0]),
          h("td", null, box(1, { min: 0, max: 1e6, step: 1, width: "4.4rem" })), h("td", null, box(2, { min: 0.01, max: 1e7, step: "any", width: "4.8rem" })),
          h("td", null, box(3, { min: 0, max: 1e6, step: 1, width: "4.4rem" })), h("td", null, box(4, { min: 0.01, max: 1e7, step: "any", width: "4.8rem" })),
          c.ip, c.iq));
        return c;
      });
      tblWrap.replaceChildren(t);
      window.Synopsis && Synopsis.renderMath(t);
    }
    function idx() {
      const q0 = D.map(r => r[1]), p0 = D.map(r => r[2]), q1 = D.map(r => r[3]), p1 = D.map(r => r[4]);
      const a00 = sumProd(q0, p0), a11 = sumProd(q1, p1), a01 = sumProd(q0, p1), a10 = sumProd(q1, p0);
      const L = a01 / a00, P = a11 / a10, Iq0 = a10 / a00, Iq1 = a11 / a01;
      return { a00, a11, a01, a10, Iv: a11 / a00, L, P, F: Math.sqrt(L * P), Iq0, Iq1, Fq: Math.sqrt(Iq0 * Iq1) };
    }
    let last;
    cv.draw = () => {
      if (!last) return;
      const R = last, { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const bars = [
        ["érték", "értékindex", R.Iv, "--accent"],
        ["ár L", "ár: Laspeyres", R.L, "--setB"], ["ár P", "ár: Paasche", R.P, "--setB"], ["ár F", "ár: Fisher", R.F, "--setB"],
        ["vol. L", "volumen: Laspeyres", R.Iq0, "--setA"], ["vol. P", "volumen: Paasche", R.Iq1, "--setA"], ["vol. F", "volumen: Fisher", R.Fq, "--setA"]
      ].filter(b => isFinite(b[2]));
      const vals = bars.map(b => 100 * b[2]).concat([100]);
      let lo = Math.min(...vals), hi = Math.max(...vals);
      lo = Math.max(0, Math.floor((lo - 8) / 10) * 10); hi = Math.ceil((hi + 8) / 10) * 10;
      const narrow = w < 480, lab = narrow ? 52 : 132;
      const bx = { x0: lab, y0: 8, x1: w - 44, y1: H - 22 };
      const tx = v => bx.x0 + (v - lo) / (hi - lo) * (bx.x1 - bx.x0);
      const rowH = (bx.y1 - bx.y0) / bars.length;
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      rangeTicks(lo, hi, w < 480 ? 4 : 7).forEach(v => {
        ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx(v), bx.y0); ctx.lineTo(tx(v), bx.y1); ctx.stroke();
        ctx.fillText(fmt(v, 0) + "%", tx(v), bx.y1 + 5);
      });
      bars.forEach(([short, long, v, col], i) => {
        const label = narrow ? short : long;
        const y = bx.y0 + i * rowH + rowH * 0.18, hh = rowH * 0.64;
        ctx.fillStyle = css(col); ctx.globalAlpha = i === 0 ? 0.85 : 0.6;
        const xa = tx(100), xb = tx(100 * v);
        ctx.fillRect(Math.min(xa, xb), y, Math.max(1.5, Math.abs(xb - xa)), hh); ctx.globalAlpha = 1;
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "right";
        ctx.fillText(label, bx.x0 - 6, y + hh / 2);
        ctx.textAlign = "left"; ctx.fillText(pct(v, 1), Math.max(xa, xb) + 4, y + hh / 2);
      });
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(tx(100), bx.y0); ctx.lineTo(tx(100), bx.y1); ctx.stroke(); ctx.restore();
    };
    function upd() {
      D.forEach((r, i) => {
        rowCells[i].ip.textContent = fmt(r[4] / r[2], 3);
        rowCells[i].iq.textContent = r[1] > 0 ? fmt(r[3] / r[1], 3) : "–";
      });
      const R = idx(); last = R;
      statRow(sums, [["$\\sum q_0p_0$", w1Ft(R.a00)], ["$\\sum q_1p_1$", w1Ft(R.a11)], ["$\\sum q_0p_1$", w1Ft(R.a01)], ["$\\sum q_1p_0$", w1Ft(R.a10)]]);
      cv.draw();
      const ok = (a, b) => Math.abs(a - b) < 1e-9 ? " ✔" : " ✘";
      const same = Math.abs(R.L - R.P) < 5e-4;
      out.innerHTML =
        `$I_v$ = <b>${pct(R.Iv, 1)}</b> ($K_v$ = ${w1Ft(R.a11 - R.a00)} Ft) · ` +
        `ár: $I_p^{0}$ = <b>${pct(R.L, 1)}</b>, $I_p^{1}$ = <b>${pct(R.P, 1)}</b>, $I_p^{F}$ = ${pct(R.F, 1)} · ` +
        `volumen: $I_q^{0}$ = <b>${pct(R.Iq0, 1)}</b>, $I_q^{1}$ = <b>${pct(R.Iq1, 1)}</b>, $I_q^{F}$ = ${pct(R.Fq, 1)}<br>` +
        `árhatás: $K_p^{0}$ = ${w1Ft(R.a01 - R.a00)}, $K_p^{1}$ = ${w1Ft(R.a11 - R.a10)} Ft · volumenhatás: $K_q^{0}$ = ${w1Ft(R.a10 - R.a00)}, $K_q^{1}$ = ${w1Ft(R.a11 - R.a01)} Ft<br>` +
        `indexkör: $I_p^{1} \\cdot I_q^{0}$ = ${pct(R.P * R.Iq0, 1)}${ok(R.P * R.Iq0, R.Iv)} · $I_p^{0} \\cdot I_q^{1}$ = ${pct(R.L * R.Iq1, 1)}${ok(R.L * R.Iq1, R.Iv)} · ` +
        `$I_p^{F} \\cdot I_q^{F}$ = ${pct(R.F * R.Fq, 1)}${ok(R.F * R.Fq, R.Iv)} · de $I_p^{0} \\cdot I_q^{0}$ = ${pct(R.L * R.Iq0, 1)}${ok(R.L * R.Iq0, R.Iv)}<br>` +
        (same ? "A Laspeyres- és a Paasche-index (egy tizedesre) egyenlő: a kosár szerkezete nem változott, vagy minden ár egyformán változott."
          : R.L > R.P ? "Laspeyres &gt; Paasche: a jobban dráguló termékekből idén arányosan kevesebb fogy (helyettesítés)."
            : "Paasche &gt; Laspeyres: a jobban dráguló termékekből idén arányosan <em>több</em> fogy – ritkább eset.");
      window.Synopsis && Synopsis.renderMath(out);
    }
    load(0);
  };

  /* ------------------------------------------------------------------
     composition-effect – főátlag felbontása rész- és összetételhatásra
     ------------------------------------------------------------------ */
  W["composition-effect"] = root => {
    header(root, "Részhatás és összetételhatás – vízesésdiagram",
      "Állítsd a csoportok létszámát ($B$) és átlagát ($v$) a két időszakban! A diagram a $V_0 \\to V_S \\to V_1$ utat mutatja: " +
      "előbb csak az összetétel változik ($K_{\\text{Ö}}$), aztán csak a részátlagok ($K_R$).");
    const PRE = [
      { name: "Bővülő cég", unit: "ezer Ft", g: [["tapasztalt", 8, 600, 8, 630], ["kezdő", 2, 300, 12, 330]] },
      { name: "Változatlan összetétel", unit: "ezer Ft", g: [["tapasztalt", 8, 600, 8, 630], ["kezdő", 2, 300, 2, 330]] },
      { name: "Két bolt (4.2-c)", unit: "millió Ft/fő", g: [["A bolt", 2, 2.4, 4, 2.5], ["B bolt", 8, 1.4, 6, 1.5]] },
      { name: "Három üzem (NGA 9.1)", unit: "ezer Ft/fő", g: [["A", 85, 538, 138, 540], ["B", 113, 612, 110, 615], ["C", 152, 695, 114, 696]] }
    ];
    let G, unit, dec;
    const preBar = w1Seg(PRE.map(p => p.name), 0, i => load(i));
    const tblWrap = h("div", { class: "tw", style: "overflow-x:auto" });
    root.append(preBar, tblWrap);
    const cv = makeCanvas(root, innerWidth < 560 ? 0.8 : 0.48);
    const res = h("div", { class: "stat-row" });
    const out = h("div", { class: "readout" });
    root.append(res, out);

    function load(i) {
      G = PRE[i].g.map(r => r.slice()); unit = PRE[i].unit;
      dec = G.some(r => r[2] % 1 || r[4] % 1) ? 2 : 1;
      buildTable(); upd();
    }
    let shareCells;
    function buildTable() {
      const t = h("table");
      t.append(h("tr", null, h("th", null, "csoport"), h("th", { html: "$B_0$" }), h("th", { html: "$v_0$" }), h("th", { html: "$B_1$" }), h("th", { html: "$v_1$" }),
        h("th", null, "arány 0 → 1")));
      shareCells = G.map((r, i) => {
        const box = (k, opt) => numBox(r[k], opt, v => { G[i][k] = v; upd(); });
        const c = h("td");
        t.append(h("tr", null, h("td", null, r[0]),
          h("td", null, box(1, { min: 0, max: 1e5, step: 1, width: "4.2rem" })), h("td", null, box(2, { min: 0, max: 1e6, step: "any", width: "4.6rem" })),
          h("td", null, box(3, { min: 0, max: 1e5, step: 1, width: "4.2rem" })), h("td", null, box(4, { min: 0, max: 1e6, step: "any", width: "4.6rem" })), c));
        return c;
      });
      tblWrap.replaceChildren(t);
      window.Synopsis && Synopsis.renderMath(t);
    }
    function calc() {
      const B0 = G.map(r => r[1]), v0 = G.map(r => r[2]), B1 = G.map(r => r[3]), v1 = G.map(r => r[4]);
      const s0 = sum(B0), s1 = sum(B1);
      if (s0 <= 0 || s1 <= 0) return null;
      const V0 = sumProd(B0, v0) / s0, V1 = sumProd(B1, v1) / s1, VS = sumProd(B1, v0) / s1;
      return { B0, B1, s0, s1, V0, V1, VS, KT: V1 - V0, KR: V1 - VS, KO: VS - V0 };
    }
    let last;
    cv.draw = () => {
      const R = last, { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      if (!R) return;
      const vals = [R.V0, R.VS, R.V1];
      const mn = Math.min(...vals), mx = Math.max(...vals), rg = Math.max(mx - mn, Math.abs(mx) * 0.02, 1e-9);
      let lo = mn - 1.2 * rg, hi = mx + 0.35 * rg;
      if (lo < 0 || mn - 1.2 * rg < 0.15 * mx) lo = Math.max(0, lo);
      const truncated = lo > 0;
      const tk = rangeTicks(lo, hi, 5);
      const bx = { x0: 54, y0: 16, x1: w - 10, y1: H - 30 };
      const { tx, ty } = axes(ctx, bx, { xmin: -0.5, xmax: 4.5, ymin: lo, ymax: hi, xticks: [], yticks: tk });
      const bw = Math.min(70, (tx(1) - tx(0)) * 0.62);
      const col = (i, a, b, color, alpha, label, val) => {
        const ya = ty(a), yb = ty(b);
        ctx.fillStyle = css(color); ctx.globalAlpha = alpha;
        ctx.fillRect(tx(i) - bw / 2, Math.min(ya, yb), bw, Math.max(1.5, Math.abs(yb - ya))); ctx.globalAlpha = 1;
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(label, tx(i), bx.y1 + 6);
        ctx.textBaseline = "bottom"; ctx.font = "bold 12px system-ui, sans-serif";
        ctx.fillText(val, tx(i), Math.min(ya, yb) - 3);
      };
      const base = truncated ? lo : 0;
      col(0, base, R.V0, "--muted", 0.55, "V₀", fmt(R.V0, dec));
      col(1, R.V0, R.VS, R.KO >= 0 ? "--ok" : "--bad", 0.75, "összetétel", (R.KO >= 0 ? "+" : "−") + fmt(Math.abs(R.KO), dec));
      col(2, base, R.VS, "--setC", 0.45, "Vₛ", fmt(R.VS, dec));
      col(3, R.VS, R.V1, R.KR >= 0 ? "--ok" : "--bad", 0.75, "részhatás", (R.KR >= 0 ? "+" : "−") + fmt(Math.abs(R.KR), dec));
      col(4, base, R.V1, "--accent", 0.75, "V₁", fmt(R.V1, dec));
      // összekötő szaggatott vonalak
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      [[0, 1, R.V0], [1, 2, R.VS], [2, 3, R.VS], [3, 4, R.V1]].forEach(([a, b, v]) => {
        ctx.beginPath(); ctx.moveTo(tx(a) + bw / 2, ty(v)); ctx.lineTo(tx(b) - bw / 2, ty(v)); ctx.stroke();
      });
      ctx.restore();
      if (truncated) {
        ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText("a függőleges tengely nem 0-ról indul", bx.x0 + 6, 2);
      }
    };
    function upd() {
      const R = calc(); last = R;
      if (R) shareCells.forEach((c, i) => { c.textContent = `${fmt(100 * R.B0[i] / R.s0, 1)}% → ${fmt(100 * R.B1[i] / R.s1, 1)}%`; });
      cv.draw();
      if (!R) { res.replaceChildren(); out.textContent = "Mindkét időszakban legyen legalább egy fő!"; return; }
      const sg = x => (x >= 0 ? "+" : "−") + fmt(Math.abs(x), dec);
      statRow(res, [["$V_0$", fmt(R.V0, dec)], ["$V_S$", fmt(R.VS, dec)], ["$V_1$", fmt(R.V1, dec)],
        ["$I_F$", pct(R.V1 / R.V0, 1)], ["$I_R$", pct(R.V1 / R.VS, 1)], ["$I_{\\text{Ö}}$", pct(R.VS / R.V0, 1)]]);
      const allUp = G.every(r => r[4] > r[2]), allDown = G.every(r => r[4] < r[2]);
      let msg = "";
      if (allUp && R.KT < 0) msg = "<br><b>Paradoxon:</b> minden csoportban nőtt az átlag, a főátlag mégis csökkent – az összetételhatás erősebb.";
      else if (allDown && R.KT > 0) msg = "<br><b>Paradoxon:</b> minden csoportban csökkent az átlag, a főátlag mégis nőtt – az összetételhatás erősebb.";
      out.innerHTML = `$K_T = K_R + K_{\\text{Ö}}$: <b>${sg(R.KT)}</b> = ${sg(R.KR)} ${R.KO >= 0 ? "+" : "−"} ${fmt(Math.abs(R.KO), dec)} (${unit}) · ` +
        `$I_F = I_R \\cdot I_{\\text{Ö}}$: ${pct(R.V1 / R.V0, 1)} = ${pct(R.V1 / R.VS, 1)} · ${pct(R.VS / R.V0, 1)}` + msg;
      window.Synopsis && Synopsis.renderMath(out);
    }
    load(0);
  };
