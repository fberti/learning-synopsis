
  /* ==================================================================
     w2 – közös segédek (w2-előtaggal)
     ================================================================== */
  /* CSS-szín → [r, g, b] (a vászon fillStyle-normalizálásával), és két szín keveréke */
  const w2Ctx = document.createElement("canvas").getContext("2d");
  function w2Rgb(col) {
    w2Ctx.fillStyle = "#000"; w2Ctx.fillStyle = col;
    const s = w2Ctx.fillStyle;
    if (s[0] === "#") return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
    const m = s.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [128, 128, 128];
  }
  const w2Mix = (a, b, t) => { const A = w2Rgb(a), B = w2Rgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
  const w2Pct = (x, d = 1) => (isFinite(x) ? fmt(100 * x, d) + "%" : "–");
  const w2Ctl = (...kids) => h("div", { class: "controls" }, ...kids);
  const w2Seg = (labels, onPick) => { // gombcsoport egy kiválasztottal (.btn.on)
    const bs = labels.map((l, i) => btn(l, () => pick(i)));
    function pick(i, silent) { bs.forEach((b, j) => b.classList.toggle("on", i === j)); if (!silent) onPick(i); }
    return { bs, pick };
  };

  /* Csoportosított oszlopdiagram: groups = [{ label, vals: [{ v, col }], low: [szöveg oszloponként] }] */
  function w2Bars(ctx, bx, groups, { ymax = 100, yticks = [0, 20, 40, 60, 80, 100], ylabel = "", top = v => Math.round(v) + "%" } = {}) {
    const { ty } = axes(ctx, bx, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks, ylabel });
    const gw = (bx.x1 - bx.x0) / groups.length, gap = 3;
    groups.forEach((g, gi) => {
      const k = g.vals.length, cx = bx.x0 + gw * (gi + 0.5);
      const bw = Math.min(48, (gw * 0.82 - (k - 1) * gap) / k), left = cx - (k * bw + (k - 1) * gap) / 2;
      g.vals.forEach((b, j) => {
        if (b.v == null || !isFinite(b.v)) return;
        const x = left + j * (bw + gap);
        ctx.fillStyle = css(b.col); ctx.fillRect(x, ty(b.v), bw, ty(0) - ty(b.v));
        ctx.fillStyle = css("--text"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        if (bw >= 26) { ctx.font = "11px system-ui, sans-serif"; ctx.fillText(top(b.v), x + bw / 2, ty(b.v) - 2); }
        else if (bw >= 11) { ctx.font = "9px system-ui, sans-serif"; ctx.fillText(String(Math.round(b.v)), x + bw / 2, ty(b.v) - 1); }
      });
      ctx.textBaseline = "top"; ctx.textAlign = "center";
      let y = bx.y1 + 4;
      if (g.low) {
        ctx.font = "10px system-ui, sans-serif";
        const fits = g.low.every(s => ctx.measureText(s).width <= bw + gap);
        if (fits) { g.low.forEach((s, j) => { ctx.fillStyle = css(g.vals[j].col); ctx.fillText(s, left + j * (bw + gap) + bw / 2, y); }); y += 13; }
        else g.low.forEach((s, j) => { ctx.fillStyle = css(g.vals[j].col); ctx.fillText(s, cx, y); y += 12; });
      }
      ctx.font = "600 11px system-ui, sans-serif"; ctx.fillStyle = css("--text");
      ctx.fillText(g.label, cx, y + 1);
    });
    return ty;
  }
  function w2Legend(ctx, x, y, items) { // items: [[szöveg, színváltozó]]
    ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    items.forEach(([t, c]) => {
      ctx.fillStyle = css(c); ctx.fillRect(x, y - 5, 10, 10);
      ctx.fillStyle = css("--text"); ctx.fillText(t, x + 14, y);
      x += 22 + ctx.measureText(t).width;
    });
  }
  /* legkisebb négyzetes egyenes (ha értelmezhető) */
  const w2Fit = (x, y) => { const sx = psd(x); if (!(sx > 0)) return null; const b = pcov(x, y) / sx ** 2; return { b, a: mean(y) - b * mean(x) }; };
  /* makeCanvas, de a magasság max(minH, aspect · szélesség) – vagy hFn(szélesség), ha meg van adva */
  function w2Canvas(parent, aspect, minH = 0, maxW = 760, hFn = null) {
    const cv = makeCanvas(parent, aspect, maxW);
    cv.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW);
      const hh = Math.round(hFn ? hFn(w) : Math.max(minH, w * aspect));
      const dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv.w = w; cv.h = hh;
    };
    cv.resize();
    return cv;
  }
  const w2Prose = "font-family:var(--font)";

  /* ------------------------------------------------------------------
     3.2  Kontingencia-tábla: megfigyelt kontra várt
     ------------------------------------------------------------------ */
  W["contingency-assoc"] = root => {
    header(root, "Kontingencia-tábla: megfigyelt kontra várt",
      "Írd át a cellákat, vagy válassz kész táblát. A cella színe azt mutatja, hogy a megfigyelt gyakoriság <b>több</b> (▲, kék) vagy " +
      "<b>kevesebb</b> (▼, narancs), mint amennyi függetlenség esetén várható: $f^*_{ij} = f_{i\\cdot}\\, f_{\\cdot j}/N$. " +
      "Az alsó ábra a sorszázalékokat mutatja: ha a sávok egyformák, a két ismérv független.");
    const PRE = [
      { name: "Dohányzás × nem (200 fő)", rows: ["Férfi", "Nő"], cols: ["dohányzik", "nem dohányzik"], t: [[30, 70], [20, 80]] },
      { name: "Iparág × bírság (NGA, 50 cég)", rows: ["Textilipar", "Élelmiszeripar"], cols: ["fizetett", "nem fizetett"], t: [[18, 2], [5, 25]],
        note: "Tankönyvi példa: Némethné Gál Andrea: Általános statisztika (2000) – 50 cég környezetszennyezési bírsága." },
      { name: "Végzettség × olvasás (300 fő)", rows: ["alapfokú", "középfokú", "felsőfokú"], cols: ["soha", "néha", "rendszeresen"], t: [[40, 45, 15], [30, 50, 20], [10, 40, 50]] },
      { name: "Független tábla", rows: ["A", "B"], cols: ["igen", "nem"], t: [[20, 30], [40, 60]] }
    ];
    const SIZES = [[2, 2], [2, 3], [3, 3]];
    const DEF_R = ["1. sor", "2. sor", "3. sor"], DEF_C = ["1. oszlop", "2. oszlop", "3. oszlop"];
    const COLS = ["--setA", "--setB", "--setC"];
    let rows, cols, t, note = "", msg = "";

    const sel = h("select", null, ...PRE.map((p, i) => h("option", { value: i }, p.name)));
    sel.addEventListener("change", () => load(+sel.value));
    const size = w2Seg(SIZES.map(([b, c]) => `${b}×${c}`), i => resize(...SIZES[i]));
    root.append(w2Ctl(labelWrap("tábla:", sel)),
      w2Ctl(h("span", { class: "muted", style: "font-size:.92rem" }, "méret:"), ...size.bs,
        btn("minden cella × 2", () => {
          const before = calc().chi;
          t = t.map(r => r.map(v => v * 2));
          const after = calc().chi;
          msg = isFinite(before) && isFinite(after)
            ? `Minden cella duplázva: a $\\chi^2$ ${fmt(before, 2)} → ${fmt(after, 2)} (kétszeresére nőtt), de $V$ és $Q$ nem változott. ` +
              "A $\\chi^2$ a minta nagyságától is függ, ezért a kapcsolat erősségét a $V$ (vagy 2×2-nél a $Q$) méri."
            : "";
          build();
        })));
    const tw = h("div", { class: "two-col" });
    const obsBox = h("div", { class: "tw", style: "overflow-x:auto" }), expBox = h("div", { class: "tw", style: "overflow-x:auto" });
    tw.append(h("div", null, h("div", { class: "muted", style: "font-size:.88rem" }, "Megfigyelt gyakoriságok ($f_{ij}$) – szerkeszthető"), obsBox),
      h("div", null, h("div", { class: "muted", style: "font-size:.88rem" }, "Várt gyakoriságok függetlenség esetén ($f^*_{ij}$)"), expBox));
    root.append(tw);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    root.append(h("div", { class: "muted", style: "font-size:.88rem;margin-top:.8rem" }, "Sorszázalékok (feltételes eloszlások) és az összesített megoszlás:"));
    const cv = w2Canvas(root, 0, 0, 760, () => 34 + ((t ? t.length : 2) + 1) * 30);
    const out = h("div", { class: "readout" }), noteEl = h("p", { class: "muted", style: "font-size:.85rem;margin:.4rem 0 0" });
    root.append(out, noteEl);

    function calc() {
      const b = t.length, c = t[0].length;
      const R = t.map(r => r.reduce((s, v) => s + v, 0)), C = t[0].map((_, j) => t.reduce((s, r) => s + r[j], 0));
      const N = R.reduce((s, v) => s + v, 0);
      const E = t.map((r, i) => r.map((_, j) => (N > 0 ? R[i] * C[j] / N : NaN)));
      const ok = N > 0 && R.every(v => v > 0) && C.every(v => v > 0);
      let chi = NaN;
      if (ok) { chi = 0; t.forEach((r, i) => r.forEach((v, j) => { chi += (v - E[i][j]) ** 2 / E[i][j]; })); }
      const V = ok ? Math.sqrt(chi / (N * Math.min(b - 1, c - 1))) : NaN;
      let Q = NaN;
      if (b === 2 && c === 2) { const ad = t[0][0] * t[1][1], bc = t[0][1] * t[1][0]; Q = ad + bc > 0 ? (ad - bc) / (ad + bc) : NaN; }
      return { b, c, R, C, N, E, chi, V, Q };
    }

    const cellStyle = z => {
      if (!isFinite(z) || Math.abs(z) < 0.05) return "";
      const p = Math.round(Math.min(1, Math.abs(z) / 3) * 45) + 6;
      return `background:color-mix(in srgb, var(${z > 0 ? "--setA" : "--setB"}) ${p}%, var(--card))`;
    };
    const th = (txt, extra = "") => h("th", { style: "white-space:nowrap;font-size:.85rem;padding:.3em .45em;" + extra }, txt);
    const tdS = "padding:.3em .45em;white-space:nowrap;";

    function build() {
      const K = calc();
      /* megfigyelt tábla */
      const tb = h("table", { style: "width:auto;margin:.3rem 0" });
      tb.append(h("tr", null, th(""), ...cols.map(c => th(c)), th("Σ", "color:var(--muted)")));
      t.forEach((r, i) => {
        const tr = h("tr", null, th(rows[i], "text-align:left"));
        r.forEach((v, j) => {
          const z = isFinite(K.E[i][j]) && K.E[i][j] > 0 ? (v - K.E[i][j]) / Math.sqrt(K.E[i][j]) : NaN;
          const inp = h("input", { type: "number", min: 0, step: 1, value: v, style: "width:4.3em;padding:.2rem .3rem", "aria-label": `${rows[i]} – ${cols[j]}` });
          const mark = h("span", { class: "w2mark", style: "display:inline-block;width:1em;margin-left:.2em;font-size:.8rem;color:var(--muted)" },
            isFinite(z) && Math.abs(z) >= 0.05 ? (z > 0 ? "▲" : "▼") : "");
          inp.addEventListener("input", () => {
            const nv = Math.max(0, Math.floor(+inp.value || 0));
            t[i][j] = nv; msg = ""; refresh();
          });
          inp.addEventListener("change", () => { inp.value = t[i][j]; });
          tr.append(h("td", { style: tdS + cellStyle(z), "data-cell": `${i}-${j}` }, inp, mark));
        });
        tr.append(h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)", "data-rsum": i }, String(K.R[i])));
        tb.append(tr);
      });
      tb.append(h("tr", null, th("Σ", "text-align:left;color:var(--muted)"),
        ...K.C.map((v, j) => h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)", "data-csum": j }, String(v))),
        h("td", { style: tdS + "font-family:var(--mono);font-weight:700", "data-n": "" }, String(K.N))));
      obsBox.replaceChildren(tb);
      cv.resize();
      refresh();
    }

    function refresh() {
      const K = calc();
      /* megfigyelt tábla: színek, jelek, peremek frissítése (a beviteli mezőket nem építjük újra, hogy a fókusz megmaradjon) */
      t.forEach((r, i) => r.forEach((v, j) => {
        const td = obsBox.querySelector(`[data-cell="${i}-${j}"]`);
        if (!td) return;
        const z = isFinite(K.E[i][j]) && K.E[i][j] > 0 ? (v - K.E[i][j]) / Math.sqrt(K.E[i][j]) : NaN;
        td.setAttribute("style", tdS + cellStyle(z));
        td.querySelector(".w2mark").textContent = isFinite(z) && Math.abs(z) >= 0.05 ? (z > 0 ? "▲" : "▼") : "";
        const inp = td.querySelector("input");
        if (document.activeElement !== inp) inp.value = v;
      }));
      K.R.forEach((v, i) => { const e = obsBox.querySelector(`[data-rsum="${i}"]`); if (e) e.textContent = v; });
      K.C.forEach((v, j) => { const e = obsBox.querySelector(`[data-csum="${j}"]`); if (e) e.textContent = v; });
      const nEl = obsBox.querySelector("[data-n]"); if (nEl) nEl.textContent = K.N;
      /* várt tábla */
      const te = h("table", { style: "width:auto;margin:.3rem 0" });
      te.append(h("tr", null, th(""), ...cols.map(c => th(c)), th("Σ", "color:var(--muted)")));
      K.E.forEach((r, i) => te.append(h("tr", null, th(rows[i], "text-align:left"),
        ...r.map(v => h("td", { style: tdS + "font-family:var(--mono)" }, fmt(v, 1))),
        h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)" }, String(K.R[i])))));
      te.append(h("tr", null, th("Σ", "text-align:left;color:var(--muted)"),
        ...K.C.map(v => h("td", { style: tdS + "font-family:var(--mono);color:var(--muted)" }, String(v))),
        h("td", { style: tdS + "font-family:var(--mono);font-weight:700" }, String(K.N))));
      expBox.replaceChildren(te);
      /* kijelzők */
      const strength = !isFinite(K.V) ? "–" : K.V < 0.0005 ? "független" : K.V < 0.4 ? "gyenge" : K.V <= 0.6 ? "közepes" : "szoros";
      const st = [stat("$N$", String(K.N)), stat("$\\chi^2$", fmt(K.chi, 2)), stat("Cramér-féle $V$", fmt(K.V, 3))];
      if (K.b === 2 && K.c === 2) st.push(stat("Yule-féle $Q$", fmt(K.Q, 3)));
      st.push(stat("kapcsolat", strength));
      stats.replaceChildren(...st);
      let txt = "";
      if (!(K.N > 0)) txt = "A tábla üres – írj be gyakoriságokat!";
      else if (!isFinite(K.chi)) txt = "Van üres sor vagy oszlop (0 perem): ott a várt gyakoriság 0, így a $\\chi^2$ és a $V$ nem értelmezhető (–).";
      else txt = `$\\chi^2 = \\sum (f - f^*)^2/f^* = ${fmt(K.chi, 2).replace(",", "{,}")}$<br>` +
        `$V = \\sqrt{\\chi^2/(N\\cdot ${Math.min(K.b - 1, K.c - 1)})} = ${fmt(K.V, 3).replace(",", "{,}")}$` +
        (K.b === 2 && K.c === 2 && isFinite(K.Q) ? `<br>$Q = (ad - bc)/(ad + bc) = ${fmt(K.Q, 3).replace(",", "{,}")}$` : "") +
        ` → <b>${strength}</b> kapcsolat.`;
      out.innerHTML = txt + (msg ? "<br>" + msg : "");
      noteEl.textContent = note;
      window.Synopsis && Synopsis.renderMath(stats);
      window.Synopsis && Synopsis.renderMath(out);
      cv.draw();
    }

    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const K = calc();
      const lab = [...rows, "összesen"], data = [...t, K.C];
      ctx.font = "12px system-ui, sans-serif";
      const lw = Math.min(w * 0.3, Math.max(...lab.map(s => ctx.measureText(s).width)) + 10);
      const x0 = lw, x1 = w - 8, top = 24, rowH = 30;
      /* jelmagyarázat */
      let lx = x0;
      ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      cols.forEach((c, j) => {
        ctx.fillStyle = css(COLS[j]); ctx.fillRect(lx, 7, 10, 10);
        ctx.fillStyle = css("--text"); ctx.fillText(c, lx + 14, 12);
        lx += 24 + ctx.measureText(c).width;
      });
      data.forEach((r, i) => {
        const y = top + i * rowH + (i === data.length - 1 ? 4 : 0), bh = rowH - 7, s = r.reduce((a, v) => a + v, 0);
        ctx.font = (i === data.length - 1 ? "600 " : "") + "12px system-ui, sans-serif";
        ctx.fillStyle = css("--text"); ctx.textAlign = "right"; ctx.fillText(lab[i], x0 - 8, y + bh / 2);
        if (!(s > 0)) { ctx.fillStyle = css("--muted"); ctx.textAlign = "left"; ctx.fillText("–", x0 + 4, y + bh / 2); return; }
        let x = x0;
        r.forEach((v, j) => {
          const ww = (x1 - x0) * v / s;
          ctx.fillStyle = css(COLS[j]); ctx.globalAlpha = i === data.length - 1 ? 1 : 0.85;
          ctx.fillRect(x, y, ww, bh); ctx.globalAlpha = 1;
          ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center";
          const lbl = Math.round(100 * v / s) + "%";
          if (ww > ctx.measureText(lbl).width + 6) { ctx.fillStyle = "#fff"; ctx.fillText(lbl, x + ww / 2, y + bh / 2 + 0.5); }
          x += ww;
        });
        if (i === data.length - 1) { ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.2; ctx.strokeRect(x0, y, x1 - x0, bh); }
      });
    };

    function resize(b, c) {
      t = Array.from({ length: b }, (_, i) => Array.from({ length: c }, (_, j) => (t[i] && t[i][j] != null ? t[i][j] : 10)));
      rows = Array.from({ length: b }, (_, i) => rows[i] || DEF_R[i]);
      cols = Array.from({ length: c }, (_, j) => cols[j] || DEF_C[j]);
      note = ""; msg = ""; build();
    }
    function load(k) {
      const p = PRE[k];
      t = p.t.map(r => r.slice()); rows = p.rows.slice(); cols = p.cols.slice(); note = p.note || ""; msg = "";
      size.pick(SIZES.findIndex(([b, c]) => b === t.length && c === t[0].length), true);
      build();
    }
    load(0);
  };

  /* ------------------------------------------------------------------
     3.7  Simpson-paradoxon: felvételi két szakra + Berkeley 1973
     ------------------------------------------------------------------ */
  W["simpson-slider"] = root => {
    header(root, "Simpson-paradoxon: felvételi két szakra",
      "1000 férfi és 1000 nő jelentkezik két szakra. A felvételi arány rögzített: a <b>könnyű</b> szakon férfi 60%, nő 65%; " +
      "a <b>nehéz</b> szakon férfi 20%, nő 25% – a nők <b>mindkét</b> szakon jobbak. A csúszkákkal azt állítod, ki hova jelentkezik. " +
      "Figyeld az „összesen” oszlopokat!");
    const tabs = w2Seg(["Szimulált: két szak", "Berkeley, 1973 (valódi adatok)"], i => setTab(i));
    root.append(w2Ctl(...tabs.bs));
    const pS = h("div"), pB = h("div");
    root.append(pS, pB);

    /* --- szimulált --- */
    const RATE = { m: [0.6, 0.2], f: [0.65, 0.25] }, NN = 1000;
    const sf = slider(0, 100, 1, 80), sm = slider(0, 100, 1, 20), sfO = h("b"), smO = h("b");
    pS.append(w2Ctl(labelWrap("a nők hány %-a jelentkezik a nehéz szakra:", sf, sfO)),
      w2Ctl(labelWrap("a férfiak hány %-a:", sm, smO)));
    const cv = w2Canvas(pS, 0.5, 280);
    const stS = h("div", { class: "stat-row" }), msgS = h("div", { class: "readout" });
    pS.append(stS, msgS);
    const simData = () => {
      const g = (s, pHard) => {
        const nH = Math.round(NN * pHard), nE = NN - nH;
        const aE = Math.round(nE * RATE[s][0]), aH = Math.round(nH * RATE[s][1]);
        return [{ a: aE, n: nE }, { a: aH, n: nH }, { a: aE + aH, n: NN }];
      };
      return { m: g("m", +sm.value / 100), f: g("f", +sf.value / 100) };
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const d = simData();
      const groups = ["könnyű szak", "nehéz szak", "összesen"].map((label, g) => ({
        label,
        vals: [{ v: d.m[g].n ? 100 * d.m[g].a / d.m[g].n : NaN, col: "--setA" }, { v: d.f[g].n ? 100 * d.f[g].a / d.f[g].n : NaN, col: "--setB" }],
        low: [`${d.m[g].a}/${d.m[g].n}`, `${d.f[g].a}/${d.f[g].n}`]
      }));
      const bx = { x0: 34, y0: 30, x1: w - 8, y1: H - 50 };
      w2Bars(ctx, bx, groups, { ylabel: "felvételi arány (%)" });
      w2Legend(ctx, w - 110, 12, [["férfi", "--setA"], ["nő", "--setB"]]);
      /* az „összesen” csoport kiemelése */
      const gw = (bx.x1 - bx.x0) / 3;
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx.x0 + 2 * gw, bx.y0); ctx.lineTo(bx.x0 + 2 * gw, bx.y1); ctx.stroke(); ctx.restore();
    };
    function updS() {
      sfO.textContent = sf.value + "%"; smO.textContent = sm.value + "%";
      cv.draw();
      const d = simData(), m = d.m[2].a / NN, f = d.f[2].a / NN;
      stS.replaceChildren(stat("férfiak összesen", `${w2Pct(m)} (${d.m[2].a}/${NN})`), stat("nők összesen", `${w2Pct(f)} (${d.f[2].a}/${NN})`));
      const base = "Miért? A nehéz szakon mindenkinek kicsi az esélye. Aki oda jelentkezik, annak az összesített aránya lemegy – " +
        "a <b>szak</b> itt a zavaró (háttér)változó, amely a nemmel és a felvétellel is összefügg.";
      if (m > f + 1e-12) {
        msgS.style.cssText = w2Prose + ";background:var(--bad-soft);border-left:4px solid var(--bad)";
        msgS.innerHTML = "<b style='color:var(--bad)'>Simpson-paradoxon: szakonként a nők jobbak, összesítve a férfiak!</b><br>" + base;
      } else {
        msgS.style.cssText = w2Prose;
        msgS.innerHTML = (Math.abs(m - f) < 1e-12 ? "Összesítve egyforma a két arány. " : "Nincs paradoxon: összesítve is a nők aránya nagyobb. ") +
          "Próbáld ki: küldd a nők többségét a nehéz szakra, a férfiakat a könnyűre!";
      }
    }
    sf.addEventListener("input", updS); sm.addEventListener("input", updS);

    /* --- Berkeley, 1973 --- */
    const BK = { // [felvett, jelentkező]
      m: { A: [512, 825], B: [353, 560], C: [120, 325], D: [138, 417], E: [53, 191], F: [22, 373] },
      f: { A: [89, 108], B: [17, 25], C: [202, 593], D: [131, 375], E: [94, 393], F: [24, 341] }
    };
    const DEP = Object.keys(BK.m);
    const tot = s => DEP.reduce((a, k) => [a[0] + BK[s][k][0], a[1] + BK[s][k][1]], [0, 0]);
    const TM = tot("m"), TF = tot("f");
    pB.append(h("p", { class: "muted", style: "font-size:.9rem;margin:.2rem 0" },
      "A Kaliforniai Egyetem (Berkeley) hat legnagyobb szakja, 1973 ősz. Fent a felvételi arányok, lent az, hogy a férfi, illetve a női jelentkezők hány %-a jelentkezett az adott szakra."));
    const cvB = w2Canvas(pB, 0.78, 470);
    const stB = h("div", { class: "stat-row" });
    pB.append(stB);
    const tbl = h("table", { style: "width:auto;font-size:.85rem;margin:.6rem 0" });
    tbl.append(h("tr", null, ...["szak", "férfi: felvett/jelentk.", "arány", "nő: felvett/jelentk.", "arány", "jobb"].map(s => h("th", { style: "padding:.25em .45em;white-space:nowrap" }, s))));
    const tdc = (s, extra = "") => h("td", { style: "padding:.25em .45em;white-space:nowrap;font-family:var(--mono);" + extra }, s);
    [...DEP, "Σ"].forEach(k => {
      const [ma, mn] = k === "Σ" ? TM : BK.m[k], [fa, fn] = k === "Σ" ? TF : BK.f[k];
      const better = fa / fn > ma / mn ? "nő" : "férfi";
      tbl.append(h("tr", k === "Σ" ? { style: "font-weight:700" } : null, tdc(k === "Σ" ? "összesen" : k), tdc(`${ma}/${mn}`), tdc(w2Pct(ma / mn), "color:var(--setA)"),
        tdc(`${fa}/${fn}`), tdc(w2Pct(fa / fn), "color:var(--setB)"), tdc(better, better === "nő" ? "color:var(--setB)" : "color:var(--setA)")));
    });
    pB.append(h("div", { class: "tw", style: "overflow-x:auto" }, tbl));
    pB.append(h("div", { class: "readout", style: w2Prose },
      "Összesítve a férfiak aránya jóval nagyobb (44,5% kontra 30,4%), pedig a hat szakból négyen (A, B, D, F) a nők aránya a nagyobb, " +
      "a másik kettőn (C, E) is csak kicsi a különbség. A magyarázat: a nők főleg a sok jelentkezőt elutasító C–F szakokra jelentkeztek, " +
      "a férfiak nagy része a könnyebb A és B szakra."));
    pB.append(h("p", { class: "muted", style: "font-size:.8rem;margin:.4rem 0 0" },
      "Forrás: Bickel, P. J., Hammel, E. A., O'Connell, J. W. (1975): Sex Bias in Graduate Admissions: Data from Berkeley. Science 187, 398–404; " +
      "az R „UCBAdmissions” adatkészlete."));
    cvB.draw = () => {
      const { ctx, w, h: H } = cvB; ctx.clearRect(0, 0, w, H);
      const g1 = [...DEP, "össz."].map(k => {
        const [ma, mn] = k === "össz." ? TM : BK.m[k], [fa, fn] = k === "össz." ? TF : BK.f[k];
        return { label: k, vals: [{ v: 100 * ma / mn, col: "--setA" }, { v: 100 * fa / fn, col: "--setB" }] };
      });
      const mid = Math.round(H * 0.56);
      const b1 = { x0: 34, y0: 30, x1: w - 8, y1: mid - 22 };
      w2Bars(ctx, b1, g1, { ylabel: "felvételi arány (%)" });
      w2Legend(ctx, w - 110, 12, [["férfi", "--setA"], ["nő", "--setB"]]);
      const gw = (b1.x1 - b1.x0) / g1.length;
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(b1.x0 + 6 * gw, b1.y0); ctx.lineTo(b1.x0 + 6 * gw, b1.y1); ctx.stroke(); ctx.restore();
      const g2 = DEP.map(k => ({ label: k, vals: [{ v: 100 * BK.m[k][1] / TM[1], col: "--setA" }, { v: 100 * BK.f[k][1] / TF[1], col: "--setB" }] }));
      const b2 = { x0: 34, y0: mid + 22, x1: b1.x0 + 6 * gw, y1: H - 22 };
      w2Bars(ctx, b2, g2, { ymax: 40, yticks: [0, 10, 20, 30, 40], ylabel: "a jelentkezők hány %-a jelentkezett ide" });
    };
    stB.append(stat("férfiak összesen", `${w2Pct(TM[0] / TM[1])} (${TM[0]}/${TM[1]})`), stat("nők összesen", `${w2Pct(TF[0] / TF[1])} (${TF[0]}/${TF[1]})`));

    function setTab(i) {
      pS.style.display = i ? "none" : ""; pB.style.display = i ? "" : "none";
      const c = i ? cvB : cv; c.resize(); c.draw();
    }
    tabs.pick(0, true); setTab(0); updS();
  };

  /* ------------------------------------------------------------------
     3.7  Látszólagos korreláció: két független véletlen bolyongás
     ------------------------------------------------------------------ */
  W["spurious"] = root => {
    header(root, "Két független véletlen bolyongás",
      "Két egymástól <b>teljesen független</b> sorozatot generálunk. „Véletlen bolyongásnál” minden lépés az előző értékhez ad egy véletlen számot " +
      "($x_t = x_{t-1} + \\varepsilon_t$), így a sorozat hosszan elkóborol – trendel. „Független zajnál” minden érték új: $x_t = \\varepsilon_t$. " +
      "Nézd meg, mekkora $r$ jön ki a kettő között!");
    let type = 0, X = [], Y = [], sim = null;
    const rnd = mulberry32(23), rndSim = mulberry32(777); // a 23-as mag első párja látványosan korrelál (r ≈ 0,85)
    const types = w2Seg(["véletlen bolyongás (trendelő)", "független zaj"], i => { type = i; newPair(); });
    const nS = slider(20, 200, 10, 50), nO = h("b");
    root.append(w2Ctl(...types.bs),
      w2Ctl(labelWrap("hossz $n$:", nS, nO), btn("Új pár", () => newPair(), "btn primary"), btn("1000 pár szimulálása", () => simulate())));
    const cvT = w2Canvas(root, 0.3, 170);
    const grid = h("div", { class: "two-col", style: "margin-top:.6rem" }), c1 = h("div"), c2 = h("div");
    grid.append(c1, c2); root.append(grid);
    const cvS = makeCanvas(c1, 0.82, 420), cvH = makeCanvas(c2, 0.82, 420);
    const stats = h("div", { class: "stat-row" }), out = h("div", { class: "readout" });
    root.append(stats, out,
      h("p", { style: "margin:.6rem 0 0;font-size:.95rem" }, h("b", null, "Tanulság: "),
        "A két sorozatnak semmi köze egymáshoz – mégis gyakran „erősen korrelál”, mert mindkettő trendel."));

    const series = (n, tp, r) => { let s = 0; return Array.from({ length: n }, () => { const e = normal(r); s = tp ? e : s + e; return s; }); };
    const z = a => { const m = mean(a), s = psd(a) || 1; return a.map(v => (v - m) / s); };

    function newPair() {
      const n = +nS.value;
      X = series(n, type, rnd); Y = series(n, type, rnd);
      upd();
    }
    function simulate() {
      const n = +nS.value, res = [[], []];
      for (let tp = 0; tp < 2; tp++) for (let k = 0; k < 1000; k++) res[tp].push(pearson(series(n, tp, rndSim), series(n, tp, rndSim)));
      sim = { n, res, share: res.map(a => a.filter(r => Math.abs(r) > 0.5).length / a.length) };
      upd();
    }
    function upd() {
      nO.textContent = nS.value;
      cvT.draw(); cvS.draw(); cvH.draw();
      const r = pearson(X, Y);
      const st = [stat("$r$ (ez a pár)", fmt(r, 2))];
      if (sim) st.push(stat("$|r| > 0{,}5$ – bolyongás", w2Pct(sim.share[0])), stat("$|r| > 0{,}5$ – zaj", w2Pct(sim.share[1])));
      stats.replaceChildren(...st);
      out.innerHTML = `n = <b>${X.length}</b>, ${type ? "független zaj" : "véletlen bolyongás"}: r = <b>${fmt(r, 2)}</b>` +
        (Math.abs(r) > 0.5 ? " – „erős” kapcsolatnak látszik, pedig a két sorozat független!" : "") +
        (sim ? `<br>1000 független pár (n = ${sim.n}): |r| > 0,5 a bolyongásoknál az esetek <b>${w2Pct(sim.share[0])}</b>-ában, ` +
          `a független zajnál <b>${w2Pct(sim.share[1])}</b>-ában.` : "<br>Kattints az „1000 pár szimulálása” gombra: milyen gyakori a nagy |r|?");
      window.Synopsis && Synopsis.renderMath(stats);
    }
    nS.addEventListener("input", () => { newPair(); if (sim) simulate(); });

    cvT.draw = () => {
      const { ctx, w, h: H } = cvT; ctx.clearRect(0, 0, w, H);
      if (!X.length) return;
      const zx = z(X), zy = z(Y), n = X.length;
      const M = Math.max(2.5, ...zx.map(Math.abs), ...zy.map(Math.abs));
      const bx = { x0: 30, y0: 22, x1: w - 8, y1: H - 36 };
      const { tx, ty } = axes(ctx, bx, { xmin: 1, xmax: n, ymin: -M, ymax: M, xticks: rangeTicks(1, n, 8).filter(v => v >= 1), yticks: [-2, 0, 2], xlabel: "idő (t)" });
      [[zx, "--setA"], [zy, "--setB"]].forEach(([a, c]) => {
        ctx.strokeStyle = css(c); ctx.lineWidth = 2; ctx.beginPath();
        a.forEach((v, i) => (i ? ctx.lineTo(tx(i + 1), ty(v)) : ctx.moveTo(tx(i + 1), ty(v))));
        ctx.stroke();
      });
      w2Legend(ctx, bx.x0 + 4, 10, [["x (standardizálva)", "--setA"], ["y (standardizálva)", "--setB"]]);
    };
    cvS.draw = () => {
      const { ctx, w, h: H } = cvS; ctx.clearRect(0, 0, w, H);
      if (!X.length) return;
      const zx = z(X), zy = z(Y), M = Math.max(2.5, ...zx.map(Math.abs), ...zy.map(Math.abs)) * 1.05;
      const bx = { x0: 28, y0: 22, x1: w - 10, y1: H - 36 };
      const { tx, ty } = axes(ctx, bx, { xmin: -M, xmax: M, ymin: -M, ymax: M, xticks: [-2, 0, 2], yticks: [-2, 0, 2], xlabel: "x", ylabel: "y", xfmt: v => String(v) });
      ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.75;
      zx.forEach((v, i) => { ctx.beginPath(); ctx.arc(tx(v), ty(zy[i]), 3.2, 0, 2 * Math.PI); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = css("--text"); ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText("r = " + fmt(pearson(X, Y), 2), bx.x1 - 4, 4);
      ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = css("--muted"); ctx.fillText("pontdiagram", bx.x0 + 22, 6);
    };
    cvH.draw = () => {
      const { ctx, w, h: H } = cvH; ctx.clearRect(0, 0, w, H);
      const bx = { x0: 34, y0: 22, x1: w - 10, y1: H - 36 };
      const B = 40, cnt = [new Array(B).fill(0), new Array(B).fill(0)];
      if (sim) sim.res.forEach((a, tp) => a.forEach(r => { if (isFinite(r)) cnt[tp][Math.min(B - 1, Math.max(0, Math.floor((r + 1) / 2 * B)))]++; }));
      const ymax = sim ? Math.max(10, ...cnt[0], ...cnt[1]) * 1.08 : 100;
      /* |r| > 0,5 tartományok */
      const tx0 = v => bx.x0 + (v + 1) / 2 * (bx.x1 - bx.x0);
      ctx.fillStyle = css("--bad-soft");
      ctx.fillRect(tx0(-1), bx.y0, tx0(-0.5) - tx0(-1), bx.y1 - bx.y0); ctx.fillRect(tx0(0.5), bx.y0, tx0(1) - tx0(0.5), bx.y1 - bx.y0);
      const { tx, ty } = axes(ctx, bx, { xmin: -1, xmax: 1, ymin: 0, ymax, xticks: [-1, -0.5, 0, 0.5, 1], yticks: sim ? rangeTicks(0, ymax, 4) : [], xlabel: "r", xfmt: v => String(v).replace(".", ",") });
      if (sim) {
        [[0, "--accent", 0.55], [1, "--setC", 0.6]].forEach(([tp, c, al]) => {
          ctx.fillStyle = css(c); ctx.globalAlpha = al;
          cnt[tp].forEach((k, i) => { const a = -1 + 2 * i / B, b = a + 2 / B; if (k) ctx.fillRect(tx(a) + 0.5, ty(k), tx(b) - tx(a) - 1, ty(0) - ty(k)); });
        });
        ctx.globalAlpha = 1;
        w2Legend(ctx, bx.x0 + 4, 10, [["bolyongás", "--accent"], ["zaj", "--setC"]]);
        ctx.font = "10px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.textBaseline = "top";
        ctx.fillText(`1000 pár, n = ${sim.n}`, bx.x1 - 2, bx.y0 + 2);
      } else {
        ctx.fillStyle = css("--muted"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("Az r-ek hisztogramja itt jelenik meg", (bx.x0 + bx.x1) / 2, (bx.y0 + bx.y1) / 2 - 9);
        ctx.fillText("(„1000 pár szimulálása”)", (bx.x0 + bx.x1) / 2, (bx.y0 + bx.y1) / 2 + 9);
      }
      if (X.length) { const r = pearson(X, Y); if (isFinite(r)) vline(ctx, tx(r), bx.y0, bx.y1, css("--bad"), true); }
    };
    types.pick(0, true);
    newPair();
  };

  /* ------------------------------------------------------------------
     3.7  Zavaró változó: fagyi, fulladás, hőmérséklet
     ------------------------------------------------------------------ */
  W["confounder"] = root => {
    header(root, "Fagyi és fulladás: a hőmérséklet a háttérben",
      "Szimulált adatok: 10 év heti adatai (520 hét). $T$ a heti középhőmérséklet (°C), $F$ a fagylalteladás (ezer gombóc), $D$ a vízi balesetek száma. " +
      "$F$ és $D$ is a hőmérséklettől függ, de <b>egymástól nem</b>: adott $T$ mellett függetlenek. A pont színe a hőmérséklet (kék = hideg, narancs = meleg). " +
      "Mozgasd a hőmérséklet-sávot!");
    /* adatok, rögzített maggal */
    const rnd = mulberry32(31337), N = 520, T = [], F = [], D = [], J = [];
    for (let k = 0; k < N; k++) {
      const t = 11 - 11 * Math.cos(2 * Math.PI * k / 52) + 3 * normal(rnd);
      T.push(t);
      F.push(Math.max(0, 5 + 2 * t + 5 * normal(rnd)));
      D.push(poisson(0.3 * Math.max(0, t - 10), rnd));
      J.push((rnd() - 0.5) * 0.5);
    }
    const rFD = pearson(F, D), rTF = pearson(T, F), rTD = pearson(T, D);
    const tMin = Math.floor(Math.min(...T)), tMax = Math.ceil(Math.max(...T)), fMax = Math.ceil(Math.max(...F) / 10) * 10, dMax = Math.max(...D);
    const cS = slider(0, 26, 0.5, 20), wS = slider(2, 8, 0.5, 3), cO = h("b"), wO = h("b");
    const only = h("input", { type: "checkbox" });
    root.append(w2Ctl(labelWrap("hőmérséklet-sáv közepe:", cS, cO), labelWrap("szélessége:", wS, wO), labelWrap("", only, "csak a sáv")));
    const cvM = w2Canvas(root, 0.55, 290);
    const grid = h("div", { class: "two-col", style: "margin-top:.4rem" }), c1 = h("div"), c2 = h("div");
    grid.append(c1, c2); root.append(grid);
    const cvF = makeCanvas(c1, 0.7, 420), cvD = makeCanvas(c2, 0.7, 420);
    const stats = h("div", { class: "stat-row" }), out = h("div", { class: "readout" });
    root.append(stats, out,
      h("p", { style: "margin:.6rem 0 0;font-size:.95rem" }, h("b", null, "Tanulság: "),
        "Azonos hőmérséklet mellett a fagyi nem jelzi előre a fulladást – a kapcsolatot a közös ok (a meleg) okozza."));

    const band = () => { const c = +cS.value, hw = +wS.value / 2; return { lo: c - hw, hi: c + hw }; };
    const inBand = () => { const { lo, hi } = band(); return T.map((t, i) => (t >= lo && t <= hi ? i : -1)).filter(i => i >= 0); };
    const colT = t => w2Mix(css("--setA"), css("--setB"), Math.max(0, Math.min(1, (t - 2) / 22)));

    function scatter(cv, xs, ys, { xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel, bandX }) {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const bx = { x0: 32, y0: 20, x1: w - 10, y1: H - 36 };
      const { lo, hi } = band();
      const { tx, ty } = axes(ctx, bx, { xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel });
      if (bandX) { ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.13; ctx.fillRect(tx(Math.max(lo, xmin)), bx.y0, tx(Math.min(hi, xmax)) - tx(Math.max(lo, xmin)), bx.y1 - bx.y0); ctx.globalAlpha = 1; }
      const draw = inside => xs.forEach((x, i) => {
        const ib = T[i] >= lo && T[i] <= hi;
        if (ib !== inside || (!ib && only.checked)) return;
        ctx.globalAlpha = ib ? 0.9 : 0.14; ctx.fillStyle = colT(T[i]);
        ctx.beginPath(); ctx.arc(tx(x), ty(ys[i]), ib ? 3.2 : 2.6, 0, 2 * Math.PI); ctx.fill();
      });
      draw(false); draw(true); ctx.globalAlpha = 1;
      return { ctx, tx, ty, bx };
    }
    cvM.draw = () => {
      const DJ = D.map((d, i) => d + J[i]);
      const { ctx, tx, ty, bx } = scatter(cvM, F, DJ, { xmin: 0, xmax: fMax, ymin: -0.6, ymax: dMax + 0.6, xticks: rangeTicks(0, fMax, 8), yticks: rangeTicks(0, dMax, 6),
        xlabel: "F: fagylalteladás (ezer gombóc)", ylabel: "D: vízi balesetek száma (hetente)" });
      /* illesztett egyenesek: összes pont (szaggatott) és a sáv pontjai */
      const line = (fit, col, dash) => {
        if (!fit) return;
        ctx.save(); if (dash) ctx.setLineDash([6, 5]); ctx.strokeStyle = col; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tx(0), ty(fit.a)); ctx.lineTo(tx(fMax), ty(fit.a + fit.b * fMax)); ctx.stroke(); ctx.restore();
      };
      ctx.save(); ctx.beginPath(); ctx.rect(bx.x0, bx.y0, bx.x1 - bx.x0, bx.y1 - bx.y0); ctx.clip();
      line(w2Fit(F, D), css("--muted"), true);
      const I = inBand();
      if (I.length >= 3) { /* a sáv egyenese csak a sáv pontjainak F-tartományában */
        const fx = I.map(i => F[i]), fit = w2Fit(fx, I.map(i => D[i]));
        if (fit) {
          const a = Math.min(...fx), b = Math.max(...fx);
          ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(tx(a), ty(fit.a + fit.b * a)); ctx.lineTo(tx(b), ty(fit.a + fit.b * b)); ctx.stroke();
        }
      }
      ctx.restore();
      /* színskála */
      const gx = bx.x1 - 150, gy = bx.y0 + 4;
      for (let k = 0; k <= 60; k++) { ctx.fillStyle = colT(2 + 22 * k / 60); ctx.fillRect(gx + 30 + k, gy, 1.2, 8); }
      ctx.font = "10px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.fillStyle = css("--muted");
      ctx.textAlign = "right"; ctx.fillText("hideg", gx + 27, gy + 4); ctx.textAlign = "left"; ctx.fillText("meleg", gx + 94, gy + 4);
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx + 30, gy + 20); ctx.lineTo(gx + 50, gy + 20); ctx.stroke(); ctx.restore();
      ctx.fillText("összes pont", gx + 55, gy + 20);
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx + 30, gy + 34); ctx.lineTo(gx + 50, gy + 34); ctx.stroke();
      ctx.fillStyle = css("--muted"); ctx.fillText("csak a sáv", gx + 55, gy + 34);
    };
    cvF.draw = () => {
      const { ctx, bx } = scatter(cvF, T, F, { xmin: tMin, xmax: tMax, ymin: 0, ymax: fMax, xticks: rangeTicks(tMin, tMax, 6), yticks: rangeTicks(0, fMax, 4),
        xlabel: "T (°C)", ylabel: "F", bandX: true });
      ctx.fillStyle = css("--text"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(`T–F: r = ${fmt(rTF, 2)}`, bx.x1 - 2, 2);
    };
    cvD.draw = () => {
      const { ctx, bx } = scatter(cvD, T, D.map((d, i) => d + J[i]), { xmin: tMin, xmax: tMax, ymin: -0.6, ymax: dMax + 0.6, xticks: rangeTicks(tMin, tMax, 6), yticks: rangeTicks(0, dMax, 4),
        xlabel: "T (°C)", ylabel: "D", bandX: true });
      ctx.fillStyle = css("--text"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(`T–D: r = ${fmt(rTD, 2)}`, bx.x1 - 2, 2);
    };
    function upd() {
      const { lo, hi } = band();
      cO.textContent = fmt(+cS.value, 1) + " °C"; wO.textContent = fmt(+wS.value, 1) + " °C";
      cvM.draw(); cvF.draw(); cvD.draw();
      const I = inBand(), rb = I.length >= 3 ? pearson(I.map(i => F[i]), I.map(i => D[i])) : NaN;
      stats.replaceChildren(stat("$r(F, D)$ – összes pont", fmt(rFD, 2)), stat("$r(T, F)$", fmt(rTF, 2)), stat("$r(T, D)$", fmt(rTD, 2)),
        stat("$r(F, D)$ – a sávban", fmt(rb, 2)), stat("pontok a sávban", String(I.length)));
      const why = I.length < 3 ? "túl kevés pont" : !isFinite(rb) ? "a sávban D mindig ugyanannyi (hidegben 0) – r nem értelmezhető" : "";
      out.innerHTML = `Sáv: ${fmt(lo, 1)} … ${fmt(hi, 1)} °C, <b>${I.length}</b> hét. ` +
        `Összes ponton r(F, D) = <b>${fmt(rFD, 2)}</b>, a sávon belül r(F, D) = <b>${fmt(rb, 2)}</b>` + (why ? ` (${why})` : "") + ".";
      window.Synopsis && Synopsis.renderMath(stats);
    }
    [cS, wS].forEach(s => s.addEventListener("input", upd));
    only.addEventListener("change", upd);
    upd();
  };
