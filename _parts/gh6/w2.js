  /* ==================================================================
     w2: 6.2, 6.3, 6.5, 6.6 widgetjei (degree-assort, weak-ties, motif-census, arvizhet-week)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmtS = (x, d = 2) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmM = (x, d = 2) => fmtS(x, d).replace(",", "{,}").replace(MINUS, "-");   // KaTeX-be
    /* címkeszín a háttér világossága szerint */
    function inkOf(c) {
      const m = String(c).match(/[\d.]+/g);
      if (!m) return null;
      const [r, g, b] = m.slice(0, 3).map(Number), L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return L > 0.6 ? "#1b1f27" : "#ffffff";
    }
    /* témaváltáskor újrarajzolás (a mixColor színek újraszámolása) */
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const checkbox = (label, onchange, checked = false) => {
      const inp = h("input", { type: "checkbox" });
      inp.checked = checked;
      inp.addEventListener("change", () => onchange(inp.checked));
      return { lab: h("label", null, inp, label), inp };
    };
    /* ha a widget kikerül a képből, vagy a lap rejtett: stop() */
    function autoStop(root, stop) {
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) stop(); })).observe(root);
      document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
    }
    /* a csúcsok alatti név (sub) ne lógjon le a vászonról */
    const liftY = y => 0.07 + (y - 0.08) * 0.9;
    /* keskeny képernyőn sűrűbb táblázatcellák */
    const tight = el => { if (window.innerWidth < 560) el.querySelectorAll("td, th").forEach(c => (c.style.padding = ".3em .45em")); };
    function pearson(x, y) {
      const n = x.length; if (!n) return NaN;
      const mx = x.reduce((s, t) => s + t, 0) / n, my = y.reduce((s, t) => s + t, 0) / n;
      let sxy = 0, sxx = 0, syy = 0;
      for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
      return sxx > 1e-12 && syy > 1e-12 ? sxy / Math.sqrt(sxx * syy) : NaN;
    }
    /* átlagolt rangok (növekvő; holtverseny: a helyek átlaga) → Spearman = a rangok Pearson-korrelációja */
    function avgRanks(v, eps = 1e-9) {
      const o = [...v.keys()].sort((i, j) => v[i] - v[j]), r = new Array(v.length);
      for (let k = 0; k < o.length;) {
        let l = k; while (l + 1 < o.length && Math.abs(v[o[l + 1]] - v[o[k]]) < eps) l++;
        for (let t = k; t <= l; t++) r[o[t]] = (k + l) / 2 + 1;
        k = l + 1;
      }
      return r;
    }
    const spearman = (x, y) => pearson(avgRanks(x), avgRanks(y));
    const mean = a => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
    const sdev = a => { const m = mean(a); return a.length ? Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length) : NaN; };
    /* a legnagyobb komponens mérete (union-find) */
    function giant(n, edges) {
      const p = [...Array(n).keys()], f = x => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
      edges.forEach(e => { const a = f(e.a), b = f(e.b); if (a !== b) p[a] = b; });
      const c = {}; let best = 0;
      for (let i = 0; i < n; i++) { const r = f(i); c[r] = (c[r] || 0) + 1; if (c[r] > best) best = c[r]; }
      return best;
    }
    /* SVG-segéd: szövegből elem */
    const svgEl = (W_, H_, inner, label) =>
      `<svg viewBox="0 0 ${W_} ${H_}" style="width:100%;max-width:${W_}px;display:block;touch-action:manipulation" role="img" aria-label="${label}">${inner}</svg>`;
    const sv = c => `var(${c})`;

    /* ------------------------------------------------------------------
       6.2  degree-assort – a fokszám-asszortativitás szórásdiagramon
       ------------------------------------------------------------------ */
    W["degree-assort"] = root => {
      header(root, "Fokszám-asszortativitás: kihez kapcsolódnak a nagy fokú csúcsok?",
        "Minden él <b>mindkét irányban</b> egy pont a diagramon: $(k_u, k_v)$, a két végpont fokszáma. Az $r$ ezeknek a pontoknak a Pearson-korrelációja. " +
        "Kattints (koppints) egy pontra: kiemelem a gráfon az éleket, amelyek adják. A kis gráfokat szerkesztheted: üres helyre kattintva új csúcs, két csúcsra él be/ki, élre törlés.");
      math(root.querySelector(".w-sub"));
      const wide = root.clientWidth >= 720, narrow = root.clientWidth < 560;
      const aspect = wide ? 0.8 : narrow ? 0.7 : 0.55;
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      let key = "star", selPt = null, PB = null, st = null;
      toggleGroup(ctr, [["star", "csillag"], ["path4", "4 csúcsú út"], ["kite", "sárkány"], ["k4", "K₄"], ["cyc", "kör"], ["arviz", "Árvízhét"],
        ["karate", "karateklub"], ["polblogs", "politikai blogok"]], key, v => { key = v; load(); });
      const grid = h("div", { style: wide ? "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;align-items:start" : "" });
      const box = h("div"), plot = h("div", { style: "margin-top:.3rem" });
      grid.append(box, plot);
      const info = h("div", { class: "readout" });
      root.append(grid, info);
      const view = new GK.View(box, { aspect, editable: true, maxNodes: 12, radius: narrow ? 14 : 16, nodes: [], edges: [],
        onChange: () => { selPt = null; compute(); } });

      function load() {
        selPt = null;
        box.style.display = key === "polblogs" ? "none" : "";
        if (key === "polblogs") { compute(); return; }
        let G;
        if (key === "cyc") {
          const k = 6;
          G = { nodes: Array.from({ length: k }, (_, i) => ({ label: String(i + 1), x: 0.5 + 0.36 * Math.sin(2 * Math.PI * i / k) * (aspect < 0.8 ? aspect / 0.8 : 1), y: 0.5 - 0.4 * Math.cos(2 * Math.PI * i / k) })),
            edges: Array.from({ length: k }, (_, i) => ({ a: i, b: (i + 1) % k, w: 1 })) };
        } else G = preset(key, aspect);
        const nodes = G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub }));
        view.o.editable = key !== "karate";
        view.o.radius = key === "karate" ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
        view.o.maxNodes = Math.max(12, nodes.length);
        view.setGraph(nodes, G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        compute();
      }
      /* a politikai blogok irányítatlanul: a kölcsönös linkpár egy él */
      function polblogs() {
        if (PB) return PB;
        const P = window.POLBLOGS, seen = new Set(), E = [];
        for (let i = 0; i < P.edges.length; i += 2) {
          const a = P.edges[i], b = P.edges[i + 1];
          if (a === b) continue;
          const k = GK.edgeKey(a, b);
          if (!seen.has(k)) { seen.add(k); E.push({ a, b, w: 1 }); }
        }
        return (PB = { n: P.n, edges: E });
      }
      function compute() {
        if (key === "polblogs") { const P = polblogs(); st = degAssort(P.n, P.edges); st.m = P.edges.length; st.n = P.n; }
        else { const E = view.edges.filter(e => e.a !== e.b); st = degAssort(view.nodes.length, E); st.m = E.length; st.n = view.nodes.length; }
        paint();
      }
      function paint() {
        /* gráf: a kiválasztott pont élei kiemelve, a csúcsok mellett a fokszám */
        if (key !== "polblogs") {
          view.nodes.forEach((nd, i) => { nd.badge = key === "karate" ? null : st.deg[i]; });
          view.hlE = new Set(); view.hl = new Set();
          if (selPt) view.edges.forEach(e => {
            const p = st.deg[e.a], q = st.deg[e.b];
            if ((p === selPt[0] && q === selPt[1]) || (p === selPt[1] && q === selPt[0])) { view.hlE.add(GK.edgeKey(e.a, e.b)); view.hl.add(e.a); view.hl.add(e.b); }
          });
          view.dim = !!selPt;
          view.draw();
        }
        plot.innerHTML = key === "polblogs" ? heat() : scatter();
        plot.querySelectorAll("[data-pt]").forEach(c => c.addEventListener("click", () => {
          const [x, y] = c.dataset.pt.split(",").map(Number);
          selPt = selPt && selPt[0] === x && selPt[1] === y ? null : [x, y];
          paint();
        }));
        /* kiírás */
        const r = st.r;
        let s = `$r = ${isFinite(r) ? fmM(r, 2) : "\\text{--}"}$ · ${st.m} él → ${2 * st.m} pont`;
        if (!st.m) s += "<br>Nincs él: nincs mit korreláltatni.";
        else if (!isFinite(r)) s += "<br><b>Nem értelmezhető:</b> minden fokszám egyenlő, a pontok egyetlen helyre esnek (a nevező 0).";
        else if (r < -0.05) s += "<br><b>Negatív:</b> a nagy fokú csúcsok kis fokúakhoz kapcsolódnak – <b>diszasszortatív</b>.";
        else if (r > 0.05) s += "<br><b>Pozitív:</b> hasonló fokúak kapcsolódnak – <b>asszortatív</b>.";
        else s += "<br><b>Közel 0:</b> a végpontok fokszáma alig függ össze.";
        if (selPt && key !== "polblogs") {
          const cnt = view.hlE.size;
          s += `<br>A $(${selPt[0]}, ${selPt[1]})$ pont: ${cnt} él, amelynek egyik végén ${selPt[0]}, a másikon ${selPt[1]} fokú csúcs áll` +
            (selPt[0] === selPt[1] ? " (mindkét irányban ugyanez a pont)." : ` (ugyanezek az élek adják a $(${selPt[1]}, ${selPt[0]})$ pontot is).`);
        }
        if (key === "polblogs") s += `<br>${st.n} blog, a kölcsönös linkpár egy él. A sok linket kapó nagy blogokra főleg kis blogok mutatnak – a szociális hálókkal ellentétben a web diszasszortatív.`;
        if (key === "karate") s += "<br>A két vezető (1 és 34) sok kis fokú taghoz kapcsolódik: erősen diszasszortatív.";
        info.innerHTML = s;
        math(info);
      }
      /* szórásdiagram kis gráfra: a pont mérete a darabszám, regressziós egyenes */
      function scatter() {
        const Wd = 340, Ht = 300, L = 38, R = 14, T = 14, B = 34;
        if (!st.m) return svgEl(Wd, Ht, `<text x="${Wd / 2}" y="${Ht / 2}" text-anchor="middle" fill="${sv("--muted")}" font-size="13">nincs él</text>`, "üres szórásdiagram");
        const kmax = Math.max(...st.xs), lo = 0, hi = kmax + 1;
        const X = x => L + (x - lo) / (hi - lo) * (Wd - L - R), Y = y => Ht - B - (y - lo) / (hi - lo) * (Ht - T - B);
        const step = hi > 12 ? (hi > 24 ? 5 : 2) : 1;
        let g = "";
        for (let t = 0; t <= hi; t += step) {
          g += `<line x1="${X(t)}" y1="${T}" x2="${X(t)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.6"/>` +
            `<line x1="${L}" y1="${Y(t)}" x2="${Wd - R}" y2="${Y(t)}" stroke="${sv("--border")}" stroke-width="0.6"/>` +
            `<text x="${X(t)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>` +
            `<text x="${L - 6}" y="${Y(t) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${t}</text>`;
        }
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kᵤ (az egyik végpont fokszáma)</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">kᵥ (a másik végponté)</text>`;
        /* regressziós egyenes: a két tengely szórása egyenlő, így a meredekség éppen r */
        if (isFinite(st.r)) {
          const mx = mean(st.xs), x0 = Math.min(...st.xs) - 0.4, x1 = kmax + 0.4, y = x => mx + st.r * (x - mx);
          g += `<line x1="${X(x0)}" y1="${Y(y(x0))}" x2="${X(x1)}" y2="${Y(y(x1))}" stroke="${sv("--bad")}" stroke-width="2" stroke-dasharray="6 4"/>`;
        }
        const cnt = {};
        st.xs.forEach((x, i) => { const k = x + "," + st.ys[i]; cnt[k] = (cnt[k] || 0) + 1; });
        const maxC = Math.max(...Object.values(cnt)), rad = c => 4 + 9 * Math.sqrt(c / maxC);
        Object.entries(cnt).forEach(([k, c]) => {
          const [x, y] = k.split(",").map(Number), on = selPt && selPt[0] === x && selPt[1] === y;
          const pr = rad(c);
          g += `<g data-pt="${k}" style="cursor:pointer"><circle cx="${X(x)}" cy="${Y(y)}" r="${Math.max(pr, 11)}" fill="transparent"/>` +
            `<circle cx="${X(x)}" cy="${Y(y)}" r="${pr}" fill="${sv(on ? "--accent" : "--setA")}" fill-opacity="${on ? 0.95 : 0.6}" stroke="${sv(on ? "--accent" : "--setA")}" stroke-width="1.2"/>` +
            (c > 1 ? `<text x="${X(x) + pr + 2}" y="${Y(y) - pr + 2}" font-size="10" font-weight="600" fill="${sv("--text")}" stroke="${sv("--card")}" stroke-width="2.5" paint-order="stroke">${c}×</text>` : "") +
            `<title>(${x}, ${y}): ${c} pont</title></g>`;
        });
        g += `<text x="${Wd - R}" y="${T + 10}" text-anchor="end" font-size="10.5" fill="${sv("--bad")}">regressziós egyenes (meredeksége r)</text>`;
        return svgEl(Wd, Ht, g, "szórásdiagram: az élvégek fokszámai");
      }
      /* hőtérkép nagy gráfra: logaritmikus rekeszek, a szín a darabszám logaritmusa */
      function heat() {
        const Wd = 340, Ht = 310, L = 40, R = 14, T = 14, B = 36;
        const kmax = Math.max(...st.xs), lmax = Math.log10(kmax * 1.05), NB = 14;
        const bin = k => Math.min(NB - 1, Math.floor(Math.log10(k) / lmax * NB));
        const X = lk => L + lk / lmax * (Wd - L - R), Y = lk => Ht - B - lk / lmax * (Ht - T - B);
        const C = Array.from({ length: NB }, () => new Array(NB).fill(0)), sumY = new Array(NB).fill(0), nY = new Array(NB).fill(0);
        st.xs.forEach((x, i) => { const bx = bin(x); C[bx][bin(st.ys[i])]++; sumY[bx] += st.ys[i]; nY[bx]++; });
        const cmax = Math.log(1 + Math.max(...C.flat()));
        let g = "";
        for (let a = 0; a < NB; a++) for (let b = 0; b < NB; b++) if (C[a][b]) {
          const x0 = X(a * lmax / NB), x1 = X((a + 1) * lmax / NB), y0 = Y((b + 1) * lmax / NB), y1 = Y(b * lmax / NB);
          g += `<rect x="${x0}" y="${y0}" width="${x1 - x0 + 0.3}" height="${y1 - y0 + 0.3}" fill="${mixColor("--card", "--accent", 0.12 + 0.88 * Math.log(1 + C[a][b]) / cmax)}"><title>${C[a][b]} pont</title></rect>`;
        }
        [1, 2, 5, 10, 20, 50, 100, 200].filter(t => Math.log10(t) <= lmax).forEach(t => {
          const l = Math.log10(t);
          g += `<line x1="${X(l)}" y1="${T}" x2="${X(l)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.5"/>` +
            `<line x1="${L}" y1="${Y(l)}" x2="${Wd - R}" y2="${Y(l)}" stroke="${sv("--border")}" stroke-width="0.5"/>` +
            `<text x="${X(l)}" y="${Ht - B + 13}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>` +
            `<text x="${L - 5}" y="${Y(l) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${t}</text>`;
        });
        /* a szomszédok átlagos fokszáma rekeszenként */
        const pts = [];
        for (let a = 0; a < NB; a++) if (nY[a]) pts.push([X((a + 0.5) * lmax / NB), Y(Math.log10(sumY[a] / nY[a]))]);
        g += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${sv("--setB")}" stroke-width="2.2"/>` +
          pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${sv("--setB")}"/>`).join("");
        /* a regressziós egyenes log-skálán görbe */
        const mx = mean(st.xs), cur = [];
        for (let t = 0; t <= 60; t++) { const k = Math.pow(10, t / 60 * lmax), y = mx + st.r * (k - mx); if (y >= 1) cur.push([X(Math.log10(k)), Y(Math.log10(y))]); }
        g += `<polyline points="${cur.map(p => p.join(",")).join(" ")}" fill="none" stroke="${sv("--bad")}" stroke-width="1.8" stroke-dasharray="6 4"/>`;
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 5}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kᵤ (log-skála)</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">kᵥ (log-skála)</text>`;
        const leg = `<div class="muted" style="font-size:.8rem;margin-top:.2rem">sötétebb cella: több pont (log-skálán) · <span style="color:var(--setB)">●—</span> a szomszédok átlagos fokszáma · ` +
          `<span style="color:var(--bad)">- -</span> regressziós egyenes (log-skálán görbe)</div>`;
        return svgEl(Wd, Ht, g, "hőtérkép: a politikai blogok élvégeinek fokszámai") + leg;
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       6.3  weak-ties – gyenge kötések: súly, átfedés, eltávolítás
       ------------------------------------------------------------------ */
    W["weak-ties"] = root => {
      header(root, "Gyenge kötések: súly, átfedés és a háló szétesése",
        "Az élvastagság a súly (karateklub: hány helyzetben találkozott a két tag; Árvízhét: közös cikkek). A szín a súlyt vagy a szomszédsági átfedést mutatja: " +
        "$O_{ij} = \\dfrac{|N(i)\\cap N(j)|}{|N(i)\\cup N(j)\\setminus\\{i,j\\}|}$. Szaggatott: <b>helyi híd</b> ($O = 0$). Kattints egy élre az adataiért!");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 1 : 0.6;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let key = "karate", colorBy = "w", order = "weak", k = 0, selE = -1, G, n = 0, E = [], O = [], seq = [], curves = {}, seed = 1;
      toggleGroup(ctr, [["karate", "karateklub (súlyozott)"], ["arviz", "Árvízhét"]], key, v => { key = v; load(); });
      ctr2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "élszín:"));
      toggleGroup(ctr2, [["w", "súly szerint"], ["o", "átfedés szerint"]], colorBy, v => { colorBy = v; paint(); });
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect, radius: 12, draggable: false, nodes: [], edges: [],
        onEdgeClick: i => { selE = selE === view.edges[i].id ? -1 : view.edges[i].id; paint(); } });
      const legend = h("div", { class: "muted", style: "font-size:.8rem;margin-top:.2rem" });
      const info = h("div", { class: "readout" });
      root.append(legend, info);
      /* eltávolítási kísérlet */
      root.append(h("div", { style: "font-weight:700;margin-top:1rem" }, "Eltávolítási kísérlet (Onnela és mtsai, 2007, kicsiben)"));
      const ctr3 = h("div", { class: "controls" }), ctr4 = h("div", { class: "controls" });
      root.append(ctr3, ctr4);
      ctr3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "sorrend:"));
      toggleGroup(ctr3, [["weak", "a gyengéket előbb"], ["strong", "az erőseket előbb"], ["overlap", "a kis átfedésűeket előbb"], ["random", "véletlen sorrend"]], order,
        v => { order = v; seq = makeSeq(order, rng(seed)); paint(); });
      const kVal = h("b", { style: "font-family:var(--mono);min-width:2.2em" });
      const kSl = h("input", { type: "range", min: 0, max: 78, step: 1, value: 0, "aria-label": "kivett élek száma", style: "width:11rem;max-width:55vw",
        oninput: () => { k = +kSl.value; paint(); } });
      ctr4.append(h("label", null, "kivett élek:", kSl, kVal), btn("Új sorsolás", () => { seed++; seq = makeSeq(order, rng(seed)); paint(); }));
      const chart = h("div", { style: "margin-top:.3rem" }), info2 = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" }, "A gyenge kötések eltávolítása hamarabb szétszedi a hálózatot: ezek kötik össze a csoportokat.");
      root.append(chart, info2, lesson);

      /* eltávolítási sorrend: élindexek; holtversenyben véletlen sorrend */
      function makeSeq(ord, R) {
        const tie = E.map(() => R()), idx = [...E.keys()];
        const val = i => (ord === "weak" ? E[i].w : ord === "strong" ? -E[i].w : ord === "overlap" ? Math.round(O[i] * 1e9) : 0);
        return idx.sort((i, j) => val(i) - val(j) || tie[i] - tie[j]);
      }
      /* az óriáskomponens mérete 0, 1, …, m kivett élnél */
      function curveOf(s) {
        const out = [];
        for (let t = 0; t <= E.length; t++) { const gone = new Set(s.slice(0, t)); out.push(giant(n, E.filter((_, i) => !gone.has(i)))); }
        return out;
      }
      function avgCurve(ord, runs = 50) {
        const R = rng(2007), acc = new Array(E.length + 1).fill(0);
        for (let r = 0; r < runs; r++) curveOf(makeSeq(ord, R)).forEach((g, t) => (acc[t] += g / runs));
        return acc;
      }
      function load() {
        G = preset(key, aspect);
        n = G.nodes.length;
        E = G.edges.map((e, i) => ({ a: e.a, b: e.b, w: e.w, id: i }));
        O = overlapE(n, E);
        const kar = key === "karate";
        view.o.radius = kar ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
        view.o.showWeights = !kar;
        view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.03 + nd.x * 0.94 : nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub })), []);
        kSl.max = E.length; k = Math.min(k, E.length); kSl.value = k;
        selE = -1; seed = 1;
        seq = makeSeq(order, rng(seed));
        curves = { weak: avgCurve("weak"), strong: avgCurve("strong"), overlap: avgCurve("overlap"), random: avgCurve("random") };
        stats();
        paint();
      }
      let statHTML = "";
      function stats() {
        const w = E.map(e => e.w), rho = spearman(w, O), pr = pearson(w, O);
        const bridges = O.filter(o => o === 0).length;
        let s = `Súly és átfedés: Spearman-féle rangkorreláció $\\rho = ${fmM(rho, 2)}$ (Pearson ${fmtS(pr, 2)})` +
          (rho > 0.2 ? " – az erős kötések körül több a közös ismerős." : ".");
        if (key === "karate") {
          const club = G.club, cross = E.map((e, i) => i).filter(i => club[E[i].a] !== club[E[i].b]), inn = E.map((e, i) => i).filter(i => club[E[i].a] === club[E[i].b]);
          const mw = ix => mean(ix.map(i => E[i].w)), mo = ix => mean(ix.map(i => O[i]));
          s += `<br>A két klub közti ${cross.length} él átlagos súlya <b>${fmt(mw(cross), 2)}</b>, a klubon belüli ${inn.length} élé <b>${fmt(mw(inn), 2)}</b>.` +
            `<br>Átlagos átfedés: <b>${fmt(mo(cross), 3)}</b> (klubok közti) vs. <b>${fmt(mo(inn), 3)}</b> (klubon belüli).`;
        }
        s += `<br>Helyi híd ($O = 0$): <b>${bridges}</b> él` + (bridges ? " (szaggatott)." : " – itt minden élnek van közös szomszédja.");
        statHTML = s;
      }
      const L = i => view.nodes[i].label;
      function paint() {
        const kar = key === "karate";
        kVal.textContent = k;
        const gone = new Set(seq.slice(0, k)), rest = E.filter((_, i) => !gone.has(i));
        const comp = components(n, rest), sz = {};
        comp.comp.forEach(c => (sz[c] = (sz[c] || 0) + 1));
        const big = Math.max(...Object.values(sz)), bigC = +Object.keys(sz).find(c => sz[c] === big);
        const maxW = Math.max(...E.map(e => e.w));
        view.nodes.forEach((nd, i) => {
          const inG = comp.comp[i] === bigC;
          nd.color = !inG ? mixColor("--card", "--muted", 0.55) : kar ? mixColor("--card", G.club[i] ? "--setB" : "--setA", 0.38) : null;
          nd.ink = nd.color ? inkOf(nd.color) : null;
        });
        view.edges = rest.map(e => {
          const i = e.id, t = colorBy === "w" ? (maxW > 1 ? (e.w - 1) / (maxW - 1) : 1) : O[i];
          const on = i === selE;
          return { a: e.a, b: e.b, w: e.w, id: i, width: (kar ? 0.9 + 0.75 * e.w : 1.5 + 1.6 * e.w) + (on ? 1.5 : 0),
            color: on ? "--bad" : mixColor("--border", colorBy === "w" ? "--accent" : "--setC", 0.2 + 0.8 * t),
            dash: O[i] === 0 ? [6, 4] : null, label: kar ? null : (colorBy === "w" ? String(e.w) : fmt(O[i], 2)) };
        });
        view.hl = new Set(selE >= 0 && !gone.has(selE) ? [E[selE].a, E[selE].b] : []);
        view.draw();
        legend.innerHTML = (colorBy === "w" ? `élszín: <span style="color:var(--accent)">sötétebb = nagyobb súly</span>` : `élszín: <span style="color:var(--setC)">sötétebb = nagyobb átfedés</span>`) +
          (kar ? ` · csúcsok: <span style="color:var(--setA)">●</span> Mr. Hi klubja, <span style="color:var(--setB)">●</span> az elnök (John A.) klubja` : "") +
          (k ? " · szürke csúcs: leszakadt az óriáskomponensről" : "");
        let s = statHTML;
        if (selE >= 0) {
          const e = E[selE], S = nbrSets(n, E), cm = [...S[e.a]].filter(x => x !== e.b && S[e.b].has(x));
          const un = new Set([...S[e.a], ...S[e.b]]); un.delete(e.a); un.delete(e.b);
          s += `<br><b>${L(e.a)}–${L(e.b)}</b>: súly ${e.w}, közös szomszéd ${cm.length} (${cm.map(L).join(", ") || "nincs"}), ` +
            `$O = ${cm.length}/${un.size} = ${fmM(O[selE], 2)}$` + (O[selE] === 0 ? " – helyi híd" : "") +
            (kar && G.club[e.a] !== G.club[e.b] ? " · a két klub között fut" : "") + (gone.has(selE) ? " · <i>már kivetted</i>" : "");
        }
        info.innerHTML = s;
        math(info);
        chart.innerHTML = lineChart(big);
        const ON = { weak: "a gyengéket előbb", strong: "az erőseket előbb", overlap: "a kis átfedésűeket előbb", random: "véletlen sorrend" };
        info2.innerHTML = `Sorrend: <b>${ON[order]}</b> · kivett élek: <b>${k}</b> / ${E.length} · óriáskomponens: <b>${big}</b> csúcs · komponensek: ${comp.sizes.length}` +
          `<br>Átlag 50 sorsolásból ${k} kivett élnél: gyengéket előbb ${fmt(curves.weak[k], 1)}, erőseket előbb ${fmt(curves.strong[k], 1)}` +
          (order === "overlap" || order === "random" ? `, ${ON[order]} ${fmt(curves[order][k], 1)}` : "") + ".";
      }
      function lineChart(cur) {
        const Wd = narrow ? 360 : 560, Ht = narrow ? 240 : 250, Lm = 40, R = 12, T = 12, B = 34, m = E.length;
        const X = t => Lm + t / m * (Wd - Lm - R), Y = y => Ht - B - y / n * (Ht - T - B);
        let g = "";
        const xstep = m > 40 ? 10 : m > 15 ? 5 : 1, ystep = n > 20 ? 5 : 1;
        for (let t = 0; t <= m; t += xstep) g += `<line x1="${X(t)}" y1="${T}" x2="${X(t)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${X(t)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${t}</text>`;
        for (let y = 0; y <= n; y += ystep) g += `<line x1="${Lm}" y1="${Y(y)}" x2="${Wd - R}" y2="${Y(y)}" stroke="${sv("--border")}" stroke-width="0.6"/><text x="${Lm - 5}" y="${Y(y) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${y}</text>`;
        g += `<text x="${(Lm + Wd - R) / 2}" y="${Ht - 5}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kivett élek száma</text>` +
          `<text x="11" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(T + Ht - B) / 2})">óriáskomponens (csúcs)</text>`;
        const line = (c, col, dash, name) => `<polyline data-curve="${name}" data-v="${c.map(v => v.toFixed(2)).join(" ")}" points="${c.map((v, t) => X(t) + "," + Y(v)).join(" ")}" fill="none" stroke="${sv(col)}" stroke-width="2.4"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
        g += line(curves.weak, "--setA", "", "weak") + line(curves.strong, "--setB", "", "strong");
        if (order === "overlap") g += line(curves.overlap, "--setC", "6 4", "overlap");
        if (order === "random") g += line(curves.random, "--muted", "6 4", "random");
        g += `<line x1="${X(k)}" y1="${T}" x2="${X(k)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="1" stroke-dasharray="3 3"/>` +
          `<circle cx="${X(k)}" cy="${Y(cur)}" r="5.5" fill="${sv("--bad")}" stroke="${sv("--card")}" stroke-width="2"/>`;
        const lx = Wd - R - 6;
        g += `<text x="${lx}" y="${T + 14}" text-anchor="end" font-size="11" fill="${sv("--setA")}" font-weight="600">— a gyengéket előbb</text>` +
          `<text x="${lx}" y="${T + 29}" text-anchor="end" font-size="11" fill="${sv("--setB")}" font-weight="600">— az erőseket előbb</text>` +
          (order === "overlap" ? `<text x="${lx}" y="${T + 44}" text-anchor="end" font-size="11" fill="${sv("--setC")}" font-weight="600">- - a kis átfedésűeket előbb</text>` : "") +
          (order === "random" ? `<text x="${lx}" y="${T + 44}" text-anchor="end" font-size="11" fill="${sv("--muted")}" font-weight="600">- - véletlen sorrend</text>` : "") +
          `<text x="${lx}" y="${T + (order === "overlap" || order === "random" ? 59 : 44)}" text-anchor="end" font-size="11" fill="${sv("--bad")}">● a mostani sorsolás</text>`;
        return svgEl(Wd, Ht, g, "az óriáskomponens mérete a kivett élek függvényében") +
          `<div class="muted" style="font-size:.8rem">a görbék 50 véletlen holtverseny-feloldás átlagai (rögzített maggal)</div>`;
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       6.5  motif-census – háromszögek a nullmodellhez képest; előrecsatolt hurok
       ------------------------------------------------------------------ */
    W["motif-census"] = root => {
      header(root, "Motívumok: sok-e a háromszög – és mihez képest?",
        "(a) Számold meg a háromszögeket, és vesd össze 500 véletlen gráffal: a nullmodell vagy csak a csúcs- és élszámot tartja meg ($G(n, m)$), " +
        "vagy minden csúcs fokszámát is (fokszámtartó átkötés). (b) Irányított gráfban az <b>előrecsatolt hurok</b> ($a\\to b$, $b\\to c$, $a\\to c$) a jellegzetes háromszereplős minta.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const ctrT = h("div", { class: "controls" });
      root.append(ctrT);
      const pa = h("div"), pb = h("div");
      root.append(pa, pb);
      toggleGroup(ctrT, [["u", "(a) Irányítatlan: háromszögek"], ["d", "(b) Irányított: előrecsatolt hurok"]], "u", v => {
        pa.style.display = v === "u" ? "" : "none"; pb.style.display = v === "d" ? "" : "none";
        (v === "u" ? va : vb).resize();
      });
      pb.style.display = "none";

      /* ---------- (a) ---------- */
      const aspectA = narrow ? 0.8 : 0.5;
      const cA = h("div", { class: "controls" }), cA2 = h("div", { class: "controls" });
      pa.append(cA);
      let keyA = "arviz", nullM = "gnm", obs = null, samples = null, runTok = 0, seedA = 1;
      toggleGroup(cA, [["arviz", "Árvízhét"], ["karate", "karateklub"], ["kite", "sárkány"], ["bowtie", "csokornyakkendő"], ["empty", "saját (üres)"]], keyA, v => { keyA = v; loadA(); });
      const boxA = h("div");
      const infoA = h("div", { class: "readout" });
      pa.append(boxA, infoA, cA2);
      const va = new GK.View(boxA, { aspect: aspectA, editable: true, maxNodes: 12, radius: narrow ? 14 : 16, nodes: [], edges: [],
        onChange: () => { invalidate(); countA(); } });
      cA2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "nullmodell:"));
      toggleGroup(cA2, [["gnm", "véletlen gráf G(n, m)"], ["rew", "fokszámtartó átkötés"]], nullM, v => { nullM = v; invalidate(); paintHist(); });
      const runB = btn("500 véletlen gráf", () => runNull(), "btn primary"), prog = h("span", { class: "muted", style: "font-size:.9rem;font-family:var(--mono)" });
      cA2.append(runB, prog);
      const hist = h("div"), infoH = h("div", { class: "readout" });
      const lessonA = h("p", { style: "margin:.5rem 0 0;font-weight:600;display:none" },
        "Ugyanaz a háromszögszám az egyik nullmodellhez képest kiugró, a másikhoz képest alig – a »sok« mindig valamihez képest sok.");
      pa.append(hist, infoH, lessonA);
      const done = { gnm: false, rew: false };

      function loadA() {
        let G = keyA === "empty" ? { nodes: [], edges: [] } : preset(keyA, aspectA);
        va.o.editable = keyA !== "karate";
        va.o.radius = keyA === "karate" ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
        va.o.maxNodes = Math.max(12, G.nodes.length);
        va.setGraph(G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.sub ? liftY(nd.y) : nd.y, sub: nd.sub })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        done.gnm = done.rew = false;
        invalidate(); countA();
      }
      function invalidate() { runTok++; samples = null; prog.textContent = ""; runB.disabled = false; paintHist(); }
      function countA() {
        const n = va.nodes.length, E = va.edges.filter(e => e.a !== e.b), T = triangles(n, E), S = clusteringStats(n, E);
        obs = { n, m: E.length, tri: S.tri, wedges: S.wedges, triples: S.triples, trans: S.trans, list: T.list };
        va.hlE = new Set(); T.list.forEach(([i, j, k]) => [[i, j], [j, k], [i, k]].forEach(([x, y]) => va.hlE.add(GK.edgeKey(x, y))));
        va.nodes.forEach((nd, i) => (nd.badge = keyA === "karate" ? null : T.per[i] || null));
        va.draw();
        infoA.innerHTML = `$n = ${n}$, $m = ${obs.m}$ · háromszög: <b>${obs.tri}</b> · nyitott hármas (ék): <b>${obs.wedges}</b> · ` +
          `tranzitivitás: $\\dfrac{3\\cdot ${obs.tri}}{3\\cdot ${obs.tri} + ${obs.wedges}} = ${obs.triples ? fmM(obs.trans, 3) : "\\text{--}"}$` +
          `<br><span class="muted">Kiemelve: a háromszögek élei; a szám a csúcs mellett: hány háromszögben van.</span>`;
        math(infoA);
      }
      function runNull() {
        if (!obs || obs.m < 2) { infoH.innerHTML = "Ehhez legalább 2 él kell."; return; }
        const tok = ++runTok, R = rng(1000 * seedA++ + (nullM === "gnm" ? 1 : 2)), n = obs.n, m = obs.m;
        const E = va.edges.filter(e => e.a !== e.b).map(e => ({ a: e.a, b: e.b, w: 1 })), N = 500, out = [];
        runB.disabled = true;
        const batch = () => {
          if (tok !== runTok) return;
          const t0 = performance.now();
          while (out.length < N && performance.now() - t0 < 25) {
            const G = nullM === "gnm" ? gnm(n, m, R) : rewire(n, E, 10 * m, R);
            out.push(triangles(n, G).list.length);
          }
          prog.textContent = `${out.length} / ${N}`;
          if (out.length < N) setTimeout(batch, 0);
          else { samples = out; done[nullM] = true; runB.disabled = false; prog.textContent = "kész: 500 / 500"; paintHist(); }
        };
        prog.textContent = `0 / ${N}`;
        setTimeout(batch, 0);
      }
      function paintHist() {
        lessonA.style.display = done.gnm && done.rew && (keyA === "arviz" || keyA === "karate") ? "" : "none";
        if (!samples) {
          hist.innerHTML = "";
          infoH.innerHTML = `Nullmodell: <b>${nullM === "gnm" ? "véletlen gráf G(n, m)" : "fokszámtartó átkötés (10·m élcsere-kísérlet)"}</b>. ` +
            "Nyomd meg az „500 véletlen gráf” gombot!";
          return;
        }
        const mu = mean(samples), sd = sdev(samples), z = sd > 0 ? (obs.tri - mu) / sd : NaN, p = samples.filter(x => x >= obs.tri).length / samples.length;
        const lo = Math.min(...samples, obs.tri), hi = Math.max(...samples, obs.tri);
        const cnt = new Array(hi - lo + 1).fill(0); samples.forEach(x => cnt[x - lo]++);
        const Wd = narrow ? 360 : 560, Ht = 210, Lm = 38, R = 12, T = 22, B = 32, cmax = Math.max(...cnt);
        const X = v => Lm + (v - lo + 0.5) / (hi - lo + 1) * (Wd - Lm - R), bw = (Wd - Lm - R) / (hi - lo + 1), Y = c => Ht - B - c / cmax * (Ht - T - B);
        let g = "";
        cnt.forEach((c, i) => { if (c) g += `<rect x="${X(lo + i) - bw * 0.42}" y="${Y(c)}" width="${bw * 0.84}" height="${Ht - B - Y(c)}" fill="${sv("--setA")}" fill-opacity="0.75"><title>${lo + i} háromszög: ${c} gráf</title></rect>`; });
        const xstep = Math.max(1, Math.ceil((hi - lo + 1) / 14));
        for (let v = lo; v <= hi; v += xstep) g += `<text x="${X(v)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${v}</text>`;
        g += `<line x1="${Lm}" y1="${Ht - B}" x2="${Wd - R}" y2="${Ht - B}" stroke="${sv("--border")}"/>`;
        for (let c = 0; c <= cmax; c += Math.max(1, Math.ceil(cmax / 4 / 10) * 10)) g += `<text x="${Lm - 5}" y="${Y(c) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${c}</text>`;
        g += `<line x1="${X(obs.tri)}" y1="${T - 8}" x2="${X(obs.tri)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="2.5"/>` +
          `<text x="${Math.min(X(obs.tri) + 5, Wd - R - 60)}" y="${T - 10 + 10}" font-size="11" font-weight="600" fill="${sv("--bad")}">megfigyelt: ${obs.tri}</text>` +
          `<text x="${(Lm + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">háromszögek száma a véletlen gráfban</text>`;
        hist.innerHTML = svgEl(Wd, Ht, g, "hisztogram: háromszögek a véletlen gráfokban");
        infoH.innerHTML = `Nullmodell: <b>${nullM === "gnm" ? "G(n, m)" : "fokszámtartó átkötés"}</b>, 500 gráf · átlag: <b>${fmt(mu, 2)}</b> · szórás: <b>${fmt(sd, 2)}</b>` +
          `<br>$z = \\dfrac{${obs.tri} - ${fmM(mu, 2)}}{${fmM(sd, 2)}} = ${isFinite(z) ? fmM(z, 2) : "\\text{--}"}$ · legalább ${obs.tri} háromszög: ${fmt(100 * p, 1)}% (empirikus $p = ${fmM(p, 3)}$)` +
          `<br>` + (!isFinite(z) ? "A nullmodell mindig ugyanannyi háromszöget ad: nincs szórás." :
            z > 2 ? "<b>Kiugró:</b> ennyi háromszög ebben a nullmodellben ritka." : z > 1 ? "Valamivel több a vártnál, de nem kiugró." : "Nem kiugró: a véletlen gráfokban is gyakori ennyi háromszög.");
        math(infoH);
      }

      /* ---------- (b) ---------- */
      const aspectB = narrow ? 0.75 : 0.42;
      const cB = h("div", { class: "controls" });
      pb.append(cB);
      let keyB = "papers", selF = -1, FFL = [], CYC = [];
      toggleGroup(cB, [["papers", "lapok átvételei"], ["papers2", "+ NY→RH"], ["cyc", "kör"], ["empty", "üres"]], keyB, v => { keyB = v; loadB(); });
      pb.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.2rem 0" },
        "Szerkesztés: kattints előbb a kiinduló, aztán a cél csúcsra (él be/ki); élre kattintva törlés; üres helyre kattintva új csúcs."));
      const boxB = h("div"), infoB = h("div", { class: "readout" });
      pb.append(boxB, infoB);
      const vb = new GK.View(boxB, { aspect: aspectB, directed: true, editable: true, maxNodes: 8, radius: narrow ? 15 : 17, nodes: [], edges: [],
        onNodeClick: i => {
          if (vb.sel < 0) vb.sel = i;
          else if (vb.sel === i) vb.sel = -1;
          else {
            const j = vb.edges.findIndex(e => e.a === vb.sel && e.b === i);
            if (j >= 0) vb.edges.splice(j, 1); else vb.edges.push({ a: vb.sel, b: i, w: 1 });
            vb.sel = -1; selF = -1; countB(); return;
          }
          vb.draw();
        },
        onChange: () => { selF = -1; countB(); } });
      function loadB() {
        let nodes, edges;
        if (keyB === "papers" || keyB === "papers2") {
          const P = GK.normalize([[0, 0], [1.4, 0], [1.4, 1.1], [0, 1.1]], aspectB), ids = D.papers.map(p => p.id);
          nodes = D.papers.map((p, i) => ({ label: p.id, x: narrow ? 0.06 + P[i][0] * 0.88 : P[i][0], y: liftY(P[i][1]), color: p.color, sub: p.name }));
          const s = "EK>RH,NY>EK,VN>RH,VN>NY" + (keyB === "papers2" ? ",NY>RH" : "");
          edges = s.split(",").map(t => { const [a, b] = t.split(">"); return { a: ids.indexOf(a), b: ids.indexOf(b), w: 1 }; });
        } else if (keyB === "cyc") {
          const P = GK.normalize([[0.5, 0], [1, 0.9], [0, 0.9]], aspectB);
          nodes = ["A", "B", "C"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] }));
          edges = [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 0 }];
        } else { nodes = []; edges = []; }
        vb.setGraph(nodes, edges);
        selF = -1; countB();
      }
      function countB() {
        const n = vb.nodes.length, has = new Set(vb.edges.filter(e => e.a !== e.b).map(e => e.a + ">" + e.b)), A = (x, y) => has.has(x + ">" + y);
        FFL = []; CYC = [];
        for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++) {
          if (a === b || b === c || a === c) continue;
          if (A(a, b) && A(b, c) && A(a, c)) FFL.push([a, b, c]);
          if (a < b && a < c && A(a, b) && A(b, c) && A(c, a)) CYC.push([a, b, c]);
        }
        paintB();
      }
      const LB = i => vb.nodes[i].label;
      function paintB() {
        const f = selF >= 0 ? FFL[selF] : null, on = new Set();
        if (f) [[f[0], f[1]], [f[1], f[2]], [f[0], f[2]]].forEach(([x, y]) => on.add(x + ">" + y));
        vb.edges.forEach(e => { const o = on.has(e.a + ">" + e.b); e.color = o ? "--bad" : null; e.width = o ? 4 : null; });
        vb.hl = new Set(f || []); vb.dim = !!f;
        vb.draw();
        infoB.innerHTML = "";
        infoB.append(h("div", { html: `Előrecsatolt hurok (FFL): <b>${FFL.length}</b> · irányított 3-kör: <b>${CYC.length}</b>` }));
        if (FFL.length) {
          const row = h("div", { class: "controls", style: "margin:.4rem 0 .1rem" });
          row.append(h("span", { class: "muted" }, "Kattints egy hurokra:"));
          FFL.forEach(([a, b, c], i) => row.append(btn(`${LB(a)}→${LB(b)}→${LB(c)} és ${LB(a)}→${LB(c)}`, () => { selF = selF === i ? -1 : i; paintB(); }, "btn" + (i === selF ? " on" : ""))));
          infoB.append(row);
        }
        if (CYC.length) infoB.append(h("div", null, "3-kör: " + CYC.map(([a, b, c]) => `${LB(a)}→${LB(b)}→${LB(c)}→${LB(a)}`).join(", ")));
        let s = "";
        if (f) s = `${LB(f[0])} kétféleképpen hat ${LB(f[2])}-re: közvetlenül és ${LB(f[1])}-n keresztül.`;
        else if (keyB === "papers" && !FFL.length && vb.edges.length === 4) s = "Az átvételek láncot alkotnak, de egyik lap sem veszi át egyszerre a forrást és a forrás forrását: nincs előrecsatolt hurok.";
        else if (keyB === "cyc" && CYC.length === 1 && !FFL.length) s = "A kör nem előrecsatolt hurok: itt nincs „kezdő” csúcs, amely mindkét úton hatna.";
        if (s) infoB.append(h("div", { class: "muted", style: "margin-top:.2rem" }, s));
      }

      onTheme(() => { va.draw(); vb.draw(); paintHist(); paintB(); });
      loadA(); loadB();
    };

    /* ------------------------------------------------------------------
       6.6  arvizhet-week – az Árvízhét együttemlítési gráfja napról napra
       ------------------------------------------------------------------ */
    W["arvizhet-week"] = root => {
      header(root, "Árvízhét napról napra: honnan jönnek a háromszögek?",
        "Egy cikk minden szereplőpárja él; a súly az eddigi közös cikkek száma. Az aznap megjelent új élek kiemelve; ha egy új él <b>triadikus zárás</b> " +
        "(a két végpontnak az előző nap végén már volt közös szomszédja), a közös szomszéd is kiemelve.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.5;
      const ids = D.actors.map(a => a.id), days = D.days, ix = id => ids.indexOf(id);
      const ON_ = { Ko: "a Kormányon", Vi: "a Vízügyön", Po: "a Polgármesteren", La: "a Lakókon", "Ön": "az Önkénteseken", Sz: "a Szakértőn", Kl: "a Klímaváltozáson" };
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let t = 0, colorTri = true, timer = null;
      const dVal = h("b", { style: "font-family:var(--mono);min-width:7.5em" });
      const sl = h("input", { type: "range", min: 0, max: days.length - 1, step: 1, value: 0, "aria-label": "nap", style: "width:10rem;max-width:50vw",
        oninput: () => { stop(); t = +sl.value; paint(); } });
      const playB = btn("▶ Lejátszás", () => (timer ? stop() : start()), "btn primary");
      ctr.append(h("label", null, "nap:", sl, dVal), playB);
      const tc = checkbox("háromszögek színezése: gyári vs. összerakott", v => { colorTri = v; paint(); }, true);
      ctr2.append(tc.lab);
      const box = h("div");
      root.append(box);
      /* napi állapotok előre: élek (súly, cikkek), új élek, zárás */
      const S = [];
      {
        const w = {}, arts = {};
        days.forEach((d, di) => {
          const prev = nbrSets(ids.length, Object.keys(w).map(k => { const [a, b] = k.split("-").map(Number); return { a, b }; }));
          const nw = [], inc = [];
          D.articles.filter(a => a.day === d).sort((x, y) => x.id - y.id).forEach(a => {
            const m = a.mentions;
            for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
              const x = ix(m[i]), y = ix(m[j]), k = GK.edgeKey(x, y);
              if (!(k in w)) {
                w[k] = 0; arts[k] = [];
                nw.push({ a: x, b: y, k, art: a.id, common: [...prev[x]].filter(z => prev[y].has(z)) });
              } else if (!nw.some(e => e.k === k) && !inc.includes(k)) inc.push(k);
              w[k]++; arts[k].push(a.id);
            }
          });
          const edges = Object.keys(w).map(k => { const [a, b] = k.split("-").map(Number); return { a, b, w: w[k], k, arts: arts[k].slice() }; });
          const st = clusteringStats(ids.length, edges), tri = triangles(ids.length, edges).list;
          const upto = D.articles.filter(a => days.indexOf(a.day) <= di);
          const tris = tri.map(([i, j, k]) => {
            const f = upto.filter(a => [i, j, k].every(v => a.mentions.includes(ids[v]))).map(a => a.id);
            return { t: [i, j, k], factory: f, parts: [[i, j], [j, k], [i, k]].map(([x, y]) => edges.find(e => e.k === GK.edgeKey(x, y))) };
          });
          S.push({ edges, nw, inc: inc.map(k => ({ k, w: w[k] })), st, tris });
        });
      }
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, draggable: false, showWeights: true, nodes: [], edges: [],
        onDraw: (ctx, v) => {
          if (!colorTri) return;
          ctx.save();
          ctx.globalCompositeOperation = "destination-over";          // a már megrajzolt élek és csúcsok mögé
          S[t].tris.forEach(T => {
            ctx.beginPath();
            T.t.forEach((i, q) => { const [x, y] = v.px(v.nodes[i]); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            ctx.closePath();
            ctx.fillStyle = mixColor("--card", T.factory.length ? "--setB" : "--setA", 0.42);
            ctx.fill();
          });
          ctx.restore();
        } });
      const G0 = preset("arviz", aspect);
      view.setGraph(G0.nodes.map(nd => ({ label: nd.label, x: narrow ? 0.04 + nd.x * 0.92 : nd.x, y: liftY(nd.y), sub: nd.sub })), []);
      const legend = h("div", { class: "muted", style: "font-size:.8rem;margin-top:.2rem" });
      const info = h("div", { class: "readout" }), tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(legend, info, tw);

      const L = i => ids[i], pair = e => `${L(e.a)}–${L(e.b)}`;
      const ord = n => n + ".";
      function triText(T) {
        const nm = T.t.map(L).join("–");
        if (T.factory.length) return `${nm} (<b style="color:var(--setB)">gyári</b>: ${T.factory.map(ord).join("/")} cikk)`;
        const parts = T.parts.slice().sort((x, y) => x.arts[0] - y.arts[0]).map(e => e.arts.map(ord).join("/"));
        return `${nm} (<b style="color:var(--setA)">összerakott</b>: ${parts.slice(0, -1).join(", ")} és ${parts[parts.length - 1]} cikk)`;
      }
      function paint() {
        const s = S[t], d = days[t];
        sl.value = t;
        dVal.textContent = `${d} (${D.dayNames[d]})`;
        const fresh = new Set(s.nw.map(e => e.k)), closers = new Set();
        s.nw.forEach(e => e.common.forEach(c => closers.add(c)));
        view.edges = s.edges.map(e => ({ a: e.a, b: e.b, w: e.w, color: fresh.has(e.k) ? "--accent" : null, width: fresh.has(e.k) ? 2.2 + 1.4 * e.w : 1.4 + 1.2 * e.w }));
        view.hl = closers;
        view.nodes.forEach((nd, i) => {
          nd.color = closers.has(i) ? mixColor("--card", "--accent", 0.25) : null; nd.ink = null;
        });
        view.draw();
        legend.innerHTML = `<span style="color:var(--accent);font-weight:700">━</span> aznap új él · kiemelt csúcs: a zárást adó közös szomszéd · az élen a súly` +
          (colorTri ? ` · <span style="color:var(--setB)">■</span> gyári háromszög (egy cikkben mind a három) · <span style="color:var(--setA)">■</span> összerakott (különböző cikkekből)` : "");
        let r = `<b>${d}:</b> `;
        if (s.nw.length) r += s.nw.map(e => e.common.length ? `${pair(e)} – <b>zárás</b> ${e.common.map(c => ON_[L(c)]).join(" és ")} át` : `${pair(e)}`).join("; ");
        else r += "nincs új él – csak a súlyok nőnek";
        if (s.inc.length) r += `<br>Erősödő élek: ${s.inc.map(x => { const [a, b] = x.k.split("-").map(Number); return `${L(a)}–${L(b)} (${x.w})`; }).join(", ")}`;
        r += `<br>Élszám: <b>${s.edges.length}</b> · háromszög: <b>${s.st.tri}</b> · átlagos klaszterezettség: <b>${fmt(s.st.avg, 2)}</b> · tranzitivitás: <b>${fmt(s.st.trans, 3)}</b>`;
        if (s.tris.length) r += `<br>Háromszögek: ${s.tris.map(triText).join("; ")}`;
        const nf = s.tris.filter(T => T.factory.length).length;
        if (s.tris.length >= 2 && nf) r += `<br><b>${s.tris.length} háromszögből ${nf} egyetlen cikkből jön: az együttemlítési gráf klaszterezettségét a háromszereplős cikkek felfújják.</b>`;
        info.innerHTML = r;
        /* táblázat naponként */
        let tb = `<table style="margin:.4rem 0;font-size:.86rem;width:auto;min-width:100%"><thead><tr><th>nap</th><th>új élek</th><th>m</th><th>${narrow ? "△" : "háromszög"}</th><th>átl. C</th><th>${narrow ? "tranz." : "tranzitivitás"}</th></tr></thead><tbody>`;
        S.forEach((x, i) => {
          const st = i === t ? ' style="background:var(--accent-soft);font-weight:700"' : i > t ? ' style="opacity:.45"' : "";
          tb += `<tr${st}><td>${days[i]}</td><td>${x.nw.length ? x.nw.map(e => `<span style="white-space:nowrap">${pair(e)}${e.common.length ? "*" : ""}</span>`).join(", ") : "–"}</td><td>${x.edges.length}</td><td>${x.st.tri}</td>` +
            `<td style="font-family:var(--mono)">${fmt(x.st.avg, 2)}</td><td style="font-family:var(--mono)">${x.st.triples ? fmt(x.st.trans, 3) : "–"}</td></tr>`;
        });
        tw.innerHTML = tb + `</tbody></table><div class="muted" style="font-size:.8rem">* triadikus zárás${narrow ? " · △: háromszögek száma" : ""} · átl. C: mind a 7 csúcs átlaga (a 2-nél kisebb fokú csúcs 0)</div>`;
        tight(tw);
      }
      function start() {
        if (t >= days.length - 1) t = 0;
        paint();
        playB.textContent = "⏸ Megállít";
        timer = setInterval(() => { if (t >= days.length - 1) { stop(); return; } t++; paint(); }, 1300);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; playB.textContent = "▶ Lejátszás"; }
      autoStop(root, stop);
      onTheme(paint);
      paint();
    };
  }
