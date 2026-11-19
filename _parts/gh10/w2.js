  /* ==================================================================
     w2: 10.5–10.7 widgetjei (backbone-filter, missing-data, sensitivity-grid, ergm-toy)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = (c, dash = false) => dash
      ? `<span style="display:inline-block;width:1.3em;height:0;border-top:2.5px dashed ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`
      : `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const svgEl = (Wd, Ht, inner, label, extra = "") =>
      `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;touch-action:manipulation" role="img" aria-label="${label}" ${extra}>${inner}</svg>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const pct = (x, d = 0) => fmt(100 * x, d) + "%";
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");
    /* darabolt futtatás: job(i), i = 0 … total − 1, kötegenként „per” darab → leállító függvény */
    function chunked(total, per, job, onProg, onDone) {
      let i = 0, dead = false;
      const tick = () => {
        if (dead) return;
        const end = Math.min(total, i + per);
        for (; i < end; i++) job(i);
        onProg(i);
        if (i < total) setTimeout(tick, 0); else onDone();
      };
      setTimeout(tick, 0);
      return () => { dead = true; };
    }
    const range = (min, max, step, value, label, oninput, width = "9rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:42vw`, oninput });
    const mono = txt => h("b", { style: "font-family:var(--mono);min-width:3.2em;display:inline-block" }, txt);
    const argmax = v => { let b = 0; for (let i = 1; i < v.length; i++) if (v[i] > v[b]) b = i; return b; };
    const tbl = (head, rows, cls = "") =>
      `<table class="${cls}" style="width:auto;margin:.3rem 0;font-size:.88rem"><thead><tr>${head.map(x => `<th style="padding:.2em .5em">${x}</th>`).join("")}</tr></thead>` +
      `<tbody>${rows.map(r => `<tr${r.cls ? ` class="${r.cls}"` : ""}${r.st ? ` style="${r.st}"` : ""}>${(r.c || r).map(x => `<td style="padding:.2em .5em;text-align:center">${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    /* sajátvektor-centralitás (hatványiteráció az A + I mátrixszal; maximum 1-re normálva) */
    function eigC(n, edges) {
      const L = nbrs(n, edges); let x = new Array(n).fill(1);
      for (let it = 0; it < 300; it++) {
        const y = x.map((v, i) => v + L[i].reduce((s, j) => s + x[j], 0));
        const mx = Math.max(...y) || 1, z = y.map(v => v / mx);
        const d = z.reduce((s, v, i) => s + Math.abs(v - x[i]), 0); x = z;
        if (d < 1e-10) break;
      }
      return x;
    }
    /* stabil sorrend: indexek csökkenő kulcs szerint (holtversenyben az eredeti sorrend) */
    const orderBy = (n, key) => [...Array(n).keys()].sort((i, j) => key(j) - key(i) || i - j);

    /* ------------------------------------------------------------------
       10.5  backbone-filter – globális küszöb vs. diszparitásszűrő
       ------------------------------------------------------------------ */
    W["backbone-filter"] = root => {
      header(root, "Hálózati gerinc: globális küszöb vagy diszparitásszűrő?",
        "A <b>globális küszöb</b> minden $w \\ge t$ súlyú élt megtart. A <b>diszparitásszűrő</b> csúcsonként dönt: az $i$ felől " +
        "$\\alpha_{ij} = (1 - w_{ij}/s_i)^{k_i - 1}$ annak az esélye, hogy egy véletlen súlyelosztásban ekkora rész jutna erre az élre; " +
        "az él megmarad, ha valamelyik végéről $\\alpha_{ij} \\lt \\alpha$. Kattints egy élre vagy csúcsra a részletekért.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let net = "lesmis", mode = "disp", t = 3, alpha = 0.2, cmp = false, selE = -1, selN = -1;
      const starW = [10, 1, 1, 1];
      let G, n, DS, maxW, totW;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["arviz", "Árvízhét"], ["lesmis", "Les Misérables"], ["star", "kis csillag"]], net, v => { net = v; build(); });
      const c2 = h("div", { class: "controls" });
      const paintMode = toggleGroup(c2, [["global", "globális küszöb"], ["disp", "diszparitásszűrő"]], mode, v => { mode = v; update(); });
      const bCmp = btn("Összevetés: ugyanannyi él a másik módszerrel", () => { cmp = !cmp; update(); });
      c2.append(bCmp);
      const c3 = h("div", { class: "controls" });
      const tOut = mono("3"), aOut = mono("0,200");
      const tSl = range(1, 31, 1, t, "súlyküszöb", () => { t = +tSl.value; tOut.textContent = "≥ " + t; update(); });
      /* α logaritmikus skálán: 0,01 … 0,6 */
      const a2v = a => Math.round(100 * Math.log(a / 0.01) / Math.log(60)), v2a = v => 0.01 * Math.pow(60, v / 100);
      const aSl = range(0, 100, 1, a2v(alpha), "szignifikanciaszint (alfa)", () => { alpha = v2a(+aSl.value); update(); });
      const tLab = h("label", null, "küszöb $t$:", tSl, tOut), aLab = h("label", null, "$\\alpha$:", aSl, aOut);
      const aBtns = h("span", { style: "display:inline-flex;gap:.3rem;flex-wrap:wrap" },
        ...[0.05, 0.1, 0.2, 0.3].map(a => btn(fmt(a, 2), () => { alpha = a; aSl.value = a2v(a); update(); })));
      c3.append(tLab, aLab, aBtns);
      math(c3);
      const c4 = h("div", { class: "controls" });
      const selInfo = h("span", { style: "font-size:.9rem" });
      const wEdit = h("span", { style: "display:inline-flex;gap:.3rem" },
        btn("súly −1", () => editW(-1)), btn("súly +1", () => editW(1)));
      c4.append(selInfo, wEdit);
      root.append(c1, c2, c3);
      const box = h("div");
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" });
      const cmpBox = h("div", { class: "readout", style: "display:none" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A globális küszöb a nagyokat tartja meg; a diszparitásszűrő mindenkinél a saját legfontosabb kapcsolatait – ezért marad meg a kisebb szereplők szerkezete is.");
      root.append(box, c4, legend, info, cmpBox, tw, lesson);
      const view = new GK.View(box, { aspect: 0.62, radius: 6, draggable: false,
        onEdgeClick: i => { selE = selE === i ? -1 : i; selN = -1; update(); },
        onNodeClick: i => { selN = selN === i ? -1 : i; selE = -1; update(); } });

      const nm = i => (net === "lesmis" ? G.nodes[i].name : G.nodes[i].sub || G.nodes[i].label);
      function build() {
        selE = selN = -1;
        if (net === "lesmis") { G = lesmisGraph(0.62); view.o.aspect = 0.62; view.o.radius = narrow ? 4 : 5.5; view.o.edgeHitTol = 5; }
        else if (net === "arviz") { G = preset("arviz", 0.5); view.o.aspect = 0.5; view.o.radius = narrow ? 12 : 15; view.o.edgeHitTol = 9; }
        else {
          const P = GK.normalize([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]], 0.5);
          G = { nodes: ["K", "1", "2", "3", "4"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1], sub: i ? "levél " + l : "középső" })),
            edges: starW.map((w, i) => ({ a: 0, b: i + 1, w })) };
          view.o.aspect = 0.5; view.o.radius = narrow ? 12 : 15; view.o.edgeHitTol = 10;
        }
        n = G.nodes.length;
        view.setGraph(G.nodes, G.edges); view.resize();
        recalc();
        tSl.max = Math.max(...G.edges.map(e => e.w));
        t = net === "lesmis" ? 3 : 2; tSl.value = t; tOut.textContent = "≥ " + t;
        update();
      }
      function recalc() {
        DS = disparity(n, G.edges);
        maxW = Math.max(...G.edges.map(e => e.w)); totW = G.edges.reduce((s, e) => s + e.w, 0);
      }
      function editW(dv) {
        if (net !== "star" || selE < 0) return;
        starW[selE] = Math.max(1, Math.min(20, starW[selE] + dv));
        G.edges[selE].w = starW[selE];
        recalc(); tSl.max = maxW; update();
      }
      /* megtartott élek indexhalmaza: a mód szerint, vagy (ugyanannyi él) a másik módszer rangsorával */
      const keepBy = m => (m === "disp" ? G.edges.map((_, i) => i).filter(i => DS[i].alpha < alpha) : G.edges.map((_, i) => i).filter(i => G.edges[i].w >= t));
      const topM = (m, M) => (m === "global"
        ? orderBy(G.edges.length, i => G.edges[i].w).slice(0, M)
        : orderBy(G.edges.length, i => -DS[i].alpha).slice(0, M));
      function summary(K) {
        const S = new Set(K), nodes = new Set();
        K.forEach(i => { nodes.add(G.edges[i].a); nodes.add(G.edges[i].b); });
        const V = [...nodes].sort((a, b) => a - b), idx = new Map(V.map((v, k) => [v, k]));
        const comps = V.length ? components(V.length, K.map(i => ({ a: idx.get(G.edges[i].a), b: idx.get(G.edges[i].b) }))).sizes.length : 0;
        return { S, nodes, m: K.length, v: V.length, comps, ws: K.reduce((s, i) => s + G.edges[i].w, 0) / totW };
      }
      function update() {
        paintMode(mode);
        tLab.style.display = mode === "global" ? "" : "none";
        aLab.style.display = aBtns.style.display = mode === "disp" ? "" : "none";
        aOut.textContent = fmt(alpha, 3);
        bCmp.classList.toggle("on", cmp);
        const K = keepBy(mode), A = summary(K);
        const other = mode === "disp" ? "global" : "disp";
        const B = cmp ? summary(topM(other, K.length)) : null;
        const wid = w => (net === "lesmis" ? 0.9 + 4.2 * Math.sqrt(w / maxW) : 1.5 + 5 * w / maxW);
        const faded = mixColor("--card", "--muted", 0.35);
        const edges = G.edges.map((e, i) => {
          const inA = A.S.has(i), inB = B && B.S.has(i), o = { a: e.a, b: e.b, w: e.w, label: net === "lesmis" ? "" : String(e.w) };
          if (B) {
            if (inA && inB) Object.assign(o, { color: "--setC", width: wid(e.w) });
            else if (inA) Object.assign(o, { color: "--setA", width: wid(e.w) });
            else if (inB) Object.assign(o, { color: "--setB", width: wid(e.w), dash: [5, 3] });
            else Object.assign(o, { color: "--border", width: 0.8, alpha: 0.6 });
          } else if (inA) Object.assign(o, { color: "--setA", width: wid(e.w) });
          else Object.assign(o, { color: "--border", width: net === "lesmis" ? 0.7 : 1.2, alpha: 0.7, dash: net === "lesmis" ? null : [4, 4] });
          if (i === selE) Object.assign(o, { color: "--accent", width: Math.max(3, (o.width || 1) + 1.5), alpha: 1, dash: null });
          return o;
        });
        const nodes = G.nodes.map((nd, i) => {
          const inA = A.nodes.has(i), inB = B && B.nodes.has(i);
          let color = inA ? "--setA" : faded, ink = inA ? null : "--muted";
          if (B) { color = inA && inB ? "--setC" : inA ? "--setA" : inB ? "--setB" : faded; ink = inA || inB ? null : "--muted"; }
          const o = Object.assign({}, nd, { color, ink });
          if (net === "lesmis") o.sub = i === selN || (selE >= 0 && (G.edges[selE].a === i || G.edges[selE].b === i)) ? nd.name : "";
          return o;
        });
        view.o.showWeights = net !== "lesmis";
        view.hl = new Set(selN >= 0 ? [selN] : []);
        view.setGraph(nodes, edges);
        legend.innerHTML = B
          ? `${sw("--setC")}mindkettőben ${sw("--setA")}csak ${mode === "disp" ? "a diszparitásszűrőben" : "a küszöbben"} ${sw("--setB", true)}csak ${mode === "disp" ? "a küszöbben" : "a diszparitásszűrőben"} ${sw("--border", true)}kiesik`
          : `${sw("--setA")}megmaradó él / csúcs (vastagság = súly) ${sw("--border", true)}kieső él, halvány csúcs: nincs megmaradó éle`;
        /* kiírás */
        const cond = mode === "disp" ? `$\\alpha_{ij} \\lt ${fmM(alpha, 3)}$` : `$w \\ge ${t}$`;
        let s = `${cond}: megmarad <b>${A.m}</b> / ${G.edges.length} él, <b>${A.v}</b> / ${n} csúcs (amelynek van megmaradó éle), ` +
          `<b>${A.comps}</b> komponens, a teljes súly <b>${pct(A.ws, 1)}</b>-a.`;
        if (mode === "disp") {
          const drop = G.edges.map((_, i) => i).filter(i => !A.S.has(i));
          if (drop.length) { const j = orderBy(drop.length, k => G.edges[drop[k]].w)[0], e = G.edges[drop[j]]; s += `<br>A legnagyobb kieső súly: ${nm(e.a)} – ${nm(e.b)} ($w = ${e.w}$).`; }
          const amin = Math.min(...DS.map(d => d.alpha));
          if (!A.m) s += `<br>Egy él sem marad: a legkisebb $\\alpha_{ij}$ itt ${fmt(amin, 3)}. Kis fokszámnál a szűrő nem tud „szignifikáns” lenni – kevés élre nem lehet nagyon egyenlőtlenül elosztani a súlyt.`;
        }
        if (selE >= 0) {
          const e = G.edges[selE], d = DS[selE];
          s += `<br><br><b>${nm(e.a)} – ${nm(e.b)}</b>: $w = ${e.w}$; ${nm(e.a)} felől $\\alpha = ${fmM(d.alphaA, 3)}$, ${nm(e.b)} felől $\\alpha = ${fmM(d.alphaB, 3)}$ → ` +
            `$\\alpha_{ij} = ${fmM(d.alpha, 3)}$ (${A.S.has(selE) ? "megmarad" : "kiesik"}).`;
        } else if (selN >= 0) {
          const inc = G.edges.map((e, i) => i).filter(i => G.edges[i].a === selN || G.edges[i].b === selN);
          const sN = inc.reduce((q, i) => q + G.edges[i].w, 0), kept = inc.filter(i => A.S.has(i)).length;
          s += `<br><br><b>${nm(selN)}</b>: fokszám $k = ${inc.length}$, erősség $s = ${sN}$; megmaradó éle: ${kept}.`;
        }
        info.innerHTML = s; math(info);
        selInfo.textContent = net === "star" ? (selE >= 0 ? `kijelölt él: K – ${selE + 1}, súly ${G.edges[selE].w}` : "Kattints egy élre a súlya módosításához:") : "";
        c4.style.display = net === "star" ? "" : "none";
        wEdit.style.display = selE >= 0 ? "" : "none";
        /* összevetés */
        cmpBox.style.display = B ? "" : "none";
        let res = { mode, net, m: A.m, v: A.v, comps: A.comps, ws: +A.ws.toFixed(4) };
        if (B) {
          const onlyA = [...A.nodes].filter(i => !B.nodes.has(i)), onlyB = [...B.nodes].filter(i => !A.nodes.has(i));
          const list = L => (L.length ? L.map(nm).join(", ") : "–");
          const otherName = other === "global" ? `a ${A.m} legnagyobb súlyú él (holtversenyben az adatsorrend dönt)` : `a ${A.m} legkisebb $\\alpha$-jú él`;
          cmpBox.innerHTML = `Ugyanannyi él a másik módszerrel – ${otherName}: <b>${B.v}</b> csúcs, <b>${B.comps}</b> komponens, a súly <b>${pct(B.ws, 1)}</b>-a.<br>` +
            `Csak ${mode === "disp" ? "a diszparitásszűrőben" : "a küszöbben"} marad (${onlyA.length}): ${list(onlyA)}<br>` +
            `Csak ${mode === "disp" ? "a küszöbben" : "a diszparitásszűrőben"} marad (${onlyB.length}): ${list(onlyB)}`;
          math(cmpBox);
          res.cmp = { v: B.v, comps: B.comps, ws: +B.ws.toFixed(4), onlyA: onlyA.map(nm), onlyB: onlyB.map(nm) };
        }
        if (mode === "disp") { const drop = G.edges.map((_, i) => i).filter(i => !A.S.has(i)); if (drop.length) { const e = G.edges[drop[orderBy(drop.length, k => G.edges[drop[k]].w)[0]]]; res.maxDrop = [nm(e.a), nm(e.b), e.w]; } }
        root.dataset.result = JSON.stringify(res);
        /* éltáblázat a kis gráfokra */
        if (net !== "lesmis") {
          const ord = orderBy(G.edges.length, i => -DS[i].alpha);
          tw.innerHTML = tbl(["él", "$w$", "$\\alpha$ az 1. vég felől", "$\\alpha$ a 2. vég felől", "$\\alpha_{ij}$ (kisebb)", mode === "disp" ? "marad?" : "$w \\ge t$?"],
            ord.map(i => {
              const e = G.edges[i], d = DS[i];
              return { c: [`${G.nodes[e.a].label} – ${G.nodes[e.b].label}`, e.w, fmt(d.alphaA, 3), fmt(d.alphaB, 3), `<b>${fmt(d.alpha, 3)}</b>`, A.S.has(i) ? "✓" : "–"],
                st: i === selE ? "background:var(--accent-soft)" : "" };
            }));
          math(tw);
        } else tw.innerHTML = "";
        root.dataset.alphas = JSON.stringify(DS.map(d => +d.alpha.toFixed(4)));
      }
      onTheme(update);
      build();
    };

    /* ------------------------------------------------------------------
       10.6  missing-data – hiányzó élek / csúcsok és a centralitás-rangsor
       ------------------------------------------------------------------ */
    W["missing-data"] = root => {
      header(root, "Hiányzó adat: mennyire bízhatsz a rangsorban?",
        "Töröld véletlenszerűen az élek (vagy a csúcsok) egy $f$ részét, számold újra a centralitást, és vesd össze a rangsort az eredetivel " +
        "(Spearman-féle $\\rho$: 1 = ugyanaz a sorrend). Csúcsok hiányánál csak a megmaradt csúcsok rangsorát hasonlítjuk.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let net = "karate", what = "edges", f = 0.2, meas = "btw", seed = 1, G, n, base = {}, sample = null, delE = -1, stopper = null;
      const MEAS = { deg: ["fokszám", (n, E) => degreeC(n, E)], btw: ["köztesség", (n, E) => betweennessC(n, E)], eig: ["sajátvektor", eigC] };
      const MCOL = { deg: "--setA", btw: "--setB", eig: "--setC" };

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["karate", "karateklub"], ["arviz", "Árvízhét"], ["krack", "Krackhardt: barátság"]], net, v => { net = v; build(); });
      const c2 = h("div", { class: "controls" });
      toggleGroup(c2, [["edges", "élek hiányoznak"], ["nodes", "csúcsok hiányoznak"]], what, v => { what = v; sample = null; delE = -1; newSample(); });
      const fOut = mono("20%");
      const fSl = range(0, 50, 5, 20, "hiányzó arány", () => { f = +fSl.value / 100; fOut.textContent = pct(f); newSample(); });
      c2.append(h("label", null, "hiányzik:", fSl, fOut));
      const c3 = h("div", { class: "controls" });
      toggleGroup(c3, Object.entries(MEAS).map(([k, v]) => [k, v[0]]), meas, v => { meas = v; render(); });
      c3.append(btn("1 minta", () => newSample(), "btn primary"), btn("100 minta", () => many()),
        btn("Görbe: 6 arány × 100 minta", () => curve()));
      const prog = h("span", { class: "muted", style: "font-size:.85rem" });
      c3.append(prog);
      root.append(c1, c2, c3);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), side = h("div");
      grid.append(box, side); root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" }), manyBox = h("div", { class: "readout", style: "display:none" });
      const curveBox = h("div", { style: "margin-top:.5rem" });
      const arvBox = h("div", { style: "margin-top:.6rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Kevés hiány a rangsor elejét alig rontja, de egyetlen híd-él is átírhatja, ki a „legfontosabb közvetítő” – a köztesség érzékenyebb, mint a fokszám.");
      box.append(legend);
      root.append(info, manyBox, curveBox, arvBox, lesson);
      const view = new GK.View(box, { aspect: 0.62, radius: 9, draggable: false,
        onEdgeClick: i => { if (net !== "arviz") return; delE = delE === i ? -1 : i; render(); } });
      box.prepend(view.c);

      const lab = i => G.nodes[i].label;
      function build() {
        if (stopper) { stopper(); stopper = null; prog.textContent = ""; }
        if (net === "karate") { G = preset("karate", 0.62); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); view.o.aspect = 0.62; view.o.radius = narrow ? 7 : 8; }
        else if (net === "arviz") { G = preset("arviz", 0.5); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); view.o.aspect = 0.5; view.o.radius = narrow ? 12 : 14; }
        else {
          const K = krackData(), E = [];
          for (let i = 0; i < K.n; i++) for (let j = i + 1; j < K.n; j++) if (K.friendship[i][j] || K.friendship[j][i]) E.push({ a: i, b: j, w: 1 });
          const P = GK.forceLayout(K.n, E.map(e => [e.a, e.b]), { seed: 3, aspect: 0.62 });
          G = { nodes: P.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1] })), edges: E };
          view.o.aspect = 0.62; view.o.radius = narrow ? 9 : 11;
        }
        n = G.nodes.length;
        Object.keys(MEAS).forEach(k => (base[k] = MEAS[k][1](n, G.edges)));
        view.setGraph(G.nodes, G.edges); view.resize();
        sample = null; delE = -1; manyBox.style.display = "none"; curveBox.innerHTML = "";
        root.dataset.base = JSON.stringify({ n, m: G.edges.length, btw: base.btw.map(x => +x.toFixed(3)) });
        newSample();
      }
      /* egy hiányos minta: { keepE (élindexek) | keepN (csúcsindexek), cent: { deg, btw, eig } (a megmaradt csúcsokra) } */
      function draw1(R) {
        if (what === "edges") {
          const M = G.edges.length, k = Math.round(M * (1 - f)), p = randPerm(M, R), keepE = p.slice(0, k).sort((a, b) => a - b);
          const E = keepE.map(i => G.edges[i]), cent = {};
          Object.keys(MEAS).forEach(q => (cent[q] = MEAS[q][1](n, E)));
          return { keepE, keepN: [...Array(n).keys()], cent };
        }
        const k = Math.round(n * (1 - f)), keepN = randPerm(n, R).slice(0, k).sort((a, b) => a - b), idx = new Map(keepN.map((v, t) => [v, t]));
        const E = G.edges.filter(e => idx.has(e.a) && idx.has(e.b)).map(e => ({ a: idx.get(e.a), b: idx.get(e.b), w: 1 })), cent = {};
        Object.keys(MEAS).forEach(q => (cent[q] = MEAS[q][1](k, E)));
        return { keepN, cent, keepE: G.edges.map((e, i) => i).filter(i => idx.has(G.edges[i].a) && idx.has(G.edges[i].b)) };
      }
      /* összevetés az eredetivel: ρ és „ugyanaz-e az első” (holtversenyben a kisebb sorszámú számít elsőnek) */
      function score(S, q) {
        const b0 = S.keepN.map(i => base[q][i]), b1 = S.cent[q];
        return { rho: spearman(b0, b1), same: argmax(b0) === argmax(b1) };
      }
      function newSample() {
        if (stopper) { stopper(); stopper = null; prog.textContent = ""; }
        delE = -1;
        sample = draw1(rng(seed++));
        render();
      }
      function render() {
        const S = sample, q = meas, faded = mixColor("--card", "--muted", 0.3);
        let nodes, edges;
        if (delE >= 0) {
          nodes = G.nodes.map(nd => Object.assign({}, nd, { color: null }));
          edges = G.edges.map((e, i) => (i === delE ? { ...e, color: "--setB", dash: [5, 4], width: 2.5 } : { ...e, color: "--muted" }));
          legend.innerHTML = `${sw("--setB", true)}a törölt él (kattints rá még egyszer a visszaállításhoz)`;
        } else {
          const inN = new Set(S.keepN), inE = new Set(S.keepE), sc = new Map(S.keepN.map((v, t) => [v, S.cent[q][t]]));
          const mx = Math.max(...S.cent[q]) || 1;
          nodes = G.nodes.map((nd, i) => inN.has(i)
            ? Object.assign({}, nd, { color: mixColor("--card", MCOL[q], 0.25 + 0.75 * sc.get(i) / mx), ink: sc.get(i) / mx > 0.5 ? null : "--text" })
            : Object.assign({}, nd, { color: faded, ink: "--muted" }));
          edges = G.edges.map((e, i) => (inE.has(i) ? { ...e, color: "--muted" } : { ...e, color: "--border", dash: [4, 4], alpha: 0.8 }));
          legend.innerHTML = `${sw("--border", true)}${what === "edges" ? "hiányzó él" : "hiányzó csúcs és élei (halvány)"} · a csúcs színe: ${MEAS[q][0]} a hiányos gráfon`;
        }
        view.setGraph(nodes, edges);
        /* rangsorok */
        const sc = score(S, q), b0 = S.keepN.map(i => base[q][i]), b1 = S.cent[q];
        const o0 = orderBy(b0.length, t => b0[t]).slice(0, 5), o1 = orderBy(b1.length, t => b1[t]).slice(0, 5);
        const d = q === "btw" ? 1 : q === "eig" ? 2 : 0;
        side.innerHTML = `<div class="tw" style="overflow-x:auto">${tbl(["hely", "eredeti", "hiányos"],
          o0.map((_, r) => [r + 1 + ".", `${lab(S.keepN[o0[r]])} <span class="muted">(${fmt(b0[o0[r]], d)})</span>`, `${lab(S.keepN[o1[r]])} <span class="muted">(${fmt(b1[o1[r]], d)})</span>`]))}</div>` +
          `<p class="muted" style="font-size:.85rem;margin:.2rem 0">${what === "nodes" ? "Az eredeti oszlop is csak a megmaradt csúcsokat rangsorolja." : "Mind a " + n + " csúcs rangsora."}</p>`;
        info.innerHTML = `${what === "edges" ? `törölve ${G.edges.length - S.keepE.length} / ${G.edges.length} él` : `törölve ${n - S.keepN.length} / ${n} csúcs`} (${pct(f)}) · ` +
          `${MEAS[q][0]}: Spearman <b>ρ = ${fmt(sc.rho, 3)}</b> · az első helyezett ${sc.same ? "<b>ugyanaz</b>" : "<b>más</b>"}`;
        root.dataset.sample = JSON.stringify({ rho: +sc.rho.toFixed(4), same: sc.same });
        renderArv();
      }
      function many() {
        if (stopper) stopper();
        const R = rng(1000 + seed++), acc = {}; Object.keys(MEAS).forEach(q => (acc[q] = { r: [], s: 0 }));
        const T = 100;
        stopper = chunked(T, 10, () => { const S = draw1(R); Object.keys(MEAS).forEach(q => { const s = score(S, q); acc[q].r.push(s.rho); acc[q].s += s.same; }); },
          i => (prog.textContent = `${i} / ${T} minta…`),
          () => {
            stopper = null; prog.textContent = "";
            const out = {};
            manyBox.style.display = "";
            manyBox.innerHTML = `${T} minta, ${what === "edges" ? "élek" : "csúcsok"} ${pct(f)}-a hiányzik:<br>` + Object.keys(MEAS).map(q => {
              const ms = meanSd(acc[q].r); out[q] = { rho: +ms.mean.toFixed(3), same: acc[q].s / T };
              return `${sw(MCOL[q])}${MEAS[q][0]}: átlagos ρ = <b>${fmt(ms.mean, 3)}</b> (szórás ${fmt(ms.sd, 3)}), az első helyezett egyezik: <b>${pct(acc[q].s / T)}</b>`;
            }).join("<br>");
            root.dataset.many = JSON.stringify(out);
          });
      }
      function curve() {
        if (stopper) stopper();
        const FS = [0, 0.05, 0.1, 0.2, 0.3, 0.5], T = 100, R = rng(5000 + seed++), f0 = f, res = FS.map(() => { const o = {}; Object.keys(MEAS).forEach(q => (o[q] = { r: 0, s: 0 })); return o; });
        stopper = chunked(FS.length * T, 20, i => {
          const k = Math.floor(i / T); f = FS[k];
          const S = draw1(R); Object.keys(MEAS).forEach(q => { const s = score(S, q); res[k][q].r += s.rho / T; res[k][q].s += s.same / T; });
          f = f0;
        }, i => (prog.textContent = `görbe: ${i} / ${FS.length * T}…`), () => {
          stopper = null; prog.textContent = ""; f = f0;
          const L = 40, Rm = 10, Tp = 22, B = 30, Wd = 330, Ht = 210, X = x => L + x / 0.5 * (Wd - L - Rm);
          const panel = (key, title, ymin) => {
            const Y = y => Tp + (1 - (y - ymin) / (1 - ymin)) * (Ht - Tp - B);
            let g = `<text x="${L}" y="14" font-size="12" font-weight="600" fill="${sv("--text")}">${title}</text>`;
            for (let j = 0, J = Math.round((1 - ymin) / 0.1) > 5 ? Math.round((1 - ymin) / 0.2) : Math.round((1 - ymin) / 0.1); j <= J; j++) { const y = ymin + j * (1 - ymin) / J; g += `<line x1="${L}" y1="${Y(y)}" x2="${Wd - Rm}" y2="${Y(y)}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${L - 4}" y="${Y(y) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(key === "s" ? 100 * y : y, key === "s" ? 0 : 2)}${key === "s" ? "%" : ""}</text>`; }
            FS.forEach(x => g += `<text x="${X(x)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${pct(x)}</text>`);
            g += `<text x="${(L + Wd) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">hiányzó arány f</text>`;
            Object.keys(MEAS).forEach((q, qi) => {
              const pts = FS.map((x, k) => `${X(x)},${Y(Math.max(ymin, res[k][q][key]))}`);
              g += `<polyline points="${pts.join(" ")}" fill="none" stroke="${sv(MCOL[q])}" stroke-width="2.2" ${qi === 2 ? 'stroke-dasharray="5 3"' : ""}/>` +
                pts.map(p => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="${sv(MCOL[q])}"/>`).join("");
            });
            return svgEl(Wd, Ht, g, title);
          };
          const minR = Math.min(...res.map(o => Math.min(...Object.values(o).map(v => v.r))));
          const minS = Math.min(...res.map(o => Math.min(...Object.values(o).map(v => v.s))));
          curveBox.innerHTML = `<div class="two-col">${panel("r", "átlagos Spearman ρ", Math.max(-1, Math.min(0.8, Math.floor(minR * 5) / 5)))}${panel("s", "az első helyezett egyezik", Math.min(0.8, Math.floor(minS * 5) / 5))}</div>` +
            `<p class="muted" style="font-size:.86rem;margin:.2rem 0">${Object.keys(MEAS).map(q => sw(MCOL[q]) + MEAS[q][0]).join(" ")} · ${what === "edges" ? "élek" : "csúcsok"} hiányoznak, pontonként ${T} minta</p>` +
            `<div class="tw" style="overflow-x:auto">${tbl(["$f$", ...Object.keys(MEAS).map(q => MEAS[q][0] + " ρ"), ...Object.keys(MEAS).map(q => MEAS[q][0] + ": 1. egyezik")],
              FS.map((x, k) => [pct(x), ...Object.keys(MEAS).map(q => fmt(res[k][q].r, 3)), ...Object.keys(MEAS).map(q => pct(res[k][q].s))]))}</div>`;
          math(curveBox);
          root.dataset.curve = JSON.stringify(FS.map((x, k) => [x, ...Object.keys(MEAS).map(q => +res[k][q].r.toFixed(3)), ...Object.keys(MEAS).map(q => +res[k][q].s.toFixed(2))]));
        });
      }
      /* Árvízhét: egyetlen él törlése → köztesség előtte / utána */
      function renderArv() {
        if (net !== "arviz") { arvBox.innerHTML = ""; return; }
        const b0 = base.btw;
        let s = `<p style="margin:.2rem 0;font-size:.92rem"><b>Egy él törlése:</b> kattints a gráfon egy élre – a táblázat a köztességet (nem normálva) mutatja előtte és utána.</p>`;
        if (delE < 0) {
          const o = orderBy(n, i => b0[i]);
          s += `<div class="tw" style="overflow-x:auto">${tbl(["szereplő", ...o.map(i => lab(i))], [["köztesség", ...o.map(i => fmt(b0[i], 1))]])}</div>`;
        } else {
          const E = G.edges.filter((_, i) => i !== delE), b1 = betweennessC(n, E), o = orderBy(n, i => b1[i]), e = G.edges[delE];
          const t0 = argmax(b0), t1 = argmax(b1), tie1 = o.filter(i => Math.abs(b1[i] - b1[o[0]]) < 1e-9);
          s += `<div class="tw" style="overflow-x:auto">${tbl(["szereplő", "előtte", "utána", "változás"],
            o.map(i => ({ c: [`${lab(i)} <span class="muted">(${actorName(lab(i))})</span>`, fmt(b0[i], 1), `<b>${fmt(b1[i], 1)}</b>`, (b1[i] - b0[i] > 1e-9 ? "+" : "") + fmt(b1[i] - b0[i], 1)],
              st: tie1.includes(i) ? "background:var(--accent-soft)" : "" })))}</div>` +
            `<div class="readout">${lab(e.a)} – ${lab(e.b)} törölve: ` +
            (tie1.length > 1 ? `holtverseny az élen: ${tie1.map(lab).join(" = ")} (${fmt(b1[o[0]], 1)})` : `az első: <b>${lab(t1)}</b> (${fmt(b1[t1], 1)})${t1 !== t0 ? " – megváltozott, ki a legfontosabb közvetítő!" : " – nem változott"}`) +
            ` · Spearman ρ = ${fmt(spearman(b0, b1), 3)}</div>`;
          root.dataset.del = JSON.stringify({ edge: [lab(e.a), lab(e.b)], btw: Object.fromEntries(G.nodes.map((nd, i) => [nd.label, +b1[i].toFixed(2)])) });
        }
        arvBox.innerHTML = s;
      }
      root._delEdge = (a, b) => { delE = G.edges.findIndex(e => (lab(e.a) === a && lab(e.b) === b) || (lab(e.a) === b && lab(e.b) === a)); render(); };
      onTheme(render);
      build();
    };

    /* ------------------------------------------------------------------
       10.6  sensitivity-grid – küszöb × felbontás robusztussági térkép
       ------------------------------------------------------------------ */
    W["sensitivity-grid"] = root => {
      header(root, "Érzékenységvizsgálat: küszöb × felbontás",
        "Les Misérables, súlyozott Louvain. Két elemzői döntés: melyik éleket tartod meg ($w \\ge t$), és milyen felbontással ($\\gamma$) keresel közösségeket. " +
        "Cellánként 5 futás, a legnagyobb modularitású felbontás számít; az NMI az alapesethez ($t = 1$, $\\gamma = 1$) méri a hasonlóságot. Kattints egy cellára!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const TS = [1, 2, 3, 5], GS = [0.5, 1, 1.5, 2], RUNS = 5;
      const G = lesmisGraph(0.62), n = G.nodes.length;
      let seed0 = 1, cells = null, baseLab = null, sel = [0, 1], stopper = null;
      const c1 = h("div", { class: "controls" });
      const prog = h("span", { class: "muted", style: "font-size:.85rem" });
      c1.append(btn("Újraszámolás más véletlen magokkal", () => { seed0 += 100; run(); }), prog);
      root.append(c1);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" }), box = h("div");
      grid.append(tw, box); root.append(grid);
      const info = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Ha egy állítás csak egy cellában igaz, az a beállítás eredménye, nem a hálózaté. A küszöb itt sokkal többet változtat, mint a felbontás.");
      root.append(info, lesson);
      const view = new GK.View(box, { aspect: 0.62, radius: narrow ? 4 : 5.5, draggable: false, maxW: 420 });

      const edgesAt = t => G.edges.filter(e => e.w >= t);
      function best(t, g) {
        const E = edgesAt(t); let b = null; const all = [];
        for (let r = 0; r < RUNS; r++) {
          const L = louvain(n, E, { gamma: g, weighted: true, R: rng(seed0 + r) });
          all.push(L.lab);
          if (!b || L.Q > b.Q + 1e-12) b = L;
        }
        return { lab: b.lab, Q: b.Q, all };
      }
      const kNon = lab => { const c = new Map(); lab.forEach(x => c.set(x, (c.get(x) || 0) + 1)); return [...c.values()].filter(v => v > 1).length; };
      function run() {
        if (stopper) stopper();
        cells = TS.map(() => GS.map(() => null)); baseLab = null;
        const jobs = [[0, 1], ...TS.flatMap((_, i) => GS.map((_, j) => [i, j])).filter(([i, j]) => !(i === 0 && j === 1))];
        draw();
        stopper = chunked(jobs.length, 1, k => {
          const [i, j] = jobs[k], B = best(TS[i], GS[j]);
          if (!baseLab) baseLab = B.lab;
          const nm = B.all.map(l => nmi(baseLab, l)), ms = meanSd(nm);
          cells[i][j] = { lab: B.lab, Q: B.Q, k: kNon(B.lab), nmi: nmi(baseLab, B.lab), mean: ms.mean, sd: ms.sd, iso: n - new Set(edgesAt(TS[i]).flatMap(e => [e.a, e.b])).size };
        }, k => { prog.textContent = k < jobs.length ? `${k} / ${jobs.length} cella…` : ""; draw(); }, () => {
          stopper = null; prog.textContent = ""; draw();
          root.dataset.result = JSON.stringify(cells.map(r => r.map(c => [c.k, +c.nmi.toFixed(3)])));
        });
      }
      function draw() {
        const cell = (i, j) => {
          const c = cells[i][j], on = sel[0] === i && sel[1] === j;
          if (!c) return `<td style="padding:.3em .5em;min-width:4.6em;text-align:center;color:var(--muted)">…</td>`;
          const bg = mixColor("--card", "--setA", 0.08 + 0.62 * c.nmi);
          return `<td data-c="${i},${j}" style="cursor:pointer;padding:.3em .5em;min-width:4.6em;text-align:center;background:${bg};${on ? "outline:3px solid var(--accent);outline-offset:-3px" : ""}">` +
            `<b>${c.k}</b> közösség<br><span style="font-family:var(--mono)">${fmt(c.nmi, 2)}</span><br><span class="muted" style="font-size:.78rem">átl. ${fmt(c.mean, 2)} ± ${fmt(c.sd, 2)}</span></td>`;
        };
        const done = cells.every(r => r.every(Boolean));
        const rowM = i => (cells[i].every(Boolean) ? fmt(meanSd(cells[i].map(c => c.nmi)).mean, 2) : "…");
        const colM = j => (cells.every(r => r[j]) ? fmt(meanSd(cells.map(r => r[j].nmi)).mean, 2) : "…");
        tw.innerHTML = `<table style="width:auto;margin:0;font-size:.86rem"><thead><tr><th style="padding:.3em">$t$ \\ $\\gamma$</th>${GS.map(g => `<th style="padding:.3em">${fmt(g, 1)}</th>`).join("")}<th class="muted" style="padding:.3em">átlag NMI</th></tr></thead><tbody>` +
          TS.map((t, i) => `<tr><th style="padding:.3em">$w \\ge ${t}$</th>${GS.map((_, j) => cell(i, j)).join("")}<td class="muted" style="text-align:center;font-family:var(--mono)">${rowM(i)}</td></tr>`).join("") +
          `<tr><th class="muted" style="padding:.3em">átlag</th>${GS.map((_, j) => `<td class="muted" style="text-align:center;font-family:var(--mono)">${colM(j)}</td>`).join("")}<td></td></tr></tbody></table>` +
          `<p class="muted" style="font-size:.82rem;margin:.3rem 0">Cellánként: a (nem egyelemű) közösségek száma, a legjobb futás NMI-je az alapesettel, alatta az 5 futás átlaga ± szórása. Minél sötétebb, annál hasonlóbb.</p>`;
        math(tw);
        tw.querySelectorAll("td[data-c]").forEach(td => td.addEventListener("click", () => { sel = td.dataset.c.split(",").map(Number); draw(); }));
        const c = cells[sel[0]][sel[1]];
        if (!c) { info.textContent = "számolás…"; return; }
        /* közösségek nagyság szerint sorszámozva, a magányos csúcsok halványak */
        const cnt = new Map(); c.lab.forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
        const order = [...cnt.keys()].filter(x => cnt.get(x) > 1).sort((a, b) => cnt.get(b) - cnt.get(a) || a - b), rk = new Map(order.map((x, i) => [x, i]));
        const faded = mixColor("--card", "--muted", 0.3), t = TS[sel[0]];
        view.setGraph(G.nodes.map((nd, i) => Object.assign({}, nd, { color: rk.has(c.lab[i]) ? commColor(rk.get(c.lab[i])) : faded })),
          G.edges.map(e => (e.w >= t ? { ...e, color: "--muted", width: 0.6 + 2.2 * Math.sqrt(e.w / 31) } : { ...e, color: "--border", width: 0.5, alpha: 0.35 })));
        const str = new Array(n).fill(0); edgesAt(t).forEach(e => { str[e.a] += e.w; str[e.b] += e.w; });
        const top = order.slice(0, 4).map((x, i) => {
          const mem = [...Array(n).keys()].filter(v => c.lab[v] === x).sort((a, b) => str[b] - str[a]);
          return `${sw(commColor(i))}${cnt.get(x)} fő: ${mem.slice(0, 3).map(v => G.nodes[v].name).join(", ")}${mem.length > 3 ? ", …" : ""}`;
        });
        info.innerHTML = `$w \\ge ${t}$, $\\gamma = ${fmM(GS[sel[1]], 1)}$: ${edgesAt(t).length} él, ${c.iso} csúcs elszigetelődik (halvány) · <b>${c.k}</b> közösség · $Q = ${fmM(c.Q, 3)}$ · NMI = <b>${fmt(c.nmi, 3)}</b><br>` +
          top.join("<br>") + (order.length > 4 ? `<br>… és még ${order.length - 4} közösség` : "") + (done ? "" : "<br><span class=\"muted\">(számolás folyamatban…)</span>");
        math(info);
      }
      onTheme(draw);
      run();
    };

    /* ------------------------------------------------------------------
       10.7  ergm-toy – ERGM kis gráfokon, teljes felsorolással
       ------------------------------------------------------------------ */
    W["ergm-toy"] = root => {
      header(root, "ERGM kicsiben: minden gráf valószínűsége",
        "$P(G) \\propto \\exp(\\theta_{\\text{él}} \\cdot \\text{élszám} + \\theta_\\Delta \\cdot \\text{háromszögszám})$. Kis csúcsszámon az összes gráfot fel tudjuk sorolni " +
        "(4 csúcson 64, 5-ön 1024, 6-on 32 768), így minden pontosan kiszámolható – nincs szükség szimulációra.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let n = 4, te = -1, tt = 0, ts = 0, adv = false;
      const ENUM = {}, CLS = {};
      const getE = k => ENUM[k] || (ENUM[k] = ergmEnum(k));

      const c1 = h("div", { class: "controls" });
      const paintN = toggleGroup(c1, [[4, "4 csúcs"], [5, "5 csúcs"], [6, "6 csúcs"]], n, v => { n = v; update(); });
      const advB = btn("haladó: 2-csillag", () => { adv = !adv; advB.classList.toggle("on", adv); if (!adv) { ts = 0; sSl.value = 0; sOut.textContent = fmt(0, 2); } sLab.style.display = adv ? "" : "none"; update(); });
      c1.append(advB);
      const c2 = h("div", { class: "controls" });
      const eOut = mono(fmt(te, 2)), tOut = mono(fmt(tt, 2)), sOut = mono("0");
      const eSl = range(-3, 3, 0.05, te, "élparaméter", () => { te = +eSl.value; update(); });
      const tSl = range(-2, 3, 0.05, tt, "háromszög-paraméter", () => { tt = +tSl.value; update(); });
      const sSl = range(-1, 1, 0.05, 0, "2-csillag-paraméter", () => { ts = +sSl.value; update(); });
      const sLab = h("label", { style: "display:none" }, "$\\theta_{2\\text{cs}}$", sSl, sOut);
      c2.append(h("label", null, "$\\theta_{\\text{él}}$", eSl, eOut), h("label", null, "$\\theta_\\Delta$", tSl, tOut), sLab);
      math(c2);
      const c3 = h("div", { class: "controls" });
      c3.append(h("span", { class: "muted", style: "font-size:.85rem" }, "Kipróbálnád?"),
        ...[[[-1, 0], "(−1; 0)"], [[0, 0], "(0; 0)"], [[-1, 2], "(−1; 2)"], [[-1, 0.5], "(−1; 0,5)"], [[-1, 1], "(−1; 1)"], [[-1.5, 1.2], "(−1,5; 1,2)"]]
          .map(([th, l]) => btn(l, () => setTheta(th[0], th[1]))));
      root.append(c1, c2, c3);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const distBox = h("div"), topBox = h("div");
      grid.append(distBox, topBox); root.append(grid);
      const info = h("div", { class: "readout" });
      const chBox = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.4rem" });
      root.append(info, chBox);
      /* illesztés */
      const fitWrap = h("div", { style: "margin-top:.9rem;border-top:1px solid var(--border);padding-top:.6rem" });
      fitWrap.append(h("div", { style: "font-weight:700;margin-bottom:.2rem" }, "Illesztés: melyik θ adja vissza a megfigyelt gráfot?"),
        h("p", { class: "muted", style: "font-size:.88rem;margin:0 0 .3rem", html: "A maximum-likelihood becslésnél a <b>várható</b> élszám és háromszögszám egyenlő a <b>megfigyelttel</b>. " +
          "Válassz egy 4 csúcsú gráfot, vagy kattints a csúcspárokra (a szaggatott vonalakra) az élek ki-be kapcsolásához." }));
      const f1 = h("div", { class: "controls" }), f2 = h("div", { class: "controls" });
      const OBS = { paw: [[0, 1], [0, 2], [1, 2], [2, 3]], triIso: [[0, 1], [0, 2], [1, 2]], path: [[0, 1], [1, 2], [2, 3]], star: [[0, 1], [0, 2], [0, 3]] };
      let obs = new Set(OBS.paw.map(([a, b]) => a + "-" + b)), fitModel = "et";
      const paintObs = toggleGroup(f1, [["paw", "háromszög + függő él"], ["triIso", "háromszög + magányos csúcs"], ["path", "3 élű út"], ["star", "csillag"]], "paw",
        v => { obs = new Set(OBS[v].map(([a, b]) => a + "-" + b)); fit(); });
      toggleGroup(f2, [["e", "csak élparaméter"], ["et", "él + háromszög"]], fitModel, v => { fitModel = v; fit(); });
      const fitGrid = h("div", { class: "two-col", style: "align-items:center" });
      const obsBox = h("div", { style: "max-width:220px" }), fitOut = h("div", { class: "readout", style: "margin-top:0" });
      fitGrid.append(obsBox, fitOut);
      const applyB = btn("Beállítás a csúszkákra (4 csúcs)", () => { if (lastFit) { n = 4; paintN(4); setTheta(lastFit[0], lastFit[1]); } });
      const f3 = h("div", { class: "controls" }); f3.append(applyB);
      fitWrap.append(f1, f2, fitGrid, f3);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Az ERGM-ben a paraméter azt mondja meg, mennyivel valószínűbb egy él, ha háromszöget zár – de a háromszög-tag könnyen „elszabadul”: ezért használnak a gyakorlatban szelídebb tagokat (GWESP).");
      root.append(fitWrap, lesson);
      let lastFit = null;

      function setTheta(a, b) {
        te = a; tt = b; eSl.value = a; tSl.value = b; update();
      }
      /* izomorfiaosztályok: minden gráfra a kanonikus (legkisebb) kód az összes csúcspermutáció közül; 6 csúcson darabolva */
      function classes(k, done) {
        if (CLS[k] && CLS[k].ready) return CLS[k];
        if (CLS[k]) return null;
        const E = getE(k), m = E.pairs.length, pid = zeros(k); E.pairs.forEach(([i, j], q) => (pid[i][j] = pid[j][i] = q));
        const maps = []; forEachPerm(k, p => maps.push(E.pairs.map(([i, j]) => 1 << pid[p[i]][p[j]])));
        const canon = new Int32Array(E.count), st = CLS[k] = { ready: false };
        const job = g => {
          let best = g;
          for (const mp of maps) { let c = 0; for (let q = 0; q < m; q++) if (g >> q & 1) c |= mp[q]; if (c < best) best = c; }
          canon[g] = best;
        };
        const fin = () => {
          const M = new Map();
          for (let g = 0; g < E.count; g++) { const c = canon[g]; if (!M.has(c)) M.set(c, { rep: c, size: 0 }); M.get(c).size++; }
          st.list = [...M.values()]; st.ready = true; done();
        };
        if (E.count <= 1024) { for (let g = 0; g < E.count; g++) job(g); fin(); return st; }
        chunked(E.count, 1024, job, i => (topBox.innerHTML = `<p class="muted">izomorfiaosztályok számolása… ${Math.round(100 * i / E.count)}%</p>`), fin);
        return null;
      }
      const smallG = (k, g, Wd = 92) => {
        const P = [...Array(k).keys()].map(i => [Wd / 2 + Wd * 0.36 * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / k), Wd / 2 + Wd * 0.36 * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / k)]);
        const E = getE(k); let s = "";
        E.pairs.forEach(([i, j], q) => { if (g >> q & 1) s += `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}" stroke="${sv("--setA")}" stroke-width="2.2"/>`; });
        P.forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="5.5" fill="${sv("--card")}" stroke="${sv("--text")}" stroke-width="1.5"/>`));
        return svgEl(Wd, Wd, s, "gráf");
      };
      function update() {
        eOut.textContent = fmt(te, 2); tOut.textContent = fmt(tt, 2); sOut.textContent = fmt(ts, 2);
        const E = getE(n), p = ergmDist(E, [te, tt, ts]), m = E.pairs.length;
        const pe = new Array(m + 1).fill(0); let Ee = 0, Et = 0;
        for (let g = 0; g < E.count; g++) { pe[E.edges[g]] += p[g]; Ee += p[g] * E.edges[g]; Et += p[g] * E.tri[g]; }
        /* (a) élszám-eloszlás */
        const L = 34, Rm = 6, Tp = 16, B = 30, Wd = 360, Ht = 200, mx = Math.max(...pe), ymax = Math.max(0.1, Math.ceil(mx * 10) / 10);
        const bw = (Wd - L - Rm) / (m + 1), Y = v => Tp + (1 - v / ymax) * (Ht - Tp - B);
        let g = "";
        for (let st = ymax <= 0.2 ? 0.05 : 0.1, j = 0; j <= Math.round(ymax / st); j++) { const v = j * st; g += `<line x1="${L}" y1="${Y(v)}" x2="${Wd - Rm}" y2="${Y(v)}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${L - 4}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(v, 2)}</text>`; }
        pe.forEach((v, k) => {
          const x = L + k * bw;
          g += `<rect x="${x + 1}" y="${Y(v)}" width="${bw - 2}" height="${Y(0) - Y(v)}" fill="${sv("--setA")}" rx="1.5"><title>${k} él: ${fmt(v, 3)}</title></rect>` +
            `<text x="${x + bw / 2}" y="${Ht - B + 13}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${k}</text>`;
          if (m <= 10 || v >= 0.08) g += `<text x="${x + bw / 2}" y="${Y(v) - 3}" text-anchor="middle" font-size="${m <= 6 ? 10 : 8.5}" fill="${sv("--text")}">${fmt(v, m <= 6 ? 3 : 2)}</text>`;
        });
        const ex = L + (Ee + 0.5) * bw;
        g += `<line x1="${ex}" y1="${Tp - 4}" x2="${ex}" y2="${Y(0)}" stroke="${sv("--setB")}" stroke-width="1.8" stroke-dasharray="4 3"/>` +
          `<text x="${Wd / 2}" y="${Ht - 4}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">élszám (szaggatott: a várható érték)</text>`;
        distBox.innerHTML = `<div style="font-weight:600;font-size:.9rem">Az élszám eloszlása (${n} csúcs)</div>` + svgEl(Wd, Ht, g, "az élszám eloszlása");
        /* kétpúpú-e? (két számottevő helyi maximum, köztük mély völgy) */
        const peaks = pe.map((v, k) => k).filter(k => pe[k] >= 0.03 && (k === 0 || pe[k] > pe[k - 1]) && (k === m || pe[k] >= pe[k + 1]));
        let bimodal = false;
        for (let a = 0; a < peaks.length; a++) for (let b = a + 1; b < peaks.length; b++) {
          const valley = Math.min(...pe.slice(peaks[a], peaks[b] + 1));
          if (valley < 0.5 * Math.min(pe[peaks[a]], pe[peaks[b]]) && peaks[b] - peaks[a] >= 3) bimodal = true;
        }
        const pFull = p[E.count - 1], pEmpty = p[0];
        let s = `várható élszám <b>${fmt(Ee, 2)}</b> (a ${m} lehetségesből) · várható háromszögszám <b>${fmt(Et, 3)}</b> · P(üres) = ${fmt(pEmpty, 3)} · P(teljes) = ${fmt(pFull, 3)}`;
        if (bimodal) s += `<br><b>Degeneráció:</b> az eloszlás kétpúpú – a modell vagy majdnem üres, vagy majdnem teljes gráfot ad, a megfigyelthez hasonló „közepes” gráf ritka.`;
        else if (pFull >= 0.15 && n >= 5) s += `<br><b>Elszabadulás:</b> a valószínűség a teljes gráf felé tolódik (P(${m} él) = ${fmt(pFull, 3)}) – egy kis paraméterváltozás is nagyot mozdít a várható élszámon.`;
        info.innerHTML = s;
        root.dataset.result = JSON.stringify({ n, th: [te, tt, ts], Ee: +Ee.toFixed(3), Et: +Et.toFixed(3), pe: pe.map(v => +v.toFixed(3)), pFull: +pFull.toFixed(3), pEmpty: +pEmpty.toFixed(3), bimodal });
        /* (c) a 4 legvalószínűbb izomorfiaosztály */
        const C = classes(n, () => update());
        if (C) {
          const top = C.list.map(c => ({ ...c, P: c.size * p[c.rep] })).sort((a, b) => b.P - a.P).slice(0, 4);
          topBox.innerHTML = `<div style="font-weight:600;font-size:.9rem">A 4 legvalószínűbb gráf (izomorfiaosztályonként, ${C.list.length} osztály)</div>` +
            `<div style="display:grid;grid-template-columns:repeat(${narrow ? 2 : 4},minmax(0,1fr));gap:.3rem;margin-top:.3rem">` +
            top.map(c => `<div style="text-align:center;font-size:.8rem">${smallG(n, c.rep)}<b>${fmt(c.P, 3)}</b><br><span class="muted">${E.edges[c.rep]} él, ${E.tri[c.rep]} △<br>${c.size} címkézés × ${fmt(p[c.rep], 4)}</span></div>`).join("") + `</div>`;
          root.dataset.top = JSON.stringify(top.map(c => [+c.P.toFixed(3), E.edges[c.rep], E.tri[c.rep], c.size]));
        }
        /* (d) változási statisztika */
        const rows = [];
        for (let c = 0; c <= n - 2; c++) { const z = te + tt * c; rows.push([c, fmt(z, 2), `<b>${fmt(1 / (1 + Math.exp(-z)), 3)}</b>`]); }
        chBox.innerHTML = `<p style="margin:.3rem 0 .1rem;font-size:.9rem"><b>Változási statisztika:</b> ha egy csúcspár közt $c$ közös szomszéd van, az él behúzása $1$ éllel és $c$ háromszöggel növeli a statisztikákat, ezért ` +
          `$P(\\text{él} \\mid \\text{a többi}) = 1/(1 + e^{-(\\theta_{\\text{él}} + \\theta_\\Delta c)})$` + (ts ? ` (a 2-csillag-tag ehhez még $\\theta_{2\\text{cs}}(k_i + k_j)$-t ad, itt nem szerepel)` : "") + `.</p>` +
          tbl(["közös szomszéd $c$", "$\\theta_{\\text{él}} + \\theta_\\Delta c$", "$P(\\text{él} \\mid \\text{a többi})$"], rows);
        math(chBox);
      }
      /* ---- illesztés 4 csúcson ---- */
      const E4 = getE(4);
      const obsMask = () => E4.pairs.reduce((s, [a, b], q) => s | (obs.has(a + "-" + b) ? 1 << q : 0), 0);
      function drawObs() {
        const S = 200, P = [[100, 22], [24, 176], [176, 176], [100, 118]];   // síkba rajzolva: a 4. csúcs középen, nincs élkereszteződés
        let s = "";
        E4.pairs.forEach(([a, b], q) => {
          const on = obs.has(a + "-" + b);
          s += `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${on ? sv("--setA") : sv("--border")}" stroke-width="${on ? 4 : 1.6}" ${on ? "" : 'stroke-dasharray="5 4"'}/>` +
            `<line data-p="${a}-${b}" x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="transparent" stroke-width="18" style="cursor:pointer"/>`;
        });
        P.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="14" fill="${sv("--card")}" stroke="${sv("--text")}" stroke-width="2"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="600" fill="${sv("--text")}">${i + 1}</text>`));
        obsBox.innerHTML = svgEl(S, S, s, "a megfigyelt gráf (kattintással szerkeszthető)");
        obsBox.querySelectorAll("line[data-p]").forEach(l => l.addEventListener("click", () => { const k = l.dataset.p; obs.has(k) ? obs.delete(k) : obs.add(k); paintObs(null); fit(); }));
      }
      /* a (él, háromszög) statisztika-pontok konvex burka – ha a megfigyelt pont a burok határán van, nincs véges MLE */
      function hull(pts) {
        const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        const lo = [], up = [];
        for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
        for (const p of P.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
        return lo.slice(0, -1).concat(up.slice(0, -1));          // az óramutatóval ellentétes körüljárás
      }
      function fit() {
        drawObs();
        const g = obsMask(), me = E4.edges[g], mt = E4.tri[g];
        let s = `megfigyelt: <b>${me}</b> él, <b>${mt}</b> háromszög<br>`;
        const moments = th => { const p = ergmDist(E4, [th[0], th[1]]); let e = 0, t = 0, ee = 0, et = 0, tt2 = 0; for (let k = 0; k < E4.count; k++) { const a = E4.edges[k], b = E4.tri[k]; e += p[k] * a; t += p[k] * b; ee += p[k] * a * a; et += p[k] * a * b; tt2 += p[k] * b * b; } return { e, t, vee: ee - e * e, vet: et - e * t, vtt: tt2 - t * t }; };
        lastFit = null;
        let res = { obs: [me, mt], model: fitModel };
        if (fitModel === "e") {
          if (me === 0 || me === 6) { s += `A becslés <b>nem létezik</b>: ${me === 0 ? "üres gráfra $\\theta_{\\text{él}} \\to -\\infty$" : "teljes gráfra $\\theta_{\\text{él}} \\to +\\infty$"}.`; res.none = true; }
          else {
            const th = Math.log(me / (6 - me)), M = moments([th, 0]); lastFit = [th, 0];
            s += `$\\hat\\theta_{\\text{él}} = \\ln\\frac{${me}}{${6 - me}} = ${fmM(th, 3)}$ → várható élszám ${fmt(M.e, 3)}, várható háromszögszám <b>${fmt(M.t, 3)}</b> (megfigyelt: ${mt}).` +
              (Math.abs(M.t - mt) > 0.05 ? ` A csak élparaméteres modell ${M.t > mt ? "több" : "kevesebb"} háromszöget vár, mint amennyi van.` : "");
            res.th = [+th.toFixed(4), 0]; res.Et = +M.t.toFixed(4);
          }
        } else {
          const pts = [], seen = new Set();
          for (let k = 0; k < E4.count; k++) { const key = E4.edges[k] + "," + E4.tri[k]; if (!seen.has(key)) { seen.add(key); pts.push([E4.edges[k], E4.tri[k]]); } }
          const H = hull(pts); let normal = null;
          for (let i = 0; i < H.length; i++) {
            const a = H[i], b = H[(i + 1) % H.length], dx = b[0] - a[0], dy = b[1] - a[1];
            const cr = dx * (mt - a[1]) - dy * (me - a[0]), dot = (me - a[0]) * dx + (mt - a[1]) * dy;
            if (Math.abs(cr) < 1e-9 && dot >= -1e-9 && dot <= dx * dx + dy * dy + 1e-9) {
              const nv = [dy, -dx], L = Math.hypot(...nv);                     // kifelé mutató normális (pozitív körüljárásnál)
              normal = normal ? [normal[0] + nv[0] / L, normal[1] + nv[1] / L] : [nv[0] / L, nv[1] / L];
            }
          }
          if (normal) {
            const dir = (v, name) => (Math.abs(v) < 1e-9 ? "" : `${name} a ${v > 0 ? "+∞" : "−∞"} felé`);
            const parts = [dir(normal[1], "a háromszög-paraméter"), dir(normal[0], "az élparaméter")].filter(Boolean);
            s += `A becslés <b>nem létezik</b> – ${parts.join(", ")} szalad. A megfigyelt (élszám, háromszögszám) pont a lehetséges pontok konvex burkának a szélén van: ` +
              (mt === 0 && me > 0 && me < 6 ? `${me} élhez 0-nál kevesebb háromszög nem lehet, ezért a likelihood mindig nő, ha $\\theta_\\Delta$-t tovább csökkented.` : "a likelihood ebben az irányban a végtelenségig nő.");
            res.none = true; res.dir = normal.map(v => +v.toFixed(3));
          } else {
            let th = [0, 0];
            for (let it = 0; it < 100; it++) {
              const M = moments(th), gE = me - M.e, gT = mt - M.t, det = M.vee * M.vtt - M.vet * M.vet;
              if (Math.hypot(gE, gT) < 1e-11 || det <= 1e-14) break;
              let dE = (M.vtt * gE - M.vet * gT) / det, dT = (M.vee * gT - M.vet * gE) / det;
              const st = Math.max(1, Math.hypot(dE, dT) / 2); th = [th[0] + dE / st, th[1] + dT / st];
            }
            const M = moments(th); lastFit = th;
            s += `$\\hat\\theta = (${fmM(th[0], 3)};\\ ${fmM(th[1], 3)})$ → várható élszám ${fmt(M.e, 3)}, várható háromszögszám ${fmt(M.t, 3)} – pontosan a megfigyelt.` +
              `<br>${th[1] > 0 ? "Pozitív $\\theta_\\Delta$: a háromszöget záró él valószínűbb." : "Negatív $\\theta_\\Delta$: a modell kevesebb háromszöget „akar”, mint amennyit az élszám magától hozna."}`;
            res.th = th.map(v => +v.toFixed(4)); res.E = [+M.e.toFixed(4), +M.t.toFixed(4)];
          }
        }
        applyB.disabled = !lastFit;
        fitOut.innerHTML = s; math(fitOut);
        root.dataset.fit = JSON.stringify(res);
      }
      onTheme(() => { update(); drawObs(); });
      update(); fit();
    };
  }
