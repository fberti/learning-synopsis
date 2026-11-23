  /* ==================================================================
     w2: 11.4–11.6 widgetjei (spectral-embed, random-walk-corpus, link-pred-lab)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = (c, dash = false) => dash
      ? `<span style="display:inline-block;width:1.3em;height:0;border-top:2.5px dashed ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`
      : `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const svgEl = (Wd, Ht, inner, label, extra = "") =>
      `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;touch-action:manipulation" role="img" aria-label="${label}" ${extra}>${inner}</svg>`;
    const pct = (x, d = 0) => fmt(100 * x, d) + "%";
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
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
    const range = (min, max, step, value, label, oninput, width = "8rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:38vw`, oninput });
    const mono = txt => h("b", { style: "font-family:var(--mono);min-width:2.6em;display:inline-block" }, txt);
    const tbl = (head, rows) =>
      `<table style="width:auto;margin:.3rem 0;font-size:.86rem"><thead><tr>${head.map(x => `<th style="padding:.2em .45em">${x}</th>`).join("")}</tr></thead>` +
      `<tbody>${rows.map(r => `<tr${r.st ? ` style="${r.st}"` : ""}>${(r.c || r).map(x => `<td style="padding:.2em .45em;text-align:center">${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const CLUB_COL = ["--setA", "--setB"], CLUB_SYM = ["●", "▲"], CLUB_NAME = ["az edző klubja (1)", "az elnök klubja (34)"];
    const OK = "✓", NO = "✗";

    /* a fejezet kis gráfjai: { name, nodes, edges (w = 1), club? } – "five": öt barát (A–E) */
    const FIVE = { labels: ["A", "B", "C", "D", "E"], edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]], pos: [[0, 0], [1, 0.6], [0, 1.2], [2.1, 0.6], [3.2, 0.6]] };
    function graphOf(key, aspect) {
      const bin = E => E.map(e => ({ a: e.a, b: e.b, w: 1 }));
      if (key === "five") {
        const P = GK.normalize(FIVE.pos, aspect);
        return { name: "öt barát", nodes: FIVE.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges: FIVE.edges.map(([a, b]) => ({ a, b, w: 1 })) };
      }
      if (key === "arviz") { const g = preset("arviz", aspect); return { name: "Árvízhét (egész hét)", nodes: g.nodes, edges: bin(arvizGraph().edges) }; }
      if (key === "karate") { const g = preset("karate", aspect); return { name: "karateklub", nodes: g.nodes, club: g.club, edges: bin(g.edges) }; }
      if (key === "lesmis") { const g = lesmisGraph(aspect); return { name: "Les Misérables", nodes: g.nodes, edges: bin(g.edges) }; }
      const g = preset(key, aspect); return { name: g.name, nodes: g.nodes, edges: bin(g.edges) };
    }
    /* SVG-szórásdiagram: pts [{x, y, label, color, sym?}], edges [{a, b}], pairs [[i, j]] (szaggatott „jóslat”), hl: kiemelt index */
    function scatterSVG({ pts, edges = [], pairs = [], hl = -1, xLab = "", yLab = "", Wd = 380, Ht = 320, r = 6, fs = 11, aria = "beágyazás" }) {
      const pad = 26, xs = pts.map(p => p.x), ys = pts.map(p => p.y);
      const mx = Math.max(1e-9, ...xs.map(Math.abs)) * 1.12, my = Math.max(1e-9, ...ys.map(Math.abs)) * 1.12;
      const X = x => pad + (x + mx) / (2 * mx) * (Wd - 2 * pad), Y = y => Ht - pad - (y + my) / (2 * my) * (Ht - 2 * pad);
      let s = `<line x1="${X(0)}" y1="${pad - 8}" x2="${X(0)}" y2="${Ht - pad + 8}" style="stroke:var(--border);stroke-dasharray:3 3"/>` +
        `<line x1="${pad - 8}" y1="${Y(0)}" x2="${Wd - pad + 8}" y2="${Y(0)}" style="stroke:var(--border);stroke-dasharray:3 3"/>`;
      s += `<text x="${Wd - pad + 6}" y="${Math.min(Ht - 4, Y(0) + 15)}" text-anchor="end" style="fill:var(--muted);font-size:11px">${esc(xLab)} →</text>`;
      s += `<text x="${X(0) + 5}" y="${pad - 12}" style="fill:var(--muted);font-size:11px">↑ ${esc(yLab)}</text>`;
      edges.forEach(e => { s += `<line x1="${X(pts[e.a].x)}" y1="${Y(pts[e.a].y)}" x2="${X(pts[e.b].x)}" y2="${Y(pts[e.b].y)}" style="stroke:var(--muted);stroke-opacity:.35;stroke-width:1.2"/>`; });
      pairs.forEach(([i, j]) => { s += `<line x1="${X(pts[i].x)}" y1="${Y(pts[i].y)}" x2="${X(pts[j].x)}" y2="${Y(pts[j].y)}" style="stroke:var(--setC);stroke-width:2.2;stroke-dasharray:5 3"/>`; });
      /* az egybeeső (vagy nagyon közeli) pontok felirata egyben */
      const groups = new Map();
      pts.forEach((p, i) => {
        const k = Math.round(X(p.x) / 3) + "," + Math.round(Y(p.y) / 3);
        if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i);
      });
      pts.forEach((p, i) => {
        const on = i === hl, rr = on ? r + 2 : r;
        if (p.sym === "▲") s += `<path data-i="${i}" d="M${X(p.x)} ${Y(p.y) - rr * 1.15}L${X(p.x) + rr} ${Y(p.y) + rr * 0.75}L${X(p.x) - rr} ${Y(p.y) + rr * 0.75}Z" style="fill:${sv(p.color)};stroke:${on ? "var(--text)" : "var(--card)"};stroke-width:${on ? 2.5 : 1.2};cursor:pointer"/>`;
        else s += `<circle data-i="${i}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${rr}" style="fill:${sv(p.color)};stroke:${on ? "var(--text)" : "var(--card)"};stroke-width:${on ? 2.5 : 1.2};cursor:pointer"/>`;
      });
      groups.forEach(g => {
        const p = pts[g[0]], lab = g.map(i => pts[i].label).join(", ");
        const tw = 0.6 * fs * lab.length, left = X(p.x) + r + 3 + tw > Wd - 2;
        s += `<text x="${left ? X(p.x) - r - 3 : X(p.x) + r + 3}" y="${Y(p.y) - r + 1}" text-anchor="${left ? "end" : "start"}" style="fill:var(--text);font-size:${fs}px;font-weight:600;paint-order:stroke;stroke:var(--card);stroke-width:3px;pointer-events:none">${esc(lab)}</text>`;
      });
      return svgEl(Wd, Ht, s, aria);
    }
    /* két csúcs „ikrek”-e: ugyanazok a szomszédaik (egymást nem számítva) */
    const twins = (L, u, v) => { const a = L[u].filter(x => x !== v).sort((x, y) => x - y), b = L[v].filter(x => x !== u).sort((x, y) => x - y); return a.length === b.length && a.every((x, i) => x === b[i]); };

    /* ------------------------------------------------------------------
       11.4  spectral-embed – Laplace-sajátleképezés
       ------------------------------------------------------------------ */
    W["spectral-embed"] = root => {
      header(root, "Spektrális beágyazás: a Laplace-mátrix sajátvektorai mint koordináták",
        "Az $L = D - A$ Laplace-mátrix 2. sajátvektora adja a csúcsok $x$, a 3. (vagy a 4.) az $y$ koordinátáját. " +
        "Ami a beágyazásban közel kerül egymáshoz, de még nem szomszédos, az a jóslat: közöttük valószínű az új él. " +
        "A kis gráfoknál két csúcsra egymás után kattintva az él be- vagy kikapcsol, élre kattintva törlődik – a beágyazás azonnal frissül.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let key = "path4", yAx = 3, showE = true, focus = -1, lastSel = -2, G, n, emb, pred = [];
      const ASP = { path4: 0.32, five: 0.45, arviz: 0.5, karate: 0.62 }, RAD = { path4: 15, five: 15, arviz: 14, karate: 8 };

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["path4", "4 csúcsú út"], ["five", "öt barát (A–E)"], ["arviz", "Árvízhét (egész hét)"], ["karate", "karateklub"]], key, v => { key = v; build(); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "y tengely:"));
      toggleGroup(c2, [[3, "3. sajátvektor"], [4, "4. sajátvektor"]], yAx, v => { yAx = v; render(); });
      const cbE = h("input", { type: "checkbox", checked: "" });
      cbE.addEventListener("change", () => { showE = cbE.checked; render(); });
      const bReset = btn("eredeti élek", () => build());
      c2.append(h("label", null, cbE, "a gráf élei a beágyazásban"), bReset);
      root.append(c1, c2);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), side = h("div");
      grid.append(box, side); root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" }), predBox = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A Laplace-sajátleképezés úgy rendez, hogy a szomszédok közel legyenek – a közös szomszédokkal rendelkező, „azonos helyzetű” csúcsok egymás mellé (vagy egymásra) kerülnek.");
      root.append(info, predBox, lesson);
      const view = new GK.View(box, { aspect: 0.32, radius: 15, editable: true, maxNodes: 4,
        onChange: v => { G.edges = v.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); focus = -1; recompute(); },
        onDraw: (ctx, v) => {
          if (!G || !emb) return;
          /* a jóslat (legközelebbi nem szomszédos párok) szaggatva a gráfon is */
          const r = v.o.radius;
          ctx.save(); ctx.strokeStyle = GK.css("--setC"); ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]); ctx.globalAlpha = 0.9;
          pred.slice(0, 5).forEach(o => {
            const [x1, y1] = v.px(v.nodes[o.i]), [x2, y2] = v.px(v.nodes[o.j]), d = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / d, uy = (y2 - y1) / d;
            if (d < 2 * r + 4) return;
            ctx.beginPath(); ctx.moveTo(x1 + ux * (r + 2), y1 + uy * (r + 2)); ctx.lineTo(x2 - ux * (r + 2), y2 - uy * (r + 2)); ctx.stroke();
          });
          ctx.restore();
          const s = v.o.editable ? v.sel : focus;
          if (s !== lastSel) { lastSel = s; drawScatter(); }
        } });
      box.append(legend);
      side.addEventListener("click", ev => {
        const t = ev.target.closest("[data-i]"); if (!t) return;
        const i = +t.dataset.i; focus = focus === i ? -1 : i;
        view.hl = new Set(focus >= 0 ? [focus] : []); lastSel = -2; view.draw(); render();
      });
      const lab = i => G.nodes[i].label;

      function build() {
        G = graphOf(key, ASP[key]); n = G.nodes.length; focus = -1; emb = null;
        const editable = key !== "karate";
        Object.assign(view.o, { aspect: ASP[key], radius: narrow ? Math.round(RAD[key] * 0.85) : RAD[key], editable, maxNodes: n,
          onNodeClick: editable ? null : i => { focus = focus === i ? -1 : i; view.hl = new Set(focus >= 0 ? [focus] : []); lastSel = -2; view.draw(); render(); } });
        view.hl = new Set();
        const nodes = G.nodes.map((nd, i) => (G.club ? Object.assign({}, nd, { color: CLUB_COL[G.club[i]] }) : nd));
        view.setGraph(nodes, G.edges); view.resize();
        bReset.style.display = editable ? "" : "none";
        recompute();
      }
      function recompute() {
        emb = laplacianEmbed(n, G.edges, Math.min(3, n - 1));
        render();
      }
      const coord = i => [emb.Z[i][0], emb.Z[i][yAx - 2] != null ? emb.Z[i][yAx - 2] : 0];
      function drawScatter() {
        const sel = view.o.editable ? view.sel : focus;
        const pts = G.nodes.map((nd, i) => { const [x, y] = coord(i); return { x, y, label: nd.label, color: G.club ? CLUB_COL[G.club[i]] : "--accent", sym: G.club ? CLUB_SYM[G.club[i]] : null }; });
        side.innerHTML = scatterSVG({ pts, edges: showE ? G.edges : [], pairs: pred.slice(0, 5).map(o => [o.i, o.j]), hl: sel,
          xLab: "2. sajátvektor", yLab: yAx + ". sajátvektor", r: key === "karate" ? 5 : 6.5, fs: key === "karate" ? 9.5 : 12, aria: "spektrális beágyazás" }) +
          `<p class="muted" style="font-size:.82rem;margin:.2rem 0 0">Kattints egy pontra: a gráfon is kiemelődik.</p>`;
      }
      function render() {
        const L = nbrs(n, G.edges), S = edgeSet(G.edges), vals = emb.vals;
        /* nem szomszédos párok távolság szerint */
        const cand = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (!S.has(i + "-" + j)) cand.push({ i, j, d: dist(coord(i), coord(j)) });
        cand.sort((a, b) => a.d - b.d || a.i - b.i || a.j - b.j);
        pred = cand;
        view.draw(); drawScatter();
        const eps = 1e-6;
        legend.innerHTML = (G.club ? `${sw(CLUB_COL[0])}${CLUB_NAME[0]} ${sw(CLUB_COL[1])}${CLUB_NAME[1]} (▲ a beágyazásban) · ` : "") +
          `${sw("--setC", true)}a beágyazásban legközelebbi 5 nem szomszédos pár (jóslat)`;
        const mu = [1, 2, 3].filter(k => k < n).map(k => `$\\mu_${k + 1} = ${fmM(Math.abs(vals[k]) < 1e-9 ? 0 : vals[k], 3)}$`).join(", ");
        let s = `Sajátértékek: $\\mu_1 = 0$, ${mu}.`;
        const comps = components(n, G.edges).sizes.length;
        if (vals[1] < eps) s += `<br>⚠ A gráf nem összefüggő (${comps} komponens): $\\mu_2 = 0$. Ilyenkor a „sajátvektorok” a komponenseket választják szét, a komponensen belüli szerkezetet nem mutatják.`;
        const used = [1, yAx - 1].filter(k => k < n);
        const mult = used.filter(k => vals[k] > eps && ((k > 1 && Math.abs(vals[k] - vals[k - 1]) < eps) || (k + 1 < n && Math.abs(vals[k] - vals[k + 1]) < eps)));
        if (mult.length) s += `<br>⚠ Többszörös sajátérték (${[...new Set(mult)].map(k => `$\\mu_${k + 1}$`).join(", ")}): a tengelyek ilyenkor nem egyértelműek – a sajátaltéren belül bármely elforgatás ugyanolyan jó.`;
        /* egybeeső csúcsok */
        const same = cand.filter(o => o.d < eps), sameAdj = [];
        for (const e of G.edges) if (dist(coord(e.a), coord(e.b)) < eps) sameAdj.push({ i: Math.min(e.a, e.b), j: Math.max(e.a, e.b) });
        /* egybeeső csoportok (unió–holmi), egy sor csoportonként */
        const par = [...Array(n).keys()], fd = x => (par[x] === x ? x : (par[x] = fd(par[x])));
        [...same, ...sameAdj].forEach(o => { par[fd(o.j)] = fd(o.i); });
        const grp = new Map();
        for (let i = 0; i < n; i++) { const r = fd(i); if (!grp.has(r)) grp.set(r, []); grp.get(r).push(i); }
        [...grp.values()].filter(g => g.length > 1).forEach(g => {
          const tw = g.every(a => g.every(b => a === b || twins(L, a, b)));
          const names = g.length === 2 ? `${lab(g[0])} és ${lab(g[1])}` : g.slice(0, -1).map(lab).join(", ") + " és " + lab(g[g.length - 1]);
          s += `<br>• <b>${names} ugyanott van</b> – ` + (tw ? "ugyanazok a szomszédaik." : "ebben a két koordinátában egybeesnek.");
        });
        const sel = view.o.editable ? view.sel : focus;
        if (sel >= 0) { const [x, y] = coord(sel); s += `<br>${lab(sel)}: $(${fmM(x, 3)};\\ ${fmM(y, 3)})$, szomszédai: ${L[sel].map(lab).join(", ") || "nincs"}.`; }
        info.innerHTML = s; math(info);
        /* jóslat */
        if (!cand.length) predBox.innerHTML = "Minden pár szomszédos – nincs jelölt.";
        else {
          const rows = cand.slice(0, 5).map((o, k) => [k + 1 + ".", `${lab(o.i)} – ${lab(o.j)}`, fmt(o.d, 3)].concat(G.club ? [G.club[o.i] === G.club[o.j] ? OK + " igen" : NO + " nem"] : []));
          const far = cand[cand.length - 1];
          predBox.innerHTML = `<b>Jóslat:</b> a legközelebbi nem szomszédos párok (távolság a beágyazásban)` +
            `<div class="tw" style="overflow-x:auto">${tbl(["#", "pár", "távolság"].concat(G.club ? ["egy klub?"] : []), rows)}</div>` +
            `A legtávolabbi nem szomszédos pár: ${lab(far.i)} – ${lab(far.j)} (${fmt(far.d, 3)}).`;
        }
        root.dataset.result = JSON.stringify({ key, yAx, m: G.edges.length, vals: vals.slice(0, 4).map(x => +x.toFixed(4)),
          Z: G.nodes.map((_, i) => coord(i).map(x => +x.toFixed(4))), near: cand.slice(0, 5).map(o => [lab(o.i), lab(o.j), +o.d.toFixed(4)]),
          far: cand.length ? [lab(cand[cand.length - 1].i), lab(cand[cand.length - 1].j), +cand[cand.length - 1].d.toFixed(4)] : null,
          same: [...same, ...sameAdj].map(o => [lab(o.i), lab(o.j), twins(L, o.i, o.j)]), mult: mult.length > 0, disc: vals[1] < eps });
      }
      build();
    };

    /* ------------------------------------------------------------------
       11.5  random-walk-corpus – séták = mondatok, csúcsok = szavak
       ------------------------------------------------------------------ */
    W["random-walk-corpus"] = root => {
      header(root, "Véletlen séták mint szöveg: DeepWalk és node2vec",
        "Minden csúcsból indíts néhány véletlen sétát: a séták a „mondatok”, a csúcsok a „szavak”. Egy $\\pm w$ szélességű ablakon belül álló két szó egy " +
        "(középső, környező) pár; a párok gyakoriságából PPMI-mátrix, abból beágyazás lesz. A node2vec két paramétere a lépést torzítja: " +
        "visszalépés súlya $1/p$, a korábbi csúcs szomszédjáé $1$, a távolodásé $1/q$.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let key = "five", p = 1, q = 1, len = 10, num = 10, win = 2, seed = 1, sortBy = "count", st = { prev: 0, cur: 1 }, exI = 3;
      let G, n, L, walks, C, PM, Z;
      const ASP = { five: 0.42, arviz: 0.5, karate: 0.62 }, RAD = { five: 15, arviz: 14, karate: 8 };

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["five", "öt barát (A–E)"], ["arviz", "Árvízhét (egész hét)"], ["karate", "karateklub"]], key, v => { key = v; build(); });
      /* p és q logaritmikus skálán: 2^v, v ∈ [−2; 2] */
      const pOut = mono("1"), qOut = mono("1");
      const pSl = range(-2, 2, 0.25, 0, "p (visszalépés)", () => { p = Math.pow(2, +pSl.value); pOut.textContent = fmt(p, 2); gen(); });
      const qSl = range(-2, 2, 0.25, 0, "q (távolodás)", () => { q = Math.pow(2, +qSl.value); qOut.textContent = fmt(q, 2); gen(); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("label", null, "$p$:", pSl, pOut), h("label", null, "$q$:", qSl, qOut),
        btn("p = q = 1 (DeepWalk)", () => { pSl.value = qSl.value = 0; p = q = 1; pOut.textContent = qOut.textContent = "1"; gen(); }));
      math(c2);
      const lOut = mono("10"), nOut = mono("10"), wOut = mono("2");
      const lSl = range(5, 40, 1, len, "sétahossz", () => { len = +lSl.value; lOut.textContent = len; gen(); }, "6rem");
      const nSl = range(1, 20, 1, num, "séta csúcsonként", () => { num = +nSl.value; nOut.textContent = num; gen(); }, "6rem");
      const wSl = range(1, 5, 1, win, "ablak", () => { win = +wSl.value; wOut.textContent = win; count(); }, "5rem");
      const c3 = h("div", { class: "controls" });
      c3.append(h("label", null, "sétahossz:", lSl, lOut), h("label", null, "séta / csúcs:", nSl, nOut), h("label", null, "ablak ±", wSl, wOut),
        btn("Séták generálása", () => gen(), "btn primary"), btn("új mag", () => { seed++; gen(); }));
      root.append(c1, c2, c3);

      /* felül: gráf + „egy lépés közelről” */
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const box = h("div"), stepBox = h("div");
      grid.append(box, stepBox); root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const view = new GK.View(box, { aspect: 0.42, radius: 15, draggable: false, edgeHitTol: 10,
        onEdgeClick: i => { const e = G.edges[i]; st = st.prev === e.a && st.cur === e.b ? { prev: e.b, cur: e.a } : { prev: e.a, cur: e.b }; drawStep(); },
        onNodeClick: i => { if (L[st.cur].includes(i)) { st = { prev: st.cur, cur: i }; drawStep(); } } });
      box.append(legend);
      const stepHead = h("div", { style: "font-weight:600;margin-bottom:.3rem" }, "Egy lépés közelről");
      const sel = h("select", { "aria-label": "az utolsó lépés (előző → aktuális)", style: "max-width:100%" });
      sel.addEventListener("change", () => { const [a, b] = sel.value.split(">").map(Number); st = { prev: a, cur: b }; drawStep(); });
      const stepSvg = h("div"), stepTxt = h("div", { class: "readout" });
      stepBox.append(stepHead, h("div", { class: "controls", style: "margin:.2rem 0" }, h("label", null, "a séta utolsó lépése:", sel)), stepSvg, stepTxt);

      /* három panel */
      const panels = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;margin-top:.8rem;align-items:start" });
      const pCorp = h("div"), pPairs = h("div"), pEmb = h("div");
      panels.append(pCorp, pPairs, pEmb); root.append(panels);
      const corpTxt = h("div", { class: "readout", style: "white-space:normal;word-break:break-word;line-height:1.5" });
      const winBox = h("div", { class: "readout" });
      pCorp.append(h("div", { style: "font-weight:600" }, "1. A korpusz"), corpTxt, h("div", { style: "font-weight:600;margin-top:.6rem" }, "Ablak egy sétán"), winBox);
      const sortC = h("div", { class: "controls", style: "margin:.2rem 0" });
      sortC.append(h("span", { style: "font-size:.9rem;color:var(--muted)" }, "rendezés:"));
      toggleGroup(sortC, [["count", "darabszám"], ["ppmi", "PPMI"]], sortBy, v => { sortBy = v; drawPairs(); });
      const pairTw = h("div", { class: "tw", style: "overflow-x:auto" }), pairNote = h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0" });
      pPairs.append(h("div", { style: "font-weight:600" }, "2. A leggyakoribb párok"), sortC, pairTw, pairNote);
      const embSvg = h("div"), embTxt = h("div", { class: "readout" });
      pEmb.append(h("div", { style: "font-weight:600" }, "3. 2D beágyazás (PPMI)"), embSvg, embTxt);
      const lesson = h("p", { style: "margin:.6rem 0 0;font-weight:600" },
        "Ami a sétákban gyakran áll egymás közelében, az a beágyazásban is közel kerül. A kis q messzire visz (mélységi bejárás: a séta végigjárja a közösséget), a nagy q a közvetlen környéken tart (szélességi bejárás: a csúcs helyi szerepe számít).");
      root.append(lesson);
      winBox.addEventListener("click", ev => { const t = ev.target.closest("[data-w]"); if (!t) return; exI = +t.dataset.w; drawWin(); });

      const lab = i => G.nodes[i].label;
      function build() {
        G = graphOf(key, ASP[key]); n = G.nodes.length; L = nbrs(n, G.edges);
        Object.assign(view.o, { aspect: ASP[key], radius: narrow ? Math.round(RAD[key] * 0.85) : RAD[key] });
        view.setGraph(G.nodes, G.edges); view.resize();
        st = { prev: G.edges[0].a, cur: G.edges[0].b };
        sel.innerHTML = G.edges.flatMap(e => [[e.a, e.b], [e.b, e.a]]).map(([a, b]) => `<option value="${a}>${b}">${esc(lab(a))} → ${esc(lab(b))}</option>`).join("");
        exI = 3;
        gen();
      }
      function gen() {
        walks = randomWalks(n, G.edges, { num, length: len, p, q, R: rng(1000 * seed + 7) });
        count(); drawStep();
      }
      function count() {
        C = walkCooc(n, walks, win); PM = ppmi(C); Z = ppmiEmbed(C, 2);
        drawCorpus(); drawWin(); drawPairs(); drawEmb();
      }
      function drawCorpus() {
        const words = walks.reduce((s, w) => s + w.length, 0), pairs = walks.reduce((s, w) => s + skipPairs(w, win).length, 0);
        const show = walks.slice(0, 8).map(w => `<div>${w.map(lab).join(" ")}</div>`).join("");
        corpTxt.innerHTML = `${show}<div class="muted" style="margin-top:.3rem">…</div>` +
          `<div style="margin-top:.3rem">${walks.length} séta (${num} menet × ${n} kezdőcsúcs), <b>${words.toLocaleString("hu-HU")}</b> szó, ±${win} ablakkal <b>${pairs.toLocaleString("hu-HU")}</b> pár.</div>`;
        root.dataset.corpus = JSON.stringify({ walks: walks.length, words, pairs });
      }
      /* mintaséta: az öt barátnál a szöveg „A B D E D B C” sétája, máskor az első séta (legfeljebb 12 szó) */
      function drawWin() {
        const ex = key === "five" ? [0, 1, 3, 4, 3, 1, 2] : walks[0].slice(0, 12);
        if (exI >= ex.length) exI = Math.min(3, ex.length - 1);
        const chips = ex.map((x, i) => {
          const inW = Math.abs(i - exI) <= win && i !== exI, me = i === exI;
          return `<button type="button" class="btn${me ? " on" : ""}" data-w="${i}" style="padding:.1em .5em;margin:.1em;${inW ? "outline:2px dashed var(--setC);outline-offset:1px" : ""}">${esc(lab(x))}</button>`;
        }).join("");
        const mine = skipPairs(ex, win).filter((_, k) => true), my = [];
        for (let j = Math.max(0, exI - win); j <= Math.min(ex.length - 1, exI + win); j++) if (j !== exI) my.push(`(${lab(ex[exI])}, ${lab(ex[j])})`);
        winBox.innerHTML = `<div style="font-family:var(--sans,inherit)">${chips}</div>` +
          `<div style="margin-top:.3rem">${key === "five" ? "A szöveg mintasétája" : "Az 1. séta eleje"}: kattints egy szóra. ±${win} ablakkal a kijelölt szó párjai: ${my.join(", ")}.</div>` +
          `<div>Az egész séta (${ex.length} szó) ±1-es ablakkal <b>${skipPairs(ex, 1).length}</b>, ±${win}-es ablakkal <b>${mine.length}</b> párt ad.</div>`;
        root.dataset.win = JSON.stringify({ ex: ex.map(lab).join(" "), w1: skipPairs(ex, 1).length, w: win, nw: mine.length });
      }
      function drawPairs() {
        const S = edgeSet(G.edges), P = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (C[i][j] > 0) P.push({ i, j, c: C[i][j], m: PM[i][j] });
        P.sort((a, b) => (sortBy === "count" ? b.c - a.c || b.m - a.m : b.m - a.m || b.c - a.c) || a.i - b.i || a.j - b.j);
        const top = P.slice(0, 8);
        pairTw.innerHTML = tbl(["pár", "db", "PPMI", "szomszéd?"], top.map(o => [`${lab(o.i)} – ${lab(o.j)}`, o.c.toLocaleString("hu-HU"), fmt(o.m, 2), S.has(o.i + "-" + o.j) ? OK + " igen" : NO + " nem"]));
        const nAdj = top.filter(o => S.has(o.i + "-" + o.j)).length;
        pairNote.textContent = sortBy === "count"
          ? `A top 8-ból ${nAdj} szomszédos pár. A nyers darabszám a nagy fokszámú csúcsokat favorizálja – a PPMI ezt kiszűri (a várthoz méri).`
          : `A top 8-ból ${nAdj} szomszédos pár. PPMI = max(0, ln(P(i, j) / (P(i)·P(j)))) – mennyivel gyakoribb a pár, mint véletlenül.`;
        root.dataset.pairs = JSON.stringify(top.map(o => [lab(o.i), lab(o.j), o.c, +o.m.toFixed(3)]));
      }
      function drawEmb() {
        const pts = G.nodes.map((nd, i) => ({ x: Z[i][0], y: Z[i][1], label: nd.label, color: G.club ? CLUB_COL[G.club[i]] : "--accent", sym: G.club ? CLUB_SYM[G.club[i]] : null }));
        embSvg.innerHTML = scatterSVG({ pts, edges: G.edges, xLab: "1. irány", yLab: "2. irány", Wd: 300, Ht: 270, r: key === "karate" ? 4.5 : 6.5, fs: key === "karate" ? 9 : 12, aria: "PPMI-beágyazás" });
        let s = "A séták PPMI-mátrixának két legnagyobb sajátiránya. A gráf élei halványan.";
        if (G.club) {
          let same = 0;
          for (let i = 0; i < n; i++) {
            let b = -1, bd = Infinity;
            for (let j = 0; j < n; j++) if (j !== i) { const d = dist(Z[i], Z[j]); if (d < bd) { bd = d; b = j; } }
            if (G.club[b] === G.club[i]) same++;
          }
          s = `${sw(CLUB_COL[0])}● ${CLUB_NAME[0]}, ${sw(CLUB_COL[1])}▲ ${CLUB_NAME[1]}<br>A beágyazásban a legközelebbi szomszéd az esetek <b>${pct(same / n)}</b>-ában ugyanabból a klubból való (${same} / ${n}).`;
          root.dataset.knn = String(same / n);
        }
        embTxt.innerHTML = s;
      }
      function drawStep() {
        if (!L[st.prev].includes(st.cur)) st = { prev: G.edges[0].a, cur: G.edges[0].b };
        sel.value = st.prev + ">" + st.cur;
        const P = n2vStep(n, G.edges, st.prev, st.cur, p, q), Sp = new Set(L[st.prev]);
        const kind = x => (x === st.prev ? "back" : Sp.has(x) ? "stay" : "out");
        const KC = { back: "--setB", stay: "--setA", out: "--setC" }, KS = { back: "↩", stay: "↔", out: "→" };
        const KW = { back: "1/p", stay: "1", out: "1/q" }, KN = { back: "vissza", stay: "az előző szomszédja", out: "távolodik" };
        /* gráf: a lépés nyíllal, a jelöltek a típusuk szerint */
        const pm = new Map(P.map(o => [o.x, o]));
        const nodes = G.nodes.map((nd, i) => {
          const o = Object.assign({}, nd);
          if (i === st.cur) Object.assign(o, { color: "--accent" });
          else if (pm.has(i)) Object.assign(o, { color: KC[kind(i)], badge: KS[kind(i)] });
          else if (G.club) Object.assign(o, { color: null });
          return o;
        });
        const edges = G.edges.map(e => {
          if ((e.a === st.prev && e.b === st.cur) || (e.b === st.prev && e.a === st.cur)) return { a: st.prev, b: st.cur, w: 1, color: "--accent", width: 3.5, dir: true };
          if (e.a === st.cur || e.b === st.cur) return { ...e, color: KC[kind(e.a === st.cur ? e.b : e.a)], width: 2.5 };
          return { ...e, color: "--border", width: 1.2 };
        });
        view.setGraph(nodes, edges);
        legend.innerHTML = `Kattints egy élre (még egyszer: fordított irány), vagy egy kiemelt szomszédra a továbblépéshez. ` +
          `${sw("--accent")}aktuális csúcs · ${sw(KC.back)}↩ vissza ($1/p$) ${sw(KC.stay)}↔ az előző szomszédja ($1$) ${sw(KC.out)}→ távolodik ($1/q$)`;
        math(legend);
        /* oszlopok */
        const rowH = 30, Wd = 330, Ht = 18 + rowH * P.length, x0 = 62, bw = Wd - x0 - 110;
        let s = "";
        P.forEach((o, k) => {
          const y = 8 + k * rowH, t = kind(o.x);
          s += `<text x="${x0 - 8}" y="${y + 15}" text-anchor="end" style="fill:var(--text);font-size:12px;font-weight:600">${KS[t]} ${esc(lab(o.x))}</text>` +
            `<rect x="${x0}" y="${y + 3}" width="${Math.max(1, bw * o.p)}" height="${rowH - 10}" rx="3" style="fill:${sv(KC[t])}"/>` +
            `<text x="${x0 + bw * o.p + 5}" y="${y + 15}" style="fill:var(--text);font-size:11.5px">${fmt(o.p, 3)} (${KW[t]} = ${fmt(o.w, 2)})</text>`;
        });
        stepSvg.innerHTML = svgEl(Wd, Ht, s, "node2vec lépésvalószínűségek");
        const T = P.reduce((a, o) => a + o.w, 0);
        stepTxt.innerHTML = `A séta most ${lab(st.prev)} → ${lab(st.cur)}; a következő csúcs ${lab(st.cur)} szomszédai közül: ` +
          P.map(o => `${lab(o.x)}: ${KN[kind(o.x)]}, súly ${KW[kind(o.x)]} = ${fmt(o.w, 2)}`).join("; ") +
          `. Összeg ${fmt(T, 3)}, a valószínűség = súly / összeg.` +
          (p === 1 && q === 1 ? " ($p = q = 1$: minden szomszéd egyformán valószínű – ez a DeepWalk.)" : "");
        math(stepTxt);
        root.dataset.step = JSON.stringify({ prev: lab(st.prev), cur: lab(st.cur), p, q, P: P.map(o => [lab(o.x), +o.p.toFixed(4)]) });
      }
      build();
    };

    /* ------------------------------------------------------------------
       11.6  link-pred-lab – minden módszer egy kísérletben
       ------------------------------------------------------------------ */
    W["link-pred-lab"] = root => {
      header(root, "Kapcsolat-előrejelzési labor",
        "Véletlenszerűen kiveszünk néhány élt (ezek a <b>tesztélek</b>, a pozitívak), a maradék a tanítógráf. Minden módszer ezen pontozza a párokat; " +
        "az AUC annak a valószínűsége, hogy egy tesztél több pontot kap egy negatív (nem él) párnál, a precision@k pedig a top $k$ jóslat találati aránya ($k$ = a tesztélek száma).");
      math(root.querySelector(".w-sub"));
      const METH = [["CN", "közös szomszédok (CN)"], ["J", "Jaccard (J)"], ["AA", "Adamic–Adar (AA)"], ["RA", "erőforrás-allokáció (RA)"], ["PA", "pref. kapcsolódás (PA)"],
        ["spec", "spektrális 2D"], ["ppmi", "PPMI-séta 8D"], ["sgns", "node2vec / SGNS 16D"]];
      const HEUR = ["CN", "J", "AA", "RA", "PA"], EMB = new Set(["spec", "ppmi", "sgns"]);
      let data = "karate", frac = 0.1, splits = 10, negMode = "all", leak = false, seedBase = 1, stop = null, deb = null, started = false;
      const on = new Set(METH.map(m => m[0]));
      let G, n, last = null;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, [["karate", "karateklub"], ["lesmis", "Les Misérables"]], data, v => { data = v; load(); schedule(); });
      const fOut = mono("10%");
      const fSl = range(5, 30, 5, 10, "tesztélek aránya", () => { frac = +fSl.value / 100; fOut.textContent = pct(frac); schedule(); });
      c1.append(h("label", null, "tesztél:", fSl, fOut));
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "felosztás:"));
      toggleGroup(c2, [[1, "1"], [10, "10"], [30, "30"]], splits, v => { splits = v; schedule(); });
      c2.append(h("span", { style: "font-size:.92rem;color:var(--muted)" }, "negatívak:"));
      toggleGroup(c2, [["all", "minden nem él"], ["rand", "véletlen, ugyanannyi"], ["hard", "nehéz: 2 távolságú párok"]], negMode, v => { negMode = v; schedule(); });
      const cbLeak = h("input", { type: "checkbox" });
      cbLeak.addEventListener("change", () => { leak = cbLeak.checked; schedule(); });
      const c3 = h("div", { class: "controls" });
      c3.append(h("label", null, cbLeak, "szivárgás (a pontozó gráf a teljes gráf)"));
      const c4 = h("div", { class: "controls", style: "gap:.3rem .8rem" });
      METH.forEach(([k, l]) => {
        const cb = h("input", { type: "checkbox", checked: "" });
        cb.addEventListener("change", () => { cb.checked ? on.add(k) : on.delete(k); schedule(); });
        c4.append(h("label", null, cb, l));
      });
      const c5 = h("div", { class: "controls" });
      const prog = h("progress", { max: "1", value: "0", style: "width:9rem;display:none" }), progT = h("span", { class: "muted", style: "font-size:.86rem" });
      c5.append(btn("Futtatás", () => run(), "btn primary"), btn("új felosztások", () => { seedBase++; run(); }), prog, progT);
      root.append(c1, c2, c3, c4, c5);
      const info = h("div", { class: "readout" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" }), chart = h("div", { style: "margin-top:.4rem" });
      const lesson = h("div", { style: "margin:.5rem 0 0" });
      root.append(info, tw, chart, lesson);
      lesson.innerHTML = `<p style="margin:.3rem 0;font-weight:600">Próbáld ki:</p><ul style="margin:.2rem 0 0 1.1rem;padding:0;font-size:.92rem">` +
        `<li><b>szivárgás</b>: a PA, a spektrális és a séta-alapú módszerek „megugranak” – a tesztél a fokszámban és a sétákban is benne van; a CN alig mozdul (egy él nem közös szomszéd).</li>` +
        `<li><b>nehéz negatívak</b>: ha minden negatívnak van közös szomszédja, a CN szinte használhatatlan – a feladat nehézsége a negatívak megválasztásán is múlik.</li>` +
        `<li><b>1 felosztás</b>: a szórás nagy – egy szám egyetlen véletlen felosztásból keveset mond.</li></ul>`;

      function load() {
        const g = data === "karate" ? karateGraph() : { n: window.LESMIS.names.length, edges: window.LESMIS.edges.map(([a, b]) => ({ a, b, w: 1 })) };
        G = g; n = g.n;
      }
      function schedule() { if (!started) return; clearTimeout(deb); deb = setTimeout(run, 250); }
      function run() {
        started = true; clearTimeout(deb);
        if (stop) stop();
        const meths = METH.map(m => m[0]).filter(k => on.has(k));
        const acc = {}; meths.forEach(k => (acc[k] = { auc: [], pk: [] }));
        const full = nonEdges(n, G.edges);
        const steps = ["split"].concat(meths.some(k => HEUR.includes(k)) ? ["heur"] : [], on.has("spec") ? ["spec"] : [],
          on.has("ppmi") || on.has("sgns") ? ["walk"] : [], on.has("sgns") ? ["sgns"] : []);
        const cfg = { data, frac, splits, negMode, leak, seedBase };
        let ctx = null;
        const rec = (k, f) => {
          const sp = ctx.pos.map(([a, b]) => f(a, b)), sn = ctx.neg.map(([a, b]) => f(a, b));
          acc[k].auc.push(aucPairs(sp, sn));
          acc[k].pk.push(precisionAtK(sp.map(s => ({ s, y: true })).concat(sn.map(s => ({ s, y: false }))), ctx.pos.length).prec);
        };
        const total = splits * steps.length;
        prog.style.display = ""; prog.max = String(total); prog.value = "0";
        info.innerHTML = "Számolás…";
        const t0 = performance.now();
        stop = chunked(total, 1, i => {
          const r = Math.floor(i / steps.length), s = steps[i % steps.length];
          if (s === "split") {
            const R = rng(7919 * seedBase + 104729 * r + (data === "karate" ? 1 : 2));
            const { train, test } = holdoutSplit(n, G.edges, frac, R);
            const scoreE = leak ? G.edges : train;
            let neg;
            if (negMode === "all") neg = full;
            else if (negMode === "rand") { const P = randPerm(full.length, R); neg = P.slice(0, test.length).map(k => full[k]); }
            else { const sc = linkScorer(n, train); neg = full.filter(([a, b]) => sc(a, b).CN > 0); }
            ctx = { R, train, test, scoreE, neg, pos: test.map(e => [e.a, e.b]) };
          } else if (s === "heur") {
            const sc = linkScorer(n, ctx.scoreE), cache = new Map(), get = (a, b) => { const k = a * n + b; if (!cache.has(k)) cache.set(k, sc(a, b)); return cache.get(k); };
            HEUR.filter(k => on.has(k)).forEach(k => rec(k, (a, b) => get(a, b)[k]));
          } else if (s === "spec") {
            const Zs = laplacianEmbed(n, ctx.scoreE, 2).Z; rec("spec", (a, b) => -dist(Zs[a], Zs[b]));
          } else if (s === "walk") {
            ctx.walks = randomWalks(n, ctx.scoreE, { num: 10, length: 20, R: ctx.R });
            if (on.has("ppmi")) { const Zp = ppmiEmbed(walkCooc(n, ctx.walks, 5), 8); rec("ppmi", (a, b) => dot(Zp[a], Zp[b])); }
          } else if (s === "sgns") {
            const Zn = sgnsEmbed(n, ctx.walks, { dim: 16, window: 5, R: ctx.R }); rec("sgns", (a, b) => cosine(Zn[a], Zn[b]));
          }
          ctx.k = ctx.pos.length; ctx.nNeg = ctx.neg.length;
          last = { k: ctx.pos.length, nNeg: ctx.neg.length };
        }, i => {
          prog.value = String(i);
          const r = Math.min(splits, Math.floor(i / steps.length) + 1);
          progT.textContent = i < total ? `${r}. / ${splits} felosztás…` : "";
        }, () => {
          stop = null; prog.style.display = "none";
          show(acc, meths, cfg, performance.now() - t0);
        });
      }
      function show(acc, meths, cfg, ms) {
        const res = meths.map(k => { const a = meanSd(acc[k].auc), p = meanSd(acc[k].pk); return { k, name: METH.find(m => m[0] === k)[1], auc: a.mean, sd: a.sd, pk: p.mean }; });
        const best = res.length ? res.reduce((b, x) => (x.auc > b.auc ? x : b)) : null;
        const negTxt = { all: "minden nem él", rand: "véletlen, ugyanannyi", hard: "nehéz (2 távolságú párok a tanítógráfban)" }[cfg.negMode];
        info.innerHTML = `${cfg.data === "karate" ? "Karateklub" : "Les Misérables"}: ${n} csúcs, ${G.edges.length} él · ${cfg.splits} felosztás · ` +
          `tesztél: <b>${last ? last.k : "–"}</b> / felosztás (${pct(cfg.frac)}) · negatív pár: <b>${last ? last.nNeg.toLocaleString("hu-HU") : "–"}</b> (${negTxt})` +
          (cfg.leak ? ` · <b>⚠ szivárgás</b>: a pontozó gráf a teljes gráf` : "") +
          (best ? `<br>A legjobb AUC: <b>★ ${best.name}</b> (${fmt(best.auc, 3)}). Futásidő: ${fmt(ms / 1000, 1)} s.` : "<br>Válassz legalább egy módszert.");
        tw.innerHTML = res.length ? tbl(["módszer", "AUC (átlag ± szórás)", `precision@k`],
          res.map(x => ({ c: [(x === best ? "★ " : "") + x.name, `${fmt(x.auc, 3)} ± ${fmt(x.sd, 3)}`, fmt(x.pk, 3)], st: x === best ? "font-weight:700;color:var(--accent)" : "" }))) : "";
        /* oszlopdiagram */
        const rowH = 26, x0 = 150, Wd = 520, bw = Wd - x0 - 60, Ht = 30 + rowH * res.length;
        const X = v => x0 + bw * v;
        let s = "";
        [0, 0.25, 0.5, 0.75, 1].forEach(t => {
          s += `<line x1="${X(t)}" y1="14" x2="${X(t)}" y2="${Ht - 6}" style="stroke:var(--border);stroke-width:${t === 0.5 ? 0 : 1}"/>` +
            `<text x="${X(t)}" y="10" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">${fmt(t, 2)}</text>`;
        });
        res.forEach((x, k) => {
          const y = 18 + k * rowH, col = EMB.has(x.k) ? "--setC" : "--setA", isB = x === best;
          s += `<text x="${x0 - 6}" y="${y + 13}" text-anchor="end" style="fill:var(--text);font-size:11.5px;${isB ? "font-weight:700" : ""}">${isB ? "★ " : ""}${esc(x.name)}</text>` +
            `<rect x="${x0}" y="${y + 2}" width="${Math.max(0, bw * x.auc)}" height="${rowH - 8}" rx="2" style="fill:${sv(col)};${isB ? "stroke:var(--accent);stroke-width:2.5" : "opacity:.85"}"/>` +
            `<line x1="${X(Math.max(0, x.auc - x.sd))}" y1="${y + rowH / 2 - 1}" x2="${X(Math.min(1, x.auc + x.sd))}" y2="${y + rowH / 2 - 1}" style="stroke:var(--text);stroke-width:1.3"/>` +
            `<text x="${X(Math.min(1, x.auc + x.sd)) + 5}" y="${y + 13}" style="fill:var(--text);font-size:11px">${fmt(x.auc, 2)}</text>`;
        });
        s += `<line x1="${X(0.5)}" y1="14" x2="${X(0.5)}" y2="${Ht - 6}" style="stroke:var(--text);stroke-width:1.5;stroke-dasharray:5 3"/>` +
          `<text x="${X(0.5) + 4}" y="${Ht - 8}" style="fill:var(--muted);font-size:10.5px">véletlen</text>`;
        chart.innerHTML = res.length ? svgEl(Wd, Ht, s, "AUC módszerenként") +
          `<p class="muted" style="font-size:.84rem;margin:.2rem 0 0">${sw("--setA")}szomszédsági heurisztika ${sw("--setC")}beágyazás · a vízszintes vonal: ± szórás a felosztások között · szaggatott: AUC = 0,5 (véletlen)</p>` : "";
        math(info);
        root.dataset.result = JSON.stringify({ cfg, k: last && last.k, nNeg: last && last.nNeg, res: res.map(x => [x.k, +x.auc.toFixed(4), +x.sd.toFixed(4), +x.pk.toFixed(4)]) });
      }
      load();
      info.textContent = "A kísérlet akkor indul, amikor a szemléltetés láthatóvá válik (vagy nyomd meg a „Futtatás” gombot).";
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !started) { io.disconnect(); run(); } });
        io.observe(root);
      } else run();
    };
  }
