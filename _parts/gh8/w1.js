
  /* ==================================================================
     w1: 8.2, 8.3, 8.8 widgetjei (girvan-newman, modularity-painter, community-explorer)
     ================================================================== */
  {
    const MINUS = "−";
    const fq = (x, d = 3) => fmt(Math.abs(x) < 0.5 * 10 ** -d ? 0 : x, d).replace("-", MINUS);
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dot = c => `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.2em"></span>`;
    const SVGNS = "http://www.w3.org/2000/svg";
    const sEl = (tag, attrs, txt) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; return e; };

    /* gyűrűbe fűzött háromszögek (nc darab) elrendezéssel */
    function ringGraph(nc = 10, aspect = 0.6) {
      const E = ringOfCliques(nc, 3), P = [];
      for (let c = 0; c < nc; c++) {
        const th = 2 * Math.PI * c / nc - Math.PI / 2, d = Math.PI / nc * 0.55;
        P.push([Math.cos(th - d), Math.sin(th - d)], [0.72 * Math.cos(th), 0.72 * Math.sin(th)], [Math.cos(th + d), Math.sin(th + d)]);
      }
      const N = GK.normalize(P, aspect);
      return { name: "10 háromszög gyűrűben", nodes: N.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1] })), edges: E };
    }
    /* két négyzet egy híddal */
    function twoSquares(aspect) {
      const pos = [[0, 0], [1, 0], [1, 1], [0, 1], [2.2, 1], [3.2, 1], [3.2, 0], [2.2, 0]];
      const P = GK.normalize(pos, aspect), lab = ["1", "2", "3", "4", "5", "6", "7", "8"];
      const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [2, 4]].map(([a, b]) => ({ a, b, w: 1 }));
      return { name: "két négyzet + híd", nodes: P.map((p, i) => ({ label: lab[i], x: p[0], y: p[1] })), edges: E };
    }
    /* az összes felbontás (korlátozott növekedésű sorozatok), kis n-re */
    function allPartitions(n) {
      const out = [], a = new Array(n).fill(0);
      (function rec(i, mx) {
        if (i === n) { out.push(a.slice()); return; }
        for (let v = 0; v <= mx + 1; v++) { a[i] = v; rec(i + 1, Math.max(mx, v)); }
      })(1, 0);
      return n ? out : [[]];
    }
    /* a legjobb Louvain-eredmény több magból */
    function bestLouvain(n, E, { gamma = 1, weighted = false, runs = 20 } = {}) {
      let best = null;
      for (let s = 1; s <= runs; s++) {
        const r = louvain(n, E, { gamma, weighted, R: rng(s) });
        const Q = modularity(n, E, r.lab, { gamma, weighted }).Q;
        if (!best || Q > best.Q + 1e-12) best = { lab: relabel(r.lab), Q, seed: s };
      }
      return best;
    }
    /* felbontás szöveggé: {Ko, Vi} · {Po, La} */
    function partText(lab, names, tex = true) {
      const groups = new Map();
      lab.forEach((c, i) => { if (!groups.has(c)) groups.set(c, []); groups.get(c).push(names[i]); });
      return [...groups.values()].map(g => (tex ? "$\\{" + g.map(texLab).join(", ") + "\\}$" : "{" + g.join(", ") + "}")).join(" · ");
    }
    /* egyszerű vonaldiagram (SVG): pontok [{x, y}], kiemelt index */
    function lineChart(box, pts, { cur = -1, best = -1, xlab = "", ylab = "", w = 520, hgt = 170 } = {}) {
      box.innerHTML = "";
      if (!pts.length) return;
      const pad = { l: 44, r: 12, t: 24, b: 32 };
      const svg = sEl("svg", { viewBox: `0 0 ${w} ${hgt}`, style: "width:100%;max-width:" + w + "px;display:block" });
      const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
      const x0 = Math.min(...xs), x1 = Math.max(...xs) || 1, y0 = Math.min(0, ...ys), y1 = Math.max(...ys, 0.05);
      const X = x => pad.l + (x - x0) / (x1 - x0 || 1) * (w - pad.l - pad.r), Y = y => hgt - pad.b - (y - y0) / (y1 - y0 || 1) * (hgt - pad.t - pad.b);
      const muted = "var(--muted)", border = "var(--border)";
      svg.append(sEl("line", { x1: pad.l, x2: w - pad.r, y1: Y(0), y2: Y(0), stroke: border }));
      svg.append(sEl("line", { x1: pad.l, x2: pad.l, y1: pad.t, y2: hgt - pad.b, stroke: border }));
      [y0, 0, y1].filter((v, i, a) => a.indexOf(v) === i).forEach(v => svg.append(sEl("text", { x: pad.l - 5, y: Y(v) + 4, "text-anchor": "end", "font-size": 11, fill: muted }, fq(v, 2))));
      svg.append(sEl("text", { x: (pad.l + w - pad.r) / 2, y: hgt - 6, "text-anchor": "middle", "font-size": 11, fill: muted }, xlab));
      svg.append(sEl("text", { x: pad.l + 6, y: 12, "font-size": 11, fill: muted }, ylab));
      [x0, x1].forEach(v => svg.append(sEl("text", { x: X(v), y: hgt - pad.b + 13, "text-anchor": "middle", "font-size": 11, fill: muted }, String(v))));
      svg.append(sEl("polyline", { points: pts.map(p => X(p.x) + "," + Y(p.y)).join(" "), fill: "none", stroke: "var(--accent)", "stroke-width": 2 }));
      pts.forEach((p, i) => {
        const r = i === cur ? 5.5 : 3;
        svg.append(sEl("circle", { cx: X(p.x), cy: Y(p.y), r, fill: i === best ? "var(--setB)" : i === cur ? "var(--accent)" : "var(--card)", stroke: i === best ? "var(--setB)" : "var(--accent)", "stroke-width": 1.5 }));
      });
      if (best >= 0) svg.append(sEl("text", { x: X(pts[best].x), y: Y(pts[best].y) - 9, "text-anchor": "middle", "font-size": 11, fill: "var(--text)" }, "max " + fq(pts[best].y)));
      box.append(svg);
    }

    /* ------------------------------------------------------------------
       girvan-newman (8.2)
       ------------------------------------------------------------------ */
    W["girvan-newman"] = root => {
      header(root, "Girvan–Newman lépésről lépésre",
        "A szám az élen a köztessége; a kiemelt él (vastag) a legnagyobb – ezt törli a következő lépés, és utána mindent újraszámol. A csúcsok színe a komponensük. Alul: a modularitás (8.3) a törlések függvényében.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.75 : 0.5;
      const GRAPHS = [["twoTri", "két háromszög + híd"], ["sq", "két négyzet + híd"], ["arviz", "Árvízhét"], ["karate", "karateklub"]];
      const cG = h("div", { class: "controls" }); root.append(cG);
      let key = "arviz", G, steps, t = 0;
      toggleGroup(cG, GRAPHS, key, v => { key = v; load(); });
      const box = h("div"); root.append(box);
      const view = new GK.View(box, { aspect, radius: 14, showWeights: true, nodes: [], edges: [] });
      const cS = h("div", { class: "controls" }); root.append(cS);
      cS.append(btn("Következő törlés", () => go(t + 1), "btn primary"), btn("Vissza", () => go(t - 1)),
        btn("Ugrás a legjobb Q-hoz", () => go(bestIdx())), btn("Elejére", () => go(0)));
      const info = h("div", { class: "readout" }); root.append(info);
      const chart = h("div", { style: "margin-top:.4rem" }); root.append(chart);
      const bestIdx = () => steps.reduce((b, s, i) => (s.Q > steps[b].Q + 1e-12 ? i : b), 0);
      function load() {
        if (key === "sq") G = twoSquares(aspect);
        else if (key === "karate") G = preset("karate", aspect);
        else G = preset(key, aspect);
        G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        view.o.radius = key === "karate" ? (narrow ? 8 : 10) : 14;
        steps = girvanNewman(G.nodes.length, G.edges);
        go(0);
      }
      function go(k) {
        t = Math.max(0, Math.min(steps.length - 1, k));
        const n = G.nodes.length, removed = new Set(steps.slice(1, t + 1).map(s => s.removed));
        const next = steps[t + 1], eb = next ? next.eb : null, lab = steps[t].lab;
        const big = key === "karate";
        const topVals = eb ? eb.filter(x => x != null).sort((a, b) => b - a) : [];
        const thr = big ? topVals[Math.min(2, topVals.length - 1)] : -Infinity;
        const nodes = G.nodes.map((nd, i) => ({ label: nd.label, x: nd.x, y: nd.y, color: commColor(lab[i]) }));
        const edges = [];
        G.edges.forEach((e, i) => {
          if (removed.has(i)) { edges.push({ a: e.a, b: e.b, w: 1, dash: [4, 4], alpha: 0.35, label: "" }); return; }
          const isNext = next && next.removed === i, val = eb ? eb[i] : null;
          const show = val != null && (!big || val >= thr - 1e-9);
          edges.push({ a: e.a, b: e.b, w: 1, width: isNext ? 4.5 : 2, color: isNext ? "--accent" : null, label: show ? fmt(val, 1) : "" });
        });
        view.setGraph(nodes, edges);
        const Q = steps[t].Q, bi = bestIdx();
        const last = t > 0 ? G.edges[steps[t].removed] : null, nm = i => G.nodes[i].label;
        info.innerHTML = `<b>${t}. lépés</b> (${steps.length - 1} törlés lehet) · komponensek: <b>${steps[t].k}</b> · $Q = ${fq(Q).replace(",", "{,}")}$` +
          (last ? ` · utoljára törölt él: ${nm(last.a)}–${nm(last.b)} (köztessége törléskor ${fmt(steps[t].eb[steps[t].removed], 1)})` : "") +
          (next ? `<br>Következő: <b>${nm(G.edges[next.removed].a)}–${nm(G.edges[next.removed].b)}</b>, köztesség ${fmt(next.eb[next.removed], 1)}.` : "<br>Minden él törölve.") +
          (t === bi ? " <b>Ez a legjobb modularitású szint.</b>" : "") +
          (big ? " <span class='muted'>(A karateklubon csak a 3 legnagyobb köztesség látszik.)</span>" : "");
        math(info);
        lineChart(chart, steps.map((s, i) => ({ x: i, y: s.Q })), { cur: t, best: bi, xlab: "törölt élek száma", ylab: "Q" });
      }
      load();
    };

    /* ------------------------------------------------------------------
       modularity-painter (8.3)
       ------------------------------------------------------------------ */
    W["modularity-painter"] = root => {
      header(root, "Modularitás-festő: győzd le a Louvaint!",
        "Válassz színt (közösséget), aztán kattints a csúcsokra. A $Q$ minden kattintásra frissül, közösségenként is. Kis gráfon azt is látod, hányadik vagy az összes lehetséges felbontás közül.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.78 : 0.5;
      const GRAPHS = [["twoTri", "két háromszög + híd"], ["arviz", "Árvízhét"], ["karate", "karateklub"], ["ring", "10 háromszög gyűrűben"]];
      const cG = h("div", { class: "controls" }); root.append(cG);
      let key = "arviz", G, lab, paint = 0, weighted = false, gamma = 1, all = null, record = -Infinity, best = null;
      toggleGroup(cG, GRAPHS, key, v => { key = v; load(); });
      const cW = h("div", { class: "controls" }); root.append(cW);
      const wBtn = btn("súlyozva: ki", () => { weighted = !weighted; wBtn.textContent = "súlyozva: " + (weighted ? "be" : "ki"); wBtn.classList.toggle("on", weighted); prepRank(); best = null; update(); });
      const gIn = h("input", { type: "range", min: "0.2", max: "3", step: "0.1", value: "1", style: "width:9rem" });
      const gOut = h("span", { style: "font-family:var(--mono);min-width:2.5rem;display:inline-block" }, "1");
      gIn.addEventListener("input", () => { gamma = +gIn.value; gOut.textContent = fmt(gamma, 1); prepRank(); best = null; update(); });
      cW.append(wBtn, h("label", { style: "display:inline-flex;align-items:center;gap:.4rem" }, "γ =", gIn, gOut));
      const cP = h("div", { class: "controls" }); root.append(cP);
      const swatches = [];
      for (let c = 0; c < 6; c++) {
        const b = h("button", { class: "btn", type: "button", title: (c + 1) + ". közösség", html: dot(commColor(c)) + (c + 1) });
        b.addEventListener("click", () => { paint = c; swatches.forEach((s, j) => s.classList.toggle("on", j === paint)); });
        swatches.push(b); cP.append(b);
      }
      swatches[0].classList.add("on");
      const cA = h("div", { class: "controls" }); root.append(cA);
      const presetBox = h("span", { style: "display:contents" });
      cA.append(btn("Mindenki egy", () => setLab(G.nodes.map(() => 0))), btn("Mindenki külön", () => setLab(G.nodes.map((_, i) => i))),
        btn("Louvain megoldása", () => { ensureBest(); setLab(best.lab.slice(), "Louvain"); }, "btn primary"), presetBox);
      const box = h("div"); root.append(box);
      const view = new GK.View(box, { aspect, radius: 15, nodes: [], edges: [], onNodeClick: i => { lab[i] = paint; update(); } });
      const info = h("div", { class: "readout" }); root.append(info);
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" }); root.append(tbl);
      function ensureBest() { if (!best) best = bestLouvain(G.nodes.length, G.edges, { gamma, weighted, runs: key === "karate" ? 30 : 15 }); }
      function prepRank() {
        all = null;
        if (G.nodes.length > 8) return;
        const n = G.nodes.length;
        all = allPartitions(n).map(p => modularity(n, G.edges, p, { gamma, weighted }).Q).sort((a, b) => b - a);
      }
      function setLab(l, src) { lab = l.slice(); update(src); }
      function load() {
        if (key === "ring") G = ringGraph(10, aspect);
        else G = preset(key, aspect);
        if (!G.weighted) G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        weighted = false; wBtn.textContent = "súlyozva: ki"; wBtn.classList.remove("on"); wBtn.disabled = key !== "arviz";
        gamma = 1; gIn.value = "1"; gOut.textContent = "1";
        view.o.radius = key === "karate" || key === "ring" ? (narrow ? 9 : 11) : 15;
        view.o.showWeights = key === "arviz";
        record = -Infinity; best = null;
        presetBox.innerHTML = "";
        const ids = G.nodes.map(nd => nd.label);
        if (key === "arviz") {
          const L = groups => ids.map(id => groups.findIndex(g => g.includes(id)));
          presetBox.append(btn("Keretek", () => setLab(L([["Ko", "Vi"], ["Po", "La", "Ön"], ["Sz", "Kl"]]))), btn("Két szál", () => setLab(L([["Ko", "Vi", "Sz", "Kl"], ["Po", "La", "Ön"]]))));
        } else if (key === "karate") presetBox.append(btn("Valódi kettéválás", () => setLab(G.club.slice())));
        else if (key === "ring") presetBox.append(btn("Háromszögek", () => setLab(G.nodes.map((_, i) => Math.floor(i / 3)))), btn("Párok", () => setLab(G.nodes.map((_, i) => Math.floor(i / 6)))));
        else presetBox.append(btn("Két háromszög", () => setLab([0, 0, 0, 1, 1, 1])));
        prepRank();
        lab = G.nodes.map(() => 0);
        update();
      }
      function update(src) {
        const n = G.nodes.length;
        view.setGraph(G.nodes.map((nd, i) => ({ label: nd.label, x: nd.x, y: nd.y, color: commColor(lab[i]) })),
          G.edges.map(e => ({ ...e, width: lab[e.a] === lab[e.b] ? null : 1.2, dash: lab[e.a] === lab[e.b] ? null : [4, 3] })));
        const M = modularity(n, G.edges, lab, { gamma, weighted }), Q = M.Q;
        record = Math.max(record, Q);
        let rank = "";
        if (all) { const r = 1 + all.filter(x => x > Q + 1e-9).length; rank = ` · helyezés: <b>${r}.</b> a ${all.length} felbontásból (a legjobb: ${fq(all[0])})`; }
        let duel = "";
        if (n > 8 || src === "Louvain") {
          ensureBest();
          duel = Q >= best.Q - 1e-9 ? ` · 🏆 <b>Legalább olyan jó, mint a Louvain</b> (${fq(best.Q)})` : ` · Louvain: ${fq(best.Q)}`;
        }
        const qName = (weighted ? "Q^w" : "Q") + (gamma !== 1 ? "_\\gamma" : "");
        info.innerHTML = `$${qName} = ${fq(Q).replace(",", "{,}")}$ · közösségek: ${nComm(lab)} · a te rekordod: ${fq(record)}${rank}${duel}` +
          (gamma !== 1 ? `<br><span class="muted">$\\gamma = ${fmt(gamma, 1).replace(",", "{,}")}$: a véletlen szint $\\gamma$-szorosát vonjuk le.</span>` : "");
        const m = M.m, two = weighted ? "2W" : "2m", one = weighted ? "W" : "m";
        const rows = M.parts.slice().sort((a, b) => a.c - b.c).map(p => `<tr><td>${dot(commColor(p.c))}${p.c + 1}.</td><td>${p.nodes.length <= 8 ? p.nodes.map(i => G.nodes[i].label).join(", ") : p.nodes.length + " csúcs"}</td>` +
          `<td>${fmt(p.Lc, 0)}</td><td>${fmt(p.dc, 0)}</td><td>${fq(p.inTerm)}</td><td>${fq(p.expTerm)}</td><td><b>${fq(p.term)}</b></td></tr>`).join("");
        tbl.innerHTML = `<table><tr><th>közösség</th><th>tagok</th><th>${weighted ? "$W_c$" : "$L_c$"}</th><th>${weighted ? "$s_c$" : "$d_c$"}</th><th>$${weighted ? "W_c/W" : "L_c/m"}$</th><th>$${gamma !== 1 ? "\\gamma" : ""}(${weighted ? "s_c" : "d_c"}/${two})^2$</th><th>hozzájárulás</th></tr>${rows}` +
          `<tr><td colspan="6" style="text-align:right">összesen ($${one} = ${fmt(m, 0)}$)</td><td><b>${fq(Q)}</b></td></tr></table>`;
        math(info); math(tbl);
      }
      load();
    };

    /* ------------------------------------------------------------------
       community-explorer (8.8)
       ------------------------------------------------------------------ */
    W["community-explorer"] = root => {
      header(root, "Közösségkereső-összevető",
        "Válassz hálózatot és módszert. A szín a talált közösség; a karateklubnál a valódi kettéváláshoz is mérünk (NMI, ARI). Kattints egy csúcsra a nevéért és a közösségéért.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.55;
      const DATA = [["karate", "karateklub"], ["lesmis", "Les Misérables"], ["arviz", "Árvízhét"]];
      const METH = [["louvain", "Louvain"], ["gn", "Girvan–Newman (legjobb Q)"], ["lpa", "címketerjesztés"], ["spec", "spektrális (modularitásmátrix)"], ["real", "valódi kettéválás"]];
      const cD = h("div", { class: "controls" }), cM = h("div", { class: "controls" }), cX = h("div", { class: "controls" });
      root.append(cD, cM, cX);
      let ds = "karate", meth = "louvain", gamma = 1, seed = 1, weighted = true, G, lab, picked = -1, gnCache = {};
      toggleGroup(cD, DATA, ds, v => { ds = v; load(); });
      const methBtns = {};
      METH.forEach(([v, l]) => { methBtns[v] = btn(l, () => { meth = v; paintM(); run(); }); cM.append(methBtns[v]); });
      const paintM = () => Object.entries(methBtns).forEach(([v, b]) => { b.classList.toggle("on", v === meth); b.disabled = v === "real" && ds !== "karate"; });
      const gIn = h("input", { type: "range", min: "0.2", max: "3", step: "0.1", value: "1", style: "width:8rem" });
      const gOut = h("span", { style: "font-family:var(--mono);min-width:2.5rem;display:inline-block" }, "1");
      gIn.addEventListener("input", () => { gamma = +gIn.value; gOut.textContent = fmt(gamma, 1); if (meth === "louvain") run(); });
      const wBtn = btn("súlyozva: be", () => { weighted = !weighted; wBtn.textContent = "súlyozva: " + (weighted ? "be" : "ki"); wBtn.classList.toggle("on", weighted); gnCache = {}; run(); });
      wBtn.classList.add("on");
      cX.append(h("label", { style: "display:inline-flex;align-items:center;gap:.4rem" }, "γ (Louvain) =", gIn, gOut), btn("Új mag", () => { seed++; run(); }), wBtn);
      const box = h("div"); root.append(box);
      const view = new GK.View(box, { aspect, radius: 9, nodes: [], edges: [], onNodeClick: i => { picked = picked === i ? -1 : i; draw(); } });
      const info = h("div", { class: "readout" }); root.append(info);
      const list = h("div", { style: "font-size:.9rem;margin-top:.3rem;overflow-wrap:anywhere" }); root.append(list);
      function load() {
        picked = -1; gnCache = {};
        if (ds === "lesmis") G = lesmisGraph(aspect);
        else G = preset(ds, aspect);
        if (ds === "karate") G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        G.names = ds === "lesmis" ? window.LESMIS.names : ds === "arviz" ? G.nodes.map(nd => actorName(nd.label)) : G.nodes.map(nd => nd.label + ". tag");
        view.o.radius = ds === "lesmis" ? (narrow ? 5 : 6) : ds === "karate" ? (narrow ? 8 : 10) : 15;
        view.o.showWeights = ds === "arviz";
        wBtn.style.display = ds === "karate" ? "none" : "";
        if (meth === "real" && ds !== "karate") meth = "louvain";
        paintM(); run();
      }
      function run() {
        const n = G.nodes.length, wt = weighted && ds !== "karate";
        if (meth === "louvain") lab = relabel(louvain(n, G.edges, { gamma, weighted: wt, R: rng(seed) }).lab);
        else if (meth === "lpa") lab = labelProp(n, G.edges, { R: rng(seed), weighted: wt }).lab;
        else if (meth === "spec") lab = spectralSplit(n, G.edges, "modmat").lab;
        else if (meth === "real") lab = G.club.slice();
        else {
          if (!gnCache.lab) { const st = girvanNewman(n, G.edges); const b = st.reduce((x, y) => (y.Q > x.Q + 1e-12 ? y : x)); gnCache.lab = b.lab; }
          lab = gnCache.lab;
        }
        /* a színek sorrendje: a legnagyobb közösség az 1. */
        const sz = new Map(); lab.forEach(c => sz.set(c, (sz.get(c) || 0) + 1));
        const ord = [...sz.keys()].sort((a, b) => sz.get(b) - sz.get(a) || lab.indexOf(a) - lab.indexOf(b));
        lab = lab.map(c => ord.indexOf(c));
        draw();
      }
      function draw() {
        const n = G.nodes.length, wt = weighted && ds !== "karate";
        const deg = new Array(n).fill(0); G.edges.forEach(e => { deg[e.a]++; deg[e.b]++; });
        const top = ds === "lesmis" ? new Set([...Array(n).keys()].sort((a, b) => deg[b] - deg[a]).slice(0, narrow ? 5 : 8)) : null;
        view.setGraph(G.nodes.map((nd, i) => ({ label: ds === "lesmis" ? "" : nd.label, x: nd.x, y: nd.y, color: commColor(lab[i]),
          sub: ds === "lesmis" && (top.has(i) || i === picked) ? G.names[i] : null })),
          G.edges.map(e => ({ a: e.a, b: e.b, w: e.w, alpha: lab[e.a] === lab[e.b] ? 0.9 : 0.25, width: ds === "lesmis" ? 1 : null })));
        view.hl = picked >= 0 ? new Set([picked]) : new Set(); view.draw();
        const Q = modularity(n, G.edges, lab, { weighted: wt }).Q, k = nComm(lab);
        let s = `közösségek: <b>${k}</b> · $${wt ? "Q^w" : "Q"} = ${fq(Q).replace(",", "{,}")}$` + (meth === "louvain" && gamma !== 1 ? ` (a szokásos $\\gamma = 1$-es mércével; a Louvain $\\gamma = ${fmt(gamma, 1).replace(",", "{,}")}$-val futott)` : "");
        if (ds === "karate" && meth !== "real") {
          const bad = [...Array(n).keys()].filter(i => k === 2 && (lab[i] === lab[0]) !== (G.club[i] === G.club[0])).map(i => i + 1);
          s += ` · a valódi kettéváláshoz: NMI ${fq(nmi(G.club, lab), 2)}, ARI ${fq(ari(G.club, lab), 2)}` + (k === 2 ? ` · „rossz” oldalon: ${bad.length ? bad.join(", ") : "senki"}` : "");
        }
        if (meth === "lpa" || meth === "louvain") s += ` · mag: ${seed}`;
        const bad = disconnectedComms(n, G.edges, lab);
        if (bad.length) s += ` · ⚠️ nem összefüggő közösség: ${bad.map(c => c + 1).join(", ")}.`;
        if (picked >= 0) s += `<br>Kiválasztva: <b>${G.names[picked]}</b> – ${dot(commColor(lab[picked]))}${lab[picked] + 1}. közösség, fokszám ${deg[picked]}.`;
        info.innerHTML = s; math(info);
        /* közösséglista */
        const groups = new Map(); lab.forEach((c, i) => { if (!groups.has(c)) groups.set(c, []); groups.get(c).push(i); });
        list.innerHTML = [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([c, mem]) => {
          const names = mem.sort((a, b) => deg[b] - deg[a]).map(i => G.names[i]);
          const shown = names.length > 9 ? names.slice(0, 9).join(", ") + ` … (+${names.length - 9})` : names.join(", ");
          return `<div>${dot(commColor(c))}<b>${c + 1}.</b> (${mem.length}): ${shown}</div>`;
        }).join("");
      }
      load();
    };
  }
