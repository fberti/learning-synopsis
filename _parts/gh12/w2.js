  /* ==================================================================
     w2: 12.4–12.5 widgetjei (transe-2d, kg-patterns, temporal-stream)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const fm = (x, d = 2) => fmt(x, d).replace("-", "−");
    const dot2 = c => `<span style="display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const line2 = (c, dash) => `<span style="display:inline-block;width:1.4em;height:0;border-top:2.5px ${dash ? "dashed" : "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const OK = "✓", NO = "✗";
    const range = (min, max, step, value, label, oninput, width = "8rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:40vw`, oninput });
    const svgEl = (Wd, Ht, label) => {
      const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("viewBox", `0 0 ${Wd} ${Ht}`); s.setAttribute("role", "img"); s.setAttribute("aria-label", label);
      s.style.cssText = `width:100%;max-width:${Wd}px;display:block;touch-action:none;user-select:none`;
      return s;
    };
    const tblHTML = (head, rows, cls = "") =>
      `<table class="${cls}" style="width:auto;margin:.3rem 0;font-size:.86rem"><thead><tr>${head.map(x => `<th style="padding:.2em .45em">${x}</th>`).join("")}</tr></thead>` +
      `<tbody>${rows.map(r => `<tr${r.attr ? " " + r.attr : ""}${r.st ? ` style="${r.st}"` : ""}>${(r.c || r).map(x => `<td style="padding:.2em .45em;text-align:center">${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    /* koordinátasík: [lo; hi]² → SVG-pixel */
    function plane(lo, hi, size, pad = 22) {
      const S = (size - 2 * pad) / (hi - lo);
      return { lo, hi, size, pad, S, X: x => pad + (x - lo) * S, Y: y => size - pad - (y - lo) * S };
    }
    function gridSVG(P) {
      let s = "";
      for (let k = P.lo; k <= P.hi; k++) {
        const ax = k === 0;
        s += `<line x1="${P.X(k)}" y1="${P.Y(P.lo)}" x2="${P.X(k)}" y2="${P.Y(P.hi)}" style="stroke:var(${ax ? "--muted" : "--border"});stroke-width:${ax ? 1.2 : 0.8}"/>`;
        s += `<line x1="${P.X(P.lo)}" y1="${P.Y(k)}" x2="${P.X(P.hi)}" y2="${P.Y(k)}" style="stroke:var(${ax ? "--muted" : "--border"});stroke-width:${ax ? 1.2 : 0.8}"/>`;
        s += `<text x="${P.X(k)}" y="${P.Y(P.lo) + 13}" text-anchor="middle" style="fill:var(--muted);font-size:9.5px">${k < 0 ? "−" + -k : k}</text>`;
        s += `<text x="${P.X(P.lo) - 5}" y="${P.Y(k) + 3}" text-anchor="end" style="fill:var(--muted);font-size:9.5px">${k < 0 ? "−" + -k : k}</text>`;
      }
      return s;
    }
    /* nyíl (x1,y1) → (x2,y2) */
    function arrowSVG(x1, y1, x2, y2, col, { w = 2.4, dash = "", op = 1, hs = 8 } = {}) {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      if (L < 1) return "";
      const ux = dx / L, uy = dy / L, bx = x2 - ux * hs, by = y2 - uy * hs;
      return `<g style="opacity:${op}"><line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" style="stroke:${sv(col)};stroke-width:${w}${dash ? ";stroke-dasharray:" + dash : ""}"/>` +
        `<path d="M${x2} ${y2}L${bx - uy * hs * 0.5} ${by + ux * hs * 0.5}L${bx + uy * hs * 0.5} ${by - ux * hs * 0.5}Z" style="fill:${sv(col)}"/></g>`;
    }
    const labelSVG = (x, y, txt, { anchor = "start", fs = 11, col = "--text" } = {}) =>
      `<text x="${x}" y="${y}" text-anchor="${anchor}" style="fill:${sv(col)};font-size:${fs}px;font-weight:600;paint-order:stroke;stroke:var(--card);stroke-width:3px;pointer-events:none">${esc(txt)}</text>`;
    /* pontok feliratai: az egybeeső pontok egy közös feliratot kapnak */
    function pointLabels(pts, Wd, fs = 11) {
      const groups = new Map();
      pts.forEach(p => { const k = Math.round(p.x / 6) + "," + Math.round(p.y / 6); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(p); });
      let s = "";
      groups.forEach(g => {
        const p = g[0], lab = g.map(q => q.label).join(" = "), tw = 0.58 * fs * lab.length, left = p.x + 9 + tw > Wd - 2;
        s += labelSVG(left ? p.x - 9 : p.x + 9, p.y - 7, lab, { anchor: left ? "end" : "start", fs });
      });
      return s;
    }
    /* SVG-pont az eseményből */
    function svgPt(svg, ev) {
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    /* húzás: a [data-drag] elemek; onMove(kulcs, svgX, svgY) */
    function dragSVG(svg, onMove, onEnd = () => {}) {
      let key = null;
      svg.addEventListener("pointerdown", ev => {
        const t = ev.target.closest("[data-drag]"); if (!t) return;
        key = t.dataset.drag; svg.setPointerCapture(ev.pointerId); ev.preventDefault();
        const p = svgPt(svg, ev); onMove(key, p.x, p.y);
      });
      svg.addEventListener("pointermove", ev => { if (key == null) return; const p = svgPt(svg, ev); onMove(key, p.x, p.y); });
      const end = () => { if (key != null) { key = null; onEnd(); } };
      svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    }
    /* láthatóság figyelése (animáció csak látható widgeten) */
    function watchVisible(root, cb) {
      let vis = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => { vis = es.some(e => e.isIntersecting); cb(vis); }).observe(root);
      return () => vis;
    }
    const v2 = {
      add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
      norm: a => Math.hypot(a[0], a[1])
    };
    const round = (x, d = 4) => +x.toFixed(d);

    /* ------------------------------------------------------------------
       12.4  transe-2d – TransE a síkon
       ------------------------------------------------------------------ */
    W["transe-2d"] = root => {
      header(root, "TransE a síkon: a reláció egy eltolás",
        "Minden entitás egy pont, minden reláció egy vektor. A $(h, r, t)$ hármas annál „igazabb”, minél közelebb van " +
        "$\\mathbf h + \\mathbf r$ a $\\mathbf t$-hez: a pontszám $-\\lVert \\mathbf h + \\mathbf r - \\mathbf t\\rVert$. " +
        "Húzd az entitásokat és a reláció nyilának végét (◆) – vagy tanítsd a modellt.");
      math(root.querySelector(".w-sub"));
      const T3 = D.triples;
      const arvT = [["Szakértő", "bírálja", "Kormány"], ["Polgármester", "köszönetet mond", "Kormány"], ["Polgármester", "fórumot tart", "Lakók"],
        ["Önkéntesek", "gyűjtést indít", "Lakók"], ["Polgármester", "köszönti", "Önkéntesek"]].filter(t => T3.some(u => u[0] === t[0] && u[1] === t[1] && u[2] === t[2]));
      const arvE = [...new Set(arvT.flatMap(t => [t[0], t[2]]))], arvR = [...new Set(arvT.map(t => t[1]))];
      const PRE = {
        cap: { name: "fővárosok", ents: [["Budapest", 1, 1], ["Bécs", 1, 3], ["Prága", 1, 5], ["Magyarország", 4, 2], ["Ausztria", 4, 4], ["Csehország", 4, 6]],
          rels: [["fővárosa", 3, 1]], tr: [[0, 0, 3], [1, 0, 4], [2, 0, 5]], q: [2, 0] },
        one: { name: "1–N: városai", ents: [["Magyarország", 1, 3], ["Budapest", 4, 4], ["Debrecen", 4, 2]], rels: [["városa", 3, 0]], tr: [[0, 0, 1], [0, 0, 2]], q: [0, 0] },
        sym: { name: "szimmetrikus: házastársa", ents: [["Anna", 1, 1], ["Béla", 4, 3]], rels: [["házastársa", 3, 2]], tr: [[0, 0, 1], [1, 0, 0]], q: [0, 0] },
        arv: { name: "Árvízhét", ents: arvE.map(n => [n, 0, 0]), rels: arvR.map(r => [r, 0, 0]),
          tr: arvT.map(t => [arvE.indexOf(t[0]), arvR.indexOf(t[1]), arvE.indexOf(t[2])]), q: [arvE.indexOf("Szakértő"), arvR.indexOf("bírálja")], seed: 12 }
      };
      let key = "cap", E, R, TR, sel = 0, showAll = true, negs = [], loss = null, steps = 0, running = false, raf = 0, Rg = rng(7), seedN = 100;
      let gamma = 1, lr = 0.05, l2 = true, qh = 0, qr = 0, stopAt = 0, lastMove = Infinity;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["cap", "fővárosok"], ["one", "1–N: városai"], ["sym", "szimmetrikus: házastársa"], ["arv", "Árvízhét"]], key, v => { key = v; load(); });
      const c2 = h("div", { class: "controls" });
      const bTrain = btn("▶ Tanítás", () => (running ? stop() : start()));
      const b1 = btn("1 lépés", () => { stop(); trainStep(); render(); });
      const bRnd = btn("újrakezdés véletlen helyzetből", () => { stop(); randomize(seedN++); render(); });
      const bReset = btn("alaphelyzet", () => { stop(); load(); });
      c2.append(bTrain, b1, bRnd, bReset);
      const c3 = h("div", { class: "controls" });
      const gLab = h("b", { style: "font-family:var(--mono)" }, "1"), lLab = h("b", { style: "font-family:var(--mono)" }, "0,05");
      const gR = range(0.5, 3, 0.25, gamma, "margó", () => { gamma = +gR.value; gLab.textContent = fmt(gamma); });
      const lR = range(0.01, 0.2, 0.01, lr, "tanulási ráta", () => { lr = +lR.value; lLab.textContent = fmt(lr); });
      const cbAll = h("input", { type: "checkbox", checked: "" });
      cbAll.addEventListener("change", () => { showAll = cbAll.checked; render(); });
      const cbL2 = h("input", { type: "checkbox", checked: "" });
      cbL2.addEventListener("change", () => { l2 = cbL2.checked; });
      c3.append(h("label", null, "margó γ = ", gLab, " ", gR), h("label", null, "tanulási ráta ", lLab, " ", lR),
        h("label", null, cbAll, "a reláció a többi fejből is (szaggatva)"),
        h("label", { title: "lépésenként r ← (1 − 0,1·ráta)·r" }, cbL2, "a relációvektorok kis L2-büntetése"));
      root.append(c1, c2, c3);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), side = h("div");
      grid.append(box, side); root.append(grid);
      const P = plane(-1, 7, 380, 24);
      const svg = svgEl(P.size, P.size, "TransE-sík"); box.append(svg);
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      box.append(legend);
      legend.innerHTML = `${dot2("--setA")}entitás · ${line2("--setB")}reláció ($\\mathbf h \\to \\mathbf h + \\mathbf r$; ◆ húzható) · ` +
        `${line2("--setC", true)}hiba $\\mathbf h + \\mathbf r - \\mathbf t$ · ${line2("--muted", true)}negatív hármas`;
      math(legend);
      const tbox = h("div", { class: "readout" }), qbox = h("div", { class: "readout" }), info = h("div", { class: "readout" });
      side.append(tbox, qbox);
      root.append(info, h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A TransE egy relációt egy eltolásnak tanul. Ami nem eltolás (szimmetrikus, 1–N), azt csak úgy tudja, hogy összenyomja a pontokat."));
      const qH = h("select", { "aria-label": "fej" }), qR = h("select", { "aria-label": "reláció" });
      qH.addEventListener("change", () => { qh = +qH.value; render(); });
      qR.addEventListener("change", () => { qr = +qR.value; render(); });
      const qHead = h("div", { class: "controls", style: "margin:.2rem 0" }, h("b", null, "Lekérdezés: "), "(", qH, ", ", qR, ", ?)");
      const qOut = h("div");
      qbox.append(qHead, qOut);
      tbox.addEventListener("click", ev => { const t = ev.target.closest("tr[data-t]"); if (!t) return; sel = +t.dataset.t; render(); });

      function load() {
        stop();
        const p = PRE[key];
        E = p.ents.map(([n, x, y]) => ({ n, p: [x, y] })); R = p.rels.map(([n, x, y]) => ({ n, v: [x, y] }));
        TR = p.tr.map(t => t.slice()); sel = 0; negs = []; loss = null; steps = 0; Rg = rng(7);
        if (p.seed) randomize(p.seed);
        [qh, qr] = p.q;
        qH.innerHTML = E.map((e, i) => `<option value="${i}">${esc(e.n)}</option>`).join(""); qH.value = qh;
        qR.innerHTML = R.map((r, i) => `<option value="${i}">${esc(r.n)}</option>`).join(""); qR.value = qr;
        render();
      }
      function randomize(seed) {
        const G = rng(seed);
        E.forEach(e => { e.p = [round(0.3 + 5.4 * G(), 2), round(0.3 + 5.4 * G(), 2)]; });
        R.forEach(r => { r.v = [round(4 * G() - 2, 2), round(4 * G() - 2, 2)]; });
        negs = []; loss = null; steps = 0; Rg = rng(seed + 1);
      }
      const resid = ([hh, r, t]) => v2.sub(v2.add(E[hh].p, R[r].v), E[t].p);
      const dist3 = t => v2.norm(resid(t));
      const clamp = x => Math.max(-1, Math.min(7, x));
      function trainStep() {
        const pos = new Set(TR.map(t => t.join(","))), n = E.length;
        const pick = ex => { let j = Math.floor(Rg() * (n - 1)); if (j >= ex) j++; return j; };
        negs = []; let L = 0, mv = 0;
        const before = E.map(e => e.p.slice()).concat(R.map(r => r.v.slice()));
        TR.forEach(([hh, r, t]) => {
          let ng = null;
          for (let k = 0; k < 20 && !ng; k++) { const c = Rg() < 0.5 ? [hh, r, pick(t)] : [pick(hh), r, t]; if (!pos.has(c.join(","))) ng = c; }
          if (!ng) return;
          negs.push(ng);
          const dp = resid([hh, r, t]), dn = resid(ng), a = v2.norm(dp), b = v2.norm(dn), l = gamma + a - b;
          if (l <= 0) return;
          L += l;
          const up = a > 1e-9 ? [dp[0] / a, dp[1] / a] : [0, 0], un = b > 1e-9 ? [dn[0] / b, dn[1] / b] : [0, 0];
          for (let i = 0; i < 2; i++) {
            E[hh].p[i] -= lr * up[i]; R[r].v[i] -= lr * up[i]; E[t].p[i] += lr * up[i];
            E[ng[0]].p[i] += lr * un[i]; R[r].v[i] += lr * un[i]; E[ng[2]].p[i] -= lr * un[i];
          }
        });
        if (l2) R.forEach(r => { r.v = r.v.map(x => x * (1 - 0.1 * lr)); });
        E.forEach(e => { e.p = e.p.map(clamp); });
        E.map(e => e.p).concat(R.map(r => r.v)).forEach((p, i) => { mv = Math.max(mv, Math.abs(p[0] - before[i][0]), Math.abs(p[1] - before[i][1])); });
        lastMove = mv; loss = L / TR.length; steps++;
      }
      const isVis = watchVisible(root, v => { if (!v && running) { cancelAnimationFrame(raf); raf = 0; } else if (v && running && !raf) raf = requestAnimationFrame(frame); });
      function frame() {
        raf = 0;
        if (!running) return;
        for (let k = 0; k < 3; k++) trainStep();
        render();
        if (steps >= stopAt || (loss === 0 && lastMove < 2e-4)) { stop(); return; }
        if (isVis()) raf = requestAnimationFrame(frame);
      }
      function start() { running = true; stopAt = steps + 2500; bTrain.textContent = "⏸ Állj"; if (!raf) raf = requestAnimationFrame(frame); }
      function stop() { running = false; bTrain.textContent = "▶ Tanítás"; if (raf) cancelAnimationFrame(raf); raf = 0; render && E && render(); }

      dragSVG(svg, (k, x, y) => {
        const wx = Math.max(-1, Math.min(7, P.lo + (x - P.pad) / P.S)), wy = Math.max(-1, Math.min(7, P.lo + (P.size - P.pad - y) / P.S));
        const snap = v => Math.round(v * 4) / 4;
        if (k === "r") { const t = TR[sel]; R[t[1]].v = [snap(wx) - E[t[0]].p[0], snap(wy) - E[t[0]].p[1]].map(v => round(v, 2)); }
        else E[+k].p = [snap(wx), snap(wy)];
        render();
      });

      function render() {
        if (!E) return;
        const X = P.X, Y = P.Y;
        let s = `<rect x="0" y="0" width="${P.size}" height="${P.size}" style="fill:var(--card)"/>` + gridSVG(P);
        /* negatívak (szürkén) */
        negs.forEach(([hh, r, t]) => {
          const a = E[hh].p, b = v2.add(a, R[r].v), c = E[t].p;
          s += arrowSVG(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), "--muted", { w: 1.4, dash: "4 3", op: 0.55, hs: 6 });
          s += `<line x1="${X(b[0])}" y1="${Y(b[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(--muted);stroke-width:1.2;stroke-dasharray:1 3;opacity:.7"/>`;
        });
        /* pozitív hármasok */
        TR.forEach((t, i) => {
          if (i !== sel && !showAll) return;
          const a = E[t[0]].p, b = v2.add(a, R[t[1]].v), c = E[t[2]].p, on = i === sel;
          s += `<line x1="${X(b[0])}" y1="${Y(b[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(--setC);stroke-width:${on ? 2 : 1.3};stroke-dasharray:2 3"/>`;
          s += arrowSVG(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), "--setB", { w: on ? 2.8 : 1.6, dash: on ? "" : "6 4", op: on ? 1 : 0.75 });
        });
        const pts = E.map((e, i) => ({ x: X(e.p[0]), y: Y(e.p[1]), label: e.n, i }));
        const st = TR[sel], inv = new Set([st[0], st[2]]);
        pts.forEach(p => {
          s += `<circle cx="${p.x}" cy="${p.y}" r="${inv.has(p.i) ? 7 : 6}" style="fill:var(--setA);stroke:${inv.has(p.i) ? "var(--text)" : "var(--card)"};stroke-width:${inv.has(p.i) ? 2 : 1.3}"/>`;
          s += `<circle data-drag="${p.i}" cx="${p.x}" cy="${p.y}" r="14" style="fill:transparent;cursor:grab"/>`;
        });
        s += pointLabels(pts, P.size);
        /* fogantyú */
        const tip = v2.add(E[st[0]].p, R[st[1]].v), tx = X(tip[0]), ty = Y(tip[1]);
        s += `<path d="M${tx} ${ty - 7}L${tx + 7} ${ty}L${tx} ${ty + 7}L${tx - 7} ${ty}Z" style="fill:var(--setB);stroke:var(--text);stroke-width:1.3"/>`;
        s += `<circle data-drag="r" cx="${tx}" cy="${ty}" r="15" style="fill:transparent;cursor:grab"/>`;
        s += labelSVG(tx + 9, ty + 15, "h + r", { fs: 10, col: "--muted" });
        svg.innerHTML = s;
        /* hármasok */
        const rows = TR.map((t, i) => ({ attr: `data-t="${i}"`, st: "cursor:pointer" + (i === sel ? ";background:color-mix(in srgb, var(--accent) 16%, transparent);font-weight:600" : ""),
          c: [`(${esc(E[t[0]].n)}, ${esc(R[t[1]].n)}, ${esc(E[t[2]].n)})`, fm(-dist3(t))] }));
        tbox.innerHTML = `<b>Pozitív hármasok</b> (kattints egy sorra: az ő nyila húzható)<div class="tw">${tblHTML(["hármas", "pontszám"], rows)}</div>` +
          (negs.length ? `<span class="muted">Negatívak az utolsó lépésben: ${negs.map(t => `(${esc(E[t[0]].n)}, ${esc(R[t[1]].n)}, ${esc(E[t[2]].n)}) ${fm(-dist3(t))}`).join("; ")}</span>` : "");
        /* lekérdezés */
        const truth = new Set(TR.filter(t => t[0] === qh && t[1] === qr).map(t => t[2]));
        const rank = E.map((e, i) => ({ i, d: dist3([qh, qr, i]) })).filter(o => o.i !== qh).sort((a, b) => a.d - b.d || a.i - b.i);
        const qrows = rank.map((o, k) => ({ st: truth.has(o.i) ? "background:color-mix(in srgb, var(--setC) 20%, transparent);font-weight:600" : "",
          c: [k + 1 + ".", esc(E[o.i].n) + (truth.has(o.i) ? " ✓" : ""), fm(o.d)] }));
        const tr0 = rank.findIndex(o => truth.has(o.i));
        qOut.innerHTML = `<div class="tw">${tblHTML(["hely", "farok", "távolság"], qrows)}</div>` +
          (truth.size ? `A valódi farok (✓) helyezése: <b>${tr0 + 1}.</b>` : `<span class="muted">Ehhez a fej–reláció párhoz nincs ismert farok.</span>`) +
          ` <span class="muted">(a fejet magát kihagyjuk)</span>`;
        /* kiírás */
        let x = `Lépések: <b>${steps}</b> · átlagos veszteség (az utolsó lépés negatívjain): <b>${loss == null ? "–" : fm(loss, 3)}</b>`;
        x += ` · $\\max(0,\\ \\gamma + d^+ - d^-)$, $\\gamma = ${fmt(gamma).replace(",", "{,}")}$`;
        let extra = {};
        if (key === "one") { const d = v2.norm(v2.sub(E[1].p, E[2].p)); extra.bpdb = round(d); x += `<br>Budapest és Debrecen távolsága: <b>${fm(d)}</b> – mindkettőnek közel kell lennie a $\\mathbf h + \\mathbf r$ ponthoz, ezért egymáshoz is.`; }
        if (key === "sym") { const d = v2.norm(v2.sub(E[0].p, E[1].p)), r = v2.norm(R[0].v); extra.ab = round(d); extra.r = round(r);
          x += `<br>Anna és Béla távolsága: <b>${fm(d)}</b>, $\\lVert\\mathbf r\\rVert = $ <b>${fm(r)}</b>. Mindkét irány csak $\\mathbf r = 0$ és Anna = Béla mellett lehet tökéletes.`; }
        if (key === "cap") { const r = R[0].v; x += `<br>$\\mathbf r_{\\text{fővárosa}} = (${fmM(r[0])};\\ ${fmM(r[1])})$`; }
        info.innerHTML = x;
        if (!running) math(info);
        else if (steps % 30 < 3) math(info);
        root.dataset.te = JSON.stringify({ key, steps, loss: loss == null ? null : round(loss), E: E.map(e => [e.n, round(e.p[0]), round(e.p[1])]), R: R.map(r => [r.n, round(r.v[0]), round(r.v[1])]),
          scores: TR.map(t => round(-dist3(t))), q: [E[qh].n, R[qr].n], rank: rank.map(o => [E[o.i].n, round(o.d)]), truthRank: tr0 + 1, negs: negs.length, ...extra });
      }
      const fmM = (x, d = 2) => fm(x, d).replace(",", "{,}");
      load();
    };

    /* ------------------------------------------------------------------
       12.4  kg-patterns – TransE / DistMult / RotatE relációmintákon
       ------------------------------------------------------------------ */
    W["kg-patterns"] = root => {
      header(root, "Relációminták: TransE, DistMult, RotatE",
        "Ugyanaz a mintázat, három modell. TransE: $\\mathbf h + \\mathbf r \\approx \\mathbf t$ (a síkon). " +
        "DistMult: pontszám $\\sum_i h_i r_i t_i$ (nagyobb = igazabb). RotatE: az entitás egy pont az egységkörön, a reláció egy $\\varphi$ szögű forgatás, " +
        "$d = \\lvert \\mathbf h \\circ \\mathbf r - \\mathbf t\\rvert$. Húzd a pontokat, állítsd a csúszkákat – és nézd, melyik modell tudja kifejezni a mintát.");
      math(root.querySelector(".w-sub"));
      /* sorok: [fej, reláció, farok, igaz?] (entitás- és relációindexek) */
      const PAT = {
        sym: { lab: "szimmetrikus", desc: "<b>házastársa</b>: ha (Anna, házastársa, Béla) igaz, akkor (Béla, házastársa, Anna) is.",
          ents: ["Anna", "Béla"], rels: ["házastársa"], rows: [[0, 0, 1, 1], [1, 0, 0, 1]],
          T: { e: [[1, 1], [4, 3]], r: [[3, 2]] }, Dm: { e: [[1, 2], [2, 1]], r: [[1, 1]] }, Ro: { e: [0, 180], r: [90] },
          v: { T: [NO, "Csak $\\mathbf r = 0$-val: akkor viszont Anna = Béla, a két pont összeesik."],
            Dm: [OK, "A képlet szimmetrikus $h$-ban és $t$-ben: a két irány pontszáma mindig egyenlő."],
            Ro: [OK, "A $180°$-os forgatás kétszer alkalmazva visszaforgat: $\\varphi = 180°$."] } },
        anti: { lab: "antiszimmetrikus", desc: "<b>bírálja</b>: (Szakértő, bírálja, Kormány) igaz, a fordítottja nem.",
          ents: ["Sz", "Ko"], rels: ["bírálja"], rows: [[0, 0, 1, 1], [1, 0, 0, 0]],
          T: { e: [[1, 2], [4, 3]], r: [[3, 1]] }, Dm: { e: [[1, 2], [2, 1]], r: [[1, 1]] }, Ro: { e: [0, 90], r: [90] },
          v: { T: [OK, "Ha $\\mathbf h + \\mathbf r = \\mathbf t$, akkor $\\mathbf t + \\mathbf r = \\mathbf h + 2\\mathbf r \\ne \\mathbf h$ (ha $\\mathbf r \\ne 0$)."],
            Dm: [NO, "A két irány pontszáma mindig egyenlő – a modell nem tudja, ki bírál kit."],
            Ro: [OK, "$\\varphi = 90°$-nál a visszafelé forgatás nem talál: a forgatás iránya számít."] } },
        inv: { lab: "inverz", desc: "<b>szülője ↔ gyermeke</b>: (Pisti, szülője, Anna) pontosan akkor, ha (Anna, gyermeke, Pisti).",
          ents: ["Pisti", "Anna"], rels: ["szülője", "gyermeke"], rows: [[0, 0, 1, 1], [1, 1, 0, 1], [1, 0, 0, 0]],
          T: { e: [[1, 1], [4, 3]], r: [[3, 2], [-3, -2]] }, Dm: { e: [[1, 2], [2, 1]], r: [[1, 1], [1, 1]] }, Ro: { e: [0, 90], r: [90, -90] },
          v: { T: [OK, "$\\mathbf r_{\\text{gyermeke}} = -\\mathbf r_{\\text{szülője}}$: visszatolás."],
            Dm: [NO, "Csak ha a reláció szimmetrikus: (Anna, szülője, Pisti) ugyanazt a pontszámot kapja, mint (Pisti, szülője, Anna)."],
            Ro: [OK, "$\\varphi_{\\text{gyermeke}} = -\\varphi_{\\text{szülője}}$: visszaforgat."] } },
        comp: { lab: "összetett", desc: "<b>anyja ∘ férje = apja</b>: Pisti anyja Anna, Anna férje Béla ⇒ Pisti apja Béla.",
          ents: ["Pisti", "Anna", "Béla"], rels: ["anyja", "férje", "apja"], rows: [[0, 0, 1, 1], [1, 1, 2, 1], [0, 2, 2, 1], [1, 0, 0, 0]],
          T: { e: [[1, 1], [3, 4], [6, 3]], r: [[2, 3], [3, -1], [5, 2]] }, Dm: { e: [[1, 2], [2, 1], [1, 1]], r: [[1, 1], [1, 1], [1, 1]] },
          Ro: { e: [0, 90, 210], r: [90, 120, 210] },
          v: { T: [OK, "$\\mathbf r_{\\text{apja}} = \\mathbf r_{\\text{anyja}} + \\mathbf r_{\\text{férje}}$: két eltolás egymás után."],
            Dm: [NO, "Minden relációja szimmetrikus, és a szorzat nem „láncol”: az irányt és a közbülső entitást nem tudja összefűzni."],
            Ro: [OK, "$\\varphi_{\\text{apja}} = \\varphi_{\\text{anyja}} + \\varphi_{\\text{férje}}$: két forgatás egymás után."] } },
        oneN: { lab: "1–N", desc: "<b>városa</b>: (Magyarország, városa, Budapest) és (Magyarország, városa, Debrecen) is igaz.",
          ents: ["Mo", "Bp", "Db"], rels: ["városa"], rows: [[0, 0, 1, 1], [0, 0, 2, 1], [1, 0, 0, 0]],
          T: { e: [[1, 3], [4, 4], [4, 2]], r: [[3, 0]] }, Dm: { e: [[2, 2], [2, 1], [1, 2]], r: [[1, 1]] }, Ro: { e: [0, 90, 135], r: [90] },
          v: { T: [NO, "$\\mathbf h + \\mathbf r$ egyetlen pont: a két farok csak úgy lehet tökéletes, ha összeesik."],
            Dm: ["részben", "A farkaknak nem kell egybeesniük, elég, ha a pontszámuk ugyanakkora (Mo = (2, 2) mellett Bp = (2, 1) és Db = (1, 2) is 6-ot kap) – kicsit jobban bírja."],
            Ro: [NO, "$\\mathbf h \\circ \\mathbf r$ egyetlen pont a körön: a farkakat ugyanúgy összenyomja."] } }
      };
      let key = "anti", st;
      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, Object.entries(PAT).map(([k, p]) => [k, p.lab]), key, v => { key = v; load(); });
      const desc = h("p", { style: "margin:.3rem 0" });
      root.append(c1, desc);
      const panels = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15.5rem),1fr));gap:.8rem;align-items:start" });
      root.append(panels);
      const mk = title => {
        const p = h("div", { style: "border:1px solid var(--border);border-radius:8px;padding:.5rem;background:var(--card);min-width:0" });
        const fig = h("div"), ctl = h("div", { style: "font-size:.85rem" }), tab = h("div", { class: "tw" }), live = h("div", { style: "font-size:.85rem;margin:.2rem 0" }),
          ver = h("div", { style: "font-size:.88rem;margin-top:.35rem;padding-top:.35rem;border-top:1px solid var(--border)" });
        p.append(h("div", { style: "font-weight:700;margin-bottom:.2rem" }, title), fig, ctl, tab, live, ver); panels.append(p);
        return { p, fig, ctl, tab, live, ver };
      };
      const pT = mk("TransE"), pD = mk("DistMult"), pR = mk("RotatE");
      root.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.4rem 0 0" },
        "A ✓ / ✗ a szakirodalmi összevetést követi: ki tudja-e fejezni a modell ezt a mintát pontosan (minden igaz hármasnak tökéletes, a hamisnak rossz pontszámmal)."));
      /* TransE-sík */
      const PT = plane(-1, 7, 260, 20), svgT = svgEl(PT.size, PT.size, "TransE"); pT.fig.append(svgT);
      dragSVG(svgT, (k, x, y) => {
        const wx = Math.round(4 * Math.max(-1, Math.min(7, PT.lo + (x - PT.pad) / PT.S))) / 4, wy = Math.round(4 * Math.max(-1, Math.min(7, PT.lo + (PT.size - PT.pad - y) / PT.S))) / 4;
        if (k[0] === "r") { const ri = +k.slice(1), row = PAT[key].rows.find(r => r[1] === ri); st.T.r[ri] = [wx - st.T.e[row[0]][0], wy - st.T.e[row[0]][1]]; }
        else st.T.e[+k] = [wx, wy];
        render();
      });
      /* RotatE-kör */
      const RS = 230, RC = RS / 2, RR = 82, svgR = svgEl(RS, RS, "RotatE"); pR.fig.append(svgR);
      const ang = a => [RC + RR * Math.cos(a * Math.PI / 180), RC - RR * Math.sin(a * Math.PI / 180)];
      dragSVG(svgR, (k, x, y) => {
        let a = Math.atan2(RC - y, x - RC) * 180 / Math.PI; a = Math.round(a / 15) * 15; if (a < 0) a += 360; if (a >= 360) a -= 360;
        st.Ro.e[+k] = a; render();
      });
      const nrm = a => { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; };
      const rotD = (h_, r, t) => 2 * Math.abs(Math.sin((h_ + r - t) * Math.PI / 360));
      const dm = (a, r, b) => a[0] * r[0] * b[0] + a[1] * r[1] * b[1];
      const clone = o => JSON.parse(JSON.stringify(o));

      function load() {
        const p = PAT[key];
        st = { T: clone(p.T), Dm: clone(p.Dm), Ro: clone(p.Ro) };
        desc.innerHTML = p.desc;
        /* DistMult-csúszkák: az entitások és az első reláció */
        pD.ctl.innerHTML = "";
        const vecs = p.ents.map((n, i) => [n, "e", i]).concat(p.rels.map((n, i) => [n, "r", i]));
        vecs.forEach(([n, tp, i]) => {
          const row = h("div", { style: "display:grid;grid-template-columns:minmax(3.2em,auto) 2.3em minmax(0,1fr) 2.3em minmax(0,1fr);align-items:center;gap:.2rem;margin:.05rem 0" });
          row.append(h("span", { style: "font-weight:600;white-space:nowrap" }, (tp === "r" ? "r " : "") + n));
          [0, 1].forEach(j => {
            const lab = h("b", { style: "font-family:var(--mono);text-align:right" });
            const arr = () => (tp === "e" ? st.Dm.e : st.Dm.r)[i];
            const sl = range(-2, 2, 0.5, arr()[j], `${n} ${j + 1}. koordináta`, () => { arr()[j] = +sl.value; render(); }, "100%");
            sl.style.maxWidth = "100%"; sl.style.minWidth = "0";
            sl.dataset.v = `${tp}${i}-${j}`;
            row.append(lab, sl); lab.dataset.v = `${tp}${i}-${j}`;
          });
          pD.ctl.append(row);
        });
        /* RotatE-csúszkák a relációkra */
        pR.ctl.innerHTML = "";
        p.rels.forEach((n, i) => {
          const lab = h("b", { style: "font-family:var(--mono);text-align:right" });
          const sl = range(-180, 180, 15, st.Ro.r[i], `${n} szöge`, () => { st.Ro.r[i] = +sl.value; render(); }, "100%");
          sl.style.maxWidth = "100%"; sl.style.minWidth = "0";
          lab.dataset.v = "phi" + i;
          pR.ctl.append(h("div", { style: "display:grid;grid-template-columns:auto 3.2em minmax(0,1fr);align-items:center;gap:.3rem" }, h("span", { style: "white-space:nowrap" }, `φ ${n}`), lab, sl));
        });
        ["T", "Dm", "Ro"].forEach((m, k) => { const [ok, why] = p.v[m], P_ = [pT, pD, pR][k];
          P_.ver.innerHTML = `<b style="font-size:1.05rem">${ok === OK ? "✓ igen" : ok === NO ? "✗ nem" : "◐ részben"}</b> – ${why}`; math(P_.ver); });
        render();
      }
      const trip = (p, r) => `(${p.ents[r[0]]}, ${p.rels[r[1]]}, ${p.ents[r[2]]})`;
      const rowTbl = (p, sc, best) => tblHTML(["hármas", "", best],
        p.rows.map((r, i) => ({ st: r[3] ? "" : "color:var(--muted)", c: [trip(p, r), r[3] ? "igaz" : "hamis", sc[i]] })));
      function render() {
        const p = PAT[key];
        /* --- TransE --- */
        const X = PT.X, Y = PT.Y;
        let s = `<rect width="${PT.size}" height="${PT.size}" style="fill:var(--card)"/>` + gridSVG(PT);
        const tE = st.T.e, tR = st.T.r, seenR = new Set();
        p.rows.forEach(r => {
          const a = tE[r[0]], b = v2.add(a, tR[r[1]]), c = tE[r[2]];
          s += `<line x1="${X(b[0])}" y1="${Y(b[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(${r[3] ? "--setC" : "--muted"});stroke-width:1.5;stroke-dasharray:2 3"/>`;
          s += arrowSVG(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), r[3] ? "--setB" : "--muted", { w: r[3] ? 2.4 : 1.4, dash: r[3] ? "" : "5 3", op: r[3] ? 1 : 0.7, hs: 7 });
        });
        const pts = tE.map((e, i) => ({ x: X(e[0]), y: Y(e[1]), label: p.ents[i], i }));
        pts.forEach(q => { s += `<circle cx="${q.x}" cy="${q.y}" r="5.5" style="fill:var(--setA);stroke:var(--card);stroke-width:1.2"/><circle data-drag="${q.i}" cx="${q.x}" cy="${q.y}" r="13" style="fill:transparent;cursor:grab"/>`; });
        p.rows.forEach(r => {
          if (!r[3] || seenR.has(r[1])) return; seenR.add(r[1]);
          const b = v2.add(tE[r[0]], tR[r[1]]), bx = X(b[0]), by = Y(b[1]);
          s += `<path d="M${bx} ${by - 6}L${bx + 6} ${by}L${bx} ${by + 6}L${bx - 6} ${by}Z" style="fill:var(--setB);stroke:var(--text);stroke-width:1.1"/><circle data-drag="r${r[1]}" cx="${bx}" cy="${by}" r="13" style="fill:transparent;cursor:grab"/>`;
          s += labelSVG(bx + 8, by + 13, p.rels[r[1]], { fs: 9.5, col: "--muted" });
        });
        s += pointLabels(pts, PT.size, 10.5);
        svgT.innerHTML = s;
        const tSc = p.rows.map(r => -v2.norm(v2.sub(v2.add(tE[r[0]], tR[r[1]]), tE[r[2]])));
        pT.tab.innerHTML = rowTbl(p, tSc.map(x => fm(x)), "$-\\lVert\\mathbf h+\\mathbf r-\\mathbf t\\rVert$");
        let lt = p.rels.map((n, i) => `$\\mathbf r_{\\text{${n}}} = (${fmM(tR[i][0])};\\ ${fmM(tR[i][1])})$`).join(", ");
        if (key === "inv") lt += `; $\\mathbf r_1 + \\mathbf r_2 = (${fmM(tR[0][0] + tR[1][0])};\\ ${fmM(tR[0][1] + tR[1][1])})$`;
        if (key === "comp") lt += `; $\\mathbf r_{\\text{anyja}} + \\mathbf r_{\\text{férje}} - \\mathbf r_{\\text{apja}} = (${fmM(tR[0][0] + tR[1][0] - tR[2][0])};\\ ${fmM(tR[0][1] + tR[1][1] - tR[2][1])})$`;
        if (key === "oneN") lt += `; Bp–Db távolság: ${fm(v2.norm(v2.sub(tE[1], tE[2])))}`;
        pT.live.innerHTML = lt;
        /* --- DistMult --- */
        const dE = st.Dm.e, dR = st.Dm.r;
        pD.ctl.querySelectorAll("b[data-v]").forEach(b => { const [tp, j] = b.dataset.v.split("-"), arr = tp[0] === "e" ? dE : dR; b.textContent = fm(arr[+tp.slice(1)][+j], 1); });
        const dSc = p.rows.map(r => dm(dE[r[0]], dR[r[1]], dE[r[2]]));
        pD.tab.innerHTML = rowTbl(p, dSc.map(x => fm(x)), "$\\sum_i h_i r_i t_i$");
        const r0 = p.rows[0], f = dm(dE[r0[0]], dR[r0[1]], dE[r0[2]]), b = dm(dE[r0[2]], dR[r0[1]], dE[r0[0]]);
        const vec = (n, v) => `${n} = (${fm(v[0], 1)}; ${fm(v[1], 1)})`;
        pD.fig.innerHTML = `<div style="font-family:var(--mono);font-size:.82rem;margin:.2rem 0">${p.ents.map((n, i) => vec(n, dE[i])).join(" · ")}<br>${p.rels.map((n, i) => vec("r " + n, dR[i])).join(" · ")}</div>`;
        pD.live.innerHTML = `${trip(p, r0)}: <b>${fm(f)}</b>, megfordítva ${trip(p, [r0[2], r0[1], r0[0]])}: <b>${fm(b)}</b> – ` +
          (Math.abs(f - b) < 1e-9 ? "<b>mindig egyenlő</b> (bármit állítasz)." : "eltér?!");
        /* --- RotatE --- */
        const oE = st.Ro.e, oR = st.Ro.r;
        pR.ctl.querySelectorAll("b[data-v]").forEach(bb => { bb.textContent = oR[+bb.dataset.v.slice(3)] + "°"; });
        let r_ = `<rect width="${RS}" height="${RS}" style="fill:var(--card)"/>`;
        r_ += `<line x1="${RC - RR - 14}" y1="${RC}" x2="${RC + RR + 14}" y2="${RC}" style="stroke:var(--border)"/><line x1="${RC}" y1="${RC - RR - 14}" x2="${RC}" y2="${RC + RR + 14}" style="stroke:var(--border)"/>`;
        r_ += `<circle cx="${RC}" cy="${RC}" r="${RR}" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>`;
        r_ += `<text x="${RC + RR + 14}" y="${RC + 12}" style="fill:var(--muted);font-size:9px" text-anchor="end">Re</text><text x="${RC - 4}" y="${RC - RR - 6}" style="fill:var(--muted);font-size:9px" text-anchor="end">Im</text>`;
        const arc = (a1, a2, col, rad, dash, op) => {
          const d = a2 - a1; if (Math.abs(d) < 1) return "";
          const [x1, y1] = [RC + rad * Math.cos(a1 * Math.PI / 180), RC - rad * Math.sin(a1 * Math.PI / 180)], [x2, y2] = [RC + rad * Math.cos(a2 * Math.PI / 180), RC - rad * Math.sin(a2 * Math.PI / 180)];
          const large = Math.abs(d) > 180 ? 1 : 0, sweep = d > 0 ? 0 : 1;
          const tA = (a2 - Math.sign(d) * 10) * Math.PI / 180, hx = RC + rad * Math.cos(tA), hy = RC - rad * Math.sin(tA);
          const ux = x2 - hx, uy = y2 - hy, L = Math.hypot(ux, uy) || 1;
          return `<g style="opacity:${op}"><path d="M${x1} ${y1}A${rad} ${rad} 0 ${large} ${sweep} ${x2} ${y2}" style="fill:none;stroke:${sv(col)};stroke-width:2.2${dash ? ";stroke-dasharray:" + dash : ""}"/>` +
            `<path d="M${x2} ${y2}L${x2 - ux / L * 7 - uy / L * 3.5} ${y2 - uy / L * 7 + ux / L * 3.5}L${x2 - ux / L * 7 + uy / L * 3.5} ${y2 - uy / L * 7 - ux / L * 3.5}Z" style="fill:${sv(col)}"/></g>`;
        };
        p.rows.forEach((r, i) => {
          const a = oE[r[0]], phi = oR[r[1]], [hx, hy] = ang(a + phi);
          r_ += arc(a, a + phi, r[3] ? "--setB" : "--muted", RR - 12 - 9 * i, r[3] ? "" : "4 3", r[3] ? 0.95 : 0.7);
          r_ += `<circle cx="${hx}" cy="${hy}" r="5" style="fill:none;stroke:${r[3] ? "var(--setB)" : "var(--muted)"};stroke-width:2"/>`;
        });
        const rp = oE.map((a, i) => { const [x, y] = ang(a); return { x, y, label: p.ents[i], i }; });
        rp.forEach(q => { r_ += `<circle cx="${q.x}" cy="${q.y}" r="5.5" style="fill:var(--setA);stroke:var(--card);stroke-width:1.2"/><circle data-drag="${q.i}" cx="${q.x}" cy="${q.y}" r="13" style="fill:transparent;cursor:grab"/>`; });
        r_ += pointLabels(rp, RS, 10.5);
        svgR.innerHTML = r_;
        const oSc = p.rows.map(r => -rotD(oE[r[0]], oR[r[1]], oE[r[2]]));
        pR.tab.innerHTML = rowTbl(p, oSc.map(x => fm(x)), "$-\\lvert\\mathbf h\\circ\\mathbf r-\\mathbf t\\rvert$");
        let lr_ = p.ents.map((n, i) => `${n}: ${oE[i]}°`).join(", ");
        if (key === "inv") lr_ += ` · φ₁ + φ₂ = ${nrm(oR[0] + oR[1])}°` + (nrm(oR[0] + oR[1]) === 0 ? " → visszaforgat" : "");
        if (key === "comp") lr_ += ` · φ(anyja) + φ(férje) = ${nrm(oR[0] + oR[1])}°, φ(apja) = ${nrm(oR[2])}°`;
        if (key === "sym") lr_ += ` · 2φ = ${nrm(2 * oR[0])}°` + (nrm(2 * oR[0]) === 0 ? " → a két irány ugyanaz" : "");
        pR.live.innerHTML = lr_ + `<br><span class="muted">○ = $\\mathbf h \\circ \\mathbf r$ (a forgatott fej); a pontok a körön húzhatók (15°-onként).</span>`;
        [pT.tab, pT.live, pD.tab, pR.tab, pR.live].forEach(e => math(e));
        root.dataset.kg = JSON.stringify({ key, T: tSc.map(x => round(x)), Dm: dSc.map(x => round(x)), Ro: oSc.map(x => round(x)) });
      }
      const fmM = (x, d = 2) => fm(x, d).replace(",", "{,}");
      load();
    };

    /* ------------------------------------------------------------------
       12.5  temporal-stream – az Árvízhét eseményfolyamként
       ------------------------------------------------------------------ */
    W["temporal-stream"] = root => {
      header(root, "Időbeli gráf: az Árvízhét eseményfolyamként",
        "Minden cikk minden említett szereplőpárja egy esemény $(u, v, t)$ a cikk napján. " +
        "A csúcsmemória minden nap végén: $s_v \\leftarrow \\lambda\\, s_v + k_v$, ahol $k_v$ a $v$-t érintő aznapi események száma. " +
        "A teszt napjain jósolunk: az <b>EdgeBank</b> 1-et ad, ha a pár valaha előfordult a nap előtt; a <b>memória-szorzat</b> $s_u \\cdot s_v$ (az előző nap végén).");
      math(root.querySelector(".w-sub"));
      const DAYS = D.days, NDAY = DAYS.length, IDS = ARV_IDS, n = IDS.length;
      const EV = [];
      D.articles.slice().sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.id - b.id).forEach(a => {
        const m = a.mentions.map(id => IDS.indexOf(id));
        for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) EV.push({ u: m[i], v: m[j], d: DAYS.indexOf(a.day), art: a.id });
      });
      const PAIRS = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) PAIRS.push([i, j]);
      let day = 3, cut = 2, lam = 0.5, mode = "stream", negMode = "easy", playing = false, timer = 0;
      const pn = (u, v) => `${IDS[u]}–${IDS[v]}`;

      /* vezérlők */
      const c1 = h("div", { class: "controls" });
      const bPlay = btn("▶ lejátszás", () => (playing ? pause() : play()));
      const bPrev = btn("◀ 1 nap vissza", () => { pause(); setDay(day - 1); }), bNext = btn("1 nap előre ▶", () => { pause(); setDay(day + 1); });
      const dLab = h("b", { style: "min-width:4.5em;display:inline-block" });
      const dR = range(0, NDAY - 1, 1, day, "nap", () => { pause(); setDay(+dR.value); }, "9rem");
      c1.append(bPlay, bPrev, bNext, dR, dLab);
      const c2 = h("div", { class: "controls" });
      toggleGroup(c2, [["snap", "pillanatfelvétel"], ["stream", "folyam"]], mode, v => { mode = v; render(); });
      const cutSel = h("select", { "aria-label": "vágás" }, ...DAYS.slice(0, -1).map((d, i) => h("option", { value: i }, `${d} után`)));
      cutSel.value = cut; cutSel.addEventListener("change", () => { cut = +cutSel.value; recompute(); });
      const lLab = h("b", { style: "font-family:var(--mono);min-width:2.4em;display:inline-block" }, "0,5");
      const lR = range(0, 1, 0.05, lam, "λ", () => { lam = +lR.value; lLab.textContent = fmt(lam); recompute(); });
      c2.append(h("label", null, "vágás: ", cutSel), h("label", null, "λ = ", lLab, " ", lR));
      root.append(c1, c2);
      const TW = root.clientWidth < 560 ? 380 : 720, tl = svgEl(TW, 120, "idővonal"); tl.style.touchAction = "manipulation"; tl.style.maxWidth = "100%";
      root.append(h("div", { style: "margin:.3rem 0" }, tl));
      tl.addEventListener("click", ev => { const t = ev.target.closest("[data-day]"); if (t) { pause(); setDay(+t.dataset.day); } });
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const gbox = h("div"), mbox = h("div");
      grid.append(gbox, mbox); root.append(grid);
      const gLeg = h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0" });
      const memSvg = svgEl(330, 7 * 30 + 26, "csúcsmemória"); memSvg.style.touchAction = "manipulation";
      mbox.append(h("div", { style: "font-weight:600;font-size:.92rem" }, "Csúcsmemória a nap végén"), memSvg);
      const memNote = h("p", { class: "muted", style: "font-size:.82rem;margin:.2rem 0 0" });
      mbox.append(memNote);
      const pred = h("div", { class: "readout" }), c3 = h("div", { class: "controls" }), aucBox = h("div", { class: "readout" });
      root.append(pred, c3, aucBox);
      c3.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "negatívák:"));
      toggleGroup(c3, [["easy", "könnyű: soha nem látott párok"], ["hist", "történeti: látott, de ma nem előforduló párok"], ["all", "minden ma nem előforduló pár"]], negMode, v => { negMode = v; renderAUC(); });
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Az EdgeBank semmit nem tanul, csak emlékszik. Könnyű negatívákkal mégis jónak látszik – történeti negatívákkal kiderül, hogy az új párokról semmit nem tud."));

      const ASP = 0.62, nodePos = GK.normalize(IDS.map(i => ACTOR_POS[i]), ASP);
      const view = new GK.View(gbox, { aspect: ASP, radius: root.clientWidth < 560 ? 14 : 16, showWeights: true, draggable: false,
        nodes: IDS.map((id, i) => ({ label: id, x: nodePos[i][0], y: nodePos[i][1] })), edges: [] });
      gbox.append(gLeg);

      let MEM, SEEN, RES;
      /* memória: MEM[d][v] a d. nap végén; SEEN[d]: a d. nap előtt látott párok */
      function recompute() {
        MEM = []; SEEN = []; let s = new Array(n).fill(0); const seen = new Set();
        for (let d = 0; d < NDAY; d++) {
          SEEN.push(new Set(seen));
          const cnt = new Array(n).fill(0);
          EV.filter(e => e.d === d).forEach(e => { cnt[e.u]++; cnt[e.v]++; seen.add(pairKey(e.u, e.v)); });
          s = s.map((x, v) => lam * x + cnt[v]); MEM.push(s.slice());
        }
        /* teszt: a vágás utáni napok */
        RES = { days: [], pos: [], neg: { easy: [], hist: [], all: [] } };
        for (let d = cut + 1; d < NDAY; d++) {
          const today = EV.filter(e => e.d === d), tk = new Set(today.map(e => pairKey(e.u, e.v))), prev = MEM[d - 1];
          const rows = today.map(e => ({ e, eb: SEEN[d].has(pairKey(e.u, e.v)) ? 1 : 0, mem: prev[e.u] * prev[e.v] }));
          rows.forEach(r => RES.pos.push(r));
          PAIRS.forEach(([u, v]) => {
            const k = pairKey(u, v); if (tk.has(k)) return;
            const o = { u, v, d, eb: SEEN[d].has(k) ? 1 : 0, mem: prev[u] * prev[v] };
            RES.neg[o.eb ? "hist" : "easy"].push(o); RES.neg.all.push(o);
          });
          RES.days.push({ d, rows });
        }
        render(); renderPred(); renderAUC();
      }
      function setDay(d) { day = Math.max(0, Math.min(NDAY - 1, d)); render(); renderPred(); }
      const isVis = watchVisible(root, v => { if (!v && playing) pause(); });
      function play() {
        if (day >= NDAY - 1) setDay(0);
        playing = true; bPlay.textContent = "⏸ megállítás";
        timer = setInterval(() => { if (!isVis() || day >= NDAY - 1) { pause(); return; } setDay(day + 1); if (day >= NDAY - 1) pause(); }, 1100);
      }
      function pause() { playing = false; bPlay.textContent = "▶ lejátszás"; clearInterval(timer); }

      function render() {
        if (!MEM) return;
        dR.value = day; dLab.textContent = D.dayNames[DAYS[day]];
        /* idővonal */
        const cw = TW / NDAY, dx = TW < 500 ? 11 : 17, dr = TW < 500 ? 8 : 9;
        let s = `<rect x="${(cut + 1) * cw}" y="0" width="${TW - (cut + 1) * cw}" height="120" style="fill:var(--setB);opacity:.13"/>`;
        s += `<line x1="${(cut + 1) * cw}" y1="2" x2="${(cut + 1) * cw}" y2="118" style="stroke:var(--setB);stroke-width:2;stroke-dasharray:5 3"/>`;
        s += `<text x="${(cut + 1) * cw - 6}" y="13" text-anchor="end" style="fill:var(--muted);font-size:11px">tanítás ◀</text><text x="${(cut + 1) * cw + 6}" y="13" style="fill:var(--muted);font-size:11px">▶ teszt</text>`;
        for (let d = 0; d < NDAY; d++) {
          const x0 = d * cw, on = d === day, evs = EV.filter(e => e.d === d);
          s += `<rect data-day="${d}" x="${x0 + 2}" y="18" width="${cw - 4}" height="100" rx="6" style="fill:${on ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent"};stroke:${on ? "var(--accent)" : "var(--border)"};stroke-width:${on ? 2 : 1};cursor:pointer"/>`;
          s += `<text x="${x0 + cw / 2}" y="112" text-anchor="middle" style="fill:var(--text);font-size:12px;font-weight:${on ? 700 : 500};pointer-events:none">${DAYS[d]}</text>`;
          evs.forEach((e, k) => {
            const col = k % 2, row = Math.floor(k / 2), cx = x0 + cw / 2 + (col ? dx : -dx) * (evs.length > 1 ? 1 : 0), cy = 34 + row * 22;
            s += `<g style="pointer-events:none"><circle cx="${cx}" cy="${cy}" r="${dr}" style="fill:${d <= day ? "var(--accent)" : "var(--card)"};stroke:var(--accent);stroke-width:1.5"><title>${pn(e.u, e.v)} (${e.art}. cikk)</title></circle>` +
              `<text x="${cx}" y="${cy + 3.5}" text-anchor="middle" style="fill:${d <= day ? "#fff" : "var(--text)"};font-size:9.5px;font-weight:700">${e.art}</text></g>`;
          });
        }
        tl.innerHTML = s;
        /* gráf */
        const today = EV.filter(e => e.d === day), last = new Map(), cntToday = new Map();
        EV.filter(e => e.d <= day).forEach(e => last.set(pairKey(e.u, e.v), e.d));
        today.forEach(e => { const k = pairKey(e.u, e.v); cntToday.set(k, (cntToday.get(k) || 0) + 1); });
        let edges = [];
        if (mode === "snap") edges = [...cntToday.keys()].map(k => { const [a, b] = k.split("-").map(Number); return { a, b, w: 1, color: "--accent", width: 3.5, label: today.filter(e => pairKey(e.u, e.v) === k).map(e => e.art).join(",") }; });
        else edges = [...last.entries()].map(([k, d]) => { const [a, b] = k.split("-").map(Number), on = d === day;
          return { a, b, w: 1, color: on ? "--accent" : "--muted", width: on ? 3.5 : 2, alpha: on ? 1 : Math.max(0.15, Math.pow(0.6, day - d)), label: DAYS[d] }; });
        view.setGraph(view.nodes, edges);
        view.hl = new Set(today.flatMap(e => [e.u, e.v])); view.draw();
        gLeg.innerHTML = mode === "snap"
          ? `${line2("--accent")}az aznapi események (a szám: a cikk) – minden más eltűnik`
          : `${line2("--accent")}aznapi esemény · ${line2("--muted")}korábbi pár (a felirat: a legutóbbi nap; minél régebbi, annál halványabb)`;
        /* memóriasávok */
        const mx = Math.max(1, ...MEM.flat()), BW = 190, inc = new Array(n).fill(0);
        today.forEach(e => { inc[e.u]++; inc[e.v]++; });
        let m = "";
        IDS.forEach((id, v) => {
          const y = 8 + v * 30, val = MEM[day][v], w = BW * val / mx;
          m += `<text x="34" y="${y + 15}" text-anchor="end" style="fill:var(--text);font-size:12px;font-weight:600">${id}</text>`;
          m += `<rect x="40" y="${y + 3}" width="${BW}" height="16" rx="3" style="fill:var(--border);opacity:.45"/>`;
          m += `<rect x="40" y="${y + 3}" width="${w}" height="16" rx="3" style="fill:${inc[v] ? "var(--accent)" : "var(--setA)"}"/>`;
          m += `<text x="${44 + BW}" y="${y + 15}" style="fill:var(--text);font-size:11.5px;font-family:var(--mono)">${fm(val, 4)}${inc[v] ? ` (+${inc[v]})` : ""}</text>`;
        });
        memSvg.innerHTML = m;
        memNote.innerHTML = `${D.dayNames[DAYS[day]]} végén. A (+k): aznapi események; előbb ×λ, aztán +k. A sáv hossza a hét legnagyobb értékéhez mérve.`;
        root.dataset.ts = JSON.stringify({ day: DAYS[day], mode, lam, cut: DAYS[cut], edges: edges.length,
          mem: Object.fromEntries(IDS.map((id, v) => [id, MEM.map(r => round(r[v], 6))])) });
      }
      function renderPred() {
        if (!RES) return;
        const tot = RES.pos.length, hit = RES.pos.filter(r => r.eb).length;
        let s = `<b>Jóslás a teszt napjain</b> (${DAYS[cut + 1]}–${DAYS[NDAY - 1]}): ✓, ha az EdgeBank 1-et adott (a pár előfordult a nap előtt).`;
        const rows = [];
        RES.days.forEach(({ d, rows: rr }) => rr.forEach((r, k) => rows.push({ st: d === day ? "background:color-mix(in srgb, var(--accent) 14%, transparent)" : "",
          c: [k === 0 ? `<b>${DAYS[d]}</b>` : "", pn(r.e.u, r.e.v), `${r.e.art}.`, r.eb ? "✓ 1" : "✗ 0", fm(r.mem, 3)] })));
        s += `<div class="tw">${tblHTML(["nap", "esemény", "cikk", "EdgeBank", "$s_u \\cdot s_v$"], rows)}</div>`;
        s += `EdgeBank-találat: <b>${hit} / ${tot}</b> (${RES.days.map(o => `${DAYS[o.d]} ${o.rows.filter(r => r.eb).length}/${o.rows.length}`).join(", ")}).`;
        pred.innerHTML = s; math(pred);
      }
      function renderAUC() {
        if (!RES) return;
        const res = {};
        ["easy", "hist", "all"].forEach(k => {
          const N = RES.neg[k];
          res[k] = { n: N.length, eb: aucPairs(RES.pos.map(r => r.eb), N.map(o => o.eb)), mem: aucPairs(RES.pos.map(r => r.mem), N.map(o => o.mem)) };
        });
        const r = res[negMode], f3 = x => (isFinite(x) ? fmt(x, 3) : "– (nincs negatív)");
        aucBox.innerHTML = `<b>AUC</b> (az összes teszt-pozitív × a választott negatívák, ${RES.pos.length} × ${r.n}; holtverseny ½):` +
          `<div class="tw">${tblHTML(["módszer", "AUC"], [["EdgeBank", `<b>${f3(r.eb)}</b>`], ["memória-szorzat $s_u \\cdot s_v$", `<b>${f3(r.mem)}</b>`]])}</div>` +
          `<span class="muted">Mind a három negatívkészlettel: ${[["easy", "könnyű"], ["hist", "történeti"], ["all", "minden"]].map(([k, l]) => `${l} (${res[k].n}): EdgeBank ${f3(res[k].eb)}, memória ${f3(res[k].mem)}`).join(" · ")}.</span>`;
        math(aucBox);
        root.dataset.auc = JSON.stringify({ negMode, lam, cut: DAYS[cut], P: RES.pos.length, hits: RES.pos.filter(x => x.eb).length,
          res: Object.fromEntries(Object.entries(res).map(([k, o]) => [k, { n: o.n, eb: round(o.eb), mem: round(o.mem) }])) });
      }
      recompute();
    };
  }
